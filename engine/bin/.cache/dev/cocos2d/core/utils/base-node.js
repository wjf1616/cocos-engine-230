
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/utils/base-node.js';
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
var Flags = require('../platform/CCObject').Flags;

var misc = require('./misc');

var js = require('../platform/js');

var IdGenerater = require('../platform/id-generater');

var eventManager = require('../event-manager');

var RenderFlow = require('../renderer/render-flow');

var Destroying = Flags.Destroying;
var DontDestroy = Flags.DontDestroy;
var Deactivating = Flags.Deactivating;
var CHILD_ADDED = 'child-added';
var CHILD_REMOVED = 'child-removed';
var idGenerater = new IdGenerater('Node');

function getConstructor(typeOrClassName) {
  if (!typeOrClassName) {
    cc.errorID(3804);
    return null;
  }

  if (typeof typeOrClassName === 'string') {
    return js.getClassByName(typeOrClassName);
  }

  return typeOrClassName;
}

function findComponent(node, constructor) {
  if (constructor._sealed) {
    for (var i = 0; i < node._components.length; ++i) {
      var comp = node._components[i];

      if (comp.constructor === constructor) {
        return comp;
      }
    }
  } else {
    for (var _i = 0; _i < node._components.length; ++_i) {
      var _comp = node._components[_i];

      if (_comp instanceof constructor) {
        return _comp;
      }
    }
  }

  return null;
}

function findComponents(node, constructor, components) {
  if (constructor._sealed) {
    for (var i = 0; i < node._components.length; ++i) {
      var comp = node._components[i];

      if (comp.constructor === constructor) {
        components.push(comp);
      }
    }
  } else {
    for (var _i2 = 0; _i2 < node._components.length; ++_i2) {
      var _comp2 = node._components[_i2];

      if (_comp2 instanceof constructor) {
        components.push(_comp2);
      }
    }
  }
}

function findChildComponent(children, constructor) {
  for (var i = 0; i < children.length; ++i) {
    var node = children[i];
    var comp = findComponent(node, constructor);

    if (comp) {
      return comp;
    } else if (node._children.length > 0) {
      comp = findChildComponent(node._children, constructor);

      if (comp) {
        return comp;
      }
    }
  }

  return null;
}

function findChildComponents(children, constructor, components) {
  for (var i = 0; i < children.length; ++i) {
    var node = children[i];
    findComponents(node, constructor, components);

    if (node._children.length > 0) {
      findChildComponents(node._children, constructor, components);
    }
  }
}
/**
 * A base node for CCNode, it will:
 * - maintain scene hierarchy and active logic
 * - notifications if some properties changed
 * - define some interfaces shares between CCNode
 * - define machanisms for Enity Component Systems
 * - define prefab and serialize functions
 *
 * @class _BaseNode
 * @extends Object
 * @uses EventTarget
 * @constructor
 * @param {String} [name]
 * @private
 */


var BaseNode = cc.Class({
  name: 'cc._BaseNode',
  "extends": cc.Object,
  properties: {
    // SERIALIZABLE
    _parent: null,
    _children: [],
    _active: true,

    /**
     * @property _components
     * @type {Component[]}
     * @default []
     * @readOnly
     * @private
     */
    _components: [],

    /**
     * The PrefabInfo object
     * @property _prefab
     * @type {PrefabInfo}
     * @private
     */
    _prefab: null,

    /**
     * If true, the node is an persist node which won't be destroyed during scene transition.
     * If false, the node will be destroyed automatically when loading a new scene. Default is false.
     * @property _persistNode
     * @type {Boolean}
     * @default false
     * @private
     */
    _persistNode: {
      get: function get() {
        return (this._objFlags & DontDestroy) > 0;
      },
      set: function set(value) {
        if (value) {
          this._objFlags |= DontDestroy;
        } else {
          this._objFlags &= ~DontDestroy;
        }
      }
    },
    // API

    /**
     * !#en Name of node.
     * !#zh 该节点名称。
     * @property name
     * @type {String}
     * @example
     * node.name = "New Node";
     * cc.log("Node Name: " + node.name);
     */
    name: {
      get: function get() {
        return this._name;
      },
      set: function set(value) {
        if (CC_DEV && value.indexOf('/') !== -1) {
          cc.errorID(1632);
          return;
        }

        this._name = value;

        if (CC_JSB && CC_NATIVERENDERER) {
          this._proxy.setName(this._name);
        }
      }
    },

    /**
     * !#en The uuid for editor, will be stripped before building project.
     * !#zh 主要用于编辑器的 uuid，在编辑器下可用于持久化存储，在项目构建之后将变成自增的 id。
     * @property uuid
     * @type {String}
     * @readOnly
     * @example
     * cc.log("Node Uuid: " + node.uuid);
     */
    uuid: {
      get: function get() {
        return this._id;
      }
    },

    /**
     * !#en All children nodes.
     * !#zh 节点的所有子节点。
     * @property children
     * @type {Node[]}
     * @readOnly
     * @example
     * var children = node.children;
     * for (var i = 0; i < children.length; ++i) {
     *     cc.log("Node: " + children[i]);
     * }
     */
    children: {
      get: function get() {
        return this._children;
      }
    },

    /**
     * !#en All children nodes.
     * !#zh 节点的子节点数量。
     * @property childrenCount
     * @type {Number}
     * @readOnly
     * @example
     * var count = node.childrenCount;
     * cc.log("Node Children Count: " + count);
     */
    childrenCount: {
      get: function get() {
        return this._children.length;
      }
    },

    /**
     * !#en
     * The local active state of this node.<br/>
     * Note that a Node may be inactive because a parent is not active, even if this returns true.<br/>
     * Use {{#crossLink "Node/activeInHierarchy:property"}}{{/crossLink}} if you want to check if the Node is actually treated as active in the scene.
     * !#zh
     * 当前节点的自身激活状态。<br/>
     * 值得注意的是，一个节点的父节点如果不被激活，那么即使它自身设为激活，它仍然无法激活。<br/>
     * 如果你想检查节点在场景中实际的激活状态可以使用 {{#crossLink "Node/activeInHierarchy:property"}}{{/crossLink}}。
     * @property active
     * @type {Boolean}
     * @default true
     * @example
     * node.active = false;
     */
    active: {
      get: function get() {
        return this._active;
      },
      set: function set(value) {
        value = !!value;

        if (this._active !== value) {
          this._active = value;
          var parent = this._parent;

          if (parent) {
            var couldActiveInScene = parent._activeInHierarchy;

            if (couldActiveInScene) {
              cc.director._nodeActivator.activateNode(this, value);
            }
          }
        }
      }
    },

    /**
     * !#en Indicates whether this node is active in the scene.
     * !#zh 表示此节点是否在场景中激活。
     * @property activeInHierarchy
     * @type {Boolean}
     * @example
     * cc.log("activeInHierarchy: " + node.activeInHierarchy);
     */
    activeInHierarchy: {
      get: function get() {
        return this._activeInHierarchy;
      }
    }
  },

  /**
   * @method constructor
   * @param {String} [name]
   */
  ctor: function ctor(name) {
    this._name = name !== undefined ? name : 'New Node';
    this._activeInHierarchy = false;
    this._id = CC_EDITOR ? Editor.Utils.UuidUtils.uuid() : idGenerater.getNewId();
    cc.director._scheduler && cc.director._scheduler.enableForTarget(this);
    /**
     * Register all related EventTargets,
     * all event callbacks will be removed in _onPreDestroy
     * @property __eventTargets
     * @type {EventTarget[]}
     * @private
     */

    this.__eventTargets = [];
  },

  /** 
   * !#en The parent of the node.
   * !#zh 该节点的父节点。
   * @property {Node} parent
   * @example 
   * cc.log("Node Parent: " + node.parent);
   */

  /**
   * !#en Get parent of the node.
   * !#zh 获取该节点的父节点。
   * @method getParent
   * @return {Node}
   * @example
   * var parent = this.node.getParent();
   */
  getParent: function getParent() {
    return this._parent;
  },

  /**
   * !#en Set parent of the node.
   * !#zh 设置该节点的父节点。
   * @method setParent
   * @param {Node} value
   * @example
   * node.setParent(newNode);
   */
  setParent: function setParent(value) {
    if (this._parent === value) {
      return;
    }

    if (CC_EDITOR && cc.engine && !cc.engine.isPlaying) {
      if (_Scene.DetectConflict.beforeAddChild(this, value)) {
        return;
      }
    }

    var oldParent = this._parent;

    if (CC_DEBUG && oldParent && oldParent._objFlags & Deactivating) {
      cc.errorID(3821);
    }

    this._parent = value || null;

    this._onSetParent(value);

    if (value) {
      if (CC_DEBUG && value._objFlags & Deactivating) {
        cc.errorID(3821);
      }

      eventManager._setDirtyForNode(this);

      value._children.push(this);

      value.emit && value.emit(CHILD_ADDED, this);
      value._renderFlag |= RenderFlow.FLAG_CHILDREN;
    }

    if (oldParent) {
      if (!(oldParent._objFlags & Destroying)) {
        var removeAt = oldParent._children.indexOf(this);

        if (CC_DEV && removeAt < 0) {
          return cc.errorID(1633);
        }

        oldParent._children.splice(removeAt, 1);

        oldParent.emit && oldParent.emit(CHILD_REMOVED, this);

        this._onHierarchyChanged(oldParent);

        if (oldParent._children.length === 0) {
          oldParent._renderFlag &= ~RenderFlow.FLAG_CHILDREN;
        }
      }
    } else if (value) {
      this._onHierarchyChanged(null);
    }
  },
  // ABSTRACT INTERFACES

  /**
   * !#en
   * Properties configuration function <br/>
   * All properties in attrs will be set to the node, <br/>
   * when the setter of the node is available, <br/>
   * the property will be set via setter function.<br/>
   * !#zh 属性配置函数。在 attrs 的所有属性将被设置为节点属性。
   * @method attr
   * @param {Object} attrs - Properties to be set to node
   * @example
   * var attrs = { key: 0, num: 100 };
   * node.attr(attrs);
   */
  attr: function attr(attrs) {
    js.mixin(this, attrs);
  },
  // composition: GET

  /**
   * !#en Returns a child from the container given its uuid.
   * !#zh 通过 uuid 获取节点的子节点。
   * @method getChildByUuid
   * @param {String} uuid - The uuid to find the child node.
   * @return {Node} a Node whose uuid equals to the input parameter
   * @example
   * var child = node.getChildByUuid(uuid);
   */
  getChildByUuid: function getChildByUuid(uuid) {
    if (!uuid) {
      cc.log("Invalid uuid");
      return null;
    }

    var locChildren = this._children;

    for (var i = 0, len = locChildren.length; i < len; i++) {
      if (locChildren[i]._id === uuid) return locChildren[i];
    }

    return null;
  },

  /**
   * !#en Returns a child from the container given its name.
   * !#zh 通过名称获取节点的子节点。
   * @method getChildByName
   * @param {String} name - A name to find the child node.
   * @return {Node} a CCNode object whose name equals to the input parameter
   * @example
   * var child = node.getChildByName("Test Node");
   */
  getChildByName: function getChildByName(name) {
    if (!name) {
      cc.log("Invalid name");
      return null;
    }

    var locChildren = this._children;

    for (var i = 0, len = locChildren.length; i < len; i++) {
      if (locChildren[i]._name === name) return locChildren[i];
    }

    return null;
  },
  // composition: ADD
  addChild: function addChild(child) {
    if (CC_DEV && !(child instanceof cc._BaseNode)) {
      return cc.errorID(1634, cc.js.getClassName(child));
    }

    cc.assertID(child, 1606);
    cc.assertID(child._parent === null, 1605); // invokes the parent setter

    child.setParent(this);
  },

  /**
   * !#en
   * Inserts a child to the node at a specified index.
   * !#zh
   * 插入子节点到指定位置
   * @method insertChild
   * @param {Node} child - the child node to be inserted
   * @param {Number} siblingIndex - the sibling index to place the child in
   * @example
   * node.insertChild(child, 2);
   */
  insertChild: function insertChild(child, siblingIndex) {
    child.parent = this;
    child.setSiblingIndex(siblingIndex);
  },
  // HIERARCHY METHODS

  /**
   * !#en Get the sibling index.
   * !#zh 获取同级索引。
   * @method getSiblingIndex
   * @return {Number}
   * @example
   * var index = node.getSiblingIndex();
   */
  getSiblingIndex: function getSiblingIndex() {
    if (this._parent) {
      return this._parent._children.indexOf(this);
    } else {
      return 0;
    }
  },

  /**
   * !#en Set the sibling index of this node.
   * !#zh 设置节点同级索引。
   * @method setSiblingIndex
   * @param {Number} index
   * @example
   * node.setSiblingIndex(1);
   */
  setSiblingIndex: function setSiblingIndex(index) {
    if (!this._parent) {
      return;
    }

    if (this._parent._objFlags & Deactivating) {
      cc.errorID(3821);
      return;
    }

    var siblings = this._parent._children;
    index = index !== -1 ? index : siblings.length - 1;
    var oldIndex = siblings.indexOf(this);

    if (index !== oldIndex) {
      siblings.splice(oldIndex, 1);

      if (index < siblings.length) {
        siblings.splice(index, 0, this);
      } else {
        siblings.push(this);
      }

      this._onSiblingIndexChanged && this._onSiblingIndexChanged(index);
    }
  },

  /**
   * !#en Walk though the sub children tree of the current node.
   * Each node, including the current node, in the sub tree will be visited two times, before all children and after all children.
   * This function call is not recursive, it's based on stack.
   * Please don't walk any other node inside the walk process.
   * !#zh 遍历该节点的子树里的所有节点并按规则执行回调函数。
   * 对子树中的所有节点，包含当前节点，会执行两次回调，prefunc 会在访问它的子节点之前调用，postfunc 会在访问所有子节点之后调用。
   * 这个函数的实现不是基于递归的，而是基于栈展开递归的方式。
   * 请不要在 walk 过程中对任何其他的节点嵌套执行 walk。
   * @method walk
   * @param {Function} prefunc The callback to process node when reach the node for the first time
   * @param {_BaseNode} prefunc.target The current visiting node
   * @param {Function} postfunc The callback to process node when re-visit the node after walked all children in its sub tree
   * @param {_BaseNode} postfunc.target The current visiting node
   * @example
   * node.walk(function (target) {
   *     console.log('Walked through node ' + target.name + ' for the first time');
   * }, function (target) {
   *     console.log('Walked through node ' + target.name + ' after walked all children in its sub tree');
   * });
   */
  walk: function walk(prefunc, postfunc) {
    var BaseNode = cc._BaseNode;
    var index = 1;
    var children, child, curr, i, afterChildren;
    var stack = BaseNode._stacks[BaseNode._stackId];

    if (!stack) {
      stack = [];

      BaseNode._stacks.push(stack);
    }

    BaseNode._stackId++;
    stack.length = 0;
    stack[0] = this;
    var parent = null;
    afterChildren = false;

    while (index) {
      index--;
      curr = stack[index];

      if (!curr) {
        continue;
      }

      if (!afterChildren && prefunc) {
        // pre call
        prefunc(curr);
      } else if (afterChildren && postfunc) {
        // post call
        postfunc(curr);
      } // Avoid memory leak


      stack[index] = null; // Do not repeatly visit child tree, just do post call and continue walk

      if (afterChildren) {
        afterChildren = false;
      } else {
        // Children not proceeded and has children, proceed to child tree
        if (curr._children.length > 0) {
          parent = curr;
          children = curr._children;
          i = 0;
          stack[index] = children[i];
          index++;
        } // No children, then repush curr to be walked for post func
        else {
            stack[index] = curr;
            index++;
            afterChildren = true;
          }

        continue;
      } // curr has no sub tree, so look into the siblings in parent children


      if (children) {
        i++; // Proceed to next sibling in parent children

        if (children[i]) {
          stack[index] = children[i];
          index++;
        } // No children any more in this sub tree, go upward
        else if (parent) {
            stack[index] = parent;
            index++; // Setup parent walk env

            afterChildren = true;

            if (parent._parent) {
              children = parent._parent._children;
              i = children.indexOf(parent);
              parent = parent._parent;
            } else {
              // At root
              parent = null;
              children = null;
            } // ERROR


            if (i < 0) {
              break;
            }
          }
      }
    }

    stack.length = 0;
    BaseNode._stackId--;
  },
  cleanup: function cleanup() {},

  /**
   * !#en
   * Remove itself from its parent node. If cleanup is `true`, then also remove all events and actions. <br/>
   * If the cleanup parameter is not passed, it will force a cleanup, so it is recommended that you always pass in the `false` parameter when calling this API.<br/>
   * If the node orphan, then nothing happens.
   * !#zh
   * 从父节点中删除该节点。如果不传入 cleanup 参数或者传入 `true`，那么这个节点上所有绑定的事件、action 都会被删除。<br/>
   * 因此建议调用这个 API 时总是传入 `false` 参数。<br/>
   * 如果这个节点是一个孤节点，那么什么都不会发生。
   * @method removeFromParent
   * @param {Boolean} [cleanup=true] - true if all actions and callbacks on this node should be removed, false otherwise.
   * @see cc.Node#removeFromParentAndCleanup
   * @example
   * node.removeFromParent();
   * node.removeFromParent(false);
   */
  removeFromParent: function removeFromParent(cleanup) {
    if (this._parent) {
      if (cleanup === undefined) cleanup = true;

      this._parent.removeChild(this, cleanup);
    }
  },

  /**
   * !#en
   * Removes a child from the container. It will also cleanup all running actions depending on the cleanup parameter. </p>
   * If the cleanup parameter is not passed, it will force a cleanup. <br/>
   * "remove" logic MUST only be on this method  <br/>
   * If a class wants to extend the 'removeChild' behavior it only needs <br/>
   * to override this method.
   * !#zh
   * 移除节点中指定的子节点，是否需要清理所有正在运行的行为取决于 cleanup 参数。<br/>
   * 如果 cleanup 参数不传入，默认为 true 表示清理。<br/>
   * @method removeChild
   * @param {Node} child - The child node which will be removed.
   * @param {Boolean} [cleanup=true] - true if all running actions and callbacks on the child node will be cleanup, false otherwise.
   * @example
   * node.removeChild(newNode);
   * node.removeChild(newNode, false);
   */
  removeChild: function removeChild(child, cleanup) {
    if (this._children.indexOf(child) > -1) {
      // If you don't do cleanup, the child's actions will not get removed and the
      if (cleanup || cleanup === undefined) {
        child.cleanup();
      } // invoke the parent setter


      child.parent = null;
    }
  },

  /**
   * !#en
   * Removes all children from the container and do a cleanup all running actions depending on the cleanup parameter. <br/>
   * If the cleanup parameter is not passed, it will force a cleanup.
   * !#zh
   * 移除节点所有的子节点，是否需要清理所有正在运行的行为取决于 cleanup 参数。<br/>
   * 如果 cleanup 参数不传入，默认为 true 表示清理。
   * @method removeAllChildren
   * @param {Boolean} [cleanup=true] - true if all running actions on all children nodes should be cleanup, false otherwise.
   * @example
   * node.removeAllChildren();
   * node.removeAllChildren(false);
   */
  removeAllChildren: function removeAllChildren(cleanup) {
    // not using detachChild improves speed here
    var children = this._children;
    if (cleanup === undefined) cleanup = true;

    for (var i = children.length - 1; i >= 0; i--) {
      var node = children[i];

      if (node) {
        // If you don't do cleanup, the node's actions will not get removed and the
        if (cleanup) node.cleanup();
        node.parent = null;
      }
    }

    this._children.length = 0;
  },

  /**
   * !#en Is this node a child of the given node?
   * !#zh 是否是指定节点的子节点？
   * @method isChildOf
   * @param {Node} parent
   * @return {Boolean} - Returns true if this node is a child, deep child or identical to the given node.
   * @example
   * node.isChildOf(newNode);
   */
  isChildOf: function isChildOf(parent) {
    var child = this;

    do {
      if (child === parent) {
        return true;
      }

      child = child._parent;
    } while (child);

    return false;
  },
  // COMPONENT

  /**
   * !#en
   * Returns the component of supplied type if the node has one attached, null if it doesn't.<br/>
   * You can also get component in the node by passing in the name of the script.
   * !#zh
   * 获取节点上指定类型的组件，如果节点有附加指定类型的组件，则返回，如果没有则为空。<br/>
   * 传入参数也可以是脚本的名称。
   * @method getComponent
   * @param {Function|String} typeOrClassName
   * @return {Component}
   * @example
   * // get sprite component
   * var sprite = node.getComponent(cc.Sprite);
   * // get custom test class
   * var test = node.getComponent("Test");
   * @typescript
   * getComponent<T extends Component>(type: {prototype: T}): T
   * getComponent(className: string): any
   */
  getComponent: function getComponent(typeOrClassName) {
    var constructor = getConstructor(typeOrClassName);

    if (constructor) {
      return findComponent(this, constructor);
    }

    return null;
  },

  /**
   * !#en Returns all components of supplied type in the node.
   * !#zh 返回节点上指定类型的所有组件。
   * @method getComponents
   * @param {Function|String} typeOrClassName
   * @return {Component[]}
   * @example
   * var sprites = node.getComponents(cc.Sprite);
   * var tests = node.getComponents("Test");
   * @typescript
   * getComponents<T extends Component>(type: {prototype: T}): T[]
   * getComponents(className: string): any[]
   */
  getComponents: function getComponents(typeOrClassName) {
    var constructor = getConstructor(typeOrClassName),
        components = [];

    if (constructor) {
      findComponents(this, constructor, components);
    }

    return components;
  },

  /**
   * !#en Returns the component of supplied type in any of its children using depth first search.
   * !#zh 递归查找所有子节点中第一个匹配指定类型的组件。
   * @method getComponentInChildren
   * @param {Function|String} typeOrClassName
   * @return {Component}
   * @example
   * var sprite = node.getComponentInChildren(cc.Sprite);
   * var Test = node.getComponentInChildren("Test");
   * @typescript
   * getComponentInChildren<T extends Component>(type: {prototype: T}): T
   * getComponentInChildren(className: string): any
   */
  getComponentInChildren: function getComponentInChildren(typeOrClassName) {
    var constructor = getConstructor(typeOrClassName);

    if (constructor) {
      return findChildComponent(this._children, constructor);
    }

    return null;
  },

  /**
   * !#en Returns all components of supplied type in self or any of its children.
   * !#zh 递归查找自身或所有子节点中指定类型的组件
   * @method getComponentsInChildren
   * @param {Function|String} typeOrClassName
   * @return {Component[]}
   * @example
   * var sprites = node.getComponentsInChildren(cc.Sprite);
   * var tests = node.getComponentsInChildren("Test");
   * @typescript
   * getComponentsInChildren<T extends Component>(type: {prototype: T}): T[]
   * getComponentsInChildren(className: string): any[]
   */
  getComponentsInChildren: function getComponentsInChildren(typeOrClassName) {
    var constructor = getConstructor(typeOrClassName),
        components = [];

    if (constructor) {
      findComponents(this, constructor, components);
      findChildComponents(this._children, constructor, components);
    }

    return components;
  },
  _checkMultipleComp: CC_EDITOR && function (ctor) {
    var existing = this.getComponent(ctor._disallowMultiple);

    if (existing) {
      if (existing.constructor === ctor) {
        cc.errorID(3805, js.getClassName(ctor), this._name);
      } else {
        cc.errorID(3806, js.getClassName(ctor), this._name, js.getClassName(existing));
      }

      return false;
    }

    return true;
  },

  /**
   * !#en Adds a component class to the node. You can also add component to node by passing in the name of the script.
   * !#zh 向节点添加一个指定类型的组件类，你还可以通过传入脚本的名称来添加组件。
   * @method addComponent
   * @param {Function|String} typeOrClassName - The constructor or the class name of the component to add
   * @return {Component} - The newly added component
   * @example
   * var sprite = node.addComponent(cc.Sprite);
   * var test = node.addComponent("Test");
   * @typescript
   * addComponent<T extends Component>(type: {new(): T}): T
   * addComponent(className: string): any
   */
  addComponent: function addComponent(typeOrClassName) {
    if (CC_EDITOR && this._objFlags & Destroying) {
      cc.error('isDestroying');
      return null;
    } // get component


    var constructor;

    if (typeof typeOrClassName === 'string') {
      constructor = js.getClassByName(typeOrClassName);

      if (!constructor) {
        cc.errorID(3807, typeOrClassName);

        if (cc._RFpeek()) {
          cc.errorID(3808, typeOrClassName);
        }

        return null;
      }
    } else {
      if (!typeOrClassName) {
        cc.errorID(3804);
        return null;
      }

      constructor = typeOrClassName;
    } // check component


    if (typeof constructor !== 'function') {
      cc.errorID(3809);
      return null;
    }

    if (!js.isChildClassOf(constructor, cc.Component)) {
      cc.errorID(3810);
      return null;
    }

    if (CC_EDITOR && constructor._disallowMultiple) {
      if (!this._checkMultipleComp(constructor)) {
        return null;
      }
    } // check requirement


    var ReqComp = constructor._requireComponent;

    if (ReqComp && !this.getComponent(ReqComp)) {
      var depended = this.addComponent(ReqComp);

      if (!depended) {
        // depend conflicts
        return null;
      }
    } //// check conflict
    //
    //if (CC_EDITOR && !_Scene.DetectConflict.beforeAddComponent(this, constructor)) {
    //    return null;
    //}
    //


    var component = new constructor();
    component.node = this;

    this._components.push(component);

    if ((CC_EDITOR || CC_TEST) && cc.engine && this._id in cc.engine.attachedObjsForEditor) {
      cc.engine.attachedObjsForEditor[component._id] = component;
    }

    if (this._activeInHierarchy) {
      cc.director._nodeActivator.activateComp(component);
    }

    return component;
  },

  /**
   * This api should only used by undo system
   * @method _addComponentAt
   * @param {Component} comp
   * @param {Number} index
   * @private
   */
  _addComponentAt: CC_EDITOR && function (comp, index) {
    if (this._objFlags & Destroying) {
      return cc.error('isDestroying');
    }

    if (!(comp instanceof cc.Component)) {
      return cc.errorID(3811);
    }

    if (index > this._components.length) {
      return cc.errorID(3812);
    } // recheck attributes because script may changed


    var ctor = comp.constructor;

    if (ctor._disallowMultiple) {
      if (!this._checkMultipleComp(ctor)) {
        return;
      }
    }

    var ReqComp = ctor._requireComponent;

    if (ReqComp && !this.getComponent(ReqComp)) {
      if (index === this._components.length) {
        // If comp should be last component, increase the index because required component added
        ++index;
      }

      var depended = this.addComponent(ReqComp);

      if (!depended) {
        // depend conflicts
        return null;
      }
    }

    comp.node = this;

    this._components.splice(index, 0, comp);

    if ((CC_EDITOR || CC_TEST) && cc.engine && this._id in cc.engine.attachedObjsForEditor) {
      cc.engine.attachedObjsForEditor[comp._id] = comp;
    }

    if (this._activeInHierarchy) {
      cc.director._nodeActivator.activateComp(comp);
    }
  },

  /**
   * !#en
   * Removes a component identified by the given name or removes the component object given.
   * You can also use component.destroy() if you already have the reference.
   * !#zh
   * 删除节点上的指定组件，传入参数可以是一个组件构造函数或组件名，也可以是已经获得的组件引用。
   * 如果你已经获得组件引用，你也可以直接调用 component.destroy()
   * @method removeComponent
   * @param {String|Function|Component} component - The need remove component.
   * @deprecated please destroy the component to remove it.
   * @example
   * node.removeComponent(cc.Sprite);
   * var Test = require("Test");
   * node.removeComponent(Test);
   */
  removeComponent: function removeComponent(component) {
    if (!component) {
      cc.errorID(3813);
      return;
    }

    if (!(component instanceof cc.Component)) {
      component = this.getComponent(component);
    }

    if (component) {
      component.destroy();
    }
  },

  /**
   * @method _getDependComponent
   * @param {Component} depended
   * @return {Component}
   * @private
   */
  _getDependComponent: CC_EDITOR && function (depended) {
    for (var i = 0; i < this._components.length; i++) {
      var comp = this._components[i];

      if (comp !== depended && comp.isValid && !cc.Object._willDestroy(comp)) {
        var depend = comp.constructor._requireComponent;

        if (depend && depended instanceof depend) {
          return comp;
        }
      }
    }

    return null;
  },
  // do remove component, only used internally
  _removeComponent: function _removeComponent(component) {
    if (!component) {
      cc.errorID(3814);
      return;
    }

    if (!(this._objFlags & Destroying)) {
      var i = this._components.indexOf(component);

      if (i !== -1) {
        this._components.splice(i, 1);

        if ((CC_EDITOR || CC_TEST) && cc.engine) {
          delete cc.engine.attachedObjsForEditor[component._id];
        }
      } else if (component.node !== this) {
        cc.errorID(3815);
      }
    }
  },
  destroy: function destroy() {
    if (cc.Object.prototype.destroy.call(this)) {
      this.active = false;
    }
  },

  /**
   * !#en
   * Destroy all children from the node, and release all their own references to other objects.<br/>
   * Actual destruct operation will delayed until before rendering.
   * !#zh
   * 销毁所有子节点，并释放所有它们对其它对象的引用。<br/>
   * 实际销毁操作会延迟到当前帧渲染前执行。
   * @method destroyAllChildren
   * @example
   * node.destroyAllChildren();
   */
  destroyAllChildren: function destroyAllChildren() {
    var children = this._children;

    for (var i = 0; i < children.length; ++i) {
      children[i].destroy();
    }
  },
  _onSetParent: function _onSetParent(value) {},
  _onPostActivated: function _onPostActivated() {},
  _onBatchRestored: function _onBatchRestored() {},
  _onBatchCreated: function _onBatchCreated() {},
  _onHierarchyChanged: function _onHierarchyChanged(oldParent) {
    var newParent = this._parent;

    if (this._persistNode && !(newParent instanceof cc.Scene)) {
      cc.game.removePersistRootNode(this);

      if (CC_EDITOR) {
        cc.warnID(1623);
      }
    }

    if (CC_EDITOR || CC_TEST) {
      var scene = cc.director.getScene();
      var inCurrentSceneBefore = oldParent && oldParent.isChildOf(scene);
      var inCurrentSceneNow = newParent && newParent.isChildOf(scene);

      if (!inCurrentSceneBefore && inCurrentSceneNow) {
        // attached
        this._registerIfAttached(true);
      } else if (inCurrentSceneBefore && !inCurrentSceneNow) {
        // detached
        this._registerIfAttached(false);
      } // update prefab


      var newPrefabRoot = newParent && newParent._prefab && newParent._prefab.root;
      var myPrefabInfo = this._prefab;

      var PrefabUtils = Editor.require('scene://utils/prefab');

      if (myPrefabInfo) {
        if (newPrefabRoot) {
          if (myPrefabInfo.root !== newPrefabRoot) {
            // change prefab
            PrefabUtils.unlinkPrefab(this);
            PrefabUtils.linkPrefab(newPrefabRoot._prefab.asset, newPrefabRoot, this);
          }
        } else if (myPrefabInfo.root !== this) {
          // detach from prefab
          PrefabUtils.unlinkPrefab(this);
        }
      } else if (newPrefabRoot) {
        // attach to prefab
        PrefabUtils.linkPrefab(newPrefabRoot._prefab.asset, newPrefabRoot, this);
      } // conflict detection


      _Scene.DetectConflict.afterAddChild(this);
    }

    var shouldActiveNow = this._active && !!(newParent && newParent._activeInHierarchy);

    if (this._activeInHierarchy !== shouldActiveNow) {
      cc.director._nodeActivator.activateNode(this, shouldActiveNow);
    }
  },
  _instantiate: function _instantiate(cloned) {
    if (!cloned) {
      cloned = cc.instantiate._clone(this, this);
    }

    var thisPrefabInfo = this._prefab;

    if (CC_EDITOR && thisPrefabInfo) {
      if (this !== thisPrefabInfo.root) {
        var PrefabUtils = Editor.require('scene://utils/prefab');

        PrefabUtils.initClonedChildOfPrefab(cloned);
      }
    }

    var syncing = thisPrefabInfo && this === thisPrefabInfo.root && thisPrefabInfo.sync;

    if (syncing) {//if (thisPrefabInfo._synced) {
      //    return clone;
      //}
    } else if (CC_EDITOR && cc.engine._isPlaying) {
      cloned._name += ' (Clone)';
    } // reset and init


    cloned._parent = null;

    cloned._onBatchRestored();

    return cloned;
  },
  _registerIfAttached: (CC_EDITOR || CC_TEST) && function (register) {
    var attachedObjsForEditor = cc.engine.attachedObjsForEditor;

    if (register) {
      attachedObjsForEditor[this._id] = this;

      for (var i = 0; i < this._components.length; i++) {
        var comp = this._components[i];
        attachedObjsForEditor[comp._id] = comp;
      }

      cc.engine.emit('node-attach-to-scene', this);
    } else {
      cc.engine.emit('node-detach-from-scene', this);
      delete attachedObjsForEditor[this._id];

      for (var _i3 = 0; _i3 < this._components.length; _i3++) {
        var _comp3 = this._components[_i3];
        delete attachedObjsForEditor[_comp3._id];
      }
    }

    var children = this._children;

    for (var _i4 = 0, len = children.length; _i4 < len; ++_i4) {
      var child = children[_i4];

      child._registerIfAttached(register);
    }
  },
  _onPreDestroy: function _onPreDestroy() {
    var i, len; // marked as destroying

    this._objFlags |= Destroying; // detach self and children from editor

    var parent = this._parent;
    var destroyByParent = parent && parent._objFlags & Destroying;

    if (!destroyByParent && (CC_EDITOR || CC_TEST)) {
      this._registerIfAttached(false);
    } // destroy children


    var children = this._children;

    for (i = 0, len = children.length; i < len; ++i) {
      // destroy immediate so its _onPreDestroy can be called
      children[i]._destroyImmediate();
    } // destroy self components


    for (i = 0, len = this._components.length; i < len; ++i) {
      var component = this._components[i]; // destroy immediate so its _onPreDestroy can be called

      component._destroyImmediate();
    }

    var eventTargets = this.__eventTargets;

    for (i = 0, len = eventTargets.length; i < len; ++i) {
      var target = eventTargets[i];
      target && target.targetOff(this);
    }

    eventTargets.length = 0; // remove from persist

    if (this._persistNode) {
      cc.game.removePersistRootNode(this);
    }

    if (!destroyByParent) {
      // remove from parent
      if (parent) {
        var childIndex = parent._children.indexOf(this);

        parent._children.splice(childIndex, 1);

        parent.emit && parent.emit('child-removed', this);
      }
    }

    return destroyByParent;
  },
  onRestore: CC_EDITOR && function () {
    // check activity state
    var shouldActiveNow = this._active && !!(this._parent && this._parent._activeInHierarchy);

    if (this._activeInHierarchy !== shouldActiveNow) {
      cc.director._nodeActivator.activateNode(this, shouldActiveNow);
    }
  }
});
BaseNode.idGenerater = idGenerater; // For walk

BaseNode._stacks = [[]];
BaseNode._stackId = 0;
BaseNode.prototype._onPreDestroyBase = BaseNode.prototype._onPreDestroy;

if (CC_EDITOR) {
  BaseNode.prototype._onPreDestroy = function () {
    var destroyByParent = this._onPreDestroyBase();

    if (!destroyByParent) {
      // ensure this node can reattach to scene by undo system
      // (simulate some destruct logic to make undo system work correctly)
      this._parent = null;
    }

    return destroyByParent;
  };
}

BaseNode.prototype._onHierarchyChangedBase = BaseNode.prototype._onHierarchyChanged;

if (CC_EDITOR) {
  BaseNode.prototype._onRestoreBase = BaseNode.prototype.onRestore;
} // Define public getter and setter methods to ensure api compatibility.


var SameNameGetSets = ['parent', 'name', 'children', 'childrenCount'];
misc.propertyDefine(BaseNode, SameNameGetSets, {});

if (CC_DEV) {
  // promote debug info
  js.get(BaseNode.prototype, ' INFO ', function () {
    var path = '';
    var node = this;

    while (node && !(node instanceof cc.Scene)) {
      if (path) {
        path = node.name + '/' + path;
      } else {
        path = node.name;
      }

      node = node._parent;
    }

    return this.name + ', path: ' + path;
  });
}
/**
 * !#en
 * Note: This event is only emitted from the top most node whose active value did changed,
 * not including its child nodes.
 * !#zh
 * 注意：此节点激活时，此事件仅从最顶部的节点发出。
 * @event active-in-hierarchy-changed
 * @param {Event.EventCustom} event
 */


cc._BaseNode = module.exports = BaseNode;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2Utbm9kZS5qcyJdLCJuYW1lcyI6WyJGbGFncyIsInJlcXVpcmUiLCJtaXNjIiwianMiLCJJZEdlbmVyYXRlciIsImV2ZW50TWFuYWdlciIsIlJlbmRlckZsb3ciLCJEZXN0cm95aW5nIiwiRG9udERlc3Ryb3kiLCJEZWFjdGl2YXRpbmciLCJDSElMRF9BRERFRCIsIkNISUxEX1JFTU9WRUQiLCJpZEdlbmVyYXRlciIsImdldENvbnN0cnVjdG9yIiwidHlwZU9yQ2xhc3NOYW1lIiwiY2MiLCJlcnJvcklEIiwiZ2V0Q2xhc3NCeU5hbWUiLCJmaW5kQ29tcG9uZW50Iiwibm9kZSIsImNvbnN0cnVjdG9yIiwiX3NlYWxlZCIsImkiLCJfY29tcG9uZW50cyIsImxlbmd0aCIsImNvbXAiLCJmaW5kQ29tcG9uZW50cyIsImNvbXBvbmVudHMiLCJwdXNoIiwiZmluZENoaWxkQ29tcG9uZW50IiwiY2hpbGRyZW4iLCJfY2hpbGRyZW4iLCJmaW5kQ2hpbGRDb21wb25lbnRzIiwiQmFzZU5vZGUiLCJDbGFzcyIsIm5hbWUiLCJPYmplY3QiLCJwcm9wZXJ0aWVzIiwiX3BhcmVudCIsIl9hY3RpdmUiLCJfcHJlZmFiIiwiX3BlcnNpc3ROb2RlIiwiZ2V0IiwiX29iakZsYWdzIiwic2V0IiwidmFsdWUiLCJfbmFtZSIsIkNDX0RFViIsImluZGV4T2YiLCJDQ19KU0IiLCJDQ19OQVRJVkVSRU5ERVJFUiIsIl9wcm94eSIsInNldE5hbWUiLCJ1dWlkIiwiX2lkIiwiY2hpbGRyZW5Db3VudCIsImFjdGl2ZSIsInBhcmVudCIsImNvdWxkQWN0aXZlSW5TY2VuZSIsIl9hY3RpdmVJbkhpZXJhcmNoeSIsImRpcmVjdG9yIiwiX25vZGVBY3RpdmF0b3IiLCJhY3RpdmF0ZU5vZGUiLCJhY3RpdmVJbkhpZXJhcmNoeSIsImN0b3IiLCJ1bmRlZmluZWQiLCJDQ19FRElUT1IiLCJFZGl0b3IiLCJVdGlscyIsIlV1aWRVdGlscyIsImdldE5ld0lkIiwiX3NjaGVkdWxlciIsImVuYWJsZUZvclRhcmdldCIsIl9fZXZlbnRUYXJnZXRzIiwiZ2V0UGFyZW50Iiwic2V0UGFyZW50IiwiZW5naW5lIiwiaXNQbGF5aW5nIiwiX1NjZW5lIiwiRGV0ZWN0Q29uZmxpY3QiLCJiZWZvcmVBZGRDaGlsZCIsIm9sZFBhcmVudCIsIkNDX0RFQlVHIiwiX29uU2V0UGFyZW50IiwiX3NldERpcnR5Rm9yTm9kZSIsImVtaXQiLCJfcmVuZGVyRmxhZyIsIkZMQUdfQ0hJTERSRU4iLCJyZW1vdmVBdCIsInNwbGljZSIsIl9vbkhpZXJhcmNoeUNoYW5nZWQiLCJhdHRyIiwiYXR0cnMiLCJtaXhpbiIsImdldENoaWxkQnlVdWlkIiwibG9nIiwibG9jQ2hpbGRyZW4iLCJsZW4iLCJnZXRDaGlsZEJ5TmFtZSIsImFkZENoaWxkIiwiY2hpbGQiLCJfQmFzZU5vZGUiLCJnZXRDbGFzc05hbWUiLCJhc3NlcnRJRCIsImluc2VydENoaWxkIiwic2libGluZ0luZGV4Iiwic2V0U2libGluZ0luZGV4IiwiZ2V0U2libGluZ0luZGV4IiwiaW5kZXgiLCJzaWJsaW5ncyIsIm9sZEluZGV4IiwiX29uU2libGluZ0luZGV4Q2hhbmdlZCIsIndhbGsiLCJwcmVmdW5jIiwicG9zdGZ1bmMiLCJjdXJyIiwiYWZ0ZXJDaGlsZHJlbiIsInN0YWNrIiwiX3N0YWNrcyIsIl9zdGFja0lkIiwiY2xlYW51cCIsInJlbW92ZUZyb21QYXJlbnQiLCJyZW1vdmVDaGlsZCIsInJlbW92ZUFsbENoaWxkcmVuIiwiaXNDaGlsZE9mIiwiZ2V0Q29tcG9uZW50IiwiZ2V0Q29tcG9uZW50cyIsImdldENvbXBvbmVudEluQ2hpbGRyZW4iLCJnZXRDb21wb25lbnRzSW5DaGlsZHJlbiIsIl9jaGVja011bHRpcGxlQ29tcCIsImV4aXN0aW5nIiwiX2Rpc2FsbG93TXVsdGlwbGUiLCJhZGRDb21wb25lbnQiLCJlcnJvciIsIl9SRnBlZWsiLCJpc0NoaWxkQ2xhc3NPZiIsIkNvbXBvbmVudCIsIlJlcUNvbXAiLCJfcmVxdWlyZUNvbXBvbmVudCIsImRlcGVuZGVkIiwiY29tcG9uZW50IiwiQ0NfVEVTVCIsImF0dGFjaGVkT2Jqc0ZvckVkaXRvciIsImFjdGl2YXRlQ29tcCIsIl9hZGRDb21wb25lbnRBdCIsInJlbW92ZUNvbXBvbmVudCIsImRlc3Ryb3kiLCJfZ2V0RGVwZW5kQ29tcG9uZW50IiwiaXNWYWxpZCIsIl93aWxsRGVzdHJveSIsImRlcGVuZCIsIl9yZW1vdmVDb21wb25lbnQiLCJwcm90b3R5cGUiLCJjYWxsIiwiZGVzdHJveUFsbENoaWxkcmVuIiwiX29uUG9zdEFjdGl2YXRlZCIsIl9vbkJhdGNoUmVzdG9yZWQiLCJfb25CYXRjaENyZWF0ZWQiLCJuZXdQYXJlbnQiLCJTY2VuZSIsImdhbWUiLCJyZW1vdmVQZXJzaXN0Um9vdE5vZGUiLCJ3YXJuSUQiLCJzY2VuZSIsImdldFNjZW5lIiwiaW5DdXJyZW50U2NlbmVCZWZvcmUiLCJpbkN1cnJlbnRTY2VuZU5vdyIsIl9yZWdpc3RlcklmQXR0YWNoZWQiLCJuZXdQcmVmYWJSb290Iiwicm9vdCIsIm15UHJlZmFiSW5mbyIsIlByZWZhYlV0aWxzIiwidW5saW5rUHJlZmFiIiwibGlua1ByZWZhYiIsImFzc2V0IiwiYWZ0ZXJBZGRDaGlsZCIsInNob3VsZEFjdGl2ZU5vdyIsIl9pbnN0YW50aWF0ZSIsImNsb25lZCIsImluc3RhbnRpYXRlIiwiX2Nsb25lIiwidGhpc1ByZWZhYkluZm8iLCJpbml0Q2xvbmVkQ2hpbGRPZlByZWZhYiIsInN5bmNpbmciLCJzeW5jIiwiX2lzUGxheWluZyIsInJlZ2lzdGVyIiwiX29uUHJlRGVzdHJveSIsImRlc3Ryb3lCeVBhcmVudCIsIl9kZXN0cm95SW1tZWRpYXRlIiwiZXZlbnRUYXJnZXRzIiwidGFyZ2V0IiwidGFyZ2V0T2ZmIiwiY2hpbGRJbmRleCIsIm9uUmVzdG9yZSIsIl9vblByZURlc3Ryb3lCYXNlIiwiX29uSGllcmFyY2h5Q2hhbmdlZEJhc2UiLCJfb25SZXN0b3JlQmFzZSIsIlNhbWVOYW1lR2V0U2V0cyIsInByb3BlcnR5RGVmaW5lIiwicGF0aCIs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Q0FBbUI2QyxjQUFuQixHQUFvQ3BLLFFBQVEsQ0FBQ3VILFNBQVQsQ0FBbUIwQyxTQUF2RDtBQUNILEVBRUQ7OztBQUNBLElBQUlJLGVBQWUsR0FBRyxDQUFDLFFBQUQsRUFBVyxNQUFYLEVBQW1CLFVBQW5CLEVBQStCLGVBQS9CLENBQXRCO0FBQ0FwTSxJQUFJLENBQUNxTSxjQUFMLENBQW9CdEssUUFBcEIsRUFBOEJxSyxlQUE5QixFQUErQyxFQUEvQzs7QUFFQSxJQUFJdkosTUFBSixFQUFZO0FBQ1I7QUFDQTVDLEVBQUFBLEVBQUUsQ0FBQ3VDLEdBQUgsQ0FBT1QsUUFBUSxDQUFDdUgsU0FBaEIsRUFBMkIsUUFBM0IsRUFBcUMsWUFBWTtBQUM3QyxRQUFJZ0QsSUFBSSxHQUFHLEVBQVg7QUFDQSxRQUFJckwsSUFBSSxHQUFHLElBQVg7O0FBQ0EsV0FBT0EsSUFBSSxJQUFJLEVBQUVBLElBQUksWUFBWUosRUFBRSxDQUFDZ0osS0FBckIsQ0FBZixFQUE0QztBQUN4QyxVQUFJeUMsSUFBSixFQUFVO0FBQ05BLFFBQUFBLElBQUksR0FBR3JMLElBQUksQ0FBQ2dCLElBQUwsR0FBWSxHQUFaLEdBQWtCcUssSUFBekI7QUFDSCxPQUZELE1BR0s7QUFDREEsUUFBQUEsSUFBSSxHQUFHckwsSUFBSSxDQUFDZ0IsSUFBWjtBQUNIOztBQUNEaEIsTUFBQUEsSUFBSSxHQUFHQSxJQUFJLENBQUNtQixPQUFaO0FBQ0g7O0FBQ0QsV0FBTyxLQUFLSCxJQUFMLEdBQVksVUFBWixHQUF5QnFLLElBQWhDO0FBQ0gsR0FiRDtBQWNIO0FBRUQ7Ozs7Ozs7Ozs7O0FBVUF6TCxFQUFFLENBQUNzRixTQUFILEdBQWVvRyxNQUFNLENBQUNDLE9BQVAsR0FBaUJ6SyxRQUFoQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBGbGFncyA9IHJlcXVpcmUoJy4uL3BsYXRmb3JtL0NDT2JqZWN0JykuRmxhZ3M7XG5jb25zdCBtaXNjID0gcmVxdWlyZSgnLi9taXNjJyk7XG5jb25zdCBqcyA9IHJlcXVpcmUoJy4uL3BsYXRmb3JtL2pzJyk7XG5jb25zdCBJZEdlbmVyYXRlciA9IHJlcXVpcmUoJy4uL3BsYXRmb3JtL2lkLWdlbmVyYXRlcicpO1xuY29uc3QgZXZlbnRNYW5hZ2VyID0gcmVxdWlyZSgnLi4vZXZlbnQtbWFuYWdlcicpO1xuY29uc3QgUmVuZGVyRmxvdyA9IHJlcXVpcmUoJy4uL3JlbmRlcmVyL3JlbmRlci1mbG93Jyk7XG5cbmNvbnN0IERlc3Ryb3lpbmcgPSBGbGFncy5EZXN0cm95aW5nO1xuY29uc3QgRG9udERlc3Ryb3kgPSBGbGFncy5Eb250RGVzdHJveTtcbmNvbnN0IERlYWN0aXZhdGluZyA9IEZsYWdzLkRlYWN0aXZhdGluZzsgXG5cbmNvbnN0IENISUxEX0FEREVEID0gJ2NoaWxkLWFkZGVkJztcbmNvbnN0IENISUxEX1JFTU9WRUQgPSAnY2hpbGQtcmVtb3ZlZCc7XG5cbnZhciBpZEdlbmVyYXRlciA9IG5ldyBJZEdlbmVyYXRlcignTm9kZScpO1xuXG5mdW5jdGlvbiBnZXRDb25zdHJ1Y3Rvcih0eXBlT3JDbGFzc05hbWUpIHtcbiAgICBpZiAoIXR5cGVPckNsYXNzTmFtZSkge1xuICAgICAgICBjYy5lcnJvcklEKDM4MDQpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0eXBlT3JDbGFzc05hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBqcy5nZXRDbGFzc0J5TmFtZSh0eXBlT3JDbGFzc05hbWUpO1xuICAgIH1cblxuICAgIHJldHVybiB0eXBlT3JDbGFzc05hbWU7XG59XG5cbmZ1bmN0aW9uIGZpbmRDb21wb25lbnQobm9kZSwgY29uc3RydWN0b3IpIHtcbiAgICBpZiAoY29uc3RydWN0b3IuX3NlYWxlZCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuX2NvbXBvbmVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGxldCBjb21wID0gbm9kZS5fY29tcG9uZW50c1tpXTtcbiAgICAgICAgICAgIGlmIChjb21wLmNvbnN0cnVjdG9yID09PSBjb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb21wO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuX2NvbXBvbmVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGxldCBjb21wID0gbm9kZS5fY29tcG9uZW50c1tpXTtcbiAgICAgICAgICAgIGlmIChjb21wIGluc3RhbmNlb2YgY29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29tcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gZmluZENvbXBvbmVudHMobm9kZSwgY29uc3RydWN0b3IsIGNvbXBvbmVudHMpIHtcbiAgICBpZiAoY29uc3RydWN0b3IuX3NlYWxlZCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuX2NvbXBvbmVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGxldCBjb21wID0gbm9kZS5fY29tcG9uZW50c1tpXTtcbiAgICAgICAgICAgIGlmIChjb21wLmNvbnN0cnVjdG9yID09PSBjb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudHMucHVzaChjb21wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLl9jb21wb25lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBsZXQgY29tcCA9IG5vZGUuX2NvbXBvbmVudHNbaV07XG4gICAgICAgICAgICBpZiAoY29tcCBpbnN0YW5jZW9mIGNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50cy5wdXNoKGNvbXApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmaW5kQ2hpbGRDb21wb25lbnQoY2hpbGRyZW4sIGNvbnN0cnVjdG9yKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIgbm9kZSA9IGNoaWxkcmVuW2ldO1xuICAgICAgICB2YXIgY29tcCA9IGZpbmRDb21wb25lbnQobm9kZSwgY29uc3RydWN0b3IpO1xuICAgICAgICBpZiAoY29tcCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbXA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobm9kZS5fY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29tcCA9IGZpbmRDaGlsZENvbXBvbmVudChub2RlLl9jaGlsZHJlbiwgY29uc3RydWN0b3IpO1xuICAgICAgICAgICAgaWYgKGNvbXApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29tcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gZmluZENoaWxkQ29tcG9uZW50cyhjaGlsZHJlbiwgY29uc3RydWN0b3IsIGNvbXBvbmVudHMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciBub2RlID0gY2hpbGRyZW5baV07XG4gICAgICAgIGZpbmRDb21wb25lbnRzKG5vZGUsIGNvbnN0cnVjdG9yLCBjb21wb25lbnRzKTtcbiAgICAgICAgaWYgKG5vZGUuX2NoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZpbmRDaGlsZENvbXBvbmVudHMobm9kZS5fY2hpbGRyZW4sIGNvbnN0cnVjdG9yLCBjb21wb25lbnRzKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBBIGJhc2Ugbm9kZSBmb3IgQ0NOb2RlLCBpdCB3aWxsOlxuICogLSBtYWludGFpbiBzY2VuZSBoaWVyYXJjaHkgYW5kIGFjdGl2ZSBsb2dpY1xuICogLSBub3RpZmljYXRpb25zIGlmIHNvbWUgcHJvcGVydGllcyBjaGFuZ2VkXG4gKiAtIGRlZmluZSBzb21lIGludGVyZmFjZXMgc2hhcmVzIGJldHdlZW4gQ0NOb2RlXG4gKiAtIGRlZmluZSBtYWNoYW5pc21zIGZvciBFbml0eSBDb21wb25lbnQgU3lzdGVtc1xuICogLSBkZWZpbmUgcHJlZmFiIGFuZCBzZXJpYWxpemUgZnVuY3Rpb25zXG4gKlxuICogQGNsYXNzIF9CYXNlTm9kZVxuICogQGV4dGVuZHMgT2JqZWN0XG4gKiBAdXNlcyBFdmVudFRhcmdldFxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gW25hbWVdXG4gKiBAcHJpdmF0ZVxuICovXG52YXIgQmFzZU5vZGUgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLl9CYXNlTm9kZScsXG4gICAgZXh0ZW5kczogY2MuT2JqZWN0LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBTRVJJQUxJWkFCTEVcblxuICAgICAgICBfcGFyZW50OiBudWxsLFxuICAgICAgICBfY2hpbGRyZW46IFtdLFxuXG4gICAgICAgIF9hY3RpdmU6IHRydWUsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwcm9wZXJ0eSBfY29tcG9uZW50c1xuICAgICAgICAgKiBAdHlwZSB7Q29tcG9uZW50W119XG4gICAgICAgICAqIEBkZWZhdWx0IFtdXG4gICAgICAgICAqIEByZWFkT25seVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgX2NvbXBvbmVudHM6IFtdLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgUHJlZmFiSW5mbyBvYmplY3RcbiAgICAgICAgICogQHByb3BlcnR5IF9wcmVmYWJcbiAgICAgICAgICogQHR5cGUge1ByZWZhYkluZm99XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBfcHJlZmFiOiBudWxsLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiB0cnVlLCB0aGUgbm9kZSBpcyBhbiBwZXJzaXN0IG5vZGUgd2hpY2ggd29uJ3QgYmUgZGVzdHJveWVkIGR1cmluZyBzY2VuZSB0cmFuc2l0aW9uLlxuICAgICAgICAgKiBJZiBmYWxzZSwgdGhlIG5vZGUgd2lsbCBiZSBkZXN0cm95ZWQgYXV0b21hdGljYWxseSB3aGVuIGxvYWRpbmcgYSBuZXcgc2NlbmUuIERlZmF1bHQgaXMgZmFsc2UuXG4gICAgICAgICAqIEBwcm9wZXJ0eSBfcGVyc2lzdE5vZGVcbiAgICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBfcGVyc2lzdE5vZGU6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICh0aGlzLl9vYmpGbGFncyAmIERvbnREZXN0cm95KSA+IDA7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vYmpGbGFncyB8PSBEb250RGVzdHJveTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29iakZsYWdzICY9IH5Eb250RGVzdHJveTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gQVBJXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gTmFtZSBvZiBub2RlLlxuICAgICAgICAgKiAhI3poIOivpeiKgueCueWQjeensOOAglxuICAgICAgICAgKiBAcHJvcGVydHkgbmFtZVxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBub2RlLm5hbWUgPSBcIk5ldyBOb2RlXCI7XG4gICAgICAgICAqIGNjLmxvZyhcIk5vZGUgTmFtZTogXCIgKyBub2RlLm5hbWUpO1xuICAgICAgICAgKi9cbiAgICAgICAgbmFtZToge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKENDX0RFViAmJiB2YWx1ZS5pbmRleE9mKCcvJykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoMTYzMik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fbmFtZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmIChDQ19KU0IgJiYgQ0NfTkFUSVZFUkVOREVSRVIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJveHkuc2V0TmFtZSh0aGlzLl9uYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSB1dWlkIGZvciBlZGl0b3IsIHdpbGwgYmUgc3RyaXBwZWQgYmVmb3JlIGJ1aWxkaW5nIHByb2plY3QuXG4gICAgICAgICAqICEjemgg5Li76KaB55So5LqO57yW6L6R5Zmo55qEIHV1aWTvvIzlnKjnvJbovpHlmajkuIvlj6/nlKjkuo7mjIHkuYXljJblrZjlgqjvvIzlnKjpobnnm67mnoTlu7rkuYvlkI7lsIblj5jmiJDoh6rlop7nmoQgaWTjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHV1aWRcbiAgICAgICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAgICogQHJlYWRPbmx5XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIGNjLmxvZyhcIk5vZGUgVXVpZDogXCIgKyBub2RlLnV1aWQpO1xuICAgICAgICAgKi9cbiAgICAgICAgdXVpZDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gQWxsIGNoaWxkcmVuIG5vZGVzLlxuICAgICAgICAgKiAhI3poIOiKgueCueeahOaJgOacieWtkOiKgueCueOAglxuICAgICAgICAgKiBAcHJvcGVydHkgY2hpbGRyZW5cbiAgICAgICAgICogQHR5cGUge05vZGVbXX1cbiAgICAgICAgICogQHJlYWRPbmx5XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XG4gICAgICAgICAqIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICogICAgIGNjLmxvZyhcIk5vZGU6IFwiICsgY2hpbGRyZW5baV0pO1xuICAgICAgICAgKiB9XG4gICAgICAgICAqL1xuICAgICAgICBjaGlsZHJlbjoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW47XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gQWxsIGNoaWxkcmVuIG5vZGVzLlxuICAgICAgICAgKiAhI3poIOiKgueCueeahOWtkOiKgueCueaVsOmHj+OAglxuICAgICAgICAgKiBAcHJvcGVydHkgY2hpbGRyZW5Db3VudFxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKiBAcmVhZE9ubHlcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogdmFyIGNvdW50ID0gbm9kZS5jaGlsZHJlbkNvdW50O1xuICAgICAgICAgKiBjYy5sb2coXCJOb2RlIENoaWxkcmVuIENvdW50OiBcIiArIGNvdW50KTtcbiAgICAgICAgICovXG4gICAgICAgIGNoaWxkcmVuQ291bnQ6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgbG9jYWwgYWN0aXZlIHN0YXRlIG9mIHRoaXMgbm9kZS48YnIvPlxuICAgICAgICAgKiBOb3RlIHRoYXQgYSBOb2RlIG1heSBiZSBpbmFjdGl2ZSBiZWNhdXNlIGEgcGFyZW50IGlzIG5vdCBhY3RpdmUsIGV2ZW4gaWYgdGhpcyByZXR1cm5zIHRydWUuPGJyLz5cbiAgICAgICAgICogVXNlIHt7I2Nyb3NzTGluayBcIk5vZGUvYWN0aXZlSW5IaWVyYXJjaHk6cHJvcGVydHlcIn19e3svY3Jvc3NMaW5rfX0gaWYgeW91IHdhbnQgdG8gY2hlY2sgaWYgdGhlIE5vZGUgaXMgYWN0dWFsbHkgdHJlYXRlZCBhcyBhY3RpdmUgaW4gdGhlIHNjZW5lLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOW9k+WJjeiKgueCueeahOiHqui6q+a/gOa0u+eKtuaAgeOAgjxici8+XG4gICAgICAgICAqIOWAvOW+l+azqOaEj+eahOaYr++8jOS4gOS4quiKgueCueeahOeItuiKgueCueWmguaenOS4jeiiq+a/gOa0u++8jOmCo+S5iOWNs+S9v+Wug+iHqui6q+iuvuS4uua/gOa0u++8jOWug+S7jeeEtuaXoOazlea/gOa0u+OAgjxici8+XG4gICAgICAgICAqIOWmguaenOS9oOaDs+ajgOafpeiKgueCueWcqOWcuuaZr+S4reWunumZheeahOa/gOa0u+eKtuaAgeWPr+S7peS9v+eUqCB7eyNjcm9zc0xpbmsgXCJOb2RlL2FjdGl2ZUluSGllcmFyY2h5OnByb3BlcnR5XCJ9fXt7L2Nyb3NzTGlua31944CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBhY3RpdmVcbiAgICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogbm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICovXG4gICAgICAgIGFjdGl2ZToge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYWN0aXZlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9ICEhdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWN0aXZlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLl9wYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb3VsZEFjdGl2ZUluU2NlbmUgPSBwYXJlbnQuX2FjdGl2ZUluSGllcmFyY2h5O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvdWxkQWN0aXZlSW5TY2VuZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLl9ub2RlQWN0aXZhdG9yLmFjdGl2YXRlTm9kZSh0aGlzLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gSW5kaWNhdGVzIHdoZXRoZXIgdGhpcyBub2RlIGlzIGFjdGl2ZSBpbiB0aGUgc2NlbmUuXG4gICAgICAgICAqICEjemgg6KGo56S65q2k6IqC54K55piv5ZCm5Zyo5Zy65pmv5Lit5r+A5rS744CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBhY3RpdmVJbkhpZXJhcmNoeVxuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogY2MubG9nKFwiYWN0aXZlSW5IaWVyYXJjaHk6IFwiICsgbm9kZS5hY3RpdmVJbkhpZXJhcmNoeSk7XG4gICAgICAgICAqL1xuICAgICAgICBhY3RpdmVJbkhpZXJhcmNoeToge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYWN0aXZlSW5IaWVyYXJjaHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW25hbWVdXG4gICAgICovXG4gICAgY3RvciAobmFtZSkge1xuICAgICAgICB0aGlzLl9uYW1lID0gbmFtZSAhPT0gdW5kZWZpbmVkID8gbmFtZSA6ICdOZXcgTm9kZSc7XG4gICAgICAgIHRoaXMuX2FjdGl2ZUluSGllcmFyY2h5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2lkID0gQ0NfRURJVE9SID8gRWRpdG9yLlV0aWxzLlV1aWRVdGlscy51dWlkKCkgOiBpZEdlbmVyYXRlci5nZXROZXdJZCgpO1xuXG4gICAgICAgIGNjLmRpcmVjdG9yLl9zY2hlZHVsZXIgJiYgY2MuZGlyZWN0b3IuX3NjaGVkdWxlci5lbmFibGVGb3JUYXJnZXQodGhpcyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlZ2lzdGVyIGFsbCByZWxhdGVkIEV2ZW50VGFyZ2V0cyxcbiAgICAgICAgICogYWxsIGV2ZW50IGNhbGxiYWNrcyB3aWxsIGJlIHJlbW92ZWQgaW4gX29uUHJlRGVzdHJveVxuICAgICAgICAgKiBAcHJvcGVydHkgX19ldmVudFRhcmdldHNcbiAgICAgICAgICogQHR5cGUge0V2ZW50VGFyZ2V0W119XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9fZXZlbnRUYXJnZXRzID0gW107XG4gICAgfSxcbiAgICAvKiogXG4gICAgICogISNlbiBUaGUgcGFyZW50IG9mIHRoZSBub2RlLlxuICAgICAqICEjemgg6K+l6IqC54K555qE54i26IqC54K544CCXG4gICAgICogQHByb3BlcnR5IHtOb2RlfSBwYXJlbnRcbiAgICAgKiBAZXhhbXBsZSBcbiAgICAgKiBjYy5sb2coXCJOb2RlIFBhcmVudDogXCIgKyBub2RlLnBhcmVudCk7XG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldCBwYXJlbnQgb2YgdGhlIG5vZGUuXG4gICAgICogISN6aCDojrflj5bor6XoioLngrnnmoTniLboioLngrnjgIJcbiAgICAgKiBAbWV0aG9kIGdldFBhcmVudFxuICAgICAqIEByZXR1cm4ge05vZGV9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgcGFyZW50ID0gdGhpcy5ub2RlLmdldFBhcmVudCgpO1xuICAgICAqL1xuICAgIGdldFBhcmVudCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHBhcmVudCBvZiB0aGUgbm9kZS5cbiAgICAgKiAhI3poIOiuvue9ruivpeiKgueCueeahOeItuiKgueCueOAglxuICAgICAqIEBtZXRob2Qgc2V0UGFyZW50XG4gICAgICogQHBhcmFtIHtOb2RlfSB2YWx1ZVxuICAgICAqIEBleGFtcGxlXG4gICAgICogbm9kZS5zZXRQYXJlbnQobmV3Tm9kZSk7XG4gICAgICovXG4gICAgc2V0UGFyZW50ICh2YWx1ZSkge1xuICAgICAgICBpZiAodGhpcy5fcGFyZW50ID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChDQ19FRElUT1IgJiYgY2MuZW5naW5lICYmICFjYy5lbmdpbmUuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICBpZiAoX1NjZW5lLkRldGVjdENvbmZsaWN0LmJlZm9yZUFkZENoaWxkKHRoaXMsIHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgb2xkUGFyZW50ID0gdGhpcy5fcGFyZW50O1xuICAgICAgICBpZiAoQ0NfREVCVUcgJiYgb2xkUGFyZW50ICYmIChvbGRQYXJlbnQuX29iakZsYWdzICYgRGVhY3RpdmF0aW5nKSkge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgzODIxKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9wYXJlbnQgPSB2YWx1ZSB8fCBudWxsO1xuXG4gICAgICAgIHRoaXMuX29uU2V0UGFyZW50KHZhbHVlKTtcblxuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChDQ19ERUJVRyAmJiAodmFsdWUuX29iakZsYWdzICYgRGVhY3RpdmF0aW5nKSkge1xuICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoMzgyMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBldmVudE1hbmFnZXIuX3NldERpcnR5Rm9yTm9kZSh0aGlzKTtcbiAgICAgICAgICAgIHZhbHVlLl9jaGlsZHJlbi5wdXNoKHRoaXMpO1xuICAgICAgICAgICAgdmFsdWUuZW1pdCAmJiB2YWx1ZS5lbWl0KENISUxEX0FEREVELCB0aGlzKTtcbiAgICAgICAgICAgIHZhbHVlLl9yZW5kZXJGbGFnIHw9IFJlbmRlckZsb3cuRkxBR19DSElMRFJFTjtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2xkUGFyZW50KSB7XG4gICAgICAgICAgICBpZiAoIShvbGRQYXJlbnQuX29iakZsYWdzICYgRGVzdHJveWluZykpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVtb3ZlQXQgPSBvbGRQYXJlbnQuX2NoaWxkcmVuLmluZGV4T2YodGhpcyk7XG4gICAgICAgICAgICAgICAgaWYgKENDX0RFViAmJiByZW1vdmVBdCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNjLmVycm9ySUQoMTYzMyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9sZFBhcmVudC5fY2hpbGRyZW4uc3BsaWNlKHJlbW92ZUF0LCAxKTtcbiAgICAgICAgICAgICAgICBvbGRQYXJlbnQuZW1pdCAmJiBvbGRQYXJlbnQuZW1pdChDSElMRF9SRU1PVkVELCB0aGlzKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkhpZXJhcmNoeUNoYW5nZWQob2xkUGFyZW50KTtcblxuICAgICAgICAgICAgICAgIGlmIChvbGRQYXJlbnQuX2NoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBvbGRQYXJlbnQuX3JlbmRlckZsYWcgJj0gflJlbmRlckZsb3cuRkxBR19DSElMRFJFTjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX29uSGllcmFyY2h5Q2hhbmdlZChudWxsKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBBQlNUUkFDVCBJTlRFUkZBQ0VTXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUHJvcGVydGllcyBjb25maWd1cmF0aW9uIGZ1bmN0aW9uIDxici8+XG4gICAgICogQWxsIHByb3BlcnRpZXMgaW4gYXR0cnMgd2lsbCBiZSBzZXQgdG8gdGhlIG5vZGUsIDxici8+XG4gICAgICogd2hlbiB0aGUgc2V0dGVyIG9mIHRoZSBub2RlIGlzIGF2YWlsYWJsZSwgPGJyLz5cbiAgICAgKiB0aGUgcHJvcGVydHkgd2lsbCBiZSBzZXQgdmlhIHNldHRlciBmdW5jdGlvbi48YnIvPlxuICAgICAqICEjemgg5bGe5oCn6YWN572u5Ye95pWw44CC5ZyoIGF0dHJzIOeahOaJgOacieWxnuaAp+Wwhuiiq+iuvue9ruS4uuiKgueCueWxnuaAp+OAglxuICAgICAqIEBtZXRob2QgYXR0clxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhdHRycyAtIFByb3BlcnRpZXMgdG8gYmUgc2V0IHRvIG5vZGVcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBhdHRycyA9IHsga2V5OiAwLCBudW06IDEwMCB9O1xuICAgICAqIG5vZGUuYXR0cihhdHRycyk7XG4gICAgICovXG4gICAgYXR0ciAoYXR0cnMpIHtcbiAgICAgICAganMubWl4aW4odGhpcywgYXR0cnMpO1xuICAgIH0sXG5cbiAgICAvLyBjb21wb3NpdGlvbjogR0VUXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgYSBjaGlsZCBmcm9tIHRoZSBjb250YWluZXIgZ2l2ZW4gaXRzIHV1aWQuXG4gICAgICogISN6aCDpgJrov4cgdXVpZCDojrflj5boioLngrnnmoTlrZDoioLngrnjgIJcbiAgICAgKiBAbWV0aG9kIGdldENoaWxkQnlVdWlkXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHV1aWQgLSBUaGUgdXVpZCB0byBmaW5kIHRoZSBjaGlsZCBub2RlLlxuICAgICAqIEByZXR1cm4ge05vZGV9IGEgTm9kZSB3aG9zZSB1dWlkIGVxdWFscyB0byB0aGUgaW5wdXQgcGFyYW1ldGVyXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgY2hpbGQgPSBub2RlLmdldENoaWxkQnlVdWlkKHV1aWQpO1xuICAgICAqL1xuICAgIGdldENoaWxkQnlVdWlkICh1dWlkKSB7XG4gICAgICAgIGlmICghdXVpZCkge1xuICAgICAgICAgICAgY2MubG9nKFwiSW52YWxpZCB1dWlkXCIpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbG9jQ2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGxvY0NoaWxkcmVuLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAobG9jQ2hpbGRyZW5baV0uX2lkID09PSB1dWlkKVxuICAgICAgICAgICAgICAgIHJldHVybiBsb2NDaGlsZHJlbltpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIGEgY2hpbGQgZnJvbSB0aGUgY29udGFpbmVyIGdpdmVuIGl0cyBuYW1lLlxuICAgICAqICEjemgg6YCa6L+H5ZCN56ew6I635Y+W6IqC54K555qE5a2Q6IqC54K544CCXG4gICAgICogQG1ldGhvZCBnZXRDaGlsZEJ5TmFtZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gQSBuYW1lIHRvIGZpbmQgdGhlIGNoaWxkIG5vZGUuXG4gICAgICogQHJldHVybiB7Tm9kZX0gYSBDQ05vZGUgb2JqZWN0IHdob3NlIG5hbWUgZXF1YWxzIHRvIHRoZSBpbnB1dCBwYXJhbWV0ZXJcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBjaGlsZCA9IG5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJUZXN0IE5vZGVcIik7XG4gICAgICovXG4gICAgZ2V0Q2hpbGRCeU5hbWUgKG5hbWUpIHtcbiAgICAgICAgaWYgKCFuYW1lKSB7XG4gICAgICAgICAgICBjYy5sb2coXCJJbnZhbGlkIG5hbWVcIik7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsb2NDaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbG9jQ2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChsb2NDaGlsZHJlbltpXS5fbmFtZSA9PT0gbmFtZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gbG9jQ2hpbGRyZW5baV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIC8vIGNvbXBvc2l0aW9uOiBBRERcblxuICAgIGFkZENoaWxkIChjaGlsZCkge1xuXG4gICAgICAgIGlmIChDQ19ERVYgJiYgIShjaGlsZCBpbnN0YW5jZW9mIGNjLl9CYXNlTm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBjYy5lcnJvcklEKDE2MzQsIGNjLmpzLmdldENsYXNzTmFtZShjaGlsZCkpO1xuICAgICAgICB9XG4gICAgICAgIGNjLmFzc2VydElEKGNoaWxkLCAxNjA2KTtcbiAgICAgICAgY2MuYXNzZXJ0SUQoY2hpbGQuX3BhcmVudCA9PT0gbnVsbCwgMTYwNSk7XG5cbiAgICAgICAgLy8gaW52b2tlcyB0aGUgcGFyZW50IHNldHRlclxuICAgICAgICBjaGlsZC5zZXRQYXJlbnQodGhpcyk7XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEluc2VydHMgYSBjaGlsZCB0byB0aGUgbm9kZSBhdCBhIHNwZWNpZmllZCBpbmRleC5cbiAgICAgKiAhI3poXG4gICAgICog5o+S5YWl5a2Q6IqC54K55Yiw5oyH5a6a5L2N572uXG4gICAgICogQG1ldGhvZCBpbnNlcnRDaGlsZFxuICAgICAqIEBwYXJhbSB7Tm9kZX0gY2hpbGQgLSB0aGUgY2hpbGQgbm9kZSB0byBiZSBpbnNlcnRlZFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzaWJsaW5nSW5kZXggLSB0aGUgc2libGluZyBpbmRleCB0byBwbGFjZSB0aGUgY2hpbGQgaW5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIG5vZGUuaW5zZXJ0Q2hpbGQoY2hpbGQsIDIpO1xuICAgICAqL1xuICAgIGluc2VydENoaWxkIChjaGlsZCwgc2libGluZ0luZGV4KSB7XG4gICAgICAgIGNoaWxkLnBhcmVudCA9IHRoaXM7XG4gICAgICAgIGNoaWxkLnNldFNpYmxpbmdJbmRleChzaWJsaW5nSW5kZXgpO1xuICAgIH0sXG5cbiAgICAvLyBISUVSQVJDSFkgTUVUSE9EU1xuXG4gICAgLyoqXG4gICAgICogISNlbiBHZXQgdGhlIHNpYmxpbmcgaW5kZXguXG4gICAgICogISN6aCDojrflj5blkIznuqfntKLlvJXjgIJcbiAgICAgKiBAbWV0aG9kIGdldFNpYmxpbmdJbmRleFxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBpbmRleCA9IG5vZGUuZ2V0U2libGluZ0luZGV4KCk7XG4gICAgICovXG4gICAgZ2V0U2libGluZ0luZGV4ICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudC5fY2hpbGRyZW4uaW5kZXhPZih0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHRoZSBzaWJsaW5nIGluZGV4IG9mIHRoaXMgbm9kZS5cbiAgICAgKiAhI3poIOiuvue9ruiKgueCueWQjOe6p+e0ouW8leOAglxuICAgICAqIEBtZXRob2Qgc2V0U2libGluZ0luZGV4XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBub2RlLnNldFNpYmxpbmdJbmRleCgxKTtcbiAgICAgKi9cbiAgICBzZXRTaWJsaW5nSW5kZXggKGluZGV4KSB7XG4gICAgICAgIGlmICghdGhpcy5fcGFyZW50KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudC5fb2JqRmxhZ3MgJiBEZWFjdGl2YXRpbmcpIHtcbiAgICAgICAgICAgIGNjLmVycm9ySUQoMzgyMSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHNpYmxpbmdzID0gdGhpcy5fcGFyZW50Ll9jaGlsZHJlbjtcbiAgICAgICAgaW5kZXggPSBpbmRleCAhPT0gLTEgPyBpbmRleCA6IHNpYmxpbmdzLmxlbmd0aCAtIDE7XG4gICAgICAgIHZhciBvbGRJbmRleCA9IHNpYmxpbmdzLmluZGV4T2YodGhpcyk7XG4gICAgICAgIGlmIChpbmRleCAhPT0gb2xkSW5kZXgpIHtcbiAgICAgICAgICAgIHNpYmxpbmdzLnNwbGljZShvbGRJbmRleCwgMSk7XG4gICAgICAgICAgICBpZiAoaW5kZXggPCBzaWJsaW5ncy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBzaWJsaW5ncy5zcGxpY2UoaW5kZXgsIDAsIHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc2libGluZ3MucHVzaCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX29uU2libGluZ0luZGV4Q2hhbmdlZCAmJiB0aGlzLl9vblNpYmxpbmdJbmRleENoYW5nZWQoaW5kZXgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gV2FsayB0aG91Z2ggdGhlIHN1YiBjaGlsZHJlbiB0cmVlIG9mIHRoZSBjdXJyZW50IG5vZGUuXG4gICAgICogRWFjaCBub2RlLCBpbmNsdWRpbmcgdGhlIGN1cnJlbnQgbm9kZSwgaW4gdGhlIHN1YiB0cmVlIHdpbGwgYmUgdmlzaXRlZCB0d28gdGltZXMsIGJlZm9yZSBhbGwgY2hpbGRyZW4gYW5kIGFmdGVyIGFsbCBjaGlsZHJlbi5cbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGNhbGwgaXMgbm90IHJlY3Vyc2l2ZSwgaXQncyBiYXNlZCBvbiBzdGFjay5cbiAgICAgKiBQbGVhc2UgZG9uJ3Qgd2FsayBhbnkgb3RoZXIgbm9kZSBpbnNpZGUgdGhlIHdhbGsgcHJvY2Vzcy5cbiAgICAgKiAhI3poIOmBjeWOhuivpeiKgueCueeahOWtkOagkemHjOeahOaJgOacieiKgueCueW5tuaMieinhOWImeaJp+ihjOWbnuiwg+WHveaVsOOAglxuICAgICAqIOWvueWtkOagkeS4reeahOaJgOacieiKgueCue+8jOWMheWQq+W9k+WJjeiKgueCue+8jOS8muaJp+ihjOS4pOasoeWbnuiwg++8jHByZWZ1bmMg5Lya5Zyo6K6/6Zeu5a6D55qE5a2Q6IqC54K55LmL5YmN6LCD55So77yMcG9zdGZ1bmMg5Lya5Zyo6K6/6Zeu5omA5pyJ5a2Q6IqC54K55LmL5ZCO6LCD55So44CCXG4gICAgICog6L+Z5Liq5Ye95pWw55qE5a6e546w5LiN5piv5Z+65LqO6YCS5b2S55qE77yM6ICM5piv5Z+65LqO5qCI5bGV5byA6YCS5b2S55qE5pa55byP44CCXG4gICAgICog6K+35LiN6KaB5ZyoIHdhbGsg6L+H56iL5Lit5a+55Lu75L2V5YW25LuW55qE6IqC54K55bWM5aWX5omn6KGMIHdhbGvjgIJcbiAgICAgKiBAbWV0aG9kIHdhbGtcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVmdW5jIFRoZSBjYWxsYmFjayB0byBwcm9jZXNzIG5vZGUgd2hlbiByZWFjaCB0aGUgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgKiBAcGFyYW0ge19CYXNlTm9kZX0gcHJlZnVuYy50YXJnZXQgVGhlIGN1cnJlbnQgdmlzaXRpbmcgbm9kZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHBvc3RmdW5jIFRoZSBjYWxsYmFjayB0byBwcm9jZXNzIG5vZGUgd2hlbiByZS12aXNpdCB0aGUgbm9kZSBhZnRlciB3YWxrZWQgYWxsIGNoaWxkcmVuIGluIGl0cyBzdWIgdHJlZVxuICAgICAqIEBwYXJhbSB7X0Jhc2VOb2RlfSBwb3N0ZnVuYy50YXJnZXQgVGhlIGN1cnJlbnQgdmlzaXRpbmcgbm9kZVxuICAgICAqIEBleGFtcGxlXG4gICAgICogbm9kZS53YWxrKGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgKiAgICAgY29uc29sZS5sb2coJ1dhbGtlZCB0aHJvdWdoIG5vZGUgJyArIHRhcmdldC5uYW1lICsgJyBmb3IgdGhlIGZpcnN0IHRpbWUnKTtcbiAgICAgKiB9LCBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICogICAgIGNvbnNvbGUubG9nKCdXYWxrZWQgdGhyb3VnaCBub2RlICcgKyB0YXJnZXQubmFtZSArICcgYWZ0ZXIgd2Fsa2VkIGFsbCBjaGlsZHJlbiBpbiBpdHMgc3ViIHRyZWUnKTtcbiAgICAgKiB9KTtcbiAgICAgKi9cbiAgICB3YWxrIChwcmVmdW5jLCBwb3N0ZnVuYykge1xuICAgICAgICB2YXIgQmFzZU5vZGUgPSBjYy5fQmFzZU5vZGU7XG4gICAgICAgIHZhciBpbmRleCA9IDE7XG4gICAgICAgIHZhciBjaGlsZHJlbiwgY2hpbGQsIGN1cnIsIGksIGFmdGVyQ2hpbGRyZW47XG4gICAgICAgIHZhciBzdGFjayA9IEJhc2VOb2RlLl9zdGFja3NbQmFzZU5vZGUuX3N0YWNrSWRdO1xuICAgICAgICBpZiAoIXN0YWNrKSB7XG4gICAgICAgICAgICBzdGFjayA9IFtdO1xuICAgICAgICAgICAgQmFzZU5vZGUuX3N0YWNrcy5wdXNoKHN0YWNrKTtcbiAgICAgICAgfVxuICAgICAgICBCYXNlTm9kZS5fc3RhY2tJZCsrO1xuXG4gICAgICAgIHN0YWNrLmxlbmd0aCA9IDA7XG4gICAgICAgIHN0YWNrWzBdID0gdGhpcztcbiAgICAgICAgdmFyIHBhcmVudCA9IG51bGw7XG4gICAgICAgIGFmdGVyQ2hpbGRyZW4gPSBmYWxzZTtcbiAgICAgICAgd2hpbGUgKGluZGV4KSB7XG4gICAgICAgICAgICBpbmRleC0tO1xuICAgICAgICAgICAgY3VyciA9IHN0YWNrW2luZGV4XTtcbiAgICAgICAgICAgIGlmICghY3Vycikge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFhZnRlckNoaWxkcmVuICYmIHByZWZ1bmMpIHtcbiAgICAgICAgICAgICAgICAvLyBwcmUgY2FsbFxuICAgICAgICAgICAgICAgIHByZWZ1bmMoY3Vycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChhZnRlckNoaWxkcmVuICYmIHBvc3RmdW5jKSB7XG4gICAgICAgICAgICAgICAgLy8gcG9zdCBjYWxsXG4gICAgICAgICAgICAgICAgcG9zdGZ1bmMoY3Vycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIEF2b2lkIG1lbW9yeSBsZWFrXG4gICAgICAgICAgICBzdGFja1tpbmRleF0gPSBudWxsO1xuICAgICAgICAgICAgLy8gRG8gbm90IHJlcGVhdGx5IHZpc2l0IGNoaWxkIHRyZWUsIGp1c3QgZG8gcG9zdCBjYWxsIGFuZCBjb250aW51ZSB3YWxrXG4gICAgICAgICAgICBpZiAoYWZ0ZXJDaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIGFmdGVyQ2hpbGRyZW4gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIENoaWxkcmVuIG5vdCBwcm9jZWVkZWQgYW5kIGhhcyBjaGlsZHJlbiwgcHJvY2VlZCB0byBjaGlsZCB0cmVlXG4gICAgICAgICAgICAgICAgaWYgKGN1cnIuX2NoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gY3VycjtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW4gPSBjdXJyLl9jaGlsZHJlbjtcbiAgICAgICAgICAgICAgICAgICAgaSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrW2luZGV4XSA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBObyBjaGlsZHJlbiwgdGhlbiByZXB1c2ggY3VyciB0byBiZSB3YWxrZWQgZm9yIHBvc3QgZnVuY1xuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdGFja1tpbmRleF0gPSBjdXJyO1xuICAgICAgICAgICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgICAgICAgICBhZnRlckNoaWxkcmVuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjdXJyIGhhcyBubyBzdWIgdHJlZSwgc28gbG9vayBpbnRvIHRoZSBzaWJsaW5ncyBpbiBwYXJlbnQgY2hpbGRyZW5cbiAgICAgICAgICAgIGlmIChjaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAvLyBQcm9jZWVkIHRvIG5leHQgc2libGluZyBpbiBwYXJlbnQgY2hpbGRyZW5cbiAgICAgICAgICAgICAgICBpZiAoY2hpbGRyZW5baV0pIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2tbaW5kZXhdID0gY2hpbGRyZW5baV07XG4gICAgICAgICAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIE5vIGNoaWxkcmVuIGFueSBtb3JlIGluIHRoaXMgc3ViIHRyZWUsIGdvIHVwd2FyZFxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICBzdGFja1tpbmRleF0gPSBwYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNldHVwIHBhcmVudCB3YWxrIGVudlxuICAgICAgICAgICAgICAgICAgICBhZnRlckNoaWxkcmVuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmVudC5fcGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IHBhcmVudC5fcGFyZW50Ll9jaGlsZHJlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgPSBjaGlsZHJlbi5pbmRleE9mKHBhcmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQuX3BhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEF0IHJvb3RcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBFUlJPUlxuICAgICAgICAgICAgICAgICAgICBpZiAoaSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN0YWNrLmxlbmd0aCA9IDA7XG4gICAgICAgIEJhc2VOb2RlLl9zdGFja0lkLS07XG4gICAgfSxcblxuICAgIGNsZWFudXAgKCkge1xuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZW1vdmUgaXRzZWxmIGZyb20gaXRzIHBhcmVudCBub2RlLiBJZiBjbGVhbnVwIGlzIGB0cnVlYCwgdGhlbiBhbHNvIHJlbW92ZSBhbGwgZXZlbnRzIGFuZCBhY3Rpb25zLiA8YnIvPlxuICAgICAqIElmIHRoZSBjbGVhbnVwIHBhcmFtZXRlciBpcyBub3QgcGFzc2VkLCBpdCB3aWxsIGZvcmNlIGEgY2xlYW51cCwgc28gaXQgaXMgcmVjb21tZW5kZWQgdGhhdCB5b3UgYWx3YXlzIHBhc3MgaW4gdGhlIGBmYWxzZWAgcGFyYW1ldGVyIHdoZW4gY2FsbGluZyB0aGlzIEFQSS48YnIvPlxuICAgICAqIElmIHRoZSBub2RlIG9ycGhhbiwgdGhlbiBub3RoaW5nIGhhcHBlbnMuXG4gICAgICogISN6aFxuICAgICAqIOS7jueItuiKgueCueS4reWIoOmZpOivpeiKgueCueOAguWmguaenOS4jeS8oOWFpSBjbGVhbnVwIOWPguaVsOaIluiAheS8oOWFpSBgdHJ1ZWDvvIzpgqPkuYjov5nkuKroioLngrnkuIrmiYDmnInnu5HlrprnmoTkuovku7bjgIFhY3Rpb24g6YO95Lya6KKr5Yig6Zmk44CCPGJyLz5cbiAgICAgKiDlm6DmraTlu7rorq7osIPnlKjov5nkuKogQVBJIOaXtuaAu+aYr+S8oOWFpSBgZmFsc2VgIOWPguaVsOOAgjxici8+XG4gICAgICog5aaC5p6c6L+Z5Liq6IqC54K55piv5LiA5Liq5a2k6IqC54K577yM6YKj5LmI5LuA5LmI6YO95LiN5Lya5Y+R55Sf44CCXG4gICAgICogQG1ldGhvZCByZW1vdmVGcm9tUGFyZW50XG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbY2xlYW51cD10cnVlXSAtIHRydWUgaWYgYWxsIGFjdGlvbnMgYW5kIGNhbGxiYWNrcyBvbiB0aGlzIG5vZGUgc2hvdWxkIGJlIHJlbW92ZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKiBAc2VlIGNjLk5vZGUjcmVtb3ZlRnJvbVBhcmVudEFuZENsZWFudXBcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIG5vZGUucmVtb3ZlRnJvbVBhcmVudCgpO1xuICAgICAqIG5vZGUucmVtb3ZlRnJvbVBhcmVudChmYWxzZSk7XG4gICAgICovXG4gICAgcmVtb3ZlRnJvbVBhcmVudCAoY2xlYW51cCkge1xuICAgICAgICBpZiAodGhpcy5fcGFyZW50KSB7XG4gICAgICAgICAgICBpZiAoY2xlYW51cCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIGNsZWFudXAgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5fcGFyZW50LnJlbW92ZUNoaWxkKHRoaXMsIGNsZWFudXApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZW1vdmVzIGEgY2hpbGQgZnJvbSB0aGUgY29udGFpbmVyLiBJdCB3aWxsIGFsc28gY2xlYW51cCBhbGwgcnVubmluZyBhY3Rpb25zIGRlcGVuZGluZyBvbiB0aGUgY2xlYW51cCBwYXJhbWV0ZXIuIDwvcD5cbiAgICAgKiBJZiB0aGUgY2xlYW51cCBwYXJhbWV0ZXIgaXMgbm90IHBhc3NlZCwgaXQgd2lsbCBmb3JjZSBhIGNsZWFudXAuIDxici8+XG4gICAgICogXCJyZW1vdmVcIiBsb2dpYyBNVVNUIG9ubHkgYmUgb24gdGhpcyBtZXRob2QgIDxici8+XG4gICAgICogSWYgYSBjbGFzcyB3YW50cyB0byBleHRlbmQgdGhlICdyZW1vdmVDaGlsZCcgYmVoYXZpb3IgaXQgb25seSBuZWVkcyA8YnIvPlxuICAgICAqIHRvIG92ZXJyaWRlIHRoaXMgbWV0aG9kLlxuICAgICAqICEjemhcbiAgICAgKiDnp7vpmaToioLngrnkuK3mjIflrprnmoTlrZDoioLngrnvvIzmmK/lkKbpnIDopoHmuIXnkIbmiYDmnInmraPlnKjov5DooYznmoTooYzkuLrlj5blhrPkuo4gY2xlYW51cCDlj4LmlbDjgII8YnIvPlxuICAgICAqIOWmguaenCBjbGVhbnVwIOWPguaVsOS4jeS8oOWFpe+8jOm7mOiupOS4uiB0cnVlIOihqOekuua4heeQhuOAgjxici8+XG4gICAgICogQG1ldGhvZCByZW1vdmVDaGlsZFxuICAgICAqIEBwYXJhbSB7Tm9kZX0gY2hpbGQgLSBUaGUgY2hpbGQgbm9kZSB3aGljaCB3aWxsIGJlIHJlbW92ZWQuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbY2xlYW51cD10cnVlXSAtIHRydWUgaWYgYWxsIHJ1bm5pbmcgYWN0aW9ucyBhbmQgY2FsbGJhY2tzIG9uIHRoZSBjaGlsZCBub2RlIHdpbGwgYmUgY2xlYW51cCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogbm9kZS5yZW1vdmVDaGlsZChuZXdOb2RlKTtcbiAgICAgKiBub2RlLnJlbW92ZUNoaWxkKG5ld05vZGUsIGZhbHNlKTtcbiAgICAgKi9cbiAgICByZW1vdmVDaGlsZCAoY2hpbGQsIGNsZWFudXApIHtcbiAgICAgICAgaWYgKHRoaXMuX2NoaWxkcmVuLmluZGV4T2YoY2hpbGQpID4gLTEpIHtcbiAgICAgICAgICAgIC8vIElmIHlvdSBkb24ndCBkbyBjbGVhbnVwLCB0aGUgY2hpbGQncyBhY3Rpb25zIHdpbGwgbm90IGdldCByZW1vdmVkIGFuZCB0aGVcbiAgICAgICAgICAgIGlmIChjbGVhbnVwIHx8IGNsZWFudXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNoaWxkLmNsZWFudXAoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGludm9rZSB0aGUgcGFyZW50IHNldHRlclxuICAgICAgICAgICAgY2hpbGQucGFyZW50ID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmVtb3ZlcyBhbGwgY2hpbGRyZW4gZnJvbSB0aGUgY29udGFpbmVyIGFuZCBkbyBhIGNsZWFudXAgYWxsIHJ1bm5pbmcgYWN0aW9ucyBkZXBlbmRpbmcgb24gdGhlIGNsZWFudXAgcGFyYW1ldGVyLiA8YnIvPlxuICAgICAqIElmIHRoZSBjbGVhbnVwIHBhcmFtZXRlciBpcyBub3QgcGFzc2VkLCBpdCB3aWxsIGZvcmNlIGEgY2xlYW51cC5cbiAgICAgKiAhI3poXG4gICAgICog56e76Zmk6IqC54K55omA5pyJ55qE5a2Q6IqC54K577yM5piv5ZCm6ZyA6KaB5riF55CG5omA5pyJ5q2j5Zyo6L+Q6KGM55qE6KGM5Li65Y+W5Yaz5LqOIGNsZWFudXAg5Y+C5pWw44CCPGJyLz5cbiAgICAgKiDlpoLmnpwgY2xlYW51cCDlj4LmlbDkuI3kvKDlhaXvvIzpu5jorqTkuLogdHJ1ZSDooajnpLrmuIXnkIbjgIJcbiAgICAgKiBAbWV0aG9kIHJlbW92ZUFsbENoaWxkcmVuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbY2xlYW51cD10cnVlXSAtIHRydWUgaWYgYWxsIHJ1bm5pbmcgYWN0aW9ucyBvbiBhbGwgY2hpbGRyZW4gbm9kZXMgc2hvdWxkIGJlIGNsZWFudXAsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIG5vZGUucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcbiAgICAgKiBub2RlLnJlbW92ZUFsbENoaWxkcmVuKGZhbHNlKTtcbiAgICAgKi9cbiAgICByZW1vdmVBbGxDaGlsZHJlbiAoY2xlYW51cCkge1xuICAgICAgICAvLyBub3QgdXNpbmcgZGV0YWNoQ2hpbGQgaW1wcm92ZXMgc3BlZWQgaGVyZVxuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbjtcbiAgICAgICAgaWYgKGNsZWFudXAgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIGNsZWFudXAgPSB0cnVlO1xuICAgICAgICBmb3IgKHZhciBpID0gY2hpbGRyZW4ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIHZhciBub2RlID0gY2hpbGRyZW5baV07XG4gICAgICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgICAgICAgIC8vIElmIHlvdSBkb24ndCBkbyBjbGVhbnVwLCB0aGUgbm9kZSdzIGFjdGlvbnMgd2lsbCBub3QgZ2V0IHJlbW92ZWQgYW5kIHRoZVxuICAgICAgICAgICAgICAgIGlmIChjbGVhbnVwKVxuICAgICAgICAgICAgICAgICAgICBub2RlLmNsZWFudXAoKTtcblxuICAgICAgICAgICAgICAgIG5vZGUucGFyZW50ID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jaGlsZHJlbi5sZW5ndGggPSAwO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIElzIHRoaXMgbm9kZSBhIGNoaWxkIG9mIHRoZSBnaXZlbiBub2RlP1xuICAgICAqICEjemgg5piv5ZCm5piv5oyH5a6a6IqC54K555qE5a2Q6IqC54K577yfXG4gICAgICogQG1ldGhvZCBpc0NoaWxkT2ZcbiAgICAgKiBAcGFyYW0ge05vZGV9IHBhcmVudFxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IC0gUmV0dXJucyB0cnVlIGlmIHRoaXMgbm9kZSBpcyBhIGNoaWxkLCBkZWVwIGNoaWxkIG9yIGlkZW50aWNhbCB0byB0aGUgZ2l2ZW4gbm9kZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIG5vZGUuaXNDaGlsZE9mKG5ld05vZGUpO1xuICAgICAqL1xuICAgIGlzQ2hpbGRPZiAocGFyZW50KSB7XG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXM7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGlmIChjaGlsZCA9PT0gcGFyZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjaGlsZCA9IGNoaWxkLl9wYXJlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKGNoaWxkKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICAvLyBDT01QT05FTlRcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXR1cm5zIHRoZSBjb21wb25lbnQgb2Ygc3VwcGxpZWQgdHlwZSBpZiB0aGUgbm9kZSBoYXMgb25lIGF0dGFjaGVkLCBudWxsIGlmIGl0IGRvZXNuJ3QuPGJyLz5cbiAgICAgKiBZb3UgY2FuIGFsc28gZ2V0IGNvbXBvbmVudCBpbiB0aGUgbm9kZSBieSBwYXNzaW5nIGluIHRoZSBuYW1lIG9mIHRoZSBzY3JpcHQuXG4gICAgICogISN6aFxuICAgICAqIOiOt+WPluiKgueCueS4iuaMh+Wumuexu+Wei+eahOe7hOS7tu+8jOWmguaenOiKgueCueaciemZhOWKoOaMh+Wumuexu+Wei+eahOe7hOS7tu+8jOWImei/lOWbnu+8jOWmguaenOayoeacieWImeS4uuepuuOAgjxici8+XG4gICAgICog5Lyg5YWl5Y+C5pWw5Lmf5Y+v5Lul5piv6ISa5pys55qE5ZCN56ew44CCXG4gICAgICogQG1ldGhvZCBnZXRDb21wb25lbnRcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufFN0cmluZ30gdHlwZU9yQ2xhc3NOYW1lXG4gICAgICogQHJldHVybiB7Q29tcG9uZW50fVxuICAgICAqIEBleGFtcGxlXG4gICAgICogLy8gZ2V0IHNwcml0ZSBjb21wb25lbnRcbiAgICAgKiB2YXIgc3ByaXRlID0gbm9kZS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgKiAvLyBnZXQgY3VzdG9tIHRlc3QgY2xhc3NcbiAgICAgKiB2YXIgdGVzdCA9IG5vZGUuZ2V0Q29tcG9uZW50KFwiVGVzdFwiKTtcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGdldENvbXBvbmVudDxUIGV4dGVuZHMgQ29tcG9uZW50Pih0eXBlOiB7cHJvdG90eXBlOiBUfSk6IFRcbiAgICAgKiBnZXRDb21wb25lbnQoY2xhc3NOYW1lOiBzdHJpbmcpOiBhbnlcbiAgICAgKi9cbiAgICBnZXRDb21wb25lbnQgKHR5cGVPckNsYXNzTmFtZSkge1xuICAgICAgICB2YXIgY29uc3RydWN0b3IgPSBnZXRDb25zdHJ1Y3Rvcih0eXBlT3JDbGFzc05hbWUpO1xuICAgICAgICBpZiAoY29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgIHJldHVybiBmaW5kQ29tcG9uZW50KHRoaXMsIGNvbnN0cnVjdG9yKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIGFsbCBjb21wb25lbnRzIG9mIHN1cHBsaWVkIHR5cGUgaW4gdGhlIG5vZGUuXG4gICAgICogISN6aCDov5Tlm57oioLngrnkuIrmjIflrprnsbvlnovnmoTmiYDmnInnu4Tku7bjgIJcbiAgICAgKiBAbWV0aG9kIGdldENvbXBvbmVudHNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufFN0cmluZ30gdHlwZU9yQ2xhc3NOYW1lXG4gICAgICogQHJldHVybiB7Q29tcG9uZW50W119XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgc3ByaXRlcyA9IG5vZGUuZ2V0Q29tcG9uZW50cyhjYy5TcHJpdGUpO1xuICAgICAqIHZhciB0ZXN0cyA9IG5vZGUuZ2V0Q29tcG9uZW50cyhcIlRlc3RcIik7XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBnZXRDb21wb25lbnRzPFQgZXh0ZW5kcyBDb21wb25lbnQ+KHR5cGU6IHtwcm90b3R5cGU6IFR9KTogVFtdXG4gICAgICogZ2V0Q29tcG9uZW50cyhjbGFzc05hbWU6IHN0cmluZyk6IGFueVtdXG4gICAgICovXG4gICAgZ2V0Q29tcG9uZW50cyAodHlwZU9yQ2xhc3NOYW1lKSB7XG4gICAgICAgIHZhciBjb25zdHJ1Y3RvciA9IGdldENvbnN0cnVjdG9yKHR5cGVPckNsYXNzTmFtZSksIGNvbXBvbmVudHMgPSBbXTtcbiAgICAgICAgaWYgKGNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICBmaW5kQ29tcG9uZW50cyh0aGlzLCBjb25zdHJ1Y3RvciwgY29tcG9uZW50cyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudHM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB0aGUgY29tcG9uZW50IG9mIHN1cHBsaWVkIHR5cGUgaW4gYW55IG9mIGl0cyBjaGlsZHJlbiB1c2luZyBkZXB0aCBmaXJzdCBzZWFyY2guXG4gICAgICogISN6aCDpgJLlvZLmn6Xmib7miYDmnInlrZDoioLngrnkuK3nrKzkuIDkuKrljLnphY3mjIflrprnsbvlnovnmoTnu4Tku7bjgIJcbiAgICAgKiBAbWV0aG9kIGdldENvbXBvbmVudEluQ2hpbGRyZW5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufFN0cmluZ30gdHlwZU9yQ2xhc3NOYW1lXG4gICAgICogQHJldHVybiB7Q29tcG9uZW50fVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIHNwcml0ZSA9IG5vZGUuZ2V0Q29tcG9uZW50SW5DaGlsZHJlbihjYy5TcHJpdGUpO1xuICAgICAqIHZhciBUZXN0ID0gbm9kZS5nZXRDb21wb25lbnRJbkNoaWxkcmVuKFwiVGVzdFwiKTtcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGdldENvbXBvbmVudEluQ2hpbGRyZW48VCBleHRlbmRzIENvbXBvbmVudD4odHlwZToge3Byb3RvdHlwZTogVH0pOiBUXG4gICAgICogZ2V0Q29tcG9uZW50SW5DaGlsZHJlbihjbGFzc05hbWU6IHN0cmluZyk6IGFueVxuICAgICAqL1xuICAgIGdldENvbXBvbmVudEluQ2hpbGRyZW4gKHR5cGVPckNsYXNzTmFtZSkge1xuICAgICAgICB2YXIgY29uc3RydWN0b3IgPSBnZXRDb25zdHJ1Y3Rvcih0eXBlT3JDbGFzc05hbWUpO1xuICAgICAgICBpZiAoY29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgIHJldHVybiBmaW5kQ2hpbGRDb21wb25lbnQodGhpcy5fY2hpbGRyZW4sIGNvbnN0cnVjdG9yKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIGFsbCBjb21wb25lbnRzIG9mIHN1cHBsaWVkIHR5cGUgaW4gc2VsZiBvciBhbnkgb2YgaXRzIGNoaWxkcmVuLlxuICAgICAqICEjemgg6YCS5b2S5p+l5om+6Ieq6Lqr5oiW5omA5pyJ5a2Q6IqC54K55Lit5oyH5a6a57G75Z6L55qE57uE5Lu2XG4gICAgICogQG1ldGhvZCBnZXRDb21wb25lbnRzSW5DaGlsZHJlblxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258U3RyaW5nfSB0eXBlT3JDbGFzc05hbWVcbiAgICAgKiBAcmV0dXJuIHtDb21wb25lbnRbXX1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBzcHJpdGVzID0gbm9kZS5nZXRDb21wb25lbnRzSW5DaGlsZHJlbihjYy5TcHJpdGUpO1xuICAgICAqIHZhciB0ZXN0cyA9IG5vZGUuZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW4oXCJUZXN0XCIpO1xuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW48VCBleHRlbmRzIENvbXBvbmVudD4odHlwZToge3Byb3RvdHlwZTogVH0pOiBUW11cbiAgICAgKiBnZXRDb21wb25lbnRzSW5DaGlsZHJlbihjbGFzc05hbWU6IHN0cmluZyk6IGFueVtdXG4gICAgICovXG4gICAgZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW4gKHR5cGVPckNsYXNzTmFtZSkge1xuICAgICAgICB2YXIgY29uc3RydWN0b3IgPSBnZXRDb25zdHJ1Y3Rvcih0eXBlT3JDbGFzc05hbWUpLCBjb21wb25lbnRzID0gW107XG4gICAgICAgIGlmIChjb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgZmluZENvbXBvbmVudHModGhpcywgY29uc3RydWN0b3IsIGNvbXBvbmVudHMpO1xuICAgICAgICAgICAgZmluZENoaWxkQ29tcG9uZW50cyh0aGlzLl9jaGlsZHJlbiwgY29uc3RydWN0b3IsIGNvbXBvbmVudHMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21wb25lbnRzO1xuICAgIH0sXG5cbiAgICBfY2hlY2tNdWx0aXBsZUNvbXA6IENDX0VESVRPUiAmJiBmdW5jdGlvbiAoY3Rvcikge1xuICAgICAgICB2YXIgZXhpc3RpbmcgPSB0aGlzLmdldENvbXBvbmVudChjdG9yLl9kaXNhbGxvd011bHRpcGxlKTtcbiAgICAgICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICAgICAgICBpZiAoZXhpc3RpbmcuY29uc3RydWN0b3IgPT09IGN0b3IpIHtcbiAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDM4MDUsIGpzLmdldENsYXNzTmFtZShjdG9yKSwgdGhpcy5fbmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDM4MDYsIGpzLmdldENsYXNzTmFtZShjdG9yKSwgdGhpcy5fbmFtZSwganMuZ2V0Q2xhc3NOYW1lKGV4aXN0aW5nKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQWRkcyBhIGNvbXBvbmVudCBjbGFzcyB0byB0aGUgbm9kZS4gWW91IGNhbiBhbHNvIGFkZCBjb21wb25lbnQgdG8gbm9kZSBieSBwYXNzaW5nIGluIHRoZSBuYW1lIG9mIHRoZSBzY3JpcHQuXG4gICAgICogISN6aCDlkJHoioLngrnmt7vliqDkuIDkuKrmjIflrprnsbvlnovnmoTnu4Tku7bnsbvvvIzkvaDov5jlj6/ku6XpgJrov4fkvKDlhaXohJrmnKznmoTlkI3np7DmnaXmt7vliqDnu4Tku7bjgIJcbiAgICAgKiBAbWV0aG9kIGFkZENvbXBvbmVudFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258U3RyaW5nfSB0eXBlT3JDbGFzc05hbWUgLSBUaGUgY29uc3RydWN0b3Igb3IgdGhlIGNsYXNzIG5hbWUgb2YgdGhlIGNvbXBvbmVudCB0byBhZGRcbiAgICAgKiBAcmV0dXJuIHtDb21wb25lbnR9IC0gVGhlIG5ld2x5IGFkZGVkIGNvbXBvbmVudFxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIHNwcml0ZSA9IG5vZGUuYWRkQ29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICogdmFyIHRlc3QgPSBub2RlLmFkZENvbXBvbmVudChcIlRlc3RcIik7XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBhZGRDb21wb25lbnQ8VCBleHRlbmRzIENvbXBvbmVudD4odHlwZToge25ldygpOiBUfSk6IFRcbiAgICAgKiBhZGRDb21wb25lbnQoY2xhc3NOYW1lOiBzdHJpbmcpOiBhbnlcbiAgICAgKi9cbiAgICBhZGRDb21wb25lbnQgKHR5cGVPckNsYXNzTmFtZSkge1xuICAgICAgICBpZiAoQ0NfRURJVE9SICYmICh0aGlzLl9vYmpGbGFncyAmIERlc3Ryb3lpbmcpKSB7XG4gICAgICAgICAgICBjYy5lcnJvcignaXNEZXN0cm95aW5nJyk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGdldCBjb21wb25lbnRcblxuICAgICAgICB2YXIgY29uc3RydWN0b3I7XG4gICAgICAgIGlmICh0eXBlb2YgdHlwZU9yQ2xhc3NOYW1lID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY29uc3RydWN0b3IgPSBqcy5nZXRDbGFzc0J5TmFtZSh0eXBlT3JDbGFzc05hbWUpO1xuICAgICAgICAgICAgaWYgKCFjb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoMzgwNywgdHlwZU9yQ2xhc3NOYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAoY2MuX1JGcGVlaygpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoMzgwOCwgdHlwZU9yQ2xhc3NOYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoIXR5cGVPckNsYXNzTmFtZSkge1xuICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoMzgwNCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdHJ1Y3RvciA9IHR5cGVPckNsYXNzTmFtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNoZWNrIGNvbXBvbmVudFxuXG4gICAgICAgIGlmICh0eXBlb2YgY29uc3RydWN0b3IgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNjLmVycm9ySUQoMzgwOSk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWpzLmlzQ2hpbGRDbGFzc09mKGNvbnN0cnVjdG9yLCBjYy5Db21wb25lbnQpKSB7XG4gICAgICAgICAgICBjYy5lcnJvcklEKDM4MTApO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoQ0NfRURJVE9SICYmIGNvbnN0cnVjdG9yLl9kaXNhbGxvd011bHRpcGxlKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2NoZWNrTXVsdGlwbGVDb21wKGNvbnN0cnVjdG9yKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2hlY2sgcmVxdWlyZW1lbnRcblxuICAgICAgICB2YXIgUmVxQ29tcCA9IGNvbnN0cnVjdG9yLl9yZXF1aXJlQ29tcG9uZW50O1xuICAgICAgICBpZiAoUmVxQ29tcCAmJiAhdGhpcy5nZXRDb21wb25lbnQoUmVxQ29tcCkpIHtcbiAgICAgICAgICAgIHZhciBkZXBlbmRlZCA9IHRoaXMuYWRkQ29tcG9uZW50KFJlcUNvbXApO1xuICAgICAgICAgICAgaWYgKCFkZXBlbmRlZCkge1xuICAgICAgICAgICAgICAgIC8vIGRlcGVuZCBjb25mbGljdHNcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vLy8gY2hlY2sgY29uZmxpY3RcbiAgICAgICAgLy9cbiAgICAgICAgLy9pZiAoQ0NfRURJVE9SICYmICFfU2NlbmUuRGV0ZWN0Q29uZmxpY3QuYmVmb3JlQWRkQ29tcG9uZW50KHRoaXMsIGNvbnN0cnVjdG9yKSkge1xuICAgICAgICAvLyAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgLy99XG5cbiAgICAgICAgLy9cblxuICAgICAgICB2YXIgY29tcG9uZW50ID0gbmV3IGNvbnN0cnVjdG9yKCk7XG4gICAgICAgIGNvbXBvbmVudC5ub2RlID0gdGhpcztcbiAgICAgICAgdGhpcy5fY29tcG9uZW50cy5wdXNoKGNvbXBvbmVudCk7XG4gICAgICAgIGlmICgoQ0NfRURJVE9SIHx8IENDX1RFU1QpICYmIGNjLmVuZ2luZSAmJiAodGhpcy5faWQgaW4gY2MuZW5naW5lLmF0dGFjaGVkT2Jqc0ZvckVkaXRvcikpIHtcbiAgICAgICAgICAgIGNjLmVuZ2luZS5hdHRhY2hlZE9ianNGb3JFZGl0b3JbY29tcG9uZW50Ll9pZF0gPSBjb21wb25lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZUluSGllcmFyY2h5KSB7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5fbm9kZUFjdGl2YXRvci5hY3RpdmF0ZUNvbXAoY29tcG9uZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb21wb25lbnQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFRoaXMgYXBpIHNob3VsZCBvbmx5IHVzZWQgYnkgdW5kbyBzeXN0ZW1cbiAgICAgKiBAbWV0aG9kIF9hZGRDb21wb25lbnRBdFxuICAgICAqIEBwYXJhbSB7Q29tcG9uZW50fSBjb21wXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfYWRkQ29tcG9uZW50QXQ6IENDX0VESVRPUiAmJiBmdW5jdGlvbiAoY29tcCwgaW5kZXgpIHtcbiAgICAgICAgaWYgKHRoaXMuX29iakZsYWdzICYgRGVzdHJveWluZykge1xuICAgICAgICAgICAgcmV0dXJuIGNjLmVycm9yKCdpc0Rlc3Ryb3lpbmcnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIShjb21wIGluc3RhbmNlb2YgY2MuQ29tcG9uZW50KSkge1xuICAgICAgICAgICAgcmV0dXJuIGNjLmVycm9ySUQoMzgxMSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluZGV4ID4gdGhpcy5fY29tcG9uZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBjYy5lcnJvcklEKDM4MTIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVjaGVjayBhdHRyaWJ1dGVzIGJlY2F1c2Ugc2NyaXB0IG1heSBjaGFuZ2VkXG4gICAgICAgIHZhciBjdG9yID0gY29tcC5jb25zdHJ1Y3RvcjtcbiAgICAgICAgaWYgKGN0b3IuX2Rpc2FsbG93TXVsdGlwbGUpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fY2hlY2tNdWx0aXBsZUNvbXAoY3RvcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIFJlcUNvbXAgPSBjdG9yLl9yZXF1aXJlQ29tcG9uZW50O1xuICAgICAgICBpZiAoUmVxQ29tcCAmJiAhdGhpcy5nZXRDb21wb25lbnQoUmVxQ29tcCkpIHtcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gdGhpcy5fY29tcG9uZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiBjb21wIHNob3VsZCBiZSBsYXN0IGNvbXBvbmVudCwgaW5jcmVhc2UgdGhlIGluZGV4IGJlY2F1c2UgcmVxdWlyZWQgY29tcG9uZW50IGFkZGVkXG4gICAgICAgICAgICAgICAgKytpbmRleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBkZXBlbmRlZCA9IHRoaXMuYWRkQ29tcG9uZW50KFJlcUNvbXApO1xuICAgICAgICAgICAgaWYgKCFkZXBlbmRlZCkge1xuICAgICAgICAgICAgICAgIC8vIGRlcGVuZCBjb25mbGljdHNcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbXAubm9kZSA9IHRoaXM7XG4gICAgICAgIHRoaXMuX2NvbXBvbmVudHMuc3BsaWNlKGluZGV4LCAwLCBjb21wKTtcbiAgICAgICAgaWYgKChDQ19FRElUT1IgfHwgQ0NfVEVTVCkgJiYgY2MuZW5naW5lICYmICh0aGlzLl9pZCBpbiBjYy5lbmdpbmUuYXR0YWNoZWRPYmpzRm9yRWRpdG9yKSkge1xuICAgICAgICAgICAgY2MuZW5naW5lLmF0dGFjaGVkT2Jqc0ZvckVkaXRvcltjb21wLl9pZF0gPSBjb21wO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9hY3RpdmVJbkhpZXJhcmNoeSkge1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IuX25vZGVBY3RpdmF0b3IuYWN0aXZhdGVDb21wKGNvbXApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZW1vdmVzIGEgY29tcG9uZW50IGlkZW50aWZpZWQgYnkgdGhlIGdpdmVuIG5hbWUgb3IgcmVtb3ZlcyB0aGUgY29tcG9uZW50IG9iamVjdCBnaXZlbi5cbiAgICAgKiBZb3UgY2FuIGFsc28gdXNlIGNvbXBvbmVudC5kZXN0cm95KCkgaWYgeW91IGFscmVhZHkgaGF2ZSB0aGUgcmVmZXJlbmNlLlxuICAgICAqICEjemhcbiAgICAgKiDliKDpmaToioLngrnkuIrnmoTmjIflrprnu4Tku7bvvIzkvKDlhaXlj4LmlbDlj6/ku6XmmK/kuIDkuKrnu4Tku7bmnoTpgKDlh73mlbDmiJbnu4Tku7blkI3vvIzkuZ/lj6/ku6XmmK/lt7Lnu4/ojrflvpfnmoTnu4Tku7blvJXnlKjjgIJcbiAgICAgKiDlpoLmnpzkvaDlt7Lnu4/ojrflvpfnu4Tku7blvJXnlKjvvIzkvaDkuZ/lj6/ku6Xnm7TmjqXosIPnlKggY29tcG9uZW50LmRlc3Ryb3koKVxuICAgICAqIEBtZXRob2QgcmVtb3ZlQ29tcG9uZW50XG4gICAgICogQHBhcmFtIHtTdHJpbmd8RnVuY3Rpb258Q29tcG9uZW50fSBjb21wb25lbnQgLSBUaGUgbmVlZCByZW1vdmUgY29tcG9uZW50LlxuICAgICAqIEBkZXByZWNhdGVkIHBsZWFzZSBkZXN0cm95IHRoZSBjb21wb25lbnQgdG8gcmVtb3ZlIGl0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICogbm9kZS5yZW1vdmVDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgKiB2YXIgVGVzdCA9IHJlcXVpcmUoXCJUZXN0XCIpO1xuICAgICAqIG5vZGUucmVtb3ZlQ29tcG9uZW50KFRlc3QpO1xuICAgICAqL1xuICAgIHJlbW92ZUNvbXBvbmVudCAoY29tcG9uZW50KSB7XG4gICAgICAgIGlmICghY29tcG9uZW50KSB7XG4gICAgICAgICAgICBjYy5lcnJvcklEKDM4MTMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKGNvbXBvbmVudCBpbnN0YW5jZW9mIGNjLkNvbXBvbmVudCkpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudCA9IHRoaXMuZ2V0Q29tcG9uZW50KGNvbXBvbmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgICAgICAgY29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIF9nZXREZXBlbmRDb21wb25lbnRcbiAgICAgKiBAcGFyYW0ge0NvbXBvbmVudH0gZGVwZW5kZWRcbiAgICAgKiBAcmV0dXJuIHtDb21wb25lbnR9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZ2V0RGVwZW5kQ29tcG9uZW50OiBDQ19FRElUT1IgJiYgZnVuY3Rpb24gKGRlcGVuZGVkKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fY29tcG9uZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGNvbXAgPSB0aGlzLl9jb21wb25lbnRzW2ldO1xuICAgICAgICAgICAgaWYgKGNvbXAgIT09IGRlcGVuZGVkICYmIGNvbXAuaXNWYWxpZCAmJiAhY2MuT2JqZWN0Ll93aWxsRGVzdHJveShjb21wKSkge1xuICAgICAgICAgICAgICAgIHZhciBkZXBlbmQgPSBjb21wLmNvbnN0cnVjdG9yLl9yZXF1aXJlQ29tcG9uZW50O1xuICAgICAgICAgICAgICAgIGlmIChkZXBlbmQgJiYgZGVwZW5kZWQgaW5zdGFuY2VvZiBkZXBlbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICAvLyBkbyByZW1vdmUgY29tcG9uZW50LCBvbmx5IHVzZWQgaW50ZXJuYWxseVxuICAgIF9yZW1vdmVDb21wb25lbnQgKGNvbXBvbmVudCkge1xuICAgICAgICBpZiAoIWNvbXBvbmVudCkge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgzODE0KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghKHRoaXMuX29iakZsYWdzICYgRGVzdHJveWluZykpIHtcbiAgICAgICAgICAgIHZhciBpID0gdGhpcy5fY29tcG9uZW50cy5pbmRleE9mKGNvbXBvbmVudCk7XG4gICAgICAgICAgICBpZiAoaSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb21wb25lbnRzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBpZiAoKENDX0VESVRPUiB8fCBDQ19URVNUKSAmJiBjYy5lbmdpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGNjLmVuZ2luZS5hdHRhY2hlZE9ianNGb3JFZGl0b3JbY29tcG9uZW50Ll9pZF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29tcG9uZW50Lm5vZGUgIT09IHRoaXMpIHtcbiAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDM4MTUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGRlc3Ryb3kgKCkge1xuICAgICAgICBpZiAoY2MuT2JqZWN0LnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcykpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIERlc3Ryb3kgYWxsIGNoaWxkcmVuIGZyb20gdGhlIG5vZGUsIGFuZCByZWxlYXNlIGFsbCB0aGVpciBvd24gcmVmZXJlbmNlcyB0byBvdGhlciBvYmplY3RzLjxici8+XG4gICAgICogQWN0dWFsIGRlc3RydWN0IG9wZXJhdGlvbiB3aWxsIGRlbGF5ZWQgdW50aWwgYmVmb3JlIHJlbmRlcmluZy5cbiAgICAgKiAhI3poXG4gICAgICog6ZSA5q+B5omA5pyJ5a2Q6IqC54K577yM5bm26YeK5pS+5omA5pyJ5a6D5Lus5a+55YW25a6D5a+56LGh55qE5byV55So44CCPGJyLz5cbiAgICAgKiDlrp7pmYXplIDmr4Hmk43kvZzkvJrlu7bov5/liLDlvZPliY3luKfmuLLmn5PliY3miafooYzjgIJcbiAgICAgKiBAbWV0aG9kIGRlc3Ryb3lBbGxDaGlsZHJlblxuICAgICAqIEBleGFtcGxlXG4gICAgICogbm9kZS5kZXN0cm95QWxsQ2hpbGRyZW4oKTtcbiAgICAgKi9cbiAgICBkZXN0cm95QWxsQ2hpbGRyZW4gKCkge1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgY2hpbGRyZW5baV0uZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9vblNldFBhcmVudCAodmFsdWUpIHt9LFxuICAgIF9vblBvc3RBY3RpdmF0ZWQgKCkge30sXG4gICAgX29uQmF0Y2hSZXN0b3JlZCAoKSB7fSxcbiAgICBfb25CYXRjaENyZWF0ZWQgKCkge30sXG5cbiAgICBfb25IaWVyYXJjaHlDaGFuZ2VkIChvbGRQYXJlbnQpIHtcbiAgICAgICAgdmFyIG5ld1BhcmVudCA9IHRoaXMuX3BhcmVudDtcbiAgICAgICAgaWYgKHRoaXMuX3BlcnNpc3ROb2RlICYmICEobmV3UGFyZW50IGluc3RhbmNlb2YgY2MuU2NlbmUpKSB7XG4gICAgICAgICAgICBjYy5nYW1lLnJlbW92ZVBlcnNpc3RSb290Tm9kZSh0aGlzKTtcbiAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICBjYy53YXJuSUQoMTYyMyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoQ0NfRURJVE9SIHx8IENDX1RFU1QpIHtcbiAgICAgICAgICAgIHZhciBzY2VuZSA9IGNjLmRpcmVjdG9yLmdldFNjZW5lKCk7XG4gICAgICAgICAgICB2YXIgaW5DdXJyZW50U2NlbmVCZWZvcmUgPSBvbGRQYXJlbnQgJiYgb2xkUGFyZW50LmlzQ2hpbGRPZihzY2VuZSk7XG4gICAgICAgICAgICB2YXIgaW5DdXJyZW50U2NlbmVOb3cgPSBuZXdQYXJlbnQgJiYgbmV3UGFyZW50LmlzQ2hpbGRPZihzY2VuZSk7XG4gICAgICAgICAgICBpZiAoIWluQ3VycmVudFNjZW5lQmVmb3JlICYmIGluQ3VycmVudFNjZW5lTm93KSB7XG4gICAgICAgICAgICAgICAgLy8gYXR0YWNoZWRcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWdpc3RlcklmQXR0YWNoZWQodHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpbkN1cnJlbnRTY2VuZUJlZm9yZSAmJiAhaW5DdXJyZW50U2NlbmVOb3cpIHtcbiAgICAgICAgICAgICAgICAvLyBkZXRhY2hlZFxuICAgICAgICAgICAgICAgIHRoaXMuX3JlZ2lzdGVySWZBdHRhY2hlZChmYWxzZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHVwZGF0ZSBwcmVmYWJcbiAgICAgICAgICAgIHZhciBuZXdQcmVmYWJSb290ID0gbmV3UGFyZW50ICYmIG5ld1BhcmVudC5fcHJlZmFiICYmIG5ld1BhcmVudC5fcHJlZmFiLnJvb3Q7XG4gICAgICAgICAgICB2YXIgbXlQcmVmYWJJbmZvID0gdGhpcy5fcHJlZmFiO1xuICAgICAgICAgICAgdmFyIFByZWZhYlV0aWxzID0gRWRpdG9yLnJlcXVpcmUoJ3NjZW5lOi8vdXRpbHMvcHJlZmFiJyk7XG4gICAgICAgICAgICBpZiAobXlQcmVmYWJJbmZvKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5ld1ByZWZhYlJvb3QpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG15UHJlZmFiSW5mby5yb290ICE9PSBuZXdQcmVmYWJSb290KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGFuZ2UgcHJlZmFiXG4gICAgICAgICAgICAgICAgICAgICAgICBQcmVmYWJVdGlscy51bmxpbmtQcmVmYWIodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBQcmVmYWJVdGlscy5saW5rUHJlZmFiKG5ld1ByZWZhYlJvb3QuX3ByZWZhYi5hc3NldCwgbmV3UHJlZmFiUm9vdCwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobXlQcmVmYWJJbmZvLnJvb3QgIT09IHRoaXMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZGV0YWNoIGZyb20gcHJlZmFiXG4gICAgICAgICAgICAgICAgICAgIFByZWZhYlV0aWxzLnVubGlua1ByZWZhYih0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChuZXdQcmVmYWJSb290KSB7XG4gICAgICAgICAgICAgICAgLy8gYXR0YWNoIHRvIHByZWZhYlxuICAgICAgICAgICAgICAgIFByZWZhYlV0aWxzLmxpbmtQcmVmYWIobmV3UHJlZmFiUm9vdC5fcHJlZmFiLmFzc2V0LCBuZXdQcmVmYWJSb290LCB0aGlzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY29uZmxpY3QgZGV0ZWN0aW9uXG4gICAgICAgICAgICBfU2NlbmUuRGV0ZWN0Q29uZmxpY3QuYWZ0ZXJBZGRDaGlsZCh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzaG91bGRBY3RpdmVOb3cgPSB0aGlzLl9hY3RpdmUgJiYgISEobmV3UGFyZW50ICYmIG5ld1BhcmVudC5fYWN0aXZlSW5IaWVyYXJjaHkpO1xuICAgICAgICBpZiAodGhpcy5fYWN0aXZlSW5IaWVyYXJjaHkgIT09IHNob3VsZEFjdGl2ZU5vdykge1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IuX25vZGVBY3RpdmF0b3IuYWN0aXZhdGVOb2RlKHRoaXMsIHNob3VsZEFjdGl2ZU5vdyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2luc3RhbnRpYXRlIChjbG9uZWQpIHtcbiAgICAgICAgaWYgKCFjbG9uZWQpIHtcbiAgICAgICAgICAgIGNsb25lZCA9IGNjLmluc3RhbnRpYXRlLl9jbG9uZSh0aGlzLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0aGlzUHJlZmFiSW5mbyA9IHRoaXMuX3ByZWZhYjtcbiAgICAgICAgaWYgKENDX0VESVRPUiAmJiB0aGlzUHJlZmFiSW5mbykge1xuICAgICAgICAgICAgaWYgKHRoaXMgIT09IHRoaXNQcmVmYWJJbmZvLnJvb3QpIHtcbiAgICAgICAgICAgICAgICB2YXIgUHJlZmFiVXRpbHMgPSBFZGl0b3IucmVxdWlyZSgnc2NlbmU6Ly91dGlscy9wcmVmYWInKTtcbiAgICAgICAgICAgICAgICBQcmVmYWJVdGlscy5pbml0Q2xvbmVkQ2hpbGRPZlByZWZhYihjbG9uZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBzeW5jaW5nID0gdGhpc1ByZWZhYkluZm8gJiYgdGhpcyA9PT0gdGhpc1ByZWZhYkluZm8ucm9vdCAmJiB0aGlzUHJlZmFiSW5mby5zeW5jO1xuICAgICAgICBpZiAoc3luY2luZykge1xuICAgICAgICAgICAgLy9pZiAodGhpc1ByZWZhYkluZm8uX3N5bmNlZCkge1xuICAgICAgICAgICAgLy8gICAgcmV0dXJuIGNsb25lO1xuICAgICAgICAgICAgLy99XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoQ0NfRURJVE9SICYmIGNjLmVuZ2luZS5faXNQbGF5aW5nKSB7XG4gICAgICAgICAgICBjbG9uZWQuX25hbWUgKz0gJyAoQ2xvbmUpJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlc2V0IGFuZCBpbml0XG4gICAgICAgIGNsb25lZC5fcGFyZW50ID0gbnVsbDtcbiAgICAgICAgY2xvbmVkLl9vbkJhdGNoUmVzdG9yZWQoKTtcblxuICAgICAgICByZXR1cm4gY2xvbmVkO1xuICAgIH0sXG5cbiAgICBfcmVnaXN0ZXJJZkF0dGFjaGVkOiAoQ0NfRURJVE9SIHx8IENDX1RFU1QpICYmIGZ1bmN0aW9uIChyZWdpc3Rlcikge1xuICAgICAgICB2YXIgYXR0YWNoZWRPYmpzRm9yRWRpdG9yID0gY2MuZW5naW5lLmF0dGFjaGVkT2Jqc0ZvckVkaXRvcjtcbiAgICAgICAgaWYgKHJlZ2lzdGVyKSB7XG4gICAgICAgICAgICBhdHRhY2hlZE9ianNGb3JFZGl0b3JbdGhpcy5faWRdID0gdGhpcztcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fY29tcG9uZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBjb21wID0gdGhpcy5fY29tcG9uZW50c1tpXTtcbiAgICAgICAgICAgICAgICBhdHRhY2hlZE9ianNGb3JFZGl0b3JbY29tcC5faWRdID0gY29tcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNjLmVuZ2luZS5lbWl0KCdub2RlLWF0dGFjaC10by1zY2VuZScsIHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2MuZW5naW5lLmVtaXQoJ25vZGUtZGV0YWNoLWZyb20tc2NlbmUnLCB0aGlzKTtcbiAgICAgICAgICAgIGRlbGV0ZSBhdHRhY2hlZE9ianNGb3JFZGl0b3JbdGhpcy5faWRdO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9jb21wb25lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNvbXAgPSB0aGlzLl9jb21wb25lbnRzW2ldO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBhdHRhY2hlZE9ianNGb3JFZGl0b3JbY29tcC5faWRdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgY2hpbGQuX3JlZ2lzdGVySWZBdHRhY2hlZChyZWdpc3Rlcik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX29uUHJlRGVzdHJveSAoKSB7XG4gICAgICAgIHZhciBpLCBsZW47XG5cbiAgICAgICAgLy8gbWFya2VkIGFzIGRlc3Ryb3lpbmdcbiAgICAgICAgdGhpcy5fb2JqRmxhZ3MgfD0gRGVzdHJveWluZztcblxuICAgICAgICAvLyBkZXRhY2ggc2VsZiBhbmQgY2hpbGRyZW4gZnJvbSBlZGl0b3JcbiAgICAgICAgdmFyIHBhcmVudCA9IHRoaXMuX3BhcmVudDtcbiAgICAgICAgdmFyIGRlc3Ryb3lCeVBhcmVudCA9IHBhcmVudCAmJiAocGFyZW50Ll9vYmpGbGFncyAmIERlc3Ryb3lpbmcpO1xuICAgICAgICBpZiAoIWRlc3Ryb3lCeVBhcmVudCAmJiAoQ0NfRURJVE9SIHx8IENDX1RFU1QpKSB7XG4gICAgICAgICAgICB0aGlzLl9yZWdpc3RlcklmQXR0YWNoZWQoZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZGVzdHJveSBjaGlsZHJlblxuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbjtcbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgICAgIC8vIGRlc3Ryb3kgaW1tZWRpYXRlIHNvIGl0cyBfb25QcmVEZXN0cm95IGNhbiBiZSBjYWxsZWRcbiAgICAgICAgICAgIGNoaWxkcmVuW2ldLl9kZXN0cm95SW1tZWRpYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkZXN0cm95IHNlbGYgY29tcG9uZW50c1xuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSB0aGlzLl9jb21wb25lbnRzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgICAgICB2YXIgY29tcG9uZW50ID0gdGhpcy5fY29tcG9uZW50c1tpXTtcbiAgICAgICAgICAgIC8vIGRlc3Ryb3kgaW1tZWRpYXRlIHNvIGl0cyBfb25QcmVEZXN0cm95IGNhbiBiZSBjYWxsZWRcbiAgICAgICAgICAgIGNvbXBvbmVudC5fZGVzdHJveUltbWVkaWF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGV2ZW50VGFyZ2V0cyA9IHRoaXMuX19ldmVudFRhcmdldHM7XG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGV2ZW50VGFyZ2V0cy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICAgICAgdmFyIHRhcmdldCA9IGV2ZW50VGFyZ2V0c1tpXTtcbiAgICAgICAgICAgIHRhcmdldCAmJiB0YXJnZXQudGFyZ2V0T2ZmKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50VGFyZ2V0cy5sZW5ndGggPSAwO1xuXG4gICAgICAgIC8vIHJlbW92ZSBmcm9tIHBlcnNpc3RcbiAgICAgICAgaWYgKHRoaXMuX3BlcnNpc3ROb2RlKSB7XG4gICAgICAgICAgICBjYy5nYW1lLnJlbW92ZVBlcnNpc3RSb290Tm9kZSh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZGVzdHJveUJ5UGFyZW50KSB7XG4gICAgICAgICAgICAvLyByZW1vdmUgZnJvbSBwYXJlbnRcbiAgICAgICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGRJbmRleCA9IHBhcmVudC5fY2hpbGRyZW4uaW5kZXhPZih0aGlzKTtcbiAgICAgICAgICAgICAgICBwYXJlbnQuX2NoaWxkcmVuLnNwbGljZShjaGlsZEluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICBwYXJlbnQuZW1pdCAmJiBwYXJlbnQuZW1pdCgnY2hpbGQtcmVtb3ZlZCcsIHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRlc3Ryb3lCeVBhcmVudDtcbiAgICB9LFxuXG4gICAgb25SZXN0b3JlOiBDQ19FRElUT1IgJiYgZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBjaGVjayBhY3Rpdml0eSBzdGF0ZVxuICAgICAgICB2YXIgc2hvdWxkQWN0aXZlTm93ID0gdGhpcy5fYWN0aXZlICYmICEhKHRoaXMuX3BhcmVudCAmJiB0aGlzLl9wYXJlbnQuX2FjdGl2ZUluSGllcmFyY2h5KTtcbiAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZUluSGllcmFyY2h5ICE9PSBzaG91bGRBY3RpdmVOb3cpIHtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLl9ub2RlQWN0aXZhdG9yLmFjdGl2YXRlTm9kZSh0aGlzLCBzaG91bGRBY3RpdmVOb3cpO1xuICAgICAgICB9XG4gICAgfSxcbn0pO1xuXG5CYXNlTm9kZS5pZEdlbmVyYXRlciA9IGlkR2VuZXJhdGVyO1xuXG4vLyBGb3Igd2Fsa1xuQmFzZU5vZGUuX3N0YWNrcyA9IFtbXV07XG5CYXNlTm9kZS5fc3RhY2tJZCA9IDA7XG5cbkJhc2VOb2RlLnByb3RvdHlwZS5fb25QcmVEZXN0cm95QmFzZSA9IEJhc2VOb2RlLnByb3RvdHlwZS5fb25QcmVEZXN0cm95O1xuaWYgKENDX0VESVRPUikge1xuICAgIEJhc2VOb2RlLnByb3RvdHlwZS5fb25QcmVEZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgIHZhciBkZXN0cm95QnlQYXJlbnQgPSB0aGlzLl9vblByZURlc3Ryb3lCYXNlKCk7XG4gICAgICAgaWYgKCFkZXN0cm95QnlQYXJlbnQpIHtcbiAgICAgICAgICAgLy8gZW5zdXJlIHRoaXMgbm9kZSBjYW4gcmVhdHRhY2ggdG8gc2NlbmUgYnkgdW5kbyBzeXN0ZW1cbiAgICAgICAgICAgLy8gKHNpbXVsYXRlIHNvbWUgZGVzdHJ1Y3QgbG9naWMgdG8gbWFrZSB1bmRvIHN5c3RlbSB3b3JrIGNvcnJlY3RseSlcbiAgICAgICAgICAgdGhpcy5fcGFyZW50ID0gbnVsbDtcbiAgICAgICB9XG4gICAgICAgcmV0dXJuIGRlc3Ryb3lCeVBhcmVudDtcbiAgIH07XG59XG5cbkJhc2VOb2RlLnByb3RvdHlwZS5fb25IaWVyYXJjaHlDaGFuZ2VkQmFzZSA9IEJhc2VOb2RlLnByb3RvdHlwZS5fb25IaWVyYXJjaHlDaGFuZ2VkO1xuXG5pZihDQ19FRElUT1IpIHtcbiAgICBCYXNlTm9kZS5wcm90b3R5cGUuX29uUmVzdG9yZUJhc2UgPSBCYXNlTm9kZS5wcm90b3R5cGUub25SZXN0b3JlO1xufVxuXG4vLyBEZWZpbmUgcHVibGljIGdldHRlciBhbmQgc2V0dGVyIG1ldGhvZHMgdG8gZW5zdXJlIGFwaSBjb21wYXRpYmlsaXR5LlxudmFyIFNhbWVOYW1lR2V0U2V0cyA9IFsncGFyZW50JywgJ25hbWUnLCAnY2hpbGRyZW4nLCAnY2hpbGRyZW5Db3VudCcsXTtcbm1pc2MucHJvcGVydHlEZWZpbmUoQmFzZU5vZGUsIFNhbWVOYW1lR2V0U2V0cywge30pO1xuXG5pZiAoQ0NfREVWKSB7XG4gICAgLy8gcHJvbW90ZSBkZWJ1ZyBpbmZvXG4gICAganMuZ2V0KEJhc2VOb2RlLnByb3RvdHlwZSwgJyBJTkZPICcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBhdGggPSAnJztcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzO1xuICAgICAgICB3aGlsZSAobm9kZSAmJiAhKG5vZGUgaW5zdGFuY2VvZiBjYy5TY2VuZSkpIHtcbiAgICAgICAgICAgIGlmIChwYXRoKSB7XG4gICAgICAgICAgICAgICAgcGF0aCA9IG5vZGUubmFtZSArICcvJyArIHBhdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXRoID0gbm9kZS5uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbm9kZSA9IG5vZGUuX3BhcmVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5uYW1lICsgJywgcGF0aDogJyArIHBhdGg7XG4gICAgfSk7XG59XG5cbi8qKlxuICogISNlblxuICogTm90ZTogVGhpcyBldmVudCBpcyBvbmx5IGVtaXR0ZWQgZnJvbSB0aGUgdG9wIG1vc3Qgbm9kZSB3aG9zZSBhY3RpdmUgdmFsdWUgZGlkIGNoYW5nZWQsXG4gKiBub3QgaW5jbHVkaW5nIGl0cyBjaGlsZCBub2Rlcy5cbiAqICEjemhcbiAqIOazqOaEj++8muatpOiKgueCuea/gOa0u+aXtu+8jOatpOS6i+S7tuS7heS7juacgOmhtumDqOeahOiKgueCueWPkeWHuuOAglxuICogQGV2ZW50IGFjdGl2ZS1pbi1oaWVyYXJjaHktY2hhbmdlZFxuICogQHBhcmFtIHtFdmVudC5FdmVudEN1c3RvbX0gZXZlbnRcbiAqL1xuXG5jYy5fQmFzZU5vZGUgPSBtb2R1bGUuZXhwb3J0cyA9IEJhc2VOb2RlO1xuIl19