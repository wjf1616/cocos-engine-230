
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/load-pipeline/utils.js';
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
var _noCacheRex = /\?/;
module.exports = {
  //isUrlCrossOrigin: function (url) {
  //    if (!url) {
  //        cc.log('invalid URL');
  //        return false;
  //    }
  //    var startIndex = url.indexOf('://');
  //    if (startIndex === -1)
  //        return false;
  //
  //    var endIndex = url.indexOf('/', startIndex + 3);
  //    var urlOrigin = (endIndex === -1) ? url : url.substring(0, endIndex);
  //    return urlOrigin !== location.origin;
  //},
  urlAppendTimestamp: function urlAppendTimestamp(url) {
    if (cc.game.config['noCache'] && typeof url === 'string') {
      if (_noCacheRex.test(url)) url += '&_t=' + (new Date() - 0);else url += '?_t=' + (new Date() - 0);
    }

    return url;
  }
};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIl0sIm5hbWVzIjpbIl9ub0NhY2hlUmV4IiwibW9kdWxlIiwiZXhwb3J0cyIsInVybEFwcGVuZFRpbWVzdGFtcCIsInVybCIsImNjIiwiZ2FtZSIsImNvbmZpZyIsInRlc3QiLCJEYXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxJQUFJQSxXQUFXLEdBQUcsSUFBbEI7QUFFQUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQUMsRUFBQUEsa0JBQWtCLEVBQUUsNEJBQVVDLEdBQVYsRUFBZTtBQUMvQixRQUFJQyxFQUFFLENBQUNDLElBQUgsQ0FBUUMsTUFBUixDQUFlLFNBQWYsS0FBNkIsT0FBT0gsR0FBUCxLQUFlLFFBQWhELEVBQTBEO0FBQ3RELFVBQUlKLFdBQVcsQ0FBQ1EsSUFBWixDQUFpQkosR0FBakIsQ0FBSixFQUNJQSxHQUFHLElBQUksVUFBVSxJQUFJSyxJQUFKLEtBQWEsQ0FBdkIsQ0FBUCxDQURKLEtBR0lMLEdBQUcsSUFBSSxVQUFVLElBQUlLLElBQUosS0FBYSxDQUF2QixDQUFQO0FBQ1A7O0FBQ0QsV0FBT0wsR0FBUDtBQUNIO0FBdEJZLENBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxudmFyIF9ub0NhY2hlUmV4ID0gL1xcPy87XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIC8vaXNVcmxDcm9zc09yaWdpbjogZnVuY3Rpb24gKHVybCkge1xuICAgIC8vICAgIGlmICghdXJsKSB7XG4gICAgLy8gICAgICAgIGNjLmxvZygnaW52YWxpZCBVUkwnKTtcbiAgICAvLyAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIC8vICAgIH1cbiAgICAvLyAgICB2YXIgc3RhcnRJbmRleCA9IHVybC5pbmRleE9mKCc6Ly8nKTtcbiAgICAvLyAgICBpZiAoc3RhcnRJbmRleCA9PT0gLTEpXG4gICAgLy8gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAvL1xuICAgIC8vICAgIHZhciBlbmRJbmRleCA9IHVybC5pbmRleE9mKCcvJywgc3RhcnRJbmRleCArIDMpO1xuICAgIC8vICAgIHZhciB1cmxPcmlnaW4gPSAoZW5kSW5kZXggPT09IC0xKSA/IHVybCA6IHVybC5zdWJzdHJpbmcoMCwgZW5kSW5kZXgpO1xuICAgIC8vICAgIHJldHVybiB1cmxPcmlnaW4gIT09IGxvY2F0aW9uLm9yaWdpbjtcbiAgICAvL30sXG4gICAgdXJsQXBwZW5kVGltZXN0YW1wOiBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgIGlmIChjYy5nYW1lLmNvbmZpZ1snbm9DYWNoZSddICYmIHR5cGVvZiB1cmwgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZiAoX25vQ2FjaGVSZXgudGVzdCh1cmwpKVxuICAgICAgICAgICAgICAgIHVybCArPSAnJl90PScgKyAobmV3IERhdGUoKSAtIDApO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHVybCArPSAnP190PScgKyAobmV3IERhdGUoKSAtIDApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1cmw7XG4gICAgfVxufTtcbiJdfQ==