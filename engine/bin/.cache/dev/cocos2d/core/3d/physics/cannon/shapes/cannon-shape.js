
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/cannon/shapes/cannon-shape.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.CannonShape = void 0;

var _cannon = _interopRequireDefault(require("../../../../../../external/cannon/cannon"));

var _util = require("../../framework/util");

var _cannonUtil = require("../cannon-util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TriggerEventObject = {
  type: 'trigger-enter',
  selfCollider: null,
  otherCollider: null
};
var Vec3 = cc.Vec3;
var v3_0 = new Vec3();

var CannonShape =
/*#__PURE__*/
function () {
  function CannonShape() {
    this._collider = void 0;
    this._shape = void 0;
    this._offset = new _cannon["default"].Vec3();
    this._orient = new _cannon["default"].Quaternion();
    this._index = -1;
    this._sharedBody = void 0;
    this.onTriggerListener = this.onTrigger.bind(this);
  }

  var _proto = CannonShape.prototype;

  /** LIFECYCLE */
  _proto.__preload = function __preload(comp) {
    this._collider = comp;
    (0, _util.setWrap)(this._shape, this);

    this._shape.addEventListener('triggered', this.onTriggerListener);

    this._sharedBody = cc.director.getPhysics3DManager().physicsWorld.getSharedBody(this._collider.node);
    this._sharedBody.reference = true;
  };

  _proto.onLoad = function onLoad() {
    this.center = this._collider.center;
    this.isTrigger = this._collider.isTrigger;
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
    this._sharedBody = null;
    (0, _util.setWrap)(this._shape, null);
    this._offset = null;
    this._orient = null;
    this._shape = null;
    this._collider = null;
    this.onTriggerListener = null;
  }
  /**
   * change scale will recalculate center & size \
   * size handle by child class
   * @param scale 
   */
  ;

  _proto.setScale = function setScale(scale) {
    this.center = this._collider.center;
  };

  _proto.setIndex = function setIndex(index) {
    this._index = index;
  };

  _proto.setOffsetAndOrient = function setOffsetAndOrient(offset, Orient) {
    this._offset = offset;
    this._orient = Orient;
  };

  _proto.onTrigger = function onTrigger(event) {
    TriggerEventObject.type = event.event;
    var self = (0, _util.getWrap)(event.selfShape);
    var other = (0, _util.getWrap)(event.otherShape);

    if (self) {
      TriggerEventObject.selfCollider = self.collider;
      TriggerEventObject.otherCollider = other ? other.collider : null;

      this._collider.emit(TriggerEventObject.type, TriggerEventObject);
    }
  };

  _createClass(CannonShape, [{
    key: "shape",
    get: function get() {
      return this._shape;
    }
  }, {
    key: "collider",
    get: function get() {
      return this._collider;
    }
  }, {
    key: "attachedRigidBody",
    get: function get() {
      if (this._sharedBody.wrappedBody) {
        return this._sharedBody.wrappedBody.rigidBody;
      }

      return null;
    }
  }, {
    key: "sharedBody",
    get: function get() {
      return this._sharedBody;
    }
  }, {
    key: "material",
    set: function set(mat) {
      if (mat == null) {
        this._shape.material = null;
      } else {
        if (CannonShape.idToMaterial[mat._uuid] == null) {
          CannonShape.idToMaterial[mat._uuid] = new _cannon["default"].Material(mat._uuid);
        }

        this._shape.material = CannonShape.idToMaterial[mat._uuid];
        this._shape.material.friction = mat.friction;
        this._shape.material.restitution = mat.restitution;
      }
    }
  }, {
    key: "isTrigger",
    set: function set(v) {
      this._shape.collisionResponse = !v;

      if (this._index >= 0) {
        this._body.updateHasTrigger();
      }
    }
  }, {
    key: "center",
    set: function set(v) {
      var lpos = this._offset;
      Vec3.copy(lpos, v);

      this._collider.node.getWorldScale(v3_0);

      Vec3.multiply(lpos, lpos, v3_0);

      if (this._index >= 0) {
        (0, _cannonUtil.commitShapeUpdates)(this._body);
      }
    }
  }, {
    key: "_body",
    get: function get() {
      return this._sharedBody.body;
    }
  }]);

  return CannonShape;
}();

exports.CannonShape = CannonShape;
CannonShape.idToMaterial = {};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhbm5vbi1zaGFwZS50cyJdLCJuYW1lcyI6WyJUcmlnZ2VyRXZlbnRPYmplY3QiLCJ0eXBlIiwic2VsZkNvbGxpZGVyIiwib3RoZXJDb2xsaWRlciIsIlZlYzMiLCJjYyIsInYzXzAiLCJDYW5ub25TaGFwZSIsIl9jb2xsaWRlciIsIl9zaGFwZSIsIl9vZmZzZXQiLCJDQU5OT04iLCJfb3JpZW50IiwiUXVhdGVybmlvbiIsIl9pbmRleCIsIl9zaGFyZWRCb2R5Iiwib25UcmlnZ2VyTGlzdGVuZXIiLCJvblRyaWdnZXIiLCJiaW5kIiwiX19wcmVsb2FkIiwiY29tcCIsImFkZEV2ZW50TGlzdGVuZXIiLCJkaXJlY3RvciIsImdldFBoeXNpY3MzRE1hbmFnZXIiLCJwaHlzaWNzV29ybGQiLCJnZXRTaGFyZWRCb2R5Iiwibm9kZSIsInJlZmVyZW5jZSIsIm9uTG9hZCIsImNlbnRlciIsImlzVHJpZ2dlciIsIm9uRW5hYmxlIiwiYWRkU2hhcGUiLCJlbmFibGVkIiwib25EaXNhYmxlIiwicmVtb3ZlU2hhcGUiLCJvbkRlc3Ryb3kiLCJzZXRTY2FsZSIsInNjYWxlIiwic2V0SW5kZXgiLCJpbmRleCIsInNldE9mZnNldEFuZE9yaWVudCIsIm9mZnNldCIsIk9yaWVudCIsImV2ZW50Iiwic2VsZiIsInNlbGZTaGFwZSIsIm90aGVyIiwib3RoZXJTaGFwZSIsImNvbGxpZGVyIiwiZW1pdCIsIndyYXBwZWRCb2R5IiwicmlnaWRCb2R5IiwibWF0IiwibWF0ZXJpYWwiLCJpZFRvTWF0ZXJpYWwiLCJfdXVpZCIsIk1hdGVyaWFsIiwiZnJpY3Rpb24iLCJyZXN0aXR1dGlvbiIsInYiLCJjb2xsaXNpb25SZXNwb25zZSIsIl9ib2R5IiwidXBkYXRlSGFzVHJpZ2dlciIsImxwb3MiLCJjb3B5IiwiZ2V0V29ybGRTY2FsZSIsIm11bHRpcGx5IiwiYm9keSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFTQSxJQUFNQSxr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TSxXQUF4QztBQUNIO0FBQ0o7OztzQkFFY0MsR0FBWTtBQUN2QixXQUFLbkQsTUFBTCxDQUFZb0QsaUJBQVosR0FBZ0MsQ0FBQ0QsQ0FBakM7O0FBQ0EsVUFBSSxLQUFLOUMsTUFBTCxJQUFlLENBQW5CLEVBQXNCO0FBQ2xCLGFBQUtnRCxLQUFMLENBQVdDLGdCQUFYO0FBQ0g7QUFDSjs7O3NCQUVXSCxHQUFjO0FBQ3RCLFVBQU1JLElBQUksR0FBRyxLQUFLdEQsT0FBbEI7QUFDQU4sTUFBQUEsSUFBSSxDQUFDNkQsSUFBTCxDQUFVRCxJQUFWLEVBQWdCSixDQUFoQjs7QUFDQSxXQUFLcEQsU0FBTCxDQUFla0IsSUFBZixDQUFvQndDLGFBQXBCLENBQWtDNUQsSUFBbEM7O0FBQ0FGLE1BQUFBLElBQUksQ0FBQytELFFBQUwsQ0FBY0gsSUFBZCxFQUFvQkEsSUFBcEIsRUFBMEIxRCxJQUExQjs7QUFDQSxVQUFJLEtBQUtRLE1BQUwsSUFBZSxDQUFuQixFQUFzQjtBQUNsQiw0Q0FBbUIsS0FBS2dELEtBQXhCO0FBQ0g7QUFDSjs7O3dCQVNtQztBQUFFLGFBQU8sS0FBSy9DLFdBQUwsQ0FBaUJxRCxJQUF4QjtBQUErQjs7Ozs7OztBQXJENUQ3RCxZQUVPZ0QsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE5IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgQ0FOTk9OIGZyb20gJy4uLy4uLy4uLy4uLy4uLy4uL2V4dGVybmFsL2Nhbm5vbi9jYW5ub24nO1xuaW1wb3J0IHsgZ2V0V3JhcCwgc2V0V3JhcCB9IGZyb20gJy4uLy4uL2ZyYW1ld29yay91dGlsJztcbmltcG9ydCB7IGNvbW1pdFNoYXBlVXBkYXRlcyB9IGZyb20gJy4uL2Nhbm5vbi11dGlsJztcbmltcG9ydCB7IFBoeXNpY3NNYXRlcmlhbCB9IGZyb20gJy4uLy4uL2ZyYW1ld29yay9hc3NldHMvcGh5c2ljcy1tYXRlcmlhbCc7XG5pbXBvcnQgeyBJQmFzZVNoYXBlIH0gZnJvbSAnLi4vLi4vc3BlYy9pLXBoeXNpY3Mtc2hhcGUnO1xuaW1wb3J0IHsgSVZlYzNMaWtlIH0gZnJvbSAnLi4vLi4vc3BlYy9pLWNvbW1vbic7XG5pbXBvcnQgeyBDYW5ub25TaGFyZWRCb2R5IH0gZnJvbSAnLi4vY2Fubm9uLXNoYXJlZC1ib2R5JztcbmltcG9ydCB7IENhbm5vbldvcmxkIH0gZnJvbSAnLi4vY2Fubm9uLXdvcmxkJztcbmltcG9ydCB7IFRyaWdnZXJFdmVudFR5cGUgfSBmcm9tICcuLi8uLi9mcmFtZXdvcmsvcGh5c2ljcy1pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQ29sbGlkZXIzRCB9IGZyb20gJy4uLy4uL2ZyYW1ld29yayc7XG5cbmNvbnN0IFRyaWdnZXJFdmVudE9iamVjdCA9IHtcbiAgICB0eXBlOiAndHJpZ2dlci1lbnRlcicgYXMgVHJpZ2dlckV2ZW50VHlwZSxcbiAgICBzZWxmQ29sbGlkZXI6IG51bGwgYXMgQ29sbGlkZXIzRCB8IG51bGwsXG4gICAgb3RoZXJDb2xsaWRlcjogbnVsbCBhcyBDb2xsaWRlcjNEIHwgbnVsbCxcbn07XG5cbmNvbnN0IFZlYzMgPSBjYy5WZWMzO1xuY29uc3QgdjNfMCA9IG5ldyBWZWMzKCk7XG5cbmV4cG9ydCBjbGFzcyBDYW5ub25TaGFwZSBpbXBsZW1lbnRzIElCYXNlU2hhcGUge1xuXG4gICAgc3RhdGljIHJlYWRvbmx5IGlkVG9NYXRlcmlhbCA9IHt9O1xuXG4gICAgZ2V0IHNoYXBlICgpIHsgcmV0dXJuIHRoaXMuX3NoYXBlITsgfVxuXG4gICAgZ2V0IGNvbGxpZGVyICgpIHsgcmV0dXJuIHRoaXMuX2NvbGxpZGVyOyB9XG5cbiAgICBnZXQgYXR0YWNoZWRSaWdpZEJvZHkgKCkge1xuICAgICAgICBpZiAodGhpcy5fc2hhcmVkQm9keS53cmFwcGVkQm9keSkgeyByZXR1cm4gdGhpcy5fc2hhcmVkQm9keS53cmFwcGVkQm9keS5yaWdpZEJvZHk7IH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZ2V0IHNoYXJlZEJvZHkgKCk6IENhbm5vblNoYXJlZEJvZHkgeyByZXR1cm4gdGhpcy5fc2hhcmVkQm9keTsgfVxuXG4gICAgc2V0IG1hdGVyaWFsIChtYXQ6IFBoeXNpY3NNYXRlcmlhbCkge1xuICAgICAgICBpZiAobWF0ID09IG51bGwpIHtcbiAgICAgICAgICAgICh0aGlzLl9zaGFwZSEubWF0ZXJpYWwgYXMgdW5rbm93bikgPSBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKENhbm5vblNoYXBlLmlkVG9NYXRlcmlhbFttYXQuX3V1aWRdID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBDYW5ub25TaGFwZS5pZFRvTWF0ZXJpYWxbbWF0Ll91dWlkXSA9IG5ldyBDQU5OT04uTWF0ZXJpYWwobWF0Ll91dWlkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fc2hhcGUhLm1hdGVyaWFsID0gQ2Fubm9uU2hhcGUuaWRUb01hdGVyaWFsW21hdC5fdXVpZF07XG4gICAgICAgICAgICB0aGlzLl9zaGFwZSEubWF0ZXJpYWwuZnJpY3Rpb24gPSBtYXQuZnJpY3Rpb247XG4gICAgICAgICAgICB0aGlzLl9zaGFwZSEubWF0ZXJpYWwucmVzdGl0dXRpb24gPSBtYXQucmVzdGl0dXRpb247XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXQgaXNUcmlnZ2VyICh2OiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX3NoYXBlLmNvbGxpc2lvblJlc3BvbnNlID0gIXY7XG4gICAgICAgIGlmICh0aGlzLl9pbmRleCA+PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9ib2R5LnVwZGF0ZUhhc1RyaWdnZXIoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldCBjZW50ZXIgKHY6IElWZWMzTGlrZSkge1xuICAgICAgICBjb25zdCBscG9zID0gdGhpcy5fb2Zmc2V0IGFzIElWZWMzTGlrZTtcbiAgICAgICAgVmVjMy5jb3B5KGxwb3MsIHYpO1xuICAgICAgICB0aGlzLl9jb2xsaWRlci5ub2RlLmdldFdvcmxkU2NhbGUodjNfMCk7XG4gICAgICAgIFZlYzMubXVsdGlwbHkobHBvcywgbHBvcywgdjNfMCk7XG4gICAgICAgIGlmICh0aGlzLl9pbmRleCA+PSAwKSB7XG4gICAgICAgICAgICBjb21taXRTaGFwZVVwZGF0ZXModGhpcy5fYm9keSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfY29sbGlkZXIhOiBDb2xsaWRlcjNEO1xuXG4gICAgcHJvdGVjdGVkIF9zaGFwZSE6IENBTk5PTi5TaGFwZTtcbiAgICBwcm90ZWN0ZWQgX29mZnNldCA9IG5ldyBDQU5OT04uVmVjMygpO1xuICAgIHByb3RlY3RlZCBfb3JpZW50ID0gbmV3IENBTk5PTi5RdWF0ZXJuaW9uKCk7XG4gICAgcHJvdGVjdGVkIF9pbmRleDogbnVtYmVyID0gLTE7XG4gICAgcHJvdGVjdGVkIF9zaGFyZWRCb2R5ITogQ2Fubm9uU2hhcmVkQm9keTtcbiAgICBwcm90ZWN0ZWQgZ2V0IF9ib2R5ICgpOiBDQU5OT04uQm9keSB7IHJldHVybiB0aGlzLl9zaGFyZWRCb2R5LmJvZHk7IH1cbiAgICBwcm90ZWN0ZWQgb25UcmlnZ2VyTGlzdGVuZXIgPSB0aGlzLm9uVHJpZ2dlci5iaW5kKHRoaXMpO1xuXG4gICAgLyoqIExJRkVDWUNMRSAqL1xuXG4gICAgX19wcmVsb2FkIChjb21wOiBDb2xsaWRlcjNEKSB7XG4gICAgICAgIHRoaXMuX2NvbGxpZGVyID0gY29tcDtcbiAgICAgICAgc2V0V3JhcCh0aGlzLl9zaGFwZSwgdGhpcyk7XG4gICAgICAgIHRoaXMuX3NoYXBlLmFkZEV2ZW50TGlzdGVuZXIoJ3RyaWdnZXJlZCcsIHRoaXMub25UcmlnZ2VyTGlzdGVuZXIpO1xuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5ID0gKGNjLmRpcmVjdG9yLmdldFBoeXNpY3MzRE1hbmFnZXIoKS5waHlzaWNzV29ybGQgYXMgQ2Fubm9uV29ybGQpLmdldFNoYXJlZEJvZHkodGhpcy5fY29sbGlkZXIubm9kZSk7XG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkucmVmZXJlbmNlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBvbkxvYWQgKCkge1xuICAgICAgICB0aGlzLmNlbnRlciA9IHRoaXMuX2NvbGxpZGVyLmNlbnRlcjtcbiAgICAgICAgdGhpcy5pc1RyaWdnZXIgPSB0aGlzLl9jb2xsaWRlci5pc1RyaWdnZXI7XG4gICAgfVxuXG4gICAgb25FbmFibGUgKCkge1xuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LmFkZFNoYXBlKHRoaXMpO1xuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LmVuYWJsZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIG9uRGlzYWJsZSAoKSB7XG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkucmVtb3ZlU2hhcGUodGhpcyk7XG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkuZW5hYmxlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIG9uRGVzdHJveSAoKSB7XG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkucmVmZXJlbmNlID0gZmFsc2U7XG4gICAgICAgICh0aGlzLl9zaGFyZWRCb2R5IGFzIGFueSkgPSBudWxsO1xuICAgICAgICBzZXRXcmFwKHRoaXMuX3NoYXBlLCBudWxsKTtcbiAgICAgICAgKHRoaXMuX29mZnNldCBhcyBhbnkpID0gbnVsbDtcbiAgICAgICAgKHRoaXMuX29yaWVudCBhcyBhbnkpID0gbnVsbDtcbiAgICAgICAgKHRoaXMuX3NoYXBlIGFzIGFueSkgPSBudWxsO1xuICAgICAgICAodGhpcy5fY29sbGlkZXIgYXMgYW55KSA9IG51bGw7XG4gICAgICAgICh0aGlzLm9uVHJpZ2dlckxpc3RlbmVyIGFzIGFueSkgPSBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNoYW5nZSBzY2FsZSB3aWxsIHJlY2FsY3VsYXRlIGNlbnRlciAmIHNpemUgXFxcbiAgICAgKiBzaXplIGhhbmRsZSBieSBjaGlsZCBjbGFzc1xuICAgICAqIEBwYXJhbSBzY2FsZSBcbiAgICAgKi9cbiAgICBzZXRTY2FsZSAoc2NhbGU6IElWZWMzTGlrZSkge1xuICAgICAgICB0aGlzLmNlbnRlciA9IHRoaXMuX2NvbGxpZGVyLmNlbnRlcjtcbiAgICB9XG5cbiAgICBzZXRJbmRleCAoaW5kZXg6IG51bWJlcikge1xuICAgICAgICB0aGlzLl9pbmRleCA9IGluZGV4O1xuICAgIH1cblxuICAgIHNldE9mZnNldEFuZE9yaWVudCAob2Zmc2V0OiBDQU5OT04uVmVjMywgT3JpZW50OiBDQU5OT04uUXVhdGVybmlvbikge1xuICAgICAgICB0aGlzLl9vZmZzZXQgPSBvZmZzZXQ7XG4gICAgICAgIHRoaXMuX29yaWVudCA9IE9yaWVudDtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uVHJpZ2dlciAoZXZlbnQ6IENBTk5PTi5JVHJpZ2dlcmVkRXZlbnQpIHtcbiAgICAgICAgVHJpZ2dlckV2ZW50T2JqZWN0LnR5cGUgPSBldmVudC5ldmVudDtcbiAgICAgICAgY29uc3Qgc2VsZiA9IGdldFdyYXA8Q2Fubm9uU2hhcGU+KGV2ZW50LnNlbGZTaGFwZSk7XG4gICAgICAgIGNvbnN0IG90aGVyID0gZ2V0V3JhcDxDYW5ub25TaGFwZT4oZXZlbnQub3RoZXJTaGFwZSk7XG5cbiAgICAgICAgaWYgKHNlbGYpIHtcbiAgICAgICAgICAgIFRyaWdnZXJFdmVudE9iamVjdC5zZWxmQ29sbGlkZXIgPSBzZWxmLmNvbGxpZGVyO1xuICAgICAgICAgICAgVHJpZ2dlckV2ZW50T2JqZWN0Lm90aGVyQ29sbGlkZXIgPSBvdGhlciA/IG90aGVyLmNvbGxpZGVyIDogbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX2NvbGxpZGVyLmVtaXQoVHJpZ2dlckV2ZW50T2JqZWN0LnR5cGUsIFRyaWdnZXJFdmVudE9iamVjdCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=