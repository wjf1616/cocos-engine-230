
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCPageViewIndicator.js';
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
 * !#en Enum for PageView Indicator direction
 * !#zh 页面视图指示器的摆放方向
 * @enum PageViewIndicator.Direction
 */
var Direction = cc.Enum({
  /**
   * !#en The horizontal direction.
   * !#zh 水平方向
   * @property {Number} HORIZONTAL
   */
  HORIZONTAL: 0,

  /**
   * !#en The vertical direction.
   * !#zh 垂直方向
   * @property {Number} VERTICAL
   */
  VERTICAL: 1
});
/**
 * !#en The Page View Indicator Component
 * !#zh 页面视图每页标记组件
 * @class PageViewIndicator
 * @extends Component
 */

var PageViewIndicator = cc.Class({
  name: 'cc.PageViewIndicator',
  "extends": require('./CCComponent'),
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.ui/PageViewIndicator',
    help: 'i18n:COMPONENT.help_url.pageviewIndicator'
  },
  properties: {
    _layout: null,
    _pageView: null,
    _indicators: [],

    /**
     * !#en The spriteFrame for each element.
     * !#zh 每个页面标记显示的图片
     * @property {SpriteFrame} spriteFrame
     */
    spriteFrame: {
      "default": null,
      type: cc.SpriteFrame,
      tooltip: CC_DEV && 'i18n:COMPONENT.pageview_indicator.spriteFrame'
    },

    /**
     * !#en The location direction of PageViewIndicator.
     * !#zh 页面标记摆放方向
     *@property {PageViewIndicator.Direction} direction
     */
    direction: {
      "default": Direction.HORIZONTAL,
      type: Direction,
      tooltip: CC_DEV && 'i18n:COMPONENT.pageview_indicator.direction'
    },

    /**
     * !#en The cellSize for each element.
     * !#zh 每个页面标记的大小
     * @property {Size} cellSize
     */
    cellSize: {
      "default": cc.size(20, 20),
      tooltip: CC_DEV && 'i18n:COMPONENT.pageview_indicator.cell_size'
    },

    /**
     * !#en The distance between each element.
     * !#zh 每个页面标记之间的边距
     * @property {Number} spacing
     */
    spacing: {
      "default": 0,
      tooltip: CC_DEV && 'i18n:COMPONENT.pageview_indicator.spacing'
    }
  },
  statics: {
    Direction: Direction
  },
  onLoad: function onLoad() {
    this._updateLayout();
  },

  /**
   * !#en Set Page View
   * !#zh 设置页面视图
   * @method setPageView
   * @param {PageView} target
   */
  setPageView: function setPageView(target) {
    this._pageView = target;

    this._refresh();
  },
  _updateLayout: function _updateLayout() {
    this._layout = this.getComponent(cc.Layout);

    if (!this._layout) {
      this._layout = this.addComponent(cc.Layout);
    }

    if (this.direction === Direction.HORIZONTAL) {
      this._layout.type = cc.Layout.Type.HORIZONTAL;
      this._layout.spacingX = this.spacing;
    } else if (this.direction === Direction.VERTICAL) {
      this._layout.type = cc.Layout.Type.VERTICAL;
      this._layout.spacingY = this.spacing;
    }

    this._layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
  },
  _createIndicator: function _createIndicator() {
    var node = new cc.Node();
    var sprite = node.addComponent(cc.Sprite);
    sprite.spriteFrame = this.spriteFrame;
    sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
    node.parent = this.node;
    node.width = this.cellSize.width;
    node.height = this.cellSize.height;
    return node;
  },
  _changedState: function _changedState() {
    var indicators = this._indicators;
    if (indicators.length === 0) return;
    var idx = this._pageView._curPageIdx;
    if (idx >= indicators.length) return;

    for (var i = 0; i < indicators.length; ++i) {
      var node = indicators[i];
      node.opacity = 255 / 2;
    }

    indicators[idx].opacity = 255;
  },
  _refresh: function _refresh() {
    if (!this._pageView) {
      return;
    }

    var indicators = this._indicators;

    var pages = this._pageView.getPages();

    if (pages.length === indicators.length) {
      return;
    }

    var i = 0;

    if (pages.length > indicators.length) {
      for (i = 0; i < pages.length; ++i) {
        if (!indicators[i]) {
          indicators[i] = this._createIndicator();
        }
      }
    } else {
      var count = indicators.length - pages.length;

      for (i = count; i > 0; --i) {
        var node = indicators[i - 1];
        this.node.removeChild(node);
        indicators.splice(i - 1, 1);
      }
    }

    if (this._layout && this._layout.enabledInHierarchy) {
      this._layout.updateLayout();
    }

    this._changedState();
  }
});
cc.PageViewIndicator = module.exports = PageViewIndicator;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDUGFnZVZpZXdJbmRpY2F0b3IuanMiXSwibmFtZXMiOlsiRGlyZWN0aW9uIiwiY2MiLCJFbnVtIiwiSE9SSVpPTlRBTCIsIlZFUlRJQ0FMIiwiUGFnZVZpZXdJbmRpY2F0b3IiLCJDbGFzcyIsIm5hbWUiLCJyZXF1aXJlIiwiZWRpdG9yIiwiQ0NfRURJVE9SIiwibWVudSIsImhlbHAiLCJwcm9wZXJ0aWVzIiwiX2xheW91dCIsIl9wYWdlVmlldyIsIl9pbmRpY2F0b3JzIiwic3ByaXRlRnJhbWUiLCJ0eXBlIiwiU3ByaXRlRnJhbWUiLCJ0b29sdGlwIiwiQ0NfREVWIiwiZGlyZWN0aW9uIiwiY2VsbFNpemUiLCJzaXplIiwic3BhY2luZyIsInN0YXRpY3MiLCJvbkxvYWQiLCJfdXBkYXRlTGF5b3V0Iiwic2V0UGFnZVZpZXciLCJ0YXJnZXQiLCJfcmVmcmVzaCIsImdldENvbXBvbmVudCIsIkxheW91dCIsImFkZENvbXBvbmVudCIsIlR5cGUiLCJzcGFjaW5nWCIsInNwYWNpbmdZIiwicmVzaXplTW9kZSIsIlJlc2l6ZU1vZGUiLCJDT05UQUlORVIiLCJfY3JlYXRlSW5kaWNhdG9yIiwibm9kZSIsIk5vZGUiLCJzcHJpdGUiLCJTcHJpdGUiLCJzaXplTW9kZSIsIlNpemVNb2RlIiwiQ1VTVE9NIiwicGFyZW50Iiwid2lkdGgiLCJoZWlnaHQiLCJfY2hhbmdlZFN0YXRlIiwiaW5kaWNhdG9ycyIsImxlbmd0aCIsImlkeCIsIl9jdXJQYWdlSWR4IiwiaSIsIm9wYWNpdHkiLCJwYWdlcyIsImdldFBhZ2VzIiwiY291bnQiLCJyZW1vdmVDaGlsZCIsInNwbGljZSIsImVuYWJsZWRJbkhpZXJhcmNoeSIsInVwZGF0ZUxheW91dCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkE7Ozs7O0FBS0EsSUFBSUEsU0FBUyxHQUFHQyxFQUFFLENBQUNDLElBQUgsQ0FBUTtB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LGtCQUFoQyxFQUFvRDtBQUNoRCxXQUFLbEQsT0FBTCxDQUFhbUQsWUFBYjtBQUNIOztBQUNELFNBQUtiLGFBQUw7QUFDSDtBQTlJNEIsQ0FBVCxDQUF4QjtBQWtKQW5ELEVBQUUsQ0FBQ0ksaUJBQUgsR0FBdUI2RCxNQUFNLENBQUNDLE9BQVAsR0FBaUI5RCxpQkFBeEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLyoqXG4gKiAhI2VuIEVudW0gZm9yIFBhZ2VWaWV3IEluZGljYXRvciBkaXJlY3Rpb25cbiAqICEjemgg6aG16Z2i6KeG5Zu+5oyH56S65Zmo55qE5pGG5pS+5pa55ZCRXG4gKiBAZW51bSBQYWdlVmlld0luZGljYXRvci5EaXJlY3Rpb25cbiAqL1xudmFyIERpcmVjdGlvbiA9IGNjLkVudW0oe1xuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGhvcml6b250YWwgZGlyZWN0aW9uLlxuICAgICAqICEjemgg5rC05bmz5pa55ZCRXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEhPUklaT05UQUxcbiAgICAgKi9cbiAgICBIT1JJWk9OVEFMOiAwLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgdmVydGljYWwgZGlyZWN0aW9uLlxuICAgICAqICEjemgg5Z6C55u05pa55ZCRXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFZFUlRJQ0FMXG4gICAgICovXG4gICAgVkVSVElDQUw6IDFcbn0pO1xuXG5cbi8qKlxuICogISNlbiBUaGUgUGFnZSBWaWV3IEluZGljYXRvciBDb21wb25lbnRcbiAqICEjemgg6aG16Z2i6KeG5Zu+5q+P6aG15qCH6K6w57uE5Lu2XG4gKiBAY2xhc3MgUGFnZVZpZXdJbmRpY2F0b3JcbiAqIEBleHRlbmRzIENvbXBvbmVudFxuICovXG52YXIgUGFnZVZpZXdJbmRpY2F0b3IgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlBhZ2VWaWV3SW5kaWNhdG9yJyxcbiAgICBleHRlbmRzOiByZXF1aXJlKCcuL0NDQ29tcG9uZW50JyksXG5cbiAgICBlZGl0b3I6IENDX0VESVRPUiAmJiB7XG4gICAgICAgIG1lbnU6ICdpMThuOk1BSU5fTUVOVS5jb21wb25lbnQudWkvUGFnZVZpZXdJbmRpY2F0b3InLFxuICAgICAgICBoZWxwOiAnaTE4bjpDT01QT05FTlQuaGVscF91cmwucGFnZXZpZXdJbmRpY2F0b3InXG4gICAgfSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgX2xheW91dDogbnVsbCxcbiAgICAgICAgX3BhZ2VWaWV3OiBudWxsLFxuICAgICAgICBfaW5kaWNhdG9yczogW10sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIHNwcml0ZUZyYW1lIGZvciBlYWNoIGVsZW1lbnQuXG4gICAgICAgICAqICEjemgg5q+P5Liq6aG16Z2i5qCH6K6w5pi+56S655qE5Zu+54mHXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U3ByaXRlRnJhbWV9IHNwcml0ZUZyYW1lXG4gICAgICAgICAqL1xuICAgICAgICBzcHJpdGVGcmFtZToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZUZyYW1lLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5wYWdldmlld19pbmRpY2F0b3Iuc3ByaXRlRnJhbWUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIGxvY2F0aW9uIGRpcmVjdGlvbiBvZiBQYWdlVmlld0luZGljYXRvci5cbiAgICAgICAgICogISN6aCDpobXpnaLmoIforrDmkYbmlL7mlrnlkJFcbiAgICAgICAgICpAcHJvcGVydHkge1BhZ2VWaWV3SW5kaWNhdG9yLkRpcmVjdGlvbn0gZGlyZWN0aW9uXG4gICAgICAgICAqL1xuICAgICAgICBkaXJlY3Rpb246IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IERpcmVjdGlvbi5IT1JJWk9OVEFMLFxuICAgICAgICAgICAgdHlwZTogRGlyZWN0aW9uLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5wYWdldmlld19pbmRpY2F0b3IuZGlyZWN0aW9uJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBjZWxsU2l6ZSBmb3IgZWFjaCBlbGVtZW50LlxuICAgICAgICAgKiAhI3poIOavj+S4qumhtemdouagh+iusOeahOWkp+Wwj1xuICAgICAgICAgKiBAcHJvcGVydHkge1NpemV9IGNlbGxTaXplXG4gICAgICAgICAqL1xuICAgICAgICBjZWxsU2l6ZToge1xuICAgICAgICAgICAgZGVmYXVsdDogY2Muc2l6ZSgyMCwgMjApLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5wYWdldmlld19pbmRpY2F0b3IuY2VsbF9zaXplJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBkaXN0YW5jZSBiZXR3ZWVuIGVhY2ggZWxlbWVudC5cbiAgICAgICAgICogISN6aCDmr4/kuKrpobXpnaLmoIforrDkuYvpl7TnmoTovrnot51cbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHNwYWNpbmdcbiAgICAgICAgICovXG4gICAgICAgIHNwYWNpbmc6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IDAsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBhZ2V2aWV3X2luZGljYXRvci5zcGFjaW5nJ1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHN0YXRpY3M6IHtcbiAgICAgICAgRGlyZWN0aW9uOiBEaXJlY3Rpb25cbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUxheW91dCgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCBQYWdlIFZpZXdcbiAgICAgKiAhI3poIOiuvue9rumhtemdouinhuWbvlxuICAgICAqIEBtZXRob2Qgc2V0UGFnZVZpZXdcbiAgICAgKiBAcGFyYW0ge1BhZ2VWaWV3fSB0YXJnZXRcbiAgICAgKi9cbiAgICBzZXRQYWdlVmlldzogZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICB0aGlzLl9wYWdlVmlldyA9IHRhcmdldDtcbiAgICAgICAgdGhpcy5fcmVmcmVzaCgpO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlTGF5b3V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2xheW91dCA9IHRoaXMuZ2V0Q29tcG9uZW50KGNjLkxheW91dCk7XG4gICAgICAgIGlmICghdGhpcy5fbGF5b3V0KSB7XG4gICAgICAgICAgICB0aGlzLl9sYXlvdXQgPSB0aGlzLmFkZENvbXBvbmVudChjYy5MYXlvdXQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLkhPUklaT05UQUwpIHtcbiAgICAgICAgICAgIHRoaXMuX2xheW91dC50eXBlID0gY2MuTGF5b3V0LlR5cGUuSE9SSVpPTlRBTDtcbiAgICAgICAgICAgIHRoaXMuX2xheW91dC5zcGFjaW5nWCA9IHRoaXMuc3BhY2luZztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLlZFUlRJQ0FMKSB7XG4gICAgICAgICAgICB0aGlzLl9sYXlvdXQudHlwZSA9IGNjLkxheW91dC5UeXBlLlZFUlRJQ0FMO1xuICAgICAgICAgICAgdGhpcy5fbGF5b3V0LnNwYWNpbmdZID0gdGhpcy5zcGFjaW5nO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2xheW91dC5yZXNpemVNb2RlID0gY2MuTGF5b3V0LlJlc2l6ZU1vZGUuQ09OVEFJTkVSO1xuICAgIH0sXG5cbiAgICBfY3JlYXRlSW5kaWNhdG9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBub2RlID0gbmV3IGNjLk5vZGUoKTtcbiAgICAgICAgdmFyIHNwcml0ZSA9IG5vZGUuYWRkQ29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgIHNwcml0ZS5zcHJpdGVGcmFtZSA9IHRoaXMuc3ByaXRlRnJhbWU7XG4gICAgICAgIHNwcml0ZS5zaXplTW9kZSA9IGNjLlNwcml0ZS5TaXplTW9kZS5DVVNUT007XG4gICAgICAgIG5vZGUucGFyZW50ID0gdGhpcy5ub2RlO1xuICAgICAgICBub2RlLndpZHRoID0gdGhpcy5jZWxsU2l6ZS53aWR0aDtcbiAgICAgICAgbm9kZS5oZWlnaHQgPSB0aGlzLmNlbGxTaXplLmhlaWdodDtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfSxcblxuICAgIF9jaGFuZ2VkU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGluZGljYXRvcnMgPSB0aGlzLl9pbmRpY2F0b3JzO1xuICAgICAgICBpZiAoaW5kaWNhdG9ycy5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICAgICAgdmFyIGlkeCA9IHRoaXMuX3BhZ2VWaWV3Ll9jdXJQYWdlSWR4O1xuICAgICAgICBpZiAoaWR4ID49IGluZGljYXRvcnMubGVuZ3RoKSByZXR1cm47XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW5kaWNhdG9ycy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSBpbmRpY2F0b3JzW2ldO1xuICAgICAgICAgICAgbm9kZS5vcGFjaXR5ID0gMjU1IC8gMjtcbiAgICAgICAgfVxuICAgICAgICBpbmRpY2F0b3JzW2lkeF0ub3BhY2l0eSA9IDI1NTtcbiAgICB9LFxuXG4gICAgX3JlZnJlc2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9wYWdlVmlldykgeyByZXR1cm47IH1cbiAgICAgICAgdmFyIGluZGljYXRvcnMgPSB0aGlzLl9pbmRpY2F0b3JzO1xuICAgICAgICB2YXIgcGFnZXMgPSB0aGlzLl9wYWdlVmlldy5nZXRQYWdlcygpO1xuICAgICAgICBpZiAocGFnZXMubGVuZ3RoID09PSBpbmRpY2F0b3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgaWYgKHBhZ2VzLmxlbmd0aCA+IGluZGljYXRvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcGFnZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWluZGljYXRvcnNbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kaWNhdG9yc1tpXSA9IHRoaXMuX2NyZWF0ZUluZGljYXRvcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBjb3VudCA9IGluZGljYXRvcnMubGVuZ3RoIC0gcGFnZXMubGVuZ3RoO1xuICAgICAgICAgICAgZm9yIChpID0gY291bnQ7IGkgPiAwOyAtLWkpIHtcbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IGluZGljYXRvcnNbaSAtIDFdO1xuICAgICAgICAgICAgICAgIHRoaXMubm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgICAgICAgICAgICBpbmRpY2F0b3JzLnNwbGljZShpIC0gMSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5fbGF5b3V0ICYmIHRoaXMuX2xheW91dC5lbmFibGVkSW5IaWVyYXJjaHkpIHtcbiAgICAgICAgICAgIHRoaXMuX2xheW91dC51cGRhdGVMYXlvdXQoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jaGFuZ2VkU3RhdGUoKTtcbiAgICB9XG59KTtcblxuXG5jYy5QYWdlVmlld0luZGljYXRvciA9IG1vZHVsZS5leHBvcnRzID0gUGFnZVZpZXdJbmRpY2F0b3I7XG4iXX0=