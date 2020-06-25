
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/CCTexture2D.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _gfx = _interopRequireDefault(require("../../renderer/gfx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
var EventTarget = require('../event/event-target');

var renderer = require('../renderer');

require('../platform/CCClass');

var GL_NEAREST = 9728; // gl.NEAREST

var GL_LINEAR = 9729; // gl.LINEAR

var GL_REPEAT = 10497; // gl.REPEAT

var GL_CLAMP_TO_EDGE = 33071; // gl.CLAMP_TO_EDGE

var GL_MIRRORED_REPEAT = 33648; // gl.MIRRORED_REPEAT

var GL_RGBA = 6408; // gl.RGBA

var CHAR_CODE_0 = 48; // '0'

var CHAR_CODE_1 = 49; // '1'

var idGenerater = new (require('../platform/id-generater'))('Tex');
/**
 * <p>
 * This class allows to easily create OpenGL or Canvas 2D textures from images, text or raw data.                                    <br/>
 * The created cc.Texture2D object will always have power-of-two dimensions.                                                <br/>
 * Depending on how you create the cc.Texture2D object, the actual image area of the texture might be smaller than the texture dimensions <br/>
 *  i.e. "contentSize" != (pixelsWide, pixelsHigh) and (maxS, maxT) != (1.0, 1.0).                                           <br/>
 * Be aware that the content of the generated textures will be upside-down! </p>

 * @class Texture2D
 * @uses EventTarget
 * @extends Asset
 */
// define a specified number for the pixel format which gfx do not have a standard definition.

var CUSTOM_PIXEL_FORMAT = 1024;
/**
 * The texture pixel format, default value is RGBA8888, 
 * you should note that textures loaded by normal image files (png, jpg) can only support RGBA8888 format,
 * other formats are supported by compressed file types or raw data.
 * @enum Texture2D.PixelFormat
 */

var PixelFormat = cc.Enum({
  /**
   * 16-bit texture without Alpha channel
   * @property RGB565
   * @readonly
   * @type {Number}
   */
  RGB565: _gfx["default"].TEXTURE_FMT_R5_G6_B5,

  /**
   * 16-bit textures: RGB5A1
   * @property RGB5A1
   * @readonly
   * @type {Number}
   */
  RGB5A1: _gfx["default"].TEXTURE_FMT_R5_G5_B5_A1,

  /**
   * 16-bit textures: RGBA4444
   * @property RGBA4444
   * @readonly
   * @type {Number}
   */
  RGBA4444: _gfx["default"].TEXTURE_FMT_R4_G4_B4_A4,

  /**
   * 24-bit texture: RGB888
   * @property RGB888
   * @readonly
   * @type {Number}
   */
  RGB888: _gfx["default"].TEXTURE_FMT_RGB8,

  /**
   * 32-bit texture: RGBA8888
   * @property RGBA8888
   * @readonly
   * @type {Number}
   */
  RGBA8888: _gfx["default"].TEXTURE_FMT_RGBA8,

  /**
   * 32-bit float texture: RGBA32F
   * @property RGBA32F
   * @readonly
   * @type {Number}
   */
  RGBA32F: _gfx["default"].TEXTURE_FMT_RGBA32F,

  /**
   * 8-bit textures used as masks
   * @property A8
   * @readonly
   * @type {Number}
   */
  A8: _gfx["default"].TEXTURE_FMT_A8,

  /**
   * 8-bit intensity texture
   * @property I8
   * @readonly
   * @type {Number}
   */
  I8: _gfx["default"].TEXTURE_FMT_L8,

  /**
   * 16-bit textures used as masks
   * @property AI88
   * @readonly
   * @type {Number}
   */
  AI8: _gfx["default"].TEXTURE_FMT_L8_A8,

  /**
   * rgb 2 bpp pvrtc
   * @property RGB_PVRTC_2BPPV1
   * @readonly
   * @type {Number}
   */
  RGB_PVRTC_2BPPV1: _gfx["default"].TEXTURE_FMT_RGB_PVRTC_2BPPV1,

  /**
   * rgba 2 bpp pvrtc
   * @property RGBA_PVRTC_2BPPV1
   * @readonly
   * @type {Number}
   */
  RGBA_PVRTC_2BPPV1: _gfx["default"].TEXTURE_FMT_RGBA_PVRTC_2BPPV1,

  /**
   * rgb separate a 2 bpp pvrtc
   * RGB_A_PVRTC_2BPPV1 texture is a 2x height RGB_PVRTC_2BPPV1 format texture.
   * It separate the origin alpha channel to the bottom half atlas, the origin rgb channel to the top half atlas
   * @property RGB_A_PVRTC_2BPPV1
   * @readonly
   * @type {Number}
   */
  RGB_A_PVRTC_2BPPV1: CUSTOM_PIXEL_FORMAT++,

  /**
   * rgb 4 bpp pvrtc
   * @property RGB_PVRTC_4BPPV1
   * @readonly
   * @type {Number}
   */
  RGB_PVRTC_4BPPV1: _gfx["default"].TEXTURE_FMT_RGB_PVRTC_4BPPV1,

  /**
   * rgba 4 bpp pvrtc
   * @property RGBA_PVRTC_4BPPV1
   * @readonly
   * @type {Number}
   */
  RGBA_PVRTC_4BPPV1: _gfx["default"].TEXTURE_FMT_RGBA_PVRTC_4BPPV1,

  /**
   * rgb a 4 bpp pvrtc
   * RGB_A_PVRTC_4BPPV1 texture is a 2x height RGB_PVRTC_4BPPV1 format texture.
   * It separate the origin alpha channel to the bottom half atlas, the origin rgb channel to the top half atlas
   * @property RGB_A_PVRTC_4BPPV1
   * @readonly
   * @type {Number}
   */
  RGB_A_PVRTC_4BPPV1: CUSTOM_PIXEL_FORMAT++,

  /**
   * rgb etc1
   * @property RGB_ETC1
   * @readonly
   * @type {Number}
   */
  RGB_ETC1: _gfx["default"].TEXTURE_FMT_RGB_ETC1,

  /**
   * rgba etc1
   * @property RGBA_ETC1
   * @readonly
   * @type {Number}
   */
  RGBA_ETC1: CUSTOM_PIXEL_FORMAT++,

  /**
   * rgb etc2
   * @property RGB_ETC2
   * @readonly
   * @type {Number}
   */
  RGB_ETC2: _gfx["default"].TEXTURE_FMT_RGB_ETC2,

  /**
   * rgba etc2
   * @property RGBA_ETC2
   * @readonly
   * @type {Number}
   */
  RGBA_ETC2: _gfx["default"].TEXTURE_FMT_RGBA_ETC2
});
/**
 * The texture wrap mode
 * @enum Texture2D.WrapMode
 */

var WrapMode = cc.Enum({
  /**
   * The constant variable equals gl.REPEAT for texture
   * @property REPEAT
   * @type {Number}
   * @readonly
   */
  REPEAT: GL_REPEAT,

  /**
   * The constant variable equals gl.CLAMP_TO_EDGE for texture
   * @property CLAMP_TO_EDGE
   * @type {Number}
   * @readonly
   */
  CLAMP_TO_EDGE: GL_CLAMP_TO_EDGE,

  /**
   * The constant variable equals gl.MIRRORED_REPEAT for texture
   * @property MIRRORED_REPEAT
   * @type {Number}
   * @readonly
   */
  MIRRORED_REPEAT: GL_MIRRORED_REPEAT
});
/**
 * The texture filter mode
 * @enum Texture2D.Filter
 */

var Filter = cc.Enum({
  /**
   * The constant variable equals gl.LINEAR for texture
   * @property LINEAR
   * @type {Number}
   * @readonly
   */
  LINEAR: GL_LINEAR,

  /**
   * The constant variable equals gl.NEAREST for texture
   * @property NEAREST
   * @type {Number}
   * @readonly
   */
  NEAREST: GL_NEAREST
});
var FilterIndex = {
  9728: 0,
  // GL_NEAREST
  9729: 1 // GL_LINEAR

};
var _images = [];
var _sharedOpts = {
  width: undefined,
  height: undefined,
  minFilter: undefined,
  magFilter: undefined,
  wrapS: undefined,
  wrapT: undefined,
  format: undefined,
  genMipmaps: undefined,
  images: undefined,
  image: undefined,
  flipY: undefined,
  premultiplyAlpha: undefined
};

function _getSharedOptions() {
  for (var key in _sharedOpts) {
    _sharedOpts[key] = undefined;
  }

  _images.length = 0;
  _sharedOpts.images = _images;
  _sharedOpts.flipY = false;
  return _sharedOpts;
}
/**
 * This class allows to easily create OpenGL or Canvas 2D textures from images or raw data.
 *
 * @class Texture2D
 * @uses EventTarget
 * @extends Asset
 */


var Texture2D = cc.Class({
  name: 'cc.Texture2D',
  "extends": require('../assets/CCAsset'),
  mixins: [EventTarget],
  properties: {
    _nativeAsset: {
      get: function get() {
        // maybe returned to pool in webgl
        return this._image;
      },
      set: function set(data) {
        if (data._compressed && data._data) {
          this.initWithData(data._data, this._format, data.width, data.height);
        } else {
          this.initWithElement(data);
        }
      },
      override: true
    },
    _format: PixelFormat.RGBA8888,
    _premultiplyAlpha: false,
    _flipY: false,
    _minFilter: Filter.LINEAR,
    _magFilter: Filter.LINEAR,
    _mipFilter: Filter.LINEAR,
    _wrapS: WrapMode.CLAMP_TO_EDGE,
    _wrapT: WrapMode.CLAMP_TO_EDGE,
    _genMipmaps: false,

    /**
     * !#en Sets whether generate mipmaps for the texture
     * !#zh 是否为纹理设置生成 mipmaps。
     * @property {Boolean} genMipmaps
     * @default false
     */
    genMipmaps: {
      get: function get() {
        return this._genMipmaps;
      },
      set: function set(genMipmaps) {
        if (this._genMipmaps !== genMipmaps) {
          var opts = _getSharedOptions();

          opts.genMipmaps = genMipmaps;
          this.update(opts);
        }
      }
    },
    _packable: true,

    /**
     * !#en 
     * Sets whether texture can be packed into texture atlas.
     * If need use texture uv in custom Effect, please sets packable to false.
     * !#zh 
     * 设置纹理是否允许参与合图。
     * 如果需要在自定义 Effect 中使用纹理 UV，需要禁止该选项。
     * @property {Boolean} packable
     * @default true
     */
    packable: {
      get: function get() {
        return this._packable;
      },
      set: function set(val) {
        this._packable = val;
      }
    }
  },
  statics: {
    PixelFormat: PixelFormat,
    WrapMode: WrapMode,
    Filter: Filter,
    _FilterIndex: FilterIndex,
    // predefined most common extnames
    extnames: ['.png', '.jpg', '.jpeg', '.bmp', '.webp', '.pvr', '.pkm']
  },
  ctor: function ctor() {
    // Id for generate hash in material
    this._id = idGenerater.getNewId();
    /**
     * !#en
     * Whether the texture is loaded or not
     * !#zh
     * 贴图是否已经成功加载
     * @property loaded
     * @type {Boolean}
     */

    this.loaded = false;
    /**
     * !#en
     * Texture width in pixel
     * !#zh
     * 贴图像素宽度
     * @property width
     * @type {Number}
     */

    this.width = 0;
    /**
     * !#en
     * Texture height in pixel
     * !#zh
     * 贴图像素高度
     * @property height
     * @type {Number}
     */

    this.height = 0;
    this._hashDirty = true;
    this._hash = 0;
    this._texture = null;

    if (CC_EDITOR) {
      this._exportedExts = null;
    }
  },

  /**
   * !#en
   * Get renderer texture implementation object
   * extended from render.Texture2D
   * !#zh  返回渲染器内部贴图对象
   * @method getImpl
   */
  getImpl: function getImpl() {
    return this._texture;
  },
  getId: function getId() {
    return this._id;
  },
  toString: function toString() {
    return this.url || '';
  },

  /**
   * Update texture options, not available in Canvas render mode.
   * image, format, premultiplyAlpha can not be updated in native.
   * @method update
   * @param {Object} options
   * @param {DOMImageElement} options.image
   * @param {Boolean} options.genMipmaps
   * @param {PixelFormat} options.format
   * @param {Filter} options.minFilter
   * @param {Filter} options.magFilter
   * @param {WrapMode} options.wrapS
   * @param {WrapMode} options.wrapT
   * @param {Boolean} options.premultiplyAlpha
   */
  update: function update(options) {
    if (options) {
      var updateImg = false;

      if (options.width !== undefined) {
        this.width = options.width;
      }

      if (options.height !== undefined) {
        this.height = options.height;
      }

      if (options.minFilter !== undefined) {
        this._minFilter = options.minFilter;
        options.minFilter = FilterIndex[options.minFilter];
      }

      if (options.magFilter !== undefined) {
        this._magFilter = options.magFilter;
        options.magFilter = FilterIndex[options.magFilter];
      }

      if (options.mipFilter !== undefined) {
        this._mipFilter = options.mipFilter;
        options.mipFilter = FilterIndex[options.mipFilter];
      }

      if (options.wrapS !== undefined) {
        this._wrapS = options.wrapS;
      }

      if (options.wrapT !== undefined) {
        this._wrapT = options.wrapT;
      }

      if (options.format !== undefined) {
        this._format = options.format;
      }

      if (options.flipY !== undefined) {
        this._flipY = options.flipY;
        updateImg = true;
      }

      if (options.premultiplyAlpha !== undefined) {
        this._premultiplyAlpha = options.premultiplyAlpha;
        updateImg = true;
      }

      if (options.genMipmaps !== undefined) {
        this._genMipmaps = options.genMipmaps;
      }

      if (updateImg && this._image) {
        options.image = this._image;
      }

      if (options.images && options.images.length > 0) {
        this._image = options.images[0];
      } else if (options.image !== undefined) {
        this._image = options.image;

        if (!options.images) {
          _images.length = 0;
          options.images = _images;
        } // webgl texture 2d uses images


        options.images.push(options.image);
      }

      if (options.images && options.images.length > 0) {
        this._texture.update(options);
      }

      this._hashDirty = true;
    }
  },

  /**
   * !#en
   * Init with HTML element.
   * !#zh 用 HTML Image 或 Canvas 对象初始化贴图。
   * @method initWithElement
   * @param {HTMLImageElement|HTMLCanvasElement} element
   * @example
   * var img = new Image();
   * img.src = dataURL;
   * texture.initWithElement(img);
   */
  initWithElement: function initWithElement(element) {
    if (!element) return;
    this._image = element;

    if (element.complete || element instanceof HTMLCanvasElement) {
      this.handleLoadedTexture();
    } else {
      var self = this;
      element.addEventListener('load', function () {
        self.handleLoadedTexture();
      });
      element.addEventListener('error', function (err) {
        cc.warnID(3119, err.message);
      });
    }
  },

  /**
   * !#en
   * Intializes with a texture2d with data in Uint8Array.
   * !#zh 使用一个存储在 Unit8Array 中的图像数据（raw data）初始化数据。
   * @method initWithData
   * @param {TypedArray} data
   * @param {Number} pixelFormat
   * @param {Number} pixelsWidth
   * @param {Number} pixelsHeight
   * @return {Boolean}
   */
  initWithData: function initWithData(data, pixelFormat, pixelsWidth, pixelsHeight) {
    var opts = _getSharedOptions();

    opts.image = data; // webgl texture 2d uses images

    opts.images = [opts.image];
    opts.genMipmaps = this._genMipmaps;
    opts.premultiplyAlpha = this._premultiplyAlpha;
    opts.flipY = this._flipY;
    opts.minFilter = FilterIndex[this._minFilter];
    opts.magFilter = FilterIndex[this._magFilter];
    opts.wrapS = this._wrapS;
    opts.wrapT = this._wrapT;
    opts.format = this._getGFXPixelFormat(pixelFormat);
    opts.width = pixelsWidth;
    opts.height = pixelsHeight;

    if (!this._texture) {
      this._texture = new renderer.Texture2D(renderer.device, opts);
    } else {
      this._texture.update(opts);
    }

    this.width = pixelsWidth;
    this.height = pixelsHeight;

    this._checkPackable();

    this.loaded = true;
    this.emit("load");
    return true;
  },

  /**
   * !#en
   * HTMLElement Object getter, available only on web.<br/>
   * Note: texture is packed into texture atlas by default<br/>
   * you should set texture.packable as false before getting Html element object.
   * !#zh 获取当前贴图对应的 HTML Image 或 Canvas 对象，只在 Web 平台下有效。<br/>
   * 注意：<br/>
   * texture 默认参与动态合图，如果需要获取到正确的 Html 元素对象，需要先设置 texture.packable 为 false
   * @method getHtmlElementObj
   * @return {HTMLImageElement|HTMLCanvasElement}
   */
  getHtmlElementObj: function getHtmlElementObj() {
    return this._image;
  },

  /**
   * !#en
   * Destory this texture and immediately release its video memory. (Inherit from cc.Object.destroy)<br>
   * After destroy, this object is not usable any more.
   * You can use cc.isValid(obj) to check whether the object is destroyed before accessing it.
   * !#zh
   * 销毁该贴图，并立即释放它对应的显存。（继承自 cc.Object.destroy）<br/>
   * 销毁后，该对象不再可用。您可以在访问对象之前使用 cc.isValid(obj) 来检查对象是否已被销毁。
   * @method destroy
   * @return {Boolean} inherit from the CCObject
   */
  destroy: function destroy() {
    this._packable && cc.dynamicAtlasManager && cc.dynamicAtlasManager.deleteAtlasTexture(this);
    this._image = null;
    this._texture && this._texture.destroy(); // TODO cc.textureUtil ?
    // cc.textureCache.removeTextureForKey(this.url);  // item.rawUrl || item.url

    this._super();
  },

  /**
   * !#en
   * Pixel format of the texture.
   * !#zh 获取纹理的像素格式。
   * @method getPixelFormat
   * @return {Number}
   */
  getPixelFormat: function getPixelFormat() {
    //support only in WebGl rendering mode
    return this._format;
  },

  /**
   * !#en
   * Whether or not the texture has their Alpha premultiplied.
   * !#zh 检查纹理在上传 GPU 时预乘选项是否开启。
   * @method hasPremultipliedAlpha
   * @return {Boolean}
   */
  hasPremultipliedAlpha: function hasPremultipliedAlpha() {
    return this._premultiplyAlpha || false;
  },

  /**
   * !#en
   * Handler of texture loaded event.
   * Since v2.0, you don't need to invoke this function, it will be invoked automatically after texture loaded.
   * !#zh 贴图加载事件处理器。v2.0 之后你将不在需要手动执行这个函数，它会在贴图加载成功之后自动执行。
   * @method handleLoadedTexture
   * @param {Boolean} [premultiplied]
   */
  handleLoadedTexture: function handleLoadedTexture() {
    if (!this._image || !this._image.width || !this._image.height) return;
    this.width = this._image.width;
    this.height = this._image.height;

    var opts = _getSharedOptions();

    opts.image = this._image; // webgl texture 2d uses images

    opts.images = [opts.image];
    opts.width = this.width;
    opts.height = this.height;
    opts.genMipmaps = this._genMipmaps;
    opts.format = this._getGFXPixelFormat(this._format);
    opts.premultiplyAlpha = this._premultiplyAlpha;
    opts.flipY = this._flipY;
    opts.minFilter = FilterIndex[this._minFilter];
    opts.magFilter = FilterIndex[this._magFilter];
    opts.wrapS = this._wrapS;
    opts.wrapT = this._wrapT;

    if (!this._texture) {
      this._texture = new renderer.Texture2D(renderer.device, opts);
    } else {
      this._texture.update(opts);
    }

    this._checkPackable(); //dispatch load event to listener.


    this.loaded = true;
    this.emit("load");

    if (cc.macro.CLEANUP_IMAGE_CACHE && this._image instanceof HTMLImageElement) {
      this._clearImage();
    }
  },

  /**
   * !#en
   * Description of cc.Texture2D.
   * !#zh cc.Texture2D 描述。
   * @method description
   * @returns {String}
   */
  description: function description() {
    return "<cc.Texture2D | Name = " + this.url + " | Dimensions = " + this.width + " x " + this.height + ">";
  },

  /**
   * !#en
   * Release texture, please use destroy instead.
   * !#zh 释放纹理，请使用 destroy 替代。
   * @method releaseTexture
   * @deprecated since v2.0
   */
  releaseTexture: function releaseTexture() {
    this._image = null;
    this._texture && this._texture.destroy();
  },

  /**
   * !#en Sets the wrap s and wrap t options. <br/>
   * If the texture size is NPOT (non power of 2), then in can only use gl.CLAMP_TO_EDGE in gl.TEXTURE_WRAP_{S,T}.
   * !#zh 设置纹理包装模式。
   * 若纹理贴图尺寸是 NPOT（non power of 2），则只能使用 Texture2D.WrapMode.CLAMP_TO_EDGE。
   * @method setTexParameters
   * @param {Texture2D.WrapMode} wrapS
   * @param {Texture2D.WrapMode} wrapT
   */
  setWrapMode: function setWrapMode(wrapS, wrapT) {
    if (this._wrapS !== wrapS || this._wrapT !== wrapT) {
      var opts = _getSharedOptions();

      opts.wrapS = wrapS;
      opts.wrapT = wrapT;
      this.update(opts);
    }
  },

  /**
   * !#en Sets the minFilter and magFilter options
   * !#zh 设置纹理贴图缩小和放大过滤器算法选项。
   * @method setFilters
   * @param {Texture2D.Filter} minFilter
   * @param {Texture2D.Filter} magFilter
   */
  setFilters: function setFilters(minFilter, magFilter) {
    if (this._minFilter !== minFilter || this._magFilter !== magFilter) {
      var opts = _getSharedOptions();

      opts.minFilter = minFilter;
      opts.magFilter = magFilter;
      this.update(opts);
    }
  },

  /**
   * !#en
   * Sets the flipY options
   * !#zh 设置贴图的纵向翻转选项。
   * @method setFlipY
   * @param {Boolean} flipY
   */
  setFlipY: function setFlipY(flipY) {
    if (this._flipY !== flipY) {
      var opts = _getSharedOptions();

      opts.flipY = flipY;
      this.update(opts);
    }
  },

  /**
   * !#en
   * Sets the premultiply alpha options
   * !#zh 设置贴图的预乘选项。
   * @method setPremultiplyAlpha
   * @param {Boolean} premultiply
   */
  setPremultiplyAlpha: function setPremultiplyAlpha(premultiply) {
    if (this._premultiplyAlpha !== premultiply) {
      var opts = _getSharedOptions();

      opts.premultiplyAlpha = premultiply;
      this.update(opts);
    }
  },
  _checkPackable: function _checkPackable() {
    var dynamicAtlas = cc.dynamicAtlasManager;
    if (!dynamicAtlas) return;

    if (this._isCompressed()) {
      this._packable = false;
      return;
    }

    var w = this.width,
        h = this.height;

    if (!this._image || w > dynamicAtlas.maxFrameSize || h > dynamicAtlas.maxFrameSize || this._getHash() !== dynamicAtlas.Atlas.DEFAULT_HASH) {
      this._packable = false;
      return;
    }

    if (this._image && this._image instanceof HTMLCanvasElement) {
      this._packable = true;
    }
  },
  _getOpts: function _getOpts() {
    var opts = _getSharedOptions();

    opts.width = this.width;
    opts.height = this.height;
    opts.genMipmaps = this._genMipmaps;
    opts.format = this._format;
    opts.premultiplyAlpha = this._premultiplyAlpha;
    opts.anisotropy = this._anisotropy;
    opts.flipY = this._flipY;
    opts.minFilter = FilterIndex[this._minFilter];
    opts.magFilter = FilterIndex[this._magFilter];
    opts.mipFilter = FilterIndex[this._mipFilter];
    opts.wrapS = this._wrapS;
    opts.wrapT = this._wrapT;
    return opts;
  },
  _getGFXPixelFormat: function _getGFXPixelFormat(format) {
    if (format === PixelFormat.RGBA_ETC1) {
      format = PixelFormat.RGB_ETC1;
    } else if (format === PixelFormat.RGB_A_PVRTC_4BPPV1) {
      format = PixelFormat.RGB_PVRTC_4BPPV1;
    } else if (format === PixelFormat.RGB_A_PVRTC_2BPPV1) {
      format = PixelFormat.RGB_PVRTC_2BPPV1;
    }

    return format;
  },
  _resetUnderlyingMipmaps: function _resetUnderlyingMipmaps(mipmapSources) {
    var opts = this._getOpts();

    opts.images = mipmapSources || [null];

    if (!this._texture) {
      this._texture = new renderer.Texture2D(renderer.device, opts);
    } else {
      this._texture.update(opts);
    }
  },
  // SERIALIZATION
  _serialize: (CC_EDITOR || CC_TEST) && function () {
    var extId = "";
    var exportedExts = this._exportedExts;

    if (!exportedExts && this._native) {
      exportedExts = [this._native];
    }

    if (exportedExts) {
      var exts = [];

      for (var i = 0; i < exportedExts.length; i++) {
        var _extId = "";
        var ext = exportedExts[i];

        if (ext) {
          // ext@format
          var extFormat = ext.split('@');
          _extId = Texture2D.extnames.indexOf(extFormat[0]);

          if (_extId < 0) {
            _extId = ext;
          }

          if (extFormat[1]) {
            _extId += '@' + extFormat[1];
          }
        }

        exts.push(_extId);
      }

      extId = exts.join('_');
    }

    var asset = extId + "," + this._minFilter + "," + this._magFilter + "," + this._wrapS + "," + this._wrapT + "," + ((this._premultiplyAlpha ? 1 : 0) + "," + (this._genMipmaps ? 1 : 0) + "," + (this._packable ? 1 : 0));
    return asset;
  },
  _deserialize: function _deserialize(data, handle) {
    var device = cc.renderer.device;
    var fields = data.split(','); // decode extname

    var extIdStr = fields[0];

    if (extIdStr) {
      var extIds = extIdStr.split('_');
      var defaultExt = '';
      var bestExt = '';
      var bestIndex = 999;
      var bestFormat = this._format;
      var SupportTextureFormats = cc.macro.SUPPORT_TEXTURE_FORMATS;

      for (var i = 0; i < extIds.length; i++) {
        var extFormat = extIds[i].split('@');
        var tmpExt = extFormat[0];
        tmpExt = Texture2D.extnames[tmpExt.charCodeAt(0) - CHAR_CODE_0] || tmpExt;
        var index = SupportTextureFormats.indexOf(tmpExt);

        if (index !== -1 && index < bestIndex) {
          var tmpFormat = extFormat[1] ? parseInt(extFormat[1]) : this._format; // check whether or not support compressed texture

          if (tmpExt === '.pvr' && !device.ext('WEBGL_compressed_texture_pvrtc')) {
            continue;
          } else if ((tmpFormat === PixelFormat.RGB_ETC1 || tmpFormat === PixelFormat.RGBA_ETC1) && !device.ext('WEBGL_compressed_texture_etc1')) {
            continue;
          } else if ((tmpFormat === PixelFormat.RGB_ETC2 || tmpFormat === PixelFormat.RGBA_ETC2) && !device.ext('WEBGL_compressed_texture_etc')) {
            continue;
          } else if (tmpExt === '.webp' && !cc.sys.capabilities.webp) {
            continue;
          }

          bestIndex = index;
          bestExt = tmpExt;
          bestFormat = tmpFormat;
        } else if (!defaultExt) {
          defaultExt = tmpExt;
        }
      }

      if (bestExt) {
        this._setRawAsset(bestExt);

        this._format = bestFormat;
      } else {
        this._setRawAsset(defaultExt);

        cc.warnID(3120, handle.customEnv.url, defaultExt, defaultExt);
      }
    }

    if (fields.length === 8) {
      // decode filters
      this._minFilter = parseInt(fields[1]);
      this._magFilter = parseInt(fields[2]); // decode wraps

      this._wrapS = parseInt(fields[3]);
      this._wrapT = parseInt(fields[4]); // decode premultiply alpha

      this._premultiplyAlpha = fields[5].charCodeAt(0) === CHAR_CODE_1;
      this._genMipmaps = fields[6].charCodeAt(0) === CHAR_CODE_1;
      this._packable = fields[7].charCodeAt(0) === CHAR_CODE_1;
    }
  },
  _getHash: function _getHash() {
    if (!this._hashDirty) {
      return this._hash;
    }

    var genMipmaps = this._genMipmaps ? 1 : 0;
    var premultiplyAlpha = this._premultiplyAlpha ? 1 : 0;
    var flipY = this._flipY ? 1 : 0;
    var minFilter = this._minFilter === Filter.LINEAR ? 1 : 2;
    var magFilter = this._magFilter === Filter.LINEAR ? 1 : 2;
    var wrapS = this._wrapS === WrapMode.REPEAT ? 1 : this._wrapS === WrapMode.CLAMP_TO_EDGE ? 2 : 3;
    var wrapT = this._wrapT === WrapMode.REPEAT ? 1 : this._wrapT === WrapMode.CLAMP_TO_EDGE ? 2 : 3;
    var pixelFormat = this._format;
    var image = this._image;

    if (CC_JSB && image) {
      if (image._glFormat && image._glFormat !== GL_RGBA) pixelFormat = 0;
      premultiplyAlpha = image._premultiplyAlpha ? 1 : 0;
    }

    this._hash = Number("" + minFilter + magFilter + pixelFormat + wrapS + wrapT + genMipmaps + premultiplyAlpha + flipY);
    this._hashDirty = false;
    return this._hash;
  },
  _isCompressed: function _isCompressed() {
    return this._format < PixelFormat.A8 || this._format > PixelFormat.RGBA32F;
  },
  _clearImage: function _clearImage() {
    // wechat game platform will cache image parsed data, 
    // so image will consume much more memory than web, releasing it
    // Release image in loader cache
    // native image element has not image.id, release by image.src.
    cc.loader.removeItem(this._image.id || this._image.src);
    this._image.src = "";
  }
});
/**
 * !#zh
 * 当该资源加载成功后触发该事件
 * !#en
 * This event is emitted when the asset is loaded
 *
 * @event load
 */

cc.Texture2D = module.exports = Texture2D;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDVGV4dHVyZTJELmpzIl0sIm5hbWVzIjpbIkV2ZW50VGFyZ2V0IiwicmVxdWlyZSIsInJlbmRlcmVyIiwiR0xfTkVBUkVTVCIsIkdMX0xJTkVBUiIsIkdMX1JFUEVBVCIsIkdMX0NMQU1QX1RPX0VER0UiLCJHTF9NSVJST1JFRF9SRVBFQVQiLCJHTF9SR0JBIiwiQ0hBUl9DT0RFXzAiLCJDSEFSX0NPREVfMSIsImlkR2VuZXJhdGVyIiwiQ1VTVE9NX1BJWEVMX0ZPUk1BVCIsIlBpeGVsRm9ybWF0IiwiY2MiLCJFbnVtIiwiUkdCNTY1IiwiZ2Z4IiwiVEVYVFVSRV9GTVRfUjVfRzZfQjUiLCJSR0I1QTEiLCJURVhUVVJFX0ZNVF9SNV9HNV9CNV9BMSIsIlJHQkE0NDQ0IiwiVEVYVFVSRV9GTVRfUjRfRzRfQjRfQTQiLCJSR0I4ODgiLCJURVhUVVJFX0ZNVF9SR0I4IiwiUkdCQTg4ODgiLCJURVhUVVJFX0ZNVF9SR0JBOCIsIlJHQkEzMkYiLCJURVhUVVJFX0ZNVF9SR0JBMzJGIiwiQTgiLCJURVhUVVJFX0ZNVF9BOCIsIkk4IiwiVEVYVFVSRV9GTVRfTDgiLCJBSTgiLCJURVhUVVJFX0ZNVF9MOF9BOCIsIlJHQl9QVlJUQ18yQlBQVjEiLCJURVhUVVJFX0ZNVF9SR0JfUFZSVENfMkJQUFYxIiwiUkdCQV9QVlJUQ18yQlBQVjEiLCJURVhUVVJFX0ZNVF9SR0JBX1BWUlRDXzJCUFBWMSIsIlJHQl9BX1BWUlRDXzJCUFBWMSIsIlJHQl9QVlJUQ180QlBQVjEiLCJURVhUVVJFX0ZNVF9SR0JfUFZSVENfNEJQUFYxIiwiUkdCQV9QVlJUQ180QlBQVjEiLCJURVhUVVJFX0ZNVF9SR0JBX1BWUlRDXzRCUFBWMSIsIlJHQl9BX1BWUlRDXzRCUFBWMSIsIlJHQl9FVEMxIiwiVEVYVFVSRV9GTVRfUkdCX0VUQzEiLCJSR0JBX0VUQzEiLCJSR0JfRVRDMiIsIlRFWFRVUkVfRk1UX1JHQl9FVEMyIiwiUkdCQV9FVEMyIiwiVEVYVFVSRV9GTVRfUkdCQV9FVEMyIiwiV3JhcE1vZGUiLCJSRVBFQVQiLCJDTEFNUF9UT19FREdFIiwiTUlSUk9SRURfUkVQRUFUIiwiRmlsdGVyIiwiTElORUFSIiwiTkVBUkVTVCIsIkZpbHRlckluZGV4IiwiX2ltYWdlcyIsIl9zaGFyZWRPcHRzIiwid2lkdGgiLCJ1bmRlZmluZWQiLCJoZWlnaHQiLCJtaW5GaWx0ZXIiLCJtYWdGaWx0ZXIiLCJ3cmFwUyIsIndyYXBUIiwiZm9ybWF0IiwiZ2VuTWlwbWFwcyIsImltYWdlcyIsImltYWdlIiwiZmxpcFkiLCJwcmVtdWx0aXBseUFscGhhIiwiX2dldFNoYXJlZE9wdGlvbnMiLCJrZXkiLCJsZW5ndGgiLCJUZXh0dXJlMkQiLCJDbGFzcyIsIm5hbWUiLCJtaXhpbnMiLCJwcm9wZXJ0aWVzIiwiX25hdGl2ZUFzc2V0IiwiZ2V0IiwiX2ltYWdlIiwic2V0IiwiZGF0YSIsIl9jb21wcmVzc2VkIiwiX2RhdGEiLCJpbml0V2l0aERhdGEiLCJfZm9ybWF0IiwiaW5pdFdpdGhFbGVtZW50Iiwib3ZlcnJpZGUiLCJfcHJlbXVsdGlwbHlBbHBoYSIsIl9mbGlwWSIsIl9taW5GaWx0ZXIiLCJfbWFnRmlsdGVyIiwiX21pcEZpbHRlciIsIl93cmFwUyIsIl93cmFwVCIsIl9nZW5NaXBtYXBzIiwib3B0cyIsInVwZGF0ZSIsIl9wYWNrYWJsZSIsInBhY2thYmxlIiwidmFsIiwic3RhdGljcyIsIl9GaWx0ZXJJbmRleCIsImV4dG5hbWVzIiwiY3RvciIsIl9pZCIsImdldE5ld0lkIiwibG9hZGVkIiwiX2hhc2hEaXJ0eSIsIl9oYXNoIiwiX3RleHR1cmUiLCJDQ19FRElUT1IiLCJfZXhwb3J0ZWRFeHRzIiwiZ2V0SW1wbCIsImdldElkIiwidG9TdHJpbmciLCJ1cmwiLCJvcHRpb25zIiwidXBkYXRlSW1nIiwibWlwRmlsdGVyIiwicHVzaCIsImVsZW1lbnQiLCJjb21wbGV0ZSIsIkhUTUxDYW52YXNFbGVtZW50IiwiaGFuZGxlTG9hZGVkVGV4dHVyZSIsInNlbGYiLCJhZGRFdmVudExpc3RlbmVyIiwiZXJyIiwid2FybklEIiwibWVzc2FnZSIsInBpeGVsRm9ybWF0IiwicGl4ZWxzV2lkdGgiLCJwaXhlbHNIZWlnaHQiLCJfZ2V0R0ZYUGl4ZWxGb3JtYXQiLCJkZXZpY2UiLCJfY2hlY2tQYWNrYWJsZSIsImVtaXQiLCJnZXRIdG1sRWxlbWVudE9iaiIsImRlc3Ryb3kiLCJkeW5hbWljQXRsYXNNYW5hZ2VyIiwiZGVsZXRlQXRsYXNUZXh0dXJlIiwiX3N1cGVyIiwiZ2V0UGl4ZWxGb3JtYXQiLCJoYXNQcmVtdWx0aXBsaWVkQWxwaGEiLCJtYWNybyIsIkNMRUFOVVBfSU1BR0VfQ0FDSEUiLCJIVE1MSW1hZ2VFbGVtZW50IiwiX2NsZWFySW1hZ2UiLCJkZXNjcmlwdGlvbiIsInJlbGVhc2VUZXh0dXJlIiwic2V0V3JhcE1vZGUiLCJzZXRGaWx0ZXJzIiwic2V0RmxpcFkiLCJzZXRQcmVtdWx0aXBseUFscGhhIiwicHJlbXVsdGlwbHkiLCJkeW5hbWljQXRsYXMiLCJfaXNDb21wcmVzc2VkIiwidyIsImgiLCJtYXhGcmFtZVNpemUiLCJfZ2V0SGFzaCIsIkF0bGFzIiwiREVGQVVMVF9IQVNIIiwiX2dldE9wdHMiLCJhbmlzb3Ryb3B5IiwiX2FuaXNvdHJvcHkiLCJfcmVzZXRVbmRlcmx5aW5nTWlwbWFwcyIsIm1pcG1hcFNvdXJjZXMiLCJfc2VyaWFsaXplIiwiQ0NfVEVTVCIsImV4dElkIiwiZXhwb3J0ZWRFeHRzIiwiX25hdGl2ZSIsImV4dHMiLCJpIiwiZXh0IiwiZXh0Rm9ybWF0Iiwic3BsaXQiLCJpbmRleE9mIiwiam9pbiIsImFzc2V0IiwiX2Rlc2VyaWFsaXplIiwiaGFuZGxlIiwiZmllbGRzIiwiZXh0SWRTdHIiLCJleHRJZHMiLCJkZWZhdWx0RXh0IiwiYmVzdEV4dCIsImJlc3RJbmRleCIsImJlc3RGb3JtYXQiLCJTdXBwb3J0VGV4dHVyZUZvcm1hdHMiLCJTVVBQT1JUX1RFWFRVUkVfRk9STUFUUyIsInRtcEV4dCIsImNoYXJDb2RlQXQiLCJpbmRleCIsInRtcEZvcm1hdCIsInBhcnNlSW50Iiwic3lzIiwiY2FwYWJpbGl0aWVzIiwid2VicCIsIl9zZXRSYXdBc3NldCIsImN1c3RvbUVudiIsIkNDX0pTQiIsIl9nbEZvcm1hdCIsIk51bWJlciIsImxvYWRlciIsInJlbW92ZUl0ZW0iLCJpZCIsInNyYyIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUE4QkE7Ozs7QUE5QkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkEsSUFBTUEsV0FBVyxHQUFHQyxPQUFPLENBQUMsdUJBQUQsQ0FBM0I7O0FBQ0EsSUFBTUMsUUFBUSxHQUFHRCxPQUFPLENBQUMsYUFBRCxDQUF4Qjs7QUFDQUEsT0FBTyxDQUFDLHFCQUFELENBQVA7O0FBSUEsSUFBTUUsVUFBVSxHQUFHLElBQW5CLEVBQXdDOztBQUN4QyxJQUFNQyxTQUFTLEdBQUcsSUFBbEIsRUFBd0M7O0FBQ3hDLElBQU1DLFNBQVMsR0FBRyxLQUFsQixFQUF3Qzs7QUFDeEMsSUFBTUMsZ0JBQWdCLEdBQUcsS0FBekIsRUFBd0M7O0FBQ3hDLElBQU1DLGtCQUFrQixHQUFHLEtBQTNCLEVBQXdDOztBQUN4QyxJQUFNQyxPQUFPLEdBQUcsSUFBaEIsRUFBd0M7O0FBRXhDLElBQU1DLFdBQVcsR0FBRyxFQUFwQixFQUEyQjs7QUFDM0IsSUFBTUMsV0FBVyxHQUFHLEVBQXBCLEVBQTJCOztBQUUzQixJQUFJQyxXQUFXLEdBQUcsS0FBS1YsT0FBTyxDQUFDLDBCQUFELENBQVosRUFBMEMsS0FBMUMsQ0FBbEI7QUFHQTs7Ozs7Ozs7Ozs7O0FBYUE7O0FBQ0EsSUFBSVcsbUJBQW1CLEdBQUcsSUFBMUI7QUFFQTs7Ozs7OztBQU1BLElBQU1DLFdBQVcsR0FBR0MsRUFBRSxDQUFDQyxJQUFILENBQVE7QUFDeEI7Ozs7OztBQU1BQyxFQUFBQSxNQUFNLEVBQUVDLGdCQUFJQyxvQkFQWTs7QUFReEI7Ozs7OztBQU1BQyxFQUFBQSxNQUFNLEVBQUVGLGdCQUFJRyx1QkFkWTs7QUFleEI7Ozs7OztBQU1BQyxFQUFBQSxRQUFRLEVBQUVK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LDJCQWtxQko7QUFDYixXQUFPLEtBQUt2RSxPQUFMLEdBQWU5RSxXQUFXLENBQUNnQixFQUEzQixJQUFpQyxLQUFLOEQsT0FBTCxHQUFlOUUsV0FBVyxDQUFDYyxPQUFuRTtBQUNILEdBcHFCb0I7QUFzcUJyQjhILEVBQUFBLFdBdHFCcUIseUJBc3FCTjtBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EzSSxJQUFBQSxFQUFFLENBQUNxTSxNQUFILENBQVVDLFVBQVYsQ0FBcUIsS0FBSy9ILE1BQUwsQ0FBWWdJLEVBQVosSUFBa0IsS0FBS2hJLE1BQUwsQ0FBWWlJLEdBQW5EO0FBQ0EsU0FBS2pJLE1BQUwsQ0FBWWlJLEdBQVosR0FBa0IsRUFBbEI7QUFDSDtBQTdxQm9CLENBQVQsQ0FBaEI7QUFnckJBOzs7Ozs7Ozs7QUFTQXhNLEVBQUUsQ0FBQ2dFLFNBQUgsR0FBZXlJLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjFJLFNBQWhDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBFdmVudFRhcmdldCA9IHJlcXVpcmUoJy4uL2V2ZW50L2V2ZW50LXRhcmdldCcpO1xuY29uc3QgcmVuZGVyZXIgPSByZXF1aXJlKCcuLi9yZW5kZXJlcicpO1xucmVxdWlyZSgnLi4vcGxhdGZvcm0vQ0NDbGFzcycpO1xuXG5pbXBvcnQgZ2Z4IGZyb20gJy4uLy4uL3JlbmRlcmVyL2dmeCc7XG5cbmNvbnN0IEdMX05FQVJFU1QgPSA5NzI4OyAgICAgICAgICAgICAgICAvLyBnbC5ORUFSRVNUXG5jb25zdCBHTF9MSU5FQVIgPSA5NzI5OyAgICAgICAgICAgICAgICAgLy8gZ2wuTElORUFSXG5jb25zdCBHTF9SRVBFQVQgPSAxMDQ5NzsgICAgICAgICAgICAgICAgLy8gZ2wuUkVQRUFUXG5jb25zdCBHTF9DTEFNUF9UT19FREdFID0gMzMwNzE7ICAgICAgICAgLy8gZ2wuQ0xBTVBfVE9fRURHRVxuY29uc3QgR0xfTUlSUk9SRURfUkVQRUFUID0gMzM2NDg7ICAgICAgIC8vIGdsLk1JUlJPUkVEX1JFUEVBVFxuY29uc3QgR0xfUkdCQSA9IDY0MDg7ICAgICAgICAgICAgICAgICAgIC8vIGdsLlJHQkFcblxuY29uc3QgQ0hBUl9DT0RFXzAgPSA0ODsgICAgLy8gJzAnXG5jb25zdCBDSEFSX0NPREVfMSA9IDQ5OyAgICAvLyAnMSdcblxudmFyIGlkR2VuZXJhdGVyID0gbmV3IChyZXF1aXJlKCcuLi9wbGF0Zm9ybS9pZC1nZW5lcmF0ZXInKSkoJ1RleCcpO1xuXG5cbi8qKlxuICogPHA+XG4gKiBUaGlzIGNsYXNzIGFsbG93cyB0byBlYXNpbHkgY3JlYXRlIE9wZW5HTCBvciBDYW52YXMgMkQgdGV4dHVyZXMgZnJvbSBpbWFnZXMsIHRleHQgb3IgcmF3IGRhdGEuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAqIFRoZSBjcmVhdGVkIGNjLlRleHR1cmUyRCBvYmplY3Qgd2lsbCBhbHdheXMgaGF2ZSBwb3dlci1vZi10d28gZGltZW5zaW9ucy4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICogRGVwZW5kaW5nIG9uIGhvdyB5b3UgY3JlYXRlIHRoZSBjYy5UZXh0dXJlMkQgb2JqZWN0LCB0aGUgYWN0dWFsIGltYWdlIGFyZWEgb2YgdGhlIHRleHR1cmUgbWlnaHQgYmUgc21hbGxlciB0aGFuIHRoZSB0ZXh0dXJlIGRpbWVuc2lvbnMgPGJyLz5cbiAqICBpLmUuIFwiY29udGVudFNpemVcIiAhPSAocGl4ZWxzV2lkZSwgcGl4ZWxzSGlnaCkgYW5kIChtYXhTLCBtYXhUKSAhPSAoMS4wLCAxLjApLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICogQmUgYXdhcmUgdGhhdCB0aGUgY29udGVudCBvZiB0aGUgZ2VuZXJhdGVkIHRleHR1cmVzIHdpbGwgYmUgdXBzaWRlLWRvd24hIDwvcD5cblxuICogQGNsYXNzIFRleHR1cmUyRFxuICogQHVzZXMgRXZlbnRUYXJnZXRcbiAqIEBleHRlbmRzIEFzc2V0XG4gKi9cblxuLy8gZGVmaW5lIGEgc3BlY2lmaWVkIG51bWJlciBmb3IgdGhlIHBpeGVsIGZvcm1hdCB3aGljaCBnZnggZG8gbm90IGhhdmUgYSBzdGFuZGFyZCBkZWZpbml0aW9uLlxubGV0IENVU1RPTV9QSVhFTF9GT1JNQVQgPSAxMDI0O1xuXG4vKipcbiAqIFRoZSB0ZXh0dXJlIHBpeGVsIGZvcm1hdCwgZGVmYXVsdCB2YWx1ZSBpcyBSR0JBODg4OCwgXG4gKiB5b3Ugc2hvdWxkIG5vdGUgdGhhdCB0ZXh0dXJlcyBsb2FkZWQgYnkgbm9ybWFsIGltYWdlIGZpbGVzIChwbmcsIGpwZykgY2FuIG9ubHkgc3VwcG9ydCBSR0JBODg4OCBmb3JtYXQsXG4gKiBvdGhlciBmb3JtYXRzIGFyZSBzdXBwb3J0ZWQgYnkgY29tcHJlc3NlZCBmaWxlIHR5cGVzIG9yIHJhdyBkYXRhLlxuICogQGVudW0gVGV4dHVyZTJELlBpeGVsRm9ybWF0XG4gKi9cbmNvbnN0IFBpeGVsRm9ybWF0ID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogMTYtYml0IHRleHR1cmUgd2l0aG91dCBBbHBoYSBjaGFubmVsXG4gICAgICogQHByb3BlcnR5IFJHQjU2NVxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgUkdCNTY1OiBnZnguVEVYVFVSRV9GTVRfUjVfRzZfQjUsXG4gICAgLyoqXG4gICAgICogMTYtYml0IHRleHR1cmVzOiBSR0I1QTFcbiAgICAgKiBAcHJvcGVydHkgUkdCNUExXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBSR0I1QTE6IGdmeC5URVhUVVJFX0ZNVF9SNV9HNV9CNV9BMSxcbiAgICAvKipcbiAgICAgKiAxNi1iaXQgdGV4dHVyZXM6IFJHQkE0NDQ0XG4gICAgICogQHByb3BlcnR5IFJHQkE0NDQ0XG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBSR0JBNDQ0NDogZ2Z4LlRFWFRVUkVfRk1UX1I0X0c0X0I0X0E0LFxuICAgIC8qKlxuICAgICAqIDI0LWJpdCB0ZXh0dXJlOiBSR0I4ODhcbiAgICAgKiBAcHJvcGVydHkgUkdCODg4XG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBSR0I4ODg6IGdmeC5URVhUVVJFX0ZNVF9SR0I4LFxuICAgIC8qKlxuICAgICAqIDMyLWJpdCB0ZXh0dXJlOiBSR0JBODg4OFxuICAgICAqIEBwcm9wZXJ0eSBSR0JBODg4OFxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgUkdCQTg4ODg6IGdmeC5URVhUVVJFX0ZNVF9SR0JBOCxcbiAgICAvKipcbiAgICAgKiAzMi1iaXQgZmxvYXQgdGV4dHVyZTogUkdCQTMyRlxuICAgICAqIEBwcm9wZXJ0eSBSR0JBMzJGXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBSR0JBMzJGOiBnZnguVEVYVFVSRV9GTVRfUkdCQTMyRixcbiAgICAvKipcbiAgICAgKiA4LWJpdCB0ZXh0dXJlcyB1c2VkIGFzIG1hc2tzXG4gICAgICogQHByb3BlcnR5IEE4XG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBBODogZ2Z4LlRFWFRVUkVfRk1UX0E4LFxuICAgIC8qKlxuICAgICAqIDgtYml0IGludGVuc2l0eSB0ZXh0dXJlXG4gICAgICogQHByb3BlcnR5IEk4XG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBJODogZ2Z4LlRFWFRVUkVfRk1UX0w4LFxuICAgIC8qKlxuICAgICAqIDE2LWJpdCB0ZXh0dXJlcyB1c2VkIGFzIG1hc2tzXG4gICAgICogQHByb3BlcnR5IEFJODhcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIEFJODogZ2Z4LlRFWFRVUkVfRk1UX0w4X0E4LFxuXG4gICAgLyoqXG4gICAgICogcmdiIDIgYnBwIHB2cnRjXG4gICAgICogQHByb3BlcnR5IFJHQl9QVlJUQ18yQlBQVjFcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFJHQl9QVlJUQ18yQlBQVjE6IGdmeC5URVhUVVJFX0ZNVF9SR0JfUFZSVENfMkJQUFYxLFxuICAgIC8qKlxuICAgICAqIHJnYmEgMiBicHAgcHZydGNcbiAgICAgKiBAcHJvcGVydHkgUkdCQV9QVlJUQ18yQlBQVjFcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFJHQkFfUFZSVENfMkJQUFYxOiBnZnguVEVYVFVSRV9GTVRfUkdCQV9QVlJUQ18yQlBQVjEsXG4gICAgLyoqXG4gICAgICogcmdiIHNlcGFyYXRlIGEgMiBicHAgcHZydGNcbiAgICAgKiBSR0JfQV9QVlJUQ18yQlBQVjEgdGV4dHVyZSBpcyBhIDJ4IGhlaWdodCBSR0JfUFZSVENfMkJQUFYxIGZvcm1hdCB0ZXh0dXJlLlxuICAgICAqIEl0IHNlcGFyYXRlIHRoZSBvcmlnaW4gYWxwaGEgY2hhbm5lbCB0byB0aGUgYm90dG9tIGhhbGYgYXRsYXMsIHRoZSBvcmlnaW4gcmdiIGNoYW5uZWwgdG8gdGhlIHRvcCBoYWxmIGF0bGFzXG4gICAgICogQHByb3BlcnR5IFJHQl9BX1BWUlRDXzJCUFBWMVxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgUkdCX0FfUFZSVENfMkJQUFYxOiBDVVNUT01fUElYRUxfRk9STUFUKyssXG4gICAgLyoqXG4gICAgICogcmdiIDQgYnBwIHB2cnRjXG4gICAgICogQHByb3BlcnR5IFJHQl9QVlJUQ180QlBQVjFcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFJHQl9QVlJUQ180QlBQVjE6IGdmeC5URVhUVVJFX0ZNVF9SR0JfUFZSVENfNEJQUFYxLFxuICAgIC8qKlxuICAgICAqIHJnYmEgNCBicHAgcHZydGNcbiAgICAgKiBAcHJvcGVydHkgUkdCQV9QVlJUQ180QlBQVjFcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFJHQkFfUFZSVENfNEJQUFYxOiBnZnguVEVYVFVSRV9GTVRfUkdCQV9QVlJUQ180QlBQVjEsXG4gICAgLyoqXG4gICAgICogcmdiIGEgNCBicHAgcHZydGNcbiAgICAgKiBSR0JfQV9QVlJUQ180QlBQVjEgdGV4dHVyZSBpcyBhIDJ4IGhlaWdodCBSR0JfUFZSVENfNEJQUFYxIGZvcm1hdCB0ZXh0dXJlLlxuICAgICAqIEl0IHNlcGFyYXRlIHRoZSBvcmlnaW4gYWxwaGEgY2hhbm5lbCB0byB0aGUgYm90dG9tIGhhbGYgYXRsYXMsIHRoZSBvcmlnaW4gcmdiIGNoYW5uZWwgdG8gdGhlIHRvcCBoYWxmIGF0bGFzXG4gICAgICogQHByb3BlcnR5IFJHQl9BX1BWUlRDXzRCUFBWMVxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgUkdCX0FfUFZSVENfNEJQUFYxOiBDVVNUT01fUElYRUxfRk9STUFUKyssXG4gICAgLyoqXG4gICAgICogcmdiIGV0YzFcbiAgICAgKiBAcHJvcGVydHkgUkdCX0VUQzFcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFJHQl9FVEMxOiBnZnguVEVYVFVSRV9GTVRfUkdCX0VUQzEsXG4gICAgLyoqXG4gICAgICogcmdiYSBldGMxXG4gICAgICogQHByb3BlcnR5IFJHQkFfRVRDMVxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgUkdCQV9FVEMxOiBDVVNUT01fUElYRUxfRk9STUFUKyssXG5cbiAgICAvKipcbiAgICAgKiByZ2IgZXRjMlxuICAgICAqIEBwcm9wZXJ0eSBSR0JfRVRDMlxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgUkdCX0VUQzI6IGdmeC5URVhUVVJFX0ZNVF9SR0JfRVRDMixcbiAgICAvKipcbiAgICAgKiByZ2JhIGV0YzJcbiAgICAgKiBAcHJvcGVydHkgUkdCQV9FVEMyXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBSR0JBX0VUQzI6IGdmeC5URVhUVVJFX0ZNVF9SR0JBX0VUQzIsXG59KTtcblxuLyoqXG4gKiBUaGUgdGV4dHVyZSB3cmFwIG1vZGVcbiAqIEBlbnVtIFRleHR1cmUyRC5XcmFwTW9kZVxuICovXG5jb25zdCBXcmFwTW9kZSA9IGNjLkVudW0oe1xuICAgIC8qKlxuICAgICAqIFRoZSBjb25zdGFudCB2YXJpYWJsZSBlcXVhbHMgZ2wuUkVQRUFUIGZvciB0ZXh0dXJlXG4gICAgICogQHByb3BlcnR5IFJFUEVBVFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgUkVQRUFUOiBHTF9SRVBFQVQsXG4gICAgLyoqXG4gICAgICogVGhlIGNvbnN0YW50IHZhcmlhYmxlIGVxdWFscyBnbC5DTEFNUF9UT19FREdFIGZvciB0ZXh0dXJlXG4gICAgICogQHByb3BlcnR5IENMQU1QX1RPX0VER0VcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIENMQU1QX1RPX0VER0U6IEdMX0NMQU1QX1RPX0VER0UsXG4gICAgLyoqXG4gICAgICogVGhlIGNvbnN0YW50IHZhcmlhYmxlIGVxdWFscyBnbC5NSVJST1JFRF9SRVBFQVQgZm9yIHRleHR1cmVcbiAgICAgKiBAcHJvcGVydHkgTUlSUk9SRURfUkVQRUFUXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBNSVJST1JFRF9SRVBFQVQ6IEdMX01JUlJPUkVEX1JFUEVBVFxufSk7XG5cbi8qKlxuICogVGhlIHRleHR1cmUgZmlsdGVyIG1vZGVcbiAqIEBlbnVtIFRleHR1cmUyRC5GaWx0ZXJcbiAqL1xuY29uc3QgRmlsdGVyID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogVGhlIGNvbnN0YW50IHZhcmlhYmxlIGVxdWFscyBnbC5MSU5FQVIgZm9yIHRleHR1cmVcbiAgICAgKiBAcHJvcGVydHkgTElORUFSXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBMSU5FQVI6IEdMX0xJTkVBUixcbiAgICAvKipcbiAgICAgKiBUaGUgY29uc3RhbnQgdmFyaWFibGUgZXF1YWxzIGdsLk5FQVJFU1QgZm9yIHRleHR1cmVcbiAgICAgKiBAcHJvcGVydHkgTkVBUkVTVFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgTkVBUkVTVDogR0xfTkVBUkVTVFxufSk7XG5cbmNvbnN0IEZpbHRlckluZGV4ID0ge1xuICAgIDk3Mjg6IDAsIC8vIEdMX05FQVJFU1RcbiAgICA5NzI5OiAxLCAvLyBHTF9MSU5FQVJcbn07XG5cbmxldCBfaW1hZ2VzID0gW107XG5sZXQgX3NoYXJlZE9wdHMgPSB7XG4gICAgd2lkdGg6IHVuZGVmaW5lZCxcbiAgICBoZWlnaHQ6IHVuZGVmaW5lZCxcbiAgICBtaW5GaWx0ZXI6IHVuZGVmaW5lZCxcbiAgICBtYWdGaWx0ZXI6IHVuZGVmaW5lZCxcbiAgICB3cmFwUzogdW5kZWZpbmVkLFxuICAgIHdyYXBUOiB1bmRlZmluZWQsXG4gICAgZm9ybWF0OiB1bmRlZmluZWQsXG4gICAgZ2VuTWlwbWFwczogdW5kZWZpbmVkLFxuICAgIGltYWdlczogdW5kZWZpbmVkLFxuICAgIGltYWdlOiB1bmRlZmluZWQsXG4gICAgZmxpcFk6IHVuZGVmaW5lZCxcbiAgICBwcmVtdWx0aXBseUFscGhhOiB1bmRlZmluZWRcbn07XG5mdW5jdGlvbiBfZ2V0U2hhcmVkT3B0aW9ucyAoKSB7XG4gICAgZm9yICh2YXIga2V5IGluIF9zaGFyZWRPcHRzKSB7XG4gICAgICAgIF9zaGFyZWRPcHRzW2tleV0gPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIF9pbWFnZXMubGVuZ3RoID0gMDtcbiAgICBfc2hhcmVkT3B0cy5pbWFnZXMgPSBfaW1hZ2VzO1xuICAgIF9zaGFyZWRPcHRzLmZsaXBZID0gZmFsc2U7XG4gICAgcmV0dXJuIF9zaGFyZWRPcHRzO1xufVxuXG4vKipcbiAqIFRoaXMgY2xhc3MgYWxsb3dzIHRvIGVhc2lseSBjcmVhdGUgT3BlbkdMIG9yIENhbnZhcyAyRCB0ZXh0dXJlcyBmcm9tIGltYWdlcyBvciByYXcgZGF0YS5cbiAqXG4gKiBAY2xhc3MgVGV4dHVyZTJEXG4gKiBAdXNlcyBFdmVudFRhcmdldFxuICogQGV4dGVuZHMgQXNzZXRcbiAqL1xudmFyIFRleHR1cmUyRCA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuVGV4dHVyZTJEJyxcbiAgICBleHRlbmRzOiByZXF1aXJlKCcuLi9hc3NldHMvQ0NBc3NldCcpLFxuICAgIG1peGluczogW0V2ZW50VGFyZ2V0XSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgX25hdGl2ZUFzc2V0OiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIC8vIG1heWJlIHJldHVybmVkIHRvIHBvb2wgaW4gd2ViZ2xcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faW1hZ2U7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0IChkYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuX2NvbXByZXNzZWQgJiYgZGF0YS5fZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRXaXRoRGF0YShkYXRhLl9kYXRhLCB0aGlzLl9mb3JtYXQsIGRhdGEud2lkdGgsIGRhdGEuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdFdpdGhFbGVtZW50KGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvdmVycmlkZTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBfZm9ybWF0OiBQaXhlbEZvcm1hdC5SR0JBODg4OCxcbiAgICAgICAgX3ByZW11bHRpcGx5QWxwaGE6IGZhbHNlLFxuICAgICAgICBfZmxpcFk6IGZhbHNlLFxuICAgICAgICBfbWluRmlsdGVyOiBGaWx0ZXIuTElORUFSLFxuICAgICAgICBfbWFnRmlsdGVyOiBGaWx0ZXIuTElORUFSLFxuICAgICAgICBfbWlwRmlsdGVyOiBGaWx0ZXIuTElORUFSLFxuICAgICAgICBfd3JhcFM6IFdyYXBNb2RlLkNMQU1QX1RPX0VER0UsXG4gICAgICAgIF93cmFwVDogV3JhcE1vZGUuQ0xBTVBfVE9fRURHRSxcblxuICAgICAgICBfZ2VuTWlwbWFwczogZmFsc2UsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFNldHMgd2hldGhlciBnZW5lcmF0ZSBtaXBtYXBzIGZvciB0aGUgdGV4dHVyZVxuICAgICAgICAgKiAhI3poIOaYr+WQpuS4uue6ueeQhuiuvue9rueUn+aIkCBtaXBtYXBz44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZ2VuTWlwbWFwc1xuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgZ2VuTWlwbWFwczoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2VuTWlwbWFwcztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKGdlbk1pcG1hcHMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZ2VuTWlwbWFwcyAhPT0gZ2VuTWlwbWFwcykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3B0cyA9IF9nZXRTaGFyZWRPcHRpb25zKCk7XG4gICAgICAgICAgICAgICAgICAgIG9wdHMuZ2VuTWlwbWFwcyA9IGdlbk1pcG1hcHM7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKG9wdHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfcGFja2FibGU6IHRydWUsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFxuICAgICAgICAgKiBTZXRzIHdoZXRoZXIgdGV4dHVyZSBjYW4gYmUgcGFja2VkIGludG8gdGV4dHVyZSBhdGxhcy5cbiAgICAgICAgICogSWYgbmVlZCB1c2UgdGV4dHVyZSB1diBpbiBjdXN0b20gRWZmZWN0LCBwbGVhc2Ugc2V0cyBwYWNrYWJsZSB0byBmYWxzZS5cbiAgICAgICAgICogISN6aCBcbiAgICAgICAgICog6K6+572u57q555CG5piv5ZCm5YWB6K645Y+C5LiO5ZCI5Zu+44CCXG4gICAgICAgICAqIOWmguaenOmcgOimgeWcqOiHquWumuS5iSBFZmZlY3Qg5Lit5L2/55So57q555CGIFVW77yM6ZyA6KaB56aB5q2i6K+l6YCJ6aG544CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gcGFja2FibGVcbiAgICAgICAgICogQGRlZmF1bHQgdHJ1ZVxuICAgICAgICAgKi9cbiAgICAgICAgcGFja2FibGU6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhY2thYmxlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGFja2FibGUgPSB2YWw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RhdGljczoge1xuICAgICAgICBQaXhlbEZvcm1hdDogUGl4ZWxGb3JtYXQsXG4gICAgICAgIFdyYXBNb2RlOiBXcmFwTW9kZSxcbiAgICAgICAgRmlsdGVyOiBGaWx0ZXIsXG4gICAgICAgIF9GaWx0ZXJJbmRleDogRmlsdGVySW5kZXgsXG5cbiAgICAgICAgLy8gcHJlZGVmaW5lZCBtb3N0IGNvbW1vbiBleHRuYW1lc1xuICAgICAgICBleHRuYW1lczogWycucG5nJywgJy5qcGcnLCAnLmpwZWcnLCAnLmJtcCcsICcud2VicCcsICcucHZyJywgJy5wa20nXSxcbiAgICB9LFxuXG4gICAgY3RvciAoKSB7XG4gICAgICAgIC8vIElkIGZvciBnZW5lcmF0ZSBoYXNoIGluIG1hdGVyaWFsXG4gICAgICAgIHRoaXMuX2lkID0gaWRHZW5lcmF0ZXIuZ2V0TmV3SWQoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBXaGV0aGVyIHRoZSB0ZXh0dXJlIGlzIGxvYWRlZCBvciBub3RcbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDotLTlm77mmK/lkKblt7Lnu4/miJDlip/liqDovb1cbiAgICAgICAgICogQHByb3BlcnR5IGxvYWRlZFxuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMubG9hZGVkID0gZmFsc2U7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRleHR1cmUgd2lkdGggaW4gcGl4ZWxcbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDotLTlm77lg4/ntKDlrr3luqZcbiAgICAgICAgICogQHByb3BlcnR5IHdpZHRoXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLndpZHRoID0gMDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGV4dHVyZSBoZWlnaHQgaW4gcGl4ZWxcbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDotLTlm77lg4/ntKDpq5jluqZcbiAgICAgICAgICogQHByb3BlcnR5IGhlaWdodFxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5oZWlnaHQgPSAwO1xuXG4gICAgICAgIHRoaXMuX2hhc2hEaXJ0eSA9IHRydWU7XG4gICAgICAgIHRoaXMuX2hhc2ggPSAwO1xuICAgICAgICB0aGlzLl90ZXh0dXJlID0gbnVsbDtcbiAgICAgICAgXG4gICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHRoaXMuX2V4cG9ydGVkRXh0cyA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldCByZW5kZXJlciB0ZXh0dXJlIGltcGxlbWVudGF0aW9uIG9iamVjdFxuICAgICAqIGV4dGVuZGVkIGZyb20gcmVuZGVyLlRleHR1cmUyRFxuICAgICAqICEjemggIOi/lOWbnua4suafk+WZqOWGhemDqOi0tOWbvuWvueixoVxuICAgICAqIEBtZXRob2QgZ2V0SW1wbFxuICAgICAqL1xuICAgIGdldEltcGwgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGV4dHVyZTtcbiAgICB9LFxuXG4gICAgZ2V0SWQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faWQ7XG4gICAgfSxcblxuICAgIHRvU3RyaW5nICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXJsIHx8ICcnO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgdGV4dHVyZSBvcHRpb25zLCBub3QgYXZhaWxhYmxlIGluIENhbnZhcyByZW5kZXIgbW9kZS5cbiAgICAgKiBpbWFnZSwgZm9ybWF0LCBwcmVtdWx0aXBseUFscGhhIGNhbiBub3QgYmUgdXBkYXRlZCBpbiBuYXRpdmUuXG4gICAgICogQG1ldGhvZCB1cGRhdGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgICAqIEBwYXJhbSB7RE9NSW1hZ2VFbGVtZW50fSBvcHRpb25zLmltYWdlXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBvcHRpb25zLmdlbk1pcG1hcHNcbiAgICAgKiBAcGFyYW0ge1BpeGVsRm9ybWF0fSBvcHRpb25zLmZvcm1hdFxuICAgICAqIEBwYXJhbSB7RmlsdGVyfSBvcHRpb25zLm1pbkZpbHRlclxuICAgICAqIEBwYXJhbSB7RmlsdGVyfSBvcHRpb25zLm1hZ0ZpbHRlclxuICAgICAqIEBwYXJhbSB7V3JhcE1vZGV9IG9wdGlvbnMud3JhcFNcbiAgICAgKiBAcGFyYW0ge1dyYXBNb2RlfSBvcHRpb25zLndyYXBUXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBvcHRpb25zLnByZW11bHRpcGx5QWxwaGFcbiAgICAgKi9cbiAgICB1cGRhdGUgKG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGxldCB1cGRhdGVJbWcgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLndpZHRoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoID0gb3B0aW9ucy53aWR0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmhlaWdodCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSBvcHRpb25zLmhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLm1pbkZpbHRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWluRmlsdGVyID0gb3B0aW9ucy5taW5GaWx0ZXI7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5taW5GaWx0ZXIgPSBGaWx0ZXJJbmRleFtvcHRpb25zLm1pbkZpbHRlcl07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5tYWdGaWx0ZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX21hZ0ZpbHRlciA9IG9wdGlvbnMubWFnRmlsdGVyO1xuICAgICAgICAgICAgICAgIG9wdGlvbnMubWFnRmlsdGVyID0gRmlsdGVySW5kZXhbb3B0aW9ucy5tYWdGaWx0ZXJdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMubWlwRmlsdGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9taXBGaWx0ZXIgPSBvcHRpb25zLm1pcEZpbHRlcjtcbiAgICAgICAgICAgICAgICBvcHRpb25zLm1pcEZpbHRlciA9IEZpbHRlckluZGV4W29wdGlvbnMubWlwRmlsdGVyXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLndyYXBTICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl93cmFwUyA9IG9wdGlvbnMud3JhcFM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0aW9ucy53cmFwVCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fd3JhcFQgPSBvcHRpb25zLndyYXBUO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZm9ybWF0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JtYXQgPSBvcHRpb25zLmZvcm1hdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmZsaXBZICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9mbGlwWSA9IG9wdGlvbnMuZmxpcFk7XG4gICAgICAgICAgICAgICAgdXBkYXRlSW1nID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLnByZW11bHRpcGx5QWxwaGEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3ByZW11bHRpcGx5QWxwaGEgPSBvcHRpb25zLnByZW11bHRpcGx5QWxwaGE7XG4gICAgICAgICAgICAgICAgdXBkYXRlSW1nID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmdlbk1pcG1hcHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2dlbk1pcG1hcHMgPSBvcHRpb25zLmdlbk1pcG1hcHM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh1cGRhdGVJbWcgJiYgdGhpcy5faW1hZ2UpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLmltYWdlID0gdGhpcy5faW1hZ2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5pbWFnZXMgJiYgb3B0aW9ucy5pbWFnZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2ltYWdlID0gb3B0aW9ucy5pbWFnZXNbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChvcHRpb25zLmltYWdlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pbWFnZSA9IG9wdGlvbnMuaW1hZ2U7XG4gICAgICAgICAgICAgICAgaWYgKCFvcHRpb25zLmltYWdlcykge1xuICAgICAgICAgICAgICAgICAgICBfaW1hZ2VzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuaW1hZ2VzID0gX2ltYWdlcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gd2ViZ2wgdGV4dHVyZSAyZCB1c2VzIGltYWdlc1xuICAgICAgICAgICAgICAgIG9wdGlvbnMuaW1hZ2VzLnB1c2gob3B0aW9ucy5pbWFnZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmltYWdlcyAmJiBvcHRpb25zLmltYWdlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdGV4dHVyZS51cGRhdGUob3B0aW9ucyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2hhc2hEaXJ0eSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEluaXQgd2l0aCBIVE1MIGVsZW1lbnQuXG4gICAgICogISN6aCDnlKggSFRNTCBJbWFnZSDmiJYgQ2FudmFzIOWvueixoeWIneWni+WMlui0tOWbvuOAglxuICAgICAqIEBtZXRob2QgaW5pdFdpdGhFbGVtZW50XG4gICAgICogQHBhcmFtIHtIVE1MSW1hZ2VFbGVtZW50fEhUTUxDYW52YXNFbGVtZW50fSBlbGVtZW50XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICogaW1nLnNyYyA9IGRhdGFVUkw7XG4gICAgICogdGV4dHVyZS5pbml0V2l0aEVsZW1lbnQoaW1nKTtcbiAgICAgKi9cbiAgICBpbml0V2l0aEVsZW1lbnQgKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKCFlbGVtZW50KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLl9pbWFnZSA9IGVsZW1lbnQ7XG4gICAgICAgIGlmIChlbGVtZW50LmNvbXBsZXRlIHx8IGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MQ2FudmFzRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVMb2FkZWRUZXh0dXJlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5oYW5kbGVMb2FkZWRUZXh0dXJlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybklEKDMxMTksIGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBJbnRpYWxpemVzIHdpdGggYSB0ZXh0dXJlMmQgd2l0aCBkYXRhIGluIFVpbnQ4QXJyYXkuXG4gICAgICogISN6aCDkvb/nlKjkuIDkuKrlrZjlgqjlnKggVW5pdDhBcnJheSDkuK3nmoTlm77lg4/mlbDmja7vvIhyYXcgZGF0Ye+8ieWIneWni+WMluaVsOaNruOAglxuICAgICAqIEBtZXRob2QgaW5pdFdpdGhEYXRhXG4gICAgICogQHBhcmFtIHtUeXBlZEFycmF5fSBkYXRhXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHBpeGVsRm9ybWF0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHBpeGVsc1dpZHRoXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHBpeGVsc0hlaWdodFxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaW5pdFdpdGhEYXRhIChkYXRhLCBwaXhlbEZvcm1hdCwgcGl4ZWxzV2lkdGgsIHBpeGVsc0hlaWdodCkge1xuICAgICAgICB2YXIgb3B0cyA9IF9nZXRTaGFyZWRPcHRpb25zKCk7XG4gICAgICAgIG9wdHMuaW1hZ2UgPSBkYXRhO1xuICAgICAgICAvLyB3ZWJnbCB0ZXh0dXJlIDJkIHVzZXMgaW1hZ2VzXG4gICAgICAgIG9wdHMuaW1hZ2VzID0gW29wdHMuaW1hZ2VdO1xuICAgICAgICBvcHRzLmdlbk1pcG1hcHMgPSB0aGlzLl9nZW5NaXBtYXBzO1xuICAgICAgICBvcHRzLnByZW11bHRpcGx5QWxwaGEgPSB0aGlzLl9wcmVtdWx0aXBseUFscGhhO1xuICAgICAgICBvcHRzLmZsaXBZID0gdGhpcy5fZmxpcFk7XG4gICAgICAgIG9wdHMubWluRmlsdGVyID0gRmlsdGVySW5kZXhbdGhpcy5fbWluRmlsdGVyXTtcbiAgICAgICAgb3B0cy5tYWdGaWx0ZXIgPSBGaWx0ZXJJbmRleFt0aGlzLl9tYWdGaWx0ZXJdO1xuICAgICAgICBvcHRzLndyYXBTID0gdGhpcy5fd3JhcFM7XG4gICAgICAgIG9wdHMud3JhcFQgPSB0aGlzLl93cmFwVDtcbiAgICAgICAgb3B0cy5mb3JtYXQgPSB0aGlzLl9nZXRHRlhQaXhlbEZvcm1hdChwaXhlbEZvcm1hdCk7XG4gICAgICAgIG9wdHMud2lkdGggPSBwaXhlbHNXaWR0aDtcbiAgICAgICAgb3B0cy5oZWlnaHQgPSBwaXhlbHNIZWlnaHQ7XG4gICAgICAgIGlmICghdGhpcy5fdGV4dHVyZSkge1xuICAgICAgICAgICAgdGhpcy5fdGV4dHVyZSA9IG5ldyByZW5kZXJlci5UZXh0dXJlMkQocmVuZGVyZXIuZGV2aWNlLCBvcHRzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3RleHR1cmUudXBkYXRlKG9wdHMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMud2lkdGggPSBwaXhlbHNXaWR0aDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBwaXhlbHNIZWlnaHQ7XG5cbiAgICAgICAgdGhpcy5fY2hlY2tQYWNrYWJsZSgpO1xuXG4gICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5lbWl0KFwibG9hZFwiKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBIVE1MRWxlbWVudCBPYmplY3QgZ2V0dGVyLCBhdmFpbGFibGUgb25seSBvbiB3ZWIuPGJyLz5cbiAgICAgKiBOb3RlOiB0ZXh0dXJlIGlzIHBhY2tlZCBpbnRvIHRleHR1cmUgYXRsYXMgYnkgZGVmYXVsdDxici8+XG4gICAgICogeW91IHNob3VsZCBzZXQgdGV4dHVyZS5wYWNrYWJsZSBhcyBmYWxzZSBiZWZvcmUgZ2V0dGluZyBIdG1sIGVsZW1lbnQgb2JqZWN0LlxuICAgICAqICEjemgg6I635Y+W5b2T5YmN6LS05Zu+5a+55bqU55qEIEhUTUwgSW1hZ2Ug5oiWIENhbnZhcyDlr7nosaHvvIzlj6rlnKggV2ViIOW5s+WPsOS4i+acieaViOOAgjxici8+XG4gICAgICog5rOo5oSP77yaPGJyLz5cbiAgICAgKiB0ZXh0dXJlIOm7mOiupOWPguS4juWKqOaAgeWQiOWbvu+8jOWmguaenOmcgOimgeiOt+WPluWIsOato+ehrueahCBIdG1sIOWFg+e0oOWvueixoe+8jOmcgOimgeWFiOiuvue9riB0ZXh0dXJlLnBhY2thYmxlIOS4uiBmYWxzZVxuICAgICAqIEBtZXRob2QgZ2V0SHRtbEVsZW1lbnRPYmpcbiAgICAgKiBAcmV0dXJuIHtIVE1MSW1hZ2VFbGVtZW50fEhUTUxDYW52YXNFbGVtZW50fVxuICAgICAqL1xuICAgIGdldEh0bWxFbGVtZW50T2JqICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ltYWdlO1xuICAgIH0sXG4gICAgXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIERlc3RvcnkgdGhpcyB0ZXh0dXJlIGFuZCBpbW1lZGlhdGVseSByZWxlYXNlIGl0cyB2aWRlbyBtZW1vcnkuIChJbmhlcml0IGZyb20gY2MuT2JqZWN0LmRlc3Ryb3kpPGJyPlxuICAgICAqIEFmdGVyIGRlc3Ryb3ksIHRoaXMgb2JqZWN0IGlzIG5vdCB1c2FibGUgYW55IG1vcmUuXG4gICAgICogWW91IGNhbiB1c2UgY2MuaXNWYWxpZChvYmopIHRvIGNoZWNrIHdoZXRoZXIgdGhlIG9iamVjdCBpcyBkZXN0cm95ZWQgYmVmb3JlIGFjY2Vzc2luZyBpdC5cbiAgICAgKiAhI3poXG4gICAgICog6ZSA5q+B6K+l6LS05Zu+77yM5bm256uL5Y2z6YeK5pS+5a6D5a+55bqU55qE5pi+5a2Y44CC77yI57un5om/6IeqIGNjLk9iamVjdC5kZXN0cm9577yJPGJyLz5cbiAgICAgKiDplIDmr4HlkI7vvIzor6Xlr7nosaHkuI3lho3lj6/nlKjjgILmgqjlj6/ku6XlnKjorr/pl67lr7nosaHkuYvliY3kvb/nlKggY2MuaXNWYWxpZChvYmopIOadpeajgOafpeWvueixoeaYr+WQpuW3suiiq+mUgOavgeOAglxuICAgICAqIEBtZXRob2QgZGVzdHJveVxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IGluaGVyaXQgZnJvbSB0aGUgQ0NPYmplY3RcbiAgICAgKi9cbiAgICBkZXN0cm95ICgpIHtcbiAgICAgICAgdGhpcy5fcGFja2FibGUgJiYgY2MuZHluYW1pY0F0bGFzTWFuYWdlciAmJiBjYy5keW5hbWljQXRsYXNNYW5hZ2VyLmRlbGV0ZUF0bGFzVGV4dHVyZSh0aGlzKTtcblxuICAgICAgICB0aGlzLl9pbWFnZSA9IG51bGw7XG4gICAgICAgIHRoaXMuX3RleHR1cmUgJiYgdGhpcy5fdGV4dHVyZS5kZXN0cm95KCk7XG4gICAgICAgIC8vIFRPRE8gY2MudGV4dHVyZVV0aWwgP1xuICAgICAgICAvLyBjYy50ZXh0dXJlQ2FjaGUucmVtb3ZlVGV4dHVyZUZvcktleSh0aGlzLnVybCk7ICAvLyBpdGVtLnJhd1VybCB8fCBpdGVtLnVybFxuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUGl4ZWwgZm9ybWF0IG9mIHRoZSB0ZXh0dXJlLlxuICAgICAqICEjemgg6I635Y+W57q555CG55qE5YOP57Sg5qC85byP44CCXG4gICAgICogQG1ldGhvZCBnZXRQaXhlbEZvcm1hdFxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRQaXhlbEZvcm1hdCAoKSB7XG4gICAgICAgIC8vc3VwcG9ydCBvbmx5IGluIFdlYkdsIHJlbmRlcmluZyBtb2RlXG4gICAgICAgIHJldHVybiB0aGlzLl9mb3JtYXQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBXaGV0aGVyIG9yIG5vdCB0aGUgdGV4dHVyZSBoYXMgdGhlaXIgQWxwaGEgcHJlbXVsdGlwbGllZC5cbiAgICAgKiAhI3poIOajgOafpee6ueeQhuWcqOS4iuS8oCBHUFUg5pe26aKE5LmY6YCJ6aG55piv5ZCm5byA5ZCv44CCXG4gICAgICogQG1ldGhvZCBoYXNQcmVtdWx0aXBsaWVkQWxwaGFcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGhhc1ByZW11bHRpcGxpZWRBbHBoYSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcmVtdWx0aXBseUFscGhhIHx8IGZhbHNlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogSGFuZGxlciBvZiB0ZXh0dXJlIGxvYWRlZCBldmVudC5cbiAgICAgKiBTaW5jZSB2Mi4wLCB5b3UgZG9uJ3QgbmVlZCB0byBpbnZva2UgdGhpcyBmdW5jdGlvbiwgaXQgd2lsbCBiZSBpbnZva2VkIGF1dG9tYXRpY2FsbHkgYWZ0ZXIgdGV4dHVyZSBsb2FkZWQuXG4gICAgICogISN6aCDotLTlm77liqDovb3kuovku7blpITnkIblmajjgIJ2Mi4wIOS5i+WQjuS9oOWwhuS4jeWcqOmcgOimgeaJi+WKqOaJp+ihjOi/meS4quWHveaVsO+8jOWug+S8muWcqOi0tOWbvuWKoOi9veaIkOWKn+S5i+WQjuiHquWKqOaJp+ihjOOAglxuICAgICAqIEBtZXRob2QgaGFuZGxlTG9hZGVkVGV4dHVyZVxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3ByZW11bHRpcGxpZWRdXG4gICAgICovXG4gICAgaGFuZGxlTG9hZGVkVGV4dHVyZSAoKSB7XG4gICAgICAgIGlmICghdGhpcy5faW1hZ2UgfHwgIXRoaXMuX2ltYWdlLndpZHRoIHx8ICF0aGlzLl9pbWFnZS5oZWlnaHQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIFxuICAgICAgICB0aGlzLndpZHRoID0gdGhpcy5faW1hZ2Uud2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5faW1hZ2UuaGVpZ2h0O1xuICAgICAgICBsZXQgb3B0cyA9IF9nZXRTaGFyZWRPcHRpb25zKCk7XG4gICAgICAgIG9wdHMuaW1hZ2UgPSB0aGlzLl9pbWFnZTtcbiAgICAgICAgLy8gd2ViZ2wgdGV4dHVyZSAyZCB1c2VzIGltYWdlc1xuICAgICAgICBvcHRzLmltYWdlcyA9IFtvcHRzLmltYWdlXTtcbiAgICAgICAgb3B0cy53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgIG9wdHMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgICAgIG9wdHMuZ2VuTWlwbWFwcyA9IHRoaXMuX2dlbk1pcG1hcHM7XG4gICAgICAgIG9wdHMuZm9ybWF0ID0gdGhpcy5fZ2V0R0ZYUGl4ZWxGb3JtYXQodGhpcy5fZm9ybWF0KTtcbiAgICAgICAgb3B0cy5wcmVtdWx0aXBseUFscGhhID0gdGhpcy5fcHJlbXVsdGlwbHlBbHBoYTtcbiAgICAgICAgb3B0cy5mbGlwWSA9IHRoaXMuX2ZsaXBZO1xuICAgICAgICBvcHRzLm1pbkZpbHRlciA9IEZpbHRlckluZGV4W3RoaXMuX21pbkZpbHRlcl07XG4gICAgICAgIG9wdHMubWFnRmlsdGVyID0gRmlsdGVySW5kZXhbdGhpcy5fbWFnRmlsdGVyXTtcbiAgICAgICAgb3B0cy53cmFwUyA9IHRoaXMuX3dyYXBTO1xuICAgICAgICBvcHRzLndyYXBUID0gdGhpcy5fd3JhcFQ7XG4gICAgICAgIFxuICAgICAgICBpZiAoIXRoaXMuX3RleHR1cmUpIHtcbiAgICAgICAgICAgIHRoaXMuX3RleHR1cmUgPSBuZXcgcmVuZGVyZXIuVGV4dHVyZTJEKHJlbmRlcmVyLmRldmljZSwgb3B0cyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl90ZXh0dXJlLnVwZGF0ZShvcHRzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2NoZWNrUGFja2FibGUoKTtcblxuICAgICAgICAvL2Rpc3BhdGNoIGxvYWQgZXZlbnQgdG8gbGlzdGVuZXIuXG4gICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5lbWl0KFwibG9hZFwiKTtcblxuICAgICAgICBpZiAoY2MubWFjcm8uQ0xFQU5VUF9JTUFHRV9DQUNIRSAmJiB0aGlzLl9pbWFnZSBpbnN0YW5jZW9mIEhUTUxJbWFnZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX2NsZWFySW1hZ2UoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogRGVzY3JpcHRpb24gb2YgY2MuVGV4dHVyZTJELlxuICAgICAqICEjemggY2MuVGV4dHVyZTJEIOaPj+i/sOOAglxuICAgICAqIEBtZXRob2QgZGVzY3JpcHRpb25cbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAgICAqL1xuICAgIGRlc2NyaXB0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiPGNjLlRleHR1cmUyRCB8IE5hbWUgPSBcIiArIHRoaXMudXJsICsgXCIgfCBEaW1lbnNpb25zID0gXCIgKyB0aGlzLndpZHRoICsgXCIgeCBcIiArIHRoaXMuaGVpZ2h0ICsgXCI+XCI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZWxlYXNlIHRleHR1cmUsIHBsZWFzZSB1c2UgZGVzdHJveSBpbnN0ZWFkLlxuICAgICAqICEjemgg6YeK5pS+57q555CG77yM6K+35L2/55SoIGRlc3Ryb3kg5pu/5Luj44CCXG4gICAgICogQG1ldGhvZCByZWxlYXNlVGV4dHVyZVxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjBcbiAgICAgKi9cbiAgICByZWxlYXNlVGV4dHVyZSAoKSB7XG4gICAgICAgIHRoaXMuX2ltYWdlID0gbnVsbDtcbiAgICAgICAgdGhpcy5fdGV4dHVyZSAmJiB0aGlzLl90ZXh0dXJlLmRlc3Ryb3koKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXRzIHRoZSB3cmFwIHMgYW5kIHdyYXAgdCBvcHRpb25zLiA8YnIvPlxuICAgICAqIElmIHRoZSB0ZXh0dXJlIHNpemUgaXMgTlBPVCAobm9uIHBvd2VyIG9mIDIpLCB0aGVuIGluIGNhbiBvbmx5IHVzZSBnbC5DTEFNUF9UT19FREdFIGluIGdsLlRFWFRVUkVfV1JBUF97UyxUfS5cbiAgICAgKiAhI3poIOiuvue9rue6ueeQhuWMheijheaooeW8j+OAglxuICAgICAqIOiLpee6ueeQhui0tOWbvuWwuuWvuOaYryBOUE9U77yIbm9uIHBvd2VyIG9mIDLvvInvvIzliJnlj6rog73kvb/nlKggVGV4dHVyZTJELldyYXBNb2RlLkNMQU1QX1RPX0VER0XjgIJcbiAgICAgKiBAbWV0aG9kIHNldFRleFBhcmFtZXRlcnNcbiAgICAgKiBAcGFyYW0ge1RleHR1cmUyRC5XcmFwTW9kZX0gd3JhcFNcbiAgICAgKiBAcGFyYW0ge1RleHR1cmUyRC5XcmFwTW9kZX0gd3JhcFRcbiAgICAgKi9cbiAgICBzZXRXcmFwTW9kZSAod3JhcFMsIHdyYXBUKSB7XG4gICAgICAgIGlmICh0aGlzLl93cmFwUyAhPT0gd3JhcFMgfHwgdGhpcy5fd3JhcFQgIT09IHdyYXBUKSB7XG4gICAgICAgICAgICB2YXIgb3B0cyA9IF9nZXRTaGFyZWRPcHRpb25zKCk7XG4gICAgICAgICAgICBvcHRzLndyYXBTID0gd3JhcFM7XG4gICAgICAgICAgICBvcHRzLndyYXBUID0gd3JhcFQ7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZShvcHRzKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgdGhlIG1pbkZpbHRlciBhbmQgbWFnRmlsdGVyIG9wdGlvbnNcbiAgICAgKiAhI3poIOiuvue9rue6ueeQhui0tOWbvue8qeWwj+WSjOaUvuWkp+i/h+a7pOWZqOeul+azlemAiemhueOAglxuICAgICAqIEBtZXRob2Qgc2V0RmlsdGVyc1xuICAgICAqIEBwYXJhbSB7VGV4dHVyZTJELkZpbHRlcn0gbWluRmlsdGVyXG4gICAgICogQHBhcmFtIHtUZXh0dXJlMkQuRmlsdGVyfSBtYWdGaWx0ZXJcbiAgICAgKi9cbiAgICBzZXRGaWx0ZXJzIChtaW5GaWx0ZXIsIG1hZ0ZpbHRlcikge1xuICAgICAgICBpZiAodGhpcy5fbWluRmlsdGVyICE9PSBtaW5GaWx0ZXIgfHwgdGhpcy5fbWFnRmlsdGVyICE9PSBtYWdGaWx0ZXIpIHtcbiAgICAgICAgICAgIHZhciBvcHRzID0gX2dldFNoYXJlZE9wdGlvbnMoKTtcbiAgICAgICAgICAgIG9wdHMubWluRmlsdGVyID0gbWluRmlsdGVyO1xuICAgICAgICAgICAgb3B0cy5tYWdGaWx0ZXIgPSBtYWdGaWx0ZXI7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZShvcHRzKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogU2V0cyB0aGUgZmxpcFkgb3B0aW9uc1xuICAgICAqICEjemgg6K6+572u6LS05Zu+55qE57q15ZCR57+76L2s6YCJ6aG544CCXG4gICAgICogQG1ldGhvZCBzZXRGbGlwWVxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gZmxpcFlcbiAgICAgKi9cbiAgICBzZXRGbGlwWSAoZmxpcFkpIHtcbiAgICAgICAgaWYgKHRoaXMuX2ZsaXBZICE9PSBmbGlwWSkge1xuICAgICAgICAgICAgdmFyIG9wdHMgPSBfZ2V0U2hhcmVkT3B0aW9ucygpO1xuICAgICAgICAgICAgb3B0cy5mbGlwWSA9IGZsaXBZO1xuICAgICAgICAgICAgdGhpcy51cGRhdGUob3B0cyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNldHMgdGhlIHByZW11bHRpcGx5IGFscGhhIG9wdGlvbnNcbiAgICAgKiAhI3poIOiuvue9rui0tOWbvueahOmihOS5mOmAiemhueOAglxuICAgICAqIEBtZXRob2Qgc2V0UHJlbXVsdGlwbHlBbHBoYVxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gcHJlbXVsdGlwbHlcbiAgICAgKi9cbiAgICBzZXRQcmVtdWx0aXBseUFscGhhIChwcmVtdWx0aXBseSkge1xuICAgICAgICBpZiAodGhpcy5fcHJlbXVsdGlwbHlBbHBoYSAhPT0gcHJlbXVsdGlwbHkpIHtcbiAgICAgICAgICAgIHZhciBvcHRzID0gX2dldFNoYXJlZE9wdGlvbnMoKTtcbiAgICAgICAgICAgIG9wdHMucHJlbXVsdGlwbHlBbHBoYSA9IHByZW11bHRpcGx5O1xuICAgICAgICAgICAgdGhpcy51cGRhdGUob3B0cyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2NoZWNrUGFja2FibGUgKCkge1xuICAgICAgICBsZXQgZHluYW1pY0F0bGFzID0gY2MuZHluYW1pY0F0bGFzTWFuYWdlcjtcbiAgICAgICAgaWYgKCFkeW5hbWljQXRsYXMpIHJldHVybjtcblxuICAgICAgICBpZiAodGhpcy5faXNDb21wcmVzc2VkKCkpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhY2thYmxlID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdyA9IHRoaXMud2lkdGgsIGggPSB0aGlzLmhlaWdodDtcbiAgICAgICAgaWYgKCF0aGlzLl9pbWFnZSB8fFxuICAgICAgICAgICAgdyA+IGR5bmFtaWNBdGxhcy5tYXhGcmFtZVNpemUgfHwgaCA+IGR5bmFtaWNBdGxhcy5tYXhGcmFtZVNpemUgfHwgXG4gICAgICAgICAgICB0aGlzLl9nZXRIYXNoKCkgIT09IGR5bmFtaWNBdGxhcy5BdGxhcy5ERUZBVUxUX0hBU0gpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhY2thYmxlID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5faW1hZ2UgJiYgdGhpcy5faW1hZ2UgaW5zdGFuY2VvZiBIVE1MQ2FudmFzRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5fcGFja2FibGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9nZXRPcHRzKCkge1xuICAgICAgICBsZXQgb3B0cyA9IF9nZXRTaGFyZWRPcHRpb25zKCk7XG4gICAgICAgIG9wdHMud2lkdGggPSB0aGlzLndpZHRoO1xuICAgICAgICBvcHRzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgICAgICBvcHRzLmdlbk1pcG1hcHMgPSB0aGlzLl9nZW5NaXBtYXBzO1xuICAgICAgICBvcHRzLmZvcm1hdCA9IHRoaXMuX2Zvcm1hdDtcbiAgICAgICAgb3B0cy5wcmVtdWx0aXBseUFscGhhID0gdGhpcy5fcHJlbXVsdGlwbHlBbHBoYTtcbiAgICAgICAgb3B0cy5hbmlzb3Ryb3B5ID0gdGhpcy5fYW5pc290cm9weTtcbiAgICAgICAgb3B0cy5mbGlwWSA9IHRoaXMuX2ZsaXBZO1xuICAgICAgICBvcHRzLm1pbkZpbHRlciA9IEZpbHRlckluZGV4W3RoaXMuX21pbkZpbHRlcl07XG4gICAgICAgIG9wdHMubWFnRmlsdGVyID0gRmlsdGVySW5kZXhbdGhpcy5fbWFnRmlsdGVyXTtcbiAgICAgICAgb3B0cy5taXBGaWx0ZXIgPSBGaWx0ZXJJbmRleFt0aGlzLl9taXBGaWx0ZXJdO1xuICAgICAgICBvcHRzLndyYXBTID0gdGhpcy5fd3JhcFM7XG4gICAgICAgIG9wdHMud3JhcFQgPSB0aGlzLl93cmFwVDtcbiAgICAgICAgcmV0dXJuIG9wdHM7XG4gICAgfSxcblxuICAgIF9nZXRHRlhQaXhlbEZvcm1hdCAoZm9ybWF0KSB7XG4gICAgICAgIGlmIChmb3JtYXQgPT09IFBpeGVsRm9ybWF0LlJHQkFfRVRDMSkge1xuICAgICAgICAgICAgZm9ybWF0ID0gUGl4ZWxGb3JtYXQuUkdCX0VUQzE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZm9ybWF0ID09PSBQaXhlbEZvcm1hdC5SR0JfQV9QVlJUQ180QlBQVjEpIHtcbiAgICAgICAgICAgIGZvcm1hdCA9IFBpeGVsRm9ybWF0LlJHQl9QVlJUQ180QlBQVjE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZm9ybWF0ID09PSBQaXhlbEZvcm1hdC5SR0JfQV9QVlJUQ18yQlBQVjEpIHtcbiAgICAgICAgICAgIGZvcm1hdCA9IFBpeGVsRm9ybWF0LlJHQl9QVlJUQ18yQlBQVjE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZvcm1hdDtcbiAgICB9LFxuXG4gICAgX3Jlc2V0VW5kZXJseWluZ01pcG1hcHMobWlwbWFwU291cmNlcykge1xuICAgICAgICBjb25zdCBvcHRzID0gdGhpcy5fZ2V0T3B0cygpO1xuICAgICAgICBvcHRzLmltYWdlcyA9IG1pcG1hcFNvdXJjZXMgfHwgW251bGxdO1xuICAgICAgICBpZiAoIXRoaXMuX3RleHR1cmUpIHtcbiAgICAgICAgICAgIHRoaXMuX3RleHR1cmUgPSBuZXcgcmVuZGVyZXIuVGV4dHVyZTJEKHJlbmRlcmVyLmRldmljZSwgb3B0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl90ZXh0dXJlLnVwZGF0ZShvcHRzKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBTRVJJQUxJWkFUSU9OXG5cbiAgICBfc2VyaWFsaXplOiAoQ0NfRURJVE9SIHx8IENDX1RFU1QpICYmIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IGV4dElkID0gXCJcIjtcbiAgICAgICAgbGV0IGV4cG9ydGVkRXh0cyA9IHRoaXMuX2V4cG9ydGVkRXh0cztcbiAgICAgICAgaWYgKCFleHBvcnRlZEV4dHMgJiYgdGhpcy5fbmF0aXZlKSB7XG4gICAgICAgICAgICBleHBvcnRlZEV4dHMgPSBbdGhpcy5fbmF0aXZlXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhwb3J0ZWRFeHRzKSB7XG4gICAgICAgICAgICBsZXQgZXh0cyA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBleHBvcnRlZEV4dHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgZXh0SWQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIGxldCBleHQgPSBleHBvcnRlZEV4dHNbaV07XG4gICAgICAgICAgICAgICAgaWYgKGV4dCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBleHRAZm9ybWF0XG4gICAgICAgICAgICAgICAgICAgIGxldCBleHRGb3JtYXQgPSBleHQuc3BsaXQoJ0AnKTtcbiAgICAgICAgICAgICAgICAgICAgZXh0SWQgPSBUZXh0dXJlMkQuZXh0bmFtZXMuaW5kZXhPZihleHRGb3JtYXRbMF0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXh0SWQgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHRJZCA9IGV4dDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZXh0Rm9ybWF0WzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHRJZCArPSAnQCcgKyBleHRGb3JtYXRbMV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZXh0cy5wdXNoKGV4dElkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGV4dElkID0gZXh0cy5qb2luKCdfJyk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGFzc2V0ID0gYCR7ZXh0SWR9LCR7dGhpcy5fbWluRmlsdGVyfSwke3RoaXMuX21hZ0ZpbHRlcn0sJHt0aGlzLl93cmFwU30sJHt0aGlzLl93cmFwVH0sYCArXG4gICAgICAgICAgICAgICAgICAgIGAke3RoaXMuX3ByZW11bHRpcGx5QWxwaGEgPyAxIDogMH0sJHt0aGlzLl9nZW5NaXBtYXBzID8gMSA6IDB9LCR7dGhpcy5fcGFja2FibGUgPyAxIDogMH1gO1xuICAgICAgICByZXR1cm4gYXNzZXQ7XG4gICAgfSxcblxuICAgIF9kZXNlcmlhbGl6ZTogZnVuY3Rpb24gKGRhdGEsIGhhbmRsZSkge1xuICAgICAgICBsZXQgZGV2aWNlID0gY2MucmVuZGVyZXIuZGV2aWNlO1xuXG4gICAgICAgIGxldCBmaWVsZHMgPSBkYXRhLnNwbGl0KCcsJyk7XG4gICAgICAgIC8vIGRlY29kZSBleHRuYW1lXG4gICAgICAgIGxldCBleHRJZFN0ciA9IGZpZWxkc1swXTtcbiAgICAgICAgaWYgKGV4dElkU3RyKSB7XG4gICAgICAgICAgICBsZXQgZXh0SWRzID0gZXh0SWRTdHIuc3BsaXQoJ18nKTtcblxuICAgICAgICAgICAgbGV0IGRlZmF1bHRFeHQgPSAnJztcbiAgICAgICAgICAgIGxldCBiZXN0RXh0ID0gJyc7XG4gICAgICAgICAgICBsZXQgYmVzdEluZGV4ID0gOTk5O1xuICAgICAgICAgICAgbGV0IGJlc3RGb3JtYXQgPSB0aGlzLl9mb3JtYXQ7XG4gICAgICAgICAgICBsZXQgU3VwcG9ydFRleHR1cmVGb3JtYXRzID0gY2MubWFjcm8uU1VQUE9SVF9URVhUVVJFX0ZPUk1BVFM7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV4dElkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBleHRGb3JtYXQgPSBleHRJZHNbaV0uc3BsaXQoJ0AnKTtcbiAgICAgICAgICAgICAgICBsZXQgdG1wRXh0ID0gZXh0Rm9ybWF0WzBdO1xuICAgICAgICAgICAgICAgIHRtcEV4dCA9IFRleHR1cmUyRC5leHRuYW1lc1t0bXBFeHQuY2hhckNvZGVBdCgwKSAtIENIQVJfQ09ERV8wXSB8fCB0bXBFeHQ7XG5cbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSBTdXBwb3J0VGV4dHVyZUZvcm1hdHMuaW5kZXhPZih0bXBFeHQpO1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEgJiYgaW5kZXggPCBiZXN0SW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGxldCB0bXBGb3JtYXQgPSBleHRGb3JtYXRbMV0gPyBwYXJzZUludChleHRGb3JtYXRbMV0pIDogdGhpcy5fZm9ybWF0O1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIHdoZXRoZXIgb3Igbm90IHN1cHBvcnQgY29tcHJlc3NlZCB0ZXh0dXJlXG4gICAgICAgICAgICAgICAgICAgIGlmICggdG1wRXh0ID09PSAnLnB2cicgJiYgIWRldmljZS5leHQoJ1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9wdnJ0YycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgodG1wRm9ybWF0ID09PSBQaXhlbEZvcm1hdC5SR0JfRVRDMSB8fCB0bXBGb3JtYXQgPT09IFBpeGVsRm9ybWF0LlJHQkFfRVRDMSkgJiYgIWRldmljZS5leHQoJ1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9ldGMxJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCh0bXBGb3JtYXQgPT09IFBpeGVsRm9ybWF0LlJHQl9FVEMyIHx8IHRtcEZvcm1hdCA9PT0gUGl4ZWxGb3JtYXQuUkdCQV9FVEMyKSAmJiAhZGV2aWNlLmV4dCgnV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX2V0YycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0bXBFeHQgPT09ICcud2VicCcgJiYgIWNjLnN5cy5jYXBhYmlsaXRpZXMud2VicCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBiZXN0SW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgYmVzdEV4dCA9IHRtcEV4dDtcbiAgICAgICAgICAgICAgICAgICAgYmVzdEZvcm1hdCA9IHRtcEZvcm1hdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoIWRlZmF1bHRFeHQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdEV4dCA9IHRtcEV4dDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChiZXN0RXh0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0UmF3QXNzZXQoYmVzdEV4dCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9ybWF0ID0gYmVzdEZvcm1hdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NldFJhd0Fzc2V0KGRlZmF1bHRFeHQpO1xuICAgICAgICAgICAgICAgIGNjLndhcm5JRCgzMTIwLCBoYW5kbGUuY3VzdG9tRW52LnVybCwgZGVmYXVsdEV4dCwgZGVmYXVsdEV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpZWxkcy5sZW5ndGggPT09IDgpIHtcbiAgICAgICAgICAgIC8vIGRlY29kZSBmaWx0ZXJzXG4gICAgICAgICAgICB0aGlzLl9taW5GaWx0ZXIgPSBwYXJzZUludChmaWVsZHNbMV0pO1xuICAgICAgICAgICAgdGhpcy5fbWFnRmlsdGVyID0gcGFyc2VJbnQoZmllbGRzWzJdKTtcbiAgICAgICAgICAgIC8vIGRlY29kZSB3cmFwc1xuICAgICAgICAgICAgdGhpcy5fd3JhcFMgPSBwYXJzZUludChmaWVsZHNbM10pO1xuICAgICAgICAgICAgdGhpcy5fd3JhcFQgPSBwYXJzZUludChmaWVsZHNbNF0pO1xuICAgICAgICAgICAgLy8gZGVjb2RlIHByZW11bHRpcGx5IGFscGhhXG4gICAgICAgICAgICB0aGlzLl9wcmVtdWx0aXBseUFscGhhID0gZmllbGRzWzVdLmNoYXJDb2RlQXQoMCkgPT09IENIQVJfQ09ERV8xO1xuICAgICAgICAgICAgdGhpcy5fZ2VuTWlwbWFwcyA9IGZpZWxkc1s2XS5jaGFyQ29kZUF0KDApID09PSBDSEFSX0NPREVfMTtcbiAgICAgICAgICAgIHRoaXMuX3BhY2thYmxlID0gZmllbGRzWzddLmNoYXJDb2RlQXQoMCkgPT09IENIQVJfQ09ERV8xO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9nZXRIYXNoICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9oYXNoRGlydHkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9oYXNoO1xuICAgICAgICB9XG4gICAgICAgIGxldCBnZW5NaXBtYXBzID0gdGhpcy5fZ2VuTWlwbWFwcyA/IDEgOiAwO1xuICAgICAgICBsZXQgcHJlbXVsdGlwbHlBbHBoYSA9IHRoaXMuX3ByZW11bHRpcGx5QWxwaGEgPyAxIDogMDtcbiAgICAgICAgbGV0IGZsaXBZID0gdGhpcy5fZmxpcFkgPyAxIDogMDtcbiAgICAgICAgbGV0IG1pbkZpbHRlciA9IHRoaXMuX21pbkZpbHRlciA9PT0gRmlsdGVyLkxJTkVBUiA/IDEgOiAyO1xuICAgICAgICBsZXQgbWFnRmlsdGVyID0gdGhpcy5fbWFnRmlsdGVyID09PSBGaWx0ZXIuTElORUFSID8gMSA6IDI7XG4gICAgICAgIGxldCB3cmFwUyA9IHRoaXMuX3dyYXBTID09PSBXcmFwTW9kZS5SRVBFQVQgPyAxIDogKHRoaXMuX3dyYXBTID09PSBXcmFwTW9kZS5DTEFNUF9UT19FREdFID8gMiA6IDMpO1xuICAgICAgICBsZXQgd3JhcFQgPSB0aGlzLl93cmFwVCA9PT0gV3JhcE1vZGUuUkVQRUFUID8gMSA6ICh0aGlzLl93cmFwVCA9PT0gV3JhcE1vZGUuQ0xBTVBfVE9fRURHRSA/IDIgOiAzKTtcbiAgICAgICAgbGV0IHBpeGVsRm9ybWF0ID0gdGhpcy5fZm9ybWF0O1xuICAgICAgICBsZXQgaW1hZ2UgPSB0aGlzLl9pbWFnZTtcbiAgICAgICAgaWYgKENDX0pTQiAmJiBpbWFnZSkge1xuICAgICAgICAgICAgaWYgKGltYWdlLl9nbEZvcm1hdCAmJiBpbWFnZS5fZ2xGb3JtYXQgIT09IEdMX1JHQkEpXG4gICAgICAgICAgICAgICAgcGl4ZWxGb3JtYXQgPSAwO1xuICAgICAgICAgICAgcHJlbXVsdGlwbHlBbHBoYSA9IGltYWdlLl9wcmVtdWx0aXBseUFscGhhID8gMSA6IDA7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9oYXNoID0gTnVtYmVyKGAke21pbkZpbHRlcn0ke21hZ0ZpbHRlcn0ke3BpeGVsRm9ybWF0fSR7d3JhcFN9JHt3cmFwVH0ke2dlbk1pcG1hcHN9JHtwcmVtdWx0aXBseUFscGhhfSR7ZmxpcFl9YCk7XG4gICAgICAgIHRoaXMuX2hhc2hEaXJ0eSA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gdGhpcy5faGFzaDtcbiAgICB9LFxuXG4gICAgX2lzQ29tcHJlc3NlZCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mb3JtYXQgPCBQaXhlbEZvcm1hdC5BOCB8fCB0aGlzLl9mb3JtYXQgPiBQaXhlbEZvcm1hdC5SR0JBMzJGO1xuICAgIH0sXG4gICAgXG4gICAgX2NsZWFySW1hZ2UgKCkge1xuICAgICAgICAvLyB3ZWNoYXQgZ2FtZSBwbGF0Zm9ybSB3aWxsIGNhY2hlIGltYWdlIHBhcnNlZCBkYXRhLCBcbiAgICAgICAgLy8gc28gaW1hZ2Ugd2lsbCBjb25zdW1lIG11Y2ggbW9yZSBtZW1vcnkgdGhhbiB3ZWIsIHJlbGVhc2luZyBpdFxuICAgICAgICAvLyBSZWxlYXNlIGltYWdlIGluIGxvYWRlciBjYWNoZVxuICAgICAgICAvLyBuYXRpdmUgaW1hZ2UgZWxlbWVudCBoYXMgbm90IGltYWdlLmlkLCByZWxlYXNlIGJ5IGltYWdlLnNyYy5cbiAgICAgICAgY2MubG9hZGVyLnJlbW92ZUl0ZW0odGhpcy5faW1hZ2UuaWQgfHwgdGhpcy5faW1hZ2Uuc3JjKTtcbiAgICAgICAgdGhpcy5faW1hZ2Uuc3JjID0gXCJcIjtcbiAgICB9XG59KTtcblxuLyoqXG4gKiAhI3poXG4gKiDlvZPor6XotYTmupDliqDovb3miJDlip/lkI7op6blj5Hor6Xkuovku7ZcbiAqICEjZW5cbiAqIFRoaXMgZXZlbnQgaXMgZW1pdHRlZCB3aGVuIHRoZSBhc3NldCBpcyBsb2FkZWRcbiAqXG4gKiBAZXZlbnQgbG9hZFxuICovXG5cbmNjLlRleHR1cmUyRCA9IG1vZHVsZS5leHBvcnRzID0gVGV4dHVyZTJEO1xuIl19