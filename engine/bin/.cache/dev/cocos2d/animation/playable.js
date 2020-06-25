
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/animation/playable.js';
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
var js = cc.js;

var debug = require('../core/CCDebug');
/**
 * @class Playable
 *
 */


function Playable() {
  this._isPlaying = false;
  this._isPaused = false;
  this._stepOnce = false;
}

var prototype = Playable.prototype;
/**
 * !#en Is playing or paused in play mode?
 * !#zh 当前是否正在播放。
 * @property isPlaying
 * @type {boolean}
 * @default false
 * @readOnly
 */

js.get(prototype, 'isPlaying', function () {
  return this._isPlaying;
}, true);
/**
 * !#en Is currently paused? This can be true even if in edit mode(isPlaying == false).
 * !#zh 当前是否正在暂停
 * @property isPaused
 * @type {boolean}
 * @default false
 * @readOnly
 */

js.get(prototype, 'isPaused', function () {
  return this._isPaused;
}, true); // virtual

var virtual = function virtual() {};
/**
 * @method onPlay
 * @private
 */


prototype.onPlay = virtual;
/**
 * @method onPause
 * @private
 */

prototype.onPause = virtual;
/**
 * @method onResume
 * @private
 */

prototype.onResume = virtual;
/**
 * @method onStop
 * @private
 */

prototype.onStop = virtual;
/**
 * @method onError
 * @param {string} errorCode
 * @private
 */

prototype.onError = virtual; // public

/**
 * !#en Play this animation.
 * !#zh 播放动画。
 * @method play
 */

prototype.play = function () {
  if (this._isPlaying) {
    if (this._isPaused) {
      this._isPaused = false;
      this.onResume();
    } else {
      this.onError(debug.getError(3912));
    }
  } else {
    this._isPlaying = true;
    this.onPlay();
  }
};
/**
 * !#en Stop this animation.
 * !#zh 停止动画播放。
 * @method stop
 */


prototype.stop = function () {
  if (this._isPlaying) {
    this._isPlaying = false;
    this.onStop(); // need reset pause flag after onStop

    this._isPaused = false;
  }
};
/**
 * !#en Pause this animation.
 * !#zh 暂停动画。
 * @method pause
 */


prototype.pause = function () {
  if (this._isPlaying && !this._isPaused) {
    this._isPaused = true;
    this.onPause();
  }
};
/**
 * !#en Resume this animation.
 * !#zh 重新播放动画。
 * @method resume
 */


prototype.resume = function () {
  if (this._isPlaying && this._isPaused) {
    this._isPaused = false;
    this.onResume();
  }
};
/**
 * !#en Perform a single frame step.
 * !#zh 执行一帧动画。
 * @method step
 */


prototype.step = function () {
  this.pause();
  this._stepOnce = true;

  if (!this._isPlaying) {
    this.play();
  }
};

module.exports = Playable;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBsYXlhYmxlLmpzIl0sIm5hbWVzIjpbImpzIiwiY2MiLCJkZWJ1ZyIsInJlcXVpcmUiLCJQbGF5YWJsZSIsIl9pc1BsYXlpbmciLCJfaXNQYXVzZWQiLCJfc3RlcE9uY2UiLCJwcm90b3R5cGUiLCJnZXQiLCJ2aXJ0dWFsIiwib25QbGF5Iiwib25QYXVzZSIsIm9uUmVzdW1lIiwib25TdG9wIiwib25FcnJvciIsInBsYXkiLCJnZXRFcnJvciIsInN0b3AiLCJwYXVzZSIsInJlc3VtZSIsInN0ZXAiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxJQUFJQSxFQUFFLEdBQUdDLEVBQUUsQ0FBQ0QsRUFBWjs7QUFDQSxJQUFNRSxLQUFLLEdBQUdDLE9BQU8sQ0FBQyxpQkFBRCxDQUFyQjtBQUVBOzs7Ozs7QUFJQSxTQUFTQyxRQUFULEdBQXFCO0FBQ2pCLE9BQUtDLFVBQUwsR0FBa0IsS0FBbEI7QUFDQSxPQUFLQyxTQUFMLEdBQWlCLEtBQWpCO0FBQ0EsT0FBS0MsU0FBTCxHQUFpQixLQUFqQjtBQUNIOztBQUVELElBQUlDLFNBQVMsR0FBR0osUUFBUSxDQUFDSSxTQUF6QjtBQUVBOzs7Ozs7Ozs7QUFRQVIsRUFBRSxDQUFDUyxHQUFILENBQU9ELFNBQVAsRUFBa0IsV0FBbEIsRUFBK0IsWUFBWTtBQUN2QyxTQUFPLEtBQUtILFVBQVo7QUFDSCxDQUZELEVBRUcsSUFGSDtBQUlBOzs7Ozs7Ozs7QUFRQUwsRUFBRSxDQUFDUyxHQUFILENBQU9ELFNBQVAsRUFBa0IsVUFBbEIsRUFBOEIsWUFBWTtBQUN0QyxTQUFPLEtBQUtGLFNBQVo7QUFDSCxDQUZELEVBRUcsSUFGSCxHQUlBOztBQUVBLElBQUlJLE9BQU8sR0FBRyxTQUFWQSxPQUFVLEdBQVksQ0FBRSxDQUE1QjtBQUNBOzs7Ozs7QUFJQUYsU0FBUyxDQUFDRyxNQUFWLEdBQW1CRCxPQUFuQjtBQUNBOzs7OztBQUlBRixTQUFTLENBQUNJLE9BQVYsR0FBb0JGLE9BQXBCO0FBQ0E7Ozs7O0FBSUFGLFNBQVMsQ0FBQ0ssUUFBVixHQUFxQkgsT0FBckI7QUFDQTs7Ozs7QUFJQUYsU0FBUyxDQUFDTSxNQUFWLEdBQW1CSixPQUFuQjtBQUNBOzs7Ozs7QUFLQUYsU0FBUyxDQUFDTyxPQUFWLEdBQW9CTCxPQUFwQixFQUVBOztBQUVBOzs7Ozs7QUFLQUYsU0FBUyxDQUFDUSxJQUFWLEdBQWlCLFlBQVk7QUFDekIsTUFBSSxLQUFLWCxVQUFULEVBQXFCO0FBQ2pCLFFBQUksS0FBS0MsU0FBVCxFQUFvQjtBQUNoQixXQUFLQSxTQUFMLEdBQWlCLEtBQWpCO0FBQ0EsV0FBS08sUUFBTDtBQUNILEtBSEQsTUFJSztBQUNELFdBQUtFLE9BQUwsQ0FBYWIsS0FBSyxDQUFDZSxRQUFOLENBQWUsSUFBZixDQUFiO0FBQ0g7QUFDSixHQVJELE1BU0s7QUFDRCxTQUFLWixVQUFMLEdBQWtCLElBQWxCO0FBQ0EsU0FBS00sTUFBTDtBQUNIO0FBQ0osQ0FkRDtBQWdCQTs7Ozs7OztBQUtBSCxTQUFTLENBQUNVLElBQVYsR0FBaUIsWUFBWTtBQUN6QixNQUFJLEtBQUtiLFVBQVQsRUFBcUI7QUFDakIsU0FBS0EsVUFBTCxHQUFrQixLQUFsQjtBQUNBLFNBQUtTLE1BQUwsR0FGaUIsQ0FJakI7O0FBQ0EsU0FBS1IsU0FBTCxHQUFpQixLQUFqQjtBQUNIO0FBQ0osQ0FSRDtBQVVBOzs7Ozs7O0FBS0FFLFNBQVMsQ0FBQ1csS0FBVixHQUFrQixZQUFZO0FBQzFCLE1BQUksS0FBS2QsVUFBTCxJQUFtQixDQUFDLEtBQUtDLFNBQTdCLEVBQXdDO0FBQ3BDLFNBQUtBLFNBQUwsR0FBaUIsSUFBakI7QUFDQSxTQUFLTSxPQUFMO0FBQ0g7QUFDSixDQUxEO0FBT0E7Ozs7Ozs7QUFLQUosU0FBUyxDQUFDWSxNQUFWLEdBQW1CLFlBQVk7QUFDM0IsTUFBSSxLQUFLZixVQUFMLElBQW1CLEtBQUtDLFNBQTVCLEVBQXVDO0FBQ25DLFNBQUtBLFNBQUwsR0FBaUIsS0FBakI7QUFDQSxTQUFLTyxRQUFMO0FBQ0g7QUFDSixDQUxEO0FBT0E7Ozs7Ozs7QUFLQUwsU0FBUyxDQUFDYSxJQUFWLEdBQWlCLFlBQVk7QUFDekIsT0FBS0YsS0FBTDtBQUNBLE9BQUtaLFNBQUwsR0FBaUIsSUFBakI7O0FBQ0EsTUFBSSxDQUFDLEtBQUtGLFVBQVYsRUFBc0I7QUFDbEIsU0FBS1csSUFBTDtBQUNIO0FBQ0osQ0FORDs7QUFRQU0sTUFBTSxDQUFDQyxPQUFQLEdBQWlCbkIsUUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG52YXIganMgPSBjYy5qcztcbmNvbnN0IGRlYnVnID0gcmVxdWlyZSgnLi4vY29yZS9DQ0RlYnVnJyk7XG5cbi8qKlxuICogQGNsYXNzIFBsYXlhYmxlXG4gKlxuICovXG5mdW5jdGlvbiBQbGF5YWJsZSAoKSB7XG4gICAgdGhpcy5faXNQbGF5aW5nID0gZmFsc2U7XG4gICAgdGhpcy5faXNQYXVzZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9zdGVwT25jZSA9IGZhbHNlO1xufVxuXG52YXIgcHJvdG90eXBlID0gUGxheWFibGUucHJvdG90eXBlO1xuXG4vKipcbiAqICEjZW4gSXMgcGxheWluZyBvciBwYXVzZWQgaW4gcGxheSBtb2RlP1xuICogISN6aCDlvZPliY3mmK/lkKbmraPlnKjmkq3mlL7jgIJcbiAqIEBwcm9wZXJ0eSBpc1BsYXlpbmdcbiAqIEB0eXBlIHtib29sZWFufVxuICogQGRlZmF1bHQgZmFsc2VcbiAqIEByZWFkT25seVxuICovXG5qcy5nZXQocHJvdG90eXBlLCAnaXNQbGF5aW5nJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9pc1BsYXlpbmc7XG59LCB0cnVlKTtcblxuLyoqXG4gKiAhI2VuIElzIGN1cnJlbnRseSBwYXVzZWQ/IFRoaXMgY2FuIGJlIHRydWUgZXZlbiBpZiBpbiBlZGl0IG1vZGUoaXNQbGF5aW5nID09IGZhbHNlKS5cbiAqICEjemgg5b2T5YmN5piv5ZCm5q2j5Zyo5pqC5YGcXG4gKiBAcHJvcGVydHkgaXNQYXVzZWRcbiAqIEB0eXBlIHtib29sZWFufVxuICogQGRlZmF1bHQgZmFsc2VcbiAqIEByZWFkT25seVxuICovXG5qcy5nZXQocHJvdG90eXBlLCAnaXNQYXVzZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lzUGF1c2VkO1xufSwgdHJ1ZSk7XG5cbi8vIHZpcnR1YWxcblxudmFyIHZpcnR1YWwgPSBmdW5jdGlvbiAoKSB7fTtcbi8qKlxuICogQG1ldGhvZCBvblBsYXlcbiAqIEBwcml2YXRlXG4gKi9cbnByb3RvdHlwZS5vblBsYXkgPSB2aXJ0dWFsO1xuLyoqXG4gKiBAbWV0aG9kIG9uUGF1c2VcbiAqIEBwcml2YXRlXG4gKi9cbnByb3RvdHlwZS5vblBhdXNlID0gdmlydHVhbDtcbi8qKlxuICogQG1ldGhvZCBvblJlc3VtZVxuICogQHByaXZhdGVcbiAqL1xucHJvdG90eXBlLm9uUmVzdW1lID0gdmlydHVhbDtcbi8qKlxuICogQG1ldGhvZCBvblN0b3BcbiAqIEBwcml2YXRlXG4gKi9cbnByb3RvdHlwZS5vblN0b3AgPSB2aXJ0dWFsO1xuLyoqXG4gKiBAbWV0aG9kIG9uRXJyb3JcbiAqIEBwYXJhbSB7c3RyaW5nfSBlcnJvckNvZGVcbiAqIEBwcml2YXRlXG4gKi9cbnByb3RvdHlwZS5vbkVycm9yID0gdmlydHVhbDtcblxuLy8gcHVibGljXG5cbi8qKlxuICogISNlbiBQbGF5IHRoaXMgYW5pbWF0aW9uLlxuICogISN6aCDmkq3mlL7liqjnlLvjgIJcbiAqIEBtZXRob2QgcGxheVxuICovXG5wcm90b3R5cGUucGxheSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5faXNQbGF5aW5nKSB7XG4gICAgICAgIGlmICh0aGlzLl9pc1BhdXNlZCkge1xuICAgICAgICAgICAgdGhpcy5faXNQYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMub25SZXN1bWUoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub25FcnJvcihkZWJ1Zy5nZXRFcnJvcigzOTEyKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRoaXMuX2lzUGxheWluZyA9IHRydWU7XG4gICAgICAgIHRoaXMub25QbGF5KCk7XG4gICAgfVxufTtcblxuLyoqXG4gKiAhI2VuIFN0b3AgdGhpcyBhbmltYXRpb24uXG4gKiAhI3poIOWBnOatouWKqOeUu+aSreaUvuOAglxuICogQG1ldGhvZCBzdG9wXG4gKi9cbnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLl9pc1BsYXlpbmcpIHtcbiAgICAgICAgdGhpcy5faXNQbGF5aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMub25TdG9wKCk7XG5cbiAgICAgICAgLy8gbmVlZCByZXNldCBwYXVzZSBmbGFnIGFmdGVyIG9uU3RvcFxuICAgICAgICB0aGlzLl9pc1BhdXNlZCA9IGZhbHNlO1xuICAgIH1cbn07XG5cbi8qKlxuICogISNlbiBQYXVzZSB0aGlzIGFuaW1hdGlvbi5cbiAqICEjemgg5pqC5YGc5Yqo55S744CCXG4gKiBAbWV0aG9kIHBhdXNlXG4gKi9cbnByb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5faXNQbGF5aW5nICYmICF0aGlzLl9pc1BhdXNlZCkge1xuICAgICAgICB0aGlzLl9pc1BhdXNlZCA9IHRydWU7XG4gICAgICAgIHRoaXMub25QYXVzZSgpO1xuICAgIH1cbn07XG5cbi8qKlxuICogISNlbiBSZXN1bWUgdGhpcyBhbmltYXRpb24uXG4gKiAhI3poIOmHjeaWsOaSreaUvuWKqOeUu+OAglxuICogQG1ldGhvZCByZXN1bWVcbiAqL1xucHJvdG90eXBlLnJlc3VtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5faXNQbGF5aW5nICYmIHRoaXMuX2lzUGF1c2VkKSB7XG4gICAgICAgIHRoaXMuX2lzUGF1c2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMub25SZXN1bWUoKTtcbiAgICB9XG59O1xuXG4vKipcbiAqICEjZW4gUGVyZm9ybSBhIHNpbmdsZSBmcmFtZSBzdGVwLlxuICogISN6aCDmiafooYzkuIDluKfliqjnlLvjgIJcbiAqIEBtZXRob2Qgc3RlcFxuICovXG5wcm90b3R5cGUuc3RlcCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnBhdXNlKCk7XG4gICAgdGhpcy5fc3RlcE9uY2UgPSB0cnVlO1xuICAgIGlmICghdGhpcy5faXNQbGF5aW5nKSB7XG4gICAgICAgIHRoaXMucGxheSgpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWFibGU7XG4iXX0=