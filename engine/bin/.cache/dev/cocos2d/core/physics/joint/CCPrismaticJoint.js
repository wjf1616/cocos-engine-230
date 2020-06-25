
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/physics/joint/CCPrismaticJoint.js';
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
 * A prismatic joint. This joint provides one degree of freedom: translation
 * along an axis fixed in rigidbody. Relative rotation is prevented. You can
 * use a joint limit to restrict the range of motion and a joint motor to
 * drive the motion or to model joint friction.
 * !#zh
 * 移动关节指定了只能在一个方向上移动刚体。
 * 你可以开启关节限制来设置刚体运行移动的间距，也可以开启马达来使用关节马达驱动刚体的运行。
 * @class PrismaticJoint
 * @extends Joint
 */


var PrismaticJoint = cc.Class({
  name: 'cc.PrismaticJoint',
  "extends": cc.Joint,
  editor: CC_EDITOR && {
    inspector: 'packages://inspector/inspectors/comps/physics/joint.js',
    menu: 'i18n:MAIN_MENU.component.physics/Joint/PrismaticJoint'
  },
  properties: {
    /**
     * !#en
     * The local joint axis relative to rigidbody.
     * !#zh
     * 指定刚体可以移动的方向。
     * @property {Vec2} localAxisA
     * @default cc.v2(1, 0)
     */
    localAxisA: {
      "default": cc.v2(1, 0),
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.localAxisA'
    },

    /**
     * !#en
     * The reference angle.
     * !#zh
     * 相对角度
     * @property {Number} referenceAngle
     * @default 0
     */
    referenceAngle: {
      "default": 0,
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.referenceAngle'
    },

    /**
     * !#en
     * Enable joint distance limit?
     * !#zh
     * 是否开启关节的距离限制？
     * @property {Boolean} enableLimit
     * @default false
     */
    enableLimit: {
      "default": false,
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.enableLimit'
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
      "default": false,
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.enableMotor'
    },

    /**
     * !#en
     * The lower joint limit.
     * !#zh
     * 刚体能够移动的最小值
     * @property {Number} lowerLimit
     * @default 0
     */
    lowerLimit: {
      "default": 0,
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.lowerLimit'
    },

    /**
     * !#en
     * The upper joint limit.
     * !#zh
     * 刚体能够移动的最大值
     * @property {Number} upperLimit
     * @default 0
     */
    upperLimit: {
      "default": 0,
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.upperLimit'
    },
    _maxMotorForce: 0,
    _motorSpeed: 0,

    /**
     * !#en
     * The maxium force can be applied to rigidbody to rearch the target motor speed.
     * !#zh
     * 可以施加到刚体的最大力。
     * @property {Number} maxMotorForce
     * @default 0
     */
    maxMotorForce: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.maxMotorForce',
      get: function get() {
        return this._maxMotorForce;
      },
      set: function set(value) {
        this._maxMotorForce = value;

        if (this._joint) {
          this._joint.SetMaxMotorForce(value);
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
          this._joint.SetMotorSpeed(value);
        }
      }
    }
  },
  _createJointDef: function _createJointDef() {
    var def = new b2.PrismaticJointDef();
    def.localAnchorA = new b2.Vec2(this.anchor.x / PTM_RATIO, this.anchor.y / PTM_RATIO);
    def.localAnchorB = new b2.Vec2(this.connectedAnchor.x / PTM_RATIO, this.connectedAnchor.y / PTM_RATIO);
    def.localAxisA = new b2.Vec2(this.localAxisA.x, this.localAxisA.y);
    def.referenceAngle = this.referenceAngle * ANGLE_TO_PHYSICS_ANGLE;
    def.enableLimit = this.enableLimit;
    def.lowerTranslation = this.lowerLimit / PTM_RATIO;
    def.upperTranslation = this.upperLimit / PTM_RATIO;
    def.enableMotor = this.enableMotor;
    def.maxMotorForce = this.maxMotorForce;
    def.motorSpeed = this.motorSpeed;
    return def;
  }
});
cc.PrismaticJoint = module.exports = PrismaticJoint;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDUHJpc21hdGljSm9pbnQuanMiXSwibmFtZXMiOlsiUFRNX1JBVElPIiwicmVxdWlyZSIsIkFOR0xFX1RPX1BIWVNJQ1NfQU5HTEUiLCJQcmlzbWF0aWNKb2ludCIsImNjIiwiQ2xhc3MiLCJuYW1lIiwiSm9pbnQiLCJlZGl0b3IiLCJDQ19FRElUT1IiLCJpbnNwZWN0b3IiLCJtZW51IiwicHJvcGVydGllcyIsImxvY2FsQXhpc0EiLCJ2MiIsInRvb2x0aXAiLCJDQ19ERVYiLCJyZWZlcmVuY2VBbmdsZSIsImVuYWJsZUxpbWl0IiwiZW5hYmxlTW90b3IiLCJsb3dlckxpbWl0IiwidXBwZXJMaW1pdCIsIl9tYXhNb3RvckZvcmNlIiwiX21vdG9yU3BlZWQiLCJtYXhNb3RvckZvcmNlIiwiZ2V0Iiwic2V0IiwidmFsdWUiLCJfam9pbnQiLCJTZXRNYXhNb3RvckZvcmNlIiwibW90b3JTcGVlZCIsIlNldE1vdG9yU3BlZWQiLCJfY3JlYXRlSm9pbnREZWYiLCJkZWYiLCJiMiIsIlByaXNtYXRpY0pvaW50RGVmIiwibG9jYWxBbmNob3JBIiwiVmVjMiIsImFuY2hvciIsIngiLCJ5IiwibG9jYWxBbmNob3JCIiwiY29ubmVjdGVkQW5jaG9yIiwibG93ZXJUcmFuc2xhdGlvbiIsInVwcGVyVHJhbnNsYXRpb24iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkEsSUFBSUEsU0FBUyxHQUFHQyxPQUFPLENBQUMsbUJBQUQsQ0FBUCxDQUE2QkQsU0FBN0M7O0FBQ0EsSUFBSUUsc0JBQXNCLEdBQUdELE9BQU8sQ0FBQyxtQkFBRCxDQUFQLENBQTZCQyxzQkFBMUQ7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUFZQSxJQUFJQyxjQUFjLEdBQUdDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQzFCQyxFQUFBQSxJQUFJLEVBQUUsbUJBRG9CO0FBRTFCLGFBQVNGLEVBQUUsQ0FBQ0csS0FG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QUFDRyxJQUFQLENBQVksS0FBS3hCLFVBQUwsQ0FBZ0IwQixDQUE1QixFQUErQixLQUFLMUIsVUFBTCxDQUFnQjJCLENBQS9DLENBQWpCO0FBQ0FQLElBQUFBLEdBQUcsQ0FBQ2hCLGNBQUosR0FBcUIsS0FBS0EsY0FBTCxHQUFzQmYsc0JBQTNDO0FBQ0ErQixJQUFBQSxHQUFHLENBQUNmLFdBQUosR0FBa0IsS0FBS0EsV0FBdkI7QUFDQWUsSUFBQUEsR0FBRyxDQUFDVSxnQkFBSixHQUF1QixLQUFLdkIsVUFBTCxHQUFnQnBCLFNBQXZDO0FBQ0FpQyxJQUFBQSxHQUFHLENBQUNXLGdCQUFKLEdBQXVCLEtBQUt2QixVQUFMLEdBQWdCckIsU0FBdkM7QUFDQWlDLElBQUFBLEdBQUcsQ0FBQ2QsV0FBSixHQUFrQixLQUFLQSxXQUF2QjtBQUNBYyxJQUFBQSxHQUFHLENBQUNULGFBQUosR0FBb0IsS0FBS0EsYUFBekI7QUFDQVMsSUFBQUEsR0FBRyxDQUFDSCxVQUFKLEdBQWlCLEtBQUtBLFVBQXRCO0FBRUEsV0FBT0csR0FBUDtBQUNIO0FBbkp5QixDQUFULENBQXJCO0FBc0pBN0IsRUFBRSxDQUFDRCxjQUFILEdBQW9CMEMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCM0MsY0FBckMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnZhciBQVE1fUkFUSU8gPSByZXF1aXJlKCcuLi9DQ1BoeXNpY3NUeXBlcycpLlBUTV9SQVRJTztcbnZhciBBTkdMRV9UT19QSFlTSUNTX0FOR0xFID0gcmVxdWlyZSgnLi4vQ0NQaHlzaWNzVHlwZXMnKS5BTkdMRV9UT19QSFlTSUNTX0FOR0xFO1xuXG4vKipcbiAqICEjZW5cbiAqIEEgcHJpc21hdGljIGpvaW50LiBUaGlzIGpvaW50IHByb3ZpZGVzIG9uZSBkZWdyZWUgb2YgZnJlZWRvbTogdHJhbnNsYXRpb25cbiAqIGFsb25nIGFuIGF4aXMgZml4ZWQgaW4gcmlnaWRib2R5LiBSZWxhdGl2ZSByb3RhdGlvbiBpcyBwcmV2ZW50ZWQuIFlvdSBjYW5cbiAqIHVzZSBhIGpvaW50IGxpbWl0IHRvIHJlc3RyaWN0IHRoZSByYW5nZSBvZiBtb3Rpb24gYW5kIGEgam9pbnQgbW90b3IgdG9cbiAqIGRyaXZlIHRoZSBtb3Rpb24gb3IgdG8gbW9kZWwgam9pbnQgZnJpY3Rpb24uXG4gKiAhI3poXG4gKiDnp7vliqjlhbPoioLmjIflrprkuoblj6rog73lnKjkuIDkuKrmlrnlkJHkuIrnp7vliqjliJrkvZPjgIJcbiAqIOS9oOWPr+S7peW8gOWQr+WFs+iKgumZkOWItuadpeiuvue9ruWImuS9k+i/kOihjOenu+WKqOeahOmXtOi3ne+8jOS5n+WPr+S7peW8gOWQr+mprOi+vuadpeS9v+eUqOWFs+iKgumprOi+vumpseWKqOWImuS9k+eahOi/kOihjOOAglxuICogQGNsYXNzIFByaXNtYXRpY0pvaW50XG4gKiBAZXh0ZW5kcyBKb2ludFxuICovXG52YXIgUHJpc21hdGljSm9pbnQgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlByaXNtYXRpY0pvaW50JyxcbiAgICBleHRlbmRzOiBjYy5Kb2ludCxcbiAgICBcbiAgICBlZGl0b3I6IENDX0VESVRPUiAmJiB7XG4gICAgICAgIGluc3BlY3RvcjogJ3BhY2thZ2VzOi8vaW5zcGVjdG9yL2luc3BlY3RvcnMvY29tcHMvcGh5c2ljcy9qb2ludC5qcycsXG4gICAgICAgIG1lbnU6ICdpMThuOk1BSU5fTUVOVS5jb21wb25lbnQucGh5c2ljcy9Kb2ludC9QcmlzbWF0aWNKb2ludCcsXG4gICAgfSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIGxvY2FsIGpvaW50IGF4aXMgcmVsYXRpdmUgdG8gcmlnaWRib2R5LlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOaMh+WumuWImuS9k+WPr+S7peenu+WKqOeahOaWueWQkeOAglxuICAgICAgICAgKiBAcHJvcGVydHkge1ZlYzJ9IGxvY2FsQXhpc0FcbiAgICAgICAgICogQGRlZmF1bHQgY2MudjIoMSwgMClcbiAgICAgICAgICovXG4gICAgICAgIGxvY2FsQXhpc0E6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IGNjLnYyKDEsIDApLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5waHlzaWNzLnBoeXNpY3NfY29sbGlkZXIubG9jYWxBeGlzQSdcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgcmVmZXJlbmNlIGFuZ2xlLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOebuOWvueinkuW6plxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gcmVmZXJlbmNlQW5nbGVcbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgcmVmZXJlbmNlQW5nbGU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IDAsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBoeXNpY3MucGh5c2ljc19jb2xsaWRlci5yZWZlcmVuY2VBbmdsZScgICAgICAgICAgICBcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBFbmFibGUgam9pbnQgZGlzdGFuY2UgbGltaXQ/XG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5piv5ZCm5byA5ZCv5YWz6IqC55qE6Led56a76ZmQ5Yi277yfXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZW5hYmxlTGltaXRcbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICovXG4gICAgICAgIGVuYWJsZUxpbWl0OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGh5c2ljcy5waHlzaWNzX2NvbGxpZGVyLmVuYWJsZUxpbWl0J1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIEVuYWJsZSBqb2ludCBtb3Rvcj9cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDmmK/lkKblvIDlkK/lhbPoioLpqazovr7vvJ9cbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBlbmFibGVNb3RvclxuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgZW5hYmxlTW90b3I6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5waHlzaWNzLnBoeXNpY3NfY29sbGlkZXIuZW5hYmxlTW90b3InICAgICAgICAgICAgXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIGxvd2VyIGpvaW50IGxpbWl0LlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOWImuS9k+iDveWkn+enu+WKqOeahOacgOWwj+WAvFxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gbG93ZXJMaW1pdFxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICBsb3dlckxpbWl0OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5waHlzaWNzLnBoeXNpY3NfY29sbGlkZXIubG93ZXJMaW1pdCdcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIHVwcGVyIGpvaW50IGxpbWl0LlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOWImuS9k+iDveWkn+enu+WKqOeahOacgOWkp+WAvFxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gdXBwZXJMaW1pdFxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB1cHBlckxpbWl0OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5waHlzaWNzLnBoeXNpY3NfY29sbGlkZXIudXBwZXJMaW1pdCcgICAgICAgICAgICBcbiAgICAgICAgfSxcblxuICAgICAgICBfbWF4TW90b3JGb3JjZTogMCxcbiAgICAgICAgX21vdG9yU3BlZWQ6IDAsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIG1heGl1bSBmb3JjZSBjYW4gYmUgYXBwbGllZCB0byByaWdpZGJvZHkgdG8gcmVhcmNoIHRoZSB0YXJnZXQgbW90b3Igc3BlZWQuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5Y+v5Lul5pa95Yqg5Yiw5Yia5L2T55qE5pyA5aSn5Yqb44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBtYXhNb3RvckZvcmNlXG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIG1heE1vdG9yRm9yY2U6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGh5c2ljcy5waHlzaWNzX2NvbGxpZGVyLm1heE1vdG9yRm9yY2UnLFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21heE1vdG9yRm9yY2U7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXhNb3RvckZvcmNlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2pvaW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2pvaW50LlNldE1heE1vdG9yRm9yY2UodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgZXhwZWN0ZWQgbW90b3Igc3BlZWQuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5pyf5pyb55qE6ams6L6+6YCf5bqm44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBtb3RvclNwZWVkXG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIG1vdG9yU3BlZWQ6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGh5c2ljcy5waHlzaWNzX2NvbGxpZGVyLm1vdG9yU3BlZWQnLCAgICAgICAgICAgIFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21vdG9yU3BlZWQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb3RvclNwZWVkID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2pvaW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2pvaW50LlNldE1vdG9yU3BlZWQodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgX2NyZWF0ZUpvaW50RGVmOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkZWYgPSBuZXcgYjIuUHJpc21hdGljSm9pbnREZWYoKTtcbiAgICAgICAgZGVmLmxvY2FsQW5jaG9yQSA9IG5ldyBiMi5WZWMyKHRoaXMuYW5jaG9yLngvUFRNX1JBVElPLCB0aGlzLmFuY2hvci55L1BUTV9SQVRJTyk7XG4gICAgICAgIGRlZi5sb2NhbEFuY2hvckIgPSBuZXcgYjIuVmVjMih0aGlzLmNvbm5lY3RlZEFuY2hvci54L1BUTV9SQVRJTywgdGhpcy5jb25uZWN0ZWRBbmNob3IueS9QVE1fUkFUSU8pO1xuICAgICAgICBkZWYubG9jYWxBeGlzQSA9IG5ldyBiMi5WZWMyKHRoaXMubG9jYWxBeGlzQS54LCB0aGlzLmxvY2FsQXhpc0EueSk7XG4gICAgICAgIGRlZi5yZWZlcmVuY2VBbmdsZSA9IHRoaXMucmVmZXJlbmNlQW5nbGUgKiBBTkdMRV9UT19QSFlTSUNTX0FOR0xFO1xuICAgICAgICBkZWYuZW5hYmxlTGltaXQgPSB0aGlzLmVuYWJsZUxpbWl0O1xuICAgICAgICBkZWYubG93ZXJUcmFuc2xhdGlvbiA9IHRoaXMubG93ZXJMaW1pdC9QVE1fUkFUSU87XG4gICAgICAgIGRlZi51cHBlclRyYW5zbGF0aW9uID0gdGhpcy51cHBlckxpbWl0L1BUTV9SQVRJTztcbiAgICAgICAgZGVmLmVuYWJsZU1vdG9yID0gdGhpcy5lbmFibGVNb3RvcjtcbiAgICAgICAgZGVmLm1heE1vdG9yRm9yY2UgPSB0aGlzLm1heE1vdG9yRm9yY2U7XG4gICAgICAgIGRlZi5tb3RvclNwZWVkID0gdGhpcy5tb3RvclNwZWVkO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGRlZjtcbiAgICB9XG59KTtcblxuY2MuUHJpc21hdGljSm9pbnQgPSBtb2R1bGUuZXhwb3J0cyA9IFByaXNtYXRpY0pvaW50O1xuIl19