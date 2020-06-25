
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/SwanSubContextView.js';
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
 * !#en SwanSubContextView is a view component which controls open data context viewport in WeChat game platform.<br/>
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
 * !#zh SwanSubContextView 可以用来控制百度小游戏平台开放数据域在主域中的视窗的位置。<br/>
 * 这个组件的节点尺寸决定了开放数据域内容在主域中的尺寸，整个开放数据域会被缩放到节点的包围盒范围内。<br/>
 * 在这个组件的控制下，用户可以更自由得控制开放数据域：<br/>
 * 1. 子域中可以使用独立的设计分辨率和适配模式<br/>
 * 2. 子域区域尺寸可以缩小到只容纳内容即可<br/>
 * 3. 子域的分辨率也可以被放大，以便获得更清晰的显示效果<br/>
 * 4. 用户输入坐标会被自动转换到正确的子域视窗中<br/>
 * 5. 子域内容贴图的更新由组件负责，用户不需要处理<br/>
 * 唯一需要注意的是，当子域节点的包围盒发生改变时，开发者需要使用 `updateSubContextViewport` 来手动更新子域视窗。
 * @class SwanSubContextView
 * @extends Component
 */


var SwanSubContextView = cc.Class({
  name: 'cc.SwanSubContextView',
  "extends": Component,
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.others/SwanSubContextView',
    help: 'i18n:COMPONENT.help_url.swan_subcontext_view'
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
      tooltip: CC_DEV && 'i18n:COMPONENT.swan_subcontext_view.fps'
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
    if (swan.getOpenDataContext) {
      this._updateInterval = 1000 / this._fps;
      this._context = swan.getOpenDataContext();
      var sharedCanvas = this._context.canvas;

      if (sharedCanvas) {
        sharedCanvas.width = this.node.width;
        sharedCanvas.height = this.node.height;
      }

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
cc.SwanSubContextView = module.exports = SwanSubContextView;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN3YW5TdWJDb250ZXh0Vmlldy5qcyJdLCJuYW1lcyI6WyJDb21wb25lbnQiLCJyZXF1aXJlIiwiU3dhblN1YkNvbnRleHRWaWV3IiwiY2MiLCJDbGFzcyIsIm5hbWUiLCJlZGl0b3IiLCJDQ19FRElUT1IiLCJtZW51IiwiaGVscCIsInByb3BlcnRpZXMiLCJfZnBzIiwiZnBzIiwiZ2V0Iiwic2V0IiwidmFsdWUiLCJfdXBkYXRlSW50ZXJ2YWwiLCJfdXBkYXRlU3ViQ29udGV4dEZyYW1lUmF0ZSIsInRvb2x0aXAiLCJDQ19ERVYiLCJjdG9yIiwiX3Nwcml0ZSIsIl90ZXgiLCJUZXh0dXJlMkQiLCJfY29udGV4dCIsIl91cGRhdGVkVGltZSIsInBlcmZvcm1hbmNlIiwibm93Iiwib25Mb2FkIiwic3dhbiIsImdldE9wZW5EYXRhQ29udGV4dCIsInNoYXJlZENhbnZhcyIsImNhbnZhcyIsIndpZHRoIiwibm9kZSIsImhlaWdodCIsInNldFByZW11bHRpcGx5QWxwaGEiLCJpbml0V2l0aEVsZW1lbnQiLCJnZXRDb21wb25lbnQiLCJTcHJpdGUiLCJhZGRDb21wb25lbnQiLCJzcmNCbGVuZEZhY3RvciIsIm1hY3JvIiwiQmxlbmRGYWN0b3IiLCJPTkUiLCJzcHJpdGVGcmFtZSIsIlNwcml0ZUZyYW1lIiwiZW5hYmxlZCIsIm9uRW5hYmxlIiwiX3J1blN1YkNvbnRleHRNYWluTG9vcCIsIl9yZWdpc3Rlck5vZGVFdmVudCIsInVwZGF0ZVN1YkNvbnRleHRWaWV3cG9ydCIsIm9uRGlzYWJsZSIsIl91bnJlZ2lzdGVyTm9kZUV2ZW50IiwiX3N0b3BTdWJDb250ZXh0TWFpbkxvb3AiLCJ1cGRhdGUiLCJkdCIsImNhbGxlZFVwZGF0ZU1hbm51YWxseSIsInVuZGVmaW5lZCIsInBvc3RNZXNzYWdlIiwiZnJvbUVuZ2luZSIsImV2ZW50IiwiX3VwZGF0ZVN1YkNvbnRleHRUZXh0dXJlIiwiZGVsdGFUaW1lIiwiX2FjdGl2YXRlTWF0ZXJpYWwiLCJib3giLCJnZXRCb3VuZGluZ0JveFRvV29ybGQiLCJzeCIsInZpZXciLCJfc2NhbGVYIiwic3kiLCJfc2NhbGVZIiwieCIsIl92aWV3cG9ydFJlY3QiLCJ5Iiwib24iLCJvZmYiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxJQUFNQSxTQUFTLEdBQUdDLE9BQU8sQ0FBQyxlQUFELENBQXpCO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBLElBQUlDLGtCQUFrQixHQUFHQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUM5QkMsRUFBQUEsSUFBSSxFQUFFLHVCQUR3QjtBQUU5QixhQUFTTCxTQUZxQjtBQUk5Qk0sRUFBQUEsTUFBTSxFQUFFQyxTQUFTLElBQUk7QUFDakJDLElBQUFBLElBQUksRUFBRSxvREFEVztBQUVqQkMsSUFBQUEsSUFBSSxFQUFFO0FBRlcsR0FKUztBQVM5QkMsRUFBQUEsVUFBVSxFQUFFO0FBQ1JDLElBQUFBLElBQUksRUFBRSxFQURFO0FBR1JDLElBQUFBLEdBQUcsRUFBRTtBQUNEQyxNQUFBQSxHQURDLGlCQUNNO0FBQ0gsZUFBTyxLQUFLRixJQUFaO0FBQ0gsT0FIQTtBQUlERyxNQUFBQSxHQUpDLGVBSUlDLEtBSkosRUFJVztBQUNSLFlBQUksS0FBS0osSUFBTCxLQUFjSSxLQUFsQixFQUF5QjtBQUNyQjtBQUNIOztBQUNELGFBQUtKLElBQUwsR0FBWUksS0FBWjtBQUNBLGFBQUtDLGVBQUwsR0FBdUIsSUFBSUQsS0FBM0I7O0FBQ0EsYUFBS0UsMEJBQUw7QUFDSCxPQVhBO0FBWURDLE1BQUFBLE9BQU8sRUFBRUMsTUFBTSxJQUFJO0FBWmxCO0FBSEcsR0FUa0I7QUE0QjlCQyxFQUFBQSxJQTVCOEIsa0JBNEJ0QjtBQUNKLFNBQUtDLE9BQUwsR0FBZSxJQUFmO0FBQ0EsU0FBS0MsSUFBTCxHQUFZLElBQUluQixFQUFFLENBQUNvQixTQUFQLEVBQVo7QUFDQSxTQUFLQyxRQUFMLEdBQWdC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LEdBQWlCNUUsa0JBQXpDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCcuL0NDQ29tcG9uZW50Jyk7XG5cbi8qKlxuICogISNlbiBTd2FuU3ViQ29udGV4dFZpZXcgaXMgYSB2aWV3IGNvbXBvbmVudCB3aGljaCBjb250cm9scyBvcGVuIGRhdGEgY29udGV4dCB2aWV3cG9ydCBpbiBXZUNoYXQgZ2FtZSBwbGF0Zm9ybS48YnIvPlxuICogVGhlIGNvbXBvbmVudCdzIG5vZGUgc2l6ZSBkZWNpZGUgdGhlIHZpZXdwb3J0IG9mIHRoZSBzdWIgY29udGV4dCBjb250ZW50IGluIG1haW4gY29udGV4dCwgXG4gKiB0aGUgZW50aXJlIHN1YiBjb250ZXh0IHRleHR1cmUgd2lsbCBiZSBzY2FsZWQgdG8gdGhlIG5vZGUncyBib3VuZGluZyBib3ggYXJlYS48YnIvPlxuICogVGhpcyBjb21wb25lbnQgcHJvdmlkZXMgbXVsdGlwbGUgaW1wb3J0YW50IGZlYXR1cmVzOjxici8+XG4gKiAxLiBTdWIgY29udGV4dCBjb3VsZCB1c2UgaXRzIG93biByZXNvbHV0aW9uIHNpemUgYW5kIHBvbGljeS48YnIvPlxuICogMi4gU3ViIGNvbnRleHQgY291bGQgYmUgbWluaXplZCB0byBzbWFsbGVzdCBzaXplIGl0IG5lZWRlZC48YnIvPlxuICogMy4gUmVzb2x1dGlvbiBvZiBzdWIgY29udGV4dCBjb250ZW50IGNvdWxkIGJlIGluY3JlYXNlZC48YnIvPlxuICogNC4gVXNlciB0b3VjaCBpbnB1dCBpcyB0cmFuc2Zvcm1lZCB0byB0aGUgY29ycmVjdCB2aWV3cG9ydC48YnIvPlxuICogNS4gVGV4dHVyZSB1cGRhdGUgaXMgaGFuZGxlZCBieSB0aGlzIGNvbXBvbmVudC4gVXNlciBkb24ndCBuZWVkIHRvIHdvcnJ5Ljxici8+XG4gKiBPbmUgaW1wb3J0YW50IHRoaW5nIHRvIGJlIG5vdGVkLCB3aGVuZXZlciB0aGUgbm9kZSdzIGJvdW5kaW5nIGJveCBjaGFuZ2UsIFxuICogeW91IG5lZWQgdG8gbWFudWFsbHkgcmVzZXQgdGhlIHZpZXdwb3J0IG9mIHN1YiBjb250ZXh0IHVzaW5nIHVwZGF0ZVN1YkNvbnRleHRWaWV3cG9ydC5cbiAqICEjemggU3dhblN1YkNvbnRleHRWaWV3IOWPr+S7peeUqOadpeaOp+WItueZvuW6puWwj+a4uOaIj+W5s+WPsOW8gOaUvuaVsOaNruWfn+WcqOS4u+Wfn+S4reeahOinhueql+eahOS9jee9ruOAgjxici8+XG4gKiDov5nkuKrnu4Tku7bnmoToioLngrnlsLrlr7jlhrPlrprkuoblvIDmlL7mlbDmja7ln5/lhoXlrrnlnKjkuLvln5/kuK3nmoTlsLrlr7jvvIzmlbTkuKrlvIDmlL7mlbDmja7ln5/kvJrooqvnvKnmlL7liLDoioLngrnnmoTljIXlm7Tnm5LojIPlm7TlhoXjgII8YnIvPlxuICog5Zyo6L+Z5Liq57uE5Lu255qE5o6n5Yi25LiL77yM55So5oi35Y+v5Lul5pu06Ieq55Sx5b6X5o6n5Yi25byA5pS+5pWw5o2u5Z+f77yaPGJyLz5cbiAqIDEuIOWtkOWfn+S4reWPr+S7peS9v+eUqOeLrOeri+eahOiuvuiuoeWIhui+qOeOh+WSjOmAgumFjeaooeW8jzxici8+XG4gKiAyLiDlrZDln5/ljLrln5/lsLrlr7jlj6/ku6XnvKnlsI/liLDlj6rlrrnnurPlhoXlrrnljbPlj688YnIvPlxuICogMy4g5a2Q5Z+f55qE5YiG6L6o546H5Lmf5Y+v5Lul6KKr5pS+5aSn77yM5Lul5L6/6I635b6X5pu05riF5pmw55qE5pi+56S65pWI5p6cPGJyLz5cbiAqIDQuIOeUqOaIt+i+k+WFpeWdkOagh+S8muiiq+iHquWKqOi9rOaNouWIsOato+ehrueahOWtkOWfn+inhueql+S4rTxici8+XG4gKiA1LiDlrZDln5/lhoXlrrnotLTlm77nmoTmm7TmlrDnlLHnu4Tku7botJ/otKPvvIznlKjmiLfkuI3pnIDopoHlpITnkIY8YnIvPlxuICog5ZSv5LiA6ZyA6KaB5rOo5oSP55qE5piv77yM5b2T5a2Q5Z+f6IqC54K555qE5YyF5Zu055uS5Y+R55Sf5pS55Y+Y5pe277yM5byA5Y+R6ICF6ZyA6KaB5L2/55SoIGB1cGRhdGVTdWJDb250ZXh0Vmlld3BvcnRgIOadpeaJi+WKqOabtOaWsOWtkOWfn+inhueql+OAglxuICogQGNsYXNzIFN3YW5TdWJDb250ZXh0Vmlld1xuICogQGV4dGVuZHMgQ29tcG9uZW50XG4gKi9cblxubGV0IFN3YW5TdWJDb250ZXh0VmlldyA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuU3dhblN1YkNvbnRleHRWaWV3JyxcbiAgICBleHRlbmRzOiBDb21wb25lbnQsXG5cbiAgICBlZGl0b3I6IENDX0VESVRPUiAmJiB7XG4gICAgICAgIG1lbnU6ICdpMThuOk1BSU5fTUVOVS5jb21wb25lbnQub3RoZXJzL1N3YW5TdWJDb250ZXh0VmlldycsXG4gICAgICAgIGhlbHA6ICdpMThuOkNPTVBPTkVOVC5oZWxwX3VybC5zd2FuX3N1YmNvbnRleHRfdmlldydcbiAgICB9LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBfZnBzOiA2MCxcblxuICAgICAgICBmcHM6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZwcztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2ZwcyA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9mcHMgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVJbnRlcnZhbCA9IDEgLyB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVTdWJDb250ZXh0RnJhbWVSYXRlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5zd2FuX3N1YmNvbnRleHRfdmlldy5mcHMnXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY3RvciAoKSB7XG4gICAgICAgIHRoaXMuX3Nwcml0ZSA9IG51bGw7XG4gICAgICAgIHRoaXMuX3RleCA9IG5ldyBjYy5UZXh0dXJlMkQoKTtcbiAgICAgICAgdGhpcy5fY29udGV4dCA9IG51bGw7XG4gICAgICAgIHRoaXMuX3VwZGF0ZWRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUludGVydmFsID0gMDtcbiAgICB9LFxuXG4gICAgb25Mb2FkICgpIHtcbiAgICAgICAgLy8gU2V0dXAgc3ViY29udGV4dCBjYW52YXMgc2l6ZVxuICAgICAgICBpZiAoc3dhbi5nZXRPcGVuRGF0YUNvbnRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUludGVydmFsID0gMTAwMCAvIHRoaXMuX2ZwcztcbiAgICAgICAgICAgIHRoaXMuX2NvbnRleHQgPSBzd2FuLmdldE9wZW5EYXRhQ29udGV4dCgpO1xuICAgICAgICAgICAgbGV0IHNoYXJlZENhbnZhcyA9IHRoaXMuX2NvbnRleHQuY2FudmFzO1xuICAgICAgICAgICAgaWYgKHNoYXJlZENhbnZhcykge1xuICAgICAgICAgICAgICAgIHNoYXJlZENhbnZhcy53aWR0aCA9IHRoaXMubm9kZS53aWR0aDtcbiAgICAgICAgICAgICAgICBzaGFyZWRDYW52YXMuaGVpZ2h0ID0gdGhpcy5ub2RlLmhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3RleC5zZXRQcmVtdWx0aXBseUFscGhhKHRydWUpO1xuICAgICAgICAgICAgdGhpcy5fdGV4LmluaXRXaXRoRWxlbWVudChzaGFyZWRDYW52YXMpO1xuXG4gICAgICAgICAgICB0aGlzLl9zcHJpdGUgPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX3Nwcml0ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3Nwcml0ZSA9IHRoaXMubm9kZS5hZGRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zcHJpdGUuc3JjQmxlbmRGYWN0b3IgPSBjYy5tYWNyby5CbGVuZEZhY3Rvci5PTkU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9zcHJpdGUuc3ByaXRlRnJhbWUgPSBuZXcgY2MuU3ByaXRlRnJhbWUodGhpcy5fdGV4KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uRW5hYmxlICgpIHtcbiAgICAgICAgdGhpcy5fcnVuU3ViQ29udGV4dE1haW5Mb29wKCk7XG4gICAgICAgIHRoaXMuX3JlZ2lzdGVyTm9kZUV2ZW50KCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVN1YkNvbnRleHRGcmFtZVJhdGUoKTtcbiAgICAgICAgdGhpcy51cGRhdGVTdWJDb250ZXh0Vmlld3BvcnQoKTtcbiAgICB9LFxuXG4gICAgb25EaXNhYmxlICgpIHtcbiAgICAgICAgdGhpcy5fdW5yZWdpc3Rlck5vZGVFdmVudCgpO1xuICAgICAgICB0aGlzLl9zdG9wU3ViQ29udGV4dE1haW5Mb29wKCk7XG4gICAgfSxcblxuICAgIHVwZGF0ZSAoZHQpIHtcbiAgICAgICAgbGV0IGNhbGxlZFVwZGF0ZU1hbm51YWxseSA9IChkdCA9PT0gdW5kZWZpbmVkKTtcbiAgICAgICAgaWYgKGNhbGxlZFVwZGF0ZU1hbm51YWxseSkge1xuICAgICAgICAgICAgdGhpcy5fY29udGV4dCAmJiB0aGlzLl9jb250ZXh0LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBmcm9tRW5naW5lOiB0cnVlLFxuICAgICAgICAgICAgICAgIGV2ZW50OiAnc3RlcCcsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVN1YkNvbnRleHRUZXh0dXJlKCk7ICAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBub3cgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgbGV0IGRlbHRhVGltZSA9IChub3cgLSB0aGlzLl91cGRhdGVkVGltZSk7XG4gICAgICAgIGlmIChkZWx0YVRpbWUgPj0gdGhpcy5fdXBkYXRlSW50ZXJ2YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZWRUaW1lICs9IHRoaXMuX3VwZGF0ZUludGVydmFsO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlU3ViQ29udGV4dFRleHR1cmUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfdXBkYXRlU3ViQ29udGV4dFRleHR1cmUgKCkge1xuICAgICAgICBpZiAoIXRoaXMuX3RleCB8fCAhdGhpcy5fY29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3RleC5pbml0V2l0aEVsZW1lbnQodGhpcy5fY29udGV4dC5jYW52YXMpO1xuICAgICAgICB0aGlzLl9zcHJpdGUuX2FjdGl2YXRlTWF0ZXJpYWwoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBVcGRhdGUgdGhlIHN1YiBjb250ZXh0IHZpZXdwb3J0IG1hbnVhbGx5LCBpdCBzaG91bGQgYmUgY2FsbGVkIHdoZW5ldmVyIHRoZSBub2RlJ3MgYm91bmRpbmcgYm94IGNoYW5nZXMuXG4gICAgICogISN6aCDmm7TmlrDlvIDmlL7mlbDmja7ln5/nm7jlr7nkuo7kuLvln5/nmoQgdmlld3BvcnTvvIzov5nkuKrlh73mlbDlupTor6XlnKjoioLngrnljIXlm7Tnm5LmlLnlj5jml7bmiYvliqjosIPnlKjjgIJcbiAgICAgKiBAbWV0aG9kIHVwZGF0ZVN1YkNvbnRleHRWaWV3cG9ydFxuICAgICAqL1xuICAgIHVwZGF0ZVN1YkNvbnRleHRWaWV3cG9ydCAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9jb250ZXh0KSB7XG4gICAgICAgICAgICBsZXQgYm94ID0gdGhpcy5ub2RlLmdldEJvdW5kaW5nQm94VG9Xb3JsZCgpO1xuICAgICAgICAgICAgbGV0IHN4ID0gY2Mudmlldy5fc2NhbGVYO1xuICAgICAgICAgICAgbGV0IHN5ID0gY2Mudmlldy5fc2NhbGVZO1xuICAgICAgICAgICAgdGhpcy5fY29udGV4dC5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgZnJvbUVuZ2luZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBldmVudDogJ3ZpZXdwb3J0JyxcbiAgICAgICAgICAgICAgICB4OiBib3gueCAqIHN4ICsgY2Mudmlldy5fdmlld3BvcnRSZWN0LngsXG4gICAgICAgICAgICAgICAgeTogYm94LnkgKiBzeSArIGNjLnZpZXcuX3ZpZXdwb3J0UmVjdC55LFxuICAgICAgICAgICAgICAgIHdpZHRoOiBib3gud2lkdGggKiBzeCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IGJveC5oZWlnaHQgKiBzeVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3JlZ2lzdGVyTm9kZUV2ZW50ICgpIHtcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdwb3NpdGlvbi1jaGFuZ2VkJywgdGhpcy51cGRhdGVTdWJDb250ZXh0Vmlld3BvcnQsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub24oJ3NjYWxlLWNoYW5nZWQnLCB0aGlzLnVwZGF0ZVN1YkNvbnRleHRWaWV3cG9ydCwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vbignc2l6ZS1jaGFuZ2VkJywgdGhpcy51cGRhdGVTdWJDb250ZXh0Vmlld3BvcnQsIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfdW5yZWdpc3Rlck5vZGVFdmVudCAoKSB7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoJ3Bvc2l0aW9uLWNoYW5nZWQnLCB0aGlzLnVwZGF0ZVN1YkNvbnRleHRWaWV3cG9ydCwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoJ3NjYWxlLWNoYW5nZWQnLCB0aGlzLnVwZGF0ZVN1YkNvbnRleHRWaWV3cG9ydCwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoJ3NpemUtY2hhbmdlZCcsIHRoaXMudXBkYXRlU3ViQ29udGV4dFZpZXdwb3J0LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX3J1blN1YkNvbnRleHRNYWluTG9vcCAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9jb250ZXh0KSB7XG4gICAgICAgICAgICB0aGlzLl9jb250ZXh0LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBmcm9tRW5naW5lOiB0cnVlLFxuICAgICAgICAgICAgICAgIGV2ZW50OiAnbWFpbkxvb3AnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3N0b3BTdWJDb250ZXh0TWFpbkxvb3AgKCkge1xuICAgICAgICBpZiAodGhpcy5fY29udGV4dCkge1xuICAgICAgICAgICAgdGhpcy5fY29udGV4dC5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgZnJvbUVuZ2luZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBldmVudDogJ21haW5Mb29wJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogZmFsc2UsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfdXBkYXRlU3ViQ29udGV4dEZyYW1lUmF0ZSAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9jb250ZXh0KSB7XG4gICAgICAgICAgICB0aGlzLl9jb250ZXh0LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBmcm9tRW5naW5lOiB0cnVlLFxuICAgICAgICAgICAgICAgIGV2ZW50OiAnZnJhbWVSYXRlJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5fZnBzLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxufSk7XG5cbmNjLlN3YW5TdWJDb250ZXh0VmlldyA9IG1vZHVsZS5leHBvcnRzID0gU3dhblN1YkNvbnRleHRWaWV3OyJdfQ==