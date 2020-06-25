
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/index.js';
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
require('./CCComponent');

require('./CCComponentEventHandler');

require('./missing-script'); // In case subContextView modules are excluded


var WXSubContextView = require('./WXSubContextView');

var SwanSubContextView = require('./SwanSubContextView');

if (!WXSubContextView) {
  WXSubContextView = cc.Class({
    name: 'cc.WXSubContextView',
    "extends": cc.Component
  });
}

if (!SwanSubContextView) {
  SwanSubContextView = cc.Class({
    name: 'cc.SwanSubContextView',
    "extends": cc.Component
  });
}

var components = [require('./CCSprite'), require('./CCWidget'), require('./CCCanvas'), require('./CCAudioSource'), require('./CCAnimation'), require('./CCButton'), require('./CCLabel'), require('./CCProgressBar'), require('./CCMask'), require('./CCScrollBar'), require('./CCScrollView'), require('./CCPageViewIndicator'), require('./CCPageView'), require('./CCSlider'), require('./CCLayout'), require('./editbox/CCEditBox'), require('./CCLabelOutline'), require('./CCLabelShadow'), require('./CCRichText'), require('./CCToggleContainer'), require('./CCToggleGroup'), require('./CCToggle'), require('./CCBlockInputEvents'), require('./CCMotionStreak'), WXSubContextView, SwanSubContextView];
module.exports = components;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJXWFN1YkNvbnRleHRWaWV3IiwiU3dhblN1YkNvbnRleHRWaWV3IiwiY2MiLCJDbGFzcyIsIm5hbWUiLCJDb21wb25lbnQiLCJjb21wb25lbnRzIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBQSxPQUFPLENBQUMsZUFBRCxDQUFQOztBQUNBQSxPQUFPLENBQUMsMkJBQUQsQ0FBUDs7QUFDQUEsT0FBTyxDQUFDLGtCQUFELENBQVAsRUFFQTs7O0FBQ0EsSUFBSUMsZ0JBQWdCLEdBQUdELE9BQU8sQ0FBQyxvQkFBRCxDQUE5Qjs7QUFDQSxJQUFJRSxrQkFBa0IsR0FBR0YsT0FBTyxDQUFDLHNCQUFELENBQWhDOztBQUVBLElBQUksQ0FBQ0MsZ0JBQUwsRUFBdUI7QUFDbkJBLEVBQUFBLGdCQUFnQixHQUFHRSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUN4QkMsSUFBQUEsSUFBSSxFQUFFLHFCQURrQjtBQUV4QixlQUFTRixFQUFFLENBQUNHO0FBRlksR0FBVCxDQUFuQjtBQUlIOztBQUVELElBQUksQ0FBQ0osa0JBQUwsRUFBeUI7QUFDckJBLEVBQUFBLGtCQUFrQixHQUFHQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUMxQkMsSUFBQUEsSUFBSSxFQUFFLHVCQURvQjtBQUUxQixlQUFTRixFQUFFLENBQUNHO0FBRmMsR0FBVCxDQUFyQjtBQUlIOztBQUVELElBQUlDLFVBQVUsR0FBRyxDQUNiUCxPQUFPLENBQUMsWUFBRCxDQURNLEVBRWJBLE9BQU8sQ0FBQyxZQUFELENBRk0sRUFHYkEsT0FBTyxDQUFDLFlBQUQsQ0FITSxFQUliQSxPQUFPLENBQUMsaUJBQUQsQ0FKTSxFQUtiQSxPQUFPLENBQUMsZUFBRCxDQUxNLEVBTWJBLE9BQU8sQ0FBQyxZQUFELENBTk0sRUFPYkEsT0FBTyxDQUFDLFdBQUQsQ0FQTSxFQVFiQSxPQUFPLENBQUMsaUJBQUQsQ0FSTSxFQVNiQSxPQUFPLENBQUMsVUFBRCxDQVRNLEVBVWJBLE9BQU8sQ0FBQyxlQUFELENBVk0sRUFXYkEsT0FBTyxDQUFDLGdCQUFELENBWE0sRUFZYkEsT0FBTyxDQUFDLHVCQUFELENBWk0sRUFhYkEsT0FBTyxDQUFDLGNBQUQsQ0FiTSxFQWNiQSxPQUFPLENBQUMsWUFBRCxDQWRNLEVBZWJBLE9BQU8sQ0FBQyxZQUFELENBZk0sRUFnQmJBLE9BQU8sQ0FBQyxxQkFBRCxDQWhCTSxFQWlCYkEsT0FBTyxDQUFDLGtCQUFELENBakJNLEVBa0JiQSxPQUFPLENBQUMsaUJBQUQsQ0FsQk0sRUFtQmJBLE9BQU8sQ0FBQyxjQUFELENBbkJNLEVBb0JiQSxPQUFPLENBQUMscUJBQUQsQ0FwQk0sRUFxQmJBLE9BQU8sQ0FBQyxpQkFBRCxDQXJCTSxFQXNCYkEsT0FBTyxDQUFDLFlBQUQsQ0F0Qk0sRUF1QmJBLE9BQU8sQ0FBQyxzQkFBRCxDQXZCTSxFQXdCYkEsT0FBTyxDQUFDLGtCQUFELENBeEJNLEVBeUJiQyxnQkF6QmEsRUEwQmJDLGtCQTFCYSxDQUFqQjtBQTZCQU0sTUFBTSxDQUFDQyxPQUFQLEdBQWlCRixVQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxucmVxdWlyZSgnLi9DQ0NvbXBvbmVudCcpO1xucmVxdWlyZSgnLi9DQ0NvbXBvbmVudEV2ZW50SGFuZGxlcicpO1xucmVxdWlyZSgnLi9taXNzaW5nLXNjcmlwdCcpO1xuXG4vLyBJbiBjYXNlIHN1YkNvbnRleHRWaWV3IG1vZHVsZXMgYXJlIGV4Y2x1ZGVkXG5sZXQgV1hTdWJDb250ZXh0VmlldyA9IHJlcXVpcmUoJy4vV1hTdWJDb250ZXh0VmlldycpO1xubGV0IFN3YW5TdWJDb250ZXh0VmlldyA9IHJlcXVpcmUoJy4vU3dhblN1YkNvbnRleHRWaWV3Jyk7XG5cbmlmICghV1hTdWJDb250ZXh0Vmlldykge1xuICAgIFdYU3ViQ29udGV4dFZpZXcgPSBjYy5DbGFzcyh7XG4gICAgICAgIG5hbWU6ICdjYy5XWFN1YkNvbnRleHRWaWV3JyxcbiAgICAgICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICAgIH0pO1xufVxuXG5pZiAoIVN3YW5TdWJDb250ZXh0Vmlldykge1xuICAgIFN3YW5TdWJDb250ZXh0VmlldyA9IGNjLkNsYXNzKHtcbiAgICAgICAgbmFtZTogJ2NjLlN3YW5TdWJDb250ZXh0VmlldycsXG4gICAgICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcbiAgICB9KTtcbn1cblxudmFyIGNvbXBvbmVudHMgPSBbXG4gICAgcmVxdWlyZSgnLi9DQ1Nwcml0ZScpLFxuICAgIHJlcXVpcmUoJy4vQ0NXaWRnZXQnKSxcbiAgICByZXF1aXJlKCcuL0NDQ2FudmFzJyksXG4gICAgcmVxdWlyZSgnLi9DQ0F1ZGlvU291cmNlJyksXG4gICAgcmVxdWlyZSgnLi9DQ0FuaW1hdGlvbicpLFxuICAgIHJlcXVpcmUoJy4vQ0NCdXR0b24nKSxcbiAgICByZXF1aXJlKCcuL0NDTGFiZWwnKSxcbiAgICByZXF1aXJlKCcuL0NDUHJvZ3Jlc3NCYXInKSxcbiAgICByZXF1aXJlKCcuL0NDTWFzaycpLFxuICAgIHJlcXVpcmUoJy4vQ0NTY3JvbGxCYXInKSxcbiAgICByZXF1aXJlKCcuL0NDU2Nyb2xsVmlldycpLFxuICAgIHJlcXVpcmUoJy4vQ0NQYWdlVmlld0luZGljYXRvcicpLFxuICAgIHJlcXVpcmUoJy4vQ0NQYWdlVmlldycpLFxuICAgIHJlcXVpcmUoJy4vQ0NTbGlkZXInKSxcbiAgICByZXF1aXJlKCcuL0NDTGF5b3V0JyksXG4gICAgcmVxdWlyZSgnLi9lZGl0Ym94L0NDRWRpdEJveCcpLFxuICAgIHJlcXVpcmUoJy4vQ0NMYWJlbE91dGxpbmUnKSxcbiAgICByZXF1aXJlKCcuL0NDTGFiZWxTaGFkb3cnKSxcbiAgICByZXF1aXJlKCcuL0NDUmljaFRleHQnKSxcbiAgICByZXF1aXJlKCcuL0NDVG9nZ2xlQ29udGFpbmVyJyksXG4gICAgcmVxdWlyZSgnLi9DQ1RvZ2dsZUdyb3VwJyksXG4gICAgcmVxdWlyZSgnLi9DQ1RvZ2dsZScpLFxuICAgIHJlcXVpcmUoJy4vQ0NCbG9ja0lucHV0RXZlbnRzJyksXG4gICAgcmVxdWlyZSgnLi9DQ01vdGlvblN0cmVhaycpLFxuICAgIFdYU3ViQ29udGV4dFZpZXcsXG4gICAgU3dhblN1YkNvbnRleHRWaWV3LFxuXTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb21wb25lbnRzOyJdfQ==