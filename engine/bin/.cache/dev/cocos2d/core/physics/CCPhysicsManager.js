
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/physics/CCPhysicsManager.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
var PhysicsTypes = require('./CCPhysicsTypes');

var ContactType = PhysicsTypes.ContactType;
var BodyType = PhysicsTypes.BodyType;
var RayCastType = PhysicsTypes.RayCastType;
var DrawBits = PhysicsTypes.DrawBits;
var PTM_RATIO = PhysicsTypes.PTM_RATIO;
var ANGLE_TO_PHYSICS_ANGLE = PhysicsTypes.ANGLE_TO_PHYSICS_ANGLE;
var PHYSICS_ANGLE_TO_ANGLE = PhysicsTypes.PHYSICS_ANGLE_TO_ANGLE;

var convertToNodeRotation = require('./utils').convertToNodeRotation;

var DebugDraw = require('./platform/CCPhysicsDebugDraw');

var b2_aabb_tmp = new b2.AABB();
var b2_vec2_tmp1 = new b2.Vec2();
var b2_vec2_tmp2 = new b2.Vec2();
var vec2_tmp = cc.v2();
/**
 * !#en
 * Physics manager uses box2d as the inner physics system, and hide most box2d implement details(creating rigidbody, synchronize rigidbody info to node).
 * You can visit some common box2d function through physics manager(hit testing, raycast, debug info).
 * Physics manager distributes the collision information to each collision callback when collision is produced.
 * Note: You need first enable the collision listener in the rigidbody.
 * !#zh
 * 物理系统将 box2d 作为内部物理系统，并且隐藏了大部分 box2d 实现细节（比如创建刚体，同步刚体信息到节点中等）。
 * 你可以通过物理系统访问一些 box2d 常用的功能，比如点击测试，射线测试，设置测试信息等。
 * 物理系统还管理碰撞信息的分发，她会在产生碰撞时，将碰撞信息分发到各个碰撞回调中。
 * 注意：你需要先在刚体中开启碰撞接听才会产生相应的碰撞回调。<br>
 * 支持的物理系统指定绘制信息事件，请参阅 {{#crossLink "PhysicsManager.DrawBits"}}{{/crossLink}}
 * @class PhysicsManager
 * @uses EventTarget
 */

var PhysicsManager = cc.Class({
  mixins: [cc.EventTarget],
  statics: {
    DrawBits: DrawBits,

    /**
     * !#en
     * The ratio transform between physics unit and pixel unit, generally is 32.
     * !#zh
     * 物理单位与像素单位互相转换的比率，一般是 32。
     * @property {Number} PTM_RATIO
     * @static
     */
    PTM_RATIO: PTM_RATIO,

    /**
     * !#en
     * The velocity iterations for the velocity constraint solver.
     * !#zh
     * 速度更新迭代数
     * @property {Number} VELOCITY_ITERATIONS
     * @default 10
     * @static
     */
    VELOCITY_ITERATIONS: 10,

    /**
     * !#en
     * The position Iterations for the position constraint solver.
     * !#zh
     * 位置迭代更新数
     * @property {Number} POSITION_ITERATIONS
     * @default 10
     * @static
     */
    POSITION_ITERATIONS: 10,

    /**
     * !#en
     * Specify the fixed time step.
     * Need enabledAccumulator to make it work.
     * !#zh
     * 指定固定的物理更新间隔时间，需要开启 enabledAccumulator 才有效。
     * @property {Number} FIXED_TIME_STEP
     * @default 1/60
     * @static
     */
    FIXED_TIME_STEP: 1 / 60,

    /**
     * !#en
     * Specify the max accumulator time.
     * Need enabledAccumulator to make it work.
     * !#zh
     * 每次可用于更新物理系统的最大时间，需要开启 enabledAccumulator 才有效。
     * @property {Number} MAX_ACCUMULATOR
     * @default 1/5
     * @static
     */
    MAX_ACCUMULATOR: 1 / 5
  },
  ctor: function ctor() {
    this._debugDrawFlags = 0;
    this._debugDrawer = null;
    this._world = null;
    this._bodies = [];
    this._joints = [];
    this._contactMap = {};
    this._contactID = 0;
    this._delayEvents = [];
    this._accumulator = 0;
    cc.director._scheduler && cc.director._scheduler.enableForTarget(this);
    /**
     * !#en
     * If enabled accumulator, then will call step function with the fixed time step FIXED_TIME_STEP. 
     * And if the update dt is bigger than the time step, then will call step function several times.
     * If disabled accumulator, then will call step function with a time step calculated with the frame rate.
     * !#zh
     * 如果开启此选项，那么将会以固定的间隔时间 FIXED_TIME_STEP 来更新物理引擎，如果一个 update 的间隔时间大于 FIXED_TIME_STEP，则会对物理引擎进行多次更新。
     * 如果关闭此选项，那么将会根据设定的 frame rate 计算出一个间隔时间来更新物理引擎。
     * @property {Boolean} enabledAccumulator
     * @default false
     */

    this.enabledAccumulator = false;
  },
  pushDelayEvent: function pushDelayEvent(target, func, args) {
    if (this._steping) {
      this._delayEvents.push({
        target: target,
        func: func,
        args: args
      });
    } else {
      target[func].apply(target, args);
    }
  },
  update: function update(dt) {
    var world = this._world;
    if (!world || !this.enabled) return;
    this.emit('before-step');
    this._steping = true;
    var velocityIterations = PhysicsManager.VELOCITY_ITERATIONS;
    var positionIterations = PhysicsManager.POSITION_ITERATIONS;

    if (this.enabledAccumulator) {
      this._accumulator += dt;
      var FIXED_TIME_STEP = PhysicsManager.FIXED_TIME_STEP;
      var MAX_ACCUMULATOR = PhysicsManager.MAX_ACCUMULATOR; // max accumulator time to avoid spiral of death

      if (this._accumulator > MAX_ACCUMULATOR) {
        this._accumulator = MAX_ACCUMULATOR;
      }

      while (this._accumulator > FIXED_TIME_STEP) {
        world.Step(FIXED_TIME_STEP, velocityIterations, positionIterations);
        this._accumulator -= FIXED_TIME_STEP;
      }
    } else {
      var timeStep = 1 / cc.game.config['frameRate'];
      world.Step(timeStep, velocityIterations, positionIterations);
    }

    if (this.debugDrawFlags) {
      this._checkDebugDrawValid();

      this._debugDrawer.clear();

      world.DrawDebugData();
    }

    this._steping = false;
    var events = this._delayEvents;

    for (var i = 0, l = events.length; i < l; i++) {
      var event = events[i];
      event.target[event.func].apply(event.target, event.args);
    }

    events.length = 0;

    this._syncNode();
  },

  /**
   * !#en
   * Test which collider contains the given world point
   * !#zh
   * 获取包含给定世界坐标系点的碰撞体
   * @method testPoint
   * @param {Vec2} point - the world point
   * @return {PhysicsCollider}
   */
  testPoint: function testPoint(point) {
    var x = b2_vec2_tmp1.x = point.x / PTM_RATIO;
    var y = b2_vec2_tmp1.y = point.y / PTM_RATIO;
    var d = 0.2 / PTM_RATIO;
    b2_aabb_tmp.lowerBound.x = x - d;
    b2_aabb_tmp.lowerBound.y = y - d;
    b2_aabb_tmp.upperBound.x = x + d;
    b2_aabb_tmp.upperBound.y = y + d;
    var callback = this._aabbQueryCallback;
    callback.init(b2_vec2_tmp1);

    this._world.QueryAABB(callback, b2_aabb_tmp);

    var fixture = callback.getFixture();

    if (fixture) {
      return fixture.collider;
    }

    return null;
  },

  /**
   * !#en
   * Test which colliders intersect the given world rect
   * !#zh
   * 获取与给定世界坐标系矩形相交的碰撞体
   * @method testAABB
   * @param {Rect} rect - the world rect
   * @return {[PhysicsCollider]}
   */
  testAABB: function testAABB(rect) {
    b2_aabb_tmp.lowerBound.x = rect.xMin / PTM_RATIO;
    b2_aabb_tmp.lowerBound.y = rect.yMin / PTM_RATIO;
    b2_aabb_tmp.upperBound.x = rect.xMax / PTM_RATIO;
    b2_aabb_tmp.upperBound.y = rect.yMax / PTM_RATIO;
    var callback = this._aabbQueryCallback;
    callback.init();

    this._world.QueryAABB(callback, b2_aabb_tmp);

    var fixtures = callback.getFixtures();
    var colliders = fixtures.map(function (fixture) {
      return fixture.collider;
    });
    return colliders;
  },

  /**
   * !#en
   * Raycast the world for all colliders in the path of the ray.
   * The raycast ignores colliders that contain the starting point.
   * !#zh
   * 检测哪些碰撞体在给定射线的路径上，射线检测将忽略包含起始点的碰撞体。
   * @method rayCast
   * @param {Vec2} p1 - start point of the raycast
   * @param {Vec2} p2 - end point of the raycast
   * @param {RayCastType} type - optional, default is RayCastType.Closest
   * @return {[PhysicsRayCastResult]}
   */
  rayCast: function rayCast(p1, p2, type) {
    if (p1.equals(p2)) {
      return [];
    }

    type = type || RayCastType.Closest;
    b2_vec2_tmp1.x = p1.x / PTM_RATIO;
    b2_vec2_tmp1.y = p1.y / PTM_RATIO;
    b2_vec2_tmp2.x = p2.x / PTM_RATIO;
    b2_vec2_tmp2.y = p2.y / PTM_RATIO;
    var callback = this._raycastQueryCallback;
    callback.init(type);

    this._world.RayCast(callback, b2_vec2_tmp1, b2_vec2_tmp2);

    var fixtures = callback.getFixtures();

    if (fixtures.length > 0) {
      var points = callback.getPoints();
      var normals = callback.getNormals();
      var fractions = callback.getFractions();
      var results = [];

      for (var i = 0, l = fixtures.length; i < l; i++) {
        var fixture = fixtures[i];
        var collider = fixture.collider;

        if (type === RayCastType.AllClosest) {
          var result = results.find(function (result) {
            return result.collider === collider;
          });

          if (result) {
            if (fractions[i] < result.fraction) {
              result.fixtureIndex = collider._getFixtureIndex(fixture);
              result.point.x = points[i].x * PTM_RATIO;
              result.point.y = points[i].y * PTM_RATIO;
              result.normal.x = normals[i].x;
              result.normal.y = normals[i].y;
              result.fraction = fractions[i];
            }

            continue;
          }
        }

        results.push({
          collider: collider,
          fixtureIndex: collider._getFixtureIndex(fixture),
          point: cc.v2(points[i].x * PTM_RATIO, points[i].y * PTM_RATIO),
          normal: cc.v2(normals[i]),
          fraction: fractions[i]
        });
      }

      return results;
    }

    return [];
  },
  syncPosition: function syncPosition() {
    var bodies = this._bodies;

    for (var i = 0; i < bodies.length; i++) {
      bodies[i].syncPosition();
    }
  },
  syncRotation: function syncRotation() {
    var bodies = this._bodies;

    for (var i = 0; i < bodies.length; i++) {
      bodies[i].syncRotation();
    }
  },
  _registerContactFixture: function _registerContactFixture(fixture) {
    this._contactListener.registerContactFixture(fixture);
  },
  _unregisterContactFixture: function _unregisterContactFixture(fixture) {
    this._contactListener.unregisterContactFixture(fixture);
  },
  _addBody: function _addBody(body, bodyDef) {
    var world = this._world;
    var node = body.node;
    if (!world || !node) return;
    body._b2Body = world.CreateBody(bodyDef);
    body._b2Body.body = body;

    this._bodies.push(body);
  },
  _removeBody: function _removeBody(body) {
    var world = this._world;
    if (!world) return;
    body._b2Body.body = null;
    world.DestroyBody(body._b2Body);
    body._b2Body = null;
    cc.js.array.remove(this._bodies, body);
  },
  _addJoint: function _addJoint(joint, jointDef) {
    var b2joint = this._world.CreateJoint(jointDef);

    if (!b2joint) return;
    b2joint._joint = joint;
    joint._joint = b2joint;

    this._joints.push(joint);
  },
  _removeJoint: function _removeJoint(joint) {
    if (joint._isValid()) {
      this._world.DestroyJoint(joint._joint);
    }

    if (joint._joint) {
      joint._joint._joint = null;
    }

    cc.js.array.remove(this._joints, joint);
  },
  _initCallback: function _initCallback() {
    if (!this._world) {
      cc.warn('Please init PhysicsManager first');
      return;
    }

    if (this._contactListener) return;
    var listener = new cc.PhysicsContactListener();
    listener.setBeginContact(this._onBeginContact);
    listener.setEndContact(this._onEndContact);
    listener.setPreSolve(this._onPreSolve);
    listener.setPostSolve(this._onPostSolve);

    this._world.SetContactListener(listener);

    this._contactListener = listener;
    this._aabbQueryCallback = new cc.PhysicsAABBQueryCallback();
    this._raycastQueryCallback = new cc.PhysicsRayCastCallback();
  },
  _init: function _init() {
    this.enabled = true;
    this.debugDrawFlags = DrawBits.e_shapeBit;
  },
  _getWorld: function _getWorld() {
    return this._world;
  },
  _syncNode: function _syncNode() {
    var bodies = this._bodies;

    for (var i = 0, l = bodies.length; i < l; i++) {
      var body = bodies[i];
      var node = body.node;
      var b2body = body._b2Body;
      var pos = b2body.GetPosition();
      vec2_tmp.x = pos.x * PTM_RATIO;
      vec2_tmp.y = pos.y * PTM_RATIO;
      var angle = b2body.GetAngle() * PHYSICS_ANGLE_TO_ANGLE; // When node's parent is not scene, convert position and rotation.

      if (node.parent.parent !== null) {
        vec2_tmp = node.parent.convertToNodeSpaceAR(vec2_tmp);
        angle = convertToNodeRotation(node.parent, angle);
      }

      var tempMask = node._eventMask;
      node._eventMask = 0; // sync position

      node.position = vec2_tmp; // sync rotation

      node.angle = -angle;
      node._eventMask = tempMask;

      if (body.type === BodyType.Animated) {
        body.resetVelocity();
      }
    }
  },
  _onBeginContact: function _onBeginContact(b2contact) {
    var c = cc.PhysicsContact.get(b2contact);
    c.emit(ContactType.BEGIN_CONTACT);
  },
  _onEndContact: function _onEndContact(b2contact) {
    var c = b2contact._contact;

    if (!c) {
      return;
    }

    c.emit(ContactType.END_CONTACT);
    cc.PhysicsContact.put(b2contact);
  },
  _onPreSolve: function _onPreSolve(b2contact) {
    var c = b2contact._contact;

    if (!c) {
      return;
    }

    c.emit(ContactType.PRE_SOLVE);
  },
  _onPostSolve: function _onPostSolve(b2contact, impulse) {
    var c = b2contact._contact;

    if (!c) {
      return;
    } // impulse only survive during post sole callback


    c._impulse = impulse;
    c.emit(ContactType.POST_SOLVE);
    c._impulse = null;
  },
  _checkDebugDrawValid: function _checkDebugDrawValid() {
    if (!this._debugDrawer || !this._debugDrawer.isValid) {
      var node = new cc.Node('PHYSICS_MANAGER_DEBUG_DRAW');
      node.zIndex = cc.macro.MAX_ZINDEX;
      cc.game.addPersistRootNode(node);
      this._debugDrawer = node.addComponent(cc.Graphics);
      var debugDraw = new DebugDraw(this._debugDrawer);
      debugDraw.SetFlags(this.debugDrawFlags);

      this._world.SetDebugDraw(debugDraw);
    }
  }
});
/**
 * !#en
 * Enabled the physics manager?
 * !#zh
 * 指定是否启用物理系统？
 * @property {Boolean} enabled
 * @default false
 */

cc.js.getset(PhysicsManager.prototype, 'enabled', function () {
  return this._enabled;
}, function (value) {
  if (CC_EDITOR) return;

  if (value && !this._world) {
    var world = new b2.World(new b2.Vec2(0, -10));
    world.SetAllowSleeping(true);
    this._world = world;

    this._initCallback();
  }

  this._enabled = value;
});
/**
 * !#en
 * Debug draw flags.
 * !#zh
 * 设置调试绘制标志
 * @property {Number} debugDrawFlags
 * @default 0
 * @example
 * // enable all debug draw info
 * var Bits = cc.PhysicsManager.DrawBits;
 * cc.director.getPhysicsManager().debugDrawFlags = Bits.e_aabbBit |
    Bits.e_pairBit |
    Bits.e_centerOfMassBit |
    Bits.e_jointBit |
    Bits.e_shapeBit;
 
 * // disable debug draw info
 * cc.director.getPhysicsManager().debugDrawFlags = 0;
 */

cc.js.getset(PhysicsManager.prototype, 'debugDrawFlags', function () {
  return this._debugDrawFlags;
}, function (value) {
  if (CC_EDITOR) return;

  if (value && !this._debugDrawFlags) {
    if (this._debugDrawer && this._debugDrawer.node) this._debugDrawer.node.active = true;
  } else if (!value && this._debugDrawFlags) {
    if (this._debugDrawer && this._debugDrawer.node) this._debugDrawer.node.active = false;
  }

  if (value) {
    this._checkDebugDrawValid();

    this._world.m_debugDraw.SetFlags(value);
  }

  this._debugDrawFlags = value;

  if (value) {
    this._checkDebugDrawValid();

    this._world.m_debugDraw.SetFlags(value);
  }
});
/**
 * !#en
 * The physics world gravity.
 * !#zh
 * 物理世界重力值
 * @property {Vec2} gravity
 */

cc.js.getset(PhysicsManager.prototype, 'gravity', function () {
  if (this._world) {
    var g = this._world.GetGravity();

    return cc.v2(g.x * PTM_RATIO, g.y * PTM_RATIO);
  }

  return cc.v2();
}, function (value) {
  if (this._world) {
    this._world.SetGravity(new b2.Vec2(value.x / PTM_RATIO, value.y / PTM_RATIO));
  }
});
cc.PhysicsManager = module.exports = PhysicsManager;
/**
 * !#en
 * The draw bits for drawing physics debug information.<br>
 * example:<br>
 * ```js
 * cc.director.getPhysicsManager().debugDrawFlags = 
 *  // cc.PhysicsManager.DrawBits.e_aabbBit |
 *  // cc.PhysicsManager.DrawBits.e_pairBit |
 *  // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
 *  cc.PhysicsManager.DrawBits.e_jointBit |
 *  cc.PhysicsManager.DrawBits.e_shapeBit;
 * ```
 * !#zh
 * 指定物理系统需要绘制哪些调试信息。<br>
 * example:<br>
 * ```js
 * cc.director.getPhysicsManager().debugDrawFlags = 
 *  // cc.PhysicsManager.DrawBits.e_aabbBit |
 *  // cc.PhysicsManager.DrawBits.e_pairBit |
 *  // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
 *  cc.PhysicsManager.DrawBits.e_jointBit |
 *  cc.PhysicsManager.DrawBits.e_shapeBit;
 * ```
 * @enum PhysicsManager.DrawBits
 * @static

 */

/**
 * !#en
 * Draw bounding boxes
 * !#zh
 * 绘制包围盒
 * @property {Number} e_aabbBit
 * @static
 */

/**
 * !#en
 * Draw joint connections
 * !#zh
 * 绘制关节链接信息
 * @property {Number} e_jointBit
 * @static
 */

/**
 * !#en
 * Draw shapes
 * !#zh
 * 绘制形状
 * @property {Number} e_shapeBit
 * @static
 */

/**
 * @class PhysicsRayCastResult
 */

/**
 * !#en
 * The PhysicsCollider which intersects with the raycast
 * !#zh
 * 与射线相交的碰撞体
 * @property {PhysicsCollider} collider
 */

/**
 * !#en
 * The intersection point
 * !#zh
 * 射线与碰撞体相交的点
 * @property {Vec2} point
 */

/**
 * !#en
 * The normal vector at the point of intersection
 * !#zh
 * 射线与碰撞体相交的点的法向量
 * @property {Vec2} normal
 */

/**
 * !#en
 * The fraction of the raycast path at the point of intersection
 * !#zh
 * 射线与碰撞体相交的点占射线长度的分数
 * @property {Number} fraction
 */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDUGh5c2ljc01hbmFnZXIuanMiXSwibmFtZXMiOlsiUGh5c2ljc1R5cGVzIiwicmVxdWlyZSIsIkNvbnRhY3RUeXBlIiwiQm9keVR5cGUiLCJSYXlDYXN0VHlwZSIsIkRyYXdCaXRzIiwiUFRNX1JBVElPIiwiQU5HTEVfVE9fUEhZU0lDU19BTkdMRSIsIlBIWVNJQ1NfQU5HTEVfVE9fQU5HTEUiLCJjb252ZXJ0VG9Ob2RlUm90YXRpb24iLCJEZWJ1Z0RyYXciLCJiMl9hYWJiX3RtcCIsImIyIiwiQUFCQiIsImIyX3ZlYzJfdG1wMSIsIlZlYzIiLCJiMl92ZWMyX3RtcDIiLCJ2ZWMyX3RtcCIsImNjIiwidjIiLCJQaHlzaWNzTWFuYWdlciIsIkNsYXNzIiwibWl4aW5zIiwiRXZlbnRUYXJnZXQiLCJzdGF0aWNzIiwiVkVMT0NJVFlfSVRFUkFUSU9OUyIsIlBPU0lUSU9OX0lURVJBVElPTlMiLCJGSVhFRF9USU1FX1NURVAiLCJNQVhfQUNDVU1VTEFUT1IiLCJjdG9yIiwiX2RlYnVnRHJhd0ZsYWdzIiwiX2RlYnVnRHJhd2VyIiwiX3dvcmxkIiwiX2JvZGllcyIsIl9qb2ludHMiLCJfY29udGFjdE1hcCIsIl9jb250YWN0SUQiLCJfZGVsYXlFdmVudHMiLCJfYWNjdW11bGF0b3IiLCJkaXJlY3RvciIsIl9zY2hlZHVsZXIiLCJlbmFibGVGb3JUYXJnZXQiLCJlbmFibGVkQWNjdW11bGF0b3IiLCJwdXNoRGVsYXlFdmVudCIsInRhcmdldCIsImZ1bmMiLCJhcmdzIiwiX3N0ZXBpbmciLCJwdXNoIiwiYXBwbHkiLCJ1cGRhdGUiLCJkdCIsIndvcmxkIiwiZW5hYmxlZCIsImVtaXQiLCJ2ZWxvY2l0eUl0ZXJhdGlvbnMiLCJwb3NpdGlvbkl0ZXJhdGlvbnMiLCJTdGVwIiwidGltZVN0ZXAiLCJnYW1lIiwiY29uZmlnIiwiZGVidWdEcmF3RmxhZ3MiLCJfY2hlY2tEZWJ1Z0RyYXdWYWxpZCIsImNsZWFyIiwiRHJhd0RlYnVnRGF0YSIsImV2ZW50cyIsImkiLCJsIiwibGVuZ3RoIiwiZXZlbnQiLCJfc3luY05vZGUiLCJ0ZXN0UG9pbnQiLCJwb2ludCIsIngiLCJ5IiwiZCIsImxvd2VyQm91bmQiLCJ1cHBlckJvdW5kIiwiY2FsbGJhY2siLCJfYWFiYlF1ZXJ5Q2FsbGJhY2siLCJpbml0IiwiUXVlcnlBQUJCIiwiZml4dHVyZSIsImdldEZpeHR1cmUiLCJjb2xsaWRlciIsInRlc3RBQUJCIiwicmVjdCIsInhNaW4iLCJ5TWluIiwieE1heCIsInlNYXgiLCJmaXh0dXJlcyIsImdldEZpeHR1cmVzIiwiY29sbGlkZXJzIiwibWFwIiwicmF5Q2FzdCIsInAxIiwicDIiLCJ0eXBlIiwiZXF1YWxzIiwiQ2xvc2VzdCIsIl9yYXljYXN0UXVlcnlDYWxsYmFjayIsIlJheUNhc3QiLCJwb2ludHMiLCJnZXRQb2ludHMiLCJub3JtYWxzIiwiZ2V0Tm9ybWFscyIsImZyYWN0aW9ucyIsImdldEZyYWN0aW9ucyIsInJlc3VsdHMiLCJBbGxDbG9zZXN0IiwicmVzdWx0IiwiZmluZCIsImZyYWN0aW9uIiwiZml4dHVyZUluZGV4IiwiX2dldEZpeHR1cmVJbmRleCIsIm5vcm1hbCIsInN5bmNQb3NpdGlvbiIsImJvZGllcyIsInN5bmNSb3RhdGlvbiIsIl9yZWdpc3RlckNvbnRhY3RGaXh0dXJlIiwiX2NvbnRhY3RMaXN0ZW5lciIsInJlZ2lzdGVyQ29udGFjdEZpeHR1cmUiLCJfdW5yZWdpc3RlckNvbnRhY3RGaXh0dXJlIiwidW5yZWdpc3RlckNvbnRhY3RGaXh0dXJlIiwiX2FkZEJvZHkiLCJib2R5IiwiYm9keURlZiIsIm5vZGUiLCJfYjJCb2R5IiwiQ3JlYXRlQm9keSIsIl9yZW1vdmVCb2R5IiwiRGVzdHJveUJvZHkiLCJqcyIsImFycmF5IiwicmVtb3ZlIiwiX2FkZEpvaW50Iiwiam9pbnQiLCJqb2ludERlZiIsImIyam9pbnQiLCJDcmVhdGVKb2ludCIsIl9qb2ludCIsIl9yZW1vdmVKb2ludCIsIl9pc1ZhbGlkIiwiRGVzdHJveUpvaW50IiwiX2luaXRDYWxsYmFjayIsIndhcm4iLCJsaXN0ZW5lciIsIlBoeXNpY3NDb250YWN0TGlzdGVuZXIiLCJzZXRCZWdpbkNvbnRhY3QiLCJfb25CZWdpbkNvbnRhY3QiLCJzZXRFbmRDb250YWN0IiwiX29uRW5kQ29udGFjdCIsInNldFByZVNvbHZlIiwiX29uUHJlU29sdmUiLCJzZXRQb3N0U29sdmUiLCJfb25Qb3N0U29sdmUiLCJTZXRDb250YWN0TGlzdGVuZXIiLCJQaHlzaWNzQUFCQlF1ZXJ5Q2FsbGJhY2siLCJQaHlzaWNzUmF5Q2FzdENhbGxiYWNrIiwiX2luaXQiLCJlX3NoYXBlQml0IiwiX2dldFdvcmxkIiwiYjJib2R5IiwicG9zIiwiR2V0UG9zaXRpb24iLCJhbmdsZSIsIkdldEFuZ2xlIiwicGFyZW50IiwiY29udmVydFRvTm9kZVNwYWNlQVIiLCJ0ZW1wTWFzayIsIl9ldmVudE1hc2siLCJwb3NpdGlvbiIsIkFuaW1hdGVkIiwicmVzZXRWZWxvY2l0eSIsImIyY29udGFjdCIsImMiLCJQaHlzaWNzQ29udGFjdCIsImdldCIsIkJFR0lOX0NPTlRBQ1QiLCJfY29udGFjdCIsIkVORF9DT05UQUNUIiwicHV0IiwiUFJFX1NPTFZFIiwiaW1wdWxzZSIsIl9pbXB1bHNlIiwiUE9TVF9TT0xWRSIsImlzVmFsaWQiLCJOb2RlIiwiekluZGV4IiwibWFjcm8iLCJNQVhfWklOREVYIiwiYWRkUGVyc2lzdFJvb3ROb2RlIiwiYWRkQ29tcG9uZW50IiwiR3JhcGhpY3MiLCJkZWJ1Z0RyYXciLCJTZXRGbGFncyIsIlNldERlYnVnRHJhdyIsImdldHNldCIsInByb3RvdHlwZSIsIl9lbmFibGVkIiwidmFsdWUiLCJDQ19FRElUT1IiLCJXb3JsZCIsIlNldEFsbG93U2xlZXBpbmciLCJhY3RpdmUiLCJtX2RlYnVnRHJhdyIsImciLCJHZXRHcmF2aXR5IiwiU2V0R3Jhdml0eSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFNQSxZ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YixRQUFJK0ssQ0FBQyxHQUFHLEtBQUsvSyxNQUFMLENBQVlnTCxVQUFaLEVBQVI7O0FBQ0EsV0FBTzlMLEVBQUUsQ0FBQ0MsRUFBSCxDQUFNNEwsQ0FBQyxDQUFDdEksQ0FBRixHQUFJbkUsU0FBVixFQUFxQnlNLENBQUMsQ0FBQ3JJLENBQUYsR0FBSXBFLFNBQXpCLENBQVA7QUFDSDs7QUFDRCxTQUFPWSxFQUFFLENBQUNDLEVBQUgsRUFBUDtBQUNILENBUEwsRUFTSSxVQUFVc0wsS0FBVixFQUFpQjtBQUNiLE1BQUksS0FBS3pLLE1BQVQsRUFBaUI7QUFDYixTQUFLQSxNQUFMLENBQVlpTCxVQUFaLENBQXVCLElBQUlyTSxFQUFFLENBQUNHLElBQVAsQ0FBWTBMLEtBQUssQ0FBQ2hJLENBQU4sR0FBUW5FLFNBQXBCLEVBQStCbU0sS0FBSyxDQUFDL0gsQ0FBTixHQUFRcEUsU0FBdkMsQ0FBdkI7QUFDSDtBQUNKLENBYkw7QUFpQkFZLEVBQUUsQ0FBQ0UsY0FBSCxHQUFvQjhMLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQi9MLGNBQXJDO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE0QkE7Ozs7Ozs7OztBQVFBOzs7Ozs7Ozs7QUFRQTs7Ozs7Ozs7O0FBU0E7Ozs7QUFHQTs7Ozs7Ozs7QUFPQTs7Ozs7Ozs7QUFPQTs7Ozs7Ozs7QUFPQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuY29uc3QgUGh5c2ljc1R5cGVzID0gcmVxdWlyZSgnLi9DQ1BoeXNpY3NUeXBlcycpO1xuY29uc3QgQ29udGFjdFR5cGUgPSBQaHlzaWNzVHlwZXMuQ29udGFjdFR5cGU7XG5jb25zdCBCb2R5VHlwZSA9IFBoeXNpY3NUeXBlcy5Cb2R5VHlwZTtcbmNvbnN0IFJheUNhc3RUeXBlID0gUGh5c2ljc1R5cGVzLlJheUNhc3RUeXBlO1xuY29uc3QgRHJhd0JpdHMgPSBQaHlzaWNzVHlwZXMuRHJhd0JpdHM7XG5cbmNvbnN0IFBUTV9SQVRJTyA9IFBoeXNpY3NUeXBlcy5QVE1fUkFUSU87XG5jb25zdCBBTkdMRV9UT19QSFlTSUNTX0FOR0xFID0gUGh5c2ljc1R5cGVzLkFOR0xFX1RPX1BIWVNJQ1NfQU5HTEU7XG5jb25zdCBQSFlTSUNTX0FOR0xFX1RPX0FOR0xFID0gUGh5c2ljc1R5cGVzLlBIWVNJQ1NfQU5HTEVfVE9fQU5HTEU7XG5cbmNvbnN0IGNvbnZlcnRUb05vZGVSb3RhdGlvbiA9IHJlcXVpcmUoJy4vdXRpbHMnKS5jb252ZXJ0VG9Ob2RlUm90YXRpb247XG5jb25zdCBEZWJ1Z0RyYXcgPSByZXF1aXJlKCcuL3BsYXRmb3JtL0NDUGh5c2ljc0RlYnVnRHJhdycpO1xuXG52YXIgYjJfYWFiYl90bXAgPSBuZXcgYjIuQUFCQigpO1xudmFyIGIyX3ZlYzJfdG1wMSA9IG5ldyBiMi5WZWMyKCk7XG52YXIgYjJfdmVjMl90bXAyID0gbmV3IGIyLlZlYzIoKTtcblxudmFyIHZlYzJfdG1wID0gY2MudjIoKTtcblxuLyoqXG4gKiAhI2VuXG4gKiBQaHlzaWNzIG1hbmFnZXIgdXNlcyBib3gyZCBhcyB0aGUgaW5uZXIgcGh5c2ljcyBzeXN0ZW0sIGFuZCBoaWRlIG1vc3QgYm94MmQgaW1wbGVtZW50IGRldGFpbHMoY3JlYXRpbmcgcmlnaWRib2R5LCBzeW5jaHJvbml6ZSByaWdpZGJvZHkgaW5mbyB0byBub2RlKS5cbiAqIFlvdSBjYW4gdmlzaXQgc29tZSBjb21tb24gYm94MmQgZnVuY3Rpb24gdGhyb3VnaCBwaHlzaWNzIG1hbmFnZXIoaGl0IHRlc3RpbmcsIHJheWNhc3QsIGRlYnVnIGluZm8pLlxuICogUGh5c2ljcyBtYW5hZ2VyIGRpc3RyaWJ1dGVzIHRoZSBjb2xsaXNpb24gaW5mb3JtYXRpb24gdG8gZWFjaCBjb2xsaXNpb24gY2FsbGJhY2sgd2hlbiBjb2xsaXNpb24gaXMgcHJvZHVjZWQuXG4gKiBOb3RlOiBZb3UgbmVlZCBmaXJzdCBlbmFibGUgdGhlIGNvbGxpc2lvbiBsaXN0ZW5lciBpbiB0aGUgcmlnaWRib2R5LlxuICogISN6aFxuICog54mp55CG57O757uf5bCGIGJveDJkIOS9nOS4uuWGhemDqOeJqeeQhuezu+e7n++8jOW5tuS4lOmakOiXj+S6huWkp+mDqOWIhiBib3gyZCDlrp7njrDnu4boioLvvIjmr5TlpoLliJvlu7rliJrkvZPvvIzlkIzmraXliJrkvZPkv6Hmga/liLDoioLngrnkuK3nrYnvvInjgIJcbiAqIOS9oOWPr+S7pemAmui/h+eJqeeQhuezu+e7n+iuv+mXruS4gOS6myBib3gyZCDluLjnlKjnmoTlip/og73vvIzmr5TlpoLngrnlh7vmtYvor5XvvIzlsITnur/mtYvor5XvvIzorr7nva7mtYvor5Xkv6Hmga/nrYnjgIJcbiAqIOeJqeeQhuezu+e7n+i/mOeuoeeQhueisOaSnuS/oeaBr+eahOWIhuWPke+8jOWlueS8muWcqOS6p+eUn+eisOaSnuaXtu+8jOWwhueisOaSnuS/oeaBr+WIhuWPkeWIsOWQhOS4queisOaSnuWbnuiwg+S4reOAglxuICog5rOo5oSP77ya5L2g6ZyA6KaB5YWI5Zyo5Yia5L2T5Lit5byA5ZCv56Kw5pKe5o6l5ZCs5omN5Lya5Lqn55Sf55u45bqU55qE56Kw5pKe5Zue6LCD44CCPGJyPlxuICog5pSv5oyB55qE54mp55CG57O757uf5oyH5a6a57uY5Yi25L+h5oGv5LqL5Lu277yM6K+35Y+C6ZiFIHt7I2Nyb3NzTGluayBcIlBoeXNpY3NNYW5hZ2VyLkRyYXdCaXRzXCJ9fXt7L2Nyb3NzTGlua319XG4gKiBAY2xhc3MgUGh5c2ljc01hbmFnZXJcbiAqIEB1c2VzIEV2ZW50VGFyZ2V0XG4gKi9cbnZhciBQaHlzaWNzTWFuYWdlciA9IGNjLkNsYXNzKHtcbiAgICBtaXhpbnM6IFtjYy5FdmVudFRhcmdldF0sXG5cbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIERyYXdCaXRzOiBEcmF3Qml0cyxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgcmF0aW8gdHJhbnNmb3JtIGJldHdlZW4gcGh5c2ljcyB1bml0IGFuZCBwaXhlbCB1bml0LCBnZW5lcmFsbHkgaXMgMzIuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog54mp55CG5Y2V5L2N5LiO5YOP57Sg5Y2V5L2N5LqS55u46L2s5o2i55qE5q+U546H77yM5LiA6Iis5pivIDMy44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBQVE1fUkFUSU9cbiAgICAgICAgICogQHN0YXRpY1xuICAgICAgICAgKi9cbiAgICAgICAgUFRNX1JBVElPOiBQVE1fUkFUSU8sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIHZlbG9jaXR5IGl0ZXJhdGlvbnMgZm9yIHRoZSB2ZWxvY2l0eSBjb25zdHJhaW50IHNvbHZlci5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDpgJ/luqbmm7TmlrDov63ku6PmlbBcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFZFTE9DSVRZX0lURVJBVElPTlNcbiAgICAgICAgICogQGRlZmF1bHQgMTBcbiAgICAgICAgICogQHN0YXRpY1xuICAgICAgICAgKi9cbiAgICAgICAgVkVMT0NJVFlfSVRFUkFUSU9OUzogMTAsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIHBvc2l0aW9uIEl0ZXJhdGlvbnMgZm9yIHRoZSBwb3NpdGlvbiBjb25zdHJhaW50IHNvbHZlci5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDkvY3nva7ov63ku6Pmm7TmlrDmlbBcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFBPU0lUSU9OX0lURVJBVElPTlNcbiAgICAgICAgICogQGRlZmF1bHQgMTBcbiAgICAgICAgICogQHN0YXRpY1xuICAgICAgICAgKi9cbiAgICAgICAgUE9TSVRJT05fSVRFUkFUSU9OUzogMTAsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogU3BlY2lmeSB0aGUgZml4ZWQgdGltZSBzdGVwLlxuICAgICAgICAgKiBOZWVkIGVuYWJsZWRBY2N1bXVsYXRvciB0byBtYWtlIGl0IHdvcmsuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5oyH5a6a5Zu65a6a55qE54mp55CG5pu05paw6Ze06ZqU5pe26Ze077yM6ZyA6KaB5byA5ZCvIGVuYWJsZWRBY2N1bXVsYXRvciDmiY3mnInmlYjjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEZJWEVEX1RJTUVfU1RFUFxuICAgICAgICAgKiBAZGVmYXVsdCAxLzYwXG4gICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgICovXG4gICAgICAgIEZJWEVEX1RJTUVfU1RFUDogMS82MCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBTcGVjaWZ5IHRoZSBtYXggYWNjdW11bGF0b3IgdGltZS5cbiAgICAgICAgICogTmVlZCBlbmFibGVkQWNjdW11bGF0b3IgdG8gbWFrZSBpdCB3b3JrLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOavj+asoeWPr+eUqOS6juabtOaWsOeJqeeQhuezu+e7n+eahOacgOWkp+aXtumXtO+8jOmcgOimgeW8gOWQryBlbmFibGVkQWNjdW11bGF0b3Ig5omN5pyJ5pWI44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBNQVhfQUNDVU1VTEFUT1JcbiAgICAgICAgICogQGRlZmF1bHQgMS81XG4gICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgICovXG4gICAgICAgIE1BWF9BQ0NVTVVMQVRPUjogMS81XG4gICAgfSxcblxuICAgIGN0b3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fZGVidWdEcmF3RmxhZ3MgPSAwO1xuICAgICAgICB0aGlzLl9kZWJ1Z0RyYXdlciA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5fd29ybGQgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuX2JvZGllcyA9IFtdO1xuICAgICAgICB0aGlzLl9qb2ludHMgPSBbXTtcblxuICAgICAgICB0aGlzLl9jb250YWN0TWFwID0ge307XG4gICAgICAgIHRoaXMuX2NvbnRhY3RJRCA9IDA7XG5cbiAgICAgICAgdGhpcy5fZGVsYXlFdmVudHMgPSBbXTtcblxuICAgICAgICB0aGlzLl9hY2N1bXVsYXRvciA9IDA7XG5cbiAgICAgICAgY2MuZGlyZWN0b3IuX3NjaGVkdWxlciAmJiBjYy5kaXJlY3Rvci5fc2NoZWR1bGVyLmVuYWJsZUZvclRhcmdldCh0aGlzKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBJZiBlbmFibGVkIGFjY3VtdWxhdG9yLCB0aGVuIHdpbGwgY2FsbCBzdGVwIGZ1bmN0aW9uIHdpdGggdGhlIGZpeGVkIHRpbWUgc3RlcCBGSVhFRF9USU1FX1NURVAuIFxuICAgICAgICAgKiBBbmQgaWYgdGhlIHVwZGF0ZSBkdCBpcyBiaWdnZXIgdGhhbiB0aGUgdGltZSBzdGVwLCB0aGVuIHdpbGwgY2FsbCBzdGVwIGZ1bmN0aW9uIHNldmVyYWwgdGltZXMuXG4gICAgICAgICAqIElmIGRpc2FibGVkIGFjY3VtdWxhdG9yLCB0aGVuIHdpbGwgY2FsbCBzdGVwIGZ1bmN0aW9uIHdpdGggYSB0aW1lIHN0ZXAgY2FsY3VsYXRlZCB3aXRoIHRoZSBmcmFtZSByYXRlLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOWmguaenOW8gOWQr+atpOmAiemhue+8jOmCo+S5iOWwhuS8muS7peWbuuWumueahOmXtOmalOaXtumXtCBGSVhFRF9USU1FX1NURVAg5p2l5pu05paw54mp55CG5byV5pOO77yM5aaC5p6c5LiA5LiqIHVwZGF0ZSDnmoTpl7TpmpTml7bpl7TlpKfkuo4gRklYRURfVElNRV9TVEVQ77yM5YiZ5Lya5a+554mp55CG5byV5pOO6L+b6KGM5aSa5qyh5pu05paw44CCXG4gICAgICAgICAqIOWmguaenOWFs+mXreatpOmAiemhue+8jOmCo+S5iOWwhuS8muagueaNruiuvuWumueahCBmcmFtZSByYXRlIOiuoeeul+WHuuS4gOS4qumXtOmalOaXtumXtOadpeabtOaWsOeJqeeQhuW8leaTjuOAglxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGVuYWJsZWRBY2N1bXVsYXRvclxuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5lbmFibGVkQWNjdW11bGF0b3IgPSBmYWxzZTsgICAgICAgIFxuICAgIH0sXG5cbiAgICBwdXNoRGVsYXlFdmVudDogZnVuY3Rpb24gKHRhcmdldCwgZnVuYywgYXJncykge1xuICAgICAgICBpZiAodGhpcy5fc3RlcGluZykge1xuICAgICAgICAgICAgdGhpcy5fZGVsYXlFdmVudHMucHVzaCh7XG4gICAgICAgICAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICAgICAgICAgICAgZnVuYzogZnVuYyxcbiAgICAgICAgICAgICAgICBhcmdzOiBhcmdzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRhcmdldFtmdW5jXS5hcHBseSh0YXJnZXQsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG4gICAgICAgIHZhciB3b3JsZCA9IHRoaXMuX3dvcmxkO1xuICAgICAgICBpZiAoIXdvcmxkIHx8ICF0aGlzLmVuYWJsZWQpIHJldHVybjtcblxuICAgICAgICB0aGlzLmVtaXQoJ2JlZm9yZS1zdGVwJyk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLl9zdGVwaW5nID0gdHJ1ZTtcblxuICAgICAgICB2YXIgdmVsb2NpdHlJdGVyYXRpb25zID0gUGh5c2ljc01hbmFnZXIuVkVMT0NJVFlfSVRFUkFUSU9OUztcbiAgICAgICAgdmFyIHBvc2l0aW9uSXRlcmF0aW9ucyA9IFBoeXNpY3NNYW5hZ2VyLlBPU0lUSU9OX0lURVJBVElPTlM7XG5cbiAgICAgICAgaWYgKHRoaXMuZW5hYmxlZEFjY3VtdWxhdG9yKSB7XG4gICAgICAgICAgICB0aGlzLl9hY2N1bXVsYXRvciArPSBkdDtcblxuICAgICAgICAgICAgdmFyIEZJWEVEX1RJTUVfU1RFUCA9IFBoeXNpY3NNYW5hZ2VyLkZJWEVEX1RJTUVfU1RFUDtcbiAgICAgICAgICAgIHZhciBNQVhfQUNDVU1VTEFUT1IgPSBQaHlzaWNzTWFuYWdlci5NQVhfQUNDVU1VTEFUT1I7XG5cbiAgICAgICAgICAgIC8vIG1heCBhY2N1bXVsYXRvciB0aW1lIHRvIGF2b2lkIHNwaXJhbCBvZiBkZWF0aFxuICAgICAgICAgICAgaWYgKHRoaXMuX2FjY3VtdWxhdG9yID4gTUFYX0FDQ1VNVUxBVE9SKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYWNjdW11bGF0b3IgPSBNQVhfQUNDVU1VTEFUT1I7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdoaWxlICh0aGlzLl9hY2N1bXVsYXRvciA+IEZJWEVEX1RJTUVfU1RFUCkge1xuICAgICAgICAgICAgICAgIHdvcmxkLlN0ZXAoRklYRURfVElNRV9TVEVQLCB2ZWxvY2l0eUl0ZXJhdGlvbnMsIHBvc2l0aW9uSXRlcmF0aW9ucyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fYWNjdW11bGF0b3IgLT0gRklYRURfVElNRV9TVEVQO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIHRpbWVTdGVwID0gMS9jYy5nYW1lLmNvbmZpZ1snZnJhbWVSYXRlJ107XG4gICAgICAgICAgICB3b3JsZC5TdGVwKHRpbWVTdGVwLCB2ZWxvY2l0eUl0ZXJhdGlvbnMsIHBvc2l0aW9uSXRlcmF0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5kZWJ1Z0RyYXdGbGFncykge1xuICAgICAgICAgICAgdGhpcy5fY2hlY2tEZWJ1Z0RyYXdWYWxpZCgpO1xuICAgICAgICAgICAgdGhpcy5fZGVidWdEcmF3ZXIuY2xlYXIoKTtcbiAgICAgICAgICAgIHdvcmxkLkRyYXdEZWJ1Z0RhdGEoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3N0ZXBpbmcgPSBmYWxzZTtcblxuICAgICAgICB2YXIgZXZlbnRzID0gdGhpcy5fZGVsYXlFdmVudHM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gZXZlbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgdmFyIGV2ZW50ID0gZXZlbnRzW2ldO1xuICAgICAgICAgICAgZXZlbnQudGFyZ2V0W2V2ZW50LmZ1bmNdLmFwcGx5KGV2ZW50LnRhcmdldCwgZXZlbnQuYXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnRzLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgdGhpcy5fc3luY05vZGUoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFRlc3Qgd2hpY2ggY29sbGlkZXIgY29udGFpbnMgdGhlIGdpdmVuIHdvcmxkIHBvaW50XG4gICAgICogISN6aFxuICAgICAqIOiOt+WPluWMheWQq+e7meWumuS4lueVjOWdkOagh+ezu+eCueeahOeisOaSnuS9k1xuICAgICAqIEBtZXRob2QgdGVzdFBvaW50XG4gICAgICogQHBhcmFtIHtWZWMyfSBwb2ludCAtIHRoZSB3b3JsZCBwb2ludFxuICAgICAqIEByZXR1cm4ge1BoeXNpY3NDb2xsaWRlcn1cbiAgICAgKi9cbiAgICB0ZXN0UG9pbnQ6IGZ1bmN0aW9uIChwb2ludCkge1xuICAgICAgICB2YXIgeCA9IGIyX3ZlYzJfdG1wMS54ID0gcG9pbnQueC9QVE1fUkFUSU87XG4gICAgICAgIHZhciB5ID0gYjJfdmVjMl90bXAxLnkgPSBwb2ludC55L1BUTV9SQVRJTztcblxuICAgICAgICB2YXIgZCA9IDAuMi9QVE1fUkFUSU87XG4gICAgICAgIGIyX2FhYmJfdG1wLmxvd2VyQm91bmQueCA9IHgtZDtcbiAgICAgICAgYjJfYWFiYl90bXAubG93ZXJCb3VuZC55ID0geS1kO1xuICAgICAgICBiMl9hYWJiX3RtcC51cHBlckJvdW5kLnggPSB4K2Q7XG4gICAgICAgIGIyX2FhYmJfdG1wLnVwcGVyQm91bmQueSA9IHkrZDtcblxuICAgICAgICB2YXIgY2FsbGJhY2sgPSB0aGlzLl9hYWJiUXVlcnlDYWxsYmFjaztcbiAgICAgICAgY2FsbGJhY2suaW5pdChiMl92ZWMyX3RtcDEpO1xuICAgICAgICB0aGlzLl93b3JsZC5RdWVyeUFBQkIoY2FsbGJhY2ssIGIyX2FhYmJfdG1wKTtcblxuICAgICAgICB2YXIgZml4dHVyZSA9IGNhbGxiYWNrLmdldEZpeHR1cmUoKTtcbiAgICAgICAgaWYgKGZpeHR1cmUpIHtcbiAgICAgICAgICAgIHJldHVybiBmaXh0dXJlLmNvbGxpZGVyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBUZXN0IHdoaWNoIGNvbGxpZGVycyBpbnRlcnNlY3QgdGhlIGdpdmVuIHdvcmxkIHJlY3RcbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W5LiO57uZ5a6a5LiW55WM5Z2Q5qCH57O755+p5b2i55u45Lqk55qE56Kw5pKe5L2TXG4gICAgICogQG1ldGhvZCB0ZXN0QUFCQlxuICAgICAqIEBwYXJhbSB7UmVjdH0gcmVjdCAtIHRoZSB3b3JsZCByZWN0XG4gICAgICogQHJldHVybiB7W1BoeXNpY3NDb2xsaWRlcl19XG4gICAgICovXG4gICAgdGVzdEFBQkI6IGZ1bmN0aW9uIChyZWN0KSB7XG4gICAgICAgIGIyX2FhYmJfdG1wLmxvd2VyQm91bmQueCA9IHJlY3QueE1pbi9QVE1fUkFUSU87XG4gICAgICAgIGIyX2FhYmJfdG1wLmxvd2VyQm91bmQueSA9IHJlY3QueU1pbi9QVE1fUkFUSU87XG4gICAgICAgIGIyX2FhYmJfdG1wLnVwcGVyQm91bmQueCA9IHJlY3QueE1heC9QVE1fUkFUSU87XG4gICAgICAgIGIyX2FhYmJfdG1wLnVwcGVyQm91bmQueSA9IHJlY3QueU1heC9QVE1fUkFUSU87XG5cbiAgICAgICAgdmFyIGNhbGxiYWNrID0gdGhpcy5fYWFiYlF1ZXJ5Q2FsbGJhY2s7XG4gICAgICAgIGNhbGxiYWNrLmluaXQoKTtcbiAgICAgICAgdGhpcy5fd29ybGQuUXVlcnlBQUJCKGNhbGxiYWNrLCBiMl9hYWJiX3RtcCk7XG5cbiAgICAgICAgdmFyIGZpeHR1cmVzID0gY2FsbGJhY2suZ2V0Rml4dHVyZXMoKTtcbiAgICAgICAgdmFyIGNvbGxpZGVycyA9IGZpeHR1cmVzLm1hcChmdW5jdGlvbiAoZml4dHVyZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZpeHR1cmUuY29sbGlkZXI7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBjb2xsaWRlcnM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSYXljYXN0IHRoZSB3b3JsZCBmb3IgYWxsIGNvbGxpZGVycyBpbiB0aGUgcGF0aCBvZiB0aGUgcmF5LlxuICAgICAqIFRoZSByYXljYXN0IGlnbm9yZXMgY29sbGlkZXJzIHRoYXQgY29udGFpbiB0aGUgc3RhcnRpbmcgcG9pbnQuXG4gICAgICogISN6aFxuICAgICAqIOajgOa1i+WTquS6m+eisOaSnuS9k+WcqOe7meWumuWwhOe6v+eahOi3r+W+hOS4iu+8jOWwhOe6v+ajgOa1i+WwhuW/veeVpeWMheWQq+i1t+Wni+eCueeahOeisOaSnuS9k+OAglxuICAgICAqIEBtZXRob2QgcmF5Q2FzdFxuICAgICAqIEBwYXJhbSB7VmVjMn0gcDEgLSBzdGFydCBwb2ludCBvZiB0aGUgcmF5Y2FzdFxuICAgICAqIEBwYXJhbSB7VmVjMn0gcDIgLSBlbmQgcG9pbnQgb2YgdGhlIHJheWNhc3RcbiAgICAgKiBAcGFyYW0ge1JheUNhc3RUeXBlfSB0eXBlIC0gb3B0aW9uYWwsIGRlZmF1bHQgaXMgUmF5Q2FzdFR5cGUuQ2xvc2VzdFxuICAgICAqIEByZXR1cm4ge1tQaHlzaWNzUmF5Q2FzdFJlc3VsdF19XG4gICAgICovXG4gICAgcmF5Q2FzdDogZnVuY3Rpb24gKHAxLCBwMiwgdHlwZSkge1xuICAgICAgICBpZiAocDEuZXF1YWxzKHAyKSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgdHlwZSA9IHR5cGUgfHwgUmF5Q2FzdFR5cGUuQ2xvc2VzdDtcblxuICAgICAgICBiMl92ZWMyX3RtcDEueCA9IHAxLngvUFRNX1JBVElPO1xuICAgICAgICBiMl92ZWMyX3RtcDEueSA9IHAxLnkvUFRNX1JBVElPO1xuICAgICAgICBiMl92ZWMyX3RtcDIueCA9IHAyLngvUFRNX1JBVElPO1xuICAgICAgICBiMl92ZWMyX3RtcDIueSA9IHAyLnkvUFRNX1JBVElPO1xuXG4gICAgICAgIHZhciBjYWxsYmFjayA9IHRoaXMuX3JheWNhc3RRdWVyeUNhbGxiYWNrO1xuICAgICAgICBjYWxsYmFjay5pbml0KHR5cGUpO1xuICAgICAgICB0aGlzLl93b3JsZC5SYXlDYXN0KGNhbGxiYWNrLCBiMl92ZWMyX3RtcDEsIGIyX3ZlYzJfdG1wMik7XG5cbiAgICAgICAgdmFyIGZpeHR1cmVzID0gY2FsbGJhY2suZ2V0Rml4dHVyZXMoKTtcbiAgICAgICAgaWYgKGZpeHR1cmVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciBwb2ludHMgPSBjYWxsYmFjay5nZXRQb2ludHMoKTtcbiAgICAgICAgICAgIHZhciBub3JtYWxzID0gY2FsbGJhY2suZ2V0Tm9ybWFscygpO1xuICAgICAgICAgICAgdmFyIGZyYWN0aW9ucyA9IGNhbGxiYWNrLmdldEZyYWN0aW9ucygpO1xuXG4gICAgICAgICAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBmaXh0dXJlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZml4dHVyZSA9IGZpeHR1cmVzW2ldO1xuICAgICAgICAgICAgICAgIHZhciBjb2xsaWRlciA9IGZpeHR1cmUuY29sbGlkZXI7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gUmF5Q2FzdFR5cGUuQWxsQ2xvc2VzdCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gcmVzdWx0cy5maW5kKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5jb2xsaWRlciA9PT0gY29sbGlkZXI7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmcmFjdGlvbnNbaV0gPCByZXN1bHQuZnJhY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQuZml4dHVyZUluZGV4ID0gY29sbGlkZXIuX2dldEZpeHR1cmVJbmRleChmaXh0dXJlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucG9pbnQueCA9IHBvaW50c1tpXS54KlBUTV9SQVRJTztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucG9pbnQueSA9IHBvaW50c1tpXS55KlBUTV9SQVRJTztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQubm9ybWFsLnggPSBub3JtYWxzW2ldLng7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0Lm5vcm1hbC55ID0gbm9ybWFsc1tpXS55O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5mcmFjdGlvbiA9IGZyYWN0aW9uc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgY29sbGlkZXI6IGNvbGxpZGVyLFxuICAgICAgICAgICAgICAgICAgICBmaXh0dXJlSW5kZXg6IGNvbGxpZGVyLl9nZXRGaXh0dXJlSW5kZXgoZml4dHVyZSksXG4gICAgICAgICAgICAgICAgICAgIHBvaW50OiBjYy52Mihwb2ludHNbaV0ueCpQVE1fUkFUSU8sIHBvaW50c1tpXS55KlBUTV9SQVRJTyksXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbDogY2MudjIobm9ybWFsc1tpXSksXG4gICAgICAgICAgICAgICAgICAgIGZyYWN0aW9uOiBmcmFjdGlvbnNbaV1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gW107XG4gICAgfSxcbiBcbiAgICBzeW5jUG9zaXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGJvZGllcyA9IHRoaXMuX2JvZGllcztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBib2RpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGJvZGllc1tpXS5zeW5jUG9zaXRpb24oKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc3luY1JvdGF0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBib2RpZXMgPSB0aGlzLl9ib2RpZXM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYm9kaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBib2RpZXNbaV0uc3luY1JvdGF0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9LCAgICBcblxuICAgIF9yZWdpc3RlckNvbnRhY3RGaXh0dXJlOiBmdW5jdGlvbiAoZml4dHVyZSkge1xuICAgICAgICB0aGlzLl9jb250YWN0TGlzdGVuZXIucmVnaXN0ZXJDb250YWN0Rml4dHVyZShmaXh0dXJlKTtcbiAgICB9LFxuXG4gICAgX3VucmVnaXN0ZXJDb250YWN0Rml4dHVyZTogZnVuY3Rpb24gKGZpeHR1cmUpIHtcbiAgICAgICAgdGhpcy5fY29udGFjdExpc3RlbmVyLnVucmVnaXN0ZXJDb250YWN0Rml4dHVyZShmaXh0dXJlKTtcbiAgICB9LFxuXG4gICAgX2FkZEJvZHk6IGZ1bmN0aW9uIChib2R5LCBib2R5RGVmKSB7XG4gICAgICAgIHZhciB3b3JsZCA9IHRoaXMuX3dvcmxkO1xuICAgICAgICB2YXIgbm9kZSA9IGJvZHkubm9kZTtcblxuICAgICAgICBpZiAoIXdvcmxkIHx8ICFub2RlKSByZXR1cm47XG5cbiAgICAgICAgYm9keS5fYjJCb2R5ID0gd29ybGQuQ3JlYXRlQm9keShib2R5RGVmKTtcbiAgICAgICAgYm9keS5fYjJCb2R5LmJvZHkgPSBib2R5O1xuXG4gICAgICAgIHRoaXMuX2JvZGllcy5wdXNoKGJvZHkpO1xuICAgIH0sXG5cbiAgICBfcmVtb3ZlQm9keTogZnVuY3Rpb24gKGJvZHkpIHtcbiAgICAgICAgdmFyIHdvcmxkID0gdGhpcy5fd29ybGQ7XG4gICAgICAgIGlmICghd29ybGQpIHJldHVybjtcblxuICAgICAgICBib2R5Ll9iMkJvZHkuYm9keSA9IG51bGw7XG4gICAgICAgIHdvcmxkLkRlc3Ryb3lCb2R5KGJvZHkuX2IyQm9keSk7XG4gICAgICAgIGJvZHkuX2IyQm9keSA9IG51bGw7XG5cbiAgICAgICAgY2MuanMuYXJyYXkucmVtb3ZlKHRoaXMuX2JvZGllcywgYm9keSk7XG4gICAgfSxcblxuICAgIF9hZGRKb2ludCAoam9pbnQsIGpvaW50RGVmKSB7XG4gICAgICAgIGxldCBiMmpvaW50ID0gdGhpcy5fd29ybGQuQ3JlYXRlSm9pbnQoam9pbnREZWYpO1xuICAgICAgICBpZiAoIWIyam9pbnQpIHJldHVybjtcbiAgICAgICAgXG4gICAgICAgIGIyam9pbnQuX2pvaW50ID0gam9pbnQ7XG4gICAgICAgIGpvaW50Ll9qb2ludCA9IGIyam9pbnQ7XG5cbiAgICAgICAgdGhpcy5fam9pbnRzLnB1c2goam9pbnQpO1xuICAgIH0sXG5cbiAgICBfcmVtb3ZlSm9pbnQgKGpvaW50KSB7XG4gICAgICAgIGlmIChqb2ludC5faXNWYWxpZCgpKSB7XG4gICAgICAgICAgICB0aGlzLl93b3JsZC5EZXN0cm95Sm9pbnQoam9pbnQuX2pvaW50KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKGpvaW50Ll9qb2ludCkge1xuICAgICAgICAgICAgam9pbnQuX2pvaW50Ll9qb2ludCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBjYy5qcy5hcnJheS5yZW1vdmUodGhpcy5fam9pbnRzLCBqb2ludCk7XG4gICAgfSxcblxuICAgIF9pbml0Q2FsbGJhY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl93b3JsZCkge1xuICAgICAgICAgICAgY2Mud2FybignUGxlYXNlIGluaXQgUGh5c2ljc01hbmFnZXIgZmlyc3QnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9jb250YWN0TGlzdGVuZXIpIHJldHVybjtcblxuICAgICAgICB2YXIgbGlzdGVuZXIgPSBuZXcgY2MuUGh5c2ljc0NvbnRhY3RMaXN0ZW5lcigpO1xuICAgICAgICBsaXN0ZW5lci5zZXRCZWdpbkNvbnRhY3QodGhpcy5fb25CZWdpbkNvbnRhY3QpO1xuICAgICAgICBsaXN0ZW5lci5zZXRFbmRDb250YWN0KHRoaXMuX29uRW5kQ29udGFjdCk7XG4gICAgICAgIGxpc3RlbmVyLnNldFByZVNvbHZlKHRoaXMuX29uUHJlU29sdmUpO1xuICAgICAgICBsaXN0ZW5lci5zZXRQb3N0U29sdmUodGhpcy5fb25Qb3N0U29sdmUpO1xuICAgICAgICB0aGlzLl93b3JsZC5TZXRDb250YWN0TGlzdGVuZXIobGlzdGVuZXIpO1xuXG4gICAgICAgIHRoaXMuX2NvbnRhY3RMaXN0ZW5lciA9IGxpc3RlbmVyO1xuXG4gICAgICAgIHRoaXMuX2FhYmJRdWVyeUNhbGxiYWNrID0gbmV3IGNjLlBoeXNpY3NBQUJCUXVlcnlDYWxsYmFjaygpO1xuICAgICAgICB0aGlzLl9yYXljYXN0UXVlcnlDYWxsYmFjayA9IG5ldyBjYy5QaHlzaWNzUmF5Q2FzdENhbGxiYWNrKCk7XG4gICAgfSxcblxuICAgIF9pbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuZGVidWdEcmF3RmxhZ3MgPSBEcmF3Qml0cy5lX3NoYXBlQml0O1xuICAgIH0sXG5cbiAgICBfZ2V0V29ybGQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dvcmxkO1xuICAgIH0sXG5cbiAgICBfc3luY05vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGJvZGllcyA9IHRoaXMuX2JvZGllcztcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBib2RpZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYm9keSA9IGJvZGllc1tpXTtcbiAgICAgICAgICAgIHZhciBub2RlID0gYm9keS5ub2RlO1xuXG4gICAgICAgICAgICB2YXIgYjJib2R5ID0gYm9keS5fYjJCb2R5O1xuICAgICAgICAgICAgdmFyIHBvcyA9IGIyYm9keS5HZXRQb3NpdGlvbigpO1xuXG4gICAgICAgICAgICB2ZWMyX3RtcC54ID0gcG9zLnggKiBQVE1fUkFUSU87XG4gICAgICAgICAgICB2ZWMyX3RtcC55ID0gcG9zLnkgKiBQVE1fUkFUSU87XG5cbiAgICAgICAgICAgIHZhciBhbmdsZSA9IGIyYm9keS5HZXRBbmdsZSgpICogUEhZU0lDU19BTkdMRV9UT19BTkdMRTtcblxuICAgICAgICAgICAgLy8gV2hlbiBub2RlJ3MgcGFyZW50IGlzIG5vdCBzY2VuZSwgY29udmVydCBwb3NpdGlvbiBhbmQgcm90YXRpb24uXG4gICAgICAgICAgICBpZiAobm9kZS5wYXJlbnQucGFyZW50ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdmVjMl90bXAgPSBub2RlLnBhcmVudC5jb252ZXJ0VG9Ob2RlU3BhY2VBUiggdmVjMl90bXAgKTtcbiAgICAgICAgICAgICAgICBhbmdsZSA9IGNvbnZlcnRUb05vZGVSb3RhdGlvbiggbm9kZS5wYXJlbnQsIGFuZ2xlICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB0ZW1wTWFzayA9IG5vZGUuX2V2ZW50TWFzaztcbiAgICAgICAgICAgIG5vZGUuX2V2ZW50TWFzayA9IDA7XG5cbiAgICAgICAgICAgIC8vIHN5bmMgcG9zaXRpb25cbiAgICAgICAgICAgIG5vZGUucG9zaXRpb24gPSB2ZWMyX3RtcDtcblxuICAgICAgICAgICAgLy8gc3luYyByb3RhdGlvblxuICAgICAgICAgICAgbm9kZS5hbmdsZSA9IC1hbmdsZTtcblxuICAgICAgICAgICAgbm9kZS5fZXZlbnRNYXNrID0gdGVtcE1hc2s7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChib2R5LnR5cGUgPT09IEJvZHlUeXBlLkFuaW1hdGVkKSB7XG4gICAgICAgICAgICAgICAgYm9keS5yZXNldFZlbG9jaXR5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX29uQmVnaW5Db250YWN0OiBmdW5jdGlvbiAoYjJjb250YWN0KSB7XG4gICAgICAgIHZhciBjID0gY2MuUGh5c2ljc0NvbnRhY3QuZ2V0KGIyY29udGFjdCk7XG4gICAgICAgIGMuZW1pdChDb250YWN0VHlwZS5CRUdJTl9DT05UQUNUKTtcbiAgICB9LFxuXG4gICAgX29uRW5kQ29udGFjdDogZnVuY3Rpb24gKGIyY29udGFjdCkge1xuICAgICAgICB2YXIgYyA9IGIyY29udGFjdC5fY29udGFjdDtcbiAgICAgICAgaWYgKCFjKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgYy5lbWl0KENvbnRhY3RUeXBlLkVORF9DT05UQUNUKTtcbiAgICAgICAgXG4gICAgICAgIGNjLlBoeXNpY3NDb250YWN0LnB1dChiMmNvbnRhY3QpO1xuICAgIH0sXG5cbiAgICBfb25QcmVTb2x2ZTogZnVuY3Rpb24gKGIyY29udGFjdCkge1xuICAgICAgICB2YXIgYyA9IGIyY29udGFjdC5fY29udGFjdDtcbiAgICAgICAgaWYgKCFjKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGMuZW1pdChDb250YWN0VHlwZS5QUkVfU09MVkUpO1xuICAgIH0sXG5cbiAgICBfb25Qb3N0U29sdmU6IGZ1bmN0aW9uIChiMmNvbnRhY3QsIGltcHVsc2UpIHtcbiAgICAgICAgdmFyIGMgPSBiMmNvbnRhY3QuX2NvbnRhY3Q7XG4gICAgICAgIGlmICghYykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaW1wdWxzZSBvbmx5IHN1cnZpdmUgZHVyaW5nIHBvc3Qgc29sZSBjYWxsYmFja1xuICAgICAgICBjLl9pbXB1bHNlID0gaW1wdWxzZTtcbiAgICAgICAgYy5lbWl0KENvbnRhY3RUeXBlLlBPU1RfU09MVkUpO1xuICAgICAgICBjLl9pbXB1bHNlID0gbnVsbDtcbiAgICB9LFxuXG4gICAgX2NoZWNrRGVidWdEcmF3VmFsaWQgKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2RlYnVnRHJhd2VyIHx8ICF0aGlzLl9kZWJ1Z0RyYXdlci5pc1ZhbGlkKSB7XG4gICAgICAgICAgICBsZXQgbm9kZSA9IG5ldyBjYy5Ob2RlKCdQSFlTSUNTX01BTkFHRVJfREVCVUdfRFJBVycpO1xuICAgICAgICAgICAgbm9kZS56SW5kZXggPSBjYy5tYWNyby5NQVhfWklOREVYO1xuICAgICAgICAgICAgY2MuZ2FtZS5hZGRQZXJzaXN0Um9vdE5vZGUobm9kZSk7XG4gICAgICAgICAgICB0aGlzLl9kZWJ1Z0RyYXdlciA9IG5vZGUuYWRkQ29tcG9uZW50KGNjLkdyYXBoaWNzKTtcblxuICAgICAgICAgICAgbGV0IGRlYnVnRHJhdyA9IG5ldyBEZWJ1Z0RyYXcodGhpcy5fZGVidWdEcmF3ZXIpO1xuICAgICAgICAgICAgZGVidWdEcmF3LlNldEZsYWdzKHRoaXMuZGVidWdEcmF3RmxhZ3MpO1xuICAgICAgICAgICAgdGhpcy5fd29ybGQuU2V0RGVidWdEcmF3KGRlYnVnRHJhdyk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuLyoqXG4gKiAhI2VuXG4gKiBFbmFibGVkIHRoZSBwaHlzaWNzIG1hbmFnZXI/XG4gKiAhI3poXG4gKiDmjIflrprmmK/lkKblkK/nlKjniannkIbns7vnu5/vvJ9cbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZW5hYmxlZFxuICogQGRlZmF1bHQgZmFsc2VcbiAqL1xuY2MuanMuZ2V0c2V0KFBoeXNpY3NNYW5hZ2VyLnByb3RvdHlwZSwgJ2VuYWJsZWQnLCBcbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9lbmFibGVkO1xuICAgIH0sXG4gICAgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGlmIChDQ19FRElUT1IpIHJldHVybjtcbiAgICAgICAgXG4gICAgICAgIGlmICh2YWx1ZSAmJiAhdGhpcy5fd29ybGQpIHtcbiAgICAgICAgICAgIHZhciB3b3JsZCA9IG5ldyBiMi5Xb3JsZCggbmV3IGIyLlZlYzIoMCwgLTEwKSApO1xuICAgICAgICAgICAgd29ybGQuU2V0QWxsb3dTbGVlcGluZyh0cnVlKTtcblxuICAgICAgICAgICAgdGhpcy5fd29ybGQgPSB3b3JsZDtcblxuICAgICAgICAgICAgdGhpcy5faW5pdENhbGxiYWNrKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9lbmFibGVkID0gdmFsdWU7XG4gICAgfVxuKTtcblxuLyoqXG4gKiAhI2VuXG4gKiBEZWJ1ZyBkcmF3IGZsYWdzLlxuICogISN6aFxuICog6K6+572u6LCD6K+V57uY5Yi25qCH5b+XXG4gKiBAcHJvcGVydHkge051bWJlcn0gZGVidWdEcmF3RmxhZ3NcbiAqIEBkZWZhdWx0IDBcbiAqIEBleGFtcGxlXG4gKiAvLyBlbmFibGUgYWxsIGRlYnVnIGRyYXcgaW5mb1xuICogdmFyIEJpdHMgPSBjYy5QaHlzaWNzTWFuYWdlci5EcmF3Qml0cztcbiAqIGNjLmRpcmVjdG9yLmdldFBoeXNpY3NNYW5hZ2VyKCkuZGVidWdEcmF3RmxhZ3MgPSBCaXRzLmVfYWFiYkJpdCB8XG4gICAgQml0cy5lX3BhaXJCaXQgfFxuICAgIEJpdHMuZV9jZW50ZXJPZk1hc3NCaXQgfFxuICAgIEJpdHMuZV9qb2ludEJpdCB8XG4gICAgQml0cy5lX3NoYXBlQml0O1xuIFxuICogLy8gZGlzYWJsZSBkZWJ1ZyBkcmF3IGluZm9cbiAqIGNjLmRpcmVjdG9yLmdldFBoeXNpY3NNYW5hZ2VyKCkuZGVidWdEcmF3RmxhZ3MgPSAwO1xuICovXG5jYy5qcy5nZXRzZXQoUGh5c2ljc01hbmFnZXIucHJvdG90eXBlLCAnZGVidWdEcmF3RmxhZ3MnLCBcbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWJ1Z0RyYXdGbGFncztcbiAgICB9LFxuICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBpZiAoQ0NfRURJVE9SKSByZXR1cm47XG4gICAgICAgIFxuICAgICAgICBpZiAodmFsdWUgJiYgIXRoaXMuX2RlYnVnRHJhd0ZsYWdzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fZGVidWdEcmF3ZXIgJiYgdGhpcy5fZGVidWdEcmF3ZXIubm9kZSkgdGhpcy5fZGVidWdEcmF3ZXIubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCF2YWx1ZSAmJiB0aGlzLl9kZWJ1Z0RyYXdGbGFncykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2RlYnVnRHJhd2VyICYmIHRoaXMuX2RlYnVnRHJhd2VyLm5vZGUpIHRoaXMuX2RlYnVnRHJhd2VyLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX2NoZWNrRGVidWdEcmF3VmFsaWQoKTtcbiAgICAgICAgICAgIHRoaXMuX3dvcmxkLm1fZGVidWdEcmF3LlNldEZsYWdzKHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2RlYnVnRHJhd0ZsYWdzID0gdmFsdWU7XG5cbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9jaGVja0RlYnVnRHJhd1ZhbGlkKCk7XG4gICAgICAgICAgICB0aGlzLl93b3JsZC5tX2RlYnVnRHJhdy5TZXRGbGFncyh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4pO1xuXG4vKipcbiAqICEjZW5cbiAqIFRoZSBwaHlzaWNzIHdvcmxkIGdyYXZpdHkuXG4gKiAhI3poXG4gKiDniannkIbkuJbnlYzph43lipvlgLxcbiAqIEBwcm9wZXJ0eSB7VmVjMn0gZ3Jhdml0eVxuICovXG5jYy5qcy5nZXRzZXQoUGh5c2ljc01hbmFnZXIucHJvdG90eXBlLCAnZ3Jhdml0eScsXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fd29ybGQpIHtcbiAgICAgICAgICAgIHZhciBnID0gdGhpcy5fd29ybGQuR2V0R3Jhdml0eSgpO1xuICAgICAgICAgICAgcmV0dXJuIGNjLnYyKGcueCpQVE1fUkFUSU8sIGcueSpQVE1fUkFUSU8pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYy52MigpO1xuICAgIH0sXG5cbiAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMuX3dvcmxkKSB7XG4gICAgICAgICAgICB0aGlzLl93b3JsZC5TZXRHcmF2aXR5KG5ldyBiMi5WZWMyKHZhbHVlLngvUFRNX1JBVElPLCB2YWx1ZS55L1BUTV9SQVRJTykpO1xuICAgICAgICB9XG4gICAgfVxuKTtcblxuXG5jYy5QaHlzaWNzTWFuYWdlciA9IG1vZHVsZS5leHBvcnRzID0gUGh5c2ljc01hbmFnZXI7XG5cbi8qKlxuICogISNlblxuICogVGhlIGRyYXcgYml0cyBmb3IgZHJhd2luZyBwaHlzaWNzIGRlYnVnIGluZm9ybWF0aW9uLjxicj5cbiAqIGV4YW1wbGU6PGJyPlxuICogYGBganNcbiAqIGNjLmRpcmVjdG9yLmdldFBoeXNpY3NNYW5hZ2VyKCkuZGVidWdEcmF3RmxhZ3MgPSBcbiAqICAvLyBjYy5QaHlzaWNzTWFuYWdlci5EcmF3Qml0cy5lX2FhYmJCaXQgfFxuICogIC8vIGNjLlBoeXNpY3NNYW5hZ2VyLkRyYXdCaXRzLmVfcGFpckJpdCB8XG4gKiAgLy8gY2MuUGh5c2ljc01hbmFnZXIuRHJhd0JpdHMuZV9jZW50ZXJPZk1hc3NCaXQgfFxuICogIGNjLlBoeXNpY3NNYW5hZ2VyLkRyYXdCaXRzLmVfam9pbnRCaXQgfFxuICogIGNjLlBoeXNpY3NNYW5hZ2VyLkRyYXdCaXRzLmVfc2hhcGVCaXQ7XG4gKiBgYGBcbiAqICEjemhcbiAqIOaMh+WumueJqeeQhuezu+e7n+mcgOimgee7mOWItuWTquS6m+iwg+ivleS/oeaBr+OAgjxicj5cbiAqIGV4YW1wbGU6PGJyPlxuICogYGBganNcbiAqIGNjLmRpcmVjdG9yLmdldFBoeXNpY3NNYW5hZ2VyKCkuZGVidWdEcmF3RmxhZ3MgPSBcbiAqICAvLyBjYy5QaHlzaWNzTWFuYWdlci5EcmF3Qml0cy5lX2FhYmJCaXQgfFxuICogIC8vIGNjLlBoeXNpY3NNYW5hZ2VyLkRyYXdCaXRzLmVfcGFpckJpdCB8XG4gKiAgLy8gY2MuUGh5c2ljc01hbmFnZXIuRHJhd0JpdHMuZV9jZW50ZXJPZk1hc3NCaXQgfFxuICogIGNjLlBoeXNpY3NNYW5hZ2VyLkRyYXdCaXRzLmVfam9pbnRCaXQgfFxuICogIGNjLlBoeXNpY3NNYW5hZ2VyLkRyYXdCaXRzLmVfc2hhcGVCaXQ7XG4gKiBgYGBcbiAqIEBlbnVtIFBoeXNpY3NNYW5hZ2VyLkRyYXdCaXRzXG4gKiBAc3RhdGljXG5cbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIERyYXcgYm91bmRpbmcgYm94ZXNcbiAqICEjemhcbiAqIOe7mOWItuWMheWbtOebklxuICogQHByb3BlcnR5IHtOdW1iZXJ9IGVfYWFiYkJpdFxuICogQHN0YXRpY1xuICovXG4vKipcbiAqICEjZW5cbiAqIERyYXcgam9pbnQgY29ubmVjdGlvbnNcbiAqICEjemhcbiAqIOe7mOWItuWFs+iKgumTvuaOpeS/oeaBr1xuICogQHByb3BlcnR5IHtOdW1iZXJ9IGVfam9pbnRCaXRcbiAqIEBzdGF0aWNcbiAqL1xuLyoqXG4gKiAhI2VuXG4gKiBEcmF3IHNoYXBlc1xuICogISN6aFxuICog57uY5Yi25b2i54q2XG4gKiBAcHJvcGVydHkge051bWJlcn0gZV9zaGFwZUJpdFxuICogQHN0YXRpY1xuICovXG5cbi8qKlxuICogQGNsYXNzIFBoeXNpY3NSYXlDYXN0UmVzdWx0XG4gKi9cbi8qKlxuICogISNlblxuICogVGhlIFBoeXNpY3NDb2xsaWRlciB3aGljaCBpbnRlcnNlY3RzIHdpdGggdGhlIHJheWNhc3RcbiAqICEjemhcbiAqIOS4juWwhOe6v+ebuOS6pOeahOeisOaSnuS9k1xuICogQHByb3BlcnR5IHtQaHlzaWNzQ29sbGlkZXJ9IGNvbGxpZGVyXG4gKi9cbi8qKlxuICogISNlblxuICogVGhlIGludGVyc2VjdGlvbiBwb2ludFxuICogISN6aFxuICog5bCE57q/5LiO56Kw5pKe5L2T55u45Lqk55qE54K5XG4gKiBAcHJvcGVydHkge1ZlYzJ9IHBvaW50XG4gKi9cbi8qKlxuICogISNlblxuICogVGhlIG5vcm1hbCB2ZWN0b3IgYXQgdGhlIHBvaW50IG9mIGludGVyc2VjdGlvblxuICogISN6aFxuICog5bCE57q/5LiO56Kw5pKe5L2T55u45Lqk55qE54K555qE5rOV5ZCR6YePXG4gKiBAcHJvcGVydHkge1ZlYzJ9IG5vcm1hbFxuICovXG4vKipcbiAqICEjZW5cbiAqIFRoZSBmcmFjdGlvbiBvZiB0aGUgcmF5Y2FzdCBwYXRoIGF0IHRoZSBwb2ludCBvZiBpbnRlcnNlY3Rpb25cbiAqICEjemhcbiAqIOWwhOe6v+S4jueisOaSnuS9k+ebuOS6pOeahOeCueWNoOWwhOe6v+mVv+W6pueahOWIhuaVsFxuICogQHByb3BlcnR5IHtOdW1iZXJ9IGZyYWN0aW9uXG4gKi9cbiJdfQ==