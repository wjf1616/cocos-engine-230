
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/framework/components/rigid-body-component.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.RigidBody3D = void 0;

var _instance = require("../instance");

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _temp;

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

var _cc$_decorator = cc._decorator,
    ccclass = _cc$_decorator.ccclass,
    disallowMultiple = _cc$_decorator.disallowMultiple,
    executeInEditMode = _cc$_decorator.executeInEditMode,
    executionOrder = _cc$_decorator.executionOrder,
    menu = _cc$_decorator.menu,
    property = _cc$_decorator.property;
var Vec3 = cc.Vec3;
/**
 * !#en
 * Rigid body.
 * !#zh
 * 刚体组件。
 * @class RigidBody3D
 * @extends Component
 */

var RigidBody3D = (_dec = ccclass('cc.RigidBody3D'), _dec2 = executionOrder(99), _dec3 = menu('i18n:MAIN_MENU.component.physics/Rigid Body 3D'), _dec4 = property({
  displayOrder: 0
}), _dec5 = property({
  displayOrder: 1
}), _dec6 = property({
  displayOrder: 2
}), _dec7 = property({
  displayOrder: 3
}), _dec8 = property({
  displayOrder: 4
}), _dec9 = property({
  displayOrder: 5
}), _dec10 = property({
  displayOrder: 6
}), _dec11 = property({
  displayOrder: 7
}), _dec(_class = _dec2(_class = _dec3(_class = executeInEditMode(_class = disallowMultiple(_class = (_class2 = (_temp =
/*#__PURE__*/
function (_cc$Component) {
  _inheritsLoose(RigidBody3D, _cc$Component);

  _createClass(RigidBody3D, [{
    key: "allowSleep",
    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * !#en
     * Gets or sets whether sleep is allowed
     * !#zh
     * 获取或设置是否允许休眠
     * @property {boolean} allowSleep
     */
    get: function get() {
      return this._allowSleep;
    },
    set: function set(v) {
      this._allowSleep = v;

      if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
        this._body.allowSleep = v;
      }
    }
    /**
     * !#en
     * Gets or sets the mass of the rigid body.
     * !#zh
     * 获取或设置刚体的质量。
     * @property {number} mass
     */

  }, {
    key: "mass",
    get: function get() {
      return this._mass;
    },
    set: function set(value) {
      this._mass = value;

      if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
        this._body.mass = value;
      }
    }
    /**
     * !#en
     * Gets or sets linear damping.
     * !#zh
     * 获取或设置线性阻尼。
     * @property {number} linearDamping
     */

  }, {
    key: "linearDamping",
    get: function get() {
      return this._linearDamping;
    },
    set: function set(value) {
      this._linearDamping = value;

      if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
        this._body.linearDamping = value;
      }
    }
    /**
     * !#en
     * Gets or sets rotational damping.
     * !#zh
     * 获取或设置旋转阻尼。
     * @property {number} angularDamping
     */

  }, {
    key: "angularDamping",
    get: function get() {
      return this._angularDamping;
    },
    set: function set(value) {
      this._angularDamping = value;

      if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
        this._body.angularDamping = value;
      }
    }
    /**
     * !#en
     * Gets or sets whether the rigid body is controlled by a physical system.
     * !#zh
     * 获取或设置刚体是否由物理系统控制运动。
     * @property {boolean} isKinematic
     */

  }, {
    key: "isKinematic",
    get: function get() {
      return this._isKinematic;
    },
    set: function set(value) {
      this._isKinematic = value;

      if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
        this._body.isKinematic = value;
      }
    }
    /**
     * !#en
     * Gets or sets whether the rigid body uses gravity.
     * !#zh
     * 获取或设置刚体是否使用重力。
     * @property {boolean} useGravity
     */

  }, {
    key: "useGravity",
    get: function get() {
      return this._useGravity;
    },
    set: function set(value) {
      this._useGravity = value;

      if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
        this._body.useGravity = value;
      }
    }
    /**
     * !#en
     * Gets or sets whether the rigid body is fixed for rotation.
     * !#zh
     * 获取或设置刚体是否固定旋转。
     * @property {boolean} fixedRotation
     */

  }, {
    key: "fixedRotation",
    get: function get() {
      return this._fixedRotation;
    },
    set: function set(value) {
      this._fixedRotation = value;

      if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
        this._body.fixedRotation = value;
      }
    }
    /**
     * !#en
     * Gets or sets a factor of linear velocity that can be used to control the scaling of velocity in each axis direction.
     * !#zh
     * 获取或设置线性速度的因子，可以用来控制每个轴方向上的速度的缩放。
     * @property {Vec3} linearFactor
     */

  }, {
    key: "linearFactor",
    get: function get() {
      return this._linearFactor;
    },
    set: function set(value) {
      Vec3.copy(this._linearFactor, value);

      if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
        this._body.linearFactor = this._linearFactor;
      }
    }
    /**
     * !#en
     * Gets or sets the rotation speed factor that can be used to control the rotation speed scaling in each axis direction.
     * !#zh
     * 获取或设置旋转速度的因子，可以用来控制每个轴方向上的旋转速度的缩放。
     * @property {Vec3} angularFactor
     */

  }, {
    key: "angularFactor",
    get: function get() {
      return this._angularFactor;
    },
    set: function set(value) {
      Vec3.copy(this._angularFactor, value);

      if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
        this._body.angularFactor = this._angularFactor;
      }
    }
    /**
     * !#en
     * Gets whether the state is awakened.
     * !#zh
     * 获取是否是唤醒的状态。
     * @property {boolean} isAwake
     * @readonly
     */

  }, {
    key: "isAwake",
    get: function get() {
      if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
        return this._body.isAwake;
      }

      return false;
    }
    /**
     * !#en
     * Gets whether or not a dormant state can be entered.
     * !#zh
     * 获取是否是可进入休眠的状态。
     * @property {boolean} isSleepy
     * @readonly
     */

  }, {
    key: "isSleepy",
    get: function get() {
      if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
        return this._body.isSleepy;
      }

      return false;
    }
    /**
     * !#en
     * Gets whether the state is dormant.
     * !#zh
     * 获取是否是正在休眠的状态。
     * @property {boolean} isSleeping
     * @readonly
     */

  }, {
    key: "isSleeping",
    get: function get() {
      if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
        return this._body.isSleeping;
      }

      return false;
    }
    /**
     * !#en
     * Gets physics engine rigid body object.
     * !#zh
     * 获得物理引擎内部刚体对象
     * @property {IRigidBody} rigidBody
     * @readonly
     */

  }, {
    key: "rigidBody",
    get: function get() {
      return this._body;
    }
  }, {
    key: "_assertOnload",
    get: function get() {
      var r = this._isOnLoadCalled == 0;

      if (r) {
        cc.error('Physics Error: Please make sure that the node has been added to the scene');
      }

      return !r;
    }
  }]);

  function RigidBody3D() {
    var _this;

    _this = _cc$Component.call(this) || this;
    _this._body = void 0;
    _this._allowSleep = true;

    _initializerDefineProperty(_this, "_mass", _descriptor, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_linearDamping", _descriptor2, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_angularDamping", _descriptor3, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_fixedRotation", _descriptor4, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_isKinematic", _descriptor5, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_useGravity", _descriptor6, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_linearFactor", _descriptor7, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_angularFactor", _descriptor8, _assertThisInitialized(_this));

    if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      _this._body = (0, _instance.createRigidBody)();
    }

    return _this;
  } /// COMPONENT LIFECYCLE ///


  var _proto = RigidBody3D.prototype;

  _proto.__preload = function __preload() {
    if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.__preload(this);
    }
  };

  _proto.onEnable = function onEnable() {
    if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.onEnable();
    }
  };

  _proto.onDisable = function onDisable() {
    if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.onDisable();
    }
  };

  _proto.onDestroy = function onDestroy() {
    if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.onDestroy();
    }
  } /// PUBLIC METHOD ///

  /**
   * !#en
   * A force is applied to a rigid body at a point in world space.
   * !#zh
   * 在世界空间中的某点上对刚体施加一个作用力。
   * @method applyForce
   * @param {Vec3} force
   * @param {Vec3} relativePoint The point of action, relative to the center of the rigid body
   */
  ;

  _proto.applyForce = function applyForce(force, relativePoint) {
    if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.applyForce(force, relativePoint);
    }
  }
  /**
   * !#en
   * Apply a force on the rigid body at a point in local space.
   * !#zh
   * 在本地空间中的某点上对刚体施加一个作用力。
   * @method applyLocalForce
   * @param {Vec3} force 
   * @param {Vec3} localPoint Point of application
   */
  ;

  _proto.applyLocalForce = function applyLocalForce(force, localPoint) {
    if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.applyLocalForce(force, localPoint);
    }
  }
  /**
   * !#en
   * Apply an impulse to a rigid body at a point in world space.
   * !#zh
   * 在世界空间的某点上对刚体施加一个冲量。
   * @method applyImpulse
   * @param {Vec3} impulse
   * @param {Vec3} relativePoint The point of action, relative to the center of the rigid body
   */
  ;

  _proto.applyImpulse = function applyImpulse(impulse, relativePoint) {
    if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.applyImpulse(impulse, relativePoint);
    }
  }
  /**
   * !#en
   * Apply an impulse to the rigid body at a point in local space.
   * !#zh
   * 在本地空间的某点上对刚体施加一个冲量。
   * @method applyLocalImpulse
   * @param {Vec3} impulse
   * @param {Vec3} localPoint Point of application
   */
  ;

  _proto.applyLocalImpulse = function applyLocalImpulse(impulse, localPoint) {
    if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.applyLocalImpulse(impulse, localPoint);
    }
  }
  /**
   * !#en
   * Apply a torque to the rigid body.
   * !#zh
   * 对刚体施加扭转力。
   * @method applyTorque
   * @param {Vec3} torque
   */
  ;

  _proto.applyTorque = function applyTorque(torque) {
    if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.applyTorque(torque);
    }
  }
  /**
   * !#en
   * Apply a local torque to the rigid body.
   * !#zh
   * 对刚体施加本地扭转力。
   * @method applyLocalTorque
   * @param {Vec3} torque
   */
  ;

  _proto.applyLocalTorque = function applyLocalTorque(torque) {
    if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.applyLocalTorque(torque);
    }
  }
  /**
   * !#en
   * Awaken the rigid body.
   * !#zh
   * 唤醒刚体。
   * @method wakeUp
   */
  ;

  _proto.wakeUp = function wakeUp() {
    if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.wakeUp();
    }
  }
  /**
   * !#en
   * Dormant rigid body.
   * !#zh
   * 休眠刚体。
   * @method sleep
   */
  ;

  _proto.sleep = function sleep() {
    if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.sleep();
    }
  }
  /**
   * !#en
   * Get linear velocity.
   * !#zh
   * 获取线性速度。
   * @method getLinearVelocity
   * @param {Vec3} out
   */
  ;

  _proto.getLinearVelocity = function getLinearVelocity(out) {
    if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.getLinearVelocity(out);
    }
  }
  /**
   * !#en
   * Set linear speed.
   * !#zh
   * 设置线性速度。
   * @method setLinearVelocity
   * @param {Vec3} value 
   */
  ;

  _proto.setLinearVelocity = function setLinearVelocity(value) {
    if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.setLinearVelocity(value);
    }
  }
  /**
   * !#en
   * Gets the rotation speed.
   * !#zh
   * 获取旋转速度。
   * @method getAngularVelocity
   * @param {Vec3} out 
   */
  ;

  _proto.getAngularVelocity = function getAngularVelocity(out) {
    if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.getAngularVelocity(out);
    }
  }
  /**
   * !#en
   * Set rotation speed.
   * !#zh
   * 设置旋转速度。
   * @method setAngularVelocity
   * @param {Vec3} value 
   */
  ;

  _proto.setAngularVelocity = function setAngularVelocity(value) {
    if (this._assertOnload && !CC_EDITOR && !CC_PHYSICS_BUILTIN) {
      this._body.setAngularVelocity(value);
    }
  };

  return RigidBody3D;
}(cc.Component), _temp), (_applyDecoratedDescriptor(_class2.prototype, "mass", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "mass"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "linearDamping", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "linearDamping"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "angularDamping", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "angularDamping"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isKinematic", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "isKinematic"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "useGravity", [_dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "useGravity"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "fixedRotation", [_dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "fixedRotation"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "linearFactor", [_dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "linearFactor"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "angularFactor", [_dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "angularFactor"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_mass", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 10;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_linearDamping", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0.1;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_angularDamping", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0.1;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_fixedRotation", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_isKinematic", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_useGravity", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "_linearFactor", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Vec3(1, 1, 1);
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "_angularFactor", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Vec3(1, 1, 1);
  }
})), _class2)) || _class) || _class) || _class) || _class) || _class);
exports.RigidBody3D = RigidBody3D;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJpZ2lkLWJvZHktY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbImNjIiwiX2RlY29yYXRvciIsImNjY2xhc3MiLCJkaXNhbGxvd011bHRpcGxlIiwiZXhlY3V0ZUluRWRpdE1vZGUiLCJleGVjdXRpb25PcmRlciIsIm1lbnUiLCJwcm9wZXJ0eSIsIlZlYzMiLCJSaWdpZEJvZHkzRCIsImRpc3BsYXlPcmRlciIsIl9hbGxvd1NsZWVwIiwidiIsIkNDX0VESVRPUiIsIkNDX1BIWVNJQ1NfQlVJTFRJTiIsIl9ib2R5IiwiYWxsb3dTbGVlcCIsIl9tYXNzIiwidmFsdWUiLCJtYXNzIiwiX2xpbmVhckRhbXBpbmciLCJsaW5lYXJEYW1waW5nIiwiX2FuZ3VsYXJEYW1waW5nIiwiYW5ndWxhckRhbXBpbmciLCJfaXNLaW5lbWF0aWMiLCJpc0tpbmVtYXRpYyIsIl91c2VHcmF2aXR5IiwidXNlR3Jhdml0eSIsIl9maXhlZFJvdGF0aW9uIiwiZml4ZWRSb3RhdGlvbiIsIl9saW5lYXJGYWN0b3IiLCJjb3B5IiwibGluZWFyRmFjdG9yIiwiX2FuZ3VsYXJGYWN0b3IiLCJhbmd1bGFyRmFjdG9yIiwiX2Fzc2VydE9ubG9hZCIsImlzQXdha2UiLCJpc1NsZWVweSIsImlzU2xlZXBpbmciLCJyIiwiX2lzT25Mb2FkQ2FsbGVkIiwiZXJyb3IiLCJfX3ByZWxvYWQiLCJvbkVuYWJsZSIsIm9uRGlzYWJsZSIsIm9uRGVzdHJveSIsImFwcGx5Rm9yY2UiLCJmb3JjZSIsInJlbGF0aXZlUG9pbnQiLCJhcHBseUxvY2FsRm9yY2UiLCJsb2NhbFBvaW50IiwiYXBwbHlJbXB1bHNlIiwiaW1wdWxzZSIsImFwcGx5TG9jYWxJbXB1bHNlIiwiYXBwbHlUb3JxdWUiLCJ0b3JxdWUiLCJhcHBseUxvY2FsVG9ycXVlIiwid2FrZVVwIiwic2xlZXAiLCJnZXRMaW5lYXJWZWxvY2l0eSIsIm91dCIsInNldExpbmVhclZlbG9jaXR5IiwiZ2V0QW5ndWxhclZlbG9jaXR5Iiwic2V0QW5ndWxhclZl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QUFvQyxDQUFDQyxrQkFBekMsRUFBNkQ7QUFDekQsV0FBS0MsS0FBTCxDQUFXOEMsaUJBQVgsQ0FBNkIzQyxLQUE3QjtBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozs7OztTQVFPNEMscUJBQVAsNEJBQTJCRixHQUEzQixFQUF5QztBQUNyQyxRQUFJLEtBQUt6QixhQUFMLElBQXNCLENBQUN0QixTQUF2QixJQUFvQyxDQUFDQyxrQkFBekMsRUFBNkQ7QUFDekQsV0FBS0MsS0FBTCxDQUFXK0Msa0JBQVgsQ0FBOEJGLEdBQTlCO0FBQ0g7QUFDSjtBQUVEOzs7Ozs7Ozs7O1NBUU9HLHFCQUFQLDRCQUEyQjdDLEtBQTNCLEVBQWlEO0FBQzdDLFFBQUksS0FBS2lCLGFBQUwsSUFBc0IsQ0FBQ3RCLFNBQXZCLElBQW9DLENBQUNDLGtCQUF6QyxFQUE2RDtBQUN6RCxXQUFLQyxLQUFMLENBQVdnRCxrQkFBWCxDQUE4QjdDLEtBQTlCO0FBQ0g7QUFDSjs7O0VBdmU0QmxCLEVBQUUsQ0FBQ2dFLGcwQ0E4UC9CekQ7Ozs7O1dBQ3VCOzttRkFFdkJBOzs7OztXQUNnQzs7b0ZBRWhDQTs7Ozs7V0FDaUM7O21GQUVqQ0E7Ozs7O1dBQ2lDOztpRkFFakNBOzs7OztXQUMrQjs7Z0ZBRS9CQTs7Ozs7V0FDOEI7O2tGQUU5QkE7Ozs7O1dBQ2dDLElBQUlDLElBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWY7O21GQUVoQ0Q7Ozs7O1dBQ2lDLElBQUlDLElBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IHsgSVJpZ2lkQm9keSB9IGZyb20gJy4uLy4uL3NwZWMvSS1yaWdpZC1ib2R5JztcbmltcG9ydCB7IGNyZWF0ZVJpZ2lkQm9keSB9IGZyb20gJy4uL2luc3RhbmNlJztcblxuY29uc3Qge1xuICAgIGNjY2xhc3MsXG4gICAgZGlzYWxsb3dNdWx0aXBsZSxcbiAgICBleGVjdXRlSW5FZGl0TW9kZSxcbiAgICBleGVjdXRpb25PcmRlcixcbiAgICBtZW51LFxuICAgIHByb3BlcnR5LFxufSA9IGNjLl9kZWNvcmF0b3I7XG5jb25zdCBWZWMzID0gY2MuVmVjMztcblxuLyoqXG4gKiAhI2VuXG4gKiBSaWdpZCBib2R5LlxuICogISN6aFxuICog5Yia5L2T57uE5Lu244CCXG4gKiBAY2xhc3MgUmlnaWRCb2R5M0RcbiAqIEBleHRlbmRzIENvbXBvbmVudFxuICovXG5AY2NjbGFzcygnY2MuUmlnaWRCb2R5M0QnKVxuQGV4ZWN1dGlvbk9yZGVyKDk5KVxuQG1lbnUoJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC5waHlzaWNzL1JpZ2lkIEJvZHkgM0QnKVxuQGV4ZWN1dGVJbkVkaXRNb2RlXG5AZGlzYWxsb3dNdWx0aXBsZVxuZXhwb3J0IGNsYXNzIFJpZ2lkQm9keTNEIGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcblxuICAgIC8vLyBQVUJMSUMgUFJPUEVSVFkgR0VUVEVSXFxTRVRURVIgLy8vXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogR2V0cyBvciBzZXRzIHdoZXRoZXIgc2xlZXAgaXMgYWxsb3dlZFxuICAgICAqICEjemhcbiAgICAgKiDojrflj5bmiJborr7nva7mmK/lkKblhYHorrjkvJHnnKBcbiAgICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IGFsbG93U2xlZXBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGFsbG93U2xlZXAgKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWxsb3dTbGVlcDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IGFsbG93U2xlZXAgKHY6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fYWxsb3dTbGVlcCA9IHY7XG4gICAgICAgIGlmICghQ0NfRURJVE9SICYmICFDQ19QSFlTSUNTX0JVSUxUSU4pIHtcbiAgICAgICAgICAgIHRoaXMuX2JvZHkuYWxsb3dTbGVlcCA9IHY7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogR2V0cyBvciBzZXRzIHRoZSBtYXNzIG9mIHRoZSByaWdpZCBib2R5LlxuICAgICAqICEjemhcbiAgICAgKiDojrflj5bmiJborr7nva7liJrkvZPnmoTotKjph4/jgIJcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gbWFzc1xuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIGRpc3BsYXlPcmRlcjogMFxuICAgIH0pXG4gICAgcHVibGljIGdldCBtYXNzICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hc3M7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBtYXNzICh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9tYXNzID0gdmFsdWU7XG4gICAgICAgIGlmICghQ0NfRURJVE9SICYmICFDQ19QSFlTSUNTX0JVSUxUSU4pIHtcbiAgICAgICAgICAgIHRoaXMuX2JvZHkubWFzcyA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldHMgb3Igc2V0cyBsaW5lYXIgZGFtcGluZy5cbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W5oiW6K6+572u57q/5oCn6Zi75bC844CCXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGxpbmVhckRhbXBpbmdcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICBkaXNwbGF5T3JkZXI6IDFcbiAgICB9KVxuICAgIHB1YmxpYyBnZXQgbGluZWFyRGFtcGluZyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9saW5lYXJEYW1waW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgbGluZWFyRGFtcGluZyAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fbGluZWFyRGFtcGluZyA9IHZhbHVlO1xuICAgICAgICBpZiAoIUNDX0VESVRPUiAmJiAhQ0NfUEhZU0lDU19CVUlMVElOKSB7XG4gICAgICAgICAgICB0aGlzLl9ib2R5LmxpbmVhckRhbXBpbmcgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXRzIG9yIHNldHMgcm90YXRpb25hbCBkYW1waW5nLlxuICAgICAqICEjemhcbiAgICAgKiDojrflj5bmiJborr7nva7ml4vovazpmLvlsLzjgIJcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gYW5ndWxhckRhbXBpbmdcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICBkaXNwbGF5T3JkZXI6IDJcbiAgICB9KVxuICAgIHB1YmxpYyBnZXQgYW5ndWxhckRhbXBpbmcgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYW5ndWxhckRhbXBpbmc7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBhbmd1bGFyRGFtcGluZyAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fYW5ndWxhckRhbXBpbmcgPSB2YWx1ZTtcbiAgICAgICAgaWYgKCFDQ19FRElUT1IgJiYgIUNDX1BIWVNJQ1NfQlVJTFRJTikge1xuICAgICAgICAgICAgdGhpcy5fYm9keS5hbmd1bGFyRGFtcGluZyA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldHMgb3Igc2V0cyB3aGV0aGVyIHRoZSByaWdpZCBib2R5IGlzIGNvbnRyb2xsZWQgYnkgYSBwaHlzaWNhbCBzeXN0ZW0uXG4gICAgICogISN6aFxuICAgICAqIOiOt+WPluaIluiuvue9ruWImuS9k+aYr+WQpueUseeJqeeQhuezu+e7n+aOp+WItui/kOWKqOOAglxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaXNLaW5lbWF0aWNcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICBkaXNwbGF5T3JkZXI6IDNcbiAgICB9KVxuICAgIHB1YmxpYyBnZXQgaXNLaW5lbWF0aWMgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNLaW5lbWF0aWM7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBpc0tpbmVtYXRpYyAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5faXNLaW5lbWF0aWMgPSB2YWx1ZTtcbiAgICAgICAgaWYgKCFDQ19FRElUT1IgJiYgIUNDX1BIWVNJQ1NfQlVJTFRJTikge1xuICAgICAgICAgICAgdGhpcy5fYm9keS5pc0tpbmVtYXRpYyA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldHMgb3Igc2V0cyB3aGV0aGVyIHRoZSByaWdpZCBib2R5IHVzZXMgZ3Jhdml0eS5cbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W5oiW6K6+572u5Yia5L2T5piv5ZCm5L2/55So6YeN5Yqb44CCXG4gICAgICogQHByb3BlcnR5IHtib29sZWFufSB1c2VHcmF2aXR5XG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgZGlzcGxheU9yZGVyOiA0XG4gICAgfSlcbiAgICBwdWJsaWMgZ2V0IHVzZUdyYXZpdHkgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdXNlR3Jhdml0eTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IHVzZUdyYXZpdHkgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3VzZUdyYXZpdHkgPSB2YWx1ZTtcbiAgICAgICAgaWYgKCFDQ19FRElUT1IgJiYgIUNDX1BIWVNJQ1NfQlVJTFRJTikge1xuICAgICAgICAgICAgdGhpcy5fYm9keS51c2VHcmF2aXR5ID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogR2V0cyBvciBzZXRzIHdoZXRoZXIgdGhlIHJpZ2lkIGJvZHkgaXMgZml4ZWQgZm9yIHJvdGF0aW9uLlxuICAgICAqICEjemhcbiAgICAgKiDojrflj5bmiJborr7nva7liJrkvZPmmK/lkKblm7rlrprml4vovazjgIJcbiAgICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IGZpeGVkUm90YXRpb25cbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICBkaXNwbGF5T3JkZXI6IDVcbiAgICB9KVxuICAgIHB1YmxpYyBnZXQgZml4ZWRSb3RhdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9maXhlZFJvdGF0aW9uO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgZml4ZWRSb3RhdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fZml4ZWRSb3RhdGlvbiA9IHZhbHVlO1xuICAgICAgICBpZiAoIUNDX0VESVRPUiAmJiAhQ0NfUEhZU0lDU19CVUlMVElOKSB7XG4gICAgICAgICAgICB0aGlzLl9ib2R5LmZpeGVkUm90YXRpb24gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXRzIG9yIHNldHMgYSBmYWN0b3Igb2YgbGluZWFyIHZlbG9jaXR5IHRoYXQgY2FuIGJlIHVzZWQgdG8gY29udHJvbCB0aGUgc2NhbGluZyBvZiB2ZWxvY2l0eSBpbiBlYWNoIGF4aXMgZGlyZWN0aW9uLlxuICAgICAqICEjemhcbiAgICAgKiDojrflj5bmiJborr7nva7nur/mgKfpgJ/luqbnmoTlm6DlrZDvvIzlj6/ku6XnlKjmnaXmjqfliLbmr4/kuKrovbTmlrnlkJHkuIrnmoTpgJ/luqbnmoTnvKnmlL7jgIJcbiAgICAgKiBAcHJvcGVydHkge1ZlYzN9IGxpbmVhckZhY3RvclxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIGRpc3BsYXlPcmRlcjogNlxuICAgIH0pXG4gICAgcHVibGljIGdldCBsaW5lYXJGYWN0b3IgKCk6IGNjLlZlYzMge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGluZWFyRmFjdG9yO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgbGluZWFyRmFjdG9yICh2YWx1ZTogY2MuVmVjMykge1xuICAgICAgICBWZWMzLmNvcHkodGhpcy5fbGluZWFyRmFjdG9yLCB2YWx1ZSk7XG4gICAgICAgIGlmICghQ0NfRURJVE9SICYmICFDQ19QSFlTSUNTX0JVSUxUSU4pIHtcbiAgICAgICAgICAgIHRoaXMuX2JvZHkubGluZWFyRmFjdG9yID0gdGhpcy5fbGluZWFyRmFjdG9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldHMgb3Igc2V0cyB0aGUgcm90YXRpb24gc3BlZWQgZmFjdG9yIHRoYXQgY2FuIGJlIHVzZWQgdG8gY29udHJvbCB0aGUgcm90YXRpb24gc3BlZWQgc2NhbGluZyBpbiBlYWNoIGF4aXMgZGlyZWN0aW9uLlxuICAgICAqICEjemhcbiAgICAgKiDojrflj5bmiJborr7nva7ml4vovazpgJ/luqbnmoTlm6DlrZDvvIzlj6/ku6XnlKjmnaXmjqfliLbmr4/kuKrovbTmlrnlkJHkuIrnmoTml4vovazpgJ/luqbnmoTnvKnmlL7jgIJcbiAgICAgKiBAcHJvcGVydHkge1ZlYzN9IGFuZ3VsYXJGYWN0b3JcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICBkaXNwbGF5T3JkZXI6IDdcbiAgICB9KVxuICAgIHB1YmxpYyBnZXQgYW5ndWxhckZhY3RvciAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hbmd1bGFyRmFjdG9yO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgYW5ndWxhckZhY3RvciAodmFsdWU6IGNjLlZlYzMpIHtcbiAgICAgICAgVmVjMy5jb3B5KHRoaXMuX2FuZ3VsYXJGYWN0b3IsIHZhbHVlKTtcbiAgICAgICAgaWYgKCFDQ19FRElUT1IgJiYgIUNDX1BIWVNJQ1NfQlVJTFRJTikge1xuICAgICAgICAgICAgdGhpcy5fYm9keS5hbmd1bGFyRmFjdG9yID0gdGhpcy5fYW5ndWxhckZhY3RvcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXRzIHdoZXRoZXIgdGhlIHN0YXRlIGlzIGF3YWtlbmVkLlxuICAgICAqICEjemhcbiAgICAgKiDojrflj5bmmK/lkKbmmK/llKTphpLnmoTnirbmgIHjgIJcbiAgICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IGlzQXdha2VcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGlzQXdha2UgKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5fYXNzZXJ0T25sb2FkICYmICFDQ19FRElUT1IgJiYgIUNDX1BIWVNJQ1NfQlVJTFRJTikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvZHkuaXNBd2FrZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldHMgd2hldGhlciBvciBub3QgYSBkb3JtYW50IHN0YXRlIGNhbiBiZSBlbnRlcmVkLlxuICAgICAqICEjemhcbiAgICAgKiDojrflj5bmmK/lkKbmmK/lj6/ov5vlhaXkvJHnnKDnmoTnirbmgIHjgIJcbiAgICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IGlzU2xlZXB5XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgcHVibGljIGdldCBpc1NsZWVweSAoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLl9hc3NlcnRPbmxvYWQgJiYgIUNDX0VESVRPUiAmJiAhQ0NfUEhZU0lDU19CVUlMVElOKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm9keS5pc1NsZWVweTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldHMgd2hldGhlciB0aGUgc3RhdGUgaXMgZG9ybWFudC5cbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W5piv5ZCm5piv5q2j5Zyo5LyR55yg55qE54q25oCB44CCXG4gICAgICogQHByb3BlcnR5IHtib29sZWFufSBpc1NsZWVwaW5nXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgcHVibGljIGdldCBpc1NsZWVwaW5nICgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuX2Fzc2VydE9ubG9hZCAmJiAhQ0NfRURJVE9SICYmICFDQ19QSFlTSUNTX0JVSUxUSU4pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib2R5LmlzU2xlZXBpbmc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXRzIHBoeXNpY3MgZW5naW5lIHJpZ2lkIGJvZHkgb2JqZWN0LlxuICAgICAqICEjemhcbiAgICAgKiDojrflvpfniannkIblvJXmk47lhoXpg6jliJrkvZPlr7nosaFcbiAgICAgKiBAcHJvcGVydHkge0lSaWdpZEJvZHl9IHJpZ2lkQm9keVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgcmlnaWRCb2R5ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JvZHk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfYm9keSE6IElSaWdpZEJvZHk7XG5cbiAgICAvLy8gUFJJVkFURSBQUk9QRVJUWSAvLy9cblxuICAgIC8vIEBwcm9wZXJ0eVxuICAgIHByaXZhdGUgX2FsbG93U2xlZXA6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQHByb3BlcnR5XG4gICAgcHJpdmF0ZSBfbWFzczogbnVtYmVyID0gMTA7XG5cbiAgICBAcHJvcGVydHlcbiAgICBwcml2YXRlIF9saW5lYXJEYW1waW5nOiBudW1iZXIgPSAwLjE7XG5cbiAgICBAcHJvcGVydHlcbiAgICBwcml2YXRlIF9hbmd1bGFyRGFtcGluZzogbnVtYmVyID0gMC4xO1xuXG4gICAgQHByb3BlcnR5XG4gICAgcHJpdmF0ZSBfZml4ZWRSb3RhdGlvbjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQHByb3BlcnR5XG4gICAgcHJpdmF0ZSBfaXNLaW5lbWF0aWM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBwcm9wZXJ0eVxuICAgIHByaXZhdGUgX3VzZUdyYXZpdHk6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQHByb3BlcnR5XG4gICAgcHJpdmF0ZSBfbGluZWFyRmFjdG9yOiBjYy5WZWMzID0gbmV3IFZlYzMoMSwgMSwgMSk7XG5cbiAgICBAcHJvcGVydHlcbiAgICBwcml2YXRlIF9hbmd1bGFyRmFjdG9yOiBjYy5WZWMzID0gbmV3IFZlYzMoMSwgMSwgMSk7XG5cbiAgICBwcm90ZWN0ZWQgZ2V0IF9hc3NlcnRPbmxvYWQgKCk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCByID0gdGhpcy5faXNPbkxvYWRDYWxsZWQgPT0gMDtcbiAgICAgICAgaWYgKHIpIHsgY2MuZXJyb3IoJ1BoeXNpY3MgRXJyb3I6IFBsZWFzZSBtYWtlIHN1cmUgdGhhdCB0aGUgbm9kZSBoYXMgYmVlbiBhZGRlZCB0byB0aGUgc2NlbmUnKTsgfVxuICAgICAgICByZXR1cm4gIXI7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBpZiAoIUNDX0VESVRPUiAmJiAhQ0NfUEhZU0lDU19CVUlMVElOKSB7XG4gICAgICAgICAgICB0aGlzLl9ib2R5ID0gY3JlYXRlUmlnaWRCb2R5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLy8gQ09NUE9ORU5UIExJRkVDWUNMRSAvLy9cblxuICAgIHByb3RlY3RlZCBfX3ByZWxvYWQgKCkge1xuICAgICAgICBpZiAoIUNDX0VESVRPUiAmJiAhQ0NfUEhZU0lDU19CVUlMVElOKSB7XG4gICAgICAgICAgICB0aGlzLl9ib2R5Ll9fcHJlbG9hZCEodGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb25FbmFibGUgKCkge1xuICAgICAgICBpZiAoIUNDX0VESVRPUiAmJiAhQ0NfUEhZU0lDU19CVUlMVElOKSB7XG4gICAgICAgICAgICB0aGlzLl9ib2R5Lm9uRW5hYmxlISgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9uRGlzYWJsZSAoKSB7XG4gICAgICAgIGlmICghQ0NfRURJVE9SICYmICFDQ19QSFlTSUNTX0JVSUxUSU4pIHtcbiAgICAgICAgICAgIHRoaXMuX2JvZHkub25EaXNhYmxlISgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9uRGVzdHJveSAoKSB7XG4gICAgICAgIGlmICghQ0NfRURJVE9SICYmICFDQ19QSFlTSUNTX0JVSUxUSU4pIHtcbiAgICAgICAgICAgIHRoaXMuX2JvZHkub25EZXN0cm95ISgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8vIFBVQkxJQyBNRVRIT0QgLy8vXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQSBmb3JjZSBpcyBhcHBsaWVkIHRvIGEgcmlnaWQgYm9keSBhdCBhIHBvaW50IGluIHdvcmxkIHNwYWNlLlxuICAgICAqICEjemhcbiAgICAgKiDlnKjkuJbnlYznqbrpl7TkuK3nmoTmn5DngrnkuIrlr7nliJrkvZPmlr3liqDkuIDkuKrkvZznlKjlipvjgIJcbiAgICAgKiBAbWV0aG9kIGFwcGx5Rm9yY2VcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IGZvcmNlXG4gICAgICogQHBhcmFtIHtWZWMzfSByZWxhdGl2ZVBvaW50IFRoZSBwb2ludCBvZiBhY3Rpb24sIHJlbGF0aXZlIHRvIHRoZSBjZW50ZXIgb2YgdGhlIHJpZ2lkIGJvZHlcbiAgICAgKi9cbiAgICBwdWJsaWMgYXBwbHlGb3JjZSAoZm9yY2U6IGNjLlZlYzMsIHJlbGF0aXZlUG9pbnQ/OiBjYy5WZWMzKSB7XG4gICAgICAgIGlmICh0aGlzLl9hc3NlcnRPbmxvYWQgJiYgIUNDX0VESVRPUiAmJiAhQ0NfUEhZU0lDU19CVUlMVElOKSB7XG4gICAgICAgICAgICB0aGlzLl9ib2R5LmFwcGx5Rm9yY2UoZm9yY2UsIHJlbGF0aXZlUG9pbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEFwcGx5IGEgZm9yY2Ugb24gdGhlIHJpZ2lkIGJvZHkgYXQgYSBwb2ludCBpbiBsb2NhbCBzcGFjZS5cbiAgICAgKiAhI3poXG4gICAgICog5Zyo5pys5Zyw56m66Ze05Lit55qE5p+Q54K55LiK5a+55Yia5L2T5pa95Yqg5LiA5Liq5L2c55So5Yqb44CCXG4gICAgICogQG1ldGhvZCBhcHBseUxvY2FsRm9yY2VcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IGZvcmNlIFxuICAgICAqIEBwYXJhbSB7VmVjM30gbG9jYWxQb2ludCBQb2ludCBvZiBhcHBsaWNhdGlvblxuICAgICAqL1xuICAgIHB1YmxpYyBhcHBseUxvY2FsRm9yY2UgKGZvcmNlOiBjYy5WZWMzLCBsb2NhbFBvaW50PzogY2MuVmVjMykge1xuICAgICAgICBpZiAodGhpcy5fYXNzZXJ0T25sb2FkICYmICFDQ19FRElUT1IgJiYgIUNDX1BIWVNJQ1NfQlVJTFRJTikge1xuICAgICAgICAgICAgdGhpcy5fYm9keS5hcHBseUxvY2FsRm9yY2UoZm9yY2UsIGxvY2FsUG9pbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEFwcGx5IGFuIGltcHVsc2UgdG8gYSByaWdpZCBib2R5IGF0IGEgcG9pbnQgaW4gd29ybGQgc3BhY2UuXG4gICAgICogISN6aFxuICAgICAqIOWcqOS4lueVjOepuumXtOeahOafkOeCueS4iuWvueWImuS9k+aWveWKoOS4gOS4quWGsumHj+OAglxuICAgICAqIEBtZXRob2QgYXBwbHlJbXB1bHNlXG4gICAgICogQHBhcmFtIHtWZWMzfSBpbXB1bHNlXG4gICAgICogQHBhcmFtIHtWZWMzfSByZWxhdGl2ZVBvaW50IFRoZSBwb2ludCBvZiBhY3Rpb24sIHJlbGF0aXZlIHRvIHRoZSBjZW50ZXIgb2YgdGhlIHJpZ2lkIGJvZHlcbiAgICAgKi9cbiAgICBwdWJsaWMgYXBwbHlJbXB1bHNlIChpbXB1bHNlOiBjYy5WZWMzLCByZWxhdGl2ZVBvaW50PzogY2MuVmVjMykge1xuICAgICAgICBpZiAodGhpcy5fYXNzZXJ0T25sb2FkICYmICFDQ19FRElUT1IgJiYgIUNDX1BIWVNJQ1NfQlVJTFRJTikge1xuICAgICAgICAgICAgdGhpcy5fYm9keS5hcHBseUltcHVsc2UoaW1wdWxzZSwgcmVsYXRpdmVQb2ludCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQXBwbHkgYW4gaW1wdWxzZSB0byB0aGUgcmlnaWQgYm9keSBhdCBhIHBvaW50IGluIGxvY2FsIHNwYWNlLlxuICAgICAqICEjemhcbiAgICAgKiDlnKjmnKzlnLDnqbrpl7TnmoTmn5DngrnkuIrlr7nliJrkvZPmlr3liqDkuIDkuKrlhrLph4/jgIJcbiAgICAgKiBAbWV0aG9kIGFwcGx5TG9jYWxJbXB1bHNlXG4gICAgICogQHBhcmFtIHtWZWMzfSBpbXB1bHNlXG4gICAgICogQHBhcmFtIHtWZWMzfSBsb2NhbFBvaW50IFBvaW50IG9mIGFwcGxpY2F0aW9uXG4gICAgICovXG4gICAgcHVibGljIGFwcGx5TG9jYWxJbXB1bHNlIChpbXB1bHNlOiBjYy5WZWMzLCBsb2NhbFBvaW50PzogY2MuVmVjMykge1xuICAgICAgICBpZiAodGhpcy5fYXNzZXJ0T25sb2FkICYmICFDQ19FRElUT1IgJiYgIUNDX1BIWVNJQ1NfQlVJTFRJTikge1xuICAgICAgICAgICAgdGhpcy5fYm9keS5hcHBseUxvY2FsSW1wdWxzZShpbXB1bHNlLCBsb2NhbFBvaW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBBcHBseSBhIHRvcnF1ZSB0byB0aGUgcmlnaWQgYm9keS5cbiAgICAgKiAhI3poXG4gICAgICog5a+55Yia5L2T5pa95Yqg5omt6L2s5Yqb44CCXG4gICAgICogQG1ldGhvZCBhcHBseVRvcnF1ZVxuICAgICAqIEBwYXJhbSB7VmVjM30gdG9ycXVlXG4gICAgICovXG4gICAgcHVibGljIGFwcGx5VG9ycXVlICh0b3JxdWU6IGNjLlZlYzMpIHtcbiAgICAgICAgaWYgKHRoaXMuX2Fzc2VydE9ubG9hZCAmJiAhQ0NfRURJVE9SICYmICFDQ19QSFlTSUNTX0JVSUxUSU4pIHtcbiAgICAgICAgICAgIHRoaXMuX2JvZHkuYXBwbHlUb3JxdWUodG9ycXVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBBcHBseSBhIGxvY2FsIHRvcnF1ZSB0byB0aGUgcmlnaWQgYm9keS5cbiAgICAgKiAhI3poXG4gICAgICog5a+55Yia5L2T5pa95Yqg5pys5Zyw5omt6L2s5Yqb44CCXG4gICAgICogQG1ldGhvZCBhcHBseUxvY2FsVG9ycXVlXG4gICAgICogQHBhcmFtIHtWZWMzfSB0b3JxdWVcbiAgICAgKi9cbiAgICBwdWJsaWMgYXBwbHlMb2NhbFRvcnF1ZSAodG9ycXVlOiBjYy5WZWMzKSB7XG4gICAgICAgIGlmICh0aGlzLl9hc3NlcnRPbmxvYWQgJiYgIUNDX0VESVRPUiAmJiAhQ0NfUEhZU0lDU19CVUlMVElOKSB7XG4gICAgICAgICAgICB0aGlzLl9ib2R5LmFwcGx5TG9jYWxUb3JxdWUodG9ycXVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBBd2FrZW4gdGhlIHJpZ2lkIGJvZHkuXG4gICAgICogISN6aFxuICAgICAqIOWUpOmGkuWImuS9k+OAglxuICAgICAqIEBtZXRob2Qgd2FrZVVwXG4gICAgICovXG4gICAgcHVibGljIHdha2VVcCAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9hc3NlcnRPbmxvYWQgJiYgIUNDX0VESVRPUiAmJiAhQ0NfUEhZU0lDU19CVUlMVElOKSB7XG4gICAgICAgICAgICB0aGlzLl9ib2R5Lndha2VVcCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIERvcm1hbnQgcmlnaWQgYm9keS5cbiAgICAgKiAhI3poXG4gICAgICog5LyR55yg5Yia5L2T44CCXG4gICAgICogQG1ldGhvZCBzbGVlcFxuICAgICAqL1xuICAgIHB1YmxpYyBzbGVlcCAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9hc3NlcnRPbmxvYWQgJiYgIUNDX0VESVRPUiAmJiAhQ0NfUEhZU0lDU19CVUlMVElOKSB7XG4gICAgICAgICAgICB0aGlzLl9ib2R5LnNsZWVwKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogR2V0IGxpbmVhciB2ZWxvY2l0eS5cbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W57q/5oCn6YCf5bqm44CCXG4gICAgICogQG1ldGhvZCBnZXRMaW5lYXJWZWxvY2l0eVxuICAgICAqIEBwYXJhbSB7VmVjM30gb3V0XG4gICAgICovXG4gICAgcHVibGljIGdldExpbmVhclZlbG9jaXR5IChvdXQ6IGNjLlZlYzMpIHtcbiAgICAgICAgaWYgKHRoaXMuX2Fzc2VydE9ubG9hZCAmJiAhQ0NfRURJVE9SICYmICFDQ19QSFlTSUNTX0JVSUxUSU4pIHtcbiAgICAgICAgICAgIHRoaXMuX2JvZHkuZ2V0TGluZWFyVmVsb2NpdHkob3V0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBTZXQgbGluZWFyIHNwZWVkLlxuICAgICAqICEjemhcbiAgICAgKiDorr7nva7nur/mgKfpgJ/luqbjgIJcbiAgICAgKiBAbWV0aG9kIHNldExpbmVhclZlbG9jaXR5XG4gICAgICogQHBhcmFtIHtWZWMzfSB2YWx1ZSBcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0TGluZWFyVmVsb2NpdHkgKHZhbHVlOiBjYy5WZWMzKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLl9hc3NlcnRPbmxvYWQgJiYgIUNDX0VESVRPUiAmJiAhQ0NfUEhZU0lDU19CVUlMVElOKSB7XG4gICAgICAgICAgICB0aGlzLl9ib2R5LnNldExpbmVhclZlbG9jaXR5KHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXRzIHRoZSByb3RhdGlvbiBzcGVlZC5cbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W5peL6L2s6YCf5bqm44CCXG4gICAgICogQG1ldGhvZCBnZXRBbmd1bGFyVmVsb2NpdHlcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IG91dCBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0QW5ndWxhclZlbG9jaXR5IChvdXQ6IGNjLlZlYzMpIHtcbiAgICAgICAgaWYgKHRoaXMuX2Fzc2VydE9ubG9hZCAmJiAhQ0NfRURJVE9SICYmICFDQ19QSFlTSUNTX0JVSUxUSU4pIHtcbiAgICAgICAgICAgIHRoaXMuX2JvZHkuZ2V0QW5ndWxhclZlbG9jaXR5KG91dCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogU2V0IHJvdGF0aW9uIHNwZWVkLlxuICAgICAqICEjemhcbiAgICAgKiDorr7nva7ml4vovazpgJ/luqbjgIJcbiAgICAgKiBAbWV0aG9kIHNldEFuZ3VsYXJWZWxvY2l0eVxuICAgICAqIEBwYXJhbSB7VmVjM30gdmFsdWUgXG4gICAgICovXG4gICAgcHVibGljIHNldEFuZ3VsYXJWZWxvY2l0eSAodmFsdWU6IGNjLlZlYzMpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuX2Fzc2VydE9ubG9hZCAmJiAhQ0NfRURJVE9SICYmICFDQ19QSFlTSUNTX0JVSUxUSU4pIHtcbiAgICAgICAgICAgIHRoaXMuX2JvZHkuc2V0QW5ndWxhclZlbG9jaXR5KHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==