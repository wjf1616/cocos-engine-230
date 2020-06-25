
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCScrollView.js';
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

var NUMBER_OF_GATHERED_TOUCHES_FOR_MOVE_SPEED = 5;
var OUT_OF_BOUNDARY_BREAKING_FACTOR = 0.05;
var EPSILON = 1e-4;
var MOVEMENT_FACTOR = 0.7;

var _tempPoint = cc.v2();

var _tempPrevPoint = cc.v2();

var quintEaseOut = function quintEaseOut(time) {
  time -= 1;
  return time * time * time * time * time + 1;
};

var getTimeInMilliseconds = function getTimeInMilliseconds() {
  var currentTime = new Date();
  return currentTime.getMilliseconds();
};
/**
 * !#en Enum for ScrollView event type.
 * !#zh 滚动视图事件类型
 * @enum ScrollView.EventType
 */


var EventType = cc.Enum({
  /**
   * !#en The event emmitted when ScrollView scroll to the top boundary of inner container
   * !#zh 滚动视图滚动到顶部边界事件
   * @property {Number} SCROLL_TO_TOP
   */
  SCROLL_TO_TOP: 0,

  /**
   * !#en The event emmitted when ScrollView scroll to the bottom boundary of inner container
   * !#zh 滚动视图滚动到底部边界事件
   * @property {Number} SCROLL_TO_BOTTOM
   */
  SCROLL_TO_BOTTOM: 1,

  /**
   * !#en The event emmitted when ScrollView scroll to the left boundary of inner container
   * !#zh 滚动视图滚动到左边界事件
   * @property {Number} SCROLL_TO_LEFT
   */
  SCROLL_TO_LEFT: 2,

  /**
   * !#en The event emmitted when ScrollView scroll to the right boundary of inner container
   * !#zh 滚动视图滚动到右边界事件
   * @property {Number} SCROLL_TO_RIGHT
   */
  SCROLL_TO_RIGHT: 3,

  /**
   * !#en The event emmitted when ScrollView is scrolling
   * !#zh 滚动视图正在滚动时发出的事件
   * @property {Number} SCROLLING
   */
  SCROLLING: 4,

  /**
   * !#en The event emmitted when ScrollView scroll to the top boundary of inner container and start bounce
   * !#zh 滚动视图滚动到顶部边界并且开始回弹时发出的事件
   * @property {Number} BOUNCE_TOP
   */
  BOUNCE_TOP: 5,

  /**
   * !#en The event emmitted when ScrollView scroll to the bottom boundary of inner container and start bounce
   * !#zh 滚动视图滚动到底部边界并且开始回弹时发出的事件
   * @property {Number} BOUNCE_BOTTOM
   */
  BOUNCE_BOTTOM: 6,

  /**
   * !#en The event emmitted when ScrollView scroll to the left boundary of inner container and start bounce
   * !#zh 滚动视图滚动到左边界并且开始回弹时发出的事件
   * @property {Number} BOUNCE_LEFT
   */
  BOUNCE_LEFT: 7,

  /**
   * !#en The event emmitted when ScrollView scroll to the right boundary of inner container and start bounce
   * !#zh 滚动视图滚动到右边界并且开始回弹时发出的事件
   * @property {Number} BOUNCE_RIGHT
   */
  BOUNCE_RIGHT: 8,

  /**
   * !#en The event emmitted when ScrollView auto scroll ended
   * !#zh 滚动视图滚动结束的时候发出的事件
   * @property {Number} SCROLL_ENDED
   */
  SCROLL_ENDED: 9,

  /**
   * !#en The event emmitted when user release the touch
   * !#zh 当用户松手的时候会发出一个事件
   * @property {Number} TOUCH_UP
   */
  TOUCH_UP: 10,

  /**
   * !#en The event emmitted when ScrollView auto scroll ended with a threshold
   * !#zh 滚动视图自动滚动快要结束的时候发出的事件
   * @property {Number} AUTOSCROLL_ENDED_WITH_THRESHOLD
   */
  AUTOSCROLL_ENDED_WITH_THRESHOLD: 11,

  /**
   * !#en The event emmitted when ScrollView scroll began
   * !#zh 滚动视图滚动开始时发出的事件
   * @property {Number} SCROLL_BEGAN
   */
  SCROLL_BEGAN: 12
});
var eventMap = {
  'scroll-to-top': EventType.SCROLL_TO_TOP,
  'scroll-to-bottom': EventType.SCROLL_TO_BOTTOM,
  'scroll-to-left': EventType.SCROLL_TO_LEFT,
  'scroll-to-right': EventType.SCROLL_TO_RIGHT,
  'scrolling': EventType.SCROLLING,
  'bounce-bottom': EventType.BOUNCE_BOTTOM,
  'bounce-left': EventType.BOUNCE_LEFT,
  'bounce-right': EventType.BOUNCE_RIGHT,
  'bounce-top': EventType.BOUNCE_TOP,
  'scroll-ended': EventType.SCROLL_ENDED,
  'touch-up': EventType.TOUCH_UP,
  'scroll-ended-with-threshold': EventType.AUTOSCROLL_ENDED_WITH_THRESHOLD,
  'scroll-began': EventType.SCROLL_BEGAN
};
/**
 * !#en
 * Layout container for a view hierarchy that can be scrolled by the user,
 * allowing it to be larger than the physical display.
 *
 * !#zh
 * 滚动视图组件
 * @class ScrollView
 * @extends Component
 */

var ScrollView = cc.Class({
  name: 'cc.ScrollView',
  "extends": require('./CCViewGroup'),
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.ui/ScrollView',
    help: 'i18n:COMPONENT.help_url.scrollview',
    inspector: 'packages://inspector/inspectors/comps/scrollview.js',
    executeInEditMode: false
  },
  ctor: function ctor() {
    this._topBoundary = 0;
    this._bottomBoundary = 0;
    this._leftBoundary = 0;
    this._rightBoundary = 0;
    this._touchMoveDisplacements = [];
    this._touchMoveTimeDeltas = [];
    this._touchMovePreviousTimestamp = 0;
    this._touchMoved = false;
    this._autoScrolling = false;
    this._autoScrollAttenuate = false;
    this._autoScrollStartPosition = cc.v2(0, 0);
    this._autoScrollTargetDelta = cc.v2(0, 0);
    this._autoScrollTotalTime = 0;
    this._autoScrollAccumulatedTime = 0;
    this._autoScrollCurrentlyOutOfBoundary = false;
    this._autoScrollBraking = false;
    this._autoScrollBrakingStartPosition = cc.v2(0, 0);
    this._outOfBoundaryAmount = cc.v2(0, 0);
    this._outOfBoundaryAmountDirty = true;
    this._stopMouseWheel = false;
    this._mouseWheelEventElapsedTime = 0.0;
    this._isScrollEndedWithThresholdEventFired = false; //use bit wise operations to indicate the direction

    this._scrollEventEmitMask = 0;
    this._isBouncing = false;
    this._scrolling = false;
  },
  properties: {
    /**
     * !#en This is a reference to the UI element to be scrolled.
     * !#zh 可滚动展示内容的节点。
     * @property {Node} content
     */
    content: {
      "default": undefined,
      type: cc.Node,
      tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.content',
      formerlySerializedAs: 'content',
      notify: function notify(oldValue) {
        this._calculateBoundary();
      }
    },

    /**
     * !#en Enable horizontal scroll.
     * !#zh 是否开启水平滚动。
     * @property {Boolean} horizontal
     */
    horizontal: {
      "default": true,
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.horizontal'
    },

    /**
     * !#en Enable vertical scroll.
     * !#zh 是否开启垂直滚动。
     * @property {Boolean} vertical
     */
    vertical: {
      "default": true,
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.vertical'
    },

    /**
     * !#en When inertia is set, the content will continue to move when touch ended.
     * !#zh 是否开启滚动惯性。
     * @property {Boolean} inertia
     */
    inertia: {
      "default": true,
      tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.inertia'
    },

    /**
     * !#en
     * It determines how quickly the content stop moving. A value of 1 will stop the movement immediately.
     * A value of 0 will never stop the movement until it reaches to the boundary of scrollview.
     * !#zh
     * 开启惯性后，在用户停止触摸后滚动多快停止，0表示永不停止，1表示立刻停止。
     * @property {Number} brake
     */
    brake: {
      "default": 0.5,
      type: cc.Float,
      range: [0, 1, 0.1],
      tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.brake'
    },

    /**
     * !#en When elastic is set, the content will be bounce back when move out of boundary.
     * !#zh 是否允许滚动内容超过边界，并在停止触摸后回弹。
     * @property {Boolean} elastic
     */
    elastic: {
      "default": true,
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.elastic'
    },

    /**
     * !#en The elapse time of bouncing back. A value of 0 will bounce back immediately.
     * !#zh 回弹持续的时间，0 表示将立即反弹。
     * @property {Number} bounceDuration
     */
    bounceDuration: {
      "default": 1,
      range: [0, 10],
      tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.bounceDuration'
    },

    /**
     * !#en The horizontal scrollbar reference.
     * !#zh 水平滚动的 ScrollBar。
     * @property {Scrollbar} horizontalScrollBar
     */
    horizontalScrollBar: {
      "default": undefined,
      type: cc.Scrollbar,
      tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.horizontal_bar',
      notify: function notify() {
        if (this.horizontalScrollBar) {
          this.horizontalScrollBar.setTargetScrollView(this);

          this._updateScrollBar(0);
        }
      },
      animatable: false
    },

    /**
     * !#en The vertical scrollbar reference.
     * !#zh 垂直滚动的 ScrollBar。
     * @property {Scrollbar} verticalScrollBar
     */
    verticalScrollBar: {
      "default": undefined,
      type: cc.Scrollbar,
      tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.vertical_bar',
      notify: function notify() {
        if (this.verticalScrollBar) {
          this.verticalScrollBar.setTargetScrollView(this);

          this._updateScrollBar(0);
        }
      },
      animatable: false
    },

    /**
     * !#en Scrollview events callback
     * !#zh 滚动视图的事件回调函数
     * @property {Component.EventHandler[]} scrollEvents
     */
    scrollEvents: {
      "default": [],
      type: cc.Component.EventHandler,
      tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.scrollEvents'
    },

    /**
     * !#en If cancelInnerEvents is set to true, the scroll behavior will cancel touch events on inner content nodes
     * It's set to true by default.
     * !#zh 如果这个属性被设置为 true，那么滚动行为会取消子节点上注册的触摸事件，默认被设置为 true。
     * 注意，子节点上的 touchstart 事件仍然会触发，触点移动距离非常短的情况下 touchmove 和 touchend 也不会受影响。
     * @property {Boolean} cancelInnerEvents
     */
    cancelInnerEvents: {
      "default": true,
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.scrollview.cancelInnerEvents'
    },
    // private object
    _view: {
      get: function get() {
        if (this.content) {
          return this.content.parent;
        }
      }
    }
  },
  statics: {
    EventType: EventType
  },

  /**
   * !#en Scroll the content to the bottom boundary of ScrollView.
   * !#zh 视图内容将在规定时间内滚动到视图底部。
   * @method scrollToBottom
   * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
   * the content will jump to the bottom boundary immediately.
   * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
   * @example
   * // Scroll to the bottom of the view.
   * scrollView.scrollToBottom(0.1);
   */
  scrollToBottom: function scrollToBottom(timeInSecond, attenuated) {
    var moveDelta = this._calculateMovePercentDelta({
      anchor: cc.v2(0, 0),
      applyToHorizontal: false,
      applyToVertical: true
    });

    if (timeInSecond) {
      this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
    } else {
      this._moveContent(moveDelta, true);
    }
  },

  /**
   * !#en Scroll the content to the top boundary of ScrollView.
   * !#zh 视图内容将在规定时间内滚动到视图顶部。
   * @method scrollToTop
   * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
   * the content will jump to the top boundary immediately.
   * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
   * @example
   * // Scroll to the top of the view.
   * scrollView.scrollToTop(0.1);
   */
  scrollToTop: function scrollToTop(timeInSecond, attenuated) {
    var moveDelta = this._calculateMovePercentDelta({
      anchor: cc.v2(0, 1),
      applyToHorizontal: false,
      applyToVertical: true
    });

    if (timeInSecond) {
      this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
    } else {
      this._moveContent(moveDelta);
    }
  },

  /**
   * !#en Scroll the content to the left boundary of ScrollView.
   * !#zh 视图内容将在规定时间内滚动到视图左边。
   * @method scrollToLeft
   * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
   * the content will jump to the left boundary immediately.
   * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
   * @example
   * // Scroll to the left of the view.
   * scrollView.scrollToLeft(0.1);
   */
  scrollToLeft: function scrollToLeft(timeInSecond, attenuated) {
    var moveDelta = this._calculateMovePercentDelta({
      anchor: cc.v2(0, 0),
      applyToHorizontal: true,
      applyToVertical: false
    });

    if (timeInSecond) {
      this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
    } else {
      this._moveContent(moveDelta);
    }
  },

  /**
   * !#en Scroll the content to the right boundary of ScrollView.
   * !#zh 视图内容将在规定时间内滚动到视图右边。
   * @method scrollToRight
   * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
   * the content will jump to the right boundary immediately.
   * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
   * @example
   * // Scroll to the right of the view.
   * scrollView.scrollToRight(0.1);
   */
  scrollToRight: function scrollToRight(timeInSecond, attenuated) {
    var moveDelta = this._calculateMovePercentDelta({
      anchor: cc.v2(1, 0),
      applyToHorizontal: true,
      applyToVertical: false
    });

    if (timeInSecond) {
      this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
    } else {
      this._moveContent(moveDelta);
    }
  },

  /**
   * !#en Scroll the content to the top left boundary of ScrollView.
   * !#zh 视图内容将在规定时间内滚动到视图左上角。
   * @method scrollToTopLeft
   * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
   * the content will jump to the top left boundary immediately.
   * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
   * @example
   * // Scroll to the upper left corner of the view.
   * scrollView.scrollToTopLeft(0.1);
   */
  scrollToTopLeft: function scrollToTopLeft(timeInSecond, attenuated) {
    var moveDelta = this._calculateMovePercentDelta({
      anchor: cc.v2(0, 1),
      applyToHorizontal: true,
      applyToVertical: true
    });

    if (timeInSecond) {
      this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
    } else {
      this._moveContent(moveDelta);
    }
  },

  /**
   * !#en Scroll the content to the top right boundary of ScrollView.
   * !#zh 视图内容将在规定时间内滚动到视图右上角。
   * @method scrollToTopRight
   * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
   * the content will jump to the top right boundary immediately.
   * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
   * @example
   * // Scroll to the top right corner of the view.
   * scrollView.scrollToTopRight(0.1);
   */
  scrollToTopRight: function scrollToTopRight(timeInSecond, attenuated) {
    var moveDelta = this._calculateMovePercentDelta({
      anchor: cc.v2(1, 1),
      applyToHorizontal: true,
      applyToVertical: true
    });

    if (timeInSecond) {
      this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
    } else {
      this._moveContent(moveDelta);
    }
  },

  /**
   * !#en Scroll the content to the bottom left boundary of ScrollView.
   * !#zh 视图内容将在规定时间内滚动到视图左下角。
   * @method scrollToBottomLeft
   * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
   * the content will jump to the bottom left boundary immediately.
   * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
   * @example
   * // Scroll to the lower left corner of the view.
   * scrollView.scrollToBottomLeft(0.1);
   */
  scrollToBottomLeft: function scrollToBottomLeft(timeInSecond, attenuated) {
    var moveDelta = this._calculateMovePercentDelta({
      anchor: cc.v2(0, 0),
      applyToHorizontal: true,
      applyToVertical: true
    });

    if (timeInSecond) {
      this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
    } else {
      this._moveContent(moveDelta);
    }
  },

  /**
   * !#en Scroll the content to the bottom right boundary of ScrollView.
   * !#zh 视图内容将在规定时间内滚动到视图右下角。
   * @method scrollToBottomRight
   * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
   * the content will jump to the bottom right boundary immediately.
   * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
   * @example
   * // Scroll to the lower right corner of the view.
   * scrollView.scrollToBottomRight(0.1);
   */
  scrollToBottomRight: function scrollToBottomRight(timeInSecond, attenuated) {
    var moveDelta = this._calculateMovePercentDelta({
      anchor: cc.v2(1, 0),
      applyToHorizontal: true,
      applyToVertical: true
    });

    if (timeInSecond) {
      this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
    } else {
      this._moveContent(moveDelta);
    }
  },

  /**
   * !#en Scroll with an offset related to the ScrollView's top left origin, if timeInSecond is omitted, then it will jump to the
   *       specific offset immediately.
   * !#zh 视图内容在规定时间内将滚动到 ScrollView 相对左上角原点的偏移位置, 如果 timeInSecond参数不传，则立即滚动到指定偏移位置。
   * @method scrollToOffset
   * @param {Vec2} offset - A Vec2, the value of which each axis between 0 and maxScrollOffset
   * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
   * the content will jump to the specific offset of ScrollView immediately.
   * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
   * @example
   * // Scroll to middle position in 0.1 second in x-axis
   * let maxScrollOffset = this.getMaxScrollOffset();
   * scrollView.scrollToOffset(cc.v2(maxScrollOffset.x / 2, 0), 0.1);
   */
  scrollToOffset: function scrollToOffset(offset, timeInSecond, attenuated) {
    var maxScrollOffset = this.getMaxScrollOffset();
    var anchor = cc.v2(0, 0); //if maxScrollOffset is 0, then always align the content's top left origin to the top left corner of its parent

    if (maxScrollOffset.x === 0) {
      anchor.x = 0;
    } else {
      anchor.x = offset.x / maxScrollOffset.x;
    }

    if (maxScrollOffset.y === 0) {
      anchor.y = 1;
    } else {
      anchor.y = (maxScrollOffset.y - offset.y) / maxScrollOffset.y;
    }

    this.scrollTo(anchor, timeInSecond, attenuated);
  },

  /**
   * !#en  Get the positive offset value corresponds to the content's top left boundary.
   * !#zh  获取滚动视图相对于左上角原点的当前滚动偏移
   * @method getScrollOffset
   * @return {Vec2}  - A Vec2 value indicate the current scroll offset.
   */
  getScrollOffset: function getScrollOffset() {
    var topDelta = this._getContentTopBoundary() - this._topBoundary;

    var leftDeta = this._getContentLeftBoundary() - this._leftBoundary;

    return cc.v2(leftDeta, topDelta);
  },

  /**
   * !#en Get the maximize available  scroll offset
   * !#zh 获取滚动视图最大可以滚动的偏移量
   * @method getMaxScrollOffset
   * @return {Vec2} - A Vec2 value indicate the maximize scroll offset in x and y axis.
   */
  getMaxScrollOffset: function getMaxScrollOffset() {
    var viewSize = this._view.getContentSize();

    var contentSize = this.content.getContentSize();
    var horizontalMaximizeOffset = contentSize.width - viewSize.width;
    var verticalMaximizeOffset = contentSize.height - viewSize.height;
    horizontalMaximizeOffset = horizontalMaximizeOffset >= 0 ? horizontalMaximizeOffset : 0;
    verticalMaximizeOffset = verticalMaximizeOffset >= 0 ? verticalMaximizeOffset : 0;
    return cc.v2(horizontalMaximizeOffset, verticalMaximizeOffset);
  },

  /**
   * !#en Scroll the content to the horizontal percent position of ScrollView.
   * !#zh 视图内容在规定时间内将滚动到 ScrollView 水平方向的百分比位置上。
   * @method scrollToPercentHorizontal
   * @param {Number} percent - A value between 0 and 1.
   * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
   * the content will jump to the horizontal percent position of ScrollView immediately.
   * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
   * @example
   * // Scroll to middle position.
   * scrollView.scrollToBottomRight(0.5, 0.1);
   */
  scrollToPercentHorizontal: function scrollToPercentHorizontal(percent, timeInSecond, attenuated) {
    var moveDelta = this._calculateMovePercentDelta({
      anchor: cc.v2(percent, 0),
      applyToHorizontal: true,
      applyToVertical: false
    });

    if (timeInSecond) {
      this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
    } else {
      this._moveContent(moveDelta);
    }
  },

  /**
   * !#en Scroll the content to the percent position of ScrollView in any direction.
   * !#zh 视图内容在规定时间内进行垂直方向和水平方向的滚动，并且滚动到指定百分比位置上。
   * @method scrollTo
   * @param {Vec2} anchor - A point which will be clamp between cc.v2(0,0) and cc.v2(1,1).
   * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
   * the content will jump to the percent position of ScrollView immediately.
   * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
   * @example
   * // Vertical scroll to the bottom of the view.
   * scrollView.scrollTo(cc.v2(0, 1), 0.1);
   *
   * // Horizontal scroll to view right.
   * scrollView.scrollTo(cc.v2(1, 0), 0.1);
   */
  scrollTo: function scrollTo(anchor, timeInSecond, attenuated) {
    var moveDelta = this._calculateMovePercentDelta({
      anchor: cc.v2(anchor),
      applyToHorizontal: true,
      applyToVertical: true
    });

    if (timeInSecond) {
      this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
    } else {
      this._moveContent(moveDelta);
    }
  },

  /**
   * !#en Scroll the content to the vertical percent position of ScrollView.
   * !#zh 视图内容在规定时间内滚动到 ScrollView 垂直方向的百分比位置上。
   * @method scrollToPercentVertical
   * @param {Number} percent - A value between 0 and 1.
   * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
   * the content will jump to the vertical percent position of ScrollView immediately.
   * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
   * // Scroll to middle position.
   * scrollView.scrollToPercentVertical(0.5, 0.1);
   */
  scrollToPercentVertical: function scrollToPercentVertical(percent, timeInSecond, attenuated) {
    var moveDelta = this._calculateMovePercentDelta({
      anchor: cc.v2(0, percent),
      applyToHorizontal: false,
      applyToVertical: true
    });

    if (timeInSecond) {
      this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
    } else {
      this._moveContent(moveDelta);
    }
  },

  /**
   * !#en  Stop auto scroll immediately
   * !#zh  停止自动滚动, 调用此 API 可以让 Scrollview 立即停止滚动
   * @method stopAutoScroll
   */
  stopAutoScroll: function stopAutoScroll() {
    this._autoScrolling = false;
    this._autoScrollAccumulatedTime = this._autoScrollTotalTime;
  },

  /**
   * !#en Modify the content position.
   * !#zh 设置当前视图内容的坐标点。
   * @method setContentPosition
   * @param {Vec2} position - The position in content's parent space.
   */
  setContentPosition: function setContentPosition(position) {
    if (position.fuzzyEquals(this.getContentPosition(), EPSILON)) {
      return;
    }

    this.content.setPosition(position);
    this._outOfBoundaryAmountDirty = true;
  },

  /**
   * !#en Query the content's position in its parent space.
   * !#zh 获取当前视图内容的坐标点。
   * @method getContentPosition
   * @returns {Vec2} - The content's position in its parent space.
   */
  getContentPosition: function getContentPosition() {
    return this.content.getPosition();
  },

  /**
   * !#en Query whether the user is currently dragging the ScrollView to scroll it
   * !#zh 用户是否在拖拽当前滚动视图
   * @method isScrolling
   * @returns {Boolean} - Whether the user is currently dragging the ScrollView to scroll it
   */
  isScrolling: function isScrolling() {
    return this._scrolling;
  },

  /**
   * !#en Query whether the ScrollView is currently scrolling because of a bounceback or inertia slowdown.
   * !#zh 当前滚动视图是否在惯性滚动
   * @method isAutoScrolling
   * @returns {Boolean} - Whether the ScrollView is currently scrolling because of a bounceback or inertia slowdown.
   */
  isAutoScrolling: function isAutoScrolling() {
    return this._autoScrolling;
  },
  //private methods
  _registerEvent: function _registerEvent() {
    this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this, true);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, true);
    this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this, true);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, true);
    this.node.on(cc.Node.EventType.MOUSE_WHEEL, this._onMouseWheel, this, true);
  },
  _unregisterEvent: function _unregisterEvent() {
    this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this, true);
    this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, true);
    this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this, true);
    this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, true);
    this.node.off(cc.Node.EventType.MOUSE_WHEEL, this._onMouseWheel, this, true);
  },
  _onMouseWheel: function _onMouseWheel(event, captureListeners) {
    if (!this.enabledInHierarchy) return;
    if (this._hasNestedViewGroup(event, captureListeners)) return;
    var deltaMove = cc.v2(0, 0);
    var wheelPrecision = -0.1;

    if (CC_JSB || CC_RUNTIME) {
      wheelPrecision = -7;
    }

    if (this.vertical) {
      deltaMove = cc.v2(0, event.getScrollY() * wheelPrecision);
    } else if (this.horizontal) {
      deltaMove = cc.v2(event.getScrollY() * wheelPrecision, 0);
    }

    this._mouseWheelEventElapsedTime = 0;

    this._processDeltaMove(deltaMove);

    if (!this._stopMouseWheel) {
      this._handlePressLogic();

      this.schedule(this._checkMouseWheel, 1.0 / 60);
      this._stopMouseWheel = true;
    }

    this._stopPropagationIfTargetIsMe(event);
  },
  _checkMouseWheel: function _checkMouseWheel(dt) {
    var currentOutOfBoundary = this._getHowMuchOutOfBoundary();

    var maxElapsedTime = 0.1;

    if (!currentOutOfBoundary.fuzzyEquals(cc.v2(0, 0), EPSILON)) {
      this._processInertiaScroll();

      this.unschedule(this._checkMouseWheel);

      this._dispatchEvent('scroll-ended');

      this._stopMouseWheel = false;
      return;
    }

    this._mouseWheelEventElapsedTime += dt; // mouse wheel event is ended

    if (this._mouseWheelEventElapsedTime > maxElapsedTime) {
      this._onScrollBarTouchEnded();

      this.unschedule(this._checkMouseWheel);

      this._dispatchEvent('scroll-ended');

      this._stopMouseWheel = false;
    }
  },
  _calculateMovePercentDelta: function _calculateMovePercentDelta(options) {
    var anchor = options.anchor;
    var applyToHorizontal = options.applyToHorizontal;
    var applyToVertical = options.applyToVertical;

    this._calculateBoundary();

    anchor = anchor.clampf(cc.v2(0, 0), cc.v2(1, 1));

    var scrollSize = this._view.getContentSize();

    var contentSize = this.content.getContentSize();

    var bottomDeta = this._getContentBottomBoundary() - this._bottomBoundary;

    bottomDeta = -bottomDeta;

    var leftDeta = this._getContentLeftBoundary() - this._leftBoundary;

    leftDeta = -leftDeta;
    var moveDelta = cc.v2(0, 0);
    var totalScrollDelta = 0;

    if (applyToHorizontal) {
      totalScrollDelta = contentSize.width - scrollSize.width;
      moveDelta.x = leftDeta - totalScrollDelta * anchor.x;
    }

    if (applyToVertical) {
      totalScrollDelta = contentSize.height - scrollSize.height;
      moveDelta.y = bottomDeta - totalScrollDelta * anchor.y;
    }

    return moveDelta;
  },
  _moveContentToTopLeft: function _moveContentToTopLeft(scrollViewSize) {
    var contentSize = this.content.getContentSize();

    var bottomDeta = this._getContentBottomBoundary() - this._bottomBoundary;

    bottomDeta = -bottomDeta;
    var moveDelta = cc.v2(0, 0);
    var totalScrollDelta = 0;

    var leftDeta = this._getContentLeftBoundary() - this._leftBoundary;

    leftDeta = -leftDeta;

    if (contentSize.height < scrollViewSize.height) {
      totalScrollDelta = contentSize.height - scrollViewSize.height;
      moveDelta.y = bottomDeta - totalScrollDelta;
    }

    if (contentSize.width < scrollViewSize.width) {
      totalScrollDelta = contentSize.width - scrollViewSize.width;
      moveDelta.x = leftDeta;
    }

    this._updateScrollBarState();

    this._moveContent(moveDelta);

    this._adjustContentOutOfBoundary();
  },
  _calculateBoundary: function _calculateBoundary() {
    if (this.content) {
      //refresh content size
      var layout = this.content.getComponent(cc.Layout);

      if (layout && layout.enabledInHierarchy) {
        layout.updateLayout();
      }

      var viewSize = this._view.getContentSize();

      var anchorX = viewSize.width * this._view.anchorX;
      var anchorY = viewSize.height * this._view.anchorY;
      this._leftBoundary = -anchorX;
      this._bottomBoundary = -anchorY;
      this._rightBoundary = this._leftBoundary + viewSize.width;
      this._topBoundary = this._bottomBoundary + viewSize.height;

      this._moveContentToTopLeft(viewSize);
    }
  },
  //this is for nested scrollview
  _hasNestedViewGroup: function _hasNestedViewGroup(event, captureListeners) {
    if (event.eventPhase !== cc.Event.CAPTURING_PHASE) return;

    if (captureListeners) {
      //captureListeners are arranged from child to parent
      for (var i = 0; i < captureListeners.length; ++i) {
        var item = captureListeners[i];

        if (this.node === item) {
          if (event.target.getComponent(cc.ViewGroup)) {
            return true;
          }

          return false;
        }

        if (item.getComponent(cc.ViewGroup)) {
          return true;
        }
      }
    }

    return false;
  },
  //This is for Scrollview as children of a Button
  _stopPropagationIfTargetIsMe: function _stopPropagationIfTargetIsMe(event) {
    if (event.eventPhase === cc.Event.AT_TARGET && event.target === this.node) {
      event.stopPropagation();
    }
  },
  // touch event handler
  _onTouchBegan: function _onTouchBegan(event, captureListeners) {
    if (!this.enabledInHierarchy) return;
    if (this._hasNestedViewGroup(event, captureListeners)) return;
    var touch = event.touch;

    if (this.content) {
      this._handlePressLogic(touch);
    }

    this._touchMoved = false;

    this._stopPropagationIfTargetIsMe(event);
  },
  _onTouchMoved: function _onTouchMoved(event, captureListeners) {
    if (!this.enabledInHierarchy) return;
    if (this._hasNestedViewGroup(event, captureListeners)) return;
    var touch = event.touch;

    if (this.content) {
      this._handleMoveLogic(touch);
    } // Do not prevent touch events in inner nodes


    if (!this.cancelInnerEvents) {
      return;
    }

    var deltaMove = touch.getLocation().sub(touch.getStartLocation()); //FIXME: touch move delta should be calculated by DPI.

    if (deltaMove.mag() > 7) {
      if (!this._touchMoved && event.target !== this.node) {
        // Simulate touch cancel for target node
        var cancelEvent = new cc.Event.EventTouch(event.getTouches(), event.bubbles);
        cancelEvent.type = cc.Node.EventType.TOUCH_CANCEL;
        cancelEvent.touch = event.touch;
        cancelEvent.simulate = true;
        event.target.dispatchEvent(cancelEvent);
        this._touchMoved = true;
      }
    }

    this._stopPropagationIfTargetIsMe(event);
  },
  _onTouchEnded: function _onTouchEnded(event, captureListeners) {
    if (!this.enabledInHierarchy) return;
    if (this._hasNestedViewGroup(event, captureListeners)) return;

    this._dispatchEvent('touch-up');

    var touch = event.touch;

    if (this.content) {
      this._handleReleaseLogic(touch);
    }

    if (this._touchMoved) {
      event.stopPropagation();
    } else {
      this._stopPropagationIfTargetIsMe(event);
    }
  },
  _onTouchCancelled: function _onTouchCancelled(event, captureListeners) {
    if (!this.enabledInHierarchy) return;
    if (this._hasNestedViewGroup(event, captureListeners)) return; // Filte touch cancel event send from self

    if (!event.simulate) {
      var touch = event.touch;

      if (this.content) {
        this._handleReleaseLogic(touch);
      }
    }

    this._stopPropagationIfTargetIsMe(event);
  },
  _processDeltaMove: function _processDeltaMove(deltaMove) {
    this._scrollChildren(deltaMove);

    this._gatherTouchMove(deltaMove);
  },
  // Contains node angle calculations
  _getLocalAxisAlignDelta: function _getLocalAxisAlignDelta(touch) {
    this.node.convertToNodeSpaceAR(touch.getLocation(), _tempPoint);
    this.node.convertToNodeSpaceAR(touch.getPreviousLocation(), _tempPrevPoint);
    return _tempPoint.sub(_tempPrevPoint);
  },
  _handleMoveLogic: function _handleMoveLogic(touch) {
    var deltaMove = this._getLocalAxisAlignDelta(touch);

    this._processDeltaMove(deltaMove);
  },
  _scrollChildren: function _scrollChildren(deltaMove) {
    deltaMove = this._clampDelta(deltaMove);
    var realMove = deltaMove;
    var outOfBoundary;

    if (this.elastic) {
      outOfBoundary = this._getHowMuchOutOfBoundary();
      realMove.x *= outOfBoundary.x === 0 ? 1 : 0.5;
      realMove.y *= outOfBoundary.y === 0 ? 1 : 0.5;
    }

    if (!this.elastic) {
      outOfBoundary = this._getHowMuchOutOfBoundary(realMove);
      realMove = realMove.add(outOfBoundary);
    }

    var scrollEventType = -1;

    if (realMove.y > 0) {
      //up
      var icBottomPos = this.content.y - this.content.anchorY * this.content.height;

      if (icBottomPos + realMove.y >= this._bottomBoundary) {
        scrollEventType = 'scroll-to-bottom';
      }
    } else if (realMove.y < 0) {
      //down
      var icTopPos = this.content.y - this.content.anchorY * this.content.height + this.content.height;

      if (icTopPos + realMove.y <= this._topBoundary) {
        scrollEventType = 'scroll-to-top';
      }
    }

    if (realMove.x < 0) {
      //left
      var icRightPos = this.content.x - this.content.anchorX * this.content.width + this.content.width;

      if (icRightPos + realMove.x <= this._rightBoundary) {
        scrollEventType = 'scroll-to-right';
      }
    } else if (realMove.x > 0) {
      //right
      var icLeftPos = this.content.x - this.content.anchorX * this.content.width;

      if (icLeftPos + realMove.x >= this._leftBoundary) {
        scrollEventType = 'scroll-to-left';
      }
    }

    this._moveContent(realMove, false);

    if (realMove.x !== 0 || realMove.y !== 0) {
      if (!this._scrolling) {
        this._scrolling = true;

        this._dispatchEvent('scroll-began');
      }

      this._dispatchEvent('scrolling');
    }

    if (scrollEventType !== -1) {
      this._dispatchEvent(scrollEventType);
    }
  },
  _handlePressLogic: function _handlePressLogic() {
    if (this._autoScrolling) {
      this._dispatchEvent('scroll-ended');
    }

    this._autoScrolling = false;
    this._isBouncing = false;
    this._touchMovePreviousTimestamp = getTimeInMilliseconds();
    this._touchMoveDisplacements.length = 0;
    this._touchMoveTimeDeltas.length = 0;

    this._onScrollBarTouchBegan();
  },
  _clampDelta: function _clampDelta(delta) {
    var contentSize = this.content.getContentSize();

    var scrollViewSize = this._view.getContentSize();

    if (contentSize.width < scrollViewSize.width) {
      delta.x = 0;
    }

    if (contentSize.height < scrollViewSize.height) {
      delta.y = 0;
    }

    return delta;
  },
  _gatherTouchMove: function _gatherTouchMove(delta) {
    delta = this._clampDelta(delta);

    while (this._touchMoveDisplacements.length >= NUMBER_OF_GATHERED_TOUCHES_FOR_MOVE_SPEED) {
      this._touchMoveDisplacements.shift();

      this._touchMoveTimeDeltas.shift();
    }

    this._touchMoveDisplacements.push(delta);

    var timeStamp = getTimeInMilliseconds();

    this._touchMoveTimeDeltas.push((timeStamp - this._touchMovePreviousTimestamp) / 1000);

    this._touchMovePreviousTimestamp = timeStamp;
  },
  _startBounceBackIfNeeded: function _startBounceBackIfNeeded() {
    if (!this.elastic) {
      return false;
    }

    var bounceBackAmount = this._getHowMuchOutOfBoundary();

    bounceBackAmount = this._clampDelta(bounceBackAmount);

    if (bounceBackAmount.fuzzyEquals(cc.v2(0, 0), EPSILON)) {
      return false;
    }

    var bounceBackTime = Math.max(this.bounceDuration, 0);

    this._startAutoScroll(bounceBackAmount, bounceBackTime, true);

    if (!this._isBouncing) {
      if (bounceBackAmount.y > 0) this._dispatchEvent('bounce-top');
      if (bounceBackAmount.y < 0) this._dispatchEvent('bounce-bottom');
      if (bounceBackAmount.x > 0) this._dispatchEvent('bounce-right');
      if (bounceBackAmount.x < 0) this._dispatchEvent('bounce-left');
      this._isBouncing = true;
    }

    return true;
  },
  _processInertiaScroll: function _processInertiaScroll() {
    var bounceBackStarted = this._startBounceBackIfNeeded();

    if (!bounceBackStarted && this.inertia) {
      var touchMoveVelocity = this._calculateTouchMoveVelocity();

      if (!touchMoveVelocity.fuzzyEquals(cc.v2(0, 0), EPSILON) && this.brake < 1) {
        this._startInertiaScroll(touchMoveVelocity);
      }
    }

    this._onScrollBarTouchEnded();
  },
  _handleReleaseLogic: function _handleReleaseLogic(touch) {
    var delta = this._getLocalAxisAlignDelta(touch);

    this._gatherTouchMove(delta);

    this._processInertiaScroll();

    if (this._scrolling) {
      this._scrolling = false;

      if (!this._autoScrolling) {
        this._dispatchEvent('scroll-ended');
      }
    }
  },
  _isOutOfBoundary: function _isOutOfBoundary() {
    var outOfBoundary = this._getHowMuchOutOfBoundary();

    return !outOfBoundary.fuzzyEquals(cc.v2(0, 0), EPSILON);
  },
  _isNecessaryAutoScrollBrake: function _isNecessaryAutoScrollBrake() {
    if (this._autoScrollBraking) {
      return true;
    }

    if (this._isOutOfBoundary()) {
      if (!this._autoScrollCurrentlyOutOfBoundary) {
        this._autoScrollCurrentlyOutOfBoundary = true;
        this._autoScrollBraking = true;
        this._autoScrollBrakingStartPosition = this.getContentPosition();
        return true;
      }
    } else {
      this._autoScrollCurrentlyOutOfBoundary = false;
    }

    return false;
  },
  getScrollEndedEventTiming: function getScrollEndedEventTiming() {
    return EPSILON;
  },
  _processAutoScrolling: function _processAutoScrolling(dt) {
    var isAutoScrollBrake = this._isNecessaryAutoScrollBrake();

    var brakingFactor = isAutoScrollBrake ? OUT_OF_BOUNDARY_BREAKING_FACTOR : 1;
    this._autoScrollAccumulatedTime += dt * (1 / brakingFactor);
    var percentage = Math.min(1, this._autoScrollAccumulatedTime / this._autoScrollTotalTime);

    if (this._autoScrollAttenuate) {
      percentage = quintEaseOut(percentage);
    }

    var newPosition = this._autoScrollStartPosition.add(this._autoScrollTargetDelta.mul(percentage));

    var reachedEnd = Math.abs(percentage - 1) <= EPSILON;
    var fireEvent = Math.abs(percentage - 1) <= this.getScrollEndedEventTiming();

    if (fireEvent && !this._isScrollEndedWithThresholdEventFired) {
      this._dispatchEvent('scroll-ended-with-threshold');

      this._isScrollEndedWithThresholdEventFired = true;
    }

    if (this.elastic) {
      var brakeOffsetPosition = newPosition.sub(this._autoScrollBrakingStartPosition);

      if (isAutoScrollBrake) {
        brakeOffsetPosition = brakeOffsetPosition.mul(brakingFactor);
      }

      newPosition = this._autoScrollBrakingStartPosition.add(brakeOffsetPosition);
    } else {
      var moveDelta = newPosition.sub(this.getContentPosition());

      var outOfBoundary = this._getHowMuchOutOfBoundary(moveDelta);

      if (!outOfBoundary.fuzzyEquals(cc.v2(0, 0), EPSILON)) {
        newPosition = newPosition.add(outOfBoundary);
        reachedEnd = true;
      }
    }

    if (reachedEnd) {
      this._autoScrolling = false;
    }

    var deltaMove = newPosition.sub(this.getContentPosition());

    this._moveContent(this._clampDelta(deltaMove), reachedEnd);

    this._dispatchEvent('scrolling'); // scollTo API controll move


    if (!this._autoScrolling) {
      this._isBouncing = false;
      this._scrolling = false;

      this._dispatchEvent('scroll-ended');
    }
  },
  _startInertiaScroll: function _startInertiaScroll(touchMoveVelocity) {
    var inertiaTotalMovement = touchMoveVelocity.mul(MOVEMENT_FACTOR);

    this._startAttenuatingAutoScroll(inertiaTotalMovement, touchMoveVelocity);
  },
  _calculateAttenuatedFactor: function _calculateAttenuatedFactor(distance) {
    if (this.brake <= 0) {
      return 1 - this.brake;
    } //attenuate formula from: http://learnopengl.com/#!Lighting/Light-casters


    return (1 - this.brake) * (1 / (1 + distance * 0.000014 + distance * distance * 0.000000008));
  },
  _startAttenuatingAutoScroll: function _startAttenuatingAutoScroll(deltaMove, initialVelocity) {
    var time = this._calculateAutoScrollTimeByInitalSpeed(initialVelocity.mag());

    var targetDelta = deltaMove.normalize();
    var contentSize = this.content.getContentSize();

    var scrollviewSize = this._view.getContentSize();

    var totalMoveWidth = contentSize.width - scrollviewSize.width;
    var totalMoveHeight = contentSize.height - scrollviewSize.height;

    var attenuatedFactorX = this._calculateAttenuatedFactor(totalMoveWidth);

    var attenuatedFactorY = this._calculateAttenuatedFactor(totalMoveHeight);

    targetDelta = cc.v2(targetDelta.x * totalMoveWidth * (1 - this.brake) * attenuatedFactorX, targetDelta.y * totalMoveHeight * attenuatedFactorY * (1 - this.brake));
    var originalMoveLength = deltaMove.mag();
    var factor = targetDelta.mag() / originalMoveLength;
    targetDelta = targetDelta.add(deltaMove);

    if (this.brake > 0 && factor > 7) {
      factor = Math.sqrt(factor);
      targetDelta = deltaMove.mul(factor).add(deltaMove);
    }

    if (this.brake > 0 && factor > 3) {
      factor = 3;
      time = time * factor;
    }

    if (this.brake === 0 && factor > 1) {
      time = time * factor;
    }

    this._startAutoScroll(targetDelta, time, true);
  },
  _calculateAutoScrollTimeByInitalSpeed: function _calculateAutoScrollTimeByInitalSpeed(initalSpeed) {
    return Math.sqrt(Math.sqrt(initalSpeed / 5));
  },
  _startAutoScroll: function _startAutoScroll(deltaMove, timeInSecond, attenuated) {
    var adjustedDeltaMove = this._flattenVectorByDirection(deltaMove);

    this._autoScrolling = true;
    this._autoScrollTargetDelta = adjustedDeltaMove;
    this._autoScrollAttenuate = attenuated;
    this._autoScrollStartPosition = this.getContentPosition();
    this._autoScrollTotalTime = timeInSecond;
    this._autoScrollAccumulatedTime = 0;
    this._autoScrollBraking = false;
    this._isScrollEndedWithThresholdEventFired = false;
    this._autoScrollBrakingStartPosition = cc.v2(0, 0);

    var currentOutOfBoundary = this._getHowMuchOutOfBoundary();

    if (!currentOutOfBoundary.fuzzyEquals(cc.v2(0, 0), EPSILON)) {
      this._autoScrollCurrentlyOutOfBoundary = true;
    }
  },
  _calculateTouchMoveVelocity: function _calculateTouchMoveVelocity() {
    var totalTime = 0;
    totalTime = this._touchMoveTimeDeltas.reduce(function (a, b) {
      return a + b;
    }, totalTime);

    if (totalTime <= 0 || totalTime >= 0.5) {
      return cc.v2(0, 0);
    }

    var totalMovement = cc.v2(0, 0);
    totalMovement = this._touchMoveDisplacements.reduce(function (a, b) {
      return a.add(b);
    }, totalMovement);
    return cc.v2(totalMovement.x * (1 - this.brake) / totalTime, totalMovement.y * (1 - this.brake) / totalTime);
  },
  _flattenVectorByDirection: function _flattenVectorByDirection(vector) {
    var result = vector;
    result.x = this.horizontal ? result.x : 0;
    result.y = this.vertical ? result.y : 0;
    return result;
  },
  _moveContent: function _moveContent(deltaMove, canStartBounceBack) {
    var adjustedMove = this._flattenVectorByDirection(deltaMove);

    var newPosition = this.getContentPosition().add(adjustedMove);
    this.setContentPosition(newPosition);

    var outOfBoundary = this._getHowMuchOutOfBoundary();

    this._updateScrollBar(outOfBoundary);

    if (this.elastic && canStartBounceBack) {
      this._startBounceBackIfNeeded();
    }
  },
  _getContentLeftBoundary: function _getContentLeftBoundary() {
    var contentPos = this.getContentPosition();
    return contentPos.x - this.content.getAnchorPoint().x * this.content.getContentSize().width;
  },
  _getContentRightBoundary: function _getContentRightBoundary() {
    var contentSize = this.content.getContentSize();
    return this._getContentLeftBoundary() + contentSize.width;
  },
  _getContentTopBoundary: function _getContentTopBoundary() {
    var contentSize = this.content.getContentSize();
    return this._getContentBottomBoundary() + contentSize.height;
  },
  _getContentBottomBoundary: function _getContentBottomBoundary() {
    var contentPos = this.getContentPosition();
    return contentPos.y - this.content.getAnchorPoint().y * this.content.getContentSize().height;
  },
  _getHowMuchOutOfBoundary: function _getHowMuchOutOfBoundary(addition) {
    addition = addition || cc.v2(0, 0);

    if (addition.fuzzyEquals(cc.v2(0, 0), EPSILON) && !this._outOfBoundaryAmountDirty) {
      return this._outOfBoundaryAmount;
    }

    var outOfBoundaryAmount = cc.v2(0, 0);

    if (this._getContentLeftBoundary() + addition.x > this._leftBoundary) {
      outOfBoundaryAmount.x = this._leftBoundary - (this._getContentLeftBoundary() + addition.x);
    } else if (this._getContentRightBoundary() + addition.x < this._rightBoundary) {
      outOfBoundaryAmount.x = this._rightBoundary - (this._getContentRightBoundary() + addition.x);
    }

    if (this._getContentTopBoundary() + addition.y < this._topBoundary) {
      outOfBoundaryAmount.y = this._topBoundary - (this._getContentTopBoundary() + addition.y);
    } else if (this._getContentBottomBoundary() + addition.y > this._bottomBoundary) {
      outOfBoundaryAmount.y = this._bottomBoundary - (this._getContentBottomBoundary() + addition.y);
    }

    if (addition.fuzzyEquals(cc.v2(0, 0), EPSILON)) {
      this._outOfBoundaryAmount = outOfBoundaryAmount;
      this._outOfBoundaryAmountDirty = false;
    }

    outOfBoundaryAmount = this._clampDelta(outOfBoundaryAmount);
    return outOfBoundaryAmount;
  },
  _updateScrollBarState: function _updateScrollBarState() {
    if (!this.content) {
      return;
    }

    var contentSize = this.content.getContentSize();

    var scrollViewSize = this._view.getContentSize();

    if (this.verticalScrollBar) {
      if (contentSize.height < scrollViewSize.height) {
        this.verticalScrollBar.hide();
      } else {
        this.verticalScrollBar.show();
      }
    }

    if (this.horizontalScrollBar) {
      if (contentSize.width < scrollViewSize.width) {
        this.horizontalScrollBar.hide();
      } else {
        this.horizontalScrollBar.show();
      }
    }
  },
  _updateScrollBar: function _updateScrollBar(outOfBoundary) {
    if (this.horizontalScrollBar) {
      this.horizontalScrollBar._onScroll(outOfBoundary);
    }

    if (this.verticalScrollBar) {
      this.verticalScrollBar._onScroll(outOfBoundary);
    }
  },
  _onScrollBarTouchBegan: function _onScrollBarTouchBegan() {
    if (this.horizontalScrollBar) {
      this.horizontalScrollBar._onTouchBegan();
    }

    if (this.verticalScrollBar) {
      this.verticalScrollBar._onTouchBegan();
    }
  },
  _onScrollBarTouchEnded: function _onScrollBarTouchEnded() {
    if (this.horizontalScrollBar) {
      this.horizontalScrollBar._onTouchEnded();
    }

    if (this.verticalScrollBar) {
      this.verticalScrollBar._onTouchEnded();
    }
  },
  _dispatchEvent: function _dispatchEvent(event) {
    if (event === 'scroll-ended') {
      this._scrollEventEmitMask = 0;
    } else if (event === 'scroll-to-top' || event === 'scroll-to-bottom' || event === 'scroll-to-left' || event === 'scroll-to-right') {
      var flag = 1 << eventMap[event];

      if (this._scrollEventEmitMask & flag) {
        return;
      } else {
        this._scrollEventEmitMask |= flag;
      }
    }

    cc.Component.EventHandler.emitEvents(this.scrollEvents, this, eventMap[event]);
    this.node.emit(event, this);
  },
  _adjustContentOutOfBoundary: function _adjustContentOutOfBoundary() {
    this._outOfBoundaryAmountDirty = true;

    if (this._isOutOfBoundary()) {
      var outOfBoundary = this._getHowMuchOutOfBoundary(cc.v2(0, 0));

      var newPosition = this.getContentPosition().add(outOfBoundary);

      if (this.content) {
        this.content.setPosition(newPosition);

        this._updateScrollBar(0);
      }
    }
  },
  start: function start() {
    this._calculateBoundary(); //Because widget component will adjust content position and scrollview position is correct after visit
    //So this event could make sure the content is on the correct position after loading.


    if (this.content) {
      cc.director.once(cc.Director.EVENT_BEFORE_DRAW, this._adjustContentOutOfBoundary, this);
    }
  },
  _hideScrollbar: function _hideScrollbar() {
    if (this.horizontalScrollBar) {
      this.horizontalScrollBar.hide();
    }

    if (this.verticalScrollBar) {
      this.verticalScrollBar.hide();
    }
  },
  onDisable: function onDisable() {
    if (!CC_EDITOR) {
      this._unregisterEvent();

      if (this.content) {
        this.content.off(NodeEvent.SIZE_CHANGED, this._calculateBoundary, this);
        this.content.off(NodeEvent.SCALE_CHANGED, this._calculateBoundary, this);

        if (this._view) {
          this._view.off(NodeEvent.POSITION_CHANGED, this._calculateBoundary, this);

          this._view.off(NodeEvent.SCALE_CHANGED, this._calculateBoundary, this);

          this._view.off(NodeEvent.SIZE_CHANGED, this._calculateBoundary, this);
        }
      }
    }

    this._hideScrollbar();

    this.stopAutoScroll();
  },
  onEnable: function onEnable() {
    if (!CC_EDITOR) {
      this._registerEvent();

      if (this.content) {
        this.content.on(NodeEvent.SIZE_CHANGED, this._calculateBoundary, this);
        this.content.on(NodeEvent.SCALE_CHANGED, this._calculateBoundary, this);

        if (this._view) {
          this._view.on(NodeEvent.POSITION_CHANGED, this._calculateBoundary, this);

          this._view.on(NodeEvent.SCALE_CHANGED, this._calculateBoundary, this);

          this._view.on(NodeEvent.SIZE_CHANGED, this._calculateBoundary, this);
        }
      }
    }

    this._updateScrollBarState();
  },
  update: function update(dt) {
    if (this._autoScrolling) {
      this._processAutoScrolling(dt);
    }
  }
});
cc.ScrollView = module.exports = ScrollView;
/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event scroll-to-top
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event scroll-to-bottom
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event scroll-to-left
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event scroll-to-right
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event scrolling
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event bounce-bottom
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event bounce-top
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event bounce-left
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event bounce-right
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event scroll-ended
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event touch-up
 * @param {Event.EventCustom} event
 * @param {ScrollView} scrollView - The ScrollView component.
 */

/**
* !#en
* Note: This event is emitted from the node to which the component belongs.
* !#zh
* 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
* @event scroll-began
* @param {Event.EventCustom} event
* @param {ScrollView} scrollView - The ScrollView component.
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDU2Nyb2xsVmlldy5qcyJdLCJuYW1lcyI6WyJOb2RlRXZlbnQiLCJyZXF1aXJlIiwiRXZlbnRUeXBlIiwiTlVNQkVSX09GX0dBVEhFUkVEX1RPVUNIRVNfRk9SX01PVkVfU1BFRUQiLCJPVVRfT0ZfQk9VTkRBUllfQlJFQUtJTkdfRkFDVE9SIiwiRVBTSUxPTiIsIk1PVkVNRU5UX0ZBQ1RPUiIsIl90ZW1wUG9pbnQiLCJjYyIsInYyIiwiX3RlbXBQcmV2UG9pbnQiLCJxdWludEVhc2VPdXQiLCJ0aW1lIiwiZ2V0VGltZUluTWlsbGlzZWNvbmRzIiwiY3VycmVudFRpbWUiLCJEYXRlIiwiZ2V0TWlsbGlzZWNvbmRzIiwiRW51bSIsIlNDUk9MTF9UT19UT1AiLCJTQ1JPTExfVE9fQk9UVE9NIiwiU0NST0xMX1RPX0xFRlQiLCJTQ1JPTExfVE9fUklHSFQiLCJTQ1JPTExJTkciLCJCT1VOQ0VfVE9QIiwiQk9VTkNFX0JPVFRPTSIsIkJPVU5DRV9MRUZUIiwiQk9VTkNFX1JJR0hUIiwiU0NST0xMX0VOREVEIiwiVE9VQ0hfVVAiLCJBVVRPU0NST0xMX0VOREVEX1dJVEhfVEhSRVNIT0xEIiwiU0NST0xMX0JFR0FOIiwiZXZlbnRNYXAiLCJTY3JvbGxWaWV3IiwiQ2xhc3MiLCJuYW1lIiwiZWRpdG9yIiwiQ0NfRURJVE9SIiwibWVudSIsImhlbHAiLCJpbnNwZWN0b3IiLCJleGVjdXRlSW5FZGl0TW9kZSIsImN0b3IiLCJfdG9wQm91bmRhcnkiLCJfYm90dG9tQm91bmRhcnkiLCJfbGVmdEJvdW5kYXJ5IiwiX3JpZ2h0Qm91bmRhcnkiLCJfdG91Y2hNb3ZlRGlzcGxhY2VtZW50cyIsIl90b3VjaE1vdmVUaW1lRGVsdGFzIiwiX3RvdWNoTW92ZVByZXZpb3VzVGltZXN0YW1wIiwiX3RvdWNoTW92ZWQiLCJfYXV0b1Njcm9sbGluZyIsIl9hdXRvU2Nyb2xsQXR0ZW51YXRlIiwiX2F1dG9TY3JvbGxTdGFydFBvc2l0aW9uIiwiX2F1dG9TY3JvbGxUYXJnZXREZWx0YSIsIl9hdXRvU2Nyb2xsVG90YWxUaW1lIiwiX2F1dG9TY3JvbGxBY2N1bXVsYXRlZFRpbWUiLCJfYXV0b1Njcm9sbEN1cnJlbnRseU91dE9mQm91bmRhcnkiLCJfYXV0b1Njcm9sbEJyYWtpbmciLCJfYXV0b1Njcm9sbEJyYWtpbmdTdGFydFBvc2l0aW9uIiwiX291dE9mQm91bmRhcnlBbW91bnQiLCJfb3V0T2ZCb3VuZGFyeUFtb3VudERpcnR5IiwiX3N0b3BNb3VzZVdoZWVsIiwiX21vdXNlV2hlZWxFdmVudEVsYXBzZWRUaW1lIiwiX2lzU2Nyb2xsRW5kZWRXaXRoVGhyZXNob2xkRXZlbnRGaXJlZCIsIl9zY3JvbGxFdmVudEVtaXRNYXNrIiwiX2lzQm91bmNpbmciLCJfc2Nyb2xsaW5nIiwicHJvcGVydGllcyIsImNvbnRlbnQiLCJ1bmRlZmluZWQiLCJ0eXBlIiwiTm9kZSIsInRvb2x0aXAiLCJDQ19ERVYiLCJmb3JtZXJseVNlcmlhbGl6ZWRBcyIsIm5vdGlmeSIsIm9sZFZhbHVlIiwiX2NhbGN1bGF0ZUJvdW5kYXJ5IiwiaG9yaXpvbnRhbCIsImFuaW1hdGFibGUiLCJ2ZXJ0aWNhbCIsImluZXJ0aWEiLCJicmFrZSIsIkZsb2F0IiwicmFuZ2UiLCJlbGFzdGljIiwiYm91bmNlRHVyYXRpb24iLCJob3Jpem9udGFsU2Nyb2xsQmFyIiwiU2Nyb2xsYmFyIiwic2V0VGFyZ2V0U2Nyb2xsVmlldyIsIl91cGRhdGVTY3JvbGxCYXIiLCJ2ZXJ0aWNhbFNjcm9sbEJhciIsInNjcm9sbEV2ZW50cyIsIkNvbXBvbmVudCIsIkV2ZW50SGFuZGxlciIsImNhbmNlbElubmVyRXZlbnRzIiwiX3ZpZXciLCJnZXQiLCJwYXJlbnQiLCJzdGF0aWNzIiwic2Nyb2xsVG9Cb3R0b20iLCJ0aW1lSW5TZWNvbmQiLCJhdHRlbnVhdGVkIiwibW92ZURlbHRhIiwiX2NhbGN1bGF0ZU1vdmVQZXJjZW50RGVsdGEiLCJhbmNob3IiLCJhcHBseVRvSG9yaXpvbnRhbCIsImFwcGx5VG9WZXJ0aWNhbCIsIl9zdGFydEF1dG9TY3JvbGwiLCJfbW92ZUNvbnRlbnQiLCJzY3JvbGxUb1RvcCIsInNjcm9sbFRvTGVmdCIsInNjcm9sbFRvUmlnaHQiLCJzY3JvbGxUb1RvcExlZnQiLCJzY3JvbGxUb1RvcFJpZ2h0Iiwic2Nyb2xsVG9Cb3R0b21MZWZ0Iiwic2Nyb2xsVG9Cb3R0b21SaWdodCIsInNjcm9sbFRvT2Zmc2V0Iiwib2Zmc2V0IiwibWF4U2Nyb2xsT2Zmc2V0IiwiZ2V0TWF4U2Nyb2xsT2Zmc2V0IiwieCIsInkiLCJzY3JvbGxUbyIsImdldFNjcm9sbE9mZnNldCIsInRvcERlbHRhIiwiX2dldENvbnRlbnRUb3BCb3VuZGFyeSIsImxlZnREZXRhIiwiX2dldENvbnRlbnRMZWZ0Qm91bmRhcnkiLCJ2aWV3U2l6ZSIsImdldENvbnRlbnRTaXplIiwiY29udGVudFNpemUiLCJob3Jpem9udGFsTWF4aW1pemVPZmZzZXQiLCJ3aWR0aCIsInZlcnRpY2FsTWF4aW1pemVPZmZzZXQiLCJoZWlnaHQiLCJzY3JvbGxUb1BlcmNlbnRIb3Jpem9udGFsIiwicGVyY2VudCIsInNjcm9sbFRvUGVyY2VudFZlcnRpY2FsIiwic3RvcEF1dG9TY3JvbGwiLCJzZXRDb250ZW50UG9zaXRpb24iLCJwb3NpdGlvbiIsImZ1enp5RXF1YWxzIiwiZ2V0Q29udGVudFBvc2l0aW9uIiwic2V0UG9zaXRpb24iLCJnZXRQb3NpdGlvbiIsImlzU2Nyb2xsaW5nIiwiaXNBdXRvU2Nyb2xsaW5nIiwiX3JlZ2lzdGVyRXZlbnQiLCJub2RlIiwib24iLCJUT1VDSF9TVEFSVCIsIl9vblRvdWNoQmVnYW4iLCJUT1VDSF9NT1ZFIiwiX29uVG91Y2hNb3ZlZCIsIlRPVUNIX0VORCIsIl9vblRvdWNoRW5kZWQiLCJUT1VDSF9DQU5DRUwiLCJfb25Ub3VjaENhbmNlbGxlZCIsIk1PVVNFX1dIRUVMIiwiX29uTW91c2VXaGVlbCIsIl91bnJlZ2lzdGVyRXZlbnQiLCJvZmYiLCJldmVudCIsImNhcHR1cmVMaXN0ZW5lcnMiLCJlbmFibGVkSW5IaWVyYXJjaHkiLCJfaGFzTmVzdGVkVmlld0dyb3VwIiwiZGVsdGFNb3ZlIiwid2hlZWxQcmVjaXNpb24iLCJDQ19KU0IiLCJDQ19SVU5USU1FIiwiZ2V0U2Nyb2xsWSIsIl9wcm9jZXNzRGVsdGFNb3ZlIiwiX2hhbmRsZVByZXNzTG9naWMiLCJzY2hlZHVsZSIsIl9jaGVja01vdXNlV2hlZWwiLCJfc3RvcFByb3BhZ2F0aW9uSWZUYXJnZXRJc01lIiwiZHQiLCJjdXJyZW50T3V0T2ZCb3VuZGFyeSIsIl9nZXRIb3dNdWNoT3V0T2ZCb3VuZGFyeSIsIm1heEVsYXBzZWRUaW1lIiwiX3Byb2Nlc3NJbmVydGlhU2Nyb2xsIiwidW5zY2hlZHVsZSIsIl9kaXNwYXRjaEV2ZW50IiwiX29uU2Nyb2xsQmFyVG91Y2hFbmRlZCIsIm9wdGlvbnMiLCJjbGFtcGYiLCJzY3JvbGxTaXplIiwiYm90dG9tRGV0YSIsIl9nZXRDb250ZW50Qm90dG9tQm91bmRhcnkiLCJ0b3RhbFNjcm9sbERlbHRhIiwiX21vdmVDb250ZW50VG9Ub3BMZWZ0Iiwic2Nyb2xsVmlld1NpemUiLCJfdXBkYXRlU2Nyb2xsQmFyU3RhdGUiLCJfYWRqdXN0Q29udGVudE91dE9mQm91bmRhcnkiLCJsYXlvdXQiLCJnZXRDb21wb25lbnQiLCJMYXlvdXQiLCJ1cGRhdGVMYXlvdXQiLCJhbmNob3JYIiwiYW5jaG9yWSIsImV2ZW50UGhhc2UiLCJFdmVudCIsIkNBUFRVUklOR19QSEFTRSIsImkiLCJsZW5ndGgiLCJpdGVtIiwidGFyZ2V0IiwiVmlld0dyb3VwIiwiQVRfVEFSR0VUIiwic3RvcFByb3BhZ2F0aW9uIiwidG91Y2giLCJfaGFuZGxlTW92ZUxvZ2ljIiwiZ2V0TG9jYXRpb24iLCJzdWIiLCJnZXRTdGFydExvY2F0aW9uIiwibWFnIiwiY2FuY2VsRXZlbnQiLCJFdmVudFRvdWNoIiwiZ2V0VG91Y2hlcyIsImJ1YmJsZXMiLCJzaW11bGF0ZSIsImRpc3BhdGNoRXZlbnQiLCJfaGFuZGxlUmVsZWFzZUxvZ2ljIiwiX3Njcm9sbENoaWxkcmVuIiwiX2dhdGhlclRvdWNoTW92ZSIsIl9nZXRMb2NhbEF4aXNBbGlnbkRlbHRhIiwiY29udmVydFRvTm9kZVNwYWNlQVIiLCJnZXRQcmV2aW91c0xvY2F0aW9uIiwiX2NsYW1wRGVsdGEiLCJyZWFsTW92ZSIsIm91dE9mQm91bmRhcnkiLCJhZGQiLCJzY3JvbGxFdmVudFR5cGUiLCJpY0JvdHRvbVBvcyIsImljVG9wUG9zIiwiaWNSaWdodFBvcyIsImljTGVmdFBvcyIsIl9vblNjcm9sbEJhclRvdWNoQmVnYW4iLCJkZWx0YSIsInNoaWZ0IiwicHVzaCIsInRpbWVTdGFtcCIsIl9zdGFydEJvdW5jZUJhY2tJZk5lZWRlZCIsImJvdW5jZUJhY2tBbW91bnQiLCJib3VuY2VCYWNrVGltZSIsIk1hdGgiLCJtYXgiLCJib3VuY2VCYWNrU3RhcnRlZCIsInRvdWNoTW92ZVZlbG9jaXR5IiwiX2NhbGN1bGF0ZVRvdWNoTW92ZVZlbG9jaXR5IiwiX3N0YXJ0SW5lcnRpYVNjcm9sbCIsIl9pc091dE9mQm91bmRhcnkiLCJfaXNOZWNlc3NhcnlBdXRvU2Nyb2xsQnJha2UiLCJnZXRTY3JvbGxFbmRlZEV2ZW50VGltaW5nIiwiX3Byb2Nlc3NBdXRvU2Nyb2xsaW5nIiwiaXNBdXRvU2Nyb2xsQnJha2UiLCJicmFraW5nRmFjdG9yIiwicGVyY2VudGFnZSIsIm1pbiIsIm5ld1Bvc2l0aW9uIiwibXVsIiwicmVhY2hlZEVuZCIsImFicyIsImZpcmVFdmVudCIsImJyYWtlT2Zmc2V0UG9zaXRpb24iLCJpbmVydGlhVG90YWxNb3ZlbWVudCIsIl9zdGFydEF0dGVudWF0aW5nQXV0b1Njcm9sbCIsIl9jYWxjdWxhdGVBdHRlbnVhdGVkRmFjdG9yIiwiZGlzdGFuY2UiLCJpbml0aWFsVmVsb2NpdHkiLCJfY2FsY3VsYXRlQXV0b1Njcm9sbFRpbWVCeUluaXRhbFNwZWVkIiwidGFyZ2V0RGVsdGEiLCJub3JtYWxpemUiLCJzY3JvbGx2aWV3U2l6ZSIsInRvdGFsTW92ZVdpZHRoIiwidG90YWxNb3ZlSGVpZ2h0IiwiYXR0ZW51YXRlZEZhY3RvclgiLCJhdHRlbnVhdGVkRmFjdG9yWSIsIm9yaWdpbmFsTW92ZUxlbmd0aCIsImZhY3RvciIsInNxcnQiLCJpbml0YWxTcGVlZCIsImFkanVzdGVkRGVsdGFNb3ZlIiwiX2ZsYXR0ZW5WZWN0b3JCeURpcmVjdGlvbiIsInRvdGFsVGltZSIsInJlZHVjZSIsImEiLCJiIiwidG90YWxNb3ZlbWVudCIsInZlY3RvciIsInJlc3VsdCIsImNhblN0YXJ0Qm91bmNlQmFjayIsImFkanVzdGVkTW92ZSIsImNvbnRlbnRQb3MiLCJnZXRBbmNob3JQb2ludCIsIl9nZXRDb250ZW50UmlnaHRCb3VuZGFyeSIsImFkZGl0aW9uIiwib3V0T2ZCb3VuZGFyeUFtb3VudCIsImhpZGUiLCJzaG93IiwiX29uU2Nyb2xsIiwiZmxhZyIsImVtaXRFdmVudHMiLCJlbWl0Iiwic3RhcnQiLCJkaXJlY3RvciIsIm9uY2UiLCJEaXJlY3RvciIsIkVWRU5UX0JFRk9SRV9EUkFXIiwiX2hpZGVTY3JvbGxiYXIiLCJvbkRpc2FibGUiLCJTSVpFX0NIQU5HRUQiLCJTQ0FMRV9DSEFOR0VEIiwiUE9TSVRJT05fQ0hBTkdFRCIsIm9uRW5hYmxlIiwidXBkYXRlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLElBQU1BLFNBQVMsR0FBR0MsT0FBTyxDQUFDLFdBQUQsQ0FBUCxDQUFxQkMsU0FBdkM7O0FBRUEsSUFBTUMseUNBQXlDLEdBQUcsQ0FBbEQ7QUFDQSxJQUFNQywrQkFBK0IsR0FBRyxJQUF4QztBQUNBLElBQU1DLE9BQU8sR0FBRyxJQUFoQjtBQUNBLElBQU1DLGVBQWUsR0FBRyxHQUF4Qjs7QUFFQSxJQUFJQyxVQUFVLEdBQUdDLEVBQUUsQ0FBQ0MsRUFBSCxFQUFqQjs7QUFDQSxJQUFJQyxjQUFjLEdBQUdGLEVBQUUsQ0FBQ0MsRUFBSCxFQUFyQjs7QUFFQSxJQUFJRSxZQUFZLEdBQUcsU0FBZkEsWUFBZSxDQUFTQyxJQUFULEVBQWU7QUFD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azRDQXpLLEVBQUUsQ0FBQ3dCLFVBQUgsR0FBZ0I2UixNQUFNLENBQUNDLE9BQVAsR0FBaUI5UixVQUFqQztBQUVBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7QUFVQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuY29uc3QgTm9kZUV2ZW50ID0gcmVxdWlyZSgnLi4vQ0NOb2RlJykuRXZlbnRUeXBlO1xuXG5jb25zdCBOVU1CRVJfT0ZfR0FUSEVSRURfVE9VQ0hFU19GT1JfTU9WRV9TUEVFRCA9IDU7XG5jb25zdCBPVVRfT0ZfQk9VTkRBUllfQlJFQUtJTkdfRkFDVE9SID0gMC4wNTtcbmNvbnN0IEVQU0lMT04gPSAxZS00O1xuY29uc3QgTU9WRU1FTlRfRkFDVE9SID0gMC43O1xuXG5sZXQgX3RlbXBQb2ludCA9IGNjLnYyKCk7XG5sZXQgX3RlbXBQcmV2UG9pbnQgPSBjYy52MigpO1xuXG5sZXQgcXVpbnRFYXNlT3V0ID0gZnVuY3Rpb24odGltZSkge1xuICAgIHRpbWUgLT0gMTtcbiAgICByZXR1cm4gKHRpbWUgKiB0aW1lICogdGltZSAqIHRpbWUgKiB0aW1lICsgMSk7XG59O1xuXG5sZXQgZ2V0VGltZUluTWlsbGlzZWNvbmRzID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IGN1cnJlbnRUaW1lID0gbmV3IERhdGUoKTtcbiAgICByZXR1cm4gY3VycmVudFRpbWUuZ2V0TWlsbGlzZWNvbmRzKCk7XG59O1xuXG4vKipcbiAqICEjZW4gRW51bSBmb3IgU2Nyb2xsVmlldyBldmVudCB0eXBlLlxuICogISN6aCDmu5rliqjop4blm77kuovku7bnsbvlnotcbiAqIEBlbnVtIFNjcm9sbFZpZXcuRXZlbnRUeXBlXG4gKi9cbmNvbnN0IEV2ZW50VHlwZSA9IGNjLkVudW0oe1xuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGV2ZW50IGVtbWl0dGVkIHdoZW4gU2Nyb2xsVmlldyBzY3JvbGwgdG8gdGhlIHRvcCBib3VuZGFyeSBvZiBpbm5lciBjb250YWluZXJcbiAgICAgKiAhI3poIOa7muWKqOinhuWbvua7muWKqOWIsOmhtumDqOi+ueeVjOS6i+S7tlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBTQ1JPTExfVE9fVE9QXG4gICAgICovXG4gICAgU0NST0xMX1RPX1RPUCA6IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZXZlbnQgZW1taXR0ZWQgd2hlbiBTY3JvbGxWaWV3IHNjcm9sbCB0byB0aGUgYm90dG9tIGJvdW5kYXJ5IG9mIGlubmVyIGNvbnRhaW5lclxuICAgICAqICEjemgg5rua5Yqo6KeG5Zu+5rua5Yqo5Yiw5bqV6YOo6L6555WM5LqL5Lu2XG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFNDUk9MTF9UT19CT1RUT01cbiAgICAgKi9cbiAgICBTQ1JPTExfVE9fQk9UVE9NIDogMSxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBldmVudCBlbW1pdHRlZCB3aGVuIFNjcm9sbFZpZXcgc2Nyb2xsIHRvIHRoZSBsZWZ0IGJvdW5kYXJ5IG9mIGlubmVyIGNvbnRhaW5lclxuICAgICAqICEjemgg5rua5Yqo6KeG5Zu+5rua5Yqo5Yiw5bem6L6555WM5LqL5Lu2XG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFNDUk9MTF9UT19MRUZUXG4gICAgICovXG4gICAgU0NST0xMX1RPX0xFRlQgOiAyLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGV2ZW50IGVtbWl0dGVkIHdoZW4gU2Nyb2xsVmlldyBzY3JvbGwgdG8gdGhlIHJpZ2h0IGJvdW5kYXJ5IG9mIGlubmVyIGNvbnRhaW5lclxuICAgICAqICEjemgg5rua5Yqo6KeG5Zu+5rua5Yqo5Yiw5Y+z6L6555WM5LqL5Lu2XG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFNDUk9MTF9UT19SSUdIVFxuICAgICAqL1xuICAgIFNDUk9MTF9UT19SSUdIVCA6IDMsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZXZlbnQgZW1taXR0ZWQgd2hlbiBTY3JvbGxWaWV3IGlzIHNjcm9sbGluZ1xuICAgICAqICEjemgg5rua5Yqo6KeG5Zu+5q2j5Zyo5rua5Yqo5pe25Y+R5Ye655qE5LqL5Lu2XG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFNDUk9MTElOR1xuICAgICAqL1xuICAgIFNDUk9MTElORyA6IDQsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZXZlbnQgZW1taXR0ZWQgd2hlbiBTY3JvbGxWaWV3IHNjcm9sbCB0byB0aGUgdG9wIGJvdW5kYXJ5IG9mIGlubmVyIGNvbnRhaW5lciBhbmQgc3RhcnQgYm91bmNlXG4gICAgICogISN6aCDmu5rliqjop4blm77mu5rliqjliLDpobbpg6jovrnnlYzlubbkuJTlvIDlp4vlm57lvLnml7blj5Hlh7rnmoTkuovku7ZcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gQk9VTkNFX1RPUFxuICAgICAqL1xuICAgIEJPVU5DRV9UT1AgOiA1LFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGV2ZW50IGVtbWl0dGVkIHdoZW4gU2Nyb2xsVmlldyBzY3JvbGwgdG8gdGhlIGJvdHRvbSBib3VuZGFyeSBvZiBpbm5lciBjb250YWluZXIgYW5kIHN0YXJ0IGJvdW5jZVxuICAgICAqICEjemgg5rua5Yqo6KeG5Zu+5rua5Yqo5Yiw5bqV6YOo6L6555WM5bm25LiU5byA5aeL5Zue5by55pe25Y+R5Ye655qE5LqL5Lu2XG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEJPVU5DRV9CT1RUT01cbiAgICAgKi9cbiAgICBCT1VOQ0VfQk9UVE9NIDogNixcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBldmVudCBlbW1pdHRlZCB3aGVuIFNjcm9sbFZpZXcgc2Nyb2xsIHRvIHRoZSBsZWZ0IGJvdW5kYXJ5IG9mIGlubmVyIGNvbnRhaW5lciBhbmQgc3RhcnQgYm91bmNlXG4gICAgICogISN6aCDmu5rliqjop4blm77mu5rliqjliLDlt6bovrnnlYzlubbkuJTlvIDlp4vlm57lvLnml7blj5Hlh7rnmoTkuovku7ZcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gQk9VTkNFX0xFRlRcbiAgICAgKi9cbiAgICBCT1VOQ0VfTEVGVCA6IDcsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZXZlbnQgZW1taXR0ZWQgd2hlbiBTY3JvbGxWaWV3IHNjcm9sbCB0byB0aGUgcmlnaHQgYm91bmRhcnkgb2YgaW5uZXIgY29udGFpbmVyIGFuZCBzdGFydCBib3VuY2VcbiAgICAgKiAhI3poIOa7muWKqOinhuWbvua7muWKqOWIsOWPs+i+ueeVjOW5tuS4lOW8gOWni+WbnuW8ueaXtuWPkeWHuueahOS6i+S7tlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBCT1VOQ0VfUklHSFRcbiAgICAgKi9cbiAgICBCT1VOQ0VfUklHSFQgOiA4LFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGV2ZW50IGVtbWl0dGVkIHdoZW4gU2Nyb2xsVmlldyBhdXRvIHNjcm9sbCBlbmRlZFxuICAgICAqICEjemgg5rua5Yqo6KeG5Zu+5rua5Yqo57uT5p2f55qE5pe25YCZ5Y+R5Ye655qE5LqL5Lu2XG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFNDUk9MTF9FTkRFRFxuICAgICAqL1xuICAgIFNDUk9MTF9FTkRFRCA6IDksXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZXZlbnQgZW1taXR0ZWQgd2hlbiB1c2VyIHJlbGVhc2UgdGhlIHRvdWNoXG4gICAgICogISN6aCDlvZPnlKjmiLfmnb7miYvnmoTml7blgJnkvJrlj5Hlh7rkuIDkuKrkuovku7ZcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gVE9VQ0hfVVBcbiAgICAgKi9cbiAgICBUT1VDSF9VUCA6IDEwLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGV2ZW50IGVtbWl0dGVkIHdoZW4gU2Nyb2xsVmlldyBhdXRvIHNjcm9sbCBlbmRlZCB3aXRoIGEgdGhyZXNob2xkXG4gICAgICogISN6aCDmu5rliqjop4blm77oh6rliqjmu5rliqjlv6vopoHnu5PmnZ/nmoTml7blgJnlj5Hlh7rnmoTkuovku7ZcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gQVVUT1NDUk9MTF9FTkRFRF9XSVRIX1RIUkVTSE9MRFxuICAgICAqL1xuICAgIEFVVE9TQ1JPTExfRU5ERURfV0lUSF9USFJFU0hPTEQ6IDExLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGV2ZW50IGVtbWl0dGVkIHdoZW4gU2Nyb2xsVmlldyBzY3JvbGwgYmVnYW5cbiAgICAgKiAhI3poIOa7muWKqOinhuWbvua7muWKqOW8gOWni+aXtuWPkeWHuueahOS6i+S7tlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBTQ1JPTExfQkVHQU5cbiAgICAgKi9cbiAgICBTQ1JPTExfQkVHQU46IDEyXG59KTtcblxuY29uc3QgZXZlbnRNYXAgPSB7XG4gICAgJ3Njcm9sbC10by10b3AnIDogRXZlbnRUeXBlLlNDUk9MTF9UT19UT1AsXG4gICAgJ3Njcm9sbC10by1ib3R0b20nOiBFdmVudFR5cGUuU0NST0xMX1RPX0JPVFRPTSxcbiAgICAnc2Nyb2xsLXRvLWxlZnQnIDogRXZlbnRUeXBlLlNDUk9MTF9UT19MRUZULFxuICAgICdzY3JvbGwtdG8tcmlnaHQnIDogRXZlbnRUeXBlLlNDUk9MTF9UT19SSUdIVCxcbiAgICAnc2Nyb2xsaW5nJyA6IEV2ZW50VHlwZS5TQ1JPTExJTkcsXG4gICAgJ2JvdW5jZS1ib3R0b20nIDogRXZlbnRUeXBlLkJPVU5DRV9CT1RUT00sXG4gICAgJ2JvdW5jZS1sZWZ0JyA6IEV2ZW50VHlwZS5CT1VOQ0VfTEVGVCxcbiAgICAnYm91bmNlLXJpZ2h0JyA6IEV2ZW50VHlwZS5CT1VOQ0VfUklHSFQsXG4gICAgJ2JvdW5jZS10b3AnIDogRXZlbnRUeXBlLkJPVU5DRV9UT1AsXG4gICAgJ3Njcm9sbC1lbmRlZCc6IEV2ZW50VHlwZS5TQ1JPTExfRU5ERUQsXG4gICAgJ3RvdWNoLXVwJyA6IEV2ZW50VHlwZS5UT1VDSF9VUCxcbiAgICAnc2Nyb2xsLWVuZGVkLXdpdGgtdGhyZXNob2xkJyA6IEV2ZW50VHlwZS5BVVRPU0NST0xMX0VOREVEX1dJVEhfVEhSRVNIT0xELFxuICAgICdzY3JvbGwtYmVnYW4nOiBFdmVudFR5cGUuU0NST0xMX0JFR0FOXG59O1xuXG4vKipcbiAqICEjZW5cbiAqIExheW91dCBjb250YWluZXIgZm9yIGEgdmlldyBoaWVyYXJjaHkgdGhhdCBjYW4gYmUgc2Nyb2xsZWQgYnkgdGhlIHVzZXIsXG4gKiBhbGxvd2luZyBpdCB0byBiZSBsYXJnZXIgdGhhbiB0aGUgcGh5c2ljYWwgZGlzcGxheS5cbiAqXG4gKiAhI3poXG4gKiDmu5rliqjop4blm77nu4Tku7ZcbiAqIEBjbGFzcyBTY3JvbGxWaWV3XG4gKiBAZXh0ZW5kcyBDb21wb25lbnRcbiAqL1xubGV0IFNjcm9sbFZpZXcgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlNjcm9sbFZpZXcnLFxuICAgIGV4dGVuZHM6IHJlcXVpcmUoJy4vQ0NWaWV3R3JvdXAnKSxcblxuICAgIGVkaXRvcjogQ0NfRURJVE9SICYmIHtcbiAgICAgICAgbWVudTogJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC51aS9TY3JvbGxWaWV3JyxcbiAgICAgICAgaGVscDogJ2kxOG46Q09NUE9ORU5ULmhlbHBfdXJsLnNjcm9sbHZpZXcnLFxuICAgICAgICBpbnNwZWN0b3I6ICdwYWNrYWdlczovL2luc3BlY3Rvci9pbnNwZWN0b3JzL2NvbXBzL3Njcm9sbHZpZXcuanMnLFxuICAgICAgICBleGVjdXRlSW5FZGl0TW9kZTogZmFsc2UsXG4gICAgfSxcblxuICAgIGN0b3IgKCkge1xuICAgICAgICB0aGlzLl90b3BCb3VuZGFyeSA9IDA7XG4gICAgICAgIHRoaXMuX2JvdHRvbUJvdW5kYXJ5ID0gMDtcbiAgICAgICAgdGhpcy5fbGVmdEJvdW5kYXJ5ID0gMDtcbiAgICAgICAgdGhpcy5fcmlnaHRCb3VuZGFyeSA9IDA7XG5cbiAgICAgICAgdGhpcy5fdG91Y2hNb3ZlRGlzcGxhY2VtZW50cyA9IFtdO1xuICAgICAgICB0aGlzLl90b3VjaE1vdmVUaW1lRGVsdGFzID0gW107XG4gICAgICAgIHRoaXMuX3RvdWNoTW92ZVByZXZpb3VzVGltZXN0YW1wID0gMDtcbiAgICAgICAgdGhpcy5fdG91Y2hNb3ZlZCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuX2F1dG9TY3JvbGxpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fYXV0b1Njcm9sbEF0dGVudWF0ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9hdXRvU2Nyb2xsU3RhcnRQb3NpdGlvbiA9IGNjLnYyKDAsIDApO1xuICAgICAgICB0aGlzLl9hdXRvU2Nyb2xsVGFyZ2V0RGVsdGEgPSBjYy52MigwLCAwKTtcbiAgICAgICAgdGhpcy5fYXV0b1Njcm9sbFRvdGFsVGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2F1dG9TY3JvbGxBY2N1bXVsYXRlZFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9hdXRvU2Nyb2xsQ3VycmVudGx5T3V0T2ZCb3VuZGFyeSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9hdXRvU2Nyb2xsQnJha2luZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9hdXRvU2Nyb2xsQnJha2luZ1N0YXJ0UG9zaXRpb24gPSBjYy52MigwLCAwKTtcblxuICAgICAgICB0aGlzLl9vdXRPZkJvdW5kYXJ5QW1vdW50ID0gY2MudjIoMCwgMCk7XG4gICAgICAgIHRoaXMuX291dE9mQm91bmRhcnlBbW91bnREaXJ0eSA9IHRydWU7XG4gICAgICAgIHRoaXMuX3N0b3BNb3VzZVdoZWVsID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX21vdXNlV2hlZWxFdmVudEVsYXBzZWRUaW1lID0gMC4wO1xuICAgICAgICB0aGlzLl9pc1Njcm9sbEVuZGVkV2l0aFRocmVzaG9sZEV2ZW50RmlyZWQgPSBmYWxzZTtcbiAgICAgICAgLy91c2UgYml0IHdpc2Ugb3BlcmF0aW9ucyB0byBpbmRpY2F0ZSB0aGUgZGlyZWN0aW9uXG4gICAgICAgIHRoaXMuX3Njcm9sbEV2ZW50RW1pdE1hc2sgPSAwO1xuICAgICAgICB0aGlzLl9pc0JvdW5jaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3Njcm9sbGluZyA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoaXMgaXMgYSByZWZlcmVuY2UgdG8gdGhlIFVJIGVsZW1lbnQgdG8gYmUgc2Nyb2xsZWQuXG4gICAgICAgICAqICEjemgg5Y+v5rua5Yqo5bGV56S65YaF5a6555qE6IqC54K544CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Tm9kZX0gY29udGVudFxuICAgICAgICAgKi9cbiAgICAgICAgY29udGVudDoge1xuICAgICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuc2Nyb2xsdmlldy5jb250ZW50JyxcbiAgICAgICAgICAgIGZvcm1lcmx5U2VyaWFsaXplZEFzOiAnY29udGVudCcsXG4gICAgICAgICAgICBub3RpZnkgKG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRlQm91bmRhcnkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBFbmFibGUgaG9yaXpvbnRhbCBzY3JvbGwuXG4gICAgICAgICAqICEjemgg5piv5ZCm5byA5ZCv5rC05bmz5rua5Yqo44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gaG9yaXpvbnRhbFxuICAgICAgICAgKi9cbiAgICAgICAgaG9yaXpvbnRhbDoge1xuICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5zY3JvbGx2aWV3Lmhvcml6b250YWwnLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIEVuYWJsZSB2ZXJ0aWNhbCBzY3JvbGwuXG4gICAgICAgICAqICEjemgg5piv5ZCm5byA5ZCv5Z6C55u05rua5Yqo44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gdmVydGljYWxcbiAgICAgICAgICovXG4gICAgICAgIHZlcnRpY2FsOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNjcm9sbHZpZXcudmVydGljYWwnLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFdoZW4gaW5lcnRpYSBpcyBzZXQsIHRoZSBjb250ZW50IHdpbGwgY29udGludWUgdG8gbW92ZSB3aGVuIHRvdWNoIGVuZGVkLlxuICAgICAgICAgKiAhI3poIOaYr+WQpuW8gOWQr+a7muWKqOaDr+aAp+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGluZXJ0aWFcbiAgICAgICAgICovXG4gICAgICAgIGluZXJ0aWE6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNjcm9sbHZpZXcuaW5lcnRpYScsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogSXQgZGV0ZXJtaW5lcyBob3cgcXVpY2tseSB0aGUgY29udGVudCBzdG9wIG1vdmluZy4gQSB2YWx1ZSBvZiAxIHdpbGwgc3RvcCB0aGUgbW92ZW1lbnQgaW1tZWRpYXRlbHkuXG4gICAgICAgICAqIEEgdmFsdWUgb2YgMCB3aWxsIG5ldmVyIHN0b3AgdGhlIG1vdmVtZW50IHVudGlsIGl0IHJlYWNoZXMgdG8gdGhlIGJvdW5kYXJ5IG9mIHNjcm9sbHZpZXcuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5byA5ZCv5oOv5oCn5ZCO77yM5Zyo55So5oi35YGc5q2i6Kem5pG45ZCO5rua5Yqo5aSa5b+r5YGc5q2i77yMMOihqOekuuawuOS4jeWBnOatou+8jDHooajnpLrnq4vliLvlgZzmraLjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGJyYWtlXG4gICAgICAgICAqL1xuICAgICAgICBicmFrZToge1xuICAgICAgICAgICAgZGVmYXVsdDogMC41LFxuICAgICAgICAgICAgdHlwZTogY2MuRmxvYXQsXG4gICAgICAgICAgICByYW5nZTogWzAsIDEsIDAuMV0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNjcm9sbHZpZXcuYnJha2UnLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFdoZW4gZWxhc3RpYyBpcyBzZXQsIHRoZSBjb250ZW50IHdpbGwgYmUgYm91bmNlIGJhY2sgd2hlbiBtb3ZlIG91dCBvZiBib3VuZGFyeS5cbiAgICAgICAgICogISN6aCDmmK/lkKblhYHorrjmu5rliqjlhoXlrrnotoXov4fovrnnlYzvvIzlubblnKjlgZzmraLop6bmkbjlkI7lm57lvLnjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBlbGFzdGljXG4gICAgICAgICAqL1xuICAgICAgICBlbGFzdGljOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNjcm9sbHZpZXcuZWxhc3RpYycsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIGVsYXBzZSB0aW1lIG9mIGJvdW5jaW5nIGJhY2suIEEgdmFsdWUgb2YgMCB3aWxsIGJvdW5jZSBiYWNrIGltbWVkaWF0ZWx5LlxuICAgICAgICAgKiAhI3poIOWbnuW8ueaMgee7reeahOaXtumXtO+8jDAg6KGo56S65bCG56uL5Y2z5Y+N5by544CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBib3VuY2VEdXJhdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgYm91bmNlRHVyYXRpb246IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IDEsXG4gICAgICAgICAgICByYW5nZTogWzAsIDEwXSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuc2Nyb2xsdmlldy5ib3VuY2VEdXJhdGlvbicsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIGhvcml6b250YWwgc2Nyb2xsYmFyIHJlZmVyZW5jZS5cbiAgICAgICAgICogISN6aCDmsLTlubPmu5rliqjnmoQgU2Nyb2xsQmFy44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U2Nyb2xsYmFyfSBob3Jpem9udGFsU2Nyb2xsQmFyXG4gICAgICAgICAqL1xuICAgICAgICBob3Jpem9udGFsU2Nyb2xsQmFyOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICB0eXBlOiBjYy5TY3JvbGxiYXIsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNjcm9sbHZpZXcuaG9yaXpvbnRhbF9iYXInLFxuICAgICAgICAgICAgbm90aWZ5ICgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ob3Jpem9udGFsU2Nyb2xsQmFyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbFNjcm9sbEJhci5zZXRUYXJnZXRTY3JvbGxWaWV3KHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVTY3JvbGxCYXIoMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIHZlcnRpY2FsIHNjcm9sbGJhciByZWZlcmVuY2UuXG4gICAgICAgICAqICEjemgg5Z6C55u05rua5Yqo55qEIFNjcm9sbEJhcuOAglxuICAgICAgICAgKiBAcHJvcGVydHkge1Njcm9sbGJhcn0gdmVydGljYWxTY3JvbGxCYXJcbiAgICAgICAgICovXG4gICAgICAgIHZlcnRpY2FsU2Nyb2xsQmFyOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICB0eXBlOiBjYy5TY3JvbGxiYXIsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNjcm9sbHZpZXcudmVydGljYWxfYmFyJyxcbiAgICAgICAgICAgIG5vdGlmeSAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudmVydGljYWxTY3JvbGxCYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0aWNhbFNjcm9sbEJhci5zZXRUYXJnZXRTY3JvbGxWaWV3KHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVTY3JvbGxCYXIoMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gU2Nyb2xsdmlldyBldmVudHMgY2FsbGJhY2tcbiAgICAgICAgICogISN6aCDmu5rliqjop4blm77nmoTkuovku7blm57osIPlh73mlbBcbiAgICAgICAgICogQHByb3BlcnR5IHtDb21wb25lbnQuRXZlbnRIYW5kbGVyW119IHNjcm9sbEV2ZW50c1xuICAgICAgICAgKi9cbiAgICAgICAgc2Nyb2xsRXZlbnRzOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXIsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNjcm9sbHZpZXcuc2Nyb2xsRXZlbnRzJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIElmIGNhbmNlbElubmVyRXZlbnRzIGlzIHNldCB0byB0cnVlLCB0aGUgc2Nyb2xsIGJlaGF2aW9yIHdpbGwgY2FuY2VsIHRvdWNoIGV2ZW50cyBvbiBpbm5lciBjb250ZW50IG5vZGVzXG4gICAgICAgICAqIEl0J3Mgc2V0IHRvIHRydWUgYnkgZGVmYXVsdC5cbiAgICAgICAgICogISN6aCDlpoLmnpzov5nkuKrlsZ7mgKfooqvorr7nva7kuLogdHJ1Ze+8jOmCo+S5iOa7muWKqOihjOS4uuS8muWPlua2iOWtkOiKgueCueS4iuazqOWGjOeahOinpuaRuOS6i+S7tu+8jOm7mOiupOiiq+iuvue9ruS4uiB0cnVl44CCXG4gICAgICAgICAqIOazqOaEj++8jOWtkOiKgueCueS4iueahCB0b3VjaHN0YXJ0IOS6i+S7tuS7jeeEtuS8muinpuWPke+8jOinpueCueenu+WKqOi3neemu+mdnuW4uOefreeahOaDheWGteS4iyB0b3VjaG1vdmUg5ZKMIHRvdWNoZW5kIOS5n+S4jeS8muWPl+W9seWTjeOAglxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGNhbmNlbElubmVyRXZlbnRzXG4gICAgICAgICAqL1xuICAgICAgICBjYW5jZWxJbm5lckV2ZW50czoge1xuICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5zY3JvbGx2aWV3LmNhbmNlbElubmVyRXZlbnRzJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHByaXZhdGUgb2JqZWN0XG4gICAgICAgIF92aWV3OiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb250ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQucGFyZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIEV2ZW50VHlwZTogRXZlbnRUeXBlLFxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNjcm9sbCB0aGUgY29udGVudCB0byB0aGUgYm90dG9tIGJvdW5kYXJ5IG9mIFNjcm9sbFZpZXcuXG4gICAgICogISN6aCDop4blm77lhoXlrrnlsIblnKjop4Tlrprml7bpl7TlhoXmu5rliqjliLDop4blm77lupXpg6jjgIJcbiAgICAgKiBAbWV0aG9kIHNjcm9sbFRvQm90dG9tXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFt0aW1lSW5TZWNvbmQ9MF0gLSBTY3JvbGwgdGltZSBpbiBzZWNvbmQsIGlmIHlvdSBkb24ndCBwYXNzIHRpbWVJblNlY29uZCxcbiAgICAgKiB0aGUgY29udGVudCB3aWxsIGp1bXAgdG8gdGhlIGJvdHRvbSBib3VuZGFyeSBpbW1lZGlhdGVseS5cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFthdHRlbnVhdGVkPXRydWVdIC0gV2hldGhlciB0aGUgc2Nyb2xsIGFjY2VsZXJhdGlvbiBhdHRlbnVhdGVkLCBkZWZhdWx0IGlzIHRydWUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAvLyBTY3JvbGwgdG8gdGhlIGJvdHRvbSBvZiB0aGUgdmlldy5cbiAgICAgKiBzY3JvbGxWaWV3LnNjcm9sbFRvQm90dG9tKDAuMSk7XG4gICAgICovXG4gICAgc2Nyb2xsVG9Cb3R0b20gKHRpbWVJblNlY29uZCwgYXR0ZW51YXRlZCkge1xuICAgICAgICBsZXQgbW92ZURlbHRhID0gdGhpcy5fY2FsY3VsYXRlTW92ZVBlcmNlbnREZWx0YSh7XG4gICAgICAgICAgICBhbmNob3I6IGNjLnYyKDAsIDApLFxuICAgICAgICAgICAgYXBwbHlUb0hvcml6b250YWw6IGZhbHNlLFxuICAgICAgICAgICAgYXBwbHlUb1ZlcnRpY2FsOiB0cnVlLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGltZUluU2Vjb25kKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGFydEF1dG9TY3JvbGwobW92ZURlbHRhLCB0aW1lSW5TZWNvbmQsIGF0dGVudWF0ZWQgIT09IGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX21vdmVDb250ZW50KG1vdmVEZWx0YSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTY3JvbGwgdGhlIGNvbnRlbnQgdG8gdGhlIHRvcCBib3VuZGFyeSBvZiBTY3JvbGxWaWV3LlxuICAgICAqICEjemgg6KeG5Zu+5YaF5a655bCG5Zyo6KeE5a6a5pe26Ze05YaF5rua5Yqo5Yiw6KeG5Zu+6aG26YOo44CCXG4gICAgICogQG1ldGhvZCBzY3JvbGxUb1RvcFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbdGltZUluU2Vjb25kPTBdIC0gU2Nyb2xsIHRpbWUgaW4gc2Vjb25kLCBpZiB5b3UgZG9uJ3QgcGFzcyB0aW1lSW5TZWNvbmQsXG4gICAgICogdGhlIGNvbnRlbnQgd2lsbCBqdW1wIHRvIHRoZSB0b3AgYm91bmRhcnkgaW1tZWRpYXRlbHkuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbYXR0ZW51YXRlZD10cnVlXSAtIFdoZXRoZXIgdGhlIHNjcm9sbCBhY2NlbGVyYXRpb24gYXR0ZW51YXRlZCwgZGVmYXVsdCBpcyB0cnVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogLy8gU2Nyb2xsIHRvIHRoZSB0b3Agb2YgdGhlIHZpZXcuXG4gICAgICogc2Nyb2xsVmlldy5zY3JvbGxUb1RvcCgwLjEpO1xuICAgICAqL1xuICAgIHNjcm9sbFRvVG9wICh0aW1lSW5TZWNvbmQsIGF0dGVudWF0ZWQpIHtcbiAgICAgICAgbGV0IG1vdmVEZWx0YSA9IHRoaXMuX2NhbGN1bGF0ZU1vdmVQZXJjZW50RGVsdGEoe1xuICAgICAgICAgICAgYW5jaG9yOiBjYy52MigwLCAxKSxcbiAgICAgICAgICAgIGFwcGx5VG9Ib3Jpem9udGFsOiBmYWxzZSxcbiAgICAgICAgICAgIGFwcGx5VG9WZXJ0aWNhbDogdHJ1ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRpbWVJblNlY29uZCkge1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRBdXRvU2Nyb2xsKG1vdmVEZWx0YSwgdGltZUluU2Vjb25kLCBhdHRlbnVhdGVkICE9PSBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlQ29udGVudChtb3ZlRGVsdGEpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2Nyb2xsIHRoZSBjb250ZW50IHRvIHRoZSBsZWZ0IGJvdW5kYXJ5IG9mIFNjcm9sbFZpZXcuXG4gICAgICogISN6aCDop4blm77lhoXlrrnlsIblnKjop4Tlrprml7bpl7TlhoXmu5rliqjliLDop4blm77lt6bovrnjgIJcbiAgICAgKiBAbWV0aG9kIHNjcm9sbFRvTGVmdFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbdGltZUluU2Vjb25kPTBdIC0gU2Nyb2xsIHRpbWUgaW4gc2Vjb25kLCBpZiB5b3UgZG9uJ3QgcGFzcyB0aW1lSW5TZWNvbmQsXG4gICAgICogdGhlIGNvbnRlbnQgd2lsbCBqdW1wIHRvIHRoZSBsZWZ0IGJvdW5kYXJ5IGltbWVkaWF0ZWx5LlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2F0dGVudWF0ZWQ9dHJ1ZV0gLSBXaGV0aGVyIHRoZSBzY3JvbGwgYWNjZWxlcmF0aW9uIGF0dGVudWF0ZWQsIGRlZmF1bHQgaXMgdHJ1ZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIC8vIFNjcm9sbCB0byB0aGUgbGVmdCBvZiB0aGUgdmlldy5cbiAgICAgKiBzY3JvbGxWaWV3LnNjcm9sbFRvTGVmdCgwLjEpO1xuICAgICAqL1xuICAgIHNjcm9sbFRvTGVmdCAodGltZUluU2Vjb25kLCBhdHRlbnVhdGVkKSB7XG4gICAgICAgIGxldCBtb3ZlRGVsdGEgPSB0aGlzLl9jYWxjdWxhdGVNb3ZlUGVyY2VudERlbHRhKHtcbiAgICAgICAgICAgIGFuY2hvcjogY2MudjIoMCwgMCksXG4gICAgICAgICAgICBhcHBseVRvSG9yaXpvbnRhbDogdHJ1ZSxcbiAgICAgICAgICAgIGFwcGx5VG9WZXJ0aWNhbDogZmFsc2UsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aW1lSW5TZWNvbmQpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0QXV0b1Njcm9sbChtb3ZlRGVsdGEsIHRpbWVJblNlY29uZCwgYXR0ZW51YXRlZCAhPT0gZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fbW92ZUNvbnRlbnQobW92ZURlbHRhKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNjcm9sbCB0aGUgY29udGVudCB0byB0aGUgcmlnaHQgYm91bmRhcnkgb2YgU2Nyb2xsVmlldy5cbiAgICAgKiAhI3poIOinhuWbvuWGheWuueWwhuWcqOinhOWumuaXtumXtOWGhea7muWKqOWIsOinhuWbvuWPs+i+ueOAglxuICAgICAqIEBtZXRob2Qgc2Nyb2xsVG9SaWdodFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbdGltZUluU2Vjb25kPTBdIC0gU2Nyb2xsIHRpbWUgaW4gc2Vjb25kLCBpZiB5b3UgZG9uJ3QgcGFzcyB0aW1lSW5TZWNvbmQsXG4gICAgICogdGhlIGNvbnRlbnQgd2lsbCBqdW1wIHRvIHRoZSByaWdodCBib3VuZGFyeSBpbW1lZGlhdGVseS5cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFthdHRlbnVhdGVkPXRydWVdIC0gV2hldGhlciB0aGUgc2Nyb2xsIGFjY2VsZXJhdGlvbiBhdHRlbnVhdGVkLCBkZWZhdWx0IGlzIHRydWUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAvLyBTY3JvbGwgdG8gdGhlIHJpZ2h0IG9mIHRoZSB2aWV3LlxuICAgICAqIHNjcm9sbFZpZXcuc2Nyb2xsVG9SaWdodCgwLjEpO1xuICAgICAqL1xuICAgIHNjcm9sbFRvUmlnaHQgKHRpbWVJblNlY29uZCwgYXR0ZW51YXRlZCkge1xuICAgICAgICBsZXQgbW92ZURlbHRhID0gdGhpcy5fY2FsY3VsYXRlTW92ZVBlcmNlbnREZWx0YSh7XG4gICAgICAgICAgICBhbmNob3I6IGNjLnYyKDEsIDApLFxuICAgICAgICAgICAgYXBwbHlUb0hvcml6b250YWw6IHRydWUsXG4gICAgICAgICAgICBhcHBseVRvVmVydGljYWw6IGZhbHNlLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGltZUluU2Vjb25kKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGFydEF1dG9TY3JvbGwobW92ZURlbHRhLCB0aW1lSW5TZWNvbmQsIGF0dGVudWF0ZWQgIT09IGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX21vdmVDb250ZW50KG1vdmVEZWx0YSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTY3JvbGwgdGhlIGNvbnRlbnQgdG8gdGhlIHRvcCBsZWZ0IGJvdW5kYXJ5IG9mIFNjcm9sbFZpZXcuXG4gICAgICogISN6aCDop4blm77lhoXlrrnlsIblnKjop4Tlrprml7bpl7TlhoXmu5rliqjliLDop4blm77lt6bkuIrop5LjgIJcbiAgICAgKiBAbWV0aG9kIHNjcm9sbFRvVG9wTGVmdFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbdGltZUluU2Vjb25kPTBdIC0gU2Nyb2xsIHRpbWUgaW4gc2Vjb25kLCBpZiB5b3UgZG9uJ3QgcGFzcyB0aW1lSW5TZWNvbmQsXG4gICAgICogdGhlIGNvbnRlbnQgd2lsbCBqdW1wIHRvIHRoZSB0b3AgbGVmdCBib3VuZGFyeSBpbW1lZGlhdGVseS5cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFthdHRlbnVhdGVkPXRydWVdIC0gV2hldGhlciB0aGUgc2Nyb2xsIGFjY2VsZXJhdGlvbiBhdHRlbnVhdGVkLCBkZWZhdWx0IGlzIHRydWUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAvLyBTY3JvbGwgdG8gdGhlIHVwcGVyIGxlZnQgY29ybmVyIG9mIHRoZSB2aWV3LlxuICAgICAqIHNjcm9sbFZpZXcuc2Nyb2xsVG9Ub3BMZWZ0KDAuMSk7XG4gICAgICovXG4gICAgc2Nyb2xsVG9Ub3BMZWZ0ICh0aW1lSW5TZWNvbmQsIGF0dGVudWF0ZWQpIHtcbiAgICAgICAgbGV0IG1vdmVEZWx0YSA9IHRoaXMuX2NhbGN1bGF0ZU1vdmVQZXJjZW50RGVsdGEoe1xuICAgICAgICAgICAgYW5jaG9yOiBjYy52MigwLCAxKSxcbiAgICAgICAgICAgIGFwcGx5VG9Ib3Jpem9udGFsOiB0cnVlLFxuICAgICAgICAgICAgYXBwbHlUb1ZlcnRpY2FsOiB0cnVlLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGltZUluU2Vjb25kKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGFydEF1dG9TY3JvbGwobW92ZURlbHRhLCB0aW1lSW5TZWNvbmQsIGF0dGVudWF0ZWQgIT09IGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX21vdmVDb250ZW50KG1vdmVEZWx0YSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTY3JvbGwgdGhlIGNvbnRlbnQgdG8gdGhlIHRvcCByaWdodCBib3VuZGFyeSBvZiBTY3JvbGxWaWV3LlxuICAgICAqICEjemgg6KeG5Zu+5YaF5a655bCG5Zyo6KeE5a6a5pe26Ze05YaF5rua5Yqo5Yiw6KeG5Zu+5Y+z5LiK6KeS44CCXG4gICAgICogQG1ldGhvZCBzY3JvbGxUb1RvcFJpZ2h0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFt0aW1lSW5TZWNvbmQ9MF0gLSBTY3JvbGwgdGltZSBpbiBzZWNvbmQsIGlmIHlvdSBkb24ndCBwYXNzIHRpbWVJblNlY29uZCxcbiAgICAgKiB0aGUgY29udGVudCB3aWxsIGp1bXAgdG8gdGhlIHRvcCByaWdodCBib3VuZGFyeSBpbW1lZGlhdGVseS5cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFthdHRlbnVhdGVkPXRydWVdIC0gV2hldGhlciB0aGUgc2Nyb2xsIGFjY2VsZXJhdGlvbiBhdHRlbnVhdGVkLCBkZWZhdWx0IGlzIHRydWUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAvLyBTY3JvbGwgdG8gdGhlIHRvcCByaWdodCBjb3JuZXIgb2YgdGhlIHZpZXcuXG4gICAgICogc2Nyb2xsVmlldy5zY3JvbGxUb1RvcFJpZ2h0KDAuMSk7XG4gICAgICovXG4gICAgc2Nyb2xsVG9Ub3BSaWdodCAodGltZUluU2Vjb25kLCBhdHRlbnVhdGVkKSB7XG4gICAgICAgIGxldCBtb3ZlRGVsdGEgPSB0aGlzLl9jYWxjdWxhdGVNb3ZlUGVyY2VudERlbHRhKHtcbiAgICAgICAgICAgIGFuY2hvcjogY2MudjIoMSwgMSksXG4gICAgICAgICAgICBhcHBseVRvSG9yaXpvbnRhbDogdHJ1ZSxcbiAgICAgICAgICAgIGFwcGx5VG9WZXJ0aWNhbDogdHJ1ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRpbWVJblNlY29uZCkge1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRBdXRvU2Nyb2xsKG1vdmVEZWx0YSwgdGltZUluU2Vjb25kLCBhdHRlbnVhdGVkICE9PSBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlQ29udGVudChtb3ZlRGVsdGEpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2Nyb2xsIHRoZSBjb250ZW50IHRvIHRoZSBib3R0b20gbGVmdCBib3VuZGFyeSBvZiBTY3JvbGxWaWV3LlxuICAgICAqICEjemgg6KeG5Zu+5YaF5a655bCG5Zyo6KeE5a6a5pe26Ze05YaF5rua5Yqo5Yiw6KeG5Zu+5bem5LiL6KeS44CCXG4gICAgICogQG1ldGhvZCBzY3JvbGxUb0JvdHRvbUxlZnRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3RpbWVJblNlY29uZD0wXSAtIFNjcm9sbCB0aW1lIGluIHNlY29uZCwgaWYgeW91IGRvbid0IHBhc3MgdGltZUluU2Vjb25kLFxuICAgICAqIHRoZSBjb250ZW50IHdpbGwganVtcCB0byB0aGUgYm90dG9tIGxlZnQgYm91bmRhcnkgaW1tZWRpYXRlbHkuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbYXR0ZW51YXRlZD10cnVlXSAtIFdoZXRoZXIgdGhlIHNjcm9sbCBhY2NlbGVyYXRpb24gYXR0ZW51YXRlZCwgZGVmYXVsdCBpcyB0cnVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogLy8gU2Nyb2xsIHRvIHRoZSBsb3dlciBsZWZ0IGNvcm5lciBvZiB0aGUgdmlldy5cbiAgICAgKiBzY3JvbGxWaWV3LnNjcm9sbFRvQm90dG9tTGVmdCgwLjEpO1xuICAgICAqL1xuICAgIHNjcm9sbFRvQm90dG9tTGVmdCAodGltZUluU2Vjb25kLCBhdHRlbnVhdGVkKSB7XG4gICAgICAgIGxldCBtb3ZlRGVsdGEgPSB0aGlzLl9jYWxjdWxhdGVNb3ZlUGVyY2VudERlbHRhKHtcbiAgICAgICAgICAgIGFuY2hvcjogY2MudjIoMCwgMCksXG4gICAgICAgICAgICBhcHBseVRvSG9yaXpvbnRhbDogdHJ1ZSxcbiAgICAgICAgICAgIGFwcGx5VG9WZXJ0aWNhbDogdHJ1ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRpbWVJblNlY29uZCkge1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRBdXRvU2Nyb2xsKG1vdmVEZWx0YSwgdGltZUluU2Vjb25kLCBhdHRlbnVhdGVkICE9PSBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlQ29udGVudChtb3ZlRGVsdGEpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2Nyb2xsIHRoZSBjb250ZW50IHRvIHRoZSBib3R0b20gcmlnaHQgYm91bmRhcnkgb2YgU2Nyb2xsVmlldy5cbiAgICAgKiAhI3poIOinhuWbvuWGheWuueWwhuWcqOinhOWumuaXtumXtOWGhea7muWKqOWIsOinhuWbvuWPs+S4i+inkuOAglxuICAgICAqIEBtZXRob2Qgc2Nyb2xsVG9Cb3R0b21SaWdodFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbdGltZUluU2Vjb25kPTBdIC0gU2Nyb2xsIHRpbWUgaW4gc2Vjb25kLCBpZiB5b3UgZG9uJ3QgcGFzcyB0aW1lSW5TZWNvbmQsXG4gICAgICogdGhlIGNvbnRlbnQgd2lsbCBqdW1wIHRvIHRoZSBib3R0b20gcmlnaHQgYm91bmRhcnkgaW1tZWRpYXRlbHkuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbYXR0ZW51YXRlZD10cnVlXSAtIFdoZXRoZXIgdGhlIHNjcm9sbCBhY2NlbGVyYXRpb24gYXR0ZW51YXRlZCwgZGVmYXVsdCBpcyB0cnVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogLy8gU2Nyb2xsIHRvIHRoZSBsb3dlciByaWdodCBjb3JuZXIgb2YgdGhlIHZpZXcuXG4gICAgICogc2Nyb2xsVmlldy5zY3JvbGxUb0JvdHRvbVJpZ2h0KDAuMSk7XG4gICAgICovXG4gICAgc2Nyb2xsVG9Cb3R0b21SaWdodCAodGltZUluU2Vjb25kLCBhdHRlbnVhdGVkKSB7XG4gICAgICAgIGxldCBtb3ZlRGVsdGEgPSB0aGlzLl9jYWxjdWxhdGVNb3ZlUGVyY2VudERlbHRhKHtcbiAgICAgICAgICAgIGFuY2hvcjogY2MudjIoMSwgMCksXG4gICAgICAgICAgICBhcHBseVRvSG9yaXpvbnRhbDogdHJ1ZSxcbiAgICAgICAgICAgIGFwcGx5VG9WZXJ0aWNhbDogdHJ1ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRpbWVJblNlY29uZCkge1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRBdXRvU2Nyb2xsKG1vdmVEZWx0YSwgdGltZUluU2Vjb25kLCBhdHRlbnVhdGVkICE9PSBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlQ29udGVudChtb3ZlRGVsdGEpO1xuICAgICAgICB9XG4gICAgfSxcblxuXG4gICAgLyoqXG4gICAgICogISNlbiBTY3JvbGwgd2l0aCBhbiBvZmZzZXQgcmVsYXRlZCB0byB0aGUgU2Nyb2xsVmlldydzIHRvcCBsZWZ0IG9yaWdpbiwgaWYgdGltZUluU2Vjb25kIGlzIG9taXR0ZWQsIHRoZW4gaXQgd2lsbCBqdW1wIHRvIHRoZVxuICAgICAqICAgICAgIHNwZWNpZmljIG9mZnNldCBpbW1lZGlhdGVseS5cbiAgICAgKiAhI3poIOinhuWbvuWGheWuueWcqOinhOWumuaXtumXtOWGheWwhua7muWKqOWIsCBTY3JvbGxWaWV3IOebuOWvueW3puS4iuinkuWOn+eCueeahOWBj+enu+S9jee9riwg5aaC5p6cIHRpbWVJblNlY29uZOWPguaVsOS4jeS8oO+8jOWImeeri+WNs+a7muWKqOWIsOaMh+WumuWBj+enu+S9jee9ruOAglxuICAgICAqIEBtZXRob2Qgc2Nyb2xsVG9PZmZzZXRcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IG9mZnNldCAtIEEgVmVjMiwgdGhlIHZhbHVlIG9mIHdoaWNoIGVhY2ggYXhpcyBiZXR3ZWVuIDAgYW5kIG1heFNjcm9sbE9mZnNldFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbdGltZUluU2Vjb25kPTBdIC0gU2Nyb2xsIHRpbWUgaW4gc2Vjb25kLCBpZiB5b3UgZG9uJ3QgcGFzcyB0aW1lSW5TZWNvbmQsXG4gICAgICogdGhlIGNvbnRlbnQgd2lsbCBqdW1wIHRvIHRoZSBzcGVjaWZpYyBvZmZzZXQgb2YgU2Nyb2xsVmlldyBpbW1lZGlhdGVseS5cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFthdHRlbnVhdGVkPXRydWVdIC0gV2hldGhlciB0aGUgc2Nyb2xsIGFjY2VsZXJhdGlvbiBhdHRlbnVhdGVkLCBkZWZhdWx0IGlzIHRydWUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAvLyBTY3JvbGwgdG8gbWlkZGxlIHBvc2l0aW9uIGluIDAuMSBzZWNvbmQgaW4geC1heGlzXG4gICAgICogbGV0IG1heFNjcm9sbE9mZnNldCA9IHRoaXMuZ2V0TWF4U2Nyb2xsT2Zmc2V0KCk7XG4gICAgICogc2Nyb2xsVmlldy5zY3JvbGxUb09mZnNldChjYy52MihtYXhTY3JvbGxPZmZzZXQueCAvIDIsIDApLCAwLjEpO1xuICAgICAqL1xuICAgIHNjcm9sbFRvT2Zmc2V0IChvZmZzZXQsIHRpbWVJblNlY29uZCwgYXR0ZW51YXRlZCkge1xuICAgICAgICBsZXQgbWF4U2Nyb2xsT2Zmc2V0ID0gdGhpcy5nZXRNYXhTY3JvbGxPZmZzZXQoKTtcblxuICAgICAgICBsZXQgYW5jaG9yID0gY2MudjIoMCwgMCk7XG4gICAgICAgIC8vaWYgbWF4U2Nyb2xsT2Zmc2V0IGlzIDAsIHRoZW4gYWx3YXlzIGFsaWduIHRoZSBjb250ZW50J3MgdG9wIGxlZnQgb3JpZ2luIHRvIHRoZSB0b3AgbGVmdCBjb3JuZXIgb2YgaXRzIHBhcmVudFxuICAgICAgICBpZiAobWF4U2Nyb2xsT2Zmc2V0LnggPT09IDApIHtcbiAgICAgICAgICAgIGFuY2hvci54ID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFuY2hvci54ID0gb2Zmc2V0LnggLyBtYXhTY3JvbGxPZmZzZXQueDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtYXhTY3JvbGxPZmZzZXQueSA9PT0gMCkge1xuICAgICAgICAgICAgYW5jaG9yLnkgPSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYW5jaG9yLnkgPSAobWF4U2Nyb2xsT2Zmc2V0LnkgLSBvZmZzZXQueSApIC8gbWF4U2Nyb2xsT2Zmc2V0Lnk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNjcm9sbFRvKGFuY2hvciwgdGltZUluU2Vjb25kLCBhdHRlbnVhdGVkKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiAgR2V0IHRoZSBwb3NpdGl2ZSBvZmZzZXQgdmFsdWUgY29ycmVzcG9uZHMgdG8gdGhlIGNvbnRlbnQncyB0b3AgbGVmdCBib3VuZGFyeS5cbiAgICAgKiAhI3poICDojrflj5bmu5rliqjop4blm77nm7jlr7nkuo7lt6bkuIrop5Lljp/ngrnnmoTlvZPliY3mu5rliqjlgY/np7tcbiAgICAgKiBAbWV0aG9kIGdldFNjcm9sbE9mZnNldFxuICAgICAqIEByZXR1cm4ge1ZlYzJ9ICAtIEEgVmVjMiB2YWx1ZSBpbmRpY2F0ZSB0aGUgY3VycmVudCBzY3JvbGwgb2Zmc2V0LlxuICAgICAqL1xuICAgIGdldFNjcm9sbE9mZnNldCAoKSB7XG4gICAgICAgIGxldCB0b3BEZWx0YSA9ICB0aGlzLl9nZXRDb250ZW50VG9wQm91bmRhcnkoKSAtIHRoaXMuX3RvcEJvdW5kYXJ5O1xuICAgICAgICBsZXQgbGVmdERldGEgPSB0aGlzLl9nZXRDb250ZW50TGVmdEJvdW5kYXJ5KCkgLSB0aGlzLl9sZWZ0Qm91bmRhcnk7XG5cbiAgICAgICAgcmV0dXJuIGNjLnYyKGxlZnREZXRhLCB0b3BEZWx0YSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0IHRoZSBtYXhpbWl6ZSBhdmFpbGFibGUgIHNjcm9sbCBvZmZzZXRcbiAgICAgKiAhI3poIOiOt+WPlua7muWKqOinhuWbvuacgOWkp+WPr+S7pea7muWKqOeahOWBj+enu+mHj1xuICAgICAqIEBtZXRob2QgZ2V0TWF4U2Nyb2xsT2Zmc2V0XG4gICAgICogQHJldHVybiB7VmVjMn0gLSBBIFZlYzIgdmFsdWUgaW5kaWNhdGUgdGhlIG1heGltaXplIHNjcm9sbCBvZmZzZXQgaW4geCBhbmQgeSBheGlzLlxuICAgICAqL1xuICAgIGdldE1heFNjcm9sbE9mZnNldCAoKSB7XG4gICAgICAgIGxldCB2aWV3U2l6ZSA9IHRoaXMuX3ZpZXcuZ2V0Q29udGVudFNpemUoKTtcbiAgICAgICAgbGV0IGNvbnRlbnRTaXplID0gdGhpcy5jb250ZW50LmdldENvbnRlbnRTaXplKCk7XG4gICAgICAgIGxldCBob3Jpem9udGFsTWF4aW1pemVPZmZzZXQgPSAgY29udGVudFNpemUud2lkdGggLSB2aWV3U2l6ZS53aWR0aDtcbiAgICAgICAgbGV0IHZlcnRpY2FsTWF4aW1pemVPZmZzZXQgPSBjb250ZW50U2l6ZS5oZWlnaHQgLSB2aWV3U2l6ZS5oZWlnaHQ7XG4gICAgICAgIGhvcml6b250YWxNYXhpbWl6ZU9mZnNldCA9IGhvcml6b250YWxNYXhpbWl6ZU9mZnNldCA+PSAwID8gaG9yaXpvbnRhbE1heGltaXplT2Zmc2V0IDogMDtcbiAgICAgICAgdmVydGljYWxNYXhpbWl6ZU9mZnNldCA9IHZlcnRpY2FsTWF4aW1pemVPZmZzZXQgPj0wID8gdmVydGljYWxNYXhpbWl6ZU9mZnNldCA6IDA7XG5cbiAgICAgICAgcmV0dXJuIGNjLnYyKGhvcml6b250YWxNYXhpbWl6ZU9mZnNldCwgdmVydGljYWxNYXhpbWl6ZU9mZnNldCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2Nyb2xsIHRoZSBjb250ZW50IHRvIHRoZSBob3Jpem9udGFsIHBlcmNlbnQgcG9zaXRpb24gb2YgU2Nyb2xsVmlldy5cbiAgICAgKiAhI3poIOinhuWbvuWGheWuueWcqOinhOWumuaXtumXtOWGheWwhua7muWKqOWIsCBTY3JvbGxWaWV3IOawtOW5s+aWueWQkeeahOeZvuWIhuavlOS9jee9ruS4iuOAglxuICAgICAqIEBtZXRob2Qgc2Nyb2xsVG9QZXJjZW50SG9yaXpvbnRhbFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwZXJjZW50IC0gQSB2YWx1ZSBiZXR3ZWVuIDAgYW5kIDEuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFt0aW1lSW5TZWNvbmQ9MF0gLSBTY3JvbGwgdGltZSBpbiBzZWNvbmQsIGlmIHlvdSBkb24ndCBwYXNzIHRpbWVJblNlY29uZCxcbiAgICAgKiB0aGUgY29udGVudCB3aWxsIGp1bXAgdG8gdGhlIGhvcml6b250YWwgcGVyY2VudCBwb3NpdGlvbiBvZiBTY3JvbGxWaWV3IGltbWVkaWF0ZWx5LlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2F0dGVudWF0ZWQ9dHJ1ZV0gLSBXaGV0aGVyIHRoZSBzY3JvbGwgYWNjZWxlcmF0aW9uIGF0dGVudWF0ZWQsIGRlZmF1bHQgaXMgdHJ1ZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIC8vIFNjcm9sbCB0byBtaWRkbGUgcG9zaXRpb24uXG4gICAgICogc2Nyb2xsVmlldy5zY3JvbGxUb0JvdHRvbVJpZ2h0KDAuNSwgMC4xKTtcbiAgICAgKi9cbiAgICBzY3JvbGxUb1BlcmNlbnRIb3Jpem9udGFsIChwZXJjZW50LCB0aW1lSW5TZWNvbmQsIGF0dGVudWF0ZWQpIHtcbiAgICAgICAgbGV0IG1vdmVEZWx0YSA9IHRoaXMuX2NhbGN1bGF0ZU1vdmVQZXJjZW50RGVsdGEoe1xuICAgICAgICAgICAgYW5jaG9yOiBjYy52MihwZXJjZW50LCAwKSxcbiAgICAgICAgICAgIGFwcGx5VG9Ib3Jpem9udGFsOiB0cnVlLFxuICAgICAgICAgICAgYXBwbHlUb1ZlcnRpY2FsOiBmYWxzZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRpbWVJblNlY29uZCkge1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRBdXRvU2Nyb2xsKG1vdmVEZWx0YSwgdGltZUluU2Vjb25kLCBhdHRlbnVhdGVkICE9PSBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlQ29udGVudChtb3ZlRGVsdGEpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2Nyb2xsIHRoZSBjb250ZW50IHRvIHRoZSBwZXJjZW50IHBvc2l0aW9uIG9mIFNjcm9sbFZpZXcgaW4gYW55IGRpcmVjdGlvbi5cbiAgICAgKiAhI3poIOinhuWbvuWGheWuueWcqOinhOWumuaXtumXtOWGhei/m+ihjOWeguebtOaWueWQkeWSjOawtOW5s+aWueWQkeeahOa7muWKqO+8jOW5tuS4lOa7muWKqOWIsOaMh+WumueZvuWIhuavlOS9jee9ruS4iuOAglxuICAgICAqIEBtZXRob2Qgc2Nyb2xsVG9cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGFuY2hvciAtIEEgcG9pbnQgd2hpY2ggd2lsbCBiZSBjbGFtcCBiZXR3ZWVuIGNjLnYyKDAsMCkgYW5kIGNjLnYyKDEsMSkuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFt0aW1lSW5TZWNvbmQ9MF0gLSBTY3JvbGwgdGltZSBpbiBzZWNvbmQsIGlmIHlvdSBkb24ndCBwYXNzIHRpbWVJblNlY29uZCxcbiAgICAgKiB0aGUgY29udGVudCB3aWxsIGp1bXAgdG8gdGhlIHBlcmNlbnQgcG9zaXRpb24gb2YgU2Nyb2xsVmlldyBpbW1lZGlhdGVseS5cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFthdHRlbnVhdGVkPXRydWVdIC0gV2hldGhlciB0aGUgc2Nyb2xsIGFjY2VsZXJhdGlvbiBhdHRlbnVhdGVkLCBkZWZhdWx0IGlzIHRydWUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAvLyBWZXJ0aWNhbCBzY3JvbGwgdG8gdGhlIGJvdHRvbSBvZiB0aGUgdmlldy5cbiAgICAgKiBzY3JvbGxWaWV3LnNjcm9sbFRvKGNjLnYyKDAsIDEpLCAwLjEpO1xuICAgICAqXG4gICAgICogLy8gSG9yaXpvbnRhbCBzY3JvbGwgdG8gdmlldyByaWdodC5cbiAgICAgKiBzY3JvbGxWaWV3LnNjcm9sbFRvKGNjLnYyKDEsIDApLCAwLjEpO1xuICAgICAqL1xuICAgIHNjcm9sbFRvIChhbmNob3IsIHRpbWVJblNlY29uZCwgYXR0ZW51YXRlZCkge1xuICAgICAgICBsZXQgbW92ZURlbHRhID0gdGhpcy5fY2FsY3VsYXRlTW92ZVBlcmNlbnREZWx0YSh7XG4gICAgICAgICAgICBhbmNob3I6IGNjLnYyKGFuY2hvciksXG4gICAgICAgICAgICBhcHBseVRvSG9yaXpvbnRhbDogdHJ1ZSxcbiAgICAgICAgICAgIGFwcGx5VG9WZXJ0aWNhbDogdHJ1ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRpbWVJblNlY29uZCkge1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRBdXRvU2Nyb2xsKG1vdmVEZWx0YSwgdGltZUluU2Vjb25kLCBhdHRlbnVhdGVkICE9PSBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlQ29udGVudChtb3ZlRGVsdGEpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2Nyb2xsIHRoZSBjb250ZW50IHRvIHRoZSB2ZXJ0aWNhbCBwZXJjZW50IHBvc2l0aW9uIG9mIFNjcm9sbFZpZXcuXG4gICAgICogISN6aCDop4blm77lhoXlrrnlnKjop4Tlrprml7bpl7TlhoXmu5rliqjliLAgU2Nyb2xsVmlldyDlnoLnm7TmlrnlkJHnmoTnmb7liIbmr5TkvY3nva7kuIrjgIJcbiAgICAgKiBAbWV0aG9kIHNjcm9sbFRvUGVyY2VudFZlcnRpY2FsXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHBlcmNlbnQgLSBBIHZhbHVlIGJldHdlZW4gMCBhbmQgMS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3RpbWVJblNlY29uZD0wXSAtIFNjcm9sbCB0aW1lIGluIHNlY29uZCwgaWYgeW91IGRvbid0IHBhc3MgdGltZUluU2Vjb25kLFxuICAgICAqIHRoZSBjb250ZW50IHdpbGwganVtcCB0byB0aGUgdmVydGljYWwgcGVyY2VudCBwb3NpdGlvbiBvZiBTY3JvbGxWaWV3IGltbWVkaWF0ZWx5LlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2F0dGVudWF0ZWQ9dHJ1ZV0gLSBXaGV0aGVyIHRoZSBzY3JvbGwgYWNjZWxlcmF0aW9uIGF0dGVudWF0ZWQsIGRlZmF1bHQgaXMgdHJ1ZS5cbiAgICAgKiAvLyBTY3JvbGwgdG8gbWlkZGxlIHBvc2l0aW9uLlxuICAgICAqIHNjcm9sbFZpZXcuc2Nyb2xsVG9QZXJjZW50VmVydGljYWwoMC41LCAwLjEpO1xuICAgICAqL1xuICAgIHNjcm9sbFRvUGVyY2VudFZlcnRpY2FsIChwZXJjZW50LCB0aW1lSW5TZWNvbmQsIGF0dGVudWF0ZWQpIHtcbiAgICAgICAgbGV0IG1vdmVEZWx0YSA9IHRoaXMuX2NhbGN1bGF0ZU1vdmVQZXJjZW50RGVsdGEoe1xuICAgICAgICAgICAgYW5jaG9yOiBjYy52MigwLCBwZXJjZW50KSxcbiAgICAgICAgICAgIGFwcGx5VG9Ib3Jpem9udGFsOiBmYWxzZSxcbiAgICAgICAgICAgIGFwcGx5VG9WZXJ0aWNhbDogdHJ1ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRpbWVJblNlY29uZCkge1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRBdXRvU2Nyb2xsKG1vdmVEZWx0YSwgdGltZUluU2Vjb25kLCBhdHRlbnVhdGVkICE9PSBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlQ29udGVudChtb3ZlRGVsdGEpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gIFN0b3AgYXV0byBzY3JvbGwgaW1tZWRpYXRlbHlcbiAgICAgKiAhI3poICDlgZzmraLoh6rliqjmu5rliqgsIOiwg+eUqOatpCBBUEkg5Y+v5Lul6K6pIFNjcm9sbHZpZXcg56uL5Y2z5YGc5q2i5rua5YqoXG4gICAgICogQG1ldGhvZCBzdG9wQXV0b1Njcm9sbFxuICAgICAqL1xuICAgIHN0b3BBdXRvU2Nyb2xsICgpIHtcbiAgICAgICAgdGhpcy5fYXV0b1Njcm9sbGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9hdXRvU2Nyb2xsQWNjdW11bGF0ZWRUaW1lID0gdGhpcy5fYXV0b1Njcm9sbFRvdGFsVGltZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBNb2RpZnkgdGhlIGNvbnRlbnQgcG9zaXRpb24uXG4gICAgICogISN6aCDorr7nva7lvZPliY3op4blm77lhoXlrrnnmoTlnZDmoIfngrnjgIJcbiAgICAgKiBAbWV0aG9kIHNldENvbnRlbnRQb3NpdGlvblxuICAgICAqIEBwYXJhbSB7VmVjMn0gcG9zaXRpb24gLSBUaGUgcG9zaXRpb24gaW4gY29udGVudCdzIHBhcmVudCBzcGFjZS5cbiAgICAgKi9cbiAgICBzZXRDb250ZW50UG9zaXRpb24gKHBvc2l0aW9uKSB7XG4gICAgICAgIGlmIChwb3NpdGlvbi5mdXp6eUVxdWFscyh0aGlzLmdldENvbnRlbnRQb3NpdGlvbigpLCBFUFNJTE9OKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb250ZW50LnNldFBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICAgICAgdGhpcy5fb3V0T2ZCb3VuZGFyeUFtb3VudERpcnR5ID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBRdWVyeSB0aGUgY29udGVudCdzIHBvc2l0aW9uIGluIGl0cyBwYXJlbnQgc3BhY2UuXG4gICAgICogISN6aCDojrflj5blvZPliY3op4blm77lhoXlrrnnmoTlnZDmoIfngrnjgIJcbiAgICAgKiBAbWV0aG9kIGdldENvbnRlbnRQb3NpdGlvblxuICAgICAqIEByZXR1cm5zIHtWZWMyfSAtIFRoZSBjb250ZW50J3MgcG9zaXRpb24gaW4gaXRzIHBhcmVudCBzcGFjZS5cbiAgICAgKi9cbiAgICBnZXRDb250ZW50UG9zaXRpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50LmdldFBvc2l0aW9uKCk7XG4gICAgfSxcbiAgICBcbiAgICAvKipcbiAgICAgKiAhI2VuIFF1ZXJ5IHdoZXRoZXIgdGhlIHVzZXIgaXMgY3VycmVudGx5IGRyYWdnaW5nIHRoZSBTY3JvbGxWaWV3IHRvIHNjcm9sbCBpdFxuICAgICAqICEjemgg55So5oi35piv5ZCm5Zyo5ouW5ou95b2T5YmN5rua5Yqo6KeG5Zu+XG4gICAgICogQG1ldGhvZCBpc1Njcm9sbGluZ1xuICAgICAqIEByZXR1cm5zIHtCb29sZWFufSAtIFdoZXRoZXIgdGhlIHVzZXIgaXMgY3VycmVudGx5IGRyYWdnaW5nIHRoZSBTY3JvbGxWaWV3IHRvIHNjcm9sbCBpdFxuICAgICAqL1xuICAgIGlzU2Nyb2xsaW5nICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbGluZztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBRdWVyeSB3aGV0aGVyIHRoZSBTY3JvbGxWaWV3IGlzIGN1cnJlbnRseSBzY3JvbGxpbmcgYmVjYXVzZSBvZiBhIGJvdW5jZWJhY2sgb3IgaW5lcnRpYSBzbG93ZG93bi5cbiAgICAgKiAhI3poIOW9k+WJjea7muWKqOinhuWbvuaYr+WQpuWcqOaDr+aAp+a7muWKqFxuICAgICAqIEBtZXRob2QgaXNBdXRvU2Nyb2xsaW5nXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59IC0gV2hldGhlciB0aGUgU2Nyb2xsVmlldyBpcyBjdXJyZW50bHkgc2Nyb2xsaW5nIGJlY2F1c2Ugb2YgYSBib3VuY2ViYWNrIG9yIGluZXJ0aWEgc2xvd2Rvd24uXG4gICAgICovXG4gICAgaXNBdXRvU2Nyb2xsaW5nICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2F1dG9TY3JvbGxpbmc7XG4gICAgfSxcbiAgICBcbiAgICAvL3ByaXZhdGUgbWV0aG9kc1xuICAgIF9yZWdpc3RlckV2ZW50ICgpIHtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLl9vblRvdWNoQmVnYW4sIHRoaXMsIHRydWUpO1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgdGhpcy5fb25Ub3VjaE1vdmVkLCB0aGlzLCB0cnVlKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5fb25Ub3VjaEVuZGVkLCB0aGlzLCB0cnVlKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0NBTkNFTCwgdGhpcy5fb25Ub3VjaENhbmNlbGxlZCwgdGhpcywgdHJ1ZSk7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9XSEVFTCwgdGhpcy5fb25Nb3VzZVdoZWVsLCB0aGlzLCB0cnVlKTtcbiAgICB9LFxuXG4gICAgX3VucmVnaXN0ZXJFdmVudCAoKSB7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuX29uVG91Y2hCZWdhbiwgdGhpcywgdHJ1ZSk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgdGhpcy5fb25Ub3VjaE1vdmVkLCB0aGlzLCB0cnVlKTtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMuX29uVG91Y2hFbmRlZCwgdGhpcywgdHJ1ZSk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLCB0aGlzLl9vblRvdWNoQ2FuY2VsbGVkLCB0aGlzLCB0cnVlKTtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9XSEVFTCwgdGhpcy5fb25Nb3VzZVdoZWVsLCB0aGlzLCB0cnVlKTtcbiAgICB9LFxuXG4gICAgX29uTW91c2VXaGVlbCAoZXZlbnQsIGNhcHR1cmVMaXN0ZW5lcnMpIHtcbiAgICAgICAgaWYgKCF0aGlzLmVuYWJsZWRJbkhpZXJhcmNoeSkgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy5faGFzTmVzdGVkVmlld0dyb3VwKGV2ZW50LCBjYXB0dXJlTGlzdGVuZXJzKSkgcmV0dXJuO1xuXG4gICAgICAgIGxldCBkZWx0YU1vdmUgPSBjYy52MigwLCAwKTtcbiAgICAgICAgbGV0IHdoZWVsUHJlY2lzaW9uID0gLTAuMTtcbiAgICAgICAgaWYoQ0NfSlNCIHx8IENDX1JVTlRJTUUpIHtcbiAgICAgICAgICAgIHdoZWVsUHJlY2lzaW9uID0gLTc7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy52ZXJ0aWNhbCkge1xuICAgICAgICAgICAgZGVsdGFNb3ZlID0gY2MudjIoMCwgZXZlbnQuZ2V0U2Nyb2xsWSgpICogd2hlZWxQcmVjaXNpb24pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYodGhpcy5ob3Jpem9udGFsKSB7XG4gICAgICAgICAgICBkZWx0YU1vdmUgPSBjYy52MihldmVudC5nZXRTY3JvbGxZKCkgKiB3aGVlbFByZWNpc2lvbiwgMCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9tb3VzZVdoZWVsRXZlbnRFbGFwc2VkVGltZSA9IDA7XG4gICAgICAgIHRoaXMuX3Byb2Nlc3NEZWx0YU1vdmUoZGVsdGFNb3ZlKTtcblxuICAgICAgICBpZighdGhpcy5fc3RvcE1vdXNlV2hlZWwpIHtcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZVByZXNzTG9naWMoKTtcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGUodGhpcy5fY2hlY2tNb3VzZVdoZWVsLCAxLjAgLyA2MCk7XG4gICAgICAgICAgICB0aGlzLl9zdG9wTW91c2VXaGVlbCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9zdG9wUHJvcGFnYXRpb25JZlRhcmdldElzTWUoZXZlbnQpO1xuICAgIH0sXG5cbiAgICBfY2hlY2tNb3VzZVdoZWVsIChkdCkge1xuICAgICAgICBsZXQgY3VycmVudE91dE9mQm91bmRhcnkgPSB0aGlzLl9nZXRIb3dNdWNoT3V0T2ZCb3VuZGFyeSgpO1xuICAgICAgICBsZXQgbWF4RWxhcHNlZFRpbWUgPSAwLjE7XG5cbiAgICAgICAgaWYgKCFjdXJyZW50T3V0T2ZCb3VuZGFyeS5mdXp6eUVxdWFscyhjYy52MigwLCAwKSwgRVBTSUxPTikpIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2Nlc3NJbmVydGlhU2Nyb2xsKCk7XG4gICAgICAgICAgICB0aGlzLnVuc2NoZWR1bGUodGhpcy5fY2hlY2tNb3VzZVdoZWVsKTtcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoJ3Njcm9sbC1lbmRlZCcpO1xuICAgICAgICAgICAgdGhpcy5fc3RvcE1vdXNlV2hlZWwgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX21vdXNlV2hlZWxFdmVudEVsYXBzZWRUaW1lICs9IGR0O1xuXG4gICAgICAgIC8vIG1vdXNlIHdoZWVsIGV2ZW50IGlzIGVuZGVkXG4gICAgICAgIGlmICh0aGlzLl9tb3VzZVdoZWVsRXZlbnRFbGFwc2VkVGltZSA+IG1heEVsYXBzZWRUaW1lKSB7XG4gICAgICAgICAgICB0aGlzLl9vblNjcm9sbEJhclRvdWNoRW5kZWQoKTtcbiAgICAgICAgICAgIHRoaXMudW5zY2hlZHVsZSh0aGlzLl9jaGVja01vdXNlV2hlZWwpO1xuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudCgnc2Nyb2xsLWVuZGVkJyk7XG4gICAgICAgICAgICB0aGlzLl9zdG9wTW91c2VXaGVlbCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9jYWxjdWxhdGVNb3ZlUGVyY2VudERlbHRhIChvcHRpb25zKSB7XG4gICAgICAgIGxldCBhbmNob3IgPSBvcHRpb25zLmFuY2hvcjtcbiAgICAgICAgbGV0IGFwcGx5VG9Ib3Jpem9udGFsID0gb3B0aW9ucy5hcHBseVRvSG9yaXpvbnRhbDtcbiAgICAgICAgbGV0IGFwcGx5VG9WZXJ0aWNhbCA9IG9wdGlvbnMuYXBwbHlUb1ZlcnRpY2FsO1xuICAgICAgICB0aGlzLl9jYWxjdWxhdGVCb3VuZGFyeSgpO1xuXG4gICAgICAgIGFuY2hvciA9IGFuY2hvci5jbGFtcGYoY2MudjIoMCwgMCksIGNjLnYyKDEsIDEpKTtcblxuICAgICAgICBsZXQgc2Nyb2xsU2l6ZSA9IHRoaXMuX3ZpZXcuZ2V0Q29udGVudFNpemUoKTtcbiAgICAgICAgbGV0IGNvbnRlbnRTaXplID0gdGhpcy5jb250ZW50LmdldENvbnRlbnRTaXplKCk7XG4gICAgICAgIGxldCBib3R0b21EZXRhID0gdGhpcy5fZ2V0Q29udGVudEJvdHRvbUJvdW5kYXJ5KCkgLSB0aGlzLl9ib3R0b21Cb3VuZGFyeTtcbiAgICAgICAgYm90dG9tRGV0YSA9IC1ib3R0b21EZXRhO1xuXG4gICAgICAgIGxldCBsZWZ0RGV0YSA9IHRoaXMuX2dldENvbnRlbnRMZWZ0Qm91bmRhcnkoKSAtIHRoaXMuX2xlZnRCb3VuZGFyeTtcbiAgICAgICAgbGVmdERldGEgPSAtbGVmdERldGE7XG5cbiAgICAgICAgbGV0IG1vdmVEZWx0YSA9IGNjLnYyKDAsIDApO1xuICAgICAgICBsZXQgdG90YWxTY3JvbGxEZWx0YSA9IDA7XG4gICAgICAgIGlmIChhcHBseVRvSG9yaXpvbnRhbCkge1xuICAgICAgICAgICAgdG90YWxTY3JvbGxEZWx0YSA9IGNvbnRlbnRTaXplLndpZHRoIC0gc2Nyb2xsU2l6ZS53aWR0aDtcbiAgICAgICAgICAgIG1vdmVEZWx0YS54ID0gbGVmdERldGEgLSB0b3RhbFNjcm9sbERlbHRhICogYW5jaG9yLng7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXBwbHlUb1ZlcnRpY2FsKSB7XG4gICAgICAgICAgICB0b3RhbFNjcm9sbERlbHRhID0gY29udGVudFNpemUuaGVpZ2h0IC0gc2Nyb2xsU2l6ZS5oZWlnaHQ7XG4gICAgICAgICAgICBtb3ZlRGVsdGEueSA9IGJvdHRvbURldGEgLSB0b3RhbFNjcm9sbERlbHRhICogYW5jaG9yLnk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbW92ZURlbHRhO1xuICAgIH0sXG5cbiAgICBfbW92ZUNvbnRlbnRUb1RvcExlZnQgKHNjcm9sbFZpZXdTaXplKSB7XG4gICAgICAgIGxldCBjb250ZW50U2l6ZSA9IHRoaXMuY29udGVudC5nZXRDb250ZW50U2l6ZSgpO1xuXG4gICAgICAgIGxldCBib3R0b21EZXRhID0gdGhpcy5fZ2V0Q29udGVudEJvdHRvbUJvdW5kYXJ5KCkgLSB0aGlzLl9ib3R0b21Cb3VuZGFyeTtcbiAgICAgICAgYm90dG9tRGV0YSA9IC1ib3R0b21EZXRhO1xuICAgICAgICBsZXQgbW92ZURlbHRhID0gY2MudjIoMCwgMCk7XG4gICAgICAgIGxldCB0b3RhbFNjcm9sbERlbHRhID0gMDtcblxuICAgICAgICBsZXQgbGVmdERldGEgPSB0aGlzLl9nZXRDb250ZW50TGVmdEJvdW5kYXJ5KCkgLSB0aGlzLl9sZWZ0Qm91bmRhcnk7XG4gICAgICAgIGxlZnREZXRhID0gLWxlZnREZXRhO1xuXG4gICAgICAgIGlmIChjb250ZW50U2l6ZS5oZWlnaHQgPCBzY3JvbGxWaWV3U2l6ZS5oZWlnaHQpIHtcbiAgICAgICAgICAgIHRvdGFsU2Nyb2xsRGVsdGEgPSBjb250ZW50U2l6ZS5oZWlnaHQgLSBzY3JvbGxWaWV3U2l6ZS5oZWlnaHQ7XG4gICAgICAgICAgICBtb3ZlRGVsdGEueSA9IGJvdHRvbURldGEgLSB0b3RhbFNjcm9sbERlbHRhO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRlbnRTaXplLndpZHRoIDwgc2Nyb2xsVmlld1NpemUud2lkdGgpIHtcbiAgICAgICAgICAgIHRvdGFsU2Nyb2xsRGVsdGEgPSBjb250ZW50U2l6ZS53aWR0aCAtIHNjcm9sbFZpZXdTaXplLndpZHRoO1xuICAgICAgICAgICAgbW92ZURlbHRhLnggPSBsZWZ0RGV0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3VwZGF0ZVNjcm9sbEJhclN0YXRlKCk7XG4gICAgICAgIHRoaXMuX21vdmVDb250ZW50KG1vdmVEZWx0YSk7XG4gICAgICAgIHRoaXMuX2FkanVzdENvbnRlbnRPdXRPZkJvdW5kYXJ5KCk7XG4gICAgfSxcblxuICAgIF9jYWxjdWxhdGVCb3VuZGFyeSAoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRlbnQpIHtcbiAgICAgICAgICAgIC8vcmVmcmVzaCBjb250ZW50IHNpemVcbiAgICAgICAgICAgIGxldCBsYXlvdXQgPSB0aGlzLmNvbnRlbnQuZ2V0Q29tcG9uZW50KGNjLkxheW91dCk7XG4gICAgICAgICAgICBpZihsYXlvdXQgJiYgbGF5b3V0LmVuYWJsZWRJbkhpZXJhcmNoeSkge1xuICAgICAgICAgICAgICAgIGxheW91dC51cGRhdGVMYXlvdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCB2aWV3U2l6ZSA9IHRoaXMuX3ZpZXcuZ2V0Q29udGVudFNpemUoKTtcblxuICAgICAgICAgICAgbGV0IGFuY2hvclggPSB2aWV3U2l6ZS53aWR0aCAqIHRoaXMuX3ZpZXcuYW5jaG9yWDtcbiAgICAgICAgICAgIGxldCBhbmNob3JZID0gdmlld1NpemUuaGVpZ2h0ICogdGhpcy5fdmlldy5hbmNob3JZO1xuXG4gICAgICAgICAgICB0aGlzLl9sZWZ0Qm91bmRhcnkgPSAtYW5jaG9yWDtcbiAgICAgICAgICAgIHRoaXMuX2JvdHRvbUJvdW5kYXJ5ID0gLWFuY2hvclk7XG5cbiAgICAgICAgICAgIHRoaXMuX3JpZ2h0Qm91bmRhcnkgPSB0aGlzLl9sZWZ0Qm91bmRhcnkgKyB2aWV3U2l6ZS53aWR0aDtcbiAgICAgICAgICAgIHRoaXMuX3RvcEJvdW5kYXJ5ID0gdGhpcy5fYm90dG9tQm91bmRhcnkgKyB2aWV3U2l6ZS5oZWlnaHQ7XG5cbiAgICAgICAgICAgIHRoaXMuX21vdmVDb250ZW50VG9Ub3BMZWZ0KHZpZXdTaXplKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvL3RoaXMgaXMgZm9yIG5lc3RlZCBzY3JvbGx2aWV3XG4gICAgX2hhc05lc3RlZFZpZXdHcm91cCAoZXZlbnQsIGNhcHR1cmVMaXN0ZW5lcnMpIHtcbiAgICAgICAgaWYgKGV2ZW50LmV2ZW50UGhhc2UgIT09IGNjLkV2ZW50LkNBUFRVUklOR19QSEFTRSkgcmV0dXJuO1xuXG4gICAgICAgIGlmIChjYXB0dXJlTGlzdGVuZXJzKSB7XG4gICAgICAgICAgICAvL2NhcHR1cmVMaXN0ZW5lcnMgYXJlIGFycmFuZ2VkIGZyb20gY2hpbGQgdG8gcGFyZW50XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNhcHR1cmVMaXN0ZW5lcnMubGVuZ3RoOyArK2kpe1xuICAgICAgICAgICAgICAgIGxldCBpdGVtID0gY2FwdHVyZUxpc3RlbmVyc1tpXTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm5vZGUgPT09IGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5nZXRDb21wb25lbnQoY2MuVmlld0dyb3VwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmKGl0ZW0uZ2V0Q29tcG9uZW50KGNjLlZpZXdHcm91cCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLy9UaGlzIGlzIGZvciBTY3JvbGx2aWV3IGFzIGNoaWxkcmVuIG9mIGEgQnV0dG9uXG4gICAgX3N0b3BQcm9wYWdhdGlvbklmVGFyZ2V0SXNNZSAoZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LmV2ZW50UGhhc2UgPT09IGNjLkV2ZW50LkFUX1RBUkdFVCAmJiBldmVudC50YXJnZXQgPT09IHRoaXMubm9kZSkge1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdG91Y2ggZXZlbnQgaGFuZGxlclxuICAgIF9vblRvdWNoQmVnYW4gKGV2ZW50LCBjYXB0dXJlTGlzdGVuZXJzKSB7XG4gICAgICAgIGlmICghdGhpcy5lbmFibGVkSW5IaWVyYXJjaHkpIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMuX2hhc05lc3RlZFZpZXdHcm91cChldmVudCwgY2FwdHVyZUxpc3RlbmVycykpIHJldHVybjtcblxuICAgICAgICBsZXQgdG91Y2ggPSBldmVudC50b3VjaDtcbiAgICAgICAgaWYgKHRoaXMuY29udGVudCkge1xuICAgICAgICAgICAgdGhpcy5faGFuZGxlUHJlc3NMb2dpYyh0b3VjaCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdG91Y2hNb3ZlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9zdG9wUHJvcGFnYXRpb25JZlRhcmdldElzTWUoZXZlbnQpO1xuICAgIH0sXG5cbiAgICBfb25Ub3VjaE1vdmVkIChldmVudCwgY2FwdHVyZUxpc3RlbmVycykge1xuICAgICAgICBpZiAoIXRoaXMuZW5hYmxlZEluSGllcmFyY2h5KSByZXR1cm47XG4gICAgICAgIGlmICh0aGlzLl9oYXNOZXN0ZWRWaWV3R3JvdXAoZXZlbnQsIGNhcHR1cmVMaXN0ZW5lcnMpKSByZXR1cm47XG5cbiAgICAgICAgbGV0IHRvdWNoID0gZXZlbnQudG91Y2g7XG4gICAgICAgIGlmICh0aGlzLmNvbnRlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZU1vdmVMb2dpYyh0b3VjaCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRG8gbm90IHByZXZlbnQgdG91Y2ggZXZlbnRzIGluIGlubmVyIG5vZGVzXG4gICAgICAgIGlmICghdGhpcy5jYW5jZWxJbm5lckV2ZW50cykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGRlbHRhTW92ZSA9IHRvdWNoLmdldExvY2F0aW9uKCkuc3ViKHRvdWNoLmdldFN0YXJ0TG9jYXRpb24oKSk7XG4gICAgICAgIC8vRklYTUU6IHRvdWNoIG1vdmUgZGVsdGEgc2hvdWxkIGJlIGNhbGN1bGF0ZWQgYnkgRFBJLlxuICAgICAgICBpZiAoZGVsdGFNb3ZlLm1hZygpID4gNykge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl90b3VjaE1vdmVkICYmIGV2ZW50LnRhcmdldCAhPT0gdGhpcy5ub2RlKSB7XG4gICAgICAgICAgICAgICAgLy8gU2ltdWxhdGUgdG91Y2ggY2FuY2VsIGZvciB0YXJnZXQgbm9kZVxuICAgICAgICAgICAgICAgIGxldCBjYW5jZWxFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudFRvdWNoKGV2ZW50LmdldFRvdWNoZXMoKSwgZXZlbnQuYnViYmxlcyk7XG4gICAgICAgICAgICAgICAgY2FuY2VsRXZlbnQudHlwZSA9IGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0NBTkNFTDtcbiAgICAgICAgICAgICAgICBjYW5jZWxFdmVudC50b3VjaCA9IGV2ZW50LnRvdWNoO1xuICAgICAgICAgICAgICAgIGNhbmNlbEV2ZW50LnNpbXVsYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBldmVudC50YXJnZXQuZGlzcGF0Y2hFdmVudChjYW5jZWxFdmVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fdG91Y2hNb3ZlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc3RvcFByb3BhZ2F0aW9uSWZUYXJnZXRJc01lKGV2ZW50KTtcbiAgICB9LFxuXG4gICAgX29uVG91Y2hFbmRlZCAoZXZlbnQsIGNhcHR1cmVMaXN0ZW5lcnMpIHtcbiAgICAgICAgaWYgKCF0aGlzLmVuYWJsZWRJbkhpZXJhcmNoeSkgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy5faGFzTmVzdGVkVmlld0dyb3VwKGV2ZW50LCBjYXB0dXJlTGlzdGVuZXJzKSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoJ3RvdWNoLXVwJyk7XG5cbiAgICAgICAgbGV0IHRvdWNoID0gZXZlbnQudG91Y2g7XG4gICAgICAgIGlmICh0aGlzLmNvbnRlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZVJlbGVhc2VMb2dpYyh0b3VjaCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX3RvdWNoTW92ZWQpIHtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fc3RvcFByb3BhZ2F0aW9uSWZUYXJnZXRJc01lKGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfb25Ub3VjaENhbmNlbGxlZCAoZXZlbnQsIGNhcHR1cmVMaXN0ZW5lcnMpIHtcbiAgICAgICAgaWYgKCF0aGlzLmVuYWJsZWRJbkhpZXJhcmNoeSkgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy5faGFzTmVzdGVkVmlld0dyb3VwKGV2ZW50LCBjYXB0dXJlTGlzdGVuZXJzKSkgcmV0dXJuO1xuXG4gICAgICAgIC8vIEZpbHRlIHRvdWNoIGNhbmNlbCBldmVudCBzZW5kIGZyb20gc2VsZlxuICAgICAgICBpZiAoIWV2ZW50LnNpbXVsYXRlKSB7XG4gICAgICAgICAgICBsZXQgdG91Y2ggPSBldmVudC50b3VjaDtcbiAgICAgICAgICAgIGlmKHRoaXMuY29udGVudCl7XG4gICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlUmVsZWFzZUxvZ2ljKHRvdWNoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zdG9wUHJvcGFnYXRpb25JZlRhcmdldElzTWUoZXZlbnQpO1xuICAgIH0sXG5cbiAgICBfcHJvY2Vzc0RlbHRhTW92ZSAoZGVsdGFNb3ZlKSB7XG4gICAgICAgIHRoaXMuX3Njcm9sbENoaWxkcmVuKGRlbHRhTW92ZSk7XG4gICAgICAgIHRoaXMuX2dhdGhlclRvdWNoTW92ZShkZWx0YU1vdmUpO1xuICAgIH0sXG5cbiAgICAvLyBDb250YWlucyBub2RlIGFuZ2xlIGNhbGN1bGF0aW9uc1xuICAgIF9nZXRMb2NhbEF4aXNBbGlnbkRlbHRhICh0b3VjaCkge1xuICAgICAgICB0aGlzLm5vZGUuY29udmVydFRvTm9kZVNwYWNlQVIodG91Y2guZ2V0TG9jYXRpb24oKSwgX3RlbXBQb2ludCk7XG4gICAgICAgIHRoaXMubm9kZS5jb252ZXJ0VG9Ob2RlU3BhY2VBUih0b3VjaC5nZXRQcmV2aW91c0xvY2F0aW9uKCksIF90ZW1wUHJldlBvaW50KTtcbiAgICAgICAgcmV0dXJuIF90ZW1wUG9pbnQuc3ViKF90ZW1wUHJldlBvaW50KTtcbiAgICB9LFxuXG4gICAgX2hhbmRsZU1vdmVMb2dpYyAodG91Y2gpIHtcbiAgICAgICAgbGV0IGRlbHRhTW92ZSA9IHRoaXMuX2dldExvY2FsQXhpc0FsaWduRGVsdGEodG91Y2gpO1xuICAgICAgICB0aGlzLl9wcm9jZXNzRGVsdGFNb3ZlKGRlbHRhTW92ZSk7XG4gICAgfSxcblxuICAgIF9zY3JvbGxDaGlsZHJlbiAoZGVsdGFNb3ZlKSB7XG4gICAgICAgIGRlbHRhTW92ZSA9IHRoaXMuX2NsYW1wRGVsdGEoZGVsdGFNb3ZlKTtcblxuICAgICAgICBsZXQgcmVhbE1vdmUgPSBkZWx0YU1vdmU7XG4gICAgICAgIGxldCBvdXRPZkJvdW5kYXJ5O1xuICAgICAgICBpZiAodGhpcy5lbGFzdGljKSB7XG4gICAgICAgICAgICBvdXRPZkJvdW5kYXJ5ID0gdGhpcy5fZ2V0SG93TXVjaE91dE9mQm91bmRhcnkoKTtcbiAgICAgICAgICAgIHJlYWxNb3ZlLnggKj0gKG91dE9mQm91bmRhcnkueCA9PT0gMCA/IDEgOiAwLjUpO1xuICAgICAgICAgICAgcmVhbE1vdmUueSAqPSAob3V0T2ZCb3VuZGFyeS55ID09PSAwID8gMSA6IDAuNSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuZWxhc3RpYykge1xuICAgICAgICAgICAgb3V0T2ZCb3VuZGFyeSA9IHRoaXMuX2dldEhvd011Y2hPdXRPZkJvdW5kYXJ5KHJlYWxNb3ZlKTtcbiAgICAgICAgICAgIHJlYWxNb3ZlID0gcmVhbE1vdmUuYWRkKG91dE9mQm91bmRhcnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNjcm9sbEV2ZW50VHlwZSA9IC0xO1xuXG4gICAgICAgIGlmIChyZWFsTW92ZS55ID4gMCkgeyAvL3VwXG4gICAgICAgICAgICBsZXQgaWNCb3R0b21Qb3MgPSB0aGlzLmNvbnRlbnQueSAtIHRoaXMuY29udGVudC5hbmNob3JZICogdGhpcy5jb250ZW50LmhlaWdodDtcblxuICAgICAgICAgICAgaWYgKGljQm90dG9tUG9zICsgcmVhbE1vdmUueSA+PSB0aGlzLl9ib3R0b21Cb3VuZGFyeSkge1xuICAgICAgICAgICAgICAgIHNjcm9sbEV2ZW50VHlwZSA9ICdzY3JvbGwtdG8tYm90dG9tJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChyZWFsTW92ZS55IDwgMCkgeyAvL2Rvd25cbiAgICAgICAgICAgIGxldCBpY1RvcFBvcyA9IHRoaXMuY29udGVudC55IC0gdGhpcy5jb250ZW50LmFuY2hvclkgKiB0aGlzLmNvbnRlbnQuaGVpZ2h0ICsgdGhpcy5jb250ZW50LmhlaWdodDtcblxuICAgICAgICAgICAgaWYgKGljVG9wUG9zICsgcmVhbE1vdmUueSA8PSB0aGlzLl90b3BCb3VuZGFyeSkge1xuICAgICAgICAgICAgICAgIHNjcm9sbEV2ZW50VHlwZSA9ICdzY3JvbGwtdG8tdG9wJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocmVhbE1vdmUueCA8IDApIHsgLy9sZWZ0XG4gICAgICAgICAgICBsZXQgaWNSaWdodFBvcyA9IHRoaXMuY29udGVudC54IC0gdGhpcy5jb250ZW50LmFuY2hvclggKiB0aGlzLmNvbnRlbnQud2lkdGggKyB0aGlzLmNvbnRlbnQud2lkdGg7XG4gICAgICAgICAgICBpZiAoaWNSaWdodFBvcyArIHJlYWxNb3ZlLnggPD0gdGhpcy5fcmlnaHRCb3VuZGFyeSkge1xuICAgICAgICAgICAgICAgIHNjcm9sbEV2ZW50VHlwZSA9ICdzY3JvbGwtdG8tcmlnaHQnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHJlYWxNb3ZlLnggPiAwKSB7IC8vcmlnaHRcbiAgICAgICAgICAgIGxldCBpY0xlZnRQb3MgPSB0aGlzLmNvbnRlbnQueCAtIHRoaXMuY29udGVudC5hbmNob3JYICogdGhpcy5jb250ZW50LndpZHRoO1xuICAgICAgICAgICAgaWYgKGljTGVmdFBvcyArIHJlYWxNb3ZlLnggPj0gdGhpcy5fbGVmdEJvdW5kYXJ5KSB7XG4gICAgICAgICAgICAgICAgc2Nyb2xsRXZlbnRUeXBlID0gJ3Njcm9sbC10by1sZWZ0JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX21vdmVDb250ZW50KHJlYWxNb3ZlLCBmYWxzZSk7XG5cbiAgICAgICAgaWYgKHJlYWxNb3ZlLnggIT09IDAgfHwgcmVhbE1vdmUueSAhPT0gMCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9zY3JvbGxpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoJ3Njcm9sbC1iZWdhbicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudCgnc2Nyb2xsaW5nJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2Nyb2xsRXZlbnRUeXBlICE9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudChzY3JvbGxFdmVudFR5cGUpO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgX2hhbmRsZVByZXNzTG9naWMgKCkge1xuICAgICAgICBpZiAodGhpcy5fYXV0b1Njcm9sbGluZykge1xuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudCgnc2Nyb2xsLWVuZGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fYXV0b1Njcm9sbGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pc0JvdW5jaW5nID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5fdG91Y2hNb3ZlUHJldmlvdXNUaW1lc3RhbXAgPSBnZXRUaW1lSW5NaWxsaXNlY29uZHMoKTtcbiAgICAgICAgdGhpcy5fdG91Y2hNb3ZlRGlzcGxhY2VtZW50cy5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLl90b3VjaE1vdmVUaW1lRGVsdGFzLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgdGhpcy5fb25TY3JvbGxCYXJUb3VjaEJlZ2FuKCk7XG4gICAgfSxcblxuICAgIF9jbGFtcERlbHRhIChkZWx0YSkge1xuICAgICAgICBsZXQgY29udGVudFNpemUgPSB0aGlzLmNvbnRlbnQuZ2V0Q29udGVudFNpemUoKTtcbiAgICAgICAgbGV0IHNjcm9sbFZpZXdTaXplID0gdGhpcy5fdmlldy5nZXRDb250ZW50U2l6ZSgpO1xuICAgICAgICBpZiAoY29udGVudFNpemUud2lkdGggPCBzY3JvbGxWaWV3U2l6ZS53aWR0aCkge1xuICAgICAgICAgICAgZGVsdGEueCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbnRlbnRTaXplLmhlaWdodCA8IHNjcm9sbFZpZXdTaXplLmhlaWdodCkge1xuICAgICAgICAgICAgZGVsdGEueSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGVsdGE7XG4gICAgfSxcblxuICAgIF9nYXRoZXJUb3VjaE1vdmUgKGRlbHRhKSB7XG4gICAgICAgIGRlbHRhID0gdGhpcy5fY2xhbXBEZWx0YShkZWx0YSk7XG5cbiAgICAgICAgd2hpbGUgKHRoaXMuX3RvdWNoTW92ZURpc3BsYWNlbWVudHMubGVuZ3RoID49IE5VTUJFUl9PRl9HQVRIRVJFRF9UT1VDSEVTX0ZPUl9NT1ZFX1NQRUVEKSB7XG4gICAgICAgICAgICB0aGlzLl90b3VjaE1vdmVEaXNwbGFjZW1lbnRzLnNoaWZ0KCk7XG4gICAgICAgICAgICB0aGlzLl90b3VjaE1vdmVUaW1lRGVsdGFzLnNoaWZ0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl90b3VjaE1vdmVEaXNwbGFjZW1lbnRzLnB1c2goZGVsdGEpO1xuXG4gICAgICAgIGxldCB0aW1lU3RhbXAgPSBnZXRUaW1lSW5NaWxsaXNlY29uZHMoKTtcbiAgICAgICAgdGhpcy5fdG91Y2hNb3ZlVGltZURlbHRhcy5wdXNoKCh0aW1lU3RhbXAgLSB0aGlzLl90b3VjaE1vdmVQcmV2aW91c1RpbWVzdGFtcCkgLyAxMDAwKTtcbiAgICAgICAgdGhpcy5fdG91Y2hNb3ZlUHJldmlvdXNUaW1lc3RhbXAgPSB0aW1lU3RhbXA7XG4gICAgfSxcblxuICAgIF9zdGFydEJvdW5jZUJhY2tJZk5lZWRlZCAoKSB7XG4gICAgICAgIGlmICghdGhpcy5lbGFzdGljKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYm91bmNlQmFja0Ftb3VudCA9IHRoaXMuX2dldEhvd011Y2hPdXRPZkJvdW5kYXJ5KCk7XG4gICAgICAgIGJvdW5jZUJhY2tBbW91bnQgPSB0aGlzLl9jbGFtcERlbHRhKGJvdW5jZUJhY2tBbW91bnQpO1xuXG4gICAgICAgIGlmIChib3VuY2VCYWNrQW1vdW50LmZ1enp5RXF1YWxzKGNjLnYyKDAsIDApLCBFUFNJTE9OKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGJvdW5jZUJhY2tUaW1lID0gTWF0aC5tYXgodGhpcy5ib3VuY2VEdXJhdGlvbiwgMCk7XG4gICAgICAgIHRoaXMuX3N0YXJ0QXV0b1Njcm9sbChib3VuY2VCYWNrQW1vdW50LCBib3VuY2VCYWNrVGltZSwgdHJ1ZSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9pc0JvdW5jaW5nKSB7XG4gICAgICAgICAgICBpZiAoYm91bmNlQmFja0Ftb3VudC55ID4gMCkgdGhpcy5fZGlzcGF0Y2hFdmVudCgnYm91bmNlLXRvcCcpO1xuICAgICAgICAgICAgaWYgKGJvdW5jZUJhY2tBbW91bnQueSA8IDApIHRoaXMuX2Rpc3BhdGNoRXZlbnQoJ2JvdW5jZS1ib3R0b20nKTtcbiAgICAgICAgICAgIGlmIChib3VuY2VCYWNrQW1vdW50LnggPiAwKSB0aGlzLl9kaXNwYXRjaEV2ZW50KCdib3VuY2UtcmlnaHQnKTtcbiAgICAgICAgICAgIGlmIChib3VuY2VCYWNrQW1vdW50LnggPCAwKSB0aGlzLl9kaXNwYXRjaEV2ZW50KCdib3VuY2UtbGVmdCcpO1xuICAgICAgICAgICAgdGhpcy5faXNCb3VuY2luZyA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgX3Byb2Nlc3NJbmVydGlhU2Nyb2xsICgpIHtcbiAgICAgICAgbGV0IGJvdW5jZUJhY2tTdGFydGVkID0gdGhpcy5fc3RhcnRCb3VuY2VCYWNrSWZOZWVkZWQoKTtcbiAgICAgICAgaWYgKCFib3VuY2VCYWNrU3RhcnRlZCAmJiB0aGlzLmluZXJ0aWEpIHtcbiAgICAgICAgICAgIGxldCB0b3VjaE1vdmVWZWxvY2l0eSA9IHRoaXMuX2NhbGN1bGF0ZVRvdWNoTW92ZVZlbG9jaXR5KCk7XG4gICAgICAgICAgICBpZiAoIXRvdWNoTW92ZVZlbG9jaXR5LmZ1enp5RXF1YWxzKGNjLnYyKDAsIDApLCBFUFNJTE9OKSAmJiB0aGlzLmJyYWtlIDwgMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXJ0SW5lcnRpYVNjcm9sbCh0b3VjaE1vdmVWZWxvY2l0eSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9vblNjcm9sbEJhclRvdWNoRW5kZWQoKTtcbiAgICB9LFxuXG4gICAgX2hhbmRsZVJlbGVhc2VMb2dpYyAodG91Y2gpIHtcbiAgICAgICAgbGV0IGRlbHRhID0gdGhpcy5fZ2V0TG9jYWxBeGlzQWxpZ25EZWx0YSh0b3VjaCk7XG4gICAgICAgIHRoaXMuX2dhdGhlclRvdWNoTW92ZShkZWx0YSk7XG4gICAgICAgIHRoaXMuX3Byb2Nlc3NJbmVydGlhU2Nyb2xsKCk7XG4gICAgICAgIGlmICh0aGlzLl9zY3JvbGxpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9hdXRvU2Nyb2xsaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudCgnc2Nyb2xsLWVuZGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2lzT3V0T2ZCb3VuZGFyeSAoKSB7XG4gICAgICAgIGxldCBvdXRPZkJvdW5kYXJ5ID0gdGhpcy5fZ2V0SG93TXVjaE91dE9mQm91bmRhcnkoKTtcbiAgICAgICAgcmV0dXJuICFvdXRPZkJvdW5kYXJ5LmZ1enp5RXF1YWxzKGNjLnYyKDAsIDApLCBFUFNJTE9OKTtcbiAgICB9LFxuXG4gICAgX2lzTmVjZXNzYXJ5QXV0b1Njcm9sbEJyYWtlICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2F1dG9TY3JvbGxCcmFraW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9pc091dE9mQm91bmRhcnkoKSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9hdXRvU2Nyb2xsQ3VycmVudGx5T3V0T2ZCb3VuZGFyeSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2F1dG9TY3JvbGxDdXJyZW50bHlPdXRPZkJvdW5kYXJ5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9hdXRvU2Nyb2xsQnJha2luZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXV0b1Njcm9sbEJyYWtpbmdTdGFydFBvc2l0aW9uID0gdGhpcy5nZXRDb250ZW50UG9zaXRpb24oKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fYXV0b1Njcm9sbEN1cnJlbnRseU91dE9mQm91bmRhcnkgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgZ2V0U2Nyb2xsRW5kZWRFdmVudFRpbWluZyAoKSB7XG4gICAgICAgIHJldHVybiBFUFNJTE9OO1xuICAgIH0sXG5cbiAgICBfcHJvY2Vzc0F1dG9TY3JvbGxpbmcgKGR0KSB7XG4gICAgICAgIGxldCBpc0F1dG9TY3JvbGxCcmFrZSA9IHRoaXMuX2lzTmVjZXNzYXJ5QXV0b1Njcm9sbEJyYWtlKCk7XG4gICAgICAgIGxldCBicmFraW5nRmFjdG9yID0gaXNBdXRvU2Nyb2xsQnJha2UgPyBPVVRfT0ZfQk9VTkRBUllfQlJFQUtJTkdfRkFDVE9SIDogMTtcbiAgICAgICAgdGhpcy5fYXV0b1Njcm9sbEFjY3VtdWxhdGVkVGltZSArPSBkdCAqICgxIC8gYnJha2luZ0ZhY3Rvcik7XG5cbiAgICAgICAgbGV0IHBlcmNlbnRhZ2UgPSBNYXRoLm1pbigxLCB0aGlzLl9hdXRvU2Nyb2xsQWNjdW11bGF0ZWRUaW1lIC8gdGhpcy5fYXV0b1Njcm9sbFRvdGFsVGltZSk7XG4gICAgICAgIGlmICh0aGlzLl9hdXRvU2Nyb2xsQXR0ZW51YXRlKSB7XG4gICAgICAgICAgICBwZXJjZW50YWdlID0gcXVpbnRFYXNlT3V0KHBlcmNlbnRhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG5ld1Bvc2l0aW9uID0gdGhpcy5fYXV0b1Njcm9sbFN0YXJ0UG9zaXRpb24uYWRkKHRoaXMuX2F1dG9TY3JvbGxUYXJnZXREZWx0YS5tdWwocGVyY2VudGFnZSkpO1xuICAgICAgICBsZXQgcmVhY2hlZEVuZCA9IE1hdGguYWJzKHBlcmNlbnRhZ2UgLSAxKSA8PSBFUFNJTE9OO1xuXG4gICAgICAgIGxldCBmaXJlRXZlbnQgPSBNYXRoLmFicyhwZXJjZW50YWdlIC0gMSkgPD0gdGhpcy5nZXRTY3JvbGxFbmRlZEV2ZW50VGltaW5nKCk7XG4gICAgICAgIGlmIChmaXJlRXZlbnQgJiYgIXRoaXMuX2lzU2Nyb2xsRW5kZWRXaXRoVGhyZXNob2xkRXZlbnRGaXJlZCkge1xuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudCgnc2Nyb2xsLWVuZGVkLXdpdGgtdGhyZXNob2xkJyk7XG4gICAgICAgICAgICB0aGlzLl9pc1Njcm9sbEVuZGVkV2l0aFRocmVzaG9sZEV2ZW50RmlyZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZWxhc3RpYykge1xuICAgICAgICAgICAgbGV0IGJyYWtlT2Zmc2V0UG9zaXRpb24gPSBuZXdQb3NpdGlvbi5zdWIodGhpcy5fYXV0b1Njcm9sbEJyYWtpbmdTdGFydFBvc2l0aW9uKTtcbiAgICAgICAgICAgIGlmIChpc0F1dG9TY3JvbGxCcmFrZSkge1xuICAgICAgICAgICAgICAgIGJyYWtlT2Zmc2V0UG9zaXRpb24gPSBicmFrZU9mZnNldFBvc2l0aW9uLm11bChicmFraW5nRmFjdG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld1Bvc2l0aW9uID0gdGhpcy5fYXV0b1Njcm9sbEJyYWtpbmdTdGFydFBvc2l0aW9uLmFkZChicmFrZU9mZnNldFBvc2l0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBtb3ZlRGVsdGEgPSBuZXdQb3NpdGlvbi5zdWIodGhpcy5nZXRDb250ZW50UG9zaXRpb24oKSk7XG4gICAgICAgICAgICBsZXQgb3V0T2ZCb3VuZGFyeSA9IHRoaXMuX2dldEhvd011Y2hPdXRPZkJvdW5kYXJ5KG1vdmVEZWx0YSk7XG4gICAgICAgICAgICBpZiAoIW91dE9mQm91bmRhcnkuZnV6enlFcXVhbHMoY2MudjIoMCwgMCksIEVQU0lMT04pKSB7XG4gICAgICAgICAgICAgICAgbmV3UG9zaXRpb24gPSBuZXdQb3NpdGlvbi5hZGQob3V0T2ZCb3VuZGFyeSk7XG4gICAgICAgICAgICAgICAgcmVhY2hlZEVuZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVhY2hlZEVuZCkge1xuICAgICAgICAgICAgdGhpcy5fYXV0b1Njcm9sbGluZyA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGRlbHRhTW92ZSA9IG5ld1Bvc2l0aW9uLnN1Yih0aGlzLmdldENvbnRlbnRQb3NpdGlvbigpKTtcbiAgICAgICAgdGhpcy5fbW92ZUNvbnRlbnQodGhpcy5fY2xhbXBEZWx0YShkZWx0YU1vdmUpLCByZWFjaGVkRW5kKTtcbiAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudCgnc2Nyb2xsaW5nJyk7XG5cbiAgICAgICAgLy8gc2NvbGxUbyBBUEkgY29udHJvbGwgbW92ZVxuICAgICAgICBpZiAoIXRoaXMuX2F1dG9TY3JvbGxpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuX2lzQm91bmNpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudCgnc2Nyb2xsLWVuZGVkJyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3N0YXJ0SW5lcnRpYVNjcm9sbCAodG91Y2hNb3ZlVmVsb2NpdHkpIHtcbiAgICAgICAgbGV0IGluZXJ0aWFUb3RhbE1vdmVtZW50ID0gdG91Y2hNb3ZlVmVsb2NpdHkubXVsKE1PVkVNRU5UX0ZBQ1RPUik7XG4gICAgICAgIHRoaXMuX3N0YXJ0QXR0ZW51YXRpbmdBdXRvU2Nyb2xsKGluZXJ0aWFUb3RhbE1vdmVtZW50LCB0b3VjaE1vdmVWZWxvY2l0eSk7XG4gICAgfSxcblxuICAgIF9jYWxjdWxhdGVBdHRlbnVhdGVkRmFjdG9yIChkaXN0YW5jZSkge1xuICAgICAgICBpZiAodGhpcy5icmFrZSA8PSAwKXtcbiAgICAgICAgICAgIHJldHVybiAoMSAtIHRoaXMuYnJha2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9hdHRlbnVhdGUgZm9ybXVsYSBmcm9tOiBodHRwOi8vbGVhcm5vcGVuZ2wuY29tLyMhTGlnaHRpbmcvTGlnaHQtY2FzdGVyc1xuICAgICAgICByZXR1cm4gKDEgLSB0aGlzLmJyYWtlKSAqICgxIC8gKDEgKyBkaXN0YW5jZSAqIDAuMDAwMDE0ICsgZGlzdGFuY2UgKiBkaXN0YW5jZSAqIDAuMDAwMDAwMDA4KSk7XG4gICAgfSxcblxuICAgIF9zdGFydEF0dGVudWF0aW5nQXV0b1Njcm9sbCAoZGVsdGFNb3ZlLCBpbml0aWFsVmVsb2NpdHkpIHtcbiAgICAgICAgbGV0IHRpbWUgPSB0aGlzLl9jYWxjdWxhdGVBdXRvU2Nyb2xsVGltZUJ5SW5pdGFsU3BlZWQoaW5pdGlhbFZlbG9jaXR5Lm1hZygpKTtcblxuXG4gICAgICAgIGxldCB0YXJnZXREZWx0YSA9IGRlbHRhTW92ZS5ub3JtYWxpemUoKTtcbiAgICAgICAgbGV0IGNvbnRlbnRTaXplID0gdGhpcy5jb250ZW50LmdldENvbnRlbnRTaXplKCk7XG4gICAgICAgIGxldCBzY3JvbGx2aWV3U2l6ZSA9IHRoaXMuX3ZpZXcuZ2V0Q29udGVudFNpemUoKTtcblxuICAgICAgICBsZXQgdG90YWxNb3ZlV2lkdGggPSAoY29udGVudFNpemUud2lkdGggLSBzY3JvbGx2aWV3U2l6ZS53aWR0aCk7XG4gICAgICAgIGxldCB0b3RhbE1vdmVIZWlnaHQgPSAoY29udGVudFNpemUuaGVpZ2h0IC0gc2Nyb2xsdmlld1NpemUuaGVpZ2h0KTtcblxuICAgICAgICBsZXQgYXR0ZW51YXRlZEZhY3RvclggPSB0aGlzLl9jYWxjdWxhdGVBdHRlbnVhdGVkRmFjdG9yKHRvdGFsTW92ZVdpZHRoKTtcbiAgICAgICAgbGV0IGF0dGVudWF0ZWRGYWN0b3JZID0gdGhpcy5fY2FsY3VsYXRlQXR0ZW51YXRlZEZhY3Rvcih0b3RhbE1vdmVIZWlnaHQpO1xuXG4gICAgICAgIHRhcmdldERlbHRhID0gY2MudjIodGFyZ2V0RGVsdGEueCAqIHRvdGFsTW92ZVdpZHRoICogKDEgLSB0aGlzLmJyYWtlKSAqIGF0dGVudWF0ZWRGYWN0b3JYLCB0YXJnZXREZWx0YS55ICogdG90YWxNb3ZlSGVpZ2h0ICogYXR0ZW51YXRlZEZhY3RvclkgKiAoMSAtIHRoaXMuYnJha2UpKTtcblxuICAgICAgICBsZXQgb3JpZ2luYWxNb3ZlTGVuZ3RoID0gZGVsdGFNb3ZlLm1hZygpO1xuICAgICAgICBsZXQgZmFjdG9yID0gdGFyZ2V0RGVsdGEubWFnKCkgLyBvcmlnaW5hbE1vdmVMZW5ndGg7XG4gICAgICAgIHRhcmdldERlbHRhID0gdGFyZ2V0RGVsdGEuYWRkKGRlbHRhTW92ZSk7XG5cbiAgICAgICAgaWYgKHRoaXMuYnJha2UgPiAwICYmIGZhY3RvciA+IDcpIHtcbiAgICAgICAgICAgIGZhY3RvciA9IE1hdGguc3FydChmYWN0b3IpO1xuICAgICAgICAgICAgdGFyZ2V0RGVsdGEgPSBkZWx0YU1vdmUubXVsKGZhY3RvcikuYWRkKGRlbHRhTW92ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5icmFrZSA+IDAgJiYgZmFjdG9yID4gMykge1xuICAgICAgICAgICAgZmFjdG9yID0gMztcbiAgICAgICAgICAgIHRpbWUgPSB0aW1lICogZmFjdG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuYnJha2UgPT09IDAgJiYgZmFjdG9yID4gMSkge1xuICAgICAgICAgICAgdGltZSA9IHRpbWUgKiBmYWN0b3I7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9zdGFydEF1dG9TY3JvbGwodGFyZ2V0RGVsdGEsIHRpbWUsIHRydWUpO1xuICAgIH0sXG5cbiAgICBfY2FsY3VsYXRlQXV0b1Njcm9sbFRpbWVCeUluaXRhbFNwZWVkIChpbml0YWxTcGVlZCkge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGguc3FydChpbml0YWxTcGVlZCAvIDUpKTtcbiAgICB9LFxuXG4gICAgX3N0YXJ0QXV0b1Njcm9sbCAoZGVsdGFNb3ZlLCB0aW1lSW5TZWNvbmQsIGF0dGVudWF0ZWQpIHtcbiAgICAgICAgbGV0IGFkanVzdGVkRGVsdGFNb3ZlID0gdGhpcy5fZmxhdHRlblZlY3RvckJ5RGlyZWN0aW9uKGRlbHRhTW92ZSk7XG5cbiAgICAgICAgdGhpcy5fYXV0b1Njcm9sbGluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuX2F1dG9TY3JvbGxUYXJnZXREZWx0YSA9IGFkanVzdGVkRGVsdGFNb3ZlO1xuICAgICAgICB0aGlzLl9hdXRvU2Nyb2xsQXR0ZW51YXRlID0gYXR0ZW51YXRlZDtcbiAgICAgICAgdGhpcy5fYXV0b1Njcm9sbFN0YXJ0UG9zaXRpb24gPSB0aGlzLmdldENvbnRlbnRQb3NpdGlvbigpO1xuICAgICAgICB0aGlzLl9hdXRvU2Nyb2xsVG90YWxUaW1lID0gdGltZUluU2Vjb25kO1xuICAgICAgICB0aGlzLl9hdXRvU2Nyb2xsQWNjdW11bGF0ZWRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fYXV0b1Njcm9sbEJyYWtpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5faXNTY3JvbGxFbmRlZFdpdGhUaHJlc2hvbGRFdmVudEZpcmVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2F1dG9TY3JvbGxCcmFraW5nU3RhcnRQb3NpdGlvbiA9IGNjLnYyKDAsIDApO1xuXG4gICAgICAgIGxldCBjdXJyZW50T3V0T2ZCb3VuZGFyeSA9IHRoaXMuX2dldEhvd011Y2hPdXRPZkJvdW5kYXJ5KCk7XG4gICAgICAgIGlmICghY3VycmVudE91dE9mQm91bmRhcnkuZnV6enlFcXVhbHMoY2MudjIoMCwgMCksIEVQU0lMT04pKSB7XG4gICAgICAgICAgICB0aGlzLl9hdXRvU2Nyb2xsQ3VycmVudGx5T3V0T2ZCb3VuZGFyeSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2NhbGN1bGF0ZVRvdWNoTW92ZVZlbG9jaXR5ICgpIHtcbiAgICAgICAgbGV0IHRvdGFsVGltZSA9IDA7XG4gICAgICAgIHRvdGFsVGltZSA9IHRoaXMuX3RvdWNoTW92ZVRpbWVEZWx0YXMucmVkdWNlKGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBhICsgYjtcbiAgICAgICAgfSwgdG90YWxUaW1lKTtcblxuICAgICAgICBpZiAodG90YWxUaW1lIDw9IDAgfHwgdG90YWxUaW1lID49IDAuNSkge1xuICAgICAgICAgICAgcmV0dXJuIGNjLnYyKDAsIDApO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHRvdGFsTW92ZW1lbnQgPSBjYy52MigwLCAwKTtcbiAgICAgICAgdG90YWxNb3ZlbWVudCA9IHRoaXMuX3RvdWNoTW92ZURpc3BsYWNlbWVudHMucmVkdWNlKGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBhLmFkZChiKTtcbiAgICAgICAgfSwgdG90YWxNb3ZlbWVudCk7XG5cbiAgICAgICAgcmV0dXJuIGNjLnYyKHRvdGFsTW92ZW1lbnQueCAqICgxIC0gdGhpcy5icmFrZSkgLyB0b3RhbFRpbWUsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsTW92ZW1lbnQueSAqICgxIC0gdGhpcy5icmFrZSkgLyB0b3RhbFRpbWUpO1xuICAgIH0sXG5cbiAgICBfZmxhdHRlblZlY3RvckJ5RGlyZWN0aW9uICh2ZWN0b3IpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHZlY3RvcjtcbiAgICAgICAgcmVzdWx0LnggPSB0aGlzLmhvcml6b250YWwgPyByZXN1bHQueCA6IDA7XG4gICAgICAgIHJlc3VsdC55ID0gdGhpcy52ZXJ0aWNhbCA/IHJlc3VsdC55IDogMDtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuXG4gICAgX21vdmVDb250ZW50IChkZWx0YU1vdmUsIGNhblN0YXJ0Qm91bmNlQmFjaykge1xuICAgICAgICBsZXQgYWRqdXN0ZWRNb3ZlID0gdGhpcy5fZmxhdHRlblZlY3RvckJ5RGlyZWN0aW9uKGRlbHRhTW92ZSk7XG4gICAgICAgIGxldCBuZXdQb3NpdGlvbiA9IHRoaXMuZ2V0Q29udGVudFBvc2l0aW9uKCkuYWRkKGFkanVzdGVkTW92ZSk7XG5cbiAgICAgICAgdGhpcy5zZXRDb250ZW50UG9zaXRpb24obmV3UG9zaXRpb24pO1xuXG4gICAgICAgIGxldCBvdXRPZkJvdW5kYXJ5ID0gdGhpcy5fZ2V0SG93TXVjaE91dE9mQm91bmRhcnkoKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlU2Nyb2xsQmFyKG91dE9mQm91bmRhcnkpO1xuXG4gICAgICAgIGlmICh0aGlzLmVsYXN0aWMgJiYgY2FuU3RhcnRCb3VuY2VCYWNrKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGFydEJvdW5jZUJhY2tJZk5lZWRlZCgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9nZXRDb250ZW50TGVmdEJvdW5kYXJ5ICgpIHtcbiAgICAgICAgbGV0IGNvbnRlbnRQb3MgPSB0aGlzLmdldENvbnRlbnRQb3NpdGlvbigpO1xuICAgICAgICByZXR1cm4gY29udGVudFBvcy54IC0gdGhpcy5jb250ZW50LmdldEFuY2hvclBvaW50KCkueCAqIHRoaXMuY29udGVudC5nZXRDb250ZW50U2l6ZSgpLndpZHRoO1xuICAgIH0sXG5cbiAgICBfZ2V0Q29udGVudFJpZ2h0Qm91bmRhcnkgKCkge1xuICAgICAgICBsZXQgY29udGVudFNpemUgPSB0aGlzLmNvbnRlbnQuZ2V0Q29udGVudFNpemUoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldENvbnRlbnRMZWZ0Qm91bmRhcnkoKSArIGNvbnRlbnRTaXplLndpZHRoO1xuICAgIH0sXG5cbiAgICBfZ2V0Q29udGVudFRvcEJvdW5kYXJ5ICgpIHtcbiAgICAgICAgbGV0IGNvbnRlbnRTaXplID0gdGhpcy5jb250ZW50LmdldENvbnRlbnRTaXplKCk7XG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRDb250ZW50Qm90dG9tQm91bmRhcnkoKSArIGNvbnRlbnRTaXplLmhlaWdodDtcbiAgICB9LFxuXG4gICAgX2dldENvbnRlbnRCb3R0b21Cb3VuZGFyeSAoKSB7XG4gICAgICAgIGxldCBjb250ZW50UG9zID0gdGhpcy5nZXRDb250ZW50UG9zaXRpb24oKTtcbiAgICAgICAgcmV0dXJuIGNvbnRlbnRQb3MueSAtIHRoaXMuY29udGVudC5nZXRBbmNob3JQb2ludCgpLnkgKiB0aGlzLmNvbnRlbnQuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQ7XG4gICAgfSxcblxuICAgIF9nZXRIb3dNdWNoT3V0T2ZCb3VuZGFyeSAoYWRkaXRpb24pIHtcbiAgICAgICAgYWRkaXRpb24gPSBhZGRpdGlvbiB8fCBjYy52MigwLCAwKTtcbiAgICAgICAgaWYgKGFkZGl0aW9uLmZ1enp5RXF1YWxzKGNjLnYyKDAsIDApLCBFUFNJTE9OKSAmJiAhdGhpcy5fb3V0T2ZCb3VuZGFyeUFtb3VudERpcnR5KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb3V0T2ZCb3VuZGFyeUFtb3VudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBvdXRPZkJvdW5kYXJ5QW1vdW50ID0gY2MudjIoMCwgMCk7XG4gICAgICAgIGlmICh0aGlzLl9nZXRDb250ZW50TGVmdEJvdW5kYXJ5KCkgKyBhZGRpdGlvbi54ID4gdGhpcy5fbGVmdEJvdW5kYXJ5KSB7XG4gICAgICAgICAgICBvdXRPZkJvdW5kYXJ5QW1vdW50LnggPSB0aGlzLl9sZWZ0Qm91bmRhcnkgLSAodGhpcy5fZ2V0Q29udGVudExlZnRCb3VuZGFyeSgpICsgYWRkaXRpb24ueCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fZ2V0Q29udGVudFJpZ2h0Qm91bmRhcnkoKSArIGFkZGl0aW9uLnggPCB0aGlzLl9yaWdodEJvdW5kYXJ5KSB7XG4gICAgICAgICAgICBvdXRPZkJvdW5kYXJ5QW1vdW50LnggPSB0aGlzLl9yaWdodEJvdW5kYXJ5IC0gKHRoaXMuX2dldENvbnRlbnRSaWdodEJvdW5kYXJ5KCkgKyBhZGRpdGlvbi54KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9nZXRDb250ZW50VG9wQm91bmRhcnkoKSArIGFkZGl0aW9uLnkgPCB0aGlzLl90b3BCb3VuZGFyeSkge1xuICAgICAgICAgICAgb3V0T2ZCb3VuZGFyeUFtb3VudC55ID0gdGhpcy5fdG9wQm91bmRhcnkgLSAodGhpcy5fZ2V0Q29udGVudFRvcEJvdW5kYXJ5KCkgKyBhZGRpdGlvbi55KTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9nZXRDb250ZW50Qm90dG9tQm91bmRhcnkoKSArIGFkZGl0aW9uLnkgPiB0aGlzLl9ib3R0b21Cb3VuZGFyeSkge1xuICAgICAgICAgICAgb3V0T2ZCb3VuZGFyeUFtb3VudC55ID0gdGhpcy5fYm90dG9tQm91bmRhcnkgLSAodGhpcy5fZ2V0Q29udGVudEJvdHRvbUJvdW5kYXJ5KCkgKyBhZGRpdGlvbi55KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhZGRpdGlvbi5mdXp6eUVxdWFscyhjYy52MigwLCAwKSwgRVBTSUxPTikpIHtcbiAgICAgICAgICAgIHRoaXMuX291dE9mQm91bmRhcnlBbW91bnQgPSBvdXRPZkJvdW5kYXJ5QW1vdW50O1xuICAgICAgICAgICAgdGhpcy5fb3V0T2ZCb3VuZGFyeUFtb3VudERpcnR5ID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBvdXRPZkJvdW5kYXJ5QW1vdW50ID0gdGhpcy5fY2xhbXBEZWx0YShvdXRPZkJvdW5kYXJ5QW1vdW50KTtcblxuICAgICAgICByZXR1cm4gb3V0T2ZCb3VuZGFyeUFtb3VudDtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZVNjcm9sbEJhclN0YXRlICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRlbnQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY29udGVudFNpemUgPSB0aGlzLmNvbnRlbnQuZ2V0Q29udGVudFNpemUoKTtcbiAgICAgICAgbGV0IHNjcm9sbFZpZXdTaXplID0gdGhpcy5fdmlldy5nZXRDb250ZW50U2l6ZSgpO1xuICAgICAgICBpZiAodGhpcy52ZXJ0aWNhbFNjcm9sbEJhcikge1xuICAgICAgICAgICAgaWYgKGNvbnRlbnRTaXplLmhlaWdodCA8IHNjcm9sbFZpZXdTaXplLmhlaWdodCkge1xuICAgICAgICAgICAgICAgIHRoaXMudmVydGljYWxTY3JvbGxCYXIuaGlkZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRpY2FsU2Nyb2xsQmFyLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmhvcml6b250YWxTY3JvbGxCYXIpIHtcbiAgICAgICAgICAgIGlmIChjb250ZW50U2l6ZS53aWR0aCA8IHNjcm9sbFZpZXdTaXplLndpZHRoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ob3Jpem9udGFsU2Nyb2xsQmFyLmhpZGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ob3Jpem9udGFsU2Nyb2xsQmFyLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfdXBkYXRlU2Nyb2xsQmFyIChvdXRPZkJvdW5kYXJ5KSB7XG4gICAgICAgIGlmICh0aGlzLmhvcml6b250YWxTY3JvbGxCYXIpIHtcbiAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbFNjcm9sbEJhci5fb25TY3JvbGwob3V0T2ZCb3VuZGFyeSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy52ZXJ0aWNhbFNjcm9sbEJhcikge1xuICAgICAgICAgICAgdGhpcy52ZXJ0aWNhbFNjcm9sbEJhci5fb25TY3JvbGwob3V0T2ZCb3VuZGFyeSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX29uU2Nyb2xsQmFyVG91Y2hCZWdhbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmhvcml6b250YWxTY3JvbGxCYXIpIHtcbiAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbFNjcm9sbEJhci5fb25Ub3VjaEJlZ2FuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy52ZXJ0aWNhbFNjcm9sbEJhcikge1xuICAgICAgICAgICAgdGhpcy52ZXJ0aWNhbFNjcm9sbEJhci5fb25Ub3VjaEJlZ2FuKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX29uU2Nyb2xsQmFyVG91Y2hFbmRlZCAoKSB7XG4gICAgICAgIGlmICh0aGlzLmhvcml6b250YWxTY3JvbGxCYXIpIHtcbiAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbFNjcm9sbEJhci5fb25Ub3VjaEVuZGVkKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy52ZXJ0aWNhbFNjcm9sbEJhcikge1xuICAgICAgICAgICAgdGhpcy52ZXJ0aWNhbFNjcm9sbEJhci5fb25Ub3VjaEVuZGVkKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2Rpc3BhdGNoRXZlbnQgKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudCA9PT0gJ3Njcm9sbC1lbmRlZCcpIHtcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbEV2ZW50RW1pdE1hc2sgPSAwO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQgPT09ICdzY3JvbGwtdG8tdG9wJ1xuICAgICAgICAgICAgICAgICAgIHx8IGV2ZW50ID09PSAnc2Nyb2xsLXRvLWJvdHRvbSdcbiAgICAgICAgICAgICAgICAgICB8fCBldmVudCA9PT0gJ3Njcm9sbC10by1sZWZ0J1xuICAgICAgICAgICAgICAgICAgIHx8IGV2ZW50ID09PSAnc2Nyb2xsLXRvLXJpZ2h0Jykge1xuXG4gICAgICAgICAgICBsZXQgZmxhZyA9ICgxIDw8IGV2ZW50TWFwW2V2ZW50XSk7XG4gICAgICAgICAgICBpZiAodGhpcy5fc2Nyb2xsRXZlbnRFbWl0TWFzayAmIGZsYWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Njcm9sbEV2ZW50RW1pdE1hc2sgfD0gZmxhZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXIuZW1pdEV2ZW50cyh0aGlzLnNjcm9sbEV2ZW50cywgdGhpcywgZXZlbnRNYXBbZXZlbnRdKTtcbiAgICAgICAgdGhpcy5ub2RlLmVtaXQoZXZlbnQsIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfYWRqdXN0Q29udGVudE91dE9mQm91bmRhcnkgKCkge1xuICAgICAgICB0aGlzLl9vdXRPZkJvdW5kYXJ5QW1vdW50RGlydHkgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5faXNPdXRPZkJvdW5kYXJ5KCkpIHtcbiAgICAgICAgICAgIGxldCBvdXRPZkJvdW5kYXJ5ID0gdGhpcy5fZ2V0SG93TXVjaE91dE9mQm91bmRhcnkoY2MudjIoMCwgMCkpO1xuICAgICAgICAgICAgbGV0IG5ld1Bvc2l0aW9uID0gdGhpcy5nZXRDb250ZW50UG9zaXRpb24oKS5hZGQob3V0T2ZCb3VuZGFyeSk7XG4gICAgICAgICAgICBpZiAodGhpcy5jb250ZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LnNldFBvc2l0aW9uKG5ld1Bvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVTY3JvbGxCYXIoMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RhcnQgKCkge1xuICAgICAgICB0aGlzLl9jYWxjdWxhdGVCb3VuZGFyeSgpO1xuICAgICAgICAvL0JlY2F1c2Ugd2lkZ2V0IGNvbXBvbmVudCB3aWxsIGFkanVzdCBjb250ZW50IHBvc2l0aW9uIGFuZCBzY3JvbGx2aWV3IHBvc2l0aW9uIGlzIGNvcnJlY3QgYWZ0ZXIgdmlzaXRcbiAgICAgICAgLy9TbyB0aGlzIGV2ZW50IGNvdWxkIG1ha2Ugc3VyZSB0aGUgY29udGVudCBpcyBvbiB0aGUgY29ycmVjdCBwb3NpdGlvbiBhZnRlciBsb2FkaW5nLlxuICAgICAgICBpZiAodGhpcy5jb250ZW50KSB7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5vbmNlKGNjLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9EUkFXLCB0aGlzLl9hZGp1c3RDb250ZW50T3V0T2ZCb3VuZGFyeSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2hpZGVTY3JvbGxiYXIgKCkge1xuICAgICAgICBpZiAodGhpcy5ob3Jpem9udGFsU2Nyb2xsQmFyKSB7XG4gICAgICAgICAgICB0aGlzLmhvcml6b250YWxTY3JvbGxCYXIuaGlkZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMudmVydGljYWxTY3JvbGxCYXIpIHtcbiAgICAgICAgICAgIHRoaXMudmVydGljYWxTY3JvbGxCYXIuaGlkZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uRGlzYWJsZSAoKSB7XG4gICAgICAgIGlmICghQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICB0aGlzLl91bnJlZ2lzdGVyRXZlbnQoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRlbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQub2ZmKE5vZGVFdmVudC5TSVpFX0NIQU5HRUQsIHRoaXMuX2NhbGN1bGF0ZUJvdW5kYXJ5LCB0aGlzKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQub2ZmKE5vZGVFdmVudC5TQ0FMRV9DSEFOR0VELCB0aGlzLl9jYWxjdWxhdGVCb3VuZGFyeSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3ZpZXcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmlldy5vZmYoTm9kZUV2ZW50LlBPU0lUSU9OX0NIQU5HRUQsIHRoaXMuX2NhbGN1bGF0ZUJvdW5kYXJ5LCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmlldy5vZmYoTm9kZUV2ZW50LlNDQUxFX0NIQU5HRUQsIHRoaXMuX2NhbGN1bGF0ZUJvdW5kYXJ5LCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmlldy5vZmYoTm9kZUV2ZW50LlNJWkVfQ0hBTkdFRCwgdGhpcy5fY2FsY3VsYXRlQm91bmRhcnksIHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9oaWRlU2Nyb2xsYmFyKCk7XG4gICAgICAgIHRoaXMuc3RvcEF1dG9TY3JvbGwoKTtcbiAgICB9LFxuXG4gICAgb25FbmFibGUgKCkge1xuICAgICAgICBpZiAoIUNDX0VESVRPUikge1xuICAgICAgICAgICAgdGhpcy5fcmVnaXN0ZXJFdmVudCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuY29udGVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC5vbihOb2RlRXZlbnQuU0laRV9DSEFOR0VELCB0aGlzLl9jYWxjdWxhdGVCb3VuZGFyeSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZW50Lm9uKE5vZGVFdmVudC5TQ0FMRV9DSEFOR0VELCB0aGlzLl9jYWxjdWxhdGVCb3VuZGFyeSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3ZpZXcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmlldy5vbihOb2RlRXZlbnQuUE9TSVRJT05fQ0hBTkdFRCwgdGhpcy5fY2FsY3VsYXRlQm91bmRhcnksIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl92aWV3Lm9uKE5vZGVFdmVudC5TQ0FMRV9DSEFOR0VELCB0aGlzLl9jYWxjdWxhdGVCb3VuZGFyeSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZpZXcub24oTm9kZUV2ZW50LlNJWkVfQ0hBTkdFRCwgdGhpcy5fY2FsY3VsYXRlQm91bmRhcnksIHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl91cGRhdGVTY3JvbGxCYXJTdGF0ZSgpO1xuICAgIH0sXG5cbiAgICB1cGRhdGUgKGR0KSB7XG4gICAgICAgIGlmICh0aGlzLl9hdXRvU2Nyb2xsaW5nKSB7XG4gICAgICAgICAgICB0aGlzLl9wcm9jZXNzQXV0b1Njcm9sbGluZyhkdCk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuU2Nyb2xsVmlldyA9IG1vZHVsZS5leHBvcnRzID0gU2Nyb2xsVmlldztcblxuLyoqXG4gKiAhI2VuXG4gKiBOb3RlOiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgZnJvbSB0aGUgbm9kZSB0byB3aGljaCB0aGUgY29tcG9uZW50IGJlbG9uZ3MuXG4gKiAhI3poXG4gKiDms6jmhI/vvJrmraTkuovku7bmmK/ku47or6Xnu4Tku7bmiYDlsZ7nmoQgTm9kZSDkuIrpnaLmtL7lj5Hlh7rmnaXnmoTvvIzpnIDopoHnlKggbm9kZS5vbiDmnaXnm5HlkKzjgIJcbiAqIEBldmVudCBzY3JvbGwtdG8tdG9wXG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxuICogQHBhcmFtIHtTY3JvbGxWaWV3fSBzY3JvbGxWaWV3IC0gVGhlIFNjcm9sbFZpZXcgY29tcG9uZW50LlxuICovXG5cbi8qKlxuICogISNlblxuICogTm90ZTogVGhpcyBldmVudCBpcyBlbWl0dGVkIGZyb20gdGhlIG5vZGUgdG8gd2hpY2ggdGhlIGNvbXBvbmVudCBiZWxvbmdzLlxuICogISN6aFxuICog5rOo5oSP77ya5q2k5LqL5Lu25piv5LuO6K+l57uE5Lu25omA5bGe55qEIE5vZGUg5LiK6Z2i5rS+5Y+R5Ye65p2l55qE77yM6ZyA6KaB55SoIG5vZGUub24g5p2l55uR5ZCs44CCXG4gKiBAZXZlbnQgc2Nyb2xsLXRvLWJvdHRvbVxuICogQHBhcmFtIHtFdmVudC5FdmVudEN1c3RvbX0gZXZlbnRcbiAqIEBwYXJhbSB7U2Nyb2xsVmlld30gc2Nyb2xsVmlldyAtIFRoZSBTY3JvbGxWaWV3IGNvbXBvbmVudC5cbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cbiAqICEjemhcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxuICogQGV2ZW50IHNjcm9sbC10by1sZWZ0XG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxuICogQHBhcmFtIHtTY3JvbGxWaWV3fSBzY3JvbGxWaWV3IC0gVGhlIFNjcm9sbFZpZXcgY29tcG9uZW50LlxuICovXG5cbi8qKlxuICogISNlblxuICogTm90ZTogVGhpcyBldmVudCBpcyBlbWl0dGVkIGZyb20gdGhlIG5vZGUgdG8gd2hpY2ggdGhlIGNvbXBvbmVudCBiZWxvbmdzLlxuICogISN6aFxuICog5rOo5oSP77ya5q2k5LqL5Lu25piv5LuO6K+l57uE5Lu25omA5bGe55qEIE5vZGUg5LiK6Z2i5rS+5Y+R5Ye65p2l55qE77yM6ZyA6KaB55SoIG5vZGUub24g5p2l55uR5ZCs44CCXG4gKiBAZXZlbnQgc2Nyb2xsLXRvLXJpZ2h0XG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxuICogQHBhcmFtIHtTY3JvbGxWaWV3fSBzY3JvbGxWaWV3IC0gVGhlIFNjcm9sbFZpZXcgY29tcG9uZW50LlxuICovXG5cbi8qKlxuICogISNlblxuICogTm90ZTogVGhpcyBldmVudCBpcyBlbWl0dGVkIGZyb20gdGhlIG5vZGUgdG8gd2hpY2ggdGhlIGNvbXBvbmVudCBiZWxvbmdzLlxuICogISN6aFxuICog5rOo5oSP77ya5q2k5LqL5Lu25piv5LuO6K+l57uE5Lu25omA5bGe55qEIE5vZGUg5LiK6Z2i5rS+5Y+R5Ye65p2l55qE77yM6ZyA6KaB55SoIG5vZGUub24g5p2l55uR5ZCs44CCXG4gKiBAZXZlbnQgc2Nyb2xsaW5nXG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxuICogQHBhcmFtIHtTY3JvbGxWaWV3fSBzY3JvbGxWaWV3IC0gVGhlIFNjcm9sbFZpZXcgY29tcG9uZW50LlxuICovXG5cbi8qKlxuICogISNlblxuICogTm90ZTogVGhpcyBldmVudCBpcyBlbWl0dGVkIGZyb20gdGhlIG5vZGUgdG8gd2hpY2ggdGhlIGNvbXBvbmVudCBiZWxvbmdzLlxuICogISN6aFxuICog5rOo5oSP77ya5q2k5LqL5Lu25piv5LuO6K+l57uE5Lu25omA5bGe55qEIE5vZGUg5LiK6Z2i5rS+5Y+R5Ye65p2l55qE77yM6ZyA6KaB55SoIG5vZGUub24g5p2l55uR5ZCs44CCXG4gKiBAZXZlbnQgYm91bmNlLWJvdHRvbVxuICogQHBhcmFtIHtFdmVudC5FdmVudEN1c3RvbX0gZXZlbnRcbiAqIEBwYXJhbSB7U2Nyb2xsVmlld30gc2Nyb2xsVmlldyAtIFRoZSBTY3JvbGxWaWV3IGNvbXBvbmVudC5cbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cbiAqICEjemhcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxuICogQGV2ZW50IGJvdW5jZS10b3BcbiAqIEBwYXJhbSB7RXZlbnQuRXZlbnRDdXN0b219IGV2ZW50XG4gKiBAcGFyYW0ge1Njcm9sbFZpZXd9IHNjcm9sbFZpZXcgLSBUaGUgU2Nyb2xsVmlldyBjb21wb25lbnQuXG4gKi9cblxuLyoqXG4gKiAhI2VuXG4gKiBOb3RlOiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgZnJvbSB0aGUgbm9kZSB0byB3aGljaCB0aGUgY29tcG9uZW50IGJlbG9uZ3MuXG4gKiAhI3poXG4gKiDms6jmhI/vvJrmraTkuovku7bmmK/ku47or6Xnu4Tku7bmiYDlsZ7nmoQgTm9kZSDkuIrpnaLmtL7lj5Hlh7rmnaXnmoTvvIzpnIDopoHnlKggbm9kZS5vbiDmnaXnm5HlkKzjgIJcbiAqIEBldmVudCBib3VuY2UtbGVmdFxuICogQHBhcmFtIHtFdmVudC5FdmVudEN1c3RvbX0gZXZlbnRcbiAqIEBwYXJhbSB7U2Nyb2xsVmlld30gc2Nyb2xsVmlldyAtIFRoZSBTY3JvbGxWaWV3IGNvbXBvbmVudC5cbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cbiAqICEjemhcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxuICogQGV2ZW50IGJvdW5jZS1yaWdodFxuICogQHBhcmFtIHtFdmVudC5FdmVudEN1c3RvbX0gZXZlbnRcbiAqIEBwYXJhbSB7U2Nyb2xsVmlld30gc2Nyb2xsVmlldyAtIFRoZSBTY3JvbGxWaWV3IGNvbXBvbmVudC5cbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cbiAqICEjemhcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxuICogQGV2ZW50IHNjcm9sbC1lbmRlZFxuICogQHBhcmFtIHtFdmVudC5FdmVudEN1c3RvbX0gZXZlbnRcbiAqIEBwYXJhbSB7U2Nyb2xsVmlld30gc2Nyb2xsVmlldyAtIFRoZSBTY3JvbGxWaWV3IGNvbXBvbmVudC5cbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cbiAqICEjemhcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxuICogQGV2ZW50IHRvdWNoLXVwXG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxuICogQHBhcmFtIHtTY3JvbGxWaWV3fSBzY3JvbGxWaWV3IC0gVGhlIFNjcm9sbFZpZXcgY29tcG9uZW50LlxuICovXG5cbiAvKipcbiAqICEjZW5cbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cbiAqICEjemhcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxuICogQGV2ZW50IHNjcm9sbC1iZWdhblxuICogQHBhcmFtIHtFdmVudC5FdmVudEN1c3RvbX0gZXZlbnRcbiAqIEBwYXJhbSB7U2Nyb2xsVmlld30gc2Nyb2xsVmlldyAtIFRoZSBTY3JvbGxWaWV3IGNvbXBvbmVudC5cbiAqL1xuIl19