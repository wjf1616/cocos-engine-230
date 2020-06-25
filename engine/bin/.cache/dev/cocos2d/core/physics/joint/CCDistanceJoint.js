
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/physics/joint/CCDistanceJoint.js';
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
 * A distance joint constrains two points on two bodies
 * to remain at a fixed distance from each other. You can view
 * this as a massless, rigid rod.
 * !#zh
 * 距离关节通过一个固定的长度来约束关节链接的两个刚体。你可以将它想象成一个无质量，坚固的木棍。
 * @class DistanceJoint
 * @extends Joint
 */


var DistanceJoint = cc.Class({
  name: 'cc.DistanceJoint',
  "extends": cc.Joint,
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.physics/Joint/Distance',
    inspector: 'packages://inspector/inspectors/comps/physics/joint.js'
  },
  properties: {
    _distance: 1,
    _frequency: 0,
    _dampingRatio: 0,

    /**
     * !#en
     * The distance separating the two ends of the joint.
     * !#zh
     * 关节两端的距离
     * @property {Number} distance
     * @default 1
     */
    distance: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.distance',
      get: function get() {
        return this._distance;
      },
      set: function set(value) {
        this._distance = value;

        if (this._joint) {
          this._joint.SetLength(value);
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
    var def = new b2.DistanceJointDef();
    def.localAnchorA = new b2.Vec2(this.anchor.x / PTM_RATIO, this.anchor.y / PTM_RATIO);
    def.localAnchorB = new b2.Vec2(this.connectedAnchor.x / PTM_RATIO, this.connectedAnchor.y / PTM_RATIO);
    def.length = this.distance / PTM_RATIO;
    def.dampingRatio = this.dampingRatio;
    def.frequencyHz = this.frequency;
    return def;
  }
});
cc.DistanceJoint = module.exports = DistanceJoint;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDRGlzdGFuY2VKb2ludC5qcyJdLCJuYW1lcyI6WyJQVE1fUkFUSU8iLCJyZXF1aXJlIiwiRGlzdGFuY2VKb2ludCIsImNjIiwiQ2xhc3MiLCJuYW1lIiwiSm9pbnQiLCJlZGl0b3IiLCJDQ19FRElUT1IiLCJtZW51IiwiaW5zcGVjdG9yIiwicHJvcGVydGllcyIsIl9kaXN0YW5jZSIsIl9mcmVxdWVuY3kiLCJfZGFtcGluZ1JhdGlvIiwiZGlzdGFuY2UiLCJ0b29sdGlwIiwiQ0NfREVWIiwiZ2V0Iiwic2V0IiwidmFsdWUiLCJfam9pbnQiLCJTZXRMZW5ndGgiLCJmcmVxdWVuY3kiLCJTZXRGcmVxdWVuY3kiLCJkYW1waW5nUmF0aW8iLCJTZXREYW1waW5nUmF0aW8iLCJfY3JlYXRlSm9pbnREZWYiLCJkZWYiLCJiMiIsIkRpc3RhbmNlSm9pbnREZWYiLCJsb2NhbEFuY2hvckEiLCJWZWMyIiwiYW5jaG9yIiwieCIsInkiLCJsb2NhbEFuY2hvckIiLCJjb25uZWN0ZWRBbmNob3IiLCJsZW5ndGgiLCJmcmVxdWVuY3lIeiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFJQSxTQUFTLEdBQUdDLE9BQU8sQ0FBQyxtQkFBRCxDQUFQLENBQTZCRCxTQUE3QztBQUVBOzs7Ozs7Ozs7Ozs7QUFVQSxJQUFJRSxhQUFhLEdBQUdDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ3pCQyxFQUFBQSxJQUFJLEVBQUUsa0JBRG1CO0FBRXpCLGFBQVNGLEVBQUUsQ0FBQ0csS0FGYTtBQUl6QkMsRUFBQUEsTUFBTSxFQUFFQyxTQUFTLElBQUk7QUFDakJDLElBQUFBLElBQUksRUFBRSxpREFEVztBQUVqQkMsSUFBQUEsU0FBUyxFQUFFO0FBRk0sR0FKSTtBQVN6QkMsRUFBQUEsVUFBVSxFQUFFO0FBQ1JDLElBQUFBLFNBQVMsRUFBRSxDQURIO0FBRVJDLElBQUFBLFVBQVUsRUFBRSxDQUZKO0FBR1JDLElBQUFBLGFBQWEsRUFBRSxDQUhQOztBQUtSOzs7Ozs7OztBQVFBQyxJQUFBQSxRQUFRLEVBQUU7QUFDTkMsTUFBQUEsT0FBTyxFQUFFQyxNQUFNLElBQUksa0RBRGI7QUFFTkMsTUFBQUEsR0FBRyxFQUFFLGVBQVk7QUFDYixlQUFPLEtBQUtOLFNBQVo7QUFDSCxPQUpLO0FBS05PLE1BQUFBLEdBQUcsRUFBRSxhQUFVQyxLQUFWLEVBQWlCO0FBQ2xCLGFBQUtSLFNBQUwsR0FBaUJRLEtBQWpCOztBQUNBLFlBQUksS0FBS0MsTUFBVCxFQUFpQjtBQUNiLGVBQUtBLE1BQUwsQ0FBWUMsU0FBWixDQUFzQkYsS0FBdEI7QUFDSDtBQUNKO0FBVkssS0FiRjs7QUEwQlI7Ozs7Ozs7O0FBUUFHLElBQUFBLFNBQVMsRUFBRTtBQUNQUCxNQUFBQSxPQUFPLEVBQUVDLE1BQU0sSUFBSSxtREFEWjtBQUVQQyxNQUFBQSxHQUFHLEVBQUUsZUFBWTtBQUNiLGVBQU8sS0FBS0wsVUFBWjtBQUNILE9BSk07QUFLUE0sTUFBQUEsR0FBRyxFQUFFLGFBQVVDLEtBQVYsRUFBaUI7QUFDbEIsYUFBS1AsVUFBTCxHQUFrQk8sS0FBbEI7O0FBQ0EsWUFBSSxLQUFLQyxNQUFULEVBQWlCO0FBQ2IsZUFBS0EsTUFBTCxDQUFZRyxZQUFaLENBQXlCSixLQUF6QjtBQUNIO0FBQ0o7QUFWTSxLQWxDSDs7QUErQ1I7Ozs7Ozs7QUFPQUssSUFBQUEsWUFBWSxFQUFFO0FBQ1ZULE1BQUFBLE9BQU8sRUFBRUMsTUFBTSxJQUFJLHNEQURUO0FBRVZDLE1BQUFBLEdBQUcsRUFBRSxlQUFZO0FBQ2IsZUFBTyxLQUFLSixhQUFaO0FBQ0gsT0FKUztBQUtWSyxNQUFBQSxHQUFHLEVBQUUsYUFBVUMsS0FBVixFQUFpQjtBQUNsQixhQUFLTixhQUFMLEdBQXFCTSxLQUFyQjs7QUFDQSxZQUFJLEtBQUtDLE1BQVQsRUFBaUI7QUFDYixlQUFLQSxNQUFMLENBQVlLLGVBQVosQ0FBNEJOLEtBQTVCO0FBQ0g7QUFDSjtBQVZTO0FBdEROLEdBVGE7QUE2RXpCTyxFQUFBQSxlQUFlLEVBQUUsMkJBQVk7QUFDekIsUUFBSUMsR0FBRyxHQUFHLElBQUlDLEVBQUUsQ0FBQ0MsZ0JBQVAsRUFBVjtBQUNBRixJQUFBQSxHQUFHLENBQUNHLFlBQUosR0FBbUIsSUFBSUYsRUFBRSxDQUFDRyxJQUFQLENBQVksS0FBS0MsTUFBTCxDQUFZQyxDQUFaLEdBQWNsQyxTQUExQixFQUFxQyxLQUFLaUMsTUFBTCxDQUFZRSxDQUFaLEdBQWNuQyxTQUFuRCxDQUFuQjtBQUNBNEIsSUFBQUEsR0FBRyxDQUFDUSxZQUFKLEdBQW1CLElBQUlQLEVBQUUsQ0FBQ0csSUFBUCxDQUFZLEtBQUtLLGVBQUwsQ0FBcUJILENBQXJCLEdBQXVCbEMsU0FBbkMsRUFBOEMsS0FBS3FDLGVBQUwsQ0FBcUJGLENBQXJCLEdBQXVCbkMsU0FBckUsQ0FBbkI7QUFDQTRCLElBQUFBLEdBQUcsQ0FBQ1UsTUFBSixHQUFhLEtBQUt2QixRQUFMLEdBQWNmLFNBQTNCO0FBQ0E0QixJQUFBQSxHQUFHLENBQUNILFlBQUosR0FBbUIsS0FBS0EsWUFBeEI7QUFDQUcsSUFBQUEsR0FBRyxDQUFDVyxXQUFKLEdBQWtCLEtBQUtoQixTQUF2QjtBQUVBLFdBQU9LLEdBQVA7QUFDSDtBQXRGd0IsQ0FBVCxDQUFwQjtBQXlGQXpCLEVBQUUsQ0FBQ0QsYUFBSCxHQUFtQnNDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnZDLGFBQXBDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG52YXIgUFRNX1JBVElPID0gcmVxdWlyZSgnLi4vQ0NQaHlzaWNzVHlwZXMnKS5QVE1fUkFUSU87XG5cbi8qKlxuICogISNlblxuICogQSBkaXN0YW5jZSBqb2ludCBjb25zdHJhaW5zIHR3byBwb2ludHMgb24gdHdvIGJvZGllc1xuICogdG8gcmVtYWluIGF0IGEgZml4ZWQgZGlzdGFuY2UgZnJvbSBlYWNoIG90aGVyLiBZb3UgY2FuIHZpZXdcbiAqIHRoaXMgYXMgYSBtYXNzbGVzcywgcmlnaWQgcm9kLlxuICogISN6aFxuICog6Led56a75YWz6IqC6YCa6L+H5LiA5Liq5Zu65a6a55qE6ZW/5bqm5p2l57qm5p2f5YWz6IqC6ZO+5o6l55qE5Lik5Liq5Yia5L2T44CC5L2g5Y+v5Lul5bCG5a6D5oOz6LGh5oiQ5LiA5Liq5peg6LSo6YeP77yM5Z2a5Zu655qE5pyo5qON44CCXG4gKiBAY2xhc3MgRGlzdGFuY2VKb2ludFxuICogQGV4dGVuZHMgSm9pbnRcbiAqL1xudmFyIERpc3RhbmNlSm9pbnQgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLkRpc3RhbmNlSm9pbnQnLFxuICAgIGV4dGVuZHM6IGNjLkpvaW50LFxuICAgIFxuICAgIGVkaXRvcjogQ0NfRURJVE9SICYmIHtcbiAgICAgICAgbWVudTogJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC5waHlzaWNzL0pvaW50L0Rpc3RhbmNlJyxcbiAgICAgICAgaW5zcGVjdG9yOiAncGFja2FnZXM6Ly9pbnNwZWN0b3IvaW5zcGVjdG9ycy9jb21wcy9waHlzaWNzL2pvaW50LmpzJyxcbiAgICB9LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBfZGlzdGFuY2U6IDEsXG4gICAgICAgIF9mcmVxdWVuY3k6IDAsXG4gICAgICAgIF9kYW1waW5nUmF0aW86IDAsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIGRpc3RhbmNlIHNlcGFyYXRpbmcgdGhlIHR3byBlbmRzIG9mIHRoZSBqb2ludC5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDlhbPoioLkuKTnq6/nmoTot53nprtcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGRpc3RhbmNlXG4gICAgICAgICAqIEBkZWZhdWx0IDFcbiAgICAgICAgICovXG4gICAgICAgIGRpc3RhbmNlOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBoeXNpY3MucGh5c2ljc19jb2xsaWRlci5kaXN0YW5jZScsICAgICAgICAgICAgXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZGlzdGFuY2U7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kaXN0YW5jZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9qb2ludCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9qb2ludC5TZXRMZW5ndGgodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgc3ByaW5nIGZyZXF1ZW5jeS5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDlvLnmgKfns7vmlbDjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGZyZXF1ZW5jeVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICBmcmVxdWVuY3k6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGh5c2ljcy5waHlzaWNzX2NvbGxpZGVyLmZyZXF1ZW5jeScsXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZnJlcXVlbmN5O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZnJlcXVlbmN5ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2pvaW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2pvaW50LlNldEZyZXF1ZW5jeSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBkYW1waW5nIHJhdGlvLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOmYu+WwvO+8jOihqOekuuWFs+iKguWPmOW9ouWQju+8jOaBouWkjeWIsOWIneWni+eKtuaAgeWPl+WIsOeahOmYu+WKm+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gZGFtcGluZ1JhdGlvXG4gICAgICAgICAqL1xuICAgICAgICBkYW1waW5nUmF0aW86IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGh5c2ljcy5waHlzaWNzX2NvbGxpZGVyLmRhbXBpbmdSYXRpbycsICAgICAgICAgICAgXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZGFtcGluZ1JhdGlvO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGFtcGluZ1JhdGlvID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2pvaW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2pvaW50LlNldERhbXBpbmdSYXRpbyh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9jcmVhdGVKb2ludERlZjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGVmID0gbmV3IGIyLkRpc3RhbmNlSm9pbnREZWYoKTtcbiAgICAgICAgZGVmLmxvY2FsQW5jaG9yQSA9IG5ldyBiMi5WZWMyKHRoaXMuYW5jaG9yLngvUFRNX1JBVElPLCB0aGlzLmFuY2hvci55L1BUTV9SQVRJTyk7XG4gICAgICAgIGRlZi5sb2NhbEFuY2hvckIgPSBuZXcgYjIuVmVjMih0aGlzLmNvbm5lY3RlZEFuY2hvci54L1BUTV9SQVRJTywgdGhpcy5jb25uZWN0ZWRBbmNob3IueS9QVE1fUkFUSU8pO1xuICAgICAgICBkZWYubGVuZ3RoID0gdGhpcy5kaXN0YW5jZS9QVE1fUkFUSU87XG4gICAgICAgIGRlZi5kYW1waW5nUmF0aW8gPSB0aGlzLmRhbXBpbmdSYXRpbztcbiAgICAgICAgZGVmLmZyZXF1ZW5jeUh6ID0gdGhpcy5mcmVxdWVuY3k7XG5cbiAgICAgICAgcmV0dXJuIGRlZjtcbiAgICB9XG59KTtcblxuY2MuRGlzdGFuY2VKb2ludCA9IG1vZHVsZS5leHBvcnRzID0gRGlzdGFuY2VKb2ludDtcbiJdfQ==