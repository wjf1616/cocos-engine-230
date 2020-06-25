
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCToggleContainer.js';
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
 * !#en ToggleContainer is not a visiable UI component but a way to modify the behavior of a set of Toggles. <br/>
 * Toggles that belong to the same group could only have one of them to be switched on at a time.<br/>
 * Note: All the first layer child node containing the toggle component will auto be added to the container
 * !#zh ToggleContainer 不是一个可见的 UI 组件，它可以用来修改一组 Toggle 组件的行为。<br/>
 * 当一组 Toggle 属于同一个 ToggleContainer 的时候，任何时候只能有一个 Toggle 处于选中状态。<br/>
 * 注意：所有包含 Toggle 组件的一级子节点都会自动被添加到该容器中
 * @class ToggleContainer
 * @extends Component
 */
var ToggleContainer = cc.Class({
  name: 'cc.ToggleContainer',
  "extends": cc.Component,
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.ui/ToggleContainer',
    help: 'i18n:COMPONENT.help_url.toggleContainer',
    executeInEditMode: true
  },
  properties: {
    /**
     * !#en If this setting is true, a toggle could be switched off and on when pressed.
     * If it is false, it will make sure there is always only one toggle could be switched on
     * and the already switched on toggle can't be switched off.
     * !#zh 如果这个设置为 true， 那么 toggle 按钮在被点击的时候可以反复地被选中和未选中。
     * @property {Boolean} allowSwitchOff
     */
    allowSwitchOff: {
      tooltip: CC_DEV && 'i18n:COMPONENT.toggle_group.allowSwitchOff',
      "default": false
    },

    /**
     * !#en If Toggle is clicked, it will trigger event's handler
     * !#zh Toggle 按钮的点击事件列表。
     * @property {Component.EventHandler[]} checkEvents
     */
    checkEvents: {
      "default": [],
      type: cc.Component.EventHandler
    }
  },
  updateToggles: function updateToggles(toggle) {
    if (!this.enabledInHierarchy) return;

    if (toggle.isChecked) {
      this.toggleItems.forEach(function (item) {
        if (item !== toggle && item.isChecked && item.enabled) {
          item._hideCheckMark();
        }
      });

      if (this.checkEvents) {
        cc.Component.EventHandler.emitEvents(this.checkEvents, toggle);
      }
    }
  },
  _allowOnlyOneToggleChecked: function _allowOnlyOneToggleChecked() {
    var isChecked = false;
    this.toggleItems.forEach(function (item) {
      if (isChecked) {
        item._hideCheckMark();
      } else if (item.isChecked) {
        isChecked = true;
      }
    });
    return isChecked;
  },
  _makeAtLeastOneToggleChecked: function _makeAtLeastOneToggleChecked() {
    var isChecked = this._allowOnlyOneToggleChecked();

    if (!isChecked && !this.allowSwitchOff) {
      var toggleItems = this.toggleItems;

      if (toggleItems.length > 0) {
        toggleItems[0].check();
      }
    }
  },
  onEnable: function onEnable() {
    this.node.on('child-added', this._allowOnlyOneToggleChecked, this);
    this.node.on('child-removed', this._makeAtLeastOneToggleChecked, this);
  },
  onDisable: function onDisable() {
    this.node.off('child-added', this._allowOnlyOneToggleChecked, this);
    this.node.off('child-removed', this._makeAtLeastOneToggleChecked, this);
  },
  start: function start() {
    this._makeAtLeastOneToggleChecked();
  }
});
/**
 * !#en Read only property, return the toggle items array reference managed by ToggleContainer.
 * !#zh 只读属性，返回 ToggleContainer 管理的 toggle 数组引用
 * @property {Toggle[]} toggleItems
 */

var js = require('../platform/js');

js.get(ToggleContainer.prototype, 'toggleItems', function () {
  return this.node.getComponentsInChildren(cc.Toggle);
});
cc.ToggleContainer = module.exports = ToggleContainer;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDVG9nZ2xlQ29udGFpbmVyLmpzIl0sIm5hbWVzIjpbIlRvZ2dsZUNvbnRhaW5lciIsImNjIiwiQ2xhc3MiLCJuYW1lIiwiQ29tcG9uZW50IiwiZWRpdG9yIiwiQ0NfRURJVE9SIiwibWVudSIsImhlbHAiLCJleGVjdXRlSW5FZGl0TW9kZSIsInByb3BlcnRpZXMiLCJhbGxvd1N3aXRjaE9mZiIsInRvb2x0aXAiLCJDQ19ERVYiLCJjaGVja0V2ZW50cyIsInR5cGUiLCJFdmVudEhhbmRsZXIiLCJ1cGRhdGVUb2dnbGVzIiwidG9nZ2xlIiwiZW5hYmxlZEluSGllcmFyY2h5IiwiaXNDaGVja2VkIiwidG9nZ2xlSXRlbXMiLCJmb3JFYWNoIiwiaXRlbSIsImVuYWJsZWQiLCJfaGlkZUNoZWNrTWFyayIsImVtaXRFdmVudHMiLCJfYWxsb3dPbmx5T25lVG9nZ2xlQ2hlY2tlZCIsIl9tYWtlQXRMZWFzdE9uZVRvZ2dsZUNoZWNrZWQiLCJsZW5ndGgiLCJjaGVjayIsIm9uRW5hYmxlIiwibm9kZSIsIm9uIiwib25EaXNhYmxlIiwib2ZmIiwic3RhcnQiLCJqcyIsInJlcXVpcmUiLCJnZXQiLCJwcm90b3R5cGUiLCJnZXRDb21wb25lbnRzSW5DaGlsZHJlbiIsIlRvZ2dsZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkE7Ozs7Ozs7Ozs7QUFVQSxJQUFJQSxlQUFlLEdBQUdDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQzNCQyxFQUFBQSxJQUFJLEVBQUUsb0JBRHFCO0FBRTNCLGFBQVNGLEVBQUUsQ0FBQ0csU0FGZTtBQUczQkMsRUFBQUEsTUFBTSxFQUFFQyxTQUFTLElBQUk7QUFDakJDLElBQUFBLElBQUksRUFBRSw2Q0FEVztBQUVqQkMsSUFBQUEsSUFBSSxFQUFFLHlDQUZXO0FBR2pCQyxJQUFBQSxpQkFBaUIsRUFBRTtBQUhGLEdBSE07QUFTM0JDLEVBQUFB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Q0gsQ0FITDtBQU1BekMsRUFBRSxDQUFDRCxlQUFILEdBQXFCMkMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCNUMsZUFBdEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qKlxuICogISNlbiBUb2dnbGVDb250YWluZXIgaXMgbm90IGEgdmlzaWFibGUgVUkgY29tcG9uZW50IGJ1dCBhIHdheSB0byBtb2RpZnkgdGhlIGJlaGF2aW9yIG9mIGEgc2V0IG9mIFRvZ2dsZXMuIDxici8+XG4gKiBUb2dnbGVzIHRoYXQgYmVsb25nIHRvIHRoZSBzYW1lIGdyb3VwIGNvdWxkIG9ubHkgaGF2ZSBvbmUgb2YgdGhlbSB0byBiZSBzd2l0Y2hlZCBvbiBhdCBhIHRpbWUuPGJyLz5cbiAqIE5vdGU6IEFsbCB0aGUgZmlyc3QgbGF5ZXIgY2hpbGQgbm9kZSBjb250YWluaW5nIHRoZSB0b2dnbGUgY29tcG9uZW50IHdpbGwgYXV0byBiZSBhZGRlZCB0byB0aGUgY29udGFpbmVyXG4gKiAhI3poIFRvZ2dsZUNvbnRhaW5lciDkuI3mmK/kuIDkuKrlj6/op4HnmoQgVUkg57uE5Lu277yM5a6D5Y+v5Lul55So5p2l5L+u5pS55LiA57uEIFRvZ2dsZSDnu4Tku7bnmoTooYzkuLrjgII8YnIvPlxuICog5b2T5LiA57uEIFRvZ2dsZSDlsZ7kuo7lkIzkuIDkuKogVG9nZ2xlQ29udGFpbmVyIOeahOaXtuWAme+8jOS7u+S9leaXtuWAmeWPquiDveacieS4gOS4qiBUb2dnbGUg5aSE5LqO6YCJ5Lit54q25oCB44CCPGJyLz5cbiAqIOazqOaEj++8muaJgOacieWMheWQqyBUb2dnbGUg57uE5Lu255qE5LiA57qn5a2Q6IqC54K56YO95Lya6Ieq5Yqo6KKr5re75Yqg5Yiw6K+l5a655Zmo5LitXG4gKiBAY2xhc3MgVG9nZ2xlQ29udGFpbmVyXG4gKiBAZXh0ZW5kcyBDb21wb25lbnRcbiAqL1xudmFyIFRvZ2dsZUNvbnRhaW5lciA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuVG9nZ2xlQ29udGFpbmVyJyxcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gICAgZWRpdG9yOiBDQ19FRElUT1IgJiYge1xuICAgICAgICBtZW51OiAnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50LnVpL1RvZ2dsZUNvbnRhaW5lcicsXG4gICAgICAgIGhlbHA6ICdpMThuOkNPTVBPTkVOVC5oZWxwX3VybC50b2dnbGVDb250YWluZXInLFxuICAgICAgICBleGVjdXRlSW5FZGl0TW9kZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIElmIHRoaXMgc2V0dGluZyBpcyB0cnVlLCBhIHRvZ2dsZSBjb3VsZCBiZSBzd2l0Y2hlZCBvZmYgYW5kIG9uIHdoZW4gcHJlc3NlZC5cbiAgICAgICAgICogSWYgaXQgaXMgZmFsc2UsIGl0IHdpbGwgbWFrZSBzdXJlIHRoZXJlIGlzIGFsd2F5cyBvbmx5IG9uZSB0b2dnbGUgY291bGQgYmUgc3dpdGNoZWQgb25cbiAgICAgICAgICogYW5kIHRoZSBhbHJlYWR5IHN3aXRjaGVkIG9uIHRvZ2dsZSBjYW4ndCBiZSBzd2l0Y2hlZCBvZmYuXG4gICAgICAgICAqICEjemgg5aaC5p6c6L+Z5Liq6K6+572u5Li6IHRydWXvvIwg6YKj5LmIIHRvZ2dsZSDmjInpkq7lnKjooqvngrnlh7vnmoTml7blgJnlj6/ku6Xlj43lpI3lnLDooqvpgInkuK3lkozmnKrpgInkuK3jgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBhbGxvd1N3aXRjaE9mZlxuICAgICAgICAgKi9cbiAgICAgICAgYWxsb3dTd2l0Y2hPZmY6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQudG9nZ2xlX2dyb3VwLmFsbG93U3dpdGNoT2ZmJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gSWYgVG9nZ2xlIGlzIGNsaWNrZWQsIGl0IHdpbGwgdHJpZ2dlciBldmVudCdzIGhhbmRsZXJcbiAgICAgICAgICogISN6aCBUb2dnbGUg5oyJ6ZKu55qE54K55Ye75LqL5Lu25YiX6KGo44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Q29tcG9uZW50LkV2ZW50SGFuZGxlcltdfSBjaGVja0V2ZW50c1xuICAgICAgICAgKi9cbiAgICAgICAgY2hlY2tFdmVudHM6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdLFxuICAgICAgICAgICAgdHlwZTogY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlclxuICAgICAgICB9LFxuICAgIH0sXG5cbiAgICB1cGRhdGVUb2dnbGVzOiBmdW5jdGlvbiAodG9nZ2xlKSB7XG4gICAgICAgIGlmKCF0aGlzLmVuYWJsZWRJbkhpZXJhcmNoeSkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0b2dnbGUuaXNDaGVja2VkKSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZUl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSAhPT0gdG9nZ2xlICYmIGl0ZW0uaXNDaGVja2VkICYmIGl0ZW0uZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtLl9oaWRlQ2hlY2tNYXJrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrRXZlbnRzKSB7XG4gICAgICAgICAgICAgICAgY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlci5lbWl0RXZlbnRzKHRoaXMuY2hlY2tFdmVudHMsIHRvZ2dsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2FsbG93T25seU9uZVRvZ2dsZUNoZWNrZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGlzQ2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnRvZ2dsZUl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIGlmIChpc0NoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICBpdGVtLl9oaWRlQ2hlY2tNYXJrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpdGVtLmlzQ2hlY2tlZCkge1xuICAgICAgICAgICAgICAgIGlzQ2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBpc0NoZWNrZWQ7XG4gICAgfSxcblxuICAgIF9tYWtlQXRMZWFzdE9uZVRvZ2dsZUNoZWNrZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGlzQ2hlY2tlZCA9IHRoaXMuX2FsbG93T25seU9uZVRvZ2dsZUNoZWNrZWQoKTtcblxuICAgICAgICBpZiAoIWlzQ2hlY2tlZCAmJiAhdGhpcy5hbGxvd1N3aXRjaE9mZikge1xuICAgICAgICAgICAgdmFyIHRvZ2dsZUl0ZW1zID0gdGhpcy50b2dnbGVJdGVtcztcbiAgICAgICAgICAgIGlmICh0b2dnbGVJdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdG9nZ2xlSXRlbXNbMF0uY2hlY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkVuYWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm5vZGUub24oJ2NoaWxkLWFkZGVkJywgdGhpcy5fYWxsb3dPbmx5T25lVG9nZ2xlQ2hlY2tlZCwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vbignY2hpbGQtcmVtb3ZlZCcsIHRoaXMuX21ha2VBdExlYXN0T25lVG9nZ2xlQ2hlY2tlZCwgdGhpcyk7XG4gICAgfSxcblxuICAgIG9uRGlzYWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm5vZGUub2ZmKCdjaGlsZC1hZGRlZCcsIHRoaXMuX2FsbG93T25seU9uZVRvZ2dsZUNoZWNrZWQsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKCdjaGlsZC1yZW1vdmVkJywgdGhpcy5fbWFrZUF0TGVhc3RPbmVUb2dnbGVDaGVja2VkLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgc3RhcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fbWFrZUF0TGVhc3RPbmVUb2dnbGVDaGVja2VkKCk7XG4gICAgfVxufSk7XG5cbi8qKlxuICogISNlbiBSZWFkIG9ubHkgcHJvcGVydHksIHJldHVybiB0aGUgdG9nZ2xlIGl0ZW1zIGFycmF5IHJlZmVyZW5jZSBtYW5hZ2VkIGJ5IFRvZ2dsZUNvbnRhaW5lci5cbiAqICEjemgg5Y+q6K+75bGe5oCn77yM6L+U5ZueIFRvZ2dsZUNvbnRhaW5lciDnrqHnkIbnmoQgdG9nZ2xlIOaVsOe7hOW8leeUqFxuICogQHByb3BlcnR5IHtUb2dnbGVbXX0gdG9nZ2xlSXRlbXNcbiAqL1xudmFyIGpzID0gcmVxdWlyZSgnLi4vcGxhdGZvcm0vanMnKTtcbmpzLmdldChUb2dnbGVDb250YWluZXIucHJvdG90eXBlLCAndG9nZ2xlSXRlbXMnLFxuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZS5nZXRDb21wb25lbnRzSW5DaGlsZHJlbihjYy5Ub2dnbGUpO1xuICAgIH1cbik7XG5cbmNjLlRvZ2dsZUNvbnRhaW5lciA9IG1vZHVsZS5leHBvcnRzID0gVG9nZ2xlQ29udGFpbmVyO1xuIl19