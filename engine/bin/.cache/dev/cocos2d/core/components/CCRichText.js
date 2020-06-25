
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCRichText.js';
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
var js = require('../platform/js');

var macro = require('../platform/CCMacro');

var textUtils = require('../utils/text-utils');

var HtmlTextParser = require('../utils/html-text-parser');

var _htmlTextParser = new HtmlTextParser();

var HorizontalAlign = macro.TextAlignment;
var VerticalAlign = macro.VerticalTextAlignment;
var RichTextChildName = "RICHTEXT_CHILD";
var RichTextChildImageName = "RICHTEXT_Image_CHILD";
var CacheMode = cc.Label.CacheMode; // Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this;

    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, arguments);
    };

    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, arguments);
  };
}
/**
 * RichText pool
 */


var pool = new js.Pool(function (node) {
  if (CC_EDITOR) {
    cc.isValid(node) && node.destroy();
    return false;
  }

  if (CC_DEV) {
    cc.assert(!node._parent, 'Recycling node\'s parent should be null!');
  }

  if (!cc.isValid(node)) {
    return false;
  } else {
    var outline = node.getComponent(cc.LabelOutline);

    if (outline) {
      outline.width = 0;
    }
  }

  return true;
}, 20);

pool.get = function (string, richtext) {
  var labelNode = this._get();

  if (!labelNode) {
    labelNode = new cc.PrivateNode(RichTextChildName);
  }

  labelNode.setPosition(0, 0);
  labelNode.setAnchorPoint(0.5, 0.5);
  labelNode.skewX = 0;
  var labelComponent = labelNode.getComponent(cc.Label);

  if (!labelComponent) {
    labelComponent = labelNode.addComponent(cc.Label);
  }

  labelComponent.string = "";
  labelComponent.horizontalAlign = HorizontalAlign.LEFT;
  labelComponent.verticalAlign = VerticalAlign.CENTER;
  return labelNode;
};
/**
 * !#en The RichText Component.
 * !#zh 富文本组件
 * @class RichText
 * @extends Component
 */


var RichText = cc.Class({
  name: 'cc.RichText',
  "extends": cc.Component,
  ctor: function ctor() {
    this._textArray = null;
    this._labelSegments = [];
    this._labelSegmentsCache = [];
    this._linesWidth = [];

    if (CC_EDITOR) {
      this._userDefinedFont = null;
      this._updateRichTextStatus = debounce(this._updateRichText, 200);
    } else {
      this._updateRichTextStatus = this._updateRichText;
    }
  },
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.renderers/RichText',
    help: 'i18n:COMPONENT.help_url.richtext',
    inspector: 'packages://inspector/inspectors/comps/richtext.js',
    executeInEditMode: true
  },
  properties: {
    /**
     * !#en Content string of RichText.
     * !#zh 富文本显示的文本内容。
     * @property {String} string
     */
    string: {
      "default": '<color=#00ff00>Rich</c><color=#0fffff>Text</color>',
      multiline: true,
      tooltip: CC_DEV && 'i18n:COMPONENT.richtext.string',
      notify: function notify() {
        this._updateRichTextStatus();
      }
    },

    /**
     * !#en Horizontal Alignment of each line in RichText.
     * !#zh 文本内容的水平对齐方式。
     * @property {macro.TextAlignment} horizontalAlign
     */
    horizontalAlign: {
      "default": HorizontalAlign.LEFT,
      type: HorizontalAlign,
      tooltip: CC_DEV && 'i18n:COMPONENT.richtext.horizontal_align',
      animatable: false,
      notify: function notify(oldValue) {
        if (this.horizontalAlign === oldValue) return;
        this._layoutDirty = true;

        this._updateRichTextStatus();
      }
    },

    /**
     * !#en Font size of RichText.
     * !#zh 富文本字体大小。
     * @property {Number} fontSize
     */
    fontSize: {
      "default": 40,
      tooltip: CC_DEV && 'i18n:COMPONENT.richtext.font_size',
      notify: function notify(oldValue) {
        if (this.fontSize === oldValue) return;
        this._layoutDirty = true;

        this._updateRichTextStatus();
      }
    },

    /**
     * !#en Custom System font of RichText
     * !#zh 富文本定制系统字体
     * @property {String} fontFamily
     */
    _fontFamily: "Arial",
    fontFamily: {
      tooltip: CC_DEV && 'i18n:COMPONENT.richtext.font_family',
      get: function get() {
        return this._fontFamily;
      },
      set: function set(value) {
        if (this._fontFamily === value) return;
        this._fontFamily = value;
        this._layoutDirty = true;

        this._updateRichTextStatus();
      },
      animatable: false
    },

    /**
     * !#en Custom TTF font of RichText
     * !#zh  富文本定制字体
     * @property {cc.TTFFont} font
     */
    font: {
      "default": null,
      type: cc.TTFFont,
      tooltip: CC_DEV && 'i18n:COMPONENT.richtext.font',
      notify: function notify(oldValue) {
        if (this.font === oldValue) return;
        this._layoutDirty = true;

        if (this.font) {
          if (CC_EDITOR) {
            this._userDefinedFont = this.font;
          }

          this.useSystemFont = false;

          this._onTTFLoaded();
        } else {
          this.useSystemFont = true;
        }

        this._updateRichTextStatus();
      }
    },

    /**
     * !#en Whether use system font name or not.
     * !#zh 是否使用系统字体。
     * @property {Boolean} useSystemFont
     */
    _isSystemFontUsed: true,
    useSystemFont: {
      get: function get() {
        return this._isSystemFontUsed;
      },
      set: function set(value) {
        if (this._isSystemFontUsed === value) {
          return;
        }

        this._isSystemFontUsed = value;

        if (CC_EDITOR) {
          if (value) {
            this.font = null;
          } else if (this._userDefinedFont) {
            this.font = this._userDefinedFont;
            return;
          }
        }

        this._layoutDirty = true;

        this._updateRichTextStatus();
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.richtext.system_font'
    },

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

        this._updateRichTextStatus();
      },
      animatable: false
    },

    /**
     * !#en The maximize width of the RichText
     * !#zh 富文本的最大宽度
     * @property {Number} maxWidth
     */
    maxWidth: {
      "default": 0,
      tooltip: CC_DEV && 'i18n:COMPONENT.richtext.max_width',
      notify: function notify(oldValue) {
        if (this.maxWidth === oldValue) return;
        this._layoutDirty = true;

        this._updateRichTextStatus();
      }
    },

    /**
     * !#en Line Height of RichText.
     * !#zh 富文本行高。
     * @property {Number} lineHeight
     */
    lineHeight: {
      "default": 40,
      tooltip: CC_DEV && 'i18n:COMPONENT.richtext.line_height',
      notify: function notify(oldValue) {
        if (this.lineHeight === oldValue) return;
        this._layoutDirty = true;

        this._updateRichTextStatus();
      }
    },

    /**
     * !#en The image atlas for the img tag. For each src value in the img tag, there should be a valid spriteFrame in the image atlas.
     * !#zh 对于 img 标签里面的 src 属性名称，都需要在 imageAtlas 里面找到一个有效的 spriteFrame，否则 img tag 会判定为无效。
     * @property {SpriteAtlas} imageAtlas
     */
    imageAtlas: {
      "default": null,
      type: cc.SpriteAtlas,
      tooltip: CC_DEV && 'i18n:COMPONENT.richtext.image_atlas',
      notify: function notify(oldValue) {
        if (this.imageAtlas === oldValue) return;
        this._layoutDirty = true;

        this._updateRichTextStatus();
      }
    },

    /**
     * !#en
     * Once checked, the RichText will block all input events (mouse and touch) within
     * the bounding box of the node, preventing the input from penetrating into the underlying node.
     * !#zh
     * 选中此选项后，RichText 将阻止节点边界框中的所有输入事件（鼠标和触摸），从而防止输入事件穿透到底层节点。
     * @property {Boolean} handleTouchEvent
     * @default true
     */
    handleTouchEvent: {
      "default": true,
      tooltip: CC_DEV && 'i18n:COMPONENT.richtext.handleTouchEvent',
      notify: function notify(oldValue) {
        if (this.handleTouchEvent === oldValue) return;

        if (this.enabledInHierarchy) {
          this.handleTouchEvent ? this._addEventListeners() : this._removeEventListeners();
        }
      }
    }
  },
  statics: {
    HorizontalAlign: HorizontalAlign,
    VerticalAlign: VerticalAlign
  },
  onEnable: function onEnable() {
    if (this.handleTouchEvent) {
      this._addEventListeners();
    }

    this._updateRichText();

    this._activateChildren(true);
  },
  onDisable: function onDisable() {
    if (this.handleTouchEvent) {
      this._removeEventListeners();
    }

    this._activateChildren(false);
  },
  start: function start() {
    this._onTTFLoaded();
  },
  _onColorChanged: function _onColorChanged(parentColor) {
    var children = this.node.children;
    children.forEach(function (childNode) {
      childNode.color = parentColor;
    });
  },
  _addEventListeners: function _addEventListeners() {
    this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
    this.node.on(cc.Node.EventType.COLOR_CHANGED, this._onColorChanged, this);
  },
  _removeEventListeners: function _removeEventListeners() {
    this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
    this.node.off(cc.Node.EventType.COLOR_CHANGED, this._onColorChanged, this);
  },
  _updateLabelSegmentTextAttributes: function _updateLabelSegmentTextAttributes() {
    this._labelSegments.forEach(function (item) {
      this._applyTextAttribute(item, null, true);
    }.bind(this));
  },
  _createFontLabel: function _createFontLabel(string) {
    return pool.get(string, this);
  },
  _onTTFLoaded: function _onTTFLoaded() {
    if (this.font instanceof cc.TTFFont) {
      if (this.font._nativeAsset) {
        this._layoutDirty = true;

        this._updateRichText();
      } else {
        var self = this;
        cc.loader.load(this.font.nativeUrl, function (err, fontFamily) {
          self._layoutDirty = true;

          self._updateRichText();
        });
      }
    } else {
      this._layoutDirty = true;

      this._updateRichText();
    }
  },
  _measureText: function _measureText(styleIndex, string) {
    var self = this;

    var func = function func(string) {
      var label;

      if (self._labelSegmentsCache.length === 0) {
        label = self._createFontLabel(string);

        self._labelSegmentsCache.push(label);
      } else {
        label = self._labelSegmentsCache[0];
      }

      label._styleIndex = styleIndex;

      self._applyTextAttribute(label, string, true);

      var labelSize = label.getContentSize();
      return labelSize.width;
    };

    if (string) {
      return func(string);
    } else {
      return func;
    }
  },
  _onTouchEnded: function _onTouchEnded(event) {
    var _this = this;

    var components = this.node.getComponents(cc.Component);

    var _loop = function _loop(i) {
      var labelSegment = _this._labelSegments[i];
      var clickHandler = labelSegment._clickHandler;
      var clickParam = labelSegment._clickParam;

      if (clickHandler && _this._containsTouchLocation(labelSegment, event.touch.getLocation())) {
        components.forEach(function (component) {
          if (component.enabledInHierarchy && component[clickHandler]) {
            component[clickHandler](event, clickParam);
          }
        });
        event.stopPropagation();
      }
    };

    for (var i = 0; i < this._labelSegments.length; ++i) {
      _loop(i);
    }
  },
  _containsTouchLocation: function _containsTouchLocation(label, point) {
    var myRect = label.getBoundingBoxToWorld();
    return myRect.contains(point);
  },
  _resetState: function _resetState() {
    var children = this.node.children;

    for (var i = children.length - 1; i >= 0; i--) {
      var child = children[i];

      if (child.name === RichTextChildName || child.name === RichTextChildImageName) {
        if (child.parent === this.node) {
          child.parent = null;
        } else {
          // In case child.parent !== this.node, child cannot be removed from children
          children.splice(i, 1);
        }

        if (child.name === RichTextChildName) {
          pool.put(child);
        }
      }
    }

    this._labelSegments.length = 0;
    this._labelSegmentsCache.length = 0;
    this._linesWidth.length = 0;
    this._lineOffsetX = 0;
    this._lineCount = 1;
    this._labelWidth = 0;
    this._labelHeight = 0;
    this._layoutDirty = true;
  },
  onRestore: CC_EDITOR && function () {
    // TODO: refine undo/redo system
    // Because undo/redo will not call onEnable/onDisable,
    // we need call onEnable/onDisable manually to active/disactive children nodes.
    if (this.enabledInHierarchy) {
      this.onEnable();
    } else {
      this.onDisable();
    }
  },
  _activateChildren: function _activateChildren(active) {
    for (var i = this.node.children.length - 1; i >= 0; i--) {
      var child = this.node.children[i];

      if (child.name === RichTextChildName || child.name === RichTextChildImageName) {
        child.active = active;
      }
    }
  },
  _addLabelSegment: function _addLabelSegment(stringToken, styleIndex) {
    var labelSegment;

    if (this._labelSegmentsCache.length === 0) {
      labelSegment = this._createFontLabel(stringToken);
    } else {
      labelSegment = this._labelSegmentsCache.pop();
    }

    labelSegment._styleIndex = styleIndex;
    labelSegment._lineCount = this._lineCount;
    labelSegment.active = this.node.active;
    labelSegment.setAnchorPoint(0, 0);

    this._applyTextAttribute(labelSegment, stringToken);

    this.node.addChild(labelSegment);

    this._labelSegments.push(labelSegment);

    return labelSegment;
  },
  _updateRichTextWithMaxWidth: function _updateRichTextWithMaxWidth(labelString, labelWidth, styleIndex) {
    var fragmentWidth = labelWidth;
    var labelSegment;

    if (this._lineOffsetX > 0 && fragmentWidth + this._lineOffsetX > this.maxWidth) {
      //concat previous line
      var checkStartIndex = 0;

      while (this._lineOffsetX <= this.maxWidth) {
        var checkEndIndex = this._getFirstWordLen(labelString, checkStartIndex, labelString.length);

        var checkString = labelString.substr(checkStartIndex, checkEndIndex);

        var checkStringWidth = this._measureText(styleIndex, checkString);

        if (this._lineOffsetX + checkStringWidth <= this.maxWidth) {
          this._lineOffsetX += checkStringWidth;
          checkStartIndex += checkEndIndex;
        } else {
          if (checkStartIndex > 0) {
            var remainingString = labelString.substr(0, checkStartIndex);

            this._addLabelSegment(remainingString, styleIndex);

            labelString = labelString.substr(checkStartIndex, labelString.length);
            fragmentWidth = this._measureText(styleIndex, labelString);
          }

          this._updateLineInfo();

          break;
        }
      }
    }

    if (fragmentWidth > this.maxWidth) {
      var fragments = textUtils.fragmentText(labelString, fragmentWidth, this.maxWidth, this._measureText(styleIndex));

      for (var k = 0; k < fragments.length; ++k) {
        var splitString = fragments[k];
        labelSegment = this._addLabelSegment(splitString, styleIndex);
        var labelSize = labelSegment.getContentSize();
        this._lineOffsetX += labelSize.width;

        if (fragments.length > 1 && k < fragments.length - 1) {
          this._updateLineInfo();
        }
      }
    } else {
      this._lineOffsetX += fragmentWidth;

      this._addLabelSegment(labelString, styleIndex);
    }
  },
  _isLastComponentCR: function _isLastComponentCR(stringToken) {
    return stringToken.length - 1 === stringToken.lastIndexOf("\n");
  },
  _updateLineInfo: function _updateLineInfo() {
    this._linesWidth.push(this._lineOffsetX);

    this._lineOffsetX = 0;
    this._lineCount++;
  },
  _needsUpdateTextLayout: function _needsUpdateTextLayout(newTextArray) {
    if (this._layoutDirty || !this._textArray || !newTextArray) {
      return true;
    }

    if (this._textArray.length !== newTextArray.length) {
      return true;
    }

    for (var i = 0; i < this._textArray.length; ++i) {
      var oldItem = this._textArray[i];
      var newItem = newTextArray[i];

      if (oldItem.text !== newItem.text) {
        return true;
      } else {
        if (oldItem.style) {
          if (newItem.style) {
            if (!!newItem.style.outline !== !!oldItem.style.outline) {
              return true;
            }

            if (oldItem.style.size !== newItem.style.size || oldItem.style.italic !== newItem.style.italic || oldItem.style.isImage !== newItem.style.isImage) {
              return true;
            }

            if (oldItem.style.isImage === newItem.style.isImage) {
              if (oldItem.style.src !== newItem.style.src) {
                return true;
              }
            }
          } else {
            if (oldItem.style.size || oldItem.style.italic || oldItem.style.isImage || oldItem.style.outline) {
              return true;
            }
          }
        } else {
          if (newItem.style) {
            if (newItem.style.size || newItem.style.italic || newItem.style.isImage || newItem.style.outline) {
              return true;
            }
          }
        }
      }
    }

    return false;
  },
  _addRichTextImageElement: function _addRichTextImageElement(richTextElement) {
    var spriteFrameName = richTextElement.style.src;
    var spriteFrame = this.imageAtlas.getSpriteFrame(spriteFrameName);

    if (spriteFrame) {
      var spriteNode = new cc.PrivateNode(RichTextChildImageName);
      var spriteComponent = spriteNode.addComponent(cc.Sprite);

      switch (richTextElement.style.imageAlign) {
        case 'top':
          spriteNode.setAnchorPoint(0, 1);
          break;

        case 'center':
          spriteNode.setAnchorPoint(0, 0.5);
          break;

        default:
          spriteNode.setAnchorPoint(0, 0);
          break;
      }

      if (richTextElement.style.imageOffset) spriteNode._imageOffset = richTextElement.style.imageOffset;
      spriteComponent.type = cc.Sprite.Type.SLICED;
      spriteComponent.sizeMode = cc.Sprite.SizeMode.CUSTOM;
      this.node.addChild(spriteNode);

      this._labelSegments.push(spriteNode);

      var spriteRect = spriteFrame.getRect();
      var scaleFactor = 1;
      var spriteWidth = spriteRect.width;
      var spriteHeight = spriteRect.height;
      var expectWidth = richTextElement.style.imageWidth;
      var expectHeight = richTextElement.style.imageHeight;

      if (expectHeight > 0) {
        scaleFactor = expectHeight / spriteHeight;
        spriteWidth = spriteWidth * scaleFactor;
        spriteHeight = spriteHeight * scaleFactor;
      } else {
        scaleFactor = this.lineHeight / spriteHeight;
        spriteWidth = spriteWidth * scaleFactor;
        spriteHeight = spriteHeight * scaleFactor;
      }

      if (expectWidth > 0) spriteWidth = expectWidth;

      if (this.maxWidth > 0) {
        if (this._lineOffsetX + spriteWidth > this.maxWidth) {
          this._updateLineInfo();
        }

        this._lineOffsetX += spriteWidth;
      } else {
        this._lineOffsetX += spriteWidth;

        if (this._lineOffsetX > this._labelWidth) {
          this._labelWidth = this._lineOffsetX;
        }
      }

      spriteComponent.spriteFrame = spriteFrame;
      spriteNode.setContentSize(spriteWidth, spriteHeight);
      spriteNode._lineCount = this._lineCount;

      if (richTextElement.style.event) {
        if (richTextElement.style.event.click) {
          spriteNode._clickHandler = richTextElement.style.event.click;
        }

        if (richTextElement.style.event.param) {
          spriteNode._clickParam = richTextElement.style.event.param;
        } else {
          spriteNode._clickParam = '';
        }
      } else {
        spriteNode._clickHandler = null;
      }
    } else {
      cc.warnID(4400);
    }
  },
  _updateRichText: function _updateRichText() {
    if (!this.enabled) return;

    var newTextArray = _htmlTextParser.parse(this.string);

    if (!this._needsUpdateTextLayout(newTextArray)) {
      this._textArray = newTextArray;

      this._updateLabelSegmentTextAttributes();

      return;
    }

    this._textArray = newTextArray;

    this._resetState();

    var lastEmptyLine = false;
    var label;
    var labelSize;

    for (var i = 0; i < this._textArray.length; ++i) {
      var richTextElement = this._textArray[i];
      var text = richTextElement.text; //handle <br/> <img /> tag

      if (text === "") {
        if (richTextElement.style && richTextElement.style.newline) {
          this._updateLineInfo();

          continue;
        }

        if (richTextElement.style && richTextElement.style.isImage && this.imageAtlas) {
          this._addRichTextImageElement(richTextElement);

          continue;
        }
      }

      var multilineTexts = text.split("\n");

      for (var j = 0; j < multilineTexts.length; ++j) {
        var labelString = multilineTexts[j];

        if (labelString === "") {
          //for continues \n
          if (this._isLastComponentCR(text) && j === multilineTexts.length - 1) {
            continue;
          }

          this._updateLineInfo();

          lastEmptyLine = true;
          continue;
        }

        lastEmptyLine = false;

        if (this.maxWidth > 0) {
          var labelWidth = this._measureText(i, labelString);

          this._updateRichTextWithMaxWidth(labelString, labelWidth, i);

          if (multilineTexts.length > 1 && j < multilineTexts.length - 1) {
            this._updateLineInfo();
          }
        } else {
          label = this._addLabelSegment(labelString, i);
          labelSize = label.getContentSize();
          this._lineOffsetX += labelSize.width;

          if (this._lineOffsetX > this._labelWidth) {
            this._labelWidth = this._lineOffsetX;
          }

          if (multilineTexts.length > 1 && j < multilineTexts.length - 1) {
            this._updateLineInfo();
          }
        }
      }
    }

    if (!lastEmptyLine) {
      this._linesWidth.push(this._lineOffsetX);
    }

    if (this.maxWidth > 0) {
      this._labelWidth = this.maxWidth;
    }

    this._labelHeight = (this._lineCount + textUtils.BASELINE_RATIO) * this.lineHeight; // trigger "size-changed" event

    this.node.setContentSize(this._labelWidth, this._labelHeight);

    this._updateRichTextPosition();

    this._layoutDirty = false;
  },
  _getFirstWordLen: function _getFirstWordLen(text, startIndex, textLen) {
    var character = text.charAt(startIndex);

    if (textUtils.isUnicodeCJK(character) || textUtils.isUnicodeSpace(character)) {
      return 1;
    }

    var len = 1;

    for (var index = startIndex + 1; index < textLen; ++index) {
      character = text.charAt(index);

      if (textUtils.isUnicodeSpace(character) || textUtils.isUnicodeCJK(character)) {
        break;
      }

      len++;
    }

    return len;
  },
  _updateRichTextPosition: function _updateRichTextPosition() {
    var nextTokenX = 0;
    var nextLineIndex = 1;
    var totalLineCount = this._lineCount;

    for (var i = 0; i < this._labelSegments.length; ++i) {
      var label = this._labelSegments[i];
      var lineCount = label._lineCount;

      if (lineCount > nextLineIndex) {
        nextTokenX = 0;
        nextLineIndex = lineCount;
      }

      var lineOffsetX = 0; // let nodeAnchorXOffset = (0.5 - this.node.anchorX) * this._labelWidth;

      switch (this.horizontalAlign) {
        case HorizontalAlign.LEFT:
          lineOffsetX = -this._labelWidth / 2;
          break;

        case HorizontalAlign.CENTER:
          lineOffsetX = -this._linesWidth[lineCount - 1] / 2;
          break;

        case HorizontalAlign.RIGHT:
          lineOffsetX = this._labelWidth / 2 - this._linesWidth[lineCount - 1];
          break;

        default:
          break;
      }

      label.x = nextTokenX + lineOffsetX;
      var labelSize = label.getContentSize();
      label.y = this.lineHeight * (totalLineCount - lineCount) - this._labelHeight / 2;

      if (lineCount === nextLineIndex) {
        nextTokenX += labelSize.width;
      }

      var sprite = label.getComponent(cc.Sprite);

      if (sprite) {
        // adjust img align (from <img align=top|center|bottom>)
        var lineHeightSet = this.lineHeight;
        var lineHeightReal = this.lineHeight * (1 + textUtils.BASELINE_RATIO); //single line node height

        switch (label.anchorY) {
          case 1:
            label.y += lineHeightSet + (lineHeightReal - lineHeightSet) / 2;
            break;

          case 0.5:
            label.y += lineHeightReal / 2;
            break;

          default:
            label.y += (lineHeightReal - lineHeightSet) / 2;
            break;
        } // adjust img offset (from <img offset=12|12,34>)


        if (label._imageOffset) {
          var offsets = label._imageOffset.split(',');

          if (offsets.length === 1 && offsets[0]) {
            var offsetY = parseFloat(offsets[0]);
            if (Number.isInteger(offsetY)) label.y += offsetY;
          } else if (offsets.length === 2) {
            var offsetX = parseFloat(offsets[0]);

            var _offsetY = parseFloat(offsets[1]);

            if (Number.isInteger(offsetX)) label.x += offsetX;
            if (Number.isInteger(_offsetY)) label.y += _offsetY;
          }
        }
      } //adjust y for label with outline


      var outline = label.getComponent(cc.LabelOutline);
      if (outline && outline.width) label.y = label.y - outline.width;
    }
  },
  _convertLiteralColorValue: function _convertLiteralColorValue(color) {
    var colorValue = color.toUpperCase();

    if (cc.Color[colorValue]) {
      return cc.Color[colorValue];
    } else {
      var out = cc.color();
      return out.fromHEX(color);
    }
  },
  // When string is null, it means that the text does not need to be updated. 
  _applyTextAttribute: function _applyTextAttribute(labelNode, string, force) {
    var labelComponent = labelNode.getComponent(cc.Label);

    if (!labelComponent) {
      return;
    }

    var index = labelNode._styleIndex;
    var textStyle = null;

    if (this._textArray[index]) {
      textStyle = this._textArray[index].style;
    }

    if (textStyle && textStyle.color) {
      labelNode.color = this._convertLiteralColorValue(textStyle.color);
    } else {
      labelNode.color = this.node.color;
    }

    labelComponent.cacheMode = this.cacheMode;
    var isAsset = this.font instanceof cc.Font;

    if (isAsset && !this._isSystemFontUsed) {
      labelComponent.font = this.font;
    } else {
      labelComponent.fontFamily = this.fontFamily;
    }

    labelComponent.useSystemFont = this._isSystemFontUsed;
    labelComponent.lineHeight = this.lineHeight;
    labelComponent.enableBold = textStyle && textStyle.bold;
    labelComponent.enableItalics = textStyle && textStyle.italic; //TODO: temporary implementation, the italic effect should be implemented in the internal of label-assembler.

    if (textStyle && textStyle.italic) {
      labelNode.skewX = 12;
    }

    labelComponent.enableUnderline = textStyle && textStyle.underline;

    if (textStyle && textStyle.outline) {
      var labelOutlineComponent = labelNode.getComponent(cc.LabelOutline);

      if (!labelOutlineComponent) {
        labelOutlineComponent = labelNode.addComponent(cc.LabelOutline);
      }

      labelOutlineComponent.color = this._convertLiteralColorValue(textStyle.outline.color);
      labelOutlineComponent.width = textStyle.outline.width;
    }

    if (textStyle && textStyle.size) {
      labelComponent.fontSize = textStyle.size;
    } else {
      labelComponent.fontSize = this.fontSize;
    }

    if (string !== null) {
      if (typeof string !== 'string') {
        string = '' + string;
      }

      labelComponent.string = string;
    }

    force && labelComponent._forceUpdateRenderData();

    if (textStyle && textStyle.event) {
      if (textStyle.event.click) {
        labelNode._clickHandler = textStyle.event.click;
      }

      if (textStyle.event.param) {
        labelNode._clickParam = textStyle.event.param;
      } else {
        labelNode._clickParam = '';
      }
    } else {
      labelNode._clickHandler = null;
    }
  },
  onDestroy: function onDestroy() {
    for (var i = 0; i < this._labelSegments.length; ++i) {
      this._labelSegments[i].removeFromParent();

      pool.put(this._labelSegments[i]);
    }
  }
});
cc.RichText = module.exports = RichText;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDUmljaFRleHQuanMiXSwibmFtZXMiOlsianMiLCJyZXF1aXJlIiwibWFjcm8iLCJ0ZXh0VXRpbHMiLCJIdG1sVGV4dFBhcnNlciIsIl9odG1sVGV4dFBhcnNlciIsIkhvcml6b250YWxBbGlnbiIsIlRleHRBbGlnbm1lbnQiLCJWZXJ0aWNhbEFsaWduIiwiVmVydGljYWxUZXh0QWxpZ25tZW50IiwiUmljaFRleHRDaGlsZE5hbWUiLCJSaWNoVGV4dENoaWxkSW1hZ2VOYW1lIiwiQ2FjaGVNb2RlIiwiY2MiLCJMYWJlbCIsImRlYm91bmNlIiwiZnVuYyIsIndhaXQiLCJpbW1lZGlhdGUiLCJ0aW1lb3V0IiwiY29udGV4dCIsImxhdGVyIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJjYWxsTm93IiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsInBvb2wiLCJQb29sIiwibm9kZSIsIkNDX0VESVRPUiIsImlzVmFsaWQiLCJkZXN0cm95IiwiQ0NfREVWIiwiYXNzZXJ0IiwiX3BhcmVudCIsIm91dGxpbmUiLCJnZXRDb21wb25lbnQiLCJMYWJlbE91dGxpbmUiLCJ3aWR0aCIsImdldCIsInN0cmluZyIsInJpY2h0ZXh0IiwibGFiZWxOb2RlIiwiX2dldCIsIlByaXZhdGVOb2RlIiwic2V0UG9zaXRpb24iLCJzZXRBbmNob3JQb2ludCIsInNrZXdYIiwibGFiZWxDb21wb25lbnQiLCJhZGRDb21wb25lbnQiLCJob3Jpem9udGFsQWxpZ24iLCJMRUZUIiwidmVydGljYWxBbGlnbiIsIkNFTlRFUiIsIlJpY2hUZXh0IiwiQ2xhc3MiLCJuYW1lIiwiQ29tcG9uZW50IiwiY3RvciIsIl90ZXh0QXJyYXkiLCJfbGFiZWxTZWdtZW50cyIsIl9sYWJlbFNlZ21lbnRzQ2FjaGUiLCJfbGluZXNXaWR0aCIsIl91c2VyRGVmaW5lZEZvbnQiLCJfdXBkYXRlUmljaFRleHRTdGF0dXMiLCJfdXBkYXRlUmljaFRleHQiLCJlZGl0b3IiLCJtZW51IiwiaGVscCIsImluc3BlY3RvciIsImV4ZWN1dGVJbkVkaXRNb2RlIiwicHJvcGVydGllcyIsIm11bHRpbGluZSIsInRvb2x0aXAiLCJub3RpZnkiLCJ0eXBlIiwiYW5pbWF0YWJsZSIsIm9sZFZhbHVlIiwiX2xheW91dERpcnR5IiwiZm9udFNpemUiLCJfZm9udEZhbWlseSIsImZvbnRGYW1pbHkiLCJzZXQiLCJ2YWx1ZSIsImZvbnQiLCJUVEZGb250IiwidXNlU3lzdGVtRm9udCIsIl9vblRURkxvYWRlZCIsIl9pc1N5c3RlbUZvbnRVc2VkIiwiY2FjaGVNb2RlIiwiTk9ORSIsIm1heFdpZHRoIiwibGluZUhlaWdodCIsImltYWdlQXRsYXMiLCJTcHJpdGVBdGxhcyIsImhhbmRsZVRvdWNoRXZlbnQiLCJlbmFibGVkSW5IaWVyYXJjaHkiLCJfYWRkRXZlbnRMaXN0ZW5lcnMiLCJfcmVtb3ZlRXZlbnRMaXN0ZW5lcnMiLCJzdGF0aWNzIiwib25FbmFibGUiLCJfYWN0aXZhdGVDaGlsZHJlbiIsIm9uRGlzYWJsZSIsInN0YXJ0IiwiX29uQ29sb3JDaGFuZ2VkIiwicGFyZW50Q29sb3IiLCJjaGlsZHJlbiIsImZvckVhY2giLCJjaGlsZE5vZGUiLCJjb2xvciIsIm9uIiwiTm9kZSIsIkV2ZW50VHlwZSIsIlRPVUNIX0VORCIsIl9vblRvdWNoRW5kZWQiLCJDT0xPUl9DSEFOR0VEIiwib2ZmIiwiX3VwZGF0ZUxhYmVsU2VnbWVudFRleHRBdHRyaWJ1dGVzIiwiaXRlbSIsIl9hcHBseVRleHRBdHRyaWJ1dGUiLCJiaW5kIiwiX2NyZWF0ZUZvbnRMYWJlbCIsIl9uYXRpdmVBc3NldCIsInNlbGYiLCJsb2FkZXIiLCJsb2FkIiwibmF0aXZlVXJsIiwiZXJyIiwiX21lYXN1cmVUZXh0Iiwic3R5bGVJbmRleCIsImxhYmVsIiwibGVuZ3RoIiwicHVzaCIsIl9zdHlsZUluZGV4IiwibGFiZWxTaXplIiwiZ2V0Q29udGVudFNpemUiLCJldmVudCIsImNvbXBvbmVudHMiLCJnZXRDb21wb25lbnRzIiwiaSIsImxhYmVsU2VnbWVudCIsImNsaWNrSGFuZGxlciIsIl9jbGlja0hhbmRsZXIiLCJjbGlja1BhcmFtIiwiX2NsaWNrUGFyYW0iLCJfY29udGFpbnNUb3VjaExvY2F0aW9uIiwidG91Y2giLCJnZXRMb2NhdGlvbiIsImNvbXBvbmVudCIsInN0b3BQcm9wYWdhdGlvbiIsInBvaW50IiwibXlSZWN0IiwiZ2V0Qm91bmRpbmdCb3hUb1dvcmxkIiwiY29udGFpbnMiLCJfcmVzZXRTdGF0ZSIsImNoaWxkIiwicGFyZW50Iiwic3BsaWNlIiwicHV0IiwiX2xpbmVPZmZzZXRYIiwiX2xpbmVDb3VudCIsIl9sYWJlbFdpZHRoIiwiX2xhYmVsSGVpZ2h0Iiwib25SZXN0b3JlIiwiYWN0aXZlIiwiX2FkZExhYmVsU2VnbWVudCIsInN0cmluZ1Rva2VuIiwicG9wIiwiYWRkQ2hpbGQiLCJfdXBkYXRlUmljaFRleHRXaXRoTWF4V2lkdGgiLCJsYWJlbFN0cmluZyIsImxhYmVsV2lkdGgiLCJmcmFnbWVudFdpZHRoIiwiY2hlY2tTdGFydEluZGV4IiwiY2hlY2tFbmRJbmRleCIsIl9nZXRGaXJzdFdvcmRMZW4iLCJjaGVja1N0cmluZyIsInN1YnN0ciIsImNoZWNrU3RyaW5nV2lkdGgiLCJyZW1haW5pbmdTdHJpbmciLCJfdXBkYXRlTGluZUluZm8iLCJmcmFnbWVudHMiLCJmcmFnbWVudFRleHQiLCJrIiwic3BsaXRTdHJpbmciLCJfaXNMYXN0Q29tcG9uZW50Q1IiLCJsYXN0SW5kZXhPZiIsIl9uZWVkc1VwZGF0ZVRleHRMYXlvdXQiLCJuZXdUZXh0QXJyYXkiLCJvbGRJdGVtIiwibmV3SXRlbSIsInRleHQiLCJzdHlsZSIsInNpemUiLCJpdGFsaWMiLCJpc0ltYWdlIiwic3JjIiwiX2FkZFJpY2hUZXh0SW1hZ2VFbGVtZW50IiwicmljaFRleHRFbGVtZW50Iiwic3ByaXRlRnJhbWVOYW1lIiwic3ByaXRlRnJhbWUiLCJnZXRTcHJpdGVGcmFtZSIsInNwcml0ZU5vZGUiLCJzcHJpdGVDb21wb25lbnQiLCJTcHJpdGUiLCJpbWFnZUFsaWduIiwiaW1hZ2VPZmZzZXQiLCJfaW1hZ2VPZmZzZXQiLCJUeXBlIiwiU0xJQ0VEIiwic2l6ZU1vZGUiLCJTaXplTW9kZSIsIkNVU1RPTSIsInNwcml0ZVJlY3QiLCJnZXRSZWN0Iiwic2NhbGVGYWN0b3IiLCJzcHJpdGVXaWR0aCIsInNwcml0ZUhlaWdodCIsImhlaWdodCIsImV4cGVjdFdpZHRoIiwiaW1hZ2VXaWR0aCIsImV4cGVjdEhlaWdodCIsImltYWdlSGVpZ2h0Iiwic2V0Q29udGVudFNpemUiLCJjbGljayIsInBhcmFtIiwid2FybklEIiwiZW5hYmxlZCIsInBhcnNlIiwibGFzdEVtcHR5TGluZSIsIm5ld2xpbmUiLCJtdWx0aWxpbmVUZXh0cyIsInNwbGl0IiwiaiIsIkJBU0VMSU5FX1JBVElPIiwiX3VwZGF0ZVJpY2hUZXh0UG9zaXRpb24iLCJzdGFydEluZGV4IiwidGV4dExlbiIsImNoYXJhY3RlciIsImNoYXJBdCIsImlzVW5pY29kZUNKSyIsImlzVW5pY29kZVNwYWNlIiwibGVuIiwiaW5kZXgiLCJuZXh0VG9rZW5YIiwibmV4dExpbmVJbmRleCIsInRvdGFsTGluZUNvdW50IiwibGluZUNvdW50IiwibGluZU9mZnNldFgiLCJSSUdIVCIsIngiLCJ5Iiwic3ByaXRlIiwibGluZUhlaWdodFNldCIsImxpbmVIZWlnaHRSZWFsIiwiYW5jaG9yWSIsIm9mZnNldHMiLCJvZmZzZXRZIiwicGFyc2VGbG9hdCIsIk51bWJlciIsImlzSW50ZWdlciIsIm9mZnNldFgiLCJfY29udmVydExpdGVyYWxDb2xvclZhbHVlIiwiY29sb3JWYWx1ZSIsInRvVXBwZXJDYXNlIiwiQ29sb3IiLCJvdXQiLCJmcm9tSEVYIiwiZm9yY2UiLCJ0ZXh0U3R5bGUiLCJpc0Fzc2V0IiwiRm9udCIsImVuYWJsZUJvbGQiLCJib2xkIiwiZW5hYmxlSXRhbGljcyIsImVuYWJsZVVuZGVybGluZSIsInVuZGVybGluZSIsImxhYmVsT3V0bGluZUNvbXBvbmVudCIsIl9mb3JjZVVwZGF0ZVJlbmRlckRhdGEiLCJvbkRlc3Ryb3kiLCJyZW1vdmVGcm9tUGFyZW50IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLElBQU1BLEVBQUUsR0FBR0MsT0FBTyxDQUFDLGdCQUFELENBQWxCOztBQUNBLElBQU1DLEtBQUssR0FBR0QsT0FBTyxDQUFDLHFCQUFELENBQXJCOztBQUNBLElBQU1FLFNBQVMsR0FBR0YsT0FBTyxDQUFDLHFCQUFELENBQXpCOztBQUNBLElBQU1HLGNBQWMsR0FBR0gsT0FBTyxDQUFDLDJCQUFELENBQTlCOztBQUNBLElBQU1JLGVBQWUsR0FBRyxJQUFJRCxjQUFKLEVBQXhCOztBQUVBLElBQU1FLGVBQWUsR0FBR0osS0FBSyxDQUFDSyxhQUE5QjtBQUNBLElBQU1DLGFBQWEsR0FBR04sS0FBSyxDQUFDTyxxQkFBNUI7QUFDQSxJQUFNQyxpQkFBaUIsR0FBRyxnQkFBMUI7QUFDQSxJQUFNQyxzQkFBc0IsR0FBRyxzQkFBL0I7QUFDQSxJQUFNQyxTQUFTLEdBQUdDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTRixTQUEzQixFQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLFNBQVNHLFFBQVQsQ0FBa0JDLElBQWxCLEVBQXdCQyxJQUF4QixFQUE4QkMsU0FBOUIsRUFBeUM7QUFDckMsTUFBSUMsT0FBSjtBQUNBLFNBQU8sWUFBWTtBQUNmLFFBQUlDLE9BQU8sR0FBRyxJQUFkOztBQUNBLFFBQUlDLEtBQUssR0FBRyxTQUFSQSxLQUFRLEdBQVk7QUFDcEJGLE1BQUFBLE9BQU8sR0FBRyxJQUFWO0FBQ0EsVUFBSSxDQUFDRCxTQUFMLEVBQWdCRixJQUFJLENBQUNNLEtBQUwsQ0FBV0YsT0FBWCxFQUFvQkcsU0FBcEI7QUFDbkIsS0FIRDs7QUFJQSxRQUFJQyxPQUFPLEdBQUdOLFNBQVMsSUFBSSxDQUFDQyxPQUE1QjtBQUNBTSxJQUFBQSxZQUFZLENBQUNOLE9BQUQsQ0FBWjtBQUNBQSxJQUFBQSxPQUFPLEdBQUdPLFVBQVUsQ0FBQ0wsS0FBRCxFQUFRSixJQUFSLENBQXBCO0FBQ0EsUUFBSU8sT0FBSixFQUFhUixJQUFJLENBQUNNLEtBQUwsQ0FBV0YsT0FBWCxFQUFvQkcsU0FBcEI7QUFDaEIsR0FWRDtBQVdIO0FBRUQ7Ozs7O0FBR0EsSUFBSUksSUFBSSxHQUFHLElBQUkzQixFQUFFLENBQUM0QixJQUFQLENBQVksVUFBVUMsSUFBVixFQUFnQjtBQUNuQyxNQUFJQyxTQUFKLEVBQWU7QUFDWGpCLElBQUFBLEVBQUUsQ0FBQ2tCLE9BQUgsQ0FBV0YsSUFBWCxLQUFvQkEsSUFBSSxDQUFDRyxPQUFMLEVBQXBCO0FBQ0EsV0FBTyxLQUFQO0FBQ0g7O0FBQ0QsTUFBSUMsTUFBSixFQUFZO0FBQ1JwQixJQUFBQSxFQUFFLENBQUNxQixNQUFILENBQVUsQ0FBQ0wsSUFBSSxDQUFDTSxPQUFoQixFQUF5QiwwQ0FBekI7QUFDSDs7QUFDRCxNQUFJLENBQUN0QixFQUFFLENBQUNrQixPQUFILENBQVdGLElBQVgsQ0FBTCxFQUF1QjtBQUNuQixXQUFPLEtBQVA7QUFDSCxHQUZELE1BRU87QUFDSCxRQUFJTyxPQUFPLEdBQUdQLElBQUksQ0FBQ1EsWUFBTCxDQUFrQnhCLEVBQUUsQ0FBQ3lCLFlBQXJCLENBQWQ7O0FBQ0EsUUFBSUYsT0FBSixFQUFhO0FBQ1RBLE1BQUFBLE9BQU8sQ0FBQ0csS0FBUixHQUFnQixDQUFoQjtBQUNIO0FBQ0o7O0FBRUQsU0FBTyxJQUFQO0FBQ0gsQ0FsQlUsRUFrQlIsRUFsQlEsQ0FBWDs7QUFvQkFaLElBQUksQ0FBQ2EsR0FBTCxHQUFXLFVBQVVDLE1BQVYsRUFBa0JDLFFBQWxCLEVBQTRCO0FBQ25DLE1BQUlDLFNBQVMsR0FBRyxLQUFLQyxJQUFMLEVBQWhCOztBQUNBLE1BQUksQ0FBQ0QsU0FBTCxFQUFnQjtBQUNaQSxJQUFBQSxTQUFTLEdBQUcsSUFBSTlCLEVBQUUsQ0FBQ2dDLFdBQVAsQ0FBbUJuQyxpQkFBbkIsQ0FBWjtBQUNIOztBQUVEaUMsRUFBQUEsU0FBUyxDQUFDRyxXQUFWLENBQXNCLENBQXRCLEVBQXlCLENBQXpCO0FBQ0FILEVBQUFBLFNBQVMsQ0FBQ0ksY0FBVixDQUF5QixHQUF6QixFQUE4QixHQUE5QjtBQUNBSixFQUFBQSxTQUFTLENBQUNLLEtBQVYsR0FBa0IsQ0FBbEI7QUFFQSxNQUFJQyxjQUFjLEdBQUdOLFNBQVMsQ0FBQ04sWUFBVixDQUF1QnhCLEVBQUUsQ0FBQ0MsS0FBMUIsQ0FBckI7O0FBQ0EsTUFBSSxDQUFDbUMsY0FBTCxFQUFxQjtBQUNqQkEsSUFBQUEsY0FBYyxHQUFHTixTQUFTLENBQUNPLFlBQVYsQ0FBdUJyQyxFQUFFLENBQUNDLEtBQTFCLENBQWpCO0FBQ0g7O0FBRURtQyxFQUFBQSxjQUFjLENBQUNSLE1BQWYsR0FBd0IsRUFBeEI7QUFDQVEsRUFBQUEsY0FBYyxDQUFDRSxlQUFmLEdBQWlDN0MsZUFBZSxDQUFDOEMsSUFBakQ7QUFDQUgsRUFBQUEsY0FBYyxDQUFDSSxhQUFmLEdBQStCN0MsYUFBYSxDQUFDOEMsTUFBN0M7QUFFQSxTQUFPWCxTQUFQO0FBQ0gsQ0FwQkQ7QUFzQkE7Ozs7Ozs7O0FBTUEsSUFBSVksUUFBUSxHQUFHMUMsRUFBRSxDQUFDMkMsS0FBSCxDQUFTO0FBQ3BCQyxFQUFBQSxJQUFJLEVBQUUsYUFEYztBQUVwQixhQUFTNUMsRUFBRSxDQUFDNkMsU0FGUTtBQUlwQkMsRUFBQUEsSUFBSSxFQUFFLGdCQUFZO0FBQ2QsU0FBS0MsVUFBTCxHQUFrQixJQUFsQjtBQUNBLFNBQUtDLGNBQUwsR0FBc0IsRUFBdEI7QUFDQSxTQUFLQyxtQkFBTCxHQUEyQixFQUEzQjtBQUNBLFNBQUtDLFdBQUwsR0FBbUIsRUFBbkI7O0FBRUEsUUFBSWpDLFNBQUosRUFBZTtBQUNYLFdBQUtrQyxnQkFBTCxHQUF3QixJQUF4QjtBQUNBLFdBQUtDLHFCQUFMLEdBQTZCbEQsUUFBUSxDQUFDLEtBQUttRCxlQUFOLEVBQXVCLEdBQXZCLENBQXJDO0FBQ0gsS0FIRCxNQUlLO0FBQ0QsV0FBS0QscUJBQUwsR0FBNkIsS0FBS0MsZUFBbEM7QUFDSDtBQUNKLEdBakJtQjtBQW1CcEJDLEVBQUFBLE1BQU0sRUFBRXJDLFNBQVMsSUFBSTtBQUNqQnNDLElBQUFBLElBQUksRUFBRSw2Q0FEVztBQUVqQkMsSUFBQUEsSUFBSSxFQUFFLGtDQUZXO0FBR2pCQyxJQUFBQSxTQUFTLEVBQUUsbURBSE07QUFJakJDLElBQUFBLGlCQUFpQixFQUFFO0FBSkYsR0FuQkQ7QUEwQnBCQyxFQUFBQSxVQUFVLEVBQUU7QUFDUjs7Ozs7QUFLQS9CLElBQUFBLE1BQU0sRUFBRTtBQUNKLGlCQUFTLG9EQURMO0FBRUpnQyxNQUFBQSxTQUFTLEVBQUUsSUFGUDtBQUdKQyxNQUFBQSxPQUFPLEVBQUV6QyxNQUFNLElBQUksZ0NBSGY7QUFJSjBDLE1BQUFBLE1BQU0sRUFBRSxrQkFBWTtBQUNoQixhQUFLVixxQkFBTDtBQUNIO0FBTkcsS0FOQTs7QUFlUjs7Ozs7QUFLQWQsSUFBQUEsZUFBZSxFQUFFO0FBQ2IsaUJBQVM3QyxlQUFlLENBQUM4QyxJQURaO0FBRWJ3QixNQUFBQSxJQUFJLEVBQUV0RSxlQUZPO0FBR2JvRSxNQUFBQSxPQUFPLEVBQUV6QyxNQUFNLElBQUksMENBSE47QUFJYjRDLE1BQUFBLFVBQVUsRUFBRSxLQUpDO0FBS2JGLE1BQUFBLE1BQU0sRUFBRSxnQkFBVUcsUUFBVixFQUFvQjtBQUN4QixZQUFJLEtBQUszQixlQUFMLEtBQXlCMkIsUUFBN0IsRUFBdUM7QUFFdkMsYUFBS0MsWUFBTCxHQUFvQixJQUFwQjs7QUFDQSxhQUFLZCxxQkFBTDtBQUNIO0FBVlksS0FwQlQ7O0FBaUNSOzs7OztBQUtBZSxJQUFBQSxRQUFRLEVBQUU7QUFDTixpQkFBUyxFQURIO0FBRU5OLE1BQUFBLE9BQU8sRUFBRXpDLE1BQU0sSUFBSSxtQ0FGYjtBQUdOMEMsTUFBQUEsTUFBTSxFQUFFLGdCQUFVRyxRQUFWLEVBQW9CO0FBQ3hCLFlBQUksS0FBS0UsUUFBTCxLQUFrQkYsUUFBdEIsRUFBZ0M7QUFFaEMsYUFBS0MsWUFBTCxHQUFvQixJQUFwQjs7QUFDQSxhQUFLZCxxQkFBTDtBQUNIO0FBUkssS0F0Q0Y7O0FBaURSOzs7OztBQUtBZ0IsSUFBQUEsV0FBVyxFQUFFLE9BdERMO0FBdURSQyxJQUFBQSxVQUFVLEVBQUU7QUFDUlIsTUFBQUEsT0FBTyxFQUFFekMsTUFBTSxJQUFJLHFDQURYO0FBRVJPLE1BQUFBLEdBRlEsaUJBRUQ7QUFDSCxlQUFPLEtBQUt5QyxXQUFaO0FBQ0gsT0FKTztBQUtSRSxNQUFBQSxHQUxRLGVBS0hDLEtBTEcsRUFLSTtBQUNSLFlBQUksS0FBS0gsV0FBTCxLQUFxQkcsS0FBekIsRUFBZ0M7QUFDaEMsYUFBS0gsV0FBTCxHQUFtQkcsS0FBbkI7QUFDQSxhQUFLTCxZQUFMLEdBQW9CLElBQXBCOztBQUNBLGFBQUtkLHFCQUFMO0FBQ0gsT0FWTztBQVdSWSxNQUFBQSxVQUFVLEVBQUU7QUFYSixLQXZESjs7QUFxRVI7Ozs7O0FBS0FRLElBQUFBLElBQUksRUFBRTtBQUNGLGlCQUFTLElBRFA7QUFFRlQsTUFBQUEsSUFBSSxFQUFFL0QsRUFBRSxDQUFDeUUsT0FGUDtBQUdGWixNQUFBQSxPQUFPLEVBQUV6QyxNQUFNLElBQUksOEJBSGpCO0FBSUYwQyxNQUFBQSxNQUFNLEVBQUUsZ0JBQVVHLFFBQVYsRUFBb0I7QUFDeEIsWUFBSSxLQUFLTyxJQUFMLEtBQWNQLFFBQWxCLEVBQTRCO0FBRTVCLGFBQUtDLFlBQUwsR0FBb0IsSUFBcEI7O0FBQ0EsWUFBSSxLQUFLTSxJQUFULEVBQWU7QUFDWCxjQUFJdkQsU0FBSixFQUFlO0FBQ1gsaUJBQUtrQyxnQkFBTCxHQUF3QixLQUFLcUIsSUFBN0I7QUFDSDs7QUFDRCxlQUFLRSxhQUFMLEdBQXFCLEtBQXJCOztBQUNBLGVBQUtDLFlBQUw7QUFDSCxTQU5ELE1BT0s7QUFDRCxlQUFLRCxhQUFMLEdBQXFCLElBQXJCO0FBQ0g7O0FBQ0QsYUFBS3RCLHFCQUFMO0FBQ0g7QUFuQkMsS0ExRUU7O0FBZ0dSOzs7OztBQUtBd0IsSUFBQUEsaUJBQWlCLEVBQUUsSUFyR1g7QUFzR1JGLElBQUFBLGFBQWEsRUFBRTtBQUNYL0MsTUFBQUEsR0FEVyxpQkFDSjtBQUNILGVBQU8sS0FBS2lELGlCQUFaO0FBQ0gsT0FIVTtBQUlYTixNQUFBQSxHQUpXLGVBSU5DLEtBSk0sRUFJQztBQUNSLFlBQUksS0FBS0ssaUJBQUwsS0FBMkJMLEtBQS9CLEVBQXNDO0FBQ2xDO0FBQ0g7O0FBQ0QsYUFBS0ssaUJBQUwsR0FBeUJMLEtBQXpCOztBQUVBLFlBQUl0RCxTQUFKLEVBQWU7QUFDWCxjQUFJc0QsS0FBSixFQUFXO0FBQ1AsaUJBQUtDLElBQUwsR0FBWSxJQUFaO0FBQ0gsV0FGRCxNQUdLLElBQUksS0FBS3JCLGdCQUFULEVBQTJCO0FBQzVCLGlCQUFLcUIsSUFBTCxHQUFZLEtBQUtyQixnQkFBakI7QUFDQTtBQUNIO0FBQ0o7O0FBRUQsYUFBS2UsWUFBTCxHQUFvQixJQUFwQjs7QUFDQSxhQUFLZCxxQkFBTDtBQUNILE9BdEJVO0FBdUJYWSxNQUFBQSxVQUFVLEVBQUUsS0F2QkQ7QUF3QlhILE1BQUFBLE9BQU8sRUFBRXpDLE1BQU0sSUFBSTtBQXhCUixLQXRHUDs7QUFpSVI7Ozs7O0FBS0F5RCxJQUFBQSxTQUFTLEVBQUU7QUFDUCxpQkFBUzlFLFNBQVMsQ0FBQytFLElBRFo7QUFFUGYsTUFBQUEsSUFBSSxFQUFFaEUsU0FGQztBQUdQOEQsTUFBQUEsT0FBTyxFQUFFekMsTUFBTSxJQUFJLGdDQUhaO0FBSVAwQyxNQUFBQSxNQUpPLGtCQUlDRyxRQUpELEVBSVc7QUFDZCxZQUFJLEtBQUtZLFNBQUwsS0FBbUJaLFFBQXZCLEVBQWlDOztBQUVqQyxhQUFLYixxQkFBTDtBQUNILE9BUk07QUFTUFksTUFBQUEsVUFBVSxFQUFFO0FBVEwsS0F0SUg7O0FBa0pSOzs7OztBQUtBZSxJQUFBQSxRQUFRLEVBQUU7QUFDTixpQkFBUyxDQURIO0FBRU5sQixNQUFBQSxPQUFPLEVBQUV6QyxNQUFNLElBQUksbUNBRmI7QUFHTjBDLE1BQUFBLE1BQU0sRUFBRSxnQkFBVUcsUUFBVixFQUFvQjtBQUN4QixZQUFJLEtBQUtjLFFBQUwsS0FBa0JkLFFBQXRCLEVBQWdDO0FBRWhDLGFBQUtDLFlBQUwsR0FBb0IsSUFBcEI7O0FBQ0EsYUFBS2QscUJBQUw7QUFDSDtBQVJLLEtBdkpGOztBQWtLUjs7Ozs7QUFLQTRCLElBQUFBLFVBQVUsRUFBRTtBQUNSLGlCQUFTLEVBREQ7QUFFUm5CLE1BQUFBLE9BQU8sRUFBRXpDLE1BQU0sSUFBSSxxQ0FGWDtBQUdSMEMsTUFBQUEsTUFBTSxFQUFFLGdCQUFVRyxRQUFWLEVBQW9CO0FBQ3hCLFlBQUksS0FBS2UsVUFBTCxLQUFvQmYsUUFBeEIsRUFBa0M7QUFFbEMsYUFBS0MsWUFBTCxHQUFvQixJQUFwQjs7QUFDQSxhQUFLZCxxQkFBTDtBQUNIO0FBUk8sS0F2S0o7O0FBa0xSOzs7OztBQUtBNkIsSUFBQUEsVUFBVSxFQUFFO0FBQ1IsaUJBQVMsSUFERDtBQUVSbEIsTUFBQUEsSUFBSSxFQUFFL0QsRUFBRSxDQUFDa0YsV0FGRDtBQUdSckIsTUFBQUEsT0FBTyxFQUFFekMsTUFBTSxJQUFJLHFDQUhYO0FBSVIwQyxNQUFBQSxNQUFNLEVBQUUsZ0JBQVVHLFFBQVYsRUFBb0I7QUFDeEIsWUFBSSxLQUFLZ0IsVUFBTCxLQUFvQmhCLFFBQXhCLEVBQWtDO0FBRWxDLGFBQUtDLFlBQUwsR0FBb0IsSUFBcEI7O0FBQ0EsYUFBS2QscUJBQUw7QUFDSDtBQVRPLEtBdkxKOztBQW1NUjs7Ozs7Ozs7O0FBU0ErQixJQUFBQSxnQkFBZ0IsRUFBRTtBQUNkLGlCQUFTLElBREs7QUFFZHRCLE1BQUFBLE9BQU8sRUFBRXpDLE1BQU0sSUFBSSwwQ0FGTDtBQUdkMEMsTUFBQUEsTUFBTSxFQUFFLGdCQUFVRyxRQUFWLEVBQW9CO0FBQ3hCLFlBQUksS0FBS2tCLGdCQUFMLEtBQTBCbEIsUUFBOUIsRUFBd0M7O0FBQ3hDLFlBQUksS0FBS21CLGtCQUFULEVBQTZCO0FBQ3pCLGVBQUtELGdCQUFMLEdBQXdCLEtBQUtFLGtCQUFMLEVBQXhCLEdBQW9ELEtBQUtDLHFCQUFMLEVBQXBEO0FBQ0g7QUFDSjtBQVJhO0FBNU1WLEdBMUJRO0FBa1BwQkMsRUFBQUEsT0FBTyxFQUFFO0FBQ0w5RixJQUFBQSxlQUFlLEVBQUVBLGVBRFo7QUFFTEUsSUFBQUEsYUFBYSxFQUFFQTtBQUZWLEdBbFBXO0FBdVBwQjZGLEVBQUFBLFFBdlBvQixzQkF1UFI7QUFDUixRQUFJLEtBQUtMLGdCQUFULEVBQTJCO0FBQ3ZCLFdBQUtFLGtCQUFMO0FBQ0g7O0FBQ0QsU0FBS2hDLGVBQUw7O0FBQ0EsU0FBS29DLGlCQUFMLENBQXVCLElBQXZCO0FBQ0gsR0E3UG1CO0FBK1BwQkMsRUFBQUEsU0EvUG9CLHVCQStQUDtBQUNULFFBQUksS0FBS1AsZ0JBQVQsRUFBMkI7QUFDdkIsV0FBS0cscUJBQUw7QUFDSDs7QUFDRCxTQUFLRyxpQkFBTCxDQUF1QixLQUF2QjtBQUNILEdBcFFtQjtBQXNRcEJFLEVBQUFBLEtBdFFvQixtQkFzUVg7QUFDTCxTQUFLaEIsWUFBTDtBQUNILEdBeFFtQjtBQTBRcEJpQixFQUFBQSxlQTFRb0IsMkJBMFFIQyxXQTFRRyxFQTBRVTtBQUMxQixRQUFJQyxRQUFRLEdBQUcsS0FBSzlFLElBQUwsQ0FBVThFLFFBQXpCO0FBQ0FBLElBQUFBLFFBQVEsQ0FBQ0MsT0FBVCxDQUFpQixVQUFVQyxTQUFWLEVBQXFCO0FBQ2xDQSxNQUFBQSxTQUFTLENBQUNDLEtBQVYsR0FBa0JKLFdBQWxCO0FBQ0gsS0FGRDtBQUdILEdBL1FtQjtBQWlScEJSLEVBQUFBLGtCQWpSb0IsZ0NBaVJFO0FBQ2xCLFNBQUtyRSxJQUFMLENBQVVrRixFQUFWLENBQWFsRyxFQUFFLENBQUNtRyxJQUFILENBQVFDLFNBQVIsQ0FBa0JDLFNBQS9CLEVBQTBDLEtBQUtDLGFBQS9DLEVBQThELElBQTlEO0FBQ0EsU0FBS3RGLElBQUwsQ0FBVWtGLEVBQVYsQ0FBYWxHLEVBQUUsQ0FBQ21HLElBQUgsQ0FBUUMsU0FBUixDQUFrQkcsYUFBL0IsRUFBOEMsS0FBS1gsZUFBbkQsRUFBb0UsSUFBcEU7QUFDSCxHQXBSbUI7QUFzUnBCTixFQUFBQSxxQkF0Um9CLG1DQXNSSztBQUNyQixTQUFLdEUsSUFBTCxDQUFVd0YsR0FBVixDQUFjeEcsRUFBRSxDQUFDbUcsSUFBSCxDQUFRQyxTQUFSLENBQWtCQyxTQUFoQyxFQUEyQyxLQUFLQyxhQUFoRCxFQUErRCxJQUEvRDtBQUNBLFNBQUt0RixJQUFMLENBQVV3RixHQUFWLENBQWN4RyxFQUFFLENBQUNtRyxJQUFILENBQVFDLFNBQVIsQ0FBa0JHLGFBQWhDLEVBQStDLEtBQUtYLGVBQXBELEVBQXFFLElBQXJFO0FBQ0gsR0F6Um1CO0FBMlJwQmEsRUFBQUEsaUNBM1JvQiwrQ0EyUmlCO0FBQ2pDLFNBQUt6RCxjQUFMLENBQW9CK0MsT0FBcEIsQ0FBNEIsVUFBVVcsSUFBVixFQUFnQjtBQUN4QyxXQUFLQyxtQkFBTCxDQUF5QkQsSUFBekIsRUFBK0IsSUFBL0IsRUFBcUMsSUFBckM7QUFDSCxLQUYyQixDQUUxQkUsSUFGMEIsQ0FFckIsSUFGcUIsQ0FBNUI7QUFHSCxHQS9SbUI7QUFpU3BCQyxFQUFBQSxnQkFqU29CLDRCQWlTRmpGLE1BalNFLEVBaVNNO0FBQ3RCLFdBQU9kLElBQUksQ0FBQ2EsR0FBTCxDQUFTQyxNQUFULEVBQWlCLElBQWpCLENBQVA7QUFDSCxHQW5TbUI7QUFxU3BCK0MsRUFBQUEsWUFyU29CLDBCQXFTSjtBQUNaLFFBQUksS0FBS0gsSUFBTCxZQUFxQnhFLEVBQUUsQ0FBQ3lFLE9BQTVCLEVBQXFDO0FBQ2pDLFVBQUksS0FBS0QsSUFBTCxDQUFVc0MsWUFBZCxFQUE0QjtBQUN4QixhQUFLNUMsWUFBTCxHQUFvQixJQUFwQjs7QUFDQSxhQUFLYixlQUFMO0FBQ0gsT0FIRCxNQUlLO0FBQ0QsWUFBSTBELElBQUksR0FBRyxJQUFYO0FBQ0EvRyxRQUFBQSxFQUFFLENBQUNnSCxNQUFILENBQVVDLElBQVYsQ0FBZSxLQUFLekMsSUFBTCxDQUFVMEMsU0FBekIsRUFBb0MsVUFBVUMsR0FBVixFQUFlOUMsVUFBZixFQUEyQjtBQUMzRDBDLFVBQUFBLElBQUksQ0FBQzdDLFlBQUwsR0FBb0IsSUFBcEI7O0FBQ0E2QyxVQUFBQSxJQUFJLENBQUMxRCxlQUFMO0FBQ0gsU0FIRDtBQUlIO0FBQ0osS0FaRCxNQWFLO0FBQ0QsV0FBS2EsWUFBTCxHQUFvQixJQUFwQjs7QUFDQSxXQUFLYixlQUFMO0FBQ0g7QUFDSixHQXZUbUI7QUF5VHBCK0QsRUFBQUEsWUF6VG9CLHdCQXlUTkMsVUF6VE0sRUF5VE16RixNQXpUTixFQXlUYztBQUM5QixRQUFJbUYsSUFBSSxHQUFHLElBQVg7O0FBQ0EsUUFBSTVHLElBQUksR0FBRyxTQUFQQSxJQUFPLENBQVV5QixNQUFWLEVBQWtCO0FBQ3pCLFVBQUkwRixLQUFKOztBQUNBLFVBQUlQLElBQUksQ0FBQzlELG1CQUFMLENBQXlCc0UsTUFBekIsS0FBb0MsQ0FBeEMsRUFBMkM7QUFDdkNELFFBQUFBLEtBQUssR0FBR1AsSUFBSSxDQUFDRixnQkFBTCxDQUFzQmpGLE1BQXRCLENBQVI7O0FBQ0FtRixRQUFBQSxJQUFJLENBQUM5RCxtQkFBTCxDQUF5QnVFLElBQXpCLENBQThCRixLQUE5QjtBQUNILE9BSEQsTUFHTztBQUNIQSxRQUFBQSxLQUFLLEdBQUdQLElBQUksQ0FBQzlELG1CQUFMLENBQXlCLENBQXpCLENBQVI7QUFDSDs7QUFDRHFFLE1BQUFBLEtBQUssQ0FBQ0csV0FBTixHQUFvQkosVUFBcEI7O0FBQ0FOLE1BQUFBLElBQUksQ0FBQ0osbUJBQUwsQ0FBeUJXLEtBQXpCLEVBQWdDMUYsTUFBaEMsRUFBd0MsSUFBeEM7O0FBQ0EsVUFBSThGLFNBQVMsR0FBR0osS0FBSyxDQUFDSyxjQUFOLEVBQWhCO0FBQ0EsYUFBT0QsU0FBUyxDQUFDaEcsS0FBakI7QUFDSCxLQVpEOztBQWFBLFFBQUlFLE1BQUosRUFBWTtBQUNSLGFBQU96QixJQUFJLENBQUN5QixNQUFELENBQVg7QUFDSCxLQUZELE1BR0s7QUFDRCxhQUFPekIsSUFBUDtBQUNIO0FBQ0osR0E5VW1CO0FBZ1ZwQm1HLEVBQUFBLGFBaFZvQix5QkFnVkxzQixLQWhWSyxFQWdWRTtBQUFBOztBQUNsQixRQUFJQyxVQUFVLEdBQUcsS0FBSzdHLElBQUwsQ0FBVThHLGFBQVYsQ0FBd0I5SCxFQUFFLENBQUM2QyxTQUEzQixDQUFqQjs7QUFEa0IsK0JBR1RrRixDQUhTO0FBSWQsVUFBSUMsWUFBWSxHQUFHLEtBQUksQ0FBQ2hGLGNBQUwsQ0FBb0IrRSxDQUFwQixDQUFuQjtBQUNBLFVBQUlFLFlBQVksR0FBR0QsWUFBWSxDQUFDRSxhQUFoQztBQUNBLFVBQUlDLFVBQVUsR0FBR0gsWUFBWSxDQUFDSSxXQUE5Qjs7QUFDQSxVQUFJSCxZQUFZLElBQUksS0FBSSxDQUFDSSxzQkFBTCxDQUE0QkwsWUFBNUIsRUFBMENKLEtBQUssQ0FBQ1UsS0FBTixDQUFZQyxXQUFaLEVBQTFDLENBQXBCLEVBQTBGO0FBQ3RGVixRQUFBQSxVQUFVLENBQUM5QixPQUFYLENBQW1CLFVBQVV5QyxTQUFWLEVBQXFCO0FBQ3BDLGNBQUlBLFNBQVMsQ0FBQ3BELGtCQUFWLElBQWdDb0QsU0FBUyxDQUFDUCxZQUFELENBQTdDLEVBQTZEO0FBQ3pETyxZQUFBQSxTQUFTLENBQUNQLFlBQUQsQ0FBVCxDQUF3QkwsS0FBeEIsRUFBK0JPLFVBQS9CO0FBQ0g7QUFDSixTQUpEO0FBS0FQLFFBQUFBLEtBQUssQ0FBQ2EsZUFBTjtBQUNIO0FBZGE7O0FBR2xCLFNBQUssSUFBSVYsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxLQUFLL0UsY0FBTCxDQUFvQnVFLE1BQXhDLEVBQWdELEVBQUVRLENBQWxELEVBQXFEO0FBQUEsWUFBNUNBLENBQTRDO0FBWXBEO0FBQ0osR0FoV21CO0FBa1dwQk0sRUFBQUEsc0JBbFdvQixrQ0FrV0lmLEtBbFdKLEVBa1dXb0IsS0FsV1gsRUFrV2tCO0FBQ2xDLFFBQUlDLE1BQU0sR0FBR3JCLEtBQUssQ0FBQ3NCLHFCQUFOLEVBQWI7QUFDQSxXQUFPRCxNQUFNLENBQUNFLFFBQVAsQ0FBZ0JILEtBQWhCLENBQVA7QUFDSCxHQXJXbUI7QUF1V3BCSSxFQUFBQSxXQXZXb0IseUJBdVdMO0FBQ1gsUUFBSWhELFFBQVEsR0FBRyxLQUFLOUUsSUFBTCxDQUFVOEUsUUFBekI7O0FBQ0EsU0FBSyxJQUFJaUMsQ0FBQyxHQUFHakMsUUFBUSxDQUFDeUIsTUFBVCxHQUFrQixDQUEvQixFQUFrQ1EsQ0FBQyxJQUFJLENBQXZDLEVBQTBDQSxDQUFDLEVBQTNDLEVBQStDO0FBQzNDLFVBQUlnQixLQUFLLEdBQUdqRCxRQUFRLENBQUNpQyxDQUFELENBQXBCOztBQUNBLFVBQUlnQixLQUFLLENBQUNuRyxJQUFOLEtBQWUvQyxpQkFBZixJQUFvQ2tKLEtBQUssQ0FBQ25HLElBQU4sS0FBZTlDLHNCQUF2RCxFQUErRTtBQUMzRSxZQUFJaUosS0FBSyxDQUFDQyxNQUFOLEtBQWlCLEtBQUtoSSxJQUExQixFQUFnQztBQUM1QitILFVBQUFBLEtBQUssQ0FBQ0MsTUFBTixHQUFlLElBQWY7QUFDSCxTQUZELE1BR0s7QUFDRDtBQUNBbEQsVUFBQUEsUUFBUSxDQUFDbUQsTUFBVCxDQUFnQmxCLENBQWhCLEVBQW1CLENBQW5CO0FBQ0g7O0FBQ0QsWUFBSWdCLEtBQUssQ0FBQ25HLElBQU4sS0FBZS9DLGlCQUFuQixFQUFzQztBQUNsQ2lCLFVBQUFBLElBQUksQ0FBQ29JLEdBQUwsQ0FBU0gsS0FBVDtBQUNIO0FBQ0o7QUFDSjs7QUFFRCxTQUFLL0YsY0FBTCxDQUFvQnVFLE1BQXBCLEdBQTZCLENBQTdCO0FBQ0EsU0FBS3RFLG1CQUFMLENBQXlCc0UsTUFBekIsR0FBa0MsQ0FBbEM7QUFDQSxTQUFLckUsV0FBTCxDQUFpQnFFLE1BQWpCLEdBQTBCLENBQTFCO0FBQ0EsU0FBSzRCLFlBQUwsR0FBb0IsQ0FBcEI7QUFDQSxTQUFLQyxVQUFMLEdBQWtCLENBQWxCO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQixDQUFuQjtBQUNBLFNBQUtDLFlBQUwsR0FBb0IsQ0FBcEI7QUFDQSxTQUFLcEYsWUFBTCxHQUFvQixJQUFwQjtBQUNILEdBalltQjtBQW1ZcEJxRixFQUFBQSxTQUFTLEVBQUV0SSxTQUFTLElBQUksWUFBWTtBQUNoQztBQUNBO0FBQ0E7QUFDQSxRQUFJLEtBQUttRSxrQkFBVCxFQUE2QjtBQUN6QixXQUFLSSxRQUFMO0FBQ0gsS0FGRCxNQUdLO0FBQ0QsV0FBS0UsU0FBTDtBQUNIO0FBQ0osR0E3WW1CO0FBK1lwQkQsRUFBQUEsaUJBL1lvQiw2QkErWUQrRCxNQS9ZQyxFQStZTztBQUN2QixTQUFLLElBQUl6QixDQUFDLEdBQUcsS0FBSy9HLElBQUwsQ0FBVThFLFFBQVYsQ0FBbUJ5QixNQUFuQixHQUE0QixDQUF6QyxFQUE0Q1EsQ0FBQyxJQUFJLENBQWpELEVBQW9EQSxDQUFDLEVBQXJELEVBQXlEO0FBQ3JELFVBQUlnQixLQUFLLEdBQUcsS0FBSy9ILElBQUwsQ0FBVThFLFFBQVYsQ0FBbUJpQyxDQUFuQixDQUFaOztBQUNBLFVBQUlnQixLQUFLLENBQUNuRyxJQUFOLEtBQWUvQyxpQkFBZixJQUFvQ2tKLEtBQUssQ0FBQ25HLElBQU4sS0FBZTlDLHNCQUF2RCxFQUErRTtBQUMzRWlKLFFBQUFBLEtBQUssQ0FBQ1MsTUFBTixHQUFlQSxNQUFmO0FBQ0g7QUFDSjtBQUNKLEdBdFptQjtBQXdacEJDLEVBQUFBLGdCQXhab0IsNEJBd1pGQyxXQXhaRSxFQXdaV3JDLFVBeFpYLEVBd1p1QjtBQUN2QyxRQUFJVyxZQUFKOztBQUNBLFFBQUksS0FBSy9FLG1CQUFMLENBQXlCc0UsTUFBekIsS0FBb0MsQ0FBeEMsRUFBMkM7QUFDdkNTLE1BQUFBLFlBQVksR0FBRyxLQUFLbkIsZ0JBQUwsQ0FBc0I2QyxXQUF0QixDQUFmO0FBQ0gsS0FGRCxNQUVPO0FBQ0gxQixNQUFBQSxZQUFZLEdBQUcsS0FBSy9FLG1CQUFMLENBQXlCMEcsR0FBekIsRUFBZjtBQUNIOztBQUNEM0IsSUFBQUEsWUFBWSxDQUFDUCxXQUFiLEdBQTJCSixVQUEzQjtBQUNBVyxJQUFBQSxZQUFZLENBQUNvQixVQUFiLEdBQTBCLEtBQUtBLFVBQS9CO0FBQ0FwQixJQUFBQSxZQUFZLENBQUN3QixNQUFiLEdBQXNCLEtBQUt4SSxJQUFMLENBQVV3SSxNQUFoQztBQUVBeEIsSUFBQUEsWUFBWSxDQUFDOUYsY0FBYixDQUE0QixDQUE1QixFQUErQixDQUEvQjs7QUFDQSxTQUFLeUUsbUJBQUwsQ0FBeUJxQixZQUF6QixFQUF1QzBCLFdBQXZDOztBQUVBLFNBQUsxSSxJQUFMLENBQVU0SSxRQUFWLENBQW1CNUIsWUFBbkI7O0FBQ0EsU0FBS2hGLGNBQUwsQ0FBb0J3RSxJQUFwQixDQUF5QlEsWUFBekI7O0FBRUEsV0FBT0EsWUFBUDtBQUNILEdBMWFtQjtBQTRhcEI2QixFQUFBQSwyQkE1YW9CLHVDQTRhU0MsV0E1YVQsRUE0YXNCQyxVQTVhdEIsRUE0YWtDMUMsVUE1YWxDLEVBNGE4QztBQUM5RCxRQUFJMkMsYUFBYSxHQUFHRCxVQUFwQjtBQUNBLFFBQUkvQixZQUFKOztBQUVBLFFBQUksS0FBS21CLFlBQUwsR0FBb0IsQ0FBcEIsSUFBeUJhLGFBQWEsR0FBRyxLQUFLYixZQUFyQixHQUFvQyxLQUFLcEUsUUFBdEUsRUFBZ0Y7QUFDNUU7QUFDQSxVQUFJa0YsZUFBZSxHQUFHLENBQXRCOztBQUNBLGFBQU8sS0FBS2QsWUFBTCxJQUFxQixLQUFLcEUsUUFBakMsRUFBMkM7QUFDdkMsWUFBSW1GLGFBQWEsR0FBRyxLQUFLQyxnQkFBTCxDQUFzQkwsV0FBdEIsRUFDaEJHLGVBRGdCLEVBRWhCSCxXQUFXLENBQUN2QyxNQUZJLENBQXBCOztBQUdBLFlBQUk2QyxXQUFXLEdBQUdOLFdBQVcsQ0FBQ08sTUFBWixDQUFtQkosZUFBbkIsRUFBb0NDLGFBQXBDLENBQWxCOztBQUNBLFlBQUlJLGdCQUFnQixHQUFHLEtBQUtsRCxZQUFMLENBQWtCQyxVQUFsQixFQUE4QitDLFdBQTlCLENBQXZCOztBQUVBLFlBQUksS0FBS2pCLFlBQUwsR0FBb0JtQixnQkFBcEIsSUFBd0MsS0FBS3ZGLFFBQWpELEVBQTJEO0FBQ3ZELGVBQUtvRSxZQUFMLElBQXFCbUIsZ0JBQXJCO0FBQ0FMLFVBQUFBLGVBQWUsSUFBSUMsYUFBbkI7QUFDSCxTQUhELE1BSUs7QUFFRCxjQUFJRCxlQUFlLEdBQUcsQ0FBdEIsRUFBeUI7QUFDckIsZ0JBQUlNLGVBQWUsR0FBR1QsV0FBVyxDQUFDTyxNQUFaLENBQW1CLENBQW5CLEVBQXNCSixlQUF0QixDQUF0Qjs7QUFDQSxpQkFBS1IsZ0JBQUwsQ0FBc0JjLGVBQXRCLEVBQXVDbEQsVUFBdkM7O0FBQ0F5QyxZQUFBQSxXQUFXLEdBQUdBLFdBQVcsQ0FBQ08sTUFBWixDQUFtQkosZUFBbkIsRUFBb0NILFdBQVcsQ0FBQ3ZDLE1BQWhELENBQWQ7QUFDQXlDLFlBQUFBLGFBQWEsR0FBRyxLQUFLNUMsWUFBTCxDQUFrQkMsVUFBbEIsRUFBOEJ5QyxXQUE5QixDQUFoQjtBQUNIOztBQUNELGVBQUtVLGVBQUw7O0FBQ0E7QUFDSDtBQUNKO0FBQ0o7O0FBQ0QsUUFBSVIsYUFBYSxHQUFHLEtBQUtqRixRQUF6QixFQUFtQztBQUMvQixVQUFJMEYsU0FBUyxHQUFHbkwsU0FBUyxDQUFDb0wsWUFBVixDQUF1QlosV0FBdkIsRUFDWkUsYUFEWSxFQUVaLEtBQUtqRixRQUZPLEVBR1osS0FBS3FDLFlBQUwsQ0FBa0JDLFVBQWxCLENBSFksQ0FBaEI7O0FBSUEsV0FBSyxJQUFJc0QsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0YsU0FBUyxDQUFDbEQsTUFBOUIsRUFBc0MsRUFBRW9ELENBQXhDLEVBQTJDO0FBQ3ZDLFlBQUlDLFdBQVcsR0FBR0gsU0FBUyxDQUFDRSxDQUFELENBQTNCO0FBQ0EzQyxRQUFBQSxZQUFZLEdBQUcsS0FBS3lCLGdCQUFMLENBQXNCbUIsV0FBdEIsRUFBbUN2RCxVQUFuQyxDQUFmO0FBQ0EsWUFBSUssU0FBUyxHQUFHTSxZQUFZLENBQUNMLGNBQWIsRUFBaEI7QUFDQSxhQUFLd0IsWUFBTCxJQUFxQnpCLFNBQVMsQ0FBQ2hHLEtBQS9COztBQUNBLFlBQUkrSSxTQUFTLENBQUNsRCxNQUFWLEdBQW1CLENBQW5CLElBQXdCb0QsQ0FBQyxHQUFHRixTQUFTLENBQUNsRCxNQUFWLEdBQW1CLENBQW5ELEVBQXNEO0FBQ2xELGVBQUtpRCxlQUFMO0FBQ0g7QUFDSjtBQUNKLEtBZEQsTUFlSztBQUNELFdBQUtyQixZQUFMLElBQXFCYSxhQUFyQjs7QUFDQSxXQUFLUCxnQkFBTCxDQUFzQkssV0FBdEIsRUFBbUN6QyxVQUFuQztBQUNIO0FBQ0osR0E5ZG1CO0FBZ2VwQndELEVBQUFBLGtCQWhlb0IsOEJBZ2VBbkIsV0FoZUEsRUFnZWE7QUFDN0IsV0FBT0EsV0FBVyxDQUFDbkMsTUFBWixHQUFxQixDQUFyQixLQUEyQm1DLFdBQVcsQ0FBQ29CLFdBQVosQ0FBd0IsSUFBeEIsQ0FBbEM7QUFDSCxHQWxlbUI7QUFvZXBCTixFQUFBQSxlQXBlb0IsNkJBb2VEO0FBQ2YsU0FBS3RILFdBQUwsQ0FBaUJzRSxJQUFqQixDQUFzQixLQUFLMkIsWUFBM0I7O0FBQ0EsU0FBS0EsWUFBTCxHQUFvQixDQUFwQjtBQUNBLFNBQUtDLFVBQUw7QUFDSCxHQXhlbUI7QUEwZXBCMkIsRUFBQUEsc0JBMWVvQixrQ0EwZUlDLFlBMWVKLEVBMGVrQjtBQUNsQyxRQUFJLEtBQUs5RyxZQUFMLElBQXFCLENBQUMsS0FBS25CLFVBQTNCLElBQXlDLENBQUNpSSxZQUE5QyxFQUE0RDtBQUN4RCxhQUFPLElBQVA7QUFDSDs7QUFFRCxRQUFJLEtBQUtqSSxVQUFMLENBQWdCd0UsTUFBaEIsS0FBMkJ5RCxZQUFZLENBQUN6RCxNQUE1QyxFQUFvRDtBQUNoRCxhQUFPLElBQVA7QUFDSDs7QUFFRCxTQUFLLElBQUlRLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBS2hGLFVBQUwsQ0FBZ0J3RSxNQUFwQyxFQUE0QyxFQUFFUSxDQUE5QyxFQUFpRDtBQUM3QyxVQUFJa0QsT0FBTyxHQUFHLEtBQUtsSSxVQUFMLENBQWdCZ0YsQ0FBaEIsQ0FBZDtBQUNBLFVBQUltRCxPQUFPLEdBQUdGLFlBQVksQ0FBQ2pELENBQUQsQ0FBMUI7O0FBQ0EsVUFBSWtELE9BQU8sQ0FBQ0UsSUFBUixLQUFpQkQsT0FBTyxDQUFDQyxJQUE3QixFQUFtQztBQUMvQixlQUFPLElBQVA7QUFDSCxPQUZELE1BR0s7QUFDRCxZQUFJRixPQUFPLENBQUNHLEtBQVosRUFBbUI7QUFDZixjQUFJRixPQUFPLENBQUNFLEtBQVosRUFBbUI7QUFDZixnQkFBSSxDQUFDLENBQUNGLE9BQU8sQ0FBQ0UsS0FBUixDQUFjN0osT0FBaEIsS0FBNEIsQ0FBQyxDQUFDMEosT0FBTyxDQUFDRyxLQUFSLENBQWM3SixPQUFoRCxFQUF5RDtBQUNyRCxxQkFBTyxJQUFQO0FBQ0g7O0FBQ0QsZ0JBQUkwSixPQUFPLENBQUNHLEtBQVIsQ0FBY0MsSUFBZCxLQUF1QkgsT0FBTyxDQUFDRSxLQUFSLENBQWNDLElBQXJDLElBQ0dKLE9BQU8sQ0FBQ0csS0FBUixDQUFjRSxNQUFkLEtBQXlCSixPQUFPLENBQUNFLEtBQVIsQ0FBY0UsTUFEMUMsSUFFR0wsT0FBTyxDQUFDRyxLQUFSLENBQWNHLE9BQWQsS0FBMEJMLE9BQU8sQ0FBQ0UsS0FBUixDQUFjRyxPQUYvQyxFQUV3RDtBQUNwRCxxQkFBTyxJQUFQO0FBQ0g7O0FBQ0QsZ0JBQUlOLE9BQU8sQ0FBQ0csS0FBUixDQUFjRyxPQUFkLEtBQTBCTCxPQUFPLENBQUNFLEtBQVIsQ0FBY0csT0FBNUMsRUFBcUQ7QUFDakQsa0JBQUlOLE9BQU8sQ0FBQ0csS0FBUixDQUFjSSxHQUFkLEtBQXNCTixPQUFPLENBQUNFLEtBQVIsQ0FBY0ksR0FBeEMsRUFBNkM7QUFDekMsdUJBQU8sSUFBUDtBQUNIO0FBQ0o7QUFDSixXQWRELE1BZUs7QUFDRCxnQkFBSVAsT0FBTyxDQUFDRyxLQUFSLENBQWNDLElBQWQsSUFBc0JKLE9BQU8sQ0FBQ0csS0FBUixDQUFjRSxNQUFwQyxJQUE4Q0wsT0FBTyxDQUFDRyxLQUFSLENBQWNHLE9BQTVELElBQXVFTixPQUFPLENBQUNHLEtBQVIsQ0FBYzdKLE9BQXpGLEVBQWtHO0FBQzlGLHFCQUFPLElBQVA7QUFDSDtBQUNKO0FBQ0osU0FyQkQsTUFzQks7QUFDRCxjQUFJMkosT0FBTyxDQUFDRSxLQUFaLEVBQW1CO0FBQ2YsZ0JBQUlGLE9BQU8sQ0FBQ0UsS0FBUixDQUFjQyxJQUFkLElBQXNCSCxPQUFPLENBQUNFLEtBQVIsQ0FBY0UsTUFBcEMsSUFBOENKLE9BQU8sQ0FBQ0UsS0FBUixDQUFjRyxPQUE1RCxJQUF1RUwsT0FBTyxDQUFDRSxLQUFSLENBQWM3SixPQUF6RixFQUFrRztBQUM5RixxQkFBTyxJQUFQO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7QUFDSjs7QUFDRCxXQUFPLEtBQVA7QUFDSCxHQTFoQm1CO0FBNGhCcEJrSyxFQUFBQSx3QkE1aEJvQixvQ0E0aEJNQyxlQTVoQk4sRUE0aEJ1QjtBQUN2QyxRQUFJQyxlQUFlLEdBQUdELGVBQWUsQ0FBQ04sS0FBaEIsQ0FBc0JJLEdBQTVDO0FBQ0EsUUFBSUksV0FBVyxHQUFHLEtBQUszRyxVQUFMLENBQWdCNEcsY0FBaEIsQ0FBK0JGLGVBQS9CLENBQWxCOztBQUNBLFFBQUlDLFdBQUosRUFBaUI7QUFDYixVQUFJRSxVQUFVLEdBQUcsSUFBSTlMLEVBQUUsQ0FBQ2dDLFdBQVAsQ0FBbUJsQyxzQkFBbkIsQ0FBakI7QUFDQSxVQUFJaU0sZUFBZSxHQUFHRCxVQUFVLENBQUN6SixZQUFYLENBQXdCckMsRUFBRSxDQUFDZ00sTUFBM0IsQ0FBdEI7O0FBQ0EsY0FBUU4sZUFBZSxDQUFDTixLQUFoQixDQUFzQmEsVUFBOUI7QUFFSSxhQUFLLEtBQUw7QUFDSUgsVUFBQUEsVUFBVSxDQUFDNUosY0FBWCxDQUEwQixDQUExQixFQUE2QixDQUE3QjtBQUNBOztBQUNKLGFBQUssUUFBTDtBQUNJNEosVUFBQUEsVUFBVSxDQUFDNUosY0FBWCxDQUEwQixDQUExQixFQUE2QixHQUE3QjtBQUNBOztBQUNKO0FBQ0k0SixVQUFBQSxVQUFVLENBQUM1SixjQUFYLENBQTBCLENBQTFCLEVBQTZCLENBQTdCO0FBQ0E7QUFWUjs7QUFZQSxVQUFJd0osZUFBZSxDQUFDTixLQUFoQixDQUFzQmMsV0FBMUIsRUFBdUNKLFVBQVUsQ0FBQ0ssWUFBWCxHQUEwQlQsZUFBZSxDQUFDTixLQUFoQixDQUFzQmMsV0FBaEQ7QUFDdkNILE1BQUFBLGVBQWUsQ0FBQ2hJLElBQWhCLEdBQXVCL0QsRUFBRSxDQUFDZ00sTUFBSCxDQUFVSSxJQUFWLENBQWVDLE1BQXRDO0FBQ0FOLE1BQUFBLGVBQWUsQ0FBQ08sUUFBaEIsR0FBMkJ0TSxFQUFFLENBQUNnTSxNQUFILENBQVVPLFFBQVYsQ0FBbUJDLE1BQTlDO0FBQ0EsV0FBS3hMLElBQUwsQ0FBVTRJLFFBQVYsQ0FBbUJrQyxVQUFuQjs7QUFDQSxXQUFLOUksY0FBTCxDQUFvQndFLElBQXBCLENBQXlCc0UsVUFBekI7O0FBRUEsVUFBSVcsVUFBVSxHQUFHYixXQUFXLENBQUNjLE9BQVosRUFBakI7QUFDQSxVQUFJQyxXQUFXLEdBQUcsQ0FBbEI7QUFDQSxVQUFJQyxXQUFXLEdBQUdILFVBQVUsQ0FBQy9LLEtBQTdCO0FBQ0EsVUFBSW1MLFlBQVksR0FBR0osVUFBVSxDQUFDSyxNQUE5QjtBQUNBLFVBQUlDLFdBQVcsR0FBR3JCLGVBQWUsQ0FBQ04sS0FBaEIsQ0FBc0I0QixVQUF4QztBQUNBLFVBQUlDLFlBQVksR0FBR3ZCLGVBQWUsQ0FBQ04sS0FBaEIsQ0FBc0I4QixXQUF6Qzs7QUFFQSxVQUFJRCxZQUFZLEdBQUcsQ0FBbkIsRUFBc0I7QUFDbEJOLFFBQUFBLFdBQVcsR0FBR00sWUFBWSxHQUFHSixZQUE3QjtBQUNBRCxRQUFBQSxXQUFXLEdBQUdBLFdBQVcsR0FBR0QsV0FBNUI7QUFDQUUsUUFBQUEsWUFBWSxHQUFHQSxZQUFZLEdBQUdGLFdBQTlCO0FBQ0gsT0FKRCxNQUtLO0FBQ0RBLFFBQUFBLFdBQVcsR0FBRyxLQUFLM0gsVUFBTCxHQUFrQjZILFlBQWhDO0FBQ0FELFFBQUFBLFdBQVcsR0FBR0EsV0FBVyxHQUFHRCxXQUE1QjtBQUNBRSxRQUFBQSxZQUFZLEdBQUdBLFlBQVksR0FBR0YsV0FBOUI7QUFDSDs7QUFFRCxVQUFJSSxXQUFXLEdBQUcsQ0FBbEIsRUFBcUJILFdBQVcsR0FBR0csV0FBZDs7QUFFckIsVUFBSSxLQUFLaEksUUFBTCxHQUFnQixDQUFwQixFQUF1QjtBQUNuQixZQUFJLEtBQUtvRSxZQUFMLEdBQW9CeUQsV0FBcEIsR0FBa0MsS0FBSzdILFFBQTNDLEVBQXFEO0FBQ2pELGVBQUt5RixlQUFMO0FBQ0g7O0FBQ0QsYUFBS3JCLFlBQUwsSUFBcUJ5RCxXQUFyQjtBQUVILE9BTkQsTUFPSztBQUNELGFBQUt6RCxZQUFMLElBQXFCeUQsV0FBckI7O0FBQ0EsWUFBSSxLQUFLekQsWUFBTCxHQUFvQixLQUFLRSxXQUE3QixFQUEwQztBQUN0QyxlQUFLQSxXQUFMLEdBQW1CLEtBQUtGLFlBQXhCO0FBQ0g7QUFDSjs7QUFDRDRDLE1BQUFBLGVBQWUsQ0FBQ0gsV0FBaEIsR0FBOEJBLFdBQTlCO0FBQ0FFLE1BQUFBLFVBQVUsQ0FBQ3FCLGNBQVgsQ0FBMEJQLFdBQTFCLEVBQXVDQyxZQUF2QztBQUNBZixNQUFBQSxVQUFVLENBQUMxQyxVQUFYLEdBQXdCLEtBQUtBLFVBQTdCOztBQUVBLFVBQUlzQyxlQUFlLENBQUNOLEtBQWhCLENBQXNCeEQsS0FBMUIsRUFBaUM7QUFDN0IsWUFBSThELGVBQWUsQ0FBQ04sS0FBaEIsQ0FBc0J4RCxLQUF0QixDQUE0QndGLEtBQWhDLEVBQXVDO0FBQ25DdEIsVUFBQUEsVUFBVSxDQUFDNUQsYUFBWCxHQUEyQndELGVBQWUsQ0FBQ04sS0FBaEIsQ0FBc0J4RCxLQUF0QixDQUE0QndGLEtBQXZEO0FBQ0g7O0FBQ0QsWUFBSTFCLGVBQWUsQ0FBQ04sS0FBaEIsQ0FBc0J4RCxLQUF0QixDQUE0QnlGLEtBQWhDLEVBQXVDO0FBQ25DdkIsVUFBQUEsVUFBVSxDQUFDMUQsV0FBWCxHQUF5QnNELGVBQWUsQ0FBQ04sS0FBaEIsQ0FBc0J4RCxLQUF0QixDQUE0QnlGLEtBQXJEO0FBQ0gsU0FGRCxNQUdLO0FBQ0R2QixVQUFBQSxVQUFVLENBQUMxRCxXQUFYLEdBQXlCLEVBQXpCO0FBQ0g7QUFDSixPQVZELE1BV0s7QUFDRDBELFFBQUFBLFVBQVUsQ0FBQzVELGFBQVgsR0FBMkIsSUFBM0I7QUFDSDtBQUNKLEtBeEVELE1BeUVLO0FBQ0RsSSxNQUFBQSxFQUFFLENBQUNzTixNQUFILENBQVUsSUFBVjtBQUNIO0FBQ0osR0EzbUJtQjtBQTZtQnBCakssRUFBQUEsZUE3bUJvQiw2QkE2bUJEO0FBQ2YsUUFBSSxDQUFDLEtBQUtrSyxPQUFWLEVBQW1COztBQUVuQixRQUFJdkMsWUFBWSxHQUFHeEwsZUFBZSxDQUFDZ08sS0FBaEIsQ0FBc0IsS0FBSzVMLE1BQTNCLENBQW5COztBQUNBLFFBQUksQ0FBQyxLQUFLbUosc0JBQUwsQ0FBNEJDLFlBQTVCLENBQUwsRUFBZ0Q7QUFDNUMsV0FBS2pJLFVBQUwsR0FBa0JpSSxZQUFsQjs7QUFDQSxXQUFLdkUsaUNBQUw7O0FBQ0E7QUFDSDs7QUFFRCxTQUFLMUQsVUFBTCxHQUFrQmlJLFlBQWxCOztBQUNBLFNBQUtsQyxXQUFMOztBQUVBLFFBQUkyRSxhQUFhLEdBQUcsS0FBcEI7QUFDQSxRQUFJbkcsS0FBSjtBQUNBLFFBQUlJLFNBQUo7O0FBRUEsU0FBSyxJQUFJSyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHLEtBQUtoRixVQUFMLENBQWdCd0UsTUFBcEMsRUFBNEMsRUFBRVEsQ0FBOUMsRUFBaUQ7QUFDN0MsVUFBSTJELGVBQWUsR0FBRyxLQUFLM0ksVUFBTCxDQUFnQmdGLENBQWhCLENBQXRCO0FBQ0EsVUFBSW9ELElBQUksR0FBR08sZUFBZSxDQUFDUCxJQUEzQixDQUY2QyxDQUc3Qzs7QUFDQSxVQUFJQSxJQUFJLEtBQUssRUFBYixFQUFpQjtBQUNiLFlBQUlPLGVBQWUsQ0FBQ04sS0FBaEIsSUFBeUJNLGVBQWUsQ0FBQ04sS0FBaEIsQ0FBc0JzQyxPQUFuRCxFQUE0RDtBQUN4RCxlQUFLbEQsZUFBTDs7QUFDQTtBQUNIOztBQUNELFlBQUlrQixlQUFlLENBQUNOLEtBQWhCLElBQXlCTSxlQUFlLENBQUNOLEtBQWhCLENBQXNCRyxPQUEvQyxJQUEwRCxLQUFLdEcsVUFBbkUsRUFBK0U7QUFDM0UsZUFBS3dHLHdCQUFMLENBQThCQyxlQUE5Qjs7QUFDQTtBQUNIO0FBQ0o7O0FBQ0QsVUFBSWlDLGNBQWMsR0FBR3hDLElBQUksQ0FBQ3lDLEtBQUwsQ0FBVyxJQUFYLENBQXJCOztBQUVBLFdBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0YsY0FBYyxDQUFDcEcsTUFBbkMsRUFBMkMsRUFBRXNHLENBQTdDLEVBQWdEO0FBQzVDLFlBQUkvRCxXQUFXLEdBQUc2RCxjQUFjLENBQUNFLENBQUQsQ0FBaEM7O0FBQ0EsWUFBSS9ELFdBQVcsS0FBSyxFQUFwQixFQUF3QjtBQUNwQjtBQUNBLGNBQUksS0FBS2Usa0JBQUwsQ0FBd0JNLElBQXhCLEtBQ0cwQyxDQUFDLEtBQUtGLGNBQWMsQ0FBQ3BHLE1BQWYsR0FBd0IsQ0FEckMsRUFDd0M7QUFDcEM7QUFDSDs7QUFDRCxlQUFLaUQsZUFBTDs7QUFDQWlELFVBQUFBLGFBQWEsR0FBRyxJQUFoQjtBQUNBO0FBQ0g7O0FBQ0RBLFFBQUFBLGFBQWEsR0FBRyxLQUFoQjs7QUFFQSxZQUFJLEtBQUsxSSxRQUFMLEdBQWdCLENBQXBCLEVBQXVCO0FBQ25CLGNBQUlnRixVQUFVLEdBQUcsS0FBSzNDLFlBQUwsQ0FBa0JXLENBQWxCLEVBQXFCK0IsV0FBckIsQ0FBakI7O0FBQ0EsZUFBS0QsMkJBQUwsQ0FBaUNDLFdBQWpDLEVBQThDQyxVQUE5QyxFQUEwRGhDLENBQTFEOztBQUVBLGNBQUk0RixjQUFjLENBQUNwRyxNQUFmLEdBQXdCLENBQXhCLElBQTZCc0csQ0FBQyxHQUFHRixjQUFjLENBQUNwRyxNQUFmLEdBQXdCLENBQTdELEVBQWdFO0FBQzVELGlCQUFLaUQsZUFBTDtBQUNIO0FBQ0osU0FQRCxNQVFLO0FBQ0RsRCxVQUFBQSxLQUFLLEdBQUcsS0FBS21DLGdCQUFMLENBQXNCSyxXQUF0QixFQUFtQy9CLENBQW5DLENBQVI7QUFDQUwsVUFBQUEsU0FBUyxHQUFHSixLQUFLLENBQUNLLGNBQU4sRUFBWjtBQUVBLGVBQUt3QixZQUFMLElBQXFCekIsU0FBUyxDQUFDaEcsS0FBL0I7O0FBQ0EsY0FBSSxLQUFLeUgsWUFBTCxHQUFvQixLQUFLRSxXQUE3QixFQUEwQztBQUN0QyxpQkFBS0EsV0FBTCxHQUFtQixLQUFLRixZQUF4QjtBQUNIOztBQUVELGNBQUl3RSxjQUFjLENBQUNwRyxNQUFmLEdBQXdCLENBQXhCLElBQTZCc0csQ0FBQyxHQUFHRixjQUFjLENBQUNwRyxNQUFmLEdBQXdCLENBQTdELEVBQWdFO0FBQzVELGlCQUFLaUQsZUFBTDtBQUNIO0FBQ0o7QUFDSjtBQUNKOztBQUNELFFBQUksQ0FBQ2lELGFBQUwsRUFBb0I7QUFDaEIsV0FBS3ZLLFdBQUwsQ0FBaUJzRSxJQUFqQixDQUFzQixLQUFLMkIsWUFBM0I7QUFDSDs7QUFFRCxRQUFJLEtBQUtwRSxRQUFMLEdBQWdCLENBQXBCLEVBQXVCO0FBQ25CLFdBQUtzRSxXQUFMLEdBQW1CLEtBQUt0RSxRQUF4QjtBQUNIOztBQUNELFNBQUt1RSxZQUFMLEdBQW9CLENBQUMsS0FBS0YsVUFBTCxHQUFrQjlKLFNBQVMsQ0FBQ3dPLGNBQTdCLElBQStDLEtBQUs5SSxVQUF4RSxDQTdFZSxDQStFZjs7QUFDQSxTQUFLaEUsSUFBTCxDQUFVbU0sY0FBVixDQUF5QixLQUFLOUQsV0FBOUIsRUFBMkMsS0FBS0MsWUFBaEQ7O0FBRUEsU0FBS3lFLHVCQUFMOztBQUNBLFNBQUs3SixZQUFMLEdBQW9CLEtBQXBCO0FBQ0gsR0Fqc0JtQjtBQW1zQnBCaUcsRUFBQUEsZ0JBbnNCb0IsNEJBbXNCRmdCLElBbnNCRSxFQW1zQkk2QyxVQW5zQkosRUFtc0JnQkMsT0Fuc0JoQixFQW1zQnlCO0FBQ3pDLFFBQUlDLFNBQVMsR0FBRy9DLElBQUksQ0FBQ2dELE1BQUwsQ0FBWUgsVUFBWixDQUFoQjs7QUFDQSxRQUFJMU8sU0FBUyxDQUFDOE8sWUFBVixDQUF1QkYsU0FBdkIsS0FDRzVPLFNBQVMsQ0FBQytPLGNBQVYsQ0FBeUJILFNBQXpCLENBRFAsRUFDNEM7QUFDeEMsYUFBTyxDQUFQO0FBQ0g7O0FBRUQsUUFBSUksR0FBRyxHQUFHLENBQVY7O0FBQ0EsU0FBSyxJQUFJQyxLQUFLLEdBQUdQLFVBQVUsR0FBRyxDQUE5QixFQUFpQ08sS0FBSyxHQUFHTixPQUF6QyxFQUFrRCxFQUFFTSxLQUFwRCxFQUEyRDtBQUN2REwsTUFBQUEsU0FBUyxHQUFHL0MsSUFBSSxDQUFDZ0QsTUFBTCxDQUFZSSxLQUFaLENBQVo7O0FBQ0EsVUFBSWpQLFNBQVMsQ0FBQytPLGNBQVYsQ0FBeUJILFNBQXpCLEtBQ0c1TyxTQUFTLENBQUM4TyxZQUFWLENBQXVCRixTQUF2QixDQURQLEVBQzBDO0FBQ3RDO0FBQ0g7O0FBQ0RJLE1BQUFBLEdBQUc7QUFDTjs7QUFFRCxXQUFPQSxHQUFQO0FBQ0gsR0FydEJtQjtBQXV0QnBCUCxFQUFBQSx1QkF2dEJvQixxQ0F1dEJPO0FBQ3ZCLFFBQUlTLFVBQVUsR0FBRyxDQUFqQjtBQUNBLFFBQUlDLGFBQWEsR0FBRyxDQUFwQjtBQUNBLFFBQUlDLGNBQWMsR0FBRyxLQUFLdEYsVUFBMUI7O0FBQ0EsU0FBSyxJQUFJckIsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxLQUFLL0UsY0FBTCxDQUFvQnVFLE1BQXhDLEVBQWdELEVBQUVRLENBQWxELEVBQXFEO0FBQ2pELFVBQUlULEtBQUssR0FBRyxLQUFLdEUsY0FBTCxDQUFvQitFLENBQXBCLENBQVo7QUFDQSxVQUFJNEcsU0FBUyxHQUFHckgsS0FBSyxDQUFDOEIsVUFBdEI7O0FBQ0EsVUFBSXVGLFNBQVMsR0FBR0YsYUFBaEIsRUFBK0I7QUFDM0JELFFBQUFBLFVBQVUsR0FBRyxDQUFiO0FBQ0FDLFFBQUFBLGFBQWEsR0FBR0UsU0FBaEI7QUFDSDs7QUFDRCxVQUFJQyxXQUFXLEdBQUcsQ0FBbEIsQ0FQaUQsQ0FRakQ7O0FBQ0EsY0FBUSxLQUFLdE0sZUFBYjtBQUNJLGFBQUs3QyxlQUFlLENBQUM4QyxJQUFyQjtBQUNJcU0sVUFBQUEsV0FBVyxHQUFHLENBQUUsS0FBS3ZGLFdBQVAsR0FBcUIsQ0FBbkM7QUFDQTs7QUFDSixhQUFLNUosZUFBZSxDQUFDZ0QsTUFBckI7QUFDSW1NLFVBQUFBLFdBQVcsR0FBRyxDQUFFLEtBQUsxTCxXQUFMLENBQWlCeUwsU0FBUyxHQUFHLENBQTdCLENBQUYsR0FBb0MsQ0FBbEQ7QUFDQTs7QUFDSixhQUFLbFAsZUFBZSxDQUFDb1AsS0FBckI7QUFDSUQsVUFBQUEsV0FBVyxHQUFHLEtBQUt2RixXQUFMLEdBQW1CLENBQW5CLEdBQXVCLEtBQUtuRyxXQUFMLENBQWlCeUwsU0FBUyxHQUFHLENBQTdCLENBQXJDO0FBQ0E7O0FBQ0o7QUFDSTtBQVhSOztBQWFBckgsTUFBQUEsS0FBSyxDQUFDd0gsQ0FBTixHQUFVTixVQUFVLEdBQUdJLFdBQXZCO0FBRUEsVUFBSWxILFNBQVMsR0FBR0osS0FBSyxDQUFDSyxjQUFOLEVBQWhCO0FBRUFMLE1BQUFBLEtBQUssQ0FBQ3lILENBQU4sR0FBVSxLQUFLL0osVUFBTCxJQUFtQjBKLGNBQWMsR0FBR0MsU0FBcEMsSUFBaUQsS0FBS3JGLFlBQUwsR0FBb0IsQ0FBL0U7O0FBRUEsVUFBSXFGLFNBQVMsS0FBS0YsYUFBbEIsRUFBaUM7QUFDN0JELFFBQUFBLFVBQVUsSUFBSTlHLFNBQVMsQ0FBQ2hHLEtBQXhCO0FBQ0g7O0FBRUQsVUFBSXNOLE1BQU0sR0FBRzFILEtBQUssQ0FBQzlGLFlBQU4sQ0FBbUJ4QixFQUFFLENBQUNnTSxNQUF0QixDQUFiOztBQUNBLFVBQUlnRCxNQUFKLEVBQVk7QUFDUjtBQUNBLFlBQUlDLGFBQWEsR0FBRyxLQUFLakssVUFBekI7QUFDQSxZQUFJa0ssY0FBYyxHQUFHLEtBQUtsSyxVQUFMLElBQW1CLElBQUkxRixTQUFTLENBQUN3TyxjQUFqQyxDQUFyQixDQUhRLENBRytEOztBQUN2RSxnQkFBUXhHLEtBQUssQ0FBQzZILE9BQWQ7QUFFSSxlQUFLLENBQUw7QUFDSTdILFlBQUFBLEtBQUssQ0FBQ3lILENBQU4sSUFBYUUsYUFBYSxHQUFLLENBQUVDLGNBQWMsR0FBR0QsYUFBbkIsSUFBb0MsQ0FBbkU7QUFDQTs7QUFDSixlQUFLLEdBQUw7QUFDSTNILFlBQUFBLEtBQUssQ0FBQ3lILENBQU4sSUFBYUcsY0FBYyxHQUFHLENBQTlCO0FBQ0E7O0FBQ0o7QUFDSTVILFlBQUFBLEtBQUssQ0FBQ3lILENBQU4sSUFBYSxDQUFDRyxjQUFjLEdBQUdELGFBQWxCLElBQW1DLENBQWhEO0FBQ0E7QUFWUixTQUpRLENBZ0JSOzs7QUFDQSxZQUFJM0gsS0FBSyxDQUFDNkUsWUFBVixFQUNBO0FBQ0ksY0FBSWlELE9BQU8sR0FBRzlILEtBQUssQ0FBQzZFLFlBQU4sQ0FBbUJ5QixLQUFuQixDQUF5QixHQUF6QixDQUFkOztBQUNBLGNBQUl3QixPQUFPLENBQUM3SCxNQUFSLEtBQW1CLENBQW5CLElBQXdCNkgsT0FBTyxDQUFDLENBQUQsQ0FBbkMsRUFDQTtBQUNJLGdCQUFJQyxPQUFPLEdBQUdDLFVBQVUsQ0FBQ0YsT0FBTyxDQUFDLENBQUQsQ0FBUixDQUF4QjtBQUNBLGdCQUFJRyxNQUFNLENBQUNDLFNBQVAsQ0FBaUJILE9BQWpCLENBQUosRUFBK0IvSCxLQUFLLENBQUN5SCxDQUFOLElBQVdNLE9BQVg7QUFDbEMsV0FKRCxNQUtLLElBQUdELE9BQU8sQ0FBQzdILE1BQVIsS0FBbUIsQ0FBdEIsRUFDTDtBQUNJLGdCQUFJa0ksT0FBTyxHQUFHSCxVQUFVLENBQUNGLE9BQU8sQ0FBQyxDQUFELENBQVIsQ0FBeEI7O0FBQ0EsZ0JBQUlDLFFBQU8sR0FBR0MsVUFBVSxDQUFDRixPQUFPLENBQUMsQ0FBRCxDQUFSLENBQXhCOztBQUNBLGdCQUFJRyxNQUFNLENBQUNDLFNBQVAsQ0FBaUJDLE9BQWpCLENBQUosRUFBK0JuSSxLQUFLLENBQUN3SCxDQUFOLElBQVdXLE9BQVg7QUFDL0IsZ0JBQUlGLE1BQU0sQ0FBQ0MsU0FBUCxDQUFpQkgsUUFBakIsQ0FBSixFQUErQi9ILEtBQUssQ0FBQ3lILENBQU4sSUFBV00sUUFBWDtBQUNsQztBQUNKO0FBQ0osT0FsRWdELENBb0VqRDs7O0FBQ0EsVUFBSTlOLE9BQU8sR0FBRytGLEtBQUssQ0FBQzlGLFlBQU4sQ0FBbUJ4QixFQUFFLENBQUN5QixZQUF0QixDQUFkO0FBQ0EsVUFBSUYsT0FBTyxJQUFJQSxPQUFPLENBQUNHLEtBQXZCLEVBQThCNEYsS0FBSyxDQUFDeUgsQ0FBTixHQUFVekgsS0FBSyxDQUFDeUgsQ0FBTixHQUFVeE4sT0FBTyxDQUFDRyxLQUE1QjtBQUNqQztBQUNKLEdBbnlCbUI7QUFxeUJwQmdPLEVBQUFBLHlCQXJ5Qm9CLHFDQXF5Qk96SixLQXJ5QlAsRUFxeUJjO0FBQzlCLFFBQUkwSixVQUFVLEdBQUcxSixLQUFLLENBQUMySixXQUFOLEVBQWpCOztBQUNBLFFBQUk1UCxFQUFFLENBQUM2UCxLQUFILENBQVNGLFVBQVQsQ0FBSixFQUEwQjtBQUN0QixhQUFPM1AsRUFBRSxDQUFDNlAsS0FBSCxDQUFTRixVQUFULENBQVA7QUFDSCxLQUZELE1BR0s7QUFDRCxVQUFJRyxHQUFHLEdBQUc5UCxFQUFFLENBQUNpRyxLQUFILEVBQVY7QUFDQSxhQUFPNkosR0FBRyxDQUFDQyxPQUFKLENBQVk5SixLQUFaLENBQVA7QUFDSDtBQUNKLEdBOXlCbUI7QUFnekJwQjtBQUNBVSxFQUFBQSxtQkFqekJvQiwrQkFpekJDN0UsU0FqekJELEVBaXpCWUYsTUFqekJaLEVBaXpCb0JvTyxLQWp6QnBCLEVBaXpCMkI7QUFDM0MsUUFBSTVOLGNBQWMsR0FBR04sU0FBUyxDQUFDTixZQUFWLENBQXVCeEIsRUFBRSxDQUFDQyxLQUExQixDQUFyQjs7QUFDQSxRQUFJLENBQUNtQyxjQUFMLEVBQXFCO0FBQ2pCO0FBQ0g7O0FBRUQsUUFBSW1NLEtBQUssR0FBR3pNLFNBQVMsQ0FBQzJGLFdBQXRCO0FBRUEsUUFBSXdJLFNBQVMsR0FBRyxJQUFoQjs7QUFDQSxRQUFJLEtBQUtsTixVQUFMLENBQWdCd0wsS0FBaEIsQ0FBSixFQUE0QjtBQUN4QjBCLE1BQUFBLFNBQVMsR0FBRyxLQUFLbE4sVUFBTCxDQUFnQndMLEtBQWhCLEVBQXVCbkQsS0FBbkM7QUFDSDs7QUFFRCxRQUFJNkUsU0FBUyxJQUFJQSxTQUFTLENBQUNoSyxLQUEzQixFQUFrQztBQUM5Qm5FLE1BQUFBLFNBQVMsQ0FBQ21FLEtBQVYsR0FBa0IsS0FBS3lKLHlCQUFMLENBQStCTyxTQUFTLENBQUNoSyxLQUF6QyxDQUFsQjtBQUNILEtBRkQsTUFFTTtBQUNGbkUsTUFBQUEsU0FBUyxDQUFDbUUsS0FBVixHQUFrQixLQUFLakYsSUFBTCxDQUFVaUYsS0FBNUI7QUFDSDs7QUFFRDdELElBQUFBLGNBQWMsQ0FBQ3lDLFNBQWYsR0FBMkIsS0FBS0EsU0FBaEM7QUFFQSxRQUFJcUwsT0FBTyxHQUFHLEtBQUsxTCxJQUFMLFlBQXFCeEUsRUFBRSxDQUFDbVEsSUFBdEM7O0FBQ0EsUUFBSUQsT0FBTyxJQUFJLENBQUMsS0FBS3RMLGlCQUFyQixFQUF3QztBQUNwQ3hDLE1BQUFBLGNBQWMsQ0FBQ29DLElBQWYsR0FBc0IsS0FBS0EsSUFBM0I7QUFDSCxLQUZELE1BRU87QUFDSHBDLE1BQUFBLGNBQWMsQ0FBQ2lDLFVBQWYsR0FBNEIsS0FBS0EsVUFBakM7QUFDSDs7QUFFRGpDLElBQUFBLGNBQWMsQ0FBQ3NDLGFBQWYsR0FBK0IsS0FBS0UsaUJBQXBDO0FBQ0F4QyxJQUFBQSxjQUFjLENBQUM0QyxVQUFmLEdBQTRCLEtBQUtBLFVBQWpDO0FBQ0E1QyxJQUFBQSxjQUFjLENBQUNnTyxVQUFmLEdBQTRCSCxTQUFTLElBQUlBLFNBQVMsQ0FBQ0ksSUFBbkQ7QUFDQWpPLElBQUFBLGNBQWMsQ0FBQ2tPLGFBQWYsR0FBK0JMLFNBQVMsSUFBSUEsU0FBUyxDQUFDM0UsTUFBdEQsQ0EvQjJDLENBZ0MzQzs7QUFDQSxRQUFJMkUsU0FBUyxJQUFJQSxTQUFTLENBQUMzRSxNQUEzQixFQUFtQztBQUMvQnhKLE1BQUFBLFNBQVMsQ0FBQ0ssS0FBVixHQUFrQixFQUFsQjtBQUNIOztBQUVEQyxJQUFBQSxjQUFjLENBQUNtTyxlQUFmLEdBQWlDTixTQUFTLElBQUlBLFNBQVMsQ0FBQ08sU0FBeEQ7O0FBRUEsUUFBSVAsU0FBUyxJQUFJQSxTQUFTLENBQUMxTyxPQUEzQixFQUFvQztBQUNoQyxVQUFJa1AscUJBQXFCLEdBQUczTyxTQUFTLENBQUNOLFlBQVYsQ0FBdUJ4QixFQUFFLENBQUN5QixZQUExQixDQUE1Qjs7QUFDQSxVQUFJLENBQUNnUCxxQkFBTCxFQUE0QjtBQUN4QkEsUUFBQUEscUJBQXFCLEdBQUczTyxTQUFTLENBQUNPLFlBQVYsQ0FBdUJyQyxFQUFFLENBQUN5QixZQUExQixDQUF4QjtBQUNIOztBQUNEZ1AsTUFBQUEscUJBQXFCLENBQUN4SyxLQUF0QixHQUE4QixLQUFLeUoseUJBQUwsQ0FBK0JPLFNBQVMsQ0FBQzFPLE9BQVYsQ0FBa0IwRSxLQUFqRCxDQUE5QjtBQUNBd0ssTUFBQUEscUJBQXFCLENBQUMvTyxLQUF0QixHQUE4QnVPLFNBQVMsQ0FBQzFPLE9BQVYsQ0FBa0JHLEtBQWhEO0FBQ0g7O0FBRUQsUUFBSXVPLFNBQVMsSUFBSUEsU0FBUyxDQUFDNUUsSUFBM0IsRUFBaUM7QUFDN0JqSixNQUFBQSxjQUFjLENBQUMrQixRQUFmLEdBQTBCOEwsU0FBUyxDQUFDNUUsSUFBcEM7QUFDSCxLQUZELE1BR0s7QUFDRGpKLE1BQUFBLGNBQWMsQ0FBQytCLFFBQWYsR0FBMEIsS0FBS0EsUUFBL0I7QUFDSDs7QUFFRCxRQUFJdkMsTUFBTSxLQUFLLElBQWYsRUFBcUI7QUFDakIsVUFBSSxPQUFPQSxNQUFQLEtBQWtCLFFBQXRCLEVBQWdDO0FBQzVCQSxRQUFBQSxNQUFNLEdBQUcsS0FBS0EsTUFBZDtBQUNIOztBQUNEUSxNQUFBQSxjQUFjLENBQUNSLE1BQWYsR0FBd0JBLE1BQXhCO0FBQ0g7O0FBRURvTyxJQUFBQSxLQUFLLElBQUk1TixjQUFjLENBQUNzTyxzQkFBZixFQUFUOztBQUVBLFFBQUlULFNBQVMsSUFBSUEsU0FBUyxDQUFDckksS0FBM0IsRUFBa0M7QUFDOUIsVUFBSXFJLFNBQVMsQ0FBQ3JJLEtBQVYsQ0FBZ0J3RixLQUFwQixFQUEyQjtBQUN2QnRMLFFBQUFBLFNBQVMsQ0FBQ29HLGFBQVYsR0FBMEIrSCxTQUFTLENBQUNySSxLQUFWLENBQWdCd0YsS0FBMUM7QUFDSDs7QUFDRCxVQUFJNkMsU0FBUyxDQUFDckksS0FBVixDQUFnQnlGLEtBQXBCLEVBQTJCO0FBQ3ZCdkwsUUFBQUEsU0FBUyxDQUFDc0csV0FBVixHQUF3QjZILFNBQVMsQ0FBQ3JJLEtBQVYsQ0FBZ0J5RixLQUF4QztBQUNILE9BRkQsTUFHSztBQUNEdkwsUUFBQUEsU0FBUyxDQUFDc0csV0FBVixHQUF3QixFQUF4QjtBQUNIO0FBQ0osS0FWRCxNQVdLO0FBQ0R0RyxNQUFBQSxTQUFTLENBQUNvRyxhQUFWLEdBQTBCLElBQTFCO0FBQ0g7QUFDSixHQS8zQm1CO0FBaTRCcEJ5SSxFQUFBQSxTQWo0Qm9CLHVCQWk0QlA7QUFDVCxTQUFLLElBQUk1SSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHLEtBQUsvRSxjQUFMLENBQW9CdUUsTUFBeEMsRUFBZ0QsRUFBRVEsQ0FBbEQsRUFBcUQ7QUFDakQsV0FBSy9FLGNBQUwsQ0FBb0IrRSxDQUFwQixFQUF1QjZJLGdCQUF2Qjs7QUFDQTlQLE1BQUFBLElBQUksQ0FBQ29JLEdBQUwsQ0FBUyxLQUFLbEcsY0FBTCxDQUFvQitFLENBQXBCLENBQVQ7QUFDSDtBQUNKO0FBdDRCbUIsQ0FBVCxDQUFmO0FBeTRCQS9ILEVBQUUsQ0FBQzBDLFFBQUgsR0FBY21PLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnBPLFFBQS9CIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBqcyA9IHJlcXVpcmUoJy4uL3BsYXRmb3JtL2pzJyk7XG5jb25zdCBtYWNybyA9IHJlcXVpcmUoJy4uL3BsYXRmb3JtL0NDTWFjcm8nKTtcbmNvbnN0IHRleHRVdGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzL3RleHQtdXRpbHMnKTtcbmNvbnN0IEh0bWxUZXh0UGFyc2VyID0gcmVxdWlyZSgnLi4vdXRpbHMvaHRtbC10ZXh0LXBhcnNlcicpO1xuY29uc3QgX2h0bWxUZXh0UGFyc2VyID0gbmV3IEh0bWxUZXh0UGFyc2VyKCk7XG5cbmNvbnN0IEhvcml6b250YWxBbGlnbiA9IG1hY3JvLlRleHRBbGlnbm1lbnQ7XG5jb25zdCBWZXJ0aWNhbEFsaWduID0gbWFjcm8uVmVydGljYWxUZXh0QWxpZ25tZW50O1xuY29uc3QgUmljaFRleHRDaGlsZE5hbWUgPSBcIlJJQ0hURVhUX0NISUxEXCI7XG5jb25zdCBSaWNoVGV4dENoaWxkSW1hZ2VOYW1lID0gXCJSSUNIVEVYVF9JbWFnZV9DSElMRFwiO1xuY29uc3QgQ2FjaGVNb2RlID0gY2MuTGFiZWwuQ2FjaGVNb2RlO1xuXG4vLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIGFzIGxvbmcgYXMgaXQgY29udGludWVzIHRvIGJlIGludm9rZWQsIHdpbGwgbm90XG4vLyBiZSB0cmlnZ2VyZWQuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciBpdCBzdG9wcyBiZWluZyBjYWxsZWQgZm9yXG4vLyBOIG1pbGxpc2Vjb25kcy4gSWYgYGltbWVkaWF0ZWAgaXMgcGFzc2VkLCB0cmlnZ2VyIHRoZSBmdW5jdGlvbiBvbiB0aGVcbi8vIGxlYWRpbmcgZWRnZSwgaW5zdGVhZCBvZiB0aGUgdHJhaWxpbmcuXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcbiAgICBsZXQgdGltZW91dDtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgY29udGV4dCA9IHRoaXM7XG4gICAgICAgIGxldCBsYXRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgaWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgICAgICBpZiAoY2FsbE5vdykgZnVuYy5hcHBseShjb250ZXh0LCBhcmd1bWVudHMpO1xuICAgIH07XG59XG5cbi8qKlxuICogUmljaFRleHQgcG9vbFxuICovXG5sZXQgcG9vbCA9IG5ldyBqcy5Qb29sKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICBjYy5pc1ZhbGlkKG5vZGUpICYmIG5vZGUuZGVzdHJveSgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChDQ19ERVYpIHtcbiAgICAgICAgY2MuYXNzZXJ0KCFub2RlLl9wYXJlbnQsICdSZWN5Y2xpbmcgbm9kZVxcJ3MgcGFyZW50IHNob3VsZCBiZSBudWxsIScpO1xuICAgIH1cbiAgICBpZiAoIWNjLmlzVmFsaWQobm9kZSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBvdXRsaW5lID0gbm9kZS5nZXRDb21wb25lbnQoY2MuTGFiZWxPdXRsaW5lKTtcbiAgICAgICAgaWYgKG91dGxpbmUpIHtcbiAgICAgICAgICAgIG91dGxpbmUud2lkdGggPSAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59LCAyMCk7XG5cbnBvb2wuZ2V0ID0gZnVuY3Rpb24gKHN0cmluZywgcmljaHRleHQpIHtcbiAgICBsZXQgbGFiZWxOb2RlID0gdGhpcy5fZ2V0KCk7XG4gICAgaWYgKCFsYWJlbE5vZGUpIHtcbiAgICAgICAgbGFiZWxOb2RlID0gbmV3IGNjLlByaXZhdGVOb2RlKFJpY2hUZXh0Q2hpbGROYW1lKTtcbiAgICB9XG5cbiAgICBsYWJlbE5vZGUuc2V0UG9zaXRpb24oMCwgMCk7XG4gICAgbGFiZWxOb2RlLnNldEFuY2hvclBvaW50KDAuNSwgMC41KTtcbiAgICBsYWJlbE5vZGUuc2tld1ggPSAwO1xuXG4gICAgbGV0IGxhYmVsQ29tcG9uZW50ID0gbGFiZWxOb2RlLmdldENvbXBvbmVudChjYy5MYWJlbCk7XG4gICAgaWYgKCFsYWJlbENvbXBvbmVudCkge1xuICAgICAgICBsYWJlbENvbXBvbmVudCA9IGxhYmVsTm9kZS5hZGRDb21wb25lbnQoY2MuTGFiZWwpO1xuICAgIH1cblxuICAgIGxhYmVsQ29tcG9uZW50LnN0cmluZyA9IFwiXCI7XG4gICAgbGFiZWxDb21wb25lbnQuaG9yaXpvbnRhbEFsaWduID0gSG9yaXpvbnRhbEFsaWduLkxFRlQ7XG4gICAgbGFiZWxDb21wb25lbnQudmVydGljYWxBbGlnbiA9IFZlcnRpY2FsQWxpZ24uQ0VOVEVSO1xuXG4gICAgcmV0dXJuIGxhYmVsTm9kZTtcbn07XG5cbi8qKlxuICogISNlbiBUaGUgUmljaFRleHQgQ29tcG9uZW50LlxuICogISN6aCDlr4zmlofmnKznu4Tku7ZcbiAqIEBjbGFzcyBSaWNoVGV4dFxuICogQGV4dGVuZHMgQ29tcG9uZW50XG4gKi9cbmxldCBSaWNoVGV4dCA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuUmljaFRleHQnLFxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIGN0b3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fdGV4dEFycmF5ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fbGFiZWxTZWdtZW50cyA9IFtdO1xuICAgICAgICB0aGlzLl9sYWJlbFNlZ21lbnRzQ2FjaGUgPSBbXTtcbiAgICAgICAgdGhpcy5fbGluZXNXaWR0aCA9IFtdO1xuXG4gICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHRoaXMuX3VzZXJEZWZpbmVkRm9udCA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVSaWNoVGV4dFN0YXR1cyA9IGRlYm91bmNlKHRoaXMuX3VwZGF0ZVJpY2hUZXh0LCAyMDApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlUmljaFRleHRTdGF0dXMgPSB0aGlzLl91cGRhdGVSaWNoVGV4dDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBlZGl0b3I6IENDX0VESVRPUiAmJiB7XG4gICAgICAgIG1lbnU6ICdpMThuOk1BSU5fTUVOVS5jb21wb25lbnQucmVuZGVyZXJzL1JpY2hUZXh0JyxcbiAgICAgICAgaGVscDogJ2kxOG46Q09NUE9ORU5ULmhlbHBfdXJsLnJpY2h0ZXh0JyxcbiAgICAgICAgaW5zcGVjdG9yOiAncGFja2FnZXM6Ly9pbnNwZWN0b3IvaW5zcGVjdG9ycy9jb21wcy9yaWNodGV4dC5qcycsXG4gICAgICAgIGV4ZWN1dGVJbkVkaXRNb2RlOiB0cnVlXG4gICAgfSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gQ29udGVudCBzdHJpbmcgb2YgUmljaFRleHQuXG4gICAgICAgICAqICEjemgg5a+M5paH5pys5pi+56S655qE5paH5pys5YaF5a6544CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBzdHJpbmdcbiAgICAgICAgICovXG4gICAgICAgIHN0cmluZzoge1xuICAgICAgICAgICAgZGVmYXVsdDogJzxjb2xvcj0jMDBmZjAwPlJpY2g8L2M+PGNvbG9yPSMwZmZmZmY+VGV4dDwvY29sb3I+JyxcbiAgICAgICAgICAgIG11bHRpbGluZTogdHJ1ZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucmljaHRleHQuc3RyaW5nJyxcbiAgICAgICAgICAgIG5vdGlmeTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVJpY2hUZXh0U3RhdHVzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gSG9yaXpvbnRhbCBBbGlnbm1lbnQgb2YgZWFjaCBsaW5lIGluIFJpY2hUZXh0LlxuICAgICAgICAgKiAhI3poIOaWh+acrOWGheWuueeahOawtOW5s+Wvuem9kOaWueW8j+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge21hY3JvLlRleHRBbGlnbm1lbnR9IGhvcml6b250YWxBbGlnblxuICAgICAgICAgKi9cbiAgICAgICAgaG9yaXpvbnRhbEFsaWduOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBIb3Jpem9udGFsQWxpZ24uTEVGVCxcbiAgICAgICAgICAgIHR5cGU6IEhvcml6b250YWxBbGlnbixcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucmljaHRleHQuaG9yaXpvbnRhbF9hbGlnbicsXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIG5vdGlmeTogZnVuY3Rpb24gKG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaG9yaXpvbnRhbEFsaWduID09PSBvbGRWYWx1ZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fbGF5b3V0RGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVJpY2hUZXh0U3RhdHVzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gRm9udCBzaXplIG9mIFJpY2hUZXh0LlxuICAgICAgICAgKiAhI3poIOWvjOaWh+acrOWtl+S9k+Wkp+Wwj+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gZm9udFNpemVcbiAgICAgICAgICovXG4gICAgICAgIGZvbnRTaXplOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiA0MCxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucmljaHRleHQuZm9udF9zaXplJyxcbiAgICAgICAgICAgIG5vdGlmeTogZnVuY3Rpb24gKG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9udFNpemUgPT09IG9sZFZhbHVlKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9sYXlvdXREaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlUmljaFRleHRTdGF0dXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBDdXN0b20gU3lzdGVtIGZvbnQgb2YgUmljaFRleHRcbiAgICAgICAgICogISN6aCDlr4zmlofmnKzlrprliLbns7vnu5/lrZfkvZNcbiAgICAgICAgICogQHByb3BlcnR5IHtTdHJpbmd9IGZvbnRGYW1pbHlcbiAgICAgICAgICovXG4gICAgICAgIF9mb250RmFtaWx5OiBcIkFyaWFsXCIsXG4gICAgICAgIGZvbnRGYW1pbHk6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucmljaHRleHQuZm9udF9mYW1pbHknLFxuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udEZhbWlseTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2ZvbnRGYW1pbHkgPT09IHZhbHVlKSByZXR1cm47XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9udEZhbWlseSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX2xheW91dERpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVSaWNoVGV4dFN0YXR1cygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gQ3VzdG9tIFRURiBmb250IG9mIFJpY2hUZXh0XG4gICAgICAgICAqICEjemggIOWvjOaWh+acrOWumuWItuWtl+S9k1xuICAgICAgICAgKiBAcHJvcGVydHkge2NjLlRURkZvbnR9IGZvbnRcbiAgICAgICAgICovXG4gICAgICAgIGZvbnQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5UVEZGb250LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5yaWNodGV4dC5mb250JyxcbiAgICAgICAgICAgIG5vdGlmeTogZnVuY3Rpb24gKG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9udCA9PT0gb2xkVmFsdWUpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIHRoaXMuX2xheW91dERpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mb250KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3VzZXJEZWZpbmVkRm9udCA9IHRoaXMuZm9udDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZVN5c3RlbUZvbnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25UVEZMb2FkZWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXNlU3lzdGVtRm9udCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVJpY2hUZXh0U3RhdHVzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gV2hldGhlciB1c2Ugc3lzdGVtIGZvbnQgbmFtZSBvciBub3QuXG4gICAgICAgICAqICEjemgg5piv5ZCm5L2/55So57O757uf5a2X5L2T44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gdXNlU3lzdGVtRm9udFxuICAgICAgICAgKi9cbiAgICAgICAgX2lzU3lzdGVtRm9udFVzZWQ6IHRydWUsXG4gICAgICAgIHVzZVN5c3RlbUZvbnQ6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzU3lzdGVtRm9udFVzZWQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pc1N5c3RlbUZvbnRVc2VkID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2lzU3lzdGVtRm9udFVzZWQgPSB2YWx1ZTtcblxuICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZvbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3VzZXJEZWZpbmVkRm9udCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mb250ID0gdGhpcy5fdXNlckRlZmluZWRGb250O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5fbGF5b3V0RGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVJpY2hUZXh0U3RhdHVzKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnJpY2h0ZXh0LnN5c3RlbV9mb250JyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgY2FjaGUgbW9kZSBvZiBsYWJlbC4gVGhpcyBtb2RlIG9ubHkgc3VwcG9ydHMgc3lzdGVtIGZvbnRzLlxuICAgICAgICAgKiAhI3poIOaWh+acrOe8k+WtmOaooeW8jywg6K+l5qih5byP5Y+q5pSv5oyB57O757uf5a2X5L2T44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TGFiZWwuQ2FjaGVNb2RlfSBjYWNoZU1vZGVcbiAgICAgICAgICovXG4gICAgICAgIGNhY2hlTW9kZToge1xuICAgICAgICAgICAgZGVmYXVsdDogQ2FjaGVNb2RlLk5PTkUsXG4gICAgICAgICAgICB0eXBlOiBDYWNoZU1vZGUsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmxhYmVsLmNhY2hlTW9kZScsXG4gICAgICAgICAgICBub3RpZnkgKG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2FjaGVNb2RlID09PSBvbGRWYWx1ZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlUmljaFRleHRTdGF0dXMoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBtYXhpbWl6ZSB3aWR0aCBvZiB0aGUgUmljaFRleHRcbiAgICAgICAgICogISN6aCDlr4zmlofmnKznmoTmnIDlpKflrr3luqZcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IG1heFdpZHRoXG4gICAgICAgICAqL1xuICAgICAgICBtYXhXaWR0aDoge1xuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucmljaHRleHQubWF4X3dpZHRoJyxcbiAgICAgICAgICAgIG5vdGlmeTogZnVuY3Rpb24gKG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWF4V2lkdGggPT09IG9sZFZhbHVlKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9sYXlvdXREaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlUmljaFRleHRTdGF0dXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBMaW5lIEhlaWdodCBvZiBSaWNoVGV4dC5cbiAgICAgICAgICogISN6aCDlr4zmlofmnKzooYzpq5jjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGxpbmVIZWlnaHRcbiAgICAgICAgICovXG4gICAgICAgIGxpbmVIZWlnaHQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IDQwLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5yaWNodGV4dC5saW5lX2hlaWdodCcsXG4gICAgICAgICAgICBub3RpZnk6IGZ1bmN0aW9uIChvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxpbmVIZWlnaHQgPT09IG9sZFZhbHVlKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9sYXlvdXREaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlUmljaFRleHRTdGF0dXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgaW1hZ2UgYXRsYXMgZm9yIHRoZSBpbWcgdGFnLiBGb3IgZWFjaCBzcmMgdmFsdWUgaW4gdGhlIGltZyB0YWcsIHRoZXJlIHNob3VsZCBiZSBhIHZhbGlkIHNwcml0ZUZyYW1lIGluIHRoZSBpbWFnZSBhdGxhcy5cbiAgICAgICAgICogISN6aCDlr7nkuo4gaW1nIOagh+etvumHjOmdoueahCBzcmMg5bGe5oCn5ZCN56ew77yM6YO96ZyA6KaB5ZyoIGltYWdlQXRsYXMg6YeM6Z2i5om+5Yiw5LiA5Liq5pyJ5pWI55qEIHNwcml0ZUZyYW1l77yM5ZCm5YiZIGltZyB0YWcg5Lya5Yik5a6a5Li65peg5pWI44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U3ByaXRlQXRsYXN9IGltYWdlQXRsYXNcbiAgICAgICAgICovXG4gICAgICAgIGltYWdlQXRsYXM6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVBdGxhcyxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucmljaHRleHQuaW1hZ2VfYXRsYXMnLFxuICAgICAgICAgICAgbm90aWZ5OiBmdW5jdGlvbiAob2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbWFnZUF0bGFzID09PSBvbGRWYWx1ZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fbGF5b3V0RGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVJpY2hUZXh0U3RhdHVzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogT25jZSBjaGVja2VkLCB0aGUgUmljaFRleHQgd2lsbCBibG9jayBhbGwgaW5wdXQgZXZlbnRzIChtb3VzZSBhbmQgdG91Y2gpIHdpdGhpblxuICAgICAgICAgKiB0aGUgYm91bmRpbmcgYm94IG9mIHRoZSBub2RlLCBwcmV2ZW50aW5nIHRoZSBpbnB1dCBmcm9tIHBlbmV0cmF0aW5nIGludG8gdGhlIHVuZGVybHlpbmcgbm9kZS5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDpgInkuK3mraTpgInpobnlkI7vvIxSaWNoVGV4dCDlsIbpmLvmraLoioLngrnovrnnlYzmoYbkuK3nmoTmiYDmnInovpPlhaXkuovku7bvvIjpvKDmoIflkozop6bmkbjvvInvvIzku47ogIzpmLLmraLovpPlhaXkuovku7bnqb/pgI/liLDlupXlsYLoioLngrnjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBoYW5kbGVUb3VjaEV2ZW50XG4gICAgICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgICAgICovXG4gICAgICAgIGhhbmRsZVRvdWNoRXZlbnQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnJpY2h0ZXh0LmhhbmRsZVRvdWNoRXZlbnQnLFxuICAgICAgICAgICAgbm90aWZ5OiBmdW5jdGlvbiAob2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oYW5kbGVUb3VjaEV2ZW50ID09PSBvbGRWYWx1ZSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmVuYWJsZWRJbkhpZXJhcmNoeSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVRvdWNoRXZlbnQgPyB0aGlzLl9hZGRFdmVudExpc3RlbmVycygpIDogdGhpcy5fcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RhdGljczoge1xuICAgICAgICBIb3Jpem9udGFsQWxpZ246IEhvcml6b250YWxBbGlnbixcbiAgICAgICAgVmVydGljYWxBbGlnbjogVmVydGljYWxBbGlnblxuICAgIH0sXG5cbiAgICBvbkVuYWJsZSAoKSB7XG4gICAgICAgIGlmICh0aGlzLmhhbmRsZVRvdWNoRXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX2FkZEV2ZW50TGlzdGVuZXJzKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdXBkYXRlUmljaFRleHQoKTtcbiAgICAgICAgdGhpcy5fYWN0aXZhdGVDaGlsZHJlbih0cnVlKTtcbiAgICB9LFxuXG4gICAgb25EaXNhYmxlICgpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFuZGxlVG91Y2hFdmVudCkge1xuICAgICAgICAgICAgdGhpcy5fcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9hY3RpdmF0ZUNoaWxkcmVuKGZhbHNlKTtcbiAgICB9LFxuXG4gICAgc3RhcnQgKCkge1xuICAgICAgICB0aGlzLl9vblRURkxvYWRlZCgpO1xuICAgIH0sXG5cbiAgICBfb25Db2xvckNoYW5nZWQgKHBhcmVudENvbG9yKSB7XG4gICAgICAgIGxldCBjaGlsZHJlbiA9IHRoaXMubm9kZS5jaGlsZHJlbjtcbiAgICAgICAgY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGROb2RlKSB7XG4gICAgICAgICAgICBjaGlsZE5vZGUuY29sb3IgPSBwYXJlbnRDb2xvcjtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIF9hZGRFdmVudExpc3RlbmVycyAoKSB7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMuX29uVG91Y2hFbmRlZCwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5DT0xPUl9DSEFOR0VELCB0aGlzLl9vbkNvbG9yQ2hhbmdlZCwgdGhpcyk7XG4gICAgfSxcblxuICAgIF9yZW1vdmVFdmVudExpc3RlbmVycyAoKSB7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLl9vblRvdWNoRW5kZWQsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLkNPTE9SX0NIQU5HRUQsIHRoaXMuX29uQ29sb3JDaGFuZ2VkLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZUxhYmVsU2VnbWVudFRleHRBdHRyaWJ1dGVzICgpIHtcbiAgICAgICAgdGhpcy5fbGFiZWxTZWdtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICB0aGlzLl9hcHBseVRleHRBdHRyaWJ1dGUoaXRlbSwgbnVsbCwgdHJ1ZSk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIF9jcmVhdGVGb250TGFiZWwgKHN0cmluZykge1xuICAgICAgICByZXR1cm4gcG9vbC5nZXQoc3RyaW5nLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX29uVFRGTG9hZGVkICgpIHtcbiAgICAgICAgaWYgKHRoaXMuZm9udCBpbnN0YW5jZW9mIGNjLlRURkZvbnQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmZvbnQuX25hdGl2ZUFzc2V0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGF5b3V0RGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVJpY2hUZXh0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgY2MubG9hZGVyLmxvYWQodGhpcy5mb250Lm5hdGl2ZVVybCwgZnVuY3Rpb24gKGVyciwgZm9udEZhbWlseSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9sYXlvdXREaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX3VwZGF0ZVJpY2hUZXh0KCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9sYXlvdXREaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVSaWNoVGV4dCgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9tZWFzdXJlVGV4dCAoc3R5bGVJbmRleCwgc3RyaW5nKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgbGV0IGZ1bmMgPSBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gICAgICAgICAgICBsZXQgbGFiZWw7XG4gICAgICAgICAgICBpZiAoc2VsZi5fbGFiZWxTZWdtZW50c0NhY2hlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGxhYmVsID0gc2VsZi5fY3JlYXRlRm9udExhYmVsKHN0cmluZyk7XG4gICAgICAgICAgICAgICAgc2VsZi5fbGFiZWxTZWdtZW50c0NhY2hlLnB1c2gobGFiZWwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsYWJlbCA9IHNlbGYuX2xhYmVsU2VnbWVudHNDYWNoZVswXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxhYmVsLl9zdHlsZUluZGV4ID0gc3R5bGVJbmRleDtcbiAgICAgICAgICAgIHNlbGYuX2FwcGx5VGV4dEF0dHJpYnV0ZShsYWJlbCwgc3RyaW5nLCB0cnVlKTtcbiAgICAgICAgICAgIGxldCBsYWJlbFNpemUgPSBsYWJlbC5nZXRDb250ZW50U2l6ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGxhYmVsU2l6ZS53aWR0aDtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmMoc3RyaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9vblRvdWNoRW5kZWQgKGV2ZW50KSB7XG4gICAgICAgIGxldCBjb21wb25lbnRzID0gdGhpcy5ub2RlLmdldENvbXBvbmVudHMoY2MuQ29tcG9uZW50KTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2xhYmVsU2VnbWVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGxldCBsYWJlbFNlZ21lbnQgPSB0aGlzLl9sYWJlbFNlZ21lbnRzW2ldO1xuICAgICAgICAgICAgbGV0IGNsaWNrSGFuZGxlciA9IGxhYmVsU2VnbWVudC5fY2xpY2tIYW5kbGVyO1xuICAgICAgICAgICAgbGV0IGNsaWNrUGFyYW0gPSBsYWJlbFNlZ21lbnQuX2NsaWNrUGFyYW07XG4gICAgICAgICAgICBpZiAoY2xpY2tIYW5kbGVyICYmIHRoaXMuX2NvbnRhaW5zVG91Y2hMb2NhdGlvbihsYWJlbFNlZ21lbnQsIGV2ZW50LnRvdWNoLmdldExvY2F0aW9uKCkpKSB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChjb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5lbmFibGVkSW5IaWVyYXJjaHkgJiYgY29tcG9uZW50W2NsaWNrSGFuZGxlcl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudFtjbGlja0hhbmRsZXJdKGV2ZW50LCBjbGlja1BhcmFtKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9jb250YWluc1RvdWNoTG9jYXRpb24gKGxhYmVsLCBwb2ludCkge1xuICAgICAgICBsZXQgbXlSZWN0ID0gbGFiZWwuZ2V0Qm91bmRpbmdCb3hUb1dvcmxkKCk7XG4gICAgICAgIHJldHVybiBteVJlY3QuY29udGFpbnMocG9pbnQpO1xuICAgIH0sXG5cbiAgICBfcmVzZXRTdGF0ZSAoKSB7XG4gICAgICAgIGxldCBjaGlsZHJlbiA9IHRoaXMubm9kZS5jaGlsZHJlbjtcbiAgICAgICAgZm9yIChsZXQgaSA9IGNoaWxkcmVuLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGlmIChjaGlsZC5uYW1lID09PSBSaWNoVGV4dENoaWxkTmFtZSB8fCBjaGlsZC5uYW1lID09PSBSaWNoVGV4dENoaWxkSW1hZ2VOYW1lKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLnBhcmVudCA9PT0gdGhpcy5ub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLnBhcmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBJbiBjYXNlIGNoaWxkLnBhcmVudCAhPT0gdGhpcy5ub2RlLCBjaGlsZCBjYW5ub3QgYmUgcmVtb3ZlZCBmcm9tIGNoaWxkcmVuXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLm5hbWUgPT09IFJpY2hUZXh0Q2hpbGROYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvb2wucHV0KGNoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sYWJlbFNlZ21lbnRzLmxlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMuX2xhYmVsU2VnbWVudHNDYWNoZS5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLl9saW5lc1dpZHRoLmxlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMuX2xpbmVPZmZzZXRYID0gMDtcbiAgICAgICAgdGhpcy5fbGluZUNvdW50ID0gMTtcbiAgICAgICAgdGhpcy5fbGFiZWxXaWR0aCA9IDA7XG4gICAgICAgIHRoaXMuX2xhYmVsSGVpZ2h0ID0gMDtcbiAgICAgICAgdGhpcy5fbGF5b3V0RGlydHkgPSB0cnVlO1xuICAgIH0sXG5cbiAgICBvblJlc3RvcmU6IENDX0VESVRPUiAmJiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFRPRE86IHJlZmluZSB1bmRvL3JlZG8gc3lzdGVtXG4gICAgICAgIC8vIEJlY2F1c2UgdW5kby9yZWRvIHdpbGwgbm90IGNhbGwgb25FbmFibGUvb25EaXNhYmxlLFxuICAgICAgICAvLyB3ZSBuZWVkIGNhbGwgb25FbmFibGUvb25EaXNhYmxlIG1hbnVhbGx5IHRvIGFjdGl2ZS9kaXNhY3RpdmUgY2hpbGRyZW4gbm9kZXMuXG4gICAgICAgIGlmICh0aGlzLmVuYWJsZWRJbkhpZXJhcmNoeSkge1xuICAgICAgICAgICAgdGhpcy5vbkVuYWJsZSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vbkRpc2FibGUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfYWN0aXZhdGVDaGlsZHJlbiAoYWN0aXZlKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLm5vZGUuY2hpbGRyZW4ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMubm9kZS5jaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGlmIChjaGlsZC5uYW1lID09PSBSaWNoVGV4dENoaWxkTmFtZSB8fCBjaGlsZC5uYW1lID09PSBSaWNoVGV4dENoaWxkSW1hZ2VOYW1lKSB7XG4gICAgICAgICAgICAgICAgY2hpbGQuYWN0aXZlID0gYWN0aXZlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9hZGRMYWJlbFNlZ21lbnQgKHN0cmluZ1Rva2VuLCBzdHlsZUluZGV4KSB7XG4gICAgICAgIGxldCBsYWJlbFNlZ21lbnQ7XG4gICAgICAgIGlmICh0aGlzLl9sYWJlbFNlZ21lbnRzQ2FjaGUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBsYWJlbFNlZ21lbnQgPSB0aGlzLl9jcmVhdGVGb250TGFiZWwoc3RyaW5nVG9rZW4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGFiZWxTZWdtZW50ID0gdGhpcy5fbGFiZWxTZWdtZW50c0NhY2hlLnBvcCgpO1xuICAgICAgICB9XG4gICAgICAgIGxhYmVsU2VnbWVudC5fc3R5bGVJbmRleCA9IHN0eWxlSW5kZXg7XG4gICAgICAgIGxhYmVsU2VnbWVudC5fbGluZUNvdW50ID0gdGhpcy5fbGluZUNvdW50O1xuICAgICAgICBsYWJlbFNlZ21lbnQuYWN0aXZlID0gdGhpcy5ub2RlLmFjdGl2ZTtcblxuICAgICAgICBsYWJlbFNlZ21lbnQuc2V0QW5jaG9yUG9pbnQoMCwgMCk7XG4gICAgICAgIHRoaXMuX2FwcGx5VGV4dEF0dHJpYnV0ZShsYWJlbFNlZ21lbnQsIHN0cmluZ1Rva2VuKTtcblxuICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQobGFiZWxTZWdtZW50KTtcbiAgICAgICAgdGhpcy5fbGFiZWxTZWdtZW50cy5wdXNoKGxhYmVsU2VnbWVudCk7XG5cbiAgICAgICAgcmV0dXJuIGxhYmVsU2VnbWVudDtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZVJpY2hUZXh0V2l0aE1heFdpZHRoIChsYWJlbFN0cmluZywgbGFiZWxXaWR0aCwgc3R5bGVJbmRleCkge1xuICAgICAgICBsZXQgZnJhZ21lbnRXaWR0aCA9IGxhYmVsV2lkdGg7XG4gICAgICAgIGxldCBsYWJlbFNlZ21lbnQ7XG5cbiAgICAgICAgaWYgKHRoaXMuX2xpbmVPZmZzZXRYID4gMCAmJiBmcmFnbWVudFdpZHRoICsgdGhpcy5fbGluZU9mZnNldFggPiB0aGlzLm1heFdpZHRoKSB7XG4gICAgICAgICAgICAvL2NvbmNhdCBwcmV2aW91cyBsaW5lXG4gICAgICAgICAgICBsZXQgY2hlY2tTdGFydEluZGV4ID0gMDtcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLl9saW5lT2Zmc2V0WCA8PSB0aGlzLm1heFdpZHRoKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNoZWNrRW5kSW5kZXggPSB0aGlzLl9nZXRGaXJzdFdvcmRMZW4obGFiZWxTdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrU3RhcnRJbmRleCxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxTdHJpbmcubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBsZXQgY2hlY2tTdHJpbmcgPSBsYWJlbFN0cmluZy5zdWJzdHIoY2hlY2tTdGFydEluZGV4LCBjaGVja0VuZEluZGV4KTtcbiAgICAgICAgICAgICAgICBsZXQgY2hlY2tTdHJpbmdXaWR0aCA9IHRoaXMuX21lYXN1cmVUZXh0KHN0eWxlSW5kZXgsIGNoZWNrU3RyaW5nKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9saW5lT2Zmc2V0WCArIGNoZWNrU3RyaW5nV2lkdGggPD0gdGhpcy5tYXhXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9saW5lT2Zmc2V0WCArPSBjaGVja1N0cmluZ1dpZHRoO1xuICAgICAgICAgICAgICAgICAgICBjaGVja1N0YXJ0SW5kZXggKz0gY2hlY2tFbmRJbmRleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrU3RhcnRJbmRleCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZW1haW5pbmdTdHJpbmcgPSBsYWJlbFN0cmluZy5zdWJzdHIoMCwgY2hlY2tTdGFydEluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2FkZExhYmVsU2VnbWVudChyZW1haW5pbmdTdHJpbmcsIHN0eWxlSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxTdHJpbmcgPSBsYWJlbFN0cmluZy5zdWJzdHIoY2hlY2tTdGFydEluZGV4LCBsYWJlbFN0cmluZy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJhZ21lbnRXaWR0aCA9IHRoaXMuX21lYXN1cmVUZXh0KHN0eWxlSW5kZXgsIGxhYmVsU3RyaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVMaW5lSW5mbygpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZyYWdtZW50V2lkdGggPiB0aGlzLm1heFdpZHRoKSB7XG4gICAgICAgICAgICBsZXQgZnJhZ21lbnRzID0gdGV4dFV0aWxzLmZyYWdtZW50VGV4dChsYWJlbFN0cmluZyxcbiAgICAgICAgICAgICAgICBmcmFnbWVudFdpZHRoLFxuICAgICAgICAgICAgICAgIHRoaXMubWF4V2lkdGgsXG4gICAgICAgICAgICAgICAgdGhpcy5fbWVhc3VyZVRleHQoc3R5bGVJbmRleCkpO1xuICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBmcmFnbWVudHMubGVuZ3RoOyArK2spIHtcbiAgICAgICAgICAgICAgICBsZXQgc3BsaXRTdHJpbmcgPSBmcmFnbWVudHNba107XG4gICAgICAgICAgICAgICAgbGFiZWxTZWdtZW50ID0gdGhpcy5fYWRkTGFiZWxTZWdtZW50KHNwbGl0U3RyaW5nLCBzdHlsZUluZGV4KTtcbiAgICAgICAgICAgICAgICBsZXQgbGFiZWxTaXplID0gbGFiZWxTZWdtZW50LmdldENvbnRlbnRTaXplKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGluZU9mZnNldFggKz0gbGFiZWxTaXplLndpZHRoO1xuICAgICAgICAgICAgICAgIGlmIChmcmFnbWVudHMubGVuZ3RoID4gMSAmJiBrIDwgZnJhZ21lbnRzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlTGluZUluZm8oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9saW5lT2Zmc2V0WCArPSBmcmFnbWVudFdpZHRoO1xuICAgICAgICAgICAgdGhpcy5fYWRkTGFiZWxTZWdtZW50KGxhYmVsU3RyaW5nLCBzdHlsZUluZGV4KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfaXNMYXN0Q29tcG9uZW50Q1IgKHN0cmluZ1Rva2VuKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmdUb2tlbi5sZW5ndGggLSAxID09PSBzdHJpbmdUb2tlbi5sYXN0SW5kZXhPZihcIlxcblwiKTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZUxpbmVJbmZvICgpIHtcbiAgICAgICAgdGhpcy5fbGluZXNXaWR0aC5wdXNoKHRoaXMuX2xpbmVPZmZzZXRYKTtcbiAgICAgICAgdGhpcy5fbGluZU9mZnNldFggPSAwO1xuICAgICAgICB0aGlzLl9saW5lQ291bnQrKztcbiAgICB9LFxuXG4gICAgX25lZWRzVXBkYXRlVGV4dExheW91dCAobmV3VGV4dEFycmF5KSB7XG4gICAgICAgIGlmICh0aGlzLl9sYXlvdXREaXJ0eSB8fCAhdGhpcy5fdGV4dEFycmF5IHx8ICFuZXdUZXh0QXJyYXkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX3RleHRBcnJheS5sZW5ndGggIT09IG5ld1RleHRBcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl90ZXh0QXJyYXkubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGxldCBvbGRJdGVtID0gdGhpcy5fdGV4dEFycmF5W2ldO1xuICAgICAgICAgICAgbGV0IG5ld0l0ZW0gPSBuZXdUZXh0QXJyYXlbaV07XG4gICAgICAgICAgICBpZiAob2xkSXRlbS50ZXh0ICE9PSBuZXdJdGVtLnRleHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChvbGRJdGVtLnN0eWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdJdGVtLnN0eWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoISFuZXdJdGVtLnN0eWxlLm91dGxpbmUgIT09ICEhb2xkSXRlbS5zdHlsZS5vdXRsaW5lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob2xkSXRlbS5zdHlsZS5zaXplICE9PSBuZXdJdGVtLnN0eWxlLnNpemVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBvbGRJdGVtLnN0eWxlLml0YWxpYyAhPT0gbmV3SXRlbS5zdHlsZS5pdGFsaWNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBvbGRJdGVtLnN0eWxlLmlzSW1hZ2UgIT09IG5ld0l0ZW0uc3R5bGUuaXNJbWFnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9sZEl0ZW0uc3R5bGUuaXNJbWFnZSA9PT0gbmV3SXRlbS5zdHlsZS5pc0ltYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9sZEl0ZW0uc3R5bGUuc3JjICE9PSBuZXdJdGVtLnN0eWxlLnNyYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob2xkSXRlbS5zdHlsZS5zaXplIHx8IG9sZEl0ZW0uc3R5bGUuaXRhbGljIHx8IG9sZEl0ZW0uc3R5bGUuaXNJbWFnZSB8fCBvbGRJdGVtLnN0eWxlLm91dGxpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld0l0ZW0uc3R5bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXdJdGVtLnN0eWxlLnNpemUgfHwgbmV3SXRlbS5zdHlsZS5pdGFsaWMgfHwgbmV3SXRlbS5zdHlsZS5pc0ltYWdlIHx8IG5ld0l0ZW0uc3R5bGUub3V0bGluZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgX2FkZFJpY2hUZXh0SW1hZ2VFbGVtZW50IChyaWNoVGV4dEVsZW1lbnQpIHtcbiAgICAgICAgbGV0IHNwcml0ZUZyYW1lTmFtZSA9IHJpY2hUZXh0RWxlbWVudC5zdHlsZS5zcmM7XG4gICAgICAgIGxldCBzcHJpdGVGcmFtZSA9IHRoaXMuaW1hZ2VBdGxhcy5nZXRTcHJpdGVGcmFtZShzcHJpdGVGcmFtZU5hbWUpO1xuICAgICAgICBpZiAoc3ByaXRlRnJhbWUpIHtcbiAgICAgICAgICAgIGxldCBzcHJpdGVOb2RlID0gbmV3IGNjLlByaXZhdGVOb2RlKFJpY2hUZXh0Q2hpbGRJbWFnZU5hbWUpO1xuICAgICAgICAgICAgbGV0IHNwcml0ZUNvbXBvbmVudCA9IHNwcml0ZU5vZGUuYWRkQ29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgICAgICBzd2l0Y2ggKHJpY2hUZXh0RWxlbWVudC5zdHlsZS5pbWFnZUFsaWduKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3RvcCc6XG4gICAgICAgICAgICAgICAgICAgIHNwcml0ZU5vZGUuc2V0QW5jaG9yUG9pbnQoMCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2NlbnRlcic6XG4gICAgICAgICAgICAgICAgICAgIHNwcml0ZU5vZGUuc2V0QW5jaG9yUG9pbnQoMCwgMC41KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgc3ByaXRlTm9kZS5zZXRBbmNob3JQb2ludCgwLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmljaFRleHRFbGVtZW50LnN0eWxlLmltYWdlT2Zmc2V0KSBzcHJpdGVOb2RlLl9pbWFnZU9mZnNldCA9IHJpY2hUZXh0RWxlbWVudC5zdHlsZS5pbWFnZU9mZnNldDtcbiAgICAgICAgICAgIHNwcml0ZUNvbXBvbmVudC50eXBlID0gY2MuU3ByaXRlLlR5cGUuU0xJQ0VEO1xuICAgICAgICAgICAgc3ByaXRlQ29tcG9uZW50LnNpemVNb2RlID0gY2MuU3ByaXRlLlNpemVNb2RlLkNVU1RPTTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZChzcHJpdGVOb2RlKTtcbiAgICAgICAgICAgIHRoaXMuX2xhYmVsU2VnbWVudHMucHVzaChzcHJpdGVOb2RlKTtcblxuICAgICAgICAgICAgbGV0IHNwcml0ZVJlY3QgPSBzcHJpdGVGcmFtZS5nZXRSZWN0KCk7XG4gICAgICAgICAgICBsZXQgc2NhbGVGYWN0b3IgPSAxO1xuICAgICAgICAgICAgbGV0IHNwcml0ZVdpZHRoID0gc3ByaXRlUmVjdC53aWR0aDtcbiAgICAgICAgICAgIGxldCBzcHJpdGVIZWlnaHQgPSBzcHJpdGVSZWN0LmhlaWdodDtcbiAgICAgICAgICAgIGxldCBleHBlY3RXaWR0aCA9IHJpY2hUZXh0RWxlbWVudC5zdHlsZS5pbWFnZVdpZHRoO1xuICAgICAgICAgICAgbGV0IGV4cGVjdEhlaWdodCA9IHJpY2hUZXh0RWxlbWVudC5zdHlsZS5pbWFnZUhlaWdodDtcblxuICAgICAgICAgICAgaWYgKGV4cGVjdEhlaWdodCA+IDApIHtcbiAgICAgICAgICAgICAgICBzY2FsZUZhY3RvciA9IGV4cGVjdEhlaWdodCAvIHNwcml0ZUhlaWdodDtcbiAgICAgICAgICAgICAgICBzcHJpdGVXaWR0aCA9IHNwcml0ZVdpZHRoICogc2NhbGVGYWN0b3I7XG4gICAgICAgICAgICAgICAgc3ByaXRlSGVpZ2h0ID0gc3ByaXRlSGVpZ2h0ICogc2NhbGVGYWN0b3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzY2FsZUZhY3RvciA9IHRoaXMubGluZUhlaWdodCAvIHNwcml0ZUhlaWdodDtcbiAgICAgICAgICAgICAgICBzcHJpdGVXaWR0aCA9IHNwcml0ZVdpZHRoICogc2NhbGVGYWN0b3I7XG4gICAgICAgICAgICAgICAgc3ByaXRlSGVpZ2h0ID0gc3ByaXRlSGVpZ2h0ICogc2NhbGVGYWN0b3I7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChleHBlY3RXaWR0aCA+IDApIHNwcml0ZVdpZHRoID0gZXhwZWN0V2lkdGg7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm1heFdpZHRoID4gMCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9saW5lT2Zmc2V0WCArIHNwcml0ZVdpZHRoID4gdGhpcy5tYXhXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVMaW5lSW5mbygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9saW5lT2Zmc2V0WCArPSBzcHJpdGVXaWR0aDtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGluZU9mZnNldFggKz0gc3ByaXRlV2lkdGg7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2xpbmVPZmZzZXRYID4gdGhpcy5fbGFiZWxXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sYWJlbFdpZHRoID0gdGhpcy5fbGluZU9mZnNldFg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3ByaXRlQ29tcG9uZW50LnNwcml0ZUZyYW1lID0gc3ByaXRlRnJhbWU7XG4gICAgICAgICAgICBzcHJpdGVOb2RlLnNldENvbnRlbnRTaXplKHNwcml0ZVdpZHRoLCBzcHJpdGVIZWlnaHQpO1xuICAgICAgICAgICAgc3ByaXRlTm9kZS5fbGluZUNvdW50ID0gdGhpcy5fbGluZUNvdW50O1xuXG4gICAgICAgICAgICBpZiAocmljaFRleHRFbGVtZW50LnN0eWxlLmV2ZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKHJpY2hUZXh0RWxlbWVudC5zdHlsZS5ldmVudC5jbGljaykge1xuICAgICAgICAgICAgICAgICAgICBzcHJpdGVOb2RlLl9jbGlja0hhbmRsZXIgPSByaWNoVGV4dEVsZW1lbnQuc3R5bGUuZXZlbnQuY2xpY2s7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyaWNoVGV4dEVsZW1lbnQuc3R5bGUuZXZlbnQucGFyYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgc3ByaXRlTm9kZS5fY2xpY2tQYXJhbSA9IHJpY2hUZXh0RWxlbWVudC5zdHlsZS5ldmVudC5wYXJhbTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNwcml0ZU5vZGUuX2NsaWNrUGFyYW0gPSAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzcHJpdGVOb2RlLl9jbGlja0hhbmRsZXIgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2Mud2FybklEKDQ0MDApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91cGRhdGVSaWNoVGV4dCAoKSB7XG4gICAgICAgIGlmICghdGhpcy5lbmFibGVkKSByZXR1cm47XG5cbiAgICAgICAgbGV0IG5ld1RleHRBcnJheSA9IF9odG1sVGV4dFBhcnNlci5wYXJzZSh0aGlzLnN0cmluZyk7XG4gICAgICAgIGlmICghdGhpcy5fbmVlZHNVcGRhdGVUZXh0TGF5b3V0KG5ld1RleHRBcnJheSkpIHtcbiAgICAgICAgICAgIHRoaXMuX3RleHRBcnJheSA9IG5ld1RleHRBcnJheTtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUxhYmVsU2VnbWVudFRleHRBdHRyaWJ1dGVzKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl90ZXh0QXJyYXkgPSBuZXdUZXh0QXJyYXk7XG4gICAgICAgIHRoaXMuX3Jlc2V0U3RhdGUoKTtcblxuICAgICAgICBsZXQgbGFzdEVtcHR5TGluZSA9IGZhbHNlO1xuICAgICAgICBsZXQgbGFiZWw7XG4gICAgICAgIGxldCBsYWJlbFNpemU7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl90ZXh0QXJyYXkubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGxldCByaWNoVGV4dEVsZW1lbnQgPSB0aGlzLl90ZXh0QXJyYXlbaV07XG4gICAgICAgICAgICBsZXQgdGV4dCA9IHJpY2hUZXh0RWxlbWVudC50ZXh0O1xuICAgICAgICAgICAgLy9oYW5kbGUgPGJyLz4gPGltZyAvPiB0YWdcbiAgICAgICAgICAgIGlmICh0ZXh0ID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJpY2hUZXh0RWxlbWVudC5zdHlsZSAmJiByaWNoVGV4dEVsZW1lbnQuc3R5bGUubmV3bGluZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVMaW5lSW5mbygpO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJpY2hUZXh0RWxlbWVudC5zdHlsZSAmJiByaWNoVGV4dEVsZW1lbnQuc3R5bGUuaXNJbWFnZSAmJiB0aGlzLmltYWdlQXRsYXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWRkUmljaFRleHRJbWFnZUVsZW1lbnQocmljaFRleHRFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IG11bHRpbGluZVRleHRzID0gdGV4dC5zcGxpdChcIlxcblwiKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBtdWx0aWxpbmVUZXh0cy5sZW5ndGg7ICsraikge1xuICAgICAgICAgICAgICAgIGxldCBsYWJlbFN0cmluZyA9IG11bHRpbGluZVRleHRzW2pdO1xuICAgICAgICAgICAgICAgIGlmIChsYWJlbFN0cmluZyA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICAvL2ZvciBjb250aW51ZXMgXFxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pc0xhc3RDb21wb25lbnRDUih0ZXh0KVxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgaiA9PT0gbXVsdGlsaW5lVGV4dHMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlTGluZUluZm8oKTtcbiAgICAgICAgICAgICAgICAgICAgbGFzdEVtcHR5TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsYXN0RW1wdHlMaW5lID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tYXhXaWR0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxhYmVsV2lkdGggPSB0aGlzLl9tZWFzdXJlVGV4dChpLCBsYWJlbFN0cmluZyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVJpY2hUZXh0V2l0aE1heFdpZHRoKGxhYmVsU3RyaW5nLCBsYWJlbFdpZHRoLCBpKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAobXVsdGlsaW5lVGV4dHMubGVuZ3RoID4gMSAmJiBqIDwgbXVsdGlsaW5lVGV4dHMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlTGluZUluZm8oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWwgPSB0aGlzLl9hZGRMYWJlbFNlZ21lbnQobGFiZWxTdHJpbmcsIGkpO1xuICAgICAgICAgICAgICAgICAgICBsYWJlbFNpemUgPSBsYWJlbC5nZXRDb250ZW50U2l6ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xpbmVPZmZzZXRYICs9IGxhYmVsU2l6ZS53aWR0aDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2xpbmVPZmZzZXRYID4gdGhpcy5fbGFiZWxXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGFiZWxXaWR0aCA9IHRoaXMuX2xpbmVPZmZzZXRYO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG11bHRpbGluZVRleHRzLmxlbmd0aCA+IDEgJiYgaiA8IG11bHRpbGluZVRleHRzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUxpbmVJbmZvKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFsYXN0RW1wdHlMaW5lKSB7XG4gICAgICAgICAgICB0aGlzLl9saW5lc1dpZHRoLnB1c2godGhpcy5fbGluZU9mZnNldFgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubWF4V2lkdGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLl9sYWJlbFdpZHRoID0gdGhpcy5tYXhXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9sYWJlbEhlaWdodCA9ICh0aGlzLl9saW5lQ291bnQgKyB0ZXh0VXRpbHMuQkFTRUxJTkVfUkFUSU8pICogdGhpcy5saW5lSGVpZ2h0O1xuXG4gICAgICAgIC8vIHRyaWdnZXIgXCJzaXplLWNoYW5nZWRcIiBldmVudFxuICAgICAgICB0aGlzLm5vZGUuc2V0Q29udGVudFNpemUodGhpcy5fbGFiZWxXaWR0aCwgdGhpcy5fbGFiZWxIZWlnaHQpO1xuXG4gICAgICAgIHRoaXMuX3VwZGF0ZVJpY2hUZXh0UG9zaXRpb24oKTtcbiAgICAgICAgdGhpcy5fbGF5b3V0RGlydHkgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgX2dldEZpcnN0V29yZExlbiAodGV4dCwgc3RhcnRJbmRleCwgdGV4dExlbikge1xuICAgICAgICBsZXQgY2hhcmFjdGVyID0gdGV4dC5jaGFyQXQoc3RhcnRJbmRleCk7XG4gICAgICAgIGlmICh0ZXh0VXRpbHMuaXNVbmljb2RlQ0pLKGNoYXJhY3RlcilcbiAgICAgICAgICAgIHx8IHRleHRVdGlscy5pc1VuaWNvZGVTcGFjZShjaGFyYWN0ZXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBsZW4gPSAxO1xuICAgICAgICBmb3IgKGxldCBpbmRleCA9IHN0YXJ0SW5kZXggKyAxOyBpbmRleCA8IHRleHRMZW47ICsraW5kZXgpIHtcbiAgICAgICAgICAgIGNoYXJhY3RlciA9IHRleHQuY2hhckF0KGluZGV4KTtcbiAgICAgICAgICAgIGlmICh0ZXh0VXRpbHMuaXNVbmljb2RlU3BhY2UoY2hhcmFjdGVyKVxuICAgICAgICAgICAgICAgIHx8IHRleHRVdGlscy5pc1VuaWNvZGVDSksoY2hhcmFjdGVyKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGVuKys7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGVuO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlUmljaFRleHRQb3NpdGlvbiAoKSB7XG4gICAgICAgIGxldCBuZXh0VG9rZW5YID0gMDtcbiAgICAgICAgbGV0IG5leHRMaW5lSW5kZXggPSAxO1xuICAgICAgICBsZXQgdG90YWxMaW5lQ291bnQgPSB0aGlzLl9saW5lQ291bnQ7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbGFiZWxTZWdtZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgbGV0IGxhYmVsID0gdGhpcy5fbGFiZWxTZWdtZW50c1tpXTtcbiAgICAgICAgICAgIGxldCBsaW5lQ291bnQgPSBsYWJlbC5fbGluZUNvdW50O1xuICAgICAgICAgICAgaWYgKGxpbmVDb3VudCA+IG5leHRMaW5lSW5kZXgpIHtcbiAgICAgICAgICAgICAgICBuZXh0VG9rZW5YID0gMDtcbiAgICAgICAgICAgICAgICBuZXh0TGluZUluZGV4ID0gbGluZUNvdW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGxpbmVPZmZzZXRYID0gMDtcbiAgICAgICAgICAgIC8vIGxldCBub2RlQW5jaG9yWE9mZnNldCA9ICgwLjUgLSB0aGlzLm5vZGUuYW5jaG9yWCkgKiB0aGlzLl9sYWJlbFdpZHRoO1xuICAgICAgICAgICAgc3dpdGNoICh0aGlzLmhvcml6b250YWxBbGlnbikge1xuICAgICAgICAgICAgICAgIGNhc2UgSG9yaXpvbnRhbEFsaWduLkxFRlQ6XG4gICAgICAgICAgICAgICAgICAgIGxpbmVPZmZzZXRYID0gLSB0aGlzLl9sYWJlbFdpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBIb3Jpem9udGFsQWxpZ24uQ0VOVEVSOlxuICAgICAgICAgICAgICAgICAgICBsaW5lT2Zmc2V0WCA9IC0gdGhpcy5fbGluZXNXaWR0aFtsaW5lQ291bnQgLSAxXSAvIDI7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgSG9yaXpvbnRhbEFsaWduLlJJR0hUOlxuICAgICAgICAgICAgICAgICAgICBsaW5lT2Zmc2V0WCA9IHRoaXMuX2xhYmVsV2lkdGggLyAyIC0gdGhpcy5fbGluZXNXaWR0aFtsaW5lQ291bnQgLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsYWJlbC54ID0gbmV4dFRva2VuWCArIGxpbmVPZmZzZXRYO1xuXG4gICAgICAgICAgICBsZXQgbGFiZWxTaXplID0gbGFiZWwuZ2V0Q29udGVudFNpemUoKTtcblxuICAgICAgICAgICAgbGFiZWwueSA9IHRoaXMubGluZUhlaWdodCAqICh0b3RhbExpbmVDb3VudCAtIGxpbmVDb3VudCkgLSB0aGlzLl9sYWJlbEhlaWdodCAvIDI7XG5cbiAgICAgICAgICAgIGlmIChsaW5lQ291bnQgPT09IG5leHRMaW5lSW5kZXgpIHtcbiAgICAgICAgICAgICAgICBuZXh0VG9rZW5YICs9IGxhYmVsU2l6ZS53aWR0aDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHNwcml0ZSA9IGxhYmVsLmdldENvbXBvbmVudChjYy5TcHJpdGUpO1xuICAgICAgICAgICAgaWYgKHNwcml0ZSkge1xuICAgICAgICAgICAgICAgIC8vIGFkanVzdCBpbWcgYWxpZ24gKGZyb20gPGltZyBhbGlnbj10b3B8Y2VudGVyfGJvdHRvbT4pXG4gICAgICAgICAgICAgICAgbGV0IGxpbmVIZWlnaHRTZXQgPSB0aGlzLmxpbmVIZWlnaHQ7XG4gICAgICAgICAgICAgICAgbGV0IGxpbmVIZWlnaHRSZWFsID0gdGhpcy5saW5lSGVpZ2h0ICogKDEgKyB0ZXh0VXRpbHMuQkFTRUxJTkVfUkFUSU8pOyAvL3NpbmdsZSBsaW5lIG5vZGUgaGVpZ2h0XG4gICAgICAgICAgICAgICAgc3dpdGNoIChsYWJlbC5hbmNob3JZKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWwueSArPSAoIGxpbmVIZWlnaHRTZXQgKyAoICggbGluZUhlaWdodFJlYWwgLSBsaW5lSGVpZ2h0U2V0KSAvIDIgKSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMC41OlxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWwueSArPSAoIGxpbmVIZWlnaHRSZWFsIC8gMiApO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbC55ICs9ICggKGxpbmVIZWlnaHRSZWFsIC0gbGluZUhlaWdodFNldCkgLyAyICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gYWRqdXN0IGltZyBvZmZzZXQgKGZyb20gPGltZyBvZmZzZXQ9MTJ8MTIsMzQ+KVxuICAgICAgICAgICAgICAgIGlmIChsYWJlbC5faW1hZ2VPZmZzZXQpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0cyA9IGxhYmVsLl9pbWFnZU9mZnNldC5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAob2Zmc2V0cy5sZW5ndGggPT09IDEgJiYgb2Zmc2V0c1swXSlcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG9mZnNldFkgPSBwYXJzZUZsb2F0KG9mZnNldHNbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIob2Zmc2V0WSkpIGxhYmVsLnkgKz0gb2Zmc2V0WTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKG9mZnNldHMubGVuZ3RoID09PSAyKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0WCA9IHBhcnNlRmxvYXQob2Zmc2V0c1swXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0WSA9IHBhcnNlRmxvYXQob2Zmc2V0c1sxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihvZmZzZXRYKSkgbGFiZWwueCArPSBvZmZzZXRYO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIob2Zmc2V0WSkpIGxhYmVsLnkgKz0gb2Zmc2V0WTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9hZGp1c3QgeSBmb3IgbGFiZWwgd2l0aCBvdXRsaW5lXG4gICAgICAgICAgICBsZXQgb3V0bGluZSA9IGxhYmVsLmdldENvbXBvbmVudChjYy5MYWJlbE91dGxpbmUpO1xuICAgICAgICAgICAgaWYgKG91dGxpbmUgJiYgb3V0bGluZS53aWR0aCkgbGFiZWwueSA9IGxhYmVsLnkgLSBvdXRsaW5lLndpZHRoO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9jb252ZXJ0TGl0ZXJhbENvbG9yVmFsdWUgKGNvbG9yKSB7XG4gICAgICAgIGxldCBjb2xvclZhbHVlID0gY29sb3IudG9VcHBlckNhc2UoKTtcbiAgICAgICAgaWYgKGNjLkNvbG9yW2NvbG9yVmFsdWVdKSB7XG4gICAgICAgICAgICByZXR1cm4gY2MuQ29sb3JbY29sb3JWYWx1ZV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgb3V0ID0gY2MuY29sb3IoKTtcbiAgICAgICAgICAgIHJldHVybiBvdXQuZnJvbUhFWChjb2xvcik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gV2hlbiBzdHJpbmcgaXMgbnVsbCwgaXQgbWVhbnMgdGhhdCB0aGUgdGV4dCBkb2VzIG5vdCBuZWVkIHRvIGJlIHVwZGF0ZWQuIFxuICAgIF9hcHBseVRleHRBdHRyaWJ1dGUgKGxhYmVsTm9kZSwgc3RyaW5nLCBmb3JjZSkge1xuICAgICAgICBsZXQgbGFiZWxDb21wb25lbnQgPSBsYWJlbE5vZGUuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKTtcbiAgICAgICAgaWYgKCFsYWJlbENvbXBvbmVudCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGluZGV4ID0gbGFiZWxOb2RlLl9zdHlsZUluZGV4O1xuXG4gICAgICAgIGxldCB0ZXh0U3R5bGUgPSBudWxsO1xuICAgICAgICBpZiAodGhpcy5fdGV4dEFycmF5W2luZGV4XSkge1xuICAgICAgICAgICAgdGV4dFN0eWxlID0gdGhpcy5fdGV4dEFycmF5W2luZGV4XS5zdHlsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0ZXh0U3R5bGUgJiYgdGV4dFN0eWxlLmNvbG9yKSB7XG4gICAgICAgICAgICBsYWJlbE5vZGUuY29sb3IgPSB0aGlzLl9jb252ZXJ0TGl0ZXJhbENvbG9yVmFsdWUodGV4dFN0eWxlLmNvbG9yKTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgbGFiZWxOb2RlLmNvbG9yID0gdGhpcy5ub2RlLmNvbG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgbGFiZWxDb21wb25lbnQuY2FjaGVNb2RlID0gdGhpcy5jYWNoZU1vZGU7XG5cbiAgICAgICAgbGV0IGlzQXNzZXQgPSB0aGlzLmZvbnQgaW5zdGFuY2VvZiBjYy5Gb250O1xuICAgICAgICBpZiAoaXNBc3NldCAmJiAhdGhpcy5faXNTeXN0ZW1Gb250VXNlZCkge1xuICAgICAgICAgICAgbGFiZWxDb21wb25lbnQuZm9udCA9IHRoaXMuZm9udDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxhYmVsQ29tcG9uZW50LmZvbnRGYW1pbHkgPSB0aGlzLmZvbnRGYW1pbHk7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgbGFiZWxDb21wb25lbnQudXNlU3lzdGVtRm9udCA9IHRoaXMuX2lzU3lzdGVtRm9udFVzZWQ7XG4gICAgICAgIGxhYmVsQ29tcG9uZW50LmxpbmVIZWlnaHQgPSB0aGlzLmxpbmVIZWlnaHQ7XG4gICAgICAgIGxhYmVsQ29tcG9uZW50LmVuYWJsZUJvbGQgPSB0ZXh0U3R5bGUgJiYgdGV4dFN0eWxlLmJvbGQ7XG4gICAgICAgIGxhYmVsQ29tcG9uZW50LmVuYWJsZUl0YWxpY3MgPSB0ZXh0U3R5bGUgJiYgdGV4dFN0eWxlLml0YWxpYztcbiAgICAgICAgLy9UT0RPOiB0ZW1wb3JhcnkgaW1wbGVtZW50YXRpb24sIHRoZSBpdGFsaWMgZWZmZWN0IHNob3VsZCBiZSBpbXBsZW1lbnRlZCBpbiB0aGUgaW50ZXJuYWwgb2YgbGFiZWwtYXNzZW1ibGVyLlxuICAgICAgICBpZiAodGV4dFN0eWxlICYmIHRleHRTdHlsZS5pdGFsaWMpIHtcbiAgICAgICAgICAgIGxhYmVsTm9kZS5za2V3WCA9IDEyO1xuICAgICAgICB9XG5cbiAgICAgICAgbGFiZWxDb21wb25lbnQuZW5hYmxlVW5kZXJsaW5lID0gdGV4dFN0eWxlICYmIHRleHRTdHlsZS51bmRlcmxpbmU7XG5cbiAgICAgICAgaWYgKHRleHRTdHlsZSAmJiB0ZXh0U3R5bGUub3V0bGluZSkge1xuICAgICAgICAgICAgbGV0IGxhYmVsT3V0bGluZUNvbXBvbmVudCA9IGxhYmVsTm9kZS5nZXRDb21wb25lbnQoY2MuTGFiZWxPdXRsaW5lKTtcbiAgICAgICAgICAgIGlmICghbGFiZWxPdXRsaW5lQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgbGFiZWxPdXRsaW5lQ29tcG9uZW50ID0gbGFiZWxOb2RlLmFkZENvbXBvbmVudChjYy5MYWJlbE91dGxpbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGFiZWxPdXRsaW5lQ29tcG9uZW50LmNvbG9yID0gdGhpcy5fY29udmVydExpdGVyYWxDb2xvclZhbHVlKHRleHRTdHlsZS5vdXRsaW5lLmNvbG9yKTtcbiAgICAgICAgICAgIGxhYmVsT3V0bGluZUNvbXBvbmVudC53aWR0aCA9IHRleHRTdHlsZS5vdXRsaW5lLndpZHRoO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRleHRTdHlsZSAmJiB0ZXh0U3R5bGUuc2l6ZSkge1xuICAgICAgICAgICAgbGFiZWxDb21wb25lbnQuZm9udFNpemUgPSB0ZXh0U3R5bGUuc2l6ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxhYmVsQ29tcG9uZW50LmZvbnRTaXplID0gdGhpcy5mb250U2l6ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdHJpbmcgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHN0cmluZyA9ICcnICsgc3RyaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGFiZWxDb21wb25lbnQuc3RyaW5nID0gc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yY2UgJiYgbGFiZWxDb21wb25lbnQuX2ZvcmNlVXBkYXRlUmVuZGVyRGF0YSgpO1xuXG4gICAgICAgIGlmICh0ZXh0U3R5bGUgJiYgdGV4dFN0eWxlLmV2ZW50KSB7XG4gICAgICAgICAgICBpZiAodGV4dFN0eWxlLmV2ZW50LmNsaWNrKSB7XG4gICAgICAgICAgICAgICAgbGFiZWxOb2RlLl9jbGlja0hhbmRsZXIgPSB0ZXh0U3R5bGUuZXZlbnQuY2xpY2s7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGV4dFN0eWxlLmV2ZW50LnBhcmFtKSB7XG4gICAgICAgICAgICAgICAgbGFiZWxOb2RlLl9jbGlja1BhcmFtID0gdGV4dFN0eWxlLmV2ZW50LnBhcmFtO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbGFiZWxOb2RlLl9jbGlja1BhcmFtID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsYWJlbE5vZGUuX2NsaWNrSGFuZGxlciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25EZXN0cm95ICgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9sYWJlbFNlZ21lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICB0aGlzLl9sYWJlbFNlZ21lbnRzW2ldLnJlbW92ZUZyb21QYXJlbnQoKTtcbiAgICAgICAgICAgIHBvb2wucHV0KHRoaXMuX2xhYmVsU2VnbWVudHNbaV0pO1xuICAgICAgICB9XG4gICAgfSxcbn0pO1xuXG5jYy5SaWNoVGV4dCA9IG1vZHVsZS5leHBvcnRzID0gUmljaFRleHQ7XG4iXX0=