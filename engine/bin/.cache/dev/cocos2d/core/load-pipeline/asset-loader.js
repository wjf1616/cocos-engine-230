
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/load-pipeline/asset-loader.js';
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
require('../utils/CCPath');

var debug = require('../CCDebug');

var Pipeline = require('./pipeline');

var LoadingItems = require('./loading-items');

var ID = 'AssetLoader';

var AssetLoader = function AssetLoader(extMap) {
  this.id = ID;
  this.async = true;
  this.pipeline = null;
};

AssetLoader.ID = ID;
var reusedArray = [];

AssetLoader.prototype.handle = function (item, callback) {
  var uuid = item.uuid;

  if (!uuid) {
    return item.content || null;
  }

  var self = this;
  cc.AssetLibrary.queryAssetInfo(uuid, function (error, url, isRawAsset) {
    if (error) {
      callback(error);
    } else {
      item.url = item.rawUrl = url;
      item.isRawAsset = isRawAsset;

      if (isRawAsset) {
        var ext = cc.path.extname(url).toLowerCase();

        if (!ext) {
          callback(new Error(debug.getError(4931, uuid, url)));
          return;
        }

        ext = ext.substr(1);
        var queue = LoadingItems.getQueue(item);
        reusedArray[0] = {
          queueId: item.queueId,
          id: url,
          url: url,
          type: ext,
          error: null,
          alias: item,
          complete: true
        };

        if (CC_EDITOR) {
          self.pipeline._cache[url] = reusedArray[0];
        }

        queue.append(reusedArray); // Dispatch to other raw type downloader

        item.type = ext;
        callback(null, item.content);
      } else {
        item.type = 'uuid';
        callback(null, item.content);
      }
    }
  });
};

Pipeline.AssetLoader = module.exports = AssetLoader;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0LWxvYWRlci5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiZGVidWciLCJQaXBlbGluZSIsIkxvYWRpbmdJdGVtcyIsIklEIiwiQXNzZXRMb2FkZXIiLCJleHRNYXAiLCJpZCIsImFzeW5jIiwicGlwZWxpbmUiLCJyZXVzZWRBcnJheSIsInByb3RvdHlwZSIsImhhbmRsZSIsIml0ZW0iLCJjYWxsYmFjayIsInV1aWQiLCJjb250ZW50Iiwic2VsZiIsImNjIiwiQXNzZXRMaWJyYXJ5IiwicXVlcnlBc3NldEluZm8iLCJlcnJvciIsInVybCIsImlzUmF3QXNzZXQiLCJyYXdVcmwiLCJleHQiLCJwYXRoIiwiZXh0bmFtZSIsInRvTG93ZXJDYXNlIiwiRXJyb3IiLCJnZXRFcnJvciIsInN1YnN0ciIsInF1ZXVlIiwiZ2V0UXVldWUiLCJxdWV1ZUlkIiwidHlwZSIsImFsaWFzIiwiY29tcGxldGUiLCJDQ19FRElUT1IiLCJfY2FjaGUiLCJhcHBlbmQiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkFBLE9BQU8sQ0FBQyxpQkFBRCxDQUFQOztBQUNBLElBQU1DLEtBQUssR0FBR0QsT0FBTyxDQUFDLFlBQUQsQ0FBckI7O0FBQ0EsSUFBTUUsUUFBUSxHQUFHRixPQUFPLENBQUMsWUFBRCxDQUF4Qjs7QUFDQSxJQUFNRyxZQUFZLEdBQUdILE9BQU8sQ0FBQyxpQkFBRCxDQUE1Qjs7QUFFQSxJQUFJSSxFQUFFLEdBQUcsYUFBVDs7QUFFQSxJQUFJQyxXQUFXLEdBQUcsU0FBZEEsV0FBYyxDQUFVQyxNQUFWLEVBQWtCO0FBQ2hDLE9BQUtDLEVBQUwsR0FBVUgsRUFBVjtBQUNBLE9BQUtJLEtBQUwsR0FBYSxJQUFiO0FBQ0EsT0FBS0MsUUFBTCxHQUFnQixJQUFoQjtBQUNILENBSkQ7O0FBS0FKLFdBQVcsQ0FBQ0QsRUFBWixHQUFpQkEsRUFBakI7QUFFQSxJQUFJTSxXQUFXLEdBQUcsRUFBbEI7O0FBQ0FMLFdBQVcsQ0FBQ00sU0FBWixDQUFzQkMsTUFBdEIsR0FBK0IsVUFBVUMsSUFBVixFQUFnQkMsUUFBaEIsRUFBMEI7QUFDckQsTUFBSUMsSUFBSSxHQUFHRixJQUFJLENBQUNFLElBQWhCOztBQUNBLE1BQUksQ0FBQ0EsSUFBTCxFQUFXO0FBQ1AsV0FBT0YsSUFBSSxDQUFDRyxPQUFMLElBQWdCLElBQXZCO0FBQ0g7O0FBRUQsTUFBSUMsSUFBSSxHQUFHLElBQVg7QUFDQUMsRUFBQUEsRUFBRSxDQUFDQyxZQUFILENBQWdCQyxjQUFoQixDQUErQkwsSUFBL0IsRUFBcUMsVUFBVU0sS0FBVixFQUFpQkMsR0FBakIsRUFBc0JDLFVBQXRCLEVBQWtDO0FBQ25FLFFBQUlGLEtBQUosRUFBVztBQUNQUCxNQUFBQSxRQUFRLENBQUNPLEtBQUQsQ0FBUjtBQUNILEtBRkQsTUFHSztBQUNEUixNQUFBQSxJQUFJLENBQUNTLEdBQUwsR0FBV1QsSUFBSSxDQUFDVyxNQUFMLEdBQWNGLEdBQXpCO0FBQ0FULE1BQUFBLElBQUksQ0FBQ1UsVUFBTCxHQUFrQkEsVUFBbEI7O0FBQ0EsVUFBSUEsVUFBSixFQUFnQjtBQUNaLFlBQUlFLEdBQUcsR0FBR1AsRUFBRSxDQUFDUSxJQUFILENBQVFDLE9BQVIsQ0FBZ0JMLEdBQWhCLEVBQXFCTSxXQUFyQixFQUFWOztBQUNBLFlBQUksQ0FBQ0gsR0FBTCxFQUFVO0FBQ05YLFVBQUFBLFFBQVEsQ0FBQyxJQUFJZSxLQUFKLENBQVU1QixLQUFLLENBQUM2QixRQUFOLENBQWUsSUFBZixFQUFxQmYsSUFBckIsRUFBMkJPLEdBQTNCLENBQVYsQ0FBRCxDQUFSO0FBQ0E7QUFDSDs7QUFDREcsUUFBQUEsR0FBRyxHQUFHQSxHQUFHLENBQUNNLE1BQUosQ0FBVyxDQUFYLENBQU47QUFDQSxZQUFJQyxLQUFLLEdBQUc3QixZQUFZLENBQUM4QixRQUFiLENBQXNCcEIsSUFBdEIsQ0FBWjtBQUNBSCxRQUFBQSxXQUFXLENBQUMsQ0FBRCxDQUFYLEdBQWlCO0FBQ2J3QixVQUFBQSxPQUFPLEVBQUVyQixJQUFJLENBQUNxQixPQUREO0FBRWIzQixVQUFBQSxFQUFFLEVBQUVlLEdBRlM7QUFHYkEsVUFBQUEsR0FBRyxFQUFFQSxHQUhRO0FBSWJhLFVBQUFBLElBQUksRUFBRVYsR0FKTztBQUtiSixVQUFBQSxLQUFLLEVBQUUsSUFMTTtBQU1iZSxVQUFBQSxLQUFLLEVBQUV2QixJQU5NO0FBT2J3QixVQUFBQSxRQUFRLEVBQUU7QUFQRyxTQUFqQjs7QUFTQSxZQUFJQyxTQUFKLEVBQWU7QUFDWHJCLFVBQUFBLElBQUksQ0FBQ1IsUUFBTCxDQUFjOEIsTUFBZCxDQUFxQmpCLEdBQXJCLElBQTRCWixXQUFXLENBQUMsQ0FBRCxDQUF2QztBQUNIOztBQUNEc0IsUUFBQUEsS0FBSyxDQUFDUSxNQUFOLENBQWE5QixXQUFiLEVBcEJZLENBcUJaOztBQUNBRyxRQUFBQSxJQUFJLENBQUNzQixJQUFMLEdBQVlWLEdBQVo7QUFDQVgsUUFBQUEsUUFBUSxDQUFDLElBQUQsRUFBT0QsSUFBSSxDQUFDRyxPQUFaLENBQVI7QUFDSCxPQXhCRCxNQXlCSztBQUNESCxRQUFBQSxJQUFJLENBQUNzQixJQUFMLEdBQVksTUFBWjtBQUNBckIsUUFBQUEsUUFBUSxDQUFDLElBQUQsRUFBT0QsSUFBSSxDQUFDRyxPQUFaLENBQVI7QUFDSDtBQUNKO0FBQ0osR0FyQ0Q7QUFzQ0gsQ0E3Q0Q7O0FBK0NBZCxRQUFRLENBQUNHLFdBQVQsR0FBdUJvQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJyQyxXQUF4QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnJlcXVpcmUoJy4uL3V0aWxzL0NDUGF0aCcpO1xuY29uc3QgZGVidWcgPSByZXF1aXJlKCcuLi9DQ0RlYnVnJyk7XG5jb25zdCBQaXBlbGluZSA9IHJlcXVpcmUoJy4vcGlwZWxpbmUnKTtcbmNvbnN0IExvYWRpbmdJdGVtcyA9IHJlcXVpcmUoJy4vbG9hZGluZy1pdGVtcycpO1xuXG52YXIgSUQgPSAnQXNzZXRMb2FkZXInO1xuXG52YXIgQXNzZXRMb2FkZXIgPSBmdW5jdGlvbiAoZXh0TWFwKSB7XG4gICAgdGhpcy5pZCA9IElEO1xuICAgIHRoaXMuYXN5bmMgPSB0cnVlO1xuICAgIHRoaXMucGlwZWxpbmUgPSBudWxsO1xufTtcbkFzc2V0TG9hZGVyLklEID0gSUQ7XG5cbnZhciByZXVzZWRBcnJheSA9IFtdO1xuQXNzZXRMb2FkZXIucHJvdG90eXBlLmhhbmRsZSA9IGZ1bmN0aW9uIChpdGVtLCBjYWxsYmFjaykge1xuICAgIHZhciB1dWlkID0gaXRlbS51dWlkO1xuICAgIGlmICghdXVpZCkge1xuICAgICAgICByZXR1cm4gaXRlbS5jb250ZW50IHx8IG51bGw7XG4gICAgfVxuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGNjLkFzc2V0TGlicmFyeS5xdWVyeUFzc2V0SW5mbyh1dWlkLCBmdW5jdGlvbiAoZXJyb3IsIHVybCwgaXNSYXdBc3NldCkge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGl0ZW0udXJsID0gaXRlbS5yYXdVcmwgPSB1cmw7XG4gICAgICAgICAgICBpdGVtLmlzUmF3QXNzZXQgPSBpc1Jhd0Fzc2V0O1xuICAgICAgICAgICAgaWYgKGlzUmF3QXNzZXQpIHtcbiAgICAgICAgICAgICAgICB2YXIgZXh0ID0gY2MucGF0aC5leHRuYW1lKHVybCkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWV4dCkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoZGVidWcuZ2V0RXJyb3IoNDkzMSwgdXVpZCwgdXJsKSkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGV4dCA9IGV4dC5zdWJzdHIoMSk7XG4gICAgICAgICAgICAgICAgdmFyIHF1ZXVlID0gTG9hZGluZ0l0ZW1zLmdldFF1ZXVlKGl0ZW0pO1xuICAgICAgICAgICAgICAgIHJldXNlZEFycmF5WzBdID0ge1xuICAgICAgICAgICAgICAgICAgICBxdWV1ZUlkOiBpdGVtLnF1ZXVlSWQsXG4gICAgICAgICAgICAgICAgICAgIGlkOiB1cmwsXG4gICAgICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBleHQsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBhbGlhczogaXRlbSxcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IHRydWVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5waXBlbGluZS5fY2FjaGVbdXJsXSA9IHJldXNlZEFycmF5WzBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBxdWV1ZS5hcHBlbmQocmV1c2VkQXJyYXkpO1xuICAgICAgICAgICAgICAgIC8vIERpc3BhdGNoIHRvIG90aGVyIHJhdyB0eXBlIGRvd25sb2FkZXJcbiAgICAgICAgICAgICAgICBpdGVtLnR5cGUgPSBleHQ7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgaXRlbS5jb250ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGl0ZW0udHlwZSA9ICd1dWlkJztcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBpdGVtLmNvbnRlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5QaXBlbGluZS5Bc3NldExvYWRlciA9IG1vZHVsZS5leHBvcnRzID0gQXNzZXRMb2FkZXI7Il19