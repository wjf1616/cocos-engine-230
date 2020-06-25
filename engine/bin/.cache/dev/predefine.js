
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/predefine.js';
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
// MACROS

/**
 * !#zh
 * 这里是一些用来判断执行环境的宏，这些宏都是全局变量，直接访问即可。<br>
 * 在项目构建时，这些宏将会被预处理并根据构建的平台剔除不需要的代码，例如
 *
 *     if (CC_DEBUG) {
 *         cc.log('debug');
 *     }
 *     else {
 *         cc.log('release');
 *     }
 *
 * 在构建后会只剩下
 *
 *     cc.log('release');
 *
 * <br>
 * 如需判断脚本是否运行于指定平台，可以用如下表达式：
 *
 *     {
 *         "编辑器":  CC_EDITOR,
 *         "编辑器 或 预览":  CC_DEV,
 *         "编辑器 或 预览 或 构建调试":  CC_DEBUG,
 *         "网页预览":  CC_PREVIEW && !CC_JSB,
 *         "模拟器预览":  CC_PREVIEW && CC_JSB,
 *         "构建调试":  CC_BUILD && CC_DEBUG,
 *         "构建发行":  CC_BUILD && !CC_DEBUG,
 *     }
 *
 * !#en
 * Here are some of the macro used to determine the execution environment, these macros are global variables, can be accessed directly.<br>
 * When the project is built, these macros will be preprocessed and discard unreachable code based on the built platform, for example:
 *
 *     if (CC_DEBUG) {
 *         cc.log('debug');
 *     }
 *     else {
 *         cc.log('release');
 *     }
 *
 * After build will become:
 *
 *     cc.log('release');
 *
 * <br>
 * To determine whether the script is running on the specified platform, you can use the following expression:
 *
 *     {
 *         "editor":  CC_EDITOR,
 *         "editor or preview":  CC_DEV,
 *         "editor or preview or build in debug mode":  CC_DEBUG,
 *         "web preview":  CC_PREVIEW && !CC_JSB,
 *         "simulator preview":  CC_PREVIEW && CC_JSB,
 *         "build in debug mode":  CC_BUILD && CC_DEBUG,
 *         "build in release mode":  CC_BUILD && !CC_DEBUG,
 *     }
 *
 * @module GLOBAL-MACROS
 */

/**
 * @property {Boolean} CC_EDITOR - Running in the editor.
 */

/**
 * @property {Boolean} CC_PREVIEW - Preview in browser or simulator.
 */

/**
 * @property {Boolean} CC_DEV - Running in the editor or preview.
 */

/**
 * @property {Boolean} CC_DEBUG - Running in the editor or preview, or build in debug mode.
 */

/**
 * @property {Boolean} CC_BUILD - Running in published project.
 */

/**
 * @property {Boolean} CC_JSB - Running in native platform (mobile app, desktop app, or simulator).
 */

/**
 * @property {Boolean} CC_TEST - Running in the engine's unit test.
 */

/**
 * @property {Boolean} CC_RUNTIME - Running in runtime environments.
 */
// window may be undefined when first load engine from editor
var _global = typeof window === 'undefined' ? global : window;
/*
 * @param defaultValue - The default value is only used in the editor or preview.
 */


function defineMacro(name, defaultValue) {
  // if "global_defs" not preprocessed by uglify, just declare them globally,
  // this may happened in release version's preview page.
  if (typeof _global[name] === 'undefined') {
    _global[name] = defaultValue;
  }
}

function defineDeprecatedMacroGetter(name, defaultValue) {
  if (typeof _global[name] === 'undefined') {
    Object.defineProperty(_global, name, {
      get: function get() {
        var recommandedUsage;

        if (name === 'CC_WECHATGAMESUB') {
          recommandedUsage = 'cc.sys.platform === cc.sys.WECHAT_GAME_SUB';
        } else if (name === 'CC_WECHATGAME') {
          recommandedUsage = 'cc.sys.platform === cc.sys.WECHAT_GAME';
        } else if (name === 'CC_QQPLAY') {
          recommandedUsage = 'cc.sys.platform === cc.sys.QQ_PLAY';
        }

        cc.warnID(1400, name, recommandedUsage);
        return defaultValue;
      }
    });
  }
}

function defined(name) {
  return typeof _global[name] === 'object';
} // ensure CC_BUILD is defined
// should not use window.CC_BUILD because we need get global_defs defined in uglify


defineMacro('CC_BUILD', false); // These default values can only be defined after building
// If you need to modify them
// please modify the `global_defs` in the option returned by `gulp/util/utils.js: getUglifyOptions`.

if (CC_BUILD) {
  _global.CC_BUILD = CC_BUILD;
  _global.CC_DEV = CC_DEV;
  _global.CC_DEBUG = CC_DEBUG;
  _global.CC_JSB = CC_JSB;
  _global.CC_NATIVERENDERER = CC_NATIVERENDERER;
  _global.CC_SUPPORT_JIT = CC_SUPPORT_JIT;
  _global.CC_PHYSICS_BUILTIN = CC_PHYSICS_BUILTIN;
  _global.CC_PHYSICS_CANNON = CC_PHYSICS_CANNON;
  _global.CC_EDITOR = CC_EDITOR;
  _global.CC_PREVIEW = CC_PREVIEW;
  _global.CC_TEST = CC_TEST;
  _global.CC_RUNTIME = CC_RUNTIME;
  _global.CC_JSB = CC_JSB;
} else {
  defineMacro('CC_DEV', true); // (CC_EDITOR && !CC_BUILD) || CC_PREVIEW || CC_TEST

  defineMacro('CC_DEBUG', true); // CC_DEV || Debug Build

  defineMacro('CC_JSB', defined('jsb'));
  defineMacro('CC_NATIVERENDERER', defined('jsb'));
  defineMacro('CC_SUPPORT_JIT', true);
  defineMacro('CC_PHYSICS_BUILTIN', false);
  defineMacro('CC_PHYSICS_CANNON', true);
  defineMacro('CC_EDITOR', defined('Editor') && defined('process') && 'electron' in process.versions);
  defineMacro('CC_PREVIEW', !CC_EDITOR);
  defineMacro('CC_TEST', defined('tap') || defined('QUnit'));
  defineMacro('CC_RUNTIME', 'function' === typeof loadRuntime);
  defineMacro('CC_JSB', defined('jsb') && !CC_RUNTIME);
} // deprecated 


var WECHATGAMESUB = !!(defined('wx') && wx.getSharedCanvas);
var WECHATGAME = !!(defined('wx') && (wx.getSystemInfoSync || wx.getSharedCanvas));
var QQPLAY = defined('bk');
defineDeprecatedMacroGetter('CC_WECHATGAMESUB', WECHATGAMESUB);
defineDeprecatedMacroGetter('CC_WECHATGAME', WECHATGAME);
defineDeprecatedMacroGetter('CC_QQPLAY', QQPLAY);

if (CC_DEV) {
  /**
   * contains internal apis for unit tests
   * @expose
   */
  cc._Test = {};
}
/**
 * @module cc
 */

/**
 * The current version of Cocos2d being used.<br/>
 * Please DO NOT remove this String, it is an important flag for bug tracking.<br/>
 * If you post a bug to forum, please attach this flag.
 * @property {String} ENGINE_VERSION
 */


var engineVersion = '2.3.0';
_global['CocosEngine'] = cc.ENGINE_VERSION = engineVersion;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByZWRlZmluZS5qcyJdLCJuYW1lcyI6WyJfZ2xvYmFsIiwid2luZG93IiwiZ2xvYmFsIiwiZGVmaW5lTWFjcm8iLCJuYW1lIiwiZGVmYXVsdFZhbHVlIiwiZGVmaW5lRGVwcmVjYXRlZE1hY3JvR2V0dGVyIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXQiLCJyZWNvbW1hbmRlZFVzYWdlIiwiY2MiLCJ3YXJuSUQiLCJkZWZpbmVkIiwiQ0NfQlVJTEQiLCJDQ19ERVYiLCJDQ19ERUJVRyIsIkNDX0pTQiIsIkNDX05BVElWRVJFTkRFUkVSIiwiQ0NfU1VQUE9SVF9KSVQiLCJDQ19QSFlTSUNTX0JVSUxUSU4iLCJDQ19QSFlTSUNTX0NBTk5PTiIsIkNDX0VESVRPUiIsIkNDX1BSRVZJRVciLCJDQ19URVNUIiwiQ0NfUlVOVElNRSIsInByb2Nlc3MiLCJ2ZXJzaW9ucyIsImxvYWRSdW50aW1lIiwiV0VDSEFUR0FNRVNVQiIsInd4IiwiZ2V0U2hhcmVkQ2FudmFzIiwiV0VDSEFUR0FNRSIsImdldFN5c3RlbUluZm9TeW5jIiwiUVFQTEFZIiwiX1Rlc3QiLCJlbmdpbmVWZXJzaW9uIiwiRU5HSU5FX1ZFUlNJT04iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyREE7Ozs7QUFHQTs7OztBQUdBOzs7O0FBR0E7Ozs7QUFHQTs7OztBQUdBOzs7O0FBR0E7Ozs7QUFHQTs7O0FBSUE7QUFDQSxJQUFJQSxPQUFPLEdBQUcsT0FBT0MsTUFBUCxLQUFrQixXQUFsQixHQUFnQ0MsTUFBaEMsR0FBeUNELE1BQXZEO0FBRUE7Ozs7O0FBR0EsU0FBU0UsV0FBVCxDQUFzQkMsSUFBdEIsRUFBNEJDLFlBQTVCLEVBQTBDO0FBQ3RDO0FBQ0E7QUFDQSxNQUFJLE9BQU9MLE9BQU8sQ0FBQ0ks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dXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8vIE1BQ1JPU1xuXG4vKipcbiAqICEjemhcbiAqIOi/memHjOaYr+S4gOS6m+eUqOadpeWIpOaWreaJp+ihjOeOr+Wig+eahOWuj++8jOi/meS6m+Wuj+mDveaYr+WFqOWxgOWPmOmHj++8jOebtOaOpeiuv+mXruWNs+WPr+OAgjxicj5cbiAqIOWcqOmhueebruaehOW7uuaXtu+8jOi/meS6m+Wuj+WwhuS8muiiq+mihOWkhOeQhuW5tuagueaNruaehOW7uueahOW5s+WPsOWJlOmZpOS4jemcgOimgeeahOS7o+egge+8jOS+i+WmglxuICpcbiAqICAgICBpZiAoQ0NfREVCVUcpIHtcbiAqICAgICAgICAgY2MubG9nKCdkZWJ1ZycpO1xuICogICAgIH1cbiAqICAgICBlbHNlIHtcbiAqICAgICAgICAgY2MubG9nKCdyZWxlYXNlJyk7XG4gKiAgICAgfVxuICpcbiAqIOWcqOaehOW7uuWQjuS8muWPquWJqeS4i1xuICpcbiAqICAgICBjYy5sb2coJ3JlbGVhc2UnKTtcbiAqXG4gKiA8YnI+XG4gKiDlpoLpnIDliKTmlq3ohJrmnKzmmK/lkKbov5DooYzkuo7mjIflrprlubPlj7DvvIzlj6/ku6XnlKjlpoLkuIvooajovr7lvI/vvJpcbiAqXG4gKiAgICAge1xuICogICAgICAgICBcIue8lui+keWZqFwiOiAgQ0NfRURJVE9SLFxuICogICAgICAgICBcIue8lui+keWZqCDmiJYg6aKE6KeIXCI6ICBDQ19ERVYsXG4gKiAgICAgICAgIFwi57yW6L6R5ZmoIOaIliDpooTop4gg5oiWIOaehOW7uuiwg+ivlVwiOiAgQ0NfREVCVUcsXG4gKiAgICAgICAgIFwi572R6aG16aKE6KeIXCI6ICBDQ19QUkVWSUVXICYmICFDQ19KU0IsXG4gKiAgICAgICAgIFwi5qih5ouf5Zmo6aKE6KeIXCI6ICBDQ19QUkVWSUVXICYmIENDX0pTQixcbiAqICAgICAgICAgXCLmnoTlu7rosIPor5VcIjogIENDX0JVSUxEICYmIENDX0RFQlVHLFxuICogICAgICAgICBcIuaehOW7uuWPkeihjFwiOiAgQ0NfQlVJTEQgJiYgIUNDX0RFQlVHLFxuICogICAgIH1cbiAqXG4gKiAhI2VuXG4gKiBIZXJlIGFyZSBzb21lIG9mIHRoZSBtYWNybyB1c2VkIHRvIGRldGVybWluZSB0aGUgZXhlY3V0aW9uIGVudmlyb25tZW50LCB0aGVzZSBtYWNyb3MgYXJlIGdsb2JhbCB2YXJpYWJsZXMsIGNhbiBiZSBhY2Nlc3NlZCBkaXJlY3RseS48YnI+XG4gKiBXaGVuIHRoZSBwcm9qZWN0IGlzIGJ1aWx0LCB0aGVzZSBtYWNyb3Mgd2lsbCBiZSBwcmVwcm9jZXNzZWQgYW5kIGRpc2NhcmQgdW5yZWFjaGFibGUgY29kZSBiYXNlZCBvbiB0aGUgYnVpbHQgcGxhdGZvcm0sIGZvciBleGFtcGxlOlxuICpcbiAqICAgICBpZiAoQ0NfREVCVUcpIHtcbiAqICAgICAgICAgY2MubG9nKCdkZWJ1ZycpO1xuICogICAgIH1cbiAqICAgICBlbHNlIHtcbiAqICAgICAgICAgY2MubG9nKCdyZWxlYXNlJyk7XG4gKiAgICAgfVxuICpcbiAqIEFmdGVyIGJ1aWxkIHdpbGwgYmVjb21lOlxuICpcbiAqICAgICBjYy5sb2coJ3JlbGVhc2UnKTtcbiAqXG4gKiA8YnI+XG4gKiBUbyBkZXRlcm1pbmUgd2hldGhlciB0aGUgc2NyaXB0IGlzIHJ1bm5pbmcgb24gdGhlIHNwZWNpZmllZCBwbGF0Zm9ybSwgeW91IGNhbiB1c2UgdGhlIGZvbGxvd2luZyBleHByZXNzaW9uOlxuICpcbiAqICAgICB7XG4gKiAgICAgICAgIFwiZWRpdG9yXCI6ICBDQ19FRElUT1IsXG4gKiAgICAgICAgIFwiZWRpdG9yIG9yIHByZXZpZXdcIjogIENDX0RFVixcbiAqICAgICAgICAgXCJlZGl0b3Igb3IgcHJldmlldyBvciBidWlsZCBpbiBkZWJ1ZyBtb2RlXCI6ICBDQ19ERUJVRyxcbiAqICAgICAgICAgXCJ3ZWIgcHJldmlld1wiOiAgQ0NfUFJFVklFVyAmJiAhQ0NfSlNCLFxuICogICAgICAgICBcInNpbXVsYXRvciBwcmV2aWV3XCI6ICBDQ19QUkVWSUVXICYmIENDX0pTQixcbiAqICAgICAgICAgXCJidWlsZCBpbiBkZWJ1ZyBtb2RlXCI6ICBDQ19CVUlMRCAmJiBDQ19ERUJVRyxcbiAqICAgICAgICAgXCJidWlsZCBpbiByZWxlYXNlIG1vZGVcIjogIENDX0JVSUxEICYmICFDQ19ERUJVRyxcbiAqICAgICB9XG4gKlxuICogQG1vZHVsZSBHTE9CQUwtTUFDUk9TXG4gKi9cbi8qKlxuICogQHByb3BlcnR5IHtCb29sZWFufSBDQ19FRElUT1IgLSBSdW5uaW5nIGluIHRoZSBlZGl0b3IuXG4gKi9cbi8qKlxuICogQHByb3BlcnR5IHtCb29sZWFufSBDQ19QUkVWSUVXIC0gUHJldmlldyBpbiBicm93c2VyIG9yIHNpbXVsYXRvci5cbiAqL1xuLyoqXG4gKiBAcHJvcGVydHkge0Jvb2xlYW59IENDX0RFViAtIFJ1bm5pbmcgaW4gdGhlIGVkaXRvciBvciBwcmV2aWV3LlxuICovXG4vKipcbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gQ0NfREVCVUcgLSBSdW5uaW5nIGluIHRoZSBlZGl0b3Igb3IgcHJldmlldywgb3IgYnVpbGQgaW4gZGVidWcgbW9kZS5cbiAqL1xuLyoqXG4gKiBAcHJvcGVydHkge0Jvb2xlYW59IENDX0JVSUxEIC0gUnVubmluZyBpbiBwdWJsaXNoZWQgcHJvamVjdC5cbiAqL1xuLyoqXG4gKiBAcHJvcGVydHkge0Jvb2xlYW59IENDX0pTQiAtIFJ1bm5pbmcgaW4gbmF0aXZlIHBsYXRmb3JtIChtb2JpbGUgYXBwLCBkZXNrdG9wIGFwcCwgb3Igc2ltdWxhdG9yKS5cbiAqL1xuLyoqXG4gKiBAcHJvcGVydHkge0Jvb2xlYW59IENDX1RFU1QgLSBSdW5uaW5nIGluIHRoZSBlbmdpbmUncyB1bml0IHRlc3QuXG4gKi9cbi8qKlxuICogQHByb3BlcnR5IHtCb29sZWFufSBDQ19SVU5USU1FIC0gUnVubmluZyBpbiBydW50aW1lIGVudmlyb25tZW50cy5cbiAqL1xuXG4vLyB3aW5kb3cgbWF5IGJlIHVuZGVmaW5lZCB3aGVuIGZpcnN0IGxvYWQgZW5naW5lIGZyb20gZWRpdG9yXG52YXIgX2dsb2JhbCA9IHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogd2luZG93O1xuXG4vKlxuICogQHBhcmFtIGRlZmF1bHRWYWx1ZSAtIFRoZSBkZWZhdWx0IHZhbHVlIGlzIG9ubHkgdXNlZCBpbiB0aGUgZWRpdG9yIG9yIHByZXZpZXcuXG4gKi9cbmZ1bmN0aW9uIGRlZmluZU1hY3JvIChuYW1lLCBkZWZhdWx0VmFsdWUpIHtcbiAgICAvLyBpZiBcImdsb2JhbF9kZWZzXCIgbm90IHByZXByb2Nlc3NlZCBieSB1Z2xpZnksIGp1c3QgZGVjbGFyZSB0aGVtIGdsb2JhbGx5LFxuICAgIC8vIHRoaXMgbWF5IGhhcHBlbmVkIGluIHJlbGVhc2UgdmVyc2lvbidzIHByZXZpZXcgcGFnZS5cbiAgICBpZiAodHlwZW9mIF9nbG9iYWxbbmFtZV0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIF9nbG9iYWxbbmFtZV0gPSBkZWZhdWx0VmFsdWU7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkZWZpbmVEZXByZWNhdGVkTWFjcm9HZXR0ZXIgKG5hbWUsIGRlZmF1bHRWYWx1ZSkge1xuICAgIGlmICh0eXBlb2YgX2dsb2JhbFtuYW1lXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KF9nbG9iYWwsIG5hbWUsIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGxldCByZWNvbW1hbmRlZFVzYWdlO1xuICAgICAgICAgICAgICAgIGlmIChuYW1lID09PSAnQ0NfV0VDSEFUR0FNRVNVQicpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVjb21tYW5kZWRVc2FnZSA9ICdjYy5zeXMucGxhdGZvcm0gPT09IGNjLnN5cy5XRUNIQVRfR0FNRV9TVUInO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChuYW1lID09PSAnQ0NfV0VDSEFUR0FNRScpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVjb21tYW5kZWRVc2FnZSA9ICdjYy5zeXMucGxhdGZvcm0gPT09IGNjLnN5cy5XRUNIQVRfR0FNRSc7ICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobmFtZSA9PT0gJ0NDX1FRUExBWScpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVjb21tYW5kZWRVc2FnZSA9ICdjYy5zeXMucGxhdGZvcm0gPT09IGNjLnN5cy5RUV9QTEFZJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2Mud2FybklEKDE0MDAsIG5hbWUsIHJlY29tbWFuZGVkVXNhZ2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZGVmaW5lZCAobmFtZSkge1xuICAgIHJldHVybiB0eXBlb2YgX2dsb2JhbFtuYW1lXSA9PT0gJ29iamVjdCc7XG59XG5cbi8vIGVuc3VyZSBDQ19CVUlMRCBpcyBkZWZpbmVkXG4vLyBzaG91bGQgbm90IHVzZSB3aW5kb3cuQ0NfQlVJTEQgYmVjYXVzZSB3ZSBuZWVkIGdldCBnbG9iYWxfZGVmcyBkZWZpbmVkIGluIHVnbGlmeVxuZGVmaW5lTWFjcm8oJ0NDX0JVSUxEJywgZmFsc2UpO1xuXG4vLyBUaGVzZSBkZWZhdWx0IHZhbHVlcyBjYW4gb25seSBiZSBkZWZpbmVkIGFmdGVyIGJ1aWxkaW5nXG4vLyBJZiB5b3UgbmVlZCB0byBtb2RpZnkgdGhlbVxuLy8gcGxlYXNlIG1vZGlmeSB0aGUgYGdsb2JhbF9kZWZzYCBpbiB0aGUgb3B0aW9uIHJldHVybmVkIGJ5IGBndWxwL3V0aWwvdXRpbHMuanM6IGdldFVnbGlmeU9wdGlvbnNgLlxuaWYgKENDX0JVSUxEKSB7XG4gICAgX2dsb2JhbC5DQ19CVUlMRCA9IENDX0JVSUxEO1xuICAgIF9nbG9iYWwuQ0NfREVWID0gQ0NfREVWO1xuICAgIF9nbG9iYWwuQ0NfREVCVUcgPSBDQ19ERUJVRztcbiAgICBfZ2xvYmFsLkNDX0pTQiA9IENDX0pTQjtcbiAgICBfZ2xvYmFsLkNDX05BVElWRVJFTkRFUkVSID0gQ0NfTkFUSVZFUkVOREVSRVI7XG4gICAgX2dsb2JhbC5DQ19TVVBQT1JUX0pJVCA9IENDX1NVUFBPUlRfSklUO1xuICAgIF9nbG9iYWwuQ0NfUEhZU0lDU19CVUlMVElOID0gQ0NfUEhZU0lDU19CVUlMVElOO1xuICAgIF9nbG9iYWwuQ0NfUEhZU0lDU19DQU5OT04gPSBDQ19QSFlTSUNTX0NBTk5PTjtcbiAgICBfZ2xvYmFsLkNDX0VESVRPUiA9IENDX0VESVRPUjtcbiAgICBfZ2xvYmFsLkNDX1BSRVZJRVcgPSBDQ19QUkVWSUVXO1xuICAgIF9nbG9iYWwuQ0NfVEVTVCA9IENDX1RFU1Q7XG4gICAgX2dsb2JhbC5DQ19SVU5USU1FID0gQ0NfUlVOVElNRTtcbiAgICBfZ2xvYmFsLkNDX0pTQiA9IENDX0pTQjtcbn1cbmVsc2Uge1xuICAgIGRlZmluZU1hY3JvKCdDQ19ERVYnLCB0cnVlKTsgICAgLy8gKENDX0VESVRPUiAmJiAhQ0NfQlVJTEQpIHx8IENDX1BSRVZJRVcgfHwgQ0NfVEVTVFxuICAgIGRlZmluZU1hY3JvKCdDQ19ERUJVRycsIHRydWUpOyAgLy8gQ0NfREVWIHx8IERlYnVnIEJ1aWxkXG4gICAgZGVmaW5lTWFjcm8oJ0NDX0pTQicsIGRlZmluZWQoJ2pzYicpKTtcbiAgICBkZWZpbmVNYWNybygnQ0NfTkFUSVZFUkVOREVSRVInLCBkZWZpbmVkKCdqc2InKSk7XG4gICAgZGVmaW5lTWFjcm8oJ0NDX1NVUFBPUlRfSklUJywgdHJ1ZSk7XG4gICAgZGVmaW5lTWFjcm8oJ0NDX1BIWVNJQ1NfQlVJTFRJTicsIGZhbHNlKTtcbiAgICBkZWZpbmVNYWNybygnQ0NfUEhZU0lDU19DQU5OT04nLCB0cnVlKTtcbiAgICBkZWZpbmVNYWNybygnQ0NfRURJVE9SJywgZGVmaW5lZCgnRWRpdG9yJykgJiYgZGVmaW5lZCgncHJvY2VzcycpICYmICgnZWxlY3Ryb24nIGluIHByb2Nlc3MudmVyc2lvbnMpKTtcbiAgICBkZWZpbmVNYWNybygnQ0NfUFJFVklFVycsICFDQ19FRElUT1IpO1xuICAgIGRlZmluZU1hY3JvKCdDQ19URVNUJywgZGVmaW5lZCgndGFwJykgfHwgZGVmaW5lZCgnUVVuaXQnKSk7XG4gICAgZGVmaW5lTWFjcm8oJ0NDX1JVTlRJTUUnLCAnZnVuY3Rpb24nID09PSB0eXBlb2YgbG9hZFJ1bnRpbWUpO1xuICAgIGRlZmluZU1hY3JvKCdDQ19KU0InLCBkZWZpbmVkKCdqc2InKSAmJiAhQ0NfUlVOVElNRSk7XG59XG5cbi8vIGRlcHJlY2F0ZWQgXG5jb25zdCBXRUNIQVRHQU1FU1VCID0gISEoZGVmaW5lZCgnd3gnKSAmJiB3eC5nZXRTaGFyZWRDYW52YXMpO1xuY29uc3QgV0VDSEFUR0FNRSA9ICEhKGRlZmluZWQoJ3d4JykgJiYgKHd4LmdldFN5c3RlbUluZm9TeW5jIHx8IHd4LmdldFNoYXJlZENhbnZhcykpO1xuY29uc3QgUVFQTEFZID0gZGVmaW5lZCgnYmsnKTtcbmRlZmluZURlcHJlY2F0ZWRNYWNyb0dldHRlcignQ0NfV0VDSEFUR0FNRVNVQicsIFdFQ0hBVEdBTUVTVUIpO1xuZGVmaW5lRGVwcmVjYXRlZE1hY3JvR2V0dGVyKCdDQ19XRUNIQVRHQU1FJywgV0VDSEFUR0FNRSk7XG5kZWZpbmVEZXByZWNhdGVkTWFjcm9HZXR0ZXIoJ0NDX1FRUExBWScsIFFRUExBWSk7XG5cbmlmIChDQ19ERVYpIHtcbiAgICAvKipcbiAgICAgKiBjb250YWlucyBpbnRlcm5hbCBhcGlzIGZvciB1bml0IHRlc3RzXG4gICAgICogQGV4cG9zZVxuICAgICAqL1xuICAgIGNjLl9UZXN0ID0ge307XG59XG5cbi8qKlxuICogQG1vZHVsZSBjY1xuICovXG5cbi8qKlxuICogVGhlIGN1cnJlbnQgdmVyc2lvbiBvZiBDb2NvczJkIGJlaW5nIHVzZWQuPGJyLz5cbiAqIFBsZWFzZSBETyBOT1QgcmVtb3ZlIHRoaXMgU3RyaW5nLCBpdCBpcyBhbiBpbXBvcnRhbnQgZmxhZyBmb3IgYnVnIHRyYWNraW5nLjxici8+XG4gKiBJZiB5b3UgcG9zdCBhIGJ1ZyB0byBmb3J1bSwgcGxlYXNlIGF0dGFjaCB0aGlzIGZsYWcuXG4gKiBAcHJvcGVydHkge1N0cmluZ30gRU5HSU5FX1ZFUlNJT05cbiAqL1xuY29uc3QgZW5naW5lVmVyc2lvbiA9ICcyLjMuMCc7XG5fZ2xvYmFsWydDb2Nvc0VuZ2luZSddID0gY2MuRU5HSU5FX1ZFUlNJT04gPSBlbmdpbmVWZXJzaW9uO1xuIl19