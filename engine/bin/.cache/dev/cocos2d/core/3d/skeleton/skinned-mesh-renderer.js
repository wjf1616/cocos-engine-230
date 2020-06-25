
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/skeleton/skinned-mesh-renderer.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
var SkinnedMeshRenderer = require('./CCSkinnedMeshRenderer');

var MeshRendererAssembler = require('../../mesh/mesh-renderer');

var RenderFlow = require('../../renderer/render-flow');

var SkinnedMeshRendererAssembler =
/*#__PURE__*/
function (_MeshRendererAssemble) {
  _inheritsLoose(SkinnedMeshRendererAssembler, _MeshRendererAssemble);

  function SkinnedMeshRendererAssembler() {
    return _MeshRendererAssemble.apply(this, arguments) || this;
  }

  var _proto = SkinnedMeshRendererAssembler.prototype;

  _proto.fillBuffers = function fillBuffers(comp, renderer) {
    comp.calcJointMatrix();

    _MeshRendererAssemble.prototype.fillBuffers.call(this, comp, renderer);
  };

  return SkinnedMeshRendererAssembler;
}(MeshRendererAssembler);

exports["default"] = SkinnedMeshRendererAssembler;
cc.Assembler.register(SkinnedMeshRenderer, SkinnedMeshRendererAssembler);
module.exports = exports["default"];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNraW5uZWQtbWVzaC1yZW5kZXJlci5qcyJdLCJuYW1lcyI6WyJTa2lubmVkTWVzaFJlbmRlcmVyIiwicmVxdWlyZSIsIk1lc2hSZW5kZXJlckFzc2VtYmxlciIsIlJlbmRlckZsb3ciLCJTa2lubmVkTWVzaFJlbmRlcmVyQXNzZW1ibGVyIiwiZmlsbEJ1ZmZlcnMiLCJjb21wIiwicmVuZGVyZXIiLCJjYWxjSm9pbnRNYXRyaXgiLCJjYyIsIkFzc2VtYmxlciIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBLElBQU1BLG1CQUFtQixHQUFHQyxPQUFPLENBQUMseUJBQUQsQ0FBbkM7O0FBQ0EsSUFBTUMscUJBQXFCLEdBQUdELE9BQU8sQ0FBQywwQkFBRCxDQUFyQzs7QUFDQSxJQUFNRSxVQUFVLEdBQUdGLE9BQU8sQ0FBQyw0QkFBRCxDQUExQjs7SUFFcUJHOzs7Ozs7Ozs7OztTQUNqQkMsY0FBQSxxQkFBYUMsSUFBYixFQUFtQkMsUUFBbkIsRUFBNkI7QUFDekJELElBQUFBLElBQUksQ0FBQ0UsZUFBTDs7QUFDQSxvQ0FBTUgsV0FBTixZQUFrQkMsSUFBbEIsRUFBd0JDLFFBQXhCO0FBQ0g7OztFQUpxREw7OztBQU8xRE8sRUFBRSxDQUFDQyxTQUFILENBQWFDLFFBQWIsQ0FBc0JYLG1CQUF0QixFQUEyQ0ksNEJBQTNDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHA6Ly93d3cuY29jb3MuY29tXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBTa2lubmVkTWVzaFJlbmRlcmVyID0gcmVxdWlyZSgnLi9DQ1NraW5uZWRNZXNoUmVuZGVyZXInKTtcbmNvbnN0IE1lc2hSZW5kZXJlckFzc2VtYmxlciA9IHJlcXVpcmUoJy4uLy4uL21lc2gvbWVzaC1yZW5kZXJlcicpO1xuY29uc3QgUmVuZGVyRmxvdyA9IHJlcXVpcmUoJy4uLy4uL3JlbmRlcmVyL3JlbmRlci1mbG93Jyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNraW5uZWRNZXNoUmVuZGVyZXJBc3NlbWJsZXIgZXh0ZW5kcyBNZXNoUmVuZGVyZXJBc3NlbWJsZXIge1xuICAgIGZpbGxCdWZmZXJzIChjb21wLCByZW5kZXJlcikge1xuICAgICAgICBjb21wLmNhbGNKb2ludE1hdHJpeCgpO1xuICAgICAgICBzdXBlci5maWxsQnVmZmVycyhjb21wLCByZW5kZXJlcik7XG4gICAgfVxufVxuXG5jYy5Bc3NlbWJsZXIucmVnaXN0ZXIoU2tpbm5lZE1lc2hSZW5kZXJlciwgU2tpbm5lZE1lc2hSZW5kZXJlckFzc2VtYmxlcik7XG4iXX0=