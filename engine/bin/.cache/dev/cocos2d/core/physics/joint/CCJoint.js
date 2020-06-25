
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/physics/joint/CCJoint.js';
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
var PTM_RATIO = require('../CCPhysicsTypes').PTM_RATIO;
/**
 * !#en
 * Base class for joints to connect rigidbody.
 * !#zh
 * 关节类的基类
 * @class Joint
 * @extends Component
 */


var Joint = cc.Class({
  name: 'cc.Joint',
  "extends": cc.Component,
  editor: {
    requireComponent: cc.RigidBody
  },
  properties: {
    /**
    * !#en
    * The anchor of the rigidbody.
    * !#zh
    * 刚体的锚点。
    * @property {Vec2} anchor
    * @default cc.v2(0, 0)
    */
    anchor: {
      "default": cc.v2(0, 0),
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.anchor'
    },

    /**
     * !#en
     * The anchor of the connected rigidbody.
     * !#zh
     * 关节另一端刚体的锚点。
     * @property {Vec2} connectedAnchor
     * @default cc.v2(0, 0)
     */
    connectedAnchor: {
      "default": cc.v2(0, 0),
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.connectedAnchor'
    },

    /**
     * !#en
     * The rigidbody to which the other end of the joint is attached.
     * !#zh
     * 关节另一端链接的刚体
     * @property {RigidBody} connectedBody
     * @default null
     */
    connectedBody: {
      "default": null,
      type: cc.RigidBody,
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.connectedBody'
    },

    /**
     * !#en
     * Should the two rigid bodies connected with this joint collide with each other?
     * !#zh
     * 链接到关节上的两个刚体是否应该相互碰撞？
     * @property {Boolean} collideConnected
     * @default false
     */
    collideConnected: {
      "default": false,
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.collideConnected'
    }
  },
  onDisable: function onDisable() {
    this._destroy();
  },
  onEnable: function onEnable() {
    this._init();
  },
  // need init after body and connected body init
  start: function start() {
    this._init();
  },

  /**
   * !#en
   * Apply current changes to joint, this will regenerate inner box2d joint.
   * !#zh
   * 应用当前关节中的修改，调用此函数会重新生成内部 box2d 的关节。
   * @method apply
   */
  apply: function apply() {
    this._destroy();

    this._init();
  },

  /**
   * !#en
   * Get the anchor point on rigidbody in world coordinates.
   * !#zh
   * 获取刚体世界坐标系下的锚点。
   * @method getWorldAnchor
   * @return {Vec2}
   */
  getWorldAnchor: function getWorldAnchor() {
    if (this._joint) {
      var anchor = this._joint.GetAnchorA();

      return cc.v2(anchor.x * PTM_RATIO, anchor.y * PTM_RATIO);
    }

    return cc.Vec2.ZERO;
  },

  /**
   * !#en
   * Get the anchor point on connected rigidbody in world coordinates.
   * !#zh
   * 获取链接刚体世界坐标系下的锚点。
   * @method getWorldConnectedAnchor
   * @return {Vec2}
   */
  getWorldConnectedAnchor: function getWorldConnectedAnchor() {
    if (this._joint) {
      var anchor = this._joint.GetAnchorB();

      return cc.v2(anchor.x * PTM_RATIO, anchor.y * PTM_RATIO);
    }

    return cc.Vec2.ZERO;
  },

  /**
   * !#en
   * Gets the reaction force of the joint.
   * !#zh
   * 获取关节的反作用力。
   * @method getReactionForce
   * @param {Number} timeStep - The time to calculate the reaction force for.
   * @return {Vec2}
   */
  getReactionForce: function getReactionForce(timeStep) {
    var out = cc.v2();

    if (this._joint) {
      return this._joint.GetReactionForce(timeStep, out);
    }

    return out;
  },

  /**
   * !#en
   * Gets the reaction torque of the joint.
   * !#zh
   * 获取关节的反扭矩。
   * @method getReactionTorque
   * @param {Number} timeStep - The time to calculate the reaction torque for.
   * @return {Number}
   */
  getReactionTorque: function getReactionTorque(timeStep) {
    if (this._joint) {
      return this._joint.GetReactionTorque(timeStep);
    }

    return 0;
  },
  _init: function _init() {
    cc.director.getPhysicsManager().pushDelayEvent(this, '__init', []);
  },
  _destroy: function _destroy() {
    cc.director.getPhysicsManager().pushDelayEvent(this, '__destroy', []);
  },
  __init: function __init() {
    if (this._inited) return;
    this.body = this.getComponent(cc.RigidBody);

    if (this._isValid()) {
      var def = this._createJointDef();

      if (!def) return;
      def.bodyA = this.body._getBody();
      def.bodyB = this.connectedBody._getBody();
      def.collideConnected = this.collideConnected;

      cc.director.getPhysicsManager()._addJoint(this, def);

      this._inited = true;
    }
  },
  __destroy: function __destroy() {
    if (!this._inited) return;

    cc.director.getPhysicsManager()._removeJoint(this);

    this._joint = null;
    this._inited = false;
  },
  _createJointDef: function _createJointDef() {
    return null;
  },
  _isValid: function _isValid() {
    return this.body && this.body._getBody() && this.connectedBody && this.connectedBody._getBody();
  }
});
cc.Joint = module.exports = Joint;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDSm9pbnQuanMiXSwibmFtZXMiOlsiUFRNX1JBVElPIiwicmVxdWlyZSIsIkpvaW50IiwiY2MiLCJDbGFzcyIsIm5hbWUiLCJDb21wb25lbnQiLCJlZGl0b3IiLCJyZXF1aXJlQ29tcG9uZW50IiwiUmlnaWRCb2R5IiwicHJvcGVydGllcyIsImFuY2hvciIsInYyIiwidG9vbHRpcCIsIkNDX0RFViIsImNvbm5lY3RlZEFuY2hvciIsImNvbm5lY3RlZEJvZHkiLCJ0eXBlIiwiY29sbGlkZUNvbm5lY3RlZCIsIm9uRGlzYWJsZSIsIl9kZXN0cm95Iiwib25FbmFibGUiLCJfaW5pdCIsInN0YXJ0IiwiYXBwbHkiLCJnZXRXb3JsZEFuY2hvciIsIl9qb2ludCIsIkdldEFuY2hvckEiLCJ4IiwieSIsIlZlYzIiLCJaRVJPIiwiZ2V0V29ybGRDb25uZWN0ZWRBbmNob3IiLCJHZXRBbmNob3JCIiwiZ2V0UmVhY3Rpb25Gb3JjZSIsInRpbWVTdGVwIiwib3V0IiwiR2V0UmVhY3Rpb25Gb3JjZSIsImdldFJlYWN0aW9uVG9ycXVlIiwiR2V0UmVhY3Rpb25Ub3JxdWUiLCJkaXJlY3RvciIsImdldFBoeXNpY3NNYW5hZ2VyIiwicHVzaERlbGF5RXZlbnQiLCJfX2luaXQiLCJfaW5pdGVkIiwiYm9keSIsImdldENvbXBvbmVudCIsIl9pc1ZhbGlkIiwiZGVmIiwiX2NyZWF0ZUpvaW50RGVmIiwiYm9keUEiLCJfZ2V0Qm9keSIsImJvZHlCIiwiX2FkZEpvaW50IiwiX19kZXN0cm95IiwiX3JlbW92ZUpvaW50IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLElBQUlBLFNBQVMsR0FBR0MsT0FBTyxDQUFDLG1CQUFELENBQVAsQ0FBNkJELFNBQTdDO0FBRUE7Ozs7Ozs7Ozs7QUFRQSxJQUFJRSxLQUFLLEdBQUdDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ2pCQyxFQUFBQSxJ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LEtBQUtWLE9BQVYsRUFBbUI7O0FBRW5CekMsSUFBQUEsRUFBRSxDQUFDcUMsUUFBSCxDQUFZQyxpQkFBWixHQUFnQ2MsWUFBaEMsQ0FBNkMsSUFBN0M7O0FBRUEsU0FBSzdCLE1BQUwsR0FBYyxJQUFkO0FBQ0EsU0FBS2tCLE9BQUwsR0FBZSxLQUFmO0FBQ0gsR0F4TGdCO0FBMExqQkssRUFBQUEsZUFBZSxFQUFFLDJCQUFZO0FBQ3pCLFdBQU8sSUFBUDtBQUNILEdBNUxnQjtBQThMakJGLEVBQUFBLFFBQVEsRUFBRSxvQkFBWTtBQUNsQixXQUFPLEtBQUtGLElBQUwsSUFBYSxLQUFLQSxJQUFMLENBQVVNLFFBQVYsRUFBYixJQUNILEtBQUtuQyxhQURGLElBQ21CLEtBQUtBLGFBQUwsQ0FBbUJtQyxRQUFuQixFQUQxQjtBQUVIO0FBak1nQixDQUFULENBQVo7QUFvTUFoRCxFQUFFLENBQUNELEtBQUgsR0FBV3NELE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnZELEtBQTVCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG52YXIgUFRNX1JBVElPID0gcmVxdWlyZSgnLi4vQ0NQaHlzaWNzVHlwZXMnKS5QVE1fUkFUSU87XG5cbi8qKlxuICogISNlblxuICogQmFzZSBjbGFzcyBmb3Igam9pbnRzIHRvIGNvbm5lY3QgcmlnaWRib2R5LlxuICogISN6aFxuICog5YWz6IqC57G755qE5Z+657G7XG4gKiBAY2xhc3MgSm9pbnRcbiAqIEBleHRlbmRzIENvbXBvbmVudFxuICovXG52YXIgSm9pbnQgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLkpvaW50JyxcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gICAgXG4gICAgZWRpdG9yOiB7IFxuICAgICAgICByZXF1aXJlQ29tcG9uZW50OiBjYy5SaWdpZEJvZHlcbiAgICB9LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIGFuY2hvciBvZiB0aGUgcmlnaWRib2R5LlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOWImuS9k+eahOmUmueCueOAglxuICAgICAgICAgKiBAcHJvcGVydHkge1ZlYzJ9IGFuY2hvclxuICAgICAgICAgKiBAZGVmYXVsdCBjYy52MigwLCAwKVxuICAgICAgICAgKi9cbiAgICAgICAgYW5jaG9yOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBjYy52MigwLCAwKSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGh5c2ljcy5waHlzaWNzX2NvbGxpZGVyLmFuY2hvcidcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIGFuY2hvciBvZiB0aGUgY29ubmVjdGVkIHJpZ2lkYm9keS5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDlhbPoioLlj6bkuIDnq6/liJrkvZPnmoTplJrngrnjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtWZWMyfSBjb25uZWN0ZWRBbmNob3JcbiAgICAgICAgICogQGRlZmF1bHQgY2MudjIoMCwgMClcbiAgICAgICAgICovXG4gICAgICAgIGNvbm5lY3RlZEFuY2hvcjoge1xuICAgICAgICAgICAgZGVmYXVsdDogY2MudjIoMCwgMCksXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBoeXNpY3MucGh5c2ljc19jb2xsaWRlci5jb25uZWN0ZWRBbmNob3InICAgICAgICAgICAgXG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgcmlnaWRib2R5IHRvIHdoaWNoIHRoZSBvdGhlciBlbmQgb2YgdGhlIGpvaW50IGlzIGF0dGFjaGVkLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOWFs+iKguWPpuS4gOerr+mTvuaOpeeahOWImuS9k1xuICAgICAgICAgKiBAcHJvcGVydHkge1JpZ2lkQm9keX0gY29ubmVjdGVkQm9keVxuICAgICAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICAgICAqL1xuICAgICAgICBjb25uZWN0ZWRCb2R5OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUmlnaWRCb2R5LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5waHlzaWNzLnBoeXNpY3NfY29sbGlkZXIuY29ubmVjdGVkQm9keSdcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBTaG91bGQgdGhlIHR3byByaWdpZCBib2RpZXMgY29ubmVjdGVkIHdpdGggdGhpcyBqb2ludCBjb2xsaWRlIHdpdGggZWFjaCBvdGhlcj9cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDpk77mjqXliLDlhbPoioLkuIrnmoTkuKTkuKrliJrkvZPmmK/lkKblupTor6Xnm7jkupLnorDmkp7vvJ9cbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBjb2xsaWRlQ29ubmVjdGVkXG4gICAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgICAqL1xuICAgICAgICBjb2xsaWRlQ29ubmVjdGVkOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGh5c2ljcy5waHlzaWNzX2NvbGxpZGVyLmNvbGxpZGVDb25uZWN0ZWQnXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25EaXNhYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2Rlc3Ryb3koKTtcbiAgICB9LFxuXG4gICAgb25FbmFibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5faW5pdCgpO1xuICAgIH0sXG5cbiAgICAvLyBuZWVkIGluaXQgYWZ0ZXIgYm9keSBhbmQgY29ubmVjdGVkIGJvZHkgaW5pdFxuICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2luaXQoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEFwcGx5IGN1cnJlbnQgY2hhbmdlcyB0byBqb2ludCwgdGhpcyB3aWxsIHJlZ2VuZXJhdGUgaW5uZXIgYm94MmQgam9pbnQuXG4gICAgICogISN6aFxuICAgICAqIOW6lOeUqOW9k+WJjeWFs+iKguS4reeahOS/ruaUue+8jOiwg+eUqOatpOWHveaVsOS8mumHjeaWsOeUn+aIkOWGhemDqCBib3gyZCDnmoTlhbPoioLjgIJcbiAgICAgKiBAbWV0aG9kIGFwcGx5XG4gICAgICovXG4gICAgYXBwbHk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fZGVzdHJveSgpO1xuICAgICAgICB0aGlzLl9pbml0KCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXQgdGhlIGFuY2hvciBwb2ludCBvbiByaWdpZGJvZHkgaW4gd29ybGQgY29vcmRpbmF0ZXMuXG4gICAgICogISN6aFxuICAgICAqIOiOt+WPluWImuS9k+S4lueVjOWdkOagh+ezu+S4i+eahOmUmueCueOAglxuICAgICAqIEBtZXRob2QgZ2V0V29ybGRBbmNob3JcbiAgICAgKiBAcmV0dXJuIHtWZWMyfVxuICAgICAqL1xuICAgIGdldFdvcmxkQW5jaG9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9qb2ludCkge1xuICAgICAgICAgICAgdmFyIGFuY2hvciA9IHRoaXMuX2pvaW50LkdldEFuY2hvckEoKTtcbiAgICAgICAgICAgIHJldHVybiBjYy52MihhbmNob3IueCAqIFBUTV9SQVRJTywgYW5jaG9yLnkgKiBQVE1fUkFUSU8pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYy5WZWMyLlpFUk87XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXQgdGhlIGFuY2hvciBwb2ludCBvbiBjb25uZWN0ZWQgcmlnaWRib2R5IGluIHdvcmxkIGNvb3JkaW5hdGVzLlxuICAgICAqICEjemhcbiAgICAgKiDojrflj5bpk77mjqXliJrkvZPkuJbnlYzlnZDmoIfns7vkuIvnmoTplJrngrnjgIJcbiAgICAgKiBAbWV0aG9kIGdldFdvcmxkQ29ubmVjdGVkQW5jaG9yXG4gICAgICogQHJldHVybiB7VmVjMn1cbiAgICAgKi9cbiAgICBnZXRXb3JsZENvbm5lY3RlZEFuY2hvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fam9pbnQpIHtcbiAgICAgICAgICAgIHZhciBhbmNob3IgPSB0aGlzLl9qb2ludC5HZXRBbmNob3JCKCk7XG4gICAgICAgICAgICByZXR1cm4gY2MudjIoYW5jaG9yLnggKiBQVE1fUkFUSU8sIGFuY2hvci55ICogUFRNX1JBVElPKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2MuVmVjMi5aRVJPO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogR2V0cyB0aGUgcmVhY3Rpb24gZm9yY2Ugb2YgdGhlIGpvaW50LlxuICAgICAqICEjemhcbiAgICAgKiDojrflj5blhbPoioLnmoTlj43kvZznlKjlipvjgIJcbiAgICAgKiBAbWV0aG9kIGdldFJlYWN0aW9uRm9yY2VcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdGltZVN0ZXAgLSBUaGUgdGltZSB0byBjYWxjdWxhdGUgdGhlIHJlYWN0aW9uIGZvcmNlIGZvci5cbiAgICAgKiBAcmV0dXJuIHtWZWMyfVxuICAgICAqL1xuICAgIGdldFJlYWN0aW9uRm9yY2U6IGZ1bmN0aW9uICh0aW1lU3RlcCkge1xuICAgICAgICB2YXIgb3V0ID0gY2MudjIoKTtcbiAgICAgICAgaWYgKHRoaXMuX2pvaW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fam9pbnQuR2V0UmVhY3Rpb25Gb3JjZSh0aW1lU3RlcCwgb3V0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogR2V0cyB0aGUgcmVhY3Rpb24gdG9ycXVlIG9mIHRoZSBqb2ludC5cbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W5YWz6IqC55qE5Y+N5omt55+p44CCXG4gICAgICogQG1ldGhvZCBnZXRSZWFjdGlvblRvcnF1ZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lU3RlcCAtIFRoZSB0aW1lIHRvIGNhbGN1bGF0ZSB0aGUgcmVhY3Rpb24gdG9ycXVlIGZvci5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0UmVhY3Rpb25Ub3JxdWU6IGZ1bmN0aW9uICh0aW1lU3RlcCkge1xuICAgICAgICBpZiAodGhpcy5fam9pbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9qb2ludC5HZXRSZWFjdGlvblRvcnF1ZSh0aW1lU3RlcCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfSxcblxuICAgIF9pbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmdldFBoeXNpY3NNYW5hZ2VyKCkucHVzaERlbGF5RXZlbnQodGhpcywgJ19faW5pdCcsIFtdKTsgIFxuICAgIH0sXG4gICAgX2Rlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0UGh5c2ljc01hbmFnZXIoKS5wdXNoRGVsYXlFdmVudCh0aGlzLCAnX19kZXN0cm95JywgW10pO1xuICAgIH0sXG5cbiAgICBfX2luaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2luaXRlZCkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuYm9keSA9IHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSk7XG4gICAgICAgIFxuICAgICAgICBpZiAodGhpcy5faXNWYWxpZCgpKSB7XG4gICAgICAgICAgICB2YXIgZGVmID0gdGhpcy5fY3JlYXRlSm9pbnREZWYoKTtcbiAgICAgICAgICAgIGlmICghZGVmKSByZXR1cm47XG5cbiAgICAgICAgICAgIGRlZi5ib2R5QSA9IHRoaXMuYm9keS5fZ2V0Qm9keSgpO1xuICAgICAgICAgICAgZGVmLmJvZHlCID0gdGhpcy5jb25uZWN0ZWRCb2R5Ll9nZXRCb2R5KCk7XG4gICAgICAgICAgICBkZWYuY29sbGlkZUNvbm5lY3RlZCA9IHRoaXMuY29sbGlkZUNvbm5lY3RlZDtcblxuICAgICAgICAgICAgY2MuZGlyZWN0b3IuZ2V0UGh5c2ljc01hbmFnZXIoKS5fYWRkSm9pbnQodGhpcywgZGVmKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5faW5pdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgX19kZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5faW5pdGVkKSByZXR1cm47XG5cbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0UGh5c2ljc01hbmFnZXIoKS5fcmVtb3ZlSm9pbnQodGhpcyk7XG5cbiAgICAgICAgdGhpcy5fam9pbnQgPSBudWxsO1xuICAgICAgICB0aGlzLl9pbml0ZWQgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgX2NyZWF0ZUpvaW50RGVmOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICBfaXNWYWxpZDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ib2R5ICYmIHRoaXMuYm9keS5fZ2V0Qm9keSgpICYmXG4gICAgICAgICAgICB0aGlzLmNvbm5lY3RlZEJvZHkgJiYgdGhpcy5jb25uZWN0ZWRCb2R5Ll9nZXRCb2R5KCk7XG4gICAgfVxufSk7XG5cbmNjLkpvaW50ID0gbW9kdWxlLmV4cG9ydHMgPSBKb2ludDtcbiJdfQ==