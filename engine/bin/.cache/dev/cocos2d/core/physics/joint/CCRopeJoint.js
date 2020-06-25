
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/physics/joint/CCRopeJoint.js';
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
 * A rope joint enforces a maximum distance between two points
 * on two bodies. It has no other effect.
 * Warning: if you attempt to change the maximum length during
 * the simulation you will get some non-physical behavior.
 * !#zh
 * 绳子关节只指定两个刚体间的最大距离，没有其他的效果。
 * 注意：如果你试图动态修改关节的长度，这有可能会得到一些意外的效果。
 * @class RopeJoint
 * @extends Joint
 */


var RopeJoint = cc.Class({
  name: 'cc.RopeJoint',
  "extends": cc.Joint,
  editor: CC_EDITOR && {
    inspector: 'packages://inspector/inspectors/comps/physics/joint.js',
    menu: 'i18n:MAIN_MENU.component.physics/Joint/Rope'
  },
  properties: {
    _maxLength: 1,

    /**
     * !#en
     * The max length.
     * !#zh
     * 最大长度。
     * @property {Number} maxLength
     * @default 1
     */
    maxLength: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.maxLength',
      get: function get() {
        return this._maxLength;
      },
      set: function set(value) {
        this._maxLength = value;

        if (this._joint) {
          this._joint.SetMaxLength(value);
        }
      }
    }
  },
  _createJointDef: function _createJointDef() {
    var def = new b2.RopeJointDef();
    def.localAnchorA = new b2.Vec2(this.anchor.x / PTM_RATIO, this.anchor.y / PTM_RATIO);
    def.localAnchorB = new b2.Vec2(this.connectedAnchor.x / PTM_RATIO, this.connectedAnchor.y / PTM_RATIO);
    def.maxLength = this.maxLength / PTM_RATIO;
    return def;
  }
});
cc.RopeJoint = module.exports = RopeJoint;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDUm9wZUpvaW50LmpzIl0sIm5hbWVzIjpbIlBUTV9SQVRJTyIsInJlcXVpcmUiLCJSb3BlSm9pbnQiLCJjYyIsIkNsYXNzIiwibmFtZSIsIkpvaW50IiwiZWRpdG9yIiwiQ0NfRURJVE9SIiwiaW5zcGVjdG9yIiwibWVudSIsInByb3BlcnRpZXMiLCJfbWF4TGVuZ3RoIiwibWF4TGVuZ3RoIiwidG9vbHRpcCIsIkNDX0RFViIsImdldCIsInNldCIsInZhbHVlIiwiX2pvaW50IiwiU2V0TWF4TGVuZ3RoIiwiX2NyZWF0ZUpvaW50RGVmIiwiZGVmIiwiYjIiLCJSb3BlSm9pbnREZWYiLCJsb2NhbEFuY2hvckEiLCJWZWMyIiwiYW5jaG9yIiwieCIsInkiLCJsb2NhbEFuY2hvckIiLCJjb25uZWN0ZWRBbmNob3IiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkEsSUFBSUEsU0FBUyxHQUFHQyxPQUFPLENBQUMsbUJBQUQsQ0FBUCxDQUE2QkQsU0FBN0M7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUFZQSxJQUFJRSxTQUFTLEdBQUdDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ3JCQyxFQUFBQSxJQUFJLEVBQUUsY0FEZTtBQUVyQixhQUFTRixFQUFFLENBQUNHLEtBRlM7QUFJckJDLEVBQUFBLE1BQU0sRUFBRUMsU0FBUyxJQUFJO0FBQ2pCQyxJQUFBQSxTQUFTLEVBQUUsd0RBRE07QUFFakJDLElBQUFBLElBQUksRUFBRTtBQUZXLEdBSkE7QUFTckJDLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxVQUFVLEVBQUUsQ0FESjs7QUFHUjs7Ozs7Ozs7QUFRQUMsSUFBQUEsU0FBUyxFQUFFO0FBQ1BDLE1BQUFBLE9BQU8sRUFBRUMsTUFBTSxJQUFJLG1EQURaO0FBRVBDLE1BQUFBLEdBQUcsRUFBRSxlQUFZO0FBQ2IsZUFBTyxLQUFLSixVQUFaO0FBQ0gsT0FKTTtBQUtQSyxNQUFBQSxHQUFHLEVBQUUsYUFBVUMsS0FBVixFQUFpQjtBQUNsQixhQUFLTixVQUFMLEdBQWtCTSxLQUFsQjs7QUFDQSxZQUFJLEtBQUtDLE1BQVQsRUFBaUI7QUFDYixlQUFLQSxNQUFMLENBQVlDLFlBQVosQ0FBeUJGLEtBQXpCO0FBQ0g7QUFDSjtBQVZNO0FBWEgsR0FUUztBQW1DckJHLEVBQUFBLGVBQWUsRUFBRSwyQkFBWTtBQUN6QixRQUFJQyxHQUFHLEdBQUcsSUFBSUMsRUFBRSxDQUFDQyxZQUFQLEVBQVY7QUFDQUYsSUFBQUEsR0FBRyxDQUFDRyxZQUFKLEdBQW1CLElBQUlGLEVBQUUsQ0FBQ0csSUFBUCxDQUFZLEtBQUtDLE1BQUwsQ0FBWUMsQ0FBWixHQUFjNUIsU0FBMUIsRUFBcUMsS0FBSzJCLE1BQUwsQ0FBWUUsQ0FBWixHQUFjN0IsU0FBbkQsQ0FBbkI7QUFDQXNCLElBQUFBLEdBQUcsQ0FBQ1EsWUFBSixHQUFtQixJQUFJUCxFQUFFLENBQUNHLElBQVAsQ0FBWSxLQUFLSyxlQUFMLENBQXFCSCxDQUFyQixHQUF1QjVCLFNBQW5DLEVBQThDLEtBQUsrQixlQUFMLENBQXFCRixDQUFyQixHQUF1QjdCLFNBQXJFLENBQW5CO0FBQ0FzQixJQUFBQSxHQUFHLENBQUNULFNBQUosR0FBZ0IsS0FBS0EsU0FBTCxHQUFlYixTQUEvQjtBQUVBLFdBQU9zQixHQUFQO0FBQ0g7QUExQ29CLENBQVQsQ0FBaEI7QUE2Q0FuQixFQUFFLENBQUNELFNBQUgsR0FBZThCLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQi9CLFNBQWhDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG52YXIgUFRNX1JBVElPID0gcmVxdWlyZSgnLi4vQ0NQaHlzaWNzVHlwZXMnKS5QVE1fUkFUSU87XG5cbi8qKlxuICogISNlblxuICogQSByb3BlIGpvaW50IGVuZm9yY2VzIGEgbWF4aW11bSBkaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHNcbiAqIG9uIHR3byBib2RpZXMuIEl0IGhhcyBubyBvdGhlciBlZmZlY3QuXG4gKiBXYXJuaW5nOiBpZiB5b3UgYXR0ZW1wdCB0byBjaGFuZ2UgdGhlIG1heGltdW0gbGVuZ3RoIGR1cmluZ1xuICogdGhlIHNpbXVsYXRpb24geW91IHdpbGwgZ2V0IHNvbWUgbm9uLXBoeXNpY2FsIGJlaGF2aW9yLlxuICogISN6aFxuICog57uz5a2Q5YWz6IqC5Y+q5oyH5a6a5Lik5Liq5Yia5L2T6Ze055qE5pyA5aSn6Led56a777yM5rKh5pyJ5YW25LuW55qE5pWI5p6c44CCXG4gKiDms6jmhI/vvJrlpoLmnpzkvaDor5Xlm77liqjmgIHkv67mlLnlhbPoioLnmoTplb/luqbvvIzov5nmnInlj6/og73kvJrlvpfliLDkuIDkupvmhI/lpJbnmoTmlYjmnpzjgIJcbiAqIEBjbGFzcyBSb3BlSm9pbnRcbiAqIEBleHRlbmRzIEpvaW50XG4gKi9cbnZhciBSb3BlSm9pbnQgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlJvcGVKb2ludCcsXG4gICAgZXh0ZW5kczogY2MuSm9pbnQsXG4gICAgXG4gICAgZWRpdG9yOiBDQ19FRElUT1IgJiYge1xuICAgICAgICBpbnNwZWN0b3I6ICdwYWNrYWdlczovL2luc3BlY3Rvci9pbnNwZWN0b3JzL2NvbXBzL3BoeXNpY3Mvam9pbnQuanMnLFxuICAgICAgICBtZW51OiAnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50LnBoeXNpY3MvSm9pbnQvUm9wZScsXG4gICAgfSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgX21heExlbmd0aDogMSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgbWF4IGxlbmd0aC5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDmnIDlpKfplb/luqbjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IG1heExlbmd0aFxuICAgICAgICAgKiBAZGVmYXVsdCAxXG4gICAgICAgICAqL1xuICAgICAgICBtYXhMZW5ndGg6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGh5c2ljcy5waHlzaWNzX2NvbGxpZGVyLm1heExlbmd0aCcsXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbWF4TGVuZ3RoO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWF4TGVuZ3RoID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2pvaW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2pvaW50LlNldE1heExlbmd0aCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgfSxcblxuICAgIF9jcmVhdGVKb2ludERlZjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGVmID0gbmV3IGIyLlJvcGVKb2ludERlZigpO1xuICAgICAgICBkZWYubG9jYWxBbmNob3JBID0gbmV3IGIyLlZlYzIodGhpcy5hbmNob3IueC9QVE1fUkFUSU8sIHRoaXMuYW5jaG9yLnkvUFRNX1JBVElPKTtcbiAgICAgICAgZGVmLmxvY2FsQW5jaG9yQiA9IG5ldyBiMi5WZWMyKHRoaXMuY29ubmVjdGVkQW5jaG9yLngvUFRNX1JBVElPLCB0aGlzLmNvbm5lY3RlZEFuY2hvci55L1BUTV9SQVRJTyk7XG4gICAgICAgIGRlZi5tYXhMZW5ndGggPSB0aGlzLm1heExlbmd0aC9QVE1fUkFUSU87XG5cbiAgICAgICAgcmV0dXJuIGRlZjtcbiAgICB9XG59KTtcblxuY2MuUm9wZUpvaW50ID0gbW9kdWxlLmV4cG9ydHMgPSBSb3BlSm9pbnQ7XG4iXX0=