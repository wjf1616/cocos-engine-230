
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/webgl/assemblers/mask-assembler.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.MaskAssembler = void 0;

var _assembler = _interopRequireDefault(require("../../assembler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Mask = require('../../../components/CCMask');

var RenderFlow = require('../../render-flow');

var SimpleSpriteAssembler = require('./sprite/2d/simple');

var GraphicsAssembler = require('./graphics');

var gfx = require('../../../../renderer/gfx');

var vfmtPos = require('../vertex-format').vfmtPos; // todo: 8 is least Stencil depth supported by webGL device, it could be adjusted to vendor implementation value


var _maxLevel = 8; // Current mask

var _maskStack = [];

function getWriteMask() {
  return 0x01 << _maskStack.length - 1;
}

function getStencilRef() {
  var result = 0;

  for (var i = 0; i < _maskStack.length; ++i) {
    result += 0x01 << i;
  }

  return result;
}

function applyStencil(material, func, failOp, ref, stencilMask, writeMask) {
  var effect = material.effect;
  var zFailOp = gfx.STENCIL_OP_KEEP,
      zPassOp = gfx.STENCIL_OP_KEEP;
  effect.setStencil(gfx.STENCIL_ENABLE, func, ref, stencilMask, failOp, zFailOp, zPassOp, writeMask);
}

function pushMask(mask) {
  if (_maskStack.length + 1 > _maxLevel) {
    cc.errorID(9000, _maxLevel);
  }

  _maskStack.push(mask);
}

function exitMask(mask, renderer) {
  if (_maskStack.length === 0) {
    cc.errorID(9001);
  }

  _maskStack.pop();

  if (_maskStack.length === 0) {
    renderer._flushMaterial(mask._exitMaterial);
  } else {
    enableMask(renderer);
  }
}

function applyClearMask(mask, renderer) {
  var func = gfx.DS_FUNC_NEVER;
  var ref = getWriteMask();
  var stencilMask = ref;
  var writeMask = ref;
  var failOp = mask.inverted ? gfx.STENCIL_OP_REPLACE : gfx.STENCIL_OP_ZERO;
  applyStencil(mask._clearMaterial, func, failOp, ref, stencilMask, writeMask);
  var buffer = renderer.getBuffer('mesh', vfmtPos);
  var offsetInfo = buffer.request(4, 6);
  var indiceOffset = offsetInfo.indiceOffset,
      vertexOffset = offsetInfo.byteOffset >> 2,
      vertexId = offsetInfo.vertexOffset,
      vbuf = buffer._vData,
      ibuf = buffer._iData;
  vbuf[vertexOffset++] = -1;
  vbuf[vertexOffset++] = -1;
  vbuf[vertexOffset++] = -1;
  vbuf[vertexOffset++] = 1;
  vbuf[vertexOffset++] = 1;
  vbuf[vertexOffset++] = 1;
  vbuf[vertexOffset++] = 1;
  vbuf[vertexOffset++] = -1;
  ibuf[indiceOffset++] = vertexId;
  ibuf[indiceOffset++] = vertexId + 3;
  ibuf[indiceOffset++] = vertexId + 1;
  ibuf[indiceOffset++] = vertexId + 1;
  ibuf[indiceOffset++] = vertexId + 3;
  ibuf[indiceOffset++] = vertexId + 2;
  renderer.node = renderer._dummyNode;
  renderer.material = mask._clearMaterial;

  renderer._flush();
}

function applyAreaMask(mask, renderer) {
  var func = gfx.DS_FUNC_NEVER;
  var ref = getWriteMask();
  var stencilMask = ref;
  var writeMask = ref;
  var failOp = mask.inverted ? gfx.STENCIL_OP_ZERO : gfx.STENCIL_OP_REPLACE;
  applyStencil(mask._materials[0], func, failOp, ref, stencilMask, writeMask); // vertex buffer

  renderer.material = mask._materials[0];

  if (mask._type === Mask.Type.IMAGE_STENCIL) {
    renderer.node = renderer._dummyNode;
    SimpleSpriteAssembler.prototype.fillBuffers.call(mask._assembler, mask, renderer);

    renderer._flush();
  } else {
    renderer.node = mask.node;
    GraphicsAssembler.prototype.fillBuffers.call(mask._graphics._assembler, mask._graphics, renderer);
  }
}

function enableMask(renderer) {
  var func = gfx.DS_FUNC_EQUAL;
  var failOp = gfx.STENCIL_OP_KEEP;
  var ref = getStencilRef();
  var stencilMask = ref;
  var writeMask = getWriteMask();
  var mask = _maskStack[_maskStack.length - 1];
  applyStencil(mask._enableMaterial, func, failOp, ref, stencilMask, writeMask);

  renderer._flushMaterial(mask._enableMaterial);
}

var MaskAssembler =
/*#__PURE__*/
function (_SimpleSpriteAssemble) {
  _inheritsLoose(MaskAssembler, _SimpleSpriteAssemble);

  function MaskAssembler() {
    return _SimpleSpriteAssemble.apply(this, arguments) || this;
  }

  var _proto = MaskAssembler.prototype;

  _proto.updateRenderData = function updateRenderData(mask) {
    if (mask._type === Mask.Type.IMAGE_STENCIL) {
      if (mask.spriteFrame) {
        SimpleSpriteAssembler.prototype.updateRenderData.call(this, mask);
      } else {
        mask.setMaterial(0, null);
      }
    } else {
      mask._graphics.setMaterial(0, mask._materials[0]);

      GraphicsAssembler.prototype.updateRenderData.call(mask._graphics._assembler, mask._graphics, mask._graphics);
    }
  };

  _proto.fillBuffers = function fillBuffers(mask, renderer) {
    // Invalid state
    if (mask._type !== Mask.Type.IMAGE_STENCIL || mask.spriteFrame) {
      // HACK: Must push mask after batch, so we can only put this logic in fillVertexBuffer or fillIndexBuffer
      pushMask(mask);
      applyClearMask(mask, renderer);
      applyAreaMask(mask, renderer);
      enableMask(renderer);
    }

    mask.node._renderFlag |= RenderFlow.FLAG_UPDATE_RENDER_DATA;
  };

  _proto.postFillBuffers = function postFillBuffers(mask, renderer) {
    // Invalid state
    if (mask._type !== Mask.Type.IMAGE_STENCIL || mask.spriteFrame) {
      // HACK: Must pop mask after batch, so we can only put this logic in fillBuffers
      exitMask(mask, renderer);
    }

    mask.node._renderFlag |= RenderFlow.FLAG_UPDATE_RENDER_DATA;
  };

  return MaskAssembler;
}(SimpleSpriteAssembler);

exports.MaskAssembler = MaskAssembler;
;

_assembler["default"].register(Mask, MaskAssembler);
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_engine__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hc2stYXNzZW1ibGVyLmpzIl0sIm5hbWVzIjpbIk1hc2siLCJyZXF1aXJlIiwiUmVuZGVyRmxvdyIsIlNpbXBsZVNwcml0ZUFzc2VtYmxlciIsIkdyYXBoaWNzQXNzZW1ibGVyIiwiZ2Z4IiwidmZtdFBvcyIsIl9tYXhMZXZlbCIsIl9tYXNrU3RhY2siLCJnZXRXcml0ZU1hc2siLCJsZW5ndGgiLCJnZXRTdGVuY2lsUmVmIiwicmVzdWx0IiwiaSIsImFwcGx5U3RlbmNpbCIsIm1hdGVyaWFsIiwiZnVuYyIsImZhaWxPcCIsInJlZiIsInN0ZW5jaWxNYXNrIiwid3JpdGVNYXNrIiwiZWZmZWN0IiwiekZhaWxPcCIsIlNURU5DSUxfT1BfS0VFUCIsInpQYXNzT3AiLCJzZXRTdGVuY2lsIiwiU1RFTkNJTF9FTkFCTEUiLCJwdXNoTWFzayIsIm1hc2siLCJjYyIsImVycm9ySUQiLCJwdXNoIiwiZXhpdE1hc2siLCJyZW5kZXJlciIsInBvcCIsIl9mbHVzaE1hdGVyaWFsIiwiX2V4aXRNYXRlcmlhbCIsImVuYWJsZU1hc2siLCJhcHBseUNsZWFyTWFzayIsIkRTX0ZVTkNfTkVWRVIiLCJpbnZlcnRlZCIsIlNURU5DSUxfT1BfUkVQTEFDRSIsIlNURU5DSUxfT1BfWkVSTyIsIl9jbGVhck1hdGVyaWFsIiwiYnVmZmVyIiwiZ2V0QnVmZmVyIiwib2Zmc2V0SW5mbyIsInJlcXVlc3QiLCJpbmRpY2VPZmZzZXQiLCJ2ZXJ0ZXhPZmZzZXQiLCJieXRlT2Zmc2V0IiwidmVydGV4SWQiLCJ2YnVmIiwiX3ZEYXRhIiwiaWJ1ZiIsIl9pRGF0YSIsIm5vZGUiLCJfZHVtbXlOb2RlIiwiX2ZsdXNoIiwiYXBwbHlBcmVhTWFzayIsIl9tYXRlcmlhbHMiLCJfdHlwZSIsIlR5cGUiLCJJTUFHRV9TVEVOQ0lMIiwicHJvdG90eXBlIiwiZmlsbEJ1ZmZlcnMiLCJjYWxsIiwiX2Fzc2VtYmxlciIsIl9ncmFwaGljcyIsIkRTX0ZVTkNfRVFVQUwiLCJfZW5hYmxlTWF0ZXJpYWwiLCJNYXNrQXNzZW1ibGVyIiwidXBkYXRlUmVuZGVyRGF0YSIsInNwcml0ZUZyYW1lIiwic2V0TWF0ZXJpYWwiLCJfcmVuZGVyRmxhZyIsIkZMQUdfVVBEQVRFX1JFTkRFUl9EQVRBIiwicG9zdEZpbGxCdWZmZXJzIiwiQXNzZW1ibGVyIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkE7Ozs7OztBQUVBLElBQU1BLElBQUksR0FBR0MsT0FBTyxDQUFDLDRCQUFELENBQXBCOztBQUNBLElBQU1DLFVBQVUsR0FBR0QsT0FBTyxDQUFDLG1CQUFELENBQTFCOztBQUNBLElBQU1FLHFCQUFxQixHQUFHRixPQUFPLENBQUMsb0JBQUQsQ0FBckM7O0FBQ0EsSUFBTUcsaUJBQWlCLEdBQUdILE9BQU8sQ0FBQyxZQUFELENBQWpDOztBQUNBLElBQU1JLEdBQUcsR0FBR0osT0FBTyxDQUFDLDBCQUFELENBQW5COztBQUNBLElBQU1LLE9BQU8sR0FBR0wsT0FBTyxDQUFDLGtCQUFELENBQVAsQ0FBNEJLLE9BQTVDLEVBRUE7OztBQUNBLElBQUlDLFNBQVMsR0FBRyxDQUFoQixFQUNBOztBQUNBLElBQUlDLFVBQVUsR0FBRyxFQUFqQjs7QUFFQSxTQUFTQyxZQUFULEdBQXlCO0FBQ3JCLFNBQU8sUUFBU0QsVUFBVSxDQUFDRSxNQUFYLEdBQW9CLENBQXBDO0FBQ0g7O0FBRUQsU0FBU0MsYUFBVCxHQUEwQjtBQUN0QixNQUFJQyxNQUFNLEdBQUcsQ0FBYjs7QUFDQSxPQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdMLFVBQVUsQ0FBQ0UsTUFBL0IsRUFBdUMsRUFBRUcsQ0FBekMsRUFBNEM7QUFDeENELElBQUFBLE1BQU0sSUFBSyxRQUFRQyxDQUFuQjtBQUNIOztBQUNELFNBQU9ELE1BQVA7QUFDSDs7QUFFRCxTQUFTRSxZQUFULENBQXVCQyxRQUF2QixFQUFpQ0MsSUFBakMsRUFBdUNDLE1BQXZDLEVBQStDQyxHQUEvQyxFQUFvREMsV0FBcEQsRUFBaUVDLFNB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QUFtQkssUUFBbkIsRUFBNkI7QUFDekI7QUFDQSxRQUFJTCxJQUFJLENBQUNpQyxLQUFMLEtBQWU3RCxJQUFJLENBQUM4RCxJQUFMLENBQVVDLGFBQXpCLElBQTBDbkMsSUFBSSxDQUFDNkMsV0FBbkQsRUFBZ0U7QUFDNUQ7QUFDQTlDLE1BQUFBLFFBQVEsQ0FBQ0MsSUFBRCxDQUFSO0FBRUFVLE1BQUFBLGNBQWMsQ0FBQ1YsSUFBRCxFQUFPSyxRQUFQLENBQWQ7QUFDQTBCLE1BQUFBLGFBQWEsQ0FBQy9CLElBQUQsRUFBT0ssUUFBUCxDQUFiO0FBRUFJLE1BQUFBLFVBQVUsQ0FBQ0osUUFBRCxDQUFWO0FBQ0g7O0FBRURMLElBQUFBLElBQUksQ0FBQzRCLElBQUwsQ0FBVW1CLFdBQVYsSUFBeUJ6RSxVQUFVLENBQUMwRSx1QkFBcEM7QUFDSDs7U0FFREMsa0JBQUEseUJBQWlCakQsSUFBakIsRUFBdUJLLFFBQXZCLEVBQWlDO0FBQzdCO0FBQ0EsUUFBSUwsSUFBSSxDQUFDaUMsS0FBTCxLQUFlN0QsSUFBSSxDQUFDOEQsSUFBTCxDQUFVQyxhQUF6QixJQUEwQ25DLElBQUksQ0FBQzZDLFdBQW5ELEVBQWdFO0FBQzVEO0FBQ0F6QyxNQUFBQSxRQUFRLENBQUNKLElBQUQsRUFBT0ssUUFBUCxDQUFSO0FBQ0g7O0FBRURMLElBQUFBLElBQUksQ0FBQzRCLElBQUwsQ0FBVW1CLFdBQVYsSUFBeUJ6RSxVQUFVLENBQUMwRSx1QkFBcEM7QUFDSDs7O0VBdkMrQnpFOzs7QUF3Q25DOztBQUVEMkUsc0JBQVVDLFFBQVYsQ0FBbUIvRSxJQUFuQixFQUF5QnVFLGFBQXpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IEFzc2VtYmxlciBmcm9tICcuLi8uLi9hc3NlbWJsZXInO1xuXG5jb25zdCBNYXNrID0gcmVxdWlyZSgnLi4vLi4vLi4vY29tcG9uZW50cy9DQ01hc2snKTtcbmNvbnN0IFJlbmRlckZsb3cgPSByZXF1aXJlKCcuLi8uLi9yZW5kZXItZmxvdycpO1xuY29uc3QgU2ltcGxlU3ByaXRlQXNzZW1ibGVyID0gcmVxdWlyZSgnLi9zcHJpdGUvMmQvc2ltcGxlJyk7XG5jb25zdCBHcmFwaGljc0Fzc2VtYmxlciA9IHJlcXVpcmUoJy4vZ3JhcGhpY3MnKTtcbmNvbnN0IGdmeCA9IHJlcXVpcmUoJy4uLy4uLy4uLy4uL3JlbmRlcmVyL2dmeCcpO1xuY29uc3QgdmZtdFBvcyA9IHJlcXVpcmUoJy4uL3ZlcnRleC1mb3JtYXQnKS52Zm10UG9zO1xuXG4vLyB0b2RvOiA4IGlzIGxlYXN0IFN0ZW5jaWwgZGVwdGggc3VwcG9ydGVkIGJ5IHdlYkdMIGRldmljZSwgaXQgY291bGQgYmUgYWRqdXN0ZWQgdG8gdmVuZG9yIGltcGxlbWVudGF0aW9uIHZhbHVlXG5sZXQgX21heExldmVsID0gODtcbi8vIEN1cnJlbnQgbWFza1xubGV0IF9tYXNrU3RhY2sgPSBbXTtcblxuZnVuY3Rpb24gZ2V0V3JpdGVNYXNrICgpIHtcbiAgICByZXR1cm4gMHgwMSA8PCAoX21hc2tTdGFjay5sZW5ndGggLSAxKTtcbn1cblxuZnVuY3Rpb24gZ2V0U3RlbmNpbFJlZiAoKSB7XG4gICAgbGV0IHJlc3VsdCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBfbWFza1N0YWNrLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHJlc3VsdCArPSAoMHgwMSA8PCBpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gYXBwbHlTdGVuY2lsIChtYXRlcmlhbCwgZnVuYywgZmFpbE9wLCByZWYsIHN0ZW5jaWxNYXNrLCB3cml0ZU1hc2spIHtcbiAgICBsZXQgZWZmZWN0ID0gbWF0ZXJpYWwuZWZmZWN0O1xuICAgIGxldCB6RmFpbE9wID0gZ2Z4LlNURU5DSUxfT1BfS0VFUCxcbiAgICAgICAgelBhc3NPcCA9IGdmeC5TVEVOQ0lMX09QX0tFRVA7XG4gICAgZWZmZWN0LnNldFN0ZW5jaWwoZ2Z4LlNURU5DSUxfRU5BQkxFLCBmdW5jLCByZWYsIHN0ZW5jaWxNYXNrLCBmYWlsT3AsIHpGYWlsT3AsIHpQYXNzT3AsIHdyaXRlTWFzayk7XG59XG5cblxuZnVuY3Rpb24gcHVzaE1hc2sgKG1hc2spIHtcbiAgICBpZiAoX21hc2tTdGFjay5sZW5ndGggKyAxID4gX21heExldmVsKSB7XG4gICAgICAgIGNjLmVycm9ySUQoOTAwMCwgX21heExldmVsKTtcbiAgICB9XG4gICAgX21hc2tTdGFjay5wdXNoKG1hc2spO1xufVxuXG5mdW5jdGlvbiBleGl0TWFzayAobWFzaywgcmVuZGVyZXIpIHtcbiAgICBpZiAoX21hc2tTdGFjay5sZW5ndGggPT09IDApIHtcbiAgICAgICAgY2MuZXJyb3JJRCg5MDAxKTtcbiAgICB9XG4gICAgX21hc2tTdGFjay5wb3AoKTtcbiAgICBpZiAoX21hc2tTdGFjay5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmVuZGVyZXIuX2ZsdXNoTWF0ZXJpYWwobWFzay5fZXhpdE1hdGVyaWFsKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGVuYWJsZU1hc2socmVuZGVyZXIpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gYXBwbHlDbGVhck1hc2sgKG1hc2ssIHJlbmRlcmVyKSB7XG4gICAgbGV0IGZ1bmMgPSBnZnguRFNfRlVOQ19ORVZFUjtcbiAgICBsZXQgcmVmID0gZ2V0V3JpdGVNYXNrKCk7XG4gICAgbGV0IHN0ZW5jaWxNYXNrID0gcmVmO1xuICAgIGxldCB3cml0ZU1hc2sgPSByZWY7XG4gICAgbGV0IGZhaWxPcCA9IG1hc2suaW52ZXJ0ZWQgPyBnZnguU1RFTkNJTF9PUF9SRVBMQUNFIDogZ2Z4LlNURU5DSUxfT1BfWkVSTztcblxuICAgIGFwcGx5U3RlbmNpbChtYXNrLl9jbGVhck1hdGVyaWFsLCBmdW5jLCBmYWlsT3AsIHJlZiwgc3RlbmNpbE1hc2ssIHdyaXRlTWFzayk7XG5cbiAgICBsZXQgYnVmZmVyID0gcmVuZGVyZXIuZ2V0QnVmZmVyKCdtZXNoJywgdmZtdFBvcyk7XG4gICAgbGV0IG9mZnNldEluZm8gPSBidWZmZXIucmVxdWVzdCg0LCA2KTtcbiAgICBsZXQgaW5kaWNlT2Zmc2V0ID0gb2Zmc2V0SW5mby5pbmRpY2VPZmZzZXQsXG4gICAgICAgIHZlcnRleE9mZnNldCA9IG9mZnNldEluZm8uYnl0ZU9mZnNldCA+PiAyLFxuICAgICAgICB2ZXJ0ZXhJZCA9IG9mZnNldEluZm8udmVydGV4T2Zmc2V0LFxuICAgICAgICB2YnVmID0gYnVmZmVyLl92RGF0YSxcbiAgICAgICAgaWJ1ZiA9IGJ1ZmZlci5faURhdGE7XG4gICAgXG4gICAgdmJ1Zlt2ZXJ0ZXhPZmZzZXQrK10gPSAtMTtcbiAgICB2YnVmW3ZlcnRleE9mZnNldCsrXSA9IC0xO1xuICAgIHZidWZbdmVydGV4T2Zmc2V0KytdID0gLTE7XG4gICAgdmJ1Zlt2ZXJ0ZXhPZmZzZXQrK10gPSAxO1xuICAgIHZidWZbdmVydGV4T2Zmc2V0KytdID0gMTtcbiAgICB2YnVmW3ZlcnRleE9mZnNldCsrXSA9IDE7XG4gICAgdmJ1Zlt2ZXJ0ZXhPZmZzZXQrK10gPSAxO1xuICAgIHZidWZbdmVydGV4T2Zmc2V0KytdID0gLTE7XG5cbiAgICBpYnVmW2luZGljZU9mZnNldCsrXSA9IHZlcnRleElkO1xuICAgIGlidWZbaW5kaWNlT2Zmc2V0KytdID0gdmVydGV4SWQgKyAzO1xuICAgIGlidWZbaW5kaWNlT2Zmc2V0KytdID0gdmVydGV4SWQgKyAxO1xuICAgIGlidWZbaW5kaWNlT2Zmc2V0KytdID0gdmVydGV4SWQgKyAxO1xuICAgIGlidWZbaW5kaWNlT2Zmc2V0KytdID0gdmVydGV4SWQgKyAzO1xuICAgIGlidWZbaW5kaWNlT2Zmc2V0KytdID0gdmVydGV4SWQgKyAyO1xuXG4gICAgcmVuZGVyZXIubm9kZSA9IHJlbmRlcmVyLl9kdW1teU5vZGU7XG4gICAgcmVuZGVyZXIubWF0ZXJpYWwgPSBtYXNrLl9jbGVhck1hdGVyaWFsO1xuICAgIHJlbmRlcmVyLl9mbHVzaCgpO1xufVxuXG5mdW5jdGlvbiBhcHBseUFyZWFNYXNrIChtYXNrLCByZW5kZXJlcikge1xuICAgIGxldCBmdW5jID0gZ2Z4LkRTX0ZVTkNfTkVWRVI7XG4gICAgbGV0IHJlZiA9IGdldFdyaXRlTWFzaygpO1xuICAgIGxldCBzdGVuY2lsTWFzayA9IHJlZjtcbiAgICBsZXQgd3JpdGVNYXNrID0gcmVmO1xuICAgIGxldCBmYWlsT3AgPSBtYXNrLmludmVydGVkID8gZ2Z4LlNURU5DSUxfT1BfWkVSTyA6IGdmeC5TVEVOQ0lMX09QX1JFUExBQ0U7XG5cbiAgICBhcHBseVN0ZW5jaWwobWFzay5fbWF0ZXJpYWxzWzBdLCBmdW5jLCBmYWlsT3AsIHJlZiwgc3RlbmNpbE1hc2ssIHdyaXRlTWFzayk7XG5cbiAgICAvLyB2ZXJ0ZXggYnVmZmVyXG4gICAgcmVuZGVyZXIubWF0ZXJpYWwgPSBtYXNrLl9tYXRlcmlhbHNbMF07XG5cbiAgICBpZiAobWFzay5fdHlwZSA9PT0gTWFzay5UeXBlLklNQUdFX1NURU5DSUwpIHtcbiAgICAgICAgcmVuZGVyZXIubm9kZSA9IHJlbmRlcmVyLl9kdW1teU5vZGU7XG4gICAgICAgIFNpbXBsZVNwcml0ZUFzc2VtYmxlci5wcm90b3R5cGUuZmlsbEJ1ZmZlcnMuY2FsbChtYXNrLl9hc3NlbWJsZXIsIG1hc2ssIHJlbmRlcmVyKTtcbiAgICAgICAgcmVuZGVyZXIuX2ZsdXNoKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZW5kZXJlci5ub2RlID0gbWFzay5ub2RlO1xuICAgICAgICBHcmFwaGljc0Fzc2VtYmxlci5wcm90b3R5cGUuZmlsbEJ1ZmZlcnMuY2FsbChtYXNrLl9ncmFwaGljcy5fYXNzZW1ibGVyLCBtYXNrLl9ncmFwaGljcywgcmVuZGVyZXIpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZW5hYmxlTWFzayAocmVuZGVyZXIpIHtcbiAgICBsZXQgZnVuYyA9IGdmeC5EU19GVU5DX0VRVUFMO1xuICAgIGxldCBmYWlsT3AgPSBnZnguU1RFTkNJTF9PUF9LRUVQO1xuICAgIGxldCByZWYgPSBnZXRTdGVuY2lsUmVmKCk7XG4gICAgbGV0IHN0ZW5jaWxNYXNrID0gcmVmO1xuICAgIGxldCB3cml0ZU1hc2sgPSBnZXRXcml0ZU1hc2soKTtcbiAgICBcbiAgICBsZXQgbWFzayA9IF9tYXNrU3RhY2tbX21hc2tTdGFjay5sZW5ndGggLSAxXTtcbiAgICBhcHBseVN0ZW5jaWwobWFzay5fZW5hYmxlTWF0ZXJpYWwsIGZ1bmMsIGZhaWxPcCwgcmVmLCBzdGVuY2lsTWFzaywgd3JpdGVNYXNrKTtcbiAgICByZW5kZXJlci5fZmx1c2hNYXRlcmlhbChtYXNrLl9lbmFibGVNYXRlcmlhbCk7XG59XG5cbmV4cG9ydCBjbGFzcyBNYXNrQXNzZW1ibGVyICBleHRlbmRzIFNpbXBsZVNwcml0ZUFzc2VtYmxlciB7XG4gICAgdXBkYXRlUmVuZGVyRGF0YSAobWFzaykge1xuICAgICAgICBpZiAobWFzay5fdHlwZSA9PT0gTWFzay5UeXBlLklNQUdFX1NURU5DSUwpIHtcbiAgICAgICAgICAgIGlmIChtYXNrLnNwcml0ZUZyYW1lKSB7XG4gICAgICAgICAgICAgICAgU2ltcGxlU3ByaXRlQXNzZW1ibGVyLnByb3RvdHlwZS51cGRhdGVSZW5kZXJEYXRhLmNhbGwodGhpcywgbWFzayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBtYXNrLnNldE1hdGVyaWFsKDAsIG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbWFzay5fZ3JhcGhpY3Muc2V0TWF0ZXJpYWwoMCwgbWFzay5fbWF0ZXJpYWxzWzBdKTtcbiAgICAgICAgICAgIEdyYXBoaWNzQXNzZW1ibGVyLnByb3RvdHlwZS51cGRhdGVSZW5kZXJEYXRhLmNhbGwobWFzay5fZ3JhcGhpY3MuX2Fzc2VtYmxlciwgbWFzay5fZ3JhcGhpY3MsIG1hc2suX2dyYXBoaWNzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbGxCdWZmZXJzIChtYXNrLCByZW5kZXJlcikge1xuICAgICAgICAvLyBJbnZhbGlkIHN0YXRlXG4gICAgICAgIGlmIChtYXNrLl90eXBlICE9PSBNYXNrLlR5cGUuSU1BR0VfU1RFTkNJTCB8fCBtYXNrLnNwcml0ZUZyYW1lKSB7XG4gICAgICAgICAgICAvLyBIQUNLOiBNdXN0IHB1c2ggbWFzayBhZnRlciBiYXRjaCwgc28gd2UgY2FuIG9ubHkgcHV0IHRoaXMgbG9naWMgaW4gZmlsbFZlcnRleEJ1ZmZlciBvciBmaWxsSW5kZXhCdWZmZXJcbiAgICAgICAgICAgIHB1c2hNYXNrKG1hc2spO1xuXG4gICAgICAgICAgICBhcHBseUNsZWFyTWFzayhtYXNrLCByZW5kZXJlcik7XG4gICAgICAgICAgICBhcHBseUFyZWFNYXNrKG1hc2ssIHJlbmRlcmVyKTtcblxuICAgICAgICAgICAgZW5hYmxlTWFzayhyZW5kZXJlcik7XG4gICAgICAgIH1cblxuICAgICAgICBtYXNrLm5vZGUuX3JlbmRlckZsYWcgfD0gUmVuZGVyRmxvdy5GTEFHX1VQREFURV9SRU5ERVJfREFUQTtcbiAgICB9XG5cbiAgICBwb3N0RmlsbEJ1ZmZlcnMgKG1hc2ssIHJlbmRlcmVyKSB7XG4gICAgICAgIC8vIEludmFsaWQgc3RhdGVcbiAgICAgICAgaWYgKG1hc2suX3R5cGUgIT09IE1hc2suVHlwZS5JTUFHRV9TVEVOQ0lMIHx8IG1hc2suc3ByaXRlRnJhbWUpIHtcbiAgICAgICAgICAgIC8vIEhBQ0s6IE11c3QgcG9wIG1hc2sgYWZ0ZXIgYmF0Y2gsIHNvIHdlIGNhbiBvbmx5IHB1dCB0aGlzIGxvZ2ljIGluIGZpbGxCdWZmZXJzXG4gICAgICAgICAgICBleGl0TWFzayhtYXNrLCByZW5kZXJlcik7XG4gICAgICAgIH1cblxuICAgICAgICBtYXNrLm5vZGUuX3JlbmRlckZsYWcgfD0gUmVuZGVyRmxvdy5GTEFHX1VQREFURV9SRU5ERVJfREFUQTtcbiAgICB9XG59O1xuXG5Bc3NlbWJsZXIucmVnaXN0ZXIoTWFzaywgTWFza0Fzc2VtYmxlcik7XG4iXX0=