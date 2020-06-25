
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCWidget.js';
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
var WidgetManager = require('../base-ui/CCWidgetManager');
/**
 * !#en Enum for Widget's alignment mode, indicating when the widget should refresh.
 * !#zh Widget 的对齐模式，表示 Widget 应该何时刷新。
 * @enum Widget.AlignMode
 */

/**
 * !#en
 * Only align once when the Widget is enabled for the first time.
 * This will allow the script or animation to continue controlling the current node.
 * It will only be aligned once before the end of frame when onEnable is called,
 * then immediately disables the Widget.
 * !#zh
 * 仅在 Widget 第一次激活时对齐一次，便于脚本或动画继续控制当前节点。
 * 开启后会在 onEnable 时所在的那一帧结束前对齐一次，然后立刻禁用该 Widget。
 * @property {Number} ONCE
 */

/**
 * !#en Align first from the beginning as ONCE, and then realign it every time the window is resized.
 * !#zh 一开始会像 ONCE 一样对齐一次，之后每当窗口大小改变时还会重新对齐。
 * @property {Number} ON_WINDOW_RESIZE
 */

/**
 * !#en Keep aligning all the way.
 * !#zh 始终保持对齐。
 * @property {Number} ALWAYS
 */


var AlignMode = WidgetManager.AlignMode;
var AlignFlags = WidgetManager._AlignFlags;
var TOP = AlignFlags.TOP;
var MID = AlignFlags.MID;
var BOT = AlignFlags.BOT;
var LEFT = AlignFlags.LEFT;
var CENTER = AlignFlags.CENTER;
var RIGHT = AlignFlags.RIGHT;
var TOP_BOT = TOP | BOT;
var LEFT_RIGHT = LEFT | RIGHT;
/**
 * !#en
 * Stores and manipulate the anchoring based on its parent.
 * Widget are used for GUI but can also be used for other things.
 * Widget will adjust current node's position and size automatically, but the results after adjustment can not be obtained until the next frame unless you call {{#crossLink "Widget/updateAlignment:method"}}{{/crossLink}} manually.
 * !#zh
 * Widget 组件，用于设置和适配其相对于父节点的边距，Widget 通常被用于 UI 界面，也可以用于其他地方。
 * Widget 会自动调整当前节点的坐标和宽高，不过目前调整后的结果要到下一帧才能在脚本里获取到，除非你先手动调用 {{#crossLink "Widget/updateAlignment:method"}}{{/crossLink}}。
 *
 * @class Widget
 * @extends Component
 */

var Widget = cc.Class({
  name: 'cc.Widget',
  "extends": require('./CCComponent'),
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.ui/Widget',
    help: 'i18n:COMPONENT.help_url.widget',
    inspector: 'packages://inspector/inspectors/comps/ccwidget.js',
    executeInEditMode: true,
    disallowMultiple: true
  },
  properties: {
    /**
     * !#en Specifies an alignment target that can only be one of the parent nodes of the current node.
     * The default value is null, and when null, indicates the current parent.
     * !#zh 指定一个对齐目标，只能是当前节点的其中一个父节点，默认为空，为空时表示当前父节点。
     * @property {Node} target
     * @default null
     */
    target: {
      get: function get() {
        return this._target;
      },
      set: function set(value) {
        this._target = value;

        if (CC_EDITOR && !cc.engine._isPlaying && this.node._parent) {
          // adjust the offsets to keep the size and position unchanged after target chagned
          WidgetManager.updateOffsetsToStayPut(this);
        }
      },
      type: cc.Node,
      tooltip: CC_DEV && 'i18n:COMPONENT.widget.target'
    },
    // ENABLE ALIGN ?

    /**
     * !#en Whether to align the top.
     * !#zh 是否对齐上边。
     * @property isAlignTop
     * @type {Boolean}
     * @default false
     */
    isAlignTop: {
      get: function get() {
        return (this._alignFlags & TOP) > 0;
      },
      set: function set(value) {
        this._setAlign(TOP, value);
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.widget.align_top'
    },

    /**
     * !#en
     * Vertically aligns the midpoint, This will open the other vertical alignment options cancel.
     * !#zh
     * 是否垂直方向对齐中点，开启此项会将垂直方向其他对齐选项取消。
     * @property isAlignVerticalCenter
     * @type {Boolean}
     * @default false
     */
    isAlignVerticalCenter: {
      get: function get() {
        return (this._alignFlags & MID) > 0;
      },
      set: function set(value) {
        if (value) {
          this.isAlignTop = false;
          this.isAlignBottom = false;
          this._alignFlags |= MID;
        } else {
          this._alignFlags &= ~MID;
        }
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.widget.align_v_center'
    },

    /**
     * !#en Whether to align the bottom.
     * !#zh 是否对齐下边。
     * @property isAlignBottom
     * @type {Boolean}
     * @default false
     */
    isAlignBottom: {
      get: function get() {
        return (this._alignFlags & BOT) > 0;
      },
      set: function set(value) {
        this._setAlign(BOT, value);
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.widget.align_bottom'
    },

    /**
     * !#en Whether to align the left.
     * !#zh 是否对齐左边
     * @property isAlignLeft
     * @type {Boolean}
     * @default false
     */
    isAlignLeft: {
      get: function get() {
        return (this._alignFlags & LEFT) > 0;
      },
      set: function set(value) {
        this._setAlign(LEFT, value);
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.widget.align_left'
    },

    /**
     * !#en
     * Horizontal aligns the midpoint. This will open the other horizontal alignment options canceled.
     * !#zh
     * 是否水平方向对齐中点，开启此选项会将水平方向其他对齐选项取消。
     * @property isAlignHorizontalCenter
     * @type {Boolean}
     * @default false
     */
    isAlignHorizontalCenter: {
      get: function get() {
        return (this._alignFlags & CENTER) > 0;
      },
      set: function set(value) {
        if (value) {
          this.isAlignLeft = false;
          this.isAlignRight = false;
          this._alignFlags |= CENTER;
        } else {
          this._alignFlags &= ~CENTER;
        }
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.widget.align_h_center'
    },

    /**
     * !#en Whether to align the right.
     * !#zh 是否对齐右边。
     * @property isAlignRight
     * @type {Boolean}
     * @default false
     */
    isAlignRight: {
      get: function get() {
        return (this._alignFlags & RIGHT) > 0;
      },
      set: function set(value) {
        this._setAlign(RIGHT, value);
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.widget.align_right'
    },

    /**
     * !#en
     * Whether the stretched horizontally, when enable the left and right alignment will be stretched horizontally,
     * the width setting is invalid (read only).
     * !#zh
     * 当前是否水平拉伸。当同时启用左右对齐时，节点将会被水平拉伸，此时节点的宽度只读。
     * @property isStretchWidth
     * @type {Boolean}
     * @default false
     * @readOnly
     */
    isStretchWidth: {
      get: function get() {
        return (this._alignFlags & LEFT_RIGHT) === LEFT_RIGHT;
      },
      visible: false
    },

    /**
     * !#en
     * Whether the stretched vertically, when enable the left and right alignment will be stretched vertically,
     * then height setting is invalid (read only)
     * !#zh
     * 当前是否垂直拉伸。当同时启用上下对齐时，节点将会被垂直拉伸，此时节点的高度只读。
     * @property isStretchHeight
     * @type {Boolean}
     * @default false
     * @readOnly
     */
    isStretchHeight: {
      get: function get() {
        return (this._alignFlags & TOP_BOT) === TOP_BOT;
      },
      visible: false
    },
    // ALIGN MARGINS

    /**
     * !#en
     * The margins between the top of this node and the top of parent node,
     * the value can be negative, Only available in 'isAlignTop' open.
     * !#zh
     * 本节点顶边和父节点顶边的距离，可填写负值，只有在 isAlignTop 开启时才有作用。
     * @property top
     * @type {Number}
     * @default 0
     */
    top: {
      get: function get() {
        return this._top;
      },
      set: function set(value) {
        this._top = value;
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.widget.top'
    },

    /**
     * !#en
     * The margins between the bottom of this node and the bottom of parent node,
     * the value can be negative, Only available in 'isAlignBottom' open.
     * !#zh
     * 本节点底边和父节点底边的距离，可填写负值，只有在 isAlignBottom 开启时才有作用。
     * @property bottom
     * @type {Number}
     * @default 0
     */
    bottom: {
      get: function get() {
        return this._bottom;
      },
      set: function set(value) {
        this._bottom = value;
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.widget.bottom'
    },

    /**
     * !#en
     * The margins between the left of this node and the left of parent node,
     * the value can be negative, Only available in 'isAlignLeft' open.
     * !#zh
     * 本节点左边和父节点左边的距离，可填写负值，只有在 isAlignLeft 开启时才有作用。
     * @property left
     * @type {Number}
     * @default 0
     */
    left: {
      get: function get() {
        return this._left;
      },
      set: function set(value) {
        this._left = value;
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.widget.left'
    },

    /**
     * !#en
     * The margins between the right of this node and the right of parent node,
     * the value can be negative, Only available in 'isAlignRight' open.
     * !#zh
     * 本节点右边和父节点右边的距离，可填写负值，只有在 isAlignRight 开启时才有作用。
     * @property right
     * @type {Number}
     * @default 0
     */
    right: {
      get: function get() {
        return this._right;
      },
      set: function set(value) {
        this._right = value;
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.widget.right'
    },

    /**
     * !#en
     * Horizontal aligns the midpoint offset value,
     * the value can be negative, Only available in 'isAlignHorizontalCenter' open.
     * !#zh 水平居中的偏移值，可填写负值，只有在 isAlignHorizontalCenter 开启时才有作用。
     * @property horizontalCenter
     * @type {Number}
     * @default 0
     */
    horizontalCenter: {
      get: function get() {
        return this._horizontalCenter;
      },
      set: function set(value) {
        this._horizontalCenter = value;
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.widget.horizontal_center'
    },

    /**
     * !#en
     * Vertical aligns the midpoint offset value,
     * the value can be negative, Only available in 'isAlignVerticalCenter' open.
     * !#zh 垂直居中的偏移值，可填写负值，只有在 isAlignVerticalCenter 开启时才有作用。
     * @property verticalCenter
     * @type {Number}
     * @default 0
     */
    verticalCenter: {
      get: function get() {
        return this._verticalCenter;
      },
      set: function set(value) {
        this._verticalCenter = value;
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.widget.vertical_center'
    },
    // PARCENTAGE OR ABSOLUTE

    /**
     * !#en If true, horizontalCenter is pixel margin, otherwise is percentage (0 - 1) margin.
     * !#zh 如果为 true，"horizontalCenter" 将会以像素作为偏移值，反之为百分比（0 到 1）。
     * @property isAbsoluteHorizontalCenter
     * @type {Boolean}
     * @default true
     */
    isAbsoluteHorizontalCenter: {
      get: function get() {
        return this._isAbsHorizontalCenter;
      },
      set: function set(value) {
        this._isAbsHorizontalCenter = value;
      },
      animatable: false
    },

    /**
     * !#en If true, verticalCenter is pixel margin, otherwise is percentage (0 - 1) margin.
     * !#zh 如果为 true，"verticalCenter" 将会以像素作为偏移值，反之为百分比（0 到 1）。
     * @property isAbsoluteVerticalCenter
     * @type {Boolean}
     * @default true
     */
    isAbsoluteVerticalCenter: {
      get: function get() {
        return this._isAbsVerticalCenter;
      },
      set: function set(value) {
        this._isAbsVerticalCenter = value;
      },
      animatable: false
    },

    /**
     * !#en
     * If true, top is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's height.
     * !#zh
     * 如果为 true，"top" 将会以像素作为边距，否则将会以相对父物体高度的百分比（0 到 1）作为边距。
     * @property isAbsoluteTop
     * @type {Boolean}
     * @default true
     */
    isAbsoluteTop: {
      get: function get() {
        return this._isAbsTop;
      },
      set: function set(value) {
        this._isAbsTop = value;
      },
      animatable: false
    },

    /**
     * !#en
     * If true, bottom is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's height.
     * !#zh
     * 如果为 true，"bottom" 将会以像素作为边距，否则将会以相对父物体高度的百分比（0 到 1）作为边距。
     * @property isAbsoluteBottom
     * @type {Boolean}
     * @default true
     */
    isAbsoluteBottom: {
      get: function get() {
        return this._isAbsBottom;
      },
      set: function set(value) {
        this._isAbsBottom = value;
      },
      animatable: false
    },

    /**
     * !#en
     * If true, left is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's width.
     * !#zh
     * 如果为 true，"left" 将会以像素作为边距，否则将会以相对父物体宽度的百分比（0 到 1）作为边距。
     * @property isAbsoluteLeft
     * @type {Boolean}
     * @default true
     */
    isAbsoluteLeft: {
      get: function get() {
        return this._isAbsLeft;
      },
      set: function set(value) {
        this._isAbsLeft = value;
      },
      animatable: false
    },

    /**
     * !#en
     * If true, right is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's width.
     * !#zh
     * 如果为 true，"right" 将会以像素作为边距，否则将会以相对父物体宽度的百分比（0 到 1）作为边距。
     * @property isAbsoluteRight
     * @type {Boolean}
     * @default true
     */
    isAbsoluteRight: {
      get: function get() {
        return this._isAbsRight;
      },
      set: function set(value) {
        this._isAbsRight = value;
      },
      animatable: false
    },

    /**
     * !#en Specifies the alignment mode of the Widget, which determines when the widget should refresh.
     * !#zh 指定 Widget 的对齐模式，用于决定 Widget 应该何时刷新。
     * @property {Widget.AlignMode} alignMode
     * @example
     * widget.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
     */
    alignMode: {
      "default": AlignMode.ON_WINDOW_RESIZE,
      type: AlignMode,
      tooltip: CC_DEV && 'i18n:COMPONENT.widget.align_mode'
    },
    //
    _wasAlignOnce: {
      "default": undefined,
      formerlySerializedAs: 'isAlignOnce'
    },
    _target: null,

    /**
     * !#zh: 对齐开关，由 AlignFlags 组成
     *
     * @property _alignFlags
     * @type {Number}
     * @default 0
     * @private
     */
    _alignFlags: 0,
    _left: 0,
    _right: 0,
    _top: 0,
    _bottom: 0,
    _verticalCenter: 0,
    _horizontalCenter: 0,
    _isAbsLeft: true,
    _isAbsRight: true,
    _isAbsTop: true,
    _isAbsBottom: true,
    _isAbsHorizontalCenter: true,
    _isAbsVerticalCenter: true,
    // original size before align
    _originalWidth: 0,
    _originalHeight: 0
  },
  statics: {
    AlignMode: AlignMode
  },
  onLoad: function onLoad() {
    if (this._wasAlignOnce !== undefined) {
      // migrate for old version
      this.alignMode = this._wasAlignOnce ? AlignMode.ONCE : AlignMode.ALWAYS;
      this._wasAlignOnce = undefined;
    }
  },
  onEnable: function onEnable() {
    WidgetManager.add(this);
  },
  onDisable: function onDisable() {
    WidgetManager.remove(this);
  },
  _validateTargetInDEV: CC_DEV && function () {
    var target = this._target;

    if (target) {
      var isParent = this.node !== target && this.node.isChildOf(target);

      if (!isParent) {
        cc.errorID(6500);
        this._target = null;
      }
    }
  },
  _setAlign: function _setAlign(flag, isAlign) {
    var current = (this._alignFlags & flag) > 0;

    if (isAlign === current) {
      return;
    }

    var isHorizontal = (flag & LEFT_RIGHT) > 0;

    if (isAlign) {
      this._alignFlags |= flag;

      if (isHorizontal) {
        this.isAlignHorizontalCenter = false;

        if (this.isStretchWidth) {
          // become stretch
          this._originalWidth = this.node.width; // test check conflict

          if (CC_EDITOR && !cc.engine.isPlaying) {
            _Scene.DetectConflict.checkConflict_Widget(this);
          }
        }
      } else {
        this.isAlignVerticalCenter = false;

        if (this.isStretchHeight) {
          // become stretch
          this._originalHeight = this.node.height; // test check conflict

          if (CC_EDITOR && !cc.engine.isPlaying) {
            _Scene.DetectConflict.checkConflict_Widget(this);
          }
        }
      }

      if (CC_EDITOR && !cc.engine._isPlaying && this.node._parent) {
        // adjust the offsets to keep the size and position unchanged after alignment chagned
        WidgetManager.updateOffsetsToStayPut(this, flag);
      }
    } else {
      if (isHorizontal) {
        if (this.isStretchWidth) {
          // will cancel stretch
          this.node.width = this._originalWidth;
        }
      } else {
        if (this.isStretchHeight) {
          // will cancel stretch
          this.node.height = this._originalHeight;
        }
      }

      this._alignFlags &= ~flag;
    }
  },

  /**
   * !#en
   * Immediately perform the widget alignment. You need to manually call this method only if
   * you need to get the latest results after the alignment before the end of current frame.
   * !#zh
   * 立刻执行 widget 对齐操作。这个接口一般不需要手工调用。
   * 只有当你需要在当前帧结束前获得 widget 对齐后的最新结果时才需要手动调用这个方法。
   *
   * @method updateAlignment
   *
   * @example
   * widget.top = 10;       // change top margin
   * cc.log(widget.node.y); // not yet changed
   * widget.updateAlignment();
   * cc.log(widget.node.y); // changed
   */
  updateAlignment: function updateAlignment() {
    WidgetManager.updateAlignment(this.node);
  }
});
/**
 * !#en
 * When turned on, it will only be aligned once at the end of the onEnable frame,
 * then immediately disables the current component.
 * This will allow the script or animation to continue controlling the current node.
 * Note: It will still be aligned at the frame when onEnable is called.
 * !#zh
 * 开启后仅会在 onEnable 的当帧结束时对齐一次，然后立刻禁用当前组件。
 * 这样便于脚本或动画继续控制当前节点。
 * 注意：onEnable 时所在的那一帧仍然会进行对齐。
 * @property {Boolean} isAlignOnce
 * @default false
 * @deprecated
 */

Object.defineProperty(Widget.prototype, 'isAlignOnce', {
  get: function get() {
    if (CC_DEBUG) {
      cc.warn('`widget.isAlignOnce` is deprecated, use `widget.alignMode === cc.Widget.AlignMode.ONCE` instead please.');
    }

    return this.alignMode === AlignMode.ONCE;
  },
  set: function set(value) {
    if (CC_DEBUG) {
      cc.warn('`widget.isAlignOnce` is deprecated, use `widget.alignMode = cc.Widget.AlignMode.*` instead please.');
    }

    this.alignMode = value ? AlignMode.ONCE : AlignMode.ALWAYS;
  }
});
cc.Widget = module.exports = Widget;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDV2lkZ2V0LmpzIl0sIm5hbWVzIjpbIldpZGdldE1hbmFnZXIiLCJyZXF1aXJlIiwiQWxpZ25Nb2RlIiwiQWxpZ25GbGFncyIsIl9BbGlnbkZsYWdzIiwiVE9QIiwiTUlEIiwiQk9UIiwiTEVGVCIsIkNFTlRFUiIsIlJJR0hUIiwiVE9QX0JPVCIsIkxFRlRfUklHSFQiLCJXaWRnZXQiLCJjYyIsIkNsYXNzIiwibmFtZSIsImVkaXRvciIsIkNDX0VESVRPUiIsIm1lbnUiLCJoZWxwIiwiaW5zcGVjdG9yIiwiZXhlY3V0ZUluRWRpdE1vZGUiLCJkaXNhbGxvd011bHRpcGxlIiwicHJvcGVydGllcyIsInRhcmdldCIsImdldCIsIl90YXJnZXQiLCJzZXQiLCJ2YWx1ZSIsImVuZ2luZSIsIl9pc1BsYXlpbmciLCJub2RlIiwiX3BhcmVudCIsInVwZGF0ZU9mZnNldHNUb1N0YXlQdXQiLCJ0eXBlIiwiTm9kZSIsInRvb2x0aXAiLCJDQ19ERVYiLCJpc0FsaWduVG9wIiwiX2FsaWduRmxhZ3MiLCJfc2V0QWxpZ24iLCJhbmltYXRhYmxlIiwiaXNBbGlnblZlcnRpY2FsQ2VudGVyIiwiaXNBbGlnbkJvdHRvbSIsImlzQWxpZ25MZWZ0IiwiaXNBbGlnbkhvcml6b250YWxDZW50ZXIiLCJpc0FsaWduUmlnaHQiLCJpc1N0cmV0Y2hXaWR0aCIsInZpc2libGUiLCJpc1N0cmV0Y2hIZWlnaHQiLCJ0b3AiLCJfdG9wIiwiYm90dG9tIiwiX2JvdHRvbSIsImxlZnQiLCJfbGVmdCIsInJpZ2h0IiwiX3JpZ2h0IiwiaG9yaXpvbnRhbENlbnRlciIsIl9ob3Jpem9udGFsQ2VudGVyIiwidmVydGljYWxDZW50ZXIiLCJfdmVydGljYWxDZW50ZXIiLCJpc0Fic29sdXRlSG9yaXpvbnRhbENlbnRlciIsIl9pc0Fic0hvcml6b250YWxDZW50ZXIiLCJpc0Fic29sdXRlVmVydGljYWxDZW50ZXIiLCJfaXNBYnNWZXJ0aWNhbENlbnRlciIsImlzQWJzb2x1dGVUb3AiLCJfaXNBYnNUb3AiLCJpc0Fic29sdXRlQm90dG9tIiwiX2lzQWJzQm90dG9tIiwiaXNBYnNvbHV0ZUxlZnQiLCJfaXNBYnNMZWZ0IiwiaXNBYnNvbHV0ZVJpZ2h0IiwiX2lzQWJzUmlnaHQiLCJhbGlnbk1vZGUiLCJPTl9XSU5ET1dfUkVTSVpFIiwiX3dhc0FsaWduT25jZSIsInVuZGVmaW5lZCIsImZvcm1lcmx5U2VyaWFsaXplZEFzIiwiX29yaWdpbmFsV2lkdGgiLCJfb3JpZ2luYWxIZWlnaHQiLCJzdGF0aWNzIiwib25Mb2FkIiwiT05DRSIsIkFMV0FZUyIsIm9uRW5hYmxlIiwiYWRkIiwib25EaXNhYmxlIiwicmVtb3ZlIiwiX3ZhbGlkYXRlVGFyZ2V0SW5ERVYiLCJpc1BhcmVudCIsImlzQ2hpbGRPZiIsImVycm9ySUQiLCJmbGFnIiwiaXNBbGlnbiIsImN1cnJlbnQiLCJpc0hvcml6b250YWwiLCJ3aWR0aCIsImlzUGxheWluZyIsIl9TY2VuZSIsIkRldGVjdENvbmZsaWN0IiwiY2hlY2tDb25mbGljdF9XaWRnZXQiLCJoZWlnaHQiLCJ1cGRhdGVBbGlnbm1lbnQiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInByb3RvdHlwZSIsIkNDX0RFQlVHIiwid2FybiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFJQSxhQUFhLEdBQUdDLE9BQU8sQ0FBQyw0QkFBRCxDQUEzQjtBQUVBOzs7Ozs7QUFLQTs7Ozs7Ozs7Ozs7O0FBV0E7Ozs7OztBQUtBOzs7Ozs7O0FBS0EsSUFBSUMsU0FBUyxHQUFHRixhQUFhLENBQUNFLFNBQTlCO0FBRUEsSUFBSUMsVUFBVSxHQUFHSCxhQUFhLENBQUNJLFdBQS9CO0FBQ0EsSUFBSUMsR0FBRyxHQUFPRixVQUFVLENBQUNFLEdBQXpCO0FBQ0EsSUFBSUMsR0FBRyxHQUFPSCxVQUFVLENBQUNHLEdBQXpCO0FBQ0EsSUFBSUMsR0FBRyxHQUFPSixVQUFVLENBQUNJLEdBQXpC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QUNrRixJQUFwQztBQUNILEdBTmtEO0FBT25EeEQsRUFBQUEsR0FQbUQsZUFPOUNDLEtBUDhDLEVBT3ZDO0FBQ1IsUUFBSStFLFFBQUosRUFBYztBQUNWOUYsTUFBQUEsRUFBRSxDQUFDK0YsSUFBSCxDQUFRLG9HQUFSO0FBQ0g7O0FBQ0QsU0FBS2xDLFNBQUwsR0FBaUI5QyxLQUFLLEdBQUczQixTQUFTLENBQUNrRixJQUFiLEdBQW9CbEYsU0FBUyxDQUFDbUYsTUFBcEQ7QUFDSDtBQVprRCxDQUF2RDtBQWdCQXZFLEVBQUUsQ0FBQ0QsTUFBSCxHQUFZaUcsTUFBTSxDQUFDQyxPQUFQLEdBQWlCbEcsTUFBN0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnZhciBXaWRnZXRNYW5hZ2VyID0gcmVxdWlyZSgnLi4vYmFzZS11aS9DQ1dpZGdldE1hbmFnZXInKTtcblxuLyoqXG4gKiAhI2VuIEVudW0gZm9yIFdpZGdldCdzIGFsaWdubWVudCBtb2RlLCBpbmRpY2F0aW5nIHdoZW4gdGhlIHdpZGdldCBzaG91bGQgcmVmcmVzaC5cbiAqICEjemggV2lkZ2V0IOeahOWvuem9kOaooeW8j++8jOihqOekuiBXaWRnZXQg5bqU6K+l5L2V5pe25Yi35paw44CCXG4gKiBAZW51bSBXaWRnZXQuQWxpZ25Nb2RlXG4gKi9cbi8qKlxuICogISNlblxuICogT25seSBhbGlnbiBvbmNlIHdoZW4gdGhlIFdpZGdldCBpcyBlbmFibGVkIGZvciB0aGUgZmlyc3QgdGltZS5cbiAqIFRoaXMgd2lsbCBhbGxvdyB0aGUgc2NyaXB0IG9yIGFuaW1hdGlvbiB0byBjb250aW51ZSBjb250cm9sbGluZyB0aGUgY3VycmVudCBub2RlLlxuICogSXQgd2lsbCBvbmx5IGJlIGFsaWduZWQgb25jZSBiZWZvcmUgdGhlIGVuZCBvZiBmcmFtZSB3aGVuIG9uRW5hYmxlIGlzIGNhbGxlZCxcbiAqIHRoZW4gaW1tZWRpYXRlbHkgZGlzYWJsZXMgdGhlIFdpZGdldC5cbiAqICEjemhcbiAqIOS7heWcqCBXaWRnZXQg56ys5LiA5qyh5r+A5rS75pe25a+56b2Q5LiA5qyh77yM5L6/5LqO6ISa5pys5oiW5Yqo55S757un57ut5o6n5Yi25b2T5YmN6IqC54K544CCXG4gKiDlvIDlkK/lkI7kvJrlnKggb25FbmFibGUg5pe25omA5Zyo55qE6YKj5LiA5bin57uT5p2f5YmN5a+56b2Q5LiA5qyh77yM54S25ZCO56uL5Yi756aB55So6K+lIFdpZGdldOOAglxuICogQHByb3BlcnR5IHtOdW1iZXJ9IE9OQ0VcbiAqL1xuLyoqXG4gKiAhI2VuIEFsaWduIGZpcnN0IGZyb20gdGhlIGJlZ2lubmluZyBhcyBPTkNFLCBhbmQgdGhlbiByZWFsaWduIGl0IGV2ZXJ5IHRpbWUgdGhlIHdpbmRvdyBpcyByZXNpemVkLlxuICogISN6aCDkuIDlvIDlp4vkvJrlg48gT05DRSDkuIDmoLflr7npvZDkuIDmrKHvvIzkuYvlkI7mr4/lvZPnqpflj6PlpKflsI/mlLnlj5jml7bov5jkvJrph43mlrDlr7npvZDjgIJcbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBPTl9XSU5ET1dfUkVTSVpFXG4gKi9cbi8qKlxuICogISNlbiBLZWVwIGFsaWduaW5nIGFsbCB0aGUgd2F5LlxuICogISN6aCDlp4vnu4jkv53mjIHlr7npvZDjgIJcbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBBTFdBWVNcbiAqL1xudmFyIEFsaWduTW9kZSA9IFdpZGdldE1hbmFnZXIuQWxpZ25Nb2RlO1xuXG52YXIgQWxpZ25GbGFncyA9IFdpZGdldE1hbmFnZXIuX0FsaWduRmxhZ3M7XG52YXIgVE9QICAgICA9IEFsaWduRmxhZ3MuVE9QO1xudmFyIE1JRCAgICAgPSBBbGlnbkZsYWdzLk1JRDtcbnZhciBCT1QgICAgID0gQWxpZ25GbGFncy5CT1Q7XG52YXIgTEVGVCAgICA9IEFsaWduRmxhZ3MuTEVGVDtcbnZhciBDRU5URVIgID0gQWxpZ25GbGFncy5DRU5URVI7XG52YXIgUklHSFQgICA9IEFsaWduRmxhZ3MuUklHSFQ7XG52YXIgVE9QX0JPVCA9IFRPUCB8IEJPVDtcbnZhciBMRUZUX1JJR0hUID0gTEVGVCB8IFJJR0hUO1xuXG4vKipcbiAqICEjZW5cbiAqIFN0b3JlcyBhbmQgbWFuaXB1bGF0ZSB0aGUgYW5jaG9yaW5nIGJhc2VkIG9uIGl0cyBwYXJlbnQuXG4gKiBXaWRnZXQgYXJlIHVzZWQgZm9yIEdVSSBidXQgY2FuIGFsc28gYmUgdXNlZCBmb3Igb3RoZXIgdGhpbmdzLlxuICogV2lkZ2V0IHdpbGwgYWRqdXN0IGN1cnJlbnQgbm9kZSdzIHBvc2l0aW9uIGFuZCBzaXplIGF1dG9tYXRpY2FsbHksIGJ1dCB0aGUgcmVzdWx0cyBhZnRlciBhZGp1c3RtZW50IGNhbiBub3QgYmUgb2J0YWluZWQgdW50aWwgdGhlIG5leHQgZnJhbWUgdW5sZXNzIHlvdSBjYWxsIHt7I2Nyb3NzTGluayBcIldpZGdldC91cGRhdGVBbGlnbm1lbnQ6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319IG1hbnVhbGx5LlxuICogISN6aFxuICogV2lkZ2V0IOe7hOS7tu+8jOeUqOS6juiuvue9ruWSjOmAgumFjeWFtuebuOWvueS6jueItuiKgueCueeahOi+uei3ne+8jFdpZGdldCDpgJrluLjooqvnlKjkuo4gVUkg55WM6Z2i77yM5Lmf5Y+v5Lul55So5LqO5YW25LuW5Zyw5pa544CCXG4gKiBXaWRnZXQg5Lya6Ieq5Yqo6LCD5pW05b2T5YmN6IqC54K555qE5Z2Q5qCH5ZKM5a696auY77yM5LiN6L+H55uu5YmN6LCD5pW05ZCO55qE57uT5p6c6KaB5Yiw5LiL5LiA5bin5omN6IO95Zyo6ISa5pys6YeM6I635Y+W5Yiw77yM6Zmk6Z2e5L2g5YWI5omL5Yqo6LCD55SoIHt7I2Nyb3NzTGluayBcIldpZGdldC91cGRhdGVBbGlnbm1lbnQ6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua31944CCXG4gKlxuICogQGNsYXNzIFdpZGdldFxuICogQGV4dGVuZHMgQ29tcG9uZW50XG4gKi9cbnZhciBXaWRnZXQgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLldpZGdldCcsIGV4dGVuZHM6IHJlcXVpcmUoJy4vQ0NDb21wb25lbnQnKSxcblxuICAgIGVkaXRvcjogQ0NfRURJVE9SICYmIHtcbiAgICAgICAgbWVudTogJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC51aS9XaWRnZXQnLFxuICAgICAgICBoZWxwOiAnaTE4bjpDT01QT05FTlQuaGVscF91cmwud2lkZ2V0JyxcbiAgICAgICAgaW5zcGVjdG9yOiAncGFja2FnZXM6Ly9pbnNwZWN0b3IvaW5zcGVjdG9ycy9jb21wcy9jY3dpZGdldC5qcycsXG4gICAgICAgIGV4ZWN1dGVJbkVkaXRNb2RlOiB0cnVlLFxuICAgICAgICBkaXNhbGxvd011bHRpcGxlOiB0cnVlLFxuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gU3BlY2lmaWVzIGFuIGFsaWdubWVudCB0YXJnZXQgdGhhdCBjYW4gb25seSBiZSBvbmUgb2YgdGhlIHBhcmVudCBub2RlcyBvZiB0aGUgY3VycmVudCBub2RlLlxuICAgICAgICAgKiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyBudWxsLCBhbmQgd2hlbiBudWxsLCBpbmRpY2F0ZXMgdGhlIGN1cnJlbnQgcGFyZW50LlxuICAgICAgICAgKiAhI3poIOaMh+WumuS4gOS4quWvuem9kOebruagh++8jOWPquiDveaYr+W9k+WJjeiKgueCueeahOWFtuS4reS4gOS4queItuiKgueCue+8jOm7mOiupOS4uuepuu+8jOS4uuepuuaXtuihqOekuuW9k+WJjeeItuiKgueCueOAglxuICAgICAgICAgKiBAcHJvcGVydHkge05vZGV9IHRhcmdldFxuICAgICAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICAgICAqL1xuICAgICAgICB0YXJnZXQ6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl90YXJnZXQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl90YXJnZXQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAoQ0NfRURJVE9SICYmICFjYy5lbmdpbmUuX2lzUGxheWluZyAmJiB0aGlzLm5vZGUuX3BhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBhZGp1c3QgdGhlIG9mZnNldHMgdG8ga2VlcCB0aGUgc2l6ZSBhbmQgcG9zaXRpb24gdW5jaGFuZ2VkIGFmdGVyIHRhcmdldCBjaGFnbmVkXG4gICAgICAgICAgICAgICAgICAgIFdpZGdldE1hbmFnZXIudXBkYXRlT2Zmc2V0c1RvU3RheVB1dCh0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQud2lkZ2V0LnRhcmdldCcsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gRU5BQkxFIEFMSUdOID9cblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBXaGV0aGVyIHRvIGFsaWduIHRoZSB0b3AuXG4gICAgICAgICAqICEjemgg5piv5ZCm5a+56b2Q5LiK6L6544CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBpc0FsaWduVG9wXG4gICAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgaXNBbGlnblRvcDoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICh0aGlzLl9hbGlnbkZsYWdzICYgVE9QKSA+IDA7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXRBbGlnbihUT1AsIHZhbHVlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQud2lkZ2V0LmFsaWduX3RvcCcsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVmVydGljYWxseSBhbGlnbnMgdGhlIG1pZHBvaW50LCBUaGlzIHdpbGwgb3BlbiB0aGUgb3RoZXIgdmVydGljYWwgYWxpZ25tZW50IG9wdGlvbnMgY2FuY2VsLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOaYr+WQpuWeguebtOaWueWQkeWvuem9kOS4reeCue+8jOW8gOWQr+atpOmhueS8muWwhuWeguebtOaWueWQkeWFtuS7luWvuem9kOmAiemhueWPlua2iOOAglxuICAgICAgICAgKiBAcHJvcGVydHkgaXNBbGlnblZlcnRpY2FsQ2VudGVyXG4gICAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgaXNBbGlnblZlcnRpY2FsQ2VudGVyOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKHRoaXMuX2FsaWduRmxhZ3MgJiBNSUQpID4gMDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQWxpZ25Ub3AgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0FsaWduQm90dG9tID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FsaWduRmxhZ3MgfD0gTUlEO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWxpZ25GbGFncyAmPSB+TUlEO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQud2lkZ2V0LmFsaWduX3ZfY2VudGVyJyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBXaGV0aGVyIHRvIGFsaWduIHRoZSBib3R0b20uXG4gICAgICAgICAqICEjemgg5piv5ZCm5a+56b2Q5LiL6L6544CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBpc0FsaWduQm90dG9tXG4gICAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgaXNBbGlnbkJvdHRvbToge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICh0aGlzLl9hbGlnbkZsYWdzICYgQk9UKSA+IDA7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXRBbGlnbihCT1QsIHZhbHVlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQud2lkZ2V0LmFsaWduX2JvdHRvbScsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gV2hldGhlciB0byBhbGlnbiB0aGUgbGVmdC5cbiAgICAgICAgICogISN6aCDmmK/lkKblr7npvZDlt6bovrlcbiAgICAgICAgICogQHByb3BlcnR5IGlzQWxpZ25MZWZ0XG4gICAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgaXNBbGlnbkxlZnQ6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAodGhpcy5fYWxpZ25GbGFncyAmIExFRlQpID4gMDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NldEFsaWduKExFRlQsIHZhbHVlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQud2lkZ2V0LmFsaWduX2xlZnQnLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIEhvcml6b250YWwgYWxpZ25zIHRoZSBtaWRwb2ludC4gVGhpcyB3aWxsIG9wZW4gdGhlIG90aGVyIGhvcml6b250YWwgYWxpZ25tZW50IG9wdGlvbnMgY2FuY2VsZWQuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5piv5ZCm5rC05bmz5pa55ZCR5a+56b2Q5Lit54K577yM5byA5ZCv5q2k6YCJ6aG55Lya5bCG5rC05bmz5pa55ZCR5YW25LuW5a+56b2Q6YCJ6aG55Y+W5raI44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBpc0FsaWduSG9yaXpvbnRhbENlbnRlclxuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICovXG4gICAgICAgIGlzQWxpZ25Ib3Jpem9udGFsQ2VudGVyOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKHRoaXMuX2FsaWduRmxhZ3MgJiBDRU5URVIpID4gMDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQWxpZ25MZWZ0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNBbGlnblJpZ2h0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FsaWduRmxhZ3MgfD0gQ0VOVEVSO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWxpZ25GbGFncyAmPSB+Q0VOVEVSO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQud2lkZ2V0LmFsaWduX2hfY2VudGVyJyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBXaGV0aGVyIHRvIGFsaWduIHRoZSByaWdodC5cbiAgICAgICAgICogISN6aCDmmK/lkKblr7npvZDlj7PovrnjgIJcbiAgICAgICAgICogQHByb3BlcnR5IGlzQWxpZ25SaWdodFxuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICovXG4gICAgICAgIGlzQWxpZ25SaWdodDoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICh0aGlzLl9hbGlnbkZsYWdzICYgUklHSFQpID4gMDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NldEFsaWduKFJJR0hULCB2YWx1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULndpZGdldC5hbGlnbl9yaWdodCcsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogV2hldGhlciB0aGUgc3RyZXRjaGVkIGhvcml6b250YWxseSwgd2hlbiBlbmFibGUgdGhlIGxlZnQgYW5kIHJpZ2h0IGFsaWdubWVudCB3aWxsIGJlIHN0cmV0Y2hlZCBob3Jpem9udGFsbHksXG4gICAgICAgICAqIHRoZSB3aWR0aCBzZXR0aW5nIGlzIGludmFsaWQgKHJlYWQgb25seSkuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5b2T5YmN5piv5ZCm5rC05bmz5ouJ5Ly444CC5b2T5ZCM5pe25ZCv55So5bem5Y+z5a+56b2Q5pe277yM6IqC54K55bCG5Lya6KKr5rC05bmz5ouJ5Ly477yM5q2k5pe26IqC54K555qE5a695bqm5Y+q6K+744CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBpc1N0cmV0Y2hXaWR0aFxuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICogQHJlYWRPbmx5XG4gICAgICAgICAqL1xuICAgICAgICBpc1N0cmV0Y2hXaWR0aDoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICh0aGlzLl9hbGlnbkZsYWdzICYgTEVGVF9SSUdIVCkgPT09IExFRlRfUklHSFQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogV2hldGhlciB0aGUgc3RyZXRjaGVkIHZlcnRpY2FsbHksIHdoZW4gZW5hYmxlIHRoZSBsZWZ0IGFuZCByaWdodCBhbGlnbm1lbnQgd2lsbCBiZSBzdHJldGNoZWQgdmVydGljYWxseSxcbiAgICAgICAgICogdGhlbiBoZWlnaHQgc2V0dGluZyBpcyBpbnZhbGlkIChyZWFkIG9ubHkpXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5b2T5YmN5piv5ZCm5Z6C55u05ouJ5Ly444CC5b2T5ZCM5pe25ZCv55So5LiK5LiL5a+56b2Q5pe277yM6IqC54K55bCG5Lya6KKr5Z6C55u05ouJ5Ly477yM5q2k5pe26IqC54K555qE6auY5bqm5Y+q6K+744CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBpc1N0cmV0Y2hIZWlnaHRcbiAgICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgICAqIEByZWFkT25seVxuICAgICAgICAgKi9cbiAgICAgICAgaXNTdHJldGNoSGVpZ2h0OiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKHRoaXMuX2FsaWduRmxhZ3MgJiBUT1BfQk9UKSA9PT0gVE9QX0JPVDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIEFMSUdOIE1BUkdJTlNcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgbWFyZ2lucyBiZXR3ZWVuIHRoZSB0b3Agb2YgdGhpcyBub2RlIGFuZCB0aGUgdG9wIG9mIHBhcmVudCBub2RlLFxuICAgICAgICAgKiB0aGUgdmFsdWUgY2FuIGJlIG5lZ2F0aXZlLCBPbmx5IGF2YWlsYWJsZSBpbiAnaXNBbGlnblRvcCcgb3Blbi5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDmnKzoioLngrnpobbovrnlkozniLboioLngrnpobbovrnnmoTot53nprvvvIzlj6/loavlhpnotJ/lgLzvvIzlj6rmnInlnKggaXNBbGlnblRvcCDlvIDlkK/ml7bmiY3mnInkvZznlKjjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHRvcFxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0b3A6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl90b3A7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl90b3AgPSB2YWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULndpZGdldC50b3AnLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBtYXJnaW5zIGJldHdlZW4gdGhlIGJvdHRvbSBvZiB0aGlzIG5vZGUgYW5kIHRoZSBib3R0b20gb2YgcGFyZW50IG5vZGUsXG4gICAgICAgICAqIHRoZSB2YWx1ZSBjYW4gYmUgbmVnYXRpdmUsIE9ubHkgYXZhaWxhYmxlIGluICdpc0FsaWduQm90dG9tJyBvcGVuLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOacrOiKgueCueW6lei+ueWSjOeItuiKgueCueW6lei+ueeahOi3neemu++8jOWPr+Whq+WGmei0n+WAvO+8jOWPquacieWcqCBpc0FsaWduQm90dG9tIOW8gOWQr+aXtuaJjeacieS9nOeUqOOAglxuICAgICAgICAgKiBAcHJvcGVydHkgYm90dG9tXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIGJvdHRvbToge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvdHRvbTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2JvdHRvbSA9IHZhbHVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQud2lkZ2V0LmJvdHRvbScsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIG1hcmdpbnMgYmV0d2VlbiB0aGUgbGVmdCBvZiB0aGlzIG5vZGUgYW5kIHRoZSBsZWZ0IG9mIHBhcmVudCBub2RlLFxuICAgICAgICAgKiB0aGUgdmFsdWUgY2FuIGJlIG5lZ2F0aXZlLCBPbmx5IGF2YWlsYWJsZSBpbiAnaXNBbGlnbkxlZnQnIG9wZW4uXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5pys6IqC54K55bem6L655ZKM54i26IqC54K55bem6L6555qE6Led56a777yM5Y+v5aGr5YaZ6LSf5YC877yM5Y+q5pyJ5ZyoIGlzQWxpZ25MZWZ0IOW8gOWQr+aXtuaJjeacieS9nOeUqOOAglxuICAgICAgICAgKiBAcHJvcGVydHkgbGVmdFxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICBsZWZ0OiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbGVmdDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xlZnQgPSB2YWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULndpZGdldC5sZWZ0JyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgbWFyZ2lucyBiZXR3ZWVuIHRoZSByaWdodCBvZiB0aGlzIG5vZGUgYW5kIHRoZSByaWdodCBvZiBwYXJlbnQgbm9kZSxcbiAgICAgICAgICogdGhlIHZhbHVlIGNhbiBiZSBuZWdhdGl2ZSwgT25seSBhdmFpbGFibGUgaW4gJ2lzQWxpZ25SaWdodCcgb3Blbi5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDmnKzoioLngrnlj7PovrnlkozniLboioLngrnlj7PovrnnmoTot53nprvvvIzlj6/loavlhpnotJ/lgLzvvIzlj6rmnInlnKggaXNBbGlnblJpZ2h0IOW8gOWQr+aXtuaJjeacieS9nOeUqOOAglxuICAgICAgICAgKiBAcHJvcGVydHkgcmlnaHRcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgcmlnaHQ6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yaWdodDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JpZ2h0ID0gdmFsdWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC53aWRnZXQucmlnaHQnLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIEhvcml6b250YWwgYWxpZ25zIHRoZSBtaWRwb2ludCBvZmZzZXQgdmFsdWUsXG4gICAgICAgICAqIHRoZSB2YWx1ZSBjYW4gYmUgbmVnYXRpdmUsIE9ubHkgYXZhaWxhYmxlIGluICdpc0FsaWduSG9yaXpvbnRhbENlbnRlcicgb3Blbi5cbiAgICAgICAgICogISN6aCDmsLTlubPlsYXkuK3nmoTlgY/np7vlgLzvvIzlj6/loavlhpnotJ/lgLzvvIzlj6rmnInlnKggaXNBbGlnbkhvcml6b250YWxDZW50ZXIg5byA5ZCv5pe25omN5pyJ5L2c55So44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBob3Jpem9udGFsQ2VudGVyXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIGhvcml6b250YWxDZW50ZXI6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9ob3Jpem9udGFsQ2VudGVyO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faG9yaXpvbnRhbENlbnRlciA9IHZhbHVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQud2lkZ2V0Lmhvcml6b250YWxfY2VudGVyJyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBWZXJ0aWNhbCBhbGlnbnMgdGhlIG1pZHBvaW50IG9mZnNldCB2YWx1ZSxcbiAgICAgICAgICogdGhlIHZhbHVlIGNhbiBiZSBuZWdhdGl2ZSwgT25seSBhdmFpbGFibGUgaW4gJ2lzQWxpZ25WZXJ0aWNhbENlbnRlcicgb3Blbi5cbiAgICAgICAgICogISN6aCDlnoLnm7TlsYXkuK3nmoTlgY/np7vlgLzvvIzlj6/loavlhpnotJ/lgLzvvIzlj6rmnInlnKggaXNBbGlnblZlcnRpY2FsQ2VudGVyIOW8gOWQr+aXtuaJjeacieS9nOeUqOOAglxuICAgICAgICAgKiBAcHJvcGVydHkgdmVydGljYWxDZW50ZXJcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgdmVydGljYWxDZW50ZXI6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl92ZXJ0aWNhbENlbnRlcjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3ZlcnRpY2FsQ2VudGVyID0gdmFsdWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC53aWRnZXQudmVydGljYWxfY2VudGVyJyxcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBQQVJDRU5UQUdFIE9SIEFCU09MVVRFXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gSWYgdHJ1ZSwgaG9yaXpvbnRhbENlbnRlciBpcyBwaXhlbCBtYXJnaW4sIG90aGVyd2lzZSBpcyBwZXJjZW50YWdlICgwIC0gMSkgbWFyZ2luLlxuICAgICAgICAgKiAhI3poIOWmguaenOS4uiB0cnVl77yMXCJob3Jpem9udGFsQ2VudGVyXCIg5bCG5Lya5Lul5YOP57Sg5L2c5Li65YGP56e75YC877yM5Y+N5LmL5Li655m+5YiG5q+U77yIMCDliLAgMe+8ieOAglxuICAgICAgICAgKiBAcHJvcGVydHkgaXNBYnNvbHV0ZUhvcml6b250YWxDZW50ZXJcbiAgICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgICAgICovXG4gICAgICAgIGlzQWJzb2x1dGVIb3Jpem9udGFsQ2VudGVyOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faXNBYnNIb3Jpem9udGFsQ2VudGVyO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faXNBYnNIb3Jpem9udGFsQ2VudGVyID0gdmFsdWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBJZiB0cnVlLCB2ZXJ0aWNhbENlbnRlciBpcyBwaXhlbCBtYXJnaW4sIG90aGVyd2lzZSBpcyBwZXJjZW50YWdlICgwIC0gMSkgbWFyZ2luLlxuICAgICAgICAgKiAhI3poIOWmguaenOS4uiB0cnVl77yMXCJ2ZXJ0aWNhbENlbnRlclwiIOWwhuS8muS7peWDj+e0oOS9nOS4uuWBj+enu+WAvO+8jOWPjeS5i+S4uueZvuWIhuavlO+8iDAg5YiwIDHvvInjgIJcbiAgICAgICAgICogQHByb3BlcnR5IGlzQWJzb2x1dGVWZXJ0aWNhbENlbnRlclxuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICogQGRlZmF1bHQgdHJ1ZVxuICAgICAgICAgKi9cbiAgICAgICAgaXNBYnNvbHV0ZVZlcnRpY2FsQ2VudGVyOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faXNBYnNWZXJ0aWNhbENlbnRlcjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2lzQWJzVmVydGljYWxDZW50ZXIgPSB2YWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIElmIHRydWUsIHRvcCBpcyBwaXhlbCBtYXJnaW4sIG90aGVyd2lzZSBpcyBwZXJjZW50YWdlICgwIC0gMSkgbWFyZ2luIHJlbGF0aXZlIHRvIHRoZSBwYXJlbnQncyBoZWlnaHQuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5aaC5p6c5Li6IHRydWXvvIxcInRvcFwiIOWwhuS8muS7peWDj+e0oOS9nOS4uui+uei3ne+8jOWQpuWImeWwhuS8muS7peebuOWvueeItueJqeS9k+mrmOW6pueahOeZvuWIhuavlO+8iDAg5YiwIDHvvInkvZzkuLrovrnot53jgIJcbiAgICAgICAgICogQHByb3BlcnR5IGlzQWJzb2x1dGVUb3BcbiAgICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgICAgICovXG4gICAgICAgIGlzQWJzb2x1dGVUb3A6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9pc0Fic1RvcDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2lzQWJzVG9wID0gdmFsdWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBJZiB0cnVlLCBib3R0b20gaXMgcGl4ZWwgbWFyZ2luLCBvdGhlcndpc2UgaXMgcGVyY2VudGFnZSAoMCAtIDEpIG1hcmdpbiByZWxhdGl2ZSB0byB0aGUgcGFyZW50J3MgaGVpZ2h0LlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOWmguaenOS4uiB0cnVl77yMXCJib3R0b21cIiDlsIbkvJrku6Xlg4/ntKDkvZzkuLrovrnot53vvIzlkKbliJnlsIbkvJrku6Xnm7jlr7nniLbniankvZPpq5jluqbnmoTnmb7liIbmr5TvvIgwIOWIsCAx77yJ5L2c5Li66L656Led44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBpc0Fic29sdXRlQm90dG9tXG4gICAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICAgKiBAZGVmYXVsdCB0cnVlXG4gICAgICAgICAqL1xuICAgICAgICBpc0Fic29sdXRlQm90dG9tOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faXNBYnNCb3R0b207XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pc0Fic0JvdHRvbSA9IHZhbHVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogSWYgdHJ1ZSwgbGVmdCBpcyBwaXhlbCBtYXJnaW4sIG90aGVyd2lzZSBpcyBwZXJjZW50YWdlICgwIC0gMSkgbWFyZ2luIHJlbGF0aXZlIHRvIHRoZSBwYXJlbnQncyB3aWR0aC5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDlpoLmnpzkuLogdHJ1Ze+8jFwibGVmdFwiIOWwhuS8muS7peWDj+e0oOS9nOS4uui+uei3ne+8jOWQpuWImeWwhuS8muS7peebuOWvueeItueJqeS9k+WuveW6pueahOeZvuWIhuavlO+8iDAg5YiwIDHvvInkvZzkuLrovrnot53jgIJcbiAgICAgICAgICogQHByb3BlcnR5IGlzQWJzb2x1dGVMZWZ0XG4gICAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICAgKiBAZGVmYXVsdCB0cnVlXG4gICAgICAgICAqL1xuICAgICAgICBpc0Fic29sdXRlTGVmdDoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzQWJzTGVmdDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2lzQWJzTGVmdCA9IHZhbHVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogSWYgdHJ1ZSwgcmlnaHQgaXMgcGl4ZWwgbWFyZ2luLCBvdGhlcndpc2UgaXMgcGVyY2VudGFnZSAoMCAtIDEpIG1hcmdpbiByZWxhdGl2ZSB0byB0aGUgcGFyZW50J3Mgd2lkdGguXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5aaC5p6c5Li6IHRydWXvvIxcInJpZ2h0XCIg5bCG5Lya5Lul5YOP57Sg5L2c5Li66L656Led77yM5ZCm5YiZ5bCG5Lya5Lul55u45a+554i254mp5L2T5a695bqm55qE55m+5YiG5q+U77yIMCDliLAgMe+8ieS9nOS4uui+uei3neOAglxuICAgICAgICAgKiBAcHJvcGVydHkgaXNBYnNvbHV0ZVJpZ2h0XG4gICAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICAgKiBAZGVmYXVsdCB0cnVlXG4gICAgICAgICAqL1xuICAgICAgICBpc0Fic29sdXRlUmlnaHQ6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9pc0Fic1JpZ2h0O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faXNBYnNSaWdodCA9IHZhbHVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gU3BlY2lmaWVzIHRoZSBhbGlnbm1lbnQgbW9kZSBvZiB0aGUgV2lkZ2V0LCB3aGljaCBkZXRlcm1pbmVzIHdoZW4gdGhlIHdpZGdldCBzaG91bGQgcmVmcmVzaC5cbiAgICAgICAgICogISN6aCDmjIflrpogV2lkZ2V0IOeahOWvuem9kOaooeW8j++8jOeUqOS6juWGs+WumiBXaWRnZXQg5bqU6K+l5L2V5pe25Yi35paw44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7V2lkZ2V0LkFsaWduTW9kZX0gYWxpZ25Nb2RlXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIHdpZGdldC5hbGlnbk1vZGUgPSBjYy5XaWRnZXQuQWxpZ25Nb2RlLk9OX1dJTkRPV19SRVNJWkU7XG4gICAgICAgICAqL1xuICAgICAgICBhbGlnbk1vZGU6IHtcbiAgICAgICAgICAgZGVmYXVsdDogQWxpZ25Nb2RlLk9OX1dJTkRPV19SRVNJWkUsXG4gICAgICAgICAgIHR5cGU6IEFsaWduTW9kZSxcbiAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC53aWRnZXQuYWxpZ25fbW9kZScsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy9cblxuICAgICAgICBfd2FzQWxpZ25PbmNlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICBmb3JtZXJseVNlcmlhbGl6ZWRBczogJ2lzQWxpZ25PbmNlJyxcbiAgICAgICAgfSxcblxuICAgICAgICBfdGFyZ2V0OiBudWxsLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI3poOiDlr7npvZDlvIDlhbPvvIznlLEgQWxpZ25GbGFncyDnu4TmiJBcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3BlcnR5IF9hbGlnbkZsYWdzXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIF9hbGlnbkZsYWdzOiAwLFxuXG4gICAgICAgIF9sZWZ0OiAwLFxuICAgICAgICBfcmlnaHQ6IDAsXG4gICAgICAgIF90b3A6IDAsXG4gICAgICAgIF9ib3R0b206IDAsXG4gICAgICAgIF92ZXJ0aWNhbENlbnRlcjogMCxcbiAgICAgICAgX2hvcml6b250YWxDZW50ZXI6IDAsXG4gICAgICAgIF9pc0Fic0xlZnQ6IHRydWUsXG4gICAgICAgIF9pc0Fic1JpZ2h0OiB0cnVlLFxuICAgICAgICBfaXNBYnNUb3A6IHRydWUsXG4gICAgICAgIF9pc0Fic0JvdHRvbTogdHJ1ZSxcbiAgICAgICAgX2lzQWJzSG9yaXpvbnRhbENlbnRlcjogdHJ1ZSxcbiAgICAgICAgX2lzQWJzVmVydGljYWxDZW50ZXI6IHRydWUsXG5cbiAgICAgICAgLy8gb3JpZ2luYWwgc2l6ZSBiZWZvcmUgYWxpZ25cbiAgICAgICAgX29yaWdpbmFsV2lkdGg6IDAsXG4gICAgICAgIF9vcmlnaW5hbEhlaWdodDogMFxuICAgIH0sXG5cbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIEFsaWduTW9kZTogQWxpZ25Nb2RlLFxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3dhc0FsaWduT25jZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBtaWdyYXRlIGZvciBvbGQgdmVyc2lvblxuICAgICAgICAgICAgdGhpcy5hbGlnbk1vZGUgPSB0aGlzLl93YXNBbGlnbk9uY2UgPyBBbGlnbk1vZGUuT05DRSA6IEFsaWduTW9kZS5BTFdBWVM7XG4gICAgICAgICAgICB0aGlzLl93YXNBbGlnbk9uY2UgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25FbmFibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgV2lkZ2V0TWFuYWdlci5hZGQodGhpcyk7XG4gICAgfSxcblxuICAgIG9uRGlzYWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBXaWRnZXRNYW5hZ2VyLnJlbW92ZSh0aGlzKTtcbiAgICB9LFxuXG4gICAgX3ZhbGlkYXRlVGFyZ2V0SW5ERVY6IENDX0RFViAmJiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0YXJnZXQgPSB0aGlzLl90YXJnZXQ7XG4gICAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgICAgIHZhciBpc1BhcmVudCA9IHRoaXMubm9kZSAhPT0gdGFyZ2V0ICYmIHRoaXMubm9kZS5pc0NoaWxkT2YodGFyZ2V0KTtcbiAgICAgICAgICAgIGlmICghaXNQYXJlbnQpIHtcbiAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDY1MDApO1xuICAgICAgICAgICAgICAgIHRoaXMuX3RhcmdldCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBfc2V0QWxpZ246IGZ1bmN0aW9uIChmbGFnLCBpc0FsaWduKSB7XG4gICAgICAgIHZhciBjdXJyZW50ID0gKHRoaXMuX2FsaWduRmxhZ3MgJiBmbGFnKSA+IDA7XG4gICAgICAgIGlmIChpc0FsaWduID09PSBjdXJyZW50KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGlzSG9yaXpvbnRhbCA9IChmbGFnICYgTEVGVF9SSUdIVCkgPiAwO1xuICAgICAgICBpZiAoaXNBbGlnbikge1xuICAgICAgICAgICAgdGhpcy5fYWxpZ25GbGFncyB8PSBmbGFnO1xuXG4gICAgICAgICAgICBpZiAoaXNIb3Jpem9udGFsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0FsaWduSG9yaXpvbnRhbENlbnRlciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzU3RyZXRjaFdpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGJlY29tZSBzdHJldGNoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29yaWdpbmFsV2lkdGggPSB0aGlzLm5vZGUud2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRlc3QgY2hlY2sgY29uZmxpY3RcbiAgICAgICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUiAmJiAhY2MuZW5naW5lLmlzUGxheWluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgX1NjZW5lLkRldGVjdENvbmZsaWN0LmNoZWNrQ29uZmxpY3RfV2lkZ2V0KHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0FsaWduVmVydGljYWxDZW50ZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1N0cmV0Y2hIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYmVjb21lIHN0cmV0Y2hcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb3JpZ2luYWxIZWlnaHQgPSB0aGlzLm5vZGUuaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAvLyB0ZXN0IGNoZWNrIGNvbmZsaWN0XG4gICAgICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IgJiYgIWNjLmVuZ2luZS5pc1BsYXlpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9TY2VuZS5EZXRlY3RDb25mbGljdC5jaGVja0NvbmZsaWN0X1dpZGdldCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKENDX0VESVRPUiAmJiAhY2MuZW5naW5lLl9pc1BsYXlpbmcgJiYgdGhpcy5ub2RlLl9wYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAvLyBhZGp1c3QgdGhlIG9mZnNldHMgdG8ga2VlcCB0aGUgc2l6ZSBhbmQgcG9zaXRpb24gdW5jaGFuZ2VkIGFmdGVyIGFsaWdubWVudCBjaGFnbmVkXG4gICAgICAgICAgICAgICAgV2lkZ2V0TWFuYWdlci51cGRhdGVPZmZzZXRzVG9TdGF5UHV0KHRoaXMsIGZsYWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGlzSG9yaXpvbnRhbCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzU3RyZXRjaFdpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHdpbGwgY2FuY2VsIHN0cmV0Y2hcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLndpZHRoID0gdGhpcy5fb3JpZ2luYWxXaWR0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1N0cmV0Y2hIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gd2lsbCBjYW5jZWwgc3RyZXRjaFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuaGVpZ2h0ID0gdGhpcy5fb3JpZ2luYWxIZWlnaHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9hbGlnbkZsYWdzICY9IH5mbGFnO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBJbW1lZGlhdGVseSBwZXJmb3JtIHRoZSB3aWRnZXQgYWxpZ25tZW50LiBZb3UgbmVlZCB0byBtYW51YWxseSBjYWxsIHRoaXMgbWV0aG9kIG9ubHkgaWZcbiAgICAgKiB5b3UgbmVlZCB0byBnZXQgdGhlIGxhdGVzdCByZXN1bHRzIGFmdGVyIHRoZSBhbGlnbm1lbnQgYmVmb3JlIHRoZSBlbmQgb2YgY3VycmVudCBmcmFtZS5cbiAgICAgKiAhI3poXG4gICAgICog56uL5Yi75omn6KGMIHdpZGdldCDlr7npvZDmk43kvZzjgILov5nkuKrmjqXlj6PkuIDoiKzkuI3pnIDopoHmiYvlt6XosIPnlKjjgIJcbiAgICAgKiDlj6rmnInlvZPkvaDpnIDopoHlnKjlvZPliY3luKfnu5PmnZ/liY3ojrflvpcgd2lkZ2V0IOWvuem9kOWQjueahOacgOaWsOe7k+aenOaXtuaJjemcgOimgeaJi+WKqOiwg+eUqOi/meS4quaWueazleOAglxuICAgICAqXG4gICAgICogQG1ldGhvZCB1cGRhdGVBbGlnbm1lbnRcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogd2lkZ2V0LnRvcCA9IDEwOyAgICAgICAvLyBjaGFuZ2UgdG9wIG1hcmdpblxuICAgICAqIGNjLmxvZyh3aWRnZXQubm9kZS55KTsgLy8gbm90IHlldCBjaGFuZ2VkXG4gICAgICogd2lkZ2V0LnVwZGF0ZUFsaWdubWVudCgpO1xuICAgICAqIGNjLmxvZyh3aWRnZXQubm9kZS55KTsgLy8gY2hhbmdlZFxuICAgICAqL1xuICAgIHVwZGF0ZUFsaWdubWVudDogZnVuY3Rpb24gKCkge1xuICAgICAgICBXaWRnZXRNYW5hZ2VyLnVwZGF0ZUFsaWdubWVudCh0aGlzLm5vZGUpO1xuICAgIH0sXG59KTtcblxuLyoqXG4gKiAhI2VuXG4gKiBXaGVuIHR1cm5lZCBvbiwgaXQgd2lsbCBvbmx5IGJlIGFsaWduZWQgb25jZSBhdCB0aGUgZW5kIG9mIHRoZSBvbkVuYWJsZSBmcmFtZSxcbiAqIHRoZW4gaW1tZWRpYXRlbHkgZGlzYWJsZXMgdGhlIGN1cnJlbnQgY29tcG9uZW50LlxuICogVGhpcyB3aWxsIGFsbG93IHRoZSBzY3JpcHQgb3IgYW5pbWF0aW9uIHRvIGNvbnRpbnVlIGNvbnRyb2xsaW5nIHRoZSBjdXJyZW50IG5vZGUuXG4gKiBOb3RlOiBJdCB3aWxsIHN0aWxsIGJlIGFsaWduZWQgYXQgdGhlIGZyYW1lIHdoZW4gb25FbmFibGUgaXMgY2FsbGVkLlxuICogISN6aFxuICog5byA5ZCv5ZCO5LuF5Lya5ZyoIG9uRW5hYmxlIOeahOW9k+W4p+e7k+adn+aXtuWvuem9kOS4gOasoe+8jOeEtuWQjueri+WIu+emgeeUqOW9k+WJjee7hOS7tuOAglxuICog6L+Z5qC35L6/5LqO6ISa5pys5oiW5Yqo55S757un57ut5o6n5Yi25b2T5YmN6IqC54K544CCXG4gKiDms6jmhI/vvJpvbkVuYWJsZSDml7bmiYDlnKjnmoTpgqPkuIDluKfku43nhLbkvJrov5vooYzlr7npvZDjgIJcbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gaXNBbGlnbk9uY2VcbiAqIEBkZWZhdWx0IGZhbHNlXG4gKiBAZGVwcmVjYXRlZFxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoV2lkZ2V0LnByb3RvdHlwZSwgJ2lzQWxpZ25PbmNlJywge1xuICAgIGdldCAoKSB7XG4gICAgICAgIGlmIChDQ19ERUJVRykge1xuICAgICAgICAgICAgY2Mud2FybignYHdpZGdldC5pc0FsaWduT25jZWAgaXMgZGVwcmVjYXRlZCwgdXNlIGB3aWRnZXQuYWxpZ25Nb2RlID09PSBjYy5XaWRnZXQuQWxpZ25Nb2RlLk9OQ0VgIGluc3RlYWQgcGxlYXNlLicpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmFsaWduTW9kZSA9PT0gQWxpZ25Nb2RlLk9OQ0U7XG4gICAgfSxcbiAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgIGlmIChDQ19ERUJVRykge1xuICAgICAgICAgICAgY2Mud2FybignYHdpZGdldC5pc0FsaWduT25jZWAgaXMgZGVwcmVjYXRlZCwgdXNlIGB3aWRnZXQuYWxpZ25Nb2RlID0gY2MuV2lkZ2V0LkFsaWduTW9kZS4qYCBpbnN0ZWFkIHBsZWFzZS4nKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFsaWduTW9kZSA9IHZhbHVlID8gQWxpZ25Nb2RlLk9OQ0UgOiBBbGlnbk1vZGUuQUxXQVlTO1xuICAgIH1cbn0pO1xuXG5cbmNjLldpZGdldCA9IG1vZHVsZS5leHBvcnRzID0gV2lkZ2V0O1xuIl19