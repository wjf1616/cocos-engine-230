
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/CCAsset.js';
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
var RawAsset = require('./CCRawAsset');
/**
 * !#en
 * Base class for handling assets used in Creator.<br/>
 *
 * You may want to override:<br/>
 * - createNode<br/>
 * - getset functions of _nativeAsset<br/>
 * - cc.Object._serialize<br/>
 * - cc.Object._deserialize<br/>
 * !#zh
 * Creator 中的资源基类。<br/>
 *
 * 您可能需要重写：<br/>
 * - createNode <br/>
 * - _nativeAsset 的 getset 方法<br/>
 * - cc.Object._serialize<br/>
 * - cc.Object._deserialize<br/>
 *
 * @class Asset
 * @extends RawAsset
 */


cc.Asset = cc.Class({
  name: 'cc.Asset',
  "extends": RawAsset,
  ctor: function ctor() {
    /**
     * !#en
     * Whether the asset is loaded or not
     * !#zh
     * 该资源是否已经成功加载
     *
     * @property loaded
     * @type {Boolean}
     */
    this.loaded = true;
    /**
     * !#en
     * Points to the true url of this asset's native object, only valid when asset is loaded and asyncLoadAsset is not enabled.
     * The difference between nativeUrl and url is that the latter is final path, there is no needs to transform url by md5 and subpackage. 
     * Besides, url may points to temporary path or cached path on mini game platform which has cache mechanism (WeChat etc).
     * If you want to make use of the native file on those platforms, you should use url instead of nativeUrl.
     * 
     * !#zh
     * 资源的原生文件的真实url，只在资源被加载后以及没有启用延迟加载时才有效。 nativeUrl 与 url 的区别在于，url 是资源最终路径，所以 url 不需要再经过 md5 以及子包的路径转换，
     * 另外某些带缓存机制的小游戏平台（微信等）上url可能会指向临时文件路径或者缓存路径，如果你需要在这些平台上使用资源的原生文件，请使用url，避免使用nativeUrl
     * @property url
     * @type {String}
     */

    this.url = '';
  },
  properties: {
    /**
     * !#en
     * Returns the url of this asset's native object, if none it will returns an empty string.
     * !#zh
     * 返回该资源对应的目标平台资源的 URL，如果没有将返回一个空字符串。
     * @property nativeUrl
     * @type {String}
     * @readOnly
     */
    nativeUrl: {
      get: function get() {
        if (this._native) {
          var name = this._native;

          if (name.charCodeAt(0) === 47) {
            // '/'
            // remove library tag
            // not imported in library, just created on-the-fly
            return name.slice(1);
          }

          if (cc.AssetLibrary) {
            var base = cc.AssetLibrary.getLibUrlNoExt(this._uuid, true);

            if (name.charCodeAt(0) === 46) {
              // '.'
              // imported in dir where json exist
              return base + name;
            } else {
              // imported in an independent dir
              return base + '/' + name;
            }
          } else {
            cc.errorID(6400);
          }
        }

        return '';
      },
      visible: false
    },

    /**
     * Serializable url for native asset.
     * @property {String} _native
     * @default undefined
     * @private
     */
    _native: "",

    /**
     * The underlying native asset of this asset if one is available.
     * This property can be used to access additional details or functionality releated to the asset.
     * This property will be initialized by the loader if `_native` is available.
     * @property {Object} _nativeAsset
     * @default null
     * @private
     */
    _nativeAsset: {
      get: function get() {
        return this._$nativeAsset;
      },
      set: function set(obj) {
        this._$nativeAsset = obj;
      }
    }
  },
  statics: {
    /**
     * 应 AssetDB 要求提供这个方法
     *
     * @method deserialize
     * @param {String} data
     * @return {Asset}
     * @static
     * @private
     */
    deserialize: CC_EDITOR && function (data) {
      return cc.deserialize(data);
    },

    /**
     * !#en Indicates whether its dependent raw assets can support deferred load if the owner scene (or prefab) is marked as `asyncLoadAssets`.
     * !#zh 当场景或 Prefab 被标记为 `asyncLoadAssets`，禁止延迟加载该资源所依赖的其它 RawAsset。
     *
     * @property {Boolean} preventDeferredLoadDependents
     * @default false
     * @static
     */
    preventDeferredLoadDependents: false,

    /**
     * !#en Indicates whether its native object should be preloaded from native url.
     * !#zh 禁止预加载原生对象。
     *
     * @property {Boolean} preventPreloadNativeObject
     * @default false
     * @static
     */
    preventPreloadNativeObject: false
  },

  /**
   * Returns the asset's url.
   *
   * The `Asset` object overrides the `toString()` method of the `Object` object.
   * For `Asset` objects, the toString() method returns a string representation of the object.
   * JavaScript calls the toString() method automatically when an asset is to be represented as a text value or when a texture is referred to in a string concatenation.
   *
   * @method toString
   * @return {String}
   */
  toString: function toString() {
    return this.nativeUrl;
  },

  /**
   * 应 AssetDB 要求提供这个方法
   *
   * @method serialize
   * @return {String}
   * @private
   */
  serialize: CC_EDITOR && function () {
    return Editor.serialize(this);
  },

  /**
   * !#en
   * Create a new node using this asset in the scene.<br/>
   * If this type of asset dont have its corresponding node type, this method should be null.
   * !#zh
   * 使用该资源在场景中创建一个新节点。<br/>
   * 如果这类资源没有相应的节点类型，该方法应该是空的。
   *
   * @method createNode
   * @param {Function} callback
   * @param {String} callback.error - null or the error info
   * @param {Object} callback.node - the created node or null
   */
  createNode: null,

  /**
   * Set native file name for this asset.
   * @seealso nativeUrl
   *
   * @method _setRawAsset
   * @param {String} filename
   * @param {Boolean} [inLibrary=true]
   * @private
   */
  _setRawAsset: function _setRawAsset(filename, inLibrary) {
    if (inLibrary !== false) {
      this._native = filename || undefined;
    } else {
      this._native = '/' + filename; // simply use '/' to tag location where is not in the library
    }
  }
});
module.exports = cc.Asset;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDQXNzZXQuanMiXSwibmFtZXMiOlsiUmF3QXNzZXQiLCJyZXF1aXJlIiwiY2MiLCJBc3NldCIsIkNsYXNzIiwibmFtZSIsImN0b3IiLCJsb2FkZWQiLCJ1cmwiLCJwcm9wZXJ0aWVzIiwibmF0aXZlVXJsIiwiZ2V0IiwiX25hdGl2ZSIsImNoYXJDb2RlQXQiLCJzbGljZSIsIkFzc2V0TGlicmFyeSIsImJhc2UiLCJnZXRMaWJVcmxOb0V4dCIsIl91dWlkIiwiZXJyb3JJRCIsInZpc2libGUiLCJfbmF0aXZlQXNzZXQiLCJfJG5hdGl2ZUFzc2V0Iiwic2V0Iiwib2JqIiwic3RhdGljcyIsImRlc2VyaWFsaXplIiwiQ0NfRURJVE9SIiwiZGF0YSIsInByZXZlbnREZWZlcnJlZExvYWREZXBlbmRlbnRzIiwicHJldmVudFByZWxvYWROYXRpdmVPYmplY3QiLCJ0b1N0cmluZyIsInNlcmlhbGl6ZSIsIkVkaXRvciIsImNyZWF0ZU5vZGUiLCJfc2V0UmF3QXNzZXQiLCJmaWxlbmFtZSIsImluTGlicmFyeSIsInVuZGVmaW5lZCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFJQSxRQUFRLEdBQUdDLE9BQU8sQ0FBQyxjQUFELENBQXRCO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJBQyxFQUFFLENBQUNDLEtBQUgsR0FBV0QsRUFBRSxDQUFDRSxLQUFILENBQVM7QUFDaEJDLEVBQUFBLElBQUksRUFBRSxVQURVO0FBQ0UsYUFBU0wsUUFEWDtBQUdoQk0sRUFBQUEsSUFIZ0Isa0JBR1I7QUFDSjs7Ozs7Ozs7O0FBU0EsU0FBS0MsTUFBTCxHQUFjLElBQWQ7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUFhQSxTQUFLQyxHQUFMLEdBQVcsRUFBWDtBQUNILEdBN0JlO0FBK0JoQkMsRUFBQUEsVUFBVSxFQUFFO0FBQ1I7Ozs7Ozs7OztBQVNBQyxJQUFBQSxTQUFTLEVBQUU7QUFDUEMsTUFBQUEsR0FBRyxFQUFFLGVBQVk7QUFDYixZQUFJLEtBQUtDLE9BQVQsRUFBa0I7QUFDZCxjQUFJUCxJQUFJLEdBQUcsS0FBS08sT0FBaEI7O0FBQ0EsY0FBSVAsSUFBSSxDQUFDUSxVQUFMLENBQWdCLENBQWhCLE1BQXVCLEVBQTNCLEVBQStCO0FBQUs7QUFDaEM7QUFDQTtBQUNBLG1CQUFPUixJQUFJLENBQUNTLEtBQUwsQ0FBVyxDQUFYLENBQVA7QUFDSDs7QUFDRCxjQUFJWixFQUFFLENBQUNhLFlBQVAsRUFBcUI7QUFDakIsZ0JBQUlDLElBQUksR0FBR2QsRUFBRSxDQUFDYSxZQUFILENBQWdCRSxjQUFoQixDQUErQixLQUFLQyxLQUFwQyxFQUEyQyxJQUEzQyxDQUFYOztBQUNBLGdCQUFJYixJQUFJLENBQUNRLFVBQUwsQ0FBZ0IsQ0FBaEIsTUFBdUIsRUFBM0IsRUFBK0I7QUFBRztBQUM5QjtBQUNBLHFCQUFPRyxJQUFJLEdBQUdYLElBQWQ7QUFDSCxhQUhELE1BSUs7QUFDRDtBQUNBLHFCQUFPVyxJQUFJLEdBQUcsR0FBUCxHQUFhWCxJQUFwQjtBQUNIO0FBQ0osV0FWRCxNQVdLO0FBQ0RILFlBQUFBLEVBQUUsQ0FBQ2lCLE9BQUgsQ0FBVyxJQUFYO0FBQ0g7QUFDSjs7QUFDRCxlQUFPLEVBQVA7QUFDSCxPQXpCTTtBQTBCUEMsTUFBQUEsT0FBTyxFQUFFO0FBMUJGLEtBVkg7O0FBdUNSOzs7Ozs7QUFNQVIsSUFBQUEsT0FBTyxFQUFFLEVBN0NEOztBQStDUjs7Ozs7Ozs7QUFRQVMsSUFBQUEsWUFBWSxFQUFFO0FBQ1ZWLE1BQUFBLEdBRFUsaUJBQ0g7QUFDSCxlQUFPLEtBQUtXLGFBQVo7QUFDSCxPQUhTO0FBSVZDLE1BQUFBLEdBSlUsZUFJTEMsR0FKSyxFQUlBO0FBQ04sYUFBS0YsYUFBTCxHQUFxQkUsR0FBckI7QUFDSDtBQU5TO0FBdkROLEdBL0JJO0FBZ0doQkMsRUFBQUEsT0FBTyxFQUFFO0FBQ0w7Ozs7Ozs7OztBQVNBQyxJQUFBQSxXQUFXLEVBQUVDLFNBQVMsSUFBSSxVQUFVQyxJQUFWLEVBQWdCO0FBQ3RDLGFBQU8xQixFQUFFLENBQUN3QixXQUFILENBQWVFLElBQWYsQ0FBUDtBQUNILEtBWkk7O0FBY0w7Ozs7Ozs7O0FBUUFDLElBQUFBLDZCQUE2QixFQUFFLEtBdEIxQjs7QUF3Qkw7Ozs7Ozs7O0FBUUFDLElBQUFBLDBCQUEwQixFQUFFO0FBaEN2QixHQWhHTzs7QUFtSWhCOzs7Ozs7Ozs7O0FBVUFDLEVBQUFBLFFBN0lnQixzQkE2SUo7QUFDUixXQUFPLEtBQUtyQixTQUFaO0FBQ0gsR0EvSWU7O0FBaUpoQjs7Ozs7OztBQU9Bc0IsRUFBQUEsU0FBUyxFQUFFTCxTQUFTLElBQUksWUFBWTtBQUNoQyxXQUFPTSxNQUFNLENBQUNELFNBQVAsQ0FBaUIsSUFBakIsQ0FBUDtBQUNILEdBMUplOztBQTRKaEI7Ozs7Ozs7Ozs7Ozs7QUFhQUUsRUFBQUEsVUFBVSxFQUFFLElBektJOztBQTJLaEI7Ozs7Ozs7OztBQVNBQyxFQUFBQSxZQUFZLEVBQUUsc0JBQVVDLFFBQVYsRUFBb0JDLFNBQXBCLEVBQStCO0FBQ3pDLFFBQUlBLFNBQVMsS0FBSyxLQUFsQixFQUF5QjtBQUNyQixXQUFLekIsT0FBTCxHQUFld0IsUUFBUSxJQUFJRSxTQUEzQjtBQUNILEtBRkQsTUFHSztBQUNELFdBQUsxQixPQUFMLEdBQWUsTUFBTXdCLFFBQXJCLENBREMsQ0FDK0I7QUFDbkM7QUFDSjtBQTNMZSxDQUFULENBQVg7QUE4TEFHLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnRDLEVBQUUsQ0FBQ0MsS0FBcEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnZhciBSYXdBc3NldCA9IHJlcXVpcmUoJy4vQ0NSYXdBc3NldCcpO1xuXG4vKipcbiAqICEjZW5cbiAqIEJhc2UgY2xhc3MgZm9yIGhhbmRsaW5nIGFzc2V0cyB1c2VkIGluIENyZWF0b3IuPGJyLz5cbiAqXG4gKiBZb3UgbWF5IHdhbnQgdG8gb3ZlcnJpZGU6PGJyLz5cbiAqIC0gY3JlYXRlTm9kZTxici8+XG4gKiAtIGdldHNldCBmdW5jdGlvbnMgb2YgX25hdGl2ZUFzc2V0PGJyLz5cbiAqIC0gY2MuT2JqZWN0Ll9zZXJpYWxpemU8YnIvPlxuICogLSBjYy5PYmplY3QuX2Rlc2VyaWFsaXplPGJyLz5cbiAqICEjemhcbiAqIENyZWF0b3Ig5Lit55qE6LWE5rqQ5Z+657G744CCPGJyLz5cbiAqXG4gKiDmgqjlj6/og73pnIDopoHph43lhpnvvJo8YnIvPlxuICogLSBjcmVhdGVOb2RlIDxici8+XG4gKiAtIF9uYXRpdmVBc3NldCDnmoQgZ2V0c2V0IOaWueazlTxici8+XG4gKiAtIGNjLk9iamVjdC5fc2VyaWFsaXplPGJyLz5cbiAqIC0gY2MuT2JqZWN0Ll9kZXNlcmlhbGl6ZTxici8+XG4gKlxuICogQGNsYXNzIEFzc2V0XG4gKiBAZXh0ZW5kcyBSYXdBc3NldFxuICovXG5jYy5Bc3NldCA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuQXNzZXQnLCBleHRlbmRzOiBSYXdBc3NldCxcblxuICAgIGN0b3IgKCkge1xuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBXaGV0aGVyIHRoZSBhc3NldCBpcyBsb2FkZWQgb3Igbm90XG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog6K+l6LWE5rqQ5piv5ZCm5bey57uP5oiQ5Yqf5Yqg6L29XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm9wZXJ0eSBsb2FkZWRcbiAgICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmxvYWRlZCA9IHRydWU7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogUG9pbnRzIHRvIHRoZSB0cnVlIHVybCBvZiB0aGlzIGFzc2V0J3MgbmF0aXZlIG9iamVjdCwgb25seSB2YWxpZCB3aGVuIGFzc2V0IGlzIGxvYWRlZCBhbmQgYXN5bmNMb2FkQXNzZXQgaXMgbm90IGVuYWJsZWQuXG4gICAgICAgICAqIFRoZSBkaWZmZXJlbmNlIGJldHdlZW4gbmF0aXZlVXJsIGFuZCB1cmwgaXMgdGhhdCB0aGUgbGF0dGVyIGlzIGZpbmFsIHBhdGgsIHRoZXJlIGlzIG5vIG5lZWRzIHRvIHRyYW5zZm9ybSB1cmwgYnkgbWQ1IGFuZCBzdWJwYWNrYWdlLiBcbiAgICAgICAgICogQmVzaWRlcywgdXJsIG1heSBwb2ludHMgdG8gdGVtcG9yYXJ5IHBhdGggb3IgY2FjaGVkIHBhdGggb24gbWluaSBnYW1lIHBsYXRmb3JtIHdoaWNoIGhhcyBjYWNoZSBtZWNoYW5pc20gKFdlQ2hhdCBldGMpLlxuICAgICAgICAgKiBJZiB5b3Ugd2FudCB0byBtYWtlIHVzZSBvZiB0aGUgbmF0aXZlIGZpbGUgb24gdGhvc2UgcGxhdGZvcm1zLCB5b3Ugc2hvdWxkIHVzZSB1cmwgaW5zdGVhZCBvZiBuYXRpdmVVcmwuXG4gICAgICAgICAqIFxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOi1hOa6kOeahOWOn+eUn+aWh+S7tueahOecn+WunnVybO+8jOWPquWcqOi1hOa6kOiiq+WKoOi9veWQjuS7peWPiuayoeacieWQr+eUqOW7tui/n+WKoOi9veaXtuaJjeacieaViOOAgiBuYXRpdmVVcmwg5LiOIHVybCDnmoTljLrliKvlnKjkuo7vvIx1cmwg5piv6LWE5rqQ5pyA57uI6Lev5b6E77yM5omA5LulIHVybCDkuI3pnIDopoHlho3nu4/ov4cgbWQ1IOS7peWPiuWtkOWMheeahOi3r+W+hOi9rOaNou+8jFxuICAgICAgICAgKiDlj6blpJbmn5DkupvluKbnvJPlrZjmnLrliLbnmoTlsI/muLjmiI/lubPlj7DvvIjlvq7kv6HnrYnvvInkuIp1cmzlj6/og73kvJrmjIflkJHkuLTml7bmlofku7bot6/lvoTmiJbogIXnvJPlrZjot6/lvoTvvIzlpoLmnpzkvaDpnIDopoHlnKjov5nkupvlubPlj7DkuIrkvb/nlKjotYTmupDnmoTljp/nlJ/mlofku7bvvIzor7fkvb/nlKh1cmzvvIzpgb/lhY3kvb/nlKhuYXRpdmVVcmxcbiAgICAgICAgICogQHByb3BlcnR5IHVybFxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy51cmwgPSAnJztcbiAgICB9LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBSZXR1cm5zIHRoZSB1cmwgb2YgdGhpcyBhc3NldCdzIG5hdGl2ZSBvYmplY3QsIGlmIG5vbmUgaXQgd2lsbCByZXR1cm5zIGFuIGVtcHR5IHN0cmluZy5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDov5Tlm57or6XotYTmupDlr7nlupTnmoTnm67moIflubPlj7DotYTmupDnmoQgVVJM77yM5aaC5p6c5rKh5pyJ5bCG6L+U5Zue5LiA5Liq56m65a2X56ym5Liy44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBuYXRpdmVVcmxcbiAgICAgICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAgICogQHJlYWRPbmx5XG4gICAgICAgICAqL1xuICAgICAgICBuYXRpdmVVcmw6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9uYXRpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5hbWUgPSB0aGlzLl9uYXRpdmU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuYW1lLmNoYXJDb2RlQXQoMCkgPT09IDQ3KSB7ICAgIC8vICcvJ1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGxpYnJhcnkgdGFnXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBub3QgaW1wb3J0ZWQgaW4gbGlicmFyeSwganVzdCBjcmVhdGVkIG9uLXRoZS1mbHlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuYW1lLnNsaWNlKDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYy5Bc3NldExpYnJhcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBiYXNlID0gY2MuQXNzZXRMaWJyYXJ5LmdldExpYlVybE5vRXh0KHRoaXMuX3V1aWQsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5hbWUuY2hhckNvZGVBdCgwKSA9PT0gNDYpIHsgIC8vICcuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGltcG9ydGVkIGluIGRpciB3aGVyZSBqc29uIGV4aXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhc2UgKyBuYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW1wb3J0ZWQgaW4gYW4gaW5kZXBlbmRlbnQgZGlyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJhc2UgKyAnLycgKyBuYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2MuZXJyb3JJRCg2NDAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2VyaWFsaXphYmxlIHVybCBmb3IgbmF0aXZlIGFzc2V0LlxuICAgICAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gX25hdGl2ZVxuICAgICAgICAgKiBAZGVmYXVsdCB1bmRlZmluZWRcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIF9uYXRpdmU6IFwiXCIsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSB1bmRlcmx5aW5nIG5hdGl2ZSBhc3NldCBvZiB0aGlzIGFzc2V0IGlmIG9uZSBpcyBhdmFpbGFibGUuXG4gICAgICAgICAqIFRoaXMgcHJvcGVydHkgY2FuIGJlIHVzZWQgdG8gYWNjZXNzIGFkZGl0aW9uYWwgZGV0YWlscyBvciBmdW5jdGlvbmFsaXR5IHJlbGVhdGVkIHRvIHRoZSBhc3NldC5cbiAgICAgICAgICogVGhpcyBwcm9wZXJ0eSB3aWxsIGJlIGluaXRpYWxpemVkIGJ5IHRoZSBsb2FkZXIgaWYgYF9uYXRpdmVgIGlzIGF2YWlsYWJsZS5cbiAgICAgICAgICogQHByb3BlcnR5IHtPYmplY3R9IF9uYXRpdmVBc3NldFxuICAgICAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBfbmF0aXZlQXNzZXQ6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuXyRuYXRpdmVBc3NldDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKG9iaikge1xuICAgICAgICAgICAgICAgIHRoaXMuXyRuYXRpdmVBc3NldCA9IG9iajtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgc3RhdGljczoge1xuICAgICAgICAvKipcbiAgICAgICAgICog5bqUIEFzc2V0REIg6KaB5rGC5o+Q5L6b6L+Z5Liq5pa55rOVXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZXRob2QgZGVzZXJpYWxpemVcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGFcbiAgICAgICAgICogQHJldHVybiB7QXNzZXR9XG4gICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGRlc2VyaWFsaXplOiBDQ19FRElUT1IgJiYgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBjYy5kZXNlcmlhbGl6ZShkYXRhKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBJbmRpY2F0ZXMgd2hldGhlciBpdHMgZGVwZW5kZW50IHJhdyBhc3NldHMgY2FuIHN1cHBvcnQgZGVmZXJyZWQgbG9hZCBpZiB0aGUgb3duZXIgc2NlbmUgKG9yIHByZWZhYikgaXMgbWFya2VkIGFzIGBhc3luY0xvYWRBc3NldHNgLlxuICAgICAgICAgKiAhI3poIOW9k+WcuuaZr+aIliBQcmVmYWIg6KKr5qCH6K6w5Li6IGBhc3luY0xvYWRBc3NldHNg77yM56aB5q2i5bu26L+f5Yqg6L296K+l6LWE5rqQ5omA5L6d6LWW55qE5YW25a6DIFJhd0Fzc2V044CCXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gcHJldmVudERlZmVycmVkTG9hZERlcGVuZGVudHNcbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICogQHN0YXRpY1xuICAgICAgICAgKi9cbiAgICAgICAgcHJldmVudERlZmVycmVkTG9hZERlcGVuZGVudHM6IGZhbHNlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIEluZGljYXRlcyB3aGV0aGVyIGl0cyBuYXRpdmUgb2JqZWN0IHNob3VsZCBiZSBwcmVsb2FkZWQgZnJvbSBuYXRpdmUgdXJsLlxuICAgICAgICAgKiAhI3poIOemgeatoumihOWKoOi9veWOn+eUn+WvueixoeOAglxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IHByZXZlbnRQcmVsb2FkTmF0aXZlT2JqZWN0XG4gICAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgICovXG4gICAgICAgIHByZXZlbnRQcmVsb2FkTmF0aXZlT2JqZWN0OiBmYWxzZVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBhc3NldCdzIHVybC5cbiAgICAgKlxuICAgICAqIFRoZSBgQXNzZXRgIG9iamVjdCBvdmVycmlkZXMgdGhlIGB0b1N0cmluZygpYCBtZXRob2Qgb2YgdGhlIGBPYmplY3RgIG9iamVjdC5cbiAgICAgKiBGb3IgYEFzc2V0YCBvYmplY3RzLCB0aGUgdG9TdHJpbmcoKSBtZXRob2QgcmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgb2JqZWN0LlxuICAgICAqIEphdmFTY3JpcHQgY2FsbHMgdGhlIHRvU3RyaW5nKCkgbWV0aG9kIGF1dG9tYXRpY2FsbHkgd2hlbiBhbiBhc3NldCBpcyB0byBiZSByZXByZXNlbnRlZCBhcyBhIHRleHQgdmFsdWUgb3Igd2hlbiBhIHRleHR1cmUgaXMgcmVmZXJyZWQgdG8gaW4gYSBzdHJpbmcgY29uY2F0ZW5hdGlvbi5cbiAgICAgKlxuICAgICAqIEBtZXRob2QgdG9TdHJpbmdcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICovXG4gICAgdG9TdHJpbmcgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYXRpdmVVcmw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOW6lCBBc3NldERCIOimgeaxguaPkOS+m+i/meS4quaWueazlVxuICAgICAqXG4gICAgICogQG1ldGhvZCBzZXJpYWxpemVcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBzZXJpYWxpemU6IENDX0VESVRPUiAmJiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBFZGl0b3Iuc2VyaWFsaXplKHRoaXMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQ3JlYXRlIGEgbmV3IG5vZGUgdXNpbmcgdGhpcyBhc3NldCBpbiB0aGUgc2NlbmUuPGJyLz5cbiAgICAgKiBJZiB0aGlzIHR5cGUgb2YgYXNzZXQgZG9udCBoYXZlIGl0cyBjb3JyZXNwb25kaW5nIG5vZGUgdHlwZSwgdGhpcyBtZXRob2Qgc2hvdWxkIGJlIG51bGwuXG4gICAgICogISN6aFxuICAgICAqIOS9v+eUqOivpei1hOa6kOWcqOWcuuaZr+S4reWIm+W7uuS4gOS4quaWsOiKgueCueOAgjxici8+XG4gICAgICog5aaC5p6c6L+Z57G76LWE5rqQ5rKh5pyJ55u45bqU55qE6IqC54K557G75Z6L77yM6K+l5pa55rOV5bqU6K+l5piv56m655qE44CCXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGNyZWF0ZU5vZGVcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjYWxsYmFjay5lcnJvciAtIG51bGwgb3IgdGhlIGVycm9yIGluZm9cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY2FsbGJhY2subm9kZSAtIHRoZSBjcmVhdGVkIG5vZGUgb3IgbnVsbFxuICAgICAqL1xuICAgIGNyZWF0ZU5vZGU6IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiBTZXQgbmF0aXZlIGZpbGUgbmFtZSBmb3IgdGhpcyBhc3NldC5cbiAgICAgKiBAc2VlYWxzbyBuYXRpdmVVcmxcbiAgICAgKlxuICAgICAqIEBtZXRob2QgX3NldFJhd0Fzc2V0XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZpbGVuYW1lXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbaW5MaWJyYXJ5PXRydWVdXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0UmF3QXNzZXQ6IGZ1bmN0aW9uIChmaWxlbmFtZSwgaW5MaWJyYXJ5KSB7XG4gICAgICAgIGlmIChpbkxpYnJhcnkgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICB0aGlzLl9uYXRpdmUgPSBmaWxlbmFtZSB8fCB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9uYXRpdmUgPSAnLycgKyBmaWxlbmFtZTsgIC8vIHNpbXBseSB1c2UgJy8nIHRvIHRhZyBsb2NhdGlvbiB3aGVyZSBpcyBub3QgaW4gdGhlIGxpYnJhcnlcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNjLkFzc2V0O1xuIl19