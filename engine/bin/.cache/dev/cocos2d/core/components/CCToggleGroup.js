
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCToggleGroup.js';
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
 * !#en ToggleGroup is not a visiable UI component but a way to modify the behavior of a set of Toggles.
 * Toggles that belong to the same group could only have one of them to be switched on at a time.
 * !#zh ToggleGroup 不是一个可见的 UI 组件，它可以用来修改一组 Toggle  组件的行为。当一组 Toggle 属于同一个 ToggleGroup 的时候，
 * 任何时候只能有一个 Toggle 处于选中状态。
 * @class ToggleGroup
 * @extends Component
 */
var ToggleGroup = cc.Class({
  name: 'cc.ToggleGroup',
  "extends": cc.Component,
  ctor: function ctor() {
    this._toggleItems = [];
  },
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.ui/ToggleGroup (Legacy)',
    help: 'i18n:COMPONENT.help_url.toggleGroup'
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
     * !#en Read only property, return the toggle items array reference managed by toggleGroup.
     * !#zh 只读属性，返回 toggleGroup 管理的 toggle 数组引用
     * @property {Array} toggleItems
     */
    toggleItems: {
      get: function get() {
        return this._toggleItems;
      }
    }
  },
  updateToggles: function updateToggles(toggle) {
    if (!this.enabledInHierarchy) return;

    this._toggleItems.forEach(function (item) {
      if (toggle.isChecked) {
        if (item !== toggle && item.isChecked && item.enabled) {
          item._hideCheckMark();
        }
      }
    });
  },
  addToggle: function addToggle(toggle) {
    var index = this._toggleItems.indexOf(toggle);

    if (index === -1) {
      this._toggleItems.push(toggle);
    }

    this._allowOnlyOneToggleChecked();
  },
  removeToggle: function removeToggle(toggle) {
    var index = this._toggleItems.indexOf(toggle);

    if (index > -1) {
      this._toggleItems.splice(index, 1);
    }

    this._makeAtLeastOneToggleChecked();
  },
  _allowOnlyOneToggleChecked: function _allowOnlyOneToggleChecked() {
    var isChecked = false;

    this._toggleItems.forEach(function (item) {
      if (isChecked && item.enabled) {
        item._hideCheckMark();
      }

      if (item.isChecked && item.enabled) {
        isChecked = true;
      }
    });

    return isChecked;
  },
  _makeAtLeastOneToggleChecked: function _makeAtLeastOneToggleChecked() {
    var isChecked = this._allowOnlyOneToggleChecked();

    if (!isChecked && !this.allowSwitchOff) {
      if (this._toggleItems.length > 0) {
        this._toggleItems[0].isChecked = true;
      }
    }
  },
  start: function start() {
    this._makeAtLeastOneToggleChecked();
  }
});

var js = require('../platform/js');

var showed = false;
js.get(cc, 'ToggleGroup', function () {
  if (!showed) {
    cc.logID(1405, 'cc.ToggleGroup', 'cc.ToggleContainer');
    showed = true;
  }

  return ToggleGroup;
});
module.exports = ToggleGroup;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDVG9nZ2xlR3JvdXAuanMiXSwibmFtZXMiOlsiVG9nZ2xlR3JvdXAiLCJjYyIsIkNsYXNzIiwibmFtZSIsIkNvbXBvbmVudCIsImN0b3IiLCJfdG9nZ2xlSXRlbXMiLCJlZGl0b3IiLCJDQ19FRElUT1IiLCJtZW51IiwiaGVscCIsInByb3BlcnRpZXMiLCJhbGxvd1N3aXRjaE9mZiIsInRvb2x0aXAiLCJDQ19ERVYiLCJ0b2dnbGVJdGVtcyIsImdldCIsInVwZGF0ZVRvZ2dsZXMiLCJ0b2dnbGUiLCJlbmFibGVkSW5IaWVyYXJjaHkiLCJmb3JFYWNoIiwiaXRlbSIsImlzQ2hlY2tlZCIsImVuYWJsZWQiLCJfaGlkZUNoZWNrTWFyayIsImFkZFRvZ2dsZSIsImluZGV4IiwiaW5kZXhPZiIsInB1c2giLCJfYWxsb3dPbmx5T25lVG9nZ2xlQ2hlY2tlZCIsInJlbW92ZVRvZ2dsZSIsInNwbGljZSIsIl9tYWtlQXRMZWFzdE9uZVRvZ2dsZUNoZWNrZWQiLCJsZW5ndGgiLCJzdGFydCIsImpzIiwicmVxdWlyZSIsInNob3dlZCIsImxvZ0lEIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQTs7Ozs7Ozs7QUFRQSxJQUFJQSxXQUFXLEdBQUdDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ3ZCQyxFQUFBQSxJQUFJLEVBQUUsZ0JBRGlCO0FBRXZCLGFBQVNGLEVBQUUsQ0FBQ0csU0FGVztBQUd2QkMsRUFBQUEsSUFBSSxFQUFFLGdCQUFZO0FBQ2QsU0FBS0MsWUFBTCxHQUFvQixFQUFwQjtBQUNILEdBTHNCO0FBTXZCQyxFQUFBQSxNQUFNLEVBQUVDLFNBQVMsSUFBSTtBQUNqQkMsSUFBQUEsSUFBSSxFQUFFLGtEQURXO0FBRWpCQyxJQUFBQSxJQUFJLEVBQUU7QUFGVyxHQU5FO0FBV3ZCQyxFQUFBQSxVQUFVLEVBQUU7QUFDUjs7Ozs7OztBQU9BQyxJQUFBQSxjQUFj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QztBQUNBRCxJQUFBQSxNQUFNLEdBQUcsSUFBVDtBQUNIOztBQUNELFNBQU9yQyxXQUFQO0FBQ0gsQ0FORDtBQVFBdUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCeEMsV0FBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qKlxuICogISNlbiBUb2dnbGVHcm91cCBpcyBub3QgYSB2aXNpYWJsZSBVSSBjb21wb25lbnQgYnV0IGEgd2F5IHRvIG1vZGlmeSB0aGUgYmVoYXZpb3Igb2YgYSBzZXQgb2YgVG9nZ2xlcy5cbiAqIFRvZ2dsZXMgdGhhdCBiZWxvbmcgdG8gdGhlIHNhbWUgZ3JvdXAgY291bGQgb25seSBoYXZlIG9uZSBvZiB0aGVtIHRvIGJlIHN3aXRjaGVkIG9uIGF0IGEgdGltZS5cbiAqICEjemggVG9nZ2xlR3JvdXAg5LiN5piv5LiA5Liq5Y+v6KeB55qEIFVJIOe7hOS7tu+8jOWug+WPr+S7peeUqOadpeS/ruaUueS4gOe7hCBUb2dnbGUgIOe7hOS7tueahOihjOS4uuOAguW9k+S4gOe7hCBUb2dnbGUg5bGe5LqO5ZCM5LiA5LiqIFRvZ2dsZUdyb3VwIOeahOaXtuWAme+8jFxuICog5Lu75L2V5pe25YCZ5Y+q6IO95pyJ5LiA5LiqIFRvZ2dsZSDlpITkuo7pgInkuK3nirbmgIHjgIJcbiAqIEBjbGFzcyBUb2dnbGVHcm91cFxuICogQGV4dGVuZHMgQ29tcG9uZW50XG4gKi9cbnZhciBUb2dnbGVHcm91cCA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuVG9nZ2xlR3JvdXAnLFxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcbiAgICBjdG9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3RvZ2dsZUl0ZW1zID0gW107XG4gICAgfSxcbiAgICBlZGl0b3I6IENDX0VESVRPUiAmJiB7XG4gICAgICAgIG1lbnU6ICdpMThuOk1BSU5fTUVOVS5jb21wb25lbnQudWkvVG9nZ2xlR3JvdXAgKExlZ2FjeSknLFxuICAgICAgICBoZWxwOiAnaTE4bjpDT01QT05FTlQuaGVscF91cmwudG9nZ2xlR3JvdXAnXG4gICAgfSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gSWYgdGhpcyBzZXR0aW5nIGlzIHRydWUsIGEgdG9nZ2xlIGNvdWxkIGJlIHN3aXRjaGVkIG9mZiBhbmQgb24gd2hlbiBwcmVzc2VkLlxuICAgICAgICAgKiBJZiBpdCBpcyBmYWxzZSwgaXQgd2lsbCBtYWtlIHN1cmUgdGhlcmUgaXMgYWx3YXlzIG9ubHkgb25lIHRvZ2dsZSBjb3VsZCBiZSBzd2l0Y2hlZCBvblxuICAgICAgICAgKiBhbmQgdGhlIGFscmVhZHkgc3dpdGNoZWQgb24gdG9nZ2xlIGNhbid0IGJlIHN3aXRjaGVkIG9mZi5cbiAgICAgICAgICogISN6aCDlpoLmnpzov5nkuKrorr7nva7kuLogdHJ1Ze+8jCDpgqPkuYggdG9nZ2xlIOaMiemSruWcqOiiq+eCueWHu+eahOaXtuWAmeWPr+S7peWPjeWkjeWcsOiiq+mAieS4reWSjOacqumAieS4reOAglxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGFsbG93U3dpdGNoT2ZmXG4gICAgICAgICAqL1xuICAgICAgICBhbGxvd1N3aXRjaE9mZjoge1xuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC50b2dnbGVfZ3JvdXAuYWxsb3dTd2l0Y2hPZmYnLFxuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBSZWFkIG9ubHkgcHJvcGVydHksIHJldHVybiB0aGUgdG9nZ2xlIGl0ZW1zIGFycmF5IHJlZmVyZW5jZSBtYW5hZ2VkIGJ5IHRvZ2dsZUdyb3VwLlxuICAgICAgICAgKiAhI3poIOWPquivu+WxnuaAp++8jOi/lOWbniB0b2dnbGVHcm91cCDnrqHnkIbnmoQgdG9nZ2xlIOaVsOe7hOW8leeUqFxuICAgICAgICAgKiBAcHJvcGVydHkge0FycmF5fSB0b2dnbGVJdGVtc1xuICAgICAgICAgKi9cbiAgICAgICAgdG9nZ2xlSXRlbXM6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl90b2dnbGVJdGVtcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB1cGRhdGVUb2dnbGVzOiBmdW5jdGlvbiAodG9nZ2xlKSB7XG4gICAgICAgIGlmKCF0aGlzLmVuYWJsZWRJbkhpZXJhcmNoeSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuX3RvZ2dsZUl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pe1xuICAgICAgICAgICAgaWYodG9nZ2xlLmlzQ2hlY2tlZCkge1xuICAgICAgICAgICAgICAgIGlmIChpdGVtICE9PSB0b2dnbGUgJiYgaXRlbS5pc0NoZWNrZWQgJiYgaXRlbS5lbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uX2hpZGVDaGVja01hcmsoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBhZGRUb2dnbGU6IGZ1bmN0aW9uICh0b2dnbGUpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5fdG9nZ2xlSXRlbXMuaW5kZXhPZih0b2dnbGUpO1xuICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl90b2dnbGVJdGVtcy5wdXNoKHRvZ2dsZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fYWxsb3dPbmx5T25lVG9nZ2xlQ2hlY2tlZCgpO1xuICAgIH0sXG5cbiAgICByZW1vdmVUb2dnbGU6IGZ1bmN0aW9uICh0b2dnbGUpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5fdG9nZ2xlSXRlbXMuaW5kZXhPZih0b2dnbGUpO1xuICAgICAgICBpZihpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl90b2dnbGVJdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX21ha2VBdExlYXN0T25lVG9nZ2xlQ2hlY2tlZCgpO1xuICAgIH0sXG5cbiAgICBfYWxsb3dPbmx5T25lVG9nZ2xlQ2hlY2tlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaXNDaGVja2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3RvZ2dsZUl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIGlmKGlzQ2hlY2tlZCAmJiBpdGVtLmVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICBpdGVtLl9oaWRlQ2hlY2tNYXJrKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpdGVtLmlzQ2hlY2tlZCAmJiBpdGVtLmVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICBpc0NoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gaXNDaGVja2VkO1xuICAgIH0sXG5cbiAgICBfbWFrZUF0TGVhc3RPbmVUb2dnbGVDaGVja2VkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpc0NoZWNrZWQgPSB0aGlzLl9hbGxvd09ubHlPbmVUb2dnbGVDaGVja2VkKCk7XG5cbiAgICAgICAgaWYoIWlzQ2hlY2tlZCAmJiAhdGhpcy5hbGxvd1N3aXRjaE9mZikge1xuICAgICAgICAgICAgaWYodGhpcy5fdG9nZ2xlSXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3RvZ2dsZUl0ZW1zWzBdLmlzQ2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RhcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fbWFrZUF0TGVhc3RPbmVUb2dnbGVDaGVja2VkKCk7XG4gICAgfVxufSk7XG5cbnZhciBqcyA9IHJlcXVpcmUoJy4uL3BsYXRmb3JtL2pzJyk7XG52YXIgc2hvd2VkID0gZmFsc2U7XG5qcy5nZXQoY2MsICdUb2dnbGVHcm91cCcsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXNob3dlZCkge1xuICAgICAgICBjYy5sb2dJRCgxNDA1LCAnY2MuVG9nZ2xlR3JvdXAnLCAnY2MuVG9nZ2xlQ29udGFpbmVyJyk7XG4gICAgICAgIHNob3dlZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBUb2dnbGVHcm91cDtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRvZ2dsZUdyb3VwO1xuIl19