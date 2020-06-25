
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/webgl/assemblers/sprite/3d/mesh.js';
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

var MeshAssembler = require('../2d/mesh');

var vec3_temp = new _vec["default"]();

var MeshAssembler3D =
/*#__PURE__*/
function (_MeshAssembler) {
  _inheritsLoose(MeshAssembler3D, _MeshAssembler);

  function MeshAssembler3D() {
    return _MeshAssembler.apply(this, arguments) || this;
  }

  return MeshAssembler3D;
}(MeshAssembler);

exports["default"] = MeshAssembler3D;
cc.js.mixin(MeshAssembler3D.prototype, Assembler3D, {
  updateWorldVerts: function updateWorldVerts(comp) {
    var matrix = comp.node._worldMatrix;
    var local = this._local;
    var world = this._renderData.vDatas[0];
    var floatsPerVert = this.floatsPerVert;

    for (var i = 0, l = local.length / 2; i < l; i++) {
      _vec["default"].set(vec3_temp, local[i * 2], local[i * 2 + 1], 0);

      _vec["default"].transformMat4(vec3_temp, vec3_temp, matrix);

      var dstOffset = floatsPerVert * i;
      world[dstOffset] = vec3_temp.x;
      world[dstOffset + 1] = vec3_temp.y;
      world[dstOffset + 2] = vec3_temp.z;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1lc2guanMiXSwibmFtZXMiOlsiQXNzZW1ibGVyM0QiLCJyZXF1aXJlIiwiTWVzaEFzc2VtYmxlciIsInZlYzNfdGVtcCIsIlZlYzMiLCJNZXNoQXNzZW1ibGVyM0QiLCJjYyIsImpzIiwibWl4aW4iLCJwcm90b3R5cGUiLCJ1cGRhdGVXb3JsZFZlcnRzIiwiY29tcCIsIm1hdHJpeCIsIm5vZGUiLCJfd29ybGRNYXRyaXgiLCJsb2NhbCIsIl9sb2NhbCIsIndvcmxkIiwiX3JlbmRlckRhdGEiLCJ2RGF0YXMiLCJmbG9hdHNQZXJWZXJ0IiwiaSIsImwiLCJsZW5ndGgiLCJzZXQiLCJ0cmFuc2Zvcm1NYXQ0IiwiZHN0T2Zmc2V0IiwieCIsInkiLCJ6Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBOzs7Ozs7QUFDQSxJQUFNQSxXQUFXLEdBQUdDLE9BQU8sQ0FBQywwQkFBRCxDQUEzQjs7QUFDQSxJQUFNQyxhQUFhLEdBQUdELE9BQU8sQ0FBQyxZQUFELENBQTdCOztBQUVBLElBQUlFLFNBQVMsR0FBRyxJQUFJQyxlQUFKLEVBQWhCOztJQUVxQkM7Ozs7Ozs7Ozs7RUFBd0JIOzs7QUFJN0NJLEVBQUUsQ0FBQ0MsRUFBSCxDQUFNQyxLQUFOLENBQVlILGVBQWUsQ0FBQ0ksU0FBNUIsRUFBdUNULFdBQXZDLEVBQW9EO0FBQ2hEVSxFQUFBQSxnQkFEZ0QsNEJBQzlCQyxJQUQ4QixFQUN4QjtBQUNwQixRQUFJQyxNQUFNLEdBQUdELElBQUksQ0FBQ0UsSUFBTCxDQUFVQyxZQUF2QjtBQUNBLFFBQUlDLEtBQUssR0FBRyxLQUFLQyxNQUFqQjtBQUNBLFFBQUlDLEtBQUssR0FBRyxLQUFLQyxXQUFMLENBQWlCQyxNQUFqQixDQUF3QixDQUF4QixDQUFaO0FBRUEsUUFBSUMsYUFBYSxHQUFHLEtBQUtBLGFBQXpCOztBQUNBLFNBQUssSUFBSUMsQ0FBQyxHQUFHLENBQVIsRUFBV0MsQ0FBQyxHQUFHUCxLQUFLLENBQUNRLE1BQU4sR0FBYSxDQUFqQyxFQUFvQ0YsQ0FBQyxHQUFHQyxDQUF4QyxFQUEyQ0QsQ0FBQyxFQUE1QyxFQUFnRDtBQUM1Q2pCLHNCQUFLb0IsR0FBTCxDQUFTckIsU0FBVCxFQUFvQlksS0FBSyxDQUFDTSxDQUFDLEdBQUMsQ0FBSCxDQUF6QixFQUFnQ04sS0FBSyxDQUFDTSxDQUFDLEdBQUMsQ0FBRixHQUFJLENBQUwsQ0FBckMsRUFBOEMsQ0FBOUM7O0FBQ0FqQixzQkFBS3FCLGFBQUwsQ0FBbUJ0QixTQUFuQixFQUE4QkEsU0FBOUIsRUFBeUNTLE1BQXpDOztBQUVBLFVBQUljLFNBQVMsR0FBR04sYUFBYSxHQUFHQyxDQUFoQztBQUNBSixNQUFBQSxLQUFLLENBQUNTLFNBQUQsQ0FBTCxHQUFtQnZCLFNBQVMsQ0FBQ3dCLENBQTdCO0FBQ0FWLE1BQUFBLEtBQUssQ0FBQ1MsU0FBUyxHQUFDLENBQVgsQ0FBTCxHQUFxQnZCLFNBQVMsQ0FBQ3lCLENBQS9CO0FBQ0FYLE1BQUFBLEtBQUssQ0FBQ1MsU0FBUyxHQUFDLENBQVgsQ0FBTCxHQUFxQnZCLFNBQVMsQ0FBQzBCLENBQS9CO0FBQ0g7QUFDSjtBQWhCK0MsQ0FBcEQiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgVmVjMyBmcm9tICcuLi8uLi8uLi8uLi8uLi92YWx1ZS10eXBlcy92ZWMzJztcbmNvbnN0IEFzc2VtYmxlcjNEID0gcmVxdWlyZSgnLi4vLi4vLi4vLi4vYXNzZW1ibGVyLTNkJyk7XG5jb25zdCBNZXNoQXNzZW1ibGVyID0gcmVxdWlyZSgnLi4vMmQvbWVzaCcpO1xuXG5sZXQgdmVjM190ZW1wID0gbmV3IFZlYzMoKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVzaEFzc2VtYmxlcjNEIGV4dGVuZHMgTWVzaEFzc2VtYmxlciB7XG4gICAgXG59XG5cbmNjLmpzLm1peGluKE1lc2hBc3NlbWJsZXIzRC5wcm90b3R5cGUsIEFzc2VtYmxlcjNELCB7XG4gICAgdXBkYXRlV29ybGRWZXJ0cyAoY29tcCkge1xuICAgICAgICBsZXQgbWF0cml4ID0gY29tcC5ub2RlLl93b3JsZE1hdHJpeDtcbiAgICAgICAgbGV0IGxvY2FsID0gdGhpcy5fbG9jYWw7XG4gICAgICAgIGxldCB3b3JsZCA9IHRoaXMuX3JlbmRlckRhdGEudkRhdGFzWzBdO1xuICAgICBcbiAgICAgICAgbGV0IGZsb2F0c1BlclZlcnQgPSB0aGlzLmZsb2F0c1BlclZlcnQ7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gbG9jYWwubGVuZ3RoLzI7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIFZlYzMuc2V0KHZlYzNfdGVtcCwgbG9jYWxbaSoyXSwgbG9jYWxbaSoyKzFdLCAwKTtcbiAgICAgICAgICAgIFZlYzMudHJhbnNmb3JtTWF0NCh2ZWMzX3RlbXAsIHZlYzNfdGVtcCwgbWF0cml4KTtcblxuICAgICAgICAgICAgbGV0IGRzdE9mZnNldCA9IGZsb2F0c1BlclZlcnQgKiBpO1xuICAgICAgICAgICAgd29ybGRbZHN0T2Zmc2V0XSA9IHZlYzNfdGVtcC54O1xuICAgICAgICAgICAgd29ybGRbZHN0T2Zmc2V0KzFdID0gdmVjM190ZW1wLnk7XG4gICAgICAgICAgICB3b3JsZFtkc3RPZmZzZXQrMl0gPSB2ZWMzX3RlbXAuejtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIl19