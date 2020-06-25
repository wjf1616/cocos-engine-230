
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/cannon/cannon-rigid-body.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.CannonRigidBody = void 0;

var _cannon = _interopRequireDefault(require("../../../../../external/cannon/cannon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var v3_cannon0 = new _cannon["default"].Vec3();
var v3_cannon1 = new _cannon["default"].Vec3();
var Vec3 = cc.Vec3;
/**
 * wraped shared body
 * dynamic
 * kinematic
 */

var CannonRigidBody =
/*#__PURE__*/
function () {
  function CannonRigidBody() {
    this._rigidBody = void 0;
    this._sharedBody = void 0;
    this._isEnabled = false;
  }

  var _proto = CannonRigidBody.prototype;

  /** LIFECYCLE */
  _proto.__preload = function __preload(com) {
    this._rigidBody = com;
    this._sharedBody = cc.director.getPhysics3DManager().physicsWorld.getSharedBody(this._rigidBody.node);
    this._sharedBody.reference = true;
    this._sharedBody.wrappedBody = this;
  };

  _proto.onLoad = function onLoad() {};

  _proto.onEnable = function onEnable() {
    this._isEnabled = true;
    this.mass = this._rigidBody.mass;
    this.allowSleep = this._rigidBody.allowSleep;
    this.linearDamping = this._rigidBody.linearDamping;
    this.angularDamping = this._rigidBody.angularDamping;
    this.useGravity = this._rigidBody.useGravity;
    this.isKinematic = this._rigidBody.isKinematic;
    this.fixedRotation = this._rigidBody.fixedRotation;
    this.linearFactor = this._rigidBody.linearFactor;
    this.angularFactor = this._rigidBody.angularFactor;
    this._sharedBody.enabled = true;
  };

  _proto.onDisable = function onDisable() {
    this._isEnabled = false;
    this._sharedBody.enabled = false;
  };

  _proto.onDestroy = function onDestroy() {
    this._sharedBody.reference = false;
    this._rigidBody = null;
    this._sharedBody = null;
  }
  /** INTERFACE */
  ;

  _proto.wakeUp = function wakeUp() {
    return this._sharedBody.body.wakeUp();
  };

  _proto.sleep = function sleep() {
    return this._sharedBody.body.sleep();
  };

  _proto.getLinearVelocity = function getLinearVelocity(out) {
    Vec3.copy(out, this._sharedBody.body.velocity);
    return out;
  };

  _proto.setLinearVelocity = function setLinearVelocity(value) {
    var body = this._sharedBody.body;

    if (body.isSleeping()) {
      body.wakeUp();
    }

    Vec3.copy(body.velocity, value);
  };

  _proto.getAngularVelocity = function getAngularVelocity(out) {
    Vec3.copy(out, this._sharedBody.body.angularVelocity);
    return out;
  };

  _proto.setAngularVelocity = function setAngularVelocity(value) {
    var body = this._sharedBody.body;

    if (body.isSleeping()) {
      body.wakeUp();
    }

    Vec3.copy(body.angularVelocity, value);
  };

  _proto.applyForce = function applyForce(force, worldPoint) {
    if (worldPoint == null) {
      worldPoint = Vec3.ZERO;
    }

    var body = this._sharedBody.body;

    if (body.isSleeping()) {
      body.wakeUp();
    }

    body.applyForce(Vec3.copy(v3_cannon0, force), Vec3.copy(v3_cannon1, worldPoint));
  };

  _proto.applyImpulse = function applyImpulse(impulse, worldPoint) {
    if (worldPoint == null) {
      worldPoint = Vec3.ZERO;
    }

    var body = this._sharedBody.body;

    if (body.isSleeping()) {
      body.wakeUp();
    }

    body.applyImpulse(Vec3.copy(v3_cannon0, impulse), Vec3.copy(v3_cannon1, worldPoint));
  };

  _proto.applyLocalForce = function applyLocalForce(force, localPoint) {
    if (localPoint == null) {
      localPoint = Vec3.ZERO;
    }

    var body = this._sharedBody.body;

    if (body.isSleeping()) {
      body.wakeUp();
    }

    body.applyLocalForce(Vec3.copy(v3_cannon0, force), Vec3.copy(v3_cannon1, localPoint));
  };

  _proto.applyLocalImpulse = function applyLocalImpulse(impulse, localPoint) {
    if (localPoint == null) {
      localPoint = Vec3.ZERO;
    }

    var body = this._sharedBody.body;

    if (body.isSleeping()) {
      body.wakeUp();
    }

    body.applyLocalImpulse(Vec3.copy(v3_cannon0, impulse), Vec3.copy(v3_cannon1, localPoint));
  };

  _proto.applyTorque = function applyTorque(torque) {
    var body = this._sharedBody.body;

    if (body.isSleeping()) {
      body.wakeUp();
    }

    body.torque.x += torque.x;
    body.torque.y += torque.y;
    body.torque.z += torque.z;
  };

  _proto.applyLocalTorque = function applyLocalTorque(torque) {
    var body = this._sharedBody.body;

    if (body.isSleeping()) {
      body.wakeUp();
    }

    Vec3.copy(v3_cannon0, torque);
    body.vectorToWorldFrame(v3_cannon0, v3_cannon0);
    body.torque.x += v3_cannon0.x;
    body.torque.y += v3_cannon0.y;
    body.torque.z += v3_cannon0.z;
  };

  _createClass(CannonRigidBody, [{
    key: "isAwake",
    get: function get() {
      return this._sharedBody.body.isAwake();
    }
  }, {
    key: "isSleepy",
    get: function get() {
      return this._sharedBody.body.isSleepy();
    }
  }, {
    key: "isSleeping",
    get: function get() {
      return this._sharedBody.body.isSleeping();
    }
  }, {
    key: "allowSleep",
    set: function set(v) {
      var body = this._sharedBody.body;

      if (body.isSleeping()) {
        body.wakeUp();
      }

      body.allowSleep = v;
    }
  }, {
    key: "mass",
    set: function set(value) {
      var body = this._sharedBody.body;
      body.mass = value;

      if (body.mass == 0) {
        body.type = _cannon["default"].Body.STATIC;
      }

      body.updateMassProperties();

      if (body.isSleeping()) {
        body.wakeUp();
      }
    }
  }, {
    key: "isKinematic",
    set: function set(value) {
      var body = this._sharedBody.body;

      if (body.mass == 0) {
        body.type = _cannon["default"].Body.STATIC;
      } else {
        if (value) {
          body.type = _cannon["default"].Body.KINEMATIC;
        } else {
          body.type = _cannon["default"].Body.DYNAMIC;
        }
      }
    }
  }, {
    key: "fixedRotation",
    set: function set(value) {
      var body = this._sharedBody.body;

      if (body.isSleeping()) {
        body.wakeUp();
      }

      body.fixedRotation = value;
      body.updateMassProperties();
    }
  }, {
    key: "linearDamping",
    set: function set(value) {
      this._sharedBody.body.linearDamping = value;
    }
  }, {
    key: "angularDamping",
    set: function set(value) {
      this._sharedBody.body.angularDamping = value;
    }
  }, {
    key: "useGravity",
    set: function set(value) {
      var body = this._sharedBody.body;

      if (body.isSleeping()) {
        body.wakeUp();
      }

      body.useGravity = value;
    }
  }, {
    key: "linearFactor",
    set: function set(value) {
      var body = this._sharedBody.body;

      if (body.isSleeping()) {
        body.wakeUp();
      }

      Vec3.copy(body.linearFactor, value);
    }
  }, {
    key: "angularFactor",
    set: function set(value) {
      var body = this._sharedBody.body;

      if (body.isSleeping()) {
        body.wakeUp();
      }

      Vec3.copy(body.angularFactor, value);
    }
  }, {
    key: "rigidBody",
    get: function get() {
      return this._rigidBody;
    }
  }, {
    key: "sharedBody",
    get: function get() {
      return this._sharedBody;
    }
  }, {
    key: "isEnabled",
    get: function get() {
      return this._isEnabled;
    }
  }]);

  return CannonRigidBody;
}();

exports.CannonRigidBody = CannonRigidBody;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhbm5vbi1yaWdpZC1ib2R5LnRzIl0sIm5hbWVzIjpbInYzX2Nhbm5vbjAiLCJDQU5OT04iLCJWZWMzIiwidjNfY2Fubm9uMSIsImNjIiwiQ2Fubm9uUmlnaWRCb2R5IiwiX3JpZ2lkQm9keSIsIl9zaGFyZWRCb2R5IiwiX2lzRW5hYmxlZCIsIl9fcHJlbG9hZCIsImNvbSIsImRpcmVjdG9yIiwiZ2V0UGh5c2ljczNETWFuYWdlciIsInBoeXNpY3NXb3JsZCIsImdldFNoYXJlZEJvZHkiLCJub2RlIiwicmVmZXJlbmNlIiwid3JhcHBlZEJvZHkiLCJvbkxvYWQiLCJvbkVuYWJsZSIsIm1hc3MiLCJhbGxvd1NsZWVwIiwibGluZWFyRGFtcGluZyIsImFuZ3VsYXJEYW1waW5nIiwidXNlR3Jhdml0eSIsImlzS2luZW1hdGljIiwiZml4ZWRSb3RhdGlvbiIsImxpbmVhckZhY3RvciIsImFuZ3VsYXJGYWN0b3IiLCJlbmFibGVkIiwib25EaXNhYmxlIiwib25EZXN0cm95Iiwid2FrZVVwIiwiYm9keSIsInNsZWVwIiwiZ2V0TGluZWFyVmVsb2NpdHkiLCJvdXQiLCJjb3B5IiwidmVsb2NpdHkiLCJzZXRMaW5lYXJWZWxvY2l0eSIsInZhbHVlIiwiaXNTbGVlcGluZyIsImdldEFuZ3VsYXJWZWxvY2l0eSIsImFuZ3VsYXJWZWxvY2l0eSIsInNldEFuZ3VsYXJWZWxvY2l0eSIsImFwcGx5Rm9yY2UiLCJmb3JjZSIsIndvcmxkUG9pbnQiLCJaRVJPIiwiYXBwbHlJbXB1bHNlIiwiaW1wdWxzZSIsImFwcGx5TG9jYWxGb3JjZSIsImxvY2FsUG9pbnQiLCJhcHBseUxvY2FsSW1wdWxzZSIsImFwcGx5VG9ycXVlIiwidG9ycXVlIiwieCIsInkiLCJ6IiwiYXBwbHlMb2NhbFRvcnF1ZSIsInZlY3RvclRvV29ybGRGcmFtZSIsImlzQXdha2UiLCJpc1NsZWVweSIsInYiLCJ0eXBlIiwiQm9keSIsIlNUQVRJQyIsInVwZGF0ZU1hc3NQcm9wZXJ0aWVzIiwiS0lORU1BVElD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QXVCO0FBQ25CUixRQUFBQSxJQUFJLENBQUNELE1BQUw7QUFDSDs7QUFDRDlCLE1BQUFBLElBQUksQ0FBQ21DLElBQUwsQ0FBVUosSUFBSSxDQUFDTixZQUFmLEVBQTZCYSxLQUE3QjtBQUNIOzs7c0JBRWtCQSxPQUFnQjtBQUMvQixVQUFJUCxJQUFJLEdBQUcsS0FBSzFCLFdBQUwsQ0FBaUIwQixJQUE1Qjs7QUFDQSxVQUFJQSxJQUFJLENBQUNRLFVBQUwsRUFBSixFQUF1QjtBQUNuQlIsUUFBQUEsSUFBSSxDQUFDRCxNQUFMO0FBQ0g7O0FBQ0Q5QixNQUFBQSxJQUFJLENBQUNtQyxJQUFMLENBQVVKLElBQUksQ0FBQ0wsYUFBZixFQUE4QlksS0FBOUI7QUFDSDs7O3dCQUVnQjtBQUNiLGFBQU8sS0FBS2xDLFVBQVo7QUFDSDs7O3dCQUVpQjtBQUNkLGFBQU8sS0FBS0MsV0FBWjtBQUNIOzs7d0JBRWdCO0FBQ2IsYUFBTyxLQUFLQyxVQUFaO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IENBTk5PTiBmcm9tICcuLi8uLi8uLi8uLi8uLi9leHRlcm5hbC9jYW5ub24vY2Fubm9uJztcbmltcG9ydCB7IElSaWdpZEJvZHkgfSBmcm9tICcuLi9zcGVjL0ktcmlnaWQtYm9keSc7XG5pbXBvcnQgeyBDYW5ub25TaGFyZWRCb2R5IH0gZnJvbSAnLi9jYW5ub24tc2hhcmVkLWJvZHknO1xuaW1wb3J0IHsgQ2Fubm9uV29ybGQgfSBmcm9tICcuL2Nhbm5vbi13b3JsZCc7XG5pbXBvcnQgeyBSaWdpZEJvZHkzRCB9IGZyb20gJy4uL2ZyYW1ld29yayc7XG5cbmNvbnN0IHYzX2Nhbm5vbjAgPSBuZXcgQ0FOTk9OLlZlYzMoKTtcbmNvbnN0IHYzX2Nhbm5vbjEgPSBuZXcgQ0FOTk9OLlZlYzMoKTtcbmNvbnN0IFZlYzMgPSBjYy5WZWMzO1xuXG4vKipcbiAqIHdyYXBlZCBzaGFyZWQgYm9keVxuICogZHluYW1pY1xuICoga2luZW1hdGljXG4gKi9cbmV4cG9ydCBjbGFzcyBDYW5ub25SaWdpZEJvZHkgaW1wbGVtZW50cyBJUmlnaWRCb2R5IHtcblxuICAgIGdldCBpc0F3YWtlICgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYXJlZEJvZHkuYm9keS5pc0F3YWtlKCk7XG4gICAgfVxuXG4gICAgZ2V0IGlzU2xlZXB5ICgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYXJlZEJvZHkuYm9keS5pc1NsZWVweSgpO1xuICAgIH1cblxuICAgIGdldCBpc1NsZWVwaW5nICgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYXJlZEJvZHkuYm9keS5pc1NsZWVwaW5nKCk7XG4gICAgfVxuXG4gICAgc2V0IGFsbG93U2xlZXAgKHY6IGJvb2xlYW4pIHtcbiAgICAgICAgbGV0IGJvZHkgPSB0aGlzLl9zaGFyZWRCb2R5LmJvZHk7XG4gICAgICAgIGlmIChib2R5LmlzU2xlZXBpbmcoKSkge1xuICAgICAgICAgICAgYm9keS53YWtlVXAoKTtcbiAgICAgICAgfVxuICAgICAgICBib2R5LmFsbG93U2xlZXAgPSB2O1xuICAgIH1cblxuICAgIHNldCBtYXNzICh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIGxldCBib2R5ID0gdGhpcy5fc2hhcmVkQm9keS5ib2R5O1xuICAgICAgICBib2R5Lm1hc3MgPSB2YWx1ZTtcbiAgICAgICAgaWYgKGJvZHkubWFzcyA9PSAwKSB7XG4gICAgICAgICAgICBib2R5LnR5cGUgPSBDQU5OT04uQm9keS5TVEFUSUM7XG4gICAgICAgIH1cbiAgICAgICAgYm9keS51cGRhdGVNYXNzUHJvcGVydGllcygpO1xuICAgICAgICBpZiAoYm9keS5pc1NsZWVwaW5nKCkpIHtcbiAgICAgICAgICAgIGJvZHkud2FrZVVwKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXQgaXNLaW5lbWF0aWMgKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgIGxldCBib2R5ID0gdGhpcy5fc2hhcmVkQm9keS5ib2R5O1xuICAgICAgICBpZiAoYm9keS5tYXNzID09IDApIHtcbiAgICAgICAgICAgIGJvZHkudHlwZSA9IENBTk5PTi5Cb2R5LlNUQVRJQztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGJvZHkudHlwZSA9IENBTk5PTi5Cb2R5LktJTkVNQVRJQztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYm9keS50eXBlID0gQ0FOTk9OLkJvZHkuRFlOQU1JQztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldCBmaXhlZFJvdGF0aW9uICh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICBsZXQgYm9keSA9IHRoaXMuX3NoYXJlZEJvZHkuYm9keTtcbiAgICAgICAgaWYgKGJvZHkuaXNTbGVlcGluZygpKSB7XG4gICAgICAgICAgICBib2R5Lndha2VVcCgpO1xuICAgICAgICB9XG4gICAgICAgIGJvZHkuZml4ZWRSb3RhdGlvbiA9IHZhbHVlO1xuICAgICAgICBib2R5LnVwZGF0ZU1hc3NQcm9wZXJ0aWVzKCk7XG4gICAgfVxuXG4gICAgc2V0IGxpbmVhckRhbXBpbmcgKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5ib2R5LmxpbmVhckRhbXBpbmcgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBzZXQgYW5ndWxhckRhbXBpbmcgKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5ib2R5LmFuZ3VsYXJEYW1waW5nID0gdmFsdWU7XG4gICAgfVxuXG4gICAgc2V0IHVzZUdyYXZpdHkgKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgIGxldCBib2R5ID0gdGhpcy5fc2hhcmVkQm9keS5ib2R5O1xuICAgICAgICBpZiAoYm9keS5pc1NsZWVwaW5nKCkpIHtcbiAgICAgICAgICAgIGJvZHkud2FrZVVwKCk7XG4gICAgICAgIH1cbiAgICAgICAgYm9keS51c2VHcmF2aXR5ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgc2V0IGxpbmVhckZhY3RvciAodmFsdWU6IGNjLlZlYzMpIHtcbiAgICAgICAgbGV0IGJvZHkgPSB0aGlzLl9zaGFyZWRCb2R5LmJvZHk7XG4gICAgICAgIGlmIChib2R5LmlzU2xlZXBpbmcoKSkge1xuICAgICAgICAgICAgYm9keS53YWtlVXAoKTtcbiAgICAgICAgfVxuICAgICAgICBWZWMzLmNvcHkoYm9keS5saW5lYXJGYWN0b3IsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBzZXQgYW5ndWxhckZhY3RvciAodmFsdWU6IGNjLlZlYzMpIHtcbiAgICAgICAgbGV0IGJvZHkgPSB0aGlzLl9zaGFyZWRCb2R5LmJvZHk7XG4gICAgICAgIGlmIChib2R5LmlzU2xlZXBpbmcoKSkge1xuICAgICAgICAgICAgYm9keS53YWtlVXAoKTtcbiAgICAgICAgfVxuICAgICAgICBWZWMzLmNvcHkoYm9keS5hbmd1bGFyRmFjdG9yLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgZ2V0IHJpZ2lkQm9keSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yaWdpZEJvZHk7XG4gICAgfVxuXG4gICAgZ2V0IHNoYXJlZEJvZHkgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2hhcmVkQm9keTtcbiAgICB9XG5cbiAgICBnZXQgaXNFbmFibGVkICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzRW5hYmxlZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9yaWdpZEJvZHkhOiBSaWdpZEJvZHkzRDtcbiAgICBwcml2YXRlIF9zaGFyZWRCb2R5ITogQ2Fubm9uU2hhcmVkQm9keTtcbiAgICBwcml2YXRlIF9pc0VuYWJsZWQgPSBmYWxzZTtcblxuICAgIC8qKiBMSUZFQ1lDTEUgKi9cblxuICAgIF9fcHJlbG9hZCAoY29tOiBSaWdpZEJvZHkzRCkge1xuICAgICAgICB0aGlzLl9yaWdpZEJvZHkgPSBjb207XG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkgPSAoY2MuZGlyZWN0b3IuZ2V0UGh5c2ljczNETWFuYWdlcigpLnBoeXNpY3NXb3JsZCBhcyBDYW5ub25Xb3JsZCkuZ2V0U2hhcmVkQm9keSh0aGlzLl9yaWdpZEJvZHkubm9kZSk7XG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkucmVmZXJlbmNlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fc2hhcmVkQm9keS53cmFwcGVkQm9keSA9IHRoaXM7XG4gICAgfVxuXG4gICAgb25Mb2FkICgpIHtcbiAgICB9XG5cbiAgICBvbkVuYWJsZSAoKSB7XG4gICAgICAgIHRoaXMuX2lzRW5hYmxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMubWFzcyA9IHRoaXMuX3JpZ2lkQm9keS5tYXNzO1xuICAgICAgICB0aGlzLmFsbG93U2xlZXAgPSB0aGlzLl9yaWdpZEJvZHkuYWxsb3dTbGVlcDtcbiAgICAgICAgdGhpcy5saW5lYXJEYW1waW5nID0gdGhpcy5fcmlnaWRCb2R5LmxpbmVhckRhbXBpbmc7XG4gICAgICAgIHRoaXMuYW5ndWxhckRhbXBpbmcgPSB0aGlzLl9yaWdpZEJvZHkuYW5ndWxhckRhbXBpbmc7XG4gICAgICAgIHRoaXMudXNlR3Jhdml0eSA9IHRoaXMuX3JpZ2lkQm9keS51c2VHcmF2aXR5O1xuICAgICAgICB0aGlzLmlzS2luZW1hdGljID0gdGhpcy5fcmlnaWRCb2R5LmlzS2luZW1hdGljO1xuICAgICAgICB0aGlzLmZpeGVkUm90YXRpb24gPSB0aGlzLl9yaWdpZEJvZHkuZml4ZWRSb3RhdGlvbjtcbiAgICAgICAgdGhpcy5saW5lYXJGYWN0b3IgPSB0aGlzLl9yaWdpZEJvZHkubGluZWFyRmFjdG9yO1xuICAgICAgICB0aGlzLmFuZ3VsYXJGYWN0b3IgPSB0aGlzLl9yaWdpZEJvZHkuYW5ndWxhckZhY3RvcjtcbiAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5lbmFibGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBvbkRpc2FibGUgKCkge1xuICAgICAgICB0aGlzLl9pc0VuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5lbmFibGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgb25EZXN0cm95ICgpIHtcbiAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5yZWZlcmVuY2UgPSBmYWxzZTtcbiAgICAgICAgKHRoaXMuX3JpZ2lkQm9keSBhcyBhbnkpID0gbnVsbDtcbiAgICAgICAgKHRoaXMuX3NoYXJlZEJvZHkgYXMgYW55KSA9IG51bGw7XG4gICAgfVxuXG4gICAgLyoqIElOVEVSRkFDRSAqL1xuXG4gICAgd2FrZVVwICgpOiB2b2lkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYXJlZEJvZHkuYm9keS53YWtlVXAoKTtcbiAgICB9XG5cbiAgICBzbGVlcCAoKTogdm9pZCB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFyZWRCb2R5LmJvZHkuc2xlZXAoKTtcbiAgICB9XG5cbiAgICBnZXRMaW5lYXJWZWxvY2l0eSAob3V0OiBjYy5WZWMzKTogY2MuVmVjMyB7XG4gICAgICAgIFZlYzMuY29weShvdXQsIHRoaXMuX3NoYXJlZEJvZHkuYm9keS52ZWxvY2l0eSk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgc2V0TGluZWFyVmVsb2NpdHkgKHZhbHVlOiBjYy5WZWMzKTogdm9pZCB7XG4gICAgICAgIGxldCBib2R5ID0gdGhpcy5fc2hhcmVkQm9keS5ib2R5O1xuICAgICAgICBpZiAoYm9keS5pc1NsZWVwaW5nKCkpIHtcbiAgICAgICAgICAgIGJvZHkud2FrZVVwKCk7XG4gICAgICAgIH1cblxuICAgICAgICBWZWMzLmNvcHkoYm9keS52ZWxvY2l0eSwgdmFsdWUpO1xuICAgIH1cblxuICAgIGdldEFuZ3VsYXJWZWxvY2l0eSAob3V0OiBjYy5WZWMzKTogY2MuVmVjMyB7XG4gICAgICAgIFZlYzMuY29weShvdXQsIHRoaXMuX3NoYXJlZEJvZHkuYm9keS5hbmd1bGFyVmVsb2NpdHkpO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIHNldEFuZ3VsYXJWZWxvY2l0eSAodmFsdWU6IGNjLlZlYzMpOiB2b2lkIHtcbiAgICAgICAgbGV0IGJvZHkgPSB0aGlzLl9zaGFyZWRCb2R5LmJvZHk7XG4gICAgICAgIGlmIChib2R5LmlzU2xlZXBpbmcoKSkge1xuICAgICAgICAgICAgYm9keS53YWtlVXAoKTtcbiAgICAgICAgfVxuICAgICAgICBWZWMzLmNvcHkoYm9keS5hbmd1bGFyVmVsb2NpdHksIHZhbHVlKTtcbiAgICB9XG5cbiAgICBhcHBseUZvcmNlIChmb3JjZTogY2MuVmVjMywgd29ybGRQb2ludD86IGNjLlZlYzMpIHtcbiAgICAgICAgaWYgKHdvcmxkUG9pbnQgPT0gbnVsbCkge1xuICAgICAgICAgICAgd29ybGRQb2ludCA9IFZlYzMuWkVSTztcbiAgICAgICAgfVxuICAgICAgICBsZXQgYm9keSA9IHRoaXMuX3NoYXJlZEJvZHkuYm9keTtcbiAgICAgICAgaWYgKGJvZHkuaXNTbGVlcGluZygpKSB7XG4gICAgICAgICAgICBib2R5Lndha2VVcCgpO1xuICAgICAgICB9XG4gICAgICAgIGJvZHkuYXBwbHlGb3JjZShWZWMzLmNvcHkodjNfY2Fubm9uMCwgZm9yY2UpLCBWZWMzLmNvcHkodjNfY2Fubm9uMSwgd29ybGRQb2ludCkpO1xuICAgIH1cblxuICAgIGFwcGx5SW1wdWxzZSAoaW1wdWxzZTogY2MuVmVjMywgd29ybGRQb2ludD86IGNjLlZlYzMpIHtcbiAgICAgICAgaWYgKHdvcmxkUG9pbnQgPT0gbnVsbCkge1xuICAgICAgICAgICAgd29ybGRQb2ludCA9IFZlYzMuWkVSTztcbiAgICAgICAgfVxuICAgICAgICBsZXQgYm9keSA9IHRoaXMuX3NoYXJlZEJvZHkuYm9keTtcbiAgICAgICAgaWYgKGJvZHkuaXNTbGVlcGluZygpKSB7XG4gICAgICAgICAgICBib2R5Lndha2VVcCgpO1xuICAgICAgICB9XG4gICAgICAgIGJvZHkuYXBwbHlJbXB1bHNlKFZlYzMuY29weSh2M19jYW5ub24wLCBpbXB1bHNlKSwgVmVjMy5jb3B5KHYzX2Nhbm5vbjEsIHdvcmxkUG9pbnQpKTtcbiAgICB9XG5cbiAgICBhcHBseUxvY2FsRm9yY2UgKGZvcmNlOiBjYy5WZWMzLCBsb2NhbFBvaW50PzogY2MuVmVjMyk6IHZvaWQge1xuICAgICAgICBpZiAobG9jYWxQb2ludCA9PSBudWxsKSB7XG4gICAgICAgICAgICBsb2NhbFBvaW50ID0gVmVjMy5aRVJPO1xuICAgICAgICB9XG4gICAgICAgIGxldCBib2R5ID0gdGhpcy5fc2hhcmVkQm9keS5ib2R5O1xuICAgICAgICBpZiAoYm9keS5pc1NsZWVwaW5nKCkpIHtcbiAgICAgICAgICAgIGJvZHkud2FrZVVwKCk7XG4gICAgICAgIH1cbiAgICAgICAgYm9keS5hcHBseUxvY2FsRm9yY2UoVmVjMy5jb3B5KHYzX2Nhbm5vbjAsIGZvcmNlKSwgVmVjMy5jb3B5KHYzX2Nhbm5vbjEsIGxvY2FsUG9pbnQpKTtcbiAgICB9XG5cbiAgICBhcHBseUxvY2FsSW1wdWxzZSAoaW1wdWxzZTogY2MuVmVjMywgbG9jYWxQb2ludD86IGNjLlZlYzMpOiB2b2lkIHtcbiAgICAgICAgaWYgKGxvY2FsUG9pbnQgPT0gbnVsbCkge1xuICAgICAgICAgICAgbG9jYWxQb2ludCA9IFZlYzMuWkVSTztcbiAgICAgICAgfVxuICAgICAgICBsZXQgYm9keSA9IHRoaXMuX3NoYXJlZEJvZHkuYm9keTtcbiAgICAgICAgaWYgKGJvZHkuaXNTbGVlcGluZygpKSB7XG4gICAgICAgICAgICBib2R5Lndha2VVcCgpO1xuICAgICAgICB9XG4gICAgICAgIGJvZHkuYXBwbHlMb2NhbEltcHVsc2UoVmVjMy5jb3B5KHYzX2Nhbm5vbjAsIGltcHVsc2UpLCBWZWMzLmNvcHkodjNfY2Fubm9uMSwgbG9jYWxQb2ludCkpO1xuICAgIH1cblxuICAgIGFwcGx5VG9ycXVlICh0b3JxdWU6IGNjLlZlYzMpOiB2b2lkIHtcbiAgICAgICAgbGV0IGJvZHkgPSB0aGlzLl9zaGFyZWRCb2R5LmJvZHk7XG4gICAgICAgIGlmIChib2R5LmlzU2xlZXBpbmcoKSkge1xuICAgICAgICAgICAgYm9keS53YWtlVXAoKTtcbiAgICAgICAgfVxuICAgICAgICBib2R5LnRvcnF1ZS54ICs9IHRvcnF1ZS54O1xuICAgICAgICBib2R5LnRvcnF1ZS55ICs9IHRvcnF1ZS55O1xuICAgICAgICBib2R5LnRvcnF1ZS56ICs9IHRvcnF1ZS56O1xuICAgIH1cblxuICAgIGFwcGx5TG9jYWxUb3JxdWUgKHRvcnF1ZTogY2MuVmVjMyk6IHZvaWQge1xuICAgICAgICBsZXQgYm9keSA9IHRoaXMuX3NoYXJlZEJvZHkuYm9keTtcbiAgICAgICAgaWYgKGJvZHkuaXNTbGVlcGluZygpKSB7XG4gICAgICAgICAgICBib2R5Lndha2VVcCgpO1xuICAgICAgICB9XG4gICAgICAgIFZlYzMuY29weSh2M19jYW5ub24wLCB0b3JxdWUpO1xuICAgICAgICBib2R5LnZlY3RvclRvV29ybGRGcmFtZSh2M19jYW5ub24wLCB2M19jYW5ub24wKTtcbiAgICAgICAgYm9keS50b3JxdWUueCArPSB2M19jYW5ub24wLng7XG4gICAgICAgIGJvZHkudG9ycXVlLnkgKz0gdjNfY2Fubm9uMC55O1xuICAgICAgICBib2R5LnRvcnF1ZS56ICs9IHYzX2Nhbm5vbjAuejtcbiAgICB9XG59Il19