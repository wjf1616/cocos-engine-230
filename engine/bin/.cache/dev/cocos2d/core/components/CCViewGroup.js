
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCViewGroup.js';
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
 * !#en
 * Handling touch events in a ViewGroup takes special care,
 * because it's common for a ViewGroup to have children that are targets for different touch events than the ViewGroup itself.
 * To make sure that each view correctly receives the touch events intended for it,
 * ViewGroup should register capture phase event and handle the event propagation properly.
 * Please refer to Scrollview for more  information.
 *
 * !#zh
 * ViewGroup的事件处理比较特殊，因为 ViewGroup 里面的子节点关心的事件跟 ViewGroup 本身可能不一样。
 * 为了让子节点能够正确地处理事件，ViewGroup 需要注册 capture 阶段的事件，并且合理地处理 ViewGroup 之间的事件传递。
 * 请参考 ScrollView 的实现来获取更多信息。
 * @class ViewGroup
 * @extends Component
 */
var ViewGroup = cc.Class({
  name: 'cc.ViewGroup',
  "extends": require('./CCComponent')
});
cc.ViewGroup = module.exports = ViewGroup;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDVmlld0dyb3VwLmpzIl0sIm5hbWVzIjpbIlZpZXdHcm91cCIsImNjIiwiQ2xhc3MiLCJuYW1lIiwicmVxdWlyZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkE7Ozs7Ozs7Ozs7Ozs7OztBQWVBLElBQUlBLFNBQVMsR0FBR0MsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDckJDLEVBQUFBLElBQUksRUFBRSxjQURlO0FBRXJCLGFBQVNDLE9BQU8sQ0FBQyxlQUFEO0FBRkssQ0FBVCxDQUFoQjtBQU9BSCxFQUFFLENBQUNELFNBQUgsR0FBZUssTUFBTSxDQUFDQyxPQUFQLEdBQWlCTixTQUFoQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLyoqXG4gKiAhI2VuXG4gKiBIYW5kbGluZyB0b3VjaCBldmVudHMgaW4gYSBWaWV3R3JvdXAgdGFrZXMgc3BlY2lhbCBjYXJlLFxuICogYmVjYXVzZSBpdCdzIGNvbW1vbiBmb3IgYSBWaWV3R3JvdXAgdG8gaGF2ZSBjaGlsZHJlbiB0aGF0IGFyZSB0YXJnZXRzIGZvciBkaWZmZXJlbnQgdG91Y2ggZXZlbnRzIHRoYW4gdGhlIFZpZXdHcm91cCBpdHNlbGYuXG4gKiBUbyBtYWtlIHN1cmUgdGhhdCBlYWNoIHZpZXcgY29ycmVjdGx5IHJlY2VpdmVzIHRoZSB0b3VjaCBldmVudHMgaW50ZW5kZWQgZm9yIGl0LFxuICogVmlld0dyb3VwIHNob3VsZCByZWdpc3RlciBjYXB0dXJlIHBoYXNlIGV2ZW50IGFuZCBoYW5kbGUgdGhlIGV2ZW50IHByb3BhZ2F0aW9uIHByb3Blcmx5LlxuICogUGxlYXNlIHJlZmVyIHRvIFNjcm9sbHZpZXcgZm9yIG1vcmUgIGluZm9ybWF0aW9uLlxuICpcbiAqICEjemhcbiAqIFZpZXdHcm91cOeahOS6i+S7tuWkhOeQhuavlOi+g+eJueauiu+8jOWboOS4uiBWaWV3R3JvdXAg6YeM6Z2i55qE5a2Q6IqC54K55YWz5b+D55qE5LqL5Lu26LefIFZpZXdHcm91cCDmnKzouqvlj6/og73kuI3kuIDmoLfjgIJcbiAqIOS4uuS6huiuqeWtkOiKgueCueiDveWkn+ato+ehruWcsOWkhOeQhuS6i+S7tu+8jFZpZXdHcm91cCDpnIDopoHms6jlhowgY2FwdHVyZSDpmLbmrrXnmoTkuovku7bvvIzlubbkuJTlkIjnkIblnLDlpITnkIYgVmlld0dyb3VwIOS5i+mXtOeahOS6i+S7tuS8oOmAkuOAglxuICog6K+35Y+C6ICDIFNjcm9sbFZpZXcg55qE5a6e546w5p2l6I635Y+W5pu05aSa5L+h5oGv44CCXG4gKiBAY2xhc3MgVmlld0dyb3VwXG4gKiBAZXh0ZW5kcyBDb21wb25lbnRcbiAqL1xudmFyIFZpZXdHcm91cCA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuVmlld0dyb3VwJyxcbiAgICBleHRlbmRzOiByZXF1aXJlKCcuL0NDQ29tcG9uZW50JylcblxufSk7XG5cblxuY2MuVmlld0dyb3VwID0gbW9kdWxlLmV4cG9ydHMgPSBWaWV3R3JvdXA7XG4iXX0=