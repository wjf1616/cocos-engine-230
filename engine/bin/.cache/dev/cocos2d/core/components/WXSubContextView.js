
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/WXSubContextView.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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
var Component = require('./CCComponent');
/**
 * !#en WXSubContextView is a view component which controls open data context viewport in WeChat game platform.<br/>
 * The component's node size decide the viewport of the sub context content in main context, 
 * the entire sub context texture will be scaled to the node's bounding box area.<br/>
 * This component provides multiple important features:<br/>
 * 1. Sub context could use its own resolution size and policy.<br/>
 * 2. Sub context could be minized to smallest size it needed.<br/>
 * 3. Resolution of sub context content could be increased.<br/>
 * 4. User touch input is transformed to the correct viewport.<br/>
 * 5. Texture update is handled by this component. User don't need to worry.<br/>
 * One important thing to be noted, whenever the node's bounding box change, 
 * you need to manually reset the viewport of sub context using updateSubContextViewport.
 * !#zh WXSubContextView 可以用来控制微信小游戏平台开放数据域在主域中的视窗的位置。<br/>
 * 这个组件的节点尺寸决定了开放数据域内容在主域中的尺寸，整个开放数据域会被缩放到节点的包围盒范围内。<br/>
 * 在这个组件的控制下，用户可以更自由得控制开放数据域：<br/>
 * 1. 子域中可以使用独立的设计分辨率和适配模式<br/>
 * 2. 子域区域尺寸可以缩小到只容纳内容即可<br/>
 * 3. 子域的分辨率也可以被放大，以便获得更清晰的显示效果<br/>
 * 4. 用户输入坐标会被自动转换到正确的子域视窗中<br/>
 * 5. 子域内容贴图的更新由组件负责，用户不需要处理<br/>
 * 唯一需要注意的是，当子域节点的包围盒发生改变时，开发者需要使用 `updateSubContextViewport` 来手动更新子域视窗。
 * @class WXSubContextView
 * @extends Component
 */


var WXSubContextView = cc.Class({
  name: 'cc.WXSubContextView',
  "extends": Component,
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.others/WXSubContextView',
    help: 'i18n:COMPONENT.help_url.wx_subcontext_view'
  },
  properties: {
    _fps: 60,
    fps: {
      get: function get() {
        return this._fps;
      },
      set: function set(value) {
        if (this._fps === value) {
          return;
        }

        this._fps = value;
        this._updateInterval = 1 / value;

        this._updateSubContextFrameRate();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.wx_subcontext_view.fps'
    }
  },
  ctor: function ctor() {
    this._sprite = null;
    this._tex = new cc.Texture2D();
    this._context = null;
    this._updatedTime = performance.now();
    this._updateInterval = 0;
  },
  onLoad: function onLoad() {
    // Setup subcontext canvas size
    if (wx.getOpenDataContext) {
      this._updateInterval = 1000 / this._fps;
      this._context = wx.getOpenDataContext(); // reset sharedCanvas width and height

      this.reset();

      this._tex.setPremultiplyAlpha(true);

      this._tex.initWithElement(sharedCanvas);

      this._sprite = this.node.getComponent(cc.Sprite);

      if (!this._sprite) {
        this._sprite = this.node.addComponent(cc.Sprite);
        this._sprite.srcBlendFactor = cc.macro.BlendFactor.ONE;
      }

      this._sprite.spriteFrame = new cc.SpriteFrame(this._tex);
    } else {
      this.enabled = false;
    }
  },

  /**
   * !#en Reset open data context size and viewport
   * !#zh 重置开放数据域的尺寸和视窗
   * @method reset
   */
  reset: function reset() {
    if (this._context) {
      this.updateSubContextViewport();
      var _sharedCanvas = this._context.canvas;

      if (_sharedCanvas) {
        _sharedCanvas.width = this.node.width;
        _sharedCanvas.height = this.node.height;
      }
    }
  },
  onEnable: function onEnable() {
    this._runSubContextMainLoop();

    this._registerNodeEvent();

    this._updateSubContextFrameRate();

    this.updateSubContextViewport();
  },
  onDisable: function onDisable() {
    this._unregisterNodeEvent();

    this._stopSubContextMainLoop();
  },
  update: function update(dt) {
    var calledUpdateMannually = dt === undefined;

    if (calledUpdateMannually) {
      this._context && this._context.postMessage({
        fromEngine: true,
        event: 'step'
      });

      this._updateSubContextTexture();

      return;
    }

    var now = performance.now();
    var deltaTime = now - this._updatedTime;

    if (deltaTime >= this._updateInterval) {
      this._updatedTime += this._updateInterval;

      this._updateSubContextTexture();
    }
  },
  _updateSubContextTexture: function _updateSubContextTexture() {
    if (!this._tex || !this._context) {
      return;
    }

    this._tex.initWithElement(this._context.canvas);

    this._sprite._activateMaterial();
  },

  /**
   * !#en Update the sub context viewport manually, it should be called whenever the node's bounding box changes.
   * !#zh 更新开放数据域相对于主域的 viewport，这个函数应该在节点包围盒改变时手动调用。
   * @method updateSubContextViewport
   */
  updateSubContextViewport: function updateSubContextViewport() {
    if (this._context) {
      var box = this.node.getBoundingBoxToWorld();
      var sx = cc.view._scaleX;
      var sy = cc.view._scaleY;

      this._context.postMessage({
        fromEngine: true,
        event: 'viewport',
        x: box.x * sx + cc.view._viewportRect.x,
        y: box.y * sy + cc.view._viewportRect.y,
        width: box.width * sx,
        height: box.height * sy
      });
    }
  },
  _registerNodeEvent: function _registerNodeEvent() {
    this.node.on('position-changed', this.updateSubContextViewport, this);
    this.node.on('scale-changed', this.updateSubContextViewport, this);
    this.node.on('size-changed', this.updateSubContextViewport, this);
  },
  _unregisterNodeEvent: function _unregisterNodeEvent() {
    this.node.off('position-changed', this.updateSubContextViewport, this);
    this.node.off('scale-changed', this.updateSubContextViewport, this);
    this.node.off('size-changed', this.updateSubContextViewport, this);
  },
  _runSubContextMainLoop: function _runSubContextMainLoop() {
    if (this._context) {
      this._context.postMessage({
        fromEngine: true,
        event: 'mainLoop',
        value: true
      });
    }
  },
  _stopSubContextMainLoop: function _stopSubContextMainLoop() {
    if (this._context) {
      this._context.postMessage({
        fromEngine: true,
        event: 'mainLoop',
        value: false
      });
    }
  },
  _updateSubContextFrameRate: function _updateSubContextFrameRate() {
    if (this._context) {
      this._context.postMessage({
        fromEngine: true,
        event: 'frameRate',
        value: this._fps
      });
    }
  }
});
cc.WXSubContextView = module.exports = WXSubContextView;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIldYU3ViQ29udGV4dFZpZXcuanMiXSwibmFtZXMiOlsiQ29tcG9uZW50IiwicmVxdWlyZSIsIldYU3ViQ29udGV4dFZpZXciLCJjYyIsIkNsYXNzIiwibmFtZSIsImVkaXRvciIsIkNDX0VESVRPUiIsIm1lbnUiLCJoZWxwIiwicHJvcGVydGllcyIsIl9mcHMiLCJmcHMiLCJnZXQiLCJzZXQiLCJ2YWx1ZSIsIl91cGRhdGVJbnRlcnZhbCIsIl91cGRhdGVTdWJDb250ZXh0RnJhbWVSYXRlIiwidG9vbHRpcCIsIkNDX0RFViIsImN0b3IiLCJfc3ByaXRlIiwiX3RleCIsIlRleHR1cmUyRCIsIl9jb250ZXh0IiwiX3VwZGF0ZWRUaW1lIiwicGVyZm9ybWFuY2UiLCJub3ciLCJvbkxvYWQiLCJ3eCIsImdldE9wZW5EYXRhQ29udGV4dCIsInJlc2V0Iiwic2V0UHJlbXVsdGlwbHlBbHBoYSIsImluaXRXaXRoRWxlbWVudCIsInNoYXJlZENhbnZhcyIsIm5vZGUiLCJnZXRDb21wb25lbnQiLCJTcHJpdGUiLCJhZGRDb21wb25lbnQiLCJzcmNCbGVuZEZhY3RvciIsIm1hY3JvIiwiQmxlbmRGYWN0b3IiLCJPTkUiLCJzcHJpdGVGcmFtZSIsIlNwcml0ZUZyYW1lIiwiZW5hYmxlZCIsInVwZGF0ZVN1YkNvbnRleHRWaWV3cG9ydCIsImNhbnZhcyIsIndpZHRoIiwiaGVpZ2h0Iiwib25FbmFibGUiLCJfcnVuU3ViQ29udGV4dE1haW5Mb29wIiwiX3JlZ2lzdGVyTm9kZUV2ZW50Iiwib25EaXNhYmxlIiwiX3VucmVnaXN0ZXJOb2RlRXZlbnQiLCJfc3RvcFN1YkNvbnRleHRNYWluTG9vcCIsInVwZGF0ZSIsImR0IiwiY2FsbGVkVXBkYXRlTWFubnVhbGx5IiwidW5kZWZpbmVkIiwicG9zdE1lc3NhZ2UiLCJmcm9tRW5naW5lIiwiZXZlbnQiLCJfdXBkYXRlU3ViQ29udGV4dFRleHR1cmUiLCJkZWx0YVRpbWUiLCJfYWN0aXZhdGVNYXRlcmlhbCIsImJveCIsImdldEJvdW5kaW5nQm94VG9Xb3JsZCIsInN4IiwidmlldyIsIl9zY2FsZVgiLCJzeSIsIl9zY2FsZVkiLCJ4IiwiX3ZpZXdwb3J0UmVjdCIsInkiLCJvbiIsIm9mZiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBLElBQU1BLFNBQVMsR0FBR0MsT0FBTyxDQUFDLGVBQUQsQ0FBekI7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3QkEsSUFBSUMsZ0JBQWdCLEdBQUdDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQzVCQyxFQUFBQSxJQUFJLEVBQUUscUJBRHNCO0FBRTVCLGFBQVNMLFNBRm1CO0FBSTVCTSxFQUFBQSxNQUFNLEVBQUVDLFNBQVMsSUFBSTtBQUNqQkMsSUFBQUEsSUFBSSxFQUFFLGtEQURXO0FBRWpCQyxJQUFBQSxJQUFJLEVBQUU7QUFGVyxHQUpPO0FBUzVCQyxFQUFBQSxVQUFVLEVBQUU7QUFDUkMsSUFBQUEsSUFBSSxFQUFFLEVBREU7QUFHUkMsSUFBQUEsR0FBRyxFQUFFO0FBQ0RDLE1BQUFBLEdBREMsaUJBQ007QUFDSCxlQUFPLEtBQUtGLElBQVo7QUFDSCxPQUhBO0FBSURHLE1BQUFBLEdBSkMsZUFJSUMsS0FKSixFQUlXO0FBQ1IsWUFBSSxLQUFLSixJQUFMLEtBQWNJLEtBQWxCLEVBQXlCO0FBQ3JCO0FBQ0g7O0FBQ0QsYUFBS0osSUFBTCxHQUFZSSxLQUFaO0FBQ0EsYUFBS0MsZUFBTCxHQUF1QixJQUFJRCxLQUEzQjs7QUFDQSxhQUFLRSwwQkFBTDtBQUNILE9BWEE7QUFZREMsTUFBQUEsT0FBTyxFQUFFQyxNQUFNLElBQUk7QUFabEI7QUFIRyxHQVRnQjtBQTRCNUJDLEVBQUFBLElBNUI0QixrQkE0QnBCO0FBQ0osU0FBS0MsT0FBTCxHQUFlLElBQWY7QUFDQSxTQUFLQyxJQUFMLEdBQVksSUFBSW5CLEVBQUUsQ0FBQ29CLFNBQVAsRUFBWjtBQUNBLFNBQUtDLFFBQUwsR0FB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QUFLLEVBQUUsV0FGZTtBQUd0Qi9DLFFBQUFBLEtBQUssRUFBRSxLQUFLSjtBQUhVLE9BQTFCO0FBS0g7QUFDSjtBQTlLMkIsQ0FBVCxDQUF2QjtBQWlMQVIsRUFBRSxDQUFDRCxnQkFBSCxHQUFzQjRFLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjdFLGdCQUF2QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9DQ0NvbXBvbmVudCcpO1xuXG4vKipcbiAqICEjZW4gV1hTdWJDb250ZXh0VmlldyBpcyBhIHZpZXcgY29tcG9uZW50IHdoaWNoIGNvbnRyb2xzIG9wZW4gZGF0YSBjb250ZXh0IHZpZXdwb3J0IGluIFdlQ2hhdCBnYW1lIHBsYXRmb3JtLjxici8+XG4gKiBUaGUgY29tcG9uZW50J3Mgbm9kZSBzaXplIGRlY2lkZSB0aGUgdmlld3BvcnQgb2YgdGhlIHN1YiBjb250ZXh0IGNvbnRlbnQgaW4gbWFpbiBjb250ZXh0LCBcbiAqIHRoZSBlbnRpcmUgc3ViIGNvbnRleHQgdGV4dHVyZSB3aWxsIGJlIHNjYWxlZCB0byB0aGUgbm9kZSdzIGJvdW5kaW5nIGJveCBhcmVhLjxici8+XG4gKiBUaGlzIGNvbXBvbmVudCBwcm92aWRlcyBtdWx0aXBsZSBpbXBvcnRhbnQgZmVhdHVyZXM6PGJyLz5cbiAqIDEuIFN1YiBjb250ZXh0IGNvdWxkIHVzZSBpdHMgb3duIHJlc29sdXRpb24gc2l6ZSBhbmQgcG9saWN5Ljxici8+XG4gKiAyLiBTdWIgY29udGV4dCBjb3VsZCBiZSBtaW5pemVkIHRvIHNtYWxsZXN0IHNpemUgaXQgbmVlZGVkLjxici8+XG4gKiAzLiBSZXNvbHV0aW9uIG9mIHN1YiBjb250ZXh0IGNvbnRlbnQgY291bGQgYmUgaW5jcmVhc2VkLjxici8+XG4gKiA0LiBVc2VyIHRvdWNoIGlucHV0IGlzIHRyYW5zZm9ybWVkIHRvIHRoZSBjb3JyZWN0IHZpZXdwb3J0Ljxici8+XG4gKiA1LiBUZXh0dXJlIHVwZGF0ZSBpcyBoYW5kbGVkIGJ5IHRoaXMgY29tcG9uZW50LiBVc2VyIGRvbid0IG5lZWQgdG8gd29ycnkuPGJyLz5cbiAqIE9uZSBpbXBvcnRhbnQgdGhpbmcgdG8gYmUgbm90ZWQsIHdoZW5ldmVyIHRoZSBub2RlJ3MgYm91bmRpbmcgYm94IGNoYW5nZSwgXG4gKiB5b3UgbmVlZCB0byBtYW51YWxseSByZXNldCB0aGUgdmlld3BvcnQgb2Ygc3ViIGNvbnRleHQgdXNpbmcgdXBkYXRlU3ViQ29udGV4dFZpZXdwb3J0LlxuICogISN6aCBXWFN1YkNvbnRleHRWaWV3IOWPr+S7peeUqOadpeaOp+WItuW+ruS/oeWwj+a4uOaIj+W5s+WPsOW8gOaUvuaVsOaNruWfn+WcqOS4u+Wfn+S4reeahOinhueql+eahOS9jee9ruOAgjxici8+XG4gKiDov5nkuKrnu4Tku7bnmoToioLngrnlsLrlr7jlhrPlrprkuoblvIDmlL7mlbDmja7ln5/lhoXlrrnlnKjkuLvln5/kuK3nmoTlsLrlr7jvvIzmlbTkuKrlvIDmlL7mlbDmja7ln5/kvJrooqvnvKnmlL7liLDoioLngrnnmoTljIXlm7Tnm5LojIPlm7TlhoXjgII8YnIvPlxuICog5Zyo6L+Z5Liq57uE5Lu255qE5o6n5Yi25LiL77yM55So5oi35Y+v5Lul5pu06Ieq55Sx5b6X5o6n5Yi25byA5pS+5pWw5o2u5Z+f77yaPGJyLz5cbiAqIDEuIOWtkOWfn+S4reWPr+S7peS9v+eUqOeLrOeri+eahOiuvuiuoeWIhui+qOeOh+WSjOmAgumFjeaooeW8jzxici8+XG4gKiAyLiDlrZDln5/ljLrln5/lsLrlr7jlj6/ku6XnvKnlsI/liLDlj6rlrrnnurPlhoXlrrnljbPlj688YnIvPlxuICogMy4g5a2Q5Z+f55qE5YiG6L6o546H5Lmf5Y+v5Lul6KKr5pS+5aSn77yM5Lul5L6/6I635b6X5pu05riF5pmw55qE5pi+56S65pWI5p6cPGJyLz5cbiAqIDQuIOeUqOaIt+i+k+WFpeWdkOagh+S8muiiq+iHquWKqOi9rOaNouWIsOato+ehrueahOWtkOWfn+inhueql+S4rTxici8+XG4gKiA1LiDlrZDln5/lhoXlrrnotLTlm77nmoTmm7TmlrDnlLHnu4Tku7botJ/otKPvvIznlKjmiLfkuI3pnIDopoHlpITnkIY8YnIvPlxuICog5ZSv5LiA6ZyA6KaB5rOo5oSP55qE5piv77yM5b2T5a2Q5Z+f6IqC54K555qE5YyF5Zu055uS5Y+R55Sf5pS55Y+Y5pe277yM5byA5Y+R6ICF6ZyA6KaB5L2/55SoIGB1cGRhdGVTdWJDb250ZXh0Vmlld3BvcnRgIOadpeaJi+WKqOabtOaWsOWtkOWfn+inhueql+OAglxuICogQGNsYXNzIFdYU3ViQ29udGV4dFZpZXdcbiAqIEBleHRlbmRzIENvbXBvbmVudFxuICovXG5sZXQgV1hTdWJDb250ZXh0VmlldyA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuV1hTdWJDb250ZXh0VmlldycsXG4gICAgZXh0ZW5kczogQ29tcG9uZW50LFxuXG4gICAgZWRpdG9yOiBDQ19FRElUT1IgJiYge1xuICAgICAgICBtZW51OiAnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50Lm90aGVycy9XWFN1YkNvbnRleHRWaWV3JyxcbiAgICAgICAgaGVscDogJ2kxOG46Q09NUE9ORU5ULmhlbHBfdXJsLnd4X3N1YmNvbnRleHRfdmlldydcbiAgICB9LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBfZnBzOiA2MCxcblxuICAgICAgICBmcHM6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZwcztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2ZwcyA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9mcHMgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVJbnRlcnZhbCA9IDEgLyB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVTdWJDb250ZXh0RnJhbWVSYXRlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC53eF9zdWJjb250ZXh0X3ZpZXcuZnBzJ1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGN0b3IgKCkge1xuICAgICAgICB0aGlzLl9zcHJpdGUgPSBudWxsO1xuICAgICAgICB0aGlzLl90ZXggPSBuZXcgY2MuVGV4dHVyZTJEKCk7XG4gICAgICAgIHRoaXMuX2NvbnRleHQgPSBudWxsO1xuICAgICAgICB0aGlzLl91cGRhdGVkVGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICB0aGlzLl91cGRhdGVJbnRlcnZhbCA9IDA7XG4gICAgfSxcblxuICAgIG9uTG9hZCAoKSB7XG4gICAgICAgIC8vIFNldHVwIHN1YmNvbnRleHQgY2FudmFzIHNpemVcbiAgICAgICAgaWYgKHd4LmdldE9wZW5EYXRhQ29udGV4dCkge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlSW50ZXJ2YWwgPSAxMDAwIC8gdGhpcy5fZnBzO1xuICAgICAgICAgICAgdGhpcy5fY29udGV4dCA9IHd4LmdldE9wZW5EYXRhQ29udGV4dCgpO1xuICAgICAgICAgICAgLy8gcmVzZXQgc2hhcmVkQ2FudmFzIHdpZHRoIGFuZCBoZWlnaHRcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcblxuICAgICAgICAgICAgdGhpcy5fdGV4LnNldFByZW11bHRpcGx5QWxwaGEodHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLl90ZXguaW5pdFdpdGhFbGVtZW50KHNoYXJlZENhbnZhcyk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Nwcml0ZSA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgICAgICAgIGlmICghdGhpcy5fc3ByaXRlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3ByaXRlID0gdGhpcy5ub2RlLmFkZENvbXBvbmVudChjYy5TcHJpdGUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Nwcml0ZS5zcmNCbGVuZEZhY3RvciA9IGNjLm1hY3JvLkJsZW5kRmFjdG9yLk9ORTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3Nwcml0ZS5zcHJpdGVGcmFtZSA9IG5ldyBjYy5TcHJpdGVGcmFtZSh0aGlzLl90ZXgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbmFibGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXNldCBvcGVuIGRhdGEgY29udGV4dCBzaXplIGFuZCB2aWV3cG9ydFxuICAgICAqICEjemgg6YeN572u5byA5pS+5pWw5o2u5Z+f55qE5bC65a+45ZKM6KeG56qXXG4gICAgICogQG1ldGhvZCByZXNldFxuICAgICAqL1xuICAgIHJlc2V0ICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2NvbnRleHQpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU3ViQ29udGV4dFZpZXdwb3J0KCk7XG4gICAgICAgICAgICBsZXQgc2hhcmVkQ2FudmFzID0gdGhpcy5fY29udGV4dC5jYW52YXM7XG4gICAgICAgICAgICBpZiAoc2hhcmVkQ2FudmFzKSB7XG4gICAgICAgICAgICAgICAgc2hhcmVkQ2FudmFzLndpZHRoID0gdGhpcy5ub2RlLndpZHRoO1xuICAgICAgICAgICAgICAgIHNoYXJlZENhbnZhcy5oZWlnaHQgPSB0aGlzLm5vZGUuaGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uRW5hYmxlICgpIHtcbiAgICAgICAgdGhpcy5fcnVuU3ViQ29udGV4dE1haW5Mb29wKCk7XG4gICAgICAgIHRoaXMuX3JlZ2lzdGVyTm9kZUV2ZW50KCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVN1YkNvbnRleHRGcmFtZVJhdGUoKTtcbiAgICAgICAgdGhpcy51cGRhdGVTdWJDb250ZXh0Vmlld3BvcnQoKTtcbiAgICB9LFxuXG4gICAgb25EaXNhYmxlICgpIHtcbiAgICAgICAgdGhpcy5fdW5yZWdpc3Rlck5vZGVFdmVudCgpO1xuICAgICAgICB0aGlzLl9zdG9wU3ViQ29udGV4dE1haW5Mb29wKCk7XG4gICAgfSxcblxuICAgIHVwZGF0ZSAoZHQpIHtcbiAgICAgICAgbGV0IGNhbGxlZFVwZGF0ZU1hbm51YWxseSA9IChkdCA9PT0gdW5kZWZpbmVkKTtcbiAgICAgICAgaWYgKGNhbGxlZFVwZGF0ZU1hbm51YWxseSkge1xuICAgICAgICAgICAgdGhpcy5fY29udGV4dCAmJiB0aGlzLl9jb250ZXh0LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBmcm9tRW5naW5lOiB0cnVlLFxuICAgICAgICAgICAgICAgIGV2ZW50OiAnc3RlcCcsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVN1YkNvbnRleHRUZXh0dXJlKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICBsZXQgZGVsdGFUaW1lID0gKG5vdyAtIHRoaXMuX3VwZGF0ZWRUaW1lKTtcbiAgICAgICAgaWYgKGRlbHRhVGltZSA+PSB0aGlzLl91cGRhdGVJbnRlcnZhbCkge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlZFRpbWUgKz0gdGhpcy5fdXBkYXRlSW50ZXJ2YWw7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVTdWJDb250ZXh0VGV4dHVyZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91cGRhdGVTdWJDb250ZXh0VGV4dHVyZSAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fdGV4IHx8ICF0aGlzLl9jb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdGV4LmluaXRXaXRoRWxlbWVudCh0aGlzLl9jb250ZXh0LmNhbnZhcyk7XG4gICAgICAgIHRoaXMuX3Nwcml0ZS5fYWN0aXZhdGVNYXRlcmlhbCgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFVwZGF0ZSB0aGUgc3ViIGNvbnRleHQgdmlld3BvcnQgbWFudWFsbHksIGl0IHNob3VsZCBiZSBjYWxsZWQgd2hlbmV2ZXIgdGhlIG5vZGUncyBib3VuZGluZyBib3ggY2hhbmdlcy5cbiAgICAgKiAhI3poIOabtOaWsOW8gOaUvuaVsOaNruWfn+ebuOWvueS6juS4u+Wfn+eahCB2aWV3cG9ydO+8jOi/meS4quWHveaVsOW6lOivpeWcqOiKgueCueWMheWbtOebkuaUueWPmOaXtuaJi+WKqOiwg+eUqOOAglxuICAgICAqIEBtZXRob2QgdXBkYXRlU3ViQ29udGV4dFZpZXdwb3J0XG4gICAgICovXG4gICAgdXBkYXRlU3ViQ29udGV4dFZpZXdwb3J0ICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2NvbnRleHQpIHtcbiAgICAgICAgICAgIGxldCBib3ggPSB0aGlzLm5vZGUuZ2V0Qm91bmRpbmdCb3hUb1dvcmxkKCk7XG4gICAgICAgICAgICBsZXQgc3ggPSBjYy52aWV3Ll9zY2FsZVg7XG4gICAgICAgICAgICBsZXQgc3kgPSBjYy52aWV3Ll9zY2FsZVk7XG4gICAgICAgICAgICB0aGlzLl9jb250ZXh0LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBmcm9tRW5naW5lOiB0cnVlLFxuICAgICAgICAgICAgICAgIGV2ZW50OiAndmlld3BvcnQnLFxuICAgICAgICAgICAgICAgIHg6IGJveC54ICogc3ggKyBjYy52aWV3Ll92aWV3cG9ydFJlY3QueCxcbiAgICAgICAgICAgICAgICB5OiBib3gueSAqIHN5ICsgY2Mudmlldy5fdmlld3BvcnRSZWN0LnksXG4gICAgICAgICAgICAgICAgd2lkdGg6IGJveC53aWR0aCAqIHN4LFxuICAgICAgICAgICAgICAgIGhlaWdodDogYm94LmhlaWdodCAqIHN5XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfcmVnaXN0ZXJOb2RlRXZlbnQgKCkge1xuICAgICAgICB0aGlzLm5vZGUub24oJ3Bvc2l0aW9uLWNoYW5nZWQnLCB0aGlzLnVwZGF0ZVN1YkNvbnRleHRWaWV3cG9ydCwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vbignc2NhbGUtY2hhbmdlZCcsIHRoaXMudXBkYXRlU3ViQ29udGV4dFZpZXdwb3J0LCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdzaXplLWNoYW5nZWQnLCB0aGlzLnVwZGF0ZVN1YkNvbnRleHRWaWV3cG9ydCwgdGhpcyk7XG4gICAgfSxcblxuICAgIF91bnJlZ2lzdGVyTm9kZUV2ZW50ICgpIHtcbiAgICAgICAgdGhpcy5ub2RlLm9mZigncG9zaXRpb24tY2hhbmdlZCcsIHRoaXMudXBkYXRlU3ViQ29udGV4dFZpZXdwb3J0LCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9mZignc2NhbGUtY2hhbmdlZCcsIHRoaXMudXBkYXRlU3ViQ29udGV4dFZpZXdwb3J0LCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9mZignc2l6ZS1jaGFuZ2VkJywgdGhpcy51cGRhdGVTdWJDb250ZXh0Vmlld3BvcnQsIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfcnVuU3ViQ29udGV4dE1haW5Mb29wICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2NvbnRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbnRleHQucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIGZyb21FbmdpbmU6IHRydWUsXG4gICAgICAgICAgICAgICAgZXZlbnQ6ICdtYWluTG9vcCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfc3RvcFN1YkNvbnRleHRNYWluTG9vcCAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9jb250ZXh0KSB7XG4gICAgICAgICAgICB0aGlzLl9jb250ZXh0LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBmcm9tRW5naW5lOiB0cnVlLFxuICAgICAgICAgICAgICAgIGV2ZW50OiAnbWFpbkxvb3AnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBmYWxzZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91cGRhdGVTdWJDb250ZXh0RnJhbWVSYXRlICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2NvbnRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbnRleHQucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIGZyb21FbmdpbmU6IHRydWUsXG4gICAgICAgICAgICAgICAgZXZlbnQ6ICdmcmFtZVJhdGUnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLl9mcHMsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG59KTtcblxuY2MuV1hTdWJDb250ZXh0VmlldyA9IG1vZHVsZS5leHBvcnRzID0gV1hTdWJDb250ZXh0VmlldzsiXX0=