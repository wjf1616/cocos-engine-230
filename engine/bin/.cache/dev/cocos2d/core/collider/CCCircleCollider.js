
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/collider/CCCircleCollider.js';
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
 * !#en Defines a Circle Collider .
 * !#zh 用来定义圆形碰撞体
 * @class Collider.Circle
 */
cc.Collider.Circle = cc.Class({
  properties: {
    _offset: cc.v2(0, 0),
    _radius: 50,

    /**
     * !#en Position offset
     * !#zh 位置偏移量
     * @property offset
     * @type {Vec2}
     */
    offset: {
      get: function get() {
        return this._offset;
      },
      set: function set(value) {
        this._offset = value;
      },
      type: cc.Vec2
    },

    /**
     * !#en Circle radius
     * !#zh 圆形半径
     * @property radius
     * @type {Number}
     */
    radius: {
      tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.radius',
      get: function get() {
        return this._radius;
      },
      set: function set(value) {
        this._radius = value < 0 ? 0 : value;
      }
    }
  },
  resetInEditor: CC_EDITOR && function () {
    var size = this.node.getContentSize();
    var radius = Math.max(size.width, size.height);

    if (radius !== 0) {
      this.radius = radius;
    }
  }
});
/**
 * !#en Circle Collider.
 * !#zh 圆形碰撞组件
 * @class CircleCollider
 * @extends Collider
 * @uses Collider.Circle
 */

var CircleCollider = cc.Class({
  name: 'cc.CircleCollider',
  "extends": cc.Collider,
  mixins: [cc.Collider.Circle],
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.collider/Circle Collider'
  }
});
cc.CircleCollider = module.exports = CircleCollider;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDQ2lyY2xlQ29sbGlkZXIuanMiXSwibmFtZXMiOlsiY2MiLCJDb2xsaWRlciIsIkNpcmNsZSIsIkNsYXNzIiwicHJvcGVydGllcyIsIl9vZmZzZXQiLCJ2MiIsIl9yYWRpdXMiLCJvZmZzZXQiLCJnZXQiLCJzZXQiLCJ2YWx1ZSIsInR5cGUiLCJWZWMyIiwicmFkaXVzIiwidG9vbHRpcCIsIkNDX0RFViIsInJlc2V0SW5FZGl0b3IiLCJDQ19FRElUT1IiLCJzaXplIiwibm9kZSIsImdldENvbnRlbnRTaXplIiwiTWF0aCIsIm1heCIsIndpZHRoIiwiaGVpZ2h0IiwiQ2lyY2xlQ29sbGlkZXIiLCJuYW1lIiwibWl4aW5zIiwiZWRpdG9yIiwibWVudSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkE7Ozs7O0FBS0FBLEVBQUUsQ0FBQ0MsUUFBSCxDQUFZQyxNQUFaLEdBQXFCRixFQUFFLENBQUNHLEtBQUgsQ0FBUztBQUMxQkMsRUFBQUEsVUFBVSxFQUFFO0FBQ1JDLElBQUFBLE9BQU8sRUFBRUwsRUFBRSxDQUFDTSxFQUFILENBQU0sQ0FBTixFQUFTLENBQVQsQ0FERDtBQUVSQyxJQUFBQSxPQUFPLEVBQUUsRUFGRDs7QUFJUjs7Ozs7O0FBTUFDLElBQUFBLE1BQU0sRUFBRTtBQUNKQyxNQUFBQSxHQUFHLEVBQUUsZUFBWTtBQUNiLGVBQU8sS0FBS0osT0FBWjtBQUNILE9BSEc7QUFJSkssTUFBQUEsR0FBRyxFQUFFLGFBQVVDLEtBQVYsRUFBaUI7QUFDbEIsYUFBS04sT0FBTCxHQUFlTSxLQUFmO0FBQ0gsT0FORztBQU9KQyxNQUFBQSxJQUFJLEVBQUVaLEVBQUUsQ0FBQ2E7QUFQTCxLQVZBOztBQW9CUjs7Ozs7O0FBTUFDLElBQUFBLE1BQU0sRUFBRTtBQUNKQyxNQUFBQSxPQUFPLEVBQUVDLE1BQU0sSUFBSSxnREFEZjtBQUVKUCxNQUFBQSxHQUFHLEVBQUUsZUFBWTtBQUNiLGVBQU8sS0FBS0YsT0FBWjtBQUNILE9BSkc7QUFLSkcsTUFBQUEsR0FBRyxFQUFFLGFBQVVDLEtBQVYsRUFBaUI7QUFDbEIsYUFBS0osT0FBTCxHQUFlSSxLQUFLLEdBQUcsQ0FBUixHQUFZLENBQVosR0FBZ0JBLEtBQS9CO0FBQ0g7QUFQRztBQTFCQSxHQURjO0FBc0MxQk0sRUFBQUEsYUFBYSxFQUFFQyxTQUFTLElBQUksWUFBWTtBQUNwQyxRQUFJQyxJQUFJLEdBQUcsS0FBS0MsSUFBTCxDQUFVQyxjQUFWLEVBQVg7QUFDQSxRQUFJUCxNQUFNLEdBQUdRLElBQUksQ0FBQ0MsR0FBTCxDQUFTSixJQUFJLENBQUNLLEtBQWQsRUFBcUJMLElBQUksQ0FBQ00sTUFBMUIsQ0FBYjs7QUFDQSxRQUFJWCxNQUFNLEtBQUssQ0FBZixFQUFrQjtBQUNkLFdBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUNIO0FBQ0o7QUE1Q3lCLENBQVQsQ0FBckI7QUErQ0E7Ozs7Ozs7O0FBT0EsSUFBSVksY0FBYyxHQUFHMUIsRUFBRSxDQUFDRyxLQUFILENBQVM7QUFDMUJ3QixFQUFBQSxJQUFJLEVBQUUsbUJBRG9CO0FBRTFCLGFBQVMzQixFQUFFLENBQUNDLFFBRmM7QUFHMUIyQixFQUFBQSxNQUFNLEVBQUUsQ0FBQzVCLEVBQUUsQ0FBQ0MsUUFBSCxDQUFZQyxNQUFiLENBSGtCO0FBSzFCMkIsRUFBQUEsTUFBTSxFQUFFWCxTQUFTLElBQUk7QUFDakJZLElBQUFBLElBQUksRUFBRTtBQURXO0FBTEssQ0FBVCxDQUFyQjtBQVVBOUIsRUFBRSxDQUFDMEIsY0FBSCxHQUFvQkssTUFBTSxDQUFDQyxPQUFQLEdBQWlCTixjQUFyQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLyoqXG4gKiAhI2VuIERlZmluZXMgYSBDaXJjbGUgQ29sbGlkZXIgLlxuICogISN6aCDnlKjmnaXlrprkuYnlnIblvaLnorDmkp7kvZNcbiAqIEBjbGFzcyBDb2xsaWRlci5DaXJjbGVcbiAqL1xuY2MuQ29sbGlkZXIuQ2lyY2xlID0gY2MuQ2xhc3Moe1xuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgX29mZnNldDogY2MudjIoMCwgMCksXG4gICAgICAgIF9yYWRpdXM6IDUwLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFBvc2l0aW9uIG9mZnNldFxuICAgICAgICAgKiAhI3poIOS9jee9ruWBj+enu+mHj1xuICAgICAgICAgKiBAcHJvcGVydHkgb2Zmc2V0XG4gICAgICAgICAqIEB0eXBlIHtWZWMyfVxuICAgICAgICAgKi9cbiAgICAgICAgb2Zmc2V0OiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fb2Zmc2V0O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb2Zmc2V0ID0gdmFsdWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHlwZTogY2MuVmVjMlxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIENpcmNsZSByYWRpdXNcbiAgICAgICAgICogISN6aCDlnIblvaLljYrlvoRcbiAgICAgICAgICogQHByb3BlcnR5IHJhZGl1c1xuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgcmFkaXVzOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBoeXNpY3MucGh5c2ljc19jb2xsaWRlci5yYWRpdXMnLFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JhZGl1cztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JhZGl1cyA9IHZhbHVlIDwgMCA/IDAgOiB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZXNldEluRWRpdG9yOiBDQ19FRElUT1IgJiYgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc2l6ZSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpO1xuICAgICAgICB2YXIgcmFkaXVzID0gTWF0aC5tYXgoc2l6ZS53aWR0aCwgc2l6ZS5oZWlnaHQpO1xuICAgICAgICBpZiAocmFkaXVzICE9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG4vKipcbiAqICEjZW4gQ2lyY2xlIENvbGxpZGVyLlxuICogISN6aCDlnIblvaLnorDmkp7nu4Tku7ZcbiAqIEBjbGFzcyBDaXJjbGVDb2xsaWRlclxuICogQGV4dGVuZHMgQ29sbGlkZXJcbiAqIEB1c2VzIENvbGxpZGVyLkNpcmNsZVxuICovXG52YXIgQ2lyY2xlQ29sbGlkZXIgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLkNpcmNsZUNvbGxpZGVyJyxcbiAgICBleHRlbmRzOiBjYy5Db2xsaWRlcixcbiAgICBtaXhpbnM6IFtjYy5Db2xsaWRlci5DaXJjbGVdLFxuXG4gICAgZWRpdG9yOiBDQ19FRElUT1IgJiYge1xuICAgICAgICBtZW51OiAnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50LmNvbGxpZGVyL0NpcmNsZSBDb2xsaWRlcidcbiAgICB9LFxufSk7XG5cbmNjLkNpcmNsZUNvbGxpZGVyID0gbW9kdWxlLmV4cG9ydHMgPSBDaXJjbGVDb2xsaWRlcjtcbiJdfQ==