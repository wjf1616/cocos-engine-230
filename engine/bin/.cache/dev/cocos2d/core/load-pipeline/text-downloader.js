
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/load-pipeline/text-downloader.js';
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
var urlAppendTimestamp = require('./utils').urlAppendTimestamp;

module.exports = function (item, callback) {
  var url = item.url;
  url = urlAppendTimestamp(url);
  var xhr = cc.loader.getXMLHttpRequest(),
      errInfo = 'Load text file failed: ' + url;
  xhr.open('GET', url, true);
  if (xhr.overrideMimeType) xhr.overrideMimeType('text\/plain; charset=utf-8');

  xhr.onload = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200 || xhr.status === 0) {
        callback(null, xhr.responseText);
      } else {
        callback({
          status: xhr.status,
          errorMessage: errInfo + '(wrong status)'
        });
      }
    } else {
      callback({
        status: xhr.status,
        errorMessage: errInfo + '(wrong readyState)'
      });
    }
  };

  xhr.onerror = function () {
    callback({
      status: xhr.status,
      errorMessage: errInfo + '(error)'
    });
  };

  xhr.ontimeout = function () {
    callback({
      status: xhr.status,
      errorMessage: errInfo + '(time out)'
    });
  };

  xhr.send(null);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRleHQtZG93bmxvYWRlci5qcyJdLCJuYW1lcyI6WyJ1cmxBcHBlbmRUaW1lc3RhbXAiLCJyZXF1aXJlIiwibW9kdWxlIiwiZXhwb3J0cyIsIml0ZW0iLCJjYWxsYmFjayIsInVybCIsInhociIsImNjIiwibG9hZGVyIiwiZ2V0WE1MSHR0cFJlcXVlc3QiLCJlcnJJbmZvIiwib3BlbiIsIm92ZXJyaWRlTWltZVR5cGUiLCJvbmxvYWQiLCJyZWFkeVN0YXRlIiwic3RhdHVzIiwicmVzcG9uc2VUZXh0IiwiZXJyb3JNZXNzYWdlIiwib25lcnJvciIsIm9udGltZW91dCIsInNlbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBLElBQUlBLGtCQUFrQixHQUFHQyxPQUFPLENBQUMsU0FBRCxDQUFQLENBQW1CRCxrQkFBNUM7O0FBRUFFLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQixVQUFVQyxJQUFWLEVBQWdCQyxRQUFoQixFQUEwQjtBQUN2QyxNQUFJQyxHQUFHLEdBQUdGLElBQUksQ0FBQ0UsR0FBZjtBQUNBQSxFQUFBQSxHQUFHLEdBQUdOLGtCQUFrQixDQUFDTSxHQUFELENBQXhCO0FBRUEsTUFBSUMsR0FBRyxHQUFHQyxFQUFFLENBQUNDLE1BQUgsQ0FBVUMsaUJBQVYsRUFBVjtBQUFBLE1BQ0lDLE9BQU8sR0FBRyw0QkFBNEJMLEdBRDFDO0FBRUFDLEVBQUFBLEdBQUcsQ0FBQ0ssSUFBSixDQUFTLEtBQVQsRUFBZ0JOLEdBQWhCLEVBQXFCLElBQXJCO0FBQ0EsTUFBSUMsR0FBRyxDQUFDTSxnQkFBUixFQUEwQk4sR0FBRyxDQUFDTSxnQkFBSixDQUFxQiw0QkFBckI7O0FBQzFCTixFQUFBQSxHQUFHLENBQUNPLE1BQUosR0FBYSxZQUFZO0FBQ3JCLFFBQUlQLEdBQUcsQ0FBQ1EsVUFBSixLQUFtQixDQUF2QixFQUEwQjtBQUN0QixVQUFJUixHQUFHLENBQUNTLE1BQUosS0FBZSxHQUFmLElBQXNCVCxHQUFHLENBQUNTLE1BQUosS0FBZSxDQUF6QyxFQUE0QztBQUN4Q1gsUUFBQUEsUUFBUSxDQUFDLElBQUQsRUFBT0UsR0FBRyxDQUFDVSxZQUFYLENBQVI7QUFDSCxPQUZELE1BR0s7QUFDRFosUUFBQUEsUUFBUSxDQUFDO0FBQUNXLFVBQUFBLE1BQU0sRUFBQ1QsR0FBRyxDQUFDUyxNQUFaO0FBQW9CRSxVQUFBQSxZQUFZLEVBQUNQLE9BQU8sR0FBRztBQUEzQyxTQUFELENBQVI7QUFDSDtBQUNKLEtBUEQsTUFRSztBQUNETixNQUFBQSxRQUFRLENBQUM7QUFBQ1csUUFBQUEsTUFBTSxFQUFDVCxHQUFHLENBQUNTLE1BQVo7QUFBb0JFLFFBQUFBLFlBQVksRUFBQ1AsT0FBTyxHQUFHO0FBQTNDLE9BQUQsQ0FBUjtBQUNIO0FBQ0osR0FaRDs7QUFhQUosRUFBQUEsR0FBRyxDQUFDWSxPQUFKLEdBQWMsWUFBVTtBQUNwQmQsSUFBQUEsUUFBUSxDQUFDO0FBQUNXLE1BQUFBLE1BQU0sRUFBQ1QsR0FBRyxDQUFDUyxNQUFaO0FBQW9CRSxNQUFBQSxZQUFZLEVBQUNQLE9BQU8sR0FBRztBQUEzQyxLQUFELENBQVI7QUFDSCxHQUZEOztBQUdBSixFQUFBQSxHQUFHLENBQUNhLFNBQUosR0FBZ0IsWUFBVTtBQUN0QmYsSUFBQUEsUUFBUSxDQUFDO0FBQUNXLE1BQUFBLE1BQU0sRUFBQ1QsR0FBRyxDQUFDUyxNQUFaO0FBQW9CRSxNQUFBQSxZQUFZLEVBQUNQLE9BQU8sR0FBRztBQUEzQyxLQUFELENBQVI7QUFDSCxHQUZEOztBQUdBSixFQUFBQSxHQUFHLENBQUNjLElBQUosQ0FBUyxJQUFUO0FBQ0gsQ0E1QkQiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG52YXIgdXJsQXBwZW5kVGltZXN0YW1wID0gcmVxdWlyZSgnLi91dGlscycpLnVybEFwcGVuZFRpbWVzdGFtcDtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSwgY2FsbGJhY2spIHtcbiAgICB2YXIgdXJsID0gaXRlbS51cmw7XG4gICAgdXJsID0gdXJsQXBwZW5kVGltZXN0YW1wKHVybCk7XG5cbiAgICB2YXIgeGhyID0gY2MubG9hZGVyLmdldFhNTEh0dHBSZXF1ZXN0KCksXG4gICAgICAgIGVyckluZm8gPSAnTG9hZCB0ZXh0IGZpbGUgZmFpbGVkOiAnICsgdXJsO1xuICAgIHhoci5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuICAgIGlmICh4aHIub3ZlcnJpZGVNaW1lVHlwZSkgeGhyLm92ZXJyaWRlTWltZVR5cGUoJ3RleHRcXC9wbGFpbjsgY2hhcnNldD11dGYtOCcpO1xuICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCB8fCB4aHIuc3RhdHVzID09PSAwKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayh7c3RhdHVzOnhoci5zdGF0dXMsIGVycm9yTWVzc2FnZTplcnJJbmZvICsgJyh3cm9uZyBzdGF0dXMpJ30pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2FsbGJhY2soe3N0YXR1czp4aHIuc3RhdHVzLCBlcnJvck1lc3NhZ2U6ZXJySW5mbyArICcod3JvbmcgcmVhZHlTdGF0ZSknfSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKXtcbiAgICAgICAgY2FsbGJhY2soe3N0YXR1czp4aHIuc3RhdHVzLCBlcnJvck1lc3NhZ2U6ZXJySW5mbyArICcoZXJyb3IpJ30pO1xuICAgIH07XG4gICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGNhbGxiYWNrKHtzdGF0dXM6eGhyLnN0YXR1cywgZXJyb3JNZXNzYWdlOmVyckluZm8gKyAnKHRpbWUgb3V0KSd9KTtcbiAgICB9O1xuICAgIHhoci5zZW5kKG51bGwpO1xufTsiXX0=