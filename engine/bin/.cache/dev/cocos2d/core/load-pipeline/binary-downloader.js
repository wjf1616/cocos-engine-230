
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/load-pipeline/binary-downloader.js';
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
function downloadBinary(item, callback) {
  var url = item.url;
  var xhr = cc.loader.getXMLHttpRequest(),
      errInfo = 'Load binary data failed: ' + url + '';
  xhr.open('GET', url, true);
  xhr.responseType = "arraybuffer";

  xhr.onload = function () {
    var arrayBuffer = xhr.response;

    if (arrayBuffer) {
      var result = new Uint8Array(arrayBuffer);
      callback(null, result);
    } else {
      callback({
        status: xhr.status,
        errorMessage: errInfo + '(no response)'
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
}

module.exports = downloadBinary;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJpbmFyeS1kb3dubG9hZGVyLmpzIl0sIm5hbWVzIjpbImRvd25sb2FkQmluYXJ5IiwiaXRlbSIsImNhbGxiYWNrIiwidXJsIiwieGhyIiwiY2MiLCJsb2FkZXIiLCJnZXRYTUxIdHRwUmVxdWVzdCIsImVyckluZm8iLCJvcGVuIiwicmVzcG9uc2VUeXBlIiwib25sb2FkIiwiYXJyYXlCdWZmZXIiLCJyZXNwb25zZSIsInJlc3VsdCIsIlVpbnQ4QXJyYXkiLCJzdGF0dXMiLCJlcnJvck1lc3NhZ2UiLCJvbmVycm9yIiwib250aW1lb3V0Iiwic2VuZCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxTQUFTQSxjQUFULENBQXlCQyxJQUF6QixFQUErQkMsUUFBL0IsRUFBeUM7QUFDckMsTUFBSUMsR0FBRyxHQUFHRixJQUFJLENBQUNFLEdBQWY7QUFDQSxNQUFJQyxHQUFHLEdBQUdDLEVBQUUsQ0FBQ0MsTUFBSCxDQUFVQyxpQkFBVixFQUFWO0FBQUEsTUFDSUMsT0FBTyxHQUFHLDhCQUE4QkwsR0FBOUIsR0FBb0MsRUFEbEQ7QUFFQUMsRUFBQUEsR0FBRyxDQUFDSyxJQUFKLENBQVMsS0FBVCxFQUFnQk4sR0FBaEIsRUFBcUIsSUFBckI7QUFDQUMsRUFBQUEsR0FBRyxDQUFDTSxZQUFKLEdBQW1CLGFBQW5COztBQUNBTixFQUFBQSxHQUFHLENBQUNPLE1BQUosR0FBYSxZQUFZO0FBQ3JCLFFBQUlDLFdBQVcsR0FBR1IsR0FBRyxDQUFDUyxRQUF0Qjs7QUFDQSxRQUFJRCxXQUFKLEVBQWlCO0FBQ2IsVUFBSUUsTUFBTSxHQUFHLElBQUlDLFVBQUosQ0FBZUgsV0FBZixDQUFiO0FBQ0FWLE1BQUFBLFFBQVEsQ0FBQyxJQUFELEVBQU9ZLE1BQVAsQ0FBUjtBQUNILEtBSEQsTUFJSztBQUNEWixNQUFBQSxRQUFRLENBQUM7QUFBQ2MsUUFBQUEsTUFBTSxFQUFDWixHQUFHLENBQUNZLE1BQVo7QUFBb0JDLFFBQUFBLFlBQVksRUFBQ1QsT0FBTyxHQUFHO0FBQTNDLE9BQUQsQ0FBUjtBQUNIO0FBQ0osR0FURDs7QUFVQUosRUFBQUEsR0FBRyxDQUFDYyxPQUFKLEdBQWMsWUFBVTtBQUNwQmhCLElBQUFBLFFBQVEsQ0FBQztBQUFDYyxNQUFBQSxNQUFNLEVBQUNaLEdBQUcsQ0FBQ1ksTUFBWjtBQUFvQkMsTUFBQUEsWUFBWSxFQUFDVCxPQUFPLEdBQUc7QUFBM0MsS0FBRCxDQUFSO0FBQ0gsR0FGRDs7QUFHQUosRUFBQUEsR0FBRyxDQUFDZSxTQUFKLEdBQWdCLFlBQVU7QUFDdEJqQixJQUFBQSxRQUFRLENBQUM7QUFBQ2MsTUFBQUEsTUFBTSxFQUFDWixHQUFHLENBQUNZLE1BQVo7QUFBb0JDLE1BQUFBLFlBQVksRUFBQ1QsT0FBTyxHQUFHO0FBQTNDLEtBQUQsQ0FBUjtBQUNILEdBRkQ7O0FBR0FKLEVBQUFBLEdBQUcsQ0FBQ2dCLElBQUosQ0FBUyxJQUFUO0FBQ0g7O0FBRURDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnRCLGNBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5mdW5jdGlvbiBkb3dubG9hZEJpbmFyeSAoaXRlbSwgY2FsbGJhY2spIHtcbiAgICB2YXIgdXJsID0gaXRlbS51cmw7XG4gICAgdmFyIHhociA9IGNjLmxvYWRlci5nZXRYTUxIdHRwUmVxdWVzdCgpLFxuICAgICAgICBlcnJJbmZvID0gJ0xvYWQgYmluYXJ5IGRhdGEgZmFpbGVkOiAnICsgdXJsICsgJyc7XG4gICAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gICAgeGhyLnJlc3BvbnNlVHlwZSA9IFwiYXJyYXlidWZmZXJcIjtcbiAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJyYXlCdWZmZXIgPSB4aHIucmVzcG9uc2U7XG4gICAgICAgIGlmIChhcnJheUJ1ZmZlcikge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBVaW50OEFycmF5KGFycmF5QnVmZmVyKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjYWxsYmFjayh7c3RhdHVzOnhoci5zdGF0dXMsIGVycm9yTWVzc2FnZTplcnJJbmZvICsgJyhubyByZXNwb25zZSknfSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKXtcbiAgICAgICAgY2FsbGJhY2soe3N0YXR1czp4aHIuc3RhdHVzLCBlcnJvck1lc3NhZ2U6ZXJySW5mbyArICcoZXJyb3IpJ30pO1xuICAgIH07XG4gICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGNhbGxiYWNrKHtzdGF0dXM6eGhyLnN0YXR1cywgZXJyb3JNZXNzYWdlOmVyckluZm8gKyAnKHRpbWUgb3V0KSd9KTtcbiAgICB9O1xuICAgIHhoci5zZW5kKG51bGwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRvd25sb2FkQmluYXJ5OyJdfQ==