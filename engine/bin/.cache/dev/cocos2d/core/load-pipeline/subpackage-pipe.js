
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/load-pipeline/subpackage-pipe.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
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
var Pipeline = require('./pipeline');

var ID = 'SubPackPipe';
var UuidRegex = /.*[/\\][0-9a-fA-F]{2}[/\\]([0-9a-fA-F-]{8,})/;

function getUuidFromURL(url) {
  var matches = url.match(UuidRegex);

  if (matches) {
    return matches[1];
  }

  return "";
}

var _uuidToSubPack = Object.create(null);

var SubPackPipe = function SubPackPipe(subpackage) {
  this.id = ID;
  this.async = false;
  this.pipeline = null;

  for (var packName in subpackage) {
    var pack = subpackage[packName];
    pack.uuids && pack.uuids.forEach(function (val) {
      _uuidToSubPack[val] = pack.path;
    });
  }
};

SubPackPipe.ID = ID;

SubPackPipe.prototype.handle = function (item) {
  item.url = this.transformURL(item.url);
  return null;
};

SubPackPipe.prototype.transformURL = function (url) {
  var uuid = getUuidFromURL(url);

  if (uuid) {
    var subpackage = _uuidToSubPack[uuid];

    if (subpackage) {
      // only replace url of native assets
      return url.replace('res/raw-assets/', subpackage + 'raw-assets/');
    }
  }

  return url;
};

Pipeline.SubPackPipe = module.exports = SubPackPipe;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN1YnBhY2thZ2UtcGlwZS5qcyJdLCJuYW1lcyI6WyJQaXBlbGluZSIsInJlcXVpcmUiLCJJRCIsIlV1aWRSZWdleCIsImdldFV1aWRGcm9tVVJMIiwidXJsIiwibWF0Y2hlcyIsIm1hdGNoIiwiX3V1aWRUb1N1YlBhY2siLCJPYmplY3QiLCJjcmVhdGUiLCJTdWJQYWNrUGlwZSIsInN1YnBhY2thZ2UiLCJpZCIsImFzeW5jIiwicGlwZWxpbmUiLCJwYWNrTmFtZSIsInBhY2siLCJ1dWlkcyIsImZvckVhY2giLCJ2YWwiLCJwYXRoIiwicHJvdG90eXBlIiwiaGFuZGxlIiwiaXRlbSIsInRyYW5zZm9ybVVSTCIsInV1aWQiLCJyZXBsYWNlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQkEsSUFBSUEsUUFBUSxHQUFHQyxPQUFPLENBQUMsWUFBRCxDQUF0Qjs7QUFFQSxJQUFNQyxFQUFFLEdBQUcsYUFBWDtBQUNBLElBQU1DLFNBQVMsR0FBRyw4Q0FBbEI7O0FBRUEsU0FBU0MsY0FBVCxDQUF3QkMsR0FBeEIsRUFBNkI7QUFDekIsTUFBSUMsT0FBTyxHQUFHRCxHQUFHLENBQUNFLEtBQUosQ0FBVUosU0FBVixDQUFkOztBQUNBLE1BQUlHLE9BQUosRUFBYTtBQUNULFdBQU9BLE9BQU8sQ0FBQyxDQUFELENBQWQ7QUFDSDs7QUFDRCxTQUFPLEVBQVA7QUFDSDs7QUFFRCxJQUFJRSxjQUFjLEdBQUdDLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLElBQWQsQ0FBckI7O0FBRUEsSUFBSUMsV0FBVyxHQUFHLFNBQWRBLFdBQWMsQ0FBVUMsVUFBVixFQUFzQjtBQUNwQyxPQUFLQyxFQUFMLEdBQVVYLEVBQVY7QUFDQSxPQUFLWSxLQUFMLEdBQWEsS0FBYjtBQUNBLE9BQUtDLFFBQUwsR0FBZ0IsSUFBaEI7O0FBQ0EsT0FBSyxJQUFJQyxRQUFULElBQXFCSixVQUFyQixFQUFpQztBQUM3QixRQUFJSyxJQUFJLEdBQUdMLFVBQVUsQ0FBQ0ksUUFBRCxDQUFyQjtBQUNBQyxJQUFBQSxJQUFJLENBQUNDLEtBQUwsSUFBY0QsSUFBSSxDQUFDQyxLQUFMLENBQVdDLE9BQVgsQ0FBbUIsVUFBVUMsR0FBVixFQUFlO0FBQzVDWixNQUFBQSxjQUFjLENBQUNZLEdBQUQsQ0FBZCxHQUFzQkgsSUFBSSxDQUFDSSxJQUEzQjtBQUNILEtBRmEsQ0FBZDtBQUdIO0FBQ0osQ0FWRDs7QUFZQVYsV0FBVyxDQUFDVCxFQUFaLEdBQWlCQSxFQUFqQjs7QUFFQVMsV0FBVyxDQUFDVyxTQUFaLENBQXNCQyxNQUF0QixHQUErQixVQUFVQyxJQUFWLEVBQWdCO0FBQzNDQSxFQUFBQSxJQUFJLENBQUNuQixHQUFMLEdBQVcsS0FBS29CLFlBQUwsQ0FBa0JELElBQUksQ0FBQ25CLEdBQXZCLENBQVg7QUFDQSxTQUFPLElBQVA7QUFDSCxDQUhEOztBQUtBTSxXQUFXLENBQUNXLFNBQVosQ0FBc0JHLFlBQXRCLEdBQXFDLFVBQVVwQixHQUFWLEVBQWU7QUFDaEQsTUFBSXFCLElBQUksR0FBR3RCLGNBQWMsQ0FBQ0MsR0FBRCxDQUF6Qjs7QUFDQSxNQUFJcUIsSUFBSixFQUFVO0FBQ04sUUFBSWQsVUFBVSxHQUFHSixjQUFjLENBQUNrQixJQUFELENBQS9COztBQUNBLFFBQUlkLFVBQUosRUFBZ0I7QUFDWjtBQUNBLGFBQU9QLEdBQUcsQ0FBQ3NCLE9BQUosQ0FBWSxpQkFBWixFQUErQmYsVUFBVSxHQUFHLGFBQTVDLENBQVA7QUFDSDtBQUNKOztBQUNELFNBQU9QLEdBQVA7QUFDSCxDQVZEOztBQVlBTCxRQUFRLENBQUNXLFdBQVQsR0FBdUJpQixNQUFNLENBQUNDLE9BQVAsR0FBaUJsQixXQUF4QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xudmFyIFBpcGVsaW5lID0gcmVxdWlyZSgnLi9waXBlbGluZScpO1xuXG5jb25zdCBJRCA9ICdTdWJQYWNrUGlwZSc7XG5jb25zdCBVdWlkUmVnZXggPSAvLipbL1xcXFxdWzAtOWEtZkEtRl17Mn1bL1xcXFxdKFswLTlhLWZBLUYtXXs4LH0pLztcblxuZnVuY3Rpb24gZ2V0VXVpZEZyb21VUkwodXJsKSB7XG4gICAgdmFyIG1hdGNoZXMgPSB1cmwubWF0Y2goVXVpZFJlZ2V4KTtcbiAgICBpZiAobWF0Y2hlcykge1xuICAgICAgICByZXR1cm4gbWF0Y2hlc1sxXTtcbiAgICB9XG4gICAgcmV0dXJuIFwiXCI7XG59XG5cbnZhciBfdXVpZFRvU3ViUGFjayA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbnZhciBTdWJQYWNrUGlwZSA9IGZ1bmN0aW9uIChzdWJwYWNrYWdlKSB7XG4gICAgdGhpcy5pZCA9IElEO1xuICAgIHRoaXMuYXN5bmMgPSBmYWxzZTtcbiAgICB0aGlzLnBpcGVsaW5lID0gbnVsbDtcbiAgICBmb3IgKHZhciBwYWNrTmFtZSBpbiBzdWJwYWNrYWdlKSB7XG4gICAgICAgIHZhciBwYWNrID0gc3VicGFja2FnZVtwYWNrTmFtZV07XG4gICAgICAgIHBhY2sudXVpZHMgJiYgcGFjay51dWlkcy5mb3JFYWNoKGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgIF91dWlkVG9TdWJQYWNrW3ZhbF0gPSBwYWNrLnBhdGg7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cblN1YlBhY2tQaXBlLklEID0gSUQ7XG5cblN1YlBhY2tQaXBlLnByb3RvdHlwZS5oYW5kbGUgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgIGl0ZW0udXJsID0gdGhpcy50cmFuc2Zvcm1VUkwoaXRlbS51cmwpO1xuICAgIHJldHVybiBudWxsO1xufTtcblxuU3ViUGFja1BpcGUucHJvdG90eXBlLnRyYW5zZm9ybVVSTCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgICB2YXIgdXVpZCA9IGdldFV1aWRGcm9tVVJMKHVybCk7XG4gICAgaWYgKHV1aWQpIHtcbiAgICAgICAgdmFyIHN1YnBhY2thZ2UgPSBfdXVpZFRvU3ViUGFja1t1dWlkXTtcbiAgICAgICAgaWYgKHN1YnBhY2thZ2UpIHtcbiAgICAgICAgICAgIC8vIG9ubHkgcmVwbGFjZSB1cmwgb2YgbmF0aXZlIGFzc2V0c1xuICAgICAgICAgICAgcmV0dXJuIHVybC5yZXBsYWNlKCdyZXMvcmF3LWFzc2V0cy8nLCBzdWJwYWNrYWdlICsgJ3Jhdy1hc3NldHMvJyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHVybDtcbn07XG5cblBpcGVsaW5lLlN1YlBhY2tQaXBlID0gbW9kdWxlLmV4cG9ydHMgPSBTdWJQYWNrUGlwZTtcbiJdfQ==