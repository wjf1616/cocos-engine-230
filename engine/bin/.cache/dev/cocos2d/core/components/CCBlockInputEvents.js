
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCBlockInputEvents.js';
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
var BlockEvents = ['touchstart', 'touchmove', 'touchend', 'mousedown', 'mousemove', 'mouseup', 'mouseenter', 'mouseleave', 'mousewheel'];

function stopPropagation(event) {
  event.stopPropagation();
}
/**
 * !#en
 * This component will block all input events (mouse and touch) within the bounding box of the node, preventing the input from penetrating into the underlying node, typically for the background of the top UI.<br>
 * This component does not have any API interface and can be added directly to the scene to take effect.
 * !#zh
 * 该组件将拦截所属节点 bounding box 内的所有输入事件（鼠标和触摸），防止输入穿透到下层节点，一般用于上层 UI 的背景。<br>
 * 该组件没有任何 API 接口，直接添加到场景即可生效。
 *
 * @class BlockInputEvents
 * @extends Component
 */


var BlockInputEvents = cc.Class({
  name: 'cc.BlockInputEvents',
  "extends": require('./CCComponent'),
  editor: {
    menu: 'i18n:MAIN_MENU.component.ui/Block Input Events',
    inspector: 'packages://inspector/inspectors/comps/block-input-events.js',
    help: 'i18n:COMPONENT.help_url.block_input_events'
  },
  onEnable: function onEnable() {
    for (var i = 0; i < BlockEvents.length; i++) {
      // supply the 'this' parameter so that the callback could be added and removed correctly,
      // even if the same component is added more than once to a Node.
      this.node.on(BlockEvents[i], stopPropagation, this);
    }
  },
  onDisable: function onDisable() {
    for (var i = 0; i < BlockEvents.length; i++) {
      this.node.off(BlockEvents[i], stopPropagation, this);
    }
  }
});
cc.BlockInputEvents = module.exports = BlockInputEvents;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDQmxvY2tJbnB1dEV2ZW50cy5qcyJdLCJuYW1lcyI6WyJCbG9ja0V2ZW50cyIsInN0b3BQcm9wYWdhdGlvbiIsImV2ZW50IiwiQmxvY2tJbnB1dEV2ZW50cyIsImNjIiwiQ2xhc3MiLCJuYW1lIiwicmVxdWlyZSIsImVkaXRvciIsIm1lbnUiLCJpbnNwZWN0b3IiLCJoZWxwIiwib25FbmFibGUiLCJpIiwibGVuZ3RoIiwibm9kZSIsIm9uIiwib25EaXNhYmxlIiwib2ZmIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLElBQU1BLFdBQVcsR0FBRyxDQUFDLFlBQUQsRUFBZSxXQUFmLEVBQTRCLFVBQTVCLEVBQ0MsV0FERCxFQUNjLFdBRGQsRUFDMkIsU0FEM0IsRUFFQyxZQUZELEVBRWUsWUFGZixFQUU2QixZQUY3QixDQUFwQjs7QUFJQSxTQUFTQyxlQUFULENBQTBCQyxLQUExQixFQUFpQztBQUM3QkEsRUFBQUEsS0FBSyxDQUFDRCxlQUFOO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7OztBQVdBLElBQU1FLGdCQUFnQixHQUFHQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUM5QkMsRUFBQUEsSUFBSSxFQUFFLHFCQUR3QjtBQUU5QixhQUFTQyxPQUFPLENBQUMsZUFBRCxDQUZjO0FBRzlCQyxFQUFBQSxNQUFNLEVBQUU7QUFDSkMsSUFBQUEsSUFBSSxFQUFFLGdEQURGO0FBRUpDLElBQUFBLFNBQVMsRUFBRSw2REFGUDtBQUdKQyxJQUFBQSxJQUFJLEVBQUU7QUFIRixHQUhzQjtBQVM5QkMsRUFBQUEsUUFUOEIsc0JBU2xCO0FBQ1IsU0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHYixXQUFXLENBQUNjLE1BQWhDLEVBQXdDRCxDQUFDLEVBQXpDLEVBQTZDO0FBQ3pDO0FBQ0E7QUFDQSxXQUFLRSxJQUFMLENBQVVDLEVBQVYsQ0FBYWhCLFdBQVcsQ0FBQ2EsQ0FBRCxDQUF4QixFQUE2QlosZUFBN0IsRUFBOEMsSUFBOUM7QUFDSDtBQUNKLEdBZjZCO0FBZ0I5QmdCLEVBQUFBLFNBaEI4Qix1QkFnQmpCO0FBQ1QsU0FBSyxJQUFJSixDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHYixXQUFXLENBQUNjLE1BQWhDLEVBQXdDRCxDQUFDLEVBQXpDLEVBQTZDO0FBQ3pDLFdBQUtFLElBQUwsQ0FBVUcsR0FBVixDQUFjbEIsV0FBVyxDQUFDYSxDQUFELENBQXpCLEVBQThCWixlQUE5QixFQUErQyxJQUEvQztBQUNIO0FBQ0o7QUFwQjZCLENBQVQsQ0FBekI7QUF1QkFHLEVBQUUsQ0FBQ0QsZ0JBQUgsR0FBc0JnQixNQUFNLENBQUNDLE9BQVAsR0FBaUJqQixnQkFBdkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNvbnN0IEJsb2NrRXZlbnRzID0gWyd0b3VjaHN0YXJ0JywgJ3RvdWNobW92ZScsICd0b3VjaGVuZCcsXG4gICAgICAgICAgICAgICAgICAgICAnbW91c2Vkb3duJywgJ21vdXNlbW92ZScsICdtb3VzZXVwJyxcbiAgICAgICAgICAgICAgICAgICAgICdtb3VzZWVudGVyJywgJ21vdXNlbGVhdmUnLCAnbW91c2V3aGVlbCddO1xuXG5mdW5jdGlvbiBzdG9wUHJvcGFnYXRpb24gKGV2ZW50KSB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG59XG5cbi8qKlxuICogISNlblxuICogVGhpcyBjb21wb25lbnQgd2lsbCBibG9jayBhbGwgaW5wdXQgZXZlbnRzIChtb3VzZSBhbmQgdG91Y2gpIHdpdGhpbiB0aGUgYm91bmRpbmcgYm94IG9mIHRoZSBub2RlLCBwcmV2ZW50aW5nIHRoZSBpbnB1dCBmcm9tIHBlbmV0cmF0aW5nIGludG8gdGhlIHVuZGVybHlpbmcgbm9kZSwgdHlwaWNhbGx5IGZvciB0aGUgYmFja2dyb3VuZCBvZiB0aGUgdG9wIFVJLjxicj5cbiAqIFRoaXMgY29tcG9uZW50IGRvZXMgbm90IGhhdmUgYW55IEFQSSBpbnRlcmZhY2UgYW5kIGNhbiBiZSBhZGRlZCBkaXJlY3RseSB0byB0aGUgc2NlbmUgdG8gdGFrZSBlZmZlY3QuXG4gKiAhI3poXG4gKiDor6Xnu4Tku7blsIbmi6bmiKrmiYDlsZ7oioLngrkgYm91bmRpbmcgYm94IOWGheeahOaJgOaciei+k+WFpeS6i+S7tu+8iOm8oOagh+WSjOinpuaRuO+8ie+8jOmYsuatoui+k+WFpeepv+mAj+WIsOS4i+WxguiKgueCue+8jOS4gOiIrOeUqOS6juS4iuWxgiBVSSDnmoTog4zmma/jgII8YnI+XG4gKiDor6Xnu4Tku7bmsqHmnInku7vkvZUgQVBJIOaOpeWPo++8jOebtOaOpea3u+WKoOWIsOWcuuaZr+WNs+WPr+eUn+aViOOAglxuICpcbiAqIEBjbGFzcyBCbG9ja0lucHV0RXZlbnRzXG4gKiBAZXh0ZW5kcyBDb21wb25lbnRcbiAqL1xuY29uc3QgQmxvY2tJbnB1dEV2ZW50cyA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuQmxvY2tJbnB1dEV2ZW50cycsXG4gICAgZXh0ZW5kczogcmVxdWlyZSgnLi9DQ0NvbXBvbmVudCcpLFxuICAgIGVkaXRvcjoge1xuICAgICAgICBtZW51OiAnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50LnVpL0Jsb2NrIElucHV0IEV2ZW50cycsXG4gICAgICAgIGluc3BlY3RvcjogJ3BhY2thZ2VzOi8vaW5zcGVjdG9yL2luc3BlY3RvcnMvY29tcHMvYmxvY2staW5wdXQtZXZlbnRzLmpzJyxcbiAgICAgICAgaGVscDogJ2kxOG46Q09NUE9ORU5ULmhlbHBfdXJsLmJsb2NrX2lucHV0X2V2ZW50cycsXG4gICAgfSxcblxuICAgIG9uRW5hYmxlICgpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBCbG9ja0V2ZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgLy8gc3VwcGx5IHRoZSAndGhpcycgcGFyYW1ldGVyIHNvIHRoYXQgdGhlIGNhbGxiYWNrIGNvdWxkIGJlIGFkZGVkIGFuZCByZW1vdmVkIGNvcnJlY3RseSxcbiAgICAgICAgICAgIC8vIGV2ZW4gaWYgdGhlIHNhbWUgY29tcG9uZW50IGlzIGFkZGVkIG1vcmUgdGhhbiBvbmNlIHRvIGEgTm9kZS5cbiAgICAgICAgICAgIHRoaXMubm9kZS5vbihCbG9ja0V2ZW50c1tpXSwgc3RvcFByb3BhZ2F0aW9uLCB0aGlzKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25EaXNhYmxlICgpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBCbG9ja0V2ZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5ub2RlLm9mZihCbG9ja0V2ZW50c1tpXSwgc3RvcFByb3BhZ2F0aW9uLCB0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5CbG9ja0lucHV0RXZlbnRzID0gbW9kdWxlLmV4cG9ydHMgPSBCbG9ja0lucHV0RXZlbnRzO1xuIl19