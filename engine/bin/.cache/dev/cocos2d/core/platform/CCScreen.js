
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/CCScreen.js';
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

/**
 * The fullscreen API provides an easy way for web content to be presented using the user's entire screen.
 * It's invalid on safari, QQbrowser and android browser
 * @class screen
 */
cc.screen =
/** @lends cc.screen# */
{
  _supportsFullScreen: false,
  _onfullscreenchange: null,
  _onfullscreenerror: null,
  // the pre fullscreenchange function
  _preOnFullScreenChange: null,
  _preOnFullScreenError: null,
  _preOnTouch: null,
  _touchEvent: "",
  _fn: null,
  // Function mapping for cross browser support
  _fnMap: [['requestFullscreen', 'exitFullscreen', 'fullscreenchange', 'fullscreenEnabled', 'fullscreenElement', 'fullscreenerror'], ['requestFullScreen', 'exitFullScreen', 'fullScreenchange', 'fullScreenEnabled', 'fullScreenElement', 'fullscreenerror'], ['webkitRequestFullScreen', 'webkitCancelFullScreen', 'webkitfullscreenchange', 'webkitIsFullScreen', 'webkitCurrentFullScreenElement', 'webkitfullscreenerror'], ['mozRequestFullScreen', 'mozCancelFullScreen', 'mozfullscreenchange', 'mozFullScreen', 'mozFullScreenElement', 'mozfullscreenerror'], ['msRequestFullscreen', 'msExitFullscreen', 'MSFullscreenChange', 'msFullscreenEnabled', 'msFullscreenElement', 'msfullscreenerror']],

  /**
   * initialize
   * @method init
   */
  init: function init() {
    this._fn = {};
    var i,
        l,
        val,
        map = this._fnMap,
        valL;

    for (i = 0, l = map.length; i < l; i++) {
      val = map[i];

      if (val && typeof document[val[1]] !== 'undefined') {
        for (i = 0, valL = val.length; i < valL; i++) {
          this._fn[map[0][i]] = val[i];
        }

        break;
      }
    }

    this._supportsFullScreen = this._fn.requestFullscreen !== undefined; // Bug fix only for v2.1, don't merge into v2.0
    // In v2.0, screen touchend events conflict with editBox touchend events if it's not stayOnTop.
    // While in v2.1, editBox always keep stayOnTop and it doesn't support touchend events.

    this._touchEvent = 'ontouchend' in window ? 'touchend' : 'mousedown';
  },

  /**
   * return true if it's full now.
   * @method fullScreen
   * @returns {Boolean}
   */
  fullScreen: function fullScreen() {
    if (!this._supportsFullScreen) return false;else if (!document[this._fn.fullscreenElement] && !document[this._fn.webkitFullscreenElement] && !document[this._fn.mozFullScreenElement]) {
      return false;
    } else {
      return true;
    }
  },

  /**
   * change the screen to full mode.
   * @method requestFullScreen
   * @param {Element} element
   * @param {Function} onFullScreenChange
   * @param {Function} onFullScreenError
   */
  requestFullScreen: function requestFullScreen(element, onFullScreenChange, onFullScreenError) {
    if (element && element.tagName.toLowerCase() === "video") {
      if (cc.sys.os === cc.sys.OS_IOS && cc.sys.isBrowser && element.readyState > 0) {
        element.webkitEnterFullscreen && element.webkitEnterFullscreen();
        return;
      } else {
        element.setAttribute("x5-video-player-fullscreen", "true");
      }
    }

    if (!this._supportsFullScreen) {
      return;
    }

    element = element || document.documentElement;

    if (onFullScreenChange) {
      var eventName = this._fn.fullscreenchange;

      if (this._onfullscreenchange) {
        document.removeEventListener(eventName, this._onfullscreenchange);
      }

      this._onfullscreenchange = onFullScreenChange;
      document.addEventListener(eventName, onFullScreenChange, false);
    }

    if (onFullScreenError) {
      var _eventName = this._fn.fullscreenerror;

      if (this._onfullscreenerror) {
        document.removeEventListener(_eventName, this._onfullscreenerror);
      }

      this._onfullscreenerror = onFullScreenError;
      document.addEventListener(_eventName, onFullScreenError, {
        once: true
      });
    }

    element[this._fn.requestFullscreen]();
  },

  /**
   * exit the full mode.
   * @method exitFullScreen
   * @return {Boolean}
   */
  exitFullScreen: function exitFullScreen(element) {
    if (element && element.tagName.toLowerCase() === "video") {
      if (cc.sys.os === cc.sys.OS_IOS && cc.sys.isBrowser) {
        element.webkitExitFullscreen && element.webkitExitFullscreen();
        return;
      } else {
        element.setAttribute("x5-video-player-fullscreen", "false");
      }
    }

    return this._supportsFullScreen ? document[this._fn.exitFullscreen]() : true;
  },

  /**
   * Automatically request full screen with a touch/click event
   * @method autoFullScreen
   * @param {Element} element
   * @param {Function} onFullScreenChange
   */
  autoFullScreen: function autoFullScreen(element, onFullScreenChange) {
    element = element || document.body;

    this._ensureFullScreen(element, onFullScreenChange);

    this.requestFullScreen(element, onFullScreenChange);
  },
  disableAutoFullScreen: function disableAutoFullScreen(element) {
    var touchTarget = cc.game.canvas || element;
    var touchEventName = this._touchEvent;

    if (this._preOnTouch) {
      touchTarget.removeEventListener(touchEventName, this._preOnTouch);
      this._preOnTouch = null;
    }
  },
  // Register touch event if request full screen failed
  _ensureFullScreen: function _ensureFullScreen(element, onFullScreenChange) {
    var self = this;
    var touchTarget = cc.game.canvas || element;
    var fullScreenErrorEventName = this._fn.fullscreenerror;
    if (typeof document[fullScreenErrorEventName] === "undefined") return;
    var touchEventName = this._touchEvent;

    function onFullScreenError() {
      self._preOnFullScreenError = null; // handle touch event listener

      function onTouch() {
        self._preOnTouch = null;
        self.requestFullScreen(element, onFullScreenChange);
      }

      if (self._preOnTouch) {
        touchTarget.removeEventListener(touchEventName, self._preOnTouch);
      }

      self._preOnTouch = onTouch;
      touchTarget.addEventListener(touchEventName, self._preOnTouch, {
        once: true
      });
    } // handle full screen error


    if (this._preOnFullScreenError) {
      element.removeEventListener(fullScreenErrorEventName, this._preOnFullScreenError);
    }

    this._preOnFullScreenError = onFullScreenError;
    element.addEventListener(fullScreenErrorEventName, onFullScreenError, {
      once: true
    });
  }
};
cc.screen.init();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDU2NyZWVuLmpzIl0sIm5hbWVzIjpbImNjIiwic2NyZWVuIiwiX3N1cHBvcnRzRnVsbFNjcmVlbiIsIl9vbmZ1bGxzY3JlZW5jaGFuZ2UiLCJfb25mdWxsc2NyZWVuZXJyb3IiLCJfcHJlT25GdWxsU2NyZWVuQ2hhbmdlIiwiX3ByZU9uRnVsbFNjcmVlbkVycm9yIiwiX3ByZU9uVG91Y2giLCJfdG91Y2hFdmVudCIsIl9mbiIsIl9mbk1hcCIsImluaXQiLCJpIiwibCIsInZhbCIsIm1hcCIsInZhbEwiLCJsZW5ndGgiLCJkb2N1bWVudCIsInJlcXVlc3RGdWxsc2NyZWVuIiwidW5kZWZpbmVkIiwid2luZG93IiwiZnVsbFNjcmVlbiIsImZ1bGxzY3JlZW5FbGVtZW50Iiwid2Via2l0RnVsbHNjcmVlbkVsZW1lbnQiLCJtb3pGdWxsU2NyZWVuRWxlbWVudCIsInJlcXVlc3RGdWxsU2NyZWVuIiwiZWxlbWVudCIsIm9uRnVsbFNjcmVlbkNoYW5nZSIsIm9uRnVsbFNjcmVlbkVycm9yIiwidGFnTmFtZSIsInRvTG93ZXJDYXNlIiwic3lzIiwib3MiLCJPU19JT1MiLCJpc0Jyb3dzZXIiLCJyZWFkeVN0YXRlIiwid2Via2l0RW50ZXJGdWxsc2NyZWVuIiwic2V0QXR0cmlidXRlIiwiZG9jdW1lbnRFbGVtZW50IiwiZXZlbnROYW1lIiwiZnVsbHNjcmVlbmNoYW5nZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJhZGRFdmVudExpc3RlbmVyIiwiZnVsbHNjcmVlbmVycm9yIiwib25jZSIsImV4aXRGdWxsU2NyZWVuIiwid2Via2l0RXhpdEZ1bGxzY3JlZW4iLCJleGl0RnVsbHNjcmVlbiIsImF1dG9GdWxsU2NyZWVuIiwiYm9keSIsIl9lbnN1cmVGdWxsU2NyZWVuIiwiZGlzYWJsZUF1dG9GdWxsU2NyZWVuIiwidG91Y2hUYXJnZXQiLCJnYW1lIiwiY2FudmFzIiwidG91Y2hFdmVudE5hbWUiLCJzZWxmIiwiZnVsbFNjcmVlbkVycm9yRXZlbnROYW1lIiwib25U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Q0FrRCxRQUFBQSxJQUFJLENBQUMvQixpQkFBTCxDQUF1QkMsT0FBdkIsRUFBZ0NDLGtCQUFoQztBQUNIOztBQUNELFVBQUk2QixJQUFJLENBQUNsRCxXQUFULEVBQXNCO0FBQ2xCOEMsUUFBQUEsV0FBVyxDQUFDWCxtQkFBWixDQUFnQ2MsY0FBaEMsRUFBZ0RDLElBQUksQ0FBQ2xELFdBQXJEO0FBQ0g7O0FBQ0RrRCxNQUFBQSxJQUFJLENBQUNsRCxXQUFMLEdBQW1Cb0QsT0FBbkI7QUFDQU4sTUFBQUEsV0FBVyxDQUFDVixnQkFBWixDQUE2QmEsY0FBN0IsRUFBNkNDLElBQUksQ0FBQ2xELFdBQWxELEVBQStEO0FBQUVzQyxRQUFBQSxJQUFJLEVBQUU7QUFBUixPQUEvRDtBQUNILEtBcEIyQyxDQXNCNUM7OztBQUNBLFFBQUksS0FBS3ZDLHFCQUFULEVBQWdDO0FBQzVCcUIsTUFBQUEsT0FBTyxDQUFDZSxtQkFBUixDQUE0QmdCLHdCQUE1QixFQUFzRCxLQUFLcEQscUJBQTNEO0FBQ0g7O0FBQ0QsU0FBS0EscUJBQUwsR0FBNkJ1QixpQkFBN0I7QUFDQUYsSUFBQUEsT0FBTyxDQUFDZ0IsZ0JBQVIsQ0FBeUJlLHdCQUF6QixFQUFtRDdCLGlCQUFuRCxFQUFzRTtBQUFFZ0IsTUFBQUEsSUFBSSxFQUFFO0FBQVIsS0FBdEU7QUFDSDtBQS9NK0IsQ0FBcEM7QUFpTkE3QyxFQUFFLENBQUNDLE1BQUgsQ0FBVVUsSUFBViIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDA4LTIwMTAgUmljYXJkbyBRdWVzYWRhXG4gQ29weXJpZ2h0IChjKSAyMDExLTIwMTIgY29jb3MyZC14Lm9yZ1xuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cbiBcbiBodHRwOi8vd3d3LmNvY29zMmQteC5vcmdcbiBcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiBcbiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuIFxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qKlxuICogVGhlIGZ1bGxzY3JlZW4gQVBJIHByb3ZpZGVzIGFuIGVhc3kgd2F5IGZvciB3ZWIgY29udGVudCB0byBiZSBwcmVzZW50ZWQgdXNpbmcgdGhlIHVzZXIncyBlbnRpcmUgc2NyZWVuLlxuICogSXQncyBpbnZhbGlkIG9uIHNhZmFyaSwgUVFicm93c2VyIGFuZCBhbmRyb2lkIGJyb3dzZXJcbiAqIEBjbGFzcyBzY3JlZW5cbiAqL1xuY2Muc2NyZWVuID0gLyoqIEBsZW5kcyBjYy5zY3JlZW4jICove1xuICAgIF9zdXBwb3J0c0Z1bGxTY3JlZW46IGZhbHNlLFxuICAgIF9vbmZ1bGxzY3JlZW5jaGFuZ2U6IG51bGwsXG4gICAgX29uZnVsbHNjcmVlbmVycm9yOiBudWxsLFxuICAgIC8vIHRoZSBwcmUgZnVsbHNjcmVlbmNoYW5nZSBmdW5jdGlvblxuICAgIF9wcmVPbkZ1bGxTY3JlZW5DaGFuZ2U6IG51bGwsXG4gICAgX3ByZU9uRnVsbFNjcmVlbkVycm9yOiBudWxsLFxuICAgIF9wcmVPblRvdWNoOiBudWxsLFxuICAgIF90b3VjaEV2ZW50OiBcIlwiLFxuICAgIF9mbjogbnVsbCxcbiAgICAvLyBGdW5jdGlvbiBtYXBwaW5nIGZvciBjcm9zcyBicm93c2VyIHN1cHBvcnRcbiAgICBfZm5NYXA6IFtcbiAgICAgICAgW1xuICAgICAgICAgICAgJ3JlcXVlc3RGdWxsc2NyZWVuJyxcbiAgICAgICAgICAgICdleGl0RnVsbHNjcmVlbicsXG4gICAgICAgICAgICAnZnVsbHNjcmVlbmNoYW5nZScsXG4gICAgICAgICAgICAnZnVsbHNjcmVlbkVuYWJsZWQnLFxuICAgICAgICAgICAgJ2Z1bGxzY3JlZW5FbGVtZW50JyxcbiAgICAgICAgICAgICdmdWxsc2NyZWVuZXJyb3InLFxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgICAncmVxdWVzdEZ1bGxTY3JlZW4nLFxuICAgICAgICAgICAgJ2V4aXRGdWxsU2NyZWVuJyxcbiAgICAgICAgICAgICdmdWxsU2NyZWVuY2hhbmdlJyxcbiAgICAgICAgICAgICdmdWxsU2NyZWVuRW5hYmxlZCcsXG4gICAgICAgICAgICAnZnVsbFNjcmVlbkVsZW1lbnQnLFxuICAgICAgICAgICAgJ2Z1bGxzY3JlZW5lcnJvcicsXG4gICAgICAgIF0sXG4gICAgICAgIFtcbiAgICAgICAgICAgICd3ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbicsXG4gICAgICAgICAgICAnd2Via2l0Q2FuY2VsRnVsbFNjcmVlbicsXG4gICAgICAgICAgICAnd2Via2l0ZnVsbHNjcmVlbmNoYW5nZScsXG4gICAgICAgICAgICAnd2Via2l0SXNGdWxsU2NyZWVuJyxcbiAgICAgICAgICAgICd3ZWJraXRDdXJyZW50RnVsbFNjcmVlbkVsZW1lbnQnLFxuICAgICAgICAgICAgJ3dlYmtpdGZ1bGxzY3JlZW5lcnJvcicsXG4gICAgICAgIF0sXG4gICAgICAgIFtcbiAgICAgICAgICAgICdtb3pSZXF1ZXN0RnVsbFNjcmVlbicsXG4gICAgICAgICAgICAnbW96Q2FuY2VsRnVsbFNjcmVlbicsXG4gICAgICAgICAgICAnbW96ZnVsbHNjcmVlbmNoYW5nZScsXG4gICAgICAgICAgICAnbW96RnVsbFNjcmVlbicsXG4gICAgICAgICAgICAnbW96RnVsbFNjcmVlbkVsZW1lbnQnLFxuICAgICAgICAgICAgJ21vemZ1bGxzY3JlZW5lcnJvcicsXG4gICAgICAgIF0sXG4gICAgICAgIFtcbiAgICAgICAgICAgICdtc1JlcXVlc3RGdWxsc2NyZWVuJyxcbiAgICAgICAgICAgICdtc0V4aXRGdWxsc2NyZWVuJyxcbiAgICAgICAgICAgICdNU0Z1bGxzY3JlZW5DaGFuZ2UnLFxuICAgICAgICAgICAgJ21zRnVsbHNjcmVlbkVuYWJsZWQnLFxuICAgICAgICAgICAgJ21zRnVsbHNjcmVlbkVsZW1lbnQnLFxuICAgICAgICAgICAgJ21zZnVsbHNjcmVlbmVycm9yJyxcbiAgICAgICAgXVxuICAgIF0sXG4gICAgXG4gICAgLyoqXG4gICAgICogaW5pdGlhbGl6ZVxuICAgICAqIEBtZXRob2QgaW5pdFxuICAgICAqL1xuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fZm4gPSB7fTtcbiAgICAgICAgdmFyIGksIGwsIHZhbCwgbWFwID0gdGhpcy5fZm5NYXAsIHZhbEw7XG4gICAgICAgIGZvciAoaSA9IDAsIGwgPSBtYXAubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICB2YWwgPSBtYXBbaV07XG4gICAgICAgICAgICBpZiAodmFsICYmICh0eXBlb2YgZG9jdW1lbnRbdmFsWzFdXSAhPT0gJ3VuZGVmaW5lZCcpKSB7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMCwgdmFsTCA9IHZhbC5sZW5ndGg7IGkgPCB2YWxMOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm5bbWFwWzBdW2ldXSA9IHZhbFtpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9zdXBwb3J0c0Z1bGxTY3JlZW4gPSAodGhpcy5fZm4ucmVxdWVzdEZ1bGxzY3JlZW4gIT09IHVuZGVmaW5lZCk7XG5cbiAgICAgICAgLy8gQnVnIGZpeCBvbmx5IGZvciB2Mi4xLCBkb24ndCBtZXJnZSBpbnRvIHYyLjBcbiAgICAgICAgLy8gSW4gdjIuMCwgc2NyZWVuIHRvdWNoZW5kIGV2ZW50cyBjb25mbGljdCB3aXRoIGVkaXRCb3ggdG91Y2hlbmQgZXZlbnRzIGlmIGl0J3Mgbm90IHN0YXlPblRvcC5cbiAgICAgICAgLy8gV2hpbGUgaW4gdjIuMSwgZWRpdEJveCBhbHdheXMga2VlcCBzdGF5T25Ub3AgYW5kIGl0IGRvZXNuJ3Qgc3VwcG9ydCB0b3VjaGVuZCBldmVudHMuXG4gICAgICAgIHRoaXMuX3RvdWNoRXZlbnQgPSAoJ29udG91Y2hlbmQnIGluIHdpbmRvdykgPyAndG91Y2hlbmQnIDogJ21vdXNlZG93bic7XG4gICAgfSxcbiAgICBcbiAgICAvKipcbiAgICAgKiByZXR1cm4gdHJ1ZSBpZiBpdCdzIGZ1bGwgbm93LlxuICAgICAqIEBtZXRob2QgZnVsbFNjcmVlblxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgICAqL1xuICAgIGZ1bGxTY3JlZW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9zdXBwb3J0c0Z1bGxTY3JlZW4pIHJldHVybiBmYWxzZTtcbiAgICAgICAgZWxzZSBpZiAoIWRvY3VtZW50W3RoaXMuX2ZuLmZ1bGxzY3JlZW5FbGVtZW50XSAmJiAhZG9jdW1lbnRbdGhpcy5fZm4ud2Via2l0RnVsbHNjcmVlbkVsZW1lbnRdICYmICFkb2N1bWVudFt0aGlzLl9mbi5tb3pGdWxsU2NyZWVuRWxlbWVudF0pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBcbiAgICAvKipcbiAgICAgKiBjaGFuZ2UgdGhlIHNjcmVlbiB0byBmdWxsIG1vZGUuXG4gICAgICogQG1ldGhvZCByZXF1ZXN0RnVsbFNjcmVlblxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG9uRnVsbFNjcmVlbkNoYW5nZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG9uRnVsbFNjcmVlbkVycm9yXG4gICAgICovXG4gICAgcmVxdWVzdEZ1bGxTY3JlZW46IGZ1bmN0aW9uIChlbGVtZW50LCBvbkZ1bGxTY3JlZW5DaGFuZ2UsIG9uRnVsbFNjcmVlbkVycm9yKSB7XG4gICAgICAgIGlmIChlbGVtZW50ICYmIGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcInZpZGVvXCIpIHtcbiAgICAgICAgICAgIGlmIChjYy5zeXMub3MgPT09IGNjLnN5cy5PU19JT1MgJiYgY2Muc3lzLmlzQnJvd3NlciAmJiBlbGVtZW50LnJlYWR5U3RhdGUgPiAwKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC53ZWJraXRFbnRlckZ1bGxzY3JlZW4gJiYgZWxlbWVudC53ZWJraXRFbnRlckZ1bGxzY3JlZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcIng1LXZpZGVvLXBsYXllci1mdWxsc2NyZWVuXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5fc3VwcG9ydHNGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtZW50ID0gZWxlbWVudCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cbiAgICAgICAgaWYgKG9uRnVsbFNjcmVlbkNoYW5nZSkge1xuICAgICAgICAgICAgbGV0IGV2ZW50TmFtZSA9IHRoaXMuX2ZuLmZ1bGxzY3JlZW5jaGFuZ2U7XG4gICAgICAgICAgICBpZiAodGhpcy5fb25mdWxsc2NyZWVuY2hhbmdlKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHRoaXMuX29uZnVsbHNjcmVlbmNoYW5nZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9vbmZ1bGxzY3JlZW5jaGFuZ2UgPSBvbkZ1bGxTY3JlZW5DaGFuZ2U7XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgb25GdWxsU2NyZWVuQ2hhbmdlLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9uRnVsbFNjcmVlbkVycm9yKSB7XG4gICAgICAgICAgICBsZXQgZXZlbnROYW1lID0gdGhpcy5fZm4uZnVsbHNjcmVlbmVycm9yO1xuICAgICAgICAgICAgaWYgKHRoaXMuX29uZnVsbHNjcmVlbmVycm9yKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHRoaXMuX29uZnVsbHNjcmVlbmVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX29uZnVsbHNjcmVlbmVycm9yID0gb25GdWxsU2NyZWVuRXJyb3I7XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgb25GdWxsU2NyZWVuRXJyb3IsIHsgb25jZTogdHJ1ZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVsZW1lbnRbdGhpcy5fZm4ucmVxdWVzdEZ1bGxzY3JlZW5dKCk7XG4gICAgfSxcbiAgICBcbiAgICAvKipcbiAgICAgKiBleGl0IHRoZSBmdWxsIG1vZGUuXG4gICAgICogQG1ldGhvZCBleGl0RnVsbFNjcmVlblxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgZXhpdEZ1bGxTY3JlZW46IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGlmIChlbGVtZW50ICYmIGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcInZpZGVvXCIpIHtcbiAgICAgICAgICAgIGlmIChjYy5zeXMub3MgPT09IGNjLnN5cy5PU19JT1MgJiYgY2Muc3lzLmlzQnJvd3Nlcikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQud2Via2l0RXhpdEZ1bGxzY3JlZW4gJiYgZWxlbWVudC53ZWJraXRFeGl0RnVsbHNjcmVlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwieDUtdmlkZW8tcGxheWVyLWZ1bGxzY3JlZW5cIiwgXCJmYWxzZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fc3VwcG9ydHNGdWxsU2NyZWVuID8gZG9jdW1lbnRbdGhpcy5fZm4uZXhpdEZ1bGxzY3JlZW5dKCkgOiB0cnVlO1xuICAgIH0sXG4gICAgXG4gICAgLyoqXG4gICAgICogQXV0b21hdGljYWxseSByZXF1ZXN0IGZ1bGwgc2NyZWVuIHdpdGggYSB0b3VjaC9jbGljayBldmVudFxuICAgICAqIEBtZXRob2QgYXV0b0Z1bGxTY3JlZW5cbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvbkZ1bGxTY3JlZW5DaGFuZ2VcbiAgICAgKi9cbiAgICBhdXRvRnVsbFNjcmVlbjogZnVuY3Rpb24gKGVsZW1lbnQsIG9uRnVsbFNjcmVlbkNoYW5nZSkge1xuICAgICAgICBlbGVtZW50ID0gZWxlbWVudCB8fCBkb2N1bWVudC5ib2R5O1xuXG4gICAgICAgIHRoaXMuX2Vuc3VyZUZ1bGxTY3JlZW4oZWxlbWVudCwgb25GdWxsU2NyZWVuQ2hhbmdlKTtcbiAgICAgICAgdGhpcy5yZXF1ZXN0RnVsbFNjcmVlbihlbGVtZW50LCBvbkZ1bGxTY3JlZW5DaGFuZ2UpO1xuICAgIH0sXG5cbiAgICBkaXNhYmxlQXV0b0Z1bGxTY3JlZW4gKGVsZW1lbnQpIHtcbiAgICAgICAgbGV0IHRvdWNoVGFyZ2V0ID0gY2MuZ2FtZS5jYW52YXMgfHwgZWxlbWVudDtcbiAgICAgICAgbGV0IHRvdWNoRXZlbnROYW1lID0gdGhpcy5fdG91Y2hFdmVudDtcbiAgICAgICAgaWYgKHRoaXMuX3ByZU9uVG91Y2gpIHtcbiAgICAgICAgICAgIHRvdWNoVGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIodG91Y2hFdmVudE5hbWUsIHRoaXMuX3ByZU9uVG91Y2gpO1xuICAgICAgICAgICAgdGhpcy5fcHJlT25Ub3VjaCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gUmVnaXN0ZXIgdG91Y2ggZXZlbnQgaWYgcmVxdWVzdCBmdWxsIHNjcmVlbiBmYWlsZWRcbiAgICBfZW5zdXJlRnVsbFNjcmVlbiAoZWxlbWVudCwgb25GdWxsU2NyZWVuQ2hhbmdlKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgbGV0IHRvdWNoVGFyZ2V0ID0gY2MuZ2FtZS5jYW52YXMgfHwgZWxlbWVudDtcbiAgICAgICAgbGV0IGZ1bGxTY3JlZW5FcnJvckV2ZW50TmFtZSA9IHRoaXMuX2ZuLmZ1bGxzY3JlZW5lcnJvcjtcbiAgICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudFtmdWxsU2NyZWVuRXJyb3JFdmVudE5hbWVdID09PSBcInVuZGVmaW5lZFwiKSByZXR1cm47XG4gICAgICAgIGxldCB0b3VjaEV2ZW50TmFtZSA9IHRoaXMuX3RvdWNoRXZlbnQ7XG4gICAgICAgIFxuICAgICAgICBmdW5jdGlvbiBvbkZ1bGxTY3JlZW5FcnJvciAoKSB7XG4gICAgICAgICAgICBzZWxmLl9wcmVPbkZ1bGxTY3JlZW5FcnJvciA9IG51bGw7XG5cbiAgICAgICAgICAgIC8vIGhhbmRsZSB0b3VjaCBldmVudCBsaXN0ZW5lclxuICAgICAgICAgICAgZnVuY3Rpb24gb25Ub3VjaCgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLl9wcmVPblRvdWNoID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzZWxmLnJlcXVlc3RGdWxsU2NyZWVuKGVsZW1lbnQsIG9uRnVsbFNjcmVlbkNoYW5nZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZi5fcHJlT25Ub3VjaCkge1xuICAgICAgICAgICAgICAgIHRvdWNoVGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIodG91Y2hFdmVudE5hbWUsIHNlbGYuX3ByZU9uVG91Y2gpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5fcHJlT25Ub3VjaCA9IG9uVG91Y2g7XG4gICAgICAgICAgICB0b3VjaFRhcmdldC5hZGRFdmVudExpc3RlbmVyKHRvdWNoRXZlbnROYW1lLCBzZWxmLl9wcmVPblRvdWNoLCB7IG9uY2U6IHRydWUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBoYW5kbGUgZnVsbCBzY3JlZW4gZXJyb3JcbiAgICAgICAgaWYgKHRoaXMuX3ByZU9uRnVsbFNjcmVlbkVycm9yKSB7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZnVsbFNjcmVlbkVycm9yRXZlbnROYW1lLCB0aGlzLl9wcmVPbkZ1bGxTY3JlZW5FcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcHJlT25GdWxsU2NyZWVuRXJyb3IgPSBvbkZ1bGxTY3JlZW5FcnJvcjtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGZ1bGxTY3JlZW5FcnJvckV2ZW50TmFtZSwgb25GdWxsU2NyZWVuRXJyb3IsIHsgb25jZTogdHJ1ZSB9KTtcbiAgICB9LFxufTtcbmNjLnNjcmVlbi5pbml0KCk7XG4iXX0=