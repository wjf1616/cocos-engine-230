
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/webgl/assemblers/sprite/3d/tiled.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _vec = _interopRequireDefault(require("../../../../../value-types/vec3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Assembler3D = require('../../../../assembler-3d');

var TiledAssembler = require('../2d/tiled');

var vec3_temps = [];

for (var i = 0; i < 4; i++) {
  vec3_temps.push(new _vec["default"]());
}

var TiledAssembler3D =
/*#__PURE__*/
function (_TiledAssembler) {
  _inheritsLoose(TiledAssembler3D, _TiledAssembler);

  function TiledAssembler3D() {
    return _TiledAssembler.apply(this, arguments) || this;
  }

  return TiledAssembler3D;
}(TiledAssembler);

exports["default"] = TiledAssembler3D;
cc.js.mixin(TiledAssembler3D.prototype, Assembler3D, {
  updateWorldVerts: function updateWorldVerts(sprite) {
    var local = this._local;
    var localX = local.x,
        localY = local.y;
    var world = this._renderData.vDatas[0];
    var row = this.row,
        col = this.col;
    var matrix = sprite.node._worldMatrix;
    var x, x1, y, y1;
    var vertexOffset = 0;

    for (var yindex = 0, ylength = row; yindex < ylength; ++yindex) {
      y = localY[yindex];
      y1 = localY[yindex + 1];

      for (var xindex = 0, xlength = col; xindex < xlength; ++xindex) {
        x = localX[xindex];
        x1 = localX[xindex + 1];

        _vec["default"].set(vec3_temps[0], x, y, 0);

        _vec["default"].set(vec3_temps[1], x1, y, 0);

        _vec["default"].set(vec3_temps[2], x, y1, 0);

        _vec["default"].set(vec3_temps[3], x1, y1, 0);

        for (var _i = 0; _i < 4; _i++) {
          var vec3_temp = vec3_temps[_i];

          _vec["default"].transformMat4(vec3_temp, vec3_temp, matrix);

          var offset = _i * 6;
          world[vertexOffset + offset] = vec3_temp.x;
          world[vertexOffset + offset + 1] = vec3_temp.y;
          world[vertexOffset + offset + 2] = vec3_temp.z;
        }

        vertexOffset += 24;
      }
    }
  }
});
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRpbGVkLmpzIl0sIm5hbWVzIjpbIkFzc2VtYmxlcjNEIiwicmVxdWlyZSIsIlRpbGVkQXNzZW1ibGVyIiwidmVjM190ZW1wcyIsImkiLCJwdXNoIiwiVmVjMyIsIlRpbGVkQXNzZW1ibGVyM0QiLCJjYyIsImpzIiwibWl4aW4iLCJwcm90b3R5cGUiLCJ1cGRhdGVXb3JsZFZlcnRzIiwic3ByaXRlIiwibG9jYWwiLCJfbG9jYWwiLCJsb2NhbFgiLCJ4IiwibG9jYWxZIiwieSIsIndvcmxkIiwiX3JlbmRlckRhdGEiLCJ2RGF0YXMiLCJyb3ciLCJjb2wiLCJtYXRyaXgiLCJub2RlIiwiX3dvcmxkTWF0cml4IiwieDEiLCJ5MSIsInZlcnRleE9mZnNldCIsInlpbmRleCIsInlsZW5ndGgiLCJ4aW5kZXgiLCJ4bGVuZ3RoIiwic2V0IiwidmVjM190ZW1wIiwidHJhbnNmb3JtTWF0NCIsIm9mZnNldCIsInoiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkE7Ozs7OztBQUVBLElBQU1BLFdBQVcsR0FBR0MsT0FBTyxDQUFDLDBCQUFELENBQTNCOztBQUNBLElBQU1DLGNBQWMsR0FBR0QsT0FBTyxDQUFDLGFBQUQsQ0FBOUI7O0FBRUEsSUFBSUUsVUFBVSxHQUFHLEVBQWpCOztBQUNBLEtBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxDQUFwQixFQUF1QkEsQ0FBQyxFQUF4QixFQUE0QjtBQUN4QkQsRUFBQUEsVUFBVSxDQUFDRSxJQUFYLENBQWdCLElBQUlDLGVBQUosRUFBaEI7QUFDSDs7SUFFb0JDOzs7Ozs7Ozs7O0VBQXlCTDs7O0FBSTlDTSxFQUFFLENBQUNDLEVBQUgsQ0FBTUMsS0FBTixDQUFZSCxnQkFBZ0IsQ0FBQ0ksU0FBN0IsRUFBd0NYLFdBQXhDLEVBQXFEO0FBQ2pEWSxFQUFBQSxnQkFEaUQsNEJBQy9CQyxNQUQrQixFQUN2QjtBQUN0QixRQUFJQyxLQUFLLEdBQUcsS0FBS0MsTUFBakI7QUFDQSxRQUFJQyxNQUFNLEdBQUdGLEtBQUssQ0FBQ0csQ0FBbkI7QUFBQSxRQUFzQkMsTUFBTSxHQUFHSixLQUFLLENBQUNLLENBQXJDO0FBQ0EsUUFBSUMsS0FBSyxHQUFHLEtBQUtDLFdBQUwsQ0FBaUJDLE1BQWpCLENBQXdCLENBQXhCLENBQVo7QUFIc0IsUUFJaEJDLEdBSmdCLEdBSUgsSUFKRyxDQUloQkEsR0FKZ0I7QUFBQSxRQUlYQyxHQUpXLEdBSUgsSUFKRyxDQUlYQSxHQUpXO0FBS3RCLFFBQUlDLE1BQU0sR0FBR1osTUFBTSxDQUFDYSxJQUFQLENBQVlDLFlBQXpCO0FBQ0EsUUFBSVYsQ0FBSixFQUFPVyxFQUFQLEVBQVdULENBQVgsRUFBY1UsRUFBZDtBQUNBLFFBQUlDLFlBQVksR0FBRyxDQUFuQjs7QUFDQSxTQUFLLElBQUlDLE1BQU0sR0FBRyxDQUFiLEVBQWdCQyxPQUFPLEdBQUdULEdBQS9CLEVBQW9DUSxNQUFNLEdBQUdDLE9BQTdDLEVBQXNELEVBQUVELE1BQXhELEVBQWdFO0FBQzVEWixNQUFBQSxDQUFDLEdBQUdELE1BQU0sQ0FBQ2EsTUFBRCxDQUFWO0FBQ0FGLE1BQUFBLEVBQUUsR0FBR1gsTUFBTSxDQUFDYSxNQUFNLEdBQUcsQ0FBVixDQUFYOztBQUNBLFdBQUssSUFBSUUsTUFBTSxHQUFHLENBQWIsRUFBZ0JDLE9BQU8sR0FBR1YsR0FBL0IsRUFBb0NTLE1BQU0sR0FBR0MsT0FBN0MsRUFBc0QsRUFBRUQsTUFBeEQsRUFBZ0U7QUFDNURoQixRQUFBQSxDQUFDLEdBQUdELE1BQU0sQ0FBQ2lCLE1BQUQsQ0FBVjtBQUNBTCxRQUFBQSxFQUFFLEdBQUdaLE1BQU0sQ0FBQ2lCLE1BQU0sR0FBRyxDQUFWLENBQVg7O0FBRUEzQix3QkFBSzZCLEdBQUwsQ0FBU2hDLFVBQVUsQ0FBQyxDQUFELENBQW5CLEVBQXdCYyxDQUF4QixFQUEyQkUsQ0FBM0IsRUFBOEIsQ0FBOUI7O0FBQ0FiLHdCQUFLNkIsR0FBTCxDQUFTaEMsVUFBVSxDQUFDLENBQUQsQ0FBbkIsRUFBd0J5QixFQUF4QixFQUE0QlQsQ0FBNUIsRUFBK0IsQ0FBL0I7O0FBQ0FiLHdCQUFLNkIsR0FBTCxDQUFTaEMsVUFBVSxDQUFDLENBQUQsQ0FBbkIsRUFBd0JjLENBQXhCLEVBQTJCWSxFQUEzQixFQUErQixDQUEvQjs7QUFDQXZCLHdCQUFLNkIsR0FBTCxDQUFTaEMsVUFBVSxDQUFDLENBQUQsQ0FBbkIsRUFBd0J5QixFQUF4QixFQUE0QkMsRUFBNUIsRUFBZ0MsQ0FBaEM7O0FBRUEsYUFBSyxJQUFJekIsRUFBQyxHQUFHLENBQWIsRUFBZ0JBLEVBQUMsR0FBRyxDQUFwQixFQUF1QkEsRUFBQyxFQUF4QixFQUE0QjtBQUN4QixjQUFJZ0MsU0FBUyxHQUFHakMsVUFBVSxDQUFDQyxFQUFELENBQTFCOztBQUNBRSwwQkFBSytCLGFBQUwsQ0FBbUJELFNBQW5CLEVBQThCQSxTQUE5QixFQUF5Q1gsTUFBekM7O0FBQ0EsY0FBSWEsTUFBTSxHQUFHbEMsRUFBQyxHQUFHLENBQWpCO0FBQ0FnQixVQUFBQSxLQUFLLENBQUNVLFlBQVksR0FBR1EsTUFBaEIsQ0FBTCxHQUErQkYsU0FBUyxDQUFDbkIsQ0FBekM7QUFDQUcsVUFBQUEsS0FBSyxDQUFDVSxZQUFZLEdBQUdRLE1BQWYsR0FBd0IsQ0FBekIsQ0FBTCxHQUFtQ0YsU0FBUyxDQUFDakIsQ0FBN0M7QUFDQUMsVUFBQUEsS0FBSyxDQUFDVSxZQUFZLEdBQUdRLE1BQWYsR0FBd0IsQ0FBekIsQ0FBTCxHQUFtQ0YsU0FBUyxDQUFDRyxDQUE3QztBQUNIOztBQUVEVCxRQUFBQSxZQUFZLElBQUksRUFBaEI7QUFDSDtBQUNKO0FBQ0o7QUFqQ2dELENBQXJEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IFZlYzMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vdmFsdWUtdHlwZXMvdmVjMyc7XG5cbmNvbnN0IEFzc2VtYmxlcjNEID0gcmVxdWlyZSgnLi4vLi4vLi4vLi4vYXNzZW1ibGVyLTNkJyk7XG5jb25zdCBUaWxlZEFzc2VtYmxlciA9IHJlcXVpcmUoJy4uLzJkL3RpbGVkJyk7XG5cbmxldCB2ZWMzX3RlbXBzID0gW107XG5mb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgIHZlYzNfdGVtcHMucHVzaChuZXcgVmVjMyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbGVkQXNzZW1ibGVyM0QgZXh0ZW5kcyBUaWxlZEFzc2VtYmxlciB7XG4gICAgXG59XG5cbmNjLmpzLm1peGluKFRpbGVkQXNzZW1ibGVyM0QucHJvdG90eXBlLCBBc3NlbWJsZXIzRCwge1xuICAgIHVwZGF0ZVdvcmxkVmVydHMgKHNwcml0ZSkge1xuICAgICAgICBsZXQgbG9jYWwgPSB0aGlzLl9sb2NhbDtcbiAgICAgICAgbGV0IGxvY2FsWCA9IGxvY2FsLngsIGxvY2FsWSA9IGxvY2FsLnk7XG4gICAgICAgIGxldCB3b3JsZCA9IHRoaXMuX3JlbmRlckRhdGEudkRhdGFzWzBdO1xuICAgICAgICBsZXQgeyByb3csIGNvbCB9ID0gdGhpcztcbiAgICAgICAgbGV0IG1hdHJpeCA9IHNwcml0ZS5ub2RlLl93b3JsZE1hdHJpeDtcbiAgICAgICAgbGV0IHgsIHgxLCB5LCB5MTtcbiAgICAgICAgbGV0IHZlcnRleE9mZnNldCA9IDA7XG4gICAgICAgIGZvciAobGV0IHlpbmRleCA9IDAsIHlsZW5ndGggPSByb3c7IHlpbmRleCA8IHlsZW5ndGg7ICsreWluZGV4KSB7XG4gICAgICAgICAgICB5ID0gbG9jYWxZW3lpbmRleF07XG4gICAgICAgICAgICB5MSA9IGxvY2FsWVt5aW5kZXggKyAxXTtcbiAgICAgICAgICAgIGZvciAobGV0IHhpbmRleCA9IDAsIHhsZW5ndGggPSBjb2w7IHhpbmRleCA8IHhsZW5ndGg7ICsreGluZGV4KSB7XG4gICAgICAgICAgICAgICAgeCA9IGxvY2FsWFt4aW5kZXhdO1xuICAgICAgICAgICAgICAgIHgxID0gbG9jYWxYW3hpbmRleCArIDFdO1xuXG4gICAgICAgICAgICAgICAgVmVjMy5zZXQodmVjM190ZW1wc1swXSwgeCwgeSwgMCk7XG4gICAgICAgICAgICAgICAgVmVjMy5zZXQodmVjM190ZW1wc1sxXSwgeDEsIHksIDApO1xuICAgICAgICAgICAgICAgIFZlYzMuc2V0KHZlYzNfdGVtcHNbMl0sIHgsIHkxLCAwKTtcbiAgICAgICAgICAgICAgICBWZWMzLnNldCh2ZWMzX3RlbXBzWzNdLCB4MSwgeTEsIDApO1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZlYzNfdGVtcCA9IHZlYzNfdGVtcHNbaV07XG4gICAgICAgICAgICAgICAgICAgIFZlYzMudHJhbnNmb3JtTWF0NCh2ZWMzX3RlbXAsIHZlYzNfdGVtcCwgbWF0cml4KTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9mZnNldCA9IGkgKiA2O1xuICAgICAgICAgICAgICAgICAgICB3b3JsZFt2ZXJ0ZXhPZmZzZXQgKyBvZmZzZXRdID0gdmVjM190ZW1wLng7XG4gICAgICAgICAgICAgICAgICAgIHdvcmxkW3ZlcnRleE9mZnNldCArIG9mZnNldCArIDFdID0gdmVjM190ZW1wLnk7XG4gICAgICAgICAgICAgICAgICAgIHdvcmxkW3ZlcnRleE9mZnNldCArIG9mZnNldCArIDJdID0gdmVjM190ZW1wLno7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmVydGV4T2Zmc2V0ICs9IDI0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG4iXX0=