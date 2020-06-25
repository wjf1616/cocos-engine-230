
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCLabel.js';
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
var macro = require('../platform/CCMacro');

var RenderComponent = require('./CCRenderComponent');

var Material = require('../assets/material/CCMaterial');

var LabelFrame = require('../renderer/utils/label/label-frame');
/**
 * !#en Enum for text alignment.
 * !#zh 文本横向对齐类型
 * @enum Label.HorizontalAlign
 */

/**
 * !#en Alignment left for text.
 * !#zh 文本内容左对齐。
 * @property {Number} LEFT
 */

/**
 * !#en Alignment center for text.
 * !#zh 文本内容居中对齐。
 * @property {Number} CENTER
 */

/**
 * !#en Alignment right for text.
 * !#zh 文本内容右边对齐。
 * @property {Number} RIGHT
 */


var HorizontalAlign = macro.TextAlignment;
/**
 * !#en Enum for vertical text alignment.
 * !#zh 文本垂直对齐类型
 * @enum Label.VerticalAlign
 */

/**
 * !#en Vertical alignment top for text.
 * !#zh 文本顶部对齐。
 * @property {Number} TOP
 */

/**
 * !#en Vertical alignment center for text.
 * !#zh 文本居中对齐。
 * @property {Number} CENTER
 */

/**
 * !#en Vertical alignment bottom for text.
 * !#zh 文本底部对齐。
 * @property {Number} BOTTOM
 */

var VerticalAlign = macro.VerticalTextAlignment;
/**
 * !#en Enum for Overflow.
 * !#zh Overflow 类型
 * @enum Label.Overflow
 */

/**
 * !#en NONE.
 * !#zh 不做任何限制。
 * @property {Number} NONE
 */

/**
 * !#en In CLAMP mode, when label content goes out of the bounding box, it will be clipped.
 * !#zh CLAMP 模式中，当文本内容超出边界框时，多余的会被截断。
 * @property {Number} CLAMP
 */

/**
 * !#en In SHRINK mode, the font size will change dynamically to adapt the content size. This mode may takes up more CPU resources when the label is refreshed.
 * !#zh SHRINK 模式，字体大小会动态变化，以适应内容大小。这个模式在文本刷新的时候可能会占用较多 CPU 资源。
 * @property {Number} SHRINK
 */

/**
 * !#en In RESIZE_HEIGHT mode, you can only change the width of label and the height is changed automatically.
 * !#zh 在 RESIZE_HEIGHT 模式下，只能更改文本的宽度，高度是自动改变的。
 * @property {Number} RESIZE_HEIGHT
 */

var Overflow = cc.Enum({
  NONE: 0,
  CLAMP: 1,
  SHRINK: 2,
  RESIZE_HEIGHT: 3
});
/**
 * !#en Enum for font type.
 * !#zh Type 类型
 * @enum Label.Type
 */

/**
 * !#en The TTF font type.
 * !#zh TTF字体
 * @property {Number} TTF
 */

/**
 * !#en The bitmap font type.
 * !#zh 位图字体
 * @property {Number} BMFont
 */

/**
 * !#en The system font type.
 * !#zh 系统字体
 * @property {Number} SystemFont
 */

/**
 * !#en Enum for cache mode.
 * !#zh CacheMode 类型
 * @enum Label.CacheMode
 */

/**
* !#en Do not do any caching.
* !#zh 不做任何缓存。
* @property {Number} NONE
*/

/**
 * !#en In BITMAP mode, cache the label as a static image and add it to the dynamic atlas for batch rendering, and can batching with Sprites using broken images.
 * !#zh BITMAP 模式，将 label 缓存成静态图像并加入到动态图集，以便进行批次合并，可与使用碎图的 Sprite 进行合批（注：动态图集在 Chrome 以及微信小游戏暂时关闭，该功能无效）。
 * @property {Number} BITMAP
 */

/**
 * !#en In CHAR mode, split text into characters and cache characters into a dynamic atlas which the size of 2048*2048. 
 * !#zh CHAR 模式，将文本拆分为字符，并将字符缓存到一张单独的大小为 2048*2048 的图集中进行重复使用，不再使用动态图集（注：当图集满时将不再进行缓存，暂时不支持 SHRINK 自适应文本尺寸（后续完善））。
 * @property {Number} CHAR
 */

var CacheMode = cc.Enum({
  NONE: 0,
  BITMAP: 1,
  CHAR: 2
});
var BOLD_FLAG = 1 << 0;
var ITALIC_FLAG = 1 << 1;
var UNDERLINE_FLAG = 1 << 2;
/**
 * !#en The Label Component.
 * !#zh 文字标签组件
 * @class Label
 * @extends RenderComponent
 */

var Label = cc.Class({
  name: 'cc.Label',
  "extends": RenderComponent,
  ctor: function ctor() {
    if (CC_EDITOR) {
      this._userDefinedFont = null;
    }

    this._actualFontSize = 0;
    this._assemblerData = null;
    this._frame = null;
    this._ttfTexture = null;
    this._letterTexture = null;

    if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
      this._updateMaterial = this._updateMaterialCanvas;
    } else {
      this._updateMaterial = this._updateMaterialWebgl;
    }
  },
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.renderers/Label',
    help: 'i18n:COMPONENT.help_url.label',
    inspector: 'packages://inspector/inspectors/comps/label.js'
  },
  properties: {
    _useOriginalSize: true,

    /**
     * !#en Content string of label.
     * !#zh 标签显示的文本内容。
     * @property {String} string
     */
    _string: {
      "default": '',
      formerlySerializedAs: '_N$string'
    },
    string: {
      get: function get() {
        return this._string;
      },
      set: function set(value) {
        var oldValue = this._string;
        this._string = '' + value;

        if (this.string !== oldValue) {
          this.setVertsDirty();
        }

        this._checkStringEmpty();
      },
      multiline: true,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.string'
    },

    /**
     * !#en Horizontal Alignment of label.
     * !#zh 文本内容的水平对齐方式。
     * @property {Label.HorizontalAlign} horizontalAlign
     */
    horizontalAlign: {
      "default": HorizontalAlign.LEFT,
      type: HorizontalAlign,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.horizontal_align',
      notify: function notify(oldValue) {
        if (this.horizontalAlign === oldValue) return;
        this.setVertsDirty();
      },
      animatable: false
    },

    /**
     * !#en Vertical Alignment of label.
     * !#zh 文本内容的垂直对齐方式。
     * @property {Label.VerticalAlign} verticalAlign
     */
    verticalAlign: {
      "default": VerticalAlign.TOP,
      type: VerticalAlign,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.vertical_align',
      notify: function notify(oldValue) {
        if (this.verticalAlign === oldValue) return;
        this.setVertsDirty();
      },
      animatable: false
    },

    /**
     * !#en The actual rendering font size in shrink mode
     * !#zh SHRINK 模式下面文本实际渲染的字体大小
     * @property {Number} actualFontSize
     */
    actualFontSize: {
      displayName: 'Actual Font Size',
      animatable: false,
      readonly: true,
      get: function get() {
        return this._actualFontSize;
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.label.actualFontSize'
    },
    _fontSize: 40,

    /**
     * !#en Font size of label.
     * !#zh 文本字体大小。
     * @property {Number} fontSize
     */
    fontSize: {
      get: function get() {
        return this._fontSize;
      },
      set: function set(value) {
        if (this._fontSize === value) return;
        this._fontSize = value;
        this.setVertsDirty();
      },
      range: [0, 512],
      tooltip: CC_DEV && 'i18n:COMPONENT.label.font_size'
    },

    /**
     * !#en Font family of label, only take effect when useSystemFont property is true.
     * !#zh 文本字体名称, 只在 useSystemFont 属性为 true 的时候生效。
     * @property {String} fontFamily
     */
    fontFamily: {
      "default": "Arial",
      tooltip: CC_DEV && 'i18n:COMPONENT.label.font_family',
      notify: function notify(oldValue) {
        if (this.fontFamily === oldValue) return;
        this.setVertsDirty();
      },
      animatable: false
    },
    _lineHeight: 40,

    /**
     * !#en Line Height of label.
     * !#zh 文本行高。
     * @property {Number} lineHeight
     */
    lineHeight: {
      get: function get() {
        return this._lineHeight;
      },
      set: function set(value) {
        if (this._lineHeight === value) return;
        this._lineHeight = value;
        this.setVertsDirty();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.label.line_height'
    },

    /**
     * !#en Overflow of label.
     * !#zh 文字显示超出范围时的处理方式。
     * @property {Label.Overflow} overflow
     */
    overflow: {
      "default": Overflow.NONE,
      type: Overflow,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.overflow',
      notify: function notify(oldValue) {
        if (this.overflow === oldValue) return;
        this.setVertsDirty();
      },
      animatable: false
    },
    _enableWrapText: true,

    /**
     * !#en Whether auto wrap label when string width is large than label width.
     * !#zh 是否自动换行。
     * @property {Boolean} enableWrapText
     */
    enableWrapText: {
      get: function get() {
        return this._enableWrapText;
      },
      set: function set(value) {
        if (this._enableWrapText === value) return;
        this._enableWrapText = value;
        this.setVertsDirty();
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.wrap'
    },
    // 这个保存了旧项目的 file 数据
    _N$file: null,

    /**
     * !#en The font of label.
     * !#zh 文本字体。
     * @property {Font} font
     */
    font: {
      get: function get() {
        return this._N$file;
      },
      set: function set(value) {
        if (this.font === value) return; //if delete the font, we should change isSystemFontUsed to true

        if (!value) {
          this._isSystemFontUsed = true;
        }

        if (CC_EDITOR && value) {
          this._userDefinedFont = value;
        }

        this._N$file = value;
        if (value && this._isSystemFontUsed) this._isSystemFontUsed = false;

        if (typeof value === 'string') {
          cc.warnID(4000);
        }

        this._resetAssembler();

        this._applyFontTexture();

        this.setVertsDirty();
      },
      type: cc.Font,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.font',
      animatable: false
    },
    _isSystemFontUsed: true,

    /**
     * !#en Whether use system font name or not.
     * !#zh 是否使用系统字体。
     * @property {Boolean} useSystemFont
     */
    useSystemFont: {
      get: function get() {
        return this._isSystemFontUsed;
      },
      set: function set(value) {
        if (this._isSystemFontUsed === value) return;
        this._isSystemFontUsed = !!value;

        if (CC_EDITOR) {
          if (!value && this._userDefinedFont) {
            this.font = this._userDefinedFont;
            this.spacingX = this._spacingX;
            return;
          }
        }

        if (value) {
          this.font = null;

          this._resetAssembler();

          this.setVertsDirty();

          this._applyFontTexture();
        }

        this.markForValidate();
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.system_font'
    },
    _bmFontOriginalSize: {
      displayName: 'BMFont Original Size',
      get: function get() {
        if (this._N$file instanceof cc.BitmapFont) {
          return this._N$file.fontSize;
        } else {
          return -1;
        }
      },
      visible: true,
      animatable: false
    },
    _spacingX: 0,

    /**
     * !#en The spacing of the x axis between characters.
     * !#zh 文字之间 x 轴的间距。
     * @property {Number} spacingX
     */
    spacingX: {
      get: function get() {
        return this._spacingX;
      },
      set: function set(value) {
        this._spacingX = value;
        this.setVertsDirty();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.label.spacingX'
    },
    //For compatibility with v2.0.x temporary reservation.
    _batchAsBitmap: false,

    /**
     * !#en The cache mode of label. This mode only supports system fonts.
     * !#zh 文本缓存模式, 该模式只支持系统字体。
     * @property {Label.CacheMode} cacheMode
     */
    cacheMode: {
      "default": CacheMode.NONE,
      type: CacheMode,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.cacheMode',
      notify: function notify(oldValue) {
        if (this.cacheMode === oldValue) return;

        if (oldValue === CacheMode.BITMAP && !(this.font instanceof cc.BitmapFont)) {
          this._frame && this._frame._resetDynamicAtlasFrame();
        }

        if (oldValue === CacheMode.CHAR) {
          this._ttfTexture = null;
        }

        this.setVertsDirty();

        this._resetAssembler();

        this._applyFontTexture();
      },
      animatable: false
    },
    _styleFlags: 0,

    /**
     * !#en Whether enable bold.
     * !#zh 是否启用黑体。
     * @property {Boolean} enableBold
     */
    enableBold: {
      get: function get() {
        return !!(this._styleFlags & BOLD_FLAG);
      },
      set: function set(value) {
        if (value) {
          this._styleFlags |= BOLD_FLAG;
        } else {
          this._styleFlags &= ~BOLD_FLAG;
        }

        this.setVertsDirty();
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.bold'
    },

    /**
     * !#en Whether enable italic.
     * !#zh 是否启用黑体。
     * @property {Boolean} enableItalic
     */
    enableItalic: {
      get: function get() {
        return !!(this._styleFlags & ITALIC_FLAG);
      },
      set: function set(value) {
        if (value) {
          this._styleFlags |= ITALIC_FLAG;
        } else {
          this._styleFlags &= ~ITALIC_FLAG;
        }

        this.setVertsDirty();
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.italic'
    },

    /**
     * !#en Whether enable underline.
     * !#zh 是否启用下划线。
     * @property {Boolean} enableUnderline
     */
    enableUnderline: {
      get: function get() {
        return !!(this._styleFlags & UNDERLINE_FLAG);
      },
      set: function set(value) {
        if (value) {
          this._styleFlags |= UNDERLINE_FLAG;
        } else {
          this._styleFlags &= ~UNDERLINE_FLAG;
        }

        this.setVertsDirty();
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.underline'
    },
    _underlineHeight: 0,

    /**
     * !#en The height of underline.
     * !#zh 下划线高度。
     * @property {Number} underlineHeight
     */
    underlineHeight: {
      get: function get() {
        return this._underlineHeight;
      },
      set: function set(value) {
        if (this._underlineHeight === value) return;
        this._underlineHeight = value;
        this.setVertsDirty();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.label.underline_height'
    }
  },
  statics: {
    HorizontalAlign: HorizontalAlign,
    VerticalAlign: VerticalAlign,
    Overflow: Overflow,
    CacheMode: CacheMode,
    _shareAtlas: null,

    /**
     * !#zh 需要保证当前场景中没有使用CHAR缓存的Label才可以清除，否则已渲染的文字没有重新绘制会不显示
     * !#en It can be cleared that need to ensure there is not use the CHAR cache in the current scene. Otherwise, the rendered text will not be displayed without repainting.
     * @method clearCharCache
     * @static
     */
    clearCharCache: function clearCharCache() {
      if (Label._shareAtlas) {
        Label._shareAtlas.clearAllCache();
      }
    }
  },
  onLoad: function onLoad() {
    // For compatibility with v2.0.x temporary reservation.
    if (this._batchAsBitmap && this.cacheMode === CacheMode.NONE) {
      this.cacheMode = CacheMode.BITMAP;
      this._batchAsBitmap = false;
    }

    if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
      // CacheMode is not supported in Canvas.
      this.cacheMode = CacheMode.NONE;
    }
  },
  onEnable: function onEnable() {
    this._super(); // Keep track of Node size


    this.node.on(cc.Node.EventType.SIZE_CHANGED, this._nodeSizeChanged, this);
    this.node.on(cc.Node.EventType.ANCHOR_CHANGED, this.setVertsDirty, this);

    this._forceUpdateRenderData();
  },
  onDisable: function onDisable() {
    this._super();

    this.node.off(cc.Node.EventType.SIZE_CHANGED, this._nodeSizeChanged, this);
    this.node.off(cc.Node.EventType.ANCHOR_CHANGED, this.setVertsDirty, this);
  },
  onDestroy: function onDestroy() {
    this._assembler && this._assembler._resetAssemblerData && this._assembler._resetAssemblerData(this._assemblerData);
    this._assemblerData = null;
    this._letterTexture = null;

    if (this._ttfTexture) {
      this._ttfTexture.destroy();

      this._ttfTexture = null;
    }

    this._super();
  },
  _nodeSizeChanged: function _nodeSizeChanged() {
    // Because the content size is automatically updated when overflow is NONE.
    // And this will conflict with the alignment of the CCWidget.
    if (CC_EDITOR || this.overflow !== Overflow.NONE) {
      this.setVertsDirty();
    }
  },
  _updateColor: function _updateColor() {
    if (!(this.font instanceof cc.BitmapFont)) {
      this.setVertsDirty();
    }

    RenderComponent.prototype._updateColor.call(this);
  },
  _validateRender: function _validateRender() {
    if (!this.string) {
      this.disableRender();
      return;
    }

    if (this._materials[0]) {
      var font = this.font;

      if (font instanceof cc.BitmapFont) {
        var spriteFrame = font.spriteFrame;

        if (spriteFrame && spriteFrame.textureLoaded() && font._fntConfig) {
          return;
        }
      } else {
        return;
      }
    }

    this.disableRender();
  },
  _resetAssembler: function _resetAssembler() {
    this._frame = null;

    RenderComponent.prototype._resetAssembler.call(this);
  },
  _checkStringEmpty: function _checkStringEmpty() {
    this.markForRender(!!this.string);
  },
  _on3DNodeChanged: function _on3DNodeChanged() {
    this._resetAssembler();

    this._applyFontTexture();
  },
  _onBMFontTextureLoaded: function _onBMFontTextureLoaded() {
    this._frame._texture = this.font.spriteFrame._texture;
    this.markForRender(true);

    this._updateMaterial();

    this._assembler && this._assembler.updateRenderData(this);
  },
  _applyFontTexture: function _applyFontTexture() {
    var font = this.font;

    if (font instanceof cc.BitmapFont) {
      var spriteFrame = font.spriteFrame;
      this._frame = spriteFrame;

      if (spriteFrame) {
        spriteFrame.onTextureLoaded(this._onBMFontTextureLoaded, this);
      }
    } else {
      if (!this._frame) {
        this._frame = new LabelFrame();
      }

      if (this.cacheMode === CacheMode.CHAR) {
        this._letterTexture = this._assembler._getAssemblerData();

        this._frame._refreshTexture(this._letterTexture);
      } else if (!this._ttfTexture) {
        this._ttfTexture = new cc.Texture2D();
        this._assemblerData = this._assembler._getAssemblerData();

        this._ttfTexture.initWithElement(this._assemblerData.canvas);
      }

      if (this.cacheMode !== CacheMode.CHAR) {
        this._frame._resetDynamicAtlasFrame();

        this._frame._refreshTexture(this._ttfTexture);
      }

      this._updateMaterial();

      this._assembler && this._assembler.updateRenderData(this);
    }

    this.markForValidate();
  },
  _updateMaterialCanvas: function _updateMaterialCanvas() {
    if (!this._frame) return;
    this._frame._texture.url = this.uuid + '_texture';
  },
  _updateMaterialWebgl: function _updateMaterialWebgl() {
    if (!this._frame) return;
    var material = this._materials[0];
    material && material.setProperty('texture', this._frame._texture);
  },
  _forceUpdateRenderData: function _forceUpdateRenderData() {
    this.setVertsDirty();

    this._resetAssembler();

    this._applyFontTexture();
  },

  /**
   * @deprecated `label._enableBold` is deprecated, use `label.enableBold = true` instead please.
   */
  _enableBold: function _enableBold(enabled) {
    if (CC_DEBUG) {
      cc.warn('`label._enableBold` is deprecated, use `label.enableBold = true` instead please');
    }

    this.enableBold = !!enabled;
  },

  /**
   * @deprecated `label._enableItalics` is deprecated, use `label.enableItalics = true` instead please.
   */
  _enableItalics: function _enableItalics(enabled) {
    if (CC_DEBUG) {
      cc.warn('`label._enableItalics` is deprecated, use `label.enableItalics = true` instead please');
    }

    this.enableItalic = !!enabled;
  },

  /**
   * @deprecated `label._enableUnderline` is deprecated, use `label.enableUnderline = true` instead please.
   */
  _enableUnderline: function _enableUnderline(enabled) {
    if (CC_DEBUG) {
      cc.warn('`label._enableUnderline` is deprecated, use `label.enableUnderline = true` instead please');
    }

    this.enableUnderline = !!enabled;
  }
});
cc.Label = module.exports = Label;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDTGFiZWwuanMiXSwibmFtZXMiOlsibWFjcm8iLCJyZXF1aXJlIiwiUmVuZGVyQ29tcG9uZW50IiwiTWF0ZXJpYWwiLCJMYWJlbEZyYW1lIiwiSG9yaXpvbnRhbEFsaWduIiwiVGV4dEFsaWdubWVudCIsIlZlcnRpY2FsQWxpZ24iLCJWZXJ0aWNhbFRleHRBbGlnbm1lbnQiLCJPdmVyZmxvdyIsImNjIiwiRW51bSIsIk5PTkUiLCJDTEFNUCIsIlNIUklOSyIsIlJFU0laRV9IRUlHSFQiLCJDYWNoZU1vZGUiLCJCSVRNQVAiLCJDSEFSIiwiQk9MRF9GTEFHIiwiSVRBTElDX0ZMQUciLCJVTkRFUkxJTkVfRkxBRyIsIkxhYmVsIiwiQ2xhc3MiLCJuYW1lIiwiY3RvciIsIkNDX0VESVRPUiIsIl91c2VyRGVmaW5lZEZvbnQiLCJfYWN0dWFsRm9udFNpemUiLCJfYXNzZW1ibGVyRGF0YSIsIl9mcmFtZSIsIl90dGZUZXh0dXJlIiwiX2xldHRlclRleHR1cmUiLCJnYW1lIiwicmVuZGVyVHlwZSIsIlJFTkRFUl9UWVBFX0NBTlZBUyIsIl91cGRhdGVNYXRlcmlhbCIsIl91cGRhdGVNYXRlcmlhbENhbnZhcyIsIl91cGRhdGVNYXRlcmlhbFdlYmdsIiwiZWRpdG9yIiwibWVudSIsImhlbHAiLCJpbnNwZWN0b3IiLCJwcm9wZXJ0aWVzIiwiX3VzZU9yaWdpbmFsU2l6ZSIsIl9zdHJpbmciLCJmb3JtZXJseVNlcmlhbGl6ZWRBcyIsInN0cmluZyIsImdldCIsInNldCIsInZhbHVlIiwib2xkVmFsdWUiLCJzZXRWZXJ0c0RpcnR5IiwiX2NoZWNrU3RyaW5nRW1wdHkiLCJtdWx0aWxpbmUiLCJ0b29sdGlwIiwiQ0NfREVWIiwiaG9yaXpvbnRhbEFsaWduIiwiTEVGVCIsInR5cGUiLCJub3RpZnkiLCJhbmltYXRhYmxlIiwidmVydGljYWxBbGlnbiIsIlRPUCIsImFjdHVhbEZvbnRTaXplIiwiZGlzcGxheU5hbWUiLCJyZWFkb25seSIsIl9mb250U2l6ZSIsImZvbnRTaXplIiwicmFuZ2UiLCJmb250RmFtaWx5IiwiX2xpbmVIZWlnaHQiLCJsaW5lSGVpZ2h0Iiwib3ZlcmZsb3ciLCJfZW5hYmxlV3JhcFRleHQiLCJlbmFibGVXcmFwVGV4dCIsIl9OJGZpbGUiLCJmb250IiwiX2lzU3lzdGVtRm9udFVzZWQiLCJ3YXJuSUQiLCJfcmVzZXRBc3NlbWJsZXIiLCJfYXBwbHlGb250VGV4dHVyZSIsIkZvbnQiLCJ1c2VTeXN0ZW1Gb250Iiwic3BhY2luZ1giLCJfc3BhY2luZ1giLCJtYXJrRm9yVmFsaWRhdGUiLCJfYm1Gb250T3JpZ2luYWxTaXplIiwiQml0bWFwRm9udCIsInZpc2libGUiLCJfYmF0Y2hBc0JpdG1hcCIsImNhY2hlTW9kZSIsIl9yZXNldER5bmFtaWNBdGxhc0ZyYW1lIiwiX3N0eWxlRmxhZ3MiLCJlbmFibGVCb2xkIiwiZW5hYmxlSXRhbGljIiwiZW5hYmxlVW5kZXJsaW5lIiwiX3VuZGVybGluZUhlaWdodCIsInVuZGVybGluZUhlaWdodCIsInN0YXRpY3MiLCJfc2hhcmVBdGxhcyIsImNsZWFyQ2hhckNhY2hlIiwiY2xlYXJBbGxDYWNoZSIsIm9uTG9hZCIsIm9uRW5hYmxlIiwiX3N1cGVyIiwibm9kZSIsIm9uIiwiTm9kZSIsIkV2ZW50VHlwZSIsIlNJWkVfQ0hBTkdFRCIsIl9ub2RlU2l6ZUNoYW5nZWQiLCJBTkNIT1JfQ0hBTkdFRCIsIl9mb3JjZVVwZGF0ZVJlbmRlckRhdGEiLCJvbkRpc2FibGUiLCJvZmYiLCJvbkRlc3Ryb3kiLCJfYXNzZW1ibGVyIiwiX3Jlc2V0QXNzZW1ibGVyRGF0YSIsImRlc3Ryb3kiLCJfdXBkYXRlQ29sb3IiLCJwcm90b3R5cGUiLCJjYWxsIiwiX3ZhbGlkYXRlUmVuZGVyIiwiZGlzYWJsZVJlbmRlciIsIl9tYXRlcmlhbHMiLCJzcHJpdGVGcmFtZSIsInRleHR1cmVMb2FkZWQiLCJfZm50Q29uZmlnIiwibWFya0ZvclJlbmRlciIsIl9vbjNETm9kZUNoYW5nZWQiLCJfb25CTUZvbnRUZXh0dXJlTG9hZGVkIiwiX3RleHR1cmUiLCJ1cGRhdGVSZW5kZXJEYXRhIiwib25UZXh0dXJlTG9hZGVkIiwiX2dldEFzc2VtYmxlckRhdGEiLCJfcmVmcmVzaFRleHR1cmUiLCJUZXh0dXJlMkQiLCJpbml0V2l0aEVsZW1lbnQiLCJjYW52YXMiLCJ1cmwiLCJ1dWlkIiwibWF0ZXJpYWwiLCJzZXRQcm9wZXJ0eSIsIl9lbmFibGVCb2xkIiwiZW5hYmxlZCIsIkNDX0RFQlVHIiwid2FybiIsIl9lbmFibGVJdGFsaWNzIiwiX2VuYWJsZVVuZGVybGluZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFNQSxLQUFLLEdBQUdDLE9BQU8sQ0FBQyxxQkFBRCxDQUFyQjs7QUFDQSxJQUFNQyxlQUFlLEdBQUdELE9BQU8sQ0FBQyxxQkFBRCxDQUEvQjs7QUFDQSxJQUFNRSxRQUFRLEdBQUdGLE9BQU8sQ0FBQywrQkFBRCxDQUF4Qjs7QUFDQSxJQUFNRyxVQUFVLEdBQUdILE9BQU8sQ0FBQyxxQ0FBRCxDQUExQjtBQUVBOzs7Ozs7QUFLQTs7Ozs7O0FBS0E7Ozs7OztBQUtBOzs7Ozs7O0FBS0EsSUFBTUksZUFBZSxHQUFHTCxLQUFLLENBQUNNLGFBQTlCO0FBRUE7Ozs7OztBQUtBOzs7Ozs7QUFLQTs7Ozs7O0FBS0E7Ozs7OztBQUtBLElBQU1DLGFBQWEsR0FBR1AsS0FBSyxDQUFDUSxxQkFBNUI7QUFFQTs7Ozs7O0FBS0E7Ozs7OztBQUtBOzs7Ozs7QUFLQTs7Ozs7O0FBS0E7Ozs7OztBQUtBLElBQU1DLFFBQVEsR0FBR0MsRUFBRSxDQUFDQyxJQUFILENBQVE7QUFDckJDLEVBQUFBLElBQUksRUFBRSxDQURlO0FBRXJCQyxFQUFBQSxLQUFLLEVBQUUsQ0FGYztBQUdyQkMsRUFBQUEsTUFBTSxFQUFFLENBSGE7QUFJckJDLEVBQUFBLGFBQWEsRUFBRTtBQUpNLENBQVIsQ0FBakI7QUFPQTs7Ozs7O0FBS0E7Ozs7OztBQUtBOzs7Ozs7QUFL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QUs0QixlQUFMOztBQUNBLFNBQUtDLGlCQUFMO0FBQ0gsR0E5a0JnQjs7QUFnbEJqQjs7O0FBR0ErRCxFQUFBQSxXQW5sQmlCLHVCQW1sQkpDLE9BbmxCSSxFQW1sQks7QUFDbEIsUUFBSUMsUUFBSixFQUFjO0FBQ1Z4SSxNQUFBQSxFQUFFLENBQUN5SSxJQUFILENBQVEsaUZBQVI7QUFDSDs7QUFDRCxTQUFLckQsVUFBTCxHQUFrQixDQUFDLENBQUNtRCxPQUFwQjtBQUNILEdBeGxCZ0I7O0FBMGxCakI7OztBQUdBRyxFQUFBQSxjQTdsQmlCLDBCQTZsQkRILE9BN2xCQyxFQTZsQlE7QUFDckIsUUFBSUMsUUFBSixFQUFjO0FBQ1Z4SSxNQUFBQSxFQUFFLENBQUN5SSxJQUFILENBQVEsdUZBQVI7QUFDSDs7QUFDRCxTQUFLcEQsWUFBTCxHQUFvQixDQUFDLENBQUNrRCxPQUF0QjtBQUNILEdBbG1CZ0I7O0FBb21CakI7OztBQUdBSSxFQUFBQSxnQkF2bUJpQiw0QkF1bUJDSixPQXZtQkQsRUF1bUJVO0FBQ3ZCLFFBQUlDLFFBQUosRUFBYztBQUNWeEksTUFBQUEsRUFBRSxDQUFDeUksSUFBSCxDQUFRLDJGQUFSO0FBQ0g7O0FBQ0QsU0FBS25ELGVBQUwsR0FBdUIsQ0FBQyxDQUFDaUQsT0FBekI7QUFDSDtBQTVtQmdCLENBQVQsQ0FBWjtBQSttQkN2SSxFQUFFLENBQUNZLEtBQUgsR0FBV2dJLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQmpJLEtBQTVCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBtYWNybyA9IHJlcXVpcmUoJy4uL3BsYXRmb3JtL0NDTWFjcm8nKTtcbmNvbnN0IFJlbmRlckNvbXBvbmVudCA9IHJlcXVpcmUoJy4vQ0NSZW5kZXJDb21wb25lbnQnKTtcbmNvbnN0IE1hdGVyaWFsID0gcmVxdWlyZSgnLi4vYXNzZXRzL21hdGVyaWFsL0NDTWF0ZXJpYWwnKTtcbmNvbnN0IExhYmVsRnJhbWUgPSByZXF1aXJlKCcuLi9yZW5kZXJlci91dGlscy9sYWJlbC9sYWJlbC1mcmFtZScpO1xuXG4vKipcbiAqICEjZW4gRW51bSBmb3IgdGV4dCBhbGlnbm1lbnQuXG4gKiAhI3poIOaWh+acrOaoquWQkeWvuem9kOexu+Wei1xuICogQGVudW0gTGFiZWwuSG9yaXpvbnRhbEFsaWduXG4gKi9cbi8qKlxuICogISNlbiBBbGlnbm1lbnQgbGVmdCBmb3IgdGV4dC5cbiAqICEjemgg5paH5pys5YaF5a655bem5a+56b2Q44CCXG4gKiBAcHJvcGVydHkge051bWJlcn0gTEVGVFxuICovXG4vKipcbiAqICEjZW4gQWxpZ25tZW50IGNlbnRlciBmb3IgdGV4dC5cbiAqICEjemgg5paH5pys5YaF5a655bGF5Lit5a+56b2Q44CCXG4gKiBAcHJvcGVydHkge051bWJlcn0gQ0VOVEVSXG4gKi9cbi8qKlxuICogISNlbiBBbGlnbm1lbnQgcmlnaHQgZm9yIHRleHQuXG4gKiAhI3poIOaWh+acrOWGheWuueWPs+i+ueWvuem9kOOAglxuICogQHByb3BlcnR5IHtOdW1iZXJ9IFJJR0hUXG4gKi9cbmNvbnN0IEhvcml6b250YWxBbGlnbiA9IG1hY3JvLlRleHRBbGlnbm1lbnQ7XG5cbi8qKlxuICogISNlbiBFbnVtIGZvciB2ZXJ0aWNhbCB0ZXh0IGFsaWdubWVudC5cbiAqICEjemgg5paH5pys5Z6C55u05a+56b2Q57G75Z6LXG4gKiBAZW51bSBMYWJlbC5WZXJ0aWNhbEFsaWduXG4gKi9cbi8qKlxuICogISNlbiBWZXJ0aWNhbCBhbGlnbm1lbnQgdG9wIGZvciB0ZXh0LlxuICogISN6aCDmlofmnKzpobbpg6jlr7npvZDjgIJcbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBUT1BcbiAqL1xuLyoqXG4gKiAhI2VuIFZlcnRpY2FsIGFsaWdubWVudCBjZW50ZXIgZm9yIHRleHQuXG4gKiAhI3poIOaWh+acrOWxheS4reWvuem9kOOAglxuICogQHByb3BlcnR5IHtOdW1iZXJ9IENFTlRFUlxuICovXG4vKipcbiAqICEjZW4gVmVydGljYWwgYWxpZ25tZW50IGJvdHRvbSBmb3IgdGV4dC5cbiAqICEjemgg5paH5pys5bqV6YOo5a+56b2Q44CCXG4gKiBAcHJvcGVydHkge051bWJlcn0gQk9UVE9NXG4gKi9cbmNvbnN0IFZlcnRpY2FsQWxpZ24gPSBtYWNyby5WZXJ0aWNhbFRleHRBbGlnbm1lbnQ7XG5cbi8qKlxuICogISNlbiBFbnVtIGZvciBPdmVyZmxvdy5cbiAqICEjemggT3ZlcmZsb3cg57G75Z6LXG4gKiBAZW51bSBMYWJlbC5PdmVyZmxvd1xuICovXG4vKipcbiAqICEjZW4gTk9ORS5cbiAqICEjemgg5LiN5YGa5Lu75L2V6ZmQ5Yi244CCXG4gKiBAcHJvcGVydHkge051bWJlcn0gTk9ORVxuICovXG4vKipcbiAqICEjZW4gSW4gQ0xBTVAgbW9kZSwgd2hlbiBsYWJlbCBjb250ZW50IGdvZXMgb3V0IG9mIHRoZSBib3VuZGluZyBib3gsIGl0IHdpbGwgYmUgY2xpcHBlZC5cbiAqICEjemggQ0xBTVAg5qih5byP5Lit77yM5b2T5paH5pys5YaF5a656LaF5Ye66L6555WM5qGG5pe277yM5aSa5L2Z55qE5Lya6KKr5oiq5pat44CCXG4gKiBAcHJvcGVydHkge051bWJlcn0gQ0xBTVBcbiAqL1xuLyoqXG4gKiAhI2VuIEluIFNIUklOSyBtb2RlLCB0aGUgZm9udCBzaXplIHdpbGwgY2hhbmdlIGR5bmFtaWNhbGx5IHRvIGFkYXB0IHRoZSBjb250ZW50IHNpemUuIFRoaXMgbW9kZSBtYXkgdGFrZXMgdXAgbW9yZSBDUFUgcmVzb3VyY2VzIHdoZW4gdGhlIGxhYmVsIGlzIHJlZnJlc2hlZC5cbiAqICEjemggU0hSSU5LIOaooeW8j++8jOWtl+S9k+Wkp+Wwj+S8muWKqOaAgeWPmOWMlu+8jOS7pemAguW6lOWGheWuueWkp+Wwj+OAgui/meS4quaooeW8j+WcqOaWh+acrOWIt+aWsOeahOaXtuWAmeWPr+iDveS8muWNoOeUqOi+g+WkmiBDUFUg6LWE5rqQ44CCXG4gKiBAcHJvcGVydHkge051bWJlcn0gU0hSSU5LXG4gKi9cbi8qKlxuICogISNlbiBJbiBSRVNJWkVfSEVJR0hUIG1vZGUsIHlvdSBjYW4gb25seSBjaGFuZ2UgdGhlIHdpZHRoIG9mIGxhYmVsIGFuZCB0aGUgaGVpZ2h0IGlzIGNoYW5nZWQgYXV0b21hdGljYWxseS5cbiAqICEjemgg5ZyoIFJFU0laRV9IRUlHSFQg5qih5byP5LiL77yM5Y+q6IO95pu05pS55paH5pys55qE5a695bqm77yM6auY5bqm5piv6Ieq5Yqo5pS55Y+Y55qE44CCXG4gKiBAcHJvcGVydHkge051bWJlcn0gUkVTSVpFX0hFSUdIVFxuICovXG5jb25zdCBPdmVyZmxvdyA9IGNjLkVudW0oe1xuICAgIE5PTkU6IDAsXG4gICAgQ0xBTVA6IDEsXG4gICAgU0hSSU5LOiAyLFxuICAgIFJFU0laRV9IRUlHSFQ6IDNcbn0pO1xuXG4vKipcbiAqICEjZW4gRW51bSBmb3IgZm9udCB0eXBlLlxuICogISN6aCBUeXBlIOexu+Wei1xuICogQGVudW0gTGFiZWwuVHlwZVxuICovXG4vKipcbiAqICEjZW4gVGhlIFRURiBmb250IHR5cGUuXG4gKiAhI3poIFRURuWtl+S9k1xuICogQHByb3BlcnR5IHtOdW1iZXJ9IFRURlxuICovXG4vKipcbiAqICEjZW4gVGhlIGJpdG1hcCBmb250IHR5cGUuXG4gKiAhI3poIOS9jeWbvuWtl+S9k1xuICogQHByb3BlcnR5IHtOdW1iZXJ9IEJNRm9udFxuICovXG4vKipcbiAqICEjZW4gVGhlIHN5c3RlbSBmb250IHR5cGUuXG4gKiAhI3poIOezu+e7n+Wtl+S9k1xuICogQHByb3BlcnR5IHtOdW1iZXJ9IFN5c3RlbUZvbnRcbiAqL1xuXG4vKipcbiAqICEjZW4gRW51bSBmb3IgY2FjaGUgbW9kZS5cbiAqICEjemggQ2FjaGVNb2RlIOexu+Wei1xuICogQGVudW0gTGFiZWwuQ2FjaGVNb2RlXG4gKi9cbiAvKipcbiAqICEjZW4gRG8gbm90IGRvIGFueSBjYWNoaW5nLlxuICogISN6aCDkuI3lgZrku7vkvZXnvJPlrZjjgIJcbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBOT05FXG4gKi9cbi8qKlxuICogISNlbiBJbiBCSVRNQVAgbW9kZSwgY2FjaGUgdGhlIGxhYmVsIGFzIGEgc3RhdGljIGltYWdlIGFuZCBhZGQgaXQgdG8gdGhlIGR5bmFtaWMgYXRsYXMgZm9yIGJhdGNoIHJlbmRlcmluZywgYW5kIGNhbiBiYXRjaGluZyB3aXRoIFNwcml0ZXMgdXNpbmcgYnJva2VuIGltYWdlcy5cbiAqICEjemggQklUTUFQIOaooeW8j++8jOWwhiBsYWJlbCDnvJPlrZjmiJDpnZnmgIHlm77lg4/lubbliqDlhaXliLDliqjmgIHlm77pm4bvvIzku6Xkvr/ov5vooYzmibnmrKHlkIjlubbvvIzlj6/kuI7kvb/nlKjnoo7lm77nmoQgU3ByaXRlIOi/m+ihjOWQiOaJue+8iOazqO+8muWKqOaAgeWbvumbhuWcqCBDaHJvbWUg5Lul5Y+K5b6u5L+h5bCP5ri45oiP5pqC5pe25YWz6Zet77yM6K+l5Yqf6IO95peg5pWI77yJ44CCXG4gKiBAcHJvcGVydHkge051bWJlcn0gQklUTUFQXG4gKi9cbi8qKlxuICogISNlbiBJbiBDSEFSIG1vZGUsIHNwbGl0IHRleHQgaW50byBjaGFyYWN0ZXJzIGFuZCBjYWNoZSBjaGFyYWN0ZXJzIGludG8gYSBkeW5hbWljIGF0bGFzIHdoaWNoIHRoZSBzaXplIG9mIDIwNDgqMjA0OC4gXG4gKiAhI3poIENIQVIg5qih5byP77yM5bCG5paH5pys5ouG5YiG5Li65a2X56ym77yM5bm25bCG5a2X56ym57yT5a2Y5Yiw5LiA5byg5Y2V54us55qE5aSn5bCP5Li6IDIwNDgqMjA0OCDnmoTlm77pm4bkuK3ov5vooYzph43lpI3kvb/nlKjvvIzkuI3lho3kvb/nlKjliqjmgIHlm77pm4bvvIjms6jvvJrlvZPlm77pm4bmu6Hml7blsIbkuI3lho3ov5vooYznvJPlrZjvvIzmmoLml7bkuI3mlK/mjIEgU0hSSU5LIOiHqumAguW6lOaWh+acrOWwuuWvuO+8iOWQjue7reWujOWWhO+8ie+8ieOAglxuICogQHByb3BlcnR5IHtOdW1iZXJ9IENIQVJcbiAqL1xuY29uc3QgQ2FjaGVNb2RlID0gY2MuRW51bSh7XG4gICAgTk9ORTogMCxcbiAgICBCSVRNQVA6IDEsXG4gICAgQ0hBUjogMixcbn0pO1xuXG5jb25zdCBCT0xEX0ZMQUcgPSAxIDw8IDA7XG5jb25zdCBJVEFMSUNfRkxBRyA9IDEgPDwgMTtcbmNvbnN0IFVOREVSTElORV9GTEFHID0gMSA8PCAyO1xuXG4vKipcbiAqICEjZW4gVGhlIExhYmVsIENvbXBvbmVudC5cbiAqICEjemgg5paH5a2X5qCH562+57uE5Lu2XG4gKiBAY2xhc3MgTGFiZWxcbiAqIEBleHRlbmRzIFJlbmRlckNvbXBvbmVudFxuICovXG5sZXQgTGFiZWwgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLkxhYmVsJyxcbiAgICBleHRlbmRzOiBSZW5kZXJDb21wb25lbnQsXG5cbiAgICBjdG9yICgpIHtcbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgdGhpcy5fdXNlckRlZmluZWRGb250ID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2FjdHVhbEZvbnRTaXplID0gMDtcbiAgICAgICAgdGhpcy5fYXNzZW1ibGVyRGF0YSA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5fZnJhbWUgPSBudWxsO1xuICAgICAgICB0aGlzLl90dGZUZXh0dXJlID0gbnVsbDtcbiAgICAgICAgdGhpcy5fbGV0dGVyVGV4dHVyZSA9IG51bGw7XG5cbiAgICAgICAgaWYgKGNjLmdhbWUucmVuZGVyVHlwZSA9PT0gY2MuZ2FtZS5SRU5ERVJfVFlQRV9DQU5WQVMpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZU1hdGVyaWFsID0gdGhpcy5fdXBkYXRlTWF0ZXJpYWxDYW52YXM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVNYXRlcmlhbCA9IHRoaXMuX3VwZGF0ZU1hdGVyaWFsV2ViZ2w7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZWRpdG9yOiBDQ19FRElUT1IgJiYge1xuICAgICAgICBtZW51OiAnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50LnJlbmRlcmVycy9MYWJlbCcsXG4gICAgICAgIGhlbHA6ICdpMThuOkNPTVBPTkVOVC5oZWxwX3VybC5sYWJlbCcsXG4gICAgICAgIGluc3BlY3RvcjogJ3BhY2thZ2VzOi8vaW5zcGVjdG9yL2luc3BlY3RvcnMvY29tcHMvbGFiZWwuanMnLFxuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIF91c2VPcmlnaW5hbFNpemU6IHRydWUsXG4gICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBDb250ZW50IHN0cmluZyBvZiBsYWJlbC5cbiAgICAgICAgICogISN6aCDmoIfnrb7mmL7npLrnmoTmlofmnKzlhoXlrrnjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtTdHJpbmd9IHN0cmluZ1xuICAgICAgICAgKi9cbiAgICAgICAgX3N0cmluZzoge1xuICAgICAgICAgICAgZGVmYXVsdDogJycsXG4gICAgICAgICAgICBmb3JtZXJseVNlcmlhbGl6ZWRBczogJ19OJHN0cmluZycsXG4gICAgICAgIH0sXG4gICAgICAgIHN0cmluZzoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RyaW5nO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBsZXQgb2xkVmFsdWUgPSB0aGlzLl9zdHJpbmc7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RyaW5nID0gJycgKyB2YWx1ZTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0cmluZyAhPT0gb2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRWZXJ0c0RpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5fY2hlY2tTdHJpbmdFbXB0eSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG11bHRpbGluZTogdHJ1ZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubGFiZWwuc3RyaW5nJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIEhvcml6b250YWwgQWxpZ25tZW50IG9mIGxhYmVsLlxuICAgICAgICAgKiAhI3poIOaWh+acrOWGheWuueeahOawtOW5s+Wvuem9kOaWueW8j+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge0xhYmVsLkhvcml6b250YWxBbGlnbn0gaG9yaXpvbnRhbEFsaWduXG4gICAgICAgICAqL1xuICAgICAgICBob3Jpem9udGFsQWxpZ246IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IEhvcml6b250YWxBbGlnbi5MRUZULFxuICAgICAgICAgICAgdHlwZTogSG9yaXpvbnRhbEFsaWduLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5sYWJlbC5ob3Jpem9udGFsX2FsaWduJyxcbiAgICAgICAgICAgIG5vdGlmeSAgKG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaG9yaXpvbnRhbEFsaWduID09PSBvbGRWYWx1ZSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVmVydGljYWwgQWxpZ25tZW50IG9mIGxhYmVsLlxuICAgICAgICAgKiAhI3poIOaWh+acrOWGheWuueeahOWeguebtOWvuem9kOaWueW8j+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge0xhYmVsLlZlcnRpY2FsQWxpZ259IHZlcnRpY2FsQWxpZ25cbiAgICAgICAgICovXG4gICAgICAgIHZlcnRpY2FsQWxpZ246IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IFZlcnRpY2FsQWxpZ24uVE9QLFxuICAgICAgICAgICAgdHlwZTogVmVydGljYWxBbGlnbixcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubGFiZWwudmVydGljYWxfYWxpZ24nLFxuICAgICAgICAgICAgbm90aWZ5IChvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZlcnRpY2FsQWxpZ24gPT09IG9sZFZhbHVlKSByZXR1cm47XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWZXJ0c0RpcnR5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBhY3R1YWwgcmVuZGVyaW5nIGZvbnQgc2l6ZSBpbiBzaHJpbmsgbW9kZVxuICAgICAgICAgKiAhI3poIFNIUklOSyDmqKHlvI/kuIvpnaLmlofmnKzlrp7pmYXmuLLmn5PnmoTlrZfkvZPlpKflsI9cbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGFjdHVhbEZvbnRTaXplXG4gICAgICAgICAqL1xuICAgICAgICBhY3R1YWxGb250U2l6ZToge1xuICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdBY3R1YWwgRm9udCBTaXplJyxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgcmVhZG9ubHk6IHRydWUsXG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9hY3R1YWxGb250U2l6ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmxhYmVsLmFjdHVhbEZvbnRTaXplJyxcbiAgICAgICAgfSxcblxuICAgICAgICBfZm9udFNpemU6IDQwLFxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBGb250IHNpemUgb2YgbGFiZWwuXG4gICAgICAgICAqICEjemgg5paH5pys5a2X5L2T5aSn5bCP44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBmb250U2l6ZVxuICAgICAgICAgKi9cbiAgICAgICAgZm9udFNpemU6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRTaXplO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZm9udFNpemUgPT09IHZhbHVlKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9mb250U2l6ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJhbmdlOiBbMCwgNTEyXSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubGFiZWwuZm9udF9zaXplJyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBGb250IGZhbWlseSBvZiBsYWJlbCwgb25seSB0YWtlIGVmZmVjdCB3aGVuIHVzZVN5c3RlbUZvbnQgcHJvcGVydHkgaXMgdHJ1ZS5cbiAgICAgICAgICogISN6aCDmlofmnKzlrZfkvZPlkI3np7AsIOWPquWcqCB1c2VTeXN0ZW1Gb250IOWxnuaAp+S4uiB0cnVlIOeahOaXtuWAmeeUn+aViOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gZm9udEZhbWlseVxuICAgICAgICAgKi9cbiAgICAgICAgZm9udEZhbWlseToge1xuICAgICAgICAgICAgZGVmYXVsdDogXCJBcmlhbFwiLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5sYWJlbC5mb250X2ZhbWlseScsXG4gICAgICAgICAgICBub3RpZnkgKG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9udEZhbWlseSA9PT0gb2xkVmFsdWUpIHJldHVybjtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFZlcnRzRGlydHkoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIF9saW5lSGVpZ2h0OiA0MCxcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gTGluZSBIZWlnaHQgb2YgbGFiZWwuXG4gICAgICAgICAqICEjemgg5paH5pys6KGM6auY44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBsaW5lSGVpZ2h0XG4gICAgICAgICAqL1xuICAgICAgICBsaW5lSGVpZ2h0OiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9saW5lSGVpZ2h0O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbGluZUhlaWdodCA9PT0gdmFsdWUpIHJldHVybjtcbiAgICAgICAgICAgICAgICB0aGlzLl9saW5lSGVpZ2h0ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWZXJ0c0RpcnR5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5sYWJlbC5saW5lX2hlaWdodCcsXG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIE92ZXJmbG93IG9mIGxhYmVsLlxuICAgICAgICAgKiAhI3poIOaWh+Wtl+aYvuekuui2heWHuuiMg+WbtOaXtueahOWkhOeQhuaWueW8j+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge0xhYmVsLk92ZXJmbG93fSBvdmVyZmxvd1xuICAgICAgICAgKi9cbiAgICAgICAgb3ZlcmZsb3c6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IE92ZXJmbG93Lk5PTkUsXG4gICAgICAgICAgICB0eXBlOiBPdmVyZmxvdyxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubGFiZWwub3ZlcmZsb3cnLFxuICAgICAgICAgICAgbm90aWZ5IChvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm92ZXJmbG93ID09PSBvbGRWYWx1ZSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgX2VuYWJsZVdyYXBUZXh0OiB0cnVlLFxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBXaGV0aGVyIGF1dG8gd3JhcCBsYWJlbCB3aGVuIHN0cmluZyB3aWR0aCBpcyBsYXJnZSB0aGFuIGxhYmVsIHdpZHRoLlxuICAgICAgICAgKiAhI3poIOaYr+WQpuiHquWKqOaNouihjOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGVuYWJsZVdyYXBUZXh0XG4gICAgICAgICAqL1xuICAgICAgICBlbmFibGVXcmFwVGV4dDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZW5hYmxlV3JhcFRleHQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9lbmFibGVXcmFwVGV4dCA9PT0gdmFsdWUpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIHRoaXMuX2VuYWJsZVdyYXBUZXh0ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWZXJ0c0RpcnR5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmxhYmVsLndyYXAnLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIOi/meS4quS/neWtmOS6huaXp+mhueebrueahCBmaWxlIOaVsOaNrlxuICAgICAgICBfTiRmaWxlOiBudWxsLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBmb250IG9mIGxhYmVsLlxuICAgICAgICAgKiAhI3poIOaWh+acrOWtl+S9k+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge0ZvbnR9IGZvbnRcbiAgICAgICAgICovXG4gICAgICAgIGZvbnQ6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX04kZmlsZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9udCA9PT0gdmFsdWUpIHJldHVybjtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvL2lmIGRlbGV0ZSB0aGUgZm9udCwgd2Ugc2hvdWxkIGNoYW5nZSBpc1N5c3RlbUZvbnRVc2VkIHRvIHRydWVcbiAgICAgICAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2lzU3lzdGVtRm9udFVzZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IgJiYgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXNlckRlZmluZWRGb250ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX04kZmlsZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB0aGlzLl9pc1N5c3RlbUZvbnRVc2VkKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pc1N5c3RlbUZvbnRVc2VkID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBpZiAoIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLndhcm5JRCg0MDAwKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9yZXNldEFzc2VtYmxlcigpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2FwcGx5Rm9udFRleHR1cmUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFZlcnRzRGlydHkoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBjYy5Gb250LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5sYWJlbC5mb250JyxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgX2lzU3lzdGVtRm9udFVzZWQ6IHRydWUsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gV2hldGhlciB1c2Ugc3lzdGVtIGZvbnQgbmFtZSBvciBub3QuXG4gICAgICAgICAqICEjemgg5piv5ZCm5L2/55So57O757uf5a2X5L2T44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gdXNlU3lzdGVtRm9udFxuICAgICAgICAgKi9cbiAgICAgICAgdXNlU3lzdGVtRm9udDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faXNTeXN0ZW1Gb250VXNlZDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2lzU3lzdGVtRm9udFVzZWQgPT09IHZhbHVlKSByZXR1cm47XG4gICAgICAgICAgICAgICAgdGhpcy5faXNTeXN0ZW1Gb250VXNlZCA9ICEhdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXZhbHVlICYmIHRoaXMuX3VzZXJEZWZpbmVkRm9udCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mb250ID0gdGhpcy5fdXNlckRlZmluZWRGb250O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGFjaW5nWCA9IHRoaXMuX3NwYWNpbmdYO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9udCA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzZXRBc3NlbWJsZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRWZXJ0c0RpcnR5KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FwcGx5Rm9udFRleHR1cmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5tYXJrRm9yVmFsaWRhdGUoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubGFiZWwuc3lzdGVtX2ZvbnQnLFxuICAgICAgICB9LFxuXG4gICAgICAgIF9ibUZvbnRPcmlnaW5hbFNpemU6IHtcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAnQk1Gb250IE9yaWdpbmFsIFNpemUnLFxuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fTiRmaWxlIGluc3RhbmNlb2YgY2MuQml0bWFwRm9udCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fTiRmaWxlLmZvbnRTaXplO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICBfc3BhY2luZ1g6IDAsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIHNwYWNpbmcgb2YgdGhlIHggYXhpcyBiZXR3ZWVuIGNoYXJhY3RlcnMuXG4gICAgICAgICAqICEjemgg5paH5a2X5LmL6Ze0IHgg6L2055qE6Ze06Led44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBzcGFjaW5nWFxuICAgICAgICAgKi9cbiAgICAgICAgc3BhY2luZ1g6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NwYWNpbmdYO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zcGFjaW5nWCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubGFiZWwuc3BhY2luZ1gnLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8vRm9yIGNvbXBhdGliaWxpdHkgd2l0aCB2Mi4wLnggdGVtcG9yYXJ5IHJlc2VydmF0aW9uLlxuICAgICAgICBfYmF0Y2hBc0JpdG1hcDogZmFsc2UsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIGNhY2hlIG1vZGUgb2YgbGFiZWwuIFRoaXMgbW9kZSBvbmx5IHN1cHBvcnRzIHN5c3RlbSBmb250cy5cbiAgICAgICAgICogISN6aCDmlofmnKznvJPlrZjmqKHlvI8sIOivpeaooeW8j+WPquaUr+aMgeezu+e7n+Wtl+S9k+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge0xhYmVsLkNhY2hlTW9kZX0gY2FjaGVNb2RlXG4gICAgICAgICAqL1xuICAgICAgICBjYWNoZU1vZGU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IENhY2hlTW9kZS5OT05FLFxuICAgICAgICAgICAgdHlwZTogQ2FjaGVNb2RlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5sYWJlbC5jYWNoZU1vZGUnLFxuICAgICAgICAgICAgbm90aWZ5IChvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNhY2hlTW9kZSA9PT0gb2xkVmFsdWUpIHJldHVybjtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAob2xkVmFsdWUgPT09IENhY2hlTW9kZS5CSVRNQVAgJiYgISh0aGlzLmZvbnQgaW5zdGFuY2VvZiBjYy5CaXRtYXBGb250KSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mcmFtZSAmJiB0aGlzLl9mcmFtZS5fcmVzZXREeW5hbWljQXRsYXNGcmFtZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChvbGRWYWx1ZSA9PT0gQ2FjaGVNb2RlLkNIQVIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdHRmVGV4dHVyZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWZXJ0c0RpcnR5KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzZXRBc3NlbWJsZXIoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9hcHBseUZvbnRUZXh0dXJlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICBfc3R5bGVGbGFnczogMCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBXaGV0aGVyIGVuYWJsZSBib2xkLlxuICAgICAgICAgKiAhI3poIOaYr+WQpuWQr+eUqOm7keS9k+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGVuYWJsZUJvbGRcbiAgICAgICAgICovXG4gICAgICAgIGVuYWJsZUJvbGQ6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhKHRoaXMuX3N0eWxlRmxhZ3MgJiBCT0xEX0ZMQUcpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3R5bGVGbGFncyB8PSBCT0xEX0ZMQUc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3R5bGVGbGFncyAmPSB+Qk9MRF9GTEFHO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5sYWJlbC5ib2xkJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFdoZXRoZXIgZW5hYmxlIGl0YWxpYy5cbiAgICAgICAgICogISN6aCDmmK/lkKblkK/nlKjpu5HkvZPjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBlbmFibGVJdGFsaWNcbiAgICAgICAgICovXG4gICAgICAgIGVuYWJsZUl0YWxpYzoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISEodGhpcy5fc3R5bGVGbGFncyAmIElUQUxJQ19GTEFHKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0eWxlRmxhZ3MgfD0gSVRBTElDX0ZMQUc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3R5bGVGbGFncyAmPSB+SVRBTElDX0ZMQUc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5sYWJlbC5pdGFsaWMnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gV2hldGhlciBlbmFibGUgdW5kZXJsaW5lLlxuICAgICAgICAgKiAhI3poIOaYr+WQpuWQr+eUqOS4i+WIkue6v+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGVuYWJsZVVuZGVybGluZVxuICAgICAgICAgKi9cbiAgICAgICAgZW5hYmxlVW5kZXJsaW5lOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAhISh0aGlzLl9zdHlsZUZsYWdzICYgVU5ERVJMSU5FX0ZMQUcpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3R5bGVGbGFncyB8PSBVTkRFUkxJTkVfRkxBRztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdHlsZUZsYWdzICY9IH5VTkRFUkxJTkVfRkxBRztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNldFZlcnRzRGlydHkoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubGFiZWwudW5kZXJsaW5lJ1xuICAgICAgICB9LFxuXG4gICAgICAgIF91bmRlcmxpbmVIZWlnaHQ6IDAsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBoZWlnaHQgb2YgdW5kZXJsaW5lLlxuICAgICAgICAgKiAhI3poIOS4i+WIkue6v+mrmOW6puOAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gdW5kZXJsaW5lSGVpZ2h0XG4gICAgICAgICAqL1xuICAgICAgICB1bmRlcmxpbmVIZWlnaHQ6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3VuZGVybGluZUhlaWdodDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3VuZGVybGluZUhlaWdodCA9PT0gdmFsdWUpIHJldHVybjtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLl91bmRlcmxpbmVIZWlnaHQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFZlcnRzRGlydHkoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmxhYmVsLnVuZGVybGluZV9oZWlnaHQnLFxuICAgICAgICB9LFxuICAgIH0sXG5cbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIEhvcml6b250YWxBbGlnbjogSG9yaXpvbnRhbEFsaWduLFxuICAgICAgICBWZXJ0aWNhbEFsaWduOiBWZXJ0aWNhbEFsaWduLFxuICAgICAgICBPdmVyZmxvdzogT3ZlcmZsb3csXG4gICAgICAgIENhY2hlTW9kZTogQ2FjaGVNb2RlLFxuXG4gICAgICAgIF9zaGFyZUF0bGFzOiBudWxsLFxuICAgICAgICAvKipcbiAgICAgICAgICogISN6aCDpnIDopoHkv53or4HlvZPliY3lnLrmma/kuK3msqHmnInkvb/nlKhDSEFS57yT5a2Y55qETGFiZWzmiY3lj6/ku6XmuIXpmaTvvIzlkKbliJnlt7LmuLLmn5PnmoTmloflrZfmsqHmnInph43mlrDnu5jliLbkvJrkuI3mmL7npLpcbiAgICAgICAgICogISNlbiBJdCBjYW4gYmUgY2xlYXJlZCB0aGF0IG5lZWQgdG8gZW5zdXJlIHRoZXJlIGlzIG5vdCB1c2UgdGhlIENIQVIgY2FjaGUgaW4gdGhlIGN1cnJlbnQgc2NlbmUuIE90aGVyd2lzZSwgdGhlIHJlbmRlcmVkIHRleHQgd2lsbCBub3QgYmUgZGlzcGxheWVkIHdpdGhvdXQgcmVwYWludGluZy5cbiAgICAgICAgICogQG1ldGhvZCBjbGVhckNoYXJDYWNoZVxuICAgICAgICAgKiBAc3RhdGljXG4gICAgICAgICAqL1xuICAgICAgICBjbGVhckNoYXJDYWNoZSAoKSB7XG4gICAgICAgICAgICBpZiAoTGFiZWwuX3NoYXJlQXRsYXMpIHtcbiAgICAgICAgICAgICAgICBMYWJlbC5fc2hhcmVBdGxhcy5jbGVhckFsbENhY2hlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25Mb2FkICgpIHtcbiAgICAgICAgLy8gRm9yIGNvbXBhdGliaWxpdHkgd2l0aCB2Mi4wLnggdGVtcG9yYXJ5IHJlc2VydmF0aW9uLlxuICAgICAgICBpZiAodGhpcy5fYmF0Y2hBc0JpdG1hcCAmJiB0aGlzLmNhY2hlTW9kZSA9PT0gQ2FjaGVNb2RlLk5PTkUpIHtcbiAgICAgICAgICAgIHRoaXMuY2FjaGVNb2RlID0gQ2FjaGVNb2RlLkJJVE1BUDtcbiAgICAgICAgICAgIHRoaXMuX2JhdGNoQXNCaXRtYXAgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjYy5nYW1lLnJlbmRlclR5cGUgPT09IGNjLmdhbWUuUkVOREVSX1RZUEVfQ0FOVkFTKSB7XG4gICAgICAgICAgICAvLyBDYWNoZU1vZGUgaXMgbm90IHN1cHBvcnRlZCBpbiBDYW52YXMuXG4gICAgICAgICAgICB0aGlzLmNhY2hlTW9kZSA9IENhY2hlTW9kZS5OT05FO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uRW5hYmxlICgpIHtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcblxuICAgICAgICAvLyBLZWVwIHRyYWNrIG9mIE5vZGUgc2l6ZVxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuU0laRV9DSEFOR0VELCB0aGlzLl9ub2RlU2l6ZUNoYW5nZWQsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuQU5DSE9SX0NIQU5HRUQsIHRoaXMuc2V0VmVydHNEaXJ0eSwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5fZm9yY2VVcGRhdGVSZW5kZXJEYXRhKCk7XG4gICAgfSxcblxuICAgIG9uRGlzYWJsZSAoKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuU0laRV9DSEFOR0VELCB0aGlzLl9ub2RlU2l6ZUNoYW5nZWQsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLkFOQ0hPUl9DSEFOR0VELCB0aGlzLnNldFZlcnRzRGlydHksIHRoaXMpO1xuICAgIH0sXG5cbiAgICBvbkRlc3Ryb3kgKCkge1xuICAgICAgICB0aGlzLl9hc3NlbWJsZXIgJiYgdGhpcy5fYXNzZW1ibGVyLl9yZXNldEFzc2VtYmxlckRhdGEgJiYgdGhpcy5fYXNzZW1ibGVyLl9yZXNldEFzc2VtYmxlckRhdGEodGhpcy5fYXNzZW1ibGVyRGF0YSk7XG4gICAgICAgIHRoaXMuX2Fzc2VtYmxlckRhdGEgPSBudWxsO1xuICAgICAgICB0aGlzLl9sZXR0ZXJUZXh0dXJlID0gbnVsbDtcbiAgICAgICAgaWYgKHRoaXMuX3R0ZlRleHR1cmUpIHtcbiAgICAgICAgICAgIHRoaXMuX3R0ZlRleHR1cmUuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5fdHRmVGV4dHVyZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICB9LFxuXG4gICAgX25vZGVTaXplQ2hhbmdlZCAoKSB7XG4gICAgICAgIC8vIEJlY2F1c2UgdGhlIGNvbnRlbnQgc2l6ZSBpcyBhdXRvbWF0aWNhbGx5IHVwZGF0ZWQgd2hlbiBvdmVyZmxvdyBpcyBOT05FLlxuICAgICAgICAvLyBBbmQgdGhpcyB3aWxsIGNvbmZsaWN0IHdpdGggdGhlIGFsaWdubWVudCBvZiB0aGUgQ0NXaWRnZXQuXG4gICAgICAgIGlmIChDQ19FRElUT1IgfHwgdGhpcy5vdmVyZmxvdyAhPT0gT3ZlcmZsb3cuTk9ORSkge1xuICAgICAgICAgICAgdGhpcy5zZXRWZXJ0c0RpcnR5KCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3VwZGF0ZUNvbG9yICgpIHtcbiAgICAgICAgaWYgKCEodGhpcy5mb250IGluc3RhbmNlb2YgY2MuQml0bWFwRm9udCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgUmVuZGVyQ29tcG9uZW50LnByb3RvdHlwZS5fdXBkYXRlQ29sb3IuY2FsbCh0aGlzKTtcbiAgICB9LFxuXG4gICAgX3ZhbGlkYXRlUmVuZGVyICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0cmluZykge1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxlUmVuZGVyKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fbWF0ZXJpYWxzWzBdKSB7XG4gICAgICAgICAgICBsZXQgZm9udCA9IHRoaXMuZm9udDtcbiAgICAgICAgICAgIGlmIChmb250IGluc3RhbmNlb2YgY2MuQml0bWFwRm9udCkge1xuICAgICAgICAgICAgICAgIGxldCBzcHJpdGVGcmFtZSA9IGZvbnQuc3ByaXRlRnJhbWU7XG4gICAgICAgICAgICAgICAgaWYgKHNwcml0ZUZyYW1lICYmIFxuICAgICAgICAgICAgICAgICAgICBzcHJpdGVGcmFtZS50ZXh0dXJlTG9hZGVkKCkgJiZcbiAgICAgICAgICAgICAgICAgICAgZm9udC5fZm50Q29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRpc2FibGVSZW5kZXIoKTtcbiAgICB9LFxuXG4gICAgX3Jlc2V0QXNzZW1ibGVyICgpIHtcbiAgICAgICAgdGhpcy5fZnJhbWUgPSBudWxsO1xuICAgICAgICBSZW5kZXJDb21wb25lbnQucHJvdG90eXBlLl9yZXNldEFzc2VtYmxlci5jYWxsKHRoaXMpO1xuICAgIH0sXG5cbiAgICBfY2hlY2tTdHJpbmdFbXB0eSAoKSB7XG4gICAgICAgIHRoaXMubWFya0ZvclJlbmRlcighIXRoaXMuc3RyaW5nKTtcbiAgICB9LFxuXG4gICAgX29uM0ROb2RlQ2hhbmdlZCAoKSB7XG4gICAgICAgIHRoaXMuX3Jlc2V0QXNzZW1ibGVyKCk7XG4gICAgICAgIHRoaXMuX2FwcGx5Rm9udFRleHR1cmUoKTtcbiAgICB9LFxuXG4gICAgX29uQk1Gb250VGV4dHVyZUxvYWRlZCAoKSB7XG4gICAgICAgIHRoaXMuX2ZyYW1lLl90ZXh0dXJlID0gdGhpcy5mb250LnNwcml0ZUZyYW1lLl90ZXh0dXJlO1xuICAgICAgICB0aGlzLm1hcmtGb3JSZW5kZXIodHJ1ZSk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZU1hdGVyaWFsKCk7XG4gICAgICAgIHRoaXMuX2Fzc2VtYmxlciAmJiB0aGlzLl9hc3NlbWJsZXIudXBkYXRlUmVuZGVyRGF0YSh0aGlzKTtcbiAgICB9LFxuXG4gICAgX2FwcGx5Rm9udFRleHR1cmUgKCkge1xuICAgICAgICBsZXQgZm9udCA9IHRoaXMuZm9udDtcbiAgICAgICAgaWYgKGZvbnQgaW5zdGFuY2VvZiBjYy5CaXRtYXBGb250KSB7XG4gICAgICAgICAgICBsZXQgc3ByaXRlRnJhbWUgPSBmb250LnNwcml0ZUZyYW1lO1xuICAgICAgICAgICAgdGhpcy5fZnJhbWUgPSBzcHJpdGVGcmFtZTtcbiAgICAgICAgICAgIGlmIChzcHJpdGVGcmFtZSkge1xuICAgICAgICAgICAgICAgIHNwcml0ZUZyYW1lLm9uVGV4dHVyZUxvYWRlZCh0aGlzLl9vbkJNRm9udFRleHR1cmVMb2FkZWQsIHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9mcmFtZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZyYW1lID0gbmV3IExhYmVsRnJhbWUoKTtcbiAgICAgICAgICAgIH1cbiBcbiAgICAgICAgICAgIGlmICh0aGlzLmNhY2hlTW9kZSA9PT0gQ2FjaGVNb2RlLkNIQVIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sZXR0ZXJUZXh0dXJlID0gdGhpcy5fYXNzZW1ibGVyLl9nZXRBc3NlbWJsZXJEYXRhKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZnJhbWUuX3JlZnJlc2hUZXh0dXJlKHRoaXMuX2xldHRlclRleHR1cmUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5fdHRmVGV4dHVyZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3R0ZlRleHR1cmUgPSBuZXcgY2MuVGV4dHVyZTJEKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXNzZW1ibGVyRGF0YSA9IHRoaXMuX2Fzc2VtYmxlci5fZ2V0QXNzZW1ibGVyRGF0YSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3R0ZlRleHR1cmUuaW5pdFdpdGhFbGVtZW50KHRoaXMuX2Fzc2VtYmxlckRhdGEuY2FudmFzKTtcbiAgICAgICAgICAgIH0gXG5cbiAgICAgICAgICAgIGlmICh0aGlzLmNhY2hlTW9kZSAhPT0gQ2FjaGVNb2RlLkNIQVIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9mcmFtZS5fcmVzZXREeW5hbWljQXRsYXNGcmFtZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZyYW1lLl9yZWZyZXNoVGV4dHVyZSh0aGlzLl90dGZUZXh0dXJlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlTWF0ZXJpYWwoKTtcbiAgICAgICAgICAgIHRoaXMuX2Fzc2VtYmxlciAmJiB0aGlzLl9hc3NlbWJsZXIudXBkYXRlUmVuZGVyRGF0YSh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1hcmtGb3JWYWxpZGF0ZSgpO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlTWF0ZXJpYWxDYW52YXMgKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2ZyYW1lKSByZXR1cm47XG4gICAgICAgIHRoaXMuX2ZyYW1lLl90ZXh0dXJlLnVybCA9IHRoaXMudXVpZCArICdfdGV4dHVyZSc7XG4gICAgfSxcblxuICAgIF91cGRhdGVNYXRlcmlhbFdlYmdsICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9mcmFtZSkgcmV0dXJuO1xuICAgICAgICBsZXQgbWF0ZXJpYWwgPSB0aGlzLl9tYXRlcmlhbHNbMF07XG4gICAgICAgIG1hdGVyaWFsICYmIG1hdGVyaWFsLnNldFByb3BlcnR5KCd0ZXh0dXJlJywgdGhpcy5fZnJhbWUuX3RleHR1cmUpO1xuICAgIH0sXG5cbiAgICBfZm9yY2VVcGRhdGVSZW5kZXJEYXRhICgpIHtcbiAgICAgICAgdGhpcy5zZXRWZXJ0c0RpcnR5KCk7XG4gICAgICAgIHRoaXMuX3Jlc2V0QXNzZW1ibGVyKCk7XG4gICAgICAgIHRoaXMuX2FwcGx5Rm9udFRleHR1cmUoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgYGxhYmVsLl9lbmFibGVCb2xkYCBpcyBkZXByZWNhdGVkLCB1c2UgYGxhYmVsLmVuYWJsZUJvbGQgPSB0cnVlYCBpbnN0ZWFkIHBsZWFzZS5cbiAgICAgKi9cbiAgICBfZW5hYmxlQm9sZCAoZW5hYmxlZCkge1xuICAgICAgICBpZiAoQ0NfREVCVUcpIHtcbiAgICAgICAgICAgIGNjLndhcm4oJ2BsYWJlbC5fZW5hYmxlQm9sZGAgaXMgZGVwcmVjYXRlZCwgdXNlIGBsYWJlbC5lbmFibGVCb2xkID0gdHJ1ZWAgaW5zdGVhZCBwbGVhc2UnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVuYWJsZUJvbGQgPSAhIWVuYWJsZWQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkIGBsYWJlbC5fZW5hYmxlSXRhbGljc2AgaXMgZGVwcmVjYXRlZCwgdXNlIGBsYWJlbC5lbmFibGVJdGFsaWNzID0gdHJ1ZWAgaW5zdGVhZCBwbGVhc2UuXG4gICAgICovXG4gICAgX2VuYWJsZUl0YWxpY3MgKGVuYWJsZWQpIHtcbiAgICAgICAgaWYgKENDX0RFQlVHKSB7XG4gICAgICAgICAgICBjYy53YXJuKCdgbGFiZWwuX2VuYWJsZUl0YWxpY3NgIGlzIGRlcHJlY2F0ZWQsIHVzZSBgbGFiZWwuZW5hYmxlSXRhbGljcyA9IHRydWVgIGluc3RlYWQgcGxlYXNlJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbmFibGVJdGFsaWMgPSAhIWVuYWJsZWQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkIGBsYWJlbC5fZW5hYmxlVW5kZXJsaW5lYCBpcyBkZXByZWNhdGVkLCB1c2UgYGxhYmVsLmVuYWJsZVVuZGVybGluZSA9IHRydWVgIGluc3RlYWQgcGxlYXNlLlxuICAgICAqL1xuICAgIF9lbmFibGVVbmRlcmxpbmUgKGVuYWJsZWQpIHtcbiAgICAgICAgaWYgKENDX0RFQlVHKSB7XG4gICAgICAgICAgICBjYy53YXJuKCdgbGFiZWwuX2VuYWJsZVVuZGVybGluZWAgaXMgZGVwcmVjYXRlZCwgdXNlIGBsYWJlbC5lbmFibGVVbmRlcmxpbmUgPSB0cnVlYCBpbnN0ZWFkIHBsZWFzZScpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW5hYmxlVW5kZXJsaW5lID0gISFlbmFibGVkO1xuICAgIH0sXG4gfSk7XG5cbiBjYy5MYWJlbCA9IG1vZHVsZS5leHBvcnRzID0gTGFiZWw7XG4iXX0=