
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/physics/CCPhysicsTypes.js';
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
var ContactType = {
  BEGIN_CONTACT: 'begin-contact',
  END_CONTACT: 'end-contact',
  PRE_SOLVE: 'pre-solve',
  POST_SOLVE: 'post-solve'
};
/**
 * !#en Enum for RigidBodyType.
 * !#zh 刚体类型
 * @enum RigidBodyType
 */

var BodyType = cc.Enum({
  /**
   * !#en 
   * zero mass, zero velocity, may be manually moved.
   * !#zh 
   * 零质量，零速度，可以手动移动。
   * @property {Number} Static
   */
  Static: 0,

  /**
   * !#en 
   * zero mass, non-zero velocity set by user.
   * !#zh 
   * 零质量，可以被设置速度。
   * @property {Number} Kinematic
   */
  Kinematic: 1,

  /**
   * !#en 
   * positive mass, non-zero velocity determined by forces.
   * !#zh 
   * 有质量，可以设置速度，力等。
   * @property {Number} Dynamic
   */
  Dynamic: 2,

  /**
   * !#en 
   * An extension of Kinematic type, can be animated by Animation.
   * !#zh
   * Kinematic 类型的扩展，可以被动画控制动画效果。
   * @property {Number} Animated
   */
  Animated: 3
});
cc.RigidBodyType = BodyType;
/**
 * !#en Enum for RayCastType.
 * !#zh 射线检测类型
 * @enum RayCastType
 */

var RayCastType = cc.Enum({
  /**
   * !#en 
   * Detects closest collider on the raycast path.
   * !#zh 
   * 检测射线路径上最近的碰撞体
   * @property {Number} Closest
   */
  Closest: 0,

  /**
   * !#en 
   * Detects any collider on the raycast path.
   * Once detects a collider, will stop the searching process.
   * !#zh 
   * 检测射线路径上任意的碰撞体。
   * 一旦检测到任何碰撞体，将立刻结束检测其他的碰撞体。
   * @property {Number} Any
   */
  Any: 1,

  /**
   * !#en 
   * Detects all colliders on the raycast path.
   * One collider may return several collision points(because one collider may have several fixtures, 
   * one fixture will return one point, the point may inside collider), AllClosest will return the closest one.
   * !#zh 
   * 检测射线路径上所有的碰撞体。
   * 同一个碰撞体上有可能会返回多个碰撞点(因为一个碰撞体可能由多个夹具组成，每一个夹具会返回一个碰撞点，碰撞点有可能在碰撞体内部)，AllClosest 删选同一个碰撞体上最近的哪一个碰撞点。
   * @property {Number} AllClosest
   */
  AllClosest: 2,

  /**
   * !#en 
   * Detects all colliders on the raycast path.
   * One collider may return several collision points, All will return all these points.
   * !#zh 
   * 检测射线路径上所有的碰撞体。
   * 同一个碰撞体上有可能会返回多个碰撞点，All 将返回所有这些碰撞点。
   * @property {Number} All
   */
  All: 3
});
cc.RayCastType = RayCastType;
module.exports = {
  BodyType: BodyType,
  ContactType: ContactType,
  RayCastType: RayCastType,
  DrawBits: b2.DrawFlags,
  PTM_RATIO: 32,
  ANGLE_TO_PHYSICS_ANGLE: -Math.PI / 180,
  PHYSICS_ANGLE_TO_ANGLE: -180 / Math.PI
};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDUGh5c2ljc1R5cGVzLmpzIl0sIm5hbWVzIjpbIkNvbnRhY3RUeXBlIiwiQkVHSU5fQ09OVEFDVCIsIkVORF9DT05UQUNUIiwiUFJFX1NPTFZFIiwiUE9TVF9TT0xWRSIsIkJvZHlUeXBlIiwiY2MiLCJFbnVtIiwiU3RhdGljIiwiS2luZW1hdGljIiwiRHluYW1pYyIsIkFuaW1hdGVkIiwiUmlnaWRCb2R5VHlwZSIsIlJheUNhc3RUeXBlIiwiQ2xvc2VzdCIsIkFueSIsIkFsbENsb3Nlc3QiLCJBbGwiLCJtb2R1bGUiLCJleHBvcnRzIiwiRHJhd0JpdHMiLCJiMiIsIkRyYXdGbGFncyIsIlBUTV9SQVRJTyIsIkFOR0xFX1RPX1BIWVNJQ1NfQU5HTEUiLCJNYXRoIiwiUEkiLCJQSFlTSUNTX0FOR0xFX1RPX0FOR0xFIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFJQSxXQUFXLEdBQUc7QUFDZEMsRUFBQUEsYUFBYSxFQUFFLGVBREQ7QUFFZEMsRUFBQUEsV0FBVyxFQUFFLGFBRkM7QUFHZEMsRUFBQUEsU0FBUyxFQUFFLFdBSEc7QUFJZEMsRUFBQUEsVUFBVSxFQUFFO0FBSkUsQ0FBbEI7QUFPQTs7Ozs7O0FBS0EsSUFBSUMsUUFBUSxHQUFHQyxFQUFFLENBQUNDLElBQUgsQ0FBUTtBQUNuQjs7Ozs7OztBQU9BQyxFQUFBQSxNQUFNLEVBQUUsQ0FSVzs7QUFTbkI7Ozs7Ozs7QUFPQUMsRUFBQUEsU0FBUyxFQUFFLENBaEJROztBQWlCbkI7Ozs7Ozs7QUFPQUMsRUFBQUEsT0FBTyxFQUFFLENBeEJVOztBQXlCbkI7Ozs7Ozs7QUFPQUMsRUFBQUEsUUFBUSxFQUFFO0FBaENTLENBQVIsQ0FBZjtBQWtDQUwsRUFBRSxDQUFDTSxhQUFILEdBQW1CUCxRQUFuQjtBQUVBOzs7Ozs7QUFLQSxJQUFJUSxXQUFXLEdBQUdQLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRO0FBQ3RCOzs7Ozs7O0FBT0FPLEVBQUFBLE9BQU8sRUFBRSxDQVJhOztBQVN0Qjs7Ozs7Ozs7O0FBU0FDLEVBQUFBLEdBQUcsRUFBRSxDQWxCaUI7O0FBbUJ0Qjs7Ozs7Ozs7OztBQVVBQyxFQUFBQSxVQUFVLEVBQUUsQ0E3QlU7O0FBK0J0Qjs7Ozs7Ozs7O0FBU0FDLEVBQUFBLEdBQUcsRUFBRTtBQXhDaUIsQ0FBUixDQUFsQjtBQTBDQVgsRUFBRSxDQUFDTyxXQUFILEdBQWlCQSxXQUFqQjtBQUVBSyxNQUFNLENBQUNDLE9BQVAsR0FBaUI7QUFDYmQsRUFBQUEsUUFBUSxFQUFFQSxRQURHO0FBRWJMLEVBQUFBLFdBQVcsRUFBRUEsV0FGQTtBQUdiYSxFQUFBQSxXQUFXLEVBQUVBLFdBSEE7QUFLYk8sRUFBQUEsUUFBUSxFQUFFQyxFQUFFLENBQUNDLFNBTEE7QUFPYkMsRUFBQUEsU0FBUyxFQUFFLEVBUEU7QUFRYkMsRUFBQUEsc0JBQXNCLEVBQUUsQ0FBQ0MsSUFBSSxDQUFDQyxFQUFOLEdBQVcsR0FSdEI7QUFTYkMsRUFBQUEsc0JBQXNCLEVBQUUsQ0FBQyxHQUFELEdBQU9GLElBQUksQ0FBQ0M7QUFUdkIsQ0FBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbnZhciBDb250YWN0VHlwZSA9IHtcbiAgICBCRUdJTl9DT05UQUNUOiAnYmVnaW4tY29udGFjdCcsXG4gICAgRU5EX0NPTlRBQ1Q6ICdlbmQtY29udGFjdCcsXG4gICAgUFJFX1NPTFZFOiAncHJlLXNvbHZlJyxcbiAgICBQT1NUX1NPTFZFOiAncG9zdC1zb2x2ZSdcbn07XG5cbi8qKlxuICogISNlbiBFbnVtIGZvciBSaWdpZEJvZHlUeXBlLlxuICogISN6aCDliJrkvZPnsbvlnotcbiAqIEBlbnVtIFJpZ2lkQm9keVR5cGVcbiAqL1xudmFyIEJvZHlUeXBlID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogISNlbiBcbiAgICAgKiB6ZXJvIG1hc3MsIHplcm8gdmVsb2NpdHksIG1heSBiZSBtYW51YWxseSBtb3ZlZC5cbiAgICAgKiAhI3poIFxuICAgICAqIOmbtui0qOmHj++8jOmbtumAn+W6pu+8jOWPr+S7peaJi+WKqOenu+WKqOOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBTdGF0aWNcbiAgICAgKi9cbiAgICBTdGF0aWM6IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBcbiAgICAgKiB6ZXJvIG1hc3MsIG5vbi16ZXJvIHZlbG9jaXR5IHNldCBieSB1c2VyLlxuICAgICAqICEjemggXG4gICAgICog6Zu26LSo6YeP77yM5Y+v5Lul6KKr6K6+572u6YCf5bqm44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEtpbmVtYXRpY1xuICAgICAqL1xuICAgIEtpbmVtYXRpYzogMSxcbiAgICAvKipcbiAgICAgKiAhI2VuIFxuICAgICAqIHBvc2l0aXZlIG1hc3MsIG5vbi16ZXJvIHZlbG9jaXR5IGRldGVybWluZWQgYnkgZm9yY2VzLlxuICAgICAqICEjemggXG4gICAgICog5pyJ6LSo6YeP77yM5Y+v5Lul6K6+572u6YCf5bqm77yM5Yqb562J44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IER5bmFtaWNcbiAgICAgKi9cbiAgICBEeW5hbWljOiAyLFxuICAgIC8qKlxuICAgICAqICEjZW4gXG4gICAgICogQW4gZXh0ZW5zaW9uIG9mIEtpbmVtYXRpYyB0eXBlLCBjYW4gYmUgYW5pbWF0ZWQgYnkgQW5pbWF0aW9uLlxuICAgICAqICEjemhcbiAgICAgKiBLaW5lbWF0aWMg57G75Z6L55qE5omp5bGV77yM5Y+v5Lul6KKr5Yqo55S75o6n5Yi25Yqo55S75pWI5p6c44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEFuaW1hdGVkXG4gICAgICovXG4gICAgQW5pbWF0ZWQ6IDNcbn0pO1xuY2MuUmlnaWRCb2R5VHlwZSA9IEJvZHlUeXBlO1xuXG4vKipcbiAqICEjZW4gRW51bSBmb3IgUmF5Q2FzdFR5cGUuXG4gKiAhI3poIOWwhOe6v+ajgOa1i+exu+Wei1xuICogQGVudW0gUmF5Q2FzdFR5cGVcbiAqL1xudmFyIFJheUNhc3RUeXBlID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogISNlbiBcbiAgICAgKiBEZXRlY3RzIGNsb3Nlc3QgY29sbGlkZXIgb24gdGhlIHJheWNhc3QgcGF0aC5cbiAgICAgKiAhI3poIFxuICAgICAqIOajgOa1i+WwhOe6v+i3r+W+hOS4iuacgOi/keeahOeisOaSnuS9k1xuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBDbG9zZXN0XG4gICAgICovXG4gICAgQ2xvc2VzdDogMCxcbiAgICAvKipcbiAgICAgKiAhI2VuIFxuICAgICAqIERldGVjdHMgYW55IGNvbGxpZGVyIG9uIHRoZSByYXljYXN0IHBhdGguXG4gICAgICogT25jZSBkZXRlY3RzIGEgY29sbGlkZXIsIHdpbGwgc3RvcCB0aGUgc2VhcmNoaW5nIHByb2Nlc3MuXG4gICAgICogISN6aCBcbiAgICAgKiDmo4DmtYvlsITnur/ot6/lvoTkuIrku7vmhI/nmoTnorDmkp7kvZPjgIJcbiAgICAgKiDkuIDml6bmo4DmtYvliLDku7vkvZXnorDmkp7kvZPvvIzlsIbnq4vliLvnu5PmnZ/mo4DmtYvlhbbku5bnmoTnorDmkp7kvZPjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gQW55XG4gICAgICovXG4gICAgQW55OiAxLFxuICAgIC8qKlxuICAgICAqICEjZW4gXG4gICAgICogRGV0ZWN0cyBhbGwgY29sbGlkZXJzIG9uIHRoZSByYXljYXN0IHBhdGguXG4gICAgICogT25lIGNvbGxpZGVyIG1heSByZXR1cm4gc2V2ZXJhbCBjb2xsaXNpb24gcG9pbnRzKGJlY2F1c2Ugb25lIGNvbGxpZGVyIG1heSBoYXZlIHNldmVyYWwgZml4dHVyZXMsIFxuICAgICAqIG9uZSBmaXh0dXJlIHdpbGwgcmV0dXJuIG9uZSBwb2ludCwgdGhlIHBvaW50IG1heSBpbnNpZGUgY29sbGlkZXIpLCBBbGxDbG9zZXN0IHdpbGwgcmV0dXJuIHRoZSBjbG9zZXN0IG9uZS5cbiAgICAgKiAhI3poIFxuICAgICAqIOajgOa1i+WwhOe6v+i3r+W+hOS4iuaJgOacieeahOeisOaSnuS9k+OAglxuICAgICAqIOWQjOS4gOS4queisOaSnuS9k+S4iuacieWPr+iDveS8mui/lOWbnuWkmuS4queisOaSnueCuSjlm6DkuLrkuIDkuKrnorDmkp7kvZPlj6/og73nlLHlpJrkuKrlpLnlhbfnu4TmiJDvvIzmr4/kuIDkuKrlpLnlhbfkvJrov5Tlm57kuIDkuKrnorDmkp7ngrnvvIznorDmkp7ngrnmnInlj6/og73lnKjnorDmkp7kvZPlhoXpg6gp77yMQWxsQ2xvc2VzdCDliKDpgInlkIzkuIDkuKrnorDmkp7kvZPkuIrmnIDov5HnmoTlk6rkuIDkuKrnorDmkp7ngrnjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gQWxsQ2xvc2VzdFxuICAgICAqL1xuICAgIEFsbENsb3Nlc3Q6IDIsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFxuICAgICAqIERldGVjdHMgYWxsIGNvbGxpZGVycyBvbiB0aGUgcmF5Y2FzdCBwYXRoLlxuICAgICAqIE9uZSBjb2xsaWRlciBtYXkgcmV0dXJuIHNldmVyYWwgY29sbGlzaW9uIHBvaW50cywgQWxsIHdpbGwgcmV0dXJuIGFsbCB0aGVzZSBwb2ludHMuXG4gICAgICogISN6aCBcbiAgICAgKiDmo4DmtYvlsITnur/ot6/lvoTkuIrmiYDmnInnmoTnorDmkp7kvZPjgIJcbiAgICAgKiDlkIzkuIDkuKrnorDmkp7kvZPkuIrmnInlj6/og73kvJrov5Tlm57lpJrkuKrnorDmkp7ngrnvvIxBbGwg5bCG6L+U5Zue5omA5pyJ6L+Z5Lqb56Kw5pKe54K544CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEFsbFxuICAgICAqL1xuICAgIEFsbDogM1xufSk7XG5jYy5SYXlDYXN0VHlwZSA9IFJheUNhc3RUeXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBCb2R5VHlwZTogQm9keVR5cGUsXG4gICAgQ29udGFjdFR5cGU6IENvbnRhY3RUeXBlLFxuICAgIFJheUNhc3RUeXBlOiBSYXlDYXN0VHlwZSxcbiAgICBcbiAgICBEcmF3Qml0czogYjIuRHJhd0ZsYWdzLFxuXG4gICAgUFRNX1JBVElPOiAzMixcbiAgICBBTkdMRV9UT19QSFlTSUNTX0FOR0xFOiAtTWF0aC5QSSAvIDE4MCxcbiAgICBQSFlTSUNTX0FOR0xFX1RPX0FOR0xFOiAtMTgwIC8gTWF0aC5QSSxcbn07XG4iXX0=