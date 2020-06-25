
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/utils/label/ttf.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _assembler2d = _interopRequireDefault(require("../../assembler-2d"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var textUtils = require('../../../utils/text-utils');

var macro = require('../../../platform/CCMacro');

var Label = require('../../../components/CCLabel');

var LabelOutline = require('../../../components/CCLabelOutline');

var LabelShadow = require('../../../components/CCLabelShadow');

var Overflow = Label.Overflow;

var deleteFromDynamicAtlas = require('../utils').deleteFromDynamicAtlas;

var getFontFamily = require('../utils').getFontFamily;

var MAX_SIZE = 2048;

var _invisibleAlpha = (1 / 255).toFixed(3);

var _context = null;
var _canvas = null;
var _texture = null;
var _fontDesc = '';
var _string = '';
var _fontSize = 0;
var _drawFontSize = 0;
var _splitedStrings = [];
var _canvasSize = cc.Size.ZERO;
var _lineHeight = 0;
var _hAlign = 0;
var _vAlign = 0;
var _color = null;
var _fontFamily = '';
var _overflow = Overflow.NONE;
var _isWrapText = false; // outline

var _outlineComp = null;
var _outlineColor = cc.Color.WHITE; // shadow

var _shadowComp = null;
var _shadowColor = cc.Color.BLACK;

var _canvasPadding = cc.rect();

var _contentSizeExtend = cc.Size.ZERO;
var _nodeContentSize = cc.Size.ZERO;
var _enableBold = false;
var _enableItalic = false;
var _enableUnderline = false;
var _underlineThickness = 0;
var _drawUnderlinePos = cc.Vec2.ZERO;
var _drawUnderlineWidth = 0;

var _sharedLabelData;

var TTFAssembler =
/*#__PURE__*/
function (_Assembler2D) {
  _inheritsLoose(TTFAssembler, _Assembler2D);

  function TTFAssembler() {
    return _Assembler2D.apply(this, arguments) || this;
  }

  var _proto = TTFAssembler.prototype;

  _proto._getAssemblerData = function _getAssemblerData() {
    _sharedLabelData = Label._canvasPool.get();
    _sharedLabelData.canvas.width = _sharedLabelData.canvas.height = 1;
    return _sharedLabelData;
  };

  _proto._resetAssemblerData = function _resetAssemblerData(assemblerData) {
    if (assemblerData) {
      Label._canvasPool.put(assemblerData);
    }
  };

  _proto.updateRenderData = function updateRenderData(comp) {
    _Assembler2D.prototype.updateRenderData.call(this, comp);

    if (!comp._vertsDirty) return;

    this._updateFontFamily(comp);

    this._updateProperties(comp);

    this._calculateLabelFont();

    this._calculateSplitedStrings();

    this._updateLabelDimensions();

    this._calculateTextBaseline();

    this._updateTexture(comp);

    this._calDynamicAtlas(comp);

    comp._actualFontSize = _fontSize;
    comp.node.setContentSize(_nodeContentSize);
    this.updateVerts(comp);
    comp._vertsDirty = false;
    _context = null;
    _canvas = null;
    _texture = null;
  };

  _proto.updateVerts = function updateVerts() {};

  _proto._updatePaddingRect = function _updatePaddingRect() {
    var top = 0,
        bottom = 0,
        left = 0,
        right = 0;
    var outlineWidth = 0;
    _contentSizeExtend.width = _contentSizeExtend.height = 0;

    if (_outlineComp) {
      outlineWidth = _outlineComp.width;
      top = bottom = left = right = outlineWidth;
      _contentSizeExtend.width = _contentSizeExtend.height = outlineWidth * 2;
    }

    if (_shadowComp) {
      var shadowWidth = _shadowComp.blur + outlineWidth;
      left = Math.max(left, -_shadowComp._offset.x + shadowWidth);
      right = Math.max(right, _shadowComp._offset.x + shadowWidth);
      top = Math.max(top, _shadowComp._offset.y + shadowWidth);
      bottom = Math.max(bottom, -_shadowComp._offset.y + shadowWidth);
    }

    if (_enableItalic) {
      //0.0174532925 = 3.141592653 / 180
      var offset = _drawFontSize * Math.tan(12 * 0.0174532925);

      right += offset;
      _contentSizeExtend.width += offset;
    }

    _canvasPadding.x = left;
    _canvasPadding.y = top;
    _canvasPadding.width = left + right;
    _canvasPadding.height = top + bottom;
  };

  _proto._updateFontFamily = function _updateFontFamily(comp) {
    _fontFamily = getFontFamily(comp);
  };

  _proto._updateProperties = function _updateProperties(comp) {
    var assemblerData = comp._assemblerData;
    _context = assemblerData.context;
    _canvas = assemblerData.canvas;
    _texture = comp._frame._original ? comp._frame._original._texture : comp._frame._texture;
    _string = comp.string.toString();
    _fontSize = comp._fontSize;
    _drawFontSize = _fontSize;
    _underlineThickness = comp.underlineHeight || _drawFontSize / 8;
    _overflow = comp.overflow;
    _canvasSize.width = comp.node.width;
    _canvasSize.height = comp.node.height;
    _nodeContentSize = comp.node.getContentSize();
    _lineHeight = comp._lineHeight;
    _hAlign = comp.horizontalAlign;
    _vAlign = comp.verticalAlign;
    _color = comp.node.color;
    _enableBold = comp.enableBold;
    _enableItalic = comp.enableItalic;
    _enableUnderline = comp.enableUnderline;

    if (_overflow === Overflow.NONE) {
      _isWrapText = false;
    } else if (_overflow === Overflow.RESIZE_HEIGHT) {
      _isWrapText = true;
    } else {
      _isWrapText = comp.enableWrapText;
    } // outline


    _outlineComp = LabelOutline && comp.getComponent(LabelOutline);
    _outlineComp = _outlineComp && _outlineComp.enabled && _outlineComp.width > 0 ? _outlineComp : null;

    if (_outlineComp) {
      _outlineColor.set(_outlineComp.color);
    } // shadow


    _shadowComp = LabelShadow && comp.getComponent(LabelShadow);
    _shadowComp = _shadowComp && _shadowComp.enabled ? _shadowComp : null;

    if (_shadowComp) {
      _shadowColor.set(_shadowComp.color); // TODO: temporary solution, cascade opacity for outline color


      _shadowColor.a = _shadowColor.a * comp.node.color.a / 255.0;
    }

    this._updatePaddingRect();
  };

  _proto._calculateFillTextStartPosition = function _calculateFillTextStartPosition() {
    var labelX = 0;

    if (_hAlign === macro.TextAlignment.RIGHT) {
      labelX = _canvasSize.width - _canvasPadding.width;
    } else if (_hAlign === macro.TextAlignment.CENTER) {
      labelX = (_canvasSize.width - _canvasPadding.width) / 2;
    }

    var lineHeight = this._getLineHeight();

    var drawStartY = lineHeight * (_splitedStrings.length - 1); // TOP

    var firstLinelabelY = _fontSize * (1 - textUtils.BASELINE_RATIO / 2);

    if (_vAlign !== macro.VerticalTextAlignment.TOP) {
      // free space in vertical direction
      var blank = drawStartY + _canvasPadding.height + _fontSize - _canvasSize.height;

      if (_vAlign === macro.VerticalTextAlignment.BOTTOM) {
        // Unlike BMFont, needs to reserve space below.
        blank += textUtils.BASELINE_RATIO / 2 * _fontSize; // BOTTOM

        firstLinelabelY -= blank;
      } else {
        // CENTER
        firstLinelabelY -= blank / 2;
      }
    }

    return cc.v2(labelX + _canvasPadding.x, firstLinelabelY + _canvasPadding.y);
  };

  _proto._setupOutline = function _setupOutline() {
    _context.strokeStyle = "rgba(" + _outlineColor.r + ", " + _outlineColor.g + ", " + _outlineColor.b + ", " + _outlineColor.a / 255 + ")";
    _context.lineWidth = _outlineComp.width * 2;
  };

  _proto._setupShadow = function _setupShadow() {
    _context.shadowColor = "rgba(" + _shadowColor.r + ", " + _shadowColor.g + ", " + _shadowColor.b + ", " + _shadowColor.a / 255 + ")";
    _context.shadowBlur = _shadowComp.blur;
    _context.shadowOffsetX = _shadowComp.offset.x;
    _context.shadowOffsetY = -_shadowComp.offset.y;
  };

  _proto._drawUnderline = function _drawUnderline(underlinewidth) {
    if (_outlineComp) {
      this._setupOutline();

      _context.strokeRect(_drawUnderlinePos.x, _drawUnderlinePos.y, underlinewidth, _underlineThickness);
    }

    _context.lineWidth = _underlineThickness;
    _context.fillStyle = "rgba(" + _color.r + ", " + _color.g + ", " + _color.b + ", " + _color.a / 255 + ")";

    _context.fillRect(_drawUnderlinePos.x, _drawUnderlinePos.y, underlinewidth, _underlineThickness);
  };

  _proto._updateTexture = function _updateTexture() {
    _context.clearRect(0, 0, _canvas.width, _canvas.height); //Add a white background to avoid black edges.
    //TODO: it is best to add alphaTest to filter out the background color.


    var _fillColor = _outlineComp ? _outlineColor : _color;

    _context.fillStyle = "rgba(" + _fillColor.r + ", " + _fillColor.g + ", " + _fillColor.b + ", " + _invisibleAlpha + ")";

    _context.fillRect(0, 0, _canvas.width, _canvas.height);

    _context.font = _fontDesc;

    var startPosition = this._calculateFillTextStartPosition();

    var lineHeight = this._getLineHeight(); //use round for line join to avoid sharp intersect point


    _context.lineJoin = 'round';
    _context.fillStyle = "rgba(" + _color.r + ", " + _color.g + ", " + _color.b + ", 1)";
    var isMultiple = _splitedStrings.length > 1; //do real rendering

    var measureText = this._measureText(_context, _fontDesc);

    var drawTextPosX = 0,
        drawTextPosY = 0; // only one set shadow and outline

    if (_shadowComp) {
      this._setupShadow();
    }

    if (_outlineComp && _outlineComp.width > 0) {
      this._setupOutline();
    } // draw shadow and (outline or text)


    for (var i = 0; i < _splitedStrings.length; ++i) {
      drawTextPosX = startPosition.x;
      drawTextPosY = startPosition.y + i * lineHeight;

      if (_shadowComp) {
        // multiple lines need to be drawn outline and fill text
        if (isMultiple) {
          if (_outlineComp && _outlineComp.width > 0) {
            _context.strokeText(_splitedStrings[i], drawTextPosX, drawTextPosY);
          }

          _context.fillText(_splitedStrings[i], drawTextPosX, drawTextPosY);
        }
      } // draw underline


      if (_enableUnderline) {
        _drawUnderlineWidth = measureText(_splitedStrings[i]);

        if (_hAlign === macro.TextAlignment.RIGHT) {
          _drawUnderlinePos.x = startPosition.x - _drawUnderlineWidth;
        } else if (_hAlign === macro.TextAlignment.CENTER) {
          _drawUnderlinePos.x = startPosition.x - _drawUnderlineWidth / 2;
        } else {
          _drawUnderlinePos.x = startPosition.x;
        }

        _drawUnderlinePos.y = drawTextPosY + _drawFontSize / 8;

        this._drawUnderline(_drawUnderlineWidth);
      }
    }

    if (_shadowComp && isMultiple) {
      _context.shadowColor = 'transparent';
    } // draw text and outline


    for (var _i = 0; _i < _splitedStrings.length; ++_i) {
      drawTextPosX = startPosition.x;
      drawTextPosY = startPosition.y + _i * lineHeight;

      if (_outlineComp && _outlineComp.width > 0) {
        _context.strokeText(_splitedStrings[_i], drawTextPosX, drawTextPosY);
      }

      _context.fillText(_splitedStrings[_i], drawTextPosX, drawTextPosY);
    }

    if (_shadowComp) {
      _context.shadowColor = 'transparent';
    }

    _texture.handleLoadedTexture();
  };

  _proto._calDynamicAtlas = function _calDynamicAtlas(comp) {
    if (comp.cacheMode !== Label.CacheMode.BITMAP) return;
    var frame = comp._frame; // Delete cache in atlas.

    deleteFromDynamicAtlas(comp, frame);

    if (!frame._original) {
      frame.setRect(cc.rect(0, 0, _canvas.width, _canvas.height));
    }

    this.packToDynamicAtlas(comp, frame);
  };

  _proto._updateLabelDimensions = function _updateLabelDimensions() {
    var paragraphedStrings = _string.split('\n');

    if (_overflow === Overflow.RESIZE_HEIGHT) {
      var rawHeight = (_splitedStrings.length + textUtils.BASELINE_RATIO) * this._getLineHeight();

      _canvasSize.height = rawHeight + _canvasPadding.height; // set node height

      _nodeContentSize.height = rawHeight + _contentSizeExtend.height;
    } else if (_overflow === Overflow.NONE) {
      _splitedStrings = paragraphedStrings;
      var canvasSizeX = 0;
      var canvasSizeY = 0;

      for (var i = 0; i < paragraphedStrings.length; ++i) {
        var paraLength = textUtils.safeMeasureText(_context, paragraphedStrings[i], _fontDesc);
        canvasSizeX = canvasSizeX > paraLength ? canvasSizeX : paraLength;
      }

      canvasSizeY = (_splitedStrings.length + textUtils.BASELINE_RATIO) * this._getLineHeight();
      var rawWidth = parseFloat(canvasSizeX.toFixed(2));

      var _rawHeight = parseFloat(canvasSizeY.toFixed(2));

      _canvasSize.width = rawWidth + _canvasPadding.width;
      _canvasSize.height = _rawHeight + _canvasPadding.height;
      _nodeContentSize.width = rawWidth + _contentSizeExtend.width;
      _nodeContentSize.height = _rawHeight + _contentSizeExtend.height;
    }

    _canvasSize.width = Math.min(_canvasSize.width, MAX_SIZE);
    _canvasSize.height = Math.min(_canvasSize.height, MAX_SIZE);

    if (_canvas.width !== _canvasSize.width) {
      _canvas.width = _canvasSize.width;
    }

    if (_canvas.height !== _canvasSize.height) {
      _canvas.height = _canvasSize.height;
    }
  };

  _proto._calculateTextBaseline = function _calculateTextBaseline() {
    var hAlign;

    if (_hAlign === macro.TextAlignment.RIGHT) {
      hAlign = 'right';
    } else if (_hAlign === macro.TextAlignment.CENTER) {
      hAlign = 'center';
    } else {
      hAlign = 'left';
    }

    _context.textAlign = hAlign;
    _context.textBaseline = 'alphabetic';
  };

  _proto._calculateSplitedStrings = function _calculateSplitedStrings() {
    var paragraphedStrings = _string.split('\n');

    if (_isWrapText) {
      _splitedStrings = [];
      var canvasWidthNoMargin = _nodeContentSize.width;

      for (var i = 0; i < paragraphedStrings.length; ++i) {
        var allWidth = textUtils.safeMeasureText(_context, paragraphedStrings[i], _fontDesc);
        var textFragment = textUtils.fragmentText(paragraphedStrings[i], allWidth, canvasWidthNoMargin, this._measureText(_context, _fontDesc));
        _splitedStrings = _splitedStrings.concat(textFragment);
      }
    } else {
      _splitedStrings = paragraphedStrings;
    }
  };

  _proto._getFontDesc = function _getFontDesc() {
    var fontDesc = _fontSize.toString() + 'px ';
    fontDesc = fontDesc + _fontFamily;

    if (_enableBold) {
      fontDesc = "bold " + fontDesc;
    }

    if (_enableItalic) {
      fontDesc = "italic " + fontDesc;
    }

    return fontDesc;
  };

  _proto._getLineHeight = function _getLineHeight() {
    var nodeSpacingY = _lineHeight;

    if (nodeSpacingY === 0) {
      nodeSpacingY = _fontSize;
    } else {
      nodeSpacingY = nodeSpacingY * _fontSize / _drawFontSize;
    }

    return nodeSpacingY | 0;
  };

  _proto._calculateParagraphLength = function _calculateParagraphLength(paragraphedStrings, ctx) {
    var paragraphLength = [];

    for (var i = 0; i < paragraphedStrings.length; ++i) {
      var width = textUtils.safeMeasureText(ctx, paragraphedStrings[i], _fontDesc);
      paragraphLength.push(width);
    }

    return paragraphLength;
  };

  _proto._measureText = function _measureText(ctx, fontDesc) {
    return function (string) {
      return textUtils.safeMeasureText(ctx, string, fontDesc);
    };
  };

  _proto._calculateLabelFont = function _calculateLabelFont() {
    _fontDesc = this._getFontDesc();
    _context.font = _fontDesc;

    if (_overflow === Overflow.SHRINK) {
      var paragraphedStrings = _string.split('\n');

      var paragraphLength = this._calculateParagraphLength(paragraphedStrings, _context);

      var i = 0;
      var totalHeight = 0;
      var maxLength = 0;

      if (_isWrapText) {
        var canvasWidthNoMargin = _nodeContentSize.width;
        var canvasHeightNoMargin = _nodeContentSize.height;

        if (canvasWidthNoMargin < 0 || canvasHeightNoMargin < 0) {
          _fontDesc = this._getFontDesc();
          _context.font = _fontDesc;
          return;
        }

        totalHeight = canvasHeightNoMargin + 1;
        maxLength = canvasWidthNoMargin + 1;
        var actualFontSize = _fontSize + 1;
        var textFragment = ""; //let startShrinkFontSize = actualFontSize | 0;

        var left = 0,
            right = actualFontSize | 0,
            mid = 0;

        while (left < right) {
          mid = left + right + 1 >> 1;

          if (mid <= 0) {
            cc.logID(4003);
            break;
          }

          _fontSize = mid;
          _fontDesc = this._getFontDesc();
          _context.font = _fontDesc;
          totalHeight = 0;

          for (i = 0; i < paragraphedStrings.length; ++i) {
            var j = 0;
            var allWidth = textUtils.safeMeasureText(_context, paragraphedStrings[i], _fontDesc);
            textFragment = textUtils.fragmentText(paragraphedStrings[i], allWidth, canvasWidthNoMargin, this._measureText(_context, _fontDesc));

            while (j < textFragment.length) {
              maxLength = textUtils.safeMeasureText(_context, textFragment[j], _fontDesc);
              totalHeight += this._getLineHeight();
              ++j;
            }
          }

          if (totalHeight > canvasHeightNoMargin) {
            right = mid - 1;
          } else {
            left = mid;
          }
        }

        if (left === 0) {
          cc.logID(4003);
        } else {
          _fontSize = left;
          _fontDesc = this._getFontDesc();
          _context.font = _fontDesc;
        }
      } else {
        totalHeight = paragraphedStrings.length * this._getLineHeight();

        for (i = 0; i < paragraphedStrings.length; ++i) {
          if (maxLength < paragraphLength[i]) {
            maxLength = paragraphLength[i];
          }
        }

        var scaleX = (_canvasSize.width - _canvasPadding.width) / maxLength;
        var scaleY = _canvasSize.height / totalHeight;
        _fontSize = _drawFontSize * Math.min(1, scaleX, scaleY) | 0;
        _fontDesc = this._getFontDesc();
        _context.font = _fontDesc;
      }
    }
  };

  return TTFAssembler;
}(_assembler2d["default"]);

exports["default"] = TTFAssembler;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInR0Zi5qcyJdLCJuYW1lcyI6WyJ0ZXh0VXRpbHMiLCJyZXF1aXJlIiwibWFjcm8iLCJMYWJlbCIsIkxhYmVsT3V0bGluZSIsIkxhYmVsU2hhZG93IiwiT3ZlcmZsb3ciLCJkZWxldGVGcm9tRHluYW1pY0F0bGFzIiwiZ2V0Rm9udEZhbWlseSIsIk1BWF9TSVpFIiwiX2ludmlzaWJsZUFscGhhIiwidG9GaXhlZCIsIl9jb250ZXh0IiwiX2NhbnZhcyIsIl90ZXh0dXJlIiwiX2ZvbnREZXNjIiwiX3N0cmluZyIsIl9mb250U2l6ZSIsIl9kcmF3Rm9udFNpemUiLCJfc3BsaXRlZFN0cmluZ3MiLCJfY2FudmFzU2l6ZSIsImNjIiwiU2l6ZSIsIlpFUk8iLCJfbGluZUhlaWdodCIsIl9oQWxpZ24iLCJfdkFsaWduIiwiX2NvbG9yIiwiX2ZvbnRGYW1pbHkiLCJfb3ZlcmZsb3ciLCJOT05FIiwiX2lzV3JhcFRleHQiLCJfb3V0bGluZUNvbXAiLCJfb3V0bGluZUNvbG9yIiwiQ29sb3IiLCJXSElURSIsIl9zaGFkb3dDb21wIiwiX3NoYWRvd0NvbG9yIiwiQkxBQ0siLCJfY2FudmFzUGFkZGluZyIsInJlY3QiLCJfY29udGVudFNpemVFeHRlbmQiLCJfbm9kZUNvbnRlbnRTaXplIiwiX2VuYWJsZUJvbGQiLCJfZW5hYmxlSXRhbGljIiwiX2VuYWJsZVVuZGVybGluZSIsIl91bmRlcmxpbmVUaGlja25lc3MiLCJfZHJhd1VuZGVybGluZVBvcyIsIlZlYzIiLCJfZHJhd1VuZGVybGluZVdpZHRoIiwiX3NoYXJlZExhYmVsRGF0YSIsIlRURkFzc2VtYmxlciIsIl9nZXRBc3NlbWJsZXJEYXRhIiwiX2NhbnZhc1Bvb2wiLCJnZXQiLCJjYW52YXMiLCJ3aWR0aCIsImhlaWdodCIsIl9yZXNldEFzc2VtYmxlckRhdGEiLCJhc3NlbWJsZXJEYXRhIiwicHV0IiwidXBkYXRlUmVuZGVyRGF0YSIsImNvbXAiLCJfdmVydHNEaXJ0eSIsIl91cGRhdGVGb250RmFtaWx5IiwiX3VwZGF0ZVByb3BlcnRpZXMiLCJfY2FsY3VsYXRlTGFiZWxGb250IiwiX2NhbGN1bGF0ZVNwbGl0ZWRTdHJpbmdzIiwiX3VwZGF0ZUxhYmVsRGltZW5zaW9ucyIsIl9jYWxjdWxhdGVUZXh0QmFzZWxpbmUiLCJfdXBkYXRlVGV4dHVyZSIsIl9jYWxEeW5hbWljQXRsYXMiLCJfYWN0dWFsRm9udFNpemUiLCJub2RlIiwic2V0Q29udGVudFNpemUiLCJ1cGRhdGVWZXJ0cyIsIl91cGRhdGVQYWRkaW5nUmVjdCIsInRvcCIsImJvdHRvbSIsImxlZnQiLCJyaWdodCIsIm91dGxpbmVXaWR0aCIsInNoYWRvd1dpZHRoIiwiYmx1ciIsIk1hdGgiLCJtYXgiLCJfb2Zmc2V0IiwieCIsInkiLCJvZmZzZXQiLCJ0YW4iLCJfYXNzZW1ibGVyRGF0YSIsImNvbnRleHQiLCJfZnJhbWUiLCJfb3JpZ2luYWwiLCJzdHJpbmciLCJ0b1N0cmluZyIsInVuZGVybGluZUhlaWdodCIsIm92ZXJmbG93IiwiZ2V0Q29udGVudFNpemUiLCJob3Jpem9udGFsQWxpZ24iLCJ2ZXJ0aWNhbEFsaWduIiwiY29sb3IiLCJlbmFibGVCb2xkIiwiZW5hYmxlSXRhbGljIiwiZW5hYmxlVW5kZXJsaW5lIiwiUkVTSVpFX0hFSUdIVCIsImVuYWJsZVdyYXBUZXh0IiwiZ2V0Q29tcG9uZW50IiwiZW5hYmxlZCIsInNldCIsImEiLCJfY2FsY3VsYXRlRmlsbFRleHRTdGFydFBvc2l0aW9uIiwibGFiZWxYIiwiVGV4dEFsaWdubWVudCIsIlJJR0hUIiwiQ0VOVEVSIiwibGluZUhlaWdodCIsIl9nZXRMaW5lSGVpZ2h0IiwiZHJhd1N0YXJ0WSIsImxlbmd0aCIsImZpcnN0TGluZWxhYmVsWSIsIkJBU0VMSU5FX1JBVElPIiwiVmVydGljYWxUZXh0QWxpZ25tZW50IiwiVE9QIiwiYmxhbmsiLCJCT1RUT00iLCJ2MiIsIl9zZXR1cE91dGxpbmUiLCJzdHJva2VTdHlsZSIsInIiLCJnIiwiYiIsImxpbmVXaWR0aCIsIl9zZXR1cFNoYWRvdyIsInNoYWRvd0NvbG9yIiwic2hhZG93Qmx1ciIsInNoYWRvd09mZnNldFgiLCJzaGFkb3dPZmZzZXRZIiwiX2RyYXdVbmRlcmxpbmUiLCJ1bmRlcmxpbmV3aWR0aCIsInN0cm9rZVJlY3QiLCJmaWxsU3R5bGUiLCJmaWxsUmVjdCIsImNsZWFyUmVjdCIsIl9maWxsQ29sb3IiLCJmb250Iiwic3RhcnRQb3NpdGlvbiIsImxpbmVKb2luIiwiaXNNdWx0aXBsZSIsIm1lYXN1cmVUZXh0IiwiX21lYXN1cmVUZXh0IiwiZHJhd1RleHRQb3NYIiwiZHJhd1RleHRQb3NZIiwiaSIsInN0cm9rZVRleHQiLCJmaWxsVGV4dCIsImhhbmRsZUxvYWRlZFRleHR1cmUiLCJjYWNoZU1vZGUiLCJDYWNoZU1vZGUiLCJCSVRNQVAiLCJmcmFtZSIsInNldFJlY3QiLCJwYWNrVG9EeW5hbWljQXRsYXMiLCJwYXJhZ3JhcGhlZFN0cmluZ3MiLCJzcGxpdCIsInJhd0hlaWdodCIsImNhbnZhc1NpemVYIiwiY2FudmFzU2l6ZVkiLCJwYXJhTGVuZ3RoIiwic2FmZU1lYXN1cmVUZXh0IiwicmF3V2lkdGgiLCJwYXJzZUZsb2F0IiwibWluIiwiaEFsaWduIiwidGV4dEFsaWduIiwidGV4dEJhc2VsaW5lIiwiY2FudmFzV2lkdGhOb01hcmdpbiIsImFsbFdpZHRoIiwidGV4dEZyYWdtZW50IiwiZnJhZ21lbnRUZXh0IiwiY29uY2F0IiwiX2dldEZvbnREZXNjIiwiZm9udERlc2MiLCJub2RlU3BhY2luZ1kiLCJfY2FsY3VsYXRlUGFyYWdyYXBoTGVuZ3RoIiwiY3R4IiwicGFyYWdyYXBoTGVuZ3RoIiwicHVzaCIsIlNIUklOSyIsInRvdGFsSGVpZ2h0IiwibWF4TGVuZ3RoIiwiY2FudmFzSGVpZ2h0Tm9NYXJnaW4iLCJhY3R1YWxGb250U2l6ZSIsIm1pZCIsImxvZ0lEIiwiaiIsInNjYWxlWCIsInNjYWxlWSIsIkFzc2VtYmxlcjJEIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBOzs7Ozs7QUFFQSxJQUFJQSxTQUFTLEdBQUdD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SyxVQUFBQSxRQUFRLENBQUNzSSxJQUFULEdBQWdCbkksU0FBaEI7QUFDSDtBQUNKLE9BeERELE1BeURLO0FBQ0QrSyxRQUFBQSxXQUFXLEdBQUcxQixrQkFBa0IsQ0FBQzVDLE1BQW5CLEdBQTRCLEtBQUtGLGNBQUwsRUFBMUM7O0FBRUEsYUFBS29DLENBQUMsR0FBRyxDQUFULEVBQVlBLENBQUMsR0FBR1Usa0JBQWtCLENBQUM1QyxNQUFuQyxFQUEyQyxFQUFFa0MsQ0FBN0MsRUFBZ0Q7QUFDNUMsY0FBSXFDLFNBQVMsR0FBR0osZUFBZSxDQUFDakMsQ0FBRCxDQUEvQixFQUFvQztBQUNoQ3FDLFlBQUFBLFNBQVMsR0FBR0osZUFBZSxDQUFDakMsQ0FBRCxDQUEzQjtBQUNIO0FBQ0o7O0FBQ0QsWUFBSTJDLE1BQU0sR0FBRyxDQUFDakwsV0FBVyxDQUFDb0MsS0FBWixHQUFvQmpCLGNBQWMsQ0FBQ2lCLEtBQXBDLElBQTZDdUksU0FBMUQ7QUFDQSxZQUFJTyxNQUFNLEdBQUdsTCxXQUFXLENBQUNxQyxNQUFaLEdBQXFCcUksV0FBbEM7QUFFQTdLLFFBQUFBLFNBQVMsR0FBSUMsYUFBYSxHQUFHa0UsSUFBSSxDQUFDeUYsR0FBTCxDQUFTLENBQVQsRUFBWXdCLE1BQVosRUFBb0JDLE1BQXBCLENBQWpCLEdBQWdELENBQTVEO0FBQ0F2TCxRQUFBQSxTQUFTLEdBQUcsS0FBS3VLLFlBQUwsRUFBWjtBQUNBMUssUUFBQUEsUUFBUSxDQUFDc0ksSUFBVCxHQUFnQm5JLFNBQWhCO0FBQ0g7QUFDSjtBQUNKOzs7RUFwZHFDd0wiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgQXNzZW1ibGVyMkQgZnJvbSAnLi4vLi4vYXNzZW1ibGVyLTJkJztcblxubGV0IHRleHRVdGlscyA9IHJlcXVpcmUoJy4uLy4uLy4uL3V0aWxzL3RleHQtdXRpbHMnKTtcbmNvbnN0IG1hY3JvID0gcmVxdWlyZSgnLi4vLi4vLi4vcGxhdGZvcm0vQ0NNYWNybycpO1xuY29uc3QgTGFiZWwgPSByZXF1aXJlKCcuLi8uLi8uLi9jb21wb25lbnRzL0NDTGFiZWwnKTtcbmNvbnN0IExhYmVsT3V0bGluZSA9IHJlcXVpcmUoJy4uLy4uLy4uL2NvbXBvbmVudHMvQ0NMYWJlbE91dGxpbmUnKTtcbmNvbnN0IExhYmVsU2hhZG93ID0gcmVxdWlyZSgnLi4vLi4vLi4vY29tcG9uZW50cy9DQ0xhYmVsU2hhZG93Jyk7XG5jb25zdCBPdmVyZmxvdyA9IExhYmVsLk92ZXJmbG93O1xuY29uc3QgZGVsZXRlRnJvbUR5bmFtaWNBdGxhcyA9IHJlcXVpcmUoJy4uL3V0aWxzJykuZGVsZXRlRnJvbUR5bmFtaWNBdGxhcztcbmNvbnN0IGdldEZvbnRGYW1pbHkgPSByZXF1aXJlKCcuLi91dGlscycpLmdldEZvbnRGYW1pbHk7XG5cbmNvbnN0IE1BWF9TSVpFID0gMjA0ODtcbmNvbnN0IF9pbnZpc2libGVBbHBoYSA9ICgxIC8gMjU1KS50b0ZpeGVkKDMpO1xuXG5sZXQgX2NvbnRleHQgPSBudWxsO1xubGV0IF9jYW52YXMgPSBudWxsO1xubGV0IF90ZXh0dXJlID0gbnVsbDtcblxubGV0IF9mb250RGVzYyA9ICcnO1xubGV0IF9zdHJpbmcgPSAnJztcbmxldCBfZm9udFNpemUgPSAwO1xubGV0IF9kcmF3Rm9udFNpemUgPSAwO1xubGV0IF9zcGxpdGVkU3RyaW5ncyA9IFtdO1xubGV0IF9jYW52YXNTaXplID0gY2MuU2l6ZS5aRVJPO1xubGV0IF9saW5lSGVpZ2h0ID0gMDtcbmxldCBfaEFsaWduID0gMDtcbmxldCBfdkFsaWduID0gMDtcbmxldCBfY29sb3IgPSBudWxsO1xubGV0IF9mb250RmFtaWx5ID0gJyc7XG5sZXQgX292ZXJmbG93ID0gT3ZlcmZsb3cuTk9ORTtcbmxldCBfaXNXcmFwVGV4dCA9IGZhbHNlO1xuXG4vLyBvdXRsaW5lXG5sZXQgX291dGxpbmVDb21wID0gbnVsbDtcbmxldCBfb3V0bGluZUNvbG9yID0gY2MuQ29sb3IuV0hJVEU7XG5cbi8vIHNoYWRvd1xubGV0IF9zaGFkb3dDb21wID0gbnVsbDtcbmxldCBfc2hhZG93Q29sb3IgPSBjYy5Db2xvci5CTEFDSztcblxubGV0IF9jYW52YXNQYWRkaW5nID0gY2MucmVjdCgpO1xubGV0IF9jb250ZW50U2l6ZUV4dGVuZCA9IGNjLlNpemUuWkVSTztcbmxldCBfbm9kZUNvbnRlbnRTaXplID0gY2MuU2l6ZS5aRVJPO1xuXG5sZXQgX2VuYWJsZUJvbGQgPSBmYWxzZTtcbmxldCBfZW5hYmxlSXRhbGljID0gZmFsc2U7XG5sZXQgX2VuYWJsZVVuZGVybGluZSA9IGZhbHNlO1xubGV0IF91bmRlcmxpbmVUaGlja25lc3MgPSAwO1xuXG5sZXQgX2RyYXdVbmRlcmxpbmVQb3MgPSBjYy5WZWMyLlpFUk87XG5sZXQgX2RyYXdVbmRlcmxpbmVXaWR0aCA9IDA7XG5cbmxldCBfc2hhcmVkTGFiZWxEYXRhO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUVEZBc3NlbWJsZXIgZXh0ZW5kcyBBc3NlbWJsZXIyRCB7XG4gICAgX2dldEFzc2VtYmxlckRhdGEgKCkge1xuICAgICAgICBfc2hhcmVkTGFiZWxEYXRhID0gTGFiZWwuX2NhbnZhc1Bvb2wuZ2V0KCk7XG4gICAgICAgIF9zaGFyZWRMYWJlbERhdGEuY2FudmFzLndpZHRoID0gX3NoYXJlZExhYmVsRGF0YS5jYW52YXMuaGVpZ2h0ID0gMTtcbiAgICAgICAgcmV0dXJuIF9zaGFyZWRMYWJlbERhdGE7XG4gICAgfVxuXG4gICAgX3Jlc2V0QXNzZW1ibGVyRGF0YSAoYXNzZW1ibGVyRGF0YSkge1xuICAgICAgICBpZiAoYXNzZW1ibGVyRGF0YSkge1xuICAgICAgICAgICAgTGFiZWwuX2NhbnZhc1Bvb2wucHV0KGFzc2VtYmxlckRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlUmVuZGVyRGF0YSAoY29tcCkge1xuICAgICAgICBzdXBlci51cGRhdGVSZW5kZXJEYXRhKGNvbXApO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFjb21wLl92ZXJ0c0RpcnR5KSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5fdXBkYXRlRm9udEZhbWlseShjb21wKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlUHJvcGVydGllcyhjb21wKTtcbiAgICAgICAgdGhpcy5fY2FsY3VsYXRlTGFiZWxGb250KCk7XG4gICAgICAgIHRoaXMuX2NhbGN1bGF0ZVNwbGl0ZWRTdHJpbmdzKCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUxhYmVsRGltZW5zaW9ucygpO1xuICAgICAgICB0aGlzLl9jYWxjdWxhdGVUZXh0QmFzZWxpbmUoKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlVGV4dHVyZShjb21wKTtcbiAgICAgICAgdGhpcy5fY2FsRHluYW1pY0F0bGFzKGNvbXApO1xuXG4gICAgICAgIGNvbXAuX2FjdHVhbEZvbnRTaXplID0gX2ZvbnRTaXplO1xuICAgICAgICBjb21wLm5vZGUuc2V0Q29udGVudFNpemUoX25vZGVDb250ZW50U2l6ZSk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVWZXJ0cyhjb21wKTtcblxuICAgICAgICBjb21wLl92ZXJ0c0RpcnR5ID0gZmFsc2U7XG5cbiAgICAgICAgX2NvbnRleHQgPSBudWxsO1xuICAgICAgICBfY2FudmFzID0gbnVsbDtcbiAgICAgICAgX3RleHR1cmUgPSBudWxsO1xuICAgIH1cblxuICAgIHVwZGF0ZVZlcnRzICgpIHtcbiAgICB9XG5cbiAgICBfdXBkYXRlUGFkZGluZ1JlY3QgKCkge1xuICAgICAgICBsZXQgdG9wID0gMCwgYm90dG9tID0gMCwgbGVmdCA9IDAsIHJpZ2h0ID0gMDtcbiAgICAgICAgbGV0IG91dGxpbmVXaWR0aCA9IDA7XG4gICAgICAgIF9jb250ZW50U2l6ZUV4dGVuZC53aWR0aCA9IF9jb250ZW50U2l6ZUV4dGVuZC5oZWlnaHQgPSAwO1xuICAgICAgICBpZiAoX291dGxpbmVDb21wKSB7XG4gICAgICAgICAgICBvdXRsaW5lV2lkdGggPSBfb3V0bGluZUNvbXAud2lkdGg7XG4gICAgICAgICAgICB0b3AgPSBib3R0b20gPSBsZWZ0ID0gcmlnaHQgPSBvdXRsaW5lV2lkdGg7XG4gICAgICAgICAgICBfY29udGVudFNpemVFeHRlbmQud2lkdGggPSBfY29udGVudFNpemVFeHRlbmQuaGVpZ2h0ID0gb3V0bGluZVdpZHRoICogMjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoX3NoYWRvd0NvbXApIHtcbiAgICAgICAgICAgIGxldCBzaGFkb3dXaWR0aCA9IF9zaGFkb3dDb21wLmJsdXIgKyBvdXRsaW5lV2lkdGg7XG4gICAgICAgICAgICBsZWZ0ID0gTWF0aC5tYXgobGVmdCwgLV9zaGFkb3dDb21wLl9vZmZzZXQueCArIHNoYWRvd1dpZHRoKTtcbiAgICAgICAgICAgIHJpZ2h0ID0gTWF0aC5tYXgocmlnaHQsIF9zaGFkb3dDb21wLl9vZmZzZXQueCArIHNoYWRvd1dpZHRoKTtcbiAgICAgICAgICAgIHRvcCA9IE1hdGgubWF4KHRvcCwgX3NoYWRvd0NvbXAuX29mZnNldC55ICsgc2hhZG93V2lkdGgpO1xuICAgICAgICAgICAgYm90dG9tID0gTWF0aC5tYXgoYm90dG9tLCAtX3NoYWRvd0NvbXAuX29mZnNldC55ICsgc2hhZG93V2lkdGgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfZW5hYmxlSXRhbGljKSB7XG4gICAgICAgICAgICAvLzAuMDE3NDUzMjkyNSA9IDMuMTQxNTkyNjUzIC8gMTgwXG4gICAgICAgICAgICBsZXQgb2Zmc2V0ID0gX2RyYXdGb250U2l6ZSAqIE1hdGgudGFuKDEyICogMC4wMTc0NTMyOTI1KTtcbiAgICAgICAgICAgIHJpZ2h0ICs9IG9mZnNldDtcbiAgICAgICAgICAgIF9jb250ZW50U2l6ZUV4dGVuZC53aWR0aCArPSBvZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgICAgX2NhbnZhc1BhZGRpbmcueCA9IGxlZnQ7XG4gICAgICAgIF9jYW52YXNQYWRkaW5nLnkgPSB0b3A7XG4gICAgICAgIF9jYW52YXNQYWRkaW5nLndpZHRoID0gbGVmdCArIHJpZ2h0O1xuICAgICAgICBfY2FudmFzUGFkZGluZy5oZWlnaHQgPSB0b3AgKyBib3R0b207XG4gICAgfVxuXG4gICAgX3VwZGF0ZUZvbnRGYW1pbHkgKGNvbXApIHtcbiAgICAgICAgX2ZvbnRGYW1pbHkgPSBnZXRGb250RmFtaWx5KGNvbXApO1xuICAgIH1cblxuICAgIF91cGRhdGVQcm9wZXJ0aWVzIChjb21wKSB7XG4gICAgICAgIGxldCBhc3NlbWJsZXJEYXRhID0gY29tcC5fYXNzZW1ibGVyRGF0YTtcbiAgICAgICAgX2NvbnRleHQgPSBhc3NlbWJsZXJEYXRhLmNvbnRleHQ7XG4gICAgICAgIF9jYW52YXMgPSBhc3NlbWJsZXJEYXRhLmNhbnZhcztcbiAgICAgICAgX3RleHR1cmUgPSBjb21wLl9mcmFtZS5fb3JpZ2luYWwgPyBjb21wLl9mcmFtZS5fb3JpZ2luYWwuX3RleHR1cmUgOiBjb21wLl9mcmFtZS5fdGV4dHVyZTtcblxuICAgICAgICBfc3RyaW5nID0gY29tcC5zdHJpbmcudG9TdHJpbmcoKTtcbiAgICAgICAgX2ZvbnRTaXplID0gY29tcC5fZm9udFNpemU7XG4gICAgICAgIF9kcmF3Rm9udFNpemUgPSBfZm9udFNpemU7XG4gICAgICAgIF91bmRlcmxpbmVUaGlja25lc3MgPSBjb21wLnVuZGVybGluZUhlaWdodCB8fCBfZHJhd0ZvbnRTaXplIC8gODtcbiAgICAgICAgX292ZXJmbG93ID0gY29tcC5vdmVyZmxvdztcbiAgICAgICAgX2NhbnZhc1NpemUud2lkdGggPSBjb21wLm5vZGUud2lkdGg7XG4gICAgICAgIF9jYW52YXNTaXplLmhlaWdodCA9IGNvbXAubm9kZS5oZWlnaHQ7XG4gICAgICAgIF9ub2RlQ29udGVudFNpemUgPSBjb21wLm5vZGUuZ2V0Q29udGVudFNpemUoKTtcbiAgICAgICAgX2xpbmVIZWlnaHQgPSBjb21wLl9saW5lSGVpZ2h0O1xuICAgICAgICBfaEFsaWduID0gY29tcC5ob3Jpem9udGFsQWxpZ247XG4gICAgICAgIF92QWxpZ24gPSBjb21wLnZlcnRpY2FsQWxpZ247XG4gICAgICAgIF9jb2xvciA9IGNvbXAubm9kZS5jb2xvcjtcbiAgICAgICAgX2VuYWJsZUJvbGQgPSBjb21wLmVuYWJsZUJvbGQ7XG4gICAgICAgIF9lbmFibGVJdGFsaWMgPSBjb21wLmVuYWJsZUl0YWxpYztcbiAgICAgICAgX2VuYWJsZVVuZGVybGluZSA9IGNvbXAuZW5hYmxlVW5kZXJsaW5lO1xuXG4gICAgICAgIGlmIChfb3ZlcmZsb3cgPT09IE92ZXJmbG93Lk5PTkUpIHtcbiAgICAgICAgICAgIF9pc1dyYXBUZXh0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoX292ZXJmbG93ID09PSBPdmVyZmxvdy5SRVNJWkVfSEVJR0hUKSB7XG4gICAgICAgICAgICBfaXNXcmFwVGV4dCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBfaXNXcmFwVGV4dCA9IGNvbXAuZW5hYmxlV3JhcFRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBvdXRsaW5lXG4gICAgICAgIF9vdXRsaW5lQ29tcCA9IExhYmVsT3V0bGluZSAmJiBjb21wLmdldENvbXBvbmVudChMYWJlbE91dGxpbmUpO1xuICAgICAgICBfb3V0bGluZUNvbXAgPSAoX291dGxpbmVDb21wICYmIF9vdXRsaW5lQ29tcC5lbmFibGVkICYmIF9vdXRsaW5lQ29tcC53aWR0aCA+IDApID8gX291dGxpbmVDb21wIDogbnVsbDtcbiAgICAgICAgaWYgKF9vdXRsaW5lQ29tcCkge1xuICAgICAgICAgICAgX291dGxpbmVDb2xvci5zZXQoX291dGxpbmVDb21wLmNvbG9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNoYWRvd1xuICAgICAgICBfc2hhZG93Q29tcCA9IExhYmVsU2hhZG93ICYmIGNvbXAuZ2V0Q29tcG9uZW50KExhYmVsU2hhZG93KTtcbiAgICAgICAgX3NoYWRvd0NvbXAgPSAoX3NoYWRvd0NvbXAgJiYgX3NoYWRvd0NvbXAuZW5hYmxlZCkgPyBfc2hhZG93Q29tcCA6IG51bGw7XG4gICAgICAgIGlmIChfc2hhZG93Q29tcCkge1xuICAgICAgICAgICAgX3NoYWRvd0NvbG9yLnNldChfc2hhZG93Q29tcC5jb2xvcik7XG4gICAgICAgICAgICAvLyBUT0RPOiB0ZW1wb3Jhcnkgc29sdXRpb24sIGNhc2NhZGUgb3BhY2l0eSBmb3Igb3V0bGluZSBjb2xvclxuICAgICAgICAgICAgX3NoYWRvd0NvbG9yLmEgPSBfc2hhZG93Q29sb3IuYSAqIGNvbXAubm9kZS5jb2xvci5hIC8gMjU1LjA7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl91cGRhdGVQYWRkaW5nUmVjdCgpO1xuICAgIH1cblxuICAgIF9jYWxjdWxhdGVGaWxsVGV4dFN0YXJ0UG9zaXRpb24gKCkge1xuICAgICAgICBsZXQgbGFiZWxYID0gMDtcbiAgICAgICAgaWYgKF9oQWxpZ24gPT09IG1hY3JvLlRleHRBbGlnbm1lbnQuUklHSFQpIHtcbiAgICAgICAgICAgIGxhYmVsWCA9IF9jYW52YXNTaXplLndpZHRoIC0gX2NhbnZhc1BhZGRpbmcud2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoX2hBbGlnbiA9PT0gbWFjcm8uVGV4dEFsaWdubWVudC5DRU5URVIpIHtcbiAgICAgICAgICAgIGxhYmVsWCA9IChfY2FudmFzU2l6ZS53aWR0aCAtIF9jYW52YXNQYWRkaW5nLndpZHRoKSAvIDI7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbGluZUhlaWdodCA9IHRoaXMuX2dldExpbmVIZWlnaHQoKTtcbiAgICAgICAgbGV0IGRyYXdTdGFydFkgPSBsaW5lSGVpZ2h0ICogKF9zcGxpdGVkU3RyaW5ncy5sZW5ndGggLSAxKTtcbiAgICAgICAgLy8gVE9QXG4gICAgICAgIGxldCBmaXJzdExpbmVsYWJlbFkgPSBfZm9udFNpemUgKiAoMSAtIHRleHRVdGlscy5CQVNFTElORV9SQVRJTyAvIDIpO1xuICAgICAgICBpZiAoX3ZBbGlnbiAhPT0gbWFjcm8uVmVydGljYWxUZXh0QWxpZ25tZW50LlRPUCkge1xuICAgICAgICAgICAgLy8gZnJlZSBzcGFjZSBpbiB2ZXJ0aWNhbCBkaXJlY3Rpb25cbiAgICAgICAgICAgIGxldCBibGFuayA9IGRyYXdTdGFydFkgKyBfY2FudmFzUGFkZGluZy5oZWlnaHQgKyBfZm9udFNpemUgLSBfY2FudmFzU2l6ZS5oZWlnaHQ7XG4gICAgICAgICAgICBpZiAoX3ZBbGlnbiA9PT0gbWFjcm8uVmVydGljYWxUZXh0QWxpZ25tZW50LkJPVFRPTSkge1xuICAgICAgICAgICAgICAgIC8vIFVubGlrZSBCTUZvbnQsIG5lZWRzIHRvIHJlc2VydmUgc3BhY2UgYmVsb3cuXG4gICAgICAgICAgICAgICAgYmxhbmsgKz0gdGV4dFV0aWxzLkJBU0VMSU5FX1JBVElPIC8gMiAqIF9mb250U2l6ZTtcbiAgICAgICAgICAgICAgICAvLyBCT1RUT01cbiAgICAgICAgICAgICAgICBmaXJzdExpbmVsYWJlbFkgLT0gYmxhbms7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIENFTlRFUlxuICAgICAgICAgICAgICAgIGZpcnN0TGluZWxhYmVsWSAtPSBibGFuayAvIDI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2MudjIobGFiZWxYICsgX2NhbnZhc1BhZGRpbmcueCwgZmlyc3RMaW5lbGFiZWxZICsgX2NhbnZhc1BhZGRpbmcueSk7XG4gICAgfVxuXG4gICAgX3NldHVwT3V0bGluZSAoKSB7XG4gICAgICAgIF9jb250ZXh0LnN0cm9rZVN0eWxlID0gYHJnYmEoJHtfb3V0bGluZUNvbG9yLnJ9LCAke19vdXRsaW5lQ29sb3IuZ30sICR7X291dGxpbmVDb2xvci5ifSwgJHtfb3V0bGluZUNvbG9yLmEgLyAyNTV9KWA7XG4gICAgICAgIF9jb250ZXh0LmxpbmVXaWR0aCA9IF9vdXRsaW5lQ29tcC53aWR0aCAqIDI7XG4gICAgfVxuXG4gICAgX3NldHVwU2hhZG93ICgpIHtcbiAgICAgICAgX2NvbnRleHQuc2hhZG93Q29sb3IgPSBgcmdiYSgke19zaGFkb3dDb2xvci5yfSwgJHtfc2hhZG93Q29sb3IuZ30sICR7X3NoYWRvd0NvbG9yLmJ9LCAke19zaGFkb3dDb2xvci5hIC8gMjU1fSlgO1xuICAgICAgICBfY29udGV4dC5zaGFkb3dCbHVyID0gX3NoYWRvd0NvbXAuYmx1cjtcbiAgICAgICAgX2NvbnRleHQuc2hhZG93T2Zmc2V0WCA9IF9zaGFkb3dDb21wLm9mZnNldC54O1xuICAgICAgICBfY29udGV4dC5zaGFkb3dPZmZzZXRZID0gLV9zaGFkb3dDb21wLm9mZnNldC55O1xuICAgIH1cblxuICAgIF9kcmF3VW5kZXJsaW5lICh1bmRlcmxpbmV3aWR0aCkge1xuICAgICAgICBpZiAoX291dGxpbmVDb21wKSB7XG4gICAgICAgICAgICB0aGlzLl9zZXR1cE91dGxpbmUoKTtcbiAgICAgICAgICAgIF9jb250ZXh0LnN0cm9rZVJlY3QoX2RyYXdVbmRlcmxpbmVQb3MueCwgX2RyYXdVbmRlcmxpbmVQb3MueSwgdW5kZXJsaW5ld2lkdGgsIF91bmRlcmxpbmVUaGlja25lc3MpO1xuICAgICAgICB9XG4gICAgICAgIF9jb250ZXh0LmxpbmVXaWR0aCA9IF91bmRlcmxpbmVUaGlja25lc3M7XG4gICAgICAgIF9jb250ZXh0LmZpbGxTdHlsZSA9IGByZ2JhKCR7X2NvbG9yLnJ9LCAke19jb2xvci5nfSwgJHtfY29sb3IuYn0sICR7X2NvbG9yLmEgLyAyNTV9KWA7XG4gICAgICAgIF9jb250ZXh0LmZpbGxSZWN0KF9kcmF3VW5kZXJsaW5lUG9zLngsIF9kcmF3VW5kZXJsaW5lUG9zLnksIHVuZGVybGluZXdpZHRoLCBfdW5kZXJsaW5lVGhpY2tuZXNzKTtcbiAgICB9XG5cbiAgICBfdXBkYXRlVGV4dHVyZSAoKSB7XG4gICAgICAgIF9jb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBfY2FudmFzLndpZHRoLCBfY2FudmFzLmhlaWdodCk7XG4gICAgICAgIC8vQWRkIGEgd2hpdGUgYmFja2dyb3VuZCB0byBhdm9pZCBibGFjayBlZGdlcy5cbiAgICAgICAgLy9UT0RPOiBpdCBpcyBiZXN0IHRvIGFkZCBhbHBoYVRlc3QgdG8gZmlsdGVyIG91dCB0aGUgYmFja2dyb3VuZCBjb2xvci5cbiAgICAgICAgbGV0IF9maWxsQ29sb3IgPSBfb3V0bGluZUNvbXAgPyBfb3V0bGluZUNvbG9yIDogX2NvbG9yO1xuICAgICAgICBfY29udGV4dC5maWxsU3R5bGUgPSBgcmdiYSgke19maWxsQ29sb3Iucn0sICR7X2ZpbGxDb2xvci5nfSwgJHtfZmlsbENvbG9yLmJ9LCAke19pbnZpc2libGVBbHBoYX0pYDtcbiAgICAgICAgX2NvbnRleHQuZmlsbFJlY3QoMCwgMCwgX2NhbnZhcy53aWR0aCwgX2NhbnZhcy5oZWlnaHQpO1xuICAgICAgICBfY29udGV4dC5mb250ID0gX2ZvbnREZXNjO1xuXG4gICAgICAgIGxldCBzdGFydFBvc2l0aW9uID0gdGhpcy5fY2FsY3VsYXRlRmlsbFRleHRTdGFydFBvc2l0aW9uKCk7XG4gICAgICAgIGxldCBsaW5lSGVpZ2h0ID0gdGhpcy5fZ2V0TGluZUhlaWdodCgpO1xuICAgICAgICAvL3VzZSByb3VuZCBmb3IgbGluZSBqb2luIHRvIGF2b2lkIHNoYXJwIGludGVyc2VjdCBwb2ludFxuICAgICAgICBfY29udGV4dC5saW5lSm9pbiA9ICdyb3VuZCc7XG4gICAgICAgIF9jb250ZXh0LmZpbGxTdHlsZSA9IGByZ2JhKCR7X2NvbG9yLnJ9LCAke19jb2xvci5nfSwgJHtfY29sb3IuYn0sIDEpYDtcblxuICAgICAgICBsZXQgaXNNdWx0aXBsZSA9IF9zcGxpdGVkU3RyaW5ncy5sZW5ndGggPiAxO1xuXG4gICAgICAgIC8vZG8gcmVhbCByZW5kZXJpbmdcbiAgICAgICAgbGV0IG1lYXN1cmVUZXh0ID0gdGhpcy5fbWVhc3VyZVRleHQoX2NvbnRleHQsIF9mb250RGVzYyk7XG5cbiAgICAgICAgbGV0IGRyYXdUZXh0UG9zWCA9IDAsIGRyYXdUZXh0UG9zWSA9IDA7XG5cbiAgICAgICAgLy8gb25seSBvbmUgc2V0IHNoYWRvdyBhbmQgb3V0bGluZVxuICAgICAgICBpZiAoX3NoYWRvd0NvbXApIHtcbiAgICAgICAgICAgIHRoaXMuX3NldHVwU2hhZG93KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF9vdXRsaW5lQ29tcCAmJiBfb3V0bGluZUNvbXAud2lkdGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLl9zZXR1cE91dGxpbmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGRyYXcgc2hhZG93IGFuZCAob3V0bGluZSBvciB0ZXh0KVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IF9zcGxpdGVkU3RyaW5ncy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgZHJhd1RleHRQb3NYID0gc3RhcnRQb3NpdGlvbi54O1xuICAgICAgICAgICAgZHJhd1RleHRQb3NZID0gc3RhcnRQb3NpdGlvbi55ICsgaSAqIGxpbmVIZWlnaHQ7XG4gICAgICAgICAgICBpZiAoX3NoYWRvd0NvbXApIHtcbiAgICAgICAgICAgICAgICAvLyBtdWx0aXBsZSBsaW5lcyBuZWVkIHRvIGJlIGRyYXduIG91dGxpbmUgYW5kIGZpbGwgdGV4dFxuICAgICAgICAgICAgICAgIGlmIChpc011bHRpcGxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfb3V0bGluZUNvbXAgJiYgX291dGxpbmVDb21wLndpZHRoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQuc3Ryb2tlVGV4dChfc3BsaXRlZFN0cmluZ3NbaV0sIGRyYXdUZXh0UG9zWCwgZHJhd1RleHRQb3NZKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBfY29udGV4dC5maWxsVGV4dChfc3BsaXRlZFN0cmluZ3NbaV0sIGRyYXdUZXh0UG9zWCwgZHJhd1RleHRQb3NZKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGRyYXcgdW5kZXJsaW5lXG4gICAgICAgICAgICBpZiAoX2VuYWJsZVVuZGVybGluZSkge1xuICAgICAgICAgICAgICAgIF9kcmF3VW5kZXJsaW5lV2lkdGggPSBtZWFzdXJlVGV4dChfc3BsaXRlZFN0cmluZ3NbaV0pO1xuICAgICAgICAgICAgICAgIGlmIChfaEFsaWduID09PSBtYWNyby5UZXh0QWxpZ25tZW50LlJJR0hUKSB7XG4gICAgICAgICAgICAgICAgICAgIF9kcmF3VW5kZXJsaW5lUG9zLnggPSBzdGFydFBvc2l0aW9uLnggLSBfZHJhd1VuZGVybGluZVdpZHRoO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoX2hBbGlnbiA9PT0gbWFjcm8uVGV4dEFsaWdubWVudC5DRU5URVIpIHtcbiAgICAgICAgICAgICAgICAgICAgX2RyYXdVbmRlcmxpbmVQb3MueCA9IHN0YXJ0UG9zaXRpb24ueCAtIChfZHJhd1VuZGVybGluZVdpZHRoIC8gMik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgX2RyYXdVbmRlcmxpbmVQb3MueCA9IHN0YXJ0UG9zaXRpb24ueDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX2RyYXdVbmRlcmxpbmVQb3MueSA9IGRyYXdUZXh0UG9zWSArIF9kcmF3Rm9udFNpemUgLyA4O1xuICAgICAgICAgICAgICAgIHRoaXMuX2RyYXdVbmRlcmxpbmUoX2RyYXdVbmRlcmxpbmVXaWR0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX3NoYWRvd0NvbXAgJiYgaXNNdWx0aXBsZSkge1xuICAgICAgICAgICAgX2NvbnRleHQuc2hhZG93Q29sb3IgPSAndHJhbnNwYXJlbnQnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZHJhdyB0ZXh0IGFuZCBvdXRsaW5lXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgX3NwbGl0ZWRTdHJpbmdzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBkcmF3VGV4dFBvc1ggPSBzdGFydFBvc2l0aW9uLng7XG4gICAgICAgICAgICBkcmF3VGV4dFBvc1kgPSBzdGFydFBvc2l0aW9uLnkgKyBpICogbGluZUhlaWdodDtcbiAgICAgICAgICAgIGlmIChfb3V0bGluZUNvbXAgJiYgX291dGxpbmVDb21wLndpZHRoID4gMCkge1xuICAgICAgICAgICAgICAgIF9jb250ZXh0LnN0cm9rZVRleHQoX3NwbGl0ZWRTdHJpbmdzW2ldLCBkcmF3VGV4dFBvc1gsIGRyYXdUZXh0UG9zWSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfY29udGV4dC5maWxsVGV4dChfc3BsaXRlZFN0cmluZ3NbaV0sIGRyYXdUZXh0UG9zWCwgZHJhd1RleHRQb3NZKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfc2hhZG93Q29tcCkge1xuICAgICAgICAgICAgX2NvbnRleHQuc2hhZG93Q29sb3IgPSAndHJhbnNwYXJlbnQnO1xuICAgICAgICB9XG5cbiAgICAgICAgX3RleHR1cmUuaGFuZGxlTG9hZGVkVGV4dHVyZSgpO1xuICAgIH1cblxuICAgIF9jYWxEeW5hbWljQXRsYXMgKGNvbXApIHtcbiAgICAgICAgaWYoY29tcC5jYWNoZU1vZGUgIT09IExhYmVsLkNhY2hlTW9kZS5CSVRNQVApIHJldHVybjtcbiAgICAgICAgbGV0IGZyYW1lID0gY29tcC5fZnJhbWU7XG4gICAgICAgIC8vIERlbGV0ZSBjYWNoZSBpbiBhdGxhcy5cbiAgICAgICAgZGVsZXRlRnJvbUR5bmFtaWNBdGxhcyhjb21wLCBmcmFtZSk7XG4gICAgICAgIGlmICghZnJhbWUuX29yaWdpbmFsKSB7XG4gICAgICAgICAgICBmcmFtZS5zZXRSZWN0KGNjLnJlY3QoMCwgMCwgX2NhbnZhcy53aWR0aCwgX2NhbnZhcy5oZWlnaHQpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhY2tUb0R5bmFtaWNBdGxhcyhjb21wLCBmcmFtZSk7XG4gICAgfVxuXG4gICAgX3VwZGF0ZUxhYmVsRGltZW5zaW9ucyAoKSB7XG4gICAgICAgIGxldCBwYXJhZ3JhcGhlZFN0cmluZ3MgPSBfc3RyaW5nLnNwbGl0KCdcXG4nKTtcblxuICAgICAgICBpZiAoX292ZXJmbG93ID09PSBPdmVyZmxvdy5SRVNJWkVfSEVJR0hUKSB7XG4gICAgICAgICAgICBsZXQgcmF3SGVpZ2h0ID0gKF9zcGxpdGVkU3RyaW5ncy5sZW5ndGggKyB0ZXh0VXRpbHMuQkFTRUxJTkVfUkFUSU8pICogdGhpcy5fZ2V0TGluZUhlaWdodCgpO1xuICAgICAgICAgICAgX2NhbnZhc1NpemUuaGVpZ2h0ID0gcmF3SGVpZ2h0ICsgX2NhbnZhc1BhZGRpbmcuaGVpZ2h0O1xuICAgICAgICAgICAgLy8gc2V0IG5vZGUgaGVpZ2h0XG4gICAgICAgICAgICBfbm9kZUNvbnRlbnRTaXplLmhlaWdodCA9IHJhd0hlaWdodCArIF9jb250ZW50U2l6ZUV4dGVuZC5oZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoX292ZXJmbG93ID09PSBPdmVyZmxvdy5OT05FKSB7XG4gICAgICAgICAgICBfc3BsaXRlZFN0cmluZ3MgPSBwYXJhZ3JhcGhlZFN0cmluZ3M7XG4gICAgICAgICAgICBsZXQgY2FudmFzU2l6ZVggPSAwO1xuICAgICAgICAgICAgbGV0IGNhbnZhc1NpemVZID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFyYWdyYXBoZWRTdHJpbmdzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHBhcmFMZW5ndGggPSB0ZXh0VXRpbHMuc2FmZU1lYXN1cmVUZXh0KF9jb250ZXh0LCBwYXJhZ3JhcGhlZFN0cmluZ3NbaV0sIF9mb250RGVzYyk7XG4gICAgICAgICAgICAgICAgY2FudmFzU2l6ZVggPSBjYW52YXNTaXplWCA+IHBhcmFMZW5ndGggPyBjYW52YXNTaXplWCA6IHBhcmFMZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYW52YXNTaXplWSA9IChfc3BsaXRlZFN0cmluZ3MubGVuZ3RoICsgdGV4dFV0aWxzLkJBU0VMSU5FX1JBVElPKSAqIHRoaXMuX2dldExpbmVIZWlnaHQoKTtcbiAgICAgICAgICAgIGxldCByYXdXaWR0aCA9IHBhcnNlRmxvYXQoY2FudmFzU2l6ZVgudG9GaXhlZCgyKSk7XG4gICAgICAgICAgICBsZXQgcmF3SGVpZ2h0ID0gcGFyc2VGbG9hdChjYW52YXNTaXplWS50b0ZpeGVkKDIpKTtcbiAgICAgICAgICAgIF9jYW52YXNTaXplLndpZHRoID0gcmF3V2lkdGggKyBfY2FudmFzUGFkZGluZy53aWR0aDtcbiAgICAgICAgICAgIF9jYW52YXNTaXplLmhlaWdodCA9IHJhd0hlaWdodCArIF9jYW52YXNQYWRkaW5nLmhlaWdodDtcbiAgICAgICAgICAgIF9ub2RlQ29udGVudFNpemUud2lkdGggPSByYXdXaWR0aCArIF9jb250ZW50U2l6ZUV4dGVuZC53aWR0aDtcbiAgICAgICAgICAgIF9ub2RlQ29udGVudFNpemUuaGVpZ2h0ID0gcmF3SGVpZ2h0ICsgX2NvbnRlbnRTaXplRXh0ZW5kLmhlaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIF9jYW52YXNTaXplLndpZHRoID0gTWF0aC5taW4oX2NhbnZhc1NpemUud2lkdGgsIE1BWF9TSVpFKTtcbiAgICAgICAgX2NhbnZhc1NpemUuaGVpZ2h0ID0gTWF0aC5taW4oX2NhbnZhc1NpemUuaGVpZ2h0LCBNQVhfU0laRSk7XG5cbiAgICAgICAgaWYgKF9jYW52YXMud2lkdGggIT09IF9jYW52YXNTaXplLndpZHRoKSB7XG4gICAgICAgICAgICBfY2FudmFzLndpZHRoID0gX2NhbnZhc1NpemUud2lkdGg7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX2NhbnZhcy5oZWlnaHQgIT09IF9jYW52YXNTaXplLmhlaWdodCkge1xuICAgICAgICAgICAgX2NhbnZhcy5oZWlnaHQgPSBfY2FudmFzU2l6ZS5oZWlnaHQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfY2FsY3VsYXRlVGV4dEJhc2VsaW5lICgpIHtcbiAgICAgICAgbGV0IGhBbGlnbjtcblxuICAgICAgICBpZiAoX2hBbGlnbiA9PT0gbWFjcm8uVGV4dEFsaWdubWVudC5SSUdIVCkge1xuICAgICAgICAgICAgaEFsaWduID0gJ3JpZ2h0JztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChfaEFsaWduID09PSBtYWNyby5UZXh0QWxpZ25tZW50LkNFTlRFUikge1xuICAgICAgICAgICAgaEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBoQWxpZ24gPSAnbGVmdCc7XG4gICAgICAgIH1cbiAgICAgICAgX2NvbnRleHQudGV4dEFsaWduID0gaEFsaWduO1xuICAgICAgICBfY29udGV4dC50ZXh0QmFzZWxpbmUgPSAnYWxwaGFiZXRpYyc7XG4gICAgfVxuXG4gICAgX2NhbGN1bGF0ZVNwbGl0ZWRTdHJpbmdzICgpIHtcbiAgICAgICAgbGV0IHBhcmFncmFwaGVkU3RyaW5ncyA9IF9zdHJpbmcuc3BsaXQoJ1xcbicpO1xuXG4gICAgICAgIGlmIChfaXNXcmFwVGV4dCkge1xuICAgICAgICAgICAgX3NwbGl0ZWRTdHJpbmdzID0gW107XG4gICAgICAgICAgICBsZXQgY2FudmFzV2lkdGhOb01hcmdpbiA9IF9ub2RlQ29udGVudFNpemUud2lkdGg7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcmFncmFwaGVkU3RyaW5ncy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGxldCBhbGxXaWR0aCA9IHRleHRVdGlscy5zYWZlTWVhc3VyZVRleHQoX2NvbnRleHQsIHBhcmFncmFwaGVkU3RyaW5nc1tpXSwgX2ZvbnREZXNjKTtcbiAgICAgICAgICAgICAgICBsZXQgdGV4dEZyYWdtZW50ID0gdGV4dFV0aWxzLmZyYWdtZW50VGV4dChwYXJhZ3JhcGhlZFN0cmluZ3NbaV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbFdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW52YXNXaWR0aE5vTWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tZWFzdXJlVGV4dChfY29udGV4dCwgX2ZvbnREZXNjKSk7XG4gICAgICAgICAgICAgICAgX3NwbGl0ZWRTdHJpbmdzID0gX3NwbGl0ZWRTdHJpbmdzLmNvbmNhdCh0ZXh0RnJhZ21lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgX3NwbGl0ZWRTdHJpbmdzID0gcGFyYWdyYXBoZWRTdHJpbmdzO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBfZ2V0Rm9udERlc2MgKCkge1xuICAgICAgICBsZXQgZm9udERlc2MgPSBfZm9udFNpemUudG9TdHJpbmcoKSArICdweCAnO1xuICAgICAgICBmb250RGVzYyA9IGZvbnREZXNjICsgX2ZvbnRGYW1pbHk7XG4gICAgICAgIGlmIChfZW5hYmxlQm9sZCkge1xuICAgICAgICAgICAgZm9udERlc2MgPSBcImJvbGQgXCIgKyBmb250RGVzYztcbiAgICAgICAgfVxuICAgICAgICBpZiAoX2VuYWJsZUl0YWxpYykge1xuICAgICAgICAgICAgZm9udERlc2MgPSBcIml0YWxpYyBcIiArIGZvbnREZXNjO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmb250RGVzYztcbiAgICB9XG5cbiAgICBfZ2V0TGluZUhlaWdodCAoKSB7XG4gICAgICAgIGxldCBub2RlU3BhY2luZ1kgPSBfbGluZUhlaWdodDtcbiAgICAgICAgaWYgKG5vZGVTcGFjaW5nWSA9PT0gMCkge1xuICAgICAgICAgICAgbm9kZVNwYWNpbmdZID0gX2ZvbnRTaXplO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZVNwYWNpbmdZID0gbm9kZVNwYWNpbmdZICogX2ZvbnRTaXplIC8gX2RyYXdGb250U2l6ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub2RlU3BhY2luZ1kgfCAwO1xuICAgIH1cblxuICAgIF9jYWxjdWxhdGVQYXJhZ3JhcGhMZW5ndGggKHBhcmFncmFwaGVkU3RyaW5ncywgY3R4KSB7XG4gICAgICAgIGxldCBwYXJhZ3JhcGhMZW5ndGggPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcmFncmFwaGVkU3RyaW5ncy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgbGV0IHdpZHRoID0gdGV4dFV0aWxzLnNhZmVNZWFzdXJlVGV4dChjdHgsIHBhcmFncmFwaGVkU3RyaW5nc1tpXSwgX2ZvbnREZXNjKTtcbiAgICAgICAgICAgIHBhcmFncmFwaExlbmd0aC5wdXNoKHdpZHRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYXJhZ3JhcGhMZW5ndGg7XG4gICAgfVxuXG4gICAgX21lYXN1cmVUZXh0IChjdHgsIGZvbnREZXNjKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gdGV4dFV0aWxzLnNhZmVNZWFzdXJlVGV4dChjdHgsIHN0cmluZywgZm9udERlc2MpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIF9jYWxjdWxhdGVMYWJlbEZvbnQgKCkge1xuICAgICAgICBfZm9udERlc2MgPSB0aGlzLl9nZXRGb250RGVzYygpO1xuICAgICAgICBfY29udGV4dC5mb250ID0gX2ZvbnREZXNjO1xuXG4gICAgICAgIGlmIChfb3ZlcmZsb3cgPT09IE92ZXJmbG93LlNIUklOSykge1xuICAgICAgICAgICAgbGV0IHBhcmFncmFwaGVkU3RyaW5ncyA9IF9zdHJpbmcuc3BsaXQoJ1xcbicpO1xuICAgICAgICAgICAgbGV0IHBhcmFncmFwaExlbmd0aCA9IHRoaXMuX2NhbGN1bGF0ZVBhcmFncmFwaExlbmd0aChwYXJhZ3JhcGhlZFN0cmluZ3MsIF9jb250ZXh0KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgICAgbGV0IHRvdGFsSGVpZ2h0ID0gMDtcbiAgICAgICAgICAgIGxldCBtYXhMZW5ndGggPSAwO1xuXG4gICAgICAgICAgICBpZiAoX2lzV3JhcFRleHQpIHtcbiAgICAgICAgICAgICAgICBsZXQgY2FudmFzV2lkdGhOb01hcmdpbiA9IF9ub2RlQ29udGVudFNpemUud2lkdGg7XG4gICAgICAgICAgICAgICAgbGV0IGNhbnZhc0hlaWdodE5vTWFyZ2luID0gX25vZGVDb250ZW50U2l6ZS5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgaWYgKGNhbnZhc1dpZHRoTm9NYXJnaW4gPCAwIHx8IGNhbnZhc0hlaWdodE5vTWFyZ2luIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBfZm9udERlc2MgPSB0aGlzLl9nZXRGb250RGVzYygpO1xuICAgICAgICAgICAgICAgICAgICBfY29udGV4dC5mb250ID0gX2ZvbnREZXNjO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRvdGFsSGVpZ2h0ID0gY2FudmFzSGVpZ2h0Tm9NYXJnaW4gKyAxO1xuICAgICAgICAgICAgICAgIG1heExlbmd0aCA9IGNhbnZhc1dpZHRoTm9NYXJnaW4gKyAxO1xuICAgICAgICAgICAgICAgIGxldCBhY3R1YWxGb250U2l6ZSA9IF9mb250U2l6ZSArIDE7XG4gICAgICAgICAgICAgICAgbGV0IHRleHRGcmFnbWVudCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgLy9sZXQgc3RhcnRTaHJpbmtGb250U2l6ZSA9IGFjdHVhbEZvbnRTaXplIHwgMDtcbiAgICAgICAgICAgICAgICBsZXQgbGVmdCA9IDAsIHJpZ2h0ID0gYWN0dWFsRm9udFNpemUgfCAwLCBtaWQgPSAwO1xuXG4gICAgICAgICAgICAgICAgd2hpbGUgKGxlZnQgPCByaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBtaWQgPSAobGVmdCArIHJpZ2h0ICsgMSkgPj4gMTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAobWlkIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmxvZ0lEKDQwMDMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBfZm9udFNpemUgPSBtaWQ7XG4gICAgICAgICAgICAgICAgICAgIF9mb250RGVzYyA9IHRoaXMuX2dldEZvbnREZXNjKCk7XG4gICAgICAgICAgICAgICAgICAgIF9jb250ZXh0LmZvbnQgPSBfZm9udERlc2M7XG5cbiAgICAgICAgICAgICAgICAgICAgdG90YWxIZWlnaHQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcGFyYWdyYXBoZWRTdHJpbmdzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaiA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYWxsV2lkdGggPSB0ZXh0VXRpbHMuc2FmZU1lYXN1cmVUZXh0KF9jb250ZXh0LCBwYXJhZ3JhcGhlZFN0cmluZ3NbaV0sIF9mb250RGVzYyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0RnJhZ21lbnQgPSB0ZXh0VXRpbHMuZnJhZ21lbnRUZXh0KHBhcmFncmFwaGVkU3RyaW5nc1tpXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbFdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FudmFzV2lkdGhOb01hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX21lYXN1cmVUZXh0KF9jb250ZXh0LCBfZm9udERlc2MpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChqIDwgdGV4dEZyYWdtZW50Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heExlbmd0aCA9IHRleHRVdGlscy5zYWZlTWVhc3VyZVRleHQoX2NvbnRleHQsIHRleHRGcmFnbWVudFtqXSwgX2ZvbnREZXNjKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3RhbEhlaWdodCArPSB0aGlzLl9nZXRMaW5lSGVpZ2h0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKytqO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvdGFsSGVpZ2h0ID4gY2FudmFzSGVpZ2h0Tm9NYXJnaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0ID0gbWlkIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQgPSBtaWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobGVmdCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBjYy5sb2dJRCg0MDAzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfZm9udFNpemUgPSBsZWZ0O1xuICAgICAgICAgICAgICAgICAgICBfZm9udERlc2MgPSB0aGlzLl9nZXRGb250RGVzYygpO1xuICAgICAgICAgICAgICAgICAgICBfY29udGV4dC5mb250ID0gX2ZvbnREZXNjO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRvdGFsSGVpZ2h0ID0gcGFyYWdyYXBoZWRTdHJpbmdzLmxlbmd0aCAqIHRoaXMuX2dldExpbmVIZWlnaHQoKTtcblxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBwYXJhZ3JhcGhlZFN0cmluZ3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1heExlbmd0aCA8IHBhcmFncmFwaExlbmd0aFtpXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF4TGVuZ3RoID0gcGFyYWdyYXBoTGVuZ3RoW2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBzY2FsZVggPSAoX2NhbnZhc1NpemUud2lkdGggLSBfY2FudmFzUGFkZGluZy53aWR0aCkgLyBtYXhMZW5ndGg7XG4gICAgICAgICAgICAgICAgbGV0IHNjYWxlWSA9IF9jYW52YXNTaXplLmhlaWdodCAvIHRvdGFsSGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgX2ZvbnRTaXplID0gKF9kcmF3Rm9udFNpemUgKiBNYXRoLm1pbigxLCBzY2FsZVgsIHNjYWxlWSkpIHwgMDtcbiAgICAgICAgICAgICAgICBfZm9udERlc2MgPSB0aGlzLl9nZXRGb250RGVzYygpO1xuICAgICAgICAgICAgICAgIF9jb250ZXh0LmZvbnQgPSBfZm9udERlc2M7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbiJdfQ==