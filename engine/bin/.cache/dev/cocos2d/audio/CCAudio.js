
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/audio/CCAudio.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var EventTarget = require('../core/event/event-target');

var sys = require('../core/platform/CCSys');

var LoadMode = require('../core/assets/CCAudioClip').LoadMode;

var touchBinded = false;
var touchPlayList = [//{ instance: Audio, offset: 0, audio: audio }
];

var Audio = function Audio(src) {
  EventTarget.call(this);
  this._src = src;
  this._element = null;
  this.id = 0;
  this._volume = 1;
  this._loop = false;
  this._nextTime = 0; // playback position to set

  this._state = Audio.State.INITIALZING;

  this._onended = function () {
    this._state = Audio.State.STOPPED;
    this.emit('ended');
  }.bind(this);
};

cc.js.extend(Audio, EventTarget);
/**
 * !#en Audio state.
 * !#zh 声音播放状态
 * @enum audioEngine.AudioState
 * @memberof cc
 */
// TODO - At present, the state is mixed with two states of users and systems, and it is best to split into two types. A "loading" should also be added to the system state.

Audio.State = {
  /**
   * @property {Number} ERROR
   */
  ERROR: -1,

  /**
   * @property {Number} INITIALZING
   */
  INITIALZING: 0,

  /**
   * @property {Number} PLAYING
   */
  PLAYING: 1,

  /**
   * @property {Number} PAUSED
   */
  PAUSED: 2,

  /**
   * @property {Number} STOPPED
   */
  STOPPED: 3
};

(function (proto) {
  proto._bindEnded = function (callback) {
    callback = callback || this._onended;
    var elem = this._element;

    if (this._src && elem instanceof HTMLAudioElement) {
      elem.addEventListener('ended', callback);
    } else {
      elem.onended = callback;
    }
  };

  proto._unbindEnded = function () {
    var elem = this._element;

    if (elem instanceof HTMLAudioElement) {
      elem.removeEventListener('ended', this._onended);
    } else if (elem) {
      elem.onended = null;
    }
  }; // proto.mount = function (elem) {
  //     if (CC_DEBUG) {
  //         cc.warn('Audio.mount(value) is deprecated. Please use Audio._onLoaded().');
  //     }
  // };


  proto._onLoaded = function () {
    this._createElement();

    this.setVolume(this._volume);
    this.setLoop(this._loop);

    if (this._nextTime !== 0) {
      this.setCurrentTime(this._nextTime);
    }

    if (this.getState() === Audio.State.PLAYING) {
      this.play();
    } else {
      this._state = Audio.State.INITIALZING;
    }
  };

  proto._createElement = function () {
    var elem = this._src._nativeAsset;

    if (elem instanceof HTMLAudioElement) {
      // Reuse dom audio element
      if (!this._element) {
        this._element = document.createElement('audio');
      }

      this._element.src = elem.src;
    } else {
      this._element = new WebAudioElement(elem, this);
    }
  };

  proto.play = function () {
    // marked as playing so it will playOnLoad
    this._state = Audio.State.PLAYING;

    if (!this._element) {
      return;
    }

    this._bindEnded();

    this._element.play();

    this._touchToPlay();
  };

  proto._touchToPlay = function () {
    if (this._src && this._src.loadMode === LoadMode.DOM_AUDIO && this._element.paused) {
      touchPlayList.push({
        instance: this,
        offset: 0,
        audio: this._element
      });
    }

    if (touchBinded) return;
    touchBinded = true;
    var touchEventName = 'ontouchend' in window ? 'touchend' : 'mousedown'; // Listen to the touchstart body event and play the audio when necessary.

    cc.game.canvas.addEventListener(touchEventName, function () {
      var item;

      while (item = touchPlayList.pop()) {
        item.audio.play(item.offset);
      }
    });
  };

  proto.destroy = function () {
    this._element = null;
  };

  proto.pause = function () {
    if (!this._element || this.getState() !== Audio.State.PLAYING) return;

    this._unbindEnded();

    this._element.pause();

    this._state = Audio.State.PAUSED;
  };

  proto.resume = function () {
    if (!this._element || this.getState() !== Audio.State.PAUSED) return;

    this._bindEnded();

    this._element.play();

    this._state = Audio.State.PLAYING;
  };

  proto.stop = function () {
    if (!this._element) return;

    this._element.pause();

    try {
      this._element.currentTime = 0;
    } catch (error) {} // remove touchPlayList


    for (var i = 0; i < touchPlayList.length; i++) {
      if (touchPlayList[i].instance === this) {
        touchPlayList.splice(i, 1);
        break;
      }
    }

    this._unbindEnded();

    this.emit('stop');
    this._state = Audio.State.STOPPED;
  };

  proto.setLoop = function (loop) {
    this._loop = loop;

    if (this._element) {
      this._element.loop = loop;
    }
  };

  proto.getLoop = function () {
    return this._loop;
  };

  proto.setVolume = function (num) {
    this._volume = num;

    if (this._element) {
      this._element.volume = num;
    }
  };

  proto.getVolume = function () {
    return this._volume;
  };

  proto.setCurrentTime = function (num) {
    if (this._element) {
      this._nextTime = 0;
    } else {
      this._nextTime = num;
      return;
    } // setCurrentTime would fire 'ended' event
    // so we need to change the callback to rebind ended callback after setCurrentTime


    this._unbindEnded();

    this._bindEnded(function () {
      this._bindEnded();
    }.bind(this));

    try {
      this._element.currentTime = num;
    } catch (err) {
      var _element = this._element;

      if (_element.addEventListener) {
        var func = function func() {
          _element.removeEventListener('loadedmetadata', func);

          _element.currentTime = num;
        };

        _element.addEventListener('loadedmetadata', func);
      }
    }
  };

  proto.getCurrentTime = function () {
    return this._element ? this._element.currentTime : 0;
  };

  proto.getDuration = function () {
    return this._element ? this._element.duration : 0;
  };

  proto.getState = function () {
    // HACK: in some browser, audio may not fire 'ended' event
    // so we need to force updating the Audio state
    this._forceUpdatingState();

    return this._state;
  };

  proto._forceUpdatingState = function () {
    var elem = this._element;

    if (elem) {
      if (Audio.State.PLAYING === this._state && elem.paused) {
        this._state = Audio.State.STOPPED;
      } else if (Audio.State.STOPPED === this._state && !elem.paused) {
        this._state = Audio.State.PLAYING;
      }
    }
  };

  Object.defineProperty(proto, 'src', {
    get: function get() {
      return this._src;
    },
    set: function set(clip) {
      this._unbindEnded();

      if (clip) {
        this._src = clip;

        if (clip.loaded) {
          this._onLoaded();
        } else {
          var self = this;
          clip.once('load', function () {
            if (clip === self._src) {
              self._onLoaded();
            }
          });
          cc.loader.load({
            url: clip.nativeUrl,
            // For audio, we should skip loader otherwise it will load a new audioClip.
            skips: ['Loader']
          }, function (err, audioNativeAsset) {
            if (err) {
              cc.error(err);
              return;
            }

            if (!clip.loaded) {
              clip._nativeAsset = audioNativeAsset;
            }
          });
        }
      } else {
        this._src = null;

        if (this._element instanceof HTMLAudioElement) {
          this._element.src = '';
        } else {
          this._element = null;
        }

        this._state = Audio.State.INITIALZING;
      }

      return clip;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(proto, 'paused', {
    get: function get() {
      return this._element ? this._element.paused : true;
    },
    enumerable: true,
    configurable: true
  }); // setFinishCallback
})(Audio.prototype); // TIME_CONSTANT is used as an argument of setTargetAtTime interface
// TIME_CONSTANT need to be a positive number on Edge and Baidu browser
// TIME_CONSTANT need to be 0 by default, or may fail to set volume at the very beginning of playing audio


var TIME_CONSTANT;

if (cc.sys.browserType === cc.sys.BROWSER_TYPE_EDGE || cc.sys.browserType === cc.sys.BROWSER_TYPE_BAIDU || cc.sys.browserType === cc.sys.BROWSER_TYPE_UC) {
  TIME_CONSTANT = 0.01;
} else {
  TIME_CONSTANT = 0;
} // Encapsulated WebAudio interface


var WebAudioElement = function WebAudioElement(buffer, audio) {
  this._audio = audio;
  this._context = sys.__audioSupport.context;
  this._buffer = buffer;
  this._gainObj = this._context['createGain']();
  this.volume = 1;

  this._gainObj['connect'](this._context['destination']);

  this._loop = false; // The time stamp on the audio time axis when the recording begins to play.

  this._startTime = -1; // Record the currently playing 'Source'

  this._currentSource = null; // Record the time has been played

  this.playedLength = 0;
  this._currentTimer = null;

  this._endCallback = function () {
    if (this.onended) {
      this.onended(this);
    }
  }.bind(this);
};

(function (proto) {
  proto.play = function (offset) {
    // If repeat play, you need to stop before an audio
    if (this._currentSource && !this.paused) {
      this._currentSource.onended = null;

      this._currentSource.stop(0);

      this.playedLength = 0;
    }

    var audio = this._context["createBufferSource"]();

    audio.buffer = this._buffer;
    audio["connect"](this._gainObj);
    audio.loop = this._loop;
    this._startTime = this._context.currentTime;
    offset = offset || this.playedLength;

    if (offset) {
      this._startTime -= offset;
    }

    var duration = this._buffer.duration;
    var startTime = offset;
    var endTime;

    if (this._loop) {
      if (audio.start) audio.start(0, startTime);else if (audio["notoGrainOn"]) audio["noteGrainOn"](0, startTime);else audio["noteOn"](0, startTime);
    } else {
      endTime = duration - offset;
      if (audio.start) audio.start(0, startTime, endTime);else if (audio["noteGrainOn"]) audio["noteGrainOn"](0, startTime, endTime);else audio["noteOn"](0, startTime, endTime);
    }

    this._currentSource = audio;
    audio.onended = this._endCallback; // If the current audio context time stamp is 0 and audio context state is suspended
    // There may be a need to touch events before you can actually start playing audio

    if ((!audio.context.state || audio.context.state === "suspended") && this._context.currentTime === 0) {
      var self = this;
      clearTimeout(this._currentTimer);
      this._currentTimer = setTimeout(function () {
        if (self._context.currentTime === 0) {
          touchPlayList.push({
            instance: self._audio,
            offset: offset,
            audio: self
          });
        }
      }, 10);
    }
  };

  proto.pause = function () {
    clearTimeout(this._currentTimer);
    if (this.paused) return; // Record the time the current has been played

    this.playedLength = this._context.currentTime - this._startTime; // If more than the duration of the audio, Need to take the remainder

    this.playedLength %= this._buffer.duration;
    var audio = this._currentSource;
    this._currentSource = null;
    this._startTime = -1;
    if (audio) audio.stop(0);
  };

  Object.defineProperty(proto, 'paused', {
    get: function get() {
      // If the current audio is a loop, paused is false
      if (this._currentSource && this._currentSource.loop) return false; // startTime default is -1

      if (this._startTime === -1) return true; // Current time -  Start playing time > Audio duration

      return this._context.currentTime - this._startTime > this._buffer.duration;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(proto, 'loop', {
    get: function get() {
      return this._loop;
    },
    set: function set(bool) {
      if (this._currentSource) this._currentSource.loop = bool;
      return this._loop = bool;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(proto, 'volume', {
    get: function get() {
      return this._volume;
    },
    set: function set(num) {
      this._volume = num; // https://www.chromestatus.com/features/5287995770929152

      if (this._gainObj.gain.setTargetAtTime) {
        try {
          this._gainObj.gain.setTargetAtTime(num, this._context.currentTime, TIME_CONSTANT);
        } catch (e) {
          // Some other unknown browsers may crash if TIME_CONSTANT is 0
          this._gainObj.gain.setTargetAtTime(num, this._context.currentTime, 0.01);
        }
      } else {
        this._gainObj.gain.value = num;
      }

      if (sys.os === sys.OS_IOS && !this.paused && this._currentSource) {
        // IOS must be stop webAudio
        this._currentSource.onended = null;
        this.pause();
        this.play();
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(proto, 'currentTime', {
    get: function get() {
      if (this.paused) {
        return this.playedLength;
      } // Record the time the current has been played


      this.playedLength = this._context.currentTime - this._startTime; // If more than the duration of the audio, Need to take the remainder

      this.playedLength %= this._buffer.duration;
      return this.playedLength;
    },
    set: function set(num) {
      if (!this.paused) {
        this.pause();
        this.playedLength = num;
        this.play();
      } else {
        this.playedLength = num;
      }

      return num;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(proto, 'duration', {
    get: function get() {
      return this._buffer.duration;
    },
    enumerable: true,
    configurable: true
  });
})(WebAudioElement.prototype);

module.exports = cc.Audio = Audio;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDQXVkaW8uanMiXSwibmFtZXMiOlsiRXZlbnRUYXJnZXQiLCJyZXF1aXJlIiwic3lzIiwiTG9hZE1vZGUiLCJ0b3VjaEJpbmRlZCIsInRvdWNoUGxheUxpc3QiLCJBdWRpbyIsInNyYyIsImNhbGwiLCJfc3JjIiwiX2VsZW1lbnQiLCJpZCIsIl92b2x1bWUiLCJfbG9vcCIsIl9uZXh0VGltZSIsIl9zdGF0ZSIsIlN0YXRlIiwiSU5JVElBTFpJTkciLCJfb25lbmRlZCIsIlNUT1BQRUQiLCJlbWl0IiwiYmluZCIsImNjIiwianMiLCJleHRlbmQiLCJFUlJPUiIsIlBMQVlJTkciLCJQQVVTRUQiLCJwcm90byIsIl9iaW5kRW5kZWQiLCJjYWxsYmFjayIsImVsZW0iLCJIVE1MQXVkaW9FbGVtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsIm9uZW5kZWQiLCJfdW5iaW5kRW5kZWQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiX29uTG9hZGVkIiwiX2NyZWF0ZUVsZW1lbnQiLCJzZXRWb2x1bWUiLCJzZXRMb29wIiwic2V0Q3VycmVudFRpbWUiLCJnZXRTdGF0ZSIsInBsYXkiLCJfbmF0aXZlQXNzZXQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJXZWJBdWRpb0VsZW1lbnQiLCJfdG91Y2hUb1BsYXkiLCJsb2FkTW9kZSIsIkRPTV9BVURJTyIsInBhdXNlZCIsInB1c2giLCJpbnN0YW5jZSIsIm9mZnNldCIsImF1ZGlvIiwidG91Y2hFdmVudE5hbWUiLCJ3aW5kb3ciLCJnYW1lIiwiY2FudmFzIiwiaXRlbSIsInBvcCIsImRlc3Ryb3kiLCJwYXVzZSIsInJlc3VtZSIsInN0b3AiLCJjdXJyZW50VGltZSIsImVycm9yIiwiaSIsImxlbmd0aCIsInNwbGljZSIsImxvb3AiLCJnZXRMb29wIiwibnVtIiwidm9sdW1lIiwiZ2V0Vm9sdW1lIiwiZXJyIiwiZnVuYyIsImdldEN1cnJlbnRUaW1lIiwiZ2V0RHVyYXRpb24iLCJkdXJhdGlvbiIsIl9mb3JjZVVwZGF0aW5nU3RhdGUiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldCIsInNldCIsImNsaXAiLCJsb2FkZWQiLCJzZWxmIiwib25jZSIsImxvYWRlciIsImxvYWQiLCJ1cmwiLCJuYXRpdmVVcmwiLCJza2lwcyIsImF1ZGlvTmF0aXZlQXNzZXQiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwicHJvdG90eXBlIiwiVElNRV9DT05TVEFOVCIsImJyb3dzZXJUeXBlIiwiQlJPV1NFUl9UWVBFX0VER0UiLCJCUk9XU0VSX1RZUEVfQkFJRFUiLCJCUk9XU0VSX1RZUEVfVUMiLCJidWZmZXIiLCJfYXVkaW8iLCJfY29udGV4dCIsIl9fYXVkaW9TdXBwb3J0IiwiY29udGV4dCIsIl9idWZmZXIiLCJfZ2Fpbk9iaiIsIl9zdGFydFRpbWUiLCJfY3VycmVudFNvdXJjZSIsInBsYXllZExlbmd0aCIsIl9jdXJyZW50VGltZXIiLCJfZW5kQ2FsbGJhY2siLCJzdGFydFRpbWUiLCJlbmRUaW1lIiwic3RhcnQiLCJzdGF0ZSIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJib29sIiwiZ2FpbiIsInNldFRhcmdldEF0VGltZSIsImUiLCJ2YWx1ZSIsIm9zIiwiT1NfSU9TIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCQSxJQUFNQSxXQUFXLEdBQUdDLE9BQU8sQ0FBQyw0QkFBRCxDQUEzQjs7QUFDQSxJQUFNQyxHQUFHLEdBQUdELE9BQU8sQ0FBQyx3QkFBRCxDQUFuQjs7QUFDQSxJQUFNRSxRQUFRLEdBQUdGLE9BQU8sQ0FBQyw0QkFBRCxDQUFQLENBQXNDRSxRQUF2RDs7QUFFQSxJQUFJQyxXQUFXLEdBQUcsS0FBbEI7QUFDQSxJQUFJQyxhQUFhLEdBQUcsQ0FDaEI7QUFEZ0IsQ0FBcEI7O0FBSUEsSUFBSUMsS0FBSyxHQUFHLFNBQVJBLEtBQVEsQ0FBVUMsR0FBVixFQUFlO0FBQ3ZCUCxFQUFBQSxXQUFX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QUFJLENBQUMsS0FBS3RCLE1BQVYsRUFBa0I7QUFDZCxhQUFLWSxLQUFMO0FBQ0EsYUFBS2tELFlBQUwsR0FBb0J4QyxHQUFwQjtBQUNBLGFBQUs5QixJQUFMO0FBQ0gsT0FKRCxNQUlPO0FBQ0gsYUFBS3NFLFlBQUwsR0FBb0J4QyxHQUFwQjtBQUNIOztBQUNELGFBQU9BLEdBQVA7QUFDSCxLQXBCdUM7QUFxQnhDdUIsSUFBQUEsVUFBVSxFQUFFLElBckI0QjtBQXNCeENDLElBQUFBLFlBQVksRUFBRTtBQXRCMEIsR0FBNUM7QUF5QkFmLEVBQUFBLE1BQU0sQ0FBQ0MsY0FBUCxDQUFzQnZELEtBQXRCLEVBQTZCLFVBQTdCLEVBQXlDO0FBQ3JDd0QsSUFBQUEsR0FBRyxFQUFFLGVBQVk7QUFDYixhQUFPLEtBQUt5QixPQUFMLENBQWE3QixRQUFwQjtBQUNILEtBSG9DO0FBSXJDZ0IsSUFBQUEsVUFBVSxFQUFFLElBSnlCO0FBS3JDQyxJQUFBQSxZQUFZLEVBQUU7QUFMdUIsR0FBekM7QUFRSCxDQTFLRCxFQTBLR2xELGVBQWUsQ0FBQ21ELFNBMUtuQjs7QUE0S0ErQixNQUFNLENBQUNDLE9BQVAsR0FBaUI1RyxFQUFFLENBQUNoQixLQUFILEdBQVdBLEtBQTVCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMDgtMjAxMCBSaWNhcmRvIFF1ZXNhZGFcbiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxMiBjb2NvczJkLXgub3JnXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBFdmVudFRhcmdldCA9IHJlcXVpcmUoJy4uL2NvcmUvZXZlbnQvZXZlbnQtdGFyZ2V0Jyk7XG5jb25zdCBzeXMgPSByZXF1aXJlKCcuLi9jb3JlL3BsYXRmb3JtL0NDU3lzJyk7XG5jb25zdCBMb2FkTW9kZSA9IHJlcXVpcmUoJy4uL2NvcmUvYXNzZXRzL0NDQXVkaW9DbGlwJykuTG9hZE1vZGU7XG5cbmxldCB0b3VjaEJpbmRlZCA9IGZhbHNlO1xubGV0IHRvdWNoUGxheUxpc3QgPSBbXG4gICAgLy97IGluc3RhbmNlOiBBdWRpbywgb2Zmc2V0OiAwLCBhdWRpbzogYXVkaW8gfVxuXTtcblxubGV0IEF1ZGlvID0gZnVuY3Rpb24gKHNyYykge1xuICAgIEV2ZW50VGFyZ2V0LmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLl9zcmMgPSBzcmM7XG4gICAgdGhpcy5fZWxlbWVudCA9IG51bGw7XG4gICAgdGhpcy5pZCA9IDA7XG5cbiAgICB0aGlzLl92b2x1bWUgPSAxO1xuICAgIHRoaXMuX2xvb3AgPSBmYWxzZTtcbiAgICB0aGlzLl9uZXh0VGltZSA9IDA7ICAvLyBwbGF5YmFjayBwb3NpdGlvbiB0byBzZXRcblxuICAgIHRoaXMuX3N0YXRlID0gQXVkaW8uU3RhdGUuSU5JVElBTFpJTkc7XG5cbiAgICB0aGlzLl9vbmVuZGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9zdGF0ZSA9IEF1ZGlvLlN0YXRlLlNUT1BQRUQ7XG4gICAgICAgIHRoaXMuZW1pdCgnZW5kZWQnKTtcbiAgICB9LmJpbmQodGhpcyk7XG59O1xuXG5jYy5qcy5leHRlbmQoQXVkaW8sIEV2ZW50VGFyZ2V0KTtcblxuLyoqXG4gKiAhI2VuIEF1ZGlvIHN0YXRlLlxuICogISN6aCDlo7Dpn7Pmkq3mlL7nirbmgIFcbiAqIEBlbnVtIGF1ZGlvRW5naW5lLkF1ZGlvU3RhdGVcbiAqIEBtZW1iZXJvZiBjY1xuICovXG4vLyBUT0RPIC0gQXQgcHJlc2VudCwgdGhlIHN0YXRlIGlzIG1peGVkIHdpdGggdHdvIHN0YXRlcyBvZiB1c2VycyBhbmQgc3lzdGVtcywgYW5kIGl0IGlzIGJlc3QgdG8gc3BsaXQgaW50byB0d28gdHlwZXMuIEEgXCJsb2FkaW5nXCIgc2hvdWxkIGFsc28gYmUgYWRkZWQgdG8gdGhlIHN5c3RlbSBzdGF0ZS5cbkF1ZGlvLlN0YXRlID0ge1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBFUlJPUlxuICAgICAqL1xuICAgIEVSUk9SIDogLTEsXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IElOSVRJQUxaSU5HXG4gICAgICovXG4gICAgSU5JVElBTFpJTkc6IDAsXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFBMQVlJTkdcbiAgICAgKi9cbiAgICBQTEFZSU5HOiAxLFxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBQQVVTRURcbiAgICAgKi9cbiAgICBQQVVTRUQ6IDIsXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFNUT1BQRURcbiAgICAgKi9cbiAgICBTVE9QUEVEOiAzLFxufTtcblxuKGZ1bmN0aW9uIChwcm90bykge1xuXG4gICAgcHJvdG8uX2JpbmRFbmRlZCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrIHx8IHRoaXMuX29uZW5kZWQ7XG4gICAgICAgIGxldCBlbGVtID0gdGhpcy5fZWxlbWVudDtcbiAgICAgICAgaWYgKHRoaXMuX3NyYyAmJiAoZWxlbSBpbnN0YW5jZW9mIEhUTUxBdWRpb0VsZW1lbnQpKSB7XG4gICAgICAgICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgY2FsbGJhY2spO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlbS5vbmVuZGVkID0gY2FsbGJhY2s7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcHJvdG8uX3VuYmluZEVuZGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgZWxlbSA9IHRoaXMuX2VsZW1lbnQ7XG4gICAgICAgIGlmIChlbGVtIGluc3RhbmNlb2YgSFRNTEF1ZGlvRWxlbWVudCkge1xuICAgICAgICAgICAgZWxlbS5yZW1vdmVFdmVudExpc3RlbmVyKCdlbmRlZCcsIHRoaXMuX29uZW5kZWQpO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW0pIHtcbiAgICAgICAgICAgIGVsZW0ub25lbmRlZCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gcHJvdG8ubW91bnQgPSBmdW5jdGlvbiAoZWxlbSkge1xuICAgIC8vICAgICBpZiAoQ0NfREVCVUcpIHtcbiAgICAvLyAgICAgICAgIGNjLndhcm4oJ0F1ZGlvLm1vdW50KHZhbHVlKSBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIEF1ZGlvLl9vbkxvYWRlZCgpLicpO1xuICAgIC8vICAgICB9XG4gICAgLy8gfTtcblxuICAgIHByb3RvLl9vbkxvYWRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fY3JlYXRlRWxlbWVudCgpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5zZXRWb2x1bWUodGhpcy5fdm9sdW1lKTtcbiAgICAgICAgdGhpcy5zZXRMb29wKHRoaXMuX2xvb3ApO1xuICAgICAgICBpZiAodGhpcy5fbmV4dFRpbWUgIT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0Q3VycmVudFRpbWUodGhpcy5fbmV4dFRpbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmdldFN0YXRlKCkgPT09IEF1ZGlvLlN0YXRlLlBMQVlJTkcpIHtcbiAgICAgICAgICAgIHRoaXMucGxheSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBBdWRpby5TdGF0ZS5JTklUSUFMWklORztcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBwcm90by5fY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IGVsZW0gPSB0aGlzLl9zcmMuX25hdGl2ZUFzc2V0O1xuICAgICAgICBpZiAoZWxlbSBpbnN0YW5jZW9mIEhUTUxBdWRpb0VsZW1lbnQpIHtcbiAgICAgICAgICAgIC8vIFJldXNlIGRvbSBhdWRpbyBlbGVtZW50XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2VsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXVkaW8nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3JjID0gZWxlbS5zcmM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50ID0gbmV3IFdlYkF1ZGlvRWxlbWVudChlbGVtLCB0aGlzKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBwcm90by5wbGF5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBtYXJrZWQgYXMgcGxheWluZyBzbyBpdCB3aWxsIHBsYXlPbkxvYWRcbiAgICAgICAgdGhpcy5fc3RhdGUgPSBBdWRpby5TdGF0ZS5QTEFZSU5HO1xuXG4gICAgICAgIGlmICghdGhpcy5fZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fYmluZEVuZGVkKCk7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQucGxheSgpO1xuXG4gICAgICAgIHRoaXMuX3RvdWNoVG9QbGF5KCk7XG4gICAgfTtcblxuICAgIHByb3RvLl90b3VjaFRvUGxheSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3NyYyAmJiB0aGlzLl9zcmMubG9hZE1vZGUgPT09IExvYWRNb2RlLkRPTV9BVURJTyAmJlxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5wYXVzZWQpIHtcbiAgICAgICAgICAgIHRvdWNoUGxheUxpc3QucHVzaCh7IGluc3RhbmNlOiB0aGlzLCBvZmZzZXQ6IDAsIGF1ZGlvOiB0aGlzLl9lbGVtZW50IH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRvdWNoQmluZGVkKSByZXR1cm47XG4gICAgICAgIHRvdWNoQmluZGVkID0gdHJ1ZTtcblxuICAgICAgICBsZXQgdG91Y2hFdmVudE5hbWUgPSAoJ29udG91Y2hlbmQnIGluIHdpbmRvdykgPyAndG91Y2hlbmQnIDogJ21vdXNlZG93bic7XG4gICAgICAgIC8vIExpc3RlbiB0byB0aGUgdG91Y2hzdGFydCBib2R5IGV2ZW50IGFuZCBwbGF5IHRoZSBhdWRpbyB3aGVuIG5lY2Vzc2FyeS5cbiAgICAgICAgY2MuZ2FtZS5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcih0b3VjaEV2ZW50TmFtZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbGV0IGl0ZW07XG4gICAgICAgICAgICB3aGlsZSAoaXRlbSA9IHRvdWNoUGxheUxpc3QucG9wKCkpIHtcbiAgICAgICAgICAgICAgICBpdGVtLmF1ZGlvLnBsYXkoaXRlbS5vZmZzZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcHJvdG8uZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudCA9IG51bGw7XG4gICAgfTtcblxuICAgIHByb3RvLnBhdXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2VsZW1lbnQgfHwgdGhpcy5nZXRTdGF0ZSgpICE9PSBBdWRpby5TdGF0ZS5QTEFZSU5HKSByZXR1cm47XG4gICAgICAgIHRoaXMuX3VuYmluZEVuZGVkKCk7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQucGF1c2UoKTtcbiAgICAgICAgdGhpcy5fc3RhdGUgPSBBdWRpby5TdGF0ZS5QQVVTRUQ7XG4gICAgfTtcblxuICAgIHByb3RvLnJlc3VtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9lbGVtZW50IHx8IHRoaXMuZ2V0U3RhdGUoKSAhPT0gQXVkaW8uU3RhdGUuUEFVU0VEKSByZXR1cm47XG4gICAgICAgIHRoaXMuX2JpbmRFbmRlZCgpO1xuICAgICAgICB0aGlzLl9lbGVtZW50LnBsYXkoKTtcbiAgICAgICAgdGhpcy5fc3RhdGUgPSBBdWRpby5TdGF0ZS5QTEFZSU5HO1xuICAgIH07XG5cbiAgICBwcm90by5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2VsZW1lbnQpIHJldHVybjtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5wYXVzZSgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5jdXJyZW50VGltZSA9IDA7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxuICAgICAgICAvLyByZW1vdmUgdG91Y2hQbGF5TGlzdFxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvdWNoUGxheUxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0b3VjaFBsYXlMaXN0W2ldLmluc3RhbmNlID09PSB0aGlzKSB7XG4gICAgICAgICAgICAgICAgdG91Y2hQbGF5TGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdW5iaW5kRW5kZWQoKTtcbiAgICAgICAgdGhpcy5lbWl0KCdzdG9wJyk7XG4gICAgICAgIHRoaXMuX3N0YXRlID0gQXVkaW8uU3RhdGUuU1RPUFBFRDtcbiAgICB9O1xuXG4gICAgcHJvdG8uc2V0TG9vcCA9IGZ1bmN0aW9uIChsb29wKSB7XG4gICAgICAgIHRoaXMuX2xvb3AgPSBsb29wO1xuICAgICAgICBpZiAodGhpcy5fZWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5sb29wID0gbG9vcDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcHJvdG8uZ2V0TG9vcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvb3A7XG4gICAgfTtcblxuICAgIHByb3RvLnNldFZvbHVtZSA9IGZ1bmN0aW9uIChudW0pIHtcbiAgICAgICAgdGhpcy5fdm9sdW1lID0gbnVtO1xuICAgICAgICBpZiAodGhpcy5fZWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC52b2x1bWUgPSBudW07XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHByb3RvLmdldFZvbHVtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZvbHVtZTtcbiAgICB9O1xuXG4gICAgcHJvdG8uc2V0Q3VycmVudFRpbWUgPSBmdW5jdGlvbiAobnVtKSB7XG4gICAgICAgIGlmICh0aGlzLl9lbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9uZXh0VGltZSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9uZXh0VGltZSA9IG51bTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNldEN1cnJlbnRUaW1lIHdvdWxkIGZpcmUgJ2VuZGVkJyBldmVudFxuICAgICAgICAvLyBzbyB3ZSBuZWVkIHRvIGNoYW5nZSB0aGUgY2FsbGJhY2sgdG8gcmViaW5kIGVuZGVkIGNhbGxiYWNrIGFmdGVyIHNldEN1cnJlbnRUaW1lXG4gICAgICAgIHRoaXMuX3VuYmluZEVuZGVkKCk7XG4gICAgICAgIHRoaXMuX2JpbmRFbmRlZChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLl9iaW5kRW5kZWQoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5jdXJyZW50VGltZSA9IG51bTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBsZXQgX2VsZW1lbnQgPSB0aGlzLl9lbGVtZW50O1xuICAgICAgICAgICAgaWYgKF9lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICBsZXQgZnVuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgX2VsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZGVkbWV0YWRhdGEnLCBmdW5jKTtcbiAgICAgICAgICAgICAgICAgICAgX2VsZW1lbnQuY3VycmVudFRpbWUgPSBudW07XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBfZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdsb2FkZWRtZXRhZGF0YScsIGZ1bmMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIHByb3RvLmdldEN1cnJlbnRUaW1lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudCA/IHRoaXMuX2VsZW1lbnQuY3VycmVudFRpbWUgOiAwO1xuICAgIH07XG5cbiAgICBwcm90by5nZXREdXJhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQgPyB0aGlzLl9lbGVtZW50LmR1cmF0aW9uIDogMDtcbiAgICB9O1xuXG4gICAgcHJvdG8uZ2V0U3RhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIEhBQ0s6IGluIHNvbWUgYnJvd3NlciwgYXVkaW8gbWF5IG5vdCBmaXJlICdlbmRlZCcgZXZlbnRcbiAgICAgICAgLy8gc28gd2UgbmVlZCB0byBmb3JjZSB1cGRhdGluZyB0aGUgQXVkaW8gc3RhdGVcbiAgICAgICAgdGhpcy5fZm9yY2VVcGRhdGluZ1N0YXRlKCk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdGhpcy5fc3RhdGU7XG4gICAgfTtcblxuICAgIHByb3RvLl9mb3JjZVVwZGF0aW5nU3RhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBlbGVtID0gdGhpcy5fZWxlbWVudDtcbiAgICAgICAgaWYgKGVsZW0pIHtcbiAgICAgICAgICAgIGlmIChBdWRpby5TdGF0ZS5QTEFZSU5HID09PSB0aGlzLl9zdGF0ZSAmJiBlbGVtLnBhdXNlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gQXVkaW8uU3RhdGUuU1RPUFBFRDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKEF1ZGlvLlN0YXRlLlNUT1BQRUQgPT09IHRoaXMuX3N0YXRlICYmICFlbGVtLnBhdXNlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gQXVkaW8uU3RhdGUuUExBWUlORztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvdG8sICdzcmMnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NyYztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoY2xpcCkge1xuICAgICAgICAgICAgdGhpcy5fdW5iaW5kRW5kZWQoKTtcbiAgICAgICAgICAgIGlmIChjbGlwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3JjID0gY2xpcDtcbiAgICAgICAgICAgICAgICBpZiAoY2xpcC5sb2FkZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25Mb2FkZWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgY2xpcC5vbmNlKCdsb2FkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNsaXAgPT09IHNlbGYuX3NyYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX29uTG9hZGVkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBjYy5sb2FkZXIubG9hZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBjbGlwLm5hdGl2ZVVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3IgYXVkaW8sIHdlIHNob3VsZCBza2lwIGxvYWRlciBvdGhlcndpc2UgaXQgd2lsbCBsb2FkIGEgbmV3IGF1ZGlvQ2xpcC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBza2lwczogWydMb2FkZXInXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyLCBhdWRpb05hdGl2ZUFzc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY2xpcC5sb2FkZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpcC5fbmF0aXZlQXNzZXQgPSBhdWRpb05hdGl2ZUFzc2V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NyYyA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2VsZW1lbnQgaW5zdGFuY2VvZiBIVE1MQXVkaW9FbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuc3JjID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBBdWRpby5TdGF0ZS5JTklUSUFMWklORztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjbGlwO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm90bywgJ3BhdXNlZCcsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudCA/IHRoaXMuX2VsZW1lbnQucGF1c2VkIDogdHJ1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG5cbiAgICAvLyBzZXRGaW5pc2hDYWxsYmFja1xuXG59KShBdWRpby5wcm90b3R5cGUpO1xuXG5cbi8vIFRJTUVfQ09OU1RBTlQgaXMgdXNlZCBhcyBhbiBhcmd1bWVudCBvZiBzZXRUYXJnZXRBdFRpbWUgaW50ZXJmYWNlXG4vLyBUSU1FX0NPTlNUQU5UIG5lZWQgdG8gYmUgYSBwb3NpdGl2ZSBudW1iZXIgb24gRWRnZSBhbmQgQmFpZHUgYnJvd3NlclxuLy8gVElNRV9DT05TVEFOVCBuZWVkIHRvIGJlIDAgYnkgZGVmYXVsdCwgb3IgbWF5IGZhaWwgdG8gc2V0IHZvbHVtZSBhdCB0aGUgdmVyeSBiZWdpbm5pbmcgb2YgcGxheWluZyBhdWRpb1xubGV0IFRJTUVfQ09OU1RBTlQ7XG5pZiAoY2Muc3lzLmJyb3dzZXJUeXBlID09PSBjYy5zeXMuQlJPV1NFUl9UWVBFX0VER0UgfHwgXG4gICAgY2Muc3lzLmJyb3dzZXJUeXBlID09PSBjYy5zeXMuQlJPV1NFUl9UWVBFX0JBSURVIHx8XG4gICAgY2Muc3lzLmJyb3dzZXJUeXBlID09PSBjYy5zeXMuQlJPV1NFUl9UWVBFX1VDKSB7XG4gICAgVElNRV9DT05TVEFOVCA9IDAuMDE7XG59XG5lbHNlIHtcbiAgICBUSU1FX0NPTlNUQU5UID0gMDtcbn1cblxuLy8gRW5jYXBzdWxhdGVkIFdlYkF1ZGlvIGludGVyZmFjZVxubGV0IFdlYkF1ZGlvRWxlbWVudCA9IGZ1bmN0aW9uIChidWZmZXIsIGF1ZGlvKSB7XG4gICAgdGhpcy5fYXVkaW8gPSBhdWRpbztcbiAgICB0aGlzLl9jb250ZXh0ID0gc3lzLl9fYXVkaW9TdXBwb3J0LmNvbnRleHQ7XG4gICAgdGhpcy5fYnVmZmVyID0gYnVmZmVyO1xuXG4gICAgdGhpcy5fZ2Fpbk9iaiA9IHRoaXMuX2NvbnRleHRbJ2NyZWF0ZUdhaW4nXSgpO1xuICAgIHRoaXMudm9sdW1lID0gMTtcblxuICAgIHRoaXMuX2dhaW5PYmpbJ2Nvbm5lY3QnXSh0aGlzLl9jb250ZXh0WydkZXN0aW5hdGlvbiddKTtcbiAgICB0aGlzLl9sb29wID0gZmFsc2U7XG4gICAgLy8gVGhlIHRpbWUgc3RhbXAgb24gdGhlIGF1ZGlvIHRpbWUgYXhpcyB3aGVuIHRoZSByZWNvcmRpbmcgYmVnaW5zIHRvIHBsYXkuXG4gICAgdGhpcy5fc3RhcnRUaW1lID0gLTE7XG4gICAgLy8gUmVjb3JkIHRoZSBjdXJyZW50bHkgcGxheWluZyAnU291cmNlJ1xuICAgIHRoaXMuX2N1cnJlbnRTb3VyY2UgPSBudWxsO1xuICAgIC8vIFJlY29yZCB0aGUgdGltZSBoYXMgYmVlbiBwbGF5ZWRcbiAgICB0aGlzLnBsYXllZExlbmd0aCA9IDA7XG5cbiAgICB0aGlzLl9jdXJyZW50VGltZXIgPSBudWxsO1xuXG4gICAgdGhpcy5fZW5kQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLm9uZW5kZWQpIHtcbiAgICAgICAgICAgIHRoaXMub25lbmRlZCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH0uYmluZCh0aGlzKTtcbn07XG5cbihmdW5jdGlvbiAocHJvdG8pIHtcbiAgICBwcm90by5wbGF5ID0gZnVuY3Rpb24gKG9mZnNldCkge1xuICAgICAgICAvLyBJZiByZXBlYXQgcGxheSwgeW91IG5lZWQgdG8gc3RvcCBiZWZvcmUgYW4gYXVkaW9cbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRTb3VyY2UgJiYgIXRoaXMucGF1c2VkKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50U291cmNlLm9uZW5kZWQgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudFNvdXJjZS5zdG9wKDApO1xuICAgICAgICAgICAgdGhpcy5wbGF5ZWRMZW5ndGggPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGF1ZGlvID0gdGhpcy5fY29udGV4dFtcImNyZWF0ZUJ1ZmZlclNvdXJjZVwiXSgpO1xuICAgICAgICBhdWRpby5idWZmZXIgPSB0aGlzLl9idWZmZXI7XG4gICAgICAgIGF1ZGlvW1wiY29ubmVjdFwiXSh0aGlzLl9nYWluT2JqKTtcbiAgICAgICAgYXVkaW8ubG9vcCA9IHRoaXMuX2xvb3A7XG5cbiAgICAgICAgdGhpcy5fc3RhcnRUaW1lID0gdGhpcy5fY29udGV4dC5jdXJyZW50VGltZTtcbiAgICAgICAgb2Zmc2V0ID0gb2Zmc2V0IHx8IHRoaXMucGxheWVkTGVuZ3RoO1xuICAgICAgICBpZiAob2Zmc2V0KSB7XG4gICAgICAgICAgICB0aGlzLl9zdGFydFRpbWUgLT0gb2Zmc2V0O1xuICAgICAgICB9XG4gICAgICAgIGxldCBkdXJhdGlvbiA9IHRoaXMuX2J1ZmZlci5kdXJhdGlvbjtcblxuICAgICAgICBsZXQgc3RhcnRUaW1lID0gb2Zmc2V0O1xuICAgICAgICBsZXQgZW5kVGltZTtcbiAgICAgICAgaWYgKHRoaXMuX2xvb3ApIHtcbiAgICAgICAgICAgIGlmIChhdWRpby5zdGFydClcbiAgICAgICAgICAgICAgICBhdWRpby5zdGFydCgwLCBzdGFydFRpbWUpO1xuICAgICAgICAgICAgZWxzZSBpZiAoYXVkaW9bXCJub3RvR3JhaW5PblwiXSlcbiAgICAgICAgICAgICAgICBhdWRpb1tcIm5vdGVHcmFpbk9uXCJdKDAsIHN0YXJ0VGltZSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgYXVkaW9bXCJub3RlT25cIl0oMCwgc3RhcnRUaW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVuZFRpbWUgPSBkdXJhdGlvbiAtIG9mZnNldDtcbiAgICAgICAgICAgIGlmIChhdWRpby5zdGFydClcbiAgICAgICAgICAgICAgICBhdWRpby5zdGFydCgwLCBzdGFydFRpbWUsIGVuZFRpbWUpO1xuICAgICAgICAgICAgZWxzZSBpZiAoYXVkaW9bXCJub3RlR3JhaW5PblwiXSlcbiAgICAgICAgICAgICAgICBhdWRpb1tcIm5vdGVHcmFpbk9uXCJdKDAsIHN0YXJ0VGltZSwgZW5kVGltZSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgYXVkaW9bXCJub3RlT25cIl0oMCwgc3RhcnRUaW1lLCBlbmRUaW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2N1cnJlbnRTb3VyY2UgPSBhdWRpbztcblxuICAgICAgICBhdWRpby5vbmVuZGVkID0gdGhpcy5fZW5kQ2FsbGJhY2s7XG5cbiAgICAgICAgLy8gSWYgdGhlIGN1cnJlbnQgYXVkaW8gY29udGV4dCB0aW1lIHN0YW1wIGlzIDAgYW5kIGF1ZGlvIGNvbnRleHQgc3RhdGUgaXMgc3VzcGVuZGVkXG4gICAgICAgIC8vIFRoZXJlIG1heSBiZSBhIG5lZWQgdG8gdG91Y2ggZXZlbnRzIGJlZm9yZSB5b3UgY2FuIGFjdHVhbGx5IHN0YXJ0IHBsYXlpbmcgYXVkaW9cbiAgICAgICAgaWYgKCghYXVkaW8uY29udGV4dC5zdGF0ZSB8fCBhdWRpby5jb250ZXh0LnN0YXRlID09PSBcInN1c3BlbmRlZFwiKSAmJiB0aGlzLl9jb250ZXh0LmN1cnJlbnRUaW1lID09PSAwKSB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fY3VycmVudFRpbWVyKTtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLl9jb250ZXh0LmN1cnJlbnRUaW1lID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvdWNoUGxheUxpc3QucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZTogc2VsZi5fYXVkaW8sXG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IG9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1ZGlvOiBzZWxmXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBwcm90by5wYXVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2N1cnJlbnRUaW1lcik7XG4gICAgICAgIGlmICh0aGlzLnBhdXNlZCkgcmV0dXJuO1xuICAgICAgICAvLyBSZWNvcmQgdGhlIHRpbWUgdGhlIGN1cnJlbnQgaGFzIGJlZW4gcGxheWVkXG4gICAgICAgIHRoaXMucGxheWVkTGVuZ3RoID0gdGhpcy5fY29udGV4dC5jdXJyZW50VGltZSAtIHRoaXMuX3N0YXJ0VGltZTtcbiAgICAgICAgLy8gSWYgbW9yZSB0aGFuIHRoZSBkdXJhdGlvbiBvZiB0aGUgYXVkaW8sIE5lZWQgdG8gdGFrZSB0aGUgcmVtYWluZGVyXG4gICAgICAgIHRoaXMucGxheWVkTGVuZ3RoICU9IHRoaXMuX2J1ZmZlci5kdXJhdGlvbjtcbiAgICAgICAgbGV0IGF1ZGlvID0gdGhpcy5fY3VycmVudFNvdXJjZTtcbiAgICAgICAgdGhpcy5fY3VycmVudFNvdXJjZSA9IG51bGw7XG4gICAgICAgIHRoaXMuX3N0YXJ0VGltZSA9IC0xO1xuICAgICAgICBpZiAoYXVkaW8pXG4gICAgICAgICAgICBhdWRpby5zdG9wKDApO1xuICAgIH07XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvdG8sICdwYXVzZWQnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gSWYgdGhlIGN1cnJlbnQgYXVkaW8gaXMgYSBsb29wLCBwYXVzZWQgaXMgZmFsc2VcbiAgICAgICAgICAgIGlmICh0aGlzLl9jdXJyZW50U291cmNlICYmIHRoaXMuX2N1cnJlbnRTb3VyY2UubG9vcClcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgIC8vIHN0YXJ0VGltZSBkZWZhdWx0IGlzIC0xXG4gICAgICAgICAgICBpZiAodGhpcy5fc3RhcnRUaW1lID09PSAtMSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAgICAgLy8gQ3VycmVudCB0aW1lIC0gIFN0YXJ0IHBsYXlpbmcgdGltZSA+IEF1ZGlvIGR1cmF0aW9uXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY29udGV4dC5jdXJyZW50VGltZSAtIHRoaXMuX3N0YXJ0VGltZSA+IHRoaXMuX2J1ZmZlci5kdXJhdGlvbjtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvdG8sICdsb29wJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sb29wO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChib29sKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fY3VycmVudFNvdXJjZSlcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50U291cmNlLmxvb3AgPSBib29sO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbG9vcCA9IGJvb2w7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvLCAndm9sdW1lJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92b2x1bWU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKG51bSkge1xuICAgICAgICAgICAgdGhpcy5fdm9sdW1lID0gbnVtO1xuICAgICAgICAgICAgLy8gaHR0cHM6Ly93d3cuY2hyb21lc3RhdHVzLmNvbS9mZWF0dXJlcy81Mjg3OTk1NzcwOTI5MTUyXG4gICAgICAgICAgICBpZiAodGhpcy5fZ2Fpbk9iai5nYWluLnNldFRhcmdldEF0VGltZSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2dhaW5PYmouZ2Fpbi5zZXRUYXJnZXRBdFRpbWUobnVtLCB0aGlzLl9jb250ZXh0LmN1cnJlbnRUaW1lLCBUSU1FX0NPTlNUQU5UKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU29tZSBvdGhlciB1bmtub3duIGJyb3dzZXJzIG1heSBjcmFzaCBpZiBUSU1FX0NPTlNUQU5UIGlzIDBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2Fpbk9iai5nYWluLnNldFRhcmdldEF0VGltZShudW0sIHRoaXMuX2NvbnRleHQuY3VycmVudFRpbWUsIDAuMDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2dhaW5PYmouZ2Fpbi52YWx1ZSA9IG51bTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHN5cy5vcyA9PT0gc3lzLk9TX0lPUyAmJiAhdGhpcy5wYXVzZWQgJiYgdGhpcy5fY3VycmVudFNvdXJjZSkge1xuICAgICAgICAgICAgICAgIC8vIElPUyBtdXN0IGJlIHN0b3Agd2ViQXVkaW9cbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50U291cmNlLm9uZW5kZWQgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMucGF1c2UoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvdG8sICdjdXJyZW50VGltZScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wYXVzZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wbGF5ZWRMZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBSZWNvcmQgdGhlIHRpbWUgdGhlIGN1cnJlbnQgaGFzIGJlZW4gcGxheWVkXG4gICAgICAgICAgICB0aGlzLnBsYXllZExlbmd0aCA9IHRoaXMuX2NvbnRleHQuY3VycmVudFRpbWUgLSB0aGlzLl9zdGFydFRpbWU7XG4gICAgICAgICAgICAvLyBJZiBtb3JlIHRoYW4gdGhlIGR1cmF0aW9uIG9mIHRoZSBhdWRpbywgTmVlZCB0byB0YWtlIHRoZSByZW1haW5kZXJcbiAgICAgICAgICAgIHRoaXMucGxheWVkTGVuZ3RoICU9IHRoaXMuX2J1ZmZlci5kdXJhdGlvbjtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBsYXllZExlbmd0aDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobnVtKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMucGF1c2VkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXVzZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMucGxheWVkTGVuZ3RoID0gbnVtO1xuICAgICAgICAgICAgICAgIHRoaXMucGxheSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllZExlbmd0aCA9IG51bTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudW07XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvLCAnZHVyYXRpb24nLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2J1ZmZlci5kdXJhdGlvbjtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG5cbn0pKFdlYkF1ZGlvRWxlbWVudC5wcm90b3R5cGUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNjLkF1ZGlvID0gQXVkaW87XG4iXX0=