
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/editbox/WebEditBoxImpl.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _mat = _interopRequireDefault(require("../../value-types/mat4"));

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
var utils = require('../../platform/utils');

var macro = require('../../platform/CCMacro');

var Types = require('./types');

var Label = require('../CCLabel');

var tabIndexUtil = require('./tabIndexUtil');

var EditBox = cc.EditBox;
var js = cc.js;
var InputMode = Types.InputMode;
var InputFlag = Types.InputFlag;
var KeyboardReturnType = Types.KeyboardReturnType; // polyfill

var polyfill = {
  zoomInvalid: false
};

if (cc.sys.OS_ANDROID === cc.sys.os && (cc.sys.browserType === cc.sys.BROWSER_TYPE_SOUGOU || cc.sys.browserType === cc.sys.BROWSER_TYPE_360)) {
  polyfill.zoomInvalid = true;
} // https://segmentfault.com/q/1010000002914610


var DELAY_TIME = 800;
var SCROLLY = 100;
var LEFT_PADDING = 2; // private static property

var _domCount = 0;

var _vec3 = cc.v3();

var _currentEditBoxImpl = null; // on mobile

var _fullscreen = false;
var _autoResize = false;
var BaseClass = EditBox._ImplClass; // This is an adapter for EditBoxImpl on web platform.
// For more adapters on other platforms, please inherit from EditBoxImplBase and implement the interface.

function WebEditBoxImpl() {
  BaseClass.call(this);
  this._domId = "EditBoxId_" + ++_domCount;
  this._placeholderStyleSheet = null;
  this._elem = null;
  this._isTextArea = false; // matrix

  this._worldMat = new _mat["default"]();
  this._cameraMat = new _mat["default"](); // matrix cache

  this._m00 = 0;
  this._m01 = 0;
  this._m04 = 0;
  this._m05 = 0;
  this._m12 = 0;
  this._m13 = 0;
  this._w = 0;
  this._h = 0; // inputType cache

  this._inputMode = null;
  this._inputFlag = null;
  this._returnType = null; // event listeners

  this._eventListeners = {}; // update style sheet cache

  this._textLabelFont = null;
  this._textLabelFontSize = null;
  this._textLabelFontColor = null;
  this._textLabelAlign = null;
  this._placeholderLabelFont = null;
  this._placeholderLabelFontSize = null;
  this._placeholderLabelFontColor = null;
  this._placeholderLabelAlign = null;
  this._placeholderLineHeight = null;
}

js.extend(WebEditBoxImpl, BaseClass);
EditBox._ImplClass = WebEditBoxImpl;
Object.assign(WebEditBoxImpl.prototype, {
  // =================================
  // implement EditBoxImplBase interface
  init: function init(delegate) {
    if (!delegate) {
      return;
    }

    this._delegate = delegate;

    if (delegate.inputMode === InputMode.ANY) {
      this._createTextArea();
    } else {
      this._createInput();
    }

    tabIndexUtil.add(this);
    this.setTabIndex(delegate.tabIndex);

    this._initStyleSheet();

    this._registerEventListeners();

    this._addDomToGameContainer();

    _fullscreen = cc.view.isAutoFullScreenEnabled();
    _autoResize = cc.view._resizeWithBrowserSize;
  },
  clear: function clear() {
    this._removeEventListeners();

    this._removeDomFromGameContainer();

    tabIndexUtil.remove(this); // clear while editing

    if (_currentEditBoxImpl === this) {
      _currentEditBoxImpl = null;
    }
  },
  update: function update() {
    this._updateMatrix();
  },
  setTabIndex: function setTabIndex(index) {
    this._elem.tabIndex = index;
    tabIndexUtil.resort();
  },
  setSize: function setSize(width, height) {
    var elem = this._elem;
    elem.style.width = width + 'px';
    elem.style.height = height + 'px';
  },
  beginEditing: function beginEditing() {
    if (_currentEditBoxImpl && _currentEditBoxImpl !== this) {
      _currentEditBoxImpl.setFocus(false);
    }

    this._editing = true;
    _currentEditBoxImpl = this;

    this._delegate.editBoxEditingDidBegan();

    this._showDom();

    this._elem.focus(); // set focus

  },
  endEditing: function endEditing() {
    if (this._elem) {
      this._elem.blur();
    }
  },
  // ==========================================================================
  // implement dom input
  _createInput: function _createInput() {
    this._isTextArea = false;
    this._elem = document.createElement('input');
  },
  _createTextArea: function _createTextArea() {
    this._isTextArea = true;
    this._elem = document.createElement('textarea');
  },
  _addDomToGameContainer: function _addDomToGameContainer() {
    cc.game.container.appendChild(this._elem);
    document.head.appendChild(this._placeholderStyleSheet);
  },
  _removeDomFromGameContainer: function _removeDomFromGameContainer() {
    var hasElem = utils.contains(cc.game.container, this._elem);

    if (hasElem) {
      cc.game.container.removeChild(this._elem);
    }

    var hasStyleSheet = utils.contains(document.head, this._placeholderStyleSheet);

    if (hasStyleSheet) {
      document.head.removeChild(this._placeholderStyleSheet);
    }

    delete this._elem;
    delete this._placeholderStyleSheet;
  },
  _showDom: function _showDom() {
    this._updateMaxLength();

    this._updateInputType();

    this._updateStyleSheet();

    this._elem.style.display = '';

    this._delegate._hideLabels();

    if (cc.sys.isMobile) {
      this._showDomOnMobile();
    }
  },
  _hideDom: function _hideDom() {
    var elem = this._elem;
    elem.style.display = 'none';

    this._delegate._showLabels();

    if (cc.sys.isMobile) {
      this._hideDomOnMobile();
    }
  },
  _showDomOnMobile: function _showDomOnMobile() {
    if (cc.sys.os !== cc.sys.OS_ANDROID) {
      return;
    }

    if (_fullscreen) {
      cc.view.enableAutoFullScreen(false);
      cc.screen.exitFullScreen();
    }

    if (_autoResize) {
      cc.view.resizeWithBrowserSize(false);
    }

    this._adjustWindowScroll();
  },
  _hideDomOnMobile: function _hideDomOnMobile() {
    if (cc.sys.os === cc.sys.OS_ANDROID) {
      if (_autoResize) {
        cc.view.resizeWithBrowserSize(true);
      } // In case enter full screen when soft keyboard still showing


      setTimeout(function () {
        if (!_currentEditBoxImpl) {
          if (_fullscreen) {
            cc.view.enableAutoFullScreen(true);
          }
        }
      }, DELAY_TIME);
    } // Some browser like wechat on iOS need to mannully scroll back window


    this._scrollBackWindow();
  },
  // adjust view to editBox
  _adjustWindowScroll: function _adjustWindowScroll() {
    var self = this;
    setTimeout(function () {
      if (window.scrollY < SCROLLY) {
        self._elem.scrollIntoView({
          block: "start",
          inline: "nearest",
          behavior: "smooth"
        });
      }
    }, DELAY_TIME);
  },
  _scrollBackWindow: function _scrollBackWindow() {
    setTimeout(function () {
      // FIX: wechat browser bug on iOS
      // If gameContainer is included in iframe,
      // Need to scroll the top window, not the one in the iframe
      // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Window/top
      var sys = cc.sys;

      if (sys.browserType === sys.BROWSER_TYPE_WECHAT && sys.os === sys.OS_IOS) {
        window.top && window.top.scrollTo(0, 0);
        return;
      }

      window.scrollTo(0, 0);
    }, DELAY_TIME);
  },
  _updateMatrix: function _updateMatrix() {
    var node = this._delegate.node;
    node.getWorldMatrix(this._worldMat);
    var worldMat = this._worldMat;
    var worldMatm = worldMat.m; // check whether need to update

    if (this._m00 === worldMatm[0] && this._m01 === worldMatm[1] && this._m04 === worldMatm[4] && this._m05 === worldMatm[5] && this._m12 === worldMatm[12] && this._m13 === worldMatm[13] && this._w === node._contentSize.width && this._h === node._contentSize.height) {
      return;
    } // update matrix cache


    this._m00 = worldMatm[0];
    this._m01 = worldMatm[1];
    this._m04 = worldMatm[4];
    this._m05 = worldMatm[5];
    this._m12 = worldMatm[12];
    this._m13 = worldMatm[13];
    this._w = node._contentSize.width;
    this._h = node._contentSize.height;
    var scaleX = cc.view._scaleX,
        scaleY = cc.view._scaleY,
        viewport = cc.view._viewportRect,
        dpr = cc.view._devicePixelRatio;
    _vec3.x = -node._anchorPoint.x * this._w;
    _vec3.y = -node._anchorPoint.y * this._h;

    _mat["default"].transform(worldMat, worldMat, _vec3); // can't find camera in editor


    var cameraMat;

    if (CC_EDITOR) {
      cameraMat = this._cameraMat = worldMat;
    } else {
      var camera = cc.Camera.findCamera(node);
      camera.getWorldToScreenMatrix2D(this._cameraMat);
      cameraMat = this._cameraMat;

      _mat["default"].mul(cameraMat, cameraMat, worldMat);
    }

    scaleX /= dpr;
    scaleY /= dpr;
    var container = cc.game.container;
    var cameraMatm = cameraMat.m;
    var a = cameraMatm[0] * scaleX,
        b = cameraMatm[1],
        c = cameraMatm[4],
        d = cameraMatm[5] * scaleY;
    var offsetX = container && container.style.paddingLeft && parseInt(container.style.paddingLeft);
    offsetX += viewport.x / dpr;
    var offsetY = container && container.style.paddingBottom && parseInt(container.style.paddingBottom);
    offsetY += viewport.y / dpr;
    var tx = cameraMatm[12] * scaleX + offsetX,
        ty = cameraMatm[13] * scaleY + offsetY;

    if (polyfill.zoomInvalid) {
      this.setSize(node.width * a, node.height * d);
      a = 1;
      d = 1;
    }

    var elem = this._elem;
    var matrix = "matrix(" + a + "," + -b + "," + -c + "," + d + "," + tx + "," + -ty + ")";
    elem.style['transform'] = matrix;
    elem.style['-webkit-transform'] = matrix;
    elem.style['transform-origin'] = '0px 100% 0px';
    elem.style['-webkit-transform-origin'] = '0px 100% 0px';
  },
  // ===========================================
  // input type and max length
  _updateInputType: function _updateInputType() {
    var delegate = this._delegate,
        inputMode = delegate.inputMode,
        inputFlag = delegate.inputFlag,
        returnType = delegate.returnType,
        elem = this._elem; // whether need to update

    if (this._inputMode === inputMode && this._inputFlag === inputFlag && this._returnType === returnType) {
      return;
    } // update cache


    this._inputMode = inputMode;
    this._inputFlag = inputFlag;
    this._returnType = returnType; // FIX ME: TextArea actually dose not support password type.

    if (this._isTextArea) {
      // input flag
      var _textTransform = 'none';

      if (inputFlag === InputFlag.INITIAL_CAPS_ALL_CHARACTERS) {
        _textTransform = 'uppercase';
      } else if (inputFlag === InputFlag.INITIAL_CAPS_WORD) {
        _textTransform = 'capitalize';
      }

      elem.style.textTransform = _textTransform;
      return;
    } // begin to updateInputType


    if (inputFlag === InputFlag.PASSWORD) {
      elem.type = 'password';
      return;
    } // input mode


    var type = elem.type;

    if (inputMode === InputMode.EMAIL_ADDR) {
      type = 'email';
    } else if (inputMode === InputMode.NUMERIC || inputMode === InputMode.DECIMAL) {
      type = 'number';
    } else if (inputMode === InputMode.PHONE_NUMBER) {
      type = 'number';
      elem.pattern = '[0-9]*';
    } else if (inputMode === InputMode.URL) {
      type = 'url';
    } else {
      type = 'text';

      if (returnType === KeyboardReturnType.SEARCH) {
        type = 'search';
      }
    }

    elem.type = type; // input flag

    var textTransform = 'none';

    if (inputFlag === InputFlag.INITIAL_CAPS_ALL_CHARACTERS) {
      textTransform = 'uppercase';
    } else if (inputFlag === InputFlag.INITIAL_CAPS_WORD) {
      textTransform = 'capitalize';
    }

    elem.style.textTransform = textTransform;
  },
  _updateMaxLength: function _updateMaxLength() {
    var maxLength = this._delegate.maxLength;

    if (maxLength < 0) {
      //we can't set Number.MAX_VALUE to input's maxLength property
      //so we use a magic number here, it should works at most use cases.
      maxLength = 65535;
    }

    this._elem.maxLength = maxLength;
  },
  // ===========================================
  // style sheet
  _initStyleSheet: function _initStyleSheet() {
    var elem = this._elem;
    elem.style.display = 'none';
    elem.style.border = 0;
    elem.style.background = 'transparent';
    elem.style.width = '100%';
    elem.style.height = '100%';
    elem.style.active = 0;
    elem.style.outline = 'medium';
    elem.style.padding = '0';
    elem.style.textTransform = 'uppercase';
    elem.style.position = "absolute";
    elem.style.bottom = "0px";
    elem.style.left = LEFT_PADDING + "px";
    elem.className = "cocosEditBox";
    elem.id = this._domId;

    if (!this._isTextArea) {
      elem.type = 'text';
      elem.style['-moz-appearance'] = 'textfield';
    } else {
      elem.style.resize = 'none';
      elem.style.overflow_y = 'scroll';
    }

    this._placeholderStyleSheet = document.createElement('style');
  },
  _updateStyleSheet: function _updateStyleSheet() {
    var delegate = this._delegate,
        elem = this._elem;
    elem.value = delegate.string;
    elem.placeholder = delegate.placeholder;

    this._updateTextLabel(delegate.textLabel);

    this._updatePlaceholderLabel(delegate.placeholderLabel);
  },
  _updateTextLabel: function _updateTextLabel(textLabel) {
    if (!textLabel) {
      return;
    } // get font


    var font = textLabel.font;

    if (font && !(font instanceof cc.BitmapFont)) {
      font = font._fontFamily;
    } else {
      font = textLabel.fontFamily;
    } // get font size


    var fontSize = textLabel.fontSize * textLabel.node.scaleY; // whether need to update

    if (this._textLabelFont === font && this._textLabelFontSize === fontSize && this._textLabelFontColor === textLabel.fontColor && this._textLabelAlign === textLabel.horizontalAlign) {
      return;
    } // update cache


    this._textLabelFont = font;
    this._textLabelFontSize = fontSize;
    this._textLabelFontColor = textLabel.fontColor;
    this._textLabelAlign = textLabel.horizontalAlign;
    var elem = this._elem; // font size

    elem.style.fontSize = fontSize + "px"; // font color

    elem.style.color = textLabel.node.color.toCSS('rgba'); // font family

    elem.style.fontFamily = font; // text-align

    switch (textLabel.horizontalAlign) {
      case Label.HorizontalAlign.LEFT:
        elem.style.textAlign = 'left';
        break;

      case Label.HorizontalAlign.CENTER:
        elem.style.textAlign = 'center';
        break;

      case Label.HorizontalAlign.RIGHT:
        elem.style.textAlign = 'right';
        break;
    } // lineHeight
    // Can't sync lineHeight property, because lineHeight would change the touch area of input

  },
  _updatePlaceholderLabel: function _updatePlaceholderLabel(placeholderLabel) {
    if (!placeholderLabel) {
      return;
    } // get font


    var font = placeholderLabel.font;

    if (font && !(font instanceof cc.BitmapFont)) {
      font = placeholderLabel.font._fontFamily;
    } else {
      font = placeholderLabel.fontFamily;
    } // get font size


    var fontSize = placeholderLabel.fontSize * placeholderLabel.node.scaleY; // whether need to update

    if (this._placeholderLabelFont === font && this._placeholderLabelFontSize === fontSize && this._placeholderLabelFontColor === placeholderLabel.fontColor && this._placeholderLabelAlign === placeholderLabel.horizontalAlign && this._placeholderLineHeight === placeholderLabel.fontSize) {
      return;
    } // update cache


    this._placeholderLabelFont = font;
    this._placeholderLabelFontSize = fontSize;
    this._placeholderLabelFontColor = placeholderLabel.fontColor;
    this._placeholderLabelAlign = placeholderLabel.horizontalAlign;
    this._placeholderLineHeight = placeholderLabel.fontSize;
    var styleEl = this._placeholderStyleSheet; // font color

    var fontColor = placeholderLabel.node.color.toCSS('rgba'); // line height

    var lineHeight = placeholderLabel.fontSize; // top vertical align by default
    // horizontal align

    var horizontalAlign;

    switch (placeholderLabel.horizontalAlign) {
      case Label.HorizontalAlign.LEFT:
        horizontalAlign = 'left';
        break;

      case Label.HorizontalAlign.CENTER:
        horizontalAlign = 'center';
        break;

      case Label.HorizontalAlign.RIGHT:
        horizontalAlign = 'right';
        break;
    }

    styleEl.innerHTML = "#" + this._domId + "::-webkit-input-placeholder,#" + this._domId + "::-moz-placeholder,#" + this._domId + ":-ms-input-placeholder" + ("{text-transform: initial; font-family: " + font + "; font-size: " + fontSize + "px; color: " + fontColor + "; line-height: " + lineHeight + "px; text-align: " + horizontalAlign + ";}"); // EDGE_BUG_FIX: hide clear button, because clearing input box in Edge does not emit input event 
    // issue refference: https://github.com/angular/angular/issues/26307

    if (cc.sys.browserType === cc.sys.BROWSER_TYPE_EDGE) {
      styleEl.innerHTML += "#" + this._domId + "::-ms-clear{display: none;}";
    }
  },
  // ===========================================
  // handle event listeners
  _registerEventListeners: function _registerEventListeners() {
    var impl = this,
        elem = this._elem,
        inputLock = false,
        cbs = this._eventListeners;

    cbs.compositionStart = function () {
      inputLock = true;
    };

    cbs.compositionEnd = function () {
      inputLock = false;

      impl._delegate.editBoxTextChanged(elem.value);
    };

    cbs.onInput = function () {
      if (inputLock) {
        return;
      }

      impl._delegate.editBoxTextChanged(elem.value);
    }; // There are 2 ways to focus on the input element:
    // Click the input element, or call input.focus().
    // Both need to adjust window scroll.


    cbs.onClick = function (e) {
      // In case operation sequence: click input, hide keyboard, then click again.
      if (impl._editing) {
        if (cc.sys.isMobile) {
          impl._adjustWindowScroll();
        }
      }
    };

    cbs.onKeydown = function (e) {
      if (e.keyCode === macro.KEY.enter) {
        e.stopPropagation();

        impl._delegate.editBoxEditingReturn();

        if (!impl._isTextArea) {
          elem.blur();
        }
      } else if (e.keyCode === macro.KEY.tab) {
        e.stopPropagation();
        e.preventDefault();
        tabIndexUtil.next(impl);
      }
    };

    cbs.onBlur = function () {
      impl._editing = false;
      _currentEditBoxImpl = null;

      impl._hideDom();

      impl._delegate.editBoxEditingDidEnded();
    };

    elem.addEventListener('compositionstart', cbs.compositionStart);
    elem.addEventListener('compositionend', cbs.compositionEnd);
    elem.addEventListener('input', cbs.onInput);
    elem.addEventListener('keydown', cbs.onKeydown);
    elem.addEventListener('blur', cbs.onBlur);
    elem.addEventListener('touchstart', cbs.onClick);
  },
  _removeEventListeners: function _removeEventListeners() {
    var elem = this._elem,
        cbs = this._eventListeners;
    elem.removeEventListener('compositionstart', cbs.compositionStart);
    elem.removeEventListener('compositionend', cbs.compositionEnd);
    elem.removeEventListener('input', cbs.onInput);
    elem.removeEventListener('keydown', cbs.onKeydown);
    elem.removeEventListener('blur', cbs.onBlur);
    elem.removeEventListener('touchstart', cbs.onClick);
    cbs.compositionStart = null;
    cbs.compositionEnd = null;
    cbs.onInput = null;
    cbs.onKeydown = null;
    cbs.onBlur = null;
    cbs.onClick = null;
  }
});
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIldlYkVkaXRCb3hJbXBsLmpzIl0sIm5hbWVzIjpbInV0aWxzIiwicmVxdWlyZSIsIm1hY3JvIiwiVHlwZXMiLCJMYWJlbCIsInRhYkluZGV4VXRpbCIsIkVkaXRCb3giLCJjYyIsImpzIiwiSW5wdXRNb2RlIiwiSW5wdXRGbGFnIiwiS2V5Ym9hcmRSZXR1cm5UeXBlIiwicG9seWZpbGwiLCJ6b29tSW52YWxpZCIsInN5cyIsIk9TX0FORFJPSUQiLCJvcyIsImJyb3dzZXJUeXBlIiwiQlJPV1NFUl9UWVBFX1NPVUdPVSIsIkJST1dTRVJfVFlQRV8zNjAiLCJERUxBWV9USU1FIiwiU0NST0xMWSIsIkxFRlRfUEFERElORyIsIl9kb21Db3VudCIsIl92ZWMzIiwidjMiLCJfY3VycmVudEVkaXRCb3hJbXBsIiwiX2Z1bGxzY3JlZW4iLCJfYXV0b1Jlc2l6ZSIsIkJhc2VDbGFzcyIsIl9JbXBsQ2xhc3MiLCJXZWJFZGl0Qm94SW1wbCIsImNhbGwiLCJfZG9tSWQiLCJfcGxhY2Vob2xkZXJTdHlsZVNoZWV0IiwiX2VsZW0iLCJfaXNUZXh0QXJlYSIsIl93b3JsZE1hdCIsIk1hdDQiLCJfY2FtZXJhTWF0IiwiX20wMCIsIl9tMDEiLCJfbTA0IiwiX20wNSIsIl9tMTIiLCJfbTEzIiwiX3ciLCJfaCIsIl9pbnB1dE1vZGUiLCJfaW5wdXRGbGFnIiwiX3JldHVyblR5cGUiLCJfZXZlbnRMaXN0ZW5lcnMiLCJfdGV4dExhYmVsRm9udCIsIl90ZXh0TGFiZWxGb250U2l6ZSIsIl90ZXh0TGFiZWxGb250Q29sb3IiLCJfdGV4dExhYmVsQWxpZ24iLCJfcGxhY2Vob2xkZXJMYWJlbEZvbnQiLCJfcGxhY2Vob2xkZXJMYWJlbEZvbnRTaXplIiwiX3BsYWNlaG9sZGVyTGFiZWxGb250Q29sb3IiLCJfcGxhY2Vob2xkZXJMYWJlbEFsaWduIiwiX3BsYWNlaG9sZGVyTGluZUhlaWdodCIsImV4dGVuZCIsIk9iamVjdCIsImFzc2lnbiIsInByb3RvdHlwZSIsImluaXQiLCJkZWxlZ2F0ZSIsIl9kZWxlZ2F0ZSIsImlucHV0TW9kZSIsIkFOWSIsIl9jcmVhdGVUZXh0QXJlYSIsIl9jcmVhdGVJbnB1dCIsImFkZCIsInNldFRhYkluZGV4IiwidGFiSW5kZXgiLCJfaW5pdFN0eWxlU2hlZXQiLCJfcmVnaXN0ZXJFdmVudExpc3RlbmVycyIsIl9hZGREb21Ub0dhbWVDb250YWluZXIiLCJ2aWV3IiwiaXNBdXRvRnVsbFNjcmVlbkVuYWJsZWQiLCJfcmVzaXplV2l0aEJyb3dzZXJTaXplIiwiY2xlYXIiLCJfcmVtb3ZlRXZlbnRMaXN0ZW5lcnMiLCJfcmVtb3ZlRG9tRnJvbUdhbWVDb250YWluZXIiLCJyZW1vdmUiLCJ1cGRhdGUiLCJfdXBkYXRlTWF0cml4IiwiaW5kZXgiLCJyZXNvcnQiLCJzZXRTaXplIiwid2lkdGgiLCJoZWlnaHQiLCJlbGVtIiwic3R5bGUiLCJiZWdpbkVkaXRpbmciLCJzZXRGb2N1cyIsIl9lZGl0aW5nIiwiZWRpdEJveEVkaXRpbmdEaWRCZWdhbiIsIl9zaG93RG9tIiwiZm9jdXMiLCJlbmRFZGl0aW5nIiwiYmx1ciIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImdhbWUiLCJjb250YWluZXIiLCJhcHBlbmRDaGlsZCIsImhlYWQiLCJoYXNFbGVtIiwiY29udGFpbnMiLCJyZW1vdmVDaGlsZCIsImhhc1N0eWxlU2hlZXQiLCJfdXBkYXRlTWF4TGVuZ3RoIiwiX3VwZGF0ZUlucHV0VHlwZSIsIl91cGRhdGVTdHlsZVNoZWV0IiwiZGlzcGxheSIsIl9oaWRlTGFiZWxzIiwiaXNNb2JpbGUiLCJfc2hvd0RvbU9uTW9iaWxlIiwiX2hpZGVEb20iLCJfc2hvd0xhYmVscyIsIl9oaWRlRG9tT25Nb2JpbGUiLCJlbmFibGVBdXRvRnVsbFNjcmVlbiIsInNjcmVlbiIsImV4aXRGdWxsU2NyZWVuIiwicmVzaXplV2l0aEJyb3dzZXJTaXplIiwiX2FkanVzdFdpbmRvd1Njcm9sbCIsInNldFRpbWVvdXQiLCJfc2Nyb2xsQmFja1dpbmRvdyIsInNlbGYiLCJ3aW5kb3ciLCJzY3JvbGxZIiwic2Nyb2xsSW50b1ZpZXciLCJibG9jayIsImlubGluZSIsImJlaGF2aW9yIiwiQlJPV1NFUl9UWVBFX1dFQ0hBVCIsIk9TX0lPUyIsInRvcCIsInNjcm9sbFRvIiwibm9kZSIsImdldFdvcmxkTWF0cml4Iiwid29ybGRNYXQiLCJ3b3JsZE1hdG0iLCJtIiwiX2NvbnRlbnRTaXplIiwic2NhbGVYIiwiX3NjYWxlWCIsInNjYWxlWSIsIl9zY2FsZVkiLCJ2aWV3cG9ydCIsIl92aWV3cG9ydFJlY3QiLCJkcHIiLCJfZGV2aWNlUGl4ZWxSYXRpbyIsIngiLCJfYW5jaG9yUG9pbnQiLCJ5IiwidHJhbnNmb3JtIiwiY2FtZXJhTWF0IiwiQ0NfRURJVE9SIiwiY2FtZXJhIiwiQ2FtZXJhIiwiZmluZENhbWVyYSIsImdldFdvcmxkVG9TY3JlZW5NYXRyaXgyRCIsIm11bCIsImNhbWVyYU1hdG0iLCJhIiwiYiIsImMiLCJkIiwib2Zmc2V0WCIsInBhZGRpbmdMZWZ0IiwicGFyc2VJbnQiLCJvZmZzZXRZIiwicGFkZGluZ0JvdHRvbSIsInR4IiwidHkiLCJtYXRyaXgiLCJpbnB1dEZsYWciLCJyZXR1cm5UeXBlIiwidGV4dFRyYW5zZm9ybSIsIklOSVRJQUxfQ0FQU19BTExfQ0hBUkFDVEVSUyIsIklOSVRJQUxfQ0FQU19XT1JEIiwiUEFTU1dPUkQiLCJ0eXBlIiwiRU1BSUxfQUREUiIsIk5VTUVSSUMiLCJERUNJTUFMIiwiUEhPTkVfTlVNQkVSIiwicGF0dGVybiIsIlVSTCIsIlNFQVJDSCIsIm1heExlbmd0aCIsImJvcmRlciIsImJhY2tncm91bmQiLCJhY3RpdmUiLCJvdXRsaW5lIiwicGFkZGluZyIsInBvc2l0aW9uIiwiYm90dG9tIiwibGVmdCIsImNsYXNzTmFtZSIsImlkIiwicmVzaXplIiwib3ZlcmZsb3dfeSIsInZhbHVlIiwic3RyaW5nIiwicGxhY2Vob2xkZXIiLCJfdXBkYXRlVGV4dExhYmVsIiwidGV4dExhYmVsIiwiX3VwZGF0ZVBsYWNlaG9sZGVyTGFiZWwiLCJwbGFjZWhvbGRlckxhYmVsIiwiZm9udCIsIkJpdG1hcEZvbnQiLCJfZm9udEZhbWlseSIsImZvbnRGYW1pbHkiLCJmb250U2l6ZSIsImZvbnRDb2xvciIsImhvcml6b250YWxBbGlnbiIsImNvbG9yIiwidG9DU1MiLCJIb3Jpem9udGFsQWxpZ24iLCJMRUZUIiwidGV4dEFsaWduIiwiQ0VOVEVSIiwiUklHSFQiLCJzdHlsZUVsIiwibGluZUhlaWdodCIsImlubmVySFRNTCIsIkJST1dTRVJfVFlQRV9FREdFIiwiaW1wbCIsImlucHV0TG9jayIsImNicyIsImNvbXBvc2l0aW9uU3RhcnQiLCJjb21wb3NpdGlvbkVuZCIsImVkaXRCb3hUZXh0Q2hhbmdlZCIsIm9uSW5wdXQiLCJvbkNsaWNrIiwiZSIsIm9uS2V5ZG93biIsImtleUNvZGUiLCJLRVkiLCJlbnRlciIsInN0b3BQcm9wYWdhdGlvbiIsImVkaXRCb3hFZGl0aW5nUmV0dXJuIiwidGFiIiwicHJldmVudERlZmF1bHQiLCJuZXh0Iiwib25CbHVyIiwiZWRpdEJveEVkaXRpbmdEaWRFbmRlZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBMEJBOzs7O0FBMUJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEJBLElBQU1BLEtBQUssR0FBR0MsT0FBTyxDQUFDLHNCQUFELENBQXJCOztBQUNBLElBQU1DLEtBQUssR0FBR0QsT0FBTyxDQUFDLHdCQUFELENBQXJCOztBQUNBLElBQU1FLEtBQUssR0FBR0YsT0FBTyxDQUFDLFNBQUQsQ0FBckI7O0FBQ0EsSUFBTUcsS0FBSyxHQUFHSCxPQUFPLENBQUMsWUFBRCxDQUFyQjs7QUFDQSxJQUFNSSxZQUFZLEdBQUdKLE9BQU8sQ0FBQyxnQkFBRCxDQUE1Qjs7QUFFQSxJQUFNSyxPQUFPLEdBQUdDLEVBQUUsQ0FBQ0QsT0FBbkI7QUFDQSxJQUFNRSxFQUFFLEdBQUdELEVBQUUsQ0FBQ0MsRUFBZDtBQUNBLElBQU1DLFNBQVMsR0FBR04s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QUEsSUFBSSxDQUFDK0osbUJBQUwsQ0FBeUIsa0JBQXpCLEVBQTZDbkIsR0FBRyxDQUFDQyxnQkFBakQ7QUFDQTdJLElBQUFBLElBQUksQ0FBQytKLG1CQUFMLENBQXlCLGdCQUF6QixFQUEyQ25CLEdBQUcsQ0FBQ0UsY0FBL0M7QUFDQTlJLElBQUFBLElBQUksQ0FBQytKLG1CQUFMLENBQXlCLE9BQXpCLEVBQWtDbkIsR0FBRyxDQUFDSSxPQUF0QztBQUNBaEosSUFBQUEsSUFBSSxDQUFDK0osbUJBQUwsQ0FBeUIsU0FBekIsRUFBb0NuQixHQUFHLENBQUNPLFNBQXhDO0FBQ0FuSixJQUFBQSxJQUFJLENBQUMrSixtQkFBTCxDQUF5QixNQUF6QixFQUFpQ25CLEdBQUcsQ0FBQ2dCLE1BQXJDO0FBQ0E1SixJQUFBQSxJQUFJLENBQUMrSixtQkFBTCxDQUF5QixZQUF6QixFQUF1Q25CLEdBQUcsQ0FBQ0ssT0FBM0M7QUFFQUwsSUFBQUEsR0FBRyxDQUFDQyxnQkFBSixHQUF1QixJQUF2QjtBQUNBRCxJQUFBQSxHQUFHLENBQUNFLGNBQUosR0FBcUIsSUFBckI7QUFDQUYsSUFBQUEsR0FBRyxDQUFDSSxPQUFKLEdBQWMsSUFBZDtBQUNBSixJQUFBQSxHQUFHLENBQUNPLFNBQUosR0FBZ0IsSUFBaEI7QUFDQVAsSUFBQUEsR0FBRyxDQUFDZ0IsTUFBSixHQUFhLElBQWI7QUFDQWhCLElBQUFBLEdBQUcsQ0FBQ0ssT0FBSixHQUFjLElBQWQ7QUFDSDtBQXhrQm1DLENBQXhDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCBNYXQ0IGZyb20gJy4uLy4uL3ZhbHVlLXR5cGVzL21hdDQnO1xuXG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uLy4uL3BsYXRmb3JtL3V0aWxzJyk7XG5jb25zdCBtYWNybyA9IHJlcXVpcmUoJy4uLy4uL3BsYXRmb3JtL0NDTWFjcm8nKTtcbmNvbnN0IFR5cGVzID0gcmVxdWlyZSgnLi90eXBlcycpO1xuY29uc3QgTGFiZWwgPSByZXF1aXJlKCcuLi9DQ0xhYmVsJyk7XG5jb25zdCB0YWJJbmRleFV0aWwgPSByZXF1aXJlKCcuL3RhYkluZGV4VXRpbCcpO1xuXG5jb25zdCBFZGl0Qm94ID0gY2MuRWRpdEJveDtcbmNvbnN0IGpzID0gY2MuanM7XG5jb25zdCBJbnB1dE1vZGUgPSBUeXBlcy5JbnB1dE1vZGU7XG5jb25zdCBJbnB1dEZsYWcgPSBUeXBlcy5JbnB1dEZsYWc7XG5jb25zdCBLZXlib2FyZFJldHVyblR5cGUgPSBUeXBlcy5LZXlib2FyZFJldHVyblR5cGU7XG5cbi8vIHBvbHlmaWxsXG5sZXQgcG9seWZpbGwgPSB7XG4gICAgem9vbUludmFsaWQ6IGZhbHNlXG59O1xuXG5pZiAoY2Muc3lzLk9TX0FORFJPSUQgPT09IGNjLnN5cy5vcyAmJlxuICAgIChjYy5zeXMuYnJvd3NlclR5cGUgPT09IGNjLnN5cy5CUk9XU0VSX1RZUEVfU09VR09VIHx8XG4gICAgY2Muc3lzLmJyb3dzZXJUeXBlID09PSBjYy5zeXMuQlJPV1NFUl9UWVBFXzM2MCkpIHtcbiAgICBwb2x5ZmlsbC56b29tSW52YWxpZCA9IHRydWU7XG59XG5cbi8vIGh0dHBzOi8vc2VnbWVudGZhdWx0LmNvbS9xLzEwMTAwMDAwMDI5MTQ2MTBcbmNvbnN0IERFTEFZX1RJTUUgPSA4MDA7XG5jb25zdCBTQ1JPTExZID0gMTAwO1xuY29uc3QgTEVGVF9QQURESU5HID0gMjtcblxuLy8gcHJpdmF0ZSBzdGF0aWMgcHJvcGVydHlcbmxldCBfZG9tQ291bnQgPSAwO1xubGV0IF92ZWMzID0gY2MudjMoKTtcbmxldCBfY3VycmVudEVkaXRCb3hJbXBsID0gbnVsbDtcblxuLy8gb24gbW9iaWxlXG5sZXQgX2Z1bGxzY3JlZW4gPSBmYWxzZTtcbmxldCBfYXV0b1Jlc2l6ZSA9IGZhbHNlO1xuXG5jb25zdCBCYXNlQ2xhc3MgPSBFZGl0Qm94Ll9JbXBsQ2xhc3M7XG4gLy8gVGhpcyBpcyBhbiBhZGFwdGVyIGZvciBFZGl0Qm94SW1wbCBvbiB3ZWIgcGxhdGZvcm0uXG4gLy8gRm9yIG1vcmUgYWRhcHRlcnMgb24gb3RoZXIgcGxhdGZvcm1zLCBwbGVhc2UgaW5oZXJpdCBmcm9tIEVkaXRCb3hJbXBsQmFzZSBhbmQgaW1wbGVtZW50IHRoZSBpbnRlcmZhY2UuXG5mdW5jdGlvbiBXZWJFZGl0Qm94SW1wbCAoKSB7XG4gICAgQmFzZUNsYXNzLmNhbGwodGhpcyk7XG4gICAgdGhpcy5fZG9tSWQgPSBgRWRpdEJveElkXyR7KytfZG9tQ291bnR9YDtcbiAgICB0aGlzLl9wbGFjZWhvbGRlclN0eWxlU2hlZXQgPSBudWxsO1xuICAgIHRoaXMuX2VsZW0gPSBudWxsO1xuICAgIHRoaXMuX2lzVGV4dEFyZWEgPSBmYWxzZTtcblxuICAgIC8vIG1hdHJpeFxuICAgIHRoaXMuX3dvcmxkTWF0ID0gbmV3IE1hdDQoKTtcbiAgICB0aGlzLl9jYW1lcmFNYXQgPSBuZXcgTWF0NCgpO1xuICAgIC8vIG1hdHJpeCBjYWNoZVxuICAgIHRoaXMuX20wMCA9IDA7XG4gICAgdGhpcy5fbTAxID0gMDtcbiAgICB0aGlzLl9tMDQgPSAwO1xuICAgIHRoaXMuX20wNSA9IDA7XG4gICAgdGhpcy5fbTEyID0gMDtcbiAgICB0aGlzLl9tMTMgPSAwO1xuICAgIHRoaXMuX3cgPSAwO1xuICAgIHRoaXMuX2ggPSAwO1xuXG4gICAgLy8gaW5wdXRUeXBlIGNhY2hlXG4gICAgdGhpcy5faW5wdXRNb2RlID0gbnVsbDtcbiAgICB0aGlzLl9pbnB1dEZsYWcgPSBudWxsO1xuICAgIHRoaXMuX3JldHVyblR5cGUgPSBudWxsO1xuXG4gICAgLy8gZXZlbnQgbGlzdGVuZXJzXG4gICAgdGhpcy5fZXZlbnRMaXN0ZW5lcnMgPSB7fTtcblxuICAgIC8vIHVwZGF0ZSBzdHlsZSBzaGVldCBjYWNoZVxuICAgIHRoaXMuX3RleHRMYWJlbEZvbnQgPSBudWxsO1xuICAgIHRoaXMuX3RleHRMYWJlbEZvbnRTaXplID0gbnVsbDtcbiAgICB0aGlzLl90ZXh0TGFiZWxGb250Q29sb3IgPSBudWxsO1xuICAgIHRoaXMuX3RleHRMYWJlbEFsaWduID0gbnVsbDtcblxuICAgIHRoaXMuX3BsYWNlaG9sZGVyTGFiZWxGb250ID0gbnVsbDtcbiAgICB0aGlzLl9wbGFjZWhvbGRlckxhYmVsRm9udFNpemUgPSBudWxsO1xuICAgIHRoaXMuX3BsYWNlaG9sZGVyTGFiZWxGb250Q29sb3IgPSBudWxsO1xuICAgIHRoaXMuX3BsYWNlaG9sZGVyTGFiZWxBbGlnbiA9IG51bGw7XG4gICAgdGhpcy5fcGxhY2Vob2xkZXJMaW5lSGVpZ2h0ID0gbnVsbDtcbn1cblxuanMuZXh0ZW5kKFdlYkVkaXRCb3hJbXBsLCBCYXNlQ2xhc3MpO1xuRWRpdEJveC5fSW1wbENsYXNzID0gV2ViRWRpdEJveEltcGw7XG5cbk9iamVjdC5hc3NpZ24oV2ViRWRpdEJveEltcGwucHJvdG90eXBlLCB7XG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gaW1wbGVtZW50IEVkaXRCb3hJbXBsQmFzZSBpbnRlcmZhY2VcbiAgICBpbml0IChkZWxlZ2F0ZSkge1xuICAgICAgICBpZiAoIWRlbGVnYXRlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9kZWxlZ2F0ZSA9IGRlbGVnYXRlO1xuXG4gICAgICAgIGlmIChkZWxlZ2F0ZS5pbnB1dE1vZGUgPT09IElucHV0TW9kZS5BTlkpIHtcbiAgICAgICAgICAgIHRoaXMuX2NyZWF0ZVRleHRBcmVhKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9jcmVhdGVJbnB1dCgpO1xuICAgICAgICB9XG4gICAgICAgIHRhYkluZGV4VXRpbC5hZGQodGhpcyk7XG4gICAgICAgIHRoaXMuc2V0VGFiSW5kZXgoZGVsZWdhdGUudGFiSW5kZXgpO1xuICAgICAgICB0aGlzLl9pbml0U3R5bGVTaGVldCgpO1xuICAgICAgICB0aGlzLl9yZWdpc3RlckV2ZW50TGlzdGVuZXJzKCk7XG4gICAgICAgIHRoaXMuX2FkZERvbVRvR2FtZUNvbnRhaW5lcigpO1xuXG4gICAgICAgIF9mdWxsc2NyZWVuID0gY2Mudmlldy5pc0F1dG9GdWxsU2NyZWVuRW5hYmxlZCgpO1xuICAgICAgICBfYXV0b1Jlc2l6ZSA9IGNjLnZpZXcuX3Jlc2l6ZVdpdGhCcm93c2VyU2l6ZTtcbiAgICB9LFxuXG4gICAgY2xlYXIgKCkge1xuICAgICAgICB0aGlzLl9yZW1vdmVFdmVudExpc3RlbmVycygpO1xuICAgICAgICB0aGlzLl9yZW1vdmVEb21Gcm9tR2FtZUNvbnRhaW5lcigpO1xuXG4gICAgICAgIHRhYkluZGV4VXRpbC5yZW1vdmUodGhpcyk7XG5cbiAgICAgICAgLy8gY2xlYXIgd2hpbGUgZWRpdGluZ1xuICAgICAgICBpZiAoX2N1cnJlbnRFZGl0Qm94SW1wbCA9PT0gdGhpcykge1xuICAgICAgICAgICAgX2N1cnJlbnRFZGl0Qm94SW1wbCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdXBkYXRlICgpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlTWF0cml4KCk7XG4gICAgfSxcblxuICAgIHNldFRhYkluZGV4IChpbmRleCkge1xuICAgICAgICB0aGlzLl9lbGVtLnRhYkluZGV4ID0gaW5kZXg7XG4gICAgICAgIHRhYkluZGV4VXRpbC5yZXNvcnQoKTtcbiAgICB9LFxuXG4gICAgc2V0U2l6ZSAod2lkdGgsIGhlaWdodCkge1xuICAgICAgICBsZXQgZWxlbSA9IHRoaXMuX2VsZW07XG4gICAgICAgIGVsZW0uc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG4gICAgICAgIGVsZW0uc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcbiAgICB9LFxuXG4gICAgYmVnaW5FZGl0aW5nICgpIHtcbiAgICAgICAgaWYgKF9jdXJyZW50RWRpdEJveEltcGwgJiYgX2N1cnJlbnRFZGl0Qm94SW1wbCAhPT0gdGhpcykge1xuICAgICAgICAgICAgX2N1cnJlbnRFZGl0Qm94SW1wbC5zZXRGb2N1cyhmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZWRpdGluZyA9IHRydWU7XG4gICAgICAgIF9jdXJyZW50RWRpdEJveEltcGwgPSB0aGlzO1xuICAgICAgICB0aGlzLl9kZWxlZ2F0ZS5lZGl0Qm94RWRpdGluZ0RpZEJlZ2FuKCk7XG4gICAgICAgIHRoaXMuX3Nob3dEb20oKTtcbiAgICAgICAgdGhpcy5fZWxlbS5mb2N1cygpOyAgLy8gc2V0IGZvY3VzXG4gICAgfSxcblxuICAgIGVuZEVkaXRpbmcgKCkge1xuICAgICAgICBpZiAodGhpcy5fZWxlbSkge1xuICAgICAgICAgICAgdGhpcy5fZWxlbS5ibHVyKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBpbXBsZW1lbnQgZG9tIGlucHV0XG4gICAgX2NyZWF0ZUlucHV0ICgpIHtcbiAgICAgICAgdGhpcy5faXNUZXh0QXJlYSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9lbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB9LFxuXG4gICAgX2NyZWF0ZVRleHRBcmVhICgpIHtcbiAgICAgICAgdGhpcy5faXNUZXh0QXJlYSA9IHRydWU7XG4gICAgICAgIHRoaXMuX2VsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xuICAgIH0sXG5cbiAgICBfYWRkRG9tVG9HYW1lQ29udGFpbmVyICgpIHtcbiAgICAgICAgY2MuZ2FtZS5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5fZWxlbSk7XG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQodGhpcy5fcGxhY2Vob2xkZXJTdHlsZVNoZWV0KTtcbiAgICB9LFxuXG4gICAgX3JlbW92ZURvbUZyb21HYW1lQ29udGFpbmVyICgpIHtcbiAgICAgICAgbGV0IGhhc0VsZW0gPSB1dGlscy5jb250YWlucyhjYy5nYW1lLmNvbnRhaW5lciwgdGhpcy5fZWxlbSk7XG4gICAgICAgIGlmIChoYXNFbGVtKSB7XG4gICAgICAgICAgICBjYy5nYW1lLmNvbnRhaW5lci5yZW1vdmVDaGlsZCh0aGlzLl9lbGVtKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgaGFzU3R5bGVTaGVldCA9IHV0aWxzLmNvbnRhaW5zKGRvY3VtZW50LmhlYWQsIHRoaXMuX3BsYWNlaG9sZGVyU3R5bGVTaGVldCk7XG4gICAgICAgIGlmIChoYXNTdHlsZVNoZWV0KSB7XG4gICAgICAgICAgICBkb2N1bWVudC5oZWFkLnJlbW92ZUNoaWxkKHRoaXMuX3BsYWNlaG9sZGVyU3R5bGVTaGVldCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9lbGVtO1xuICAgICAgICBkZWxldGUgdGhpcy5fcGxhY2Vob2xkZXJTdHlsZVNoZWV0O1xuICAgIH0sXG5cbiAgICBfc2hvd0RvbSAoKSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZU1heExlbmd0aCgpO1xuICAgICAgICB0aGlzLl91cGRhdGVJbnB1dFR5cGUoKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlU3R5bGVTaGVldCgpO1xuXG4gICAgICAgIHRoaXMuX2VsZW0uc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgICAgICB0aGlzLl9kZWxlZ2F0ZS5faGlkZUxhYmVscygpO1xuICAgICAgICBcbiAgICAgICAgaWYgKGNjLnN5cy5pc01vYmlsZSkge1xuICAgICAgICAgICAgdGhpcy5fc2hvd0RvbU9uTW9iaWxlKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2hpZGVEb20gKCkge1xuICAgICAgICBsZXQgZWxlbSA9IHRoaXMuX2VsZW07XG5cbiAgICAgICAgZWxlbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB0aGlzLl9kZWxlZ2F0ZS5fc2hvd0xhYmVscygpO1xuICAgICAgICBcbiAgICAgICAgaWYgKGNjLnN5cy5pc01vYmlsZSkge1xuICAgICAgICAgICAgdGhpcy5faGlkZURvbU9uTW9iaWxlKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3Nob3dEb21Pbk1vYmlsZSAoKSB7XG4gICAgICAgIGlmIChjYy5zeXMub3MgIT09IGNjLnN5cy5PU19BTkRST0lEKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChfZnVsbHNjcmVlbikge1xuICAgICAgICAgICAgY2Mudmlldy5lbmFibGVBdXRvRnVsbFNjcmVlbihmYWxzZSk7XG4gICAgICAgICAgICBjYy5zY3JlZW4uZXhpdEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoX2F1dG9SZXNpemUpIHtcbiAgICAgICAgICAgIGNjLnZpZXcucmVzaXplV2l0aEJyb3dzZXJTaXplKGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2FkanVzdFdpbmRvd1Njcm9sbCgpO1xuICAgIH0sXG5cbiAgICBfaGlkZURvbU9uTW9iaWxlICgpIHtcbiAgICAgICAgaWYgKGNjLnN5cy5vcyA9PT0gY2Muc3lzLk9TX0FORFJPSUQpIHtcbiAgICAgICAgICAgIGlmIChfYXV0b1Jlc2l6ZSkge1xuICAgICAgICAgICAgICAgIGNjLnZpZXcucmVzaXplV2l0aEJyb3dzZXJTaXplKHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSW4gY2FzZSBlbnRlciBmdWxsIHNjcmVlbiB3aGVuIHNvZnQga2V5Ym9hcmQgc3RpbGwgc2hvd2luZ1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFfY3VycmVudEVkaXRCb3hJbXBsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfZnVsbHNjcmVlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2Mudmlldy5lbmFibGVBdXRvRnVsbFNjcmVlbih0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIERFTEFZX1RJTUUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU29tZSBicm93c2VyIGxpa2Ugd2VjaGF0IG9uIGlPUyBuZWVkIHRvIG1hbm51bGx5IHNjcm9sbCBiYWNrIHdpbmRvd1xuICAgICAgICB0aGlzLl9zY3JvbGxCYWNrV2luZG93KCk7XG4gICAgfSxcblxuICAgIC8vIGFkanVzdCB2aWV3IHRvIGVkaXRCb3hcbiAgICBfYWRqdXN0V2luZG93U2Nyb2xsICgpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5zY3JvbGxZIDwgU0NST0xMWSkge1xuICAgICAgICAgICAgICAgIHNlbGYuX2VsZW0uc2Nyb2xsSW50b1ZpZXcoe2Jsb2NrOiBcInN0YXJ0XCIsIGlubGluZTogXCJuZWFyZXN0XCIsIGJlaGF2aW9yOiBcInNtb290aFwifSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIERFTEFZX1RJTUUpO1xuICAgIH0sXG5cbiAgICBfc2Nyb2xsQmFja1dpbmRvdyAoKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gRklYOiB3ZWNoYXQgYnJvd3NlciBidWcgb24gaU9TXG4gICAgICAgICAgICAvLyBJZiBnYW1lQ29udGFpbmVyIGlzIGluY2x1ZGVkIGluIGlmcmFtZSxcbiAgICAgICAgICAgIC8vIE5lZWQgdG8gc2Nyb2xsIHRoZSB0b3Agd2luZG93LCBub3QgdGhlIG9uZSBpbiB0aGUgaWZyYW1lXG4gICAgICAgICAgICAvLyBSZWZlcmVuY2U6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XaW5kb3cvdG9wXG4gICAgICAgICAgICBsZXQgc3lzID0gY2Muc3lzO1xuICAgICAgICAgICAgaWYgKHN5cy5icm93c2VyVHlwZSA9PT0gc3lzLkJST1dTRVJfVFlQRV9XRUNIQVQgJiYgc3lzLm9zID09PSBzeXMuT1NfSU9TKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LnRvcCAmJiB3aW5kb3cudG9wLnNjcm9sbFRvKDAsIDApO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIDApO1xuICAgICAgICB9LCBERUxBWV9USU1FKTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZU1hdHJpeCAoKSB7ICAgIFxuICAgICAgICBsZXQgbm9kZSA9IHRoaXMuX2RlbGVnYXRlLm5vZGU7ICAgIFxuICAgICAgICBub2RlLmdldFdvcmxkTWF0cml4KHRoaXMuX3dvcmxkTWF0KTtcbiAgICAgICAgbGV0IHdvcmxkTWF0ID0gdGhpcy5fd29ybGRNYXQ7XG4gICAgICAgIGxldCB3b3JsZE1hdG0gPSB3b3JsZE1hdC5tO1xuXG4gICAgICAgIC8vIGNoZWNrIHdoZXRoZXIgbmVlZCB0byB1cGRhdGVcbiAgICAgICAgaWYgKHRoaXMuX20wMCA9PT0gd29ybGRNYXRtWzBdICYmIHRoaXMuX20wMSA9PT0gd29ybGRNYXRtWzFdICYmXG4gICAgICAgICAgICB0aGlzLl9tMDQgPT09IHdvcmxkTWF0bVs0XSAmJiB0aGlzLl9tMDUgPT09IHdvcmxkTWF0bVs1XSAmJlxuICAgICAgICAgICAgdGhpcy5fbTEyID09PSB3b3JsZE1hdG1bMTJdICYmIHRoaXMuX20xMyA9PT0gd29ybGRNYXRtWzEzXSAmJlxuICAgICAgICAgICAgdGhpcy5fdyA9PT0gbm9kZS5fY29udGVudFNpemUud2lkdGggJiYgdGhpcy5faCA9PT0gbm9kZS5fY29udGVudFNpemUuaGVpZ2h0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyB1cGRhdGUgbWF0cml4IGNhY2hlXG4gICAgICAgIHRoaXMuX20wMCA9IHdvcmxkTWF0bVswXTtcbiAgICAgICAgdGhpcy5fbTAxID0gd29ybGRNYXRtWzFdO1xuICAgICAgICB0aGlzLl9tMDQgPSB3b3JsZE1hdG1bNF07XG4gICAgICAgIHRoaXMuX20wNSA9IHdvcmxkTWF0bVs1XTtcbiAgICAgICAgdGhpcy5fbTEyID0gd29ybGRNYXRtWzEyXTtcbiAgICAgICAgdGhpcy5fbTEzID0gd29ybGRNYXRtWzEzXTtcbiAgICAgICAgdGhpcy5fdyA9IG5vZGUuX2NvbnRlbnRTaXplLndpZHRoO1xuICAgICAgICB0aGlzLl9oID0gbm9kZS5fY29udGVudFNpemUuaGVpZ2h0O1xuXG4gICAgICAgIGxldCBzY2FsZVggPSBjYy52aWV3Ll9zY2FsZVgsIHNjYWxlWSA9IGNjLnZpZXcuX3NjYWxlWSxcbiAgICAgICAgICAgIHZpZXdwb3J0ID0gY2Mudmlldy5fdmlld3BvcnRSZWN0LFxuICAgICAgICAgICAgZHByID0gY2Mudmlldy5fZGV2aWNlUGl4ZWxSYXRpbztcblxuICAgICAgICBfdmVjMy54ID0gLW5vZGUuX2FuY2hvclBvaW50LnggKiB0aGlzLl93O1xuICAgICAgICBfdmVjMy55ID0gLW5vZGUuX2FuY2hvclBvaW50LnkgKiB0aGlzLl9oO1xuICAgIFxuICAgICAgICBNYXQ0LnRyYW5zZm9ybSh3b3JsZE1hdCwgd29ybGRNYXQsIF92ZWMzKTtcblxuICAgICAgICAvLyBjYW4ndCBmaW5kIGNhbWVyYSBpbiBlZGl0b3JcbiAgICAgICAgbGV0IGNhbWVyYU1hdDtcbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgY2FtZXJhTWF0ID0gdGhpcy5fY2FtZXJhTWF0ID0gd29ybGRNYXQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgY2FtZXJhID0gY2MuQ2FtZXJhLmZpbmRDYW1lcmEobm9kZSk7XG4gICAgICAgICAgICBjYW1lcmEuZ2V0V29ybGRUb1NjcmVlbk1hdHJpeDJEKHRoaXMuX2NhbWVyYU1hdCk7XG4gICAgICAgICAgICBjYW1lcmFNYXQgPSB0aGlzLl9jYW1lcmFNYXQ7XG4gICAgICAgICAgICBNYXQ0Lm11bChjYW1lcmFNYXQsIGNhbWVyYU1hdCwgd29ybGRNYXQpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIFxuICAgICAgICBzY2FsZVggLz0gZHByO1xuICAgICAgICBzY2FsZVkgLz0gZHByO1xuICAgIFxuICAgICAgICBsZXQgY29udGFpbmVyID0gY2MuZ2FtZS5jb250YWluZXI7XG4gICAgICAgIGxldCBjYW1lcmFNYXRtID0gY2FtZXJhTWF0Lm07XG4gICAgICAgIGxldCBhID0gY2FtZXJhTWF0bVswXSAqIHNjYWxlWCwgYiA9IGNhbWVyYU1hdG1bMV0sIGMgPSBjYW1lcmFNYXRtWzRdLCBkID0gY2FtZXJhTWF0bVs1XSAqIHNjYWxlWTtcbiAgICBcbiAgICAgICAgbGV0IG9mZnNldFggPSBjb250YWluZXIgJiYgY29udGFpbmVyLnN0eWxlLnBhZGRpbmdMZWZ0ICYmIHBhcnNlSW50KGNvbnRhaW5lci5zdHlsZS5wYWRkaW5nTGVmdCk7XG4gICAgICAgIG9mZnNldFggKz0gdmlld3BvcnQueCAvIGRwcjtcbiAgICAgICAgbGV0IG9mZnNldFkgPSBjb250YWluZXIgJiYgY29udGFpbmVyLnN0eWxlLnBhZGRpbmdCb3R0b20gJiYgcGFyc2VJbnQoY29udGFpbmVyLnN0eWxlLnBhZGRpbmdCb3R0b20pO1xuICAgICAgICBvZmZzZXRZICs9IHZpZXdwb3J0LnkgLyBkcHI7XG4gICAgICAgIGxldCB0eCA9IGNhbWVyYU1hdG1bMTJdICogc2NhbGVYICsgb2Zmc2V0WCwgdHkgPSBjYW1lcmFNYXRtWzEzXSAqIHNjYWxlWSArIG9mZnNldFk7XG4gICAgXG4gICAgICAgIGlmIChwb2x5ZmlsbC56b29tSW52YWxpZCkge1xuICAgICAgICAgICAgdGhpcy5zZXRTaXplKG5vZGUud2lkdGggKiBhLCBub2RlLmhlaWdodCAqIGQpO1xuICAgICAgICAgICAgYSA9IDE7XG4gICAgICAgICAgICBkID0gMTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBsZXQgZWxlbSA9IHRoaXMuX2VsZW07XG4gICAgICAgIGxldCBtYXRyaXggPSBcIm1hdHJpeChcIiArIGEgKyBcIixcIiArIC1iICsgXCIsXCIgKyAtYyArIFwiLFwiICsgZCArIFwiLFwiICsgdHggKyBcIixcIiArIC10eSArIFwiKVwiO1xuICAgICAgICBlbGVtLnN0eWxlWyd0cmFuc2Zvcm0nXSA9IG1hdHJpeDtcbiAgICAgICAgZWxlbS5zdHlsZVsnLXdlYmtpdC10cmFuc2Zvcm0nXSA9IG1hdHJpeDtcbiAgICAgICAgZWxlbS5zdHlsZVsndHJhbnNmb3JtLW9yaWdpbiddID0gJzBweCAxMDAlIDBweCc7XG4gICAgICAgIGVsZW0uc3R5bGVbJy13ZWJraXQtdHJhbnNmb3JtLW9yaWdpbiddID0gJzBweCAxMDAlIDBweCc7XG4gICAgfSxcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBpbnB1dCB0eXBlIGFuZCBtYXggbGVuZ3RoXG4gICAgX3VwZGF0ZUlucHV0VHlwZSAoKSB7XG4gICAgICAgIGxldCBkZWxlZ2F0ZSA9IHRoaXMuX2RlbGVnYXRlLFxuICAgICAgICAgICAgaW5wdXRNb2RlID0gZGVsZWdhdGUuaW5wdXRNb2RlLFxuICAgICAgICAgICAgaW5wdXRGbGFnID0gZGVsZWdhdGUuaW5wdXRGbGFnLFxuICAgICAgICAgICAgcmV0dXJuVHlwZSA9IGRlbGVnYXRlLnJldHVyblR5cGUsXG4gICAgICAgICAgICBlbGVtID0gdGhpcy5fZWxlbTtcblxuICAgICAgICAvLyB3aGV0aGVyIG5lZWQgdG8gdXBkYXRlXG4gICAgICAgIGlmICh0aGlzLl9pbnB1dE1vZGUgPT09IGlucHV0TW9kZSAmJlxuICAgICAgICAgICAgdGhpcy5faW5wdXRGbGFnID09PSBpbnB1dEZsYWcgJiZcbiAgICAgICAgICAgIHRoaXMuX3JldHVyblR5cGUgPT09IHJldHVyblR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVwZGF0ZSBjYWNoZVxuICAgICAgICB0aGlzLl9pbnB1dE1vZGUgPSBpbnB1dE1vZGU7XG4gICAgICAgIHRoaXMuX2lucHV0RmxhZyA9IGlucHV0RmxhZztcbiAgICAgICAgdGhpcy5fcmV0dXJuVHlwZSA9IHJldHVyblR5cGU7XG5cbiAgICAgICAgLy8gRklYIE1FOiBUZXh0QXJlYSBhY3R1YWxseSBkb3NlIG5vdCBzdXBwb3J0IHBhc3N3b3JkIHR5cGUuXG4gICAgICAgIGlmICh0aGlzLl9pc1RleHRBcmVhKSB7XG4gICAgICAgICAgICAvLyBpbnB1dCBmbGFnXG4gICAgICAgICAgICBsZXQgdGV4dFRyYW5zZm9ybSA9ICdub25lJztcbiAgICAgICAgICAgIGlmIChpbnB1dEZsYWcgPT09IElucHV0RmxhZy5JTklUSUFMX0NBUFNfQUxMX0NIQVJBQ1RFUlMpIHtcbiAgICAgICAgICAgICAgICB0ZXh0VHJhbnNmb3JtID0gJ3VwcGVyY2FzZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpbnB1dEZsYWcgPT09IElucHV0RmxhZy5JTklUSUFMX0NBUFNfV09SRCkge1xuICAgICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm0gPSAnY2FwaXRhbGl6ZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbGVtLnN0eWxlLnRleHRUcmFuc2Zvcm0gPSB0ZXh0VHJhbnNmb3JtO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIC8vIGJlZ2luIHRvIHVwZGF0ZUlucHV0VHlwZVxuICAgICAgICBpZiAoaW5wdXRGbGFnID09PSBJbnB1dEZsYWcuUEFTU1dPUkQpIHtcbiAgICAgICAgICAgIGVsZW0udHlwZSA9ICdwYXNzd29yZCc7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgLy8gaW5wdXQgbW9kZVxuICAgICAgICBsZXQgdHlwZSA9IGVsZW0udHlwZTtcbiAgICAgICAgaWYgKGlucHV0TW9kZSA9PT0gSW5wdXRNb2RlLkVNQUlMX0FERFIpIHtcbiAgICAgICAgICAgIHR5cGUgPSAnZW1haWwnO1xuICAgICAgICB9IGVsc2UgaWYoaW5wdXRNb2RlID09PSBJbnB1dE1vZGUuTlVNRVJJQyB8fCBpbnB1dE1vZGUgPT09IElucHV0TW9kZS5ERUNJTUFMKSB7XG4gICAgICAgICAgICB0eXBlID0gJ251bWJlcic7XG4gICAgICAgIH0gZWxzZSBpZihpbnB1dE1vZGUgPT09IElucHV0TW9kZS5QSE9ORV9OVU1CRVIpIHtcbiAgICAgICAgICAgIHR5cGUgPSAnbnVtYmVyJztcbiAgICAgICAgICAgIGVsZW0ucGF0dGVybiA9ICdbMC05XSonO1xuICAgICAgICB9IGVsc2UgaWYoaW5wdXRNb2RlID09PSBJbnB1dE1vZGUuVVJMKSB7XG4gICAgICAgICAgICB0eXBlID0gJ3VybCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0eXBlID0gJ3RleHQnO1xuICAgIFxuICAgICAgICAgICAgaWYgKHJldHVyblR5cGUgPT09IEtleWJvYXJkUmV0dXJuVHlwZS5TRUFSQ0gpIHtcbiAgICAgICAgICAgICAgICB0eXBlID0gJ3NlYXJjaCc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxlbS50eXBlID0gdHlwZTtcblxuICAgICAgICAvLyBpbnB1dCBmbGFnXG4gICAgICAgIGxldCB0ZXh0VHJhbnNmb3JtID0gJ25vbmUnO1xuICAgICAgICBpZiAoaW5wdXRGbGFnID09PSBJbnB1dEZsYWcuSU5JVElBTF9DQVBTX0FMTF9DSEFSQUNURVJTKSB7XG4gICAgICAgICAgICB0ZXh0VHJhbnNmb3JtID0gJ3VwcGVyY2FzZSc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaW5wdXRGbGFnID09PSBJbnB1dEZsYWcuSU5JVElBTF9DQVBTX1dPUkQpIHtcbiAgICAgICAgICAgIHRleHRUcmFuc2Zvcm0gPSAnY2FwaXRhbGl6ZSc7XG4gICAgICAgIH1cbiAgICAgICAgZWxlbS5zdHlsZS50ZXh0VHJhbnNmb3JtID0gdGV4dFRyYW5zZm9ybTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZU1heExlbmd0aCAoKSB7XG4gICAgICAgIGxldCBtYXhMZW5ndGggPSB0aGlzLl9kZWxlZ2F0ZS5tYXhMZW5ndGg7XG4gICAgICAgIGlmKG1heExlbmd0aCA8IDApIHtcbiAgICAgICAgICAgIC8vd2UgY2FuJ3Qgc2V0IE51bWJlci5NQVhfVkFMVUUgdG8gaW5wdXQncyBtYXhMZW5ndGggcHJvcGVydHlcbiAgICAgICAgICAgIC8vc28gd2UgdXNlIGEgbWFnaWMgbnVtYmVyIGhlcmUsIGl0IHNob3VsZCB3b3JrcyBhdCBtb3N0IHVzZSBjYXNlcy5cbiAgICAgICAgICAgIG1heExlbmd0aCA9IDY1NTM1O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2VsZW0ubWF4TGVuZ3RoID0gbWF4TGVuZ3RoO1xuICAgIH0sXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gc3R5bGUgc2hlZXRcbiAgICBfaW5pdFN0eWxlU2hlZXQgKCkge1xuICAgICAgICBsZXQgZWxlbSA9IHRoaXMuX2VsZW07XG4gICAgICAgIGVsZW0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgZWxlbS5zdHlsZS5ib3JkZXIgPSAwO1xuICAgICAgICBlbGVtLnN0eWxlLmJhY2tncm91bmQgPSAndHJhbnNwYXJlbnQnO1xuICAgICAgICBlbGVtLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgICAgICBlbGVtLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcbiAgICAgICAgZWxlbS5zdHlsZS5hY3RpdmUgPSAwO1xuICAgICAgICBlbGVtLnN0eWxlLm91dGxpbmUgPSAnbWVkaXVtJztcbiAgICAgICAgZWxlbS5zdHlsZS5wYWRkaW5nID0gJzAnO1xuICAgICAgICBlbGVtLnN0eWxlLnRleHRUcmFuc2Zvcm0gPSAndXBwZXJjYXNlJztcbiAgICAgICAgZWxlbS5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgZWxlbS5zdHlsZS5ib3R0b20gPSBcIjBweFwiO1xuICAgICAgICBlbGVtLnN0eWxlLmxlZnQgPSBMRUZUX1BBRERJTkcgKyBcInB4XCI7XG4gICAgICAgIGVsZW0uY2xhc3NOYW1lID0gXCJjb2Nvc0VkaXRCb3hcIjtcbiAgICAgICAgZWxlbS5pZCA9IHRoaXMuX2RvbUlkO1xuXG4gICAgICAgIGlmICghdGhpcy5faXNUZXh0QXJlYSkge1xuICAgICAgICAgICAgZWxlbS50eXBlID0gJ3RleHQnO1xuICAgICAgICAgICAgZWxlbS5zdHlsZVsnLW1vei1hcHBlYXJhbmNlJ10gPSAndGV4dGZpZWxkJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGVsZW0uc3R5bGUucmVzaXplID0gJ25vbmUnO1xuICAgICAgICAgICAgZWxlbS5zdHlsZS5vdmVyZmxvd195ID0gJ3Njcm9sbCc7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9wbGFjZWhvbGRlclN0eWxlU2hlZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIH0sXG4gICAgXG4gICAgX3VwZGF0ZVN0eWxlU2hlZXQgKCkge1xuICAgICAgICBsZXQgZGVsZWdhdGUgPSB0aGlzLl9kZWxlZ2F0ZSxcbiAgICAgICAgICAgIGVsZW0gPSB0aGlzLl9lbGVtO1xuXG4gICAgICAgIGVsZW0udmFsdWUgPSBkZWxlZ2F0ZS5zdHJpbmc7XG4gICAgICAgIGVsZW0ucGxhY2Vob2xkZXIgPSBkZWxlZ2F0ZS5wbGFjZWhvbGRlcjtcblxuICAgICAgICB0aGlzLl91cGRhdGVUZXh0TGFiZWwoZGVsZWdhdGUudGV4dExhYmVsKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlUGxhY2Vob2xkZXJMYWJlbChkZWxlZ2F0ZS5wbGFjZWhvbGRlckxhYmVsKTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZVRleHRMYWJlbCAodGV4dExhYmVsKSB7XG4gICAgICAgIGlmICghdGV4dExhYmVsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gZ2V0IGZvbnRcbiAgICAgICAgbGV0IGZvbnQgPSB0ZXh0TGFiZWwuZm9udDtcbiAgICAgICAgaWYgKGZvbnQgJiYgIShmb250IGluc3RhbmNlb2YgY2MuQml0bWFwRm9udCkpIHtcbiAgICAgICAgICAgIGZvbnQgPSBmb250Ll9mb250RmFtaWx5O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZm9udCA9IHRleHRMYWJlbC5mb250RmFtaWx5O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZ2V0IGZvbnQgc2l6ZVxuICAgICAgICBsZXQgZm9udFNpemUgPSB0ZXh0TGFiZWwuZm9udFNpemUgKiB0ZXh0TGFiZWwubm9kZS5zY2FsZVk7XG5cbiAgICAgICAgLy8gd2hldGhlciBuZWVkIHRvIHVwZGF0ZVxuICAgICAgICBpZiAodGhpcy5fdGV4dExhYmVsRm9udCA9PT0gZm9udFxuICAgICAgICAgICAgJiYgdGhpcy5fdGV4dExhYmVsRm9udFNpemUgPT09IGZvbnRTaXplXG4gICAgICAgICAgICAmJiB0aGlzLl90ZXh0TGFiZWxGb250Q29sb3IgPT09IHRleHRMYWJlbC5mb250Q29sb3JcbiAgICAgICAgICAgICYmIHRoaXMuX3RleHRMYWJlbEFsaWduID09PSB0ZXh0TGFiZWwuaG9yaXpvbnRhbEFsaWduKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdXBkYXRlIGNhY2hlXG4gICAgICAgIHRoaXMuX3RleHRMYWJlbEZvbnQgPSBmb250O1xuICAgICAgICB0aGlzLl90ZXh0TGFiZWxGb250U2l6ZSA9IGZvbnRTaXplO1xuICAgICAgICB0aGlzLl90ZXh0TGFiZWxGb250Q29sb3IgPSB0ZXh0TGFiZWwuZm9udENvbG9yO1xuICAgICAgICB0aGlzLl90ZXh0TGFiZWxBbGlnbiA9IHRleHRMYWJlbC5ob3Jpem9udGFsQWxpZ247XG5cbiAgICAgICAgbGV0IGVsZW0gPSB0aGlzLl9lbGVtO1xuICAgICAgICAvLyBmb250IHNpemVcbiAgICAgICAgZWxlbS5zdHlsZS5mb250U2l6ZSA9IGAke2ZvbnRTaXplfXB4YDtcbiAgICAgICAgLy8gZm9udCBjb2xvclxuICAgICAgICBlbGVtLnN0eWxlLmNvbG9yID0gdGV4dExhYmVsLm5vZGUuY29sb3IudG9DU1MoJ3JnYmEnKTtcbiAgICAgICAgLy8gZm9udCBmYW1pbHlcbiAgICAgICAgZWxlbS5zdHlsZS5mb250RmFtaWx5ID0gZm9udDtcbiAgICAgICAgLy8gdGV4dC1hbGlnblxuICAgICAgICBzd2l0Y2godGV4dExhYmVsLmhvcml6b250YWxBbGlnbikge1xuICAgICAgICAgICAgY2FzZSBMYWJlbC5Ib3Jpem9udGFsQWxpZ24uTEVGVDpcbiAgICAgICAgICAgICAgICBlbGVtLnN0eWxlLnRleHRBbGlnbiA9ICdsZWZ0JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgTGFiZWwuSG9yaXpvbnRhbEFsaWduLkNFTlRFUjpcbiAgICAgICAgICAgICAgICBlbGVtLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBMYWJlbC5Ib3Jpem9udGFsQWxpZ24uUklHSFQ6XG4gICAgICAgICAgICAgICAgZWxlbS5zdHlsZS50ZXh0QWxpZ24gPSAncmlnaHQnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIC8vIGxpbmVIZWlnaHRcbiAgICAgICAgLy8gQ2FuJ3Qgc3luYyBsaW5lSGVpZ2h0IHByb3BlcnR5LCBiZWNhdXNlIGxpbmVIZWlnaHQgd291bGQgY2hhbmdlIHRoZSB0b3VjaCBhcmVhIG9mIGlucHV0XG4gICAgfSxcblxuICAgIF91cGRhdGVQbGFjZWhvbGRlckxhYmVsIChwbGFjZWhvbGRlckxhYmVsKSB7XG4gICAgICAgIGlmICghcGxhY2Vob2xkZXJMYWJlbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZ2V0IGZvbnRcbiAgICAgICAgbGV0IGZvbnQgPSBwbGFjZWhvbGRlckxhYmVsLmZvbnQ7XG4gICAgICAgIGlmIChmb250ICYmICEoZm9udCBpbnN0YW5jZW9mIGNjLkJpdG1hcEZvbnQpKSB7XG4gICAgICAgICAgICBmb250ID0gcGxhY2Vob2xkZXJMYWJlbC5mb250Ll9mb250RmFtaWx5O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZm9udCA9IHBsYWNlaG9sZGVyTGFiZWwuZm9udEZhbWlseTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGdldCBmb250IHNpemVcbiAgICAgICAgbGV0IGZvbnRTaXplID0gcGxhY2Vob2xkZXJMYWJlbC5mb250U2l6ZSAqIHBsYWNlaG9sZGVyTGFiZWwubm9kZS5zY2FsZVk7XG5cbiAgICAgICAgLy8gd2hldGhlciBuZWVkIHRvIHVwZGF0ZVxuICAgICAgICBpZiAodGhpcy5fcGxhY2Vob2xkZXJMYWJlbEZvbnQgPT09IGZvbnRcbiAgICAgICAgICAgICYmIHRoaXMuX3BsYWNlaG9sZGVyTGFiZWxGb250U2l6ZSA9PT0gZm9udFNpemVcbiAgICAgICAgICAgICYmIHRoaXMuX3BsYWNlaG9sZGVyTGFiZWxGb250Q29sb3IgPT09IHBsYWNlaG9sZGVyTGFiZWwuZm9udENvbG9yXG4gICAgICAgICAgICAmJiB0aGlzLl9wbGFjZWhvbGRlckxhYmVsQWxpZ24gPT09IHBsYWNlaG9sZGVyTGFiZWwuaG9yaXpvbnRhbEFsaWduXG4gICAgICAgICAgICAmJiB0aGlzLl9wbGFjZWhvbGRlckxpbmVIZWlnaHQgPT09IHBsYWNlaG9sZGVyTGFiZWwuZm9udFNpemUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyB1cGRhdGUgY2FjaGVcbiAgICAgICAgdGhpcy5fcGxhY2Vob2xkZXJMYWJlbEZvbnQgPSBmb250O1xuICAgICAgICB0aGlzLl9wbGFjZWhvbGRlckxhYmVsRm9udFNpemUgPSBmb250U2l6ZTtcbiAgICAgICAgdGhpcy5fcGxhY2Vob2xkZXJMYWJlbEZvbnRDb2xvciA9IHBsYWNlaG9sZGVyTGFiZWwuZm9udENvbG9yO1xuICAgICAgICB0aGlzLl9wbGFjZWhvbGRlckxhYmVsQWxpZ24gPSBwbGFjZWhvbGRlckxhYmVsLmhvcml6b250YWxBbGlnbjtcbiAgICAgICAgdGhpcy5fcGxhY2Vob2xkZXJMaW5lSGVpZ2h0ID0gcGxhY2Vob2xkZXJMYWJlbC5mb250U2l6ZTtcblxuICAgICAgICBsZXQgc3R5bGVFbCA9IHRoaXMuX3BsYWNlaG9sZGVyU3R5bGVTaGVldDtcbiAgICAgICAgXG4gICAgICAgIC8vIGZvbnQgY29sb3JcbiAgICAgICAgbGV0IGZvbnRDb2xvciA9IHBsYWNlaG9sZGVyTGFiZWwubm9kZS5jb2xvci50b0NTUygncmdiYScpO1xuICAgICAgICAvLyBsaW5lIGhlaWdodFxuICAgICAgICBsZXQgbGluZUhlaWdodCA9IHBsYWNlaG9sZGVyTGFiZWwuZm9udFNpemU7ICAvLyB0b3AgdmVydGljYWwgYWxpZ24gYnkgZGVmYXVsdFxuICAgICAgICAvLyBob3Jpem9udGFsIGFsaWduXG4gICAgICAgIGxldCBob3Jpem9udGFsQWxpZ247XG4gICAgICAgIHN3aXRjaCAocGxhY2Vob2xkZXJMYWJlbC5ob3Jpem9udGFsQWxpZ24pIHtcbiAgICAgICAgICAgIGNhc2UgTGFiZWwuSG9yaXpvbnRhbEFsaWduLkxFRlQ6XG4gICAgICAgICAgICAgICAgaG9yaXpvbnRhbEFsaWduID0gJ2xlZnQnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBMYWJlbC5Ib3Jpem9udGFsQWxpZ24uQ0VOVEVSOlxuICAgICAgICAgICAgICAgIGhvcml6b250YWxBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBMYWJlbC5Ib3Jpem9udGFsQWxpZ24uUklHSFQ6XG4gICAgICAgICAgICAgICAgaG9yaXpvbnRhbEFsaWduID0gJ3JpZ2h0JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHN0eWxlRWwuaW5uZXJIVE1MID0gYCMke3RoaXMuX2RvbUlkfTo6LXdlYmtpdC1pbnB1dC1wbGFjZWhvbGRlciwjJHt0aGlzLl9kb21JZH06Oi1tb3otcGxhY2Vob2xkZXIsIyR7dGhpcy5fZG9tSWR9Oi1tcy1pbnB1dC1wbGFjZWhvbGRlcmAgK1xuICAgICAgICBge3RleHQtdHJhbnNmb3JtOiBpbml0aWFsOyBmb250LWZhbWlseTogJHtmb250fTsgZm9udC1zaXplOiAke2ZvbnRTaXplfXB4OyBjb2xvcjogJHtmb250Q29sb3J9OyBsaW5lLWhlaWdodDogJHtsaW5lSGVpZ2h0fXB4OyB0ZXh0LWFsaWduOiAke2hvcml6b250YWxBbGlnbn07fWA7XG4gICAgICAgIC8vIEVER0VfQlVHX0ZJWDogaGlkZSBjbGVhciBidXR0b24sIGJlY2F1c2UgY2xlYXJpbmcgaW5wdXQgYm94IGluIEVkZ2UgZG9lcyBub3QgZW1pdCBpbnB1dCBldmVudCBcbiAgICAgICAgLy8gaXNzdWUgcmVmZmVyZW5jZTogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMjYzMDdcbiAgICAgICAgaWYgKGNjLnN5cy5icm93c2VyVHlwZSA9PT0gY2Muc3lzLkJST1dTRVJfVFlQRV9FREdFKSB7XG4gICAgICAgICAgICBzdHlsZUVsLmlubmVySFRNTCArPSBgIyR7dGhpcy5fZG9tSWR9OjotbXMtY2xlYXJ7ZGlzcGxheTogbm9uZTt9YDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gaGFuZGxlIGV2ZW50IGxpc3RlbmVyc1xuICAgIF9yZWdpc3RlckV2ZW50TGlzdGVuZXJzICgpIHsgICAgICAgIFxuICAgICAgICBsZXQgaW1wbCA9IHRoaXMsXG4gICAgICAgICAgICBlbGVtID0gdGhpcy5fZWxlbSxcbiAgICAgICAgICAgIGlucHV0TG9jayA9IGZhbHNlLFxuICAgICAgICAgICAgY2JzID0gdGhpcy5fZXZlbnRMaXN0ZW5lcnM7XG5cbiAgICAgICAgY2JzLmNvbXBvc2l0aW9uU3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpbnB1dExvY2sgPSB0cnVlO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgY2JzLmNvbXBvc2l0aW9uRW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaW5wdXRMb2NrID0gZmFsc2U7XG4gICAgICAgICAgICBpbXBsLl9kZWxlZ2F0ZS5lZGl0Qm94VGV4dENoYW5nZWQoZWxlbS52YWx1ZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY2JzLm9uSW5wdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoaW5wdXRMb2NrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW1wbC5fZGVsZWdhdGUuZWRpdEJveFRleHRDaGFuZ2VkKGVsZW0udmFsdWUpO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgLy8gVGhlcmUgYXJlIDIgd2F5cyB0byBmb2N1cyBvbiB0aGUgaW5wdXQgZWxlbWVudDpcbiAgICAgICAgLy8gQ2xpY2sgdGhlIGlucHV0IGVsZW1lbnQsIG9yIGNhbGwgaW5wdXQuZm9jdXMoKS5cbiAgICAgICAgLy8gQm90aCBuZWVkIHRvIGFkanVzdCB3aW5kb3cgc2Nyb2xsLlxuICAgICAgICBjYnMub25DbGljayA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAvLyBJbiBjYXNlIG9wZXJhdGlvbiBzZXF1ZW5jZTogY2xpY2sgaW5wdXQsIGhpZGUga2V5Ym9hcmQsIHRoZW4gY2xpY2sgYWdhaW4uXG4gICAgICAgICAgICBpZiAoaW1wbC5fZWRpdGluZykge1xuICAgICAgICAgICAgICAgIGlmIChjYy5zeXMuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaW1wbC5fYWRqdXN0V2luZG93U2Nyb2xsKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgY2JzLm9uS2V5ZG93biA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09PSBtYWNyby5LRVkuZW50ZXIpIHtcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGltcGwuX2RlbGVnYXRlLmVkaXRCb3hFZGl0aW5nUmV0dXJuKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWltcGwuX2lzVGV4dEFyZWEpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5ibHVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoZS5rZXlDb2RlID09PSBtYWNyby5LRVkudGFiKSB7XG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICB0YWJJbmRleFV0aWwubmV4dChpbXBsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjYnMub25CbHVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaW1wbC5fZWRpdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgX2N1cnJlbnRFZGl0Qm94SW1wbCA9IG51bGw7XG4gICAgICAgICAgICBpbXBsLl9oaWRlRG9tKCk7XG4gICAgICAgICAgICBpbXBsLl9kZWxlZ2F0ZS5lZGl0Qm94RWRpdGluZ0RpZEVuZGVkKCk7XG4gICAgICAgIH07XG5cblxuICAgICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbXBvc2l0aW9uc3RhcnQnLCBjYnMuY29tcG9zaXRpb25TdGFydCk7XG4gICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcignY29tcG9zaXRpb25lbmQnLCBjYnMuY29tcG9zaXRpb25FbmQpO1xuICAgICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgY2JzLm9uSW5wdXQpO1xuICAgICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBjYnMub25LZXlkb3duKTtcbiAgICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgY2JzLm9uQmx1cik7XG4gICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGNicy5vbkNsaWNrKTtcbiAgICB9LFxuXG4gICAgX3JlbW92ZUV2ZW50TGlzdGVuZXJzICgpIHtcbiAgICAgICAgbGV0IGVsZW0gPSB0aGlzLl9lbGVtLFxuICAgICAgICAgICAgY2JzID0gdGhpcy5fZXZlbnRMaXN0ZW5lcnM7XG5cbiAgICAgICAgZWxlbS5yZW1vdmVFdmVudExpc3RlbmVyKCdjb21wb3NpdGlvbnN0YXJ0JywgY2JzLmNvbXBvc2l0aW9uU3RhcnQpO1xuICAgICAgICBlbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NvbXBvc2l0aW9uZW5kJywgY2JzLmNvbXBvc2l0aW9uRW5kKTtcbiAgICAgICAgZWxlbS5yZW1vdmVFdmVudExpc3RlbmVyKCdpbnB1dCcsIGNicy5vbklucHV0KTtcbiAgICAgICAgZWxlbS5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgY2JzLm9uS2V5ZG93bik7XG4gICAgICAgIGVsZW0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmx1cicsIGNicy5vbkJsdXIpO1xuICAgICAgICBlbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBjYnMub25DbGljayk7XG4gICAgICAgIFxuICAgICAgICBjYnMuY29tcG9zaXRpb25TdGFydCA9IG51bGw7XG4gICAgICAgIGNicy5jb21wb3NpdGlvbkVuZCA9IG51bGw7XG4gICAgICAgIGNicy5vbklucHV0ID0gbnVsbDtcbiAgICAgICAgY2JzLm9uS2V5ZG93biA9IG51bGw7XG4gICAgICAgIGNicy5vbkJsdXIgPSBudWxsO1xuICAgICAgICBjYnMub25DbGljayA9IG51bGw7XG4gICAgfSxcbn0pO1xuXG4iXX0=