
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/webgl/assemblers/sprite/3d/radial-filled.js';
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

var RadialFilledAssembler = require('../2d/radial-filled');

var vec3_temp_local = new _vec["default"]();
var vec3_temp_world = new _vec["default"]();

var RadialFilledAssembler3D =
/*#__PURE__*/
function (_RadialFilledAssemble) {
  _inheritsLoose(RadialFilledAssembler3D, _RadialFilledAssemble);

  function RadialFilledAssembler3D() {
    return _RadialFilledAssemble.apply(this, arguments) || this;
  }

  return RadialFilledAssembler3D;
}(RadialFilledAssembler);

exports["default"] = RadialFilledAssembler3D;
cc.js.mixin(RadialFilledAssembler3D.prototype, Assembler3D, {
  updateWorldVerts: function updateWorldVerts(sprite) {
    var matrix = sprite.node._worldMatrix;
    var local = this._local;
    var world = this._renderData.vDatas[0];
    var floatsPerVert = this.floatsPerVert;

    for (var offset = 0; offset < world.length; offset += floatsPerVert) {
      _vec["default"].set(vec3_temp_local, local[offset], local[offset + 1], 0);

      _vec["default"].transformMat4(vec3_temp_world, vec3_temp_local, matrix);

      world[offset] = vec3_temp_world.x;
      world[offset + 1] = vec3_temp_world.y;
      world[offset + 2] = vec3_temp_world.z;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJhZGlhbC1maWxsZWQuanMiXSwibmFtZXMiOlsiQXNzZW1ibGVyM0QiLCJyZXF1aXJlIiwiUmFkaWFsRmlsbGVkQXNzZW1ibGVyIiwidmVjM190ZW1wX2xvY2FsIiwiVmVjMyIsInZlYzNfdGVtcF93b3JsZCIsIlJhZGlhbEZpbGxlZEFzc2VtYmxlcjNEIiwiY2MiLCJqcyIsIm1peGluIiwicHJvdG90eXBlIiwidXBkYXRlV29ybGRWZXJ0cyIsInNwcml0ZSIsIm1hdHJpeCIsIm5vZGUiLCJfd29ybGRNYXRyaXgiLCJsb2NhbCIsIl9sb2NhbCIsIndvcmxkIiwiX3JlbmRlckRhdGEiLCJ2RGF0YXMiLCJmbG9hdHNQZXJWZXJ0Iiwib2Zmc2V0IiwibGVuZ3RoIiwic2V0IiwidHJhbnNmb3JtTWF0NCIsIngiLCJ5IiwieiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7Ozs7O0FBQ0EsSUFBTUEsV0FBVyxHQUFHQyxPQUFPLENBQUMsMEJBQUQsQ0FBM0I7O0FBQ0EsSUFBTUMscUJBQXFCLEdBQUdELE9BQU8sQ0FBQyxxQkFBRCxDQUFyQzs7QUFFQSxJQUFNRSxlQUFlLEdBQUcsSUFBSUMsZUFBSixFQUF4QjtBQUNBLElBQU1DLGVBQWUsR0FBRyxJQUFJRCxlQUFKLEVBQXhCOztJQUVxQkU7Ozs7Ozs7Ozs7RUFBZ0NKOzs7QUFJckRLLEVBQUUsQ0FBQ0MsRUFBSCxDQUFNQyxLQUFOLENBQVlILHVCQUF1QixDQUFDSSxTQUFwQyxFQUErQ1YsV0FBL0MsRUFBNEQ7QUFDeERXLEVBQUFBLGdCQUR3RCw0QkFDdENDLE1BRHNDLEVBQzlCO0FBQ3RCLFFBQUlDLE1BQU0sR0FBR0QsTUFBTSxDQUFDRSxJQUFQLENBQVlDLFlBQXpCO0FBQ0EsUUFBSUMsS0FBSyxHQUFHLEtBQUtDLE1BQWpCO0FBQ0EsUUFBSUMsS0FBSyxHQUFHLEtBQUtDLFdBQUwsQ0FBaUJDLE1BQWpCLENBQXdCLENBQXhCLENBQVo7QUFFQSxRQUFJQyxhQUFhLEdBQUcsS0FBS0EsYUFBekI7O0FBQ0EsU0FBSyxJQUFJQyxNQUFNLEdBQUcsQ0FBbEIsRUFBcUJBLE1BQU0sR0FBR0osS0FBSyxDQUFDSyxNQUFwQyxFQUE0Q0QsTUFBTSxJQUFJRCxhQUF0RCxFQUFxRTtBQUNqRWpCLHNCQUFLb0IsR0FBTCxDQUFTckIsZUFBVCxFQUEwQmEsS0FBSyxDQUFDTSxNQUFELENBQS9CLEVBQXlDTixLQUFLLENBQUNNLE1BQU0sR0FBQyxDQUFSLENBQTlDLEVBQTBELENBQTFEOztBQUNBbEIsc0JBQUtxQixhQUFMLENBQW1CcEIsZUFBbkIsRUFBb0NGLGVBQXBDLEVBQXFEVSxNQUFyRDs7QUFFQUssTUFBQUEsS0FBSyxDQUFDSSxNQUFELENBQUwsR0FBZ0JqQixlQUFlLENBQUNxQixDQUFoQztBQUNBUixNQUFBQSxLQUFLLENBQUNJLE1BQU0sR0FBQyxDQUFSLENBQUwsR0FBa0JqQixlQUFlLENBQUNzQixDQUFsQztBQUNBVCxNQUFBQSxLQUFLLENBQUNJLE1BQU0sR0FBQyxDQUFSLENBQUwsR0FBa0JqQixlQUFlLENBQUN1QixDQUFsQztBQUNIO0FBQ0o7QUFmdUQsQ0FBNUQiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgVmVjMyBmcm9tICcuLi8uLi8uLi8uLi8uLi92YWx1ZS10eXBlcy92ZWMzJztcbmNvbnN0IEFzc2VtYmxlcjNEID0gcmVxdWlyZSgnLi4vLi4vLi4vLi4vYXNzZW1ibGVyLTNkJyk7XG5jb25zdCBSYWRpYWxGaWxsZWRBc3NlbWJsZXIgPSByZXF1aXJlKCcuLi8yZC9yYWRpYWwtZmlsbGVkJyk7XG5cbmNvbnN0IHZlYzNfdGVtcF9sb2NhbCA9IG5ldyBWZWMzKCk7XG5jb25zdCB2ZWMzX3RlbXBfd29ybGQgPSBuZXcgVmVjMygpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSYWRpYWxGaWxsZWRBc3NlbWJsZXIzRCBleHRlbmRzIFJhZGlhbEZpbGxlZEFzc2VtYmxlciB7XG4gICAgXG59XG5cbmNjLmpzLm1peGluKFJhZGlhbEZpbGxlZEFzc2VtYmxlcjNELnByb3RvdHlwZSwgQXNzZW1ibGVyM0QsIHtcbiAgICB1cGRhdGVXb3JsZFZlcnRzIChzcHJpdGUpIHtcbiAgICAgICAgbGV0IG1hdHJpeCA9IHNwcml0ZS5ub2RlLl93b3JsZE1hdHJpeDtcbiAgICAgICAgbGV0IGxvY2FsID0gdGhpcy5fbG9jYWw7XG4gICAgICAgIGxldCB3b3JsZCA9IHRoaXMuX3JlbmRlckRhdGEudkRhdGFzWzBdO1xuXG4gICAgICAgIGxldCBmbG9hdHNQZXJWZXJ0ID0gdGhpcy5mbG9hdHNQZXJWZXJ0O1xuICAgICAgICBmb3IgKGxldCBvZmZzZXQgPSAwOyBvZmZzZXQgPCB3b3JsZC5sZW5ndGg7IG9mZnNldCArPSBmbG9hdHNQZXJWZXJ0KSB7XG4gICAgICAgICAgICBWZWMzLnNldCh2ZWMzX3RlbXBfbG9jYWwsIGxvY2FsW29mZnNldF0sIGxvY2FsW29mZnNldCsxXSwgMCk7XG4gICAgICAgICAgICBWZWMzLnRyYW5zZm9ybU1hdDQodmVjM190ZW1wX3dvcmxkLCB2ZWMzX3RlbXBfbG9jYWwsIG1hdHJpeCk7XG5cbiAgICAgICAgICAgIHdvcmxkW29mZnNldF0gPSB2ZWMzX3RlbXBfd29ybGQueDtcbiAgICAgICAgICAgIHdvcmxkW29mZnNldCsxXSA9IHZlYzNfdGVtcF93b3JsZC55O1xuICAgICAgICAgICAgd29ybGRbb2Zmc2V0KzJdID0gdmVjM190ZW1wX3dvcmxkLno7XG4gICAgICAgIH1cbiAgICB9XG59KTtcbiJdfQ==