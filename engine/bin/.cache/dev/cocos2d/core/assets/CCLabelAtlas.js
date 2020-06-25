
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/CCLabelAtlas.js';
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
 * @module cc
 */

/**
 * !#en Class for LabelAtlas handling.
 * !#zh 艺术数字字体资源类。
 * @class LabelAtlas
 * @extends BitmapFont
 *
 */
var LabelAtlas = cc.Class({
  name: 'cc.LabelAtlas',
  "extends": cc.BitmapFont,
  onLoad: function onLoad() {
    if (!this.spriteFrame) {
      cc.warnID(9100, this.name);
      return;
    }

    if (!this._fntConfig) {
      cc.warnID(9101, this.name);
      return;
    }

    this._super();
  }
});
cc.LabelAtlas = LabelAtlas;
module.exports = LabelAtlas;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDTGFiZWxBdGxhcy5qcyJdLCJuYW1lcyI6WyJMYWJlbEF0bGFzIiwiY2MiLCJDbGFzcyIsIm5hbWUiLCJCaXRtYXBGb250Iiwib25Mb2FkIiwic3ByaXRlRnJhbWUiLCJ3YXJuSUQiLCJfZm50Q29uZmlnIiwiX3N1cGVyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQTs7OztBQUdBOzs7Ozs7O0FBT0EsSUFBSUEsVUFBVSxHQUFHQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUN0QkMsRUFBQUEsSUFBSSxFQUFFLGVBRGdCO0FBRXRCLGFBQVNGLEVBQUUsQ0FBQ0csVUFGVTtBQUl0QkMsRUFBQUEsTUFKc0Isb0JBSVo7QUFDTixRQUFJLENBQUMsS0FBS0MsV0FBVixFQUF1QjtBQUNuQkwsTUFBQUEsRUFBRSxDQUFDTSxNQUFILENBQVUsSUFBVixFQUFnQixLQUFLSixJQUFyQjtBQUNBO0FBQ0g7O0FBQ0QsUUFBSSxDQUFDLEtBQUtLLFVBQVYsRUFBc0I7QUFDbEJQLE1BQUFBLEVBQUUsQ0FBQ00sTUFBSCxDQUFVLElBQVYsRUFBZ0IsS0FBS0osSUFBckI7QUFDQTtBQUNIOztBQUNELFNBQUtNLE1BQUw7QUFDSDtBQWRxQixDQUFULENBQWpCO0FBa0JBUixFQUFFLENBQUNELFVBQUgsR0FBZ0JBLFVBQWhCO0FBQ0FVLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQlgsVUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qKlxuICogQG1vZHVsZSBjY1xuICovXG4vKipcbiAqICEjZW4gQ2xhc3MgZm9yIExhYmVsQXRsYXMgaGFuZGxpbmcuXG4gKiAhI3poIOiJuuacr+aVsOWtl+Wtl+S9k+i1hOa6kOexu+OAglxuICogQGNsYXNzIExhYmVsQXRsYXNcbiAqIEBleHRlbmRzIEJpdG1hcEZvbnRcbiAqXG4gKi9cbnZhciBMYWJlbEF0bGFzID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5MYWJlbEF0bGFzJyxcbiAgICBleHRlbmRzOiBjYy5CaXRtYXBGb250LFxuXG4gICAgb25Mb2FkICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnNwcml0ZUZyYW1lKSB7XG4gICAgICAgICAgICBjYy53YXJuSUQoOTEwMCwgdGhpcy5uYW1lKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX2ZudENvbmZpZykge1xuICAgICAgICAgICAgY2Mud2FybklEKDkxMDEsIHRoaXMubmFtZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICB9XG5cbn0pO1xuXG5jYy5MYWJlbEF0bGFzID0gTGFiZWxBdGxhcztcbm1vZHVsZS5leHBvcnRzID0gTGFiZWxBdGxhcztcbiJdfQ==