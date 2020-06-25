
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/animation/animation-state.js';
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

var Playable = require('./playable');

var Types = require('./types');

var WrappedInfo = Types.WrappedInfo;
var WrapMode = Types.WrapMode;
var WrapModeMask = Types.WrapModeMask;
/**
 * !#en
 * The AnimationState gives full control over animation playback process.
 * In most cases the Animation Component is sufficient and easier to use. Use the AnimationState if you need full control.
 * !#zh
 * AnimationState 完全控制动画播放过程。<br/>
 * 大多数情况下 动画组件 是足够和易于使用的。如果您需要更多的动画控制接口，请使用 AnimationState。
 * @class AnimationState
 * @extends Playable
 *
 */

/**
 * @method constructor
 * @param {AnimationClip} clip
 * @param {String} [name]
 */

function AnimationState(clip, name) {
  Playable.call(this); // Mark whether the current frame is played.
  // When set new time to animation state, we should ensure the frame at the specified time being played at next update.

  this._currentFramePlayed = false;
  this._delay = 0;
  this._delayTime = 0;
  this._wrappedInfo = new WrappedInfo();
  this._lastWrappedInfo = null;
  this._process = process;
  this._clip = clip;
  this._name = name || clip && clip.name;
  /**
   * @property animator
   * @type {AnimationAnimator}
   * @private
   */

  this.animator = null;
  /**
   * !#en The curves list.
   * !#zh 曲线列表。
   * @property curves
   * @type {Object[]}
   */

  this.curves = []; // http://www.w3.org/TR/web-animations/#idl-def-AnimationTiming

  /**
   * !#en The start delay which represents the number of seconds from an animation's start time to the start of
   * the active interval.
   * !#zh 延迟多少秒播放。
   *
   * @property delay
   * @type {Number}
   * @default 0
   */

  this.delay = 0;
  /**
   * !#en The animation's iteration count property.
   *
   * A real number greater than or equal to zero (including positive infinity) representing the number of times
   * to repeat the animation node.
   *
   * Values less than zero and NaN values are treated as the value 1.0 for the purpose of timing model
   * calculations.
   *
   * !#zh 迭代次数，指动画播放多少次后结束, normalize time。 如 2.5（2次半）
   *
   * @property repeatCount
   * @type {Number}
   * @default 1
   */

  this.repeatCount = 1;
  /**
   * !#en The iteration duration of this animation in seconds. (length)
   * !#zh 单次动画的持续时间，秒。
   *
   * @property duration
   * @type {Number}
   * @readOnly
   */

  this.duration = 1;
  /**
   * !#en The animation's playback speed. 1 is normal playback speed.
   * !#zh 播放速率。
   * @property speed
   * @type {Number}
   * @default: 1.0
   */

  this.speed = 1;
  /**
   * !#en
   * Wrapping mode of the playing animation.
   * Notice : dynamic change wrapMode will reset time and repeatCount property
   * !#zh
   * 动画循环方式。
   * 需要注意的是，动态修改 wrapMode 时，会重置 time 以及 repeatCount
   *
   * @property wrapMode
   * @type {WrapMode}
   * @default: WrapMode.Normal
   */

  this.wrapMode = WrapMode.Normal;
  /**
   * !#en The current time of this animation in seconds.
   * !#zh 动画当前的时间，秒。
   * @property time
   * @type {Number}
   * @default 0
   */

  this.time = 0; // Animation as event target

  this._target = null;
  this._lastframeEventOn = false;

  this.emit = function () {
    var args = new Array(arguments.length);

    for (var i = 0, l = args.length; i < l; i++) {
      args[i] = arguments[i];
    }

    cc.director.getAnimationManager().pushDelayEvent(this, '_emit', args);
  };
}

js.extend(AnimationState, Playable);
var proto = AnimationState.prototype;

proto._emit = function (type, state) {
  if (this._target && this._target.isValid) {
    this._target.emit(type, type, state);
  }
};

proto.on = function (type, callback, target) {
  if (this._target && this._target.isValid) {
    if (type === 'lastframe') {
      this._lastframeEventOn = true;
    }

    return this._target.on(type, callback, target);
  } else {
    return null;
  }
};

proto.once = function (type, callback, target) {
  if (this._target && this._target.isValid) {
    if (type === 'lastframe') {
      this._lastframeEventOn = true;
    }

    var self = this;
    return this._target.once(type, function (event) {
      callback.call(target, event);
      self._lastframeEventOn = false;
    });
  } else {
    return null;
  }
};

proto.off = function (type, callback, target) {
  if (this._target && this._target.isValid) {
    if (type === 'lastframe') {
      if (!this._target.hasEventListener(type)) {
        this._lastframeEventOn = false;
      }
    }

    this._target.off(type, callback, target);
  }
};

proto._setEventTarget = function (target) {
  this._target = target;
};

proto.onPlay = function () {
  // replay
  this.setTime(0);
  this._delayTime = this._delay;
  cc.director.getAnimationManager().addAnimation(this);

  if (this.animator) {
    this.animator.addAnimation(this);
  }

  this.emit('play', this);
};

proto.onStop = function () {
  if (!this.isPaused) {
    cc.director.getAnimationManager().removeAnimation(this);
  }

  if (this.animator) {
    this.animator.removeAnimation(this);
  }

  this.emit('stop', this);
};

proto.onResume = function () {
  cc.director.getAnimationManager().addAnimation(this);
  this.emit('resume', this);
};

proto.onPause = function () {
  cc.director.getAnimationManager().removeAnimation(this);
  this.emit('pause', this);
};

proto.setTime = function (time) {
  this._currentFramePlayed = false;
  this.time = time || 0;
  var curves = this.curves;

  for (var i = 0, l = curves.length; i < l; i++) {
    var curve = curves[i];

    if (curve.onTimeChangedManually) {
      curve.onTimeChangedManually(time, this);
    }
  }
};

function process() {
  // sample
  var info = this.sample();

  if (this._lastframeEventOn) {
    var lastInfo;

    if (!this._lastWrappedInfo) {
      lastInfo = this._lastWrappedInfo = new WrappedInfo(info);
    } else {
      lastInfo = this._lastWrappedInfo;
    }

    if (this.repeatCount > 1 && (info.iterations | 0) > (lastInfo.iterations | 0)) {
      this.emit('lastframe', this);
    }

    lastInfo.set(info);
  }

  if (info.stopped) {
    this.stop();
    this.emit('finished', this);
  }
}

function simpleProcess() {
  var time = this.time;
  var duration = this.duration;

  if (time > duration) {
    time = time % duration;
    if (time === 0) time = duration;
  } else if (time < 0) {
    time = time % duration;
    if (time !== 0) time += duration;
  }

  var ratio = time / duration;
  var curves = this.curves;

  for (var i = 0, len = curves.length; i < len; i++) {
    var curve = curves[i];
    curve.sample(time, ratio, this);
  }

  if (this._lastframeEventOn) {
    if (this._lastIterations === undefined) {
      this._lastIterations = ratio;
    }

    if (this.time > 0 && this._lastIterations > ratio || this.time < 0 && this._lastIterations < ratio) {
      this.emit('lastframe', this);
    }

    this._lastIterations = ratio;
  }
}

proto.update = function (delta) {
  // calculate delay time
  if (this._delayTime > 0) {
    this._delayTime -= delta;

    if (this._delayTime > 0) {
      // still waiting
      return;
    }
  } // make first frame perfect
  //var playPerfectFirstFrame = (this.time === 0);


  if (this._currentFramePlayed) {
    this.time += delta * this.speed;
  } else {
    this._currentFramePlayed = true;
  }

  this._process();
};

proto._needRevers = function (currentIterations) {
  var wrapMode = this.wrapMode;
  var needRevers = false;

  if ((wrapMode & WrapModeMask.PingPong) === WrapModeMask.PingPong) {
    var isEnd = currentIterations - (currentIterations | 0) === 0;

    if (isEnd && currentIterations > 0) {
      currentIterations -= 1;
    }

    var isOddIteration = currentIterations & 1;

    if (isOddIteration) {
      needRevers = !needRevers;
    }
  }

  if ((wrapMode & WrapModeMask.Reverse) === WrapModeMask.Reverse) {
    needRevers = !needRevers;
  }

  return needRevers;
};

proto.getWrappedInfo = function (time, info) {
  info = info || new WrappedInfo();
  var stopped = false;
  var duration = this.duration;
  var repeatCount = this.repeatCount;
  var currentIterations = time > 0 ? time / duration : -(time / duration);

  if (currentIterations >= repeatCount) {
    currentIterations = repeatCount;
    stopped = true;
    var tempRatio = repeatCount - (repeatCount | 0);

    if (tempRatio === 0) {
      tempRatio = 1; // 如果播放过，动画不复位
    }

    time = tempRatio * duration * (time > 0 ? 1 : -1);
  }

  if (time > duration) {
    var tempTime = time % duration;
    time = tempTime === 0 ? duration : tempTime;
  } else if (time < 0) {
    time = time % duration;
    if (time !== 0) time += duration;
  }

  var needRevers = false;
  var shouldWrap = this._wrapMode & WrapModeMask.ShouldWrap;

  if (shouldWrap) {
    needRevers = this._needRevers(currentIterations);
  }

  var direction = needRevers ? -1 : 1;

  if (this.speed < 0) {
    direction *= -1;
  } // calculate wrapped time


  if (shouldWrap && needRevers) {
    time = duration - time;
  }

  info.ratio = time / duration;
  info.time = time;
  info.direction = direction;
  info.stopped = stopped;
  info.iterations = currentIterations;
  return info;
};

proto.sample = function () {
  var info = this.getWrappedInfo(this.time, this._wrappedInfo);
  var curves = this.curves;

  for (var i = 0, len = curves.length; i < len; i++) {
    var curve = curves[i];
    curve.sample(info.time, info.ratio, this);
  }

  return info;
};
/**
 * !#en The clip that is being played by this animation state.
 * !#zh 此动画状态正在播放的剪辑。
 * @property clip
 * @type {AnimationClip}
 * @final
 */


js.get(proto, 'clip', function () {
  return this._clip;
});
/**
 * !#en The name of the playing animation.
 * !#zh 动画的名字
 * @property name
 * @type {String}
 * @readOnly
 */

js.get(proto, 'name', function () {
  return this._name;
});
js.obsolete(proto, 'AnimationState.length', 'duration');
js.getset(proto, 'curveLoaded', function () {
  return this.curves.length > 0;
}, function () {
  this.curves.length = 0;
});
js.getset(proto, 'wrapMode', function () {
  return this._wrapMode;
}, function (value) {
  this._wrapMode = value;
  if (CC_EDITOR) return; // dynamic change wrapMode will need reset time to 0

  this.time = 0;

  if (value & WrapModeMask.Loop) {
    this.repeatCount = Infinity;
  } else {
    this.repeatCount = 1;
  }
});
js.getset(proto, 'repeatCount', function () {
  return this._repeatCount;
}, function (value) {
  this._repeatCount = value;
  var shouldWrap = this._wrapMode & WrapModeMask.ShouldWrap;
  var reverse = (this.wrapMode & WrapModeMask.Reverse) === WrapModeMask.Reverse;

  if (value === Infinity && !shouldWrap && !reverse) {
    this._process = simpleProcess;
  } else {
    this._process = process;
  }
});
js.getset(proto, 'delay', function () {
  return this._delay;
}, function (value) {
  this._delayTime = this._delay = value;
});
cc.AnimationState = module.exports = AnimationState;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuaW1hdGlvbi1zdGF0ZS5qcyJdLCJuYW1lcyI6WyJqcyIsImNjIiwiUGxheWFibGUiLCJyZXF1aXJlIiwiVHlwZXMiLCJXcmFwcGVkSW5mbyIsIldyYXBNb2RlIiwiV3JhcE1vZGVNYXNrIiwiQW5pbWF0aW9uU3RhdGUiLCJjbGlwIiwibmFtZSIsImNhbGwiLCJfY3VycmVudEZyYW1lUGxheWVkIiwiX2RlbGF5IiwiX2RlbGF5VGltZSIsIl93cmFwcGVkSW5mbyIsIl9sYXN0V3JhcHBlZEluZm8iLCJfcHJvY2VzcyIsInByb2Nlc3MiLCJfY2xpcCIsIl9uYW1lIiwiYW5pbWF0b3IiLCJjdXJ2ZXMiLCJkZWxheSIsInJlcGVhdENvdW50IiwiZHVyYXRpb24iLCJzcGVlZCIsIndyYXBNb2RlIiwiTm9ybWFsIiwidGltZSIsIl90YXJnZXQiLCJfbGFzdGZyYW1lRXZlbnRPbiIsImVtaXQiLCJhcmdzIiwiQXJyYXkiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJpIiwibCIsImRpcmVjdG9yIiwiZ2V0QW5pbWF0aW9uTWFuYWdlciIsInB1c2hEZWxheUV2ZW50IiwiZXh0ZW5kIiwicHJvdG8iLCJwcm90b3R5cGUiLCJfZW1pdCIsInR5cGUiLCJzdGF0ZSIsImlzVmFsaWQiLCJvbiIsImNhbGxiYWNrIiwidGFyZ2V0Iiwib25jZSIsInNlbGYiLCJldmVudCIsIm9mZiIsImhhc0V2ZW50TGlzdGVuZXIiLCJfc2V0RXZlbnRUYXJnZXQiLCJvblBsYXkiLCJzZXRUaW1lIiwiYWRkQW5pbWF0aW9uIiwib25TdG9wIiwiaXNQYXVzZWQiLCJyZW1vdmVBbmltYXRpb24iLCJvblJlc3VtZSIsIm9uUGF1c2UiLCJjdXJ2ZSIsIm9uVGltZUNoYW5nZWRNYW51YWxseSIsImluZm8iLCJzYW1wbGUiLCJsYXN0SW5mbyIsIml0ZXJhdGlvbnMiLCJzZXQiLCJzdG9wcGVkIiwic3RvcCIsInNpbXBsZVByb2Nlc3MiLCJyYXRpbyIsImxlbiIsIl9sYXN0SXRlcmF0aW9ucyIsInVuZGVmaW5lZCIsInVwZGF0ZSIsImRlbHRhIiwiX25lZWRSZXZlcnMiLCJjdXJyZW50SXRlcmF0aW9ucyIsIm5lZWRSZXZlcnMiLCJQaW5nUG9uZyIsImlzRW5kIiwiaXNPZGRJdGVyYXRpb24iLCJSZXZlcnNlIiwiZ2V0V3JhcHBlZEluZm8iLCJ0ZW1wUmF0aW8iLCJ0ZW1wVGltZSIsInNob3VsZFdyYXAiLCJfd3JhcE1vZGUiLCJTaG91bGRXcmFwIiwiZGlyZWN0aW9uIiwiZ2V0Iiwib2Jzb2xldGUiLCJnZXRzZXQiLCJ2YWx1ZSIsIkNDX0VESVRPUiIsIkxvb3AiLCJJbmZpbml0eSIsIl9yZXBlYXRDb3VudCIsInJldmVyc2UiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFJQSxFQUFFLEdBQUdDLEVBQUUsQ0FBQ0QsRUFBWjs7QUFDQSxJQUFJRSxRQUFRLEdBQUdDLE9BQU8sQ0FBQyxZQUFELENBQXRCOztBQUVBLElBQUlDLEtBQUssR0FBR0QsT0FBTyxDQUFDLFNBQUQsQ0FBbkI7O0FBQ0EsSUFBSUUsV0FBVyxHQUFHRCxLQUFLLENBQUNDLFdBQXhCO0FBQ0EsSUFBSUMsUUFBUSxHQUFHRixLQUFLLENBQUNFLFFBQXJCO0FBQ0EsSUFBSUMsWUFBWSxHQUFHSCxLQUFLLENBQUNHLFlBQXpCO0FBRUE7Ozs7Ozs7Ozs7OztBQVlBOzs7Ozs7QUFLQSxTQUFTQyxjQUFULENBQXlCQyxJQUF6QixFQUErQkMsSUFBL0IsRUFBcUM7QUFDakNSLEVBQUFBLFFBQVEsQ0FBQ1MsSUFBVCxDQUFjLElBQWQsRUFEaUMsQ0FHakM7QUFDQTs7QUFDQSxPQUFLQyxtQkFBTCxHQUEyQixLQUEzQjtBQUVBLE9BQUtDLE1BQUwsR0FBYyxDQUFkO0FBQ0EsT0FBS0MsVUFBTCxHQUFrQixDQUFsQjtBQUVBLE9BQUtDLFlBQUwsR0FBb0IsSUFBSVYsV0FBSixFQUFwQjtBQUNBLE9BQUtXLGdCQUFMLEdBQXdCLElBQXhCO0FBRUEs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Q0FBbkI7QUFDSDtBQUVKLENBbkJMO0FBc0JBeEIsRUFBRSxDQUFDa0csTUFBSCxDQUFVdkQsS0FBVixFQUFpQixhQUFqQixFQUNJLFlBQVk7QUFDUixTQUFPLEtBQUs0RCxZQUFaO0FBQ0gsQ0FITCxFQUlJLFVBQVVKLEtBQVYsRUFBaUI7QUFDYixPQUFLSSxZQUFMLEdBQW9CSixLQUFwQjtBQUVBLE1BQUlQLFVBQVUsR0FBRyxLQUFLQyxTQUFMLEdBQWlCdEYsWUFBWSxDQUFDdUYsVUFBL0M7QUFDQSxNQUFJVSxPQUFPLEdBQUcsQ0FBQyxLQUFLN0UsUUFBTCxHQUFnQnBCLFlBQVksQ0FBQ2lGLE9BQTlCLE1BQTJDakYsWUFBWSxDQUFDaUYsT0FBdEU7O0FBQ0EsTUFBSVcsS0FBSyxLQUFLRyxRQUFWLElBQXNCLENBQUNWLFVBQXZCLElBQXFDLENBQUNZLE9BQTFDLEVBQW1EO0FBQy9DLFNBQUt2RixRQUFMLEdBQWdCMEQsYUFBaEI7QUFDSCxHQUZELE1BR0s7QUFDRCxTQUFLMUQsUUFBTCxHQUFnQkMsT0FBaEI7QUFDSDtBQUNKLENBZkw7QUFrQkFsQixFQUFFLENBQUNrRyxNQUFILENBQVV2RCxLQUFWLEVBQWlCLE9BQWpCLEVBQ0ksWUFBWTtBQUNSLFNBQU8sS0FBSzlCLE1BQVo7QUFDSCxDQUhMLEVBSUksVUFBVXNGLEtBQVYsRUFBaUI7QUFDYixPQUFLckYsVUFBTCxHQUFrQixLQUFLRCxNQUFMLEdBQWNzRixLQUFoQztBQUNILENBTkw7QUFVQWxHLEVBQUUsQ0FBQ08sY0FBSCxHQUFvQmlHLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQmxHLGNBQXJDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG52YXIganMgPSBjYy5qcztcbnZhciBQbGF5YWJsZSA9IHJlcXVpcmUoJy4vcGxheWFibGUnKTtcblxudmFyIFR5cGVzID0gcmVxdWlyZSgnLi90eXBlcycpO1xudmFyIFdyYXBwZWRJbmZvID0gVHlwZXMuV3JhcHBlZEluZm87XG52YXIgV3JhcE1vZGUgPSBUeXBlcy5XcmFwTW9kZTtcbnZhciBXcmFwTW9kZU1hc2sgPSBUeXBlcy5XcmFwTW9kZU1hc2s7XG5cbi8qKlxuICogISNlblxuICogVGhlIEFuaW1hdGlvblN0YXRlIGdpdmVzIGZ1bGwgY29udHJvbCBvdmVyIGFuaW1hdGlvbiBwbGF5YmFjayBwcm9jZXNzLlxuICogSW4gbW9zdCBjYXNlcyB0aGUgQW5pbWF0aW9uIENvbXBvbmVudCBpcyBzdWZmaWNpZW50IGFuZCBlYXNpZXIgdG8gdXNlLiBVc2UgdGhlIEFuaW1hdGlvblN0YXRlIGlmIHlvdSBuZWVkIGZ1bGwgY29udHJvbC5cbiAqICEjemhcbiAqIEFuaW1hdGlvblN0YXRlIOWujOWFqOaOp+WItuWKqOeUu+aSreaUvui/h+eoi+OAgjxici8+XG4gKiDlpKflpJrmlbDmg4XlhrXkuIsg5Yqo55S757uE5Lu2IOaYr+i2s+Wkn+WSjOaYk+S6juS9v+eUqOeahOOAguWmguaenOaCqOmcgOimgeabtOWkmueahOWKqOeUu+aOp+WItuaOpeWPo++8jOivt+S9v+eUqCBBbmltYXRpb25TdGF0ZeOAglxuICogQGNsYXNzIEFuaW1hdGlvblN0YXRlXG4gKiBAZXh0ZW5kcyBQbGF5YWJsZVxuICpcbiAqL1xuXG4vKipcbiAqIEBtZXRob2QgY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QW5pbWF0aW9uQ2xpcH0gY2xpcFxuICogQHBhcmFtIHtTdHJpbmd9IFtuYW1lXVxuICovXG5mdW5jdGlvbiBBbmltYXRpb25TdGF0ZSAoY2xpcCwgbmFtZSkge1xuICAgIFBsYXlhYmxlLmNhbGwodGhpcyk7XG4gICAgXG4gICAgLy8gTWFyayB3aGV0aGVyIHRoZSBjdXJyZW50IGZyYW1lIGlzIHBsYXllZC5cbiAgICAvLyBXaGVuIHNldCBuZXcgdGltZSB0byBhbmltYXRpb24gc3RhdGUsIHdlIHNob3VsZCBlbnN1cmUgdGhlIGZyYW1lIGF0IHRoZSBzcGVjaWZpZWQgdGltZSBiZWluZyBwbGF5ZWQgYXQgbmV4dCB1cGRhdGUuXG4gICAgdGhpcy5fY3VycmVudEZyYW1lUGxheWVkID0gZmFsc2U7XG4gICAgXG4gICAgdGhpcy5fZGVsYXkgPSAwO1xuICAgIHRoaXMuX2RlbGF5VGltZSA9IDA7XG5cbiAgICB0aGlzLl93cmFwcGVkSW5mbyA9IG5ldyBXcmFwcGVkSW5mbygpO1xuICAgIHRoaXMuX2xhc3RXcmFwcGVkSW5mbyA9IG51bGw7XG5cbiAgICB0aGlzLl9wcm9jZXNzID0gcHJvY2VzcztcblxuICAgIHRoaXMuX2NsaXAgPSBjbGlwO1xuICAgIHRoaXMuX25hbWUgPSBuYW1lIHx8IChjbGlwICYmIGNsaXAubmFtZSk7XG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgYW5pbWF0b3JcbiAgICAgKiBAdHlwZSB7QW5pbWF0aW9uQW5pbWF0b3J9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmFuaW1hdG9yID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGN1cnZlcyBsaXN0LlxuICAgICAqICEjemgg5puy57q/5YiX6KGo44CCXG4gICAgICogQHByb3BlcnR5IGN1cnZlc1xuICAgICAqIEB0eXBlIHtPYmplY3RbXX1cbiAgICAgKi9cbiAgICB0aGlzLmN1cnZlcyA9IFtdO1xuXG4gICAgLy8gaHR0cDovL3d3dy53My5vcmcvVFIvd2ViLWFuaW1hdGlvbnMvI2lkbC1kZWYtQW5pbWF0aW9uVGltaW5nXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBzdGFydCBkZWxheSB3aGljaCByZXByZXNlbnRzIHRoZSBudW1iZXIgb2Ygc2Vjb25kcyBmcm9tIGFuIGFuaW1hdGlvbidzIHN0YXJ0IHRpbWUgdG8gdGhlIHN0YXJ0IG9mXG4gICAgICogdGhlIGFjdGl2ZSBpbnRlcnZhbC5cbiAgICAgKiAhI3poIOW7tui/n+WkmuWwkeenkuaSreaUvuOAglxuICAgICAqXG4gICAgICogQHByb3BlcnR5IGRlbGF5XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAZGVmYXVsdCAwXG4gICAgICovXG4gICAgdGhpcy5kZWxheSA9IDA7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBhbmltYXRpb24ncyBpdGVyYXRpb24gY291bnQgcHJvcGVydHkuXG4gICAgICpcbiAgICAgKiBBIHJlYWwgbnVtYmVyIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB6ZXJvIChpbmNsdWRpbmcgcG9zaXRpdmUgaW5maW5pdHkpIHJlcHJlc2VudGluZyB0aGUgbnVtYmVyIG9mIHRpbWVzXG4gICAgICogdG8gcmVwZWF0IHRoZSBhbmltYXRpb24gbm9kZS5cbiAgICAgKlxuICAgICAqIFZhbHVlcyBsZXNzIHRoYW4gemVybyBhbmQgTmFOIHZhbHVlcyBhcmUgdHJlYXRlZCBhcyB0aGUgdmFsdWUgMS4wIGZvciB0aGUgcHVycG9zZSBvZiB0aW1pbmcgbW9kZWxcbiAgICAgKiBjYWxjdWxhdGlvbnMuXG4gICAgICpcbiAgICAgKiAhI3poIOi/reS7o+asoeaVsO+8jOaMh+WKqOeUu+aSreaUvuWkmuWwkeasoeWQjue7k+adnywgbm9ybWFsaXplIHRpbWXjgIIg5aaCIDIuNe+8iDLmrKHljYrvvIlcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSByZXBlYXRDb3VudFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQGRlZmF1bHQgMVxuICAgICAqL1xuICAgIHRoaXMucmVwZWF0Q291bnQgPSAxO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgaXRlcmF0aW9uIGR1cmF0aW9uIG9mIHRoaXMgYW5pbWF0aW9uIGluIHNlY29uZHMuIChsZW5ndGgpXG4gICAgICogISN6aCDljZXmrKHliqjnlLvnmoTmjIHnu63ml7bpl7TvvIznp5LjgIJcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBkdXJhdGlvblxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgdGhpcy5kdXJhdGlvbiA9IDE7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBhbmltYXRpb24ncyBwbGF5YmFjayBzcGVlZC4gMSBpcyBub3JtYWwgcGxheWJhY2sgc3BlZWQuXG4gICAgICogISN6aCDmkq3mlL7pgJ/njofjgIJcbiAgICAgKiBAcHJvcGVydHkgc3BlZWRcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBkZWZhdWx0OiAxLjBcbiAgICAgKi9cbiAgICB0aGlzLnNwZWVkID0gMTtcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBXcmFwcGluZyBtb2RlIG9mIHRoZSBwbGF5aW5nIGFuaW1hdGlvbi5cbiAgICAgKiBOb3RpY2UgOiBkeW5hbWljIGNoYW5nZSB3cmFwTW9kZSB3aWxsIHJlc2V0IHRpbWUgYW5kIHJlcGVhdENvdW50IHByb3BlcnR5XG4gICAgICogISN6aFxuICAgICAqIOWKqOeUu+W+queOr+aWueW8j+OAglxuICAgICAqIOmcgOimgeazqOaEj+eahOaYr++8jOWKqOaAgeS/ruaUuSB3cmFwTW9kZSDml7bvvIzkvJrph43nva4gdGltZSDku6Xlj4ogcmVwZWF0Q291bnRcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB3cmFwTW9kZVxuICAgICAqIEB0eXBlIHtXcmFwTW9kZX1cbiAgICAgKiBAZGVmYXVsdDogV3JhcE1vZGUuTm9ybWFsXG4gICAgICovXG4gICAgdGhpcy53cmFwTW9kZSA9IFdyYXBNb2RlLk5vcm1hbDtcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGN1cnJlbnQgdGltZSBvZiB0aGlzIGFuaW1hdGlvbiBpbiBzZWNvbmRzLlxuICAgICAqICEjemgg5Yqo55S75b2T5YmN55qE5pe26Ze077yM56eS44CCXG4gICAgICogQHByb3BlcnR5IHRpbWVcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IDBcbiAgICAgKi9cbiAgICB0aGlzLnRpbWUgPSAwO1xuXG4gICAgLy8gQW5pbWF0aW9uIGFzIGV2ZW50IHRhcmdldFxuICAgIHRoaXMuX3RhcmdldCA9IG51bGw7XG4gICAgdGhpcy5fbGFzdGZyYW1lRXZlbnRPbiA9IGZhbHNlO1xuICAgIHRoaXMuZW1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gYXJncy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0QW5pbWF0aW9uTWFuYWdlcigpLnB1c2hEZWxheUV2ZW50KHRoaXMsICdfZW1pdCcsIGFyZ3MpO1xuICAgIH07XG59XG5qcy5leHRlbmQoQW5pbWF0aW9uU3RhdGUsIFBsYXlhYmxlKTtcblxudmFyIHByb3RvID0gQW5pbWF0aW9uU3RhdGUucHJvdG90eXBlO1xuXG5wcm90by5fZW1pdCA9IGZ1bmN0aW9uICh0eXBlLCBzdGF0ZSkge1xuICAgIGlmICh0aGlzLl90YXJnZXQgJiYgdGhpcy5fdGFyZ2V0LmlzVmFsaWQpIHtcbiAgICAgICAgdGhpcy5fdGFyZ2V0LmVtaXQodHlwZSwgdHlwZSwgc3RhdGUpO1xuICAgIH1cbn07XG5cbnByb3RvLm9uID0gZnVuY3Rpb24gKHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQpIHtcbiAgICBpZiAodGhpcy5fdGFyZ2V0ICYmIHRoaXMuX3RhcmdldC5pc1ZhbGlkKSB7XG4gICAgICAgIGlmICh0eXBlID09PSAnbGFzdGZyYW1lJykge1xuICAgICAgICAgICAgdGhpcy5fbGFzdGZyYW1lRXZlbnRPbiA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3RhcmdldC5vbih0eXBlLCBjYWxsYmFjaywgdGFyZ2V0KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn07XG5cbnByb3RvLm9uY2UgPSBmdW5jdGlvbiAodHlwZSwgY2FsbGJhY2ssIHRhcmdldCkge1xuICAgIGlmICh0aGlzLl90YXJnZXQgJiYgdGhpcy5fdGFyZ2V0LmlzVmFsaWQpIHtcbiAgICAgICAgaWYgKHR5cGUgPT09ICdsYXN0ZnJhbWUnKSB7XG4gICAgICAgICAgICB0aGlzLl9sYXN0ZnJhbWVFdmVudE9uID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHJldHVybiB0aGlzLl90YXJnZXQub25jZSh0eXBlLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGFyZ2V0LCBldmVudCk7XG4gICAgICAgICAgICBzZWxmLl9sYXN0ZnJhbWVFdmVudE9uID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufTtcblxucHJvdG8ub2ZmID0gZnVuY3Rpb24gKHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQpIHtcbiAgICBpZiAodGhpcy5fdGFyZ2V0ICYmIHRoaXMuX3RhcmdldC5pc1ZhbGlkKSB7XG4gICAgICAgIGlmICh0eXBlID09PSAnbGFzdGZyYW1lJykge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl90YXJnZXQuaGFzRXZlbnRMaXN0ZW5lcih0eXBlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RmcmFtZUV2ZW50T24gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl90YXJnZXQub2ZmKHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQpO1xuICAgIH1cbn07XG5cbnByb3RvLl9zZXRFdmVudFRhcmdldCA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICB0aGlzLl90YXJnZXQgPSB0YXJnZXQ7XG59O1xuXG5wcm90by5vblBsYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gcmVwbGF5XG4gICAgdGhpcy5zZXRUaW1lKDApO1xuICAgIHRoaXMuX2RlbGF5VGltZSA9IHRoaXMuX2RlbGF5O1xuICAgIFxuICAgIGNjLmRpcmVjdG9yLmdldEFuaW1hdGlvbk1hbmFnZXIoKS5hZGRBbmltYXRpb24odGhpcyk7XG5cbiAgICBpZiAodGhpcy5hbmltYXRvcikge1xuICAgICAgICB0aGlzLmFuaW1hdG9yLmFkZEFuaW1hdGlvbih0aGlzKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5lbWl0KCdwbGF5JywgdGhpcyk7XG59O1xuXG5wcm90by5vblN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmlzUGF1c2VkKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmdldEFuaW1hdGlvbk1hbmFnZXIoKS5yZW1vdmVBbmltYXRpb24odGhpcyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYW5pbWF0b3IpIHtcbiAgICAgICAgdGhpcy5hbmltYXRvci5yZW1vdmVBbmltYXRpb24odGhpcyk7XG4gICAgfVxuXG4gICAgdGhpcy5lbWl0KCdzdG9wJywgdGhpcyk7XG59O1xuXG5wcm90by5vblJlc3VtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBjYy5kaXJlY3Rvci5nZXRBbmltYXRpb25NYW5hZ2VyKCkuYWRkQW5pbWF0aW9uKHRoaXMpO1xuICAgIHRoaXMuZW1pdCgncmVzdW1lJywgdGhpcyk7XG59O1xuXG5wcm90by5vblBhdXNlID0gZnVuY3Rpb24gKCkge1xuICAgIGNjLmRpcmVjdG9yLmdldEFuaW1hdGlvbk1hbmFnZXIoKS5yZW1vdmVBbmltYXRpb24odGhpcyk7XG4gICAgdGhpcy5lbWl0KCdwYXVzZScsIHRoaXMpO1xufTtcblxucHJvdG8uc2V0VGltZSA9IGZ1bmN0aW9uICh0aW1lKSB7XG4gICAgdGhpcy5fY3VycmVudEZyYW1lUGxheWVkID0gZmFsc2U7XG4gICAgdGhpcy50aW1lID0gdGltZSB8fCAwO1xuXG4gICAgdmFyIGN1cnZlcyA9IHRoaXMuY3VydmVzO1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gY3VydmVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICB2YXIgY3VydmUgPSBjdXJ2ZXNbaV07XG4gICAgICAgIGlmIChjdXJ2ZS5vblRpbWVDaGFuZ2VkTWFudWFsbHkpIHtcbiAgICAgICAgICAgIGN1cnZlLm9uVGltZUNoYW5nZWRNYW51YWxseSh0aW1lLCB0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmZ1bmN0aW9uIHByb2Nlc3MgKCkge1xuICAgIC8vIHNhbXBsZVxuICAgIHZhciBpbmZvID0gdGhpcy5zYW1wbGUoKTtcblxuICAgIGlmICh0aGlzLl9sYXN0ZnJhbWVFdmVudE9uKSB7XG4gICAgICAgIHZhciBsYXN0SW5mbztcbiAgICAgICAgaWYgKCF0aGlzLl9sYXN0V3JhcHBlZEluZm8pIHtcbiAgICAgICAgICAgIGxhc3RJbmZvID0gdGhpcy5fbGFzdFdyYXBwZWRJbmZvID0gbmV3IFdyYXBwZWRJbmZvKGluZm8pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGFzdEluZm8gPSB0aGlzLl9sYXN0V3JhcHBlZEluZm87XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5yZXBlYXRDb3VudCA+IDEgJiYgKChpbmZvLml0ZXJhdGlvbnMgfCAwKSA+IChsYXN0SW5mby5pdGVyYXRpb25zIHwgMCkpKSB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2xhc3RmcmFtZScsIHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGFzdEluZm8uc2V0KGluZm8pO1xuICAgIH1cblxuICAgIGlmIChpbmZvLnN0b3BwZWQpIHtcbiAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgIHRoaXMuZW1pdCgnZmluaXNoZWQnLCB0aGlzKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNpbXBsZVByb2Nlc3MgKCkge1xuICAgIHZhciB0aW1lID0gdGhpcy50aW1lO1xuICAgIHZhciBkdXJhdGlvbiA9IHRoaXMuZHVyYXRpb247XG5cbiAgICBpZiAodGltZSA+IGR1cmF0aW9uKSB7XG4gICAgICAgIHRpbWUgPSB0aW1lICUgZHVyYXRpb247XG4gICAgICAgIGlmICh0aW1lID09PSAwKSB0aW1lID0gZHVyYXRpb247XG4gICAgfVxuICAgIGVsc2UgaWYgKHRpbWUgPCAwKSB7XG4gICAgICAgIHRpbWUgPSB0aW1lICUgZHVyYXRpb247XG4gICAgICAgIGlmICh0aW1lICE9PSAwKSB0aW1lICs9IGR1cmF0aW9uO1xuICAgIH1cblxuICAgIHZhciByYXRpbyA9IHRpbWUgLyBkdXJhdGlvbjtcblxuICAgIHZhciBjdXJ2ZXMgPSB0aGlzLmN1cnZlcztcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY3VydmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHZhciBjdXJ2ZSA9IGN1cnZlc1tpXTtcbiAgICAgICAgY3VydmUuc2FtcGxlKHRpbWUsIHJhdGlvLCB0aGlzKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fbGFzdGZyYW1lRXZlbnRPbikge1xuICAgICAgICBpZiAodGhpcy5fbGFzdEl0ZXJhdGlvbnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fbGFzdEl0ZXJhdGlvbnMgPSByYXRpbztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgodGhpcy50aW1lID4gMCAmJiB0aGlzLl9sYXN0SXRlcmF0aW9ucyA+IHJhdGlvKSB8fCAodGhpcy50aW1lIDwgMCAmJiB0aGlzLl9sYXN0SXRlcmF0aW9ucyA8IHJhdGlvKSkge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdsYXN0ZnJhbWUnLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xhc3RJdGVyYXRpb25zID0gcmF0aW87XG4gICAgfVxufVxuXG5wcm90by51cGRhdGUgPSBmdW5jdGlvbiAoZGVsdGEpIHtcbiAgICAvLyBjYWxjdWxhdGUgZGVsYXkgdGltZVxuXG4gICAgaWYgKHRoaXMuX2RlbGF5VGltZSA+IDApIHtcbiAgICAgICAgdGhpcy5fZGVsYXlUaW1lIC09IGRlbHRhO1xuICAgICAgICBpZiAodGhpcy5fZGVsYXlUaW1lID4gMCkge1xuICAgICAgICAgICAgLy8gc3RpbGwgd2FpdGluZ1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gbWFrZSBmaXJzdCBmcmFtZSBwZXJmZWN0XG5cbiAgICAvL3ZhciBwbGF5UGVyZmVjdEZpcnN0RnJhbWUgPSAodGhpcy50aW1lID09PSAwKTtcbiAgICBpZiAodGhpcy5fY3VycmVudEZyYW1lUGxheWVkKSB7XG4gICAgICAgIHRoaXMudGltZSArPSAoZGVsdGEgKiB0aGlzLnNwZWVkKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRGcmFtZVBsYXllZCA9IHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5fcHJvY2VzcygpO1xufTtcblxucHJvdG8uX25lZWRSZXZlcnMgPSBmdW5jdGlvbiAoY3VycmVudEl0ZXJhdGlvbnMpIHtcbiAgICB2YXIgd3JhcE1vZGUgPSB0aGlzLndyYXBNb2RlO1xuICAgIHZhciBuZWVkUmV2ZXJzID0gZmFsc2U7XG5cbiAgICBpZiAoKHdyYXBNb2RlICYgV3JhcE1vZGVNYXNrLlBpbmdQb25nKSA9PT0gV3JhcE1vZGVNYXNrLlBpbmdQb25nKSB7XG4gICAgICAgIHZhciBpc0VuZCA9IGN1cnJlbnRJdGVyYXRpb25zIC0gKGN1cnJlbnRJdGVyYXRpb25zIHwgMCkgPT09IDA7XG4gICAgICAgIGlmIChpc0VuZCAmJiAoY3VycmVudEl0ZXJhdGlvbnMgPiAwKSkge1xuICAgICAgICAgICAgY3VycmVudEl0ZXJhdGlvbnMgLT0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpc09kZEl0ZXJhdGlvbiA9IGN1cnJlbnRJdGVyYXRpb25zICYgMTtcbiAgICAgICAgaWYgKGlzT2RkSXRlcmF0aW9uKSB7XG4gICAgICAgICAgICBuZWVkUmV2ZXJzID0gIW5lZWRSZXZlcnM7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKCh3cmFwTW9kZSAmIFdyYXBNb2RlTWFzay5SZXZlcnNlKSA9PT0gV3JhcE1vZGVNYXNrLlJldmVyc2UpIHtcbiAgICAgICAgbmVlZFJldmVycyA9ICFuZWVkUmV2ZXJzO1xuICAgIH1cbiAgICByZXR1cm4gbmVlZFJldmVycztcbn07XG5cbnByb3RvLmdldFdyYXBwZWRJbmZvID0gZnVuY3Rpb24gKHRpbWUsIGluZm8pIHtcbiAgICBpbmZvID0gaW5mbyB8fCBuZXcgV3JhcHBlZEluZm8oKTtcbiAgICBcbiAgICB2YXIgc3RvcHBlZCA9IGZhbHNlO1xuICAgIHZhciBkdXJhdGlvbiA9IHRoaXMuZHVyYXRpb247XG4gICAgdmFyIHJlcGVhdENvdW50ID0gdGhpcy5yZXBlYXRDb3VudDtcblxuICAgIHZhciBjdXJyZW50SXRlcmF0aW9ucyA9IHRpbWUgPiAwID8gKHRpbWUgLyBkdXJhdGlvbikgOiAtKHRpbWUgLyBkdXJhdGlvbik7XG4gICAgaWYgKGN1cnJlbnRJdGVyYXRpb25zID49IHJlcGVhdENvdW50KSB7XG4gICAgICAgIGN1cnJlbnRJdGVyYXRpb25zID0gcmVwZWF0Q291bnQ7XG5cbiAgICAgICAgc3RvcHBlZCA9IHRydWU7XG4gICAgICAgIHZhciB0ZW1wUmF0aW8gPSByZXBlYXRDb3VudCAtIChyZXBlYXRDb3VudCB8IDApO1xuICAgICAgICBpZiAodGVtcFJhdGlvID09PSAwKSB7XG4gICAgICAgICAgICB0ZW1wUmF0aW8gPSAxOyAgLy8g5aaC5p6c5pKt5pS+6L+H77yM5Yqo55S75LiN5aSN5L2NXG4gICAgICAgIH1cbiAgICAgICAgdGltZSA9IHRlbXBSYXRpbyAqIGR1cmF0aW9uICogKHRpbWUgPiAwID8gMSA6IC0xKTtcbiAgICB9XG5cbiAgICBpZiAodGltZSA+IGR1cmF0aW9uKSB7XG4gICAgICAgIHZhciB0ZW1wVGltZSA9IHRpbWUgJSBkdXJhdGlvbjtcbiAgICAgICAgdGltZSA9IHRlbXBUaW1lID09PSAwID8gZHVyYXRpb24gOiB0ZW1wVGltZTtcbiAgICB9XG4gICAgZWxzZSBpZiAodGltZSA8IDApIHtcbiAgICAgICAgdGltZSA9IHRpbWUgJSBkdXJhdGlvbjtcbiAgICAgICAgaWYgKHRpbWUgIT09IDAgKSB0aW1lICs9IGR1cmF0aW9uO1xuICAgIH1cblxuICAgIHZhciBuZWVkUmV2ZXJzID0gZmFsc2U7XG4gICAgdmFyIHNob3VsZFdyYXAgPSB0aGlzLl93cmFwTW9kZSAmIFdyYXBNb2RlTWFzay5TaG91bGRXcmFwO1xuICAgIGlmIChzaG91bGRXcmFwKSB7XG4gICAgICAgIG5lZWRSZXZlcnMgPSB0aGlzLl9uZWVkUmV2ZXJzKGN1cnJlbnRJdGVyYXRpb25zKTtcbiAgICB9XG5cbiAgICB2YXIgZGlyZWN0aW9uID0gbmVlZFJldmVycyA/IC0xIDogMTtcbiAgICBpZiAodGhpcy5zcGVlZCA8IDApIHtcbiAgICAgICAgZGlyZWN0aW9uICo9IC0xO1xuICAgIH1cblxuICAgIC8vIGNhbGN1bGF0ZSB3cmFwcGVkIHRpbWVcbiAgICBpZiAoc2hvdWxkV3JhcCAmJiBuZWVkUmV2ZXJzKSB7XG4gICAgICAgIHRpbWUgPSBkdXJhdGlvbiAtIHRpbWU7XG4gICAgfVxuXG4gICAgaW5mby5yYXRpbyA9IHRpbWUgLyBkdXJhdGlvbjtcbiAgICBpbmZvLnRpbWUgPSB0aW1lO1xuICAgIGluZm8uZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgIGluZm8uc3RvcHBlZCA9IHN0b3BwZWQ7XG4gICAgaW5mby5pdGVyYXRpb25zID0gY3VycmVudEl0ZXJhdGlvbnM7XG5cbiAgICByZXR1cm4gaW5mbztcbn07XG5cbnByb3RvLnNhbXBsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaW5mbyA9IHRoaXMuZ2V0V3JhcHBlZEluZm8odGhpcy50aW1lLCB0aGlzLl93cmFwcGVkSW5mbyk7XG4gICAgdmFyIGN1cnZlcyA9IHRoaXMuY3VydmVzO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjdXJ2ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgdmFyIGN1cnZlID0gY3VydmVzW2ldO1xuICAgICAgICBjdXJ2ZS5zYW1wbGUoaW5mby50aW1lLCBpbmZvLnJhdGlvLCB0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW5mbztcbn07XG5cblxuLyoqXG4gKiAhI2VuIFRoZSBjbGlwIHRoYXQgaXMgYmVpbmcgcGxheWVkIGJ5IHRoaXMgYW5pbWF0aW9uIHN0YXRlLlxuICogISN6aCDmraTliqjnlLvnirbmgIHmraPlnKjmkq3mlL7nmoTliarovpHjgIJcbiAqIEBwcm9wZXJ0eSBjbGlwXG4gKiBAdHlwZSB7QW5pbWF0aW9uQ2xpcH1cbiAqIEBmaW5hbFxuICovXG5qcy5nZXQocHJvdG8sICdjbGlwJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9jbGlwO1xufSk7XG5cbi8qKlxuICogISNlbiBUaGUgbmFtZSBvZiB0aGUgcGxheWluZyBhbmltYXRpb24uXG4gKiAhI3poIOWKqOeUu+eahOWQjeWtl1xuICogQHByb3BlcnR5IG5hbWVcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAcmVhZE9ubHlcbiAqL1xuanMuZ2V0KHByb3RvLCAnbmFtZScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fbmFtZTtcbn0pO1xuXG5qcy5vYnNvbGV0ZShwcm90bywgJ0FuaW1hdGlvblN0YXRlLmxlbmd0aCcsICdkdXJhdGlvbicpO1xuXG5qcy5nZXRzZXQocHJvdG8sICdjdXJ2ZUxvYWRlZCcsXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJ2ZXMubGVuZ3RoID4gMDtcbiAgICB9LFxuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jdXJ2ZXMubGVuZ3RoID0gMDtcbiAgICB9XG4pO1xuXG5cbmpzLmdldHNldChwcm90bywgJ3dyYXBNb2RlJyxcbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93cmFwTW9kZTtcbiAgICB9LFxuICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB0aGlzLl93cmFwTW9kZSA9IHZhbHVlO1xuXG4gICAgICAgIGlmIChDQ19FRElUT1IpIHJldHVybjtcblxuICAgICAgICAvLyBkeW5hbWljIGNoYW5nZSB3cmFwTW9kZSB3aWxsIG5lZWQgcmVzZXQgdGltZSB0byAwXG4gICAgICAgIHRoaXMudGltZSA9IDA7XG5cbiAgICAgICAgaWYgKHZhbHVlICYgV3JhcE1vZGVNYXNrLkxvb3ApIHtcbiAgICAgICAgICAgIHRoaXMucmVwZWF0Q291bnQgPSBJbmZpbml0eTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVwZWF0Q291bnQgPSAxO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cbik7XG5cbmpzLmdldHNldChwcm90bywgJ3JlcGVhdENvdW50JyxcbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXBlYXRDb3VudDtcbiAgICB9LFxuICAgIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9yZXBlYXRDb3VudCA9IHZhbHVlO1xuICAgICAgICBcbiAgICAgICAgdmFyIHNob3VsZFdyYXAgPSB0aGlzLl93cmFwTW9kZSAmIFdyYXBNb2RlTWFzay5TaG91bGRXcmFwO1xuICAgICAgICB2YXIgcmV2ZXJzZSA9ICh0aGlzLndyYXBNb2RlICYgV3JhcE1vZGVNYXNrLlJldmVyc2UpID09PSBXcmFwTW9kZU1hc2suUmV2ZXJzZTtcbiAgICAgICAgaWYgKHZhbHVlID09PSBJbmZpbml0eSAmJiAhc2hvdWxkV3JhcCAmJiAhcmV2ZXJzZSkge1xuICAgICAgICAgICAgdGhpcy5fcHJvY2VzcyA9IHNpbXBsZVByb2Nlc3M7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9wcm9jZXNzID0gcHJvY2VzcztcbiAgICAgICAgfVxuICAgIH1cbik7XG5cbmpzLmdldHNldChwcm90bywgJ2RlbGF5JywgXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVsYXk7XG4gICAgfSxcbiAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fZGVsYXlUaW1lID0gdGhpcy5fZGVsYXkgPSB2YWx1ZTtcbiAgICB9XG4pO1xuXG5cbmNjLkFuaW1hdGlvblN0YXRlID0gbW9kdWxlLmV4cG9ydHMgPSBBbmltYXRpb25TdGF0ZTtcbiJdfQ==