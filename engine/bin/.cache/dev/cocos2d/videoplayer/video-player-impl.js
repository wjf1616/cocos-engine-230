
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/videoplayer/video-player-impl.js';
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
var utils = require('../core/platform/utils');

var sys = require('../core/platform/CCSys');

var macro = require('../core/platform/CCMacro');

var READY_STATE = {
  HAVE_NOTHING: 0,
  HAVE_METADATA: 1,
  HAVE_CURRENT_DATA: 2,
  HAVE_FUTURE_DATA: 3,
  HAVE_ENOUGH_DATA: 4
};

var _mat4_temp = cc.mat4();

var VideoPlayerImpl = cc.Class({
  name: 'VideoPlayerImpl',
  ctor: function ctor() {
    // 播放结束等事件处理的队列
    this._EventList = {};
    this._video = null;
    this._url = '';
    this._waitingFullscreen = false;
    this._fullScreenEnabled = false;
    this._stayOnBottom = false;
    this._loadedmeta = false;
    this._loaded = false;
    this._visible = false;
    this._playing = false;
    this._ignorePause = false;
    this._forceUpdate = false; // update matrix cache

    this._m00 = 0;
    this._m01 = 0;
    this._m04 = 0;
    this._m05 = 0;
    this._m12 = 0;
    this._m13 = 0;
    this._w = 0;
    this._h = 0; //

    this.__eventListeners = {};
  },
  _bindEvent: function _bindEvent() {
    var video = this._video,
        self = this; //binding event

    var cbs = this.__eventListeners;

    cbs.loadedmetadata = function () {
      self._loadedmeta = true;
      self._forceUpdate = true;

      if (self._waitingFullscreen) {
        self._waitingFullscreen = false;

        self._toggleFullscreen(true);
      }

      self._dispatchEvent(VideoPlayerImpl.EventType.META_LOADED);
    };

    cbs.ended = function () {
      if (self._video !== video) return;
      self._playing = false;

      self._dispatchEvent(VideoPlayerImpl.EventType.COMPLETED);
    };

    cbs.play = function () {
      if (self._video !== video) return;
      self._playing = true;

      self._updateVisibility();

      self._dispatchEvent(VideoPlayerImpl.EventType.PLAYING);
    }; // pause and stop callback


    cbs.pause = function () {
      if (self._video !== video) {
        return;
      }

      self._playing = false;

      if (!self._ignorePause) {
        self._dispatchEvent(VideoPlayerImpl.EventType.PAUSED);
      }
    };

    cbs.click = function () {
      self._dispatchEvent(VideoPlayerImpl.EventType.CLICKED);
    };

    video.addEventListener("loadedmetadata", cbs.loadedmetadata);
    video.addEventListener("ended", cbs.ended);
    video.addEventListener("play", cbs.play);
    video.addEventListener("pause", cbs.pause);
    video.addEventListener("click", cbs.click);

    function onCanPlay() {
      if (self._loaded || self._playing) return;
      var video = self._video;

      if (video.readyState === READY_STATE.HAVE_ENOUGH_DATA || video.readyState === READY_STATE.HAVE_METADATA) {
        video.currentTime = 0;
        self._loaded = true;
        self._forceUpdate = true;

        self._dispatchEvent(VideoPlayerImpl.EventType.READY_TO_PLAY);

        self._updateVisibility();
      }
    }

    cbs.onCanPlay = onCanPlay;
    video.addEventListener('canplay', cbs.onCanPlay);
    video.addEventListener('canplaythrough', cbs.onCanPlay);
    video.addEventListener('suspend', cbs.onCanPlay);
  },
  _updateVisibility: function _updateVisibility() {
    var video = this._video;
    if (!video) return;

    if (this._visible) {
      video.style.visibility = 'visible';
    } else {
      video.style.visibility = 'hidden';
      video.pause();
      this._playing = false;
    }
  },
  _updateSize: function _updateSize(width, height) {
    var video = this._video;
    if (!video) return;
    video.style.width = width + 'px';
    video.style.height = height + 'px';
  },
  _createDom: function _createDom(muted) {
    var video = document.createElement('video');
    video.style.position = "absolute";
    video.style.bottom = "0px";
    video.style.left = "0px";
    video.style['z-index'] = this._stayOnBottom ? macro.MIN_ZINDEX : 0;
    video.className = "cocosVideo";
    video.setAttribute('preload', 'auto');
    video.setAttribute('webkit-playsinline', ''); // This x5-playsinline tag must be added, otherwise the play, pause events will only fire once, in the qq browser.

    video.setAttribute("x5-playsinline", '');
    video.setAttribute('playsinline', '');

    if (muted) {
      video.setAttribute('muted', '');
    }

    this._video = video;
    cc.game.container.appendChild(video);
  },
  createDomElementIfNeeded: function createDomElementIfNeeded(muted) {
    if (!this._video) {
      this._createDom(muted);
    }
  },
  removeDom: function removeDom() {
    var video = this._video;

    if (video) {
      var hasChild = utils.contains(cc.game.container, video);
      if (hasChild) cc.game.container.removeChild(video);
      var cbs = this.__eventListeners;
      video.removeEventListener("loadedmetadata", cbs.loadedmetadata);
      video.removeEventListener("ended", cbs.ended);
      video.removeEventListener("play", cbs.play);
      video.removeEventListener("pause", cbs.pause);
      video.removeEventListener("click", cbs.click);
      video.removeEventListener("canplay", cbs.onCanPlay);
      video.removeEventListener("canplaythrough", cbs.onCanPlay);
      video.removeEventListener("suspend", cbs.onCanPlay);
      cbs.loadedmetadata = null;
      cbs.ended = null;
      cbs.play = null;
      cbs.pause = null;
      cbs.click = null;
      cbs.onCanPlay = null;
    }

    this._video = null;
    this._url = "";
  },
  setURL: function setURL(path, muted) {
    var source, extname;

    if (this._url === path) {
      return;
    }

    this.removeDom();
    this._url = path;
    this.createDomElementIfNeeded(muted);

    this._bindEvent();

    var video = this._video;
    video.style["visibility"] = "hidden";
    this._loaded = false;
    this._playing = false;
    this._loadedmeta = false;
    source = document.createElement("source");
    source.src = path;
    video.appendChild(source);
    extname = cc.path.extname(path);
    var polyfill = VideoPlayerImpl._polyfill;

    for (var i = 0; i < polyfill.canPlayType.length; i++) {
      if (extname !== polyfill.canPlayType[i]) {
        source = document.createElement("source");
        source.src = path.replace(extname, polyfill.canPlayType[i]);
        video.appendChild(source);
      }
    }
  },
  getURL: function getURL() {
    return this._url;
  },
  play: function play() {
    var video = this._video;
    if (!video || !this._visible || this._playing) return;

    if (VideoPlayerImpl._polyfill.autoplayAfterOperation) {
      var self = this;
      setTimeout(function () {
        video.play();
      }, 20);
    } else {
      video.play();
    }
  },
  pause: function pause() {
    var video = this._video;
    if (!this._playing || !video) return;
    video.pause();
  },
  resume: function resume() {
    this.play();
  },
  stop: function stop() {
    var video = this._video;
    if (!video || !this._visible) return;
    this._ignorePause = true;
    video.currentTime = 0;
    video.pause();
    setTimeout(function () {
      this._dispatchEvent(VideoPlayerImpl.EventType.STOPPED);

      this._ignorePause = false;
    }.bind(this), 0);
  },
  setVolume: function setVolume(volume) {
    var video = this._video;

    if (video) {
      video.volume = volume;
    }
  },
  seekTo: function seekTo(time) {
    var video = this._video;
    if (!video) return;

    if (this._loaded) {
      video.currentTime = time;
    } else {
      var cb = function cb() {
        video.currentTime = time;
        video.removeEventListener(VideoPlayerImpl._polyfill.event, cb);
      };

      video.addEventListener(VideoPlayerImpl._polyfill.event, cb);
    }

    if (VideoPlayerImpl._polyfill.autoplayAfterOperation && this.isPlaying()) {
      setTimeout(function () {
        video.play();
      }, 20);
    }
  },
  isPlaying: function isPlaying() {
    var video = this._video;

    if (VideoPlayerImpl._polyfill.autoplayAfterOperation && this._playing) {
      setTimeout(function () {
        video.play();
      }, 20);
    }

    return this._playing;
  },
  duration: function duration() {
    var video = this._video;
    var duration = -1;
    if (!video) return duration;
    duration = video.duration;

    if (duration <= 0) {
      cc.logID(7702);
    }

    return duration;
  },
  currentTime: function currentTime() {
    var video = this._video;
    if (!video) return -1;
    return video.currentTime;
  },
  setKeepAspectRatioEnabled: function setKeepAspectRatioEnabled() {
    if (CC_EDITOR) {
      return;
    }

    cc.logID(7700);
  },
  isKeepAspectRatioEnabled: function isKeepAspectRatioEnabled() {
    return true;
  },
  _toggleFullscreen: function _toggleFullscreen(enable) {
    var self = this,
        video = this._video;

    if (!video) {
      return;
    } // Monitor video entry and exit full-screen events


    function handleFullscreenChange(event) {
      var fullscreenElement = sys.browserType === sys.BROWSER_TYPE_IE ? document.msFullscreenElement : document.fullscreenElement;
      self._fullScreenEnabled = fullscreenElement === video;
    }

    function handleFullScreenError(event) {
      self._fullScreenEnabled = false;
    }

    if (enable) {
      if (sys.browserType === sys.BROWSER_TYPE_IE) {
        // fix IE full screen content is not centered
        video.style['transform'] = '';
      }

      cc.screen.requestFullScreen(video, handleFullscreenChange, handleFullScreenError);
    } else if (cc.screen.fullScreen()) {
      cc.screen.exitFullScreen(video);
    }
  },
  setStayOnBottom: function setStayOnBottom(enabled) {
    this._stayOnBottom = enabled;
    if (!this._video) return;
    this._video.style['z-index'] = enabled ? macro.MIN_ZINDEX : 0;
  },
  setFullScreenEnabled: function setFullScreenEnabled(enable) {
    if (!this._loadedmeta && enable) {
      this._waitingFullscreen = true;
    } else {
      this._toggleFullscreen(enable);
    }
  },
  isFullScreenEnabled: function isFullScreenEnabled() {
    return this._fullScreenEnabled;
  },
  setEventListener: function setEventListener(event, callback) {
    this._EventList[event] = callback;
  },
  removeEventListener: function removeEventListener(event) {
    this._EventList[event] = null;
  },
  _dispatchEvent: function _dispatchEvent(event) {
    var callback = this._EventList[event];
    if (callback) callback.call(this, this, this._video.src);
  },
  onPlayEvent: function onPlayEvent() {
    var callback = this._EventList[VideoPlayerImpl.EventType.PLAYING];
    callback.call(this, this, this._video.src);
  },
  enable: function enable() {
    var list = VideoPlayerImpl.elements;
    if (list.indexOf(this) === -1) list.push(this);
    this.setVisible(true);
  },
  disable: function disable() {
    var list = VideoPlayerImpl.elements;
    var index = list.indexOf(this);
    if (index !== -1) list.splice(index, 1);
    this.setVisible(false);
  },
  destroy: function destroy() {
    this.disable();
    this.removeDom();
  },
  setVisible: function setVisible(visible) {
    if (this._visible !== visible) {
      this._visible = !!visible;

      this._updateVisibility();
    }
  },
  updateMatrix: function updateMatrix(node) {
    if (!this._video || !this._visible || this._fullScreenEnabled) return;
    node.getWorldMatrix(_mat4_temp);

    var renderCamera = cc.Camera._findRendererCamera(node);

    if (renderCamera) {
      renderCamera.worldMatrixToScreen(_mat4_temp, _mat4_temp, cc.game.canvas.width, cc.game.canvas.height);
    }

    var _mat4_tempm = _mat4_temp.m;

    if (!this._forceUpdate && this._m00 === _mat4_tempm[0] && this._m01 === _mat4_tempm[1] && this._m04 === _mat4_tempm[4] && this._m05 === _mat4_tempm[5] && this._m12 === _mat4_tempm[12] && this._m13 === _mat4_tempm[13] && this._w === node._contentSize.width && this._h === node._contentSize.height) {
      return;
    } // update matrix cache


    this._m00 = _mat4_tempm[0];
    this._m01 = _mat4_tempm[1];
    this._m04 = _mat4_tempm[4];
    this._m05 = _mat4_tempm[5];
    this._m12 = _mat4_tempm[12];
    this._m13 = _mat4_tempm[13];
    this._w = node._contentSize.width;
    this._h = node._contentSize.height;
    var dpr = cc.view._devicePixelRatio;
    var scaleX = 1 / dpr;
    var scaleY = 1 / dpr;
    var container = cc.game.container;
    var a = _mat4_tempm[0] * scaleX,
        b = _mat4_tempm[1],
        c = _mat4_tempm[4],
        d = _mat4_tempm[5] * scaleY;
    var offsetX = container && container.style.paddingLeft ? parseInt(container.style.paddingLeft) : 0;
    var offsetY = container && container.style.paddingBottom ? parseInt(container.style.paddingBottom) : 0;
    var w, h;

    if (VideoPlayerImpl._polyfill.zoomInvalid) {
      this._updateSize(this._w * a, this._h * d);

      a = 1;
      d = 1;
      w = this._w * scaleX;
      h = this._h * scaleY;
    } else {
      w = this._w * scaleX;
      h = this._h * scaleY;

      this._updateSize(this._w, this._h);
    }

    var appx = w * _mat4_tempm[0] * node._anchorPoint.x;
    var appy = h * _mat4_tempm[5] * node._anchorPoint.y;
    var tx = _mat4_tempm[12] * scaleX - appx + offsetX,
        ty = _mat4_tempm[13] * scaleY - appy + offsetY;
    var matrix = "matrix(" + a + "," + -b + "," + -c + "," + d + "," + tx + "," + -ty + ")";
    this._video.style['transform'] = matrix;
    this._video.style['-webkit-transform'] = matrix;
    this._video.style['transform-origin'] = '0px 100% 0px';
    this._video.style['-webkit-transform-origin'] = '0px 100% 0px'; // TODO: move into web adapter
    // video style would change when enter fullscreen on IE
    // there is no way to add fullscreenchange event listeners on IE so that we can restore the cached video style

    if (sys.browserType !== sys.BROWSER_TYPE_IE) {
      this._forceUpdate = false;
    }
  }
});
VideoPlayerImpl.EventType = {
  PLAYING: 0,
  PAUSED: 1,
  STOPPED: 2,
  COMPLETED: 3,
  META_LOADED: 4,
  CLICKED: 5,
  READY_TO_PLAY: 6
}; // video 队列，所有 vidoe 在 onEnter 的时候都会插入这个队列

VideoPlayerImpl.elements = []; // video 在 game_hide 事件中被自动暂停的队列，用于回复的时候重新开始播放

VideoPlayerImpl.pauseElements = [];
cc.game.on(cc.game.EVENT_HIDE, function () {
  var list = VideoPlayerImpl.elements;

  for (var element, i = 0; i < list.length; i++) {
    element = list[i];

    if (element.isPlaying()) {
      element.pause();
      VideoPlayerImpl.pauseElements.push(element);
    }
  }
});
cc.game.on(cc.game.EVENT_SHOW, function () {
  var list = VideoPlayerImpl.pauseElements;
  var element = list.pop();

  while (element) {
    element.play();
    element = list.pop();
  }
});
/**
 * Adapter various machines
 * @devicePixelRatio Whether you need to consider devicePixelRatio calculated position
 * @event To get the data using events
 */

VideoPlayerImpl._polyfill = {
  devicePixelRatio: false,
  event: "canplay",
  canPlayType: []
};
/**
 * Some old browser only supports Theora encode video
 * But native does not support this encode,
 * so it is best to provide mp4 and webm or ogv file
 */
// TODO: adapt wx video player
// issue: https://github.com/cocos-creator/2d-tasks/issues/1364

var dom = document.createElement("video");

if (dom.canPlayType) {
  if (dom.canPlayType("video/ogg")) {
    VideoPlayerImpl._polyfill.canPlayType.push(".ogg");

    VideoPlayerImpl._polyfill.canPlayType.push(".ogv");
  }

  if (dom.canPlayType("video/mp4")) {
    VideoPlayerImpl._polyfill.canPlayType.push(".mp4");
  }

  if (dom.canPlayType("video/webm")) {
    VideoPlayerImpl._polyfill.canPlayType.push(".webm");
  }
}

if (sys.browserType === sys.BROWSER_TYPE_FIREFOX) {
  VideoPlayerImpl._polyfill.autoplayAfterOperation = true;
}

if (sys.OS_ANDROID === sys.os && (sys.browserType === sys.BROWSER_TYPE_SOUGOU || sys.browserType === sys.BROWSER_TYPE_360)) {
  VideoPlayerImpl._polyfill.zoomInvalid = true;
}

var style = document.createElement("style");
style.innerHTML = ".cocosVideo:-moz-full-screen{transform:matrix(1,0,0,1,0,0) !important;}" + ".cocosVideo:full-screen{transform:matrix(1,0,0,1,0,0) !important;}" + ".cocosVideo:-webkit-full-screen{transform:matrix(1,0,0,1,0,0) !important;}";
document.head.appendChild(style);
module.exports = VideoPlayerImpl;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZGVvLXBsYXllci1pbXBsLmpzIl0sIm5hbWVzIjpbInV0aWxzIiwicmVxdWlyZSIsInN5cyIsIm1hY3JvIiwiUkVBRFlfU1RBVEUiLCJIQVZFX05PVEhJTkciLCJIQVZFX01FVEFEQVRBIiwiSEFWRV9DVVJSRU5UX0RBVEEiLCJIQVZFX0ZVVFVSRV9EQVRBIiwiSEFWRV9FTk9VR0hfREFUQSIsIl9tYXQ0X3RlbXAiLCJjYyIsIm1hdDQiLCJWaWRlb1BsYXllckltcGwiLCJDbGFzcyIsIm5hbWUiLCJjdG9yIiwiX0V2ZW50TGlzdCIsIl92aWRlbyIsIl91cmwiLCJfd2FpdGluZ0Z1bGxzY3JlZW4iLCJfZnVsbFNjcmVlbkVuYWJsZWQiLCJfc3RheU9uQm90dG9tIiwiX2xvYWRlZG1ldGEiLCJfbG9hZGVkIiwiX3Zpc2libGUiLCJfcGxheWluZyIsIl9pZ25vcmVQYXVzZSIsIl9mb3JjZVVwZGF0ZSIsIl9tMDAiLCJfbTAxIiwiX20wNCIsIl9tMDUiLCJfbTEyIiwiX20xMyIsIl93IiwiX2giLCJfX2V2ZW50TGlzdGVuZXJzIiwiX2JpbmRFdmVudCIsInZpZGVvIiwic2VsZiIsImNicyIsImxvYWRlZG1ldGFkYXRhIiwiX3RvZ2dsZUZ1bGxzY3JlZW4iLCJfZGlzcGF0Y2hFdmVudCIsIkV2ZW50VHlwZSIsIk1FVEFfTE9BREVEIiwiZW5kZWQiLCJDT01QTEVURUQiLCJwbGF5IiwiX3VwZGF0ZVZpc2liaWxpdHkiLCJQTEFZSU5HIiwicGF1c2UiLCJQQVVTRUQiLCJjbGljayIsIkNMSUNLRUQiLCJhZGRFdmVudExpc3RlbmVyIiwib25DYW5QbGF5IiwicmVhZHlTdGF0ZSIsImN1cnJlbnRUaW1lIiwiUkVBRFlfVE9fUExBWSIsInN0eWxlIiwidmlzaWJpbGl0eSIsIl91cGRhdGVTaXplIiwid2lkdGgiLCJoZWlnaHQiLCJfY3JlYXRlRG9tIiwibXV0ZWQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJwb3NpdGlvbiIsImJvdHRvbSIsImxlZnQiLCJNSU5fWklOREVYIiwiY2xhc3NOYW1lIiwic2V0QXR0cmlidXRlIiwiZ2FtZSIsImNvbnRhaW5lciIsImFwcGVuZENoaWxkIiwiY3JlYXRlRG9tRWxlbWVudElmTmVlZGVkIiwicmVtb3ZlRG9tIiwiaGFzQ2hpbGQiLCJjb250YWlucyIsInJlbW92ZUNoaWxkIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInNldFVSTCIsInBhdGgiLCJzb3VyY2UiLCJleHRuYW1lIiwic3JjIiwicG9seWZpbGwiLCJfcG9seWZpbGwiLCJpIiwiY2FuUGxheVR5cGUiLCJsZW5ndGgiLCJyZXBsYWNlIiwiZ2V0VVJMIiwiYXV0b3BsYXlBZnRlck9wZXJhdGlvbiIsInNldFRpbWVvdXQiLCJyZXN1bWUiLCJzdG9wIiwiU1RPUFBFRCIsImJpbmQiLCJzZXRWb2x1bWUiLCJ2b2x1bWUiLCJzZWVrVG8iLCJ0aW1lIiwiY2IiLCJldmVudCIsImlzUGxheWluZyIsImR1cmF0aW9uIiwibG9nSUQiLCJzZXRLZWVwQXNwZWN0UmF0aW9FbmFibGVkIiwiQ0NfRURJVE9SIiwiaXNLZWVwQXNwZWN0UmF0aW9FbmFibGVkIiwiZW5hYmxlIiwiaGFuZGxlRnVsbHNjcmVlbkNoYW5nZSIsImZ1bGxzY3JlZW5FbGVtZW50IiwiYnJvd3NlclR5cGUiLCJCUk9XU0VSX1RZUEVfSUUiLCJtc0Z1bGxzY3JlZW5FbGVtZW50IiwiaGFuZGxlRnVsbFNjcmVlbkVycm9yIiwic2NyZWVuIiwicmVxdWVzdEZ1bGxTY3JlZW4iLCJmdWxsU2NyZWVuIiwiZXhpdEZ1bGxTY3JlZW4iLCJzZXRTdGF5T25Cb3R0b20iLCJlbmFibGVkIiwic2V0RnVsbFNjcmVlbkVuYWJsZWQiLCJpc0Z1bGxTY3JlZW5FbmFibGVkIiwic2V0RXZlbnRMaXN0ZW5lciIsImNhbGxiYWNrIiwiY2FsbCIsIm9uUGxheUV2ZW50IiwibGlzdCIsImVsZW1lbnRzIiwiaW5kZXhPZiIsInB1c2giLCJzZXRWaXNpYmxlIiwiZGlzYWJsZSIsImluZGV4Iiwic3BsaWNlIiwiZGVzdHJveSIsInZpc2libGUiLCJ1cGRhdGVNYXRyaXgiLCJub2RlIiwiZ2V0V29ybGRNYXRyaXgiLCJyZW5kZXJDYW1lcmEiLCJDYW1lcmEiLCJfZmluZFJlbmRlcmVyQ2FtZXJhIiwid29ybGRNYXRyaXhUb1NjcmVlbiIsImNhbnZhcyIsIl9tYXQ0X3RlbXBtIiwibSIsIl9jb250ZW50U2l6ZSIsImRwciIsInZpZXciLCJfZGV2aWNlUGl4ZWxSYXRpbyIsInNjYWxlWCIsInNjYWxlWSIsImEiLCJiIiwiYyIsImQiLCJvZmZzZXRYIiwicGFkZGluZ0xlZnQiLCJwYXJzZUludCIsIm9mZnNldFkiLCJwYWRkaW5nQm90dG9tIiwidyIsImgiLCJ6b29tSW52YWxpZCIsImFwcHgiLCJfYW5jaG9yUG9pbnQiLCJ4IiwiYXBweSIsInkiLCJ0eCIsInR5IiwibWF0cml4IiwicGF1c2VFbGVtZW50cyIsIm9uIiwiRVZFTlRfSElERSIsImVsZW1lbnQiLCJFVkVOVF9TSE9XIiwicG9wIiwiZGV2aWNlUGl4ZWxSYXRpbyIsImRvbSIsIkJST1dTRVJfVFlQRV9GSVJFRk9YIiwiT1NfQU5EUk9JRCIsIm9zIiwiQlJPV1NFUl9UWVBFX1NPVUdPVSIsIkJST1dTRVJfVFlQRV8zNjAiLCJpbm5lckhUTUwiLCJoZWFkIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsSUFBTUEsS0FBSyxHQUFHQyxPQUFPLENBQUMsd0JBQUQsQ0FBckI7O0FBQ0EsSUFBTUMsR0FBRyxHQUFHRCxPQUFPLENBQUMsd0JBQUQsQ0FBbkI7O0FBQ0EsSUFBTUUsS0FBSyxHQUFHRixPQUFPLENBQUMsMEJBQUQsQ0FBckI7O0FBRUEsSUFBTUcsV0FBVyxHQUFHO0FBQ2hCQyxFQUFBQSxZQUFZLEVBQUUsQ0FERTtBQUVoQkMsRUFBQUEsYUFBYSxFQUFFLENBRkM7QUFHaEJDLEVBQUFBLGlCQUFpQixFQUFFLENBSEg7QUFJaEJDLEVBQUFBLGdCQUFnQixFQUFFLENBSkY7QUFL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QUFKLENBQWdCLFlBQWhCLENBQUosRUFBbUM7QUFDL0JoRixJQUFBQSxlQUFlLENBQUM4RSxTQUFoQixDQUEwQkUsV0FBMUIsQ0FBc0M0QyxJQUF0QyxDQUEyQyxPQUEzQztBQUNIO0FBQ0o7O0FBRUQsSUFBSXZJLEdBQUcsQ0FBQ29ILFdBQUosS0FBb0JwSCxHQUFHLENBQUMwTCxvQkFBNUIsRUFBa0Q7QUFDOUMvSyxFQUFBQSxlQUFlLENBQUM4RSxTQUFoQixDQUEwQk0sc0JBQTFCLEdBQW1ELElBQW5EO0FBQ0g7O0FBRUQsSUFDSS9GLEdBQUcsQ0FBQzJMLFVBQUosS0FBbUIzTCxHQUFHLENBQUM0TCxFQUF2QixLQUNBNUwsR0FBRyxDQUFDb0gsV0FBSixLQUFvQnBILEdBQUcsQ0FBQzZMLG1CQUF4QixJQUNBN0wsR0FBRyxDQUFDb0gsV0FBSixLQUFvQnBILEdBQUcsQ0FBQzhMLGdCQUZ4QixDQURKLEVBS0U7QUFDRW5MLEVBQUFBLGVBQWUsQ0FBQzhFLFNBQWhCLENBQTBCZ0YsV0FBMUIsR0FBd0MsSUFBeEM7QUFDSDs7QUFFRCxJQUFJOUcsS0FBSyxHQUFHTyxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBWjtBQUNBUixLQUFLLENBQUNvSSxTQUFOLEdBQWtCLDRFQUNkLG9FQURjLEdBRWQsNEVBRko7QUFHQTdILFFBQVEsQ0FBQzhILElBQVQsQ0FBY3BILFdBQWQsQ0FBMEJqQixLQUExQjtBQUVBc0ksTUFBTSxDQUFDQyxPQUFQLEdBQWlCdkwsZUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL2NvcmUvcGxhdGZvcm0vdXRpbHMnKTtcbmNvbnN0IHN5cyA9IHJlcXVpcmUoJy4uL2NvcmUvcGxhdGZvcm0vQ0NTeXMnKTtcbmNvbnN0IG1hY3JvID0gcmVxdWlyZSgnLi4vY29yZS9wbGF0Zm9ybS9DQ01hY3JvJyk7XG5cbmNvbnN0IFJFQURZX1NUQVRFID0ge1xuICAgIEhBVkVfTk9USElORzogMCxcbiAgICBIQVZFX01FVEFEQVRBOiAxLFxuICAgIEhBVkVfQ1VSUkVOVF9EQVRBOiAyLFxuICAgIEhBVkVfRlVUVVJFX0RBVEE6IDMsXG4gICAgSEFWRV9FTk9VR0hfREFUQTogNFxufTtcblxubGV0IF9tYXQ0X3RlbXAgPSBjYy5tYXQ0KCk7XG5cbmxldCBWaWRlb1BsYXllckltcGwgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ1ZpZGVvUGxheWVySW1wbCcsXG5cbiAgICBjdG9yICgpIHtcbiAgICAgICAgLy8g5pKt5pS+57uT5p2f562J5LqL5Lu25aSE55CG55qE6Zif5YiXXG4gICAgICAgIHRoaXMuX0V2ZW50TGlzdCA9IHt9O1xuXG4gICAgICAgIHRoaXMuX3ZpZGVvID0gbnVsbDtcbiAgICAgICAgdGhpcy5fdXJsID0gJyc7XG5cbiAgICAgICAgdGhpcy5fd2FpdGluZ0Z1bGxzY3JlZW4gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fZnVsbFNjcmVlbkVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fc3RheU9uQm90dG9tID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5fbG9hZGVkbWV0YSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9sb2FkZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fdmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9wbGF5aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2lnbm9yZVBhdXNlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2ZvcmNlVXBkYXRlID0gZmFsc2U7XG5cbiAgICAgICAgLy8gdXBkYXRlIG1hdHJpeCBjYWNoZVxuICAgICAgICB0aGlzLl9tMDAgPSAwO1xuICAgICAgICB0aGlzLl9tMDEgPSAwO1xuICAgICAgICB0aGlzLl9tMDQgPSAwO1xuICAgICAgICB0aGlzLl9tMDUgPSAwO1xuICAgICAgICB0aGlzLl9tMTIgPSAwO1xuICAgICAgICB0aGlzLl9tMTMgPSAwO1xuICAgICAgICB0aGlzLl93ID0gMDtcbiAgICAgICAgdGhpcy5faCA9IDA7XG4gICAgICAgIC8vXG4gICAgICAgIHRoaXMuX19ldmVudExpc3RlbmVycyA9IHt9O1xuICAgIH0sXG5cbiAgICBfYmluZEV2ZW50ICgpIHtcbiAgICAgICAgbGV0IHZpZGVvID0gdGhpcy5fdmlkZW8sIHNlbGYgPSB0aGlzO1xuICAgICAgICAvL2JpbmRpbmcgZXZlbnRcbiAgICAgICAgbGV0IGNicyA9IHRoaXMuX19ldmVudExpc3RlbmVycztcbiAgICAgICAgY2JzLmxvYWRlZG1ldGFkYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2VsZi5fbG9hZGVkbWV0YSA9IHRydWU7XG4gICAgICAgICAgICBzZWxmLl9mb3JjZVVwZGF0ZSA9IHRydWU7XG4gICAgICAgICAgICBpZiAoc2VsZi5fd2FpdGluZ0Z1bGxzY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBzZWxmLl93YWl0aW5nRnVsbHNjcmVlbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHNlbGYuX3RvZ2dsZUZ1bGxzY3JlZW4odHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLl9kaXNwYXRjaEV2ZW50KFZpZGVvUGxheWVySW1wbC5FdmVudFR5cGUuTUVUQV9MT0FERUQpO1xuICAgICAgICB9O1xuICAgICAgICBjYnMuZW5kZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5fdmlkZW8gIT09IHZpZGVvKSByZXR1cm47XG4gICAgICAgICAgICBzZWxmLl9wbGF5aW5nID0gZmFsc2U7XG4gICAgICAgICAgICBzZWxmLl9kaXNwYXRjaEV2ZW50KFZpZGVvUGxheWVySW1wbC5FdmVudFR5cGUuQ09NUExFVEVEKTtcbiAgICAgICAgfTtcbiAgICAgICAgY2JzLnBsYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5fdmlkZW8gIT09IHZpZGVvKSByZXR1cm47XG4gICAgICAgICAgICBzZWxmLl9wbGF5aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHNlbGYuX3VwZGF0ZVZpc2liaWxpdHkoKTtcbiAgICAgICAgICAgIHNlbGYuX2Rpc3BhdGNoRXZlbnQoVmlkZW9QbGF5ZXJJbXBsLkV2ZW50VHlwZS5QTEFZSU5HKTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gcGF1c2UgYW5kIHN0b3AgY2FsbGJhY2tcbiAgICAgICAgY2JzLnBhdXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHNlbGYuX3ZpZGVvICE9PSB2aWRlbykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuX3BsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmICghc2VsZi5faWdub3JlUGF1c2UpIHtcbiAgICAgICAgICAgICAgICBzZWxmLl9kaXNwYXRjaEV2ZW50KFZpZGVvUGxheWVySW1wbC5FdmVudFR5cGUuUEFVU0VEKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY2JzLmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2VsZi5fZGlzcGF0Y2hFdmVudChWaWRlb1BsYXllckltcGwuRXZlbnRUeXBlLkNMSUNLRUQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkZWRtZXRhZGF0YVwiLCBjYnMubG9hZGVkbWV0YWRhdGEpO1xuICAgICAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKFwiZW5kZWRcIiwgY2JzLmVuZGVkKTtcbiAgICAgICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihcInBsYXlcIiwgY2JzLnBsYXkpO1xuICAgICAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKFwicGF1c2VcIiwgY2JzLnBhdXNlKTtcbiAgICAgICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNicy5jbGljayk7XG5cbiAgICAgICAgZnVuY3Rpb24gb25DYW5QbGF5ICgpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLl9sb2FkZWQgfHwgc2VsZi5fcGxheWluZylcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBsZXQgdmlkZW8gPSBzZWxmLl92aWRlbztcbiAgICAgICAgICAgIGlmICh2aWRlby5yZWFkeVN0YXRlID09PSBSRUFEWV9TVEFURS5IQVZFX0VOT1VHSF9EQVRBIHx8XG4gICAgICAgICAgICAgICAgdmlkZW8ucmVhZHlTdGF0ZSA9PT0gUkVBRFlfU1RBVEUuSEFWRV9NRVRBREFUQSkge1xuICAgICAgICAgICAgICAgIHZpZGVvLmN1cnJlbnRUaW1lID0gMDtcbiAgICAgICAgICAgICAgICBzZWxmLl9sb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHNlbGYuX2ZvcmNlVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzZWxmLl9kaXNwYXRjaEV2ZW50KFZpZGVvUGxheWVySW1wbC5FdmVudFR5cGUuUkVBRFlfVE9fUExBWSk7XG4gICAgICAgICAgICAgICAgc2VsZi5fdXBkYXRlVmlzaWJpbGl0eSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2JzLm9uQ2FuUGxheSA9IG9uQ2FuUGxheTtcbiAgICAgICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignY2FucGxheScsIGNicy5vbkNhblBsYXkpO1xuICAgICAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKCdjYW5wbGF5dGhyb3VnaCcsIGNicy5vbkNhblBsYXkpO1xuICAgICAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKCdzdXNwZW5kJywgY2JzLm9uQ2FuUGxheSk7XG4gICAgfSxcblxuICAgIF91cGRhdGVWaXNpYmlsaXR5ICgpIHtcbiAgICAgICAgbGV0IHZpZGVvID0gdGhpcy5fdmlkZW87XG4gICAgICAgIGlmICghdmlkZW8pIHJldHVybjtcblxuICAgICAgICBpZiAodGhpcy5fdmlzaWJsZSkge1xuICAgICAgICAgICAgdmlkZW8uc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZpZGVvLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgICAgICAgIHZpZGVvLnBhdXNlKCk7XG4gICAgICAgICAgICB0aGlzLl9wbGF5aW5nID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3VwZGF0ZVNpemUgKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgbGV0IHZpZGVvID0gdGhpcy5fdmlkZW87XG4gICAgICAgIGlmICghdmlkZW8pIHJldHVybjtcblxuICAgICAgICB2aWRlby5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4JztcbiAgICAgICAgdmlkZW8uc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcbiAgICB9LFxuXG4gICAgX2NyZWF0ZURvbSAobXV0ZWQpIHtcbiAgICAgICAgbGV0IHZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKTtcbiAgICAgICAgdmlkZW8uc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICAgIHZpZGVvLnN0eWxlLmJvdHRvbSA9IFwiMHB4XCI7XG4gICAgICAgIHZpZGVvLnN0eWxlLmxlZnQgPSBcIjBweFwiO1xuICAgICAgICB2aWRlby5zdHlsZVsnei1pbmRleCddID0gdGhpcy5fc3RheU9uQm90dG9tID8gbWFjcm8uTUlOX1pJTkRFWCA6IDA7XG4gICAgICAgIHZpZGVvLmNsYXNzTmFtZSA9IFwiY29jb3NWaWRlb1wiO1xuICAgICAgICB2aWRlby5zZXRBdHRyaWJ1dGUoJ3ByZWxvYWQnLCAnYXV0bycpO1xuICAgICAgICB2aWRlby5zZXRBdHRyaWJ1dGUoJ3dlYmtpdC1wbGF5c2lubGluZScsICcnKTtcbiAgICAgICAgLy8gVGhpcyB4NS1wbGF5c2lubGluZSB0YWcgbXVzdCBiZSBhZGRlZCwgb3RoZXJ3aXNlIHRoZSBwbGF5LCBwYXVzZSBldmVudHMgd2lsbCBvbmx5IGZpcmUgb25jZSwgaW4gdGhlIHFxIGJyb3dzZXIuXG4gICAgICAgIHZpZGVvLnNldEF0dHJpYnV0ZShcIng1LXBsYXlzaW5saW5lXCIsICcnKTtcbiAgICAgICAgdmlkZW8uc2V0QXR0cmlidXRlKCdwbGF5c2lubGluZScsICcnKTtcbiAgICAgICAgaWYgKG11dGVkKSB7XG4gICAgICAgICAgICB2aWRlby5zZXRBdHRyaWJ1dGUoJ211dGVkJywgJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fdmlkZW8gPSB2aWRlbztcbiAgICAgICAgY2MuZ2FtZS5jb250YWluZXIuYXBwZW5kQ2hpbGQodmlkZW8pO1xuICAgIH0sXG5cbiAgICBjcmVhdGVEb21FbGVtZW50SWZOZWVkZWQ6IGZ1bmN0aW9uIChtdXRlZCkge1xuICAgICAgICBpZiAoIXRoaXMuX3ZpZGVvKSB7XG4gICAgICAgICAgICB0aGlzLl9jcmVhdGVEb20obXV0ZWQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHJlbW92ZURvbSAoKSB7XG4gICAgICAgIGxldCB2aWRlbyA9IHRoaXMuX3ZpZGVvO1xuICAgICAgICBpZiAodmlkZW8pIHtcbiAgICAgICAgICAgIGxldCBoYXNDaGlsZCA9IHV0aWxzLmNvbnRhaW5zKGNjLmdhbWUuY29udGFpbmVyLCB2aWRlbyk7XG4gICAgICAgICAgICBpZiAoaGFzQ2hpbGQpXG4gICAgICAgICAgICAgICAgY2MuZ2FtZS5jb250YWluZXIucmVtb3ZlQ2hpbGQodmlkZW8pO1xuICAgICAgICAgICAgbGV0IGNicyA9IHRoaXMuX19ldmVudExpc3RlbmVycztcbiAgICAgICAgICAgIHZpZGVvLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJsb2FkZWRtZXRhZGF0YVwiLCBjYnMubG9hZGVkbWV0YWRhdGEpO1xuICAgICAgICAgICAgdmlkZW8ucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImVuZGVkXCIsIGNicy5lbmRlZCk7XG4gICAgICAgICAgICB2aWRlby5yZW1vdmVFdmVudExpc3RlbmVyKFwicGxheVwiLCBjYnMucGxheSk7XG4gICAgICAgICAgICB2aWRlby5yZW1vdmVFdmVudExpc3RlbmVyKFwicGF1c2VcIiwgY2JzLnBhdXNlKTtcbiAgICAgICAgICAgIHZpZGVvLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjYnMuY2xpY2spO1xuICAgICAgICAgICAgdmlkZW8ucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNhbnBsYXlcIiwgY2JzLm9uQ2FuUGxheSk7XG4gICAgICAgICAgICB2aWRlby5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2FucGxheXRocm91Z2hcIiwgY2JzLm9uQ2FuUGxheSk7XG4gICAgICAgICAgICB2aWRlby5yZW1vdmVFdmVudExpc3RlbmVyKFwic3VzcGVuZFwiLCBjYnMub25DYW5QbGF5KTtcblxuICAgICAgICAgICAgY2JzLmxvYWRlZG1ldGFkYXRhID0gbnVsbDtcbiAgICAgICAgICAgIGNicy5lbmRlZCA9IG51bGw7XG4gICAgICAgICAgICBjYnMucGxheSA9IG51bGw7XG4gICAgICAgICAgICBjYnMucGF1c2UgPSBudWxsO1xuICAgICAgICAgICAgY2JzLmNsaWNrID0gbnVsbDtcbiAgICAgICAgICAgIGNicy5vbkNhblBsYXkgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fdmlkZW8gPSBudWxsO1xuICAgICAgICB0aGlzLl91cmwgPSBcIlwiO1xuICAgIH0sXG5cbiAgICBzZXRVUkwgKHBhdGgsIG11dGVkKSB7XG4gICAgICAgIGxldCBzb3VyY2UsIGV4dG5hbWU7XG5cbiAgICAgICAgaWYgKHRoaXMuX3VybCA9PT0gcGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZW1vdmVEb20oKTtcbiAgICAgICAgdGhpcy5fdXJsID0gcGF0aDtcbiAgICAgICAgdGhpcy5jcmVhdGVEb21FbGVtZW50SWZOZWVkZWQobXV0ZWQpO1xuICAgICAgICB0aGlzLl9iaW5kRXZlbnQoKTtcblxuICAgICAgICBsZXQgdmlkZW8gPSB0aGlzLl92aWRlbztcbiAgICAgICAgdmlkZW8uc3R5bGVbXCJ2aXNpYmlsaXR5XCJdID0gXCJoaWRkZW5cIjtcbiAgICAgICAgdGhpcy5fbG9hZGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3BsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fbG9hZGVkbWV0YSA9IGZhbHNlO1xuXG4gICAgICAgIHNvdXJjZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzb3VyY2VcIik7XG4gICAgICAgIHNvdXJjZS5zcmMgPSBwYXRoO1xuICAgICAgICB2aWRlby5hcHBlbmRDaGlsZChzb3VyY2UpO1xuXG4gICAgICAgIGV4dG5hbWUgPSBjYy5wYXRoLmV4dG5hbWUocGF0aCk7XG4gICAgICAgIGxldCBwb2x5ZmlsbCA9IFZpZGVvUGxheWVySW1wbC5fcG9seWZpbGw7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9seWZpbGwuY2FuUGxheVR5cGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChleHRuYW1lICE9PSBwb2x5ZmlsbC5jYW5QbGF5VHlwZVtpXSkge1xuICAgICAgICAgICAgICAgIHNvdXJjZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzb3VyY2VcIik7XG4gICAgICAgICAgICAgICAgc291cmNlLnNyYyA9IHBhdGgucmVwbGFjZShleHRuYW1lLCBwb2x5ZmlsbC5jYW5QbGF5VHlwZVtpXSk7XG4gICAgICAgICAgICAgICAgdmlkZW8uYXBwZW5kQ2hpbGQoc291cmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBnZXRVUkw6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdXJsO1xuICAgIH0sXG5cbiAgICBwbGF5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCB2aWRlbyA9IHRoaXMuX3ZpZGVvO1xuICAgICAgICBpZiAoIXZpZGVvIHx8ICF0aGlzLl92aXNpYmxlIHx8IHRoaXMuX3BsYXlpbmcpIHJldHVybjtcblxuICAgICAgICBpZiAoVmlkZW9QbGF5ZXJJbXBsLl9wb2x5ZmlsbC5hdXRvcGxheUFmdGVyT3BlcmF0aW9uKSB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2aWRlby5wbGF5KCk7XG4gICAgICAgICAgICB9LCAyMCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2aWRlby5wbGF5KCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcGF1c2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IHZpZGVvID0gdGhpcy5fdmlkZW87XG4gICAgICAgIGlmICghdGhpcy5fcGxheWluZyB8fCAhdmlkZW8pIHJldHVybjtcbiAgICAgICAgdmlkZW8ucGF1c2UoKTtcbiAgICB9LFxuXG4gICAgcmVzdW1lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucGxheSgpO1xuICAgIH0sXG5cbiAgICBzdG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCB2aWRlbyA9IHRoaXMuX3ZpZGVvO1xuICAgICAgICBpZiAoIXZpZGVvIHx8ICF0aGlzLl92aXNpYmxlKSByZXR1cm47XG4gICAgICAgIHRoaXMuX2lnbm9yZVBhdXNlID0gdHJ1ZTtcbiAgICAgICAgdmlkZW8uY3VycmVudFRpbWUgPSAwO1xuICAgICAgICB2aWRlby5wYXVzZSgpO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoVmlkZW9QbGF5ZXJJbXBsLkV2ZW50VHlwZS5TVE9QUEVEKTtcbiAgICAgICAgICAgIHRoaXMuX2lnbm9yZVBhdXNlID0gZmFsc2U7XG4gICAgICAgIH0uYmluZCh0aGlzKSwgMCk7XG5cbiAgICB9LFxuXG4gICAgc2V0Vm9sdW1lOiBmdW5jdGlvbiAodm9sdW1lKSB7XG4gICAgICAgIGxldCB2aWRlbyA9IHRoaXMuX3ZpZGVvO1xuICAgICAgICBpZiAodmlkZW8pIHtcbiAgICAgICAgICAgIHZpZGVvLnZvbHVtZSA9IHZvbHVtZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzZWVrVG86IGZ1bmN0aW9uICh0aW1lKSB7XG4gICAgICAgIGxldCB2aWRlbyA9IHRoaXMuX3ZpZGVvO1xuICAgICAgICBpZiAoIXZpZGVvKSByZXR1cm47XG5cbiAgICAgICAgaWYgKHRoaXMuX2xvYWRlZCkge1xuICAgICAgICAgICAgdmlkZW8uY3VycmVudFRpbWUgPSB0aW1lO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IGNiID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZpZGVvLmN1cnJlbnRUaW1lID0gdGltZTtcbiAgICAgICAgICAgICAgICB2aWRlby5yZW1vdmVFdmVudExpc3RlbmVyKFZpZGVvUGxheWVySW1wbC5fcG9seWZpbGwuZXZlbnQsIGNiKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKFZpZGVvUGxheWVySW1wbC5fcG9seWZpbGwuZXZlbnQsIGNiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoVmlkZW9QbGF5ZXJJbXBsLl9wb2x5ZmlsbC5hdXRvcGxheUFmdGVyT3BlcmF0aW9uICYmIHRoaXMuaXNQbGF5aW5nKCkpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZpZGVvLnBsYXkoKTtcbiAgICAgICAgICAgIH0sIDIwKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBpc1BsYXlpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IHZpZGVvID0gdGhpcy5fdmlkZW87XG4gICAgICAgIGlmIChWaWRlb1BsYXllckltcGwuX3BvbHlmaWxsLmF1dG9wbGF5QWZ0ZXJPcGVyYXRpb24gJiYgdGhpcy5fcGxheWluZykge1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmlkZW8ucGxheSgpO1xuICAgICAgICAgICAgfSwgMjApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9wbGF5aW5nO1xuICAgIH0sXG5cbiAgICBkdXJhdGlvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgdmlkZW8gPSB0aGlzLl92aWRlbztcbiAgICAgICAgbGV0IGR1cmF0aW9uID0gLTE7XG4gICAgICAgIGlmICghdmlkZW8pIHJldHVybiBkdXJhdGlvbjtcblxuICAgICAgICBkdXJhdGlvbiA9IHZpZGVvLmR1cmF0aW9uO1xuICAgICAgICBpZiAoZHVyYXRpb24gPD0gMCkge1xuICAgICAgICAgICAgY2MubG9nSUQoNzcwMik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZHVyYXRpb247XG4gICAgfSxcblxuICAgIGN1cnJlbnRUaW1lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHZpZGVvID0gdGhpcy5fdmlkZW87XG4gICAgICAgIGlmICghdmlkZW8pIHJldHVybiAtMTtcblxuICAgICAgICByZXR1cm4gdmlkZW8uY3VycmVudFRpbWU7XG4gICAgfSxcblxuICAgIHNldEtlZXBBc3BlY3RSYXRpb0VuYWJsZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNjLmxvZ0lEKDc3MDApO1xuICAgIH0sXG5cbiAgICBpc0tlZXBBc3BlY3RSYXRpb0VuYWJsZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIF90b2dnbGVGdWxsc2NyZWVuOiBmdW5jdGlvbiAoZW5hYmxlKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcywgdmlkZW8gPSB0aGlzLl92aWRlbztcbiAgICAgICAgaWYgKCF2aWRlbykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTW9uaXRvciB2aWRlbyBlbnRyeSBhbmQgZXhpdCBmdWxsLXNjcmVlbiBldmVudHNcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlRnVsbHNjcmVlbkNoYW5nZSAoZXZlbnQpIHtcbiAgICAgICAgICAgIGxldCBmdWxsc2NyZWVuRWxlbWVudCA9IHN5cy5icm93c2VyVHlwZSA9PT0gc3lzLkJST1dTRVJfVFlQRV9JRSA/IGRvY3VtZW50Lm1zRnVsbHNjcmVlbkVsZW1lbnQgOiBkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudDtcbiAgICAgICAgICAgIHNlbGYuX2Z1bGxTY3JlZW5FbmFibGVkID0gIChmdWxsc2NyZWVuRWxlbWVudCA9PT0gdmlkZW8pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUZ1bGxTY3JlZW5FcnJvciAoZXZlbnQpIHtcbiAgICAgICAgICAgIHNlbGYuX2Z1bGxTY3JlZW5FbmFibGVkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW5hYmxlKSB7XG4gICAgICAgICAgICBpZiAoc3lzLmJyb3dzZXJUeXBlID09PSBzeXMuQlJPV1NFUl9UWVBFX0lFKSB7XG4gICAgICAgICAgICAgICAgLy8gZml4IElFIGZ1bGwgc2NyZWVuIGNvbnRlbnQgaXMgbm90IGNlbnRlcmVkXG4gICAgICAgICAgICAgICAgdmlkZW8uc3R5bGVbJ3RyYW5zZm9ybSddID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYy5zY3JlZW4ucmVxdWVzdEZ1bGxTY3JlZW4odmlkZW8sIGhhbmRsZUZ1bGxzY3JlZW5DaGFuZ2UsIGhhbmRsZUZ1bGxTY3JlZW5FcnJvcik7XG4gICAgICAgIH0gZWxzZSBpZiAoY2Muc2NyZWVuLmZ1bGxTY3JlZW4oKSkge1xuICAgICAgICAgICAgY2Muc2NyZWVuLmV4aXRGdWxsU2NyZWVuKHZpZGVvKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzZXRTdGF5T25Cb3R0b206IGZ1bmN0aW9uIChlbmFibGVkKSB7XG4gICAgICAgIHRoaXMuX3N0YXlPbkJvdHRvbSA9IGVuYWJsZWQ7XG4gICAgICAgIGlmICghdGhpcy5fdmlkZW8pIHJldHVybjtcbiAgICAgICAgdGhpcy5fdmlkZW8uc3R5bGVbJ3otaW5kZXgnXSA9IGVuYWJsZWQgPyBtYWNyby5NSU5fWklOREVYIDogMDtcbiAgICB9LFxuXG4gICAgc2V0RnVsbFNjcmVlbkVuYWJsZWQ6IGZ1bmN0aW9uIChlbmFibGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9sb2FkZWRtZXRhICYmIGVuYWJsZSkge1xuICAgICAgICAgICAgdGhpcy5fd2FpdGluZ0Z1bGxzY3JlZW4gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdG9nZ2xlRnVsbHNjcmVlbihlbmFibGUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGlzRnVsbFNjcmVlbkVuYWJsZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Z1bGxTY3JlZW5FbmFibGVkO1xuICAgIH0sXG5cbiAgICBzZXRFdmVudExpc3RlbmVyOiBmdW5jdGlvbiAoZXZlbnQsIGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuX0V2ZW50TGlzdFtldmVudF0gPSBjYWxsYmFjaztcbiAgICB9LFxuXG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcjogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuX0V2ZW50TGlzdFtldmVudF0gPSBudWxsO1xuICAgIH0sXG5cbiAgICBfZGlzcGF0Y2hFdmVudDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGxldCBjYWxsYmFjayA9IHRoaXMuX0V2ZW50TGlzdFtldmVudF07XG4gICAgICAgIGlmIChjYWxsYmFjaylcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcywgdGhpcywgdGhpcy5fdmlkZW8uc3JjKTtcbiAgICB9LFxuXG4gICAgb25QbGF5RXZlbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IGNhbGxiYWNrID0gdGhpcy5fRXZlbnRMaXN0W1ZpZGVvUGxheWVySW1wbC5FdmVudFR5cGUuUExBWUlOR107XG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcywgdGhpcywgdGhpcy5fdmlkZW8uc3JjKTtcbiAgICB9LFxuXG4gICAgZW5hYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBsaXN0ID0gVmlkZW9QbGF5ZXJJbXBsLmVsZW1lbnRzO1xuICAgICAgICBpZiAobGlzdC5pbmRleE9mKHRoaXMpID09PSAtMSlcbiAgICAgICAgICAgIGxpc3QucHVzaCh0aGlzKTtcbiAgICAgICAgdGhpcy5zZXRWaXNpYmxlKHRydWUpO1xuICAgIH0sXG5cbiAgICBkaXNhYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBsaXN0ID0gVmlkZW9QbGF5ZXJJbXBsLmVsZW1lbnRzO1xuICAgICAgICBsZXQgaW5kZXggPSBsaXN0LmluZGV4T2YodGhpcyk7XG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpXG4gICAgICAgICAgICBsaXN0LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIHRoaXMuc2V0VmlzaWJsZShmYWxzZSk7XG4gICAgfSxcblxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlKCk7XG4gICAgICAgIHRoaXMucmVtb3ZlRG9tKCk7XG4gICAgfSxcblxuICAgIHNldFZpc2libGU6IGZ1bmN0aW9uICh2aXNpYmxlKSB7XG4gICAgICAgIGlmICh0aGlzLl92aXNpYmxlICE9PSB2aXNpYmxlKSB7XG4gICAgICAgICAgICB0aGlzLl92aXNpYmxlID0gISF2aXNpYmxlO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlVmlzaWJpbGl0eSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVwZGF0ZU1hdHJpeCAobm9kZSkge1xuICAgICAgICBpZiAoIXRoaXMuX3ZpZGVvIHx8ICF0aGlzLl92aXNpYmxlIHx8IHRoaXMuX2Z1bGxTY3JlZW5FbmFibGVkKSByZXR1cm47XG5cbiAgICAgICAgbm9kZS5nZXRXb3JsZE1hdHJpeChfbWF0NF90ZW1wKTtcblxuICAgICAgICBsZXQgcmVuZGVyQ2FtZXJhID0gY2MuQ2FtZXJhLl9maW5kUmVuZGVyZXJDYW1lcmEobm9kZSk7XG4gICAgICAgIGlmIChyZW5kZXJDYW1lcmEpIHtcbiAgICAgICAgICAgIHJlbmRlckNhbWVyYS53b3JsZE1hdHJpeFRvU2NyZWVuKF9tYXQ0X3RlbXAsIF9tYXQ0X3RlbXAsIGNjLmdhbWUuY2FudmFzLndpZHRoLCBjYy5nYW1lLmNhbnZhcy5oZWlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IF9tYXQ0X3RlbXBtID0gX21hdDRfdGVtcC5tO1xuICAgICAgICBpZiAoIXRoaXMuX2ZvcmNlVXBkYXRlICYmXG4gICAgICAgICAgICB0aGlzLl9tMDAgPT09IF9tYXQ0X3RlbXBtWzBdICYmIHRoaXMuX20wMSA9PT0gX21hdDRfdGVtcG1bMV0gJiZcbiAgICAgICAgICAgIHRoaXMuX20wNCA9PT0gX21hdDRfdGVtcG1bNF0gJiYgdGhpcy5fbTA1ID09PSBfbWF0NF90ZW1wbVs1XSAmJlxuICAgICAgICAgICAgdGhpcy5fbTEyID09PSBfbWF0NF90ZW1wbVsxMl0gJiYgdGhpcy5fbTEzID09PSBfbWF0NF90ZW1wbVsxM10gJiZcbiAgICAgICAgICAgIHRoaXMuX3cgPT09IG5vZGUuX2NvbnRlbnRTaXplLndpZHRoICYmIHRoaXMuX2ggPT09IG5vZGUuX2NvbnRlbnRTaXplLmhlaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdXBkYXRlIG1hdHJpeCBjYWNoZVxuICAgICAgICB0aGlzLl9tMDAgPSBfbWF0NF90ZW1wbVswXTtcbiAgICAgICAgdGhpcy5fbTAxID0gX21hdDRfdGVtcG1bMV07XG4gICAgICAgIHRoaXMuX20wNCA9IF9tYXQ0X3RlbXBtWzRdO1xuICAgICAgICB0aGlzLl9tMDUgPSBfbWF0NF90ZW1wbVs1XTtcbiAgICAgICAgdGhpcy5fbTEyID0gX21hdDRfdGVtcG1bMTJdO1xuICAgICAgICB0aGlzLl9tMTMgPSBfbWF0NF90ZW1wbVsxM107XG4gICAgICAgIHRoaXMuX3cgPSBub2RlLl9jb250ZW50U2l6ZS53aWR0aDtcbiAgICAgICAgdGhpcy5faCA9IG5vZGUuX2NvbnRlbnRTaXplLmhlaWdodDtcblxuICAgICAgICBsZXQgZHByID0gY2Mudmlldy5fZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgbGV0IHNjYWxlWCA9IDEgLyBkcHI7XG4gICAgICAgIGxldCBzY2FsZVkgPSAxIC8gZHByO1xuXG4gICAgICAgIGxldCBjb250YWluZXIgPSBjYy5nYW1lLmNvbnRhaW5lcjtcbiAgICAgICAgbGV0IGEgPSBfbWF0NF90ZW1wbVswXSAqIHNjYWxlWCwgYiA9IF9tYXQ0X3RlbXBtWzFdLCBjID0gX21hdDRfdGVtcG1bNF0sIGQgPSBfbWF0NF90ZW1wbVs1XSAqIHNjYWxlWTtcblxuICAgICAgICBsZXQgb2Zmc2V0WCA9IGNvbnRhaW5lciAmJiBjb250YWluZXIuc3R5bGUucGFkZGluZ0xlZnQgPyBwYXJzZUludChjb250YWluZXIuc3R5bGUucGFkZGluZ0xlZnQpIDogMDtcbiAgICAgICAgbGV0IG9mZnNldFkgPSBjb250YWluZXIgJiYgY29udGFpbmVyLnN0eWxlLnBhZGRpbmdCb3R0b20gPyBwYXJzZUludChjb250YWluZXIuc3R5bGUucGFkZGluZ0JvdHRvbSkgOiAwO1xuICAgICAgICBsZXQgdywgaDtcbiAgICAgICAgaWYgKFZpZGVvUGxheWVySW1wbC5fcG9seWZpbGwuem9vbUludmFsaWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVNpemUodGhpcy5fdyAqIGEsIHRoaXMuX2ggKiBkKTtcbiAgICAgICAgICAgIGEgPSAxO1xuICAgICAgICAgICAgZCA9IDE7XG4gICAgICAgICAgICB3ID0gdGhpcy5fdyAqIHNjYWxlWDtcbiAgICAgICAgICAgIGggPSB0aGlzLl9oICogc2NhbGVZO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdyA9IHRoaXMuX3cgKiBzY2FsZVg7XG4gICAgICAgICAgICBoID0gdGhpcy5faCAqIHNjYWxlWTtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVNpemUodGhpcy5fdywgdGhpcy5faCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYXBweCA9ICh3ICogX21hdDRfdGVtcG1bMF0pICogbm9kZS5fYW5jaG9yUG9pbnQueDtcbiAgICAgICAgbGV0IGFwcHkgPSAoaCAqIF9tYXQ0X3RlbXBtWzVdKSAqIG5vZGUuX2FuY2hvclBvaW50Lnk7XG5cblxuICAgICAgICBsZXQgdHggPSBfbWF0NF90ZW1wbVsxMl0gKiBzY2FsZVggLSBhcHB4ICsgb2Zmc2V0WCwgdHkgPSBfbWF0NF90ZW1wbVsxM10gKiBzY2FsZVkgLSBhcHB5ICsgb2Zmc2V0WTtcblxuICAgICAgICBsZXQgbWF0cml4ID0gXCJtYXRyaXgoXCIgKyBhICsgXCIsXCIgKyAtYiArIFwiLFwiICsgLWMgKyBcIixcIiArIGQgKyBcIixcIiArIHR4ICsgXCIsXCIgKyAtdHkgKyBcIilcIjtcbiAgICAgICAgdGhpcy5fdmlkZW8uc3R5bGVbJ3RyYW5zZm9ybSddID0gbWF0cml4O1xuICAgICAgICB0aGlzLl92aWRlby5zdHlsZVsnLXdlYmtpdC10cmFuc2Zvcm0nXSA9IG1hdHJpeDtcbiAgICAgICAgdGhpcy5fdmlkZW8uc3R5bGVbJ3RyYW5zZm9ybS1vcmlnaW4nXSA9ICcwcHggMTAwJSAwcHgnO1xuICAgICAgICB0aGlzLl92aWRlby5zdHlsZVsnLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luJ10gPSAnMHB4IDEwMCUgMHB4JztcblxuICAgICAgICAvLyBUT0RPOiBtb3ZlIGludG8gd2ViIGFkYXB0ZXJcbiAgICAgICAgLy8gdmlkZW8gc3R5bGUgd291bGQgY2hhbmdlIHdoZW4gZW50ZXIgZnVsbHNjcmVlbiBvbiBJRVxuICAgICAgICAvLyB0aGVyZSBpcyBubyB3YXkgdG8gYWRkIGZ1bGxzY3JlZW5jaGFuZ2UgZXZlbnQgbGlzdGVuZXJzIG9uIElFIHNvIHRoYXQgd2UgY2FuIHJlc3RvcmUgdGhlIGNhY2hlZCB2aWRlbyBzdHlsZVxuICAgICAgICBpZiAoc3lzLmJyb3dzZXJUeXBlICE9PSBzeXMuQlJPV1NFUl9UWVBFX0lFKSB7XG4gICAgICAgICAgICB0aGlzLl9mb3JjZVVwZGF0ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cblZpZGVvUGxheWVySW1wbC5FdmVudFR5cGUgPSB7XG4gICAgUExBWUlORzogMCxcbiAgICBQQVVTRUQ6IDEsXG4gICAgU1RPUFBFRDogMixcbiAgICBDT01QTEVURUQ6IDMsXG4gICAgTUVUQV9MT0FERUQ6IDQsXG4gICAgQ0xJQ0tFRDogNSxcbiAgICBSRUFEWV9UT19QTEFZOiA2XG59O1xuXG4vLyB2aWRlbyDpmJ/liJfvvIzmiYDmnIkgdmlkb2Ug5ZyoIG9uRW50ZXIg55qE5pe25YCZ6YO95Lya5o+S5YWl6L+Z5Liq6Zif5YiXXG5WaWRlb1BsYXllckltcGwuZWxlbWVudHMgPSBbXTtcbi8vIHZpZGVvIOWcqCBnYW1lX2hpZGUg5LqL5Lu25Lit6KKr6Ieq5Yqo5pqC5YGc55qE6Zif5YiX77yM55So5LqO5Zue5aSN55qE5pe25YCZ6YeN5paw5byA5aeL5pKt5pS+XG5WaWRlb1BsYXllckltcGwucGF1c2VFbGVtZW50cyA9IFtdO1xuXG5jYy5nYW1lLm9uKGNjLmdhbWUuRVZFTlRfSElERSwgZnVuY3Rpb24gKCkge1xuICAgIGxldCBsaXN0ID0gVmlkZW9QbGF5ZXJJbXBsLmVsZW1lbnRzO1xuICAgIGZvciAobGV0IGVsZW1lbnQsIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBlbGVtZW50ID0gbGlzdFtpXTtcbiAgICAgICAgaWYgKGVsZW1lbnQuaXNQbGF5aW5nKCkpIHtcbiAgICAgICAgICAgIGVsZW1lbnQucGF1c2UoKTtcbiAgICAgICAgICAgIFZpZGVvUGxheWVySW1wbC5wYXVzZUVsZW1lbnRzLnB1c2goZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuZ2FtZS5vbihjYy5nYW1lLkVWRU5UX1NIT1csIGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgbGlzdCA9IFZpZGVvUGxheWVySW1wbC5wYXVzZUVsZW1lbnRzO1xuICAgIGxldCBlbGVtZW50ID0gbGlzdC5wb3AoKTtcbiAgICB3aGlsZSAoZWxlbWVudCkge1xuICAgICAgICBlbGVtZW50LnBsYXkoKTtcbiAgICAgICAgZWxlbWVudCA9IGxpc3QucG9wKCk7XG4gICAgfVxufSk7XG5cblxuLyoqXG4gKiBBZGFwdGVyIHZhcmlvdXMgbWFjaGluZXNcbiAqIEBkZXZpY2VQaXhlbFJhdGlvIFdoZXRoZXIgeW91IG5lZWQgdG8gY29uc2lkZXIgZGV2aWNlUGl4ZWxSYXRpbyBjYWxjdWxhdGVkIHBvc2l0aW9uXG4gKiBAZXZlbnQgVG8gZ2V0IHRoZSBkYXRhIHVzaW5nIGV2ZW50c1xuICovXG5WaWRlb1BsYXllckltcGwuX3BvbHlmaWxsID0ge1xuICAgIGRldmljZVBpeGVsUmF0aW86IGZhbHNlLFxuICAgIGV2ZW50OiBcImNhbnBsYXlcIixcbiAgICBjYW5QbGF5VHlwZTogW11cbn07XG5cbi8qKlxuICogU29tZSBvbGQgYnJvd3NlciBvbmx5IHN1cHBvcnRzIFRoZW9yYSBlbmNvZGUgdmlkZW9cbiAqIEJ1dCBuYXRpdmUgZG9lcyBub3Qgc3VwcG9ydCB0aGlzIGVuY29kZSxcbiAqIHNvIGl0IGlzIGJlc3QgdG8gcHJvdmlkZSBtcDQgYW5kIHdlYm0gb3Igb2d2IGZpbGVcbiAqL1xuXG4vLyBUT0RPOiBhZGFwdCB3eCB2aWRlbyBwbGF5ZXJcbi8vIGlzc3VlOiBodHRwczovL2dpdGh1Yi5jb20vY29jb3MtY3JlYXRvci8yZC10YXNrcy9pc3N1ZXMvMTM2NFxubGV0IGRvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ2aWRlb1wiKTtcbmlmIChkb20uY2FuUGxheVR5cGUpIHtcbiAgICBpZiAoZG9tLmNhblBsYXlUeXBlKFwidmlkZW8vb2dnXCIpKSB7XG4gICAgICAgIFZpZGVvUGxheWVySW1wbC5fcG9seWZpbGwuY2FuUGxheVR5cGUucHVzaChcIi5vZ2dcIik7XG4gICAgICAgIFZpZGVvUGxheWVySW1wbC5fcG9seWZpbGwuY2FuUGxheVR5cGUucHVzaChcIi5vZ3ZcIik7XG4gICAgfVxuICAgIGlmIChkb20uY2FuUGxheVR5cGUoXCJ2aWRlby9tcDRcIikpIHtcbiAgICAgICAgVmlkZW9QbGF5ZXJJbXBsLl9wb2x5ZmlsbC5jYW5QbGF5VHlwZS5wdXNoKFwiLm1wNFwiKTtcbiAgICB9XG4gICAgaWYgKGRvbS5jYW5QbGF5VHlwZShcInZpZGVvL3dlYm1cIikpIHtcbiAgICAgICAgVmlkZW9QbGF5ZXJJbXBsLl9wb2x5ZmlsbC5jYW5QbGF5VHlwZS5wdXNoKFwiLndlYm1cIik7XG4gICAgfVxufVxuXG5pZiAoc3lzLmJyb3dzZXJUeXBlID09PSBzeXMuQlJPV1NFUl9UWVBFX0ZJUkVGT1gpIHtcbiAgICBWaWRlb1BsYXllckltcGwuX3BvbHlmaWxsLmF1dG9wbGF5QWZ0ZXJPcGVyYXRpb24gPSB0cnVlO1xufVxuXG5pZiAoXG4gICAgc3lzLk9TX0FORFJPSUQgPT09IHN5cy5vcyAmJiAoXG4gICAgc3lzLmJyb3dzZXJUeXBlID09PSBzeXMuQlJPV1NFUl9UWVBFX1NPVUdPVSB8fFxuICAgIHN5cy5icm93c2VyVHlwZSA9PT0gc3lzLkJST1dTRVJfVFlQRV8zNjBcbilcbikge1xuICAgIFZpZGVvUGxheWVySW1wbC5fcG9seWZpbGwuem9vbUludmFsaWQgPSB0cnVlO1xufVxuXG5sZXQgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG5zdHlsZS5pbm5lckhUTUwgPSBcIi5jb2Nvc1ZpZGVvOi1tb3otZnVsbC1zY3JlZW57dHJhbnNmb3JtOm1hdHJpeCgxLDAsMCwxLDAsMCkgIWltcG9ydGFudDt9XCIgK1xuICAgIFwiLmNvY29zVmlkZW86ZnVsbC1zY3JlZW57dHJhbnNmb3JtOm1hdHJpeCgxLDAsMCwxLDAsMCkgIWltcG9ydGFudDt9XCIgK1xuICAgIFwiLmNvY29zVmlkZW86LXdlYmtpdC1mdWxsLXNjcmVlbnt0cmFuc2Zvcm06bWF0cml4KDEsMCwwLDEsMCwwKSAhaW1wb3J0YW50O31cIjtcbmRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZGVvUGxheWVySW1wbDtcbiJdfQ==