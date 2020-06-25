
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/physics/joint/CCWheelJoint.js';
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
 * A wheel joint. This joint provides two degrees of freedom: translation
 * along an axis fixed in bodyA and rotation in the plane. You can use a joint motor to drive
 * the rotation or to model rotational friction.
 * This joint is designed for vehicle suspensions.
 * !#zh
 * 轮子关节提供两个维度的自由度：旋转和沿着指定方向上位置的移动。
 * 你可以通过开启关节马达来使用马达驱动刚体的旋转。
 * 轮组关节是专门为机动车类型设计的。
 * @class WheelJoint
 * @extends Joint
 */


var WheelJoint = cc.Class({
  name: 'cc.WheelJoint',
  "extends": cc.Joint,
  editor: CC_EDITOR && {
    inspector: 'packages://inspector/inspectors/comps/physics/joint.js',
    menu: 'i18n:MAIN_MENU.component.physics/Joint/Wheel'
  },
  properties: {
    _maxMotorTorque: 0,
    _motorSpeed: 0,
    _enableMotor: false,
    _frequency: 2,
    _dampingRatio: 0.7,

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
    },

    /**
     * !#en
     * The spring frequency.
     * !#zh
     * 弹性系数。
     * @property {Number} frequency
     * @default 0
     */
    frequency: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.frequency',
      get: function get() {
        return this._frequency;
      },
      set: function set(value) {
        this._frequency = value;

        if (this._joint) {
          this._joint.SetSpringFrequencyHz(value);
        }
      }
    },

    /**
     * !#en
     * The damping ratio.
     * !#zh
     * 阻尼，表示关节变形后，恢复到初始状态受到的阻力。
     * @property {Number} dampingRatio
     * @default 0
     */
    dampingRatio: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.dampingRatio',
      get: function get() {
        return this._dampingRatio;
      },
      set: function set(value) {
        this._dampingRatio = value;

        if (this._joint) {
          this._joint.SetDampingRatio(value);
        }
      }
    }
  },
  _createJointDef: function _createJointDef() {
    var def = new b2.WheelJointDef();
    def.localAnchorA = new b2.Vec2(this.anchor.x / PTM_RATIO, this.anchor.y / PTM_RATIO);
    def.localAnchorB = new b2.Vec2(this.connectedAnchor.x / PTM_RATIO, this.connectedAnchor.y / PTM_RATIO);
    def.localAxisA = new b2.Vec2(this.localAxisA.x, this.localAxisA.y);
    def.maxMotorTorque = this.maxMotorTorque;
    def.motorSpeed = this.motorSpeed * ANGLE_TO_PHYSICS_ANGLE;
    def.enableMotor = this.enableMotor;
    def.dampingRatio = this.dampingRatio;
    def.frequencyHz = this.frequency;
    return def;
  }
});
cc.WheelJoint = module.exports = WheelJoint;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDV2hlZWxKb2ludC5qcyJdLCJuYW1lcyI6WyJQVE1fUkFUSU8iLCJyZXF1aXJlIiwiQU5HTEVfVE9fUEhZU0lDU19BTkdMRSIsIldoZWVsSm9pbnQiLCJjYyIsIkNsYXNzIiwibmFtZSIsIkpvaW50IiwiZWRpdG9yIiwiQ0NfRURJVE9SIiwiaW5zcGVjdG9yIiwibWVudSIsInByb3BlcnRpZXMiLCJfbWF4TW90b3JUb3JxdWUiLCJfbW90b3JTcGVlZCIsIl9lbmFibGVNb3RvciIsIl9mcmVxdWVuY3kiLCJfZGFtcGluZ1JhdGlvIiwibG9jYWxBeGlzQSIsInYyIiwidG9vbHRpcCIsIkNDX0RFViIsIm1heE1vdG9yVG9ycXVlIiwiZ2V0Iiwic2V0IiwidmFsdWUiLCJfam9pbnQiLCJTZXRNYXhNb3RvclRvcnF1ZSIsIm1vdG9yU3BlZWQiLCJTZXRNb3RvclNwZWVkIiwiZW5hYmxlTW90b3IiLCJFbmFibGVNb3RvciIsImZyZXF1ZW5jeSIsIlNldFNwcmluZ0ZyZXF1ZW5jeUh6IiwiZGFtcGluZ1JhdGlvIiwiU2V0RGFtcGluZ1JhdGlvIiwiX2NyZWF0ZUpvaW50RGVmIiwiZGVmIiwiYjIiLCJXaGVlbEpvaW50RGVmIiwibG9jYWxBbmNob3JBIiwiVmVjMiIsImFuY2hvciIsIngiLCJ5IiwibG9jYWxBbmNob3JCIiwiY29ubmVjdGVkQW5jaG9yIiwiZnJlcXVlbmN5SHoiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkEsSUFBSUEsU0FBUyxHQUFHQyxPQUFPLENBQUMsbUJBQUQsQ0FBUCxDQUE2QkQsU0FBN0M7O0FBQ0EsSUFBSUUsc0JBQXNCLEdBQUdELE9BQU8sQ0FBQyxtQkFBRCxDQUFQLENBQTZCQyxzQkFBMUQ7QUFFQTs7Ozs7Ozs7Ozs7Ozs7O0FBYUEsSUFBSUMsVUFBVSxHQUFHQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUN0QkMsRUFBQUEsSUFBSSxF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QUFDRCxVQUFILEdBQWdCNkMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCOUMsVUFBakMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnZhciBQVE1fUkFUSU8gPSByZXF1aXJlKCcuLi9DQ1BoeXNpY3NUeXBlcycpLlBUTV9SQVRJTztcbnZhciBBTkdMRV9UT19QSFlTSUNTX0FOR0xFID0gcmVxdWlyZSgnLi4vQ0NQaHlzaWNzVHlwZXMnKS5BTkdMRV9UT19QSFlTSUNTX0FOR0xFO1xuXG4vKipcbiAqICEjZW5cbiAqIEEgd2hlZWwgam9pbnQuIFRoaXMgam9pbnQgcHJvdmlkZXMgdHdvIGRlZ3JlZXMgb2YgZnJlZWRvbTogdHJhbnNsYXRpb25cbiAqIGFsb25nIGFuIGF4aXMgZml4ZWQgaW4gYm9keUEgYW5kIHJvdGF0aW9uIGluIHRoZSBwbGFuZS4gWW91IGNhbiB1c2UgYSBqb2ludCBtb3RvciB0byBkcml2ZVxuICogdGhlIHJvdGF0aW9uIG9yIHRvIG1vZGVsIHJvdGF0aW9uYWwgZnJpY3Rpb24uXG4gKiBUaGlzIGpvaW50IGlzIGRlc2lnbmVkIGZvciB2ZWhpY2xlIHN1c3BlbnNpb25zLlxuICogISN6aFxuICog6L2u5a2Q5YWz6IqC5o+Q5L6b5Lik5Liq57u05bqm55qE6Ieq55Sx5bqm77ya5peL6L2s5ZKM5rK/552A5oyH5a6a5pa55ZCR5LiK5L2N572u55qE56e75Yqo44CCXG4gKiDkvaDlj6/ku6XpgJrov4flvIDlkK/lhbPoioLpqazovr7mnaXkvb/nlKjpqazovr7pqbHliqjliJrkvZPnmoTml4vovazjgIJcbiAqIOi9rue7hOWFs+iKguaYr+S4k+mXqOS4uuacuuWKqOi9puexu+Wei+iuvuiuoeeahOOAglxuICogQGNsYXNzIFdoZWVsSm9pbnRcbiAqIEBleHRlbmRzIEpvaW50XG4gKi9cbnZhciBXaGVlbEpvaW50ID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5XaGVlbEpvaW50JyxcbiAgICBleHRlbmRzOiBjYy5Kb2ludCxcbiAgICBcbiAgICBlZGl0b3I6IENDX0VESVRPUiAmJiB7XG4gICAgICAgIGluc3BlY3RvcjogJ3BhY2thZ2VzOi8vaW5zcGVjdG9yL2luc3BlY3RvcnMvY29tcHMvcGh5c2ljcy9qb2ludC5qcycsXG4gICAgICAgIG1lbnU6ICdpMThuOk1BSU5fTUVOVS5jb21wb25lbnQucGh5c2ljcy9Kb2ludC9XaGVlbCcsXG4gICAgfSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgX21heE1vdG9yVG9ycXVlOiAwLFxuICAgICAgICBfbW90b3JTcGVlZDogMCxcbiAgICAgICAgX2VuYWJsZU1vdG9yOiBmYWxzZSxcbiAgICAgICAgXG4gICAgICAgIF9mcmVxdWVuY3k6IDIsXG4gICAgICAgIF9kYW1waW5nUmF0aW86IDAuNyxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgbG9jYWwgam9pbnQgYXhpcyByZWxhdGl2ZSB0byByaWdpZGJvZHkuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5oyH5a6a5Yia5L2T5Y+v5Lul56e75Yqo55qE5pa55ZCR44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7VmVjMn0gbG9jYWxBeGlzQVxuICAgICAgICAgKiBAZGVmYXVsdCBjYy52MigxLCAwKVxuICAgICAgICAgKi9cbiAgICAgICAgbG9jYWxBeGlzQToge1xuICAgICAgICAgICAgZGVmYXVsdDogY2MudjIoMSwgMCksXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBoeXNpY3MucGh5c2ljc19jb2xsaWRlci5sb2NhbEF4aXNBJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBtYXhpdW0gdG9ycXVlIGNhbiBiZSBhcHBsaWVkIHRvIHJpZ2lkYm9keSB0byByZWFyY2ggdGhlIHRhcmdldCBtb3RvciBzcGVlZC5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDlj6/ku6Xmlr3liqDliLDliJrkvZPnmoTmnIDlpKfmia3nn6njgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IG1heE1vdG9yVG9ycXVlXG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIG1heE1vdG9yVG9ycXVlOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBoeXNpY3MucGh5c2ljc19jb2xsaWRlci5tYXhNb3RvclRvcnF1ZScsICAgICAgICAgICAgXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbWF4TW90b3JUb3JxdWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXhNb3RvclRvcnF1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9qb2ludCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9qb2ludC5TZXRNYXhNb3RvclRvcnF1ZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBleHBlY3RlZCBtb3RvciBzcGVlZC5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDmnJ/mnJvnmoTpqazovr7pgJ/luqbjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IG1vdG9yU3BlZWRcbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgbW90b3JTcGVlZDoge1xuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5waHlzaWNzLnBoeXNpY3NfY29sbGlkZXIubW90b3JTcGVlZCcsXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbW90b3JTcGVlZDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX21vdG9yU3BlZWQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fam9pbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fam9pbnQuU2V0TW90b3JTcGVlZCh2YWx1ZSAqIEFOR0xFX1RPX1BIWVNJQ1NfQU5HTEUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBFbmFibGUgam9pbnQgbW90b3I/XG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5piv5ZCm5byA5ZCv5YWz6IqC6ams6L6+77yfXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZW5hYmxlTW90b3JcbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICovXG4gICAgICAgIGVuYWJsZU1vdG9yOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBoeXNpY3MucGh5c2ljc19jb2xsaWRlci5lbmFibGVNb3RvcicsICAgICAgICAgICAgXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZW5hYmxlTW90b3I7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbmFibGVNb3RvciA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9qb2ludCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9qb2ludC5FbmFibGVNb3Rvcih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBzcHJpbmcgZnJlcXVlbmN5LlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOW8ueaAp+ezu+aVsOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gZnJlcXVlbmN5XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIGZyZXF1ZW5jeToge1xuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5waHlzaWNzLnBoeXNpY3NfY29sbGlkZXIuZnJlcXVlbmN5JyxcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9mcmVxdWVuY3k7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9mcmVxdWVuY3kgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fam9pbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fam9pbnQuU2V0U3ByaW5nRnJlcXVlbmN5SHoodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgZGFtcGluZyByYXRpby5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDpmLvlsLzvvIzooajnpLrlhbPoioLlj5jlvaLlkI7vvIzmgaLlpI3liLDliJ3lp4vnirbmgIHlj5fliLDnmoTpmLvlipvjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGRhbXBpbmdSYXRpb1xuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICBkYW1waW5nUmF0aW86IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGh5c2ljcy5waHlzaWNzX2NvbGxpZGVyLmRhbXBpbmdSYXRpbycsICAgICAgICAgICAgXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZGFtcGluZ1JhdGlvO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGFtcGluZ1JhdGlvID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2pvaW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2pvaW50LlNldERhbXBpbmdSYXRpbyh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9jcmVhdGVKb2ludERlZjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGVmID0gbmV3IGIyLldoZWVsSm9pbnREZWYoKTtcbiAgICAgICAgZGVmLmxvY2FsQW5jaG9yQSA9IG5ldyBiMi5WZWMyKHRoaXMuYW5jaG9yLngvUFRNX1JBVElPLCB0aGlzLmFuY2hvci55L1BUTV9SQVRJTyk7XG4gICAgICAgIGRlZi5sb2NhbEFuY2hvckIgPSBuZXcgYjIuVmVjMih0aGlzLmNvbm5lY3RlZEFuY2hvci54L1BUTV9SQVRJTywgdGhpcy5jb25uZWN0ZWRBbmNob3IueS9QVE1fUkFUSU8pO1xuICAgICAgICBcbiAgICAgICAgZGVmLmxvY2FsQXhpc0EgPSBuZXcgYjIuVmVjMih0aGlzLmxvY2FsQXhpc0EueCwgdGhpcy5sb2NhbEF4aXNBLnkpO1xuICAgICAgICBcbiAgICAgICAgZGVmLm1heE1vdG9yVG9ycXVlID0gdGhpcy5tYXhNb3RvclRvcnF1ZTtcbiAgICAgICAgZGVmLm1vdG9yU3BlZWQgPSB0aGlzLm1vdG9yU3BlZWQgKiBBTkdMRV9UT19QSFlTSUNTX0FOR0xFO1xuICAgICAgICBkZWYuZW5hYmxlTW90b3IgPSB0aGlzLmVuYWJsZU1vdG9yO1xuXG4gICAgICAgIGRlZi5kYW1waW5nUmF0aW8gPSB0aGlzLmRhbXBpbmdSYXRpbztcbiAgICAgICAgZGVmLmZyZXF1ZW5jeUh6ID0gdGhpcy5mcmVxdWVuY3k7XG5cbiAgICAgICAgcmV0dXJuIGRlZjtcbiAgICB9XG59KTtcblxuY2MuV2hlZWxKb2ludCA9IG1vZHVsZS5leHBvcnRzID0gV2hlZWxKb2ludDtcbiJdfQ==