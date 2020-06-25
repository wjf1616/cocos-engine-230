
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/canvas/renderers/sprite/tiled.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _assembler = _interopRequireDefault(require("../../../assembler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var utils = require('../utils');

var CanvasTiledSprite =
/*#__PURE__*/
function (_Assembler) {
  _inheritsLoose(CanvasTiledSprite, _Assembler);

  function CanvasTiledSprite() {
    return _Assembler.apply(this, arguments) || this;
  }

  var _proto = CanvasTiledSprite.prototype;

  _proto.draw = function draw(ctx, sprite) {
    var node = sprite.node; // Transform

    var matrix = node._worldMatrix;
    var matrixm = matrix.m;
    var a = matrixm[0],
        b = matrixm[1],
        c = matrixm[4],
        d = matrixm[5],
        tx = matrixm[12],
        ty = matrixm[13];
    ctx.transform(a, b, c, d, tx, ty);
    ctx.scale(1, -1); // TODO: handle blend function
    // opacity

    utils.context.setGlobalAlpha(ctx, node.opacity / 255);
    var frame = sprite.spriteFrame;
    var rect = frame._rect;
    var tex = frame._texture;
    var sx = rect.x;
    var sy = rect.y;
    var sw = frame._rotated ? rect.height : rect.width;
    var sh = frame._rotated ? rect.width : rect.height;
    var image = utils.getFrameCache(tex, node._color, sx, sy, sw, sh);
    var w = node.width,
        h = node.height,
        x = -node.anchorX * w,
        y = -node.anchorY * h;
    y = -y - h;
    ctx.translate(x, y);
    ctx.fillStyle = ctx.createPattern(image, 'repeat');
    ctx.fillRect(0, 0, w, h);
    return 1;
  };

  return CanvasTiledSprite;
}(_assembler["default"]);

exports["default"] = CanvasTiledSprite;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRpbGVkLmpzIl0sIm5hbWVzIjpbInV0aWxzIiwicmVxdWlyZSIsIkNhbnZhc1RpbGVkU3ByaXRlIiwiZHJhdyIsImN0eCIsInNwcml0ZSIsIm5vZGUiLCJtYXRyaXgiLCJfd29ybGRNYXRyaXgiLCJtYXRyaXhtIiwibSIsImEiLCJiIiwiYyIsImQiLCJ0eCIsInR5IiwidHJhbnNmb3JtIiwic2NhbGUiLCJjb250ZXh0Iiwic2V0R2xvYmFsQWxwaGEiLCJvcGFjaXR5IiwiZnJhbWUiLCJzcHJpdGVGcmFtZSIsInJlY3QiLCJfcmVjdCIsInRleCIsIl90ZXh0dXJlIiwic3giLCJ4Iiwic3kiLCJ5Iiwic3ciLCJfcm90YXRlZCIsImhlaWdodCIsIndpZHRoIiwic2giLCJpbWFnZSIsImdldEZyYW1lQ2FjaGUiLCJfY29sb3IiLCJ3IiwiaCIsImFuY2hvclgiLCJhbmNob3JZIiwidHJhbnNsYXRlIiwiZmlsbFN0eWxlIiwiY3JlYXRlUGF0dGVybiIsImZpbGxSZWN0IiwiQXNzZW1ibGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBOzs7Ozs7QUFFQSxJQUFNQSxLQUFLLEdBQUdDLE9BQU8sQ0FBQyxVQUFELENBQXJCOztJQUVxQkM7Ozs7Ozs7Ozs7O1NBQ2pCQyxPQUFBLGNBQU1DLEdBQU4sRUFBV0MsTUFBWCxFQUFtQjtBQUNmLFFBQUlDLElBQUksR0FBR0QsTUFBTSxDQUFDQyxJQUFsQixDQURlLENBRWY7O0FBQ0EsUUFBSUMsTUFBTSxHQUFHRCxJQUFJLENBQUNFLFlBQWxCO0FBQ0EsUUFBSUMsT0FBTyxHQUFHRixNQUFNLENBQUNHLENBQXJCO0FBQ0EsUUFBSUMsQ0FBQyxHQUFHRixPQUFPLENBQUMsQ0FBRCxDQUFmO0FBQUEsUUFBb0JHLENBQUMsR0FBR0gsT0FBTyxDQUFDLENBQUQsQ0FBL0I7QUFBQSxRQUFvQ0ksQ0FBQyxHQUFHSixPQUFPLENBQUMsQ0FBRCxDQUEvQztBQUFBLFFBQW9ESyxDQUFDLEdBQUdMLE9BQU8sQ0FBQyxDQUFELENBQS9EO0FBQUEsUUFDSU0sRUFBRSxHQUFHTixPQUFPLENBQUMsRUFBRCxDQURoQjtBQUFBLFFBQ3NCTyxFQUFFLEdBQUdQLE9BQU8sQ0FBQyxFQUFELENBRGxDO0FBRUFMLElBQUFBLEdBQUcsQ0FBQ2EsU0FBSixDQUFjTixDQUFkLEVBQWlCQyxDQUFqQixFQUFvQkMsQ0FBcEIsRUFBdUJDLENBQXZCLEVBQTBCQyxFQUExQixFQUE4QkMsRUFBOUI7QUFDQVosSUFBQUEsR0FBRyxDQUFDYyxLQUFKLENBQVUsQ0FBVixFQUFhLENBQUMsQ0FBZCxFQVJlLENBVWY7QUFFQTs7QUFDQWxCLElBQUFBLEtBQUssQ0FBQ21CLE9BQU4sQ0FBY0MsY0FBZCxDQUE2QmhCLEdBQTdCLEVBQWtDRSxJQUFJLENBQUNlLE9BQUwsR0FBZSxHQUFqRDtBQUVBLFFBQUlDLEtBQUssR0FBR2pCLE1BQU0sQ0FBQ2tCLFdBQW5CO0FBQ0EsUUFBSUMsSUFBSSxHQUFHRixLQUFLLENBQUNHLEtBQWpCO0FBQ0EsUUFBSUMsR0FBRyxHQUFHSixLQUFLLENBQUNLLFFBQWhCO0FBQ0EsUUFBSUMsRUFBRSxHQUFHSixJQUFJLENBQUNLLENBQWQ7QUFDQSxRQUFJQyxFQUFFLEdBQUdOLElBQUksQ0FBQ08sQ0FBZDtBQUNBLFFBQUlDLEVBQUUsR0FBR1YsS0FBSyxDQUFDVyxRQUFOLEdBQWlCVCxJQUFJLENBQUNVLE1BQXRCLEdBQStCVixJQUFJLENBQUNXLEtBQTdDO0FBQ0EsUUFBSUMsRUFBRSxHQUFHZCxLQUFLLENBQUNXLFFBQU4sR0FBaUJULElBQUksQ0FBQ1csS0FBdEIsR0FBOEJYLElBQUksQ0FBQ1UsTUFBNUM7QUFFQSxRQUFJRyxLQUFLLEdBQUdyQyxLQUFLLENBQUNzQyxhQUFOLENBQW9CWixHQUFwQixFQUF5QnBCLElBQUksQ0FBQ2lDLE1BQTlCLEVBQXNDWCxFQUF0QyxFQUEwQ0UsRUFBMUMsRUFBOENFLEVBQTlDLEVBQWtESSxFQUFsRCxDQUFaO0FBRUEsUUFBSUksQ0FBQyxHQUFHbEMsSUFBSSxDQUFDNkIsS0FBYjtBQUFBLFFBQ0lNLENBQUMsR0FBR25DLElBQUksQ0FBQzRCLE1BRGI7QUFBQSxRQUVJTCxDQUFDLEdBQUcsQ0FBQ3ZCLElBQUksQ0FBQ29DLE9BQU4sR0FBZ0JGLENBRnhCO0FBQUEsUUFHSVQsQ0FBQyxHQUFHLENBQUN6QixJQUFJLENBQUNxQyxPQUFOLEdBQWdCRixDQUh4QjtBQUlBVixJQUFBQSxDQUFDLEdBQUcsQ0FBRUEsQ0FBRixHQUFNVSxDQUFWO0FBRUFyQyxJQUFBQSxHQUFHLENBQUN3QyxTQUFKLENBQWNmLENBQWQsRUFBaUJFLENBQWpCO0FBQ0EzQixJQUFBQSxHQUFHLENBQUN5QyxTQUFKLEdBQWdCekMsR0FBRyxDQUFDMEMsYUFBSixDQUFrQlQsS0FBbEIsRUFBeUIsUUFBekIsQ0FBaEI7QUFDQWpDLElBQUFBLEdBQUcsQ0FBQzJDLFFBQUosQ0FBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CUCxDQUFuQixFQUFzQkMsQ0FBdEI7QUFDQSxXQUFPLENBQVA7QUFDSDs7O0VBcEMwQ08iLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IEFzc2VtYmxlciBmcm9tICcuLi8uLi8uLi9hc3NlbWJsZXInO1xuXG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbnZhc1RpbGVkU3ByaXRlIGV4dGVuZHMgQXNzZW1ibGVyIHtcbiAgICBkcmF3IChjdHgsIHNwcml0ZSkge1xuICAgICAgICBsZXQgbm9kZSA9IHNwcml0ZS5ub2RlO1xuICAgICAgICAvLyBUcmFuc2Zvcm1cbiAgICAgICAgbGV0IG1hdHJpeCA9IG5vZGUuX3dvcmxkTWF0cml4O1xuICAgICAgICBsZXQgbWF0cml4bSA9IG1hdHJpeC5tO1xuICAgICAgICBsZXQgYSA9IG1hdHJpeG1bMF0sIGIgPSBtYXRyaXhtWzFdLCBjID0gbWF0cml4bVs0XSwgZCA9IG1hdHJpeG1bNV0sXG4gICAgICAgICAgICB0eCA9IG1hdHJpeG1bMTJdLCB0eSA9IG1hdHJpeG1bMTNdO1xuICAgICAgICBjdHgudHJhbnNmb3JtKGEsIGIsIGMsIGQsIHR4LCB0eSk7XG4gICAgICAgIGN0eC5zY2FsZSgxLCAtMSk7XG5cbiAgICAgICAgLy8gVE9ETzogaGFuZGxlIGJsZW5kIGZ1bmN0aW9uXG5cbiAgICAgICAgLy8gb3BhY2l0eVxuICAgICAgICB1dGlscy5jb250ZXh0LnNldEdsb2JhbEFscGhhKGN0eCwgbm9kZS5vcGFjaXR5IC8gMjU1KTtcblxuICAgICAgICBsZXQgZnJhbWUgPSBzcHJpdGUuc3ByaXRlRnJhbWU7XG4gICAgICAgIGxldCByZWN0ID0gZnJhbWUuX3JlY3Q7XG4gICAgICAgIGxldCB0ZXggPSBmcmFtZS5fdGV4dHVyZTtcbiAgICAgICAgbGV0IHN4ID0gcmVjdC54O1xuICAgICAgICBsZXQgc3kgPSByZWN0Lnk7XG4gICAgICAgIGxldCBzdyA9IGZyYW1lLl9yb3RhdGVkID8gcmVjdC5oZWlnaHQgOiByZWN0LndpZHRoO1xuICAgICAgICBsZXQgc2ggPSBmcmFtZS5fcm90YXRlZCA/IHJlY3Qud2lkdGggOiByZWN0LmhlaWdodDtcblxuICAgICAgICBsZXQgaW1hZ2UgPSB1dGlscy5nZXRGcmFtZUNhY2hlKHRleCwgbm9kZS5fY29sb3IsIHN4LCBzeSwgc3csIHNoKTtcblxuICAgICAgICBsZXQgdyA9IG5vZGUud2lkdGgsXG4gICAgICAgICAgICBoID0gbm9kZS5oZWlnaHQsXG4gICAgICAgICAgICB4ID0gLW5vZGUuYW5jaG9yWCAqIHcsXG4gICAgICAgICAgICB5ID0gLW5vZGUuYW5jaG9yWSAqIGg7XG4gICAgICAgIHkgPSAtIHkgLSBoO1xuXG4gICAgICAgIGN0eC50cmFuc2xhdGUoeCwgeSk7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBjdHguY3JlYXRlUGF0dGVybihpbWFnZSwgJ3JlcGVhdCcpO1xuICAgICAgICBjdHguZmlsbFJlY3QoMCwgMCwgdywgaCk7XG4gICAgICAgIHJldHVybiAxO1xuICAgIH1cbn1cbiJdfQ==