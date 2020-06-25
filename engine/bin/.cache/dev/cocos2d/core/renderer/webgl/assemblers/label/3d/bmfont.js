
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/webgl/assemblers/label/3d/bmfont.js';
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

var WebglBmfontAssembler = require('../2d/bmfont');

var vec3_temp_local = new _vec["default"]();
var vec3_temp_world = new _vec["default"]();

var WebglBmfontAssembler3D =
/*#__PURE__*/
function (_WebglBmfontAssembler) {
  _inheritsLoose(WebglBmfontAssembler3D, _WebglBmfontAssembler);

  function WebglBmfontAssembler3D() {
    return _WebglBmfontAssembler.apply(this, arguments) || this;
  }

  return WebglBmfontAssembler3D;
}(WebglBmfontAssembler);

exports["default"] = WebglBmfontAssembler3D;
cc.js.mixin(WebglBmfontAssembler3D.prototype, Assembler3D, {
  updateWorldVerts: function updateWorldVerts(comp) {
    var matrix = comp.node._worldMatrix;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJtZm9udC5qcyJdLCJuYW1lcyI6WyJBc3NlbWJsZXIzRCIsInJlcXVpcmUiLCJXZWJnbEJtZm9udEFzc2VtYmxlciIsInZlYzNfdGVtcF9sb2NhbCIsIlZlYzMiLCJ2ZWMzX3RlbXBfd29ybGQiLCJXZWJnbEJtZm9udEFzc2VtYmxlcjNEIiwiY2MiLCJqcyIsIm1peGluIiwicHJvdG90eXBlIiwidXBkYXRlV29ybGRWZXJ0cyIsImNvbXAiLCJtYXRyaXgiLCJub2RlIiwiX3dvcmxkTWF0cml4IiwibG9jYWwiLCJfbG9jYWwiLCJ3b3JsZCIsIl9yZW5kZXJEYXRhIiwidkRhdGFzIiwiZmxvYXRzUGVyVmVydCIsIm9mZnNldCIsImxlbmd0aCIsInNldCIsInRyYW5zZm9ybU1hdDQiLCJ4IiwieSIsInoiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkE7Ozs7OztBQUNBLElBQU1BLFdBQVcsR0FBR0MsT0FBTyxDQUFDLDBCQUFELENBQTNCOztBQUNBLElBQU1DLG9CQUFvQixHQUFHRCxPQUFPLENBQUMsY0FBRCxDQUFwQzs7QUFFQSxJQUFNRSxlQUFlLEdBQUcsSUFBSUMsZUFBSixFQUF4QjtBQUNBLElBQU1DLGVBQWUsR0FBRyxJQUFJRCxlQUFKLEVBQXhCOztJQUVxQkU7Ozs7Ozs7Ozs7RUFBK0JKOzs7QUFJcERLLEVBQUUsQ0FBQ0MsRUFBSCxDQUFNQyxLQUFOLENBQVlILHNCQUFzQixDQUFDSSxTQUFuQyxFQUE4Q1YsV0FBOUMsRUFBMkQ7QUFDdkRXLEVBQUFBLGdCQUR1RCw0QkFDckNDLElBRHFDLEVBQy9CO0FBQ3BCLFFBQUlDLE1BQU0sR0FBR0QsSUFBSSxDQUFDRSxJQUFMLENBQVVDLFlBQXZCO0FBQ0EsUUFBSUMsS0FBSyxHQUFHLEtBQUtDLE1BQWpCO0FBQ0EsUUFBSUMsS0FBSyxHQUFHLEtBQUtDLFdBQUwsQ0FBaUJDLE1BQWpCLENBQXdCLENBQXhCLENBQVo7QUFFQSxRQUFJQyxhQUFhLEdBQUcsS0FBS0EsYUFBekI7O0FBQ0EsU0FBSyxJQUFJQyxNQUFNLEdBQUcsQ0FBbEIsRUFBcUJBLE1BQU0sR0FBR0osS0FBSyxDQUFDSyxNQUFwQyxFQUE0Q0QsTUFBTSxJQUFJRCxhQUF0RCxFQUFxRTtBQUNqRWpCLHNCQUFLb0IsR0FBTCxDQUFTckIsZUFBVCxFQUEwQmEsS0FBSyxDQUFDTSxNQUFELENBQS9CLEVBQXlDTixLQUFLLENBQUNNLE1BQU0sR0FBQyxDQUFSLENBQTlDLEVBQTBELENBQTFEOztBQUNBbEIsc0JBQUtxQixhQUFMLENBQW1CcEIsZUFBbkIsRUFBb0NGLGVBQXBDLEVBQXFEVSxNQUFyRDs7QUFFQUssTUFBQUEsS0FBSyxDQUFDSSxNQUFELENBQUwsR0FBZ0JqQixlQUFlLENBQUNxQixDQUFoQztBQUNBUixNQUFBQSxLQUFLLENBQUNJLE1BQU0sR0FBQyxDQUFSLENBQUwsR0FBa0JqQixlQUFlLENBQUNzQixDQUFsQztBQUNBVCxNQUFBQSxLQUFLLENBQUNJLE1BQU0sR0FBQyxDQUFSLENBQUwsR0FBa0JqQixlQUFlLENBQUN1QixDQUFsQztBQUNIO0FBQ0o7QUFmc0QsQ0FBM0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgVmVjMyBmcm9tICcuLi8uLi8uLi8uLi8uLi92YWx1ZS10eXBlcy92ZWMzJztcbmNvbnN0IEFzc2VtYmxlcjNEID0gcmVxdWlyZSgnLi4vLi4vLi4vLi4vYXNzZW1ibGVyLTNkJyk7XG5jb25zdCBXZWJnbEJtZm9udEFzc2VtYmxlciA9IHJlcXVpcmUoJy4uLzJkL2JtZm9udCcpO1xuXG5jb25zdCB2ZWMzX3RlbXBfbG9jYWwgPSBuZXcgVmVjMygpO1xuY29uc3QgdmVjM190ZW1wX3dvcmxkID0gbmV3IFZlYzMoKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2ViZ2xCbWZvbnRBc3NlbWJsZXIzRCBleHRlbmRzIFdlYmdsQm1mb250QXNzZW1ibGVyIHtcblxufVxuXG5jYy5qcy5taXhpbihXZWJnbEJtZm9udEFzc2VtYmxlcjNELnByb3RvdHlwZSwgQXNzZW1ibGVyM0QsIHtcbiAgICB1cGRhdGVXb3JsZFZlcnRzIChjb21wKSB7XG4gICAgICAgIGxldCBtYXRyaXggPSBjb21wLm5vZGUuX3dvcmxkTWF0cml4O1xuICAgICAgICBsZXQgbG9jYWwgPSB0aGlzLl9sb2NhbDtcbiAgICAgICAgbGV0IHdvcmxkID0gdGhpcy5fcmVuZGVyRGF0YS52RGF0YXNbMF07XG5cbiAgICAgICAgbGV0IGZsb2F0c1BlclZlcnQgPSB0aGlzLmZsb2F0c1BlclZlcnQ7XG4gICAgICAgIGZvciAobGV0IG9mZnNldCA9IDA7IG9mZnNldCA8IHdvcmxkLmxlbmd0aDsgb2Zmc2V0ICs9IGZsb2F0c1BlclZlcnQpIHtcbiAgICAgICAgICAgIFZlYzMuc2V0KHZlYzNfdGVtcF9sb2NhbCwgbG9jYWxbb2Zmc2V0XSwgbG9jYWxbb2Zmc2V0KzFdLCAwKTtcbiAgICAgICAgICAgIFZlYzMudHJhbnNmb3JtTWF0NCh2ZWMzX3RlbXBfd29ybGQsIHZlYzNfdGVtcF9sb2NhbCwgbWF0cml4KTtcblxuICAgICAgICAgICAgd29ybGRbb2Zmc2V0XSA9IHZlYzNfdGVtcF93b3JsZC54O1xuICAgICAgICAgICAgd29ybGRbb2Zmc2V0KzFdID0gdmVjM190ZW1wX3dvcmxkLnk7XG4gICAgICAgICAgICB3b3JsZFtvZmZzZXQrMl0gPSB2ZWMzX3RlbXBfd29ybGQuejtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIl19