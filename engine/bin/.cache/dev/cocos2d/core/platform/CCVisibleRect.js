
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/CCVisibleRect.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org


 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * cc.visibleRect is a singleton object which defines the actual visible rect of the current view,
 * it should represent the same rect as cc.view.getViewportRect()
 *
 * @class visibleRect
 */
cc.visibleRect = {
  topLeft: cc.v2(0, 0),
  topRight: cc.v2(0, 0),
  top: cc.v2(0, 0),
  bottomLeft: cc.v2(0, 0),
  bottomRight: cc.v2(0, 0),
  bottom: cc.v2(0, 0),
  center: cc.v2(0, 0),
  left: cc.v2(0, 0),
  right: cc.v2(0, 0),
  width: 0,
  height: 0,

  /**
   * initialize
   * @method init
   * @param {Rect} visibleRect
   */
  init: function init(visibleRect) {
    var w = this.width = visibleRect.width;
    var h = this.height = visibleRect.height;
    var l = visibleRect.x,
        b = visibleRect.y,
        t = b + h,
        r = l + w; //top

    this.topLeft.x = l;
    this.topLeft.y = t;
    this.topRight.x = r;
    this.topRight.y = t;
    this.top.x = l + w / 2;
    this.top.y = t; //bottom

    this.bottomLeft.x = l;
    this.bottomLeft.y = b;
    this.bottomRight.x = r;
    this.bottomRight.y = b;
    this.bottom.x = l + w / 2;
    this.bottom.y = b; //center

    this.center.x = l + w / 2;
    this.center.y = b + h / 2; //left

    this.left.x = l;
    this.left.y = b + h / 2; //right

    this.right.x = r;
    this.right.y = b + h / 2;
  }
};
/**
 * Top left coordinate of the screen related to the game scene.
 * @property {Vec2} topLeft
 */

/**
 * Top right coordinate of the screen related to the game scene.
 * @property {Vec2} topRight
 */

/**
 * Top center coordinate of the screen related to the game scene.
 * @property {Vec2} top
 */

/**
 * Bottom left coordinate of the screen related to the game scene.
 * @property {Vec2} bottomLeft
 */

/**
 * Bottom right coordinate of the screen related to the game scene.
 * @property {Vec2} bottomRight
 */

/**
 * Bottom center coordinate of the screen related to the game scene.
 * @property {Vec2} bottom
 */

/**
 * Center coordinate of the screen related to the game scene.
 * @property {Vec2} center
 */

/**
 * Left center coordinate of the screen related to the game scene.
 * @property {Vec2} left
 */

/**
 * Right center coordinate of the screen related to the game scene.
 * @property {Vec2} right
 */

/**
 * Width of the screen.
 * @property {Number} width
 */

/**
 * Height of the screen.
 * @property {Number} height
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDVmlzaWJsZVJlY3QuanMiXSwibmFtZXMiOlsiY2MiLCJ2aXNpYmxlUmVjdCIsInRvcExlZnQiLCJ2MiIsInRvcFJpZ2h0IiwidG9wIiwiYm90dG9tTGVmdCIsImJvdHRvbVJpZ2h0IiwiYm90dG9tIiwiY2VudGVyIiwibGVmdCIsInJpZ2h0Iiwid2lkdGgiLCJoZWlnaHQiLCJpbml0IiwidyIsImgiLCJsIiwieCIsImIiLCJ5IiwidCIsInIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkJBOzs7Ozs7QUFNQUEsRUFBRSxDQUFDQyxXQUFILEdBQWlCO0FBQ2JDLEVBQUFBLE9BQU8sRUFBQ0YsRUFBRSxDQUFDRyxFQUFILENBQU0sQ0FBTixFQUFRLENBQVIsQ0FESztBQUViQyxFQUFBQSxRQUFRLEVBQUNKLEVBQUUsQ0FBQ0csRUFBSCxDQUFNLENBQU4sRUFBUSxDQUFSLENBRkk7QUFHYkUsRUFBQUEsR0FBRyxFQUFDTCxFQUFFLENBQUNHLEVBQUgsQ0FBTSxDQUFOLEVBQVEsQ0FBUixDQUhTO0FBSWJHLEVBQUFBLFVBQVUsRUFBQ04sRUFBRSxDQUFDRyxFQUFILENBQU0sQ0FBTixFQUFRLENBQVIsQ0FKRTtBQUtiSSxFQUFBQSxXQUFXLEVBQUNQLEVBQUUsQ0FBQ0csRUFBSCxDQUFNLENBQU4sRUFBUSxDQUFSLENBTEM7QUFNYkssRUFBQUEsTUFBTSxFQUFDUixFQUFFLENBQUNHLEVBQUgsQ0FBTSxDQUFOLEVBQVEsQ0FBUixDQU5NO0FBT2JNLEVBQUFBLE1BQU0sRUFBQ1QsRUFBRSxDQUFDRyxFQUFILENBQU0sQ0FBTixFQUFRLENBQVIsQ0FQTTtBQVFiTyxFQUFBQSxJQUFJLEVBQUNWLEVBQUUsQ0FBQ0csRUFBSCxDQUFNLENBQU4sRUFBUSxDQUFSLENBUlE7QUFTYlEsRUFBQUEsS0FBSyxFQUFDWCxFQUFFLENBQUNHLEVBQUgsQ0FBTSxDQUFOLEVBQVEsQ0FBUixDQVRPO0FBVWJTLEVBQUFBLEtBQUssRUFBQyxDQVZPO0FBV2JDLEVBQUFBLE1BQU0sRUFBQyxDQVhNOztBQWFiOzs7OztBQUtBQyxFQUFBQSxJQUFJLEVBQUMsY0FBU2IsV0FBVCxFQUFxQjtBQUV0QixRQUFJYyxDQUFDLEdBQUcsS0FBS0gsS0FBTCxHQUFhWCxXQUFXLENBQUNXLEtBQWpDO0FBQ0EsUUFBSUksQ0FBQyxHQUFHLEtBQUtILE1BQUwsR0FBY1osV0FBVyxDQUFDWSxNQUFsQztBQUNBLFFBQUlJLENBQUMsR0FBR2hCLFdBQVcsQ0FBQ2lCLENBQXBCO0FBQUEsUUFDSUMsQ0FBQyxHQUFHbEIsV0FBVyxDQUFDbUIsQ0FEcEI7QUFBQSxRQUVJQyxDQUFDLEdBQUdGLENBQUMsR0FBR0gsQ0FGWjtBQUFBLFFBR0lNLENBQUMsR0FBR0wsQ0FBQyxHQUFHRixDQUhaLENBSnNCLENBU3RCOztBQUNBLFNBQUtiLE9BQUwsQ0FBYWdCLENBQWIsR0FBaUJELENBQWpCO0FBQ0EsU0FBS2YsT0FBTCxDQUFha0IsQ0FBYixHQUFpQkMsQ0FBakI7QUFDQSxTQUFLakIsUUFBTCxDQUFjYyxDQUFkLEdBQWtCSSxDQUFsQjtBQUNBLFNBQUtsQixRQUFMLENBQWNnQixDQUFkLEdBQWtCQyxDQUFsQjtBQUNBLFNBQUtoQixHQUFMLENBQVNhLENBQVQsR0FBYUQsQ0FBQyxHQUFHRixDQUFDLEdBQUMsQ0FBbkI7QUFDQSxTQUFLVixHQUFMLENBQVNlLENBQVQsR0FBYUMsQ0FBYixDQWZzQixDQWlCdEI7O0FBQ0EsU0FBS2YsVUFBTCxDQUFnQlksQ0FBaEIsR0FBb0JELENBQXBCO0FBQ0EsU0FBS1gsVUFBTCxDQUFnQmMsQ0FBaEIsR0FBb0JELENBQXBCO0FBQ0EsU0FBS1osV0FBTCxDQUFpQlcsQ0FBakIsR0FBcUJJLENBQXJCO0FBQ0EsU0FBS2YsV0FBTCxDQUFpQmEsQ0FBakIsR0FBcUJELENBQXJCO0FBQ0EsU0FBS1gsTUFBTCxDQUFZVSxDQUFaLEdBQWdCRCxDQUFDLEdBQUdGLENBQUMsR0FBQyxDQUF0QjtBQUNBLFNBQUtQLE1BQUwsQ0FBWVksQ0FBWixHQUFnQkQsQ0FBaEIsQ0F2QnNCLENBeUJ0Qjs7QUFDQSxTQUFLVixNQUFMLENBQVlTLENBQVosR0FBZ0JELENBQUMsR0FBR0YsQ0FBQyxHQUFDLENBQXRCO0FBQ0EsU0FBS04sTUFBTCxDQUFZVyxDQUFaLEdBQWdCRCxDQUFDLEdBQUdILENBQUMsR0FBQyxDQUF0QixDQTNCc0IsQ0E2QnRCOztBQUNBLFNBQUtOLElBQUwsQ0FBVVEsQ0FBVixHQUFjRCxDQUFkO0FBQ0EsU0FBS1AsSUFBTCxDQUFVVSxDQUFWLEdBQWNELENBQUMsR0FBR0gsQ0FBQyxHQUFDLENBQXBCLENBL0JzQixDQWlDdEI7O0FBQ0EsU0FBS0wsS0FBTCxDQUFXTyxDQUFYLEdBQWVJLENBQWY7QUFDQSxTQUFLWCxLQUFMLENBQVdTLENBQVgsR0FBZUQsQ0FBQyxHQUFHSCxDQUFDLEdBQUMsQ0FBckI7QUFDSDtBQXREWSxDQUFqQjtBQXlEQTs7Ozs7QUFLQTs7Ozs7QUFLQTs7Ozs7QUFLQTs7Ozs7QUFLQTs7Ozs7QUFLQTs7Ozs7QUFLQTs7Ozs7QUFLQTs7Ozs7QUFLQTs7Ozs7QUFLQTs7Ozs7QUFLQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDExLTIwMTIgY29jb3MyZC14Lm9yZ1xuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHA6Ly93d3cuY29jb3MyZC14Lm9yZ1xuXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vKipcbiAqIGNjLnZpc2libGVSZWN0IGlzIGEgc2luZ2xldG9uIG9iamVjdCB3aGljaCBkZWZpbmVzIHRoZSBhY3R1YWwgdmlzaWJsZSByZWN0IG9mIHRoZSBjdXJyZW50IHZpZXcsXG4gKiBpdCBzaG91bGQgcmVwcmVzZW50IHRoZSBzYW1lIHJlY3QgYXMgY2Mudmlldy5nZXRWaWV3cG9ydFJlY3QoKVxuICpcbiAqIEBjbGFzcyB2aXNpYmxlUmVjdFxuICovXG5jYy52aXNpYmxlUmVjdCA9IHtcbiAgICB0b3BMZWZ0OmNjLnYyKDAsMCksXG4gICAgdG9wUmlnaHQ6Y2MudjIoMCwwKSxcbiAgICB0b3A6Y2MudjIoMCwwKSxcbiAgICBib3R0b21MZWZ0OmNjLnYyKDAsMCksXG4gICAgYm90dG9tUmlnaHQ6Y2MudjIoMCwwKSxcbiAgICBib3R0b206Y2MudjIoMCwwKSxcbiAgICBjZW50ZXI6Y2MudjIoMCwwKSxcbiAgICBsZWZ0OmNjLnYyKDAsMCksXG4gICAgcmlnaHQ6Y2MudjIoMCwwKSxcbiAgICB3aWR0aDowLFxuICAgIGhlaWdodDowLFxuXG4gICAgLyoqXG4gICAgICogaW5pdGlhbGl6ZVxuICAgICAqIEBtZXRob2QgaW5pdFxuICAgICAqIEBwYXJhbSB7UmVjdH0gdmlzaWJsZVJlY3RcbiAgICAgKi9cbiAgICBpbml0OmZ1bmN0aW9uKHZpc2libGVSZWN0KXtcblxuICAgICAgICB2YXIgdyA9IHRoaXMud2lkdGggPSB2aXNpYmxlUmVjdC53aWR0aDtcbiAgICAgICAgdmFyIGggPSB0aGlzLmhlaWdodCA9IHZpc2libGVSZWN0LmhlaWdodDtcbiAgICAgICAgdmFyIGwgPSB2aXNpYmxlUmVjdC54LFxuICAgICAgICAgICAgYiA9IHZpc2libGVSZWN0LnksXG4gICAgICAgICAgICB0ID0gYiArIGgsXG4gICAgICAgICAgICByID0gbCArIHc7XG5cbiAgICAgICAgLy90b3BcbiAgICAgICAgdGhpcy50b3BMZWZ0LnggPSBsO1xuICAgICAgICB0aGlzLnRvcExlZnQueSA9IHQ7XG4gICAgICAgIHRoaXMudG9wUmlnaHQueCA9IHI7XG4gICAgICAgIHRoaXMudG9wUmlnaHQueSA9IHQ7XG4gICAgICAgIHRoaXMudG9wLnggPSBsICsgdy8yO1xuICAgICAgICB0aGlzLnRvcC55ID0gdDtcblxuICAgICAgICAvL2JvdHRvbVxuICAgICAgICB0aGlzLmJvdHRvbUxlZnQueCA9IGw7XG4gICAgICAgIHRoaXMuYm90dG9tTGVmdC55ID0gYjtcbiAgICAgICAgdGhpcy5ib3R0b21SaWdodC54ID0gcjtcbiAgICAgICAgdGhpcy5ib3R0b21SaWdodC55ID0gYjtcbiAgICAgICAgdGhpcy5ib3R0b20ueCA9IGwgKyB3LzI7XG4gICAgICAgIHRoaXMuYm90dG9tLnkgPSBiO1xuXG4gICAgICAgIC8vY2VudGVyXG4gICAgICAgIHRoaXMuY2VudGVyLnggPSBsICsgdy8yO1xuICAgICAgICB0aGlzLmNlbnRlci55ID0gYiArIGgvMjtcblxuICAgICAgICAvL2xlZnRcbiAgICAgICAgdGhpcy5sZWZ0LnggPSBsO1xuICAgICAgICB0aGlzLmxlZnQueSA9IGIgKyBoLzI7XG5cbiAgICAgICAgLy9yaWdodFxuICAgICAgICB0aGlzLnJpZ2h0LnggPSByO1xuICAgICAgICB0aGlzLnJpZ2h0LnkgPSBiICsgaC8yO1xuICAgIH1cbn07XG5cbi8qKlxuICogVG9wIGxlZnQgY29vcmRpbmF0ZSBvZiB0aGUgc2NyZWVuIHJlbGF0ZWQgdG8gdGhlIGdhbWUgc2NlbmUuXG4gKiBAcHJvcGVydHkge1ZlYzJ9IHRvcExlZnRcbiAqL1xuXG4vKipcbiAqIFRvcCByaWdodCBjb29yZGluYXRlIG9mIHRoZSBzY3JlZW4gcmVsYXRlZCB0byB0aGUgZ2FtZSBzY2VuZS5cbiAqIEBwcm9wZXJ0eSB7VmVjMn0gdG9wUmlnaHRcbiAqL1xuXG4vKipcbiAqIFRvcCBjZW50ZXIgY29vcmRpbmF0ZSBvZiB0aGUgc2NyZWVuIHJlbGF0ZWQgdG8gdGhlIGdhbWUgc2NlbmUuXG4gKiBAcHJvcGVydHkge1ZlYzJ9IHRvcFxuICovXG5cbi8qKlxuICogQm90dG9tIGxlZnQgY29vcmRpbmF0ZSBvZiB0aGUgc2NyZWVuIHJlbGF0ZWQgdG8gdGhlIGdhbWUgc2NlbmUuXG4gKiBAcHJvcGVydHkge1ZlYzJ9IGJvdHRvbUxlZnRcbiAqL1xuXG4vKipcbiAqIEJvdHRvbSByaWdodCBjb29yZGluYXRlIG9mIHRoZSBzY3JlZW4gcmVsYXRlZCB0byB0aGUgZ2FtZSBzY2VuZS5cbiAqIEBwcm9wZXJ0eSB7VmVjMn0gYm90dG9tUmlnaHRcbiAqL1xuXG4vKipcbiAqIEJvdHRvbSBjZW50ZXIgY29vcmRpbmF0ZSBvZiB0aGUgc2NyZWVuIHJlbGF0ZWQgdG8gdGhlIGdhbWUgc2NlbmUuXG4gKiBAcHJvcGVydHkge1ZlYzJ9IGJvdHRvbVxuICovXG5cbi8qKlxuICogQ2VudGVyIGNvb3JkaW5hdGUgb2YgdGhlIHNjcmVlbiByZWxhdGVkIHRvIHRoZSBnYW1lIHNjZW5lLlxuICogQHByb3BlcnR5IHtWZWMyfSBjZW50ZXJcbiAqL1xuXG4vKipcbiAqIExlZnQgY2VudGVyIGNvb3JkaW5hdGUgb2YgdGhlIHNjcmVlbiByZWxhdGVkIHRvIHRoZSBnYW1lIHNjZW5lLlxuICogQHByb3BlcnR5IHtWZWMyfSBsZWZ0XG4gKi9cblxuLyoqXG4gKiBSaWdodCBjZW50ZXIgY29vcmRpbmF0ZSBvZiB0aGUgc2NyZWVuIHJlbGF0ZWQgdG8gdGhlIGdhbWUgc2NlbmUuXG4gKiBAcHJvcGVydHkge1ZlYzJ9IHJpZ2h0XG4gKi9cblxuLyoqXG4gKiBXaWR0aCBvZiB0aGUgc2NyZWVuLlxuICogQHByb3BlcnR5IHtOdW1iZXJ9IHdpZHRoXG4gKi9cblxuLyoqXG4gKiBIZWlnaHQgb2YgdGhlIHNjcmVlbi5cbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBoZWlnaHRcbiAqL1xuXG4iXX0=