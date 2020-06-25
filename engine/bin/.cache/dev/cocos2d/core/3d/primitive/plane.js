
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/primitive/plane.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}'use strict';

exports.__esModule = true;
exports["default"] = _default;

var _vec = _interopRequireDefault(require("../../value-types/vec3"));

var _vertexData = _interopRequireDefault(require("./vertex-data"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var temp1 = new _vec["default"]();
var temp2 = new _vec["default"]();
var temp3 = new _vec["default"]();
var r = new _vec["default"]();
var c00 = new _vec["default"]();
var c10 = new _vec["default"]();
var c01 = new _vec["default"]();
/**
 * @param {Number} width
 * @param {Number} length
 * @param {Object} opts
 * @param {Number} opts.widthSegments
 * @param {Number} opts.lengthSegments
 */

function _default(width, length, opts) {
  if (width === void 0) {
    width = 10;
  }

  if (length === void 0) {
    length = 10;
  }

  if (opts === void 0) {
    opts = {
      widthSegments: 10,
      lengthSegments: 10
    };
  }

  var uSegments = opts.widthSegments;
  var vSegments = opts.lengthSegments;
  var hw = width * 0.5;
  var hl = length * 0.5;
  var positions = [];
  var normals = [];
  var uvs = [];
  var indices = [];
  var minPos = new _vec["default"](-hw, 0, -hl);
  var maxPos = new _vec["default"](hw, 0, hl);
  var boundingRadius = Math.sqrt(width * width + length * length);

  _vec["default"].set(c00, -hw, 0, hl);

  _vec["default"].set(c10, hw, 0, hl);

  _vec["default"].set(c01, -hw, 0, -hl);

  for (var y = 0; y <= vSegments; y++) {
    for (var x = 0; x <= uSegments; x++) {
      var u = x / uSegments;
      var v = y / vSegments;

      _vec["default"].lerp(temp1, c00, c10, u);

      _vec["default"].lerp(temp2, c00, c01, v);

      _vec["default"].sub(temp3, temp2, c00);

      _vec["default"].add(r, temp1, temp3);

      positions.push(r.x, r.y, r.z);
      normals.push(0, 1, 0);
      uvs.push(u, v);

      if (x < uSegments && y < vSegments) {
        var useg1 = uSegments + 1;
        var a = x + y * useg1;
        var b = x + (y + 1) * useg1;
        var c = x + 1 + (y + 1) * useg1;
        var d = x + 1 + y * useg1;
        indices.push(a, d, b);
        indices.push(d, c, b);
      }
    }
  }

  return new _vertexData["default"](positions, normals, uvs, indices, minPos, maxPos, boundingRadius);
}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBsYW5lLnRzIl0sIm5hbWVzIjpbInRlbXAxIiwiVmVjMyIsInRlbXAyIiwidGVtcDMiLCJyIiwiYzAwIiwiYzEwIiwiYzAxIiwid2lkdGgiLCJsZW5ndGgiLCJvcHRzIiwid2lkdGhTZWdtZW50cyIsImxlbmd0aFNlZ21lbnRzIiwidVNlZ21lbnRzIiwidlNlZ21lbnRzIiwiaHciLCJobCIsInBvc2l0aW9ucyIsIm5vcm1hbHMiLCJ1dnMiLCJpbmRpY2VzIiwibWluUG9zIiwibWF4UG9zIiwiYm91bmRpbmdSYWRpdXMiLCJNYXRoIiwic3FydCIsInNldCIsInkiLCJ4IiwidSIsInYiLCJsZXJwIiwic3ViIiwiYWRkIiwicHVzaCIsInoiLCJ1c2VnMSIsImEiLCJiIiwiYyIsImQiLCJWZXJ0ZXhEYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOzs7OztBQUVBOztBQUNBOzs7O0FBRUEsSUFBSUEsS0FBSyxHQUFHLElBQUlDLGVBQUosRUFBWjtBQUNBLElBQUlDLEtBQUssR0FBRyxJQUFJRCxlQUFKLEVBQVo7QUFDQSxJQUFJRSxLQUFLLEdBQUcsSUFBSUYsZUFBSixFQUFaO0FBQ0EsSUFBSUcsQ0FBQyxHQUFHLElBQUlILGVBQUosRUFBUjtBQUNBLElBQUlJLEdBQUcsR0FBRyxJQUFJSixlQUFKLEVBQVY7QUFDQSxJQUFJSyxHQUFHLEdBQUcsSUFBSUwsZUFBSixFQUFWO0FBQ0EsSUFBSU0sR0FBRyxHQUFHLElBQUlOLGVBQUosRUFBVjtBQUVBOzs7Ozs7OztBQU9lLGtCQUFVTyxLQUFWLEVBQXNCQyxNQUF0QixFQUFtQ0MsSUFBbkMsRUFBbUY7QUFBQSxNQUF6RUYsS0FBeUU7QUFBekVBLElBQUFBLEtBQXlFLEdBQWpFLEVBQWlFO0FBQUE7O0FBQUEsTUFBN0RDLE1BQTZEO0FBQTdEQSxJQUFBQSxNQUE2RCxHQUFwRCxFQUFvRDtBQUFBOztBQUFBLE1BQWhEQyxJQUFnRDtBQUFoREEsSUFBQUEsSUFBZ0QsR0FBekM7QUFBQ0MsTUFBQUEsYUFB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QUlJLENBQUMsR0FBSVosQ0FBQyxHQUFHLENBQUwsR0FBVUQsQ0FBQyxHQUFHUyxLQUF0QjtBQUVBaEIsUUFBQUEsT0FBTyxDQUFDYyxJQUFSLENBQWFHLENBQWIsRUFBZ0JHLENBQWhCLEVBQW1CRixDQUFuQjtBQUNBbEIsUUFBQUEsT0FBTyxDQUFDYyxJQUFSLENBQWFNLENBQWIsRUFBZ0JELENBQWhCLEVBQW1CRCxDQUFuQjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxTQUFPLElBQUlHLHNCQUFKLENBQ0x4QixTQURLLEVBRUxDLE9BRkssRUFHTEMsR0FISyxFQUlMQyxPQUpLLEVBS0xDLE1BTEssRUFNTEMsTUFOSyxFQU9MQyxjQVBLLENBQVA7QUFTRCIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IFZlYzMgZnJvbSAnLi4vLi4vdmFsdWUtdHlwZXMvdmVjMyc7XG5pbXBvcnQgVmVydGV4RGF0YSBmcm9tICcuL3ZlcnRleC1kYXRhJztcblxubGV0IHRlbXAxID0gbmV3IFZlYzMoKTtcbmxldCB0ZW1wMiA9IG5ldyBWZWMzKCk7XG5sZXQgdGVtcDMgPSBuZXcgVmVjMygpO1xubGV0IHIgPSBuZXcgVmVjMygpO1xubGV0IGMwMCA9IG5ldyBWZWMzKCk7XG5sZXQgYzEwID0gbmV3IFZlYzMoKTtcbmxldCBjMDEgPSBuZXcgVmVjMygpO1xuXG4vKipcbiAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aFxuICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aFxuICogQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAqIEBwYXJhbSB7TnVtYmVyfSBvcHRzLndpZHRoU2VnbWVudHNcbiAqIEBwYXJhbSB7TnVtYmVyfSBvcHRzLmxlbmd0aFNlZ21lbnRzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICh3aWR0aCA9IDEwLCBsZW5ndGggPSAxMCwgb3B0cyA9IHt3aWR0aFNlZ21lbnRzOiAxMCwgbGVuZ3RoU2VnbWVudHM6IDEwfSkge1xuICBsZXQgdVNlZ21lbnRzID0gb3B0cy53aWR0aFNlZ21lbnRzO1xuICBsZXQgdlNlZ21lbnRzID0gb3B0cy5sZW5ndGhTZWdtZW50cztcblxuICBsZXQgaHcgPSB3aWR0aCAqIDAuNTtcbiAgbGV0IGhsID0gbGVuZ3RoICogMC41O1xuXG4gIGxldCBwb3NpdGlvbnM6IG51bWJlcltdID0gW107XG4gIGxldCBub3JtYWxzOiBudW1iZXJbXSA9IFtdO1xuICBsZXQgdXZzOiBudW1iZXJbXSA9IFtdO1xuICBsZXQgaW5kaWNlczogbnVtYmVyW10gPSBbXTtcbiAgbGV0IG1pblBvcyA9IG5ldyBWZWMzKC1odywgMCwgLWhsKTtcbiAgbGV0IG1heFBvcyA9IG5ldyBWZWMzKGh3LCAwLCBobCk7XG4gIGxldCBib3VuZGluZ1JhZGl1cyA9IE1hdGguc3FydCh3aWR0aCAqIHdpZHRoICsgbGVuZ3RoICogbGVuZ3RoKTtcblxuICBWZWMzLnNldChjMDAsIC1odywgMCwgIGhsKTtcbiAgVmVjMy5zZXQoYzEwLCAgaHcsIDAsICBobCk7XG4gIFZlYzMuc2V0KGMwMSwgLWh3LCAwLCAtaGwpO1xuXG4gIGZvciAobGV0IHkgPSAwOyB5IDw9IHZTZWdtZW50czsgeSsrKSB7XG4gICAgZm9yIChsZXQgeCA9IDA7IHggPD0gdVNlZ21lbnRzOyB4KyspIHtcbiAgICAgIGxldCB1ID0geCAvIHVTZWdtZW50cztcbiAgICAgIGxldCB2ID0geSAvIHZTZWdtZW50cztcblxuICAgICAgVmVjMy5sZXJwKHRlbXAxLCBjMDAsIGMxMCwgdSk7XG4gICAgICBWZWMzLmxlcnAodGVtcDIsIGMwMCwgYzAxLCB2KTtcbiAgICAgIFZlYzMuc3ViKHRlbXAzLCB0ZW1wMiwgYzAwKTtcbiAgICAgIFZlYzMuYWRkKHIsIHRlbXAxLCB0ZW1wMyk7XG5cbiAgICAgIHBvc2l0aW9ucy5wdXNoKHIueCwgci55LCByLnopO1xuICAgICAgbm9ybWFscy5wdXNoKDAsIDEsIDApO1xuICAgICAgdXZzLnB1c2godSwgdik7XG5cbiAgICAgIGlmICgoeCA8IHVTZWdtZW50cykgJiYgKHkgPCB2U2VnbWVudHMpKSB7XG4gICAgICAgIGxldCB1c2VnMSA9IHVTZWdtZW50cyArIDE7XG4gICAgICAgIGxldCBhID0geCArIHkgKiB1c2VnMTtcbiAgICAgICAgbGV0IGIgPSB4ICsgKHkgKyAxKSAqIHVzZWcxO1xuICAgICAgICBsZXQgYyA9ICh4ICsgMSkgKyAoeSArIDEpICogdXNlZzE7XG4gICAgICAgIGxldCBkID0gKHggKyAxKSArIHkgKiB1c2VnMTtcblxuICAgICAgICBpbmRpY2VzLnB1c2goYSwgZCwgYik7XG4gICAgICAgIGluZGljZXMucHVzaChkLCBjLCBiKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3IFZlcnRleERhdGEoXG4gICAgcG9zaXRpb25zLFxuICAgIG5vcm1hbHMsXG4gICAgdXZzLFxuICAgIGluZGljZXMsXG4gICAgbWluUG9zLFxuICAgIG1heFBvcyxcbiAgICBib3VuZGluZ1JhZGl1c1xuICApO1xufVxuIl19