
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/webgl/assemblers/sprite/3d/sliced.js';
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

var SlicedAssembler = require('../2d/sliced');

var vec3_temp_local = new _vec["default"]();
var vec3_temp_world = new _vec["default"]();

var SlicedAssembler3D =
/*#__PURE__*/
function (_SlicedAssembler) {
  _inheritsLoose(SlicedAssembler3D, _SlicedAssembler);

  function SlicedAssembler3D() {
    return _SlicedAssembler.apply(this, arguments) || this;
  }

  return SlicedAssembler3D;
}(SlicedAssembler);

exports["default"] = SlicedAssembler3D;
cc.js.mixin(SlicedAssembler3D.prototype, Assembler3D, {
  updateWorldVerts: function updateWorldVerts(sprite) {
    var matrix = sprite.node._worldMatrix;
    var local = this._local;
    var world = this._renderData.vDatas[0];
    var floatsPerVert = this.floatsPerVert;

    for (var row = 0; row < 4; ++row) {
      var localRowY = local[row * 2 + 1];

      for (var col = 0; col < 4; ++col) {
        var localColX = local[col * 2];

        _vec["default"].set(vec3_temp_local, localColX, localRowY, 0);

        _vec["default"].transformMat4(vec3_temp_world, vec3_temp_local, matrix);

        var worldIndex = (row * 4 + col) * floatsPerVert;
        world[worldIndex] = vec3_temp_world.x;
        world[worldIndex + 1] = vec3_temp_world.y;
        world[worldIndex + 2] = vec3_temp_world.z;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNsaWNlZC5qcyJdLCJuYW1lcyI6WyJBc3NlbWJsZXIzRCIsInJlcXVpcmUiLCJTbGljZWRBc3NlbWJsZXIiLCJ2ZWMzX3RlbXBfbG9jYWwiLCJWZWMzIiwidmVjM190ZW1wX3dvcmxkIiwiU2xpY2VkQXNzZW1ibGVyM0QiLCJjYyIsImpzIiwibWl4aW4iLCJwcm90b3R5cGUiLCJ1cGRhdGVXb3JsZFZlcnRzIiwic3ByaXRlIiwibWF0cml4Iiwibm9kZSIsIl93b3JsZE1hdHJpeCIsImxvY2FsIiwiX2xvY2FsIiwid29ybGQiLCJfcmVuZGVyRGF0YSIsInZEYXRhcyIsImZsb2F0c1BlclZlcnQiLCJyb3ciLCJsb2NhbFJvd1kiLCJjb2wiLCJsb2NhbENvbFgiLCJzZXQiLCJ0cmFuc2Zvcm1NYXQ0Iiwid29ybGRJbmRleCIsIngiLCJ5IiwieiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7Ozs7O0FBRUEsSUFBTUEsV0FBVyxHQUFHQyxPQUFPLENBQUMsMEJBQUQsQ0FBM0I7O0FBQ0EsSUFBTUMsZUFBZSxHQUFHRCxPQUFPLENBQUMsY0FBRCxDQUEvQjs7QUFFQSxJQUFNRSxlQUFlLEdBQUcsSUFBSUMsZUFBSixFQUF4QjtBQUNBLElBQU1DLGVBQWUsR0FBRyxJQUFJRCxlQUFKLEVBQXhCOztJQUVxQkU7Ozs7Ozs7Ozs7RUFBMEJKOzs7QUFJL0NLLEVBQUUsQ0FBQ0MsRUFBSCxDQUFNQyxLQUFOLENBQVlILGlCQUFpQixDQUFDSSxTQUE5QixFQUF5Q1YsV0FBekMsRUFBc0Q7QUFDbERXLEVBQUFBLGdCQURrRCw0QkFDaENDLE1BRGdDLEVBQ3hCO0FBQ3RCLFFBQUlDLE1BQU0sR0FBR0QsTUFBTSxDQUFDRSxJQUFQLENBQVlDLFlBQXpCO0FBQ0EsUUFBSUMsS0FBSyxHQUFHLEtBQUtDLE1BQWpCO0FBQ0EsUUFBSUMsS0FBSyxHQUFHLEtBQUtDLFdBQUwsQ0FBaUJDLE1BQWpCLENBQXdCLENBQXhCLENBQVo7QUFFQSxRQUFJQyxhQUFhLEdBQUcsS0FBS0EsYUFBekI7O0FBQ0EsU0FBSyxJQUFJQyxHQUFHLEdBQUcsQ0FBZixFQUFrQkEsR0FBRyxHQUFHLENBQXhCLEVBQTJCLEVBQUVBLEdBQTdCLEVBQWtDO0FBQzlCLFVBQUlDLFNBQVMsR0FBR1AsS0FBSyxDQUFDTSxHQUFHLEdBQUcsQ0FBTixHQUFVLENBQVgsQ0FBckI7O0FBQ0EsV0FBSyxJQUFJRSxHQUFHLEdBQUcsQ0FBZixFQUFrQkEsR0FBRyxHQUFHLENBQXhCLEVBQTJCLEVBQUVBLEdBQTdCLEVBQWtDO0FBQzlCLFlBQUlDLFNBQVMsR0FBR1QsS0FBSyxDQUFDUSxHQUFHLEdBQUcsQ0FBUCxDQUFyQjs7QUFFQXBCLHdCQUFLc0IsR0FBTCxDQUFTdkIsZUFBVCxFQUEwQnNCLFNBQTFCLEVBQXFDRixTQUFyQyxFQUFnRCxDQUFoRDs7QUFDQW5CLHdCQUFLdUIsYUFBTCxDQUFtQnRCLGVBQW5CLEVBQW9DRixlQUFwQyxFQUFxRFUsTUFBckQ7O0FBRUEsWUFBSWUsVUFBVSxHQUFHLENBQUNOLEdBQUcsR0FBRyxDQUFOLEdBQVVFLEdBQVgsSUFBa0JILGFBQW5DO0FBQ0FILFFBQUFBLEtBQUssQ0FBQ1UsVUFBRCxDQUFMLEdBQW9CdkIsZUFBZSxDQUFDd0IsQ0FBcEM7QUFDQVgsUUFBQUEsS0FBSyxDQUFDVSxVQUFVLEdBQUMsQ0FBWixDQUFMLEdBQXNCdkIsZUFBZSxDQUFDeUIsQ0FBdEM7QUFDQVosUUFBQUEsS0FBSyxDQUFDVSxVQUFVLEdBQUMsQ0FBWixDQUFMLEdBQXNCdkIsZUFBZSxDQUFDMEIsQ0FBdEM7QUFDSDtBQUNKO0FBQ0o7QUFyQmlELENBQXREIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IFZlYzMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vdmFsdWUtdHlwZXMvdmVjMyc7XG5cbmNvbnN0IEFzc2VtYmxlcjNEID0gcmVxdWlyZSgnLi4vLi4vLi4vLi4vYXNzZW1ibGVyLTNkJyk7XG5jb25zdCBTbGljZWRBc3NlbWJsZXIgPSByZXF1aXJlKCcuLi8yZC9zbGljZWQnKTtcblxuY29uc3QgdmVjM190ZW1wX2xvY2FsID0gbmV3IFZlYzMoKTtcbmNvbnN0IHZlYzNfdGVtcF93b3JsZCA9IG5ldyBWZWMzKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNsaWNlZEFzc2VtYmxlcjNEIGV4dGVuZHMgU2xpY2VkQXNzZW1ibGVyIHtcbiAgICBcbn1cblxuY2MuanMubWl4aW4oU2xpY2VkQXNzZW1ibGVyM0QucHJvdG90eXBlLCBBc3NlbWJsZXIzRCwge1xuICAgIHVwZGF0ZVdvcmxkVmVydHMgKHNwcml0ZSkge1xuICAgICAgICBsZXQgbWF0cml4ID0gc3ByaXRlLm5vZGUuX3dvcmxkTWF0cml4O1xuICAgICAgICBsZXQgbG9jYWwgPSB0aGlzLl9sb2NhbDtcbiAgICAgICAgbGV0IHdvcmxkID0gdGhpcy5fcmVuZGVyRGF0YS52RGF0YXNbMF07XG5cbiAgICAgICAgbGV0IGZsb2F0c1BlclZlcnQgPSB0aGlzLmZsb2F0c1BlclZlcnQ7XG4gICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IDQ7ICsrcm93KSB7XG4gICAgICAgICAgICBsZXQgbG9jYWxSb3dZID0gbG9jYWxbcm93ICogMiArIDFdO1xuICAgICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgNDsgKytjb2wpIHtcbiAgICAgICAgICAgICAgICBsZXQgbG9jYWxDb2xYID0gbG9jYWxbY29sICogMl07XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgVmVjMy5zZXQodmVjM190ZW1wX2xvY2FsLCBsb2NhbENvbFgsIGxvY2FsUm93WSwgMCk7XG4gICAgICAgICAgICAgICAgVmVjMy50cmFuc2Zvcm1NYXQ0KHZlYzNfdGVtcF93b3JsZCwgdmVjM190ZW1wX2xvY2FsLCBtYXRyaXgpO1xuXG4gICAgICAgICAgICAgICAgbGV0IHdvcmxkSW5kZXggPSAocm93ICogNCArIGNvbCkgKiBmbG9hdHNQZXJWZXJ0O1xuICAgICAgICAgICAgICAgIHdvcmxkW3dvcmxkSW5kZXhdID0gdmVjM190ZW1wX3dvcmxkLng7XG4gICAgICAgICAgICAgICAgd29ybGRbd29ybGRJbmRleCsxXSA9IHZlYzNfdGVtcF93b3JsZC55O1xuICAgICAgICAgICAgICAgIHdvcmxkW3dvcmxkSW5kZXgrMl0gPSB2ZWMzX3RlbXBfd29ybGQuejtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIl19