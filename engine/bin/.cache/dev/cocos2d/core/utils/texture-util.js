
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/utils/texture-util.js';
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
var Texture2D = require('../assets/CCTexture2D');
/**
 * cc.textureUtil is a singleton object, it can load cc.Texture2D asynchronously
 * @class textureUtil
 * @static
 */


var textureUtil = {
  loadImage: function loadImage(url, cb, target) {
    cc.assertID(url, 3103);
    var tex = cc.loader.getRes(url);

    if (tex) {
      if (tex.loaded) {
        cb && cb.call(target, null, tex);
        return tex;
      } else {
        tex.once("load", function () {
          cb && cb.call(target, null, tex);
        }, target);
        return tex;
      }
    } else {
      tex = new Texture2D();
      tex.url = url;
      cc.loader.load({
        url: url,
        texture: tex
      }, function (err, texture) {
        if (err) {
          return cb && cb.call(target, err || new Error('Unknown error'));
        }

        texture.handleLoadedTexture();
        cb && cb.call(target, null, texture);
      });
      return tex;
    }
  },
  cacheImage: function cacheImage(url, image) {
    if (url && image) {
      var tex = new Texture2D();
      tex.initWithElement(image);
      var item = {
        id: url,
        url: url,
        // real download url, maybe changed
        error: null,
        content: tex,
        complete: false
      };
      cc.loader.flowOut(item);
      return tex;
    }
  },
  postLoadTexture: function postLoadTexture(texture, callback) {
    if (texture.loaded) {
      callback && callback();
      return;
    }

    if (!texture.url) {
      callback && callback();
      return;
    } // load image


    cc.loader.load({
      url: texture.url,
      // For uncompressed image, we should skip loader otherwise it will load a new texture.
      // compressed texture need loader to parse data
      skips: texture._isCompressed() ? undefined : ['Loader']
    }, function (err, image) {
      if (image) {
        if (CC_DEBUG && image instanceof cc.Texture2D) {
          return cc.error('internal error: loader handle pipe must be skipped');
        }

        if (!texture.loaded) {
          texture._nativeAsset = image;
        }
      }

      callback && callback(err);
    });
  }
};
cc.textureUtil = module.exports = textureUtil;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRleHR1cmUtdXRpbC5qcyJdLCJuYW1lcyI6WyJUZXh0dXJlMkQiLCJyZXF1aXJlIiwidGV4dHVyZVV0aWwiLCJsb2FkSW1hZ2UiLCJ1cmwiLCJjYiIsInRhcmdldCIsImNjIiwiYXNzZXJ0SUQiLCJ0ZXgiLCJsb2FkZXIiLCJnZXRSZXMiLCJsb2FkZWQiLCJjYWxsIiwib25jZSIsImxvYWQiLCJ0ZXh0dXJlIiwiZXJyIiwiRXJyb3IiLCJoYW5kbGVMb2FkZWRUZXh0dXJlIiwiY2FjaGVJbWFnZSIsImltYWdlIiwiaW5pdFdpdGhFbGVtZW50IiwiaXRlbSIsImlkIiwiZXJyb3IiLCJjb250ZW50IiwiY29tcGxldGUiLCJmbG93T3V0IiwicG9zdExvYWRUZXh0dXJlIiwiY2FsbGJhY2siLCJza2lwcyIsIl9pc0NvbXByZXNzZWQiLCJ1bmRlZmluZWQiLCJDQ19ERUJVRyIsIl9uYXRpdmVBc3NldCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFNQSxTQUFTLEdBQUdDLE9BQU8sQ0FBQyx1QkFBRCxDQUF6QjtBQUVBOzs7Ozs7O0FBS0EsSUFBSUMsV0FBVyxHQUFHO0FBQ2RDLEVBQUFBLFNBRGMscUJBQ0hDLEdBREcsRUFDRUMsRUFERixFQUNNQyxNQUROLEVBQ2M7QUFDeEJDLElBQUFBLEVBQUUsQ0FBQ0MsUUFBSCxDQUFZSixHQUFaLEVBQWlCLElBQWpCO0FBRUEsUUFBSUssR0FBRyxHQUFHRixFQUFFLENBQUNHLE1BQUgsQ0FBVUMsTUFBVixDQUFpQlAsR0FBakIsQ0FBVjs7QUFDQSxRQUFJSyxHQUFKLEVBQVM7QUFDTCxVQUFJQSxHQUFHLENBQUNHLE1BQVIsRUFBZ0I7QUFDWlAsUUFBQUEsRUFBRSxJQUFJQSxFQUFFLENBQUNRLElBQUgsQ0FBUVAsTUFBUixFQUFnQixJQUFoQixFQUFzQkcsR0FBdEIsQ0FBTjtBQUNBLGVBQU9BLEdBQVA7QUFDSCxP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QUlBLFFBQVEsQ0FBQ2IsR0FBRCxDQUFwQjtBQUNILEtBZkQ7QUFnQkg7QUExRWEsQ0FBbEI7QUE2RUFWLEVBQUUsQ0FBQ0wsV0FBSCxHQUFpQmtDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQm5DLFdBQWxDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNvbnN0IFRleHR1cmUyRCA9IHJlcXVpcmUoJy4uL2Fzc2V0cy9DQ1RleHR1cmUyRCcpO1xuXG4vKipcbiAqIGNjLnRleHR1cmVVdGlsIGlzIGEgc2luZ2xldG9uIG9iamVjdCwgaXQgY2FuIGxvYWQgY2MuVGV4dHVyZTJEIGFzeW5jaHJvbm91c2x5XG4gKiBAY2xhc3MgdGV4dHVyZVV0aWxcbiAqIEBzdGF0aWNcbiAqL1xubGV0IHRleHR1cmVVdGlsID0ge1xuICAgIGxvYWRJbWFnZSAodXJsLCBjYiwgdGFyZ2V0KSB7XG4gICAgICAgIGNjLmFzc2VydElEKHVybCwgMzEwMyk7XG5cbiAgICAgICAgdmFyIHRleCA9IGNjLmxvYWRlci5nZXRSZXModXJsKTtcbiAgICAgICAgaWYgKHRleCkge1xuICAgICAgICAgICAgaWYgKHRleC5sb2FkZWQpIHtcbiAgICAgICAgICAgICAgICBjYiAmJiBjYi5jYWxsKHRhcmdldCwgbnVsbCwgdGV4KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRleC5vbmNlKFwibG9hZFwiLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgIGNiICYmIGNiLmNhbGwodGFyZ2V0LCBudWxsLCB0ZXgpO1xuICAgICAgICAgICAgICAgIH0sIHRhcmdldCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRleCA9IG5ldyBUZXh0dXJlMkQoKTtcbiAgICAgICAgICAgIHRleC51cmwgPSB1cmw7XG4gICAgICAgICAgICBjYy5sb2FkZXIubG9hZCh7dXJsOiB1cmwsIHRleHR1cmU6IHRleH0sIGZ1bmN0aW9uIChlcnIsIHRleHR1cmUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYiAmJiBjYi5jYWxsKHRhcmdldCwgZXJyIHx8IG5ldyBFcnJvcignVW5rbm93biBlcnJvcicpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGV4dHVyZS5oYW5kbGVMb2FkZWRUZXh0dXJlKCk7XG4gICAgICAgICAgICAgICAgY2IgJiYgY2IuY2FsbCh0YXJnZXQsIG51bGwsIHRleHR1cmUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdGV4O1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGNhY2hlSW1hZ2UgKHVybCwgaW1hZ2UpIHtcbiAgICAgICAgaWYgKHVybCAmJiBpbWFnZSkge1xuICAgICAgICAgICAgdmFyIHRleCA9IG5ldyBUZXh0dXJlMkQoKTtcbiAgICAgICAgICAgIHRleC5pbml0V2l0aEVsZW1lbnQoaW1hZ2UpO1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSB7XG4gICAgICAgICAgICAgICAgaWQ6IHVybCxcbiAgICAgICAgICAgICAgICB1cmw6IHVybCwgLy8gcmVhbCBkb3dubG9hZCB1cmwsIG1heWJlIGNoYW5nZWRcbiAgICAgICAgICAgICAgICBlcnJvcjogbnVsbCxcbiAgICAgICAgICAgICAgICBjb250ZW50OiB0ZXgsXG4gICAgICAgICAgICAgICAgY29tcGxldGU6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYy5sb2FkZXIuZmxvd091dChpdGVtKTtcbiAgICAgICAgICAgIHJldHVybiB0ZXg7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcG9zdExvYWRUZXh0dXJlICh0ZXh0dXJlLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAodGV4dHVyZS5sb2FkZWQpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0ZXh0dXJlLnVybCkge1xuICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBsb2FkIGltYWdlXG4gICAgICAgIGNjLmxvYWRlci5sb2FkKHtcbiAgICAgICAgICAgIHVybDogdGV4dHVyZS51cmwsXG4gICAgICAgICAgICAvLyBGb3IgdW5jb21wcmVzc2VkIGltYWdlLCB3ZSBzaG91bGQgc2tpcCBsb2FkZXIgb3RoZXJ3aXNlIGl0IHdpbGwgbG9hZCBhIG5ldyB0ZXh0dXJlLlxuICAgICAgICAgICAgLy8gY29tcHJlc3NlZCB0ZXh0dXJlIG5lZWQgbG9hZGVyIHRvIHBhcnNlIGRhdGFcbiAgICAgICAgICAgIHNraXBzOiB0ZXh0dXJlLl9pc0NvbXByZXNzZWQoKSA/IHVuZGVmaW5lZCA6IFsnTG9hZGVyJ10sXG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIsIGltYWdlKSB7XG4gICAgICAgICAgICBpZiAoaW1hZ2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoQ0NfREVCVUcgJiYgaW1hZ2UgaW5zdGFuY2VvZiBjYy5UZXh0dXJlMkQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNjLmVycm9yKCdpbnRlcm5hbCBlcnJvcjogbG9hZGVyIGhhbmRsZSBwaXBlIG11c3QgYmUgc2tpcHBlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIXRleHR1cmUubG9hZGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRleHR1cmUuX25hdGl2ZUFzc2V0ID0gaW1hZ2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuY2MudGV4dHVyZVV0aWwgPSBtb2R1bGUuZXhwb3J0cyA9IHRleHR1cmVVdGlsOyJdfQ==