
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCPageView.js';
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

/**
 * !#en The Page View Size Mode
 * !#zh 页面视图每个页面统一的大小类型
 * @enum PageView.SizeMode
 */
var SizeMode = cc.Enum({
  /**
   * !#en Each page is unified in size
   * !#zh 每个页面统一大小
   * @property {Number} Unified
   */
  Unified: 0,

  /**
   * !#en Each page is in free size
   * !#zh 每个页面大小随意
   * @property {Number} Free
   */
  Free: 1
});
/**
 * !#en The Page View Direction
 * !#zh 页面视图滚动类型
 * @enum PageView.Direction
 */

var Direction = cc.Enum({
  /**
   * !#en Horizontal scroll.
   * !#zh 水平滚动
   * @property {Number} Horizontal
   */
  Horizontal: 0,

  /**
   * !#en Vertical scroll.
   * !#zh 垂直滚动
   * @property {Number} Vertical
   */
  Vertical: 1
});
/**
 * !#en Enum for ScrollView event type.
 * !#zh 滚动视图事件类型
 * @enum PageView.EventType
 */

var EventType = cc.Enum({
  /**
   * !#en The page turning event
   * !#zh 翻页事件
   * @property {Number} PAGE_TURNING
   */
  PAGE_TURNING: 0
});
/**
 * !#en The PageView control
 * !#zh 页面视图组件
 * @class PageView
 * @extends ScrollView
 */

var PageView = cc.Class({
  name: 'cc.PageView',
  "extends": cc.ScrollView,
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.ui/PageView',
    help: 'i18n:COMPONENT.help_url.pageview',
    inspector: 'packages://inspector/inspectors/comps/ccpageview.js',
    executeInEditMode: false
  },
  ctor: function ctor() {
    this._curPageIdx = 0;
    this._lastPageIdx = 0;
    this._pages = [];
    this._initContentPos = cc.v2();
    this._scrollCenterOffsetX = []; // 每一个页面居中时需要的偏移量（X）

    this._scrollCenterOffsetY = []; // 每一个页面居中时需要的偏移量（Y）
  },
  properties: {
    /**
     * !#en Specify the size type of each page in PageView.
     * !#zh 页面视图中每个页面大小类型
     * @property {PageView.SizeMode} sizeMode
     */
    sizeMode: {
      "default": SizeMode.Unified,
      type: SizeMode,
      tooltip: CC_DEV && 'i18n:COMPONENT.pageview.sizeMode',
      notify: function notify() {
        this._syncSizeMode();
      }
    },

    /**
     * !#en The page view direction
     * !#zh 页面视图滚动类型
     * @property {PageView.Direction} direction
     */
    direction: {
      "default": Direction.Horizontal,
      type: Direction,
      tooltip: CC_DEV && 'i18n:COMPONENT.pageview.direction',
      notify: function notify() {
        this._syncScrollDirection();
      }
    },

    /**
     * !#en
     * The scroll threshold value, when drag exceeds this value,
     * release the next page will automatically scroll, less than the restore
     * !#zh 滚动临界值，默认单位百分比，当拖拽超出该数值时，松开会自动滚动下一页，小于时则还原。
     * @property {Number} scrollThreshold
     */
    scrollThreshold: {
      "default": 0.5,
      type: cc.Float,
      slide: true,
      range: [0, 1, 0.01],
      tooltip: CC_DEV && 'i18n:COMPONENT.pageview.scrollThreshold'
    },

    /**
     * !#en
     * Auto page turning velocity threshold. When users swipe the PageView quickly,
     * it will calculate a velocity based on the scroll distance and time,
     * if the calculated velocity is larger than the threshold, then it will trigger page turning.
     * !#zh
     * 快速滑动翻页临界值。
     * 当用户快速滑动时，会根据滑动开始和结束的距离与时间计算出一个速度值，
     * 该值与此临界值相比较，如果大于临界值，则进行自动翻页。
     * @property {Number} autoPageTurningThreshold
     */
    autoPageTurningThreshold: {
      "default": 100,
      type: cc.Float,
      tooltip: CC_DEV && 'i18n:COMPONENT.pageview.autoPageTurningThreshold'
    },

    /**
     * !#en Change the PageTurning event timing of PageView.
     * !#zh 设置 PageView PageTurning 事件的发送时机。
     * @property {Number} pageTurningEventTiming
     */
    pageTurningEventTiming: {
      "default": 0.1,
      type: cc.Float,
      range: [0, 1, 0.01],
      tooltip: CC_DEV && 'i18n:COMPONENT.pageview.pageTurningEventTiming'
    },

    /**
     * !#en The Page View Indicator
     * !#zh 页面视图指示器组件
     * @property {PageViewIndicator} indicator
     */
    indicator: {
      "default": null,
      type: cc.PageViewIndicator,
      tooltip: CC_DEV && 'i18n:COMPONENT.pageview.indicator',
      notify: function notify() {
        if (this.indicator) {
          this.indicator.setPageView(this);
        }
      }
    },

    /**
     * !#en The time required to turn over a page. unit: second
     * !#zh 每个页面翻页时所需时间。单位：秒
     * @property {Number} pageTurningSpeed
     */
    pageTurningSpeed: {
      "default": 0.3,
      type: cc.Float,
      tooltip: CC_DEV && 'i18n:COMPONENT.pageview.pageTurningSpeed'
    },

    /**
     * !#en PageView events callback
     * !#zh 滚动视图的事件回调函数
     * @property {Component.EventHandler[]} pageEvents
     */
    pageEvents: {
      "default": [],
      type: cc.Component.EventHandler,
      tooltip: CC_DEV && 'i18n:COMPONENT.pageview.pageEvents'
    }
  },
  statics: {
    SizeMode: SizeMode,
    Direction: Direction,
    EventType: EventType
  },
  __preload: function __preload() {
    this.node.on(cc.Node.EventType.SIZE_CHANGED, this._updateAllPagesSize, this);
  },
  onEnable: function onEnable() {
    this._super();

    if (!CC_EDITOR) {
      this.node.on('scroll-ended-with-threshold', this._dispatchPageTurningEvent, this);
    }
  },
  onDisable: function onDisable() {
    this._super();

    if (!CC_EDITOR) {
      this.node.off('scroll-ended-with-threshold', this._dispatchPageTurningEvent, this);
    }
  },
  onLoad: function onLoad() {
    this._initPages();

    if (this.indicator) {
      this.indicator.setPageView(this);
    }
  },
  onDestroy: function onDestroy() {
    this.node.off(cc.Node.EventType.SIZE_CHANGED, this._updateAllPagesSize, this);
  },

  /**
   * !#en Returns current page index
   * !#zh 返回当前页面索引
   * @method getCurrentPageIndex
   * @returns {Number}
   */
  getCurrentPageIndex: function getCurrentPageIndex() {
    return this._curPageIdx;
  },

  /**
   * !#en Set current page index
   * !#zh 设置当前页面索引
   * @method setCurrentPageIndex
   * @param {Number} index
   */
  setCurrentPageIndex: function setCurrentPageIndex(index) {
    this.scrollToPage(index, true);
  },

  /**
   * !#en Returns all pages of pageview
   * !#zh 返回视图中的所有页面
   * @method getPages
   * @returns {Node[]}
   */
  getPages: function getPages() {
    return this._pages;
  },

  /**
   * !#en At the end of the current page view to insert a new view
   * !#zh 在当前页面视图的尾部插入一个新视图
   * @method addPage
   * @param {Node} page
   */
  addPage: function addPage(page) {
    if (!page || this._pages.indexOf(page) !== -1 || !this.content) return;
    this.content.addChild(page);

    this._pages.push(page);

    this._updatePageView();
  },

  /**
   * !#en Inserts a page in the specified location
   * !#zh 将页面插入指定位置中
   * @method insertPage
   * @param {Node} page
   * @param {Number} index
   */
  insertPage: function insertPage(page, index) {
    if (index < 0 || !page || this._pages.indexOf(page) !== -1 || !this.content) return;
    var pageCount = this._pages.length;
    if (index >= pageCount) this.addPage(page);else {
      this._pages.splice(index, 0, page);

      this.content.addChild(page);

      this._updatePageView();
    }
  },

  /**
   * !#en Removes a page from PageView.
   * !#zh 移除指定页面
   * @method removePage
   * @param {Node} page
   */
  removePage: function removePage(page) {
    if (!page || !this.content) return;

    var index = this._pages.indexOf(page);

    if (index === -1) {
      cc.warnID(4300, page.name);
      return;
    }

    this.removePageAtIndex(index);
  },

  /**
   * !#en Removes a page at index of PageView.
   * !#zh 移除指定下标的页面
   * @method removePageAtIndex
   * @param {Number} index
   */
  removePageAtIndex: function removePageAtIndex(index) {
    var pageList = this._pages;
    if (index < 0 || index >= pageList.length) return;
    var page = pageList[index];
    if (!page) return;
    this.content.removeChild(page);
    pageList.splice(index, 1);

    this._updatePageView();
  },

  /**
   * !#en Removes all pages from PageView
   * !#zh 移除所有页面
   * @method removeAllPages
   */
  removeAllPages: function removeAllPages() {
    if (!this.content) {
      return;
    }

    var locPages = this._pages;

    for (var i = 0, len = locPages.length; i < len; i++) {
      this.content.removeChild(locPages[i]);
    }

    this._pages.length = 0;

    this._updatePageView();
  },

  /**
   * !#en Scroll PageView to index.
   * !#zh 滚动到指定页面
   * @method scrollToPage
   * @param {Number} idx index of page.
   * @param {Number} timeInSecond scrolling time
   */
  scrollToPage: function scrollToPage(idx, timeInSecond) {
    if (idx < 0 || idx >= this._pages.length) return;
    timeInSecond = timeInSecond !== undefined ? timeInSecond : 0.3;
    this._curPageIdx = idx;
    this.scrollToOffset(this._moveOffsetValue(idx), timeInSecond, true);

    if (this.indicator) {
      this.indicator._changedState();
    }
  },
  //override the method of ScrollView
  getScrollEndedEventTiming: function getScrollEndedEventTiming() {
    return this.pageTurningEventTiming;
  },
  _syncScrollDirection: function _syncScrollDirection() {
    this.horizontal = this.direction === Direction.Horizontal;
    this.vertical = this.direction === Direction.Vertical;
  },
  _syncSizeMode: function _syncSizeMode() {
    if (!this.content) {
      return;
    }

    var layout = this.content.getComponent(cc.Layout);

    if (layout) {
      if (this.sizeMode === SizeMode.Free && this._pages.length > 0) {
        var lastPage = this._pages[this._pages.length - 1];

        if (this.direction === Direction.Horizontal) {
          layout.paddingLeft = (this._view.width - this._pages[0].width) / 2;
          layout.paddingRight = (this._view.width - lastPage.width) / 2;
        } else if (this.direction === Direction.Vertical) {
          layout.paddingTop = (this._view.height - this._pages[0].height) / 2;
          layout.paddingBottom = (this._view.height - lastPage.height) / 2;
        }
      }

      layout.updateLayout();
    }
  },
  // 刷新页面视图
  _updatePageView: function _updatePageView() {
    // 当页面数组变化时修改 content 大小
    var layout = this.content.getComponent(cc.Layout);

    if (layout && layout.enabled) {
      layout.updateLayout();
    }

    var pageCount = this._pages.length;

    if (this._curPageIdx >= pageCount) {
      this._curPageIdx = pageCount === 0 ? 0 : pageCount - 1;
      this._lastPageIdx = this._curPageIdx;
    } // 进行排序


    var contentPos = this._initContentPos;

    for (var i = 0; i < pageCount; ++i) {
      var page = this._pages[i];
      page.setSiblingIndex(i);

      if (this.direction === Direction.Horizontal) {
        this._scrollCenterOffsetX[i] = Math.abs(contentPos.x + page.x);
      } else {
        this._scrollCenterOffsetY[i] = Math.abs(contentPos.y + page.y);
      }
    } // 刷新 indicator 信息与状态


    if (this.indicator) {
      this.indicator._refresh();
    }
  },
  // 刷新所有页面的大小
  _updateAllPagesSize: function _updateAllPagesSize() {
    if (this.sizeMode !== SizeMode.Unified) {
      return;
    }

    var locPages = CC_EDITOR ? this.content.children : this._pages;

    var selfSize = this._view.getContentSize();

    for (var i = 0, len = locPages.length; i < len; i++) {
      locPages[i].setContentSize(selfSize);
    }
  },
  // 初始化页面
  _initPages: function _initPages() {
    if (!this.content) {
      return;
    }

    this._initContentPos = this.content.position;
    var children = this.content.children;

    for (var i = 0; i < children.length; ++i) {
      var page = children[i];

      if (this._pages.indexOf(page) >= 0) {
        continue;
      }

      this._pages.push(page);
    }

    this._syncScrollDirection();

    this._syncSizeMode();

    this._updatePageView();
  },
  _dispatchPageTurningEvent: function _dispatchPageTurningEvent() {
    if (this._lastPageIdx === this._curPageIdx) return;
    this._lastPageIdx = this._curPageIdx;
    cc.Component.EventHandler.emitEvents(this.pageEvents, this, EventType.PAGE_TURNING);
    this.node.emit('page-turning', this);
  },
  // 是否超过自动滚动临界值
  _isScrollable: function _isScrollable(offset, index, nextIndex) {
    if (this.sizeMode === SizeMode.Free) {
      var curPageCenter, nextPageCenter;

      if (this.direction === Direction.Horizontal) {
        curPageCenter = this._scrollCenterOffsetX[index];
        nextPageCenter = this._scrollCenterOffsetX[nextIndex];
        return Math.abs(offset.x) >= Math.abs(curPageCenter - nextPageCenter) * this.scrollThreshold;
      } else if (this.direction === Direction.Vertical) {
        curPageCenter = this._scrollCenterOffsetY[index];
        nextPageCenter = this._scrollCenterOffsetY[nextIndex];
        return Math.abs(offset.y) >= Math.abs(curPageCenter - nextPageCenter) * this.scrollThreshold;
      }
    } else {
      if (this.direction === Direction.Horizontal) {
        return Math.abs(offset.x) >= this._view.width * this.scrollThreshold;
      } else if (this.direction === Direction.Vertical) {
        return Math.abs(offset.y) >= this._view.height * this.scrollThreshold;
      }
    }
  },
  // 快速滑动
  _isQuicklyScrollable: function _isQuicklyScrollable(touchMoveVelocity) {
    if (this.direction === Direction.Horizontal) {
      if (Math.abs(touchMoveVelocity.x) > this.autoPageTurningThreshold) {
        return true;
      }
    } else if (this.direction === Direction.Vertical) {
      if (Math.abs(touchMoveVelocity.y) > this.autoPageTurningThreshold) {
        return true;
      }
    }

    return false;
  },
  // 通过 idx 获取偏移值数值
  _moveOffsetValue: function _moveOffsetValue(idx) {
    var offset = cc.v2(0, 0);

    if (this.sizeMode === SizeMode.Free) {
      if (this.direction === Direction.Horizontal) {
        offset.x = this._scrollCenterOffsetX[idx];
      } else if (this.direction === Direction.Vertical) {
        offset.y = this._scrollCenterOffsetY[idx];
      }
    } else {
      if (this.direction === Direction.Horizontal) {
        offset.x = idx * this._view.width;
      } else if (this.direction === Direction.Vertical) {
        offset.y = idx * this._view.height;
      }
    }

    return offset;
  },
  _getDragDirection: function _getDragDirection(moveOffset) {
    if (this.direction === Direction.Horizontal) {
      if (moveOffset.x === 0) {
        return 0;
      }

      return moveOffset.x > 0 ? 1 : -1;
    } else if (this.direction === Direction.Vertical) {
      // 由于滚动 Y 轴的原点在在右上角所以应该是小于 0
      if (moveOffset.y === 0) {
        return 0;
      }

      return moveOffset.y < 0 ? 1 : -1;
    }
  },
  _handleReleaseLogic: function _handleReleaseLogic(touch) {
    this._autoScrollToPage();

    if (this._scrolling) {
      this._scrolling = false;

      if (!this._autoScrolling) {
        this._dispatchEvent('scroll-ended');
      }
    }
  },
  _autoScrollToPage: function _autoScrollToPage() {
    var bounceBackStarted = this._startBounceBackIfNeeded();

    if (bounceBackStarted) {
      var bounceBackAmount = this._getHowMuchOutOfBoundary();

      bounceBackAmount = this._clampDelta(bounceBackAmount);

      if (bounceBackAmount.x > 0 || bounceBackAmount.y < 0) {
        this._curPageIdx = this._pages.length - 1;
      }

      if (bounceBackAmount.x < 0 || bounceBackAmount.y > 0) {
        this._curPageIdx = 0;
      }

      if (this.indicator) {
        this.indicator._changedState();
      }
    } else {
      var moveOffset = this._touchBeganPosition.sub(this._touchEndPosition);

      var index = this._curPageIdx,
          nextIndex = index + this._getDragDirection(moveOffset);

      var timeInSecond = this.pageTurningSpeed * Math.abs(index - nextIndex);

      if (nextIndex < this._pages.length) {
        if (this._isScrollable(moveOffset, index, nextIndex)) {
          this.scrollToPage(nextIndex, timeInSecond);
          return;
        } else {
          var touchMoveVelocity = this._calculateTouchMoveVelocity();

          if (this._isQuicklyScrollable(touchMoveVelocity)) {
            this.scrollToPage(nextIndex, timeInSecond);
            return;
          }
        }
      }

      this.scrollToPage(index, timeInSecond);
    }
  },
  _onTouchBegan: function _onTouchBegan(event, captureListeners) {
    this._touchBeganPosition = event.touch.getLocation();

    this._super(event, captureListeners);
  },
  _onTouchMoved: function _onTouchMoved(event, captureListeners) {
    this._super(event, captureListeners);
  },
  _onTouchEnded: function _onTouchEnded(event, captureListeners) {
    this._touchEndPosition = event.touch.getLocation();

    this._super(event, captureListeners);
  },
  _onTouchCancelled: function _onTouchCancelled(event, captureListeners) {
    this._touchEndPosition = event.touch.getLocation();

    this._super(event, captureListeners);
  },
  _onMouseWheel: function _onMouseWheel() {}
});
cc.PageView = module.exports = PageView;
/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event page-turning
 * @param {Event.EventCustom} event
 * @param {PageView} pageView - The PageView component.
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDUGFnZVZpZXcuanMiXSwibmFtZXMiOlsiU2l6ZU1vZGUiLCJjYyIsIkVudW0iLCJVbmlmaWVkIiwiRnJlZSIsIkRpcmVjdGlvbiIsIkhvcml6b250YWwiLCJWZXJ0aWNhbCIsIkV2ZW50VHlwZSIsIlBBR0VfVFVSTklORyIsIlBhZ2VWaWV3IiwiQ2xhc3MiLCJuYW1lIiwiU2Nyb2xsVmlldyIsImVkaXRvciIsIkNDX0VESVRPUiIsIm1lbnUiLCJoZWxwIiwiaW5zcGVjdG9yIiwiZXhlY3V0ZUluRWRpdE1vZGUiLCJjdG9yIiwiX2N1clBhZ2VJZHgiLCJfbGFzdFBhZ2VJZHgiLCJfcGFnZXMiLCJfaW5pdENvbnRlbnRQb3MiLCJ2MiIsIl9zY3JvbGxDZW50ZXJPZmZzZXRYIiwiX3Njcm9sbENlbnRlck9mZnNldFkiLCJwcm9wZXJ0aWVzIiwic2l6ZU1vZGUiLCJ0eXBlIiwidG9vbHRpcCIsIkNDX0RFViIsIm5vdGlmeSIsIl9zeW5jU2l6ZU1vZGUiLCJkaXJlY3Rpb24iLCJfc3luY1Njcm9sbERpcmVjdGlvbiIsInNjcm9sbFRocmVzaG9sZCIsIkZsb2F0Iiwic2xpZGUiLCJyYW5nZSIsImF1dG9QYWdlVHVybmluZ1RocmVzaG9sZCIsInBhZ2VUdXJuaW5nRXZlbnRUaW1pbmciLCJpbmRpY2F0b3IiLCJQYWdlVmlld0luZGljYXRvciIsInNldFBhZ2VWaWV3IiwicGFnZVR1cm5pbmdTcGVlZCIsInBhZ2VFdmVudHMiLCJDb21wb25lbnQiLCJFdmVudEhhbmRsZXIiLCJzdGF0aWNzIiwiX19wcmVsb2FkIiwibm9kZSIsIm9uIiwiTm9kZSIsIlNJWkVfQ0hBTkdFRCIsIl91cGRhdGVBbGxQYWdlc1NpemUiLCJvbkVuYWJsZSIsIl9zdXBlciIsIl9kaXNwYXRjaFBhZ2VUdXJuaW5nRXZlbnQiLCJvbkRpc2FibGUiLCJvZmYiLCJvbkxvYWQiLCJfaW5pdFBhZ2VzIiwib25EZXN0cm95IiwiZ2V0Q3VycmVudFBhZ2VJbmRleCIsInNldEN1cnJlbnRQYWdlSW5kZXgiLCJpbmRleCIsInNjcm9sbFRvUGFnZSIsImdldFBhZ2VzIiwiYWRkUGFnZSIsInBhZ2UiLCJpbmRleE9mIiwiY29udGVudCIsImFkZENoaWxkIiwicHVzaCIsIl91cGRhdGVQYWdlVmlldyIsImluc2VydFBhZ2UiLCJwYWdlQ291bnQiLCJsZW5ndGgiLCJzcGxpY2UiLCJyZW1vdmVQYWdlIiwid2FybklEIiwicmVtb3ZlUGFnZUF0SW5kZXgiLCJwYWdlTGlzdCIsInJlbW92ZUNoaWxkIiwicmVtb3ZlQWxsUGFnZXMiLCJsb2NQYWdlcyIsImkiLCJsZW4iLCJpZHgiLCJ0aW1lSW5TZWNvbmQiLCJ1bmRlZmluZWQiLCJzY3JvbGxUb09mZnNldCIsIl9tb3ZlT2Zmc2V0VmFsdWUiLCJfY2hhbmdlZFN0YXRlIiwiZ2V0U2Nyb2xsRW5kZWRFdmVudFRpbWluZyIsImhvcml6b250YWwiLCJ2ZXJ0aWNhbCIsImxheW91dCIsImdldENvbXBvbmVudCIsIkxheW91dCIsImxhc3RQYWdlIiwicGFkZGluZ0xlZnQiLCJfdmlldyIsIndpZHRoIiwicGFkZGluZ1JpZ2h0IiwicGFkZGluZ1RvcCIsImhlaWdodCIsInBhZGRpbmdCb3R0b20iLCJ1cGRhdGVMYXlvdXQiLCJlbmFibGVkIiwiY29udGVudFBvcyIsInNldFNpYmxpbmdJbmRleCIsIk1hdGgiLCJhYnMiLCJ4IiwieSIsIl9yZWZyZXNoIiwiY2hpbGRyZW4iLCJzZWxmU2l6ZSIsImdldENvbnRlbnRTaXplIiwic2V0Q29udGVudFNpemUiLCJwb3NpdGlvbiIsImVtaXRFdmVudHMiLCJlbWl0IiwiX2lzU2Nyb2xsYWJsZSIsIm9mZnNldCIsIm5leHRJbmRleCIsImN1clBhZ2VDZW50ZXIiLCJuZXh0UGFnZUNlbnRlciIsIl9pc1F1aWNrbHlTY3JvbGxhYmxlIiwidG91Y2hNb3ZlVmVsb2NpdHkiLCJfZ2V0RHJhZ0RpcmVjdGlvbiIsIm1vdmVPZmZzZXQiLCJfaGFuZGxlUmVsZWFzZUxvZ2ljIiwidG91Y2giLCJfYXV0b1Njcm9sbFRvUGFnZSIsIl9zY3JvbGxpbmciLCJfYXV0b1Njcm9sbGluZyIsIl9kaXNwYXRjaEV2ZW50IiwiYm91bmNlQmFja1N0YXJ0ZWQiLCJfc3RhcnRCb3VuY2VCYWNrSWZOZWVkZWQiLCJib3VuY2VCYWNrQW1vdW50IiwiX2dldEhvd011Y2hPdXRPZkJvdW5kYXJ5IiwiX2NsYW1wRGVsdGEiLCJfdG91Y2hCZWdhblBvc2l0aW9uIiwic3ViIiwiX3RvdWNoRW5kUG9zaXRpb24iLCJfY2FsY3VsYXRlVG91Y2hNb3ZlVmVsb2NpdHkiLCJfb25Ub3VjaEJlZ2FuIiwiZXZlbnQiLCJjYXB0dXJlTGlzdGVuZXJzIiwiZ2V0TG9jYXRpb24iLCJfb25Ub3VjaE1vdmVkIiwiX29uVG91Y2hFbmRlZCIsIl9vblRvdWNoQ2FuY2VsbGVkIiwiX29uTW91c2VXaGVlbCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkE7Ozs7O0FBS0EsSUFBSUEsUUFBUSxHQUFHQyxFQUFFLENBQUNDLElBQUgsQ0FBUTtBQUNuQjs7Ozs7QUFLQUMsRUFBQUEsT0FBTyxFQUFFLENBTlU7O0FBT25COzs7OztBQUtBQyxFQUFBQSxJQUFJLEVBQUU7QUFaYSxDQUFSLENBQWY7QUFlQTs7Ozs7O0FBS0EsSUFBSUMsU0FBUyxHQUFHSixFQUFFLENBQUNDLElBQUgsQ0FBUTtBQUNwQjs7Ozs7QUFLQUksRUFBQUEsVUFBVSxFQUFFLENBTlE7O0FBT3BCOzs7OztBQUtBQyxFQUFBQSxRQUFRLEVBQUU7QUFaVSxDQUFSLENBQWhCO0FBZUE7Ozs7OztBQUtBLElBQUlDLFNBQVMsR0FBR1AsRUFBRSxDQUFDQyxJQUFILENBQVE7QUFDcEI7Ozs7O0FBS0FPLEVBQUFBLFlBQVksRUFBRTtBQU5NLENBQVIsQ0FBaEI7QUFVQTs7Ozs7OztBQU1BLElBQUlDLFFBQVEsR0FBR1QsRUFBRSxDQUFDVSxLQUFILENBQVM7QUFDcEJDLEVBQUFBLElBQUksRUFBRSxhQURjO0FBRXBCLGFBQVNYLEVB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LE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnJKLFFBQS9CO0FBRUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLyoqXG4gKiAhI2VuIFRoZSBQYWdlIFZpZXcgU2l6ZSBNb2RlXG4gKiAhI3poIOmhtemdouinhuWbvuavj+S4qumhtemdoue7n+S4gOeahOWkp+Wwj+exu+Wei1xuICogQGVudW0gUGFnZVZpZXcuU2l6ZU1vZGVcbiAqL1xudmFyIFNpemVNb2RlID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogISNlbiBFYWNoIHBhZ2UgaXMgdW5pZmllZCBpbiBzaXplXG4gICAgICogISN6aCDmr4/kuKrpobXpnaLnu5/kuIDlpKflsI9cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gVW5pZmllZFxuICAgICAqL1xuICAgIFVuaWZpZWQ6IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBFYWNoIHBhZ2UgaXMgaW4gZnJlZSBzaXplXG4gICAgICogISN6aCDmr4/kuKrpobXpnaLlpKflsI/pmo/mhI9cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gRnJlZVxuICAgICAqL1xuICAgIEZyZWU6IDFcbn0pO1xuXG4vKipcbiAqICEjZW4gVGhlIFBhZ2UgVmlldyBEaXJlY3Rpb25cbiAqICEjemgg6aG16Z2i6KeG5Zu+5rua5Yqo57G75Z6LXG4gKiBAZW51bSBQYWdlVmlldy5EaXJlY3Rpb25cbiAqL1xudmFyIERpcmVjdGlvbiA9IGNjLkVudW0oe1xuICAgIC8qKlxuICAgICAqICEjZW4gSG9yaXpvbnRhbCBzY3JvbGwuXG4gICAgICogISN6aCDmsLTlubPmu5rliqhcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gSG9yaXpvbnRhbFxuICAgICAqL1xuICAgIEhvcml6b250YWw6IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBWZXJ0aWNhbCBzY3JvbGwuXG4gICAgICogISN6aCDlnoLnm7Tmu5rliqhcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gVmVydGljYWxcbiAgICAgKi9cbiAgICBWZXJ0aWNhbDogMVxufSk7XG5cbi8qKlxuICogISNlbiBFbnVtIGZvciBTY3JvbGxWaWV3IGV2ZW50IHR5cGUuXG4gKiAhI3poIOa7muWKqOinhuWbvuS6i+S7tuexu+Wei1xuICogQGVudW0gUGFnZVZpZXcuRXZlbnRUeXBlXG4gKi9cbnZhciBFdmVudFR5cGUgPSBjYy5FbnVtKHtcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBwYWdlIHR1cm5pbmcgZXZlbnRcbiAgICAgKiAhI3poIOe/u+mhteS6i+S7tlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBQQUdFX1RVUk5JTkdcbiAgICAgKi9cbiAgICBQQUdFX1RVUk5JTkc6IDBcblxufSk7XG5cbi8qKlxuICogISNlbiBUaGUgUGFnZVZpZXcgY29udHJvbFxuICogISN6aCDpobXpnaLop4blm77nu4Tku7ZcbiAqIEBjbGFzcyBQYWdlVmlld1xuICogQGV4dGVuZHMgU2Nyb2xsVmlld1xuICovXG52YXIgUGFnZVZpZXcgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlBhZ2VWaWV3JyxcbiAgICBleHRlbmRzOiBjYy5TY3JvbGxWaWV3LFxuXG4gICAgZWRpdG9yOiBDQ19FRElUT1IgJiYge1xuICAgICAgICBtZW51OiAnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50LnVpL1BhZ2VWaWV3JyxcbiAgICAgICAgaGVscDogJ2kxOG46Q09NUE9ORU5ULmhlbHBfdXJsLnBhZ2V2aWV3JyxcbiAgICAgICAgaW5zcGVjdG9yOiAncGFja2FnZXM6Ly9pbnNwZWN0b3IvaW5zcGVjdG9ycy9jb21wcy9jY3BhZ2V2aWV3LmpzJyxcbiAgICAgICAgZXhlY3V0ZUluRWRpdE1vZGU6IGZhbHNlXG4gICAgfSxcblxuICAgIGN0b3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fY3VyUGFnZUlkeCA9IDA7XG4gICAgICAgIHRoaXMuX2xhc3RQYWdlSWR4ID0gMDtcbiAgICAgICAgdGhpcy5fcGFnZXMgPSBbXTtcbiAgICAgICAgdGhpcy5faW5pdENvbnRlbnRQb3MgPSBjYy52MigpO1xuICAgICAgICB0aGlzLl9zY3JvbGxDZW50ZXJPZmZzZXRYID0gW107IC8vIOavj+S4gOS4qumhtemdouWxheS4reaXtumcgOimgeeahOWBj+enu+mHj++8iFjvvIlcbiAgICAgICAgdGhpcy5fc2Nyb2xsQ2VudGVyT2Zmc2V0WSA9IFtdOyAvLyDmr4/kuIDkuKrpobXpnaLlsYXkuK3ml7bpnIDopoHnmoTlgY/np7vph4/vvIhZ77yJXG4gICAgfSxcblxuICAgIHByb3BlcnRpZXM6IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBTcGVjaWZ5IHRoZSBzaXplIHR5cGUgb2YgZWFjaCBwYWdlIGluIFBhZ2VWaWV3LlxuICAgICAgICAgKiAhI3poIOmhtemdouinhuWbvuS4reavj+S4qumhtemdouWkp+Wwj+exu+Wei1xuICAgICAgICAgKiBAcHJvcGVydHkge1BhZ2VWaWV3LlNpemVNb2RlfSBzaXplTW9kZVxuICAgICAgICAgKi9cbiAgICAgICAgc2l6ZU1vZGU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IFNpemVNb2RlLlVuaWZpZWQsXG4gICAgICAgICAgICB0eXBlOiBTaXplTW9kZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGFnZXZpZXcuc2l6ZU1vZGUnLFxuICAgICAgICAgICAgbm90aWZ5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zeW5jU2l6ZU1vZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgcGFnZSB2aWV3IGRpcmVjdGlvblxuICAgICAgICAgKiAhI3poIOmhtemdouinhuWbvua7muWKqOexu+Wei1xuICAgICAgICAgKiBAcHJvcGVydHkge1BhZ2VWaWV3LkRpcmVjdGlvbn0gZGlyZWN0aW9uXG4gICAgICAgICAqL1xuICAgICAgICBkaXJlY3Rpb246IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IERpcmVjdGlvbi5Ib3Jpem9udGFsLFxuICAgICAgICAgICAgdHlwZTogRGlyZWN0aW9uLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5wYWdldmlldy5kaXJlY3Rpb24nLFxuICAgICAgICAgICAgbm90aWZ5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zeW5jU2Nyb2xsRGlyZWN0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIHNjcm9sbCB0aHJlc2hvbGQgdmFsdWUsIHdoZW4gZHJhZyBleGNlZWRzIHRoaXMgdmFsdWUsXG4gICAgICAgICAqIHJlbGVhc2UgdGhlIG5leHQgcGFnZSB3aWxsIGF1dG9tYXRpY2FsbHkgc2Nyb2xsLCBsZXNzIHRoYW4gdGhlIHJlc3RvcmVcbiAgICAgICAgICogISN6aCDmu5rliqjkuLTnlYzlgLzvvIzpu5jorqTljZXkvY3nmb7liIbmr5TvvIzlvZPmi5bmi73otoXlh7ror6XmlbDlgLzml7bvvIzmnb7lvIDkvJroh6rliqjmu5rliqjkuIvkuIDpobXvvIzlsI/kuo7ml7bliJnov5jljp/jgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHNjcm9sbFRocmVzaG9sZFxuICAgICAgICAgKi9cbiAgICAgICAgc2Nyb2xsVGhyZXNob2xkOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAwLjUsXG4gICAgICAgICAgICB0eXBlOiBjYy5GbG9hdCxcbiAgICAgICAgICAgIHNsaWRlOiB0cnVlLFxuICAgICAgICAgICAgcmFuZ2U6IFswLCAxLCAwLjAxXSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGFnZXZpZXcuc2Nyb2xsVGhyZXNob2xkJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIEF1dG8gcGFnZSB0dXJuaW5nIHZlbG9jaXR5IHRocmVzaG9sZC4gV2hlbiB1c2VycyBzd2lwZSB0aGUgUGFnZVZpZXcgcXVpY2tseSxcbiAgICAgICAgICogaXQgd2lsbCBjYWxjdWxhdGUgYSB2ZWxvY2l0eSBiYXNlZCBvbiB0aGUgc2Nyb2xsIGRpc3RhbmNlIGFuZCB0aW1lLFxuICAgICAgICAgKiBpZiB0aGUgY2FsY3VsYXRlZCB2ZWxvY2l0eSBpcyBsYXJnZXIgdGhhbiB0aGUgdGhyZXNob2xkLCB0aGVuIGl0IHdpbGwgdHJpZ2dlciBwYWdlIHR1cm5pbmcuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5b+r6YCf5ruR5Yqo57+76aG15Li055WM5YC844CCXG4gICAgICAgICAqIOW9k+eUqOaIt+W/q+mAn+a7keWKqOaXtu+8jOS8muagueaNrua7keWKqOW8gOWni+WSjOe7k+adn+eahOi3neemu+S4juaXtumXtOiuoeeul+WHuuS4gOS4qumAn+W6puWAvO+8jFxuICAgICAgICAgKiDor6XlgLzkuI7mraTkuLTnlYzlgLznm7jmr5TovoPvvIzlpoLmnpzlpKfkuo7kuLTnlYzlgLzvvIzliJnov5vooYzoh6rliqjnv7vpobXjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGF1dG9QYWdlVHVybmluZ1RocmVzaG9sZFxuICAgICAgICAgKi9cbiAgICAgICAgYXV0b1BhZ2VUdXJuaW5nVGhyZXNob2xkOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAxMDAsXG4gICAgICAgICAgICB0eXBlOiBjYy5GbG9hdCxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGFnZXZpZXcuYXV0b1BhZ2VUdXJuaW5nVGhyZXNob2xkJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIENoYW5nZSB0aGUgUGFnZVR1cm5pbmcgZXZlbnQgdGltaW5nIG9mIFBhZ2VWaWV3LlxuICAgICAgICAgKiAhI3poIOiuvue9riBQYWdlVmlldyBQYWdlVHVybmluZyDkuovku7bnmoTlj5HpgIHml7bmnLrjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHBhZ2VUdXJuaW5nRXZlbnRUaW1pbmdcbiAgICAgICAgICovXG4gICAgICAgIHBhZ2VUdXJuaW5nRXZlbnRUaW1pbmc6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IDAuMSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkZsb2F0LFxuICAgICAgICAgICAgcmFuZ2U6IFswLCAxLCAwLjAxXSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGFnZXZpZXcucGFnZVR1cm5pbmdFdmVudFRpbWluZydcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgUGFnZSBWaWV3IEluZGljYXRvclxuICAgICAgICAgKiAhI3poIOmhtemdouinhuWbvuaMh+ekuuWZqOe7hOS7tlxuICAgICAgICAgKiBAcHJvcGVydHkge1BhZ2VWaWV3SW5kaWNhdG9yfSBpbmRpY2F0b3JcbiAgICAgICAgICovXG4gICAgICAgIGluZGljYXRvcjoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlBhZ2VWaWV3SW5kaWNhdG9yLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5wYWdldmlldy5pbmRpY2F0b3InLFxuICAgICAgICAgICAgbm90aWZ5OiAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5kaWNhdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kaWNhdG9yLnNldFBhZ2VWaWV3KHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgdGltZSByZXF1aXJlZCB0byB0dXJuIG92ZXIgYSBwYWdlLiB1bml0OiBzZWNvbmRcbiAgICAgICAgICogISN6aCDmr4/kuKrpobXpnaLnv7vpobXml7bmiYDpnIDml7bpl7TjgILljZXkvY3vvJrnp5JcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHBhZ2VUdXJuaW5nU3BlZWRcbiAgICAgICAgICovXG4gICAgICAgIHBhZ2VUdXJuaW5nU3BlZWQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IDAuMyxcbiAgICAgICAgICAgIHR5cGU6IGNjLkZsb2F0LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5wYWdldmlldy5wYWdlVHVybmluZ1NwZWVkJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFBhZ2VWaWV3IGV2ZW50cyBjYWxsYmFja1xuICAgICAgICAgKiAhI3poIOa7muWKqOinhuWbvueahOS6i+S7tuWbnuiwg+WHveaVsFxuICAgICAgICAgKiBAcHJvcGVydHkge0NvbXBvbmVudC5FdmVudEhhbmRsZXJbXX0gcGFnZUV2ZW50c1xuICAgICAgICAgKi9cbiAgICAgICAgcGFnZUV2ZW50czoge1xuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5Db21wb25lbnQuRXZlbnRIYW5kbGVyLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5wYWdldmlldy5wYWdlRXZlbnRzJ1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHN0YXRpY3M6IHtcbiAgICAgICAgU2l6ZU1vZGU6IFNpemVNb2RlLFxuICAgICAgICBEaXJlY3Rpb246IERpcmVjdGlvbixcbiAgICAgICAgRXZlbnRUeXBlOiBFdmVudFR5cGVcbiAgICB9LFxuXG4gICAgX19wcmVsb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5TSVpFX0NIQU5HRUQsIHRoaXMuX3VwZGF0ZUFsbFBhZ2VzU2l6ZSwgdGhpcyk7XG4gICAgfSxcblxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIGlmKCFDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5vbignc2Nyb2xsLWVuZGVkLXdpdGgtdGhyZXNob2xkJywgdGhpcy5fZGlzcGF0Y2hQYWdlVHVybmluZ0V2ZW50LCB0aGlzKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkRpc2FibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgaWYoIUNDX0VESVRPUikge1xuICAgICAgICAgICAgdGhpcy5ub2RlLm9mZignc2Nyb2xsLWVuZGVkLXdpdGgtdGhyZXNob2xkJywgdGhpcy5fZGlzcGF0Y2hQYWdlVHVybmluZ0V2ZW50LCB0aGlzKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5faW5pdFBhZ2VzKCk7XG4gICAgICAgIGlmICh0aGlzLmluZGljYXRvcikge1xuICAgICAgICAgICAgdGhpcy5pbmRpY2F0b3Iuc2V0UGFnZVZpZXcodGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5TSVpFX0NIQU5HRUQsIHRoaXMuX3VwZGF0ZUFsbFBhZ2VzU2l6ZSwgdGhpcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyBjdXJyZW50IHBhZ2UgaW5kZXhcbiAgICAgKiAhI3poIOi/lOWbnuW9k+WJjemhtemdoue0ouW8lVxuICAgICAqIEBtZXRob2QgZ2V0Q3VycmVudFBhZ2VJbmRleFxuICAgICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0Q3VycmVudFBhZ2VJbmRleDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY3VyUGFnZUlkeDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgY3VycmVudCBwYWdlIGluZGV4XG4gICAgICogISN6aCDorr7nva7lvZPliY3pobXpnaLntKLlvJVcbiAgICAgKiBAbWV0aG9kIHNldEN1cnJlbnRQYWdlSW5kZXhcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXhcbiAgICAgKi9cbiAgICBzZXRDdXJyZW50UGFnZUluZGV4OiBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxUb1BhZ2UoaW5kZXgsIHRydWUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgYWxsIHBhZ2VzIG9mIHBhZ2V2aWV3XG4gICAgICogISN6aCDov5Tlm57op4blm77kuK3nmoTmiYDmnInpobXpnaJcbiAgICAgKiBAbWV0aG9kIGdldFBhZ2VzXG4gICAgICogQHJldHVybnMge05vZGVbXX1cbiAgICAgKi9cbiAgICBnZXRQYWdlczogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGFnZXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQXQgdGhlIGVuZCBvZiB0aGUgY3VycmVudCBwYWdlIHZpZXcgdG8gaW5zZXJ0IGEgbmV3IHZpZXdcbiAgICAgKiAhI3poIOWcqOW9k+WJjemhtemdouinhuWbvueahOWwvumDqOaPkuWFpeS4gOS4quaWsOinhuWbvlxuICAgICAqIEBtZXRob2QgYWRkUGFnZVxuICAgICAqIEBwYXJhbSB7Tm9kZX0gcGFnZVxuICAgICAqL1xuICAgIGFkZFBhZ2U6IGZ1bmN0aW9uIChwYWdlKSB7XG4gICAgICAgIGlmICghcGFnZSB8fCB0aGlzLl9wYWdlcy5pbmRleE9mKHBhZ2UpICE9PSAtMSB8fCAhdGhpcy5jb250ZW50KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLmNvbnRlbnQuYWRkQ2hpbGQocGFnZSk7XG4gICAgICAgIHRoaXMuX3BhZ2VzLnB1c2gocGFnZSk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVBhZ2VWaWV3KCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gSW5zZXJ0cyBhIHBhZ2UgaW4gdGhlIHNwZWNpZmllZCBsb2NhdGlvblxuICAgICAqICEjemgg5bCG6aG16Z2i5o+S5YWl5oyH5a6a5L2N572u5LitXG4gICAgICogQG1ldGhvZCBpbnNlcnRQYWdlXG4gICAgICogQHBhcmFtIHtOb2RlfSBwYWdlXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4XG4gICAgICovXG4gICAgaW5zZXJ0UGFnZTogZnVuY3Rpb24gKHBhZ2UsIGluZGV4KSB7XG4gICAgICAgIGlmIChpbmRleCA8IDAgfHwgIXBhZ2UgfHwgdGhpcy5fcGFnZXMuaW5kZXhPZihwYWdlKSAhPT0gLTEgfHwgIXRoaXMuY29udGVudClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdmFyIHBhZ2VDb3VudCA9IHRoaXMuX3BhZ2VzLmxlbmd0aDtcbiAgICAgICAgaWYgKGluZGV4ID49IHBhZ2VDb3VudClcbiAgICAgICAgICAgIHRoaXMuYWRkUGFnZShwYWdlKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9wYWdlcy5zcGxpY2UoaW5kZXgsIDAsIHBhZ2UpO1xuICAgICAgICAgICAgdGhpcy5jb250ZW50LmFkZENoaWxkKHBhZ2UpO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlUGFnZVZpZXcoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJlbW92ZXMgYSBwYWdlIGZyb20gUGFnZVZpZXcuXG4gICAgICogISN6aCDnp7vpmaTmjIflrprpobXpnaJcbiAgICAgKiBAbWV0aG9kIHJlbW92ZVBhZ2VcbiAgICAgKiBAcGFyYW0ge05vZGV9IHBhZ2VcbiAgICAgKi9cbiAgICByZW1vdmVQYWdlOiBmdW5jdGlvbiAocGFnZSkge1xuICAgICAgICBpZiAoIXBhZ2UgfHwgIXRoaXMuY29udGVudCkgcmV0dXJuO1xuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLl9wYWdlcy5pbmRleE9mKHBhZ2UpO1xuICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICBjYy53YXJuSUQoNDMwMCwgcGFnZS5uYW1lKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbW92ZVBhZ2VBdEluZGV4KGluZGV4KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZW1vdmVzIGEgcGFnZSBhdCBpbmRleCBvZiBQYWdlVmlldy5cbiAgICAgKiAhI3poIOenu+mZpOaMh+WumuS4i+agh+eahOmhtemdolxuICAgICAqIEBtZXRob2QgcmVtb3ZlUGFnZUF0SW5kZXhcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXhcbiAgICAgKi9cbiAgICByZW1vdmVQYWdlQXRJbmRleDogZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIHZhciBwYWdlTGlzdCA9IHRoaXMuX3BhZ2VzO1xuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHBhZ2VMaXN0Lmxlbmd0aCkgcmV0dXJuO1xuICAgICAgICB2YXIgcGFnZSA9IHBhZ2VMaXN0W2luZGV4XTtcbiAgICAgICAgaWYgKCFwYWdlKSByZXR1cm47XG4gICAgICAgIHRoaXMuY29udGVudC5yZW1vdmVDaGlsZChwYWdlKTtcbiAgICAgICAgcGFnZUxpc3Quc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlUGFnZVZpZXcoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZW1vdmVzIGFsbCBwYWdlcyBmcm9tIFBhZ2VWaWV3XG4gICAgICogISN6aCDnp7vpmaTmiYDmnInpobXpnaJcbiAgICAgKiBAbWV0aG9kIHJlbW92ZUFsbFBhZ2VzXG4gICAgICovXG4gICAgcmVtb3ZlQWxsUGFnZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRlbnQpIHsgcmV0dXJuOyB9XG4gICAgICAgIHZhciBsb2NQYWdlcyA9IHRoaXMuX3BhZ2VzO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbG9jUGFnZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQucmVtb3ZlQ2hpbGQobG9jUGFnZXNbaV0pO1xuICAgICAgICB0aGlzLl9wYWdlcy5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLl91cGRhdGVQYWdlVmlldygpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNjcm9sbCBQYWdlVmlldyB0byBpbmRleC5cbiAgICAgKiAhI3poIOa7muWKqOWIsOaMh+WumumhtemdolxuICAgICAqIEBtZXRob2Qgc2Nyb2xsVG9QYWdlXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGlkeCBpbmRleCBvZiBwYWdlLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lSW5TZWNvbmQgc2Nyb2xsaW5nIHRpbWVcbiAgICAgKi9cbiAgICBzY3JvbGxUb1BhZ2U6IGZ1bmN0aW9uIChpZHgsIHRpbWVJblNlY29uZCkge1xuICAgICAgICBpZiAoaWR4IDwgMCB8fCBpZHggPj0gdGhpcy5fcGFnZXMubGVuZ3RoKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aW1lSW5TZWNvbmQgPSB0aW1lSW5TZWNvbmQgIT09IHVuZGVmaW5lZCA/IHRpbWVJblNlY29uZCA6IDAuMztcbiAgICAgICAgdGhpcy5fY3VyUGFnZUlkeCA9IGlkeDtcbiAgICAgICAgdGhpcy5zY3JvbGxUb09mZnNldCh0aGlzLl9tb3ZlT2Zmc2V0VmFsdWUoaWR4KSwgdGltZUluU2Vjb25kLCB0cnVlKTtcbiAgICAgICAgaWYgKHRoaXMuaW5kaWNhdG9yKSB7XG4gICAgICAgICAgICB0aGlzLmluZGljYXRvci5fY2hhbmdlZFN0YXRlKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy9vdmVycmlkZSB0aGUgbWV0aG9kIG9mIFNjcm9sbFZpZXdcbiAgICBnZXRTY3JvbGxFbmRlZEV2ZW50VGltaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhZ2VUdXJuaW5nRXZlbnRUaW1pbmc7XG4gICAgfSxcblxuICAgIF9zeW5jU2Nyb2xsRGlyZWN0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaG9yaXpvbnRhbCA9IHRoaXMuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uSG9yaXpvbnRhbDtcbiAgICAgICAgdGhpcy52ZXJ0aWNhbCA9IHRoaXMuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uVmVydGljYWw7XG4gICAgfSxcblxuICAgIF9zeW5jU2l6ZU1vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRlbnQpIHsgcmV0dXJuOyB9XG4gICAgICAgIHZhciBsYXlvdXQgPSB0aGlzLmNvbnRlbnQuZ2V0Q29tcG9uZW50KGNjLkxheW91dCk7XG4gICAgICAgIGlmIChsYXlvdXQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNpemVNb2RlID09PSBTaXplTW9kZS5GcmVlICYmIHRoaXMuX3BhZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgbGFzdFBhZ2UgPSB0aGlzLl9wYWdlc1t0aGlzLl9wYWdlcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5Ib3Jpem9udGFsKSB7XG4gICAgICAgICAgICAgICAgICAgIGxheW91dC5wYWRkaW5nTGVmdCA9ICh0aGlzLl92aWV3LndpZHRoIC0gdGhpcy5fcGFnZXNbMF0ud2lkdGgpIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgbGF5b3V0LnBhZGRpbmdSaWdodCA9ICh0aGlzLl92aWV3LndpZHRoIC0gbGFzdFBhZ2Uud2lkdGgpIC8gMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5WZXJ0aWNhbCkge1xuICAgICAgICAgICAgICAgICAgICBsYXlvdXQucGFkZGluZ1RvcCA9ICh0aGlzLl92aWV3LmhlaWdodCAtIHRoaXMuX3BhZ2VzWzBdLmhlaWdodCkgLyAyO1xuICAgICAgICAgICAgICAgICAgICBsYXlvdXQucGFkZGluZ0JvdHRvbSA9ICh0aGlzLl92aWV3LmhlaWdodCAtIGxhc3RQYWdlLmhlaWdodCkgLyAyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxheW91dC51cGRhdGVMYXlvdXQoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyDliLfmlrDpobXpnaLop4blm75cbiAgICBfdXBkYXRlUGFnZVZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8g5b2T6aG16Z2i5pWw57uE5Y+Y5YyW5pe25L+u5pS5IGNvbnRlbnQg5aSn5bCPXG4gICAgICAgIHZhciBsYXlvdXQgPSB0aGlzLmNvbnRlbnQuZ2V0Q29tcG9uZW50KGNjLkxheW91dCk7XG4gICAgICAgIGlmIChsYXlvdXQgJiYgbGF5b3V0LmVuYWJsZWQpIHtcbiAgICAgICAgICAgIGxheW91dC51cGRhdGVMYXlvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwYWdlQ291bnQgPSB0aGlzLl9wYWdlcy5sZW5ndGg7XG5cbiAgICAgICAgaWYgKHRoaXMuX2N1clBhZ2VJZHggPj0gcGFnZUNvdW50KSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJQYWdlSWR4ID0gcGFnZUNvdW50ID09PSAwID8gMCA6IHBhZ2VDb3VudCAtIDE7XG4gICAgICAgICAgICB0aGlzLl9sYXN0UGFnZUlkeCA9IHRoaXMuX2N1clBhZ2VJZHg7XG4gICAgICAgIH1cbiAgICAgICAgLy8g6L+b6KGM5o6S5bqPXG4gICAgICAgIHZhciBjb250ZW50UG9zID0gdGhpcy5faW5pdENvbnRlbnRQb3M7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFnZUNvdW50OyArK2kpIHtcbiAgICAgICAgICAgIHZhciBwYWdlID0gdGhpcy5fcGFnZXNbaV07XG4gICAgICAgICAgICBwYWdlLnNldFNpYmxpbmdJbmRleChpKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLkhvcml6b250YWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxDZW50ZXJPZmZzZXRYW2ldID0gTWF0aC5hYnMoY29udGVudFBvcy54ICsgcGFnZS54KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Njcm9sbENlbnRlck9mZnNldFlbaV0gPSBNYXRoLmFicyhjb250ZW50UG9zLnkgKyBwYWdlLnkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8g5Yi35pawIGluZGljYXRvciDkv6Hmga/kuI7nirbmgIFcbiAgICAgICAgaWYgKHRoaXMuaW5kaWNhdG9yKSB7XG4gICAgICAgICAgICB0aGlzLmluZGljYXRvci5fcmVmcmVzaCgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIOWIt+aWsOaJgOaciemhtemdoueahOWkp+Wwj1xuICAgIF91cGRhdGVBbGxQYWdlc1NpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuc2l6ZU1vZGUgIT09IFNpemVNb2RlLlVuaWZpZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbG9jUGFnZXMgPSBDQ19FRElUT1IgPyB0aGlzLmNvbnRlbnQuY2hpbGRyZW4gOiB0aGlzLl9wYWdlcztcbiAgICAgICAgdmFyIHNlbGZTaXplID0gdGhpcy5fdmlldy5nZXRDb250ZW50U2l6ZSgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbG9jUGFnZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGxvY1BhZ2VzW2ldLnNldENvbnRlbnRTaXplKHNlbGZTaXplKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyDliJ3lp4vljJbpobXpnaJcbiAgICBfaW5pdFBhZ2VzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5jb250ZW50KSB7IHJldHVybjsgfVxuICAgICAgICB0aGlzLl9pbml0Q29udGVudFBvcyA9IHRoaXMuY29udGVudC5wb3NpdGlvbjtcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5jb250ZW50LmNoaWxkcmVuO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICB2YXIgcGFnZSA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgaWYgKHRoaXMuX3BhZ2VzLmluZGV4T2YocGFnZSkgPj0gMCkgeyBjb250aW51ZTsgfVxuICAgICAgICAgICAgdGhpcy5fcGFnZXMucHVzaChwYWdlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zeW5jU2Nyb2xsRGlyZWN0aW9uKCk7XG4gICAgICAgIHRoaXMuX3N5bmNTaXplTW9kZSgpO1xuICAgICAgICB0aGlzLl91cGRhdGVQYWdlVmlldygpO1xuICAgIH0sXG5cbiAgICBfZGlzcGF0Y2hQYWdlVHVybmluZ0V2ZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9sYXN0UGFnZUlkeCA9PT0gdGhpcy5fY3VyUGFnZUlkeCkgcmV0dXJuO1xuICAgICAgICB0aGlzLl9sYXN0UGFnZUlkeCA9IHRoaXMuX2N1clBhZ2VJZHg7XG4gICAgICAgIGNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXIuZW1pdEV2ZW50cyh0aGlzLnBhZ2VFdmVudHMsIHRoaXMsIEV2ZW50VHlwZS5QQUdFX1RVUk5JTkcpO1xuICAgICAgICB0aGlzLm5vZGUuZW1pdCgncGFnZS10dXJuaW5nJywgdGhpcyk7XG4gICAgfSxcblxuICAgIC8vIOaYr+WQpui2hei/h+iHquWKqOa7muWKqOS4tOeVjOWAvFxuICAgIF9pc1Njcm9sbGFibGU6IGZ1bmN0aW9uIChvZmZzZXQsIGluZGV4LCBuZXh0SW5kZXgpIHtcbiAgICAgICAgaWYgKHRoaXMuc2l6ZU1vZGUgPT09IFNpemVNb2RlLkZyZWUpIHtcbiAgICAgICAgICAgIHZhciBjdXJQYWdlQ2VudGVyLCBuZXh0UGFnZUNlbnRlcjtcbiAgICAgICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLkhvcml6b250YWwpIHtcbiAgICAgICAgICAgICAgICBjdXJQYWdlQ2VudGVyID0gdGhpcy5fc2Nyb2xsQ2VudGVyT2Zmc2V0WFtpbmRleF07XG4gICAgICAgICAgICAgICAgbmV4dFBhZ2VDZW50ZXIgPSB0aGlzLl9zY3JvbGxDZW50ZXJPZmZzZXRYW25leHRJbmRleF07XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguYWJzKG9mZnNldC54KSA+PSBNYXRoLmFicyhjdXJQYWdlQ2VudGVyIC0gbmV4dFBhZ2VDZW50ZXIpICogdGhpcy5zY3JvbGxUaHJlc2hvbGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLlZlcnRpY2FsKSB7XG4gICAgICAgICAgICAgICAgY3VyUGFnZUNlbnRlciA9IHRoaXMuX3Njcm9sbENlbnRlck9mZnNldFlbaW5kZXhdO1xuICAgICAgICAgICAgICAgIG5leHRQYWdlQ2VudGVyID0gdGhpcy5fc2Nyb2xsQ2VudGVyT2Zmc2V0WVtuZXh0SW5kZXhdO1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmFicyhvZmZzZXQueSkgPj0gTWF0aC5hYnMoY3VyUGFnZUNlbnRlciAtIG5leHRQYWdlQ2VudGVyKSAqIHRoaXMuc2Nyb2xsVGhyZXNob2xkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uSG9yaXpvbnRhbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmFicyhvZmZzZXQueCkgPj0gdGhpcy5fdmlldy53aWR0aCAqIHRoaXMuc2Nyb2xsVGhyZXNob2xkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5WZXJ0aWNhbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmFicyhvZmZzZXQueSkgPj0gdGhpcy5fdmlldy5oZWlnaHQgKiB0aGlzLnNjcm9sbFRocmVzaG9sZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyDlv6vpgJ/mu5HliqhcbiAgICBfaXNRdWlja2x5U2Nyb2xsYWJsZTogZnVuY3Rpb24gKHRvdWNoTW92ZVZlbG9jaXR5KSB7XG4gICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLkhvcml6b250YWwpIHtcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyh0b3VjaE1vdmVWZWxvY2l0eS54KSA+IHRoaXMuYXV0b1BhZ2VUdXJuaW5nVGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5WZXJ0aWNhbCkge1xuICAgICAgICAgICAgaWYgKE1hdGguYWJzKHRvdWNoTW92ZVZlbG9jaXR5LnkpID4gdGhpcy5hdXRvUGFnZVR1cm5pbmdUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIC8vIOmAmui/hyBpZHgg6I635Y+W5YGP56e75YC85pWw5YC8XG4gICAgX21vdmVPZmZzZXRWYWx1ZTogZnVuY3Rpb24gKGlkeCkge1xuICAgICAgICB2YXIgb2Zmc2V0ID0gY2MudjIoMCwgMCk7XG4gICAgICAgIGlmICh0aGlzLnNpemVNb2RlID09PSBTaXplTW9kZS5GcmVlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5Ib3Jpem9udGFsKSB7XG4gICAgICAgICAgICAgICAgb2Zmc2V0LnggPSB0aGlzLl9zY3JvbGxDZW50ZXJPZmZzZXRYW2lkeF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLlZlcnRpY2FsKSB7XG4gICAgICAgICAgICAgICAgb2Zmc2V0LnkgPSB0aGlzLl9zY3JvbGxDZW50ZXJPZmZzZXRZW2lkeF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5Ib3Jpem9udGFsKSB7XG4gICAgICAgICAgICAgICAgb2Zmc2V0LnggPSBpZHggKiB0aGlzLl92aWV3LndpZHRoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5WZXJ0aWNhbCkge1xuICAgICAgICAgICAgICAgIG9mZnNldC55ID0gaWR4ICogdGhpcy5fdmlldy5oZWlnaHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9mZnNldDtcbiAgICB9LFxuXG4gICAgX2dldERyYWdEaXJlY3Rpb246IGZ1bmN0aW9uIChtb3ZlT2Zmc2V0KSB7XG4gICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLkhvcml6b250YWwpIHtcbiAgICAgICAgICAgIGlmIChtb3ZlT2Zmc2V0LnggPT09IDApIHsgcmV0dXJuIDA7IH1cbiAgICAgICAgICAgIHJldHVybiAobW92ZU9mZnNldC54ID4gMCA/IDEgOiAtMSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5WZXJ0aWNhbCkge1xuICAgICAgICAgICAgLy8g55Sx5LqO5rua5YqoIFkg6L2055qE5Y6f54K55Zyo5Zyo5Y+z5LiK6KeS5omA5Lul5bqU6K+l5piv5bCP5LqOIDBcbiAgICAgICAgICAgIGlmIChtb3ZlT2Zmc2V0LnkgPT09IDApIHsgcmV0dXJuIDA7IH1cbiAgICAgICAgICAgIHJldHVybiAobW92ZU9mZnNldC55IDwgMCA/IDEgOiAtMSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2hhbmRsZVJlbGVhc2VMb2dpYzogZnVuY3Rpb24odG91Y2gpIHtcbiAgICAgICAgdGhpcy5fYXV0b1Njcm9sbFRvUGFnZSgpO1xuICAgICAgICBpZiAodGhpcy5fc2Nyb2xsaW5nKSB7XG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmICghdGhpcy5fYXV0b1Njcm9sbGluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoJ3Njcm9sbC1lbmRlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9hdXRvU2Nyb2xsVG9QYWdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBib3VuY2VCYWNrU3RhcnRlZCA9IHRoaXMuX3N0YXJ0Qm91bmNlQmFja0lmTmVlZGVkKCk7XG4gICAgICAgIGlmIChib3VuY2VCYWNrU3RhcnRlZCkge1xuICAgICAgICAgICAgbGV0IGJvdW5jZUJhY2tBbW91bnQgPSB0aGlzLl9nZXRIb3dNdWNoT3V0T2ZCb3VuZGFyeSgpO1xuICAgICAgICAgICAgYm91bmNlQmFja0Ftb3VudCA9IHRoaXMuX2NsYW1wRGVsdGEoYm91bmNlQmFja0Ftb3VudCk7XG4gICAgICAgICAgICBpZiAoYm91bmNlQmFja0Ftb3VudC54ID4gMCB8fCBib3VuY2VCYWNrQW1vdW50LnkgPCAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyUGFnZUlkeCA9IHRoaXMuX3BhZ2VzLmxlbmd0aCAtIDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChib3VuY2VCYWNrQW1vdW50LnggPCAwIHx8IGJvdW5jZUJhY2tBbW91bnQueSA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJQYWdlSWR4ID0gMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5pbmRpY2F0b3IpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluZGljYXRvci5fY2hhbmdlZFN0YXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgbW92ZU9mZnNldCA9IHRoaXMuX3RvdWNoQmVnYW5Qb3NpdGlvbi5zdWIodGhpcy5fdG91Y2hFbmRQb3NpdGlvbik7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLl9jdXJQYWdlSWR4LCBuZXh0SW5kZXggPSBpbmRleCArIHRoaXMuX2dldERyYWdEaXJlY3Rpb24obW92ZU9mZnNldCk7XG4gICAgICAgICAgICB2YXIgdGltZUluU2Vjb25kID0gdGhpcy5wYWdlVHVybmluZ1NwZWVkICogTWF0aC5hYnMoaW5kZXggLSBuZXh0SW5kZXgpO1xuICAgICAgICAgICAgaWYgKG5leHRJbmRleCA8IHRoaXMuX3BhZ2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pc1Njcm9sbGFibGUobW92ZU9mZnNldCwgaW5kZXgsIG5leHRJbmRleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxUb1BhZ2UobmV4dEluZGV4LCB0aW1lSW5TZWNvbmQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdG91Y2hNb3ZlVmVsb2NpdHkgPSB0aGlzLl9jYWxjdWxhdGVUb3VjaE1vdmVWZWxvY2l0eSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5faXNRdWlja2x5U2Nyb2xsYWJsZSh0b3VjaE1vdmVWZWxvY2l0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG9QYWdlKG5leHRJbmRleCwgdGltZUluU2Vjb25kKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG9QYWdlKGluZGV4LCB0aW1lSW5TZWNvbmQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9vblRvdWNoQmVnYW46IGZ1bmN0aW9uIChldmVudCwgY2FwdHVyZUxpc3RlbmVycykge1xuICAgICAgICB0aGlzLl90b3VjaEJlZ2FuUG9zaXRpb24gPSBldmVudC50b3VjaC5nZXRMb2NhdGlvbigpO1xuICAgICAgICB0aGlzLl9zdXBlcihldmVudCwgY2FwdHVyZUxpc3RlbmVycyk7XG4gICAgfSxcblxuICAgIF9vblRvdWNoTW92ZWQ6IGZ1bmN0aW9uIChldmVudCwgY2FwdHVyZUxpc3RlbmVycykge1xuICAgICAgICB0aGlzLl9zdXBlcihldmVudCwgY2FwdHVyZUxpc3RlbmVycyk7XG4gICAgfSxcblxuICAgIF9vblRvdWNoRW5kZWQ6IGZ1bmN0aW9uIChldmVudCwgY2FwdHVyZUxpc3RlbmVycykge1xuICAgICAgICB0aGlzLl90b3VjaEVuZFBvc2l0aW9uID0gZXZlbnQudG91Y2guZ2V0TG9jYXRpb24oKTtcbiAgICAgICAgdGhpcy5fc3VwZXIoZXZlbnQsIGNhcHR1cmVMaXN0ZW5lcnMpO1xuICAgIH0sXG5cbiAgICBfb25Ub3VjaENhbmNlbGxlZDogZnVuY3Rpb24gKGV2ZW50LCBjYXB0dXJlTGlzdGVuZXJzKSB7XG4gICAgICAgIHRoaXMuX3RvdWNoRW5kUG9zaXRpb24gPSBldmVudC50b3VjaC5nZXRMb2NhdGlvbigpO1xuICAgICAgICB0aGlzLl9zdXBlcihldmVudCwgY2FwdHVyZUxpc3RlbmVycyk7XG4gICAgfSxcblxuICAgIF9vbk1vdXNlV2hlZWw6IGZ1bmN0aW9uICgpIHsgfVxufSk7XG5cbmNjLlBhZ2VWaWV3ID0gbW9kdWxlLmV4cG9ydHMgPSBQYWdlVmlldztcblxuLyoqXG4gKiAhI2VuXG4gKiBOb3RlOiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgZnJvbSB0aGUgbm9kZSB0byB3aGljaCB0aGUgY29tcG9uZW50IGJlbG9uZ3MuXG4gKiAhI3poXG4gKiDms6jmhI/vvJrmraTkuovku7bmmK/ku47or6Xnu4Tku7bmiYDlsZ7nmoQgTm9kZSDkuIrpnaLmtL7lj5Hlh7rmnaXnmoTvvIzpnIDopoHnlKggbm9kZS5vbiDmnaXnm5HlkKzjgIJcbiAqIEBldmVudCBwYWdlLXR1cm5pbmdcbiAqIEBwYXJhbSB7RXZlbnQuRXZlbnRDdXN0b219IGV2ZW50XG4gKiBAcGFyYW0ge1BhZ2VWaWV3fSBwYWdlVmlldyAtIFRoZSBQYWdlVmlldyBjb21wb25lbnQuXG4gKi9cbiJdfQ==