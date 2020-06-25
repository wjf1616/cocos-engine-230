
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/canvas/render-component-handle.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
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
var utils = require('./renderers/utils');

var RenderComponentHandle = function RenderComponentHandle(device, defaultCamera) {
  this._device = device; // let vx = this._device._vx;
  // let vy = this._device._vy;
  // let vh = this._device._vh;

  this._camera = defaultCamera;
  this.parentOpacity = 1;
  this.parentOpacityDirty = 0;
  this.worldMatDirty = 0;
  this.walking = false;
};

RenderComponentHandle.prototype = {
  constructor: RenderComponentHandle,
  reset: function reset() {
    var ctx = this._device._ctx;
    var canvas = this._device._canvas;
    var color = cc.Camera.main ? cc.Camera.main.backgroundColor : cc.color();
    var rgba = "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a / 255 + ")";
    ctx.fillStyle = rgba;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    this._device._stats.drawcalls = 0; //reset cache data

    utils.context.reset();
  },
  terminate: function terminate() {}
};
module.exports = RenderComponentHandle;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbmRlci1jb21wb25lbnQtaGFuZGxlLmpzIl0sIm5hbWVzIjpbInV0aWxzIiwicmVxdWlyZSIsIlJlbmRlckNvbXBvbmVudEhhbmRsZSIsImRldmljZSIsImRlZmF1bHRDYW1lcmEiLCJfZGV2aWNlIiwiX2NhbWVyYSIsInBhcmVudE9wYWNpdHkiLCJwYXJlbnRPcGFjaXR5RGlydHkiLCJ3b3JsZE1hdERpcnR5Iiwid2Fsa2luZyIsInByb3RvdHlwZSIsImNvbnN0cnVjdG9yIiwicmVzZXQiLCJjdHgiLCJfY3R4IiwiY2FudmFzIiwiX2NhbnZhcyIsImNvbG9yIiwiY2MiLCJDYW1lcmEiLCJtYWluIiwiYmFja2dyb3VuZENvbG9yIiwicmdiYSIsInIiLCJnIiwiYiIsImEiLCJmaWxsU3R5bGUiLCJzZXRUcmFuc2Zvcm0iLCJjbGVhclJlY3QiLCJ3aWR0aCIsImhlaWdodCIsImZpbGxSZWN0IiwiX3N0YXRzIiwiZHJhd2NhbGxzIiwiY29udGV4dCIsInRlcm1pbmF0ZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBLElBQU1BLEtBQUssR0FBR0MsT0FBTyxDQUFDLG1CQUFELENBQXJCOztBQUVBLElBQUlDLHFCQUFxQixHQUFHLFNBQXhCQSxxQkFBd0IsQ0FBVUMsTUFBVixFQUFrQkMsYUFBbEIsRUFBaUM7QUFDekQsT0FBS0MsT0FBTCxHQUFlRixNQUFmLENBRHlELENBRXpEO0FBQ0E7QUFDQTs7QUFDQSxPQUFLRyxPQUFMLEdBQWVGLGFBQWY7QUFFQSxPQUFLRyxhQUFMLEdBQXFCLENBQXJCO0FBQ0EsT0FBS0Msa0JBQUwsR0FBMEIsQ0FBMUI7QUFDQSxPQUFLQyxhQUFMLEdBQXFCLENBQXJCO0FBQ0EsT0FBS0MsT0FBTCxHQUFlLEtBQWY7QUFDSCxDQVhEOztBQWFBUixxQkFBcUIsQ0FBQ1MsU0FBdEIsR0FBa0M7QUFDOUJDLEVBQUFBLFdBQVcsRUFBRVYscUJBRGlCO0FBRzlCVyxFQUFBQSxLQUg4QixtQkFHdEI7QUFDSixRQUFJQyxHQUFHLEdBQUcsS0FBS1QsT0FBTCxDQUFhVSxJQUF2QjtBQUNBLFFBQUlDLE1BQU0sR0FBRyxLQUFLWCxPQUFMLENBQWFZLE9BQTFCO0FBQ0EsUUFBSUMsS0FBSyxHQUFHQyxFQUFFLENBQUNDLE1BQUgsQ0FBVUMsSUFBVixHQUFpQkYsRUFBRSxDQUFDQyxNQUFILENBQVVDLElBQVYsQ0FBZUMsZUFBaEMsR0FBa0RILEVBQUUsQ0FBQ0QsS0FBSCxFQUE5RDtBQUNBLFFBQUlLLElBQUksYUFBV0wsS0FBSyxDQUFDTSxDQUFqQixVQUF1Qk4sS0FBSyxDQUFDTyxDQUE3QixVQUFtQ1AsS0FBSyxDQUFDUSxDQUF6QyxVQUErQ1IsS0FBSyxDQUFDUyxDQUFOLEdBQVEsR0FBdkQsTUFBUjtBQUNBYixJQUFBQSxHQUFHLENBQUNjLFNBQUosR0FBZ0JMLElBQWhCO0FBQ0FULElBQUFBLEdBQUcsQ0FBQ2UsWUFBSixDQUFpQixDQUFqQixFQUFvQixDQUFwQixFQUF1QixDQUF2QixFQUEwQixDQUExQixFQUE2QixDQUE3QixFQUFnQyxDQUFoQztBQUNBZixJQUFBQSxHQUFHLENBQUNnQixTQUFKLENBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQmQsTUFBTSxDQUFDZSxLQUEzQixFQUFrQ2YsTUFBTSxDQUFDZ0IsTUFBekM7QUFDQWxCLElBQUFBLEdBQUcsQ0FBQ21CLFFBQUosQ0FBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CakIsTUFBTSxDQUFDZSxLQUExQixFQUFpQ2YsTUFBTSxDQUFDZ0IsTUFBeEM7QUFDQSxTQUFLM0IsT0FBTCxDQUFhNkIsTUFBYixDQUFvQkMsU0FBcEIsR0FBZ0MsQ0FBaEMsQ0FUSSxDQVVKOztBQUNBbkMsSUFBQUEsS0FBSyxDQUFDb0MsT0FBTixDQUFjdkIsS0FBZDtBQUNILEdBZjZCO0FBaUI5QndCLEVBQUFBLFNBakI4Qix1QkFpQmpCLENBRVo7QUFuQjZCLENBQWxDO0FBc0JBQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJyQyxxQkFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4vcmVuZGVyZXJzL3V0aWxzJylcblxubGV0IFJlbmRlckNvbXBvbmVudEhhbmRsZSA9IGZ1bmN0aW9uIChkZXZpY2UsIGRlZmF1bHRDYW1lcmEpIHtcbiAgICB0aGlzLl9kZXZpY2UgPSBkZXZpY2U7XG4gICAgLy8gbGV0IHZ4ID0gdGhpcy5fZGV2aWNlLl92eDtcbiAgICAvLyBsZXQgdnkgPSB0aGlzLl9kZXZpY2UuX3Z5O1xuICAgIC8vIGxldCB2aCA9IHRoaXMuX2RldmljZS5fdmg7XG4gICAgdGhpcy5fY2FtZXJhID0gZGVmYXVsdENhbWVyYTtcblxuICAgIHRoaXMucGFyZW50T3BhY2l0eSA9IDE7XG4gICAgdGhpcy5wYXJlbnRPcGFjaXR5RGlydHkgPSAwO1xuICAgIHRoaXMud29ybGRNYXREaXJ0eSA9IDA7XG4gICAgdGhpcy53YWxraW5nID0gZmFsc2U7XG59O1xuXG5SZW5kZXJDb21wb25lbnRIYW5kbGUucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBSZW5kZXJDb21wb25lbnRIYW5kbGUsXG4gICAgXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIGxldCBjdHggPSB0aGlzLl9kZXZpY2UuX2N0eDtcbiAgICAgICAgbGV0IGNhbnZhcyA9IHRoaXMuX2RldmljZS5fY2FudmFzO1xuICAgICAgICB2YXIgY29sb3IgPSBjYy5DYW1lcmEubWFpbiA/IGNjLkNhbWVyYS5tYWluLmJhY2tncm91bmRDb2xvciA6IGNjLmNvbG9yKCk7XG4gICAgICAgIGxldCByZ2JhID0gYHJnYmEoJHtjb2xvci5yfSwgJHtjb2xvci5nfSwgJHtjb2xvci5ifSwgJHtjb2xvci5hLzI1NX0pYDtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHJnYmE7XG4gICAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgMCwgMCk7XG4gICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgY3R4LmZpbGxSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgICAgIHRoaXMuX2RldmljZS5fc3RhdHMuZHJhd2NhbGxzID0gMDtcbiAgICAgICAgLy9yZXNldCBjYWNoZSBkYXRhXG4gICAgICAgIHV0aWxzLmNvbnRleHQucmVzZXQoKTtcbiAgICB9LFxuXG4gICAgdGVybWluYXRlICgpIHtcblxuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmVuZGVyQ29tcG9uZW50SGFuZGxlOyJdfQ==