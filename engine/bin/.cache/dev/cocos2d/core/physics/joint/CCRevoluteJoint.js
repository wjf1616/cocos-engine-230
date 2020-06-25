
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/physics/joint/CCRevoluteJoint.js';
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

var PHYSICS_ANGLE_TO_ANGLE = require('../CCPhysicsTypes').PHYSICS_ANGLE_TO_ANGLE;
/**
 * !#en
 * A revolute joint constrains two bodies to share a common point while they
 * are free to rotate about the point. The relative rotation about the shared
 * point is the joint angle. You can limit the relative rotation with
 * a joint limit that specifies a lower and upper angle. You can use a motor
 * to drive the relative rotation about the shared point. A maximum motor torque
 * is provided so that infinite forces are not generated.
 * !#zh
 * 旋转关节可以约束两个刚体围绕一个点来进行旋转。
 * 你可以通过开启关节限制来限制旋转的最大角度和最小角度。
 * 你可以通过开启马达来施加一个扭矩力来驱动这两个刚体在这一点上的相对速度。
 * @class RevoluteJoint
 * @extends Joint
 */


var RevoluteJoint = cc.Class({
  name: 'cc.RevoluteJoint',
  "extends": cc.Joint,
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.physics/Joint/Revolute',
    inspector: 'packages://inspector/inspectors/comps/physics/joint.js'
  },
  properties: {
    _maxMotorTorque: 0,
    _motorSpeed: 0,
    _enableLimit: false,
    _enableMotor: false,

    /**
     * !#en
     * The reference angle.
     * An angle between bodies considered to be zero for the joint angle.
     * !#zh
     * 相对角度。
     * 两个物体之间角度为零时可以看作相等于关节角度
     * @property {Number} referenceAngle
     * @default 0
     */
    referenceAngle: {
      "default": 0,
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.referenceAngle'
    },

    /**
     * !#en
     * The lower angle.
     * !#zh
     * 角度的最低限制。
     * @property {Number} lowerAngle
     * @default 0
     */
    lowerAngle: {
      "default": 0,
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.lowerAngle'
    },

    /**
     * !#en
     * The upper angle.
     * !#zh
     * 角度的最高限制。
     * @property {Number} upperAngle
     * @default 0
     */
    upperAngle: {
      "default": 0,
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.upperAngle'
    },

    /**
     * !#en
     * The maxium torque can be applied to rigidbody to rearch the target motor speed.
     * !#zh
     * 可以施加到刚体的最大扭矩。
     * @property {Number} maxMotorTorque
     * @default 0
     */
    maxMotorTorque: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.maxMotorTorque',
      get: function get() {
        return this._maxMotorTorque;
      },
      set: function set(value) {
        this._maxMotorTorque = value;

        if (this._joint) {
          this._joint.SetMaxMotorTorque(value);
        }
      }
    },

    /**
     * !#en
     * The expected motor speed.
     * !#zh
     * 期望的马达速度。
     * @property {Number} motorSpeed
     * @default 0
     */
    motorSpeed: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.motorSpeed',
      get: function get() {
        return this._motorSpeed;
      },
      set: function set(value) {
        this._motorSpeed = value;

        if (this._joint) {
          this._joint.SetMotorSpeed(value * ANGLE_TO_PHYSICS_ANGLE);
        }
      }
    },

    /**
     * !#en
     * Enable joint limit?
     * !#zh
     * 是否开启关节的限制？
     * @property {Boolean} enableLimit
     * @default false
     */
    enableLimit: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.enableLimit',
      get: function get() {
        return this._enableLimit;
      },
      set: function set(value) {
        this._enableLimit = value;

        if (this._joint) {
          this._joint.EnableLimit(value);
        }
      }
    },

    /**
     * !#en
     * Enable joint motor?
     * !#zh
     * 是否开启关节马达？
     * @property {Boolean} enableMotor
     * @default false
     */
    enableMotor: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.enableMotor',
      get: function get() {
        return this._enableMotor;
      },
      set: function set(value) {
        this._enableMotor = value;

        if (this._joint) {
          this._joint.EnableMotor(value);
        }
      }
    }
  },

  /**
   * !#en
   * Get the joint angle.
   * !#zh
   * 获取关节角度。
   * @method getJointAngle
   * @return {Number}
   */
  getJointAngle: function getJointAngle() {
    if (this._joint) {
      return this._joint.GetJointAngle() * PHYSICS_ANGLE_TO_ANGLE;
    }

    return 0;
  },

  /**
   * #!en
   * Set the max and min limit angle.
   * #!zh
   * 设置关节的角度最大和最小角度。
   * @param {Number} lower 
   * @param {Number} upper 
   */
  setLimits: function setLimits(lower, upper) {
    if (this._joint) {
      return this._joint.SetLimits(lower * ANGLE_TO_PHYSICS_ANGLE, upper * ANGLE_TO_PHYSICS_ANGLE);
    }
  },
  _createJointDef: function _createJointDef() {
    var def = new b2.RevoluteJointDef();
    def.localAnchorA = new b2.Vec2(this.anchor.x / PTM_RATIO, this.anchor.y / PTM_RATIO);
    def.localAnchorB = new b2.Vec2(this.connectedAnchor.x / PTM_RATIO, this.connectedAnchor.y / PTM_RATIO); // cocos degree 0 is to right, and box2d degree 0 is to up.

    def.lowerAngle = this.upperAngle * ANGLE_TO_PHYSICS_ANGLE;
    def.upperAngle = this.lowerAngle * ANGLE_TO_PHYSICS_ANGLE;
    def.maxMotorTorque = this.maxMotorTorque;
    def.motorSpeed = this.motorSpeed * ANGLE_TO_PHYSICS_ANGLE;
    def.enableLimit = this.enableLimit;
    def.enableMotor = this.enableMotor;
    def.referenceAngle = this.referenceAngle * ANGLE_TO_PHYSICS_ANGLE;
    return def;
  }
});
cc.RevoluteJoint = module.exports = RevoluteJoint;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDUmV2b2x1dGVKb2ludC5qcyJdLCJuYW1lcyI6WyJQVE1fUkFUSU8iLCJyZXF1aXJlIiwiQU5HTEVfVE9fUEhZU0lDU19BTkdMRSIsIlBIWVNJQ1NfQU5HTEVfVE9fQU5HTEUiLCJSZXZvbHV0ZUpvaW50IiwiY2MiLCJDbGFzcyIsIm5hbWUiLCJKb2ludCIsImVkaXRvciIsIkNDX0VESVRPUiIsIm1lbnUiLCJpbnNwZWN0b3IiLCJwcm9wZXJ0aWVzIiwiX21heE1vdG9yVG9ycXVlIiwiX21vdG9yU3BlZWQiLCJfZW5hYmxlTGltaXQiLCJfZW5hYmxlTW90b3IiLCJyZWZlcmVuY2VBbmdsZSIsInRvb2x0aXAiLCJDQ19ERVYiLCJsb3dlckFuZ2xlIiwidXBwZXJBbmdsZSIsIm1heE1vdG9yVG9ycXVlIiwiZ2V0Iiwic2V0IiwidmFsdWUiLCJfam9pbnQiLCJTZXRNYXhNb3RvclRvcnF1ZSIsIm1vdG9yU3BlZWQiLCJTZXRNb3RvclNwZWVkIiwiZW5hYmxlTGltaXQiLCJFbmFibGVMaW1pdCIsImVuYWJsZU1vdG9yIiwiRW5hYmxlTW90b3IiLCJnZXRKb2ludEFuZ2xlIiwiR2V0Sm9pbnRBbmdsZSIsInNldExpbWl0cyIsImxvd2VyIiwidXBwZXIiLCJTZXRMaW1pdHMiLCJfY3JlYXRlSm9pbnREZWYiLCJkZWYiLCJiMiIsIlJldm9sdXRlSm9pbnREZWYiLCJsb2NhbEFuY2hvckEiLCJWZWMyIiwiYW5jaG9yIiwieCIsInkiLCJsb2NhbEFuY2hvckIiLCJjb25uZWN0ZWRBbmNob3IiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkEsSUFBSUEsU0FBUyxHQUFHQyxPQUFPLENBQUMsbUJBQUQsQ0FBUCxDQUE2QkQsU0FBN0M7O0FBQ0EsSUFBSUUsc0JBQXNCLEdBQUdELE9BQU8sQ0FBQyxtQkFBRCxDQUFQLENBQTZCQyxzQkFBMUQ7O0FBQ0EsSUFBSUMsc0JBQXNC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QUFpQixLQUFLRCxVQUFMLEdBQWlCbkIsc0JBQWxDO0FBRUF3QyxJQUFBQSxHQUFHLENBQUNuQixjQUFKLEdBQXFCLEtBQUtBLGNBQTFCO0FBQ0FtQixJQUFBQSxHQUFHLENBQUNiLFVBQUosR0FBaUIsS0FBS0EsVUFBTCxHQUFrQjNCLHNCQUFuQztBQUNBd0MsSUFBQUEsR0FBRyxDQUFDWCxXQUFKLEdBQWtCLEtBQUtBLFdBQXZCO0FBQ0FXLElBQUFBLEdBQUcsQ0FBQ1QsV0FBSixHQUFrQixLQUFLQSxXQUF2QjtBQUVBUyxJQUFBQSxHQUFHLENBQUN4QixjQUFKLEdBQXFCLEtBQUtBLGNBQUwsR0FBc0JoQixzQkFBM0M7QUFFQSxXQUFPd0MsR0FBUDtBQUNIO0FBMUx3QixDQUFULENBQXBCO0FBNkxBckMsRUFBRSxDQUFDRCxhQUFILEdBQW1CZ0QsTUFBTSxDQUFDQyxPQUFQLEdBQWlCakQsYUFBcEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnZhciBQVE1fUkFUSU8gPSByZXF1aXJlKCcuLi9DQ1BoeXNpY3NUeXBlcycpLlBUTV9SQVRJTztcbnZhciBBTkdMRV9UT19QSFlTSUNTX0FOR0xFID0gcmVxdWlyZSgnLi4vQ0NQaHlzaWNzVHlwZXMnKS5BTkdMRV9UT19QSFlTSUNTX0FOR0xFO1xudmFyIFBIWVNJQ1NfQU5HTEVfVE9fQU5HTEUgPSByZXF1aXJlKCcuLi9DQ1BoeXNpY3NUeXBlcycpLlBIWVNJQ1NfQU5HTEVfVE9fQU5HTEU7XG5cbi8qKlxuICogISNlblxuICogQSByZXZvbHV0ZSBqb2ludCBjb25zdHJhaW5zIHR3byBib2RpZXMgdG8gc2hhcmUgYSBjb21tb24gcG9pbnQgd2hpbGUgdGhleVxuICogYXJlIGZyZWUgdG8gcm90YXRlIGFib3V0IHRoZSBwb2ludC4gVGhlIHJlbGF0aXZlIHJvdGF0aW9uIGFib3V0IHRoZSBzaGFyZWRcbiAqIHBvaW50IGlzIHRoZSBqb2ludCBhbmdsZS4gWW91IGNhbiBsaW1pdCB0aGUgcmVsYXRpdmUgcm90YXRpb24gd2l0aFxuICogYSBqb2ludCBsaW1pdCB0aGF0IHNwZWNpZmllcyBhIGxvd2VyIGFuZCB1cHBlciBhbmdsZS4gWW91IGNhbiB1c2UgYSBtb3RvclxuICogdG8gZHJpdmUgdGhlIHJlbGF0aXZlIHJvdGF0aW9uIGFib3V0IHRoZSBzaGFyZWQgcG9pbnQuIEEgbWF4aW11bSBtb3RvciB0b3JxdWVcbiAqIGlzIHByb3ZpZGVkIHNvIHRoYXQgaW5maW5pdGUgZm9yY2VzIGFyZSBub3QgZ2VuZXJhdGVkLlxuICogISN6aFxuICog5peL6L2s5YWz6IqC5Y+v5Lul57qm5p2f5Lik5Liq5Yia5L2T5Zu057uV5LiA5Liq54K55p2l6L+b6KGM5peL6L2s44CCXG4gKiDkvaDlj6/ku6XpgJrov4flvIDlkK/lhbPoioLpmZDliLbmnaXpmZDliLbml4vovaznmoTmnIDlpKfop5LluqblkozmnIDlsI/op5LluqbjgIJcbiAqIOS9oOWPr+S7pemAmui/h+W8gOWQr+mprOi+vuadpeaWveWKoOS4gOS4quaJreefqeWKm+adpempseWKqOi/meS4pOS4quWImuS9k+WcqOi/meS4gOeCueS4iueahOebuOWvuemAn+W6puOAglxuICogQGNsYXNzIFJldm9sdXRlSm9pbnRcbiAqIEBleHRlbmRzIEpvaW50XG4gKi9cbnZhciBSZXZvbHV0ZUpvaW50ID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5SZXZvbHV0ZUpvaW50JyxcbiAgICBleHRlbmRzOiBjYy5Kb2ludCxcbiAgICBcbiAgICBlZGl0b3I6IENDX0VESVRPUiAmJiB7XG4gICAgICAgIG1lbnU6ICdpMThuOk1BSU5fTUVOVS5jb21wb25lbnQucGh5c2ljcy9Kb2ludC9SZXZvbHV0ZScsXG4gICAgICAgIGluc3BlY3RvcjogJ3BhY2thZ2VzOi8vaW5zcGVjdG9yL2luc3BlY3RvcnMvY29tcHMvcGh5c2ljcy9qb2ludC5qcycsXG4gICAgfSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgX21heE1vdG9yVG9ycXVlOiAwLFxuICAgICAgICBfbW90b3JTcGVlZDogMCxcbiAgICAgICAgX2VuYWJsZUxpbWl0OiBmYWxzZSxcbiAgICAgICAgX2VuYWJsZU1vdG9yOiBmYWxzZSxcbiAgICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSByZWZlcmVuY2UgYW5nbGUuXG4gICAgICAgICAqIEFuIGFuZ2xlIGJldHdlZW4gYm9kaWVzIGNvbnNpZGVyZWQgdG8gYmUgemVybyBmb3IgdGhlIGpvaW50IGFuZ2xlLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOebuOWvueinkuW6puOAglxuICAgICAgICAgKiDkuKTkuKrniankvZPkuYvpl7Top5LluqbkuLrpm7bml7blj6/ku6XnnIvkvZznm7jnrYnkuo7lhbPoioLop5LluqZcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHJlZmVyZW5jZUFuZ2xlXG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIHJlZmVyZW5jZUFuZ2xlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5waHlzaWNzLnBoeXNpY3NfY29sbGlkZXIucmVmZXJlbmNlQW5nbGUnLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBsb3dlciBhbmdsZS5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDop5LluqbnmoTmnIDkvY7pmZDliLbjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGxvd2VyQW5nbGVcbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgbG93ZXJBbmdsZToge1xuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGh5c2ljcy5waHlzaWNzX2NvbGxpZGVyLmxvd2VyQW5nbGUnICAgICAgICAgICAgXG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSB1cHBlciBhbmdsZS5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDop5LluqbnmoTmnIDpq5jpmZDliLbjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHVwcGVyQW5nbGVcbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgdXBwZXJBbmdsZToge1xuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGh5c2ljcy5waHlzaWNzX2NvbGxpZGVyLnVwcGVyQW5nbGUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIG1heGl1bSB0b3JxdWUgY2FuIGJlIGFwcGxpZWQgdG8gcmlnaWRib2R5IHRvIHJlYXJjaCB0aGUgdGFyZ2V0IG1vdG9yIHNwZWVkLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOWPr+S7peaWveWKoOWIsOWImuS9k+eahOacgOWkp+aJreefqeOAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gbWF4TW90b3JUb3JxdWVcbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgbWF4TW90b3JUb3JxdWU6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGh5c2ljcy5waHlzaWNzX2NvbGxpZGVyLm1heE1vdG9yVG9ycXVlJywgICAgICAgICAgICBcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9tYXhNb3RvclRvcnF1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX21heE1vdG9yVG9ycXVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2pvaW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2pvaW50LlNldE1heE1vdG9yVG9ycXVlKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIGV4cGVjdGVkIG1vdG9yIHNwZWVkLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOacn+acm+eahOmprOi+vumAn+W6puOAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gbW90b3JTcGVlZFxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICBtb3RvclNwZWVkOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBoeXNpY3MucGh5c2ljc19jb2xsaWRlci5tb3RvclNwZWVkJyxcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9tb3RvclNwZWVkO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbW90b3JTcGVlZCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9qb2ludCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9qb2ludC5TZXRNb3RvclNwZWVkKHZhbHVlICogQU5HTEVfVE9fUEhZU0lDU19BTkdMRSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIEVuYWJsZSBqb2ludCBsaW1pdD9cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDmmK/lkKblvIDlkK/lhbPoioLnmoTpmZDliLbvvJ9cbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBlbmFibGVMaW1pdFxuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgZW5hYmxlTGltaXQ6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGh5c2ljcy5waHlzaWNzX2NvbGxpZGVyLmVuYWJsZUxpbWl0JywgICAgICAgICAgICBcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9lbmFibGVMaW1pdDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2VuYWJsZUxpbWl0ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2pvaW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2pvaW50LkVuYWJsZUxpbWl0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogRW5hYmxlIGpvaW50IG1vdG9yP1xuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOaYr+WQpuW8gOWQr+WFs+iKgumprOi+vu+8n1xuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGVuYWJsZU1vdG9yXG4gICAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgICAqL1xuICAgICAgICBlbmFibGVNb3Rvcjoge1xuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5waHlzaWNzLnBoeXNpY3NfY29sbGlkZXIuZW5hYmxlTW90b3InLFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2VuYWJsZU1vdG9yO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZW5hYmxlTW90b3IgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fam9pbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fam9pbnQuRW5hYmxlTW90b3IodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogR2V0IHRoZSBqb2ludCBhbmdsZS5cbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W5YWz6IqC6KeS5bqm44CCXG4gICAgICogQG1ldGhvZCBnZXRKb2ludEFuZ2xlXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldEpvaW50QW5nbGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2pvaW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fam9pbnQuR2V0Sm9pbnRBbmdsZSgpICogUEhZU0lDU19BTkdMRV9UT19BTkdMRTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogIyFlblxuICAgICAqIFNldCB0aGUgbWF4IGFuZCBtaW4gbGltaXQgYW5nbGUuXG4gICAgICogIyF6aFxuICAgICAqIOiuvue9ruWFs+iKgueahOinkuW6puacgOWkp+WSjOacgOWwj+inkuW6puOAglxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBsb3dlciBcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdXBwZXIgXG4gICAgICovXG4gICAgc2V0TGltaXRzIChsb3dlciwgdXBwZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuX2pvaW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fam9pbnQuU2V0TGltaXRzKGxvd2VyICogQU5HTEVfVE9fUEhZU0lDU19BTkdMRSwgdXBwZXIgKiBBTkdMRV9UT19QSFlTSUNTX0FOR0xFKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfY3JlYXRlSm9pbnREZWY6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRlZiA9IG5ldyBiMi5SZXZvbHV0ZUpvaW50RGVmKCk7XG4gICAgICAgIGRlZi5sb2NhbEFuY2hvckEgPSBuZXcgYjIuVmVjMih0aGlzLmFuY2hvci54L1BUTV9SQVRJTywgdGhpcy5hbmNob3IueS9QVE1fUkFUSU8pO1xuICAgICAgICBkZWYubG9jYWxBbmNob3JCID0gbmV3IGIyLlZlYzIodGhpcy5jb25uZWN0ZWRBbmNob3IueC9QVE1fUkFUSU8sIHRoaXMuY29ubmVjdGVkQW5jaG9yLnkvUFRNX1JBVElPKTtcblxuICAgICAgICAvLyBjb2NvcyBkZWdyZWUgMCBpcyB0byByaWdodCwgYW5kIGJveDJkIGRlZ3JlZSAwIGlzIHRvIHVwLlxuICAgICAgICBkZWYubG93ZXJBbmdsZSA9IHRoaXMudXBwZXJBbmdsZSogQU5HTEVfVE9fUEhZU0lDU19BTkdMRTtcbiAgICAgICAgZGVmLnVwcGVyQW5nbGUgPSB0aGlzLmxvd2VyQW5nbGUqIEFOR0xFX1RPX1BIWVNJQ1NfQU5HTEU7XG4gICAgICAgIFxuICAgICAgICBkZWYubWF4TW90b3JUb3JxdWUgPSB0aGlzLm1heE1vdG9yVG9ycXVlO1xuICAgICAgICBkZWYubW90b3JTcGVlZCA9IHRoaXMubW90b3JTcGVlZCAqIEFOR0xFX1RPX1BIWVNJQ1NfQU5HTEU7XG4gICAgICAgIGRlZi5lbmFibGVMaW1pdCA9IHRoaXMuZW5hYmxlTGltaXQ7XG4gICAgICAgIGRlZi5lbmFibGVNb3RvciA9IHRoaXMuZW5hYmxlTW90b3I7XG5cbiAgICAgICAgZGVmLnJlZmVyZW5jZUFuZ2xlID0gdGhpcy5yZWZlcmVuY2VBbmdsZSAqIEFOR0xFX1RPX1BIWVNJQ1NfQU5HTEU7XG5cbiAgICAgICAgcmV0dXJuIGRlZjtcbiAgICB9XG59KTtcblxuY2MuUmV2b2x1dGVKb2ludCA9IG1vZHVsZS5leHBvcnRzID0gUmV2b2x1dGVKb2ludDtcbiJdfQ==