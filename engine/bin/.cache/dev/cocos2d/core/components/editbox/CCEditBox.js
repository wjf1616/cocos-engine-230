
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/editbox/CCEditBox.js';
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
var macro = require('../../platform/CCMacro');

var EditBoxImplBase = require('../editbox/EditBoxImplBase');

var Label = require('../CCLabel');

var Types = require('./types');

var InputMode = Types.InputMode;
var InputFlag = Types.InputFlag;
var KeyboardReturnType = Types.KeyboardReturnType;

function capitalize(string) {
  return string.replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
/**
 * !#en cc.EditBox is a component for inputing text, you can use it to gather small amounts of text from users.
 * !#zh EditBox 组件，用于获取用户的输入文本。
 * @class EditBox
 * @extends Component
 */


var EditBox = cc.Class({
  name: 'cc.EditBox',
  "extends": cc.Component,
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.ui/EditBox',
    inspector: 'packages://inspector/inspectors/comps/cceditbox.js',
    help: 'i18n:COMPONENT.help_url.editbox',
    executeInEditMode: true
  },
  properties: {
    _useOriginalSize: true,
    _string: '',

    /**
     * !#en Input string of EditBox.
     * !#zh 输入框的初始输入内容，如果为空则会显示占位符的文本。
     * @property {String} string
     */
    string: {
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.string',
      get: function get() {
        return this._string;
      },
      set: function set(value) {
        value = '' + value;

        if (this.maxLength >= 0 && value.length >= this.maxLength) {
          value = value.slice(0, this.maxLength);
        }

        this._string = value;

        this._updateString(value);
      }
    },

    /**
     * !#en The Label component attached to the node for EditBox's input text label
     * !#zh 输入框输入文本节点上挂载的 Label 组件对象
     * @property {Label} textLabel
     */
    textLabel: {
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.textLabel',
      "default": null,
      type: Label,
      notify: function notify(oldValue) {
        if (this.textLabel && this.textLabel !== oldValue) {
          this._updateTextLabel();

          this._updateLabels();
        }
      }
    },

    /**
    * !en The Label component attached to the node for EditBox's placeholder text label
    * !zh 输入框占位符节点上挂载的 Label 组件对象
    * @property {Label} placeholderLabel
    */
    placeholderLabel: {
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.placeholderLabel',
      "default": null,
      type: Label,
      notify: function notify(oldValue) {
        if (this.placeholderLabel && this.placeholderLabel !== oldValue) {
          this._updatePlaceholderLabel();

          this._updateLabels();
        }
      }
    },

    /**
     * !#en The Sprite component attached to the node for EditBox's background
     * !#zh 输入框背景节点上挂载的 Sprite 组件对象
     * @property {Sprite} background
     */
    background: {
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.background',
      "default": null,
      type: cc.Sprite,
      notify: function notify(oldValue) {
        if (this.background && this.background !== oldValue) {
          this._updateBackgroundSprite();
        }
      }
    },
    // To be removed in the future
    _N$backgroundImage: {
      "default": undefined,
      type: cc.SpriteFrame
    },

    /**
     * !#en The background image of EditBox. This property will be removed in the future, use editBox.background instead please.
     * !#zh 输入框的背景图片。 该属性会在将来的版本中移除，请用 editBox.background
     * @property {SpriteFrame} backgroundImage
     * @deprecated since v2.1
     */
    backgroundImage: {
      get: function get() {
        // if (!CC_EDITOR) cc.warnID(5400, 'editBox.backgroundImage', 'editBox.background');
        if (!this.background) {
          return null;
        }

        return this.background.spriteFrame;
      },
      set: function set(value) {
        // if (!CC_EDITOR) cc.warnID(5400, 'editBox.backgroundImage', 'editBox.background');
        if (this.background) {
          this.background.spriteFrame = value;
        }
      }
    },

    /**
     * !#en
     * The return key type of EditBox.
     * Note: it is meaningless for web platforms and desktop platforms.
     * !#zh
     * 指定移动设备上面回车按钮的样式。
     * 注意：这个选项对 web 平台与 desktop 平台无效。
     * @property {EditBox.KeyboardReturnType} returnType
     * @default KeyboardReturnType.DEFAULT
     */
    returnType: {
      "default": KeyboardReturnType.DEFAULT,
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.returnType',
      displayName: 'KeyboardReturnType',
      type: KeyboardReturnType
    },
    // To be removed in the future
    _N$returnType: {
      "default": undefined,
      type: cc.Float
    },

    /**
     * !#en Set the input flags that are to be applied to the EditBox.
     * !#zh 指定输入标志位，可以指定输入方式为密码或者单词首字母大写。
     * @property {EditBox.InputFlag} inputFlag
     * @default InputFlag.DEFAULT
     */
    inputFlag: {
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.input_flag',
      "default": InputFlag.DEFAULT,
      type: InputFlag,
      notify: function notify() {
        this._updateString(this._string);
      }
    },

    /**
     * !#en
     * Set the input mode of the edit box.
     * If you pass ANY, it will create a multiline EditBox.
     * !#zh
     * 指定输入模式: ANY表示多行输入，其它都是单行输入，移动平台上还可以指定键盘样式。
     * @property {EditBox.InputMode} inputMode
     * @default InputMode.ANY
     */
    inputMode: {
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.input_mode',
      "default": InputMode.ANY,
      type: InputMode,
      notify: function notify(oldValue) {
        if (this.inputMode !== oldValue) {
          this._updateTextLabel();

          this._updatePlaceholderLabel();
        }
      }
    },

    /**
     * !#en Font size of the input text. This property will be removed in the future, use editBox.textLabel.fontSize instead please.
     * !#zh 输入框文本的字体大小。 该属性会在将来的版本中移除，请使用 editBox.textLabel.fontSize。
     * @property {Number} fontSize
     * @deprecated since v2.1
     */
    fontSize: {
      get: function get() {
        // if (!CC_EDITOR) cc.warnID(5400, 'editBox.fontSize', 'editBox.textLabel.fontSize');
        if (!this.textLabel) {
          return null;
        }

        return this.textLabel.fontSize;
      },
      set: function set(value) {
        // if (!CC_EDITOR) cc.warnID(5400, 'editBox.fontSize', 'editBox.textLabel.fontSize');
        if (this.textLabel) {
          this.textLabel.fontSize = value;
        }
      }
    },
    // To be removed in the future
    _N$fontSize: {
      "default": undefined,
      type: cc.Float
    },

    /**
     * !#en Change the lineHeight of displayed text. This property will be removed in the future, use editBox.textLabel.lineHeight instead.
     * !#zh 输入框文本的行高。该属性会在将来的版本中移除，请使用 editBox.textLabel.lineHeight
     * @property {Number} lineHeight
     * @deprecated since v2.1
     */
    lineHeight: {
      get: function get() {
        // if (!CC_EDITOR) cc.warnID(5400, 'editBox.lineHeight', 'editBox.textLabel.lineHeight');
        if (!this.textLabel) {
          return null;
        }

        return this.textLabel.lineHeight;
      },
      set: function set(value) {
        // if (!CC_EDITOR) cc.warnID(5400, 'editBox.lineHeight', 'editBox.textLabel.lineHeight');
        if (this.textLabel) {
          this.textLabel.lineHeight = value;
        }
      }
    },
    // To be removed in the future
    _N$lineHeight: {
      "default": undefined,
      type: cc.Float
    },

    /**
     * !#en Font color of the input text. This property will be removed in the future, use editBox.textLabel.node.color instead.
     * !#zh 输入框文本的颜色。该属性会在将来的版本中移除，请使用 editBox.textLabel.node.color
     * @property {Color} fontColor
     * @deprecated since v2.1
     */
    fontColor: {
      get: function get() {
        // if (!CC_EDITOR) cc.warnID(5400, 'editBox.fontColor', 'editBox.textLabel.node.color');
        if (!this.textLabel) {
          return null;
        }

        return this.textLabel.node.color;
      },
      set: function set(value) {
        // if (!CC_EDITOR) cc.warnID(5400, 'editBox.fontColor', 'editBox.textLabel.node.color');
        if (this.textLabel) {
          this.textLabel.node.color = value;
          this.textLabel.node.opacity = value.a;
        }
      }
    },
    // To be removed in the future
    _N$fontColor: undefined,

    /**
     * !#en The display text of placeholder.
     * !#zh 输入框占位符的文本内容。
     * @property {String} placeholder
     */
    placeholder: {
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.placeholder',
      get: function get() {
        if (!this.placeholderLabel) {
          return '';
        }

        return this.placeholderLabel.string;
      },
      set: function set(value) {
        if (this.placeholderLabel) {
          this.placeholderLabel.string = value;
        }
      }
    },
    // To be removed in the future
    _N$placeholder: {
      "default": undefined,
      type: cc.String
    },

    /**
     * !#en The font size of placeholder. This property will be removed in the future, use editBox.placeholderLabel.fontSize instead.
     * !#zh 输入框占位符的字体大小。该属性会在将来的版本中移除，请使用 editBox.placeholderLabel.fontSize
     * @property {Number} placeholderFontSize
     * @deprecated since v2.1
     */
    placeholderFontSize: {
      get: function get() {
        // if (!CC_EDITOR) cc.warnID(5400, 'editBox.placeholderFontSize', 'editBox.placeholderLabel.fontSize');
        if (!this.placeholderLabel) {
          return null;
        }

        return this.placeholderLabel.fontSize;
      },
      set: function set(value) {
        // if (!CC_EDITOR) cc.warnID(5400, 'editBox.placeholderFontSize', 'editBox.placeholderLabel.fontSize');
        if (this.placeholderLabel) {
          this.placeholderLabel.fontSize = value;
        }
      }
    },
    // To be removed in the future
    _N$placeholderFontSize: {
      "default": undefined,
      type: cc.Float
    },

    /**
     * !#en The font color of placeholder. This property will be removed in the future, use editBox.placeholderLabel.node.color instead.
     * !#zh 输入框占位符的字体颜色。该属性会在将来的版本中移除，请使用 editBox.placeholderLabel.node.color
     * @property {Color} placeholderFontColor
     * @deprecated since v2.1
     */
    placeholderFontColor: {
      get: function get() {
        // if (!CC_EDITOR) cc.warnID(5400, 'editBox.placeholderFontColor', 'editBox.placeholderLabel.node.color');
        if (!this.placeholderLabel) {
          return null;
        }

        return this.placeholderLabel.node.color;
      },
      set: function set(value) {
        // if (!CC_EDITOR) cc.warnID(5400, 'editBox.placeholderFontColor', 'editBox.placeholderLabel.node.color');
        if (this.placeholderLabel) {
          this.placeholderLabel.node.color = value;
          this.placeholderLabel.node.opacity = value.a;
        }
      }
    },
    // To be removed in the future
    _N$placeholderFontColor: undefined,

    /**
     * !#en The maximize input length of EditBox.
     * - If pass a value less than 0, it won't limit the input number of characters.
     * - If pass 0, it doesn't allow input any characters.
     * !#zh 输入框最大允许输入的字符个数。
     * - 如果值为小于 0 的值，则不会限制输入字符个数。
     * - 如果值为 0，则不允许用户进行任何输入。
     * @property {Number} maxLength
     */
    maxLength: {
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.max_length',
      "default": 20
    },
    // To be removed in the future
    _N$maxLength: {
      "default": undefined,
      type: cc.Float
    },

    /**
     * !#en The input is always visible and be on top of the game view (only useful on Web), this property will be removed on v2.1
     * !zh 输入框总是可见，并且永远在游戏视图的上面（这个属性只有在 Web 上面修改有意义），该属性会在 v2.1 中移除
     * Note: only available on Web at the moment.
     * @property {Boolean} stayOnTop
     * @deprecated since 2.0.8
     */
    stayOnTop: {
      "default": false,
      notify: function notify() {
        cc.warn('editBox.stayOnTop is removed since v2.1.');
      }
    },
    _tabIndex: 0,

    /**
     * !#en Set the tabIndex of the DOM input element (only useful on Web).
     * !#zh 修改 DOM 输入元素的 tabIndex（这个属性只有在 Web 上面修改有意义）。
     * @property {Number} tabIndex
     */
    tabIndex: {
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.tab_index',
      get: function get() {
        return this._tabIndex;
      },
      set: function set(value) {
        if (this._tabIndex !== value) {
          this._tabIndex = value;

          if (this._impl) {
            this._impl.setTabIndex(value);
          }
        }
      }
    },

    /**
     * !#en The event handler to be called when EditBox began to edit text.
     * !#zh 开始编辑文本输入框触发的事件回调。
     * @property {Component.EventHandler[]} editingDidBegan
     */
    editingDidBegan: {
      "default": [],
      type: cc.Component.EventHandler
    },

    /**
     * !#en The event handler to be called when EditBox text changes.
     * !#zh 编辑文本输入框时触发的事件回调。
     * @property {Component.EventHandler[]} textChanged
     */
    textChanged: {
      "default": [],
      type: cc.Component.EventHandler
    },

    /**
     * !#en The event handler to be called when EditBox edit ends.
     * !#zh 结束编辑文本输入框时触发的事件回调。
     * @property {Component.EventHandler[]} editingDidEnded
     */
    editingDidEnded: {
      "default": [],
      type: cc.Component.EventHandler
    },

    /**
     * !#en The event handler to be called when return key is pressed. Windows is not supported.
     * !#zh 当用户按下回车按键时的事件回调，目前不支持 windows 平台
     * @property {Component.EventHandler[]} editingReturn
     */
    editingReturn: {
      "default": [],
      type: cc.Component.EventHandler
    }
  },
  statics: {
    _ImplClass: EditBoxImplBase,
    // implemented on different platform adapter
    KeyboardReturnType: KeyboardReturnType,
    InputFlag: InputFlag,
    InputMode: InputMode
  },
  _init: function _init() {
    this._upgradeComp();

    this._isLabelVisible = true;
    this.node.on(cc.Node.EventType.SIZE_CHANGED, this._syncSize, this);
    var impl = this._impl = new EditBox._ImplClass();
    impl.init(this);

    this._updateString(this._string);

    this._syncSize();
  },
  _updateBackgroundSprite: function _updateBackgroundSprite() {
    var background = this.background; // If background doesn't exist, create one.

    if (!background) {
      var node = this.node.getChildByName('BACKGROUND_SPRITE');

      if (!node) {
        node = new cc.Node('BACKGROUND_SPRITE');
      }

      background = node.getComponent(cc.Sprite);

      if (!background) {
        background = node.addComponent(cc.Sprite);
      }

      node.parent = this.node;
      this.background = background;
    } // update


    background.type = cc.Sprite.Type.SLICED; // handle old data

    if (this._N$backgroundImage !== undefined) {
      background.spriteFrame = this._N$backgroundImage;
      this._N$backgroundImage = undefined;
    }
  },
  _updateTextLabel: function _updateTextLabel() {
    var textLabel = this.textLabel; // If textLabel doesn't exist, create one.

    if (!textLabel) {
      var node = this.node.getChildByName('TEXT_LABEL');

      if (!node) {
        node = new cc.Node('TEXT_LABEL');
      }

      textLabel = node.getComponent(Label);

      if (!textLabel) {
        textLabel = node.addComponent(Label);
      }

      node.parent = this.node;
      this.textLabel = textLabel;
    } // update


    textLabel.node.setAnchorPoint(0, 1);
    textLabel.overflow = Label.Overflow.CLAMP;

    if (this.inputMode === InputMode.ANY) {
      textLabel.verticalAlign = macro.VerticalTextAlignment.TOP;
      textLabel.enableWrapText = true;
    } else {
      textLabel.verticalAlign = macro.VerticalTextAlignment.CENTER;
      textLabel.enableWrapText = false;
    }

    textLabel.string = this._updateLabelStringStyle(this._string); // handle old data

    if (this._N$fontColor !== undefined) {
      textLabel.node.color = this._N$fontColor;
      textLabel.node.opacity = this._N$fontColor.a;
      this._N$fontColor = undefined;
    }

    if (this._N$fontSize !== undefined) {
      textLabel.fontSize = this._N$fontSize;
      this._N$fontSize = undefined;
    }

    if (this._N$lineHeight !== undefined) {
      textLabel.lineHeight = this._N$lineHeight;
      this._N$lineHeight = undefined;
    }
  },
  _updatePlaceholderLabel: function _updatePlaceholderLabel() {
    var placeholderLabel = this.placeholderLabel; // If placeholderLabel doesn't exist, create one.

    if (!placeholderLabel) {
      var node = this.node.getChildByName('PLACEHOLDER_LABEL');

      if (!node) {
        node = new cc.Node('PLACEHOLDER_LABEL');
      }

      placeholderLabel = node.getComponent(Label);

      if (!placeholderLabel) {
        placeholderLabel = node.addComponent(Label);
      }

      node.parent = this.node;
      this.placeholderLabel = placeholderLabel;
    } // update


    placeholderLabel.node.setAnchorPoint(0, 1);
    placeholderLabel.overflow = Label.Overflow.CLAMP;

    if (this.inputMode === InputMode.ANY) {
      placeholderLabel.verticalAlign = macro.VerticalTextAlignment.TOP;
      placeholderLabel.enableWrapText = true;
    } else {
      placeholderLabel.verticalAlign = macro.VerticalTextAlignment.CENTER;
      placeholderLabel.enableWrapText = false;
    }

    placeholderLabel.string = this.placeholder; // handle old data

    if (this._N$placeholderFontColor !== undefined) {
      placeholderLabel.node.color = this._N$placeholderFontColor;
      placeholderLabel.node.opacity = this._N$placeholderFontColor.a;
      this._N$placeholderFontColor = undefined;
    }

    if (this._N$placeholderFontSize !== undefined) {
      placeholderLabel.fontSize = this._N$placeholderFontSize;
      this._N$placeholderFontSize = undefined;
    }
  },
  _upgradeComp: function _upgradeComp() {
    if (this._N$returnType !== undefined) {
      this.returnType = this._N$returnType;
      this._N$returnType = undefined;
    }

    if (this._N$maxLength !== undefined) {
      this.maxLength = this._N$maxLength;
      this._N$maxLength = undefined;
    }

    if (this._N$backgroundImage !== undefined) {
      this._updateBackgroundSprite();
    }

    if (this._N$fontColor !== undefined || this._N$fontSize !== undefined || this._N$lineHeight !== undefined) {
      this._updateTextLabel();
    }

    if (this._N$placeholderFontColor !== undefined || this._N$placeholderFontSize !== undefined) {
      this._updatePlaceholderLabel();
    }

    if (this._N$placeholder !== undefined) {
      this.placeholder = this._N$placeholder;
      this._N$placeholder = undefined;
    }
  },
  _syncSize: function _syncSize() {
    if (this._impl) {
      var size = this.node.getContentSize();

      this._impl.setSize(size.width, size.height);
    }
  },
  _showLabels: function _showLabels() {
    this._isLabelVisible = true;

    this._updateLabels();
  },
  _hideLabels: function _hideLabels() {
    this._isLabelVisible = false;

    if (this.textLabel) {
      this.textLabel.node.active = false;
    }

    if (this.placeholderLabel) {
      this.placeholderLabel.node.active = false;
    }
  },
  _updateLabels: function _updateLabels() {
    if (this._isLabelVisible) {
      var content = this._string;

      if (this.textLabel) {
        this.textLabel.node.active = content !== '';
      }

      if (this.placeholderLabel) {
        this.placeholderLabel.node.active = content === '';
      }
    }
  },
  _updateString: function _updateString(text) {
    var textLabel = this.textLabel; // Not inited yet

    if (!textLabel) {
      return;
    }

    var displayText = text;

    if (displayText) {
      displayText = this._updateLabelStringStyle(displayText);
    }

    textLabel.string = displayText;

    this._updateLabels();
  },
  _updateLabelStringStyle: function _updateLabelStringStyle(text, ignorePassword) {
    var inputFlag = this.inputFlag;

    if (!ignorePassword && inputFlag === InputFlag.PASSWORD) {
      var passwordString = '';
      var len = text.length;

      for (var i = 0; i < len; ++i) {
        passwordString += "\u25CF";
      }

      text = passwordString;
    } else if (inputFlag === InputFlag.INITIAL_CAPS_ALL_CHARACTERS) {
      text = text.toUpperCase();
    } else if (inputFlag === InputFlag.INITIAL_CAPS_WORD) {
      text = capitalize(text);
    } else if (inputFlag === InputFlag.INITIAL_CAPS_SENTENCE) {
      text = capitalizeFirstLetter(text);
    }

    return text;
  },
  editBoxEditingDidBegan: function editBoxEditingDidBegan() {
    cc.Component.EventHandler.emitEvents(this.editingDidBegan, this);
    this.node.emit('editing-did-began', this);
  },
  editBoxEditingDidEnded: function editBoxEditingDidEnded() {
    cc.Component.EventHandler.emitEvents(this.editingDidEnded, this);
    this.node.emit('editing-did-ended', this);
  },
  editBoxTextChanged: function editBoxTextChanged(text) {
    text = this._updateLabelStringStyle(text, true);
    this.string = text;
    cc.Component.EventHandler.emitEvents(this.textChanged, text, this);
    this.node.emit('text-changed', this);
  },
  editBoxEditingReturn: function editBoxEditingReturn() {
    cc.Component.EventHandler.emitEvents(this.editingReturn, this);
    this.node.emit('editing-return', this);
  },
  onEnable: function onEnable() {
    if (!CC_EDITOR) {
      this._registerEvent();
    }

    if (this._impl) {
      this._impl.enable();
    }
  },
  onDisable: function onDisable() {
    if (!CC_EDITOR) {
      this._unregisterEvent();
    }

    if (this._impl) {
      this._impl.disable();
    }
  },
  onDestroy: function onDestroy() {
    if (this._impl) {
      this._impl.clear();
    }
  },
  __preload: function __preload() {
    this._init();
  },
  _registerEvent: function _registerEvent() {
    this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
  },
  _unregisterEvent: function _unregisterEvent() {
    this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
  },
  _onTouchBegan: function _onTouchBegan(event) {
    event.stopPropagation();
  },
  _onTouchCancel: function _onTouchCancel(event) {
    event.stopPropagation();
  },
  _onTouchEnded: function _onTouchEnded(event) {
    if (this._impl) {
      this._impl.beginEditing();
    }

    event.stopPropagation();
  },

  /**
   * !#en Let the EditBox get focus, this method will be removed on v2.1
   * !#zh 让当前 EditBox 获得焦点, 这个方法会在 v2.1 中移除
   * @method setFocus
   * @deprecated since 2.0.8
   */
  setFocus: function setFocus() {
    cc.warnID(1400, 'setFocus()', 'focus()');

    if (this._impl) {
      this._impl.setFocus(true);
    }
  },

  /**
   * !#en Let the EditBox get focus
   * !#zh 让当前 EditBox 获得焦点
   * @method focus
   */
  focus: function focus() {
    if (this._impl) {
      this._impl.setFocus(true);
    }
  },

  /**
   * !#en Let the EditBox lose focus
   * !#zh 让当前 EditBox 失去焦点
   * @method blur
   */
  blur: function blur() {
    if (this._impl) {
      this._impl.setFocus(false);
    }
  },

  /**
   * !#en Determine whether EditBox is getting focus or not.
   * !#zh 判断 EditBox 是否获得了焦点
   * @method isFocused
   */
  isFocused: function isFocused() {
    if (this._impl) {
      return this._impl.isFocused();
    } else {
      return false;
    }
  },
  update: function update() {
    if (this._impl) {
      this._impl.update();
    }
  }
});
cc.EditBox = module.exports = EditBox;

if (cc.sys.isBrowser) {
  require('./WebEditBoxImpl');
}
/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event editing-did-began
 * @param {Event.EventCustom} event
 * @param {EditBox} editbox - The EditBox component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event editing-did-ended
 * @param {Event.EventCustom} event
 * @param {EditBox} editbox - The EditBox component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event text-changed
 * @param {Event.EventCustom} event
 * @param {EditBox} editbox - The EditBox component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event editing-return
 * @param {Event.EventCustom} event
 * @param {EditBox} editbox - The EditBox component.
 */

/**
 * !#en if you don't need the EditBox and it isn't in any running Scene, you should
 * call the destroy method on this component or the associated node explicitly.
 * Otherwise, the created DOM element won't be removed from web page.
 * !#zh
 * 如果你不再使用 EditBox，并且组件未添加到场景中，那么你必须手动对组件或所在节点调用 destroy。
 * 这样才能移除网页上的 DOM 节点，避免 Web 平台内存泄露。
 * @example
 * editbox.node.parent = null;  // or  editbox.node.removeFromParent(false);
 * // when you don't need editbox anymore
 * editbox.node.destroy();
 * @method destroy
 * @return {Boolean} whether it is the first time the destroy being called
 */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDRWRpdEJveC5qcyJdLCJuYW1lcyI6WyJtYWNybyIsInJlcXVpcmUiLCJFZGl0Qm94SW1wbEJhc2UiLCJMYWJlbCIsIlR5cGVzIiwiSW5wdXRNb2RlIiwiSW5wdXRGbGFnIiwiS2V5Ym9hcmRSZXR1cm5UeXBlIiwiY2FwaXRhbGl6ZSIsInN0cmluZyIsInJlcGxhY2UiLCJhIiwidG9VcHBlckNhc2UiLCJjYXBpdGFsaXplRmlyc3RMZXR0ZXIiLCJjaGFyQXQiLCJzbGljZSIsIkVkaXRCb3giLCJjYyIsIkNsYXNzIiwibmFtZSIsIkNvbXBvbmVudCIsImVkaXRvciIsIkNDX0VESVRPUiIsIm1lbnUiLCJpbnNwZWN0b3IiLCJoZWxwIiwiZXhlY3V0ZUluRWRpdE1vZGUiLCJwcm9wZXJ0aWVzIiwiX3VzZU9yaWdpbmFsU2l6ZSIsIl9zdHJpbmciLCJ0b29sdGlwIiwiQ0NfREVWIiwiZ2V0Iiwic2V0IiwidmFsdWUiLCJtYXhMZW5ndGgiLCJsZW5ndGgiLCJfdXBkYXRlU3RyaW5nIiwidGV4dExhYmVsIiwidHlwZSIsIm5vdGlmeSIsIm9sZFZhbHVlIiwiX3VwZGF0ZVRleHRMYWJlbCIsIl91cGRhdGVMYWJlbHMiLCJwbGFjZWhvbGRlckxhYmVsIiwiX3VwZGF0ZVBsYWNlaG9sZGVyTGFiZWwiLCJiYWNrZ3JvdW5kIiwiU3ByaXRlIiwiX3VwZGF0ZUJhY2tncm91bmRTcHJpdGUiLCJfTiRiYWNrZ3JvdW5kSW1hZ2UiLCJ1bmRlZmluZWQiLCJTcHJpdGVGcmFtZSIsImJhY2tncm91bmRJbWFnZSIsInNwcml0ZUZyYW1lIiwicmV0dXJuVHlwZSIsIkRFRkFVTFQiLCJkaXNwbGF5TmFtZSIsIl9OJHJldHVyblR5cGUiLCJGbG9hdCIsImlucHV0RmxhZyIsImlucHV0TW9kZSIsIkFOWSIsImZvbnRTaXplIiwiX04kZm9udFNpemUiLCJsaW5lSGVpZ2h0IiwiX04kbGluZUhlaWdodCIsImZvbnRDb2xvciIsIm5vZGUiLCJjb2xvciIsIm9wYWNpdHkiLCJfTiRmb250Q29sb3IiLCJwbGFjZWhvbGRlciIsIl9OJHBsYWNlaG9sZGVyIiwiU3RyaW5nIiwicGxhY2Vob2xkZXJGb250U2l6ZSIsIl9OJHBsYWNlaG9sZGVyRm9udFNpemUiLCJwbGFjZWhvbGRlckZvbnRDb2xvciIsIl9OJHBsYWNlaG9sZGVyRm9udENvbG9yIiwiX04kbWF4TGVuZ3RoIiwic3RheU9uVG9wIiwid2FybiIsIl90YWJJbmRleCIsInRhYkluZGV4IiwiX2ltcGwiLCJzZXRUYWJJbmRleCIsImVkaXRpbmdEaWRCZWdhbiIsIkV2ZW50SGFuZGxlciIsInRleHRDaGFuZ2VkIiwiZWRpdGluZ0RpZEVuZGVkIiwiZWRpdGluZ1JldHVybiIsInN0YXRpY3MiLCJfSW1wbENsYXNzIiwiX2luaXQiLCJfdXBncmFkZUNvbXAiLCJfaXNMYWJlbFZpc2libGUiLCJvbiIsIk5vZGUiLCJFdmVudFR5cGUiLCJTSVpFX0NIQU5HRUQiLCJfc3luY1NpemUiLCJpbXBsIiwiaW5pdCIsImdldENoaWxkQnlOYW1lIiwiZ2V0Q29tcG9uZW50IiwiYWRkQ29tcG9uZW50IiwicGFyZW50IiwiVHlwZSIsIlNMSUNFRCIsInNldEFuY2hvclBvaW50Iiwib3ZlcmZsb3ciLCJPdmVyZmxvdyIsIkNMQU1QIiwidmVydGljYWxBbGlnbiIsIlZlcnRpY2FsVGV4dEFsaWdubWVudCIsIlRPUCIsImVuYWJsZVdyYXBUZXh0IiwiQ0VOVEVSIiwiX3VwZGF0ZUxhYmVsU3RyaW5nU3R5bGUiLCJzaXplIiwiZ2V0Q29udGVudFNpemUiLCJzZXRTaXplIiwid2lkdGgiLCJoZWlnaHQiLCJfc2hvd0xhYmVscyIsIl9oaWRlTGFiZWxzIiwiYWN0aXZlIiwiY29udGVudCIsInRleHQiLCJkaXNwbGF5VGV4dCIsImlnbm9yZVBhc3N3b3JkIiwiUEFTU1dPUkQiLCJwYXNzd29yZFN0cmluZyIsImxlbiIsImkiLCJJTklUSUFMX0NBUFNfQUxMX0NIQVJBQ1RFUlMiLCJJTklUSUFMX0NBUFNfV09SRCIsIklOSVRJQUxfQ0FQU19TRU5URU5DRSIsImVkaXRCb3hFZGl0aW5nRGlkQmVnYW4iLCJlbWl0RXZlbnRzIiwiZW1pdCIsImVkaXRCb3hFZGl0aW5nRGlkRW5kZWQiLCJlZGl0Qm94VGV4dENoYW5nZWQiLCJlZGl0Qm94RWRpdGluZ1JldHVybiIsIm9uRW5hYmxlIiwiX3JlZ2lzdGVyRXZlbnQiLCJlbmFibGUiLCJvbkRpc2FibGUiLCJfdW5yZWdpc3RlckV2ZW50IiwiZGlzYWJsZSIsIm9uRGVzdHJveSIsImNsZWFyIiwiX19wcmVsb2FkIiwiVE9VQ0hfU1RBUlQiLCJfb25Ub3VjaEJlZ2FuIiwiVE9VQ0hfRU5EIiwiX29uVG91Y2hFbmRlZCIsIm9mZiIsImV2ZW50Iiwic3RvcFByb3BhZ2F0aW9uIiwiX29uVG91Y2hDYW5jZWwiLCJiZWdpbkVkaXRpbmciLCJzZXRGb2N1cyIsIndhcm5JRCIsImZvY3VzIiwiYmx1ciIsImlzRm9jdXNlZCIsInVwZGF0ZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJzeXMiLCJpc0Jyb3dzZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFNQSxLQUFLLEdBQUdDLE9BQU8sQ0FBQyx3QkFBRCxDQUFyQjs7QUFDQSxJQUFNQyxlQUFlLEdBQUdELE9BQU8sQ0FBQyw0QkFBRCxDQUEvQjs7QUFDQSxJQUFNRSxLQUFLLEdBQUdGLE9BQU8sQ0FBQyxZQUFELENBQXJCOztBQUNBLElBQU1HLEtBQUssR0FBR0gsT0FBTyxDQUFDLFNBQUQsQ0FBckI7O0FBQ0EsSUFBTUksU0FBUyxHQUFHRCxLQUFLLENBQUNDLFNBQXhCO0FBQ0EsSUFBTUMsU0FBUyxHQUFHRixLQUFLLENBQUNFLFNBQXhCO0FBQ0EsSUFBTUMsa0JBQWtCLEdBQUdILEtBQUssQ0FBQ0csa0JBQWpDOztBQUVBLFNBQVNDLFVBQVQsQ0FBcUJDLE1BQXJCLEVBQTZCO0FBQ3pCLFNBQU9BLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlLGFBQWYsRUFBOEIsVUFBU0MsQ0FBVCxFQUFZO0FBQUUsV0FBT0EsQ0FB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QUNDLE9BQVAsR0FBaUJ4SixPQUE5Qjs7QUFFQSxJQUFJQyxFQUFFLENBQUN3SixHQUFILENBQU9DLFNBQVgsRUFBc0I7QUFDbEJ6SyxFQUFBQSxPQUFPLENBQUMsa0JBQUQsQ0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7QUFVQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBtYWNybyA9IHJlcXVpcmUoJy4uLy4uL3BsYXRmb3JtL0NDTWFjcm8nKTtcbmNvbnN0IEVkaXRCb3hJbXBsQmFzZSA9IHJlcXVpcmUoJy4uL2VkaXRib3gvRWRpdEJveEltcGxCYXNlJyk7XG5jb25zdCBMYWJlbCA9IHJlcXVpcmUoJy4uL0NDTGFiZWwnKTtcbmNvbnN0IFR5cGVzID0gcmVxdWlyZSgnLi90eXBlcycpO1xuY29uc3QgSW5wdXRNb2RlID0gVHlwZXMuSW5wdXRNb2RlO1xuY29uc3QgSW5wdXRGbGFnID0gVHlwZXMuSW5wdXRGbGFnO1xuY29uc3QgS2V5Ym9hcmRSZXR1cm5UeXBlID0gVHlwZXMuS2V5Ym9hcmRSZXR1cm5UeXBlO1xuXG5mdW5jdGlvbiBjYXBpdGFsaXplIChzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoLyg/Ol58XFxzKVxcUy9nLCBmdW5jdGlvbihhKSB7IHJldHVybiBhLnRvVXBwZXJDYXNlKCk7IH0pO1xufVxuXG5mdW5jdGlvbiBjYXBpdGFsaXplRmlyc3RMZXR0ZXIgKHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSk7XG59XG5cblxuLyoqXG4gKiAhI2VuIGNjLkVkaXRCb3ggaXMgYSBjb21wb25lbnQgZm9yIGlucHV0aW5nIHRleHQsIHlvdSBjYW4gdXNlIGl0IHRvIGdhdGhlciBzbWFsbCBhbW91bnRzIG9mIHRleHQgZnJvbSB1c2Vycy5cbiAqICEjemggRWRpdEJveCDnu4Tku7bvvIznlKjkuo7ojrflj5bnlKjmiLfnmoTovpPlhaXmlofmnKzjgIJcbiAqIEBjbGFzcyBFZGl0Qm94XG4gKiBAZXh0ZW5kcyBDb21wb25lbnRcbiAqL1xubGV0IEVkaXRCb3ggPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLkVkaXRCb3gnLFxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIGVkaXRvcjogQ0NfRURJVE9SICYmIHtcbiAgICAgICAgbWVudTogJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC51aS9FZGl0Qm94JyxcbiAgICAgICAgaW5zcGVjdG9yOiAncGFja2FnZXM6Ly9pbnNwZWN0b3IvaW5zcGVjdG9ycy9jb21wcy9jY2VkaXRib3guanMnLFxuICAgICAgICBoZWxwOiAnaTE4bjpDT01QT05FTlQuaGVscF91cmwuZWRpdGJveCcsXG4gICAgICAgIGV4ZWN1dGVJbkVkaXRNb2RlOiB0cnVlLFxuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIF91c2VPcmlnaW5hbFNpemU6IHRydWUsXG4gICAgICAgIF9zdHJpbmc6ICcnLFxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBJbnB1dCBzdHJpbmcgb2YgRWRpdEJveC5cbiAgICAgICAgICogISN6aCDovpPlhaXmoYbnmoTliJ3lp4vovpPlhaXlhoXlrrnvvIzlpoLmnpzkuLrnqbrliJnkvJrmmL7npLrljaDkvY3nrKbnmoTmlofmnKzjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtTdHJpbmd9IHN0cmluZ1xuICAgICAgICAgKi9cbiAgICAgICAgc3RyaW5nOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmVkaXRib3guc3RyaW5nJyxcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0cmluZztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9ICcnICsgdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWF4TGVuZ3RoID49IDAgJiYgdmFsdWUubGVuZ3RoID49IHRoaXMubWF4TGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuc2xpY2UoMCwgdGhpcy5tYXhMZW5ndGgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuX3N0cmluZyA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVN0cmluZyh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIExhYmVsIGNvbXBvbmVudCBhdHRhY2hlZCB0byB0aGUgbm9kZSBmb3IgRWRpdEJveCdzIGlucHV0IHRleHQgbGFiZWxcbiAgICAgICAgICogISN6aCDovpPlhaXmoYbovpPlhaXmlofmnKzoioLngrnkuIrmjILovb3nmoQgTGFiZWwg57uE5Lu25a+56LGhXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TGFiZWx9IHRleHRMYWJlbFxuICAgICAgICAgKi9cbiAgICAgICAgdGV4dExhYmVsOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmVkaXRib3gudGV4dExhYmVsJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBMYWJlbCxcbiAgICAgICAgICAgIG5vdGlmeSAob2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXh0TGFiZWwgJiYgdGhpcy50ZXh0TGFiZWwgIT09IG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVRleHRMYWJlbCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVMYWJlbHMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuXG4gICAgICAgICAvKipcbiAgICAgICAgICogIWVuIFRoZSBMYWJlbCBjb21wb25lbnQgYXR0YWNoZWQgdG8gdGhlIG5vZGUgZm9yIEVkaXRCb3gncyBwbGFjZWhvbGRlciB0ZXh0IGxhYmVsXG4gICAgICAgICAqICF6aCDovpPlhaXmoYbljaDkvY3nrKboioLngrnkuIrmjILovb3nmoQgTGFiZWwg57uE5Lu25a+56LGhXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TGFiZWx9IHBsYWNlaG9sZGVyTGFiZWxcbiAgICAgICAgICovXG4gICAgICAgIHBsYWNlaG9sZGVyTGFiZWw6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuZWRpdGJveC5wbGFjZWhvbGRlckxhYmVsJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBMYWJlbCxcbiAgICAgICAgICAgIG5vdGlmeSAob2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wbGFjZWhvbGRlckxhYmVsICYmIHRoaXMucGxhY2Vob2xkZXJMYWJlbCAhPT0gb2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlUGxhY2Vob2xkZXJMYWJlbCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVMYWJlbHMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBTcHJpdGUgY29tcG9uZW50IGF0dGFjaGVkIHRvIHRoZSBub2RlIGZvciBFZGl0Qm94J3MgYmFja2dyb3VuZFxuICAgICAgICAgKiAhI3poIOi+k+WFpeahhuiDjOaZr+iKgueCueS4iuaMgui9veeahCBTcHJpdGUg57uE5Lu25a+56LGhXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U3ByaXRlfSBiYWNrZ3JvdW5kXG4gICAgICAgICAqL1xuICAgICAgICBiYWNrZ3JvdW5kOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmVkaXRib3guYmFja2dyb3VuZCcsXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlLFxuICAgICAgICAgICAgbm90aWZ5IChvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJhY2tncm91bmQgJiYgdGhpcy5iYWNrZ3JvdW5kICE9PSBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVCYWNrZ3JvdW5kU3ByaXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBUbyBiZSByZW1vdmVkIGluIHRoZSBmdXR1cmVcbiAgICAgICAgX04kYmFja2dyb3VuZEltYWdlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVGcmFtZSxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgYmFja2dyb3VuZCBpbWFnZSBvZiBFZGl0Qm94LiBUaGlzIHByb3BlcnR5IHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgZnV0dXJlLCB1c2UgZWRpdEJveC5iYWNrZ3JvdW5kIGluc3RlYWQgcGxlYXNlLlxuICAgICAgICAgKiAhI3poIOi+k+WFpeahhueahOiDjOaZr+WbvueJh+OAgiDor6XlsZ7mgKfkvJrlnKjlsIbmnaXnmoTniYjmnKzkuK3np7vpmaTvvIzor7fnlKggZWRpdEJveC5iYWNrZ3JvdW5kXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U3ByaXRlRnJhbWV9IGJhY2tncm91bmRJbWFnZVxuICAgICAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4xXG4gICAgICAgICAqL1xuICAgICAgICBiYWNrZ3JvdW5kSW1hZ2U6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgKCFDQ19FRElUT1IpIGNjLndhcm5JRCg1NDAwLCAnZWRpdEJveC5iYWNrZ3JvdW5kSW1hZ2UnLCAnZWRpdEJveC5iYWNrZ3JvdW5kJyk7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJhY2tncm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmJhY2tncm91bmQuc3ByaXRlRnJhbWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIC8vIGlmICghQ0NfRURJVE9SKSBjYy53YXJuSUQoNTQwMCwgJ2VkaXRCb3guYmFja2dyb3VuZEltYWdlJywgJ2VkaXRCb3guYmFja2dyb3VuZCcpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJhY2tncm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLnNwcml0ZUZyYW1lID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgcmV0dXJuIGtleSB0eXBlIG9mIEVkaXRCb3guXG4gICAgICAgICAqIE5vdGU6IGl0IGlzIG1lYW5pbmdsZXNzIGZvciB3ZWIgcGxhdGZvcm1zIGFuZCBkZXNrdG9wIHBsYXRmb3Jtcy5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDmjIflrprnp7vliqjorr7lpIfkuIrpnaLlm57ovabmjInpkq7nmoTmoLflvI/jgIJcbiAgICAgICAgICog5rOo5oSP77ya6L+Z5Liq6YCJ6aG55a+5IHdlYiDlubPlj7DkuI4gZGVza3RvcCDlubPlj7Dml6DmlYjjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtFZGl0Qm94LktleWJvYXJkUmV0dXJuVHlwZX0gcmV0dXJuVHlwZVxuICAgICAgICAgKiBAZGVmYXVsdCBLZXlib2FyZFJldHVyblR5cGUuREVGQVVMVFxuICAgICAgICAgKi9cbiAgICAgICAgcmV0dXJuVHlwZToge1xuICAgICAgICAgICAgZGVmYXVsdDogS2V5Ym9hcmRSZXR1cm5UeXBlLkRFRkFVTFQsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmVkaXRib3gucmV0dXJuVHlwZScsXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogJ0tleWJvYXJkUmV0dXJuVHlwZScsXG4gICAgICAgICAgICB0eXBlOiBLZXlib2FyZFJldHVyblR5cGUsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gVG8gYmUgcmVtb3ZlZCBpbiB0aGUgZnV0dXJlXG4gICAgICAgIF9OJHJldHVyblR5cGU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkZsb2F0LFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFNldCB0aGUgaW5wdXQgZmxhZ3MgdGhhdCBhcmUgdG8gYmUgYXBwbGllZCB0byB0aGUgRWRpdEJveC5cbiAgICAgICAgICogISN6aCDmjIflrprovpPlhaXmoIflv5fkvY3vvIzlj6/ku6XmjIflrprovpPlhaXmlrnlvI/kuLrlr4bnoIHmiJbogIXljZXor43pppblrZfmr43lpKflhpnjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtFZGl0Qm94LklucHV0RmxhZ30gaW5wdXRGbGFnXG4gICAgICAgICAqIEBkZWZhdWx0IElucHV0RmxhZy5ERUZBVUxUXG4gICAgICAgICAqL1xuICAgICAgICBpbnB1dEZsYWc6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuZWRpdGJveC5pbnB1dF9mbGFnJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IElucHV0RmxhZy5ERUZBVUxULFxuICAgICAgICAgICAgdHlwZTogSW5wdXRGbGFnLFxuICAgICAgICAgICAgbm90aWZ5ICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVTdHJpbmcodGhpcy5fc3RyaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogU2V0IHRoZSBpbnB1dCBtb2RlIG9mIHRoZSBlZGl0IGJveC5cbiAgICAgICAgICogSWYgeW91IHBhc3MgQU5ZLCBpdCB3aWxsIGNyZWF0ZSBhIG11bHRpbGluZSBFZGl0Qm94LlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOaMh+Wumui+k+WFpeaooeW8jzogQU5Z6KGo56S65aSa6KGM6L6T5YWl77yM5YW25a6D6YO95piv5Y2V6KGM6L6T5YWl77yM56e75Yqo5bmz5Y+w5LiK6L+Y5Y+v5Lul5oyH5a6a6ZSu55uY5qC35byP44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7RWRpdEJveC5JbnB1dE1vZGV9IGlucHV0TW9kZVxuICAgICAgICAgKiBAZGVmYXVsdCBJbnB1dE1vZGUuQU5ZXG4gICAgICAgICAqL1xuICAgICAgICBpbnB1dE1vZGU6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuZWRpdGJveC5pbnB1dF9tb2RlJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IElucHV0TW9kZS5BTlksXG4gICAgICAgICAgICB0eXBlOiBJbnB1dE1vZGUsXG4gICAgICAgICAgICBub3RpZnkgKG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRNb2RlICE9PSBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVUZXh0TGFiZWwoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlUGxhY2Vob2xkZXJMYWJlbCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBGb250IHNpemUgb2YgdGhlIGlucHV0IHRleHQuIFRoaXMgcHJvcGVydHkgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBmdXR1cmUsIHVzZSBlZGl0Qm94LnRleHRMYWJlbC5mb250U2l6ZSBpbnN0ZWFkIHBsZWFzZS5cbiAgICAgICAgICogISN6aCDovpPlhaXmoYbmlofmnKznmoTlrZfkvZPlpKflsI/jgIIg6K+l5bGe5oCn5Lya5Zyo5bCG5p2l55qE54mI5pys5Lit56e76Zmk77yM6K+35L2/55SoIGVkaXRCb3gudGV4dExhYmVsLmZvbnRTaXpl44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBmb250U2l6ZVxuICAgICAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4xXG4gICAgICAgICAqL1xuICAgICAgICBmb250U2l6ZToge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiAoIUNDX0VESVRPUikgY2Mud2FybklEKDU0MDAsICdlZGl0Qm94LmZvbnRTaXplJywgJ2VkaXRCb3gudGV4dExhYmVsLmZvbnRTaXplJyk7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRleHRMYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudGV4dExhYmVsLmZvbnRTaXplO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiAoIUNDX0VESVRPUikgY2Mud2FybklEKDU0MDAsICdlZGl0Qm94LmZvbnRTaXplJywgJ2VkaXRCb3gudGV4dExhYmVsLmZvbnRTaXplJyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGV4dExhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dExhYmVsLmZvbnRTaXplID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBUbyBiZSByZW1vdmVkIGluIHRoZSBmdXR1cmVcbiAgICAgICAgX04kZm9udFNpemU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkZsb2F0LFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIENoYW5nZSB0aGUgbGluZUhlaWdodCBvZiBkaXNwbGF5ZWQgdGV4dC4gVGhpcyBwcm9wZXJ0eSB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIGZ1dHVyZSwgdXNlIGVkaXRCb3gudGV4dExhYmVsLmxpbmVIZWlnaHQgaW5zdGVhZC5cbiAgICAgICAgICogISN6aCDovpPlhaXmoYbmlofmnKznmoTooYzpq5jjgILor6XlsZ7mgKfkvJrlnKjlsIbmnaXnmoTniYjmnKzkuK3np7vpmaTvvIzor7fkvb/nlKggZWRpdEJveC50ZXh0TGFiZWwubGluZUhlaWdodFxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gbGluZUhlaWdodFxuICAgICAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4xXG4gICAgICAgICAqL1xuICAgICAgICBsaW5lSGVpZ2h0OiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIC8vIGlmICghQ0NfRURJVE9SKSBjYy53YXJuSUQoNTQwMCwgJ2VkaXRCb3gubGluZUhlaWdodCcsICdlZGl0Qm94LnRleHRMYWJlbC5saW5lSGVpZ2h0Jyk7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRleHRMYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudGV4dExhYmVsLmxpbmVIZWlnaHQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIC8vIGlmICghQ0NfRURJVE9SKSBjYy53YXJuSUQoNTQwMCwgJ2VkaXRCb3gubGluZUhlaWdodCcsICdlZGl0Qm94LnRleHRMYWJlbC5saW5lSGVpZ2h0Jyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGV4dExhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dExhYmVsLmxpbmVIZWlnaHQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFRvIGJlIHJlbW92ZWQgaW4gdGhlIGZ1dHVyZVxuICAgICAgICBfTiRsaW5lSGVpZ2h0OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICB0eXBlOiBjYy5GbG9hdCxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBGb250IGNvbG9yIG9mIHRoZSBpbnB1dCB0ZXh0LiBUaGlzIHByb3BlcnR5IHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgZnV0dXJlLCB1c2UgZWRpdEJveC50ZXh0TGFiZWwubm9kZS5jb2xvciBpbnN0ZWFkLlxuICAgICAgICAgKiAhI3poIOi+k+WFpeahhuaWh+acrOeahOminOiJsuOAguivpeWxnuaAp+S8muWcqOWwhuadpeeahOeJiOacrOS4reenu+mZpO+8jOivt+S9v+eUqCBlZGl0Qm94LnRleHRMYWJlbC5ub2RlLmNvbG9yXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Q29sb3J9IGZvbnRDb2xvclxuICAgICAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4xXG4gICAgICAgICAqL1xuICAgICAgICBmb250Q29sb3I6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgKCFDQ19FRElUT1IpIGNjLndhcm5JRCg1NDAwLCAnZWRpdEJveC5mb250Q29sb3InLCAnZWRpdEJveC50ZXh0TGFiZWwubm9kZS5jb2xvcicpO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy50ZXh0TGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRleHRMYWJlbC5ub2RlLmNvbG9yO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiAoIUNDX0VESVRPUikgY2Mud2FybklEKDU0MDAsICdlZGl0Qm94LmZvbnRDb2xvcicsICdlZGl0Qm94LnRleHRMYWJlbC5ub2RlLmNvbG9yJyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGV4dExhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dExhYmVsLm5vZGUuY29sb3IgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0TGFiZWwubm9kZS5vcGFjaXR5ID0gdmFsdWUuYTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFRvIGJlIHJlbW92ZWQgaW4gdGhlIGZ1dHVyZVxuICAgICAgICBfTiRmb250Q29sb3I6IHVuZGVmaW5lZCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgZGlzcGxheSB0ZXh0IG9mIHBsYWNlaG9sZGVyLlxuICAgICAgICAgKiAhI3poIOi+k+WFpeahhuWNoOS9jeespueahOaWh+acrOWGheWuueOAglxuICAgICAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gcGxhY2Vob2xkZXJcbiAgICAgICAgICovXG4gICAgICAgIHBsYWNlaG9sZGVyOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmVkaXRib3gucGxhY2Vob2xkZXInLFxuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMucGxhY2Vob2xkZXJMYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBsYWNlaG9sZGVyTGFiZWwuc3RyaW5nO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wbGFjZWhvbGRlckxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGxhY2Vob2xkZXJMYWJlbC5zdHJpbmcgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gVG8gYmUgcmVtb3ZlZCBpbiB0aGUgZnV0dXJlXG4gICAgICAgIF9OJHBsYWNlaG9sZGVyOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICB0eXBlOiBjYy5TdHJpbmcsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIGZvbnQgc2l6ZSBvZiBwbGFjZWhvbGRlci4gVGhpcyBwcm9wZXJ0eSB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIGZ1dHVyZSwgdXNlIGVkaXRCb3gucGxhY2Vob2xkZXJMYWJlbC5mb250U2l6ZSBpbnN0ZWFkLlxuICAgICAgICAgKiAhI3poIOi+k+WFpeahhuWNoOS9jeespueahOWtl+S9k+Wkp+Wwj+OAguivpeWxnuaAp+S8muWcqOWwhuadpeeahOeJiOacrOS4reenu+mZpO+8jOivt+S9v+eUqCBlZGl0Qm94LnBsYWNlaG9sZGVyTGFiZWwuZm9udFNpemVcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHBsYWNlaG9sZGVyRm9udFNpemVcbiAgICAgICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMVxuICAgICAgICAgKi9cbiAgICAgICAgcGxhY2Vob2xkZXJGb250U2l6ZToge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiAoIUNDX0VESVRPUikgY2Mud2FybklEKDU0MDAsICdlZGl0Qm94LnBsYWNlaG9sZGVyRm9udFNpemUnLCAnZWRpdEJveC5wbGFjZWhvbGRlckxhYmVsLmZvbnRTaXplJyk7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnBsYWNlaG9sZGVyTGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBsYWNlaG9sZGVyTGFiZWwuZm9udFNpemU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIC8vIGlmICghQ0NfRURJVE9SKSBjYy53YXJuSUQoNTQwMCwgJ2VkaXRCb3gucGxhY2Vob2xkZXJGb250U2l6ZScsICdlZGl0Qm94LnBsYWNlaG9sZGVyTGFiZWwuZm9udFNpemUnKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wbGFjZWhvbGRlckxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGxhY2Vob2xkZXJMYWJlbC5mb250U2l6ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gVG8gYmUgcmVtb3ZlZCBpbiB0aGUgZnV0dXJlXG4gICAgICAgIF9OJHBsYWNlaG9sZGVyRm9udFNpemU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkZsb2F0LFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBmb250IGNvbG9yIG9mIHBsYWNlaG9sZGVyLiBUaGlzIHByb3BlcnR5IHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgZnV0dXJlLCB1c2UgZWRpdEJveC5wbGFjZWhvbGRlckxhYmVsLm5vZGUuY29sb3IgaW5zdGVhZC5cbiAgICAgICAgICogISN6aCDovpPlhaXmoYbljaDkvY3nrKbnmoTlrZfkvZPpopzoibLjgILor6XlsZ7mgKfkvJrlnKjlsIbmnaXnmoTniYjmnKzkuK3np7vpmaTvvIzor7fkvb/nlKggZWRpdEJveC5wbGFjZWhvbGRlckxhYmVsLm5vZGUuY29sb3JcbiAgICAgICAgICogQHByb3BlcnR5IHtDb2xvcn0gcGxhY2Vob2xkZXJGb250Q29sb3JcbiAgICAgICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMVxuICAgICAgICAgKi9cbiAgICAgICAgcGxhY2Vob2xkZXJGb250Q29sb3I6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgKCFDQ19FRElUT1IpIGNjLndhcm5JRCg1NDAwLCAnZWRpdEJveC5wbGFjZWhvbGRlckZvbnRDb2xvcicsICdlZGl0Qm94LnBsYWNlaG9sZGVyTGFiZWwubm9kZS5jb2xvcicpO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5wbGFjZWhvbGRlckxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wbGFjZWhvbGRlckxhYmVsLm5vZGUuY29sb3I7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIC8vIGlmICghQ0NfRURJVE9SKSBjYy53YXJuSUQoNTQwMCwgJ2VkaXRCb3gucGxhY2Vob2xkZXJGb250Q29sb3InLCAnZWRpdEJveC5wbGFjZWhvbGRlckxhYmVsLm5vZGUuY29sb3InKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wbGFjZWhvbGRlckxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGxhY2Vob2xkZXJMYWJlbC5ub2RlLmNvbG9yID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGxhY2Vob2xkZXJMYWJlbC5ub2RlLm9wYWNpdHkgPSB2YWx1ZS5hO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gVG8gYmUgcmVtb3ZlZCBpbiB0aGUgZnV0dXJlXG4gICAgICAgIF9OJHBsYWNlaG9sZGVyRm9udENvbG9yOiB1bmRlZmluZWQsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIG1heGltaXplIGlucHV0IGxlbmd0aCBvZiBFZGl0Qm94LlxuICAgICAgICAgKiAtIElmIHBhc3MgYSB2YWx1ZSBsZXNzIHRoYW4gMCwgaXQgd29uJ3QgbGltaXQgdGhlIGlucHV0IG51bWJlciBvZiBjaGFyYWN0ZXJzLlxuICAgICAgICAgKiAtIElmIHBhc3MgMCwgaXQgZG9lc24ndCBhbGxvdyBpbnB1dCBhbnkgY2hhcmFjdGVycy5cbiAgICAgICAgICogISN6aCDovpPlhaXmoYbmnIDlpKflhYHorrjovpPlhaXnmoTlrZfnrKbkuKrmlbDjgIJcbiAgICAgICAgICogLSDlpoLmnpzlgLzkuLrlsI/kuo4gMCDnmoTlgLzvvIzliJnkuI3kvJrpmZDliLbovpPlhaXlrZfnrKbkuKrmlbDjgIJcbiAgICAgICAgICogLSDlpoLmnpzlgLzkuLogMO+8jOWImeS4jeWFgeiuuOeUqOaIt+i/m+ihjOS7u+S9lei+k+WFpeOAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gbWF4TGVuZ3RoXG4gICAgICAgICAqL1xuICAgICAgICBtYXhMZW5ndGg6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuZWRpdGJveC5tYXhfbGVuZ3RoJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IDIwLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFRvIGJlIHJlbW92ZWQgaW4gdGhlIGZ1dHVyZVxuICAgICAgICBfTiRtYXhMZW5ndGg6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkZsb2F0LFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBpbnB1dCBpcyBhbHdheXMgdmlzaWJsZSBhbmQgYmUgb24gdG9wIG9mIHRoZSBnYW1lIHZpZXcgKG9ubHkgdXNlZnVsIG9uIFdlYiksIHRoaXMgcHJvcGVydHkgd2lsbCBiZSByZW1vdmVkIG9uIHYyLjFcbiAgICAgICAgICogIXpoIOi+k+WFpeahhuaAu+aYr+WPr+inge+8jOW5tuS4lOawuOi/nOWcqOa4uOaIj+inhuWbvueahOS4iumdou+8iOi/meS4quWxnuaAp+WPquacieWcqCBXZWIg5LiK6Z2i5L+u5pS55pyJ5oSP5LmJ77yJ77yM6K+l5bGe5oCn5Lya5ZyoIHYyLjEg5Lit56e76ZmkXG4gICAgICAgICAqIE5vdGU6IG9ubHkgYXZhaWxhYmxlIG9uIFdlYiBhdCB0aGUgbW9tZW50LlxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IHN0YXlPblRvcFxuICAgICAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSAyLjAuOFxuICAgICAgICAgKi9cbiAgICAgICAgc3RheU9uVG9wOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgIG5vdGlmeSAoKSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybignZWRpdEJveC5zdGF5T25Ub3AgaXMgcmVtb3ZlZCBzaW5jZSB2Mi4xLicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIF90YWJJbmRleDogMCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBTZXQgdGhlIHRhYkluZGV4IG9mIHRoZSBET00gaW5wdXQgZWxlbWVudCAob25seSB1c2VmdWwgb24gV2ViKS5cbiAgICAgICAgICogISN6aCDkv67mlLkgRE9NIOi+k+WFpeWFg+e0oOeahCB0YWJJbmRleO+8iOi/meS4quWxnuaAp+WPquacieWcqCBXZWIg5LiK6Z2i5L+u5pS55pyJ5oSP5LmJ77yJ44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB0YWJJbmRleFxuICAgICAgICAgKi9cbiAgICAgICAgdGFiSW5kZXg6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuZWRpdGJveC50YWJfaW5kZXgnLFxuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdGFiSW5kZXg7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90YWJJbmRleCAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGFiSW5kZXggPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2ltcGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ltcGwuc2V0VGFiSW5kZXgodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBldmVudCBoYW5kbGVyIHRvIGJlIGNhbGxlZCB3aGVuIEVkaXRCb3ggYmVnYW4gdG8gZWRpdCB0ZXh0LlxuICAgICAgICAgKiAhI3poIOW8gOWni+e8lui+keaWh+acrOi+k+WFpeahhuinpuWPkeeahOS6i+S7tuWbnuiwg+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge0NvbXBvbmVudC5FdmVudEhhbmRsZXJbXX0gZWRpdGluZ0RpZEJlZ2FuXG4gICAgICAgICAqL1xuICAgICAgICBlZGl0aW5nRGlkQmVnYW46IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdLFxuICAgICAgICAgICAgdHlwZTogY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlcixcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgZXZlbnQgaGFuZGxlciB0byBiZSBjYWxsZWQgd2hlbiBFZGl0Qm94IHRleHQgY2hhbmdlcy5cbiAgICAgICAgICogISN6aCDnvJbovpHmlofmnKzovpPlhaXmoYbml7bop6blj5HnmoTkuovku7blm57osIPjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtDb21wb25lbnQuRXZlbnRIYW5kbGVyW119IHRleHRDaGFuZ2VkXG4gICAgICAgICAqL1xuICAgICAgICB0ZXh0Q2hhbmdlZDoge1xuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5Db21wb25lbnQuRXZlbnRIYW5kbGVyLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBldmVudCBoYW5kbGVyIHRvIGJlIGNhbGxlZCB3aGVuIEVkaXRCb3ggZWRpdCBlbmRzLlxuICAgICAgICAgKiAhI3poIOe7k+adn+e8lui+keaWh+acrOi+k+WFpeahhuaXtuinpuWPkeeahOS6i+S7tuWbnuiwg+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge0NvbXBvbmVudC5FdmVudEhhbmRsZXJbXX0gZWRpdGluZ0RpZEVuZGVkXG4gICAgICAgICAqL1xuICAgICAgICBlZGl0aW5nRGlkRW5kZWQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdLFxuICAgICAgICAgICAgdHlwZTogY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlcixcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgZXZlbnQgaGFuZGxlciB0byBiZSBjYWxsZWQgd2hlbiByZXR1cm4ga2V5IGlzIHByZXNzZWQuIFdpbmRvd3MgaXMgbm90IHN1cHBvcnRlZC5cbiAgICAgICAgICogISN6aCDlvZPnlKjmiLfmjInkuIvlm57ovabmjInplK7ml7bnmoTkuovku7blm57osIPvvIznm67liY3kuI3mlK/mjIEgd2luZG93cyDlubPlj7BcbiAgICAgICAgICogQHByb3BlcnR5IHtDb21wb25lbnQuRXZlbnRIYW5kbGVyW119IGVkaXRpbmdSZXR1cm5cbiAgICAgICAgICovXG4gICAgICAgIGVkaXRpbmdSZXR1cm46IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdLFxuICAgICAgICAgICAgdHlwZTogY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlclxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgc3RhdGljczoge1xuICAgICAgICBfSW1wbENsYXNzOiBFZGl0Qm94SW1wbEJhc2UsICAvLyBpbXBsZW1lbnRlZCBvbiBkaWZmZXJlbnQgcGxhdGZvcm0gYWRhcHRlclxuICAgICAgICBLZXlib2FyZFJldHVyblR5cGU6IEtleWJvYXJkUmV0dXJuVHlwZSxcbiAgICAgICAgSW5wdXRGbGFnOiBJbnB1dEZsYWcsXG4gICAgICAgIElucHV0TW9kZTogSW5wdXRNb2RlXG4gICAgfSxcblxuICAgIF9pbml0ICgpIHtcbiAgICAgICAgdGhpcy5fdXBncmFkZUNvbXAoKTtcblxuICAgICAgICB0aGlzLl9pc0xhYmVsVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5TSVpFX0NIQU5HRUQsIHRoaXMuX3N5bmNTaXplLCB0aGlzKTtcblxuICAgICAgICBsZXQgaW1wbCA9IHRoaXMuX2ltcGwgPSBuZXcgRWRpdEJveC5fSW1wbENsYXNzKCk7XG4gICAgICAgIGltcGwuaW5pdCh0aGlzKTtcblxuICAgICAgICB0aGlzLl91cGRhdGVTdHJpbmcodGhpcy5fc3RyaW5nKTtcbiAgICAgICAgdGhpcy5fc3luY1NpemUoKTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZUJhY2tncm91bmRTcHJpdGUgKCkge1xuICAgICAgICBsZXQgYmFja2dyb3VuZCA9IHRoaXMuYmFja2dyb3VuZDtcblxuICAgICAgICAvLyBJZiBiYWNrZ3JvdW5kIGRvZXNuJ3QgZXhpc3QsIGNyZWF0ZSBvbmUuXG4gICAgICAgIGlmICghYmFja2dyb3VuZCkge1xuICAgICAgICAgICAgbGV0IG5vZGUgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ0JBQ0tHUk9VTkRfU1BSSVRFJyk7XG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgICAgICAgICBub2RlID0gbmV3IGNjLk5vZGUoJ0JBQ0tHUk9VTkRfU1BSSVRFJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGJhY2tncm91bmQgPSBub2RlLmdldENvbXBvbmVudChjYy5TcHJpdGUpO1xuICAgICAgICAgICAgaWYgKCFiYWNrZ3JvdW5kKSB7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZCA9IG5vZGUuYWRkQ29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBub2RlLnBhcmVudCA9IHRoaXMubm9kZTtcbiAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZCA9IGJhY2tncm91bmQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB1cGRhdGVcbiAgICAgICAgYmFja2dyb3VuZC50eXBlID0gY2MuU3ByaXRlLlR5cGUuU0xJQ0VEO1xuICAgICAgICBcbiAgICAgICAgLy8gaGFuZGxlIG9sZCBkYXRhXG4gICAgICAgIGlmICh0aGlzLl9OJGJhY2tncm91bmRJbWFnZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLnNwcml0ZUZyYW1lID0gdGhpcy5fTiRiYWNrZ3JvdW5kSW1hZ2U7XG4gICAgICAgICAgICB0aGlzLl9OJGJhY2tncm91bmRJbWFnZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfdXBkYXRlVGV4dExhYmVsICgpIHtcbiAgICAgICAgbGV0IHRleHRMYWJlbCA9IHRoaXMudGV4dExhYmVsO1xuXG4gICAgICAgIC8vIElmIHRleHRMYWJlbCBkb2Vzbid0IGV4aXN0LCBjcmVhdGUgb25lLlxuICAgICAgICBpZiAoIXRleHRMYWJlbCkge1xuICAgICAgICAgICAgbGV0IG5vZGUgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ1RFWFRfTEFCRUwnKTtcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xuICAgICAgICAgICAgICAgIG5vZGUgPSBuZXcgY2MuTm9kZSgnVEVYVF9MQUJFTCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGV4dExhYmVsID0gbm9kZS5nZXRDb21wb25lbnQoTGFiZWwpO1xuICAgICAgICAgICAgaWYgKCF0ZXh0TGFiZWwpIHtcbiAgICAgICAgICAgICAgICB0ZXh0TGFiZWwgPSBub2RlLmFkZENvbXBvbmVudChMYWJlbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBub2RlLnBhcmVudCA9IHRoaXMubm9kZTtcbiAgICAgICAgICAgIHRoaXMudGV4dExhYmVsID0gdGV4dExhYmVsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdXBkYXRlXG4gICAgICAgIHRleHRMYWJlbC5ub2RlLnNldEFuY2hvclBvaW50KDAsIDEpO1xuICAgICAgICB0ZXh0TGFiZWwub3ZlcmZsb3cgPSBMYWJlbC5PdmVyZmxvdy5DTEFNUDtcbiAgICAgICAgaWYgKHRoaXMuaW5wdXRNb2RlID09PSBJbnB1dE1vZGUuQU5ZKSB7XG4gICAgICAgICAgICB0ZXh0TGFiZWwudmVydGljYWxBbGlnbiA9IG1hY3JvLlZlcnRpY2FsVGV4dEFsaWdubWVudC5UT1A7XG4gICAgICAgICAgICB0ZXh0TGFiZWwuZW5hYmxlV3JhcFRleHQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGV4dExhYmVsLnZlcnRpY2FsQWxpZ24gPSBtYWNyby5WZXJ0aWNhbFRleHRBbGlnbm1lbnQuQ0VOVEVSO1xuICAgICAgICAgICAgdGV4dExhYmVsLmVuYWJsZVdyYXBUZXh0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGV4dExhYmVsLnN0cmluZyA9IHRoaXMuX3VwZGF0ZUxhYmVsU3RyaW5nU3R5bGUodGhpcy5fc3RyaW5nKTtcblxuICAgICAgICAvLyBoYW5kbGUgb2xkIGRhdGFcbiAgICAgICAgaWYgKHRoaXMuX04kZm9udENvbG9yICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRleHRMYWJlbC5ub2RlLmNvbG9yID0gdGhpcy5fTiRmb250Q29sb3I7XG4gICAgICAgICAgICB0ZXh0TGFiZWwubm9kZS5vcGFjaXR5ID0gdGhpcy5fTiRmb250Q29sb3IuYTtcbiAgICAgICAgICAgIHRoaXMuX04kZm9udENvbG9yID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9OJGZvbnRTaXplICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRleHRMYWJlbC5mb250U2l6ZSA9IHRoaXMuX04kZm9udFNpemU7XG4gICAgICAgICAgICB0aGlzLl9OJGZvbnRTaXplID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9OJGxpbmVIZWlnaHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGV4dExhYmVsLmxpbmVIZWlnaHQgPSB0aGlzLl9OJGxpbmVIZWlnaHQ7XG4gICAgICAgICAgICB0aGlzLl9OJGxpbmVIZWlnaHQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3VwZGF0ZVBsYWNlaG9sZGVyTGFiZWwgKCkge1xuICAgICAgICBsZXQgcGxhY2Vob2xkZXJMYWJlbCA9IHRoaXMucGxhY2Vob2xkZXJMYWJlbDtcblxuICAgICAgICAvLyBJZiBwbGFjZWhvbGRlckxhYmVsIGRvZXNuJ3QgZXhpc3QsIGNyZWF0ZSBvbmUuXG4gICAgICAgIGlmICghcGxhY2Vob2xkZXJMYWJlbCkge1xuICAgICAgICAgICAgbGV0IG5vZGUgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ1BMQUNFSE9MREVSX0xBQkVMJyk7XG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgICAgICAgICBub2RlID0gbmV3IGNjLk5vZGUoJ1BMQUNFSE9MREVSX0xBQkVMJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwbGFjZWhvbGRlckxhYmVsID0gbm9kZS5nZXRDb21wb25lbnQoTGFiZWwpO1xuICAgICAgICAgICAgaWYgKCFwbGFjZWhvbGRlckxhYmVsKSB7XG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXJMYWJlbCA9IG5vZGUuYWRkQ29tcG9uZW50KExhYmVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5vZGUucGFyZW50ID0gdGhpcy5ub2RlO1xuICAgICAgICAgICAgdGhpcy5wbGFjZWhvbGRlckxhYmVsID0gcGxhY2Vob2xkZXJMYWJlbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVwZGF0ZVxuICAgICAgICBwbGFjZWhvbGRlckxhYmVsLm5vZGUuc2V0QW5jaG9yUG9pbnQoMCwgMSk7XG4gICAgICAgIHBsYWNlaG9sZGVyTGFiZWwub3ZlcmZsb3cgPSBMYWJlbC5PdmVyZmxvdy5DTEFNUDtcbiAgICAgICAgaWYgKHRoaXMuaW5wdXRNb2RlID09PSBJbnB1dE1vZGUuQU5ZKSB7XG4gICAgICAgICAgICBwbGFjZWhvbGRlckxhYmVsLnZlcnRpY2FsQWxpZ24gPSBtYWNyby5WZXJ0aWNhbFRleHRBbGlnbm1lbnQuVE9QO1xuICAgICAgICAgICAgcGxhY2Vob2xkZXJMYWJlbC5lbmFibGVXcmFwVGV4dCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwbGFjZWhvbGRlckxhYmVsLnZlcnRpY2FsQWxpZ24gPSBtYWNyby5WZXJ0aWNhbFRleHRBbGlnbm1lbnQuQ0VOVEVSO1xuICAgICAgICAgICAgcGxhY2Vob2xkZXJMYWJlbC5lbmFibGVXcmFwVGV4dCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHBsYWNlaG9sZGVyTGFiZWwuc3RyaW5nID0gdGhpcy5wbGFjZWhvbGRlcjtcblxuICAgICAgICAvLyBoYW5kbGUgb2xkIGRhdGFcbiAgICAgICAgaWYgKHRoaXMuX04kcGxhY2Vob2xkZXJGb250Q29sb3IgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcGxhY2Vob2xkZXJMYWJlbC5ub2RlLmNvbG9yID0gdGhpcy5fTiRwbGFjZWhvbGRlckZvbnRDb2xvcjtcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyTGFiZWwubm9kZS5vcGFjaXR5ID0gdGhpcy5fTiRwbGFjZWhvbGRlckZvbnRDb2xvci5hO1xuICAgICAgICAgICAgdGhpcy5fTiRwbGFjZWhvbGRlckZvbnRDb2xvciA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fTiRwbGFjZWhvbGRlckZvbnRTaXplICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyTGFiZWwuZm9udFNpemUgPSB0aGlzLl9OJHBsYWNlaG9sZGVyRm9udFNpemU7XG4gICAgICAgICAgICB0aGlzLl9OJHBsYWNlaG9sZGVyRm9udFNpemUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3VwZ3JhZGVDb21wICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX04kcmV0dXJuVHlwZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnJldHVyblR5cGUgPSB0aGlzLl9OJHJldHVyblR5cGU7XG4gICAgICAgICAgICB0aGlzLl9OJHJldHVyblR5cGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX04kbWF4TGVuZ3RoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMubWF4TGVuZ3RoID0gdGhpcy5fTiRtYXhMZW5ndGg7XG4gICAgICAgICAgICB0aGlzLl9OJG1heExlbmd0aCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fTiRiYWNrZ3JvdW5kSW1hZ2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlQmFja2dyb3VuZFNwcml0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9OJGZvbnRDb2xvciAhPT0gdW5kZWZpbmVkIHx8IHRoaXMuX04kZm9udFNpemUgIT09IHVuZGVmaW5lZCB8fCB0aGlzLl9OJGxpbmVIZWlnaHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlVGV4dExhYmVsKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX04kcGxhY2Vob2xkZXJGb250Q29sb3IgIT09IHVuZGVmaW5lZCB8fCB0aGlzLl9OJHBsYWNlaG9sZGVyRm9udFNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlUGxhY2Vob2xkZXJMYWJlbCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9OJHBsYWNlaG9sZGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMucGxhY2Vob2xkZXIgPSB0aGlzLl9OJHBsYWNlaG9sZGVyO1xuICAgICAgICAgICAgdGhpcy5fTiRwbGFjZWhvbGRlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfc3luY1NpemUgKCkge1xuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xuICAgICAgICAgICAgbGV0IHNpemUgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKTtcbiAgICAgICAgICAgIHRoaXMuX2ltcGwuc2V0U2l6ZShzaXplLndpZHRoLCBzaXplLmhlaWdodCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3Nob3dMYWJlbHMgKCkge1xuICAgICAgICB0aGlzLl9pc0xhYmVsVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUxhYmVscygpO1xuICAgIH0sXG5cbiAgICBfaGlkZUxhYmVscyAoKSB7XG4gICAgICAgIHRoaXMuX2lzTGFiZWxWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLnRleHRMYWJlbCkge1xuICAgICAgICAgICAgdGhpcy50ZXh0TGFiZWwubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wbGFjZWhvbGRlckxhYmVsKSB7XG4gICAgICAgICAgICB0aGlzLnBsYWNlaG9sZGVyTGFiZWwubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfdXBkYXRlTGFiZWxzICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2lzTGFiZWxWaXNpYmxlKSB7XG4gICAgICAgICAgICBsZXQgY29udGVudCA9IHRoaXMuX3N0cmluZztcbiAgICAgICAgICAgIGlmICh0aGlzLnRleHRMYWJlbCkge1xuICAgICAgICAgICAgICAgIHRoaXMudGV4dExhYmVsLm5vZGUuYWN0aXZlID0gKGNvbnRlbnQgIT09ICcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnBsYWNlaG9sZGVyTGFiZWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYWNlaG9sZGVyTGFiZWwubm9kZS5hY3RpdmUgPSAoY29udGVudCA9PT0gJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91cGRhdGVTdHJpbmcgKHRleHQpIHtcbiAgICAgICAgbGV0IHRleHRMYWJlbCA9IHRoaXMudGV4dExhYmVsO1xuICAgICAgICAvLyBOb3QgaW5pdGVkIHlldFxuICAgICAgICBpZiAoIXRleHRMYWJlbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGRpc3BsYXlUZXh0ID0gdGV4dDtcbiAgICAgICAgaWYgKGRpc3BsYXlUZXh0KSB7XG4gICAgICAgICAgICBkaXNwbGF5VGV4dCA9IHRoaXMuX3VwZGF0ZUxhYmVsU3RyaW5nU3R5bGUoZGlzcGxheVRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGV4dExhYmVsLnN0cmluZyA9IGRpc3BsYXlUZXh0O1xuXG4gICAgICAgIHRoaXMuX3VwZGF0ZUxhYmVscygpO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlTGFiZWxTdHJpbmdTdHlsZSAodGV4dCwgaWdub3JlUGFzc3dvcmQpIHtcbiAgICAgICAgbGV0IGlucHV0RmxhZyA9IHRoaXMuaW5wdXRGbGFnO1xuICAgICAgICBpZiAoIWlnbm9yZVBhc3N3b3JkICYmIGlucHV0RmxhZyA9PT0gSW5wdXRGbGFnLlBBU1NXT1JEKSB7XG4gICAgICAgICAgICBsZXQgcGFzc3dvcmRTdHJpbmcgPSAnJztcbiAgICAgICAgICAgIGxldCBsZW4gPSB0ZXh0Lmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgICAgICAgICBwYXNzd29yZFN0cmluZyArPSAnXFx1MjVDRic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0ZXh0ID0gcGFzc3dvcmRTdHJpbmc7XG4gICAgICAgIH0gXG4gICAgICAgIGVsc2UgaWYgKGlucHV0RmxhZyA9PT0gSW5wdXRGbGFnLklOSVRJQUxfQ0FQU19BTExfQ0hBUkFDVEVSUykge1xuICAgICAgICAgICAgdGV4dCA9IHRleHQudG9VcHBlckNhc2UoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpbnB1dEZsYWcgPT09IElucHV0RmxhZy5JTklUSUFMX0NBUFNfV09SRCkge1xuICAgICAgICAgICAgdGV4dCA9IGNhcGl0YWxpemUodGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaW5wdXRGbGFnID09PSBJbnB1dEZsYWcuSU5JVElBTF9DQVBTX1NFTlRFTkNFKSB7XG4gICAgICAgICAgICB0ZXh0ID0gY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfSxcblxuICAgIGVkaXRCb3hFZGl0aW5nRGlkQmVnYW4gKCkge1xuICAgICAgICBjYy5Db21wb25lbnQuRXZlbnRIYW5kbGVyLmVtaXRFdmVudHModGhpcy5lZGl0aW5nRGlkQmVnYW4sIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUuZW1pdCgnZWRpdGluZy1kaWQtYmVnYW4nLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgZWRpdEJveEVkaXRpbmdEaWRFbmRlZCAoKSB7XG4gICAgICAgIGNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXIuZW1pdEV2ZW50cyh0aGlzLmVkaXRpbmdEaWRFbmRlZCwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5lbWl0KCdlZGl0aW5nLWRpZC1lbmRlZCcsIHRoaXMpO1xuICAgIH0sXG5cbiAgICBlZGl0Qm94VGV4dENoYW5nZWQgKHRleHQpIHtcbiAgICAgICAgdGV4dCA9IHRoaXMuX3VwZGF0ZUxhYmVsU3RyaW5nU3R5bGUodGV4dCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuc3RyaW5nID0gdGV4dDtcbiAgICAgICAgY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlci5lbWl0RXZlbnRzKHRoaXMudGV4dENoYW5nZWQsIHRleHQsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUuZW1pdCgndGV4dC1jaGFuZ2VkJywgdGhpcyk7XG4gICAgfSxcblxuICAgIGVkaXRCb3hFZGl0aW5nUmV0dXJuKCkge1xuICAgICAgICBjYy5Db21wb25lbnQuRXZlbnRIYW5kbGVyLmVtaXRFdmVudHModGhpcy5lZGl0aW5nUmV0dXJuLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLmVtaXQoJ2VkaXRpbmctcmV0dXJuJywgdGhpcyk7XG4gICAgfSxcblxuICAgIG9uRW5hYmxlICgpIHtcbiAgICAgICAgaWYgKCFDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHRoaXMuX3JlZ2lzdGVyRXZlbnQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xuICAgICAgICAgICAgdGhpcy5faW1wbC5lbmFibGUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkRpc2FibGUgKCkge1xuICAgICAgICBpZiAoIUNDX0VESVRPUikge1xuICAgICAgICAgICAgdGhpcy5fdW5yZWdpc3RlckV2ZW50KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2ltcGwpIHtcbiAgICAgICAgICAgIHRoaXMuX2ltcGwuZGlzYWJsZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uRGVzdHJveSAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XG4gICAgICAgICAgICB0aGlzLl9pbXBsLmNsZWFyKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX19wcmVsb2FkICgpIHtcbiAgICAgICAgdGhpcy5faW5pdCgpO1xuICAgIH0sXG5cbiAgICBfcmVnaXN0ZXJFdmVudCAoKSB7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5fb25Ub3VjaEJlZ2FuLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5fb25Ub3VjaEVuZGVkLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX3VucmVnaXN0ZXJFdmVudCAoKSB7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuX29uVG91Y2hCZWdhbiwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLl9vblRvdWNoRW5kZWQsIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfb25Ub3VjaEJlZ2FuIChldmVudCkge1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9LFxuXG4gICAgX29uVG91Y2hDYW5jZWwgKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0sXG5cbiAgICBfb25Ub3VjaEVuZGVkIChldmVudCkge1xuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xuICAgICAgICAgICAgdGhpcy5faW1wbC5iZWdpbkVkaXRpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBMZXQgdGhlIEVkaXRCb3ggZ2V0IGZvY3VzLCB0aGlzIG1ldGhvZCB3aWxsIGJlIHJlbW92ZWQgb24gdjIuMVxuICAgICAqICEjemgg6K6p5b2T5YmNIEVkaXRCb3gg6I635b6X54Sm54K5LCDov5nkuKrmlrnms5XkvJrlnKggdjIuMSDkuK3np7vpmaRcbiAgICAgKiBAbWV0aG9kIHNldEZvY3VzXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgMi4wLjhcbiAgICAgKi9cbiAgICBzZXRGb2N1cyAoKSB7XG4gICAgICAgIGNjLndhcm5JRCgxNDAwLCAnc2V0Rm9jdXMoKScsICdmb2N1cygpJyk7XG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XG4gICAgICAgICAgICB0aGlzLl9pbXBsLnNldEZvY3VzKHRydWUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gTGV0IHRoZSBFZGl0Qm94IGdldCBmb2N1c1xuICAgICAqICEjemgg6K6p5b2T5YmNIEVkaXRCb3gg6I635b6X54Sm54K5XG4gICAgICogQG1ldGhvZCBmb2N1c1xuICAgICAqL1xuICAgIGZvY3VzICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2ltcGwpIHtcbiAgICAgICAgICAgIHRoaXMuX2ltcGwuc2V0Rm9jdXModHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBMZXQgdGhlIEVkaXRCb3ggbG9zZSBmb2N1c1xuICAgICAqICEjemgg6K6p5b2T5YmNIEVkaXRCb3gg5aSx5Y6754Sm54K5XG4gICAgICogQG1ldGhvZCBibHVyXG4gICAgICovXG4gICAgYmx1ciAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XG4gICAgICAgICAgICB0aGlzLl9pbXBsLnNldEZvY3VzKGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIERldGVybWluZSB3aGV0aGVyIEVkaXRCb3ggaXMgZ2V0dGluZyBmb2N1cyBvciBub3QuXG4gICAgICogISN6aCDliKTmlq0gRWRpdEJveCDmmK/lkKbojrflvpfkuobnhKbngrlcbiAgICAgKiBAbWV0aG9kIGlzRm9jdXNlZFxuICAgICAqL1xuICAgIGlzRm9jdXNlZCAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faW1wbC5pc0ZvY3VzZWQoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB1cGRhdGUgKCkge1xuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xuICAgICAgICAgICAgdGhpcy5faW1wbC51cGRhdGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxufSk7XG5cbmNjLkVkaXRCb3ggPSBtb2R1bGUuZXhwb3J0cyA9IEVkaXRCb3g7XG5cbmlmIChjYy5zeXMuaXNCcm93c2VyKSB7XG4gICAgcmVxdWlyZSgnLi9XZWJFZGl0Qm94SW1wbCcpO1xufVxuXG4vKipcbiAqICEjZW5cbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cbiAqICEjemhcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxuICogQGV2ZW50IGVkaXRpbmctZGlkLWJlZ2FuXG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxuICogQHBhcmFtIHtFZGl0Qm94fSBlZGl0Ym94IC0gVGhlIEVkaXRCb3ggY29tcG9uZW50LlxuICovXG5cbi8qKlxuICogISNlblxuICogTm90ZTogVGhpcyBldmVudCBpcyBlbWl0dGVkIGZyb20gdGhlIG5vZGUgdG8gd2hpY2ggdGhlIGNvbXBvbmVudCBiZWxvbmdzLlxuICogISN6aFxuICog5rOo5oSP77ya5q2k5LqL5Lu25piv5LuO6K+l57uE5Lu25omA5bGe55qEIE5vZGUg5LiK6Z2i5rS+5Y+R5Ye65p2l55qE77yM6ZyA6KaB55SoIG5vZGUub24g5p2l55uR5ZCs44CCXG4gKiBAZXZlbnQgZWRpdGluZy1kaWQtZW5kZWRcbiAqIEBwYXJhbSB7RXZlbnQuRXZlbnRDdXN0b219IGV2ZW50XG4gKiBAcGFyYW0ge0VkaXRCb3h9IGVkaXRib3ggLSBUaGUgRWRpdEJveCBjb21wb25lbnQuXG4gKi9cblxuLyoqXG4gKiAhI2VuXG4gKiBOb3RlOiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgZnJvbSB0aGUgbm9kZSB0byB3aGljaCB0aGUgY29tcG9uZW50IGJlbG9uZ3MuXG4gKiAhI3poXG4gKiDms6jmhI/vvJrmraTkuovku7bmmK/ku47or6Xnu4Tku7bmiYDlsZ7nmoQgTm9kZSDkuIrpnaLmtL7lj5Hlh7rmnaXnmoTvvIzpnIDopoHnlKggbm9kZS5vbiDmnaXnm5HlkKzjgIJcbiAqIEBldmVudCB0ZXh0LWNoYW5nZWRcbiAqIEBwYXJhbSB7RXZlbnQuRXZlbnRDdXN0b219IGV2ZW50XG4gKiBAcGFyYW0ge0VkaXRCb3h9IGVkaXRib3ggLSBUaGUgRWRpdEJveCBjb21wb25lbnQuXG4gKi9cblxuLyoqXG4gKiAhI2VuXG4gKiBOb3RlOiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgZnJvbSB0aGUgbm9kZSB0byB3aGljaCB0aGUgY29tcG9uZW50IGJlbG9uZ3MuXG4gKiAhI3poXG4gKiDms6jmhI/vvJrmraTkuovku7bmmK/ku47or6Xnu4Tku7bmiYDlsZ7nmoQgTm9kZSDkuIrpnaLmtL7lj5Hlh7rmnaXnmoTvvIzpnIDopoHnlKggbm9kZS5vbiDmnaXnm5HlkKzjgIJcbiAqIEBldmVudCBlZGl0aW5nLXJldHVyblxuICogQHBhcmFtIHtFdmVudC5FdmVudEN1c3RvbX0gZXZlbnRcbiAqIEBwYXJhbSB7RWRpdEJveH0gZWRpdGJveCAtIFRoZSBFZGl0Qm94IGNvbXBvbmVudC5cbiAqL1xuXG4vKipcbiAqICEjZW4gaWYgeW91IGRvbid0IG5lZWQgdGhlIEVkaXRCb3ggYW5kIGl0IGlzbid0IGluIGFueSBydW5uaW5nIFNjZW5lLCB5b3Ugc2hvdWxkXG4gKiBjYWxsIHRoZSBkZXN0cm95IG1ldGhvZCBvbiB0aGlzIGNvbXBvbmVudCBvciB0aGUgYXNzb2NpYXRlZCBub2RlIGV4cGxpY2l0bHkuXG4gKiBPdGhlcndpc2UsIHRoZSBjcmVhdGVkIERPTSBlbGVtZW50IHdvbid0IGJlIHJlbW92ZWQgZnJvbSB3ZWIgcGFnZS5cbiAqICEjemhcbiAqIOWmguaenOS9oOS4jeWGjeS9v+eUqCBFZGl0Qm9477yM5bm25LiU57uE5Lu25pyq5re75Yqg5Yiw5Zy65pmv5Lit77yM6YKj5LmI5L2g5b+F6aG75omL5Yqo5a+557uE5Lu25oiW5omA5Zyo6IqC54K56LCD55SoIGRlc3Ryb3njgIJcbiAqIOi/meagt+aJjeiDveenu+mZpOe9kemhteS4iueahCBET00g6IqC54K577yM6YG/5YWNIFdlYiDlubPlj7DlhoXlrZjms4TpnLLjgIJcbiAqIEBleGFtcGxlXG4gKiBlZGl0Ym94Lm5vZGUucGFyZW50ID0gbnVsbDsgIC8vIG9yICBlZGl0Ym94Lm5vZGUucmVtb3ZlRnJvbVBhcmVudChmYWxzZSk7XG4gKiAvLyB3aGVuIHlvdSBkb24ndCBuZWVkIGVkaXRib3ggYW55bW9yZVxuICogZWRpdGJveC5ub2RlLmRlc3Ryb3koKTtcbiAqIEBtZXRob2QgZGVzdHJveVxuICogQHJldHVybiB7Qm9vbGVhbn0gd2hldGhlciBpdCBpcyB0aGUgZmlyc3QgdGltZSB0aGUgZGVzdHJveSBiZWluZyBjYWxsZWRcbiAqLyJdfQ==