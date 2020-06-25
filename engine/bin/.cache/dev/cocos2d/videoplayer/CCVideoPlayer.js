
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/videoplayer/CCVideoPlayer.js';
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
var VideoPlayerImpl = require('./video-player-impl');
/**
 * !#en Video event type
 * !#zh 视频事件类型
 * @enum VideoPlayer.EventType
 */

/**
 * !#en play
 * !#zh 播放
 * @property {Number} PLAYING
 */

/**
 * !#en pause
 * !#zh 暂停
 * @property {Number} PAUSED
 */

/**
 * !#en stop
 * !#zh 停止
 * @property {Number} STOPPED
 */

/**
 * !#en play end
 * !#zh 播放结束
 * @property {Number} COMPLETED
 */

/**
 * !#en meta data is loaded
 * !#zh 视频的元信息已加载完成，你可以调用 getDuration 来获取视频总时长
 * @property {Number} META_LOADED
 */

/**
 * !#en clicked by the user
 * !#zh 视频被用户点击了
 * @property {Number} CLICKED
 */

/**
 * !#en ready to play, this event is not guaranteed to be triggered on all platform or browser, please don't rely on it to play your video.<br/>
 * !#zh 视频准备好了，这个事件并不保障会在所有平台或浏览器中被触发，它依赖于平台实现，请不要依赖于这个事件做视频播放的控制。
 * @property {Number} READY_TO_PLAY
 */


var EventType = VideoPlayerImpl.EventType;
/**
 * !#en Enum for video resouce type type.
 * !#zh 视频来源
 * @enum VideoPlayer.ResourceType
 */

var ResourceType = cc.Enum({
  /**
   * !#en The remote resource type.
   * !#zh 远程视频
   * @property {Number} REMOTE
   */
  REMOTE: 0,

  /**
   * !#en The local resouce type.
   * !#zh 本地视频
   * @property {Number} LOCAL
   */
  LOCAL: 1
});
/**
 * !#en cc.VideoPlayer is a component for playing videos, you can use it for showing videos in your game. Because different platforms have different authorization, API and control methods for VideoPlayer component. And have not yet formed a unified standard, only Web, iOS, and Android platforms are currently supported.
 * !#zh Video 组件，用于在游戏中播放视频。由于不同平台对于 VideoPlayer 组件的授权、API、控制方式都不同，还没有形成统一的标准，所以目前只支持 Web、iOS 和 Android 平台。
 * @class VideoPlayer
 * @extends Component
 */

var VideoPlayer = cc.Class({
  name: 'cc.VideoPlayer',
  "extends": cc.Component,
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.ui/VideoPlayer',
    inspector: 'packages://inspector/inspectors/comps/videoplayer.js',
    help: 'i18n:COMPONENT.help_url.videoplayer',
    executeInEditMode: true
  },
  properties: {
    _resourceType: ResourceType.REMOTE,

    /**
     * !#en The resource type of videoplayer, REMOTE for remote url and LOCAL for local file path.
     * !#zh 视频来源：REMOTE 表示远程视频 URL，LOCAL 表示本地视频地址。
     * @property {VideoPlayer.ResourceType} resourceType
     */
    resourceType: {
      tooltip: CC_DEV && 'i18n:COMPONENT.videoplayer.resourceType',
      type: ResourceType,
      set: function set(value) {
        this._resourceType = value;

        this._updateVideoSource();
      },
      get: function get() {
        return this._resourceType;
      }
    },
    _remoteURL: '',

    /**
     * !#en The remote URL of video.
     * !#zh 远程视频的 URL
     * @property {String} remoteURL
     */
    remoteURL: {
      tooltip: CC_DEV && 'i18n:COMPONENT.videoplayer.url',
      type: cc.String,
      set: function set(url) {
        this._remoteURL = url;

        this._updateVideoSource();
      },
      get: function get() {
        return this._remoteURL;
      }
    },
    _clip: {
      "default": null,
      type: cc.Asset
    },

    /**
     * !#en The local video full path.
     * !#zh 本地视频的 URL
     * @property {String} clip
     */
    clip: {
      tooltip: CC_DEV && 'i18n:COMPONENT.videoplayer.video',
      get: function get() {
        return this._clip;
      },
      set: function set(value) {
        this._clip = value;

        this._updateVideoSource();
      },
      type: cc.Asset
    },

    /**
     * !#en The current playback time of the now playing item in seconds, you could also change the start playback time.
     * !#zh 指定视频从什么时间点开始播放，单位是秒，也可以用来获取当前视频播放的时间进度。
     * @property {Number} currentTime
     */
    currentTime: {
      tooltip: CC_DEV && 'i18n:COMPONENT.videoplayer.currentTime',
      type: cc.Float,
      set: function set(time) {
        if (this._impl) {
          this._impl.seekTo(time);
        }
      },
      get: function get() {
        if (this._impl) {
          return this._impl.currentTime();
        }

        return -1;
      }
    },
    _volume: 1,

    /**
     * !#en The volume of the video.
     * !#zh 视频的音量（0.0 ~ 1.0）
     * @property volume
     * @type {Number}
     * @default 1
     */
    volume: {
      get: function get() {
        return this._volume;
      },
      set: function set(value) {
        this._volume = value;

        if (this.isPlaying() && !this._mute) {
          this._syncVolume();
        }
      },
      range: [0, 1],
      type: cc.Float,
      tooltip: CC_DEV && 'i18n:COMPONENT.videoplayer.volume'
    },
    _mute: false,

    /**
     * !#en Mutes the VideoPlayer. Mute sets the volume=0, Un-Mute restore the original volume.
     * !#zh 是否静音视频。静音时设置音量为 0，取消静音是恢复原来的音量。
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

        this._syncVolume();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.videoplayer.mute'
    },

    /**
     * !#en Whether keep the aspect ration of the original video.
     * !#zh 是否保持视频原来的宽高比
     * @property {Boolean} keepAspectRatio
     * @type {Boolean}
     * @default true
     */
    keepAspectRatio: {
      tooltip: CC_DEV && 'i18n:COMPONENT.videoplayer.keepAspectRatio',
      "default": true,
      type: cc.Boolean,
      notify: function notify() {
        this._impl && this._impl.setKeepAspectRatioEnabled(this.keepAspectRatio);
      }
    },

    /**
     * !#en Whether play video in fullscreen mode.
     * !#zh 是否全屏播放视频
     * @property {Boolean} isFullscreen
     * @type {Boolean}
     * @default false
     */
    _isFullscreen: {
      "default": false,
      formerlySerializedAs: '_N$isFullscreen'
    },
    isFullscreen: {
      get: function get() {
        if (!CC_EDITOR) {
          this._isFullscreen = this._impl && this._impl.isFullScreenEnabled();
        }

        return this._isFullscreen;
      },
      set: function set(enable) {
        this._isFullscreen = enable;

        if (!CC_EDITOR) {
          this._impl && this._impl.setFullScreenEnabled(enable);
        }
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.videoplayer.isFullscreen'
    },

    /**
     * !#en Always below the game view (only useful on Web. Note: The specific effects are not guaranteed to be consistent, depending on whether each browser supports or restricts).
     * !#zh 永远在游戏视图最底层（这个属性只有在 Web 平台上有效果。注意：具体效果无法保证一致，跟各个浏览器是否支持与限制有关）
     * @property {Boolean} stayOnBottom
     */
    _stayOnBottom: false,
    stayOnBottom: {
      get: function get() {
        return this._stayOnBottom;
      },
      set: function set(enable) {
        this._stayOnBottom = enable;

        if (this._impl) {
          this._impl.setStayOnBottom(enable);
        }
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.videoplayer.stayOnBottom'
    },

    /**
     * !#en the video player's callback, it will be triggered when certain event occurs, like: playing, paused, stopped and completed.
     * !#zh 视频播放回调函数，该回调函数会在特定情况被触发，比如播放中，暂时，停止和完成播放。
     * @property {Component.EventHandler[]} videoPlayerEvent
     */
    videoPlayerEvent: {
      "default": [],
      type: cc.Component.EventHandler
    }
  },
  statics: {
    EventType: EventType,
    ResourceType: ResourceType,
    Impl: VideoPlayerImpl
  },
  ctor: function ctor() {
    this._impl = new VideoPlayerImpl();
  },
  _syncVolume: function _syncVolume() {
    var impl = this._impl;

    if (impl) {
      var volume = this._mute ? 0 : this._volume;
      impl.setVolume(volume);
    }
  },
  _updateVideoSource: function _updateVideoSource() {
    var url = '';

    if (this.resourceType === ResourceType.REMOTE) {
      url = this.remoteURL;
    } else if (this._clip) {
      url = this._clip.nativeUrl || '';
    }

    if (url && cc.loader.md5Pipe) {
      url = cc.loader.md5Pipe.transformURL(url);
    }

    this._impl.setURL(url, this._mute || this._volume === 0);

    this._impl.setKeepAspectRatioEnabled(this.keepAspectRatio);
  },
  onLoad: function onLoad() {
    var impl = this._impl;

    if (impl) {
      impl.createDomElementIfNeeded(this._mute || this._volume === 0);
      impl.setStayOnBottom(this._stayOnBottom);

      this._updateVideoSource();

      if (!CC_EDITOR) {
        impl.seekTo(this.currentTime);
        impl.setFullScreenEnabled(this._isFullscreen);
        this.pause();
        impl.setEventListener(EventType.PLAYING, this.onPlaying.bind(this));
        impl.setEventListener(EventType.PAUSED, this.onPasued.bind(this));
        impl.setEventListener(EventType.STOPPED, this.onStopped.bind(this));
        impl.setEventListener(EventType.COMPLETED, this.onCompleted.bind(this));
        impl.setEventListener(EventType.META_LOADED, this.onMetaLoaded.bind(this));
        impl.setEventListener(EventType.CLICKED, this.onClicked.bind(this));
        impl.setEventListener(EventType.READY_TO_PLAY, this.onReadyToPlay.bind(this));
      }
    }
  },
  onRestore: function onRestore() {
    if (!this._impl) {
      this._impl = new VideoPlayerImpl();
    }
  },
  onEnable: function onEnable() {
    if (this._impl) {
      this._impl.enable();
    }
  },
  onDisable: function onDisable() {
    if (this._impl) {
      this._impl.disable();
    }
  },
  onDestroy: function onDestroy() {
    if (this._impl) {
      this._impl.destroy();

      this._impl = null;
    }
  },
  update: function update(dt) {
    if (this._impl) {
      this._impl.updateMatrix(this.node);
    }
  },
  onReadyToPlay: function onReadyToPlay() {
    cc.Component.EventHandler.emitEvents(this.videoPlayerEvent, this, EventType.READY_TO_PLAY);
    this.node.emit('ready-to-play', this);
  },
  onMetaLoaded: function onMetaLoaded() {
    cc.Component.EventHandler.emitEvents(this.videoPlayerEvent, this, EventType.META_LOADED);
    this.node.emit('meta-loaded', this);
  },
  onClicked: function onClicked() {
    cc.Component.EventHandler.emitEvents(this.videoPlayerEvent, this, EventType.CLICKED);
    this.node.emit('clicked', this);
  },
  onPlaying: function onPlaying() {
    cc.Component.EventHandler.emitEvents(this.videoPlayerEvent, this, EventType.PLAYING);
    this.node.emit('playing', this);
  },
  onPasued: function onPasued() {
    cc.Component.EventHandler.emitEvents(this.videoPlayerEvent, this, EventType.PAUSED);
    this.node.emit('paused', this);
  },
  onStopped: function onStopped() {
    cc.Component.EventHandler.emitEvents(this.videoPlayerEvent, this, EventType.STOPPED);
    this.node.emit('stopped', this);
  },
  onCompleted: function onCompleted() {
    cc.Component.EventHandler.emitEvents(this.videoPlayerEvent, this, EventType.COMPLETED);
    this.node.emit('completed', this);
  },

  /**
   * !#en If a video is paused, call this method could resume playing. If a video is stopped, call this method to play from scratch.
   * !#zh 如果视频被暂停播放了，调用这个接口可以继续播放。如果视频被停止播放了，调用这个接口可以从头开始播放。
   * @method play
   */
  play: function play() {
    if (this._impl) {
      this._syncVolume();

      this._impl.play();
    }
  },

  /**
   * !#en If a video is paused, call this method to resume playing.
   * !#zh 如果一个视频播放被暂停播放了，调用这个接口可以继续播放。
   * @method resume
   */
  resume: function resume() {
    if (this._impl) {
      this._syncVolume();

      this._impl.resume();
    }
  },

  /**
   * !#en If a video is playing, call this method to pause playing.
   * !#zh 如果一个视频正在播放，调用这个接口可以暂停播放。
   * @method pause
   */
  pause: function pause() {
    if (this._impl) {
      this._impl.pause();
    }
  },

  /**
   * !#en If a video is playing, call this method to stop playing immediately.
   * !#zh 如果一个视频正在播放，调用这个接口可以立马停止播放。
   * @method stop
   */
  stop: function stop() {
    if (this._impl) {
      this._impl.stop();
    }
  },

  /**
   * !#en Gets the duration of the video
   * !#zh 获取视频文件的播放总时长
   * @method getDuration
   * @returns {Number}
   */
  getDuration: function getDuration() {
    if (this._impl) {
      return this._impl.duration();
    }

    return -1;
  },

  /**
   * !#en Determine whether video is playing or not.
   * !#zh 判断当前视频是否处于播放状态
   * @method isPlaying
   * @returns {Boolean}
   */
  isPlaying: function isPlaying() {
    if (this._impl) {
      return this._impl.isPlaying();
    }

    return false;
  }
  /**
   * !#en if you don't need the VideoPlayer and it isn't in any running Scene, you should
   * call the destroy method on this component or the associated node explicitly.
   * Otherwise, the created DOM element won't be removed from web page.
   * !#zh
   * 如果你不再使用 VideoPlayer，并且组件未添加到场景中，那么你必须手动对组件或所在节点调用 destroy。
   * 这样才能移除网页上的 DOM 节点，避免 Web 平台内存泄露。
   * @example
   * videoplayer.node.parent = null;  // or  videoplayer.node.removeFromParent(false);
   * // when you don't need videoplayer anymore
   * videoplayer.node.destroy();
   * @method destroy
   * @return {Boolean} whether it is the first time the destroy being called
   */

});
cc.VideoPlayer = module.exports = VideoPlayer;
/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event ready-to-play
 * @param {Event.EventCustom} event
 * @param {VideoPlayer} videoPlayer - The VideoPlayer component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event meta-loaded
 * @param {Event.EventCustom} event
 * @param {VideoPlayer} videoPlayer - The VideoPlayer component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event clicked
 * @param {Event.EventCustom} event
 * @param {VideoPlayer} videoPlayer - The VideoPlayer component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event playing
 * @param {Event.EventCustom} event
 * @param {VideoPlayer} videoPlayer - The VideoPlayer component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event paused
 * @param {Event.EventCustom} event
 * @param {VideoPlayer} videoPlayer - The VideoPlayer component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event stopped
 * @param {Event.EventCustom} event
 * @param {VideoPlayer} videoPlayer - The VideoPlayer component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event completed
 * @param {Event.EventCustom} event
 * @param {VideoPlayer} videoPlayer - The VideoPlayer component.
 */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDVmlkZW9QbGF5ZXIuanMiXSwibmFtZXMiOlsiVmlkZW9QbGF5ZXJJbXBsIiwicmVxdWlyZSIsIkV2ZW50VHlwZSIsIlJlc291cmNlVHlwZSIsImNjIiwiRW51bSIsIlJFTU9URSIsIkxPQ0FMIiwiVmlkZW9QbGF5ZXIiLCJDbGFzcyIsIm5hbWUiLCJDb21wb25lbnQiLCJlZGl0b3IiLCJDQ19FRElUT1IiLCJtZW51IiwiaW5zcGVjdG9yIiwiaGVscCIsImV4ZWN1dGVJbkVkaXRNb2RlIiwicHJvcGVydGllcyIsIl9yZXNvdXJjZVR5cGUiLCJyZXNvdXJjZVR5cGUiLCJ0b29sdGlwIiwiQ0NfREVWIiwidHlwZSIsInNldCIsInZhbHVlIiwiX3VwZGF0ZVZpZGVvU291cmNlIiwiZ2V0IiwiX3JlbW90ZVVSTCIsInJlbW90ZVVSTCIsIlN0cmluZyIsInVybCIsIl9jbGlwIiwiQXNzZXQiLCJjbGlwIiwiY3VycmVudFRpbWUiLCJGbG9hdCIsInRpbWUiLCJfaW1wbCIsInNlZWtUbyIsIl92b2x1bWUiLCJ2b2x1bWUiLCJpc1BsYXlpbmciLCJfbXV0ZSIsIl9zeW5jVm9sdW1lIiwicmFuZ2UiLCJtdXRlIiwia2VlcEFzcGVjdFJhdGlvIiwiQm9vbGVhbiIsIm5vdGlmeSIsInNldEtlZXBBc3BlY3RSYXRpb0VuYWJsZWQiLCJfaXNGdWxsc2NyZWVuIiwiZm9ybWVybHlTZXJpYWxpemVkQXMiLCJpc0Z1bGxzY3JlZW4iLCJpc0Z1bGxTY3JlZW5FbmFibGVkIiwiZW5hYmxlIiwic2V0RnVsbFNjcmVlbkVuYWJsZWQiLCJhbmltYXRhYmxlIiwiX3N0YXlPbkJvdHRvbSIsInN0YXlPbkJvdHRvbSIsInNldFN0YXlPbkJvdHRvbSIsInZpZGVvUGxheWVyRXZlbnQiLCJFdmVudEhhbmRsZXIiLCJzdGF0aWNzIiwiSW1wbCIsImN0b3IiLCJpbXBsIiwic2V0Vm9sdW1lIiwibmF0aXZlVXJsIiwibG9hZGVyIiwibWQ1UGlwZSIsInRyYW5zZm9ybVVSTCIsInNldFVSTCIsIm9uTG9hZCIsImNyZWF0ZURvbUVsZW1lbnRJZk5lZWRlZCIsInBhdXNlIiwic2V0RXZlbnRMaXN0ZW5lciIsIlBMQVlJTkciLCJvblBsYXlpbmciLCJiaW5kIiwiUEFVU0VEIiwib25QYXN1ZWQiLCJTVE9QUEVEIiwib25TdG9wcGVkIiwiQ09NUExFVEVEIiwib25Db21wbGV0ZWQiLCJNRVRBX0xPQURFRCIsIm9uTWV0YUxvYWRlZCIsIkNMSUNLRUQiLCJvbkNsaWNrZWQiLCJSRUFEWV9UT19QTEFZIiwib25SZWFkeVRvUGxheSIsIm9uUmVzdG9yZSIsIm9uRW5hYmxlIiwib25EaXNhYmxlIiwiZGlzYWJsZSIsIm9uRGVzdHJveSIsImRlc3Ryb3kiLCJ1cGRhdGUiLCJkdCIsInVwZGF0ZU1hdHJpeCIsIm5vZGUiLCJlbWl0RXZlbnRzIiwiZW1pdCIsInBsYXkiLCJyZXN1bWUiLCJzdG9wIiwiZ2V0RHVyYXRpb24iLCJkdXJhdGlvbiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFNQSxlQUFlLEdBQUdDLE9BQU8sQ0FBQyxxQkFBRCxDQUEvQjtBQUVBOzs7Ozs7QUFLQTs7Ozs7O0FBS0E7Ozs7OztBQUtBOzs7Ozs7QUFLQTs7Ozs7O0FBS0E7Ozs7OztBQUtBOzs7Ozs7QUFLQTs7Ozs7OztBQUtBLElBQU1DLFNBQVMsR0FBR0YsZUFBZSxDQUFDRSxTQUFsQztBQUdBOzs7Ozs7QUFLQSxJQUFNQyxZQUFZLEdBQUdDLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRO0FBQ3pCOzs7OztBQUtBQyxFQUFBQSxNQUFNLEVBQUUsQ0FOaUI7O0FBT3pCOzs7OztBQUtBQyxFQUFBQSxLQUFLLEVBQUU7QUFaa0IsQ0FBUixDQUFyQjtBQWdCQTs7Ozs7OztBQU1BLElBQUlDLFdBQVcsR0FBR0osRUFBRSxDQUFDSyxLQUFILENBQVM7QUFDdkJDLEVBQUFBLElBQUksRUFBRSxnQkFEaUI7QUFFdkIsYUFBU04sRUFBRSxDQUFD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RUFBQUEsU0EzWXVCLHVCQTJZVjtBQUNULFFBQUksS0FBS0osS0FBVCxFQUFnQjtBQUNaLGFBQU8sS0FBS0EsS0FBTCxDQUFXSSxTQUFYLEVBQVA7QUFDSDs7QUFDRCxXQUFPLEtBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7Ozs7Ozs7QUFsWnVCLENBQVQsQ0FBbEI7QUFrYUF0QyxFQUFFLENBQUNJLFdBQUgsR0FBaUJxRyxNQUFNLENBQUNDLE9BQVAsR0FBaUJ0RyxXQUFsQztBQUVBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7OztBQVdBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7OztBQVVBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNvbnN0IFZpZGVvUGxheWVySW1wbCA9IHJlcXVpcmUoJy4vdmlkZW8tcGxheWVyLWltcGwnKTtcblxuLyoqXG4gKiAhI2VuIFZpZGVvIGV2ZW50IHR5cGVcbiAqICEjemgg6KeG6aKR5LqL5Lu257G75Z6LXG4gKiBAZW51bSBWaWRlb1BsYXllci5FdmVudFR5cGVcbiAqL1xuLyoqXG4gKiAhI2VuIHBsYXlcbiAqICEjemgg5pKt5pS+XG4gKiBAcHJvcGVydHkge051bWJlcn0gUExBWUlOR1xuICovXG4vKipcbiAqICEjZW4gcGF1c2VcbiAqICEjemgg5pqC5YGcXG4gKiBAcHJvcGVydHkge051bWJlcn0gUEFVU0VEXG4gKi9cbi8qKlxuICogISNlbiBzdG9wXG4gKiAhI3poIOWBnOatolxuICogQHByb3BlcnR5IHtOdW1iZXJ9IFNUT1BQRURcbiAqL1xuLyoqXG4gKiAhI2VuIHBsYXkgZW5kXG4gKiAhI3poIOaSreaUvue7k+adn1xuICogQHByb3BlcnR5IHtOdW1iZXJ9IENPTVBMRVRFRFxuICovXG4vKipcbiAqICEjZW4gbWV0YSBkYXRhIGlzIGxvYWRlZFxuICogISN6aCDop4bpopHnmoTlhYPkv6Hmga/lt7LliqDovb3lrozmiJDvvIzkvaDlj6/ku6XosIPnlKggZ2V0RHVyYXRpb24g5p2l6I635Y+W6KeG6aKR5oC75pe26ZW/XG4gKiBAcHJvcGVydHkge051bWJlcn0gTUVUQV9MT0FERURcbiAqL1xuLyoqXG4gKiAhI2VuIGNsaWNrZWQgYnkgdGhlIHVzZXJcbiAqICEjemgg6KeG6aKR6KKr55So5oi354K55Ye75LqGXG4gKiBAcHJvcGVydHkge051bWJlcn0gQ0xJQ0tFRFxuICovXG4vKipcbiAqICEjZW4gcmVhZHkgdG8gcGxheSwgdGhpcyBldmVudCBpcyBub3QgZ3VhcmFudGVlZCB0byBiZSB0cmlnZ2VyZWQgb24gYWxsIHBsYXRmb3JtIG9yIGJyb3dzZXIsIHBsZWFzZSBkb24ndCByZWx5IG9uIGl0IHRvIHBsYXkgeW91ciB2aWRlby48YnIvPlxuICogISN6aCDop4bpopHlh4blpIflpb3kuobvvIzov5nkuKrkuovku7blubbkuI3kv53pmpzkvJrlnKjmiYDmnInlubPlj7DmiJbmtY/op4jlmajkuK3ooqvop6blj5HvvIzlroPkvp3otZbkuo7lubPlj7Dlrp7njrDvvIzor7fkuI3opoHkvp3otZbkuo7ov5nkuKrkuovku7blgZrop4bpopHmkq3mlL7nmoTmjqfliLbjgIJcbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBSRUFEWV9UT19QTEFZXG4gKi9cbmNvbnN0IEV2ZW50VHlwZSA9IFZpZGVvUGxheWVySW1wbC5FdmVudFR5cGU7XG5cblxuLyoqXG4gKiAhI2VuIEVudW0gZm9yIHZpZGVvIHJlc291Y2UgdHlwZSB0eXBlLlxuICogISN6aCDop4bpopHmnaXmupBcbiAqIEBlbnVtIFZpZGVvUGxheWVyLlJlc291cmNlVHlwZVxuICovXG5jb25zdCBSZXNvdXJjZVR5cGUgPSBjYy5FbnVtKHtcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSByZW1vdGUgcmVzb3VyY2UgdHlwZS5cbiAgICAgKiAhI3poIOi/nOeoi+inhumikVxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBSRU1PVEVcbiAgICAgKi9cbiAgICBSRU1PVEU6IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgbG9jYWwgcmVzb3VjZSB0eXBlLlxuICAgICAqICEjemgg5pys5Zyw6KeG6aKRXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IExPQ0FMXG4gICAgICovXG4gICAgTE9DQUw6IDFcbn0pO1xuXG5cbi8qKlxuICogISNlbiBjYy5WaWRlb1BsYXllciBpcyBhIGNvbXBvbmVudCBmb3IgcGxheWluZyB2aWRlb3MsIHlvdSBjYW4gdXNlIGl0IGZvciBzaG93aW5nIHZpZGVvcyBpbiB5b3VyIGdhbWUuIEJlY2F1c2UgZGlmZmVyZW50IHBsYXRmb3JtcyBoYXZlIGRpZmZlcmVudCBhdXRob3JpemF0aW9uLCBBUEkgYW5kIGNvbnRyb2wgbWV0aG9kcyBmb3IgVmlkZW9QbGF5ZXIgY29tcG9uZW50LiBBbmQgaGF2ZSBub3QgeWV0IGZvcm1lZCBhIHVuaWZpZWQgc3RhbmRhcmQsIG9ubHkgV2ViLCBpT1MsIGFuZCBBbmRyb2lkIHBsYXRmb3JtcyBhcmUgY3VycmVudGx5IHN1cHBvcnRlZC5cbiAqICEjemggVmlkZW8g57uE5Lu277yM55So5LqO5Zyo5ri45oiP5Lit5pKt5pS+6KeG6aKR44CC55Sx5LqO5LiN5ZCM5bmz5Y+w5a+55LqOIFZpZGVvUGxheWVyIOe7hOS7tueahOaOiOadg+OAgUFQSeOAgeaOp+WItuaWueW8j+mDveS4jeWQjO+8jOi/mOayoeacieW9ouaIkOe7n+S4gOeahOagh+WHhu+8jOaJgOS7peebruWJjeWPquaUr+aMgSBXZWLjgIFpT1Mg5ZKMIEFuZHJvaWQg5bmz5Y+w44CCXG4gKiBAY2xhc3MgVmlkZW9QbGF5ZXJcbiAqIEBleHRlbmRzIENvbXBvbmVudFxuICovXG5sZXQgVmlkZW9QbGF5ZXIgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlZpZGVvUGxheWVyJyxcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBlZGl0b3I6IENDX0VESVRPUiAmJiB7XG4gICAgICAgIG1lbnU6ICdpMThuOk1BSU5fTUVOVS5jb21wb25lbnQudWkvVmlkZW9QbGF5ZXInLFxuICAgICAgICBpbnNwZWN0b3I6ICdwYWNrYWdlczovL2luc3BlY3Rvci9pbnNwZWN0b3JzL2NvbXBzL3ZpZGVvcGxheWVyLmpzJyxcbiAgICAgICAgaGVscDogJ2kxOG46Q09NUE9ORU5ULmhlbHBfdXJsLnZpZGVvcGxheWVyJyxcbiAgICAgICAgZXhlY3V0ZUluRWRpdE1vZGU6IHRydWVcbiAgICB9LFxuXG4gICAgcHJvcGVydGllczoge1xuXG4gICAgICAgIF9yZXNvdXJjZVR5cGU6IFJlc291cmNlVHlwZS5SRU1PVEUsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSByZXNvdXJjZSB0eXBlIG9mIHZpZGVvcGxheWVyLCBSRU1PVEUgZm9yIHJlbW90ZSB1cmwgYW5kIExPQ0FMIGZvciBsb2NhbCBmaWxlIHBhdGguXG4gICAgICAgICAqICEjemgg6KeG6aKR5p2l5rqQ77yaUkVNT1RFIOihqOekuui/nOeoi+inhumikSBVUkzvvIxMT0NBTCDooajnpLrmnKzlnLDop4bpopHlnLDlnYDjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtWaWRlb1BsYXllci5SZXNvdXJjZVR5cGV9IHJlc291cmNlVHlwZVxuICAgICAgICAgKi9cbiAgICAgICAgcmVzb3VyY2VUeXBlOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnZpZGVvcGxheWVyLnJlc291cmNlVHlwZScsXG4gICAgICAgICAgICB0eXBlOiBSZXNvdXJjZVR5cGUsXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc291cmNlVHlwZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVZpZGVvU291cmNlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc291cmNlVHlwZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfcmVtb3RlVVJMOiAnJyxcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIHJlbW90ZSBVUkwgb2YgdmlkZW8uXG4gICAgICAgICAqICEjemgg6L+c56iL6KeG6aKR55qEIFVSTFxuICAgICAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gcmVtb3RlVVJMXG4gICAgICAgICAqL1xuICAgICAgICByZW1vdGVVUkw6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQudmlkZW9wbGF5ZXIudXJsJyxcbiAgICAgICAgICAgIHR5cGU6IGNjLlN0cmluZyxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHVybCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlbW90ZVVSTCA9IHVybDtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVWaWRlb1NvdXJjZSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZW1vdGVVUkw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2NsaXA6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Bc3NldFxuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgbG9jYWwgdmlkZW8gZnVsbCBwYXRoLlxuICAgICAgICAgKiAhI3poIOacrOWcsOinhumikeeahCBVUkxcbiAgICAgICAgICogQHByb3BlcnR5IHtTdHJpbmd9IGNsaXBcbiAgICAgICAgICovXG4gICAgICAgIGNsaXA6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQudmlkZW9wbGF5ZXIudmlkZW8nLFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NsaXA7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jbGlwID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlVmlkZW9Tb3VyY2UoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBjYy5Bc3NldFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBjdXJyZW50IHBsYXliYWNrIHRpbWUgb2YgdGhlIG5vdyBwbGF5aW5nIGl0ZW0gaW4gc2Vjb25kcywgeW91IGNvdWxkIGFsc28gY2hhbmdlIHRoZSBzdGFydCBwbGF5YmFjayB0aW1lLlxuICAgICAgICAgKiAhI3poIOaMh+WumuinhumikeS7juS7gOS5iOaXtumXtOeCueW8gOWni+aSreaUvu+8jOWNleS9jeaYr+enku+8jOS5n+WPr+S7peeUqOadpeiOt+WPluW9k+WJjeinhumikeaSreaUvueahOaXtumXtOi/m+W6puOAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gY3VycmVudFRpbWVcbiAgICAgICAgICovXG4gICAgICAgIGN1cnJlbnRUaW1lOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnZpZGVvcGxheWVyLmN1cnJlbnRUaW1lJyxcbiAgICAgICAgICAgIHR5cGU6IGNjLkZsb2F0LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodGltZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ltcGwuc2Vla1RvKHRpbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5faW1wbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faW1wbC5jdXJyZW50VGltZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3ZvbHVtZTogMSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIHZvbHVtZSBvZiB0aGUgdmlkZW8uXG4gICAgICAgICAqICEjemgg6KeG6aKR55qE6Z+z6YeP77yIMC4wIH4gMS4w77yJXG4gICAgICAgICAqIEBwcm9wZXJ0eSB2b2x1bWVcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMVxuICAgICAgICAgKi9cbiAgICAgICAgdm9sdW1lOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdm9sdW1lO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdm9sdW1lID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNQbGF5aW5nKCkgJiYgIXRoaXMuX211dGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3luY1ZvbHVtZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByYW5nZTogWzAsIDFdLFxuICAgICAgICAgICAgdHlwZTogY2MuRmxvYXQsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnZpZGVvcGxheWVyLnZvbHVtZSdcbiAgICAgICAgfSxcblxuICAgICAgICBfbXV0ZTogZmFsc2UsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIE11dGVzIHRoZSBWaWRlb1BsYXllci4gTXV0ZSBzZXRzIHRoZSB2b2x1bWU9MCwgVW4tTXV0ZSByZXN0b3JlIHRoZSBvcmlnaW5hbCB2b2x1bWUuXG4gICAgICAgICAqICEjemgg5piv5ZCm6Z2Z6Z+z6KeG6aKR44CC6Z2Z6Z+z5pe26K6+572u6Z+z6YeP5Li6IDDvvIzlj5bmtojpnZnpn7PmmK/mgaLlpI3ljp/mnaXnmoTpn7Pph4/jgIJcbiAgICAgICAgICogQHByb3BlcnR5IG11dGVcbiAgICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgICAqL1xuICAgICAgICBtdXRlOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbXV0ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX211dGUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zeW5jVm9sdW1lKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC52aWRlb3BsYXllci5tdXRlJyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBXaGV0aGVyIGtlZXAgdGhlIGFzcGVjdCByYXRpb24gb2YgdGhlIG9yaWdpbmFsIHZpZGVvLlxuICAgICAgICAgKiAhI3poIOaYr+WQpuS/neaMgeinhumikeWOn+adpeeahOWuvemrmOavlFxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGtlZXBBc3BlY3RSYXRpb1xuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICogQGRlZmF1bHQgdHJ1ZVxuICAgICAgICAgKi9cbiAgICAgICAga2VlcEFzcGVjdFJhdGlvOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnZpZGVvcGxheWVyLmtlZXBBc3BlY3RSYXRpbycsXG4gICAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICAgICAgdHlwZTogY2MuQm9vbGVhbixcbiAgICAgICAgICAgIG5vdGlmeTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2ltcGwgJiYgdGhpcy5faW1wbC5zZXRLZWVwQXNwZWN0UmF0aW9FbmFibGVkKHRoaXMua2VlcEFzcGVjdFJhdGlvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBXaGV0aGVyIHBsYXkgdmlkZW8gaW4gZnVsbHNjcmVlbiBtb2RlLlxuICAgICAgICAgKiAhI3poIOaYr+WQpuWFqOWxj+aSreaUvuinhumikVxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGlzRnVsbHNjcmVlblxuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICovXG4gICAgICAgIF9pc0Z1bGxzY3JlZW46IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgICAgZm9ybWVybHlTZXJpYWxpemVkQXM6ICdfTiRpc0Z1bGxzY3JlZW4nLFxuICAgICAgICB9LFxuICAgICAgICBpc0Z1bGxzY3JlZW46IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faXNGdWxsc2NyZWVuID0gdGhpcy5faW1wbCAmJiB0aGlzLl9pbXBsLmlzRnVsbFNjcmVlbkVuYWJsZWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzRnVsbHNjcmVlbjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKGVuYWJsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2lzRnVsbHNjcmVlbiA9IGVuYWJsZTtcbiAgICAgICAgICAgICAgICBpZiAoIUNDX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbXBsICYmIHRoaXMuX2ltcGwuc2V0RnVsbFNjcmVlbkVuYWJsZWQoZW5hYmxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnZpZGVvcGxheWVyLmlzRnVsbHNjcmVlbidcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBBbHdheXMgYmVsb3cgdGhlIGdhbWUgdmlldyAob25seSB1c2VmdWwgb24gV2ViLiBOb3RlOiBUaGUgc3BlY2lmaWMgZWZmZWN0cyBhcmUgbm90IGd1YXJhbnRlZWQgdG8gYmUgY29uc2lzdGVudCwgZGVwZW5kaW5nIG9uIHdoZXRoZXIgZWFjaCBicm93c2VyIHN1cHBvcnRzIG9yIHJlc3RyaWN0cykuXG4gICAgICAgICAqICEjemgg5rC46L+c5Zyo5ri45oiP6KeG5Zu+5pyA5bqV5bGC77yI6L+Z5Liq5bGe5oCn5Y+q5pyJ5ZyoIFdlYiDlubPlj7DkuIrmnInmlYjmnpzjgILms6jmhI/vvJrlhbfkvZPmlYjmnpzml6Dms5Xkv53or4HkuIDoh7TvvIzot5/lkITkuKrmtY/op4jlmajmmK/lkKbmlK/mjIHkuI7pmZDliLbmnInlhbPvvIlcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBzdGF5T25Cb3R0b21cbiAgICAgICAgICovXG4gICAgICAgIF9zdGF5T25Cb3R0b206IGZhbHNlLFxuICAgICAgICBzdGF5T25Cb3R0b206IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXlPbkJvdHRvbVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAoZW5hYmxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RheU9uQm90dG9tID0gZW5hYmxlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ltcGwuc2V0U3RheU9uQm90dG9tKGVuYWJsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC52aWRlb3BsYXllci5zdGF5T25Cb3R0b20nLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIHRoZSB2aWRlbyBwbGF5ZXIncyBjYWxsYmFjaywgaXQgd2lsbCBiZSB0cmlnZ2VyZWQgd2hlbiBjZXJ0YWluIGV2ZW50IG9jY3VycywgbGlrZTogcGxheWluZywgcGF1c2VkLCBzdG9wcGVkIGFuZCBjb21wbGV0ZWQuXG4gICAgICAgICAqICEjemgg6KeG6aKR5pKt5pS+5Zue6LCD5Ye95pWw77yM6K+l5Zue6LCD5Ye95pWw5Lya5Zyo54m55a6a5oOF5Ya16KKr6Kem5Y+R77yM5q+U5aaC5pKt5pS+5Lit77yM5pqC5pe277yM5YGc5q2i5ZKM5a6M5oiQ5pKt5pS+44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Q29tcG9uZW50LkV2ZW50SGFuZGxlcltdfSB2aWRlb1BsYXllckV2ZW50XG4gICAgICAgICAqL1xuICAgICAgICB2aWRlb1BsYXllckV2ZW50OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXIsXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIHN0YXRpY3M6IHtcbiAgICAgICAgRXZlbnRUeXBlOiBFdmVudFR5cGUsXG4gICAgICAgIFJlc291cmNlVHlwZTogUmVzb3VyY2VUeXBlLFxuICAgICAgICBJbXBsOiBWaWRlb1BsYXllckltcGxcbiAgICB9LFxuXG4gICAgY3RvciAoKSB7XG4gICAgICAgIHRoaXMuX2ltcGwgPSBuZXcgVmlkZW9QbGF5ZXJJbXBsKCk7XG4gICAgfSxcblxuICAgIF9zeW5jVm9sdW1lICgpIHtcbiAgICAgICAgbGV0IGltcGwgPSB0aGlzLl9pbXBsO1xuICAgICAgICBpZiAoaW1wbCkge1xuICAgICAgICAgICAgbGV0IHZvbHVtZSA9IHRoaXMuX211dGUgPyAwIDogdGhpcy5fdm9sdW1lO1xuICAgICAgICAgICAgaW1wbC5zZXRWb2x1bWUodm9sdW1lKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfdXBkYXRlVmlkZW9Tb3VyY2UgKCkge1xuICAgICAgICBsZXQgdXJsID0gJyc7XG4gICAgICAgIGlmICh0aGlzLnJlc291cmNlVHlwZSA9PT0gUmVzb3VyY2VUeXBlLlJFTU9URSkge1xuICAgICAgICAgICAgdXJsID0gdGhpcy5yZW1vdGVVUkw7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5fY2xpcCkge1xuICAgICAgICAgICAgdXJsID0gdGhpcy5fY2xpcC5uYXRpdmVVcmwgfHwgJyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVybCAmJiBjYy5sb2FkZXIubWQ1UGlwZSkge1xuICAgICAgICAgICAgdXJsID0gY2MubG9hZGVyLm1kNVBpcGUudHJhbnNmb3JtVVJMKHVybCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5faW1wbC5zZXRVUkwodXJsLCB0aGlzLl9tdXRlIHx8IHRoaXMuX3ZvbHVtZSA9PT0gMCk7XG4gICAgICAgIHRoaXMuX2ltcGwuc2V0S2VlcEFzcGVjdFJhdGlvRW5hYmxlZCh0aGlzLmtlZXBBc3BlY3RSYXRpbyk7XG4gICAgfSxcblxuICAgIG9uTG9hZCAoKSB7XG4gICAgICAgIGxldCBpbXBsID0gdGhpcy5faW1wbDtcbiAgICAgICAgaWYgKGltcGwpIHtcbiAgICAgICAgICAgIGltcGwuY3JlYXRlRG9tRWxlbWVudElmTmVlZGVkKHRoaXMuX211dGUgfHwgdGhpcy5fdm9sdW1lID09PSAwKTtcbiAgICAgICAgICAgIGltcGwuc2V0U3RheU9uQm90dG9tKHRoaXMuX3N0YXlPbkJvdHRvbSk7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVWaWRlb1NvdXJjZSgpO1xuXG4gICAgICAgICAgICBpZiAoIUNDX0VESVRPUikge1xuICAgICAgICAgICAgICAgIGltcGwuc2Vla1RvKHRoaXMuY3VycmVudFRpbWUpO1xuICAgICAgICAgICAgICAgIGltcGwuc2V0RnVsbFNjcmVlbkVuYWJsZWQodGhpcy5faXNGdWxsc2NyZWVuKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBhdXNlKCk7XG5cbiAgICAgICAgICAgICAgICBpbXBsLnNldEV2ZW50TGlzdGVuZXIoRXZlbnRUeXBlLlBMQVlJTkcsIHRoaXMub25QbGF5aW5nLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgIGltcGwuc2V0RXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuUEFVU0VELCB0aGlzLm9uUGFzdWVkLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgIGltcGwuc2V0RXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuU1RPUFBFRCwgdGhpcy5vblN0b3BwZWQuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgaW1wbC5zZXRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5DT01QTEVURUQsIHRoaXMub25Db21wbGV0ZWQuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgaW1wbC5zZXRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5NRVRBX0xPQURFRCwgdGhpcy5vbk1ldGFMb2FkZWQuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgaW1wbC5zZXRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5DTElDS0VELCB0aGlzLm9uQ2xpY2tlZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICAgICBpbXBsLnNldEV2ZW50TGlzdGVuZXIoRXZlbnRUeXBlLlJFQURZX1RPX1BMQVksIHRoaXMub25SZWFkeVRvUGxheS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvblJlc3RvcmUgKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2ltcGwpIHtcbiAgICAgICAgICAgIHRoaXMuX2ltcGwgPSBuZXcgVmlkZW9QbGF5ZXJJbXBsKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25FbmFibGUgKCkge1xuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xuICAgICAgICAgICAgdGhpcy5faW1wbC5lbmFibGUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkRpc2FibGUgKCkge1xuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xuICAgICAgICAgICAgdGhpcy5faW1wbC5kaXNhYmxlKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25EZXN0cm95ICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2ltcGwpIHtcbiAgICAgICAgICAgIHRoaXMuX2ltcGwuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5faW1wbCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdXBkYXRlIChkdCkge1xuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xuICAgICAgICAgICAgdGhpcy5faW1wbC51cGRhdGVNYXRyaXgodGhpcy5ub2RlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvblJlYWR5VG9QbGF5ICgpIHtcbiAgICAgICAgY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlci5lbWl0RXZlbnRzKHRoaXMudmlkZW9QbGF5ZXJFdmVudCwgdGhpcywgRXZlbnRUeXBlLlJFQURZX1RPX1BMQVkpO1xuICAgICAgICB0aGlzLm5vZGUuZW1pdCgncmVhZHktdG8tcGxheScsIHRoaXMpO1xuICAgIH0sXG5cbiAgICBvbk1ldGFMb2FkZWQgKCkge1xuICAgICAgICBjYy5Db21wb25lbnQuRXZlbnRIYW5kbGVyLmVtaXRFdmVudHModGhpcy52aWRlb1BsYXllckV2ZW50LCB0aGlzLCBFdmVudFR5cGUuTUVUQV9MT0FERUQpO1xuICAgICAgICB0aGlzLm5vZGUuZW1pdCgnbWV0YS1sb2FkZWQnLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgb25DbGlja2VkICgpIHtcbiAgICAgICAgY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlci5lbWl0RXZlbnRzKHRoaXMudmlkZW9QbGF5ZXJFdmVudCwgdGhpcywgRXZlbnRUeXBlLkNMSUNLRUQpO1xuICAgICAgICB0aGlzLm5vZGUuZW1pdCgnY2xpY2tlZCcsIHRoaXMpO1xuICAgIH0sXG5cbiAgICBvblBsYXlpbmcgKCkge1xuICAgICAgICBjYy5Db21wb25lbnQuRXZlbnRIYW5kbGVyLmVtaXRFdmVudHModGhpcy52aWRlb1BsYXllckV2ZW50LCB0aGlzLCBFdmVudFR5cGUuUExBWUlORyk7XG4gICAgICAgIHRoaXMubm9kZS5lbWl0KCdwbGF5aW5nJywgdGhpcyk7XG4gICAgfSxcblxuICAgIG9uUGFzdWVkICgpIHtcbiAgICAgICAgY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlci5lbWl0RXZlbnRzKHRoaXMudmlkZW9QbGF5ZXJFdmVudCwgdGhpcywgRXZlbnRUeXBlLlBBVVNFRCk7XG4gICAgICAgIHRoaXMubm9kZS5lbWl0KCdwYXVzZWQnLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgb25TdG9wcGVkICgpIHtcbiAgICAgICAgY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlci5lbWl0RXZlbnRzKHRoaXMudmlkZW9QbGF5ZXJFdmVudCwgdGhpcywgRXZlbnRUeXBlLlNUT1BQRUQpO1xuICAgICAgICB0aGlzLm5vZGUuZW1pdCgnc3RvcHBlZCcsIHRoaXMpO1xuICAgIH0sXG5cbiAgICBvbkNvbXBsZXRlZCAoKSB7XG4gICAgICAgIGNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXIuZW1pdEV2ZW50cyh0aGlzLnZpZGVvUGxheWVyRXZlbnQsIHRoaXMsIEV2ZW50VHlwZS5DT01QTEVURUQpO1xuICAgICAgICB0aGlzLm5vZGUuZW1pdCgnY29tcGxldGVkJywgdGhpcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gSWYgYSB2aWRlbyBpcyBwYXVzZWQsIGNhbGwgdGhpcyBtZXRob2QgY291bGQgcmVzdW1lIHBsYXlpbmcuIElmIGEgdmlkZW8gaXMgc3RvcHBlZCwgY2FsbCB0aGlzIG1ldGhvZCB0byBwbGF5IGZyb20gc2NyYXRjaC5cbiAgICAgKiAhI3poIOWmguaenOinhumikeiiq+aaguWBnOaSreaUvuS6hu+8jOiwg+eUqOi/meS4quaOpeWPo+WPr+S7pee7p+e7reaSreaUvuOAguWmguaenOinhumikeiiq+WBnOatouaSreaUvuS6hu+8jOiwg+eUqOi/meS4quaOpeWPo+WPr+S7peS7juWktOW8gOWni+aSreaUvuOAglxuICAgICAqIEBtZXRob2QgcGxheVxuICAgICAqL1xuICAgIHBsYXkgKCkge1xuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xuICAgICAgICAgICAgdGhpcy5fc3luY1ZvbHVtZSgpO1xuICAgICAgICAgICAgdGhpcy5faW1wbC5wbGF5KCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBJZiBhIHZpZGVvIGlzIHBhdXNlZCwgY2FsbCB0aGlzIG1ldGhvZCB0byByZXN1bWUgcGxheWluZy5cbiAgICAgKiAhI3poIOWmguaenOS4gOS4quinhumikeaSreaUvuiiq+aaguWBnOaSreaUvuS6hu+8jOiwg+eUqOi/meS4quaOpeWPo+WPr+S7pee7p+e7reaSreaUvuOAglxuICAgICAqIEBtZXRob2QgcmVzdW1lXG4gICAgICovXG4gICAgcmVzdW1lICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2ltcGwpIHtcbiAgICAgICAgICAgIHRoaXMuX3N5bmNWb2x1bWUoKTtcbiAgICAgICAgICAgIHRoaXMuX2ltcGwucmVzdW1lKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBJZiBhIHZpZGVvIGlzIHBsYXlpbmcsIGNhbGwgdGhpcyBtZXRob2QgdG8gcGF1c2UgcGxheWluZy5cbiAgICAgKiAhI3poIOWmguaenOS4gOS4quinhumikeato+WcqOaSreaUvu+8jOiwg+eUqOi/meS4quaOpeWPo+WPr+S7peaaguWBnOaSreaUvuOAglxuICAgICAqIEBtZXRob2QgcGF1c2VcbiAgICAgKi9cbiAgICBwYXVzZSAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XG4gICAgICAgICAgICB0aGlzLl9pbXBsLnBhdXNlKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBJZiBhIHZpZGVvIGlzIHBsYXlpbmcsIGNhbGwgdGhpcyBtZXRob2QgdG8gc3RvcCBwbGF5aW5nIGltbWVkaWF0ZWx5LlxuICAgICAqICEjemgg5aaC5p6c5LiA5Liq6KeG6aKR5q2j5Zyo5pKt5pS+77yM6LCD55So6L+Z5Liq5o6l5Y+j5Y+v5Lul56uL6ams5YGc5q2i5pKt5pS+44CCXG4gICAgICogQG1ldGhvZCBzdG9wXG4gICAgICovXG4gICAgc3RvcCAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XG4gICAgICAgICAgICB0aGlzLl9pbXBsLnN0b3AoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldHMgdGhlIGR1cmF0aW9uIG9mIHRoZSB2aWRlb1xuICAgICAqICEjemgg6I635Y+W6KeG6aKR5paH5Lu255qE5pKt5pS+5oC75pe26ZW/XG4gICAgICogQG1ldGhvZCBnZXREdXJhdGlvblxuICAgICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0RHVyYXRpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ltcGwuZHVyYXRpb24oKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gRGV0ZXJtaW5lIHdoZXRoZXIgdmlkZW8gaXMgcGxheWluZyBvciBub3QuXG4gICAgICogISN6aCDliKTmlq3lvZPliY3op4bpopHmmK/lkKblpITkuo7mkq3mlL7nirbmgIFcbiAgICAgKiBAbWV0aG9kIGlzUGxheWluZ1xuICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgICAqL1xuICAgIGlzUGxheWluZyAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faW1wbC5pc1BsYXlpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBpZiB5b3UgZG9uJ3QgbmVlZCB0aGUgVmlkZW9QbGF5ZXIgYW5kIGl0IGlzbid0IGluIGFueSBydW5uaW5nIFNjZW5lLCB5b3Ugc2hvdWxkXG4gICAgICogY2FsbCB0aGUgZGVzdHJveSBtZXRob2Qgb24gdGhpcyBjb21wb25lbnQgb3IgdGhlIGFzc29jaWF0ZWQgbm9kZSBleHBsaWNpdGx5LlxuICAgICAqIE90aGVyd2lzZSwgdGhlIGNyZWF0ZWQgRE9NIGVsZW1lbnQgd29uJ3QgYmUgcmVtb3ZlZCBmcm9tIHdlYiBwYWdlLlxuICAgICAqICEjemhcbiAgICAgKiDlpoLmnpzkvaDkuI3lho3kvb/nlKggVmlkZW9QbGF5ZXLvvIzlubbkuJTnu4Tku7bmnKrmt7vliqDliLDlnLrmma/kuK3vvIzpgqPkuYjkvaDlv4XpobvmiYvliqjlr7nnu4Tku7bmiJbmiYDlnKjoioLngrnosIPnlKggZGVzdHJveeOAglxuICAgICAqIOi/meagt+aJjeiDveenu+mZpOe9kemhteS4iueahCBET00g6IqC54K577yM6YG/5YWNIFdlYiDlubPlj7DlhoXlrZjms4TpnLLjgIJcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZpZGVvcGxheWVyLm5vZGUucGFyZW50ID0gbnVsbDsgIC8vIG9yICB2aWRlb3BsYXllci5ub2RlLnJlbW92ZUZyb21QYXJlbnQoZmFsc2UpO1xuICAgICAqIC8vIHdoZW4geW91IGRvbid0IG5lZWQgdmlkZW9wbGF5ZXIgYW55bW9yZVxuICAgICAqIHZpZGVvcGxheWVyLm5vZGUuZGVzdHJveSgpO1xuICAgICAqIEBtZXRob2QgZGVzdHJveVxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHdoZXRoZXIgaXQgaXMgdGhlIGZpcnN0IHRpbWUgdGhlIGRlc3Ryb3kgYmVpbmcgY2FsbGVkXG4gICAgICovXG59KTtcblxuY2MuVmlkZW9QbGF5ZXIgPSBtb2R1bGUuZXhwb3J0cyA9IFZpZGVvUGxheWVyO1xuXG4vKipcbiAqICEjZW5cbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cbiAqICEjemhcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxuICogQGV2ZW50IHJlYWR5LXRvLXBsYXlcbiAqIEBwYXJhbSB7RXZlbnQuRXZlbnRDdXN0b219IGV2ZW50XG4gKiBAcGFyYW0ge1ZpZGVvUGxheWVyfSB2aWRlb1BsYXllciAtIFRoZSBWaWRlb1BsYXllciBjb21wb25lbnQuXG4gKi9cblxuLyoqXG4gKiAhI2VuXG4gKiBOb3RlOiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgZnJvbSB0aGUgbm9kZSB0byB3aGljaCB0aGUgY29tcG9uZW50IGJlbG9uZ3MuXG4gKiAhI3poXG4gKiDms6jmhI/vvJrmraTkuovku7bmmK/ku47or6Xnu4Tku7bmiYDlsZ7nmoQgTm9kZSDkuIrpnaLmtL7lj5Hlh7rmnaXnmoTvvIzpnIDopoHnlKggbm9kZS5vbiDmnaXnm5HlkKzjgIJcbiAqIEBldmVudCBtZXRhLWxvYWRlZFxuICogQHBhcmFtIHtFdmVudC5FdmVudEN1c3RvbX0gZXZlbnRcbiAqIEBwYXJhbSB7VmlkZW9QbGF5ZXJ9IHZpZGVvUGxheWVyIC0gVGhlIFZpZGVvUGxheWVyIGNvbXBvbmVudC5cbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cbiAqICEjemhcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxuICogQGV2ZW50IGNsaWNrZWRcbiAqIEBwYXJhbSB7RXZlbnQuRXZlbnRDdXN0b219IGV2ZW50XG4gKiBAcGFyYW0ge1ZpZGVvUGxheWVyfSB2aWRlb1BsYXllciAtIFRoZSBWaWRlb1BsYXllciBjb21wb25lbnQuXG4gKi9cblxuXG4vKipcbiAqICEjZW5cbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cbiAqICEjemhcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxuICogQGV2ZW50IHBsYXlpbmdcbiAqIEBwYXJhbSB7RXZlbnQuRXZlbnRDdXN0b219IGV2ZW50XG4gKiBAcGFyYW0ge1ZpZGVvUGxheWVyfSB2aWRlb1BsYXllciAtIFRoZSBWaWRlb1BsYXllciBjb21wb25lbnQuXG4gKi9cblxuLyoqXG4gKiAhI2VuXG4gKiBOb3RlOiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgZnJvbSB0aGUgbm9kZSB0byB3aGljaCB0aGUgY29tcG9uZW50IGJlbG9uZ3MuXG4gKiAhI3poXG4gKiDms6jmhI/vvJrmraTkuovku7bmmK/ku47or6Xnu4Tku7bmiYDlsZ7nmoQgTm9kZSDkuIrpnaLmtL7lj5Hlh7rmnaXnmoTvvIzpnIDopoHnlKggbm9kZS5vbiDmnaXnm5HlkKzjgIJcbiAqIEBldmVudCBwYXVzZWRcbiAqIEBwYXJhbSB7RXZlbnQuRXZlbnRDdXN0b219IGV2ZW50XG4gKiBAcGFyYW0ge1ZpZGVvUGxheWVyfSB2aWRlb1BsYXllciAtIFRoZSBWaWRlb1BsYXllciBjb21wb25lbnQuXG4gKi9cblxuLyoqXG4gKiAhI2VuXG4gKiBOb3RlOiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgZnJvbSB0aGUgbm9kZSB0byB3aGljaCB0aGUgY29tcG9uZW50IGJlbG9uZ3MuXG4gKiAhI3poXG4gKiDms6jmhI/vvJrmraTkuovku7bmmK/ku47or6Xnu4Tku7bmiYDlsZ7nmoQgTm9kZSDkuIrpnaLmtL7lj5Hlh7rmnaXnmoTvvIzpnIDopoHnlKggbm9kZS5vbiDmnaXnm5HlkKzjgIJcbiAqIEBldmVudCBzdG9wcGVkXG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxuICogQHBhcmFtIHtWaWRlb1BsYXllcn0gdmlkZW9QbGF5ZXIgLSBUaGUgVmlkZW9QbGF5ZXIgY29tcG9uZW50LlxuICovXG5cbi8qKlxuICogISNlblxuICogTm90ZTogVGhpcyBldmVudCBpcyBlbWl0dGVkIGZyb20gdGhlIG5vZGUgdG8gd2hpY2ggdGhlIGNvbXBvbmVudCBiZWxvbmdzLlxuICogISN6aFxuICog5rOo5oSP77ya5q2k5LqL5Lu25piv5LuO6K+l57uE5Lu25omA5bGe55qEIE5vZGUg5LiK6Z2i5rS+5Y+R5Ye65p2l55qE77yM6ZyA6KaB55SoIG5vZGUub24g5p2l55uR5ZCs44CCXG4gKiBAZXZlbnQgY29tcGxldGVkXG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxuICogQHBhcmFtIHtWaWRlb1BsYXllcn0gdmlkZW9QbGF5ZXIgLSBUaGUgVmlkZW9QbGF5ZXIgY29tcG9uZW50LlxuICovXG4iXX0=