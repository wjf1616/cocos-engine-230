
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/CCSys.js';
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
var settingPlatform;

if (!CC_EDITOR) {
  settingPlatform = window._CCSettings ? _CCSettings.platform : undefined;
}

var isVivoGame = settingPlatform === 'qgame';
var isOppoGame = settingPlatform === 'quickgame';
var isHuaweiGame = settingPlatform === 'huawei';
var isJKWGame = settingPlatform === 'jkw-game';
var isQttGame = settingPlatform === 'qtt-game';

var _global = typeof window === 'undefined' ? global : window;

function initSys() {
  /**
   * System variables
   * @class sys
   * @main
   * @static
   */
  cc.sys = {};
  var sys = cc.sys;
  /**
   * English language code
   * @property {String} LANGUAGE_ENGLISH
   * @readOnly
   */

  sys.LANGUAGE_ENGLISH = "en";
  /**
   * Chinese language code
   * @property {String} LANGUAGE_CHINESE
   * @readOnly
   */

  sys.LANGUAGE_CHINESE = "zh";
  /**
   * French language code
   * @property {String} LANGUAGE_FRENCH
   * @readOnly
   */

  sys.LANGUAGE_FRENCH = "fr";
  /**
   * Italian language code
   * @property {String} LANGUAGE_ITALIAN
   * @readOnly
   */

  sys.LANGUAGE_ITALIAN = "it";
  /**
   * German language code
   * @property {String} LANGUAGE_GERMAN
   * @readOnly
   */

  sys.LANGUAGE_GERMAN = "de";
  /**
   * Spanish language code
   * @property {String} LANGUAGE_SPANISH
   * @readOnly
   */

  sys.LANGUAGE_SPANISH = "es";
  /**
   * Spanish language code
   * @property {String} LANGUAGE_DUTCH
   * @readOnly
   */

  sys.LANGUAGE_DUTCH = "du";
  /**
   * Russian language code
   * @property {String} LANGUAGE_RUSSIAN
   * @readOnly
   */

  sys.LANGUAGE_RUSSIAN = "ru";
  /**
   * Korean language code
   * @property {String} LANGUAGE_KOREAN
   * @readOnly
   */

  sys.LANGUAGE_KOREAN = "ko";
  /**
   * Japanese language code
   * @property {String} LANGUAGE_JAPANESE
   * @readOnly
   */

  sys.LANGUAGE_JAPANESE = "ja";
  /**
   * Hungarian language code
   * @property {String} LANGUAGE_HUNGARIAN
   * @readonly
   */

  sys.LANGUAGE_HUNGARIAN = "hu";
  /**
   * Portuguese language code
   * @property {String} LANGUAGE_PORTUGUESE
   * @readOnly
   */

  sys.LANGUAGE_PORTUGUESE = "pt";
  /**
   * Arabic language code
   * @property {String} LANGUAGE_ARABIC
   * @readOnly
   */

  sys.LANGUAGE_ARABIC = "ar";
  /**
   * Norwegian language code
   * @property {String} LANGUAGE_NORWEGIAN
   * @readOnly
   */

  sys.LANGUAGE_NORWEGIAN = "no";
  /**
   * Polish language code
   * @property {String} LANGUAGE_POLISH
   * @readOnly
   */

  sys.LANGUAGE_POLISH = "pl";
  /**
   * Turkish language code
   * @property {String} LANGUAGE_TURKISH
   * @readOnly
   */

  sys.LANGUAGE_TURKISH = "tr";
  /**
   * Ukrainian language code
   * @property {String} LANGUAGE_UKRAINIAN
   * @readOnly
   */

  sys.LANGUAGE_UKRAINIAN = "uk";
  /**
   * Romanian language code
   * @property {String} LANGUAGE_ROMANIAN
   * @readOnly
   */

  sys.LANGUAGE_ROMANIAN = "ro";
  /**
   * Bulgarian language code
   * @property {String} LANGUAGE_BULGARIAN
   * @readOnly
   */

  sys.LANGUAGE_BULGARIAN = "bg";
  /**
   * Unknown language code
   * @property {String} LANGUAGE_UNKNOWN
   * @readOnly
   */

  sys.LANGUAGE_UNKNOWN = "unknown";
  /**
   * @property {String} OS_IOS
   * @readOnly
   */

  sys.OS_IOS = "iOS";
  /**
   * @property {String} OS_ANDROID
   * @readOnly
   */

  sys.OS_ANDROID = "Android";
  /**
   * @property {String} OS_WINDOWS
   * @readOnly
   */

  sys.OS_WINDOWS = "Windows";
  /**
   * @property {String} OS_MARMALADE
   * @readOnly
   */

  sys.OS_MARMALADE = "Marmalade";
  /**
   * @property {String} OS_LINUX
   * @readOnly
   */

  sys.OS_LINUX = "Linux";
  /**
   * @property {String} OS_BADA
   * @readOnly
   */

  sys.OS_BADA = "Bada";
  /**
   * @property {String} OS_BLACKBERRY
   * @readOnly
   */

  sys.OS_BLACKBERRY = "Blackberry";
  /**
   * @property {String} OS_OSX
   * @readOnly
   */

  sys.OS_OSX = "OS X";
  /**
   * @property {String} OS_WP8
   * @readOnly
   */

  sys.OS_WP8 = "WP8";
  /**
   * @property {String} OS_WINRT
   * @readOnly
   */

  sys.OS_WINRT = "WINRT";
  /**
   * @property {String} OS_UNKNOWN
   * @readOnly
   */

  sys.OS_UNKNOWN = "Unknown";
  /**
   * @property {Number} UNKNOWN
   * @readOnly
   * @default -1
   */

  sys.UNKNOWN = -1;
  /**
   * @property {Number} WIN32
   * @readOnly
   * @default 0
   */

  sys.WIN32 = 0;
  /**
   * @property {Number} LINUX
   * @readOnly
   * @default 1
   */

  sys.LINUX = 1;
  /**
   * @property {Number} MACOS
   * @readOnly
   * @default 2
   */

  sys.MACOS = 2;
  /**
   * @property {Number} ANDROID
   * @readOnly
   * @default 3
   */

  sys.ANDROID = 3;
  /**
   * @property {Number} IPHONE
   * @readOnly
   * @default 4
   */

  sys.IPHONE = 4;
  /**
   * @property {Number} IPAD
   * @readOnly
   * @default 5
   */

  sys.IPAD = 5;
  /**
   * @property {Number} BLACKBERRY
   * @readOnly
   * @default 6
   */

  sys.BLACKBERRY = 6;
  /**
   * @property {Number} NACL
   * @readOnly
   * @default 7
   */

  sys.NACL = 7;
  /**
   * @property {Number} EMSCRIPTEN
   * @readOnly
   * @default 8
   */

  sys.EMSCRIPTEN = 8;
  /**
   * @property {Number} TIZEN
   * @readOnly
   * @default 9
   */

  sys.TIZEN = 9;
  /**
   * @property {Number} WINRT
   * @readOnly
   * @default 10
   */

  sys.WINRT = 10;
  /**
   * @property {Number} WP8
   * @readOnly
   * @default 11
   */

  sys.WP8 = 11;
  /**
   * @property {Number} MOBILE_BROWSER
   * @readOnly
   * @default 100
   */

  sys.MOBILE_BROWSER = 100;
  /**
   * @property {Number} DESKTOP_BROWSER
   * @readOnly
   * @default 101
   */

  sys.DESKTOP_BROWSER = 101;
  /**
   * Indicates whether executes in editor's window process (Electron's renderer context)
   * @property {Number} EDITOR_PAGE
   * @readOnly
   * @default 102
   */

  sys.EDITOR_PAGE = 102;
  /**
   * Indicates whether executes in editor's main process (Electron's browser context)
   * @property {Number} EDITOR_CORE
   * @readOnly
   * @default 103
   */

  sys.EDITOR_CORE = 103;
  /**
   * @property {Number} WECHAT_GAME
   * @readOnly
   * @default 104
   */

  sys.WECHAT_GAME = 104;
  /**
   * @property {Number} QQ_PLAY
   * @readOnly
   * @default 105
   */

  sys.QQ_PLAY = 105;
  /**
   * @property {Number} FB_PLAYABLE_ADS
   * @readOnly
   * @default 106
   */

  sys.FB_PLAYABLE_ADS = 106;
  /**
   * @property {Number} BAIDU_GAME
   * @readOnly
   * @default 107
   */

  sys.BAIDU_GAME = 107;
  /**
   * @property {Number} VIVO_GAME
   * @readOnly
   * @default 108
   */

  sys.VIVO_GAME = 108;
  /**
   * @property {Number} OPPO_GAME
   * @readOnly
   * @default 109
   */

  sys.OPPO_GAME = 109;
  /**
   * @property {Number} HUAWEI_GAME
   * @readOnly
   * @default 110
   */

  sys.HUAWEI_GAME = 110;
  /**
   * @property {Number} XIAOMI_GAME
   * @readOnly
   * @default 111
   */

  sys.XIAOMI_GAME = 111;
  /**
   * @property {Number} JKW_GAME
   * @readOnly
   * @default 112
   */

  sys.JKW_GAME = 112;
  /**
   * @property {Number} ALIPAY_GAME
   * @readOnly
   * @default 113
   */

  sys.ALIPAY_GAME = 113;
  /**
   * @property {Number} WECHAT_GAME_SUB
   * @readOnly
   * @default 114
   */

  sys.WECHAT_GAME_SUB = 114;
  /**
   * @property {Number} BAIDU_GAME_SUB
   * @readOnly
   * @default 115
   */

  sys.BAIDU_GAME_SUB = 115;
  /**
   * @property {Number} QTT_GAME
   * @readOnly
   * @default 116
   */

  sys.QTT_GAME = 116;
  /**
   * BROWSER_TYPE_WECHAT
   * @property {String} BROWSER_TYPE_WECHAT
   * @readOnly
   * @default "wechat"
   */

  sys.BROWSER_TYPE_WECHAT = "wechat";
  /**
   * BROWSER_TYPE_WECHAT_GAME
   * @property {String} BROWSER_TYPE_WECHAT_GAME
   * @readOnly
   * @default "wechatgame"
   */

  sys.BROWSER_TYPE_WECHAT_GAME = "wechatgame";
  /**
   * BROWSER_TYPE_WECHAT_GAME_SUB
   * @property {String} BROWSER_TYPE_WECHAT_GAME_SUB
   * @readOnly
   * @default "wechatgamesub"
   */

  sys.BROWSER_TYPE_WECHAT_GAME_SUB = "wechatgamesub";
  /**
   * BROWSER_TYPE_BAIDU_GAME
   * @property {String} BROWSER_TYPE_BAIDU_GAME
   * @readOnly
   * @default "baidugame"
   */

  sys.BROWSER_TYPE_BAIDU_GAME = "baidugame";
  /**
   * BROWSER_TYPE_BAIDU_GAME_SUB
   * @property {String} BROWSER_TYPE_BAIDU_GAME_SUB
   * @readOnly
   * @default "baidugamesub"
   */

  sys.BROWSER_TYPE_BAIDU_GAME_SUB = "baidugamesub";
  /**
   * BROWSER_TYPE_XIAOMI_GAME
   * @property {String} BROWSER_TYPE_XIAOMI_GAME
   * @readOnly
   * @default "xiaomigame"
   */

  sys.BROWSER_TYPE_XIAOMI_GAME = "xiaomigame";
  /**
   * BROWSER_TYPE_ALIPAY_GAME
   * @property {String} BROWSER_TYPE_ALIPAY_GAME
   * @readOnly
   * @default "alipaygame"
   */

  sys.BROWSER_TYPE_ALIPAY_GAME = "alipaygame";
  /**
   * BROWSER_TYPE_QQ_PLAY
   * @property {String} BROWSER_TYPE_QQ_PLAY
   * @readOnly
   * @default "qqplay"
   */

  sys.BROWSER_TYPE_QQ_PLAY = "qqplay";
  /**
   *
   * @property {String} BROWSER_TYPE_ANDROID
   * @readOnly
   * @default "androidbrowser"
   */

  sys.BROWSER_TYPE_ANDROID = "androidbrowser";
  /**
   *
   * @property {String} BROWSER_TYPE_IE
   * @readOnly
   * @default "ie"
   */

  sys.BROWSER_TYPE_IE = "ie";
  /**
   *
   * @property {String} BROWSER_TYPE_EDGE
   * @readOnly
   * @default "edge"
   */

  sys.BROWSER_TYPE_EDGE = "edge";
  /**
   *
   * @property {String} BROWSER_TYPE_QQ
   * @readOnly
   * @default "qqbrowser"
   */

  sys.BROWSER_TYPE_QQ = "qqbrowser";
  /**
   *
   * @property {String} BROWSER_TYPE_MOBILE_QQ
   * @readOnly
   * @default "mqqbrowser"
   */

  sys.BROWSER_TYPE_MOBILE_QQ = "mqqbrowser";
  /**
   *
   * @property {String} BROWSER_TYPE_UC
   * @readOnly
   * @default "ucbrowser"
   */

  sys.BROWSER_TYPE_UC = "ucbrowser";
  /**
   * uc third party integration.
   * @property {String} BROWSER_TYPE_UCBS
   * @readOnly
   * @default "ucbs"
   */

  sys.BROWSER_TYPE_UCBS = "ucbs";
  /**
   *
   * @property {String} BROWSER_TYPE_360
   * @readOnly
   * @default "360browser"
   */

  sys.BROWSER_TYPE_360 = "360browser";
  /**
   *
   * @property {String} BROWSER_TYPE_BAIDU_APP
   * @readOnly
   * @default "baiduboxapp"
   */

  sys.BROWSER_TYPE_BAIDU_APP = "baiduboxapp";
  /**
   *
   * @property {String} BROWSER_TYPE_BAIDU
   * @readOnly
   * @default "baidubrowser"
   */

  sys.BROWSER_TYPE_BAIDU = "baidubrowser";
  /**
   *
   * @property {String} BROWSER_TYPE_MAXTHON
   * @readOnly
   * @default "maxthon"
   */

  sys.BROWSER_TYPE_MAXTHON = "maxthon";
  /**
   *
   * @property {String} BROWSER_TYPE_OPERA
   * @readOnly
   * @default "opera"
   */

  sys.BROWSER_TYPE_OPERA = "opera";
  /**
   *
   * @property {String} BROWSER_TYPE_OUPENG
   * @readOnly
   * @default "oupeng"
   */

  sys.BROWSER_TYPE_OUPENG = "oupeng";
  /**
   *
   * @property {String} BROWSER_TYPE_MIUI
   * @readOnly
   * @default "miuibrowser"
   */

  sys.BROWSER_TYPE_MIUI = "miuibrowser";
  /**
   *
   * @property {String} BROWSER_TYPE_FIREFOX
   * @readOnly
   * @default "firefox"
   */

  sys.BROWSER_TYPE_FIREFOX = "firefox";
  /**
   *
   * @property {String} BROWSER_TYPE_SAFARI
   * @readOnly
   * @default "safari"
   */

  sys.BROWSER_TYPE_SAFARI = "safari";
  /**
   *
   * @property {String} BROWSER_TYPE_CHROME
   * @readOnly
   * @default "chrome"
   */

  sys.BROWSER_TYPE_CHROME = "chrome";
  /**
   *
   * @property {String} BROWSER_TYPE_LIEBAO
   * @readOnly
   * @default "liebao"
   */

  sys.BROWSER_TYPE_LIEBAO = "liebao";
  /**
   *
   * @property {String} BROWSER_TYPE_QZONE
   * @readOnly
   * @default "qzone"
   */

  sys.BROWSER_TYPE_QZONE = "qzone";
  /**
   *
   * @property {String} BROWSER_TYPE_SOUGOU
   * @readOnly
   * @default "sogou"
   */

  sys.BROWSER_TYPE_SOUGOU = "sogou";
  /**
   *
   * @property {String} BROWSER_TYPE_UNKNOWN
   * @readOnly
   * @default "unknown"
   */

  sys.BROWSER_TYPE_UNKNOWN = "unknown";
  /**
   * Is native ? This is set to be true in jsb auto.
   * @property {Boolean} isNative
   */

  sys.isNative = CC_JSB || CC_RUNTIME;
  /**
   * Is web browser ?
   * @property {Boolean} isBrowser
   */

  sys.isBrowser = typeof window === 'object' && typeof document === 'object' && !CC_JSB && !CC_RUNTIME;
  /**
   * Is webgl extension support?
   * @method glExtension
   * @param name
   */

  sys.glExtension = function (name) {
    return !!cc.renderer.device.ext(name);
  };
  /**
   * Get max joint matrix size for skinned mesh renderer.
   * @method getMaxJointMatrixSize
   */


  sys.getMaxJointMatrixSize = function () {
    if (!sys._maxJointMatrixSize) {
      var JOINT_MATRICES_SIZE = 50;
      var LEFT_UNIFORM_SIZE = 10;
      var gl = cc.game._renderContext;
      var maxUniforms = Math.floor(gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS) / 4) - LEFT_UNIFORM_SIZE;

      if (maxUniforms < JOINT_MATRICES_SIZE) {
        sys._maxJointMatrixSize = 0;
      } else {
        sys._maxJointMatrixSize = JOINT_MATRICES_SIZE;
      }
    }

    return sys._maxJointMatrixSize;
  };

  if (_global.__globalAdapter && _global.__globalAdapter.adaptSys) {
    // init sys info in adapter
    _global.__globalAdapter.adaptSys(sys);
  } else if (CC_EDITOR && Editor.isMainProcess) {
    sys.isMobile = false;
    sys.platform = sys.EDITOR_CORE;
    sys.language = sys.LANGUAGE_UNKNOWN;
    sys.languageCode = undefined;
    sys.os = {
      darwin: sys.OS_OSX,
      win32: sys.OS_WINDOWS,
      linux: sys.OS_LINUX
    }[process.platform] || sys.OS_UNKNOWN;
    sys.browserType = null;
    sys.browserVersion = null;
    sys.windowPixelResolution = {
      width: 0,
      height: 0
    };
    sys.__audioSupport = {};
  } else if (CC_JSB || CC_RUNTIME) {
    var platform;

    if (isVivoGame) {
      platform = sys.VIVO_GAME;
    } else if (isOppoGame) {
      platform = sys.OPPO_GAME;
    } else if (isHuaweiGame) {
      platform = sys.HUAWEI_GAME;
    } else if (isJKWGame) {
      platform = sys.JKW_GAME;
    } else if (isQttGame) {
      platform = sys.QTT_GAME;
    } else {
      platform = __getPlatform();
    }

    sys.platform = platform;
    sys.isMobile = platform === sys.ANDROID || platform === sys.IPAD || platform === sys.IPHONE || platform === sys.WP8 || platform === sys.TIZEN || platform === sys.BLACKBERRY || platform === sys.XIAOMI_GAME || isVivoGame || isOppoGame || isHuaweiGame || isJKWGame || isQttGame;
    sys.os = __getOS();
    sys.language = __getCurrentLanguage();
    var languageCode;

    if (CC_JSB) {
      languageCode = __getCurrentLanguageCode();
    }

    sys.languageCode = languageCode ? languageCode.toLowerCase() : undefined;
    sys.osVersion = __getOSVersion();
    sys.osMainVersion = parseInt(sys.osVersion);
    sys.browserType = null;
    sys.browserVersion = null;
    var w = window.innerWidth;
    var h = window.innerHeight;
    var ratio = window.devicePixelRatio || 1;
    sys.windowPixelResolution = {
      width: ratio * w,
      height: ratio * h
    };
    sys.localStorage = window.localStorage;
    var capabilities;
    capabilities = sys.capabilities = {
      "canvas": false,
      "opengl": true,
      "webp": true
    };

    if (sys.isMobile) {
      capabilities["accelerometer"] = true;
      capabilities["touches"] = true;
    } else {
      // desktop
      capabilities["keyboard"] = true;
      capabilities["mouse"] = true;
      capabilities["touches"] = false;
    }

    sys.__audioSupport = {
      ONLY_ONE: false,
      WEB_AUDIO: false,
      DELAY_CREATE_CTX: false,
      format: ['.mp3']
    };
  } else {
    // browser or runtime
    var win = window,
        nav = win.navigator,
        doc = document,
        docEle = doc.documentElement;
    var ua = nav.userAgent.toLowerCase();

    if (CC_EDITOR) {
      sys.isMobile = false;
      sys.platform = sys.EDITOR_PAGE;
    } else {
      /**
       * Indicate whether system is mobile system
       * @property {Boolean} isMobile
       */
      sys.isMobile = /mobile|android|iphone|ipad/.test(ua);
      /**
       * Indicate the running platform
       * @property {Number} platform
       */

      if (typeof FbPlayableAd !== "undefined") {
        sys.platform = sys.FB_PLAYABLE_ADS;
      } else {
        sys.platform = sys.isMobile ? sys.MOBILE_BROWSER : sys.DESKTOP_BROWSER;
      }
    }

    var currLanguage = nav.language;
    currLanguage = currLanguage ? currLanguage : nav.browserLanguage;
    /**
     * Get current language iso 639-1 code.
     * Examples of valid language codes include "zh-tw", "en", "en-us", "fr", "fr-fr", "es-es", etc.
     * The actual value totally depends on results provided by destination platform.
     * @property {String} languageCode
     */

    sys.languageCode = currLanguage.toLowerCase();
    currLanguage = currLanguage ? currLanguage.split("-")[0] : sys.LANGUAGE_ENGLISH;
    /**
     * Indicate the current language of the running system
     * @property {String} language
     */

    sys.language = currLanguage; // Get the os of system

    var isAndroid = false,
        iOS = false,
        osVersion = '',
        osMainVersion = 0;
    var uaResult = /android (\d+(?:\.\d+)*)/i.exec(ua) || /android (\d+(?:\.\d+)*)/i.exec(nav.platform);

    if (uaResult) {
      isAndroid = true;
      osVersion = uaResult[1] || '';
      osMainVersion = parseInt(osVersion) || 0;
    }

    uaResult = /(iPad|iPhone|iPod).*OS ((\d+_?){2,3})/i.exec(ua);

    if (uaResult) {
      iOS = true;
      osVersion = uaResult[2] || '';
      osMainVersion = parseInt(osVersion) || 0;
    } // refer to https://github.com/cocos-creator/engine/pull/5542 , thanks for contribition from @krapnikkk
    // ipad OS 13 safari identifies itself as "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko)" 
    // so use maxTouchPoints to check whether it's desktop safari or not. 
    // reference: https://stackoverflow.com/questions/58019463/how-to-detect-device-name-in-safari-on-ios-13-while-it-doesnt-show-the-correct
    // FIXME: should remove it when touch-enabled macs are available
    else if (/(iPhone|iPad|iPod)/.exec(nav.platform) || nav.platform === 'MacIntel' && nav.maxTouchPoints && nav.maxTouchPoints > 1) {
        iOS = true;
        osVersion = '';
        osMainVersion = 0;
      }

    var osName = sys.OS_UNKNOWN;
    if (nav.appVersion.indexOf("Win") !== -1) osName = sys.OS_WINDOWS;else if (iOS) osName = sys.OS_IOS;else if (nav.appVersion.indexOf("Mac") !== -1) osName = sys.OS_OSX;else if (nav.appVersion.indexOf("X11") !== -1 && nav.appVersion.indexOf("Linux") === -1) osName = sys.OS_UNIX;else if (isAndroid) osName = sys.OS_ANDROID;else if (nav.appVersion.indexOf("Linux") !== -1 || ua.indexOf("ubuntu") !== -1) osName = sys.OS_LINUX;
    /**
     * Indicate the running os name
     * @property {String} os
     */

    sys.os = osName;
    /**
     * Indicate the running os version
     * @property {String} osVersion
     */

    sys.osVersion = osVersion;
    /**
     * Indicate the running os main version
     * @property {Number} osMainVersion
     */

    sys.osMainVersion = osMainVersion;
    /**
     * Indicate the running browser type
     * @property {String} browserType
     */

    sys.browserType = sys.BROWSER_TYPE_UNKNOWN;
    /* Determine the browser type */

    (function () {
      var typeReg1 = /mqqbrowser|micromessenger|qqbrowser|sogou|qzone|liebao|maxthon|ucbs|360 aphone|360browser|baiduboxapp|baidubrowser|maxthon|mxbrowser|miuibrowser/i;
      var typeReg2 = /qq|ucbrowser|ubrowser|edge/i;
      var typeReg3 = /chrome|safari|firefox|trident|opera|opr\/|oupeng/i;
      var browserTypes = typeReg1.exec(ua) || typeReg2.exec(ua) || typeReg3.exec(ua);
      var browserType = browserTypes ? browserTypes[0].toLowerCase() : sys.BROWSER_TYPE_UNKNOWN;
      if (browserType === "safari" && isAndroid) browserType = sys.BROWSER_TYPE_ANDROID;else if (browserType === "qq" && ua.match(/android.*applewebkit/i)) browserType = sys.BROWSER_TYPE_ANDROID;
      var typeMap = {
        'micromessenger': sys.BROWSER_TYPE_WECHAT,
        'trident': sys.BROWSER_TYPE_IE,
        'edge': sys.BROWSER_TYPE_EDGE,
        '360 aphone': sys.BROWSER_TYPE_360,
        'mxbrowser': sys.BROWSER_TYPE_MAXTHON,
        'opr/': sys.BROWSER_TYPE_OPERA,
        'ubrowser': sys.BROWSER_TYPE_UC
      };
      sys.browserType = typeMap[browserType] || browserType;
    })();
    /**
     * Indicate the running browser version
     * @property {String} browserVersion
     */


    sys.browserVersion = "";
    /* Determine the browser version number */

    (function () {
      var versionReg1 = /(mqqbrowser|micromessenger|qqbrowser|sogou|qzone|liebao|maxthon|uc|ucbs|360 aphone|360|baiduboxapp|baidu|maxthon|mxbrowser|miui(?:.hybrid)?)(mobile)?(browser)?\/?([\d.]+)/i;
      var versionReg2 = /(qq|chrome|safari|firefox|trident|opera|opr\/|oupeng)(mobile)?(browser)?\/?([\d.]+)/i;
      var tmp = ua.match(versionReg1);
      if (!tmp) tmp = ua.match(versionReg2);
      sys.browserVersion = tmp ? tmp[4] : "";
    })();

    var w = window.innerWidth || document.documentElement.clientWidth;
    var h = window.innerHeight || document.documentElement.clientHeight;
    var ratio = window.devicePixelRatio || 1;
    /**
     * Indicate the real pixel resolution of the whole game window
     * @property {Size} windowPixelResolution
     */

    sys.windowPixelResolution = {
      width: ratio * w,
      height: ratio * h
    };

    sys._checkWebGLRenderMode = function () {
      if (cc.game.renderType !== cc.game.RENDER_TYPE_WEBGL) throw new Error("This feature supports WebGL render mode only.");
    };

    var _tmpCanvas1 = document.createElement("canvas");

    var create3DContext = function create3DContext(canvas, opt_attribs, opt_contextType) {
      if (opt_contextType) {
        try {
          return canvas.getContext(opt_contextType, opt_attribs);
        } catch (e) {
          return null;
        }
      } else {
        return create3DContext(canvas, opt_attribs, "webgl") || create3DContext(canvas, opt_attribs, "experimental-webgl") || create3DContext(canvas, opt_attribs, "webkit-3d") || create3DContext(canvas, opt_attribs, "moz-webgl") || null;
      }
    };
    /**
     * cc.sys.localStorage is a local storage component.
     * @property {Object} localStorage
     */


    try {
      var localStorage = sys.localStorage = win.localStorage;
      localStorage.setItem("storage", "");
      localStorage.removeItem("storage");
      localStorage = null;
    } catch (e) {
      var warn = function warn() {
        cc.warnID(5200);
      };

      sys.localStorage = {
        getItem: warn,
        setItem: warn,
        removeItem: warn,
        clear: warn
      };
    }

    var _supportWebp = _tmpCanvas1.toDataURL('image/webp').startsWith('data:image/webp');

    var _supportCanvas = !!_tmpCanvas1.getContext("2d");

    var _supportWebGL = false;

    if (CC_TEST) {
      _supportWebGL = false;
    } else if (win.WebGLRenderingContext) {
      _supportWebGL = true;
    }
    /**
     * The capabilities of the current platform
     * @property {Object} capabilities
     */


    var capabilities = sys.capabilities = {
      "canvas": _supportCanvas,
      "opengl": _supportWebGL,
      "webp": _supportWebp
    };
    if (docEle['ontouchstart'] !== undefined || doc['ontouchstart'] !== undefined || nav.msPointerEnabled) capabilities["touches"] = true;
    if (docEle['onmouseup'] !== undefined) capabilities["mouse"] = true;
    if (docEle['onkeyup'] !== undefined) capabilities["keyboard"] = true;
    if (win.DeviceMotionEvent || win.DeviceOrientationEvent) capabilities["accelerometer"] = true;

    var __audioSupport;
    /**
     * Audio support in the browser
     *
     * MULTI_CHANNEL        : Multiple audio while playing - If it doesn't, you can only play background music
     * WEB_AUDIO            : Support for WebAudio - Support W3C WebAudio standards, all of the audio can be played
     * AUTOPLAY             : Supports auto-play audio - if Don‘t support it, On a touch detecting background music canvas, and then replay
     * REPLAY_AFTER_TOUCH   : The first music will fail, must be replay after touchstart
     * USE_EMPTIED_EVENT    : Whether to use the emptied event to replace load callback
     * DELAY_CREATE_CTX     : delay created the context object - only webAudio
     * NEED_MANUAL_LOOP     : loop attribute failure, need to perform loop manually
     *
     * May be modifications for a few browser version
     */


    (function () {
      var DEBUG = false;
      var version = sys.browserVersion; // check if browser supports Web Audio
      // check Web Audio's context

      var supportWebAudio = !!(window.AudioContext || window.webkitAudioContext || window.mozAudioContext);
      __audioSupport = {
        ONLY_ONE: false,
        WEB_AUDIO: supportWebAudio,
        DELAY_CREATE_CTX: false
      };

      if (sys.os === sys.OS_IOS) {
        // IOS no event that used to parse completed callback
        // this time is not complete, can not play
        //
        __audioSupport.USE_LOADER_EVENT = 'loadedmetadata';
      }

      if (sys.browserType === sys.BROWSER_TYPE_FIREFOX) {
        __audioSupport.DELAY_CREATE_CTX = true;
        __audioSupport.USE_LOADER_EVENT = 'canplay';
      }

      if (sys.os === sys.OS_ANDROID) {
        if (sys.browserType === sys.BROWSER_TYPE_UC) {
          __audioSupport.ONE_SOURCE = true;
        }
      }

      if (DEBUG) {
        setTimeout(function () {
          cc.log('browse type: ' + sys.browserType);
          cc.log('browse version: ' + version);
          cc.log('MULTI_CHANNEL: ' + __audioSupport.MULTI_CHANNEL);
          cc.log('WEB_AUDIO: ' + __audioSupport.WEB_AUDIO);
          cc.log('AUTOPLAY: ' + __audioSupport.AUTOPLAY);
        }, 0);
      }
    })();

    try {
      if (__audioSupport.WEB_AUDIO) {
        __audioSupport.context = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)();

        if (__audioSupport.DELAY_CREATE_CTX) {
          setTimeout(function () {
            __audioSupport.context = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)();
          }, 0);
        }
      }
    } catch (error) {
      __audioSupport.WEB_AUDIO = false;
      cc.logID(5201);
    }

    var formatSupport = [];

    (function () {
      var audio = document.createElement('audio');

      if (audio.canPlayType) {
        var ogg = audio.canPlayType('audio/ogg; codecs="vorbis"');
        if (ogg) formatSupport.push('.ogg');
        var mp3 = audio.canPlayType('audio/mpeg');
        if (mp3) formatSupport.push('.mp3');
        var wav = audio.canPlayType('audio/wav; codecs="1"');
        if (wav) formatSupport.push('.wav');
        var mp4 = audio.canPlayType('audio/mp4');
        if (mp4) formatSupport.push('.mp4');
        var m4a = audio.canPlayType('audio/x-m4a');
        if (m4a) formatSupport.push('.m4a');
      }
    })();

    __audioSupport.format = formatSupport;
    sys.__audioSupport = __audioSupport;
  }
  /**
   * !#en
   * Network type enumeration
   * !#zh
   * 网络类型枚举
   *
   * @enum sys.NetworkType
   */


  sys.NetworkType = {
    /**
     * !#en
     * Network is unreachable.
     * !#zh
     * 网络不通
     *
     * @property {Number} NONE
     */
    NONE: 0,

    /**
     * !#en
     * Network is reachable via WiFi or cable.
     * !#zh
     * 通过无线或者有线本地网络连接因特网
     *
     * @property {Number} LAN
     */
    LAN: 1,

    /**
     * !#en
     * Network is reachable via Wireless Wide Area Network
     * !#zh
     * 通过蜂窝移动网络连接因特网
     *
     * @property {Number} WWAN
     */
    WWAN: 2
  };
  /**
   * @class sys
   */

  /**
   * !#en
   * Get the network type of current device, return cc.sys.NetworkType.LAN if failure.
   * !#zh
   * 获取当前设备的网络类型, 如果网络类型无法获取，默认将返回 cc.sys.NetworkType.LAN
   *
   * @method getNetworkType
   * @return {NetworkType}
   */

  sys.getNetworkType = function () {
    // TODO: need to implement this for mobile phones.
    return sys.NetworkType.LAN;
  };
  /**
   * !#en
   * Get the battery level of current device, return 1.0 if failure.
   * !#zh
   * 获取当前设备的电池电量，如果电量无法获取，默认将返回 1
   *
   * @method getBatteryLevel
   * @return {Number} - 0.0 ~ 1.0
   */


  sys.getBatteryLevel = function () {
    // TODO: need to implement this for mobile phones.
    return 1.0;
  };
  /**
   * Forces the garbage collection, only available in JSB
   * @method garbageCollect
   */


  sys.garbageCollect = function () {// N/A in web
  };
  /**
   * Restart the JS VM, only available in JSB
   * @method restartVM
   */


  sys.restartVM = function () {// N/A in web
  };
  /**
   * !#en
   * Return the safe area rect. <br/>
   * only available on the iOS native platform, otherwise it will return a rect with design resolution size.
   * !#zh
   * 返回手机屏幕安全区域，目前仅在 iOS 原生平台有效。其它平台将默认返回设计分辨率尺寸。
   * @method getSafeAreaRect
   * @return {Rect}
  */


  sys.getSafeAreaRect = function () {
    var visibleSize = cc.view.getVisibleSize();
    return cc.rect(0, 0, visibleSize.width, visibleSize.height);
  };
  /**
   * Check whether an object is valid,
   * In web engine, it will return true if the object exist
   * In native engine, it will return true if the JS object and the correspond native object are both valid
   * @method isObjectValid
   * @param {Object} obj
   * @return {Boolean} Validity of the object
   */


  sys.isObjectValid = function (obj) {
    if (obj) {
      return true;
    }

    return false;
  };
  /**
   * Dump system informations
   * @method dump
   */


  sys.dump = function () {
    var self = this;
    var str = "";
    str += "isMobile : " + self.isMobile + "\r\n";
    str += "language : " + self.language + "\r\n";
    str += "browserType : " + self.browserType + "\r\n";
    str += "browserVersion : " + self.browserVersion + "\r\n";
    str += "capabilities : " + JSON.stringify(self.capabilities) + "\r\n";
    str += "os : " + self.os + "\r\n";
    str += "osVersion : " + self.osVersion + "\r\n";
    str += "platform : " + self.platform + "\r\n";
    str += "Using " + (cc.game.renderType === cc.game.RENDER_TYPE_WEBGL ? "WEBGL" : "CANVAS") + " renderer." + "\r\n";
    cc.log(str);
  };
  /**
   * Open a url in browser
   * @method openURL
   * @param {String} url
   */


  sys.openURL = function (url) {
    if (CC_JSB || CC_RUNTIME) {
      jsb.openURL(url);
    } else {
      window.open(url);
    }
  };
  /**
   * Get the number of milliseconds elapsed since 1 January 1970 00:00:00 UTC.
   * @method now
   * @return {Number}
   */


  sys.now = function () {
    if (Date.now) {
      return Date.now();
    } else {
      return +new Date();
    }
  };

  return sys;
}

var sys = cc && cc.sys ? cc.sys : initSys();
module.exports = sys;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDU3lzLmpzIl0sIm5hbWVzIjpbInNldHRpbmdQbGF0Zm9ybSIsIkNDX0VESVRPUiIsIndpbmRvdyIsIl9DQ1NldHRpbmdzIiwicGxhdGZvcm0iLCJ1bmRlZmluZWQiLCJpc1Zpdm9HYW1lIiwiaXNPcHBvR2FtZSIsImlzSHVhd2VpR2FtZSIsImlzSktXR2FtZSIsImlzUXR0R2FtZSIsIl9nbG9iYWwiLCJnbG9iYWwiLCJpbml0U3lzIiwiY2MiLCJzeXMiLCJMQU5HVUFHRV9FTkdMSVNIIiwiTEFOR1VBR0VfQ0hJTkVTRSIsIkxBTkdVQUdFX0ZSRU5DSCIsIkxBTkdVQUdFX0lUQUxJQU4iLCJMQU5HVUFHRV9HRVJNQU4iLCJMQU5HVUFHRV9TUEFOSVNIIiwiTEFOR1VBR0VfRFVUQ0giLCJMQU5HVUFHRV9SVVNTSUFOIiwiTEFOR1VBR0VfS09SRUFOIiwiTEFOR1VBR0VfSkFQQU5FU0UiLCJMQU5HVUFHRV9IVU5HQVJJQU4iLCJMQU5HVUFHRV9QT1JUVUdVRVNFIiwiTEFOR1VBR0VfQVJBQklDIiwiTEFOR1VBR0VfTk9SV0VHSUFOIiwiTEFOR1VBR0VfUE9MSVNIIiwiTEFOR1VBR0VfVFVSS0lTSCIsIkxBTkdVQUdFX1VLUkFJTklBTiIsIkxBTkdVQUdFX1JPTUFOSUFOIiwiTEFOR1VBR0VfQlVMR0FSSUFOIiwiTEFOR1VBR0VfVU5LTk9XTiIsIk9TX0lPUyIsIk9TX0FORFJPSUQiLCJPU19XSU5ET1dTIiwiT1NfTUFSTUFMQURFIiwiT1NfTElOVVgiLCJPU19CQURBIiwiT1NfQkxBQ0tCRVJSWSIsIk9TX09TWCIsIk9TX1dQOCIsIk9TX1dJTlJUIiwiT1NfVU5LTk9XTiIsIlVOS05PV04iLCJXSU4zMiIsIkxJTlVYIiwiTUFDT1MiLCJBTkRST0lEIiwiSVBIT05FIiwiSVBBRCIsIkJMQUNLQkVSUlkiLCJOQUNMIiwiRU1TQ1JJUFRFTiIsIlRJWkVOIiwiV0lOUlQiLCJXUDgiLCJNT0JJTEVfQlJPV1NFUiIsIkRFU0tUT1BfQlJPV1NFUiIsIkVESVRPUl9QQUdFIiwiRURJVE9SX0NPUkUiLCJXRUNIQVRfR0FNRSIsIlFRX1BMQVkiLCJGQl9QTEFZQUJMRV9BRFMiLCJCQUlEVV9HQU1FIiwiVklWT19HQU1FIiwiT1BQT19HQU1FIiwiSFVBV0VJX0dBTUUiLCJYSUFPTUlfR0FNRSIsIkpLV19HQU1FIiwiQUxJUEFZX0dBTUUiLCJXRUNIQVRfR0FNRV9TVUIiLCJCQUlEVV9HQU1FX1NVQiIsIlFUVF9HQU1FIiwiQlJPV1NFUl9UWVBFX1dFQ0hBVCIsIkJST1dTRVJfVFlQRV9XRUNIQVRfR0FNRSIsIkJST1dTRVJfVFlQRV9XRUNIQVRfR0FNRV9TVUIiLCJCUk9XU0VSX1RZUEVfQkFJRFVfR0FNRSIsIkJST1dTRVJfVFlQRV9CQUlEVV9HQU1FX1NVQiIsIkJST1dTRVJfVFlQRV9YSUFPTUlfR0FNRSIsIkJST1dTRVJfVFlQRV9BTElQQVlfR0FNRSIsIkJST1dTRVJfVFlQRV9RUV9QTEFZIiwiQlJPV1NFUl9UWVBFX0FORFJPSUQiLCJCUk9XU0VSX1RZUEVfSUUiLCJCUk9XU0VSX1RZUEVfRURHRSIsIkJST1dTRVJfVFlQRV9RUSIsIkJST1dTRVJfVFlQRV9NT0JJTEVfUVEiLCJCUk9XU0VSX1RZUEVfVUMiLCJCUk9XU0VSX1RZUEVfVUNCUyIsIkJST1dTRVJfVFlQRV8zNjAiLCJCUk9XU0VSX1RZUEVfQkFJRFVfQVBQIiwiQlJPV1NFUl9UWVBFX0JBSURVIiwiQlJPV1NFUl9UWVBFX01BWFRIT04iLCJCUk9XU0VSX1RZUEVfT1BFUkEiLCJCUk9XU0VSX1RZUEVfT1VQRU5HIiwiQlJPV1NFUl9UWVBFX01JVUkiLCJCUk9XU0VSX1RZUEVfRklSRUZPWCIsIkJST1dTRVJfVFlQRV9TQUZBUkkiLCJCUk9XU0VSX1RZUEVfQ0hST01FIiwiQlJPV1NFUl9UWVBFX0xJRUJBTyIsIkJST1dTRVJfVFlQRV9RWk9ORSIsIkJST1dTRVJfVFlQRV9TT1VHT1UiLCJCUk9XU0VSX1RZUEVfVU5LTk9XTiIsImlzTmF0aXZlIiwiQ0NfSlNCIiwiQ0NfUlVOVElNRSIsImlzQnJvd3NlciIsImRvY3VtZW50IiwiZ2xFeHRlbnNpb24iLCJuYW1lIiwicmVuZGVyZXIiLCJkZXZpY2UiLCJleHQiLCJnZXRNYXhKb2ludE1hdHJpeFNpemUiLCJfbWF4Sm9pbnRNYXRyaXhTaXplIiwiSk9JTlRfTUFUUklDRVNfU0laRSIsIkxFRlRfVU5JRk9STV9TSVpFIiwiZ2wiLCJnYW1lIiwiX3JlbmRlckNvbnRleHQiLCJtYXhVbmlmb3JtcyIsIk1hdGgiLCJmbG9vciIsImdldFBhcmFtZXRlciIsIk1BWF9WRVJURVhfVU5JRk9STV9WRUNUT1JTIiwiX19nbG9iYWxBZGFwdGVyIiwiYWRhcHRTeXMiLCJFZGl0b3IiLCJpc01haW5Qcm9jZXNzIiwiaXNNb2JpbGUiLCJsYW5ndWFnZSIsImxhbmd1YWdlQ29kZSIsIm9zIiwiZGFyd2luIiwid2luMzIiLCJsaW51eCIsInByb2Nlc3MiLCJicm93c2VyVHlwZSIsImJyb3dzZXJWZXJzaW9uIiwid2luZG93UGl4ZWxSZXNvbHV0aW9uIiwid2lkdGgiLCJoZWlnaHQiLCJfX2F1ZGlvU3VwcG9ydCIsIl9fZ2V0UGxhdGZvcm0iLCJfX2dldE9TIiwiX19nZXRDdXJyZW50TGFuZ3VhZ2UiLCJfX2dldEN1cnJlbnRMYW5ndWFnZUNvZGUiLCJ0b0xvd2VyQ2FzZSIsIm9zVmVyc2lvbiIsIl9fZ2V0T1NWZXJzaW9uIiwib3NNYWluVmVyc2lvbiIsInBhcnNlSW50IiwidyIsImlubmVyV2lkdGgiLCJoIiwiaW5uZXJIZWlnaHQiLCJyYXRpbyIsImRldmljZVBpeGVsUmF0aW8iLCJsb2NhbFN0b3JhZ2UiLCJjYXBhYmlsaXRpZXMiLCJPTkxZX09ORSIsIldFQl9BVURJTyIsIkRFTEFZX0NSRUFURV9DVFgiLCJmb3JtYXQiLCJ3aW4iLCJuYXYiLCJuYXZpZ2F0b3IiLCJkb2MiLCJkb2NFbGUiLCJkb2N1bWVudEVsZW1lbnQiLCJ1YSIsInVzZXJBZ2VudCIsInRlc3QiLCJGYlBsYXlhYmxlQWQiLCJjdXJyTGFuZ3VhZ2UiLCJicm93c2VyTGFuZ3VhZ2UiLCJzcGxpdCIsImlzQW5kcm9pZCIsImlPUyIsInVhUmVzdWx0IiwiZXhlYyIsIm1heFRvdWNoUG9pbnRzIiwib3NOYW1lIiwiYXBwVmVyc2lvbiIsImluZGV4T2YiLCJPU19VTklYIiwidHlwZVJlZzEiLCJ0eXBlUmVnMiIsInR5cGVSZWczIiwiYnJvd3NlclR5cGVzIiwibWF0Y2giLCJ0eXBlTWFwIiwidmVyc2lvblJlZzEiLCJ2ZXJzaW9uUmVnMiIsInRtcCIsImNsaWVudFdpZHRoIiwiY2xpZW50SGVpZ2h0IiwiX2NoZWNrV2ViR0xSZW5kZXJNb2RlIiwicmVuZGVyVHlwZSIsIlJFTkRFUl9UWVBFX1dFQkdMIiwiRXJyb3IiLCJfdG1wQ2FudmFzMSIsImNyZWF0ZUVsZW1lbnQiLCJjcmVhdGUzRENvbnRleHQiLCJjYW52YXMiLCJvcHRfYXR0cmlicyIsIm9wdF9jb250ZXh0VHlwZSIsImdldENvbnRleHQiLCJlIiwic2V0SXRlbSIsInJlbW92ZUl0ZW0iLCJ3YXJuIiwid2FybklEIiwiZ2V0SXRlbSIsImNsZWFyIiwiX3N1cHBvcnRXZWJwIiwidG9EYXRhVVJMIiwic3RhcnRzV2l0aCIsIl9zdXBwb3J0Q2FudmFzIiwiX3N1cHBvcnRXZWJHTCIsIkNDX1RFU1QiLCJXZWJHTFJlbmRlcmluZ0NvbnRleHQiLCJtc1BvaW50ZXJFbmFibGVkIiwiRGV2aWNlTW90aW9uRXZlbnQiLCJEZXZpY2VPcmllbnRhdGlvbkV2ZW50IiwiREVCVUciLCJ2ZXJzaW9uIiwic3VwcG9ydFdlYkF1ZGlvIiwiQXVkaW9Db250ZXh0Iiwid2Via2l0QXVkaW9Db250ZXh0IiwibW96QXVkaW9Db250ZXh0IiwiVVNFX0xPQURFUl9FVkVOVCIsIk9ORV9TT1VSQ0UiLCJzZXRUaW1lb3V0IiwibG9nIiwiTVVMVElfQ0hBTk5FTCIsIkFVVE9QTEFZIiwiY29udGV4dCIsImVycm9yIiwibG9nSUQiLCJmb3JtYXRTdXBwb3J0IiwiYXVkaW8iLCJjYW5QbGF5VHlwZSIsIm9nZyIsInB1c2giLCJtcDMiLCJ3YXYiLCJtcDQiLCJtNGEiLCJOZXR3b3JrVHlwZSIsIk5PTkUiLCJMQU4iLCJXV0FOIiwiZ2V0TmV0d29ya1R5cGUiLCJnZXRCYXR0ZXJ5TGV2ZWwiLCJnYXJiYWdlQ29sbGVjdCIsInJlc3RhcnRWTSIsImdldFNhZmVBcmVhUmVjdCIsInZpc2libGVTaXplIiwidmlldyIsImdldFZpc2libGVTaXplIiwicmVjdCIsImlzT2JqZWN0VmFsaWQiLCJvYmoiLCJkdW1wIiwic2VsZiIsInN0ciIsIkpTT04iLCJzdHJpbmdpZnkiLCJvcGVuVVJMIiwidXJsIiwianNiIiwib3BlbiIsIm5vdyIsIkRhdGUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkEsSUFBSUEsZUFBSjs7QUFDQyxJQUFJLENBQUNDLFNBQUwsRUFBZ0I7QUFDYkQsRUFBQUEsZUFBZSxHQUFHRSxNQUFNLENBQUNDLFdBQVAsR0FBcUJBLFdBQVcsQ0FBQ0MsUUFBakMsR0FBMkNDLFNBQTdEO0FBQ0Y7O0FBQ0YsSUFBTUMsVUFBVSxHQUFJTixlQUFlLEtBQUssT0FBeEM7QUFDQSxJQUFNTyxVQUFVLEdBQUlQLGVBQWUsS0FBSyxXQUF4QztBQUNBLElBQU1RLFlBQVksR0FBSVIsZUFBZSxLQUFLLFFBQTFDO0FBQ0EsSUFBTVMsU0FBUyxHQUFJVCxlQUFlLEtBQUssVUFBdkM7QUFDQSxJQUFNVSxTQUFTLEdBQUlWLGVBQWUsS0FBSyxVQUF2Qzs7QUFFQSxJQUFNVyxPQUFPLEdBQUcsT0FBT1QsTUFBUCxLQUFrQixXQUFsQixHQUFnQ1UsTUFBaEMsR0FBeUNWLE1BQXpEOztBQUVBLFNBQVNXLE9BQVQsR0FBb0I7QUFDaEI7Ozs7OztBQU1BQyxFQUFBQSxFQUFFLENBQUNDLEdBQUgsR0FBUyxFQUFUO0FBQ0EsTUFBSUEsR0FBRyxHQUFHRCxFQUFFLENBQUNDLEdBQWI7QUFFQTs7Ozs7O0FBS0FBLEVBQUFBLEdBQUcsQ0FBQ0MsZ0JBQUosR0FBdUIsSUFBdkI7QUFFQTs7Ozs7O0FBS0FELEVBQUFBLEdB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LElBQUksWUFBWS9QLEVBQUUsQ0FBQzJHLElBQUgsQ0FBUWdGLFVBQVIsS0FBdUIzTCxFQUFFLENBQUMyRyxJQUFILENBQVFpRixpQkFBL0IsR0FBbUQsT0FBbkQsR0FBNkQsUUFBekUsSUFBcUYsWUFBckYsR0FBb0csTUFBM0c7QUFDQTVMLElBQUFBLEVBQUUsQ0FBQytOLEdBQUgsQ0FBT2dDLEdBQVA7QUFDSCxHQWJEO0FBZUE7Ozs7Ozs7QUFLQTlQLEVBQUFBLEdBQUcsQ0FBQ2lRLE9BQUosR0FBYyxVQUFVQyxHQUFWLEVBQWU7QUFDekIsUUFBSXRLLE1BQU0sSUFBSUMsVUFBZCxFQUEwQjtBQUN0QnNLLE1BQUFBLEdBQUcsQ0FBQ0YsT0FBSixDQUFZQyxHQUFaO0FBQ0gsS0FGRCxNQUdLO0FBQ0QvUSxNQUFBQSxNQUFNLENBQUNpUixJQUFQLENBQVlGLEdBQVo7QUFDSDtBQUNKLEdBUEQ7QUFTQTs7Ozs7OztBQUtBbFEsRUFBQUEsR0FBRyxDQUFDcVEsR0FBSixHQUFVLFlBQVk7QUFDbEIsUUFBSUMsSUFBSSxDQUFDRCxHQUFULEVBQWM7QUFDVixhQUFPQyxJQUFJLENBQUNELEdBQUwsRUFBUDtBQUNILEtBRkQsTUFHSztBQUNELGFBQU8sQ0FBRSxJQUFJQyxJQUFKLEVBQVQ7QUFDSDtBQUNKLEdBUEQ7O0FBU0EsU0FBT3RRLEdBQVA7QUFDSDs7QUFFRCxJQUFJQSxHQUFHLEdBQUdELEVBQUUsSUFBSUEsRUFBRSxDQUFDQyxHQUFULEdBQWVELEVBQUUsQ0FBQ0MsR0FBbEIsR0FBd0JGLE9BQU8sRUFBekM7QUFFQXlRLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnhRLEdBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5sZXQgc2V0dGluZ1BsYXRmb3JtO1xuIGlmICghQ0NfRURJVE9SKSB7XG4gICAgc2V0dGluZ1BsYXRmb3JtID0gd2luZG93Ll9DQ1NldHRpbmdzID8gX0NDU2V0dGluZ3MucGxhdGZvcm06IHVuZGVmaW5lZDtcbiB9XG5jb25zdCBpc1Zpdm9HYW1lID0gKHNldHRpbmdQbGF0Zm9ybSA9PT0gJ3FnYW1lJyk7XG5jb25zdCBpc09wcG9HYW1lID0gKHNldHRpbmdQbGF0Zm9ybSA9PT0gJ3F1aWNrZ2FtZScpO1xuY29uc3QgaXNIdWF3ZWlHYW1lID0gKHNldHRpbmdQbGF0Zm9ybSA9PT0gJ2h1YXdlaScpO1xuY29uc3QgaXNKS1dHYW1lID0gKHNldHRpbmdQbGF0Zm9ybSA9PT0gJ2prdy1nYW1lJyk7XG5jb25zdCBpc1F0dEdhbWUgPSAoc2V0dGluZ1BsYXRmb3JtID09PSAncXR0LWdhbWUnKTtcblxuY29uc3QgX2dsb2JhbCA9IHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogd2luZG93O1xuIFxuZnVuY3Rpb24gaW5pdFN5cyAoKSB7XG4gICAgLyoqXG4gICAgICogU3lzdGVtIHZhcmlhYmxlc1xuICAgICAqIEBjbGFzcyBzeXNcbiAgICAgKiBAbWFpblxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBjYy5zeXMgPSB7fTtcbiAgICB2YXIgc3lzID0gY2Muc3lzO1xuXG4gICAgLyoqXG4gICAgICogRW5nbGlzaCBsYW5ndWFnZSBjb2RlXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IExBTkdVQUdFX0VOR0xJU0hcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuTEFOR1VBR0VfRU5HTElTSCA9IFwiZW5cIjtcblxuICAgIC8qKlxuICAgICAqIENoaW5lc2UgbGFuZ3VhZ2UgY29kZVxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBMQU5HVUFHRV9DSElORVNFXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLkxBTkdVQUdFX0NISU5FU0UgPSBcInpoXCI7XG5cbiAgICAvKipcbiAgICAgKiBGcmVuY2ggbGFuZ3VhZ2UgY29kZVxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBMQU5HVUFHRV9GUkVOQ0hcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuTEFOR1VBR0VfRlJFTkNIID0gXCJmclwiO1xuXG4gICAgLyoqXG4gICAgICogSXRhbGlhbiBsYW5ndWFnZSBjb2RlXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IExBTkdVQUdFX0lUQUxJQU5cbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuTEFOR1VBR0VfSVRBTElBTiA9IFwiaXRcIjtcblxuICAgIC8qKlxuICAgICAqIEdlcm1hbiBsYW5ndWFnZSBjb2RlXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IExBTkdVQUdFX0dFUk1BTlxuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5MQU5HVUFHRV9HRVJNQU4gPSBcImRlXCI7XG5cbiAgICAvKipcbiAgICAgKiBTcGFuaXNoIGxhbmd1YWdlIGNvZGVcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gTEFOR1VBR0VfU1BBTklTSFxuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5MQU5HVUFHRV9TUEFOSVNIID0gXCJlc1wiO1xuXG4gICAgLyoqXG4gICAgICogU3BhbmlzaCBsYW5ndWFnZSBjb2RlXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IExBTkdVQUdFX0RVVENIXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLkxBTkdVQUdFX0RVVENIID0gXCJkdVwiO1xuXG4gICAgLyoqXG4gICAgICogUnVzc2lhbiBsYW5ndWFnZSBjb2RlXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IExBTkdVQUdFX1JVU1NJQU5cbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuTEFOR1VBR0VfUlVTU0lBTiA9IFwicnVcIjtcblxuICAgIC8qKlxuICAgICAqIEtvcmVhbiBsYW5ndWFnZSBjb2RlXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IExBTkdVQUdFX0tPUkVBTlxuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5MQU5HVUFHRV9LT1JFQU4gPSBcImtvXCI7XG5cbiAgICAvKipcbiAgICAgKiBKYXBhbmVzZSBsYW5ndWFnZSBjb2RlXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IExBTkdVQUdFX0pBUEFORVNFXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLkxBTkdVQUdFX0pBUEFORVNFID0gXCJqYVwiO1xuXG4gICAgLyoqXG4gICAgICogSHVuZ2FyaWFuIGxhbmd1YWdlIGNvZGVcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gTEFOR1VBR0VfSFVOR0FSSUFOXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgc3lzLkxBTkdVQUdFX0hVTkdBUklBTiA9IFwiaHVcIjtcblxuICAgIC8qKlxuICAgICAqIFBvcnR1Z3Vlc2UgbGFuZ3VhZ2UgY29kZVxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBMQU5HVUFHRV9QT1JUVUdVRVNFXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLkxBTkdVQUdFX1BPUlRVR1VFU0UgPSBcInB0XCI7XG5cbiAgICAvKipcbiAgICAgKiBBcmFiaWMgbGFuZ3VhZ2UgY29kZVxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBMQU5HVUFHRV9BUkFCSUNcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuTEFOR1VBR0VfQVJBQklDID0gXCJhclwiO1xuXG4gICAgLyoqXG4gICAgICogTm9yd2VnaWFuIGxhbmd1YWdlIGNvZGVcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gTEFOR1VBR0VfTk9SV0VHSUFOXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLkxBTkdVQUdFX05PUldFR0lBTiA9IFwibm9cIjtcblxuICAgIC8qKlxuICAgICAqIFBvbGlzaCBsYW5ndWFnZSBjb2RlXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IExBTkdVQUdFX1BPTElTSFxuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5MQU5HVUFHRV9QT0xJU0ggPSBcInBsXCI7XG5cbiAgICAvKipcbiAgICAgKiBUdXJraXNoIGxhbmd1YWdlIGNvZGVcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gTEFOR1VBR0VfVFVSS0lTSFxuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5MQU5HVUFHRV9UVVJLSVNIID0gXCJ0clwiO1xuXG4gICAgLyoqXG4gICAgICogVWtyYWluaWFuIGxhbmd1YWdlIGNvZGVcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gTEFOR1VBR0VfVUtSQUlOSUFOXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLkxBTkdVQUdFX1VLUkFJTklBTiA9IFwidWtcIjtcblxuICAgIC8qKlxuICAgICAqIFJvbWFuaWFuIGxhbmd1YWdlIGNvZGVcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gTEFOR1VBR0VfUk9NQU5JQU5cbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuTEFOR1VBR0VfUk9NQU5JQU4gPSBcInJvXCI7XG5cbiAgICAvKipcbiAgICAgKiBCdWxnYXJpYW4gbGFuZ3VhZ2UgY29kZVxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBMQU5HVUFHRV9CVUxHQVJJQU5cbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuTEFOR1VBR0VfQlVMR0FSSUFOID0gXCJiZ1wiO1xuXG4gICAgLyoqXG4gICAgICogVW5rbm93biBsYW5ndWFnZSBjb2RlXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IExBTkdVQUdFX1VOS05PV05cbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuTEFOR1VBR0VfVU5LTk9XTiA9IFwidW5rbm93blwiO1xuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IE9TX0lPU1xuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5PU19JT1MgPSBcImlPU1wiO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBPU19BTkRST0lEXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLk9TX0FORFJPSUQgPSBcIkFuZHJvaWRcIjtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gT1NfV0lORE9XU1xuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5PU19XSU5ET1dTID0gXCJXaW5kb3dzXCI7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IE9TX01BUk1BTEFERVxuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5PU19NQVJNQUxBREUgPSBcIk1hcm1hbGFkZVwiO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBPU19MSU5VWFxuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5PU19MSU5VWCA9IFwiTGludXhcIjtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gT1NfQkFEQVxuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5PU19CQURBID0gXCJCYWRhXCI7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IE9TX0JMQUNLQkVSUllcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuT1NfQkxBQ0tCRVJSWSA9IFwiQmxhY2tiZXJyeVwiO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBPU19PU1hcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuT1NfT1NYID0gXCJPUyBYXCI7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IE9TX1dQOFxuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5PU19XUDggPSBcIldQOFwiO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBPU19XSU5SVFxuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5PU19XSU5SVCA9IFwiV0lOUlRcIjtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gT1NfVU5LTk9XTlxuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5PU19VTktOT1dOID0gXCJVbmtub3duXCI7XG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gVU5LTk9XTlxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IC0xXG4gICAgICovXG4gICAgc3lzLlVOS05PV04gPSAtMTtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gV0lOMzJcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCAwXG4gICAgICovXG4gICAgc3lzLldJTjMyID0gMDtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gTElOVVhcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCAxXG4gICAgICovXG4gICAgc3lzLkxJTlVYID0gMTtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gTUFDT1NcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCAyXG4gICAgICovXG4gICAgc3lzLk1BQ09TID0gMjtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gQU5EUk9JRFxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDNcbiAgICAgKi9cbiAgICBzeXMuQU5EUk9JRCA9IDM7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IElQSE9ORVxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDRcbiAgICAgKi9cbiAgICBzeXMuSVBIT05FID0gNDtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gSVBBRFxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDVcbiAgICAgKi9cbiAgICBzeXMuSVBBRCA9IDU7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEJMQUNLQkVSUllcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCA2XG4gICAgICovXG4gICAgc3lzLkJMQUNLQkVSUlkgPSA2O1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBOQUNMXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgN1xuICAgICAqL1xuICAgIHN5cy5OQUNMID0gNztcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gRU1TQ1JJUFRFTlxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDhcbiAgICAgKi9cbiAgICBzeXMuRU1TQ1JJUFRFTiA9IDg7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFRJWkVOXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgOVxuICAgICAqL1xuICAgIHN5cy5USVpFTiA9IDk7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFdJTlJUXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgMTBcbiAgICAgKi9cbiAgICBzeXMuV0lOUlQgPSAxMDtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gV1A4XG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgMTFcbiAgICAgKi9cbiAgICBzeXMuV1A4ID0gMTE7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IE1PQklMRV9CUk9XU0VSXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgMTAwXG4gICAgICovXG4gICAgc3lzLk1PQklMRV9CUk9XU0VSID0gMTAwO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBERVNLVE9QX0JST1dTRVJcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCAxMDFcbiAgICAgKi9cbiAgICBzeXMuREVTS1RPUF9CUk9XU0VSID0gMTAxO1xuXG4gICAgLyoqXG4gICAgICogSW5kaWNhdGVzIHdoZXRoZXIgZXhlY3V0ZXMgaW4gZWRpdG9yJ3Mgd2luZG93IHByb2Nlc3MgKEVsZWN0cm9uJ3MgcmVuZGVyZXIgY29udGV4dClcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gRURJVE9SX1BBR0VcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCAxMDJcbiAgICAgKi9cbiAgICBzeXMuRURJVE9SX1BBR0UgPSAxMDI7XG4gICAgLyoqXG4gICAgICogSW5kaWNhdGVzIHdoZXRoZXIgZXhlY3V0ZXMgaW4gZWRpdG9yJ3MgbWFpbiBwcm9jZXNzIChFbGVjdHJvbidzIGJyb3dzZXIgY29udGV4dClcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gRURJVE9SX0NPUkVcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCAxMDNcbiAgICAgKi9cbiAgICBzeXMuRURJVE9SX0NPUkUgPSAxMDM7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFdFQ0hBVF9HQU1FXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgMTA0XG4gICAgICovXG4gICAgc3lzLldFQ0hBVF9HQU1FID0gMTA0O1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBRUV9QTEFZXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgMTA1XG4gICAgICovXG4gICAgc3lzLlFRX1BMQVkgPSAxMDU7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEZCX1BMQVlBQkxFX0FEU1xuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDEwNlxuICAgICAqL1xuICAgIHN5cy5GQl9QTEFZQUJMRV9BRFMgPSAxMDY7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEJBSURVX0dBTUVcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCAxMDdcbiAgICAgKi9cbiAgICBzeXMuQkFJRFVfR0FNRSA9IDEwNztcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gVklWT19HQU1FXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgMTA4XG4gICAgICovXG4gICAgc3lzLlZJVk9fR0FNRSA9IDEwODtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gT1BQT19HQU1FXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgMTA5XG4gICAgICovXG4gICAgc3lzLk9QUE9fR0FNRSA9IDEwOTtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gSFVBV0VJX0dBTUVcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCAxMTBcbiAgICAgKi9cbiAgICBzeXMuSFVBV0VJX0dBTUUgPSAxMTA7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFhJQU9NSV9HQU1FXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgMTExXG4gICAgICovXG4gICAgc3lzLlhJQU9NSV9HQU1FID0gMTExO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBKS1dfR0FNRVxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDExMlxuICAgICAqL1xuICAgIHN5cy5KS1dfR0FNRSA9IDExMjtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gQUxJUEFZX0dBTUVcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCAxMTNcbiAgICAgKi9cbiAgICBzeXMuQUxJUEFZX0dBTUUgPSAxMTM7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFdFQ0hBVF9HQU1FX1NVQlxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDExNFxuICAgICAqL1xuICAgIHN5cy5XRUNIQVRfR0FNRV9TVUIgPSAxMTQ7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEJBSURVX0dBTUVfU1VCXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgMTE1XG4gICAgICovXG4gICAgc3lzLkJBSURVX0dBTUVfU1VCID0gMTE1O1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBRVFRfR0FNRVxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDExNlxuICAgICAqL1xuICAgIHN5cy5RVFRfR0FNRSA9IDExNjtcbiAgICAvKipcbiAgICAgKiBCUk9XU0VSX1RZUEVfV0VDSEFUXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9XRUNIQVRcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcIndlY2hhdFwiXG4gICAgICovXG4gICAgc3lzLkJST1dTRVJfVFlQRV9XRUNIQVQgPSBcIndlY2hhdFwiO1xuICAgIC8qKlxuICAgICAqIEJST1dTRVJfVFlQRV9XRUNIQVRfR0FNRVxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBCUk9XU0VSX1RZUEVfV0VDSEFUX0dBTUVcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcIndlY2hhdGdhbWVcIlxuICAgICAqL1xuICAgIHN5cy5CUk9XU0VSX1RZUEVfV0VDSEFUX0dBTUUgPSBcIndlY2hhdGdhbWVcIjtcbiAgICAvKipcbiAgICAgKiBCUk9XU0VSX1RZUEVfV0VDSEFUX0dBTUVfU1VCXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9XRUNIQVRfR0FNRV9TVUJcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcIndlY2hhdGdhbWVzdWJcIlxuICAgICAqL1xuICAgIHN5cy5CUk9XU0VSX1RZUEVfV0VDSEFUX0dBTUVfU1VCID0gXCJ3ZWNoYXRnYW1lc3ViXCI7XG4gICAgLyoqXG4gICAgICogQlJPV1NFUl9UWVBFX0JBSURVX0dBTUVcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gQlJPV1NFUl9UWVBFX0JBSURVX0dBTUVcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcImJhaWR1Z2FtZVwiXG4gICAgICovXG4gICAgc3lzLkJST1dTRVJfVFlQRV9CQUlEVV9HQU1FID0gXCJiYWlkdWdhbWVcIjtcbiAgICAvKipcbiAgICAgKiBCUk9XU0VSX1RZUEVfQkFJRFVfR0FNRV9TVUJcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gQlJPV1NFUl9UWVBFX0JBSURVX0dBTUVfU1VCXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgXCJiYWlkdWdhbWVzdWJcIlxuICAgICAqL1xuICAgIHN5cy5CUk9XU0VSX1RZUEVfQkFJRFVfR0FNRV9TVUIgPSBcImJhaWR1Z2FtZXN1YlwiO1xuICAgIC8qKlxuICAgICAqIEJST1dTRVJfVFlQRV9YSUFPTUlfR0FNRVxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBCUk9XU0VSX1RZUEVfWElBT01JX0dBTUVcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcInhpYW9taWdhbWVcIlxuICAgICAqL1xuICAgIHN5cy5CUk9XU0VSX1RZUEVfWElBT01JX0dBTUUgPSBcInhpYW9taWdhbWVcIjtcbiAgICAvKipcbiAgICAgKiBCUk9XU0VSX1RZUEVfQUxJUEFZX0dBTUVcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gQlJPV1NFUl9UWVBFX0FMSVBBWV9HQU1FXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgXCJhbGlwYXlnYW1lXCJcbiAgICAgKi9cbiAgICBzeXMuQlJPV1NFUl9UWVBFX0FMSVBBWV9HQU1FID0gXCJhbGlwYXlnYW1lXCI7XG4gICAgLyoqXG4gICAgICogQlJPV1NFUl9UWVBFX1FRX1BMQVlcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gQlJPV1NFUl9UWVBFX1FRX1BMQVlcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcInFxcGxheVwiXG4gICAgICovXG4gICAgc3lzLkJST1dTRVJfVFlQRV9RUV9QTEFZID0gXCJxcXBsYXlcIjtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBCUk9XU0VSX1RZUEVfQU5EUk9JRFxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IFwiYW5kcm9pZGJyb3dzZXJcIlxuICAgICAqL1xuICAgIHN5cy5CUk9XU0VSX1RZUEVfQU5EUk9JRCA9IFwiYW5kcm9pZGJyb3dzZXJcIjtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBCUk9XU0VSX1RZUEVfSUVcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcImllXCJcbiAgICAgKi9cbiAgICBzeXMuQlJPV1NFUl9UWVBFX0lFID0gXCJpZVwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9FREdFXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgXCJlZGdlXCJcbiAgICAgKi9cbiAgICBzeXMuQlJPV1NFUl9UWVBFX0VER0UgPSBcImVkZ2VcIjtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBCUk9XU0VSX1RZUEVfUVFcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcInFxYnJvd3NlclwiXG4gICAgICovXG4gICAgc3lzLkJST1dTRVJfVFlQRV9RUSA9IFwicXFicm93c2VyXCI7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gQlJPV1NFUl9UWVBFX01PQklMRV9RUVxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IFwibXFxYnJvd3NlclwiXG4gICAgICovXG4gICAgc3lzLkJST1dTRVJfVFlQRV9NT0JJTEVfUVEgPSBcIm1xcWJyb3dzZXJcIjtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBCUk9XU0VSX1RZUEVfVUNcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcInVjYnJvd3NlclwiXG4gICAgICovXG4gICAgc3lzLkJST1dTRVJfVFlQRV9VQyA9IFwidWNicm93c2VyXCI7XG4gICAgLyoqXG4gICAgICogdWMgdGhpcmQgcGFydHkgaW50ZWdyYXRpb24uXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9VQ0JTXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgXCJ1Y2JzXCJcbiAgICAgKi9cbiAgICBzeXMuQlJPV1NFUl9UWVBFX1VDQlMgPSBcInVjYnNcIjtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBCUk9XU0VSX1RZUEVfMzYwXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgXCIzNjBicm93c2VyXCJcbiAgICAgKi9cbiAgICBzeXMuQlJPV1NFUl9UWVBFXzM2MCA9IFwiMzYwYnJvd3NlclwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9CQUlEVV9BUFBcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcImJhaWR1Ym94YXBwXCJcbiAgICAgKi9cbiAgICBzeXMuQlJPV1NFUl9UWVBFX0JBSURVX0FQUCA9IFwiYmFpZHVib3hhcHBcIjtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBCUk9XU0VSX1RZUEVfQkFJRFVcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcImJhaWR1YnJvd3NlclwiXG4gICAgICovXG4gICAgc3lzLkJST1dTRVJfVFlQRV9CQUlEVSA9IFwiYmFpZHVicm93c2VyXCI7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gQlJPV1NFUl9UWVBFX01BWFRIT05cbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcIm1heHRob25cIlxuICAgICAqL1xuICAgIHN5cy5CUk9XU0VSX1RZUEVfTUFYVEhPTiA9IFwibWF4dGhvblwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9PUEVSQVxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IFwib3BlcmFcIlxuICAgICAqL1xuICAgIHN5cy5CUk9XU0VSX1RZUEVfT1BFUkEgPSBcIm9wZXJhXCI7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gQlJPV1NFUl9UWVBFX09VUEVOR1xuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IFwib3VwZW5nXCJcbiAgICAgKi9cbiAgICBzeXMuQlJPV1NFUl9UWVBFX09VUEVORyA9IFwib3VwZW5nXCI7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gQlJPV1NFUl9UWVBFX01JVUlcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcIm1pdWlicm93c2VyXCJcbiAgICAgKi9cbiAgICBzeXMuQlJPV1NFUl9UWVBFX01JVUkgPSBcIm1pdWlicm93c2VyXCI7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gQlJPV1NFUl9UWVBFX0ZJUkVGT1hcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcImZpcmVmb3hcIlxuICAgICAqL1xuICAgIHN5cy5CUk9XU0VSX1RZUEVfRklSRUZPWCA9IFwiZmlyZWZveFwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9TQUZBUklcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcInNhZmFyaVwiXG4gICAgICovXG4gICAgc3lzLkJST1dTRVJfVFlQRV9TQUZBUkkgPSBcInNhZmFyaVwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9DSFJPTUVcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcImNocm9tZVwiXG4gICAgICovXG4gICAgc3lzLkJST1dTRVJfVFlQRV9DSFJPTUUgPSBcImNocm9tZVwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9MSUVCQU9cbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcImxpZWJhb1wiXG4gICAgICovXG4gICAgc3lzLkJST1dTRVJfVFlQRV9MSUVCQU8gPSBcImxpZWJhb1wiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9RWk9ORVxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IFwicXpvbmVcIlxuICAgICAqL1xuICAgIHN5cy5CUk9XU0VSX1RZUEVfUVpPTkUgPSBcInF6b25lXCI7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gQlJPV1NFUl9UWVBFX1NPVUdPVVxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IFwic29nb3VcIlxuICAgICAqL1xuICAgIHN5cy5CUk9XU0VSX1RZUEVfU09VR09VID0gXCJzb2dvdVwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9VTktOT1dOXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgXCJ1bmtub3duXCJcbiAgICAgKi9cbiAgICBzeXMuQlJPV1NFUl9UWVBFX1VOS05PV04gPSBcInVua25vd25cIjtcblxuICAgIC8qKlxuICAgICAqIElzIG5hdGl2ZSA/IFRoaXMgaXMgc2V0IHRvIGJlIHRydWUgaW4ganNiIGF1dG8uXG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSBpc05hdGl2ZVxuICAgICAqL1xuICAgIHN5cy5pc05hdGl2ZSA9IENDX0pTQiB8fCBDQ19SVU5USU1FO1xuXG5cbiAgICAvKipcbiAgICAgKiBJcyB3ZWIgYnJvd3NlciA/XG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSBpc0Jyb3dzZXJcbiAgICAgKi9cbiAgICBzeXMuaXNCcm93c2VyID0gdHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIGRvY3VtZW50ID09PSAnb2JqZWN0JyAmJiAhQ0NfSlNCICYmICFDQ19SVU5USU1FO1xuXG4gICAgLyoqXG4gICAgICogSXMgd2ViZ2wgZXh0ZW5zaW9uIHN1cHBvcnQ/XG4gICAgICogQG1ldGhvZCBnbEV4dGVuc2lvblxuICAgICAqIEBwYXJhbSBuYW1lXG4gICAgICovXG4gICAgc3lzLmdsRXh0ZW5zaW9uID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuICEhY2MucmVuZGVyZXIuZGV2aWNlLmV4dChuYW1lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgbWF4IGpvaW50IG1hdHJpeCBzaXplIGZvciBza2lubmVkIG1lc2ggcmVuZGVyZXIuXG4gICAgICogQG1ldGhvZCBnZXRNYXhKb2ludE1hdHJpeFNpemVcbiAgICAgKi9cbiAgICBzeXMuZ2V0TWF4Sm9pbnRNYXRyaXhTaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXN5cy5fbWF4Sm9pbnRNYXRyaXhTaXplKSB7XG4gICAgICAgICAgICBjb25zdCBKT0lOVF9NQVRSSUNFU19TSVpFID0gNTA7XG4gICAgICAgICAgICBjb25zdCBMRUZUX1VOSUZPUk1fU0laRSA9IDEwO1xuXG4gICAgICAgICAgICBsZXQgZ2wgPSBjYy5nYW1lLl9yZW5kZXJDb250ZXh0O1xuICAgICAgICAgICAgbGV0IG1heFVuaWZvcm1zID0gTWF0aC5mbG9vcihnbC5nZXRQYXJhbWV0ZXIoZ2wuTUFYX1ZFUlRFWF9VTklGT1JNX1ZFQ1RPUlMpIC8gNCkgLSBMRUZUX1VOSUZPUk1fU0laRTtcbiAgICAgICAgICAgIGlmIChtYXhVbmlmb3JtcyA8IEpPSU5UX01BVFJJQ0VTX1NJWkUpIHtcbiAgICAgICAgICAgICAgICBzeXMuX21heEpvaW50TWF0cml4U2l6ZSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzeXMuX21heEpvaW50TWF0cml4U2l6ZSA9IEpPSU5UX01BVFJJQ0VTX1NJWkU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN5cy5fbWF4Sm9pbnRNYXRyaXhTaXplO1xuICAgIH1cblxuICAgIGlmIChfZ2xvYmFsLl9fZ2xvYmFsQWRhcHRlciAmJiBfZ2xvYmFsLl9fZ2xvYmFsQWRhcHRlci5hZGFwdFN5cykge1xuICAgICAgICAvLyBpbml0IHN5cyBpbmZvIGluIGFkYXB0ZXJcbiAgICAgICAgX2dsb2JhbC5fX2dsb2JhbEFkYXB0ZXIuYWRhcHRTeXMoc3lzKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoQ0NfRURJVE9SICYmIEVkaXRvci5pc01haW5Qcm9jZXNzKSB7XG4gICAgICAgIHN5cy5pc01vYmlsZSA9IGZhbHNlO1xuICAgICAgICBzeXMucGxhdGZvcm0gPSBzeXMuRURJVE9SX0NPUkU7XG4gICAgICAgIHN5cy5sYW5ndWFnZSA9IHN5cy5MQU5HVUFHRV9VTktOT1dOO1xuICAgICAgICBzeXMubGFuZ3VhZ2VDb2RlID0gdW5kZWZpbmVkO1xuICAgICAgICBzeXMub3MgPSAoe1xuICAgICAgICAgICAgZGFyd2luOiBzeXMuT1NfT1NYLFxuICAgICAgICAgICAgd2luMzI6IHN5cy5PU19XSU5ET1dTLFxuICAgICAgICAgICAgbGludXg6IHN5cy5PU19MSU5VWFxuICAgICAgICB9KVtwcm9jZXNzLnBsYXRmb3JtXSB8fCBzeXMuT1NfVU5LTk9XTjtcbiAgICAgICAgc3lzLmJyb3dzZXJUeXBlID0gbnVsbDtcbiAgICAgICAgc3lzLmJyb3dzZXJWZXJzaW9uID0gbnVsbDtcbiAgICAgICAgc3lzLndpbmRvd1BpeGVsUmVzb2x1dGlvbiA9IHtcbiAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAwXG4gICAgICAgIH07XG4gICAgICAgIHN5cy5fX2F1ZGlvU3VwcG9ydCA9IHt9O1xuICAgIH1cbiAgICBlbHNlIGlmIChDQ19KU0IgfHwgQ0NfUlVOVElNRSkge1xuICAgICAgICBsZXQgcGxhdGZvcm07XG4gICAgICAgIGlmIChpc1Zpdm9HYW1lKSB7XG4gICAgICAgICAgICBwbGF0Zm9ybSA9IHN5cy5WSVZPX0dBTUU7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNPcHBvR2FtZSkge1xuICAgICAgICAgICAgcGxhdGZvcm0gPSBzeXMuT1BQT19HQU1FO1xuICAgICAgICB9IGVsc2UgaWYgKGlzSHVhd2VpR2FtZSkge1xuICAgICAgICAgICAgcGxhdGZvcm0gPSBzeXMuSFVBV0VJX0dBTUU7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNKS1dHYW1lKSB7XG4gICAgICAgICAgICBwbGF0Zm9ybSA9IHN5cy5KS1dfR0FNRTtcbiAgICAgICAgfSBlbHNlIGlmIChpc1F0dEdhbWUpIHtcbiAgICAgICAgICAgIHBsYXRmb3JtID0gc3lzLlFUVF9HQU1FO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcGxhdGZvcm0gPSBfX2dldFBsYXRmb3JtKCk7XG4gICAgICAgIH1cbiAgICAgICAgc3lzLnBsYXRmb3JtID0gcGxhdGZvcm07XG4gICAgICAgIHN5cy5pc01vYmlsZSA9IChwbGF0Zm9ybSA9PT0gc3lzLkFORFJPSUQgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXRmb3JtID09PSBzeXMuSVBBRCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhdGZvcm0gPT09IHN5cy5JUEhPTkUgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXRmb3JtID09PSBzeXMuV1A4IHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF0Zm9ybSA9PT0gc3lzLlRJWkVOIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF0Zm9ybSA9PT0gc3lzLkJMQUNLQkVSUlkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXRmb3JtID09PSBzeXMuWElBT01JX0dBTUUgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzVml2b0dhbWUgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzT3Bwb0dhbWUgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzSHVhd2VpR2FtZSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNKS1dHYW1lIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBpc1F0dEdhbWUpO1xuXG4gICAgICAgIHN5cy5vcyA9IF9fZ2V0T1MoKTtcbiAgICAgICAgc3lzLmxhbmd1YWdlID0gX19nZXRDdXJyZW50TGFuZ3VhZ2UoKTtcbiAgICAgICAgdmFyIGxhbmd1YWdlQ29kZTsgXG4gICAgICAgIGlmIChDQ19KU0IpIHtcbiAgICAgICAgICAgIGxhbmd1YWdlQ29kZSA9IF9fZ2V0Q3VycmVudExhbmd1YWdlQ29kZSgpO1xuICAgICAgICB9XG4gICAgICAgIHN5cy5sYW5ndWFnZUNvZGUgPSBsYW5ndWFnZUNvZGUgPyBsYW5ndWFnZUNvZGUudG9Mb3dlckNhc2UoKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgc3lzLm9zVmVyc2lvbiA9IF9fZ2V0T1NWZXJzaW9uKCk7XG4gICAgICAgIHN5cy5vc01haW5WZXJzaW9uID0gcGFyc2VJbnQoc3lzLm9zVmVyc2lvbik7XG4gICAgICAgIHN5cy5icm93c2VyVHlwZSA9IG51bGw7XG4gICAgICAgIHN5cy5icm93c2VyVmVyc2lvbiA9IG51bGw7XG5cbiAgICAgICAgdmFyIHcgPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgdmFyIGggPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgIHZhciByYXRpbyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDE7XG4gICAgICAgIHN5cy53aW5kb3dQaXhlbFJlc29sdXRpb24gPSB7XG4gICAgICAgICAgICB3aWR0aDogcmF0aW8gKiB3LFxuICAgICAgICAgICAgaGVpZ2h0OiByYXRpbyAqIGhcbiAgICAgICAgfTtcblxuICAgICAgICBzeXMubG9jYWxTdG9yYWdlID0gd2luZG93LmxvY2FsU3RvcmFnZTtcblxuICAgICAgICB2YXIgY2FwYWJpbGl0aWVzO1xuICAgICAgICBjYXBhYmlsaXRpZXMgPSBzeXMuY2FwYWJpbGl0aWVzID0ge1xuICAgICAgICAgICAgXCJjYW52YXNcIjogZmFsc2UsXG4gICAgICAgICAgICBcIm9wZW5nbFwiOiB0cnVlLFxuICAgICAgICAgICAgXCJ3ZWJwXCI6IHRydWUsXG4gICAgICAgIH07XG5cbiAgICAgICBpZiAoc3lzLmlzTW9iaWxlKSB7XG4gICAgICAgICAgICBjYXBhYmlsaXRpZXNbXCJhY2NlbGVyb21ldGVyXCJdID0gdHJ1ZTtcbiAgICAgICAgICAgIGNhcGFiaWxpdGllc1tcInRvdWNoZXNcIl0gPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gZGVza3RvcFxuICAgICAgICAgICAgY2FwYWJpbGl0aWVzW1wia2V5Ym9hcmRcIl0gPSB0cnVlO1xuICAgICAgICAgICAgY2FwYWJpbGl0aWVzW1wibW91c2VcIl0gPSB0cnVlO1xuICAgICAgICAgICAgY2FwYWJpbGl0aWVzW1widG91Y2hlc1wiXSA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgc3lzLl9fYXVkaW9TdXBwb3J0ID0ge1xuICAgICAgICAgICAgT05MWV9PTkU6IGZhbHNlLFxuICAgICAgICAgICAgV0VCX0FVRElPOiBmYWxzZSxcbiAgICAgICAgICAgIERFTEFZX0NSRUFURV9DVFg6IGZhbHNlLFxuICAgICAgICAgICAgZm9ybWF0OiBbJy5tcDMnXVxuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gYnJvd3NlciBvciBydW50aW1lXG4gICAgICAgIHZhciB3aW4gPSB3aW5kb3csIG5hdiA9IHdpbi5uYXZpZ2F0b3IsIGRvYyA9IGRvY3VtZW50LCBkb2NFbGUgPSBkb2MuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICB2YXIgdWEgPSBuYXYudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgc3lzLmlzTW9iaWxlID0gZmFsc2U7XG4gICAgICAgICAgICBzeXMucGxhdGZvcm0gPSBzeXMuRURJVE9SX1BBR0U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEluZGljYXRlIHdoZXRoZXIgc3lzdGVtIGlzIG1vYmlsZSBzeXN0ZW1cbiAgICAgICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gaXNNb2JpbGVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgc3lzLmlzTW9iaWxlID0gL21vYmlsZXxhbmRyb2lkfGlwaG9uZXxpcGFkLy50ZXN0KHVhKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBJbmRpY2F0ZSB0aGUgcnVubmluZyBwbGF0Zm9ybVxuICAgICAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHBsYXRmb3JtXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICh0eXBlb2YgRmJQbGF5YWJsZUFkICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgc3lzLnBsYXRmb3JtID0gc3lzLkZCX1BMQVlBQkxFX0FEUztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHN5cy5wbGF0Zm9ybSA9IHN5cy5pc01vYmlsZSA/IHN5cy5NT0JJTEVfQlJPV1NFUiA6IHN5cy5ERVNLVE9QX0JST1dTRVI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY3Vyckxhbmd1YWdlID0gbmF2Lmxhbmd1YWdlO1xuICAgICAgICBjdXJyTGFuZ3VhZ2UgPSBjdXJyTGFuZ3VhZ2UgPyBjdXJyTGFuZ3VhZ2UgOiBuYXYuYnJvd3Nlckxhbmd1YWdlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgY3VycmVudCBsYW5ndWFnZSBpc28gNjM5LTEgY29kZS5cbiAgICAgICAgICogRXhhbXBsZXMgb2YgdmFsaWQgbGFuZ3VhZ2UgY29kZXMgaW5jbHVkZSBcInpoLXR3XCIsIFwiZW5cIiwgXCJlbi11c1wiLCBcImZyXCIsIFwiZnItZnJcIiwgXCJlcy1lc1wiLCBldGMuXG4gICAgICAgICAqIFRoZSBhY3R1YWwgdmFsdWUgdG90YWxseSBkZXBlbmRzIG9uIHJlc3VsdHMgcHJvdmlkZWQgYnkgZGVzdGluYXRpb24gcGxhdGZvcm0uXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBsYW5ndWFnZUNvZGVcbiAgICAgICAgICovXG4gICAgICAgIHN5cy5sYW5ndWFnZUNvZGUgPSBjdXJyTGFuZ3VhZ2UudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICBjdXJyTGFuZ3VhZ2UgPSBjdXJyTGFuZ3VhZ2UgPyBjdXJyTGFuZ3VhZ2Uuc3BsaXQoXCItXCIpWzBdIDogc3lzLkxBTkdVQUdFX0VOR0xJU0g7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluZGljYXRlIHRoZSBjdXJyZW50IGxhbmd1YWdlIG9mIHRoZSBydW5uaW5nIHN5c3RlbVxuICAgICAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gbGFuZ3VhZ2VcbiAgICAgICAgICovXG4gICAgICAgIHN5cy5sYW5ndWFnZSA9IGN1cnJMYW5ndWFnZTtcblxuICAgICAgICAvLyBHZXQgdGhlIG9zIG9mIHN5c3RlbVxuICAgICAgICB2YXIgaXNBbmRyb2lkID0gZmFsc2UsIGlPUyA9IGZhbHNlLCBvc1ZlcnNpb24gPSAnJywgb3NNYWluVmVyc2lvbiA9IDA7XG4gICAgICAgIHZhciB1YVJlc3VsdCA9IC9hbmRyb2lkIChcXGQrKD86XFwuXFxkKykqKS9pLmV4ZWModWEpIHx8IC9hbmRyb2lkIChcXGQrKD86XFwuXFxkKykqKS9pLmV4ZWMobmF2LnBsYXRmb3JtKTtcbiAgICAgICAgaWYgKHVhUmVzdWx0KSB7XG4gICAgICAgICAgICBpc0FuZHJvaWQgPSB0cnVlO1xuICAgICAgICAgICAgb3NWZXJzaW9uID0gdWFSZXN1bHRbMV0gfHwgJyc7XG4gICAgICAgICAgICBvc01haW5WZXJzaW9uID0gcGFyc2VJbnQob3NWZXJzaW9uKSB8fCAwO1xuICAgICAgICB9XG4gICAgICAgIHVhUmVzdWx0ID0gLyhpUGFkfGlQaG9uZXxpUG9kKS4qT1MgKChcXGQrXz8pezIsM30pL2kuZXhlYyh1YSk7XG4gICAgICAgIGlmICh1YVJlc3VsdCkge1xuICAgICAgICAgICAgaU9TID0gdHJ1ZTtcbiAgICAgICAgICAgIG9zVmVyc2lvbiA9IHVhUmVzdWx0WzJdIHx8ICcnO1xuICAgICAgICAgICAgb3NNYWluVmVyc2lvbiA9IHBhcnNlSW50KG9zVmVyc2lvbikgfHwgMDtcbiAgICAgICAgfVxuICAgICAgICAvLyByZWZlciB0byBodHRwczovL2dpdGh1Yi5jb20vY29jb3MtY3JlYXRvci9lbmdpbmUvcHVsbC81NTQyICwgdGhhbmtzIGZvciBjb250cmliaXRpb24gZnJvbSBAa3JhcG5pa2trXG4gICAgICAgIC8vIGlwYWQgT1MgMTMgc2FmYXJpIGlkZW50aWZpZXMgaXRzZWxmIGFzIFwiTW96aWxsYS81LjAgKE1hY2ludG9zaDsgSW50ZWwgTWFjIE9TIFggMTBfMTUpIEFwcGxlV2ViS2l0LzYwNS4xLjE1IChLSFRNTCwgbGlrZSBHZWNrbylcIiBcbiAgICAgICAgLy8gc28gdXNlIG1heFRvdWNoUG9pbnRzIHRvIGNoZWNrIHdoZXRoZXIgaXQncyBkZXNrdG9wIHNhZmFyaSBvciBub3QuIFxuICAgICAgICAvLyByZWZlcmVuY2U6IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzU4MDE5NDYzL2hvdy10by1kZXRlY3QtZGV2aWNlLW5hbWUtaW4tc2FmYXJpLW9uLWlvcy0xMy13aGlsZS1pdC1kb2VzbnQtc2hvdy10aGUtY29ycmVjdFxuICAgICAgICAvLyBGSVhNRTogc2hvdWxkIHJlbW92ZSBpdCB3aGVuIHRvdWNoLWVuYWJsZWQgbWFjcyBhcmUgYXZhaWxhYmxlXG4gICAgICAgIGVsc2UgaWYgKC8oaVBob25lfGlQYWR8aVBvZCkvLmV4ZWMobmF2LnBsYXRmb3JtKSB8fCAobmF2LnBsYXRmb3JtID09PSAnTWFjSW50ZWwnICYmIG5hdi5tYXhUb3VjaFBvaW50cyAmJiBuYXYubWF4VG91Y2hQb2ludHMgPiAxKSkgeyBcbiAgICAgICAgICAgIGlPUyA9IHRydWU7XG4gICAgICAgICAgICBvc1ZlcnNpb24gPSAnJztcbiAgICAgICAgICAgIG9zTWFpblZlcnNpb24gPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG9zTmFtZSA9IHN5cy5PU19VTktOT1dOO1xuICAgICAgICBpZiAobmF2LmFwcFZlcnNpb24uaW5kZXhPZihcIldpblwiKSAhPT0gLTEpIG9zTmFtZSA9IHN5cy5PU19XSU5ET1dTO1xuICAgICAgICBlbHNlIGlmIChpT1MpIG9zTmFtZSA9IHN5cy5PU19JT1M7XG4gICAgICAgIGVsc2UgaWYgKG5hdi5hcHBWZXJzaW9uLmluZGV4T2YoXCJNYWNcIikgIT09IC0xKSBvc05hbWUgPSBzeXMuT1NfT1NYO1xuICAgICAgICBlbHNlIGlmIChuYXYuYXBwVmVyc2lvbi5pbmRleE9mKFwiWDExXCIpICE9PSAtMSAmJiBuYXYuYXBwVmVyc2lvbi5pbmRleE9mKFwiTGludXhcIikgPT09IC0xKSBvc05hbWUgPSBzeXMuT1NfVU5JWDtcbiAgICAgICAgZWxzZSBpZiAoaXNBbmRyb2lkKSBvc05hbWUgPSBzeXMuT1NfQU5EUk9JRDtcbiAgICAgICAgZWxzZSBpZiAobmF2LmFwcFZlcnNpb24uaW5kZXhPZihcIkxpbnV4XCIpICE9PSAtMSB8fCB1YS5pbmRleE9mKFwidWJ1bnR1XCIpICE9PSAtMSkgb3NOYW1lID0gc3lzLk9TX0xJTlVYO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbmRpY2F0ZSB0aGUgcnVubmluZyBvcyBuYW1lXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBvc1xuICAgICAgICAgKi9cbiAgICAgICAgc3lzLm9zID0gb3NOYW1lO1xuICAgICAgICAvKipcbiAgICAgICAgICogSW5kaWNhdGUgdGhlIHJ1bm5pbmcgb3MgdmVyc2lvblxuICAgICAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gb3NWZXJzaW9uXG4gICAgICAgICAqL1xuICAgICAgICBzeXMub3NWZXJzaW9uID0gb3NWZXJzaW9uO1xuICAgICAgICAvKipcbiAgICAgICAgICogSW5kaWNhdGUgdGhlIHJ1bm5pbmcgb3MgbWFpbiB2ZXJzaW9uXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBvc01haW5WZXJzaW9uXG4gICAgICAgICAqL1xuICAgICAgICBzeXMub3NNYWluVmVyc2lvbiA9IG9zTWFpblZlcnNpb247XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluZGljYXRlIHRoZSBydW5uaW5nIGJyb3dzZXIgdHlwZVxuICAgICAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gYnJvd3NlclR5cGVcbiAgICAgICAgICovXG4gICAgICAgIHN5cy5icm93c2VyVHlwZSA9IHN5cy5CUk9XU0VSX1RZUEVfVU5LTk9XTjtcbiAgICAgICAgLyogRGV0ZXJtaW5lIHRoZSBicm93c2VyIHR5cGUgKi9cbiAgICAgICAgKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgdHlwZVJlZzEgPSAvbXFxYnJvd3NlcnxtaWNyb21lc3NlbmdlcnxxcWJyb3dzZXJ8c29nb3V8cXpvbmV8bGllYmFvfG1heHRob258dWNic3wzNjAgYXBob25lfDM2MGJyb3dzZXJ8YmFpZHVib3hhcHB8YmFpZHVicm93c2VyfG1heHRob258bXhicm93c2VyfG1pdWlicm93c2VyL2k7XG4gICAgICAgICAgICB2YXIgdHlwZVJlZzIgPSAvcXF8dWNicm93c2VyfHVicm93c2VyfGVkZ2UvaTtcbiAgICAgICAgICAgIHZhciB0eXBlUmVnMyA9IC9jaHJvbWV8c2FmYXJpfGZpcmVmb3h8dHJpZGVudHxvcGVyYXxvcHJcXC98b3VwZW5nL2k7XG4gICAgICAgICAgICB2YXIgYnJvd3NlclR5cGVzID0gdHlwZVJlZzEuZXhlYyh1YSkgfHwgdHlwZVJlZzIuZXhlYyh1YSkgfHwgdHlwZVJlZzMuZXhlYyh1YSk7XG5cbiAgICAgICAgICAgIHZhciBicm93c2VyVHlwZSA9IGJyb3dzZXJUeXBlcyA/IGJyb3dzZXJUeXBlc1swXS50b0xvd2VyQ2FzZSgpIDogc3lzLkJST1dTRVJfVFlQRV9VTktOT1dOO1xuXG4gICAgICAgICAgICBpZiAoYnJvd3NlclR5cGUgPT09IFwic2FmYXJpXCIgJiYgaXNBbmRyb2lkKVxuICAgICAgICAgICAgICAgIGJyb3dzZXJUeXBlID0gc3lzLkJST1dTRVJfVFlQRV9BTkRST0lEO1xuICAgICAgICAgICAgZWxzZSBpZiAoYnJvd3NlclR5cGUgPT09IFwicXFcIiAmJiB1YS5tYXRjaCgvYW5kcm9pZC4qYXBwbGV3ZWJraXQvaSkpXG4gICAgICAgICAgICAgICAgYnJvd3NlclR5cGUgPSBzeXMuQlJPV1NFUl9UWVBFX0FORFJPSUQ7XG4gICAgICAgICAgICBsZXQgdHlwZU1hcCA9IHtcbiAgICAgICAgICAgICAgICAnbWljcm9tZXNzZW5nZXInOiBzeXMuQlJPV1NFUl9UWVBFX1dFQ0hBVCxcbiAgICAgICAgICAgICAgICAndHJpZGVudCc6IHN5cy5CUk9XU0VSX1RZUEVfSUUsXG4gICAgICAgICAgICAgICAgJ2VkZ2UnOiBzeXMuQlJPV1NFUl9UWVBFX0VER0UsXG4gICAgICAgICAgICAgICAgJzM2MCBhcGhvbmUnOiBzeXMuQlJPV1NFUl9UWVBFXzM2MCxcbiAgICAgICAgICAgICAgICAnbXhicm93c2VyJzogc3lzLkJST1dTRVJfVFlQRV9NQVhUSE9OLFxuICAgICAgICAgICAgICAgICdvcHIvJzogc3lzLkJST1dTRVJfVFlQRV9PUEVSQSxcbiAgICAgICAgICAgICAgICAndWJyb3dzZXInOiBzeXMuQlJPV1NFUl9UWVBFX1VDXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBzeXMuYnJvd3NlclR5cGUgPSB0eXBlTWFwW2Jyb3dzZXJUeXBlXSB8fCBicm93c2VyVHlwZTtcbiAgICAgICAgfSkoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5kaWNhdGUgdGhlIHJ1bm5pbmcgYnJvd3NlciB2ZXJzaW9uXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBicm93c2VyVmVyc2lvblxuICAgICAgICAgKi9cbiAgICAgICAgc3lzLmJyb3dzZXJWZXJzaW9uID0gXCJcIjtcbiAgICAgICAgLyogRGV0ZXJtaW5lIHRoZSBicm93c2VyIHZlcnNpb24gbnVtYmVyICovXG4gICAgICAgIChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIHZlcnNpb25SZWcxID0gLyhtcXFicm93c2VyfG1pY3JvbWVzc2VuZ2VyfHFxYnJvd3Nlcnxzb2dvdXxxem9uZXxsaWViYW98bWF4dGhvbnx1Y3x1Y2JzfDM2MCBhcGhvbmV8MzYwfGJhaWR1Ym94YXBwfGJhaWR1fG1heHRob258bXhicm93c2VyfG1pdWkoPzouaHlicmlkKT8pKG1vYmlsZSk/KGJyb3dzZXIpP1xcLz8oW1xcZC5dKykvaTtcbiAgICAgICAgICAgIHZhciB2ZXJzaW9uUmVnMiA9IC8ocXF8Y2hyb21lfHNhZmFyaXxmaXJlZm94fHRyaWRlbnR8b3BlcmF8b3ByXFwvfG91cGVuZykobW9iaWxlKT8oYnJvd3Nlcik/XFwvPyhbXFxkLl0rKS9pO1xuICAgICAgICAgICAgdmFyIHRtcCA9IHVhLm1hdGNoKHZlcnNpb25SZWcxKTtcbiAgICAgICAgICAgIGlmKCF0bXApIHRtcCA9IHVhLm1hdGNoKHZlcnNpb25SZWcyKTtcbiAgICAgICAgICAgIHN5cy5icm93c2VyVmVyc2lvbiA9IHRtcCA/IHRtcFs0XSA6IFwiXCI7XG4gICAgICAgIH0pKCk7XG5cbiAgICAgICAgdmFyIHcgPSB3aW5kb3cuaW5uZXJXaWR0aCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgIHZhciBoID0gd2luZG93LmlubmVySGVpZ2h0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gICAgICAgIHZhciByYXRpbyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDE7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluZGljYXRlIHRoZSByZWFsIHBpeGVsIHJlc29sdXRpb24gb2YgdGhlIHdob2xlIGdhbWUgd2luZG93XG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U2l6ZX0gd2luZG93UGl4ZWxSZXNvbHV0aW9uXG4gICAgICAgICAqL1xuICAgICAgICBzeXMud2luZG93UGl4ZWxSZXNvbHV0aW9uID0ge1xuICAgICAgICAgICAgd2lkdGg6IHJhdGlvICogdyxcbiAgICAgICAgICAgIGhlaWdodDogcmF0aW8gKiBoXG4gICAgICAgIH07XG5cbiAgICAgICAgc3lzLl9jaGVja1dlYkdMUmVuZGVyTW9kZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChjYy5nYW1lLnJlbmRlclR5cGUgIT09IGNjLmdhbWUuUkVOREVSX1RZUEVfV0VCR0wpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhpcyBmZWF0dXJlIHN1cHBvcnRzIFdlYkdMIHJlbmRlciBtb2RlIG9ubHkuXCIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBfdG1wQ2FudmFzMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG5cbiAgICAgICAgdmFyIGNyZWF0ZTNEQ29udGV4dCA9IGZ1bmN0aW9uIChjYW52YXMsIG9wdF9hdHRyaWJzLCBvcHRfY29udGV4dFR5cGUpIHtcbiAgICAgICAgICAgIGlmIChvcHRfY29udGV4dFR5cGUpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FudmFzLmdldENvbnRleHQob3B0X2NvbnRleHRUeXBlLCBvcHRfYXR0cmlicyk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlM0RDb250ZXh0KGNhbnZhcywgb3B0X2F0dHJpYnMsIFwid2ViZ2xcIikgfHxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlM0RDb250ZXh0KGNhbnZhcywgb3B0X2F0dHJpYnMsIFwiZXhwZXJpbWVudGFsLXdlYmdsXCIpIHx8XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZTNEQ29udGV4dChjYW52YXMsIG9wdF9hdHRyaWJzLCBcIndlYmtpdC0zZFwiKSB8fFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGUzRENvbnRleHQoY2FudmFzLCBvcHRfYXR0cmlicywgXCJtb3otd2ViZ2xcIikgfHxcbiAgICAgICAgICAgICAgICAgICAgbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogY2Muc3lzLmxvY2FsU3RvcmFnZSBpcyBhIGxvY2FsIHN0b3JhZ2UgY29tcG9uZW50LlxuICAgICAgICAgKiBAcHJvcGVydHkge09iamVjdH0gbG9jYWxTdG9yYWdlXG4gICAgICAgICAqL1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIGxvY2FsU3RvcmFnZSA9IHN5cy5sb2NhbFN0b3JhZ2UgPSB3aW4ubG9jYWxTdG9yYWdlO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzdG9yYWdlXCIsIFwiXCIpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJzdG9yYWdlXCIpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlID0gbnVsbDtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdmFyIHdhcm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybklEKDUyMDApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHN5cy5sb2NhbFN0b3JhZ2UgPSB7XG4gICAgICAgICAgICAgICAgZ2V0SXRlbSA6IHdhcm4sXG4gICAgICAgICAgICAgICAgc2V0SXRlbSA6IHdhcm4sXG4gICAgICAgICAgICAgICAgcmVtb3ZlSXRlbSA6IHdhcm4sXG4gICAgICAgICAgICAgICAgY2xlYXIgOiB3YXJuXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIF9zdXBwb3J0V2VicCA9IF90bXBDYW52YXMxLnRvRGF0YVVSTCgnaW1hZ2Uvd2VicCcpLnN0YXJ0c1dpdGgoJ2RhdGE6aW1hZ2Uvd2VicCcpO1xuICAgICAgICB2YXIgX3N1cHBvcnRDYW52YXMgPSAhIV90bXBDYW52YXMxLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgdmFyIF9zdXBwb3J0V2ViR0wgPSBmYWxzZTtcbiAgICAgICAgaWYgKENDX1RFU1QpIHtcbiAgICAgICAgICAgIF9zdXBwb3J0V2ViR0wgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh3aW4uV2ViR0xSZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgICAgICAgICBfc3VwcG9ydFdlYkdMID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgY2FwYWJpbGl0aWVzIG9mIHRoZSBjdXJyZW50IHBsYXRmb3JtXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBjYXBhYmlsaXRpZXNcbiAgICAgICAgICovXG4gICAgICAgIHZhciBjYXBhYmlsaXRpZXMgPSBzeXMuY2FwYWJpbGl0aWVzID0ge1xuICAgICAgICAgICAgXCJjYW52YXNcIjogX3N1cHBvcnRDYW52YXMsXG4gICAgICAgICAgICBcIm9wZW5nbFwiOiBfc3VwcG9ydFdlYkdMLFxuICAgICAgICAgICAgXCJ3ZWJwXCI6IF9zdXBwb3J0V2VicCxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGRvY0VsZVsnb250b3VjaHN0YXJ0J10gIT09IHVuZGVmaW5lZCB8fCBkb2NbJ29udG91Y2hzdGFydCddICE9PSB1bmRlZmluZWQgfHwgbmF2Lm1zUG9pbnRlckVuYWJsZWQpXG4gICAgICAgICAgICBjYXBhYmlsaXRpZXNbXCJ0b3VjaGVzXCJdID0gdHJ1ZTtcbiAgICAgICAgaWYgKGRvY0VsZVsnb25tb3VzZXVwJ10gIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIGNhcGFiaWxpdGllc1tcIm1vdXNlXCJdID0gdHJ1ZTtcbiAgICAgICAgaWYgKGRvY0VsZVsnb25rZXl1cCddICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBjYXBhYmlsaXRpZXNbXCJrZXlib2FyZFwiXSA9IHRydWU7XG4gICAgICAgIGlmICh3aW4uRGV2aWNlTW90aW9uRXZlbnQgfHwgd2luLkRldmljZU9yaWVudGF0aW9uRXZlbnQpXG4gICAgICAgICAgICBjYXBhYmlsaXRpZXNbXCJhY2NlbGVyb21ldGVyXCJdID0gdHJ1ZTtcblxuICAgICAgICB2YXIgX19hdWRpb1N1cHBvcnQ7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEF1ZGlvIHN1cHBvcnQgaW4gdGhlIGJyb3dzZXJcbiAgICAgICAgICpcbiAgICAgICAgICogTVVMVElfQ0hBTk5FTCAgICAgICAgOiBNdWx0aXBsZSBhdWRpbyB3aGlsZSBwbGF5aW5nIC0gSWYgaXQgZG9lc24ndCwgeW91IGNhbiBvbmx5IHBsYXkgYmFja2dyb3VuZCBtdXNpY1xuICAgICAgICAgKiBXRUJfQVVESU8gICAgICAgICAgICA6IFN1cHBvcnQgZm9yIFdlYkF1ZGlvIC0gU3VwcG9ydCBXM0MgV2ViQXVkaW8gc3RhbmRhcmRzLCBhbGwgb2YgdGhlIGF1ZGlvIGNhbiBiZSBwbGF5ZWRcbiAgICAgICAgICogQVVUT1BMQVkgICAgICAgICAgICAgOiBTdXBwb3J0cyBhdXRvLXBsYXkgYXVkaW8gLSBpZiBEb27igJh0IHN1cHBvcnQgaXQsIE9uIGEgdG91Y2ggZGV0ZWN0aW5nIGJhY2tncm91bmQgbXVzaWMgY2FudmFzLCBhbmQgdGhlbiByZXBsYXlcbiAgICAgICAgICogUkVQTEFZX0FGVEVSX1RPVUNIICAgOiBUaGUgZmlyc3QgbXVzaWMgd2lsbCBmYWlsLCBtdXN0IGJlIHJlcGxheSBhZnRlciB0b3VjaHN0YXJ0XG4gICAgICAgICAqIFVTRV9FTVBUSUVEX0VWRU5UICAgIDogV2hldGhlciB0byB1c2UgdGhlIGVtcHRpZWQgZXZlbnQgdG8gcmVwbGFjZSBsb2FkIGNhbGxiYWNrXG4gICAgICAgICAqIERFTEFZX0NSRUFURV9DVFggICAgIDogZGVsYXkgY3JlYXRlZCB0aGUgY29udGV4dCBvYmplY3QgLSBvbmx5IHdlYkF1ZGlvXG4gICAgICAgICAqIE5FRURfTUFOVUFMX0xPT1AgICAgIDogbG9vcCBhdHRyaWJ1dGUgZmFpbHVyZSwgbmVlZCB0byBwZXJmb3JtIGxvb3AgbWFudWFsbHlcbiAgICAgICAgICpcbiAgICAgICAgICogTWF5IGJlIG1vZGlmaWNhdGlvbnMgZm9yIGEgZmV3IGJyb3dzZXIgdmVyc2lvblxuICAgICAgICAgKi9cbiAgICAgICAgKGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgIHZhciBERUJVRyA9IGZhbHNlO1xuXG4gICAgICAgICAgICB2YXIgdmVyc2lvbiA9IHN5cy5icm93c2VyVmVyc2lvbjtcblxuICAgICAgICAgICAgLy8gY2hlY2sgaWYgYnJvd3NlciBzdXBwb3J0cyBXZWIgQXVkaW9cbiAgICAgICAgICAgIC8vIGNoZWNrIFdlYiBBdWRpbydzIGNvbnRleHRcbiAgICAgICAgICAgIHZhciBzdXBwb3J0V2ViQXVkaW8gPSAhISh3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQgfHwgd2luZG93Lm1vekF1ZGlvQ29udGV4dCk7XG5cbiAgICAgICAgICAgIF9fYXVkaW9TdXBwb3J0ID0geyBPTkxZX09ORTogZmFsc2UsIFdFQl9BVURJTzogc3VwcG9ydFdlYkF1ZGlvLCBERUxBWV9DUkVBVEVfQ1RYOiBmYWxzZSB9O1xuXG4gICAgICAgICAgICBpZiAoc3lzLm9zID09PSBzeXMuT1NfSU9TKSB7XG4gICAgICAgICAgICAgICAgLy8gSU9TIG5vIGV2ZW50IHRoYXQgdXNlZCB0byBwYXJzZSBjb21wbGV0ZWQgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAvLyB0aGlzIHRpbWUgaXMgbm90IGNvbXBsZXRlLCBjYW4gbm90IHBsYXlcbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIF9fYXVkaW9TdXBwb3J0LlVTRV9MT0FERVJfRVZFTlQgPSAnbG9hZGVkbWV0YWRhdGEnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc3lzLmJyb3dzZXJUeXBlID09PSBzeXMuQlJPV1NFUl9UWVBFX0ZJUkVGT1gpIHtcbiAgICAgICAgICAgICAgICBfX2F1ZGlvU3VwcG9ydC5ERUxBWV9DUkVBVEVfQ1RYID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBfX2F1ZGlvU3VwcG9ydC5VU0VfTE9BREVSX0VWRU5UID0gJ2NhbnBsYXknO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc3lzLm9zID09PSBzeXMuT1NfQU5EUk9JRCkge1xuICAgICAgICAgICAgICAgIGlmIChzeXMuYnJvd3NlclR5cGUgPT09IHN5cy5CUk9XU0VSX1RZUEVfVUMpIHtcbiAgICAgICAgICAgICAgICAgICAgX19hdWRpb1N1cHBvcnQuT05FX1NPVVJDRSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihERUJVRyl7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBjYy5sb2coJ2Jyb3dzZSB0eXBlOiAnICsgc3lzLmJyb3dzZXJUeXBlKTtcbiAgICAgICAgICAgICAgICAgICAgY2MubG9nKCdicm93c2UgdmVyc2lvbjogJyArIHZlcnNpb24pO1xuICAgICAgICAgICAgICAgICAgICBjYy5sb2coJ01VTFRJX0NIQU5ORUw6ICcgKyBfX2F1ZGlvU3VwcG9ydC5NVUxUSV9DSEFOTkVMKTtcbiAgICAgICAgICAgICAgICAgICAgY2MubG9nKCdXRUJfQVVESU86ICcgKyBfX2F1ZGlvU3VwcG9ydC5XRUJfQVVESU8pO1xuICAgICAgICAgICAgICAgICAgICBjYy5sb2coJ0FVVE9QTEFZOiAnICsgX19hdWRpb1N1cHBvcnQuQVVUT1BMQVkpO1xuICAgICAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSgpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoX19hdWRpb1N1cHBvcnQuV0VCX0FVRElPKSB7XG4gICAgICAgICAgICAgICAgX19hdWRpb1N1cHBvcnQuY29udGV4dCA9IG5ldyAod2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0IHx8IHdpbmRvdy5tb3pBdWRpb0NvbnRleHQpKCk7XG4gICAgICAgICAgICAgICAgaWYoX19hdWRpb1N1cHBvcnQuREVMQVlfQ1JFQVRFX0NUWCkge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IF9fYXVkaW9TdXBwb3J0LmNvbnRleHQgPSBuZXcgKHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCB8fCB3aW5kb3cubW96QXVkaW9Db250ZXh0KSgpOyB9LCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgIF9fYXVkaW9TdXBwb3J0LldFQl9BVURJTyA9IGZhbHNlO1xuICAgICAgICAgICAgY2MubG9nSUQoNTIwMSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZm9ybWF0U3VwcG9ydCA9IFtdO1xuXG4gICAgICAgIChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIGF1ZGlvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXVkaW8nKTtcbiAgICAgICAgICAgIGlmKGF1ZGlvLmNhblBsYXlUeXBlKSB7XG4gICAgICAgICAgICAgICAgdmFyIG9nZyA9IGF1ZGlvLmNhblBsYXlUeXBlKCdhdWRpby9vZ2c7IGNvZGVjcz1cInZvcmJpc1wiJyk7XG4gICAgICAgICAgICAgICAgaWYgKG9nZykgZm9ybWF0U3VwcG9ydC5wdXNoKCcub2dnJyk7XG4gICAgICAgICAgICAgICAgdmFyIG1wMyA9IGF1ZGlvLmNhblBsYXlUeXBlKCdhdWRpby9tcGVnJyk7XG4gICAgICAgICAgICAgICAgaWYgKG1wMykgZm9ybWF0U3VwcG9ydC5wdXNoKCcubXAzJyk7XG4gICAgICAgICAgICAgICAgdmFyIHdhdiA9IGF1ZGlvLmNhblBsYXlUeXBlKCdhdWRpby93YXY7IGNvZGVjcz1cIjFcIicpO1xuICAgICAgICAgICAgICAgIGlmICh3YXYpIGZvcm1hdFN1cHBvcnQucHVzaCgnLndhdicpO1xuICAgICAgICAgICAgICAgIHZhciBtcDQgPSBhdWRpby5jYW5QbGF5VHlwZSgnYXVkaW8vbXA0Jyk7XG4gICAgICAgICAgICAgICAgaWYgKG1wNCkgZm9ybWF0U3VwcG9ydC5wdXNoKCcubXA0Jyk7XG4gICAgICAgICAgICAgICAgdmFyIG00YSA9IGF1ZGlvLmNhblBsYXlUeXBlKCdhdWRpby94LW00YScpO1xuICAgICAgICAgICAgICAgIGlmIChtNGEpIGZvcm1hdFN1cHBvcnQucHVzaCgnLm00YScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSgpO1xuICAgICAgICBfX2F1ZGlvU3VwcG9ydC5mb3JtYXQgPSBmb3JtYXRTdXBwb3J0O1xuXG4gICAgICAgIHN5cy5fX2F1ZGlvU3VwcG9ydCA9IF9fYXVkaW9TdXBwb3J0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBOZXR3b3JrIHR5cGUgZW51bWVyYXRpb25cbiAgICAgKiAhI3poXG4gICAgICog572R57uc57G75Z6L5p6a5Li+XG4gICAgICpcbiAgICAgKiBAZW51bSBzeXMuTmV0d29ya1R5cGVcbiAgICAgKi9cbiAgICBzeXMuTmV0d29ya1R5cGUgPSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIE5ldHdvcmsgaXMgdW5yZWFjaGFibGUuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog572R57uc5LiN6YCaXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBOT05FXG4gICAgICAgICAqL1xuICAgICAgICBOT05FOiAwLFxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBOZXR3b3JrIGlzIHJlYWNoYWJsZSB2aWEgV2lGaSBvciBjYWJsZS5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDpgJrov4fml6Dnur/miJbogIXmnInnur/mnKzlnLDnvZHnu5zov57mjqXlm6DnibnnvZFcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IExBTlxuICAgICAgICAgKi9cbiAgICAgICAgTEFOOiAxLFxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBOZXR3b3JrIGlzIHJlYWNoYWJsZSB2aWEgV2lyZWxlc3MgV2lkZSBBcmVhIE5ldHdvcmtcbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDpgJrov4fonILnqp3np7vliqjnvZHnu5zov57mjqXlm6DnibnnvZFcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFdXQU5cbiAgICAgICAgICovXG4gICAgICAgIFdXQU46IDJcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQGNsYXNzIHN5c1xuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldCB0aGUgbmV0d29yayB0eXBlIG9mIGN1cnJlbnQgZGV2aWNlLCByZXR1cm4gY2Muc3lzLk5ldHdvcmtUeXBlLkxBTiBpZiBmYWlsdXJlLlxuICAgICAqICEjemhcbiAgICAgKiDojrflj5blvZPliY3orr7lpIfnmoTnvZHnu5znsbvlnossIOWmguaenOe9kee7nOexu+Wei+aXoOazleiOt+WPlu+8jOm7mOiupOWwhui/lOWbniBjYy5zeXMuTmV0d29ya1R5cGUuTEFOXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGdldE5ldHdvcmtUeXBlXG4gICAgICogQHJldHVybiB7TmV0d29ya1R5cGV9XG4gICAgICovXG4gICAgc3lzLmdldE5ldHdvcmtUeXBlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIFRPRE86IG5lZWQgdG8gaW1wbGVtZW50IHRoaXMgZm9yIG1vYmlsZSBwaG9uZXMuXG4gICAgICAgIHJldHVybiBzeXMuTmV0d29ya1R5cGUuTEFOO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogR2V0IHRoZSBiYXR0ZXJ5IGxldmVsIG9mIGN1cnJlbnQgZGV2aWNlLCByZXR1cm4gMS4wIGlmIGZhaWx1cmUuXG4gICAgICogISN6aFxuICAgICAqIOiOt+WPluW9k+WJjeiuvuWkh+eahOeUteaxoOeUtemHj++8jOWmguaenOeUtemHj+aXoOazleiOt+WPlu+8jOm7mOiupOWwhui/lOWbniAxXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGdldEJhdHRlcnlMZXZlbFxuICAgICAqIEByZXR1cm4ge051bWJlcn0gLSAwLjAgfiAxLjBcbiAgICAgKi9cbiAgICBzeXMuZ2V0QmF0dGVyeUxldmVsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIFRPRE86IG5lZWQgdG8gaW1wbGVtZW50IHRoaXMgZm9yIG1vYmlsZSBwaG9uZXMuXG4gICAgICAgIHJldHVybiAxLjA7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEZvcmNlcyB0aGUgZ2FyYmFnZSBjb2xsZWN0aW9uLCBvbmx5IGF2YWlsYWJsZSBpbiBKU0JcbiAgICAgKiBAbWV0aG9kIGdhcmJhZ2VDb2xsZWN0XG4gICAgICovXG4gICAgc3lzLmdhcmJhZ2VDb2xsZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBOL0EgaW4gd2ViXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlc3RhcnQgdGhlIEpTIFZNLCBvbmx5IGF2YWlsYWJsZSBpbiBKU0JcbiAgICAgKiBAbWV0aG9kIHJlc3RhcnRWTVxuICAgICAqL1xuICAgIHN5cy5yZXN0YXJ0Vk0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIE4vQSBpbiB3ZWJcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJldHVybiB0aGUgc2FmZSBhcmVhIHJlY3QuIDxici8+XG4gICAgICogb25seSBhdmFpbGFibGUgb24gdGhlIGlPUyBuYXRpdmUgcGxhdGZvcm0sIG90aGVyd2lzZSBpdCB3aWxsIHJldHVybiBhIHJlY3Qgd2l0aCBkZXNpZ24gcmVzb2x1dGlvbiBzaXplLlxuICAgICAqICEjemhcbiAgICAgKiDov5Tlm57miYvmnLrlsY/luZXlronlhajljLrln5/vvIznm67liY3ku4XlnKggaU9TIOWOn+eUn+W5s+WPsOacieaViOOAguWFtuWug+W5s+WPsOWwhum7mOiupOi/lOWbnuiuvuiuoeWIhui+qOeOh+WwuuWvuOOAglxuICAgICAqIEBtZXRob2QgZ2V0U2FmZUFyZWFSZWN0XG4gICAgICogQHJldHVybiB7UmVjdH1cbiAgICAqL1xuICAgIHN5cy5nZXRTYWZlQXJlYVJlY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCB2aXNpYmxlU2l6ZSA9IGNjLnZpZXcuZ2V0VmlzaWJsZVNpemUoKTtcbiAgICAgICAgcmV0dXJuIGNjLnJlY3QoMCwgMCwgdmlzaWJsZVNpemUud2lkdGgsIHZpc2libGVTaXplLmhlaWdodCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENoZWNrIHdoZXRoZXIgYW4gb2JqZWN0IGlzIHZhbGlkLFxuICAgICAqIEluIHdlYiBlbmdpbmUsIGl0IHdpbGwgcmV0dXJuIHRydWUgaWYgdGhlIG9iamVjdCBleGlzdFxuICAgICAqIEluIG5hdGl2ZSBlbmdpbmUsIGl0IHdpbGwgcmV0dXJuIHRydWUgaWYgdGhlIEpTIG9iamVjdCBhbmQgdGhlIGNvcnJlc3BvbmQgbmF0aXZlIG9iamVjdCBhcmUgYm90aCB2YWxpZFxuICAgICAqIEBtZXRob2QgaXNPYmplY3RWYWxpZFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBWYWxpZGl0eSBvZiB0aGUgb2JqZWN0XG4gICAgICovXG4gICAgc3lzLmlzT2JqZWN0VmFsaWQgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIGlmIChvYmopIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRHVtcCBzeXN0ZW0gaW5mb3JtYXRpb25zXG4gICAgICogQG1ldGhvZCBkdW1wXG4gICAgICovXG4gICAgc3lzLmR1bXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHN0ciA9IFwiXCI7XG4gICAgICAgIHN0ciArPSBcImlzTW9iaWxlIDogXCIgKyBzZWxmLmlzTW9iaWxlICsgXCJcXHJcXG5cIjtcbiAgICAgICAgc3RyICs9IFwibGFuZ3VhZ2UgOiBcIiArIHNlbGYubGFuZ3VhZ2UgKyBcIlxcclxcblwiO1xuICAgICAgICBzdHIgKz0gXCJicm93c2VyVHlwZSA6IFwiICsgc2VsZi5icm93c2VyVHlwZSArIFwiXFxyXFxuXCI7XG4gICAgICAgIHN0ciArPSBcImJyb3dzZXJWZXJzaW9uIDogXCIgKyBzZWxmLmJyb3dzZXJWZXJzaW9uICsgXCJcXHJcXG5cIjtcbiAgICAgICAgc3RyICs9IFwiY2FwYWJpbGl0aWVzIDogXCIgKyBKU09OLnN0cmluZ2lmeShzZWxmLmNhcGFiaWxpdGllcykgKyBcIlxcclxcblwiO1xuICAgICAgICBzdHIgKz0gXCJvcyA6IFwiICsgc2VsZi5vcyArIFwiXFxyXFxuXCI7XG4gICAgICAgIHN0ciArPSBcIm9zVmVyc2lvbiA6IFwiICsgc2VsZi5vc1ZlcnNpb24gKyBcIlxcclxcblwiO1xuICAgICAgICBzdHIgKz0gXCJwbGF0Zm9ybSA6IFwiICsgc2VsZi5wbGF0Zm9ybSArIFwiXFxyXFxuXCI7XG4gICAgICAgIHN0ciArPSBcIlVzaW5nIFwiICsgKGNjLmdhbWUucmVuZGVyVHlwZSA9PT0gY2MuZ2FtZS5SRU5ERVJfVFlQRV9XRUJHTCA/IFwiV0VCR0xcIiA6IFwiQ0FOVkFTXCIpICsgXCIgcmVuZGVyZXIuXCIgKyBcIlxcclxcblwiO1xuICAgICAgICBjYy5sb2coc3RyKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogT3BlbiBhIHVybCBpbiBicm93c2VyXG4gICAgICogQG1ldGhvZCBvcGVuVVJMXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICAgICAqL1xuICAgIHN5cy5vcGVuVVJMID0gZnVuY3Rpb24gKHVybCkge1xuICAgICAgICBpZiAoQ0NfSlNCIHx8IENDX1JVTlRJTUUpIHtcbiAgICAgICAgICAgIGpzYi5vcGVuVVJMKHVybCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB3aW5kb3cub3Blbih1cmwpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBlbGFwc2VkIHNpbmNlIDEgSmFudWFyeSAxOTcwIDAwOjAwOjAwIFVUQy5cbiAgICAgKiBAbWV0aG9kIG5vd1xuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBzeXMubm93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoRGF0ZS5ub3cpIHtcbiAgICAgICAgICAgIHJldHVybiBEYXRlLm5vdygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICsobmV3IERhdGUpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBzeXM7XG59XG5cbnZhciBzeXMgPSBjYyAmJiBjYy5zeXMgPyBjYy5zeXMgOiBpbml0U3lzKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gc3lzO1xuIl19