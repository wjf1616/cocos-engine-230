
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/primitive/box.js';
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
var c0 = new _vec["default"]();
var c1 = new _vec["default"]();
var c2 = new _vec["default"]();
var c3 = new _vec["default"]();
var c4 = new _vec["default"]();
var c5 = new _vec["default"]();
var c6 = new _vec["default"]();
var c7 = new _vec["default"]();
/**
 * @param {Number} width
 * @param {Number} height
 * @param {Number} length
 * @param {Object} opts
 * @param {Number} opts.widthSegments
 * @param {Number} opts.heightSegments
 * @param {Number} opts.lengthSegments
 */

function _default(width, height, length, opts) {
  if (width === void 0) {
    width = 1;
  }

  if (height === void 0) {
    height = 1;
  }

  if (length === void 0) {
    length = 1;
  }

  if (opts === void 0) {
    opts = {
      widthSegments: 1,
      heightSegments: 1,
      lengthSegments: 1,
      invWinding: false
    };
  }

  var ws = opts.widthSegments;
  var hs = opts.heightSegments;
  var ls = opts.lengthSegments;
  var inv = opts.invWinding;
  var hw = width * 0.5;
  var hh = height * 0.5;
  var hl = length * 0.5;
  var corners = [_vec["default"].set(c0, -hw, -hh, hl), _vec["default"].set(c1, hw, -hh, hl), _vec["default"].set(c2, hw, hh, hl), _vec["default"].set(c3, -hw, hh, hl), _vec["default"].set(c4, hw, -hh, -hl), _vec["default"].set(c5, -hw, -hh, -hl), _vec["default"].set(c6, -hw, hh, -hl), _vec["default"].set(c7, hw, hh, -hl)];
  var faceAxes = [[2, 3, 1], // FRONT
  [4, 5, 7], // BACK
  [7, 6, 2], // TOP
  [1, 0, 4], // BOTTOM
  [1, 4, 2], // RIGHT
  [5, 0, 6] // LEFT
  ];
  var faceNormals = [[0, 0, 1], // FRONT
  [0, 0, -1], // BACK
  [0, 1, 0], // TOP
  [0, -1, 0], // BOTTOM
  [1, 0, 0], // RIGHT
  [-1, 0, 0] // LEFT
  ];
  var positions = [];
  var normals = [];
  var uvs = [];
  var indices = [];
  var minPos = new _vec["default"](-hw, -hh, -hl);
  var maxPos = new _vec["default"](hw, hh, hl);
  var boundingRadius = Math.sqrt(hw * hw + hh * hh + hl * hl);

  function _buildPlane(side, uSegments, vSegments) {
    var u, v;
    var ix, iy;
    var offset = positions.length / 3;
    var faceAxe = faceAxes[side];
    var faceNormal = faceNormals[side];

    for (iy = 0; iy <= vSegments; iy++) {
      for (ix = 0; ix <= uSegments; ix++) {
        u = ix / uSegments;
        v = iy / vSegments;

        _vec["default"].lerp(temp1, corners[faceAxe[0]], corners[faceAxe[1]], u);

        _vec["default"].lerp(temp2, corners[faceAxe[0]], corners[faceAxe[2]], v);

        _vec["default"].subtract(temp3, temp2, corners[faceAxe[0]]);

        _vec["default"].add(r, temp1, temp3);

        positions.push(r.x, r.y, r.z);
        normals.push(faceNormal[0], faceNormal[1], faceNormal[2]);
        uvs.push(u, v);

        if (ix < uSegments && iy < vSegments) {
          var useg1 = uSegments + 1;
          var a = ix + iy * useg1;
          var b = ix + (iy + 1) * useg1;
          var c = ix + 1 + (iy + 1) * useg1;
          var d = ix + 1 + iy * useg1;

          if (inv) {
            indices.push(offset + a, offset + b, offset + d);
            indices.push(offset + d, offset + b, offset + c);
          } else {
            indices.push(offset + a, offset + d, offset + b);
            indices.push(offset + b, offset + d, offset + c);
          }
        }
      }
    }
  }

  _buildPlane(0, ws, hs); // FRONT


  _buildPlane(4, ls, hs); // RIGHT


  _buildPlane(1, ws, hs); // BACK


  _buildPlane(5, ls, hs); // LEFT


  _buildPlane(3, ws, ls); // BOTTOM


  _buildPlane(2, ws, ls); // TOP


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJveC50cyJdLCJuYW1lcyI6WyJ0ZW1wMSIsIlZlYzMiLCJ0ZW1wMiIsInRlbXAzIiwiciIsImMwIiwiYzEiLCJjMiIsImMzIiwiYzQiLCJjNSIsImM2IiwiYzciLCJ3aWR0aCIsImhlaWdodCIsImxlbmd0aCIsIm9wdHMiLCJ3aWR0aFNlZ21lbnRzIiwiaGVpZ2h0U2VnbWVudHMiLCJsZW5ndGhTZWdtZW50cyIsImludldpbmRpbmciLCJ3cyIsImhzIiwibHMiLCJpbnYiLCJodyIsImhoIiwiaGwiLCJjb3JuZXJzIiwic2V0IiwiZmFjZUF4ZXMiLCJmYWNlTm9ybWFscyIsInBvc2l0aW9ucyIsIm5vcm1hbHMiLCJ1dnMiLCJpbmRpY2VzIiwibWluUG9zIiwibWF4UG9zIiwiYm91bmRpbmdSYWRpdXMiLCJNYXRoIiwic3FydCIsIl9idWlsZFBsYW5lIiwic2lkZSIsInVTZWdtZW50cyIsInZTZWdtZW50cyIsInUiLCJ2IiwiaXgiLCJpeSIsIm9mZnNldCIsImZhY2VBeGUiLCJmYWNlTm9ybWFsIiwibGVycCIsInN1YnRyYWN0IiwiYWRkIiwicHVzaCIsIngiLCJ5IiwieiIsInVzZWcxIiwiYSIsImIiLCJjIiwiZCIsIlZlcnRleERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7Ozs7O0FBRUE7O0FBQ0E7Ozs7QUFFQSxJQUFJQSxLQUFLLEdBQUcsSUFBSUMsZUFBSixFQUFaO0FBQ0EsSUFBSUMsS0FBSyxHQUFHLElBQUlELGVBQUosRUFBWjtBQUNBLElBQUlFLEtBQUssR0FBRyxJQUFJRixlQUFKLEVBQVo7QUFDQSxJQUFJRyxDQUFDLEdBQUcsSUFBSUgsZUFBSixFQUFSO0FBQ0EsSUFBSUksRUFBRSxHQUFHLElBQUlKLGVBQUosRUFBVDtBQUNBLElBQUlLLEVBQUUsR0FBRyxJQUFJTCxlQUFKLEVBQVQ7QUFDQSxJQUFJTSxFQUFFLEdBQUcsSUFBSU4sZUFBSixFQUFUO0FBQ0EsSUFBSU8sRUFBRSxHQUFHLElBQUlQLGVBQUosRUFBVDtBQUNBLElBQUlRLEVBQUUsR0FBRyxJQUFJUixlQUFKLEVBQVQ7QUFDQSxJQUFJUyxFQUFFLEdBQUcsSUFBSVQsZUFBSixFQUFUO0FBQ0EsSUFBSVUsRUFBRSxHQUFHLElBQUlWLGVBQUosRUFBVDtBQUNBLElBQUlXLEVBQUUsR0FBRyxJQUFJWCxlQUFKLEVBQVQ7QUFFQTs7Ozs7Ozs7OztBQVNlLGtCQUFVWSxLQUFWLEVBQXFCQyxNQUFyQixFQUFpQ0MsTUFBakMsRUFBNkNDLElBQTdDLEVBQWlJO0FBQUEsTUFBdkhILEtBQXVIO0FBQXZIQSxJQUFBQSxLQUF1SCxHQUEvRyxDQUErRztBQUFBOztBQUFBLE1BQTVHQyxNQUE0RztBQUE1R0EsSUFBQUEsTUFBNEcsR0FBbkcsQ0FBbUc7QUFBQTs7QUFBQSxNQUFoR0MsTUFBZ0c7QUFBaEdBLElBQUFBLE1BQWdHLEdBQXZGLENBQXVGO0FBQUE7O0FBQUEsTUFBcEZDLElBQW9GO0FBQXBGQSxJQUFBQSxJQUFvRixHQUE3RTtBQUFDQyxNQUFBQSxhQUFhLEVBQUUsQ0FBaEI7QUFBbUJDLE1BQUFBLGNBQWMsRUFBRSxDQUFuQztBQUFzQ0MsTUFBQUEsY0FBYyxFQUFFLENBQXREO0FBQXlEQyxNQUFBQSxVQUFVLEVBQUU7QUFBckUsS0FBNkU7QUFBQTs7QUFDOUksTUFBSUMsRUFBRSxHQUFHTCxJQUFJLENBQUNDLGFBQWQ7QUFDQSxNQUFJSyxFQUFFLEdBQUdOLElBQUksQ0FBQ0UsY0FBZDtBQUNBLE1BQUlLLEVBQUUsR0FBR1AsSUFBSSxDQUFDRyxjQUFkO0FBQ0EsTUFBSUssR0FBRyxHQUFHUixJQUFJLENBQUNJLFVBQWY7QUFFQSxNQUFJSyxFQUFFLEdBQUdaLEtBQUssR0FBRyxHQUFqQjtBQUNBLE1BQUlhLEVBQUUsR0FBR1osTUFBTSxHQUFHLEdBQWxCO0FBQ0EsTUFBSWEsRUFBRSxHQUFHWixNQUFNLEdBQUcsR0FBbEI7QUFFQSxNQUFJYSxPQUFPLEdBQUcsQ0FDWjNCLGdCQUFLNEIsR0FBTCxDQUFTeEIsRUFBVCxFQUFhLENBQUNvQixFQUFkLEVBQWtCLENBQUNDLEVBQW5CLEVBQXdCQyxFQUF4QixDQURZLEVBRVoxQixnQkFBSzRCLEdBQUwsQ0FBU3ZCLEVBQVQsRUFBY21CLEVBQWQsRUFBa0IsQ0FBQ0MsRUFBbkIsRUFBd0JDLEVBQXhCLENBRlksRUFHWjFCLGdCQUFLNEIsR0FBTCxDQUFTdEIsRUFBVCxFQUFja0IsRUFBZCxFQUFtQkMsRUFBbkIsRUFBd0JDLEVBQXhCLENBSFksRUFJWjFCLGdCQUFLNEIsR0FBTCxDQUFTckIsRUFBVCxFQUFhLENBQUNpQixFQUFkLEVBQW1CQyxFQUFuQixFQUF3QkMsRUFBeEIsQ0FKWSxFQUtaMUIsZ0JBQUs0QixHQUFMLENBQVNwQixFQUFULEVBQWNnQixFQUFkLEVBQWtCLENBQUNDLEVBQW5CLEVBQXVCLENBQUNDLEVBQXhCLENBTFksRUFNWjFCLGdCQUFLNEIsR0FBTCxDQUFTbkIsRUFBVCxFQUFhLENBQUNlLEVBQWQsRUFBa0IsQ0FBQ0MsRUFBbkIsRUFBdUIsQ0FBQ0MsRUFBeEIsQ0FOWSxFQU9aMUIsZ0JBQUs0QixHQUFMLENBQVNsQixFQUFULEVBQWEsQ0FBQ2MsRUFBZCxFQUFtQkMsRUFBbkIsRUFBdUIsQ0FBQ0MsRUFBeEIsQ0FQWSxFQVFaMUIsZ0JBQUs0QixHQUFMLENBQVNqQixFQUFULEVBQWNhLEVBQWQsRUFBbUJDLEVBQW5CLEVBQXVCLENBQUNDLEVBQXhCLENBUlksQ0FBZDtBQVdBLE1BQUlHLFFBQVEsR0FBRyxDQUNiLENBQUUsQ0FBRixFQUFLLENBQUwsRUFBUSxDQUFSLENBRGEsRUFDQTtBQUNiLEdBQUUsQ0FBRixFQUFLLENBQUwsRUFBUSxDQUFSLENBRmEsRUFFQTtBQUNiLEdBQUUsQ0FBRixFQUFLLENBQUwsRUFBUSxDQUFSLENBSGEsRUFHQTtBQUNiLEdBQUUsQ0FBRixFQUFLLENBQUwsRUFBUSxDQUFSLENBSmEsRUFJQTtBQUNiLEdBQUUsQ0FBRixFQUFLLENBQUwsRUFBUSxDQUFSLENBTGEsRUFLQTtBQUNiLEdBQUUsQ0FBRixFQUFLLENBQUwsRUFBUSxDQUFSLENBTmEsQ0FNQTtBQU5BLEdBQWY7QUFTQSxNQUFJQyxXQUFXLEdBQUcsQ0FDaEIsQ0FBRyxDQUFILEVBQU8sQ0FBUCxFQUFXLENBQVgsQ0FEZ0IsRUFDQTtBQUNoQixHQUFHLENBQUgsRUFBTyxDQUFQLEVBQVUsQ0FBQyxDQUFYLENBRmdCLEVBRUE7QUFDaEIsR0FBRyxDQUFILEVBQU8sQ0FBUCxFQUFXLENBQVgsQ0FIZ0IsRUFHQTtBQUNoQixHQUFHLENBQUgsRUFBTSxDQUFDLENBQVAsRUFBVyxDQUFYLENBSmdCLEVBSUE7QUFDaEIsR0FBRyxDQUFILEVBQU8sQ0FBUCxFQUFXLENBQVgsQ0FMZ0IsRUFLQTtBQUNoQixHQUFFLENBQUMsQ0FBSCxFQUFPLENBQVAsRUFBVyxDQUFYLENBTmdCLENBTUE7QUFOQSxHQUFsQjtBQVNBLE1BQUlDLFNBQW1CLEdBQUcsRUFBMUI7QUFDQSxNQUFJQyxPQUFpQixHQUFHLEVBQXhCO0FBQ0EsTUFBSUMsR0FBYSxHQUFHLEVBQXBCO0FBQ0EsTUFBSUMsT0FBaUIsR0FBRyxFQUF4QjtBQUNBLE1BQUlDLE1BQU0sR0FBRyxJQUFJbkMsZUFBSixDQUFTLENBQUN3QixFQUFWLEVBQWMsQ0FBQ0MsRUFBZixFQUFtQixDQUFDQyxFQUFwQixDQUFiO0FBQ0EsTUFBSVUsTUFBTSxHQUFHLElBQUlwQyxlQUFKLENBQVN3QixFQUFULEVBQWFDLEVBQWIsRUFBaUJDLEVBQWpCLENBQWI7QUFDQSxNQUFJVyxjQUFjLEdBQUdDLElBQUksQ0FBQ0MsSUFBTCxDQUFVZixFQUFFLEdBQUdBLEVBQUwsR0FBVUMsRUFBRSxHQUFHQSxFQUFmLEdBQW9CQyxFQUFFLEdBQUdBLEVBQW5DLENBQXJCOztBQUVBLFdBQVNjLFdBQVQsQ0FBc0JDLElBQXRCLEVBQTRCQyxTQUE1QixFQUF1Q0MsU0FBdkMsRUFBa0Q7QUFDaEQsUUFBSUMsQ0FBSixFQUFPQyxDQUFQO0FBQ0EsUUFBSUMsRUFBSixFQUFRQyxFQUFSO0FBQ0EsUUFBSUMsTUFBTSxHQUFHakIsU0FBUyxDQUFDakIsTUFBVixHQUFtQixDQUFoQztBQUNBLFFBQUltQyxPQUFPLEdBQUdwQixRQUFRLENBQUNZLElBQUQsQ0FBdEI7QUFDQSxRQUFJUyxVQUFVLEdBQUdwQixXQUFXLENBQUNXLElBQUQsQ0FBNUI7O0FBRUEsU0FBS00sRUFBRSxHQUFHLENBQVYsRUFBYUEsRUFBRSxJQUFJSixTQUFuQixFQUE4QkksRUFBRSxFQUFoQyxFQUFvQztBQUNsQyxXQUFLRCxFQUFFLEdBQUcsQ0FBVixFQUFhQSxFQUFFLElBQUlKLFNBQW5CLEVBQThCSSxFQUFFLEVBQWhDLEVBQW9DO0FBQ2xDRixRQUFBQSxDQUFDLEdBQUdFLEVBQUUsR0FBR0osU0FBVDtBQUNBRyxRQUFBQSxDQUFDLEdBQUdFLEVBQUUsR0FBR0osU0FBVDs7QUFFQTNDLHdCQUFLbUQsSUFBTCxDQUFVcEQsS0FBVixFQUFpQjRCLE9BQU8sQ0FBQ3NCLE9BQU8sQ0FBQyxDQUFELENBQVIsQ0FBeEIsRUFBc0N0QixPQUFPLENBQUNzQixPQUFPLENBQUMsQ0FBRCxDQUFSLENBQTdDLEVBQTJETCxDQUEzRDs7QUFDQTVDLHdCQUFLbUQsSUFBTCxDQUFVbEQsS0FBVixFQUFpQjBCLE9BQU8sQ0FBQ3NCLE9BQU8sQ0FBQyxDQUFELENBQVIsQ0FBeEIsRUFBc0N0QixPQUFPLENBQUNzQixPQUFPLENBQUMsQ0FBRCxDQUFSLENBQTdDLEVBQTJESixDQUEzRDs7QUFDQTdDLHdCQUFLb0QsUUFBTCxDQUFjbEQsS0FBZCxFQUFxQkQsS0FBckIsRUFBNEIwQixPQUFPLENBQUNzQixPQUFPLENBQUMsQ0FBRCxDQUFSLENBQW5DOztBQUNBakQsd0JBQUtxRCxHQUFMLENBQVNsRCxDQUFULEVBQVlKLEtBQVosRUFBbUJHLEtBQW5COztBQUVBNkIsUUFBQUEsU0FBUyxDQUFDdUIsSUFBVixDQUFlbkQsQ0FBQyxDQUFDb0QsQ0FBakIsRUFBb0JwRCxDQUFDLENBQUNxRCxDQUF0QixFQUF5QnJELENBQUMsQ0FBQ3NELENBQTNCO0FBQ0F6QixRQUFBQSxPQUFPLENBQUNzQixJQUFSLENBQWFKLFVBQVUsQ0FBQyxDQUFELENBQXZCLEVBQTRCQSxVQUFVLENBQUMsQ0FBRCxDQUF0QyxFQUEyQ0EsVUFBVSxDQUFDLENBQUQsQ0FBckQ7QUFDQWpCLFFBQUFBLEdBQUcsQ0FBQ3FCLElBQUosQ0FBU1YsQ0FBVCxFQUFZQyxDQUFaOztBQUVBLFlBQUtDLEVBQUUsR0FBR0osU0FBTixJQUFxQkssRUFBRSxHQUFHSixTQUE5QixFQUEwQztBQUN4QyxjQUFJZSxLQUFLLEdBQUdoQixTQUFTLEdBQUcsQ0FBeEI7QUFDQSxjQUFJaUIsQ0FBQyxHQUFHYixFQUFFLEdBQUdDLEVBQUUsR0FBR1csS0FBbEI7QUFDQSxjQUFJRSxDQUFDLEdBQUdkLEVBQUUsR0FBRyxDQUFDQyxFQUFFLEdBQUcsQ0FBTixJQUFXVyxLQUF4QjtBQUNBLGNBQUlHLENBQUMsR0FBSWYsRUFBRSxHQUFHLENBQU4sR0FBVyxDQUFDQyxFQUFFLEdBQUcsQ0FBTixJQUFXVyxLQUE5QjtBQUNBLGNBQUlJLENBQUMsR0FBSWhCLEVBQUUsR0FBRyxDQUFOLEdBQVdDLEVBQUUsR0FBR1csS0FBeEI7O0FBRUEsY0FBSW5DLEdBQUosRUFBUztBQUNQVyxZQUFBQSxPQUFPLENBQUNvQixJQUFSLENBQWFOLE1BQU0sR0FBR1csQ0FBdEIsRUFBeUJYLE1BQU0sR0FBR1ksQ0FBbEMsRUFBcUNaLE1BQU0sR0FBR2MsQ0FBOUM7QUFDQTVCLFlBQUFBLE9BQU8sQ0FBQ29CLElBQVIsQ0FBYU4sTUFBTSxHQUFHYyxDQUF0QixFQUF5QmQsTUFBTSxHQUFHWSxDQUFsQyxFQUFxQ1osTUFBTSxHQUFHYSxDQUE5QztBQUNELFdBSEQsTUFHTztBQUNMM0IsWUFBQUEsT0FBTyxDQUFDb0IsSUFBUixDQUFhTixNQUFNLEdBQUdXLENBQXRCLEVBQXlCWCxNQUFNLEdBQUdjLENBQWxDLEVBQXFDZCxNQUFNLEdBQUdZLENBQTlDO0FBQ0ExQixZQUFBQSxPQUFPLENBQUNvQixJQUFSLENBQWFOLE1BQU0sR0FBR1ksQ0FBdEIsRUFBeUJaLE1BQU0sR0FBR2MsQ0FBbEMsRUFBcUNkLE1BQU0sR0FBR2EsQ0FBOUM7QUFDRDtBQUNGO0FBQ0Y7QUFDRjtBQUNGOztBQUVEckIsRUFBQUEsV0FBVyxDQUFDLENBQUQsRUFBSXBCLEVBQUosRUFBUUMsRUFBUixDQUFYLENBdkY4SSxDQXVGdEg7OztBQUN4Qm1CLEVBQUFBLFdBQVcsQ0FBQyxDQUFELEVBQUlsQixFQUFKLEVBQVFELEVBQVIsQ0FBWCxDQXhGOEksQ0F3RnRIOzs7QUFDeEJtQixFQUFBQSxXQUFXLENBQUMsQ0FBRCxFQUFJcEIsRUFBSixFQUFRQyxFQUFSLENBQVgsQ0F6RjhJLENBeUZ0SDs7O0FBQ3hCbUIsRUFBQUEsV0FBVyxDQUFDLENBQUQsRUFBSWxCLEVBQUosRUFBUUQsRUFBUixDQUFYLENBMUY4SSxDQTBGdEg7OztBQUN4Qm1CLEVBQUFBLFdBQVcsQ0FBQyxDQUFELEVBQUlwQixFQUFKLEVBQVFFLEVBQVIsQ0FBWCxDQTNGOEksQ0EyRnRIOzs7QUFDeEJrQixFQUFBQSxXQUFXLENBQUMsQ0FBRCxFQUFJcEIsRUFBSixFQUFRRSxFQUFSLENBQVgsQ0E1RjhJLENBNEZ0SDs7O0FBRXhCLFNBQU8sSUFBSXlDLHNCQUFKLENBQ0xoQyxTQURLLEVBRUxDLE9BRkssRUFHTEMsR0FISyxFQUlMQyxPQUpLLEVBS0xDLE1BTEssRUFNTEMsTUFOSyxFQU9MQyxjQVBLLENBQVA7QUFTRCIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IFZlYzMgZnJvbSAnLi4vLi4vdmFsdWUtdHlwZXMvdmVjMyc7XG5pbXBvcnQgVmVydGV4RGF0YSBmcm9tICcuL3ZlcnRleC1kYXRhJztcblxubGV0IHRlbXAxID0gbmV3IFZlYzMoKTtcbmxldCB0ZW1wMiA9IG5ldyBWZWMzKCk7XG5sZXQgdGVtcDMgPSBuZXcgVmVjMygpO1xubGV0IHIgPSBuZXcgVmVjMygpO1xubGV0IGMwID0gbmV3IFZlYzMoKTtcbmxldCBjMSA9IG5ldyBWZWMzKCk7XG5sZXQgYzIgPSBuZXcgVmVjMygpO1xubGV0IGMzID0gbmV3IFZlYzMoKTtcbmxldCBjNCA9IG5ldyBWZWMzKCk7XG5sZXQgYzUgPSBuZXcgVmVjMygpO1xubGV0IGM2ID0gbmV3IFZlYzMoKTtcbmxldCBjNyA9IG5ldyBWZWMzKCk7XG5cbi8qKlxuICogQHBhcmFtIHtOdW1iZXJ9IHdpZHRoXG4gKiBAcGFyYW0ge051bWJlcn0gaGVpZ2h0XG4gKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0c1xuICogQHBhcmFtIHtOdW1iZXJ9IG9wdHMud2lkdGhTZWdtZW50c1xuICogQHBhcmFtIHtOdW1iZXJ9IG9wdHMuaGVpZ2h0U2VnbWVudHNcbiAqIEBwYXJhbSB7TnVtYmVyfSBvcHRzLmxlbmd0aFNlZ21lbnRzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICh3aWR0aCA9IDEsIGhlaWdodCA9IDEsIGxlbmd0aCA9IDEsIG9wdHMgPSB7d2lkdGhTZWdtZW50czogMSwgaGVpZ2h0U2VnbWVudHM6IDEsIGxlbmd0aFNlZ21lbnRzOiAxLCBpbnZXaW5kaW5nOiBmYWxzZX0pIHtcbiAgbGV0IHdzID0gb3B0cy53aWR0aFNlZ21lbnRzO1xuICBsZXQgaHMgPSBvcHRzLmhlaWdodFNlZ21lbnRzO1xuICBsZXQgbHMgPSBvcHRzLmxlbmd0aFNlZ21lbnRzO1xuICBsZXQgaW52ID0gb3B0cy5pbnZXaW5kaW5nO1xuXG4gIGxldCBodyA9IHdpZHRoICogMC41O1xuICBsZXQgaGggPSBoZWlnaHQgKiAwLjU7XG4gIGxldCBobCA9IGxlbmd0aCAqIDAuNTtcblxuICBsZXQgY29ybmVycyA9IFtcbiAgICBWZWMzLnNldChjMCwgLWh3LCAtaGgsICBobCksXG4gICAgVmVjMy5zZXQoYzEsICBodywgLWhoLCAgaGwpLFxuICAgIFZlYzMuc2V0KGMyLCAgaHcsICBoaCwgIGhsKSxcbiAgICBWZWMzLnNldChjMywgLWh3LCAgaGgsICBobCksXG4gICAgVmVjMy5zZXQoYzQsICBodywgLWhoLCAtaGwpLFxuICAgIFZlYzMuc2V0KGM1LCAtaHcsIC1oaCwgLWhsKSxcbiAgICBWZWMzLnNldChjNiwgLWh3LCAgaGgsIC1obCksXG4gICAgVmVjMy5zZXQoYzcsICBodywgIGhoLCAtaGwpLFxuICBdO1xuXG4gIGxldCBmYWNlQXhlcyA9IFtcbiAgICBbIDIsIDMsIDEgXSwgLy8gRlJPTlRcbiAgICBbIDQsIDUsIDcgXSwgLy8gQkFDS1xuICAgIFsgNywgNiwgMiBdLCAvLyBUT1BcbiAgICBbIDEsIDAsIDQgXSwgLy8gQk9UVE9NXG4gICAgWyAxLCA0LCAyIF0sIC8vIFJJR0hUXG4gICAgWyA1LCAwLCA2IF0gIC8vIExFRlRcbiAgXTtcblxuICBsZXQgZmFjZU5vcm1hbHMgPSBbXG4gICAgWyAgMCwgIDAsICAxIF0sIC8vIEZST05UXG4gICAgWyAgMCwgIDAsIC0xIF0sIC8vIEJBQ0tcbiAgICBbICAwLCAgMSwgIDAgXSwgLy8gVE9QXG4gICAgWyAgMCwgLTEsICAwIF0sIC8vIEJPVFRPTVxuICAgIFsgIDEsICAwLCAgMCBdLCAvLyBSSUdIVFxuICAgIFsgLTEsICAwLCAgMCBdICAvLyBMRUZUXG4gIF07XG5cbiAgbGV0IHBvc2l0aW9uczogbnVtYmVyW10gPSBbXTtcbiAgbGV0IG5vcm1hbHM6IG51bWJlcltdID0gW107XG4gIGxldCB1dnM6IG51bWJlcltdID0gW107XG4gIGxldCBpbmRpY2VzOiBudW1iZXJbXSA9IFtdO1xuICBsZXQgbWluUG9zID0gbmV3IFZlYzMoLWh3LCAtaGgsIC1obCk7XG4gIGxldCBtYXhQb3MgPSBuZXcgVmVjMyhodywgaGgsIGhsKTtcbiAgbGV0IGJvdW5kaW5nUmFkaXVzID0gTWF0aC5zcXJ0KGh3ICogaHcgKyBoaCAqIGhoICsgaGwgKiBobCk7XG5cbiAgZnVuY3Rpb24gX2J1aWxkUGxhbmUgKHNpZGUsIHVTZWdtZW50cywgdlNlZ21lbnRzKSB7XG4gICAgbGV0IHUsIHY7XG4gICAgbGV0IGl4LCBpeTtcbiAgICBsZXQgb2Zmc2V0ID0gcG9zaXRpb25zLmxlbmd0aCAvIDM7XG4gICAgbGV0IGZhY2VBeGUgPSBmYWNlQXhlc1tzaWRlXTtcbiAgICBsZXQgZmFjZU5vcm1hbCA9IGZhY2VOb3JtYWxzW3NpZGVdO1xuXG4gICAgZm9yIChpeSA9IDA7IGl5IDw9IHZTZWdtZW50czsgaXkrKykge1xuICAgICAgZm9yIChpeCA9IDA7IGl4IDw9IHVTZWdtZW50czsgaXgrKykge1xuICAgICAgICB1ID0gaXggLyB1U2VnbWVudHM7XG4gICAgICAgIHYgPSBpeSAvIHZTZWdtZW50cztcblxuICAgICAgICBWZWMzLmxlcnAodGVtcDEsIGNvcm5lcnNbZmFjZUF4ZVswXV0sIGNvcm5lcnNbZmFjZUF4ZVsxXV0sIHUpO1xuICAgICAgICBWZWMzLmxlcnAodGVtcDIsIGNvcm5lcnNbZmFjZUF4ZVswXV0sIGNvcm5lcnNbZmFjZUF4ZVsyXV0sIHYpO1xuICAgICAgICBWZWMzLnN1YnRyYWN0KHRlbXAzLCB0ZW1wMiwgY29ybmVyc1tmYWNlQXhlWzBdXSk7XG4gICAgICAgIFZlYzMuYWRkKHIsIHRlbXAxLCB0ZW1wMyk7XG5cbiAgICAgICAgcG9zaXRpb25zLnB1c2goci54LCByLnksIHIueik7XG4gICAgICAgIG5vcm1hbHMucHVzaChmYWNlTm9ybWFsWzBdLCBmYWNlTm9ybWFsWzFdLCBmYWNlTm9ybWFsWzJdKTtcbiAgICAgICAgdXZzLnB1c2godSwgdik7XG5cbiAgICAgICAgaWYgKChpeCA8IHVTZWdtZW50cykgJiYgKGl5IDwgdlNlZ21lbnRzKSkge1xuICAgICAgICAgIGxldCB1c2VnMSA9IHVTZWdtZW50cyArIDE7XG4gICAgICAgICAgbGV0IGEgPSBpeCArIGl5ICogdXNlZzE7XG4gICAgICAgICAgbGV0IGIgPSBpeCArIChpeSArIDEpICogdXNlZzE7XG4gICAgICAgICAgbGV0IGMgPSAoaXggKyAxKSArIChpeSArIDEpICogdXNlZzE7XG4gICAgICAgICAgbGV0IGQgPSAoaXggKyAxKSArIGl5ICogdXNlZzE7XG5cbiAgICAgICAgICBpZiAoaW52KSB7XG4gICAgICAgICAgICBpbmRpY2VzLnB1c2gob2Zmc2V0ICsgYSwgb2Zmc2V0ICsgYiwgb2Zmc2V0ICsgZCk7XG4gICAgICAgICAgICBpbmRpY2VzLnB1c2gob2Zmc2V0ICsgZCwgb2Zmc2V0ICsgYiwgb2Zmc2V0ICsgYyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluZGljZXMucHVzaChvZmZzZXQgKyBhLCBvZmZzZXQgKyBkLCBvZmZzZXQgKyBiKTtcbiAgICAgICAgICAgIGluZGljZXMucHVzaChvZmZzZXQgKyBiLCBvZmZzZXQgKyBkLCBvZmZzZXQgKyBjKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfYnVpbGRQbGFuZSgwLCB3cywgaHMpOyAvLyBGUk9OVFxuICBfYnVpbGRQbGFuZSg0LCBscywgaHMpOyAvLyBSSUdIVFxuICBfYnVpbGRQbGFuZSgxLCB3cywgaHMpOyAvLyBCQUNLXG4gIF9idWlsZFBsYW5lKDUsIGxzLCBocyk7IC8vIExFRlRcbiAgX2J1aWxkUGxhbmUoMywgd3MsIGxzKTsgLy8gQk9UVE9NXG4gIF9idWlsZFBsYW5lKDIsIHdzLCBscyk7IC8vIFRPUFxuXG4gIHJldHVybiBuZXcgVmVydGV4RGF0YShcbiAgICBwb3NpdGlvbnMsXG4gICAgbm9ybWFscyxcbiAgICB1dnMsXG4gICAgaW5kaWNlcyxcbiAgICBtaW5Qb3MsXG4gICAgbWF4UG9zLFxuICAgIGJvdW5kaW5nUmFkaXVzXG4gICk7XG59XG4iXX0=