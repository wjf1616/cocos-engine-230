
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/webgl/assemblers/label/index.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _assembler = _interopRequireDefault(require("../../../assembler"));

var _CCLabel = _interopRequireDefault(require("../../../../components/CCLabel"));

var _ttf = _interopRequireDefault(require("./2d/ttf"));

var _bmfont = _interopRequireDefault(require("./2d/bmfont"));

var _letter = _interopRequireDefault(require("./2d/letter"));

var _ttf2 = _interopRequireDefault(require("./3d/ttf"));

var _bmfont2 = _interopRequireDefault(require("./3d/bmfont"));

var _letter2 = _interopRequireDefault(require("./3d/letter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
_CCLabel["default"]._canvasPool = {
  pool: [],
  get: function get() {
    var data = this.pool.pop();

    if (!data) {
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      data = {
        canvas: canvas,
        context: context
      };
    }

    return data;
  },
  put: function put(canvas) {
    if (this.pool.length >= 32) {
      return;
    }

    this.pool.push(canvas);
  }
};

_assembler["default"].register(cc.Label, {
  getConstructor: function getConstructor(label) {
    var is3DNode = label.node.is3DNode;
    var ctor = is3DNode ? _ttf2["default"] : _ttf["default"];

    if (label.font instanceof cc.BitmapFont) {
      ctor = is3DNode ? _bmfont2["default"] : _bmfont["default"];
    } else if (label.cacheMode === _CCLabel["default"].CacheMode.CHAR) {
      if (cc.sys.browserType === cc.sys.BROWSER_TYPE_WECHAT_GAME_SUB) {
        cc.warn('sorry, subdomain does not support CHAR mode currently!');
      } else {
        ctor = is3DNode ? _letter2["default"] : _letter["default"];
      }
    }

    return ctor;
  },
  TTF: _ttf["default"],
  Bmfont: _bmfont["default"],
  Letter: _letter["default"],
  TTF3D: _ttf2["default"],
  Bmfont3D: _bmfont2["default"],
  Letter3D: _letter2["default"]
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIkxhYmVsIiwiX2NhbnZhc1Bvb2wiLCJwb29sIiwiZ2V0IiwiZGF0YSIsInBvcCIsImNhbnZhcyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNvbnRleHQiLCJnZXRDb250ZXh0IiwicHV0IiwibGVuZ3RoIiwicHVzaCIsIkFzc2VtYmxlciIsInJlZ2lzdGVyIiwiY2MiLCJnZXRDb25zdHJ1Y3RvciIsImxhYmVsIiwiaXMzRE5vZGUiLCJub2RlIiwiY3RvciIsIlRURjNEIiwiVFRGIiwiZm9udCIsIkJpdG1hcEZvbnQiLCJCbWZvbnQzRCIsIkJtZm9udCIsImNhY2hlTW9kZSIsIkNhY2hlTW9kZSIsIkNIQVIiLCJzeXMiLCJicm93c2VyVHlwZSIsIkJST1dTRVJfVFlQRV9XRUNIQVRfR0FNRV9TVUIiLCJ3YXJuIiwiTGV0dGVyM0QiLCJMZXR0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUF5QkE7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7QUFsQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9DQUEsb0JBQU1DLFdBQU4sR0FBb0I7QUFDaEJDLEVBQUFBLElBQUksRUFBRSxFQURVO0FBRWhCQyxFQUFBQSxHQUZnQixpQkFFVDtBQUNILFFBQUlDLElBQUksR0FBRyxLQUFLRixJQUFMLENBQVVHLEdBQVYsRUFBWDs7QUFFQSxRQUFJLENBQUNELElBQUwsRUFBVztBQUNQLFVBQUlFLE1BQU0sR0FBR0MsUUFBUSxDQUFDQyxhQUFULENBQXVCLFFBQXZCLENBQWI7QUFDQSxVQUFJQyxPQUFPLEdBQUdILE1BQU0sQ0FBQ0ksVUFBUCxDQUFrQixJQUFsQixDQUFkO0FBQ0FOLE1BQUFBLElBQUksR0FBRztBQUNIRSxRQUFBQSxNQUFNLEVBQUVBLE1BREw7QUFFSEcsUUFBQUEsT0FBTyxFQUFFQTtBQUZOLE9BQVA7QUFJSDs7QUFFRCxXQUFPTCxJQUFQO0FBQ0gsR0FmZTtBQWdCaEJPLEVBQUFBLEdBaEJnQixlQWdCWEwsTUFoQlcsRUFnQkg7QUFDVCxRQUFJLEtBQUtKLElBQUwsQ0FBVVUsTUFBVixJQUFvQixFQUF4QixFQUE0QjtBQUN4QjtBQUNIOztBQUNELFNBQUtWLElBQUwsQ0FBVVcsSUFBVixDQUFlUCxNQUFmO0FBQ0g7QUFyQmUsQ0FBcEI7O0FBd0JBUSxzQkFBVUMsUUFBVixDQUFtQkMsRUFBRSxDQUFDaEIsS0FBdEIsRUFBNkI7QUFDekJpQixFQUFBQSxjQUR5QiwwQkFDVkMsS0FEVSxFQUNIO0FBQ2xCLFFBQUlDLFFBQVEsR0FBR0QsS0FBSyxDQUFDRSxJQUFOLENBQVdELFFBQTFCO0FBQ0EsUUFBSUUsSUFBSSxHQUFHRixRQUFRLEdBQUdHLGdCQUFILEdBQVdDLGVBQTlCOztBQUVBLFFBQUlMLEtBQUssQ0FBQ00sSUFBTixZQUFzQlIsRUFBRSxDQUFDUyxVQUE3QixFQUF5QztBQUNyQ0osTUFBQUEsSUFBSSxHQUFHRixRQUFRLEdBQUdPLG1CQUFILEdBQWNDLGtCQUE3QjtBQUNILEtBRkQsTUFFTyxJQUFJVCxLQUFLLENBQUNVLFNBQU4sS0FBb0I1QixvQkFBTTZCLFNBQU4sQ0FBZ0JDLElBQXhDLEVBQThDO0FBQ2pELFVBQUlkLEVBQUUsQ0FBQ2UsR0FBSCxDQUFPQyxXQUFQLEtBQXVCaEIsRUFBRSxDQUFDZSxHQUFILENBQU9FLDRCQUFsQyxFQUFnRTtBQUM1RGpCLFFBQUFBLEVBQUUsQ0FBQ2tCLElBQUgsQ0FBUSx3REFBUjtBQUNILE9BRkQsTUFFTztBQUNIYixRQUFBQSxJQUFJLEdBQUdGLFFBQVEsR0FBR2dCLG1CQUFILEdBQWNDLGtCQUE3QjtBQUNIO0FBQ0o7O0FBRUQsV0FBT2YsSUFBUDtBQUNILEdBaEJ3QjtBQWtCekJFLEVBQUFBLEdBQUcsRUFBSEEsZUFsQnlCO0FBbUJ6QkksRUFBQUEsTUFBTSxFQUFOQSxrQkFuQnlCO0FBb0J6QlMsRUFBQUEsTUFBTSxFQUFOQSxrQkFwQnlCO0FBc0J6QmQsRUFBQUEsS0FBSyxFQUFMQSxnQkF0QnlCO0FBdUJ6QkksRUFBQUEsUUFBUSxFQUFSQSxtQkF2QnlCO0FBd0J6QlMsRUFBQUEsUUFBUSxFQUFSQTtBQXhCeUIsQ0FBN0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgQXNzZW1ibGVyIGZyb20gJy4uLy4uLy4uL2Fzc2VtYmxlcic7XG5pbXBvcnQgTGFiZWwgZnJvbSAnLi4vLi4vLi4vLi4vY29tcG9uZW50cy9DQ0xhYmVsJztcblxuaW1wb3J0IFRURiBmcm9tICcuLzJkL3R0Zic7XG5pbXBvcnQgQm1mb250IGZyb20gJy4vMmQvYm1mb250JztcbmltcG9ydCBMZXR0ZXIgZnJvbSAnLi8yZC9sZXR0ZXInO1xuXG5pbXBvcnQgVFRGM0QgZnJvbSAnLi8zZC90dGYnO1xuaW1wb3J0IEJtZm9udDNEIGZyb20gJy4vM2QvYm1mb250JztcbmltcG9ydCBMZXR0ZXIzRCBmcm9tICcuLzNkL2xldHRlcic7XG5cbkxhYmVsLl9jYW52YXNQb29sID0ge1xuICAgIHBvb2w6IFtdLFxuICAgIGdldCAoKSB7XG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5wb29sLnBvcCgpO1xuXG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICAgICAgICBsZXQgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgICAgICBkYXRhID0ge1xuICAgICAgICAgICAgICAgIGNhbnZhczogY2FudmFzLFxuICAgICAgICAgICAgICAgIGNvbnRleHQ6IGNvbnRleHRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH0sXG4gICAgcHV0IChjYW52YXMpIHtcbiAgICAgICAgaWYgKHRoaXMucG9vbC5sZW5ndGggPj0gMzIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBvb2wucHVzaChjYW52YXMpO1xuICAgIH1cbn07XG5cbkFzc2VtYmxlci5yZWdpc3RlcihjYy5MYWJlbCwge1xuICAgIGdldENvbnN0cnVjdG9yKGxhYmVsKSB7XG4gICAgICAgIGxldCBpczNETm9kZSA9IGxhYmVsLm5vZGUuaXMzRE5vZGU7XG4gICAgICAgIGxldCBjdG9yID0gaXMzRE5vZGUgPyBUVEYzRCA6IFRURjtcbiAgICAgICAgXG4gICAgICAgIGlmIChsYWJlbC5mb250IGluc3RhbmNlb2YgY2MuQml0bWFwRm9udCkge1xuICAgICAgICAgICAgY3RvciA9IGlzM0ROb2RlID8gQm1mb250M0QgOiBCbWZvbnQ7XG4gICAgICAgIH0gZWxzZSBpZiAobGFiZWwuY2FjaGVNb2RlID09PSBMYWJlbC5DYWNoZU1vZGUuQ0hBUikge1xuICAgICAgICAgICAgaWYgKGNjLnN5cy5icm93c2VyVHlwZSA9PT0gY2Muc3lzLkJST1dTRVJfVFlQRV9XRUNIQVRfR0FNRV9TVUIpIHtcbiAgICAgICAgICAgICAgICBjYy53YXJuKCdzb3JyeSwgc3ViZG9tYWluIGRvZXMgbm90IHN1cHBvcnQgQ0hBUiBtb2RlIGN1cnJlbnRseSEnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY3RvciA9IGlzM0ROb2RlID8gTGV0dGVyM0QgOiBMZXR0ZXI7XG4gICAgICAgICAgICB9ICBcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjdG9yO1xuICAgIH0sXG5cbiAgICBUVEYsXG4gICAgQm1mb250LFxuICAgIExldHRlcixcblxuICAgIFRURjNELFxuICAgIEJtZm9udDNELFxuICAgIExldHRlcjNEXG59KTtcbiJdfQ==