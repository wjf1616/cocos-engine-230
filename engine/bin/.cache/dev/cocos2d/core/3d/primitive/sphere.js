
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/primitive/sphere.js';
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
 * @param {Object} opts
 * @param {Number} opts.segments
 */
function _default(radius, opts) {
  if (radius === void 0) {
    radius = 0.5;
  }

  if (opts === void 0) {
    opts = {
      segments: 32
    };
  }

  var segments = opts.segments; // lat === latitude
  // lon === longitude

  var positions = [];
  var normals = [];
  var uvs = [];
  var indices = [];
  var minPos = new _valueTypes.Vec3(-radius, -radius, -radius);
  var maxPos = new _valueTypes.Vec3(radius, radius, radius);
  var boundingRadius = radius;

  for (var lat = 0; lat <= segments; ++lat) {
    var theta = lat * Math.PI / segments;
    var sinTheta = Math.sin(theta);
    var cosTheta = -Math.cos(theta);

    for (var lon = 0; lon <= segments; ++lon) {
      var phi = lon * 2 * Math.PI / segments - Math.PI / 2.0;
      var sinPhi = Math.sin(phi);
      var cosPhi = Math.cos(phi);
      var x = sinPhi * sinTheta;
      var y = cosTheta;
      var z = cosPhi * sinTheta;
      var u = lon / segments;
      var v = lat / segments;
      positions.push(x * radius, y * radius, z * radius);
      normals.push(x, y, z);
      uvs.push(u, v);

      if (lat < segments && lon < segments) {
        var seg1 = segments + 1;
        var a = seg1 * lat + lon;
        var b = seg1 * (lat + 1) + lon;
        var c = seg1 * (lat + 1) + lon + 1;
        var d = seg1 * lat + lon + 1;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNwaGVyZS50cyJdLCJuYW1lcyI6WyJyYWRpdXMiLCJvcHRzIiwic2VnbWVudHMiLCJwb3NpdGlvbnMiLCJub3JtYWxzIiwidXZzIiwiaW5kaWNlcyIsIm1pblBvcyIsIlZlYzMiLCJtYXhQb3MiLCJib3VuZGluZ1JhZGl1cyIsImxhdCIsInRoZXRhIiwiTWF0aCIsIlBJIiwic2luVGhldGEiLCJzaW4iLCJjb3NUaGV0YSIsImNvcyIsImxvbiIsInBoaSIsInNpblBoaSIsImNvc1BoaSIsIngiLCJ5IiwieiIsInUiLCJ2IiwicHVzaCIsInNlZzEiLCJhIiwiYiIsImMiLCJkIiwiVmVydGV4RGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7QUFFQTs7QUFDQTs7OztBQUVBOzs7OztBQUtlLGtCQUFVQSxNQUFWLEVBQXdCQyxJQUF4QixFQUErQztBQUFBLE1BQXJDRCxNQUFxQztBQUFyQ0EsSUFBQUEsTUFBcUMsR0FBNUIsR0FBNEI7QUFBQTs7QUFBQSxNQUF2QkMsSUFBdUI7QUFBdkJBLElBQUFBLElBQXVCLEdBQWhCO0FBQUNDLE1BQUFBLFFBQVEsRUFBRTtBQUFYLEtBQWdCO0FBQUE7O0FBQzVELE1BQUlBLFFBQVEsR0FBR0QsSUFBSSxDQUFDQyxRQUFwQixDQUQ0RCxDQUc1RDtBQUNBOztBQUVBLE1BQUlDLFNBQW1CLEdBQUcsRUFBMUI7QUFDQSxNQUFJQyxPQUFpQixHQUFHLEVBQXhCO0FBQ0EsTUFBSUMsR0FBYSxHQUFHLEVBQXBCO0FBQ0EsTUFBSUMsT0FBaUIsR0FBRyxFQUF4QjtBQUNBLE1BQUlDLE1BQU0sR0FBRyxJQUFJQyxnQkFBSixDQUFTLENBQUNSLE1BQVYsRUFBa0IsQ0FBQ0EsTUFBbkIsRUFBMkIsQ0FBQ0EsTUFBNUIsQ0FBYjtBQUNBLE1BQUlTLE1BQU0sR0FBRyxJQUFJRCxnQkFBSixDQUFTUixNQUFULEVBQWlCQSxNQUFqQixFQUF5QkEsTUFBekIsQ0FBYjtBQUNBLE1BQUlVLGNBQWMsR0FBR1YsTUFBckI7O0FBRUEsT0FBSyxJQUFJVyxHQUFHLEdBQUcsQ0FBZixFQUFrQkEsR0FBRyxJQUFJVCxRQUF6QixFQUFtQyxFQUFFUyxHQUFyQyxFQUEwQztBQUN4QyxRQUFJQyxLQUFLLEdBQUdELEdBQUcsR0FBR0UsSUFBSSxDQUFDQyxFQUFYLEdBQWdCWixRQUE1QjtBQUNBLFFBQUlhLFFBQVEsR0FBR0YsSUFBSSxDQUFDRyxHQUFMLENBQVNKLEtBQVQsQ0FBZjtBQUNBLFFBQUlLLFFBQVEsR0FBRyxDQUFDSixJQUFJLENBQUNLLEdBQUwsQ0FBU04sS0FBVCxDQUFoQjs7QUFFQSxTQUFLLElBQUlPLEdBQUcsR0FBRyxDQUFmLEVBQWtCQSxHQUFHLElBQUlqQixRQUF6QixFQUFtQyxFQUFFaUIsR0FBckMsRUFBMEM7QUFDeEMsVUFBSUMsR0FBRyxHQUFHRCxHQUFHLEdBQUcsQ0FBTixHQUFVTixJQUFJLENBQUNDLEVBQWYsR0FBb0JaLFFBQXBCLEdBQStCVyxJQUFJLENBQUNDLEVBQUwsR0FBVSxHQUFuRDtBQUNBLFVBQUlPLE1BQU0sR0FBR1IsSUFBSSxDQUFDRyxHQUFMLENBQVNJLEdBQVQsQ0FBYjtBQUNBLFVBQUlFLE1BQU0sR0FBR1QsSUFBSSxDQUFDSyxHQUFMLENBQVNFLEdBQVQsQ0FBYjtBQUVBLFVBQUlHLENBQUMsR0FBR0YsTUFBTSxHQUFHTixRQUFqQjtBQUNBLFVBQUlTLENBQUMsR0FBR1AsUUFBUjtBQUNBLFVBQUlRLENBQUMsR0FBR0gsTUFBTSxHQUFHUCxRQUFqQjtBQUNBLFVBQUlXLENBQUMsR0FBR1AsR0FBRyxHQUFHakIsUUFBZDtBQUNBLFVBQUl5QixDQUFDLEdBQUdoQixHQUFHLEdBQUdULFFBQWQ7QUFFQUMsTUFBQUEsU0FBUyxDQUFDeUIsSUFBVixDQUFlTCxDQUFDLEdBQUd2QixNQUFuQixFQUEyQndCLENBQUMsR0FBR3hCLE1BQS9CLEVBQXVDeUIsQ0FBQyxHQUFHekIsTUFBM0M7QUFDQUksTUFBQUEsT0FBTyxDQUFDd0IsSUFBUixDQUFhTCxDQUFiLEVBQWdCQyxDQUFoQixFQUFtQkMsQ0FBbkI7QUFDQXBCLE1BQUFBLEdBQUcsQ0FBQ3VCLElBQUosQ0FBU0YsQ0FBVCxFQUFZQyxDQUFaOztBQUdBLFVBQUtoQixHQUFHLEdBQUdULFFBQVAsSUFBcUJpQixHQUFHLEdBQUdqQixRQUEvQixFQUEwQztBQUN4QyxZQUFJMkIsSUFBSSxHQUFHM0IsUUFBUSxHQUFHLENBQXRCO0FBQ0EsWUFBSTRCLENBQUMsR0FBR0QsSUFBSSxHQUFHbEIsR0FBUCxHQUFhUSxHQUFyQjtBQUNBLFlBQUlZLENBQUMsR0FBR0YsSUFBSSxJQUFJbEIsR0FBRyxHQUFHLENBQVYsQ0FBSixHQUFtQlEsR0FBM0I7QUFDQSxZQUFJYSxDQUFDLEdBQUdILElBQUksSUFBSWxCLEdBQUcsR0FBRyxDQUFWLENBQUosR0FBbUJRLEdBQW5CLEdBQXlCLENBQWpDO0FBQ0EsWUFBSWMsQ0FBQyxHQUFHSixJQUFJLEdBQUdsQixHQUFQLEdBQWFRLEdBQWIsR0FBbUIsQ0FBM0I7QUFFQWIsUUFBQUEsT0FBTyxDQUFDc0IsSUFBUixDQUFhRSxDQUFiLEVBQWdCRyxDQUFoQixFQUFtQkYsQ0FBbkI7QUFDQXpCLFFBQUFBLE9BQU8sQ0FBQ3NCLElBQVIsQ0FBYUssQ0FBYixFQUFnQkQsQ0FBaEIsRUFBbUJELENBQW5CO0FBQ0Q7QUFDRjtBQUNGOztBQUVELFNBQU8sSUFBSUcsc0JBQUosQ0FDTC9CLFNBREssRUFFTEMsT0FGSyxFQUdMQyxHQUhLLEVBSUxDLE9BSkssRUFLTEMsTUFMSyxFQU1MRSxNQU5LLEVBT0xDLGNBUEssQ0FBUDtBQVNEIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgVmVydGV4RGF0YSBmcm9tICcuL3ZlcnRleC1kYXRhJztcbmltcG9ydCB7IFZlYzMgfSBmcm9tICcuLi8uLi92YWx1ZS10eXBlcyc7XG5cbi8qKlxuICogQHBhcmFtIHtOdW1iZXJ9IHJhZGl1c1xuICogQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAqIEBwYXJhbSB7TnVtYmVyfSBvcHRzLnNlZ21lbnRzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChyYWRpdXMgPSAwLjUsIG9wdHMgPSB7c2VnbWVudHM6IDMyfSkge1xuICBsZXQgc2VnbWVudHMgPSBvcHRzLnNlZ21lbnRzO1xuXG4gIC8vIGxhdCA9PT0gbGF0aXR1ZGVcbiAgLy8gbG9uID09PSBsb25naXR1ZGVcblxuICBsZXQgcG9zaXRpb25zOiBudW1iZXJbXSA9IFtdO1xuICBsZXQgbm9ybWFsczogbnVtYmVyW10gPSBbXTtcbiAgbGV0IHV2czogbnVtYmVyW10gPSBbXTtcbiAgbGV0IGluZGljZXM6IG51bWJlcltdID0gW107XG4gIGxldCBtaW5Qb3MgPSBuZXcgVmVjMygtcmFkaXVzLCAtcmFkaXVzLCAtcmFkaXVzKTtcbiAgbGV0IG1heFBvcyA9IG5ldyBWZWMzKHJhZGl1cywgcmFkaXVzLCByYWRpdXMpO1xuICBsZXQgYm91bmRpbmdSYWRpdXMgPSByYWRpdXM7XG5cbiAgZm9yIChsZXQgbGF0ID0gMDsgbGF0IDw9IHNlZ21lbnRzOyArK2xhdCkge1xuICAgIGxldCB0aGV0YSA9IGxhdCAqIE1hdGguUEkgLyBzZWdtZW50cztcbiAgICBsZXQgc2luVGhldGEgPSBNYXRoLnNpbih0aGV0YSk7XG4gICAgbGV0IGNvc1RoZXRhID0gLU1hdGguY29zKHRoZXRhKTtcblxuICAgIGZvciAobGV0IGxvbiA9IDA7IGxvbiA8PSBzZWdtZW50czsgKytsb24pIHtcbiAgICAgIGxldCBwaGkgPSBsb24gKiAyICogTWF0aC5QSSAvIHNlZ21lbnRzIC0gTWF0aC5QSSAvIDIuMDtcbiAgICAgIGxldCBzaW5QaGkgPSBNYXRoLnNpbihwaGkpO1xuICAgICAgbGV0IGNvc1BoaSA9IE1hdGguY29zKHBoaSk7XG5cbiAgICAgIGxldCB4ID0gc2luUGhpICogc2luVGhldGE7XG4gICAgICBsZXQgeSA9IGNvc1RoZXRhO1xuICAgICAgbGV0IHogPSBjb3NQaGkgKiBzaW5UaGV0YTtcbiAgICAgIGxldCB1ID0gbG9uIC8gc2VnbWVudHM7XG4gICAgICBsZXQgdiA9IGxhdCAvIHNlZ21lbnRzO1xuXG4gICAgICBwb3NpdGlvbnMucHVzaCh4ICogcmFkaXVzLCB5ICogcmFkaXVzLCB6ICogcmFkaXVzKTtcbiAgICAgIG5vcm1hbHMucHVzaCh4LCB5LCB6KTtcbiAgICAgIHV2cy5wdXNoKHUsIHYpO1xuXG5cbiAgICAgIGlmICgobGF0IDwgc2VnbWVudHMpICYmIChsb24gPCBzZWdtZW50cykpIHtcbiAgICAgICAgbGV0IHNlZzEgPSBzZWdtZW50cyArIDE7XG4gICAgICAgIGxldCBhID0gc2VnMSAqIGxhdCArIGxvbjtcbiAgICAgICAgbGV0IGIgPSBzZWcxICogKGxhdCArIDEpICsgbG9uO1xuICAgICAgICBsZXQgYyA9IHNlZzEgKiAobGF0ICsgMSkgKyBsb24gKyAxO1xuICAgICAgICBsZXQgZCA9IHNlZzEgKiBsYXQgKyBsb24gKyAxO1xuXG4gICAgICAgIGluZGljZXMucHVzaChhLCBkLCBiKTtcbiAgICAgICAgaW5kaWNlcy5wdXNoKGQsIGMsIGIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXcgVmVydGV4RGF0YShcbiAgICBwb3NpdGlvbnMsXG4gICAgbm9ybWFscyxcbiAgICB1dnMsXG4gICAgaW5kaWNlcyxcbiAgICBtaW5Qb3MsXG4gICAgbWF4UG9zLFxuICAgIGJvdW5kaW5nUmFkaXVzXG4gICk7XG59XG4iXX0=