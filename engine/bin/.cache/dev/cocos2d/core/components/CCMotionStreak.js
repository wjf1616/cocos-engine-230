
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCMotionStreak.js';
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
var RenderComponent = require('../components/CCRenderComponent');

var Material = require('../assets/material/CCMaterial');

var textureUtil = require('../utils/texture-util');

var BlendFunc = require('../../core/utils/blend-func');
/**
 * !#en
 * cc.MotionStreak manages a Ribbon based on it's motion in absolute space.                 <br/>
 * You construct it with a fadeTime, minimum segment size, texture path, texture            <br/>
 * length and color. The fadeTime controls how long it takes each vertex in                 <br/>
 * the streak to fade out, the minimum segment size it how many pixels the                  <br/>
 * streak will move before adding a new ribbon segment, and the texture                     <br/>
 * length is the how many pixels the texture is stretched across. The texture               <br/>
 * is vertically aligned along the streak segment.
 * !#zh 运动轨迹，用于游戏对象的运动轨迹上实现拖尾渐隐效果。
 * @class MotionStreak
 * @extends Component
 * @uses BlendFunc
 */


var MotionStreak = cc.Class({
  name: 'cc.MotionStreak',
  // To avoid conflict with other render component, we haven't use ComponentUnderSG,
  // its implementation also requires some different approach:
  //   1.Needed a parent node to make motion streak's position global related.
  //   2.Need to update the position in each frame by itself because we don't know
  //     whether the global position have changed
  "extends": RenderComponent,
  mixins: [BlendFunc],
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.others/MotionStreak',
    help: 'i18n:COMPONENT.help_url.motionStreak',
    playOnFocus: true,
    executeInEditMode: true
  },
  ctor: function ctor() {
    this._points = [];
  },
  properties: {
    /**
     * !#en
     * !#zh 在编辑器模式下预览拖尾效果。
     * @property {Boolean} preview
     * @default false
     */
    preview: {
      "default": false,
      editorOnly: true,
      notify: CC_EDITOR && function () {
        this.reset();
      },
      animatable: false
    },

    /**
     * !#en The fade time to fade.
     * !#zh 拖尾的渐隐时间，以秒为单位。
     * @property fadeTime
     * @type {Number}
     * @example
     * motionStreak.fadeTime = 3;
     */
    _fadeTime: 1,
    fadeTime: {
      get: function get() {
        return this._fadeTime;
      },
      set: function set(value) {
        this._fadeTime = value;
        this.reset();
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.motionStreak.fadeTime'
    },

    /**
     * !#en The minimum segment size.
     * !#zh 拖尾之间最小距离。
     * @property minSeg
     * @type {Number}
     * @example
     * motionStreak.minSeg = 3;
     */
    _minSeg: 1,
    minSeg: {
      get: function get() {
        return this._minSeg;
      },
      set: function set(value) {
        this._minSeg = value;
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.motionStreak.minSeg'
    },

    /**
     * !#en The stroke's width.
     * !#zh 拖尾的宽度。
     * @property stroke
     * @type {Number}
     * @example
     * motionStreak.stroke = 64;
     */
    _stroke: 64,
    stroke: {
      get: function get() {
        return this._stroke;
      },
      set: function set(value) {
        this._stroke = value;
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.motionStreak.stroke'
    },

    /**
     * !#en The texture of the MotionStreak.
     * !#zh 拖尾的贴图。
     * @property texture
     * @type {Texture2D}
     * @example
     * motionStreak.texture = newTexture;
     */
    _texture: {
      "default": null,
      type: cc.Texture2D
    },
    texture: {
      get: function get() {
        return this._texture;
      },
      set: function set(value) {
        if (this._texture === value) return;
        this._texture = value;

        this._updateMaterial();
      },
      type: cc.Texture2D,
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.motionStreak.texture'
    },

    /**
     * !#en The color of the MotionStreak.
     * !#zh 拖尾的颜色
     * @property color
     * @type {Color}
     * @default cc.Color.WHITE
     * @example
     * motionStreak.color = new cc.Color(255, 255, 255);
     */
    _color: cc.Color.WHITE,
    color: {
      get: function get() {
        return this._color;
      },
      set: function set(value) {
        this._color = value;
      },
      type: cc.Color,
      tooltip: CC_DEV && 'i18n:COMPONENT.motionStreak.color'
    },

    /**
     * !#en The fast Mode.
     * !#zh 是否启用了快速模式。当启用快速模式，新的点会被更快地添加，但精度较低。
     * @property fastMode
     * @type {Boolean}
     * @default false
     * @example
     * motionStreak.fastMode = true;
     */
    _fastMode: false,
    fastMode: {
      get: function get() {
        return this._fastMode;
      },
      set: function set(value) {
        this._fastMode = value;
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.motionStreak.fastMode'
    }
  },
  onEnable: function onEnable() {
    this._super();

    this.reset();
  },
  _updateMaterial: function _updateMaterial() {
    var material = this._materials[0];
    material && material.setProperty('texture', this._texture);

    BlendFunc.prototype._updateMaterial.call(this);
  },
  onFocusInEditor: CC_EDITOR && function () {
    if (this.preview) {
      this.reset();
    }
  },
  onLostFocusInEditor: CC_EDITOR && function () {
    if (this.preview) {
      this.reset();
    }
  },

  /**
   * !#en Remove all living segments of the ribbon.
   * !#zh 删除当前所有的拖尾片段。
   * @method reset
   * @example
   * // Remove all living segments of the ribbon.
   * myMotionStreak.reset();
   */
  reset: function reset() {
    this._points.length = 0;
    this._assembler && this._assembler._renderData.clear();

    if (CC_EDITOR) {
      cc.engine.repaintInEditMode();
    }
  },
  update: function update(dt) {
    this._assembler && this._assembler.update(this, dt);
  }
});
cc.MotionStreak = module.exports = MotionStreak;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDTW90aW9uU3RyZWFrLmpzIl0sIm5hbWVzIjpbIlJlbmRlckNvbXBvbmVudCIsInJlcXVpcmUiLCJNYXRlcmlhbCIsInRleHR1cmVVdGlsIiwiQmxlbmRGdW5jIiwiTW90aW9uU3RyZWFrIiwiY2MiLCJDbGFzcyIsIm5hbWUiLCJtaXhpbnMiLCJlZGl0b3IiLCJDQ19FRElUT1IiLCJtZW51IiwiaGVscCIsInBsYXlPbkZvY3VzIiwiZXhlY3V0ZUluRWRpdE1vZGUiLCJjdG9yIiwiX3BvaW50cyIsInByb3BlcnRpZXMiLCJwcmV2aWV3IiwiZWRpdG9yT25seSIsIm5vdGlmeSIsInJlc2V0IiwiYW5pbWF0YWJsZSIsIl9mYWRlVGltZSIsImZhZGVUaW1lIiwiZ2V0Iiwic2V0IiwidmFsdWUiLCJ0b29sdGlwIiwiQ0NfREVWIiwiX21pblNlZyIsIm1pblNlZyIsIl9zdHJva2UiLCJzdHJva2UiLCJfdGV4dHVyZSIsInR5cGUiLCJUZXh0dXJlMkQiLCJ0ZXh0dXJlIiwiX3VwZGF0ZU1hdGVyaWFsIiwiX2NvbG9yIiwiQ29sb3IiLCJXSElURSIsImNvbG9yIiwiX2Zhc3RNb2RlIiwiZmFzdE1vZGUiLCJvbkVuYWJsZSIsIl9zdXBlciIsIm1hdGVyaWFsIiwiX21hdGVyaWFscyIsInNldFByb3BlcnR5IiwicHJvdG90eXBlIiwiY2FsbCIsIm9uRm9jdXNJbkVkaXRvciIsIm9uTG9zdEZvY3VzSW5FZGl0b3IiLCJsZW5ndGgiLCJfYXNzZW1ibGVyIiwiX3JlbmRlckRhdGEiLCJjbGVhciIsImVuZ2luZSIsInJlcGFpbnRJbkVkaXRNb2RlIiwidXBkYXRlIiwiZHQiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkEsSUFBTUEsZUFBZSxHQUFHQyxPQUFPLENBQUMsaUNBQUQsQ0FBL0I7O0FBQ0EsSUFBTUMsUUFBUSxHQUFHRCxPQUFPLENBQUMsK0JBQUQsQ0FBeEI7O0FB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QUFFQS9CLElBQUFBLFNBQVMsQ0FBQytDLFNBQVYsQ0FBb0JaLGVBQXBCLENBQW9DYSxJQUFwQyxDQUF5QyxJQUF6QztBQUNILEdBbkx1QjtBQXFMeEJDLEVBQUFBLGVBQWUsRUFBRTFDLFNBQVMsSUFBSSxZQUFZO0FBQ3RDLFFBQUksS0FBS1EsT0FBVCxFQUFrQjtBQUNkLFdBQUtHLEtBQUw7QUFDSDtBQUNKLEdBekx1QjtBQTJMeEJnQyxFQUFBQSxtQkFBbUIsRUFBRTNDLFNBQVMsSUFBSSxZQUFZO0FBQzFDLFFBQUksS0FBS1EsT0FBVCxFQUFrQjtBQUNkLFdBQUtHLEtBQUw7QUFDSDtBQUNKLEdBL0x1Qjs7QUFpTXhCOzs7Ozs7OztBQVFBQSxFQUFBQSxLQXpNd0IsbUJBeU1mO0FBQ0wsU0FBS0wsT0FBTCxDQUFhc0MsTUFBYixHQUFzQixDQUF0QjtBQUNBLFNBQUtDLFVBQUwsSUFBbUIsS0FBS0EsVUFBTCxDQUFnQkMsV0FBaEIsQ0FBNEJDLEtBQTVCLEVBQW5COztBQUNBLFFBQUkvQyxTQUFKLEVBQWU7QUFDWEwsTUFBQUEsRUFBRSxDQUFDcUQsTUFBSCxDQUFVQyxpQkFBVjtBQUNIO0FBQ0osR0EvTXVCO0FBaU54QkMsRUFBQUEsTUFqTndCLGtCQWlOaEJDLEVBak5nQixFQWlOWjtBQUNSLFNBQUtOLFVBQUwsSUFBbUIsS0FBS0EsVUFBTCxDQUFnQkssTUFBaEIsQ0FBdUIsSUFBdkIsRUFBNkJDLEVBQTdCLENBQW5CO0FBQ0g7QUFuTnVCLENBQVQsQ0FBbkI7QUFzTkF4RCxFQUFFLENBQUNELFlBQUgsR0FBa0IwRCxNQUFNLENBQUNDLE9BQVAsR0FBaUIzRCxZQUFuQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBSZW5kZXJDb21wb25lbnQgPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL0NDUmVuZGVyQ29tcG9uZW50Jyk7XG5jb25zdCBNYXRlcmlhbCA9IHJlcXVpcmUoJy4uL2Fzc2V0cy9tYXRlcmlhbC9DQ01hdGVyaWFsJyk7XG5jb25zdCB0ZXh0dXJlVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWxzL3RleHR1cmUtdXRpbCcpO1xuY29uc3QgQmxlbmRGdW5jID0gcmVxdWlyZSgnLi4vLi4vY29yZS91dGlscy9ibGVuZC1mdW5jJyk7XG5cbi8qKlxuICogISNlblxuICogY2MuTW90aW9uU3RyZWFrIG1hbmFnZXMgYSBSaWJib24gYmFzZWQgb24gaXQncyBtb3Rpb24gaW4gYWJzb2x1dGUgc3BhY2UuICAgICAgICAgICAgICAgICA8YnIvPlxuICogWW91IGNvbnN0cnVjdCBpdCB3aXRoIGEgZmFkZVRpbWUsIG1pbmltdW0gc2VnbWVudCBzaXplLCB0ZXh0dXJlIHBhdGgsIHRleHR1cmUgICAgICAgICAgICA8YnIvPlxuICogbGVuZ3RoIGFuZCBjb2xvci4gVGhlIGZhZGVUaW1lIGNvbnRyb2xzIGhvdyBsb25nIGl0IHRha2VzIGVhY2ggdmVydGV4IGluICAgICAgICAgICAgICAgICA8YnIvPlxuICogdGhlIHN0cmVhayB0byBmYWRlIG91dCwgdGhlIG1pbmltdW0gc2VnbWVudCBzaXplIGl0IGhvdyBtYW55IHBpeGVscyB0aGUgICAgICAgICAgICAgICAgICA8YnIvPlxuICogc3RyZWFrIHdpbGwgbW92ZSBiZWZvcmUgYWRkaW5nIGEgbmV3IHJpYmJvbiBzZWdtZW50LCBhbmQgdGhlIHRleHR1cmUgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICogbGVuZ3RoIGlzIHRoZSBob3cgbWFueSBwaXhlbHMgdGhlIHRleHR1cmUgaXMgc3RyZXRjaGVkIGFjcm9zcy4gVGhlIHRleHR1cmUgICAgICAgICAgICAgICA8YnIvPlxuICogaXMgdmVydGljYWxseSBhbGlnbmVkIGFsb25nIHRoZSBzdHJlYWsgc2VnbWVudC5cbiAqICEjemgg6L+Q5Yqo6L2o6L+577yM55So5LqO5ri45oiP5a+56LGh55qE6L+Q5Yqo6L2o6L+55LiK5a6e546w5ouW5bC+5riQ6ZqQ5pWI5p6c44CCXG4gKiBAY2xhc3MgTW90aW9uU3RyZWFrXG4gKiBAZXh0ZW5kcyBDb21wb25lbnRcbiAqIEB1c2VzIEJsZW5kRnVuY1xuICovXG52YXIgTW90aW9uU3RyZWFrID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5Nb3Rpb25TdHJlYWsnLFxuXG4gICAgLy8gVG8gYXZvaWQgY29uZmxpY3Qgd2l0aCBvdGhlciByZW5kZXIgY29tcG9uZW50LCB3ZSBoYXZlbid0IHVzZSBDb21wb25lbnRVbmRlclNHLFxuICAgIC8vIGl0cyBpbXBsZW1lbnRhdGlvbiBhbHNvIHJlcXVpcmVzIHNvbWUgZGlmZmVyZW50IGFwcHJvYWNoOlxuICAgIC8vICAgMS5OZWVkZWQgYSBwYXJlbnQgbm9kZSB0byBtYWtlIG1vdGlvbiBzdHJlYWsncyBwb3NpdGlvbiBnbG9iYWwgcmVsYXRlZC5cbiAgICAvLyAgIDIuTmVlZCB0byB1cGRhdGUgdGhlIHBvc2l0aW9uIGluIGVhY2ggZnJhbWUgYnkgaXRzZWxmIGJlY2F1c2Ugd2UgZG9uJ3Qga25vd1xuICAgIC8vICAgICB3aGV0aGVyIHRoZSBnbG9iYWwgcG9zaXRpb24gaGF2ZSBjaGFuZ2VkXG4gICAgZXh0ZW5kczogUmVuZGVyQ29tcG9uZW50LFxuICAgIG1peGluczogW0JsZW5kRnVuY10sXG5cbiAgICBlZGl0b3I6IENDX0VESVRPUiAmJiB7XG4gICAgICAgIG1lbnU6ICdpMThuOk1BSU5fTUVOVS5jb21wb25lbnQub3RoZXJzL01vdGlvblN0cmVhaycsXG4gICAgICAgIGhlbHA6ICdpMThuOkNPTVBPTkVOVC5oZWxwX3VybC5tb3Rpb25TdHJlYWsnLFxuICAgICAgICBwbGF5T25Gb2N1czogdHJ1ZSxcbiAgICAgICAgZXhlY3V0ZUluRWRpdE1vZGU6IHRydWVcbiAgICB9LFxuXG4gICAgY3RvciAoKSB7XG4gICAgICAgIHRoaXMuX3BvaW50cyA9IFtdO1xuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqICEjemgg5Zyo57yW6L6R5Zmo5qih5byP5LiL6aKE6KeI5ouW5bC+5pWI5p6c44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gcHJldmlld1xuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgcHJldmlldzoge1xuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgICBlZGl0b3JPbmx5OiB0cnVlLFxuICAgICAgICAgICAgbm90aWZ5OiBDQ19FRElUT1IgJiYgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBmYWRlIHRpbWUgdG8gZmFkZS5cbiAgICAgICAgICogISN6aCDmi5blsL7nmoTmuJDpmpDml7bpl7TvvIzku6Xnp5LkuLrljZXkvY3jgIJcbiAgICAgICAgICogQHByb3BlcnR5IGZhZGVUaW1lXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIG1vdGlvblN0cmVhay5mYWRlVGltZSA9IDM7XG4gICAgICAgICAqL1xuICAgICAgICBfZmFkZVRpbWU6IDEsXG4gICAgICAgIGZhZGVUaW1lOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9mYWRlVGltZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZmFkZVRpbWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULm1vdGlvblN0cmVhay5mYWRlVGltZSdcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgbWluaW11bSBzZWdtZW50IHNpemUuXG4gICAgICAgICAqICEjemgg5ouW5bC+5LmL6Ze05pyA5bCP6Led56a744CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBtaW5TZWdcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogbW90aW9uU3RyZWFrLm1pblNlZyA9IDM7XG4gICAgICAgICAqL1xuICAgICAgICBfbWluU2VnOiAxLFxuICAgICAgICBtaW5TZWc6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21pblNlZztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWluU2VnID0gdmFsdWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULm1vdGlvblN0cmVhay5taW5TZWcnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIHN0cm9rZSdzIHdpZHRoLlxuICAgICAgICAgKiAhI3poIOaLluWwvueahOWuveW6puOAglxuICAgICAgICAgKiBAcHJvcGVydHkgc3Ryb2tlXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIG1vdGlvblN0cmVhay5zdHJva2UgPSA2NDtcbiAgICAgICAgICovXG4gICAgICAgIF9zdHJva2U6IDY0LFxuICAgICAgICBzdHJva2U6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0cm9rZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3Ryb2tlID0gdmFsdWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULm1vdGlvblN0cmVhay5zdHJva2UnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIHRleHR1cmUgb2YgdGhlIE1vdGlvblN0cmVhay5cbiAgICAgICAgICogISN6aCDmi5blsL7nmoTotLTlm77jgIJcbiAgICAgICAgICogQHByb3BlcnR5IHRleHR1cmVcbiAgICAgICAgICogQHR5cGUge1RleHR1cmUyRH1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogbW90aW9uU3RyZWFrLnRleHR1cmUgPSBuZXdUZXh0dXJlO1xuICAgICAgICAgKi9cbiAgICAgICAgX3RleHR1cmU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5UZXh0dXJlMkRcbiAgICAgICAgfSxcbiAgICAgICAgdGV4dHVyZToge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdGV4dHVyZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3RleHR1cmUgPT09IHZhbHVlKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB0aGlzLl90ZXh0dXJlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlTWF0ZXJpYWwoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBjYy5UZXh0dXJlMkQsXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubW90aW9uU3RyZWFrLnRleHR1cmUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIGNvbG9yIG9mIHRoZSBNb3Rpb25TdHJlYWsuXG4gICAgICAgICAqICEjemgg5ouW5bC+55qE6aKc6ImyXG4gICAgICAgICAqIEBwcm9wZXJ0eSBjb2xvclxuICAgICAgICAgKiBAdHlwZSB7Q29sb3J9XG4gICAgICAgICAqIEBkZWZhdWx0IGNjLkNvbG9yLldISVRFXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIG1vdGlvblN0cmVhay5jb2xvciA9IG5ldyBjYy5Db2xvcigyNTUsIDI1NSwgMjU1KTtcbiAgICAgICAgICovXG4gICAgICAgIF9jb2xvcjogY2MuQ29sb3IuV0hJVEUsXG4gICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb2xvcjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY29sb3IgPSB2YWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBjYy5Db2xvcixcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubW90aW9uU3RyZWFrLmNvbG9yJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBmYXN0IE1vZGUuXG4gICAgICAgICAqICEjemgg5piv5ZCm5ZCv55So5LqG5b+r6YCf5qih5byP44CC5b2T5ZCv55So5b+r6YCf5qih5byP77yM5paw55qE54K55Lya6KKr5pu05b+r5Zyw5re75Yqg77yM5L2G57K+5bqm6L6D5L2O44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBmYXN0TW9kZVxuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogbW90aW9uU3RyZWFrLmZhc3RNb2RlID0gdHJ1ZTtcbiAgICAgICAgICovXG4gICAgICAgIF9mYXN0TW9kZTogZmFsc2UsXG4gICAgICAgIGZhc3RNb2RlOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9mYXN0TW9kZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZmFzdE1vZGUgPSB2YWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubW90aW9uU3RyZWFrLmZhc3RNb2RlJ1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uRW5hYmxlICgpIHtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlTWF0ZXJpYWwgKCkge1xuICAgICAgICBsZXQgbWF0ZXJpYWwgPSB0aGlzLl9tYXRlcmlhbHNbMF07XG4gICAgICAgIG1hdGVyaWFsICYmIG1hdGVyaWFsLnNldFByb3BlcnR5KCd0ZXh0dXJlJywgdGhpcy5fdGV4dHVyZSk7XG5cbiAgICAgICAgQmxlbmRGdW5jLnByb3RvdHlwZS5fdXBkYXRlTWF0ZXJpYWwuY2FsbCh0aGlzKTtcbiAgICB9LFxuXG4gICAgb25Gb2N1c0luRWRpdG9yOiBDQ19FRElUT1IgJiYgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5wcmV2aWV3KSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25Mb3N0Rm9jdXNJbkVkaXRvcjogQ0NfRURJVE9SICYmIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMucHJldmlldykge1xuICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmVtb3ZlIGFsbCBsaXZpbmcgc2VnbWVudHMgb2YgdGhlIHJpYmJvbi5cbiAgICAgKiAhI3poIOWIoOmZpOW9k+WJjeaJgOacieeahOaLluWwvueJh+auteOAglxuICAgICAqIEBtZXRob2QgcmVzZXRcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIC8vIFJlbW92ZSBhbGwgbGl2aW5nIHNlZ21lbnRzIG9mIHRoZSByaWJib24uXG4gICAgICogbXlNb3Rpb25TdHJlYWsucmVzZXQoKTtcbiAgICAgKi9cbiAgICByZXNldCAoKSB7XG4gICAgICAgIHRoaXMuX3BvaW50cy5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLl9hc3NlbWJsZXIgJiYgdGhpcy5fYXNzZW1ibGVyLl9yZW5kZXJEYXRhLmNsZWFyKCk7XG4gICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIGNjLmVuZ2luZS5yZXBhaW50SW5FZGl0TW9kZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVwZGF0ZSAoZHQpIHtcbiAgICAgICAgdGhpcy5fYXNzZW1ibGVyICYmIHRoaXMuX2Fzc2VtYmxlci51cGRhdGUodGhpcywgZHQpO1xuICAgIH1cbn0pO1xuXG5jYy5Nb3Rpb25TdHJlYWsgPSBtb2R1bGUuZXhwb3J0cyA9IE1vdGlvblN0cmVhazsiXX0=