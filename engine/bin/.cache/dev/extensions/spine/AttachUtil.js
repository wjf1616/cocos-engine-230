
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extensions/spine/AttachUtil.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _mat = _interopRequireDefault(require("../../cocos2d/core/value-types/mat4"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
var RenderFlow = require('../../cocos2d/core/renderer/render-flow');

var FLAG_TRANSFORM = RenderFlow.FLAG_TRANSFORM;

var EmptyHandle = function EmptyHandle() {};

var ATTACHED_ROOT_NAME = 'ATTACHED_NODE_TREE';
var ATTACHED_PRE_NAME = 'ATTACHED_NODE:';

var limitNode = function limitNode(node) {
  // attached node's world matrix update per frame
  Object.defineProperty(node, '_worldMatDirty', {
    get: function get() {
      return true;
    },
    set: function set(value) {
      /* do nothing */
    }
  }); // shield world matrix calculate interface

  node._calculWorldMatrix = EmptyHandle;
  node._mulMat = EmptyHandle;
};

var _tempMat4 = new _mat["default"]();
/**
 * @module sp
 */

/**
 * !#en Attach node tool
 * !#zh 挂点工具类
 * @class sp.AttachUtil
 */


var AttachUtil = cc.Class({
  name: 'sp.AttachUtil',
  ctor: function ctor() {
    this._inited = false;
    this._skeleton = null;
    this._skeletonNode = null;
    this._skeletonComp = null;
    this._attachedRootNode = null;
    this._attachedNodeArray = [];
    this._boneIndexToNode = {};
  },
  init: function init(skeletonComp) {
    this._inited = true;
    this._skeleton = skeletonComp._skeleton;
    this._skeletonNode = skeletonComp.node;
    this._skeletonComp = skeletonComp;
  },
  reset: function reset() {
    this._inited = false;
    this._skeleton = null;
    this._skeletonNode = null;
    this._skeletonComp = null;
  },
  _prepareAttachNode: function _prepareAttachNode() {
    var armature = this._skeleton;

    if (!armature) {
      return;
    }

    var rootNode = this._skeletonNode.getChildByName(ATTACHED_ROOT_NAME);

    if (!rootNode || !rootNode.isValid) {
      rootNode = new cc.Node(ATTACHED_ROOT_NAME);
      limitNode(rootNode);

      this._skeletonNode.addChild(rootNode);
    }

    var isCached = this._skeletonComp.isAnimationCached();

    if (isCached && this._skeletonComp._frameCache) {
      this._skeletonComp._frameCache.enableCacheAttachedInfo();
    }

    this._attachedRootNode = rootNode;
    return rootNode;
  },
  _buildBoneAttachedNode: function _buildBoneAttachedNode(bone, boneIndex) {
    var boneNodeName = ATTACHED_PRE_NAME + bone.data.name;
    var boneNode = new cc.Node(boneNodeName);

    this._buildBoneRelation(boneNode, bone, boneIndex);

    return boneNode;
  },
  _buildBoneRelation: function _buildBoneRelation(boneNode, bone, boneIndex) {
    limitNode(boneNode);
    boneNode._bone = bone;
    boneNode._boneIndex = boneIndex;

    this._attachedNodeArray.push(boneNode);

    this._boneIndexToNode[boneIndex] = boneNode;
  },

  /**
   * !#en Gets attached root node.
   * !#zh 获取挂接节点树的根节点
   * @method getAttachedRootNode
   * @return {cc.Node}
   */
  getAttachedRootNode: function getAttachedRootNode() {
    return this._attachedRootNode;
  },

  /**
   * !#en Gets attached node which you want.
   * !#zh 获得对应的挂点
   * @method getAttachedNodes
   * @param {String} boneName
   * @return {Node[]}
   */
  getAttachedNodes: function getAttachedNodes(boneName) {
    var nodeArray = this._attachedNodeArray;
    var res = [];
    if (!this._inited) return res;

    for (var i = 0, n = nodeArray.length; i < n; i++) {
      var boneNode = nodeArray[i];
      if (!boneNode || !boneNode.isValid) continue;

      if (boneNode.name === ATTACHED_PRE_NAME + boneName) {
        res.push(boneNode);
      }
    }

    return res;
  },
  _rebuildNodeArray: function _rebuildNodeArray() {
    var findMap = this._boneIndexToNode = {};
    var oldNodeArray = this._attachedNodeArray;
    var nodeArray = this._attachedNodeArray = [];

    for (var i = 0, n = oldNodeArray.length; i < n; i++) {
      var boneNode = oldNodeArray[i];
      if (!boneNode || !boneNode.isValid || boneNode._toRemove) continue;
      nodeArray.push(boneNode);
      findMap[boneNode._boneIndex] = boneNode;
    }
  },
  _sortNodeArray: function _sortNodeArray() {
    var nodeArray = this._attachedNodeArray;
    nodeArray.sort(function (a, b) {
      return a._boneIndex < b._boneIndex ? -1 : 1;
    });
  },
  _getNodeByBoneIndex: function _getNodeByBoneIndex(boneIndex) {
    var findMap = this._boneIndexToNode;
    var boneNode = findMap[boneIndex];
    if (!boneNode || !boneNode.isValid) return null;
    return boneNode;
  },

  /**
   * !#en Destroy attached node which you want.
   * !#zh 销毁对应的挂点
   * @method destroyAttachedNodes
   * @param {String} boneName
   */
  destroyAttachedNodes: function destroyAttachedNodes(boneName) {
    if (!this._inited) return;
    var nodeArray = this._attachedNodeArray;

    var markTree = function markTree(rootNode) {
      var children = rootNode.children;

      for (var i = 0, n = children.length; i < n; i++) {
        var c = children[i];
        if (c) markTree(c);
      }

      rootNode._toRemove = true;
    };

    for (var i = 0, n = nodeArray.length; i < n; i++) {
      var boneNode = nodeArray[i];
      if (!boneNode || !boneNode.isValid) continue;
      var delName = boneNode.name.split(ATTACHED_PRE_NAME)[1];

      if (delName === boneName) {
        markTree(boneNode);
        boneNode.removeFromParent(true);
        boneNode.destroy();
        nodeArray[i] = null;
      }
    }

    this._rebuildNodeArray();
  },

  /**
   * !#en Traverse all bones to generate the minimum node tree containing the given bone names, NOTE that make sure the skeleton has initialized before calling this interface.
   * !#zh 遍历所有插槽，生成包含所有给定插槽名称的最小节点树，注意，调用该接口前请确保骨骼动画已经初始化好。
   * @method generateAttachedNodes
   * @param {String} boneName
   * @return {Node[]} attached node array
   */
  generateAttachedNodes: function generateAttachedNodes(boneName) {
    var targetNodes = [];
    if (!this._inited) return targetNodes;

    var rootNode = this._prepareAttachNode();

    if (!rootNode) return targetNodes;
    var res = [];
    var bones = this._skeleton.bones;

    for (var i = 0, n = bones.length; i < n; i++) {
      var bone = bones[i];
      var boneData = bone.data;

      if (boneData.name == boneName) {
        res.push(bone);
      }
    }

    var buildBoneTree = function (bone) {
      if (!bone) return;
      var boneData = bone.data;

      var boneNode = this._getNodeByBoneIndex(boneData.index);

      if (boneNode) return boneNode;
      boneNode = this._buildBoneAttachedNode(bone, boneData.index);
      var parentBoneNode = buildBoneTree(bone.parent) || rootNode;
      boneNode.parent = parentBoneNode;
      return boneNode;
    }.bind(this);

    for (var _i = 0, _n = res.length; _i < _n; _i++) {
      var targetNode = buildBoneTree(res[_i]);
      targetNodes.push(targetNode);
    }

    this._sortNodeArray();

    return targetNodes;
  },

  /**
   * !#en Destroy all attached node.
   * !#zh 销毁所有挂点
   * @method destroyAllAttachedNodes
   */
  destroyAllAttachedNodes: function destroyAllAttachedNodes() {
    this._attachedRootNode = null;
    this._attachedNodeArray.length = 0;
    this._boneIndexToNode = {};
    if (!this._inited) return;

    var rootNode = this._skeletonNode.getChildByName(ATTACHED_ROOT_NAME);

    if (rootNode) {
      rootNode.removeFromParent(true);
      rootNode.destroy();
      rootNode = null;
    }
  },

  /**
   * !#en Traverse all bones to generate a tree containing all bones nodes, NOTE that make sure the skeleton has initialized before calling this interface.
   * !#zh 遍历所有插槽，生成包含所有插槽的节点树，注意，调用该接口前请确保骨骼动画已经初始化好。
   * @method generateAllAttachedNodes
   * @return {cc.Node} root node
   */
  generateAllAttachedNodes: function generateAllAttachedNodes() {
    if (!this._inited) return; // clear all records

    this._boneIndexToNode = {};
    this._attachedNodeArray.length = 0;

    var rootNode = this._prepareAttachNode();

    if (!rootNode) return;
    var bones = this._skeleton.bones;

    for (var i = 0, n = bones.length; i < n; i++) {
      var bone = bones[i];
      var boneData = bone.data;
      var parentNode = null;

      if (bone.parent) {
        var parentIndex = bone.parent.data.index;
        parentNode = this._boneIndexToNode[parentIndex];
      } else {
        parentNode = rootNode;
      }

      if (parentNode) {
        var boneNode = parentNode.getChildByName(ATTACHED_PRE_NAME + boneData.name);

        if (!boneNode || !boneNode.isValid) {
          boneNode = this._buildBoneAttachedNode(bone, boneData.index);
          parentNode.addChild(boneNode);
        } else {
          this._buildBoneRelation(boneNode, bone, boneData.index);
        }
      }
    }

    return rootNode;
  },
  _hasAttachedNode: function _hasAttachedNode() {
    if (!this._inited) return false;

    var attachedRootNode = this._skeletonNode.getChildByName(ATTACHED_ROOT_NAME);

    return !!attachedRootNode;
  },
  _associateAttachedNode: function _associateAttachedNode() {
    if (!this._inited) return;

    var rootNode = this._skeletonNode.getChildByName(ATTACHED_ROOT_NAME);

    if (!rootNode || !rootNode.isValid) return;
    this._attachedRootNode = rootNode; // clear all records

    this._boneIndexToNode = {};
    var nodeArray = this._attachedNodeArray;
    nodeArray.length = 0;
    limitNode(rootNode);

    if (!CC_NATIVERENDERER) {
      var isCached = this._skeletonComp.isAnimationCached();

      if (isCached && this._skeletonComp._frameCache) {
        this._skeletonComp._frameCache.enableCacheAttachedInfo();
      }
    }

    var bones = this._skeleton.bones;

    for (var i = 0, n = bones.length; i < n; i++) {
      var bone = bones[i];
      var boneData = bone.data;
      var parentNode = null;

      if (bone.parent) {
        var parentIndex = bone.parent.data.index;
        parentNode = this._boneIndexToNode[parentIndex];
      } else {
        parentNode = rootNode;
      }

      if (parentNode) {
        var boneNode = parentNode.getChildByName(ATTACHED_PRE_NAME + boneData.name);

        if (boneNode && boneNode.isValid) {
          this._buildBoneRelation(boneNode, bone, boneData.index);
        }
      }
    }
  },
  _syncAttachedNode: function _syncAttachedNode() {
    if (!this._inited) return;
    var rootNode = this._attachedRootNode;
    var nodeArray = this._attachedNodeArray;

    if (!rootNode || !rootNode.isValid) {
      this._attachedRootNode = null;
      nodeArray.length = 0;
      return;
    }

    var rootMatrix = this._skeletonNode._worldMatrix;

    _mat["default"].copy(rootNode._worldMatrix, rootMatrix);

    rootNode._renderFlag &= ~FLAG_TRANSFORM;
    var boneInfos = null;

    var isCached = this._skeletonComp.isAnimationCached();

    if (isCached) {
      boneInfos = this._skeletonComp._curFrame && this._skeletonComp._curFrame.boneInfos;
    } else {
      boneInfos = this._skeleton.bones;
    }

    if (!boneInfos) return;
    var mulMat = this._skeletonNode._mulMat;

    var matrixHandle = function matrixHandle(nodeMat, parentMat, bone) {
      var tm = _tempMat4.m;
      tm[0] = bone.a;
      tm[1] = bone.c;
      tm[4] = bone.b;
      tm[5] = bone.d;
      tm[12] = bone.worldX;
      tm[13] = bone.worldY;
      mulMat(nodeMat, parentMat, _tempMat4);
    };

    var nodeArrayDirty = false;

    for (var i = 0, n = nodeArray.length; i < n; i++) {
      var boneNode = nodeArray[i]; // Node has been destroy

      if (!boneNode || !boneNode.isValid) {
        nodeArray[i] = null;
        nodeArrayDirty = true;
        continue;
      }

      var bone = boneInfos[boneNode._boneIndex]; // Bone has been destroy

      if (!bone) {
        boneNode.removeFromParent(true);
        boneNode.destroy();
        nodeArray[i] = null;
        nodeArrayDirty = true;
        continue;
      }

      matrixHandle(boneNode._worldMatrix, rootNode._worldMatrix, bone);
      boneNode._renderFlag &= ~FLAG_TRANSFORM;
    }

    if (nodeArrayDirty) {
      this._rebuildNodeArray();
    }
  }
});
module.exports = sp.AttachUtil = AttachUtil;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF0dGFjaFV0aWwuanMiXSwibmFtZXMiOlsiUmVuZGVyRmxvdyIsInJlcXVpcmUiLCJGTEFHX1RSQU5TRk9STSIsIkVtcHR5SGFuZGxlIiwiQVRUQUNIRURfUk9PVF9OQU1FIiwiQVRUQUNIRURfUFJFX05BTUUiLCJsaW1pdE5vZGUiLCJub2RlIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXQiLCJzZXQiLCJ2YWx1ZSIsIl9jYWxjdWxXb3JsZE1hdHJpeCIsIl9tdWxNYXQiLCJfdGVtcE1hdDQiLCJNYXQ0IiwiQXR0YWNoVXRpbCIsImNjIiwiQ2xhc3MiLCJuYW1lIiwiY3RvciIsIl9pbml0ZWQiLCJfc2tlbGV0b24iLCJfc2tlbGV0b25Ob2RlIiwiX3NrZWxldG9uQ29tcCIsIl9hdHRhY2hlZFJvb3ROb2RlIiwiX2F0dGFjaGVkTm9kZUFycmF5IiwiX2JvbmVJbmRleFRvTm9kZSIsImluaXQiLCJza2VsZXRvbkNvbXAiLCJyZXNldCIsIl9wcmVwYXJlQXR0YWNoTm9kZSIsImFybWF0dXJlIiwicm9vdE5vZGUiLCJnZXRDaGlsZEJ5TmFtZSIsImlzVmFsaWQiLCJOb2RlIiwiYWRkQ2hpbGQiLCJpc0NhY2hlZCIsImlzQW5pbWF0aW9uQ2FjaGVkIiwiX2ZyYW1lQ2FjaGUiLCJlbmFibGVDYWNoZUF0dGFjaGVkSW5mbyIsIl9idWlsZEJvbmVBdHRhY2hlZE5vZGUiLCJib25lIiwiYm9uZUluZGV4IiwiYm9uZU5vZGVOYW1lIiwiZGF0YSIsImJvbmVOb2RlIiwiX2J1aWxkQm9uZVJlbGF0aW9uIiwiX2JvbmUiLCJfYm9uZUluZGV4IiwicHVzaCIsImdldEF0dGFjaGVkUm9vdE5vZGUiLCJnZXRBdHRhY2hlZE5vZGVzIiwiYm9uZU5hbWUiLCJub2RlQXJyYXkiLCJyZXMiLCJpIiwibiIsImxlbmd0aCIsIl9yZWJ1aWxkTm9kZUFycmF5IiwiZmluZE1hcCIsIm9sZE5vZGVBcnJheSIsIl90b1JlbW92ZSIsIl9zb3J0Tm9kZUFycmF5Iiwic29ydCIsImEiLCJiIiwiX2dldE5vZGVCeUJvbmVJbmRleCIsImRlc3Ryb3lBdHRhY2hlZE5vZGVzIiwibWFya1RyZWUiLCJjaGlsZHJlbiIsImMiLCJkZWxOYW1lIiwic3BsaXQiLCJyZW1vdmVGcm9tUGFyZW50IiwiZGVzdHJveSIsImdlbmVyYXRlQXR0YWNoZWROb2RlcyIsInRhcmdldE5vZGVzIiwiYm9uZXMiLCJib25lRGF0YSIsImJ1aWxkQm9uZVRyZWUiLCJpbmRleCIsInBhcmVudEJvbmVOb2RlIiwicGFyZW50IiwiYmluZCIsInRhcmdldE5vZGUiLCJkZXN0cm95QWxsQXR0YWNoZWROb2RlcyIsImdlbmVyYXRlQWxsQXR0YWNoZWROb2RlcyIsInBhcmVudE5vZGUiLCJwYXJlbnRJbmRleCIsIl9oYXNBdHRhY2hlZE5vZGUiLCJhdHRhY2hlZFJvb3ROb2RlIiwiX2Fzc29jaWF0ZUF0dGFjaGVkTm9kZSIsIkNDX05BVElWRVJFTkRFUkVSIiwiX3N5bmNBdHRhY2hlZE5vZGUiLCJyb290TWF0cml4IiwiX3dvcmxkTWF0cml4IiwiY29weSIsIl9yZW5kZXJGbGFnIiwiYm9uZUluZm9zIiwiX2N1ckZyYW1lIiwibXVsTWF0IiwibWF0cml4SGFuZGxlIiwibm9kZU1hdCIsInBhcmVudE1hdCIsInRtIiwibSIsImQiLCJ3b3JsZFgiLCJ3b3JsZFkiLCJub2RlQXJyYXlEaXJ0eSIsIm1vZHVsZSIsImV4cG9ydHMiLCJzcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQXlCQTs7OztBQXpCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLElBQU1BLFVBQVUsR0FBR0MsT0FBTyxDQUFDLHlDQUFELENBQTFCOztBQUNBLElBQU1DLGNBQWMsR0FBR0YsVUFBVSxDQUFDRSxjQUFsQzs7QUFDQSxJQUFNQyxXQUFXLEdBQUcsU0FBZEEsV0FBYyxHQUFZLENBQUUsQ0FBbEM7O0FBQ0EsSUFBTUMsa0JBQWtCLEdBQUcsb0JBQTNCO0FBQ0EsSUFBTUMsaUJBQWlCLEdBQUcsZ0JBQTFCOztBQUNBLElBQU1DLFNBQVMs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USxDQUFDNEIsZ0JBQVQsQ0FBMEIsSUFBMUI7QUFDQTVCLFFBQUFBLFFBQVEsQ0FBQzZCLE9BQVQ7QUFDQXJCLFFBQUFBLFNBQVMsQ0FBQ0UsQ0FBRCxDQUFULEdBQWUsSUFBZjtBQUNBc0QsUUFBQUEsY0FBYyxHQUFHLElBQWpCO0FBQ0E7QUFDSDs7QUFDRFIsTUFBQUEsWUFBWSxDQUFDeEQsUUFBUSxDQUFDa0QsWUFBVixFQUF3QmhFLFFBQVEsQ0FBQ2dFLFlBQWpDLEVBQStDdEQsSUFBL0MsQ0FBWjtBQUNBSSxNQUFBQSxRQUFRLENBQUNvRCxXQUFULElBQXdCLENBQUNsRyxjQUF6QjtBQUNIOztBQUNELFFBQUk4RyxjQUFKLEVBQW9CO0FBQ2hCLFdBQUtuRCxpQkFBTDtBQUNIO0FBQ0o7QUFyWHFCLENBQVQsQ0FBakI7QUF3WEFvRCxNQUFNLENBQUNDLE9BQVAsR0FBaUJDLEVBQUUsQ0FBQ2xHLFVBQUgsR0FBZ0JBLFVBQWpDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTkgWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCBNYXQ0IGZyb20gJy4uLy4uL2NvY29zMmQvY29yZS92YWx1ZS10eXBlcy9tYXQ0JztcbmNvbnN0IFJlbmRlckZsb3cgPSByZXF1aXJlKCcuLi8uLi9jb2NvczJkL2NvcmUvcmVuZGVyZXIvcmVuZGVyLWZsb3cnKTtcbmNvbnN0IEZMQUdfVFJBTlNGT1JNID0gUmVuZGVyRmxvdy5GTEFHX1RSQU5TRk9STTtcbmNvbnN0IEVtcHR5SGFuZGxlID0gZnVuY3Rpb24gKCkge31cbmNvbnN0IEFUVEFDSEVEX1JPT1RfTkFNRSA9ICdBVFRBQ0hFRF9OT0RFX1RSRUUnO1xuY29uc3QgQVRUQUNIRURfUFJFX05BTUUgPSAnQVRUQUNIRURfTk9ERTonO1xuY29uc3QgbGltaXROb2RlID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAvLyBhdHRhY2hlZCBub2RlJ3Mgd29ybGQgbWF0cml4IHVwZGF0ZSBwZXIgZnJhbWVcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobm9kZSwgJ193b3JsZE1hdERpcnR5Jywge1xuICAgICAgICBnZXQgKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgICAgICAgc2V0ICh2YWx1ZSkgey8qIGRvIG5vdGhpbmcgKi99XG4gICAgfSk7XG4gICAgLy8gc2hpZWxkIHdvcmxkIG1hdHJpeCBjYWxjdWxhdGUgaW50ZXJmYWNlXG4gICAgbm9kZS5fY2FsY3VsV29ybGRNYXRyaXggPSBFbXB0eUhhbmRsZTtcbiAgICBub2RlLl9tdWxNYXQgPSBFbXB0eUhhbmRsZTtcbn07XG5sZXQgX3RlbXBNYXQ0ID0gbmV3IE1hdDQoKTtcblxuLyoqXG4gKiBAbW9kdWxlIHNwXG4gKi9cblxuLyoqXG4gKiAhI2VuIEF0dGFjaCBub2RlIHRvb2xcbiAqICEjemgg5oyC54K55bel5YW357G7XG4gKiBAY2xhc3Mgc3AuQXR0YWNoVXRpbFxuICovXG5sZXQgQXR0YWNoVXRpbCA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnc3AuQXR0YWNoVXRpbCcsXG5cbiAgICBjdG9yICgpIHtcbiAgICAgICAgdGhpcy5faW5pdGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3NrZWxldG9uID0gbnVsbDtcbiAgICAgICAgdGhpcy5fc2tlbGV0b25Ob2RlID0gbnVsbDtcbiAgICAgICAgdGhpcy5fc2tlbGV0b25Db21wID0gbnVsbDtcblxuICAgICAgICB0aGlzLl9hdHRhY2hlZFJvb3ROb2RlID0gbnVsbDtcbiAgICAgICAgdGhpcy5fYXR0YWNoZWROb2RlQXJyYXkgPSBbXTtcbiAgICAgICAgdGhpcy5fYm9uZUluZGV4VG9Ob2RlID0ge307XG4gICAgfSxcblxuICAgIGluaXQgKHNrZWxldG9uQ29tcCkge1xuICAgICAgICB0aGlzLl9pbml0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLl9za2VsZXRvbiA9IHNrZWxldG9uQ29tcC5fc2tlbGV0b247XG4gICAgICAgIHRoaXMuX3NrZWxldG9uTm9kZSA9IHNrZWxldG9uQ29tcC5ub2RlO1xuICAgICAgICB0aGlzLl9za2VsZXRvbkNvbXAgPSBza2VsZXRvbkNvbXA7XG4gICAgfSxcblxuICAgIHJlc2V0ICgpIHtcbiAgICAgICAgdGhpcy5faW5pdGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3NrZWxldG9uID0gbnVsbDtcbiAgICAgICAgdGhpcy5fc2tlbGV0b25Ob2RlID0gbnVsbDtcbiAgICAgICAgdGhpcy5fc2tlbGV0b25Db21wID0gbnVsbDtcbiAgICB9LFxuXG4gICAgX3ByZXBhcmVBdHRhY2hOb2RlICgpIHtcbiAgICAgICAgbGV0IGFybWF0dXJlID0gdGhpcy5fc2tlbGV0b247XG4gICAgICAgIGlmICghYXJtYXR1cmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByb290Tm9kZSA9IHRoaXMuX3NrZWxldG9uTm9kZS5nZXRDaGlsZEJ5TmFtZShBVFRBQ0hFRF9ST09UX05BTUUpO1xuICAgICAgICBpZiAoIXJvb3ROb2RlIHx8ICFyb290Tm9kZS5pc1ZhbGlkKSB7XG4gICAgICAgICAgICByb290Tm9kZSA9IG5ldyBjYy5Ob2RlKEFUVEFDSEVEX1JPT1RfTkFNRSk7XG4gICAgICAgICAgICBsaW1pdE5vZGUocm9vdE5vZGUpO1xuICAgICAgICAgICAgdGhpcy5fc2tlbGV0b25Ob2RlLmFkZENoaWxkKHJvb3ROb2RlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpc0NhY2hlZCA9IHRoaXMuX3NrZWxldG9uQ29tcC5pc0FuaW1hdGlvbkNhY2hlZCgpO1xuICAgICAgICBpZiAoaXNDYWNoZWQgJiYgdGhpcy5fc2tlbGV0b25Db21wLl9mcmFtZUNhY2hlKSB7XG4gICAgICAgICAgICB0aGlzLl9za2VsZXRvbkNvbXAuX2ZyYW1lQ2FjaGUuZW5hYmxlQ2FjaGVBdHRhY2hlZEluZm8oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2F0dGFjaGVkUm9vdE5vZGUgPSByb290Tm9kZTtcbiAgICAgICAgcmV0dXJuIHJvb3ROb2RlO1xuICAgIH0sXG5cbiAgICBfYnVpbGRCb25lQXR0YWNoZWROb2RlIChib25lLCBib25lSW5kZXgpIHtcbiAgICAgICAgbGV0IGJvbmVOb2RlTmFtZSA9IEFUVEFDSEVEX1BSRV9OQU1FICsgYm9uZS5kYXRhLm5hbWU7XG4gICAgICAgIGxldCBib25lTm9kZSA9IG5ldyBjYy5Ob2RlKGJvbmVOb2RlTmFtZSk7XG4gICAgICAgIHRoaXMuX2J1aWxkQm9uZVJlbGF0aW9uKGJvbmVOb2RlLCBib25lLCBib25lSW5kZXgpO1xuICAgICAgICByZXR1cm4gYm9uZU5vZGU7XG4gICAgfSxcblxuICAgIF9idWlsZEJvbmVSZWxhdGlvbiAoYm9uZU5vZGUsIGJvbmUsIGJvbmVJbmRleCkge1xuICAgICAgICBsaW1pdE5vZGUoYm9uZU5vZGUpO1xuICAgICAgICBib25lTm9kZS5fYm9uZSA9IGJvbmU7XG4gICAgICAgIGJvbmVOb2RlLl9ib25lSW5kZXggPSBib25lSW5kZXg7XG4gICAgICAgIHRoaXMuX2F0dGFjaGVkTm9kZUFycmF5LnB1c2goYm9uZU5vZGUpO1xuICAgICAgICB0aGlzLl9ib25lSW5kZXhUb05vZGVbYm9uZUluZGV4XSA9IGJvbmVOb2RlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldHMgYXR0YWNoZWQgcm9vdCBub2RlLlxuICAgICAqICEjemgg6I635Y+W5oyC5o6l6IqC54K55qCR55qE5qC56IqC54K5XG4gICAgICogQG1ldGhvZCBnZXRBdHRhY2hlZFJvb3ROb2RlXG4gICAgICogQHJldHVybiB7Y2MuTm9kZX1cbiAgICAgKi9cbiAgICBnZXRBdHRhY2hlZFJvb3ROb2RlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2F0dGFjaGVkUm9vdE5vZGU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0cyBhdHRhY2hlZCBub2RlIHdoaWNoIHlvdSB3YW50LlxuICAgICAqICEjemgg6I635b6X5a+55bqU55qE5oyC54K5XG4gICAgICogQG1ldGhvZCBnZXRBdHRhY2hlZE5vZGVzXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGJvbmVOYW1lXG4gICAgICogQHJldHVybiB7Tm9kZVtdfVxuICAgICAqL1xuICAgIGdldEF0dGFjaGVkTm9kZXMgKGJvbmVOYW1lKSB7XG4gICAgICAgIGxldCBub2RlQXJyYXkgPSB0aGlzLl9hdHRhY2hlZE5vZGVBcnJheTtcbiAgICAgICAgbGV0IHJlcyA9IFtdO1xuICAgICAgICBpZiAoIXRoaXMuX2luaXRlZCkgcmV0dXJuIHJlcztcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIG4gPSBub2RlQXJyYXkubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgYm9uZU5vZGUgPSBub2RlQXJyYXlbaV07XG4gICAgICAgICAgICBpZiAoIWJvbmVOb2RlIHx8ICFib25lTm9kZS5pc1ZhbGlkKSBjb250aW51ZTtcbiAgICAgICAgICAgIGlmIChib25lTm9kZS5uYW1lID09PSBBVFRBQ0hFRF9QUkVfTkFNRSArIGJvbmVOYW1lKSB7XG4gICAgICAgICAgICAgICAgcmVzLnB1c2goYm9uZU5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfSxcblxuICAgIF9yZWJ1aWxkTm9kZUFycmF5ICgpIHtcbiAgICAgICAgbGV0IGZpbmRNYXAgPSB0aGlzLl9ib25lSW5kZXhUb05vZGUgPSB7fTtcbiAgICAgICAgbGV0IG9sZE5vZGVBcnJheSA9IHRoaXMuX2F0dGFjaGVkTm9kZUFycmF5O1xuICAgICAgICBsZXQgbm9kZUFycmF5ID0gdGhpcy5fYXR0YWNoZWROb2RlQXJyYXkgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIG4gPSBvbGROb2RlQXJyYXkubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgYm9uZU5vZGUgPSBvbGROb2RlQXJyYXlbaV07XG4gICAgICAgICAgICBpZiAoIWJvbmVOb2RlIHx8ICFib25lTm9kZS5pc1ZhbGlkIHx8IGJvbmVOb2RlLl90b1JlbW92ZSkgY29udGludWU7XG4gICAgICAgICAgICBub2RlQXJyYXkucHVzaChib25lTm9kZSk7XG4gICAgICAgICAgICBmaW5kTWFwW2JvbmVOb2RlLl9ib25lSW5kZXhdID0gYm9uZU5vZGU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3NvcnROb2RlQXJyYXkgKCkge1xuICAgICAgICBsZXQgbm9kZUFycmF5ID0gdGhpcy5fYXR0YWNoZWROb2RlQXJyYXk7XG4gICAgICAgIG5vZGVBcnJheS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYS5fYm9uZUluZGV4IDwgYi5fYm9uZUluZGV4PyAtMSA6IDE7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBfZ2V0Tm9kZUJ5Qm9uZUluZGV4IChib25lSW5kZXgpIHtcbiAgICAgICAgbGV0IGZpbmRNYXAgPSB0aGlzLl9ib25lSW5kZXhUb05vZGU7XG4gICAgICAgIGxldCBib25lTm9kZSA9IGZpbmRNYXBbYm9uZUluZGV4XTtcbiAgICAgICAgaWYgKCFib25lTm9kZSB8fCAhYm9uZU5vZGUuaXNWYWxpZCkgcmV0dXJuIG51bGw7XG4gICAgICAgIHJldHVybiBib25lTm9kZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBEZXN0cm95IGF0dGFjaGVkIG5vZGUgd2hpY2ggeW91IHdhbnQuXG4gICAgICogISN6aCDplIDmr4Hlr7nlupTnmoTmjILngrlcbiAgICAgKiBAbWV0aG9kIGRlc3Ryb3lBdHRhY2hlZE5vZGVzXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGJvbmVOYW1lXG4gICAgICovXG4gICAgZGVzdHJveUF0dGFjaGVkTm9kZXMgKGJvbmVOYW1lKSB7XG4gICAgICAgIGlmICghdGhpcy5faW5pdGVkKSByZXR1cm47XG5cbiAgICAgICAgbGV0IG5vZGVBcnJheSA9IHRoaXMuX2F0dGFjaGVkTm9kZUFycmF5O1xuICAgICAgICBsZXQgbWFya1RyZWUgPSBmdW5jdGlvbiAocm9vdE5vZGUpIHtcbiAgICAgICAgICAgIGxldCBjaGlsZHJlbiA9IHJvb3ROb2RlLmNoaWxkcmVuO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIG4gPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgYyA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgICAgIGlmIChjKSBtYXJrVHJlZShjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJvb3ROb2RlLl90b1JlbW92ZSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbiA9IG5vZGVBcnJheS5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBib25lTm9kZSA9IG5vZGVBcnJheVtpXTtcbiAgICAgICAgICAgIGlmICghYm9uZU5vZGUgfHwgIWJvbmVOb2RlLmlzVmFsaWQpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBsZXQgZGVsTmFtZSA9IGJvbmVOb2RlLm5hbWUuc3BsaXQoQVRUQUNIRURfUFJFX05BTUUpWzFdO1xuICAgICAgICAgICAgaWYgKGRlbE5hbWUgPT09IGJvbmVOYW1lKSB7XG4gICAgICAgICAgICAgICAgbWFya1RyZWUoYm9uZU5vZGUpO1xuICAgICAgICAgICAgICAgIGJvbmVOb2RlLnJlbW92ZUZyb21QYXJlbnQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgYm9uZU5vZGUuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIG5vZGVBcnJheVtpXSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9yZWJ1aWxkTm9kZUFycmF5KCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVHJhdmVyc2UgYWxsIGJvbmVzIHRvIGdlbmVyYXRlIHRoZSBtaW5pbXVtIG5vZGUgdHJlZSBjb250YWluaW5nIHRoZSBnaXZlbiBib25lIG5hbWVzLCBOT1RFIHRoYXQgbWFrZSBzdXJlIHRoZSBza2VsZXRvbiBoYXMgaW5pdGlhbGl6ZWQgYmVmb3JlIGNhbGxpbmcgdGhpcyBpbnRlcmZhY2UuXG4gICAgICogISN6aCDpgY3ljobmiYDmnInmj5Lmp73vvIznlJ/miJDljIXlkKvmiYDmnInnu5nlrprmj5Lmp73lkI3np7DnmoTmnIDlsI/oioLngrnmoJHvvIzms6jmhI/vvIzosIPnlKjor6XmjqXlj6PliY3or7fnoa7kv53pqqjpqrzliqjnlLvlt7Lnu4/liJ3lp4vljJblpb3jgIJcbiAgICAgKiBAbWV0aG9kIGdlbmVyYXRlQXR0YWNoZWROb2Rlc1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBib25lTmFtZVxuICAgICAqIEByZXR1cm4ge05vZGVbXX0gYXR0YWNoZWQgbm9kZSBhcnJheVxuICAgICAqL1xuICAgIGdlbmVyYXRlQXR0YWNoZWROb2RlcyAoYm9uZU5hbWUpIHtcbiAgICAgICAgbGV0IHRhcmdldE5vZGVzID0gW107XG4gICAgICAgIGlmICghdGhpcy5faW5pdGVkKSByZXR1cm4gdGFyZ2V0Tm9kZXM7XG5cbiAgICAgICAgbGV0IHJvb3ROb2RlID0gdGhpcy5fcHJlcGFyZUF0dGFjaE5vZGUoKTtcbiAgICAgICAgaWYgKCFyb290Tm9kZSkgcmV0dXJuIHRhcmdldE5vZGVzO1xuXG4gICAgICAgIGxldCByZXMgPSBbXTtcbiAgICAgICAgbGV0IGJvbmVzID0gdGhpcy5fc2tlbGV0b24uYm9uZXM7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBuID0gYm9uZXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgYm9uZSA9IGJvbmVzW2ldO1xuICAgICAgICAgICAgbGV0IGJvbmVEYXRhID0gYm9uZS5kYXRhO1xuICAgICAgICAgICAgaWYgKGJvbmVEYXRhLm5hbWUgPT0gYm9uZU5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXMucHVzaChib25lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBidWlsZEJvbmVUcmVlID0gZnVuY3Rpb24gKGJvbmUpIHtcbiAgICAgICAgICAgIGlmICghYm9uZSkgcmV0dXJuO1xuICAgICAgICAgICAgbGV0IGJvbmVEYXRhID0gYm9uZS5kYXRhO1xuICAgICAgICAgICAgbGV0IGJvbmVOb2RlID0gdGhpcy5fZ2V0Tm9kZUJ5Qm9uZUluZGV4KGJvbmVEYXRhLmluZGV4KTtcbiAgICAgICAgICAgIGlmIChib25lTm9kZSkgcmV0dXJuIGJvbmVOb2RlO1xuXG4gICAgICAgICAgICBib25lTm9kZSA9IHRoaXMuX2J1aWxkQm9uZUF0dGFjaGVkTm9kZShib25lLCBib25lRGF0YS5pbmRleCk7XG5cbiAgICAgICAgICAgIGxldCBwYXJlbnRCb25lTm9kZSA9IGJ1aWxkQm9uZVRyZWUoYm9uZS5wYXJlbnQpIHx8IHJvb3ROb2RlO1xuICAgICAgICAgICAgYm9uZU5vZGUucGFyZW50ID0gcGFyZW50Qm9uZU5vZGU7XG5cbiAgICAgICAgICAgIHJldHVybiBib25lTm9kZTtcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBuID0gcmVzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgbGV0IHRhcmdldE5vZGUgPSBidWlsZEJvbmVUcmVlKHJlc1tpXSk7XG4gICAgICAgICAgICB0YXJnZXROb2Rlcy5wdXNoKHRhcmdldE5vZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fc29ydE5vZGVBcnJheSgpO1xuICAgICAgICByZXR1cm4gdGFyZ2V0Tm9kZXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gRGVzdHJveSBhbGwgYXR0YWNoZWQgbm9kZS5cbiAgICAgKiAhI3poIOmUgOavgeaJgOacieaMgueCuVxuICAgICAqIEBtZXRob2QgZGVzdHJveUFsbEF0dGFjaGVkTm9kZXNcbiAgICAgKi9cbiAgICBkZXN0cm95QWxsQXR0YWNoZWROb2RlcyAoKSB7XG4gICAgICAgIHRoaXMuX2F0dGFjaGVkUm9vdE5vZGUgPSBudWxsO1xuICAgICAgICB0aGlzLl9hdHRhY2hlZE5vZGVBcnJheS5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLl9ib25lSW5kZXhUb05vZGUgPSB7fTtcbiAgICAgICAgaWYgKCF0aGlzLl9pbml0ZWQpIHJldHVybjtcblxuICAgICAgICBsZXQgcm9vdE5vZGUgPSB0aGlzLl9za2VsZXRvbk5vZGUuZ2V0Q2hpbGRCeU5hbWUoQVRUQUNIRURfUk9PVF9OQU1FKTtcbiAgICAgICAgaWYgKHJvb3ROb2RlKSB7XG4gICAgICAgICAgICByb290Tm9kZS5yZW1vdmVGcm9tUGFyZW50KHRydWUpO1xuICAgICAgICAgICAgcm9vdE5vZGUuZGVzdHJveSgpO1xuICAgICAgICAgICAgcm9vdE5vZGUgPSBudWxsO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVHJhdmVyc2UgYWxsIGJvbmVzIHRvIGdlbmVyYXRlIGEgdHJlZSBjb250YWluaW5nIGFsbCBib25lcyBub2RlcywgTk9URSB0aGF0IG1ha2Ugc3VyZSB0aGUgc2tlbGV0b24gaGFzIGluaXRpYWxpemVkIGJlZm9yZSBjYWxsaW5nIHRoaXMgaW50ZXJmYWNlLlxuICAgICAqICEjemgg6YGN5Y6G5omA5pyJ5o+S5qe977yM55Sf5oiQ5YyF5ZCr5omA5pyJ5o+S5qe955qE6IqC54K55qCR77yM5rOo5oSP77yM6LCD55So6K+l5o6l5Y+j5YmN6K+356Gu5L+d6aqo6aq85Yqo55S75bey57uP5Yid5aeL5YyW5aW944CCXG4gICAgICogQG1ldGhvZCBnZW5lcmF0ZUFsbEF0dGFjaGVkTm9kZXNcbiAgICAgKiBAcmV0dXJuIHtjYy5Ob2RlfSByb290IG5vZGVcbiAgICAgKi9cbiAgICBnZW5lcmF0ZUFsbEF0dGFjaGVkTm9kZXMgKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2luaXRlZCkgcmV0dXJuO1xuXG4gICAgICAgIC8vIGNsZWFyIGFsbCByZWNvcmRzXG4gICAgICAgIHRoaXMuX2JvbmVJbmRleFRvTm9kZSA9IHt9O1xuICAgICAgICB0aGlzLl9hdHRhY2hlZE5vZGVBcnJheS5sZW5ndGggPSAwO1xuICAgICAgICBcbiAgICAgICAgbGV0IHJvb3ROb2RlID0gdGhpcy5fcHJlcGFyZUF0dGFjaE5vZGUoKTtcbiAgICAgICAgaWYgKCFyb290Tm9kZSkgcmV0dXJuO1xuXG4gICAgICAgIGxldCBib25lcyA9IHRoaXMuX3NrZWxldG9uLmJvbmVzO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbiA9IGJvbmVzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgbGV0IGJvbmUgPSBib25lc1tpXTtcbiAgICAgICAgICAgIGxldCBib25lRGF0YSA9IGJvbmUuZGF0YTtcbiAgICAgICAgICAgIGxldCBwYXJlbnROb2RlID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChib25lLnBhcmVudCkge1xuICAgICAgICAgICAgICAgIGxldCBwYXJlbnRJbmRleCA9IGJvbmUucGFyZW50LmRhdGEuaW5kZXg7XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZSA9IHRoaXMuX2JvbmVJbmRleFRvTm9kZVtwYXJlbnRJbmRleF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUgPSByb290Tm9kZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgYm9uZU5vZGUgPSBwYXJlbnROb2RlLmdldENoaWxkQnlOYW1lKEFUVEFDSEVEX1BSRV9OQU1FICsgYm9uZURhdGEubmFtZSk7XG4gICAgICAgICAgICAgICAgaWYgKCFib25lTm9kZSB8fCAhYm9uZU5vZGUuaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgICAgICBib25lTm9kZSA9IHRoaXMuX2J1aWxkQm9uZUF0dGFjaGVkTm9kZShib25lLCBib25lRGF0YS5pbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuYWRkQ2hpbGQoYm9uZU5vZGUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2J1aWxkQm9uZVJlbGF0aW9uKGJvbmVOb2RlLCBib25lLCBib25lRGF0YS5pbmRleCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByb290Tm9kZTtcbiAgICB9LFxuXG4gICAgX2hhc0F0dGFjaGVkTm9kZSAoKSB7XG4gICAgICAgIGlmICghdGhpcy5faW5pdGVkKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgbGV0IGF0dGFjaGVkUm9vdE5vZGUgPSB0aGlzLl9za2VsZXRvbk5vZGUuZ2V0Q2hpbGRCeU5hbWUoQVRUQUNIRURfUk9PVF9OQU1FKTtcbiAgICAgICAgcmV0dXJuICEhYXR0YWNoZWRSb290Tm9kZTtcbiAgICB9LFxuXG4gICAgX2Fzc29jaWF0ZUF0dGFjaGVkTm9kZSAoKSB7XG4gICAgICAgIGlmICghdGhpcy5faW5pdGVkKSByZXR1cm47XG5cbiAgICAgICAgbGV0IHJvb3ROb2RlID0gdGhpcy5fc2tlbGV0b25Ob2RlLmdldENoaWxkQnlOYW1lKEFUVEFDSEVEX1JPT1RfTkFNRSk7XG4gICAgICAgIGlmICghcm9vdE5vZGUgfHwgIXJvb3ROb2RlLmlzVmFsaWQpIHJldHVybjtcbiAgICAgICAgdGhpcy5fYXR0YWNoZWRSb290Tm9kZSA9IHJvb3ROb2RlO1xuXG4gICAgICAgIC8vIGNsZWFyIGFsbCByZWNvcmRzXG4gICAgICAgIHRoaXMuX2JvbmVJbmRleFRvTm9kZSA9IHt9O1xuICAgICAgICBsZXQgbm9kZUFycmF5ID0gdGhpcy5fYXR0YWNoZWROb2RlQXJyYXk7XG4gICAgICAgIG5vZGVBcnJheS5sZW5ndGggPSAwO1xuICAgICAgICBsaW1pdE5vZGUocm9vdE5vZGUpO1xuXG4gICAgICAgIGlmICghQ0NfTkFUSVZFUkVOREVSRVIpIHtcbiAgICAgICAgICAgIGxldCBpc0NhY2hlZCA9IHRoaXMuX3NrZWxldG9uQ29tcC5pc0FuaW1hdGlvbkNhY2hlZCgpO1xuICAgICAgICAgICAgaWYgKGlzQ2FjaGVkICYmIHRoaXMuX3NrZWxldG9uQ29tcC5fZnJhbWVDYWNoZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NrZWxldG9uQ29tcC5fZnJhbWVDYWNoZS5lbmFibGVDYWNoZUF0dGFjaGVkSW5mbygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGJvbmVzID0gdGhpcy5fc2tlbGV0b24uYm9uZXM7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBuID0gYm9uZXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgYm9uZSA9IGJvbmVzW2ldO1xuICAgICAgICAgICAgbGV0IGJvbmVEYXRhID0gYm9uZS5kYXRhO1xuICAgICAgICAgICAgbGV0IHBhcmVudE5vZGUgPSBudWxsO1xuICAgICAgICAgICAgaWYgKGJvbmUucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgbGV0IHBhcmVudEluZGV4ID0gYm9uZS5wYXJlbnQuZGF0YS5pbmRleDtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlID0gdGhpcy5fYm9uZUluZGV4VG9Ob2RlW3BhcmVudEluZGV4XTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZSA9IHJvb3ROb2RlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIGxldCBib25lTm9kZSA9IHBhcmVudE5vZGUuZ2V0Q2hpbGRCeU5hbWUoQVRUQUNIRURfUFJFX05BTUUgKyBib25lRGF0YS5uYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAoYm9uZU5vZGUgJiYgYm9uZU5vZGUuaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9idWlsZEJvbmVSZWxhdGlvbihib25lTm9kZSwgYm9uZSwgYm9uZURhdGEuaW5kZXgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfc3luY0F0dGFjaGVkTm9kZSAoKSB7XG4gICAgICAgIGlmICghdGhpcy5faW5pdGVkKSByZXR1cm47XG5cbiAgICAgICAgbGV0IHJvb3ROb2RlID0gdGhpcy5fYXR0YWNoZWRSb290Tm9kZTtcbiAgICAgICAgbGV0IG5vZGVBcnJheSA9IHRoaXMuX2F0dGFjaGVkTm9kZUFycmF5O1xuICAgICAgICBpZiAoIXJvb3ROb2RlIHx8ICFyb290Tm9kZS5pc1ZhbGlkKSB7XG4gICAgICAgICAgICB0aGlzLl9hdHRhY2hlZFJvb3ROb2RlID0gbnVsbDtcbiAgICAgICAgICAgIG5vZGVBcnJheS5sZW5ndGggPSAwO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBsZXQgcm9vdE1hdHJpeCA9IHRoaXMuX3NrZWxldG9uTm9kZS5fd29ybGRNYXRyaXg7XG4gICAgICAgIE1hdDQuY29weShyb290Tm9kZS5fd29ybGRNYXRyaXgsIHJvb3RNYXRyaXgpO1xuICAgICAgICByb290Tm9kZS5fcmVuZGVyRmxhZyAmPSB+RkxBR19UUkFOU0ZPUk07XG5cbiAgICAgICAgbGV0IGJvbmVJbmZvcyA9IG51bGw7XG4gICAgICAgIGxldCBpc0NhY2hlZCA9IHRoaXMuX3NrZWxldG9uQ29tcC5pc0FuaW1hdGlvbkNhY2hlZCgpO1xuICAgICAgICBpZiAoaXNDYWNoZWQpIHtcbiAgICAgICAgICAgIGJvbmVJbmZvcyA9IHRoaXMuX3NrZWxldG9uQ29tcC5fY3VyRnJhbWUgJiYgdGhpcy5fc2tlbGV0b25Db21wLl9jdXJGcmFtZS5ib25lSW5mb3M7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBib25lSW5mb3MgPSB0aGlzLl9za2VsZXRvbi5ib25lcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghYm9uZUluZm9zKSByZXR1cm47XG5cbiAgICAgICAgbGV0IG11bE1hdCA9IHRoaXMuX3NrZWxldG9uTm9kZS5fbXVsTWF0O1xuICAgICAgICBsZXQgbWF0cml4SGFuZGxlID0gZnVuY3Rpb24gKG5vZGVNYXQsIHBhcmVudE1hdCwgYm9uZSkge1xuICAgICAgICAgICAgbGV0IHRtID0gX3RlbXBNYXQ0Lm07XG4gICAgICAgICAgICB0bVswXSA9IGJvbmUuYTtcbiAgICAgICAgICAgIHRtWzFdID0gYm9uZS5jO1xuICAgICAgICAgICAgdG1bNF0gPSBib25lLmI7XG4gICAgICAgICAgICB0bVs1XSA9IGJvbmUuZDtcbiAgICAgICAgICAgIHRtWzEyXSA9IGJvbmUud29ybGRYO1xuICAgICAgICAgICAgdG1bMTNdID0gYm9uZS53b3JsZFk7XG4gICAgICAgICAgICBtdWxNYXQobm9kZU1hdCwgcGFyZW50TWF0LCBfdGVtcE1hdDQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBub2RlQXJyYXlEaXJ0eSA9IGZhbHNlO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbiA9IG5vZGVBcnJheS5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBib25lTm9kZSA9IG5vZGVBcnJheVtpXTtcbiAgICAgICAgICAgIC8vIE5vZGUgaGFzIGJlZW4gZGVzdHJveVxuICAgICAgICAgICAgaWYgKCFib25lTm9kZSB8fCAhYm9uZU5vZGUuaXNWYWxpZCkgeyBcbiAgICAgICAgICAgICAgICBub2RlQXJyYXlbaV0gPSBudWxsO1xuICAgICAgICAgICAgICAgIG5vZGVBcnJheURpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBib25lID0gYm9uZUluZm9zW2JvbmVOb2RlLl9ib25lSW5kZXhdO1xuICAgICAgICAgICAgLy8gQm9uZSBoYXMgYmVlbiBkZXN0cm95XG4gICAgICAgICAgICBpZiAoIWJvbmUpIHtcbiAgICAgICAgICAgICAgICBib25lTm9kZS5yZW1vdmVGcm9tUGFyZW50KHRydWUpO1xuICAgICAgICAgICAgICAgIGJvbmVOb2RlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICBub2RlQXJyYXlbaV0gPSBudWxsO1xuICAgICAgICAgICAgICAgIG5vZGVBcnJheURpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1hdHJpeEhhbmRsZShib25lTm9kZS5fd29ybGRNYXRyaXgsIHJvb3ROb2RlLl93b3JsZE1hdHJpeCwgYm9uZSk7XG4gICAgICAgICAgICBib25lTm9kZS5fcmVuZGVyRmxhZyAmPSB+RkxBR19UUkFOU0ZPUk07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGVBcnJheURpcnR5KSB7XG4gICAgICAgICAgICB0aGlzLl9yZWJ1aWxkTm9kZUFycmF5KCk7XG4gICAgICAgIH1cbiAgICB9LFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gc3AuQXR0YWNoVXRpbCA9IEF0dGFjaFV0aWw7Il19