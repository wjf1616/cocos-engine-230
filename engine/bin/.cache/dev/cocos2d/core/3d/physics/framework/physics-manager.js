
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/framework/physics-manager.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.Physics3DManager = void 0;

var _instance = require("./instance");

var _physicsMaterial = require("./assets/physics-material");

var _physicsRayResult = require("./physics-ray-result");

var _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _temp;

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

var _cc$_decorator = cc._decorator,
    property = _cc$_decorator.property,
    ccclass = _cc$_decorator.ccclass;
/**
 * !#en
 * Physical systems manager.
 * !#zh
 * 物理系统管理器。
 * @class Physics3DManager
 */

var Physics3DManager = (_dec = ccclass("cc.Physics3DManager"), _dec(_class = (_class2 = (_temp =
/*#__PURE__*/
function () {
  _createClass(Physics3DManager, [{
    key: "enabled",

    /**
     * !#en
     * Gets or sets whether to enable physical systems, which are not enabled by default.
     * !#zh
     * 获取或设置是否启用物理系统，默认不启用。
     * @property {boolean} enabled
     */
    get: function get() {
      return this._enabled;
    },
    set: function set(value) {
      this._enabled = value;
    }
    /**
     * !#en
     * Gets or sets whether the physical system allows automatic sleep, which defaults to true.
     * !#zh
     * 获取或设置物理系统是否允许自动休眠，默认为 true
     * @property {boolean} allowSleep
     */

  }, {
    key: "allowSleep",
    get: function get() {
      return this._allowSleep;
    },
    set: function set(v) {
      this._allowSleep = v;

      if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
        this.physicsWorld.allowSleep = this._allowSleep;
      }
    }
    /**
     * !#en
     * Gets or sets the maximum number of child steps per frame simulated.
     * !#zh
     * 获取或设置每帧模拟的最大子步数。
     * @property {number} maxSubStep
     */

  }, {
    key: "maxSubStep",
    get: function get() {
      return this._maxSubStep;
    },
    set: function set(value) {
      this._maxSubStep = value;
    }
    /**
     * !#en
     * Gets or sets the fixed time consumed by each simulation step.
     * !#zh
     * 获取或设置每步模拟消耗的固定时间。
     * @property {number} deltaTime
     */

  }, {
    key: "deltaTime",
    get: function get() {
      return this._deltaTime;
    },
    set: function set(value) {
      this._deltaTime = value;
    }
    /**
     * !#en
     * Gets or sets whether to use a fixed time step.
     * !#zh
     * 获取或设置是否使用固定的时间步长。
     * @property {boolean} useFixedTime
     */

  }, {
    key: "useFixedTime",
    get: function get() {
      return this._useFixedTime;
    },
    set: function set(value) {
      this._useFixedTime = value;
    }
    /**
     * !#en
     * Gets or sets the gravity value of the physical world, by default (0, -10, 0)
     * !#zh
     * 获取或设置物理世界的重力数值，默认为 (0, -10, 0)
     * @property {Vec3} gravity
     */

  }, {
    key: "gravity",
    get: function get() {
      return this._gravity;
    },
    set: function set(gravity) {
      this._gravity.set(gravity);

      if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
        this.physicsWorld.gravity = gravity;
      }
    }
    /**
     * !#en
     * Gets the global default physical material. Note that builtin is null
     * !#zh
     * 获取全局的默认物理材质，注意：builtin 时为 null
     * @property {PhysicsMaterial | null} defaultMaterial
     * @readonly
     */

  }, {
    key: "defaultMaterial",
    get: function get() {
      return this._material;
    }
  }]);

  function Physics3DManager() {
    this.physicsWorld = void 0;
    this.raycastClosestResult = new _physicsRayResult.PhysicsRayResult();
    this.raycastResults = [];

    _initializerDefineProperty(this, "_enabled", _descriptor, this);

    _initializerDefineProperty(this, "_allowSleep", _descriptor2, this);

    _initializerDefineProperty(this, "_gravity", _descriptor3, this);

    _initializerDefineProperty(this, "_maxSubStep", _descriptor4, this);

    _initializerDefineProperty(this, "_deltaTime", _descriptor5, this);

    _initializerDefineProperty(this, "_useFixedTime", _descriptor6, this);

    this._material = null;
    this.raycastOptions = {
      'groupIndex': -1,
      'queryTrigger': true,
      'maxDistance': Infinity
    };
    this.raycastResultPool = new cc.RecyclePool(function () {
      return new _physicsRayResult.PhysicsRayResult();
    }, 1);
    cc.director._scheduler && cc.director._scheduler.enableForTarget(this);
    this.physicsWorld = (0, _instance.createPhysicsWorld)();

    if (!CC_PHYSICS_BUILTIN) {
      this.gravity = this._gravity;
      this.allowSleep = this._allowSleep;
      this._material = new _physicsMaterial.PhysicsMaterial();
      this._material.friction = 0.1;
      this._material.restitution = 0.1;

      this._material.on('physics_material_update', this._updateMaterial, this);

      this.physicsWorld.defaultMaterial = this._material;
    }
  }
  /**
   * !#en
   * A physical system simulation is performed once and will now be performed automatically once per frame.
   * !#zh
   * 执行一次物理系统的模拟，目前将在每帧自动执行一次。
   * @method update
   * @param {number} deltaTime The time difference from the last execution is currently elapsed per frame
   */


  var _proto = Physics3DManager.prototype;

  _proto.update = function update(deltaTime) {
    if (CC_EDITOR) {
      return;
    }

    if (!this._enabled) {
      return;
    }

    cc.director.emit(cc.Director.EVENT_BEFORE_PHYSICS);

    if (this._useFixedTime) {
      this.physicsWorld.step(this._deltaTime);
    } else {
      this.physicsWorld.step(this._deltaTime, deltaTime, this._maxSubStep);
    }

    cc.director.emit(cc.Director.EVENT_AFTER_PHYSICS);
  }
  /**
   * !#en Detect all collision boxes and return all detected results, or null if none is detected. Note that the return value is taken from the object pool, so do not save the result reference or modify the result.
   * !#zh 检测所有的碰撞盒，并返回所有被检测到的结果，若没有检测到，则返回空值。注意返回值是从对象池中取的，所以请不要保存结果引用或者修改结果。
   * @method raycast
   * @param {Ray} worldRay A ray in world space
   * @param {number|string} groupIndexOrName Collision group index or group name
   * @param {number} maxDistance Maximum detection distance
   * @param {boolean} queryTrigger Detect trigger or not
   * @return {PhysicsRayResult[] | null} Detected result
   */
  ;

  _proto.raycast = function raycast(worldRay, groupIndexOrName, maxDistance, queryTrigger) {
    if (groupIndexOrName === void 0) {
      groupIndexOrName = 0;
    }

    if (maxDistance === void 0) {
      maxDistance = Infinity;
    }

    if (queryTrigger === void 0) {
      queryTrigger = true;
    }

    this.raycastResultPool.reset();
    this.raycastResults.length = 0;

    if (typeof groupIndexOrName == "string") {
      var groupIndex = cc.game.groupList.indexOf(groupIndexOrName);
      if (groupIndex == -1) groupIndex = 0;
      this.raycastOptions.groupIndex = groupIndex;
    } else {
      this.raycastOptions.groupIndex = groupIndexOrName;
    }

    this.raycastOptions.maxDistance = maxDistance;
    this.raycastOptions.queryTrigger = queryTrigger;
    var result = this.physicsWorld.raycast(worldRay, this.raycastOptions, this.raycastResultPool, this.raycastResults);
    if (result) return this.raycastResults;
    return null;
  }
  /**
   * !#en Detect all collision boxes and return the detection result with the shortest ray distance. If not, return null value. Note that the return value is taken from the object pool, so do not save the result reference or modify the result.
   * !#zh 检测所有的碰撞盒，并返回射线距离最短的检测结果，若没有，则返回空值。注意返回值是从对象池中取的，所以请不要保存结果引用或者修改结果。
   * @method raycastClosest
   * @param {Ray} worldRay A ray in world space
   * @param {number|string} groupIndexOrName Collision group index or group name
   * @param {number} maxDistance Maximum detection distance
   * @param {boolean} queryTrigger Detect trigger or not
   * @return {PhysicsRayResult|null} Detected result
   */
  ;

  _proto.raycastClosest = function raycastClosest(worldRay, groupIndexOrName, maxDistance, queryTrigger) {
    if (groupIndexOrName === void 0) {
      groupIndexOrName = 0;
    }

    if (maxDistance === void 0) {
      maxDistance = Infinity;
    }

    if (queryTrigger === void 0) {
      queryTrigger = true;
    }

    if (typeof groupIndexOrName == "string") {
      var groupIndex = cc.game.groupList.indexOf(groupIndexOrName);
      if (groupIndex == -1) groupIndex = 0;
      this.raycastOptions.groupIndex = groupIndex;
    } else {
      this.raycastOptions.groupIndex = groupIndexOrName;
    }

    this.raycastOptions.maxDistance = maxDistance;
    this.raycastOptions.queryTrigger = queryTrigger;
    var result = this.physicsWorld.raycastClosest(worldRay, this.raycastOptions, this.raycastClosestResult);
    if (result) return this.raycastClosestResult;
    return null;
  };

  _proto._updateMaterial = function _updateMaterial() {
    if (!CC_PHYSICS_BUILTIN) {
      this.physicsWorld.defaultMaterial = this._material;
    }
  };

  return Physics3DManager;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_enabled", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_allowSleep", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_gravity", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new cc.Vec3(0, -10, 0);
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_maxSubStep", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_deltaTime", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1.0 / 60.0;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_useFixedTime", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return true;
  }
})), _class2)) || _class);
exports.Physics3DManager = Physics3DManager;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBoeXNpY3MtbWFuYWdlci50cyJdLCJuYW1lcyI6WyJjYyIsIl9kZWNvcmF0b3IiLCJwcm9wZXJ0eSIsImNjY2xhc3MiLCJQaHlzaWNzM0RNYW5hZ2VyIiwiX2VuYWJsZWQiLCJ2YWx1ZSIsIl9hbGxvd1NsZWVwIiwidiIsIkNDX0VESVRPUiIsIkNDX1BIWVNJQ1NfQlVJTFRJTiIsInBoeXNpY3NXb3JsZCIsImFsbG93U2xlZXAiLCJfbWF4U3ViU3RlcCIsIl9kZWx0YVRpbWUiLCJfdXNlRml4ZWRUaW1lIiwiX2dyYXZpdHkiLCJncmF2aXR5Iiwic2V0IiwiX21hdGVyaWFsIiwicmF5Y2FzdENsb3Nlc3RSZXN1bHQiLCJQaHlzaWNzUmF5UmVzdWx0IiwicmF5Y2FzdFJlc3VsdHMiLCJyYXljYXN0T3B0aW9ucyIsIkluZmluaXR5IiwicmF5Y2FzdFJlc3VsdFBvb2wiLCJSZWN5Y2xlUG9vbCIsImRpcmVjdG9yIiwiX3NjaGVkdWxlciIsImVuYWJsZUZvclRhcmdldCIsIlBoeXNpY3NNYXRlcmlhbCIsImZyaWN0aW9uIiwicmVzdGl0dXRpb24iLCJvbiIsIl91cGRhdGVNYXRlcmlhbCIsImRlZmF1bHRNYXRlcmlhbCIsInVwZGF0ZSIsImRlbHRhVGltZSIsImVtaXQiLCJEaXJlY3RvciIsIkVWRU5UX0JFRk9SRV9QSFlTSUNTIiwic3RlcCIsIkVWRU5UX0FGVEVSX1BIWVNJQ1MiLCJyYXljYXN0Iiwid29ybGRSYXkiLCJncm91cEluZGV4T3JOYW1lIiwibWF4RGlzdGFuY2UiLCJxdWVyeVRyaWdnZXIiLCJyZXNldCIsImxlbmd0aCIsImdyb3VwSW5kZXgiLCJnYW1lIiwiZ3JvdXBMaXN0IiwiaW5kZXhPZiIsInJlc3VsdCIsInJheWNhc3RDbG9zZXN0IiwiVmVjMyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7cUJBRThCQSxFQUFFLENBQUNDO0lBQXpCQywwQkFBQUE7SUFBVUMseUJBQUFBO0FB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QUwsQ0FBb0IyQixVQUFwQixHQUFpQ0wsZ0JBQWpDO0FBQ0g7O0FBQ0QsU0FBS3RCLGNBQUwsQ0FBb0J1QixXQUFwQixHQUFrQ0EsV0FBbEM7QUFDQSxTQUFLdkIsY0FBTCxDQUFvQndCLFlBQXBCLEdBQW1DQSxZQUFuQztBQUNBLFFBQUlPLE1BQU0sR0FBRyxLQUFLM0MsWUFBTCxDQUFrQjRDLGNBQWxCLENBQWlDWCxRQUFqQyxFQUEyQyxLQUFLckIsY0FBaEQsRUFBZ0UsS0FBS0gsb0JBQXJFLENBQWI7QUFDQSxRQUFJa0MsTUFBSixFQUFZLE9BQU8sS0FBS2xDLG9CQUFaO0FBQ1osV0FBTyxJQUFQO0FBQ0g7O1NBRU9jLGtCQUFSLDJCQUEyQjtBQUN2QixRQUFJLENBQUN4QixrQkFBTCxFQUF5QjtBQUNyQixXQUFLQyxZQUFMLENBQWtCd0IsZUFBbEIsR0FBb0MsS0FBS2hCLFNBQXpDO0FBQ0g7QUFDSjs7O3NGQS9IQWpCOzs7OztXQUNrQjs7Z0ZBRWxCQTs7Ozs7V0FDcUI7OzZFQUVyQkE7Ozs7O1dBQzJCLElBQUlGLEVBQUUsQ0FBQ3dELElBQVAsQ0FBWSxDQUFaLEVBQWUsQ0FBQyxFQUFoQixFQUFvQixDQUFwQjs7Z0ZBRTNCdEQ7Ozs7O1dBQ3FCOzsrRUFFckJBOzs7OztXQUNvQixNQUFNOztrRkFFMUJBOzs7OztXQUN1QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE5IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgeyBJUGh5c2ljc1dvcmxkLCBJUmF5Y2FzdE9wdGlvbnMgfSBmcm9tICcuLi9zcGVjL2ktcGh5c2ljcy13b3JsZCc7XG5pbXBvcnQgeyBjcmVhdGVQaHlzaWNzV29ybGQgfSBmcm9tICcuL2luc3RhbmNlJztcbmltcG9ydCB7IFBoeXNpY3NNYXRlcmlhbCB9IGZyb20gJy4vYXNzZXRzL3BoeXNpY3MtbWF0ZXJpYWwnO1xuaW1wb3J0IHsgUGh5c2ljc1JheVJlc3VsdCB9IGZyb20gJy4vcGh5c2ljcy1yYXktcmVzdWx0JztcblxuY29uc3QgeyBwcm9wZXJ0eSwgY2NjbGFzcyB9ID0gY2MuX2RlY29yYXRvcjtcblxuLyoqXG4gKiAhI2VuXG4gKiBQaHlzaWNhbCBzeXN0ZW1zIG1hbmFnZXIuXG4gKiAhI3poXG4gKiDniannkIbns7vnu5/nrqHnkIblmajjgIJcbiAqIEBjbGFzcyBQaHlzaWNzM0RNYW5hZ2VyXG4gKi9cbkBjY2NsYXNzKFwiY2MuUGh5c2ljczNETWFuYWdlclwiKVxuZXhwb3J0IGNsYXNzIFBoeXNpY3MzRE1hbmFnZXIge1xuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldHMgb3Igc2V0cyB3aGV0aGVyIHRvIGVuYWJsZSBwaHlzaWNhbCBzeXN0ZW1zLCB3aGljaCBhcmUgbm90IGVuYWJsZWQgYnkgZGVmYXVsdC5cbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W5oiW6K6+572u5piv5ZCm5ZCv55So54mp55CG57O757uf77yM6buY6K6k5LiN5ZCv55So44CCXG4gICAgICogQHByb3BlcnR5IHtib29sZWFufSBlbmFibGVkXG4gICAgICovXG4gICAgZ2V0IGVuYWJsZWQgKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fZW5hYmxlZDtcbiAgICB9XG4gICAgc2V0IGVuYWJsZWQgKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2VuYWJsZWQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogR2V0cyBvciBzZXRzIHdoZXRoZXIgdGhlIHBoeXNpY2FsIHN5c3RlbSBhbGxvd3MgYXV0b21hdGljIHNsZWVwLCB3aGljaCBkZWZhdWx0cyB0byB0cnVlLlxuICAgICAqICEjemhcbiAgICAgKiDojrflj5bmiJborr7nva7niannkIbns7vnu5/mmK/lkKblhYHorrjoh6rliqjkvJHnnKDvvIzpu5jorqTkuLogdHJ1ZVxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gYWxsb3dTbGVlcFxuICAgICAqL1xuICAgIGdldCBhbGxvd1NsZWVwICgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FsbG93U2xlZXA7XG4gICAgfVxuICAgIHNldCBhbGxvd1NsZWVwICh2OiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2FsbG93U2xlZXAgPSB2O1xuICAgICAgICBpZiAoIUNDX0VESVRPUiAmJiAhQ0NfUEhZU0lDU19CVUlMVElOKSB7XG4gICAgICAgICAgICB0aGlzLnBoeXNpY3NXb3JsZC5hbGxvd1NsZWVwID0gdGhpcy5fYWxsb3dTbGVlcDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXRzIG9yIHNldHMgdGhlIG1heGltdW0gbnVtYmVyIG9mIGNoaWxkIHN0ZXBzIHBlciBmcmFtZSBzaW11bGF0ZWQuXG4gICAgICogISN6aFxuICAgICAqIOiOt+WPluaIluiuvue9ruavj+W4p+aooeaLn+eahOacgOWkp+WtkOatpeaVsOOAglxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtYXhTdWJTdGVwXG4gICAgICovXG4gICAgZ2V0IG1heFN1YlN0ZXAgKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXhTdWJTdGVwO1xuICAgIH1cbiAgICBzZXQgbWF4U3ViU3RlcCAodmFsdWU6IG51bWJlcikge1xuICAgICAgICB0aGlzLl9tYXhTdWJTdGVwID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldHMgb3Igc2V0cyB0aGUgZml4ZWQgdGltZSBjb25zdW1lZCBieSBlYWNoIHNpbXVsYXRpb24gc3RlcC5cbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W5oiW6K6+572u5q+P5q2l5qih5ouf5raI6ICX55qE5Zu65a6a5pe26Ze044CCXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGRlbHRhVGltZVxuICAgICAqL1xuICAgIGdldCBkZWx0YVRpbWUgKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWx0YVRpbWU7XG4gICAgfVxuICAgIHNldCBkZWx0YVRpbWUgKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fZGVsdGFUaW1lID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldHMgb3Igc2V0cyB3aGV0aGVyIHRvIHVzZSBhIGZpeGVkIHRpbWUgc3RlcC5cbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W5oiW6K6+572u5piv5ZCm5L2/55So5Zu65a6a55qE5pe26Ze05q2l6ZW/44CCXG4gICAgICogQHByb3BlcnR5IHtib29sZWFufSB1c2VGaXhlZFRpbWVcbiAgICAgKi9cbiAgICBnZXQgdXNlRml4ZWRUaW1lICgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VzZUZpeGVkVGltZTtcbiAgICB9XG4gICAgc2V0IHVzZUZpeGVkVGltZSAodmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fdXNlRml4ZWRUaW1lID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldHMgb3Igc2V0cyB0aGUgZ3Jhdml0eSB2YWx1ZSBvZiB0aGUgcGh5c2ljYWwgd29ybGQsIGJ5IGRlZmF1bHQgKDAsIC0xMCwgMClcbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W5oiW6K6+572u54mp55CG5LiW55WM55qE6YeN5Yqb5pWw5YC877yM6buY6K6k5Li6ICgwLCAtMTAsIDApXG4gICAgICogQHByb3BlcnR5IHtWZWMzfSBncmF2aXR5XG4gICAgICovXG4gICAgZ2V0IGdyYXZpdHkgKCk6IGNjLlZlYzMge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ3Jhdml0eTtcbiAgICB9XG4gICAgc2V0IGdyYXZpdHkgKGdyYXZpdHk6IGNjLlZlYzMpIHtcbiAgICAgICAgdGhpcy5fZ3Jhdml0eS5zZXQoZ3Jhdml0eSk7XG4gICAgICAgIGlmICghQ0NfRURJVE9SICYmICFDQ19QSFlTSUNTX0JVSUxUSU4pIHtcbiAgICAgICAgICAgIHRoaXMucGh5c2ljc1dvcmxkLmdyYXZpdHkgPSBncmF2aXR5O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldHMgdGhlIGdsb2JhbCBkZWZhdWx0IHBoeXNpY2FsIG1hdGVyaWFsLiBOb3RlIHRoYXQgYnVpbHRpbiBpcyBudWxsXG4gICAgICogISN6aFxuICAgICAqIOiOt+WPluWFqOWxgOeahOm7mOiupOeJqeeQhuadkOi0qO+8jOazqOaEj++8mmJ1aWx0aW4g5pe25Li6IG51bGxcbiAgICAgKiBAcHJvcGVydHkge1BoeXNpY3NNYXRlcmlhbCB8IG51bGx9IGRlZmF1bHRNYXRlcmlhbFxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGdldCBkZWZhdWx0TWF0ZXJpYWwgKCk6IFBoeXNpY3NNYXRlcmlhbCB8IG51bGwge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWF0ZXJpYWw7XG4gICAgfVxuXG4gICAgcmVhZG9ubHkgcGh5c2ljc1dvcmxkOiBJUGh5c2ljc1dvcmxkO1xuICAgIHJlYWRvbmx5IHJheWNhc3RDbG9zZXN0UmVzdWx0ID0gbmV3IFBoeXNpY3NSYXlSZXN1bHQoKTtcbiAgICByZWFkb25seSByYXljYXN0UmVzdWx0czogUGh5c2ljc1JheVJlc3VsdFtdID0gW107XG5cbiAgICBAcHJvcGVydHlcbiAgICBwcml2YXRlIF9lbmFibGVkID0gZmFsc2U7XG5cbiAgICBAcHJvcGVydHlcbiAgICBwcml2YXRlIF9hbGxvd1NsZWVwID0gdHJ1ZTtcblxuICAgIEBwcm9wZXJ0eVxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2dyYXZpdHkgPSBuZXcgY2MuVmVjMygwLCAtMTAsIDApO1xuXG4gICAgQHByb3BlcnR5XG4gICAgcHJpdmF0ZSBfbWF4U3ViU3RlcCA9IDE7XG5cbiAgICBAcHJvcGVydHlcbiAgICBwcml2YXRlIF9kZWx0YVRpbWUgPSAxLjAgLyA2MC4wO1xuXG4gICAgQHByb3BlcnR5XG4gICAgcHJpdmF0ZSBfdXNlRml4ZWRUaW1lID0gdHJ1ZTtcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgX21hdGVyaWFsOiBjYy5QaHlzaWNzTWF0ZXJpYWwgfCBudWxsID0gbnVsbDtcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgcmF5Y2FzdE9wdGlvbnM6IElSYXljYXN0T3B0aW9ucyA9IHtcbiAgICAgICAgJ2dyb3VwSW5kZXgnOiAtMSxcbiAgICAgICAgJ3F1ZXJ5VHJpZ2dlcic6IHRydWUsXG4gICAgICAgICdtYXhEaXN0YW5jZSc6IEluZmluaXR5XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZWFkb25seSByYXljYXN0UmVzdWx0UG9vbCA9IG5ldyBjYy5SZWN5Y2xlUG9vbCgoKSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUGh5c2ljc1JheVJlc3VsdCgpO1xuICAgIH0sIDEpO1xuXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLl9zY2hlZHVsZXIgJiYgY2MuZGlyZWN0b3IuX3NjaGVkdWxlci5lbmFibGVGb3JUYXJnZXQodGhpcyk7XG4gICAgICAgIHRoaXMucGh5c2ljc1dvcmxkID0gY3JlYXRlUGh5c2ljc1dvcmxkKCk7XG4gICAgICAgIGlmICghQ0NfUEhZU0lDU19CVUlMVElOKSB7XG4gICAgICAgICAgICB0aGlzLmdyYXZpdHkgPSB0aGlzLl9ncmF2aXR5O1xuICAgICAgICAgICAgdGhpcy5hbGxvd1NsZWVwID0gdGhpcy5fYWxsb3dTbGVlcDtcbiAgICAgICAgICAgIHRoaXMuX21hdGVyaWFsID0gbmV3IFBoeXNpY3NNYXRlcmlhbCgpO1xuICAgICAgICAgICAgdGhpcy5fbWF0ZXJpYWwuZnJpY3Rpb24gPSAwLjE7XG4gICAgICAgICAgICB0aGlzLl9tYXRlcmlhbC5yZXN0aXR1dGlvbiA9IDAuMTtcbiAgICAgICAgICAgIHRoaXMuX21hdGVyaWFsLm9uKCdwaHlzaWNzX21hdGVyaWFsX3VwZGF0ZScsIHRoaXMuX3VwZGF0ZU1hdGVyaWFsLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucGh5c2ljc1dvcmxkLmRlZmF1bHRNYXRlcmlhbCA9IHRoaXMuX21hdGVyaWFsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEEgcGh5c2ljYWwgc3lzdGVtIHNpbXVsYXRpb24gaXMgcGVyZm9ybWVkIG9uY2UgYW5kIHdpbGwgbm93IGJlIHBlcmZvcm1lZCBhdXRvbWF0aWNhbGx5IG9uY2UgcGVyIGZyYW1lLlxuICAgICAqICEjemhcbiAgICAgKiDmiafooYzkuIDmrKHniannkIbns7vnu5/nmoTmqKHmi5/vvIznm67liY3lsIblnKjmr4/luKfoh6rliqjmiafooYzkuIDmrKHjgIJcbiAgICAgKiBAbWV0aG9kIHVwZGF0ZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkZWx0YVRpbWUgVGhlIHRpbWUgZGlmZmVyZW5jZSBmcm9tIHRoZSBsYXN0IGV4ZWN1dGlvbiBpcyBjdXJyZW50bHkgZWxhcHNlZCBwZXIgZnJhbWVcbiAgICAgKi9cbiAgICB1cGRhdGUgKGRlbHRhVGltZTogbnVtYmVyKSB7XG4gICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX2VuYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoY2MuRGlyZWN0b3IuRVZFTlRfQkVGT1JFX1BIWVNJQ1MpO1xuXG4gICAgICAgIGlmICh0aGlzLl91c2VGaXhlZFRpbWUpIHtcbiAgICAgICAgICAgIHRoaXMucGh5c2ljc1dvcmxkLnN0ZXAodGhpcy5fZGVsdGFUaW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGh5c2ljc1dvcmxkLnN0ZXAodGhpcy5fZGVsdGFUaW1lLCBkZWx0YVRpbWUsIHRoaXMuX21heFN1YlN0ZXApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChjYy5EaXJlY3Rvci5FVkVOVF9BRlRFUl9QSFlTSUNTKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIERldGVjdCBhbGwgY29sbGlzaW9uIGJveGVzIGFuZCByZXR1cm4gYWxsIGRldGVjdGVkIHJlc3VsdHMsIG9yIG51bGwgaWYgbm9uZSBpcyBkZXRlY3RlZC4gTm90ZSB0aGF0IHRoZSByZXR1cm4gdmFsdWUgaXMgdGFrZW4gZnJvbSB0aGUgb2JqZWN0IHBvb2wsIHNvIGRvIG5vdCBzYXZlIHRoZSByZXN1bHQgcmVmZXJlbmNlIG9yIG1vZGlmeSB0aGUgcmVzdWx0LlxuICAgICAqICEjemgg5qOA5rWL5omA5pyJ55qE56Kw5pKe55uS77yM5bm26L+U5Zue5omA5pyJ6KKr5qOA5rWL5Yiw55qE57uT5p6c77yM6Iul5rKh5pyJ5qOA5rWL5Yiw77yM5YiZ6L+U5Zue56m65YC844CC5rOo5oSP6L+U5Zue5YC85piv5LuO5a+56LGh5rGg5Lit5Y+W55qE77yM5omA5Lul6K+35LiN6KaB5L+d5a2Y57uT5p6c5byV55So5oiW6ICF5L+u5pS557uT5p6c44CCXG4gICAgICogQG1ldGhvZCByYXljYXN0XG4gICAgICogQHBhcmFtIHtSYXl9IHdvcmxkUmF5IEEgcmF5IGluIHdvcmxkIHNwYWNlXG4gICAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfSBncm91cEluZGV4T3JOYW1lIENvbGxpc2lvbiBncm91cCBpbmRleCBvciBncm91cCBuYW1lXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1heERpc3RhbmNlIE1heGltdW0gZGV0ZWN0aW9uIGRpc3RhbmNlXG4gICAgICogQHBhcmFtIHtib29sZWFufSBxdWVyeVRyaWdnZXIgRGV0ZWN0IHRyaWdnZXIgb3Igbm90XG4gICAgICogQHJldHVybiB7UGh5c2ljc1JheVJlc3VsdFtdIHwgbnVsbH0gRGV0ZWN0ZWQgcmVzdWx0XG4gICAgICovXG4gICAgcmF5Y2FzdCAod29ybGRSYXk6IGNjLmdlb21VdGlscy5SYXksIGdyb3VwSW5kZXhPck5hbWU6IG51bWJlcnxzdHJpbmcgPSAwLCBtYXhEaXN0YW5jZSA9IEluZmluaXR5LCBxdWVyeVRyaWdnZXIgPSB0cnVlKTogUGh5c2ljc1JheVJlc3VsdFtdIHwgbnVsbCB7XG4gICAgICAgIHRoaXMucmF5Y2FzdFJlc3VsdFBvb2wucmVzZXQoKTtcbiAgICAgICAgdGhpcy5yYXljYXN0UmVzdWx0cy5sZW5ndGggPSAwO1xuICAgICAgICBpZiAodHlwZW9mIGdyb3VwSW5kZXhPck5hbWUgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgbGV0IGdyb3VwSW5kZXggPSBjYy5nYW1lLmdyb3VwTGlzdC5pbmRleE9mKGdyb3VwSW5kZXhPck5hbWUpO1xuICAgICAgICAgICAgaWYgKGdyb3VwSW5kZXggPT0gLTEpIGdyb3VwSW5kZXggPSAwO1xuICAgICAgICAgICAgdGhpcy5yYXljYXN0T3B0aW9ucy5ncm91cEluZGV4ID0gZ3JvdXBJbmRleDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmF5Y2FzdE9wdGlvbnMuZ3JvdXBJbmRleCA9IGdyb3VwSW5kZXhPck5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yYXljYXN0T3B0aW9ucy5tYXhEaXN0YW5jZSA9IG1heERpc3RhbmNlO1xuICAgICAgICB0aGlzLnJheWNhc3RPcHRpb25zLnF1ZXJ5VHJpZ2dlciA9IHF1ZXJ5VHJpZ2dlcjtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHRoaXMucGh5c2ljc1dvcmxkLnJheWNhc3Qod29ybGRSYXksIHRoaXMucmF5Y2FzdE9wdGlvbnMsIHRoaXMucmF5Y2FzdFJlc3VsdFBvb2wsIHRoaXMucmF5Y2FzdFJlc3VsdHMpO1xuICAgICAgICBpZiAocmVzdWx0KSByZXR1cm4gdGhpcy5yYXljYXN0UmVzdWx0cztcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBEZXRlY3QgYWxsIGNvbGxpc2lvbiBib3hlcyBhbmQgcmV0dXJuIHRoZSBkZXRlY3Rpb24gcmVzdWx0IHdpdGggdGhlIHNob3J0ZXN0IHJheSBkaXN0YW5jZS4gSWYgbm90LCByZXR1cm4gbnVsbCB2YWx1ZS4gTm90ZSB0aGF0IHRoZSByZXR1cm4gdmFsdWUgaXMgdGFrZW4gZnJvbSB0aGUgb2JqZWN0IHBvb2wsIHNvIGRvIG5vdCBzYXZlIHRoZSByZXN1bHQgcmVmZXJlbmNlIG9yIG1vZGlmeSB0aGUgcmVzdWx0LlxuICAgICAqICEjemgg5qOA5rWL5omA5pyJ55qE56Kw5pKe55uS77yM5bm26L+U5Zue5bCE57q/6Led56a75pyA55+t55qE5qOA5rWL57uT5p6c77yM6Iul5rKh5pyJ77yM5YiZ6L+U5Zue56m65YC844CC5rOo5oSP6L+U5Zue5YC85piv5LuO5a+56LGh5rGg5Lit5Y+W55qE77yM5omA5Lul6K+35LiN6KaB5L+d5a2Y57uT5p6c5byV55So5oiW6ICF5L+u5pS557uT5p6c44CCXG4gICAgICogQG1ldGhvZCByYXljYXN0Q2xvc2VzdFxuICAgICAqIEBwYXJhbSB7UmF5fSB3b3JsZFJheSBBIHJheSBpbiB3b3JsZCBzcGFjZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfHN0cmluZ30gZ3JvdXBJbmRleE9yTmFtZSBDb2xsaXNpb24gZ3JvdXAgaW5kZXggb3IgZ3JvdXAgbmFtZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtYXhEaXN0YW5jZSBNYXhpbXVtIGRldGVjdGlvbiBkaXN0YW5jZVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gcXVlcnlUcmlnZ2VyIERldGVjdCB0cmlnZ2VyIG9yIG5vdFxuICAgICAqIEByZXR1cm4ge1BoeXNpY3NSYXlSZXN1bHR8bnVsbH0gRGV0ZWN0ZWQgcmVzdWx0XG4gICAgICovXG4gICAgcmF5Y2FzdENsb3Nlc3QgKHdvcmxkUmF5OiBjYy5nZW9tVXRpbHMuUmF5LCBncm91cEluZGV4T3JOYW1lOiBudW1iZXJ8c3RyaW5nID0gMCwgbWF4RGlzdGFuY2UgPSBJbmZpbml0eSwgcXVlcnlUcmlnZ2VyID0gdHJ1ZSk6IFBoeXNpY3NSYXlSZXN1bHR8bnVsbCB7XG4gICAgICAgIGlmICh0eXBlb2YgZ3JvdXBJbmRleE9yTmFtZSA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBsZXQgZ3JvdXBJbmRleCA9IGNjLmdhbWUuZ3JvdXBMaXN0LmluZGV4T2YoZ3JvdXBJbmRleE9yTmFtZSk7XG4gICAgICAgICAgICBpZiAoZ3JvdXBJbmRleCA9PSAtMSkgZ3JvdXBJbmRleCA9IDA7XG4gICAgICAgICAgICB0aGlzLnJheWNhc3RPcHRpb25zLmdyb3VwSW5kZXggPSBncm91cEluZGV4O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yYXljYXN0T3B0aW9ucy5ncm91cEluZGV4ID0gZ3JvdXBJbmRleE9yTmFtZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJheWNhc3RPcHRpb25zLm1heERpc3RhbmNlID0gbWF4RGlzdGFuY2U7XG4gICAgICAgIHRoaXMucmF5Y2FzdE9wdGlvbnMucXVlcnlUcmlnZ2VyID0gcXVlcnlUcmlnZ2VyO1xuICAgICAgICBsZXQgcmVzdWx0ID0gdGhpcy5waHlzaWNzV29ybGQucmF5Y2FzdENsb3Nlc3Qod29ybGRSYXksIHRoaXMucmF5Y2FzdE9wdGlvbnMsIHRoaXMucmF5Y2FzdENsb3Nlc3RSZXN1bHQpO1xuICAgICAgICBpZiAocmVzdWx0KSByZXR1cm4gdGhpcy5yYXljYXN0Q2xvc2VzdFJlc3VsdDtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfdXBkYXRlTWF0ZXJpYWwgKCkge1xuICAgICAgICBpZiAoIUNDX1BIWVNJQ1NfQlVJTFRJTikge1xuICAgICAgICAgICAgdGhpcy5waHlzaWNzV29ybGQuZGVmYXVsdE1hdGVyaWFsID0gdGhpcy5fbWF0ZXJpYWw7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=