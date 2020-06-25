
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/url.js';
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

/**
 * @class url
 * @static
 */
cc.url = {
  /**
   * The base url of raw assets.
   * @property {Object} _rawAssets
   * @private
   * @readOnly
   */
  _rawAssets: '',
  normalize: function normalize(url) {
    if (url) {
      if (url.charCodeAt(0) === 46 && url.charCodeAt(1) === 47) {
        // strip './'
        url = url.slice(2);
      } else if (url.charCodeAt(0) === 47) {
        // strip '/'
        url = url.slice(1);
      }
    }

    return url;
  },

  /**
   * Returns the url of raw assets, you will only need this if the raw asset is inside the "resources" folder.
   * 
   * @method raw
   * @param {String} url
   * @return {String}
   * @example {@link cocos2d/core/platform/url/raw.js}
   */
  raw: function raw(url) {
    if (CC_EDITOR && !this._rawAssets) {
      cc.errorID(7000);
      return '';
    }

    url = this.normalize(url);

    if (!url.startsWith('resources/')) {
      cc.errorID(CC_EDITOR ? 7001 : 7002, url);
    } else {
      // Compatible with versions lower than 1.10
      var uuid = cc.loader._getResUuid(url.slice(10), cc.Asset, null, true);

      if (uuid) {
        return cc.AssetLibrary.getLibUrlNoExt(uuid, true) + cc.path.extname(url);
      }
    }

    return this._rawAssets + url;
  },
  _init: function _init(assets) {
    this._rawAssets = cc.path.stripSep(assets) + '/';
  }
};
module.exports = cc.url;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVybC5qcyJdLCJuYW1lcyI6WyJjYyIsInVybCIsIl9yYXdBc3NldHMiLCJub3JtYWxpemUiLCJjaGFyQ29kZUF0Iiwic2xpY2UiLCJyYXciLCJDQ19FRElUT1IiLCJlcnJvcklEIiwic3RhcnRzV2l0aCIsInV1aWQiLCJsb2FkZXIiLCJfZ2V0UmVzVXVpZCIsIkFzc2V0IiwiQXNzZXRMaWJyYXJ5IiwiZ2V0TGliVXJsTm9FeHQiLCJwYXRoIiwiZXh0bmFtZSIsIl9pbml0IiwiYXNzZXRzIiwic3RyaXBTZXAiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBOzs7O0FBSUFBLEVBQUUsQ0FBQ0MsR0FBSCxHQUFTO0FBRUw7Ozs7OztBQU1BQyxFQUFBQSxVQUFVLEVBQUUsRUFSUDtBQVVMQyxFQUFBQSxTQUFTLEVBQUUsbUJBQVVGLEdBQVYsRUFBZTtBQUN0QixRQUFJQSxHQUFKLEVBQVM7QUFDTCxVQUFJQSxHQUFHLENBQUNHLFVBQUosQ0FBZSxDQUFmLE1BQXNCLEVBQXRCLElBQTRCSCxHQUFHLENBQUNHLFVBQUosQ0FBZSxDQUFmLE1BQXNCLEVBQXRELEVBQTBEO0FBQ3REO0FBQ0FILFFBQUFBLEdBQUcsR0FBR0EsR0FBRyxDQUFDSSxLQUFKLENBQVUsQ0FBVixDQUFOO0FBQ0gsT0FIRCxNQUlLLElBQUlKLEdBQUcsQ0FBQ0csVUFBSixDQUFlLENBQWYsTUFBc0IsRUFBMUIsRUFBOEI7QUFDL0I7QUFDQUgsUUFBQUEsR0FBRyxHQUFHQSxHQUFHLENBQUNJLEtBQUosQ0FBVSxDQUFWLENBQU47QUFDSDtBQUNKOztBQUNELFdBQU9KLEdBQVA7QUFDSCxHQXRCSTs7QUF3Qkw7Ozs7Ozs7O0FBUUFLLEVBQUFBLEdBQUcsRUFBRSxhQUFVTCxHQUFWLEVBQWU7QUFDaEIsUUFBSU0sU0FBUyxJQUFJLENBQUMsS0FBS0wsVUFBdkIsRUFBbUM7QUFDL0JGLE1BQUFBLEVBQUUsQ0FBQ1EsT0FBSCxDQUFXLElBQVg7QUFDQSxhQUFPLEVBQVA7QUFDSDs7QUFFRFAsSUFBQUEsR0FBRyxHQUFHLEtBQUtFLFNBQUwsQ0FBZUYsR0FBZixDQUFOOztBQUVBLFFBQUssQ0FBQ0EsR0FBRyxDQUFDUSxVQUFKLENBQWUsWUFBZixDQUFOLEVBQXFDO0FBQ2pDVCxNQUFBQSxFQUFFLENBQUNRLE9BQUgsQ0FBV0QsU0FBUyxHQUFHLElBQUgsR0FBVSxJQUE5QixFQUFvQ04sR0FBcEM7QUFDSCxLQUZELE1BR0s7QUFDRDtBQUNBLFVBQUlTLElBQUksR0FBR1YsRUFBRSxDQUFDVyxNQUFILENBQVVDLFdBQVYsQ0FBc0JYLEdBQUcsQ0FBQ0ksS0FBSixDQUFVLEVBQVYsQ0FBdEIsRUFBcUNMLEVBQUUsQ0FBQ2EsS0FBeEMsRUFBK0MsSUFBL0MsRUFBcUQsSUFBckQsQ0FBWDs7QUFDQSxVQUFJSCxJQUFKLEVBQVU7QUFDTixlQUFPVixFQUFFLENBQUNjLFlBQUgsQ0FBZ0JDLGNBQWhCLENBQStCTCxJQUEvQixFQUFxQyxJQUFyQyxJQUE2Q1YsRUFBRSxDQUFDZ0IsSUFBSCxDQUFRQyxPQUFSLENBQWdCaEIsR0FBaEIsQ0FBcEQ7QUFDSDtBQUNKOztBQUVELFdBQU8sS0FBS0MsVUFBTCxHQUFrQkQsR0FBekI7QUFDSCxHQXBESTtBQXNETGlCLEVBQUFBLEtBQUssRUFBRSxlQUFVQyxNQUFWLEVBQWtCO0FBQ3JCLFNBQUtqQixVQUFMLEdBQWtCRixFQUFFLENBQUNnQixJQUFILENBQVFJLFFBQVIsQ0FBaUJELE1BQWpCLElBQTJCLEdBQTdDO0FBQ0g7QUF4REksQ0FBVDtBQTJEQUUsTUFBTSxDQUFDQyxPQUFQLEdBQWlCdEIsRUFBRSxDQUFDQyxHQUFwQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLyoqXG4gKiBAY2xhc3MgdXJsXG4gKiBAc3RhdGljXG4gKi9cbmNjLnVybCA9IHtcblxuICAgIC8qKlxuICAgICAqIFRoZSBiYXNlIHVybCBvZiByYXcgYXNzZXRzLlxuICAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBfcmF3QXNzZXRzXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBfcmF3QXNzZXRzOiAnJyxcbiAgICBcbiAgICBub3JtYWxpemU6IGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgICAgaWYgKHVybC5jaGFyQ29kZUF0KDApID09PSA0NiAmJiB1cmwuY2hhckNvZGVBdCgxKSA9PT0gNDcpIHtcbiAgICAgICAgICAgICAgICAvLyBzdHJpcCAnLi8nXG4gICAgICAgICAgICAgICAgdXJsID0gdXJsLnNsaWNlKDIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodXJsLmNoYXJDb2RlQXQoMCkgPT09IDQ3KSB7XG4gICAgICAgICAgICAgICAgLy8gc3RyaXAgJy8nXG4gICAgICAgICAgICAgICAgdXJsID0gdXJsLnNsaWNlKDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1cmw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHVybCBvZiByYXcgYXNzZXRzLCB5b3Ugd2lsbCBvbmx5IG5lZWQgdGhpcyBpZiB0aGUgcmF3IGFzc2V0IGlzIGluc2lkZSB0aGUgXCJyZXNvdXJjZXNcIiBmb2xkZXIuXG4gICAgICogXG4gICAgICogQG1ldGhvZCByYXdcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqIEBleGFtcGxlIHtAbGluayBjb2NvczJkL2NvcmUvcGxhdGZvcm0vdXJsL3Jhdy5qc31cbiAgICAgKi9cbiAgICByYXc6IGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgaWYgKENDX0VESVRPUiAmJiAhdGhpcy5fcmF3QXNzZXRzKSB7XG4gICAgICAgICAgICBjYy5lcnJvcklEKDcwMDApO1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgdXJsID0gdGhpcy5ub3JtYWxpemUodXJsKTtcblxuICAgICAgICBpZiAoICF1cmwuc3RhcnRzV2l0aCgncmVzb3VyY2VzLycpICkge1xuICAgICAgICAgICAgY2MuZXJyb3JJRChDQ19FRElUT1IgPyA3MDAxIDogNzAwMiwgdXJsKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIENvbXBhdGlibGUgd2l0aCB2ZXJzaW9ucyBsb3dlciB0aGFuIDEuMTBcbiAgICAgICAgICAgIHZhciB1dWlkID0gY2MubG9hZGVyLl9nZXRSZXNVdWlkKHVybC5zbGljZSgxMCksIGNjLkFzc2V0LCBudWxsLCB0cnVlKTtcbiAgICAgICAgICAgIGlmICh1dWlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNjLkFzc2V0TGlicmFyeS5nZXRMaWJVcmxOb0V4dCh1dWlkLCB0cnVlKSArIGNjLnBhdGguZXh0bmFtZSh1cmwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdGhpcy5fcmF3QXNzZXRzICsgdXJsO1xuICAgIH0sXG5cbiAgICBfaW5pdDogZnVuY3Rpb24gKGFzc2V0cykge1xuICAgICAgICB0aGlzLl9yYXdBc3NldHMgPSBjYy5wYXRoLnN0cmlwU2VwKGFzc2V0cykgKyAnLyc7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjYy51cmw7XG4iXX0=