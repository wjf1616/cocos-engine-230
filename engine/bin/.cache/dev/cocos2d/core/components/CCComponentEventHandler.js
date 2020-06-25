
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCComponentEventHandler.js';
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
 * Component will register a event to target component's handler.
 * And it will trigger the handler when a certain event occurs.
 *
 * !@zh
 * “EventHandler” 类用来设置场景中的事件回调，
 * 该类允许用户设置回调目标节点，目标组件名，组件方法名，
 * 并可通过 emit 方法调用目标函数。
 * @class Component.EventHandler
 * @example
 * // Let's say we have a MainMenu component on newTarget
 * // file: MainMenu.js
 * cc.Class({
 *   extends: cc.Component,
 *   // sender: the node MainMenu.js belongs to
 *   // eventType: CustomEventData
 *   onClick (sender, eventType) {
 *     cc.log('click');
 *   }
 * })
 * // Create new EventHandler
 * var eventHandler = new cc.Component.EventHandler();
 * eventHandler.target = newTarget;
 * eventHandler.component = "MainMenu";
 * eventHandler.handler = "onClick";
 * eventHandler.customEventData = "my data";
 */
cc.Component.EventHandler = cc.Class({
  name: 'cc.ClickEvent',
  properties: {
    /**
     * !#en the node that contains target callback, such as the node example script belongs to
     * !#zh 事件响应函数所在节点 ，比如例子中脚本归属的节点本身
     * @property target
     * @type {Node}
     * @default null
     */
    target: {
      "default": null,
      type: cc.Node
    },

    /**
     * !#en name of the component(script) that contains target callback, such as the name 'MainMenu' of script in example
     * !#zh 事件响应函数所在组件名（脚本名）, 比如例子中的脚本名 'MainMenu'
     * @property component
     * @type {String}
     * @default ''
     */
    // only for deserializing old project component field
    component: '',
    _componentId: '',
    _componentName: {
      get: function get() {
        this._genCompIdIfNeeded();

        return this._compId2Name(this._componentId);
      },
      set: function set(value) {
        this._componentId = this._compName2Id(value);
      }
    },

    /**
     * !#en Event handler, such as function's name 'onClick' in example
     * !#zh 响应事件函数名，比如例子中的 'onClick'
     * @property handler
     * @type {String}
     * @default ''
     */
    handler: {
      "default": ''
    },

    /**
     * !#en Custom Event Data, such as 'eventType' in example
     * !#zh 自定义事件数据，比如例子中的 eventType
     * @property customEventData
     * @default ''
     * @type {String}
     */
    customEventData: {
      "default": ''
    }
  },
  statics: {
    /**
     * @method emitEvents
     * @param {Component.EventHandler[]} events
     * @param {any} ...params
     * @static
     */
    emitEvents: function emitEvents(events) {
      'use strict';

      var args;

      if (arguments.length > 0) {
        args = new Array(arguments.length - 1);

        for (var i = 0, l = args.length; i < l; i++) {
          args[i] = arguments[i + 1];
        }
      }

      for (var _i = 0, _l = events.length; _i < _l; _i++) {
        var event = events[_i];
        if (!(event instanceof cc.Component.EventHandler)) continue;
        event.emit(args);
      }
    }
  },

  /**
   * !#en Emit event with params
   * !#zh 触发目标组件上的指定 handler 函数，该参数是回调函数的参数值（可不填）。
   * @method emit
   * @param {Array} params
   * @example
   * // Call Function
   * var eventHandler = new cc.Component.EventHandler();
   * eventHandler.target = newTarget;
   * eventHandler.component = "MainMenu";
   * eventHandler.handler = "OnClick"
   * eventHandler.emit(["param1", "param2", ....]);
   */
  emit: function emit(params) {
    var target = this.target;
    if (!cc.isValid(target)) return;

    this._genCompIdIfNeeded();

    var compType = cc.js._getClassById(this._componentId);

    var comp = target.getComponent(compType);
    if (!cc.isValid(comp)) return;
    var handler = comp[this.handler];
    if (typeof handler !== 'function') return;

    if (this.customEventData != null && this.customEventData !== '') {
      params = params.slice();
      params.push(this.customEventData);
    }

    handler.apply(comp, params);
  },
  _compName2Id: function _compName2Id(compName) {
    var comp = cc.js.getClassByName(compName);
    return cc.js._getClassId(comp);
  },
  _compId2Name: function _compId2Name(compId) {
    var comp = cc.js._getClassById(compId);

    return cc.js.getClassName(comp);
  },
  // to be deprecated in the future
  _genCompIdIfNeeded: function _genCompIdIfNeeded() {
    if (!this._componentId) {
      this._componentName = this.component;
      this.component = '';
    }
  }
});
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDQ29tcG9uZW50RXZlbnRIYW5kbGVyLmpzIl0sIm5hbWVzIjpbImNjIiwiQ29tcG9uZW50IiwiRXZlbnRIYW5kbGVyIiwiQ2xhc3MiLCJuYW1lIiwicHJvcGVydGllcyIsInRhcmdldCIsInR5cGUiLCJOb2RlIiwiY29tcG9uZW50IiwiX2NvbXBvbmVudElkIiwiX2NvbXBvbmVudE5hbWUiLCJnZXQiLCJfZ2VuQ29tcElkSWZOZWVkZWQiLCJfY29tcElkMk5hbWUiLCJzZXQiLCJ2YWx1ZSIsIl9jb21wTmFtZTJJZCIsImhhbmRsZXIiLCJjdXN0b21FdmVudERhdGEiLCJzdGF0aWNzIiwiZW1pdEV2ZW50cyIsImV2ZW50cyIsImFyZ3MiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJBcnJheSIsImkiLCJsIiwiZXZlbnQiLCJlbWl0IiwicGFyYW1zIiwiaXNWYWxpZCIsImNvbXBUeXBlIiwianMiLCJfZ2V0Q2xhc3NCeUlkIiwiY29tcCIsImdldENvbXBvbmVudCIsInNsaWNlIiwicHVzaCIsImFwcGx5IiwiY29tcE5hbWUiLCJnZXRDbGFzc0J5TmFtZSIsIl9nZXRDbGFzc0lkIiwiY29tcElkIiwiZ2V0Q2xhc3NOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEJBQSxFQUFFLENBQUNDLFNBQUgsQ0FBYUMsWUFBYixHQUE0QkYsRUFBRSxDQUFDRyxLQUFILENBQVM7QUFDakNDLEVBQUFBLElBQUksRUFBRSxlQUQyQjtBQUVqQ0MsRUFBQUEsVUFBVSxFQUFFO0FBQ1I7Ozs7Ozs7QUFPQUMsSUFBQUEsTUFBTSxFQUFFO0FBQ0osaUJBQVMsSUFETDtBQUVKQyxNQUFBQSxJQUFJLEVBQUVQLEVBQUUsQ0FBQ1E7QUFGTCxLQVJBOztBQVlSOzs7Ozs7O0FBT0E7QUFDQUMsSUFBQUEsU0FBUyxFQUFFLEVBcEJIO0FBcUJSQyxJQUFBQSxZQUFZ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R0FBR3BDLEVBQUUsQ0FBQ2tDLEVBQUgsQ0FBTVEsY0FBTixDQUFxQkQsUUFBckIsQ0FBWDtBQUNBLFdBQU96QyxFQUFFLENBQUNrQyxFQUFILENBQU1TLFdBQU4sQ0FBa0JQLElBQWxCLENBQVA7QUFDSCxHQXZIZ0M7QUF5SGpDdEIsRUFBQUEsWUF6SGlDLHdCQXlIbkI4QixNQXpIbUIsRUF5SFg7QUFDbEIsUUFBSVIsSUFBSSxHQUFHcEMsRUFBRSxDQUFDa0MsRUFBSCxDQUFNQyxhQUFOLENBQW9CUyxNQUFwQixDQUFYOztBQUNBLFdBQU81QyxFQUFFLENBQUNrQyxFQUFILENBQU1XLFlBQU4sQ0FBbUJULElBQW5CLENBQVA7QUFDSCxHQTVIZ0M7QUE4SGpDO0FBQ0F2QixFQUFBQSxrQkEvSGlDLGdDQStIWDtBQUNsQixRQUFJLENBQUMsS0FBS0gsWUFBVixFQUF3QjtBQUNwQixXQUFLQyxjQUFMLEdBQXNCLEtBQUtGLFNBQTNCO0FBQ0EsV0FBS0EsU0FBTCxHQUFpQixFQUFqQjtBQUNIO0FBQ0o7QUFwSWdDLENBQVQsQ0FBNUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qKlxuICogISNlblxuICogQ29tcG9uZW50IHdpbGwgcmVnaXN0ZXIgYSBldmVudCB0byB0YXJnZXQgY29tcG9uZW50J3MgaGFuZGxlci5cbiAqIEFuZCBpdCB3aWxsIHRyaWdnZXIgdGhlIGhhbmRsZXIgd2hlbiBhIGNlcnRhaW4gZXZlbnQgb2NjdXJzLlxuICpcbiAqICFAemhcbiAqIOKAnEV2ZW50SGFuZGxlcuKAnSDnsbvnlKjmnaXorr7nva7lnLrmma/kuK3nmoTkuovku7blm57osIPvvIxcbiAqIOivpeexu+WFgeiuuOeUqOaIt+iuvue9ruWbnuiwg+ebruagh+iKgueCue+8jOebruagh+e7hOS7tuWQje+8jOe7hOS7tuaWueazleWQje+8jFxuICog5bm25Y+v6YCa6L+HIGVtaXQg5pa55rOV6LCD55So55uu5qCH5Ye95pWw44CCXG4gKiBAY2xhc3MgQ29tcG9uZW50LkV2ZW50SGFuZGxlclxuICogQGV4YW1wbGVcbiAqIC8vIExldCdzIHNheSB3ZSBoYXZlIGEgTWFpbk1lbnUgY29tcG9uZW50IG9uIG5ld1RhcmdldFxuICogLy8gZmlsZTogTWFpbk1lbnUuanNcbiAqIGNjLkNsYXNzKHtcbiAqICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICogICAvLyBzZW5kZXI6IHRoZSBub2RlIE1haW5NZW51LmpzIGJlbG9uZ3MgdG9cbiAqICAgLy8gZXZlbnRUeXBlOiBDdXN0b21FdmVudERhdGFcbiAqICAgb25DbGljayAoc2VuZGVyLCBldmVudFR5cGUpIHtcbiAqICAgICBjYy5sb2coJ2NsaWNrJyk7XG4gKiAgIH1cbiAqIH0pXG4gKiAvLyBDcmVhdGUgbmV3IEV2ZW50SGFuZGxlclxuICogdmFyIGV2ZW50SGFuZGxlciA9IG5ldyBjYy5Db21wb25lbnQuRXZlbnRIYW5kbGVyKCk7XG4gKiBldmVudEhhbmRsZXIudGFyZ2V0ID0gbmV3VGFyZ2V0O1xuICogZXZlbnRIYW5kbGVyLmNvbXBvbmVudCA9IFwiTWFpbk1lbnVcIjtcbiAqIGV2ZW50SGFuZGxlci5oYW5kbGVyID0gXCJvbkNsaWNrXCI7XG4gKiBldmVudEhhbmRsZXIuY3VzdG9tRXZlbnREYXRhID0gXCJteSBkYXRhXCI7XG4gKi9cbmNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXIgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLkNsaWNrRXZlbnQnLFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gdGhlIG5vZGUgdGhhdCBjb250YWlucyB0YXJnZXQgY2FsbGJhY2ssIHN1Y2ggYXMgdGhlIG5vZGUgZXhhbXBsZSBzY3JpcHQgYmVsb25ncyB0b1xuICAgICAgICAgKiAhI3poIOS6i+S7tuWTjeW6lOWHveaVsOaJgOWcqOiKgueCuSDvvIzmr5TlpoLkvovlrZDkuK3ohJrmnKzlvZLlsZ7nmoToioLngrnmnKzouqtcbiAgICAgICAgICogQHByb3BlcnR5IHRhcmdldFxuICAgICAgICAgKiBAdHlwZSB7Tm9kZX1cbiAgICAgICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAgICAgKi9cbiAgICAgICAgdGFyZ2V0OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZSxcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gbmFtZSBvZiB0aGUgY29tcG9uZW50KHNjcmlwdCkgdGhhdCBjb250YWlucyB0YXJnZXQgY2FsbGJhY2ssIHN1Y2ggYXMgdGhlIG5hbWUgJ01haW5NZW51JyBvZiBzY3JpcHQgaW4gZXhhbXBsZVxuICAgICAgICAgKiAhI3poIOS6i+S7tuWTjeW6lOWHveaVsOaJgOWcqOe7hOS7tuWQje+8iOiEmuacrOWQje+8iSwg5q+U5aaC5L6L5a2Q5Lit55qE6ISa5pys5ZCNICdNYWluTWVudSdcbiAgICAgICAgICogQHByb3BlcnR5IGNvbXBvbmVudFxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAZGVmYXVsdCAnJ1xuICAgICAgICAgKi9cbiAgICAgICAgLy8gb25seSBmb3IgZGVzZXJpYWxpemluZyBvbGQgcHJvamVjdCBjb21wb25lbnQgZmllbGRcbiAgICAgICAgY29tcG9uZW50OiAnJyxcbiAgICAgICAgX2NvbXBvbmVudElkOiAnJyxcbiAgICAgICAgX2NvbXBvbmVudE5hbWU6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZ2VuQ29tcElkSWZOZWVkZWQoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb21wSWQyTmFtZSh0aGlzLl9jb21wb25lbnRJZCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbXBvbmVudElkID0gdGhpcy5fY29tcE5hbWUySWQodmFsdWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gRXZlbnQgaGFuZGxlciwgc3VjaCBhcyBmdW5jdGlvbidzIG5hbWUgJ29uQ2xpY2snIGluIGV4YW1wbGVcbiAgICAgICAgICogISN6aCDlk43lupTkuovku7blh73mlbDlkI3vvIzmr5TlpoLkvovlrZDkuK3nmoQgJ29uQ2xpY2snXG4gICAgICAgICAqIEBwcm9wZXJ0eSBoYW5kbGVyXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqIEBkZWZhdWx0ICcnXG4gICAgICAgICAqL1xuICAgICAgICBoYW5kbGVyOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAnJyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBDdXN0b20gRXZlbnQgRGF0YSwgc3VjaCBhcyAnZXZlbnRUeXBlJyBpbiBleGFtcGxlXG4gICAgICAgICAqICEjemgg6Ieq5a6a5LmJ5LqL5Lu25pWw5o2u77yM5q+U5aaC5L6L5a2Q5Lit55qEIGV2ZW50VHlwZVxuICAgICAgICAgKiBAcHJvcGVydHkgY3VzdG9tRXZlbnREYXRhXG4gICAgICAgICAqIEBkZWZhdWx0ICcnXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBjdXN0b21FdmVudERhdGE6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RhdGljczoge1xuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBlbWl0RXZlbnRzXG4gICAgICAgICAqIEBwYXJhbSB7Q29tcG9uZW50LkV2ZW50SGFuZGxlcltdfSBldmVudHNcbiAgICAgICAgICogQHBhcmFtIHthbnl9IC4uLnBhcmFtc1xuICAgICAgICAgKiBAc3RhdGljXG4gICAgICAgICAqL1xuICAgICAgICBlbWl0RXZlbnRzOiBmdW5jdGlvbihldmVudHMpIHtcbiAgICAgICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgICAgIGxldCBhcmdzO1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBhcmdzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2krMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBldmVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGV2ZW50ID0gZXZlbnRzW2ldO1xuICAgICAgICAgICAgICAgIGlmICghKGV2ZW50IGluc3RhbmNlb2YgY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlcikpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgZXZlbnQuZW1pdChhcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEVtaXQgZXZlbnQgd2l0aCBwYXJhbXNcbiAgICAgKiAhI3poIOinpuWPkeebruagh+e7hOS7tuS4iueahOaMh+WumiBoYW5kbGVyIOWHveaVsO+8jOivpeWPguaVsOaYr+Wbnuiwg+WHveaVsOeahOWPguaVsOWAvO+8iOWPr+S4jeWhq++8ieOAglxuICAgICAqIEBtZXRob2QgZW1pdFxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHBhcmFtc1xuICAgICAqIEBleGFtcGxlXG4gICAgICogLy8gQ2FsbCBGdW5jdGlvblxuICAgICAqIHZhciBldmVudEhhbmRsZXIgPSBuZXcgY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlcigpO1xuICAgICAqIGV2ZW50SGFuZGxlci50YXJnZXQgPSBuZXdUYXJnZXQ7XG4gICAgICogZXZlbnRIYW5kbGVyLmNvbXBvbmVudCA9IFwiTWFpbk1lbnVcIjtcbiAgICAgKiBldmVudEhhbmRsZXIuaGFuZGxlciA9IFwiT25DbGlja1wiXG4gICAgICogZXZlbnRIYW5kbGVyLmVtaXQoW1wicGFyYW0xXCIsIFwicGFyYW0yXCIsIC4uLi5dKTtcbiAgICAgKi9cbiAgICBlbWl0OiBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICAgICAgdmFyIHRhcmdldCA9IHRoaXMudGFyZ2V0O1xuICAgICAgICBpZiAoIWNjLmlzVmFsaWQodGFyZ2V0KSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuX2dlbkNvbXBJZElmTmVlZGVkKCk7XG4gICAgICAgIHZhciBjb21wVHlwZSA9IGNjLmpzLl9nZXRDbGFzc0J5SWQodGhpcy5fY29tcG9uZW50SWQpO1xuICAgICAgICBcbiAgICAgICAgdmFyIGNvbXAgPSB0YXJnZXQuZ2V0Q29tcG9uZW50KGNvbXBUeXBlKTtcbiAgICAgICAgaWYgKCFjYy5pc1ZhbGlkKGNvbXApKSByZXR1cm47XG5cbiAgICAgICAgdmFyIGhhbmRsZXIgPSBjb21wW3RoaXMuaGFuZGxlcl07XG4gICAgICAgIGlmICh0eXBlb2YoaGFuZGxlcikgIT09ICdmdW5jdGlvbicpIHJldHVybjtcblxuICAgICAgICBpZiAodGhpcy5jdXN0b21FdmVudERhdGEgIT0gbnVsbCAmJiB0aGlzLmN1c3RvbUV2ZW50RGF0YSAhPT0gJycpIHtcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcy5zbGljZSgpO1xuICAgICAgICAgICAgcGFyYW1zLnB1c2godGhpcy5jdXN0b21FdmVudERhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgaGFuZGxlci5hcHBseShjb21wLCBwYXJhbXMpO1xuICAgIH0sXG5cbiAgICBfY29tcE5hbWUySWQgKGNvbXBOYW1lKSB7XG4gICAgICAgIGxldCBjb21wID0gY2MuanMuZ2V0Q2xhc3NCeU5hbWUoY29tcE5hbWUpO1xuICAgICAgICByZXR1cm4gY2MuanMuX2dldENsYXNzSWQoY29tcCk7XG4gICAgfSxcblxuICAgIF9jb21wSWQyTmFtZSAoY29tcElkKSB7XG4gICAgICAgIGxldCBjb21wID0gY2MuanMuX2dldENsYXNzQnlJZChjb21wSWQpO1xuICAgICAgICByZXR1cm4gY2MuanMuZ2V0Q2xhc3NOYW1lKGNvbXApO1xuICAgIH0sXG5cbiAgICAvLyB0byBiZSBkZXByZWNhdGVkIGluIHRoZSBmdXR1cmVcbiAgICBfZ2VuQ29tcElkSWZOZWVkZWQgKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2NvbXBvbmVudElkKSB7XG4gICAgICAgICAgICB0aGlzLl9jb21wb25lbnROYW1lID0gdGhpcy5jb21wb25lbnQ7XG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudCA9ICcnO1xuICAgICAgICB9XG4gICAgfSxcbn0pO1xuIl19