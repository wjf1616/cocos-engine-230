
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/CCPrefab.js';
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
 * !#zh
 * Prefab 创建实例所用的优化策略，配合 {{#crossLink "Prefab.optimizationPolicy"}}cc.Prefab#optimizationPolicy{{/crossLink}} 使用。
 * !#en
 * An enumeration used with the {{#crossLink "Prefab.optimizationPolicy"}}cc.Prefab#optimizationPolicy{{/crossLink}}
 * to specify how to optimize the instantiate operation.
 *
 * @enum Prefab.OptimizationPolicy
 * @since 1.10.0
 */
var OptimizationPolicy = cc.Enum({
  /**
   * !#zh
   * 根据创建次数自动调整优化策略。初次创建实例时，行为等同 SINGLE_INSTANCE，多次创建后将自动采用 MULTI_INSTANCE。
   * !#en
   * The optimization policy is automatically chosen based on the number of instantiations.
   * When you first create an instance, the behavior is the same as SINGLE_INSTANCE. MULTI_INSTANCE will be automatically used after multiple creation.
   * @property {Number} AUTO
   */
  AUTO: 0,

  /**
   * !#zh
   * 优化单次创建性能。<br>
   * 该选项会跳过针对这个 prefab 的代码生成优化操作。当该 prefab 加载后，一般只会创建一个实例时，请选择此项。
   * !#en
   * Optimize for single instance creation.<br>
   * This option skips code generation for this prefab.
   * When this prefab will usually create only one instances, please select this option.
   * @property {Number} SINGLE_INSTANCE
   */
  SINGLE_INSTANCE: 1,

  /**
   * !#zh
   * 优化多次创建性能。<br>
   * 该选项会启用针对这个 prefab 的代码生成优化操作。当该 prefab 加载后，一般会创建多个实例时，请选择此项。如果该 prefab 在场景中的节点启用了自动关联，并且在场景中有多份实例，也建议选择此项。
   * !#en
   * Optimize for creating instances multiple times.<br>
   * This option enables code generation for this prefab.
   * When this prefab will usually create multiple instances, please select this option.
   * It is also recommended to select this option if the prefab instance in the scene has Auto Sync enabled and there are multiple instances in the scene.
   * @property {Number} MULTI_INSTANCE
   */
  MULTI_INSTANCE: 2
});
/**
 * !#en Class for prefab handling.
 * !#zh 预制资源类。
 * @class Prefab
 * @extends Asset
 */

var Prefab = cc.Class({
  name: 'cc.Prefab',
  "extends": cc.Asset,
  ctor: function ctor() {
    /**
     * Cache function to optimize instance creaton.
     * @property {Function} _createFunction
     * @private
     */
    this._createFunction = null;
    this._instantiatedTimes = 0;
  },
  properties: {
    /**
     * @property {Node} data - the main cc.Node in the prefab
     */
    data: null,

    /**
     * !#zh
     * 设置实例化这个 prefab 时所用的优化策略。根据使用情况设置为合适的值，能优化该 prefab 实例化所用的时间。
     * !#en
     * Indicates the optimization policy for instantiating this prefab.
     * Set to a suitable value based on usage, can optimize the time it takes to instantiate this prefab.
     *
     * @property {Prefab.OptimizationPolicy} optimizationPolicy
     * @default Prefab.OptimizationPolicy.AUTO
     * @since 1.10.0
     * @example
     * prefab.optimizationPolicy = cc.Prefab.OptimizationPolicy.MULTI_INSTANCE;
     */
    optimizationPolicy: OptimizationPolicy.AUTO,

    /**
     * !#en Indicates the raw assets of this prefab can be load after prefab loaded.
     * !#zh 指示该 Prefab 依赖的资源可否在 Prefab 加载后再延迟加载。
     * @property {Boolean} asyncLoadAssets
     * @default false
     */
    asyncLoadAssets: false,

    /**
     * @property {Boolean} readonly
     * @default false
     */
    readonly: {
      "default": false,
      editorOnly: true
    }
  },
  statics: {
    OptimizationPolicy: OptimizationPolicy,
    OptimizationPolicyThreshold: 3
  },
  createNode: CC_EDITOR && function (cb) {
    var node = cc.instantiate(this);
    node.name = this.name;
    cb(null, node);
  },

  /**
   * Dynamically translation prefab data into minimized code.<br/>
   * This method will be called automatically before the first time the prefab being instantiated,
   * but you can re-call to refresh the create function once you modified the original prefab data in script.
   * @method compileCreateFunction
   */
  compileCreateFunction: function compileCreateFunction() {
    var jit = require('../platform/instantiate-jit');

    this._createFunction = jit.compile(this.data);
  },
  // just instantiate, will not initialize the Node, this will be called during Node's initialization.
  // @param {Node} [rootToRedirect] - specify an instantiated prefabRoot that all references to prefabRoot in prefab
  //                                  will redirect to
  _doInstantiate: function _doInstantiate(rootToRedirect) {
    if (this.data._prefab) {
      // prefab asset is always synced
      this.data._prefab._synced = true;
    } else {
      // temp guard code
      cc.warnID(3700);
    }

    if (!this._createFunction) {
      this.compileCreateFunction();
    }

    return this._createFunction(rootToRedirect); // this.data._instantiate();
  },
  _instantiate: function _instantiate() {
    var node,
        useJit = false;

    if (CC_SUPPORT_JIT) {
      if (this.optimizationPolicy === OptimizationPolicy.SINGLE_INSTANCE) {
        useJit = false;
      } else if (this.optimizationPolicy === OptimizationPolicy.MULTI_INSTANCE) {
        useJit = true;
      } else {
        // auto
        useJit = this._instantiatedTimes + 1 >= Prefab.OptimizationPolicyThreshold;
      }
    }

    if (useJit) {
      // instantiate node
      node = this._doInstantiate(); // initialize node

      this.data._instantiate(node);
    } else {
      // prefab asset is always synced
      this.data._prefab._synced = true; // instantiate node

      node = this.data._instantiate();
    }

    ++this._instantiatedTimes; // link prefab in editor

    if (CC_EDITOR || CC_TEST) {
      var PrefabUtils = Editor.require('scene://utils/prefab'); // This operation is not necessary, but some old prefab asset may not contain complete data.


      PrefabUtils.linkPrefab(this, node);
    }

    return node;
  },
  destroy: function destroy() {
    this.data && this.data.destroy();

    this._super();
  }
});
cc.Prefab = module.exports = Prefab;
cc.js.obsolete(cc, 'cc._Prefab', 'Prefab');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDUHJlZmFiLmpzIl0sIm5hbWVzIjpbIk9wdGltaXphdGlvblBvbGljeSIsImNjIiwiRW51bSIsIkFVVE8iLCJTSU5HTEVfSU5TVEFOQ0UiLCJNVUxUSV9JTlNUQU5DRSIsIlByZWZhYiIsIkNsYXNzIiwibmFtZSIsIkFzc2V0IiwiY3RvciIsIl9jcmVhdGVGdW5jdGlvbiIsIl9pbnN0YW50aWF0ZWRUaW1lcyIsInByb3BlcnRpZXMiLCJkYXRhIiwib3B0aW1pemF0aW9uUG9saWN5IiwiYXN5bmNMb2FkQXNzZXRzIiwicmVhZG9ubHkiLCJlZGl0b3JPbmx5Iiwic3RhdGljcyIsIk9wdGltaXphdGlvblBvbGljeVRocmVzaG9sZCIsImNyZWF0ZU5vZGUiLCJDQ19FRElUT1IiLCJjYiIsIm5vZGUiLCJpbnN0YW50aWF0ZSIsImNvbXBpbGVDcmVhdGVGdW5jdGlvbiIsImppdCIsInJlcXVpcmUiLCJjb21waWxlIiwiX2RvSW5zdGFudGlhdGUiLCJyb290VG9SZWRpcmVjdCIsIl9wcmVmYWIiLCJfc3luY2VkIiwid2FybklEIiwiX2luc3RhbnRpYXRlIiwidXNlSml0IiwiQ0NfU1VQUE9SVF9KSVQiLCJDQ19URVNUIiwiUHJlZmFiVXRpbHMiLCJFZGl0b3IiLCJsaW5rUHJlZmFiIiwiZGVzdHJveSIsIl9zdXBlciIsIm1vZHVsZSIsImV4cG9ydHMiLCJqcyIsIm9ic29sZXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBOzs7Ozs7Ozs7O0FBVUEsSUFBSUEsa0JBQWtCLEdBQUdDLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRO0FBQzdCOzs7Ozs7OztBQVFBQyxFQUFBQSxJQUFJLEVBQUUsQ0FUdUI7O0FBVTdCOzs7Ozs7Ozs7O0FBVUFDLEVBQUFBLGVBQWUsRUFBRSxDQXBCWTs7QUFxQjdCOzs7Ozs7Ozs7OztBQVdBQyxFQUFBQSxjQUFjLEVBQUU7QUFoQ2EsQ0FBUixDQUF6QjtBQW1DQTs7Ozs7OztB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QUFWLENBQWtCQyxPQUFsQixHQUE0QixJQUE1QixDQUZDLENBR0Q7O0FBQ0FULE1BQUFBLElBQUksR0FBRyxLQUFLVixJQUFMLENBQVVxQixZQUFWLEVBQVA7QUFDSDs7QUFDRCxNQUFFLEtBQUt2QixrQkFBUCxDQTFCc0IsQ0E0QnRCOztBQUNBLFFBQUlVLFNBQVMsSUFBSWdCLE9BQWpCLEVBQTBCO0FBQ3RCLFVBQUlDLFdBQVcsR0FBR0MsTUFBTSxDQUFDWixPQUFQLENBQWUsc0JBQWYsQ0FBbEIsQ0FEc0IsQ0FFdEI7OztBQUNBVyxNQUFBQSxXQUFXLENBQUNFLFVBQVosQ0FBdUIsSUFBdkIsRUFBNkJqQixJQUE3QjtBQUNIOztBQUNELFdBQU9BLElBQVA7QUFDSCxHQWhJaUI7QUFrSWxCa0IsRUFBQUEsT0FsSWtCLHFCQWtJUDtBQUNQLFNBQUs1QixJQUFMLElBQWEsS0FBS0EsSUFBTCxDQUFVNEIsT0FBVixFQUFiOztBQUNBLFNBQUtDLE1BQUw7QUFDSDtBQXJJaUIsQ0FBVCxDQUFiO0FBd0lBMUMsRUFBRSxDQUFDSyxNQUFILEdBQVlzQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJ2QyxNQUE3QjtBQUNBTCxFQUFFLENBQUM2QyxFQUFILENBQU1DLFFBQU4sQ0FBZTlDLEVBQWYsRUFBbUIsWUFBbkIsRUFBaUMsUUFBakMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qKlxuICogISN6aFxuICogUHJlZmFiIOWIm+W7uuWunuS+i+aJgOeUqOeahOS8mOWMluetlueVpe+8jOmFjeWQiCB7eyNjcm9zc0xpbmsgXCJQcmVmYWIub3B0aW1pemF0aW9uUG9saWN5XCJ9fWNjLlByZWZhYiNvcHRpbWl6YXRpb25Qb2xpY3l7ey9jcm9zc0xpbmt9fSDkvb/nlKjjgIJcbiAqICEjZW5cbiAqIEFuIGVudW1lcmF0aW9uIHVzZWQgd2l0aCB0aGUge3sjY3Jvc3NMaW5rIFwiUHJlZmFiLm9wdGltaXphdGlvblBvbGljeVwifX1jYy5QcmVmYWIjb3B0aW1pemF0aW9uUG9saWN5e3svY3Jvc3NMaW5rfX1cbiAqIHRvIHNwZWNpZnkgaG93IHRvIG9wdGltaXplIHRoZSBpbnN0YW50aWF0ZSBvcGVyYXRpb24uXG4gKlxuICogQGVudW0gUHJlZmFiLk9wdGltaXphdGlvblBvbGljeVxuICogQHNpbmNlIDEuMTAuMFxuICovXG52YXIgT3B0aW1pemF0aW9uUG9saWN5ID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogISN6aFxuICAgICAqIOagueaNruWIm+W7uuasoeaVsOiHquWKqOiwg+aVtOS8mOWMluetlueVpeOAguWIneasoeWIm+W7uuWunuS+i+aXtu+8jOihjOS4uuetieWQjCBTSU5HTEVfSU5TVEFOQ0XvvIzlpJrmrKHliJvlu7rlkI7lsIboh6rliqjph4fnlKggTVVMVElfSU5TVEFOQ0XjgIJcbiAgICAgKiAhI2VuXG4gICAgICogVGhlIG9wdGltaXphdGlvbiBwb2xpY3kgaXMgYXV0b21hdGljYWxseSBjaG9zZW4gYmFzZWQgb24gdGhlIG51bWJlciBvZiBpbnN0YW50aWF0aW9ucy5cbiAgICAgKiBXaGVuIHlvdSBmaXJzdCBjcmVhdGUgYW4gaW5zdGFuY2UsIHRoZSBiZWhhdmlvciBpcyB0aGUgc2FtZSBhcyBTSU5HTEVfSU5TVEFOQ0UuIE1VTFRJX0lOU1RBTkNFIHdpbGwgYmUgYXV0b21hdGljYWxseSB1c2VkIGFmdGVyIG11bHRpcGxlIGNyZWF0aW9uLlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBBVVRPXG4gICAgICovXG4gICAgQVVUTzogMCxcbiAgICAvKipcbiAgICAgKiAhI3poXG4gICAgICog5LyY5YyW5Y2V5qyh5Yib5bu65oCn6IO944CCPGJyPlxuICAgICAqIOivpemAiemhueS8mui3s+i/h+mSiOWvuei/meS4qiBwcmVmYWIg55qE5Luj56CB55Sf5oiQ5LyY5YyW5pON5L2c44CC5b2T6K+lIHByZWZhYiDliqDovb3lkI7vvIzkuIDoiKzlj6rkvJrliJvlu7rkuIDkuKrlrp7kvovml7bvvIzor7fpgInmi6nmraTpobnjgIJcbiAgICAgKiAhI2VuXG4gICAgICogT3B0aW1pemUgZm9yIHNpbmdsZSBpbnN0YW5jZSBjcmVhdGlvbi48YnI+XG4gICAgICogVGhpcyBvcHRpb24gc2tpcHMgY29kZSBnZW5lcmF0aW9uIGZvciB0aGlzIHByZWZhYi5cbiAgICAgKiBXaGVuIHRoaXMgcHJlZmFiIHdpbGwgdXN1YWxseSBjcmVhdGUgb25seSBvbmUgaW5zdGFuY2VzLCBwbGVhc2Ugc2VsZWN0IHRoaXMgb3B0aW9uLlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBTSU5HTEVfSU5TVEFOQ0VcbiAgICAgKi9cbiAgICBTSU5HTEVfSU5TVEFOQ0U6IDEsXG4gICAgLyoqXG4gICAgICogISN6aFxuICAgICAqIOS8mOWMluWkmuasoeWIm+W7uuaAp+iDveOAgjxicj5cbiAgICAgKiDor6XpgInpobnkvJrlkK/nlKjpkojlr7nov5nkuKogcHJlZmFiIOeahOS7o+eggeeUn+aIkOS8mOWMluaTjeS9nOOAguW9k+ivpSBwcmVmYWIg5Yqg6L295ZCO77yM5LiA6Iis5Lya5Yib5bu65aSa5Liq5a6e5L6L5pe277yM6K+36YCJ5oup5q2k6aG544CC5aaC5p6c6K+lIHByZWZhYiDlnKjlnLrmma/kuK3nmoToioLngrnlkK/nlKjkuoboh6rliqjlhbPogZTvvIzlubbkuJTlnKjlnLrmma/kuK3mnInlpJrku73lrp7kvovvvIzkuZ/lu7rorq7pgInmi6nmraTpobnjgIJcbiAgICAgKiAhI2VuXG4gICAgICogT3B0aW1pemUgZm9yIGNyZWF0aW5nIGluc3RhbmNlcyBtdWx0aXBsZSB0aW1lcy48YnI+XG4gICAgICogVGhpcyBvcHRpb24gZW5hYmxlcyBjb2RlIGdlbmVyYXRpb24gZm9yIHRoaXMgcHJlZmFiLlxuICAgICAqIFdoZW4gdGhpcyBwcmVmYWIgd2lsbCB1c3VhbGx5IGNyZWF0ZSBtdWx0aXBsZSBpbnN0YW5jZXMsIHBsZWFzZSBzZWxlY3QgdGhpcyBvcHRpb24uXG4gICAgICogSXQgaXMgYWxzbyByZWNvbW1lbmRlZCB0byBzZWxlY3QgdGhpcyBvcHRpb24gaWYgdGhlIHByZWZhYiBpbnN0YW5jZSBpbiB0aGUgc2NlbmUgaGFzIEF1dG8gU3luYyBlbmFibGVkIGFuZCB0aGVyZSBhcmUgbXVsdGlwbGUgaW5zdGFuY2VzIGluIHRoZSBzY2VuZS5cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gTVVMVElfSU5TVEFOQ0VcbiAgICAgKi9cbiAgICBNVUxUSV9JTlNUQU5DRTogMixcbn0pO1xuXG4vKipcbiAqICEjZW4gQ2xhc3MgZm9yIHByZWZhYiBoYW5kbGluZy5cbiAqICEjemgg6aKE5Yi26LWE5rqQ57G744CCXG4gKiBAY2xhc3MgUHJlZmFiXG4gKiBAZXh0ZW5kcyBBc3NldFxuICovXG52YXIgUHJlZmFiID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5QcmVmYWInLFxuICAgIGV4dGVuZHM6IGNjLkFzc2V0LFxuICAgIGN0b3IgKCkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQ2FjaGUgZnVuY3Rpb24gdG8gb3B0aW1pemUgaW5zdGFuY2UgY3JlYXRvbi5cbiAgICAgICAgICogQHByb3BlcnR5IHtGdW5jdGlvbn0gX2NyZWF0ZUZ1bmN0aW9uXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9jcmVhdGVGdW5jdGlvbiA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5faW5zdGFudGlhdGVkVGltZXMgPSAwO1xuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcHJvcGVydHkge05vZGV9IGRhdGEgLSB0aGUgbWFpbiBjYy5Ob2RlIGluIHRoZSBwcmVmYWJcbiAgICAgICAgICovXG4gICAgICAgIGRhdGE6IG51bGwsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog6K6+572u5a6e5L6L5YyW6L+Z5LiqIHByZWZhYiDml7bmiYDnlKjnmoTkvJjljJbnrZbnlaXjgILmoLnmja7kvb/nlKjmg4XlhrXorr7nva7kuLrlkIjpgILnmoTlgLzvvIzog73kvJjljJbor6UgcHJlZmFiIOWunuS+i+WMluaJgOeUqOeahOaXtumXtOOAglxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIEluZGljYXRlcyB0aGUgb3B0aW1pemF0aW9uIHBvbGljeSBmb3IgaW5zdGFudGlhdGluZyB0aGlzIHByZWZhYi5cbiAgICAgICAgICogU2V0IHRvIGEgc3VpdGFibGUgdmFsdWUgYmFzZWQgb24gdXNhZ2UsIGNhbiBvcHRpbWl6ZSB0aGUgdGltZSBpdCB0YWtlcyB0byBpbnN0YW50aWF0ZSB0aGlzIHByZWZhYi5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3BlcnR5IHtQcmVmYWIuT3B0aW1pemF0aW9uUG9saWN5fSBvcHRpbWl6YXRpb25Qb2xpY3lcbiAgICAgICAgICogQGRlZmF1bHQgUHJlZmFiLk9wdGltaXphdGlvblBvbGljeS5BVVRPXG4gICAgICAgICAqIEBzaW5jZSAxLjEwLjBcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogcHJlZmFiLm9wdGltaXphdGlvblBvbGljeSA9IGNjLlByZWZhYi5PcHRpbWl6YXRpb25Qb2xpY3kuTVVMVElfSU5TVEFOQ0U7XG4gICAgICAgICAqL1xuICAgICAgICBvcHRpbWl6YXRpb25Qb2xpY3k6IE9wdGltaXphdGlvblBvbGljeS5BVVRPLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIEluZGljYXRlcyB0aGUgcmF3IGFzc2V0cyBvZiB0aGlzIHByZWZhYiBjYW4gYmUgbG9hZCBhZnRlciBwcmVmYWIgbG9hZGVkLlxuICAgICAgICAgKiAhI3poIOaMh+ekuuivpSBQcmVmYWIg5L6d6LWW55qE6LWE5rqQ5Y+v5ZCm5ZyoIFByZWZhYiDliqDovb3lkI7lho3lu7bov5/liqDovb3jgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBhc3luY0xvYWRBc3NldHNcbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICovXG4gICAgICAgIGFzeW5jTG9hZEFzc2V0czogZmFsc2UsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gcmVhZG9ubHlcbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICovXG4gICAgICAgIHJlYWRvbmx5OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgIGVkaXRvck9ubHk6IHRydWVcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIE9wdGltaXphdGlvblBvbGljeSxcbiAgICAgICAgT3B0aW1pemF0aW9uUG9saWN5VGhyZXNob2xkOiAzLFxuICAgIH0sXG5cbiAgICBjcmVhdGVOb2RlOiBDQ19FRElUT1IgJiYgZnVuY3Rpb24gKGNiKSB7XG4gICAgICAgIHZhciBub2RlID0gY2MuaW5zdGFudGlhdGUodGhpcyk7XG4gICAgICAgIG5vZGUubmFtZSA9IHRoaXMubmFtZTtcbiAgICAgICAgY2IobnVsbCwgbm9kZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIER5bmFtaWNhbGx5IHRyYW5zbGF0aW9uIHByZWZhYiBkYXRhIGludG8gbWluaW1pemVkIGNvZGUuPGJyLz5cbiAgICAgKiBUaGlzIG1ldGhvZCB3aWxsIGJlIGNhbGxlZCBhdXRvbWF0aWNhbGx5IGJlZm9yZSB0aGUgZmlyc3QgdGltZSB0aGUgcHJlZmFiIGJlaW5nIGluc3RhbnRpYXRlZCxcbiAgICAgKiBidXQgeW91IGNhbiByZS1jYWxsIHRvIHJlZnJlc2ggdGhlIGNyZWF0ZSBmdW5jdGlvbiBvbmNlIHlvdSBtb2RpZmllZCB0aGUgb3JpZ2luYWwgcHJlZmFiIGRhdGEgaW4gc2NyaXB0LlxuICAgICAqIEBtZXRob2QgY29tcGlsZUNyZWF0ZUZ1bmN0aW9uXG4gICAgICovXG4gICAgY29tcGlsZUNyZWF0ZUZ1bmN0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBqaXQgPSByZXF1aXJlKCcuLi9wbGF0Zm9ybS9pbnN0YW50aWF0ZS1qaXQnKTtcbiAgICAgICAgdGhpcy5fY3JlYXRlRnVuY3Rpb24gPSBqaXQuY29tcGlsZSh0aGlzLmRhdGEpO1xuICAgIH0sXG5cbiAgICAvLyBqdXN0IGluc3RhbnRpYXRlLCB3aWxsIG5vdCBpbml0aWFsaXplIHRoZSBOb2RlLCB0aGlzIHdpbGwgYmUgY2FsbGVkIGR1cmluZyBOb2RlJ3MgaW5pdGlhbGl6YXRpb24uXG4gICAgLy8gQHBhcmFtIHtOb2RlfSBbcm9vdFRvUmVkaXJlY3RdIC0gc3BlY2lmeSBhbiBpbnN0YW50aWF0ZWQgcHJlZmFiUm9vdCB0aGF0IGFsbCByZWZlcmVuY2VzIHRvIHByZWZhYlJvb3QgaW4gcHJlZmFiXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lsbCByZWRpcmVjdCB0b1xuICAgIF9kb0luc3RhbnRpYXRlOiBmdW5jdGlvbiAocm9vdFRvUmVkaXJlY3QpIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5fcHJlZmFiKSB7XG4gICAgICAgICAgICAvLyBwcmVmYWIgYXNzZXQgaXMgYWx3YXlzIHN5bmNlZFxuICAgICAgICAgICAgdGhpcy5kYXRhLl9wcmVmYWIuX3N5bmNlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyB0ZW1wIGd1YXJkIGNvZGVcbiAgICAgICAgICAgIGNjLndhcm5JRCgzNzAwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX2NyZWF0ZUZ1bmN0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXBpbGVDcmVhdGVGdW5jdGlvbigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9jcmVhdGVGdW5jdGlvbihyb290VG9SZWRpcmVjdCk7ICAvLyB0aGlzLmRhdGEuX2luc3RhbnRpYXRlKCk7XG4gICAgfSxcblxuICAgIF9pbnN0YW50aWF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbm9kZSwgdXNlSml0ID0gZmFsc2U7XG4gICAgICAgIGlmIChDQ19TVVBQT1JUX0pJVCkge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW1pemF0aW9uUG9saWN5ID09PSBPcHRpbWl6YXRpb25Qb2xpY3kuU0lOR0xFX0lOU1RBTkNFKSB7XG4gICAgICAgICAgICAgICAgdXNlSml0ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLm9wdGltaXphdGlvblBvbGljeSA9PT0gT3B0aW1pemF0aW9uUG9saWN5Lk1VTFRJX0lOU1RBTkNFKSB7XG4gICAgICAgICAgICAgICAgdXNlSml0ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGF1dG9cbiAgICAgICAgICAgICAgICB1c2VKaXQgPSAodGhpcy5faW5zdGFudGlhdGVkVGltZXMgKyAxKSA+PSBQcmVmYWIuT3B0aW1pemF0aW9uUG9saWN5VGhyZXNob2xkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh1c2VKaXQpIHtcbiAgICAgICAgICAgIC8vIGluc3RhbnRpYXRlIG5vZGVcbiAgICAgICAgICAgIG5vZGUgPSB0aGlzLl9kb0luc3RhbnRpYXRlKCk7XG4gICAgICAgICAgICAvLyBpbml0aWFsaXplIG5vZGVcbiAgICAgICAgICAgIHRoaXMuZGF0YS5faW5zdGFudGlhdGUobm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBwcmVmYWIgYXNzZXQgaXMgYWx3YXlzIHN5bmNlZFxuICAgICAgICAgICAgdGhpcy5kYXRhLl9wcmVmYWIuX3N5bmNlZCA9IHRydWU7XG4gICAgICAgICAgICAvLyBpbnN0YW50aWF0ZSBub2RlXG4gICAgICAgICAgICBub2RlID0gdGhpcy5kYXRhLl9pbnN0YW50aWF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgICsrdGhpcy5faW5zdGFudGlhdGVkVGltZXM7XG5cbiAgICAgICAgLy8gbGluayBwcmVmYWIgaW4gZWRpdG9yXG4gICAgICAgIGlmIChDQ19FRElUT1IgfHwgQ0NfVEVTVCkge1xuICAgICAgICAgICAgdmFyIFByZWZhYlV0aWxzID0gRWRpdG9yLnJlcXVpcmUoJ3NjZW5lOi8vdXRpbHMvcHJlZmFiJyk7XG4gICAgICAgICAgICAvLyBUaGlzIG9wZXJhdGlvbiBpcyBub3QgbmVjZXNzYXJ5LCBidXQgc29tZSBvbGQgcHJlZmFiIGFzc2V0IG1heSBub3QgY29udGFpbiBjb21wbGV0ZSBkYXRhLlxuICAgICAgICAgICAgUHJlZmFiVXRpbHMubGlua1ByZWZhYih0aGlzLCBub2RlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9LFxuXG4gICAgZGVzdHJveSAoKSB7XG4gICAgICAgIHRoaXMuZGF0YSAmJiB0aGlzLmRhdGEuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgIH0sXG59KTtcblxuY2MuUHJlZmFiID0gbW9kdWxlLmV4cG9ydHMgPSBQcmVmYWI7XG5jYy5qcy5vYnNvbGV0ZShjYywgJ2NjLl9QcmVmYWInLCAnUHJlZmFiJyk7XG4iXX0=