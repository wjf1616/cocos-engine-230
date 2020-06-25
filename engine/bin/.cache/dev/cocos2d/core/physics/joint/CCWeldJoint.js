
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/physics/joint/CCWeldJoint.js';
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
 * A weld joint essentially glues two bodies together. A weld joint may
 * distort somewhat because the island constraint solver is approximate.
 * !#zh
 * 熔接关节相当于将两个刚体粘在了一起。
 * 熔接关节可能会使某些东西失真，因为约束求解器算出的都是近似值。
 * @class WeldJoint
 * @extends Joint
 */


var WeldJoint = cc.Class({
  name: 'cc.WeldJoint',
  "extends": cc.Joint,
  editor: CC_EDITOR && {
    inspector: 'packages://inspector/inspectors/comps/physics/joint.js',
    menu: 'i18n:MAIN_MENU.component.physics/Joint/Weld'
  },
  properties: {
    /**
     * !#en
     * The reference angle.
     * !#zh
     * 相对角度。
     * @property {Number} referenceAngle
     * @default 0
     */
    referenceAngle: {
      "default": 0,
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.referenceAngle'
    },
    _frequency: 0,
    _dampingRatio: 0,

    /**
     * !#en
     * The frequency.
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
          this._joint.SetFrequency(value);
        }
      }
    },

    /**
     * !#en
     * The damping ratio.
     * !#zh
     * 阻尼，表示关节变形后，恢复到初始状态受到的阻力。
     * @property {Number} dampingRatio
     * @property 0
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
    var def = new b2.WeldJointDef();
    def.localAnchorA = new b2.Vec2(this.anchor.x / PTM_RATIO, this.anchor.y / PTM_RATIO);
    def.localAnchorB = new b2.Vec2(this.connectedAnchor.x / PTM_RATIO, this.connectedAnchor.y / PTM_RATIO);
    def.referenceAngle = this.referenceAngle * ANGLE_TO_PHYSICS_ANGLE;
    def.frequencyHz = this.frequency;
    def.dampingRatio = this.dampingRatio;
    return def;
  }
});
cc.WeldJoint = module.exports = WeldJoint;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDV2VsZEpvaW50LmpzIl0sIm5hbWVzIjpbIlBUTV9SQVRJTyIsInJlcXVpcmUiLCJBTkdMRV9UT19QSFlTSUNTX0FOR0xFIiwiV2VsZEpvaW50IiwiY2MiLCJDbGFzcyIsIm5hbWUiLCJKb2ludCIsImVkaXRvciIsIkNDX0VESVRPUiIsImluc3BlY3RvciIsIm1lbnUiLCJwcm9wZXJ0aWVzIiwicmVmZXJlbmNlQW5nbGUiLCJ0b29sdGlwIiwiQ0NfREVWIiwiX2ZyZXF1ZW5jeSIsIl9kYW1waW5nUmF0aW8iLCJmcmVxdWVuY3kiLCJnZXQiLCJzZXQiLCJ2YWx1ZSIsIl9qb2ludCIsIlNldEZyZXF1ZW5jeSIsImRhbXBpbmdSYXRpbyIsIlNldERhbXBpbmdSYXRpbyIsIl9jcmVhdGVKb2ludERlZiIsImRlZiIsImIyIiwiV2VsZEpvaW50RGVmIiwibG9jYWxBbmNob3JBIiwiVmVjMiIsImFuY2hvciIsIngiLCJ5IiwibG9jYWxBbmNob3JCIiwiY29ubmVjdGVkQW5jaG9yIiwiZnJlcXVlbmN5SHoiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkEsSUFBSUEsU0FBUyxHQUFHQyxPQUFPLENBQUMsbUJBQUQsQ0FBUCxDQUE2QkQsU0FBN0M7O0FBQ0EsSUFBSUUsc0JBQXNCLEdBQUdELE9BQU8sQ0FBQyxtQkFBRCxDQUFQLENBQTZCQyxzQkFBMUQ7QUFFQTs7Ozs7Ozs7Ozs7O0FBVUEsSUFBSUMsU0FBUyxHQUFHQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNyQkMsRUFBQUEsSUFBSSxFQUFFLGNBRGU7QUFFckIsYUFBU0YsRUFBRSxDQUFDRyxLQUZTO0FBSXJCQyxFQUFBQSxNQUFNLEVBQUVDLFNBQVMsSUFBSTtBQUNqQkMsSUFBQUEsU0FBUyxFQUFFLHdEQURNO0FBRWpCQyxJQUFBQSxJQUFJLEVBQUU7QUFGVyxHQUpBO0FBU3JCQyxFQUFBQSxVQUFVLEVBQUU7QUFDUjs7Ozs7Ozs7QUFRQUMsSUFBQUEsY0FBYyxFQUFFO0FBQ1osaUJBQVMsQ0FERztBQUVaQyxNQUFBQSxPQUFPLEVBQUVDLE1BQU0sSUFBSTtBQUZQLEtBVFI7QUFjUkMsSUFBQUEsVUFBVSxFQUFFLENBZEo7QUFlUkMsSUFBQUEsYUFBYSxFQUFFLENBZlA7O0FBaUJSOzs7Ozs7OztBQVFBQyxJQUFBQSxTQUFTLEVBQUU7QUFDUEosTUFBQUEsT0FBTyxFQUFFQyxNQUFNLElBQUksbURBRFo7QUFFUEksTUFBQUEsR0FBRyxFQUFFLGVBQVk7QUFDYixlQUFPLEtBQUtILFVBQVo7QUFDSCxPQUpNO0FBS1BJLE1BQUFBLEdBQUcsRUFBRSxhQUFVQyxLQUFWLEVBQWlCO0FBQ2xCLGFBQUtMLFVBQUwsR0FBa0JLLEtBQWxCOztBQUNBLFlBQUksS0FBS0MsTUFBVCxFQUFpQjtBQUNiLGVBQUtBLE1BQUwsQ0FBWUMsWUFBWixDQUF5QkYsS0FBekI7QUFDSDtBQUNKO0FBVk0sS0F6Qkg7O0FBc0NSOzs7Ozs7OztBQVFBRyxJQUFBQSxZQUFZLEVBQUU7QUFDVlYsTUFBQUEsT0FBTyxFQUFFQyxNQUFNLElBQUksc0RBRFQ7QUFFVkksTUFBQUEsR0FBRyxFQUFFLGVBQVk7QUFDYixlQUFPLEtBQUtGLGFBQVo7QUFDSCxPQUpTO0FBS1ZHLE1BQUFBLEdBQUcsRUFBRSxhQUFVQyxLQUFWLEVBQWlCO0FBQ2xCLGFBQUtKLGFBQUwsR0FBcUJJLEtBQXJCOztBQUNBLFlBQUksS0FBS0MsTUFBVCxFQUFpQjtBQUNiLGVBQUtBLE1BQUwsQ0FBWUcsZUFBWixDQUE0QkosS0FBNUI7QUFDSDtBQUNKO0FBVlM7QUE5Q04sR0FUUztBQXFFckJLLEVBQUFBLGVBQWUsRUFBRSwyQkFBWTtBQUN6QixRQUFJQyxHQUFHLEdBQUcsSUFBSUMsRUFBRSxDQUFDQyxZQUFQLEVBQVY7QUFDQUYsSUFBQUEsR0FBRyxDQUFDRyxZQUFKLEdBQW1CLElBQUlGLEVBQUUsQ0FBQ0csSUFBUCxDQUFZLEtBQUtDLE1BQUwsQ0FBWUMsQ0FBWixHQUFjakMsU0FBMUIsRUFBcUMsS0FBS2dDLE1BQUwsQ0FBWUUsQ0FBWixHQUFjbEMsU0FBbkQsQ0FBbkI7QUFDQTJCLElBQUFBLEdBQUcsQ0FBQ1EsWUFBSixHQUFtQixJQUFJUCxFQUFFLENBQUNHLElBQVAsQ0FBWSxLQUFLSyxlQUFMLENBQXFCSCxDQUFyQixHQUF1QmpDLFNBQW5DLEVBQThDLEtBQUtvQyxlQUFMLENBQXFCRixDQUFyQixHQUF1QmxDLFNBQXJFLENBQW5CO0FBQ0EyQixJQUFBQSxHQUFHLENBQUNkLGNBQUosR0FBcUIsS0FBS0EsY0FBTCxHQUFzQlgsc0JBQTNDO0FBRUF5QixJQUFBQSxHQUFHLENBQUNVLFdBQUosR0FBa0IsS0FBS25CLFNBQXZCO0FBQ0FTLElBQUFBLEdBQUcsQ0FBQ0gsWUFBSixHQUFtQixLQUFLQSxZQUF4QjtBQUVBLFdBQU9HLEdBQVA7QUFDSDtBQS9Fb0IsQ0FBVCxDQUFoQjtBQWtGQXZCLEVBQUUsQ0FBQ0QsU0FBSCxHQUFlbUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCcEMsU0FBaEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnZhciBQVE1fUkFUSU8gPSByZXF1aXJlKCcuLi9DQ1BoeXNpY3NUeXBlcycpLlBUTV9SQVRJTztcbnZhciBBTkdMRV9UT19QSFlTSUNTX0FOR0xFID0gcmVxdWlyZSgnLi4vQ0NQaHlzaWNzVHlwZXMnKS5BTkdMRV9UT19QSFlTSUNTX0FOR0xFO1xuXG4vKipcbiAqICEjZW5cbiAqIEEgd2VsZCBqb2ludCBlc3NlbnRpYWxseSBnbHVlcyB0d28gYm9kaWVzIHRvZ2V0aGVyLiBBIHdlbGQgam9pbnQgbWF5XG4gKiBkaXN0b3J0IHNvbWV3aGF0IGJlY2F1c2UgdGhlIGlzbGFuZCBjb25zdHJhaW50IHNvbHZlciBpcyBhcHByb3hpbWF0ZS5cbiAqICEjemhcbiAqIOeGlOaOpeWFs+iKguebuOW9k+S6juWwhuS4pOS4quWImuS9k+eymOWcqOS6huS4gOi1t+OAglxuICog54aU5o6l5YWz6IqC5Y+v6IO95Lya5L2/5p+Q5Lqb5Lic6KW/5aSx55yf77yM5Zug5Li657qm5p2f5rGC6Kej5Zmo566X5Ye655qE6YO95piv6L+R5Ly85YC844CCXG4gKiBAY2xhc3MgV2VsZEpvaW50XG4gKiBAZXh0ZW5kcyBKb2ludFxuICovXG52YXIgV2VsZEpvaW50ID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5XZWxkSm9pbnQnLFxuICAgIGV4dGVuZHM6IGNjLkpvaW50LFxuICAgIFxuICAgIGVkaXRvcjogQ0NfRURJVE9SICYmIHtcbiAgICAgICAgaW5zcGVjdG9yOiAncGFja2FnZXM6Ly9pbnNwZWN0b3IvaW5zcGVjdG9ycy9jb21wcy9waHlzaWNzL2pvaW50LmpzJyxcbiAgICAgICAgbWVudTogJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC5waHlzaWNzL0pvaW50L1dlbGQnLFxuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSByZWZlcmVuY2UgYW5nbGUuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog55u45a+56KeS5bqm44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSByZWZlcmVuY2VBbmdsZVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICByZWZlcmVuY2VBbmdsZToge1xuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGh5c2ljcy5waHlzaWNzX2NvbGxpZGVyLnJlZmVyZW5jZUFuZ2xlJyAgICAgICAgICAgIFxuICAgICAgICB9LFxuXG4gICAgICAgIF9mcmVxdWVuY3k6IDAsXG4gICAgICAgIF9kYW1waW5nUmF0aW86IDAsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIGZyZXF1ZW5jeS5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDlvLnmgKfns7vmlbDjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGZyZXF1ZW5jeVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICBmcmVxdWVuY3k6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGh5c2ljcy5waHlzaWNzX2NvbGxpZGVyLmZyZXF1ZW5jeScsXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZnJlcXVlbmN5O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZnJlcXVlbmN5ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2pvaW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2pvaW50LlNldEZyZXF1ZW5jeSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBkYW1waW5nIHJhdGlvLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOmYu+WwvO+8jOihqOekuuWFs+iKguWPmOW9ouWQju+8jOaBouWkjeWIsOWIneWni+eKtuaAgeWPl+WIsOeahOmYu+WKm+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gZGFtcGluZ1JhdGlvXG4gICAgICAgICAqIEBwcm9wZXJ0eSAwXG4gICAgICAgICAqL1xuICAgICAgICBkYW1waW5nUmF0aW86IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGh5c2ljcy5waHlzaWNzX2NvbGxpZGVyLmRhbXBpbmdSYXRpbycsICAgICAgICAgICAgXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZGFtcGluZ1JhdGlvO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGFtcGluZ1JhdGlvID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2pvaW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2pvaW50LlNldERhbXBpbmdSYXRpbyh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9jcmVhdGVKb2ludERlZjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGVmID0gbmV3IGIyLldlbGRKb2ludERlZigpO1xuICAgICAgICBkZWYubG9jYWxBbmNob3JBID0gbmV3IGIyLlZlYzIodGhpcy5hbmNob3IueC9QVE1fUkFUSU8sIHRoaXMuYW5jaG9yLnkvUFRNX1JBVElPKTtcbiAgICAgICAgZGVmLmxvY2FsQW5jaG9yQiA9IG5ldyBiMi5WZWMyKHRoaXMuY29ubmVjdGVkQW5jaG9yLngvUFRNX1JBVElPLCB0aGlzLmNvbm5lY3RlZEFuY2hvci55L1BUTV9SQVRJTyk7XG4gICAgICAgIGRlZi5yZWZlcmVuY2VBbmdsZSA9IHRoaXMucmVmZXJlbmNlQW5nbGUgKiBBTkdMRV9UT19QSFlTSUNTX0FOR0xFO1xuXG4gICAgICAgIGRlZi5mcmVxdWVuY3lIeiA9IHRoaXMuZnJlcXVlbmN5O1xuICAgICAgICBkZWYuZGFtcGluZ1JhdGlvID0gdGhpcy5kYW1waW5nUmF0aW87XG5cbiAgICAgICAgcmV0dXJuIGRlZjtcbiAgICB9XG59KTtcblxuY2MuV2VsZEpvaW50ID0gbW9kdWxlLmV4cG9ydHMgPSBXZWxkSm9pbnQ7XG4iXX0=