
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/cocos/shapes/builtin-shape.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.BuiltinShape = void 0;

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var Vec3 = cc.Vec3;

var BuiltinShape =
/*#__PURE__*/
function () {
  function BuiltinShape() {
    this.id = BuiltinShape.idCounter++;
    this._sharedBody = void 0;
    this._collider = void 0;
    this._localShape = void 0;
    this._worldShape = void 0;
  }

  var _proto = BuiltinShape.prototype;

  _proto.__preload = function __preload(comp) {
    this._collider = comp;
    this._sharedBody = cc.director.getPhysics3DManager().physicsWorld.getSharedBody(this._collider.node);
    this._sharedBody.reference = true;
  };

  _proto.onLoad = function onLoad() {
    this.center = this._collider.center;
  };

  _proto.onEnable = function onEnable() {
    this._sharedBody.addShape(this);

    this._sharedBody.enabled = true;
  };

  _proto.onDisable = function onDisable() {
    this._sharedBody.removeShape(this);

    this._sharedBody.enabled = false;
  };

  _proto.onDestroy = function onDestroy() {
    this._sharedBody.reference = false;
    this._collider = null;
    this._localShape = null;
    this._worldShape = null;
  };

  _proto.transform = function transform(m, pos, rot, scale) {
    this._localShape.transform(m, pos, rot, scale, this._worldShape);
  };

  _createClass(BuiltinShape, [{
    key: "material",
    set: function set(v) {}
  }, {
    key: "isTrigger",
    set: function set(v) {}
  }, {
    key: "attachedRigidBody",
    get: function get() {
      return null;
    }
  }, {
    key: "center",
    set: function set(v) {
      Vec3.copy(this._localShape.center, v);
    }
  }, {
    key: "localShape",
    get: function get() {
      return this._worldShape;
    }
  }, {
    key: "worldShape",
    get: function get() {
      return this._worldShape;
    }
  }, {
    key: "sharedBody",
    get: function get() {
      return this._sharedBody;
    }
  }, {
    key: "collider",
    get: function get() {
      return this._collider;
    }
    /** id generator */

  }]);

  return BuiltinShape;
}();

exports.BuiltinShape = BuiltinShape;
BuiltinShape.idCounter = 0;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1aWx0aW4tc2hhcGUudHMiXSwibmFtZXMiOlsiVmVjMyIsImNjIiwiQnVpbHRpblNoYXBlIiwiaWQiLCJpZENvdW50ZXIiLCJfc2hhcmVkQm9keSIsIl9jb2xsaWRlciIsIl9sb2NhbFNoYXBlIiwiX3dvcmxkU2hhcGUiLCJfX3ByZWxvYWQiLCJjb21wIiwiZGlyZWN0b3IiLCJnZXRQaHlzaWNzM0RNYW5hZ2VyIiwicGh5c2ljc1dvcmxkIiwiZ2V0U2hhcmVkQm9keSIsIm5vZGUiLCJyZWZlcmVuY2UiLCJvbkxvYWQiLCJjZW50ZXIiLCJvbkVuYWJsZSIsImFkZFNoYXBlIiwiZW5hYmxlZCIsIm9uRGlzYWJsZSIsInJlbW92ZVNoYXBlIiwib25EZXN0cm95IiwidHJhbnNmb3JtIiwibSIsInBvcyIsInJvdCIsInNjYWxlIiwidiIsImNvcHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdDQSxJQUFNQSxJQUFJLEdBQUdDLEVBQUUsQ0FBQ0QsSUFBaEI7O0lBRWFFOzs7O1NBMkJBQyxLQUFhRCxZQUFZLENBQUNFLFNBQWI7U0FFWkM7U0FDQUM7U0FDQUM7U0FDQUM7Ozs7O1NBRVZDLFlBQUEsbUJBQVdDLElBQVgsRUFBNkI7QUFDekIsU0FBS0osU0FBTCxHQUFpQkksSUFBakI7QUFDQSxTQUFLTCxXQUFMLEdBQW9CSixFQUFFLENBQUNVLFFBQUgsQ0FBWUMsbUJBQVosR0FBa0NDLFlBQW5DLENBQWlFQyxhQUFqRSxDQUErRSxLQUFLUixTQUFMLENBQWVTLElBQTlGLENBQW5CO0FBQ0EsU0FBS1YsV0FBTCxDQUFpQlcsU0FBakIsR0FBNkIsSUFBN0I7QUFDSDs7U0FFREMsU0FBQSxrQkFBVTtBQUNOLFNBQUtDLE1BQUwsR0FBYyxLQUFLWixTQUFMLENBQWVZLE1BQTdCO0FBQ0g7O1NBRURDLFdBQUEsb0JBQVk7QUFDUixTQUFLZCxXQUFMLENBQWlCZSxRQUFqQixDQUEwQixJQUExQjs7QUFDQSxTQUFLZixXQUFMLENBQWlCZ0IsT0FBakIsR0FBMkIsSUFBM0I7QUFDSDs7U0FFREMsWUFBQSxxQkFBYTtBQUNULFNBQUtqQixXQUFMLENBQWlCa0IsV0FBakIsQ0FBNkIsSUFBN0I7O0FBQ0EsU0FBS2xCLFdBQUwsQ0FBaUJnQixPQUFqQixHQUEyQixLQUEzQjtBQUNIOztTQUVERyxZQUFBLHFCQUFhO0FBQ1QsU0FBS25CLFdBQUwsQ0FBaUJXLFNBQWpCLEdBQTZCLEtBQTdCO0FBQ0MsU0FBS1YsU0FBTixHQUEwQixJQUExQjtBQUNDLFNBQUtDLFdBQU4sR0FBNEIsSUFBNUI7QUFDQyxTQUFLQyxXQUFOLEdBQTRCLElBQTVCO0FBQ0g7O1NBRURpQixZQUFBLG1CQUFXQyxDQUFYLEVBQXVCQyxHQUF2QixFQUFxQ0MsR0FBckMsRUFBbURDLEtBQW5ELEVBQW1FO0FBQy9ELFNBQUt0QixXQUFMLENBQWlCa0IsU0FBakIsQ0FBMkJDLENBQTNCLEVBQThCQyxHQUE5QixFQUFtQ0MsR0FBbkMsRUFBd0NDLEtBQXhDLEVBQStDLEtBQUtyQixXQUFwRDtBQUNIOzs7O3NCQTlEYXNCLEdBQW9CLENBQUc7OztzQkFDdEJBLEdBQVksQ0FBRzs7O3dCQUNlO0FBQUUsYUFBTyxJQUFQO0FBQWM7OztzQkFFakRBLEdBQWM7QUFDdEI5QixNQUFBQSxJQUFJLENBQUMrQixJQUFMLENBQVUsS0FBS3hCLFdBQUwsQ0FBaUJXLE1BQTNCLEVBQW1DWSxDQUFuQztBQUNIOzs7d0JBRWlCO0FBQ2QsYUFBTyxLQUFLdEIsV0FBWjtBQUNIOzs7d0JBRWlCO0FBQ2QsYUFBTyxLQUFLQSxXQUFaO0FBQ0g7Ozt3QkFFaUI7QUFDZCxhQUFPLEtBQUtILFdBQVo7QUFDSDs7O3dCQUVlO0FBQ1osYUFBTyxLQUFLQyxTQUFaO0FBQ0g7QUFFRDs7Ozs7Ozs7QUF6QlNKLGFBMEJNRSxZQUFvQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE5IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgeyBCdWlsdGluU2hhcmVkQm9keSB9IGZyb20gJy4uL2J1aWx0aW4tc2hhcmVkLWJvZHknO1xuaW1wb3J0IHsgSUJ1aWx0aW5TaGFwZSB9IGZyb20gJy4uL2J1aWx0aW4taW50ZXJmYWNlJztcbmltcG9ydCB7IENvbGxpZGVyM0QsIFBoeXNpY3NNYXRlcmlhbCwgUmlnaWRCb2R5M0QgfSBmcm9tICcuLi8uLi9leHBvcnRzL3BoeXNpY3MtZnJhbWV3b3JrJztcbmltcG9ydCB7IElCYXNlU2hhcGUgfSBmcm9tICcuLi8uLi9zcGVjL2ktcGh5c2ljcy1zaGFwZSc7XG5pbXBvcnQgeyBJVmVjM0xpa2UgfSBmcm9tICcuLi8uLi9zcGVjL2ktY29tbW9uJztcbmltcG9ydCB7IEJ1aWx0SW5Xb3JsZCB9IGZyb20gJy4uL2J1aWx0aW4td29ybGQnO1xuXG5jb25zdCBWZWMzID0gY2MuVmVjMztcblxuZXhwb3J0IGNsYXNzIEJ1aWx0aW5TaGFwZSBpbXBsZW1lbnRzIElCYXNlU2hhcGUge1xuICAgIHNldCBtYXRlcmlhbCAodjogUGh5c2ljc01hdGVyaWFsKSB7IH1cbiAgICBzZXQgaXNUcmlnZ2VyICh2OiBib29sZWFuKSB7IH1cbiAgICBnZXQgYXR0YWNoZWRSaWdpZEJvZHkgKCk6IFJpZ2lkQm9keTNEIHwgbnVsbCB7IHJldHVybiBudWxsOyB9XG5cbiAgICBzZXQgY2VudGVyICh2OiBJVmVjM0xpa2UpIHtcbiAgICAgICAgVmVjMy5jb3B5KHRoaXMuX2xvY2FsU2hhcGUuY2VudGVyLCB2KTtcbiAgICB9XG5cbiAgICBnZXQgbG9jYWxTaGFwZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93b3JsZFNoYXBlO1xuICAgIH1cblxuICAgIGdldCB3b3JsZFNoYXBlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dvcmxkU2hhcGU7XG4gICAgfVxuXG4gICAgZ2V0IHNoYXJlZEJvZHkgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2hhcmVkQm9keTtcbiAgICB9XG5cbiAgICBnZXQgY29sbGlkZXIgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29sbGlkZXI7XG4gICAgfVxuXG4gICAgLyoqIGlkIGdlbmVyYXRvciAqL1xuICAgIHByaXZhdGUgc3RhdGljIGlkQ291bnRlcjogbnVtYmVyID0gMDtcbiAgICByZWFkb25seSBpZDogbnVtYmVyID0gQnVpbHRpblNoYXBlLmlkQ291bnRlcisrOztcblxuICAgIHByb3RlY3RlZCBfc2hhcmVkQm9keSE6IEJ1aWx0aW5TaGFyZWRCb2R5O1xuICAgIHByb3RlY3RlZCBfY29sbGlkZXIhOiBDb2xsaWRlcjNEO1xuICAgIHByb3RlY3RlZCBfbG9jYWxTaGFwZSE6IElCdWlsdGluU2hhcGU7XG4gICAgcHJvdGVjdGVkIF93b3JsZFNoYXBlITogSUJ1aWx0aW5TaGFwZTtcblxuICAgIF9fcHJlbG9hZCAoY29tcDogQ29sbGlkZXIzRCkge1xuICAgICAgICB0aGlzLl9jb2xsaWRlciA9IGNvbXA7XG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkgPSAoY2MuZGlyZWN0b3IuZ2V0UGh5c2ljczNETWFuYWdlcigpLnBoeXNpY3NXb3JsZCBhcyBCdWlsdEluV29ybGQpLmdldFNoYXJlZEJvZHkodGhpcy5fY29sbGlkZXIubm9kZSk7XG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkucmVmZXJlbmNlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBvbkxvYWQgKCkge1xuICAgICAgICB0aGlzLmNlbnRlciA9IHRoaXMuX2NvbGxpZGVyLmNlbnRlcjtcbiAgICB9XG5cbiAgICBvbkVuYWJsZSAoKSB7XG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkuYWRkU2hhcGUodGhpcyk7XG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkuZW5hYmxlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgb25EaXNhYmxlICgpIHtcbiAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5yZW1vdmVTaGFwZSh0aGlzKTtcbiAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5lbmFibGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgb25EZXN0cm95ICgpIHtcbiAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5yZWZlcmVuY2UgPSBmYWxzZTtcbiAgICAgICAgKHRoaXMuX2NvbGxpZGVyIGFzIGFueSkgPSBudWxsO1xuICAgICAgICAodGhpcy5fbG9jYWxTaGFwZSBhcyBhbnkpID0gbnVsbDtcbiAgICAgICAgKHRoaXMuX3dvcmxkU2hhcGUgYXMgYW55KSA9IG51bGw7XG4gICAgfVxuXG4gICAgdHJhbnNmb3JtIChtOiBjYy5NYXQ0LCBwb3M6IGNjLlZlYzMsIHJvdDogY2MuUXVhdCwgc2NhbGU6IGNjLlZlYzMpIHtcbiAgICAgICAgdGhpcy5fbG9jYWxTaGFwZS50cmFuc2Zvcm0obSwgcG9zLCByb3QsIHNjYWxlLCB0aGlzLl93b3JsZFNoYXBlKTtcbiAgICB9XG5cbn1cbiJdfQ==