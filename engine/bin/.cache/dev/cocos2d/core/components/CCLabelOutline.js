
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCLabelOutline.js';
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
 * !#en Outline effect used to change the display, only for system fonts or TTF fonts
 * !#zh 描边效果组件,用于字体描边,只能用于系统字体
 * @class LabelOutline
 * @extends Component
 * @example
 *  // Create a new node and add label components.
 *  var node = new cc.Node("New Label");
 *  var label = node.addComponent(cc.Label);
 *  label.string = "hello world";
 *  var outline = node.addComponent(cc.LabelOutline);
 *  node.parent = this.node;
 */
var LabelOutline = cc.Class({
  name: 'cc.LabelOutline',
  "extends": require('./CCComponent'),
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.renderers/LabelOutline',
    executeInEditMode: true,
    requireComponent: cc.Label
  },
  properties: {
    _color: cc.Color.WHITE,
    _width: 1,

    /**
     * !#en outline color
     * !#zh 改变描边的颜色
     * @property color
     * @type {Color}
     * @example
     * outline.color = cc.Color.BLACK;
     */
    color: {
      tooltip: CC_DEV && 'i18n:COMPONENT.outline.color',
      get: function get() {
        return this._color;
      },
      set: function set(value) {
        this._color = value;

        this._updateRenderData();
      }
    },

    /**
     * !#en Change the outline width
     * !#zh 改变描边的宽度
     * @property width
     * @type {Number}
     * @example
     * outline.width = 3;
     */
    width: {
      tooltip: CC_DEV && 'i18n:COMPONENT.outline.width',
      get: function get() {
        return this._width;
      },
      set: function set(value) {
        if (this._width === value) return;
        this._width = value;

        this._updateRenderData();
      },
      range: [0, 512]
    }
  },
  onEnable: function onEnable() {
    this._updateRenderData();
  },
  onDisable: function onDisable() {
    this._updateRenderData();
  },
  _updateRenderData: function _updateRenderData() {
    var label = this.node.getComponent(cc.Label);

    if (label) {
      label.setVertsDirty();
    }
  }
});
cc.LabelOutline = module.exports = LabelOutline;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDTGFiZWxPdXRsaW5lLmpzIl0sIm5hbWVzIjpbIkxhYmVsT3V0bGluZSIsImNjIiwiQ2xhc3MiLCJuYW1lIiwicmVxdWlyZSIsImVkaXRvciIsIkNDX0VESVRPUiIsIm1lbnUiLCJleGVjdXRlSW5FZGl0TW9kZSIsInJlcXVpcmVDb21wb25lbnQiLCJMYWJlbCIsInByb3BlcnRpZXMiLCJfY29sb3IiLCJDb2xvciIsIldISVRFIiwiX3dpZHRoIiwiY29sb3IiLCJ0b29sdGlwIiwiQ0NfREVWIiwiZ2V0Iiwic2V0IiwidmFsdWUiLCJfdXBkYXRlUmVuZGVyRGF0YSIsIndpZHRoIiwicmFuZ2UiLCJvbkVuYWJsZSIsIm9uRGlzYWJsZSIsImxhYmVsIiwibm9kZSIsImdldENvbXBvbmVudCIsInNldFZlcnRzRGlydHkiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBOzs7Ozs7Ozs7Ozs7O0FBY0EsSUFBSUEsWUFBWSxHQUFHQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUN4QkMsRUFBQUEsSUFBSSxFQUFFLGlCQURrQjtBQUV4QixhQUFTQyxPQUFPLENBQUMsZUFBRCxDQUZRO0FBR3hCQyxFQUFBQSxNQUFNLEVBQUVDLFNBQVMsSUFBSTtBQUNqQkMsSUFBQUEsSUFBSSxFQUFFLGlEQURXO0FBRWpCQyxJQUFBQSxpQkFBaUIsRUFBRSxJQUZGO0FBR2pCQyxJQUFBQSxnQkFBZ0IsRUFBRVIsRUFBRSxDQUFDUztBQUhKLEdBSEc7QUFTeEJDLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxNQUFNLEVBQUVYLEVBQUUsQ0FBQ1ksS0FBSCxDQUFTQyxLQURUO0FBRVJDLElBQUFBLE1BQU0sRUFBRSxDQUZBOztBQUlSOzs7Ozs7OztBQVFBQyxJQUFBQSxLQUFLLEVBQUU7QUFDSEMsTUFBQUEsT0FBTyxFQUFFQyxNQUFNLElBQUksOEJBRGhCO0FBRUhDLE1BQUFBLEdBQUcsRUFBRSxlQUFZO0FBQ2IsZUFBTyxLQUFLUCxNQUFaO0FBQ0gsT0FKRTtBQUtIUSxNQUFBQSxHQUFHLEVBQUUsYUFBVUMsS0FBVixFQUFpQjtBQUNsQixhQUFLVCxNQUFMLEdBQWNTLEtBQWQ7O0FBQ0EsYUFBS0MsaUJBQUw7QUFDSDtBQVJFLEtBWkM7O0FBdUJSOzs7Ozs7OztBQVFBQyxJQUFBQSxLQUFLLEVBQUU7QUFDSE4sTUFBQUEsT0FBTyxFQUFFQyxNQUFNLElBQUksOEJBRGhCO0FBRUhDLE1BQUFBLEdBQUcsRUFBRSxlQUFZO0FBQ2IsZUFBTyxLQUFLSixNQUFaO0FBQ0gsT0FKRTtBQUtISyxNQUFBQSxHQUFHLEVBQUUsYUFBVUMsS0FBVixFQUFpQjtBQUNsQixZQUFJLEtBQUtOLE1BQUwsS0FBZ0JNLEtBQXBCLEVBQTJCO0FBRTNCLGFBQUtOLE1BQUwsR0FBY00sS0FBZDs7QUFDQSxhQUFLQyxpQkFBTDtBQUNILE9BVkU7QUFXSEUsTUFBQUEsS0FBSyxFQUFFLENBQUMsQ0FBRCxFQUFJLEdBQUo7QUFYSjtBQS9CQyxHQVRZO0FBdUR4QkMsRUFBQUEsUUF2RHdCLHNCQXVEWjtBQUNSLFNBQUtILGlCQUFMO0FBQ0gsR0F6RHVCO0FBMkR4QkksRUFBQUEsU0EzRHdCLHVCQTJEWDtBQUNULFNBQUtKLGlCQUFMO0FBQ0gsR0E3RHVCO0FBK0R4QkEsRUFBQUEsaUJBL0R3QiwrQkErREg7QUFDakIsUUFBSUssS0FBSyxHQUFHLEtBQUtDLElBQUwsQ0FBVUMsWUFBVixDQUF1QjVCLEVBQUUsQ0FBQ1MsS0FBMUIsQ0FBWjs7QUFDQSxRQUFJaUIsS0FBSixFQUFXO0FBQ1BBLE1BQUFBLEtBQUssQ0FBQ0csYUFBTjtBQUNIO0FBQ0o7QUFwRXVCLENBQVQsQ0FBbkI7QUF3RUE3QixFQUFFLENBQUNELFlBQUgsR0FBa0IrQixNQUFNLENBQUNDLE9BQVAsR0FBaUJoQyxZQUFuQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vKipcbiAqICEjZW4gT3V0bGluZSBlZmZlY3QgdXNlZCB0byBjaGFuZ2UgdGhlIGRpc3BsYXksIG9ubHkgZm9yIHN5c3RlbSBmb250cyBvciBUVEYgZm9udHNcbiAqICEjemgg5o+P6L655pWI5p6c57uE5Lu2LOeUqOS6juWtl+S9k+aPj+i+uSzlj6rog73nlKjkuo7ns7vnu5/lrZfkvZNcbiAqIEBjbGFzcyBMYWJlbE91dGxpbmVcbiAqIEBleHRlbmRzIENvbXBvbmVudFxuICogQGV4YW1wbGVcbiAqICAvLyBDcmVhdGUgYSBuZXcgbm9kZSBhbmQgYWRkIGxhYmVsIGNvbXBvbmVudHMuXG4gKiAgdmFyIG5vZGUgPSBuZXcgY2MuTm9kZShcIk5ldyBMYWJlbFwiKTtcbiAqICB2YXIgbGFiZWwgPSBub2RlLmFkZENvbXBvbmVudChjYy5MYWJlbCk7XG4gKiAgbGFiZWwuc3RyaW5nID0gXCJoZWxsbyB3b3JsZFwiO1xuICogIHZhciBvdXRsaW5lID0gbm9kZS5hZGRDb21wb25lbnQoY2MuTGFiZWxPdXRsaW5lKTtcbiAqICBub2RlLnBhcmVudCA9IHRoaXMubm9kZTtcbiAqL1xuXG5sZXQgTGFiZWxPdXRsaW5lID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5MYWJlbE91dGxpbmUnLFxuICAgIGV4dGVuZHM6IHJlcXVpcmUoJy4vQ0NDb21wb25lbnQnKSxcbiAgICBlZGl0b3I6IENDX0VESVRPUiAmJiB7XG4gICAgICAgIG1lbnU6ICdpMThuOk1BSU5fTUVOVS5jb21wb25lbnQucmVuZGVyZXJzL0xhYmVsT3V0bGluZScsXG4gICAgICAgIGV4ZWN1dGVJbkVkaXRNb2RlOiB0cnVlLFxuICAgICAgICByZXF1aXJlQ29tcG9uZW50OiBjYy5MYWJlbCxcbiAgICB9LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBfY29sb3I6IGNjLkNvbG9yLldISVRFLFxuICAgICAgICBfd2lkdGg6IDEsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gb3V0bGluZSBjb2xvclxuICAgICAgICAgKiAhI3poIOaUueWPmOaPj+i+ueeahOminOiJslxuICAgICAgICAgKiBAcHJvcGVydHkgY29sb3JcbiAgICAgICAgICogQHR5cGUge0NvbG9yfVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBvdXRsaW5lLmNvbG9yID0gY2MuQ29sb3IuQkxBQ0s7XG4gICAgICAgICAqL1xuICAgICAgICBjb2xvcjoge1xuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5vdXRsaW5lLmNvbG9yJyxcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb2xvcjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbG9yID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlUmVuZGVyRGF0YSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIENoYW5nZSB0aGUgb3V0bGluZSB3aWR0aFxuICAgICAgICAgKiAhI3poIOaUueWPmOaPj+i+ueeahOWuveW6plxuICAgICAgICAgKiBAcHJvcGVydHkgd2lkdGhcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogb3V0bGluZS53aWR0aCA9IDM7XG4gICAgICAgICAqL1xuICAgICAgICB3aWR0aDoge1xuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5vdXRsaW5lLndpZHRoJyxcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl93aWR0aCA9PT0gdmFsdWUpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIHRoaXMuX3dpZHRoID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlUmVuZGVyRGF0YSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJhbmdlOiBbMCwgNTEyXSxcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkVuYWJsZSAoKSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVJlbmRlckRhdGEoKTtcbiAgICB9LFxuXG4gICAgb25EaXNhYmxlICgpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlUmVuZGVyRGF0YSgpO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlUmVuZGVyRGF0YSAoKSB7XG4gICAgICAgIGxldCBsYWJlbCA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoY2MuTGFiZWwpO1xuICAgICAgICBpZiAobGFiZWwpIHtcbiAgICAgICAgICAgIGxhYmVsLnNldFZlcnRzRGlydHkoKTtcbiAgICAgICAgfVxuICAgIH1cblxufSk7XG5cbmNjLkxhYmVsT3V0bGluZSA9IG1vZHVsZS5leHBvcnRzID0gTGFiZWxPdXRsaW5lO1xuIl19