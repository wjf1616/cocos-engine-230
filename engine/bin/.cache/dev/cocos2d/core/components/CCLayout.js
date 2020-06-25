
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCLayout.js';
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
var NodeEvent = require('../CCNode').EventType;
/**
 * !#en Enum for Layout type
 * !#zh 布局类型
 * @enum Layout.Type
 */


var Type = cc.Enum({
  /**
   * !#en None Layout
   * !#zh 取消布局
   *@property {Number} NONE
   */
  NONE: 0,

  /**
   * !#en Horizontal Layout
   * !#zh 水平布局
   * @property {Number} HORIZONTAL
   */
  HORIZONTAL: 1,

  /**
   * !#en Vertical Layout
   * !#zh 垂直布局
   * @property {Number} VERTICAL
   */
  VERTICAL: 2,

  /**
   * !#en Grid Layout
   * !#zh 网格布局
   * @property {Number} GRID
   */
  GRID: 3
});
/**
 * !#en Enum for Layout Resize Mode
 * !#zh 缩放模式
 * @enum Layout.ResizeMode
 */

var ResizeMode = cc.Enum({
  /**
   * !#en Don't do any scale.
   * !#zh 不做任何缩放
   * @property {Number} NONE
   */
  NONE: 0,

  /**
   * !#en The container size will be expanded with its children's size.
   * !#zh 容器的大小会根据子节点的大小自动缩放。
   * @property {Number} CONTAINER
   */
  CONTAINER: 1,

  /**
   * !#en Child item size will be adjusted with the container's size.
   * !#zh 子节点的大小会随着容器的大小自动缩放。
   * @property {Number} CHILDREN
   */
  CHILDREN: 2
});
/**
 * !#en Enum for Grid Layout start axis direction.
 * The items in grid layout will be arranged in each axis at first.;
 * !#zh 布局轴向，只用于 GRID 布局。
 * @enum Layout.AxisDirection
 */

var AxisDirection = cc.Enum({
  /**
   * !#en The horizontal axis.
   * !#zh 进行水平方向布局
   * @property {Number} HORIZONTAL
   */
  HORIZONTAL: 0,

  /**
   * !#en The vertical axis.
   * !#zh 进行垂直方向布局
   * @property {Number} VERTICAL
   */
  VERTICAL: 1
});
/**
 * !#en Enum for vertical layout direction.
 *  Used in Grid Layout together with AxisDirection is VERTICAL
 * !#zh 垂直方向布局方式
 * @enum Layout.VerticalDirection
 */

var VerticalDirection = cc.Enum({
  /**
   * !#en Items arranged from bottom to top.
   * !#zh 从下到上排列
   * @property {Number} BOTTOM_TO_TOP
   */
  BOTTOM_TO_TOP: 0,

  /**
   * !#en Items arranged from top to bottom.
   * !#zh 从上到下排列
   * @property {Number} TOP_TO_BOTTOM
   */
  TOP_TO_BOTTOM: 1
});
/**
 * !#en Enum for horizontal layout direction.
 *  Used in Grid Layout together with AxisDirection is HORIZONTAL
 * !#zh 水平方向布局方式
 * @enum Layout.HorizontalDirection
 */

var HorizontalDirection = cc.Enum({
  /**
   * !#en Items arranged from left to right.
   * !#zh 从左往右排列
   * @property {Number} LEFT_TO_RIGHT
   */
  LEFT_TO_RIGHT: 0,

  /**
   * !#en Items arranged from right to left.
   * !#zh 从右往左排列
   *@property {Number} RIGHT_TO_LEFT
   */
  RIGHT_TO_LEFT: 1
});
/**
 * !#en
 * The Layout is a container component, use it to arrange child elements easily.<br>
 * Note：<br>
 * 1.Scaling and rotation of child nodes are not considered.<br>
 * 2.After setting the Layout, the results need to be updated until the next frame,
 * unless you manually call {{#crossLink "Layout/updateLayout:method"}}{{/crossLink}}。
 * !#zh
 * Layout 组件相当于一个容器，能自动对它的所有子节点进行统一排版。<br>
 * 注意：<br>
 * 1.不会考虑子节点的缩放和旋转。<br>
 * 2.对 Layout 设置后结果需要到下一帧才会更新，除非你设置完以后手动调用 {{#crossLink "Layout/updateLayout:method"}}{{/crossLink}}。
 * @class Layout
 * @extends Component
 */

var Layout = cc.Class({
  name: 'cc.Layout',
  "extends": require('./CCComponent'),
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.ui/Layout',
    help: 'i18n:COMPONENT.help_url.layout',
    inspector: 'packages://inspector/inspectors/comps/cclayout.js',
    executeInEditMode: true
  },
  properties: {
    _layoutSize: cc.size(300, 200),
    _layoutDirty: {
      "default": true,
      serializable: false
    },
    _resize: ResizeMode.NONE,
    //TODO: refactoring this name after data upgrade machanism is out.
    _N$layoutType: Type.NONE,

    /**
     * !#en The layout type.
     * !#zh 布局类型
     * @property {Layout.Type} type
     * @default Layout.Type.NONE
     */
    type: {
      type: Type,
      get: function get() {
        return this._N$layoutType;
      },
      set: function set(value) {
        this._N$layoutType = value;

        if (CC_EDITOR && this.type !== Type.NONE && this._resize === ResizeMode.CONTAINER && !cc.engine.isPlaying) {
          var reLayouted = _Scene.DetectConflict.checkConflict_Layout(this);

          if (reLayouted) {
            return;
          }
        }

        this._doLayoutDirty();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.layout.layout_type',
      animatable: false
    },

    /**
     * !#en
     * The are three resize modes for Layout.
     * None, resize Container and resize children.
     * !#zh 缩放模式
     * @property {Layout.ResizeMode} resizeMode
     * @default ResizeMode.NONE
     */
    resizeMode: {
      type: ResizeMode,
      tooltip: CC_DEV && 'i18n:COMPONENT.layout.resize_mode',
      animatable: false,
      get: function get() {
        return this._resize;
      },
      set: function set(value) {
        if (this.type === Type.NONE && value === ResizeMode.CHILDREN) {
          return;
        }

        this._resize = value;

        if (CC_EDITOR && value === ResizeMode.CONTAINER && !cc.engine.isPlaying) {
          var reLayouted = _Scene.DetectConflict.checkConflict_Layout(this);

          if (reLayouted) {
            return;
          }
        }

        this._doLayoutDirty();
      }
    },

    /**
     * !#en The cell size for grid layout.
     * !#zh 每个格子的大小，只有布局类型为 GRID 的时候才有效。
     * @property {Size} cellSize
     * @default cc.size(40, 40)
     */
    cellSize: {
      "default": cc.size(40, 40),
      tooltip: CC_DEV && 'i18n:COMPONENT.layout.cell_size',
      type: cc.Size,
      notify: function notify() {
        this._doLayoutDirty();
      }
    },

    /**
     * !#en
     * The start axis for grid layout. If you choose horizontal, then children will layout horizontally at first,
     * and then break line on demand. Choose vertical if you want to layout vertically at first .
     * !#zh 起始轴方向类型，可进行水平和垂直布局排列，只有布局类型为 GRID 的时候才有效。
     * @property {Layout.AxisDirection} startAxis
     */
    startAxis: {
      "default": AxisDirection.HORIZONTAL,
      tooltip: CC_DEV && 'i18n:COMPONENT.layout.start_axis',
      type: AxisDirection,
      notify: function notify() {
        if (CC_EDITOR && this._resize === ResizeMode.CONTAINER && !cc.engine.isPlaying) {
          var reLayouted = _Scene.DetectConflict.checkConflict_Layout(this);

          if (reLayouted) {
            return;
          }
        }

        this._doLayoutDirty();
      },
      animatable: false
    },
    _N$padding: {
      "default": 0
    },

    /**
     * !#en The left padding of layout, it only effect the layout in one direction.
     * !#zh 容器内左边距，只会在一个布局方向上生效。
     * @property {Number} paddingLeft
     */
    paddingLeft: {
      "default": 0,
      tooltip: CC_DEV && 'i18n:COMPONENT.layout.padding_left',
      notify: function notify() {
        this._doLayoutDirty();
      }
    },

    /**
     * !#en The right padding of layout, it only effect the layout in one direction.
     * !#zh 容器内右边距，只会在一个布局方向上生效。
     * @property {Number} paddingRight
     */
    paddingRight: {
      "default": 0,
      tooltip: CC_DEV && 'i18n:COMPONENT.layout.padding_right',
      notify: function notify() {
        this._doLayoutDirty();
      }
    },

    /**
     * !#en The top padding of layout, it only effect the layout in one direction.
     * !#zh 容器内上边距，只会在一个布局方向上生效。
     * @property {Number} paddingTop
     */
    paddingTop: {
      "default": 0,
      tooltip: CC_DEV && 'i18n:COMPONENT.layout.padding_top',
      notify: function notify() {
        this._doLayoutDirty();
      }
    },

    /**
     * !#en The bottom padding of layout, it only effect the layout in one direction.
     * !#zh 容器内下边距，只会在一个布局方向上生效。
     * @property {Number} paddingBottom
     */
    paddingBottom: {
      "default": 0,
      tooltip: CC_DEV && 'i18n:COMPONENT.layout.padding_bottom',
      notify: function notify() {
        this._doLayoutDirty();
      }
    },

    /**
     * !#en The distance in x-axis between each element in layout.
     * !#zh 子节点之间的水平间距。
     * @property {Number} spacingX
     */
    spacingX: {
      "default": 0,
      notify: function notify() {
        this._doLayoutDirty();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.layout.space_x'
    },

    /**
     * !#en The distance in y-axis between each element in layout.
     * !#zh 子节点之间的垂直间距。
     * @property {Number} spacingY
     */
    spacingY: {
      "default": 0,
      notify: function notify() {
        this._doLayoutDirty();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.layout.space_y'
    },

    /**
     * !#en
     * Only take effect in Vertical layout mode.
     * This option changes the start element's positioning.
     * !#zh 垂直排列子节点的方向。
     * @property {Layout.VerticalDirection} verticalDirection
     */
    verticalDirection: {
      "default": VerticalDirection.TOP_TO_BOTTOM,
      type: VerticalDirection,
      notify: function notify() {
        this._doLayoutDirty();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.layout.vertical_direction',
      animatable: false
    },

    /**
     * !#en
     * Only take effect in Horizontal layout mode.
     * This option changes the start element's positioning.
     * !#zh 水平排列子节点的方向。
     * @property {Layout.HorizontalDirection} horizontalDirection
     */
    horizontalDirection: {
      "default": HorizontalDirection.LEFT_TO_RIGHT,
      type: HorizontalDirection,
      notify: function notify() {
        this._doLayoutDirty();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.layout.horizontal_direction',
      animatable: false
    },

    /**
     * !#en Adjust the layout if the children scaled.
     * !#zh 子节点缩放比例是否影响布局。
     * @property affectedByScale
     * @type {Boolean}
     * @default false
     */
    affectedByScale: {
      "default": false,
      notify: function notify() {
        // every time you switch this state, the layout will be calculated.
        this._doLayoutDirty();
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.layout.affected_by_scale'
    }
  },
  statics: {
    Type: Type,
    VerticalDirection: VerticalDirection,
    HorizontalDirection: HorizontalDirection,
    ResizeMode: ResizeMode,
    AxisDirection: AxisDirection
  },
  _migratePaddingData: function _migratePaddingData() {
    this.paddingLeft = this._N$padding;
    this.paddingRight = this._N$padding;
    this.paddingTop = this._N$padding;
    this.paddingBottom = this._N$padding;
    this._N$padding = 0;
  },
  onEnable: function onEnable() {
    this._addEventListeners();

    if (this.node.getContentSize().equals(cc.size(0, 0))) {
      this.node.setContentSize(this._layoutSize);
    }

    if (this._N$padding !== 0) {
      this._migratePaddingData();
    }

    this._doLayoutDirty();
  },
  onDisable: function onDisable() {
    this._removeEventListeners();
  },
  _doLayoutDirty: function _doLayoutDirty() {
    this._layoutDirty = true;
  },
  _doScaleDirty: function _doScaleDirty() {
    this._layoutDirty = this._layoutDirty || this.affectedByScale;
  },
  _addEventListeners: function _addEventListeners() {
    cc.director.on(cc.Director.EVENT_AFTER_UPDATE, this.updateLayout, this);
    this.node.on(NodeEvent.SIZE_CHANGED, this._resized, this);
    this.node.on(NodeEvent.ANCHOR_CHANGED, this._doLayoutDirty, this);
    this.node.on(NodeEvent.CHILD_ADDED, this._childAdded, this);
    this.node.on(NodeEvent.CHILD_REMOVED, this._childRemoved, this);
    this.node.on(NodeEvent.CHILD_REORDER, this._doLayoutDirty, this);

    this._addChildrenEventListeners();
  },
  _removeEventListeners: function _removeEventListeners() {
    cc.director.off(cc.Director.EVENT_AFTER_UPDATE, this.updateLayout, this);
    this.node.off(NodeEvent.SIZE_CHANGED, this._resized, this);
    this.node.off(NodeEvent.ANCHOR_CHANGED, this._doLayoutDirty, this);
    this.node.off(NodeEvent.CHILD_ADDED, this._childAdded, this);
    this.node.off(NodeEvent.CHILD_REMOVED, this._childRemoved, this);
    this.node.off(NodeEvent.CHILD_REORDER, this._doLayoutDirty, this);

    this._removeChildrenEventListeners();
  },
  _addChildrenEventListeners: function _addChildrenEventListeners() {
    var children = this.node.children;

    for (var i = 0; i < children.length; ++i) {
      var child = children[i];
      child.on(NodeEvent.SCALE_CHANGED, this._doScaleDirty, this);
      child.on(NodeEvent.SIZE_CHANGED, this._doLayoutDirty, this);
      child.on(NodeEvent.POSITION_CHANGED, this._doLayoutDirty, this);
      child.on(NodeEvent.ANCHOR_CHANGED, this._doLayoutDirty, this);
      child.on('active-in-hierarchy-changed', this._doLayoutDirty, this);
    }
  },
  _removeChildrenEventListeners: function _removeChildrenEventListeners() {
    var children = this.node.children;

    for (var i = 0; i < children.length; ++i) {
      var child = children[i];
      child.off(NodeEvent.SCALE_CHANGED, this._doScaleDirty, this);
      child.off(NodeEvent.SIZE_CHANGED, this._doLayoutDirty, this);
      child.off(NodeEvent.POSITION_CHANGED, this._doLayoutDirty, this);
      child.off(NodeEvent.ANCHOR_CHANGED, this._doLayoutDirty, this);
      child.off('active-in-hierarchy-changed', this._doLayoutDirty, this);
    }
  },
  _childAdded: function _childAdded(child) {
    child.on(NodeEvent.SCALE_CHANGED, this._doScaleDirty, this);
    child.on(NodeEvent.SIZE_CHANGED, this._doLayoutDirty, this);
    child.on(NodeEvent.POSITION_CHANGED, this._doLayoutDirty, this);
    child.on(NodeEvent.ANCHOR_CHANGED, this._doLayoutDirty, this);
    child.on('active-in-hierarchy-changed', this._doLayoutDirty, this);

    this._doLayoutDirty();
  },
  _childRemoved: function _childRemoved(child) {
    child.off(NodeEvent.SCALE_CHANGED, this._doScaleDirty, this);
    child.off(NodeEvent.SIZE_CHANGED, this._doLayoutDirty, this);
    child.off(NodeEvent.POSITION_CHANGED, this._doLayoutDirty, this);
    child.off(NodeEvent.ANCHOR_CHANGED, this._doLayoutDirty, this);
    child.off('active-in-hierarchy-changed', this._doLayoutDirty, this);

    this._doLayoutDirty();
  },
  _resized: function _resized() {
    this._layoutSize = this.node.getContentSize();

    this._doLayoutDirty();
  },
  _doLayoutHorizontally: function _doLayoutHorizontally(baseWidth, rowBreak, fnPositionY, applyChildren) {
    var layoutAnchor = this.node.getAnchorPoint();
    var children = this.node.children;
    var sign = 1;
    var paddingX = this.paddingLeft;
    var leftBoundaryOfLayout = -layoutAnchor.x * baseWidth;

    if (this.horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
      sign = -1;
      leftBoundaryOfLayout = (1 - layoutAnchor.x) * baseWidth;
      paddingX = this.paddingRight;
    }

    var nextX = leftBoundaryOfLayout + sign * paddingX - sign * this.spacingX;
    var rowMaxHeight = 0;
    var tempMaxHeight = 0;
    var secondMaxHeight = 0;
    var row = 0;
    var containerResizeBoundary = 0;
    var maxHeightChildAnchorY = 0;
    var activeChildCount = 0;

    for (var i = 0; i < children.length; ++i) {
      var child = children[i];

      if (child.activeInHierarchy) {
        activeChildCount++;
      }
    }

    var newChildWidth = this.cellSize.width;

    if (this.type !== Type.GRID && this.resizeMode === ResizeMode.CHILDREN) {
      newChildWidth = (baseWidth - (this.paddingLeft + this.paddingRight) - (activeChildCount - 1) * this.spacingX) / activeChildCount;
    }

    for (var i = 0; i < children.length; ++i) {
      var child = children[i];

      var childScaleX = this._getUsedScaleValue(child.scaleX);

      var childScaleY = this._getUsedScaleValue(child.scaleY);

      if (!child.activeInHierarchy) {
        continue;
      } //for resizing children


      if (this._resize === ResizeMode.CHILDREN) {
        child.width = newChildWidth / childScaleX;

        if (this.type === Type.GRID) {
          child.height = this.cellSize.height / childScaleY;
        }
      }

      var anchorX = child.anchorX;
      var childBoundingBoxWidth = child.width * childScaleX;
      var childBoundingBoxHeight = child.height * childScaleY;

      if (secondMaxHeight > tempMaxHeight) {
        tempMaxHeight = secondMaxHeight;
      }

      if (childBoundingBoxHeight >= tempMaxHeight) {
        secondMaxHeight = tempMaxHeight;
        tempMaxHeight = childBoundingBoxHeight;
        maxHeightChildAnchorY = child.getAnchorPoint().y;
      }

      if (this.horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
        anchorX = 1 - child.anchorX;
      }

      nextX = nextX + sign * anchorX * childBoundingBoxWidth + sign * this.spacingX;
      var rightBoundaryOfChild = sign * (1 - anchorX) * childBoundingBoxWidth;

      if (rowBreak) {
        var rowBreakBoundary = nextX + rightBoundaryOfChild + sign * (sign > 0 ? this.paddingRight : this.paddingLeft);
        var leftToRightRowBreak = this.horizontalDirection === HorizontalDirection.LEFT_TO_RIGHT && rowBreakBoundary > (1 - layoutAnchor.x) * baseWidth;
        var rightToLeftRowBreak = this.horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT && rowBreakBoundary < -layoutAnchor.x * baseWidth;

        if (leftToRightRowBreak || rightToLeftRowBreak) {
          if (childBoundingBoxHeight >= tempMaxHeight) {
            if (secondMaxHeight === 0) {
              secondMaxHeight = tempMaxHeight;
            }

            rowMaxHeight += secondMaxHeight;
            secondMaxHeight = tempMaxHeight;
          } else {
            rowMaxHeight += tempMaxHeight;
            secondMaxHeight = childBoundingBoxHeight;
            tempMaxHeight = 0;
          }

          nextX = leftBoundaryOfLayout + sign * (paddingX + anchorX * childBoundingBoxWidth);
          row++;
        }
      }

      var finalPositionY = fnPositionY(child, rowMaxHeight, row);

      if (baseWidth >= childBoundingBoxWidth + this.paddingLeft + this.paddingRight) {
        if (applyChildren) {
          child.setPosition(cc.v2(nextX, finalPositionY));
        }
      }

      var signX = 1;
      var tempFinalPositionY;
      var topMarign = tempMaxHeight === 0 ? childBoundingBoxHeight : tempMaxHeight;

      if (this.verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
        containerResizeBoundary = containerResizeBoundary || this.node._contentSize.height;
        signX = -1;
        tempFinalPositionY = finalPositionY + signX * (topMarign * maxHeightChildAnchorY + this.paddingBottom);

        if (tempFinalPositionY < containerResizeBoundary) {
          containerResizeBoundary = tempFinalPositionY;
        }
      } else {
        containerResizeBoundary = containerResizeBoundary || -this.node._contentSize.height;
        tempFinalPositionY = finalPositionY + signX * (topMarign * maxHeightChildAnchorY + this.paddingTop);

        if (tempFinalPositionY > containerResizeBoundary) {
          containerResizeBoundary = tempFinalPositionY;
        }
      }

      nextX += rightBoundaryOfChild;
    }

    return containerResizeBoundary;
  },
  _getVerticalBaseHeight: function _getVerticalBaseHeight(children) {
    var newHeight = 0;
    var activeChildCount = 0;

    if (this.resizeMode === ResizeMode.CONTAINER) {
      for (var i = 0; i < children.length; ++i) {
        var child = children[i];

        if (child.activeInHierarchy) {
          activeChildCount++;
          newHeight += child.height * this._getUsedScaleValue(child.scaleY);
        }
      }

      newHeight += (activeChildCount - 1) * this.spacingY + this.paddingBottom + this.paddingTop;
    } else {
      newHeight = this.node.getContentSize().height;
    }

    return newHeight;
  },
  _doLayoutVertically: function _doLayoutVertically(baseHeight, columnBreak, fnPositionX, applyChildren) {
    var layoutAnchor = this.node.getAnchorPoint();
    var children = this.node.children;
    var sign = 1;
    var paddingY = this.paddingBottom;
    var bottomBoundaryOfLayout = -layoutAnchor.y * baseHeight;

    if (this.verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
      sign = -1;
      bottomBoundaryOfLayout = (1 - layoutAnchor.y) * baseHeight;
      paddingY = this.paddingTop;
    }

    var nextY = bottomBoundaryOfLayout + sign * paddingY - sign * this.spacingY;
    var columnMaxWidth = 0;
    var tempMaxWidth = 0;
    var secondMaxWidth = 0;
    var column = 0;
    var containerResizeBoundary = 0;
    var maxWidthChildAnchorX = 0;
    var activeChildCount = 0;

    for (var i = 0; i < children.length; ++i) {
      var child = children[i];

      if (child.activeInHierarchy) {
        activeChildCount++;
      }
    }

    var newChildHeight = this.cellSize.height;

    if (this.type !== Type.GRID && this.resizeMode === ResizeMode.CHILDREN) {
      newChildHeight = (baseHeight - (this.paddingTop + this.paddingBottom) - (activeChildCount - 1) * this.spacingY) / activeChildCount;
    }

    for (var i = 0; i < children.length; ++i) {
      var child = children[i];

      var childScaleX = this._getUsedScaleValue(child.scaleX);

      var childScaleY = this._getUsedScaleValue(child.scaleY);

      if (!child.activeInHierarchy) {
        continue;
      } //for resizing children


      if (this.resizeMode === ResizeMode.CHILDREN) {
        child.height = newChildHeight / childScaleY;

        if (this.type === Type.GRID) {
          child.width = this.cellSize.width / childScaleX;
        }
      }

      var anchorY = child.anchorY;
      var childBoundingBoxWidth = child.width * childScaleX;
      var childBoundingBoxHeight = child.height * childScaleY;

      if (secondMaxWidth > tempMaxWidth) {
        tempMaxWidth = secondMaxWidth;
      }

      if (childBoundingBoxWidth >= tempMaxWidth) {
        secondMaxWidth = tempMaxWidth;
        tempMaxWidth = childBoundingBoxWidth;
        maxWidthChildAnchorX = child.getAnchorPoint().x;
      }

      if (this.verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
        anchorY = 1 - child.anchorY;
      }

      nextY = nextY + sign * anchorY * childBoundingBoxHeight + sign * this.spacingY;
      var topBoundaryOfChild = sign * (1 - anchorY) * childBoundingBoxHeight;

      if (columnBreak) {
        var columnBreakBoundary = nextY + topBoundaryOfChild + sign * (sign > 0 ? this.paddingTop : this.paddingBottom);
        var bottomToTopColumnBreak = this.verticalDirection === VerticalDirection.BOTTOM_TO_TOP && columnBreakBoundary > (1 - layoutAnchor.y) * baseHeight;
        var topToBottomColumnBreak = this.verticalDirection === VerticalDirection.TOP_TO_BOTTOM && columnBreakBoundary < -layoutAnchor.y * baseHeight;

        if (bottomToTopColumnBreak || topToBottomColumnBreak) {
          if (childBoundingBoxWidth >= tempMaxWidth) {
            if (secondMaxWidth === 0) {
              secondMaxWidth = tempMaxWidth;
            }

            columnMaxWidth += secondMaxWidth;
            secondMaxWidth = tempMaxWidth;
          } else {
            columnMaxWidth += tempMaxWidth;
            secondMaxWidth = childBoundingBoxWidth;
            tempMaxWidth = 0;
          }

          nextY = bottomBoundaryOfLayout + sign * (paddingY + anchorY * childBoundingBoxHeight);
          column++;
        }
      }

      var finalPositionX = fnPositionX(child, columnMaxWidth, column);

      if (baseHeight >= childBoundingBoxHeight + (this.paddingTop + this.paddingBottom)) {
        if (applyChildren) {
          child.setPosition(cc.v2(finalPositionX, nextY));
        }
      }

      var signX = 1;
      var tempFinalPositionX; //when the item is the last column break item, the tempMaxWidth will be 0.

      var rightMarign = tempMaxWidth === 0 ? childBoundingBoxWidth : tempMaxWidth;

      if (this.horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
        signX = -1;
        containerResizeBoundary = containerResizeBoundary || this.node._contentSize.width;
        tempFinalPositionX = finalPositionX + signX * (rightMarign * maxWidthChildAnchorX + this.paddingLeft);

        if (tempFinalPositionX < containerResizeBoundary) {
          containerResizeBoundary = tempFinalPositionX;
        }
      } else {
        containerResizeBoundary = containerResizeBoundary || -this.node._contentSize.width;
        tempFinalPositionX = finalPositionX + signX * (rightMarign * maxWidthChildAnchorX + this.paddingRight);

        if (tempFinalPositionX > containerResizeBoundary) {
          containerResizeBoundary = tempFinalPositionX;
        }
      }

      nextY += topBoundaryOfChild;
    }

    return containerResizeBoundary;
  },
  _doLayoutBasic: function _doLayoutBasic() {
    var children = this.node.children;
    var allChildrenBoundingBox = null;

    for (var i = 0; i < children.length; ++i) {
      var child = children[i];

      if (child.activeInHierarchy) {
        if (!allChildrenBoundingBox) {
          allChildrenBoundingBox = child.getBoundingBoxToWorld();
        } else {
          allChildrenBoundingBox.union(allChildrenBoundingBox, child.getBoundingBoxToWorld());
        }
      }
    }

    if (allChildrenBoundingBox) {
      var leftBottomSpace = this.node.convertToNodeSpaceAR(cc.v2(allChildrenBoundingBox.x, allChildrenBoundingBox.y));
      leftBottomSpace = cc.v2(leftBottomSpace.x - this.paddingLeft, leftBottomSpace.y - this.paddingBottom);
      var rightTopSpace = this.node.convertToNodeSpaceAR(cc.v2(allChildrenBoundingBox.xMax, allChildrenBoundingBox.yMax));
      rightTopSpace = cc.v2(rightTopSpace.x + this.paddingRight, rightTopSpace.y + this.paddingTop);
      var newSize = rightTopSpace.sub(leftBottomSpace);
      newSize = cc.size(parseFloat(newSize.x.toFixed(2)), parseFloat(newSize.y.toFixed(2)));

      if (newSize.width !== 0) {
        // Invert is to get the coordinate point of the child node in the parent coordinate system
        var newAnchorX = -leftBottomSpace.x / newSize.width;
        this.node.anchorX = parseFloat(newAnchorX.toFixed(2));
      }

      if (newSize.height !== 0) {
        // Invert is to get the coordinate point of the child node in the parent coordinate system
        var newAnchorY = -leftBottomSpace.y / newSize.height;
        this.node.anchorY = parseFloat(newAnchorY.toFixed(2));
      }

      this.node.setContentSize(newSize);
    }
  },
  _doLayoutGridAxisHorizontal: function _doLayoutGridAxisHorizontal(layoutAnchor, layoutSize) {
    var baseWidth = layoutSize.width;
    var sign = 1;
    var bottomBoundaryOfLayout = -layoutAnchor.y * layoutSize.height;
    var paddingY = this.paddingBottom;

    if (this.verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
      sign = -1;
      bottomBoundaryOfLayout = (1 - layoutAnchor.y) * layoutSize.height;
      paddingY = this.paddingTop;
    }

    var fnPositionY = function (child, topOffset, row) {
      return bottomBoundaryOfLayout + sign * (topOffset + child.anchorY * child.height * this._getUsedScaleValue(child.scaleY) + paddingY + row * this.spacingY);
    }.bind(this);

    var newHeight = 0;

    if (this.resizeMode === ResizeMode.CONTAINER) {
      //calculate the new height of container, it won't change the position of it's children
      var boundary = this._doLayoutHorizontally(baseWidth, true, fnPositionY, false);

      newHeight = bottomBoundaryOfLayout - boundary;

      if (newHeight < 0) {
        newHeight *= -1;
      }

      bottomBoundaryOfLayout = -layoutAnchor.y * newHeight;

      if (this.verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
        sign = -1;
        bottomBoundaryOfLayout = (1 - layoutAnchor.y) * newHeight;
      }
    }

    this._doLayoutHorizontally(baseWidth, true, fnPositionY, true);

    if (this.resizeMode === ResizeMode.CONTAINER) {
      this.node.setContentSize(baseWidth, newHeight);
    }
  },
  _doLayoutGridAxisVertical: function _doLayoutGridAxisVertical(layoutAnchor, layoutSize) {
    var baseHeight = layoutSize.height;
    var sign = 1;
    var leftBoundaryOfLayout = -layoutAnchor.x * layoutSize.width;
    var paddingX = this.paddingLeft;

    if (this.horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
      sign = -1;
      leftBoundaryOfLayout = (1 - layoutAnchor.x) * layoutSize.width;
      paddingX = this.paddingRight;
    }

    var fnPositionX = function (child, leftOffset, column) {
      return leftBoundaryOfLayout + sign * (leftOffset + child.anchorX * child.width * this._getUsedScaleValue(child.scaleX) + paddingX + column * this.spacingX);
    }.bind(this);

    var newWidth = 0;

    if (this.resizeMode === ResizeMode.CONTAINER) {
      var boundary = this._doLayoutVertically(baseHeight, true, fnPositionX, false);

      newWidth = leftBoundaryOfLayout - boundary;

      if (newWidth < 0) {
        newWidth *= -1;
      }

      leftBoundaryOfLayout = -layoutAnchor.x * newWidth;

      if (this.horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
        sign = -1;
        leftBoundaryOfLayout = (1 - layoutAnchor.x) * newWidth;
      }
    }

    this._doLayoutVertically(baseHeight, true, fnPositionX, true);

    if (this.resizeMode === ResizeMode.CONTAINER) {
      this.node.setContentSize(newWidth, baseHeight);
    }
  },
  _doLayoutGrid: function _doLayoutGrid() {
    var layoutAnchor = this.node.getAnchorPoint();
    var layoutSize = this.node.getContentSize();

    if (this.startAxis === AxisDirection.HORIZONTAL) {
      this._doLayoutGridAxisHorizontal(layoutAnchor, layoutSize);
    } else if (this.startAxis === AxisDirection.VERTICAL) {
      this._doLayoutGridAxisVertical(layoutAnchor, layoutSize);
    }
  },
  _getHorizontalBaseWidth: function _getHorizontalBaseWidth(children) {
    var newWidth = 0;
    var activeChildCount = 0;

    if (this.resizeMode === ResizeMode.CONTAINER) {
      for (var i = 0; i < children.length; ++i) {
        var child = children[i];

        if (child.activeInHierarchy) {
          activeChildCount++;
          newWidth += child.width * this._getUsedScaleValue(child.scaleX);
        }
      }

      newWidth += (activeChildCount - 1) * this.spacingX + this.paddingLeft + this.paddingRight;
    } else {
      newWidth = this.node.getContentSize().width;
    }

    return newWidth;
  },
  _doLayout: function _doLayout() {
    if (this.type === Type.HORIZONTAL) {
      var newWidth = this._getHorizontalBaseWidth(this.node.children);

      var fnPositionY = function fnPositionY(child) {
        return child.y;
      };

      this._doLayoutHorizontally(newWidth, false, fnPositionY, true);

      this.node.width = newWidth;
    } else if (this.type === Type.VERTICAL) {
      var newHeight = this._getVerticalBaseHeight(this.node.children);

      var fnPositionX = function fnPositionX(child) {
        return child.x;
      };

      this._doLayoutVertically(newHeight, false, fnPositionX, true);

      this.node.height = newHeight;
    } else if (this.type === Type.NONE) {
      if (this.resizeMode === ResizeMode.CONTAINER) {
        this._doLayoutBasic();
      }
    } else if (this.type === Type.GRID) {
      this._doLayoutGrid();
    }
  },
  _getUsedScaleValue: function _getUsedScaleValue(value) {
    return this.affectedByScale ? Math.abs(value) : 1;
  },

  /**
   * !#en Perform the layout update
   * !#zh 立即执行更新布局
   *
   * @method updateLayout
   *
   * @example
   * layout.type = cc.Layout.HORIZONTAL;
   * layout.node.addChild(childNode);
   * cc.log(childNode.x); // not yet changed
   * layout.updateLayout();
   * cc.log(childNode.x); // changed
   */
  updateLayout: function updateLayout() {
    if (this._layoutDirty && this.node.children.length > 0) {
      this._doLayout();

      this._layoutDirty = false;
    }
  }
});
/**
 * !#en The padding of layout, it effects the layout in four direction.
 * !#zh 容器内边距，该属性会在四个布局方向上生效。
 * @property {Number} padding
 */

Object.defineProperty(Layout.prototype, "padding", {
  get: function get() {
    cc.warnID(4100);
    return this.paddingLeft;
  },
  set: function set(value) {
    this._N$padding = value;

    this._migratePaddingData();

    this._doLayoutDirty();
  }
});
cc.Layout = module.exports = Layout;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDTGF5b3V0LmpzIl0sIm5hbWVzIjpbIk5vZGVFdmVudCIsInJlcXVpcmUiLCJFdmVudFR5cGUiLCJUeXBlIiwiY2MiLCJFbnVtIiwiTk9ORSIsIkhPUklaT05UQUwiLCJWRVJUSUNBTCIsIkdSSUQiLCJSZXNpemVNb2RlIiwiQ09OVEFJTkVSIiwiQ0hJTERSRU4iLCJBeGlzRGlyZWN0aW9uIiwiVmVydGljYWxEaXJlY3Rpb24iLCJCT1RUT01fVE9fVE9QIiwiVE9QX1RPX0JPVFRPTSIsIkhvcml6b250YWxEaXJlY3Rpb24iLCJMRUZUX1RPX1JJR0hUIiwiUklHSFRfVE9fTEVGVCIsIkxheW91dCIsIkNsYXNzIiwibmFtZSIsImVkaXRvciIsIkNDX0VESVRPUiIsIm1lbnUiLCJoZWxwIiwiaW5zcGVjdG9yIiwiZXhlY3V0ZUluRWRpdE1vZGUiLCJwcm9wZXJ0aWVzIiwiX2xheW91dFNpemUiLCJzaXplIiwiX2xheW91dERpcnR5Iiwic2VyaWFsaXphYmxlIiwiX3Jlc2l6ZSIsIl9OJGxheW91dFR5cGUiLCJ0eXBlIiwiZ2V0Iiwic2V0IiwidmFsdWUiLCJlbmdpbmUiLCJpc1BsYXlpbmciLCJyZUxheW91dGVkIiwiX1NjZW5lIiwiRGV0ZWN0Q29uZmxpY3QiLCJjaGVja0NvbmZsaWN0X0xheW91dCIsIl9kb0xheW91dERpcnR5IiwidG9vbHRpcCIsIkNDX0RFViIsImFuaW1hdGFibGUiLCJyZXNpemVNb2RlIiwiY2VsbFNpemUiLCJTaXplIiwibm90aWZ5Iiwic3RhcnRBeGlzIiwiX04kcGFkZGluZyIsInBhZGRpbmdMZWZ0IiwicGFkZGluZ1JpZ2h0IiwicGFkZGluZ1RvcCIsInBhZGRpbmdCb3R0b20iLCJzcGFjaW5nWCIsInNwYWNpbmdZIiwidmVydGljYWxEaXJlY3Rpb24iLCJob3Jpem9udGFsRGlyZWN0aW9uIiwiYWZmZWN0ZWRCeVNjYWxlIiwic3RhdGljcyIsIl9taWdyYXRlUGFkZGluZ0RhdGEiLCJvbkVuYWJsZSIsIl9hZGRFdmVudExpc3RlbmVycyIsIm5vZGUiLCJnZXRDb250ZW50U2l6ZSIsImVxdWFscyIsInNldENvbnRlbnRTaXplIiwib25EaXNhYmxlIiwiX3JlbW92ZUV2ZW50TGlzdGVuZXJzIiwiX2RvU2NhbGVEaXJ0eSIsImRpcmVjdG9yIiwib24iLCJEaXJlY3RvciIsIkVWRU5UX0FGVEVSX1VQREFURSIsInVwZGF0ZUxheW91dCIsIlNJWkVfQ0hBTkdFRCIsIl9yZXNpemVkIiwiQU5DSE9SX0NIQU5HRUQiLCJDSElMRF9BRERFRCIsIl9jaGlsZEFkZGVkIiwiQ0hJTERfUkVNT1ZFRCIsIl9jaGlsZFJlbW92ZWQiLCJDSElMRF9SRU9SREVSIiwiX2FkZENoaWxkcmVuRXZlbnRMaXN0ZW5lcnMiLCJvZmYiLCJfcmVtb3ZlQ2hpbGRyZW5FdmVudExpc3RlbmVycyIsImNoaWxkcmVuIiwiaSIsImxlbmd0aCIsImNoaWxkIiwiU0NBTEVfQ0hBTkdFRCIsIlBPU0lUSU9OX0NIQU5HRUQiLCJfZG9MYXlvdXRIb3Jpem9udGFsbHkiLCJiYXNlV2lkdGgiLCJyb3dCcmVhayIsImZuUG9zaXRpb25ZIiwiYXBwbHlDaGlsZHJlbiIsImxheW91dEFuY2hvciIsImdldEFuY2hvclBvaW50Iiwic2lnbiIsInBhZGRpbmdYIiwibGVmdEJvdW5kYXJ5T2ZMYXlvdXQiLCJ4IiwibmV4dFgiLCJyb3dNYXhIZWlnaHQiLCJ0ZW1wTWF4SGVpZ2h0Iiwic2Vjb25kTWF4SGVpZ2h0Iiwicm93IiwiY29udGFpbmVyUmVzaXplQm91bmRhcnkiLCJtYXhIZWlnaHRDaGlsZEFuY2hvclkiLCJhY3RpdmVDaGlsZENvdW50IiwiYWN0aXZlSW5IaWVyYXJjaHkiLCJuZXdDaGlsZFdpZHRoIiwid2lkdGgiLCJjaGlsZFNjYWxlWCIsIl9nZXRVc2VkU2NhbGVWYWx1ZSIsInNjYWxlWCIsImNoaWxkU2NhbGVZIiwic2NhbGVZIiwiaGVpZ2h0IiwiYW5jaG9yWCIsImNoaWxkQm91bmRpbmdCb3hXaWR0aCIsImNoaWxkQm91bmRpbmdCb3hIZWlnaHQiLCJ5IiwicmlnaHRCb3VuZGFyeU9mQ2hpbGQiLCJyb3dCcmVha0JvdW5kYXJ5IiwibGVmdFRvUmlnaHRSb3dCcmVhayIsInJpZ2h0VG9MZWZ0Um93QnJlYWsiLCJmaW5hbFBvc2l0aW9uWSIsInNldFBvc2l0aW9uIiwidjIiLCJzaWduWCIsInRlbXBGaW5hbFBvc2l0aW9uWSIsInRvcE1hcmlnbiIsIl9jb250ZW50U2l6ZSIsIl9nZXRWZXJ0aWNhbEJhc2VIZWlnaHQiLCJuZXdIZWlnaHQiLCJfZG9MYXlvdXRWZXJ0aWNhbGx5IiwiYmFzZUhlaWdodCIsImNvbHVtbkJyZWFrIiwiZm5Qb3NpdGlvblgiLCJwYWRkaW5nWSIsImJvdHRvbUJvdW5kYXJ5T2ZMYXlvdXQiLCJuZXh0WSIsImNvbHVtbk1heFdpZHRoIiwidGVtcE1heFdpZHRoIiwic2Vjb25kTWF4V2lkdGgiLCJjb2x1bW4iLCJtYXhXaWR0aENoaWxkQW5jaG9yWCIsIm5ld0NoaWxkSGVpZ2h0IiwiYW5jaG9yWSIsInRvcEJvdW5kYXJ5T2ZDaGlsZCIsImNvbHVtbkJyZWFrQm91bmRhcnkiLCJib3R0b21Ub1RvcENvbHVtbkJyZWFrIiwidG9wVG9Cb3R0b21Db2x1bW5CcmVhayIsImZpbmFsUG9zaXRpb25YIiwidGVtcEZpbmFsUG9zaXRpb25YIiwicmlnaHRNYXJpZ24iLCJfZG9MYXlvdXRCYXNpYyIsImFsbENoaWxkcmVuQm91bmRpbmdCb3giLCJnZXRCb3VuZGluZ0JveFRvV29ybGQiLCJ1bmlvbiIsImxlZnRCb3R0b21TcGFjZSIsImNvbnZlcnRUb05vZGVTcGFjZUFSIiwicmlnaHRUb3BTcGFjZSIsInhNYXgiLCJ5TWF4IiwibmV3U2l6ZSIsInN1YiIsInBhcnNlRmxvYXQiLCJ0b0ZpeGVkIiwibmV3QW5jaG9yWCIsIm5ld0FuY2hvclkiLCJfZG9MYXlvdXRHcmlkQXhpc0hvcml6b250YWwiLCJsYXlvdXRTaXplIiwidG9wT2Zmc2V0IiwiYmluZCIsImJvdW5kYXJ5IiwiX2RvTGF5b3V0R3JpZEF4aXNWZXJ0aWNhbCIsImxlZnRPZmZzZXQiLCJuZXdXaWR0aCIsIl9kb0xheW91dEdyaWQiLCJfZ2V0SG9yaXpvbnRhbEJhc2VXaWR0aCIsIl9kb0xheW91dCIsIk1hdGgiLCJhYnMiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInByb3RvdHlwZSIsIndhcm5JRCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFNQSxTQUFTLEdBQUdDLE9BQU8sQ0FBQyxXQUFELENBQVAsQ0FBcUJDLFNBQXZDO0FBRUE7Ozs7Ozs7QUFLQSxJQUFJQyxJQUFJLEdBQUdDLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRO0FBQ2Y7Ozs7O0FBS0FDLEVBQUFBLElBQUksRUFBRSxDQU5TOztBQU9mOzs7OztBQUtBQyxFQUFBQSxVQUFVLEVBQUUsQ0FaRzs7QUFjZjs7Ozs7QUFLQUMsRUFBQUEsUUFBUSxFQUFFLENBbkJLOztBQW9CZjs7Ozs7QUFLQUMsRUFBQUEsSUFBSSxFQUFFO0FBekJTLENBQVIsQ0FBWDtBQTRCQTs7Ozs7O0FBS0EsSUFBSUMsVUFBVSxHQUFHTixFQUFFLENBQUNDLElBQUgsQ0FBUTtBQUNyQjs7Ozs7QUFLQUMsRUFBQUEsSUFBSSxFQUFFLENBTmU7O0FBT3JCOzs7OztBQUtBSyxFQUFBQSxTQUFTLEVBQUUsQ0FaVTs7QUFhckI7Ozs7O0FBS0FDLEVBQUFBLFFBQVEsRUFBRTtBQWxCVyxDQUFSLENBQWpCO0FBcUJBOzs7Ozs7O0FBTUEsSUFBSUMsYUFBYSxHQUFHVCxFQUFFLENBQUNDLElBQUgsQ0FBUTtBQUN4Qjs7Ozs7QUFLQUUsRUFBQUEsVUFBVSxFQUFFLENBTlk7O0FBT3hCOzs7OztBQUtBQyxFQUFBQSxRQUFRLEVBQUU7QUFaYyxDQUFSLENBQXBCO0FBZUE7Ozs7Ozs7QUFNQSxJQUFJTSxpQkFBaUIsR0FBR1YsRUFBRSxDQUFDQyxJQUFILENBQVE7QUFDNUI7Ozs7O0FBS0FVLEVBQUFBLGFBQWEsRUFBRSxDQU5hOztBQU81Qjs7Ozs7QUFLQUMsRUFBQUEsYUFB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QVUsSUFBVjtBQUNBLFdBQU8sS0FBSzNJLFdBQVo7QUFDSCxHQUo4QztBQUsvQ2xCLEVBQUFBLEdBQUcsRUFBRSxhQUFVQyxLQUFWLEVBQWlCO0FBQ2xCLFNBQUtnQixVQUFMLEdBQWtCaEIsS0FBbEI7O0FBRUEsU0FBSzJCLG1CQUFMOztBQUNBLFNBQUtwQixjQUFMO0FBQ0g7QUFWOEMsQ0FBbkQ7QUFhQTFDLEVBQUUsQ0FBQ2dCLE1BQUgsR0FBWWdMLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQmpMLE1BQTdCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBOb2RlRXZlbnQgPSByZXF1aXJlKCcuLi9DQ05vZGUnKS5FdmVudFR5cGU7XG5cbi8qKlxuICogISNlbiBFbnVtIGZvciBMYXlvdXQgdHlwZVxuICogISN6aCDluIPlsYDnsbvlnotcbiAqIEBlbnVtIExheW91dC5UeXBlXG4gKi9cbnZhciBUeXBlID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogISNlbiBOb25lIExheW91dFxuICAgICAqICEjemgg5Y+W5raI5biD5bGAXG4gICAgICpAcHJvcGVydHkge051bWJlcn0gTk9ORVxuICAgICAqL1xuICAgIE5PTkU6IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBIb3Jpem9udGFsIExheW91dFxuICAgICAqICEjemgg5rC05bmz5biD5bGAXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEhPUklaT05UQUxcbiAgICAgKi9cbiAgICBIT1JJWk9OVEFMOiAxLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBWZXJ0aWNhbCBMYXlvdXRcbiAgICAgKiAhI3poIOWeguebtOW4g+WxgFxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBWRVJUSUNBTFxuICAgICAqL1xuICAgIFZFUlRJQ0FMOiAyLFxuICAgIC8qKlxuICAgICAqICEjZW4gR3JpZCBMYXlvdXRcbiAgICAgKiAhI3poIOe9keagvOW4g+WxgFxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBHUklEXG4gICAgICovXG4gICAgR1JJRDogMyxcbn0pO1xuXG4vKipcbiAqICEjZW4gRW51bSBmb3IgTGF5b3V0IFJlc2l6ZSBNb2RlXG4gKiAhI3poIOe8qeaUvuaooeW8j1xuICogQGVudW0gTGF5b3V0LlJlc2l6ZU1vZGVcbiAqL1xudmFyIFJlc2l6ZU1vZGUgPSBjYy5FbnVtKHtcbiAgICAvKipcbiAgICAgKiAhI2VuIERvbid0IGRvIGFueSBzY2FsZS5cbiAgICAgKiAhI3poIOS4jeWBmuS7u+S9lee8qeaUvlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBOT05FXG4gICAgICovXG4gICAgTk9ORTogMCxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBjb250YWluZXIgc2l6ZSB3aWxsIGJlIGV4cGFuZGVkIHdpdGggaXRzIGNoaWxkcmVuJ3Mgc2l6ZS5cbiAgICAgKiAhI3poIOWuueWZqOeahOWkp+Wwj+S8muagueaNruWtkOiKgueCueeahOWkp+Wwj+iHquWKqOe8qeaUvuOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBDT05UQUlORVJcbiAgICAgKi9cbiAgICBDT05UQUlORVI6IDEsXG4gICAgLyoqXG4gICAgICogISNlbiBDaGlsZCBpdGVtIHNpemUgd2lsbCBiZSBhZGp1c3RlZCB3aXRoIHRoZSBjb250YWluZXIncyBzaXplLlxuICAgICAqICEjemgg5a2Q6IqC54K555qE5aSn5bCP5Lya6ZqP552A5a655Zmo55qE5aSn5bCP6Ieq5Yqo57yp5pS+44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IENISUxEUkVOXG4gICAgICovXG4gICAgQ0hJTERSRU46IDJcbn0pO1xuXG4vKipcbiAqICEjZW4gRW51bSBmb3IgR3JpZCBMYXlvdXQgc3RhcnQgYXhpcyBkaXJlY3Rpb24uXG4gKiBUaGUgaXRlbXMgaW4gZ3JpZCBsYXlvdXQgd2lsbCBiZSBhcnJhbmdlZCBpbiBlYWNoIGF4aXMgYXQgZmlyc3QuO1xuICogISN6aCDluIPlsYDovbTlkJHvvIzlj6rnlKjkuo4gR1JJRCDluIPlsYDjgIJcbiAqIEBlbnVtIExheW91dC5BeGlzRGlyZWN0aW9uXG4gKi9cbnZhciBBeGlzRGlyZWN0aW9uID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgaG9yaXpvbnRhbCBheGlzLlxuICAgICAqICEjemgg6L+b6KGM5rC05bmz5pa55ZCR5biD5bGAXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEhPUklaT05UQUxcbiAgICAgKi9cbiAgICBIT1JJWk9OVEFMOiAwLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHZlcnRpY2FsIGF4aXMuXG4gICAgICogISN6aCDov5vooYzlnoLnm7TmlrnlkJHluIPlsYBcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gVkVSVElDQUxcbiAgICAgKi9cbiAgICBWRVJUSUNBTDogMSxcbn0pO1xuXG4vKipcbiAqICEjZW4gRW51bSBmb3IgdmVydGljYWwgbGF5b3V0IGRpcmVjdGlvbi5cbiAqICBVc2VkIGluIEdyaWQgTGF5b3V0IHRvZ2V0aGVyIHdpdGggQXhpc0RpcmVjdGlvbiBpcyBWRVJUSUNBTFxuICogISN6aCDlnoLnm7TmlrnlkJHluIPlsYDmlrnlvI9cbiAqIEBlbnVtIExheW91dC5WZXJ0aWNhbERpcmVjdGlvblxuICovXG52YXIgVmVydGljYWxEaXJlY3Rpb24gPSBjYy5FbnVtKHtcbiAgICAvKipcbiAgICAgKiAhI2VuIEl0ZW1zIGFycmFuZ2VkIGZyb20gYm90dG9tIHRvIHRvcC5cbiAgICAgKiAhI3poIOS7juS4i+WIsOS4iuaOkuWIl1xuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBCT1RUT01fVE9fVE9QXG4gICAgICovXG4gICAgQk9UVE9NX1RPX1RPUDogMCxcbiAgICAvKipcbiAgICAgKiAhI2VuIEl0ZW1zIGFycmFuZ2VkIGZyb20gdG9wIHRvIGJvdHRvbS5cbiAgICAgKiAhI3poIOS7juS4iuWIsOS4i+aOkuWIl1xuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBUT1BfVE9fQk9UVE9NXG4gICAgICovXG4gICAgVE9QX1RPX0JPVFRPTTogMSxcbn0pO1xuXG4vKipcbiAqICEjZW4gRW51bSBmb3IgaG9yaXpvbnRhbCBsYXlvdXQgZGlyZWN0aW9uLlxuICogIFVzZWQgaW4gR3JpZCBMYXlvdXQgdG9nZXRoZXIgd2l0aCBBeGlzRGlyZWN0aW9uIGlzIEhPUklaT05UQUxcbiAqICEjemgg5rC05bmz5pa55ZCR5biD5bGA5pa55byPXG4gKiBAZW51bSBMYXlvdXQuSG9yaXpvbnRhbERpcmVjdGlvblxuICovXG52YXIgSG9yaXpvbnRhbERpcmVjdGlvbiA9IGNjLkVudW0oe1xuICAgIC8qKlxuICAgICAqICEjZW4gSXRlbXMgYXJyYW5nZWQgZnJvbSBsZWZ0IHRvIHJpZ2h0LlxuICAgICAqICEjemgg5LuO5bem5b6A5Y+z5o6S5YiXXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IExFRlRfVE9fUklHSFRcbiAgICAgKi9cbiAgICBMRUZUX1RPX1JJR0hUOiAwLFxuICAgIC8qKlxuICAgICAqICEjZW4gSXRlbXMgYXJyYW5nZWQgZnJvbSByaWdodCB0byBsZWZ0LlxuICAgICAqICEjemgg5LuO5Y+z5b6A5bem5o6S5YiXXG4gICAgICpAcHJvcGVydHkge051bWJlcn0gUklHSFRfVE9fTEVGVFxuICAgICAqL1xuICAgIFJJR0hUX1RPX0xFRlQ6IDEsXG59KTtcblxuLyoqXG4gKiAhI2VuXG4gKiBUaGUgTGF5b3V0IGlzIGEgY29udGFpbmVyIGNvbXBvbmVudCwgdXNlIGl0IHRvIGFycmFuZ2UgY2hpbGQgZWxlbWVudHMgZWFzaWx5Ljxicj5cbiAqIE5vdGXvvJo8YnI+XG4gKiAxLlNjYWxpbmcgYW5kIHJvdGF0aW9uIG9mIGNoaWxkIG5vZGVzIGFyZSBub3QgY29uc2lkZXJlZC48YnI+XG4gKiAyLkFmdGVyIHNldHRpbmcgdGhlIExheW91dCwgdGhlIHJlc3VsdHMgbmVlZCB0byBiZSB1cGRhdGVkIHVudGlsIHRoZSBuZXh0IGZyYW1lLFxuICogdW5sZXNzIHlvdSBtYW51YWxseSBjYWxsIHt7I2Nyb3NzTGluayBcIkxheW91dC91cGRhdGVMYXlvdXQ6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua31944CCXG4gKiAhI3poXG4gKiBMYXlvdXQg57uE5Lu255u45b2T5LqO5LiA5Liq5a655Zmo77yM6IO96Ieq5Yqo5a+55a6D55qE5omA5pyJ5a2Q6IqC54K56L+b6KGM57uf5LiA5o6S54mI44CCPGJyPlxuICog5rOo5oSP77yaPGJyPlxuICogMS7kuI3kvJrogIPomZHlrZDoioLngrnnmoTnvKnmlL7lkozml4vovazjgII8YnI+XG4gKiAyLuWvuSBMYXlvdXQg6K6+572u5ZCO57uT5p6c6ZyA6KaB5Yiw5LiL5LiA5bin5omN5Lya5pu05paw77yM6Zmk6Z2e5L2g6K6+572u5a6M5Lul5ZCO5omL5Yqo6LCD55SoIHt7I2Nyb3NzTGluayBcIkxheW91dC91cGRhdGVMYXlvdXQ6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua31944CCXG4gKiBAY2xhc3MgTGF5b3V0XG4gKiBAZXh0ZW5kcyBDb21wb25lbnRcbiAqL1xudmFyIExheW91dCA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuTGF5b3V0JyxcbiAgICBleHRlbmRzOiByZXF1aXJlKCcuL0NDQ29tcG9uZW50JyksXG5cbiAgICBlZGl0b3I6IENDX0VESVRPUiAmJiB7XG4gICAgICAgIG1lbnU6ICdpMThuOk1BSU5fTUVOVS5jb21wb25lbnQudWkvTGF5b3V0JyxcbiAgICAgICAgaGVscDogJ2kxOG46Q09NUE9ORU5ULmhlbHBfdXJsLmxheW91dCcsXG4gICAgICAgIGluc3BlY3RvcjogJ3BhY2thZ2VzOi8vaW5zcGVjdG9yL2luc3BlY3RvcnMvY29tcHMvY2NsYXlvdXQuanMnLFxuICAgICAgICBleGVjdXRlSW5FZGl0TW9kZTogdHJ1ZSxcbiAgICB9LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBfbGF5b3V0U2l6ZTogY2Muc2l6ZSgzMDAsIDIwMCksXG4gICAgICAgIF9sYXlvdXREaXJ0eToge1xuICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICAgIHNlcmlhbGl6YWJsZTogZmFsc2UsXG4gICAgICAgIH0sXG5cbiAgICAgICAgX3Jlc2l6ZTogUmVzaXplTW9kZS5OT05FLFxuXG4gICAgICAgIC8vVE9ETzogcmVmYWN0b3JpbmcgdGhpcyBuYW1lIGFmdGVyIGRhdGEgdXBncmFkZSBtYWNoYW5pc20gaXMgb3V0LlxuICAgICAgICBfTiRsYXlvdXRUeXBlOiBUeXBlLk5PTkUsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBsYXlvdXQgdHlwZS5cbiAgICAgICAgICogISN6aCDluIPlsYDnsbvlnotcbiAgICAgICAgICogQHByb3BlcnR5IHtMYXlvdXQuVHlwZX0gdHlwZVxuICAgICAgICAgKiBAZGVmYXVsdCBMYXlvdXQuVHlwZS5OT05FXG4gICAgICAgICAqL1xuICAgICAgICB0eXBlOiB7XG4gICAgICAgICAgICB0eXBlOiBUeXBlLFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX04kbGF5b3V0VHlwZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX04kbGF5b3V0VHlwZSA9IHZhbHVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUiAmJiB0aGlzLnR5cGUgIT09IFR5cGUuTk9ORSAmJiB0aGlzLl9yZXNpemUgPT09IFJlc2l6ZU1vZGUuQ09OVEFJTkVSICYmICFjYy5lbmdpbmUuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZUxheW91dGVkID0gX1NjZW5lLkRldGVjdENvbmZsaWN0LmNoZWNrQ29uZmxpY3RfTGF5b3V0KHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVMYXlvdXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2RvTGF5b3V0RGlydHkoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmxheW91dC5sYXlvdXRfdHlwZScsXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBhcmUgdGhyZWUgcmVzaXplIG1vZGVzIGZvciBMYXlvdXQuXG4gICAgICAgICAqIE5vbmUsIHJlc2l6ZSBDb250YWluZXIgYW5kIHJlc2l6ZSBjaGlsZHJlbi5cbiAgICAgICAgICogISN6aCDnvKnmlL7mqKHlvI9cbiAgICAgICAgICogQHByb3BlcnR5IHtMYXlvdXQuUmVzaXplTW9kZX0gcmVzaXplTW9kZVxuICAgICAgICAgKiBAZGVmYXVsdCBSZXNpemVNb2RlLk5PTkVcbiAgICAgICAgICovXG4gICAgICAgIHJlc2l6ZU1vZGU6IHtcbiAgICAgICAgICAgIHR5cGU6IFJlc2l6ZU1vZGUsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmxheW91dC5yZXNpemVfbW9kZScsXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZXNpemU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSBUeXBlLk5PTkUgJiYgdmFsdWUgPT09IFJlc2l6ZU1vZGUuQ0hJTERSRU4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IgJiYgdmFsdWUgPT09IFJlc2l6ZU1vZGUuQ09OVEFJTkVSICYmICFjYy5lbmdpbmUuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZUxheW91dGVkID0gX1NjZW5lLkRldGVjdENvbmZsaWN0LmNoZWNrQ29uZmxpY3RfTGF5b3V0KHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVMYXlvdXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2RvTGF5b3V0RGlydHkoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIGNlbGwgc2l6ZSBmb3IgZ3JpZCBsYXlvdXQuXG4gICAgICAgICAqICEjemgg5q+P5Liq5qC85a2Q55qE5aSn5bCP77yM5Y+q5pyJ5biD5bGA57G75Z6L5Li6IEdSSUQg55qE5pe25YCZ5omN5pyJ5pWI44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U2l6ZX0gY2VsbFNpemVcbiAgICAgICAgICogQGRlZmF1bHQgY2Muc2l6ZSg0MCwgNDApXG4gICAgICAgICAqL1xuICAgICAgICBjZWxsU2l6ZToge1xuICAgICAgICAgICAgZGVmYXVsdDogY2Muc2l6ZSg0MCwgNDApLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5sYXlvdXQuY2VsbF9zaXplJyxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNpemUsXG4gICAgICAgICAgICBub3RpZnk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kb0xheW91dERpcnR5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBzdGFydCBheGlzIGZvciBncmlkIGxheW91dC4gSWYgeW91IGNob29zZSBob3Jpem9udGFsLCB0aGVuIGNoaWxkcmVuIHdpbGwgbGF5b3V0IGhvcml6b250YWxseSBhdCBmaXJzdCxcbiAgICAgICAgICogYW5kIHRoZW4gYnJlYWsgbGluZSBvbiBkZW1hbmQuIENob29zZSB2ZXJ0aWNhbCBpZiB5b3Ugd2FudCB0byBsYXlvdXQgdmVydGljYWxseSBhdCBmaXJzdCAuXG4gICAgICAgICAqICEjemgg6LW35aeL6L205pa55ZCR57G75Z6L77yM5Y+v6L+b6KGM5rC05bmz5ZKM5Z6C55u05biD5bGA5o6S5YiX77yM5Y+q5pyJ5biD5bGA57G75Z6L5Li6IEdSSUQg55qE5pe25YCZ5omN5pyJ5pWI44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TGF5b3V0LkF4aXNEaXJlY3Rpb259IHN0YXJ0QXhpc1xuICAgICAgICAgKi9cbiAgICAgICAgc3RhcnRBeGlzOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBBeGlzRGlyZWN0aW9uLkhPUklaT05UQUwsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmxheW91dC5zdGFydF9heGlzJyxcbiAgICAgICAgICAgIHR5cGU6IEF4aXNEaXJlY3Rpb24sXG4gICAgICAgICAgICBub3RpZnk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoQ0NfRURJVE9SICYmIHRoaXMuX3Jlc2l6ZSA9PT0gUmVzaXplTW9kZS5DT05UQUlORVIgJiYgIWNjLmVuZ2luZS5pc1BsYXlpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlTGF5b3V0ZWQgPSBfU2NlbmUuRGV0ZWN0Q29uZmxpY3QuY2hlY2tDb25mbGljdF9MYXlvdXQodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZUxheW91dGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fZG9MYXlvdXREaXJ0eSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgX04kcGFkZGluZzoge1xuICAgICAgICAgICAgZGVmYXVsdDogMFxuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgbGVmdCBwYWRkaW5nIG9mIGxheW91dCwgaXQgb25seSBlZmZlY3QgdGhlIGxheW91dCBpbiBvbmUgZGlyZWN0aW9uLlxuICAgICAgICAgKiAhI3poIOWuueWZqOWGheW3pui+uei3ne+8jOWPquS8muWcqOS4gOS4quW4g+WxgOaWueWQkeS4iueUn+aViOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gcGFkZGluZ0xlZnRcbiAgICAgICAgICovXG4gICAgICAgIHBhZGRpbmdMZWZ0OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5sYXlvdXQucGFkZGluZ19sZWZ0JyxcbiAgICAgICAgICAgIG5vdGlmeTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RvTGF5b3V0RGlydHkoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIHJpZ2h0IHBhZGRpbmcgb2YgbGF5b3V0LCBpdCBvbmx5IGVmZmVjdCB0aGUgbGF5b3V0IGluIG9uZSBkaXJlY3Rpb24uXG4gICAgICAgICAqICEjemgg5a655Zmo5YaF5Y+z6L656Led77yM5Y+q5Lya5Zyo5LiA5Liq5biD5bGA5pa55ZCR5LiK55Sf5pWI44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBwYWRkaW5nUmlnaHRcbiAgICAgICAgICovXG4gICAgICAgIHBhZGRpbmdSaWdodDoge1xuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubGF5b3V0LnBhZGRpbmdfcmlnaHQnLFxuICAgICAgICAgICAgbm90aWZ5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZG9MYXlvdXREaXJ0eSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgdG9wIHBhZGRpbmcgb2YgbGF5b3V0LCBpdCBvbmx5IGVmZmVjdCB0aGUgbGF5b3V0IGluIG9uZSBkaXJlY3Rpb24uXG4gICAgICAgICAqICEjemgg5a655Zmo5YaF5LiK6L656Led77yM5Y+q5Lya5Zyo5LiA5Liq5biD5bGA5pa55ZCR5LiK55Sf5pWI44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBwYWRkaW5nVG9wXG4gICAgICAgICAqL1xuICAgICAgICBwYWRkaW5nVG9wOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5sYXlvdXQucGFkZGluZ190b3AnLFxuICAgICAgICAgICAgbm90aWZ5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZG9MYXlvdXREaXJ0eSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgYm90dG9tIHBhZGRpbmcgb2YgbGF5b3V0LCBpdCBvbmx5IGVmZmVjdCB0aGUgbGF5b3V0IGluIG9uZSBkaXJlY3Rpb24uXG4gICAgICAgICAqICEjemgg5a655Zmo5YaF5LiL6L656Led77yM5Y+q5Lya5Zyo5LiA5Liq5biD5bGA5pa55ZCR5LiK55Sf5pWI44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBwYWRkaW5nQm90dG9tXG4gICAgICAgICAqL1xuICAgICAgICBwYWRkaW5nQm90dG9tOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5sYXlvdXQucGFkZGluZ19ib3R0b20nLFxuICAgICAgICAgICAgbm90aWZ5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZG9MYXlvdXREaXJ0eSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgZGlzdGFuY2UgaW4geC1heGlzIGJldHdlZW4gZWFjaCBlbGVtZW50IGluIGxheW91dC5cbiAgICAgICAgICogISN6aCDlrZDoioLngrnkuYvpl7TnmoTmsLTlubPpl7Tot53jgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHNwYWNpbmdYXG4gICAgICAgICAqL1xuICAgICAgICBzcGFjaW5nWDoge1xuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgICAgIG5vdGlmeTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RvTGF5b3V0RGlydHkoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmxheW91dC5zcGFjZV94J1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBkaXN0YW5jZSBpbiB5LWF4aXMgYmV0d2VlbiBlYWNoIGVsZW1lbnQgaW4gbGF5b3V0LlxuICAgICAgICAgKiAhI3poIOWtkOiKgueCueS5i+mXtOeahOWeguebtOmXtOi3neOAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gc3BhY2luZ1lcbiAgICAgICAgICovXG4gICAgICAgIHNwYWNpbmdZOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICAgICAgbm90aWZ5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZG9MYXlvdXREaXJ0eSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubGF5b3V0LnNwYWNlX3knXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogT25seSB0YWtlIGVmZmVjdCBpbiBWZXJ0aWNhbCBsYXlvdXQgbW9kZS5cbiAgICAgICAgICogVGhpcyBvcHRpb24gY2hhbmdlcyB0aGUgc3RhcnQgZWxlbWVudCdzIHBvc2l0aW9uaW5nLlxuICAgICAgICAgKiAhI3poIOWeguebtOaOkuWIl+WtkOiKgueCueeahOaWueWQkeOAglxuICAgICAgICAgKiBAcHJvcGVydHkge0xheW91dC5WZXJ0aWNhbERpcmVjdGlvbn0gdmVydGljYWxEaXJlY3Rpb25cbiAgICAgICAgICovXG4gICAgICAgIHZlcnRpY2FsRGlyZWN0aW9uOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBWZXJ0aWNhbERpcmVjdGlvbi5UT1BfVE9fQk9UVE9NLFxuICAgICAgICAgICAgdHlwZTogVmVydGljYWxEaXJlY3Rpb24sXG4gICAgICAgICAgICBub3RpZnk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kb0xheW91dERpcnR5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5sYXlvdXQudmVydGljYWxfZGlyZWN0aW9uJyxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogT25seSB0YWtlIGVmZmVjdCBpbiBIb3Jpem9udGFsIGxheW91dCBtb2RlLlxuICAgICAgICAgKiBUaGlzIG9wdGlvbiBjaGFuZ2VzIHRoZSBzdGFydCBlbGVtZW50J3MgcG9zaXRpb25pbmcuXG4gICAgICAgICAqICEjemgg5rC05bmz5o6S5YiX5a2Q6IqC54K555qE5pa55ZCR44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TGF5b3V0Lkhvcml6b250YWxEaXJlY3Rpb259IGhvcml6b250YWxEaXJlY3Rpb25cbiAgICAgICAgICovXG4gICAgICAgIGhvcml6b250YWxEaXJlY3Rpb246IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IEhvcml6b250YWxEaXJlY3Rpb24uTEVGVF9UT19SSUdIVCxcbiAgICAgICAgICAgIHR5cGU6IEhvcml6b250YWxEaXJlY3Rpb24sXG4gICAgICAgICAgICBub3RpZnk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kb0xheW91dERpcnR5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5sYXlvdXQuaG9yaXpvbnRhbF9kaXJlY3Rpb24nLFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBBZGp1c3QgdGhlIGxheW91dCBpZiB0aGUgY2hpbGRyZW4gc2NhbGVkLlxuICAgICAgICAgKiAhI3poIOWtkOiKgueCuee8qeaUvuavlOS+i+aYr+WQpuW9seWTjeW4g+WxgOOAglxuICAgICAgICAgKiBAcHJvcGVydHkgYWZmZWN0ZWRCeVNjYWxlXG4gICAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgYWZmZWN0ZWRCeVNjYWxlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgIG5vdGlmeTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIGV2ZXJ5IHRpbWUgeW91IHN3aXRjaCB0aGlzIHN0YXRlLCB0aGUgbGF5b3V0IHdpbGwgYmUgY2FsY3VsYXRlZC5cbiAgICAgICAgICAgICAgICB0aGlzLl9kb0xheW91dERpcnR5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmxheW91dC5hZmZlY3RlZF9ieV9zY2FsZSdcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIFR5cGU6IFR5cGUsXG4gICAgICAgIFZlcnRpY2FsRGlyZWN0aW9uOiBWZXJ0aWNhbERpcmVjdGlvbixcbiAgICAgICAgSG9yaXpvbnRhbERpcmVjdGlvbjogSG9yaXpvbnRhbERpcmVjdGlvbixcbiAgICAgICAgUmVzaXplTW9kZTogUmVzaXplTW9kZSxcbiAgICAgICAgQXhpc0RpcmVjdGlvbjogQXhpc0RpcmVjdGlvbixcbiAgICB9LFxuXG4gICAgX21pZ3JhdGVQYWRkaW5nRGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnBhZGRpbmdMZWZ0ID0gdGhpcy5fTiRwYWRkaW5nO1xuICAgICAgICB0aGlzLnBhZGRpbmdSaWdodCA9IHRoaXMuX04kcGFkZGluZztcbiAgICAgICAgdGhpcy5wYWRkaW5nVG9wID0gdGhpcy5fTiRwYWRkaW5nO1xuICAgICAgICB0aGlzLnBhZGRpbmdCb3R0b20gPSB0aGlzLl9OJHBhZGRpbmc7XG4gICAgICAgIHRoaXMuX04kcGFkZGluZyA9IDA7XG4gICAgfSxcblxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2FkZEV2ZW50TGlzdGVuZXJzKCk7XG5cbiAgICAgICAgaWYgKHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmVxdWFscyhjYy5zaXplKDAsIDApKSkge1xuICAgICAgICAgICAgdGhpcy5ub2RlLnNldENvbnRlbnRTaXplKHRoaXMuX2xheW91dFNpemUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX04kcGFkZGluZyAhPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5fbWlncmF0ZVBhZGRpbmdEYXRhKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9kb0xheW91dERpcnR5KCk7XG4gICAgfSxcblxuICAgIG9uRGlzYWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9yZW1vdmVFdmVudExpc3RlbmVycygpO1xuICAgIH0sXG5cbiAgICBfZG9MYXlvdXREaXJ0eTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9sYXlvdXREaXJ0eSA9IHRydWU7XG4gICAgfSxcblxuICAgIF9kb1NjYWxlRGlydHk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fbGF5b3V0RGlydHkgPSB0aGlzLl9sYXlvdXREaXJ0eSB8fCB0aGlzLmFmZmVjdGVkQnlTY2FsZTtcbiAgICB9LFxuXG4gICAgX2FkZEV2ZW50TGlzdGVuZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKGNjLkRpcmVjdG9yLkVWRU5UX0FGVEVSX1VQREFURSwgdGhpcy51cGRhdGVMYXlvdXQsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub24oTm9kZUV2ZW50LlNJWkVfQ0hBTkdFRCwgdGhpcy5fcmVzaXplZCwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vbihOb2RlRXZlbnQuQU5DSE9SX0NIQU5HRUQsIHRoaXMuX2RvTGF5b3V0RGlydHksIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub24oTm9kZUV2ZW50LkNISUxEX0FEREVELCB0aGlzLl9jaGlsZEFkZGVkLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKE5vZGVFdmVudC5DSElMRF9SRU1PVkVELCB0aGlzLl9jaGlsZFJlbW92ZWQsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub24oTm9kZUV2ZW50LkNISUxEX1JFT1JERVIsIHRoaXMuX2RvTGF5b3V0RGlydHksIHRoaXMpO1xuICAgICAgICB0aGlzLl9hZGRDaGlsZHJlbkV2ZW50TGlzdGVuZXJzKCk7XG4gICAgfSxcblxuICAgIF9yZW1vdmVFdmVudExpc3RlbmVyczogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5vZmYoY2MuRGlyZWN0b3IuRVZFTlRfQUZURVJfVVBEQVRFLCB0aGlzLnVwZGF0ZUxheW91dCwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoTm9kZUV2ZW50LlNJWkVfQ0hBTkdFRCwgdGhpcy5fcmVzaXplZCwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoTm9kZUV2ZW50LkFOQ0hPUl9DSEFOR0VELCB0aGlzLl9kb0xheW91dERpcnR5LCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihOb2RlRXZlbnQuQ0hJTERfQURERUQsIHRoaXMuX2NoaWxkQWRkZWQsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKE5vZGVFdmVudC5DSElMRF9SRU1PVkVELCB0aGlzLl9jaGlsZFJlbW92ZWQsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKE5vZGVFdmVudC5DSElMRF9SRU9SREVSLCB0aGlzLl9kb0xheW91dERpcnR5LCB0aGlzKTtcbiAgICAgICAgdGhpcy5fcmVtb3ZlQ2hpbGRyZW5FdmVudExpc3RlbmVycygpO1xuICAgIH0sXG5cbiAgICBfYWRkQ2hpbGRyZW5FdmVudExpc3RlbmVyczogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLm5vZGUuY2hpbGRyZW47XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgY2hpbGQub24oTm9kZUV2ZW50LlNDQUxFX0NIQU5HRUQsIHRoaXMuX2RvU2NhbGVEaXJ0eSwgdGhpcyk7XG4gICAgICAgICAgICBjaGlsZC5vbihOb2RlRXZlbnQuU0laRV9DSEFOR0VELCB0aGlzLl9kb0xheW91dERpcnR5LCB0aGlzKTtcbiAgICAgICAgICAgIGNoaWxkLm9uKE5vZGVFdmVudC5QT1NJVElPTl9DSEFOR0VELCB0aGlzLl9kb0xheW91dERpcnR5LCB0aGlzKTtcbiAgICAgICAgICAgIGNoaWxkLm9uKE5vZGVFdmVudC5BTkNIT1JfQ0hBTkdFRCwgdGhpcy5fZG9MYXlvdXREaXJ0eSwgdGhpcyk7XG4gICAgICAgICAgICBjaGlsZC5vbignYWN0aXZlLWluLWhpZXJhcmNoeS1jaGFuZ2VkJywgdGhpcy5fZG9MYXlvdXREaXJ0eSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3JlbW92ZUNoaWxkcmVuRXZlbnRMaXN0ZW5lcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5ub2RlLmNoaWxkcmVuO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGNoaWxkLm9mZihOb2RlRXZlbnQuU0NBTEVfQ0hBTkdFRCwgdGhpcy5fZG9TY2FsZURpcnR5LCB0aGlzKTtcbiAgICAgICAgICAgIGNoaWxkLm9mZihOb2RlRXZlbnQuU0laRV9DSEFOR0VELCB0aGlzLl9kb0xheW91dERpcnR5LCB0aGlzKTtcbiAgICAgICAgICAgIGNoaWxkLm9mZihOb2RlRXZlbnQuUE9TSVRJT05fQ0hBTkdFRCwgdGhpcy5fZG9MYXlvdXREaXJ0eSwgdGhpcyk7XG4gICAgICAgICAgICBjaGlsZC5vZmYoTm9kZUV2ZW50LkFOQ0hPUl9DSEFOR0VELCB0aGlzLl9kb0xheW91dERpcnR5LCB0aGlzKTtcbiAgICAgICAgICAgIGNoaWxkLm9mZignYWN0aXZlLWluLWhpZXJhcmNoeS1jaGFuZ2VkJywgdGhpcy5fZG9MYXlvdXREaXJ0eSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2NoaWxkQWRkZWQ6IGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICBjaGlsZC5vbihOb2RlRXZlbnQuU0NBTEVfQ0hBTkdFRCwgdGhpcy5fZG9TY2FsZURpcnR5LCB0aGlzKTtcbiAgICAgICAgY2hpbGQub24oTm9kZUV2ZW50LlNJWkVfQ0hBTkdFRCwgdGhpcy5fZG9MYXlvdXREaXJ0eSwgdGhpcyk7XG4gICAgICAgIGNoaWxkLm9uKE5vZGVFdmVudC5QT1NJVElPTl9DSEFOR0VELCB0aGlzLl9kb0xheW91dERpcnR5LCB0aGlzKTtcbiAgICAgICAgY2hpbGQub24oTm9kZUV2ZW50LkFOQ0hPUl9DSEFOR0VELCB0aGlzLl9kb0xheW91dERpcnR5LCB0aGlzKTtcbiAgICAgICAgY2hpbGQub24oJ2FjdGl2ZS1pbi1oaWVyYXJjaHktY2hhbmdlZCcsIHRoaXMuX2RvTGF5b3V0RGlydHksIHRoaXMpO1xuXG4gICAgICAgIHRoaXMuX2RvTGF5b3V0RGlydHkoKTtcbiAgICB9LFxuXG4gICAgX2NoaWxkUmVtb3ZlZDogZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgIGNoaWxkLm9mZihOb2RlRXZlbnQuU0NBTEVfQ0hBTkdFRCwgdGhpcy5fZG9TY2FsZURpcnR5LCB0aGlzKTtcbiAgICAgICAgY2hpbGQub2ZmKE5vZGVFdmVudC5TSVpFX0NIQU5HRUQsIHRoaXMuX2RvTGF5b3V0RGlydHksIHRoaXMpO1xuICAgICAgICBjaGlsZC5vZmYoTm9kZUV2ZW50LlBPU0lUSU9OX0NIQU5HRUQsIHRoaXMuX2RvTGF5b3V0RGlydHksIHRoaXMpO1xuICAgICAgICBjaGlsZC5vZmYoTm9kZUV2ZW50LkFOQ0hPUl9DSEFOR0VELCB0aGlzLl9kb0xheW91dERpcnR5LCB0aGlzKTtcbiAgICAgICAgY2hpbGQub2ZmKCdhY3RpdmUtaW4taGllcmFyY2h5LWNoYW5nZWQnLCB0aGlzLl9kb0xheW91dERpcnR5LCB0aGlzKTtcblxuICAgICAgICB0aGlzLl9kb0xheW91dERpcnR5KCk7XG4gICAgfSxcblxuICAgIF9yZXNpemVkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2xheW91dFNpemUgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKTtcbiAgICAgICAgdGhpcy5fZG9MYXlvdXREaXJ0eSgpO1xuICAgIH0sXG5cbiAgICBfZG9MYXlvdXRIb3Jpem9udGFsbHk6IGZ1bmN0aW9uIChiYXNlV2lkdGgsIHJvd0JyZWFrLCBmblBvc2l0aW9uWSwgYXBwbHlDaGlsZHJlbikge1xuICAgICAgICB2YXIgbGF5b3V0QW5jaG9yID0gdGhpcy5ub2RlLmdldEFuY2hvclBvaW50KCk7XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMubm9kZS5jaGlsZHJlbjtcblxuICAgICAgICB2YXIgc2lnbiA9IDE7XG4gICAgICAgIHZhciBwYWRkaW5nWCA9IHRoaXMucGFkZGluZ0xlZnQ7XG4gICAgICAgIHZhciBsZWZ0Qm91bmRhcnlPZkxheW91dCA9IC1sYXlvdXRBbmNob3IueCAqIGJhc2VXaWR0aDtcbiAgICAgICAgaWYgKHRoaXMuaG9yaXpvbnRhbERpcmVjdGlvbiA9PT0gSG9yaXpvbnRhbERpcmVjdGlvbi5SSUdIVF9UT19MRUZUKSB7XG4gICAgICAgICAgICBzaWduID0gLTE7XG4gICAgICAgICAgICBsZWZ0Qm91bmRhcnlPZkxheW91dCA9ICgxIC0gbGF5b3V0QW5jaG9yLngpICogYmFzZVdpZHRoO1xuICAgICAgICAgICAgcGFkZGluZ1ggPSB0aGlzLnBhZGRpbmdSaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBuZXh0WCA9IGxlZnRCb3VuZGFyeU9mTGF5b3V0ICsgc2lnbiAqIHBhZGRpbmdYIC0gc2lnbiAqIHRoaXMuc3BhY2luZ1g7XG4gICAgICAgIHZhciByb3dNYXhIZWlnaHQgPSAwO1xuICAgICAgICB2YXIgdGVtcE1heEhlaWdodCA9IDA7XG4gICAgICAgIHZhciBzZWNvbmRNYXhIZWlnaHQgPSAwO1xuICAgICAgICB2YXIgcm93ID0gMDtcbiAgICAgICAgdmFyIGNvbnRhaW5lclJlc2l6ZUJvdW5kYXJ5ID0gMDtcblxuICAgICAgICB2YXIgbWF4SGVpZ2h0Q2hpbGRBbmNob3JZID0gMDtcblxuICAgICAgICB2YXIgYWN0aXZlQ2hpbGRDb3VudCA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgaWYgKGNoaWxkLmFjdGl2ZUluSGllcmFyY2h5KSB7XG4gICAgICAgICAgICAgICAgYWN0aXZlQ2hpbGRDb3VudCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG5ld0NoaWxkV2lkdGggPSB0aGlzLmNlbGxTaXplLndpZHRoO1xuICAgICAgICBpZiAodGhpcy50eXBlICE9PSBUeXBlLkdSSUQgJiYgdGhpcy5yZXNpemVNb2RlID09PSBSZXNpemVNb2RlLkNISUxEUkVOKSB7XG4gICAgICAgICAgICBuZXdDaGlsZFdpZHRoID0gKGJhc2VXaWR0aCAtICh0aGlzLnBhZGRpbmdMZWZ0ICsgdGhpcy5wYWRkaW5nUmlnaHQpIC0gKGFjdGl2ZUNoaWxkQ291bnQgLSAxKSAqIHRoaXMuc3BhY2luZ1gpIC8gYWN0aXZlQ2hpbGRDb3VudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgbGV0IGNoaWxkU2NhbGVYID0gdGhpcy5fZ2V0VXNlZFNjYWxlVmFsdWUoY2hpbGQuc2NhbGVYKTtcbiAgICAgICAgICAgIGxldCBjaGlsZFNjYWxlWSA9IHRoaXMuX2dldFVzZWRTY2FsZVZhbHVlKGNoaWxkLnNjYWxlWSk7XG4gICAgICAgICAgICBpZiAoIWNoaWxkLmFjdGl2ZUluSGllcmFyY2h5KSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL2ZvciByZXNpemluZyBjaGlsZHJlblxuICAgICAgICAgICAgaWYgKHRoaXMuX3Jlc2l6ZSA9PT0gUmVzaXplTW9kZS5DSElMRFJFTikge1xuICAgICAgICAgICAgICAgIGNoaWxkLndpZHRoID0gbmV3Q2hpbGRXaWR0aCAvIGNoaWxkU2NhbGVYO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09IFR5cGUuR1JJRCkge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZC5oZWlnaHQgPSB0aGlzLmNlbGxTaXplLmhlaWdodCAvIGNoaWxkU2NhbGVZO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGFuY2hvclggPSBjaGlsZC5hbmNob3JYO1xuICAgICAgICAgICAgdmFyIGNoaWxkQm91bmRpbmdCb3hXaWR0aCA9IGNoaWxkLndpZHRoICogY2hpbGRTY2FsZVg7XG4gICAgICAgICAgICB2YXIgY2hpbGRCb3VuZGluZ0JveEhlaWdodCA9IGNoaWxkLmhlaWdodCAqIGNoaWxkU2NhbGVZO1xuXG4gICAgICAgICAgICBpZiAoc2Vjb25kTWF4SGVpZ2h0ID4gdGVtcE1heEhlaWdodCkge1xuICAgICAgICAgICAgICAgIHRlbXBNYXhIZWlnaHQgPSBzZWNvbmRNYXhIZWlnaHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjaGlsZEJvdW5kaW5nQm94SGVpZ2h0ID49IHRlbXBNYXhIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBzZWNvbmRNYXhIZWlnaHQgPSB0ZW1wTWF4SGVpZ2h0O1xuICAgICAgICAgICAgICAgIHRlbXBNYXhIZWlnaHQgPSBjaGlsZEJvdW5kaW5nQm94SGVpZ2h0O1xuICAgICAgICAgICAgICAgIG1heEhlaWdodENoaWxkQW5jaG9yWSA9IGNoaWxkLmdldEFuY2hvclBvaW50KCkueTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuaG9yaXpvbnRhbERpcmVjdGlvbiA9PT0gSG9yaXpvbnRhbERpcmVjdGlvbi5SSUdIVF9UT19MRUZUKSB7XG4gICAgICAgICAgICAgICAgYW5jaG9yWCA9IDEgLSBjaGlsZC5hbmNob3JYO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV4dFggPSBuZXh0WCArIHNpZ24gKiBhbmNob3JYICogY2hpbGRCb3VuZGluZ0JveFdpZHRoICsgc2lnbiAqIHRoaXMuc3BhY2luZ1g7XG4gICAgICAgICAgICB2YXIgcmlnaHRCb3VuZGFyeU9mQ2hpbGQgPSBzaWduICogKDEgLSBhbmNob3JYKSAqIGNoaWxkQm91bmRpbmdCb3hXaWR0aDtcblxuICAgICAgICAgICAgaWYgKHJvd0JyZWFrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJvd0JyZWFrQm91bmRhcnkgPSBuZXh0WCArIHJpZ2h0Qm91bmRhcnlPZkNoaWxkICsgc2lnbiAqIChzaWduID4gMCA/IHRoaXMucGFkZGluZ1JpZ2h0IDogdGhpcy5wYWRkaW5nTGVmdCk7XG4gICAgICAgICAgICAgICAgdmFyIGxlZnRUb1JpZ2h0Um93QnJlYWsgPSB0aGlzLmhvcml6b250YWxEaXJlY3Rpb24gPT09IEhvcml6b250YWxEaXJlY3Rpb24uTEVGVF9UT19SSUdIVCAmJiByb3dCcmVha0JvdW5kYXJ5ID4gKDEgLSBsYXlvdXRBbmNob3IueCkgKiBiYXNlV2lkdGg7XG4gICAgICAgICAgICAgICAgdmFyIHJpZ2h0VG9MZWZ0Um93QnJlYWsgPSB0aGlzLmhvcml6b250YWxEaXJlY3Rpb24gPT09IEhvcml6b250YWxEaXJlY3Rpb24uUklHSFRfVE9fTEVGVCAmJiByb3dCcmVha0JvdW5kYXJ5IDwgLWxheW91dEFuY2hvci54ICogYmFzZVdpZHRoO1xuXG4gICAgICAgICAgICAgICAgaWYgKGxlZnRUb1JpZ2h0Um93QnJlYWsgfHwgcmlnaHRUb0xlZnRSb3dCcmVhaykge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZEJvdW5kaW5nQm94SGVpZ2h0ID49IHRlbXBNYXhIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWNvbmRNYXhIZWlnaHQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWNvbmRNYXhIZWlnaHQgPSB0ZW1wTWF4SGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcm93TWF4SGVpZ2h0ICs9IHNlY29uZE1heEhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlY29uZE1heEhlaWdodCA9IHRlbXBNYXhIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dNYXhIZWlnaHQgKz0gdGVtcE1heEhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlY29uZE1heEhlaWdodCA9IGNoaWxkQm91bmRpbmdCb3hIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTWF4SGVpZ2h0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBuZXh0WCA9IGxlZnRCb3VuZGFyeU9mTGF5b3V0ICsgc2lnbiAqIChwYWRkaW5nWCArIGFuY2hvclggKiBjaGlsZEJvdW5kaW5nQm94V2lkdGgpO1xuICAgICAgICAgICAgICAgICAgICByb3crKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBmaW5hbFBvc2l0aW9uWSA9IGZuUG9zaXRpb25ZKGNoaWxkLCByb3dNYXhIZWlnaHQsIHJvdyk7XG4gICAgICAgICAgICBpZiAoYmFzZVdpZHRoID49IChjaGlsZEJvdW5kaW5nQm94V2lkdGggKyB0aGlzLnBhZGRpbmdMZWZ0ICsgdGhpcy5wYWRkaW5nUmlnaHQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFwcGx5Q2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQuc2V0UG9zaXRpb24oY2MudjIobmV4dFgsIGZpbmFsUG9zaXRpb25ZKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgc2lnblggPSAxO1xuICAgICAgICAgICAgdmFyIHRlbXBGaW5hbFBvc2l0aW9uWTtcbiAgICAgICAgICAgIHZhciB0b3BNYXJpZ24gPSAodGVtcE1heEhlaWdodCA9PT0gMCkgPyBjaGlsZEJvdW5kaW5nQm94SGVpZ2h0IDogdGVtcE1heEhlaWdodDtcblxuICAgICAgICAgICAgaWYgKHRoaXMudmVydGljYWxEaXJlY3Rpb24gPT09IFZlcnRpY2FsRGlyZWN0aW9uLlRPUF9UT19CT1RUT00pIHtcbiAgICAgICAgICAgICAgICBjb250YWluZXJSZXNpemVCb3VuZGFyeSA9IGNvbnRhaW5lclJlc2l6ZUJvdW5kYXJ5IHx8IHRoaXMubm9kZS5fY29udGVudFNpemUuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIHNpZ25YID0gLTE7XG4gICAgICAgICAgICAgICAgdGVtcEZpbmFsUG9zaXRpb25ZID0gZmluYWxQb3NpdGlvblkgKyBzaWduWCAqICh0b3BNYXJpZ24gKiBtYXhIZWlnaHRDaGlsZEFuY2hvclkgKyB0aGlzLnBhZGRpbmdCb3R0b20pO1xuICAgICAgICAgICAgICAgIGlmICh0ZW1wRmluYWxQb3NpdGlvblkgPCBjb250YWluZXJSZXNpemVCb3VuZGFyeSkge1xuICAgICAgICAgICAgICAgICAgICBjb250YWluZXJSZXNpemVCb3VuZGFyeSA9IHRlbXBGaW5hbFBvc2l0aW9uWTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb250YWluZXJSZXNpemVCb3VuZGFyeSA9IGNvbnRhaW5lclJlc2l6ZUJvdW5kYXJ5IHx8IC10aGlzLm5vZGUuX2NvbnRlbnRTaXplLmhlaWdodDtcbiAgICAgICAgICAgICAgICB0ZW1wRmluYWxQb3NpdGlvblkgPSBmaW5hbFBvc2l0aW9uWSArIHNpZ25YICogKHRvcE1hcmlnbiAqIG1heEhlaWdodENoaWxkQW5jaG9yWSArIHRoaXMucGFkZGluZ1RvcCk7XG4gICAgICAgICAgICAgICAgaWYgKHRlbXBGaW5hbFBvc2l0aW9uWSA+IGNvbnRhaW5lclJlc2l6ZUJvdW5kYXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lclJlc2l6ZUJvdW5kYXJ5ID0gdGVtcEZpbmFsUG9zaXRpb25ZO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbmV4dFggKz0gcmlnaHRCb3VuZGFyeU9mQ2hpbGQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29udGFpbmVyUmVzaXplQm91bmRhcnk7XG4gICAgfSxcblxuICAgIF9nZXRWZXJ0aWNhbEJhc2VIZWlnaHQ6IGZ1bmN0aW9uIChjaGlsZHJlbikge1xuICAgICAgICB2YXIgbmV3SGVpZ2h0ID0gMDtcbiAgICAgICAgdmFyIGFjdGl2ZUNoaWxkQ291bnQgPSAwO1xuICAgICAgICBpZiAodGhpcy5yZXNpemVNb2RlID09PSBSZXNpemVNb2RlLkNPTlRBSU5FUikge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZC5hY3RpdmVJbkhpZXJhcmNoeSkge1xuICAgICAgICAgICAgICAgICAgICBhY3RpdmVDaGlsZENvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgIG5ld0hlaWdodCArPSBjaGlsZC5oZWlnaHQgKiB0aGlzLl9nZXRVc2VkU2NhbGVWYWx1ZShjaGlsZC5zY2FsZVkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbmV3SGVpZ2h0ICs9IChhY3RpdmVDaGlsZENvdW50IC0gMSkgKiB0aGlzLnNwYWNpbmdZICsgdGhpcy5wYWRkaW5nQm90dG9tICsgdGhpcy5wYWRkaW5nVG9wO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbmV3SGVpZ2h0ID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdIZWlnaHQ7XG4gICAgfSxcblxuICAgIF9kb0xheW91dFZlcnRpY2FsbHk6IGZ1bmN0aW9uIChiYXNlSGVpZ2h0LCBjb2x1bW5CcmVhaywgZm5Qb3NpdGlvblgsIGFwcGx5Q2hpbGRyZW4pIHtcbiAgICAgICAgdmFyIGxheW91dEFuY2hvciA9IHRoaXMubm9kZS5nZXRBbmNob3JQb2ludCgpO1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLm5vZGUuY2hpbGRyZW47XG5cbiAgICAgICAgdmFyIHNpZ24gPSAxO1xuICAgICAgICB2YXIgcGFkZGluZ1kgPSB0aGlzLnBhZGRpbmdCb3R0b207XG4gICAgICAgIHZhciBib3R0b21Cb3VuZGFyeU9mTGF5b3V0ID0gLWxheW91dEFuY2hvci55ICogYmFzZUhlaWdodDtcbiAgICAgICAgaWYgKHRoaXMudmVydGljYWxEaXJlY3Rpb24gPT09IFZlcnRpY2FsRGlyZWN0aW9uLlRPUF9UT19CT1RUT00pIHtcbiAgICAgICAgICAgIHNpZ24gPSAtMTtcbiAgICAgICAgICAgIGJvdHRvbUJvdW5kYXJ5T2ZMYXlvdXQgPSAoMSAtIGxheW91dEFuY2hvci55KSAqIGJhc2VIZWlnaHQ7XG4gICAgICAgICAgICBwYWRkaW5nWSA9IHRoaXMucGFkZGluZ1RvcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBuZXh0WSA9IGJvdHRvbUJvdW5kYXJ5T2ZMYXlvdXQgKyBzaWduICogcGFkZGluZ1kgLSBzaWduICogdGhpcy5zcGFjaW5nWTtcbiAgICAgICAgdmFyIGNvbHVtbk1heFdpZHRoID0gMDtcbiAgICAgICAgdmFyIHRlbXBNYXhXaWR0aCA9IDA7XG4gICAgICAgIHZhciBzZWNvbmRNYXhXaWR0aCA9IDA7XG4gICAgICAgIHZhciBjb2x1bW4gPSAwO1xuICAgICAgICB2YXIgY29udGFpbmVyUmVzaXplQm91bmRhcnkgPSAwO1xuICAgICAgICB2YXIgbWF4V2lkdGhDaGlsZEFuY2hvclggPSAwO1xuXG4gICAgICAgIHZhciBhY3RpdmVDaGlsZENvdW50ID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgICAgICAgICBpZiAoY2hpbGQuYWN0aXZlSW5IaWVyYXJjaHkpIHtcbiAgICAgICAgICAgICAgICBhY3RpdmVDaGlsZENvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbmV3Q2hpbGRIZWlnaHQgPSB0aGlzLmNlbGxTaXplLmhlaWdodDtcbiAgICAgICAgaWYgKHRoaXMudHlwZSAhPT0gVHlwZS5HUklEICYmIHRoaXMucmVzaXplTW9kZSA9PT0gUmVzaXplTW9kZS5DSElMRFJFTikge1xuICAgICAgICAgICAgbmV3Q2hpbGRIZWlnaHQgPSAoYmFzZUhlaWdodCAtICh0aGlzLnBhZGRpbmdUb3AgKyB0aGlzLnBhZGRpbmdCb3R0b20pIC0gKGFjdGl2ZUNoaWxkQ291bnQgLSAxKSAqIHRoaXMuc3BhY2luZ1kpIC8gYWN0aXZlQ2hpbGRDb3VudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgbGV0IGNoaWxkU2NhbGVYID0gdGhpcy5fZ2V0VXNlZFNjYWxlVmFsdWUoY2hpbGQuc2NhbGVYKTtcbiAgICAgICAgICAgIGxldCBjaGlsZFNjYWxlWSA9IHRoaXMuX2dldFVzZWRTY2FsZVZhbHVlKGNoaWxkLnNjYWxlWSk7XG4gICAgICAgICAgICBpZiAoIWNoaWxkLmFjdGl2ZUluSGllcmFyY2h5KSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vZm9yIHJlc2l6aW5nIGNoaWxkcmVuXG4gICAgICAgICAgICBpZiAodGhpcy5yZXNpemVNb2RlID09PSBSZXNpemVNb2RlLkNISUxEUkVOKSB7XG4gICAgICAgICAgICAgICAgY2hpbGQuaGVpZ2h0ID0gbmV3Q2hpbGRIZWlnaHQgLyBjaGlsZFNjYWxlWTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSBUeXBlLkdSSUQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQud2lkdGggPSB0aGlzLmNlbGxTaXplLndpZHRoIC8gY2hpbGRTY2FsZVg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYW5jaG9yWSA9IGNoaWxkLmFuY2hvclk7XG4gICAgICAgICAgICB2YXIgY2hpbGRCb3VuZGluZ0JveFdpZHRoID0gY2hpbGQud2lkdGggKiBjaGlsZFNjYWxlWDtcbiAgICAgICAgICAgIHZhciBjaGlsZEJvdW5kaW5nQm94SGVpZ2h0ID0gY2hpbGQuaGVpZ2h0ICogY2hpbGRTY2FsZVk7XG5cbiAgICAgICAgICAgIGlmIChzZWNvbmRNYXhXaWR0aCA+IHRlbXBNYXhXaWR0aCkge1xuICAgICAgICAgICAgICAgIHRlbXBNYXhXaWR0aCA9IHNlY29uZE1heFdpZHRoO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY2hpbGRCb3VuZGluZ0JveFdpZHRoID49IHRlbXBNYXhXaWR0aCkge1xuICAgICAgICAgICAgICAgIHNlY29uZE1heFdpZHRoID0gdGVtcE1heFdpZHRoO1xuICAgICAgICAgICAgICAgIHRlbXBNYXhXaWR0aCA9IGNoaWxkQm91bmRpbmdCb3hXaWR0aDtcbiAgICAgICAgICAgICAgICBtYXhXaWR0aENoaWxkQW5jaG9yWCA9IGNoaWxkLmdldEFuY2hvclBvaW50KCkueDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMudmVydGljYWxEaXJlY3Rpb24gPT09IFZlcnRpY2FsRGlyZWN0aW9uLlRPUF9UT19CT1RUT00pIHtcbiAgICAgICAgICAgICAgICBhbmNob3JZID0gMSAtIGNoaWxkLmFuY2hvclk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXh0WSA9IG5leHRZICsgc2lnbiAqIGFuY2hvclkgKiBjaGlsZEJvdW5kaW5nQm94SGVpZ2h0ICsgc2lnbiAqIHRoaXMuc3BhY2luZ1k7XG4gICAgICAgICAgICB2YXIgdG9wQm91bmRhcnlPZkNoaWxkID0gc2lnbiAqICgxIC0gYW5jaG9yWSkgKiBjaGlsZEJvdW5kaW5nQm94SGVpZ2h0O1xuXG4gICAgICAgICAgICBpZiAoY29sdW1uQnJlYWspIHtcbiAgICAgICAgICAgICAgICB2YXIgY29sdW1uQnJlYWtCb3VuZGFyeSA9IG5leHRZICsgdG9wQm91bmRhcnlPZkNoaWxkICsgc2lnbiAqIChzaWduID4gMCA/IHRoaXMucGFkZGluZ1RvcCA6IHRoaXMucGFkZGluZ0JvdHRvbSk7XG4gICAgICAgICAgICAgICAgdmFyIGJvdHRvbVRvVG9wQ29sdW1uQnJlYWsgPSB0aGlzLnZlcnRpY2FsRGlyZWN0aW9uID09PSBWZXJ0aWNhbERpcmVjdGlvbi5CT1RUT01fVE9fVE9QICYmIGNvbHVtbkJyZWFrQm91bmRhcnkgPiAoMSAtIGxheW91dEFuY2hvci55KSAqIGJhc2VIZWlnaHQ7XG4gICAgICAgICAgICAgICAgdmFyIHRvcFRvQm90dG9tQ29sdW1uQnJlYWsgPSB0aGlzLnZlcnRpY2FsRGlyZWN0aW9uID09PSBWZXJ0aWNhbERpcmVjdGlvbi5UT1BfVE9fQk9UVE9NICYmIGNvbHVtbkJyZWFrQm91bmRhcnkgPCAtbGF5b3V0QW5jaG9yLnkgKiBiYXNlSGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgaWYgKGJvdHRvbVRvVG9wQ29sdW1uQnJlYWsgfHwgdG9wVG9Cb3R0b21Db2x1bW5CcmVhaykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGRCb3VuZGluZ0JveFdpZHRoID49IHRlbXBNYXhXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlY29uZE1heFdpZHRoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Vjb25kTWF4V2lkdGggPSB0ZW1wTWF4V2lkdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5NYXhXaWR0aCArPSBzZWNvbmRNYXhXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlY29uZE1heFdpZHRoID0gdGVtcE1heFdpZHRoO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uTWF4V2lkdGggKz0gdGVtcE1heFdpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2Vjb25kTWF4V2lkdGggPSBjaGlsZEJvdW5kaW5nQm94V2lkdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTWF4V2lkdGggPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5leHRZID0gYm90dG9tQm91bmRhcnlPZkxheW91dCArIHNpZ24gKiAocGFkZGluZ1kgKyBhbmNob3JZICogY2hpbGRCb3VuZGluZ0JveEhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbisrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGZpbmFsUG9zaXRpb25YID0gZm5Qb3NpdGlvblgoY2hpbGQsIGNvbHVtbk1heFdpZHRoLCBjb2x1bW4pO1xuICAgICAgICAgICAgaWYgKGJhc2VIZWlnaHQgPj0gKGNoaWxkQm91bmRpbmdCb3hIZWlnaHQgKyAodGhpcy5wYWRkaW5nVG9wICsgdGhpcy5wYWRkaW5nQm90dG9tKSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXBwbHlDaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZC5zZXRQb3NpdGlvbihjYy52MihmaW5hbFBvc2l0aW9uWCwgbmV4dFkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzaWduWCA9IDE7XG4gICAgICAgICAgICB2YXIgdGVtcEZpbmFsUG9zaXRpb25YO1xuICAgICAgICAgICAgLy93aGVuIHRoZSBpdGVtIGlzIHRoZSBsYXN0IGNvbHVtbiBicmVhayBpdGVtLCB0aGUgdGVtcE1heFdpZHRoIHdpbGwgYmUgMC5cbiAgICAgICAgICAgIHZhciByaWdodE1hcmlnbiA9ICh0ZW1wTWF4V2lkdGggPT09IDApID8gY2hpbGRCb3VuZGluZ0JveFdpZHRoIDogdGVtcE1heFdpZHRoO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5ob3Jpem9udGFsRGlyZWN0aW9uID09PSBIb3Jpem9udGFsRGlyZWN0aW9uLlJJR0hUX1RPX0xFRlQpIHtcbiAgICAgICAgICAgICAgICBzaWduWCA9IC0xO1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lclJlc2l6ZUJvdW5kYXJ5ID0gY29udGFpbmVyUmVzaXplQm91bmRhcnkgfHwgdGhpcy5ub2RlLl9jb250ZW50U2l6ZS53aWR0aDtcbiAgICAgICAgICAgICAgICB0ZW1wRmluYWxQb3NpdGlvblggPSBmaW5hbFBvc2l0aW9uWCArIHNpZ25YICogKHJpZ2h0TWFyaWduICogbWF4V2lkdGhDaGlsZEFuY2hvclggKyB0aGlzLnBhZGRpbmdMZWZ0KTtcbiAgICAgICAgICAgICAgICBpZiAodGVtcEZpbmFsUG9zaXRpb25YIDwgY29udGFpbmVyUmVzaXplQm91bmRhcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyUmVzaXplQm91bmRhcnkgPSB0ZW1wRmluYWxQb3NpdGlvblg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyUmVzaXplQm91bmRhcnkgPSBjb250YWluZXJSZXNpemVCb3VuZGFyeSB8fCAtdGhpcy5ub2RlLl9jb250ZW50U2l6ZS53aWR0aDtcbiAgICAgICAgICAgICAgICB0ZW1wRmluYWxQb3NpdGlvblggPSBmaW5hbFBvc2l0aW9uWCArIHNpZ25YICogKHJpZ2h0TWFyaWduICogbWF4V2lkdGhDaGlsZEFuY2hvclggKyB0aGlzLnBhZGRpbmdSaWdodCk7XG4gICAgICAgICAgICAgICAgaWYgKHRlbXBGaW5hbFBvc2l0aW9uWCA+IGNvbnRhaW5lclJlc2l6ZUJvdW5kYXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lclJlc2l6ZUJvdW5kYXJ5ID0gdGVtcEZpbmFsUG9zaXRpb25YO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBuZXh0WSArPSB0b3BCb3VuZGFyeU9mQ2hpbGQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29udGFpbmVyUmVzaXplQm91bmRhcnk7XG4gICAgfSxcblxuICAgIF9kb0xheW91dEJhc2ljOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMubm9kZS5jaGlsZHJlbjtcblxuICAgICAgICB2YXIgYWxsQ2hpbGRyZW5Cb3VuZGluZ0JveCA9IG51bGw7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgICAgICAgICBpZiAoY2hpbGQuYWN0aXZlSW5IaWVyYXJjaHkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWFsbENoaWxkcmVuQm91bmRpbmdCb3gpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxsQ2hpbGRyZW5Cb3VuZGluZ0JveCA9IGNoaWxkLmdldEJvdW5kaW5nQm94VG9Xb3JsZCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFsbENoaWxkcmVuQm91bmRpbmdCb3gudW5pb24oYWxsQ2hpbGRyZW5Cb3VuZGluZ0JveCwgY2hpbGQuZ2V0Qm91bmRpbmdCb3hUb1dvcmxkKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhbGxDaGlsZHJlbkJvdW5kaW5nQm94KSB7XG4gICAgICAgICAgICB2YXIgbGVmdEJvdHRvbVNwYWNlID0gdGhpcy5ub2RlLmNvbnZlcnRUb05vZGVTcGFjZUFSKGNjLnYyKGFsbENoaWxkcmVuQm91bmRpbmdCb3gueCwgYWxsQ2hpbGRyZW5Cb3VuZGluZ0JveC55KSk7XG4gICAgICAgICAgICBsZWZ0Qm90dG9tU3BhY2UgPSBjYy52MihsZWZ0Qm90dG9tU3BhY2UueCAtIHRoaXMucGFkZGluZ0xlZnQsIGxlZnRCb3R0b21TcGFjZS55IC0gdGhpcy5wYWRkaW5nQm90dG9tKTtcblxuICAgICAgICAgICAgdmFyIHJpZ2h0VG9wU3BhY2UgPSB0aGlzLm5vZGUuY29udmVydFRvTm9kZVNwYWNlQVIoY2MudjIoYWxsQ2hpbGRyZW5Cb3VuZGluZ0JveC54TWF4LCBhbGxDaGlsZHJlbkJvdW5kaW5nQm94LnlNYXgpKTtcbiAgICAgICAgICAgIHJpZ2h0VG9wU3BhY2UgPSBjYy52MihyaWdodFRvcFNwYWNlLnggKyB0aGlzLnBhZGRpbmdSaWdodCwgcmlnaHRUb3BTcGFjZS55ICsgdGhpcy5wYWRkaW5nVG9wKTtcblxuICAgICAgICAgICAgdmFyIG5ld1NpemUgPSByaWdodFRvcFNwYWNlLnN1YihsZWZ0Qm90dG9tU3BhY2UpO1xuICAgICAgICAgICAgbmV3U2l6ZSA9IGNjLnNpemUocGFyc2VGbG9hdChuZXdTaXplLngudG9GaXhlZCgyKSksIHBhcnNlRmxvYXQobmV3U2l6ZS55LnRvRml4ZWQoMikpKTtcblxuICAgICAgICAgICAgaWYgKG5ld1NpemUud2lkdGggIT09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBJbnZlcnQgaXMgdG8gZ2V0IHRoZSBjb29yZGluYXRlIHBvaW50IG9mIHRoZSBjaGlsZCBub2RlIGluIHRoZSBwYXJlbnQgY29vcmRpbmF0ZSBzeXN0ZW1cbiAgICAgICAgICAgICAgICB2YXIgbmV3QW5jaG9yWCA9ICgtbGVmdEJvdHRvbVNwYWNlLngpIC8gbmV3U2l6ZS53aWR0aDtcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUuYW5jaG9yWCA9IHBhcnNlRmxvYXQobmV3QW5jaG9yWC50b0ZpeGVkKDIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChuZXdTaXplLmhlaWdodCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIEludmVydCBpcyB0byBnZXQgdGhlIGNvb3JkaW5hdGUgcG9pbnQgb2YgdGhlIGNoaWxkIG5vZGUgaW4gdGhlIHBhcmVudCBjb29yZGluYXRlIHN5c3RlbVxuICAgICAgICAgICAgICAgIHZhciBuZXdBbmNob3JZID0gKC1sZWZ0Qm90dG9tU3BhY2UueSkgLyBuZXdTaXplLmhlaWdodDtcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUuYW5jaG9yWSA9IHBhcnNlRmxvYXQobmV3QW5jaG9yWS50b0ZpeGVkKDIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubm9kZS5zZXRDb250ZW50U2l6ZShuZXdTaXplKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZG9MYXlvdXRHcmlkQXhpc0hvcml6b250YWw6IGZ1bmN0aW9uIChsYXlvdXRBbmNob3IsIGxheW91dFNpemUpIHtcbiAgICAgICAgdmFyIGJhc2VXaWR0aCA9IGxheW91dFNpemUud2lkdGg7XG5cbiAgICAgICAgdmFyIHNpZ24gPSAxO1xuICAgICAgICB2YXIgYm90dG9tQm91bmRhcnlPZkxheW91dCA9IC1sYXlvdXRBbmNob3IueSAqIGxheW91dFNpemUuaGVpZ2h0O1xuICAgICAgICB2YXIgcGFkZGluZ1kgPSB0aGlzLnBhZGRpbmdCb3R0b207XG4gICAgICAgIGlmICh0aGlzLnZlcnRpY2FsRGlyZWN0aW9uID09PSBWZXJ0aWNhbERpcmVjdGlvbi5UT1BfVE9fQk9UVE9NKSB7XG4gICAgICAgICAgICBzaWduID0gLTE7XG4gICAgICAgICAgICBib3R0b21Cb3VuZGFyeU9mTGF5b3V0ID0gKDEgLSBsYXlvdXRBbmNob3IueSkgKiBsYXlvdXRTaXplLmhlaWdodDtcbiAgICAgICAgICAgIHBhZGRpbmdZID0gdGhpcy5wYWRkaW5nVG9wO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZuUG9zaXRpb25ZID0gZnVuY3Rpb24gKGNoaWxkLCB0b3BPZmZzZXQsIHJvdykge1xuICAgICAgICAgICAgcmV0dXJuIGJvdHRvbUJvdW5kYXJ5T2ZMYXlvdXQgKyBzaWduICogKHRvcE9mZnNldCArIGNoaWxkLmFuY2hvclkgKiBjaGlsZC5oZWlnaHQgKiB0aGlzLl9nZXRVc2VkU2NhbGVWYWx1ZShjaGlsZC5zY2FsZVkpICsgcGFkZGluZ1kgKyByb3cgKiB0aGlzLnNwYWNpbmdZKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuXG5cbiAgICAgICAgdmFyIG5ld0hlaWdodCA9IDA7XG4gICAgICAgIGlmICh0aGlzLnJlc2l6ZU1vZGUgPT09IFJlc2l6ZU1vZGUuQ09OVEFJTkVSKSB7XG4gICAgICAgICAgICAvL2NhbGN1bGF0ZSB0aGUgbmV3IGhlaWdodCBvZiBjb250YWluZXIsIGl0IHdvbid0IGNoYW5nZSB0aGUgcG9zaXRpb24gb2YgaXQncyBjaGlsZHJlblxuICAgICAgICAgICAgdmFyIGJvdW5kYXJ5ID0gdGhpcy5fZG9MYXlvdXRIb3Jpem9udGFsbHkoYmFzZVdpZHRoLCB0cnVlLCBmblBvc2l0aW9uWSwgZmFsc2UpO1xuICAgICAgICAgICAgbmV3SGVpZ2h0ID0gYm90dG9tQm91bmRhcnlPZkxheW91dCAtIGJvdW5kYXJ5O1xuICAgICAgICAgICAgaWYgKG5ld0hlaWdodCA8IDApIHtcbiAgICAgICAgICAgICAgICBuZXdIZWlnaHQgKj0gLTE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJvdHRvbUJvdW5kYXJ5T2ZMYXlvdXQgPSAtbGF5b3V0QW5jaG9yLnkgKiBuZXdIZWlnaHQ7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnZlcnRpY2FsRGlyZWN0aW9uID09PSBWZXJ0aWNhbERpcmVjdGlvbi5UT1BfVE9fQk9UVE9NKSB7XG4gICAgICAgICAgICAgICAgc2lnbiA9IC0xO1xuICAgICAgICAgICAgICAgIGJvdHRvbUJvdW5kYXJ5T2ZMYXlvdXQgPSAoMSAtIGxheW91dEFuY2hvci55KSAqIG5ld0hlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2RvTGF5b3V0SG9yaXpvbnRhbGx5KGJhc2VXaWR0aCwgdHJ1ZSwgZm5Qb3NpdGlvblksIHRydWUpO1xuXG4gICAgICAgIGlmICh0aGlzLnJlc2l6ZU1vZGUgPT09IFJlc2l6ZU1vZGUuQ09OVEFJTkVSKSB7XG4gICAgICAgICAgICB0aGlzLm5vZGUuc2V0Q29udGVudFNpemUoYmFzZVdpZHRoLCBuZXdIZWlnaHQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9kb0xheW91dEdyaWRBeGlzVmVydGljYWw6IGZ1bmN0aW9uIChsYXlvdXRBbmNob3IsIGxheW91dFNpemUpIHtcbiAgICAgICAgdmFyIGJhc2VIZWlnaHQgPSBsYXlvdXRTaXplLmhlaWdodDtcblxuICAgICAgICB2YXIgc2lnbiA9IDE7XG4gICAgICAgIHZhciBsZWZ0Qm91bmRhcnlPZkxheW91dCA9IC1sYXlvdXRBbmNob3IueCAqIGxheW91dFNpemUud2lkdGg7XG4gICAgICAgIHZhciBwYWRkaW5nWCA9IHRoaXMucGFkZGluZ0xlZnQ7XG4gICAgICAgIGlmICh0aGlzLmhvcml6b250YWxEaXJlY3Rpb24gPT09IEhvcml6b250YWxEaXJlY3Rpb24uUklHSFRfVE9fTEVGVCkge1xuICAgICAgICAgICAgc2lnbiA9IC0xO1xuICAgICAgICAgICAgbGVmdEJvdW5kYXJ5T2ZMYXlvdXQgPSAoMSAtIGxheW91dEFuY2hvci54KSAqIGxheW91dFNpemUud2lkdGg7XG4gICAgICAgICAgICBwYWRkaW5nWCA9IHRoaXMucGFkZGluZ1JpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZuUG9zaXRpb25YID0gZnVuY3Rpb24gKGNoaWxkLCBsZWZ0T2Zmc2V0LCBjb2x1bW4pIHtcbiAgICAgICAgICAgIHJldHVybiBsZWZ0Qm91bmRhcnlPZkxheW91dCArIHNpZ24gKiAobGVmdE9mZnNldCArIGNoaWxkLmFuY2hvclggKiBjaGlsZC53aWR0aCAqIHRoaXMuX2dldFVzZWRTY2FsZVZhbHVlKGNoaWxkLnNjYWxlWCkgKyBwYWRkaW5nWCArIGNvbHVtbiAqIHRoaXMuc3BhY2luZ1gpO1xuICAgICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgICAgdmFyIG5ld1dpZHRoID0gMDtcbiAgICAgICAgaWYgKHRoaXMucmVzaXplTW9kZSA9PT0gUmVzaXplTW9kZS5DT05UQUlORVIpIHtcbiAgICAgICAgICAgIHZhciBib3VuZGFyeSA9IHRoaXMuX2RvTGF5b3V0VmVydGljYWxseShiYXNlSGVpZ2h0LCB0cnVlLCBmblBvc2l0aW9uWCwgZmFsc2UpO1xuICAgICAgICAgICAgbmV3V2lkdGggPSBsZWZ0Qm91bmRhcnlPZkxheW91dCAtIGJvdW5kYXJ5O1xuICAgICAgICAgICAgaWYgKG5ld1dpZHRoIDwgMCkge1xuICAgICAgICAgICAgICAgIG5ld1dpZHRoICo9IC0xO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZWZ0Qm91bmRhcnlPZkxheW91dCA9IC1sYXlvdXRBbmNob3IueCAqIG5ld1dpZHRoO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5ob3Jpem9udGFsRGlyZWN0aW9uID09PSBIb3Jpem9udGFsRGlyZWN0aW9uLlJJR0hUX1RPX0xFRlQpIHtcbiAgICAgICAgICAgICAgICBzaWduID0gLTE7XG4gICAgICAgICAgICAgICAgbGVmdEJvdW5kYXJ5T2ZMYXlvdXQgPSAoMSAtIGxheW91dEFuY2hvci54KSAqIG5ld1dpZHRoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZG9MYXlvdXRWZXJ0aWNhbGx5KGJhc2VIZWlnaHQsIHRydWUsIGZuUG9zaXRpb25YLCB0cnVlKTtcblxuICAgICAgICBpZiAodGhpcy5yZXNpemVNb2RlID09PSBSZXNpemVNb2RlLkNPTlRBSU5FUikge1xuICAgICAgICAgICAgdGhpcy5ub2RlLnNldENvbnRlbnRTaXplKG5ld1dpZHRoLCBiYXNlSGVpZ2h0KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZG9MYXlvdXRHcmlkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsYXlvdXRBbmNob3IgPSB0aGlzLm5vZGUuZ2V0QW5jaG9yUG9pbnQoKTtcbiAgICAgICAgdmFyIGxheW91dFNpemUgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKTtcblxuICAgICAgICBpZiAodGhpcy5zdGFydEF4aXMgPT09IEF4aXNEaXJlY3Rpb24uSE9SSVpPTlRBTCkge1xuICAgICAgICAgICAgdGhpcy5fZG9MYXlvdXRHcmlkQXhpc0hvcml6b250YWwobGF5b3V0QW5jaG9yLCBsYXlvdXRTaXplKTtcblxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuc3RhcnRBeGlzID09PSBBeGlzRGlyZWN0aW9uLlZFUlRJQ0FMKSB7XG4gICAgICAgICAgICB0aGlzLl9kb0xheW91dEdyaWRBeGlzVmVydGljYWwobGF5b3V0QW5jaG9yLCBsYXlvdXRTaXplKTtcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIF9nZXRIb3Jpem9udGFsQmFzZVdpZHRoOiBmdW5jdGlvbiAoY2hpbGRyZW4pIHtcbiAgICAgICAgdmFyIG5ld1dpZHRoID0gMDtcbiAgICAgICAgdmFyIGFjdGl2ZUNoaWxkQ291bnQgPSAwO1xuICAgICAgICBpZiAodGhpcy5yZXNpemVNb2RlID09PSBSZXNpemVNb2RlLkNPTlRBSU5FUikge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZC5hY3RpdmVJbkhpZXJhcmNoeSkge1xuICAgICAgICAgICAgICAgICAgICBhY3RpdmVDaGlsZENvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgIG5ld1dpZHRoICs9IGNoaWxkLndpZHRoICogdGhpcy5fZ2V0VXNlZFNjYWxlVmFsdWUoY2hpbGQuc2NhbGVYKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdXaWR0aCArPSAoYWN0aXZlQ2hpbGRDb3VudCAtIDEpICogdGhpcy5zcGFjaW5nWCArIHRoaXMucGFkZGluZ0xlZnQgKyB0aGlzLnBhZGRpbmdSaWdodDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG5ld1dpZHRoID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld1dpZHRoO1xuICAgIH0sXG5cbiAgICBfZG9MYXlvdXQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBpZiAodGhpcy50eXBlID09PSBUeXBlLkhPUklaT05UQUwpIHtcbiAgICAgICAgICAgIHZhciBuZXdXaWR0aCA9IHRoaXMuX2dldEhvcml6b250YWxCYXNlV2lkdGgodGhpcy5ub2RlLmNoaWxkcmVuKTtcblxuICAgICAgICAgICAgdmFyIGZuUG9zaXRpb25ZID0gZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkLnk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLl9kb0xheW91dEhvcml6b250YWxseShuZXdXaWR0aCwgZmFsc2UsIGZuUG9zaXRpb25ZLCB0cnVlKTtcblxuICAgICAgICAgICAgdGhpcy5ub2RlLndpZHRoID0gbmV3V2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy50eXBlID09PSBUeXBlLlZFUlRJQ0FMKSB7XG4gICAgICAgICAgICB2YXIgbmV3SGVpZ2h0ID0gdGhpcy5fZ2V0VmVydGljYWxCYXNlSGVpZ2h0KHRoaXMubm9kZS5jaGlsZHJlbik7XG5cbiAgICAgICAgICAgIHZhciBmblBvc2l0aW9uWCA9IGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZC54O1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5fZG9MYXlvdXRWZXJ0aWNhbGx5KG5ld0hlaWdodCwgZmFsc2UsIGZuUG9zaXRpb25YLCB0cnVlKTtcblxuICAgICAgICAgICAgdGhpcy5ub2RlLmhlaWdodCA9IG5ld0hlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnR5cGUgPT09IFR5cGUuTk9ORSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucmVzaXplTW9kZSA9PT0gUmVzaXplTW9kZS5DT05UQUlORVIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kb0xheW91dEJhc2ljKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy50eXBlID09PSBUeXBlLkdSSUQpIHtcbiAgICAgICAgICAgIHRoaXMuX2RvTGF5b3V0R3JpZCgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9nZXRVc2VkU2NhbGVWYWx1ZSAodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWZmZWN0ZWRCeVNjYWxlID8gTWF0aC5hYnModmFsdWUpIDogMTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBQZXJmb3JtIHRoZSBsYXlvdXQgdXBkYXRlXG4gICAgICogISN6aCDnq4vljbPmiafooYzmm7TmlrDluIPlsYBcbiAgICAgKlxuICAgICAqIEBtZXRob2QgdXBkYXRlTGF5b3V0XG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGxheW91dC50eXBlID0gY2MuTGF5b3V0LkhPUklaT05UQUw7XG4gICAgICogbGF5b3V0Lm5vZGUuYWRkQ2hpbGQoY2hpbGROb2RlKTtcbiAgICAgKiBjYy5sb2coY2hpbGROb2RlLngpOyAvLyBub3QgeWV0IGNoYW5nZWRcbiAgICAgKiBsYXlvdXQudXBkYXRlTGF5b3V0KCk7XG4gICAgICogY2MubG9nKGNoaWxkTm9kZS54KTsgLy8gY2hhbmdlZFxuICAgICAqL1xuICAgIHVwZGF0ZUxheW91dDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fbGF5b3V0RGlydHkgJiYgdGhpcy5ub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2RvTGF5b3V0KCk7XG4gICAgICAgICAgICB0aGlzLl9sYXlvdXREaXJ0eSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbi8qKlxuICogISNlbiBUaGUgcGFkZGluZyBvZiBsYXlvdXQsIGl0IGVmZmVjdHMgdGhlIGxheW91dCBpbiBmb3VyIGRpcmVjdGlvbi5cbiAqICEjemgg5a655Zmo5YaF6L656Led77yM6K+l5bGe5oCn5Lya5Zyo5Zub5Liq5biD5bGA5pa55ZCR5LiK55Sf5pWI44CCXG4gKiBAcHJvcGVydHkge051bWJlcn0gcGFkZGluZ1xuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoTGF5b3V0LnByb3RvdHlwZSwgXCJwYWRkaW5nXCIsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Mud2FybklEKDQxMDApO1xuICAgICAgICByZXR1cm4gdGhpcy5wYWRkaW5nTGVmdDtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX04kcGFkZGluZyA9IHZhbHVlO1xuXG4gICAgICAgIHRoaXMuX21pZ3JhdGVQYWRkaW5nRGF0YSgpO1xuICAgICAgICB0aGlzLl9kb0xheW91dERpcnR5KCk7XG4gICAgfVxufSk7XG5cbmNjLkxheW91dCA9IG1vZHVsZS5leHBvcnRzID0gTGF5b3V0O1xuIl19