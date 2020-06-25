
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/primitive/torus.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}'use strict';

exports.__esModule = true;
exports["default"] = _default;

var _vertexData = _interopRequireDefault(require("./vertex-data"));

var _valueTypes = require("../../value-types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @param {Number} radius
 * @param {Number} tube
 * @param {Object} opts
 * @param {Number} opts.radialSegments
 * @param {Number} opts.tubularSegments
 * @param {Number} opts.arc
 */
function _default(radius, tube, opts) {
  if (radius === void 0) {
    radius = 0.4;
  }

  if (tube === void 0) {
    tube = 0.1;
  }

  if (opts === void 0) {
    opts = {
      radialSegments: 32,
      tubularSegments: 32,
      arc: 2.0 * Math.PI
    };
  }

  var radialSegments = opts.radialSegments;
  var tubularSegments = opts.tubularSegments;
  var arc = opts.arc;
  var positions = [];
  var normals = [];
  var uvs = [];
  var indices = [];
  var minPos = new _valueTypes.Vec3(-radius - tube, -tube, -radius - tube);
  var maxPos = new _valueTypes.Vec3(radius + tube, tube, radius + tube);
  var boundingRadius = radius + tube;

  for (var j = 0; j <= radialSegments; j++) {
    for (var i = 0; i <= tubularSegments; i++) {
      var u = i / tubularSegments;
      var v = j / radialSegments;
      var u1 = u * arc;
      var v1 = v * Math.PI * 2; // vertex

      var x = (radius + tube * Math.cos(v1)) * Math.sin(u1);
      var y = tube * Math.sin(v1);
      var z = (radius + tube * Math.cos(v1)) * Math.cos(u1); // this vector is used to calculate the normal

      var nx = Math.sin(u1) * Math.cos(v1);
      var ny = Math.sin(v1);
      var nz = Math.cos(u1) * Math.cos(v1);
      positions.push(x, y, z);
      normals.push(nx, ny, nz);
      uvs.push(u, v);

      if (i < tubularSegments && j < radialSegments) {
        var seg1 = tubularSegments + 1;
        var a = seg1 * j + i;
        var b = seg1 * (j + 1) + i;
        var c = seg1 * (j + 1) + i + 1;
        var d = seg1 * j + i + 1;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvcnVzLnRzIl0sIm5hbWVzIjpbInJhZGl1cyIsInR1YmUiLCJvcHRzIiwicmFkaWFsU2VnbWVudHMiLCJ0dWJ1bGFyU2VnbWVudHMiLCJhcmMiLCJNYXRoIiwiUEkiLCJwb3NpdGlvbnMiLCJub3JtYWxzIiwidXZzIiwiaW5kaWNlcyIsIm1pblBvcyIsIlZlYzMiLCJtYXhQb3MiLCJib3VuZGluZ1JhZGl1cyIsImoiLCJpIiwidSIsInYiLCJ1MSIsInYxIiwieCIsImNvcyIsInNpbiIsInkiLCJ6IiwibngiLCJueSIsIm56IiwicHVzaCIsInNlZzEiLCJhIiwiYiIsImMiLCJkIiwiVmVydGV4RGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7QUFFQTs7QUFDQTs7OztBQUVBOzs7Ozs7OztBQVFlLGtCQUFVQSxNQUFWLEVBQXdCQyxJQUF4QixFQUFvQ0MsSUFBcEMsRUFBMEc7QUFBQSxNQUFoR0YsTUFBZ0c7QUFBaEdBLElBQUFBLE1BQWdHLEdBQXZGLEdBQXVGO0FBQUE7O0FBQUEsTUFBbEZDLElBQWtGO0FBQWxGQSxJQUFBQSxJQUFrRixHQUEzRSxHQUEyRTtBQUFBOztBQUFBLE1BQXRFQyxJQUFzRTtBQUF0RUEsSUFBQUEsSUFBc0UsR0FBL0Q7QUFBQ0MsTUFBQUEsY0FBYyxFQUFFLEVBQWpCO0FBQXFCQyxNQUFBQSxlQUFlLEVBQUUsRUFBdEM7QUFBMENDLE1BQUFBLEdBQUcsRUFBRSxNQUFNQyxJQUFJLENBQUNDO0FBQTFELEtBQStEO0FBQUE7O0FBQ3ZILE1BQUlKLGNBQWMsR0FBR0QsSUFBSSxDQUFDQyxjQUExQjtBQUNBLE1BQUlDLGVBQWUsR0FBR0YsSUFBSSxDQUFDRSxlQUEzQjtBQUNBLE1BQUlDLEdBQUcsR0FBR0gsSUFBSSxDQUFDRyxHQUFmO0FBRUEsTUFBSUcsU0FBbUIsR0FBRyxFQUExQjtBQUNBLE1BQUlDLE9BQWlCLEdBQUcsRUFBeEI7QUFDQSxNQUFJQyxHQUFhLEdBQUcsRUFBcEI7QUFDQSxNQUFJQyxPQUFp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QSxPQUFPLENBQUNtQixJQUFSLENBQWFLLENBQWIsRUFBZ0JELENBQWhCLEVBQW1CRCxDQUFuQjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxTQUFPLElBQUlHLHNCQUFKLENBQ0w1QixTQURLLEVBRUxDLE9BRkssRUFHTEMsR0FISyxFQUlMQyxPQUpLLEVBS0xDLE1BTEssRUFNTEUsTUFOSyxFQU9MQyxjQVBLLENBQVA7QUFTRCIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IFZlcnRleERhdGEgZnJvbSAnLi92ZXJ0ZXgtZGF0YSc7XG5pbXBvcnQgeyBWZWMzIH0gZnJvbSAnLi4vLi4vdmFsdWUtdHlwZXMnO1xuXG4vKipcbiAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXNcbiAqIEBwYXJhbSB7TnVtYmVyfSB0dWJlXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0c1xuICogQHBhcmFtIHtOdW1iZXJ9IG9wdHMucmFkaWFsU2VnbWVudHNcbiAqIEBwYXJhbSB7TnVtYmVyfSBvcHRzLnR1YnVsYXJTZWdtZW50c1xuICogQHBhcmFtIHtOdW1iZXJ9IG9wdHMuYXJjXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChyYWRpdXMgPSAwLjQsIHR1YmUgPSAwLjEsIG9wdHMgPSB7cmFkaWFsU2VnbWVudHM6IDMyLCB0dWJ1bGFyU2VnbWVudHM6IDMyLCBhcmM6IDIuMCAqIE1hdGguUEl9KSB7XG4gIGxldCByYWRpYWxTZWdtZW50cyA9IG9wdHMucmFkaWFsU2VnbWVudHM7XG4gIGxldCB0dWJ1bGFyU2VnbWVudHMgPSBvcHRzLnR1YnVsYXJTZWdtZW50cztcbiAgbGV0IGFyYyA9IG9wdHMuYXJjO1xuXG4gIGxldCBwb3NpdGlvbnM6IG51bWJlcltdID0gW107XG4gIGxldCBub3JtYWxzOiBudW1iZXJbXSA9IFtdO1xuICBsZXQgdXZzOiBudW1iZXJbXSA9IFtdO1xuICBsZXQgaW5kaWNlczogbnVtYmVyW10gPSBbXTtcbiAgbGV0IG1pblBvcyA9IG5ldyBWZWMzKC1yYWRpdXMgLSB0dWJlLCAtdHViZSwgLXJhZGl1cyAtIHR1YmUpO1xuICBsZXQgbWF4UG9zID0gbmV3IFZlYzMocmFkaXVzICsgdHViZSwgdHViZSwgcmFkaXVzICsgdHViZSk7XG4gIGxldCBib3VuZGluZ1JhZGl1cyA9IHJhZGl1cyArIHR1YmU7XG5cbiAgZm9yIChsZXQgaiA9IDA7IGogPD0gcmFkaWFsU2VnbWVudHM7IGorKykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IHR1YnVsYXJTZWdtZW50czsgaSsrKSB7XG4gICAgICBsZXQgdSA9IGkgLyB0dWJ1bGFyU2VnbWVudHM7XG4gICAgICBsZXQgdiA9IGogLyByYWRpYWxTZWdtZW50cztcblxuICAgICAgbGV0IHUxID0gdSAqIGFyYztcbiAgICAgIGxldCB2MSA9IHYgKiBNYXRoLlBJICogMjtcblxuICAgICAgLy8gdmVydGV4XG4gICAgICBsZXQgeCA9IChyYWRpdXMgKyB0dWJlICogTWF0aC5jb3ModjEpKSAqIE1hdGguc2luKHUxKTtcbiAgICAgIGxldCB5ID0gdHViZSAqIE1hdGguc2luKHYxKTtcbiAgICAgIGxldCB6ID0gKHJhZGl1cyArIHR1YmUgKiBNYXRoLmNvcyh2MSkpICogTWF0aC5jb3ModTEpO1xuXG4gICAgICAvLyB0aGlzIHZlY3RvciBpcyB1c2VkIHRvIGNhbGN1bGF0ZSB0aGUgbm9ybWFsXG4gICAgICBsZXQgbnggPSBNYXRoLnNpbih1MSkgKiBNYXRoLmNvcyh2MSk7XG4gICAgICBsZXQgbnkgPSBNYXRoLnNpbih2MSk7XG4gICAgICBsZXQgbnogPSBNYXRoLmNvcyh1MSkgKiBNYXRoLmNvcyh2MSk7XG5cbiAgICAgIHBvc2l0aW9ucy5wdXNoKHgsIHksIHopO1xuICAgICAgbm9ybWFscy5wdXNoKG54LCBueSwgbnopO1xuICAgICAgdXZzLnB1c2godSwgdik7XG5cbiAgICAgIGlmICgoaSA8IHR1YnVsYXJTZWdtZW50cykgJiYgKGogPCByYWRpYWxTZWdtZW50cykpIHtcbiAgICAgICAgbGV0IHNlZzEgPSB0dWJ1bGFyU2VnbWVudHMgKyAxO1xuICAgICAgICBsZXQgYSA9IHNlZzEgKiBqICsgaTtcbiAgICAgICAgbGV0IGIgPSBzZWcxICogKGogKyAxKSArIGk7XG4gICAgICAgIGxldCBjID0gc2VnMSAqIChqICsgMSkgKyBpICsgMTtcbiAgICAgICAgbGV0IGQgPSBzZWcxICogaiArIGkgKyAxO1xuXG4gICAgICAgIGluZGljZXMucHVzaChhLCBkLCBiKTtcbiAgICAgICAgaW5kaWNlcy5wdXNoKGQsIGMsIGIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXcgVmVydGV4RGF0YShcbiAgICBwb3NpdGlvbnMsXG4gICAgbm9ybWFscyxcbiAgICB1dnMsXG4gICAgaW5kaWNlcyxcbiAgICBtaW5Qb3MsXG4gICAgbWF4UG9zLFxuICAgIGJvdW5kaW5nUmFkaXVzXG4gICk7XG59XG4iXX0=