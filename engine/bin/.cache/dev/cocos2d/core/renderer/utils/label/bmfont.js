
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/utils/label/bmfont.js';
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

var Overflow = Label.Overflow;

var shareLabelInfo = require('../utils').shareLabelInfo;

var LetterInfo = function LetterInfo() {
  this["char"] = '';
  this.valid = true;
  this.x = 0;
  this.y = 0;
  this.line = 0;
  this.hash = "";
};

var _tmpRect = cc.rect();

var _comp = null;
var _horizontalKernings = [];
var _lettersInfo = [];
var _linesWidth = [];
var _linesOffsetX = [];
var _fntConfig = null;
var _numberOfLines = 0;
var _textDesiredHeight = 0;
var _letterOffsetY = 0;
var _tailoredTopY = 0;
var _tailoredBottomY = 0;
var _bmfontScale = 1.0;
var _lineBreakWithoutSpaces = false;
var _spriteFrame = null;
var _lineSpacing = 0;

var _contentSize = cc.size();

var _string = '';
var _fontSize = 0;
var _originFontSize = 0;
var _hAlign = 0;
var _vAlign = 0;
var _spacingX = 0;
var _lineHeight = 0;
var _overflow = 0;
var _isWrapText = false;
var _labelWidth = 0;
var _labelHeight = 0;
var _maxLineWidth = 0;

var BmfontAssembler =
/*#__PURE__*/
function (_Assembler2D) {
  _inheritsLoose(BmfontAssembler, _Assembler2D);

  function BmfontAssembler() {
    return _Assembler2D.apply(this, arguments) || this;
  }

  var _proto = BmfontAssembler.prototype;

  _proto.updateRenderData = function updateRenderData(comp) {
    if (!comp._vertsDirty) return;
    if (_comp === comp) return;
    _comp = comp;

    this._reserveQuads(comp, comp.string.toString().length);

    this._updateFontFamily(comp);

    this._updateProperties(comp);

    this._updateLabelInfo(comp);

    this._updateContent();

    this.updateWorldVerts(comp);
    _comp._actualFontSize = _fontSize;

    _comp.node.setContentSize(_contentSize);

    _comp._vertsDirty = false;
    _comp = null;

    this._resetProperties();
  };

  _proto._updateFontScale = function _updateFontScale() {
    _bmfontScale = _fontSize / _originFontSize;
  };

  _proto._updateFontFamily = function _updateFontFamily(comp) {
    var fontAsset = comp.font;
    _spriteFrame = fontAsset.spriteFrame;
    _fntConfig = fontAsset._fntConfig;
    shareLabelInfo.fontAtlas = fontAsset._fontDefDictionary;
    this.packToDynamicAtlas(comp, _spriteFrame);
  };

  _proto._updateLabelInfo = function _updateLabelInfo() {
    // clear
    shareLabelInfo.hash = "";
    shareLabelInfo.margin = 0;
  };

  _proto._updateProperties = function _updateProperties(comp) {
    _string = comp.string.toString();
    _fontSize = comp.fontSize;
    _originFontSize = _fntConfig ? _fntConfig.fontSize : comp.fontSize;
    _hAlign = comp.horizontalAlign;
    _vAlign = comp.verticalAlign;
    _spacingX = comp.spacingX;
    _overflow = comp.overflow;
    _lineHeight = comp._lineHeight;
    _contentSize.width = comp.node.width;
    _contentSize.height = comp.node.height; // should wrap text

    if (_overflow === Overflow.NONE) {
      _isWrapText = false;
      _contentSize.width += shareLabelInfo.margin * 2;
      _contentSize.height += shareLabelInfo.margin * 2;
    } else if (_overflow === Overflow.RESIZE_HEIGHT) {
      _isWrapText = true;
      _contentSize.height += shareLabelInfo.margin * 2;
    } else {
      _isWrapText = comp.enableWrapText;
    }

    shareLabelInfo.lineHeight = _lineHeight;
    shareLabelInfo.fontSize = _fontSize;

    this._setupBMFontOverflowMetrics();
  };

  _proto._resetProperties = function _resetProperties() {
    _fntConfig = null;
    _spriteFrame = null;
    shareLabelInfo.hash = "";
    shareLabelInfo.margin = 0;
  };

  _proto._updateContent = function _updateContent() {
    this._updateFontScale();

    this._computeHorizontalKerningForText();

    this._alignText();
  };

  _proto._computeHorizontalKerningForText = function _computeHorizontalKerningForText() {
    var string = _string;
    var stringLen = string.length;
    var kerningDict = _fntConfig.kerningDict;
    var horizontalKernings = _horizontalKernings;
    var prev = -1;

    for (var i = 0; i < stringLen; ++i) {
      var key = string.charCodeAt(i);
      var kerningAmount = kerningDict[prev << 16 | key & 0xffff] || 0;

      if (i < stringLen - 1) {
        horizontalKernings[i] = kerningAmount;
      } else {
        horizontalKernings[i] = 0;
      }

      prev = key;
    }
  };

  _proto._multilineTextWrap = function _multilineTextWrap(nextTokenFunc) {
    var textLen = _string.length;
    var lineIndex = 0;
    var nextTokenX = 0;
    var nextTokenY = 0;
    var longestLine = 0;
    var letterRight = 0;
    var highestY = 0;
    var lowestY = 0;
    var letterDef = null;
    var letterPosition = cc.v2(0, 0);

    for (var index = 0; index < textLen;) {
      var character = _string.charAt(index);

      if (character === "\n") {
        _linesWidth.push(letterRight);

        letterRight = 0;
        lineIndex++;
        nextTokenX = 0;
        nextTokenY -= _lineHeight * this._getFontScale() + _lineSpacing;

        this._recordPlaceholderInfo(index, character);

        index++;
        continue;
      }

      var tokenLen = nextTokenFunc(_string, index, textLen);
      var tokenHighestY = highestY;
      var tokenLowestY = lowestY;
      var tokenRight = letterRight;
      var nextLetterX = nextTokenX;
      var newLine = false;

      for (var tmp = 0; tmp < tokenLen; ++tmp) {
        var letterIndex = index + tmp;
        character = _string.charAt(letterIndex);

        if (character === "\r") {
          this._recordPlaceholderInfo(letterIndex, character);

          continue;
        }

        letterDef = shareLabelInfo.fontAtlas.getLetterDefinitionForChar(character, shareLabelInfo);

        if (!letterDef) {
          this._recordPlaceholderInfo(letterIndex, character);

          console.log("Can't find letter definition in texture atlas " + _fntConfig.atlasName + " for letter:" + character);
          continue;
        }

        var letterX = nextLetterX + letterDef.offsetX * _bmfontScale - shareLabelInfo.margin;

        if (_isWrapText && _maxLineWidth > 0 && nextTokenX > 0 && letterX + letterDef.w * _bmfontScale > _maxLineWidth && !textUtils.isUnicodeSpace(character)) {
          _linesWidth.push(letterRight);

          letterRight = 0;
          lineIndex++;
          nextTokenX = 0;
          nextTokenY -= _lineHeight * this._getFontScale() + _lineSpacing;
          newLine = true;
          break;
        } else {
          letterPosition.x = letterX;
        }

        letterPosition.y = nextTokenY - letterDef.offsetY * _bmfontScale + shareLabelInfo.margin;

        this._recordLetterInfo(letterPosition, character, letterIndex, lineIndex);

        if (letterIndex + 1 < _horizontalKernings.length && letterIndex < textLen - 1) {
          nextLetterX += _horizontalKernings[letterIndex + 1];
        }

        nextLetterX += letterDef.xAdvance * _bmfontScale + _spacingX - shareLabelInfo.margin * 2;
        tokenRight = letterPosition.x + letterDef.w * _bmfontScale - shareLabelInfo.margin;

        if (tokenHighestY < letterPosition.y) {
          tokenHighestY = letterPosition.y;
        }

        if (tokenLowestY > letterPosition.y - letterDef.h * _bmfontScale) {
          tokenLowestY = letterPosition.y - letterDef.h * _bmfontScale;
        }
      } //end of for loop


      if (newLine) continue;
      nextTokenX = nextLetterX;
      letterRight = tokenRight;

      if (highestY < tokenHighestY) {
        highestY = tokenHighestY;
      }

      if (lowestY > tokenLowestY) {
        lowestY = tokenLowestY;
      }

      if (longestLine < letterRight) {
        longestLine = letterRight;
      }

      index += tokenLen;
    } //end of for loop


    _linesWidth.push(letterRight);

    _numberOfLines = lineIndex + 1;
    _textDesiredHeight = _numberOfLines * _lineHeight * this._getFontScale();

    if (_numberOfLines > 1) {
      _textDesiredHeight += (_numberOfLines - 1) * _lineSpacing;
    }

    _contentSize.width = _labelWidth;
    _contentSize.height = _labelHeight;

    if (_labelWidth <= 0) {
      _contentSize.width = parseFloat(longestLine.toFixed(2)) + shareLabelInfo.margin * 2;
    }

    if (_labelHeight <= 0) {
      _contentSize.height = parseFloat(_textDesiredHeight.toFixed(2)) + shareLabelInfo.margin * 2;
    }

    _tailoredTopY = _contentSize.height;
    _tailoredBottomY = 0;

    if (_overflow !== Overflow.CLAMP) {
      if (highestY > 0) {
        _tailoredTopY = _contentSize.height + highestY;
      }

      if (lowestY < -_textDesiredHeight) {
        _tailoredBottomY = _textDesiredHeight + lowestY;
      }
    }

    return true;
  };

  _proto._getFirstCharLen = function _getFirstCharLen() {
    return 1;
  };

  _proto._getFontScale = function _getFontScale() {
    return _overflow === Overflow.SHRINK ? _bmfontScale : 1;
  };

  _proto._getFirstWordLen = function _getFirstWordLen(text, startIndex, textLen) {
    var character = text.charAt(startIndex);

    if (textUtils.isUnicodeCJK(character) || character === "\n" || textUtils.isUnicodeSpace(character)) {
      return 1;
    }

    var len = 1;
    var letterDef = shareLabelInfo.fontAtlas.getLetterDefinitionForChar(character, shareLabelInfo);

    if (!letterDef) {
      return len;
    }

    var nextLetterX = letterDef.xAdvance * _bmfontScale + _spacingX;
    var letterX;

    for (var index = startIndex + 1; index < textLen; ++index) {
      character = text.charAt(index);
      letterDef = shareLabelInfo.fontAtlas.getLetterDefinitionForChar(character, shareLabelInfo);

      if (!letterDef) {
        break;
      }

      letterX = nextLetterX + letterDef.offsetX * _bmfontScale;

      if (letterX + letterDef.w * _bmfontScale > _maxLineWidth && !textUtils.isUnicodeSpace(character) && _maxLineWidth > 0) {
        return len;
      }

      nextLetterX += letterDef.xAdvance * _bmfontScale + _spacingX;

      if (character === "\n" || textUtils.isUnicodeSpace(character) || textUtils.isUnicodeCJK(character)) {
        break;
      }

      len++;
    }

    return len;
  };

  _proto._multilineTextWrapByWord = function _multilineTextWrapByWord() {
    return this._multilineTextWrap(this._getFirstWordLen);
  };

  _proto._multilineTextWrapByChar = function _multilineTextWrapByChar() {
    return this._multilineTextWrap(this._getFirstCharLen);
  };

  _proto._recordPlaceholderInfo = function _recordPlaceholderInfo(letterIndex, _char) {
    if (letterIndex >= _lettersInfo.length) {
      var tmpInfo = new LetterInfo();

      _lettersInfo.push(tmpInfo);
    }

    _lettersInfo[letterIndex]["char"] = _char;
    _lettersInfo[letterIndex].hash = _char.charCodeAt(0) + shareLabelInfo.hash;
    _lettersInfo[letterIndex].valid = false;
  };

  _proto._recordLetterInfo = function _recordLetterInfo(letterPosition, character, letterIndex, lineIndex) {
    if (letterIndex >= _lettersInfo.length) {
      var tmpInfo = new LetterInfo();

      _lettersInfo.push(tmpInfo);
    }

    var _char2 = character.charCodeAt(0);

    var key = _char2 + shareLabelInfo.hash;
    _lettersInfo[letterIndex].line = lineIndex;
    _lettersInfo[letterIndex]["char"] = character;
    _lettersInfo[letterIndex].hash = key;
    _lettersInfo[letterIndex].valid = shareLabelInfo.fontAtlas.getLetter(key).valid;
    _lettersInfo[letterIndex].x = letterPosition.x;
    _lettersInfo[letterIndex].y = letterPosition.y;
  };

  _proto._alignText = function _alignText() {
    _textDesiredHeight = 0;
    _linesWidth.length = 0;

    if (!_lineBreakWithoutSpaces) {
      this._multilineTextWrapByWord();
    } else {
      this._multilineTextWrapByChar();
    }

    this._computeAlignmentOffset(); //shrink


    if (_overflow === Overflow.SHRINK) {
      if (_fontSize > 0 && this._isVerticalClamp()) {
        this._shrinkLabelToContentSize(this._isVerticalClamp);
      }
    }

    if (!this._updateQuads()) {
      if (_overflow === Overflow.SHRINK) {
        this._shrinkLabelToContentSize(this._isHorizontalClamp);
      }
    }
  };

  _proto._scaleFontSizeDown = function _scaleFontSizeDown(fontSize) {
    var shouldUpdateContent = true;

    if (!fontSize) {
      fontSize = 0.1;
      shouldUpdateContent = false;
    }

    _fontSize = fontSize;

    if (shouldUpdateContent) {
      this._updateContent();
    }
  };

  _proto._shrinkLabelToContentSize = function _shrinkLabelToContentSize(lambda) {
    var fontSize = _fontSize;
    var left = 0,
        right = fontSize | 0,
        mid = 0;

    while (left < right) {
      mid = left + right + 1 >> 1;
      var newFontSize = mid;

      if (newFontSize <= 0) {
        break;
      }

      _bmfontScale = newFontSize / _originFontSize;

      if (!_lineBreakWithoutSpaces) {
        this._multilineTextWrapByWord();
      } else {
        this._multilineTextWrapByChar();
      }

      this._computeAlignmentOffset();

      if (lambda()) {
        right = mid - 1;
      } else {
        left = mid;
      }
    }

    var actualFontSize = left;

    if (actualFontSize >= 0) {
      this._scaleFontSizeDown(actualFontSize);
    }
  };

  _proto._isVerticalClamp = function _isVerticalClamp() {
    if (_textDesiredHeight > _contentSize.height) {
      return true;
    } else {
      return false;
    }
  };

  _proto._isHorizontalClamp = function _isHorizontalClamp() {
    var letterClamp = false;

    for (var ctr = 0, l = _string.length; ctr < l; ++ctr) {
      var letterInfo = _lettersInfo[ctr];

      if (letterInfo.valid) {
        var letterDef = shareLabelInfo.fontAtlas.getLetter(letterInfo.hash);
        var px = letterInfo.x + letterDef.w * _bmfontScale;
        var lineIndex = letterInfo.line;

        if (_labelWidth > 0) {
          if (!_isWrapText) {
            if (px > _contentSize.width) {
              letterClamp = true;
              break;
            }
          } else {
            var wordWidth = _linesWidth[lineIndex];

            if (wordWidth > _contentSize.width && (px > _contentSize.width || px < 0)) {
              letterClamp = true;
              break;
            }
          }
        }
      }
    }

    return letterClamp;
  };

  _proto._isHorizontalClamped = function _isHorizontalClamped(px, lineIndex) {
    var wordWidth = _linesWidth[lineIndex];
    var letterOverClamp = px > _contentSize.width || px < 0;

    if (!_isWrapText) {
      return letterOverClamp;
    } else {
      return wordWidth > _contentSize.width && letterOverClamp;
    }
  };

  _proto._updateQuads = function _updateQuads() {
    var texture = _spriteFrame ? _spriteFrame._texture : shareLabelInfo.fontAtlas.getTexture();
    var node = _comp.node;
    this.verticesCount = this.indicesCount = 0; // Need to reset dataLength in Canvas rendering mode.

    this._renderData && (this._renderData.dataLength = 0);
    var contentSize = _contentSize,
        appx = node._anchorPoint.x * contentSize.width,
        appy = node._anchorPoint.y * contentSize.height;
    var ret = true;

    for (var ctr = 0, l = _string.length; ctr < l; ++ctr) {
      var letterInfo = _lettersInfo[ctr];
      if (!letterInfo.valid) continue;
      var letterDef = shareLabelInfo.fontAtlas.getLetter(letterInfo.hash);
      _tmpRect.height = letterDef.h;
      _tmpRect.width = letterDef.w;
      _tmpRect.x = letterDef.u;
      _tmpRect.y = letterDef.v;
      var py = letterInfo.y + _letterOffsetY;

      if (_labelHeight > 0) {
        if (py > _tailoredTopY) {
          var clipTop = py - _tailoredTopY;
          _tmpRect.y += clipTop;
          _tmpRect.height -= clipTop;
          py = py - clipTop;
        }

        if (py - letterDef.h * _bmfontScale < _tailoredBottomY && _overflow === Overflow.CLAMP) {
          _tmpRect.height = py < _tailoredBottomY ? 0 : (py - _tailoredBottomY) / _bmfontScale;
        }
      }

      var lineIndex = letterInfo.line;
      var px = letterInfo.x + letterDef.w / 2 * _bmfontScale + _linesOffsetX[lineIndex];

      if (_labelWidth > 0) {
        if (this._isHorizontalClamped(px, lineIndex)) {
          if (_overflow === Overflow.CLAMP) {
            _tmpRect.width = 0;
          } else if (_overflow === Overflow.SHRINK) {
            if (_contentSize.width > letterDef.w) {
              ret = false;
              break;
            } else {
              _tmpRect.width = 0;
            }
          }
        }
      }

      if (_tmpRect.height > 0 && _tmpRect.width > 0) {
        var isRotated = this._determineRect(_tmpRect);

        var letterPositionX = letterInfo.x + _linesOffsetX[letterInfo.line];
        this.appendQuad(_comp, texture, _tmpRect, isRotated, letterPositionX - appx, py - appy, _bmfontScale);
      }
    }

    this._quadsUpdated(_comp);

    return ret;
  };

  _proto._determineRect = function _determineRect(tempRect) {
    var isRotated = _spriteFrame.isRotated();

    var originalSize = _spriteFrame._originalSize;
    var rect = _spriteFrame._rect;
    var offset = _spriteFrame._offset;
    var trimmedLeft = offset.x + (originalSize.width - rect.width) / 2;
    var trimmedTop = offset.y - (originalSize.height - rect.height) / 2;

    if (!isRotated) {
      tempRect.x += rect.x - trimmedLeft;
      tempRect.y += rect.y + trimmedTop;
    } else {
      var originalX = tempRect.x;
      tempRect.x = rect.x + rect.height - tempRect.y - tempRect.height - trimmedTop;
      tempRect.y = originalX + rect.y - trimmedLeft;

      if (tempRect.y < 0) {
        tempRect.height = tempRect.height + trimmedTop;
      }
    }

    return isRotated;
  };

  _proto._computeAlignmentOffset = function _computeAlignmentOffset() {
    _linesOffsetX.length = 0;

    switch (_hAlign) {
      case macro.TextAlignment.LEFT:
        for (var i = 0; i < _numberOfLines; ++i) {
          _linesOffsetX.push(0);
        }

        break;

      case macro.TextAlignment.CENTER:
        for (var _i = 0, l = _linesWidth.length; _i < l; _i++) {
          _linesOffsetX.push((_contentSize.width - _linesWidth[_i]) / 2);
        }

        break;

      case macro.TextAlignment.RIGHT:
        for (var _i2 = 0, _l = _linesWidth.length; _i2 < _l; _i2++) {
          _linesOffsetX.push(_contentSize.width - _linesWidth[_i2]);
        }

        break;

      default:
        break;
    } // TOP


    _letterOffsetY = _contentSize.height;

    if (_vAlign !== macro.VerticalTextAlignment.TOP) {
      var blank = _contentSize.height - _textDesiredHeight + _lineHeight * this._getFontScale() - _originFontSize * _bmfontScale;

      if (_vAlign === macro.VerticalTextAlignment.BOTTOM) {
        // BOTTOM
        _letterOffsetY -= blank;
      } else {
        // CENTER:
        _letterOffsetY -= blank / 2;
      }
    }
  };

  _proto._setupBMFontOverflowMetrics = function _setupBMFontOverflowMetrics() {
    var newWidth = _contentSize.width,
        newHeight = _contentSize.height;

    if (_overflow === Overflow.RESIZE_HEIGHT) {
      newHeight = 0;
    }

    if (_overflow === Overflow.NONE) {
      newWidth = 0;
      newHeight = 0;
    }

    _labelWidth = newWidth;
    _labelHeight = newHeight;
    _maxLineWidth = newWidth;
  };

  _proto.updateWorldVerts = function updateWorldVerts() {};

  _proto.appendQuad = function appendQuad(comp, texture, rect, rotated, x, y, scale) {};

  _proto._quadsUpdated = function _quadsUpdated(comp) {};

  _proto._reserveQuads = function _reserveQuads() {};

  return BmfontAssembler;
}(_assembler2d["default"]);

exports["default"] = BmfontAssembler;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJtZm9udC5qcyJdLCJuYW1lcyI6WyJ0ZXh0VXRpbHMiLCJyZXF1aXJlIiwibWFjcm8iLCJMYWJlbCIsIk92ZXJmbG93Iiwic2hhcmVMYWJlbEluZm8iLCJMZXR0ZXJJbmZvIiwidmFsaWQiLCJ4IiwieSIsImxpbmUiLCJoYXNoIiwiX3RtcFJlY3QiLCJjYyIsInJlY3QiLCJfY29tcCIsIl9ob3Jpem9udGFsS2VybmluZ3MiLCJfbGV0dGVyc0luZm8iLCJfbGluZXNXaWR0aCIsIl9saW5lc09mZnNldFgiLCJfZm50Q29uZmlnIiwiX251bWJlck9mTGluZXMiLCJfdGV4dERlc2lyZWRIZWlnaHQiLCJfbGV0dGVyT2Zmc2V0WSIsIl90YWlsb3JlZFRvcFkiLCJfdGFpbG9yZWRCb3R0b21ZIiwiX2JtZm9udFNjYWxlIiwiX2xpbmVCcmVha1dpdGhvdXRTcGFjZXMiLCJfc3ByaXRlRnJhbWUiLCJfbGluZVNwYWNpbmciLCJfY29udGVudFNpemUiLCJzaXplIiwiX3N0cmluZyIsIl9mb250U2l6ZSIsIl9vcmlnaW5Gb250U2l6ZSIsIl9oQWxpZ24iLCJfdkFsaWduIiwiX3NwYWNpbmdYIiwiX2xpbmVIZWlnaHQiLCJfb3ZlcmZsb3ciLCJfaXNXcmFwVGV4dCIsIl9sYWJlbFdpZHRoIiwiX2xhYmVsSGVpZ2h0IiwiX21heExpbmVXaWR0aCIsIkJtZm9udEFzc2VtYmxlciIsInVwZGF0ZVJlbmRlckRhdGEiLCJjb21wIiwiX3ZlcnRzRGlydHkiLCJfcmVzZXJ2ZVF1YWRzIiwic3RyaW5nIiwidG9TdHJpbmciLCJsZW5ndGgiLCJfdXBkYXRlRm9udEZhbWlseSIsIl91cGRhdGVQcm9wZXJ0aWVzIiwiX3VwZGF0ZUxhYmVsSW5mbyIsIl91cGRhdGVDb250ZW50IiwidXBkYXRlV29ybGRWZXJ0cyIsIl9hY3R1YWxGb250U2l6ZSIsIm5vZGUiLCJzZXRDb250ZW50U2l6ZSIsIl9yZXNldFByb3BlcnRpZXMiLCJfdXBkYXRlRm9udFNjYWxlIiwiZm9udEFzc2V0IiwiZm9udCIsInNwcml0ZUZyYW1lIiwiZm9udEF0bGFzIiwiX2ZvbnREZWZEaWN0aW9uYXJ5IiwicGFja1RvRHluYW1pY0F0bGFzIiwibWFyZ2luIiwiZm9udFNpemUiLCJob3Jpem9udGFsQWxpZ24iLCJ2ZXJ0aWNhbEFsaWduIiwic3BhY2luZ1giLCJvdmVyZmxvdyIsIndpZHRoIiwiaGVpZ2h0IiwiTk9ORSIsIlJFU0laRV9IRUlHSFQiLCJlbmFibGVXcmFwVGV4dCIsImxpbmVIZWlnaHQiLCJfc2V0dXBCTUZvbnRPdmVyZmxvd01ldHJpY3MiLCJfY29tcHV0ZUhvcml6b250YWxLZXJuaW5nRm9yVGV4dCIsIl9hbGlnblRleHQiLCJzdHJpbmdMZW4iLCJrZXJuaW5nRGljdCIsImhvcml6b250YWxLZXJuaW5ncyIsInByZXYiLCJpIiwia2V5IiwiY2hhckNvZGVBdCIsImtlcm5pbmdBbW91bnQiLCJfbXVsdGlsaW5lVGV4dFdyYXAiLCJuZXh0VG9rZW5GdW5jIiwidGV4dExlbiIsImxpbmVJbmRleCIsIm5leHRUb2tlblgiLCJuZXh0VG9rZW5ZIiwibG9uZ2VzdExpbmUiLCJsZXR0ZXJSaWdodCIsImhpZ2hlc3RZIiwibG93ZXN0WSIsImxldHRlckRlZiIsImxldHRlclBvc2l0aW9uIiwidjIiLCJpbmRleCIsImNoYXJhY3RlciIsImNoYXJBdCIsInB1c2giLCJfZ2V0Rm9udFNjYWxlIiwiX3JlY29yZFBsYWNlaG9sZGVySW5mbyIsInRva2VuTGVuIiwidG9rZW5IaWdoZXN0WSIsInRva2VuTG93ZXN0WSIsInRva2VuUmlnaHQiLCJuZXh0TGV0dGVyWCIsIm5ld0xpbmUiLCJ0bXAiLCJsZXR0ZXJJbmRleCIsImdldExldHRlckRlZmluaXRpb25Gb3JDaGFyIiwiY29uc29sZSIsImxvZyIsImF0bGFzTmFtZSIsImxldHRlclgiLCJvZmZzZXRYIiwidyIsImlzVW5pY29kZVNwYWNlIiwib2Zmc2V0WSIsIl9yZWNvcmRMZXR0ZXJJbmZvIiwieEFkdmFuY2UiLCJoIiwicGFyc2VGbG9hdCIsInRvRml4ZWQiLCJDTEFNUCIsIl9nZXRGaXJzdENoYXJMZW4iLCJTSFJJTksiLCJfZ2V0Rmlyc3RXb3JkTGVuIiwidGV4dCIsInN0YXJ0SW5kZXgiLCJpc1VuaWNvZGVDSksiLCJsZW4iLCJfbXVsdGlsaW5lVGV4dFdyYXBCeVdvcmQiLCJfbXVsdGlsaW5lVGV4dFdyYXBCeUNoYXIiLCJjaGFyIiwidG1wSW5mbyIsImdldExldHRlciIsIl9jb21wdXRlQWxpZ25tZW50T2Zmc2V0IiwiX2lzVmVydGljYWxDbGFtcCIsIl9zaHJpbmtMYWJlbFRvQ29udGVudFNpemUiLCJfdXBkYXRlUXVhZHMiLCJfaXNIb3Jpem9udGFsQ2xhbXAiLCJfc2NhbGVGb250U2l6ZURvd24iLCJzaG91bGRVcGRhdGVDb250ZW50IiwibGFtYmRhIiwibGVmdCIsInJpZ2h0IiwibWlkIiwibmV3Rm9udFNpemUiLCJhY3R1YWxGb250U2l6ZSIsImxldHRlckNsYW1wIiwiY3RyIiwibCIsImxldHRlckluZm8iLCJweCIsIndvcmRXaWR0aCIsIl9pc0hvcml6b250YWxDbGFtcGVkIiwibGV0dGVyT3ZlckNsYW1wIiwidGV4dHVyZSIsIl90ZXh0dXJlIiwiZ2V0VGV4dHVyZSIsInZlcnRpY2VzQ291bnQiLCJpbmRpY2VzQ291bnQiLCJfcmVuZGVyRGF0YSIsImRhdGFMZW5ndGgiLCJjb250ZW50U2l6ZSIsImFwcHgiLCJfYW5jaG9yUG9pbnQiLCJhcHB5IiwicmV0IiwidSIsInYiLCJweSIsImNsaXBUb3AiLCJpc1JvdGF0ZWQiLCJfZGV0ZXJtaW5lUmVjdCIsImxldHRlclBvc2l0aW9uWCIsImFwcGVuZFF1YWQiLCJfcXVhZHNVcGRhdGVkIiwidGVtcFJlY3QiLCJvcmlnaW5hbFNpemUiLCJfb3JpZ2luYWxTaXplIiwiX3JlY3QiLCJvZmZzZXQiLCJfb2Zmc2V0IiwidHJpbW1lZExlZnQiLCJ0cmltbWVkVG9wIiwib3JpZ2luYWxYIiwiVGV4dEFsaWdubWVudCIsIkxFRlQiLCJDRU5URVIiLCJSSUdIVCIsIlZlcnRpY2FsVGV4dEFsaWdubWVudCIsIlRPUCIsImJsYW5rIiwiQk9UVE9NIiwibmV3V2lkdGgiLCJuZXdIZWlnaHQiLCJyb3RhdGVkIiwic2NhbGUiLCJBc3NlbWJsZXIyRCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7Ozs7O0FBRUEsSUFBTUEsU0FBUyxHQUFHQyxPQUFPLENBQUMsMkJBQUQsQ0FBekI7O0FBQ0EsSUFBTUMsS0FBSyxHQUFHRCxPQUFPLENBQUMsMkJBQUQsQ0FBckI7O0FBQ0EsSUFBTUUsS0FBSyxHQUFHRixPQUFPLENBQUMsNkJBQUQsQ0FBckI7O0FBQ0EsSUFBTUcsUUFBUSxHQUFHRCxLQUFLLENBQUNDLFFBQXZCOztBQUVBLElBQU1DLGNBQWMsR0FBR0osT0FBTyxDQUFDLFVBQUQsQ0FBUCxDQUFvQkksY0FBM0M7O0FBRUEsSUFBSUMsVUFBVSxHQUFHLFNBQWJBLFVBQWEsR0FBVztBQUN4QixpQkFBWSxFQUFaO0FBQ0EsT0FBS0MsS0FBTCxHQUFhLElBQWI7QUFDQSxPQUFLQyxDQUFMLEdBQVMsQ0FBVDtBQUNBLE9BQUtDLENBQUwsR0FBUyxDQUFUO0FBQ0EsT0FBS0MsSUFBTCxHQUFZLENBQVo7QUFDQSxPQUFLQyxJQUFMLEdBQVksRUFBWjtBQUNILENBUEQ7O0FBU0EsSUFBSUMsUUFBUSxHQUFHQyxFQUFFLENBQUNDLElBQUgsRUFBZjs7QUFFQSxJQUFJQyxLQUFLLEdBQUcsSUFBWjtBQUVBLElBQUlDLG1CQUFtQixHQUFHLEVBQTFCO0FBQ0EsSUFBSUMsWUFBWSxHQUFHLEVBQW5CO0FBQ0EsSUFBSUMsV0FBVyxHQUFHLEVBQWxCO0FBQ0EsSUFBSUMsYUFBYSxHQUFHLEVBQXBCO0FBRUEsSUFBSUMsVUFBVSxHQUFHLElBQWpCO0FBQ0EsSUFBSUMsY0FBYyxHQUFHLENBQXJCO0FBQ0EsSUFBSUMsa0JBQWtCLEdBQUksQ0FBMUI7QUFDQSxJQUFJQyxjQUFjLEdBQUksQ0FBdEI7QUFDQSxJQUFJQyxhQUFhLEdBQUksQ0FBckI7QUFFQSxJQUFJQyxnQkFBZ0IsR0FBSSxDQUF4QjtBQUNBLElBQUlDLFlB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NkMsTUFEN0I7O0FBR0EsUUFBSXBDLFNBQVMsS0FBS25DLFFBQVEsQ0FBQ3lFLGFBQTNCLEVBQTBDO0FBQ3RDZ0ksTUFBQUEsU0FBUyxHQUFHLENBQVo7QUFDSDs7QUFFRCxRQUFJdEssU0FBUyxLQUFLbkMsUUFBUSxDQUFDd0UsSUFBM0IsRUFBaUM7QUFDN0JnSSxNQUFBQSxRQUFRLEdBQUcsQ0FBWDtBQUNBQyxNQUFBQSxTQUFTLEdBQUcsQ0FBWjtBQUNIOztBQUVEcEssSUFBQUEsV0FBVyxHQUFHbUssUUFBZDtBQUNBbEssSUFBQUEsWUFBWSxHQUFHbUssU0FBZjtBQUNBbEssSUFBQUEsYUFBYSxHQUFHaUssUUFBaEI7QUFDSDs7U0FFRHBKLG1CQUFBLDRCQUFtQixDQUFFOztTQUVyQmlJLGFBQUEsb0JBQVkzSSxJQUFaLEVBQWtCd0gsT0FBbEIsRUFBMkJ4SixJQUEzQixFQUFpQ2dNLE9BQWpDLEVBQTBDdE0sQ0FBMUMsRUFBNkNDLENBQTdDLEVBQWdEc00sS0FBaEQsRUFBdUQsQ0FBRTs7U0FDekRyQixnQkFBQSx1QkFBZTVJLElBQWYsRUFBcUIsQ0FBRTs7U0FFdkJFLGdCQUFBLHlCQUFpQixDQUFFOzs7RUEzbEJzQmdLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IEFzc2VtYmxlcjJEIGZyb20gJy4uLy4uL2Fzc2VtYmxlci0yZCc7XG5cbmNvbnN0IHRleHRVdGlscyA9IHJlcXVpcmUoJy4uLy4uLy4uL3V0aWxzL3RleHQtdXRpbHMnKTtcbmNvbnN0IG1hY3JvID0gcmVxdWlyZSgnLi4vLi4vLi4vcGxhdGZvcm0vQ0NNYWNybycpO1xuY29uc3QgTGFiZWwgPSByZXF1aXJlKCcuLi8uLi8uLi9jb21wb25lbnRzL0NDTGFiZWwnKTtcbmNvbnN0IE92ZXJmbG93ID0gTGFiZWwuT3ZlcmZsb3c7XG5cbmNvbnN0IHNoYXJlTGFiZWxJbmZvID0gcmVxdWlyZSgnLi4vdXRpbHMnKS5zaGFyZUxhYmVsSW5mbztcblxubGV0IExldHRlckluZm8gPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNoYXIgPSAnJztcbiAgICB0aGlzLnZhbGlkID0gdHJ1ZTtcbiAgICB0aGlzLnggPSAwO1xuICAgIHRoaXMueSA9IDA7XG4gICAgdGhpcy5saW5lID0gMDtcbiAgICB0aGlzLmhhc2ggPSBcIlwiO1xufTtcblxubGV0IF90bXBSZWN0ID0gY2MucmVjdCgpO1xuXG5sZXQgX2NvbXAgPSBudWxsO1xuXG5sZXQgX2hvcml6b250YWxLZXJuaW5ncyA9IFtdO1xubGV0IF9sZXR0ZXJzSW5mbyA9IFtdO1xubGV0IF9saW5lc1dpZHRoID0gW107XG5sZXQgX2xpbmVzT2Zmc2V0WCA9IFtdO1xuXG5sZXQgX2ZudENvbmZpZyA9IG51bGw7XG5sZXQgX251bWJlck9mTGluZXMgPSAwO1xubGV0IF90ZXh0RGVzaXJlZEhlaWdodCA9ICAwO1xubGV0IF9sZXR0ZXJPZmZzZXRZID0gIDA7XG5sZXQgX3RhaWxvcmVkVG9wWSA9ICAwO1xuXG5sZXQgX3RhaWxvcmVkQm90dG9tWSA9ICAwO1xubGV0IF9ibWZvbnRTY2FsZSA9ICAxLjA7XG5cbmxldCBfbGluZUJyZWFrV2l0aG91dFNwYWNlcyA9ICBmYWxzZTtcbmxldCBfc3ByaXRlRnJhbWUgPSBudWxsO1xubGV0IF9saW5lU3BhY2luZyA9IDA7XG5sZXQgX2NvbnRlbnRTaXplID0gY2Muc2l6ZSgpO1xubGV0IF9zdHJpbmcgPSAnJztcbmxldCBfZm9udFNpemUgPSAwO1xubGV0IF9vcmlnaW5Gb250U2l6ZSA9IDA7XG5sZXQgX2hBbGlnbiA9IDA7XG5sZXQgX3ZBbGlnbiA9IDA7XG5sZXQgX3NwYWNpbmdYID0gMDtcbmxldCBfbGluZUhlaWdodCA9IDA7XG5sZXQgX292ZXJmbG93ID0gMDtcbmxldCBfaXNXcmFwVGV4dCA9IGZhbHNlO1xubGV0IF9sYWJlbFdpZHRoID0gMDtcbmxldCBfbGFiZWxIZWlnaHQgPSAwO1xubGV0IF9tYXhMaW5lV2lkdGggPSAwO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCbWZvbnRBc3NlbWJsZXIgZXh0ZW5kcyBBc3NlbWJsZXIyRCB7XG4gICAgdXBkYXRlUmVuZGVyRGF0YSAoY29tcCkge1xuICAgICAgICBpZiAoIWNvbXAuX3ZlcnRzRGlydHkpIHJldHVybjtcbiAgICAgICAgaWYgKF9jb21wID09PSBjb21wKSByZXR1cm47XG5cbiAgICAgICAgX2NvbXAgPSBjb21wO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5fcmVzZXJ2ZVF1YWRzKGNvbXAsIGNvbXAuc3RyaW5nLnRvU3RyaW5nKCkubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlRm9udEZhbWlseShjb21wKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlUHJvcGVydGllcyhjb21wKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlTGFiZWxJbmZvKGNvbXApO1xuICAgICAgICB0aGlzLl91cGRhdGVDb250ZW50KCk7XG4gICAgICAgIHRoaXMudXBkYXRlV29ybGRWZXJ0cyhjb21wKTtcbiAgICAgICAgXG4gICAgICAgIF9jb21wLl9hY3R1YWxGb250U2l6ZSA9IF9mb250U2l6ZTtcbiAgICAgICAgX2NvbXAubm9kZS5zZXRDb250ZW50U2l6ZShfY29udGVudFNpemUpO1xuXG4gICAgICAgIF9jb21wLl92ZXJ0c0RpcnR5ID0gZmFsc2U7XG4gICAgICAgIF9jb21wID0gbnVsbDtcbiAgICAgICAgdGhpcy5fcmVzZXRQcm9wZXJ0aWVzKCk7XG4gICAgfVxuXG4gICAgX3VwZGF0ZUZvbnRTY2FsZSAoKSB7XG4gICAgICAgIF9ibWZvbnRTY2FsZSA9IF9mb250U2l6ZSAvIF9vcmlnaW5Gb250U2l6ZTtcbiAgICB9XG5cbiAgICBfdXBkYXRlRm9udEZhbWlseSAoY29tcCkge1xuICAgICAgICBsZXQgZm9udEFzc2V0ID0gY29tcC5mb250O1xuICAgICAgICBfc3ByaXRlRnJhbWUgPSBmb250QXNzZXQuc3ByaXRlRnJhbWU7XG4gICAgICAgIF9mbnRDb25maWcgPSBmb250QXNzZXQuX2ZudENvbmZpZztcbiAgICAgICAgc2hhcmVMYWJlbEluZm8uZm9udEF0bGFzID0gZm9udEFzc2V0Ll9mb250RGVmRGljdGlvbmFyeTtcblxuICAgICAgICB0aGlzLnBhY2tUb0R5bmFtaWNBdGxhcyhjb21wLCBfc3ByaXRlRnJhbWUpO1xuICAgIH1cblxuICAgIF91cGRhdGVMYWJlbEluZm8oKSB7XG4gICAgICAgIC8vIGNsZWFyXG4gICAgICAgIHNoYXJlTGFiZWxJbmZvLmhhc2ggPSBcIlwiO1xuICAgICAgICBzaGFyZUxhYmVsSW5mby5tYXJnaW4gPSAwO1xuICAgIH1cblxuICAgIF91cGRhdGVQcm9wZXJ0aWVzIChjb21wKSB7XG4gICAgICAgIF9zdHJpbmcgPSBjb21wLnN0cmluZy50b1N0cmluZygpO1xuICAgICAgICBfZm9udFNpemUgPSBjb21wLmZvbnRTaXplO1xuICAgICAgICBfb3JpZ2luRm9udFNpemUgPSBfZm50Q29uZmlnID8gX2ZudENvbmZpZy5mb250U2l6ZSA6IGNvbXAuZm9udFNpemU7XG4gICAgICAgIF9oQWxpZ24gPSBjb21wLmhvcml6b250YWxBbGlnbjtcbiAgICAgICAgX3ZBbGlnbiA9IGNvbXAudmVydGljYWxBbGlnbjtcbiAgICAgICAgX3NwYWNpbmdYID0gY29tcC5zcGFjaW5nWDtcbiAgICAgICAgX292ZXJmbG93ID0gY29tcC5vdmVyZmxvdztcbiAgICAgICAgX2xpbmVIZWlnaHQgPSBjb21wLl9saW5lSGVpZ2h0O1xuICAgICAgICBcbiAgICAgICAgX2NvbnRlbnRTaXplLndpZHRoID0gY29tcC5ub2RlLndpZHRoO1xuICAgICAgICBfY29udGVudFNpemUuaGVpZ2h0ID0gY29tcC5ub2RlLmhlaWdodDtcblxuICAgICAgICAvLyBzaG91bGQgd3JhcCB0ZXh0XG4gICAgICAgIGlmIChfb3ZlcmZsb3cgPT09IE92ZXJmbG93Lk5PTkUpIHtcbiAgICAgICAgICAgIF9pc1dyYXBUZXh0ID0gZmFsc2U7XG4gICAgICAgICAgICBfY29udGVudFNpemUud2lkdGggKz0gc2hhcmVMYWJlbEluZm8ubWFyZ2luICogMjtcbiAgICAgICAgICAgIF9jb250ZW50U2l6ZS5oZWlnaHQgKz0gc2hhcmVMYWJlbEluZm8ubWFyZ2luICogMjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChfb3ZlcmZsb3cgPT09IE92ZXJmbG93LlJFU0laRV9IRUlHSFQpIHtcbiAgICAgICAgICAgIF9pc1dyYXBUZXh0ID0gdHJ1ZTtcbiAgICAgICAgICAgIF9jb250ZW50U2l6ZS5oZWlnaHQgKz0gc2hhcmVMYWJlbEluZm8ubWFyZ2luICogMjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIF9pc1dyYXBUZXh0ID0gY29tcC5lbmFibGVXcmFwVGV4dDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgc2hhcmVMYWJlbEluZm8ubGluZUhlaWdodCA9IF9saW5lSGVpZ2h0O1xuICAgICAgICBzaGFyZUxhYmVsSW5mby5mb250U2l6ZSA9IF9mb250U2l6ZTtcblxuICAgICAgICB0aGlzLl9zZXR1cEJNRm9udE92ZXJmbG93TWV0cmljcygpO1xuICAgIH1cblxuICAgIF9yZXNldFByb3BlcnRpZXMgKCkge1xuICAgICAgICBfZm50Q29uZmlnID0gbnVsbDtcbiAgICAgICAgX3Nwcml0ZUZyYW1lID0gbnVsbDtcbiAgICAgICAgc2hhcmVMYWJlbEluZm8uaGFzaCA9IFwiXCI7XG4gICAgICAgIHNoYXJlTGFiZWxJbmZvLm1hcmdpbiA9IDA7XG4gICAgfVxuXG4gICAgX3VwZGF0ZUNvbnRlbnQgKCkge1xuICAgICAgICB0aGlzLl91cGRhdGVGb250U2NhbGUoKTtcbiAgICAgICAgdGhpcy5fY29tcHV0ZUhvcml6b250YWxLZXJuaW5nRm9yVGV4dCgpO1xuICAgICAgICB0aGlzLl9hbGlnblRleHQoKTtcbiAgICB9XG5cbiAgICBfY29tcHV0ZUhvcml6b250YWxLZXJuaW5nRm9yVGV4dCAoKSB7XG4gICAgICAgIGxldCBzdHJpbmcgPSBfc3RyaW5nO1xuICAgICAgICBsZXQgc3RyaW5nTGVuID0gc3RyaW5nLmxlbmd0aDtcblxuICAgICAgICBsZXQga2VybmluZ0RpY3QgPSBfZm50Q29uZmlnLmtlcm5pbmdEaWN0O1xuICAgICAgICBsZXQgaG9yaXpvbnRhbEtlcm5pbmdzID0gX2hvcml6b250YWxLZXJuaW5ncztcblxuICAgICAgICBsZXQgcHJldiA9IC0xO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0cmluZ0xlbjsgKytpKSB7XG4gICAgICAgICAgICBsZXQga2V5ID0gc3RyaW5nLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgICAgICBsZXQga2VybmluZ0Ftb3VudCA9IGtlcm5pbmdEaWN0WyhwcmV2IDw8IDE2KSB8IChrZXkgJiAweGZmZmYpXSB8fCAwO1xuICAgICAgICAgICAgaWYgKGkgPCBzdHJpbmdMZW4gLSAxKSB7XG4gICAgICAgICAgICAgICAgaG9yaXpvbnRhbEtlcm5pbmdzW2ldID0ga2VybmluZ0Ftb3VudDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaG9yaXpvbnRhbEtlcm5pbmdzW2ldID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByZXYgPSBrZXk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfbXVsdGlsaW5lVGV4dFdyYXAgKG5leHRUb2tlbkZ1bmMpIHtcbiAgICAgICAgbGV0IHRleHRMZW4gPSBfc3RyaW5nLmxlbmd0aDtcblxuICAgICAgICBsZXQgbGluZUluZGV4ID0gMDtcbiAgICAgICAgbGV0IG5leHRUb2tlblggPSAwO1xuICAgICAgICBsZXQgbmV4dFRva2VuWSA9IDA7XG4gICAgICAgIGxldCBsb25nZXN0TGluZSA9IDA7XG4gICAgICAgIGxldCBsZXR0ZXJSaWdodCA9IDA7XG5cbiAgICAgICAgbGV0IGhpZ2hlc3RZID0gMDtcbiAgICAgICAgbGV0IGxvd2VzdFkgPSAwO1xuICAgICAgICBsZXQgbGV0dGVyRGVmID0gbnVsbDtcbiAgICAgICAgbGV0IGxldHRlclBvc2l0aW9uID0gY2MudjIoMCwgMCk7XG5cbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRleHRMZW47KSB7XG4gICAgICAgICAgICBsZXQgY2hhcmFjdGVyID0gX3N0cmluZy5jaGFyQXQoaW5kZXgpO1xuICAgICAgICAgICAgaWYgKGNoYXJhY3RlciA9PT0gXCJcXG5cIikge1xuICAgICAgICAgICAgICAgIF9saW5lc1dpZHRoLnB1c2gobGV0dGVyUmlnaHQpO1xuICAgICAgICAgICAgICAgIGxldHRlclJpZ2h0ID0gMDtcbiAgICAgICAgICAgICAgICBsaW5lSW5kZXgrKztcbiAgICAgICAgICAgICAgICBuZXh0VG9rZW5YID0gMDtcbiAgICAgICAgICAgICAgICBuZXh0VG9rZW5ZIC09IF9saW5lSGVpZ2h0ICogdGhpcy5fZ2V0Rm9udFNjYWxlKCkgKyBfbGluZVNwYWNpbmc7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjb3JkUGxhY2Vob2xkZXJJbmZvKGluZGV4LCBjaGFyYWN0ZXIpO1xuICAgICAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB0b2tlbkxlbiA9IG5leHRUb2tlbkZ1bmMoX3N0cmluZywgaW5kZXgsIHRleHRMZW4pO1xuICAgICAgICAgICAgbGV0IHRva2VuSGlnaGVzdFkgPSBoaWdoZXN0WTtcbiAgICAgICAgICAgIGxldCB0b2tlbkxvd2VzdFkgPSBsb3dlc3RZO1xuICAgICAgICAgICAgbGV0IHRva2VuUmlnaHQgPSBsZXR0ZXJSaWdodDtcbiAgICAgICAgICAgIGxldCBuZXh0TGV0dGVyWCA9IG5leHRUb2tlblg7XG4gICAgICAgICAgICBsZXQgbmV3TGluZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICBmb3IgKGxldCB0bXAgPSAwOyB0bXAgPCB0b2tlbkxlbjsgKyt0bXApIHtcbiAgICAgICAgICAgICAgICBsZXQgbGV0dGVySW5kZXggPSBpbmRleCArIHRtcDtcbiAgICAgICAgICAgICAgICBjaGFyYWN0ZXIgPSBfc3RyaW5nLmNoYXJBdChsZXR0ZXJJbmRleCk7XG4gICAgICAgICAgICAgICAgaWYgKGNoYXJhY3RlciA9PT0gXCJcXHJcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZWNvcmRQbGFjZWhvbGRlckluZm8obGV0dGVySW5kZXgsIGNoYXJhY3Rlcik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXR0ZXJEZWYgPSBzaGFyZUxhYmVsSW5mby5mb250QXRsYXMuZ2V0TGV0dGVyRGVmaW5pdGlvbkZvckNoYXIoY2hhcmFjdGVyLCBzaGFyZUxhYmVsSW5mbyk7XG4gICAgICAgICAgICAgICAgaWYgKCFsZXR0ZXJEZWYpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVjb3JkUGxhY2Vob2xkZXJJbmZvKGxldHRlckluZGV4LCBjaGFyYWN0ZXIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNhbid0IGZpbmQgbGV0dGVyIGRlZmluaXRpb24gaW4gdGV4dHVyZSBhdGxhcyBcIiArIF9mbnRDb25maWcuYXRsYXNOYW1lICsgXCIgZm9yIGxldHRlcjpcIiArIGNoYXJhY3Rlcik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBsZXR0ZXJYID0gbmV4dExldHRlclggKyBsZXR0ZXJEZWYub2Zmc2V0WCAqIF9ibWZvbnRTY2FsZSAtIHNoYXJlTGFiZWxJbmZvLm1hcmdpbjtcblxuICAgICAgICAgICAgICAgIGlmIChfaXNXcmFwVGV4dFxuICAgICAgICAgICAgICAgICAgICAmJiBfbWF4TGluZVdpZHRoID4gMFxuICAgICAgICAgICAgICAgICAgICAmJiBuZXh0VG9rZW5YID4gMFxuICAgICAgICAgICAgICAgICAgICAmJiBsZXR0ZXJYICsgbGV0dGVyRGVmLncgKiBfYm1mb250U2NhbGUgPiBfbWF4TGluZVdpZHRoXG4gICAgICAgICAgICAgICAgICAgICYmICF0ZXh0VXRpbHMuaXNVbmljb2RlU3BhY2UoY2hhcmFjdGVyKSkge1xuICAgICAgICAgICAgICAgICAgICBfbGluZXNXaWR0aC5wdXNoKGxldHRlclJpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgbGV0dGVyUmlnaHQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBsaW5lSW5kZXgrKztcbiAgICAgICAgICAgICAgICAgICAgbmV4dFRva2VuWCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIG5leHRUb2tlblkgLT0gKF9saW5lSGVpZ2h0ICogdGhpcy5fZ2V0Rm9udFNjYWxlKCkgKyBfbGluZVNwYWNpbmcpO1xuICAgICAgICAgICAgICAgICAgICBuZXdMaW5lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0dGVyUG9zaXRpb24ueCA9IGxldHRlclg7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0dGVyUG9zaXRpb24ueSA9IG5leHRUb2tlblkgLSBsZXR0ZXJEZWYub2Zmc2V0WSAqIF9ibWZvbnRTY2FsZSAgKyBzaGFyZUxhYmVsSW5mby5tYXJnaW47XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjb3JkTGV0dGVySW5mbyhsZXR0ZXJQb3NpdGlvbiwgY2hhcmFjdGVyLCBsZXR0ZXJJbmRleCwgbGluZUluZGV4KTtcblxuICAgICAgICAgICAgICAgIGlmIChsZXR0ZXJJbmRleCArIDEgPCBfaG9yaXpvbnRhbEtlcm5pbmdzLmxlbmd0aCAmJiBsZXR0ZXJJbmRleCA8IHRleHRMZW4gLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHRMZXR0ZXJYICs9IF9ob3Jpem9udGFsS2VybmluZ3NbbGV0dGVySW5kZXggKyAxXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBuZXh0TGV0dGVyWCArPSBsZXR0ZXJEZWYueEFkdmFuY2UgKiBfYm1mb250U2NhbGUgKyBfc3BhY2luZ1ggIC0gc2hhcmVMYWJlbEluZm8ubWFyZ2luICogMjtcblxuICAgICAgICAgICAgICAgIHRva2VuUmlnaHQgPSBsZXR0ZXJQb3NpdGlvbi54ICsgbGV0dGVyRGVmLncgKiBfYm1mb250U2NhbGUgIC0gc2hhcmVMYWJlbEluZm8ubWFyZ2luO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuSGlnaGVzdFkgPCBsZXR0ZXJQb3NpdGlvbi55KSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuSGlnaGVzdFkgPSBsZXR0ZXJQb3NpdGlvbi55O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0b2tlbkxvd2VzdFkgPiBsZXR0ZXJQb3NpdGlvbi55IC0gbGV0dGVyRGVmLmggKiBfYm1mb250U2NhbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5Mb3dlc3RZID0gbGV0dGVyUG9zaXRpb24ueSAtIGxldHRlckRlZi5oICogX2JtZm9udFNjYWxlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSAvL2VuZCBvZiBmb3IgbG9vcFxuXG4gICAgICAgICAgICBpZiAobmV3TGluZSkgY29udGludWU7XG5cbiAgICAgICAgICAgIG5leHRUb2tlblggPSBuZXh0TGV0dGVyWDtcbiAgICAgICAgICAgIGxldHRlclJpZ2h0ID0gdG9rZW5SaWdodDtcblxuICAgICAgICAgICAgaWYgKGhpZ2hlc3RZIDwgdG9rZW5IaWdoZXN0WSkge1xuICAgICAgICAgICAgICAgIGhpZ2hlc3RZID0gdG9rZW5IaWdoZXN0WTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsb3dlc3RZID4gdG9rZW5Mb3dlc3RZKSB7XG4gICAgICAgICAgICAgICAgbG93ZXN0WSA9IHRva2VuTG93ZXN0WTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsb25nZXN0TGluZSA8IGxldHRlclJpZ2h0KSB7XG4gICAgICAgICAgICAgICAgbG9uZ2VzdExpbmUgPSBsZXR0ZXJSaWdodDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaW5kZXggKz0gdG9rZW5MZW47XG4gICAgICAgIH0gLy9lbmQgb2YgZm9yIGxvb3BcblxuICAgICAgICBfbGluZXNXaWR0aC5wdXNoKGxldHRlclJpZ2h0KTtcblxuICAgICAgICBfbnVtYmVyT2ZMaW5lcyA9IGxpbmVJbmRleCArIDE7XG4gICAgICAgIF90ZXh0RGVzaXJlZEhlaWdodCA9IF9udW1iZXJPZkxpbmVzICogX2xpbmVIZWlnaHQgKiB0aGlzLl9nZXRGb250U2NhbGUoKTtcbiAgICAgICAgaWYgKF9udW1iZXJPZkxpbmVzID4gMSkge1xuICAgICAgICAgICAgX3RleHREZXNpcmVkSGVpZ2h0ICs9IChfbnVtYmVyT2ZMaW5lcyAtIDEpICogX2xpbmVTcGFjaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgX2NvbnRlbnRTaXplLndpZHRoID0gX2xhYmVsV2lkdGg7XG4gICAgICAgIF9jb250ZW50U2l6ZS5oZWlnaHQgPSBfbGFiZWxIZWlnaHQ7XG4gICAgICAgIGlmIChfbGFiZWxXaWR0aCA8PSAwKSB7XG4gICAgICAgICAgICBfY29udGVudFNpemUud2lkdGggPSBwYXJzZUZsb2F0KGxvbmdlc3RMaW5lLnRvRml4ZWQoMikpICsgc2hhcmVMYWJlbEluZm8ubWFyZ2luICogMjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoX2xhYmVsSGVpZ2h0IDw9IDApIHtcbiAgICAgICAgICAgIF9jb250ZW50U2l6ZS5oZWlnaHQgPSBwYXJzZUZsb2F0KF90ZXh0RGVzaXJlZEhlaWdodC50b0ZpeGVkKDIpKSArIHNoYXJlTGFiZWxJbmZvLm1hcmdpbiAqIDI7XG4gICAgICAgIH1cblxuICAgICAgICBfdGFpbG9yZWRUb3BZID0gX2NvbnRlbnRTaXplLmhlaWdodDtcbiAgICAgICAgX3RhaWxvcmVkQm90dG9tWSA9IDA7XG5cbiAgICAgICAgaWYgKF9vdmVyZmxvdyAhPT0gT3ZlcmZsb3cuQ0xBTVApIHtcbiAgICAgICAgICAgIGlmIChoaWdoZXN0WSA+IDApIHtcbiAgICAgICAgICAgICAgICBfdGFpbG9yZWRUb3BZID0gX2NvbnRlbnRTaXplLmhlaWdodCArIGhpZ2hlc3RZO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgaWYgKGxvd2VzdFkgPCAtX3RleHREZXNpcmVkSGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgX3RhaWxvcmVkQm90dG9tWSA9IF90ZXh0RGVzaXJlZEhlaWdodCArIGxvd2VzdFk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBfZ2V0Rmlyc3RDaGFyTGVuICgpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuXG4gICAgX2dldEZvbnRTY2FsZSAoKSB7XG4gICAgICAgIHJldHVybiBfb3ZlcmZsb3cgPT09IE92ZXJmbG93LlNIUklOSyA/IF9ibWZvbnRTY2FsZSA6IDE7XG4gICAgfVxuXG4gICAgX2dldEZpcnN0V29yZExlbiAodGV4dCwgc3RhcnRJbmRleCwgdGV4dExlbikge1xuICAgICAgICBsZXQgY2hhcmFjdGVyID0gdGV4dC5jaGFyQXQoc3RhcnRJbmRleCk7XG4gICAgICAgIGlmICh0ZXh0VXRpbHMuaXNVbmljb2RlQ0pLKGNoYXJhY3RlcilcbiAgICAgICAgICAgIHx8IGNoYXJhY3RlciA9PT0gXCJcXG5cIlxuICAgICAgICAgICAgfHwgdGV4dFV0aWxzLmlzVW5pY29kZVNwYWNlKGNoYXJhY3RlcikpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGxlbiA9IDE7XG4gICAgICAgIGxldCBsZXR0ZXJEZWYgPSBzaGFyZUxhYmVsSW5mby5mb250QXRsYXMuZ2V0TGV0dGVyRGVmaW5pdGlvbkZvckNoYXIoY2hhcmFjdGVyLCBzaGFyZUxhYmVsSW5mbyk7XG4gICAgICAgIGlmICghbGV0dGVyRGVmKSB7XG4gICAgICAgICAgICByZXR1cm4gbGVuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBuZXh0TGV0dGVyWCA9IGxldHRlckRlZi54QWR2YW5jZSAqIF9ibWZvbnRTY2FsZSArIF9zcGFjaW5nWDtcbiAgICAgICAgbGV0IGxldHRlclg7XG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gc3RhcnRJbmRleCArIDE7IGluZGV4IDwgdGV4dExlbjsgKytpbmRleCkge1xuICAgICAgICAgICAgY2hhcmFjdGVyID0gdGV4dC5jaGFyQXQoaW5kZXgpO1xuXG4gICAgICAgICAgICBsZXR0ZXJEZWYgPSBzaGFyZUxhYmVsSW5mby5mb250QXRsYXMuZ2V0TGV0dGVyRGVmaW5pdGlvbkZvckNoYXIoY2hhcmFjdGVyLCBzaGFyZUxhYmVsSW5mbyk7XG4gICAgICAgICAgICBpZiAoIWxldHRlckRlZikge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0dGVyWCA9IG5leHRMZXR0ZXJYICsgbGV0dGVyRGVmLm9mZnNldFggKiBfYm1mb250U2NhbGU7XG5cbiAgICAgICAgICAgIGlmKGxldHRlclggKyBsZXR0ZXJEZWYudyAqIF9ibWZvbnRTY2FsZSA+IF9tYXhMaW5lV2lkdGhcbiAgICAgICAgICAgICAgICYmICF0ZXh0VXRpbHMuaXNVbmljb2RlU3BhY2UoY2hhcmFjdGVyKVxuICAgICAgICAgICAgICAgJiYgX21heExpbmVXaWR0aCA+IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV4dExldHRlclggKz0gbGV0dGVyRGVmLnhBZHZhbmNlICogX2JtZm9udFNjYWxlICsgX3NwYWNpbmdYO1xuICAgICAgICAgICAgaWYgKGNoYXJhY3RlciA9PT0gXCJcXG5cIlxuICAgICAgICAgICAgICAgIHx8IHRleHRVdGlscy5pc1VuaWNvZGVTcGFjZShjaGFyYWN0ZXIpXG4gICAgICAgICAgICAgICAgfHwgdGV4dFV0aWxzLmlzVW5pY29kZUNKSyhjaGFyYWN0ZXIpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZW4rKztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsZW47XG4gICAgfVxuXG4gICAgX211bHRpbGluZVRleHRXcmFwQnlXb3JkICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX211bHRpbGluZVRleHRXcmFwKHRoaXMuX2dldEZpcnN0V29yZExlbik7XG4gICAgfVxuXG4gICAgX211bHRpbGluZVRleHRXcmFwQnlDaGFyICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX211bHRpbGluZVRleHRXcmFwKHRoaXMuX2dldEZpcnN0Q2hhckxlbik7XG4gICAgfVxuXG4gICAgX3JlY29yZFBsYWNlaG9sZGVySW5mbyAobGV0dGVySW5kZXgsIGNoYXIpIHtcbiAgICAgICAgaWYgKGxldHRlckluZGV4ID49IF9sZXR0ZXJzSW5mby5sZW5ndGgpIHtcbiAgICAgICAgICAgIGxldCB0bXBJbmZvID0gbmV3IExldHRlckluZm8oKTtcbiAgICAgICAgICAgIF9sZXR0ZXJzSW5mby5wdXNoKHRtcEluZm8pO1xuICAgICAgICB9XG5cbiAgICAgICAgX2xldHRlcnNJbmZvW2xldHRlckluZGV4XS5jaGFyID0gY2hhcjtcbiAgICAgICAgX2xldHRlcnNJbmZvW2xldHRlckluZGV4XS5oYXNoID0gY2hhci5jaGFyQ29kZUF0KDApICsgc2hhcmVMYWJlbEluZm8uaGFzaDtcbiAgICAgICAgX2xldHRlcnNJbmZvW2xldHRlckluZGV4XS52YWxpZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIF9yZWNvcmRMZXR0ZXJJbmZvIChsZXR0ZXJQb3NpdGlvbiwgY2hhcmFjdGVyLCBsZXR0ZXJJbmRleCwgbGluZUluZGV4KSB7XG4gICAgICAgIGlmIChsZXR0ZXJJbmRleCA+PSBfbGV0dGVyc0luZm8ubGVuZ3RoKSB7XG4gICAgICAgICAgICBsZXQgdG1wSW5mbyA9IG5ldyBMZXR0ZXJJbmZvKCk7XG4gICAgICAgICAgICBfbGV0dGVyc0luZm8ucHVzaCh0bXBJbmZvKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY2hhciA9IGNoYXJhY3Rlci5jaGFyQ29kZUF0KDApO1xuICAgICAgICBsZXQga2V5ID0gY2hhciArIHNoYXJlTGFiZWxJbmZvLmhhc2g7XG5cbiAgICAgICAgX2xldHRlcnNJbmZvW2xldHRlckluZGV4XS5saW5lPSBsaW5lSW5kZXg7XG4gICAgICAgIF9sZXR0ZXJzSW5mb1tsZXR0ZXJJbmRleF0uY2hhciA9IGNoYXJhY3RlcjtcbiAgICAgICAgX2xldHRlcnNJbmZvW2xldHRlckluZGV4XS5oYXNoID0ga2V5O1xuICAgICAgICBfbGV0dGVyc0luZm9bbGV0dGVySW5kZXhdLnZhbGlkID0gc2hhcmVMYWJlbEluZm8uZm9udEF0bGFzLmdldExldHRlcihrZXkpLnZhbGlkO1xuICAgICAgICBfbGV0dGVyc0luZm9bbGV0dGVySW5kZXhdLnggPSBsZXR0ZXJQb3NpdGlvbi54O1xuICAgICAgICBfbGV0dGVyc0luZm9bbGV0dGVySW5kZXhdLnkgPSBsZXR0ZXJQb3NpdGlvbi55O1xuICAgIH1cblxuICAgIF9hbGlnblRleHQgKCkge1xuICAgICAgICBfdGV4dERlc2lyZWRIZWlnaHQgPSAwO1xuICAgICAgICBfbGluZXNXaWR0aC5sZW5ndGggPSAwO1xuXG4gICAgICAgIGlmICghX2xpbmVCcmVha1dpdGhvdXRTcGFjZXMpIHtcbiAgICAgICAgICAgIHRoaXMuX211bHRpbGluZVRleHRXcmFwQnlXb3JkKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9tdWx0aWxpbmVUZXh0V3JhcEJ5Q2hhcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fY29tcHV0ZUFsaWdubWVudE9mZnNldCgpO1xuXG4gICAgICAgIC8vc2hyaW5rXG4gICAgICAgIGlmIChfb3ZlcmZsb3cgPT09IE92ZXJmbG93LlNIUklOSykge1xuICAgICAgICAgICAgaWYgKF9mb250U2l6ZSA+IDAgJiYgdGhpcy5faXNWZXJ0aWNhbENsYW1wKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zaHJpbmtMYWJlbFRvQ29udGVudFNpemUodGhpcy5faXNWZXJ0aWNhbENsYW1wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5fdXBkYXRlUXVhZHMoKSkge1xuICAgICAgICAgICAgaWYgKF9vdmVyZmxvdyA9PT0gT3ZlcmZsb3cuU0hSSU5LKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2hyaW5rTGFiZWxUb0NvbnRlbnRTaXplKHRoaXMuX2lzSG9yaXpvbnRhbENsYW1wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9zY2FsZUZvbnRTaXplRG93biAoZm9udFNpemUpIHtcbiAgICAgICAgbGV0IHNob3VsZFVwZGF0ZUNvbnRlbnQgPSB0cnVlO1xuICAgICAgICBpZiAoIWZvbnRTaXplKSB7XG4gICAgICAgICAgICBmb250U2l6ZSA9IDAuMTtcbiAgICAgICAgICAgIHNob3VsZFVwZGF0ZUNvbnRlbnQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBfZm9udFNpemUgPSBmb250U2l6ZTtcblxuICAgICAgICBpZiAoc2hvdWxkVXBkYXRlQ29udGVudCkge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlQ29udGVudCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3Nocmlua0xhYmVsVG9Db250ZW50U2l6ZSAobGFtYmRhKSB7XG4gICAgICAgIGxldCBmb250U2l6ZSA9IF9mb250U2l6ZTtcblxuICAgICAgICBsZXQgbGVmdCA9IDAsIHJpZ2h0ID0gZm9udFNpemUgfCAwLCBtaWQgPSAwO1xuICAgICAgICB3aGlsZSAobGVmdCA8IHJpZ2h0KSB7XG4gICAgICAgICAgICBtaWQgPSAobGVmdCArIHJpZ2h0ICsgMSkgPj4gMTtcblxuICAgICAgICAgICAgbGV0IG5ld0ZvbnRTaXplID0gbWlkO1xuICAgICAgICAgICAgaWYgKG5ld0ZvbnRTaXplIDw9IDApIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX2JtZm9udFNjYWxlID0gbmV3Rm9udFNpemUgLyBfb3JpZ2luRm9udFNpemU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghX2xpbmVCcmVha1dpdGhvdXRTcGFjZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tdWx0aWxpbmVUZXh0V3JhcEJ5V29yZCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tdWx0aWxpbmVUZXh0V3JhcEJ5Q2hhcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fY29tcHV0ZUFsaWdubWVudE9mZnNldCgpO1xuXG4gICAgICAgICAgICBpZiAobGFtYmRhKCkpIHtcbiAgICAgICAgICAgICAgICByaWdodCA9IG1pZCAtIDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxlZnQgPSBtaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYWN0dWFsRm9udFNpemUgPSBsZWZ0O1xuICAgICAgICBpZiAoYWN0dWFsRm9udFNpemUgPj0gMCkge1xuICAgICAgICAgICAgdGhpcy5fc2NhbGVGb250U2l6ZURvd24oYWN0dWFsRm9udFNpemUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2lzVmVydGljYWxDbGFtcCAoKSB7XG4gICAgICAgIGlmIChfdGV4dERlc2lyZWRIZWlnaHQgPiBfY29udGVudFNpemUuaGVpZ2h0KSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9pc0hvcml6b250YWxDbGFtcCAoKSB7XG4gICAgICAgIGxldCBsZXR0ZXJDbGFtcCA9IGZhbHNlO1xuICAgICAgICBmb3IgKGxldCBjdHIgPSAwLCBsID0gX3N0cmluZy5sZW5ndGg7IGN0ciA8IGw7ICsrY3RyKSB7XG4gICAgICAgICAgICBsZXQgbGV0dGVySW5mbyA9IF9sZXR0ZXJzSW5mb1tjdHJdO1xuICAgICAgICAgICAgaWYgKGxldHRlckluZm8udmFsaWQpIHtcbiAgICAgICAgICAgICAgICBsZXQgbGV0dGVyRGVmID0gc2hhcmVMYWJlbEluZm8uZm9udEF0bGFzLmdldExldHRlcihsZXR0ZXJJbmZvLmhhc2gpO1xuXG4gICAgICAgICAgICAgICAgbGV0IHB4ID0gbGV0dGVySW5mby54ICsgbGV0dGVyRGVmLncgKiBfYm1mb250U2NhbGU7XG4gICAgICAgICAgICAgICAgbGV0IGxpbmVJbmRleCA9IGxldHRlckluZm8ubGluZTtcbiAgICAgICAgICAgICAgICBpZiAoX2xhYmVsV2lkdGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghX2lzV3JhcFRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHB4ID4gX2NvbnRlbnRTaXplLndpZHRoKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJDbGFtcCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHdvcmRXaWR0aCA9IF9saW5lc1dpZHRoW2xpbmVJbmRleF07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod29yZFdpZHRoID4gX2NvbnRlbnRTaXplLndpZHRoICYmIChweCA+IF9jb250ZW50U2l6ZS53aWR0aCB8fCBweCA8IDApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyQ2xhbXAgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxldHRlckNsYW1wO1xuICAgIH1cblxuICAgIF9pc0hvcml6b250YWxDbGFtcGVkIChweCwgbGluZUluZGV4KSB7XG4gICAgICAgIGxldCB3b3JkV2lkdGggPSBfbGluZXNXaWR0aFtsaW5lSW5kZXhdO1xuICAgICAgICBsZXQgbGV0dGVyT3ZlckNsYW1wID0gKHB4ID4gX2NvbnRlbnRTaXplLndpZHRoIHx8IHB4IDwgMCk7XG5cbiAgICAgICAgaWYoIV9pc1dyYXBUZXh0KXtcbiAgICAgICAgICAgIHJldHVybiBsZXR0ZXJPdmVyQ2xhbXA7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgcmV0dXJuICh3b3JkV2lkdGggPiBfY29udGVudFNpemUud2lkdGggJiYgbGV0dGVyT3ZlckNsYW1wKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF91cGRhdGVRdWFkcyAoKSB7XG4gICAgICAgIGxldCB0ZXh0dXJlID0gX3Nwcml0ZUZyYW1lID8gX3Nwcml0ZUZyYW1lLl90ZXh0dXJlIDogc2hhcmVMYWJlbEluZm8uZm9udEF0bGFzLmdldFRleHR1cmUoKTtcblxuICAgICAgICBsZXQgbm9kZSA9IF9jb21wLm5vZGU7XG5cbiAgICAgICAgdGhpcy52ZXJ0aWNlc0NvdW50ID0gdGhpcy5pbmRpY2VzQ291bnQgPSAwO1xuICAgICAgICBcbiAgICAgICAgLy8gTmVlZCB0byByZXNldCBkYXRhTGVuZ3RoIGluIENhbnZhcyByZW5kZXJpbmcgbW9kZS5cbiAgICAgICAgdGhpcy5fcmVuZGVyRGF0YSAmJiAodGhpcy5fcmVuZGVyRGF0YS5kYXRhTGVuZ3RoID0gMCk7XG5cbiAgICAgICAgbGV0IGNvbnRlbnRTaXplID0gX2NvbnRlbnRTaXplLFxuICAgICAgICAgICAgYXBweCA9IG5vZGUuX2FuY2hvclBvaW50LnggKiBjb250ZW50U2l6ZS53aWR0aCxcbiAgICAgICAgICAgIGFwcHkgPSBub2RlLl9hbmNob3JQb2ludC55ICogY29udGVudFNpemUuaGVpZ2h0O1xuICAgICAgICBcbiAgICAgICAgbGV0IHJldCA9IHRydWU7XG4gICAgICAgIGZvciAobGV0IGN0ciA9IDAsIGwgPSBfc3RyaW5nLmxlbmd0aDsgY3RyIDwgbDsgKytjdHIpIHtcbiAgICAgICAgICAgIGxldCBsZXR0ZXJJbmZvID0gX2xldHRlcnNJbmZvW2N0cl07XG4gICAgICAgICAgICBpZiAoIWxldHRlckluZm8udmFsaWQpIGNvbnRpbnVlO1xuICAgICAgICAgICAgbGV0IGxldHRlckRlZiA9IHNoYXJlTGFiZWxJbmZvLmZvbnRBdGxhcy5nZXRMZXR0ZXIobGV0dGVySW5mby5oYXNoKTtcblxuICAgICAgICAgICAgX3RtcFJlY3QuaGVpZ2h0ID0gbGV0dGVyRGVmLmg7XG4gICAgICAgICAgICBfdG1wUmVjdC53aWR0aCA9IGxldHRlckRlZi53O1xuICAgICAgICAgICAgX3RtcFJlY3QueCA9IGxldHRlckRlZi51O1xuICAgICAgICAgICAgX3RtcFJlY3QueSA9IGxldHRlckRlZi52O1xuXG4gICAgICAgICAgICBsZXQgcHkgPSBsZXR0ZXJJbmZvLnkgKyBfbGV0dGVyT2Zmc2V0WTtcblxuICAgICAgICAgICAgaWYgKF9sYWJlbEhlaWdodCA+IDApIHtcbiAgICAgICAgICAgICAgICBpZiAocHkgPiBfdGFpbG9yZWRUb3BZKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjbGlwVG9wID0gcHkgLSBfdGFpbG9yZWRUb3BZO1xuICAgICAgICAgICAgICAgICAgICBfdG1wUmVjdC55ICs9IGNsaXBUb3A7XG4gICAgICAgICAgICAgICAgICAgIF90bXBSZWN0LmhlaWdodCAtPSBjbGlwVG9wO1xuICAgICAgICAgICAgICAgICAgICBweSA9IHB5IC0gY2xpcFRvcDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoKHB5IC0gbGV0dGVyRGVmLmggKiBfYm1mb250U2NhbGUgPCBfdGFpbG9yZWRCb3R0b21ZKSAmJiBfb3ZlcmZsb3cgPT09IE92ZXJmbG93LkNMQU1QKSB7XG4gICAgICAgICAgICAgICAgICAgIF90bXBSZWN0LmhlaWdodCA9IChweSA8IF90YWlsb3JlZEJvdHRvbVkpID8gMCA6IChweSAtIF90YWlsb3JlZEJvdHRvbVkpIC8gX2JtZm9udFNjYWxlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGxpbmVJbmRleCA9IGxldHRlckluZm8ubGluZTtcbiAgICAgICAgICAgIGxldCBweCA9IGxldHRlckluZm8ueCArIGxldHRlckRlZi53IC8gMiAqIF9ibWZvbnRTY2FsZSArIF9saW5lc09mZnNldFhbbGluZUluZGV4XTtcblxuICAgICAgICAgICAgaWYgKF9sYWJlbFdpZHRoID4gMCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pc0hvcml6b250YWxDbGFtcGVkKHB4LCBsaW5lSW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfb3ZlcmZsb3cgPT09IE92ZXJmbG93LkNMQU1QKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdG1wUmVjdC53aWR0aCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoX292ZXJmbG93ID09PSBPdmVyZmxvdy5TSFJJTkspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfY29udGVudFNpemUud2lkdGggPiBsZXR0ZXJEZWYudykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdG1wUmVjdC53aWR0aCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfdG1wUmVjdC5oZWlnaHQgPiAwICYmIF90bXBSZWN0LndpZHRoID4gMCkge1xuICAgICAgICAgICAgICAgIGxldCBpc1JvdGF0ZWQgPSB0aGlzLl9kZXRlcm1pbmVSZWN0KF90bXBSZWN0KTtcbiAgICAgICAgICAgICAgICBsZXQgbGV0dGVyUG9zaXRpb25YID0gbGV0dGVySW5mby54ICsgX2xpbmVzT2Zmc2V0WFtsZXR0ZXJJbmZvLmxpbmVdO1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwZW5kUXVhZChfY29tcCwgdGV4dHVyZSwgX3RtcFJlY3QsIGlzUm90YXRlZCwgbGV0dGVyUG9zaXRpb25YIC0gYXBweCwgcHkgLSBhcHB5LCBfYm1mb250U2NhbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3F1YWRzVXBkYXRlZChfY29tcCk7XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBfZGV0ZXJtaW5lUmVjdCAodGVtcFJlY3QpIHtcbiAgICAgICAgbGV0IGlzUm90YXRlZCA9IF9zcHJpdGVGcmFtZS5pc1JvdGF0ZWQoKTtcblxuICAgICAgICBsZXQgb3JpZ2luYWxTaXplID0gX3Nwcml0ZUZyYW1lLl9vcmlnaW5hbFNpemU7XG4gICAgICAgIGxldCByZWN0ID0gX3Nwcml0ZUZyYW1lLl9yZWN0O1xuICAgICAgICBsZXQgb2Zmc2V0ID0gX3Nwcml0ZUZyYW1lLl9vZmZzZXQ7XG4gICAgICAgIGxldCB0cmltbWVkTGVmdCA9IG9mZnNldC54ICsgKG9yaWdpbmFsU2l6ZS53aWR0aCAtIHJlY3Qud2lkdGgpIC8gMjtcbiAgICAgICAgbGV0IHRyaW1tZWRUb3AgPSBvZmZzZXQueSAtIChvcmlnaW5hbFNpemUuaGVpZ2h0IC0gcmVjdC5oZWlnaHQpIC8gMjtcblxuICAgICAgICBpZighaXNSb3RhdGVkKSB7XG4gICAgICAgICAgICB0ZW1wUmVjdC54ICs9IChyZWN0LnggLSB0cmltbWVkTGVmdCk7XG4gICAgICAgICAgICB0ZW1wUmVjdC55ICs9IChyZWN0LnkgKyB0cmltbWVkVG9wKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBvcmlnaW5hbFggPSB0ZW1wUmVjdC54O1xuICAgICAgICAgICAgdGVtcFJlY3QueCA9IHJlY3QueCArIHJlY3QuaGVpZ2h0IC0gdGVtcFJlY3QueSAtIHRlbXBSZWN0LmhlaWdodCAtIHRyaW1tZWRUb3A7XG4gICAgICAgICAgICB0ZW1wUmVjdC55ID0gb3JpZ2luYWxYICsgcmVjdC55IC0gdHJpbW1lZExlZnQ7XG4gICAgICAgICAgICBpZiAodGVtcFJlY3QueSA8IDApIHtcbiAgICAgICAgICAgICAgICB0ZW1wUmVjdC5oZWlnaHQgPSB0ZW1wUmVjdC5oZWlnaHQgKyB0cmltbWVkVG9wO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzUm90YXRlZDtcbiAgICB9XG5cbiAgICBfY29tcHV0ZUFsaWdubWVudE9mZnNldCAoKSB7XG4gICAgICAgIF9saW5lc09mZnNldFgubGVuZ3RoID0gMDtcbiAgICAgICAgXG4gICAgICAgIHN3aXRjaCAoX2hBbGlnbikge1xuICAgICAgICAgICAgY2FzZSBtYWNyby5UZXh0QWxpZ25tZW50LkxFRlQ6XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBfbnVtYmVyT2ZMaW5lczsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgIF9saW5lc09mZnNldFgucHVzaCgwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIG1hY3JvLlRleHRBbGlnbm1lbnQuQ0VOVEVSOlxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gX2xpbmVzV2lkdGgubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIF9saW5lc09mZnNldFgucHVzaCgoX2NvbnRlbnRTaXplLndpZHRoIC0gX2xpbmVzV2lkdGhbaV0pIC8gMik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBtYWNyby5UZXh0QWxpZ25tZW50LlJJR0hUOlxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gX2xpbmVzV2lkdGgubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIF9saW5lc09mZnNldFgucHVzaChfY29udGVudFNpemUud2lkdGggLSBfbGluZXNXaWR0aFtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPUFxuICAgICAgICBfbGV0dGVyT2Zmc2V0WSA9IF9jb250ZW50U2l6ZS5oZWlnaHQ7XG4gICAgICAgIGlmIChfdkFsaWduICE9PSBtYWNyby5WZXJ0aWNhbFRleHRBbGlnbm1lbnQuVE9QKSB7XG4gICAgICAgICAgICBsZXQgYmxhbmsgPSBfY29udGVudFNpemUuaGVpZ2h0IC0gX3RleHREZXNpcmVkSGVpZ2h0ICsgX2xpbmVIZWlnaHQgKiB0aGlzLl9nZXRGb250U2NhbGUoKSAtIF9vcmlnaW5Gb250U2l6ZSAqIF9ibWZvbnRTY2FsZTtcbiAgICAgICAgICAgIGlmIChfdkFsaWduID09PSBtYWNyby5WZXJ0aWNhbFRleHRBbGlnbm1lbnQuQk9UVE9NKSB7XG4gICAgICAgICAgICAgICAgLy8gQk9UVE9NXG4gICAgICAgICAgICAgICAgX2xldHRlck9mZnNldFkgLT0gYmxhbms7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIENFTlRFUjpcbiAgICAgICAgICAgICAgICBfbGV0dGVyT2Zmc2V0WSAtPSBibGFuayAvIDI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfc2V0dXBCTUZvbnRPdmVyZmxvd01ldHJpY3MgKCkge1xuICAgICAgICBsZXQgbmV3V2lkdGggPSBfY29udGVudFNpemUud2lkdGgsXG4gICAgICAgICAgICBuZXdIZWlnaHQgPSBfY29udGVudFNpemUuaGVpZ2h0O1xuXG4gICAgICAgIGlmIChfb3ZlcmZsb3cgPT09IE92ZXJmbG93LlJFU0laRV9IRUlHSFQpIHtcbiAgICAgICAgICAgIG5ld0hlaWdodCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX292ZXJmbG93ID09PSBPdmVyZmxvdy5OT05FKSB7XG4gICAgICAgICAgICBuZXdXaWR0aCA9IDA7XG4gICAgICAgICAgICBuZXdIZWlnaHQgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgX2xhYmVsV2lkdGggPSBuZXdXaWR0aDtcbiAgICAgICAgX2xhYmVsSGVpZ2h0ID0gbmV3SGVpZ2h0O1xuICAgICAgICBfbWF4TGluZVdpZHRoID0gbmV3V2lkdGg7XG4gICAgfVxuXG4gICAgdXBkYXRlV29ybGRWZXJ0cygpIHt9XG5cbiAgICBhcHBlbmRRdWFkIChjb21wLCB0ZXh0dXJlLCByZWN0LCByb3RhdGVkLCB4LCB5LCBzY2FsZSkge31cbiAgICBfcXVhZHNVcGRhdGVkIChjb21wKSB7fVxuXG4gICAgX3Jlc2VydmVRdWFkcyAoKSB7fVxufSJdfQ==