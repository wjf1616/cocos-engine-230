
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/material/CCMaterial.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
var Asset = require('../CCAsset');

var Texture = require('../CCTexture2D');

var PixelFormat = Texture.PixelFormat;

var EffectAsset = require('./CCEffectAsset');

var textureUtil = require('../../utils/texture-util');

var gfx = cc.gfx;
/**
 * !#en Material builtin name
 * !#zh 内置材质名字
 * @enum Material.BUILTIN_NAME
 */

var BUILTIN_NAME = cc.Enum({
  /**
   * @property SPRITE
   * @readonly
   * @type {String}
   */
  SPRITE: '2d-sprite',

  /**
   * @property GRAY_SPRITE
   * @readonly
   * @type {String}
   */
  GRAY_SPRITE: '2d-gray-sprite',

  /**
   * @property UNLIT
   * @readonly
   * @type {String}
   */
  UNLIT: 'unlit'
});
/**
 * !#en Material Asset.
 * !#zh 材质资源类。
 * @class Material
 * @extends Asset
 */

var Material = cc.Class({
  name: 'cc.Material',
  "extends": Asset,
  ctor: function ctor() {
    this._manualHash = false;
    this._dirty = true;
    this._effect = null;
  },
  properties: {
    // deprecated
    _defines: {
      "default": undefined,
      type: Object
    },
    // deprecated
    _props: {
      "default": undefined,
      type: Object
    },
    _effectAsset: {
      type: EffectAsset,
      "default": null
    },
    _techniqueIndex: 0,
    _techniqueData: Object,
    effectName: CC_EDITOR ? {
      get: function get() {
        return this._effectAsset && this._effectAsset.name;
      },
      set: function set(val) {
        var effectAsset = cc.AssetLibrary.getBuiltin('effect', val);

        if (!effectAsset) {
          Editor.warn("no effect named '" + val + "' found");
          return;
        }

        this.effectAsset = effectAsset;
      }
    } : undefined,
    effectAsset: {
      get: function get() {
        return this._effectAsset;
      },
      set: function set(asset) {
        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
          return;
        }

        this._effectAsset = asset;

        if (!asset) {
          cc.error('Can not set an empty effect asset.');
          return;
        }

        this._effect = this._effectAsset.getInstantiatedEffect();
      }
    },
    effect: {
      get: function get() {
        return this._effect;
      }
    },
    techniqueIndex: {
      get: function get() {
        return this._techniqueIndex;
      },
      set: function set(v) {
        this._techniqueIndex = v;

        this._effect.switchTechnique(v);
      }
    }
  },
  statics: {
    getBuiltinMaterial: function getBuiltinMaterial(name) {
      if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
        return new cc.Material();
      }

      return cc.AssetLibrary.getBuiltin('material', 'builtin-' + name);
    },
    BUILTIN_NAME: BUILTIN_NAME,

    /**
     * !#en Creates a Material with builtin Effect.
     * !#zh 使用内建 Effect 创建一个材质。
     * @static
     * @method createWithBuiltin
     * @param {string} effectName 
     * @param {number} techniqueIndex 
     * @return {Material}
     */
    createWithBuiltin: function createWithBuiltin(effectName, techniqueIndex) {
      if (techniqueIndex === void 0) {
        techniqueIndex = 0;
      }

      var effectAsset = cc.AssetLibrary.getBuiltin('effect', 'builtin-' + effectName);
      return Material.create(effectAsset, techniqueIndex);
    },

    /**
     * !#en Creates a Material.
     * !#zh 创建一个材质。
     * @static
     * @method create
     * @param {EffectAsset} effectAsset 
     * @param {number} [techniqueIndex] 
     * @return {Material}
     */
    create: function create(effectAsset, techniqueIndex) {
      if (techniqueIndex === void 0) {
        techniqueIndex = 0;
      }

      if (!effectAsset) return null;
      var material = new Material();
      material.effectAsset = effectAsset;
      material.techniqueIndex = techniqueIndex;
      return material;
    }
  },

  /**
   * !#en Sets the Material property
   * !#zh 是指材质的属性
   * @method setProperty
   * @param {string} name
   * @param {Object} val
   * @param {number} [passIdx]
   * @param {boolean} [directly]
   */
  setProperty: function setProperty(name, val, passIdx, directly) {
    if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) return;

    if (typeof passIdx === 'string') {
      passIdx = parseInt(passIdx);
    }

    if (val instanceof Texture) {
      var loaded = function loaded() {
        this._effect.setProperty(name, val, passIdx);
      };

      var format = val.getPixelFormat();
      var value = format === PixelFormat.RGBA_ETC1 || format === PixelFormat.RGB_A_PVRTC_4BPPV1 || format === PixelFormat.RGB_A_PVRTC_2BPPV1;
      var key = 'CC_USE_ALPHA_ATLAS_' + name.toUpperCase();
      var def = this.getDefine(key, passIdx);

      if (value || def) {
        this.define(key, value);
      }

      if (!val.loaded) {
        val.once('load', loaded, this);
        textureUtil.postLoadTexture(val);
        return;
      }
    }

    this._effect.setProperty(name, val, passIdx, directly);
  },

  /**
   * !#en Gets the Material property.
   * !#zh 获取材质的属性。
   * @method getProperty
   * @param {string} name 
   * @param {number} passIdx 
   */
  getProperty: function getProperty(name, passIdx) {
    if (typeof passIdx === 'string') {
      passIdx = parseInt(passIdx);
    }

    return this._effect.getProperty(name, passIdx);
  },

  /**
   * !#en Sets the Material define.
   * !#zh 设置材质的宏定义。
   * @method define
   * @param {string} name
   * @param {boolean|number} val
   * @param {number} passIdx
   * @param {boolean} force
   */
  define: function define(name, val, passIdx, force) {
    if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) return;

    if (typeof passIdx === 'string') {
      passIdx = parseInt(passIdx);
    }

    this._effect.define(name, val, passIdx, force);
  },

  /**
   * !#en Gets the Material define.
   * !#zh 获取材质的宏定义。
   * @method getDefine
   * @param {string} name 
   * @param {number} passIdx 
   */
  getDefine: function getDefine(name, passIdx) {
    if (typeof passIdx === 'string') {
      passIdx = parseInt(passIdx);
    }

    return this._effect.getDefine(name, passIdx);
  },

  /**
   * !#en Sets the Material cull mode.
   * !#zh 设置材质的裁减模式。
   * @method setCullMode
   * @param {number} cullMode 
   * @param {number} passIdx 
   */
  setCullMode: function setCullMode(cullMode, passIdx) {
    if (cullMode === void 0) {
      cullMode = gfx.CULL_BACK;
    }

    this._effect.setCullMode(cullMode, passIdx);
  },

  /**
   * !#en Sets the Material depth states.
   * !#zh 设置材质的深度渲染状态。
   * @method setDepth
   * @param {boolean} depthTest 
   * @param {boolean} depthWrite 
   * @param {number} depthFunc 
   * @param {number} passIdx 
   */
  setDepth: function setDepth(depthTest, depthWrite, depthFunc, passIdx) {
    if (depthTest === void 0) {
      depthTest = false;
    }

    if (depthWrite === void 0) {
      depthWrite = false;
    }

    if (depthFunc === void 0) {
      depthFunc = gfx.DS_FUNC_LESS;
    }

    this._effect.setDepth(depthTest, depthWrite, depthFunc, passIdx);
  },

  /**
   * !#en Sets the Material blend states.
   * !#zh 设置材质的混合渲染状态。
   * @method setBlend
   * @param {number} enabled 
   * @param {number} blendEq 
   * @param {number} blendSrc 
   * @param {number} blendDst 
   * @param {number} blendAlphaEq 
   * @param {number} blendSrcAlpha 
   * @param {number} blendDstAlpha 
   * @param {number} blendColor 
   * @param {number} passIdx 
   */
  setBlend: function setBlend(enabled, blendEq, blendSrc, blendDst, blendAlphaEq, blendSrcAlpha, blendDstAlpha, blendColor, passIdx) {
    if (enabled === void 0) {
      enabled = false;
    }

    if (blendEq === void 0) {
      blendEq = gfx.BLEND_FUNC_ADD;
    }

    if (blendSrc === void 0) {
      blendSrc = gfx.BLEND_SRC_ALPHA;
    }

    if (blendDst === void 0) {
      blendDst = gfx.BLEND_ONE_MINUS_SRC_ALPHA;
    }

    if (blendAlphaEq === void 0) {
      blendAlphaEq = gfx.BLEND_FUNC_ADD;
    }

    if (blendSrcAlpha === void 0) {
      blendSrcAlpha = gfx.BLEND_SRC_ALPHA;
    }

    if (blendDstAlpha === void 0) {
      blendDstAlpha = gfx.BLEND_ONE_MINUS_SRC_ALPHA;
    }

    if (blendColor === void 0) {
      blendColor = 0xffffffff;
    }

    this._effect.setBlend(enabled, blendEq, blendSrc, blendDst, blendAlphaEq, blendSrcAlpha, blendDstAlpha, blendColor, passIdx);
  },

  /**
   * !#en Sets whether enable the stencil test.
   * !#zh 设置是否开启模板测试。
   * @method setStencilEnabled
   * @param {number} stencilTest 
   * @param {number} passIdx 
   */
  setStencilEnabled: function setStencilEnabled(stencilTest, passIdx) {
    if (stencilTest === void 0) {
      stencilTest = gfx.STENCIL_INHERIT;
    }

    this._effect.setStencilEnabled(stencilTest, passIdx);
  },

  /**
   * !#en Sets the Material stencil render states.
   * !#zh 设置材质的模板测试渲染参数。
   * @method setStencil
   * @param {number} stencilTest 
   * @param {number} stencilFunc 
   * @param {number} stencilRef 
   * @param {number} stencilMask 
   * @param {number} stencilFailOp 
   * @param {number} stencilZFailOp 
   * @param {number} stencilZPassOp 
   * @param {number} stencilWriteMask 
   * @param {number} passIdx 
   */
  setStencil: function setStencil(stencilTest, stencilFunc, stencilRef, stencilMask, stencilFailOp, stencilZFailOp, stencilZPassOp, stencilWriteMask, passIdx) {
    if (stencilTest === void 0) {
      stencilTest = gfx.STENCIL_INHERIT;
    }

    if (stencilFunc === void 0) {
      stencilFunc = gfx.DS_FUNC_ALWAYS;
    }

    if (stencilRef === void 0) {
      stencilRef = 0;
    }

    if (stencilMask === void 0) {
      stencilMask = 0xff;
    }

    if (stencilFailOp === void 0) {
      stencilFailOp = gfx.STENCIL_OP_KEEP;
    }

    if (stencilZFailOp === void 0) {
      stencilZFailOp = gfx.STENCIL_OP_KEEP;
    }

    if (stencilZPassOp === void 0) {
      stencilZPassOp = gfx.STENCIL_OP_KEEP;
    }

    if (stencilWriteMask === void 0) {
      stencilWriteMask = 0xff;
    }

    this._effect.setStencil(stencilTest, stencilFunc, stencilRef, stencilMask, stencilFailOp, stencilZFailOp, stencilZPassOp, stencilWriteMask, passIdx);
  },
  updateHash: function updateHash(hash) {
    this._manualHash = hash;
    this._effect && this._effect.updateHash(hash);
  },
  getHash: function getHash() {
    return this._manualHash || this._effect && this._effect.getHash();
  },
  onLoad: function onLoad() {
    this.effectAsset = this._effectAsset;
    if (!this._effect) return;

    if (this._techniqueIndex) {
      this._effect.switchTechnique(this._techniqueIndex);
    }

    this._techniqueData = this._techniqueData || {};
    var passDatas = this._techniqueData;

    for (var index in passDatas) {
      index = parseInt(index);
      var passData = passDatas[index];
      if (!passData) continue;

      for (var def in passData.defines) {
        this.define(def, passData.defines[def], index);
      }

      for (var prop in passData.props) {
        this.setProperty(prop, passData.props[prop], index);
      }
    }
  }
});
var _default = Material;
exports["default"] = _default;
cc.Material = Material;
module.exports = exports["default"];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDTWF0ZXJpYWwuanMiXSwibmFtZXMiOlsiQXNzZXQiLCJyZXF1aXJlIiwiVGV4dHVyZSIsIlBpeGVsRm9ybWF0IiwiRWZmZWN0QXNzZXQiLCJ0ZXh0dXJlVXRpbCIsImdmeCIsImNjIiwiQlVJTFRJTl9OQU1FIiwiRW51bSIsIlNQUklURSIsIkdSQVlfU1BSSVRFIiwiVU5MSVQiLCJNYXRlcmlhbCIsIkNsYXNzIiwibmFtZSIsImN0b3IiLCJfbWFudWFsSGFzaCIsIl9kaXJ0eSIsIl9lZmZlY3QiLCJwcm9wZXJ0aWVzIiwiX2RlZmluZXMiLCJ1bmRlZmluZWQiLCJ0eXBlIiwiT2JqZWN0IiwiX3Byb3BzIiwiX2VmZmVjdEFzc2V0IiwiX3RlY2huaXF1ZUluZGV4IiwiX3RlY2huaXF1ZURhdGEiLCJlZmZlY3ROYW1lIiwiQ0NfRURJVE9SIiwiZ2V0Iiwic2V0IiwidmFsIiwiZWZmZWN0QXNzZXQiLCJBc3NldExpYnJhcnkiLCJnZXRCdWlsdGluIiwiRWRpdG9yIiwid2FybiIsImFzc2V0IiwiZ2FtZSIsInJlbmRlclR5cGUiLCJSRU5ERVJfVFlQRV9DQU5WQVMiLCJlcnJvciIsImdldEluc3RhbnRpYXRlZEVmZmVjdCIsImVmZmVjdCIsInRlY2huaXF1ZUluZGV4IiwidiIsInN3aXRjaFRlY2huaXF1ZSIsInN0YXRpY3MiLCJnZXRCdWlsdGluTWF0ZXJpYWwiLCJjcmVhdGVXaXRoQnVpbHRpbiIsImNyZWF0ZSIsIm1hdGVyaWFsIiwic2V0UHJvcGVydHkiLCJwYXNzSWR4IiwiZGlyZWN0bHkiLCJwYXJzZUludCIsImxvYWRlZCIsImZvcm1hdCIsImdldFBpeGVsRm9ybWF0IiwidmFsdWUiLCJSR0JBX0VUQzEiLCJSR0JfQV9QVlJUQ180QlBQVjEiLCJSR0JfQV9QVlJUQ18yQlBQVjEiLCJrZXkiLCJ0b1VwcGVyQ2FzZSIsImRlZiIsImdldERlZmluZSIsImRlZmluZSIsIm9uY2UiLCJwb3N0TG9hZFRleHR1cmUiLCJnZXRQcm9wZXJ0eSIsImZvcmNlIiwic2V0Q3VsbE1vZGUiLCJjdWxsTW9kZSIsIkNVTExfQkFDSyIsInNldERlcHRoIiwiZGVwdGhUZXN0IiwiZGVwdGhXcml0ZSIsImRlcHRoRnVuYyIsIkRTX0ZVTkNfTEVTUyIsInNldEJsZW5kIiwiZW5hYmxlZCIsImJsZW5kRXEiLCJibGVuZFNyYyIsImJsZW5kRHN0IiwiYmxlbmRBbHBoYUVxIiwiYmxlbmRTcmNBbHBoYSIsImJsZW5kRHN0QWxwaGEiLCJibGVuZENvbG9yIiwiQkxFTkRfRlVOQ19BREQiLCJCTEVORF9TUkNfQUxQSEEiLCJCTEVORF9PTkVfTUlOVVNfU1JDX0FMUEhBIiwic2V0U3RlbmNpbEVuYWJsZWQiLCJzdGVuY2lsVGVzdCIsIlNURU5DSUxfSU5IRVJJVCIsInNldFN0ZW5jaWwiLCJzdGVuY2lsRnVuYyIsInN0ZW5jaWxSZWYiLCJzdGVuY2lsTWFzayIsInN0ZW5jaWxGYWlsT3AiLCJzdGVuY2lsWkZhaWxPcCIsInN0ZW5jaWxaUGFzc09wIiwic3RlbmNpbFdyaXRlTWFzayIsIkRTX0ZVTkNfQUxXQVlTIiwiU1RFTkNJTF9PUF9LRUVQIiwidXBkYXRlSGFzaCIsImhhc2giLCJnZXRIYXNoIiwib25Mb2FkIiwicGFzc0RhdGFzIiwiaW5kZXgiLCJwYXNzRGF0YSIsImRlZmluZXMiLCJwcm9wIiwicHJvcHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBLElBQU1BLEtBQUssR0FBR0MsT0FBTyxDQUFDLFlBQUQsQ0FBckI7O0FBQ0EsSUFBTUMsT0FBTyxHQUFHRCxPQUFPLENBQUMsZ0JBQUQsQ0FBdkI7O0FBQ0EsSUFBTUUsV0FBVyxHQUFHRCxPQUFPLENBQUNDLFdBQTVCOztBQUNBLElBQU1DLFdBQVcsR0FBR0gsT0FBTyxDQUFDLGlCQUFELENBQTNCOztBQUNBLElBQU1JLFdBQVcsR0FBR0osT0FBTyxDQUFDLDBCQUFELENBQTNCOztBQUNBLElBQU1LLEdBQUcsR0FBR0MsRUFBRSxDQUFDRCxHQUFmO0FBRUE7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KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHA6Ly93d3cuY29jb3MuY29tXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBBc3NldCA9IHJlcXVpcmUoJy4uL0NDQXNzZXQnKTtcbmNvbnN0IFRleHR1cmUgPSByZXF1aXJlKCcuLi9DQ1RleHR1cmUyRCcpO1xuY29uc3QgUGl4ZWxGb3JtYXQgPSBUZXh0dXJlLlBpeGVsRm9ybWF0O1xuY29uc3QgRWZmZWN0QXNzZXQgPSByZXF1aXJlKCcuL0NDRWZmZWN0QXNzZXQnKTtcbmNvbnN0IHRleHR1cmVVdGlsID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvdGV4dHVyZS11dGlsJyk7XG5jb25zdCBnZnggPSBjYy5nZng7XG5cbi8qKlxuICogISNlbiBNYXRlcmlhbCBidWlsdGluIG5hbWVcbiAqICEjemgg5YaF572u5p2Q6LSo5ZCN5a2XXG4gKiBAZW51bSBNYXRlcmlhbC5CVUlMVElOX05BTUVcbiAqL1xuY29uc3QgQlVJTFRJTl9OQU1FID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IFNQUklURVxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgU1BSSVRFOiAnMmQtc3ByaXRlJyxcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgR1JBWV9TUFJJVEVcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIEdSQVlfU1BSSVRFOiAnMmQtZ3JheS1zcHJpdGUnLFxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBVTkxJVFxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgVU5MSVQ6ICd1bmxpdCcsXG59KVxuXG5cbi8qKlxuICogISNlbiBNYXRlcmlhbCBBc3NldC5cbiAqICEjemgg5p2Q6LSo6LWE5rqQ57G744CCXG4gKiBAY2xhc3MgTWF0ZXJpYWxcbiAqIEBleHRlbmRzIEFzc2V0XG4gKi9cbmxldCBNYXRlcmlhbCA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuTWF0ZXJpYWwnLFxuICAgIGV4dGVuZHM6IEFzc2V0LFxuXG4gICAgY3RvciAoKSB7XG4gICAgICAgIHRoaXMuX21hbnVhbEhhc2ggPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fZGlydHkgPSB0cnVlO1xuICAgICAgICB0aGlzLl9lZmZlY3QgPSBudWxsO1xuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGRlcHJlY2F0ZWRcbiAgICAgICAgX2RlZmluZXM6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHR5cGU6IE9iamVjdFxuICAgICAgICB9LFxuICAgICAgICAvLyBkZXByZWNhdGVkXG4gICAgICAgIF9wcm9wczoge1xuICAgICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdHlwZTogT2JqZWN0XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2VmZmVjdEFzc2V0OiB7XG4gICAgICAgICAgICB0eXBlOiBFZmZlY3RBc3NldCxcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIH0sXG5cbiAgICAgICAgX3RlY2huaXF1ZUluZGV4OiAwLFxuICAgICAgICBfdGVjaG5pcXVlRGF0YTogT2JqZWN0LFxuXG4gICAgICAgIGVmZmVjdE5hbWU6IENDX0VESVRPUiA/IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2VmZmVjdEFzc2V0ICYmIHRoaXMuX2VmZmVjdEFzc2V0Lm5hbWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWwpIHtcbiAgICAgICAgICAgICAgICBsZXQgZWZmZWN0QXNzZXQgPSBjYy5Bc3NldExpYnJhcnkuZ2V0QnVpbHRpbignZWZmZWN0JywgdmFsKTtcbiAgICAgICAgICAgICAgICBpZiAoIWVmZmVjdEFzc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIEVkaXRvci53YXJuKGBubyBlZmZlY3QgbmFtZWQgJyR7dmFsfScgZm91bmRgKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmVmZmVjdEFzc2V0ID0gZWZmZWN0QXNzZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gOiB1bmRlZmluZWQsXG5cbiAgICAgICAgZWZmZWN0QXNzZXQ6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2VmZmVjdEFzc2V0O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAoYXNzZXQpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2MuZ2FtZS5yZW5kZXJUeXBlID09PSBjYy5nYW1lLlJFTkRFUl9UWVBFX0NBTlZBUykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5fZWZmZWN0QXNzZXQgPSBhc3NldDtcbiAgICAgICAgICAgICAgICBpZiAoIWFzc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLmVycm9yKCdDYW4gbm90IHNldCBhbiBlbXB0eSBlZmZlY3QgYXNzZXQuJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9lZmZlY3QgPSB0aGlzLl9lZmZlY3RBc3NldC5nZXRJbnN0YW50aWF0ZWRFZmZlY3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBlZmZlY3Q6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2VmZmVjdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICB0ZWNobmlxdWVJbmRleDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdGVjaG5pcXVlSW5kZXg7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdGVjaG5pcXVlSW5kZXggPSB2O1xuICAgICAgICAgICAgICAgIHRoaXMuX2VmZmVjdC5zd2l0Y2hUZWNobmlxdWUodik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RhdGljczoge1xuICAgICAgICBnZXRCdWlsdGluTWF0ZXJpYWwgKG5hbWUpIHtcbiAgICAgICAgICAgIGlmIChjYy5nYW1lLnJlbmRlclR5cGUgPT09IGNjLmdhbWUuUkVOREVSX1RZUEVfQ0FOVkFTKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBjYy5NYXRlcmlhbCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNjLkFzc2V0TGlicmFyeS5nZXRCdWlsdGluKCdtYXRlcmlhbCcsICdidWlsdGluLScgKyBuYW1lKTtcbiAgICAgICAgfSxcblxuICAgICAgICBCVUlMVElOX05BTUUsXG4gICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBDcmVhdGVzIGEgTWF0ZXJpYWwgd2l0aCBidWlsdGluIEVmZmVjdC5cbiAgICAgICAgICogISN6aCDkvb/nlKjlhoXlu7ogRWZmZWN0IOWIm+W7uuS4gOS4quadkOi0qOOAglxuICAgICAgICAgKiBAc3RhdGljXG4gICAgICAgICAqIEBtZXRob2QgY3JlYXRlV2l0aEJ1aWx0aW5cbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGVmZmVjdE5hbWUgXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0ZWNobmlxdWVJbmRleCBcbiAgICAgICAgICogQHJldHVybiB7TWF0ZXJpYWx9XG4gICAgICAgICAqL1xuICAgICAgICBjcmVhdGVXaXRoQnVpbHRpbiAoZWZmZWN0TmFtZSwgdGVjaG5pcXVlSW5kZXggPSAwKSB7XG4gICAgICAgICAgICBsZXQgZWZmZWN0QXNzZXQgPSBjYy5Bc3NldExpYnJhcnkuZ2V0QnVpbHRpbignZWZmZWN0JywgJ2J1aWx0aW4tJyArIGVmZmVjdE5hbWUpO1xuICAgICAgICAgICAgcmV0dXJuIE1hdGVyaWFsLmNyZWF0ZShlZmZlY3RBc3NldCwgdGVjaG5pcXVlSW5kZXgpO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBDcmVhdGVzIGEgTWF0ZXJpYWwuXG4gICAgICAgICAqICEjemgg5Yib5bu65LiA5Liq5p2Q6LSo44CCXG4gICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgICogQG1ldGhvZCBjcmVhdGVcbiAgICAgICAgICogQHBhcmFtIHtFZmZlY3RBc3NldH0gZWZmZWN0QXNzZXQgXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbdGVjaG5pcXVlSW5kZXhdIFxuICAgICAgICAgKiBAcmV0dXJuIHtNYXRlcmlhbH1cbiAgICAgICAgICovXG4gICAgICAgIGNyZWF0ZSAoZWZmZWN0QXNzZXQsIHRlY2huaXF1ZUluZGV4ID0gMCkge1xuICAgICAgICAgICAgaWYgKCFlZmZlY3RBc3NldCkgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBsZXQgbWF0ZXJpYWwgPSBuZXcgTWF0ZXJpYWwoKTtcbiAgICAgICAgICAgIG1hdGVyaWFsLmVmZmVjdEFzc2V0ID0gZWZmZWN0QXNzZXQ7XG4gICAgICAgICAgICBtYXRlcmlhbC50ZWNobmlxdWVJbmRleCA9IHRlY2huaXF1ZUluZGV4O1xuICAgICAgICAgICAgcmV0dXJuIG1hdGVyaWFsO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0cyB0aGUgTWF0ZXJpYWwgcHJvcGVydHlcbiAgICAgKiAhI3poIOaYr+aMh+adkOi0qOeahOWxnuaAp1xuICAgICAqIEBtZXRob2Qgc2V0UHJvcGVydHlcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB2YWxcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3Bhc3NJZHhdXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbZGlyZWN0bHldXG4gICAgICovXG4gICAgc2V0UHJvcGVydHkgKG5hbWUsIHZhbCwgcGFzc0lkeCwgZGlyZWN0bHkpIHtcbiAgICAgICAgaWYgKGNjLmdhbWUucmVuZGVyVHlwZSA9PT0gY2MuZ2FtZS5SRU5ERVJfVFlQRV9DQU5WQVMpIHJldHVybjtcblxuICAgICAgICBpZiAodHlwZW9mIHBhc3NJZHggPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBwYXNzSWR4ID0gcGFyc2VJbnQocGFzc0lkeCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsIGluc3RhbmNlb2YgVGV4dHVyZSkge1xuICAgICAgICAgICAgbGV0IGZvcm1hdCA9IHZhbC5nZXRQaXhlbEZvcm1hdCgpO1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gKGZvcm1hdCA9PT0gUGl4ZWxGb3JtYXQuUkdCQV9FVEMxIHx8IGZvcm1hdCA9PT0gUGl4ZWxGb3JtYXQuUkdCX0FfUFZSVENfNEJQUFYxIHx8IGZvcm1hdCA9PT0gUGl4ZWxGb3JtYXQuUkdCX0FfUFZSVENfMkJQUFYxKTtcbiAgICAgICAgICAgIGxldCBrZXkgPSAnQ0NfVVNFX0FMUEhBX0FUTEFTXycgKyBuYW1lLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICBsZXQgZGVmID0gdGhpcy5nZXREZWZpbmUoa2V5LCBwYXNzSWR4KTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSB8fCBkZWYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmluZShrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxvYWRlZCAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZWZmZWN0LnNldFByb3BlcnR5KG5hbWUsIHZhbCwgcGFzc0lkeCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdmFsLmxvYWRlZCkge1xuICAgICAgICAgICAgICAgIHZhbC5vbmNlKCdsb2FkJywgbG9hZGVkLCB0aGlzKTtcbiAgICAgICAgICAgICAgICB0ZXh0dXJlVXRpbC5wb3N0TG9hZFRleHR1cmUodmFsKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9lZmZlY3Quc2V0UHJvcGVydHkobmFtZSwgdmFsLCBwYXNzSWR4LCBkaXJlY3RseSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0cyB0aGUgTWF0ZXJpYWwgcHJvcGVydHkuXG4gICAgICogISN6aCDojrflj5bmnZDotKjnmoTlsZ7mgKfjgIJcbiAgICAgKiBAbWV0aG9kIGdldFByb3BlcnR5XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBhc3NJZHggXG4gICAgICovXG4gICAgZ2V0UHJvcGVydHkgKG5hbWUsIHBhc3NJZHgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBwYXNzSWR4ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcGFzc0lkeCA9IHBhcnNlSW50KHBhc3NJZHgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9lZmZlY3QuZ2V0UHJvcGVydHkobmFtZSwgcGFzc0lkeCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0cyB0aGUgTWF0ZXJpYWwgZGVmaW5lLlxuICAgICAqICEjemgg6K6+572u5p2Q6LSo55qE5a6P5a6a5LmJ44CCXG4gICAgICogQG1ldGhvZCBkZWZpbmVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbnxudW1iZXJ9IHZhbFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwYXNzSWR4XG4gICAgICogQHBhcmFtIHtib29sZWFufSBmb3JjZVxuICAgICAqL1xuICAgIGRlZmluZSAobmFtZSwgdmFsLCBwYXNzSWR4LCBmb3JjZSkge1xuICAgICAgICBpZiAoY2MuZ2FtZS5yZW5kZXJUeXBlID09PSBjYy5nYW1lLlJFTkRFUl9UWVBFX0NBTlZBUykgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0eXBlb2YgcGFzc0lkeCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHBhc3NJZHggPSBwYXJzZUludChwYXNzSWR4KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9lZmZlY3QuZGVmaW5lKG5hbWUsIHZhbCwgcGFzc0lkeCwgZm9yY2UpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldHMgdGhlIE1hdGVyaWFsIGRlZmluZS5cbiAgICAgKiAhI3poIOiOt+WPluadkOi0qOeahOWuj+WumuS5ieOAglxuICAgICAqIEBtZXRob2QgZ2V0RGVmaW5lXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBhc3NJZHggXG4gICAgICovXG4gICAgZ2V0RGVmaW5lIChuYW1lLCBwYXNzSWR4KSB7XG4gICAgICAgIGlmICh0eXBlb2YgcGFzc0lkeCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHBhc3NJZHggPSBwYXJzZUludChwYXNzSWR4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fZWZmZWN0LmdldERlZmluZShuYW1lLCBwYXNzSWR4KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXRzIHRoZSBNYXRlcmlhbCBjdWxsIG1vZGUuXG4gICAgICogISN6aCDorr7nva7mnZDotKjnmoToo4Hlh4/mqKHlvI/jgIJcbiAgICAgKiBAbWV0aG9kIHNldEN1bGxNb2RlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGN1bGxNb2RlIFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwYXNzSWR4IFxuICAgICAqL1xuICAgIHNldEN1bGxNb2RlIChjdWxsTW9kZSA9IGdmeC5DVUxMX0JBQ0ssIHBhc3NJZHgpIHtcbiAgICAgICAgdGhpcy5fZWZmZWN0LnNldEN1bGxNb2RlKGN1bGxNb2RlLCBwYXNzSWR4KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXRzIHRoZSBNYXRlcmlhbCBkZXB0aCBzdGF0ZXMuXG4gICAgICogISN6aCDorr7nva7mnZDotKjnmoTmt7HluqbmuLLmn5PnirbmgIHjgIJcbiAgICAgKiBAbWV0aG9kIHNldERlcHRoXG4gICAgICogQHBhcmFtIHtib29sZWFufSBkZXB0aFRlc3QgXG4gICAgICogQHBhcmFtIHtib29sZWFufSBkZXB0aFdyaXRlIFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkZXB0aEZ1bmMgXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBhc3NJZHggXG4gICAgICovXG4gICAgc2V0RGVwdGggKFxuICAgICAgICBkZXB0aFRlc3QgPSBmYWxzZSxcbiAgICAgICAgZGVwdGhXcml0ZSA9IGZhbHNlLFxuICAgICAgICBkZXB0aEZ1bmMgPSBnZnguRFNfRlVOQ19MRVNTLFxuICAgICAgICBwYXNzSWR4XG4gICAgKSB7XG4gICAgICAgIHRoaXMuX2VmZmVjdC5zZXREZXB0aChkZXB0aFRlc3QsIGRlcHRoV3JpdGUsIGRlcHRoRnVuYywgcGFzc0lkeCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0cyB0aGUgTWF0ZXJpYWwgYmxlbmQgc3RhdGVzLlxuICAgICAqICEjemgg6K6+572u5p2Q6LSo55qE5re35ZCI5riy5p+T54q25oCB44CCXG4gICAgICogQG1ldGhvZCBzZXRCbGVuZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBlbmFibGVkIFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBibGVuZEVxIFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBibGVuZFNyYyBcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmxlbmREc3QgXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJsZW5kQWxwaGFFcSBcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmxlbmRTcmNBbHBoYSBcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmxlbmREc3RBbHBoYSBcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmxlbmRDb2xvciBcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGFzc0lkeCBcbiAgICAgKi9cbiAgICBzZXRCbGVuZCAoXG4gICAgICAgIGVuYWJsZWQgPSBmYWxzZSxcbiAgICAgICAgYmxlbmRFcSA9IGdmeC5CTEVORF9GVU5DX0FERCxcbiAgICAgICAgYmxlbmRTcmMgPSBnZnguQkxFTkRfU1JDX0FMUEhBLFxuICAgICAgICBibGVuZERzdCA9IGdmeC5CTEVORF9PTkVfTUlOVVNfU1JDX0FMUEhBLFxuICAgICAgICBibGVuZEFscGhhRXEgPSBnZnguQkxFTkRfRlVOQ19BREQsXG4gICAgICAgIGJsZW5kU3JjQWxwaGEgPSBnZnguQkxFTkRfU1JDX0FMUEhBLFxuICAgICAgICBibGVuZERzdEFscGhhID0gZ2Z4LkJMRU5EX09ORV9NSU5VU19TUkNfQUxQSEEsXG4gICAgICAgIGJsZW5kQ29sb3IgPSAweGZmZmZmZmZmLFxuICAgICAgICBwYXNzSWR4XG4gICAgKSB7XG4gICAgICAgIHRoaXMuX2VmZmVjdC5zZXRCbGVuZChlbmFibGVkLCBibGVuZEVxLCBibGVuZFNyYywgYmxlbmREc3QsIGJsZW5kQWxwaGFFcSwgYmxlbmRTcmNBbHBoYSwgYmxlbmREc3RBbHBoYSwgYmxlbmRDb2xvciwgcGFzc0lkeCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0cyB3aGV0aGVyIGVuYWJsZSB0aGUgc3RlbmNpbCB0ZXN0LlxuICAgICAqICEjemgg6K6+572u5piv5ZCm5byA5ZCv5qih5p2/5rWL6K+V44CCXG4gICAgICogQG1ldGhvZCBzZXRTdGVuY2lsRW5hYmxlZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGVuY2lsVGVzdCBcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGFzc0lkeCBcbiAgICAgKi9cbiAgICBzZXRTdGVuY2lsRW5hYmxlZCAoc3RlbmNpbFRlc3QgPSBnZnguU1RFTkNJTF9JTkhFUklULCBwYXNzSWR4KSB7XG4gICAgICAgIHRoaXMuX2VmZmVjdC5zZXRTdGVuY2lsRW5hYmxlZChzdGVuY2lsVGVzdCwgcGFzc0lkeCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0cyB0aGUgTWF0ZXJpYWwgc3RlbmNpbCByZW5kZXIgc3RhdGVzLlxuICAgICAqICEjemgg6K6+572u5p2Q6LSo55qE5qih5p2/5rWL6K+V5riy5p+T5Y+C5pWw44CCXG4gICAgICogQG1ldGhvZCBzZXRTdGVuY2lsXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN0ZW5jaWxUZXN0IFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGVuY2lsRnVuYyBcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RlbmNpbFJlZiBcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RlbmNpbE1hc2sgXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN0ZW5jaWxGYWlsT3AgXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN0ZW5jaWxaRmFpbE9wIFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGVuY2lsWlBhc3NPcCBcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RlbmNpbFdyaXRlTWFzayBcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGFzc0lkeCBcbiAgICAgKi9cbiAgICBzZXRTdGVuY2lsIChcbiAgICAgICAgc3RlbmNpbFRlc3QgPSBnZnguU1RFTkNJTF9JTkhFUklULFxuICAgICAgICBzdGVuY2lsRnVuYyA9IGdmeC5EU19GVU5DX0FMV0FZUyxcbiAgICAgICAgc3RlbmNpbFJlZiA9IDAsXG4gICAgICAgIHN0ZW5jaWxNYXNrID0gMHhmZixcbiAgICAgICAgc3RlbmNpbEZhaWxPcCA9IGdmeC5TVEVOQ0lMX09QX0tFRVAsXG4gICAgICAgIHN0ZW5jaWxaRmFpbE9wID0gZ2Z4LlNURU5DSUxfT1BfS0VFUCxcbiAgICAgICAgc3RlbmNpbFpQYXNzT3AgPSBnZnguU1RFTkNJTF9PUF9LRUVQLFxuICAgICAgICBzdGVuY2lsV3JpdGVNYXNrID0gMHhmZixcbiAgICAgICAgcGFzc0lkeFxuICAgICkge1xuICAgICAgICB0aGlzLl9lZmZlY3Quc2V0U3RlbmNpbChzdGVuY2lsVGVzdCwgc3RlbmNpbEZ1bmMsIHN0ZW5jaWxSZWYsIHN0ZW5jaWxNYXNrLCBzdGVuY2lsRmFpbE9wLCBzdGVuY2lsWkZhaWxPcCwgc3RlbmNpbFpQYXNzT3AsIHN0ZW5jaWxXcml0ZU1hc2ssIHBhc3NJZHgpO1xuICAgIH0sXG5cbiAgICB1cGRhdGVIYXNoIChoYXNoKSB7XG4gICAgICAgIHRoaXMuX21hbnVhbEhhc2ggPSBoYXNoO1xuICAgICAgICB0aGlzLl9lZmZlY3QgJiYgdGhpcy5fZWZmZWN0LnVwZGF0ZUhhc2goaGFzaCk7XG4gICAgfSxcblxuICAgIGdldEhhc2ggKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWFudWFsSGFzaCB8fCAodGhpcy5fZWZmZWN0ICYmIHRoaXMuX2VmZmVjdC5nZXRIYXNoKCkpO1xuICAgIH0sXG5cbiAgICBvbkxvYWQgKCkge1xuICAgICAgICB0aGlzLmVmZmVjdEFzc2V0ID0gdGhpcy5fZWZmZWN0QXNzZXQ7XG4gICAgICAgIGlmICghdGhpcy5fZWZmZWN0KSByZXR1cm47XG5cbiAgICAgICAgaWYgKHRoaXMuX3RlY2huaXF1ZUluZGV4KSB7XG4gICAgICAgICAgICB0aGlzLl9lZmZlY3Quc3dpdGNoVGVjaG5pcXVlKHRoaXMuX3RlY2huaXF1ZUluZGV4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3RlY2huaXF1ZURhdGEgPSB0aGlzLl90ZWNobmlxdWVEYXRhIHx8IHt9O1xuXG4gICAgICAgIGxldCBwYXNzRGF0YXMgPSB0aGlzLl90ZWNobmlxdWVEYXRhO1xuICAgICAgICBmb3IgKGxldCBpbmRleCBpbiBwYXNzRGF0YXMpIHtcbiAgICAgICAgICAgIGluZGV4ID0gcGFyc2VJbnQoaW5kZXgpO1xuICAgICAgICAgICAgbGV0IHBhc3NEYXRhID0gcGFzc0RhdGFzW2luZGV4XTtcbiAgICAgICAgICAgIGlmICghcGFzc0RhdGEpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBkZWYgaW4gcGFzc0RhdGEuZGVmaW5lcykge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVmaW5lKGRlZiwgcGFzc0RhdGEuZGVmaW5lc1tkZWZdLCBpbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBwcm9wIGluIHBhc3NEYXRhLnByb3BzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRQcm9wZXJ0eShwcm9wLCBwYXNzRGF0YS5wcm9wc1twcm9wXSwgaW5kZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IE1hdGVyaWFsO1xuY2MuTWF0ZXJpYWwgPSBNYXRlcmlhbDtcbiJdfQ==