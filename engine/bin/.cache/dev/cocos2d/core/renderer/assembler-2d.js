
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/assembler-2d.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _assembler = _interopRequireDefault(require("./assembler"));

var _manager = _interopRequireDefault(require("./utils/dynamic-atlas/manager"));

var _renderData = _interopRequireDefault(require("./webgl/render-data"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Assembler2D =
/*#__PURE__*/
function (_Assembler) {
  _inheritsLoose(Assembler2D, _Assembler);

  function Assembler2D() {
    var _this;

    _this = _Assembler.call(this) || this;
    _this._renderData = new _renderData["default"]();

    _this._renderData.init(_assertThisInitialized(_this));

    _this.initData();

    _this.initLocal();

    return _this;
  }

  var _proto = Assembler2D.prototype;

  _proto.initData = function initData() {
    var data = this._renderData;
    data.createQuadData(0, this.verticesFloats, this.indicesCount);
  };

  _proto.initLocal = function initLocal() {
    this._local = [];
    this._local.length = 4;
  };

  _proto.updateColor = function updateColor(comp, color) {
    var uintVerts = this._renderData.uintVDatas[0];
    if (!uintVerts) return;
    color = color || comp.node.color._val;
    var floatsPerVert = this.floatsPerVert;
    var colorOffset = this.colorOffset;

    for (var i = colorOffset, l = uintVerts.length; i < l; i += floatsPerVert) {
      uintVerts[i] = color;
    }
  };

  _proto.getBuffer = function getBuffer() {
    return cc.renderer._handle._meshBuffer;
  };

  _proto.updateWorldVerts = function updateWorldVerts(comp) {
    var local = this._local;
    var verts = this._renderData.vDatas[0];
    var matrix = comp.node._worldMatrix;
    var matrixm = matrix.m,
        a = matrixm[0],
        b = matrixm[1],
        c = matrixm[4],
        d = matrixm[5],
        tx = matrixm[12],
        ty = matrixm[13];
    var vl = local[0],
        vr = local[2],
        vb = local[1],
        vt = local[3];
    var justTranslate = a === 1 && b === 0 && c === 0 && d === 1;

    if (justTranslate) {
      // left bottom
      verts[0] = vl + tx;
      verts[1] = vb + ty; // right bottom

      verts[5] = vr + tx;
      verts[6] = vb + ty; // left top

      verts[10] = vl + tx;
      verts[11] = vt + ty; // right top

      verts[15] = vr + tx;
      verts[16] = vt + ty;
    } else {
      var al = a * vl,
          ar = a * vr,
          bl = b * vl,
          br = b * vr,
          cb = c * vb,
          ct = c * vt,
          db = d * vb,
          dt = d * vt; // left bottom

      verts[0] = al + cb + tx;
      verts[1] = bl + db + ty; // right bottom

      verts[5] = ar + cb + tx;
      verts[6] = br + db + ty; // left top

      verts[10] = al + ct + tx;
      verts[11] = bl + dt + ty; // right top

      verts[15] = ar + ct + tx;
      verts[16] = br + dt + ty;
    }
  };

  _proto.fillBuffers = function fillBuffers(comp, renderer) {
    if (renderer.worldMatDirty) {
      this.updateWorldVerts(comp);
    }

    var renderData = this._renderData;
    var vData = renderData.vDatas[0];
    var iData = renderData.iDatas[0];
    var buffer = this.getBuffer(renderer);
    var offsetInfo = buffer.request(this.verticesCount, this.indicesCount); // buffer data may be realloc, need get reference after request.
    // fill vertices

    var vertexOffset = offsetInfo.byteOffset >> 2,
        vbuf = buffer._vData;

    if (vData.length + vertexOffset > vbuf.length) {
      vbuf.set(vData.subarray(0, vbuf.length - vertexOffset), vertexOffset);
    } else {
      vbuf.set(vData, vertexOffset);
    } // fill indices


    var ibuf = buffer._iData,
        indiceOffset = offsetInfo.indiceOffset,
        vertexId = offsetInfo.vertexOffset;

    for (var i = 0, l = iData.length; i < l; i++) {
      ibuf[indiceOffset++] = vertexId + iData[i];
    }
  };

  _proto.packToDynamicAtlas = function packToDynamicAtlas(comp, frame) {
    if (CC_TEST) return;

    if (!frame._original && _manager["default"] && frame._texture.packable) {
      var packedFrame = _manager["default"].insertSpriteFrame(frame);

      if (packedFrame) {
        frame._setDynamicAtlasFrame(packedFrame);
      }
    }

    var material = comp._materials[0];
    if (!material) return;

    if (material.getProperty('texture') !== frame._texture) {
      // texture was packed to dynamic atlas, should update uvs
      comp._vertsDirty = true;

      comp._updateMaterial();
    }
  };

  _createClass(Assembler2D, [{
    key: "verticesFloats",
    get: function get() {
      return this.verticesCount * this.floatsPerVert;
    }
  }]);

  return Assembler2D;
}(_assembler["default"]);

exports["default"] = Assembler2D;
cc.js.addon(Assembler2D.prototype, {
  floatsPerVert: 5,
  verticesCount: 4,
  indicesCount: 6,
  uvOffset: 2,
  colorOffset: 4
});
cc.Assembler2D = Assembler2D;
module.exports = exports["default"];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2VtYmxlci0yZC5qcyJdLCJuYW1lcyI6WyJBc3NlbWJsZXIyRCIsIl9yZW5kZXJEYXRhIiwiUmVuZGVyRGF0YSIsImluaXQiLCJpbml0RGF0YSIsImluaXRMb2NhbCIsImRhdGEiLCJjcmVhdGVRdWFkRGF0YSIsInZlcnRpY2VzRmxvYXRzIiwiaW5kaWNlc0NvdW50IiwiX2xvY2FsIiwibGVuZ3RoIiwidXBkYXRlQ29sb3IiLCJjb21wIiwiY29sb3IiLCJ1aW50VmVydHMiLCJ1aW50VkRhdGFzIiwibm9kZSIsIl92YWwiLCJmbG9hdHNQZXJWZXJ0IiwiY29sb3JPZmZzZXQiLCJpIiwibCIsImdldEJ1ZmZlciIsImNjIiwicmVuZGVyZXIiLCJfaGFuZGxlIiwiX21lc2hCdWZmZXIiLCJ1cGRhdGVXb3JsZFZlcnRzIiwibG9jYWwiLCJ2ZXJ0cyIsInZEYXRhcyIsIm1hdHJpeCIsIl93b3JsZE1hdHJpeCIsIm1hdHJpeG0iLCJtIiwiYSIsImIiLCJjIiwiZCIsInR4IiwidHkiLCJ2bCIsInZyIiwidmIiLCJ2dCIsImp1c3RUcmFuc2xhdGUiLCJhbCIsImFyIiwiYmwiLCJiciIsImNiIiwiY3QiLCJkYiIsImR0IiwiZmlsbEJ1ZmZlcnMiLCJ3b3JsZE1hdERpcnR5IiwicmVuZGVyRGF0YSIsInZEYXRhIiwiaURhdGEiLCJpRGF0YXMiLCJidWZmZXIiLCJvZmZzZXRJbmZvIiwicmVxdWVzdCIsInZlcnRpY2VzQ291bnQiLCJ2ZXJ0ZXhPZmZzZXQiLCJieXRlT2Zmc2V0IiwidmJ1ZiIsIl92RGF0YSIsInNldCIsInN1YmFycmF5IiwiaWJ1ZiIsIl9pRGF0YSIsImluZGljZU9mZnNldCIsInZlcnRleElkIiwicGFja1RvRHluYW1pY0F0bGFzIiwiZnJhbWUiLCJDQ19URVNUIiwiX29yaWdpbmFsIiwiZHluYW1pY0F0bGFzTWFuYWdlciIsIl90ZXh0dXJlIiwicGFja2FibGUiLCJwYWNrZWRGcmFtZSIsImluc2VydFNwcml0ZUZyYW1lIiwiX3NldER5bmFtaWNBdGxhc0ZyYW1lIiwibWF0ZXJpYWwiLCJfbWF0ZXJpYWxzIiwiZ2V0UHJvcGVydHkiLCJfdmVydHNEaXJ0eSIsIl91cGRhdGVNYXRlcmlhbCIsIkFzc2VtYmxlciIsImpzIiwiYWRkb24iLCJwcm90b3R5cGUiLCJ1dk9mZnNldCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7SUFFcUJBOzs7OztBQUNqQix5QkFBZTtBQUFBOztBQUNYO0FBRUEsVUFBS0MsV0FBTCxHQUFtQixJQUFJQyxzQkFBSixFQUFuQjs7QUFDQSxVQUFLRCxXQUFMLENBQWlCRSxJQUFqQjs7QUFFQSxVQUFLQyxRQUFMOztBQUNBLFVBQUtDLFNBQUw7O0FBUFc7QUFRZDs7OztTQU1ERCxXQUFBLG9CQUFZO0FBQ1IsUUFBSUUsSUFBSSxHQUFHLEtBQUtMLFdBQWhCO0FBQ0FLLElBQUFBLElBQUksQ0FBQ0MsY0FBTCxDQUFvQixDQUFwQixFQUF1QixLQUFLQyxjQUE1QixFQUE0QyxLQUFLQyxZQUFqRDtBQUNIOztTQUNESixZQUFBLHFCQUFhO0FBQ1QsU0FBS0ssTUFBTCxHQUFjLEVBQWQ7QUFDQSxTQUFLQSxNQUFMLENBQVlDLE1BQVosR0FBcUIsQ0FBckI7QUFDSDs7U0FFREMsY0FBQSxxQkFBYUMsSUFBYixFQUFtQkMsS0FBbkIsRUFBMEI7QUFDdEIsUUFBSUMsU0FBUyxHQUFHLEtBQUtkLFdBQUwsQ0FBaUJlLFVBQWpCLENBQTRCLENBQTVCLENBQWhCO0FBQ0EsUUFBSSxDQUFDRCxTQUFMLEVBQWdCO0FBQ2hCRCxJQUFBQSxLQUFLLEdBQUdBLEtBQUssSUFBR0QsSUFBSSxDQUFDSSxJQUFMLENBQVVILEtBQVYsQ0FBZ0JJLElBQWhDO0FBQ0EsUUFBSUMsYUFBYSxHQUFHLEtBQUtBLGFBQXpCO0FBQ0EsUUFBSUMsV0FBVyxHQUFHLEtBQUtBLFdBQXZCOztBQUNBLFNBQUssSUFBSUMsQ0FBQyxHQUFHRCxXQUFSLEVBQXFCRSxDQUFDLEdBQUdQLFNBQVMsQ0FBQ0osTUFBeEMs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Q0FBQ0ksUUFBTixDQUFlQyxRQUE5RCxFQUF3RTtBQUNwRSxVQUFJQyxXQUFXLEdBQUdILG9CQUFvQkksaUJBQXBCLENBQXNDUCxLQUF0QyxDQUFsQjs7QUFDQSxVQUFJTSxXQUFKLEVBQWlCO0FBQ2JOLFFBQUFBLEtBQUssQ0FBQ1EscUJBQU4sQ0FBNEJGLFdBQTVCO0FBQ0g7QUFDSjs7QUFDRCxRQUFJRyxRQUFRLEdBQUd4RSxJQUFJLENBQUN5RSxVQUFMLENBQWdCLENBQWhCLENBQWY7QUFDQSxRQUFJLENBQUNELFFBQUwsRUFBZTs7QUFFZixRQUFJQSxRQUFRLENBQUNFLFdBQVQsQ0FBcUIsU0FBckIsTUFBb0NYLEtBQUssQ0FBQ0ksUUFBOUMsRUFBd0Q7QUFDcEQ7QUFDQW5FLE1BQUFBLElBQUksQ0FBQzJFLFdBQUwsR0FBbUIsSUFBbkI7O0FBQ0EzRSxNQUFBQSxJQUFJLENBQUM0RSxlQUFMO0FBQ0g7QUFDSjs7Ozt3QkE5SHFCO0FBQ2xCLGFBQU8sS0FBS3pCLGFBQUwsR0FBcUIsS0FBSzdDLGFBQWpDO0FBQ0g7Ozs7RUFib0N1RTs7O0FBNEl6Q2xFLEVBQUUsQ0FBQ21FLEVBQUgsQ0FBTUMsS0FBTixDQUFZNUYsV0FBVyxDQUFDNkYsU0FBeEIsRUFBbUM7QUFDL0IxRSxFQUFBQSxhQUFhLEVBQUUsQ0FEZ0I7QUFHL0I2QyxFQUFBQSxhQUFhLEVBQUUsQ0FIZ0I7QUFJL0J2RCxFQUFBQSxZQUFZLEVBQUUsQ0FKaUI7QUFNL0JxRixFQUFBQSxRQUFRLEVBQUUsQ0FOcUI7QUFPL0IxRSxFQUFBQSxXQUFXLEVBQUU7QUFQa0IsQ0FBbkM7QUFVQUksRUFBRSxDQUFDeEIsV0FBSCxHQUFpQkEsV0FBakIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXNzZW1ibGVyIGZyb20gJy4vYXNzZW1ibGVyJztcbmltcG9ydCBkeW5hbWljQXRsYXNNYW5hZ2VyIGZyb20gJy4vdXRpbHMvZHluYW1pYy1hdGxhcy9tYW5hZ2VyJztcbmltcG9ydCBSZW5kZXJEYXRhIGZyb20gJy4vd2ViZ2wvcmVuZGVyLWRhdGEnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBc3NlbWJsZXIyRCBleHRlbmRzIEFzc2VtYmxlciB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuX3JlbmRlckRhdGEgPSBuZXcgUmVuZGVyRGF0YSgpO1xuICAgICAgICB0aGlzLl9yZW5kZXJEYXRhLmluaXQodGhpcyk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXREYXRhKCk7XG4gICAgICAgIHRoaXMuaW5pdExvY2FsKCk7XG4gICAgfVxuXG4gICAgZ2V0IHZlcnRpY2VzRmxvYXRzICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmVydGljZXNDb3VudCAqIHRoaXMuZmxvYXRzUGVyVmVydDtcbiAgICB9XG5cbiAgICBpbml0RGF0YSAoKSB7XG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5fcmVuZGVyRGF0YTtcbiAgICAgICAgZGF0YS5jcmVhdGVRdWFkRGF0YSgwLCB0aGlzLnZlcnRpY2VzRmxvYXRzLCB0aGlzLmluZGljZXNDb3VudCk7XG4gICAgfVxuICAgIGluaXRMb2NhbCAoKSB7XG4gICAgICAgIHRoaXMuX2xvY2FsID0gW107XG4gICAgICAgIHRoaXMuX2xvY2FsLmxlbmd0aCA9IDQ7XG4gICAgfVxuXG4gICAgdXBkYXRlQ29sb3IgKGNvbXAsIGNvbG9yKSB7XG4gICAgICAgIGxldCB1aW50VmVydHMgPSB0aGlzLl9yZW5kZXJEYXRhLnVpbnRWRGF0YXNbMF07XG4gICAgICAgIGlmICghdWludFZlcnRzKSByZXR1cm47XG4gICAgICAgIGNvbG9yID0gY29sb3IgfHxjb21wLm5vZGUuY29sb3IuX3ZhbDtcbiAgICAgICAgbGV0IGZsb2F0c1BlclZlcnQgPSB0aGlzLmZsb2F0c1BlclZlcnQ7XG4gICAgICAgIGxldCBjb2xvck9mZnNldCA9IHRoaXMuY29sb3JPZmZzZXQ7XG4gICAgICAgIGZvciAobGV0IGkgPSBjb2xvck9mZnNldCwgbCA9IHVpbnRWZXJ0cy5sZW5ndGg7IGkgPCBsOyBpICs9IGZsb2F0c1BlclZlcnQpIHtcbiAgICAgICAgICAgIHVpbnRWZXJ0c1tpXSA9IGNvbG9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0QnVmZmVyICgpIHtcbiAgICAgICAgcmV0dXJuIGNjLnJlbmRlcmVyLl9oYW5kbGUuX21lc2hCdWZmZXI7XG4gICAgfVxuXG4gICAgdXBkYXRlV29ybGRWZXJ0cyAoY29tcCkge1xuICAgICAgICBsZXQgbG9jYWwgPSB0aGlzLl9sb2NhbDtcbiAgICAgICAgbGV0IHZlcnRzID0gdGhpcy5fcmVuZGVyRGF0YS52RGF0YXNbMF07XG5cbiAgICAgICAgbGV0IG1hdHJpeCA9IGNvbXAubm9kZS5fd29ybGRNYXRyaXg7XG4gICAgICAgIGxldCBtYXRyaXhtID0gbWF0cml4Lm0sXG4gICAgICAgICAgICBhID0gbWF0cml4bVswXSwgYiA9IG1hdHJpeG1bMV0sIGMgPSBtYXRyaXhtWzRdLCBkID0gbWF0cml4bVs1XSxcbiAgICAgICAgICAgIHR4ID0gbWF0cml4bVsxMl0sIHR5ID0gbWF0cml4bVsxM107XG5cbiAgICAgICAgbGV0IHZsID0gbG9jYWxbMF0sIHZyID0gbG9jYWxbMl0sXG4gICAgICAgICAgICB2YiA9IGxvY2FsWzFdLCB2dCA9IGxvY2FsWzNdO1xuICAgICAgICBcbiAgICAgICAgbGV0IGp1c3RUcmFuc2xhdGUgPSBhID09PSAxICYmIGIgPT09IDAgJiYgYyA9PT0gMCAmJiBkID09PSAxO1xuXG4gICAgICAgIGlmIChqdXN0VHJhbnNsYXRlKSB7XG4gICAgICAgICAgICAvLyBsZWZ0IGJvdHRvbVxuICAgICAgICAgICAgdmVydHNbMF0gPSB2bCArIHR4O1xuICAgICAgICAgICAgdmVydHNbMV0gPSB2YiArIHR5O1xuICAgICAgICAgICAgLy8gcmlnaHQgYm90dG9tXG4gICAgICAgICAgICB2ZXJ0c1s1XSA9IHZyICsgdHg7XG4gICAgICAgICAgICB2ZXJ0c1s2XSA9IHZiICsgdHk7XG4gICAgICAgICAgICAvLyBsZWZ0IHRvcFxuICAgICAgICAgICAgdmVydHNbMTBdID0gdmwgKyB0eDtcbiAgICAgICAgICAgIHZlcnRzWzExXSA9IHZ0ICsgdHk7XG4gICAgICAgICAgICAvLyByaWdodCB0b3BcbiAgICAgICAgICAgIHZlcnRzWzE1XSA9IHZyICsgdHg7XG4gICAgICAgICAgICB2ZXJ0c1sxNl0gPSB2dCArIHR5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGFsID0gYSAqIHZsLCBhciA9IGEgKiB2cixcbiAgICAgICAgICAgIGJsID0gYiAqIHZsLCBiciA9IGIgKiB2cixcbiAgICAgICAgICAgIGNiID0gYyAqIHZiLCBjdCA9IGMgKiB2dCxcbiAgICAgICAgICAgIGRiID0gZCAqIHZiLCBkdCA9IGQgKiB2dDtcblxuICAgICAgICAgICAgLy8gbGVmdCBib3R0b21cbiAgICAgICAgICAgIHZlcnRzWzBdID0gYWwgKyBjYiArIHR4O1xuICAgICAgICAgICAgdmVydHNbMV0gPSBibCArIGRiICsgdHk7XG4gICAgICAgICAgICAvLyByaWdodCBib3R0b21cbiAgICAgICAgICAgIHZlcnRzWzVdID0gYXIgKyBjYiArIHR4O1xuICAgICAgICAgICAgdmVydHNbNl0gPSBiciArIGRiICsgdHk7XG4gICAgICAgICAgICAvLyBsZWZ0IHRvcFxuICAgICAgICAgICAgdmVydHNbMTBdID0gYWwgKyBjdCArIHR4O1xuICAgICAgICAgICAgdmVydHNbMTFdID0gYmwgKyBkdCArIHR5O1xuICAgICAgICAgICAgLy8gcmlnaHQgdG9wXG4gICAgICAgICAgICB2ZXJ0c1sxNV0gPSBhciArIGN0ICsgdHg7XG4gICAgICAgICAgICB2ZXJ0c1sxNl0gPSBiciArIGR0ICsgdHk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaWxsQnVmZmVycyAoY29tcCwgcmVuZGVyZXIpIHtcbiAgICAgICAgaWYgKHJlbmRlcmVyLndvcmxkTWF0RGlydHkpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlV29ybGRWZXJ0cyhjb21wKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByZW5kZXJEYXRhID0gdGhpcy5fcmVuZGVyRGF0YTtcbiAgICAgICAgbGV0IHZEYXRhID0gcmVuZGVyRGF0YS52RGF0YXNbMF07XG4gICAgICAgIGxldCBpRGF0YSA9IHJlbmRlckRhdGEuaURhdGFzWzBdO1xuXG4gICAgICAgIGxldCBidWZmZXIgPSB0aGlzLmdldEJ1ZmZlcihyZW5kZXJlcik7XG4gICAgICAgIGxldCBvZmZzZXRJbmZvID0gYnVmZmVyLnJlcXVlc3QodGhpcy52ZXJ0aWNlc0NvdW50LCB0aGlzLmluZGljZXNDb3VudCk7XG5cbiAgICAgICAgLy8gYnVmZmVyIGRhdGEgbWF5IGJlIHJlYWxsb2MsIG5lZWQgZ2V0IHJlZmVyZW5jZSBhZnRlciByZXF1ZXN0LlxuXG4gICAgICAgIC8vIGZpbGwgdmVydGljZXNcbiAgICAgICAgbGV0IHZlcnRleE9mZnNldCA9IG9mZnNldEluZm8uYnl0ZU9mZnNldCA+PiAyLFxuICAgICAgICAgICAgdmJ1ZiA9IGJ1ZmZlci5fdkRhdGE7XG5cbiAgICAgICAgaWYgKHZEYXRhLmxlbmd0aCArIHZlcnRleE9mZnNldCA+IHZidWYubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YnVmLnNldCh2RGF0YS5zdWJhcnJheSgwLCB2YnVmLmxlbmd0aCAtIHZlcnRleE9mZnNldCksIHZlcnRleE9mZnNldCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YnVmLnNldCh2RGF0YSwgdmVydGV4T2Zmc2V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZpbGwgaW5kaWNlc1xuICAgICAgICBsZXQgaWJ1ZiA9IGJ1ZmZlci5faURhdGEsXG4gICAgICAgICAgICBpbmRpY2VPZmZzZXQgPSBvZmZzZXRJbmZvLmluZGljZU9mZnNldCxcbiAgICAgICAgICAgIHZlcnRleElkID0gb2Zmc2V0SW5mby52ZXJ0ZXhPZmZzZXQ7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gaURhdGEubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBpYnVmW2luZGljZU9mZnNldCsrXSA9IHZlcnRleElkICsgaURhdGFbaV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwYWNrVG9EeW5hbWljQXRsYXMgKGNvbXAsIGZyYW1lKSB7XG4gICAgICAgIGlmIChDQ19URVNUKSByZXR1cm47XG4gICAgICAgIFxuICAgICAgICBpZiAoIWZyYW1lLl9vcmlnaW5hbCAmJiBkeW5hbWljQXRsYXNNYW5hZ2VyICYmIGZyYW1lLl90ZXh0dXJlLnBhY2thYmxlKSB7XG4gICAgICAgICAgICBsZXQgcGFja2VkRnJhbWUgPSBkeW5hbWljQXRsYXNNYW5hZ2VyLmluc2VydFNwcml0ZUZyYW1lKGZyYW1lKTtcbiAgICAgICAgICAgIGlmIChwYWNrZWRGcmFtZSkge1xuICAgICAgICAgICAgICAgIGZyYW1lLl9zZXREeW5hbWljQXRsYXNGcmFtZShwYWNrZWRGcmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG1hdGVyaWFsID0gY29tcC5fbWF0ZXJpYWxzWzBdO1xuICAgICAgICBpZiAoIW1hdGVyaWFsKSByZXR1cm47XG4gICAgICAgIFxuICAgICAgICBpZiAobWF0ZXJpYWwuZ2V0UHJvcGVydHkoJ3RleHR1cmUnKSAhPT0gZnJhbWUuX3RleHR1cmUpIHtcbiAgICAgICAgICAgIC8vIHRleHR1cmUgd2FzIHBhY2tlZCB0byBkeW5hbWljIGF0bGFzLCBzaG91bGQgdXBkYXRlIHV2c1xuICAgICAgICAgICAgY29tcC5fdmVydHNEaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICBjb21wLl91cGRhdGVNYXRlcmlhbCgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jYy5qcy5hZGRvbihBc3NlbWJsZXIyRC5wcm90b3R5cGUsIHtcbiAgICBmbG9hdHNQZXJWZXJ0OiA1LFxuXG4gICAgdmVydGljZXNDb3VudDogNCxcbiAgICBpbmRpY2VzQ291bnQ6IDYsXG5cbiAgICB1dk9mZnNldDogMixcbiAgICBjb2xvck9mZnNldDogNCxcbn0pO1xuXG5jYy5Bc3NlbWJsZXIyRCA9IEFzc2VtYmxlcjJEO1xuIl19