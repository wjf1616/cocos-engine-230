
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/framework/components/collider/collider-component.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.Collider3D = void 0;

var _physicsMaterial = require("../../assets/physics-material");

var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

var _cc$_decorator = cc._decorator,
    ccclass = _cc$_decorator.ccclass,
    property = _cc$_decorator.property;
var Vec3 = cc.Vec3;
/**
 * !#en
 * The base class of the collider
 * !#zh
 * 碰撞器的基类
 * @class Collider3D
 * @extends Component
 * @uses EventTarget
 */

var Collider3D = (_dec = ccclass('cc.Collider3D'), _dec2 = property({
  type: _physicsMaterial.PhysicsMaterial,
  displayName: 'Material',
  displayOrder: -1
}), _dec3 = property({
  displayOrder: 0
}), _dec4 = property({
  type: cc.Vec3,
  displayOrder: 1
}), _dec5 = property({
  type: _physicsMaterial.PhysicsMaterial
}), _dec(_class = (_class2 = (_temp =
/*#__PURE__*/
function (_cc$Component) {
  _inheritsLoose(Collider3D, _cc$Component);

  _createClass(Collider3D, [{
    key: "sharedMaterial",

    /**
     * @property {PhysicsMaterial} sharedMaterial
     */
    get: function get() {
      return this._material;
    },
    set: function set(value) {
      this.material = value;
    }
  }, {
    key: "material",
    get: function get() {
      if (!CC_PHYSICS_BUILTIN) {
        if (this._isSharedMaterial && this._material != null) {
          this._material.off('physics_material_update', this._updateMaterial, this);

          this._material = this._material.clone();

          this._material.on('physics_material_update', this._updateMaterial, this);

          this._isSharedMaterial = false;
        }
      }

      return this._material;
    },
    set: function set(value) {
      if (CC_EDITOR || CC_PHYSICS_BUILTIN) {
        this._material = value;
        return;
      }

      if (value != null && this._material != null) {
        if (this._material._uuid != value._uuid) {
          this._material.off('physics_material_update', this._updateMaterial, this);

          value.on('physics_material_update', this._updateMaterial, this);
          this._isSharedMaterial = false;
          this._material = value;
        }
      } else if (value != null && this._material == null) {
        value.on('physics_material_update', this._updateMaterial, this);
        this._material = value;
      } else if (value == null && this._material != null) {
        this._material.off('physics_material_update', this._updateMaterial, this);

        this._material = value;
      }

      this._updateMaterial();
    }
    /**
     * !#en
     * get or set the collider is trigger, this will be always trigger if using builtin.
     * !#zh
     * 获取或设置碰撞器是否为触发器
     * @property {Boolean} isTrigger
     */

  }, {
    key: "isTrigger",
    get: function get() {
      return this._isTrigger;
    },
    set: function set(value) {
      this._isTrigger = value;

      if (!CC_EDITOR) {
        this._shape.isTrigger = this._isTrigger;
      }
    }
    /**
     * !#en
     * get or set the center of the collider, in local space.
     * !#zh
     * 获取或设置碰撞器的中心点。
     * @property {Vec3} center
     */

  }, {
    key: "center",
    get: function get() {
      return this._center;
    },
    set: function set(value) {
      Vec3.copy(this._center, value);

      if (!CC_EDITOR) {
        this._shape.center = this._center;
      }
    }
    /**
     * !#en
     * get the collider attached rigidbody, this may be null
     * !#zh
     * 获取碰撞器所绑定的刚体组件，可能为 null
     * @property {RigidBody3D|null} attachedRigidbody
     * @readonly
     */

  }, {
    key: "attachedRigidbody",
    get: function get() {
      return this.shape.attachedRigidBody;
    }
    /**
     * !#en
     * get collider shape
     * !#zh
     * 获取碰撞器形状
     * @property {IBaseShape} shape
     * @readonly
     */

  }, {
    key: "shape",
    get: function get() {
      return this._shape;
    } /// PRIVATE PROPERTY ///

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

  function Collider3D() {
    var _this;

    _this = _cc$Component.call(this) || this;
    _this._shape = void 0;
    _this._isSharedMaterial = true;

    _initializerDefineProperty(_this, "_material", _descriptor, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_isTrigger", _descriptor2, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_center", _descriptor3, _assertThisInitialized(_this));

    cc.EventTarget.call(_assertThisInitialized(_this));
    return _this;
  } /// EVENT INTERFACE ///

  /**
   * !#en
   * Register an callback of a specific event type on the EventTarget.
   * This type of event should be triggered via `emit`.
   * !#zh
   * 注册事件目标的特定事件类型回调。这种类型的事件应该被 `emit` 触发。
   *
   * @method on
   * @param {String} type - The type of collider event can be 'trigger-enter', 'trigger-stay', 'trigger-exit' or 'collision-enter', 'collision-stay', 'collision-exit'.
   * @param {Function} callback - The callback that will be invoked when the event is dispatched.
   *                              The callback is ignored if it is a duplicate (the callbacks are unique).
   * @param {ITriggerEvent|ICollisionEvent} callback.event callback function argument
   * @param {Object} [target] - The target (this object) to invoke the callback, can be null
   * @return {Function} - Just returns the incoming callback so you can save the anonymous function easier.
   * @typescript
   * on<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T
   * @example
   * eventTarget.on('fire', function (event) {
   *     // event is ITriggerEvent or ICollisionEvent
   * }, node);
   */


  var _proto = Collider3D.prototype;

  _proto.on = function on(type, callback, target, useCapture) {}
  /**
   * !#en
   * Removes the listeners previously registered with the same type, callback, target and or useCapture,
   * if only type is passed as parameter, all listeners registered with that type will be removed.
   * !#zh
   * 删除之前用同类型，回调，目标或 useCapture 注册的事件监听器，如果只传递 type，将会删除 type 类型的所有事件监听器。
   *
   * @method off
   * @param {String} type - The type of collider event can be 'trigger-enter', 'trigger-stay', 'trigger-exit' or 'collision-enter', 'collision-stay', 'collision-exit'.
   * @param {Function} [callback] - The callback to remove.
   * @param {Object} [target] - The target (this object) to invoke the callback, if it's not given, only callback without target will be removed
   * @example
   * // register fire eventListener
   * var callback = eventTarget.on('fire', function () {
   *     cc.log("fire in the hole");
   * }, target);
   * // remove fire event listener
   * eventTarget.off('fire', callback, target);
   * // remove all fire event listeners
   * eventTarget.off('fire');
   */
  ;

  _proto.off = function off(type, callback, target) {}
  /**
   * !#en
   * Register an callback of a specific event type on the EventTarget,
   * the callback will remove itself after the first time it is triggered.
   * !#zh
   * 注册事件目标的特定事件类型回调，回调会在第一时间被触发后删除自身。
   *
   * @method once
   * @param {String} type - The type of collider event can be 'trigger-enter', 'trigger-stay', 'trigger-exit' or 'collision-enter', 'collision-stay', 'collision-exit'.
   * @param {Function} callback - The callback that will be invoked when the event is dispatched.
   *                              The callback is ignored if it is a duplicate (the callbacks are unique).
   * @param {ITriggerEvent|ICollisionEvent} callback.event callback function argument.
   * @param {Object} [target] - The target (this object) to invoke the callback, can be null
   * @example
   * eventTarget.once('fire', function (event) {
   *     // event is ITriggerEvent or ICollisionEvent
   * }, node);
   */
  ;

  _proto.once = function once(type, callback, target) {}
  /* declare for typescript tip */
  ;

  _proto.emit = function emit(key) {} /// COMPONENT LIFECYCLE ///
  ;

  _proto.__preload = function __preload() {
    if (!CC_EDITOR) {
      this._shape.__preload(this);
    }
  };

  _proto.onLoad = function onLoad() {
    if (!CC_EDITOR) {
      if (!CC_PHYSICS_BUILTIN) {
        this.sharedMaterial = this._material == null ? cc.director.getPhysics3DManager().defaultMaterial : this._material;
      }

      this._shape.onLoad();
    }
  };

  _proto.onEnable = function onEnable() {
    if (!CC_EDITOR) {
      this._shape.onEnable();
    }
  };

  _proto.onDisable = function onDisable() {
    if (!CC_EDITOR) {
      this._shape.onDisable();
    }
  };

  _proto.onDestroy = function onDestroy() {
    if (!CC_EDITOR) {
      this._shape.onDestroy();
    }
  };

  _proto._updateMaterial = function _updateMaterial() {
    if (!CC_EDITOR) {
      this._shape.material = this._material;
    }
  };

  return Collider3D;
}(cc.Component), _temp), (_applyDecoratedDescriptor(_class2.prototype, "sharedMaterial", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "sharedMaterial"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isTrigger", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "isTrigger"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "center", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "center"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_material", [_dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_isTrigger", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_center", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Vec3();
  }
})), _class2)) || _class);
exports.Collider3D = Collider3D;
cc.js.mixin(Collider3D.prototype, cc.EventTarget.prototype);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbGxpZGVyLWNvbXBvbmVudC50cyJdLCJuYW1lcyI6WyJjYyIsIl9kZWNvcmF0b3IiLCJjY2NsYXNzIiwicHJvcGVydHkiLCJWZWMzIiwiQ29sbGlkZXIzRCIsInR5cGUiLCJQaHlzaWNzTWF0ZXJpYWwiLCJkaXNwbGF5TmFtZSIsImRpc3BsYXlPcmRlciIsIl9tYXRlcmlhbCIsInZhbHVlIiwibWF0ZXJpYWwiLCJDQ19QSFlTSUNTX0JVSUxUSU4iLCJfaXNTaGFyZWRNYXRlcmlhbCIsIm9mZiIsIl91cGRhdGVNYXRlcmlhbCIsImNsb25lIiwib24iLCJDQ19FRElUT1IiLCJfdXVpZCIsIl9pc1RyaWdnZXIiLCJfc2hhcGUiLCJpc1RyaWdnZXIiLCJfY2VudGVyIiwiY29weSIsImNlbnRlciIsInNoYXBlIiwiYXR0YWNoZWRSaWdpZEJvZHkiLCJyIiwiX2lzT25Mb2FkQ2FsbGVkIiwiZXJyb3IiLCJFdmVudFRhcmdldCIsImNhbGwiLCJjYWxsYmFjayIsInRhcmdldCIsInVzZUNhcHR1cmUiLCJvbmNlIiwiZW1pdCIsImtleSIsIl9fcHJlbG9hZCIsIm9uTG9hZCIsInNoYXJlZE1hdGVyaWFsIiwiZGlyZWN0b3IiLCJnZXRQaHlzaWNzM0RNYW5hZ2VyIiwiZGVmYXVsdE1hdGVyaWFsIiwib25FbmFibGUiLCJvbkRpc2FibGUiLCJvbkRlc3Ryb3kiLCJDb21wb25lbnQiLCJqcyIsIm1peGluIiwicHJvdG90eXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBMkJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7cUJBRzRCQSxFQUFFLENBQUNDO0lBQXhCQyx5QkFBQUE7SUFBU0MsMEJBQUFBO0FBQ2hCLElBQU1DLElBQUksR0FBR0osRUFBRSxDQUFDSSxJQUFoQjtBQUVBOzs7Ozs7Ozs7O0lBVWFDLHFCQURaSCxPQUFPLENBQUMsZUFBRCxXQU1IQyxRQUFRLENBQUM7QUFDTkcsRUFBQUEsSUFBSSxFQUFFQyxnQ0FEQTtBQUVOQyxFQUFBQSxXQUFXLEVBQUUs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RVNDLFNBQVYsa0JBQW9CO0FBQ2hCLFFBQUksQ0FBQ3RCLFNBQUwsRUFBZ0I7QUFDWixVQUFJLENBQUNOLGtCQUFMLEVBQXlCO0FBQ3JCLGFBQUs2QixjQUFMLEdBQXNCLEtBQUtoQyxTQUFMLElBQWtCLElBQWxCLEdBQXlCVixFQUFFLENBQUMyQyxRQUFILENBQVlDLG1CQUFaLEdBQWtDQyxlQUEzRCxHQUE2RSxLQUFLbkMsU0FBeEc7QUFDSDs7QUFDRCxXQUFLWSxNQUFMLENBQVltQixNQUFaO0FBQ0g7QUFDSjs7U0FFU0ssV0FBVixvQkFBc0I7QUFDbEIsUUFBSSxDQUFDM0IsU0FBTCxFQUFnQjtBQUNaLFdBQUtHLE1BQUwsQ0FBWXdCLFFBQVo7QUFDSDtBQUNKOztTQUVTQyxZQUFWLHFCQUF1QjtBQUNuQixRQUFJLENBQUM1QixTQUFMLEVBQWdCO0FBQ1osV0FBS0csTUFBTCxDQUFZeUIsU0FBWjtBQUNIO0FBQ0o7O1NBRVNDLFlBQVYscUJBQXVCO0FBQ25CLFFBQUksQ0FBQzdCLFNBQUwsRUFBZ0I7QUFDWixXQUFLRyxNQUFMLENBQVkwQixTQUFaO0FBQ0g7QUFDSjs7U0FFT2hDLGtCQUFSLDJCQUEyQjtBQUN2QixRQUFJLENBQUNHLFNBQUwsRUFBZ0I7QUFDWixXQUFLRyxNQUFMLENBQVlWLFFBQVosR0FBdUIsS0FBS0YsU0FBNUI7QUFDSDtBQUNKOzs7RUFuUTJCVixFQUFFLENBQUNpRDs7Ozs7V0E4SGU7OytFQUU3QzlDOzs7OztXQUMrQjs7NEVBRS9CQTs7Ozs7V0FDcUMsSUFBSUMsSUFBSjs7OztBQW1JMUNKLEVBQUUsQ0FBQ2tELEVBQUgsQ0FBTUMsS0FBTixDQUFZOUMsVUFBVSxDQUFDK0MsU0FBdkIsRUFBa0NwRCxFQUFFLENBQUNnQyxXQUFILENBQWVvQixTQUFqRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE5IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgeyBDb2xsaXNpb25DYWxsYmFjaywgQ29sbGlzaW9uRXZlbnRUeXBlLCBUcmlnZ2VyQ2FsbGJhY2ssIFRyaWdnZXJFdmVudFR5cGUsIElDb2xsaXNpb25FdmVudCB9IGZyb20gJy4uLy4uL3BoeXNpY3MtaW50ZXJmYWNlJztcbmltcG9ydCB7IFJpZ2lkQm9keTNEIH0gZnJvbSAnLi4vcmlnaWQtYm9keS1jb21wb25lbnQnO1xuaW1wb3J0IHsgUGh5c2ljc01hdGVyaWFsIH0gZnJvbSAnLi4vLi4vYXNzZXRzL3BoeXNpY3MtbWF0ZXJpYWwnO1xuaW1wb3J0IHsgSUJhc2VTaGFwZSB9IGZyb20gJy4uLy4uLy4uL3NwZWMvaS1waHlzaWNzLXNoYXBlJztcblxuY29uc3Qge2NjY2xhc3MsIHByb3BlcnR5fSA9IGNjLl9kZWNvcmF0b3I7XG5jb25zdCBWZWMzID0gY2MuVmVjMztcblxuLyoqXG4gKiAhI2VuXG4gKiBUaGUgYmFzZSBjbGFzcyBvZiB0aGUgY29sbGlkZXJcbiAqICEjemhcbiAqIOeisOaSnuWZqOeahOWfuuexu1xuICogQGNsYXNzIENvbGxpZGVyM0RcbiAqIEBleHRlbmRzIENvbXBvbmVudFxuICogQHVzZXMgRXZlbnRUYXJnZXRcbiAqL1xuQGNjY2xhc3MoJ2NjLkNvbGxpZGVyM0QnKVxuZXhwb3J0IGNsYXNzIENvbGxpZGVyM0QgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtQaHlzaWNzTWF0ZXJpYWx9IHNoYXJlZE1hdGVyaWFsXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogUGh5c2ljc01hdGVyaWFsLFxuICAgICAgICBkaXNwbGF5TmFtZTogJ01hdGVyaWFsJyxcbiAgICAgICAgZGlzcGxheU9yZGVyOiAtMVxuICAgIH0pXG4gICAgcHVibGljIGdldCBzaGFyZWRNYXRlcmlhbCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXRlcmlhbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IHNoYXJlZE1hdGVyaWFsICh2YWx1ZSkge1xuICAgICAgICB0aGlzLm1hdGVyaWFsID0gdmFsdWU7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBtYXRlcmlhbCAoKSB7XG4gICAgICAgIGlmICghQ0NfUEhZU0lDU19CVUlMVElOKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5faXNTaGFyZWRNYXRlcmlhbCAmJiB0aGlzLl9tYXRlcmlhbCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWF0ZXJpYWwub2ZmKCdwaHlzaWNzX21hdGVyaWFsX3VwZGF0ZScsIHRoaXMuX3VwZGF0ZU1hdGVyaWFsLCB0aGlzKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXRlcmlhbCA9IHRoaXMuX21hdGVyaWFsLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWF0ZXJpYWwub24oJ3BoeXNpY3NfbWF0ZXJpYWxfdXBkYXRlJywgdGhpcy5fdXBkYXRlTWF0ZXJpYWwsIHRoaXMpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2lzU2hhcmVkTWF0ZXJpYWwgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fbWF0ZXJpYWw7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBtYXRlcmlhbCAodmFsdWUpIHtcbiAgICAgICAgaWYgKENDX0VESVRPUiB8fCBDQ19QSFlTSUNTX0JVSUxUSU4pIHsgXG4gICAgICAgICAgICB0aGlzLl9tYXRlcmlhbCA9IHZhbHVlOyBcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB0aGlzLl9tYXRlcmlhbCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fbWF0ZXJpYWwuX3V1aWQgIT0gdmFsdWUuX3V1aWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXRlcmlhbC5vZmYoJ3BoeXNpY3NfbWF0ZXJpYWxfdXBkYXRlJywgdGhpcy5fdXBkYXRlTWF0ZXJpYWwsIHRoaXMpO1xuICAgICAgICAgICAgICAgIHZhbHVlLm9uKCdwaHlzaWNzX21hdGVyaWFsX3VwZGF0ZScsIHRoaXMuX3VwZGF0ZU1hdGVyaWFsLCB0aGlzKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9pc1NoYXJlZE1hdGVyaWFsID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWF0ZXJpYWwgPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSAhPSBudWxsICYmIHRoaXMuX21hdGVyaWFsID09IG51bGwpIHtcbiAgICAgICAgICAgIHZhbHVlLm9uKCdwaHlzaWNzX21hdGVyaWFsX3VwZGF0ZScsIHRoaXMuX3VwZGF0ZU1hdGVyaWFsLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuX21hdGVyaWFsID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT0gbnVsbCAmJiB0aGlzLl9tYXRlcmlhbCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLl9tYXRlcmlhbCEub2ZmKCdwaHlzaWNzX21hdGVyaWFsX3VwZGF0ZScsIHRoaXMuX3VwZGF0ZU1hdGVyaWFsLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuX21hdGVyaWFsID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdXBkYXRlTWF0ZXJpYWwoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogZ2V0IG9yIHNldCB0aGUgY29sbGlkZXIgaXMgdHJpZ2dlciwgdGhpcyB3aWxsIGJlIGFsd2F5cyB0cmlnZ2VyIGlmIHVzaW5nIGJ1aWx0aW4uXG4gICAgICogISN6aFxuICAgICAqIOiOt+WPluaIluiuvue9rueisOaSnuWZqOaYr+WQpuS4uuinpuWPkeWZqFxuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gaXNUcmlnZ2VyXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgZGlzcGxheU9yZGVyOiAwXG4gICAgfSlcbiAgICBwdWJsaWMgZ2V0IGlzVHJpZ2dlciAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc1RyaWdnZXI7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBpc1RyaWdnZXIgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2lzVHJpZ2dlciA9IHZhbHVlO1xuICAgICAgICBpZiAoIUNDX0VESVRPUikge1xuICAgICAgICAgICAgdGhpcy5fc2hhcGUuaXNUcmlnZ2VyID0gdGhpcy5faXNUcmlnZ2VyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIGdldCBvciBzZXQgdGhlIGNlbnRlciBvZiB0aGUgY29sbGlkZXIsIGluIGxvY2FsIHNwYWNlLlxuICAgICAqICEjemhcbiAgICAgKiDojrflj5bmiJborr7nva7norDmkp7lmajnmoTkuK3lv4PngrnjgIJcbiAgICAgKiBAcHJvcGVydHkge1ZlYzN9IGNlbnRlclxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IGNjLlZlYzMsXG4gICAgICAgIGRpc3BsYXlPcmRlcjogMVxuICAgIH0pXG4gICAgcHVibGljIGdldCBjZW50ZXIgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY2VudGVyO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgY2VudGVyICh2YWx1ZTogY2MuVmVjMykge1xuICAgICAgICBWZWMzLmNvcHkodGhpcy5fY2VudGVyLCB2YWx1ZSk7XG4gICAgICAgIGlmICghQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICB0aGlzLl9zaGFwZS5jZW50ZXIgPSB0aGlzLl9jZW50ZXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogZ2V0IHRoZSBjb2xsaWRlciBhdHRhY2hlZCByaWdpZGJvZHksIHRoaXMgbWF5IGJlIG51bGxcbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W56Kw5pKe5Zmo5omA57uR5a6a55qE5Yia5L2T57uE5Lu277yM5Y+v6IO95Li6IG51bGxcbiAgICAgKiBAcHJvcGVydHkge1JpZ2lkQm9keTNEfG51bGx9IGF0dGFjaGVkUmlnaWRib2R5XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgcHVibGljIGdldCBhdHRhY2hlZFJpZ2lkYm9keSAoKTogUmlnaWRCb2R5M0QgfCBudWxsIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2hhcGUuYXR0YWNoZWRSaWdpZEJvZHk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIGdldCBjb2xsaWRlciBzaGFwZVxuICAgICAqICEjemhcbiAgICAgKiDojrflj5bnorDmkp7lmajlvaLnirZcbiAgICAgKiBAcHJvcGVydHkge0lCYXNlU2hhcGV9IHNoYXBlXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgcHVibGljIGdldCBzaGFwZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFwZTtcbiAgICB9XG5cbiAgICAvLy8gUFJJVkFURSBQUk9QRVJUWSAvLy9cblxuICAgIHByb3RlY3RlZCBfc2hhcGUhOiBJQmFzZVNoYXBlO1xuXG4gICAgcHJvdGVjdGVkIF9pc1NoYXJlZE1hdGVyaWFsOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBwcm9wZXJ0eSh7IHR5cGU6IFBoeXNpY3NNYXRlcmlhbCB9KVxuICAgIHByb3RlY3RlZCBfbWF0ZXJpYWw6IFBoeXNpY3NNYXRlcmlhbCB8IG51bGwgPSBudWxsO1xuXG4gICAgQHByb3BlcnR5XG4gICAgcHJvdGVjdGVkIF9pc1RyaWdnZXI6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBwcm9wZXJ0eVxuICAgIHByb3RlY3RlZCByZWFkb25seSBfY2VudGVyOiBjYy5WZWMzID0gbmV3IFZlYzMoKTtcblxuICAgIHByb3RlY3RlZCBnZXQgX2Fzc2VydE9ubG9hZCAoKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHIgPSB0aGlzLl9pc09uTG9hZENhbGxlZCA9PSAwO1xuICAgICAgICBpZiAocikgeyBjYy5lcnJvcignUGh5c2ljcyBFcnJvcjogUGxlYXNlIG1ha2Ugc3VyZSB0aGF0IHRoZSBub2RlIGhhcyBiZWVuIGFkZGVkIHRvIHRoZSBzY2VuZScpOyB9XG4gICAgICAgIHJldHVybiAhcjtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgY29uc3RydWN0b3IgKCkgeyBcbiAgICAgICAgc3VwZXIoKVxuICAgICAgICBjYy5FdmVudFRhcmdldC5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIC8vLyBFVkVOVCBJTlRFUkZBQ0UgLy8vXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmVnaXN0ZXIgYW4gY2FsbGJhY2sgb2YgYSBzcGVjaWZpYyBldmVudCB0eXBlIG9uIHRoZSBFdmVudFRhcmdldC5cbiAgICAgKiBUaGlzIHR5cGUgb2YgZXZlbnQgc2hvdWxkIGJlIHRyaWdnZXJlZCB2aWEgYGVtaXRgLlxuICAgICAqICEjemhcbiAgICAgKiDms6jlhozkuovku7bnm67moIfnmoTnibnlrprkuovku7bnsbvlnovlm57osIPjgILov5nnp43nsbvlnovnmoTkuovku7blupTor6XooqsgYGVtaXRgIOinpuWPkeOAglxuICAgICAqXG4gICAgICogQG1ldGhvZCBvblxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gVGhlIHR5cGUgb2YgY29sbGlkZXIgZXZlbnQgY2FuIGJlICd0cmlnZ2VyLWVudGVyJywgJ3RyaWdnZXItc3RheScsICd0cmlnZ2VyLWV4aXQnIG9yICdjb2xsaXNpb24tZW50ZXInLCAnY29sbGlzaW9uLXN0YXknLCAnY29sbGlzaW9uLWV4aXQnLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRoYXQgd2lsbCBiZSBpbnZva2VkIHdoZW4gdGhlIGV2ZW50IGlzIGRpc3BhdGNoZWQuXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgY2FsbGJhY2sgaXMgaWdub3JlZCBpZiBpdCBpcyBhIGR1cGxpY2F0ZSAodGhlIGNhbGxiYWNrcyBhcmUgdW5pcXVlKS5cbiAgICAgKiBAcGFyYW0ge0lUcmlnZ2VyRXZlbnR8SUNvbGxpc2lvbkV2ZW50fSBjYWxsYmFjay5ldmVudCBjYWxsYmFjayBmdW5jdGlvbiBhcmd1bWVudFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbdGFyZ2V0XSAtIFRoZSB0YXJnZXQgKHRoaXMgb2JqZWN0KSB0byBpbnZva2UgdGhlIGNhbGxiYWNrLCBjYW4gYmUgbnVsbFxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSAtIEp1c3QgcmV0dXJucyB0aGUgaW5jb21pbmcgY2FsbGJhY2sgc28geW91IGNhbiBzYXZlIHRoZSBhbm9ueW1vdXMgZnVuY3Rpb24gZWFzaWVyLlxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogb248VCBleHRlbmRzIEZ1bmN0aW9uPih0eXBlOiBzdHJpbmcsIGNhbGxiYWNrOiBULCB0YXJnZXQ/OiBhbnksIHVzZUNhcHR1cmU/OiBib29sZWFuKTogVFxuICAgICAqIEBleGFtcGxlXG4gICAgICogZXZlbnRUYXJnZXQub24oJ2ZpcmUnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgKiAgICAgLy8gZXZlbnQgaXMgSVRyaWdnZXJFdmVudCBvciBJQ29sbGlzaW9uRXZlbnRcbiAgICAgKiB9LCBub2RlKTtcbiAgICAgKi9cbiAgICBwdWJsaWMgb24gKHR5cGU6IFRyaWdnZXJFdmVudFR5cGUgfCBDb2xsaXNpb25FdmVudFR5cGUsIGNhbGxiYWNrOiBUcmlnZ2VyQ2FsbGJhY2sgfCBDb2xsaXNpb25DYWxsYmFjaywgdGFyZ2V0PzogT2JqZWN0LCB1c2VDYXB0dXJlPzogYW55KTogYW55IHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmVtb3ZlcyB0aGUgbGlzdGVuZXJzIHByZXZpb3VzbHkgcmVnaXN0ZXJlZCB3aXRoIHRoZSBzYW1lIHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQgYW5kIG9yIHVzZUNhcHR1cmUsXG4gICAgICogaWYgb25seSB0eXBlIGlzIHBhc3NlZCBhcyBwYXJhbWV0ZXIsIGFsbCBsaXN0ZW5lcnMgcmVnaXN0ZXJlZCB3aXRoIHRoYXQgdHlwZSB3aWxsIGJlIHJlbW92ZWQuXG4gICAgICogISN6aFxuICAgICAqIOWIoOmZpOS5i+WJjeeUqOWQjOexu+Wei++8jOWbnuiwg++8jOebruagh+aIliB1c2VDYXB0dXJlIOazqOWGjOeahOS6i+S7tuebkeWQrOWZqO+8jOWmguaenOWPquS8oOmAkiB0eXBl77yM5bCG5Lya5Yig6ZmkIHR5cGUg57G75Z6L55qE5omA5pyJ5LqL5Lu255uR5ZCs5Zmo44CCXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIG9mZlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gVGhlIHR5cGUgb2YgY29sbGlkZXIgZXZlbnQgY2FuIGJlICd0cmlnZ2VyLWVudGVyJywgJ3RyaWdnZXItc3RheScsICd0cmlnZ2VyLWV4aXQnIG9yICdjb2xsaXNpb24tZW50ZXInLCAnY29sbGlzaW9uLXN0YXknLCAnY29sbGlzaW9uLWV4aXQnLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gLSBUaGUgY2FsbGJhY2sgdG8gcmVtb3ZlLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbdGFyZ2V0XSAtIFRoZSB0YXJnZXQgKHRoaXMgb2JqZWN0KSB0byBpbnZva2UgdGhlIGNhbGxiYWNrLCBpZiBpdCdzIG5vdCBnaXZlbiwgb25seSBjYWxsYmFjayB3aXRob3V0IHRhcmdldCB3aWxsIGJlIHJlbW92ZWRcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIC8vIHJlZ2lzdGVyIGZpcmUgZXZlbnRMaXN0ZW5lclxuICAgICAqIHZhciBjYWxsYmFjayA9IGV2ZW50VGFyZ2V0Lm9uKCdmaXJlJywgZnVuY3Rpb24gKCkge1xuICAgICAqICAgICBjYy5sb2coXCJmaXJlIGluIHRoZSBob2xlXCIpO1xuICAgICAqIH0sIHRhcmdldCk7XG4gICAgICogLy8gcmVtb3ZlIGZpcmUgZXZlbnQgbGlzdGVuZXJcbiAgICAgKiBldmVudFRhcmdldC5vZmYoJ2ZpcmUnLCBjYWxsYmFjaywgdGFyZ2V0KTtcbiAgICAgKiAvLyByZW1vdmUgYWxsIGZpcmUgZXZlbnQgbGlzdGVuZXJzXG4gICAgICogZXZlbnRUYXJnZXQub2ZmKCdmaXJlJyk7XG4gICAgICovXG4gICAgcHVibGljIG9mZiAodHlwZTogVHJpZ2dlckV2ZW50VHlwZSB8IENvbGxpc2lvbkV2ZW50VHlwZSwgY2FsbGJhY2s6IFRyaWdnZXJDYWxsYmFjayB8IENvbGxpc2lvbkNhbGxiYWNrLCB0YXJnZXQ/OiBhbnkpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmVnaXN0ZXIgYW4gY2FsbGJhY2sgb2YgYSBzcGVjaWZpYyBldmVudCB0eXBlIG9uIHRoZSBFdmVudFRhcmdldCxcbiAgICAgKiB0aGUgY2FsbGJhY2sgd2lsbCByZW1vdmUgaXRzZWxmIGFmdGVyIHRoZSBmaXJzdCB0aW1lIGl0IGlzIHRyaWdnZXJlZC5cbiAgICAgKiAhI3poXG4gICAgICog5rOo5YaM5LqL5Lu255uu5qCH55qE54m55a6a5LqL5Lu257G75Z6L5Zue6LCD77yM5Zue6LCD5Lya5Zyo56ys5LiA5pe26Ze06KKr6Kem5Y+R5ZCO5Yig6Zmk6Ieq6Lqr44CCXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIG9uY2VcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIFRoZSB0eXBlIG9mIGNvbGxpZGVyIGV2ZW50IGNhbiBiZSAndHJpZ2dlci1lbnRlcicsICd0cmlnZ2VyLXN0YXknLCAndHJpZ2dlci1leGl0JyBvciAnY29sbGlzaW9uLWVudGVyJywgJ2NvbGxpc2lvbi1zdGF5JywgJ2NvbGxpc2lvbi1leGl0Jy5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0aGF0IHdpbGwgYmUgaW52b2tlZCB3aGVuIHRoZSBldmVudCBpcyBkaXNwYXRjaGVkLlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIGNhbGxiYWNrIGlzIGlnbm9yZWQgaWYgaXQgaXMgYSBkdXBsaWNhdGUgKHRoZSBjYWxsYmFja3MgYXJlIHVuaXF1ZSkuXG4gICAgICogQHBhcmFtIHtJVHJpZ2dlckV2ZW50fElDb2xsaXNpb25FdmVudH0gY2FsbGJhY2suZXZlbnQgY2FsbGJhY2sgZnVuY3Rpb24gYXJndW1lbnQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFt0YXJnZXRdIC0gVGhlIHRhcmdldCAodGhpcyBvYmplY3QpIHRvIGludm9rZSB0aGUgY2FsbGJhY2ssIGNhbiBiZSBudWxsXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBldmVudFRhcmdldC5vbmNlKCdmaXJlJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICogICAgIC8vIGV2ZW50IGlzIElUcmlnZ2VyRXZlbnQgb3IgSUNvbGxpc2lvbkV2ZW50XG4gICAgICogfSwgbm9kZSk7XG4gICAgICovXG4gICAgcHVibGljIG9uY2UgKHR5cGU6IFRyaWdnZXJFdmVudFR5cGUgfCBDb2xsaXNpb25FdmVudFR5cGUsIGNhbGxiYWNrOiBUcmlnZ2VyQ2FsbGJhY2sgfCBDb2xsaXNpb25DYWxsYmFjaywgdGFyZ2V0PzogT2JqZWN0KSB7XG4gICAgfVxuXG4gICAgLyogZGVjbGFyZSBmb3IgdHlwZXNjcmlwdCB0aXAgKi9cbiAgICBwdWJsaWMgZW1pdCAoa2V5OiBUcmlnZ2VyRXZlbnRUeXBlIHwgQ29sbGlzaW9uRXZlbnRUeXBlLCAuLi5hcmdzOiBhbnlbXSk6IHZvaWQge1xuICAgIH1cblxuICAgIC8vLyBDT01QT05FTlQgTElGRUNZQ0xFIC8vL1xuXG4gICAgcHJvdGVjdGVkIF9fcHJlbG9hZCAoKSB7XG4gICAgICAgIGlmICghQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICB0aGlzLl9zaGFwZS5fX3ByZWxvYWQhKHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9uTG9hZCAoKSB7XG4gICAgICAgIGlmICghQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICBpZiAoIUNDX1BIWVNJQ1NfQlVJTFRJTikge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hhcmVkTWF0ZXJpYWwgPSB0aGlzLl9tYXRlcmlhbCA9PSBudWxsID8gY2MuZGlyZWN0b3IuZ2V0UGh5c2ljczNETWFuYWdlcigpLmRlZmF1bHRNYXRlcmlhbCA6IHRoaXMuX21hdGVyaWFsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fc2hhcGUub25Mb2FkISgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9uRW5hYmxlICgpIHtcbiAgICAgICAgaWYgKCFDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHRoaXMuX3NoYXBlLm9uRW5hYmxlISgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9uRGlzYWJsZSAoKSB7XG4gICAgICAgIGlmICghQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICB0aGlzLl9zaGFwZS5vbkRpc2FibGUhKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb25EZXN0cm95ICgpIHtcbiAgICAgICAgaWYgKCFDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHRoaXMuX3NoYXBlLm9uRGVzdHJveSEoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgX3VwZGF0ZU1hdGVyaWFsICgpIHtcbiAgICAgICAgaWYgKCFDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHRoaXMuX3NoYXBlLm1hdGVyaWFsID0gdGhpcy5fbWF0ZXJpYWw7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuY2MuanMubWl4aW4oQ29sbGlkZXIzRC5wcm90b3R5cGUsIGNjLkV2ZW50VGFyZ2V0LnByb3RvdHlwZSk7Il19