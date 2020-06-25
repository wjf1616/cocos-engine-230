
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/physics/utils.js';
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
function getWorldRotation(node) {
  var rot = node.angle;
  var parent = node.parent;

  while (parent.parent) {
    rot += parent.angle;
    parent = parent.parent;
  }

  return -rot;
}

function getWorldScale(node) {
  var scaleX = node.scaleX;
  var scaleY = node.scaleY;
  var parent = node.parent;

  while (parent.parent) {
    scaleX *= parent.scaleX;
    scaleY *= parent.scaleY;
    parent = parent.parent;
  }

  return cc.v2(scaleX, scaleY);
}

function convertToNodeRotation(node, rotation) {
  rotation -= -node.angle;
  var parent = node.parent;

  while (parent.parent) {
    rotation -= -parent.angle;
    parent = parent.parent;
  }

  return rotation;
}

module.exports = {
  getWorldRotation: getWorldRotation,
  getWorldScale: getWorldScale,
  convertToNodeRotation: convertToNodeRotation
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIl0sIm5hbWVzIjpbImdldFdvcmxkUm90YXRpb24iLCJub2RlIiwicm90IiwiYW5nbGUiLCJwYXJlbnQiLCJnZXRXb3JsZFNjYWxlIiwic2NhbGVYIiwic2NhbGVZIiwiY2MiLCJ2MiIsImNvbnZlcnRUb05vZGVSb3RhdGlvbiIsInJvdGF0aW9uIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsU0FBU0EsZ0JBQVQsQ0FBMkJDLElBQTNCLEVBQWlDO0FBQzdCLE1BQUlDLEdBQUcsR0FBR0QsSUFBSSxDQUFDRSxLQUFmO0FBQ0EsTUFBSUMsTUFBTSxHQUFHSCxJQUFJLENBQUNHLE1BQWxCOztBQUNBLFNBQU1BLE1BQU0sQ0FBQ0EsTUFBYixFQUFvQjtBQUNoQkYsSUFBQUEsR0FBRyxJQUFJRSxNQUFNLENBQUNELEtBQWQ7QUFDQUMsSUFBQUEsTUFBTSxHQUFHQSxNQUFNLENBQUNBLE1BQWhCO0FBQ0g7O0FBQ0QsU0FBTyxDQUFDRixHQUFSO0FBQ0g7O0FBRUQsU0FBU0csYUFBVCxDQUF3QkosSUFBeEIsRUFBOEI7QUFDMUIsTUFBSUssTUFBTSxHQUFHTCxJQUFJLENBQUNLLE1BQWxCO0FBQ0EsTUFBSUMsTUFBTSxHQUFHTixJQUFJLENBQUNNLE1BQWxCO0FBRUEsTUFBSUgsTUFBTSxHQUFHSCxJQUFJLENBQUNHLE1BQWxCOztBQUNBLFNBQU1BLE1BQU0sQ0FBQ0EsTUFBYixFQUFvQjtBQUNoQkUsSUFBQUEsTUFBTSxJQUFJRixNQUFNLENBQUNFLE1BQWpCO0FBQ0FDLElBQUFBLE1BQU0sSUFBSUgsTUFBTSxDQUFDRyxNQUFqQjtBQUVBSCxJQUFBQSxNQUFNLEdBQUdBLE1BQU0sQ0FBQ0EsTUFBaEI7QUFDSDs7QUFFRCxTQUFPSSxFQUFFLENBQUNDLEVBQUgsQ0FBTUgsTUFBTixFQUFjQyxNQUFkLENBQVA7QUFDSDs7QUFFRCxTQUFTRyxxQkFBVCxDQUFnQ1QsSUFBaEMsRUFBc0NVLFFBQXRDLEVBQWdEO0FBQzVDQSxFQUFBQSxRQUFRLElBQUksQ0FBQ1YsSUFBSSxDQUFDRSxLQUFsQjtBQUNBLE1BQUlDLE1BQU0sR0FBR0gsSUFBSSxDQUFDRyxNQUFsQjs7QUFDQSxTQUFNQSxNQUFNLENBQUNBLE1BQWIsRUFBb0I7QUFDaEJPLElBQUFBLFFBQVEsSUFBSSxDQUFDUCxNQUFNLENBQUNELEtBQXBCO0FBQ0FDLElBQUFBLE1BQU0sR0FBR0EsTUFBTSxDQUFDQSxNQUFoQjtBQUNIOztBQUNELFNBQU9PLFFBQVA7QUFDSDs7QUFFREMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQ2JiLEVBQUFBLGdCQUFnQixFQUFFQSxnQkFETDtBQUViSyxFQUFBQSxhQUFhLEVBQUVBLGFBRkY7QUFHYkssRUFBQUEscUJBQXFCLEVBQUVBO0FBSFYsQ0FBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5mdW5jdGlvbiBnZXRXb3JsZFJvdGF0aW9uIChub2RlKSB7XG4gICAgdmFyIHJvdCA9IG5vZGUuYW5nbGU7XG4gICAgdmFyIHBhcmVudCA9IG5vZGUucGFyZW50O1xuICAgIHdoaWxlKHBhcmVudC5wYXJlbnQpe1xuICAgICAgICByb3QgKz0gcGFyZW50LmFuZ2xlO1xuICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICAgIH1cbiAgICByZXR1cm4gLXJvdDtcbn1cblxuZnVuY3Rpb24gZ2V0V29ybGRTY2FsZSAobm9kZSkge1xuICAgIHZhciBzY2FsZVggPSBub2RlLnNjYWxlWDtcbiAgICB2YXIgc2NhbGVZID0gbm9kZS5zY2FsZVk7XG5cbiAgICB2YXIgcGFyZW50ID0gbm9kZS5wYXJlbnQ7XG4gICAgd2hpbGUocGFyZW50LnBhcmVudCl7XG4gICAgICAgIHNjYWxlWCAqPSBwYXJlbnQuc2NhbGVYO1xuICAgICAgICBzY2FsZVkgKj0gcGFyZW50LnNjYWxlWTtcblxuICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICAgIH1cblxuICAgIHJldHVybiBjYy52MihzY2FsZVgsIHNjYWxlWSk7XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRUb05vZGVSb3RhdGlvbiAobm9kZSwgcm90YXRpb24pIHtcbiAgICByb3RhdGlvbiAtPSAtbm9kZS5hbmdsZTtcbiAgICB2YXIgcGFyZW50ID0gbm9kZS5wYXJlbnQ7XG4gICAgd2hpbGUocGFyZW50LnBhcmVudCl7XG4gICAgICAgIHJvdGF0aW9uIC09IC1wYXJlbnQuYW5nbGU7XG4gICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gICAgfVxuICAgIHJldHVybiByb3RhdGlvbjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZ2V0V29ybGRSb3RhdGlvbjogZ2V0V29ybGRSb3RhdGlvbixcbiAgICBnZXRXb3JsZFNjYWxlOiBnZXRXb3JsZFNjYWxlLFxuICAgIGNvbnZlcnRUb05vZGVSb3RhdGlvbjogY29udmVydFRvTm9kZVJvdGF0aW9uXG59O1xuIl19