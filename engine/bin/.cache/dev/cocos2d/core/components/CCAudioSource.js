
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCAudioSource.js';
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
var misc = require('../utils/misc');

var Component = require('./CCComponent');

var AudioClip = require('../assets/CCAudioClip');
/**
 * !#en Audio Source.
 * !#zh 音频源组件，能对音频剪辑。
 * @class AudioSource
 * @extends Component
 */


var AudioSource = cc.Class({
  name: 'cc.AudioSource',
  "extends": Component,
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.others/AudioSource',
    help: 'i18n:COMPONENT.help_url.audiosource'
  },
  ctor: function ctor() {
    // We can't require Audio here because jsb Audio is implemented outside the engine,
    // it can only take effect rely on overwriting cc.Audio
    this.audio = new cc.Audio();
  },
  properties: {
    _clip: {
      "default": null,
      type: AudioClip
    },
    _volume: 1,
    _mute: false,
    _loop: false,
    _pausedFlag: {
      "default": false,
      serializable: false
    },

    /**
     * !#en
     * Is the audio source playing (Read Only). <br/>
     * Note: isPlaying is not supported for Native platforms.
     * !#zh
     * 该音频剪辑是否正播放（只读）。<br/>
     * 注意：Native 平台暂时不支持 isPlaying。
     * @property isPlaying
     * @type {Boolean}
     * @readOnly
     * @default false
     */
    isPlaying: {
      get: function get() {
        var state = this.audio.getState();
        return state === cc.Audio.State.PLAYING;
      },
      visible: false
    },

    /**
     * !#en The clip of the audio source to play.
     * !#zh 要播放的音频剪辑。
     * @property clip
     * @type {AudioClip}
     * @default 1
     */
    clip: {
      get: function get() {
        return this._clip;
      },
      set: function set(value) {
        if (typeof value === 'string') {
          // backward compatibility since 1.10
          cc.warnID(8401, 'cc.AudioSource', 'cc.AudioClip', 'AudioClip', 'cc.AudioClip', 'audio');
          var self = this;

          AudioClip._loadByUrl(value, function (err, clip) {
            if (clip) {
              self.clip = clip;
            }
          });

          return;
        }

        if (value === this._clip) {
          return;
        }

        this._clip = value;
        this.audio.stop();

        if (this.preload) {
          this.audio.src = this._clip;
        }
      },
      type: AudioClip,
      tooltip: CC_DEV && 'i18n:COMPONENT.audio.clip',
      animatable: false
    },

    /**
     * !#en The volume of the audio source.
     * !#zh 音频源的音量（0.0 ~ 1.0）。
     * @property volume
     * @type {Number}
     * @default 1
     */
    volume: {
      get: function get() {
        return this._volume;
      },
      set: function set(value) {
        value = misc.clamp01(value);
        this._volume = value;

        if (!this._mute) {
          this.audio.setVolume(value);
        }

        return value;
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.audio.volume'
    },

    /**
     * !#en Is the audio source mute?
     * !#zh 是否静音音频源。Mute 是设置音量为 0，取消静音是恢复原来的音量。
     * @property mute
     * @type {Boolean}
     * @default false
     */
    mute: {
      get: function get() {
        return this._mute;
      },
      set: function set(value) {
        this._mute = value;
        this.audio.setVolume(value ? 0 : this._volume);
        return value;
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.audio.mute'
    },

    /**
     * !#en Is the audio source looping?
     * !#zh 音频源是否循环播放？
     * @property loop
     * @type {Boolean}
     * @default false
     */
    loop: {
      get: function get() {
        return this._loop;
      },
      set: function set(value) {
        this._loop = value;
        this.audio.setLoop(value);
        return value;
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.audio.loop'
    },

    /**
     * !#en If set to true, the audio source will automatically start playing on onEnable.
     * !#zh 如果设置为 true，音频源将在 onEnable 时自动播放。
     * @property playOnLoad
     * @type {Boolean}
     * @default true
     */
    playOnLoad: {
      "default": false,
      tooltip: CC_DEV && 'i18n:COMPONENT.audio.play_on_load',
      animatable: false
    },
    preload: {
      "default": false,
      animatable: false
    }
  },
  _ensureDataLoaded: function _ensureDataLoaded() {
    if (this.audio.src !== this._clip) {
      this.audio.src = this._clip;
    }
  },
  _pausedCallback: function _pausedCallback() {
    var state = this.audio.getState();

    if (state === cc.Audio.State.PLAYING) {
      this.audio.pause();
      this._pausedFlag = true;
    }
  },
  _restoreCallback: function _restoreCallback() {
    if (this._pausedFlag) {
      this.audio.resume();
    }

    this._pausedFlag = false;
  },
  onLoad: function onLoad() {
    this.audio.setVolume(this._mute ? 0 : this._volume);
    this.audio.setLoop(this._loop);
  },
  onEnable: function onEnable() {
    if (this.preload) {
      this.audio.src = this._clip;
    }

    if (this.playOnLoad) {
      this.play();
    }

    cc.game.on(cc.game.EVENT_HIDE, this._pausedCallback, this);
    cc.game.on(cc.game.EVENT_SHOW, this._restoreCallback, this);
  },
  onDisable: function onDisable() {
    this.stop();
    cc.game.off(cc.game.EVENT_HIDE, this._pausedCallback, this);
    cc.game.off(cc.game.EVENT_SHOW, this._restoreCallback, this);
  },
  onDestroy: function onDestroy() {
    this.stop();
    this.audio.destroy();
    cc.audioEngine.uncache(this._clip);
  },

  /**
   * !#en Plays the clip.
   * !#zh 播放音频剪辑。
   * @method play
   */
  play: function play() {
    if (!this._clip) return;
    var audio = this.audio;

    if (this._clip.loaded) {
      audio.stop();
    }

    this._ensureDataLoaded();

    audio.setCurrentTime(0);
    audio.play();
  },

  /**
   * !#en Stops the clip.
   * !#zh 停止当前音频剪辑。
   * @method stop
   */
  stop: function stop() {
    this.audio.stop();
  },

  /**
   * !#en Pause the clip.
   * !#zh 暂停当前音频剪辑。
   * @method pause
   */
  pause: function pause() {
    this.audio.pause();
  },

  /**
   * !#en Resume the clip.
   * !#zh 恢复播放。
   * @method resume
   */
  resume: function resume() {
    this._ensureDataLoaded();

    this.audio.resume();
  },

  /**
   * !#en Rewind playing music.
   * !#zh 从头开始播放。
   * @method rewind
   */
  rewind: function rewind() {
    this.audio.setCurrentTime(0);
  },

  /**
   * !#en Get current time
   * !#zh 获取当前的播放时间
   * @method getCurrentTime
   * @return {Number}
   */
  getCurrentTime: function getCurrentTime() {
    return this.audio.getCurrentTime();
  },

  /**
   * !#en Set current time
   * !#zh 设置当前的播放时间
   * @method setCurrentTime
   * @param {Number} time
   * @return {Number}
   */
  setCurrentTime: function setCurrentTime(time) {
    this.audio.setCurrentTime(time);
    return time;
  },

  /**
   * !#en Get audio duration
   * !#zh 获取当前音频的长度
   * @method getDuration
   * @return {Number}
   */
  getDuration: function getDuration() {
    return this.audio.getDuration();
  }
});
cc.AudioSource = module.exports = AudioSource;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDQXVkaW9Tb3VyY2UuanMiXSwibmFtZXMiOlsibWlzYyIsInJlcXVpcmUiLCJDb21wb25lbnQiLCJBdWRpb0NsaXAiLCJBdWRpb1NvdXJjZSIsImNjIiwiQ2xhc3MiLCJuYW1lIiwiZWRpdG9yIiwiQ0NfRURJVE9SIiwibWVudSIsImhlbHAiLCJjdG9yIiwiYXVkaW8iLCJBdWRpbyIsInByb3BlcnRpZXMiLCJfY2xpcCIsInR5cGUiLCJfdm9sdW1lIiwiX211dGUiLCJfbG9vcCIsIl9wYXVzZWRGbGFnIiwic2VyaWFsaXphYmxlIiwiaXNQbGF5aW5nIiwiZ2V0Iiwic3RhdGUiLCJnZXRTdGF0ZSIsIlN0YXRlIiwiUExBWUlORyIsInZpc2libGUiLCJjbGlwIiwic2V0IiwidmFsdWUiLCJ3YXJuSUQiLCJzZWxmIiwiX2xvYWRCeVVybCIsImVyciIsInN0b3AiLCJwcmVsb2FkIiwic3JjIiwidG9vbHRpcCIsIkNDX0RFViIsImFuaW1hdGFibGUiLCJ2b2x1bWUiLCJjbGFtcDAxIiwic2V0Vm9sdW1lIiwibXV0ZSIsImxvb3AiLCJzZXRMb29wIiwicGxheU9uTG9hZCIsIl9lbnN1cmVEYXRhTG9hZGVkIiwiX3BhdXNlZENhbGxiYWNrIiwicGF1c2UiLCJfcmVzdG9yZUNhbGxiYWNrIiwicmVzdW1lIiwib25Mb2FkIiwib25FbmFibGUiLCJwbGF5IiwiZ2FtZSIsIm9uIiwiRVZFTlRfSElERSIsIkVWRU5UX1NIT1ciLCJvbkRpc2FibGUiLCJvZmYiLCJvbkRlc3Ryb3kiLCJkZXN0cm95IiwiYXVkaW9FbmdpbmUiLCJ1bmNhY2hlIiwibG9hZGVkIiwic2V0Q3VycmVudFRpbWUiLCJyZXdpbmQiLCJnZXRDdXJyZW50VGltZSIsInRpbWUiLCJnZXREdXJhdGlvbiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFNQSxJQUFJLEdBQUdDLE9BQU8sQ0FBQyxlQUFE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KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNvbnN0IG1pc2MgPSByZXF1aXJlKCcuLi91dGlscy9taXNjJyk7XG5jb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCcuL0NDQ29tcG9uZW50Jyk7XG5jb25zdCBBdWRpb0NsaXAgPSByZXF1aXJlKCcuLi9hc3NldHMvQ0NBdWRpb0NsaXAnKTtcblxuLyoqXG4gKiAhI2VuIEF1ZGlvIFNvdXJjZS5cbiAqICEjemgg6Z+z6aKR5rqQ57uE5Lu277yM6IO95a+56Z+z6aKR5Ymq6L6R44CCXG4gKiBAY2xhc3MgQXVkaW9Tb3VyY2VcbiAqIEBleHRlbmRzIENvbXBvbmVudFxuICovXG52YXIgQXVkaW9Tb3VyY2UgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLkF1ZGlvU291cmNlJyxcbiAgICBleHRlbmRzOiBDb21wb25lbnQsXG5cbiAgICBlZGl0b3I6IENDX0VESVRPUiAmJiB7XG4gICAgICAgIG1lbnU6ICdpMThuOk1BSU5fTUVOVS5jb21wb25lbnQub3RoZXJzL0F1ZGlvU291cmNlJyxcbiAgICAgICAgaGVscDogJ2kxOG46Q09NUE9ORU5ULmhlbHBfdXJsLmF1ZGlvc291cmNlJyxcbiAgICB9LFxuXG4gICAgY3RvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBXZSBjYW4ndCByZXF1aXJlIEF1ZGlvIGhlcmUgYmVjYXVzZSBqc2IgQXVkaW8gaXMgaW1wbGVtZW50ZWQgb3V0c2lkZSB0aGUgZW5naW5lLFxuICAgICAgICAvLyBpdCBjYW4gb25seSB0YWtlIGVmZmVjdCByZWx5IG9uIG92ZXJ3cml0aW5nIGNjLkF1ZGlvXG4gICAgICAgIHRoaXMuYXVkaW8gPSBuZXcgY2MuQXVkaW8oKTtcbiAgICB9LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBfY2xpcDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IEF1ZGlvQ2xpcFxuICAgICAgICB9LFxuICAgICAgICBfdm9sdW1lOiAxLFxuICAgICAgICBfbXV0ZTogZmFsc2UsXG4gICAgICAgIF9sb29wOiBmYWxzZSxcbiAgICAgICAgX3BhdXNlZEZsYWc6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgICAgc2VyaWFsaXphYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIElzIHRoZSBhdWRpbyBzb3VyY2UgcGxheWluZyAoUmVhZCBPbmx5KS4gPGJyLz5cbiAgICAgICAgICogTm90ZTogaXNQbGF5aW5nIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIE5hdGl2ZSBwbGF0Zm9ybXMuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog6K+l6Z+z6aKR5Ymq6L6R5piv5ZCm5q2j5pKt5pS+77yI5Y+q6K+777yJ44CCPGJyLz5cbiAgICAgICAgICog5rOo5oSP77yaTmF0aXZlIOW5s+WPsOaaguaXtuS4jeaUr+aMgSBpc1BsYXlpbmfjgIJcbiAgICAgICAgICogQHByb3BlcnR5IGlzUGxheWluZ1xuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICogQHJlYWRPbmx5XG4gICAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgICAqL1xuICAgICAgICBpc1BsYXlpbmc6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IHRoaXMuYXVkaW8uZ2V0U3RhdGUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGUgPT09IGNjLkF1ZGlvLlN0YXRlLlBMQVlJTkc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgY2xpcCBvZiB0aGUgYXVkaW8gc291cmNlIHRvIHBsYXkuXG4gICAgICAgICAqICEjemgg6KaB5pKt5pS+55qE6Z+z6aKR5Ymq6L6R44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBjbGlwXG4gICAgICAgICAqIEB0eXBlIHtBdWRpb0NsaXB9XG4gICAgICAgICAqIEBkZWZhdWx0IDFcbiAgICAgICAgICovXG4gICAgICAgIGNsaXA6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jbGlwO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYmFja3dhcmQgY29tcGF0aWJpbGl0eSBzaW5jZSAxLjEwXG4gICAgICAgICAgICAgICAgICAgIGNjLndhcm5JRCg4NDAxLCAnY2MuQXVkaW9Tb3VyY2UnLCAnY2MuQXVkaW9DbGlwJywgJ0F1ZGlvQ2xpcCcsICdjYy5BdWRpb0NsaXAnLCAnYXVkaW8nKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICBBdWRpb0NsaXAuX2xvYWRCeVVybCh2YWx1ZSwgZnVuY3Rpb24gKGVyciwgY2xpcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNsaXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNsaXAgPSBjbGlwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdGhpcy5fY2xpcCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2NsaXAgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmF1ZGlvLnN0b3AoKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcmVsb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXVkaW8uc3JjID0gdGhpcy5fY2xpcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHlwZTogQXVkaW9DbGlwLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5hdWRpby5jbGlwJyxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIHZvbHVtZSBvZiB0aGUgYXVkaW8gc291cmNlLlxuICAgICAgICAgKiAhI3poIOmfs+mikea6kOeahOmfs+mHj++8iDAuMCB+IDEuMO+8ieOAglxuICAgICAgICAgKiBAcHJvcGVydHkgdm9sdW1lXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDFcbiAgICAgICAgICovXG4gICAgICAgIHZvbHVtZToge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZvbHVtZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gbWlzYy5jbGFtcDAxKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLl92b2x1bWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX211dGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdWRpby5zZXRWb2x1bWUodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5hdWRpby52b2x1bWUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gSXMgdGhlIGF1ZGlvIHNvdXJjZSBtdXRlP1xuICAgICAgICAgKiAhI3poIOaYr+WQpumdmemfs+mfs+mikea6kOOAgk11dGUg5piv6K6+572u6Z+z6YeP5Li6IDDvvIzlj5bmtojpnZnpn7PmmK/mgaLlpI3ljp/mnaXnmoTpn7Pph4/jgIJcbiAgICAgICAgICogQHByb3BlcnR5IG11dGVcbiAgICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgICAqL1xuICAgICAgICBtdXRlOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbXV0ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX211dGUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmF1ZGlvLnNldFZvbHVtZSh2YWx1ZSA/IDAgOiB0aGlzLl92b2x1bWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuYXVkaW8ubXV0ZScsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gSXMgdGhlIGF1ZGlvIHNvdXJjZSBsb29waW5nP1xuICAgICAgICAgKiAhI3poIOmfs+mikea6kOaYr+WQpuW+queOr+aSreaUvu+8n1xuICAgICAgICAgKiBAcHJvcGVydHkgbG9vcFxuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICovXG4gICAgICAgIGxvb3A6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9sb29wO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9vcCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuYXVkaW8uc2V0TG9vcCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5hdWRpby5sb29wJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIElmIHNldCB0byB0cnVlLCB0aGUgYXVkaW8gc291cmNlIHdpbGwgYXV0b21hdGljYWxseSBzdGFydCBwbGF5aW5nIG9uIG9uRW5hYmxlLlxuICAgICAgICAgKiAhI3poIOWmguaenOiuvue9ruS4uiB0cnVl77yM6Z+z6aKR5rqQ5bCG5ZyoIG9uRW5hYmxlIOaXtuiHquWKqOaSreaUvuOAglxuICAgICAgICAgKiBAcHJvcGVydHkgcGxheU9uTG9hZFxuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICogQGRlZmF1bHQgdHJ1ZVxuICAgICAgICAgKi9cbiAgICAgICAgcGxheU9uTG9hZDoge1xuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmF1ZGlvLnBsYXlfb25fbG9hZCcsXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIHByZWxvYWQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2VcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZW5zdXJlRGF0YUxvYWRlZCAoKSB7XG4gICAgICAgIGlmICh0aGlzLmF1ZGlvLnNyYyAhPT0gdGhpcy5fY2xpcCkge1xuICAgICAgICAgICAgdGhpcy5hdWRpby5zcmMgPSB0aGlzLl9jbGlwO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9wYXVzZWRDYWxsYmFjazogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc3RhdGUgPSB0aGlzLmF1ZGlvLmdldFN0YXRlKCk7XG4gICAgICAgIGlmIChzdGF0ZSA9PT0gY2MuQXVkaW8uU3RhdGUuUExBWUlORykge1xuICAgICAgICAgICAgdGhpcy5hdWRpby5wYXVzZSgpO1xuICAgICAgICAgICAgdGhpcy5fcGF1c2VkRmxhZyA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3Jlc3RvcmVDYWxsYmFjazogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fcGF1c2VkRmxhZykge1xuICAgICAgICAgICAgdGhpcy5hdWRpby5yZXN1bWUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9wYXVzZWRGbGFnID0gZmFsc2U7XG4gICAgfSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmF1ZGlvLnNldFZvbHVtZSh0aGlzLl9tdXRlID8gMCA6IHRoaXMuX3ZvbHVtZSk7XG4gICAgICAgIHRoaXMuYXVkaW8uc2V0TG9vcCh0aGlzLl9sb29wKTtcbiAgICB9LFxuXG4gICAgb25FbmFibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMucHJlbG9hZCkge1xuICAgICAgICAgICAgdGhpcy5hdWRpby5zcmMgPSB0aGlzLl9jbGlwO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBsYXlPbkxvYWQpIHtcbiAgICAgICAgICAgIHRoaXMucGxheSgpO1xuICAgICAgICB9XG4gICAgICAgIGNjLmdhbWUub24oY2MuZ2FtZS5FVkVOVF9ISURFLCB0aGlzLl9wYXVzZWRDYWxsYmFjaywgdGhpcyk7XG4gICAgICAgIGNjLmdhbWUub24oY2MuZ2FtZS5FVkVOVF9TSE9XLCB0aGlzLl9yZXN0b3JlQ2FsbGJhY2ssIHRoaXMpO1xuICAgIH0sXG5cbiAgICBvbkRpc2FibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgIGNjLmdhbWUub2ZmKGNjLmdhbWUuRVZFTlRfSElERSwgdGhpcy5fcGF1c2VkQ2FsbGJhY2ssIHRoaXMpO1xuICAgICAgICBjYy5nYW1lLm9mZihjYy5nYW1lLkVWRU5UX1NIT1csIHRoaXMuX3Jlc3RvcmVDYWxsYmFjaywgdGhpcyk7XG4gICAgfSxcblxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgdGhpcy5hdWRpby5kZXN0cm95KCk7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnVuY2FjaGUodGhpcy5fY2xpcCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUGxheXMgdGhlIGNsaXAuXG4gICAgICogISN6aCDmkq3mlL7pn7PpopHliarovpHjgIJcbiAgICAgKiBAbWV0aG9kIHBsYXlcbiAgICAgKi9cbiAgICBwbGF5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICggIXRoaXMuX2NsaXAgKSByZXR1cm47XG5cbiAgICAgICAgdmFyIGF1ZGlvID0gdGhpcy5hdWRpbztcbiAgICAgICAgaWYgKHRoaXMuX2NsaXAubG9hZGVkKSB7XG4gICAgICAgICAgICBhdWRpby5zdG9wKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZW5zdXJlRGF0YUxvYWRlZCgpO1xuICAgICAgICBhdWRpby5zZXRDdXJyZW50VGltZSgwKTtcbiAgICAgICAgYXVkaW8ucGxheSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFN0b3BzIHRoZSBjbGlwLlxuICAgICAqICEjemgg5YGc5q2i5b2T5YmN6Z+z6aKR5Ymq6L6R44CCXG4gICAgICogQG1ldGhvZCBzdG9wXG4gICAgICovXG4gICAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmF1ZGlvLnN0b3AoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBQYXVzZSB0aGUgY2xpcC5cbiAgICAgKiAhI3poIOaaguWBnOW9k+WJjemfs+mikeWJqui+keOAglxuICAgICAqIEBtZXRob2QgcGF1c2VcbiAgICAgKi9cbiAgICBwYXVzZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmF1ZGlvLnBhdXNlKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmVzdW1lIHRoZSBjbGlwLlxuICAgICAqICEjemgg5oGi5aSN5pKt5pS+44CCXG4gICAgICogQG1ldGhvZCByZXN1bWVcbiAgICAgKi9cbiAgICByZXN1bWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fZW5zdXJlRGF0YUxvYWRlZCgpO1xuICAgICAgICB0aGlzLmF1ZGlvLnJlc3VtZSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJld2luZCBwbGF5aW5nIG11c2ljLlxuICAgICAqICEjemgg5LuO5aS05byA5aeL5pKt5pS+44CCXG4gICAgICogQG1ldGhvZCByZXdpbmRcbiAgICAgKi9cbiAgICByZXdpbmQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuYXVkaW8uc2V0Q3VycmVudFRpbWUoMCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0IGN1cnJlbnQgdGltZVxuICAgICAqICEjemgg6I635Y+W5b2T5YmN55qE5pKt5pS+5pe26Ze0XG4gICAgICogQG1ldGhvZCBnZXRDdXJyZW50VGltZVxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRDdXJyZW50VGltZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hdWRpby5nZXRDdXJyZW50VGltZSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCBjdXJyZW50IHRpbWVcbiAgICAgKiAhI3poIOiuvue9ruW9k+WJjeeahOaSreaUvuaXtumXtFxuICAgICAqIEBtZXRob2Qgc2V0Q3VycmVudFRpbWVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdGltZVxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBzZXRDdXJyZW50VGltZTogZnVuY3Rpb24gKHRpbWUpIHtcbiAgICAgICAgdGhpcy5hdWRpby5zZXRDdXJyZW50VGltZSh0aW1lKTtcbiAgICAgICAgcmV0dXJuIHRpbWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0IGF1ZGlvIGR1cmF0aW9uXG4gICAgICogISN6aCDojrflj5blvZPliY3pn7PpopHnmoTplb/luqZcbiAgICAgKiBAbWV0aG9kIGdldER1cmF0aW9uXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldER1cmF0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmF1ZGlvLmdldER1cmF0aW9uKCk7XG4gICAgfVxuXG59KTtcblxuY2MuQXVkaW9Tb3VyY2UgPSBtb2R1bGUuZXhwb3J0cyA9IEF1ZGlvU291cmNlO1xuIl19