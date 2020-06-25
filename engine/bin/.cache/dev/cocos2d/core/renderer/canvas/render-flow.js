
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/canvas/render-flow.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _renderFlow = _interopRequireDefault(require("../render-flow"));

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
_renderFlow["default"].prototype._draw = function (node, func) {
  var batcher = _renderFlow["default"].getBachther();

  var ctx = batcher._device._ctx;
  var cam = batcher._camera;
  ctx.setTransform(cam.a, cam.b, cam.c, cam.d, cam.tx, cam.ty);
  ctx.scale(1, -1);
  var comp = node._renderComponent;

  comp._assembler[func](ctx, comp);

  this._next._func(node);
};

_renderFlow["default"].prototype._render = function (node) {
  this._draw(node, 'draw');
};

_renderFlow["default"].prototype._postRender = function (node) {
  this._draw(node, 'postDraw');
};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbmRlci1mbG93LmpzIl0sIm5hbWVzIjpbIlJlbmRlckZsb3ciLCJwcm90b3R5cGUiLCJfZHJhdyIsIm5vZGUiLCJmdW5jIiwiYmF0Y2hlciIsImdldEJhY2h0aGVyIiwiY3R4IiwiX2RldmljZSIsIl9jdHgiLCJjYW0iLCJfY2FtZXJhIiwic2V0VHJhbnNmb3JtIiwiYSIsImIiLCJjIiwiZCIsInR4IiwidHkiLCJzY2FsZSIsImNvbXAiLCJfcmVuZGVyQ29tcG9uZW50IiwiX2Fzc2VtYmxlciIsIl9uZXh0IiwiX2Z1bmMiLCJfcmVuZGVyIiwiX3Bvc3RSZW5kZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUF5QkE7Ozs7QUF6QkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCQUEsdUJBQVdDLFNBQVgsQ0FBcUJDLEtBQXJCLEdBQTZCLFVBQVVDLElBQVYsRUFBZ0JDLElBQWhCLEVBQXNCO0FBQy9DLE1BQUlDLE9BQU8sR0FBR0wsdUJBQVdNLFdBQVgsRUFBZDs7QUFDQSxNQUFJQyxHQUFHLEdBQUdGLE9BQU8sQ0FBQ0csT0FBUixDQUFnQkMsSUFBMUI7QUFDQSxNQUFJQyxHQUFHLEdBQUdMLE9BQU8sQ0FBQ00sT0FBbEI7QUFDQUosRUFBQUEsR0FBRyxDQUFDSyxZQUFKLENBQWlCRixHQUFHLENBQUNHLENBQXJCLEVBQXdCSCxHQUFHLENBQUNJLENBQTVCLEVBQStCSixHQUFHLENBQUNLLENBQW5DLEVBQXNDTCxHQUFHLENBQUNNLENBQTFDLEVBQTZDTixHQUFHLENBQUNPLEVBQWpELEVBQXFEUCxHQUFHLENBQUNRLEVBQXpEO0FBQ0FYLEVBQUFBLEdBQUcsQ0FBQ1ksS0FBSixDQUFVLENBQVYsRUFBYSxDQUFDLENBQWQ7QUFFQSxNQUFJQyxJQUFJLEdBQUdqQixJQUFJLENBQUNrQixnQkFBaEI7O0FBQ0FELEVBQUFBLElBQUksQ0FBQ0UsVUFBTCxDQUFnQmxCLElBQWhCLEVBQXNCRyxHQUF0QixFQUEyQmEsSUFBM0I7O0FBQ0EsT0FBS0csS0FBTCxDQUFXQyxLQUFYLENBQWlCckIsSUFBakI7QUFDSCxDQVZEOztBQVlBSCx1QkFBV0MsU0FBWCxDQUFxQndCLE9BQXJCLEdBQStCLFVBQVV0QixJQUFWLEVBQWdCO0FBQzNDLE9BQUtELEtBQUwsQ0FBV0MsSUFBWCxFQUFpQixNQUFqQjtBQUNILENBRkQ7O0FBSUFILHVCQUFXQyxTQUFYLENBQXFCeUIsV0FBckIsR0FBbUMsVUFBVXZCLElBQVYsRUFBZ0I7QUFDL0MsT0FBS0QsS0FBTCxDQUFXQyxJQUFYLEVBQWlCLFVBQWpCO0FBQ0gsQ0FGRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCBSZW5kZXJGbG93IGZyb20gJy4uL3JlbmRlci1mbG93JztcblxuUmVuZGVyRmxvdy5wcm90b3R5cGUuX2RyYXcgPSBmdW5jdGlvbiAobm9kZSwgZnVuYykge1xuICAgIGxldCBiYXRjaGVyID0gUmVuZGVyRmxvdy5nZXRCYWNodGhlcigpO1xuICAgIGxldCBjdHggPSBiYXRjaGVyLl9kZXZpY2UuX2N0eDtcbiAgICBsZXQgY2FtID0gYmF0Y2hlci5fY2FtZXJhO1xuICAgIGN0eC5zZXRUcmFuc2Zvcm0oY2FtLmEsIGNhbS5iLCBjYW0uYywgY2FtLmQsIGNhbS50eCwgY2FtLnR5KTtcbiAgICBjdHguc2NhbGUoMSwgLTEpO1xuXG4gICAgbGV0IGNvbXAgPSBub2RlLl9yZW5kZXJDb21wb25lbnQ7XG4gICAgY29tcC5fYXNzZW1ibGVyW2Z1bmNdKGN0eCwgY29tcCk7XG4gICAgdGhpcy5fbmV4dC5fZnVuYyhub2RlKTtcbn1cblxuUmVuZGVyRmxvdy5wcm90b3R5cGUuX3JlbmRlciA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgdGhpcy5fZHJhdyhub2RlLCAnZHJhdycpO1xufVxuXG5SZW5kZXJGbG93LnByb3RvdHlwZS5fcG9zdFJlbmRlciA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgdGhpcy5fZHJhdyhub2RlLCAncG9zdERyYXcnKTtcbn1cbiJdfQ==