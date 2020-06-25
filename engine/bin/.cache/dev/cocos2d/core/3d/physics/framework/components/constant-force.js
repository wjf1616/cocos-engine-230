
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/framework/components/constant-force.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.ConstantForce = void 0;

var _rigidBodyComponent = require("./rigid-body-component");

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp;

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

var _cc$_decorator = cc._decorator,
    ccclass = _cc$_decorator.ccclass,
    executeInEditMode = _cc$_decorator.executeInEditMode,
    executionOrder = _cc$_decorator.executionOrder,
    menu = _cc$_decorator.menu,
    property = _cc$_decorator.property,
    requireComponent = _cc$_decorator.requireComponent,
    disallowMultiple = _cc$_decorator.disallowMultiple;
var Vec3 = cc.Vec3;
/**
 * !#en
 * Each frame applies a constant force to a rigid body, depending on the RigidBody3D
 * !#zh
 * 在每帧对一个刚体施加持续的力，依赖 RigidBody3D 组件
 * @class ConstantForce
 * @extends Component
 */

var ConstantForce = (_dec = ccclass('cc.ConstantForce'), _dec2 = executionOrder(98), _dec3 = requireComponent(_rigidBodyComponent.RigidBody3D), _dec4 = menu('i18n:MAIN_MENU.component.physics/Constant Force 3D'), _dec5 = property({
  displayOrder: 0
}), _dec6 = property({
  displayOrder: 1
}), _dec7 = property({
  displayOrder: 2
}), _dec8 = property({
  displayOrder: 3
}), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = disallowMultiple(_class = executeInEditMode(_class = (_class2 = (_temp =
/*#__PURE__*/
function (_cc$Component) {
  _inheritsLoose(ConstantForce, _cc$Component);

  function ConstantForce() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _cc$Component.call.apply(_cc$Component, [this].concat(args)) || this;
    _this._rigidbody = null;

    _initializerDefineProperty(_this, "_force", _descriptor, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_localForce", _descriptor2, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_torque", _descriptor3, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_localTorque", _descriptor4, _assertThisInitialized(_this));

    _this._mask = 0;
    return _this;
  }

  var _proto = ConstantForce.prototype;

  _proto.onLoad = function onLoad() {
    if (!CC_PHYSICS_BUILTIN) {
      this._rigidbody = this.node.getComponent(_rigidBodyComponent.RigidBody3D);

      this._maskUpdate(this._force, 1);

      this._maskUpdate(this._localForce, 2);

      this._maskUpdate(this._torque, 4);

      this._maskUpdate(this._localTorque, 8);
    }
  };

  _proto.lateUpdate = function lateUpdate(dt) {
    if (!CC_PHYSICS_BUILTIN) {
      if (this._rigidbody != null && this._mask != 0) {
        if (this._mask & 1) {
          this._rigidbody.applyForce(this._force);
        }

        if (this._mask & 2) {
          this._rigidbody.applyLocalForce(this.localForce);
        }

        if (this._mask & 4) {
          this._rigidbody.applyTorque(this._torque);
        }

        if (this._mask & 8) {
          this._rigidbody.applyLocalTorque(this._localTorque);
        }
      }
    }
  };

  _proto._maskUpdate = function _maskUpdate(t, m) {
    if (Vec3.strictEquals(t, Vec3.ZERO)) {
      this._mask &= ~m;
    } else {
      this._mask |= m;
    }
  };

  _createClass(ConstantForce, [{
    key: "force",

    /**
     * !#en
     * To get and set the force that the world is facing, use this.force = otherVec3
     * !#zh
     * 获取和设置世界朝向的力, 设置时请用 this.force = otherVec3 的方式
     * @property {Vec3} force
     */
    get: function get() {
      return this._force;
    },
    set: function set(value) {
      Vec3.copy(this._force, value);

      this._maskUpdate(this._force, 1);
    }
    /**
     * !#en
     * Get and set the force of the local orientation, using this.localforce = otherVec3
     * !#zh
     * 获取和设置本地朝向的力, 设置时请用 this.localForce = otherVec3 的方式
     * @property {Vec3} localForce
     */

  }, {
    key: "localForce",
    get: function get() {
      return this._localForce;
    },
    set: function set(value) {
      Vec3.copy(this._localForce, value);

      this._maskUpdate(this.localForce, 2);
    }
    /**
     * !#zh
     * 获取和设置世界朝向的扭转力
     * @note
     * 设置时请用 this.torque = otherVec3 的方式
     * @property {Vec3} torque
     */

  }, {
    key: "torque",
    get: function get() {
      return this._torque;
    },
    set: function set(value) {
      Vec3.copy(this._torque, value);

      this._maskUpdate(this._torque, 4);
    }
    /**
     * !#en
     * Get and set the torque of the local orientation using this.localtorque = otherVec3
     * !#zh
     * 获取和设置本地朝向的扭转力, 设置时请用 this.localTorque = otherVec3 的方式
     * @property {Vec3} localTorque
     */

  }, {
    key: "localTorque",
    get: function get() {
      return this._localTorque;
    },
    set: function set(value) {
      Vec3.copy(this._localTorque, value);

      this._maskUpdate(this._localTorque, 8);
    }
  }]);

  return ConstantForce;
}(cc.Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_force", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Vec3();
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_localForce", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Vec3();
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_torque", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Vec3();
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_localTorque", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Vec3();
  }
}), _applyDecoratedDescriptor(_class2.prototype, "force", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "force"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "localForce", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "localForce"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "torque", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "torque"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "localTorque", [_dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "localTorque"), _class2.prototype)), _class2)) || _class) || _class) || _class) || _class) || _class) || _class);
exports.ConstantForce = ConstantForce;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnN0YW50LWZvcmNlLnRzIl0sIm5hbWVzIjpbImNjIiwiX2RlY29yYXRvciIsImNjY2xhc3MiLCJleGVjdXRlSW5FZGl0TW9kZSIsImV4ZWN1dGlvbk9yZGVyIiwibWVudSIsInByb3BlcnR5IiwicmVxdWlyZUNvbXBvbmVudCIsImRpc2FsbG93TXVsdGlwbGUiLCJWZWMzIiwiQ29uc3RhbnRGb3JjZSIsIlJpZ2lkQm9keTNEIiwiZGlzcGxheU9yZGVyIiwiX3JpZ2lkYm9keSIsIl9tYXNrIiwib25Mb2FkIiwiQ0NfUEhZU0lDU19CVUlMVElOIiwibm9kZSIsImdldENvbXBvbmVudCIsIl9tYXNrVXBkYXRlIiwiX2ZvcmNlIiwiX2xvY2FsRm9yY2UiLCJfdG9ycXVlIiwiX2xvY2FsVG9ycXVlIiwibGF0ZVVwZGF0ZSIsImR0IiwiYXBwbHlGb3JjZSIsImFwcGx5TG9jYWxGb3JjZSIsImxvY2FsRm9yY2UiLCJhcHBseVRvcnF1ZSIsImFwcGx5TG9jYWxUb3JxdWUiLCJ0IiwibSIsInN0cmljdEVxdWFscyIsIlpFUk8iLCJ2YWx1ZSIsImNvcHkiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkE7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkFVSUEsRUFBRSxDQUFDQztJQVBIQyx5QkFBQUE7SUFDQUMsbUNBQUFBO0lBQ0FDLGdDQUFBQTtJQUNBQyxzQkFBQUE7SUFDQUMsMEJBQUFBO0lBQ0FDLGtDQUFBQTtJQUNBQyxrQ0FBQUE7QUFFSixJQUFNQyxJQUFJLEdBQUdULEVBQUUsQ0FBQ1MsSUFBaEI7QUFFQTs7Ozs7Ozs7O0lBY2FDLHdCQU5aUixPQUFPLENBQUMsa0JBQUQsV0FDUEUsY0FBYyxDQUFDLEVBQUQsV0FDZEcsZ0JBQWdCLENBQUNJLCtCQUFELFdBQ2hCTixJQUFJLENBQUMsb0RBQUQsV0E0QkFDLFFBQVEsQ0FBQztBQUNOTSxFQUFBQSxZQUFZLEVBQUU7QUFEUixDQUFELFdBbUJSTixRQUFRLENBQUM7QUFDTk0sRUFB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Q0g7c0JBRXVCWSxPQUFnQjtBQUNwQzFCLE1BQUFBLElBQUksQ0FBQzJCLElBQUwsQ0FBVSxLQUFLYixZQUFmLEVBQTZCWSxLQUE3Qjs7QUFDQSxXQUFLaEIsV0FBTCxDQUFpQixLQUFLSSxZQUF0QixFQUFvQyxDQUFwQztBQUNIOzs7O0VBNUY4QnZCLEVBQUUsQ0FBQ3FDLDJGQUlqQy9COzs7OztXQUNrQyxJQUFJRyxJQUFKOztnRkFFbENIOzs7OztXQUN1QyxJQUFJRyxJQUFKOzs0RUFFdkNIOzs7OztXQUNtQyxJQUFJRyxJQUFKOztpRkFFbkNIOzs7OztXQUN3QyxJQUFJRyxJQUFKIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTkgWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCB7IFJpZ2lkQm9keTNEIH0gZnJvbSAnLi9yaWdpZC1ib2R5LWNvbXBvbmVudCc7XG5cbmNvbnN0IHtcbiAgICBjY2NsYXNzLFxuICAgIGV4ZWN1dGVJbkVkaXRNb2RlLFxuICAgIGV4ZWN1dGlvbk9yZGVyLFxuICAgIG1lbnUsXG4gICAgcHJvcGVydHksXG4gICAgcmVxdWlyZUNvbXBvbmVudCxcbiAgICBkaXNhbGxvd011bHRpcGxlLFxufSA9IGNjLl9kZWNvcmF0b3I7XG5jb25zdCBWZWMzID0gY2MuVmVjMztcblxuLyoqXG4gKiAhI2VuXG4gKiBFYWNoIGZyYW1lIGFwcGxpZXMgYSBjb25zdGFudCBmb3JjZSB0byBhIHJpZ2lkIGJvZHksIGRlcGVuZGluZyBvbiB0aGUgUmlnaWRCb2R5M0RcbiAqICEjemhcbiAqIOWcqOavj+W4p+WvueS4gOS4quWImuS9k+aWveWKoOaMgee7reeahOWKm++8jOS+nei1liBSaWdpZEJvZHkzRCDnu4Tku7ZcbiAqIEBjbGFzcyBDb25zdGFudEZvcmNlXG4gKiBAZXh0ZW5kcyBDb21wb25lbnRcbiAqL1xuQGNjY2xhc3MoJ2NjLkNvbnN0YW50Rm9yY2UnKVxuQGV4ZWN1dGlvbk9yZGVyKDk4KVxuQHJlcXVpcmVDb21wb25lbnQoUmlnaWRCb2R5M0QpXG5AbWVudSgnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50LnBoeXNpY3MvQ29uc3RhbnQgRm9yY2UgM0QnKVxuQGRpc2FsbG93TXVsdGlwbGVcbkBleGVjdXRlSW5FZGl0TW9kZVxuZXhwb3J0IGNsYXNzIENvbnN0YW50Rm9yY2UgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xuXG4gICAgcHJpdmF0ZSBfcmlnaWRib2R5OiBSaWdpZEJvZHkzRCB8IG51bGwgPSBudWxsO1xuXG4gICAgQHByb3BlcnR5XG4gICAgcHJpdmF0ZSByZWFkb25seSBfZm9yY2U6IGNjLlZlYzMgPSBuZXcgVmVjMygpO1xuXG4gICAgQHByb3BlcnR5XG4gICAgcHJpdmF0ZSByZWFkb25seSBfbG9jYWxGb3JjZTogY2MuVmVjMyA9IG5ldyBWZWMzKCk7XG5cbiAgICBAcHJvcGVydHlcbiAgICBwcml2YXRlIHJlYWRvbmx5IF90b3JxdWU6IGNjLlZlYzMgPSBuZXcgVmVjMygpO1xuXG4gICAgQHByb3BlcnR5XG4gICAgcHJpdmF0ZSByZWFkb25seSBfbG9jYWxUb3JxdWU6IGNjLlZlYzMgPSBuZXcgVmVjMygpO1xuXG4gICAgcHJpdmF0ZSBfbWFzazogbnVtYmVyID0gMDtcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBUbyBnZXQgYW5kIHNldCB0aGUgZm9yY2UgdGhhdCB0aGUgd29ybGQgaXMgZmFjaW5nLCB1c2UgdGhpcy5mb3JjZSA9IG90aGVyVmVjM1xuICAgICAqICEjemhcbiAgICAgKiDojrflj5blkozorr7nva7kuJbnlYzmnJ3lkJHnmoTlipssIOiuvue9ruaXtuivt+eUqCB0aGlzLmZvcmNlID0gb3RoZXJWZWMzIOeahOaWueW8j1xuICAgICAqIEBwcm9wZXJ0eSB7VmVjM30gZm9yY2VcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICBkaXNwbGF5T3JkZXI6IDBcbiAgICB9KVxuICAgIHB1YmxpYyBnZXQgZm9yY2UgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZm9yY2U7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBmb3JjZSAodmFsdWU6IGNjLlZlYzMpIHtcbiAgICAgICAgVmVjMy5jb3B5KHRoaXMuX2ZvcmNlLCB2YWx1ZSk7XG4gICAgICAgIHRoaXMuX21hc2tVcGRhdGUodGhpcy5fZm9yY2UsIDEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXQgYW5kIHNldCB0aGUgZm9yY2Ugb2YgdGhlIGxvY2FsIG9yaWVudGF0aW9uLCB1c2luZyB0aGlzLmxvY2FsZm9yY2UgPSBvdGhlclZlYzNcbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W5ZKM6K6+572u5pys5Zyw5pyd5ZCR55qE5YqbLCDorr7nva7ml7bor7fnlKggdGhpcy5sb2NhbEZvcmNlID0gb3RoZXJWZWMzIOeahOaWueW8j1xuICAgICAqIEBwcm9wZXJ0eSB7VmVjM30gbG9jYWxGb3JjZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIGRpc3BsYXlPcmRlcjogMVxuICAgIH0pXG4gICAgcHVibGljIGdldCBsb2NhbEZvcmNlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvY2FsRm9yY2U7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBsb2NhbEZvcmNlICh2YWx1ZTogY2MuVmVjMykge1xuICAgICAgICBWZWMzLmNvcHkodGhpcy5fbG9jYWxGb3JjZSwgdmFsdWUpO1xuICAgICAgICB0aGlzLl9tYXNrVXBkYXRlKHRoaXMubG9jYWxGb3JjZSwgMik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aFxuICAgICAqIOiOt+WPluWSjOiuvue9ruS4lueVjOacneWQkeeahOaJrei9rOWKm1xuICAgICAqIEBub3RlXG4gICAgICog6K6+572u5pe26K+355SoIHRoaXMudG9ycXVlID0gb3RoZXJWZWMzIOeahOaWueW8j1xuICAgICAqIEBwcm9wZXJ0eSB7VmVjM30gdG9ycXVlXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgZGlzcGxheU9yZGVyOiAyXG4gICAgfSlcbiAgICBwdWJsaWMgZ2V0IHRvcnF1ZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90b3JxdWU7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCB0b3JxdWUgKHZhbHVlOiBjYy5WZWMzKSB7XG4gICAgICAgIFZlYzMuY29weSh0aGlzLl90b3JxdWUsIHZhbHVlKTtcbiAgICAgICAgdGhpcy5fbWFza1VwZGF0ZSh0aGlzLl90b3JxdWUsIDQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXQgYW5kIHNldCB0aGUgdG9ycXVlIG9mIHRoZSBsb2NhbCBvcmllbnRhdGlvbiB1c2luZyB0aGlzLmxvY2FsdG9ycXVlID0gb3RoZXJWZWMzXG4gICAgICogISN6aFxuICAgICAqIOiOt+WPluWSjOiuvue9ruacrOWcsOacneWQkeeahOaJrei9rOWKmywg6K6+572u5pe26K+355SoIHRoaXMubG9jYWxUb3JxdWUgPSBvdGhlclZlYzMg55qE5pa55byPXG4gICAgICogQHByb3BlcnR5IHtWZWMzfSBsb2NhbFRvcnF1ZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIGRpc3BsYXlPcmRlcjogM1xuICAgIH0pXG4gICAgcHVibGljIGdldCBsb2NhbFRvcnF1ZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2NhbFRvcnF1ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IGxvY2FsVG9ycXVlICh2YWx1ZTogY2MuVmVjMykge1xuICAgICAgICBWZWMzLmNvcHkodGhpcy5fbG9jYWxUb3JxdWUsIHZhbHVlKTtcbiAgICAgICAgdGhpcy5fbWFza1VwZGF0ZSh0aGlzLl9sb2NhbFRvcnF1ZSwgOCk7XG4gICAgfVxuXG4gICAgcHVibGljIG9uTG9hZCAoKSB7XG4gICAgICAgIGlmICghQ0NfUEhZU0lDU19CVUlMVElOKSB7XG4gICAgICAgICAgICB0aGlzLl9yaWdpZGJvZHkgPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KFJpZ2lkQm9keTNEKTtcbiAgICAgICAgICAgIHRoaXMuX21hc2tVcGRhdGUodGhpcy5fZm9yY2UsIDEpO1xuICAgICAgICAgICAgdGhpcy5fbWFza1VwZGF0ZSh0aGlzLl9sb2NhbEZvcmNlLCAyKTtcbiAgICAgICAgICAgIHRoaXMuX21hc2tVcGRhdGUodGhpcy5fdG9ycXVlLCA0KTtcbiAgICAgICAgICAgIHRoaXMuX21hc2tVcGRhdGUodGhpcy5fbG9jYWxUb3JxdWUsIDgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGxhdGVVcGRhdGUgKGR0OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKCFDQ19QSFlTSUNTX0JVSUxUSU4pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9yaWdpZGJvZHkgIT0gbnVsbCAmJiB0aGlzLl9tYXNrICE9IDApIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbWFzayAmIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmlnaWRib2R5LmFwcGx5Rm9yY2UodGhpcy5fZm9yY2UpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9tYXNrICYgMikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yaWdpZGJvZHkuYXBwbHlMb2NhbEZvcmNlKHRoaXMubG9jYWxGb3JjZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX21hc2sgJiA0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JpZ2lkYm9keS5hcHBseVRvcnF1ZSh0aGlzLl90b3JxdWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9tYXNrICYgOCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yaWdpZGJvZHkuYXBwbHlMb2NhbFRvcnF1ZSh0aGlzLl9sb2NhbFRvcnF1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfbWFza1VwZGF0ZSAodDogY2MuVmVjMywgbTogbnVtYmVyKSB7XG4gICAgICAgIGlmIChWZWMzLnN0cmljdEVxdWFscyh0LCBWZWMzLlpFUk8pKSB7XG4gICAgICAgICAgICB0aGlzLl9tYXNrICY9IH5tO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fbWFzayB8PSBtO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19