
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/physics/joint/CCMotorJoint.js';
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

var ANGLE_TO_PHYSICS_ANGLE = require('../CCPhysicsTypes').ANGLE_TO_PHYSICS_ANGLE;
/**
 * !#en
 * A motor joint is used to control the relative motion
 * between two bodies. A typical usage is to control the movement
 * of a dynamic body with respect to the ground.
 * !#zh
 * 马达关节被用来控制两个刚体间的相对运动。
 * 一个典型的例子是用来控制一个动态刚体相对于地面的运动。
 * @class MotorJoint
 * @extends Joint
 */


var MotorJoint = cc.Class({
  name: 'cc.MotorJoint',
  "extends": cc.Joint,
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.physics/Joint/Motor',
    inspector: 'packages://inspector/inspectors/comps/physics/joint.js'
  },
  properties: {
    _linearOffset: cc.v2(0, 0),
    _angularOffset: 0,
    _maxForce: 1,
    _maxTorque: 1,
    _correctionFactor: 0.3,

    /**
     * !#en
     * The anchor of the rigidbody.
     * !#zh
     * 刚体的锚点。
     * @property {Vec2} anchor
     * @default cc.v2(0, 0)
     */
    anchor: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.anchor',
      "default": cc.v2(0, 0),
      override: true,
      visible: false
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
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.connectedAnchor',
      "default": cc.v2(0, 0),
      override: true,
      visible: false
    },

    /**
     * !#en
     * The linear offset from connected rigidbody to rigidbody.
     * !#zh
     * 关节另一端的刚体相对于起始端刚体的位置偏移量
     * @property {Vec2} linearOffset
     * @default cc.v2(0,0)
     */
    linearOffset: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.linearOffset',
      get: function get() {
        return this._linearOffset;
      },
      set: function set(value) {
        this._linearOffset = value;

        if (this._joint) {
          this._joint.SetLinearOffset(new b2.Vec2(value.x / PTM_RATIO, value.y / PTM_RATIO));
        }
      }
    },

    /**
     * !#en
     * The angular offset from connected rigidbody to rigidbody.
     * !#zh
     * 关节另一端的刚体相对于起始端刚体的角度偏移量
     * @property {Number} angularOffset
     * @default 0
     */
    angularOffset: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.angularOffset',
      get: function get() {
        return this._angularOffset;
      },
      set: function set(value) {
        this._angularOffset = value;

        if (this._joint) {
          this._joint.SetAngularOffset(value);
        }
      }
    },

    /**
     * !#en
     * The maximum force can be applied to rigidbody.
     * !#zh
     * 可以应用于刚体的最大的力值
     * @property {Number} maxForce
     * @default 1
     */
    maxForce: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.maxForce',
      get: function get() {
        return this._maxForce;
      },
      set: function set(value) {
        this._maxForce = value;

        if (this._joint) {
          this._joint.SetMaxForce(value);
        }
      }
    },

    /**
     * !#en
     * The maximum torque can be applied to rigidbody.
     * !#zh
     * 可以应用于刚体的最大扭矩值
     * @property {Number} maxTorque
     * @default 1
     */
    maxTorque: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.maxTorque',
      get: function get() {
        return this._maxTorque;
      },
      set: function set(value) {
        this._maxTorque = value;

        if (this._joint) {
          this._joint.SetMaxTorque(value);
        }
      }
    },

    /**
     * !#en
     * The position correction factor in the range [0,1].
     * !#zh
     * 位置矫正系数，范围为 [0, 1]
     * @property {Number} correctionFactor
     * @default 0.3
     */
    correctionFactor: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.correctionFactor',
      get: function get() {
        return this._correctionFactor;
      },
      set: function set(value) {
        this._correctionFactor = value;

        if (this._joint) {
          this._joint.SetCorrectionFactor(value);
        }
      }
    }
  },
  _createJointDef: function _createJointDef() {
    var def = new b2.MotorJointDef();
    def.linearOffset = new b2.Vec2(this.linearOffset.x / PTM_RATIO, this.linearOffset.y / PTM_RATIO);
    def.angularOffset = this.angularOffset * ANGLE_TO_PHYSICS_ANGLE;
    def.maxForce = this.maxForce;
    def.maxTorque = this.maxTorque;
    def.correctionFactor = this.correctionFactor;
    return def;
  }
});
cc.MotorJoint = module.exports = MotorJoint;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDTW90b3JKb2ludC5qcyJdLCJuYW1lcyI6WyJQVE1fUkFUSU8iLCJyZXF1aXJlIiwiQU5HTEVfVE9fUEhZU0lDU19BTkdMRSIsIk1vdG9ySm9pbnQiLCJjYyIsIkNsYXNzIiwibmFtZSIsIkpvaW50IiwiZWRpdG9yIiwiQ0NfRURJVE9SIiwibWVudSIsImluc3BlY3RvciIsInByb3BlcnRpZXMiLCJfbGluZWFyT2Zmc2V0IiwidjIiLCJfYW5ndWxhck9mZnNldCIsIl9tYXhGb3JjZSIsIl9tYXhUb3JxdWUiLCJfY29ycmVjdGlvbkZhY3RvciIsImFuY2hvciIsInRvb2x0aXAiLCJDQ19ERVYiLCJvdmVycmlkZSIsInZpc2libGUiLCJjb25uZWN0ZWRBbmNob3IiLCJsaW5lYXJPZmZzZXQiLCJnZXQiLCJzZXQiLCJ2YWx1ZSIsIl9qb2ludCIsIlNldExpbmVhck9mZnNldCIsImIyIiwiVmVjMiIsIngiLCJ5IiwiYW5ndWxhck9mZnNldCIsIlNldEFuZ3VsYXJPZmZzZXQiLCJtYXhGb3JjZSIsIlNldE1heEZvcmNlIiwibWF4VG9ycXVlIiwiU2V0TWF4VG9ycXVlIiwiY29ycmVjdGlvbkZhY3RvciIsIlNldENvcnJlY3Rpb25GYWN0b3IiLCJfY3JlYXRlSm9pbnREZWYiLCJkZWYiLCJNb3RvckpvaW50RGVmIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLElBQUlBLFNBQVMsR0FBR0MsT0FBTyxDQUFDLG1CQUFELENBQVAsQ0FBNkJELFNBQTdDOztBQUNBLElBQUlFLHNCQUFzQixHQUFHRCxPQUFPLENBQUMsbUJBQUQsQ0FBUCxDQUE2QkMsc0JBQTFEO0FBRUE7Ozs7Ozs7Ozs7Ozs7QUFXQSxJQUFJQyxVQUFVLEdBQUdDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ3RCQyxFQUFBQSxJQUFJLEVBQUUsZUFEZ0I7QUFFdEIsYUFBU0YsRUFBRSxDQUFDRyxLQUZV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akI7QUFvS0F4QyxFQUFFLENBQUNELFVBQUgsR0FBZ0IyQyxNQUFNLENBQUNDLE9BQVAsR0FBaUI1QyxVQUFqQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxudmFyIFBUTV9SQVRJTyA9IHJlcXVpcmUoJy4uL0NDUGh5c2ljc1R5cGVzJykuUFRNX1JBVElPO1xudmFyIEFOR0xFX1RPX1BIWVNJQ1NfQU5HTEUgPSByZXF1aXJlKCcuLi9DQ1BoeXNpY3NUeXBlcycpLkFOR0xFX1RPX1BIWVNJQ1NfQU5HTEU7XG5cbi8qKlxuICogISNlblxuICogQSBtb3RvciBqb2ludCBpcyB1c2VkIHRvIGNvbnRyb2wgdGhlIHJlbGF0aXZlIG1vdGlvblxuICogYmV0d2VlbiB0d28gYm9kaWVzLiBBIHR5cGljYWwgdXNhZ2UgaXMgdG8gY29udHJvbCB0aGUgbW92ZW1lbnRcbiAqIG9mIGEgZHluYW1pYyBib2R5IHdpdGggcmVzcGVjdCB0byB0aGUgZ3JvdW5kLlxuICogISN6aFxuICog6ams6L6+5YWz6IqC6KKr55So5p2l5o6n5Yi25Lik5Liq5Yia5L2T6Ze055qE55u45a+56L+Q5Yqo44CCXG4gKiDkuIDkuKrlhbjlnovnmoTkvovlrZDmmK/nlKjmnaXmjqfliLbkuIDkuKrliqjmgIHliJrkvZPnm7jlr7nkuo7lnLDpnaLnmoTov5DliqjjgIJcbiAqIEBjbGFzcyBNb3RvckpvaW50XG4gKiBAZXh0ZW5kcyBKb2ludFxuICovXG52YXIgTW90b3JKb2ludCA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuTW90b3JKb2ludCcsXG4gICAgZXh0ZW5kczogY2MuSm9pbnQsXG4gICAgXG4gICAgZWRpdG9yOiBDQ19FRElUT1IgJiYge1xuICAgICAgICBtZW51OiAnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50LnBoeXNpY3MvSm9pbnQvTW90b3InLFxuICAgICAgICBpbnNwZWN0b3I6ICdwYWNrYWdlczovL2luc3BlY3Rvci9pbnNwZWN0b3JzL2NvbXBzL3BoeXNpY3Mvam9pbnQuanMnLFxuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIF9saW5lYXJPZmZzZXQ6IGNjLnYyKDAsIDApLFxuICAgICAgICBfYW5ndWxhck9mZnNldDogMCxcbiAgICAgICAgX21heEZvcmNlOiAxLFxuICAgICAgICBfbWF4VG9ycXVlOiAxLFxuICAgICAgICBfY29ycmVjdGlvbkZhY3RvcjogMC4zLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBhbmNob3Igb2YgdGhlIHJpZ2lkYm9keS5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDliJrkvZPnmoTplJrngrnjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtWZWMyfSBhbmNob3JcbiAgICAgICAgICogQGRlZmF1bHQgY2MudjIoMCwgMClcbiAgICAgICAgICovXG4gICAgICAgIGFuY2hvcjoge1xuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5waHlzaWNzLnBoeXNpY3NfY29sbGlkZXIuYW5jaG9yJywgICAgICAgICAgICBcbiAgICAgICAgICAgIGRlZmF1bHQ6IGNjLnYyKDAsIDApLFxuICAgICAgICAgICAgb3ZlcnJpZGU6IHRydWUsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgYW5jaG9yIG9mIHRoZSBjb25uZWN0ZWQgcmlnaWRib2R5LlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOWFs+iKguWPpuS4gOerr+WImuS9k+eahOmUmueCueOAglxuICAgICAgICAgKiBAcHJvcGVydHkge1ZlYzJ9IGNvbm5lY3RlZEFuY2hvclxuICAgICAgICAgKiBAZGVmYXVsdCBjYy52MigwLCAwKVxuICAgICAgICAgKi9cbiAgICAgICAgY29ubmVjdGVkQW5jaG9yOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBoeXNpY3MucGh5c2ljc19jb2xsaWRlci5jb25uZWN0ZWRBbmNob3InLFxuICAgICAgICAgICAgZGVmYXVsdDogY2MudjIoMCwgMCksXG4gICAgICAgICAgICBvdmVycmlkZTogdHJ1ZSxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH0sXG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgbGluZWFyIG9mZnNldCBmcm9tIGNvbm5lY3RlZCByaWdpZGJvZHkgdG8gcmlnaWRib2R5LlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOWFs+iKguWPpuS4gOerr+eahOWImuS9k+ebuOWvueS6jui1t+Wni+err+WImuS9k+eahOS9jee9ruWBj+enu+mHj1xuICAgICAgICAgKiBAcHJvcGVydHkge1ZlYzJ9IGxpbmVhck9mZnNldFxuICAgICAgICAgKiBAZGVmYXVsdCBjYy52MigwLDApXG4gICAgICAgICAqL1xuICAgICAgICBsaW5lYXJPZmZzZXQ6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGh5c2ljcy5waHlzaWNzX2NvbGxpZGVyLmxpbmVhck9mZnNldCcsXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbGluZWFyT2Zmc2V0O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGluZWFyT2Zmc2V0ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2pvaW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2pvaW50LlNldExpbmVhck9mZnNldCggbmV3IGIyLlZlYzIodmFsdWUueC9QVE1fUkFUSU8sIHZhbHVlLnkvUFRNX1JBVElPKSApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgYW5ndWxhciBvZmZzZXQgZnJvbSBjb25uZWN0ZWQgcmlnaWRib2R5IHRvIHJpZ2lkYm9keS5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDlhbPoioLlj6bkuIDnq6/nmoTliJrkvZPnm7jlr7nkuo7otbflp4vnq6/liJrkvZPnmoTop5LluqblgY/np7vph49cbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGFuZ3VsYXJPZmZzZXRcbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgYW5ndWxhck9mZnNldDoge1xuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5waHlzaWNzLnBoeXNpY3NfY29sbGlkZXIuYW5ndWxhck9mZnNldCcsICAgICAgICAgICAgXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYW5ndWxhck9mZnNldDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2FuZ3VsYXJPZmZzZXQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fam9pbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fam9pbnQuU2V0QW5ndWxhck9mZnNldCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBtYXhpbXVtIGZvcmNlIGNhbiBiZSBhcHBsaWVkIHRvIHJpZ2lkYm9keS5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDlj6/ku6XlupTnlKjkuo7liJrkvZPnmoTmnIDlpKfnmoTlipvlgLxcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IG1heEZvcmNlXG4gICAgICAgICAqIEBkZWZhdWx0IDFcbiAgICAgICAgICovXG4gICAgICAgIG1heEZvcmNlOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBoeXNpY3MucGh5c2ljc19jb2xsaWRlci5tYXhGb3JjZScsXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbWF4Rm9yY2U7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXhGb3JjZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9qb2ludCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9qb2ludC5TZXRNYXhGb3JjZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBtYXhpbXVtIHRvcnF1ZSBjYW4gYmUgYXBwbGllZCB0byByaWdpZGJvZHkuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5Y+v5Lul5bqU55So5LqO5Yia5L2T55qE5pyA5aSn5omt55+p5YC8XG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBtYXhUb3JxdWVcbiAgICAgICAgICogQGRlZmF1bHQgMVxuICAgICAgICAgKi9cbiAgICAgICAgbWF4VG9ycXVlOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBoeXNpY3MucGh5c2ljc19jb2xsaWRlci5tYXhUb3JxdWUnLCAgICAgICAgICAgIFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21heFRvcnF1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX21heFRvcnF1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9qb2ludCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9qb2ludC5TZXRNYXhUb3JxdWUodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgcG9zaXRpb24gY29ycmVjdGlvbiBmYWN0b3IgaW4gdGhlIHJhbmdlIFswLDFdLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOS9jee9ruefq+ato+ezu+aVsO+8jOiMg+WbtOS4uiBbMCwgMV1cbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGNvcnJlY3Rpb25GYWN0b3JcbiAgICAgICAgICogQGRlZmF1bHQgMC4zXG4gICAgICAgICAqL1xuICAgICAgICBjb3JyZWN0aW9uRmFjdG9yOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBoeXNpY3MucGh5c2ljc19jb2xsaWRlci5jb3JyZWN0aW9uRmFjdG9yJyxcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb3JyZWN0aW9uRmFjdG9yO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY29ycmVjdGlvbkZhY3RvciA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9qb2ludCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9qb2ludC5TZXRDb3JyZWN0aW9uRmFjdG9yKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIF9jcmVhdGVKb2ludERlZjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGVmID0gbmV3IGIyLk1vdG9ySm9pbnREZWYoKTtcbiAgICAgICAgZGVmLmxpbmVhck9mZnNldCA9IG5ldyBiMi5WZWMyKHRoaXMubGluZWFyT2Zmc2V0LngvUFRNX1JBVElPLCB0aGlzLmxpbmVhck9mZnNldC55L1BUTV9SQVRJTyk7XG4gICAgICAgIGRlZi5hbmd1bGFyT2Zmc2V0ID0gdGhpcy5hbmd1bGFyT2Zmc2V0ICogQU5HTEVfVE9fUEhZU0lDU19BTkdMRTtcbiAgICAgICAgZGVmLm1heEZvcmNlID0gdGhpcy5tYXhGb3JjZTtcbiAgICAgICAgZGVmLm1heFRvcnF1ZSA9IHRoaXMubWF4VG9ycXVlO1xuICAgICAgICBkZWYuY29ycmVjdGlvbkZhY3RvciA9IHRoaXMuY29ycmVjdGlvbkZhY3RvcjtcblxuICAgICAgICByZXR1cm4gZGVmO1xuICAgIH1cbn0pO1xuXG5jYy5Nb3RvckpvaW50ID0gbW9kdWxlLmV4cG9ydHMgPSBNb3RvckpvaW50O1xuIl19