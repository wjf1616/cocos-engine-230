
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/physics/framework/util.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.stringfyVec3 = stringfyVec3;
exports.stringfyQuat = stringfyQuat;
exports.setWrap = setWrap;
exports.getWrap = getWrap;
exports.clearNodeTransformDirtyFlag = clearNodeTransformDirtyFlag;
exports.clearNodeTransformRecord = clearNodeTransformRecord;
exports.updateWorldTransform = updateWorldTransform;
exports.updateWorldRT = updateWorldRT;

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
function stringfyVec3(value) {
  return "(x: " + value.x + ", y: " + value.y + ", z: " + value.z + ")";
}

function stringfyQuat(value) {
  return "(x: " + value.x + ", y: " + value.y + ", z: " + value.z + ", w: " + value.w + ")";
}

function setWrap(object, wrapper) {
  object.__cc_wrapper__ = wrapper;
}

function getWrap(object) {
  return object.__cc_wrapper__;
}

var LocalDirtyFlag = cc.Node._LocalDirtyFlag;
var PHYSICS_TRS = LocalDirtyFlag.PHYSICS_TRS;
var ALL_TRS = LocalDirtyFlag.ALL_TRS;
var SKEW = LocalDirtyFlag.SKEW;
var FLAG_TRANSFORM = cc.RenderFlow.FLAG_TRANSFORM;
var Mat3 = cc.Mat3;
var Mat4 = cc.Mat4;
var Vec3 = cc.Vec3;
var Quat = cc.Quat;
var Trs = cc.Trs;
var _nodeArray = [];

var _lpos = cc.v3();

var _lrot = cc.quat();

var _mat3 = new Mat3();

var _mat3m = _mat3.m;

var _quat = cc.quat();

var _mat4 = cc.mat4();

var _nodeTransformRecord = {};

function clearNodeTransformDirtyFlag() {
  for (var key in _nodeTransformRecord) {
    var physicsNode = _nodeTransformRecord[key];
    physicsNode._localMatDirty &= ~ALL_TRS;

    if (!(physicsNode._localMatDirty & SKEW)) {
      physicsNode._worldMatDirty = false;
      !CC_NATIVERENDERER && (physicsNode._renderFlag &= ~FLAG_TRANSFORM);
    }
  }

  _nodeTransformRecord = {};
  _nodeArray.length = 0;
}

function clearNodeTransformRecord() {
  _nodeTransformRecord = {};
  _nodeArray.length = 0;
}
/*
 * The method of node backtrace is used to optimize the calculation of global transformation. 
 * Node backtrace is continuous until the parent node is empty or the parent node has performed the calculation of global transformation.
 * The result of backtrace will store the node relational chain in the array. 
 * The process of traversing array is equivalent to the process of global transformation from the parent node to the physical node.
 * The calculated results are saved in the node, and the physical global transformation flag will be erased finally.
 */


function updateWorldTransform(node, traverseAllNode) {
  if (traverseAllNode === void 0) {
    traverseAllNode = false;
  }

  var cur = node;
  var i = 0;
  var needUpdateTransform = false;
  var physicsDirtyFlag = 0;

  while (cur) {
    // If current node transform has been calculated
    if (traverseAllNode || !_nodeTransformRecord[cur._id]) {
      _nodeArray[i++] = cur;
    } else {
      // Current node's transform has beed calculated
      physicsDirtyFlag |= cur._localMatDirty & PHYSICS_TRS;
      needUpdateTransform = needUpdateTransform || !!physicsDirtyFlag;
      break;
    }

    if (cur._localMatDirty & PHYSICS_TRS) {
      needUpdateTransform = true;
    }

    cur = cur._parent;
  }

  if (!needUpdateTransform) {
    return false;
  }

  var child;
  var childWorldMat, curWorldMat, childTrs, childLocalMat;
  var wpos, wrot, wscale;
  _nodeArray.length = i;

  while (i) {
    child = _nodeArray[--i];
    !traverseAllNode && (_nodeTransformRecord[child._id] = child);
    childWorldMat = child._worldMatrix;
    childLocalMat = child._matrix;
    childTrs = child._trs;
    wpos = child.__wpos = child.__wpos || cc.v3();
    wrot = child.__wrot = child.__wrot || cc.quat();
    wscale = child.__wscale = child.__wscale || cc.v3();

    if (child._localMatDirty & PHYSICS_TRS) {
      Trs.toMat4(childLocalMat, childTrs);
    }

    child._localMatDirty |= physicsDirtyFlag;
    physicsDirtyFlag |= child._localMatDirty & PHYSICS_TRS;

    if (!(physicsDirtyFlag & PHYSICS_TRS)) {
      cur = child;
      continue;
    }

    if (cur) {
      curWorldMat = cur._worldMatrix;
      Trs.toPosition(_lpos, childTrs);
      Vec3.transformMat4(wpos, _lpos, curWorldMat);
      Mat4.multiply(childWorldMat, curWorldMat, childLocalMat);
      Trs.toRotation(_lrot, childTrs);
      Quat.multiply(wrot, cur.__wrot, _lrot);
      Mat3.fromQuat(_mat3, Quat.conjugate(_quat, wrot));
      Mat3.multiplyMat4(_mat3, _mat3, childWorldMat);
      wscale.x = _mat3m[0];
      wscale.y = _mat3m[4];
      wscale.z = _mat3m[8];
    } else {
      Trs.toPosition(wpos, childTrs);
      Trs.toRotation(wrot, childTrs);
      Trs.toScale(wscale, childTrs);
      Mat4.copy(childWorldMat, childLocalMat);
    }

    cur = child;
  }

  return true;
}

function updateWorldRT(node, position, rotation) {
  var parent = node.parent;

  if (parent) {
    updateWorldTransform(parent, true);
    Vec3.transformMat4(_lpos, position, Mat4.invert(_mat4, parent._worldMatrix));
    Quat.multiply(_quat, Quat.conjugate(_quat, parent.__wrot), rotation);
    node.setPosition(_lpos);
    node.setRotation(_quat);
  } else {
    node.setPosition(position);
    node.setRotation(rotation);
  }
}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOlsic3RyaW5nZnlWZWMzIiwidmFsdWUiLCJ4IiwieSIsInoiLCJzdHJpbmdmeVF1YXQiLCJ3Iiwic2V0V3JhcCIsIm9iamVjdCIsIndyYXBwZXIiLCJfX2NjX3dyYXBwZXJfXyIsImdldFdyYXAiLCJMb2NhbERpcnR5RmxhZyIsImNjIiwiTm9kZSIsIl9Mb2NhbERpcnR5RmxhZyIsIlBIWVNJQ1NfVFJTIiwiQUxMX1RSUyIsIlNLRVciLCJGTEFHX1RSQU5TRk9STSIsIlJlbmRlckZsb3ciLCJNYXQzIiwiTWF0NCIsIlZlYzMiLCJRdWF0IiwiVHJzIiwiX25vZGVBcnJheSIsIl9scG9zIiwidjMiLCJfbHJvdCIsInF1YXQiLCJfbWF0MyIsIl9tYXQzbSIsIm0iLCJfcXVhdCIsIl9tYXQ0IiwibWF0NCIsIl9ub2RlVHJhbnNmb3JtUmVjb3JkIiwiY2xlYXJOb2RlVHJhbnNmb3JtRGlydHlGbGFnIiwia2V5IiwicGh5c2ljc05vZGUiLCJfbG9jYWxNYXREaXJ0eSIsIl93b3JsZE1hdERpcnR5IiwiQ0NfTkFUSVZFUkVOREVSRVIiLCJfcmVuZGVyRmxhZyIsImxlbmd0aCIsImNsZWFyTm9kZVRyYW5zZm9ybVJlY29yZCIsInVwZGF0ZVdvcmxkVHJhbnNmb3JtIiwibm9kZSIsInRyYXZlcnNlQWxsTm9kZSIsImN1ciIsImkiLCJuZWVkVXBkYXRlVHJhbnNmb3JtIiwicGh5c2ljc0RpcnR5RmxhZyIsIl9pZCIsIl9wYXJlbnQiLCJjaGlsZCIsImNoaWxkV29ybGRNYXQiLCJjdXJXb3JsZE1hdCIsImNoaWxkVHJzIiwiY2hpbGRMb2NhbE1hdCIsIndwb3MiLCJ3cm90Iiwid3NjYWxlIiwiX3dvcmxkTWF0cml4IiwiX21hdHJpeCIsIl90cnMiLCJfX3dwb3MiLCJfX3dyb3QiLCJfX3dzY2FsZSIsInRvTWF0NCIsInRvUG9zaXRpb24iLCJ0cmFuc2Zvcm1NYXQ0IiwibXVsdGlwbHkiLCJ0b1JvdGF0aW9uIiwiZnJvbVF1YXQiLCJjb25qdWdhdGUiLCJtdWx0aXBseU1hdDQiLCJ0b1NjYWxlIiwiY29weSIsInVwZGF0ZVdvcmxkUlQiLCJwb3NpdGlvbiIsInJvdGF0aW9uIiwicGFyZW50IiwiaW52ZXJ0Iiwic2V0UG9zaXRpb24iLCJzZXRSb3RhdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkJPLFNBQVNBLFlBQVQsQ0FBdUJDLEtBQXZCLEVBQWlEO0FBQ2hELGtCQUFjQSxLQUFLLENBQUNDLENBQXBCLGFBQTZCRCxLQUFLLENBQUNFLENBQW5DLGFBQTRDRixLQUFLLENBQUNHLENBQWxEO0FBQ1A7O0FBRU0sU0FBU0MsWUFBVCxDQUF1QkosS0FBdkIsRUFBaUQ7QUFDaEQsa0JBQWNBLEtBQUssQ0FBQ0MsQ0FBcEIsYUFBNkJELEtBQUssQ0FBQ0UsQ0FBbkMsYUFBNENGLEtBQUssQ0FBQ0csQ0FBbEQsYUFBMkRILEtBQUssQ0FBQ0ssQ0FBakU7QUFDUDs7QUFNTSxTQUFTQyxPQUFULENBQTJCQyxNQUEzQixFQUF3Q0MsT0FBeEMsRUFBMEQ7QUFDNURELEVBQUFBLE1BQUQsQ0FBOEJFLGNBQTlCLEdBQStDRCxPQUEvQztBQUNIOztBQUVNLFNBQVNFLE9BQVQsQ0FBMkJILE1BQTNCLEVBQXdDO0FBQzNDLFNBQVFBLE1BQUQsQ0FBOEJFLGNBQXJDO0FBQ0g7O0FBRUQsSUFBTUUsY0FBYyxHQUFHQyxFQUFFLENBQUNDLElBQUgsQ0FBUUMsZUFBL0I7QUFDQSxJQUFNQyxXQUFXLEdBQUdKLGNBQWMsQ0FBQ0ksV0FBbkM7QUFDQSxJQUFNQyxPQUFPLEdBQUdMLGNBQWMsQ0FBQ0ssT0FBL0I7QUFDQSxJQUFNQyxJQUFJLEdBQUdOLGNBQWMsQ0FBQ00sSUFBNUI7QUFDQSxJQUFNQyxjQUFjLEdBQUdOLEVBQUUsQ0FBQ08sVUFBSCxDQUFjRCxjQUFyQztBQUVBLElBQU1FLElBQUksR0FBR1IsRUFBRSxDQUFDUSxJQUFoQjtBQUNBLElBQU1DLElBQUksR0FBR1QsRUFB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QUF5QkcsYUFBekI7QUFDSDs7QUFDRFYsSUFBQUEsR0FBRyxHQUFHTSxLQUFOO0FBQ0g7O0FBQ0QsU0FBTyxJQUFQO0FBQ0g7O0FBRU0sU0FBU3dCLGFBQVQsQ0FBd0JoQyxJQUF4QixFQUF1Q2lDLFFBQXZDLEVBQTBEQyxRQUExRCxFQUE2RTtBQUNoRixNQUFJQyxNQUFNLEdBQUduQyxJQUFJLENBQUNtQyxNQUFsQjs7QUFDQSxNQUFJQSxNQUFKLEVBQVk7QUFDUnBDLElBQUFBLG9CQUFvQixDQUFDb0MsTUFBRCxFQUFTLElBQVQsQ0FBcEI7QUFDQTVELElBQUFBLElBQUksQ0FBQ2lELGFBQUwsQ0FBbUI3QyxLQUFuQixFQUEwQnNELFFBQTFCLEVBQW9DM0QsSUFBSSxDQUFDOEQsTUFBTCxDQUFZakQsS0FBWixFQUFtQmdELE1BQU0sQ0FBQ25CLFlBQTFCLENBQXBDO0FBQ0F4QyxJQUFBQSxJQUFJLENBQUNpRCxRQUFMLENBQWN2QyxLQUFkLEVBQXFCVixJQUFJLENBQUNvRCxTQUFMLENBQWUxQyxLQUFmLEVBQXNCaUQsTUFBTSxDQUFDZixNQUE3QixDQUFyQixFQUEyRGMsUUFBM0Q7QUFDQWxDLElBQUFBLElBQUksQ0FBQ3FDLFdBQUwsQ0FBaUIxRCxLQUFqQjtBQUNBcUIsSUFBQUEsSUFBSSxDQUFDc0MsV0FBTCxDQUFpQnBELEtBQWpCO0FBQ0gsR0FORCxNQU1PO0FBQ0hjLElBQUFBLElBQUksQ0FBQ3FDLFdBQUwsQ0FBaUJKLFFBQWpCO0FBQ0FqQyxJQUFBQSxJQUFJLENBQUNzQyxXQUFMLENBQWlCSixRQUFqQjtBQUNIO0FBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IHsgSVZlYzNMaWtlLCBJUXVhdExpa2UgfSBmcm9tICcuLi9zcGVjL2ktY29tbW9uJztcblxuZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ2Z5VmVjMyAodmFsdWU6IElWZWMzTGlrZSk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBgKHg6ICR7dmFsdWUueH0sIHk6ICR7dmFsdWUueX0sIHo6ICR7dmFsdWUuen0pYDsgICAgXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdHJpbmdmeVF1YXQgKHZhbHVlOiBJUXVhdExpa2UpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYCh4OiAke3ZhbHVlLnh9LCB5OiAke3ZhbHVlLnl9LCB6OiAke3ZhbHVlLnp9LCB3OiAke3ZhbHVlLnd9KWA7XG59XG5cbmludGVyZmFjZSBJV3JhcHBlZDxUPiB7XG4gICAgX19jY193cmFwcGVyX186IFQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRXcmFwPFdyYXBwZXI+IChvYmplY3Q6IGFueSwgd3JhcHBlcjogV3JhcHBlcikge1xuICAgIChvYmplY3QgYXMgSVdyYXBwZWQ8V3JhcHBlcj4pLl9fY2Nfd3JhcHBlcl9fID0gd3JhcHBlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFdyYXA8V3JhcHBlcj4gKG9iamVjdDogYW55KSB7XG4gICAgcmV0dXJuIChvYmplY3QgYXMgSVdyYXBwZWQ8V3JhcHBlcj4pLl9fY2Nfd3JhcHBlcl9fO1xufVxuXG5jb25zdCBMb2NhbERpcnR5RmxhZyA9IGNjLk5vZGUuX0xvY2FsRGlydHlGbGFnO1xuY29uc3QgUEhZU0lDU19UUlMgPSBMb2NhbERpcnR5RmxhZy5QSFlTSUNTX1RSUztcbmNvbnN0IEFMTF9UUlMgPSBMb2NhbERpcnR5RmxhZy5BTExfVFJTO1xuY29uc3QgU0tFVyA9IExvY2FsRGlydHlGbGFnLlNLRVc7XG5jb25zdCBGTEFHX1RSQU5TRk9STSA9IGNjLlJlbmRlckZsb3cuRkxBR19UUkFOU0ZPUk07XG5cbmNvbnN0IE1hdDMgPSBjYy5NYXQzO1xuY29uc3QgTWF0NCA9IGNjLk1hdDQ7XG5jb25zdCBWZWMzID0gY2MuVmVjMztcbmNvbnN0IFF1YXQgPSBjYy5RdWF0O1xuY29uc3QgVHJzID0gY2MuVHJzO1xuXG5jb25zdCBfbm9kZUFycmF5OiBBcnJheTxjYy5Ob2RlPiA9IFtdO1xuY29uc3QgX2xwb3MgPSBjYy52MygpO1xuY29uc3QgX2xyb3QgPSBjYy5xdWF0KCk7XG5jb25zdCBfbWF0MyA9IG5ldyBNYXQzKCk7XG5jb25zdCBfbWF0M20gPSBfbWF0My5tO1xuY29uc3QgX3F1YXQgPSBjYy5xdWF0KCk7XG5jb25zdCBfbWF0NCA9IGNjLm1hdDQoKTtcblxubGV0IF9ub2RlVHJhbnNmb3JtUmVjb3JkID0ge307XG5leHBvcnQgZnVuY3Rpb24gY2xlYXJOb2RlVHJhbnNmb3JtRGlydHlGbGFnICgpIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gX25vZGVUcmFuc2Zvcm1SZWNvcmQpIHtcbiAgICAgICAgbGV0IHBoeXNpY3NOb2RlID0gX25vZGVUcmFuc2Zvcm1SZWNvcmRba2V5XTtcbiAgICAgICAgcGh5c2ljc05vZGUuX2xvY2FsTWF0RGlydHkgJj0gfkFMTF9UUlM7XG4gICAgICAgIGlmICghKHBoeXNpY3NOb2RlLl9sb2NhbE1hdERpcnR5ICYgU0tFVykpIHtcbiAgICAgICAgICAgIHBoeXNpY3NOb2RlLl93b3JsZE1hdERpcnR5ID0gZmFsc2U7XG4gICAgICAgICAgICAhQ0NfTkFUSVZFUkVOREVSRVIgJiYgKHBoeXNpY3NOb2RlLl9yZW5kZXJGbGFnICY9IH5GTEFHX1RSQU5TRk9STSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX25vZGVUcmFuc2Zvcm1SZWNvcmQgPSB7fTtcbiAgICBfbm9kZUFycmF5Lmxlbmd0aCA9IDA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhck5vZGVUcmFuc2Zvcm1SZWNvcmQgKCkge1xuICAgIF9ub2RlVHJhbnNmb3JtUmVjb3JkID0ge307XG4gICAgX25vZGVBcnJheS5sZW5ndGggPSAwO1xufVxuXG4vKlxuICogVGhlIG1ldGhvZCBvZiBub2RlIGJhY2t0cmFjZSBpcyB1c2VkIHRvIG9wdGltaXplIHRoZSBjYWxjdWxhdGlvbiBvZiBnbG9iYWwgdHJhbnNmb3JtYXRpb24uIFxuICogTm9kZSBiYWNrdHJhY2UgaXMgY29udGludW91cyB1bnRpbCB0aGUgcGFyZW50IG5vZGUgaXMgZW1wdHkgb3IgdGhlIHBhcmVudCBub2RlIGhhcyBwZXJmb3JtZWQgdGhlIGNhbGN1bGF0aW9uIG9mIGdsb2JhbCB0cmFuc2Zvcm1hdGlvbi5cbiAqIFRoZSByZXN1bHQgb2YgYmFja3RyYWNlIHdpbGwgc3RvcmUgdGhlIG5vZGUgcmVsYXRpb25hbCBjaGFpbiBpbiB0aGUgYXJyYXkuIFxuICogVGhlIHByb2Nlc3Mgb2YgdHJhdmVyc2luZyBhcnJheSBpcyBlcXVpdmFsZW50IHRvIHRoZSBwcm9jZXNzIG9mIGdsb2JhbCB0cmFuc2Zvcm1hdGlvbiBmcm9tIHRoZSBwYXJlbnQgbm9kZSB0byB0aGUgcGh5c2ljYWwgbm9kZS5cbiAqIFRoZSBjYWxjdWxhdGVkIHJlc3VsdHMgYXJlIHNhdmVkIGluIHRoZSBub2RlLCBhbmQgdGhlIHBoeXNpY2FsIGdsb2JhbCB0cmFuc2Zvcm1hdGlvbiBmbGFnIHdpbGwgYmUgZXJhc2VkIGZpbmFsbHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVXb3JsZFRyYW5zZm9ybSAobm9kZTogY2MuTm9kZSwgdHJhdmVyc2VBbGxOb2RlOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBsZXQgY3VyID0gbm9kZTtcbiAgICBsZXQgaSA9IDA7XG4gICAgbGV0IG5lZWRVcGRhdGVUcmFuc2Zvcm0gPSBmYWxzZTtcbiAgICBsZXQgcGh5c2ljc0RpcnR5RmxhZyA9IDA7XG4gICAgd2hpbGUgKGN1cikge1xuICAgICAgICAvLyBJZiBjdXJyZW50IG5vZGUgdHJhbnNmb3JtIGhhcyBiZWVuIGNhbGN1bGF0ZWRcbiAgICAgICAgaWYgKHRyYXZlcnNlQWxsTm9kZSB8fCAhX25vZGVUcmFuc2Zvcm1SZWNvcmRbY3VyLl9pZF0pIHtcbiAgICAgICAgICAgIF9ub2RlQXJyYXlbaSsrXSA9IGN1cjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEN1cnJlbnQgbm9kZSdzIHRyYW5zZm9ybSBoYXMgYmVlZCBjYWxjdWxhdGVkXG4gICAgICAgICAgICBwaHlzaWNzRGlydHlGbGFnIHw9IChjdXIuX2xvY2FsTWF0RGlydHkgJiBQSFlTSUNTX1RSUyk7XG4gICAgICAgICAgICBuZWVkVXBkYXRlVHJhbnNmb3JtID0gbmVlZFVwZGF0ZVRyYW5zZm9ybSB8fCAhIXBoeXNpY3NEaXJ0eUZsYWc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoY3VyLl9sb2NhbE1hdERpcnR5ICYgUEhZU0lDU19UUlMpIHtcbiAgICAgICAgICAgIG5lZWRVcGRhdGVUcmFuc2Zvcm0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGN1ciA9IGN1ci5fcGFyZW50O1xuICAgIH1cbiAgICBpZiAoIW5lZWRVcGRhdGVUcmFuc2Zvcm0pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxldCBjaGlsZDtcbiAgICBsZXQgY2hpbGRXb3JsZE1hdCwgY3VyV29ybGRNYXQsIGNoaWxkVHJzLCBjaGlsZExvY2FsTWF0O1xuICAgIGxldCB3cG9zLCB3cm90LCB3c2NhbGU7XG5cbiAgICBfbm9kZUFycmF5Lmxlbmd0aCA9IGk7XG4gICAgd2hpbGUgKGkpIHtcbiAgICAgICAgY2hpbGQgPSBfbm9kZUFycmF5Wy0taV07XG4gICAgICAgICF0cmF2ZXJzZUFsbE5vZGUgJiYgKF9ub2RlVHJhbnNmb3JtUmVjb3JkW2NoaWxkLl9pZF0gPSBjaGlsZCk7XG5cbiAgICAgICAgY2hpbGRXb3JsZE1hdCA9IGNoaWxkLl93b3JsZE1hdHJpeDtcbiAgICAgICAgY2hpbGRMb2NhbE1hdCA9IGNoaWxkLl9tYXRyaXg7XG4gICAgICAgIGNoaWxkVHJzID0gY2hpbGQuX3RycztcblxuICAgICAgICB3cG9zID0gY2hpbGQuX193cG9zID0gY2hpbGQuX193cG9zIHx8IGNjLnYzKCk7XG4gICAgICAgIHdyb3QgPSBjaGlsZC5fX3dyb3QgPSBjaGlsZC5fX3dyb3QgfHwgY2MucXVhdCgpO1xuICAgICAgICB3c2NhbGUgPSBjaGlsZC5fX3dzY2FsZSA9IGNoaWxkLl9fd3NjYWxlIHx8IGNjLnYzKCk7XG5cbiAgICAgICAgaWYgKGNoaWxkLl9sb2NhbE1hdERpcnR5ICYgUEhZU0lDU19UUlMpIHtcbiAgICAgICAgICAgIFRycy50b01hdDQoY2hpbGRMb2NhbE1hdCwgY2hpbGRUcnMpO1xuICAgICAgICB9XG4gICAgICAgIGNoaWxkLl9sb2NhbE1hdERpcnR5IHw9IHBoeXNpY3NEaXJ0eUZsYWc7XG4gICAgICAgIHBoeXNpY3NEaXJ0eUZsYWcgfD0gKGNoaWxkLl9sb2NhbE1hdERpcnR5ICYgUEhZU0lDU19UUlMpO1xuXG4gICAgICAgIGlmICghKHBoeXNpY3NEaXJ0eUZsYWcgJiBQSFlTSUNTX1RSUykpIHtcbiAgICAgICAgICAgIGN1ciA9IGNoaWxkO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3VyKSB7XG4gICAgICAgICAgICBjdXJXb3JsZE1hdCA9IGN1ci5fd29ybGRNYXRyaXg7XG4gICAgICAgICAgICBUcnMudG9Qb3NpdGlvbihfbHBvcywgY2hpbGRUcnMpO1xuICAgICAgICAgICAgVmVjMy50cmFuc2Zvcm1NYXQ0KHdwb3MsIF9scG9zLCBjdXJXb3JsZE1hdCk7XG5cbiAgICAgICAgICAgIE1hdDQubXVsdGlwbHkoY2hpbGRXb3JsZE1hdCwgY3VyV29ybGRNYXQsIGNoaWxkTG9jYWxNYXQpO1xuICAgICAgICAgICAgVHJzLnRvUm90YXRpb24oX2xyb3QsIGNoaWxkVHJzKTtcbiAgICAgICAgICAgIFF1YXQubXVsdGlwbHkod3JvdCwgY3VyLl9fd3JvdCwgX2xyb3QpO1xuXG4gICAgICAgICAgICBNYXQzLmZyb21RdWF0KF9tYXQzLCBRdWF0LmNvbmp1Z2F0ZShfcXVhdCwgd3JvdCkpO1xuICAgICAgICAgICAgTWF0My5tdWx0aXBseU1hdDQoX21hdDMsIF9tYXQzLCBjaGlsZFdvcmxkTWF0KTtcbiAgICAgICAgICAgIHdzY2FsZS54ID0gX21hdDNtWzBdO1xuICAgICAgICAgICAgd3NjYWxlLnkgPSBfbWF0M21bNF07XG4gICAgICAgICAgICB3c2NhbGUueiA9IF9tYXQzbVs4XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFRycy50b1Bvc2l0aW9uKHdwb3MsIGNoaWxkVHJzKTtcbiAgICAgICAgICAgIFRycy50b1JvdGF0aW9uKHdyb3QsIGNoaWxkVHJzKTtcbiAgICAgICAgICAgIFRycy50b1NjYWxlKHdzY2FsZSwgY2hpbGRUcnMpO1xuICAgICAgICAgICAgTWF0NC5jb3B5KGNoaWxkV29ybGRNYXQsIGNoaWxkTG9jYWxNYXQpO1xuICAgICAgICB9XG4gICAgICAgIGN1ciA9IGNoaWxkO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVdvcmxkUlQgKG5vZGU6IGNjLk5vZGUsIHBvc2l0aW9uOiBjYy5WZWMzLCByb3RhdGlvbjogY2MuUXVhdCkge1xuICAgIGxldCBwYXJlbnQgPSBub2RlLnBhcmVudDtcbiAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIHVwZGF0ZVdvcmxkVHJhbnNmb3JtKHBhcmVudCwgdHJ1ZSk7XG4gICAgICAgIFZlYzMudHJhbnNmb3JtTWF0NChfbHBvcywgcG9zaXRpb24sIE1hdDQuaW52ZXJ0KF9tYXQ0LCBwYXJlbnQuX3dvcmxkTWF0cml4KSk7XG4gICAgICAgIFF1YXQubXVsdGlwbHkoX3F1YXQsIFF1YXQuY29uanVnYXRlKF9xdWF0LCBwYXJlbnQuX193cm90KSwgcm90YXRpb24pO1xuICAgICAgICBub2RlLnNldFBvc2l0aW9uKF9scG9zKTtcbiAgICAgICAgbm9kZS5zZXRSb3RhdGlvbihfcXVhdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbm9kZS5zZXRQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgICAgIG5vZGUuc2V0Um90YXRpb24ocm90YXRpb24pO1xuICAgIH1cbn0iXX0=