
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/load-pipeline/downloader.js';
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
var js = require('../platform/js');

var debug = require('../CCDebug');

require('../utils/CCPath');

var Pipeline = require('./pipeline');

var PackDownloader = require('./pack-downloader');

var downloadBinary = require('./binary-downloader');

var downloadText = require('./text-downloader');

var urlAppendTimestamp = require('./utils').urlAppendTimestamp;

var downloadAudio;

if (!CC_EDITOR || !Editor.isMainProcess) {
  downloadAudio = require('./audio-downloader');
} else {
  downloadAudio = null;
}

function skip() {
  return null;
}

function downloadScript(item, callback, isAsync) {
  var url = item.url,
      d = document,
      s = document.createElement('script');

  if (window.location.protocol !== 'file:') {
    s.crossOrigin = 'anonymous';
  }

  s.async = isAsync;
  s.src = urlAppendTimestamp(url);

  function loadHandler() {
    s.parentNode.removeChild(s);
    s.removeEventListener('load', loadHandler, false);
    s.removeEventListener('error', errorHandler, false);
    callback(null, url);
  }

  function errorHandler() {
    s.parentNode.removeChild(s);
    s.removeEventListener('load', loadHandler, false);
    s.removeEventListener('error', errorHandler, false);
    callback(new Error(debug.getError(4928, url)));
  }

  s.addEventListener('load', loadHandler, false);
  s.addEventListener('error', errorHandler, false);
  d.body.appendChild(s);
}

function downloadImage(item, callback, isCrossOrigin, img) {
  if (isCrossOrigin === undefined) {
    isCrossOrigin = true;
  }

  var url = urlAppendTimestamp(item.url);
  img = img || new Image();

  if (isCrossOrigin && window.location.protocol !== 'file:') {
    img.crossOrigin = 'anonymous';
  } else {
    img.crossOrigin = null;
  }

  if (img.complete && img.naturalWidth > 0 && img.src === url) {
    return img;
  } else {
    var loadCallback = function loadCallback() {
      img.removeEventListener('load', loadCallback);
      img.removeEventListener('error', errorCallback);
      img.id = item.id;
      callback(null, img);
    };

    var errorCallback = function errorCallback() {
      img.removeEventListener('load', loadCallback);
      img.removeEventListener('error', errorCallback); // Retry without crossOrigin mark if crossOrigin loading fails
      // Do not retry if protocol is https, even if the image is loaded, cross origin image isn't renderable.

      if (window.location.protocol !== 'https:' && img.crossOrigin && img.crossOrigin.toLowerCase() === 'anonymous') {
        downloadImage(item, callback, false, img);
      } else {
        callback(new Error(debug.getError(4930, url)));
      }
    };

    img.addEventListener('load', loadCallback);
    img.addEventListener('error', errorCallback);
    img.src = url;
  }
}

function downloadUuid(item, callback) {
  var result = PackDownloader.load(item, callback);

  if (result === undefined) {
    return this.extMap['json'](item, callback);
  }

  return result || undefined;
}

var defaultMap = {
  // JS
  'js': downloadScript,
  // Images
  'png': downloadImage,
  'jpg': downloadImage,
  'bmp': downloadImage,
  'jpeg': downloadImage,
  'gif': downloadImage,
  'ico': downloadImage,
  'tiff': downloadImage,
  'webp': downloadImage,
  'image': downloadImage,
  'pvr': downloadBinary,
  'pkm': downloadBinary,
  // Audio
  'mp3': downloadAudio,
  'ogg': downloadAudio,
  'wav': downloadAudio,
  'm4a': downloadAudio,
  // Txt
  'txt': downloadText,
  'xml': downloadText,
  'vsh': downloadText,
  'fsh': downloadText,
  'atlas': downloadText,
  'tmx': downloadText,
  'tsx': downloadText,
  'json': downloadText,
  'ExportJson': downloadText,
  'plist': downloadText,
  'fnt': downloadText,
  // Font
  'font': skip,
  'eot': skip,
  'ttf': skip,
  'woff': skip,
  'svg': skip,
  'ttc': skip,
  // Deserializer
  'uuid': downloadUuid,
  // Binary
  'binary': downloadBinary,
  'bin': downloadBinary,
  'dbbin': downloadBinary,
  'skel': downloadBinary,
  'default': downloadText
};
var ID = 'Downloader';
/**
 * The downloader pipe, it can download several types of files:
 * 1. Text
 * 2. Image
 * 3. Script
 * 4. Audio
 * 5. Assets
 * All unknown type will be downloaded as plain text.
 * You can pass custom supported types in the constructor.
 * @class Pipeline.Downloader
 */

/**
 * Constructor of Downloader, you can pass custom supported types.
 *
 * @method constructor
 * @param {Object} extMap Custom supported types with corresponded handler
 * @example
 *  var downloader = new Downloader({
 *      // This will match all url with `.scene` extension or all url with `scene` type
 *      'scene' : function (url, callback) {}
 *  });
 */

var Downloader = function Downloader(extMap) {
  this.id = ID;
  this.async = true;
  this.pipeline = null;
  this._curConcurrent = 0;
  this._loadQueue = [];
  this._subpackages = {};
  this.extMap = js.mixin(extMap, defaultMap);
};

Downloader.ID = ID;
Downloader.PackDownloader = PackDownloader;
/**
 * Add custom supported types handler or modify existing type handler.
 * @method addHandlers
 * @param {Object} extMap Custom supported types with corresponded handler
 */

Downloader.prototype.addHandlers = function (extMap) {
  js.mixin(this.extMap, extMap);
};

Downloader.prototype._handleLoadQueue = function () {
  while (this._curConcurrent < cc.macro.DOWNLOAD_MAX_CONCURRENT) {
    var nextOne = this._loadQueue.shift();

    if (!nextOne) {
      break;
    }

    var syncRet = this.handle(nextOne.item, nextOne.callback);

    if (syncRet !== undefined) {
      if (syncRet instanceof Error) {
        nextOne.callback(syncRet);
      } else {
        nextOne.callback(null, syncRet);
      }
    }
  }
};

Downloader.prototype.handle = function (item, callback) {
  var self = this;
  var downloadFunc = this.extMap[item.type] || this.extMap['default'];
  var syncRet = undefined;

  if (this._curConcurrent < cc.macro.DOWNLOAD_MAX_CONCURRENT) {
    this._curConcurrent++;
    syncRet = downloadFunc.call(this, item, function (err, result) {
      self._curConcurrent = Math.max(0, self._curConcurrent - 1);

      self._handleLoadQueue();

      callback && callback(err, result);
    });

    if (syncRet !== undefined) {
      this._curConcurrent = Math.max(0, this._curConcurrent - 1);

      this._handleLoadQueue();

      return syncRet;
    }
  } else if (item.ignoreMaxConcurrency) {
    syncRet = downloadFunc.call(this, item, callback);

    if (syncRet !== undefined) {
      return syncRet;
    }
  } else {
    this._loadQueue.push({
      item: item,
      callback: callback
    });
  }
};
/**
 * !#en
 * Load subpackage with name.
 * !#zh
 * 通过子包名加载子包代码。
 * @method loadSubpackage
 * @param {String} name - Subpackage name
 * @param {Function} [progressCallback] - Callback when progress changed
 * @param {Function} [completeCallback] -  Callback invoked when subpackage loaded
 * @param {Error} completeCallback.error - error information
 */


Downloader.prototype.loadSubpackage = function (name, progressCallback, completeCallback) {
  if (!completeCallback && progressCallback) {
    completeCallback = progressCallback;
    progressCallback = null;
  }

  var pac = this._subpackages[name];

  if (pac) {
    if (pac.loaded) {
      if (completeCallback) completeCallback();
    } else {
      downloadScript({
        url: pac.path + 'index.js'
      }, function (err) {
        if (!err) {
          pac.loaded = true;
        }

        if (completeCallback) completeCallback(err);
      });
    }
  } else if (completeCallback) {
    completeCallback(new Error("Can't find subpackage " + name));
  }
};

Pipeline.Downloader = module.exports = Downloader;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvd25sb2FkZXIuanMiXSwibmFtZXMiOlsianMiLCJyZXF1aXJlIiwiZGVidWciLCJQaXBlbGluZSIsIlBhY2tEb3dubG9hZGVyIiwiZG93bmxvYWRCaW5hcnkiLCJkb3dubG9hZFRleHQiLCJ1cmxBcHBlbmRUaW1lc3RhbXAiLCJkb3dubG9hZEF1ZGlvIiwiQ0NfRURJVE9SIiwiRWRpdG9yIiwiaXNNYWluUHJvY2VzcyIsInNraXAiLCJkb3dubG9hZFNjcmlwdCIsIml0ZW0iLCJjYWxsYmFjayIsImlzQXN5bmMiLCJ1cmwiLCJkIiwiZG9jdW1lbnQiLCJzIiwiY3JlYXRlRWxlbWVudCIsIndpbmRvdyIsImxvY2F0aW9uIiwicHJvdG9jb2wiLCJjcm9zc09yaWdpbiIsImFzeW5jIiwic3JjIiwibG9hZEhhbmRsZXIiLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZXJyb3JIYW5kbGVyIiwiRXJyb3IiLCJnZXRFcnJvciIsImFkZEV2ZW50TGlzdGVuZXIiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJkb3dubG9hZEltYWdlIiwiaXNDcm9zc09yaWdpbiIsImltZyIsInVuZGVmaW5lZCIsIkltYWdlIiwiY29tcGxldGUiLCJuYXR1cmFsV2lkdGgiLCJsb2FkQ2FsbGJhY2siLCJlcnJvckNhbGxiYWNrIiwiaWQiLCJ0b0xvd2VyQ2FzZSIsImRvd25sb2FkVXVpZCIsInJlc3VsdCIsImxvYWQiLCJleHRNYXAiLCJkZWZhdWx0TWFwIiwiSUQiLCJEb3dubG9hZGVyIiwicGlwZWxpbmUiLCJfY3VyQ29uY3VycmVudCIsIl9sb2FkUXVldWUiLCJfc3VicGFja2FnZXMiLCJtaXhpbiIsInByb3RvdHlwZSIsImFkZEhhbmRsZXJzIiwiX2hhbmRsZUxvYWRRdWV1ZSIsImNjIiwibWFjcm8iLCJET1dOTE9BRF9NQVhfQ09OQ1VSUkVOVCIsIm5leHRPbmUiLCJzaGlmdCIsInN5bmNSZXQiLCJoYW5kbGUiLCJzZWxmIiwiZG93bmxvYWRGdW5jIiwidHlwZSIsImNhbGwiLCJlcnIiLCJNYXRoIiwibWF4IiwiaWdub3JlTWF4Q29uY3VycmVuY3kiLCJwdXNoIiwibG9hZFN1YnBhY2thZ2UiLCJuYW1lIiwicHJvZ3Jlc3NDYWxsYmFjayIsImNvbXBsZXRlQ2FsbGJhY2siLCJwYWMiLCJsb2FkZWQiLCJwYXRoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsSUFBTUEsRUFBRSxHQUFHQyxPQUFPLENBQUMsZ0JBQUQsQ0FBbEI7O0FBQ0EsSUFBTUMsS0FBSyxHQUFHRCxPQUFPLENBQUMsWUFBRCxDQUFyQjs7QUFDQUEsT0FBTyxDQUFDLGlCQUFELENBQVA7O0FBQ0EsSUFBTUUsUUFBUSxHQUFHRixPQUFPLENBQUMsWUFBRCxDQUF4Qjs7QUFDQSxJQUFNRyxjQUFjLEdBQUdILE9BQU8sQ0FBQyxtQkFBRCxDQUE5Qjs7QUFFQSxJQUFJSSxjQUFjLEdBQUdKLE9BQU8sQ0FBQyxxQkFBRCxDQUE1Qjs7QUFDQSxJQUFJSyxZQUFZLEdBQUdMLE9BQU8sQ0FBQyxtQkFBRCxDQUExQjs7QUFDQSxJQUFJTSxrQkFBa0IsR0FBR04sT0FBTyxDQUFDLFNBQUQsQ0FBUCxDQUFtQk0sa0JBQTVDOztBQUVBLElBQUlDLGFBQUo7O0FBQ0EsSUFBSSxDQUFDQyxTQUFELElBQWMsQ0FBQ0MsTUFBTSxDQUFDQyxhQUExQixFQUF5QztBQUNyQ0gsRUFBQUEsYUFBYSxHQUFHUCxPQUFPLENBQUMsb0JBQUQsQ0FBdkI7QUFDSCxDQUZELE1BR0s7QUFDRE8sRUFBQUEsYUFBYSxHQUFHLElBQWhCO0FBQ0g7O0FBRUQsU0FBU0ksSUFBVCxHQUFpQjtBQUNiLFNBQU8sSUFBUDtBQUNIOztBQUVELFNBQVNDLGNBQVQsQ0FBeUJDLElBQXpCLEVBQStCQyxRQUEvQixFQUF5Q0MsT0FBekMsRUFBa0Q7QUFDOUMsTUFBSUMsR0FBRyxHQUFHSCxJQUFJLENBQUNHLEdBQWY7QUFBQSxN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T0FMYSxDQUFkO0FBTUg7QUFDSixHQVpELE1BYUssSUFBSVEsZ0JBQUosRUFBc0I7QUFDdkJBLElBQUFBLGdCQUFnQixDQUFDLElBQUlsRCxLQUFKLDRCQUFtQ2dELElBQW5DLENBQUQsQ0FBaEI7QUFDSDtBQUNKLENBdEJEOztBQXdCQTlFLFFBQVEsQ0FBQ29ELFVBQVQsR0FBc0JnQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJqQyxVQUF2QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBqcyA9IHJlcXVpcmUoJy4uL3BsYXRmb3JtL2pzJyk7XG5jb25zdCBkZWJ1ZyA9IHJlcXVpcmUoJy4uL0NDRGVidWcnKTtcbnJlcXVpcmUoJy4uL3V0aWxzL0NDUGF0aCcpO1xuY29uc3QgUGlwZWxpbmUgPSByZXF1aXJlKCcuL3BpcGVsaW5lJyk7XG5jb25zdCBQYWNrRG93bmxvYWRlciA9IHJlcXVpcmUoJy4vcGFjay1kb3dubG9hZGVyJyk7XG5cbmxldCBkb3dubG9hZEJpbmFyeSA9IHJlcXVpcmUoJy4vYmluYXJ5LWRvd25sb2FkZXInKTtcbmxldCBkb3dubG9hZFRleHQgPSByZXF1aXJlKCcuL3RleHQtZG93bmxvYWRlcicpO1xubGV0IHVybEFwcGVuZFRpbWVzdGFtcCA9IHJlcXVpcmUoJy4vdXRpbHMnKS51cmxBcHBlbmRUaW1lc3RhbXA7XG5cbnZhciBkb3dubG9hZEF1ZGlvO1xuaWYgKCFDQ19FRElUT1IgfHwgIUVkaXRvci5pc01haW5Qcm9jZXNzKSB7XG4gICAgZG93bmxvYWRBdWRpbyA9IHJlcXVpcmUoJy4vYXVkaW8tZG93bmxvYWRlcicpO1xufVxuZWxzZSB7XG4gICAgZG93bmxvYWRBdWRpbyA9IG51bGw7XG59XG5cbmZ1bmN0aW9uIHNraXAgKCkge1xuICAgIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBkb3dubG9hZFNjcmlwdCAoaXRlbSwgY2FsbGJhY2ssIGlzQXN5bmMpIHtcbiAgICB2YXIgdXJsID0gaXRlbS51cmwsXG4gICAgICAgIGQgPSBkb2N1bWVudCxcbiAgICAgICAgcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuXG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCAhPT0gJ2ZpbGU6Jykge1xuICAgICAgICBzLmNyb3NzT3JpZ2luID0gJ2Fub255bW91cyc7XG4gICAgfVxuXG4gICAgcy5hc3luYyA9IGlzQXN5bmM7XG4gICAgcy5zcmMgPSB1cmxBcHBlbmRUaW1lc3RhbXAodXJsKTtcbiAgICBmdW5jdGlvbiBsb2FkSGFuZGxlciAoKSB7XG4gICAgICAgIHMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzKTtcbiAgICAgICAgcy5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgbG9hZEhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgcy5yZW1vdmVFdmVudExpc3RlbmVyKCdlcnJvcicsIGVycm9ySGFuZGxlciwgZmFsc2UpO1xuICAgICAgICBjYWxsYmFjayhudWxsLCB1cmwpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBlcnJvckhhbmRsZXIoKSB7XG4gICAgICAgIHMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzKTtcbiAgICAgICAgcy5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgbG9hZEhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgcy5yZW1vdmVFdmVudExpc3RlbmVyKCdlcnJvcicsIGVycm9ySGFuZGxlciwgZmFsc2UpO1xuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoZGVidWcuZ2V0RXJyb3IoNDkyOCwgdXJsKSkpO1xuICAgIH1cbiAgICBzLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBsb2FkSGFuZGxlciwgZmFsc2UpO1xuICAgIHMuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBlcnJvckhhbmRsZXIsIGZhbHNlKTtcbiAgICBkLmJvZHkuYXBwZW5kQ2hpbGQocyk7XG59XG5cbmZ1bmN0aW9uIGRvd25sb2FkSW1hZ2UgKGl0ZW0sIGNhbGxiYWNrLCBpc0Nyb3NzT3JpZ2luLCBpbWcpIHtcbiAgICBpZiAoaXNDcm9zc09yaWdpbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlzQ3Jvc3NPcmlnaW4gPSB0cnVlO1xuICAgIH1cblxuICAgIHZhciB1cmwgPSB1cmxBcHBlbmRUaW1lc3RhbXAoaXRlbS51cmwpO1xuICAgIGltZyA9IGltZyB8fCBuZXcgSW1hZ2UoKTtcbiAgICBpZiAoaXNDcm9zc09yaWdpbiAmJiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgIT09ICdmaWxlOicpIHtcbiAgICAgICAgaW1nLmNyb3NzT3JpZ2luID0gJ2Fub255bW91cyc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpbWcuY3Jvc3NPcmlnaW4gPSBudWxsO1xuICAgIH1cblxuICAgIGlmIChpbWcuY29tcGxldGUgJiYgaW1nLm5hdHVyYWxXaWR0aCA+IDAgJiYgaW1nLnNyYyA9PT0gdXJsKSB7XG4gICAgICAgIHJldHVybiBpbWc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmdW5jdGlvbiBsb2FkQ2FsbGJhY2sgKCkge1xuICAgICAgICAgICAgaW1nLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBsb2FkQ2FsbGJhY2spO1xuICAgICAgICAgICAgaW1nLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXJyb3JDYWxsYmFjayk7XG5cbiAgICAgICAgICAgIGltZy5pZCA9IGl0ZW0uaWQ7XG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBpbWcpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGVycm9yQ2FsbGJhY2sgKCkge1xuICAgICAgICAgICAgaW1nLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBsb2FkQ2FsbGJhY2spO1xuICAgICAgICAgICAgaW1nLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXJyb3JDYWxsYmFjayk7XG5cbiAgICAgICAgICAgIC8vIFJldHJ5IHdpdGhvdXQgY3Jvc3NPcmlnaW4gbWFyayBpZiBjcm9zc09yaWdpbiBsb2FkaW5nIGZhaWxzXG4gICAgICAgICAgICAvLyBEbyBub3QgcmV0cnkgaWYgcHJvdG9jb2wgaXMgaHR0cHMsIGV2ZW4gaWYgdGhlIGltYWdlIGlzIGxvYWRlZCwgY3Jvc3Mgb3JpZ2luIGltYWdlIGlzbid0IHJlbmRlcmFibGUuXG4gICAgICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLnByb3RvY29sICE9PSAnaHR0cHM6JyAmJiBpbWcuY3Jvc3NPcmlnaW4gJiYgaW1nLmNyb3NzT3JpZ2luLnRvTG93ZXJDYXNlKCkgPT09ICdhbm9ueW1vdXMnKSB7XG4gICAgICAgICAgICAgICAgZG93bmxvYWRJbWFnZShpdGVtLCBjYWxsYmFjaywgZmFsc2UsIGltZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoZGVidWcuZ2V0RXJyb3IoNDkzMCwgdXJsKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBsb2FkQ2FsbGJhY2spO1xuICAgICAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBlcnJvckNhbGxiYWNrKTtcbiAgICAgICAgaW1nLnNyYyA9IHVybDtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRvd25sb2FkVXVpZCAoaXRlbSwgY2FsbGJhY2spIHtcbiAgICB2YXIgcmVzdWx0ID0gUGFja0Rvd25sb2FkZXIubG9hZChpdGVtLCBjYWxsYmFjayk7XG4gICAgaWYgKHJlc3VsdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV4dE1hcFsnanNvbiddKGl0ZW0sIGNhbGxiYWNrKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdCB8fCB1bmRlZmluZWQ7XG59XG5cblxudmFyIGRlZmF1bHRNYXAgPSB7XG4gICAgLy8gSlNcbiAgICAnanMnIDogZG93bmxvYWRTY3JpcHQsXG5cbiAgICAvLyBJbWFnZXNcbiAgICAncG5nJyA6IGRvd25sb2FkSW1hZ2UsXG4gICAgJ2pwZycgOiBkb3dubG9hZEltYWdlLFxuICAgICdibXAnIDogZG93bmxvYWRJbWFnZSxcbiAgICAnanBlZycgOiBkb3dubG9hZEltYWdlLFxuICAgICdnaWYnIDogZG93bmxvYWRJbWFnZSxcbiAgICAnaWNvJyA6IGRvd25sb2FkSW1hZ2UsXG4gICAgJ3RpZmYnIDogZG93bmxvYWRJbWFnZSxcbiAgICAnd2VicCcgOiBkb3dubG9hZEltYWdlLFxuICAgICdpbWFnZScgOiBkb3dubG9hZEltYWdlLFxuICAgICdwdnInOiBkb3dubG9hZEJpbmFyeSxcbiAgICAncGttJzogZG93bmxvYWRCaW5hcnksXG5cbiAgICAvLyBBdWRpb1xuICAgICdtcDMnIDogZG93bmxvYWRBdWRpbyxcbiAgICAnb2dnJyA6IGRvd25sb2FkQXVkaW8sXG4gICAgJ3dhdicgOiBkb3dubG9hZEF1ZGlvLFxuICAgICdtNGEnIDogZG93bmxvYWRBdWRpbyxcblxuICAgIC8vIFR4dFxuICAgICd0eHQnIDogZG93bmxvYWRUZXh0LFxuICAgICd4bWwnIDogZG93bmxvYWRUZXh0LFxuICAgICd2c2gnIDogZG93bmxvYWRUZXh0LFxuICAgICdmc2gnIDogZG93bmxvYWRUZXh0LFxuICAgICdhdGxhcycgOiBkb3dubG9hZFRleHQsXG5cbiAgICAndG14JyA6IGRvd25sb2FkVGV4dCxcbiAgICAndHN4JyA6IGRvd25sb2FkVGV4dCxcblxuICAgICdqc29uJyA6IGRvd25sb2FkVGV4dCxcbiAgICAnRXhwb3J0SnNvbicgOiBkb3dubG9hZFRleHQsXG4gICAgJ3BsaXN0JyA6IGRvd25sb2FkVGV4dCxcblxuICAgICdmbnQnIDogZG93bmxvYWRUZXh0LFxuXG4gICAgLy8gRm9udFxuICAgICdmb250JyA6IHNraXAsXG4gICAgJ2VvdCcgOiBza2lwLFxuICAgICd0dGYnIDogc2tpcCxcbiAgICAnd29mZicgOiBza2lwLFxuICAgICdzdmcnIDogc2tpcCxcbiAgICAndHRjJyA6IHNraXAsXG5cbiAgICAvLyBEZXNlcmlhbGl6ZXJcbiAgICAndXVpZCcgOiBkb3dubG9hZFV1aWQsXG5cbiAgICAvLyBCaW5hcnlcbiAgICAnYmluYXJ5JyA6IGRvd25sb2FkQmluYXJ5LFxuICAgICdiaW4nIDogZG93bmxvYWRCaW5hcnksXG4gICAgJ2RiYmluJyA6IGRvd25sb2FkQmluYXJ5LFxuICAgICdza2VsJzogZG93bmxvYWRCaW5hcnksXG5cbiAgICAnZGVmYXVsdCcgOiBkb3dubG9hZFRleHRcbn07XG5cbnZhciBJRCA9ICdEb3dubG9hZGVyJztcblxuLyoqXG4gKiBUaGUgZG93bmxvYWRlciBwaXBlLCBpdCBjYW4gZG93bmxvYWQgc2V2ZXJhbCB0eXBlcyBvZiBmaWxlczpcbiAqIDEuIFRleHRcbiAqIDIuIEltYWdlXG4gKiAzLiBTY3JpcHRcbiAqIDQuIEF1ZGlvXG4gKiA1LiBBc3NldHNcbiAqIEFsbCB1bmtub3duIHR5cGUgd2lsbCBiZSBkb3dubG9hZGVkIGFzIHBsYWluIHRleHQuXG4gKiBZb3UgY2FuIHBhc3MgY3VzdG9tIHN1cHBvcnRlZCB0eXBlcyBpbiB0aGUgY29uc3RydWN0b3IuXG4gKiBAY2xhc3MgUGlwZWxpbmUuRG93bmxvYWRlclxuICovXG4vKipcbiAqIENvbnN0cnVjdG9yIG9mIERvd25sb2FkZXIsIHlvdSBjYW4gcGFzcyBjdXN0b20gc3VwcG9ydGVkIHR5cGVzLlxuICpcbiAqIEBtZXRob2QgY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBleHRNYXAgQ3VzdG9tIHN1cHBvcnRlZCB0eXBlcyB3aXRoIGNvcnJlc3BvbmRlZCBoYW5kbGVyXG4gKiBAZXhhbXBsZVxuICogIHZhciBkb3dubG9hZGVyID0gbmV3IERvd25sb2FkZXIoe1xuICogICAgICAvLyBUaGlzIHdpbGwgbWF0Y2ggYWxsIHVybCB3aXRoIGAuc2NlbmVgIGV4dGVuc2lvbiBvciBhbGwgdXJsIHdpdGggYHNjZW5lYCB0eXBlXG4gKiAgICAgICdzY2VuZScgOiBmdW5jdGlvbiAodXJsLCBjYWxsYmFjaykge31cbiAqICB9KTtcbiAqL1xudmFyIERvd25sb2FkZXIgPSBmdW5jdGlvbiAoZXh0TWFwKSB7XG4gICAgdGhpcy5pZCA9IElEO1xuICAgIHRoaXMuYXN5bmMgPSB0cnVlO1xuICAgIHRoaXMucGlwZWxpbmUgPSBudWxsO1xuICAgIHRoaXMuX2N1ckNvbmN1cnJlbnQgPSAwO1xuICAgIHRoaXMuX2xvYWRRdWV1ZSA9IFtdO1xuXG4gICAgdGhpcy5fc3VicGFja2FnZXMgPSB7fTtcblxuICAgIHRoaXMuZXh0TWFwID0ganMubWl4aW4oZXh0TWFwLCBkZWZhdWx0TWFwKTtcbn07XG5Eb3dubG9hZGVyLklEID0gSUQ7XG5Eb3dubG9hZGVyLlBhY2tEb3dubG9hZGVyID0gUGFja0Rvd25sb2FkZXI7XG5cbi8qKlxuICogQWRkIGN1c3RvbSBzdXBwb3J0ZWQgdHlwZXMgaGFuZGxlciBvciBtb2RpZnkgZXhpc3RpbmcgdHlwZSBoYW5kbGVyLlxuICogQG1ldGhvZCBhZGRIYW5kbGVyc1xuICogQHBhcmFtIHtPYmplY3R9IGV4dE1hcCBDdXN0b20gc3VwcG9ydGVkIHR5cGVzIHdpdGggY29ycmVzcG9uZGVkIGhhbmRsZXJcbiAqL1xuRG93bmxvYWRlci5wcm90b3R5cGUuYWRkSGFuZGxlcnMgPSBmdW5jdGlvbiAoZXh0TWFwKSB7XG4gICAganMubWl4aW4odGhpcy5leHRNYXAsIGV4dE1hcCk7XG59O1xuXG5Eb3dubG9hZGVyLnByb3RvdHlwZS5faGFuZGxlTG9hZFF1ZXVlID0gZnVuY3Rpb24gKCkge1xuICAgIHdoaWxlICh0aGlzLl9jdXJDb25jdXJyZW50IDwgY2MubWFjcm8uRE9XTkxPQURfTUFYX0NPTkNVUlJFTlQpIHtcbiAgICAgICAgdmFyIG5leHRPbmUgPSB0aGlzLl9sb2FkUXVldWUuc2hpZnQoKTtcbiAgICAgICAgaWYgKCFuZXh0T25lKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3luY1JldCA9IHRoaXMuaGFuZGxlKG5leHRPbmUuaXRlbSwgbmV4dE9uZS5jYWxsYmFjayk7XG4gICAgICAgIGlmIChzeW5jUmV0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmIChzeW5jUmV0IGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgICAgICBuZXh0T25lLmNhbGxiYWNrKHN5bmNSZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV4dE9uZS5jYWxsYmFjayhudWxsLCBzeW5jUmV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbkRvd25sb2FkZXIucHJvdG90eXBlLmhhbmRsZSA9IGZ1bmN0aW9uIChpdGVtLCBjYWxsYmFjaykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZG93bmxvYWRGdW5jID0gdGhpcy5leHRNYXBbaXRlbS50eXBlXSB8fCB0aGlzLmV4dE1hcFsnZGVmYXVsdCddO1xuICAgIHZhciBzeW5jUmV0ID0gdW5kZWZpbmVkO1xuICAgIGlmICh0aGlzLl9jdXJDb25jdXJyZW50IDwgY2MubWFjcm8uRE9XTkxPQURfTUFYX0NPTkNVUlJFTlQpIHtcbiAgICAgICAgdGhpcy5fY3VyQ29uY3VycmVudCsrO1xuICAgICAgICBzeW5jUmV0ID0gZG93bmxvYWRGdW5jLmNhbGwodGhpcywgaXRlbSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICAgICAgICBzZWxmLl9jdXJDb25jdXJyZW50ID0gTWF0aC5tYXgoMCwgc2VsZi5fY3VyQ29uY3VycmVudCAtIDEpO1xuICAgICAgICAgICAgc2VsZi5faGFuZGxlTG9hZFF1ZXVlKCk7XG4gICAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhlcnIsIHJlc3VsdCk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoc3luY1JldCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJDb25jdXJyZW50ID0gTWF0aC5tYXgoMCwgdGhpcy5fY3VyQ29uY3VycmVudCAtIDEpO1xuICAgICAgICAgICAgdGhpcy5faGFuZGxlTG9hZFF1ZXVlKCk7XG4gICAgICAgICAgICByZXR1cm4gc3luY1JldDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChpdGVtLmlnbm9yZU1heENvbmN1cnJlbmN5KSB7XG4gICAgICAgIHN5bmNSZXQgPSBkb3dubG9hZEZ1bmMuY2FsbCh0aGlzLCBpdGVtLCBjYWxsYmFjayk7XG4gICAgICAgIGlmIChzeW5jUmV0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBzeW5jUmV0O1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aGlzLl9sb2FkUXVldWUucHVzaCh7XG4gICAgICAgICAgICBpdGVtOiBpdGVtLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbi8qKlxuICogISNlblxuICogTG9hZCBzdWJwYWNrYWdlIHdpdGggbmFtZS5cbiAqICEjemhcbiAqIOmAmui/h+WtkOWMheWQjeWKoOi9veWtkOWMheS7o+eggeOAglxuICogQG1ldGhvZCBsb2FkU3VicGFja2FnZVxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBTdWJwYWNrYWdlIG5hbWVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtwcm9ncmVzc0NhbGxiYWNrXSAtIENhbGxiYWNrIHdoZW4gcHJvZ3Jlc3MgY2hhbmdlZFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbXBsZXRlQ2FsbGJhY2tdIC0gIENhbGxiYWNrIGludm9rZWQgd2hlbiBzdWJwYWNrYWdlIGxvYWRlZFxuICogQHBhcmFtIHtFcnJvcn0gY29tcGxldGVDYWxsYmFjay5lcnJvciAtIGVycm9yIGluZm9ybWF0aW9uXG4gKi9cbkRvd25sb2FkZXIucHJvdG90eXBlLmxvYWRTdWJwYWNrYWdlID0gZnVuY3Rpb24gKG5hbWUsIHByb2dyZXNzQ2FsbGJhY2ssIGNvbXBsZXRlQ2FsbGJhY2spIHtcbiAgICBpZiAoIWNvbXBsZXRlQ2FsbGJhY2sgJiYgcHJvZ3Jlc3NDYWxsYmFjaykge1xuICAgICAgICBjb21wbGV0ZUNhbGxiYWNrID0gcHJvZ3Jlc3NDYWxsYmFjaztcbiAgICAgICAgcHJvZ3Jlc3NDYWxsYmFjayA9IG51bGw7XG4gICAgfVxuICAgIGxldCBwYWMgPSB0aGlzLl9zdWJwYWNrYWdlc1tuYW1lXTtcbiAgICBpZiAocGFjKSB7XG4gICAgICAgIGlmIChwYWMubG9hZGVkKSB7XG4gICAgICAgICAgICBpZiAoY29tcGxldGVDYWxsYmFjaykgY29tcGxldGVDYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZG93bmxvYWRTY3JpcHQoe3VybDogcGFjLnBhdGggKyAnaW5kZXguanMnfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhYy5sb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoY29tcGxldGVDYWxsYmFjaykgY29tcGxldGVDYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoY29tcGxldGVDYWxsYmFjaykge1xuICAgICAgICBjb21wbGV0ZUNhbGxiYWNrKG5ldyBFcnJvcihgQ2FuJ3QgZmluZCBzdWJwYWNrYWdlICR7bmFtZX1gKSk7XG4gICAgfVxufTtcblxuUGlwZWxpbmUuRG93bmxvYWRlciA9IG1vZHVsZS5leHBvcnRzID0gRG93bmxvYWRlcjtcbiJdfQ==