
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/utils/trans-pool/node-mem-pool.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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
var MemPool = require('./mem-pool');

var NodeMemPool = function NodeMemPool(unitClass) {
  MemPool.call(this, unitClass);
};

(function () {
  var Super = function Super() {};

  Super.prototype = MemPool.prototype;
  NodeMemPool.prototype = new Super();
})();

var proto = NodeMemPool.prototype;

proto._initNative = function () {
  this._nativeMemPool = new renderer.NodeMemPool();
};

proto._destroyUnit = function (unitID) {
  MemPool.prototype._destroyUnit.call(this, unitID);

  if (CC_JSB && CC_NATIVERENDERER) {
    this._nativeMemPool.removeNodeData(unitID);
  }
};

module.exports = NodeMemPool;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGUtbWVtLXBvb2wuanMiXSwibmFtZXMiOlsiTWVtUG9vbCIsInJlcXVpcmUiLCJOb2RlTWVtUG9vbCIsInVuaXRDbGFzcyIsImNhbGwiLCJTdXBlciIsInByb3RvdHlwZSIsInByb3RvIiwiX2luaXROYXRpdmUiLCJfbmF0aXZlTWVtUG9vbCIsInJlbmRlcmVyIiwiX2Rlc3Ryb3lVbml0IiwidW5pdElEIiwiQ0NfSlNCIiwiQ0NfTkFUSVZFUkVOREVSRVIiLCJyZW1vdmVOb2RlRGF0YSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBLElBQUlBLE9BQU8sR0FBR0MsT0FBTyxDQUFDLFlBQUQsQ0FBckI7O0FBQ0EsSUFBSUMsV0FBVyxHQUFHLFNBQWRBLFdBQWMsQ0FBVUMsU0FBVixFQUFxQjtBQUNuQ0gsRUFBQUEsT0FBTyxDQUFDSSxJQUFSLENBQWEsSUFBYixFQUFtQkQsU0FBbkI7QUFDSCxDQUZEOztBQUlBLENBQUMsWUFBVTtBQUNQLE1BQUlFLEtBQUssR0FBRyxTQUFSQSxLQUFRLEdBQVUsQ0FBRSxDQUF4Qjs7QUFDQUEsRUFBQUEsS0FBSyxDQUFDQyxTQUFOLEdBQWtCTixPQUFPLENBQUNNLFNBQTFCO0FBQ0FKLEVBQUFBLFdBQVcsQ0FBQ0ksU0FBWixHQUF3QixJQUFJRCxLQUFKLEVBQXhCO0FBQ0gsQ0FKRDs7QUFNQSxJQUFJRSxLQUFLLEdBQUdMLFdBQVcsQ0FBQ0ksU0FBeEI7O0FBQ0FDLEtBQUssQ0FBQ0MsV0FBTixHQUFvQixZQUFZO0FBQzVCLE9BQUtDLGNBQUwsR0FBc0IsSUFBSUMsUUFBUSxDQUFDUixXQUFiLEVBQXRCO0FBQ0gsQ0FGRDs7QUFJQUssS0FBSyxDQUFDSSxZQUFOLEdBQXFCLFVBQVVDLE1BQVYsRUFBa0I7QUFDbkNaLEVBQUFBLE9BQU8sQ0FBQ00sU0FBUixDQUFrQkssWUFBbEIsQ0FBK0JQLElBQS9CLENBQW9DLElBQXBDLEVBQTBDUSxNQUExQzs7QUFDQSxNQUFJQyxNQUFNLElBQUlDLGlCQUFkLEVBQWlDO0FBQzdCLFNBQUtMLGNBQUwsQ0FBb0JNLGNBQXBCLENBQW1DSCxNQUFuQztBQUNIO0FBQ0osQ0FMRDs7QUFPQUksTUFBTSxDQUFDQyxPQUFQLEdBQWlCZixXQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE5IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5sZXQgTWVtUG9vbCA9IHJlcXVpcmUoJy4vbWVtLXBvb2wnKTtcbmxldCBOb2RlTWVtUG9vbCA9IGZ1bmN0aW9uICh1bml0Q2xhc3MpIHtcbiAgICBNZW1Qb29sLmNhbGwodGhpcywgdW5pdENsYXNzKTtcbn07XG5cbihmdW5jdGlvbigpe1xuICAgIGxldCBTdXBlciA9IGZ1bmN0aW9uKCl7fTtcbiAgICBTdXBlci5wcm90b3R5cGUgPSBNZW1Qb29sLnByb3RvdHlwZTtcbiAgICBOb2RlTWVtUG9vbC5wcm90b3R5cGUgPSBuZXcgU3VwZXIoKTtcbn0pKCk7XG5cbmxldCBwcm90byA9IE5vZGVNZW1Qb29sLnByb3RvdHlwZTtcbnByb3RvLl9pbml0TmF0aXZlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX25hdGl2ZU1lbVBvb2wgPSBuZXcgcmVuZGVyZXIuTm9kZU1lbVBvb2woKTtcbn07XG5cbnByb3RvLl9kZXN0cm95VW5pdCA9IGZ1bmN0aW9uICh1bml0SUQpIHtcbiAgICBNZW1Qb29sLnByb3RvdHlwZS5fZGVzdHJveVVuaXQuY2FsbCh0aGlzLCB1bml0SUQpO1xuICAgIGlmIChDQ19KU0IgJiYgQ0NfTkFUSVZFUkVOREVSRVIpIHtcbiAgICAgICAgdGhpcy5fbmF0aXZlTWVtUG9vbC5yZW1vdmVOb2RlRGF0YSh1bml0SUQpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTm9kZU1lbVBvb2w7Il19