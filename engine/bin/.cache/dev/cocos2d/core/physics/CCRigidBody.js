
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/physics/CCRigidBody.js';
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
var NodeEvent = require('../CCNode').EventType;

var PTM_RATIO = require('./CCPhysicsTypes').PTM_RATIO;

var ANGLE_TO_PHYSICS_ANGLE = require('./CCPhysicsTypes').ANGLE_TO_PHYSICS_ANGLE;

var PHYSICS_ANGLE_TO_ANGLE = require('./CCPhysicsTypes').PHYSICS_ANGLE_TO_ANGLE;

var getWorldRotation = require('./utils').getWorldRotation;

var BodyType = require('./CCPhysicsTypes').BodyType;

var tempb2Vec21 = new b2.Vec2();
var tempb2Vec22 = new b2.Vec2();
var VEC2_ZERO = cc.Vec2.ZERO;
/**
 * @class RigidBody
 * @extends Component
 */

var RigidBody = cc.Class({
  name: 'cc.RigidBody',
  "extends": cc.Component,
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.physics/Rigid Body',
    disallowMultiple: true
  },
  properties: {
    _type: BodyType.Dynamic,
    _allowSleep: true,
    _gravityScale: 1,
    _linearDamping: 0,
    _angularDamping: 0,
    _linearVelocity: cc.v2(0, 0),
    _angularVelocity: 0,
    _fixedRotation: false,
    enabled: {
      get: function get() {
        return this._enabled;
      },
      set: function set() {
        cc.warnID(8200);
      },
      visible: false,
      override: true
    },

    /**
     * !#en
     * Should enabled contact listener?
     * When a collision is trigger, the collision callback will only be called when enabled contact listener.
     * !#zh
     * 是否启用接触接听器。
     * 当 collider 产生碰撞时，只有开启了接触接听器才会调用相应的回调函数
     * @property {Boolean} enabledContactListener
     * @default false
     */
    enabledContactListener: {
      "default": false,
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.rigidbody.enabledContactListener'
    },

    /**
     * !#en
     * Collision callback.
     * Called when two collider begin to touch.
     * !#zh
     * 碰撞回调。
     * 如果你的脚本中实现了这个函数，那么它将会在两个碰撞体开始接触时被调用。
     * @method onBeginContact
     * @param {PhysicsContact} contact - contact information
     * @param {PhysicsCollider} selfCollider - the collider belong to this rigidbody
     * @param {PhysicsCollider} otherCollider - the collider belong to another rigidbody
     */

    /**
     * !#en
     * Collision callback.
     * Called when two collider cease to touch.
     * !#zh
     * 碰撞回调。
     * 如果你的脚本中实现了这个函数，那么它将会在两个碰撞体停止接触时被调用。
     * @method onEndContact
     * @param {PhysicsContact} contact - contact information
     * @param {PhysicsCollider} selfCollider - the collider belong to this rigidbody
     * @param {PhysicsCollider} otherCollider - the collider belong to another rigidbody
     */

    /**
     * !#en
     * Collision callback.
     * This is called when a contact is updated. 
     * This allows you to inspect a contact before it goes to the solver(e.g. disable contact).
    * Note: this is called only for awake bodies.
    * Note: this is called even when the number of contact points is zero.
    * Note: this is not called for sensors.
     * !#zh
     * 碰撞回调。
     * 如果你的脚本中实现了这个函数，那么它将会在接触更新时被调用。
     * 你可以在接触被处理前根据他包含的信息作出相应的处理，比如将这个接触禁用掉。
     * 注意：回调只会为醒着的刚体调用。
     * 注意：接触点为零的时候也有可能被调用。
     * 注意：感知体(sensor)的回调不会被调用。
     * @method onPreSolve
     * @param {PhysicsContact} contact - contact information
     * @param {PhysicsCollider} selfCollider - the collider belong to this rigidbody
     * @param {PhysicsCollider} otherCollider - the collider belong to another rigidbody
     */

    /**
     * !#en
     * Collision callback.
     * This is called after a contact is updated. 
     * You can get the impulses from the contact in this callback.
     * !#zh
     * 碰撞回调。
     * 如果你的脚本中实现了这个函数，那么它将会在接触更新完后被调用。
     * 你可以在这个回调中从接触信息中获取到冲量信息。
     * @method onPostSolve
     * @param {PhysicsContact} contact - contact information
     * @param {PhysicsCollider} selfCollider - the collider belong to this rigidbody
     * @param {PhysicsCollider} otherCollider - the collider belong to another rigidbody
     */

    /**
     * !#en
     * Is this a fast moving body that should be prevented from tunneling through
     * other moving bodies? 
     * Note : 
     * - All bodies are prevented from tunneling through kinematic and static bodies. This setting is only considered on dynamic bodies.
     * - You should use this flag sparingly since it increases processing time.
     * !#zh
     * 这个刚体是否是一个快速移动的刚体，并且需要禁止穿过其他快速移动的刚体？
     * 需要注意的是 : 
     *  - 所有刚体都被禁止从 运动刚体 和 静态刚体 中穿过。此选项只关注于 动态刚体。
     *  - 应该尽量少的使用此选项，因为它会增加程序处理时间。
     * @property {Boolean} bullet
     * @default false
     */
    bullet: {
      "default": false,
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.rigidbody.bullet'
    },

    /**
     * !#en
     * Rigidbody type : Static, Kinematic, Dynamic or Animated.
     * !#zh
     * 刚体类型： Static, Kinematic, Dynamic or Animated.
     * @property {RigidBodyType} type
     * @default RigidBodyType.Dynamic
     */
    type: {
      type: BodyType,
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.rigidbody.type',
      get: function get() {
        return this._type;
      },
      set: function set(value) {
        this._type = value;

        if (this._b2Body) {
          if (value === BodyType.Animated) {
            this._b2Body.SetType(BodyType.Kinematic);
          } else {
            this._b2Body.SetType(value);
          }
        }
      }
    },

    /**
     * !#en
     * Set this flag to false if this body should never fall asleep.
     * Note that this increases CPU usage.
     * !#zh
     * 如果此刚体永远都不应该进入睡眠，那么设置这个属性为 false。
     * 需要注意这将使 CPU 占用率提高。
     * @property {Boolean} allowSleep
     * @default true
     */
    allowSleep: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.rigidbody.allowSleep',
      get: function get() {
        if (this._b2Body) {
          return this._b2Body.IsSleepingAllowed();
        }

        return this._allowSleep;
      },
      set: function set(value) {
        this._allowSleep = value;

        if (this._b2Body) {
          this._b2Body.SetSleepingAllowed(value);
        }
      }
    },

    /**
     * !#en 
     * Scale the gravity applied to this body.
     * !#zh
     * 缩放应用在此刚体上的重力值
     * @property {Number} gravityScale
     * @default 1
     */
    gravityScale: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.rigidbody.gravityScale',
      get: function get() {
        return this._gravityScale;
      },
      set: function set(value) {
        this._gravityScale = value;

        if (this._b2Body) {
          this._b2Body.SetGravityScale(value);
        }
      }
    },

    /**
     * !#en
     * Linear damping is use to reduce the linear velocity.
     * The damping parameter can be larger than 1, but the damping effect becomes sensitive to the
     * time step when the damping parameter is large.
     * !#zh
     * Linear damping 用于衰减刚体的线性速度。衰减系数可以大于 1，但是当衰减系数比较大的时候，衰减的效果会变得比较敏感。
     * @property {Number} linearDamping
     * @default 0
     */
    linearDamping: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.rigidbody.linearDamping',
      get: function get() {
        return this._linearDamping;
      },
      set: function set(value) {
        this._linearDamping = value;

        if (this._b2Body) {
          this._b2Body.SetLinearDamping(this._linearDamping);
        }
      }
    },

    /**
     * !#en
     * Angular damping is use to reduce the angular velocity. The damping parameter
     * can be larger than 1 but the damping effect becomes sensitive to the
     * time step when the damping parameter is large.
     * !#zh
     * Angular damping 用于衰减刚体的角速度。衰减系数可以大于 1，但是当衰减系数比较大的时候，衰减的效果会变得比较敏感。
     * @property {Number} angularDamping
     * @default 0
     */
    angularDamping: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.rigidbody.angularDamping',
      get: function get() {
        return this._angularDamping;
      },
      set: function set(value) {
        this._angularDamping = value;

        if (this._b2Body) {
          this._b2Body.SetAngularDamping(value);
        }
      }
    },

    /**
     * !#en
     * The linear velocity of the body's origin in world co-ordinates.
     * !#zh
     * 刚体在世界坐标下的线性速度
     * @property {Vec2} linearVelocity
     * @default cc.v2(0,0)
     */
    linearVelocity: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.rigidbody.linearVelocity',
      type: cc.Vec2,
      get: function get() {
        var lv = this._linearVelocity;

        if (this._b2Body) {
          var velocity = this._b2Body.GetLinearVelocity();

          lv.x = velocity.x * PTM_RATIO;
          lv.y = velocity.y * PTM_RATIO;
        }

        return lv;
      },
      set: function set(value) {
        this._linearVelocity = value;
        var b2body = this._b2Body;

        if (b2body) {
          var temp = b2body.m_linearVelocity;
          temp.Set(value.x / PTM_RATIO, value.y / PTM_RATIO);
          b2body.SetLinearVelocity(temp);
        }
      }
    },

    /**
     * !#en
     * The angular velocity of the body.
     * !#zh
     * 刚体的角速度
     * @property {Number} angularVelocity
     * @default 0
     */
    angularVelocity: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.rigidbody.angularVelocity',
      get: function get() {
        if (this._b2Body) {
          return this._b2Body.GetAngularVelocity() * PHYSICS_ANGLE_TO_ANGLE;
        }

        return this._angularVelocity;
      },
      set: function set(value) {
        this._angularVelocity = value;

        if (this._b2Body) {
          this._b2Body.SetAngularVelocity(value * ANGLE_TO_PHYSICS_ANGLE);
        }
      }
    },

    /**
     * !#en
     * Should this body be prevented from rotating?
     * !#zh
     * 是否禁止此刚体进行旋转
     * @property {Boolean} fixedRotation
     * @default false
     */
    fixedRotation: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.rigidbody.fixedRotation',
      get: function get() {
        return this._fixedRotation;
      },
      set: function set(value) {
        this._fixedRotation = value;

        if (this._b2Body) {
          this._b2Body.SetFixedRotation(value);
        }
      }
    },

    /**
     * !#en
     * Set the sleep state of the body. A sleeping body has very low CPU cost.(When the rigid body is hit, if the rigid body is in sleep state, it will be immediately awakened.)
     * !#zh
     * 设置刚体的睡眠状态。 睡眠的刚体具有非常低的 CPU 成本。（当刚体被碰撞到时，如果刚体处于睡眠状态，它会立即被唤醒）
     * @property {Boolean} awake
     * @default false
     */
    awake: {
      visible: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.rigidbody.awake',
      get: function get() {
        return this._b2Body ? this._b2Body.IsAwake() : false;
      },
      set: function set(value) {
        if (this._b2Body) {
          this._b2Body.SetAwake(value);
        }
      }
    },

    /**
     * !#en
     * Whether to wake up this rigid body during initialization
     * !#zh
     * 是否在初始化时唤醒此刚体
     * @property {Boolean} awakeOnLoad
     * @default true
     */
    awakeOnLoad: {
      "default": true,
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.rigidbody.awakeOnLoad',
      animatable: false
    },

    /**
     * !#en
     * Set the active state of the body. An inactive body is not
    * simulated and cannot be collided with or woken up.
    * If body is active, all fixtures will be added to the
    * broad-phase.
    * If body is inactive, all fixtures will be removed from
    * the broad-phase and all contacts will be destroyed.
    * Fixtures on an inactive body are implicitly inactive and will
    * not participate in collisions, ray-casts, or queries.
    * Joints connected to an inactive body are implicitly inactive.
     * !#zh
     * 设置刚体的激活状态。一个非激活状态下的刚体是不会被模拟和碰撞的，不管它是否处于睡眠状态下。
     * 如果刚体处于激活状态下，所有夹具会被添加到 粗测阶段（broad-phase）。
     * 如果刚体处于非激活状态下，所有夹具会被从 粗测阶段（broad-phase）中移除。
     * 在非激活状态下的夹具不会参与到碰撞，射线，或者查找中
     * 链接到非激活状态下刚体的关节也是非激活的。
     * @property {Boolean} active
     * @default true
     */
    active: {
      visible: false,
      get: function get() {
        return this._b2Body ? this._b2Body.IsActive() : false;
      },
      set: function set(value) {
        if (this._b2Body) {
          this._b2Body.SetActive(value);
        }
      }
    }
  },

  /**
   * !#en
   * Gets a local point relative to the body's origin given a world point.
   * !#zh
   * 将一个给定的世界坐标系下的点转换为刚体本地坐标系下的点
   * @method getLocalPoint
   * @param {Vec2} worldPoint - a point in world coordinates.
   * @param {Vec2} out - optional, the receiving point
   * @return {Vec2} the corresponding local point relative to the body's origin.
   */
  getLocalPoint: function getLocalPoint(worldPoint, out) {
    out = out || cc.v2();

    if (this._b2Body) {
      tempb2Vec21.Set(worldPoint.x / PTM_RATIO, worldPoint.y / PTM_RATIO);

      var pos = this._b2Body.GetLocalPoint(tempb2Vec21, out);

      out.x = pos.x * PTM_RATIO;
      out.y = pos.y * PTM_RATIO;
    }

    return out;
  },

  /**
   * !#en
   * Get the world coordinates of a point given the local coordinates.
   * !#zh
   * 将一个给定的刚体本地坐标系下的点转换为世界坐标系下的点
   * @method getWorldPoint
   * @param {Vec2} localPoint - a point in local coordinates.
   * @param {Vec2} out - optional, the receiving point
   * @return {Vec2} the same point expressed in world coordinates.
   */
  getWorldPoint: function getWorldPoint(localPoint, out) {
    out = out || cc.v2();

    if (this._b2Body) {
      tempb2Vec21.Set(localPoint.x / PTM_RATIO, localPoint.y / PTM_RATIO);

      var pos = this._b2Body.GetWorldPoint(tempb2Vec21, out);

      out.x = pos.x * PTM_RATIO;
      out.y = pos.y * PTM_RATIO;
    }

    return out;
  },

  /**
   * !#en
   * Get the world coordinates of a vector given the local coordinates.
   * !#zh
   * 将一个给定的世界坐标系下的向量转换为刚体本地坐标系下的向量
   * @method getWorldVector
   * @param {Vec2} localVector - a vector in world coordinates.
   * @param {Vec2} out - optional, the receiving vector
   * @return {Vec2} the same vector expressed in local coordinates.
   */
  getWorldVector: function getWorldVector(localVector, out) {
    out = out || cc.v2();

    if (this._b2Body) {
      tempb2Vec21.Set(localVector.x / PTM_RATIO, localVector.y / PTM_RATIO);

      var vector = this._b2Body.GetWorldVector(tempb2Vec21, out);

      out.x = vector.x * PTM_RATIO;
      out.y = vector.y * PTM_RATIO;
    }

    return out;
  },

  /**
   * !#en
   * Gets a local vector relative to the body's origin given a world vector.
   * !#zh
   * 将一个给定的世界坐标系下的点转换为刚体本地坐标系下的点
   * @method getLocalVector
   * @param {Vec2} worldVector - a vector in world coordinates.
   * @param {Vec2} out - optional, the receiving vector
   * @return {Vec2} the corresponding local vector relative to the body's origin.
   */
  getLocalVector: function getLocalVector(worldVector, out) {
    out = out || cc.v2();

    if (this._b2Body) {
      tempb2Vec21.Set(worldVector.x / PTM_RATIO, worldVector.y / PTM_RATIO);

      var vector = this._b2Body.GetLocalVector(tempb2Vec21, out);

      out.x = vector.x * PTM_RATIO;
      out.y = vector.y * PTM_RATIO;
    }

    return out;
  },

  /**
   * !#en
   * Get the world body origin position.
   * !#zh
   * 获取刚体世界坐标系下的原点值
   * @method getWorldPosition
   * @param {Vec2} out - optional, the receiving point
   * @return {Vec2} the world position of the body's origin.
   */
  getWorldPosition: function getWorldPosition(out) {
    out = out || cc.v2();

    if (this._b2Body) {
      var pos = this._b2Body.GetPosition();

      out.x = pos.x * PTM_RATIO;
      out.y = pos.y * PTM_RATIO;
    }

    return out;
  },

  /**
   * !#en
   * Get the world body rotation angle.
   * !#zh
   * 获取刚体世界坐标系下的旋转值。
   * @method getWorldRotation
   * @return {Number} the current world rotation angle.
   */
  getWorldRotation: function getWorldRotation() {
    if (this._b2Body) {
      return this._b2Body.GetAngle() * PHYSICS_ANGLE_TO_ANGLE;
    }

    return 0;
  },

  /**
   * !#en
   * Get the local position of the center of mass.
   * !#zh
   * 获取刚体本地坐标系下的质心
   * @method getLocalCenter
   * @return {Vec2} the local position of the center of mass.
   */
  getLocalCenter: function getLocalCenter(out) {
    out = out || cc.v2();

    if (this._b2Body) {
      var pos = this._b2Body.GetLocalCenter();

      out.x = pos.x * PTM_RATIO;
      out.y = pos.y * PTM_RATIO;
    }

    return out;
  },

  /**
   * !#en
   * Get the world position of the center of mass.
   * !#zh
   * 获取刚体世界坐标系下的质心
   * @method getWorldCenter
   * @return {Vec2} the world position of the center of mass.
   */
  getWorldCenter: function getWorldCenter(out) {
    out = out || cc.v2();

    if (this._b2Body) {
      var pos = this._b2Body.GetWorldCenter();

      out.x = pos.x * PTM_RATIO;
      out.y = pos.y * PTM_RATIO;
    }

    return out;
  },

  /**
   * !#en
   * Get the world linear velocity of a world point attached to this body.
   * !#zh
   * 获取刚体上指定点的线性速度
   * @method getLinearVelocityFromWorldPoint
   * @param {Vec2} worldPoint - a point in world coordinates.
   * @param {Vec2} out - optional, the receiving point
   * @return {Vec2} the world velocity of a point. 
   */
  getLinearVelocityFromWorldPoint: function getLinearVelocityFromWorldPoint(worldPoint, out) {
    out = out || cc.v2();

    if (this._b2Body) {
      tempb2Vec21.Set(worldPoint.x / PTM_RATIO, worldPoint.y / PTM_RATIO);

      var velocity = this._b2Body.GetLinearVelocityFromWorldPoint(tempb2Vec21, out);

      out.x = velocity.x * PTM_RATIO;
      out.y = velocity.y * PTM_RATIO;
    }

    return out;
  },

  /**
   * !#en
   * Get total mass of the body.
   * !#zh
   * 获取刚体的质量。
   * @method getMass
   * @return {Number} the total mass of the body.
   */
  getMass: function getMass() {
    return this._b2Body ? this._b2Body.GetMass() : 0;
  },

  /**
   * !#en
   * Get the rotational inertia of the body about the local origin.
   * !#zh
   * 获取刚体本地坐标系下原点的旋转惯性
   * @method getInertia
   * @return {Number} the rotational inertia, usually in kg-m^2.
   */
  getInertia: function getInertia() {
    return this._b2Body ? this._b2Body.GetInertia() * PTM_RATIO * PTM_RATIO : 0;
  },

  /**
   * !#en
   * Get all the joints connect to the rigidbody.
   * !#zh
   * 获取链接到此刚体的所有关节
   * @method getJointList
   * @return {[Joint]} the joint list.
   */
  getJointList: function getJointList() {
    if (!this._b2Body) return [];
    var joints = [];

    var list = this._b2Body.GetJointList();

    if (!list) return [];
    joints.push(list.joint._joint); // find prev joint

    var prev = list.prev;

    while (prev) {
      joints.push(prev.joint._joint);
      prev = prev.prev;
    } // find next joint


    var next = list.next;

    while (next) {
      joints.push(next.joint._joint);
      next = next.next;
    }

    return joints;
  },

  /**
   * !#en
   * Apply a force at a world point. If the force is not
  * applied at the center of mass, it will generate a torque and
  * affect the angular velocity.
   * !#zh
   * 施加一个力到刚体上的一个点。如果力没有施加到刚体的质心上，还会产生一个扭矩并且影响到角速度。
   * @method applyForce
   * @param {Vec2} force - the world force vector.
   * @param {Vec2} point - the world position.
   * @param {Boolean} wake - also wake up the body.
   */
  applyForce: function applyForce(force, point, wake) {
    if (this._b2Body) {
      tempb2Vec21.Set(force.x / PTM_RATIO, force.y / PTM_RATIO);
      tempb2Vec22.Set(point.x / PTM_RATIO, point.y / PTM_RATIO);

      this._b2Body.ApplyForce(tempb2Vec21, tempb2Vec22, wake);
    }
  },

  /**
   * !#en
   * Apply a force to the center of mass.
   * !#zh
   * 施加一个力到刚体上的质心上。
   * @method applyForceToCenter
   * @param {Vec2} force - the world force vector.
   * @param {Boolean} wake - also wake up the body.
   */
  applyForceToCenter: function applyForceToCenter(force, wake) {
    if (this._b2Body) {
      tempb2Vec21.Set(force.x / PTM_RATIO, force.y / PTM_RATIO);

      this._b2Body.ApplyForceToCenter(tempb2Vec21, wake);
    }
  },

  /**
   * !#en
   * Apply a torque. This affects the angular velocity.
   * !#zh
   * 施加一个扭矩力，将影响刚体的角速度
   * @method applyTorque
   * @param {Number} torque - about the z-axis (out of the screen), usually in N-m.
   * @param {Boolean} wake - also wake up the body
   */
  applyTorque: function applyTorque(torque, wake) {
    if (this._b2Body) {
      this._b2Body.ApplyTorque(torque / PTM_RATIO, wake);
    }
  },

  /**
   * !#en
   * Apply a impulse at a world point, This immediately modifies the velocity.
  * If the impulse is not applied at the center of mass, it will generate a torque and
  * affect the angular velocity.
   * !#zh
   * 施加冲量到刚体上的一个点，将立即改变刚体的线性速度。
   * 如果冲量施加到的点不是刚体的质心，那么将产生一个扭矩并影响刚体的角速度。
   * @method applyLinearImpulse
   * @param {Vec2} impulse - the world impulse vector, usually in N-seconds or kg-m/s.
   * @param {Vec2} point - the world position
   * @param {Boolean} wake - alse wake up the body
   */
  applyLinearImpulse: function applyLinearImpulse(impulse, point, wake) {
    if (this._b2Body) {
      tempb2Vec21.Set(impulse.x / PTM_RATIO, impulse.y / PTM_RATIO);
      tempb2Vec22.Set(point.x / PTM_RATIO, point.y / PTM_RATIO);

      this._b2Body.ApplyLinearImpulse(tempb2Vec21, tempb2Vec22, wake);
    }
  },

  /**
   * !#en
   * Apply an angular impulse.
   * !#zh
   * 施加一个角速度冲量。
   * @method applyAngularImpulse
   * @param {Number} impulse - the angular impulse in units of kg*m*m/s
   * @param {Boolean} wake - also wake up the body
   */
  applyAngularImpulse: function applyAngularImpulse(impulse, wake) {
    if (this._b2Body) {
      this._b2Body.ApplyAngularImpulse(impulse / PTM_RATIO / PTM_RATIO, wake);
    }
  },

  /**
   * !#en
   * Synchronize node's world position to box2d rigidbody's position.
   * If enableAnimated is true and rigidbody's type is Animated type, 
   * will set linear velocity instead of directly set rigidbody's position.
   * !#zh
   * 同步节点的世界坐标到 box2d 刚体的坐标上。
   * 如果 enableAnimated 是 true，并且刚体的类型是 Animated ，那么将设置刚体的线性速度来代替直接设置刚体的位置。
   * @method syncPosition
   * @param {Boolean} enableAnimated
   */
  syncPosition: function syncPosition(enableAnimated) {
    var b2body = this._b2Body;
    if (!b2body) return;
    var pos = this.node.convertToWorldSpaceAR(VEC2_ZERO);
    var temp;

    if (this.type === BodyType.Animated) {
      temp = b2body.GetLinearVelocity();
    } else {
      temp = b2body.GetPosition();
    }

    temp.x = pos.x / PTM_RATIO;
    temp.y = pos.y / PTM_RATIO;

    if (this.type === BodyType.Animated && enableAnimated) {
      var b2Pos = b2body.GetPosition();
      var timeStep = cc.game.config['frameRate'];
      temp.x = (temp.x - b2Pos.x) * timeStep;
      temp.y = (temp.y - b2Pos.y) * timeStep;
      b2body.SetAwake(true);
      b2body.SetLinearVelocity(temp);
    } else {
      b2body.SetTransformVec(temp, b2body.GetAngle());
    }
  },

  /**
   * !#en
   * Synchronize node's world angle to box2d rigidbody's angle.
   * If enableAnimated is true and rigidbody's type is Animated type, 
   * will set angular velocity instead of directly set rigidbody's angle.
   * !#zh
   * 同步节点的世界旋转角度值到 box2d 刚体的旋转值上。
   * 如果 enableAnimated 是 true，并且刚体的类型是 Animated ，那么将设置刚体的角速度来代替直接设置刚体的角度。
   * @method syncRotation
   * @param {Boolean} enableAnimated
   */
  syncRotation: function syncRotation(enableAnimated) {
    var b2body = this._b2Body;
    if (!b2body) return;
    var rotation = ANGLE_TO_PHYSICS_ANGLE * getWorldRotation(this.node);

    if (this.type === BodyType.Animated && enableAnimated) {
      var b2Rotation = b2body.GetAngle();
      var timeStep = cc.game.config['frameRate'];
      b2body.SetAwake(true);
      b2body.SetAngularVelocity((rotation - b2Rotation) * timeStep);
    } else {
      b2body.SetTransformVec(b2body.GetPosition(), rotation);
    }
  },
  resetVelocity: function resetVelocity() {
    var b2body = this._b2Body;
    if (!b2body) return;
    var temp = b2body.m_linearVelocity;
    temp.Set(0, 0);
    b2body.SetLinearVelocity(temp);
    b2body.SetAngularVelocity(0);
  },
  onEnable: function onEnable() {
    this._init();
  },
  onDisable: function onDisable() {
    this._destroy();
  },
  _registerNodeEvents: function _registerNodeEvents() {
    var node = this.node;
    node.on(NodeEvent.POSITION_CHANGED, this._onNodePositionChanged, this);
    node.on(NodeEvent.ROTATION_CHANGED, this._onNodeRotationChanged, this);
    node.on(NodeEvent.SCALE_CHANGED, this._onNodeScaleChanged, this);
  },
  _unregisterNodeEvents: function _unregisterNodeEvents() {
    var node = this.node;
    node.off(NodeEvent.POSITION_CHANGED, this._onNodePositionChanged, this);
    node.off(NodeEvent.ROTATION_CHANGED, this._onNodeRotationChanged, this);
    node.off(NodeEvent.SCALE_CHANGED, this._onNodeScaleChanged, this);
  },
  _onNodePositionChanged: function _onNodePositionChanged() {
    this.syncPosition(true);
  },
  _onNodeRotationChanged: function _onNodeRotationChanged(event) {
    this.syncRotation(true);
  },
  _onNodeScaleChanged: function _onNodeScaleChanged(event) {
    if (this._b2Body) {
      var colliders = this.getComponents(cc.PhysicsCollider);

      for (var i = 0; i < colliders.length; i++) {
        colliders[i].apply();
      }
    }
  },
  _init: function _init() {
    cc.director.getPhysicsManager().pushDelayEvent(this, '__init', []);
  },
  _destroy: function _destroy() {
    cc.director.getPhysicsManager().pushDelayEvent(this, '__destroy', []);
  },
  __init: function __init() {
    if (this._inited) return;

    this._registerNodeEvents();

    var bodyDef = new b2.BodyDef();

    if (this.type === BodyType.Animated) {
      bodyDef.type = BodyType.Kinematic;
    } else {
      bodyDef.type = this.type;
    }

    bodyDef.allowSleep = this.allowSleep;
    bodyDef.gravityScale = this.gravityScale;
    bodyDef.linearDamping = this.linearDamping;
    bodyDef.angularDamping = this.angularDamping;
    var linearVelocity = this.linearVelocity;
    bodyDef.linearVelocity = new b2.Vec2(linearVelocity.x / PTM_RATIO, linearVelocity.y / PTM_RATIO);
    bodyDef.angularVelocity = this.angularVelocity * ANGLE_TO_PHYSICS_ANGLE;
    bodyDef.fixedRotation = this.fixedRotation;
    bodyDef.bullet = this.bullet;
    var node = this.node;
    var pos = node.convertToWorldSpaceAR(VEC2_ZERO);
    bodyDef.position = new b2.Vec2(pos.x / PTM_RATIO, pos.y / PTM_RATIO);
    bodyDef.angle = -(Math.PI / 180) * getWorldRotation(node);
    bodyDef.awake = this.awakeOnLoad;

    cc.director.getPhysicsManager()._addBody(this, bodyDef);

    this._inited = true;
  },
  __destroy: function __destroy() {
    if (!this._inited) return;

    cc.director.getPhysicsManager()._removeBody(this);

    this._unregisterNodeEvents();

    this._inited = false;
  },
  _getBody: function _getBody() {
    return this._b2Body;
  }
});
cc.RigidBody = module.exports = RigidBody;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDUmlnaWRCb2R5LmpzIl0sIm5hbWVzIjpbIk5vZGVFdmVudCIsInJlcXVpcmUiLCJFdmVudFR5cGUiLCJQVE1fUkFUSU8iLCJBTkdMRV9UT19QSFlTSUNTX0FOR0xFIiwiUEhZU0lDU19BTkdMRV9UT19BTkdMRSIsImdldFdvcmxkUm90YXRpb24iLCJCb2R5VHlwZSIsInRlbXBiMlZlYzIxIiwiYjIiLCJWZWMyIiwidGVtcGIyVmVjMjIiLCJWRUMyX1pFUk8iLCJjYyIsIlpFUk8iLCJSaWdpZEJvZHkiLCJDbGFzcyIsIm5hbWUiLCJDb21wb25lbnQiLCJlZGl0b3IiLCJDQ19FRElUT1IiLCJtZW51IiwiZGlzYWxsb3dNdWx0aXBsZSIsInByb3BlcnRpZXMiLCJfdHlwZSIsIkR5bmFtaWMiLCJfYWxsb3dTbGVlcCIsIl9ncmF2aXR5U2NhbGUiLCJfbGluZWFyRGFtcGluZyIsIl9hbmd1bGFyRGFtcGluZyIsIl9saW5lYXJWZWxvY2l0eSIsInYyIiwiX2FuZ3VsYXJWZWxvY2l0eSIsIl9maXhlZFJvdGF0aW9uIiwiZW5hYmxlZCIsImdldCIsIl9lbmFibGVkIiwic2V0Iiwid2FybklEIiwidmlzaWJsZSIsIm92ZXJyaWRlIiwiZW5hYmxlZENvbnRhY3RMaXN0ZW5lciIsInRvb2x0aXAiLCJDQ19ERVYiLCJidWxsZXQiLCJ0eXBlIiwidmFsdWUiLCJfYjJCb2R5IiwiQW5pbWF0ZWQiLCJTZXRUeXBlIiwiS2luZW1hdGljIiwiYWxsb3dTbGVlcCIsIklzU2xlZXBpbmdBbGxvd2VkIiwiU2V0U2xlZXBpbmdBbGxvd2VkIiwiZ3Jhdml0eVNjYWxlIiwiU2V0R3Jhdml0eVNjYWxlIiwibGluZWFyRGFtcGluZyIsIlNldExpbmVhckRhbXBpbmciLCJhbmd1bGFyRGFtcGluZyIsIlNldEFuZ3VsYXJEYW1waW5nIiwibGluZWFyVmVsb2NpdHkiLCJsdiIsInZlbG9jaXR5IiwiR2V0TGluZWFyVmVsb2NpdHkiLCJ4IiwieSIsImIyYm9keSIsInRlbXAiLCJtX2xpbmVhclZlbG9jaXR5IiwiU2V0IiwiU2V0TGluZWFyVmVsb2NpdHkiLCJhbmd1bGFyVmVsb2NpdHkiLCJHZXRBbmd1bGFyVmVsb2NpdHkiLCJTZXRBbmd1bGFyVmVsb2NpdHkiLCJmaXhlZFJvdGF0aW9uIiwiU2V0Rml4ZWRSb3RhdGlvbiIsImF3YWtlIiwiSXNBd2FrZSIsIlNldEF3YWtlIiwiYXdha2VPbkxvYWQiLCJhbmltYXRhYmxlIiwiYWN0aXZlIiwiSXNBY3RpdmUiLCJTZXRBY3RpdmUiLCJnZXRMb2NhbFBvaW50Iiwid29ybGRQb2ludCIsIm91dCIsInBvcyIsIkdldExvY2FsUG9pbnQiLCJnZXRXb3JsZFBvaW50IiwibG9jYWxQb2ludCIsIkdldFdvcmxkUG9pbnQiLCJnZXRXb3JsZFZlY3RvciIsImxvY2FsVmVjdG9yIiwidmVjdG9yIiwiR2V0V29ybGRWZWN0b3IiLCJnZXRMb2NhbFZlY3RvciIsIndvcmxkVmVjdG9yIiwiR2V0TG9jYWxWZWN0b3IiLCJnZXRXb3JsZFBvc2l0aW9uIiwiR2V0UG9zaXRpb24iLCJHZXRBbmdsZSIsImdldExvY2FsQ2VudGVyIiwiR2V0TG9jYWxDZW50ZXIiLCJnZXRXb3JsZENlbnRlciIsIkdldFdvcmxkQ2VudGVyIiwiZ2V0TGluZWFyVmVsb2NpdHlGcm9tV29ybGRQb2ludCIsIkdldExpbmVhclZlbG9jaXR5RnJvbVdvcmxkUG9pbnQiLCJnZXRNYXNzIiwiR2V0TWFzcyIsImdldEluZXJ0aWEiLCJHZXRJbmVydGlhIiwiZ2V0Sm9pbnRMaXN0Iiwiam9pbnRzIiwibGlzdCIsIkdldEpvaW50TGlzdCIsInB1c2giLCJqb2ludCIsIl9qb2ludCIsInByZXYiLCJuZXh0IiwiYXBwbHlGb3JjZSIsImZvcmNlIiwicG9pbnQiLCJ3YWtlIiwiQXBwbHlGb3JjZSIsImFwcGx5Rm9yY2VUb0NlbnRlciIsIkFwcGx5Rm9yY2VUb0NlbnRlciIsImFwcGx5VG9ycXVlIiwidG9ycXVlIiwiQXBwbHlUb3JxdWUiLCJhcHBseUxpbmVhckltcHVsc2UiLCJpbXB1bHNlIiwiQXBwbHlMaW5lYXJJbXB1bHNlIiwiYXBwbHlBbmd1bGFySW1wdWxzZSIsIkFwcGx5QW5ndWxhckltcHVsc2UiLCJzeW5jUG9zaXRpb24iLCJlbmFibGVBbmltYXRlZCIsIm5vZGUiLCJjb252ZXJ0VG9Xb3JsZFNwYWNlQVIiLCJiMlBvcyIsInRpbWVTdGVwIiwiZ2FtZSIsImNvbmZpZyIsIlNldFRyYW5zZm9ybVZlYyIsInN5bmNSb3RhdGlvbiIsInJvdGF0aW9uIiwiYjJSb3RhdGlvbiIsInJlc2V0VmVsb2NpdHkiLCJvbkVuYWJsZSIsIl9pbml0Iiwib25EaXNhYmxlIiwiX2Rlc3Ryb3kiLCJfcmVnaXN0ZXJOb2RlRXZlbnRzIiwib24iLCJQT1NJVElPTl9DSEFOR0VEIiwiX29uTm9kZVBvc2l0aW9uQ2hhbmdlZCIsIlJPVEFUSU9OX0NIQU5HRUQiLCJfb25Ob2RlUm90YXRpb25DaGFuZ2VkIiwiU0NBTEVfQ0hBTkdFRCIsIl9vbk5vZGVTY2FsZUNoYW5nZWQiLCJfdW5yZWdpc3Rlck5vZGVFdmVudHMiLCJvZmYiLCJldmVudCIsImNvbGxpZGVycyIsImdldENvbXBvbmVudHMiLCJQaHlzaWNzQ29sbGlkZXIiLCJpIiwibGVuZ3RoIiwiYXBwbHkiLCJkaXJlY3RvciIsImdldFBoeXNpY3NNYW5hZ2VyIiwicHVzaERlbGF5RXZlbnQiLCJfX2luaXQiLCJfaW5pdGVkIiwiYm9keURlZiIsIkJvZHlEZWYiLCJwb3NpdGlvbiIsImFuZ2xlIiwiTWF0aCIsIlBJIiwiX2FkZEJvZHkiLCJfX2Rlc3Ryb3kiLCJfcmVtb3ZlQm9keSIsIl9nZXRCb2R5IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLElBQU1BLFNBQVMsR0FBR0MsT0FBTyxDQUFDLFdBQUQsQ0FBUCxDQUFxQkMsU0FBdkM7O0FBQ0EsSUFBSUMsU0FBUyxHQUFHRixPQUFPLENBQUMsa0JBQUQsQ0FBUCxDQUE0QkUsU0FBNUM7O0FBQ0EsSUFBSUMsc0JB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QUNuRyxLQUFSLEdBQWdCLEtBQUtHLFdBQXJCOztBQUVBbEUsSUFBQUEsRUFBRSxDQUFDNkosUUFBSCxDQUFZQyxpQkFBWixHQUFnQ1UsUUFBaEMsQ0FBeUMsSUFBekMsRUFBK0NOLE9BQS9DOztBQUVBLFNBQUtELE9BQUwsR0FBZSxJQUFmO0FBQ0gsR0ExMkJvQjtBQTIyQnJCUSxFQUFBQSxTQUFTLEVBQUUscUJBQVk7QUFDbkIsUUFBSSxDQUFDLEtBQUtSLE9BQVYsRUFBbUI7O0FBRW5CakssSUFBQUEsRUFBRSxDQUFDNkosUUFBSCxDQUFZQyxpQkFBWixHQUFnQ1ksV0FBaEMsQ0FBNEMsSUFBNUM7O0FBQ0EsU0FBS3RCLHFCQUFMOztBQUVBLFNBQUthLE9BQUwsR0FBZSxLQUFmO0FBQ0gsR0FsM0JvQjtBQW8zQnJCVSxFQUFBQSxRQUFRLEVBQUUsb0JBQVk7QUFDbEIsV0FBTyxLQUFLekksT0FBWjtBQUNIO0FBdDNCb0IsQ0FBVCxDQUFoQjtBQTAzQkFsQyxFQUFFLENBQUNFLFNBQUgsR0FBZTBLLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjNLLFNBQWhDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBOb2RlRXZlbnQgPSByZXF1aXJlKCcuLi9DQ05vZGUnKS5FdmVudFR5cGU7XG52YXIgUFRNX1JBVElPID0gcmVxdWlyZSgnLi9DQ1BoeXNpY3NUeXBlcycpLlBUTV9SQVRJTztcbnZhciBBTkdMRV9UT19QSFlTSUNTX0FOR0xFID0gcmVxdWlyZSgnLi9DQ1BoeXNpY3NUeXBlcycpLkFOR0xFX1RPX1BIWVNJQ1NfQU5HTEU7XG52YXIgUEhZU0lDU19BTkdMRV9UT19BTkdMRSA9IHJlcXVpcmUoJy4vQ0NQaHlzaWNzVHlwZXMnKS5QSFlTSUNTX0FOR0xFX1RPX0FOR0xFO1xuXG52YXIgZ2V0V29ybGRSb3RhdGlvbiA9IHJlcXVpcmUoJy4vdXRpbHMnKS5nZXRXb3JsZFJvdGF0aW9uO1xudmFyIEJvZHlUeXBlID0gcmVxdWlyZSgnLi9DQ1BoeXNpY3NUeXBlcycpLkJvZHlUeXBlO1xuXG52YXIgdGVtcGIyVmVjMjEgPSBuZXcgYjIuVmVjMigpO1xudmFyIHRlbXBiMlZlYzIyID0gbmV3IGIyLlZlYzIoKTtcblxudmFyIFZFQzJfWkVSTyA9IGNjLlZlYzIuWkVSTztcblxuLyoqXG4gKiBAY2xhc3MgUmlnaWRCb2R5XG4gKiBAZXh0ZW5kcyBDb21wb25lbnRcbiAqL1xudmFyIFJpZ2lkQm9keSA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuUmlnaWRCb2R5JyxcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBlZGl0b3I6IENDX0VESVRPUiAmJiB7XG4gICAgICAgIG1lbnU6ICdpMThuOk1BSU5fTUVOVS5jb21wb25lbnQucGh5c2ljcy9SaWdpZCBCb2R5JyxcbiAgICAgICAgZGlzYWxsb3dNdWx0aXBsZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIF90eXBlOiBCb2R5VHlwZS5EeW5hbWljLFxuICAgICAgICBfYWxsb3dTbGVlcDogdHJ1ZSxcbiAgICAgICAgX2dyYXZpdHlTY2FsZTogMSxcbiAgICAgICAgX2xpbmVhckRhbXBpbmc6IDAsXG4gICAgICAgIF9hbmd1bGFyRGFtcGluZzogMCxcbiAgICAgICAgX2xpbmVhclZlbG9jaXR5OiBjYy52MigwLCAwKSxcbiAgICAgICAgX2FuZ3VsYXJWZWxvY2l0eTogMCxcbiAgICAgICAgX2ZpeGVkUm90YXRpb246IGZhbHNlLFxuXG4gICAgICAgIGVuYWJsZWQ6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9lbmFibGVkO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNjLndhcm5JRCg4MjAwKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIG92ZXJyaWRlOiB0cnVlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogU2hvdWxkIGVuYWJsZWQgY29udGFjdCBsaXN0ZW5lcj9cbiAgICAgICAgICogV2hlbiBhIGNvbGxpc2lvbiBpcyB0cmlnZ2VyLCB0aGUgY29sbGlzaW9uIGNhbGxiYWNrIHdpbGwgb25seSBiZSBjYWxsZWQgd2hlbiBlbmFibGVkIGNvbnRhY3QgbGlzdGVuZXIuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5piv5ZCm5ZCv55So5o6l6Kem5o6l5ZCs5Zmo44CCXG4gICAgICAgICAqIOW9kyBjb2xsaWRlciDkuqfnlJ/norDmkp7ml7bvvIzlj6rmnInlvIDlkK/kuobmjqXop6bmjqXlkKzlmajmiY3kvJrosIPnlKjnm7jlupTnmoTlm57osIPlh73mlbBcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBlbmFibGVkQ29udGFjdExpc3RlbmVyXG4gICAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgICAqL1xuICAgICAgICBlbmFibGVkQ29udGFjdExpc3RlbmVyOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGh5c2ljcy5yaWdpZGJvZHkuZW5hYmxlZENvbnRhY3RMaXN0ZW5lcidcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBDb2xsaXNpb24gY2FsbGJhY2suXG4gICAgICAgICAqIENhbGxlZCB3aGVuIHR3byBjb2xsaWRlciBiZWdpbiB0byB0b3VjaC5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDnorDmkp7lm57osIPjgIJcbiAgICAgICAgICog5aaC5p6c5L2g55qE6ISa5pys5Lit5a6e546w5LqG6L+Z5Liq5Ye95pWw77yM6YKj5LmI5a6D5bCG5Lya5Zyo5Lik5Liq56Kw5pKe5L2T5byA5aeL5o6l6Kem5pe26KKr6LCD55So44CCXG4gICAgICAgICAqIEBtZXRob2Qgb25CZWdpbkNvbnRhY3RcbiAgICAgICAgICogQHBhcmFtIHtQaHlzaWNzQ29udGFjdH0gY29udGFjdCAtIGNvbnRhY3QgaW5mb3JtYXRpb25cbiAgICAgICAgICogQHBhcmFtIHtQaHlzaWNzQ29sbGlkZXJ9IHNlbGZDb2xsaWRlciAtIHRoZSBjb2xsaWRlciBiZWxvbmcgdG8gdGhpcyByaWdpZGJvZHlcbiAgICAgICAgICogQHBhcmFtIHtQaHlzaWNzQ29sbGlkZXJ9IG90aGVyQ29sbGlkZXIgLSB0aGUgY29sbGlkZXIgYmVsb25nIHRvIGFub3RoZXIgcmlnaWRib2R5XG4gICAgICAgICAqL1xuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBDb2xsaXNpb24gY2FsbGJhY2suXG4gICAgICAgICAqIENhbGxlZCB3aGVuIHR3byBjb2xsaWRlciBjZWFzZSB0byB0b3VjaC5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDnorDmkp7lm57osIPjgIJcbiAgICAgICAgICog5aaC5p6c5L2g55qE6ISa5pys5Lit5a6e546w5LqG6L+Z5Liq5Ye95pWw77yM6YKj5LmI5a6D5bCG5Lya5Zyo5Lik5Liq56Kw5pKe5L2T5YGc5q2i5o6l6Kem5pe26KKr6LCD55So44CCXG4gICAgICAgICAqIEBtZXRob2Qgb25FbmRDb250YWN0XG4gICAgICAgICAqIEBwYXJhbSB7UGh5c2ljc0NvbnRhY3R9IGNvbnRhY3QgLSBjb250YWN0IGluZm9ybWF0aW9uXG4gICAgICAgICAqIEBwYXJhbSB7UGh5c2ljc0NvbGxpZGVyfSBzZWxmQ29sbGlkZXIgLSB0aGUgY29sbGlkZXIgYmVsb25nIHRvIHRoaXMgcmlnaWRib2R5XG4gICAgICAgICAqIEBwYXJhbSB7UGh5c2ljc0NvbGxpZGVyfSBvdGhlckNvbGxpZGVyIC0gdGhlIGNvbGxpZGVyIGJlbG9uZyB0byBhbm90aGVyIHJpZ2lkYm9keVxuICAgICAgICAgKi9cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogQ29sbGlzaW9uIGNhbGxiYWNrLlxuICAgICAgICAgKiBUaGlzIGlzIGNhbGxlZCB3aGVuIGEgY29udGFjdCBpcyB1cGRhdGVkLiBcbiAgICAgICAgICogVGhpcyBhbGxvd3MgeW91IHRvIGluc3BlY3QgYSBjb250YWN0IGJlZm9yZSBpdCBnb2VzIHRvIHRoZSBzb2x2ZXIoZS5nLiBkaXNhYmxlIGNvbnRhY3QpLlxuXHQgICAgICogTm90ZTogdGhpcyBpcyBjYWxsZWQgb25seSBmb3IgYXdha2UgYm9kaWVzLlxuXHQgICAgICogTm90ZTogdGhpcyBpcyBjYWxsZWQgZXZlbiB3aGVuIHRoZSBudW1iZXIgb2YgY29udGFjdCBwb2ludHMgaXMgemVyby5cblx0ICAgICAqIE5vdGU6IHRoaXMgaXMgbm90IGNhbGxlZCBmb3Igc2Vuc29ycy5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDnorDmkp7lm57osIPjgIJcbiAgICAgICAgICog5aaC5p6c5L2g55qE6ISa5pys5Lit5a6e546w5LqG6L+Z5Liq5Ye95pWw77yM6YKj5LmI5a6D5bCG5Lya5Zyo5o6l6Kem5pu05paw5pe26KKr6LCD55So44CCXG4gICAgICAgICAqIOS9oOWPr+S7peWcqOaOpeinpuiiq+WkhOeQhuWJjeagueaNruS7luWMheWQq+eahOS/oeaBr+S9nOWHuuebuOW6lOeahOWkhOeQhu+8jOavlOWmguWwhui/meS4quaOpeinpuemgeeUqOaOieOAglxuICAgICAgICAgKiDms6jmhI/vvJrlm57osIPlj6rkvJrkuLrphpLnnYDnmoTliJrkvZPosIPnlKjjgIJcbiAgICAgICAgICog5rOo5oSP77ya5o6l6Kem54K55Li66Zu255qE5pe25YCZ5Lmf5pyJ5Y+v6IO96KKr6LCD55So44CCXG4gICAgICAgICAqIOazqOaEj++8muaEn+efpeS9kyhzZW5zb3Ip55qE5Zue6LCD5LiN5Lya6KKr6LCD55So44CCXG4gICAgICAgICAqIEBtZXRob2Qgb25QcmVTb2x2ZVxuICAgICAgICAgKiBAcGFyYW0ge1BoeXNpY3NDb250YWN0fSBjb250YWN0IC0gY29udGFjdCBpbmZvcm1hdGlvblxuICAgICAgICAgKiBAcGFyYW0ge1BoeXNpY3NDb2xsaWRlcn0gc2VsZkNvbGxpZGVyIC0gdGhlIGNvbGxpZGVyIGJlbG9uZyB0byB0aGlzIHJpZ2lkYm9keVxuICAgICAgICAgKiBAcGFyYW0ge1BoeXNpY3NDb2xsaWRlcn0gb3RoZXJDb2xsaWRlciAtIHRoZSBjb2xsaWRlciBiZWxvbmcgdG8gYW5vdGhlciByaWdpZGJvZHlcbiAgICAgICAgICovXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIENvbGxpc2lvbiBjYWxsYmFjay5cbiAgICAgICAgICogVGhpcyBpcyBjYWxsZWQgYWZ0ZXIgYSBjb250YWN0IGlzIHVwZGF0ZWQuIFxuICAgICAgICAgKiBZb3UgY2FuIGdldCB0aGUgaW1wdWxzZXMgZnJvbSB0aGUgY29udGFjdCBpbiB0aGlzIGNhbGxiYWNrLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOeisOaSnuWbnuiwg+OAglxuICAgICAgICAgKiDlpoLmnpzkvaDnmoTohJrmnKzkuK3lrp7njrDkuobov5nkuKrlh73mlbDvvIzpgqPkuYjlroPlsIbkvJrlnKjmjqXop6bmm7TmlrDlrozlkI7ooqvosIPnlKjjgIJcbiAgICAgICAgICog5L2g5Y+v5Lul5Zyo6L+Z5Liq5Zue6LCD5Lit5LuO5o6l6Kem5L+h5oGv5Lit6I635Y+W5Yiw5Yay6YeP5L+h5oGv44CCXG4gICAgICAgICAqIEBtZXRob2Qgb25Qb3N0U29sdmVcbiAgICAgICAgICogQHBhcmFtIHtQaHlzaWNzQ29udGFjdH0gY29udGFjdCAtIGNvbnRhY3QgaW5mb3JtYXRpb25cbiAgICAgICAgICogQHBhcmFtIHtQaHlzaWNzQ29sbGlkZXJ9IHNlbGZDb2xsaWRlciAtIHRoZSBjb2xsaWRlciBiZWxvbmcgdG8gdGhpcyByaWdpZGJvZHlcbiAgICAgICAgICogQHBhcmFtIHtQaHlzaWNzQ29sbGlkZXJ9IG90aGVyQ29sbGlkZXIgLSB0aGUgY29sbGlkZXIgYmVsb25nIHRvIGFub3RoZXIgcmlnaWRib2R5XG4gICAgICAgICAqL1xuICAgICAgICBcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogSXMgdGhpcyBhIGZhc3QgbW92aW5nIGJvZHkgdGhhdCBzaG91bGQgYmUgcHJldmVudGVkIGZyb20gdHVubmVsaW5nIHRocm91Z2hcbiAgICAgICAgICogb3RoZXIgbW92aW5nIGJvZGllcz8gXG4gICAgICAgICAqIE5vdGUgOiBcbiAgICAgICAgICogLSBBbGwgYm9kaWVzIGFyZSBwcmV2ZW50ZWQgZnJvbSB0dW5uZWxpbmcgdGhyb3VnaCBraW5lbWF0aWMgYW5kIHN0YXRpYyBib2RpZXMuIFRoaXMgc2V0dGluZyBpcyBvbmx5IGNvbnNpZGVyZWQgb24gZHluYW1pYyBib2RpZXMuXG4gICAgICAgICAqIC0gWW91IHNob3VsZCB1c2UgdGhpcyBmbGFnIHNwYXJpbmdseSBzaW5jZSBpdCBpbmNyZWFzZXMgcHJvY2Vzc2luZyB0aW1lLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOi/meS4quWImuS9k+aYr+WQpuaYr+S4gOS4quW/q+mAn+enu+WKqOeahOWImuS9k++8jOW5tuS4lOmcgOimgeemgeatouepv+i/h+WFtuS7luW/q+mAn+enu+WKqOeahOWImuS9k++8n1xuICAgICAgICAgKiDpnIDopoHms6jmhI/nmoTmmK8gOiBcbiAgICAgICAgICogIC0g5omA5pyJ5Yia5L2T6YO96KKr56aB5q2i5LuOIOi/kOWKqOWImuS9kyDlkowg6Z2Z5oCB5Yia5L2TIOS4reepv+i/h+OAguatpOmAiemhueWPquWFs+azqOS6jiDliqjmgIHliJrkvZPjgIJcbiAgICAgICAgICogIC0g5bqU6K+l5bC96YeP5bCR55qE5L2/55So5q2k6YCJ6aG577yM5Zug5Li65a6D5Lya5aKe5Yqg56iL5bqP5aSE55CG5pe26Ze044CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gYnVsbGV0XG4gICAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgICAqL1xuICAgICAgICBidWxsZXQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5waHlzaWNzLnJpZ2lkYm9keS5idWxsZXQnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogUmlnaWRib2R5IHR5cGUgOiBTdGF0aWMsIEtpbmVtYXRpYywgRHluYW1pYyBvciBBbmltYXRlZC5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDliJrkvZPnsbvlnovvvJogU3RhdGljLCBLaW5lbWF0aWMsIER5bmFtaWMgb3IgQW5pbWF0ZWQuXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7UmlnaWRCb2R5VHlwZX0gdHlwZVxuICAgICAgICAgKiBAZGVmYXVsdCBSaWdpZEJvZHlUeXBlLkR5bmFtaWNcbiAgICAgICAgICovICAgICAgICBcbiAgICAgICAgdHlwZToge1xuICAgICAgICAgICAgdHlwZTogQm9keVR5cGUsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBoeXNpY3MucmlnaWRib2R5LnR5cGUnLFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3R5cGU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl90eXBlID0gdmFsdWU7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fYjJCb2R5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gQm9keVR5cGUuQW5pbWF0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2IyQm9keS5TZXRUeXBlKEJvZHlUeXBlLktpbmVtYXRpYyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9iMkJvZHkuU2V0VHlwZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogU2V0IHRoaXMgZmxhZyB0byBmYWxzZSBpZiB0aGlzIGJvZHkgc2hvdWxkIG5ldmVyIGZhbGwgYXNsZWVwLlxuICAgICAgICAgKiBOb3RlIHRoYXQgdGhpcyBpbmNyZWFzZXMgQ1BVIHVzYWdlLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOWmguaenOatpOWImuS9k+awuOi/nOmDveS4jeW6lOivpei/m+WFpeedoeecoO+8jOmCo+S5iOiuvue9rui/meS4quWxnuaAp+S4uiBmYWxzZeOAglxuICAgICAgICAgKiDpnIDopoHms6jmhI/ov5nlsIbkvb8gQ1BVIOWNoOeUqOeOh+aPkOmrmOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGFsbG93U2xlZXBcbiAgICAgICAgICogQGRlZmF1bHQgdHJ1ZVxuICAgICAgICAgKi9cbiAgICAgICAgYWxsb3dTbGVlcDoge1xuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5waHlzaWNzLnJpZ2lkYm9keS5hbGxvd1NsZWVwJyxcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9iMkJvZHkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2IyQm9keS5Jc1NsZWVwaW5nQWxsb3dlZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYWxsb3dTbGVlcDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2FsbG93U2xlZXAgPSB2YWx1ZTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9iMkJvZHkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYjJCb2R5LlNldFNsZWVwaW5nQWxsb3dlZCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFxuICAgICAgICAgKiBTY2FsZSB0aGUgZ3Jhdml0eSBhcHBsaWVkIHRvIHRoaXMgYm9keS5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDnvKnmlL7lupTnlKjlnKjmraTliJrkvZPkuIrnmoTph43lipvlgLxcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGdyYXZpdHlTY2FsZVxuICAgICAgICAgKiBAZGVmYXVsdCAxXG4gICAgICAgICAqL1xuICAgICAgICBncmF2aXR5U2NhbGU6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGh5c2ljcy5yaWdpZGJvZHkuZ3Jhdml0eVNjYWxlJyxcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9ncmF2aXR5U2NhbGU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9ncmF2aXR5U2NhbGUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fYjJCb2R5KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2IyQm9keS5TZXRHcmF2aXR5U2NhbGUodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBMaW5lYXIgZGFtcGluZyBpcyB1c2UgdG8gcmVkdWNlIHRoZSBsaW5lYXIgdmVsb2NpdHkuXG4gICAgICAgICAqIFRoZSBkYW1waW5nIHBhcmFtZXRlciBjYW4gYmUgbGFyZ2VyIHRoYW4gMSwgYnV0IHRoZSBkYW1waW5nIGVmZmVjdCBiZWNvbWVzIHNlbnNpdGl2ZSB0byB0aGVcbiAgICAgICAgICogdGltZSBzdGVwIHdoZW4gdGhlIGRhbXBpbmcgcGFyYW1ldGVyIGlzIGxhcmdlLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIExpbmVhciBkYW1waW5nIOeUqOS6juihsOWHj+WImuS9k+eahOe6v+aAp+mAn+W6puOAguihsOWHj+ezu+aVsOWPr+S7peWkp+S6jiAx77yM5L2G5piv5b2T6KGw5YeP57O75pWw5q+U6L6D5aSn55qE5pe25YCZ77yM6KGw5YeP55qE5pWI5p6c5Lya5Y+Y5b6X5q+U6L6D5pWP5oSf44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBsaW5lYXJEYW1waW5nXG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIGxpbmVhckRhbXBpbmc6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGh5c2ljcy5yaWdpZGJvZHkubGluZWFyRGFtcGluZycsXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbGluZWFyRGFtcGluZztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xpbmVhckRhbXBpbmcgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fYjJCb2R5KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2IyQm9keS5TZXRMaW5lYXJEYW1waW5nKHRoaXMuX2xpbmVhckRhbXBpbmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBBbmd1bGFyIGRhbXBpbmcgaXMgdXNlIHRvIHJlZHVjZSB0aGUgYW5ndWxhciB2ZWxvY2l0eS4gVGhlIGRhbXBpbmcgcGFyYW1ldGVyXG4gICAgICAgICAqIGNhbiBiZSBsYXJnZXIgdGhhbiAxIGJ1dCB0aGUgZGFtcGluZyBlZmZlY3QgYmVjb21lcyBzZW5zaXRpdmUgdG8gdGhlXG4gICAgICAgICAqIHRpbWUgc3RlcCB3aGVuIHRoZSBkYW1waW5nIHBhcmFtZXRlciBpcyBsYXJnZS5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiBBbmd1bGFyIGRhbXBpbmcg55So5LqO6KGw5YeP5Yia5L2T55qE6KeS6YCf5bqm44CC6KGw5YeP57O75pWw5Y+v5Lul5aSn5LqOIDHvvIzkvYbmmK/lvZPoobDlh4/ns7vmlbDmr5TovoPlpKfnmoTml7blgJnvvIzoobDlh4/nmoTmlYjmnpzkvJrlj5jlvpfmr5TovoPmlY/mhJ/jgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGFuZ3VsYXJEYW1waW5nXG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIGFuZ3VsYXJEYW1waW5nOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBoeXNpY3MucmlnaWRib2R5LmFuZ3VsYXJEYW1waW5nJyxcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9hbmd1bGFyRGFtcGluZztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2FuZ3VsYXJEYW1waW5nID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2IyQm9keSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9iMkJvZHkuU2V0QW5ndWxhckRhbXBpbmcodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgbGluZWFyIHZlbG9jaXR5IG9mIHRoZSBib2R5J3Mgb3JpZ2luIGluIHdvcmxkIGNvLW9yZGluYXRlcy5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDliJrkvZPlnKjkuJbnlYzlnZDmoIfkuIvnmoTnur/mgKfpgJ/luqZcbiAgICAgICAgICogQHByb3BlcnR5IHtWZWMyfSBsaW5lYXJWZWxvY2l0eVxuICAgICAgICAgKiBAZGVmYXVsdCBjYy52MigwLDApXG4gICAgICAgICAqL1xuICAgICAgICBsaW5lYXJWZWxvY2l0eToge1xuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5waHlzaWNzLnJpZ2lkYm9keS5saW5lYXJWZWxvY2l0eScsXG4gICAgICAgICAgICB0eXBlOiBjYy5WZWMyLFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGx2ID0gdGhpcy5fbGluZWFyVmVsb2NpdHk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2IyQm9keSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmVsb2NpdHkgPSB0aGlzLl9iMkJvZHkuR2V0TGluZWFyVmVsb2NpdHkoKTtcbiAgICAgICAgICAgICAgICAgICAgbHYueCA9IHZlbG9jaXR5LngqUFRNX1JBVElPO1xuICAgICAgICAgICAgICAgICAgICBsdi55ID0gdmVsb2NpdHkueSpQVE1fUkFUSU87XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBsdjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xpbmVhclZlbG9jaXR5ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdmFyIGIyYm9keSA9IHRoaXMuX2IyQm9keTtcbiAgICAgICAgICAgICAgICBpZiAoYjJib2R5KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wID0gYjJib2R5Lm1fbGluZWFyVmVsb2NpdHk7XG4gICAgICAgICAgICAgICAgICAgIHRlbXAuU2V0KHZhbHVlLngvUFRNX1JBVElPLCB2YWx1ZS55L1BUTV9SQVRJTyk7XG4gICAgICAgICAgICAgICAgICAgIGIyYm9keS5TZXRMaW5lYXJWZWxvY2l0eSh0ZW1wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIGFuZ3VsYXIgdmVsb2NpdHkgb2YgdGhlIGJvZHkuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5Yia5L2T55qE6KeS6YCf5bqmXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBhbmd1bGFyVmVsb2NpdHlcbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgYW5ndWxhclZlbG9jaXR5OiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBoeXNpY3MucmlnaWRib2R5LmFuZ3VsYXJWZWxvY2l0eScsXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fYjJCb2R5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9iMkJvZHkuR2V0QW5ndWxhclZlbG9jaXR5KCkgKiBQSFlTSUNTX0FOR0xFX1RPX0FOR0xFO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYW5ndWxhclZlbG9jaXR5O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYW5ndWxhclZlbG9jaXR5ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2IyQm9keSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9iMkJvZHkuU2V0QW5ndWxhclZlbG9jaXR5KCB2YWx1ZSAqIEFOR0xFX1RPX1BIWVNJQ1NfQU5HTEUgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogU2hvdWxkIHRoaXMgYm9keSBiZSBwcmV2ZW50ZWQgZnJvbSByb3RhdGluZz9cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDmmK/lkKbnpoHmraLmraTliJrkvZPov5vooYzml4vovaxcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBmaXhlZFJvdGF0aW9uXG4gICAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgICAqL1xuICAgICAgICBmaXhlZFJvdGF0aW9uOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBoeXNpY3MucmlnaWRib2R5LmZpeGVkUm90YXRpb24nLFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZpeGVkUm90YXRpb247XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9maXhlZFJvdGF0aW9uID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2IyQm9keSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9iMkJvZHkuU2V0Rml4ZWRSb3RhdGlvbih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFNldCB0aGUgc2xlZXAgc3RhdGUgb2YgdGhlIGJvZHkuIEEgc2xlZXBpbmcgYm9keSBoYXMgdmVyeSBsb3cgQ1BVIGNvc3QuKFdoZW4gdGhlIHJpZ2lkIGJvZHkgaXMgaGl0LCBpZiB0aGUgcmlnaWQgYm9keSBpcyBpbiBzbGVlcCBzdGF0ZSwgaXQgd2lsbCBiZSBpbW1lZGlhdGVseSBhd2FrZW5lZC4pXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog6K6+572u5Yia5L2T55qE552h55yg54q25oCB44CCIOedoeecoOeahOWImuS9k+WFt+aciemdnuW4uOS9jueahCBDUFUg5oiQ5pys44CC77yI5b2T5Yia5L2T6KKr56Kw5pKe5Yiw5pe277yM5aaC5p6c5Yia5L2T5aSE5LqO552h55yg54q25oCB77yM5a6D5Lya56uL5Y2z6KKr5ZSk6YaS77yJXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gYXdha2VcbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICovXG4gICAgICAgIGF3YWtlOiB7XG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGh5c2ljcy5yaWdpZGJvZHkuYXdha2UnLFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2IyQm9keSA/IHRoaXMuX2IyQm9keS5Jc0F3YWtlKCkgOiBmYWxzZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9iMkJvZHkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYjJCb2R5LlNldEF3YWtlKCB2YWx1ZSApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBXaGV0aGVyIHRvIHdha2UgdXAgdGhpcyByaWdpZCBib2R5IGR1cmluZyBpbml0aWFsaXphdGlvblxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOaYr+WQpuWcqOWIneWni+WMluaXtuWUpOmGkuatpOWImuS9k1xuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGF3YWtlT25Mb2FkXG4gICAgICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgICAgICovXG4gICAgICAgIGF3YWtlT25Mb2FkOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5waHlzaWNzLnJpZ2lkYm9keS5hd2FrZU9uTG9hZCcsXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBTZXQgdGhlIGFjdGl2ZSBzdGF0ZSBvZiB0aGUgYm9keS4gQW4gaW5hY3RpdmUgYm9keSBpcyBub3Rcblx0ICAgICAqIHNpbXVsYXRlZCBhbmQgY2Fubm90IGJlIGNvbGxpZGVkIHdpdGggb3Igd29rZW4gdXAuXG5cdCAgICAgKiBJZiBib2R5IGlzIGFjdGl2ZSwgYWxsIGZpeHR1cmVzIHdpbGwgYmUgYWRkZWQgdG8gdGhlXG5cdCAgICAgKiBicm9hZC1waGFzZS5cblx0ICAgICAqIElmIGJvZHkgaXMgaW5hY3RpdmUsIGFsbCBmaXh0dXJlcyB3aWxsIGJlIHJlbW92ZWQgZnJvbVxuXHQgICAgICogdGhlIGJyb2FkLXBoYXNlIGFuZCBhbGwgY29udGFjdHMgd2lsbCBiZSBkZXN0cm95ZWQuXG5cdCAgICAgKiBGaXh0dXJlcyBvbiBhbiBpbmFjdGl2ZSBib2R5IGFyZSBpbXBsaWNpdGx5IGluYWN0aXZlIGFuZCB3aWxsXG5cdCAgICAgKiBub3QgcGFydGljaXBhdGUgaW4gY29sbGlzaW9ucywgcmF5LWNhc3RzLCBvciBxdWVyaWVzLlxuXHQgICAgICogSm9pbnRzIGNvbm5lY3RlZCB0byBhbiBpbmFjdGl2ZSBib2R5IGFyZSBpbXBsaWNpdGx5IGluYWN0aXZlLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOiuvue9ruWImuS9k+eahOa/gOa0u+eKtuaAgeOAguS4gOS4qumdnua/gOa0u+eKtuaAgeS4i+eahOWImuS9k+aYr+S4jeS8muiiq+aooeaLn+WSjOeisOaSnueahO+8jOS4jeeuoeWug+aYr+WQpuWkhOS6juedoeecoOeKtuaAgeS4i+OAglxuICAgICAgICAgKiDlpoLmnpzliJrkvZPlpITkuo7mv4DmtLvnirbmgIHkuIvvvIzmiYDmnInlpLnlhbfkvJrooqvmt7vliqDliLAg57KX5rWL6Zi25q6177yIYnJvYWQtcGhhc2XvvInjgIJcbiAgICAgICAgICog5aaC5p6c5Yia5L2T5aSE5LqO6Z2e5r+A5rS754q25oCB5LiL77yM5omA5pyJ5aS55YW35Lya6KKr5LuOIOeyl+a1i+mYtuaute+8iGJyb2FkLXBoYXNl77yJ5Lit56e76Zmk44CCXG4gICAgICAgICAqIOWcqOmdnua/gOa0u+eKtuaAgeS4i+eahOWkueWFt+S4jeS8muWPguS4juWIsOeisOaSnu+8jOWwhOe6v++8jOaIluiAheafpeaJvuS4rVxuICAgICAgICAgKiDpk77mjqXliLDpnZ7mv4DmtLvnirbmgIHkuIvliJrkvZPnmoTlhbPoioLkuZ/mmK/pnZ7mv4DmtLvnmoTjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBhY3RpdmVcbiAgICAgICAgICogQGRlZmF1bHQgdHJ1ZVxuICAgICAgICAgKi9cbiAgICAgICAgYWN0aXZlOiB7XG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9iMkJvZHkgPyB0aGlzLl9iMkJvZHkuSXNBY3RpdmUoKSA6IGZhbHNlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2IyQm9keSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9iMkJvZHkuU2V0QWN0aXZlKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldHMgYSBsb2NhbCBwb2ludCByZWxhdGl2ZSB0byB0aGUgYm9keSdzIG9yaWdpbiBnaXZlbiBhIHdvcmxkIHBvaW50LlxuICAgICAqICEjemhcbiAgICAgKiDlsIbkuIDkuKrnu5nlrprnmoTkuJbnlYzlnZDmoIfns7vkuIvnmoTngrnovazmjaLkuLrliJrkvZPmnKzlnLDlnZDmoIfns7vkuIvnmoTngrlcbiAgICAgKiBAbWV0aG9kIGdldExvY2FsUG9pbnRcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IHdvcmxkUG9pbnQgLSBhIHBvaW50IGluIHdvcmxkIGNvb3JkaW5hdGVzLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gb3V0IC0gb3B0aW9uYWwsIHRoZSByZWNlaXZpbmcgcG9pbnRcbiAgICAgKiBAcmV0dXJuIHtWZWMyfSB0aGUgY29ycmVzcG9uZGluZyBsb2NhbCBwb2ludCByZWxhdGl2ZSB0byB0aGUgYm9keSdzIG9yaWdpbi5cbiAgICAgKi9cbiAgICBnZXRMb2NhbFBvaW50OiBmdW5jdGlvbiAod29ybGRQb2ludCwgb3V0KSB7XG4gICAgICAgIG91dCA9IG91dCB8fCBjYy52MigpO1xuICAgICAgICBpZiAodGhpcy5fYjJCb2R5KSB7XG4gICAgICAgICAgICB0ZW1wYjJWZWMyMS5TZXQod29ybGRQb2ludC54L1BUTV9SQVRJTywgd29ybGRQb2ludC55L1BUTV9SQVRJTyk7XG4gICAgICAgICAgICB2YXIgcG9zID0gdGhpcy5fYjJCb2R5LkdldExvY2FsUG9pbnQodGVtcGIyVmVjMjEsIG91dCk7XG4gICAgICAgICAgICBvdXQueCA9IHBvcy54KlBUTV9SQVRJTztcbiAgICAgICAgICAgIG91dC55ID0gcG9zLnkqUFRNX1JBVElPO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXQgdGhlIHdvcmxkIGNvb3JkaW5hdGVzIG9mIGEgcG9pbnQgZ2l2ZW4gdGhlIGxvY2FsIGNvb3JkaW5hdGVzLlxuICAgICAqICEjemhcbiAgICAgKiDlsIbkuIDkuKrnu5nlrprnmoTliJrkvZPmnKzlnLDlnZDmoIfns7vkuIvnmoTngrnovazmjaLkuLrkuJbnlYzlnZDmoIfns7vkuIvnmoTngrlcbiAgICAgKiBAbWV0aG9kIGdldFdvcmxkUG9pbnRcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGxvY2FsUG9pbnQgLSBhIHBvaW50IGluIGxvY2FsIGNvb3JkaW5hdGVzLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gb3V0IC0gb3B0aW9uYWwsIHRoZSByZWNlaXZpbmcgcG9pbnRcbiAgICAgKiBAcmV0dXJuIHtWZWMyfSB0aGUgc2FtZSBwb2ludCBleHByZXNzZWQgaW4gd29ybGQgY29vcmRpbmF0ZXMuXG4gICAgICovXG4gICAgZ2V0V29ybGRQb2ludDogZnVuY3Rpb24gKGxvY2FsUG9pbnQsIG91dCkge1xuICAgICAgICBvdXQgPSBvdXQgfHwgY2MudjIoKTtcbiAgICAgICAgaWYgKHRoaXMuX2IyQm9keSkge1xuICAgICAgICAgICAgdGVtcGIyVmVjMjEuU2V0KGxvY2FsUG9pbnQueC9QVE1fUkFUSU8sIGxvY2FsUG9pbnQueS9QVE1fUkFUSU8pO1xuICAgICAgICAgICAgdmFyIHBvcyA9IHRoaXMuX2IyQm9keS5HZXRXb3JsZFBvaW50KHRlbXBiMlZlYzIxLCBvdXQpO1xuICAgICAgICAgICAgb3V0LnggPSBwb3MueCpQVE1fUkFUSU87XG4gICAgICAgICAgICBvdXQueSA9IHBvcy55KlBUTV9SQVRJTztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogR2V0IHRoZSB3b3JsZCBjb29yZGluYXRlcyBvZiBhIHZlY3RvciBnaXZlbiB0aGUgbG9jYWwgY29vcmRpbmF0ZXMuXG4gICAgICogISN6aFxuICAgICAqIOWwhuS4gOS4que7meWumueahOS4lueVjOWdkOagh+ezu+S4i+eahOWQkemHj+i9rOaNouS4uuWImuS9k+acrOWcsOWdkOagh+ezu+S4i+eahOWQkemHj1xuICAgICAqIEBtZXRob2QgZ2V0V29ybGRWZWN0b3JcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGxvY2FsVmVjdG9yIC0gYSB2ZWN0b3IgaW4gd29ybGQgY29vcmRpbmF0ZXMuXG4gICAgICogQHBhcmFtIHtWZWMyfSBvdXQgLSBvcHRpb25hbCwgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAgICAgKiBAcmV0dXJuIHtWZWMyfSB0aGUgc2FtZSB2ZWN0b3IgZXhwcmVzc2VkIGluIGxvY2FsIGNvb3JkaW5hdGVzLlxuICAgICAqLyBcbiAgICBnZXRXb3JsZFZlY3RvcjogZnVuY3Rpb24gKGxvY2FsVmVjdG9yLCBvdXQpIHtcbiAgICAgICAgb3V0ID0gb3V0IHx8IGNjLnYyKCk7XG4gICAgICAgIGlmICh0aGlzLl9iMkJvZHkpIHtcbiAgICAgICAgICAgIHRlbXBiMlZlYzIxLlNldChsb2NhbFZlY3Rvci54L1BUTV9SQVRJTywgbG9jYWxWZWN0b3IueS9QVE1fUkFUSU8pO1xuICAgICAgICAgICAgdmFyIHZlY3RvciA9IHRoaXMuX2IyQm9keS5HZXRXb3JsZFZlY3Rvcih0ZW1wYjJWZWMyMSwgb3V0KTtcbiAgICAgICAgICAgIG91dC54ID0gdmVjdG9yLngqUFRNX1JBVElPO1xuICAgICAgICAgICAgb3V0LnkgPSB2ZWN0b3IueSpQVE1fUkFUSU87XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldHMgYSBsb2NhbCB2ZWN0b3IgcmVsYXRpdmUgdG8gdGhlIGJvZHkncyBvcmlnaW4gZ2l2ZW4gYSB3b3JsZCB2ZWN0b3IuXG4gICAgICogISN6aFxuICAgICAqIOWwhuS4gOS4que7meWumueahOS4lueVjOWdkOagh+ezu+S4i+eahOeCuei9rOaNouS4uuWImuS9k+acrOWcsOWdkOagh+ezu+S4i+eahOeCuVxuICAgICAqIEBtZXRob2QgZ2V0TG9jYWxWZWN0b3JcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IHdvcmxkVmVjdG9yIC0gYSB2ZWN0b3IgaW4gd29ybGQgY29vcmRpbmF0ZXMuXG4gICAgICogQHBhcmFtIHtWZWMyfSBvdXQgLSBvcHRpb25hbCwgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAgICAgKiBAcmV0dXJuIHtWZWMyfSB0aGUgY29ycmVzcG9uZGluZyBsb2NhbCB2ZWN0b3IgcmVsYXRpdmUgdG8gdGhlIGJvZHkncyBvcmlnaW4uXG4gICAgICovXG4gICAgZ2V0TG9jYWxWZWN0b3I6IGZ1bmN0aW9uICh3b3JsZFZlY3Rvciwgb3V0KSB7XG4gICAgICAgIG91dCA9IG91dCB8fCBjYy52MigpO1xuICAgICAgICBpZiAodGhpcy5fYjJCb2R5KSB7XG4gICAgICAgICAgICB0ZW1wYjJWZWMyMS5TZXQod29ybGRWZWN0b3IueC9QVE1fUkFUSU8sIHdvcmxkVmVjdG9yLnkvUFRNX1JBVElPKTtcbiAgICAgICAgICAgIHZhciB2ZWN0b3IgPSB0aGlzLl9iMkJvZHkuR2V0TG9jYWxWZWN0b3IodGVtcGIyVmVjMjEsIG91dCk7XG4gICAgICAgICAgICBvdXQueCA9IHZlY3Rvci54KlBUTV9SQVRJTztcbiAgICAgICAgICAgIG91dC55ID0gdmVjdG9yLnkqUFRNX1JBVElPO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXQgdGhlIHdvcmxkIGJvZHkgb3JpZ2luIHBvc2l0aW9uLlxuICAgICAqICEjemhcbiAgICAgKiDojrflj5bliJrkvZPkuJbnlYzlnZDmoIfns7vkuIvnmoTljp/ngrnlgLxcbiAgICAgKiBAbWV0aG9kIGdldFdvcmxkUG9zaXRpb25cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IG91dCAtIG9wdGlvbmFsLCB0aGUgcmVjZWl2aW5nIHBvaW50XG4gICAgICogQHJldHVybiB7VmVjMn0gdGhlIHdvcmxkIHBvc2l0aW9uIG9mIHRoZSBib2R5J3Mgb3JpZ2luLlxuICAgICAqL1xuICAgIGdldFdvcmxkUG9zaXRpb246IGZ1bmN0aW9uIChvdXQpIHtcbiAgICAgICAgb3V0ID0gb3V0IHx8IGNjLnYyKCk7XG4gICAgICAgIGlmICh0aGlzLl9iMkJvZHkpIHtcbiAgICAgICAgICAgIHZhciBwb3MgPSB0aGlzLl9iMkJvZHkuR2V0UG9zaXRpb24oKTtcbiAgICAgICAgICAgIG91dC54ID0gcG9zLngqUFRNX1JBVElPO1xuICAgICAgICAgICAgb3V0LnkgPSBwb3MueSpQVE1fUkFUSU87XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldCB0aGUgd29ybGQgYm9keSByb3RhdGlvbiBhbmdsZS5cbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W5Yia5L2T5LiW55WM5Z2Q5qCH57O75LiL55qE5peL6L2s5YC844CCXG4gICAgICogQG1ldGhvZCBnZXRXb3JsZFJvdGF0aW9uXG4gICAgICogQHJldHVybiB7TnVtYmVyfSB0aGUgY3VycmVudCB3b3JsZCByb3RhdGlvbiBhbmdsZS5cbiAgICAgKi9cbiAgICBnZXRXb3JsZFJvdGF0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9iMkJvZHkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9iMkJvZHkuR2V0QW5nbGUoKSAqIFBIWVNJQ1NfQU5HTEVfVE9fQU5HTEU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXQgdGhlIGxvY2FsIHBvc2l0aW9uIG9mIHRoZSBjZW50ZXIgb2YgbWFzcy5cbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W5Yia5L2T5pys5Zyw5Z2Q5qCH57O75LiL55qE6LSo5b+DXG4gICAgICogQG1ldGhvZCBnZXRMb2NhbENlbnRlclxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IHRoZSBsb2NhbCBwb3NpdGlvbiBvZiB0aGUgY2VudGVyIG9mIG1hc3MuXG4gICAgICovXG4gICAgZ2V0TG9jYWxDZW50ZXI6IGZ1bmN0aW9uIChvdXQpIHtcbiAgICAgICAgb3V0ID0gb3V0IHx8IGNjLnYyKCk7XG4gICAgICAgIGlmICh0aGlzLl9iMkJvZHkpIHtcbiAgICAgICAgICAgIHZhciBwb3MgPSB0aGlzLl9iMkJvZHkuR2V0TG9jYWxDZW50ZXIoKTtcbiAgICAgICAgICAgIG91dC54ID0gcG9zLngqUFRNX1JBVElPO1xuICAgICAgICAgICAgb3V0LnkgPSBwb3MueSpQVE1fUkFUSU87XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldCB0aGUgd29ybGQgcG9zaXRpb24gb2YgdGhlIGNlbnRlciBvZiBtYXNzLlxuICAgICAqICEjemhcbiAgICAgKiDojrflj5bliJrkvZPkuJbnlYzlnZDmoIfns7vkuIvnmoTotKjlv4NcbiAgICAgKiBAbWV0aG9kIGdldFdvcmxkQ2VudGVyXG4gICAgICogQHJldHVybiB7VmVjMn0gdGhlIHdvcmxkIHBvc2l0aW9uIG9mIHRoZSBjZW50ZXIgb2YgbWFzcy5cbiAgICAgKi9cbiAgICBnZXRXb3JsZENlbnRlcjogZnVuY3Rpb24gKG91dCkge1xuICAgICAgICBvdXQgPSBvdXQgfHwgY2MudjIoKTtcbiAgICAgICAgaWYgKHRoaXMuX2IyQm9keSkge1xuICAgICAgICAgICAgdmFyIHBvcyA9IHRoaXMuX2IyQm9keS5HZXRXb3JsZENlbnRlcigpO1xuICAgICAgICAgICAgb3V0LnggPSBwb3MueCpQVE1fUkFUSU87XG4gICAgICAgICAgICBvdXQueSA9IHBvcy55KlBUTV9SQVRJTztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogR2V0IHRoZSB3b3JsZCBsaW5lYXIgdmVsb2NpdHkgb2YgYSB3b3JsZCBwb2ludCBhdHRhY2hlZCB0byB0aGlzIGJvZHkuXG4gICAgICogISN6aFxuICAgICAqIOiOt+WPluWImuS9k+S4iuaMh+WumueCueeahOe6v+aAp+mAn+W6plxuICAgICAqIEBtZXRob2QgZ2V0TGluZWFyVmVsb2NpdHlGcm9tV29ybGRQb2ludFxuICAgICAqIEBwYXJhbSB7VmVjMn0gd29ybGRQb2ludCAtIGEgcG9pbnQgaW4gd29ybGQgY29vcmRpbmF0ZXMuXG4gICAgICogQHBhcmFtIHtWZWMyfSBvdXQgLSBvcHRpb25hbCwgdGhlIHJlY2VpdmluZyBwb2ludFxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IHRoZSB3b3JsZCB2ZWxvY2l0eSBvZiBhIHBvaW50LiBcbiAgICAgKi9cbiAgICBnZXRMaW5lYXJWZWxvY2l0eUZyb21Xb3JsZFBvaW50OiBmdW5jdGlvbiAod29ybGRQb2ludCwgb3V0KSB7XG4gICAgICAgIG91dCA9IG91dCB8fCBjYy52MigpO1xuICAgICAgICBpZiAodGhpcy5fYjJCb2R5KSB7XG4gICAgICAgICAgICB0ZW1wYjJWZWMyMS5TZXQod29ybGRQb2ludC54L1BUTV9SQVRJTywgd29ybGRQb2ludC55L1BUTV9SQVRJTyk7XG4gICAgICAgICAgICB2YXIgdmVsb2NpdHkgPSB0aGlzLl9iMkJvZHkuR2V0TGluZWFyVmVsb2NpdHlGcm9tV29ybGRQb2ludCh0ZW1wYjJWZWMyMSwgb3V0KTtcbiAgICAgICAgICAgIG91dC54ID0gdmVsb2NpdHkueCpQVE1fUkFUSU87XG4gICAgICAgICAgICBvdXQueSA9IHZlbG9jaXR5LnkqUFRNX1JBVElPO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXQgdG90YWwgbWFzcyBvZiB0aGUgYm9keS5cbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W5Yia5L2T55qE6LSo6YeP44CCXG4gICAgICogQG1ldGhvZCBnZXRNYXNzXG4gICAgICogQHJldHVybiB7TnVtYmVyfSB0aGUgdG90YWwgbWFzcyBvZiB0aGUgYm9keS5cbiAgICAgKi9cbiAgICBnZXRNYXNzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9iMkJvZHkgPyB0aGlzLl9iMkJvZHkuR2V0TWFzcygpIDogMDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldCB0aGUgcm90YXRpb25hbCBpbmVydGlhIG9mIHRoZSBib2R5IGFib3V0IHRoZSBsb2NhbCBvcmlnaW4uXG4gICAgICogISN6aFxuICAgICAqIOiOt+WPluWImuS9k+acrOWcsOWdkOagh+ezu+S4i+WOn+eCueeahOaXi+i9rOaDr+aAp1xuICAgICAqIEBtZXRob2QgZ2V0SW5lcnRpYVxuICAgICAqIEByZXR1cm4ge051bWJlcn0gdGhlIHJvdGF0aW9uYWwgaW5lcnRpYSwgdXN1YWxseSBpbiBrZy1tXjIuXG4gICAgICovXG4gICAgZ2V0SW5lcnRpYTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYjJCb2R5ID8gdGhpcy5fYjJCb2R5LkdldEluZXJ0aWEoKSAqIFBUTV9SQVRJTyAqIFBUTV9SQVRJTyA6IDA7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXQgYWxsIHRoZSBqb2ludHMgY29ubmVjdCB0byB0aGUgcmlnaWRib2R5LlxuICAgICAqICEjemhcbiAgICAgKiDojrflj5bpk77mjqXliLDmraTliJrkvZPnmoTmiYDmnInlhbPoioJcbiAgICAgKiBAbWV0aG9kIGdldEpvaW50TGlzdFxuICAgICAqIEByZXR1cm4ge1tKb2ludF19IHRoZSBqb2ludCBsaXN0LlxuICAgICAqL1xuICAgIGdldEpvaW50TGlzdDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2IyQm9keSkgcmV0dXJuIFtdO1xuXG4gICAgICAgIHZhciBqb2ludHMgPSBbXTtcblxuICAgICAgICB2YXIgbGlzdCA9IHRoaXMuX2IyQm9keS5HZXRKb2ludExpc3QoKTtcbiAgICAgICAgaWYgKCFsaXN0KSByZXR1cm4gW107XG5cbiAgICAgICAgam9pbnRzLnB1c2gobGlzdC5qb2ludC5fam9pbnQpO1xuICAgICAgICBcbiAgICAgICAgLy8gZmluZCBwcmV2IGpvaW50XG4gICAgICAgIHZhciBwcmV2ID0gbGlzdC5wcmV2O1xuICAgICAgICB3aGlsZSAocHJldikge1xuICAgICAgICAgICAgam9pbnRzLnB1c2gocHJldi5qb2ludC5fam9pbnQpO1xuICAgICAgICAgICAgcHJldiA9IHByZXYucHJldjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZpbmQgbmV4dCBqb2ludFxuICAgICAgICB2YXIgbmV4dCA9IGxpc3QubmV4dDtcbiAgICAgICAgd2hpbGUgKG5leHQpIHtcbiAgICAgICAgICAgIGpvaW50cy5wdXNoKG5leHQuam9pbnQuX2pvaW50KTtcbiAgICAgICAgICAgIG5leHQgPSBuZXh0Lm5leHQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gam9pbnRzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQXBwbHkgYSBmb3JjZSBhdCBhIHdvcmxkIHBvaW50LiBJZiB0aGUgZm9yY2UgaXMgbm90XG5cdCAqIGFwcGxpZWQgYXQgdGhlIGNlbnRlciBvZiBtYXNzLCBpdCB3aWxsIGdlbmVyYXRlIGEgdG9ycXVlIGFuZFxuXHQgKiBhZmZlY3QgdGhlIGFuZ3VsYXIgdmVsb2NpdHkuXG4gICAgICogISN6aFxuICAgICAqIOaWveWKoOS4gOS4quWKm+WIsOWImuS9k+S4iueahOS4gOS4queCueOAguWmguaenOWKm+ayoeacieaWveWKoOWIsOWImuS9k+eahOi0qOW/g+S4iu+8jOi/mOS8muS6p+eUn+S4gOS4quaJreefqeW5tuS4lOW9seWTjeWIsOinkumAn+W6puOAglxuICAgICAqIEBtZXRob2QgYXBwbHlGb3JjZVxuICAgICAqIEBwYXJhbSB7VmVjMn0gZm9yY2UgLSB0aGUgd29ybGQgZm9yY2UgdmVjdG9yLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gcG9pbnQgLSB0aGUgd29ybGQgcG9zaXRpb24uXG4gICAgICogQHBhcmFtIHtCb29sZWFufSB3YWtlIC0gYWxzbyB3YWtlIHVwIHRoZSBib2R5LlxuICAgICAqL1xuICAgIGFwcGx5Rm9yY2U6IGZ1bmN0aW9uIChmb3JjZSwgcG9pbnQsIHdha2UpIHtcbiAgICAgICAgaWYgKHRoaXMuX2IyQm9keSkge1xuICAgICAgICAgICAgdGVtcGIyVmVjMjEuU2V0KGZvcmNlLngvUFRNX1JBVElPLCBmb3JjZS55L1BUTV9SQVRJTyk7XG4gICAgICAgICAgICB0ZW1wYjJWZWMyMi5TZXQocG9pbnQueC9QVE1fUkFUSU8sIHBvaW50LnkvUFRNX1JBVElPKTtcbiAgICAgICAgICAgIHRoaXMuX2IyQm9keS5BcHBseUZvcmNlKHRlbXBiMlZlYzIxLCB0ZW1wYjJWZWMyMiwgd2FrZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEFwcGx5IGEgZm9yY2UgdG8gdGhlIGNlbnRlciBvZiBtYXNzLlxuICAgICAqICEjemhcbiAgICAgKiDmlr3liqDkuIDkuKrlipvliLDliJrkvZPkuIrnmoTotKjlv4PkuIrjgIJcbiAgICAgKiBAbWV0aG9kIGFwcGx5Rm9yY2VUb0NlbnRlclxuICAgICAqIEBwYXJhbSB7VmVjMn0gZm9yY2UgLSB0aGUgd29ybGQgZm9yY2UgdmVjdG9yLlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gd2FrZSAtIGFsc28gd2FrZSB1cCB0aGUgYm9keS5cbiAgICAgKi9cbiAgICBhcHBseUZvcmNlVG9DZW50ZXI6IGZ1bmN0aW9uIChmb3JjZSwgd2FrZSkge1xuICAgICAgICBpZiAodGhpcy5fYjJCb2R5KSB7XG4gICAgICAgICAgICB0ZW1wYjJWZWMyMS5TZXQoZm9yY2UueC9QVE1fUkFUSU8sIGZvcmNlLnkvUFRNX1JBVElPKTtcbiAgICAgICAgICAgIHRoaXMuX2IyQm9keS5BcHBseUZvcmNlVG9DZW50ZXIodGVtcGIyVmVjMjEsIHdha2UpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBBcHBseSBhIHRvcnF1ZS4gVGhpcyBhZmZlY3RzIHRoZSBhbmd1bGFyIHZlbG9jaXR5LlxuICAgICAqICEjemhcbiAgICAgKiDmlr3liqDkuIDkuKrmia3nn6nlipvvvIzlsIblvbHlk43liJrkvZPnmoTop5LpgJ/luqZcbiAgICAgKiBAbWV0aG9kIGFwcGx5VG9ycXVlXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHRvcnF1ZSAtIGFib3V0IHRoZSB6LWF4aXMgKG91dCBvZiB0aGUgc2NyZWVuKSwgdXN1YWxseSBpbiBOLW0uXG4gICAgICogQHBhcmFtIHtCb29sZWFufSB3YWtlIC0gYWxzbyB3YWtlIHVwIHRoZSBib2R5XG4gICAgICovXG4gICAgYXBwbHlUb3JxdWU6IGZ1bmN0aW9uICh0b3JxdWUsIHdha2UpIHtcbiAgICAgICAgaWYgKHRoaXMuX2IyQm9keSkge1xuICAgICAgICAgICAgdGhpcy5fYjJCb2R5LkFwcGx5VG9ycXVlKHRvcnF1ZS9QVE1fUkFUSU8sIHdha2UpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBBcHBseSBhIGltcHVsc2UgYXQgYSB3b3JsZCBwb2ludCwgVGhpcyBpbW1lZGlhdGVseSBtb2RpZmllcyB0aGUgdmVsb2NpdHkuXG5cdCAqIElmIHRoZSBpbXB1bHNlIGlzIG5vdCBhcHBsaWVkIGF0IHRoZSBjZW50ZXIgb2YgbWFzcywgaXQgd2lsbCBnZW5lcmF0ZSBhIHRvcnF1ZSBhbmRcblx0ICogYWZmZWN0IHRoZSBhbmd1bGFyIHZlbG9jaXR5LlxuICAgICAqICEjemhcbiAgICAgKiDmlr3liqDlhrLph4/liLDliJrkvZPkuIrnmoTkuIDkuKrngrnvvIzlsIbnq4vljbPmlLnlj5jliJrkvZPnmoTnur/mgKfpgJ/luqbjgIJcbiAgICAgKiDlpoLmnpzlhrLph4/mlr3liqDliLDnmoTngrnkuI3mmK/liJrkvZPnmoTotKjlv4PvvIzpgqPkuYjlsIbkuqfnlJ/kuIDkuKrmia3nn6nlubblvbHlk43liJrkvZPnmoTop5LpgJ/luqbjgIJcbiAgICAgKiBAbWV0aG9kIGFwcGx5TGluZWFySW1wdWxzZVxuICAgICAqIEBwYXJhbSB7VmVjMn0gaW1wdWxzZSAtIHRoZSB3b3JsZCBpbXB1bHNlIHZlY3RvciwgdXN1YWxseSBpbiBOLXNlY29uZHMgb3Iga2ctbS9zLlxuICAgICAqIEBwYXJhbSB7VmVjMn0gcG9pbnQgLSB0aGUgd29ybGQgcG9zaXRpb25cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHdha2UgLSBhbHNlIHdha2UgdXAgdGhlIGJvZHlcbiAgICAgKi9cbiAgICBhcHBseUxpbmVhckltcHVsc2U6IGZ1bmN0aW9uIChpbXB1bHNlLCBwb2ludCwgd2FrZSkge1xuICAgICAgICBpZiAodGhpcy5fYjJCb2R5KSB7XG4gICAgICAgICAgICB0ZW1wYjJWZWMyMS5TZXQoaW1wdWxzZS54L1BUTV9SQVRJTywgaW1wdWxzZS55L1BUTV9SQVRJTyk7XG4gICAgICAgICAgICB0ZW1wYjJWZWMyMi5TZXQocG9pbnQueC9QVE1fUkFUSU8sIHBvaW50LnkvUFRNX1JBVElPKTtcbiAgICAgICAgICAgIHRoaXMuX2IyQm9keS5BcHBseUxpbmVhckltcHVsc2UodGVtcGIyVmVjMjEsIHRlbXBiMlZlYzIyLCB3YWtlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQXBwbHkgYW4gYW5ndWxhciBpbXB1bHNlLlxuICAgICAqICEjemhcbiAgICAgKiDmlr3liqDkuIDkuKrop5LpgJ/luqblhrLph4/jgIJcbiAgICAgKiBAbWV0aG9kIGFwcGx5QW5ndWxhckltcHVsc2VcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaW1wdWxzZSAtIHRoZSBhbmd1bGFyIGltcHVsc2UgaW4gdW5pdHMgb2Yga2cqbSptL3NcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHdha2UgLSBhbHNvIHdha2UgdXAgdGhlIGJvZHlcbiAgICAgKi9cbiAgICBhcHBseUFuZ3VsYXJJbXB1bHNlOiBmdW5jdGlvbiAoaW1wdWxzZSwgd2FrZSkge1xuICAgICAgICBpZiAodGhpcy5fYjJCb2R5KSB7XG4gICAgICAgICAgICB0aGlzLl9iMkJvZHkuQXBwbHlBbmd1bGFySW1wdWxzZShpbXB1bHNlL1BUTV9SQVRJTy9QVE1fUkFUSU8sIHdha2UpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBTeW5jaHJvbml6ZSBub2RlJ3Mgd29ybGQgcG9zaXRpb24gdG8gYm94MmQgcmlnaWRib2R5J3MgcG9zaXRpb24uXG4gICAgICogSWYgZW5hYmxlQW5pbWF0ZWQgaXMgdHJ1ZSBhbmQgcmlnaWRib2R5J3MgdHlwZSBpcyBBbmltYXRlZCB0eXBlLCBcbiAgICAgKiB3aWxsIHNldCBsaW5lYXIgdmVsb2NpdHkgaW5zdGVhZCBvZiBkaXJlY3RseSBzZXQgcmlnaWRib2R5J3MgcG9zaXRpb24uXG4gICAgICogISN6aFxuICAgICAqIOWQjOatpeiKgueCueeahOS4lueVjOWdkOagh+WIsCBib3gyZCDliJrkvZPnmoTlnZDmoIfkuIrjgIJcbiAgICAgKiDlpoLmnpwgZW5hYmxlQW5pbWF0ZWQg5pivIHRydWXvvIzlubbkuJTliJrkvZPnmoTnsbvlnovmmK8gQW5pbWF0ZWQg77yM6YKj5LmI5bCG6K6+572u5Yia5L2T55qE57q/5oCn6YCf5bqm5p2l5Luj5pu/55u05o6l6K6+572u5Yia5L2T55qE5L2N572u44CCXG4gICAgICogQG1ldGhvZCBzeW5jUG9zaXRpb25cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGVuYWJsZUFuaW1hdGVkXG4gICAgICovXG4gICAgc3luY1Bvc2l0aW9uOiBmdW5jdGlvbiAoZW5hYmxlQW5pbWF0ZWQpIHtcbiAgICAgICAgdmFyIGIyYm9keSA9IHRoaXMuX2IyQm9keTtcbiAgICAgICAgaWYgKCFiMmJvZHkpIHJldHVybjtcblxuICAgICAgICB2YXIgcG9zID0gdGhpcy5ub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUihWRUMyX1pFUk8pO1xuXG4gICAgICAgIHZhciB0ZW1wO1xuICAgICAgICBpZiAodGhpcy50eXBlID09PSBCb2R5VHlwZS5BbmltYXRlZCkge1xuICAgICAgICAgICAgdGVtcCA9IGIyYm9keS5HZXRMaW5lYXJWZWxvY2l0eSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGVtcCA9IGIyYm9keS5HZXRQb3NpdGlvbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGVtcC54ID0gcG9zLnggLyBQVE1fUkFUSU87XG4gICAgICAgIHRlbXAueSA9IHBvcy55IC8gUFRNX1JBVElPO1xuXG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT09IEJvZHlUeXBlLkFuaW1hdGVkICYmIGVuYWJsZUFuaW1hdGVkKSB7XG4gICAgICAgICAgICB2YXIgYjJQb3MgPSBiMmJvZHkuR2V0UG9zaXRpb24oKTtcblxuICAgICAgICAgICAgdmFyIHRpbWVTdGVwID0gY2MuZ2FtZS5jb25maWdbJ2ZyYW1lUmF0ZSddO1xuICAgICAgICAgICAgdGVtcC54ID0gKHRlbXAueCAtIGIyUG9zLngpKnRpbWVTdGVwO1xuICAgICAgICAgICAgdGVtcC55ID0gKHRlbXAueSAtIGIyUG9zLnkpKnRpbWVTdGVwO1xuXG4gICAgICAgICAgICBiMmJvZHkuU2V0QXdha2UodHJ1ZSk7XG4gICAgICAgICAgICBiMmJvZHkuU2V0TGluZWFyVmVsb2NpdHkodGVtcCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBiMmJvZHkuU2V0VHJhbnNmb3JtVmVjKHRlbXAsIGIyYm9keS5HZXRBbmdsZSgpKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFN5bmNocm9uaXplIG5vZGUncyB3b3JsZCBhbmdsZSB0byBib3gyZCByaWdpZGJvZHkncyBhbmdsZS5cbiAgICAgKiBJZiBlbmFibGVBbmltYXRlZCBpcyB0cnVlIGFuZCByaWdpZGJvZHkncyB0eXBlIGlzIEFuaW1hdGVkIHR5cGUsIFxuICAgICAqIHdpbGwgc2V0IGFuZ3VsYXIgdmVsb2NpdHkgaW5zdGVhZCBvZiBkaXJlY3RseSBzZXQgcmlnaWRib2R5J3MgYW5nbGUuXG4gICAgICogISN6aFxuICAgICAqIOWQjOatpeiKgueCueeahOS4lueVjOaXi+i9rOinkuW6puWAvOWIsCBib3gyZCDliJrkvZPnmoTml4vovazlgLzkuIrjgIJcbiAgICAgKiDlpoLmnpwgZW5hYmxlQW5pbWF0ZWQg5pivIHRydWXvvIzlubbkuJTliJrkvZPnmoTnsbvlnovmmK8gQW5pbWF0ZWQg77yM6YKj5LmI5bCG6K6+572u5Yia5L2T55qE6KeS6YCf5bqm5p2l5Luj5pu/55u05o6l6K6+572u5Yia5L2T55qE6KeS5bqm44CCXG4gICAgICogQG1ldGhvZCBzeW5jUm90YXRpb25cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGVuYWJsZUFuaW1hdGVkXG4gICAgICovXG4gICAgc3luY1JvdGF0aW9uOiBmdW5jdGlvbiAoZW5hYmxlQW5pbWF0ZWQpIHtcbiAgICAgICAgdmFyIGIyYm9keSA9IHRoaXMuX2IyQm9keTtcbiAgICAgICAgaWYgKCFiMmJvZHkpIHJldHVybjtcblxuICAgICAgICB2YXIgcm90YXRpb24gPSBBTkdMRV9UT19QSFlTSUNTX0FOR0xFICogZ2V0V29ybGRSb3RhdGlvbih0aGlzLm5vZGUpO1xuICAgICAgICBpZiAodGhpcy50eXBlID09PSBCb2R5VHlwZS5BbmltYXRlZCAmJiBlbmFibGVBbmltYXRlZCkge1xuICAgICAgICAgICAgdmFyIGIyUm90YXRpb24gPSBiMmJvZHkuR2V0QW5nbGUoKTtcbiAgICAgICAgICAgIHZhciB0aW1lU3RlcCA9IGNjLmdhbWUuY29uZmlnWydmcmFtZVJhdGUnXTtcbiAgICAgICAgICAgIGIyYm9keS5TZXRBd2FrZSh0cnVlKTtcbiAgICAgICAgICAgIGIyYm9keS5TZXRBbmd1bGFyVmVsb2NpdHkoKHJvdGF0aW9uIC0gYjJSb3RhdGlvbikqdGltZVN0ZXApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYjJib2R5LlNldFRyYW5zZm9ybVZlYyhiMmJvZHkuR2V0UG9zaXRpb24oKSwgcm90YXRpb24pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBcbiAgICByZXNldFZlbG9jaXR5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBiMmJvZHkgPSB0aGlzLl9iMkJvZHk7XG4gICAgICAgIGlmICghYjJib2R5KSByZXR1cm47XG5cbiAgICAgICAgdmFyIHRlbXAgPSBiMmJvZHkubV9saW5lYXJWZWxvY2l0eTtcbiAgICAgICAgdGVtcC5TZXQoMCwgMCk7XG5cbiAgICAgICAgYjJib2R5LlNldExpbmVhclZlbG9jaXR5KHRlbXApO1xuICAgICAgICBiMmJvZHkuU2V0QW5ndWxhclZlbG9jaXR5KDApO1xuICAgIH0sXG5cbiAgICBvbkVuYWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9pbml0KCk7XG4gICAgfSxcblxuICAgIG9uRGlzYWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9kZXN0cm95KCk7XG4gICAgfSxcblxuICAgIF9yZWdpc3Rlck5vZGVFdmVudHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLm5vZGU7XG4gICAgICAgIG5vZGUub24oTm9kZUV2ZW50LlBPU0lUSU9OX0NIQU5HRUQsIHRoaXMuX29uTm9kZVBvc2l0aW9uQ2hhbmdlZCwgdGhpcyk7XG4gICAgICAgIG5vZGUub24oTm9kZUV2ZW50LlJPVEFUSU9OX0NIQU5HRUQsIHRoaXMuX29uTm9kZVJvdGF0aW9uQ2hhbmdlZCwgdGhpcyk7XG4gICAgICAgIG5vZGUub24oTm9kZUV2ZW50LlNDQUxFX0NIQU5HRUQsIHRoaXMuX29uTm9kZVNjYWxlQ2hhbmdlZCwgdGhpcyk7XG4gICAgfSxcblxuICAgIF91bnJlZ2lzdGVyTm9kZUV2ZW50czogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbm9kZSA9IHRoaXMubm9kZTtcbiAgICAgICAgbm9kZS5vZmYoTm9kZUV2ZW50LlBPU0lUSU9OX0NIQU5HRUQsIHRoaXMuX29uTm9kZVBvc2l0aW9uQ2hhbmdlZCwgdGhpcyk7XG4gICAgICAgIG5vZGUub2ZmKE5vZGVFdmVudC5ST1RBVElPTl9DSEFOR0VELCB0aGlzLl9vbk5vZGVSb3RhdGlvbkNoYW5nZWQsIHRoaXMpO1xuICAgICAgICBub2RlLm9mZihOb2RlRXZlbnQuU0NBTEVfQ0hBTkdFRCwgdGhpcy5fb25Ob2RlU2NhbGVDaGFuZ2VkLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX29uTm9kZVBvc2l0aW9uQ2hhbmdlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnN5bmNQb3NpdGlvbih0cnVlKTtcbiAgICB9LFxuXG4gICAgX29uTm9kZVJvdGF0aW9uQ2hhbmdlZDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc3luY1JvdGF0aW9uKHRydWUpO1xuICAgIH0sXG5cbiAgICBfb25Ob2RlU2NhbGVDaGFuZ2VkOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuX2IyQm9keSkge1xuICAgICAgICAgICAgdmFyIGNvbGxpZGVycyA9IHRoaXMuZ2V0Q29tcG9uZW50cyhjYy5QaHlzaWNzQ29sbGlkZXIpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2xsaWRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb2xsaWRlcnNbaV0uYXBwbHkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgIF9pbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmdldFBoeXNpY3NNYW5hZ2VyKCkucHVzaERlbGF5RXZlbnQodGhpcywgJ19faW5pdCcsIFtdKTtcbiAgICB9LFxuICAgIF9kZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmdldFBoeXNpY3NNYW5hZ2VyKCkucHVzaERlbGF5RXZlbnQodGhpcywgJ19fZGVzdHJveScsIFtdKTtcbiAgICB9LFxuXG4gICAgX19pbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbml0ZWQpIHJldHVybjtcblxuICAgICAgIHRoaXMuX3JlZ2lzdGVyTm9kZUV2ZW50cygpO1xuXG4gICAgICAgIHZhciBib2R5RGVmID0gbmV3IGIyLkJvZHlEZWYoKTtcbiAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT09IEJvZHlUeXBlLkFuaW1hdGVkKSB7XG4gICAgICAgICAgICBib2R5RGVmLnR5cGUgPSBCb2R5VHlwZS5LaW5lbWF0aWM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBib2R5RGVmLnR5cGUgPSB0aGlzLnR5cGU7XG4gICAgICAgIH1cblxuICAgICAgICBib2R5RGVmLmFsbG93U2xlZXAgPSB0aGlzLmFsbG93U2xlZXA7XG4gICAgICAgIGJvZHlEZWYuZ3Jhdml0eVNjYWxlID0gdGhpcy5ncmF2aXR5U2NhbGU7XG4gICAgICAgIGJvZHlEZWYubGluZWFyRGFtcGluZyA9IHRoaXMubGluZWFyRGFtcGluZztcbiAgICAgICAgYm9keURlZi5hbmd1bGFyRGFtcGluZyA9IHRoaXMuYW5ndWxhckRhbXBpbmc7XG5cbiAgICAgICAgdmFyIGxpbmVhclZlbG9jaXR5ID0gdGhpcy5saW5lYXJWZWxvY2l0eTtcbiAgICAgICAgYm9keURlZi5saW5lYXJWZWxvY2l0eSA9IG5ldyBiMi5WZWMyKGxpbmVhclZlbG9jaXR5LngvUFRNX1JBVElPLCBsaW5lYXJWZWxvY2l0eS55L1BUTV9SQVRJTyk7XG5cbiAgICAgICAgYm9keURlZi5hbmd1bGFyVmVsb2NpdHkgPSB0aGlzLmFuZ3VsYXJWZWxvY2l0eSAqIEFOR0xFX1RPX1BIWVNJQ1NfQU5HTEU7XG4gICAgICAgIFxuICAgICAgICBib2R5RGVmLmZpeGVkUm90YXRpb24gPSB0aGlzLmZpeGVkUm90YXRpb247XG4gICAgICAgIGJvZHlEZWYuYnVsbGV0ID0gdGhpcy5idWxsZXQ7XG5cbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLm5vZGU7XG4gICAgICAgIHZhciBwb3MgPSBub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUihWRUMyX1pFUk8pO1xuICAgICAgICBib2R5RGVmLnBvc2l0aW9uID0gbmV3IGIyLlZlYzIocG9zLnggLyBQVE1fUkFUSU8sIHBvcy55IC8gUFRNX1JBVElPKTtcbiAgICAgICAgYm9keURlZi5hbmdsZSA9IC0oTWF0aC5QSSAvIDE4MCkgKiBnZXRXb3JsZFJvdGF0aW9uKG5vZGUpO1xuXG4gICAgICAgIGJvZHlEZWYuYXdha2UgPSB0aGlzLmF3YWtlT25Mb2FkO1xuXG4gICAgICAgIGNjLmRpcmVjdG9yLmdldFBoeXNpY3NNYW5hZ2VyKCkuX2FkZEJvZHkodGhpcywgYm9keURlZik7XG5cbiAgICAgICAgdGhpcy5faW5pdGVkID0gdHJ1ZTtcbiAgICB9LFxuICAgIF9fZGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2luaXRlZCkgcmV0dXJuO1xuXG4gICAgICAgIGNjLmRpcmVjdG9yLmdldFBoeXNpY3NNYW5hZ2VyKCkuX3JlbW92ZUJvZHkodGhpcyk7XG4gICAgICAgIHRoaXMuX3VucmVnaXN0ZXJOb2RlRXZlbnRzKCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLl9pbml0ZWQgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgX2dldEJvZHk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2IyQm9keTtcbiAgICB9LFxuXG59KTtcblxuY2MuUmlnaWRCb2R5ID0gbW9kdWxlLmV4cG9ydHMgPSBSaWdpZEJvZHk7XG4iXX0=