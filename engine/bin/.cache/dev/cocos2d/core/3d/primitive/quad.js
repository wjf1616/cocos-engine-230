
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/primitive/quad.js';
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

var positions = [-0.5, -0.5, 0, // bottom-left
-0.5, 0.5, 0, // top-left
0.5, 0.5, 0, // top-right
0.5, -0.5, 0 // bottom-right
];
var normals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
var uvs = [0, 0, 0, 1, 1, 1, 1, 0];
var indices = [0, 3, 1, 3, 2, 1]; // TODO: ?

var minPos = new _valueTypes.Vec3(-0.5, -0.5, 0);
var maxPos = new _valueTypes.Vec3(0.5, 0.5, 0);
var boundingRadius = Math.sqrt(0.5 * 0.5 + 0.5 * 0.5);

function _default() {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1YWQudHMiXSwibmFtZXMiOlsicG9zaXRpb25zIiwibm9ybWFscyIsInV2cyIsImluZGljZXMiLCJtaW5Qb3MiLCJWZWMzIiwibWF4UG9zIiwiYm91bmRpbmdSYWRpdXMiLCJNYXRoIiwic3FydCIsIlZlcnRleERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7Ozs7O0FBRUE7O0FBQ0E7Ozs7QUFFQSxJQUFJQSxTQUFTLEdBQUcsQ0FDZCxDQUFDLEdBRGEsRUFDUixDQUFDLEdBRE8sRUFDRixDQURFLEVBQ0M7QUFDZixDQUFDLEdBRmEsRUFFUCxHQUZPLEVBRUYsQ0FGRSxFQUVDO0FBQ2QsR0FIYSxFQUdQLEdBSE8sRUFHRixDQUhFLEVBR0M7QUFDZCxHQUphLEVBSVIsQ0FBQyxHQUpPLEVBSUYsQ0FKRSxDQUlDO0FBSkQsQ0FBaEI7QUFPQSxJQUFJQyxPQUFPLEdBQUcsQ0FDWixDQURZLEVBQ1QsQ0FEUyxFQUNOLENBRE0sRUFFWixDQUZZLEVBRVQsQ0FGUyxFQUVOLENBRk0sRUFHWixDQUhZLEVBR1QsQ0FIUyxFQUdOLENBSE0sRUFJWixDQUpZLEVBSVQsQ0FKUyxFQUlOLENBSk0sQ0FBZDtBQU9BLElBQUlDLEdBQUcsR0FBRyxDQUNSLENBRFEsRUFDTCxDQURLLEVBRVIsQ0FGUSxFQUVMLENBRkssRUFHUixDQUhRLEVBR0wsQ0FISyxFQUlSLENBSlEsRUFJTCxDQUpLLENBQVY7QUFPQSxJQUFJQyxPQUFPLEdBQUcsQ0FDWixDQURZLEVBQ1QsQ0FEUyxFQUNOLENBRE0sRUFFWixDQUZZLEVBRVQsQ0FGUyxFQUVOLENBRk0sQ0FBZCxFQUtBOztBQUNBLElBQUlDLE1BQU0sR0FBRyxJQUFJQyxnQkFBSixDQUFTLENBQUMsR0FBVixFQUFlLENBQUMsR0FBaEIsRUFBcUIsQ0FBckIsQ0FBYjtBQUNBLElBQUlDLE1BQU0sR0FBRyxJQUFJRCxnQkFBSixDQUFTLEdBQVQsRUFBYyxHQUFkLEVBQW1CLENBQW5CLENBQWI7QUFDQSxJQUFJRSxjQUFjLEdBQUdDLElBQUksQ0FBQ0MsSUFBTCxDQUFVLE1BQU0sR0FBTixHQUFZLE1BQU0sR0FBNUIsQ0FBckI7O0FBRWUsb0JBQVk7QUFDekIsU0FBTyxJQUFJQyxzQkFBSixDQUNMVixTQURLLEVBRUxDLE9BRkssRUFHTEMsR0FISyxFQUlMQyxPQUpLLEVBS0xDLE1BTEssRUFNTEUsTUFOSyxFQU9MQyxjQVBLLENBQVA7QUFTRCIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IFZlcnRleERhdGEgZnJvbSAnLi92ZXJ0ZXgtZGF0YSc7XG5pbXBvcnQgeyBWZWMzIH0gZnJvbSAnLi4vLi4vdmFsdWUtdHlwZXMnO1xuXG5sZXQgcG9zaXRpb25zID0gW1xuICAtMC41LCAtMC41LCAwLCAvLyBib3R0b20tbGVmdFxuICAtMC41LCAgMC41LCAwLCAvLyB0b3AtbGVmdFxuICAgMC41LCAgMC41LCAwLCAvLyB0b3AtcmlnaHRcbiAgIDAuNSwgLTAuNSwgMCwgLy8gYm90dG9tLXJpZ2h0XG5dO1xuXG5sZXQgbm9ybWFscyA9IFtcbiAgMCwgMCwgMSxcbiAgMCwgMCwgMSxcbiAgMCwgMCwgMSxcbiAgMCwgMCwgMSxcbl07XG5cbmxldCB1dnMgPSBbXG4gIDAsIDAsXG4gIDAsIDEsXG4gIDEsIDEsXG4gIDEsIDAsXG5dO1xuXG5sZXQgaW5kaWNlcyA9IFtcbiAgMCwgMywgMSxcbiAgMywgMiwgMVxuXTtcblxuLy8gVE9ETzogP1xubGV0IG1pblBvcyA9IG5ldyBWZWMzKC0wLjUsIC0wLjUsIDApO1xubGV0IG1heFBvcyA9IG5ldyBWZWMzKDAuNSwgMC41LCAwKTtcbmxldCBib3VuZGluZ1JhZGl1cyA9IE1hdGguc3FydCgwLjUgKiAwLjUgKyAwLjUgKiAwLjUpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBuZXcgVmVydGV4RGF0YShcbiAgICBwb3NpdGlvbnMsXG4gICAgbm9ybWFscyxcbiAgICB1dnMsXG4gICAgaW5kaWNlcyxcbiAgICBtaW5Qb3MsXG4gICAgbWF4UG9zLFxuICAgIGJvdW5kaW5nUmFkaXVzXG4gICk7XG59XG4iXX0=