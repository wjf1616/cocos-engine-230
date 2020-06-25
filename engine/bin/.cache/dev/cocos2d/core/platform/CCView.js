
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/CCView.js';
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
var EventTarget = require('../event/event-target');

var js = require('../platform/js');

var renderer = require('../renderer');

require('../platform/CCClass');

var __BrowserGetter = {
  init: function init() {
    this.html = document.getElementsByTagName("html")[0];
  },
  availWidth: function availWidth(frame) {
    if (!frame || frame === this.html) return window.innerWidth;else return frame.clientWidth;
  },
  availHeight: function availHeight(frame) {
    if (!frame || frame === this.html) return window.innerHeight;else return frame.clientHeight;
  },
  meta: {
    "width": "device-width"
  },
  adaptationType: cc.sys.browserType
};
if (cc.sys.os === cc.sys.OS_IOS) // All browsers are WebView
  __BrowserGetter.adaptationType = cc.sys.BROWSER_TYPE_SAFARI;

switch (__BrowserGetter.adaptationType) {
  case cc.sys.BROWSER_TYPE_SAFARI:
    __BrowserGetter.meta["minimal-ui"] = "true";
    __BrowserGetter.availWidth = cc.sys.isMobile ? function (frame) {
      // bug fix for navigation bar on Safari
      return window.innerWidth;
    } : function (frame) {
      return frame.clientWidth;
    };
    __BrowserGetter.availHeight = cc.sys.isMobile ? function (frame) {
      // bug fix for navigation bar on Safari
      return window.innerHeight;
    } : function (frame) {
      return frame.clientHeight;
    };
    break;

  case cc.sys.BROWSER_TYPE_SOUGOU:
  case cc.sys.BROWSER_TYPE_UC:
    __BrowserGetter.meta["minimal-ui"] = "true";

    __BrowserGetter.availWidth = function (frame) {
      return frame.clientWidth;
    };

    __BrowserGetter.availHeight = function (frame) {
      return frame.clientHeight;
    };

    break;
}

var _scissorRect = null;
/**
 * cc.view is the singleton object which represents the game window.<br/>
 * It's main task include: <br/>
 *  - Apply the design resolution policy<br/>
 *  - Provide interaction with the window, like resize event on web, retina display support, etc...<br/>
 *  - Manage the game view port which can be different with the window<br/>
 *  - Manage the content scale and translation<br/>
 * <br/>
 * Since the cc.view is a singleton, you don't need to call any constructor or create functions,<br/>
 * the standard way to use it is by calling:<br/>
 *  - cc.view.methodName(); <br/>
 *
 * @class View
 * @extends EventTarget
 */

var View = function View() {
  EventTarget.call(this);

  var _t = this,
      _strategyer = cc.ContainerStrategy,
      _strategy = cc.ContentStrategy;

  __BrowserGetter.init(this); // Size of parent node that contains cc.game.container and cc.game.canvas


  _t._frameSize = cc.size(0, 0); // resolution size, it is the size appropriate for the app resources.

  _t._designResolutionSize = cc.size(0, 0);
  _t._originalDesignResolutionSize = cc.size(0, 0);
  _t._scaleX = 1;
  _t._scaleY = 1; // Viewport is the container's rect related to content's coordinates in pixel

  _t._viewportRect = cc.rect(0, 0, 0, 0); // The visible rect in content's coordinate in point

  _t._visibleRect = cc.rect(0, 0, 0, 0); // Auto full screen disabled by default

  _t._autoFullScreen = false; // The device's pixel ratio (for retina displays)

  _t._devicePixelRatio = 1;

  if (CC_JSB) {
    _t._maxPixelRatio = 4;
  } else {
    _t._maxPixelRatio = 2;
  } // Retina disabled by default


  _t._retinaEnabled = false; // Custom callback for resize event

  _t._resizeCallback = null;
  _t._resizing = false;
  _t._resizeWithBrowserSize = false;
  _t._orientationChanging = true;
  _t._isRotated = false;
  _t._orientation = cc.macro.ORIENTATION_AUTO;
  _t._isAdjustViewport = true;
  _t._antiAliasEnabled = false; // Setup system default resolution policies

  _t._resolutionPolicy = null;
  _t._rpExactFit = new cc.ResolutionPolicy(_strategyer.EQUAL_TO_FRAME, _strategy.EXACT_FIT);
  _t._rpShowAll = new cc.ResolutionPolicy(_strategyer.EQUAL_TO_FRAME, _strategy.SHOW_ALL);
  _t._rpNoBorder = new cc.ResolutionPolicy(_strategyer.EQUAL_TO_FRAME, _strategy.NO_BORDER);
  _t._rpFixedHeight = new cc.ResolutionPolicy(_strategyer.EQUAL_TO_FRAME, _strategy.FIXED_HEIGHT);
  _t._rpFixedWidth = new cc.ResolutionPolicy(_strategyer.EQUAL_TO_FRAME, _strategy.FIXED_WIDTH);
  cc.game.once(cc.game.EVENT_ENGINE_INITED, this.init, this);
};

cc.js.extend(View, EventTarget);
cc.js.mixin(View.prototype, {
  init: function init() {
    this._initFrameSize();

    var w = cc.game.canvas.width,
        h = cc.game.canvas.height;
    this._designResolutionSize.width = w;
    this._designResolutionSize.height = h;
    this._originalDesignResolutionSize.width = w;
    this._originalDesignResolutionSize.height = h;
    this._viewportRect.width = w;
    this._viewportRect.height = h;
    this._visibleRect.width = w;
    this._visibleRect.height = h;
    cc.winSize.width = this._visibleRect.width;
    cc.winSize.height = this._visibleRect.height;
    cc.visibleRect && cc.visibleRect.init(this._visibleRect);
  },
  // Resize helper functions
  _resizeEvent: function _resizeEvent(forceOrEvent) {
    var view;

    if (this.setDesignResolutionSize) {
      view = this;
    } else {
      view = cc.view;
    } // Check frame size changed or not


    var prevFrameW = view._frameSize.width,
        prevFrameH = view._frameSize.height,
        prevRotated = view._isRotated;

    if (cc.sys.isMobile) {
      var containerStyle = cc.game.container.style,
          margin = containerStyle.margin;
      containerStyle.margin = '0';
      containerStyle.display = 'none';

      view._initFrameSize();

      containerStyle.margin = margin;
      containerStyle.display = 'block';
    } else {
      view._initFrameSize();
    }

    if (forceOrEvent !== true && view._isRotated === prevRotated && view._frameSize.width === prevFrameW && view._frameSize.height === prevFrameH) return; // Frame size changed, do resize works

    var width = view._originalDesignResolutionSize.width;
    var height = view._originalDesignResolutionSize.height;
    view._resizing = true;
    if (width > 0) view.setDesignResolutionSize(width, height, view._resolutionPolicy);
    view._resizing = false;
    view.emit('canvas-resize');

    if (view._resizeCallback) {
      view._resizeCallback.call();
    }
  },
  _orientationChange: function _orientationChange() {
    cc.view._orientationChanging = true;

    cc.view._resizeEvent(); // HACK: show nav bar on iOS safari
    // safari will enter fullscreen when rotate to landscape
    // need to exit fullscreen when rotate back to portrait, scrollTo(0, 1) works.


    if (cc.sys.browserType === cc.sys.BROWSER_TYPE_SAFARI && cc.sys.isMobile) {
      setTimeout(function () {
        if (window.innerHeight > window.innerWidth) {
          window.scrollTo(0, 1);
        }
      }, 500);
    }
  },

  /**
   * !#en
   * Sets view's target-densitydpi for android mobile browser. it can be set to:           <br/>
   *   1. cc.macro.DENSITYDPI_DEVICE, value is "device-dpi"                                      <br/>
   *   2. cc.macro.DENSITYDPI_HIGH, value is "high-dpi"  (default value)                         <br/>
   *   3. cc.macro.DENSITYDPI_MEDIUM, value is "medium-dpi" (browser's default value)            <br/>
   *   4. cc.macro.DENSITYDPI_LOW, value is "low-dpi"                                            <br/>
   *   5. Custom value, e.g: "480"                                                         <br/>
   * !#zh 设置目标内容的每英寸像素点密度。
   *
   * @method setTargetDensityDPI
   * @param {String} densityDPI
   * @deprecated since v2.0
   */

  /**
   * !#en
   * Returns the current target-densitydpi value of cc.view.
   * !#zh 获取目标内容的每英寸像素点密度。
   * @method getTargetDensityDPI
   * @returns {String}
   * @deprecated since v2.0
   */

  /**
   * !#en
   * Sets whether resize canvas automatically when browser's size changed.<br/>
   * Useful only on web.
   * !#zh 设置当发现浏览器的尺寸改变时，是否自动调整 canvas 尺寸大小。
   * 仅在 Web 模式下有效。
   * @method resizeWithBrowserSize
   * @param {Boolean} enabled - Whether enable automatic resize with browser's resize event
   */
  resizeWithBrowserSize: function resizeWithBrowserSize(enabled) {
    if (enabled) {
      //enable
      if (!this._resizeWithBrowserSize) {
        this._resizeWithBrowserSize = true;
        window.addEventListener('resize', this._resizeEvent);
        window.addEventListener('orientationchange', this._orientationChange);
      }
    } else {
      //disable
      if (this._resizeWithBrowserSize) {
        this._resizeWithBrowserSize = false;
        window.removeEventListener('resize', this._resizeEvent);
        window.removeEventListener('orientationchange', this._orientationChange);
      }
    }
  },

  /**
   * !#en
   * Sets the callback function for cc.view's resize action,<br/>
   * this callback will be invoked before applying resolution policy, <br/>
   * so you can do any additional modifications within the callback.<br/>
   * Useful only on web.
   * !#zh 设置 cc.view 调整视窗尺寸行为的回调函数，
   * 这个回调函数会在应用适配模式之前被调用，
   * 因此你可以在这个回调函数内添加任意附加改变，
   * 仅在 Web 平台下有效。
   * @method setResizeCallback
   * @param {Function|Null} callback - The callback function
   */
  setResizeCallback: function setResizeCallback(callback) {
    if (CC_EDITOR) return;

    if (typeof callback === 'function' || callback == null) {
      this._resizeCallback = callback;
    }
  },

  /**
   * !#en
   * Sets the orientation of the game, it can be landscape, portrait or auto.
   * When set it to landscape or portrait, and screen w/h ratio doesn't fit, 
   * cc.view will automatically rotate the game canvas using CSS.
   * Note that this function doesn't have any effect in native, 
   * in native, you need to set the application orientation in native project settings
   * !#zh 设置游戏屏幕朝向，它能够是横版，竖版或自动。
   * 当设置为横版或竖版，并且屏幕的宽高比例不匹配时，
   * cc.view 会自动用 CSS 旋转游戏场景的 canvas，
   * 这个方法不会对 native 部分产生任何影响，对于 native 而言，你需要在应用设置中的设置排版。
   * @method setOrientation
   * @param {Number} orientation - Possible values: cc.macro.ORIENTATION_LANDSCAPE | cc.macro.ORIENTATION_PORTRAIT | cc.macro.ORIENTATION_AUTO
   */
  setOrientation: function setOrientation(orientation) {
    orientation = orientation & cc.macro.ORIENTATION_AUTO;

    if (orientation && this._orientation !== orientation) {
      this._orientation = orientation;
      var designWidth = this._originalDesignResolutionSize.width;
      var designHeight = this._originalDesignResolutionSize.height;
      this.setDesignResolutionSize(designWidth, designHeight, this._resolutionPolicy);
    }
  },
  _initFrameSize: function _initFrameSize() {
    var locFrameSize = this._frameSize;

    var w = __BrowserGetter.availWidth(cc.game.frame);

    var h = __BrowserGetter.availHeight(cc.game.frame);

    var isLandscape = w >= h;

    if (CC_EDITOR || !cc.sys.isMobile || isLandscape && this._orientation & cc.macro.ORIENTATION_LANDSCAPE || !isLandscape && this._orientation & cc.macro.ORIENTATION_PORTRAIT) {
      locFrameSize.width = w;
      locFrameSize.height = h;
      cc.game.container.style['-webkit-transform'] = 'rotate(0deg)';
      cc.game.container.style.transform = 'rotate(0deg)';
      this._isRotated = false;
    } else {
      locFrameSize.width = h;
      locFrameSize.height = w;
      cc.game.container.style['-webkit-transform'] = 'rotate(90deg)';
      cc.game.container.style.transform = 'rotate(90deg)';
      cc.game.container.style['-webkit-transform-origin'] = '0px 0px 0px';
      cc.game.container.style.transformOrigin = '0px 0px 0px';
      this._isRotated = true;
    }

    if (this._orientationChanging) {
      setTimeout(function () {
        cc.view._orientationChanging = false;
      }, 1000);
    }
  },
  _setViewportMeta: function _setViewportMeta(metas, overwrite) {
    var vp = document.getElementById("cocosMetaElement");

    if (vp && overwrite) {
      document.head.removeChild(vp);
    }

    var elems = document.getElementsByName("viewport"),
        currentVP = elems ? elems[0] : null,
        content,
        key,
        pattern;
    content = currentVP ? currentVP.content : "";
    vp = vp || document.createElement("meta");
    vp.id = "cocosMetaElement";
    vp.name = "viewport";
    vp.content = "";

    for (key in metas) {
      if (content.indexOf(key) == -1) {
        content += "," + key + "=" + metas[key];
      } else if (overwrite) {
        pattern = new RegExp(key + "\s*=\s*[^,]+");
        content.replace(pattern, key + "=" + metas[key]);
      }
    }

    if (/^,/.test(content)) content = content.substr(1);
    vp.content = content; // For adopting certain android devices which don't support second viewport

    if (currentVP) currentVP.content = content;
    document.head.appendChild(vp);
  },
  _adjustViewportMeta: function _adjustViewportMeta() {
    if (this._isAdjustViewport && !CC_JSB && !CC_RUNTIME) {
      this._setViewportMeta(__BrowserGetter.meta, false);

      this._isAdjustViewport = false;
    }
  },

  /**
   * !#en
   * Sets whether the engine modify the "viewport" meta in your web page.<br/>
   * It's enabled by default, we strongly suggest you not to disable it.<br/>
   * And even when it's enabled, you can still set your own "viewport" meta, it won't be overridden<br/>
   * Only useful on web
   * !#zh 设置引擎是否调整 viewport meta 来配合屏幕适配。
   * 默认设置为启动，我们强烈建议你不要将它设置为关闭。
   * 即使当它启动时，你仍然能够设置你的 viewport meta，它不会被覆盖。
   * 仅在 Web 模式下有效
   * @method adjustViewportMeta
   * @param {Boolean} enabled - Enable automatic modification to "viewport" meta
   */
  adjustViewportMeta: function adjustViewportMeta(enabled) {
    this._isAdjustViewport = enabled;
  },

  /**
   * !#en
   * Retina support is enabled by default for Apple device but disabled for other devices,<br/>
   * it takes effect only when you called setDesignResolutionPolicy<br/>
   * Only useful on web
   * !#zh 对于 Apple 这种支持 Retina 显示的设备上默认进行优化而其他类型设备默认不进行优化，
   * 它仅会在你调用 setDesignResolutionPolicy 方法时有影响。
   * 仅在 Web 模式下有效。
   * @method enableRetina
   * @param {Boolean} enabled - Enable or disable retina display
   */
  enableRetina: function enableRetina(enabled) {
    if (CC_EDITOR && enabled) {
      cc.warn('Can not enable retina in Editor.');
      return;
    }

    this._retinaEnabled = !!enabled;
  },

  /**
   * !#en
   * Check whether retina display is enabled.<br/>
   * Only useful on web
   * !#zh 检查是否对 Retina 显示设备进行优化。
   * 仅在 Web 模式下有效。
   * @method isRetinaEnabled
   * @return {Boolean}
   */
  isRetinaEnabled: function isRetinaEnabled() {
    if (CC_EDITOR) {
      return false;
    }

    return this._retinaEnabled;
  },

  /**
   * !#en Whether to Enable on anti-alias
   * !#zh 控制抗锯齿是否开启
   * @method enableAntiAlias
   * @param {Boolean} enabled - Enable or not anti-alias
   * @deprecated cc.view.enableAntiAlias is deprecated now, please use cc.Texture2D.setFilters instead
   * @since v2.3.0
   */
  enableAntiAlias: function enableAntiAlias(enabled) {
    cc.warnID(9200);

    if (this._antiAliasEnabled === enabled) {
      return;
    }

    this._antiAliasEnabled = enabled;

    if (cc.game.renderType === cc.game.RENDER_TYPE_WEBGL) {
      var cache = cc.loader._cache;

      for (var key in cache) {
        var item = cache[key];
        var tex = item && item.content instanceof cc.Texture2D ? item.content : null;

        if (tex) {
          var Filter = cc.Texture2D.Filter;

          if (enabled) {
            tex.setFilters(Filter.LINEAR, Filter.LINEAR);
          } else {
            tex.setFilters(Filter.NEAREST, Filter.NEAREST);
          }
        }
      }
    } else if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
      var ctx = cc.game.canvas.getContext('2d');
      ctx.imageSmoothingEnabled = enabled;
      ctx.mozImageSmoothingEnabled = enabled;
    }
  },

  /**
   * !#en Returns whether the current enable on anti-alias
   * !#zh 返回当前是否抗锯齿
   * @method isAntiAliasEnabled
   * @return {Boolean}
   */
  isAntiAliasEnabled: function isAntiAliasEnabled() {
    return this._antiAliasEnabled;
  },

  /**
   * !#en
   * If enabled, the application will try automatically to enter full screen mode on mobile devices<br/>
   * You can pass true as parameter to enable it and disable it by passing false.<br/>
   * Only useful on web
   * !#zh 启动时，移动端游戏会在移动端自动尝试进入全屏模式。
   * 你能够传入 true 为参数去启动它，用 false 参数来关闭它。
   * @method enableAutoFullScreen
   * @param {Boolean} enabled - Enable or disable auto full screen on mobile devices
   */
  enableAutoFullScreen: function enableAutoFullScreen(enabled) {
    if (enabled && enabled !== this._autoFullScreen && cc.sys.isMobile) {
      // Automatically full screen when user touches on mobile version
      this._autoFullScreen = true;
      cc.screen.autoFullScreen(cc.game.frame);
    } else {
      this._autoFullScreen = false;
      cc.screen.disableAutoFullScreen(cc.game.frame);
    }
  },

  /**
   * !#en
   * Check whether auto full screen is enabled.<br/>
   * Only useful on web
   * !#zh 检查自动进入全屏模式是否启动。
   * 仅在 Web 模式下有效。
   * @method isAutoFullScreenEnabled
   * @return {Boolean} Auto full screen enabled or not
   */
  isAutoFullScreenEnabled: function isAutoFullScreenEnabled() {
    return this._autoFullScreen;
  },

  /*
   * Not support on native.<br/>
   * On web, it sets the size of the canvas.
   * !#zh 这个方法并不支持 native 平台，在 Web 平台下，可以用来设置 canvas 尺寸。
   * @method setCanvasSize
   * @param {Number} width
   * @param {Number} height
   */
  setCanvasSize: function setCanvasSize(width, height) {
    var canvas = cc.game.canvas;
    var container = cc.game.container;
    canvas.width = width * this._devicePixelRatio;
    canvas.height = height * this._devicePixelRatio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    container.style.width = width + 'px';
    container.style.height = height + 'px';

    this._resizeEvent();
  },

  /**
   * !#en
   * Returns the canvas size of the view.<br/>
   * On native platforms, it returns the screen size since the view is a fullscreen view.<br/>
   * On web, it returns the size of the canvas element.
   * !#zh 返回视图中 canvas 的尺寸。
   * 在 native 平台下，它返回全屏视图下屏幕的尺寸。
   * 在 Web 平台下，它返回 canvas 元素尺寸。
   * @method getCanvasSize
   * @return {Size}
   */
  getCanvasSize: function getCanvasSize() {
    return cc.size(cc.game.canvas.width, cc.game.canvas.height);
  },

  /**
   * !#en
   * Returns the frame size of the view.<br/>
   * On native platforms, it returns the screen size since the view is a fullscreen view.<br/>
   * On web, it returns the size of the canvas's outer DOM element.
   * !#zh 返回视图中边框尺寸。
   * 在 native 平台下，它返回全屏视图下屏幕的尺寸。
   * 在 web 平台下，它返回 canvas 元素的外层 DOM 元素尺寸。
   * @method getFrameSize
   * @return {Size}
   */
  getFrameSize: function getFrameSize() {
    return cc.size(this._frameSize.width, this._frameSize.height);
  },

  /**
   * !#en
   * On native, it sets the frame size of view.<br/>
   * On web, it sets the size of the canvas's outer DOM element.
   * !#zh 在 native 平台下，设置视图框架尺寸。
   * 在 web 平台下，设置 canvas 外层 DOM 元素尺寸。
   * @method setFrameSize
   * @param {Number} width
   * @param {Number} height
   */
  setFrameSize: function setFrameSize(width, height) {
    this._frameSize.width = width;
    this._frameSize.height = height;
    cc.game.frame.style.width = width + "px";
    cc.game.frame.style.height = height + "px";

    this._resizeEvent(true);
  },

  /**
   * !#en
   * Returns the visible area size of the view port.
   * !#zh 返回视图窗口可见区域尺寸。
   * @method getVisibleSize
   * @return {Size}
   */
  getVisibleSize: function getVisibleSize() {
    return cc.size(this._visibleRect.width, this._visibleRect.height);
  },

  /**
   * !#en
   * Returns the visible area size of the view port.
   * !#zh 返回视图窗口可见区域像素尺寸。
   * @method getVisibleSizeInPixel
   * @return {Size}
   */
  getVisibleSizeInPixel: function getVisibleSizeInPixel() {
    return cc.size(this._visibleRect.width * this._scaleX, this._visibleRect.height * this._scaleY);
  },

  /**
   * !#en
   * Returns the visible origin of the view port.
   * !#zh 返回视图窗口可见区域原点。
   * @method getVisibleOrigin
   * @return {Vec2}
   */
  getVisibleOrigin: function getVisibleOrigin() {
    return cc.v2(this._visibleRect.x, this._visibleRect.y);
  },

  /**
   * !#en
   * Returns the visible origin of the view port.
   * !#zh 返回视图窗口可见区域像素原点。
   * @method getVisibleOriginInPixel
   * @return {Vec2}
   */
  getVisibleOriginInPixel: function getVisibleOriginInPixel() {
    return cc.v2(this._visibleRect.x * this._scaleX, this._visibleRect.y * this._scaleY);
  },

  /**
   * !#en
   * Returns the current resolution policy
   * !#zh 返回当前分辨率方案
   * @see cc.ResolutionPolicy
   * @method getResolutionPolicy
   * @return {ResolutionPolicy}
   */
  getResolutionPolicy: function getResolutionPolicy() {
    return this._resolutionPolicy;
  },

  /**
   * !#en
   * Sets the current resolution policy
   * !#zh 设置当前分辨率模式
   * @see cc.ResolutionPolicy
   * @method setResolutionPolicy
   * @param {ResolutionPolicy|Number} resolutionPolicy
   */
  setResolutionPolicy: function setResolutionPolicy(resolutionPolicy) {
    var _t = this;

    if (resolutionPolicy instanceof cc.ResolutionPolicy) {
      _t._resolutionPolicy = resolutionPolicy;
    } // Ensure compatibility with JSB
    else {
        var _locPolicy = cc.ResolutionPolicy;
        if (resolutionPolicy === _locPolicy.EXACT_FIT) _t._resolutionPolicy = _t._rpExactFit;
        if (resolutionPolicy === _locPolicy.SHOW_ALL) _t._resolutionPolicy = _t._rpShowAll;
        if (resolutionPolicy === _locPolicy.NO_BORDER) _t._resolutionPolicy = _t._rpNoBorder;
        if (resolutionPolicy === _locPolicy.FIXED_HEIGHT) _t._resolutionPolicy = _t._rpFixedHeight;
        if (resolutionPolicy === _locPolicy.FIXED_WIDTH) _t._resolutionPolicy = _t._rpFixedWidth;
      }
  },

  /**
   * !#en
   * Sets the resolution policy with designed view size in points.<br/>
   * The resolution policy include: <br/>
   * [1] ResolutionExactFit       Fill screen by stretch-to-fit: if the design resolution ratio of width to height is different from the screen resolution ratio, your game view will be stretched.<br/>
   * [2] ResolutionNoBorder       Full screen without black border: if the design resolution ratio of width to height is different from the screen resolution ratio, two areas of your game view will be cut.<br/>
   * [3] ResolutionShowAll        Full screen with black border: if the design resolution ratio of width to height is different from the screen resolution ratio, two black borders will be shown.<br/>
   * [4] ResolutionFixedHeight    Scale the content's height to screen's height and proportionally scale its width<br/>
   * [5] ResolutionFixedWidth     Scale the content's width to screen's width and proportionally scale its height<br/>
   * [cc.ResolutionPolicy]        [Web only feature] Custom resolution policy, constructed by cc.ResolutionPolicy<br/>
   * !#zh 通过设置设计分辨率和匹配模式来进行游戏画面的屏幕适配。
   * @method setDesignResolutionSize
   * @param {Number} width Design resolution width.
   * @param {Number} height Design resolution height.
   * @param {ResolutionPolicy|Number} resolutionPolicy The resolution policy desired
   */
  setDesignResolutionSize: function setDesignResolutionSize(width, height, resolutionPolicy) {
    // Defensive code
    if (!(width > 0 || height > 0)) {
      cc.logID(2200);
      return;
    }

    this.setResolutionPolicy(resolutionPolicy);
    var policy = this._resolutionPolicy;

    if (policy) {
      policy.preApply(this);
    } // Reinit frame size


    if (cc.sys.isMobile) this._adjustViewportMeta(); // Permit to re-detect the orientation of device.

    this._orientationChanging = true; // If resizing, then frame size is already initialized, this logic should be improved

    if (!this._resizing) this._initFrameSize();

    if (!policy) {
      cc.logID(2201);
      return;
    }

    this._originalDesignResolutionSize.width = this._designResolutionSize.width = width;
    this._originalDesignResolutionSize.height = this._designResolutionSize.height = height;
    var result = policy.apply(this, this._designResolutionSize);

    if (result.scale && result.scale.length === 2) {
      this._scaleX = result.scale[0];
      this._scaleY = result.scale[1];
    }

    if (result.viewport) {
      var vp = this._viewportRect,
          vb = this._visibleRect,
          rv = result.viewport;
      vp.x = rv.x;
      vp.y = rv.y;
      vp.width = rv.width;
      vp.height = rv.height;
      vb.x = 0;
      vb.y = 0;
      vb.width = rv.width / this._scaleX;
      vb.height = rv.height / this._scaleY;
    }

    policy.postApply(this);
    cc.winSize.width = this._visibleRect.width;
    cc.winSize.height = this._visibleRect.height;
    cc.visibleRect && cc.visibleRect.init(this._visibleRect);
    renderer.updateCameraViewport();

    _cc.inputManager._updateCanvasBoundingRect();

    this.emit('design-resolution-changed');
  },

  /**
   * !#en
   * Returns the designed size for the view.
   * Default resolution size is the same as 'getFrameSize'.
   * !#zh 返回视图的设计分辨率。
   * 默认下分辨率尺寸同 `getFrameSize` 方法相同
   * @method getDesignResolutionSize
   * @return {Size}
   */
  getDesignResolutionSize: function getDesignResolutionSize() {
    return cc.size(this._designResolutionSize.width, this._designResolutionSize.height);
  },

  /**
   * !#en
   * Sets the container to desired pixel resolution and fit the game content to it.
   * This function is very useful for adaptation in mobile browsers.
   * In some HD android devices, the resolution is very high, but its browser performance may not be very good.
   * In this case, enabling retina display is very costy and not suggested, and if retina is disabled, the image may be blurry.
   * But this API can be helpful to set a desired pixel resolution which is in between.
   * This API will do the following:
   *     1. Set viewport's width to the desired width in pixel
   *     2. Set body width to the exact pixel resolution
   *     3. The resolution policy will be reset with designed view size in points.
   * !#zh 设置容器（container）需要的像素分辨率并且适配相应分辨率的游戏内容。
   * @method setRealPixelResolution
   * @param {Number} width Design resolution width.
   * @param {Number} height Design resolution height.
   * @param {ResolutionPolicy|Number} resolutionPolicy The resolution policy desired
   */
  setRealPixelResolution: function setRealPixelResolution(width, height, resolutionPolicy) {
    if (!CC_JSB && !CC_RUNTIME) {
      // Set viewport's width
      this._setViewportMeta({
        "width": width
      }, true); // Set body width to the exact pixel resolution


      document.documentElement.style.width = width + "px";
      document.body.style.width = width + "px";
      document.body.style.left = "0px";
      document.body.style.top = "0px";
    } // Reset the resolution size and policy


    this.setDesignResolutionSize(width, height, resolutionPolicy);
  },

  /**
   * !#en
   * Sets view port rectangle with points.
   * !#zh 用设计分辨率下的点尺寸来设置视窗。
   * @method setViewportInPoints
   * @deprecated since v2.0
   * @param {Number} x
   * @param {Number} y
   * @param {Number} w width
   * @param {Number} h height
   */
  setViewportInPoints: function setViewportInPoints(x, y, w, h) {
    var locScaleX = this._scaleX,
        locScaleY = this._scaleY;

    cc.game._renderContext.viewport(x * locScaleX + this._viewportRect.x, y * locScaleY + this._viewportRect.y, w * locScaleX, h * locScaleY);
  },

  /**
   * !#en
   * Sets Scissor rectangle with points.
   * !#zh 用设计分辨率下的点的尺寸来设置 scissor 剪裁区域。
   * @method setScissorInPoints
   * @deprecated since v2.0
   * @param {Number} x
   * @param {Number} y
   * @param {Number} w
   * @param {Number} h
   */
  setScissorInPoints: function setScissorInPoints(x, y, w, h) {
    var scaleX = this._scaleX,
        scaleY = this._scaleY;
    var sx = Math.ceil(x * scaleX + this._viewportRect.x);
    var sy = Math.ceil(y * scaleY + this._viewportRect.y);
    var sw = Math.ceil(w * scaleX);
    var sh = Math.ceil(h * scaleY);
    var gl = cc.game._renderContext;

    if (!_scissorRect) {
      var boxArr = gl.getParameter(gl.SCISSOR_BOX);
      _scissorRect = cc.rect(boxArr[0], boxArr[1], boxArr[2], boxArr[3]);
    }

    if (_scissorRect.x !== sx || _scissorRect.y !== sy || _scissorRect.width !== sw || _scissorRect.height !== sh) {
      _scissorRect.x = sx;
      _scissorRect.y = sy;
      _scissorRect.width = sw;
      _scissorRect.height = sh;
      gl.scissor(sx, sy, sw, sh);
    }
  },

  /**
   * !#en
   * Returns whether GL_SCISSOR_TEST is enable
   * !#zh 检查 scissor 是否生效。
   * @method isScissorEnabled
   * @deprecated since v2.0
   * @return {Boolean}
   */
  isScissorEnabled: function isScissorEnabled() {
    return cc.game._renderContext.isEnabled(gl.SCISSOR_TEST);
  },

  /**
   * !#en
   * Returns the current scissor rectangle
   * !#zh 返回当前的 scissor 剪裁区域。
   * @method getScissorRect
   * @deprecated since v2.0
   * @return {Rect}
   */
  getScissorRect: function getScissorRect() {
    if (!_scissorRect) {
      var boxArr = gl.getParameter(gl.SCISSOR_BOX);
      _scissorRect = cc.rect(boxArr[0], boxArr[1], boxArr[2], boxArr[3]);
    }

    var scaleXFactor = 1 / this._scaleX;
    var scaleYFactor = 1 / this._scaleY;
    return cc.rect((_scissorRect.x - this._viewportRect.x) * scaleXFactor, (_scissorRect.y - this._viewportRect.y) * scaleYFactor, _scissorRect.width * scaleXFactor, _scissorRect.height * scaleYFactor);
  },

  /**
   * !#en
   * Returns the view port rectangle.
   * !#zh 返回视窗剪裁区域。
   * @method getViewportRect
   * @return {Rect}
   */
  getViewportRect: function getViewportRect() {
    return this._viewportRect;
  },

  /**
   * !#en
   * Returns scale factor of the horizontal direction (X axis).
   * !#zh 返回横轴的缩放比，这个缩放比是将画布像素分辨率放到设计分辨率的比例。
   * @method getScaleX
   * @return {Number}
   */
  getScaleX: function getScaleX() {
    return this._scaleX;
  },

  /**
   * !#en
   * Returns scale factor of the vertical direction (Y axis).
   * !#zh 返回纵轴的缩放比，这个缩放比是将画布像素分辨率缩放到设计分辨率的比例。
   * @method getScaleY
   * @return {Number}
   */
  getScaleY: function getScaleY() {
    return this._scaleY;
  },

  /**
   * !#en
   * Returns device pixel ratio for retina display.
   * !#zh 返回设备或浏览器像素比例。
   * @method getDevicePixelRatio
   * @return {Number}
   */
  getDevicePixelRatio: function getDevicePixelRatio() {
    return this._devicePixelRatio;
  },

  /**
   * !#en
   * Returns the real location in view for a translation based on a related position
   * !#zh 将屏幕坐标转换为游戏视图下的坐标。
   * @method convertToLocationInView
   * @param {Number} tx - The X axis translation
   * @param {Number} ty - The Y axis translation
   * @param {Object} relatedPos - The related position object including "left", "top", "width", "height" informations
   * @return {Vec2}
   */
  convertToLocationInView: function convertToLocationInView(tx, ty, relatedPos, out) {
    var result = out || cc.v2();
    var posLeft = relatedPos.adjustedLeft ? relatedPos.adjustedLeft : relatedPos.left;
    var posTop = relatedPos.adjustedTop ? relatedPos.adjustedTop : relatedPos.top;
    var x = this._devicePixelRatio * (tx - posLeft);
    var y = this._devicePixelRatio * (posTop + relatedPos.height - ty);

    if (this._isRotated) {
      result.x = cc.game.canvas.width - y;
      result.y = x;
    } else {
      result.x = x;
      result.y = y;
    }

    return result;
  },
  _convertMouseToLocationInView: function _convertMouseToLocationInView(in_out_point, relatedPos) {
    var viewport = this._viewportRect,
        _t = this;

    in_out_point.x = (_t._devicePixelRatio * (in_out_point.x - relatedPos.left) - viewport.x) / _t._scaleX;
    in_out_point.y = (_t._devicePixelRatio * (relatedPos.top + relatedPos.height - in_out_point.y) - viewport.y) / _t._scaleY;
  },
  _convertPointWithScale: function _convertPointWithScale(point) {
    var viewport = this._viewportRect;
    point.x = (point.x - viewport.x) / this._scaleX;
    point.y = (point.y - viewport.y) / this._scaleY;
  },
  _convertTouchesWithScale: function _convertTouchesWithScale(touches) {
    var viewport = this._viewportRect,
        scaleX = this._scaleX,
        scaleY = this._scaleY,
        selTouch,
        selPoint,
        selPrePoint;

    for (var i = 0; i < touches.length; i++) {
      selTouch = touches[i];
      selPoint = selTouch._point;
      selPrePoint = selTouch._prevPoint;
      selPoint.x = (selPoint.x - viewport.x) / scaleX;
      selPoint.y = (selPoint.y - viewport.y) / scaleY;
      selPrePoint.x = (selPrePoint.x - viewport.x) / scaleX;
      selPrePoint.y = (selPrePoint.y - viewport.y) / scaleY;
    }
  }
});
/**
 * !en
 * Emit when design resolution changed.
 * !zh
 * 当设计分辨率改变时发送。
 * @event design-resolution-changed
 */

/**
* !en
* Emit when canvas resize.
* !zh
* 当画布大小改变时发送。
* @event canvas-resize
*/

/**
 * <p>cc.game.containerStrategy class is the root strategy class of container's scale strategy,
 * it controls the behavior of how to scale the cc.game.container and cc.game.canvas object</p>
 *
 * @class ContainerStrategy
 */

cc.ContainerStrategy = cc.Class({
  name: "ContainerStrategy",

  /**
   * !#en
   * Manipulation before appling the strategy
   * !#zh 在应用策略之前的操作
   * @method preApply
   * @param {View} view - The target view
   */
  preApply: function preApply(view) {},

  /**
   * !#en
   * Function to apply this strategy
   * !#zh 策略应用方法
   * @method apply
   * @param {View} view
   * @param {Size} designedResolution
   */
  apply: function apply(view, designedResolution) {},

  /**
   * !#en
   * Manipulation after applying the strategy
   * !#zh 策略调用之后的操作
   * @method postApply
   * @param {View} view  The target view
   */
  postApply: function postApply(view) {},
  _setupContainer: function _setupContainer(view, w, h) {
    var locCanvas = cc.game.canvas;

    this._setupStyle(view, w, h); // Setup pixel ratio for retina display


    var devicePixelRatio = view._devicePixelRatio = 1;

    if (CC_JSB) {
      // view.isRetinaEnabled only work on web. 
      devicePixelRatio = view._devicePixelRatio = window.devicePixelRatio;
    } else if (view.isRetinaEnabled()) {
      devicePixelRatio = view._devicePixelRatio = Math.min(view._maxPixelRatio, window.devicePixelRatio || 1);
    } // Setup canvas


    locCanvas.width = w * devicePixelRatio;
    locCanvas.height = h * devicePixelRatio;
  },
  _setupStyle: function _setupStyle(view, w, h) {
    var locCanvas = cc.game.canvas;
    var locContainer = cc.game.container;

    if (cc.sys.os === cc.sys.OS_ANDROID) {
      document.body.style.width = (view._isRotated ? h : w) + 'px';
      document.body.style.height = (view._isRotated ? w : h) + 'px';
    } // Setup style


    locContainer.style.width = locCanvas.style.width = w + 'px';
    locContainer.style.height = locCanvas.style.height = h + 'px';
  },
  _fixContainer: function _fixContainer() {
    // Add container to document body
    document.body.insertBefore(cc.game.container, document.body.firstChild); // Set body's width height to window's size, and forbid overflow, so that game will be centered

    var bs = document.body.style;
    bs.width = window.innerWidth + "px";
    bs.height = window.innerHeight + "px";
    bs.overflow = "hidden"; // Body size solution doesn't work on all mobile browser so this is the aleternative: fixed container

    var contStyle = cc.game.container.style;
    contStyle.position = "fixed";
    contStyle.left = contStyle.top = "0px"; // Reposition body

    document.body.scrollTop = 0;
  }
});
/**
 * <p>cc.ContentStrategy class is the root strategy class of content's scale strategy,
 * it controls the behavior of how to scale the scene and setup the viewport for the game</p>
 *
 * @class ContentStrategy
 */

cc.ContentStrategy = cc.Class({
  name: "ContentStrategy",
  ctor: function ctor() {
    this._result = {
      scale: [1, 1],
      viewport: null
    };
  },
  _buildResult: function _buildResult(containerW, containerH, contentW, contentH, scaleX, scaleY) {
    // Makes content fit better the canvas
    Math.abs(containerW - contentW) < 2 && (contentW = containerW);
    Math.abs(containerH - contentH) < 2 && (contentH = containerH);
    var viewport = cc.rect((containerW - contentW) / 2, (containerH - contentH) / 2, contentW, contentH); // Translate the content

    if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {//TODO: modify something for setTransform
      //cc.game._renderContext.translate(viewport.x, viewport.y + contentH);
    }

    this._result.scale = [scaleX, scaleY];
    this._result.viewport = viewport;
    return this._result;
  },

  /**
   * !#en
   * Manipulation before applying the strategy
   * !#zh 策略应用前的操作
   * @method preApply
   * @param {View} view - The target view
   */
  preApply: function preApply(view) {},

  /**
   * !#en Function to apply this strategy
   * The return value is {scale: [scaleX, scaleY], viewport: {cc.Rect}},
   * The target view can then apply these value to itself, it's preferred not to modify directly its private variables
   * !#zh 调用策略方法
   * @method apply
   * @param {View} view
   * @param {Size} designedResolution
   * @return {Object} scaleAndViewportRect
   */
  apply: function apply(view, designedResolution) {
    return {
      "scale": [1, 1]
    };
  },

  /**
   * !#en
   * Manipulation after applying the strategy
   * !#zh 策略调用之后的操作
   * @method postApply
   * @param {View} view - The target view
   */
  postApply: function postApply(view) {}
});

(function () {
  // Container scale strategys

  /**
   * @class EqualToFrame
   * @extends ContainerStrategy
   */
  var EqualToFrame = cc.Class({
    name: "EqualToFrame",
    "extends": cc.ContainerStrategy,
    apply: function apply(view) {
      var frameH = view._frameSize.height,
          containerStyle = cc.game.container.style;

      this._setupContainer(view, view._frameSize.width, view._frameSize.height); // Setup container's margin and padding


      if (view._isRotated) {
        containerStyle.margin = '0 0 0 ' + frameH + 'px';
      } else {
        containerStyle.margin = '0px';
      }

      containerStyle.padding = "0px";
    }
  });
  /**
   * @class ProportionalToFrame
   * @extends ContainerStrategy
   */

  var ProportionalToFrame = cc.Class({
    name: "ProportionalToFrame",
    "extends": cc.ContainerStrategy,
    apply: function apply(view, designedResolution) {
      var frameW = view._frameSize.width,
          frameH = view._frameSize.height,
          containerStyle = cc.game.container.style,
          designW = designedResolution.width,
          designH = designedResolution.height,
          scaleX = frameW / designW,
          scaleY = frameH / designH,
          containerW,
          containerH;
      scaleX < scaleY ? (containerW = frameW, containerH = designH * scaleX) : (containerW = designW * scaleY, containerH = frameH); // Adjust container size with integer value

      var offx = Math.round((frameW - containerW) / 2);
      var offy = Math.round((frameH - containerH) / 2);
      containerW = frameW - 2 * offx;
      containerH = frameH - 2 * offy;

      this._setupContainer(view, containerW, containerH);

      if (!CC_EDITOR) {
        // Setup container's margin and padding
        if (view._isRotated) {
          containerStyle.margin = '0 0 0 ' + frameH + 'px';
        } else {
          containerStyle.margin = '0px';
        }

        containerStyle.paddingLeft = offx + "px";
        containerStyle.paddingRight = offx + "px";
        containerStyle.paddingTop = offy + "px";
        containerStyle.paddingBottom = offy + "px";
      }
    }
  });
  /**
   * @class EqualToWindow
   * @extends EqualToFrame
   */

  var EqualToWindow = cc.Class({
    name: "EqualToWindow",
    "extends": EqualToFrame,
    preApply: function preApply(view) {
      this._super(view);

      cc.game.frame = document.documentElement;
    },
    apply: function apply(view) {
      this._super(view);

      this._fixContainer();
    }
  });
  /**
   * @class ProportionalToWindow
   * @extends ProportionalToFrame
   */

  var ProportionalToWindow = cc.Class({
    name: "ProportionalToWindow",
    "extends": ProportionalToFrame,
    preApply: function preApply(view) {
      this._super(view);

      cc.game.frame = document.documentElement;
    },
    apply: function apply(view, designedResolution) {
      this._super(view, designedResolution);

      this._fixContainer();
    }
  });
  /**
   * @class OriginalContainer
   * @extends ContainerStrategy
   */

  var OriginalContainer = cc.Class({
    name: "OriginalContainer",
    "extends": cc.ContainerStrategy,
    apply: function apply(view) {
      this._setupContainer(view, cc.game.canvas.width, cc.game.canvas.height);
    }
  }); // need to adapt prototype before instantiating

  var _global = typeof window === 'undefined' ? global : window;

  var globalAdapter = _global.__globalAdapter;

  if (globalAdapter) {
    if (globalAdapter.adaptContainerStrategy) {
      globalAdapter.adaptContainerStrategy(cc.ContainerStrategy.prototype);
    }

    if (globalAdapter.adaptView) {
      globalAdapter.adaptView(View.prototype);
    }
  } // #NOT STABLE on Android# Alias: Strategy that makes the container's size equals to the window's size
  //    cc.ContainerStrategy.EQUAL_TO_WINDOW = new EqualToWindow();
  // #NOT STABLE on Android# Alias: Strategy that scale proportionally the container's size to window's size
  //    cc.ContainerStrategy.PROPORTION_TO_WINDOW = new ProportionalToWindow();
  // Alias: Strategy that makes the container's size equals to the frame's size


  cc.ContainerStrategy.EQUAL_TO_FRAME = new EqualToFrame(); // Alias: Strategy that scale proportionally the container's size to frame's size

  cc.ContainerStrategy.PROPORTION_TO_FRAME = new ProportionalToFrame(); // Alias: Strategy that keeps the original container's size

  cc.ContainerStrategy.ORIGINAL_CONTAINER = new OriginalContainer(); // Content scale strategys

  var ExactFit = cc.Class({
    name: "ExactFit",
    "extends": cc.ContentStrategy,
    apply: function apply(view, designedResolution) {
      var containerW = cc.game.canvas.width,
          containerH = cc.game.canvas.height,
          scaleX = containerW / designedResolution.width,
          scaleY = containerH / designedResolution.height;
      return this._buildResult(containerW, containerH, containerW, containerH, scaleX, scaleY);
    }
  });
  var ShowAll = cc.Class({
    name: "ShowAll",
    "extends": cc.ContentStrategy,
    apply: function apply(view, designedResolution) {
      var containerW = cc.game.canvas.width,
          containerH = cc.game.canvas.height,
          designW = designedResolution.width,
          designH = designedResolution.height,
          scaleX = containerW / designW,
          scaleY = containerH / designH,
          scale = 0,
          contentW,
          contentH;
      scaleX < scaleY ? (scale = scaleX, contentW = containerW, contentH = designH * scale) : (scale = scaleY, contentW = designW * scale, contentH = containerH);
      return this._buildResult(containerW, containerH, contentW, contentH, scale, scale);
    }
  });
  var NoBorder = cc.Class({
    name: "NoBorder",
    "extends": cc.ContentStrategy,
    apply: function apply(view, designedResolution) {
      var containerW = cc.game.canvas.width,
          containerH = cc.game.canvas.height,
          designW = designedResolution.width,
          designH = designedResolution.height,
          scaleX = containerW / designW,
          scaleY = containerH / designH,
          scale,
          contentW,
          contentH;
      scaleX < scaleY ? (scale = scaleY, contentW = designW * scale, contentH = containerH) : (scale = scaleX, contentW = containerW, contentH = designH * scale);
      return this._buildResult(containerW, containerH, contentW, contentH, scale, scale);
    }
  });
  var FixedHeight = cc.Class({
    name: "FixedHeight",
    "extends": cc.ContentStrategy,
    apply: function apply(view, designedResolution) {
      var containerW = cc.game.canvas.width,
          containerH = cc.game.canvas.height,
          designH = designedResolution.height,
          scale = containerH / designH,
          contentW = containerW,
          contentH = containerH;
      return this._buildResult(containerW, containerH, contentW, contentH, scale, scale);
    }
  });
  var FixedWidth = cc.Class({
    name: "FixedWidth",
    "extends": cc.ContentStrategy,
    apply: function apply(view, designedResolution) {
      var containerW = cc.game.canvas.width,
          containerH = cc.game.canvas.height,
          designW = designedResolution.width,
          scale = containerW / designW,
          contentW = containerW,
          contentH = containerH;
      return this._buildResult(containerW, containerH, contentW, contentH, scale, scale);
    }
  }); // Alias: Strategy to scale the content's size to container's size, non proportional

  cc.ContentStrategy.EXACT_FIT = new ExactFit(); // Alias: Strategy to scale the content's size proportionally to maximum size and keeps the whole content area to be visible

  cc.ContentStrategy.SHOW_ALL = new ShowAll(); // Alias: Strategy to scale the content's size proportionally to fill the whole container area

  cc.ContentStrategy.NO_BORDER = new NoBorder(); // Alias: Strategy to scale the content's height to container's height and proportionally scale its width

  cc.ContentStrategy.FIXED_HEIGHT = new FixedHeight(); // Alias: Strategy to scale the content's width to container's width and proportionally scale its height

  cc.ContentStrategy.FIXED_WIDTH = new FixedWidth();
})();
/**
 * <p>cc.ResolutionPolicy class is the root strategy class of scale strategy,
 * its main task is to maintain the compatibility with Cocos2d-x</p>
 *
 * @class ResolutionPolicy
 */

/**
 * @method constructor
 * @param {ContainerStrategy} containerStg The container strategy
 * @param {ContentStrategy} contentStg The content strategy
 */


cc.ResolutionPolicy = cc.Class({
  name: "cc.ResolutionPolicy",

  /**
   * Constructor of cc.ResolutionPolicy
   * @param {ContainerStrategy} containerStg
   * @param {ContentStrategy} contentStg
   */
  ctor: function ctor(containerStg, contentStg) {
    this._containerStrategy = null;
    this._contentStrategy = null;
    this.setContainerStrategy(containerStg);
    this.setContentStrategy(contentStg);
  },

  /**
   * !#en Manipulation before applying the resolution policy
   * !#zh 策略应用前的操作
   * @method preApply
   * @param {View} view The target view
   */
  preApply: function preApply(view) {
    this._containerStrategy.preApply(view);

    this._contentStrategy.preApply(view);
  },

  /**
   * !#en Function to apply this resolution policy
   * The return value is {scale: [scaleX, scaleY], viewport: {cc.Rect}},
   * The target view can then apply these value to itself, it's preferred not to modify directly its private variables
   * !#zh 调用策略方法
   * @method apply
   * @param {View} view - The target view
   * @param {Size} designedResolution - The user defined design resolution
   * @return {Object} An object contains the scale X/Y values and the viewport rect
   */
  apply: function apply(view, designedResolution) {
    this._containerStrategy.apply(view, designedResolution);

    return this._contentStrategy.apply(view, designedResolution);
  },

  /**
   * !#en Manipulation after appyling the strategy
   * !#zh 策略应用之后的操作
   * @method postApply
   * @param {View} view - The target view
   */
  postApply: function postApply(view) {
    this._containerStrategy.postApply(view);

    this._contentStrategy.postApply(view);
  },

  /**
   * !#en
   * Setup the container's scale strategy
   * !#zh 设置容器的适配策略
   * @method setContainerStrategy
   * @param {ContainerStrategy} containerStg
   */
  setContainerStrategy: function setContainerStrategy(containerStg) {
    if (containerStg instanceof cc.ContainerStrategy) this._containerStrategy = containerStg;
  },

  /**
   * !#en
   * Setup the content's scale strategy
   * !#zh 设置内容的适配策略
   * @method setContentStrategy
   * @param {ContentStrategy} contentStg
   */
  setContentStrategy: function setContentStrategy(contentStg) {
    if (contentStg instanceof cc.ContentStrategy) this._contentStrategy = contentStg;
  }
});
js.get(cc.ResolutionPolicy.prototype, "canvasSize", function () {
  return cc.v2(cc.game.canvas.width, cc.game.canvas.height);
});
/**
 * The entire application is visible in the specified area without trying to preserve the original aspect ratio.<br/>
 * Distortion can occur, and the application may appear stretched or compressed.
 * @property {Number} EXACT_FIT
 * @readonly
 * @static
 */

cc.ResolutionPolicy.EXACT_FIT = 0;
/**
 * The entire application fills the specified area, without distortion but possibly with some cropping,<br/>
 * while maintaining the original aspect ratio of the application.
 * @property {Number} NO_BORDER
 * @readonly
 * @static
 */

cc.ResolutionPolicy.NO_BORDER = 1;
/**
 * The entire application is visible in the specified area without distortion while maintaining the original<br/>
 * aspect ratio of the application. Borders can appear on two sides of the application.
 * @property {Number} SHOW_ALL
 * @readonly
 * @static
 */

cc.ResolutionPolicy.SHOW_ALL = 2;
/**
 * The application takes the height of the design resolution size and modifies the width of the internal<br/>
 * canvas so that it fits the aspect ratio of the device<br/>
 * no distortion will occur however you must make sure your application works on different<br/>
 * aspect ratios
 * @property {Number} FIXED_HEIGHT
 * @readonly
 * @static
 */

cc.ResolutionPolicy.FIXED_HEIGHT = 3;
/**
 * The application takes the width of the design resolution size and modifies the height of the internal<br/>
 * canvas so that it fits the aspect ratio of the device<br/>
 * no distortion will occur however you must make sure your application works on different<br/>
 * aspect ratios
 * @property {Number} FIXED_WIDTH
 * @readonly
 * @static
 */

cc.ResolutionPolicy.FIXED_WIDTH = 4;
/**
 * Unknow policy
 * @property {Number} UNKNOWN
 * @readonly
 * @static
 */

cc.ResolutionPolicy.UNKNOWN = 5;
/**
 * @module cc
 */

/**
 * !#en cc.view is the shared view object.
 * !#zh cc.view 是全局的视图对象。
 * @property view
 * @static
 * @type {View}
 */

cc.view = new View();
/**
 * !#en cc.winSize is the alias object for the size of the current game window.
 * !#zh cc.winSize 为当前的游戏窗口的大小。
 * @property winSize
 * @type Size
 */

cc.winSize = cc.size();
module.exports = cc.view;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDVmlldy5qcyJdLCJuYW1lcyI6WyJFdmVudFRhcmdldCIsInJlcXVpcmUiLCJqcyIsInJlbmRlcmVyIiwiX19Ccm93c2VyR2V0dGVyIiwiaW5pdCIsImh0bWwiLCJkb2N1bWVudCIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiYXZhaWxXaWR0aCIsImZyYW1lIiwid2luZG93IiwiaW5uZXJXaWR0aCIsImNsaWVudFdpZHRoIiwiYXZhaWxIZWlnaHQiLCJpbm5lckhlaWdodCIsImNsaWVudEhlaWdodCIsIm1ldGEiLCJhZGFwdGF0aW9uVHlwZSIsImNjIiwic3lzIiwiYnJvd3NlclR5cGUiLCJvcyIsIk9TX0lPUyIsIkJST1dTRVJfVFlQRV9TQUZBUkkiLCJpc01vYmlsZSIsIkJST1dTRVJfVFlQRV9TT1VHT1UiLCJCUk9XU0VSX1RZUEVfVUMiLCJfc2Npc3NvclJlY3QiLCJWaWV3IiwiY2FsbCIsIl90IiwiX3N0cmF0ZWd5ZXIiLCJDb250YWluZXJTdHJhdGVneSIsIl9zdHJhdGVneSIsIkNvbnRlbnRTdHJhdGVneSIsIl9mcmFtZVNpemUiLCJzaXplIiwiX2Rlc2lnblJlc29sdXRpb25TaXplIiwiX29yaWdpbmFsRGVzaWduUmVzb2x1dGlvblNpemUiLCJfc2NhbGVYIiwiX3NjYWxlWSIsIl92aWV3cG9ydFJlY3QiLCJyZWN0IiwiX3Zpc2libGVSZWN0IiwiX2F1dG9GdWxsU2NyZWVuIiwiX2RldmljZVBpeGVsUmF0aW8iLCJDQ19KU0IiLCJfbWF4UGl4ZWxSYXRpbyIsIl9yZXRpbmFFbmFibGVkIiwiX3Jlc2l6ZUNhbGxiYWNrIiwiX3Jlc2l6aW5nIiwiX3Jlc2l6ZVdpdGhCcm93c2VyU2l6ZSIsIl9vcmllbnRhdGlvbkNoYW5naW5nIiwiX2lzUm90YXRlZCIsIl9vcmllbnRhdGlvbiIsIm1hY3JvIiwiT1JJRU5UQVRJT05fQVVUTyIsIl9pc0FkanVzdFZpZXdwb3J0IiwiX2FudGlBbGlhc0VuYWJsZWQiLCJfcmVzb2x1dGlvblBvbGljeSIsIl9ycEV4YWN0Rml0IiwiUmVzb2x1dGlvblBvbGljeSIsIkVRVUFMX1RPX0ZSQU1FIiwiRVhBQ1RfRklUIiwiX3JwU2hvd0FsbCIsIlNIT1dfQUxMIiwiX3JwTm9Cb3JkZXIiLCJOT19CT1JERVIiLCJfcnBGaXhlZEhlaWdodCIsIkZJWEVEX0hFSUdIVCIsIl9ycEZpeGVkV2lkdGgiLCJGSVhFRF9XSURUSCIsImdhbWUiLCJvbmNlIiwiRVZFTlRfRU5HSU5FX0lOSVRFRCIsImV4dGVuZCIsIm1peGluIiwicHJvdG90eXBlIiwiX2luaXRGcmFtZVNpemUiLCJ3IiwiY2FudmFzIiwid2lkdGgiLCJoIiwiaGVpZ2h0Iiwid2luU2l6ZSIsInZpc2libGVSZWN0IiwiX3Jlc2l6ZUV2ZW50IiwiZm9yY2VPckV2ZW50IiwidmlldyIsInNldERlc2lnblJlc29sdXRpb25TaXplIiwicHJldkZyYW1lVyIsInByZXZGcmFtZUgiLCJwcmV2Um90YXRlZCIsImNvbnRhaW5lclN0eWxlIiwiY29udGFpbmVyIiwic3R5bGUiLCJtYXJnaW4iLCJkaXNwbGF5IiwiZW1pdCIsIl9vcmllbnRhdGlvbkNoYW5nZSIsInNldFRpbWVvdXQiLCJzY3JvbGxUbyIsInJlc2l6ZVdpdGhCcm93c2VyU2l6ZSIsImVuYWJsZWQiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInNldFJlc2l6ZUNhbGxiYWNrIiwiY2FsbGJhY2siLCJDQ19FRElUT1IiLCJzZXRPcmllbnRhdGlvbiIsIm9yaWVudGF0aW9uIiwiZGVzaWduV2lkdGgiLCJkZXNpZ25IZWlnaHQiLCJsb2NGcmFtZVNpemUiLCJpc0xhbmRzY2FwZSIsIk9SSUVOVEFUSU9OX0xBTkRTQ0FQRSIsIk9SSUVOVEFUSU9OX1BPUlRSQUlUIiwidHJhbnNmb3JtIiwidHJhbnNmb3JtT3JpZ2luIiwiX3NldFZpZXdwb3J0TWV0YSIsIm1ldGFzIiwib3ZlcndyaXRlIiwidnAiLCJnZXRFbGVtZW50QnlJZCIsImhlYWQiLCJyZW1vdmVDaGlsZCIsImVsZW1zIiwiZ2V0RWxlbWVudHNCeU5hbWUiLCJjdXJyZW50VlAiLCJjb250ZW50Iiwia2V5IiwicGF0dGVybiIsImNyZWF0ZUVsZW1lbnQiLCJpZCIsIm5hbWUiLCJpbmRleE9mIiwiUmVnRXhwIiwicmVwbGFjZSIsInRlc3QiLCJzdWJzdHIiLCJhcHBlbmRDaGlsZCIsIl9hZGp1c3RWaWV3cG9ydE1ldGEiLCJDQ19SVU5USU1FIiwiYWRqdXN0Vmlld3BvcnRNZXRhIiwiZW5hYmxlUmV0aW5hIiwid2FybiIsImlzUmV0aW5hRW5hYmxlZCIsImVuYWJsZUFudGlBbGlhcyIsIndhcm5JRCIsInJlbmRlclR5cGUiLCJSRU5ERVJfVFlQRV9XRUJHTCIsImNhY2hlIiwibG9hZGVyIiwiX2NhY2hlIiwiaXRlbSIsInRleCIsIlRleHR1cmUyRCIsIkZpbHRlciIsInNldEZpbHRlcnMiLCJMSU5FQVIiLCJORUFSRVNUIiwiUkVOREVSX1RZUEVfQ0FOVkFTIiwiY3R4IiwiZ2V0Q29udGV4dCIsImltYWdlU21vb3RoaW5nRW5hYmxlZCIsIm1vekltYWdlU21vb3RoaW5nRW5hYmxlZCIsImlzQW50aUFsaWFzRW5hYmxlZCIsImVuYWJsZUF1dG9GdWxsU2NyZWVuIiwic2NyZWVuIiwiYXV0b0Z1bGxTY3JlZW4iLCJkaXNhYmxlQXV0b0Z1bGxTY3JlZW4iLCJpc0F1dG9GdWxsU2NyZWVuRW5hYmxlZCIsInNldENhbnZhc1NpemUiLCJnZXRDYW52YXNTaXplIiwiZ2V0RnJhbWVTaXplIiwic2V0RnJhbWVTaXplIiwiZ2V0VmlzaWJsZVNpemUiLCJnZXRWaXNpYmxlU2l6ZUluUGl4ZWwiLCJnZXRWaXNpYmxlT3JpZ2luIiwidjIiLCJ4IiwieSIsImdldFZpc2libGVPcmlnaW5JblBpeGVsIiwiZ2V0UmVzb2x1dGlvblBvbGljeSIsInNldFJlc29sdXRpb25Qb2xpY3kiLCJyZXNvbHV0aW9uUG9saWN5IiwiX2xvY1BvbGljeSIsImxvZ0lEIiwicG9saWN5IiwicHJlQXBwbHkiLCJyZXN1bHQiLCJhcHBseSIsInNjYWxlIiwibGVuZ3RoIiwidmlld3BvcnQiLCJ2YiIsInJ2IiwicG9zdEFwcGx5IiwidXBkYXRlQ2FtZXJhVmlld3BvcnQiLCJfY2MiLCJpbnB1dE1hbmFnZXIiLCJfdXBkYXRlQ2FudmFzQm91bmRpbmdSZWN0IiwiZ2V0RGVzaWduUmVzb2x1dGlvblNpemUiLCJzZXRSZWFsUGl4ZWxSZXNvbHV0aW9uIiwiZG9jdW1lbnRFbGVtZW50IiwiYm9keSIsImxlZnQiLCJ0b3AiLCJzZXRWaWV3cG9ydEluUG9pbnRzIiwibG9jU2NhbGVYIiwibG9jU2NhbGVZIiwiX3JlbmRlckNvbnRleHQiLCJzZXRTY2lzc29ySW5Qb2ludHMiLCJzY2FsZVgiLCJzY2FsZVkiLCJzeCIsIk1hdGgiLCJjZWlsIiwic3kiLCJzdyIsInNoIiwiZ2wiLCJib3hBcnIiLCJnZXRQYXJhbWV0ZXIiLCJTQ0lTU09SX0JPWCIsInNjaXNzb3IiLCJpc1NjaXNzb3JFbmFibGVkIiwiaXNFbmFibGVkIiwiU0NJU1NPUl9URVNUIiwiZ2V0U2Npc3NvclJlY3QiLCJzY2FsZVhGYWN0b3IiLCJzY2FsZVlGYWN0b3IiLCJnZXRWaWV3cG9ydFJlY3QiLCJnZXRTY2FsZVgiLCJnZXRTY2FsZVkiLCJnZXREZXZpY2VQaXhlbFJhdGlvIiwiY29udmVydFRvTG9jYXRpb25JblZpZXciLCJ0eCIsInR5IiwicmVsYXRlZFBvcyIsIm91dCIsInBvc0xlZnQiLCJhZGp1c3RlZExlZnQiLCJwb3NUb3AiLCJhZGp1c3RlZFRvcCIsIl9jb252ZXJ0TW91c2VUb0xvY2F0aW9uSW5WaWV3IiwiaW5fb3V0X3BvaW50IiwiX2NvbnZlcnRQb2ludFdpdGhTY2FsZSIsInBvaW50IiwiX2NvbnZlcnRUb3VjaGVzV2l0aFNjYWxlIiwidG91Y2hlcyIsInNlbFRvdWNoIiwic2VsUG9pbnQiLCJzZWxQcmVQb2ludCIsImkiLCJfcG9pbnQiLCJfcHJldlBvaW50IiwiQ2xhc3MiLCJkZXNpZ25lZFJlc29sdXRpb24iLCJfc2V0dXBDb250YWluZXIiLCJsb2NDYW52YXMiLCJfc2V0dXBTdHlsZSIsImRldmljZVBpeGVsUmF0aW8iLCJtaW4iLCJsb2NDb250YWluZXIiLCJPU19BTkRST0lEIiwiX2ZpeENvbnRhaW5lciIsImluc2VydEJlZm9yZSIsImZpcnN0Q2hpbGQiLCJicyIsIm92ZXJmbG93IiwiY29udFN0eWxlIiwicG9zaXRpb24iLCJzY3JvbGxUb3AiLCJjdG9yIiwiX3Jlc3VsdCIsIl9idWlsZFJlc3VsdCIsImNvbnRhaW5lclciLCJjb250YWluZXJIIiwiY29udGVudFciLCJjb250ZW50SCIsImFicyIsIkVxdWFsVG9GcmFtZSIsImZyYW1lSCIsInBhZGRpbmciLCJQcm9wb3J0aW9uYWxUb0ZyYW1lIiwiZnJhbWVXIiwiZGVzaWduVyIsImRlc2lnbkgiLCJvZmZ4Iiwicm91bmQiLCJvZmZ5IiwicGFkZGluZ0xlZnQiLCJwYWRkaW5nUmlnaHQiLCJwYWRkaW5nVG9wIiwicGFkZGluZ0JvdHRvbSIsIkVxdWFsVG9XaW5kb3ciLCJfc3VwZXIiLCJQcm9wb3J0aW9uYWxUb1dpbmRvdyIsIk9yaWdpbmFsQ29udGFpbmVyIiwiX2dsb2JhbCIsImdsb2JhbCIsImdsb2JhbEFkYXB0ZXIiLCJfX2dsb2JhbEFkYXB0ZXIiLCJhZGFwdENvbnRhaW5lclN0cmF0ZWd5IiwiYWRhcHRWaWV3IiwiUFJPUE9SVElPTl9UT19GUkFNRSIsIk9SSUdJTkFMX0NPTlRBSU5FUiIsIkV4YWN0Rml0IiwiU2hvd0FsbCIsIk5vQm9yZGVyIiwiRml4ZWRIZWlnaHQiLCJGaXhlZFdpZHRoIiwiY29udGFpbmVyU3RnIiwiY29udGVudFN0ZyIsIl9jb250YWluZXJTdHJhdGVneSIsIl9jb250ZW50U3RyYXRlZ3kiLCJzZXRDb250YWluZXJTdHJhdGVneSIsInNldENvbnRlbnRTdHJhdGVneSIsImdldCIsIlVOS05PV04iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkJBLElBQU1BLFdBQVcsR0FBR0MsT0FBTyxDQUFDLHVCQUFELENBQTNCOztB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LElBQUgsQ0FBUVEsTUFBUixDQUFlQyxLQUFyQixFQUE0Qi9ELEVBQUUsQ0FBQ3NELElBQUgsQ0FBUVEsTUFBUixDQUFlRyxNQUEzQyxDQUFQO0FBQ0gsQ0FGRDtBQUlBOzs7Ozs7OztBQU9BakUsRUFBRSxDQUFDMkMsZ0JBQUgsQ0FBb0JFLFNBQXBCLEdBQWdDLENBQWhDO0FBRUE7Ozs7Ozs7O0FBT0E3QyxFQUFFLENBQUMyQyxnQkFBSCxDQUFvQk0sU0FBcEIsR0FBZ0MsQ0FBaEM7QUFFQTs7Ozs7Ozs7QUFPQWpELEVBQUUsQ0FBQzJDLGdCQUFILENBQW9CSSxRQUFwQixHQUErQixDQUEvQjtBQUVBOzs7Ozs7Ozs7O0FBU0EvQyxFQUFFLENBQUMyQyxnQkFBSCxDQUFvQlEsWUFBcEIsR0FBbUMsQ0FBbkM7QUFFQTs7Ozs7Ozs7OztBQVNBbkQsRUFBRSxDQUFDMkMsZ0JBQUgsQ0FBb0JVLFdBQXBCLEdBQWtDLENBQWxDO0FBRUE7Ozs7Ozs7QUFNQXJELEVBQUUsQ0FBQzJDLGdCQUFILENBQW9CbVEsT0FBcEIsR0FBOEIsQ0FBOUI7QUFFQTs7OztBQUlBOzs7Ozs7OztBQU9BOVMsRUFBRSxDQUFDc0UsSUFBSCxHQUFVLElBQUk1RCxJQUFKLEVBQVY7QUFFQTs7Ozs7OztBQU1BVixFQUFFLENBQUNrRSxPQUFILEdBQWFsRSxFQUFFLENBQUNrQixJQUFILEVBQWI7QUFFQTZSLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQmhULEVBQUUsQ0FBQ3NFLElBQXBCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMDgtMjAxMCBSaWNhcmRvIFF1ZXNhZGFcbiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxMiBjb2NvczJkLXgub3JnXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBFdmVudFRhcmdldCA9IHJlcXVpcmUoJy4uL2V2ZW50L2V2ZW50LXRhcmdldCcpO1xuY29uc3QganMgPSByZXF1aXJlKCcuLi9wbGF0Zm9ybS9qcycpO1xuY29uc3QgcmVuZGVyZXIgPSByZXF1aXJlKCcuLi9yZW5kZXJlcicpO1xucmVxdWlyZSgnLi4vcGxhdGZvcm0vQ0NDbGFzcycpO1xuXG52YXIgX19Ccm93c2VyR2V0dGVyID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuaHRtbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaHRtbFwiKVswXTtcbiAgICB9LFxuICAgIGF2YWlsV2lkdGg6IGZ1bmN0aW9uKGZyYW1lKXtcbiAgICAgICAgaWYgKCFmcmFtZSB8fCBmcmFtZSA9PT0gdGhpcy5odG1sKVxuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gZnJhbWUuY2xpZW50V2lkdGg7XG4gICAgfSxcbiAgICBhdmFpbEhlaWdodDogZnVuY3Rpb24oZnJhbWUpe1xuICAgICAgICBpZiAoIWZyYW1lIHx8IGZyYW1lID09PSB0aGlzLmh0bWwpXG4gICAgICAgICAgICByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gZnJhbWUuY2xpZW50SGVpZ2h0O1xuICAgIH0sXG4gICAgbWV0YToge1xuICAgICAgICBcIndpZHRoXCI6IFwiZGV2aWNlLXdpZHRoXCJcbiAgICB9LFxuICAgIGFkYXB0YXRpb25UeXBlOiBjYy5zeXMuYnJvd3NlclR5cGVcbn07XG5cbmlmIChjYy5zeXMub3MgPT09IGNjLnN5cy5PU19JT1MpIC8vIEFsbCBicm93c2VycyBhcmUgV2ViVmlld1xuICAgIF9fQnJvd3NlckdldHRlci5hZGFwdGF0aW9uVHlwZSA9IGNjLnN5cy5CUk9XU0VSX1RZUEVfU0FGQVJJO1xuXG5zd2l0Y2ggKF9fQnJvd3NlckdldHRlci5hZGFwdGF0aW9uVHlwZSkge1xuICAgIGNhc2UgY2Muc3lzLkJST1dTRVJfVFlQRV9TQUZBUkk6XG4gICAgICAgIF9fQnJvd3NlckdldHRlci5tZXRhW1wibWluaW1hbC11aVwiXSA9IFwidHJ1ZVwiO1xuICAgICAgICBfX0Jyb3dzZXJHZXR0ZXIuYXZhaWxXaWR0aCA9IGNjLnN5cy5pc01vYmlsZSA/IGZ1bmN0aW9uIChmcmFtZSl7XG4gICAgICAgICAgICAvLyBidWcgZml4IGZvciBuYXZpZ2F0aW9uIGJhciBvbiBTYWZhcmlcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgfSA6IGZ1bmN0aW9uIChmcmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZyYW1lLmNsaWVudFdpZHRoO1xuICAgICAgICB9XG4gICAgICAgIF9fQnJvd3NlckdldHRlci5hdmFpbEhlaWdodCA9IGNjLnN5cy5pc01vYmlsZSA/IGZ1bmN0aW9uIChmcmFtZSl7XG4gICAgICAgICAgICAvLyBidWcgZml4IGZvciBuYXZpZ2F0aW9uIGJhciBvbiBTYWZhcmlcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgIH0gOiBmdW5jdGlvbiAoZnJhbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBmcmFtZS5jbGllbnRIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgY2FzZSBjYy5zeXMuQlJPV1NFUl9UWVBFX1NPVUdPVTpcbiAgICBjYXNlIGNjLnN5cy5CUk9XU0VSX1RZUEVfVUM6XG4gICAgICAgIF9fQnJvd3NlckdldHRlci5tZXRhW1wibWluaW1hbC11aVwiXSA9IFwidHJ1ZVwiO1xuICAgICAgICBfX0Jyb3dzZXJHZXR0ZXIuYXZhaWxXaWR0aCA9IGZ1bmN0aW9uKGZyYW1lKXtcbiAgICAgICAgICAgIHJldHVybiBmcmFtZS5jbGllbnRXaWR0aDtcbiAgICAgICAgfTtcbiAgICAgICAgX19Ccm93c2VyR2V0dGVyLmF2YWlsSGVpZ2h0ID0gZnVuY3Rpb24oZnJhbWUpe1xuICAgICAgICAgICAgcmV0dXJuIGZyYW1lLmNsaWVudEhlaWdodDtcbiAgICAgICAgfTtcbiAgICAgICAgYnJlYWs7XG59XG5cbnZhciBfc2Npc3NvclJlY3QgPSBudWxsO1xuXG4vKipcbiAqIGNjLnZpZXcgaXMgdGhlIHNpbmdsZXRvbiBvYmplY3Qgd2hpY2ggcmVwcmVzZW50cyB0aGUgZ2FtZSB3aW5kb3cuPGJyLz5cbiAqIEl0J3MgbWFpbiB0YXNrIGluY2x1ZGU6IDxici8+XG4gKiAgLSBBcHBseSB0aGUgZGVzaWduIHJlc29sdXRpb24gcG9saWN5PGJyLz5cbiAqICAtIFByb3ZpZGUgaW50ZXJhY3Rpb24gd2l0aCB0aGUgd2luZG93LCBsaWtlIHJlc2l6ZSBldmVudCBvbiB3ZWIsIHJldGluYSBkaXNwbGF5IHN1cHBvcnQsIGV0Yy4uLjxici8+XG4gKiAgLSBNYW5hZ2UgdGhlIGdhbWUgdmlldyBwb3J0IHdoaWNoIGNhbiBiZSBkaWZmZXJlbnQgd2l0aCB0aGUgd2luZG93PGJyLz5cbiAqICAtIE1hbmFnZSB0aGUgY29udGVudCBzY2FsZSBhbmQgdHJhbnNsYXRpb248YnIvPlxuICogPGJyLz5cbiAqIFNpbmNlIHRoZSBjYy52aWV3IGlzIGEgc2luZ2xldG9uLCB5b3UgZG9uJ3QgbmVlZCB0byBjYWxsIGFueSBjb25zdHJ1Y3RvciBvciBjcmVhdGUgZnVuY3Rpb25zLDxici8+XG4gKiB0aGUgc3RhbmRhcmQgd2F5IHRvIHVzZSBpdCBpcyBieSBjYWxsaW5nOjxici8+XG4gKiAgLSBjYy52aWV3Lm1ldGhvZE5hbWUoKTsgPGJyLz5cbiAqXG4gKiBAY2xhc3MgVmlld1xuICogQGV4dGVuZHMgRXZlbnRUYXJnZXRcbiAqL1xudmFyIFZpZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgRXZlbnRUYXJnZXQuY2FsbCh0aGlzKTtcblxuICAgIHZhciBfdCA9IHRoaXMsIF9zdHJhdGVneWVyID0gY2MuQ29udGFpbmVyU3RyYXRlZ3ksIF9zdHJhdGVneSA9IGNjLkNvbnRlbnRTdHJhdGVneTtcblxuICAgIF9fQnJvd3NlckdldHRlci5pbml0KHRoaXMpO1xuXG4gICAgLy8gU2l6ZSBvZiBwYXJlbnQgbm9kZSB0aGF0IGNvbnRhaW5zIGNjLmdhbWUuY29udGFpbmVyIGFuZCBjYy5nYW1lLmNhbnZhc1xuICAgIF90Ll9mcmFtZVNpemUgPSBjYy5zaXplKDAsIDApO1xuXG4gICAgLy8gcmVzb2x1dGlvbiBzaXplLCBpdCBpcyB0aGUgc2l6ZSBhcHByb3ByaWF0ZSBmb3IgdGhlIGFwcCByZXNvdXJjZXMuXG4gICAgX3QuX2Rlc2lnblJlc29sdXRpb25TaXplID0gY2Muc2l6ZSgwLCAwKTtcbiAgICBfdC5fb3JpZ2luYWxEZXNpZ25SZXNvbHV0aW9uU2l6ZSA9IGNjLnNpemUoMCwgMCk7XG4gICAgX3QuX3NjYWxlWCA9IDE7XG4gICAgX3QuX3NjYWxlWSA9IDE7XG4gICAgLy8gVmlld3BvcnQgaXMgdGhlIGNvbnRhaW5lcidzIHJlY3QgcmVsYXRlZCB0byBjb250ZW50J3MgY29vcmRpbmF0ZXMgaW4gcGl4ZWxcbiAgICBfdC5fdmlld3BvcnRSZWN0ID0gY2MucmVjdCgwLCAwLCAwLCAwKTtcbiAgICAvLyBUaGUgdmlzaWJsZSByZWN0IGluIGNvbnRlbnQncyBjb29yZGluYXRlIGluIHBvaW50XG4gICAgX3QuX3Zpc2libGVSZWN0ID0gY2MucmVjdCgwLCAwLCAwLCAwKTtcbiAgICAvLyBBdXRvIGZ1bGwgc2NyZWVuIGRpc2FibGVkIGJ5IGRlZmF1bHRcbiAgICBfdC5fYXV0b0Z1bGxTY3JlZW4gPSBmYWxzZTtcbiAgICAvLyBUaGUgZGV2aWNlJ3MgcGl4ZWwgcmF0aW8gKGZvciByZXRpbmEgZGlzcGxheXMpXG4gICAgX3QuX2RldmljZVBpeGVsUmF0aW8gPSAxO1xuICAgIGlmKENDX0pTQikge1xuICAgICAgICBfdC5fbWF4UGl4ZWxSYXRpbyA9IDQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgX3QuX21heFBpeGVsUmF0aW8gPSAyO1xuICAgIH1cbiAgICAvLyBSZXRpbmEgZGlzYWJsZWQgYnkgZGVmYXVsdFxuICAgIF90Ll9yZXRpbmFFbmFibGVkID0gZmFsc2U7XG4gICAgLy8gQ3VzdG9tIGNhbGxiYWNrIGZvciByZXNpemUgZXZlbnRcbiAgICBfdC5fcmVzaXplQ2FsbGJhY2sgPSBudWxsO1xuICAgIF90Ll9yZXNpemluZyA9IGZhbHNlO1xuICAgIF90Ll9yZXNpemVXaXRoQnJvd3NlclNpemUgPSBmYWxzZTtcbiAgICBfdC5fb3JpZW50YXRpb25DaGFuZ2luZyA9IHRydWU7XG4gICAgX3QuX2lzUm90YXRlZCA9IGZhbHNlO1xuICAgIF90Ll9vcmllbnRhdGlvbiA9IGNjLm1hY3JvLk9SSUVOVEFUSU9OX0FVVE87XG4gICAgX3QuX2lzQWRqdXN0Vmlld3BvcnQgPSB0cnVlO1xuICAgIF90Ll9hbnRpQWxpYXNFbmFibGVkID0gZmFsc2U7XG5cbiAgICAvLyBTZXR1cCBzeXN0ZW0gZGVmYXVsdCByZXNvbHV0aW9uIHBvbGljaWVzXG4gICAgX3QuX3Jlc29sdXRpb25Qb2xpY3kgPSBudWxsO1xuICAgIF90Ll9ycEV4YWN0Rml0ID0gbmV3IGNjLlJlc29sdXRpb25Qb2xpY3koX3N0cmF0ZWd5ZXIuRVFVQUxfVE9fRlJBTUUsIF9zdHJhdGVneS5FWEFDVF9GSVQpO1xuICAgIF90Ll9ycFNob3dBbGwgPSBuZXcgY2MuUmVzb2x1dGlvblBvbGljeShfc3RyYXRlZ3llci5FUVVBTF9UT19GUkFNRSwgX3N0cmF0ZWd5LlNIT1dfQUxMKTtcbiAgICBfdC5fcnBOb0JvcmRlciA9IG5ldyBjYy5SZXNvbHV0aW9uUG9saWN5KF9zdHJhdGVneWVyLkVRVUFMX1RPX0ZSQU1FLCBfc3RyYXRlZ3kuTk9fQk9SREVSKTtcbiAgICBfdC5fcnBGaXhlZEhlaWdodCA9IG5ldyBjYy5SZXNvbHV0aW9uUG9saWN5KF9zdHJhdGVneWVyLkVRVUFMX1RPX0ZSQU1FLCBfc3RyYXRlZ3kuRklYRURfSEVJR0hUKTtcbiAgICBfdC5fcnBGaXhlZFdpZHRoID0gbmV3IGNjLlJlc29sdXRpb25Qb2xpY3koX3N0cmF0ZWd5ZXIuRVFVQUxfVE9fRlJBTUUsIF9zdHJhdGVneS5GSVhFRF9XSURUSCk7XG5cbiAgICBjYy5nYW1lLm9uY2UoY2MuZ2FtZS5FVkVOVF9FTkdJTkVfSU5JVEVELCB0aGlzLmluaXQsIHRoaXMpO1xufTtcblxuY2MuanMuZXh0ZW5kKFZpZXcsIEV2ZW50VGFyZ2V0KTtcblxuY2MuanMubWl4aW4oVmlldy5wcm90b3R5cGUsIHtcbiAgICBpbml0ICgpIHtcbiAgICAgICAgdGhpcy5faW5pdEZyYW1lU2l6ZSgpO1xuXG4gICAgICAgIHZhciB3ID0gY2MuZ2FtZS5jYW52YXMud2lkdGgsIGggPSBjYy5nYW1lLmNhbnZhcy5oZWlnaHQ7XG4gICAgICAgIHRoaXMuX2Rlc2lnblJlc29sdXRpb25TaXplLndpZHRoID0gdztcbiAgICAgICAgdGhpcy5fZGVzaWduUmVzb2x1dGlvblNpemUuaGVpZ2h0ID0gaDtcbiAgICAgICAgdGhpcy5fb3JpZ2luYWxEZXNpZ25SZXNvbHV0aW9uU2l6ZS53aWR0aCA9IHc7XG4gICAgICAgIHRoaXMuX29yaWdpbmFsRGVzaWduUmVzb2x1dGlvblNpemUuaGVpZ2h0ID0gaDtcbiAgICAgICAgdGhpcy5fdmlld3BvcnRSZWN0LndpZHRoID0gdztcbiAgICAgICAgdGhpcy5fdmlld3BvcnRSZWN0LmhlaWdodCA9IGg7XG4gICAgICAgIHRoaXMuX3Zpc2libGVSZWN0LndpZHRoID0gdztcbiAgICAgICAgdGhpcy5fdmlzaWJsZVJlY3QuaGVpZ2h0ID0gaDtcblxuICAgICAgICBjYy53aW5TaXplLndpZHRoID0gdGhpcy5fdmlzaWJsZVJlY3Qud2lkdGg7XG4gICAgICAgIGNjLndpblNpemUuaGVpZ2h0ID0gdGhpcy5fdmlzaWJsZVJlY3QuaGVpZ2h0O1xuICAgICAgICBjYy52aXNpYmxlUmVjdCAmJiBjYy52aXNpYmxlUmVjdC5pbml0KHRoaXMuX3Zpc2libGVSZWN0KTtcbiAgICB9LFxuXG4gICAgLy8gUmVzaXplIGhlbHBlciBmdW5jdGlvbnNcbiAgICBfcmVzaXplRXZlbnQ6IGZ1bmN0aW9uIChmb3JjZU9yRXZlbnQpIHtcbiAgICAgICAgdmFyIHZpZXc7XG4gICAgICAgIGlmICh0aGlzLnNldERlc2lnblJlc29sdXRpb25TaXplKSB7XG4gICAgICAgICAgICB2aWV3ID0gdGhpcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZpZXcgPSBjYy52aWV3O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgZnJhbWUgc2l6ZSBjaGFuZ2VkIG9yIG5vdFxuICAgICAgICB2YXIgcHJldkZyYW1lVyA9IHZpZXcuX2ZyYW1lU2l6ZS53aWR0aCwgcHJldkZyYW1lSCA9IHZpZXcuX2ZyYW1lU2l6ZS5oZWlnaHQsIHByZXZSb3RhdGVkID0gdmlldy5faXNSb3RhdGVkO1xuICAgICAgICBpZiAoY2Muc3lzLmlzTW9iaWxlKSB7XG4gICAgICAgICAgICB2YXIgY29udGFpbmVyU3R5bGUgPSBjYy5nYW1lLmNvbnRhaW5lci5zdHlsZSxcbiAgICAgICAgICAgICAgICBtYXJnaW4gPSBjb250YWluZXJTdHlsZS5tYXJnaW47XG4gICAgICAgICAgICBjb250YWluZXJTdHlsZS5tYXJnaW4gPSAnMCc7XG4gICAgICAgICAgICBjb250YWluZXJTdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgdmlldy5faW5pdEZyYW1lU2l6ZSgpO1xuICAgICAgICAgICAgY29udGFpbmVyU3R5bGUubWFyZ2luID0gbWFyZ2luO1xuICAgICAgICAgICAgY29udGFpbmVyU3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2aWV3Ll9pbml0RnJhbWVTaXplKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvcmNlT3JFdmVudCAhPT0gdHJ1ZSAmJiB2aWV3Ll9pc1JvdGF0ZWQgPT09IHByZXZSb3RhdGVkICYmIHZpZXcuX2ZyYW1lU2l6ZS53aWR0aCA9PT0gcHJldkZyYW1lVyAmJiB2aWV3Ll9mcmFtZVNpemUuaGVpZ2h0ID09PSBwcmV2RnJhbWVIKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIC8vIEZyYW1lIHNpemUgY2hhbmdlZCwgZG8gcmVzaXplIHdvcmtzXG4gICAgICAgIHZhciB3aWR0aCA9IHZpZXcuX29yaWdpbmFsRGVzaWduUmVzb2x1dGlvblNpemUud2lkdGg7XG4gICAgICAgIHZhciBoZWlnaHQgPSB2aWV3Ll9vcmlnaW5hbERlc2lnblJlc29sdXRpb25TaXplLmhlaWdodDtcbiAgICAgICAgdmlldy5fcmVzaXppbmcgPSB0cnVlO1xuICAgICAgICBpZiAod2lkdGggPiAwKVxuICAgICAgICAgICAgdmlldy5zZXREZXNpZ25SZXNvbHV0aW9uU2l6ZSh3aWR0aCwgaGVpZ2h0LCB2aWV3Ll9yZXNvbHV0aW9uUG9saWN5KTtcbiAgICAgICAgdmlldy5fcmVzaXppbmcgPSBmYWxzZTtcblxuICAgICAgICB2aWV3LmVtaXQoJ2NhbnZhcy1yZXNpemUnKTtcbiAgICAgICAgaWYgKHZpZXcuX3Jlc2l6ZUNhbGxiYWNrKSB7XG4gICAgICAgICAgICB2aWV3Ll9yZXNpemVDYWxsYmFjay5jYWxsKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX29yaWVudGF0aW9uQ2hhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLnZpZXcuX29yaWVudGF0aW9uQ2hhbmdpbmcgPSB0cnVlO1xuICAgICAgICBjYy52aWV3Ll9yZXNpemVFdmVudCgpO1xuICAgICAgICAvLyBIQUNLOiBzaG93IG5hdiBiYXIgb24gaU9TIHNhZmFyaVxuICAgICAgICAvLyBzYWZhcmkgd2lsbCBlbnRlciBmdWxsc2NyZWVuIHdoZW4gcm90YXRlIHRvIGxhbmRzY2FwZVxuICAgICAgICAvLyBuZWVkIHRvIGV4aXQgZnVsbHNjcmVlbiB3aGVuIHJvdGF0ZSBiYWNrIHRvIHBvcnRyYWl0LCBzY3JvbGxUbygwLCAxKSB3b3Jrcy5cbiAgICAgICAgaWYgKGNjLnN5cy5icm93c2VyVHlwZSA9PT0gY2Muc3lzLkJST1dTRVJfVFlQRV9TQUZBUkkgJiYgY2Muc3lzLmlzTW9iaWxlKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAod2luZG93LmlubmVySGVpZ2h0ID4gd2luZG93LmlubmVyV2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDUwMCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNldHMgdmlldydzIHRhcmdldC1kZW5zaXR5ZHBpIGZvciBhbmRyb2lkIG1vYmlsZSBicm93c2VyLiBpdCBjYW4gYmUgc2V0IHRvOiAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgIDEuIGNjLm1hY3JvLkRFTlNJVFlEUElfREVWSUNFLCB2YWx1ZSBpcyBcImRldmljZS1kcGlcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgIDIuIGNjLm1hY3JvLkRFTlNJVFlEUElfSElHSCwgdmFsdWUgaXMgXCJoaWdoLWRwaVwiICAoZGVmYXVsdCB2YWx1ZSkgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgIDMuIGNjLm1hY3JvLkRFTlNJVFlEUElfTUVESVVNLCB2YWx1ZSBpcyBcIm1lZGl1bS1kcGlcIiAoYnJvd3NlcidzIGRlZmF1bHQgdmFsdWUpICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgIDQuIGNjLm1hY3JvLkRFTlNJVFlEUElfTE9XLCB2YWx1ZSBpcyBcImxvdy1kcGlcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgIDUuIEN1c3RvbSB2YWx1ZSwgZS5nOiBcIjQ4MFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAhI3poIOiuvue9ruebruagh+WGheWuueeahOavj+iLseWvuOWDj+e0oOeCueWvhuW6puOAglxuICAgICAqXG4gICAgICogQG1ldGhvZCBzZXRUYXJnZXREZW5zaXR5RFBJXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGRlbnNpdHlEUElcbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmV0dXJucyB0aGUgY3VycmVudCB0YXJnZXQtZGVuc2l0eWRwaSB2YWx1ZSBvZiBjYy52aWV3LlxuICAgICAqICEjemgg6I635Y+W55uu5qCH5YaF5a6555qE5q+P6Iux5a+45YOP57Sg54K55a+G5bqm44CCXG4gICAgICogQG1ldGhvZCBnZXRUYXJnZXREZW5zaXR5RFBJXG4gICAgICogQHJldHVybnMge1N0cmluZ31cbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogU2V0cyB3aGV0aGVyIHJlc2l6ZSBjYW52YXMgYXV0b21hdGljYWxseSB3aGVuIGJyb3dzZXIncyBzaXplIGNoYW5nZWQuPGJyLz5cbiAgICAgKiBVc2VmdWwgb25seSBvbiB3ZWIuXG4gICAgICogISN6aCDorr7nva7lvZPlj5HnjrDmtY/op4jlmajnmoTlsLrlr7jmlLnlj5jml7bvvIzmmK/lkKboh6rliqjosIPmlbQgY2FudmFzIOWwuuWvuOWkp+Wwj+OAglxuICAgICAqIOS7heWcqCBXZWIg5qih5byP5LiL5pyJ5pWI44CCXG4gICAgICogQG1ldGhvZCByZXNpemVXaXRoQnJvd3NlclNpemVcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGVuYWJsZWQgLSBXaGV0aGVyIGVuYWJsZSBhdXRvbWF0aWMgcmVzaXplIHdpdGggYnJvd3NlcidzIHJlc2l6ZSBldmVudFxuICAgICAqL1xuICAgIHJlc2l6ZVdpdGhCcm93c2VyU2l6ZTogZnVuY3Rpb24gKGVuYWJsZWQpIHtcbiAgICAgICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgICAgICAgIC8vZW5hYmxlXG4gICAgICAgICAgICBpZiAoIXRoaXMuX3Jlc2l6ZVdpdGhCcm93c2VyU2l6ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZVdpdGhCcm93c2VyU2l6ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZUV2ZW50KTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb3JpZW50YXRpb25jaGFuZ2UnLCB0aGlzLl9vcmllbnRhdGlvbkNoYW5nZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL2Rpc2FibGVcbiAgICAgICAgICAgIGlmICh0aGlzLl9yZXNpemVXaXRoQnJvd3NlclNpemUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXNpemVXaXRoQnJvd3NlclNpemUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fcmVzaXplRXZlbnQpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIHRoaXMuX29yaWVudGF0aW9uQ2hhbmdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogU2V0cyB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gZm9yIGNjLnZpZXcncyByZXNpemUgYWN0aW9uLDxici8+XG4gICAgICogdGhpcyBjYWxsYmFjayB3aWxsIGJlIGludm9rZWQgYmVmb3JlIGFwcGx5aW5nIHJlc29sdXRpb24gcG9saWN5LCA8YnIvPlxuICAgICAqIHNvIHlvdSBjYW4gZG8gYW55IGFkZGl0aW9uYWwgbW9kaWZpY2F0aW9ucyB3aXRoaW4gdGhlIGNhbGxiYWNrLjxici8+XG4gICAgICogVXNlZnVsIG9ubHkgb24gd2ViLlxuICAgICAqICEjemgg6K6+572uIGNjLnZpZXcg6LCD5pW06KeG56qX5bC65a+46KGM5Li655qE5Zue6LCD5Ye95pWw77yMXG4gICAgICog6L+Z5Liq5Zue6LCD5Ye95pWw5Lya5Zyo5bqU55So6YCC6YWN5qih5byP5LmL5YmN6KKr6LCD55So77yMXG4gICAgICog5Zug5q2k5L2g5Y+v5Lul5Zyo6L+Z5Liq5Zue6LCD5Ye95pWw5YaF5re75Yqg5Lu75oSP6ZmE5Yqg5pS55Y+Y77yMXG4gICAgICog5LuF5ZyoIFdlYiDlubPlj7DkuIvmnInmlYjjgIJcbiAgICAgKiBAbWV0aG9kIHNldFJlc2l6ZUNhbGxiYWNrXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxOdWxsfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqL1xuICAgIHNldFJlc2l6ZUNhbGxiYWNrOiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKENDX0VESVRPUikgcmV0dXJuO1xuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nIHx8IGNhbGxiYWNrID09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZUNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNldHMgdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBnYW1lLCBpdCBjYW4gYmUgbGFuZHNjYXBlLCBwb3J0cmFpdCBvciBhdXRvLlxuICAgICAqIFdoZW4gc2V0IGl0IHRvIGxhbmRzY2FwZSBvciBwb3J0cmFpdCwgYW5kIHNjcmVlbiB3L2ggcmF0aW8gZG9lc24ndCBmaXQsIFxuICAgICAqIGNjLnZpZXcgd2lsbCBhdXRvbWF0aWNhbGx5IHJvdGF0ZSB0aGUgZ2FtZSBjYW52YXMgdXNpbmcgQ1NTLlxuICAgICAqIE5vdGUgdGhhdCB0aGlzIGZ1bmN0aW9uIGRvZXNuJ3QgaGF2ZSBhbnkgZWZmZWN0IGluIG5hdGl2ZSwgXG4gICAgICogaW4gbmF0aXZlLCB5b3UgbmVlZCB0byBzZXQgdGhlIGFwcGxpY2F0aW9uIG9yaWVudGF0aW9uIGluIG5hdGl2ZSBwcm9qZWN0IHNldHRpbmdzXG4gICAgICogISN6aCDorr7nva7muLjmiI/lsY/luZXmnJ3lkJHvvIzlroPog73lpJ/mmK/mqKrniYjvvIznq5bniYjmiJboh6rliqjjgIJcbiAgICAgKiDlvZPorr7nva7kuLrmqKrniYjmiJbnq5bniYjvvIzlubbkuJTlsY/luZXnmoTlrr3pq5jmr5TkvovkuI3ljLnphY3ml7bvvIxcbiAgICAgKiBjYy52aWV3IOS8muiHquWKqOeUqCBDU1Mg5peL6L2s5ri45oiP5Zy65pmv55qEIGNhbnZhc++8jFxuICAgICAqIOi/meS4quaWueazleS4jeS8muWvuSBuYXRpdmUg6YOo5YiG5Lqn55Sf5Lu75L2V5b2x5ZON77yM5a+55LqOIG5hdGl2ZSDogIzoqIDvvIzkvaDpnIDopoHlnKjlupTnlKjorr7nva7kuK3nmoTorr7nva7mjpLniYjjgIJcbiAgICAgKiBAbWV0aG9kIHNldE9yaWVudGF0aW9uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9yaWVudGF0aW9uIC0gUG9zc2libGUgdmFsdWVzOiBjYy5tYWNyby5PUklFTlRBVElPTl9MQU5EU0NBUEUgfCBjYy5tYWNyby5PUklFTlRBVElPTl9QT1JUUkFJVCB8IGNjLm1hY3JvLk9SSUVOVEFUSU9OX0FVVE9cbiAgICAgKi9cbiAgICBzZXRPcmllbnRhdGlvbjogZnVuY3Rpb24gKG9yaWVudGF0aW9uKSB7XG4gICAgICAgIG9yaWVudGF0aW9uID0gb3JpZW50YXRpb24gJiBjYy5tYWNyby5PUklFTlRBVElPTl9BVVRPO1xuICAgICAgICBpZiAob3JpZW50YXRpb24gJiYgdGhpcy5fb3JpZW50YXRpb24gIT09IG9yaWVudGF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uO1xuICAgICAgICAgICAgdmFyIGRlc2lnbldpZHRoID0gdGhpcy5fb3JpZ2luYWxEZXNpZ25SZXNvbHV0aW9uU2l6ZS53aWR0aDtcbiAgICAgICAgICAgIHZhciBkZXNpZ25IZWlnaHQgPSB0aGlzLl9vcmlnaW5hbERlc2lnblJlc29sdXRpb25TaXplLmhlaWdodDtcbiAgICAgICAgICAgIHRoaXMuc2V0RGVzaWduUmVzb2x1dGlvblNpemUoZGVzaWduV2lkdGgsIGRlc2lnbkhlaWdodCwgdGhpcy5fcmVzb2x1dGlvblBvbGljeSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2luaXRGcmFtZVNpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGxvY0ZyYW1lU2l6ZSA9IHRoaXMuX2ZyYW1lU2l6ZTtcbiAgICAgICAgdmFyIHcgPSBfX0Jyb3dzZXJHZXR0ZXIuYXZhaWxXaWR0aChjYy5nYW1lLmZyYW1lKTtcbiAgICAgICAgdmFyIGggPSBfX0Jyb3dzZXJHZXR0ZXIuYXZhaWxIZWlnaHQoY2MuZ2FtZS5mcmFtZSk7XG4gICAgICAgIHZhciBpc0xhbmRzY2FwZSA9IHcgPj0gaDtcblxuICAgICAgICBpZiAoQ0NfRURJVE9SIHx8ICFjYy5zeXMuaXNNb2JpbGUgfHxcbiAgICAgICAgICAgIChpc0xhbmRzY2FwZSAmJiB0aGlzLl9vcmllbnRhdGlvbiAmIGNjLm1hY3JvLk9SSUVOVEFUSU9OX0xBTkRTQ0FQRSkgfHwgXG4gICAgICAgICAgICAoIWlzTGFuZHNjYXBlICYmIHRoaXMuX29yaWVudGF0aW9uICYgY2MubWFjcm8uT1JJRU5UQVRJT05fUE9SVFJBSVQpKSB7XG4gICAgICAgICAgICBsb2NGcmFtZVNpemUud2lkdGggPSB3O1xuICAgICAgICAgICAgbG9jRnJhbWVTaXplLmhlaWdodCA9IGg7XG4gICAgICAgICAgICBjYy5nYW1lLmNvbnRhaW5lci5zdHlsZVsnLXdlYmtpdC10cmFuc2Zvcm0nXSA9ICdyb3RhdGUoMGRlZyknO1xuICAgICAgICAgICAgY2MuZ2FtZS5jb250YWluZXIuc3R5bGUudHJhbnNmb3JtID0gJ3JvdGF0ZSgwZGVnKSc7XG4gICAgICAgICAgICB0aGlzLl9pc1JvdGF0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxvY0ZyYW1lU2l6ZS53aWR0aCA9IGg7XG4gICAgICAgICAgICBsb2NGcmFtZVNpemUuaGVpZ2h0ID0gdztcbiAgICAgICAgICAgIGNjLmdhbWUuY29udGFpbmVyLnN0eWxlWyctd2Via2l0LXRyYW5zZm9ybSddID0gJ3JvdGF0ZSg5MGRlZyknO1xuICAgICAgICAgICAgY2MuZ2FtZS5jb250YWluZXIuc3R5bGUudHJhbnNmb3JtID0gJ3JvdGF0ZSg5MGRlZyknO1xuICAgICAgICAgICAgY2MuZ2FtZS5jb250YWluZXIuc3R5bGVbJy13ZWJraXQtdHJhbnNmb3JtLW9yaWdpbiddID0gJzBweCAwcHggMHB4JztcbiAgICAgICAgICAgIGNjLmdhbWUuY29udGFpbmVyLnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9ICcwcHggMHB4IDBweCc7XG4gICAgICAgICAgICB0aGlzLl9pc1JvdGF0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9vcmllbnRhdGlvbkNoYW5naW5nKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjYy52aWV3Ll9vcmllbnRhdGlvbkNoYW5naW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfc2V0Vmlld3BvcnRNZXRhOiBmdW5jdGlvbiAobWV0YXMsIG92ZXJ3cml0ZSkge1xuICAgICAgICB2YXIgdnAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvY29zTWV0YUVsZW1lbnRcIik7XG4gICAgICAgIGlmKHZwICYmIG92ZXJ3cml0ZSl7XG4gICAgICAgICAgICBkb2N1bWVudC5oZWFkLnJlbW92ZUNoaWxkKHZwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBlbGVtcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKFwidmlld3BvcnRcIiksXG4gICAgICAgICAgICBjdXJyZW50VlAgPSBlbGVtcyA/IGVsZW1zWzBdIDogbnVsbCxcbiAgICAgICAgICAgIGNvbnRlbnQsIGtleSwgcGF0dGVybjtcblxuICAgICAgICBjb250ZW50ID0gY3VycmVudFZQID8gY3VycmVudFZQLmNvbnRlbnQgOiBcIlwiO1xuICAgICAgICB2cCA9IHZwIHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJtZXRhXCIpO1xuICAgICAgICB2cC5pZCA9IFwiY29jb3NNZXRhRWxlbWVudFwiO1xuICAgICAgICB2cC5uYW1lID0gXCJ2aWV3cG9ydFwiO1xuICAgICAgICB2cC5jb250ZW50ID0gXCJcIjtcblxuICAgICAgICBmb3IgKGtleSBpbiBtZXRhcykge1xuICAgICAgICAgICAgaWYgKGNvbnRlbnQuaW5kZXhPZihrZXkpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgY29udGVudCArPSBcIixcIiArIGtleSArIFwiPVwiICsgbWV0YXNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG92ZXJ3cml0ZSkge1xuICAgICAgICAgICAgICAgIHBhdHRlcm4gPSBuZXcgUmVnRXhwKGtleStcIlxccyo9XFxzKlteLF0rXCIpO1xuICAgICAgICAgICAgICAgIGNvbnRlbnQucmVwbGFjZShwYXR0ZXJuLCBrZXkgKyBcIj1cIiArIG1ldGFzW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmKC9eLC8udGVzdChjb250ZW50KSlcbiAgICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50LnN1YnN0cigxKTtcblxuICAgICAgICB2cC5jb250ZW50ID0gY29udGVudDtcbiAgICAgICAgLy8gRm9yIGFkb3B0aW5nIGNlcnRhaW4gYW5kcm9pZCBkZXZpY2VzIHdoaWNoIGRvbid0IHN1cHBvcnQgc2Vjb25kIHZpZXdwb3J0XG4gICAgICAgIGlmIChjdXJyZW50VlApXG4gICAgICAgICAgICBjdXJyZW50VlAuY29udGVudCA9IGNvbnRlbnQ7XG5cbiAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZCh2cCk7XG4gICAgfSxcblxuICAgIF9hZGp1c3RWaWV3cG9ydE1ldGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2lzQWRqdXN0Vmlld3BvcnQgJiYgIUNDX0pTQiAmJiAhQ0NfUlVOVElNRSkge1xuICAgICAgICAgICAgdGhpcy5fc2V0Vmlld3BvcnRNZXRhKF9fQnJvd3NlckdldHRlci5tZXRhLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLl9pc0FkanVzdFZpZXdwb3J0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNldHMgd2hldGhlciB0aGUgZW5naW5lIG1vZGlmeSB0aGUgXCJ2aWV3cG9ydFwiIG1ldGEgaW4geW91ciB3ZWIgcGFnZS48YnIvPlxuICAgICAqIEl0J3MgZW5hYmxlZCBieSBkZWZhdWx0LCB3ZSBzdHJvbmdseSBzdWdnZXN0IHlvdSBub3QgdG8gZGlzYWJsZSBpdC48YnIvPlxuICAgICAqIEFuZCBldmVuIHdoZW4gaXQncyBlbmFibGVkLCB5b3UgY2FuIHN0aWxsIHNldCB5b3VyIG93biBcInZpZXdwb3J0XCIgbWV0YSwgaXQgd29uJ3QgYmUgb3ZlcnJpZGRlbjxici8+XG4gICAgICogT25seSB1c2VmdWwgb24gd2ViXG4gICAgICogISN6aCDorr7nva7lvJXmk47mmK/lkKbosIPmlbQgdmlld3BvcnQgbWV0YSDmnaXphY3lkIjlsY/luZXpgILphY3jgIJcbiAgICAgKiDpu5jorqTorr7nva7kuLrlkK/liqjvvIzmiJHku6zlvLrng4jlu7rorq7kvaDkuI3opoHlsIblroPorr7nva7kuLrlhbPpl63jgIJcbiAgICAgKiDljbPkvb/lvZPlroPlkK/liqjml7bvvIzkvaDku43nhLbog73lpJ/orr7nva7kvaDnmoQgdmlld3BvcnQgbWV0Ye+8jOWug+S4jeS8muiiq+imhuebluOAglxuICAgICAqIOS7heWcqCBXZWIg5qih5byP5LiL5pyJ5pWIXG4gICAgICogQG1ldGhvZCBhZGp1c3RWaWV3cG9ydE1ldGFcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGVuYWJsZWQgLSBFbmFibGUgYXV0b21hdGljIG1vZGlmaWNhdGlvbiB0byBcInZpZXdwb3J0XCIgbWV0YVxuICAgICAqL1xuICAgIGFkanVzdFZpZXdwb3J0TWV0YTogZnVuY3Rpb24gKGVuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5faXNBZGp1c3RWaWV3cG9ydCA9IGVuYWJsZWQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXRpbmEgc3VwcG9ydCBpcyBlbmFibGVkIGJ5IGRlZmF1bHQgZm9yIEFwcGxlIGRldmljZSBidXQgZGlzYWJsZWQgZm9yIG90aGVyIGRldmljZXMsPGJyLz5cbiAgICAgKiBpdCB0YWtlcyBlZmZlY3Qgb25seSB3aGVuIHlvdSBjYWxsZWQgc2V0RGVzaWduUmVzb2x1dGlvblBvbGljeTxici8+XG4gICAgICogT25seSB1c2VmdWwgb24gd2ViXG4gICAgICogISN6aCDlr7nkuo4gQXBwbGUg6L+Z56eN5pSv5oyBIFJldGluYSDmmL7npLrnmoTorr7lpIfkuIrpu5jorqTov5vooYzkvJjljJbogIzlhbbku5bnsbvlnovorr7lpIfpu5jorqTkuI3ov5vooYzkvJjljJbvvIxcbiAgICAgKiDlroPku4XkvJrlnKjkvaDosIPnlKggc2V0RGVzaWduUmVzb2x1dGlvblBvbGljeSDmlrnms5Xml7bmnInlvbHlk43jgIJcbiAgICAgKiDku4XlnKggV2ViIOaooeW8j+S4i+acieaViOOAglxuICAgICAqIEBtZXRob2QgZW5hYmxlUmV0aW5hXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBlbmFibGVkIC0gRW5hYmxlIG9yIGRpc2FibGUgcmV0aW5hIGRpc3BsYXlcbiAgICAgKi9cbiAgICBlbmFibGVSZXRpbmE6IGZ1bmN0aW9uKGVuYWJsZWQpIHtcbiAgICAgICAgaWYgKENDX0VESVRPUiAmJiBlbmFibGVkKSB7XG4gICAgICAgICAgICBjYy53YXJuKCdDYW4gbm90IGVuYWJsZSByZXRpbmEgaW4gRWRpdG9yLicpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3JldGluYUVuYWJsZWQgPSAhIWVuYWJsZWQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBDaGVjayB3aGV0aGVyIHJldGluYSBkaXNwbGF5IGlzIGVuYWJsZWQuPGJyLz5cbiAgICAgKiBPbmx5IHVzZWZ1bCBvbiB3ZWJcbiAgICAgKiAhI3poIOajgOafpeaYr+WQpuWvuSBSZXRpbmEg5pi+56S66K6+5aSH6L+b6KGM5LyY5YyW44CCXG4gICAgICog5LuF5ZyoIFdlYiDmqKHlvI/kuIvmnInmlYjjgIJcbiAgICAgKiBAbWV0aG9kIGlzUmV0aW5hRW5hYmxlZFxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaXNSZXRpbmFFbmFibGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXRpbmFFbmFibGVkO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFdoZXRoZXIgdG8gRW5hYmxlIG9uIGFudGktYWxpYXNcbiAgICAgKiAhI3poIOaOp+WItuaKl+mUr+m9v+aYr+WQpuW8gOWQr1xuICAgICAqIEBtZXRob2QgZW5hYmxlQW50aUFsaWFzXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBlbmFibGVkIC0gRW5hYmxlIG9yIG5vdCBhbnRpLWFsaWFzXG4gICAgICogQGRlcHJlY2F0ZWQgY2Mudmlldy5lbmFibGVBbnRpQWxpYXMgaXMgZGVwcmVjYXRlZCBub3csIHBsZWFzZSB1c2UgY2MuVGV4dHVyZTJELnNldEZpbHRlcnMgaW5zdGVhZFxuICAgICAqIEBzaW5jZSB2Mi4zLjBcbiAgICAgKi9cbiAgICBlbmFibGVBbnRpQWxpYXM6IGZ1bmN0aW9uIChlbmFibGVkKSB7XG4gICAgICAgIGNjLndhcm5JRCg5MjAwKTtcbiAgICAgICAgaWYgKHRoaXMuX2FudGlBbGlhc0VuYWJsZWQgPT09IGVuYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9hbnRpQWxpYXNFbmFibGVkID0gZW5hYmxlZDtcbiAgICAgICAgaWYoY2MuZ2FtZS5yZW5kZXJUeXBlID09PSBjYy5nYW1lLlJFTkRFUl9UWVBFX1dFQkdMKSB7XG4gICAgICAgICAgICB2YXIgY2FjaGUgPSBjYy5sb2FkZXIuX2NhY2hlO1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGNhY2hlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBjYWNoZVtrZXldO1xuICAgICAgICAgICAgICAgIHZhciB0ZXggPSBpdGVtICYmIGl0ZW0uY29udGVudCBpbnN0YW5jZW9mIGNjLlRleHR1cmUyRCA/IGl0ZW0uY29udGVudCA6IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKHRleCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgRmlsdGVyID0gY2MuVGV4dHVyZTJELkZpbHRlcjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleC5zZXRGaWx0ZXJzKEZpbHRlci5MSU5FQVIsIEZpbHRlci5MSU5FQVIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4LnNldEZpbHRlcnMoRmlsdGVyLk5FQVJFU1QsIEZpbHRlci5ORUFSRVNUKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGNjLmdhbWUucmVuZGVyVHlwZSA9PT0gY2MuZ2FtZS5SRU5ERVJfVFlQRV9DQU5WQVMpIHtcbiAgICAgICAgICAgIHZhciBjdHggPSBjYy5nYW1lLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICAgICAgY3R4LmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGVuYWJsZWQ7XG4gICAgICAgICAgICBjdHgubW96SW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZW5hYmxlZDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgd2hldGhlciB0aGUgY3VycmVudCBlbmFibGUgb24gYW50aS1hbGlhc1xuICAgICAqICEjemgg6L+U5Zue5b2T5YmN5piv5ZCm5oqX6ZSv6b2/XG4gICAgICogQG1ldGhvZCBpc0FudGlBbGlhc0VuYWJsZWRcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGlzQW50aUFsaWFzRW5hYmxlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYW50aUFsaWFzRW5hYmxlZDtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBJZiBlbmFibGVkLCB0aGUgYXBwbGljYXRpb24gd2lsbCB0cnkgYXV0b21hdGljYWxseSB0byBlbnRlciBmdWxsIHNjcmVlbiBtb2RlIG9uIG1vYmlsZSBkZXZpY2VzPGJyLz5cbiAgICAgKiBZb3UgY2FuIHBhc3MgdHJ1ZSBhcyBwYXJhbWV0ZXIgdG8gZW5hYmxlIGl0IGFuZCBkaXNhYmxlIGl0IGJ5IHBhc3NpbmcgZmFsc2UuPGJyLz5cbiAgICAgKiBPbmx5IHVzZWZ1bCBvbiB3ZWJcbiAgICAgKiAhI3poIOWQr+WKqOaXtu+8jOenu+WKqOerr+a4uOaIj+S8muWcqOenu+WKqOerr+iHquWKqOWwneivlei/m+WFpeWFqOWxj+aooeW8j+OAglxuICAgICAqIOS9oOiDveWkn+S8oOWFpSB0cnVlIOS4uuWPguaVsOWOu+WQr+WKqOWug++8jOeUqCBmYWxzZSDlj4LmlbDmnaXlhbPpl63lroPjgIJcbiAgICAgKiBAbWV0aG9kIGVuYWJsZUF1dG9GdWxsU2NyZWVuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBlbmFibGVkIC0gRW5hYmxlIG9yIGRpc2FibGUgYXV0byBmdWxsIHNjcmVlbiBvbiBtb2JpbGUgZGV2aWNlc1xuICAgICAqL1xuICAgIGVuYWJsZUF1dG9GdWxsU2NyZWVuOiBmdW5jdGlvbihlbmFibGVkKSB7XG4gICAgICAgIGlmIChlbmFibGVkICYmIFxuICAgICAgICAgICAgZW5hYmxlZCAhPT0gdGhpcy5fYXV0b0Z1bGxTY3JlZW4gJiYgXG4gICAgICAgICAgICBjYy5zeXMuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgIC8vIEF1dG9tYXRpY2FsbHkgZnVsbCBzY3JlZW4gd2hlbiB1c2VyIHRvdWNoZXMgb24gbW9iaWxlIHZlcnNpb25cbiAgICAgICAgICAgIHRoaXMuX2F1dG9GdWxsU2NyZWVuID0gdHJ1ZTtcbiAgICAgICAgICAgIGNjLnNjcmVlbi5hdXRvRnVsbFNjcmVlbihjYy5nYW1lLmZyYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2F1dG9GdWxsU2NyZWVuID0gZmFsc2U7XG4gICAgICAgICAgICBjYy5zY3JlZW4uZGlzYWJsZUF1dG9GdWxsU2NyZWVuKGNjLmdhbWUuZnJhbWUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBDaGVjayB3aGV0aGVyIGF1dG8gZnVsbCBzY3JlZW4gaXMgZW5hYmxlZC48YnIvPlxuICAgICAqIE9ubHkgdXNlZnVsIG9uIHdlYlxuICAgICAqICEjemgg5qOA5p+l6Ieq5Yqo6L+b5YWl5YWo5bGP5qih5byP5piv5ZCm5ZCv5Yqo44CCXG4gICAgICog5LuF5ZyoIFdlYiDmqKHlvI/kuIvmnInmlYjjgIJcbiAgICAgKiBAbWV0aG9kIGlzQXV0b0Z1bGxTY3JlZW5FbmFibGVkXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gQXV0byBmdWxsIHNjcmVlbiBlbmFibGVkIG9yIG5vdFxuICAgICAqL1xuICAgIGlzQXV0b0Z1bGxTY3JlZW5FbmFibGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2F1dG9GdWxsU2NyZWVuO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIE5vdCBzdXBwb3J0IG9uIG5hdGl2ZS48YnIvPlxuICAgICAqIE9uIHdlYiwgaXQgc2V0cyB0aGUgc2l6ZSBvZiB0aGUgY2FudmFzLlxuICAgICAqICEjemgg6L+Z5Liq5pa55rOV5bm25LiN5pSv5oyBIG5hdGl2ZSDlubPlj7DvvIzlnKggV2ViIOW5s+WPsOS4i++8jOWPr+S7peeUqOadpeiuvue9riBjYW52YXMg5bC65a+444CCXG4gICAgICogQG1ldGhvZCBzZXRDYW52YXNTaXplXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHdpZHRoXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGhlaWdodFxuICAgICAqL1xuICAgIHNldENhbnZhc1NpemU6IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHZhciBjYW52YXMgPSBjYy5nYW1lLmNhbnZhcztcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9IGNjLmdhbWUuY29udGFpbmVyO1xuXG4gICAgICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoICogdGhpcy5fZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IGhlaWdodCAqIHRoaXMuX2RldmljZVBpeGVsUmF0aW87XG5cbiAgICAgICAgY2FudmFzLnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuICAgICAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcblxuICAgICAgICBjb250YWluZXIuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG4gICAgICAgIGNvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuXG4gICAgICAgIHRoaXMuX3Jlc2l6ZUV2ZW50KCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXR1cm5zIHRoZSBjYW52YXMgc2l6ZSBvZiB0aGUgdmlldy48YnIvPlxuICAgICAqIE9uIG5hdGl2ZSBwbGF0Zm9ybXMsIGl0IHJldHVybnMgdGhlIHNjcmVlbiBzaXplIHNpbmNlIHRoZSB2aWV3IGlzIGEgZnVsbHNjcmVlbiB2aWV3Ljxici8+XG4gICAgICogT24gd2ViLCBpdCByZXR1cm5zIHRoZSBzaXplIG9mIHRoZSBjYW52YXMgZWxlbWVudC5cbiAgICAgKiAhI3poIOi/lOWbnuinhuWbvuS4rSBjYW52YXMg55qE5bC65a+444CCXG4gICAgICog5ZyoIG5hdGl2ZSDlubPlj7DkuIvvvIzlroPov5Tlm57lhajlsY/op4blm77kuIvlsY/luZXnmoTlsLrlr7jjgIJcbiAgICAgKiDlnKggV2ViIOW5s+WPsOS4i++8jOWug+i/lOWbniBjYW52YXMg5YWD57Sg5bC65a+444CCXG4gICAgICogQG1ldGhvZCBnZXRDYW52YXNTaXplXG4gICAgICogQHJldHVybiB7U2l6ZX1cbiAgICAgKi9cbiAgICBnZXRDYW52YXNTaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjYy5zaXplKGNjLmdhbWUuY2FudmFzLndpZHRoLCBjYy5nYW1lLmNhbnZhcy5oZWlnaHQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmV0dXJucyB0aGUgZnJhbWUgc2l6ZSBvZiB0aGUgdmlldy48YnIvPlxuICAgICAqIE9uIG5hdGl2ZSBwbGF0Zm9ybXMsIGl0IHJldHVybnMgdGhlIHNjcmVlbiBzaXplIHNpbmNlIHRoZSB2aWV3IGlzIGEgZnVsbHNjcmVlbiB2aWV3Ljxici8+XG4gICAgICogT24gd2ViLCBpdCByZXR1cm5zIHRoZSBzaXplIG9mIHRoZSBjYW52YXMncyBvdXRlciBET00gZWxlbWVudC5cbiAgICAgKiAhI3poIOi/lOWbnuinhuWbvuS4rei+ueahhuWwuuWvuOOAglxuICAgICAqIOWcqCBuYXRpdmUg5bmz5Y+w5LiL77yM5a6D6L+U5Zue5YWo5bGP6KeG5Zu+5LiL5bGP5bmV55qE5bC65a+444CCXG4gICAgICog5ZyoIHdlYiDlubPlj7DkuIvvvIzlroPov5Tlm54gY2FudmFzIOWFg+e0oOeahOWkluWxgiBET00g5YWD57Sg5bC65a+444CCXG4gICAgICogQG1ldGhvZCBnZXRGcmFtZVNpemVcbiAgICAgKiBAcmV0dXJuIHtTaXplfVxuICAgICAqL1xuICAgIGdldEZyYW1lU2l6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gY2Muc2l6ZSh0aGlzLl9mcmFtZVNpemUud2lkdGgsIHRoaXMuX2ZyYW1lU2l6ZS5oZWlnaHQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogT24gbmF0aXZlLCBpdCBzZXRzIHRoZSBmcmFtZSBzaXplIG9mIHZpZXcuPGJyLz5cbiAgICAgKiBPbiB3ZWIsIGl0IHNldHMgdGhlIHNpemUgb2YgdGhlIGNhbnZhcydzIG91dGVyIERPTSBlbGVtZW50LlxuICAgICAqICEjemgg5ZyoIG5hdGl2ZSDlubPlj7DkuIvvvIzorr7nva7op4blm77moYbmnrblsLrlr7jjgIJcbiAgICAgKiDlnKggd2ViIOW5s+WPsOS4i++8jOiuvue9riBjYW52YXMg5aSW5bGCIERPTSDlhYPntKDlsLrlr7jjgIJcbiAgICAgKiBAbWV0aG9kIHNldEZyYW1lU2l6ZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHRcbiAgICAgKi9cbiAgICBzZXRGcmFtZVNpemU6IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuX2ZyYW1lU2l6ZS53aWR0aCA9IHdpZHRoO1xuICAgICAgICB0aGlzLl9mcmFtZVNpemUuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICBjYy5nYW1lLmZyYW1lLnN0eWxlLndpZHRoID0gd2lkdGggKyBcInB4XCI7XG4gICAgICAgIGNjLmdhbWUuZnJhbWUuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICB0aGlzLl9yZXNpemVFdmVudCh0cnVlKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJldHVybnMgdGhlIHZpc2libGUgYXJlYSBzaXplIG9mIHRoZSB2aWV3IHBvcnQuXG4gICAgICogISN6aCDov5Tlm57op4blm77nqpflj6Plj6/op4HljLrln5/lsLrlr7jjgIJcbiAgICAgKiBAbWV0aG9kIGdldFZpc2libGVTaXplXG4gICAgICogQHJldHVybiB7U2l6ZX1cbiAgICAgKi9cbiAgICBnZXRWaXNpYmxlU2l6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gY2Muc2l6ZSh0aGlzLl92aXNpYmxlUmVjdC53aWR0aCx0aGlzLl92aXNpYmxlUmVjdC5oZWlnaHQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmV0dXJucyB0aGUgdmlzaWJsZSBhcmVhIHNpemUgb2YgdGhlIHZpZXcgcG9ydC5cbiAgICAgKiAhI3poIOi/lOWbnuinhuWbvueql+WPo+WPr+ingeWMuuWfn+WDj+e0oOWwuuWvuOOAglxuICAgICAqIEBtZXRob2QgZ2V0VmlzaWJsZVNpemVJblBpeGVsXG4gICAgICogQHJldHVybiB7U2l6ZX1cbiAgICAgKi9cbiAgICBnZXRWaXNpYmxlU2l6ZUluUGl4ZWw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGNjLnNpemUoIHRoaXMuX3Zpc2libGVSZWN0LndpZHRoICogdGhpcy5fc2NhbGVYLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmlzaWJsZVJlY3QuaGVpZ2h0ICogdGhpcy5fc2NhbGVZICk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXR1cm5zIHRoZSB2aXNpYmxlIG9yaWdpbiBvZiB0aGUgdmlldyBwb3J0LlxuICAgICAqICEjemgg6L+U5Zue6KeG5Zu+56qX5Y+j5Y+v6KeB5Yy65Z+f5Y6f54K544CCXG4gICAgICogQG1ldGhvZCBnZXRWaXNpYmxlT3JpZ2luXG4gICAgICogQHJldHVybiB7VmVjMn1cbiAgICAgKi9cbiAgICBnZXRWaXNpYmxlT3JpZ2luOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjYy52Mih0aGlzLl92aXNpYmxlUmVjdC54LHRoaXMuX3Zpc2libGVSZWN0LnkpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmV0dXJucyB0aGUgdmlzaWJsZSBvcmlnaW4gb2YgdGhlIHZpZXcgcG9ydC5cbiAgICAgKiAhI3poIOi/lOWbnuinhuWbvueql+WPo+WPr+ingeWMuuWfn+WDj+e0oOWOn+eCueOAglxuICAgICAqIEBtZXRob2QgZ2V0VmlzaWJsZU9yaWdpbkluUGl4ZWxcbiAgICAgKiBAcmV0dXJuIHtWZWMyfVxuICAgICAqL1xuICAgIGdldFZpc2libGVPcmlnaW5JblBpeGVsOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjYy52Mih0aGlzLl92aXNpYmxlUmVjdC54ICogdGhpcy5fc2NhbGVYLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl92aXNpYmxlUmVjdC55ICogdGhpcy5fc2NhbGVZKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJldHVybnMgdGhlIGN1cnJlbnQgcmVzb2x1dGlvbiBwb2xpY3lcbiAgICAgKiAhI3poIOi/lOWbnuW9k+WJjeWIhui+qOeOh+aWueahiFxuICAgICAqIEBzZWUgY2MuUmVzb2x1dGlvblBvbGljeVxuICAgICAqIEBtZXRob2QgZ2V0UmVzb2x1dGlvblBvbGljeVxuICAgICAqIEByZXR1cm4ge1Jlc29sdXRpb25Qb2xpY3l9XG4gICAgICovXG4gICAgZ2V0UmVzb2x1dGlvblBvbGljeTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVzb2x1dGlvblBvbGljeTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNldHMgdGhlIGN1cnJlbnQgcmVzb2x1dGlvbiBwb2xpY3lcbiAgICAgKiAhI3poIOiuvue9ruW9k+WJjeWIhui+qOeOh+aooeW8j1xuICAgICAqIEBzZWUgY2MuUmVzb2x1dGlvblBvbGljeVxuICAgICAqIEBtZXRob2Qgc2V0UmVzb2x1dGlvblBvbGljeVxuICAgICAqIEBwYXJhbSB7UmVzb2x1dGlvblBvbGljeXxOdW1iZXJ9IHJlc29sdXRpb25Qb2xpY3lcbiAgICAgKi9cbiAgICBzZXRSZXNvbHV0aW9uUG9saWN5OiBmdW5jdGlvbiAocmVzb2x1dGlvblBvbGljeSkge1xuICAgICAgICB2YXIgX3QgPSB0aGlzO1xuICAgICAgICBpZiAocmVzb2x1dGlvblBvbGljeSBpbnN0YW5jZW9mIGNjLlJlc29sdXRpb25Qb2xpY3kpIHtcbiAgICAgICAgICAgIF90Ll9yZXNvbHV0aW9uUG9saWN5ID0gcmVzb2x1dGlvblBvbGljeTtcbiAgICAgICAgfVxuICAgICAgICAvLyBFbnN1cmUgY29tcGF0aWJpbGl0eSB3aXRoIEpTQlxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBfbG9jUG9saWN5ID0gY2MuUmVzb2x1dGlvblBvbGljeTtcbiAgICAgICAgICAgIGlmKHJlc29sdXRpb25Qb2xpY3kgPT09IF9sb2NQb2xpY3kuRVhBQ1RfRklUKVxuICAgICAgICAgICAgICAgIF90Ll9yZXNvbHV0aW9uUG9saWN5ID0gX3QuX3JwRXhhY3RGaXQ7XG4gICAgICAgICAgICBpZihyZXNvbHV0aW9uUG9saWN5ID09PSBfbG9jUG9saWN5LlNIT1dfQUxMKVxuICAgICAgICAgICAgICAgIF90Ll9yZXNvbHV0aW9uUG9saWN5ID0gX3QuX3JwU2hvd0FsbDtcbiAgICAgICAgICAgIGlmKHJlc29sdXRpb25Qb2xpY3kgPT09IF9sb2NQb2xpY3kuTk9fQk9SREVSKVxuICAgICAgICAgICAgICAgIF90Ll9yZXNvbHV0aW9uUG9saWN5ID0gX3QuX3JwTm9Cb3JkZXI7XG4gICAgICAgICAgICBpZihyZXNvbHV0aW9uUG9saWN5ID09PSBfbG9jUG9saWN5LkZJWEVEX0hFSUdIVClcbiAgICAgICAgICAgICAgICBfdC5fcmVzb2x1dGlvblBvbGljeSA9IF90Ll9ycEZpeGVkSGVpZ2h0O1xuICAgICAgICAgICAgaWYocmVzb2x1dGlvblBvbGljeSA9PT0gX2xvY1BvbGljeS5GSVhFRF9XSURUSClcbiAgICAgICAgICAgICAgICBfdC5fcmVzb2x1dGlvblBvbGljeSA9IF90Ll9ycEZpeGVkV2lkdGg7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNldHMgdGhlIHJlc29sdXRpb24gcG9saWN5IHdpdGggZGVzaWduZWQgdmlldyBzaXplIGluIHBvaW50cy48YnIvPlxuICAgICAqIFRoZSByZXNvbHV0aW9uIHBvbGljeSBpbmNsdWRlOiA8YnIvPlxuICAgICAqIFsxXSBSZXNvbHV0aW9uRXhhY3RGaXQgICAgICAgRmlsbCBzY3JlZW4gYnkgc3RyZXRjaC10by1maXQ6IGlmIHRoZSBkZXNpZ24gcmVzb2x1dGlvbiByYXRpbyBvZiB3aWR0aCB0byBoZWlnaHQgaXMgZGlmZmVyZW50IGZyb20gdGhlIHNjcmVlbiByZXNvbHV0aW9uIHJhdGlvLCB5b3VyIGdhbWUgdmlldyB3aWxsIGJlIHN0cmV0Y2hlZC48YnIvPlxuICAgICAqIFsyXSBSZXNvbHV0aW9uTm9Cb3JkZXIgICAgICAgRnVsbCBzY3JlZW4gd2l0aG91dCBibGFjayBib3JkZXI6IGlmIHRoZSBkZXNpZ24gcmVzb2x1dGlvbiByYXRpbyBvZiB3aWR0aCB0byBoZWlnaHQgaXMgZGlmZmVyZW50IGZyb20gdGhlIHNjcmVlbiByZXNvbHV0aW9uIHJhdGlvLCB0d28gYXJlYXMgb2YgeW91ciBnYW1lIHZpZXcgd2lsbCBiZSBjdXQuPGJyLz5cbiAgICAgKiBbM10gUmVzb2x1dGlvblNob3dBbGwgICAgICAgIEZ1bGwgc2NyZWVuIHdpdGggYmxhY2sgYm9yZGVyOiBpZiB0aGUgZGVzaWduIHJlc29sdXRpb24gcmF0aW8gb2Ygd2lkdGggdG8gaGVpZ2h0IGlzIGRpZmZlcmVudCBmcm9tIHRoZSBzY3JlZW4gcmVzb2x1dGlvbiByYXRpbywgdHdvIGJsYWNrIGJvcmRlcnMgd2lsbCBiZSBzaG93bi48YnIvPlxuICAgICAqIFs0XSBSZXNvbHV0aW9uRml4ZWRIZWlnaHQgICAgU2NhbGUgdGhlIGNvbnRlbnQncyBoZWlnaHQgdG8gc2NyZWVuJ3MgaGVpZ2h0IGFuZCBwcm9wb3J0aW9uYWxseSBzY2FsZSBpdHMgd2lkdGg8YnIvPlxuICAgICAqIFs1XSBSZXNvbHV0aW9uRml4ZWRXaWR0aCAgICAgU2NhbGUgdGhlIGNvbnRlbnQncyB3aWR0aCB0byBzY3JlZW4ncyB3aWR0aCBhbmQgcHJvcG9ydGlvbmFsbHkgc2NhbGUgaXRzIGhlaWdodDxici8+XG4gICAgICogW2NjLlJlc29sdXRpb25Qb2xpY3ldICAgICAgICBbV2ViIG9ubHkgZmVhdHVyZV0gQ3VzdG9tIHJlc29sdXRpb24gcG9saWN5LCBjb25zdHJ1Y3RlZCBieSBjYy5SZXNvbHV0aW9uUG9saWN5PGJyLz5cbiAgICAgKiAhI3poIOmAmui/h+iuvue9ruiuvuiuoeWIhui+qOeOh+WSjOWMuemFjeaooeW8j+adpei/m+ihjOa4uOaIj+eUu+mdoueahOWxj+W5lemAgumFjeOAglxuICAgICAqIEBtZXRob2Qgc2V0RGVzaWduUmVzb2x1dGlvblNpemVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gd2lkdGggRGVzaWduIHJlc29sdXRpb24gd2lkdGguXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGhlaWdodCBEZXNpZ24gcmVzb2x1dGlvbiBoZWlnaHQuXG4gICAgICogQHBhcmFtIHtSZXNvbHV0aW9uUG9saWN5fE51bWJlcn0gcmVzb2x1dGlvblBvbGljeSBUaGUgcmVzb2x1dGlvbiBwb2xpY3kgZGVzaXJlZFxuICAgICAqL1xuICAgIHNldERlc2lnblJlc29sdXRpb25TaXplOiBmdW5jdGlvbiAod2lkdGgsIGhlaWdodCwgcmVzb2x1dGlvblBvbGljeSkge1xuICAgICAgICAvLyBEZWZlbnNpdmUgY29kZVxuICAgICAgICBpZiggISh3aWR0aCA+IDAgfHwgaGVpZ2h0ID4gMCkgKXtcbiAgICAgICAgICAgIGNjLmxvZ0lEKDIyMDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRSZXNvbHV0aW9uUG9saWN5KHJlc29sdXRpb25Qb2xpY3kpO1xuICAgICAgICB2YXIgcG9saWN5ID0gdGhpcy5fcmVzb2x1dGlvblBvbGljeTtcbiAgICAgICAgaWYgKHBvbGljeSkge1xuICAgICAgICAgICAgcG9saWN5LnByZUFwcGx5KHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVpbml0IGZyYW1lIHNpemVcbiAgICAgICAgaWYgKGNjLnN5cy5pc01vYmlsZSlcbiAgICAgICAgICAgIHRoaXMuX2FkanVzdFZpZXdwb3J0TWV0YSgpO1xuXG4gICAgICAgIC8vIFBlcm1pdCB0byByZS1kZXRlY3QgdGhlIG9yaWVudGF0aW9uIG9mIGRldmljZS5cbiAgICAgICAgdGhpcy5fb3JpZW50YXRpb25DaGFuZ2luZyA9IHRydWU7XG4gICAgICAgIC8vIElmIHJlc2l6aW5nLCB0aGVuIGZyYW1lIHNpemUgaXMgYWxyZWFkeSBpbml0aWFsaXplZCwgdGhpcyBsb2dpYyBzaG91bGQgYmUgaW1wcm92ZWRcbiAgICAgICAgaWYgKCF0aGlzLl9yZXNpemluZylcbiAgICAgICAgICAgIHRoaXMuX2luaXRGcmFtZVNpemUoKTtcblxuICAgICAgICBpZiAoIXBvbGljeSkge1xuICAgICAgICAgICAgY2MubG9nSUQoMjIwMSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9vcmlnaW5hbERlc2lnblJlc29sdXRpb25TaXplLndpZHRoID0gdGhpcy5fZGVzaWduUmVzb2x1dGlvblNpemUud2lkdGggPSB3aWR0aDtcbiAgICAgICAgdGhpcy5fb3JpZ2luYWxEZXNpZ25SZXNvbHV0aW9uU2l6ZS5oZWlnaHQgPSB0aGlzLl9kZXNpZ25SZXNvbHV0aW9uU2l6ZS5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICAgICAgdmFyIHJlc3VsdCA9IHBvbGljeS5hcHBseSh0aGlzLCB0aGlzLl9kZXNpZ25SZXNvbHV0aW9uU2l6ZSk7XG5cbiAgICAgICAgaWYocmVzdWx0LnNjYWxlICYmIHJlc3VsdC5zY2FsZS5sZW5ndGggPT09IDIpe1xuICAgICAgICAgICAgdGhpcy5fc2NhbGVYID0gcmVzdWx0LnNjYWxlWzBdO1xuICAgICAgICAgICAgdGhpcy5fc2NhbGVZID0gcmVzdWx0LnNjYWxlWzFdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYocmVzdWx0LnZpZXdwb3J0KXtcbiAgICAgICAgICAgIHZhciB2cCA9IHRoaXMuX3ZpZXdwb3J0UmVjdCxcbiAgICAgICAgICAgICAgICB2YiA9IHRoaXMuX3Zpc2libGVSZWN0LFxuICAgICAgICAgICAgICAgIHJ2ID0gcmVzdWx0LnZpZXdwb3J0O1xuXG4gICAgICAgICAgICB2cC54ID0gcnYueDtcbiAgICAgICAgICAgIHZwLnkgPSBydi55O1xuICAgICAgICAgICAgdnAud2lkdGggPSBydi53aWR0aDtcbiAgICAgICAgICAgIHZwLmhlaWdodCA9IHJ2LmhlaWdodDtcblxuICAgICAgICAgICAgdmIueCA9IDA7XG4gICAgICAgICAgICB2Yi55ID0gMDtcbiAgICAgICAgICAgIHZiLndpZHRoID0gcnYud2lkdGggLyB0aGlzLl9zY2FsZVg7XG4gICAgICAgICAgICB2Yi5oZWlnaHQgPSBydi5oZWlnaHQgLyB0aGlzLl9zY2FsZVk7XG4gICAgICAgIH1cblxuICAgICAgICBwb2xpY3kucG9zdEFwcGx5KHRoaXMpO1xuICAgICAgICBjYy53aW5TaXplLndpZHRoID0gdGhpcy5fdmlzaWJsZVJlY3Qud2lkdGg7XG4gICAgICAgIGNjLndpblNpemUuaGVpZ2h0ID0gdGhpcy5fdmlzaWJsZVJlY3QuaGVpZ2h0O1xuXG4gICAgICAgIGNjLnZpc2libGVSZWN0ICYmIGNjLnZpc2libGVSZWN0LmluaXQodGhpcy5fdmlzaWJsZVJlY3QpO1xuXG4gICAgICAgIHJlbmRlcmVyLnVwZGF0ZUNhbWVyYVZpZXdwb3J0KCk7XG4gICAgICAgIF9jYy5pbnB1dE1hbmFnZXIuX3VwZGF0ZUNhbnZhc0JvdW5kaW5nUmVjdCgpO1xuICAgICAgICB0aGlzLmVtaXQoJ2Rlc2lnbi1yZXNvbHV0aW9uLWNoYW5nZWQnKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJldHVybnMgdGhlIGRlc2lnbmVkIHNpemUgZm9yIHRoZSB2aWV3LlxuICAgICAqIERlZmF1bHQgcmVzb2x1dGlvbiBzaXplIGlzIHRoZSBzYW1lIGFzICdnZXRGcmFtZVNpemUnLlxuICAgICAqICEjemgg6L+U5Zue6KeG5Zu+55qE6K6+6K6h5YiG6L6o546H44CCXG4gICAgICog6buY6K6k5LiL5YiG6L6o546H5bC65a+45ZCMIGBnZXRGcmFtZVNpemVgIOaWueazleebuOWQjFxuICAgICAqIEBtZXRob2QgZ2V0RGVzaWduUmVzb2x1dGlvblNpemVcbiAgICAgKiBAcmV0dXJuIHtTaXplfVxuICAgICAqL1xuICAgIGdldERlc2lnblJlc29sdXRpb25TaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjYy5zaXplKHRoaXMuX2Rlc2lnblJlc29sdXRpb25TaXplLndpZHRoLCB0aGlzLl9kZXNpZ25SZXNvbHV0aW9uU2l6ZS5oZWlnaHQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogU2V0cyB0aGUgY29udGFpbmVyIHRvIGRlc2lyZWQgcGl4ZWwgcmVzb2x1dGlvbiBhbmQgZml0IHRoZSBnYW1lIGNvbnRlbnQgdG8gaXQuXG4gICAgICogVGhpcyBmdW5jdGlvbiBpcyB2ZXJ5IHVzZWZ1bCBmb3IgYWRhcHRhdGlvbiBpbiBtb2JpbGUgYnJvd3NlcnMuXG4gICAgICogSW4gc29tZSBIRCBhbmRyb2lkIGRldmljZXMsIHRoZSByZXNvbHV0aW9uIGlzIHZlcnkgaGlnaCwgYnV0IGl0cyBicm93c2VyIHBlcmZvcm1hbmNlIG1heSBub3QgYmUgdmVyeSBnb29kLlxuICAgICAqIEluIHRoaXMgY2FzZSwgZW5hYmxpbmcgcmV0aW5hIGRpc3BsYXkgaXMgdmVyeSBjb3N0eSBhbmQgbm90IHN1Z2dlc3RlZCwgYW5kIGlmIHJldGluYSBpcyBkaXNhYmxlZCwgdGhlIGltYWdlIG1heSBiZSBibHVycnkuXG4gICAgICogQnV0IHRoaXMgQVBJIGNhbiBiZSBoZWxwZnVsIHRvIHNldCBhIGRlc2lyZWQgcGl4ZWwgcmVzb2x1dGlvbiB3aGljaCBpcyBpbiBiZXR3ZWVuLlxuICAgICAqIFRoaXMgQVBJIHdpbGwgZG8gdGhlIGZvbGxvd2luZzpcbiAgICAgKiAgICAgMS4gU2V0IHZpZXdwb3J0J3Mgd2lkdGggdG8gdGhlIGRlc2lyZWQgd2lkdGggaW4gcGl4ZWxcbiAgICAgKiAgICAgMi4gU2V0IGJvZHkgd2lkdGggdG8gdGhlIGV4YWN0IHBpeGVsIHJlc29sdXRpb25cbiAgICAgKiAgICAgMy4gVGhlIHJlc29sdXRpb24gcG9saWN5IHdpbGwgYmUgcmVzZXQgd2l0aCBkZXNpZ25lZCB2aWV3IHNpemUgaW4gcG9pbnRzLlxuICAgICAqICEjemgg6K6+572u5a655Zmo77yIY29udGFpbmVy77yJ6ZyA6KaB55qE5YOP57Sg5YiG6L6o546H5bm25LiU6YCC6YWN55u45bqU5YiG6L6o546H55qE5ri45oiP5YaF5a6544CCXG4gICAgICogQG1ldGhvZCBzZXRSZWFsUGl4ZWxSZXNvbHV0aW9uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHdpZHRoIERlc2lnbiByZXNvbHV0aW9uIHdpZHRoLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHQgRGVzaWduIHJlc29sdXRpb24gaGVpZ2h0LlxuICAgICAqIEBwYXJhbSB7UmVzb2x1dGlvblBvbGljeXxOdW1iZXJ9IHJlc29sdXRpb25Qb2xpY3kgVGhlIHJlc29sdXRpb24gcG9saWN5IGRlc2lyZWRcbiAgICAgKi9cbiAgICBzZXRSZWFsUGl4ZWxSZXNvbHV0aW9uOiBmdW5jdGlvbiAod2lkdGgsIGhlaWdodCwgcmVzb2x1dGlvblBvbGljeSkge1xuICAgICAgICBpZiAoIUNDX0pTQiAmJiAhQ0NfUlVOVElNRSkge1xuICAgICAgICAgICAgLy8gU2V0IHZpZXdwb3J0J3Mgd2lkdGhcbiAgICAgICAgICAgIHRoaXMuX3NldFZpZXdwb3J0TWV0YSh7XCJ3aWR0aFwiOiB3aWR0aH0sIHRydWUpO1xuXG4gICAgICAgICAgICAvLyBTZXQgYm9keSB3aWR0aCB0byB0aGUgZXhhY3QgcGl4ZWwgcmVzb2x1dGlvblxuICAgICAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLndpZHRoID0gd2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLndpZHRoID0gd2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmxlZnQgPSBcIjBweFwiO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS50b3AgPSBcIjBweFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVzZXQgdGhlIHJlc29sdXRpb24gc2l6ZSBhbmQgcG9saWN5XG4gICAgICAgIHRoaXMuc2V0RGVzaWduUmVzb2x1dGlvblNpemUod2lkdGgsIGhlaWdodCwgcmVzb2x1dGlvblBvbGljeSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBTZXRzIHZpZXcgcG9ydCByZWN0YW5nbGUgd2l0aCBwb2ludHMuXG4gICAgICogISN6aCDnlKjorr7orqHliIbovqjnjofkuIvnmoTngrnlsLrlr7jmnaXorr7nva7op4bnqpfjgIJcbiAgICAgKiBAbWV0aG9kIHNldFZpZXdwb3J0SW5Qb2ludHNcbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB3IHdpZHRoXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGggaGVpZ2h0XG4gICAgICovXG4gICAgc2V0Vmlld3BvcnRJblBvaW50czogZnVuY3Rpb24gKHgsIHksIHcsIGgpIHtcbiAgICAgICAgdmFyIGxvY1NjYWxlWCA9IHRoaXMuX3NjYWxlWCwgbG9jU2NhbGVZID0gdGhpcy5fc2NhbGVZO1xuICAgICAgICBjYy5nYW1lLl9yZW5kZXJDb250ZXh0LnZpZXdwb3J0KCh4ICogbG9jU2NhbGVYICsgdGhpcy5fdmlld3BvcnRSZWN0LngpLFxuICAgICAgICAgICAgKHkgKiBsb2NTY2FsZVkgKyB0aGlzLl92aWV3cG9ydFJlY3QueSksXG4gICAgICAgICAgICAodyAqIGxvY1NjYWxlWCksXG4gICAgICAgICAgICAoaCAqIGxvY1NjYWxlWSkpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogU2V0cyBTY2lzc29yIHJlY3RhbmdsZSB3aXRoIHBvaW50cy5cbiAgICAgKiAhI3poIOeUqOiuvuiuoeWIhui+qOeOh+S4i+eahOeCueeahOWwuuWvuOadpeiuvue9riBzY2lzc29yIOWJquijgeWMuuWfn+OAglxuICAgICAqIEBtZXRob2Qgc2V0U2Npc3NvckluUG9pbnRzXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB4XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHlcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gd1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBoXG4gICAgICovXG4gICAgc2V0U2Npc3NvckluUG9pbnRzOiBmdW5jdGlvbiAoeCwgeSwgdywgaCkge1xuICAgICAgICBsZXQgc2NhbGVYID0gdGhpcy5fc2NhbGVYLCBzY2FsZVkgPSB0aGlzLl9zY2FsZVk7XG4gICAgICAgIGxldCBzeCA9IE1hdGguY2VpbCh4ICogc2NhbGVYICsgdGhpcy5fdmlld3BvcnRSZWN0LngpO1xuICAgICAgICBsZXQgc3kgPSBNYXRoLmNlaWwoeSAqIHNjYWxlWSArIHRoaXMuX3ZpZXdwb3J0UmVjdC55KTtcbiAgICAgICAgbGV0IHN3ID0gTWF0aC5jZWlsKHcgKiBzY2FsZVgpO1xuICAgICAgICBsZXQgc2ggPSBNYXRoLmNlaWwoaCAqIHNjYWxlWSk7XG4gICAgICAgIGxldCBnbCA9IGNjLmdhbWUuX3JlbmRlckNvbnRleHQ7XG5cbiAgICAgICAgaWYgKCFfc2Npc3NvclJlY3QpIHtcbiAgICAgICAgICAgIHZhciBib3hBcnIgPSBnbC5nZXRQYXJhbWV0ZXIoZ2wuU0NJU1NPUl9CT1gpO1xuICAgICAgICAgICAgX3NjaXNzb3JSZWN0ID0gY2MucmVjdChib3hBcnJbMF0sIGJveEFyclsxXSwgYm94QXJyWzJdLCBib3hBcnJbM10pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF9zY2lzc29yUmVjdC54ICE9PSBzeCB8fCBfc2Npc3NvclJlY3QueSAhPT0gc3kgfHwgX3NjaXNzb3JSZWN0LndpZHRoICE9PSBzdyB8fCBfc2Npc3NvclJlY3QuaGVpZ2h0ICE9PSBzaCkge1xuICAgICAgICAgICAgX3NjaXNzb3JSZWN0LnggPSBzeDtcbiAgICAgICAgICAgIF9zY2lzc29yUmVjdC55ID0gc3k7XG4gICAgICAgICAgICBfc2Npc3NvclJlY3Qud2lkdGggPSBzdztcbiAgICAgICAgICAgIF9zY2lzc29yUmVjdC5oZWlnaHQgPSBzaDtcbiAgICAgICAgICAgIGdsLnNjaXNzb3Ioc3gsIHN5LCBzdywgc2gpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXR1cm5zIHdoZXRoZXIgR0xfU0NJU1NPUl9URVNUIGlzIGVuYWJsZVxuICAgICAqICEjemgg5qOA5p+lIHNjaXNzb3Ig5piv5ZCm55Sf5pWI44CCXG4gICAgICogQG1ldGhvZCBpc1NjaXNzb3JFbmFibGVkXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMFxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaXNTY2lzc29yRW5hYmxlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gY2MuZ2FtZS5fcmVuZGVyQ29udGV4dC5pc0VuYWJsZWQoZ2wuU0NJU1NPUl9URVNUKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJldHVybnMgdGhlIGN1cnJlbnQgc2Npc3NvciByZWN0YW5nbGVcbiAgICAgKiAhI3poIOi/lOWbnuW9k+WJjeeahCBzY2lzc29yIOWJquijgeWMuuWfn+OAglxuICAgICAqIEBtZXRob2QgZ2V0U2Npc3NvclJlY3RcbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wXG4gICAgICogQHJldHVybiB7UmVjdH1cbiAgICAgKi9cbiAgICBnZXRTY2lzc29yUmVjdDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIV9zY2lzc29yUmVjdCkge1xuICAgICAgICAgICAgdmFyIGJveEFyciA9IGdsLmdldFBhcmFtZXRlcihnbC5TQ0lTU09SX0JPWCk7XG4gICAgICAgICAgICBfc2Npc3NvclJlY3QgPSBjYy5yZWN0KGJveEFyclswXSwgYm94QXJyWzFdLCBib3hBcnJbMl0sIGJveEFyclszXSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHNjYWxlWEZhY3RvciA9IDEgLyB0aGlzLl9zY2FsZVg7XG4gICAgICAgIHZhciBzY2FsZVlGYWN0b3IgPSAxIC8gdGhpcy5fc2NhbGVZO1xuICAgICAgICByZXR1cm4gY2MucmVjdChcbiAgICAgICAgICAgIChfc2Npc3NvclJlY3QueCAtIHRoaXMuX3ZpZXdwb3J0UmVjdC54KSAqIHNjYWxlWEZhY3RvcixcbiAgICAgICAgICAgIChfc2Npc3NvclJlY3QueSAtIHRoaXMuX3ZpZXdwb3J0UmVjdC55KSAqIHNjYWxlWUZhY3RvcixcbiAgICAgICAgICAgIF9zY2lzc29yUmVjdC53aWR0aCAqIHNjYWxlWEZhY3RvcixcbiAgICAgICAgICAgIF9zY2lzc29yUmVjdC5oZWlnaHQgKiBzY2FsZVlGYWN0b3JcbiAgICAgICAgKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJldHVybnMgdGhlIHZpZXcgcG9ydCByZWN0YW5nbGUuXG4gICAgICogISN6aCDov5Tlm57op4bnqpfliaroo4HljLrln5/jgIJcbiAgICAgKiBAbWV0aG9kIGdldFZpZXdwb3J0UmVjdFxuICAgICAqIEByZXR1cm4ge1JlY3R9XG4gICAgICovXG4gICAgZ2V0Vmlld3BvcnRSZWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92aWV3cG9ydFJlY3Q7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXR1cm5zIHNjYWxlIGZhY3RvciBvZiB0aGUgaG9yaXpvbnRhbCBkaXJlY3Rpb24gKFggYXhpcykuXG4gICAgICogISN6aCDov5Tlm57mqKrovbTnmoTnvKnmlL7mr5TvvIzov5nkuKrnvKnmlL7mr5TmmK/lsIbnlLvluIPlg4/ntKDliIbovqjnjofmlL7liLDorr7orqHliIbovqjnjofnmoTmr5TkvovjgIJcbiAgICAgKiBAbWV0aG9kIGdldFNjYWxlWFxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRTY2FsZVg6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NjYWxlWDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJldHVybnMgc2NhbGUgZmFjdG9yIG9mIHRoZSB2ZXJ0aWNhbCBkaXJlY3Rpb24gKFkgYXhpcykuXG4gICAgICogISN6aCDov5Tlm57nurXovbTnmoTnvKnmlL7mr5TvvIzov5nkuKrnvKnmlL7mr5TmmK/lsIbnlLvluIPlg4/ntKDliIbovqjnjofnvKnmlL7liLDorr7orqHliIbovqjnjofnmoTmr5TkvovjgIJcbiAgICAgKiBAbWV0aG9kIGdldFNjYWxlWVxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRTY2FsZVk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NjYWxlWTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJldHVybnMgZGV2aWNlIHBpeGVsIHJhdGlvIGZvciByZXRpbmEgZGlzcGxheS5cbiAgICAgKiAhI3poIOi/lOWbnuiuvuWkh+aIlua1j+iniOWZqOWDj+e0oOavlOS+i+OAglxuICAgICAqIEBtZXRob2QgZ2V0RGV2aWNlUGl4ZWxSYXRpb1xuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXREZXZpY2VQaXhlbFJhdGlvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RldmljZVBpeGVsUmF0aW87XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXR1cm5zIHRoZSByZWFsIGxvY2F0aW9uIGluIHZpZXcgZm9yIGEgdHJhbnNsYXRpb24gYmFzZWQgb24gYSByZWxhdGVkIHBvc2l0aW9uXG4gICAgICogISN6aCDlsIblsY/luZXlnZDmoIfovazmjaLkuLrmuLjmiI/op4blm77kuIvnmoTlnZDmoIfjgIJcbiAgICAgKiBAbWV0aG9kIGNvbnZlcnRUb0xvY2F0aW9uSW5WaWV3XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHR4IC0gVGhlIFggYXhpcyB0cmFuc2xhdGlvblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0eSAtIFRoZSBZIGF4aXMgdHJhbnNsYXRpb25cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVsYXRlZFBvcyAtIFRoZSByZWxhdGVkIHBvc2l0aW9uIG9iamVjdCBpbmNsdWRpbmcgXCJsZWZ0XCIsIFwidG9wXCIsIFwid2lkdGhcIiwgXCJoZWlnaHRcIiBpbmZvcm1hdGlvbnNcbiAgICAgKiBAcmV0dXJuIHtWZWMyfVxuICAgICAqL1xuICAgIGNvbnZlcnRUb0xvY2F0aW9uSW5WaWV3OiBmdW5jdGlvbiAodHgsIHR5LCByZWxhdGVkUG9zLCBvdXQpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IG91dCB8fCBjYy52MigpO1xuICAgICAgICBsZXQgcG9zTGVmdCA9IHJlbGF0ZWRQb3MuYWRqdXN0ZWRMZWZ0ID8gcmVsYXRlZFBvcy5hZGp1c3RlZExlZnQgOiByZWxhdGVkUG9zLmxlZnQ7XG4gICAgICAgIGxldCBwb3NUb3AgPSByZWxhdGVkUG9zLmFkanVzdGVkVG9wID8gcmVsYXRlZFBvcy5hZGp1c3RlZFRvcCA6IHJlbGF0ZWRQb3MudG9wO1xuICAgICAgICBsZXQgeCA9IHRoaXMuX2RldmljZVBpeGVsUmF0aW8gKiAodHggLSBwb3NMZWZ0KTtcbiAgICAgICAgbGV0IHkgPSB0aGlzLl9kZXZpY2VQaXhlbFJhdGlvICogKHBvc1RvcCArIHJlbGF0ZWRQb3MuaGVpZ2h0IC0gdHkpO1xuICAgICAgICBpZiAodGhpcy5faXNSb3RhdGVkKSB7XG4gICAgICAgICAgICByZXN1bHQueCA9IGNjLmdhbWUuY2FudmFzLndpZHRoIC0geTtcbiAgICAgICAgICAgIHJlc3VsdC55ID0geDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdC54ID0geDtcbiAgICAgICAgICAgIHJlc3VsdC55ID0geTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICBfY29udmVydE1vdXNlVG9Mb2NhdGlvbkluVmlldzogZnVuY3Rpb24gKGluX291dF9wb2ludCwgcmVsYXRlZFBvcykge1xuICAgICAgICB2YXIgdmlld3BvcnQgPSB0aGlzLl92aWV3cG9ydFJlY3QsIF90ID0gdGhpcztcbiAgICAgICAgaW5fb3V0X3BvaW50LnggPSAoKF90Ll9kZXZpY2VQaXhlbFJhdGlvICogKGluX291dF9wb2ludC54IC0gcmVsYXRlZFBvcy5sZWZ0KSkgLSB2aWV3cG9ydC54KSAvIF90Ll9zY2FsZVg7XG4gICAgICAgIGluX291dF9wb2ludC55ID0gKF90Ll9kZXZpY2VQaXhlbFJhdGlvICogKHJlbGF0ZWRQb3MudG9wICsgcmVsYXRlZFBvcy5oZWlnaHQgLSBpbl9vdXRfcG9pbnQueSkgLSB2aWV3cG9ydC55KSAvIF90Ll9zY2FsZVk7XG4gICAgfSxcblxuICAgIF9jb252ZXJ0UG9pbnRXaXRoU2NhbGU6IGZ1bmN0aW9uIChwb2ludCkge1xuICAgICAgICB2YXIgdmlld3BvcnQgPSB0aGlzLl92aWV3cG9ydFJlY3Q7XG4gICAgICAgIHBvaW50LnggPSAocG9pbnQueCAtIHZpZXdwb3J0LngpIC8gdGhpcy5fc2NhbGVYO1xuICAgICAgICBwb2ludC55ID0gKHBvaW50LnkgLSB2aWV3cG9ydC55KSAvIHRoaXMuX3NjYWxlWTtcbiAgICB9LFxuXG4gICAgX2NvbnZlcnRUb3VjaGVzV2l0aFNjYWxlOiBmdW5jdGlvbiAodG91Y2hlcykge1xuICAgICAgICB2YXIgdmlld3BvcnQgPSB0aGlzLl92aWV3cG9ydFJlY3QsIHNjYWxlWCA9IHRoaXMuX3NjYWxlWCwgc2NhbGVZID0gdGhpcy5fc2NhbGVZLFxuICAgICAgICAgICAgc2VsVG91Y2gsIHNlbFBvaW50LCBzZWxQcmVQb2ludDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBzZWxUb3VjaCA9IHRvdWNoZXNbaV07XG4gICAgICAgICAgICBzZWxQb2ludCA9IHNlbFRvdWNoLl9wb2ludDtcbiAgICAgICAgICAgIHNlbFByZVBvaW50ID0gc2VsVG91Y2guX3ByZXZQb2ludDtcblxuICAgICAgICAgICAgc2VsUG9pbnQueCA9IChzZWxQb2ludC54IC0gdmlld3BvcnQueCkgLyBzY2FsZVg7XG4gICAgICAgICAgICBzZWxQb2ludC55ID0gKHNlbFBvaW50LnkgLSB2aWV3cG9ydC55KSAvIHNjYWxlWTtcbiAgICAgICAgICAgIHNlbFByZVBvaW50LnggPSAoc2VsUHJlUG9pbnQueCAtIHZpZXdwb3J0LngpIC8gc2NhbGVYO1xuICAgICAgICAgICAgc2VsUHJlUG9pbnQueSA9IChzZWxQcmVQb2ludC55IC0gdmlld3BvcnQueSkgLyBzY2FsZVk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuLyoqXG4gKiAhZW5cbiAqIEVtaXQgd2hlbiBkZXNpZ24gcmVzb2x1dGlvbiBjaGFuZ2VkLlxuICogIXpoXG4gKiDlvZPorr7orqHliIbovqjnjofmlLnlj5jml7blj5HpgIHjgIJcbiAqIEBldmVudCBkZXNpZ24tcmVzb2x1dGlvbi1jaGFuZ2VkXG4gKi9cbiAvKipcbiAqICFlblxuICogRW1pdCB3aGVuIGNhbnZhcyByZXNpemUuXG4gKiAhemhcbiAqIOW9k+eUu+W4g+Wkp+Wwj+aUueWPmOaXtuWPkemAgeOAglxuICogQGV2ZW50IGNhbnZhcy1yZXNpemVcbiAqL1xuXG5cbi8qKlxuICogPHA+Y2MuZ2FtZS5jb250YWluZXJTdHJhdGVneSBjbGFzcyBpcyB0aGUgcm9vdCBzdHJhdGVneSBjbGFzcyBvZiBjb250YWluZXIncyBzY2FsZSBzdHJhdGVneSxcbiAqIGl0IGNvbnRyb2xzIHRoZSBiZWhhdmlvciBvZiBob3cgdG8gc2NhbGUgdGhlIGNjLmdhbWUuY29udGFpbmVyIGFuZCBjYy5nYW1lLmNhbnZhcyBvYmplY3Q8L3A+XG4gKlxuICogQGNsYXNzIENvbnRhaW5lclN0cmF0ZWd5XG4gKi9cbmNjLkNvbnRhaW5lclN0cmF0ZWd5ID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6IFwiQ29udGFpbmVyU3RyYXRlZ3lcIixcbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogTWFuaXB1bGF0aW9uIGJlZm9yZSBhcHBsaW5nIHRoZSBzdHJhdGVneVxuICAgICAqICEjemgg5Zyo5bqU55So562W55Wl5LmL5YmN55qE5pON5L2cXG4gICAgICogQG1ldGhvZCBwcmVBcHBseVxuICAgICAqIEBwYXJhbSB7Vmlld30gdmlldyAtIFRoZSB0YXJnZXQgdmlld1xuICAgICAqL1xuICAgIHByZUFwcGx5OiBmdW5jdGlvbiAodmlldykge1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogRnVuY3Rpb24gdG8gYXBwbHkgdGhpcyBzdHJhdGVneVxuICAgICAqICEjemgg562W55Wl5bqU55So5pa55rOVXG4gICAgICogQG1ldGhvZCBhcHBseVxuICAgICAqIEBwYXJhbSB7Vmlld30gdmlld1xuICAgICAqIEBwYXJhbSB7U2l6ZX0gZGVzaWduZWRSZXNvbHV0aW9uXG4gICAgICovXG4gICAgYXBwbHk6IGZ1bmN0aW9uICh2aWV3LCBkZXNpZ25lZFJlc29sdXRpb24pIHtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIE1hbmlwdWxhdGlvbiBhZnRlciBhcHBseWluZyB0aGUgc3RyYXRlZ3lcbiAgICAgKiAhI3poIOetlueVpeiwg+eUqOS5i+WQjueahOaTjeS9nFxuICAgICAqIEBtZXRob2QgcG9zdEFwcGx5XG4gICAgICogQHBhcmFtIHtWaWV3fSB2aWV3ICBUaGUgdGFyZ2V0IHZpZXdcbiAgICAgKi9cbiAgICBwb3N0QXBwbHk6IGZ1bmN0aW9uICh2aWV3KSB7XG5cbiAgICB9LFxuXG4gICAgX3NldHVwQ29udGFpbmVyOiBmdW5jdGlvbiAodmlldywgdywgaCkge1xuICAgICAgICB2YXIgbG9jQ2FudmFzID0gY2MuZ2FtZS5jYW52YXM7XG5cbiAgICAgICAgdGhpcy5fc2V0dXBTdHlsZSh2aWV3LCB3LCBoKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFNldHVwIHBpeGVsIHJhdGlvIGZvciByZXRpbmEgZGlzcGxheVxuICAgICAgICB2YXIgZGV2aWNlUGl4ZWxSYXRpbyA9IHZpZXcuX2RldmljZVBpeGVsUmF0aW8gPSAxO1xuICAgICAgICBpZihDQ19KU0Ipe1xuICAgICAgICAgICAgLy8gdmlldy5pc1JldGluYUVuYWJsZWQgb25seSB3b3JrIG9uIHdlYi4gXG4gICAgICAgICAgICBkZXZpY2VQaXhlbFJhdGlvID0gdmlldy5fZGV2aWNlUGl4ZWxSYXRpbyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICB9ZWxzZSBpZiAodmlldy5pc1JldGluYUVuYWJsZWQoKSkge1xuICAgICAgICAgICAgZGV2aWNlUGl4ZWxSYXRpbyA9IHZpZXcuX2RldmljZVBpeGVsUmF0aW8gPSBNYXRoLm1pbih2aWV3Ll9tYXhQaXhlbFJhdGlvLCB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBTZXR1cCBjYW52YXNcbiAgICAgICAgbG9jQ2FudmFzLndpZHRoID0gdyAqIGRldmljZVBpeGVsUmF0aW87XG4gICAgICAgIGxvY0NhbnZhcy5oZWlnaHQgPSBoICogZGV2aWNlUGl4ZWxSYXRpbztcbiAgICB9LFxuXG4gICAgX3NldHVwU3R5bGU6IGZ1bmN0aW9uICh2aWV3LCB3LCBoKSB7XG4gICAgICAgIGxldCBsb2NDYW52YXMgPSBjYy5nYW1lLmNhbnZhcztcbiAgICAgICAgbGV0IGxvY0NvbnRhaW5lciA9IGNjLmdhbWUuY29udGFpbmVyO1xuICAgICAgICBpZiAoY2Muc3lzLm9zID09PSBjYy5zeXMuT1NfQU5EUk9JRCkge1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS53aWR0aCA9ICh2aWV3Ll9pc1JvdGF0ZWQgPyBoIDogdykgKyAncHgnO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5oZWlnaHQgPSAodmlldy5faXNSb3RhdGVkID8gdyA6IGgpICsgJ3B4JztcbiAgICAgICAgfVxuICAgICAgICAvLyBTZXR1cCBzdHlsZVxuICAgICAgICBsb2NDb250YWluZXIuc3R5bGUud2lkdGggPSBsb2NDYW52YXMuc3R5bGUud2lkdGggPSB3ICsgJ3B4JztcbiAgICAgICAgbG9jQ29udGFpbmVyLnN0eWxlLmhlaWdodCA9IGxvY0NhbnZhcy5zdHlsZS5oZWlnaHQgPSBoICsgJ3B4JztcbiAgICB9LFxuXG4gICAgX2ZpeENvbnRhaW5lcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBBZGQgY29udGFpbmVyIHRvIGRvY3VtZW50IGJvZHlcbiAgICAgICAgZG9jdW1lbnQuYm9keS5pbnNlcnRCZWZvcmUoY2MuZ2FtZS5jb250YWluZXIsIGRvY3VtZW50LmJvZHkuZmlyc3RDaGlsZCk7XG4gICAgICAgIC8vIFNldCBib2R5J3Mgd2lkdGggaGVpZ2h0IHRvIHdpbmRvdydzIHNpemUsIGFuZCBmb3JiaWQgb3ZlcmZsb3csIHNvIHRoYXQgZ2FtZSB3aWxsIGJlIGNlbnRlcmVkXG4gICAgICAgIHZhciBicyA9IGRvY3VtZW50LmJvZHkuc3R5bGU7XG4gICAgICAgIGJzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGggKyBcInB4XCI7XG4gICAgICAgIGJzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCArIFwicHhcIjtcbiAgICAgICAgYnMub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xuICAgICAgICAvLyBCb2R5IHNpemUgc29sdXRpb24gZG9lc24ndCB3b3JrIG9uIGFsbCBtb2JpbGUgYnJvd3NlciBzbyB0aGlzIGlzIHRoZSBhbGV0ZXJuYXRpdmU6IGZpeGVkIGNvbnRhaW5lclxuICAgICAgICB2YXIgY29udFN0eWxlID0gY2MuZ2FtZS5jb250YWluZXIuc3R5bGU7XG4gICAgICAgIGNvbnRTdHlsZS5wb3NpdGlvbiA9IFwiZml4ZWRcIjtcbiAgICAgICAgY29udFN0eWxlLmxlZnQgPSBjb250U3R5bGUudG9wID0gXCIwcHhcIjtcbiAgICAgICAgLy8gUmVwb3NpdGlvbiBib2R5XG4gICAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wID0gMDtcbiAgICB9XG59KTtcblxuLyoqXG4gKiA8cD5jYy5Db250ZW50U3RyYXRlZ3kgY2xhc3MgaXMgdGhlIHJvb3Qgc3RyYXRlZ3kgY2xhc3Mgb2YgY29udGVudCdzIHNjYWxlIHN0cmF0ZWd5LFxuICogaXQgY29udHJvbHMgdGhlIGJlaGF2aW9yIG9mIGhvdyB0byBzY2FsZSB0aGUgc2NlbmUgYW5kIHNldHVwIHRoZSB2aWV3cG9ydCBmb3IgdGhlIGdhbWU8L3A+XG4gKlxuICogQGNsYXNzIENvbnRlbnRTdHJhdGVneVxuICovXG5jYy5Db250ZW50U3RyYXRlZ3kgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogXCJDb250ZW50U3RyYXRlZ3lcIixcblxuICAgIGN0b3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fcmVzdWx0ID0ge1xuICAgICAgICAgICAgc2NhbGU6IFsxLCAxXSxcbiAgICAgICAgICAgIHZpZXdwb3J0OiBudWxsXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIF9idWlsZFJlc3VsdDogZnVuY3Rpb24gKGNvbnRhaW5lclcsIGNvbnRhaW5lckgsIGNvbnRlbnRXLCBjb250ZW50SCwgc2NhbGVYLCBzY2FsZVkpIHtcbiAgICAgICAgLy8gTWFrZXMgY29udGVudCBmaXQgYmV0dGVyIHRoZSBjYW52YXNcbiAgICAgICAgTWF0aC5hYnMoY29udGFpbmVyVyAtIGNvbnRlbnRXKSA8IDIgJiYgKGNvbnRlbnRXID0gY29udGFpbmVyVyk7XG4gICAgICAgIE1hdGguYWJzKGNvbnRhaW5lckggLSBjb250ZW50SCkgPCAyICYmIChjb250ZW50SCA9IGNvbnRhaW5lckgpO1xuXG4gICAgICAgIHZhciB2aWV3cG9ydCA9IGNjLnJlY3QoKGNvbnRhaW5lclcgLSBjb250ZW50VykgLyAyLCAoY29udGFpbmVySCAtIGNvbnRlbnRIKSAvIDIsIGNvbnRlbnRXLCBjb250ZW50SCk7XG5cbiAgICAgICAgLy8gVHJhbnNsYXRlIHRoZSBjb250ZW50XG4gICAgICAgIGlmIChjYy5nYW1lLnJlbmRlclR5cGUgPT09IGNjLmdhbWUuUkVOREVSX1RZUEVfQ0FOVkFTKXtcbiAgICAgICAgICAgIC8vVE9ETzogbW9kaWZ5IHNvbWV0aGluZyBmb3Igc2V0VHJhbnNmb3JtXG4gICAgICAgICAgICAvL2NjLmdhbWUuX3JlbmRlckNvbnRleHQudHJhbnNsYXRlKHZpZXdwb3J0LngsIHZpZXdwb3J0LnkgKyBjb250ZW50SCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9yZXN1bHQuc2NhbGUgPSBbc2NhbGVYLCBzY2FsZVldO1xuICAgICAgICB0aGlzLl9yZXN1bHQudmlld3BvcnQgPSB2aWV3cG9ydDtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3VsdDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIE1hbmlwdWxhdGlvbiBiZWZvcmUgYXBwbHlpbmcgdGhlIHN0cmF0ZWd5XG4gICAgICogISN6aCDnrZbnlaXlupTnlKjliY3nmoTmk43kvZxcbiAgICAgKiBAbWV0aG9kIHByZUFwcGx5XG4gICAgICogQHBhcmFtIHtWaWV3fSB2aWV3IC0gVGhlIHRhcmdldCB2aWV3XG4gICAgICovXG4gICAgcHJlQXBwbHk6IGZ1bmN0aW9uICh2aWV3KSB7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gRnVuY3Rpb24gdG8gYXBwbHkgdGhpcyBzdHJhdGVneVxuICAgICAqIFRoZSByZXR1cm4gdmFsdWUgaXMge3NjYWxlOiBbc2NhbGVYLCBzY2FsZVldLCB2aWV3cG9ydDoge2NjLlJlY3R9fSxcbiAgICAgKiBUaGUgdGFyZ2V0IHZpZXcgY2FuIHRoZW4gYXBwbHkgdGhlc2UgdmFsdWUgdG8gaXRzZWxmLCBpdCdzIHByZWZlcnJlZCBub3QgdG8gbW9kaWZ5IGRpcmVjdGx5IGl0cyBwcml2YXRlIHZhcmlhYmxlc1xuICAgICAqICEjemgg6LCD55So562W55Wl5pa55rOVXG4gICAgICogQG1ldGhvZCBhcHBseVxuICAgICAqIEBwYXJhbSB7Vmlld30gdmlld1xuICAgICAqIEBwYXJhbSB7U2l6ZX0gZGVzaWduZWRSZXNvbHV0aW9uXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBzY2FsZUFuZFZpZXdwb3J0UmVjdFxuICAgICAqL1xuICAgIGFwcGx5OiBmdW5jdGlvbiAodmlldywgZGVzaWduZWRSZXNvbHV0aW9uKSB7XG4gICAgICAgIHJldHVybiB7XCJzY2FsZVwiOiBbMSwgMV19O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogTWFuaXB1bGF0aW9uIGFmdGVyIGFwcGx5aW5nIHRoZSBzdHJhdGVneVxuICAgICAqICEjemgg562W55Wl6LCD55So5LmL5ZCO55qE5pON5L2cXG4gICAgICogQG1ldGhvZCBwb3N0QXBwbHlcbiAgICAgKiBAcGFyYW0ge1ZpZXd9IHZpZXcgLSBUaGUgdGFyZ2V0IHZpZXdcbiAgICAgKi9cbiAgICBwb3N0QXBwbHk6IGZ1bmN0aW9uICh2aWV3KSB7XG4gICAgfVxufSk7XG5cbihmdW5jdGlvbiAoKSB7XG5cbi8vIENvbnRhaW5lciBzY2FsZSBzdHJhdGVneXNcbiAgICAvKipcbiAgICAgKiBAY2xhc3MgRXF1YWxUb0ZyYW1lXG4gICAgICogQGV4dGVuZHMgQ29udGFpbmVyU3RyYXRlZ3lcbiAgICAgKi9cbiAgICB2YXIgRXF1YWxUb0ZyYW1lID0gY2MuQ2xhc3Moe1xuICAgICAgICBuYW1lOiBcIkVxdWFsVG9GcmFtZVwiLFxuICAgICAgICBleHRlbmRzOiBjYy5Db250YWluZXJTdHJhdGVneSxcbiAgICAgICAgYXBwbHk6IGZ1bmN0aW9uICh2aWV3KSB7XG4gICAgICAgICAgICB2YXIgZnJhbWVIID0gdmlldy5fZnJhbWVTaXplLmhlaWdodCwgY29udGFpbmVyU3R5bGUgPSBjYy5nYW1lLmNvbnRhaW5lci5zdHlsZTtcbiAgICAgICAgICAgIHRoaXMuX3NldHVwQ29udGFpbmVyKHZpZXcsIHZpZXcuX2ZyYW1lU2l6ZS53aWR0aCwgdmlldy5fZnJhbWVTaXplLmhlaWdodCk7XG4gICAgICAgICAgICAvLyBTZXR1cCBjb250YWluZXIncyBtYXJnaW4gYW5kIHBhZGRpbmdcbiAgICAgICAgICAgIGlmICh2aWV3Ll9pc1JvdGF0ZWQpIHtcbiAgICAgICAgICAgICAgICBjb250YWluZXJTdHlsZS5tYXJnaW4gPSAnMCAwIDAgJyArIGZyYW1lSCArICdweCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb250YWluZXJTdHlsZS5tYXJnaW4gPSAnMHB4JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnRhaW5lclN0eWxlLnBhZGRpbmcgPSBcIjBweFwiO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgUHJvcG9ydGlvbmFsVG9GcmFtZVxuICAgICAqIEBleHRlbmRzIENvbnRhaW5lclN0cmF0ZWd5XG4gICAgICovXG4gICAgdmFyIFByb3BvcnRpb25hbFRvRnJhbWUgPSBjYy5DbGFzcyh7XG4gICAgICAgIG5hbWU6IFwiUHJvcG9ydGlvbmFsVG9GcmFtZVwiLFxuICAgICAgICBleHRlbmRzOiBjYy5Db250YWluZXJTdHJhdGVneSxcbiAgICAgICAgYXBwbHk6IGZ1bmN0aW9uICh2aWV3LCBkZXNpZ25lZFJlc29sdXRpb24pIHtcbiAgICAgICAgICAgIHZhciBmcmFtZVcgPSB2aWV3Ll9mcmFtZVNpemUud2lkdGgsIGZyYW1lSCA9IHZpZXcuX2ZyYW1lU2l6ZS5oZWlnaHQsIGNvbnRhaW5lclN0eWxlID0gY2MuZ2FtZS5jb250YWluZXIuc3R5bGUsXG4gICAgICAgICAgICAgICAgZGVzaWduVyA9IGRlc2lnbmVkUmVzb2x1dGlvbi53aWR0aCwgZGVzaWduSCA9IGRlc2lnbmVkUmVzb2x1dGlvbi5oZWlnaHQsXG4gICAgICAgICAgICAgICAgc2NhbGVYID0gZnJhbWVXIC8gZGVzaWduVywgc2NhbGVZID0gZnJhbWVIIC8gZGVzaWduSCxcbiAgICAgICAgICAgICAgICBjb250YWluZXJXLCBjb250YWluZXJIO1xuXG4gICAgICAgICAgICBzY2FsZVggPCBzY2FsZVkgPyAoY29udGFpbmVyVyA9IGZyYW1lVywgY29udGFpbmVySCA9IGRlc2lnbkggKiBzY2FsZVgpIDogKGNvbnRhaW5lclcgPSBkZXNpZ25XICogc2NhbGVZLCBjb250YWluZXJIID0gZnJhbWVIKTtcblxuICAgICAgICAgICAgLy8gQWRqdXN0IGNvbnRhaW5lciBzaXplIHdpdGggaW50ZWdlciB2YWx1ZVxuICAgICAgICAgICAgdmFyIG9mZnggPSBNYXRoLnJvdW5kKChmcmFtZVcgLSBjb250YWluZXJXKSAvIDIpO1xuICAgICAgICAgICAgdmFyIG9mZnkgPSBNYXRoLnJvdW5kKChmcmFtZUggLSBjb250YWluZXJIKSAvIDIpO1xuICAgICAgICAgICAgY29udGFpbmVyVyA9IGZyYW1lVyAtIDIgKiBvZmZ4O1xuICAgICAgICAgICAgY29udGFpbmVySCA9IGZyYW1lSCAtIDIgKiBvZmZ5O1xuXG4gICAgICAgICAgICB0aGlzLl9zZXR1cENvbnRhaW5lcih2aWV3LCBjb250YWluZXJXLCBjb250YWluZXJIKTtcbiAgICAgICAgICAgIGlmICghQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgLy8gU2V0dXAgY29udGFpbmVyJ3MgbWFyZ2luIGFuZCBwYWRkaW5nXG4gICAgICAgICAgICAgICAgaWYgKHZpZXcuX2lzUm90YXRlZCkge1xuICAgICAgICAgICAgICAgICAgICBjb250YWluZXJTdHlsZS5tYXJnaW4gPSAnMCAwIDAgJyArIGZyYW1lSCArICdweCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb250YWluZXJTdHlsZS5tYXJnaW4gPSAnMHB4JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGFpbmVyU3R5bGUucGFkZGluZ0xlZnQgPSBvZmZ4ICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lclN0eWxlLnBhZGRpbmdSaWdodCA9IG9mZnggKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyU3R5bGUucGFkZGluZ1RvcCA9IG9mZnkgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyU3R5bGUucGFkZGluZ0JvdHRvbSA9IG9mZnkgKyBcInB4XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBjbGFzcyBFcXVhbFRvV2luZG93XG4gICAgICogQGV4dGVuZHMgRXF1YWxUb0ZyYW1lXG4gICAgICovXG4gICAgdmFyIEVxdWFsVG9XaW5kb3cgPSBjYy5DbGFzcyh7XG4gICAgICAgIG5hbWU6IFwiRXF1YWxUb1dpbmRvd1wiLFxuICAgICAgICBleHRlbmRzOiBFcXVhbFRvRnJhbWUsXG4gICAgICAgIHByZUFwcGx5OiBmdW5jdGlvbiAodmlldykge1xuICAgICAgICAgICAgdGhpcy5fc3VwZXIodmlldyk7XG4gICAgICAgICAgICBjYy5nYW1lLmZyYW1lID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICB9LFxuXG4gICAgICAgIGFwcGx5OiBmdW5jdGlvbiAodmlldykge1xuICAgICAgICAgICAgdGhpcy5fc3VwZXIodmlldyk7XG4gICAgICAgICAgICB0aGlzLl9maXhDb250YWluZXIoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQGNsYXNzIFByb3BvcnRpb25hbFRvV2luZG93XG4gICAgICogQGV4dGVuZHMgUHJvcG9ydGlvbmFsVG9GcmFtZVxuICAgICAqL1xuICAgIHZhciBQcm9wb3J0aW9uYWxUb1dpbmRvdyA9IGNjLkNsYXNzKHtcbiAgICAgICAgbmFtZTogXCJQcm9wb3J0aW9uYWxUb1dpbmRvd1wiLFxuICAgICAgICBleHRlbmRzOiBQcm9wb3J0aW9uYWxUb0ZyYW1lLFxuICAgICAgICBwcmVBcHBseTogZnVuY3Rpb24gKHZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMuX3N1cGVyKHZpZXcpO1xuICAgICAgICAgICAgY2MuZ2FtZS5mcmFtZSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgfSxcblxuICAgICAgICBhcHBseTogZnVuY3Rpb24gKHZpZXcsIGRlc2lnbmVkUmVzb2x1dGlvbikge1xuICAgICAgICAgICAgdGhpcy5fc3VwZXIodmlldywgZGVzaWduZWRSZXNvbHV0aW9uKTtcbiAgICAgICAgICAgIHRoaXMuX2ZpeENvbnRhaW5lcigpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgT3JpZ2luYWxDb250YWluZXJcbiAgICAgKiBAZXh0ZW5kcyBDb250YWluZXJTdHJhdGVneVxuICAgICAqL1xuICAgIHZhciBPcmlnaW5hbENvbnRhaW5lciA9IGNjLkNsYXNzKHtcbiAgICAgICAgbmFtZTogXCJPcmlnaW5hbENvbnRhaW5lclwiLFxuICAgICAgICBleHRlbmRzOiBjYy5Db250YWluZXJTdHJhdGVneSxcbiAgICAgICAgYXBwbHk6IGZ1bmN0aW9uICh2aWV3KSB7XG4gICAgICAgICAgICB0aGlzLl9zZXR1cENvbnRhaW5lcih2aWV3LCBjYy5nYW1lLmNhbnZhcy53aWR0aCwgY2MuZ2FtZS5jYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gbmVlZCB0byBhZGFwdCBwcm90b3R5cGUgYmVmb3JlIGluc3RhbnRpYXRpbmdcbiAgICBsZXQgX2dsb2JhbCA9IHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogd2luZG93O1xuICAgIGxldCBnbG9iYWxBZGFwdGVyID0gX2dsb2JhbC5fX2dsb2JhbEFkYXB0ZXI7XG4gICAgaWYgKGdsb2JhbEFkYXB0ZXIpIHtcbiAgICAgICAgaWYgKGdsb2JhbEFkYXB0ZXIuYWRhcHRDb250YWluZXJTdHJhdGVneSkge1xuICAgICAgICAgICAgZ2xvYmFsQWRhcHRlci5hZGFwdENvbnRhaW5lclN0cmF0ZWd5KGNjLkNvbnRhaW5lclN0cmF0ZWd5LnByb3RvdHlwZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGdsb2JhbEFkYXB0ZXIuYWRhcHRWaWV3KSB7XG4gICAgICAgICAgICBnbG9iYWxBZGFwdGVyLmFkYXB0VmlldyhWaWV3LnByb3RvdHlwZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbi8vICNOT1QgU1RBQkxFIG9uIEFuZHJvaWQjIEFsaWFzOiBTdHJhdGVneSB0aGF0IG1ha2VzIHRoZSBjb250YWluZXIncyBzaXplIGVxdWFscyB0byB0aGUgd2luZG93J3Mgc2l6ZVxuLy8gICAgY2MuQ29udGFpbmVyU3RyYXRlZ3kuRVFVQUxfVE9fV0lORE9XID0gbmV3IEVxdWFsVG9XaW5kb3coKTtcbi8vICNOT1QgU1RBQkxFIG9uIEFuZHJvaWQjIEFsaWFzOiBTdHJhdGVneSB0aGF0IHNjYWxlIHByb3BvcnRpb25hbGx5IHRoZSBjb250YWluZXIncyBzaXplIHRvIHdpbmRvdydzIHNpemVcbi8vICAgIGNjLkNvbnRhaW5lclN0cmF0ZWd5LlBST1BPUlRJT05fVE9fV0lORE9XID0gbmV3IFByb3BvcnRpb25hbFRvV2luZG93KCk7XG4vLyBBbGlhczogU3RyYXRlZ3kgdGhhdCBtYWtlcyB0aGUgY29udGFpbmVyJ3Mgc2l6ZSBlcXVhbHMgdG8gdGhlIGZyYW1lJ3Mgc2l6ZVxuICAgIGNjLkNvbnRhaW5lclN0cmF0ZWd5LkVRVUFMX1RPX0ZSQU1FID0gbmV3IEVxdWFsVG9GcmFtZSgpO1xuLy8gQWxpYXM6IFN0cmF0ZWd5IHRoYXQgc2NhbGUgcHJvcG9ydGlvbmFsbHkgdGhlIGNvbnRhaW5lcidzIHNpemUgdG8gZnJhbWUncyBzaXplXG4gICAgY2MuQ29udGFpbmVyU3RyYXRlZ3kuUFJPUE9SVElPTl9UT19GUkFNRSA9IG5ldyBQcm9wb3J0aW9uYWxUb0ZyYW1lKCk7XG4vLyBBbGlhczogU3RyYXRlZ3kgdGhhdCBrZWVwcyB0aGUgb3JpZ2luYWwgY29udGFpbmVyJ3Mgc2l6ZVxuICAgIGNjLkNvbnRhaW5lclN0cmF0ZWd5Lk9SSUdJTkFMX0NPTlRBSU5FUiA9IG5ldyBPcmlnaW5hbENvbnRhaW5lcigpO1xuXG4vLyBDb250ZW50IHNjYWxlIHN0cmF0ZWd5c1xuICAgIHZhciBFeGFjdEZpdCA9IGNjLkNsYXNzKHtcbiAgICAgICAgbmFtZTogXCJFeGFjdEZpdFwiLFxuICAgICAgICBleHRlbmRzOiBjYy5Db250ZW50U3RyYXRlZ3ksXG4gICAgICAgIGFwcGx5OiBmdW5jdGlvbiAodmlldywgZGVzaWduZWRSZXNvbHV0aW9uKSB7XG4gICAgICAgICAgICB2YXIgY29udGFpbmVyVyA9IGNjLmdhbWUuY2FudmFzLndpZHRoLCBjb250YWluZXJIID0gY2MuZ2FtZS5jYW52YXMuaGVpZ2h0LFxuICAgICAgICAgICAgICAgIHNjYWxlWCA9IGNvbnRhaW5lclcgLyBkZXNpZ25lZFJlc29sdXRpb24ud2lkdGgsIHNjYWxlWSA9IGNvbnRhaW5lckggLyBkZXNpZ25lZFJlc29sdXRpb24uaGVpZ2h0O1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYnVpbGRSZXN1bHQoY29udGFpbmVyVywgY29udGFpbmVySCwgY29udGFpbmVyVywgY29udGFpbmVySCwgc2NhbGVYLCBzY2FsZVkpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgU2hvd0FsbCA9IGNjLkNsYXNzKHtcbiAgICAgICAgbmFtZTogXCJTaG93QWxsXCIsXG4gICAgICAgIGV4dGVuZHM6IGNjLkNvbnRlbnRTdHJhdGVneSxcbiAgICAgICAgYXBwbHk6IGZ1bmN0aW9uICh2aWV3LCBkZXNpZ25lZFJlc29sdXRpb24pIHtcbiAgICAgICAgICAgIHZhciBjb250YWluZXJXID0gY2MuZ2FtZS5jYW52YXMud2lkdGgsIGNvbnRhaW5lckggPSBjYy5nYW1lLmNhbnZhcy5oZWlnaHQsXG4gICAgICAgICAgICAgICAgZGVzaWduVyA9IGRlc2lnbmVkUmVzb2x1dGlvbi53aWR0aCwgZGVzaWduSCA9IGRlc2lnbmVkUmVzb2x1dGlvbi5oZWlnaHQsXG4gICAgICAgICAgICAgICAgc2NhbGVYID0gY29udGFpbmVyVyAvIGRlc2lnblcsIHNjYWxlWSA9IGNvbnRhaW5lckggLyBkZXNpZ25ILCBzY2FsZSA9IDAsXG4gICAgICAgICAgICAgICAgY29udGVudFcsIGNvbnRlbnRIO1xuXG4gICAgICAgICAgICBzY2FsZVggPCBzY2FsZVkgPyAoc2NhbGUgPSBzY2FsZVgsIGNvbnRlbnRXID0gY29udGFpbmVyVywgY29udGVudEggPSBkZXNpZ25IICogc2NhbGUpXG4gICAgICAgICAgICAgICAgOiAoc2NhbGUgPSBzY2FsZVksIGNvbnRlbnRXID0gZGVzaWduVyAqIHNjYWxlLCBjb250ZW50SCA9IGNvbnRhaW5lckgpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYnVpbGRSZXN1bHQoY29udGFpbmVyVywgY29udGFpbmVySCwgY29udGVudFcsIGNvbnRlbnRILCBzY2FsZSwgc2NhbGUpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgTm9Cb3JkZXIgPSBjYy5DbGFzcyh7XG4gICAgICAgIG5hbWU6IFwiTm9Cb3JkZXJcIixcbiAgICAgICAgZXh0ZW5kczogY2MuQ29udGVudFN0cmF0ZWd5LFxuICAgICAgICBhcHBseTogZnVuY3Rpb24gKHZpZXcsIGRlc2lnbmVkUmVzb2x1dGlvbikge1xuICAgICAgICAgICAgdmFyIGNvbnRhaW5lclcgPSBjYy5nYW1lLmNhbnZhcy53aWR0aCwgY29udGFpbmVySCA9IGNjLmdhbWUuY2FudmFzLmhlaWdodCxcbiAgICAgICAgICAgICAgICBkZXNpZ25XID0gZGVzaWduZWRSZXNvbHV0aW9uLndpZHRoLCBkZXNpZ25IID0gZGVzaWduZWRSZXNvbHV0aW9uLmhlaWdodCxcbiAgICAgICAgICAgICAgICBzY2FsZVggPSBjb250YWluZXJXIC8gZGVzaWduVywgc2NhbGVZID0gY29udGFpbmVySCAvIGRlc2lnbkgsIHNjYWxlLFxuICAgICAgICAgICAgICAgIGNvbnRlbnRXLCBjb250ZW50SDtcblxuICAgICAgICAgICAgc2NhbGVYIDwgc2NhbGVZID8gKHNjYWxlID0gc2NhbGVZLCBjb250ZW50VyA9IGRlc2lnblcgKiBzY2FsZSwgY29udGVudEggPSBjb250YWluZXJIKVxuICAgICAgICAgICAgICAgIDogKHNjYWxlID0gc2NhbGVYLCBjb250ZW50VyA9IGNvbnRhaW5lclcsIGNvbnRlbnRIID0gZGVzaWduSCAqIHNjYWxlKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2J1aWxkUmVzdWx0KGNvbnRhaW5lclcsIGNvbnRhaW5lckgsIGNvbnRlbnRXLCBjb250ZW50SCwgc2NhbGUsIHNjYWxlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIEZpeGVkSGVpZ2h0ID0gY2MuQ2xhc3Moe1xuICAgICAgICBuYW1lOiBcIkZpeGVkSGVpZ2h0XCIsXG4gICAgICAgIGV4dGVuZHM6IGNjLkNvbnRlbnRTdHJhdGVneSxcbiAgICAgICAgYXBwbHk6IGZ1bmN0aW9uICh2aWV3LCBkZXNpZ25lZFJlc29sdXRpb24pIHtcbiAgICAgICAgICAgIHZhciBjb250YWluZXJXID0gY2MuZ2FtZS5jYW52YXMud2lkdGgsIGNvbnRhaW5lckggPSBjYy5nYW1lLmNhbnZhcy5oZWlnaHQsXG4gICAgICAgICAgICAgICAgZGVzaWduSCA9IGRlc2lnbmVkUmVzb2x1dGlvbi5oZWlnaHQsIHNjYWxlID0gY29udGFpbmVySCAvIGRlc2lnbkgsXG4gICAgICAgICAgICAgICAgY29udGVudFcgPSBjb250YWluZXJXLCBjb250ZW50SCA9IGNvbnRhaW5lckg7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9idWlsZFJlc3VsdChjb250YWluZXJXLCBjb250YWluZXJILCBjb250ZW50VywgY29udGVudEgsIHNjYWxlLCBzY2FsZSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBGaXhlZFdpZHRoID0gY2MuQ2xhc3Moe1xuICAgICAgICBuYW1lOiBcIkZpeGVkV2lkdGhcIixcbiAgICAgICAgZXh0ZW5kczogY2MuQ29udGVudFN0cmF0ZWd5LFxuICAgICAgICBhcHBseTogZnVuY3Rpb24gKHZpZXcsIGRlc2lnbmVkUmVzb2x1dGlvbikge1xuICAgICAgICAgICAgdmFyIGNvbnRhaW5lclcgPSBjYy5nYW1lLmNhbnZhcy53aWR0aCwgY29udGFpbmVySCA9IGNjLmdhbWUuY2FudmFzLmhlaWdodCxcbiAgICAgICAgICAgICAgICBkZXNpZ25XID0gZGVzaWduZWRSZXNvbHV0aW9uLndpZHRoLCBzY2FsZSA9IGNvbnRhaW5lclcgLyBkZXNpZ25XLFxuICAgICAgICAgICAgICAgIGNvbnRlbnRXID0gY29udGFpbmVyVywgY29udGVudEggPSBjb250YWluZXJIO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYnVpbGRSZXN1bHQoY29udGFpbmVyVywgY29udGFpbmVySCwgY29udGVudFcsIGNvbnRlbnRILCBzY2FsZSwgc2NhbGUpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbi8vIEFsaWFzOiBTdHJhdGVneSB0byBzY2FsZSB0aGUgY29udGVudCdzIHNpemUgdG8gY29udGFpbmVyJ3Mgc2l6ZSwgbm9uIHByb3BvcnRpb25hbFxuICAgIGNjLkNvbnRlbnRTdHJhdGVneS5FWEFDVF9GSVQgPSBuZXcgRXhhY3RGaXQoKTtcbi8vIEFsaWFzOiBTdHJhdGVneSB0byBzY2FsZSB0aGUgY29udGVudCdzIHNpemUgcHJvcG9ydGlvbmFsbHkgdG8gbWF4aW11bSBzaXplIGFuZCBrZWVwcyB0aGUgd2hvbGUgY29udGVudCBhcmVhIHRvIGJlIHZpc2libGVcbiAgICBjYy5Db250ZW50U3RyYXRlZ3kuU0hPV19BTEwgPSBuZXcgU2hvd0FsbCgpO1xuLy8gQWxpYXM6IFN0cmF0ZWd5IHRvIHNjYWxlIHRoZSBjb250ZW50J3Mgc2l6ZSBwcm9wb3J0aW9uYWxseSB0byBmaWxsIHRoZSB3aG9sZSBjb250YWluZXIgYXJlYVxuICAgIGNjLkNvbnRlbnRTdHJhdGVneS5OT19CT1JERVIgPSBuZXcgTm9Cb3JkZXIoKTtcbi8vIEFsaWFzOiBTdHJhdGVneSB0byBzY2FsZSB0aGUgY29udGVudCdzIGhlaWdodCB0byBjb250YWluZXIncyBoZWlnaHQgYW5kIHByb3BvcnRpb25hbGx5IHNjYWxlIGl0cyB3aWR0aFxuICAgIGNjLkNvbnRlbnRTdHJhdGVneS5GSVhFRF9IRUlHSFQgPSBuZXcgRml4ZWRIZWlnaHQoKTtcbi8vIEFsaWFzOiBTdHJhdGVneSB0byBzY2FsZSB0aGUgY29udGVudCdzIHdpZHRoIHRvIGNvbnRhaW5lcidzIHdpZHRoIGFuZCBwcm9wb3J0aW9uYWxseSBzY2FsZSBpdHMgaGVpZ2h0XG4gICAgY2MuQ29udGVudFN0cmF0ZWd5LkZJWEVEX1dJRFRIID0gbmV3IEZpeGVkV2lkdGgoKTtcblxufSkoKTtcblxuLyoqXG4gKiA8cD5jYy5SZXNvbHV0aW9uUG9saWN5IGNsYXNzIGlzIHRoZSByb290IHN0cmF0ZWd5IGNsYXNzIG9mIHNjYWxlIHN0cmF0ZWd5LFxuICogaXRzIG1haW4gdGFzayBpcyB0byBtYWludGFpbiB0aGUgY29tcGF0aWJpbGl0eSB3aXRoIENvY29zMmQteDwvcD5cbiAqXG4gKiBAY2xhc3MgUmVzb2x1dGlvblBvbGljeVxuICovXG4vKipcbiAqIEBtZXRob2QgY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7Q29udGFpbmVyU3RyYXRlZ3l9IGNvbnRhaW5lclN0ZyBUaGUgY29udGFpbmVyIHN0cmF0ZWd5XG4gKiBAcGFyYW0ge0NvbnRlbnRTdHJhdGVneX0gY29udGVudFN0ZyBUaGUgY29udGVudCBzdHJhdGVneVxuICovXG5jYy5SZXNvbHV0aW9uUG9saWN5ID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6IFwiY2MuUmVzb2x1dGlvblBvbGljeVwiLFxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdG9yIG9mIGNjLlJlc29sdXRpb25Qb2xpY3lcbiAgICAgKiBAcGFyYW0ge0NvbnRhaW5lclN0cmF0ZWd5fSBjb250YWluZXJTdGdcbiAgICAgKiBAcGFyYW0ge0NvbnRlbnRTdHJhdGVneX0gY29udGVudFN0Z1xuICAgICAqL1xuICAgIGN0b3I6IGZ1bmN0aW9uIChjb250YWluZXJTdGcsIGNvbnRlbnRTdGcpIHtcbiAgICAgICAgdGhpcy5fY29udGFpbmVyU3RyYXRlZ3kgPSBudWxsO1xuICAgICAgICB0aGlzLl9jb250ZW50U3RyYXRlZ3kgPSBudWxsO1xuICAgICAgICB0aGlzLnNldENvbnRhaW5lclN0cmF0ZWd5KGNvbnRhaW5lclN0Zyk7XG4gICAgICAgIHRoaXMuc2V0Q29udGVudFN0cmF0ZWd5KGNvbnRlbnRTdGcpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIE1hbmlwdWxhdGlvbiBiZWZvcmUgYXBwbHlpbmcgdGhlIHJlc29sdXRpb24gcG9saWN5XG4gICAgICogISN6aCDnrZbnlaXlupTnlKjliY3nmoTmk43kvZxcbiAgICAgKiBAbWV0aG9kIHByZUFwcGx5XG4gICAgICogQHBhcmFtIHtWaWV3fSB2aWV3IFRoZSB0YXJnZXQgdmlld1xuICAgICAqL1xuICAgIHByZUFwcGx5OiBmdW5jdGlvbiAodmlldykge1xuICAgICAgICB0aGlzLl9jb250YWluZXJTdHJhdGVneS5wcmVBcHBseSh2aWV3KTtcbiAgICAgICAgdGhpcy5fY29udGVudFN0cmF0ZWd5LnByZUFwcGx5KHZpZXcpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEZ1bmN0aW9uIHRvIGFwcGx5IHRoaXMgcmVzb2x1dGlvbiBwb2xpY3lcbiAgICAgKiBUaGUgcmV0dXJuIHZhbHVlIGlzIHtzY2FsZTogW3NjYWxlWCwgc2NhbGVZXSwgdmlld3BvcnQ6IHtjYy5SZWN0fX0sXG4gICAgICogVGhlIHRhcmdldCB2aWV3IGNhbiB0aGVuIGFwcGx5IHRoZXNlIHZhbHVlIHRvIGl0c2VsZiwgaXQncyBwcmVmZXJyZWQgbm90IHRvIG1vZGlmeSBkaXJlY3RseSBpdHMgcHJpdmF0ZSB2YXJpYWJsZXNcbiAgICAgKiAhI3poIOiwg+eUqOetlueVpeaWueazlVxuICAgICAqIEBtZXRob2QgYXBwbHlcbiAgICAgKiBAcGFyYW0ge1ZpZXd9IHZpZXcgLSBUaGUgdGFyZ2V0IHZpZXdcbiAgICAgKiBAcGFyYW0ge1NpemV9IGRlc2lnbmVkUmVzb2x1dGlvbiAtIFRoZSB1c2VyIGRlZmluZWQgZGVzaWduIHJlc29sdXRpb25cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEFuIG9iamVjdCBjb250YWlucyB0aGUgc2NhbGUgWC9ZIHZhbHVlcyBhbmQgdGhlIHZpZXdwb3J0IHJlY3RcbiAgICAgKi9cbiAgICBhcHBseTogZnVuY3Rpb24gKHZpZXcsIGRlc2lnbmVkUmVzb2x1dGlvbikge1xuICAgICAgICB0aGlzLl9jb250YWluZXJTdHJhdGVneS5hcHBseSh2aWV3LCBkZXNpZ25lZFJlc29sdXRpb24pO1xuICAgICAgICByZXR1cm4gdGhpcy5fY29udGVudFN0cmF0ZWd5LmFwcGx5KHZpZXcsIGRlc2lnbmVkUmVzb2x1dGlvbik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gTWFuaXB1bGF0aW9uIGFmdGVyIGFwcHlsaW5nIHRoZSBzdHJhdGVneVxuICAgICAqICEjemgg562W55Wl5bqU55So5LmL5ZCO55qE5pON5L2cXG4gICAgICogQG1ldGhvZCBwb3N0QXBwbHlcbiAgICAgKiBAcGFyYW0ge1ZpZXd9IHZpZXcgLSBUaGUgdGFyZ2V0IHZpZXdcbiAgICAgKi9cbiAgICBwb3N0QXBwbHk6IGZ1bmN0aW9uICh2aWV3KSB7XG4gICAgICAgIHRoaXMuX2NvbnRhaW5lclN0cmF0ZWd5LnBvc3RBcHBseSh2aWV3KTtcbiAgICAgICAgdGhpcy5fY29udGVudFN0cmF0ZWd5LnBvc3RBcHBseSh2aWV3KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNldHVwIHRoZSBjb250YWluZXIncyBzY2FsZSBzdHJhdGVneVxuICAgICAqICEjemgg6K6+572u5a655Zmo55qE6YCC6YWN562W55WlXG4gICAgICogQG1ldGhvZCBzZXRDb250YWluZXJTdHJhdGVneVxuICAgICAqIEBwYXJhbSB7Q29udGFpbmVyU3RyYXRlZ3l9IGNvbnRhaW5lclN0Z1xuICAgICAqL1xuICAgIHNldENvbnRhaW5lclN0cmF0ZWd5OiBmdW5jdGlvbiAoY29udGFpbmVyU3RnKSB7XG4gICAgICAgIGlmIChjb250YWluZXJTdGcgaW5zdGFuY2VvZiBjYy5Db250YWluZXJTdHJhdGVneSlcbiAgICAgICAgICAgIHRoaXMuX2NvbnRhaW5lclN0cmF0ZWd5ID0gY29udGFpbmVyU3RnO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogU2V0dXAgdGhlIGNvbnRlbnQncyBzY2FsZSBzdHJhdGVneVxuICAgICAqICEjemgg6K6+572u5YaF5a6555qE6YCC6YWN562W55WlXG4gICAgICogQG1ldGhvZCBzZXRDb250ZW50U3RyYXRlZ3lcbiAgICAgKiBAcGFyYW0ge0NvbnRlbnRTdHJhdGVneX0gY29udGVudFN0Z1xuICAgICAqL1xuICAgIHNldENvbnRlbnRTdHJhdGVneTogZnVuY3Rpb24gKGNvbnRlbnRTdGcpIHtcbiAgICAgICAgaWYgKGNvbnRlbnRTdGcgaW5zdGFuY2VvZiBjYy5Db250ZW50U3RyYXRlZ3kpXG4gICAgICAgICAgICB0aGlzLl9jb250ZW50U3RyYXRlZ3kgPSBjb250ZW50U3RnO1xuICAgIH1cbn0pO1xuXG5qcy5nZXQoY2MuUmVzb2x1dGlvblBvbGljeS5wcm90b3R5cGUsIFwiY2FudmFzU2l6ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNjLnYyKGNjLmdhbWUuY2FudmFzLndpZHRoLCBjYy5nYW1lLmNhbnZhcy5oZWlnaHQpO1xufSk7XG5cbi8qKlxuICogVGhlIGVudGlyZSBhcHBsaWNhdGlvbiBpcyB2aXNpYmxlIGluIHRoZSBzcGVjaWZpZWQgYXJlYSB3aXRob3V0IHRyeWluZyB0byBwcmVzZXJ2ZSB0aGUgb3JpZ2luYWwgYXNwZWN0IHJhdGlvLjxici8+XG4gKiBEaXN0b3J0aW9uIGNhbiBvY2N1ciwgYW5kIHRoZSBhcHBsaWNhdGlvbiBtYXkgYXBwZWFyIHN0cmV0Y2hlZCBvciBjb21wcmVzc2VkLlxuICogQHByb3BlcnR5IHtOdW1iZXJ9IEVYQUNUX0ZJVFxuICogQHJlYWRvbmx5XG4gKiBAc3RhdGljXG4gKi9cbmNjLlJlc29sdXRpb25Qb2xpY3kuRVhBQ1RfRklUID0gMDtcblxuLyoqXG4gKiBUaGUgZW50aXJlIGFwcGxpY2F0aW9uIGZpbGxzIHRoZSBzcGVjaWZpZWQgYXJlYSwgd2l0aG91dCBkaXN0b3J0aW9uIGJ1dCBwb3NzaWJseSB3aXRoIHNvbWUgY3JvcHBpbmcsPGJyLz5cbiAqIHdoaWxlIG1haW50YWluaW5nIHRoZSBvcmlnaW5hbCBhc3BlY3QgcmF0aW8gb2YgdGhlIGFwcGxpY2F0aW9uLlxuICogQHByb3BlcnR5IHtOdW1iZXJ9IE5PX0JPUkRFUlxuICogQHJlYWRvbmx5XG4gKiBAc3RhdGljXG4gKi9cbmNjLlJlc29sdXRpb25Qb2xpY3kuTk9fQk9SREVSID0gMTtcblxuLyoqXG4gKiBUaGUgZW50aXJlIGFwcGxpY2F0aW9uIGlzIHZpc2libGUgaW4gdGhlIHNwZWNpZmllZCBhcmVhIHdpdGhvdXQgZGlzdG9ydGlvbiB3aGlsZSBtYWludGFpbmluZyB0aGUgb3JpZ2luYWw8YnIvPlxuICogYXNwZWN0IHJhdGlvIG9mIHRoZSBhcHBsaWNhdGlvbi4gQm9yZGVycyBjYW4gYXBwZWFyIG9uIHR3byBzaWRlcyBvZiB0aGUgYXBwbGljYXRpb24uXG4gKiBAcHJvcGVydHkge051bWJlcn0gU0hPV19BTExcbiAqIEByZWFkb25seVxuICogQHN0YXRpY1xuICovXG5jYy5SZXNvbHV0aW9uUG9saWN5LlNIT1dfQUxMID0gMjtcblxuLyoqXG4gKiBUaGUgYXBwbGljYXRpb24gdGFrZXMgdGhlIGhlaWdodCBvZiB0aGUgZGVzaWduIHJlc29sdXRpb24gc2l6ZSBhbmQgbW9kaWZpZXMgdGhlIHdpZHRoIG9mIHRoZSBpbnRlcm5hbDxici8+XG4gKiBjYW52YXMgc28gdGhhdCBpdCBmaXRzIHRoZSBhc3BlY3QgcmF0aW8gb2YgdGhlIGRldmljZTxici8+XG4gKiBubyBkaXN0b3J0aW9uIHdpbGwgb2NjdXIgaG93ZXZlciB5b3UgbXVzdCBtYWtlIHN1cmUgeW91ciBhcHBsaWNhdGlvbiB3b3JrcyBvbiBkaWZmZXJlbnQ8YnIvPlxuICogYXNwZWN0IHJhdGlvc1xuICogQHByb3BlcnR5IHtOdW1iZXJ9IEZJWEVEX0hFSUdIVFxuICogQHJlYWRvbmx5XG4gKiBAc3RhdGljXG4gKi9cbmNjLlJlc29sdXRpb25Qb2xpY3kuRklYRURfSEVJR0hUID0gMztcblxuLyoqXG4gKiBUaGUgYXBwbGljYXRpb24gdGFrZXMgdGhlIHdpZHRoIG9mIHRoZSBkZXNpZ24gcmVzb2x1dGlvbiBzaXplIGFuZCBtb2RpZmllcyB0aGUgaGVpZ2h0IG9mIHRoZSBpbnRlcm5hbDxici8+XG4gKiBjYW52YXMgc28gdGhhdCBpdCBmaXRzIHRoZSBhc3BlY3QgcmF0aW8gb2YgdGhlIGRldmljZTxici8+XG4gKiBubyBkaXN0b3J0aW9uIHdpbGwgb2NjdXIgaG93ZXZlciB5b3UgbXVzdCBtYWtlIHN1cmUgeW91ciBhcHBsaWNhdGlvbiB3b3JrcyBvbiBkaWZmZXJlbnQ8YnIvPlxuICogYXNwZWN0IHJhdGlvc1xuICogQHByb3BlcnR5IHtOdW1iZXJ9IEZJWEVEX1dJRFRIXG4gKiBAcmVhZG9ubHlcbiAqIEBzdGF0aWNcbiAqL1xuY2MuUmVzb2x1dGlvblBvbGljeS5GSVhFRF9XSURUSCA9IDQ7XG5cbi8qKlxuICogVW5rbm93IHBvbGljeVxuICogQHByb3BlcnR5IHtOdW1iZXJ9IFVOS05PV05cbiAqIEByZWFkb25seVxuICogQHN0YXRpY1xuICovXG5jYy5SZXNvbHV0aW9uUG9saWN5LlVOS05PV04gPSA1O1xuXG4vKipcbiAqIEBtb2R1bGUgY2NcbiAqL1xuXG4vKipcbiAqICEjZW4gY2MudmlldyBpcyB0aGUgc2hhcmVkIHZpZXcgb2JqZWN0LlxuICogISN6aCBjYy52aWV3IOaYr+WFqOWxgOeahOinhuWbvuWvueixoeOAglxuICogQHByb3BlcnR5IHZpZXdcbiAqIEBzdGF0aWNcbiAqIEB0eXBlIHtWaWV3fVxuICovXG5jYy52aWV3ID0gbmV3IFZpZXcoKTtcblxuLyoqXG4gKiAhI2VuIGNjLndpblNpemUgaXMgdGhlIGFsaWFzIG9iamVjdCBmb3IgdGhlIHNpemUgb2YgdGhlIGN1cnJlbnQgZ2FtZSB3aW5kb3cuXG4gKiAhI3poIGNjLndpblNpemUg5Li65b2T5YmN55qE5ri45oiP56qX5Y+j55qE5aSn5bCP44CCXG4gKiBAcHJvcGVydHkgd2luU2l6ZVxuICogQHR5cGUgU2l6ZVxuICovXG5jYy53aW5TaXplID0gY2Muc2l6ZSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNjLnZpZXc7XG4iXX0=