
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/physics/CCPhysicsContact.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
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
var PTM_RATIO = require('./CCPhysicsTypes').PTM_RATIO;

var ContactType = require('./CCPhysicsTypes').ContactType;

var pools = []; // temp world manifold

var pointCache = [cc.v2(), cc.v2()];
var b2worldmanifold = new b2.WorldManifold();
/**
 * @class WorldManifold
 */

var worldmanifold = {
  /**
   * !#en
   * world contact point (point of intersection)
   * !#zh
   * 碰撞点集合
   * @property {[Vec2]} points
   */
  points: [],

  /**
   * !#en
   * a negative value indicates overlap
   * !#zh
   * 一个负数，用于指明重叠的部分
   */
  separations: [],

  /**
   * !#en
   * world vector pointing from A to B
   * !#zh
   * 世界坐标系下由 A 指向 B 的向量
   * @property {Vec2} normal
   */
  normal: cc.v2()
};
/**
 * !#en
 * A manifold point is a contact point belonging to a contact manifold. 
 * It holds details related to the geometry and dynamics of the contact points.
 * Note: the impulses are used for internal caching and may not
 * provide reliable contact forces, especially for high speed collisions.
 * !#zh
 * ManifoldPoint 是接触信息中的接触点信息。它拥有关于几何和接触点的详细信息。
 * 注意：信息中的冲量用于系统内部缓存，提供的接触力可能不是很准确，特别是高速移动中的碰撞信息。
 * @class ManifoldPoint
 */

/**
 * !#en
 * The local point usage depends on the manifold type:
 * -e_circles: the local center of circleB
 * -e_faceA: the local center of circleB or the clip point of polygonB
 * -e_faceB: the clip point of polygonA
 * !#zh
 * 本地坐标点的用途取决于 manifold 的类型
 * - e_circles: circleB 的本地中心点
 * - e_faceA: circleB 的本地中心点 或者是 polygonB 的截取点
 * - e_faceB: polygonB 的截取点
 * @property {Vec2} localPoint
 */

/**
 * !#en
 * Normal impulse.
 * !#zh
 * 法线冲量。
 * @property {Number} normalImpulse
 */

/**
 * !#en
 * Tangent impulse.
 * !#zh
 * 切线冲量。
 * @property {Number} tangentImpulse
 */

function ManifoldPoint() {
  this.localPoint = cc.v2();
  this.normalImpulse = 0;
  this.tangentImpulse = 0;
}

var manifoldPointCache = [new ManifoldPoint(), new ManifoldPoint()];
var b2manifold = new b2.Manifold();
/**
 * @class Manifold
 */

var manifold = {
  /**
   * !#en
   * Manifold type :  0: e_circles, 1: e_faceA, 2: e_faceB
   * !#zh
   * Manifold 类型 :  0: e_circles, 1: e_faceA, 2: e_faceB
   * @property {Number} type
   */
  type: 0,

  /**
   * !#en
   * The local point usage depends on the manifold type:
   * -e_circles: the local center of circleA
   * -e_faceA: the center of faceA
   * -e_faceB: the center of faceB
   * !#zh
   * 用途取决于 manifold 类型
   * -e_circles: circleA 的本地中心点
   * -e_faceA: faceA 的本地中心点
   * -e_faceB: faceB 的本地中心点
   * @property {Vec2} localPoint
   */
  localPoint: cc.v2(),

  /**
   * !#en
   * -e_circles: not used
   * -e_faceA: the normal on polygonA
   * -e_faceB: the normal on polygonB
   * !#zh
   * -e_circles: 没被使用到
   * -e_faceA: polygonA 的法向量
   * -e_faceB: polygonB 的法向量
   * @property {Vec2} localNormal
   */
  localNormal: cc.v2(),

  /**
   * !#en
   * the points of contact.
   * !#zh
   * 接触点信息。
   * @property {[ManifoldPoint]} points
   */
  points: []
};
/**
 * !#en
 * Contact impulses for reporting.
 * !#zh
 * 用于返回给回调的接触冲量。
 * @class PhysicsImpulse
 */

var impulse = {
  /**
   * !#en
   * Normal impulses.
   * !#zh
   * 法线方向的冲量
   * @property normalImpulses
   */
  normalImpulses: [],

  /**
   * !#en
   * Tangent impulses
   * !#zh
   * 切线方向的冲量
   * @property tangentImpulses
   */
  tangentImpulses: []
};
/**
 * !#en
 * PhysicsContact will be generated during begin and end collision as a parameter of the collision callback.
 * Note that contacts will be reused for speed up cpu time, so do not cache anything in the contact.
 * !#zh
 * 物理接触会在开始和结束碰撞之间生成，并作为参数传入到碰撞回调函数中。
 * 注意：传入的物理接触会被系统进行重用，所以不要在使用中缓存里面的任何信息。
 * @class PhysicsContact
 */

function PhysicsContact() {}

PhysicsContact.prototype.init = function (b2contact) {
  this.colliderA = b2contact.GetFixtureA().collider;
  this.colliderB = b2contact.GetFixtureB().collider;
  this.disabled = false;
  this.disabledOnce = false;
  this._impulse = null;
  this._inverted = false;
  this._b2contact = b2contact;
  b2contact._contact = this;
};

PhysicsContact.prototype.reset = function () {
  this.setTangentSpeed(0);
  this.resetFriction();
  this.resetRestitution();
  this.colliderA = null;
  this.colliderB = null;
  this.disabled = false;
  this._impulse = null;
  this._b2contact._contact = null;
  this._b2contact = null;
};
/**
 * !#en
 * Get the world manifold.
 * !#zh
 * 获取世界坐标系下的碰撞信息。
 * @method getWorldManifold
 * @return {WorldManifold}
 */


PhysicsContact.prototype.getWorldManifold = function () {
  var points = worldmanifold.points;
  var separations = worldmanifold.separations;
  var normal = worldmanifold.normal;

  this._b2contact.GetWorldManifold(b2worldmanifold);

  var b2points = b2worldmanifold.points;
  var b2separations = b2worldmanifold.separations;

  var count = this._b2contact.GetManifold().pointCount;

  points.length = separations.length = count;

  for (var i = 0; i < count; i++) {
    var p = pointCache[i];
    p.x = b2points[i].x * PTM_RATIO;
    p.y = b2points[i].y * PTM_RATIO;
    points[i] = p;
    separations[i] = b2separations[i] * PTM_RATIO;
  }

  normal.x = b2worldmanifold.normal.x;
  normal.y = b2worldmanifold.normal.y;

  if (this._inverted) {
    normal.x *= -1;
    normal.y *= -1;
  }

  return worldmanifold;
};
/**
 * !#en
 * Get the manifold.
 * !#zh
 * 获取本地（局部）坐标系下的碰撞信息。
 * @method getManifold
 * @return {Manifold}
 */


PhysicsContact.prototype.getManifold = function () {
  var points = manifold.points;
  var localNormal = manifold.localNormal;
  var localPoint = manifold.localPoint;

  var b2manifold = this._b2contact.GetManifold();

  var b2points = b2manifold.points;
  var count = points.length = b2manifold.pointCount;

  for (var i = 0; i < count; i++) {
    var p = manifoldPointCache[i];
    var b2p = b2points[i];
    p.localPoint.x = b2p.localPoint.x * PTM_RATIO;
    p.localPoint.Y = b2p.localPoint.Y * PTM_RATIO;
    p.normalImpulse = b2p.normalImpulse * PTM_RATIO;
    p.tangentImpulse = b2p.tangentImpulse;
    points[i] = p;
  }

  localPoint.x = b2manifold.localPoint.x * PTM_RATIO;
  localPoint.y = b2manifold.localPoint.y * PTM_RATIO;
  localNormal.x = b2manifold.localNormal.x;
  localNormal.y = b2manifold.localNormal.y;
  manifold.type = b2manifold.type;

  if (this._inverted) {
    localNormal.x *= -1;
    localNormal.y *= -1;
  }

  return manifold;
};
/**
 * !#en
 * Get the impulses.
 * Note: PhysicsImpulse can only used in onPostSolve callback.
 * !#zh
 * 获取冲量信息
 * 注意：这个信息只有在 onPostSolve 回调中才能获取到
 * @method getImpulse
 * @return {PhysicsImpulse}
 */


PhysicsContact.prototype.getImpulse = function () {
  var b2impulse = this._impulse;
  if (!b2impulse) return null;
  var normalImpulses = impulse.normalImpulses;
  var tangentImpulses = impulse.tangentImpulses;
  var count = b2impulse.count;

  for (var i = 0; i < count; i++) {
    normalImpulses[i] = b2impulse.normalImpulses[i] * PTM_RATIO;
    tangentImpulses[i] = b2impulse.tangentImpulses[i];
  }

  tangentImpulses.length = normalImpulses.length = count;
  return impulse;
};

PhysicsContact.prototype.emit = function (contactType) {
  var func;

  switch (contactType) {
    case ContactType.BEGIN_CONTACT:
      func = 'onBeginContact';
      break;

    case ContactType.END_CONTACT:
      func = 'onEndContact';
      break;

    case ContactType.PRE_SOLVE:
      func = 'onPreSolve';
      break;

    case ContactType.POST_SOLVE:
      func = 'onPostSolve';
      break;
  }

  var colliderA = this.colliderA;
  var colliderB = this.colliderB;
  var bodyA = colliderA.body;
  var bodyB = colliderB.body;
  var comps;
  var i, l, comp;

  if (bodyA.enabledContactListener) {
    comps = bodyA.node._components;
    this._inverted = false;

    for (i = 0, l = comps.length; i < l; i++) {
      comp = comps[i];

      if (comp[func]) {
        comp[func](this, colliderA, colliderB);
      }
    }
  }

  if (bodyB.enabledContactListener) {
    comps = bodyB.node._components;
    this._inverted = true;

    for (i = 0, l = comps.length; i < l; i++) {
      comp = comps[i];

      if (comp[func]) {
        comp[func](this, colliderB, colliderA);
      }
    }
  }

  if (this.disabled || this.disabledOnce) {
    this.setEnabled(false);
    this.disabledOnce = false;
  }
};

PhysicsContact.get = function (b2contact) {
  var c;

  if (pools.length === 0) {
    c = new cc.PhysicsContact();
  } else {
    c = pools.pop();
  }

  c.init(b2contact);
  return c;
};

PhysicsContact.put = function (b2contact) {
  var c = b2contact._contact;
  if (!c) return;
  pools.push(c);
  c.reset();
};

var _p = PhysicsContact.prototype;
/**
 * @property {Collider} colliderA
 */

/**
 * @property {Collider} colliderB
 */

/**
 * !#en
 * If set disabled to true, the contact will be ignored until contact end.
 * If you just want to disabled contact for current time step or sub-step, please use disabledOnce.
 * !#zh
 * 如果 disabled 被设置为 true，那么直到接触结束此接触都将被忽略。
 * 如果只是希望在当前时间步或子步中忽略此接触，请使用 disabledOnce 。
 * @property {Boolean} disabled
 */

/**
 * !#en
 * Disabled contact for current time step or sub-step.
 * !#zh
 * 在当前时间步或子步中忽略此接触。
 * @property {Boolean} disabledOnce
 */

_p.setEnabled = function (value) {
  this._b2contact.SetEnabled(value);
};
/**
 * !#en
 * Is this contact touching?
 * !#zh
 * 返回碰撞体是否已经接触到。
 * @method isTouching
 * @return {Boolean}
 */


_p.isTouching = function () {
  return this._b2contact.IsTouching();
};
/**
 * !#en
 * Set the desired tangent speed for a conveyor belt behavior.
 * !#zh
 * 为传送带设置期望的切线速度
 * @method setTangentSpeed
 * @param {Number} tangentSpeed
 */


_p.setTangentSpeed = function (value) {
  this._b2contact.SetTangentSpeed(value / PTM_RATIO);
};
/**
 * !#en
 * Get the desired tangent speed.
 * !#zh
 * 获取切线速度
 * @method getTangentSpeed
 * @return {Number}
 */


_p.getTangentSpeed = function () {
  return this._b2contact.GetTangentSpeed() * PTM_RATIO;
};
/**
 * !#en
 * Override the default friction mixture. You can call this in onPreSolve callback.
 * !#zh
 * 覆盖默认的摩擦力系数。你可以在 onPreSolve 回调中调用此函数。
 * @method setFriction
 * @param {Number} friction
 */


_p.setFriction = function (value) {
  this._b2contact.SetFriction(value);
};
/**
 * !#en
 * Get the friction.
 * !#zh
 * 获取当前摩擦力系数
 * @method getFriction
 * @return {Number}
 */


_p.getFriction = function () {
  return this._b2contact.GetFriction();
};
/**
 * !#en
 * Reset the friction mixture to the default value.
 * !#zh
 * 重置摩擦力系数到默认值
 * @method resetFriction
 */


_p.resetFriction = function () {
  return this._b2contact.ResetFriction();
};
/**
 * !#en
 * Override the default restitution mixture. You can call this in onPreSolve callback.
 * !#zh
 * 覆盖默认的恢复系数。你可以在 onPreSolve 回调中调用此函数。
 * @method setRestitution
 * @param {Number} restitution
 */


_p.setRestitution = function (value) {
  this._b2contact.SetRestitution(value);
};
/**
 * !#en
 * Get the restitution.
 * !#zh
 * 获取当前恢复系数
 * @method getRestitution
 * @return {Number}
 */


_p.getRestitution = function () {
  return this._b2contact.GetRestitution();
};
/**
 * !#en
 * Reset the restitution mixture to the default value.
 * !#zh
 * 重置恢复系数到默认值
 * @method resetRestitution
 */


_p.resetRestitution = function () {
  return this._b2contact.ResetRestitution();
};

PhysicsContact.ContactType = ContactType;
cc.PhysicsContact = module.exports = PhysicsContact;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDUGh5c2ljc0NvbnRhY3QuanMiXSwibmFtZXMiOlsiUFRNX1JBVElPIiwicmVxdWlyZSIsIkNvbnRhY3RUeXBlIiwicG9vbHMiLCJwb2ludENhY2hlIiwiY2MiLCJ2MiIsImIyd29ybGRtYW5pZm9sZCIsImIyIiwiV29ybGRNYW5pZm9sZCIsIndvcmxkbWFuaWZvbGQiLCJwb2ludHMiLCJzZXBhcmF0aW9ucyIsIm5vcm1hbCIsIk1hbmlmb2xkUG9pbnQiLCJsb2NhbFBvaW50Iiwibm9ybWFsSW1wdWxzZSIsInRhbmdlbnRJbXB1bHNlIiwibWFuaWZvbGRQb2ludENhY2hlIiwiYjJtYW5pZm9sZCIsIk1hbmlmb2xkIiwibWFuaWZvbGQiLCJ0eXBlIiwibG9jYWxOb3JtYWwiLCJpbXB1bHNlIiwibm9ybWFsSW1wdWxzZXMiLCJ0YW5nZW50SW1wdWxzZXMiLCJQaHlzaWNzQ29udGFjdCIsInByb3RvdHlwZSIsImluaXQiLCJiMmNvbnRhY3QiLCJjb2xsaWRlckEiLCJHZXRGaXh0dXJlQSIsImNvbGxpZGVyIiwiY29sbGlkZXJCIiwiR2V0Rml4dHVyZUIiLCJkaXNhYmxlZCIsImRpc2FibGVkT25jZSIsIl9pbXB1bHNlIiwiX2ludmVydGVkIiwiX2IyY29udGFjdCIsIl9jb250YWN0IiwicmVzZXQiLCJzZXRUYW5nZW50U3BlZWQiLCJyZXNldEZyaWN0aW9uIiwicmVzZXRSZXN0aXR1dGlvbiIsImdldFdvcmxkTWFuaWZvbGQiLCJHZXRXb3JsZE1hbmlmb2xkIiwiYjJwb2ludHMiLCJiMnNlcGFyYXRpb25zIiwiY291bnQiLCJHZXRNYW5pZm9sZCIsInBvaW50Q291bnQiLCJsZW5ndGgiLCJpIiwicCIsIngiLCJ5IiwiZ2V0TWFuaWZvbGQiLCJiMnAiLCJZIiwiZ2V0SW1wdWxzZSIsImIyaW1wdWxzZSIsImVtaXQiLCJjb250YWN0VHlwZSIsImZ1bmMiLCJCRUdJTl9DT05UQUNUIiwiRU5EX0NPTlRBQ1QiLCJQUkVfU09MVkUiLCJQT1NUX1NPTFZFIiwiYm9keUEiLCJib2R5IiwiYm9keUIiLCJjb21wcyIsImwiLCJjb21wIiwiZW5hYmxlZENvbnRhY3RMaXN0ZW5lciIsIm5vZGUiLCJfY29tcG9uZW50cyIsInNldEVuYWJsZWQiLCJnZXQiLCJjIiwicG9wIiwicHV0IiwicHVzaCIsIl9wIiwidmFsdWUiLCJTZXRFbmFibGVkIiwiaXNUb3VjaGluZyIsIklzVG91Y2hpbmciLCJTZXRUYW5nZW50U3BlZWQiLCJnZXRUYW5nZW50U3BlZWQiLCJHZXRUYW5nZW50U3BlZWQiLCJzZXRGcmljdGlvbiIsIlNldEZyaWN0aW9uIiwiZ2V0RnJpY3Rpb24iLCJHZXRGcmljdGlvbiIsIlJlc2V0RnJpY3Rpb24iLCJzZXRSZXN0aXR1dGlvbiIsIlNldFJlc3RpdHV0aW9uIiwiZ2V0UmVzdGl0dXRpb24iLCJHZXRSZXN0aXR1dGlvbiIsIlJlc2V0UmVzdGl0dXRpb24iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFJQSxTQUFTLEdBQUdDLE9BQU8sQ0FBQyxrQkFBRCxDQUFQLENBQTRCRCxTQUE1Qzs7QUFDQSxJQUFJRSxXQUFXLEdBQUdELE9BQU8sQ0FBQyxrQkFBRCxDQUFQLENBQTRCQyxXQUE5Qzs7QUFFQSxJQUFJQyxLQUFLLEdBQUcsRUFBWixFQUdBOztBQUNBLElBQUlDLFVBQVUsR0FBRyxDQUFDQyxFQUFFLENBQUNDLEVBQUgsRUFBRCxFQUFVRCxFQUFFLENBQUNDLEVBQUgsRUFBVixDQUFqQjtBQUVBLElBQUlDLGVBQWUsR0FBRyxJQUFJQyxFQUFFLENBQUNDLGFBQVAsRUFBdEI7QUFFQTs7OztBQUdBLElBQUlDLGFBQWEsR0FBRztBQUVoQjs7Ozs7OztBQU9BQyxFQUFBQSxNQUFNLEVBQUUsRUFUUTs7QUFXaEI7Ozs7OztBQU1BQyxFQUFBQSxXQUFXLEVBQUUsRUFqQkc7O0FBbUJoQjs7Ozs7OztBQU9BQyxFQUFBQSxNQUFNLEVBQUVSLEVBQUUsQ0FBQ0MsRUFB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QUwsQ0FBZ0J3RCxXQUFoQixFQUFQO0FBQ0gsQ0FGRDtBQUdBOzs7Ozs7Ozs7QUFPQVgsRUFBRSxDQUFDekMsYUFBSCxHQUFtQixZQUFZO0FBQzNCLFNBQU8sS0FBS0osVUFBTCxDQUFnQnlELGFBQWhCLEVBQVA7QUFDSCxDQUZEO0FBR0E7Ozs7Ozs7Ozs7QUFRQVosRUFBRSxDQUFDYSxjQUFILEdBQW9CLFVBQVVaLEtBQVYsRUFBaUI7QUFDakMsT0FBSzlDLFVBQUwsQ0FBZ0IyRCxjQUFoQixDQUErQmIsS0FBL0I7QUFDSCxDQUZEO0FBR0E7Ozs7Ozs7Ozs7QUFRQUQsRUFBRSxDQUFDZSxjQUFILEdBQW9CLFlBQVk7QUFDNUIsU0FBTyxLQUFLNUQsVUFBTCxDQUFnQjZELGNBQWhCLEVBQVA7QUFDSCxDQUZEO0FBR0E7Ozs7Ozs7OztBQU9BaEIsRUFBRSxDQUFDeEMsZ0JBQUgsR0FBc0IsWUFBWTtBQUM5QixTQUFPLEtBQUtMLFVBQUwsQ0FBZ0I4RCxnQkFBaEIsRUFBUDtBQUNILENBRkQ7O0FBSUEzRSxjQUFjLENBQUN6QixXQUFmLEdBQTZCQSxXQUE3QjtBQUNBRyxFQUFFLENBQUNzQixjQUFILEdBQW9CNEUsTUFBTSxDQUFDQyxPQUFQLEdBQWlCN0UsY0FBckMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbnZhciBQVE1fUkFUSU8gPSByZXF1aXJlKCcuL0NDUGh5c2ljc1R5cGVzJykuUFRNX1JBVElPO1xudmFyIENvbnRhY3RUeXBlID0gcmVxdWlyZSgnLi9DQ1BoeXNpY3NUeXBlcycpLkNvbnRhY3RUeXBlO1xuXG52YXIgcG9vbHMgPSBbXTtcblxuXG4vLyB0ZW1wIHdvcmxkIG1hbmlmb2xkXG52YXIgcG9pbnRDYWNoZSA9IFtjYy52MigpLCBjYy52MigpXTtcblxudmFyIGIyd29ybGRtYW5pZm9sZCA9IG5ldyBiMi5Xb3JsZE1hbmlmb2xkKCk7XG5cbi8qKlxuICogQGNsYXNzIFdvcmxkTWFuaWZvbGRcbiAqL1xudmFyIHdvcmxkbWFuaWZvbGQgPSB7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogd29ybGQgY29udGFjdCBwb2ludCAocG9pbnQgb2YgaW50ZXJzZWN0aW9uKVxuICAgICAqICEjemhcbiAgICAgKiDnorDmkp7ngrnpm4blkIhcbiAgICAgKiBAcHJvcGVydHkge1tWZWMyXX0gcG9pbnRzXG4gICAgICovXG4gICAgcG9pbnRzOiBbXSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBhIG5lZ2F0aXZlIHZhbHVlIGluZGljYXRlcyBvdmVybGFwXG4gICAgICogISN6aFxuICAgICAqIOS4gOS4qui0n+aVsO+8jOeUqOS6juaMh+aYjumHjeWPoOeahOmDqOWIhlxuICAgICAqL1xuICAgIHNlcGFyYXRpb25zOiBbXSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiB3b3JsZCB2ZWN0b3IgcG9pbnRpbmcgZnJvbSBBIHRvIEJcbiAgICAgKiAhI3poXG4gICAgICog5LiW55WM5Z2Q5qCH57O75LiL55SxIEEg5oyH5ZCRIEIg55qE5ZCR6YePXG4gICAgICogQHByb3BlcnR5IHtWZWMyfSBub3JtYWxcbiAgICAgKi9cbiAgICBub3JtYWw6IGNjLnYyKClcbn07XG5cbi8qKlxuICogISNlblxuICogQSBtYW5pZm9sZCBwb2ludCBpcyBhIGNvbnRhY3QgcG9pbnQgYmVsb25naW5nIHRvIGEgY29udGFjdCBtYW5pZm9sZC4gXG4gKiBJdCBob2xkcyBkZXRhaWxzIHJlbGF0ZWQgdG8gdGhlIGdlb21ldHJ5IGFuZCBkeW5hbWljcyBvZiB0aGUgY29udGFjdCBwb2ludHMuXG4gKiBOb3RlOiB0aGUgaW1wdWxzZXMgYXJlIHVzZWQgZm9yIGludGVybmFsIGNhY2hpbmcgYW5kIG1heSBub3RcbiAqIHByb3ZpZGUgcmVsaWFibGUgY29udGFjdCBmb3JjZXMsIGVzcGVjaWFsbHkgZm9yIGhpZ2ggc3BlZWQgY29sbGlzaW9ucy5cbiAqICEjemhcbiAqIE1hbmlmb2xkUG9pbnQg5piv5o6l6Kem5L+h5oGv5Lit55qE5o6l6Kem54K55L+h5oGv44CC5a6D5oul5pyJ5YWz5LqO5Yeg5L2V5ZKM5o6l6Kem54K555qE6K+m57uG5L+h5oGv44CCXG4gKiDms6jmhI/vvJrkv6Hmga/kuK3nmoTlhrLph4/nlKjkuo7ns7vnu5/lhoXpg6jnvJPlrZjvvIzmj5DkvpvnmoTmjqXop6blipvlj6/og73kuI3mmK/lvojlh4bnoa7vvIznibnliKvmmK/pq5jpgJ/np7vliqjkuK3nmoTnorDmkp7kv6Hmga/jgIJcbiAqIEBjbGFzcyBNYW5pZm9sZFBvaW50XG4gKi9cbi8qKlxuICogISNlblxuICogVGhlIGxvY2FsIHBvaW50IHVzYWdlIGRlcGVuZHMgb24gdGhlIG1hbmlmb2xkIHR5cGU6XG4gKiAtZV9jaXJjbGVzOiB0aGUgbG9jYWwgY2VudGVyIG9mIGNpcmNsZUJcbiAqIC1lX2ZhY2VBOiB0aGUgbG9jYWwgY2VudGVyIG9mIGNpcmNsZUIgb3IgdGhlIGNsaXAgcG9pbnQgb2YgcG9seWdvbkJcbiAqIC1lX2ZhY2VCOiB0aGUgY2xpcCBwb2ludCBvZiBwb2x5Z29uQVxuICogISN6aFxuICog5pys5Zyw5Z2Q5qCH54K555qE55So6YCU5Y+W5Yaz5LqOIG1hbmlmb2xkIOeahOexu+Wei1xuICogLSBlX2NpcmNsZXM6IGNpcmNsZUIg55qE5pys5Zyw5Lit5b+D54K5XG4gKiAtIGVfZmFjZUE6IGNpcmNsZUIg55qE5pys5Zyw5Lit5b+D54K5IOaIluiAheaYryBwb2x5Z29uQiDnmoTmiKrlj5bngrlcbiAqIC0gZV9mYWNlQjogcG9seWdvbkIg55qE5oiq5Y+W54K5XG4gKiBAcHJvcGVydHkge1ZlYzJ9IGxvY2FsUG9pbnRcbiAqL1xuLyoqXG4gKiAhI2VuXG4gKiBOb3JtYWwgaW1wdWxzZS5cbiAqICEjemhcbiAqIOazlee6v+WGsumHj+OAglxuICogQHByb3BlcnR5IHtOdW1iZXJ9IG5vcm1hbEltcHVsc2VcbiAqL1xuLyoqXG4gKiAhI2VuXG4gKiBUYW5nZW50IGltcHVsc2UuXG4gKiAhI3poXG4gKiDliIfnur/lhrLph4/jgIJcbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB0YW5nZW50SW1wdWxzZVxuICovXG5mdW5jdGlvbiBNYW5pZm9sZFBvaW50ICgpIHtcbiAgICB0aGlzLmxvY2FsUG9pbnQgPSBjYy52MigpO1xuICAgIHRoaXMubm9ybWFsSW1wdWxzZSA9IDA7XG4gICAgdGhpcy50YW5nZW50SW1wdWxzZSA9IDA7XG59XG5cbnZhciBtYW5pZm9sZFBvaW50Q2FjaGUgPSBbbmV3IE1hbmlmb2xkUG9pbnQoKSwgbmV3IE1hbmlmb2xkUG9pbnQoKV07XG5cbnZhciBiMm1hbmlmb2xkID0gbmV3IGIyLk1hbmlmb2xkKCk7XG5cbi8qKlxuICogQGNsYXNzIE1hbmlmb2xkXG4gKi9cbnZhciBtYW5pZm9sZCA9IHtcbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogTWFuaWZvbGQgdHlwZSA6ICAwOiBlX2NpcmNsZXMsIDE6IGVfZmFjZUEsIDI6IGVfZmFjZUJcbiAgICAgKiAhI3poXG4gICAgICogTWFuaWZvbGQg57G75Z6LIDogIDA6IGVfY2lyY2xlcywgMTogZV9mYWNlQSwgMjogZV9mYWNlQlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB0eXBlXG4gICAgICovXG4gICAgdHlwZTogMCxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBUaGUgbG9jYWwgcG9pbnQgdXNhZ2UgZGVwZW5kcyBvbiB0aGUgbWFuaWZvbGQgdHlwZTpcbiAgICAgKiAtZV9jaXJjbGVzOiB0aGUgbG9jYWwgY2VudGVyIG9mIGNpcmNsZUFcbiAgICAgKiAtZV9mYWNlQTogdGhlIGNlbnRlciBvZiBmYWNlQVxuICAgICAqIC1lX2ZhY2VCOiB0aGUgY2VudGVyIG9mIGZhY2VCXG4gICAgICogISN6aFxuICAgICAqIOeUqOmAlOWPluWGs+S6jiBtYW5pZm9sZCDnsbvlnotcbiAgICAgKiAtZV9jaXJjbGVzOiBjaXJjbGVBIOeahOacrOWcsOS4reW/g+eCuVxuICAgICAqIC1lX2ZhY2VBOiBmYWNlQSDnmoTmnKzlnLDkuK3lv4PngrlcbiAgICAgKiAtZV9mYWNlQjogZmFjZUIg55qE5pys5Zyw5Lit5b+D54K5XG4gICAgICogQHByb3BlcnR5IHtWZWMyfSBsb2NhbFBvaW50XG4gICAgICovXG4gICAgbG9jYWxQb2ludDogY2MudjIoKSxcbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogLWVfY2lyY2xlczogbm90IHVzZWRcbiAgICAgKiAtZV9mYWNlQTogdGhlIG5vcm1hbCBvbiBwb2x5Z29uQVxuICAgICAqIC1lX2ZhY2VCOiB0aGUgbm9ybWFsIG9uIHBvbHlnb25CXG4gICAgICogISN6aFxuICAgICAqIC1lX2NpcmNsZXM6IOayoeiiq+S9v+eUqOWIsFxuICAgICAqIC1lX2ZhY2VBOiBwb2x5Z29uQSDnmoTms5XlkJHph49cbiAgICAgKiAtZV9mYWNlQjogcG9seWdvbkIg55qE5rOV5ZCR6YePXG4gICAgICogQHByb3BlcnR5IHtWZWMyfSBsb2NhbE5vcm1hbFxuICAgICAqL1xuICAgIGxvY2FsTm9ybWFsOiBjYy52MigpLFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIHRoZSBwb2ludHMgb2YgY29udGFjdC5cbiAgICAgKiAhI3poXG4gICAgICog5o6l6Kem54K55L+h5oGv44CCXG4gICAgICogQHByb3BlcnR5IHtbTWFuaWZvbGRQb2ludF19IHBvaW50c1xuICAgICAqL1xuICAgIHBvaW50czogW11cbn07XG5cbi8qKlxuICogISNlblxuICogQ29udGFjdCBpbXB1bHNlcyBmb3IgcmVwb3J0aW5nLlxuICogISN6aFxuICog55So5LqO6L+U5Zue57uZ5Zue6LCD55qE5o6l6Kem5Yay6YeP44CCXG4gKiBAY2xhc3MgUGh5c2ljc0ltcHVsc2VcbiAqL1xudmFyIGltcHVsc2UgPSB7XG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIE5vcm1hbCBpbXB1bHNlcy5cbiAgICAgKiAhI3poXG4gICAgICog5rOV57q/5pa55ZCR55qE5Yay6YePXG4gICAgICogQHByb3BlcnR5IG5vcm1hbEltcHVsc2VzXG4gICAgICovXG4gICAgbm9ybWFsSW1wdWxzZXM6IFtdLFxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBUYW5nZW50IGltcHVsc2VzXG4gICAgICogISN6aFxuICAgICAqIOWIh+e6v+aWueWQkeeahOWGsumHj1xuICAgICAqIEBwcm9wZXJ0eSB0YW5nZW50SW1wdWxzZXNcbiAgICAgKi9cbiAgICB0YW5nZW50SW1wdWxzZXM6IFtdXG59O1xuXG4vKipcbiAqICEjZW5cbiAqIFBoeXNpY3NDb250YWN0IHdpbGwgYmUgZ2VuZXJhdGVkIGR1cmluZyBiZWdpbiBhbmQgZW5kIGNvbGxpc2lvbiBhcyBhIHBhcmFtZXRlciBvZiB0aGUgY29sbGlzaW9uIGNhbGxiYWNrLlxuICogTm90ZSB0aGF0IGNvbnRhY3RzIHdpbGwgYmUgcmV1c2VkIGZvciBzcGVlZCB1cCBjcHUgdGltZSwgc28gZG8gbm90IGNhY2hlIGFueXRoaW5nIGluIHRoZSBjb250YWN0LlxuICogISN6aFxuICog54mp55CG5o6l6Kem5Lya5Zyo5byA5aeL5ZKM57uT5p2f56Kw5pKe5LmL6Ze055Sf5oiQ77yM5bm25L2c5Li65Y+C5pWw5Lyg5YWl5Yiw56Kw5pKe5Zue6LCD5Ye95pWw5Lit44CCXG4gKiDms6jmhI/vvJrkvKDlhaXnmoTniannkIbmjqXop6bkvJrooqvns7vnu5/ov5vooYzph43nlKjvvIzmiYDku6XkuI3opoHlnKjkvb/nlKjkuK3nvJPlrZjph4zpnaLnmoTku7vkvZXkv6Hmga/jgIJcbiAqIEBjbGFzcyBQaHlzaWNzQ29udGFjdFxuICovXG5mdW5jdGlvbiBQaHlzaWNzQ29udGFjdCAoKSB7XG59XG5cblBoeXNpY3NDb250YWN0LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKGIyY29udGFjdCkge1xuICAgIHRoaXMuY29sbGlkZXJBID0gYjJjb250YWN0LkdldEZpeHR1cmVBKCkuY29sbGlkZXI7XG4gICAgdGhpcy5jb2xsaWRlckIgPSBiMmNvbnRhY3QuR2V0Rml4dHVyZUIoKS5jb2xsaWRlcjtcbiAgICB0aGlzLmRpc2FibGVkID0gZmFsc2U7XG4gICAgdGhpcy5kaXNhYmxlZE9uY2UgPSBmYWxzZTtcbiAgICB0aGlzLl9pbXB1bHNlID0gbnVsbDtcblxuICAgIHRoaXMuX2ludmVydGVkID0gZmFsc2U7XG5cbiAgICB0aGlzLl9iMmNvbnRhY3QgPSBiMmNvbnRhY3Q7XG4gICAgYjJjb250YWN0Ll9jb250YWN0ID0gdGhpcztcbn07XG5cblBoeXNpY3NDb250YWN0LnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFRhbmdlbnRTcGVlZCgwKTtcbiAgICB0aGlzLnJlc2V0RnJpY3Rpb24oKTtcbiAgICB0aGlzLnJlc2V0UmVzdGl0dXRpb24oKTtcblxuICAgIHRoaXMuY29sbGlkZXJBID0gbnVsbDtcbiAgICB0aGlzLmNvbGxpZGVyQiA9IG51bGw7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIHRoaXMuX2ltcHVsc2UgPSBudWxsO1xuXG4gICAgdGhpcy5fYjJjb250YWN0Ll9jb250YWN0ID0gbnVsbDtcbiAgICB0aGlzLl9iMmNvbnRhY3QgPSBudWxsO1xufTtcblxuLyoqXG4gKiAhI2VuXG4gKiBHZXQgdGhlIHdvcmxkIG1hbmlmb2xkLlxuICogISN6aFxuICog6I635Y+W5LiW55WM5Z2Q5qCH57O75LiL55qE56Kw5pKe5L+h5oGv44CCXG4gKiBAbWV0aG9kIGdldFdvcmxkTWFuaWZvbGRcbiAqIEByZXR1cm4ge1dvcmxkTWFuaWZvbGR9XG4gKi9cblBoeXNpY3NDb250YWN0LnByb3RvdHlwZS5nZXRXb3JsZE1hbmlmb2xkID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwb2ludHMgPSB3b3JsZG1hbmlmb2xkLnBvaW50cztcbiAgICB2YXIgc2VwYXJhdGlvbnMgPSB3b3JsZG1hbmlmb2xkLnNlcGFyYXRpb25zO1xuICAgIHZhciBub3JtYWwgPSB3b3JsZG1hbmlmb2xkLm5vcm1hbDtcblxuICAgIHRoaXMuX2IyY29udGFjdC5HZXRXb3JsZE1hbmlmb2xkKGIyd29ybGRtYW5pZm9sZCk7XG4gICAgdmFyIGIycG9pbnRzID0gYjJ3b3JsZG1hbmlmb2xkLnBvaW50cztcbiAgICB2YXIgYjJzZXBhcmF0aW9ucyA9IGIyd29ybGRtYW5pZm9sZC5zZXBhcmF0aW9ucztcblxuICAgIHZhciBjb3VudCA9IHRoaXMuX2IyY29udGFjdC5HZXRNYW5pZm9sZCgpLnBvaW50Q291bnQ7XG4gICAgcG9pbnRzLmxlbmd0aCA9IHNlcGFyYXRpb25zLmxlbmd0aCA9IGNvdW50O1xuICAgIFxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICB2YXIgcCA9IHBvaW50Q2FjaGVbaV07XG4gICAgICAgIHAueCA9IGIycG9pbnRzW2ldLnggKiBQVE1fUkFUSU87XG4gICAgICAgIHAueSA9IGIycG9pbnRzW2ldLnkgKiBQVE1fUkFUSU87XG4gICAgICAgIFxuICAgICAgICBwb2ludHNbaV0gPSBwO1xuICAgICAgICBzZXBhcmF0aW9uc1tpXSA9IGIyc2VwYXJhdGlvbnNbaV0gKiBQVE1fUkFUSU87XG4gICAgfVxuXG4gICAgbm9ybWFsLnggPSBiMndvcmxkbWFuaWZvbGQubm9ybWFsLng7XG4gICAgbm9ybWFsLnkgPSBiMndvcmxkbWFuaWZvbGQubm9ybWFsLnk7XG5cbiAgICBpZiAodGhpcy5faW52ZXJ0ZWQpIHtcbiAgICAgICAgbm9ybWFsLnggKj0gLTE7XG4gICAgICAgIG5vcm1hbC55ICo9IC0xO1xuICAgIH1cblxuICAgIHJldHVybiB3b3JsZG1hbmlmb2xkO1xufTtcblxuLyoqXG4gKiAhI2VuXG4gKiBHZXQgdGhlIG1hbmlmb2xkLlxuICogISN6aFxuICog6I635Y+W5pys5Zyw77yI5bGA6YOo77yJ5Z2Q5qCH57O75LiL55qE56Kw5pKe5L+h5oGv44CCXG4gKiBAbWV0aG9kIGdldE1hbmlmb2xkXG4gKiBAcmV0dXJuIHtNYW5pZm9sZH1cbiAqL1xuUGh5c2ljc0NvbnRhY3QucHJvdG90eXBlLmdldE1hbmlmb2xkID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwb2ludHMgPSBtYW5pZm9sZC5wb2ludHM7XG4gICAgdmFyIGxvY2FsTm9ybWFsID0gbWFuaWZvbGQubG9jYWxOb3JtYWw7XG4gICAgdmFyIGxvY2FsUG9pbnQgPSBtYW5pZm9sZC5sb2NhbFBvaW50O1xuICAgIFxuICAgIHZhciBiMm1hbmlmb2xkID0gdGhpcy5fYjJjb250YWN0LkdldE1hbmlmb2xkKCk7XG4gICAgdmFyIGIycG9pbnRzID0gYjJtYW5pZm9sZC5wb2ludHM7XG4gICAgdmFyIGNvdW50ID0gcG9pbnRzLmxlbmd0aCA9IGIybWFuaWZvbGQucG9pbnRDb3VudDtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICB2YXIgcCA9IG1hbmlmb2xkUG9pbnRDYWNoZVtpXTtcbiAgICAgICAgdmFyIGIycCA9IGIycG9pbnRzW2ldO1xuICAgICAgICBwLmxvY2FsUG9pbnQueCA9IGIycC5sb2NhbFBvaW50LnggKiBQVE1fUkFUSU87XG4gICAgICAgIHAubG9jYWxQb2ludC5ZID0gYjJwLmxvY2FsUG9pbnQuWSAqIFBUTV9SQVRJTztcbiAgICAgICAgcC5ub3JtYWxJbXB1bHNlID0gYjJwLm5vcm1hbEltcHVsc2UgKiBQVE1fUkFUSU87XG4gICAgICAgIHAudGFuZ2VudEltcHVsc2UgPSBiMnAudGFuZ2VudEltcHVsc2U7XG5cbiAgICAgICAgcG9pbnRzW2ldID0gcDtcbiAgICB9XG5cbiAgICBsb2NhbFBvaW50LnggPSBiMm1hbmlmb2xkLmxvY2FsUG9pbnQueCAqIFBUTV9SQVRJTztcbiAgICBsb2NhbFBvaW50LnkgPSBiMm1hbmlmb2xkLmxvY2FsUG9pbnQueSAqIFBUTV9SQVRJTztcbiAgICBsb2NhbE5vcm1hbC54ID0gYjJtYW5pZm9sZC5sb2NhbE5vcm1hbC54O1xuICAgIGxvY2FsTm9ybWFsLnkgPSBiMm1hbmlmb2xkLmxvY2FsTm9ybWFsLnk7XG4gICAgbWFuaWZvbGQudHlwZSA9IGIybWFuaWZvbGQudHlwZTtcblxuICAgIGlmICh0aGlzLl9pbnZlcnRlZCkge1xuICAgICAgICBsb2NhbE5vcm1hbC54ICo9IC0xO1xuICAgICAgICBsb2NhbE5vcm1hbC55ICo9IC0xO1xuICAgIH1cblxuICAgIHJldHVybiBtYW5pZm9sZDtcbn07XG5cbi8qKlxuICogISNlblxuICogR2V0IHRoZSBpbXB1bHNlcy5cbiAqIE5vdGU6IFBoeXNpY3NJbXB1bHNlIGNhbiBvbmx5IHVzZWQgaW4gb25Qb3N0U29sdmUgY2FsbGJhY2suXG4gKiAhI3poXG4gKiDojrflj5blhrLph4/kv6Hmga9cbiAqIOazqOaEj++8mui/meS4quS/oeaBr+WPquacieWcqCBvblBvc3RTb2x2ZSDlm57osIPkuK3miY3og73ojrflj5bliLBcbiAqIEBtZXRob2QgZ2V0SW1wdWxzZVxuICogQHJldHVybiB7UGh5c2ljc0ltcHVsc2V9XG4gKi9cblBoeXNpY3NDb250YWN0LnByb3RvdHlwZS5nZXRJbXB1bHNlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBiMmltcHVsc2UgPSB0aGlzLl9pbXB1bHNlO1xuICAgIGlmICghYjJpbXB1bHNlKSByZXR1cm4gbnVsbDtcblxuICAgIHZhciBub3JtYWxJbXB1bHNlcyA9IGltcHVsc2Uubm9ybWFsSW1wdWxzZXM7XG4gICAgdmFyIHRhbmdlbnRJbXB1bHNlcyA9IGltcHVsc2UudGFuZ2VudEltcHVsc2VzO1xuICAgIHZhciBjb3VudCA9IGIyaW1wdWxzZS5jb3VudDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgbm9ybWFsSW1wdWxzZXNbaV0gPSBiMmltcHVsc2Uubm9ybWFsSW1wdWxzZXNbaV0gKiBQVE1fUkFUSU87XG4gICAgICAgIHRhbmdlbnRJbXB1bHNlc1tpXSA9IGIyaW1wdWxzZS50YW5nZW50SW1wdWxzZXNbaV07XG4gICAgfVxuXG4gICAgdGFuZ2VudEltcHVsc2VzLmxlbmd0aCA9IG5vcm1hbEltcHVsc2VzLmxlbmd0aCA9IGNvdW50O1xuXG4gICAgcmV0dXJuIGltcHVsc2U7XG59O1xuXG5QaHlzaWNzQ29udGFjdC5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIChjb250YWN0VHlwZSkge1xuICAgIHZhciBmdW5jO1xuICAgIHN3aXRjaCAoY29udGFjdFR5cGUpIHtcbiAgICAgICAgY2FzZSBDb250YWN0VHlwZS5CRUdJTl9DT05UQUNUOlxuICAgICAgICAgICAgZnVuYyA9ICdvbkJlZ2luQ29udGFjdCc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBDb250YWN0VHlwZS5FTkRfQ09OVEFDVDpcbiAgICAgICAgICAgIGZ1bmMgPSAnb25FbmRDb250YWN0JztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIENvbnRhY3RUeXBlLlBSRV9TT0xWRTpcbiAgICAgICAgICAgIGZ1bmMgPSAnb25QcmVTb2x2ZSc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBDb250YWN0VHlwZS5QT1NUX1NPTFZFOlxuICAgICAgICAgICAgZnVuYyA9ICdvblBvc3RTb2x2ZSc7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICB2YXIgY29sbGlkZXJBID0gdGhpcy5jb2xsaWRlckE7XG4gICAgdmFyIGNvbGxpZGVyQiA9IHRoaXMuY29sbGlkZXJCO1xuXG4gICAgdmFyIGJvZHlBID0gY29sbGlkZXJBLmJvZHk7XG4gICAgdmFyIGJvZHlCID0gY29sbGlkZXJCLmJvZHk7XG5cbiAgICB2YXIgY29tcHM7XG4gICAgdmFyIGksIGwsIGNvbXA7XG5cbiAgICBpZiAoYm9keUEuZW5hYmxlZENvbnRhY3RMaXN0ZW5lcikge1xuICAgICAgICBjb21wcyA9IGJvZHlBLm5vZGUuX2NvbXBvbmVudHM7XG4gICAgICAgIHRoaXMuX2ludmVydGVkID0gZmFsc2U7XG4gICAgICAgIGZvciAoaSA9IDAsIGwgPSBjb21wcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGNvbXAgPSBjb21wc1tpXTtcbiAgICAgICAgICAgIGlmIChjb21wW2Z1bmNdKSB7XG4gICAgICAgICAgICAgICAgY29tcFtmdW5jXSh0aGlzLCBjb2xsaWRlckEsIGNvbGxpZGVyQik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYm9keUIuZW5hYmxlZENvbnRhY3RMaXN0ZW5lcikge1xuICAgICAgICBjb21wcyA9IGJvZHlCLm5vZGUuX2NvbXBvbmVudHM7XG4gICAgICAgIHRoaXMuX2ludmVydGVkID0gdHJ1ZTtcbiAgICAgICAgZm9yIChpID0gMCwgbCA9IGNvbXBzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgY29tcCA9IGNvbXBzW2ldO1xuICAgICAgICAgICAgaWYgKGNvbXBbZnVuY10pIHtcbiAgICAgICAgICAgICAgICBjb21wW2Z1bmNdKHRoaXMsIGNvbGxpZGVyQiwgY29sbGlkZXJBKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZWRPbmNlKSB7XG4gICAgICAgIHRoaXMuc2V0RW5hYmxlZChmYWxzZSk7XG4gICAgICAgIHRoaXMuZGlzYWJsZWRPbmNlID0gZmFsc2U7XG4gICAgfVxufTtcblxuUGh5c2ljc0NvbnRhY3QuZ2V0ID0gZnVuY3Rpb24gKGIyY29udGFjdCkge1xuICAgIHZhciBjO1xuICAgIGlmIChwb29scy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgYyA9IG5ldyBjYy5QaHlzaWNzQ29udGFjdCgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgYyA9IHBvb2xzLnBvcCgpOyBcbiAgICB9XG5cbiAgICBjLmluaXQoYjJjb250YWN0KTtcbiAgICByZXR1cm4gYztcbn07XG5cblBoeXNpY3NDb250YWN0LnB1dCA9IGZ1bmN0aW9uIChiMmNvbnRhY3QpIHtcbiAgICB2YXIgYyA9IGIyY29udGFjdC5fY29udGFjdDtcbiAgICBpZiAoIWMpIHJldHVybjtcbiAgICBcbiAgICBwb29scy5wdXNoKGMpO1xuICAgIGMucmVzZXQoKTtcbn07XG5cblxudmFyIF9wID0gUGh5c2ljc0NvbnRhY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIEBwcm9wZXJ0eSB7Q29sbGlkZXJ9IGNvbGxpZGVyQVxuICovXG4vKipcbiAqIEBwcm9wZXJ0eSB7Q29sbGlkZXJ9IGNvbGxpZGVyQlxuICovXG4vKipcbiAqICEjZW5cbiAqIElmIHNldCBkaXNhYmxlZCB0byB0cnVlLCB0aGUgY29udGFjdCB3aWxsIGJlIGlnbm9yZWQgdW50aWwgY29udGFjdCBlbmQuXG4gKiBJZiB5b3UganVzdCB3YW50IHRvIGRpc2FibGVkIGNvbnRhY3QgZm9yIGN1cnJlbnQgdGltZSBzdGVwIG9yIHN1Yi1zdGVwLCBwbGVhc2UgdXNlIGRpc2FibGVkT25jZS5cbiAqICEjemhcbiAqIOWmguaenCBkaXNhYmxlZCDooqvorr7nva7kuLogdHJ1Ze+8jOmCo+S5iOebtOWIsOaOpeinpue7k+adn+atpOaOpeinpumDveWwhuiiq+W/veeVpeOAglxuICog5aaC5p6c5Y+q5piv5biM5pyb5Zyo5b2T5YmN5pe26Ze05q2l5oiW5a2Q5q2l5Lit5b+955Wl5q2k5o6l6Kem77yM6K+35L2/55SoIGRpc2FibGVkT25jZSDjgIJcbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZGlzYWJsZWRcbiAqL1xuLyoqXG4gKiAhI2VuXG4gKiBEaXNhYmxlZCBjb250YWN0IGZvciBjdXJyZW50IHRpbWUgc3RlcCBvciBzdWItc3RlcC5cbiAqICEjemhcbiAqIOWcqOW9k+WJjeaXtumXtOatpeaIluWtkOatpeS4reW/veeVpeatpOaOpeinpuOAglxuICogQHByb3BlcnR5IHtCb29sZWFufSBkaXNhYmxlZE9uY2VcbiAqL1xuX3Auc2V0RW5hYmxlZCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHRoaXMuX2IyY29udGFjdC5TZXRFbmFibGVkKHZhbHVlKTtcbn07XG5cbi8qKlxuICogISNlblxuICogSXMgdGhpcyBjb250YWN0IHRvdWNoaW5nP1xuICogISN6aFxuICog6L+U5Zue56Kw5pKe5L2T5piv5ZCm5bey57uP5o6l6Kem5Yiw44CCXG4gKiBAbWV0aG9kIGlzVG91Y2hpbmdcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbl9wLmlzVG91Y2hpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2IyY29udGFjdC5Jc1RvdWNoaW5nKCk7XG59O1xuXG4vKipcbiAqICEjZW5cbiAqIFNldCB0aGUgZGVzaXJlZCB0YW5nZW50IHNwZWVkIGZvciBhIGNvbnZleW9yIGJlbHQgYmVoYXZpb3IuXG4gKiAhI3poXG4gKiDkuLrkvKDpgIHluKborr7nva7mnJ/mnJvnmoTliIfnur/pgJ/luqZcbiAqIEBtZXRob2Qgc2V0VGFuZ2VudFNwZWVkXG4gKiBAcGFyYW0ge051bWJlcn0gdGFuZ2VudFNwZWVkXG4gKi9cbl9wLnNldFRhbmdlbnRTcGVlZCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHRoaXMuX2IyY29udGFjdC5TZXRUYW5nZW50U3BlZWQodmFsdWUgLyBQVE1fUkFUSU8pO1xufTtcbi8qKlxuICogISNlblxuICogR2V0IHRoZSBkZXNpcmVkIHRhbmdlbnQgc3BlZWQuXG4gKiAhI3poXG4gKiDojrflj5bliIfnur/pgJ/luqZcbiAqIEBtZXRob2QgZ2V0VGFuZ2VudFNwZWVkXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cblxuX3AuZ2V0VGFuZ2VudFNwZWVkID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9iMmNvbnRhY3QuR2V0VGFuZ2VudFNwZWVkKCkgKiBQVE1fUkFUSU87XG59O1xuXG4vKipcbiAqICEjZW5cbiAqIE92ZXJyaWRlIHRoZSBkZWZhdWx0IGZyaWN0aW9uIG1peHR1cmUuIFlvdSBjYW4gY2FsbCB0aGlzIGluIG9uUHJlU29sdmUgY2FsbGJhY2suXG4gKiAhI3poXG4gKiDopobnm5bpu5jorqTnmoTmkanmk6blipvns7vmlbDjgILkvaDlj6/ku6XlnKggb25QcmVTb2x2ZSDlm57osIPkuK3osIPnlKjmraTlh73mlbDjgIJcbiAqIEBtZXRob2Qgc2V0RnJpY3Rpb25cbiAqIEBwYXJhbSB7TnVtYmVyfSBmcmljdGlvblxuICovXG5fcC5zZXRGcmljdGlvbiA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHRoaXMuX2IyY29udGFjdC5TZXRGcmljdGlvbih2YWx1ZSk7XG59O1xuLyoqXG4gKiAhI2VuXG4gKiBHZXQgdGhlIGZyaWN0aW9uLlxuICogISN6aFxuICog6I635Y+W5b2T5YmN5pGp5pOm5Yqb57O75pWwXG4gKiBAbWV0aG9kIGdldEZyaWN0aW9uXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbl9wLmdldEZyaWN0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9iMmNvbnRhY3QuR2V0RnJpY3Rpb24oKTtcbn07XG4vKipcbiAqICEjZW5cbiAqIFJlc2V0IHRoZSBmcmljdGlvbiBtaXh0dXJlIHRvIHRoZSBkZWZhdWx0IHZhbHVlLlxuICogISN6aFxuICog6YeN572u5pGp5pOm5Yqb57O75pWw5Yiw6buY6K6k5YC8XG4gKiBAbWV0aG9kIHJlc2V0RnJpY3Rpb25cbiAqL1xuX3AucmVzZXRGcmljdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fYjJjb250YWN0LlJlc2V0RnJpY3Rpb24oKTtcbn07XG4vKipcbiAqICEjZW5cbiAqIE92ZXJyaWRlIHRoZSBkZWZhdWx0IHJlc3RpdHV0aW9uIG1peHR1cmUuIFlvdSBjYW4gY2FsbCB0aGlzIGluIG9uUHJlU29sdmUgY2FsbGJhY2suXG4gKiAhI3poXG4gKiDopobnm5bpu5jorqTnmoTmgaLlpI3ns7vmlbDjgILkvaDlj6/ku6XlnKggb25QcmVTb2x2ZSDlm57osIPkuK3osIPnlKjmraTlh73mlbDjgIJcbiAqIEBtZXRob2Qgc2V0UmVzdGl0dXRpb25cbiAqIEBwYXJhbSB7TnVtYmVyfSByZXN0aXR1dGlvblxuICovXG5fcC5zZXRSZXN0aXR1dGlvbiA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHRoaXMuX2IyY29udGFjdC5TZXRSZXN0aXR1dGlvbih2YWx1ZSk7XG59O1xuLyoqXG4gKiAhI2VuXG4gKiBHZXQgdGhlIHJlc3RpdHV0aW9uLlxuICogISN6aFxuICog6I635Y+W5b2T5YmN5oGi5aSN57O75pWwXG4gKiBAbWV0aG9kIGdldFJlc3RpdHV0aW9uXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbl9wLmdldFJlc3RpdHV0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9iMmNvbnRhY3QuR2V0UmVzdGl0dXRpb24oKTtcbn07XG4vKipcbiAqICEjZW5cbiAqIFJlc2V0IHRoZSByZXN0aXR1dGlvbiBtaXh0dXJlIHRvIHRoZSBkZWZhdWx0IHZhbHVlLlxuICogISN6aFxuICog6YeN572u5oGi5aSN57O75pWw5Yiw6buY6K6k5YC8XG4gKiBAbWV0aG9kIHJlc2V0UmVzdGl0dXRpb25cbiAqL1xuX3AucmVzZXRSZXN0aXR1dGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fYjJjb250YWN0LlJlc2V0UmVzdGl0dXRpb24oKTtcbn07XG5cblBoeXNpY3NDb250YWN0LkNvbnRhY3RUeXBlID0gQ29udGFjdFR5cGU7XG5jYy5QaHlzaWNzQ29udGFjdCA9IG1vZHVsZS5leHBvcnRzID0gUGh5c2ljc0NvbnRhY3Q7XG4iXX0=