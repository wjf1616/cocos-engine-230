
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/animation/types.js';
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
var WrapModeMask = {
  Loop: 1 << 1,
  ShouldWrap: 1 << 2,
  // Reserved: 1 << 3,
  PingPong: 1 << 4 | 1 << 1 | 1 << 2,
  // Loop, ShouldWrap
  Reverse: 1 << 5 | 1 << 2 // ShouldWrap

};
/**
 * !#en Specifies how time is treated when it is outside of the keyframe range of an Animation.
 * !#zh 动画使用的循环模式。
 * @enum WrapMode
 * @memberof cc
 */

var WrapMode = cc.Enum({
  /**
   * !#en Reads the default wrap mode set higher up.
   * !#zh 向 Animation Component 或者 AnimationClip 查找 wrapMode
   * @property {Number} Default
   */
  Default: 0,

  /**
   * !#en All iterations are played as specified.
   * !#zh 动画只播放一遍
   * @property {Number} Normal
   */
  Normal: 1,

  /**
   * !#en All iterations are played in the reverse direction from the way they are specified.
   * !#zh 从最后一帧或结束位置开始反向播放，到第一帧或开始位置停止
   * @property {Number} Reverse
   */
  Reverse: WrapModeMask.Reverse,

  /**
   * !#en When time reaches the end of the animation, time will continue at the beginning.
   * !#zh 循环播放
   * @property {Number} Loop
   */
  Loop: WrapModeMask.Loop,

  /**
   * !#en All iterations are played in the reverse direction from the way they are specified.
   * And when time reaches the start of the animation, time will continue at the ending.
   * !#zh 反向循环播放
   * @property {Number} LoopReverse
   */
  LoopReverse: WrapModeMask.Loop | WrapModeMask.Reverse,

  /**
   * !#en Even iterations are played as specified, odd iterations are played in the reverse direction from the way they
   * are specified.
   * !#zh 从第一帧播放到最后一帧，然后反向播放回第一帧，到第一帧后再正向播放，如此循环
   * @property {Number} PingPong
   */
  PingPong: WrapModeMask.PingPong,

  /**
   * !#en Even iterations are played in the reverse direction from the way they are specified, odd iterations are played
   * as specified.
   * !#zh 从最后一帧开始反向播放，其他同 PingPong
   * @property {Number} PingPongReverse
   */
  PingPongReverse: WrapModeMask.PingPong | WrapModeMask.Reverse
});
cc.WrapMode = WrapMode; // For internal

function WrappedInfo(info) {
  if (info) {
    this.set(info);
    return;
  }

  this.ratio = 0;
  this.time = 0;
  this.direction = 1;
  this.stopped = true;
  this.iterations = 0;
  this.frameIndex = undefined;
}

WrappedInfo.prototype.set = function (info) {
  this.ratio = info.ratio;
  this.time = info.time;
  this.direction = info.direction;
  this.stopped = info.stopped;
  this.iterations = info.iterations;
  this.frameIndex = info.frameIndex;
};

module.exports = {
  WrapModeMask: WrapModeMask,
  WrapMode: WrapMode,
  WrappedInfo: WrappedInfo
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInR5cGVzLmpzIl0sIm5hbWVzIjpbIldyYXBNb2RlTWFzayIsIkxvb3AiLCJTaG91bGRXcmFwIiwiUGluZ1BvbmciLCJSZXZlcnNlIiwiV3JhcE1vZGUiLCJjYyIsIkVudW0iLCJEZWZhdWx0IiwiTm9ybWFsIiwiTG9vcFJldmVyc2UiLCJQaW5nUG9uZ1JldmVyc2UiLCJXcmFwcGVkSW5mbyIsImluZm8iLCJzZXQiLCJyYXRpbyIsInRpbWUiLCJkaXJlY3Rpb24iLCJzdG9wcGVkIiwiaXRlcmF0aW9ucyIsImZyYW1lSW5kZXgiLCJ1bmRlZmluZWQiLCJwcm90b3R5cGUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxJQUFJQSxZQUFZLEdBQUc7QUFDZkMsRUFBQUEsSUFBSSxFQUFFLEtBQUssQ0FESTtBQUVmQyxFQUFBQSxVQUFVLEVBQUUsS0FBSyxDQUZGO0FBR2Y7QUFDQUMsRUFBQUEsUUFBUSxFQUFFLEtBQUssQ0FBTCxHQUFTLEtBQUssQ0FBZCxHQUFrQixLQUFLLENBSmxCO0FBSXNCO0FBQ3JDQyxFQUFBQSxPQUFPLEVBQUUsS0FBSyxDQUFMLEdBQVMsS0FBSyxDQUxSLENBS2dCOztBQUxoQixDQUFuQjtBQVFBOzs7Ozs7O0FBTUEsSUFBSUMsUUFBUSxHQUFHQyxFQUFFLENBQUNDLElBQUgsQ0FBUTtBQUVuQjs7Ozs7QUFLQUMsRUFBQUEsT0FBTyxFQUFFLENBUFU7O0FBU25COzs7OztBQUtBQyxFQUFBQSxNQUFNLEVBQUUsQ0FkVzs7QUFnQm5COzs7OztBQUtBTCxFQUFBQSxPQUFPLEVBQUVKLFlBQVksQ0FBQ0ksT0FyQkg7O0FBdUJuQjs7Ozs7QUFLQUgsRUFBQUEsSUFBSSxFQUFFRCxZQUFZLENBQUNDLElBNUJBOztBQThCbkI7Ozs7OztBQU1BUyxFQUFBQSxXQUFXLEVBQUVWLFlBQVksQ0FBQ0MsSUFBYixHQUFvQkQsWUFBWSxDQUFDSSxPQXBDM0I7O0FBc0NuQjs7Ozs7O0FBTUFELEVBQUFBLFFBQVEsRUFBRUgsWUFBWSxDQUFDRyxRQTVDSjs7QUE4Q25COzs7Ozs7QUFNQVEsRUFBQUEsZUFBZSxFQUFFWCxZQUFZLENBQUNHLFFBQWIsR0FBd0JILFlBQVksQ0FBQ0k7QUFwRG5DLENBQVIsQ0FBZjtBQXVEQUUsRUFBRSxDQUFDRCxRQUFILEdBQWNBLFFBQWQsRUFFQTs7QUFDQSxTQUFTTyxXQUFULENBQXNCQyxJQUF0QixFQUE0QjtBQUN4QixNQUFJQSxJQUFKLEVBQVU7QUFDTixTQUFLQyxHQUFMLENBQVNELElBQVQ7QUFDQTtBQUNIOztBQUVELE9BQUtFLEtBQUwsR0FBYSxDQUFiO0FBQ0EsT0FBS0MsSUFBTCxHQUFZLENBQVo7QUFDQSxPQUFLQyxTQUFMLEdBQWlCLENBQWpCO0FBQ0EsT0FBS0MsT0FBTCxHQUFlLElBQWY7QUFDQSxPQUFLQyxVQUFMLEdBQWtCLENBQWxCO0FBQ0EsT0FBS0MsVUFBTCxHQUFrQkMsU0FBbEI7QUFDSDs7QUFFRFQsV0FBVyxDQUFDVSxTQUFaLENBQXNCUixHQUF0QixHQUE0QixVQUFVRCxJQUFWLEVBQWdCO0FBQ3hDLE9BQUtFLEtBQUwsR0FBYUYsSUFBSSxDQUFDRSxLQUFsQjtBQUNBLE9BQUtDLElBQUwsR0FBWUgsSUFBSSxDQUFDRyxJQUFqQjtBQUNBLE9BQUtDLFNBQUwsR0FBaUJKLElBQUksQ0FBQ0ksU0FBdEI7QUFDQSxPQUFLQyxPQUFMLEdBQWVMLElBQUksQ0FBQ0ssT0FBcEI7QUFDQSxPQUFLQyxVQUFMLEdBQWtCTixJQUFJLENBQUNNLFVBQXZCO0FBQ0EsT0FBS0MsVUFBTCxHQUFrQlAsSUFBSSxDQUFDTyxVQUF2QjtBQUNILENBUEQ7O0FBU0FHLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjtBQUNieEIsRUFBQUEsWUFBWSxFQUFaQSxZQURhO0FBRWJLLEVBQUFBLFFBQVEsRUFBUkEsUUFGYTtBQUdiTyxFQUFBQSxXQUFXLEVBQVhBO0FBSGEsQ0FBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG52YXIgV3JhcE1vZGVNYXNrID0ge1xuICAgIExvb3A6IDEgPDwgMSxcbiAgICBTaG91bGRXcmFwOiAxIDw8IDIsXG4gICAgLy8gUmVzZXJ2ZWQ6IDEgPDwgMyxcbiAgICBQaW5nUG9uZzogMSA8PCA0IHwgMSA8PCAxIHwgMSA8PCAyLCAgLy8gTG9vcCwgU2hvdWxkV3JhcFxuICAgIFJldmVyc2U6IDEgPDwgNSB8IDEgPDwgMiwgICAgICAvLyBTaG91bGRXcmFwXG59O1xuXG4vKipcbiAqICEjZW4gU3BlY2lmaWVzIGhvdyB0aW1lIGlzIHRyZWF0ZWQgd2hlbiBpdCBpcyBvdXRzaWRlIG9mIHRoZSBrZXlmcmFtZSByYW5nZSBvZiBhbiBBbmltYXRpb24uXG4gKiAhI3poIOWKqOeUu+S9v+eUqOeahOW+queOr+aooeW8j+OAglxuICogQGVudW0gV3JhcE1vZGVcbiAqIEBtZW1iZXJvZiBjY1xuICovXG52YXIgV3JhcE1vZGUgPSBjYy5FbnVtKHtcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmVhZHMgdGhlIGRlZmF1bHQgd3JhcCBtb2RlIHNldCBoaWdoZXIgdXAuXG4gICAgICogISN6aCDlkJEgQW5pbWF0aW9uIENvbXBvbmVudCDmiJbogIUgQW5pbWF0aW9uQ2xpcCDmn6Xmib4gd3JhcE1vZGVcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gRGVmYXVsdFxuICAgICAqL1xuICAgIERlZmF1bHQ6IDAsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEFsbCBpdGVyYXRpb25zIGFyZSBwbGF5ZWQgYXMgc3BlY2lmaWVkLlxuICAgICAqICEjemgg5Yqo55S75Y+q5pKt5pS+5LiA6YGNXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IE5vcm1hbFxuICAgICAqL1xuICAgIE5vcm1hbDogMSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQWxsIGl0ZXJhdGlvbnMgYXJlIHBsYXllZCBpbiB0aGUgcmV2ZXJzZSBkaXJlY3Rpb24gZnJvbSB0aGUgd2F5IHRoZXkgYXJlIHNwZWNpZmllZC5cbiAgICAgKiAhI3poIOS7juacgOWQjuS4gOW4p+aIlue7k+adn+S9jee9ruW8gOWni+WPjeWQkeaSreaUvu+8jOWIsOesrOS4gOW4p+aIluW8gOWni+S9jee9ruWBnOatolxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBSZXZlcnNlXG4gICAgICovXG4gICAgUmV2ZXJzZTogV3JhcE1vZGVNYXNrLlJldmVyc2UsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFdoZW4gdGltZSByZWFjaGVzIHRoZSBlbmQgb2YgdGhlIGFuaW1hdGlvbiwgdGltZSB3aWxsIGNvbnRpbnVlIGF0IHRoZSBiZWdpbm5pbmcuXG4gICAgICogISN6aCDlvqrnjq/mkq3mlL5cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gTG9vcFxuICAgICAqL1xuICAgIExvb3A6IFdyYXBNb2RlTWFzay5Mb29wLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBBbGwgaXRlcmF0aW9ucyBhcmUgcGxheWVkIGluIHRoZSByZXZlcnNlIGRpcmVjdGlvbiBmcm9tIHRoZSB3YXkgdGhleSBhcmUgc3BlY2lmaWVkLlxuICAgICAqIEFuZCB3aGVuIHRpbWUgcmVhY2hlcyB0aGUgc3RhcnQgb2YgdGhlIGFuaW1hdGlvbiwgdGltZSB3aWxsIGNvbnRpbnVlIGF0IHRoZSBlbmRpbmcuXG4gICAgICogISN6aCDlj43lkJHlvqrnjq/mkq3mlL5cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gTG9vcFJldmVyc2VcbiAgICAgKi9cbiAgICBMb29wUmV2ZXJzZTogV3JhcE1vZGVNYXNrLkxvb3AgfCBXcmFwTW9kZU1hc2suUmV2ZXJzZSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gRXZlbiBpdGVyYXRpb25zIGFyZSBwbGF5ZWQgYXMgc3BlY2lmaWVkLCBvZGQgaXRlcmF0aW9ucyBhcmUgcGxheWVkIGluIHRoZSByZXZlcnNlIGRpcmVjdGlvbiBmcm9tIHRoZSB3YXkgdGhleVxuICAgICAqIGFyZSBzcGVjaWZpZWQuXG4gICAgICogISN6aCDku47nrKzkuIDluKfmkq3mlL7liLDmnIDlkI7kuIDluKfvvIznhLblkI7lj43lkJHmkq3mlL7lm57nrKzkuIDluKfvvIzliLDnrKzkuIDluKflkI7lho3mraPlkJHmkq3mlL7vvIzlpoLmraTlvqrnjq9cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gUGluZ1BvbmdcbiAgICAgKi9cbiAgICBQaW5nUG9uZzogV3JhcE1vZGVNYXNrLlBpbmdQb25nLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBFdmVuIGl0ZXJhdGlvbnMgYXJlIHBsYXllZCBpbiB0aGUgcmV2ZXJzZSBkaXJlY3Rpb24gZnJvbSB0aGUgd2F5IHRoZXkgYXJlIHNwZWNpZmllZCwgb2RkIGl0ZXJhdGlvbnMgYXJlIHBsYXllZFxuICAgICAqIGFzIHNwZWNpZmllZC5cbiAgICAgKiAhI3poIOS7juacgOWQjuS4gOW4p+W8gOWni+WPjeWQkeaSreaUvu+8jOWFtuS7luWQjCBQaW5nUG9uZ1xuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBQaW5nUG9uZ1JldmVyc2VcbiAgICAgKi9cbiAgICBQaW5nUG9uZ1JldmVyc2U6IFdyYXBNb2RlTWFzay5QaW5nUG9uZyB8IFdyYXBNb2RlTWFzay5SZXZlcnNlXG59KTtcblxuY2MuV3JhcE1vZGUgPSBXcmFwTW9kZTtcblxuLy8gRm9yIGludGVybmFsXG5mdW5jdGlvbiBXcmFwcGVkSW5mbyAoaW5mbykge1xuICAgIGlmIChpbmZvKSB7XG4gICAgICAgIHRoaXMuc2V0KGluZm8pO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5yYXRpbyA9IDA7XG4gICAgdGhpcy50aW1lID0gMDtcbiAgICB0aGlzLmRpcmVjdGlvbiA9IDE7XG4gICAgdGhpcy5zdG9wcGVkID0gdHJ1ZTtcbiAgICB0aGlzLml0ZXJhdGlvbnMgPSAwO1xuICAgIHRoaXMuZnJhbWVJbmRleCA9IHVuZGVmaW5lZDtcbn1cblxuV3JhcHBlZEluZm8ucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChpbmZvKSB7XG4gICAgdGhpcy5yYXRpbyA9IGluZm8ucmF0aW87XG4gICAgdGhpcy50aW1lID0gaW5mby50aW1lO1xuICAgIHRoaXMuZGlyZWN0aW9uID0gaW5mby5kaXJlY3Rpb247XG4gICAgdGhpcy5zdG9wcGVkID0gaW5mby5zdG9wcGVkO1xuICAgIHRoaXMuaXRlcmF0aW9ucyA9IGluZm8uaXRlcmF0aW9ucztcbiAgICB0aGlzLmZyYW1lSW5kZXggPSBpbmZvLmZyYW1lSW5kZXg7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBXcmFwTW9kZU1hc2ssXG4gICAgV3JhcE1vZGUsXG4gICAgV3JhcHBlZEluZm9cbn07XG4iXX0=