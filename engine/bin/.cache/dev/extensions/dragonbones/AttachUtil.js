
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extensions/dragonbones/AttachUtil.js';
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
 * @module dragonBones
 */

/**
 * !#en Attach node tool
 * !#zh 挂点工具类
 * @class dragonBones.AttachUtil
 */


var AttachUtil = cc.Class({
  name: 'dragonBones.AttachUtil',
  ctor: function ctor() {
    this._inited = false;
    this._armature = null;
    this._armatureNode = null;
    this._armatureDisplay = null;
    this._attachedRootNode = null;
    this._attachedNodeArray = [];
    this._boneIndexToNode = {};
  },
  init: function init(armatureDisplay) {
    this._inited = true;
    this._armature = armatureDisplay._armature;
    this._armatureNode = armatureDisplay.node;
    this._armatureDisplay = armatureDisplay;
  },
  reset: function reset() {
    this._inited = false;
    this._armature = null;
    this._armatureNode = null;
    this._armatureDisplay = null;
  },
  _prepareAttachNode: function _prepareAttachNode() {
    var armature = this._armature;

    if (!armature) {
      return;
    }

    var rootNode = this._armatureNode.getChildByName(ATTACHED_ROOT_NAME);

    if (!rootNode || !rootNode.isValid) {
      rootNode = new cc.Node(ATTACHED_ROOT_NAME);
      limitNode(rootNode);

      this._armatureNode.addChild(rootNode);
    }

    var isCached = this._armatureDisplay.isAnimationCached();

    if (isCached && this._armatureDisplay._frameCache) {
      this._armatureDisplay._frameCache.enableCacheAttachedInfo();
    }

    this._attachedRootNode = rootNode;
    return rootNode;
  },
  _buildBoneAttachedNode: function _buildBoneAttachedNode(bone, boneIndex) {
    var boneNodeName = ATTACHED_PRE_NAME + bone.name;
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
    var boneIndex = 0;
    var res = [];

    var attachedTraverse = function (armature) {
      if (!armature) return;
      var bones = armature.getBones(),
          bone;

      for (var i = 0, l = bones.length; i < l; i++) {
        bone = bones[i];
        bone._boneIndex = boneIndex++;

        if (boneName === bone.name) {
          res.push(bone);
        }
      }

      var slots = armature.getSlots(),
          slot;

      for (var _i = 0, _l = slots.length; _i < _l; _i++) {
        slot = slots[_i];

        if (slot.childArmature) {
          attachedTraverse(slot.childArmature);
        }
      }
    }.bind(this);

    attachedTraverse(this._armature);

    var buildBoneTree = function (bone) {
      if (!bone) return;

      var boneNode = this._getNodeByBoneIndex(bone._boneIndex);

      if (boneNode) return boneNode;
      boneNode = this._buildBoneAttachedNode(bone, bone._boneIndex);
      var subArmatureParentBone = null;

      if (bone.armature.parent) {
        var parentSlot = bone.armature.parent;
        subArmatureParentBone = parentSlot.parent;
      }

      var parentBoneNode = buildBoneTree(bone.parent || subArmatureParentBone) || rootNode;
      boneNode.parent = parentBoneNode;

      if (bone.parent) {
        boneNode._rootNode = parentBoneNode._rootNode;
      } else {
        boneNode._rootNode = parentBoneNode;
      }

      return boneNode;
    }.bind(this);

    for (var i = 0, n = res.length; i < n; i++) {
      var targetNode = buildBoneTree(res[i]);

      if (targetNode) {
        targetNodes.push(targetNode);
      }
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

    var rootNode = this._armatureNode.getChildByName(ATTACHED_ROOT_NAME);

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
    var boneIndex = 0;

    var attachedTraverse = function (armature) {
      if (!armature) return;
      var subArmatureParentNode = rootNode;

      if (armature.parent) {
        var parentSlot = armature.parent;
        var parentBone = parentSlot.parent;
        subArmatureParentNode = parentBone._attachedNode;
      }

      var bones = armature.getBones(),
          bone;

      for (var i = 0, l = bones.length; i < l; i++) {
        var curBoneIndex = boneIndex++;
        bone = bones[i];
        bone._attachedNode = null;
        var parentNode = null;

        if (bone.parent) {
          parentNode = bone.parent._attachedNode;
        } else {
          parentNode = subArmatureParentNode;
        }

        if (parentNode) {
          var boneNode = parentNode.getChildByName(ATTACHED_PRE_NAME + bone.name);

          if (!boneNode || !boneNode.isValid) {
            boneNode = this._buildBoneAttachedNode(bone, curBoneIndex);
            parentNode.addChild(boneNode);
          } else {
            this._buildBoneRelation(boneNode, bone, curBoneIndex);
          }

          boneNode._rootNode = subArmatureParentNode;
          bone._attachedNode = boneNode;
        }
      }

      var slots = armature.getSlots(),
          slot;

      for (var _i2 = 0, _l2 = slots.length; _i2 < _l2; _i2++) {
        slot = slots[_i2];

        if (slot.childArmature) {
          attachedTraverse(slot.childArmature);
        }
      }
    }.bind(this);

    attachedTraverse(this._armature);
    return rootNode;
  },
  _hasAttachedNode: function _hasAttachedNode() {
    if (!this._inited) return false;

    var attachedRootNode = this._armatureNode.getChildByName(ATTACHED_ROOT_NAME);

    return !!attachedRootNode;
  },
  _associateAttachedNode: function _associateAttachedNode() {
    if (!this._inited) return;

    var rootNode = this._armatureNode.getChildByName(ATTACHED_ROOT_NAME);

    if (!rootNode || !rootNode.isValid) return;
    this._attachedRootNode = rootNode; // clear all records

    this._boneIndexToNode = {};
    var nodeArray = this._attachedNodeArray;
    nodeArray.length = 0;
    var armature = this._armature;

    if (!armature) {
      return;
    }

    limitNode(rootNode);

    if (!CC_NATIVERENDERER) {
      var isCached = this._armatureDisplay.isAnimationCached();

      if (isCached && this._armatureDisplay._frameCache) {
        this._armatureDisplay._frameCache.enableCacheAttachedInfo();
      }
    }

    var boneIndex = 0;

    var attachedTraverse = function (armature) {
      if (!armature) return;
      var subArmatureParentNode = rootNode;

      if (armature.parent) {
        var parentSlot = armature.parent;
        var parentBone = parentSlot.parent;
        subArmatureParentNode = parentBone._attachedNode;
      }

      var bones = armature.getBones(),
          bone;

      for (var i = 0, l = bones.length; i < l; i++) {
        var curBoneIndex = boneIndex++;
        bone = bones[i];
        bone._attachedNode = null;
        var parentNode = null;

        if (bone.parent) {
          parentNode = bone.parent._attachedNode;
        } else {
          parentNode = subArmatureParentNode;
        }

        if (parentNode) {
          var boneNode = parentNode.getChildByName(ATTACHED_PRE_NAME + bone.name);

          if (boneNode && boneNode.isValid) {
            this._buildBoneRelation(boneNode, bone, curBoneIndex);

            boneNode._rootNode = subArmatureParentNode;
            bone._attachedNode = boneNode;
          }
        }
      }

      var slots = armature.getSlots(),
          slot;

      for (var _i3 = 0, _l3 = slots.length; _i3 < _l3; _i3++) {
        slot = slots[_i3];

        if (slot.childArmature) {
          attachedTraverse(slot.childArmature);
        }
      }
    }.bind(this);

    attachedTraverse(armature);
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

    var rootMatrix = this._armatureNode._worldMatrix;

    _mat["default"].copy(rootNode._worldMatrix, rootMatrix);

    rootNode._renderFlag &= ~FLAG_TRANSFORM;
    var boneInfos = null;

    var isCached = this._armatureDisplay.isAnimationCached();

    if (isCached) {
      boneInfos = this._armatureDisplay._curFrame && this._armatureDisplay._curFrame.boneInfos;
      if (!boneInfos) return;
    }

    var mulMat = this._armatureNode._mulMat;

    var matrixHandle = function matrixHandle(nodeMat, parentMat, boneMat) {
      var tm = _tempMat4.m;
      tm[0] = boneMat.a;
      tm[1] = boneMat.b;
      tm[4] = -boneMat.c;
      tm[5] = -boneMat.d;
      tm[12] = boneMat.tx;
      tm[13] = boneMat.ty;
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

      var bone = isCached ? boneInfos[boneNode._boneIndex] : boneNode._bone; // Bone has been destroy

      if (!bone || bone._isInPool) {
        boneNode.removeFromParent(true);
        boneNode.destroy();
        nodeArray[i] = null;
        nodeArrayDirty = true;
        continue;
      }

      matrixHandle(boneNode._worldMatrix, boneNode._rootNode._worldMatrix, bone.globalTransformMatrix);
      boneNode._renderFlag &= ~FLAG_TRANSFORM;
    }

    if (nodeArrayDirty) {
      this._rebuildNodeArray();
    }
  }
});
module.exports = dragonBones.AttachUtil = AttachUtil;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF0dGFjaFV0aWwuanMiXSwibmFtZXMiOlsiUmVuZGVyRmxvdyIsInJlcXVpcmUiLCJGTEFHX1RSQU5TRk9STSIsIkVtcHR5SGFuZGxlIiwiQVRUQUNIRURfUk9PVF9OQU1FIiwiQVRUQUNIRURfUFJFX05BTUUiLCJsaW1pdE5vZGUiLCJub2RlIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXQiLCJzZXQiLCJ2YWx1ZSIsIl9jYWxjdWxXb3JsZE1hdHJpeCIsIl9tdWxNYXQiLCJfdGVtcE1hdDQiLCJNYXQ0IiwiQXR0YWNoVXRpbCIsImNjIiwiQ2xhc3MiLCJuYW1lIiwiY3RvciIsIl9pbml0ZWQiLCJfYXJtYXR1cmUiLCJfYXJtYXR1cmVOb2RlIiwiX2FybWF0dXJlRGlzcGxheSIsIl9hdHRhY2hlZFJvb3ROb2RlIiwiX2F0dGFjaGVkTm9kZUFycmF5IiwiX2JvbmVJbmRleFRvTm9kZSIsImluaXQiLCJhcm1hdHVyZURpc3BsYXkiLCJyZXNldCIsIl9wcmVwYXJlQXR0YWNoTm9kZSIsImFybWF0dXJlIiwicm9vdE5vZGUiLCJnZXRDaGlsZEJ5TmFtZSIsImlzVmFsaWQiLCJOb2RlIiwiYWRkQ2hpbGQiLCJpc0NhY2hlZCIsImlzQW5pbWF0aW9uQ2FjaGVkIiwiX2ZyYW1lQ2FjaGUiLCJlbmFibGVDYWNoZUF0dGFjaGVkSW5mbyIsIl9idWlsZEJvbmVBdHRhY2hlZE5vZGUiLCJib25lIiwiYm9uZUluZGV4IiwiYm9uZU5vZGVOYW1lIiwiYm9uZU5vZGUiLCJfYnVpbGRCb25lUmVsYXRpb24iLCJfYm9uZSIsIl9ib25lSW5kZXgiLCJwdXNoIiwiZ2V0QXR0YWNoZWRSb290Tm9kZSIsImdldEF0dGFjaGVkTm9kZXMiLCJib25lTmFtZSIsIm5vZGVBcnJheSIsInJlcyIsImkiLCJuIiwibGVuZ3RoIiwiX3JlYnVpbGROb2RlQXJyYXkiLCJmaW5kTWFwIiwib2xkTm9kZUFycmF5IiwiX3RvUmVtb3ZlIiwiX3NvcnROb2RlQXJyYXkiLCJzb3J0IiwiYSIsImIiLCJfZ2V0Tm9kZUJ5Qm9uZUluZGV4IiwiZGVzdHJveUF0dGFjaGVkTm9kZXMiLCJtYXJrVHJlZSIsImNoaWxkcmVuIiwiYyIsImRlbE5hbWUiLCJzcGxpdCIsInJlbW92ZUZyb21QYXJlbnQiLCJkZXN0cm95IiwiZ2VuZXJhdGVBdHRhY2hlZE5vZGVzIiwidGFyZ2V0Tm9kZXMiLCJhdHRhY2hlZFRyYXZlcnNlIiwiYm9uZXMiLCJnZXRCb25lcyIsImwiLCJzbG90cyIsImdldFNsb3RzIiwic2xvdCIsImNoaWxkQXJtYXR1cmUiLCJiaW5kIiwiYnVpbGRCb25lVHJlZSIsInN1YkFybWF0dXJlUGFyZW50Qm9uZSIsInBhcmVudCIsInBhcmVudFNsb3QiLCJwYXJlbnRCb25lTm9kZSIsIl9yb290Tm9kZSIsInRhcmdldE5vZGUiLCJkZXN0cm95QWxsQXR0YWNoZWROb2RlcyIsImdlbmVyYXRlQWxsQXR0YWNoZWROb2RlcyIsInN1YkFybWF0dXJlUGFyZW50Tm9kZSIsInBhcmVudEJvbmUiLCJfYXR0YWNoZWROb2RlIiwiY3VyQm9uZUluZGV4IiwicGFyZW50Tm9kZSIsIl9oYXNBdHRhY2hlZE5vZGUiLCJhdHRhY2hlZFJvb3ROb2RlIiwiX2Fzc29jaWF0ZUF0dGFjaGVkTm9kZSIsIkNDX05BVElWRVJFTkRFUkVSIiwiX3N5bmNBdHRhY2hlZE5vZGUiLCJyb290TWF0cml4IiwiX3dvcmxkTWF0cml4IiwiY29weSIsIl9yZW5kZXJGbGFnIiwiYm9uZUluZm9zIiwiX2N1ckZyYW1lIiwibXVsTWF0IiwibWF0cml4SGFuZGxlIiwibm9kZU1hdCIsInBhcmVudE1hdCIsImJvbmVNYXQiLCJ0bSIsIm0iLCJkIiwidHgiLCJ0eSIsIm5vZGVBcnJheURpcnR5IiwiX2lzSW5Qb29sIiwiZ2xvYmFsVHJhbnNmb3JtTWF0cml4IiwibW9kdWxlIiwiZXhwb3J0cyIsImRyYWdvbkJvbmVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBeUJBOzs7O0FBekJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkEs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QUEwQixJQUExQjtBQUNBNUIsUUFBQUEsUUFBUSxDQUFDNkIsT0FBVDtBQUNBckIsUUFBQUEsU0FBUyxDQUFDRSxDQUFELENBQVQsR0FBZSxJQUFmO0FBQ0FrRSxRQUFBQSxjQUFjLEdBQUcsSUFBakI7QUFDQTtBQUNIOztBQUNEVCxNQUFBQSxZQUFZLENBQUNuRSxRQUFRLENBQUM2RCxZQUFWLEVBQXdCN0QsUUFBUSxDQUFDOEMsU0FBVCxDQUFtQmUsWUFBM0MsRUFBeURoRSxJQUFJLENBQUNpRixxQkFBOUQsQ0FBWjtBQUNBOUUsTUFBQUEsUUFBUSxDQUFDK0QsV0FBVCxJQUF3QixDQUFDNUcsY0FBekI7QUFDSDs7QUFDRCxRQUFJeUgsY0FBSixFQUFvQjtBQUNoQixXQUFLL0QsaUJBQUw7QUFDSDtBQUNKO0FBbGNxQixDQUFULENBQWpCO0FBcWNBa0UsTUFBTSxDQUFDQyxPQUFQLEdBQWlCQyxXQUFXLENBQUMvRyxVQUFaLEdBQXlCQSxVQUExQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE5IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgTWF0NCBmcm9tICcuLi8uLi9jb2NvczJkL2NvcmUvdmFsdWUtdHlwZXMvbWF0NCc7XG5jb25zdCBSZW5kZXJGbG93ID0gcmVxdWlyZSgnLi4vLi4vY29jb3MyZC9jb3JlL3JlbmRlcmVyL3JlbmRlci1mbG93Jyk7XG5jb25zdCBGTEFHX1RSQU5TRk9STSA9IFJlbmRlckZsb3cuRkxBR19UUkFOU0ZPUk07XG5jb25zdCBFbXB0eUhhbmRsZSA9IGZ1bmN0aW9uICgpIHt9XG5jb25zdCBBVFRBQ0hFRF9ST09UX05BTUUgPSAnQVRUQUNIRURfTk9ERV9UUkVFJztcbmNvbnN0IEFUVEFDSEVEX1BSRV9OQU1FID0gJ0FUVEFDSEVEX05PREU6JztcbmNvbnN0IGxpbWl0Tm9kZSA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgLy8gYXR0YWNoZWQgbm9kZSdzIHdvcmxkIG1hdHJpeCB1cGRhdGUgcGVyIGZyYW1lXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5vZGUsICdfd29ybGRNYXREaXJ0eScsIHtcbiAgICAgICAgZ2V0ICgpIHsgcmV0dXJuIHRydWU7IH0sXG4gICAgICAgIHNldCAodmFsdWUpIHsvKiBkbyBub3RoaW5nICovfVxuICAgIH0pO1xuICAgIC8vIHNoaWVsZCB3b3JsZCBtYXRyaXggY2FsY3VsYXRlIGludGVyZmFjZVxuICAgIG5vZGUuX2NhbGN1bFdvcmxkTWF0cml4ID0gRW1wdHlIYW5kbGU7XG4gICAgbm9kZS5fbXVsTWF0ID0gRW1wdHlIYW5kbGU7XG59O1xubGV0IF90ZW1wTWF0NCA9IG5ldyBNYXQ0KCk7XG5cbi8qKlxuICogQG1vZHVsZSBkcmFnb25Cb25lc1xuICovXG5cbi8qKlxuICogISNlbiBBdHRhY2ggbm9kZSB0b29sXG4gKiAhI3poIOaMgueCueW3peWFt+exu1xuICogQGNsYXNzIGRyYWdvbkJvbmVzLkF0dGFjaFV0aWxcbiAqL1xubGV0IEF0dGFjaFV0aWwgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2RyYWdvbkJvbmVzLkF0dGFjaFV0aWwnLFxuXG4gICAgY3RvciAoKSB7XG4gICAgICAgIHRoaXMuX2luaXRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9hcm1hdHVyZSA9IG51bGw7XG4gICAgICAgIHRoaXMuX2FybWF0dXJlTm9kZSA9IG51bGw7XG4gICAgICAgIHRoaXMuX2FybWF0dXJlRGlzcGxheSA9IG51bGw7XG4gICAgICAgIHRoaXMuX2F0dGFjaGVkUm9vdE5vZGUgPSBudWxsO1xuICAgICAgICB0aGlzLl9hdHRhY2hlZE5vZGVBcnJheSA9IFtdO1xuICAgICAgICB0aGlzLl9ib25lSW5kZXhUb05vZGUgPSB7fTtcbiAgICB9LFxuXG4gICAgaW5pdCAoYXJtYXR1cmVEaXNwbGF5KSB7XG4gICAgICAgIHRoaXMuX2luaXRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX2FybWF0dXJlID0gYXJtYXR1cmVEaXNwbGF5Ll9hcm1hdHVyZTtcbiAgICAgICAgdGhpcy5fYXJtYXR1cmVOb2RlID0gYXJtYXR1cmVEaXNwbGF5Lm5vZGU7XG4gICAgICAgIHRoaXMuX2FybWF0dXJlRGlzcGxheSA9IGFybWF0dXJlRGlzcGxheTtcbiAgICB9LFxuXG4gICAgcmVzZXQgKCkge1xuICAgICAgICB0aGlzLl9pbml0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fYXJtYXR1cmUgPSBudWxsO1xuICAgICAgICB0aGlzLl9hcm1hdHVyZU5vZGUgPSBudWxsO1xuICAgICAgICB0aGlzLl9hcm1hdHVyZURpc3BsYXkgPSBudWxsO1xuICAgIH0sXG5cbiAgICBfcHJlcGFyZUF0dGFjaE5vZGUgKCkge1xuICAgICAgICBsZXQgYXJtYXR1cmUgPSB0aGlzLl9hcm1hdHVyZTtcbiAgICAgICAgaWYgKCFhcm1hdHVyZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJvb3ROb2RlID0gdGhpcy5fYXJtYXR1cmVOb2RlLmdldENoaWxkQnlOYW1lKEFUVEFDSEVEX1JPT1RfTkFNRSk7XG4gICAgICAgIGlmICghcm9vdE5vZGUgfHwgIXJvb3ROb2RlLmlzVmFsaWQpIHtcbiAgICAgICAgICAgIHJvb3ROb2RlID0gbmV3IGNjLk5vZGUoQVRUQUNIRURfUk9PVF9OQU1FKTtcbiAgICAgICAgICAgIGxpbWl0Tm9kZShyb290Tm9kZSk7XG4gICAgICAgICAgICB0aGlzLl9hcm1hdHVyZU5vZGUuYWRkQ2hpbGQocm9vdE5vZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGlzQ2FjaGVkID0gdGhpcy5fYXJtYXR1cmVEaXNwbGF5LmlzQW5pbWF0aW9uQ2FjaGVkKCk7XG4gICAgICAgIGlmIChpc0NhY2hlZCAmJiB0aGlzLl9hcm1hdHVyZURpc3BsYXkuX2ZyYW1lQ2FjaGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2FybWF0dXJlRGlzcGxheS5fZnJhbWVDYWNoZS5lbmFibGVDYWNoZUF0dGFjaGVkSW5mbygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fYXR0YWNoZWRSb290Tm9kZSA9IHJvb3ROb2RlO1xuICAgICAgICByZXR1cm4gcm9vdE5vZGU7XG4gICAgfSxcblxuICAgIF9idWlsZEJvbmVBdHRhY2hlZE5vZGUgKGJvbmUsIGJvbmVJbmRleCkge1xuICAgICAgICBsZXQgYm9uZU5vZGVOYW1lID0gQVRUQUNIRURfUFJFX05BTUUgKyBib25lLm5hbWU7XG4gICAgICAgIGxldCBib25lTm9kZSA9IG5ldyBjYy5Ob2RlKGJvbmVOb2RlTmFtZSk7XG4gICAgICAgIHRoaXMuX2J1aWxkQm9uZVJlbGF0aW9uKGJvbmVOb2RlLCBib25lLCBib25lSW5kZXgpO1xuICAgICAgICByZXR1cm4gYm9uZU5vZGU7XG4gICAgfSxcblxuICAgIF9idWlsZEJvbmVSZWxhdGlvbiAoYm9uZU5vZGUsIGJvbmUsIGJvbmVJbmRleCkge1xuICAgICAgICBsaW1pdE5vZGUoYm9uZU5vZGUpO1xuICAgICAgICBib25lTm9kZS5fYm9uZSA9IGJvbmU7XG4gICAgICAgIGJvbmVOb2RlLl9ib25lSW5kZXggPSBib25lSW5kZXg7XG4gICAgICAgIHRoaXMuX2F0dGFjaGVkTm9kZUFycmF5LnB1c2goYm9uZU5vZGUpO1xuICAgICAgICB0aGlzLl9ib25lSW5kZXhUb05vZGVbYm9uZUluZGV4XSA9IGJvbmVOb2RlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldHMgYXR0YWNoZWQgcm9vdCBub2RlLlxuICAgICAqICEjemgg6I635Y+W5oyC5o6l6IqC54K55qCR55qE5qC56IqC54K5XG4gICAgICogQG1ldGhvZCBnZXRBdHRhY2hlZFJvb3ROb2RlXG4gICAgICogQHJldHVybiB7Y2MuTm9kZX1cbiAgICAgKi9cbiAgICBnZXRBdHRhY2hlZFJvb3ROb2RlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2F0dGFjaGVkUm9vdE5vZGU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0cyBhdHRhY2hlZCBub2RlIHdoaWNoIHlvdSB3YW50LlxuICAgICAqICEjemgg6I635b6X5a+55bqU55qE5oyC54K5XG4gICAgICogQG1ldGhvZCBnZXRBdHRhY2hlZE5vZGVzXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGJvbmVOYW1lXG4gICAgICogQHJldHVybiB7Tm9kZVtdfVxuICAgICAqL1xuICAgIGdldEF0dGFjaGVkTm9kZXMgKGJvbmVOYW1lKSB7XG4gICAgICAgIGxldCBub2RlQXJyYXkgPSB0aGlzLl9hdHRhY2hlZE5vZGVBcnJheTtcbiAgICAgICAgbGV0IHJlcyA9IFtdO1xuICAgICAgICBpZiAoIXRoaXMuX2luaXRlZCkgcmV0dXJuIHJlcztcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIG4gPSBub2RlQXJyYXkubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgYm9uZU5vZGUgPSBub2RlQXJyYXlbaV07XG4gICAgICAgICAgICBpZiAoIWJvbmVOb2RlIHx8ICFib25lTm9kZS5pc1ZhbGlkKSBjb250aW51ZTtcbiAgICAgICAgICAgIGlmIChib25lTm9kZS5uYW1lID09PSBBVFRBQ0hFRF9QUkVfTkFNRSArIGJvbmVOYW1lKSB7XG4gICAgICAgICAgICAgICAgcmVzLnB1c2goYm9uZU5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfSxcblxuICAgIF9yZWJ1aWxkTm9kZUFycmF5ICgpIHtcbiAgICAgICAgbGV0IGZpbmRNYXAgPSB0aGlzLl9ib25lSW5kZXhUb05vZGUgPSB7fTtcbiAgICAgICAgbGV0IG9sZE5vZGVBcnJheSA9IHRoaXMuX2F0dGFjaGVkTm9kZUFycmF5O1xuICAgICAgICBsZXQgbm9kZUFycmF5ID0gdGhpcy5fYXR0YWNoZWROb2RlQXJyYXkgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIG4gPSBvbGROb2RlQXJyYXkubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgYm9uZU5vZGUgPSBvbGROb2RlQXJyYXlbaV07XG4gICAgICAgICAgICBpZiAoIWJvbmVOb2RlIHx8ICFib25lTm9kZS5pc1ZhbGlkIHx8IGJvbmVOb2RlLl90b1JlbW92ZSkgY29udGludWU7XG4gICAgICAgICAgICBub2RlQXJyYXkucHVzaChib25lTm9kZSk7XG4gICAgICAgICAgICBmaW5kTWFwW2JvbmVOb2RlLl9ib25lSW5kZXhdID0gYm9uZU5vZGU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3NvcnROb2RlQXJyYXkgKCkge1xuICAgICAgICBsZXQgbm9kZUFycmF5ID0gdGhpcy5fYXR0YWNoZWROb2RlQXJyYXk7XG4gICAgICAgIG5vZGVBcnJheS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYS5fYm9uZUluZGV4IDwgYi5fYm9uZUluZGV4PyAtMSA6IDE7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBfZ2V0Tm9kZUJ5Qm9uZUluZGV4IChib25lSW5kZXgpIHtcbiAgICAgICAgbGV0IGZpbmRNYXAgPSB0aGlzLl9ib25lSW5kZXhUb05vZGU7XG4gICAgICAgIGxldCBib25lTm9kZSA9IGZpbmRNYXBbYm9uZUluZGV4XTtcbiAgICAgICAgaWYgKCFib25lTm9kZSB8fCAhYm9uZU5vZGUuaXNWYWxpZCkgcmV0dXJuIG51bGw7XG4gICAgICAgIHJldHVybiBib25lTm9kZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBEZXN0cm95IGF0dGFjaGVkIG5vZGUgd2hpY2ggeW91IHdhbnQuXG4gICAgICogISN6aCDplIDmr4Hlr7nlupTnmoTmjILngrlcbiAgICAgKiBAbWV0aG9kIGRlc3Ryb3lBdHRhY2hlZE5vZGVzXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGJvbmVOYW1lXG4gICAgICovXG4gICAgZGVzdHJveUF0dGFjaGVkTm9kZXMgKGJvbmVOYW1lKSB7XG4gICAgICAgIGlmICghdGhpcy5faW5pdGVkKSByZXR1cm47XG5cbiAgICAgICAgbGV0IG5vZGVBcnJheSA9IHRoaXMuX2F0dGFjaGVkTm9kZUFycmF5O1xuICAgICAgICBsZXQgbWFya1RyZWUgPSBmdW5jdGlvbiAocm9vdE5vZGUpIHtcbiAgICAgICAgICAgIGxldCBjaGlsZHJlbiA9IHJvb3ROb2RlLmNoaWxkcmVuO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIG4gPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgYyA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgICAgIGlmIChjKSBtYXJrVHJlZShjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJvb3ROb2RlLl90b1JlbW92ZSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbiA9IG5vZGVBcnJheS5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBib25lTm9kZSA9IG5vZGVBcnJheVtpXTtcbiAgICAgICAgICAgIGlmICghYm9uZU5vZGUgfHwgIWJvbmVOb2RlLmlzVmFsaWQpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBsZXQgZGVsTmFtZSA9IGJvbmVOb2RlLm5hbWUuc3BsaXQoQVRUQUNIRURfUFJFX05BTUUpWzFdO1xuICAgICAgICAgICAgaWYgKGRlbE5hbWUgPT09IGJvbmVOYW1lKSB7XG4gICAgICAgICAgICAgICAgbWFya1RyZWUoYm9uZU5vZGUpO1xuICAgICAgICAgICAgICAgIGJvbmVOb2RlLnJlbW92ZUZyb21QYXJlbnQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgYm9uZU5vZGUuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIG5vZGVBcnJheVtpXSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9yZWJ1aWxkTm9kZUFycmF5KCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVHJhdmVyc2UgYWxsIGJvbmVzIHRvIGdlbmVyYXRlIHRoZSBtaW5pbXVtIG5vZGUgdHJlZSBjb250YWluaW5nIHRoZSBnaXZlbiBib25lIG5hbWVzLCBOT1RFIHRoYXQgbWFrZSBzdXJlIHRoZSBza2VsZXRvbiBoYXMgaW5pdGlhbGl6ZWQgYmVmb3JlIGNhbGxpbmcgdGhpcyBpbnRlcmZhY2UuXG4gICAgICogISN6aCDpgY3ljobmiYDmnInmj5Lmp73vvIznlJ/miJDljIXlkKvmiYDmnInnu5nlrprmj5Lmp73lkI3np7DnmoTmnIDlsI/oioLngrnmoJHvvIzms6jmhI/vvIzosIPnlKjor6XmjqXlj6PliY3or7fnoa7kv53pqqjpqrzliqjnlLvlt7Lnu4/liJ3lp4vljJblpb3jgIJcbiAgICAgKiBAbWV0aG9kIGdlbmVyYXRlQXR0YWNoZWROb2Rlc1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBib25lTmFtZVxuICAgICAqIEByZXR1cm4ge05vZGVbXX0gYXR0YWNoZWQgbm9kZSBhcnJheSBcbiAgICAgKi9cbiAgICBnZW5lcmF0ZUF0dGFjaGVkTm9kZXMgKGJvbmVOYW1lKSB7XG4gICAgICAgIGxldCB0YXJnZXROb2RlcyA9IFtdO1xuICAgICAgICBpZiAoIXRoaXMuX2luaXRlZCkgcmV0dXJuIHRhcmdldE5vZGVzO1xuXG4gICAgICAgIGxldCByb290Tm9kZSA9IHRoaXMuX3ByZXBhcmVBdHRhY2hOb2RlKCk7XG4gICAgICAgIGlmICghcm9vdE5vZGUpIHJldHVybiB0YXJnZXROb2RlcztcblxuICAgICAgICBsZXQgYm9uZUluZGV4ID0gMDtcbiAgICAgICAgbGV0IHJlcyA9IFtdO1xuICAgICAgICBsZXQgYXR0YWNoZWRUcmF2ZXJzZSA9IGZ1bmN0aW9uIChhcm1hdHVyZSkge1xuICAgICAgICAgICAgaWYgKCFhcm1hdHVyZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBsZXQgYm9uZXMgPSBhcm1hdHVyZS5nZXRCb25lcygpLCBib25lO1xuICAgICAgICAgICAgZm9yKGxldCBpID0gMCwgbCA9IGJvbmVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGJvbmUgPSBib25lc1tpXTtcbiAgICAgICAgICAgICAgICBib25lLl9ib25lSW5kZXggPSBib25lSW5kZXgrKztcbiAgICAgICAgICAgICAgICBpZiAoYm9uZU5hbWUgPT09IGJvbmUubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICByZXMucHVzaChib25lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBzbG90cyA9IGFybWF0dXJlLmdldFNsb3RzKCksIHNsb3Q7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHNsb3RzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIHNsb3QgPSBzbG90c1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoc2xvdC5jaGlsZEFybWF0dXJlKSB7XG4gICAgICAgICAgICAgICAgICAgIGF0dGFjaGVkVHJhdmVyc2Uoc2xvdC5jaGlsZEFybWF0dXJlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgYXR0YWNoZWRUcmF2ZXJzZSh0aGlzLl9hcm1hdHVyZSk7XG5cbiAgICAgICAgbGV0IGJ1aWxkQm9uZVRyZWUgPSBmdW5jdGlvbiAoYm9uZSkge1xuICAgICAgICAgICAgaWYgKCFib25lKSByZXR1cm47XG4gICAgICAgICAgICBsZXQgYm9uZU5vZGUgPSB0aGlzLl9nZXROb2RlQnlCb25lSW5kZXgoYm9uZS5fYm9uZUluZGV4KTtcbiAgICAgICAgICAgIGlmIChib25lTm9kZSkgcmV0dXJuIGJvbmVOb2RlO1xuXG4gICAgICAgICAgICBib25lTm9kZSA9IHRoaXMuX2J1aWxkQm9uZUF0dGFjaGVkTm9kZShib25lLCBib25lLl9ib25lSW5kZXgpO1xuXG4gICAgICAgICAgICBsZXQgc3ViQXJtYXR1cmVQYXJlbnRCb25lID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChib25lLmFybWF0dXJlLnBhcmVudCkge1xuICAgICAgICAgICAgICAgIGxldCBwYXJlbnRTbG90ID0gYm9uZS5hcm1hdHVyZS5wYXJlbnQ7XG4gICAgICAgICAgICAgICAgc3ViQXJtYXR1cmVQYXJlbnRCb25lID0gcGFyZW50U2xvdC5wYXJlbnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBwYXJlbnRCb25lTm9kZSA9IGJ1aWxkQm9uZVRyZWUoYm9uZS5wYXJlbnQgfHwgc3ViQXJtYXR1cmVQYXJlbnRCb25lKSB8fCByb290Tm9kZTtcbiAgICAgICAgICAgIGJvbmVOb2RlLnBhcmVudCA9IHBhcmVudEJvbmVOb2RlO1xuXG4gICAgICAgICAgICBpZiAoYm9uZS5wYXJlbnQpIHtcbiAgICAgICAgICAgICAgICBib25lTm9kZS5fcm9vdE5vZGUgPSBwYXJlbnRCb25lTm9kZS5fcm9vdE5vZGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJvbmVOb2RlLl9yb290Tm9kZSA9IHBhcmVudEJvbmVOb2RlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gYm9uZU5vZGU7XG4gICAgICAgIH0uYmluZCh0aGlzKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbiA9IHJlcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIGxldCB0YXJnZXROb2RlID0gYnVpbGRCb25lVHJlZShyZXNbaV0pO1xuICAgICAgICAgICAgaWYgKHRhcmdldE5vZGUpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXROb2Rlcy5wdXNoKHRhcmdldE5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fc29ydE5vZGVBcnJheSgpO1xuICAgICAgICByZXR1cm4gdGFyZ2V0Tm9kZXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gRGVzdHJveSBhbGwgYXR0YWNoZWQgbm9kZS5cbiAgICAgKiAhI3poIOmUgOavgeaJgOacieaMgueCuVxuICAgICAqIEBtZXRob2QgZGVzdHJveUFsbEF0dGFjaGVkTm9kZXNcbiAgICAgKi9cbiAgICBkZXN0cm95QWxsQXR0YWNoZWROb2RlcyAoKSB7XG4gICAgICAgIHRoaXMuX2F0dGFjaGVkUm9vdE5vZGUgPSBudWxsO1xuICAgICAgICB0aGlzLl9hdHRhY2hlZE5vZGVBcnJheS5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLl9ib25lSW5kZXhUb05vZGUgPSB7fTtcbiAgICAgICAgaWYgKCF0aGlzLl9pbml0ZWQpIHJldHVybjtcblxuICAgICAgICBsZXQgcm9vdE5vZGUgPSB0aGlzLl9hcm1hdHVyZU5vZGUuZ2V0Q2hpbGRCeU5hbWUoQVRUQUNIRURfUk9PVF9OQU1FKTtcbiAgICAgICAgaWYgKHJvb3ROb2RlKSB7XG4gICAgICAgICAgICByb290Tm9kZS5yZW1vdmVGcm9tUGFyZW50KHRydWUpO1xuICAgICAgICAgICAgcm9vdE5vZGUuZGVzdHJveSgpO1xuICAgICAgICAgICAgcm9vdE5vZGUgPSBudWxsO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVHJhdmVyc2UgYWxsIGJvbmVzIHRvIGdlbmVyYXRlIGEgdHJlZSBjb250YWluaW5nIGFsbCBib25lcyBub2RlcywgTk9URSB0aGF0IG1ha2Ugc3VyZSB0aGUgc2tlbGV0b24gaGFzIGluaXRpYWxpemVkIGJlZm9yZSBjYWxsaW5nIHRoaXMgaW50ZXJmYWNlLlxuICAgICAqICEjemgg6YGN5Y6G5omA5pyJ5o+S5qe977yM55Sf5oiQ5YyF5ZCr5omA5pyJ5o+S5qe955qE6IqC54K55qCR77yM5rOo5oSP77yM6LCD55So6K+l5o6l5Y+j5YmN6K+356Gu5L+d6aqo6aq85Yqo55S75bey57uP5Yid5aeL5YyW5aW944CCXG4gICAgICogQG1ldGhvZCBnZW5lcmF0ZUFsbEF0dGFjaGVkTm9kZXNcbiAgICAgKiBAcmV0dXJuIHtjYy5Ob2RlfSByb290IG5vZGVcbiAgICAgKi9cbiAgICBnZW5lcmF0ZUFsbEF0dGFjaGVkTm9kZXMgKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2luaXRlZCkgcmV0dXJuO1xuXG4gICAgICAgIC8vIGNsZWFyIGFsbCByZWNvcmRzXG4gICAgICAgIHRoaXMuX2JvbmVJbmRleFRvTm9kZSA9IHt9O1xuICAgICAgICB0aGlzLl9hdHRhY2hlZE5vZGVBcnJheS5sZW5ndGggPSAwO1xuXG4gICAgICAgIGxldCByb290Tm9kZSA9IHRoaXMuX3ByZXBhcmVBdHRhY2hOb2RlKCk7XG4gICAgICAgIGlmICghcm9vdE5vZGUpIHJldHVybjtcblxuICAgICAgICBsZXQgYm9uZUluZGV4ID0gMDtcbiAgICAgICAgbGV0IGF0dGFjaGVkVHJhdmVyc2UgPSBmdW5jdGlvbiAoYXJtYXR1cmUpIHtcbiAgICAgICAgICAgIGlmICghYXJtYXR1cmUpIHJldHVybjtcblxuICAgICAgICAgICAgbGV0IHN1YkFybWF0dXJlUGFyZW50Tm9kZSA9IHJvb3ROb2RlO1xuICAgICAgICAgICAgaWYgKGFybWF0dXJlLnBhcmVudCkge1xuICAgICAgICAgICAgICAgIGxldCBwYXJlbnRTbG90ID0gYXJtYXR1cmUucGFyZW50O1xuICAgICAgICAgICAgICAgIGxldCBwYXJlbnRCb25lID0gcGFyZW50U2xvdC5wYXJlbnQ7XG4gICAgICAgICAgICAgICAgc3ViQXJtYXR1cmVQYXJlbnROb2RlID0gcGFyZW50Qm9uZS5fYXR0YWNoZWROb2RlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgYm9uZXMgPSBhcm1hdHVyZS5nZXRCb25lcygpLCBib25lO1xuICAgICAgICAgICAgZm9yKGxldCBpID0gMCwgbCA9IGJvbmVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBjdXJCb25lSW5kZXggPSBib25lSW5kZXgrKztcbiAgICAgICAgICAgICAgICBib25lID0gYm9uZXNbaV07XG4gICAgICAgICAgICAgICAgYm9uZS5fYXR0YWNoZWROb2RlID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIGxldCBwYXJlbnROb2RlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAoYm9uZS5wYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Tm9kZSA9IGJvbmUucGFyZW50Ll9hdHRhY2hlZE5vZGU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Tm9kZSA9IHN1YkFybWF0dXJlUGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYm9uZU5vZGUgPSBwYXJlbnROb2RlLmdldENoaWxkQnlOYW1lKEFUVEFDSEVEX1BSRV9OQU1FICsgYm9uZS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFib25lTm9kZSB8fCAhYm9uZU5vZGUuaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYm9uZU5vZGUgPSB0aGlzLl9idWlsZEJvbmVBdHRhY2hlZE5vZGUoYm9uZSwgY3VyQm9uZUluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuYWRkQ2hpbGQoYm9uZU5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYnVpbGRCb25lUmVsYXRpb24oYm9uZU5vZGUsIGJvbmUsIGN1ckJvbmVJbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYm9uZU5vZGUuX3Jvb3ROb2RlID0gc3ViQXJtYXR1cmVQYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgICAgICBib25lLl9hdHRhY2hlZE5vZGUgPSBib25lTm9kZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBzbG90cyA9IGFybWF0dXJlLmdldFNsb3RzKCksIHNsb3Q7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHNsb3RzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIHNsb3QgPSBzbG90c1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoc2xvdC5jaGlsZEFybWF0dXJlKSB7XG4gICAgICAgICAgICAgICAgICAgIGF0dGFjaGVkVHJhdmVyc2Uoc2xvdC5jaGlsZEFybWF0dXJlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgYXR0YWNoZWRUcmF2ZXJzZSh0aGlzLl9hcm1hdHVyZSk7XG4gICAgICAgIHJldHVybiByb290Tm9kZTtcbiAgICB9LFxuXG4gICAgX2hhc0F0dGFjaGVkTm9kZSAoKSB7XG4gICAgICAgIGlmICghdGhpcy5faW5pdGVkKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgbGV0IGF0dGFjaGVkUm9vdE5vZGUgPSB0aGlzLl9hcm1hdHVyZU5vZGUuZ2V0Q2hpbGRCeU5hbWUoQVRUQUNIRURfUk9PVF9OQU1FKTtcbiAgICAgICAgcmV0dXJuICEhYXR0YWNoZWRSb290Tm9kZTtcbiAgICB9LFxuXG4gICAgX2Fzc29jaWF0ZUF0dGFjaGVkTm9kZSAoKSB7XG4gICAgICAgIGlmICghdGhpcy5faW5pdGVkKSByZXR1cm47XG5cbiAgICAgICAgbGV0IHJvb3ROb2RlID0gdGhpcy5fYXJtYXR1cmVOb2RlLmdldENoaWxkQnlOYW1lKEFUVEFDSEVEX1JPT1RfTkFNRSk7XG4gICAgICAgIGlmICghcm9vdE5vZGUgfHwgIXJvb3ROb2RlLmlzVmFsaWQpIHJldHVybjtcbiAgICAgICAgdGhpcy5fYXR0YWNoZWRSb290Tm9kZSA9IHJvb3ROb2RlO1xuXG4gICAgICAgIC8vIGNsZWFyIGFsbCByZWNvcmRzXG4gICAgICAgIHRoaXMuX2JvbmVJbmRleFRvTm9kZSA9IHt9O1xuICAgICAgICBsZXQgbm9kZUFycmF5ID0gdGhpcy5fYXR0YWNoZWROb2RlQXJyYXk7XG4gICAgICAgIG5vZGVBcnJheS5sZW5ndGggPSAwO1xuXG4gICAgICAgIGxldCBhcm1hdHVyZSA9IHRoaXMuX2FybWF0dXJlO1xuICAgICAgICBpZiAoIWFybWF0dXJlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsaW1pdE5vZGUocm9vdE5vZGUpO1xuXG4gICAgICAgIGlmICghQ0NfTkFUSVZFUkVOREVSRVIpIHtcbiAgICAgICAgICAgIGxldCBpc0NhY2hlZCA9IHRoaXMuX2FybWF0dXJlRGlzcGxheS5pc0FuaW1hdGlvbkNhY2hlZCgpO1xuICAgICAgICAgICAgaWYgKGlzQ2FjaGVkICYmIHRoaXMuX2FybWF0dXJlRGlzcGxheS5fZnJhbWVDYWNoZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2FybWF0dXJlRGlzcGxheS5fZnJhbWVDYWNoZS5lbmFibGVDYWNoZUF0dGFjaGVkSW5mbygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGJvbmVJbmRleCA9IDA7XG4gICAgICAgIGxldCBhdHRhY2hlZFRyYXZlcnNlID0gZnVuY3Rpb24gKGFybWF0dXJlKSB7XG4gICAgICAgICAgICBpZiAoIWFybWF0dXJlKSByZXR1cm47XG5cbiAgICAgICAgICAgIGxldCBzdWJBcm1hdHVyZVBhcmVudE5vZGUgPSByb290Tm9kZTtcbiAgICAgICAgICAgIGlmIChhcm1hdHVyZS5wYXJlbnQpIHtcbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50U2xvdCA9IGFybWF0dXJlLnBhcmVudDtcbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50Qm9uZSA9IHBhcmVudFNsb3QucGFyZW50O1xuICAgICAgICAgICAgICAgIHN1YkFybWF0dXJlUGFyZW50Tm9kZSA9IHBhcmVudEJvbmUuX2F0dGFjaGVkTm9kZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGJvbmVzID0gYXJtYXR1cmUuZ2V0Qm9uZXMoKSwgYm9uZTtcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDAsIGwgPSBib25lcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY3VyQm9uZUluZGV4ID0gYm9uZUluZGV4Kys7XG4gICAgICAgICAgICAgICAgYm9uZSA9IGJvbmVzW2ldO1xuICAgICAgICAgICAgICAgIGJvbmUuX2F0dGFjaGVkTm9kZSA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50Tm9kZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKGJvbmUucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudE5vZGUgPSBib25lLnBhcmVudC5fYXR0YWNoZWROb2RlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudE5vZGUgPSBzdWJBcm1hdHVyZVBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJvbmVOb2RlID0gcGFyZW50Tm9kZS5nZXRDaGlsZEJ5TmFtZShBVFRBQ0hFRF9QUkVfTkFNRSArIGJvbmUubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChib25lTm9kZSAmJiBib25lTm9kZS5pc1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9idWlsZEJvbmVSZWxhdGlvbihib25lTm9kZSwgYm9uZSwgY3VyQm9uZUluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvbmVOb2RlLl9yb290Tm9kZSA9IHN1YkFybWF0dXJlUGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvbmUuX2F0dGFjaGVkTm9kZSA9IGJvbmVOb2RlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgc2xvdHMgPSBhcm1hdHVyZS5nZXRTbG90cygpLCBzbG90O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBzbG90cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICBzbG90ID0gc2xvdHNbaV07XG4gICAgICAgICAgICAgICAgaWYgKHNsb3QuY2hpbGRBcm1hdHVyZSkge1xuICAgICAgICAgICAgICAgICAgICBhdHRhY2hlZFRyYXZlcnNlKHNsb3QuY2hpbGRBcm1hdHVyZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgICAgIGF0dGFjaGVkVHJhdmVyc2UoYXJtYXR1cmUpO1xuICAgIH0sXG5cbiAgICBfc3luY0F0dGFjaGVkTm9kZSAoKSB7XG4gICAgICAgIGlmICghdGhpcy5faW5pdGVkKSByZXR1cm47XG5cbiAgICAgICAgbGV0IHJvb3ROb2RlID0gdGhpcy5fYXR0YWNoZWRSb290Tm9kZTtcbiAgICAgICAgbGV0IG5vZGVBcnJheSA9IHRoaXMuX2F0dGFjaGVkTm9kZUFycmF5O1xuICAgICAgICBpZiAoIXJvb3ROb2RlIHx8ICFyb290Tm9kZS5pc1ZhbGlkKSB7XG4gICAgICAgICAgICB0aGlzLl9hdHRhY2hlZFJvb3ROb2RlID0gbnVsbDtcbiAgICAgICAgICAgIG5vZGVBcnJheS5sZW5ndGggPSAwO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBsZXQgcm9vdE1hdHJpeCA9IHRoaXMuX2FybWF0dXJlTm9kZS5fd29ybGRNYXRyaXg7XG4gICAgICAgIE1hdDQuY29weShyb290Tm9kZS5fd29ybGRNYXRyaXgsIHJvb3RNYXRyaXgpO1xuICAgICAgICByb290Tm9kZS5fcmVuZGVyRmxhZyAmPSB+RkxBR19UUkFOU0ZPUk07XG5cbiAgICAgICAgbGV0IGJvbmVJbmZvcyA9IG51bGw7XG4gICAgICAgIGxldCBpc0NhY2hlZCA9IHRoaXMuX2FybWF0dXJlRGlzcGxheS5pc0FuaW1hdGlvbkNhY2hlZCgpO1xuICAgICAgICBpZiAoaXNDYWNoZWQpIHtcbiAgICAgICAgICAgIGJvbmVJbmZvcyA9IHRoaXMuX2FybWF0dXJlRGlzcGxheS5fY3VyRnJhbWUgJiYgdGhpcy5fYXJtYXR1cmVEaXNwbGF5Ll9jdXJGcmFtZS5ib25lSW5mb3M7XG4gICAgICAgICAgICBpZiAoIWJvbmVJbmZvcykgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG11bE1hdCA9IHRoaXMuX2FybWF0dXJlTm9kZS5fbXVsTWF0O1xuICAgICAgICBsZXQgbWF0cml4SGFuZGxlID0gZnVuY3Rpb24gKG5vZGVNYXQsIHBhcmVudE1hdCwgYm9uZU1hdCkge1xuICAgICAgICAgICAgbGV0IHRtID0gX3RlbXBNYXQ0Lm07XG4gICAgICAgICAgICB0bVswXSA9IGJvbmVNYXQuYTtcbiAgICAgICAgICAgIHRtWzFdID0gYm9uZU1hdC5iO1xuICAgICAgICAgICAgdG1bNF0gPSAtYm9uZU1hdC5jO1xuICAgICAgICAgICAgdG1bNV0gPSAtYm9uZU1hdC5kO1xuICAgICAgICAgICAgdG1bMTJdID0gYm9uZU1hdC50eDtcbiAgICAgICAgICAgIHRtWzEzXSA9IGJvbmVNYXQudHk7XG4gICAgICAgICAgICBtdWxNYXQobm9kZU1hdCwgcGFyZW50TWF0LCBfdGVtcE1hdDQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBub2RlQXJyYXlEaXJ0eSA9IGZhbHNlO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbiA9IG5vZGVBcnJheS5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBib25lTm9kZSA9IG5vZGVBcnJheVtpXTtcbiAgICAgICAgICAgIC8vIE5vZGUgaGFzIGJlZW4gZGVzdHJveVxuICAgICAgICAgICAgaWYgKCFib25lTm9kZSB8fCAhYm9uZU5vZGUuaXNWYWxpZCkgeyBcbiAgICAgICAgICAgICAgICBub2RlQXJyYXlbaV0gPSBudWxsO1xuICAgICAgICAgICAgICAgIG5vZGVBcnJheURpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBib25lID0gaXNDYWNoZWQgPyBib25lSW5mb3NbYm9uZU5vZGUuX2JvbmVJbmRleF0gOiBib25lTm9kZS5fYm9uZTtcbiAgICAgICAgICAgIC8vIEJvbmUgaGFzIGJlZW4gZGVzdHJveVxuICAgICAgICAgICAgaWYgKCFib25lIHx8IGJvbmUuX2lzSW5Qb29sKSB7XG4gICAgICAgICAgICAgICAgYm9uZU5vZGUucmVtb3ZlRnJvbVBhcmVudCh0cnVlKTtcbiAgICAgICAgICAgICAgICBib25lTm9kZS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgbm9kZUFycmF5W2ldID0gbnVsbDtcbiAgICAgICAgICAgICAgICBub2RlQXJyYXlEaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtYXRyaXhIYW5kbGUoYm9uZU5vZGUuX3dvcmxkTWF0cml4LCBib25lTm9kZS5fcm9vdE5vZGUuX3dvcmxkTWF0cml4LCBib25lLmdsb2JhbFRyYW5zZm9ybU1hdHJpeCk7XG4gICAgICAgICAgICBib25lTm9kZS5fcmVuZGVyRmxhZyAmPSB+RkxBR19UUkFOU0ZPUk07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGVBcnJheURpcnR5KSB7XG4gICAgICAgICAgICB0aGlzLl9yZWJ1aWxkTm9kZUFycmF5KCk7XG4gICAgICAgIH1cbiAgICB9LFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZHJhZ29uQm9uZXMuQXR0YWNoVXRpbCA9IEF0dGFjaFV0aWw7Il19