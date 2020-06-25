
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/load-pipeline/audio-downloader.js';
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
var sys = require('../platform/CCSys');

var debug = require('../CCDebug');

var __audioSupport = sys.__audioSupport;
var formatSupport = __audioSupport.format;
var context = __audioSupport.context;

function loadDomAudio(item, callback) {
  var dom = document.createElement('audio');
  dom.src = item.url;

  var clearEvent = function clearEvent() {
    clearTimeout(timer);
    dom.removeEventListener("canplaythrough", success, false);
    dom.removeEventListener("error", failure, false);
    if (__audioSupport.USE_LOADER_EVENT) dom.removeEventListener(__audioSupport.USE_LOADER_EVENT, success, false);
  };

  var timer = setTimeout(function () {
    if (dom.readyState === 0) failure();else success();
  }, 8000);

  var success = function success() {
    clearEvent();
    callback(null, dom);
  };

  var failure = function failure() {
    clearEvent();
    var message = 'load audio failure - ' + item.url;
    cc.log(message);
    callback(message);
  };

  dom.addEventListener("canplaythrough", success, false);
  dom.addEventListener("error", failure, false);
  if (__audioSupport.USE_LOADER_EVENT) dom.addEventListener(__audioSupport.USE_LOADER_EVENT, success, false);
}

function loadWebAudio(item, callback) {
  if (!context) callback(new Error(debug.getError(4926)));
  var request = cc.loader.getXMLHttpRequest();
  request.open("GET", item.url, true);
  request.responseType = "arraybuffer"; // Our asynchronous callback

  request.onload = function () {
    context["decodeAudioData"](request.response, function (buffer) {
      //success
      callback(null, buffer);
    }, function () {
      //error
      callback('decode error - ' + item.id, null);
    });
  };

  request.onerror = function () {
    callback('request error - ' + item.id, null);
  };

  request.send();
}

function downloadAudio(item, callback) {
  if (formatSupport.length === 0) {
    return new Error(debug.getError(4927));
  }

  var loader;

  if (!__audioSupport.WEB_AUDIO) {
    // If WebAudio is not supported, load using DOM mode
    loader = loadDomAudio;
  } else {
    var loadByDeserializedAudio = item._owner instanceof cc.AudioClip;

    if (loadByDeserializedAudio) {
      loader = item._owner.loadMode === cc.AudioClip.LoadMode.WEB_AUDIO ? loadWebAudio : loadDomAudio;
    } else {
      loader = item.urlParam && item.urlParam['useDom'] ? loadDomAudio : loadWebAudio;
    }
  }

  loader(item, callback);
}

module.exports = downloadAudio;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF1ZGlvLWRvd25sb2FkZXIuanMiXSwibmFtZXMiOlsic3lzIiwicmVxdWlyZSIsImRlYnVnIiwiX19hdWRpb1N1cHBvcnQiLCJmb3JtYXRTdXBwb3J0IiwiZm9ybWF0IiwiY29udGV4dCIsImxvYWREb21BdWRpbyIsIml0ZW0iLCJjYWxsYmFjayIsImRvbSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInNyYyIsInVybCIsImNsZWFyRXZlbnQiLCJjbGVhclRpbWVvdXQiLCJ0aW1lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJzdWNjZXNzIiwiZmFpbHVyZSIsIlVTRV9MT0FERVJfRVZFTlQiLCJzZXRUaW1lb3V0IiwicmVhZHlTdGF0ZSIsIm1lc3NhZ2UiLCJjYyIsImxvZyIsImFkZEV2ZW50TGlzdGVuZXIiLCJsb2FkV2ViQXVkaW8iLCJFcnJvciIsImdldEVycm9yIiwicmVxdWVzdCIsImxvYWRlciIsImdldFhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsInJlc3BvbnNlVHlwZSIsIm9ubG9hZCIsInJlc3BvbnNlIiwiYnVmZmVyIiwiaWQiLCJvbmVycm9yIiwic2VuZCIsImRvd25sb2FkQXVkaW8iLCJsZW5ndGgiLCJXRUJfQVVESU8iLCJsb2FkQnlEZXNlcmlhbGl6ZWRBdWRpbyIsIl9vd25lciIsIkF1ZGlvQ2xpcCIsImxvYWRNb2RlIiwiTG9hZE1vZGUiLCJ1cmxQYXJhbSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFNQSxHQUFHLEdBQUdDLE9BQU8sQ0FBQyxtQkFBRCxDQUFuQjs7QUFDQSxJQUFNQyxLQUFLLEdBQUdELE9BQU8sQ0FBQyxZQUFELENBQXJCOztBQUVBLElBQUlFLGNBQWMsR0FBR0gsR0FBRyxDQUFDRyxjQUF6QjtBQUNBLElBQUlDLGFBQWEsR0FBR0QsY0FBYyxDQUFDRSxNQUFuQztBQUNBLElBQUlDLE9BQU8sR0FBR0gs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KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuY29uc3Qgc3lzID0gcmVxdWlyZSgnLi4vcGxhdGZvcm0vQ0NTeXMnKTtcbmNvbnN0IGRlYnVnID0gcmVxdWlyZSgnLi4vQ0NEZWJ1ZycpO1xuXG52YXIgX19hdWRpb1N1cHBvcnQgPSBzeXMuX19hdWRpb1N1cHBvcnQ7XG52YXIgZm9ybWF0U3VwcG9ydCA9IF9fYXVkaW9TdXBwb3J0LmZvcm1hdDtcbnZhciBjb250ZXh0ID0gX19hdWRpb1N1cHBvcnQuY29udGV4dDtcblxuZnVuY3Rpb24gbG9hZERvbUF1ZGlvIChpdGVtLCBjYWxsYmFjaykge1xuICAgIHZhciBkb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdWRpbycpO1xuICAgIGRvbS5zcmMgPSBpdGVtLnVybDtcblxuICAgIHZhciBjbGVhckV2ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgICBkb20ucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNhbnBsYXl0aHJvdWdoXCIsIHN1Y2Nlc3MsIGZhbHNlKTtcbiAgICAgICAgZG9tLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCBmYWlsdXJlLCBmYWxzZSk7XG4gICAgICAgIGlmKF9fYXVkaW9TdXBwb3J0LlVTRV9MT0FERVJfRVZFTlQpXG4gICAgICAgICAgICBkb20ucmVtb3ZlRXZlbnRMaXN0ZW5lcihfX2F1ZGlvU3VwcG9ydC5VU0VfTE9BREVSX0VWRU5ULCBzdWNjZXNzLCBmYWxzZSk7XG4gICAgfTtcbiAgICB2YXIgdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGRvbS5yZWFkeVN0YXRlID09PSAwKVxuICAgICAgICAgICAgZmFpbHVyZSgpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdWNjZXNzKCk7XG4gICAgfSwgODAwMCk7XG4gICAgdmFyIHN1Y2Nlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNsZWFyRXZlbnQoKTtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgZG9tKTtcbiAgICB9O1xuICAgIHZhciBmYWlsdXJlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjbGVhckV2ZW50KCk7XG4gICAgICAgIHZhciBtZXNzYWdlID0gJ2xvYWQgYXVkaW8gZmFpbHVyZSAtICcgKyBpdGVtLnVybDtcbiAgICAgICAgY2MubG9nKG1lc3NhZ2UpO1xuICAgICAgICBjYWxsYmFjayhtZXNzYWdlKTtcbiAgICB9O1xuICAgIGRvbS5hZGRFdmVudExpc3RlbmVyKFwiY2FucGxheXRocm91Z2hcIiwgc3VjY2VzcywgZmFsc2UpO1xuICAgIGRvbS5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgZmFpbHVyZSwgZmFsc2UpO1xuICAgIGlmKF9fYXVkaW9TdXBwb3J0LlVTRV9MT0FERVJfRVZFTlQpXG4gICAgICAgIGRvbS5hZGRFdmVudExpc3RlbmVyKF9fYXVkaW9TdXBwb3J0LlVTRV9MT0FERVJfRVZFTlQsIHN1Y2Nlc3MsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gbG9hZFdlYkF1ZGlvIChpdGVtLCBjYWxsYmFjaykge1xuICAgIGlmICghY29udGV4dClcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKGRlYnVnLmdldEVycm9yKDQ5MjYpKSk7XG5cbiAgICB2YXIgcmVxdWVzdCA9IGNjLmxvYWRlci5nZXRYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcXVlc3Qub3BlbihcIkdFVFwiLCBpdGVtLnVybCwgdHJ1ZSk7XG4gICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSBcImFycmF5YnVmZmVyXCI7XG5cbiAgICAvLyBPdXIgYXN5bmNocm9ub3VzIGNhbGxiYWNrXG4gICAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnRleHRbXCJkZWNvZGVBdWRpb0RhdGFcIl0ocmVxdWVzdC5yZXNwb25zZSwgZnVuY3Rpb24oYnVmZmVyKXtcbiAgICAgICAgICAgIC8vc3VjY2Vzc1xuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgYnVmZmVyKTtcbiAgICAgICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vZXJyb3JcbiAgICAgICAgICAgIGNhbGxiYWNrKCdkZWNvZGUgZXJyb3IgLSAnICsgaXRlbS5pZCwgbnVsbCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbigpe1xuICAgICAgICBjYWxsYmFjaygncmVxdWVzdCBlcnJvciAtICcgKyBpdGVtLmlkLCBudWxsKTtcbiAgICB9O1xuXG4gICAgcmVxdWVzdC5zZW5kKCk7XG59XG5cbmZ1bmN0aW9uIGRvd25sb2FkQXVkaW8gKGl0ZW0sIGNhbGxiYWNrKSB7XG4gICAgaWYgKGZvcm1hdFN1cHBvcnQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBuZXcgRXJyb3IoZGVidWcuZ2V0RXJyb3IoNDkyNykpO1xuICAgIH1cblxuICAgIHZhciBsb2FkZXI7XG4gICAgaWYgKCFfX2F1ZGlvU3VwcG9ydC5XRUJfQVVESU8pIHtcbiAgICAgICAgLy8gSWYgV2ViQXVkaW8gaXMgbm90IHN1cHBvcnRlZCwgbG9hZCB1c2luZyBET00gbW9kZVxuICAgICAgICBsb2FkZXIgPSBsb2FkRG9tQXVkaW87XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgbG9hZEJ5RGVzZXJpYWxpemVkQXVkaW8gPSBpdGVtLl9vd25lciBpbnN0YW5jZW9mIGNjLkF1ZGlvQ2xpcDtcbiAgICAgICAgaWYgKGxvYWRCeURlc2VyaWFsaXplZEF1ZGlvKSB7XG4gICAgICAgICAgICBsb2FkZXIgPSAoaXRlbS5fb3duZXIubG9hZE1vZGUgPT09IGNjLkF1ZGlvQ2xpcC5Mb2FkTW9kZS5XRUJfQVVESU8pID8gbG9hZFdlYkF1ZGlvIDogbG9hZERvbUF1ZGlvO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbG9hZGVyID0gKGl0ZW0udXJsUGFyYW0gJiYgaXRlbS51cmxQYXJhbVsndXNlRG9tJ10pID8gbG9hZERvbUF1ZGlvIDogbG9hZFdlYkF1ZGlvO1xuICAgICAgICB9XG4gICAgfVxuICAgIGxvYWRlcihpdGVtLCBjYWxsYmFjayk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZG93bmxvYWRBdWRpbztcbiJdfQ==