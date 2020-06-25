
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/CCNode.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
'use strict';

var _valueTypes = require("./value-types");

var BaseNode = require('./utils/base-node');

var PrefabHelper = require('./utils/prefab-helper');

var nodeMemPool = require('./utils/trans-pool').NodeMemPool;

var AffineTrans = require('./utils/affine-transform');

var eventManager = require('./event-manager');

var macro = require('./platform/CCMacro');

var js = require('./platform/js');

var Event = require('./event/event');

var EventTarget = require('./event/event-target');

var RenderFlow = require('./renderer/render-flow');

var Flags = cc.Object.Flags;
var Destroying = Flags.Destroying;
var ERR_INVALID_NUMBER = CC_EDITOR && 'The %s is invalid';
var ONE_DEGREE = Math.PI / 180;
var ActionManagerExist = !!cc.ActionManager;

var emptyFunc = function emptyFunc() {}; // getWorldPosition temp var


var _gwpVec3 = new _valueTypes.Vec3();

var _gwpQuat = new _valueTypes.Quat(); // _invTransformPoint temp var


var _tpVec3a = new _valueTypes.Vec3();

var _tpVec3b = new _valueTypes.Vec3();

var _tpQuata = new _valueTypes.Quat();

var _tpQuatb = new _valueTypes.Quat(); // setWorldPosition temp var


var _swpVec3 = new _valueTypes.Vec3(); // getWorldScale temp var


var _gwsVec3 = new _valueTypes.Vec3(); // setWorldScale temp var


var _swsVec3 = new _valueTypes.Vec3(); // getWorldRT temp var


var _gwrtVec3a = new _valueTypes.Vec3();

var _gwrtVec3b = new _valueTypes.Vec3();

var _gwrtQuata = new _valueTypes.Quat();

var _gwrtQuatb = new _valueTypes.Quat(); // lookAt temp var


var _laVec3 = new _valueTypes.Vec3();

var _laQuat = new _valueTypes.Quat(); // _hitTest temp var


var _htVec3a = new _valueTypes.Vec3();

var _htVec3b = new _valueTypes.Vec3(); // getWorldRotation temp var


var _gwrQuat = new _valueTypes.Quat(); // setWorldRotation temp var


var _swrQuat = new _valueTypes.Quat();

var _quata = new _valueTypes.Quat();

var _mat4_temp = cc.mat4();

var _vec3_temp = new _valueTypes.Vec3();

var _cachedArray = new Array(16);

_cachedArray.length = 0;
var POSITION_ON = 1 << 0;
var SCALE_ON = 1 << 1;
var ROTATION_ON = 1 << 2;
var SIZE_ON = 1 << 3;
var ANCHOR_ON = 1 << 4;
var COLOR_ON = 1 << 5;
var BuiltinGroupIndex = cc.Enum({
  DEBUG: 31
});
/**
 * !#en Node's local dirty properties flag
 * !#zh Node 的本地属性 dirty 状态位
 * @enum Node._LocalDirtyFlag
 * @static
 * @private
 * @namespace Node
 */

var LocalDirtyFlag = cc.Enum({
  /**
   * !#en Flag for position dirty
   * !#zh 位置 dirty 的标记位
   * @property {Number} POSITION
   * @static
   */
  POSITION: 1 << 0,

  /**
   * !#en Flag for scale dirty
   * !#zh 缩放 dirty 的标记位
   * @property {Number} SCALE
   * @static
   */
  SCALE: 1 << 1,

  /**
   * !#en Flag for rotation dirty
   * !#zh 旋转 dirty 的标记位
   * @property {Number} ROTATION
   * @static
   */
  ROTATION: 1 << 2,

  /**
   * !#en Flag for skew dirty
   * !#zh skew dirty 的标记位
   * @property {Number} SKEW
   * @static
   */
  SKEW: 1 << 3,

  /**
   * !#en Flag for rotation, scale or position dirty
   * !#zh 旋转，缩放，或位置 dirty 的标记位
   * @property {Number} TRS
   * @static
   */
  TRS: 1 << 0 | 1 << 1 | 1 << 2,

  /**
   * !#en Flag for rotation or scale dirty
   * !#zh 旋转或缩放 dirty 的标记位
   * @property {Number} RS
   * @static
   */
  RS: 1 << 1 | 1 << 2,

  /**
   * !#en Flag for rotation, scale, position, skew dirty
   * !#zh 旋转，缩放，位置，或斜角 dirty 的标记位
   * @property {Number} TRS
   * @static
   */
  TRSS: 1 << 0 | 1 << 1 | 1 << 2 | 1 << 3,

  /**
   * !#en Flag for physics position dirty
   * !#zh 物理位置 dirty 的标记位
   * @property {Number} PHYSICS_POSITION
   * @static
   */
  PHYSICS_POSITION: 1 << 4,

  /**
   * !#en Flag for physics scale dirty
   * !#zh 物理缩放 dirty 的标记位
   * @property {Number} PHYSICS_SCALE
   * @static
   */
  PHYSICS_SCALE: 1 << 5,

  /**
   * !#en Flag for physics rotation dirty
   * !#zh 物理旋转 dirty 的标记位
   * @property {Number} PHYSICS_ROTATION
   * @static
   */
  PHYSICS_ROTATION: 1 << 6,

  /**
   * !#en Flag for physics trs dirty
   * !#zh 物理位置旋转缩放 dirty 的标记位
   * @property {Number} PHYSICS_TRS
   * @static
   */
  PHYSICS_TRS: 1 << 4 | 1 << 5 | 1 << 6,

  /**
   * !#en Flag for physics rs dirty
   * !#zh 物理旋转缩放 dirty 的标记位
   * @property {Number} PHYSICS_RS
   * @static
   */
  PHYSICS_RS: 1 << 5 | 1 << 6,

  /**
   * !#en Flag for node and physics position dirty
   * !#zh 所有位置 dirty 的标记位
   * @property {Number} ALL_POSITION
   * @static
   */
  ALL_POSITION: 1 << 0 | 1 << 4,

  /**
   * !#en Flag for node and physics scale dirty
   * !#zh 所有缩放 dirty 的标记位
   * @property {Number} ALL_SCALE
   * @static
   */
  ALL_SCALE: 1 << 1 | 1 << 5,

  /**
   * !#en Flag for node and physics rotation dirty
   * !#zh 所有旋转 dirty 的标记位
   * @property {Number} ALL_ROTATION
   * @static
   */
  ALL_ROTATION: 1 << 2 | 1 << 6,

  /**
   * !#en Flag for node and physics trs dirty
   * !#zh 所有trs dirty 的标记位
   * @property {Number} ALL_TRS
   * @static
   */
  ALL_TRS: 1 << 0 | 1 << 1 | 1 << 2 | 1 << 4 | 1 << 5 | 1 << 6,

  /**
   * !#en Flag for all dirty properties
   * !#zh 覆盖所有 dirty 状态的标记位
   * @property {Number} ALL
   * @static
   */
  ALL: 0xffff
});
/**
 * !#en The event type supported by Node
 * !#zh Node 支持的事件类型
 * @class Node.EventType
 * @static
 * @namespace Node
 */
// Why EventType defined as class, because the first parameter of Node.on method needs set as 'string' type.

var EventType = cc.Enum({
  /**
   * !#en The event type for touch start event, you can use its value directly: 'touchstart'
   * !#zh 当手指触摸到屏幕时。
   * @property {String} TOUCH_START
   * @static
   */
  TOUCH_START: 'touchstart',

  /**
   * !#en The event type for touch move event, you can use its value directly: 'touchmove'
   * !#zh 当手指在屏幕上移动时。
   * @property {String} TOUCH_MOVE
   * @static
   */
  TOUCH_MOVE: 'touchmove',

  /**
   * !#en The event type for touch end event, you can use its value directly: 'touchend'
   * !#zh 当手指在目标节点区域内离开屏幕时。
   * @property {String} TOUCH_END
   * @static
   */
  TOUCH_END: 'touchend',

  /**
   * !#en The event type for touch end event, you can use its value directly: 'touchcancel'
   * !#zh 当手指在目标节点区域外离开屏幕时。
   * @property {String} TOUCH_CANCEL
   * @static
   */
  TOUCH_CANCEL: 'touchcancel',

  /**
   * !#en The event type for mouse down events, you can use its value directly: 'mousedown'
   * !#zh 当鼠标按下时触发一次。
   * @property {String} MOUSE_DOWN
   * @static
   */
  MOUSE_DOWN: 'mousedown',

  /**
   * !#en The event type for mouse move events, you can use its value directly: 'mousemove'
   * !#zh 当鼠标在目标节点在目标节点区域中移动时，不论是否按下。
   * @property {String} MOUSE_MOVE
   * @static
   */
  MOUSE_MOVE: 'mousemove',

  /**
   * !#en The event type for mouse enter target events, you can use its value directly: 'mouseenter'
   * !#zh 当鼠标移入目标节点区域时，不论是否按下。
   * @property {String} MOUSE_ENTER
   * @static
   */
  MOUSE_ENTER: 'mouseenter',

  /**
   * !#en The event type for mouse leave target events, you can use its value directly: 'mouseleave'
   * !#zh 当鼠标移出目标节点区域时，不论是否按下。
   * @property {String} MOUSE_LEAVE
   * @static
   */
  MOUSE_LEAVE: 'mouseleave',

  /**
   * !#en The event type for mouse up events, you can use its value directly: 'mouseup'
   * !#zh 当鼠标从按下状态松开时触发一次。
   * @property {String} MOUSE_UP
   * @static
   */
  MOUSE_UP: 'mouseup',

  /**
   * !#en The event type for mouse wheel events, you can use its value directly: 'mousewheel'
   * !#zh 当鼠标滚轮滚动时。
   * @property {String} MOUSE_WHEEL
   * @static
   */
  MOUSE_WHEEL: 'mousewheel',

  /**
   * !#en The event type for position change events.
   * Performance note, this event will be triggered every time corresponding properties being changed,
   * if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
   * !#zh 当节点位置改变时触发的事件。
   * 性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。
   * @property {String} POSITION_CHANGED
   * @static
   */
  POSITION_CHANGED: 'position-changed',

  /**
   * !#en The event type for rotation change events.
   * Performance note, this event will be triggered every time corresponding properties being changed,
   * if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
   * !#zh 当节点旋转改变时触发的事件。
   * 性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。
   * @property {String} ROTATION_CHANGED
   * @static
   */
  ROTATION_CHANGED: 'rotation-changed',

  /**
   * !#en The event type for scale change events.
   * Performance note, this event will be triggered every time corresponding properties being changed,
   * if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
   * !#zh 当节点缩放改变时触发的事件。
   * 性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。
   * @property {String} SCALE_CHANGED
   * @static
   */
  SCALE_CHANGED: 'scale-changed',

  /**
   * !#en The event type for size change events.
   * Performance note, this event will be triggered every time corresponding properties being changed,
   * if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
   * !#zh 当节点尺寸改变时触发的事件。
   * 性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。
   * @property {String} SIZE_CHANGED
   * @static
   */
  SIZE_CHANGED: 'size-changed',

  /**
   * !#en The event type for anchor point change events.
   * Performance note, this event will be triggered every time corresponding properties being changed,
   * if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
   * !#zh 当节点锚点改变时触发的事件。
   * 性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。
   * @property {String} ANCHOR_CHANGED
   * @static
   */
  ANCHOR_CHANGED: 'anchor-changed',

  /**
  * !#en The event type for color change events.
  * Performance note, this event will be triggered every time corresponding properties being changed,
  * if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
  * !#zh 当节点颜色改变时触发的事件。
  * 性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。
  * @property {String} COLOR_CHANGED
  * @static
  */
  COLOR_CHANGED: 'color-changed',

  /**
   * !#en The event type for new child added events.
   * !#zh 当新的子节点被添加时触发的事件。
   * @property {String} CHILD_ADDED
   * @static
   */
  CHILD_ADDED: 'child-added',

  /**
   * !#en The event type for child removed events.
   * !#zh 当子节点被移除时触发的事件。
   * @property {String} CHILD_REMOVED
   * @static
   */
  CHILD_REMOVED: 'child-removed',

  /**
   * !#en The event type for children reorder events.
   * !#zh 当子节点顺序改变时触发的事件。
   * @property {String} CHILD_REORDER
   * @static
   */
  CHILD_REORDER: 'child-reorder',

  /**
   * !#en The event type for node group changed events.
   * !#zh 当节点归属群组发生变化时触发的事件。
   * @property {String} GROUP_CHANGED
   * @static
   */
  GROUP_CHANGED: 'group-changed',

  /**
   * !#en The event type for node's sibling order changed.
   * !#zh 当节点在兄弟节点中的顺序发生变化时触发的事件。
   * @property {String} SIBLING_ORDER_CHANGED
   * @static
   */
  SIBLING_ORDER_CHANGED: 'sibling-order-changed'
});
var _touchEvents = [EventType.TOUCH_START, EventType.TOUCH_MOVE, EventType.TOUCH_END, EventType.TOUCH_CANCEL];
var _mouseEvents = [EventType.MOUSE_DOWN, EventType.MOUSE_ENTER, EventType.MOUSE_MOVE, EventType.MOUSE_LEAVE, EventType.MOUSE_UP, EventType.MOUSE_WHEEL];
var _skewNeedWarn = true;

var _skewWarn = function _skewWarn(value, node) {
  if (value !== 0) {
    var nodePath = "";

    if (CC_EDITOR) {
      var NodeUtils = Editor.require('scene://utils/node');

      nodePath = "Node: " + NodeUtils.getNodePath(node) + ".";
    }

    _skewNeedWarn && cc.warn("`cc.Node.skewX/Y` is deprecated since v2.2.1, please use 3D node instead.", nodePath);
    !CC_EDITOR && (_skewNeedWarn = false);
  }
};

var _currentHovered = null;

var _touchStartHandler = function _touchStartHandler(touch, event) {
  var pos = touch.getLocation();
  var node = this.owner;

  if (node._hitTest(pos, this)) {
    event.type = EventType.TOUCH_START;
    event.touch = touch;
    event.bubbles = true;
    node.dispatchEvent(event);
    return true;
  }

  return false;
};

var _touchMoveHandler = function _touchMoveHandler(touch, event) {
  var node = this.owner;
  event.type = EventType.TOUCH_MOVE;
  event.touch = touch;
  event.bubbles = true;
  node.dispatchEvent(event);
};

var _touchEndHandler = function _touchEndHandler(touch, event) {
  var pos = touch.getLocation();
  var node = this.owner;

  if (node._hitTest(pos, this)) {
    event.type = EventType.TOUCH_END;
  } else {
    event.type = EventType.TOUCH_CANCEL;
  }

  event.touch = touch;
  event.bubbles = true;
  node.dispatchEvent(event);
};

var _touchCancelHandler = function _touchCancelHandler(touch, event) {
  var pos = touch.getLocation();
  var node = this.owner;
  event.type = EventType.TOUCH_CANCEL;
  event.touch = touch;
  event.bubbles = true;
  node.dispatchEvent(event);
};

var _mouseDownHandler = function _mouseDownHandler(event) {
  var pos = event.getLocation();
  var node = this.owner;

  if (node._hitTest(pos, this)) {
    event.type = EventType.MOUSE_DOWN;
    event.bubbles = true;
    node.dispatchEvent(event);
  }
};

var _mouseMoveHandler = function _mouseMoveHandler(event) {
  var pos = event.getLocation();
  var node = this.owner;

  var hit = node._hitTest(pos, this);

  if (hit) {
    if (!this._previousIn) {
      // Fix issue when hover node switched, previous hovered node won't get MOUSE_LEAVE notification
      if (_currentHovered && _currentHovered._mouseListener) {
        event.type = EventType.MOUSE_LEAVE;

        _currentHovered.dispatchEvent(event);

        _currentHovered._mouseListener._previousIn = false;
      }

      _currentHovered = this.owner;
      event.type = EventType.MOUSE_ENTER;
      node.dispatchEvent(event);
      this._previousIn = true;
    }

    event.type = EventType.MOUSE_MOVE;
    event.bubbles = true;
    node.dispatchEvent(event);
  } else if (this._previousIn) {
    event.type = EventType.MOUSE_LEAVE;
    node.dispatchEvent(event);
    this._previousIn = false;
    _currentHovered = null;
  } else {
    // continue dispatching
    return;
  } // Event processed, cleanup


  event.stopPropagation();
};

var _mouseUpHandler = function _mouseUpHandler(event) {
  var pos = event.getLocation();
  var node = this.owner;

  if (node._hitTest(pos, this)) {
    event.type = EventType.MOUSE_UP;
    event.bubbles = true;
    node.dispatchEvent(event);
    event.stopPropagation();
  }
};

var _mouseWheelHandler = function _mouseWheelHandler(event) {
  var pos = event.getLocation();
  var node = this.owner;

  if (node._hitTest(pos, this)) {
    event.type = EventType.MOUSE_WHEEL;
    event.bubbles = true;
    node.dispatchEvent(event);
    event.stopPropagation();
  }
};

function _searchComponentsInParent(node, comp) {
  if (comp) {
    var index = 0;
    var list = null;

    for (var curr = node; curr && cc.Node.isNode(curr); curr = curr._parent, ++index) {
      if (curr.getComponent(comp)) {
        var next = {
          index: index,
          node: curr
        };

        if (list) {
          list.push(next);
        } else {
          list = [next];
        }
      }
    }

    return list;
  }

  return null;
}

function _checkListeners(node, events) {
  if (!(node._objFlags & Destroying)) {
    var i = 0;

    if (node._bubblingListeners) {
      for (; i < events.length; ++i) {
        if (node._bubblingListeners.hasEventListener(events[i])) {
          return true;
        }
      }
    }

    if (node._capturingListeners) {
      for (; i < events.length; ++i) {
        if (node._capturingListeners.hasEventListener(events[i])) {
          return true;
        }
      }
    }

    return false;
  }

  return true;
}

function _doDispatchEvent(owner, event) {
  var target, i;
  event.target = owner; // Event.CAPTURING_PHASE

  _cachedArray.length = 0;

  owner._getCapturingTargets(event.type, _cachedArray); // capturing


  event.eventPhase = 1;

  for (i = _cachedArray.length - 1; i >= 0; --i) {
    target = _cachedArray[i];

    if (target._capturingListeners) {
      event.currentTarget = target; // fire event

      target._capturingListeners.emit(event.type, event, _cachedArray); // check if propagation stopped


      if (event._propagationStopped) {
        _cachedArray.length = 0;
        return;
      }
    }
  }

  _cachedArray.length = 0; // Event.AT_TARGET
  // checks if destroyed in capturing callbacks

  event.eventPhase = 2;
  event.currentTarget = owner;

  if (owner._capturingListeners) {
    owner._capturingListeners.emit(event.type, event);
  }

  if (!event._propagationImmediateStopped && owner._bubblingListeners) {
    owner._bubblingListeners.emit(event.type, event);
  }

  if (!event._propagationStopped && event.bubbles) {
    // Event.BUBBLING_PHASE
    owner._getBubblingTargets(event.type, _cachedArray); // propagate


    event.eventPhase = 3;

    for (i = 0; i < _cachedArray.length; ++i) {
      target = _cachedArray[i];

      if (target._bubblingListeners) {
        event.currentTarget = target; // fire event

        target._bubblingListeners.emit(event.type, event); // check if propagation stopped


        if (event._propagationStopped) {
          _cachedArray.length = 0;
          return;
        }
      }
    }
  }

  _cachedArray.length = 0;
} // traversal the node tree, child cullingMask must keep the same with the parent.


function _getActualGroupIndex(node) {
  var groupIndex = node.groupIndex;

  if (groupIndex === 0 && node.parent) {
    groupIndex = _getActualGroupIndex(node.parent);
  }

  return groupIndex;
}

function _updateCullingMask(node) {
  var index = _getActualGroupIndex(node);

  node._cullingMask = 1 << index;

  if (CC_JSB && CC_NATIVERENDERER) {
    node._proxy && node._proxy.updateCullingMask();
  }

  ;

  for (var i = 0; i < node._children.length; i++) {
    _updateCullingMask(node._children[i]);
  }
} // 2D/3D matrix functions


function updateLocalMatrix3D() {
  if (this._localMatDirty & LocalDirtyFlag.TRSS) {
    // Update transform
    var t = this._matrix;
    var tm = t.m;

    _valueTypes.Trs.toMat4(t, this._trs); // skew


    if (this._skewX || this._skewY) {
      var a = tm[0],
          b = tm[1],
          c = tm[4],
          d = tm[5];
      var skx = Math.tan(this._skewX * ONE_DEGREE);
      var sky = Math.tan(this._skewY * ONE_DEGREE);
      if (skx === Infinity) skx = 99999999;
      if (sky === Infinity) sky = 99999999;
      tm[0] = a + c * sky;
      tm[1] = b + d * sky;
      tm[4] = c + a * skx;
      tm[5] = d + b * skx;
    }

    this._localMatDirty &= ~LocalDirtyFlag.TRSS; // Register dirty status of world matrix so that it can be recalculated

    this._worldMatDirty = true;
  }
}

function updateLocalMatrix2D() {
  var dirtyFlag = this._localMatDirty;
  if (!(dirtyFlag & LocalDirtyFlag.TRSS)) return; // Update transform

  var t = this._matrix;
  var tm = t.m;
  var trs = this._trs;

  if (dirtyFlag & (LocalDirtyFlag.RS | LocalDirtyFlag.SKEW)) {
    var rotation = -this._eulerAngles.z;
    var hasSkew = this._skewX || this._skewY;
    var sx = trs[7],
        sy = trs[8];

    if (rotation || hasSkew) {
      var a = 1,
          b = 0,
          c = 0,
          d = 1; // rotation

      if (rotation) {
        var rotationRadians = rotation * ONE_DEGREE;
        c = Math.sin(rotationRadians);
        d = Math.cos(rotationRadians);
        a = d;
        b = -c;
      } // scale


      tm[0] = a *= sx;
      tm[1] = b *= sx;
      tm[4] = c *= sy;
      tm[5] = d *= sy; // skew

      if (hasSkew) {
        var _a = tm[0],
            _b = tm[1],
            _c = tm[4],
            _d = tm[5];
        var skx = Math.tan(this._skewX * ONE_DEGREE);
        var sky = Math.tan(this._skewY * ONE_DEGREE);
        if (skx === Infinity) skx = 99999999;
        if (sky === Infinity) sky = 99999999;
        tm[0] = _a + _c * sky;
        tm[1] = _b + _d * sky;
        tm[4] = _c + _a * skx;
        tm[5] = _d + _b * skx;
      }
    } else {
      tm[0] = sx;
      tm[1] = 0;
      tm[4] = 0;
      tm[5] = sy;
    }
  } // position


  tm[12] = trs[0];
  tm[13] = trs[1];
  this._localMatDirty &= ~LocalDirtyFlag.TRSS; // Register dirty status of world matrix so that it can be recalculated

  this._worldMatDirty = true;
}

function calculWorldMatrix3D() {
  // Avoid as much function call as possible
  if (this._localMatDirty & LocalDirtyFlag.TRSS) {
    this._updateLocalMatrix();
  }

  if (this._parent) {
    var parentMat = this._parent._worldMatrix;

    _valueTypes.Mat4.mul(this._worldMatrix, parentMat, this._matrix);
  } else {
    _valueTypes.Mat4.copy(this._worldMatrix, this._matrix);
  }

  this._worldMatDirty = false;
}

function calculWorldMatrix2D() {
  // Avoid as much function call as possible
  if (this._localMatDirty & LocalDirtyFlag.TRSS) {
    this._updateLocalMatrix();
  } // Assume parent world matrix is correct


  var parent = this._parent;

  if (parent) {
    this._mulMat(this._worldMatrix, parent._worldMatrix, this._matrix);
  } else {
    _valueTypes.Mat4.copy(this._worldMatrix, this._matrix);
  }

  this._worldMatDirty = false;
}

function mulMat2D(out, a, b) {
  var am = a.m,
      bm = b.m,
      outm = out.m;
  var aa = am[0],
      ab = am[1],
      ac = am[4],
      ad = am[5],
      atx = am[12],
      aty = am[13];
  var ba = bm[0],
      bb = bm[1],
      bc = bm[4],
      bd = bm[5],
      btx = bm[12],
      bty = bm[13];

  if (ab !== 0 || ac !== 0) {
    outm[0] = ba * aa + bb * ac;
    outm[1] = ba * ab + bb * ad;
    outm[4] = bc * aa + bd * ac;
    outm[5] = bc * ab + bd * ad;
    outm[12] = aa * btx + ac * bty + atx;
    outm[13] = ab * btx + ad * bty + aty;
  } else {
    outm[0] = ba * aa;
    outm[1] = bb * ad;
    outm[4] = bc * aa;
    outm[5] = bd * ad;
    outm[12] = aa * btx + atx;
    outm[13] = ad * bty + aty;
  }
}

var mulMat3D = _valueTypes.Mat4.mul;
/**
 * !#en
 * Class of all entities in Cocos Creator scenes.<br/>
 * For events supported by Node, please refer to {{#crossLink "Node.EventType"}}{{/crossLink}}
 * !#zh
 * Cocos Creator 场景中的所有节点类。<br/>
 * 支持的节点事件，请参阅 {{#crossLink "Node.EventType"}}{{/crossLink}}。
 * @class Node
 * @extends _BaseNode
 */

var NodeDefines = {
  name: 'cc.Node',
  "extends": BaseNode,
  properties: {
    // SERIALIZABLE
    _opacity: 255,
    _color: cc.Color.WHITE,
    _contentSize: cc.Size,
    _anchorPoint: cc.v2(0.5, 0.5),
    _position: undefined,
    _scale: undefined,
    _trs: null,
    _eulerAngles: cc.Vec3,
    _skewX: 0.0,
    _skewY: 0.0,
    _zIndex: {
      "default": undefined,
      type: cc.Integer
    },
    _localZOrder: {
      "default": 0,
      serializable: false
    },
    _is3DNode: false,
    // internal properties

    /**
     * !#en
     * Group index of node.<br/>
     * Which Group this node belongs to will resolve that this node's collision components can collide with which other collision componentns.<br/>
     * !#zh
     * 节点的分组索引。<br/>
     * 节点的分组将关系到节点的碰撞组件可以与哪些碰撞组件相碰撞。<br/>
     * @property groupIndex
     * @type {Integer}
     * @default 0
     */
    _groupIndex: {
      "default": 0,
      formerlySerializedAs: 'groupIndex'
    },
    groupIndex: {
      get: function get() {
        return this._groupIndex;
      },
      set: function set(value) {
        this._groupIndex = value;

        _updateCullingMask(this);

        this.emit(EventType.GROUP_CHANGED, this);
      }
    },

    /**
     * !#en
     * Group of node.<br/>
     * Which Group this node belongs to will resolve that this node's collision components can collide with which other collision componentns.<br/>
     * !#zh
     * 节点的分组。<br/>
     * 节点的分组将关系到节点的碰撞组件可以与哪些碰撞组件相碰撞。<br/>
     * @property group
     * @type {String}
     */
    group: {
      get: function get() {
        return cc.game.groupList[this.groupIndex] || '';
      },
      set: function set(value) {
        // update the groupIndex
        this.groupIndex = cc.game.groupList.indexOf(value);
      }
    },
    //properties moved from base node begin

    /**
     * !#en The position (x, y) of the node in its parent's coordinates.
     * !#zh 节点在父节点坐标系中的位置（x, y）。
     * @property {Vec3} position
     * @example
     * cc.log("Node Position: " + node.position);
     */

    /**
     * !#en x axis position of node.
     * !#zh 节点 X 轴坐标。
     * @property x
     * @type {Number}
     * @example
     * node.x = 100;
     * cc.log("Node Position X: " + node.x);
     */
    x: {
      get: function get() {
        return this._trs[0];
      },
      set: function set(value) {
        var trs = this._trs;

        if (value !== trs[0]) {
          if (!CC_EDITOR || isFinite(value)) {
            var oldValue;

            if (CC_EDITOR) {
              oldValue = trs[0];
            }

            trs[0] = value;
            this.setLocalDirty(LocalDirtyFlag.ALL_POSITION); // fast check event

            if (this._eventMask & POSITION_ON) {
              // send event
              if (CC_EDITOR) {
                this.emit(EventType.POSITION_CHANGED, new cc.Vec3(oldValue, trs[1], trs[2]));
              } else {
                this.emit(EventType.POSITION_CHANGED);
              }
            }
          } else {
            cc.error(ERR_INVALID_NUMBER, 'new x');
          }
        }
      }
    },

    /**
     * !#en y axis position of node.
     * !#zh 节点 Y 轴坐标。
     * @property y
     * @type {Number}
     * @example
     * node.y = 100;
     * cc.log("Node Position Y: " + node.y);
     */
    y: {
      get: function get() {
        return this._trs[1];
      },
      set: function set(value) {
        var trs = this._trs;

        if (value !== trs[1]) {
          if (!CC_EDITOR || isFinite(value)) {
            var oldValue;

            if (CC_EDITOR) {
              oldValue = trs[1];
            }

            trs[1] = value;
            this.setLocalDirty(LocalDirtyFlag.ALL_POSITION); // fast check event

            if (this._eventMask & POSITION_ON) {
              // send event
              if (CC_EDITOR) {
                this.emit(EventType.POSITION_CHANGED, new cc.Vec3(trs[0], oldValue, trs[2]));
              } else {
                this.emit(EventType.POSITION_CHANGED);
              }
            }
          } else {
            cc.error(ERR_INVALID_NUMBER, 'new y');
          }
        }
      }
    },

    /**
     * !#en z axis position of node.
     * !#zh 节点 Z 轴坐标。
     * @property z
     * @type {Number}
     */
    z: {
      get: function get() {
        return this._trs[2];
      },
      set: function set(value) {
        var trs = this._trs;

        if (value !== trs[2]) {
          if (!CC_EDITOR || isFinite(value)) {
            trs[2] = value;
            this.setLocalDirty(LocalDirtyFlag.ALL_POSITION);
            !CC_NATIVERENDERER && (this._renderFlag |= RenderFlow.FLAG_WORLD_TRANSFORM); // fast check event

            if (this._eventMask & POSITION_ON) {
              this.emit(EventType.POSITION_CHANGED);
            }
          } else {
            cc.error(ERR_INVALID_NUMBER, 'new z');
          }
        }
      }
    },

    /**
     * !#en Rotation of node.
     * !#zh 该节点旋转角度。
     * @property rotation
     * @type {Number}
     * @deprecated since v2.1
     * @example
     * node.rotation = 90;
     * cc.log("Node Rotation: " + node.rotation);
     */
    rotation: {
      get: function get() {
        if (CC_DEBUG) {
          cc.warn("`cc.Node.rotation` is deprecated since v2.1.0, please use `-angle` instead. (`this.node.rotation` -> `-this.node.angle`)");
        }

        return -this.angle;
      },
      set: function set(value) {
        if (CC_DEBUG) {
          cc.warn("`cc.Node.rotation` is deprecated since v2.1.0, please set `-angle` instead. (`this.node.rotation = x` -> `this.node.angle = -x`)");
        }

        this.angle = -value;
      }
    },

    /**
     * !#en
     * Angle of node, the positive value is anti-clockwise direction.
     * !#zh
     * 该节点的旋转角度，正值为逆时针方向。
     * @property angle
     * @type {Number}
     */
    angle: {
      get: function get() {
        return this._eulerAngles.z;
      },
      set: function set(value) {
        _valueTypes.Vec3.set(this._eulerAngles, 0, 0, value);

        _valueTypes.Trs.fromAngleZ(this._trs, value);

        this.setLocalDirty(LocalDirtyFlag.ALL_ROTATION);

        if (this._eventMask & ROTATION_ON) {
          this.emit(EventType.ROTATION_CHANGED);
        }
      }
    },

    /**
     * !#en The rotation as Euler angles in degrees, used in 3D node.
     * !#zh 该节点的欧拉角度，用于 3D 节点。
     * @property eulerAngles
     * @type {Vec3}
     * @example
     * node.is3DNode = true;
     * node.eulerAngles = cc.v3(45, 45, 45);
     * cc.log("Node eulerAngles (X, Y, Z): " + node.eulerAngles.toString());
     */

    /**
     * !#en Rotation on x axis.
     * !#zh 该节点 X 轴旋转角度。
     * @property rotationX
     * @type {Number}
     * @deprecated since v2.1
     * @example
     * node.is3DNode = true;
     * node.eulerAngles = cc.v3(45, 0, 0);
     * cc.log("Node eulerAngles X: " + node.eulerAngles.x);
     */
    rotationX: {
      get: function get() {
        if (CC_DEBUG) {
          cc.warn("`cc.Node.rotationX` is deprecated since v2.1.0, please use `eulerAngles.x` instead. (`this.node.rotationX` -> `this.node.eulerAngles.x`)");
        }

        return this._eulerAngles.x;
      },
      set: function set(value) {
        if (CC_DEBUG) {
          cc.warn("`cc.Node.rotationX` is deprecated since v2.1.0, please set `eulerAngles` instead. (`this.node.rotationX = x` -> `this.node.is3DNode = true; this.node.eulerAngles = cc.v3(x, 0, 0)`");
        }

        if (this._eulerAngles.x !== value) {
          this._eulerAngles.x = value; // Update quaternion from rotation

          if (this._eulerAngles.x === this._eulerAngles.y) {
            _valueTypes.Trs.fromAngleZ(this._trs, -value);
          } else {
            _valueTypes.Trs.fromEulerNumber(this._trs, value, this._eulerAngles.y, 0);
          }

          this.setLocalDirty(LocalDirtyFlag.ALL_ROTATION);

          if (this._eventMask & ROTATION_ON) {
            this.emit(EventType.ROTATION_CHANGED);
          }
        }
      }
    },

    /**
     * !#en Rotation on y axis.
     * !#zh 该节点 Y 轴旋转角度。
     * @property rotationY
     * @type {Number}
     * @deprecated since v2.1
     * @example
     * node.is3DNode = true;
     * node.eulerAngles = cc.v3(0, 45, 0);
     * cc.log("Node eulerAngles Y: " + node.eulerAngles.y);
     */
    rotationY: {
      get: function get() {
        if (CC_DEBUG) {
          cc.warn("`cc.Node.rotationY` is deprecated since v2.1.0, please use `eulerAngles.y` instead. (`this.node.rotationY` -> `this.node.eulerAngles.y`)");
        }

        return this._eulerAngles.y;
      },
      set: function set(value) {
        if (CC_DEBUG) {
          cc.warn("`cc.Node.rotationY` is deprecated since v2.1.0, please set `eulerAngles` instead. (`this.node.rotationY = y` -> `this.node.is3DNode = true; this.node.eulerAngles = cc.v3(0, y, 0)`");
        }

        if (this._eulerAngles.y !== value) {
          this._eulerAngles.y = value; // Update quaternion from rotation

          if (this._eulerAngles.x === this._eulerAngles.y) {
            _valueTypes.Trs.fromAngleZ(this._trs, -value);
          } else {
            _valueTypes.Trs.fromEulerNumber(this._trs, this._eulerAngles.x, value, 0);
          }

          this.setLocalDirty(LocalDirtyFlag.ALL_ROTATION);

          if (this._eventMask & ROTATION_ON) {
            this.emit(EventType.ROTATION_CHANGED);
          }
        }
      }
    },
    eulerAngles: {
      get: function get() {
        if (CC_EDITOR) {
          return this._eulerAngles;
        } else {
          return _valueTypes.Trs.toEuler(this._eulerAngles, this._trs);
        }
      },
      set: function set(v) {
        if (CC_EDITOR) {
          this._eulerAngles.set(v);
        }

        _valueTypes.Trs.fromEuler(this._trs, v);

        this.setLocalDirty(LocalDirtyFlag.ALL_ROTATION);
        !CC_NATIVERENDERER && (this._renderFlag |= RenderFlow.FLAG_TRANSFORM);
      }
    },
    // This property is used for Mesh Skeleton Animation
    // Should be removed when node.rotation upgrade to quaternion value
    quat: {
      get: function get() {
        var trs = this._trs;
        return new _valueTypes.Quat(trs[3], trs[4], trs[5], trs[6]);
      },
      set: function set(v) {
        this.setRotation(v);
      }
    },

    /**
     * !#en The local scale relative to the parent.
     * !#zh 节点相对父节点的缩放。
     * @property scale
     * @type {Number}
     * @example
     * node.scale = 1;
     */
    scale: {
      get: function get() {
        return this._trs[7];
      },
      set: function set(v) {
        this.setScale(v);
      }
    },

    /**
     * !#en Scale on x axis.
     * !#zh 节点 X 轴缩放。
     * @property scaleX
     * @type {Number}
     * @example
     * node.scaleX = 0.5;
     * cc.log("Node Scale X: " + node.scaleX);
     */
    scaleX: {
      get: function get() {
        return this._trs[7];
      },
      set: function set(value) {
        if (this._trs[7] !== value) {
          this._trs[7] = value;
          this.setLocalDirty(LocalDirtyFlag.ALL_SCALE);

          if (this._eventMask & SCALE_ON) {
            this.emit(EventType.SCALE_CHANGED);
          }
        }
      }
    },

    /**
     * !#en Scale on y axis.
     * !#zh 节点 Y 轴缩放。
     * @property scaleY
     * @type {Number}
     * @example
     * node.scaleY = 0.5;
     * cc.log("Node Scale Y: " + node.scaleY);
     */
    scaleY: {
      get: function get() {
        return this._trs[8];
      },
      set: function set(value) {
        if (this._trs[8] !== value) {
          this._trs[8] = value;
          this.setLocalDirty(LocalDirtyFlag.ALL_SCALE);

          if (this._eventMask & SCALE_ON) {
            this.emit(EventType.SCALE_CHANGED);
          }
        }
      }
    },

    /**
     * !#en Scale on z axis.
     * !#zh 节点 Z 轴缩放。
     * @property scaleZ
     * @type {Number}
     */
    scaleZ: {
      get: function get() {
        return this._trs[9];
      },
      set: function set(value) {
        if (this._trs[9] !== value) {
          this._trs[9] = value;
          this.setLocalDirty(LocalDirtyFlag.ALL_SCALE);
          !CC_NATIVERENDERER && (this._renderFlag |= RenderFlow.FLAG_TRANSFORM);

          if (this._eventMask & SCALE_ON) {
            this.emit(EventType.SCALE_CHANGED);
          }
        }
      }
    },

    /**
     * !#en Skew x
     * !#zh 该节点 X 轴倾斜角度。
     * @property skewX
     * @type {Number}
     * @example
     * node.skewX = 0;
     * cc.log("Node SkewX: " + node.skewX);
     * @deprecated since v2.2.1
     */
    skewX: {
      get: function get() {
        return this._skewX;
      },
      set: function set(value) {
        _skewWarn(value, this);

        this._skewX = value;
        this.setLocalDirty(LocalDirtyFlag.SKEW);

        if (CC_JSB && CC_NATIVERENDERER) {
          this._proxy.updateSkew();
        }
      }
    },

    /**
     * !#en Skew y
     * !#zh 该节点 Y 轴倾斜角度。
     * @property skewY
     * @type {Number}
     * @example
     * node.skewY = 0;
     * cc.log("Node SkewY: " + node.skewY);
     * @deprecated since v2.2.1
     */
    skewY: {
      get: function get() {
        return this._skewY;
      },
      set: function set(value) {
        _skewWarn(value, this);

        this._skewY = value;
        this.setLocalDirty(LocalDirtyFlag.SKEW);

        if (CC_JSB && CC_NATIVERENDERER) {
          this._proxy.updateSkew();
        }
      }
    },

    /**
     * !#en Opacity of node, default value is 255.
     * !#zh 节点透明度，默认值为 255。
     * @property opacity
     * @type {Number}
     * @example
     * node.opacity = 255;
     */
    opacity: {
      get: function get() {
        return this._opacity;
      },
      set: function set(value) {
        value = cc.misc.clampf(value, 0, 255);

        if (this._opacity !== value) {
          this._opacity = value;

          if (CC_JSB && CC_NATIVERENDERER) {
            this._proxy.updateOpacity();
          }

          ;
          this._renderFlag |= RenderFlow.FLAG_OPACITY_COLOR;
        }
      },
      range: [0, 255]
    },

    /**
     * !#en Color of node, default value is white: (255, 255, 255).
     * !#zh 节点颜色。默认为白色，数值为：（255，255，255）。
     * @property color
     * @type {Color}
     * @example
     * node.color = new cc.Color(255, 255, 255);
     */
    color: {
      get: function get() {
        return this._color.clone();
      },
      set: function set(value) {
        if (!this._color.equals(value)) {
          this._color.set(value);

          if (CC_DEV && value.a !== 255) {
            cc.warnID(1626);
          }

          this._renderFlag |= RenderFlow.FLAG_COLOR;

          if (this._eventMask & COLOR_ON) {
            this.emit(EventType.COLOR_CHANGED, value);
          }
        }
      }
    },

    /**
     * !#en Anchor point's position on x axis.
     * !#zh 节点 X 轴锚点位置。
     * @property anchorX
     * @type {Number}
     * @example
     * node.anchorX = 0;
     */
    anchorX: {
      get: function get() {
        return this._anchorPoint.x;
      },
      set: function set(value) {
        var anchorPoint = this._anchorPoint;

        if (anchorPoint.x !== value) {
          anchorPoint.x = value;

          if (this._eventMask & ANCHOR_ON) {
            this.emit(EventType.ANCHOR_CHANGED);
          }
        }
      }
    },

    /**
     * !#en Anchor point's position on y axis.
     * !#zh 节点 Y 轴锚点位置。
     * @property anchorY
     * @type {Number}
     * @example
     * node.anchorY = 0;
     */
    anchorY: {
      get: function get() {
        return this._anchorPoint.y;
      },
      set: function set(value) {
        var anchorPoint = this._anchorPoint;

        if (anchorPoint.y !== value) {
          anchorPoint.y = value;

          if (this._eventMask & ANCHOR_ON) {
            this.emit(EventType.ANCHOR_CHANGED);
          }
        }
      }
    },

    /**
     * !#en Width of node.
     * !#zh 节点宽度。
     * @property width
     * @type {Number}
     * @example
     * node.width = 100;
     */
    width: {
      get: function get() {
        return this._contentSize.width;
      },
      set: function set(value) {
        if (value !== this._contentSize.width) {
          if (CC_EDITOR) {
            var clone = cc.size(this._contentSize.width, this._contentSize.height);
          }

          this._contentSize.width = value;

          if (this._eventMask & SIZE_ON) {
            if (CC_EDITOR) {
              this.emit(EventType.SIZE_CHANGED, clone);
            } else {
              this.emit(EventType.SIZE_CHANGED);
            }
          }
        }
      }
    },

    /**
     * !#en Height of node.
     * !#zh 节点高度。
     * @property height
     * @type {Number}
     * @example
     * node.height = 100;
     */
    height: {
      get: function get() {
        return this._contentSize.height;
      },
      set: function set(value) {
        if (value !== this._contentSize.height) {
          if (CC_EDITOR) {
            var clone = cc.size(this._contentSize.width, this._contentSize.height);
          }

          this._contentSize.height = value;

          if (this._eventMask & SIZE_ON) {
            if (CC_EDITOR) {
              this.emit(EventType.SIZE_CHANGED, clone);
            } else {
              this.emit(EventType.SIZE_CHANGED);
            }
          }
        }
      }
    },

    /**
     * !#en zIndex is the 'key' used to sort the node relative to its siblings.<br/>
     * The value of zIndex should be in the range between cc.macro.MIN_ZINDEX and cc.macro.MAX_ZINDEX.<br/>
     * The Node's parent will sort all its children based on the zIndex value and the arrival order.<br/>
     * Nodes with greater zIndex will be sorted after nodes with smaller zIndex.<br/>
     * If two nodes have the same zIndex, then the node that was added first to the children's array will be in front of the other node in the array.<br/>
     * Node's order in children list will affect its rendering order. Parent is always rendering before all children.
     * !#zh zIndex 是用来对节点进行排序的关键属性，它决定一个节点在兄弟节点之间的位置。<br/>
     * zIndex 的取值应该介于 cc.macro.MIN_ZINDEX 和 cc.macro.MAX_ZINDEX 之间
     * 父节点主要根据节点的 zIndex 和添加次序来排序，拥有更高 zIndex 的节点将被排在后面，如果两个节点的 zIndex 一致，先添加的节点会稳定排在另一个节点之前。<br/>
     * 节点在 children 中的顺序决定了其渲染顺序。父节点永远在所有子节点之前被渲染
     * @property zIndex
     * @type {Number}
     * @example
     * node.zIndex = 1;
     * cc.log("Node zIndex: " + node.zIndex);
     */
    zIndex: {
      get: function get() {
        return this._localZOrder >> 16;
      },
      set: function set(value) {
        if (value > macro.MAX_ZINDEX) {
          cc.warnID(1636);
          value = macro.MAX_ZINDEX;
        } else if (value < macro.MIN_ZINDEX) {
          cc.warnID(1637);
          value = macro.MIN_ZINDEX;
        }

        if (this.zIndex !== value) {
          this._localZOrder = this._localZOrder & 0x0000ffff | value << 16;
          this.emit(EventType.SIBLING_ORDER_CHANGED);

          this._onSiblingIndexChanged();
        }
      }
    },

    /**
     * !en
     * Switch 2D/3D node. The 2D nodes will run faster.
     * !zh
     * 切换 2D/3D 节点，2D 节点会有更高的运行效率
     * @property {Boolean} is3DNode
     * @default false
    */
    is3DNode: {
      get: function get() {
        return this._is3DNode;
      },
      set: function set(v) {
        this._is3DNode = v;

        this._update3DFunction();
      }
    }
  },

  /**
   * @method constructor
   * @param {String} [name]
   */
  ctor: function ctor() {
    this._reorderChildDirty = false; // cache component

    this._widget = null; // fast render component access

    this._renderComponent = null; // Event listeners

    this._capturingListeners = null;
    this._bubblingListeners = null; // Touch event listener

    this._touchListener = null; // Mouse event listener

    this._mouseListener = null;

    this._initDataFromPool();

    this._eventMask = 0;
    this._cullingMask = 1;
    this._childArrivalOrder = 1; // Proxy

    if (CC_JSB && CC_NATIVERENDERER) {
      this._proxy = new renderer.NodeProxy(this._spaceInfo.unitID, this._spaceInfo.index, this._id, this._name);

      this._proxy.init(this);
    } // should reset _renderFlag for both web and native


    this._renderFlag = RenderFlow.FLAG_TRANSFORM | RenderFlow.FLAG_OPACITY_COLOR;
  },
  statics: {
    EventType: EventType,
    _LocalDirtyFlag: LocalDirtyFlag,
    // is node but not scene
    isNode: function isNode(obj) {
      return obj instanceof Node && (obj.constructor === Node || !(obj instanceof cc.Scene));
    },
    BuiltinGroupIndex: BuiltinGroupIndex
  },
  // OVERRIDES
  _onSiblingIndexChanged: function _onSiblingIndexChanged() {
    // update rendering scene graph, sort them by arrivalOrder
    if (this._parent) {
      this._parent._delaySort();
    }
  },
  _onPreDestroy: function _onPreDestroy() {
    var destroyByParent = this._onPreDestroyBase(); // Actions


    if (ActionManagerExist) {
      cc.director.getActionManager().removeAllActionsFromTarget(this);
    } // Remove Node.currentHovered


    if (_currentHovered === this) {
      _currentHovered = null;
    } // Remove all event listeners if necessary


    if (this._touchListener || this._mouseListener) {
      eventManager.removeListeners(this);

      if (this._touchListener) {
        this._touchListener.owner = null;
        this._touchListener.mask = null;
        this._touchListener = null;
      }

      if (this._mouseListener) {
        this._mouseListener.owner = null;
        this._mouseListener.mask = null;
        this._mouseListener = null;
      }
    }

    if (CC_JSB && CC_NATIVERENDERER) {
      this._proxy.destroy();

      this._proxy = null;
    }

    this._backDataIntoPool();

    if (this._reorderChildDirty) {
      cc.director.__fastOff(cc.Director.EVENT_AFTER_UPDATE, this.sortAllChildren, this);
    }

    if (!destroyByParent) {
      // simulate some destruct logic to make undo system work correctly
      if (CC_EDITOR) {
        // ensure this node can reattach to scene by undo system
        this._parent = null;
      }
    }
  },
  _onPostActivated: function _onPostActivated(active) {
    var actionManager = ActionManagerExist ? cc.director.getActionManager() : null;

    if (active) {
      // Refresh transform
      this._renderFlag |= RenderFlow.FLAG_WORLD_TRANSFORM; // ActionManager & EventManager

      actionManager && actionManager.resumeTarget(this);
      eventManager.resumeTarget(this); // Search Mask in parent

      this._checkListenerMask();
    } else {
      // deactivate
      actionManager && actionManager.pauseTarget(this);
      eventManager.pauseTarget(this);
    }
  },
  _onHierarchyChanged: function _onHierarchyChanged(oldParent) {
    this._updateOrderOfArrival(); // Fixed a bug where children and parent node groups were forced to synchronize, instead of only synchronizing `_cullingMask` value


    _updateCullingMask(this);

    if (this._parent) {
      this._parent._delaySort();
    }

    this._renderFlag |= RenderFlow.FLAG_WORLD_TRANSFORM;

    this._onHierarchyChangedBase(oldParent);

    if (cc._widgetManager) {
      cc._widgetManager._nodesOrderDirty = true;
    }

    if (oldParent && this._activeInHierarchy) {
      //TODO: It may be necessary to update the listener mask of all child nodes.
      this._checkListenerMask();
    } // Node proxy


    if (CC_JSB && CC_NATIVERENDERER) {
      this._proxy.updateParent();
    }
  },
  // INTERNAL
  _update3DFunction: function _update3DFunction() {
    if (this._is3DNode) {
      this._updateLocalMatrix = updateLocalMatrix3D;
      this._calculWorldMatrix = calculWorldMatrix3D;
      this._mulMat = mulMat3D;
    } else {
      this._updateLocalMatrix = updateLocalMatrix2D;
      this._calculWorldMatrix = calculWorldMatrix2D;
      this._mulMat = mulMat2D;
    }

    if (this._renderComponent && this._renderComponent._on3DNodeChanged) {
      this._renderComponent._on3DNodeChanged();
    }

    this._renderFlag |= RenderFlow.FLAG_TRANSFORM;
    this._localMatDirty = LocalDirtyFlag.ALL;

    if (CC_JSB && CC_NATIVERENDERER) {
      this._proxy.update3DNode();
    }
  },
  _initDataFromPool: function _initDataFromPool() {
    if (!this._spaceInfo) {
      if (CC_EDITOR || CC_TEST) {
        this._spaceInfo = {
          trs: new Float64Array(10),
          localMat: new Float64Array(16),
          worldMat: new Float64Array(16)
        };
      } else {
        this._spaceInfo = nodeMemPool.pop();
      }
    }

    var spaceInfo = this._spaceInfo;
    this._matrix = cc.mat4(spaceInfo.localMat);

    _valueTypes.Mat4.identity(this._matrix);

    this._worldMatrix = cc.mat4(spaceInfo.worldMat);

    _valueTypes.Mat4.identity(this._worldMatrix);

    this._localMatDirty = LocalDirtyFlag.ALL;
    this._worldMatDirty = true;
    var trs = this._trs = this._spaceInfo.trs;
    trs[0] = 0; // position.x

    trs[1] = 0; // position.y

    trs[2] = 0; // position.z

    trs[3] = 0; // rotation.x

    trs[4] = 0; // rotation.y

    trs[5] = 0; // rotation.z

    trs[6] = 1; // rotation.w

    trs[7] = 1; // scale.x

    trs[8] = 1; // scale.y

    trs[9] = 1; // scale.z
  },
  _backDataIntoPool: function _backDataIntoPool() {
    if (!(CC_EDITOR || CC_TEST)) {
      // push back to pool
      nodeMemPool.push(this._spaceInfo);
      this._matrix = null;
      this._worldMatrix = null;
      this._trs = null;
      this._spaceInfo = null;
    }
  },
  _toEuler: function _toEuler() {
    if (this.is3DNode) {
      _valueTypes.Trs.toEuler(this._eulerAngles, this._trs);
    } else {
      var z = Math.asin(this._trs[5]) / ONE_DEGREE * 2;

      _valueTypes.Vec3.set(this._eulerAngles, 0, 0, z);
    }
  },
  _fromEuler: function _fromEuler() {
    if (this.is3DNode) {
      _valueTypes.Trs.fromEuler(this._trs, this._eulerAngles);
    } else {
      _valueTypes.Trs.fromAngleZ(this._trs, this._eulerAngles.z);
    }
  },
  _upgrade_1x_to_2x: function _upgrade_1x_to_2x() {
    if (this._is3DNode) {
      this._update3DFunction();
    }

    var trs = this._trs;

    if (trs) {
      var desTrs = trs;
      trs = this._trs = this._spaceInfo.trs; // just adapt to old trs

      if (desTrs.length === 11) {
        trs.set(desTrs.subarray(1));
      } else {
        trs.set(desTrs);
      }
    } else {
      trs = this._trs = this._spaceInfo.trs;
    }

    if (this._zIndex !== undefined) {
      this._localZOrder = this._zIndex << 16;
      this._zIndex = undefined;
    }

    if (CC_EDITOR) {
      if (this._skewX !== 0 || this._skewY !== 0) {
        var NodeUtils = Editor.require('scene://utils/node');

        cc.warn("`cc.Node.skewX/Y` is deprecated since v2.2.1, please use 3D node instead.", "Node: " + NodeUtils.getNodePath(this) + ".");
      }
    }

    this._fromEuler();

    if (this._localZOrder !== 0) {
      this._zIndex = (this._localZOrder & 0xffff0000) >> 16;
    } // Upgrade from 2.0.0 preview 4 & earlier versions
    // TODO: Remove after final version


    if (this._color.a < 255 && this._opacity === 255) {
      this._opacity = this._color.a;
      this._color.a = 255;
    }

    if (CC_JSB && CC_NATIVERENDERER) {
      this._renderFlag |= RenderFlow.FLAG_TRANSFORM | RenderFlow.FLAG_OPACITY_COLOR;
    }
  },

  /*
   * The initializer for Node which will be called before all components onLoad
   */
  _onBatchCreated: function _onBatchCreated() {
    var prefabInfo = this._prefab;

    if (prefabInfo && prefabInfo.sync && prefabInfo.root === this) {
      if (CC_DEV) {
        // TODO - remove all usage of _synced
        cc.assert(!prefabInfo._synced, 'prefab should not synced');
      }

      PrefabHelper.syncWithPrefab(this);
    }

    this._upgrade_1x_to_2x();

    this._updateOrderOfArrival(); // Fixed a bug where children and parent node groups were forced to synchronize, instead of only synchronizing `_cullingMask` value


    this._cullingMask = 1 << _getActualGroupIndex(this);

    if (CC_JSB && CC_NATIVERENDERER) {
      this._proxy && this._proxy.updateCullingMask();
    }

    ;

    if (!this._activeInHierarchy) {
      // deactivate ActionManager and EventManager by default
      if (ActionManagerExist) {
        cc.director.getActionManager().pauseTarget(this);
      }

      eventManager.pauseTarget(this);
    }

    var children = this._children;

    for (var i = 0, len = children.length; i < len; i++) {
      children[i]._onBatchCreated();
    }

    if (children.length > 0) {
      this._renderFlag |= RenderFlow.FLAG_CHILDREN;
    }

    if (CC_JSB && CC_NATIVERENDERER) {
      this._proxy.initNative();
    }
  },
  // the same as _onBatchCreated but untouch prefab
  _onBatchRestored: function _onBatchRestored() {
    this._upgrade_1x_to_2x(); // Fixed a bug where children and parent node groups were forced to synchronize, instead of only synchronizing `_cullingMask` value


    this._cullingMask = 1 << _getActualGroupIndex(this);

    if (CC_JSB && CC_NATIVERENDERER) {
      this._proxy && this._proxy.updateCullingMask();
    }

    ;

    if (!this._activeInHierarchy) {
      // deactivate ActionManager and EventManager by default
      // ActionManager may not be inited in the editor worker.
      var manager = cc.director.getActionManager();
      manager && manager.pauseTarget(this);
      eventManager.pauseTarget(this);
    }

    var children = this._children;

    for (var i = 0, len = children.length; i < len; i++) {
      children[i]._onBatchRestored();
    }

    if (children.length > 0) {
      this._renderFlag |= RenderFlow.FLAG_CHILDREN;
    }

    if (CC_JSB && CC_NATIVERENDERER) {
      this._proxy.initNative();
    }
  },
  // EVENT TARGET
  _checkListenerMask: function _checkListenerMask() {
    // Because Mask may be nested, need to find all the Mask components in the parent node. 
    // The click area must satisfy all Masks to trigger the click.
    if (this._touchListener) {
      var mask = this._touchListener.mask = _searchComponentsInParent(this, cc.Mask);

      if (this._mouseListener) {
        this._mouseListener.mask = mask;
      }
    } else if (this._mouseListener) {
      this._mouseListener.mask = _searchComponentsInParent(this, cc.Mask);
    }
  },
  _checknSetupSysEvent: function _checknSetupSysEvent(type) {
    var newAdded = false;
    var forDispatch = false;

    if (_touchEvents.indexOf(type) !== -1) {
      if (!this._touchListener) {
        this._touchListener = cc.EventListener.create({
          event: cc.EventListener.TOUCH_ONE_BY_ONE,
          swallowTouches: true,
          owner: this,
          mask: _searchComponentsInParent(this, cc.Mask),
          onTouchBegan: _touchStartHandler,
          onTouchMoved: _touchMoveHandler,
          onTouchEnded: _touchEndHandler,
          onTouchCancelled: _touchCancelHandler
        });
        eventManager.addListener(this._touchListener, this);
        newAdded = true;
      }

      forDispatch = true;
    } else if (_mouseEvents.indexOf(type) !== -1) {
      if (!this._mouseListener) {
        this._mouseListener = cc.EventListener.create({
          event: cc.EventListener.MOUSE,
          _previousIn: false,
          owner: this,
          mask: _searchComponentsInParent(this, cc.Mask),
          onMouseDown: _mouseDownHandler,
          onMouseMove: _mouseMoveHandler,
          onMouseUp: _mouseUpHandler,
          onMouseScroll: _mouseWheelHandler
        });
        eventManager.addListener(this._mouseListener, this);
        newAdded = true;
      }

      forDispatch = true;
    }

    if (newAdded && !this._activeInHierarchy) {
      cc.director.getScheduler().schedule(function () {
        if (!this._activeInHierarchy) {
          eventManager.pauseTarget(this);
        }
      }, this, 0, 0, 0, false);
    }

    return forDispatch;
  },

  /**
   * !#en
   * Register a callback of a specific event type on Node.<br/>
   * Use this method to register touch or mouse event permit propagation based on scene graph,<br/>
   * These kinds of event are triggered with dispatchEvent, the dispatch process has three steps:<br/>
   * 1. Capturing phase: dispatch in capture targets (`_getCapturingTargets`), e.g. parents in node tree, from root to the real target<br/>
   * 2. At target phase: dispatch to the listeners of the real target<br/>
   * 3. Bubbling phase: dispatch in bubble targets (`_getBubblingTargets`), e.g. parents in node tree, from the real target to root<br/>
   * In any moment of the dispatching process, it can be stopped via `event.stopPropagation()` or `event.stopPropagationImmidiate()`.<br/>
   * It's the recommended way to register touch/mouse event for Node,<br/>
   * please do not use cc.eventManager directly for Node.<br/>
   * You can also register custom event and use `emit` to trigger custom event on Node.<br/>
   * For such events, there won't be capturing and bubbling phase, your event will be dispatched directly to its listeners registered on the same node.<br/>
   * You can also pass event callback parameters with `emit` by passing parameters after `type`.
   * !#zh
   * 在节点上注册指定类型的回调函数，也可以设置 target 用于绑定响应函数的 this 对象。<br/>
   * 鼠标或触摸事件会被系统调用 dispatchEvent 方法触发，触发的过程包含三个阶段：<br/>
   * 1. 捕获阶段：派发事件给捕获目标（通过 `_getCapturingTargets` 获取），比如，节点树中注册了捕获阶段的父节点，从根节点开始派发直到目标节点。<br/>
   * 2. 目标阶段：派发给目标节点的监听器。<br/>
   * 3. 冒泡阶段：派发事件给冒泡目标（通过 `_getBubblingTargets` 获取），比如，节点树中注册了冒泡阶段的父节点，从目标节点开始派发直到根节点。<br/>
   * 同时您可以将事件派发到父节点或者通过调用 stopPropagation 拦截它。<br/>
   * 推荐使用这种方式来监听节点上的触摸或鼠标事件，请不要在节点上直接使用 cc.eventManager。<br/>
   * 你也可以注册自定义事件到节点上，并通过 emit 方法触发此类事件，对于这类事件，不会发生捕获冒泡阶段，只会直接派发给注册在该节点上的监听器<br/>
   * 你可以通过在 emit 方法调用时在 type 之后传递额外的参数作为事件回调的参数列表
   * @method on
   * @param {String|Node.EventType} type - A string representing the event type to listen for.<br>See {{#crossLink "Node/EventTyupe/POSITION_CHANGED"}}Node Events{{/crossLink}} for all builtin events.
   * @param {Function} callback - The callback that will be invoked when the event is dispatched. The callback is ignored if it is a duplicate (the callbacks are unique).
   * @param {Event|any} [callback.event] event or first argument when emit
   * @param {any} [callback.arg2] arg2
   * @param {any} [callback.arg3] arg3
   * @param {any} [callback.arg4] arg4
   * @param {any} [callback.arg5] arg5
   * @param {Object} [target] - The target (this object) to invoke the callback, can be null
   * @param {Boolean} [useCapture=false] - When set to true, the listener will be triggered at capturing phase which is ahead of the final target emit, otherwise it will be triggered during bubbling phase.
   * @return {Function} - Just returns the incoming callback so you can save the anonymous function easier.
   * @typescript
   * on<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T
   * @example
   * this.node.on(cc.Node.EventType.TOUCH_START, this.memberFunction, this);  // if "this" is component and the "memberFunction" declared in CCClass.
   * node.on(cc.Node.EventType.TOUCH_START, callback, this);
   * node.on(cc.Node.EventType.TOUCH_MOVE, callback, this);
   * node.on(cc.Node.EventType.TOUCH_END, callback, this);
   * node.on(cc.Node.EventType.TOUCH_CANCEL, callback, this);
   * node.on(cc.Node.EventType.ANCHOR_CHANGED, callback);
   * node.on(cc.Node.EventType.COLOR_CHANGED, callback);
   */
  on: function on(type, callback, target, useCapture) {
    var forDispatch = this._checknSetupSysEvent(type);

    if (forDispatch) {
      return this._onDispatch(type, callback, target, useCapture);
    } else {
      switch (type) {
        case EventType.POSITION_CHANGED:
          this._eventMask |= POSITION_ON;
          break;

        case EventType.SCALE_CHANGED:
          this._eventMask |= SCALE_ON;
          break;

        case EventType.ROTATION_CHANGED:
          this._eventMask |= ROTATION_ON;
          break;

        case EventType.SIZE_CHANGED:
          this._eventMask |= SIZE_ON;
          break;

        case EventType.ANCHOR_CHANGED:
          this._eventMask |= ANCHOR_ON;
          break;

        case EventType.COLOR_CHANGED:
          this._eventMask |= COLOR_ON;
          break;
      }

      if (!this._bubblingListeners) {
        this._bubblingListeners = new EventTarget();
      }

      return this._bubblingListeners.on(type, callback, target);
    }
  },

  /**
   * !#en
   * Register an callback of a specific event type on the Node,
   * the callback will remove itself after the first time it is triggered.
   * !#zh
   * 注册节点的特定事件类型回调，回调会在第一时间被触发后删除自身。
   *
   * @method once
   * @param {String} type - A string representing the event type to listen for.
   * @param {Function} callback - The callback that will be invoked when the event is dispatched.
   *                              The callback is ignored if it is a duplicate (the callbacks are unique).
   * @param {Event|any} [callback.event] event or first argument when emit
   * @param {any} [callback.arg2] arg2
   * @param {any} [callback.arg3] arg3
   * @param {any} [callback.arg4] arg4
   * @param {any} [callback.arg5] arg5
   * @param {Object} [target] - The target (this object) to invoke the callback, can be null
   * @typescript
   * once<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T
   * @example
   * node.once(cc.Node.EventType.ANCHOR_CHANGED, callback);
   */
  once: function once(type, callback, target, useCapture) {
    var forDispatch = this._checknSetupSysEvent(type);

    var listeners = null;

    if (forDispatch && useCapture) {
      listeners = this._capturingListeners = this._capturingListeners || new EventTarget();
    } else {
      listeners = this._bubblingListeners = this._bubblingListeners || new EventTarget();
    }

    listeners.once(type, callback, target);
  },
  _onDispatch: function _onDispatch(type, callback, target, useCapture) {
    // Accept also patameters like: (type, callback, useCapture)
    if (typeof target === 'boolean') {
      useCapture = target;
      target = undefined;
    } else useCapture = !!useCapture;

    if (!callback) {
      cc.errorID(6800);
      return;
    }

    var listeners = null;

    if (useCapture) {
      listeners = this._capturingListeners = this._capturingListeners || new EventTarget();
    } else {
      listeners = this._bubblingListeners = this._bubblingListeners || new EventTarget();
    }

    if (!listeners.hasEventListener(type, callback, target)) {
      listeners.on(type, callback, target);

      if (target && target.__eventTargets) {
        target.__eventTargets.push(this);
      }
    }

    return callback;
  },

  /**
   * !#en
   * Removes the callback previously registered with the same type, callback, target and or useCapture.
   * This method is merely an alias to removeEventListener.
   * !#zh 删除之前与同类型，回调，目标或 useCapture 注册的回调。
   * @method off
   * @param {String} type - A string representing the event type being removed.
   * @param {Function} [callback] - The callback to remove.
   * @param {Object} [target] - The target (this object) to invoke the callback, if it's not given, only callback without target will be removed
   * @param {Boolean} [useCapture=false] - When set to true, the listener will be triggered at capturing phase which is ahead of the final target emit, otherwise it will be triggered during bubbling phase.
   * @example
   * this.node.off(cc.Node.EventType.TOUCH_START, this.memberFunction, this);
   * node.off(cc.Node.EventType.TOUCH_START, callback, this.node);
   * node.off(cc.Node.EventType.ANCHOR_CHANGED, callback, this);
   */
  off: function off(type, callback, target, useCapture) {
    var touchEvent = _touchEvents.indexOf(type) !== -1;
    var mouseEvent = !touchEvent && _mouseEvents.indexOf(type) !== -1;

    if (touchEvent || mouseEvent) {
      this._offDispatch(type, callback, target, useCapture);

      if (touchEvent) {
        if (this._touchListener && !_checkListeners(this, _touchEvents)) {
          eventManager.removeListener(this._touchListener);
          this._touchListener = null;
        }
      } else if (mouseEvent) {
        if (this._mouseListener && !_checkListeners(this, _mouseEvents)) {
          eventManager.removeListener(this._mouseListener);
          this._mouseListener = null;
        }
      }
    } else if (this._bubblingListeners) {
      this._bubblingListeners.off(type, callback, target);

      var hasListeners = this._bubblingListeners.hasEventListener(type); // All listener removed


      if (!hasListeners) {
        switch (type) {
          case EventType.POSITION_CHANGED:
            this._eventMask &= ~POSITION_ON;
            break;

          case EventType.SCALE_CHANGED:
            this._eventMask &= ~SCALE_ON;
            break;

          case EventType.ROTATION_CHANGED:
            this._eventMask &= ~ROTATION_ON;
            break;

          case EventType.SIZE_CHANGED:
            this._eventMask &= ~SIZE_ON;
            break;

          case EventType.ANCHOR_CHANGED:
            this._eventMask &= ~ANCHOR_ON;
            break;

          case EventType.COLOR_CHANGED:
            this._eventMask &= ~COLOR_ON;
            break;
        }
      }
    }
  },
  _offDispatch: function _offDispatch(type, callback, target, useCapture) {
    // Accept also patameters like: (type, callback, useCapture)
    if (typeof target === 'boolean') {
      useCapture = target;
      target = undefined;
    } else useCapture = !!useCapture;

    if (!callback) {
      this._capturingListeners && this._capturingListeners.removeAll(type);
      this._bubblingListeners && this._bubblingListeners.removeAll(type);
    } else {
      var listeners = useCapture ? this._capturingListeners : this._bubblingListeners;

      if (listeners) {
        listeners.off(type, callback, target);

        if (target && target.__eventTargets) {
          js.array.fastRemove(target.__eventTargets, this);
        }
      }
    }
  },

  /**
   * !#en Removes all callbacks previously registered with the same target.
   * !#zh 移除目标上的所有注册事件。
   * @method targetOff
   * @param {Object} target - The target to be searched for all related callbacks
   * @example
   * node.targetOff(target);
   */
  targetOff: function targetOff(target) {
    var listeners = this._bubblingListeners;

    if (listeners) {
      listeners.targetOff(target); // Check for event mask reset

      if (this._eventMask & POSITION_ON && !listeners.hasEventListener(EventType.POSITION_CHANGED)) {
        this._eventMask &= ~POSITION_ON;
      }

      if (this._eventMask & SCALE_ON && !listeners.hasEventListener(EventType.SCALE_CHANGED)) {
        this._eventMask &= ~SCALE_ON;
      }

      if (this._eventMask & ROTATION_ON && !listeners.hasEventListener(EventType.ROTATION_CHANGED)) {
        this._eventMask &= ~ROTATION_ON;
      }

      if (this._eventMask & SIZE_ON && !listeners.hasEventListener(EventType.SIZE_CHANGED)) {
        this._eventMask &= ~SIZE_ON;
      }

      if (this._eventMask & ANCHOR_ON && !listeners.hasEventListener(EventType.ANCHOR_CHANGED)) {
        this._eventMask &= ~ANCHOR_ON;
      }

      if (this._eventMask & COLOR_ON && !listeners.hasEventListener(EventType.COLOR_CHANGED)) {
        this._eventMask &= ~COLOR_ON;
      }
    }

    if (this._capturingListeners) {
      this._capturingListeners.targetOff(target);
    }

    if (target && target.__eventTargets) {
      js.array.fastRemove(target.__eventTargets, this);
    }

    if (this._touchListener && !_checkListeners(this, _touchEvents)) {
      eventManager.removeListener(this._touchListener);
      this._touchListener = null;
    }

    if (this._mouseListener && !_checkListeners(this, _mouseEvents)) {
      eventManager.removeListener(this._mouseListener);
      this._mouseListener = null;
    }
  },

  /**
   * !#en Checks whether the EventTarget object has any callback registered for a specific type of event.
   * !#zh 检查事件目标对象是否有为特定类型的事件注册的回调。
   * @method hasEventListener
   * @param {String} type - The type of event.
   * @return {Boolean} True if a callback of the specified type is registered; false otherwise.
   */
  hasEventListener: function hasEventListener(type) {
    var has = false;

    if (this._bubblingListeners) {
      has = this._bubblingListeners.hasEventListener(type);
    }

    if (!has && this._capturingListeners) {
      has = this._capturingListeners.hasEventListener(type);
    }

    return has;
  },

  /**
   * !#en
   * Trigger an event directly with the event name and necessary arguments.
   * !#zh
   * 通过事件名发送自定义事件
   *
   * @method emit
   * @param {String} type - event type
   * @param {*} [arg1] - First argument in callback
   * @param {*} [arg2] - Second argument in callback
   * @param {*} [arg3] - Third argument in callback
   * @param {*} [arg4] - Fourth argument in callback
   * @param {*} [arg5] - Fifth argument in callback
   * @example
   * 
   * eventTarget.emit('fire', event);
   * eventTarget.emit('fire', message, emitter);
   */
  emit: function emit(type, arg1, arg2, arg3, arg4, arg5) {
    if (this._bubblingListeners) {
      this._bubblingListeners.emit(type, arg1, arg2, arg3, arg4, arg5);
    }
  },

  /**
   * !#en
   * Dispatches an event into the event flow.
   * The event target is the EventTarget object upon which the dispatchEvent() method is called.
   * !#zh 分发事件到事件流中。
   *
   * @method dispatchEvent
   * @param {Event} event - The Event object that is dispatched into the event flow
   */
  dispatchEvent: function dispatchEvent(event) {
    _doDispatchEvent(this, event);

    _cachedArray.length = 0;
  },

  /**
   * !#en Pause node related system events registered with the current Node. Node system events includes touch and mouse events.
   * If recursive is set to true, then this API will pause the node system events for the node and all nodes in its sub node tree.
   * Reference: http://docs.cocos2d-x.org/editors_and_tools/creator-chapters/scripting/internal-events/
   * !#zh 暂停当前节点上注册的所有节点系统事件，节点系统事件包含触摸和鼠标事件。
   * 如果传递 recursive 为 true，那么这个 API 将暂停本节点和它的子树上所有节点的节点系统事件。
   * 参考：https://www.cocos.com/docs/creator/scripting/internal-events.html
   * @method pauseSystemEvents
   * @param {Boolean} recursive - Whether to pause node system events on the sub node tree.
   * @example
   * node.pauseSystemEvents(true);
   */
  pauseSystemEvents: function pauseSystemEvents(recursive) {
    eventManager.pauseTarget(this, recursive);
  },

  /**
   * !#en Resume node related system events registered with the current Node. Node system events includes touch and mouse events.
   * If recursive is set to true, then this API will resume the node system events for the node and all nodes in its sub node tree.
   * Reference: http://docs.cocos2d-x.org/editors_and_tools/creator-chapters/scripting/internal-events/
   * !#zh 恢复当前节点上注册的所有节点系统事件，节点系统事件包含触摸和鼠标事件。
   * 如果传递 recursive 为 true，那么这个 API 将恢复本节点和它的子树上所有节点的节点系统事件。
   * 参考：https://www.cocos.com/docs/creator/scripting/internal-events.html
   * @method resumeSystemEvents
   * @param {Boolean} recursive - Whether to resume node system events on the sub node tree.
   * @example
   * node.resumeSystemEvents(true);
   */
  resumeSystemEvents: function resumeSystemEvents(recursive) {
    eventManager.resumeTarget(this, recursive);
  },
  _hitTest: function _hitTest(point, listener) {
    var w = this._contentSize.width,
        h = this._contentSize.height,
        cameraPt = _htVec3a,
        testPt = _htVec3b;
    var camera = cc.Camera.findCamera(this);

    if (camera) {
      camera.getScreenToWorldPoint(point, cameraPt);
    } else {
      cameraPt.set(point);
    }

    this._updateWorldMatrix(); // If scale is 0, it can't be hit.


    if (!_valueTypes.Mat4.invert(_mat4_temp, this._worldMatrix)) {
      return false;
    }

    _valueTypes.Vec2.transformMat4(testPt, cameraPt, _mat4_temp);

    testPt.x += this._anchorPoint.x * w;
    testPt.y += this._anchorPoint.y * h;
    var hit = false;

    if (testPt.x >= 0 && testPt.y >= 0 && testPt.x <= w && testPt.y <= h) {
      hit = true;

      if (listener && listener.mask) {
        var mask = listener.mask;
        var parent = this;
        var length = mask ? mask.length : 0; // find mask parent, should hit test it

        for (var i = 0, j = 0; parent && j < length; ++i, parent = parent.parent) {
          var temp = mask[j];

          if (i === temp.index) {
            if (parent === temp.node) {
              var comp = parent.getComponent(cc.Mask);

              if (comp && comp._enabled && !comp._hitTest(cameraPt)) {
                hit = false;
                break;
              }

              j++;
            } else {
              // mask parent no longer exists
              mask.length = j;
              break;
            }
          } else if (i > temp.index) {
            // mask parent no longer exists
            mask.length = j;
            break;
          }
        }
      }
    }

    return hit;
  },

  /**
   * Get all the targets listening to the supplied type of event in the target's capturing phase.
   * The capturing phase comprises the journey from the root to the last node BEFORE the event target's node.
   * The result should save in the array parameter, and MUST SORT from child nodes to parent nodes.
   *
   * Subclasses can override this method to make event propagable.
   * @method _getCapturingTargets
   * @private
   * @param {String} type - the event type
   * @param {Array} array - the array to receive targets
   * @example {@link cocos2d/core/event/_getCapturingTargets.js}
   */
  _getCapturingTargets: function _getCapturingTargets(type, array) {
    var parent = this.parent;

    while (parent) {
      if (parent._capturingListeners && parent._capturingListeners.hasEventListener(type)) {
        array.push(parent);
      }

      parent = parent.parent;
    }
  },

  /**
   * Get all the targets listening to the supplied type of event in the target's bubbling phase.
   * The bubbling phase comprises any SUBSEQUENT nodes encountered on the return trip to the root of the tree.
   * The result should save in the array parameter, and MUST SORT from child nodes to parent nodes.
   *
   * Subclasses can override this method to make event propagable.
   * @method _getBubblingTargets
   * @private
   * @param {String} type - the event type
   * @param {Array} array - the array to receive targets
   */
  _getBubblingTargets: function _getBubblingTargets(type, array) {
    var parent = this.parent;

    while (parent) {
      if (parent._bubblingListeners && parent._bubblingListeners.hasEventListener(type)) {
        array.push(parent);
      }

      parent = parent.parent;
    }
  },
  // ACTIONS

  /**
   * !#en
   * Executes an action, and returns the action that is executed.<br/>
   * The node becomes the action's target. Refer to cc.Action's getTarget() <br/>
   * Calling runAction while the node is not active won't have any effect. <br/>
   * Note：You shouldn't modify the action after runAction, that won't take any effect.<br/>
   * if you want to modify, when you define action plus.
   * !#zh
   * 执行并返回该执行的动作。该节点将会变成动作的目标。<br/>
   * 调用 runAction 时，节点自身处于不激活状态将不会有任何效果。<br/>
   * 注意：你不应该修改 runAction 后的动作，将无法发挥作用，如果想进行修改，请在定义 action 时加入。
   * @method runAction
   * @param {Action} action
   * @return {Action} An Action pointer
   * @example
   * var action = cc.scaleTo(0.2, 1, 0.6);
   * node.runAction(action);
   * node.runAction(action).repeatForever(); // fail
   * node.runAction(action.repeatForever()); // right
   */
  runAction: ActionManagerExist ? function (action) {
    if (!this.active) return;
    cc.assertID(action, 1618);
    cc.warnID(1639);
    cc.director.getActionManager().addAction(action, this, false);
    return action;
  } : emptyFunc,

  /**
   * !#en Pause all actions running on the current node. Equals to `cc.director.getActionManager().pauseTarget(node)`.
   * !#zh 暂停本节点上所有正在运行的动作。和 `cc.director.getActionManager().pauseTarget(node);` 等价。
   * @method pauseAllActions
   * @example
   * node.pauseAllActions();
   */
  pauseAllActions: ActionManagerExist ? function () {
    cc.director.getActionManager().pauseTarget(this);
  } : emptyFunc,

  /**
   * !#en Resume all paused actions on the current node. Equals to `cc.director.getActionManager().resumeTarget(node)`.
   * !#zh 恢复运行本节点上所有暂停的动作。和 `cc.director.getActionManager().resumeTarget(node);` 等价。
   * @method resumeAllActions
   * @example
   * node.resumeAllActions();
   */
  resumeAllActions: ActionManagerExist ? function () {
    cc.director.getActionManager().resumeTarget(this);
  } : emptyFunc,

  /**
   * !#en Stops and removes all actions from the running action list .
   * !#zh 停止并且移除所有正在运行的动作列表。
   * @method stopAllActions
   * @example
   * node.stopAllActions();
   */
  stopAllActions: ActionManagerExist ? function () {
    cc.director.getActionManager().removeAllActionsFromTarget(this);
  } : emptyFunc,

  /**
   * !#en Stops and removes an action from the running action list.
   * !#zh 停止并移除指定的动作。
   * @method stopAction
   * @param {Action} action An action object to be removed.
   * @example
   * var action = cc.scaleTo(0.2, 1, 0.6);
   * node.stopAction(action);
   */
  stopAction: ActionManagerExist ? function (action) {
    cc.director.getActionManager().removeAction(action);
  } : emptyFunc,

  /**
   * !#en Removes an action from the running action list by its tag.
   * !#zh 停止并且移除指定标签的动作。
   * @method stopActionByTag
   * @param {Number} tag A tag that indicates the action to be removed.
   * @example
   * node.stopActionByTag(1);
   */
  stopActionByTag: ActionManagerExist ? function (tag) {
    if (tag === cc.Action.TAG_INVALID) {
      cc.logID(1612);
      return;
    }

    cc.director.getActionManager().removeActionByTag(tag, this);
  } : emptyFunc,

  /**
   * !#en Returns an action from the running action list by its tag.
   * !#zh 通过标签获取指定动作。
   * @method getActionByTag
   * @see cc.Action#getTag and cc.Action#setTag
   * @param {Number} tag
   * @return {Action} The action object with the given tag.
   * @example
   * var action = node.getActionByTag(1);
   */
  getActionByTag: ActionManagerExist ? function (tag) {
    if (tag === cc.Action.TAG_INVALID) {
      cc.logID(1613);
      return null;
    }

    return cc.director.getActionManager().getActionByTag(tag, this);
  } : function () {
    return null;
  },

  /**
   * !#en
   * Returns the numbers of actions that are running plus the ones that are schedule to run (actions in actionsToAdd and actions arrays).<br/>
   *    Composable actions are counted as 1 action. Example:<br/>
   *    If you are running 1 Sequence of 7 actions, it will return 1. <br/>
   *    If you are running 7 Sequences of 2 actions, it will return 7.</p>
   * !#zh
   * 获取运行着的动作加上正在调度运行的动作的总数。<br/>
   * 例如：<br/>
   * - 如果你正在运行 7 个动作中的 1 个 Sequence，它将返回 1。<br/>
   * - 如果你正在运行 2 个动作中的 7 个 Sequence，它将返回 7。<br/>
   *
   * @method getNumberOfRunningActions
   * @return {Number} The number of actions that are running plus the ones that are schedule to run
   * @example
   * var count = node.getNumberOfRunningActions();
   * cc.log("Running Action Count: " + count);
   */
  getNumberOfRunningActions: ActionManagerExist ? function () {
    return cc.director.getActionManager().getNumberOfRunningActionsInTarget(this);
  } : function () {
    return 0;
  },
  // TRANSFORM RELATED

  /**
   * !#en
   * Returns a copy of the position (x, y, z) of the node in its parent's coordinates.
   * You can pass a cc.Vec2 or cc.Vec3 as the argument to receive the return values.
   * !#zh
   * 获取节点在父节点坐标系中的位置（x, y, z）。
   * 你可以传一个 cc.Vec2 或者 cc.Vec3 作为参数来接收返回值。
   * @method getPosition
   * @param {Vec2|Vec3} [out] - The return value to receive position
   * @return {Vec2|Vec3} The position (x, y, z) of the node in its parent's coordinates
   * @example
   * cc.log("Node Position: " + node.getPosition());
   */
  getPosition: function getPosition(out) {
    out = out || new _valueTypes.Vec3();
    return _valueTypes.Trs.toPosition(out, this._trs);
  },

  /**
   * !#en
   * Sets the position (x, y, z) of the node in its parent's coordinates.<br/>
   * Usually we use cc.v2(x, y) to compose cc.Vec2 object,<br/>
   * and passing two numbers (x, y) is more efficient than passing cc.Vec2 object.
   * For 3D node we can use cc.v3(x, y, z) to compose cc.Vec3 object,<br/>
   * and passing three numbers (x, y, z) is more efficient than passing cc.Vec3 object.
   * !#zh
   * 设置节点在父节点坐标系中的位置。<br/>
   * 可以通过下面的方式设置坐标点：<br/>
   * 1. 传入 2 个数值 x, y。<br/>
   * 2. 传入 cc.v2(x, y) 类型为 cc.Vec2 的对象。
   * 3. 对于 3D 节点可以传入 3 个数值 x, y, z。<br/>
   * 4. 对于 3D 节点可以传入 cc.v3(x, y, z) 类型为 cc.Vec3 的对象。
   * @method setPosition
   * @param {Vec2|Vec3|Number} newPosOrX - X coordinate for position or the position (x, y, z) of the node in coordinates
   * @param {Number} [y] - Y coordinate for position
   * @param {Number} [z] - Z coordinate for position
   */
  setPosition: function setPosition(newPosOrX, y, z) {
    var x;

    if (y === undefined) {
      x = newPosOrX.x;
      y = newPosOrX.y;
      z = newPosOrX.z || 0;
    } else {
      x = newPosOrX;
      z = z || 0;
    }

    var trs = this._trs;

    if (trs[0] === x && trs[1] === y && trs[2] === z) {
      return;
    }

    if (CC_EDITOR) {
      var oldPosition = new cc.Vec3(trs[0], trs[1], trs[2]);
    }

    trs[0] = x;
    trs[1] = y;
    trs[2] = z;
    this.setLocalDirty(LocalDirtyFlag.ALL_POSITION);
    !CC_NATIVERENDERER && (this._renderFlag |= RenderFlow.FLAG_WORLD_TRANSFORM); // fast check event

    if (this._eventMask & POSITION_ON) {
      if (CC_EDITOR) {
        this.emit(EventType.POSITION_CHANGED, oldPosition);
      } else {
        this.emit(EventType.POSITION_CHANGED);
      }
    }
  },

  /**
   * !#en
   * Returns the scale factor of the node.
   * Need pass a cc.Vec2 or cc.Vec3 as the argument to receive the return values.
   * !#zh 获取节点的缩放，需要传一个 cc.Vec2 或者 cc.Vec3 作为参数来接收返回值。
   * @method getScale
   * @param {Vec2|Vec3} out
   * @return {Vec2|Vec3} The scale factor
   * @example
   * cc.log("Node Scale: " + node.getScale(cc.v3()));
   */
  getScale: function getScale(out) {
    if (out !== undefined) {
      return _valueTypes.Trs.toScale(out, this._trs);
    } else {
      cc.warnID(1400, 'cc.Node.getScale', 'cc.Node.scale or cc.Node.getScale(cc.Vec3)');
      return this._trs[7];
    }
  },

  /**
   * !#en
   * Sets the scale of axis in local coordinates of the node.
   * You can operate 2 axis in 2D node, and 3 axis in 3D node.
   * !#zh
   * 设置节点在本地坐标系中坐标轴上的缩放比例。
   * 2D 节点可以操作两个坐标轴，而 3D 节点可以操作三个坐标轴。
   * @method setScale
   * @param {Number|Vec2|Vec3} x - scaleX or scale object
   * @param {Number} [y]
   * @param {Number} [z]
   * @example
   * node.setScale(cc.v2(2, 2));
   * node.setScale(cc.v3(2, 2, 2)); // for 3D node
   * node.setScale(2);
   */
  setScale: function setScale(x, y, z) {
    if (x && typeof x !== 'number') {
      y = x.y;
      z = x.z === undefined ? 1 : x.z;
      x = x.x;
    } else if (x !== undefined && y === undefined) {
      y = x;
      z = x;
    } else if (z === undefined) {
      z = 1;
    }

    var trs = this._trs;

    if (trs[7] !== x || trs[8] !== y || trs[9] !== z) {
      trs[7] = x;
      trs[8] = y;
      trs[9] = z;
      this.setLocalDirty(LocalDirtyFlag.ALL_SCALE);
      !CC_NATIVERENDERER && (this._renderFlag |= RenderFlow.FLAG_TRANSFORM);

      if (this._eventMask & SCALE_ON) {
        this.emit(EventType.SCALE_CHANGED);
      }
    }
  },

  /**
   * !#en
   * Get rotation of node (in quaternion).
   * Need pass a cc.Quat as the argument to receive the return values.
   * !#zh
   * 获取该节点的 quaternion 旋转角度，需要传一个 cc.Quat 作为参数来接收返回值。
   * @method getRotation
   * @param {Quat} out
   * @return {Quat} Quaternion object represents the rotation
   */
  getRotation: function getRotation(out) {
    if (out instanceof _valueTypes.Quat) {
      return _valueTypes.Trs.toRotation(out, this._trs);
    } else {
      if (CC_DEBUG) {
        cc.warn("`cc.Node.getRotation()` is deprecated since v2.1.0, please use `-cc.Node.angle` instead. (`this.node.getRotation()` -> `-this.node.angle`)");
      }

      return -this.angle;
    }
  },

  /**
   * !#en Set rotation of node (in quaternion).
   * !#zh 设置该节点的 quaternion 旋转角度。
   * @method setRotation
   * @param {cc.Quat|Number} quat Quaternion object represents the rotation or the x value of quaternion
   * @param {Number} [y] y value of quternion
   * @param {Number} [z] z value of quternion
   * @param {Number} [w] w value of quternion
   */
  setRotation: function setRotation(rotation, y, z, w) {
    if (typeof rotation === 'number' && y === undefined) {
      if (CC_DEBUG) {
        cc.warn("`cc.Node.setRotation(degree)` is deprecated since v2.1.0, please set `-cc.Node.angle` instead. (`this.node.setRotation(x)` -> `this.node.angle = -x`)");
      }

      this.angle = -rotation;
    } else {
      var x = rotation;

      if (y === undefined) {
        x = rotation.x;
        y = rotation.y;
        z = rotation.z;
        w = rotation.w;
      }

      var trs = this._trs;

      if (trs[3] !== x || trs[4] !== y || trs[5] !== z || trs[6] !== w) {
        trs[3] = x;
        trs[4] = y;
        trs[5] = z;
        trs[6] = w;
        this.setLocalDirty(LocalDirtyFlag.ALL_ROTATION);

        if (this._eventMask & ROTATION_ON) {
          this.emit(EventType.ROTATION_CHANGED);
        }

        if (CC_EDITOR) {
          this._toEuler();
        }
      }
    }
  },

  /**
   * !#en
   * Returns a copy the untransformed size of the node. <br/>
   * The contentSize remains the same no matter the node is scaled or rotated.<br/>
   * All nodes has a size. Layer and Scene has the same size of the screen by default. <br/>
   * !#zh 获取节点自身大小，不受该节点是否被缩放或者旋转的影响。
   * @method getContentSize
   * @return {Size} The untransformed size of the node.
   * @example
   * cc.log("Content Size: " + node.getContentSize());
   */
  getContentSize: function getContentSize() {
    return cc.size(this._contentSize.width, this._contentSize.height);
  },

  /**
   * !#en
   * Sets the untransformed size of the node.<br/>
   * The contentSize remains the same no matter the node is scaled or rotated.<br/>
   * All nodes has a size. Layer and Scene has the same size of the screen.
   * !#zh 设置节点原始大小，不受该节点是否被缩放或者旋转的影响。
   * @method setContentSize
   * @param {Size|Number} size - The untransformed size of the node or The untransformed size's width of the node.
   * @param {Number} [height] - The untransformed size's height of the node.
   * @example
   * node.setContentSize(cc.size(100, 100));
   * node.setContentSize(100, 100);
   */
  setContentSize: function setContentSize(size, height) {
    var locContentSize = this._contentSize;
    var clone;

    if (height === undefined) {
      if (size.width === locContentSize.width && size.height === locContentSize.height) return;

      if (CC_EDITOR) {
        clone = cc.size(locContentSize.width, locContentSize.height);
      }

      locContentSize.width = size.width;
      locContentSize.height = size.height;
    } else {
      if (size === locContentSize.width && height === locContentSize.height) return;

      if (CC_EDITOR) {
        clone = cc.size(locContentSize.width, locContentSize.height);
      }

      locContentSize.width = size;
      locContentSize.height = height;
    }

    if (this._eventMask & SIZE_ON) {
      if (CC_EDITOR) {
        this.emit(EventType.SIZE_CHANGED, clone);
      } else {
        this.emit(EventType.SIZE_CHANGED);
      }
    }
  },

  /**
   * !#en
   * Returns a copy of the anchor point.<br/>
   * Anchor point is the point around which all transformations and positioning manipulations take place.<br/>
   * It's like a pin in the node where it is "attached" to its parent. <br/>
   * The anchorPoint is normalized, like a percentage. (0,0) means the bottom-left corner and (1,1) means the top-right corner. <br/>
   * But you can use values higher than (1,1) and lower than (0,0) too.  <br/>
   * The default anchor point is (0.5,0.5), so it starts at the center of the node.
   * !#zh
   * 获取节点锚点，用百分比表示。<br/>
   * 锚点应用于所有变换和坐标点的操作，它就像在节点上连接其父节点的大头针。<br/>
   * 锚点是标准化的，就像百分比一样。(0，0) 表示左下角，(1，1) 表示右上角。<br/>
   * 但是你可以使用比（1，1）更高的值或者比（0，0）更低的值。<br/>
   * 默认的锚点是（0.5，0.5），因此它开始于节点的中心位置。<br/>
   * 注意：Creator 中的锚点仅用于定位所在的节点，子节点的定位不受影响。
   * @method getAnchorPoint
   * @return {Vec2} The anchor point of node.
   * @example
   * cc.log("Node AnchorPoint: " + node.getAnchorPoint());
   */
  getAnchorPoint: function getAnchorPoint() {
    return cc.v2(this._anchorPoint);
  },

  /**
   * !#en
   * Sets the anchor point in percent. <br/>
   * anchor point is the point around which all transformations and positioning manipulations take place. <br/>
   * It's like a pin in the node where it is "attached" to its parent. <br/>
   * The anchorPoint is normalized, like a percentage. (0,0) means the bottom-left corner and (1,1) means the top-right corner.<br/>
   * But you can use values higher than (1,1) and lower than (0,0) too.<br/>
   * The default anchor point is (0.5,0.5), so it starts at the center of the node.
   * !#zh
   * 设置锚点的百分比。<br/>
   * 锚点应用于所有变换和坐标点的操作，它就像在节点上连接其父节点的大头针。<br/>
   * 锚点是标准化的，就像百分比一样。(0，0) 表示左下角，(1，1) 表示右上角。<br/>
   * 但是你可以使用比（1，1）更高的值或者比（0，0）更低的值。<br/>
   * 默认的锚点是（0.5，0.5），因此它开始于节点的中心位置。<br/>
   * 注意：Creator 中的锚点仅用于定位所在的节点，子节点的定位不受影响。
   * @method setAnchorPoint
   * @param {Vec2|Number} point - The anchor point of node or The x axis anchor of node.
   * @param {Number} [y] - The y axis anchor of node.
   * @example
   * node.setAnchorPoint(cc.v2(1, 1));
   * node.setAnchorPoint(1, 1);
   */
  setAnchorPoint: function setAnchorPoint(point, y) {
    var locAnchorPoint = this._anchorPoint;

    if (y === undefined) {
      if (point.x === locAnchorPoint.x && point.y === locAnchorPoint.y) return;
      locAnchorPoint.x = point.x;
      locAnchorPoint.y = point.y;
    } else {
      if (point === locAnchorPoint.x && y === locAnchorPoint.y) return;
      locAnchorPoint.x = point;
      locAnchorPoint.y = y;
    }

    this.setLocalDirty(LocalDirtyFlag.ALL_POSITION);

    if (this._eventMask & ANCHOR_ON) {
      this.emit(EventType.ANCHOR_CHANGED);
    }
  },

  /*
   * Transforms position from world space to local space.
   * @method _invTransformPoint
   * @param {Vec3} out
   * @param {Vec3} vec3
   */
  _invTransformPoint: function _invTransformPoint(out, pos) {
    if (this._parent) {
      this._parent._invTransformPoint(out, pos);
    } else {
      _valueTypes.Vec3.copy(out, pos);
    }

    var ltrs = this._trs; // out = parent_inv_pos - pos

    _valueTypes.Trs.toPosition(_tpVec3a, ltrs);

    _valueTypes.Vec3.sub(out, out, _tpVec3a); // out = inv(rot) * out


    _valueTypes.Trs.toRotation(_tpQuata, ltrs);

    _valueTypes.Quat.conjugate(_tpQuatb, _tpQuata);

    _valueTypes.Vec3.transformQuat(out, out, _tpQuatb); // out = (1/scale) * out


    _valueTypes.Trs.toScale(_tpVec3a, ltrs);

    _valueTypes.Vec3.inverseSafe(_tpVec3b, _tpVec3a);

    _valueTypes.Vec3.mul(out, out, _tpVec3b);

    return out;
  },

  /*
   * Calculate and return world position.
   * This is not a public API yet, its usage could be updated
   * @method getWorldPosition
   * @param {Vec3} out
   * @return {Vec3}
   */
  getWorldPosition: function getWorldPosition(out) {
    _valueTypes.Trs.toPosition(out, this._trs);

    var curr = this._parent;
    var ltrs;

    while (curr) {
      ltrs = curr._trs; // out = parent_scale * pos

      _valueTypes.Trs.toScale(_gwpVec3, ltrs);

      _valueTypes.Vec3.mul(out, out, _gwpVec3); // out = parent_quat * out


      _valueTypes.Trs.toRotation(_gwpQuat, ltrs);

      _valueTypes.Vec3.transformQuat(out, out, _gwpQuat); // out = out + pos


      _valueTypes.Trs.toPosition(_gwpVec3, ltrs);

      _valueTypes.Vec3.add(out, out, _gwpVec3);

      curr = curr._parent;
    }

    return out;
  },

  /*
   * Set world position.
   * This is not a public API yet, its usage could be updated
   * @method setWorldPosition
   * @param {Vec3} pos
   */
  setWorldPosition: function setWorldPosition(pos) {
    var ltrs = this._trs;

    if (CC_EDITOR) {
      var oldPosition = new cc.Vec3(ltrs[0], ltrs[1], ltrs[2]);
    } // NOTE: this is faster than invert world matrix and transform the point


    if (this._parent) {
      this._parent._invTransformPoint(_swpVec3, pos);
    } else {
      _valueTypes.Vec3.copy(_swpVec3, pos);
    }

    _valueTypes.Trs.fromPosition(ltrs, _swpVec3);

    this.setLocalDirty(LocalDirtyFlag.ALL_POSITION); // fast check event

    if (this._eventMask & POSITION_ON) {
      // send event
      if (CC_EDITOR) {
        this.emit(EventType.POSITION_CHANGED, oldPosition);
      } else {
        this.emit(EventType.POSITION_CHANGED);
      }
    }
  },

  /*
   * Calculate and return world rotation
   * This is not a public API yet, its usage could be updated
   * @method getWorldRotation
   * @param {Quat} out
   * @return {Quat}
   */
  getWorldRotation: function getWorldRotation(out) {
    _valueTypes.Trs.toRotation(_gwrQuat, this._trs);

    _valueTypes.Quat.copy(out, _gwrQuat);

    var curr = this._parent;

    while (curr) {
      _valueTypes.Trs.toRotation(_gwrQuat, curr._trs);

      _valueTypes.Quat.mul(out, _gwrQuat, out);

      curr = curr._parent;
    }

    return out;
  },

  /*
   * Set world rotation with quaternion
   * This is not a public API yet, its usage could be updated
   * @method setWorldRotation
   * @param {Quat} val
   */
  setWorldRotation: function setWorldRotation(val) {
    if (this._parent) {
      this._parent.getWorldRotation(_swrQuat);

      _valueTypes.Quat.conjugate(_swrQuat, _swrQuat);

      _valueTypes.Quat.mul(_swrQuat, _swrQuat, val);
    } else {
      _valueTypes.Quat.copy(_swrQuat, val);
    }

    _valueTypes.Trs.fromRotation(this._trs, _swrQuat);

    if (CC_EDITOR) {
      this._toEuler();
    }

    this.setLocalDirty(LocalDirtyFlag.ALL_ROTATION);
  },

  /*
   * Calculate and return world scale
   * This is not a public API yet, its usage could be updated
   * @method getWorldScale
   * @param {Vec3} out
   * @return {Vec3}
   */
  getWorldScale: function getWorldScale(out) {
    _valueTypes.Trs.toScale(_gwsVec3, this._trs);

    _valueTypes.Vec3.copy(out, _gwsVec3);

    var curr = this._parent;

    while (curr) {
      _valueTypes.Trs.toScale(_gwsVec3, curr._trs);

      _valueTypes.Vec3.mul(out, out, _gwsVec3);

      curr = curr._parent;
    }

    return out;
  },

  /*
   * Set world scale with vec3
   * This is not a public API yet, its usage could be updated
   * @method setWorldScale
   * @param {Vec3} scale
   */
  setWorldScale: function setWorldScale(scale) {
    if (this._parent) {
      this._parent.getWorldScale(_swsVec3);

      _valueTypes.Vec3.div(_swsVec3, scale, _swsVec3);
    } else {
      _valueTypes.Vec3.copy(_swsVec3, scale);
    }

    _valueTypes.Trs.fromScale(this._trs, _swsVec3);

    this.setLocalDirty(LocalDirtyFlag.ALL_SCALE);
  },
  getWorldRT: function getWorldRT(out) {
    var opos = _gwrtVec3a;
    var orot = _gwrtQuata;
    var ltrs = this._trs;

    _valueTypes.Trs.toPosition(opos, ltrs);

    _valueTypes.Trs.toRotation(orot, ltrs);

    var curr = this._parent;

    while (curr) {
      ltrs = curr._trs; // opos = parent_lscale * lpos

      _valueTypes.Trs.toScale(_gwrtVec3b, ltrs);

      _valueTypes.Vec3.mul(opos, opos, _gwrtVec3b); // opos = parent_lrot * opos


      _valueTypes.Trs.toRotation(_gwrtQuatb, ltrs);

      _valueTypes.Vec3.transformQuat(opos, opos, _gwrtQuatb); // opos = opos + lpos


      _valueTypes.Trs.toPosition(_gwrtVec3b, ltrs);

      _valueTypes.Vec3.add(opos, opos, _gwrtVec3b); // orot = lrot * orot


      _valueTypes.Quat.mul(orot, _gwrtQuatb, orot);

      curr = curr._parent;
    }

    _valueTypes.Mat4.fromRT(out, orot, opos);

    return out;
  },

  /**
   * !#en Set rotation by lookAt target point, normally used by Camera Node
   * !#zh 通过观察目标来设置 rotation，一般用于 Camera Node 上
   * @method lookAt
   * @param {Vec3} pos
   * @param {Vec3} [up] - default is (0,1,0)
   */
  lookAt: function lookAt(pos, up) {
    this.getWorldPosition(_laVec3);

    _valueTypes.Vec3.sub(_laVec3, _laVec3, pos); // NOTE: we use -z for view-dir


    _valueTypes.Vec3.normalize(_laVec3, _laVec3);

    _valueTypes.Quat.fromViewUp(_laQuat, _laVec3, up);

    this.setWorldRotation(_laQuat);
  },
  _updateLocalMatrix: updateLocalMatrix2D,
  _calculWorldMatrix: function _calculWorldMatrix() {
    // Avoid as much function call as possible
    if (this._localMatDirty & LocalDirtyFlag.TRSS) {
      this._updateLocalMatrix();
    } // Assume parent world matrix is correct


    var parent = this._parent;

    if (parent) {
      this._mulMat(this._worldMatrix, parent._worldMatrix, this._matrix);
    } else {
      _valueTypes.Mat4.copy(this._worldMatrix, this._matrix);
    }

    this._worldMatDirty = false;
  },
  _mulMat: mulMat2D,
  _updateWorldMatrix: function _updateWorldMatrix() {
    if (this._parent) {
      this._parent._updateWorldMatrix();
    }

    if (this._worldMatDirty) {
      this._calculWorldMatrix(); // Sync dirty to children


      var children = this._children;

      for (var i = 0, l = children.length; i < l; i++) {
        children[i]._worldMatDirty = true;
      }
    }
  },
  setLocalDirty: function setLocalDirty(flag) {
    this._localMatDirty |= flag;
    this._worldMatDirty = true;

    if (flag === LocalDirtyFlag.ALL_POSITION || flag === LocalDirtyFlag.POSITION) {
      this._renderFlag |= RenderFlow.FLAG_WORLD_TRANSFORM;
    } else {
      this._renderFlag |= RenderFlow.FLAG_TRANSFORM;
    }
  },
  setWorldDirty: function setWorldDirty() {
    this._worldMatDirty = true;
  },

  /**
   * !#en
   * Get the local transform matrix (4x4), based on parent node coordinates
   * !#zh 返回局部空间坐标系的矩阵，基于父节点坐标系。
   * @method getLocalMatrix
   * @param {Mat4} out The matrix object to be filled with data
   * @return {Mat4} Same as the out matrix object
   * @example
   * let mat4 = cc.mat4();
   * node.getLocalMatrix(mat4);
   */
  getLocalMatrix: function getLocalMatrix(out) {
    this._updateLocalMatrix();

    return _valueTypes.Mat4.copy(out, this._matrix);
  },

  /**
   * !#en
   * Get the world transform matrix (4x4)
   * !#zh 返回世界空间坐标系的矩阵。
   * @method getWorldMatrix
   * @param {Mat4} out The matrix object to be filled with data
   * @return {Mat4} Same as the out matrix object
   * @example
   * let mat4 = cc.mat4();
   * node.getWorldMatrix(mat4);
   */
  getWorldMatrix: function getWorldMatrix(out) {
    this._updateWorldMatrix();

    return _valueTypes.Mat4.copy(out, this._worldMatrix);
  },

  /**
   * !#en
   * Converts a Point to node (local) space coordinates.
   * !#zh
   * 将一个点转换到节点 (局部) 空间坐标系。
   * @method convertToNodeSpaceAR
   * @param {Vec3|Vec2} worldPoint
   * @param {Vec3|Vec2} [out]
   * @return {Vec3|Vec2}
   * @typescript
   * convertToNodeSpaceAR<T extends cc.Vec2 | cc.Vec3>(worldPoint: T, out?: T): T
   * @example
   * var newVec2 = node.convertToNodeSpaceAR(cc.v2(100, 100));
   * var newVec3 = node.convertToNodeSpaceAR(cc.v3(100, 100, 100));
   */
  convertToNodeSpaceAR: function convertToNodeSpaceAR(worldPoint, out) {
    this._updateWorldMatrix();

    _valueTypes.Mat4.invert(_mat4_temp, this._worldMatrix);

    if (worldPoint instanceof cc.Vec2) {
      out = out || new cc.Vec2();
      return _valueTypes.Vec2.transformMat4(out, worldPoint, _mat4_temp);
    } else {
      out = out || new cc.Vec3();
      return _valueTypes.Vec3.transformMat4(out, worldPoint, _mat4_temp);
    }
  },

  /**
   * !#en
   * Converts a Point in node coordinates to world space coordinates.
   * !#zh
   * 将节点坐标系下的一个点转换到世界空间坐标系。
   * @method convertToWorldSpaceAR
   * @param {Vec3|Vec2} nodePoint
   * @param {Vec3|Vec2} [out]
   * @return {Vec3|Vec2}
   * @typescript
   * convertToWorldSpaceAR<T extends cc.Vec2 | cc.Vec3>(nodePoint: T, out?: T): T
   * @example
   * var newVec2 = node.convertToWorldSpaceAR(cc.v2(100, 100));
   * var newVec3 = node.convertToWorldSpaceAR(cc.v3(100, 100, 100));
   */
  convertToWorldSpaceAR: function convertToWorldSpaceAR(nodePoint, out) {
    this._updateWorldMatrix();

    if (nodePoint instanceof cc.Vec2) {
      out = out || new cc.Vec2();
      return _valueTypes.Vec2.transformMat4(out, nodePoint, this._worldMatrix);
    } else {
      out = out || new cc.Vec3();
      return _valueTypes.Vec3.transformMat4(out, nodePoint, this._worldMatrix);
    }
  },
  // OLD TRANSFORM ACCESS APIs

  /**
      * !#en Converts a Point to node (local) space coordinates then add the anchor point position.
      * So the return position will be related to the left bottom corner of the node's bounding box.
      * This equals to the API behavior of cocos2d-x, you probably want to use convertToNodeSpaceAR instead
      * !#zh 将一个点转换到节点 (局部) 坐标系，并加上锚点的坐标。<br/>
      * 也就是说返回的坐标是相对于节点包围盒左下角的坐标。<br/>
      * 这个 API 的设计是为了和 cocos2d-x 中行为一致，更多情况下你可能需要使用 convertToNodeSpaceAR。
      * @method convertToNodeSpace
      * @deprecated since v2.1.3
      * @param {Vec2} worldPoint
      * @return {Vec2}
      * @example
      * var newVec2 = node.convertToNodeSpace(cc.v2(100, 100));
      */
  convertToNodeSpace: function convertToNodeSpace(worldPoint) {
    this._updateWorldMatrix();

    _valueTypes.Mat4.invert(_mat4_temp, this._worldMatrix);

    var out = new cc.Vec2();

    _valueTypes.Vec2.transformMat4(out, worldPoint, _mat4_temp);

    out.x += this._anchorPoint.x * this._contentSize.width;
    out.y += this._anchorPoint.y * this._contentSize.height;
    return out;
  },

  /**
   * !#en Converts a Point related to the left bottom corner of the node's bounding box to world space coordinates.
   * This equals to the API behavior of cocos2d-x, you probably want to use convertToWorldSpaceAR instead
   * !#zh 将一个相对于节点左下角的坐标位置转换到世界空间坐标系。
   * 这个 API 的设计是为了和 cocos2d-x 中行为一致，更多情况下你可能需要使用 convertToWorldSpaceAR
   * @method convertToWorldSpace
   * @deprecated since v2.1.3
   * @param {Vec2} nodePoint
   * @return {Vec2}
   * @example
   * var newVec2 = node.convertToWorldSpace(cc.v2(100, 100));
   */
  convertToWorldSpace: function convertToWorldSpace(nodePoint) {
    this._updateWorldMatrix();

    var out = new cc.Vec2(nodePoint.x - this._anchorPoint.x * this._contentSize.width, nodePoint.y - this._anchorPoint.y * this._contentSize.height);
    return _valueTypes.Vec2.transformMat4(out, out, this._worldMatrix);
  },

  /**
   * !#en
   * Returns the matrix that transform the node's (local) space coordinates into the parent's space coordinates.<br/>
   * The matrix is in Pixels.
   * !#zh 返回这个将节点（局部）的空间坐标系转换成父节点的空间坐标系的矩阵。这个矩阵以像素为单位。
   * @method getNodeToParentTransform
   * @deprecated since v2.0
   * @param {AffineTransform} [out] The affine transform object to be filled with data
   * @return {AffineTransform} Same as the out affine transform object
   * @example
   * let affineTransform = cc.AffineTransform.create();
   * node.getNodeToParentTransform(affineTransform);
   */
  getNodeToParentTransform: function getNodeToParentTransform(out) {
    if (!out) {
      out = AffineTrans.identity();
    }

    this._updateLocalMatrix();

    var contentSize = this._contentSize;
    _vec3_temp.x = -this._anchorPoint.x * contentSize.width;
    _vec3_temp.y = -this._anchorPoint.y * contentSize.height;

    _valueTypes.Mat4.copy(_mat4_temp, this._matrix);

    _valueTypes.Mat4.transform(_mat4_temp, _mat4_temp, _vec3_temp);

    return AffineTrans.fromMat4(out, _mat4_temp);
  },

  /**
   * !#en
   * Returns the matrix that transform the node's (local) space coordinates into the parent's space coordinates.<br/>
   * The matrix is in Pixels.<br/>
   * This method is AR (Anchor Relative).
   * !#zh
   * 返回这个将节点（局部）的空间坐标系转换成父节点的空间坐标系的矩阵。<br/>
   * 这个矩阵以像素为单位。<br/>
   * 该方法基于节点坐标。
   * @method getNodeToParentTransformAR
   * @deprecated since v2.0
   * @param {AffineTransform} [out] The affine transform object to be filled with data
   * @return {AffineTransform} Same as the out affine transform object
   * @example
   * let affineTransform = cc.AffineTransform.create();
   * node.getNodeToParentTransformAR(affineTransform);
   */
  getNodeToParentTransformAR: function getNodeToParentTransformAR(out) {
    if (!out) {
      out = AffineTrans.identity();
    }

    this._updateLocalMatrix();

    return AffineTrans.fromMat4(out, this._matrix);
  },

  /**
   * !#en Returns the world affine transform matrix. The matrix is in Pixels.
   * !#zh 返回节点到世界坐标系的仿射变换矩阵。矩阵单位是像素。
   * @method getNodeToWorldTransform
   * @deprecated since v2.0
   * @param {AffineTransform} [out] The affine transform object to be filled with data
   * @return {AffineTransform} Same as the out affine transform object
   * @example
   * let affineTransform = cc.AffineTransform.create();
   * node.getNodeToWorldTransform(affineTransform);
   */
  getNodeToWorldTransform: function getNodeToWorldTransform(out) {
    if (!out) {
      out = AffineTrans.identity();
    }

    this._updateWorldMatrix();

    var contentSize = this._contentSize;
    _vec3_temp.x = -this._anchorPoint.x * contentSize.width;
    _vec3_temp.y = -this._anchorPoint.y * contentSize.height;

    _valueTypes.Mat4.copy(_mat4_temp, this._worldMatrix);

    _valueTypes.Mat4.transform(_mat4_temp, _mat4_temp, _vec3_temp);

    return AffineTrans.fromMat4(out, _mat4_temp);
  },

  /**
   * !#en
   * Returns the world affine transform matrix. The matrix is in Pixels.<br/>
   * This method is AR (Anchor Relative).
   * !#zh
   * 返回节点到世界坐标仿射变换矩阵。矩阵单位是像素。<br/>
   * 该方法基于节点坐标。
   * @method getNodeToWorldTransformAR
   * @deprecated since v2.0
   * @param {AffineTransform} [out] The affine transform object to be filled with data
   * @return {AffineTransform} Same as the out affine transform object
   * @example
   * let affineTransform = cc.AffineTransform.create();
   * node.getNodeToWorldTransformAR(affineTransform);
   */
  getNodeToWorldTransformAR: function getNodeToWorldTransformAR(out) {
    if (!out) {
      out = AffineTrans.identity();
    }

    this._updateWorldMatrix();

    return AffineTrans.fromMat4(out, this._worldMatrix);
  },

  /**
   * !#en
   * Returns the matrix that transform parent's space coordinates to the node's (local) space coordinates.<br/>
   * The matrix is in Pixels. The returned transform is readonly and cannot be changed.
   * !#zh
   * 返回将父节点的坐标系转换成节点（局部）的空间坐标系的矩阵。<br/>
   * 该矩阵以像素为单位。返回的矩阵是只读的，不能更改。
   * @method getParentToNodeTransform
   * @deprecated since v2.0
   * @param {AffineTransform} [out] The affine transform object to be filled with data
   * @return {AffineTransform} Same as the out affine transform object
   * @example
   * let affineTransform = cc.AffineTransform.create();
   * node.getParentToNodeTransform(affineTransform);
   */
  getParentToNodeTransform: function getParentToNodeTransform(out) {
    if (!out) {
      out = AffineTrans.identity();
    }

    this._updateLocalMatrix();

    _valueTypes.Mat4.invert(_mat4_temp, this._matrix);

    return AffineTrans.fromMat4(out, _mat4_temp);
  },

  /**
   * !#en Returns the inverse world affine transform matrix. The matrix is in Pixels.
   * !#en 返回世界坐标系到节点坐标系的逆矩阵。
   * @method getWorldToNodeTransform
   * @deprecated since v2.0
   * @param {AffineTransform} [out] The affine transform object to be filled with data
   * @return {AffineTransform} Same as the out affine transform object
   * @example
   * let affineTransform = cc.AffineTransform.create();
   * node.getWorldToNodeTransform(affineTransform);
   */
  getWorldToNodeTransform: function getWorldToNodeTransform(out) {
    if (!out) {
      out = AffineTrans.identity();
    }

    this._updateWorldMatrix();

    _valueTypes.Mat4.invert(_mat4_temp, this._worldMatrix);

    return AffineTrans.fromMat4(out, _mat4_temp);
  },

  /**
   * !#en convenience methods which take a cc.Touch instead of cc.Vec2.
   * !#zh 将触摸点转换成本地坐标系中位置。
   * @method convertTouchToNodeSpace
   * @deprecated since v2.0
   * @param {Touch} touch - The touch object
   * @return {Vec2}
   * @example
   * var newVec2 = node.convertTouchToNodeSpace(touch);
   */
  convertTouchToNodeSpace: function convertTouchToNodeSpace(touch) {
    return this.convertToNodeSpace(touch.getLocation());
  },

  /**
   * !#en converts a cc.Touch (world coordinates) into a local coordinate. This method is AR (Anchor Relative).
   * !#zh 转换一个 cc.Touch（世界坐标）到一个局部坐标，该方法基于节点坐标。
   * @method convertTouchToNodeSpaceAR
   * @deprecated since v2.0
   * @param {Touch} touch - The touch object
   * @return {Vec2}
   * @example
   * var newVec2 = node.convertTouchToNodeSpaceAR(touch);
   */
  convertTouchToNodeSpaceAR: function convertTouchToNodeSpaceAR(touch) {
    return this.convertToNodeSpaceAR(touch.getLocation());
  },

  /**
   * !#en
   * Returns a "local" axis aligned bounding box of the node. <br/>
   * The returned box is relative only to its parent.
   * !#zh 返回父节坐标系下的轴向对齐的包围盒。
   * @method getBoundingBox
   * @return {Rect} The calculated bounding box of the node
   * @example
   * var boundingBox = node.getBoundingBox();
   */
  getBoundingBox: function getBoundingBox() {
    this._updateLocalMatrix();

    var width = this._contentSize.width;
    var height = this._contentSize.height;
    var rect = cc.rect(-this._anchorPoint.x * width, -this._anchorPoint.y * height, width, height);
    return rect.transformMat4(rect, this._matrix);
  },

  /**
   * !#en
   * Returns a "world" axis aligned bounding box of the node.<br/>
   * The bounding box contains self and active children's world bounding box.
   * !#zh
   * 返回节点在世界坐标系下的对齐轴向的包围盒（AABB）。<br/>
   * 该边框包含自身和已激活的子节点的世界边框。
   * @method getBoundingBoxToWorld
   * @return {Rect}
   * @example
   * var newRect = node.getBoundingBoxToWorld();
   */
  getBoundingBoxToWorld: function getBoundingBoxToWorld() {
    if (this._parent) {
      this._parent._updateWorldMatrix();

      return this._getBoundingBoxTo();
    } else {
      return this.getBoundingBox();
    }
  },
  _getBoundingBoxTo: function _getBoundingBoxTo() {
    var width = this._contentSize.width;
    var height = this._contentSize.height;
    var rect = cc.rect(-this._anchorPoint.x * width, -this._anchorPoint.y * height, width, height);

    this._calculWorldMatrix();

    rect.transformMat4(rect, this._worldMatrix); //query child's BoundingBox

    if (!this._children) return rect;
    var locChildren = this._children;

    for (var i = 0; i < locChildren.length; i++) {
      var child = locChildren[i];

      if (child && child.active) {
        var childRect = child._getBoundingBoxTo();

        if (childRect) rect.union(rect, childRect);
      }
    }

    return rect;
  },
  _updateOrderOfArrival: function _updateOrderOfArrival() {
    var arrivalOrder = this._parent ? ++this._parent._childArrivalOrder : 0;
    this._localZOrder = this._localZOrder & 0xffff0000 | arrivalOrder;
    this.emit(EventType.SIBLING_ORDER_CHANGED);
  },

  /**
   * !#en
   * Adds a child to the node with z order and name.
   * !#zh
   * 添加子节点，并且可以修改该节点的 局部 Z 顺序和名字。
   * @method addChild
   * @param {Node} child - A child node
   * @param {Number} [zIndex] - Z order for drawing priority. Please refer to zIndex property
   * @param {String} [name] - A name to identify the node easily. Please refer to name property
   * @example
   * node.addChild(newNode, 1, "node");
   */
  addChild: function addChild(child, zIndex, name) {
    if (CC_DEV && !cc.Node.isNode(child)) {
      return cc.errorID(1634, cc.js.getClassName(child));
    }

    cc.assertID(child, 1606);
    cc.assertID(child._parent === null, 1605); // invokes the parent setter

    child.parent = this;

    if (zIndex !== undefined) {
      child.zIndex = zIndex;
    }

    if (name !== undefined) {
      child.name = name;
    }
  },

  /**
   * !#en Stops all running actions and schedulers.
   * !#zh 停止所有正在播放的动作和计时器。
   * @method cleanup
   * @example
   * node.cleanup();
   */
  cleanup: function cleanup() {
    // actions
    ActionManagerExist && cc.director.getActionManager().removeAllActionsFromTarget(this); // event

    eventManager.removeListeners(this); // children

    var i,
        len = this._children.length,
        node;

    for (i = 0; i < len; ++i) {
      node = this._children[i];
      if (node) node.cleanup();
    }
  },

  /**
   * !#en Sorts the children array depends on children's zIndex and arrivalOrder,
   * normally you won't need to invoke this function.
   * !#zh 根据子节点的 zIndex 和 arrivalOrder 进行排序，正常情况下开发者不需要手动调用这个函数。
   *
   * @method sortAllChildren
   */
  sortAllChildren: function sortAllChildren() {
    if (this._reorderChildDirty) {
      this._reorderChildDirty = false; // delay update arrivalOrder before sort children

      var _children = this._children,
          child;
      this._parent && (this._parent._childArrivalOrder = 1);

      for (var i = 0, len = _children.length; i < len; i++) {
        child = _children[i];

        child._updateOrderOfArrival();
      } // Optimize reordering event code to fix problems with setting zindex
      // https://github.com/cocos-creator/2d-tasks/issues/1186


      eventManager._setDirtyForNode(this);

      if (_children.length > 1) {
        // insertion sort
        var j, child;

        for (var _i = 1, _len = _children.length; _i < _len; _i++) {
          child = _children[_i];
          j = _i - 1; //continue moving element downwards while zOrder is smaller or when zOrder is the same but mutatedIndex is smaller

          while (j >= 0) {
            if (child._localZOrder < _children[j]._localZOrder) {
              _children[j + 1] = _children[j];
            } else {
              break;
            }

            j--;
          }

          _children[j + 1] = child;
        }

        this.emit(EventType.CHILD_REORDER, this);
      }

      cc.director.__fastOff(cc.Director.EVENT_AFTER_UPDATE, this.sortAllChildren, this);
    }
  },
  _delaySort: function _delaySort() {
    if (!this._reorderChildDirty) {
      this._reorderChildDirty = true;

      cc.director.__fastOn(cc.Director.EVENT_AFTER_UPDATE, this.sortAllChildren, this);
    }
  },
  _restoreProperties: CC_EDITOR && function () {
    /*
     * TODO: Refine this code after completing undo/redo 2.0.
     * The node will be destroyed when deleting in the editor,
     * but it will be reserved and reused for undo.
    */
    // restore 3d node
    this.is3DNode = this.is3DNode;

    if (!this._matrix) {
      this._matrix = cc.mat4(this._spaceInfo.localMat);

      _valueTypes.Mat4.identity(this._matrix);
    }

    if (!this._worldMatrix) {
      this._worldMatrix = cc.mat4(this._spaceInfo.worldMat);

      _valueTypes.Mat4.identity(this._worldMatrix);
    }

    this._localMatDirty = LocalDirtyFlag.ALL;
    this._worldMatDirty = true;

    this._fromEuler();

    this._renderFlag |= RenderFlow.FLAG_TRANSFORM;

    if (this._renderComponent) {
      this._renderComponent.markForRender(true);
    }

    if (this._children.length > 0) {
      this._renderFlag |= RenderFlow.FLAG_CHILDREN;
    }
  },
  onRestore: CC_EDITOR && function () {
    this._onRestoreBase();

    this._restoreProperties();

    var actionManager = cc.director.getActionManager();

    if (this._activeInHierarchy) {
      actionManager && actionManager.resumeTarget(this);
      eventManager.resumeTarget(this);
    } else {
      actionManager && actionManager.pauseTarget(this);
      eventManager.pauseTarget(this);
    }
  }
};

if (CC_EDITOR) {
  // deprecated, only used to import old data in editor
  js.mixin(NodeDefines.properties, {
    _scaleX: {
      "default": undefined,
      type: cc.Float,
      editorOnly: true
    },
    _scaleY: {
      "default": undefined,
      type: cc.Float,
      editorOnly: true
    }
  });
}

var Node = cc.Class(NodeDefines); // 3D Node Property
// Node Event

/**
 * !#en
 * The position changing event, you can listen to this event through the statement this.node.on(cc.Node.EventType.POSITION_CHANGED, callback, this);
 * !#zh
 * 位置变动监听事件, 通过 this.node.on(cc.Node.EventType.POSITION_CHANGED, callback, this); 进行监听。
 * @event position-changed
 * @param {Vec2} oldPos - The old position, but this parameter is only available in editor!
 */

/**
 * !#en
 * The size changing event, you can listen to this event through the statement this.node.on(cc.Node.EventType.SIZE_CHANGED, callback, this);
 * !#zh
 * 尺寸变动监听事件，通过 this.node.on(cc.Node.EventType.SIZE_CHANGED, callback, this); 进行监听。
 * @event size-changed
 * @param {Size} oldSize - The old size, but this parameter is only available in editor!
 */

/**
 * !#en
 * The anchor changing event, you can listen to this event through the statement this.node.on(cc.Node.EventType.ANCHOR_CHANGED, callback, this);
 * !#zh
 * 锚点变动监听事件，通过 this.node.on(cc.Node.EventType.ANCHOR_CHANGED, callback, this); 进行监听。
 * @event anchor-changed
 */

/**
 * !#en
 * The adding child event, you can listen to this event through the statement this.node.on(cc.Node.EventType.CHILD_ADDED, callback, this);
 * !#zh
 * 增加子节点监听事件，通过 this.node.on(cc.Node.EventType.CHILD_ADDED, callback, this); 进行监听。
 * @event child-added
 * @param {Node} child - child which have been added
 */

/**
 * !#en
 * The removing child event, you can listen to this event through the statement this.node.on(cc.Node.EventType.CHILD_REMOVED, callback, this);
 * !#zh
 * 删除子节点监听事件，通过 this.node.on(cc.Node.EventType.CHILD_REMOVED, callback, this); 进行监听。
 * @event child-removed
 * @param {Node} child - child which have been removed
 */

/**
 * !#en
 * The reordering child event, you can listen to this event through the statement this.node.on(cc.Node.EventType.CHILD_REORDER, callback, this);
 * !#zh
 * 子节点顺序变动监听事件，通过 this.node.on(cc.Node.EventType.CHILD_REORDER, callback, this); 进行监听。
 * @event child-reorder
 * @param {Node} node - node whose children have been reordered
 */

/**
 * !#en
 * The group changing event, you can listen to this event through the statement this.node.on(cc.Node.EventType.GROUP_CHANGED, callback, this);
 * !#zh
 * 节点分组变动监听事件，通过 this.node.on(cc.Node.EventType.GROUP_CHANGED, callback, this); 进行监听。
 * @event group-changed
 * @param {Node} node - node whose group has changed
 */
// Deprecated APIs

/**
 * !#en
 * Returns the displayed opacity of Node,
 * the difference between displayed opacity and opacity is that displayed opacity is calculated based on opacity and parent node's opacity when cascade opacity enabled.
 * !#zh
 * 获取节点显示透明度，
 * 显示透明度和透明度之间的不同之处在于当启用级连透明度时，
 * 显示透明度是基于自身透明度和父节点透明度计算的。
 *
 * @method getDisplayedOpacity
 * @return {number} displayed opacity
 * @deprecated since v2.0, please use opacity property, cascade opacity is removed
 */

/**
 * !#en
 * Returns the displayed color of Node,
 * the difference between displayed color and color is that displayed color is calculated based on color and parent node's color when cascade color enabled.
 * !#zh
 * 获取节点的显示颜色，
 * 显示颜色和颜色之间的不同之处在于当启用级连颜色时，
 * 显示颜色是基于自身颜色和父节点颜色计算的。
 *
 * @method getDisplayedColor
 * @return {Color}
 * @deprecated since v2.0, please use color property, cascade color is removed
 */

/**
 * !#en Cascade opacity is removed from v2.0
 * Indicate whether node's opacity value affect its child nodes, default value is true.
 * !#zh 透明度级联功能从 v2.0 开始已移除
 * 节点的不透明度值是否影响其子节点，默认值为 true。
 * @property cascadeOpacity
 * @deprecated since v2.0
 * @type {Boolean}
 */

/**
 * !#en Cascade opacity is removed from v2.0
 * Returns whether node's opacity value affect its child nodes.
 * !#zh 透明度级联功能从 v2.0 开始已移除
 * 返回节点的不透明度值是否影响其子节点。
 * @method isCascadeOpacityEnabled
 * @deprecated since v2.0
 * @return {Boolean}
 */

/**
 * !#en Cascade opacity is removed from v2.0
 * Enable or disable cascade opacity, if cascade enabled, child nodes' opacity will be the multiplication of parent opacity and its own opacity.
 * !#zh 透明度级联功能从 v2.0 开始已移除
 * 启用或禁用级连不透明度，如果级连启用，子节点的不透明度将是父不透明度乘上它自己的不透明度。
 * @method setCascadeOpacityEnabled
 * @deprecated since v2.0
 * @param {Boolean} cascadeOpacityEnabled
 */

/**
 * !#en Opacity modify RGB have been removed since v2.0
 * Set whether color should be changed with the opacity value,
 * useless in ccsg.Node, but this function is override in some class to have such behavior.
 * !#zh 透明度影响颜色配置已经被废弃
 * 设置更改透明度时是否修改RGB值，
 * @method setOpacityModifyRGB
 * @deprecated since v2.0
 * @param {Boolean} opacityValue
 */

/**
 * !#en Opacity modify RGB have been removed since v2.0
 * Get whether color should be changed with the opacity value.
 * !#zh 透明度影响颜色配置已经被废弃
 * 获取更改透明度时是否修改RGB值。
 * @method isOpacityModifyRGB
 * @deprecated since v2.0
 * @return {Boolean}
 */

var _p = Node.prototype;
js.getset(_p, 'position', _p.getPosition, _p.setPosition, false, true);

if (CC_EDITOR) {
  var vec3_tmp = new _valueTypes.Vec3();
  cc.js.getset(_p, 'worldEulerAngles', function () {
    var angles = new _valueTypes.Vec3(this._eulerAngles);
    var parent = this.parent;

    while (parent) {
      angles.addSelf(parent._eulerAngles);
      parent = parent.parent;
    }

    return angles;
  }, function (v) {
    vec3_tmp.set(v);
    var parent = this.parent;

    while (parent) {
      vec3_tmp.subSelf(parent._eulerAngles);
      parent = parent.parent;
    }

    this.eulerAngles = vec3_tmp;
  });
}

cc.Node = module.exports = Node;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDTm9kZS5qcyJdLCJuYW1lcyI6WyJCYXNlTm9kZSIsInJlcXVpcmUiLCJQcmVmYWJIZWxwZXIiLCJub2RlTWVtUG9vbCIsIk5vZGVNZW1Qb29sIiwiQWZmaW5lVHJhbnMiLCJldmVudE1hbmFnZXIiLCJtYWNybyIsImpzIiwiRXZlbnQiLCJFdmVudFRhcmdldCIsIlJlbmRlckZsb3ciLCJGbGFncyIsImNjIiwiT2JqZWN0IiwiRGVzdHJveWluZyIsIkVSUl9JTlZBTElEX05VTUJFUiIsIkNDX0VESVRPUiIsIk9ORV9ERUdSRUUiLCJNYXRoIiwiUEkiLCJBY3Rpb25NYW5hZ2VyRXhpc3QiLCJBY3Rpb25NYW5hZ2VyIiwiZW1wdHlGdW5jIiwiX2d3cFZlYzMiLCJWZWMzIiwiX2d3cFF1YXQiLCJRdWF0IiwiX3RwVmVjM2EiLCJfdHBWZWMzYiIsIl90cFF1YXRhIiwiX3RwUXVhdGIiLCJfc3dwVmVjMyIsIl9nd3NWZWMzIiwiX3N3c1ZlYzMiLCJfZ3dydFZlYzNhIiwiX2d3cnRWZWMzYiIsIl9nd3J0UXVhdGEiLCJfZ3dydFF1YXRiIiwiX2xhVmVjMyIsIl9sYVF1YXQiLCJfaHRWZWMzYSIsIl9odFZlYzNiIiwiX2d3clF1YXQiLCJfc3dyUXVhdCIsIl9xdWF0YSIsIl9tYXQ0X3RlbXAiLCJtYXQ0IiwiX3ZlYzNfdGVtcCIsIl9jYWNoZWRBcnJheSIsIkFycmF5IiwibGVuZ3RoIiwiUE9TSVRJT05fT04iLCJTQ0FMRV9PTiIsIlJPVEFUSU9OX09OIiwiU0laRV9PTiIsIkFOQ0hPUl9PTiIsIkNPTE9SX09OIiwiQnVpbHRpbkdyb3VwSW5kZXgiLCJFbnVtIiwiREVCVUciLCJMb2NhbERpcnR5RmxhZyIsIlBPU0lUSU9OIiwiU0NBTEUiLCJST1RBVElPTiIsIlNLRVciLCJUUlMiLCJSUyIsIlRSU1MiLCJQSFlTSUNTX1BPU0lUSU9OIiwiUEhZU0lDU19TQ0FMRSIsIlBIWVNJQ1NfUk9UQVRJT04iLCJQSFlTSUNTX1RSUyIsIlBIWVNJQ1NfUlMiLCJBTExfUE9TSVRJT04iLCJBTExfU0NBTEUiLCJBTExfUk9UQVRJT04iLCJBTExfVFJTIiwiQUxMIiwiRXZlbnRUeXBlIiwiVE9VQ0hfU1RBUlQiLCJUT1VDSF9NT1ZFIiwiVE9VQ0hfRU5EIiwiVE9VQ0hfQ0FOQ0VMIiwiTU9VU0VfRE9XTiIsIk1PVVNFX01PVkUiLCJNT1VTRV9FTlRFUiIsIk1PVVNFX0xFQVZFIiwiTU9VU0VfVVAiLCJNT1VTRV9XSEVFTCIsIlBPU0lUSU9OX0NIQU5HRUQiLCJST1RBVElPTl9DSEFOR0VEIiwiU0NBTEVfQ0hBTkdFRCIsIlNJWkVfQ0hBTkdFRCIsIkFOQ0hPUl9DSEFOR0VEIiwiQ09MT1JfQ0hBTkdFRCIsIkNISUxEX0FEREVEIiwiQ0hJTERfUkVNT1ZFRCIsIkNISUxEX1JFT1JERVIiLCJHUk9VUF9DSEFOR0VEIiwiU0lCTElOR19PUkRFUl9DSEFOR0VEIiwiX3RvdWNoRXZlbnRzIiwiX21vdXNlRXZlbnRzIiwiX3NrZXdOZWVkV2FybiIsIl9za2V3V2FybiIsInZhbHVlIiwibm9kZSIsIm5vZGVQYXRoIiwiTm9kZVV0aWxzIiwiRWRpdG9yIiwiZ2V0Tm9kZVBhdGgiLCJ3YXJuIiwiX2N1cnJlbnRIb3ZlcmVkIiwiX3RvdWNoU3RhcnRIYW5kbGVyIiwidG91Y2giLCJldmVudCIsInBvcyIsImdldExvY2F0aW9uIiwib3duZXIiLCJfaGl0VGVzdCIsInR5cGUiLCJidWJibGVzIiwiZGlzcGF0Y2hFdmVudCIsIl90b3VjaE1vdmVIYW5kbGVyIiwiX3RvdWNoRW5kSGFuZGxlciIsIl90b3VjaENhbmNlbEhhbmRsZXIiLCJfbW91c2VEb3duSGFuZGxlciIsIl9tb3VzZU1vdmVIYW5kbGVyIiwiaGl0IiwiX3ByZXZpb3VzSW4iLCJfbW91c2VMaXN0ZW5lciIsInN0b3BQcm9wYWdhdGlvbiIsIl9tb3VzZVVwSGFuZGxlciIsIl9tb3VzZVdoZWVsSGFuZGxlciIsIl9zZWFyY2hDb21wb25lbnRzSW5QYXJlbnQiLCJjb21wIiwiaW5kZXgiLCJsaXN0IiwiY3VyciIsIk5vZGUiLCJpc05vZGUiLCJfcGFyZW50IiwiZ2V0Q29tcG9uZW50IiwibmV4dCIsInB1c2giLCJfY2hlY2tMaXN0ZW5lcnMiLCJldmVudHMiLCJfb2JqRmxhZ3MiLCJpIiwiX2J1YmJsaW5nTGlzdGVuZXJzIiwiaGFzRXZlbnRMaXN0ZW5lciIsIl9jYXB0dXJpbmdMaXN0ZW5lcnMiLCJfZG9EaXNwYXRjaEV2ZW50IiwidGFyZ2V0IiwiX2dldENhcHR1cmluZ1RhcmdldHMiLCJldmVudFBoYXNlIiwiY3VycmVudFRhcmdldCIsImVtaXQiLCJfcHJvcGFnYXRpb25TdG9wcGVkIiwiX3Byb3BhZ2F0aW9uSW1tZWRpYXRlU3RvcHBlZCIsIl9nZXRCdWJibGluZ1RhcmdldHMiLCJfZ2V0QWN0dWFsR3JvdXBJbmRleCIsImdyb3VwSW5kZXgiLCJwYXJlbnQiLCJfdXBkYXRlQ3VsbGluZ01hc2siLCJfY3VsbGluZ01hc2siLCJDQ19KU0IiLCJDQ19OQVRJVkVSRU5ERVJFUiIsIl9wcm94eSIsInVwZGF0ZUN1bGxpbmdNYXNrIiwiX2NoaWxkcmVuIiwidXBkYXRlTG9jYWxNYXRyaXgzRCIsIl9sb2NhbE1hdERpcnR5IiwidCIsIl9tYXRyaXgiLCJ0bSIsIm0iLCJUcnMiLCJ0b01hdDQiLCJfdHJzIiwiX3NrZXdYIiwiX3NrZXdZIiwiYSIsImIiLCJjIiwiZCIsInNreCIsInRhbiIsInNreSIsIkluZmluaXR5IiwiX3dvcmxkTWF0RGlydHkiLCJ1cGRhdGVMb2NhbE1hdHJpeDJEIiwiZGlydHlGbGFnIiwidHJzIiwicm90YXRpb24iLCJfZXVsZXJBbmdsZXMiLCJ6IiwiaGFzU2tldyIsInN4Iiwic3kiLCJyb3RhdGlvblJhZGlhbnMiLCJzaW4iLCJjb3MiLCJjYWxjdWxXb3JsZE1hdHJpeDNEIiwiX3VwZGF0ZUxvY2FsTWF0cml4IiwicGFyZW50TWF0IiwiX3dvcmxkTWF0cml4IiwiTWF0NCIsIm11bCIsImNvcHkiLCJjYWxjdWxXb3JsZE1hdHJpeDJEIiwiX211bE1hdCIsIm11bE1hdDJEIiwib3V0IiwiYW0iLCJibSIsIm91dG0iLCJhYSIsImFiIiwiYWMiLCJhZCIsImF0eCIsImF0eSIsImJhIiwiYmIiLCJiYyIsImJkIiwiYnR4IiwiYnR5IiwibXVsTWF0M0QiLCJOb2RlRGVmaW5lcyIsIm5hbWUiLCJwcm9wZXJ0aWVzIiwiX29wYWNpdHkiLCJfY29sb3IiLCJDb2xvciIsIldISVRFIiwiX2NvbnRlbnRTaXplIiwiU2l6ZSIsIl9hbmNob3JQb2ludCIsInYyIiwiX3Bvc2l0aW9uIiwidW5kZWZpbmVkIiwiX3NjYWxlIiwiX3pJbmRleCIsIkludGVnZXIiLCJfbG9jYWxaT3JkZXIiLCJzZXJpYWxpemFibGUiLCJfaXMzRE5vZGUiLCJfZ3JvdXBJbmRleCIsImZvcm1lcmx5U2VyaWFsaXplZEFzIiwiZ2V0Iiwic2V0IiwiZ3JvdXAiLCJnYW1lIiwiZ3JvdXBMaXN0IiwiaW5kZXhPZiIsIngiLCJpc0Zpbml0ZSIsIm9sZFZhbHVlIiwic2V0TG9jYWxEaXJ0eSIsIl9ldmVudE1hc2siLCJlcnJvciIsInkiLCJfcmVuZGVyRmxhZyIsIkZMQUdfV09STERfVFJBTlNGT1JNIiwiQ0NfREVCVUciLCJhbmdsZSIsImZyb21BbmdsZVoiLCJyb3RhdGlvblgiLCJmcm9tRXVsZXJOdW1iZXIiLCJyb3RhdGlvblkiLCJldWxlckFuZ2xlcyIsInRvRXVsZXIiLCJ2IiwiZnJvbUV1bGVyIiwiRkxBR19UUkFOU0ZPUk0iLCJxdWF0Iiwic2V0Um90YXRpb24iLCJzY2FsZSIsInNldFNjYWxlIiwic2NhbGVYIiwic2NhbGVZIiwic2NhbGVaIiwic2tld1giLCJ1cGRhdGVTa2V3Iiwic2tld1kiLCJvcGFjaXR5IiwibWlzYyIsImNsYW1wZiIsInVwZGF0ZU9wYWNpdHkiLCJGTEFHX09QQUNJVFlfQ09MT1IiLCJyYW5nZSIsImNvbG9yIiwiY2xvbmUiLCJlcXVhbHMiLCJDQ19ERVYiLCJ3YXJuSUQiLCJGTEFHX0NPTE9SIiwiYW5jaG9yWCIsImFuY2hvclBvaW50IiwiYW5jaG9yWSIsIndpZHRoIiwic2l6ZSIsImhlaWdodCIsInpJbmRleCIsIk1BWF9aSU5ERVgiLCJNSU5fWklOREVYIiwiX29uU2libGluZ0luZGV4Q2hhbmdlZCIsImlzM0ROb2RlIiwiX3VwZGF0ZTNERnVuY3Rpb24iLCJjdG9yIiwiX3Jlb3JkZXJDaGlsZERpcnR5IiwiX3dpZGdldCIsIl9yZW5kZXJDb21wb25lbnQiLCJfdG91Y2hMaXN0ZW5lciIsIl9pbml0RGF0YUZyb21Qb29sIiwiX2NoaWxkQXJyaXZhbE9yZGVyIiwicmVuZGVyZXIiLCJOb2RlUHJveHkiLCJfc3BhY2VJbmZvIiwidW5pdElEIiwiX2lkIiwiX25hbWUiLCJpbml0Iiwic3RhdGljcyIsIl9Mb2NhbERpcnR5RmxhZyIsIm9iaiIsImNvbnN0cnVjdG9yIiwiU2NlbmUiLCJfZGVsYXlTb3J0IiwiX29uUHJlRGVzdHJveSIsImRlc3Ryb3lCeVBhcmVudCIsIl9vblByZURlc3Ryb3lCYXNlIiwiZGlyZWN0b3IiLCJnZXRBY3Rpb25NYW5hZ2VyIiwicmVtb3ZlQWxsQWN0aW9uc0Zyb21UYXJnZXQiLCJyZW1vdmVMaXN0ZW5lcnMiLCJtYXNrIiwiZGVzdHJveSIsIl9iYWNrRGF0YUludG9Qb29sIiwiX19mYXN0T2ZmIiwiRGlyZWN0b3IiLCJFVkVOVF9BRlRFUl9VUERBVEUiLCJzb3J0QWxsQ2hpbGRyZW4iLCJfb25Qb3N0QWN0aXZhdGVkIiwiYWN0aXZlIiwiYWN0aW9uTWFuYWdlciIsInJlc3VtZVRhcmdldCIsIl9jaGVja0xpc3RlbmVyTWFzayIsInBhdXNlVGFyZ2V0IiwiX29uSGllcmFyY2h5Q2hhbmdlZCIsIm9sZFBhcmVudCIsIl91cGRhdGVPcmRlck9mQXJyaXZhbCIsIl9vbkhpZXJhcmNoeUNoYW5nZWRCYXNlIiwiX3dpZGdldE1hbmFnZXIiLCJfbm9kZXNPcmRlckRpcnR5IiwiX2FjdGl2ZUluSGllcmFyY2h5IiwidXBkYXRlUGFyZW50IiwiX2NhbGN1bFdvcmxkTWF0cml4IiwiX29uM0ROb2RlQ2hhbmdlZCIsInVwZGF0ZTNETm9kZSIsIkNDX1RFU1QiLCJGbG9hdDY0QXJyYXkiLCJsb2NhbE1hdCIsIndvcmxkTWF0IiwicG9wIiwic3BhY2VJbmZvIiwiaWRlbnRpdHkiLCJfdG9FdWxlciIsImFzaW4iLCJfZnJvbUV1bGVyIiwiX3VwZ3JhZGVfMXhfdG9fMngiLCJkZXNUcnMiLCJzdWJhcnJheSIsIl9vbkJhdGNoQ3JlYXRlZCIsInByZWZhYkluZm8iLCJfcHJlZmFiIiwic3luYyIsInJvb3QiLCJhc3NlcnQiLCJfc3luY2VkIiwic3luY1dpdGhQcmVmYWIiLCJjaGlsZHJlbiIsImxlbiIsIkZMQUdfQ0hJTERSRU4iLCJpbml0TmF0aXZlIiwiX29uQmF0Y2hSZXN0b3JlZCIsIm1hbmFnZXIiLCJNYXNrIiwiX2NoZWNrblNldHVwU3lzRXZlbnQiLCJuZXdBZGRlZCIsImZvckRpc3BhdGNoIiwiRXZlbnRMaXN0ZW5lciIsImNyZWF0ZSIsIlRPVUNIX09ORV9CWV9PTkUiLCJzd2FsbG93VG91Y2hlcyIsIm9uVG91Y2hCZWdhbiIsIm9uVG91Y2hNb3ZlZCIsIm9uVG91Y2hFbmRlZCIsIm9uVG91Y2hDYW5jZWxsZWQiLCJhZGRMaXN0ZW5lciIsIk1PVVNFIiwib25Nb3VzZURvd24iLCJvbk1vdXNlTW92ZSIsIm9uTW91c2VVcCIsIm9uTW91c2VTY3JvbGwiLCJnZXRTY2hlZHVsZXIiLCJzY2hlZHVsZSIsIm9uIiwiY2FsbGJhY2siLCJ1c2VDYXB0dXJlIiwiX29uRGlzcGF0Y2giLCJvbmNlIiwibGlzdGVuZXJzIiwiZXJyb3JJRCIsIl9fZXZlbnRUYXJnZXRzIiwib2ZmIiwidG91Y2hFdmVudCIsIm1vdXNlRXZlbnQiLCJfb2ZmRGlzcGF0Y2giLCJyZW1vdmVMaXN0ZW5lciIsImhhc0xpc3RlbmVycyIsInJlbW92ZUFsbCIsImFycmF5IiwiZmFzdFJlbW92ZSIsInRhcmdldE9mZiIsImhhcyIsImFyZzEiLCJhcmcyIiwiYXJnMyIsImFyZzQiLCJhcmc1IiwicGF1c2VTeXN0ZW1FdmVudHMiLCJyZWN1cnNpdmUiLCJyZXN1bWVTeXN0ZW1FdmVudHMiLCJwb2ludCIsImxpc3RlbmVyIiwidyIsImgiLCJjYW1lcmFQdCIsInRlc3RQdCIsImNhbWVyYSIsIkNhbWVyYSIsImZpbmRDYW1lcmEiLCJnZXRTY3JlZW5Ub1dvcmxkUG9pbnQiLCJfdXBkYXRlV29ybGRNYXRyaXgiLCJpbnZlcnQiLCJWZWMyIiwidHJhbnNmb3JtTWF0NCIsImoiLCJ0ZW1wIiwiX2VuYWJsZWQiLCJydW5BY3Rpb24iLCJhY3Rpb24iLCJhc3NlcnRJRCIsImFkZEFjdGlvbiIsInBhdXNlQWxsQWN0aW9ucyIsInJlc3VtZUFsbEFjdGlvbnMiLCJzdG9wQWxsQWN0aW9ucyIsInN0b3BBY3Rpb24iLCJyZW1vdmVBY3Rpb24iLCJzdG9wQWN0aW9uQnlUYWciLCJ0YWciLCJBY3Rpb24iLCJUQUdfSU5WQUxJRCIsImxvZ0lEIiwicmVtb3ZlQWN0aW9uQnlUYWciLCJnZXRBY3Rpb25CeVRhZyIsImdldE51bWJlck9mUnVubmluZ0FjdGlvbnMiLCJnZXROdW1iZXJPZlJ1bm5pbmdBY3Rpb25zSW5UYXJnZXQiLCJnZXRQb3NpdGlvbiIsInRvUG9zaXRpb24iLCJzZXRQb3NpdGlvbiIsIm5ld1Bvc09yWCIsIm9sZFBvc2l0aW9uIiwiZ2V0U2NhbGUiLCJ0b1NjYWxlIiwiZ2V0Um90YXRpb24iLCJ0b1JvdGF0aW9uIiwiZ2V0Q29udGVudFNpemUiLCJzZXRDb250ZW50U2l6ZSIsImxvY0NvbnRlbnRTaXplIiwiZ2V0QW5jaG9yUG9pbnQiLCJzZXRBbmNob3JQb2ludCIsImxvY0FuY2hvclBvaW50IiwiX2ludlRyYW5zZm9ybVBvaW50IiwibHRycyIsInN1YiIsImNvbmp1Z2F0ZSIsInRyYW5zZm9ybVF1YXQiLCJpbnZlcnNlU2FmZSIsImdldFdvcmxkUG9zaXRpb24iLCJhZGQiLCJzZXRXb3JsZFBvc2l0aW9uIiwiZnJvbVBvc2l0aW9uIiwiZ2V0V29ybGRSb3RhdGlvbiIsInNldFdvcmxkUm90YXRpb24iLCJ2YWwiLCJmcm9tUm90YXRpb24iLCJnZXRXb3JsZFNjYWxlIiwic2V0V29ybGRTY2FsZSIsImRpdiIsImZyb21TY2FsZSIsImdldFdvcmxkUlQiLCJvcG9zIiwib3JvdCIsImZyb21SVCIsImxvb2tBdCIsInVwIiwibm9ybWFsaXplIiwiZnJvbVZpZXdVcCIsImwiLCJmbGFnIiwic2V0V29ybGREaXJ0eSIsImdldExvY2FsTWF0cml4IiwiZ2V0V29ybGRNYXRyaXgiLCJjb252ZXJ0VG9Ob2RlU3BhY2VBUiIsIndvcmxkUG9pbnQiLCJjb252ZXJ0VG9Xb3JsZFNwYWNlQVIiLCJub2RlUG9pbnQiLCJjb252ZXJ0VG9Ob2RlU3BhY2UiLCJjb252ZXJ0VG9Xb3JsZFNwYWNlIiwiZ2V0Tm9kZVRvUGFyZW50VHJhbnNmb3JtIiwiY29udGVudFNpemUiLCJ0cmFuc2Zvcm0iLCJmcm9tTWF0NCIsImdldE5vZGVUb1BhcmVudFRyYW5zZm9ybUFSIiwiZ2V0Tm9kZVRvV29ybGRUcmFuc2Zvcm0iLCJnZXROb2RlVG9Xb3JsZFRyYW5zZm9ybUFSIiwiZ2V0UGFyZW50VG9Ob2RlVHJhbnNmb3JtIiwiZ2V0V29ybGRUb05vZGVUcmFuc2Zvcm0iLCJjb252ZXJ0VG91Y2hUb05vZGVTcGFjZSIsImNvbnZlcnRUb3VjaFRvTm9kZVNwYWNlQVIiLCJnZXRCb3VuZGluZ0JveCIsInJlY3QiLCJnZXRCb3VuZGluZ0JveFRvV29ybGQiLCJfZ2V0Qm91bmRpbmdCb3hUbyIsImxvY0NoaWxkcmVuIiwiY2hpbGQiLCJjaGlsZFJlY3QiLCJ1bmlvbiIsImFycml2YWxPcmRlciIsImFkZENoaWxkIiwiZ2V0Q2xhc3NOYW1lIiwiY2xlYW51cCIsIl9zZXREaXJ0eUZvck5vZGUiLCJfX2Zhc3RPbiIsIl9yZXN0b3JlUHJvcGVydGllcyIsIm1hcmtGb3JSZW5kZXIiLCJvblJlc3RvcmUiLCJfb25SZXN0b3JlQmFzZSIsIm1peGluIiwiX3NjYWxlWCIsIkZsb2F0IiwiZWRpdG9yT25seSIsIl9zY2FsZVkiLCJDbGFzcyIsIl9wIiwicHJvdG90eXBlIiwiZ2V0c2V0IiwidmVjM190bXAiLCJhbmdsZXMiLCJhZGRTZWxmIiwic3ViU2VsZiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3Mi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QkFBakIsRUFBcUMsWUFBWTtBQUM3QyxRQUFJSSxNQUFNLEdBQUcsSUFBSXpoQixnQkFBSixDQUFTLEtBQUswSyxZQUFkLENBQWI7QUFDQSxRQUFJaEMsTUFBTSxHQUFHLEtBQUtBLE1BQWxCOztBQUNBLFdBQU9BLE1BQVAsRUFBZTtBQUNYK1ksTUFBQUEsTUFBTSxDQUFDQyxPQUFQLENBQWVoWixNQUFNLENBQUNnQyxZQUF0QjtBQUNBaEMsTUFBQUEsTUFBTSxHQUFHQSxNQUFNLENBQUNBLE1BQWhCO0FBQ0g7O0FBQ0QsV0FBTytZLE1BQVA7QUFDSCxHQVJELEVBUUcsVUFBVWhTLENBQVYsRUFBYTtBQUNaK1IsSUFBQUEsUUFBUSxDQUFDclQsR0FBVCxDQUFhc0IsQ0FBYjtBQUNBLFFBQUkvRyxNQUFNLEdBQUcsS0FBS0EsTUFBbEI7O0FBQ0EsV0FBT0EsTUFBUCxFQUFlO0FBQ1g4WSxNQUFBQSxRQUFRLENBQUNHLE9BQVQsQ0FBaUJqWixNQUFNLENBQUNnQyxZQUF4QjtBQUNBaEMsTUFBQUEsTUFBTSxHQUFHQSxNQUFNLENBQUNBLE1BQWhCO0FBQ0g7O0FBQ0QsU0FBSzZHLFdBQUwsR0FBbUJpUyxRQUFuQjtBQUNILEdBaEJEO0FBaUJIOztBQUVEcGlCLEVBQUUsQ0FBQzhILElBQUgsR0FBVTBhLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjNhLElBQTNCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwOi8vd3d3LmNvY29zMmQteC5vcmdcblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHsgTWF0NCwgVmVjMiwgVmVjMywgUXVhdCwgVHJzIH0gZnJvbSAnLi92YWx1ZS10eXBlcyc7XG5cbmNvbnN0IEJhc2VOb2RlID0gcmVxdWlyZSgnLi91dGlscy9iYXNlLW5vZGUnKTtcbmNvbnN0IFByZWZhYkhlbHBlciA9IHJlcXVpcmUoJy4vdXRpbHMvcHJlZmFiLWhlbHBlcicpO1xuY29uc3Qgbm9kZU1lbVBvb2wgPSByZXF1aXJlKCcuL3V0aWxzL3RyYW5zLXBvb2wnKS5Ob2RlTWVtUG9vbDtcbmNvbnN0IEFmZmluZVRyYW5zID0gcmVxdWlyZSgnLi91dGlscy9hZmZpbmUtdHJhbnNmb3JtJyk7XG5jb25zdCBldmVudE1hbmFnZXIgPSByZXF1aXJlKCcuL2V2ZW50LW1hbmFnZXInKTtcbmNvbnN0IG1hY3JvID0gcmVxdWlyZSgnLi9wbGF0Zm9ybS9DQ01hY3JvJyk7XG5jb25zdCBqcyA9IHJlcXVpcmUoJy4vcGxhdGZvcm0vanMnKTtcbmNvbnN0IEV2ZW50ID0gcmVxdWlyZSgnLi9ldmVudC9ldmVudCcpO1xuY29uc3QgRXZlbnRUYXJnZXQgPSByZXF1aXJlKCcuL2V2ZW50L2V2ZW50LXRhcmdldCcpO1xuY29uc3QgUmVuZGVyRmxvdyA9IHJlcXVpcmUoJy4vcmVuZGVyZXIvcmVuZGVyLWZsb3cnKTtcblxuY29uc3QgRmxhZ3MgPSBjYy5PYmplY3QuRmxhZ3M7XG5jb25zdCBEZXN0cm95aW5nID0gRmxhZ3MuRGVzdHJveWluZztcblxuY29uc3QgRVJSX0lOVkFMSURfTlVNQkVSID0gQ0NfRURJVE9SICYmICdUaGUgJXMgaXMgaW52YWxpZCc7XG5jb25zdCBPTkVfREVHUkVFID0gTWF0aC5QSSAvIDE4MDtcblxudmFyIEFjdGlvbk1hbmFnZXJFeGlzdCA9ICEhY2MuQWN0aW9uTWFuYWdlcjtcbnZhciBlbXB0eUZ1bmMgPSBmdW5jdGlvbiAoKSB7fTtcblxuLy8gZ2V0V29ybGRQb3NpdGlvbiB0ZW1wIHZhclxudmFyIF9nd3BWZWMzID0gbmV3IFZlYzMoKTtcbnZhciBfZ3dwUXVhdCA9IG5ldyBRdWF0KCk7XG5cbi8vIF9pbnZUcmFuc2Zvcm1Qb2ludCB0ZW1wIHZhclxudmFyIF90cFZlYzNhID0gbmV3IFZlYzMoKTtcbnZhciBfdHBWZWMzYiA9IG5ldyBWZWMzKCk7XG52YXIgX3RwUXVhdGEgPSBuZXcgUXVhdCgpO1xudmFyIF90cFF1YXRiID0gbmV3IFF1YXQoKTtcblxuLy8gc2V0V29ybGRQb3NpdGlvbiB0ZW1wIHZhclxudmFyIF9zd3BWZWMzID0gbmV3IFZlYzMoKTtcblxuLy8gZ2V0V29ybGRTY2FsZSB0ZW1wIHZhclxudmFyIF9nd3NWZWMzID0gbmV3IFZlYzMoKTtcblxuLy8gc2V0V29ybGRTY2FsZSB0ZW1wIHZhclxudmFyIF9zd3NWZWMzID0gbmV3IFZlYzMoKTtcblxuLy8gZ2V0V29ybGRSVCB0ZW1wIHZhclxudmFyIF9nd3J0VmVjM2EgPSBuZXcgVmVjMygpO1xudmFyIF9nd3J0VmVjM2IgPSBuZXcgVmVjMygpO1xudmFyIF9nd3J0UXVhdGEgPSBuZXcgUXVhdCgpO1xudmFyIF9nd3J0UXVhdGIgPSBuZXcgUXVhdCgpO1xuXG4vLyBsb29rQXQgdGVtcCB2YXJcbnZhciBfbGFWZWMzID0gbmV3IFZlYzMoKTtcbnZhciBfbGFRdWF0ID0gbmV3IFF1YXQoKTtcblxuLy8gX2hpdFRlc3QgdGVtcCB2YXJcbnZhciBfaHRWZWMzYSA9IG5ldyBWZWMzKCk7XG52YXIgX2h0VmVjM2IgPSBuZXcgVmVjMygpO1xuXG4vLyBnZXRXb3JsZFJvdGF0aW9uIHRlbXAgdmFyXG52YXIgX2d3clF1YXQgPSBuZXcgUXVhdCgpO1xuXG4vLyBzZXRXb3JsZFJvdGF0aW9uIHRlbXAgdmFyXG52YXIgX3N3clF1YXQgPSBuZXcgUXVhdCgpO1xuXG52YXIgX3F1YXRhID0gbmV3IFF1YXQoKTtcbnZhciBfbWF0NF90ZW1wID0gY2MubWF0NCgpO1xudmFyIF92ZWMzX3RlbXAgPSBuZXcgVmVjMygpO1xuXG52YXIgX2NhY2hlZEFycmF5ID0gbmV3IEFycmF5KDE2KTtcbl9jYWNoZWRBcnJheS5sZW5ndGggPSAwO1xuXG5jb25zdCBQT1NJVElPTl9PTiA9IDEgPDwgMDtcbmNvbnN0IFNDQUxFX09OID0gMSA8PCAxO1xuY29uc3QgUk9UQVRJT05fT04gPSAxIDw8IDI7XG5jb25zdCBTSVpFX09OID0gMSA8PCAzO1xuY29uc3QgQU5DSE9SX09OID0gMSA8PCA0O1xuY29uc3QgQ09MT1JfT04gPSAxIDw8IDU7XG5cblxubGV0IEJ1aWx0aW5Hcm91cEluZGV4ID0gY2MuRW51bSh7XG4gICAgREVCVUc6IDMxXG59KTtcblxuLyoqXG4gKiAhI2VuIE5vZGUncyBsb2NhbCBkaXJ0eSBwcm9wZXJ0aWVzIGZsYWdcbiAqICEjemggTm9kZSDnmoTmnKzlnLDlsZ7mgKcgZGlydHkg54q25oCB5L2NXG4gKiBAZW51bSBOb2RlLl9Mb2NhbERpcnR5RmxhZ1xuICogQHN0YXRpY1xuICogQHByaXZhdGVcbiAqIEBuYW1lc3BhY2UgTm9kZVxuICovXG52YXIgTG9jYWxEaXJ0eUZsYWcgPSBjYy5FbnVtKHtcbiAgICAvKipcbiAgICAgKiAhI2VuIEZsYWcgZm9yIHBvc2l0aW9uIGRpcnR5XG4gICAgICogISN6aCDkvY3nva4gZGlydHkg55qE5qCH6K6w5L2NXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFBPU0lUSU9OXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIFBPU0lUSU9OOiAxIDw8IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBGbGFnIGZvciBzY2FsZSBkaXJ0eVxuICAgICAqICEjemgg57yp5pS+IGRpcnR5IOeahOagh+iusOS9jVxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBTQ0FMRVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBTQ0FMRTogMSA8PCAxLFxuICAgIC8qKlxuICAgICAqICEjZW4gRmxhZyBmb3Igcm90YXRpb24gZGlydHlcbiAgICAgKiAhI3poIOaXi+i9rCBkaXJ0eSDnmoTmoIforrDkvY1cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gUk9UQVRJT05cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgUk9UQVRJT046IDEgPDwgMixcbiAgICAvKipcbiAgICAgKiAhI2VuIEZsYWcgZm9yIHNrZXcgZGlydHlcbiAgICAgKiAhI3poIHNrZXcgZGlydHkg55qE5qCH6K6w5L2NXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFNLRVdcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgU0tFVzogMSA8PCAzLFxuICAgIC8qKlxuICAgICAqICEjZW4gRmxhZyBmb3Igcm90YXRpb24sIHNjYWxlIG9yIHBvc2l0aW9uIGRpcnR5XG4gICAgICogISN6aCDml4vovazvvIznvKnmlL7vvIzmiJbkvY3nva4gZGlydHkg55qE5qCH6K6w5L2NXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFRSU1xuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBUUlM6IDEgPDwgMCB8IDEgPDwgMSB8IDEgPDwgMixcbiAgICAvKipcbiAgICAgKiAhI2VuIEZsYWcgZm9yIHJvdGF0aW9uIG9yIHNjYWxlIGRpcnR5XG4gICAgICogISN6aCDml4vovazmiJbnvKnmlL4gZGlydHkg55qE5qCH6K6w5L2NXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFJTXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIFJTOiAxIDw8IDEgfCAxIDw8IDIsXG4gICAgLyoqXG4gICAgICogISNlbiBGbGFnIGZvciByb3RhdGlvbiwgc2NhbGUsIHBvc2l0aW9uLCBza2V3IGRpcnR5XG4gICAgICogISN6aCDml4vovazvvIznvKnmlL7vvIzkvY3nva7vvIzmiJbmlpzop5IgZGlydHkg55qE5qCH6K6w5L2NXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFRSU1xuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBUUlNTOiAxIDw8IDAgfCAxIDw8IDEgfCAxIDw8IDIgfCAxIDw8IDMsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEZsYWcgZm9yIHBoeXNpY3MgcG9zaXRpb24gZGlydHlcbiAgICAgKiAhI3poIOeJqeeQhuS9jee9riBkaXJ0eSDnmoTmoIforrDkvY1cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gUEhZU0lDU19QT1NJVElPTlxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBQSFlTSUNTX1BPU0lUSU9OOiAxIDw8IDQsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEZsYWcgZm9yIHBoeXNpY3Mgc2NhbGUgZGlydHlcbiAgICAgKiAhI3poIOeJqeeQhue8qeaUviBkaXJ0eSDnmoTmoIforrDkvY1cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gUEhZU0lDU19TQ0FMRVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBQSFlTSUNTX1NDQUxFOiAxIDw8IDUsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEZsYWcgZm9yIHBoeXNpY3Mgcm90YXRpb24gZGlydHlcbiAgICAgKiAhI3poIOeJqeeQhuaXi+i9rCBkaXJ0eSDnmoTmoIforrDkvY1cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gUEhZU0lDU19ST1RBVElPTlxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBQSFlTSUNTX1JPVEFUSU9OOiAxIDw8IDYsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEZsYWcgZm9yIHBoeXNpY3MgdHJzIGRpcnR5XG4gICAgICogISN6aCDniannkIbkvY3nva7ml4vovaznvKnmlL4gZGlydHkg55qE5qCH6K6w5L2NXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFBIWVNJQ1NfVFJTXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIFBIWVNJQ1NfVFJTOiAxIDw8IDQgfCAxIDw8IDUgfCAxIDw8IDYsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEZsYWcgZm9yIHBoeXNpY3MgcnMgZGlydHlcbiAgICAgKiAhI3poIOeJqeeQhuaXi+i9rOe8qeaUviBkaXJ0eSDnmoTmoIforrDkvY1cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gUEhZU0lDU19SU1xuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBQSFlTSUNTX1JTOiAxIDw8IDUgfCAxIDw8IDYsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEZsYWcgZm9yIG5vZGUgYW5kIHBoeXNpY3MgcG9zaXRpb24gZGlydHlcbiAgICAgKiAhI3poIOaJgOacieS9jee9riBkaXJ0eSDnmoTmoIforrDkvY1cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gQUxMX1BPU0lUSU9OXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIEFMTF9QT1NJVElPTjogMSA8PCAwIHwgMSA8PCA0LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBGbGFnIGZvciBub2RlIGFuZCBwaHlzaWNzIHNjYWxlIGRpcnR5XG4gICAgICogISN6aCDmiYDmnInnvKnmlL4gZGlydHkg55qE5qCH6K6w5L2NXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEFMTF9TQ0FMRVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBBTExfU0NBTEU6IDEgPDwgMSB8IDEgPDwgNSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gRmxhZyBmb3Igbm9kZSBhbmQgcGh5c2ljcyByb3RhdGlvbiBkaXJ0eVxuICAgICAqICEjemgg5omA5pyJ5peL6L2sIGRpcnR5IOeahOagh+iusOS9jVxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBBTExfUk9UQVRJT05cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgQUxMX1JPVEFUSU9OOiAxIDw8IDIgfCAxIDw8IDYsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEZsYWcgZm9yIG5vZGUgYW5kIHBoeXNpY3MgdHJzIGRpcnR5XG4gICAgICogISN6aCDmiYDmnIl0cnMgZGlydHkg55qE5qCH6K6w5L2NXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEFMTF9UUlNcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgQUxMX1RSUzogMSA8PCAwIHwgMSA8PCAxIHwgMSA8PCAyIHwgMSA8PCA0IHwgMSA8PCA1IHwgMSA8PCA2LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBGbGFnIGZvciBhbGwgZGlydHkgcHJvcGVydGllc1xuICAgICAqICEjemgg6KaG55uW5omA5pyJIGRpcnR5IOeKtuaAgeeahOagh+iusOS9jVxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBBTExcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgQUxMOiAweGZmZmYsXG59KTtcblxuLyoqXG4gKiAhI2VuIFRoZSBldmVudCB0eXBlIHN1cHBvcnRlZCBieSBOb2RlXG4gKiAhI3poIE5vZGUg5pSv5oyB55qE5LqL5Lu257G75Z6LXG4gKiBAY2xhc3MgTm9kZS5FdmVudFR5cGVcbiAqIEBzdGF0aWNcbiAqIEBuYW1lc3BhY2UgTm9kZVxuICovXG4vLyBXaHkgRXZlbnRUeXBlIGRlZmluZWQgYXMgY2xhc3MsIGJlY2F1c2UgdGhlIGZpcnN0IHBhcmFtZXRlciBvZiBOb2RlLm9uIG1ldGhvZCBuZWVkcyBzZXQgYXMgJ3N0cmluZycgdHlwZS5cbnZhciBFdmVudFR5cGUgPSBjYy5FbnVtKHtcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBldmVudCB0eXBlIGZvciB0b3VjaCBzdGFydCBldmVudCwgeW91IGNhbiB1c2UgaXRzIHZhbHVlIGRpcmVjdGx5OiAndG91Y2hzdGFydCdcbiAgICAgKiAhI3poIOW9k+aJi+aMh+inpuaRuOWIsOWxj+W5leaXtuOAglxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBUT1VDSF9TVEFSVFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBUT1VDSF9TVEFSVDogJ3RvdWNoc3RhcnQnLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGV2ZW50IHR5cGUgZm9yIHRvdWNoIG1vdmUgZXZlbnQsIHlvdSBjYW4gdXNlIGl0cyB2YWx1ZSBkaXJlY3RseTogJ3RvdWNobW92ZSdcbiAgICAgKiAhI3poIOW9k+aJi+aMh+WcqOWxj+W5leS4iuenu+WKqOaXtuOAglxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBUT1VDSF9NT1ZFXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIFRPVUNIX01PVkU6ICd0b3VjaG1vdmUnLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGV2ZW50IHR5cGUgZm9yIHRvdWNoIGVuZCBldmVudCwgeW91IGNhbiB1c2UgaXRzIHZhbHVlIGRpcmVjdGx5OiAndG91Y2hlbmQnXG4gICAgICogISN6aCDlvZPmiYvmjIflnKjnm67moIfoioLngrnljLrln5/lhoXnprvlvIDlsY/luZXml7bjgIJcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gVE9VQ0hfRU5EXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIFRPVUNIX0VORDogJ3RvdWNoZW5kJyxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBldmVudCB0eXBlIGZvciB0b3VjaCBlbmQgZXZlbnQsIHlvdSBjYW4gdXNlIGl0cyB2YWx1ZSBkaXJlY3RseTogJ3RvdWNoY2FuY2VsJ1xuICAgICAqICEjemgg5b2T5omL5oyH5Zyo55uu5qCH6IqC54K55Yy65Z+f5aSW56a75byA5bGP5bmV5pe244CCXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IFRPVUNIX0NBTkNFTFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBUT1VDSF9DQU5DRUw6ICd0b3VjaGNhbmNlbCcsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBldmVudCB0eXBlIGZvciBtb3VzZSBkb3duIGV2ZW50cywgeW91IGNhbiB1c2UgaXRzIHZhbHVlIGRpcmVjdGx5OiAnbW91c2Vkb3duJ1xuICAgICAqICEjemgg5b2T6byg5qCH5oyJ5LiL5pe26Kem5Y+R5LiA5qyh44CCXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IE1PVVNFX0RPV05cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgTU9VU0VfRE9XTjogJ21vdXNlZG93bicsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZXZlbnQgdHlwZSBmb3IgbW91c2UgbW92ZSBldmVudHMsIHlvdSBjYW4gdXNlIGl0cyB2YWx1ZSBkaXJlY3RseTogJ21vdXNlbW92ZSdcbiAgICAgKiAhI3poIOW9k+m8oOagh+WcqOebruagh+iKgueCueWcqOebruagh+iKgueCueWMuuWfn+S4reenu+WKqOaXtu+8jOS4jeiuuuaYr+WQpuaMieS4i+OAglxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBNT1VTRV9NT1ZFXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIE1PVVNFX01PVkU6ICdtb3VzZW1vdmUnLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGV2ZW50IHR5cGUgZm9yIG1vdXNlIGVudGVyIHRhcmdldCBldmVudHMsIHlvdSBjYW4gdXNlIGl0cyB2YWx1ZSBkaXJlY3RseTogJ21vdXNlZW50ZXInXG4gICAgICogISN6aCDlvZPpvKDmoIfnp7vlhaXnm67moIfoioLngrnljLrln5/ml7bvvIzkuI3orrrmmK/lkKbmjInkuIvjgIJcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gTU9VU0VfRU5URVJcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgTU9VU0VfRU5URVI6ICdtb3VzZWVudGVyJyxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBldmVudCB0eXBlIGZvciBtb3VzZSBsZWF2ZSB0YXJnZXQgZXZlbnRzLCB5b3UgY2FuIHVzZSBpdHMgdmFsdWUgZGlyZWN0bHk6ICdtb3VzZWxlYXZlJ1xuICAgICAqICEjemgg5b2T6byg5qCH56e75Ye655uu5qCH6IqC54K55Yy65Z+f5pe277yM5LiN6K665piv5ZCm5oyJ5LiL44CCXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IE1PVVNFX0xFQVZFXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIE1PVVNFX0xFQVZFOiAnbW91c2VsZWF2ZScsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZXZlbnQgdHlwZSBmb3IgbW91c2UgdXAgZXZlbnRzLCB5b3UgY2FuIHVzZSBpdHMgdmFsdWUgZGlyZWN0bHk6ICdtb3VzZXVwJ1xuICAgICAqICEjemgg5b2T6byg5qCH5LuO5oyJ5LiL54q25oCB5p2+5byA5pe26Kem5Y+R5LiA5qyh44CCXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IE1PVVNFX1VQXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIE1PVVNFX1VQOiAnbW91c2V1cCcsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZXZlbnQgdHlwZSBmb3IgbW91c2Ugd2hlZWwgZXZlbnRzLCB5b3UgY2FuIHVzZSBpdHMgdmFsdWUgZGlyZWN0bHk6ICdtb3VzZXdoZWVsJ1xuICAgICAqICEjemgg5b2T6byg5qCH5rua6L2u5rua5Yqo5pe244CCXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IE1PVVNFX1dIRUVMXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIE1PVVNFX1dIRUVMOiAnbW91c2V3aGVlbCcsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBldmVudCB0eXBlIGZvciBwb3NpdGlvbiBjaGFuZ2UgZXZlbnRzLlxuICAgICAqIFBlcmZvcm1hbmNlIG5vdGUsIHRoaXMgZXZlbnQgd2lsbCBiZSB0cmlnZ2VyZWQgZXZlcnkgdGltZSBjb3JyZXNwb25kaW5nIHByb3BlcnRpZXMgYmVpbmcgY2hhbmdlZCxcbiAgICAgKiBpZiB0aGUgZXZlbnQgY2FsbGJhY2sgaGF2ZSBoZWF2eSBsb2dpYyBpdCBtYXkgaGF2ZSBncmVhdCBwZXJmb3JtYW5jZSBpbXBhY3QsIHRyeSB0byBhdm9pZCBzdWNoIHNjZW5hcmlvLlxuICAgICAqICEjemgg5b2T6IqC54K55L2N572u5pS55Y+Y5pe26Kem5Y+R55qE5LqL5Lu244CCXG4gICAgICog5oCn6IO96K2m5ZGK77ya6L+Z5Liq5LqL5Lu25Lya5Zyo5q+P5qyh5a+55bqU55qE5bGe5oCn6KKr5L+u5pS55pe26Kem5Y+R77yM5aaC5p6c5LqL5Lu25Zue6LCD5o2f6ICX6L6D6auY77yM5pyJ5Y+v6IO95a+55oCn6IO95pyJ5b6I5aSn55qE6LSf6Z2i5b2x5ZON77yM6K+35bC96YeP6YG/5YWN6L+Z56eN5oOF5Ya144CCXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IFBPU0lUSU9OX0NIQU5HRURcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgUE9TSVRJT05fQ0hBTkdFRDogJ3Bvc2l0aW9uLWNoYW5nZWQnLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGV2ZW50IHR5cGUgZm9yIHJvdGF0aW9uIGNoYW5nZSBldmVudHMuXG4gICAgICogUGVyZm9ybWFuY2Ugbm90ZSwgdGhpcyBldmVudCB3aWxsIGJlIHRyaWdnZXJlZCBldmVyeSB0aW1lIGNvcnJlc3BvbmRpbmcgcHJvcGVydGllcyBiZWluZyBjaGFuZ2VkLFxuICAgICAqIGlmIHRoZSBldmVudCBjYWxsYmFjayBoYXZlIGhlYXZ5IGxvZ2ljIGl0IG1heSBoYXZlIGdyZWF0IHBlcmZvcm1hbmNlIGltcGFjdCwgdHJ5IHRvIGF2b2lkIHN1Y2ggc2NlbmFyaW8uXG4gICAgICogISN6aCDlvZPoioLngrnml4vovazmlLnlj5jml7bop6blj5HnmoTkuovku7bjgIJcbiAgICAgKiDmgKfog73orablkYrvvJrov5nkuKrkuovku7bkvJrlnKjmr4/mrKHlr7nlupTnmoTlsZ7mgKfooqvkv67mlLnml7bop6blj5HvvIzlpoLmnpzkuovku7blm57osIPmjZ/ogJfovoPpq5jvvIzmnInlj6/og73lr7nmgKfog73mnInlvojlpKfnmoTotJ/pnaLlvbHlk43vvIzor7flsL3ph4/pgb/lhY3ov5nnp43mg4XlhrXjgIJcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gUk9UQVRJT05fQ0hBTkdFRFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBST1RBVElPTl9DSEFOR0VEOiAncm90YXRpb24tY2hhbmdlZCcsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZXZlbnQgdHlwZSBmb3Igc2NhbGUgY2hhbmdlIGV2ZW50cy5cbiAgICAgKiBQZXJmb3JtYW5jZSBub3RlLCB0aGlzIGV2ZW50IHdpbGwgYmUgdHJpZ2dlcmVkIGV2ZXJ5IHRpbWUgY29ycmVzcG9uZGluZyBwcm9wZXJ0aWVzIGJlaW5nIGNoYW5nZWQsXG4gICAgICogaWYgdGhlIGV2ZW50IGNhbGxiYWNrIGhhdmUgaGVhdnkgbG9naWMgaXQgbWF5IGhhdmUgZ3JlYXQgcGVyZm9ybWFuY2UgaW1wYWN0LCB0cnkgdG8gYXZvaWQgc3VjaCBzY2VuYXJpby5cbiAgICAgKiAhI3poIOW9k+iKgueCuee8qeaUvuaUueWPmOaXtuinpuWPkeeahOS6i+S7tuOAglxuICAgICAqIOaAp+iDveitpuWRiu+8mui/meS4quS6i+S7tuS8muWcqOavj+asoeWvueW6lOeahOWxnuaAp+iiq+S/ruaUueaXtuinpuWPke+8jOWmguaenOS6i+S7tuWbnuiwg+aNn+iAl+i+g+mrmO+8jOacieWPr+iDveWvueaAp+iDveacieW+iOWkp+eahOi0n+mdouW9seWTje+8jOivt+WwvemHj+mBv+WFjei/meenjeaDheWGteOAglxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBTQ0FMRV9DSEFOR0VEXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIFNDQUxFX0NIQU5HRUQ6ICdzY2FsZS1jaGFuZ2VkJyxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBldmVudCB0eXBlIGZvciBzaXplIGNoYW5nZSBldmVudHMuXG4gICAgICogUGVyZm9ybWFuY2Ugbm90ZSwgdGhpcyBldmVudCB3aWxsIGJlIHRyaWdnZXJlZCBldmVyeSB0aW1lIGNvcnJlc3BvbmRpbmcgcHJvcGVydGllcyBiZWluZyBjaGFuZ2VkLFxuICAgICAqIGlmIHRoZSBldmVudCBjYWxsYmFjayBoYXZlIGhlYXZ5IGxvZ2ljIGl0IG1heSBoYXZlIGdyZWF0IHBlcmZvcm1hbmNlIGltcGFjdCwgdHJ5IHRvIGF2b2lkIHN1Y2ggc2NlbmFyaW8uXG4gICAgICogISN6aCDlvZPoioLngrnlsLrlr7jmlLnlj5jml7bop6blj5HnmoTkuovku7bjgIJcbiAgICAgKiDmgKfog73orablkYrvvJrov5nkuKrkuovku7bkvJrlnKjmr4/mrKHlr7nlupTnmoTlsZ7mgKfooqvkv67mlLnml7bop6blj5HvvIzlpoLmnpzkuovku7blm57osIPmjZ/ogJfovoPpq5jvvIzmnInlj6/og73lr7nmgKfog73mnInlvojlpKfnmoTotJ/pnaLlvbHlk43vvIzor7flsL3ph4/pgb/lhY3ov5nnp43mg4XlhrXjgIJcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gU0laRV9DSEFOR0VEXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIFNJWkVfQ0hBTkdFRDogJ3NpemUtY2hhbmdlZCcsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZXZlbnQgdHlwZSBmb3IgYW5jaG9yIHBvaW50IGNoYW5nZSBldmVudHMuXG4gICAgICogUGVyZm9ybWFuY2Ugbm90ZSwgdGhpcyBldmVudCB3aWxsIGJlIHRyaWdnZXJlZCBldmVyeSB0aW1lIGNvcnJlc3BvbmRpbmcgcHJvcGVydGllcyBiZWluZyBjaGFuZ2VkLFxuICAgICAqIGlmIHRoZSBldmVudCBjYWxsYmFjayBoYXZlIGhlYXZ5IGxvZ2ljIGl0IG1heSBoYXZlIGdyZWF0IHBlcmZvcm1hbmNlIGltcGFjdCwgdHJ5IHRvIGF2b2lkIHN1Y2ggc2NlbmFyaW8uXG4gICAgICogISN6aCDlvZPoioLngrnplJrngrnmlLnlj5jml7bop6blj5HnmoTkuovku7bjgIJcbiAgICAgKiDmgKfog73orablkYrvvJrov5nkuKrkuovku7bkvJrlnKjmr4/mrKHlr7nlupTnmoTlsZ7mgKfooqvkv67mlLnml7bop6blj5HvvIzlpoLmnpzkuovku7blm57osIPmjZ/ogJfovoPpq5jvvIzmnInlj6/og73lr7nmgKfog73mnInlvojlpKfnmoTotJ/pnaLlvbHlk43vvIzor7flsL3ph4/pgb/lhY3ov5nnp43mg4XlhrXjgIJcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gQU5DSE9SX0NIQU5HRURcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgQU5DSE9SX0NIQU5HRUQ6ICdhbmNob3ItY2hhbmdlZCcsXG4gICAgLyoqXG4gICAgKiAhI2VuIFRoZSBldmVudCB0eXBlIGZvciBjb2xvciBjaGFuZ2UgZXZlbnRzLlxuICAgICogUGVyZm9ybWFuY2Ugbm90ZSwgdGhpcyBldmVudCB3aWxsIGJlIHRyaWdnZXJlZCBldmVyeSB0aW1lIGNvcnJlc3BvbmRpbmcgcHJvcGVydGllcyBiZWluZyBjaGFuZ2VkLFxuICAgICogaWYgdGhlIGV2ZW50IGNhbGxiYWNrIGhhdmUgaGVhdnkgbG9naWMgaXQgbWF5IGhhdmUgZ3JlYXQgcGVyZm9ybWFuY2UgaW1wYWN0LCB0cnkgdG8gYXZvaWQgc3VjaCBzY2VuYXJpby5cbiAgICAqICEjemgg5b2T6IqC54K56aKc6Imy5pS55Y+Y5pe26Kem5Y+R55qE5LqL5Lu244CCXG4gICAgKiDmgKfog73orablkYrvvJrov5nkuKrkuovku7bkvJrlnKjmr4/mrKHlr7nlupTnmoTlsZ7mgKfooqvkv67mlLnml7bop6blj5HvvIzlpoLmnpzkuovku7blm57osIPmjZ/ogJfovoPpq5jvvIzmnInlj6/og73lr7nmgKfog73mnInlvojlpKfnmoTotJ/pnaLlvbHlk43vvIzor7flsL3ph4/pgb/lhY3ov5nnp43mg4XlhrXjgIJcbiAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBDT0xPUl9DSEFOR0VEXG4gICAgKiBAc3RhdGljXG4gICAgKi9cbiAgICBDT0xPUl9DSEFOR0VEOiAnY29sb3ItY2hhbmdlZCcsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZXZlbnQgdHlwZSBmb3IgbmV3IGNoaWxkIGFkZGVkIGV2ZW50cy5cbiAgICAgKiAhI3poIOW9k+aWsOeahOWtkOiKgueCueiiq+a3u+WKoOaXtuinpuWPkeeahOS6i+S7tuOAglxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBDSElMRF9BRERFRFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBDSElMRF9BRERFRDogJ2NoaWxkLWFkZGVkJyxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBldmVudCB0eXBlIGZvciBjaGlsZCByZW1vdmVkIGV2ZW50cy5cbiAgICAgKiAhI3poIOW9k+WtkOiKgueCueiiq+enu+mZpOaXtuinpuWPkeeahOS6i+S7tuOAglxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBDSElMRF9SRU1PVkVEXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIENISUxEX1JFTU9WRUQ6ICdjaGlsZC1yZW1vdmVkJyxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBldmVudCB0eXBlIGZvciBjaGlsZHJlbiByZW9yZGVyIGV2ZW50cy5cbiAgICAgKiAhI3poIOW9k+WtkOiKgueCuemhuuW6j+aUueWPmOaXtuinpuWPkeeahOS6i+S7tuOAglxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBDSElMRF9SRU9SREVSXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIENISUxEX1JFT1JERVI6ICdjaGlsZC1yZW9yZGVyJyxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBldmVudCB0eXBlIGZvciBub2RlIGdyb3VwIGNoYW5nZWQgZXZlbnRzLlxuICAgICAqICEjemgg5b2T6IqC54K55b2S5bGe576k57uE5Y+R55Sf5Y+Y5YyW5pe26Kem5Y+R55qE5LqL5Lu244CCXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEdST1VQX0NIQU5HRURcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgR1JPVVBfQ0hBTkdFRDogJ2dyb3VwLWNoYW5nZWQnLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGV2ZW50IHR5cGUgZm9yIG5vZGUncyBzaWJsaW5nIG9yZGVyIGNoYW5nZWQuXG4gICAgICogISN6aCDlvZPoioLngrnlnKjlhYTlvJ/oioLngrnkuK3nmoTpobrluo/lj5HnlJ/lj5jljJbml7bop6blj5HnmoTkuovku7bjgIJcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gU0lCTElOR19PUkRFUl9DSEFOR0VEXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIFNJQkxJTkdfT1JERVJfQ0hBTkdFRDogJ3NpYmxpbmctb3JkZXItY2hhbmdlZCcsXG59KTtcblxudmFyIF90b3VjaEV2ZW50cyA9IFtcbiAgICBFdmVudFR5cGUuVE9VQ0hfU1RBUlQsXG4gICAgRXZlbnRUeXBlLlRPVUNIX01PVkUsXG4gICAgRXZlbnRUeXBlLlRPVUNIX0VORCxcbiAgICBFdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLFxuXTtcbnZhciBfbW91c2VFdmVudHMgPSBbXG4gICAgRXZlbnRUeXBlLk1PVVNFX0RPV04sXG4gICAgRXZlbnRUeXBlLk1PVVNFX0VOVEVSLFxuICAgIEV2ZW50VHlwZS5NT1VTRV9NT1ZFLFxuICAgIEV2ZW50VHlwZS5NT1VTRV9MRUFWRSxcbiAgICBFdmVudFR5cGUuTU9VU0VfVVAsXG4gICAgRXZlbnRUeXBlLk1PVVNFX1dIRUVMLFxuXTtcblxudmFyIF9za2V3TmVlZFdhcm4gPSB0cnVlO1xudmFyIF9za2V3V2FybiA9IGZ1bmN0aW9uICh2YWx1ZSwgbm9kZSkge1xuICAgIGlmICh2YWx1ZSAhPT0gMCkge1xuICAgICAgICB2YXIgbm9kZVBhdGggPSBcIlwiO1xuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICB2YXIgTm9kZVV0aWxzID0gRWRpdG9yLnJlcXVpcmUoJ3NjZW5lOi8vdXRpbHMvbm9kZScpO1xuICAgICAgICAgICAgbm9kZVBhdGggPSBgTm9kZTogJHtOb2RlVXRpbHMuZ2V0Tm9kZVBhdGgobm9kZSl9LmBcbiAgICAgICAgfVxuICAgICAgICBfc2tld05lZWRXYXJuICYmIGNjLndhcm4oXCJgY2MuTm9kZS5za2V3WC9ZYCBpcyBkZXByZWNhdGVkIHNpbmNlIHYyLjIuMSwgcGxlYXNlIHVzZSAzRCBub2RlIGluc3RlYWQuXCIsIG5vZGVQYXRoKTtcbiAgICAgICAgIUNDX0VESVRPUiAmJiAoX3NrZXdOZWVkV2FybiA9IGZhbHNlKTtcbiAgICB9XG59XG5cbnZhciBfY3VycmVudEhvdmVyZWQgPSBudWxsO1xuXG52YXIgX3RvdWNoU3RhcnRIYW5kbGVyID0gZnVuY3Rpb24gKHRvdWNoLCBldmVudCkge1xuICAgIHZhciBwb3MgPSB0b3VjaC5nZXRMb2NhdGlvbigpO1xuICAgIHZhciBub2RlID0gdGhpcy5vd25lcjtcblxuICAgIGlmIChub2RlLl9oaXRUZXN0KHBvcywgdGhpcykpIHtcbiAgICAgICAgZXZlbnQudHlwZSA9IEV2ZW50VHlwZS5UT1VDSF9TVEFSVDtcbiAgICAgICAgZXZlbnQudG91Y2ggPSB0b3VjaDtcbiAgICAgICAgZXZlbnQuYnViYmxlcyA9IHRydWU7XG4gICAgICAgIG5vZGUuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59O1xudmFyIF90b3VjaE1vdmVIYW5kbGVyID0gZnVuY3Rpb24gKHRvdWNoLCBldmVudCkge1xuICAgIHZhciBub2RlID0gdGhpcy5vd25lcjtcbiAgICBldmVudC50eXBlID0gRXZlbnRUeXBlLlRPVUNIX01PVkU7XG4gICAgZXZlbnQudG91Y2ggPSB0b3VjaDtcbiAgICBldmVudC5idWJibGVzID0gdHJ1ZTtcbiAgICBub2RlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufTtcbnZhciBfdG91Y2hFbmRIYW5kbGVyID0gZnVuY3Rpb24gKHRvdWNoLCBldmVudCkge1xuICAgIHZhciBwb3MgPSB0b3VjaC5nZXRMb2NhdGlvbigpO1xuICAgIHZhciBub2RlID0gdGhpcy5vd25lcjtcblxuICAgIGlmIChub2RlLl9oaXRUZXN0KHBvcywgdGhpcykpIHtcbiAgICAgICAgZXZlbnQudHlwZSA9IEV2ZW50VHlwZS5UT1VDSF9FTkQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBldmVudC50eXBlID0gRXZlbnRUeXBlLlRPVUNIX0NBTkNFTDtcbiAgICB9XG4gICAgZXZlbnQudG91Y2ggPSB0b3VjaDtcbiAgICBldmVudC5idWJibGVzID0gdHJ1ZTtcbiAgICBub2RlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufTtcbnZhciBfdG91Y2hDYW5jZWxIYW5kbGVyID0gZnVuY3Rpb24gKHRvdWNoLCBldmVudCkge1xuICAgIHZhciBwb3MgPSB0b3VjaC5nZXRMb2NhdGlvbigpO1xuICAgIHZhciBub2RlID0gdGhpcy5vd25lcjtcblxuICAgIGV2ZW50LnR5cGUgPSBFdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMO1xuICAgIGV2ZW50LnRvdWNoID0gdG91Y2g7XG4gICAgZXZlbnQuYnViYmxlcyA9IHRydWU7XG4gICAgbm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn07XG5cbnZhciBfbW91c2VEb3duSGFuZGxlciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBwb3MgPSBldmVudC5nZXRMb2NhdGlvbigpO1xuICAgIHZhciBub2RlID0gdGhpcy5vd25lcjtcblxuICAgIGlmIChub2RlLl9oaXRUZXN0KHBvcywgdGhpcykpIHtcbiAgICAgICAgZXZlbnQudHlwZSA9IEV2ZW50VHlwZS5NT1VTRV9ET1dOO1xuICAgICAgICBldmVudC5idWJibGVzID0gdHJ1ZTtcbiAgICAgICAgbm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICB9XG59O1xudmFyIF9tb3VzZU1vdmVIYW5kbGVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIHBvcyA9IGV2ZW50LmdldExvY2F0aW9uKCk7XG4gICAgdmFyIG5vZGUgPSB0aGlzLm93bmVyO1xuICAgIHZhciBoaXQgPSBub2RlLl9oaXRUZXN0KHBvcywgdGhpcyk7XG4gICAgaWYgKGhpdCkge1xuICAgICAgICBpZiAoIXRoaXMuX3ByZXZpb3VzSW4pIHtcbiAgICAgICAgICAgIC8vIEZpeCBpc3N1ZSB3aGVuIGhvdmVyIG5vZGUgc3dpdGNoZWQsIHByZXZpb3VzIGhvdmVyZWQgbm9kZSB3b24ndCBnZXQgTU9VU0VfTEVBVkUgbm90aWZpY2F0aW9uXG4gICAgICAgICAgICBpZiAoX2N1cnJlbnRIb3ZlcmVkICYmIF9jdXJyZW50SG92ZXJlZC5fbW91c2VMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIGV2ZW50LnR5cGUgPSBFdmVudFR5cGUuTU9VU0VfTEVBVkU7XG4gICAgICAgICAgICAgICAgX2N1cnJlbnRIb3ZlcmVkLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgICAgIF9jdXJyZW50SG92ZXJlZC5fbW91c2VMaXN0ZW5lci5fcHJldmlvdXNJbiA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX2N1cnJlbnRIb3ZlcmVkID0gdGhpcy5vd25lcjtcbiAgICAgICAgICAgIGV2ZW50LnR5cGUgPSBFdmVudFR5cGUuTU9VU0VfRU5URVI7XG4gICAgICAgICAgICBub2RlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgdGhpcy5fcHJldmlvdXNJbiA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQudHlwZSA9IEV2ZW50VHlwZS5NT1VTRV9NT1ZFO1xuICAgICAgICBldmVudC5idWJibGVzID0gdHJ1ZTtcbiAgICAgICAgbm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICB9XG4gICAgZWxzZSBpZiAodGhpcy5fcHJldmlvdXNJbikge1xuICAgICAgICBldmVudC50eXBlID0gRXZlbnRUeXBlLk1PVVNFX0xFQVZFO1xuICAgICAgICBub2RlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICB0aGlzLl9wcmV2aW91c0luID0gZmFsc2U7XG4gICAgICAgIF9jdXJyZW50SG92ZXJlZCA9IG51bGw7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBjb250aW51ZSBkaXNwYXRjaGluZ1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRXZlbnQgcHJvY2Vzc2VkLCBjbGVhbnVwXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG59O1xudmFyIF9tb3VzZVVwSGFuZGxlciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBwb3MgPSBldmVudC5nZXRMb2NhdGlvbigpO1xuICAgIHZhciBub2RlID0gdGhpcy5vd25lcjtcblxuICAgIGlmIChub2RlLl9oaXRUZXN0KHBvcywgdGhpcykpIHtcbiAgICAgICAgZXZlbnQudHlwZSA9IEV2ZW50VHlwZS5NT1VTRV9VUDtcbiAgICAgICAgZXZlbnQuYnViYmxlcyA9IHRydWU7XG4gICAgICAgIG5vZGUuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbn07XG52YXIgX21vdXNlV2hlZWxIYW5kbGVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIHBvcyA9IGV2ZW50LmdldExvY2F0aW9uKCk7XG4gICAgdmFyIG5vZGUgPSB0aGlzLm93bmVyO1xuXG4gICAgaWYgKG5vZGUuX2hpdFRlc3QocG9zLCB0aGlzKSkge1xuICAgICAgICBldmVudC50eXBlID0gRXZlbnRUeXBlLk1PVVNFX1dIRUVMO1xuICAgICAgICBldmVudC5idWJibGVzID0gdHJ1ZTtcbiAgICAgICAgbm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxufTtcblxuZnVuY3Rpb24gX3NlYXJjaENvbXBvbmVudHNJblBhcmVudCAobm9kZSwgY29tcCkge1xuICAgIGlmIChjb21wKSB7XG4gICAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICAgIGxldCBsaXN0ID0gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgY3VyciA9IG5vZGU7IGN1cnIgJiYgY2MuTm9kZS5pc05vZGUoY3Vycik7IGN1cnIgPSBjdXJyLl9wYXJlbnQsICsraW5kZXgpIHtcbiAgICAgICAgICAgIGlmIChjdXJyLmdldENvbXBvbmVudChjb21wKSkge1xuICAgICAgICAgICAgICAgIGxldCBuZXh0ID0ge1xuICAgICAgICAgICAgICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgIG5vZGU6IGN1cnIsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAobGlzdCkge1xuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobmV4dCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdCA9IFtuZXh0XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGlzdDtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIF9jaGVja0xpc3RlbmVycyAobm9kZSwgZXZlbnRzKSB7XG4gICAgaWYgKCEobm9kZS5fb2JqRmxhZ3MgJiBEZXN0cm95aW5nKSkge1xuICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgIGlmIChub2RlLl9idWJibGluZ0xpc3RlbmVycykge1xuICAgICAgICAgICAgZm9yICg7IGkgPCBldmVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5fYnViYmxpbmdMaXN0ZW5lcnMuaGFzRXZlbnRMaXN0ZW5lcihldmVudHNbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS5fY2FwdHVyaW5nTGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBmb3IgKDsgaSA8IGV2ZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGlmIChub2RlLl9jYXB0dXJpbmdMaXN0ZW5lcnMuaGFzRXZlbnRMaXN0ZW5lcihldmVudHNbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBfZG9EaXNwYXRjaEV2ZW50IChvd25lciwgZXZlbnQpIHtcbiAgICB2YXIgdGFyZ2V0LCBpO1xuICAgIGV2ZW50LnRhcmdldCA9IG93bmVyO1xuXG4gICAgLy8gRXZlbnQuQ0FQVFVSSU5HX1BIQVNFXG4gICAgX2NhY2hlZEFycmF5Lmxlbmd0aCA9IDA7XG4gICAgb3duZXIuX2dldENhcHR1cmluZ1RhcmdldHMoZXZlbnQudHlwZSwgX2NhY2hlZEFycmF5KTtcbiAgICAvLyBjYXB0dXJpbmdcbiAgICBldmVudC5ldmVudFBoYXNlID0gMTtcbiAgICBmb3IgKGkgPSBfY2FjaGVkQXJyYXkubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdGFyZ2V0ID0gX2NhY2hlZEFycmF5W2ldO1xuICAgICAgICBpZiAodGFyZ2V0Ll9jYXB0dXJpbmdMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgICAgICAvLyBmaXJlIGV2ZW50XG4gICAgICAgICAgICB0YXJnZXQuX2NhcHR1cmluZ0xpc3RlbmVycy5lbWl0KGV2ZW50LnR5cGUsIGV2ZW50LCBfY2FjaGVkQXJyYXkpO1xuICAgICAgICAgICAgLy8gY2hlY2sgaWYgcHJvcGFnYXRpb24gc3RvcHBlZFxuICAgICAgICAgICAgaWYgKGV2ZW50Ll9wcm9wYWdhdGlvblN0b3BwZWQpIHtcbiAgICAgICAgICAgICAgICBfY2FjaGVkQXJyYXkubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgX2NhY2hlZEFycmF5Lmxlbmd0aCA9IDA7XG5cbiAgICAvLyBFdmVudC5BVF9UQVJHRVRcbiAgICAvLyBjaGVja3MgaWYgZGVzdHJveWVkIGluIGNhcHR1cmluZyBjYWxsYmFja3NcbiAgICBldmVudC5ldmVudFBoYXNlID0gMjtcbiAgICBldmVudC5jdXJyZW50VGFyZ2V0ID0gb3duZXI7XG4gICAgaWYgKG93bmVyLl9jYXB0dXJpbmdMaXN0ZW5lcnMpIHtcbiAgICAgICAgb3duZXIuX2NhcHR1cmluZ0xpc3RlbmVycy5lbWl0KGV2ZW50LnR5cGUsIGV2ZW50KTtcbiAgICB9XG4gICAgaWYgKCFldmVudC5fcHJvcGFnYXRpb25JbW1lZGlhdGVTdG9wcGVkICYmIG93bmVyLl9idWJibGluZ0xpc3RlbmVycykge1xuICAgICAgICBvd25lci5fYnViYmxpbmdMaXN0ZW5lcnMuZW1pdChldmVudC50eXBlLCBldmVudCk7XG4gICAgfVxuXG4gICAgaWYgKCFldmVudC5fcHJvcGFnYXRpb25TdG9wcGVkICYmIGV2ZW50LmJ1YmJsZXMpIHtcbiAgICAgICAgLy8gRXZlbnQuQlVCQkxJTkdfUEhBU0VcbiAgICAgICAgb3duZXIuX2dldEJ1YmJsaW5nVGFyZ2V0cyhldmVudC50eXBlLCBfY2FjaGVkQXJyYXkpO1xuICAgICAgICAvLyBwcm9wYWdhdGVcbiAgICAgICAgZXZlbnQuZXZlbnRQaGFzZSA9IDM7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBfY2FjaGVkQXJyYXkubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHRhcmdldCA9IF9jYWNoZWRBcnJheVtpXTtcbiAgICAgICAgICAgIGlmICh0YXJnZXQuX2J1YmJsaW5nTGlzdGVuZXJzKSB7XG4gICAgICAgICAgICAgICAgZXZlbnQuY3VycmVudFRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgICAgICAgICAvLyBmaXJlIGV2ZW50XG4gICAgICAgICAgICAgICAgdGFyZ2V0Ll9idWJibGluZ0xpc3RlbmVycy5lbWl0KGV2ZW50LnR5cGUsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiBwcm9wYWdhdGlvbiBzdG9wcGVkXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50Ll9wcm9wYWdhdGlvblN0b3BwZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgX2NhY2hlZEFycmF5Lmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgX2NhY2hlZEFycmF5Lmxlbmd0aCA9IDA7XG59XG5cbi8vIHRyYXZlcnNhbCB0aGUgbm9kZSB0cmVlLCBjaGlsZCBjdWxsaW5nTWFzayBtdXN0IGtlZXAgdGhlIHNhbWUgd2l0aCB0aGUgcGFyZW50LlxuZnVuY3Rpb24gX2dldEFjdHVhbEdyb3VwSW5kZXggKG5vZGUpIHtcbiAgICBsZXQgZ3JvdXBJbmRleCA9IG5vZGUuZ3JvdXBJbmRleDtcbiAgICBpZiAoZ3JvdXBJbmRleCA9PT0gMCAmJiBub2RlLnBhcmVudCkge1xuICAgICAgICBncm91cEluZGV4ID0gX2dldEFjdHVhbEdyb3VwSW5kZXgobm9kZS5wYXJlbnQpO1xuICAgIH1cbiAgICByZXR1cm4gZ3JvdXBJbmRleDtcbn1cblxuZnVuY3Rpb24gX3VwZGF0ZUN1bGxpbmdNYXNrIChub2RlKSB7XG4gICAgbGV0IGluZGV4ID0gX2dldEFjdHVhbEdyb3VwSW5kZXgobm9kZSk7XG4gICAgbm9kZS5fY3VsbGluZ01hc2sgPSAxIDw8IGluZGV4O1xuICAgIGlmIChDQ19KU0IgJiYgQ0NfTkFUSVZFUkVOREVSRVIpIHtcbiAgICAgICAgbm9kZS5fcHJveHkgJiYgbm9kZS5fcHJveHkudXBkYXRlQ3VsbGluZ01hc2soKTtcbiAgICB9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5fY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgX3VwZGF0ZUN1bGxpbmdNYXNrKG5vZGUuX2NoaWxkcmVuW2ldKTtcbiAgICB9XG59XG5cbi8vIDJELzNEIG1hdHJpeCBmdW5jdGlvbnNcbmZ1bmN0aW9uIHVwZGF0ZUxvY2FsTWF0cml4M0QgKCkge1xuICAgIGlmICh0aGlzLl9sb2NhbE1hdERpcnR5ICYgTG9jYWxEaXJ0eUZsYWcuVFJTUykge1xuICAgICAgICAvLyBVcGRhdGUgdHJhbnNmb3JtXG4gICAgICAgIGxldCB0ID0gdGhpcy5fbWF0cml4O1xuICAgICAgICBsZXQgdG0gPSB0Lm07XG4gICAgICAgIFRycy50b01hdDQodCwgdGhpcy5fdHJzKTtcblxuICAgICAgICAvLyBza2V3XG4gICAgICAgIGlmICh0aGlzLl9za2V3WCB8fCB0aGlzLl9za2V3WSkge1xuICAgICAgICAgICAgbGV0IGEgPSB0bVswXSwgYiA9IHRtWzFdLCBjID0gdG1bNF0sIGQgPSB0bVs1XTtcbiAgICAgICAgICAgIGxldCBza3ggPSBNYXRoLnRhbih0aGlzLl9za2V3WCAqIE9ORV9ERUdSRUUpO1xuICAgICAgICAgICAgbGV0IHNreSA9IE1hdGgudGFuKHRoaXMuX3NrZXdZICogT05FX0RFR1JFRSk7XG4gICAgICAgICAgICBpZiAoc2t4ID09PSBJbmZpbml0eSlcbiAgICAgICAgICAgICAgICBza3ggPSA5OTk5OTk5OTtcbiAgICAgICAgICAgIGlmIChza3kgPT09IEluZmluaXR5KVxuICAgICAgICAgICAgICAgIHNreSA9IDk5OTk5OTk5O1xuICAgICAgICAgICAgdG1bMF0gPSBhICsgYyAqIHNreTtcbiAgICAgICAgICAgIHRtWzFdID0gYiArIGQgKiBza3k7XG4gICAgICAgICAgICB0bVs0XSA9IGMgKyBhICogc2t4O1xuICAgICAgICAgICAgdG1bNV0gPSBkICsgYiAqIHNreDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9sb2NhbE1hdERpcnR5ICY9IH5Mb2NhbERpcnR5RmxhZy5UUlNTO1xuICAgICAgICAvLyBSZWdpc3RlciBkaXJ0eSBzdGF0dXMgb2Ygd29ybGQgbWF0cml4IHNvIHRoYXQgaXQgY2FuIGJlIHJlY2FsY3VsYXRlZFxuICAgICAgICB0aGlzLl93b3JsZE1hdERpcnR5ID0gdHJ1ZTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxvY2FsTWF0cml4MkQgKCkge1xuICAgIGxldCBkaXJ0eUZsYWcgPSB0aGlzLl9sb2NhbE1hdERpcnR5O1xuICAgIGlmICghKGRpcnR5RmxhZyAmIExvY2FsRGlydHlGbGFnLlRSU1MpKSByZXR1cm47XG5cbiAgICAvLyBVcGRhdGUgdHJhbnNmb3JtXG4gICAgbGV0IHQgPSB0aGlzLl9tYXRyaXg7XG4gICAgbGV0IHRtID0gdC5tO1xuICAgIGxldCB0cnMgPSB0aGlzLl90cnM7XG5cbiAgICBpZiAoZGlydHlGbGFnICYgKExvY2FsRGlydHlGbGFnLlJTIHwgTG9jYWxEaXJ0eUZsYWcuU0tFVykpIHtcbiAgICAgICAgbGV0IHJvdGF0aW9uID0gLXRoaXMuX2V1bGVyQW5nbGVzLno7XG4gICAgICAgIGxldCBoYXNTa2V3ID0gdGhpcy5fc2tld1ggfHwgdGhpcy5fc2tld1k7XG4gICAgICAgIGxldCBzeCA9IHRyc1s3XSwgc3kgPSB0cnNbOF07XG5cbiAgICAgICAgaWYgKHJvdGF0aW9uIHx8IGhhc1NrZXcpIHtcbiAgICAgICAgICAgIGxldCBhID0gMSwgYiA9IDAsIGMgPSAwLCBkID0gMTtcbiAgICAgICAgICAgIC8vIHJvdGF0aW9uXG4gICAgICAgICAgICBpZiAocm90YXRpb24pIHtcbiAgICAgICAgICAgICAgICBsZXQgcm90YXRpb25SYWRpYW5zID0gcm90YXRpb24gKiBPTkVfREVHUkVFO1xuICAgICAgICAgICAgICAgIGMgPSBNYXRoLnNpbihyb3RhdGlvblJhZGlhbnMpO1xuICAgICAgICAgICAgICAgIGQgPSBNYXRoLmNvcyhyb3RhdGlvblJhZGlhbnMpO1xuICAgICAgICAgICAgICAgIGEgPSBkO1xuICAgICAgICAgICAgICAgIGIgPSAtYztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNjYWxlXG4gICAgICAgICAgICB0bVswXSA9IGEgKj0gc3g7XG4gICAgICAgICAgICB0bVsxXSA9IGIgKj0gc3g7XG4gICAgICAgICAgICB0bVs0XSA9IGMgKj0gc3k7XG4gICAgICAgICAgICB0bVs1XSA9IGQgKj0gc3k7XG4gICAgICAgICAgICAvLyBza2V3XG4gICAgICAgICAgICBpZiAoaGFzU2tldykge1xuICAgICAgICAgICAgICAgIGxldCBhID0gdG1bMF0sIGIgPSB0bVsxXSwgYyA9IHRtWzRdLCBkID0gdG1bNV07XG4gICAgICAgICAgICAgICAgbGV0IHNreCA9IE1hdGgudGFuKHRoaXMuX3NrZXdYICogT05FX0RFR1JFRSk7XG4gICAgICAgICAgICAgICAgbGV0IHNreSA9IE1hdGgudGFuKHRoaXMuX3NrZXdZICogT05FX0RFR1JFRSk7XG4gICAgICAgICAgICAgICAgaWYgKHNreCA9PT0gSW5maW5pdHkpXG4gICAgICAgICAgICAgICAgICAgIHNreCA9IDk5OTk5OTk5O1xuICAgICAgICAgICAgICAgIGlmIChza3kgPT09IEluZmluaXR5KVxuICAgICAgICAgICAgICAgICAgICBza3kgPSA5OTk5OTk5OTtcbiAgICAgICAgICAgICAgICB0bVswXSA9IGEgKyBjICogc2t5O1xuICAgICAgICAgICAgICAgIHRtWzFdID0gYiArIGQgKiBza3k7XG4gICAgICAgICAgICAgICAgdG1bNF0gPSBjICsgYSAqIHNreDtcbiAgICAgICAgICAgICAgICB0bVs1XSA9IGQgKyBiICogc2t4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdG1bMF0gPSBzeDtcbiAgICAgICAgICAgIHRtWzFdID0gMDtcbiAgICAgICAgICAgIHRtWzRdID0gMDtcbiAgICAgICAgICAgIHRtWzVdID0gc3k7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBwb3NpdGlvblxuICAgIHRtWzEyXSA9IHRyc1swXTtcbiAgICB0bVsxM10gPSB0cnNbMV07XG4gICAgXG4gICAgdGhpcy5fbG9jYWxNYXREaXJ0eSAmPSB+TG9jYWxEaXJ0eUZsYWcuVFJTUztcbiAgICAvLyBSZWdpc3RlciBkaXJ0eSBzdGF0dXMgb2Ygd29ybGQgbWF0cml4IHNvIHRoYXQgaXQgY2FuIGJlIHJlY2FsY3VsYXRlZFxuICAgIHRoaXMuX3dvcmxkTWF0RGlydHkgPSB0cnVlO1xufVxuXG5mdW5jdGlvbiBjYWxjdWxXb3JsZE1hdHJpeDNEICgpIHtcbiAgICAvLyBBdm9pZCBhcyBtdWNoIGZ1bmN0aW9uIGNhbGwgYXMgcG9zc2libGVcbiAgICBpZiAodGhpcy5fbG9jYWxNYXREaXJ0eSAmIExvY2FsRGlydHlGbGFnLlRSU1MpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlTG9jYWxNYXRyaXgoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcGFyZW50KSB7XG4gICAgICAgIGxldCBwYXJlbnRNYXQgPSB0aGlzLl9wYXJlbnQuX3dvcmxkTWF0cml4O1xuICAgICAgICBNYXQ0Lm11bCh0aGlzLl93b3JsZE1hdHJpeCwgcGFyZW50TWF0LCB0aGlzLl9tYXRyaXgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgTWF0NC5jb3B5KHRoaXMuX3dvcmxkTWF0cml4LCB0aGlzLl9tYXRyaXgpO1xuICAgIH1cbiAgICB0aGlzLl93b3JsZE1hdERpcnR5ID0gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGNhbGN1bFdvcmxkTWF0cml4MkQgKCkge1xuICAgIC8vIEF2b2lkIGFzIG11Y2ggZnVuY3Rpb24gY2FsbCBhcyBwb3NzaWJsZVxuICAgIGlmICh0aGlzLl9sb2NhbE1hdERpcnR5ICYgTG9jYWxEaXJ0eUZsYWcuVFJTUykge1xuICAgICAgICB0aGlzLl91cGRhdGVMb2NhbE1hdHJpeCgpO1xuICAgIH1cbiAgICBcbiAgICAvLyBBc3N1bWUgcGFyZW50IHdvcmxkIG1hdHJpeCBpcyBjb3JyZWN0XG4gICAgbGV0IHBhcmVudCA9IHRoaXMuX3BhcmVudDtcbiAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIHRoaXMuX211bE1hdCh0aGlzLl93b3JsZE1hdHJpeCwgcGFyZW50Ll93b3JsZE1hdHJpeCwgdGhpcy5fbWF0cml4KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIE1hdDQuY29weSh0aGlzLl93b3JsZE1hdHJpeCwgdGhpcy5fbWF0cml4KTtcbiAgICB9XG4gICAgdGhpcy5fd29ybGRNYXREaXJ0eSA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBtdWxNYXQyRCAob3V0LCBhLCBiKSB7XG4gICAgbGV0IGFtID0gYS5tLCBibSA9IGIubSwgb3V0bSA9IG91dC5tO1xuICAgIGxldCBhYT1hbVswXSwgYWI9YW1bMV0sIGFjPWFtWzRdLCBhZD1hbVs1XSwgYXR4PWFtWzEyXSwgYXR5PWFtWzEzXTtcbiAgICBsZXQgYmE9Ym1bMF0sIGJiPWJtWzFdLCBiYz1ibVs0XSwgYmQ9Ym1bNV0sIGJ0eD1ibVsxMl0sIGJ0eT1ibVsxM107XG4gICAgaWYgKGFiICE9PSAwIHx8IGFjICE9PSAwKSB7XG4gICAgICAgIG91dG1bMF0gPSBiYSAqIGFhICsgYmIgKiBhYztcbiAgICAgICAgb3V0bVsxXSA9IGJhICogYWIgKyBiYiAqIGFkO1xuICAgICAgICBvdXRtWzRdID0gYmMgKiBhYSArIGJkICogYWM7XG4gICAgICAgIG91dG1bNV0gPSBiYyAqIGFiICsgYmQgKiBhZDtcbiAgICAgICAgb3V0bVsxMl0gPSBhYSAqIGJ0eCArIGFjICogYnR5ICsgYXR4O1xuICAgICAgICBvdXRtWzEzXSA9IGFiICogYnR4ICsgYWQgKiBidHkgKyBhdHk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBvdXRtWzBdID0gYmEgKiBhYTtcbiAgICAgICAgb3V0bVsxXSA9IGJiICogYWQ7XG4gICAgICAgIG91dG1bNF0gPSBiYyAqIGFhO1xuICAgICAgICBvdXRtWzVdID0gYmQgKiBhZDtcbiAgICAgICAgb3V0bVsxMl0gPSBhYSAqIGJ0eCArIGF0eDtcbiAgICAgICAgb3V0bVsxM10gPSBhZCAqIGJ0eSArIGF0eTtcbiAgICB9XG59XG5cbmNvbnN0IG11bE1hdDNEID0gTWF0NC5tdWw7XG5cbi8qKlxuICogISNlblxuICogQ2xhc3Mgb2YgYWxsIGVudGl0aWVzIGluIENvY29zIENyZWF0b3Igc2NlbmVzLjxici8+XG4gKiBGb3IgZXZlbnRzIHN1cHBvcnRlZCBieSBOb2RlLCBwbGVhc2UgcmVmZXIgdG8ge3sjY3Jvc3NMaW5rIFwiTm9kZS5FdmVudFR5cGVcIn19e3svY3Jvc3NMaW5rfX1cbiAqICEjemhcbiAqIENvY29zIENyZWF0b3Ig5Zy65pmv5Lit55qE5omA5pyJ6IqC54K557G744CCPGJyLz5cbiAqIOaUr+aMgeeahOiKgueCueS6i+S7tu+8jOivt+WPgumYhSB7eyNjcm9zc0xpbmsgXCJOb2RlLkV2ZW50VHlwZVwifX17ey9jcm9zc0xpbmt9feOAglxuICogQGNsYXNzIE5vZGVcbiAqIEBleHRlbmRzIF9CYXNlTm9kZVxuICovXG5sZXQgTm9kZURlZmluZXMgPSB7XG4gICAgbmFtZTogJ2NjLk5vZGUnLFxuICAgIGV4dGVuZHM6IEJhc2VOb2RlLFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBTRVJJQUxJWkFCTEVcbiAgICAgICAgX29wYWNpdHk6IDI1NSxcbiAgICAgICAgX2NvbG9yOiBjYy5Db2xvci5XSElURSxcbiAgICAgICAgX2NvbnRlbnRTaXplOiBjYy5TaXplLFxuICAgICAgICBfYW5jaG9yUG9pbnQ6IGNjLnYyKDAuNSwgMC41KSxcbiAgICAgICAgX3Bvc2l0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgIF9zY2FsZTogdW5kZWZpbmVkLFxuICAgICAgICBfdHJzOiBudWxsLFxuICAgICAgICBfZXVsZXJBbmdsZXM6IGNjLlZlYzMsXG4gICAgICAgIF9za2V3WDogMC4wLFxuICAgICAgICBfc2tld1k6IDAuMCxcbiAgICAgICAgX3pJbmRleDoge1xuICAgICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdHlwZTogY2MuSW50ZWdlclxuICAgICAgICB9LFxuICAgICAgICBfbG9jYWxaT3JkZXI6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IDAsXG4gICAgICAgICAgICBzZXJpYWxpemFibGU6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgXG4gICAgICAgIF9pczNETm9kZTogZmFsc2UsXG5cbiAgICAgICAgLy8gaW50ZXJuYWwgcHJvcGVydGllc1xuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBHcm91cCBpbmRleCBvZiBub2RlLjxici8+XG4gICAgICAgICAqIFdoaWNoIEdyb3VwIHRoaXMgbm9kZSBiZWxvbmdzIHRvIHdpbGwgcmVzb2x2ZSB0aGF0IHRoaXMgbm9kZSdzIGNvbGxpc2lvbiBjb21wb25lbnRzIGNhbiBjb2xsaWRlIHdpdGggd2hpY2ggb3RoZXIgY29sbGlzaW9uIGNvbXBvbmVudG5zLjxici8+XG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog6IqC54K555qE5YiG57uE57Si5byV44CCPGJyLz5cbiAgICAgICAgICog6IqC54K555qE5YiG57uE5bCG5YWz57O75Yiw6IqC54K555qE56Kw5pKe57uE5Lu25Y+v5Lul5LiO5ZOq5Lqb56Kw5pKe57uE5Lu255u456Kw5pKe44CCPGJyLz5cbiAgICAgICAgICogQHByb3BlcnR5IGdyb3VwSW5kZXhcbiAgICAgICAgICogQHR5cGUge0ludGVnZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIF9ncm91cEluZGV4OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICAgICAgZm9ybWVybHlTZXJpYWxpemVkQXM6ICdncm91cEluZGV4J1xuICAgICAgICB9LFxuICAgICAgICBncm91cEluZGV4OiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9ncm91cEluZGV4O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9ncm91cEluZGV4ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgX3VwZGF0ZUN1bGxpbmdNYXNrKHRoaXMpO1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChFdmVudFR5cGUuR1JPVVBfQ0hBTkdFRCwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogR3JvdXAgb2Ygbm9kZS48YnIvPlxuICAgICAgICAgKiBXaGljaCBHcm91cCB0aGlzIG5vZGUgYmVsb25ncyB0byB3aWxsIHJlc29sdmUgdGhhdCB0aGlzIG5vZGUncyBjb2xsaXNpb24gY29tcG9uZW50cyBjYW4gY29sbGlkZSB3aXRoIHdoaWNoIG90aGVyIGNvbGxpc2lvbiBjb21wb25lbnRucy48YnIvPlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOiKgueCueeahOWIhue7hOOAgjxici8+XG4gICAgICAgICAqIOiKgueCueeahOWIhue7hOWwhuWFs+ezu+WIsOiKgueCueeahOeisOaSnue7hOS7tuWPr+S7peS4juWTquS6m+eisOaSnue7hOS7tuebuOeisOaSnuOAgjxici8+XG4gICAgICAgICAqIEBwcm9wZXJ0eSBncm91cFxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgZ3JvdXA6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNjLmdhbWUuZ3JvdXBMaXN0W3RoaXMuZ3JvdXBJbmRleF0gfHwgJyc7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBncm91cEluZGV4XG4gICAgICAgICAgICAgICAgdGhpcy5ncm91cEluZGV4ID0gY2MuZ2FtZS5ncm91cExpc3QuaW5kZXhPZih2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy9wcm9wZXJ0aWVzIG1vdmVkIGZyb20gYmFzZSBub2RlIGJlZ2luXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIHBvc2l0aW9uICh4LCB5KSBvZiB0aGUgbm9kZSBpbiBpdHMgcGFyZW50J3MgY29vcmRpbmF0ZXMuXG4gICAgICAgICAqICEjemgg6IqC54K55Zyo54i26IqC54K55Z2Q5qCH57O75Lit55qE5L2N572u77yIeCwgee+8ieOAglxuICAgICAgICAgKiBAcHJvcGVydHkge1ZlYzN9IHBvc2l0aW9uXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIGNjLmxvZyhcIk5vZGUgUG9zaXRpb246IFwiICsgbm9kZS5wb3NpdGlvbik7XG4gICAgICAgICAqL1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIHggYXhpcyBwb3NpdGlvbiBvZiBub2RlLlxuICAgICAgICAgKiAhI3poIOiKgueCuSBYIOi9tOWdkOagh+OAglxuICAgICAgICAgKiBAcHJvcGVydHkgeFxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBub2RlLnggPSAxMDA7XG4gICAgICAgICAqIGNjLmxvZyhcIk5vZGUgUG9zaXRpb24gWDogXCIgKyBub2RlLngpO1xuICAgICAgICAgKi9cbiAgICAgICAgeDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdHJzWzBdO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBsZXQgdHJzID0gdGhpcy5fdHJzO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gdHJzWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghQ0NfRURJVE9SIHx8IGlzRmluaXRlKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG9sZFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZFZhbHVlID0gdHJzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnNbMF0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0TG9jYWxEaXJ0eShMb2NhbERpcnR5RmxhZy5BTExfUE9TSVRJT04pO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmYXN0IGNoZWNrIGV2ZW50XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fZXZlbnRNYXNrICYgUE9TSVRJT05fT04pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzZW5kIGV2ZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoRXZlbnRUeXBlLlBPU0lUSU9OX0NIQU5HRUQsIG5ldyBjYy5WZWMzKG9sZFZhbHVlLCB0cnNbMV0sIHRyc1syXSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KEV2ZW50VHlwZS5QT1NJVElPTl9DSEFOR0VEKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5lcnJvcihFUlJfSU5WQUxJRF9OVU1CRVIsICduZXcgeCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiB5IGF4aXMgcG9zaXRpb24gb2Ygbm9kZS5cbiAgICAgICAgICogISN6aCDoioLngrkgWSDovbTlnZDmoIfjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHlcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogbm9kZS55ID0gMTAwO1xuICAgICAgICAgKiBjYy5sb2coXCJOb2RlIFBvc2l0aW9uIFk6IFwiICsgbm9kZS55KTtcbiAgICAgICAgICovXG4gICAgICAgIHk6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Ryc1sxXTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgbGV0IHRycyA9IHRoaXMuX3RycztcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgIT09IHRyc1sxXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIUNDX0VESVRPUiB8fCBpc0Zpbml0ZSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBvbGRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbGRWYWx1ZSA9IHRyc1sxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdHJzWzFdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldExvY2FsRGlydHkoTG9jYWxEaXJ0eUZsYWcuQUxMX1BPU0lUSU9OKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmFzdCBjaGVjayBldmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2V2ZW50TWFzayAmIFBPU0lUSU9OX09OKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2VuZCBldmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KEV2ZW50VHlwZS5QT1NJVElPTl9DSEFOR0VELCBuZXcgY2MuVmVjMyh0cnNbMF0sIG9sZFZhbHVlLCB0cnNbMl0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdChFdmVudFR5cGUuUE9TSVRJT05fQ0hBTkdFRCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2MuZXJyb3IoRVJSX0lOVkFMSURfTlVNQkVSLCAnbmV3IHknKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4geiBheGlzIHBvc2l0aW9uIG9mIG5vZGUuXG4gICAgICAgICAqICEjemgg6IqC54K5IFog6L205Z2Q5qCH44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB6XG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB6OiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl90cnNbMl07XG4gICAgICAgICAgICB9LCBcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBsZXQgdHJzID0gdGhpcy5fdHJzO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gdHJzWzJdKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghQ0NfRURJVE9SIHx8IGlzRmluaXRlKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJzWzJdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldExvY2FsRGlydHkoTG9jYWxEaXJ0eUZsYWcuQUxMX1BPU0lUSU9OKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICFDQ19OQVRJVkVSRU5ERVJFUiAmJiAodGhpcy5fcmVuZGVyRmxhZyB8PSBSZW5kZXJGbG93LkZMQUdfV09STERfVFJBTlNGT1JNKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZhc3QgY2hlY2sgZXZlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9ldmVudE1hc2sgJiBQT1NJVElPTl9PTikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdChFdmVudFR5cGUuUE9TSVRJT05fQ0hBTkdFRCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5lcnJvcihFUlJfSU5WQUxJRF9OVU1CRVIsICduZXcgeicpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFJvdGF0aW9uIG9mIG5vZGUuXG4gICAgICAgICAqICEjemgg6K+l6IqC54K55peL6L2s6KeS5bqm44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSByb3RhdGlvblxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4xXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIG5vZGUucm90YXRpb24gPSA5MDtcbiAgICAgICAgICogY2MubG9nKFwiTm9kZSBSb3RhdGlvbjogXCIgKyBub2RlLnJvdGF0aW9uKTtcbiAgICAgICAgICovXG4gICAgICAgIHJvdGF0aW9uOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIGlmIChDQ19ERUJVRykge1xuICAgICAgICAgICAgICAgICAgICBjYy53YXJuKFwiYGNjLk5vZGUucm90YXRpb25gIGlzIGRlcHJlY2F0ZWQgc2luY2UgdjIuMS4wLCBwbGVhc2UgdXNlIGAtYW5nbGVgIGluc3RlYWQuIChgdGhpcy5ub2RlLnJvdGF0aW9uYCAtPiBgLXRoaXMubm9kZS5hbmdsZWApXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gLXRoaXMuYW5nbGU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChDQ19ERUJVRykge1xuICAgICAgICAgICAgICAgICAgICBjYy53YXJuKFwiYGNjLk5vZGUucm90YXRpb25gIGlzIGRlcHJlY2F0ZWQgc2luY2UgdjIuMS4wLCBwbGVhc2Ugc2V0IGAtYW5nbGVgIGluc3RlYWQuIChgdGhpcy5ub2RlLnJvdGF0aW9uID0geGAgLT4gYHRoaXMubm9kZS5hbmdsZSA9IC14YClcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuYW5nbGUgPSAtdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogQW5nbGUgb2Ygbm9kZSwgdGhlIHBvc2l0aXZlIHZhbHVlIGlzIGFudGktY2xvY2t3aXNlIGRpcmVjdGlvbi5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDor6XoioLngrnnmoTml4vovazop5LluqbvvIzmraPlgLzkuLrpgIbml7bpkojmlrnlkJHjgIJcbiAgICAgICAgICogQHByb3BlcnR5IGFuZ2xlXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBhbmdsZToge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZXVsZXJBbmdsZXMuejtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgVmVjMy5zZXQodGhpcy5fZXVsZXJBbmdsZXMsIDAsIDAsIHZhbHVlKTsgICBcbiAgICAgICAgICAgICAgICBUcnMuZnJvbUFuZ2xlWih0aGlzLl90cnMsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldExvY2FsRGlydHkoTG9jYWxEaXJ0eUZsYWcuQUxMX1JPVEFUSU9OKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9ldmVudE1hc2sgJiBST1RBVElPTl9PTikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoRXZlbnRUeXBlLlJPVEFUSU9OX0NIQU5HRUQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgcm90YXRpb24gYXMgRXVsZXIgYW5nbGVzIGluIGRlZ3JlZXMsIHVzZWQgaW4gM0Qgbm9kZS5cbiAgICAgICAgICogISN6aCDor6XoioLngrnnmoTmrKfmi4nop5LluqbvvIznlKjkuo4gM0Qg6IqC54K544CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBldWxlckFuZ2xlc1xuICAgICAgICAgKiBAdHlwZSB7VmVjM31cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogbm9kZS5pczNETm9kZSA9IHRydWU7XG4gICAgICAgICAqIG5vZGUuZXVsZXJBbmdsZXMgPSBjYy52Myg0NSwgNDUsIDQ1KTtcbiAgICAgICAgICogY2MubG9nKFwiTm9kZSBldWxlckFuZ2xlcyAoWCwgWSwgWik6IFwiICsgbm9kZS5ldWxlckFuZ2xlcy50b1N0cmluZygpKTtcbiAgICAgICAgICovXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gUm90YXRpb24gb24geCBheGlzLlxuICAgICAgICAgKiAhI3poIOivpeiKgueCuSBYIOi9tOaXi+i9rOinkuW6puOAglxuICAgICAgICAgKiBAcHJvcGVydHkgcm90YXRpb25YXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjFcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogbm9kZS5pczNETm9kZSA9IHRydWU7XG4gICAgICAgICAqIG5vZGUuZXVsZXJBbmdsZXMgPSBjYy52Myg0NSwgMCwgMCk7XG4gICAgICAgICAqIGNjLmxvZyhcIk5vZGUgZXVsZXJBbmdsZXMgWDogXCIgKyBub2RlLmV1bGVyQW5nbGVzLngpO1xuICAgICAgICAgKi9cbiAgICAgICAgcm90YXRpb25YOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIGlmIChDQ19ERUJVRykge1xuICAgICAgICAgICAgICAgICAgICBjYy53YXJuKFwiYGNjLk5vZGUucm90YXRpb25YYCBpcyBkZXByZWNhdGVkIHNpbmNlIHYyLjEuMCwgcGxlYXNlIHVzZSBgZXVsZXJBbmdsZXMueGAgaW5zdGVhZC4gKGB0aGlzLm5vZGUucm90YXRpb25YYCAtPiBgdGhpcy5ub2RlLmV1bGVyQW5nbGVzLnhgKVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V1bGVyQW5nbGVzLng7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChDQ19ERUJVRykge1xuICAgICAgICAgICAgICAgICAgICBjYy53YXJuKFwiYGNjLk5vZGUucm90YXRpb25YYCBpcyBkZXByZWNhdGVkIHNpbmNlIHYyLjEuMCwgcGxlYXNlIHNldCBgZXVsZXJBbmdsZXNgIGluc3RlYWQuIChgdGhpcy5ub2RlLnJvdGF0aW9uWCA9IHhgIC0+IGB0aGlzLm5vZGUuaXMzRE5vZGUgPSB0cnVlOyB0aGlzLm5vZGUuZXVsZXJBbmdsZXMgPSBjYy52Myh4LCAwLCAwKWBcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9ldWxlckFuZ2xlcy54ICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldWxlckFuZ2xlcy54ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSBxdWF0ZXJuaW9uIGZyb20gcm90YXRpb25cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2V1bGVyQW5nbGVzLnggPT09IHRoaXMuX2V1bGVyQW5nbGVzLnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRycy5mcm9tQW5nbGVaKHRoaXMuX3RycywgLXZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRycy5mcm9tRXVsZXJOdW1iZXIodGhpcy5fdHJzLCB2YWx1ZSwgdGhpcy5fZXVsZXJBbmdsZXMueSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRMb2NhbERpcnR5KExvY2FsRGlydHlGbGFnLkFMTF9ST1RBVElPTik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2V2ZW50TWFzayAmIFJPVEFUSU9OX09OKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoRXZlbnRUeXBlLlJPVEFUSU9OX0NIQU5HRUQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBSb3RhdGlvbiBvbiB5IGF4aXMuXG4gICAgICAgICAqICEjemgg6K+l6IqC54K5IFkg6L205peL6L2s6KeS5bqm44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSByb3RhdGlvbllcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBub2RlLmlzM0ROb2RlID0gdHJ1ZTtcbiAgICAgICAgICogbm9kZS5ldWxlckFuZ2xlcyA9IGNjLnYzKDAsIDQ1LCAwKTtcbiAgICAgICAgICogY2MubG9nKFwiTm9kZSBldWxlckFuZ2xlcyBZOiBcIiArIG5vZGUuZXVsZXJBbmdsZXMueSk7XG4gICAgICAgICAqL1xuICAgICAgICByb3RhdGlvblk6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKENDX0RFQlVHKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLndhcm4oXCJgY2MuTm9kZS5yb3RhdGlvbllgIGlzIGRlcHJlY2F0ZWQgc2luY2UgdjIuMS4wLCBwbGVhc2UgdXNlIGBldWxlckFuZ2xlcy55YCBpbnN0ZWFkLiAoYHRoaXMubm9kZS5yb3RhdGlvbllgIC0+IGB0aGlzLm5vZGUuZXVsZXJBbmdsZXMueWApXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZXVsZXJBbmdsZXMueTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKENDX0RFQlVHKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLndhcm4oXCJgY2MuTm9kZS5yb3RhdGlvbllgIGlzIGRlcHJlY2F0ZWQgc2luY2UgdjIuMS4wLCBwbGVhc2Ugc2V0IGBldWxlckFuZ2xlc2AgaW5zdGVhZC4gKGB0aGlzLm5vZGUucm90YXRpb25ZID0geWAgLT4gYHRoaXMubm9kZS5pczNETm9kZSA9IHRydWU7IHRoaXMubm9kZS5ldWxlckFuZ2xlcyA9IGNjLnYzKDAsIHksIDApYFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2V1bGVyQW5nbGVzLnkgIT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V1bGVyQW5nbGVzLnkgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlIHF1YXRlcm5pb24gZnJvbSByb3RhdGlvblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fZXVsZXJBbmdsZXMueCA9PT0gdGhpcy5fZXVsZXJBbmdsZXMueSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVHJzLmZyb21BbmdsZVoodGhpcy5fdHJzLCAtdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgVHJzLmZyb21FdWxlck51bWJlcih0aGlzLl90cnMsIHRoaXMuX2V1bGVyQW5nbGVzLngsIHZhbHVlLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldExvY2FsRGlydHkoTG9jYWxEaXJ0eUZsYWcuQUxMX1JPVEFUSU9OKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fZXZlbnRNYXNrICYgUk9UQVRJT05fT04pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdChFdmVudFR5cGUuUk9UQVRJT05fQ0hBTkdFRCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuXG4gICAgICAgIGV1bGVyQW5nbGVzOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V1bGVyQW5nbGVzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFRycy50b0V1bGVyKHRoaXMuX2V1bGVyQW5nbGVzLCB0aGlzLl90cnMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHNldCAodikge1xuICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXVsZXJBbmdsZXMuc2V0KHYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIFRycy5mcm9tRXVsZXIodGhpcy5fdHJzLCB2KTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldExvY2FsRGlydHkoTG9jYWxEaXJ0eUZsYWcuQUxMX1JPVEFUSU9OKTtcbiAgICAgICAgICAgICAgICAhQ0NfTkFUSVZFUkVOREVSRVIgJiYgKHRoaXMuX3JlbmRlckZsYWcgfD0gUmVuZGVyRmxvdy5GTEFHX1RSQU5TRk9STSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICAvLyBUaGlzIHByb3BlcnR5IGlzIHVzZWQgZm9yIE1lc2ggU2tlbGV0b24gQW5pbWF0aW9uXG4gICAgICAgIC8vIFNob3VsZCBiZSByZW1vdmVkIHdoZW4gbm9kZS5yb3RhdGlvbiB1cGdyYWRlIHRvIHF1YXRlcm5pb24gdmFsdWVcbiAgICAgICAgcXVhdDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICBsZXQgdHJzID0gdGhpcy5fdHJzO1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUXVhdCh0cnNbM10sIHRyc1s0XSwgdHJzWzVdLCB0cnNbNl0pO1xuICAgICAgICAgICAgfSwgc2V0ICh2KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRSb3RhdGlvbih2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgbG9jYWwgc2NhbGUgcmVsYXRpdmUgdG8gdGhlIHBhcmVudC5cbiAgICAgICAgICogISN6aCDoioLngrnnm7jlr7nniLboioLngrnnmoTnvKnmlL7jgIJcbiAgICAgICAgICogQHByb3BlcnR5IHNjYWxlXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIG5vZGUuc2NhbGUgPSAxO1xuICAgICAgICAgKi9cbiAgICAgICAgc2NhbGU6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Ryc1s3XTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNjYWxlKHYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFNjYWxlIG9uIHggYXhpcy5cbiAgICAgICAgICogISN6aCDoioLngrkgWCDovbTnvKnmlL7jgIJcbiAgICAgICAgICogQHByb3BlcnR5IHNjYWxlWFxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBub2RlLnNjYWxlWCA9IDAuNTtcbiAgICAgICAgICogY2MubG9nKFwiTm9kZSBTY2FsZSBYOiBcIiArIG5vZGUuc2NhbGVYKTtcbiAgICAgICAgICovXG4gICAgICAgIHNjYWxlWDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdHJzWzddO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdHJzWzddICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl90cnNbN10gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRMb2NhbERpcnR5KExvY2FsRGlydHlGbGFnLkFMTF9TQ0FMRSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2V2ZW50TWFzayAmIFNDQUxFX09OKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoRXZlbnRUeXBlLlNDQUxFX0NIQU5HRUQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBTY2FsZSBvbiB5IGF4aXMuXG4gICAgICAgICAqICEjemgg6IqC54K5IFkg6L2057yp5pS+44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBzY2FsZVlcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogbm9kZS5zY2FsZVkgPSAwLjU7XG4gICAgICAgICAqIGNjLmxvZyhcIk5vZGUgU2NhbGUgWTogXCIgKyBub2RlLnNjYWxlWSk7XG4gICAgICAgICAqL1xuICAgICAgICBzY2FsZVk6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Ryc1s4XTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3Ryc1s4XSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdHJzWzhdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0TG9jYWxEaXJ0eShMb2NhbERpcnR5RmxhZy5BTExfU0NBTEUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9ldmVudE1hc2sgJiBTQ0FMRV9PTikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KEV2ZW50VHlwZS5TQ0FMRV9DSEFOR0VEKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gU2NhbGUgb24geiBheGlzLlxuICAgICAgICAgKiAhI3poIOiKgueCuSBaIOi9tOe8qeaUvuOAglxuICAgICAgICAgKiBAcHJvcGVydHkgc2NhbGVaXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBzY2FsZVo6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Ryc1s5XTtcbiAgICAgICAgICAgIH0sIFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90cnNbOV0gIT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Ryc1s5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldExvY2FsRGlydHkoTG9jYWxEaXJ0eUZsYWcuQUxMX1NDQUxFKTtcbiAgICAgICAgICAgICAgICAgICAgIUNDX05BVElWRVJFTkRFUkVSICYmICh0aGlzLl9yZW5kZXJGbGFnIHw9IFJlbmRlckZsb3cuRkxBR19UUkFOU0ZPUk0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9ldmVudE1hc2sgJiBTQ0FMRV9PTikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KEV2ZW50VHlwZS5TQ0FMRV9DSEFOR0VEKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBTa2V3IHhcbiAgICAgICAgICogISN6aCDor6XoioLngrkgWCDovbTlgL7mlpzop5LluqbjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHNrZXdYXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIG5vZGUuc2tld1ggPSAwO1xuICAgICAgICAgKiBjYy5sb2coXCJOb2RlIFNrZXdYOiBcIiArIG5vZGUuc2tld1gpO1xuICAgICAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4yLjFcbiAgICAgICAgICovXG4gICAgICAgIHNrZXdYOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9za2V3WDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgX3NrZXdXYXJuKHZhbHVlLCB0aGlzKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX3NrZXdYID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRMb2NhbERpcnR5KExvY2FsRGlydHlGbGFnLlNLRVcpO1xuICAgICAgICAgICAgICAgIGlmIChDQ19KU0IgJiYgQ0NfTkFUSVZFUkVOREVSRVIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJveHkudXBkYXRlU2tldygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBTa2V3IHlcbiAgICAgICAgICogISN6aCDor6XoioLngrkgWSDovbTlgL7mlpzop5LluqbjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHNrZXdZXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIG5vZGUuc2tld1kgPSAwO1xuICAgICAgICAgKiBjYy5sb2coXCJOb2RlIFNrZXdZOiBcIiArIG5vZGUuc2tld1kpO1xuICAgICAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4yLjFcbiAgICAgICAgICovXG4gICAgICAgIHNrZXdZOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9za2V3WTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgX3NrZXdXYXJuKHZhbHVlLCB0aGlzKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX3NrZXdZID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRMb2NhbERpcnR5KExvY2FsRGlydHlGbGFnLlNLRVcpO1xuICAgICAgICAgICAgICAgIGlmIChDQ19KU0IgJiYgQ0NfTkFUSVZFUkVOREVSRVIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJveHkudXBkYXRlU2tldygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBPcGFjaXR5IG9mIG5vZGUsIGRlZmF1bHQgdmFsdWUgaXMgMjU1LlxuICAgICAgICAgKiAhI3poIOiKgueCuemAj+aYjuW6pu+8jOm7mOiupOWAvOS4uiAyNTXjgIJcbiAgICAgICAgICogQHByb3BlcnR5IG9wYWNpdHlcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogbm9kZS5vcGFjaXR5ID0gMjU1O1xuICAgICAgICAgKi9cbiAgICAgICAgb3BhY2l0eToge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fb3BhY2l0eTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBjYy5taXNjLmNsYW1wZih2YWx1ZSwgMCwgMjU1KTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fb3BhY2l0eSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb3BhY2l0eSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoQ0NfSlNCICYmIENDX05BVElWRVJFTkRFUkVSKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcm94eS51cGRhdGVPcGFjaXR5KCk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbmRlckZsYWcgfD0gUmVuZGVyRmxvdy5GTEFHX09QQUNJVFlfQ09MT1I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJhbmdlOiBbMCwgMjU1XVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIENvbG9yIG9mIG5vZGUsIGRlZmF1bHQgdmFsdWUgaXMgd2hpdGU6ICgyNTUsIDI1NSwgMjU1KS5cbiAgICAgICAgICogISN6aCDoioLngrnpopzoibLjgILpu5jorqTkuLrnmb3oibLvvIzmlbDlgLzkuLrvvJrvvIgyNTXvvIwyNTXvvIwyNTXvvInjgIJcbiAgICAgICAgICogQHByb3BlcnR5IGNvbG9yXG4gICAgICAgICAqIEB0eXBlIHtDb2xvcn1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogbm9kZS5jb2xvciA9IG5ldyBjYy5Db2xvcigyNTUsIDI1NSwgMjU1KTtcbiAgICAgICAgICovXG4gICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb2xvci5jbG9uZSgpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fY29sb3IuZXF1YWxzKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb2xvci5zZXQodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoQ0NfREVWICYmIHZhbHVlLmEgIT09IDI1NSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2Mud2FybklEKDE2MjYpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVuZGVyRmxhZyB8PSBSZW5kZXJGbG93LkZMQUdfQ09MT1I7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2V2ZW50TWFzayAmIENPTE9SX09OKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoRXZlbnRUeXBlLkNPTE9SX0NIQU5HRUQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gQW5jaG9yIHBvaW50J3MgcG9zaXRpb24gb24geCBheGlzLlxuICAgICAgICAgKiAhI3poIOiKgueCuSBYIOi9tOmUmueCueS9jee9ruOAglxuICAgICAgICAgKiBAcHJvcGVydHkgYW5jaG9yWFxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBub2RlLmFuY2hvclggPSAwO1xuICAgICAgICAgKi9cbiAgICAgICAgYW5jaG9yWDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYW5jaG9yUG9pbnQueDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFuY2hvclBvaW50ID0gdGhpcy5fYW5jaG9yUG9pbnQ7XG4gICAgICAgICAgICAgICAgaWYgKGFuY2hvclBvaW50LnggIT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGFuY2hvclBvaW50LnggPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2V2ZW50TWFzayAmIEFOQ0hPUl9PTikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KEV2ZW50VHlwZS5BTkNIT1JfQ0hBTkdFRCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIEFuY2hvciBwb2ludCdzIHBvc2l0aW9uIG9uIHkgYXhpcy5cbiAgICAgICAgICogISN6aCDoioLngrkgWSDovbTplJrngrnkvY3nva7jgIJcbiAgICAgICAgICogQHByb3BlcnR5IGFuY2hvcllcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogbm9kZS5hbmNob3JZID0gMDtcbiAgICAgICAgICovXG4gICAgICAgIGFuY2hvclk6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FuY2hvclBvaW50Lnk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBhbmNob3JQb2ludCA9IHRoaXMuX2FuY2hvclBvaW50O1xuICAgICAgICAgICAgICAgIGlmIChhbmNob3JQb2ludC55ICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBhbmNob3JQb2ludC55ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9ldmVudE1hc2sgJiBBTkNIT1JfT04pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdChFdmVudFR5cGUuQU5DSE9SX0NIQU5HRUQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBXaWR0aCBvZiBub2RlLlxuICAgICAgICAgKiAhI3poIOiKgueCueWuveW6puOAglxuICAgICAgICAgKiBAcHJvcGVydHkgd2lkdGhcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogbm9kZS53aWR0aCA9IDEwMDtcbiAgICAgICAgICovXG4gICAgICAgIHdpZHRoOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZW50U2l6ZS53aWR0aDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB0aGlzLl9jb250ZW50U2l6ZS53aWR0aCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2xvbmUgPSBjYy5zaXplKHRoaXMuX2NvbnRlbnRTaXplLndpZHRoLCB0aGlzLl9jb250ZW50U2l6ZS5oZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRTaXplLndpZHRoID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9ldmVudE1hc2sgJiBTSVpFX09OKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KEV2ZW50VHlwZS5TSVpFX0NIQU5HRUQsIGNsb25lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdChFdmVudFR5cGUuU0laRV9DSEFOR0VEKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gSGVpZ2h0IG9mIG5vZGUuXG4gICAgICAgICAqICEjemgg6IqC54K56auY5bqm44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBoZWlnaHRcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogbm9kZS5oZWlnaHQgPSAxMDA7XG4gICAgICAgICAqL1xuICAgICAgICBoZWlnaHQ6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRTaXplLmhlaWdodDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB0aGlzLl9jb250ZW50U2l6ZS5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNsb25lID0gY2Muc2l6ZSh0aGlzLl9jb250ZW50U2l6ZS53aWR0aCwgdGhpcy5fY29udGVudFNpemUuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb250ZW50U2l6ZS5oZWlnaHQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2V2ZW50TWFzayAmIFNJWkVfT04pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCwgY2xvbmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KEV2ZW50VHlwZS5TSVpFX0NIQU5HRUQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiB6SW5kZXggaXMgdGhlICdrZXknIHVzZWQgdG8gc29ydCB0aGUgbm9kZSByZWxhdGl2ZSB0byBpdHMgc2libGluZ3MuPGJyLz5cbiAgICAgICAgICogVGhlIHZhbHVlIG9mIHpJbmRleCBzaG91bGQgYmUgaW4gdGhlIHJhbmdlIGJldHdlZW4gY2MubWFjcm8uTUlOX1pJTkRFWCBhbmQgY2MubWFjcm8uTUFYX1pJTkRFWC48YnIvPlxuICAgICAgICAgKiBUaGUgTm9kZSdzIHBhcmVudCB3aWxsIHNvcnQgYWxsIGl0cyBjaGlsZHJlbiBiYXNlZCBvbiB0aGUgekluZGV4IHZhbHVlIGFuZCB0aGUgYXJyaXZhbCBvcmRlci48YnIvPlxuICAgICAgICAgKiBOb2RlcyB3aXRoIGdyZWF0ZXIgekluZGV4IHdpbGwgYmUgc29ydGVkIGFmdGVyIG5vZGVzIHdpdGggc21hbGxlciB6SW5kZXguPGJyLz5cbiAgICAgICAgICogSWYgdHdvIG5vZGVzIGhhdmUgdGhlIHNhbWUgekluZGV4LCB0aGVuIHRoZSBub2RlIHRoYXQgd2FzIGFkZGVkIGZpcnN0IHRvIHRoZSBjaGlsZHJlbidzIGFycmF5IHdpbGwgYmUgaW4gZnJvbnQgb2YgdGhlIG90aGVyIG5vZGUgaW4gdGhlIGFycmF5Ljxici8+XG4gICAgICAgICAqIE5vZGUncyBvcmRlciBpbiBjaGlsZHJlbiBsaXN0IHdpbGwgYWZmZWN0IGl0cyByZW5kZXJpbmcgb3JkZXIuIFBhcmVudCBpcyBhbHdheXMgcmVuZGVyaW5nIGJlZm9yZSBhbGwgY2hpbGRyZW4uXG4gICAgICAgICAqICEjemggekluZGV4IOaYr+eUqOadpeWvueiKgueCuei/m+ihjOaOkuW6j+eahOWFs+mUruWxnuaAp++8jOWug+WGs+WumuS4gOS4quiKgueCueWcqOWFhOW8n+iKgueCueS5i+mXtOeahOS9jee9ruOAgjxici8+XG4gICAgICAgICAqIHpJbmRleCDnmoTlj5blgLzlupTor6Xku4vkuo4gY2MubWFjcm8uTUlOX1pJTkRFWCDlkowgY2MubWFjcm8uTUFYX1pJTkRFWCDkuYvpl7RcbiAgICAgICAgICog54i26IqC54K55Li76KaB5qC55o2u6IqC54K555qEIHpJbmRleCDlkozmt7vliqDmrKHluo/mnaXmjpLluo/vvIzmi6XmnInmm7Tpq5ggekluZGV4IOeahOiKgueCueWwhuiiq+aOkuWcqOWQjumdou+8jOWmguaenOS4pOS4quiKgueCueeahCB6SW5kZXgg5LiA6Ie077yM5YWI5re75Yqg55qE6IqC54K55Lya56iz5a6a5o6S5Zyo5Y+m5LiA5Liq6IqC54K55LmL5YmN44CCPGJyLz5cbiAgICAgICAgICog6IqC54K55ZyoIGNoaWxkcmVuIOS4reeahOmhuuW6j+WGs+WumuS6huWFtua4suafk+mhuuW6j+OAgueItuiKgueCueawuOi/nOWcqOaJgOacieWtkOiKgueCueS5i+WJjeiiq+a4suafk1xuICAgICAgICAgKiBAcHJvcGVydHkgekluZGV4XG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIG5vZGUuekluZGV4ID0gMTtcbiAgICAgICAgICogY2MubG9nKFwiTm9kZSB6SW5kZXg6IFwiICsgbm9kZS56SW5kZXgpO1xuICAgICAgICAgKi9cbiAgICAgICAgekluZGV4OiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9sb2NhbFpPcmRlciA+PiAxNjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID4gbWFjcm8uTUFYX1pJTkRFWCkge1xuICAgICAgICAgICAgICAgICAgICBjYy53YXJuSUQoMTYzNik7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gbWFjcm8uTUFYX1pJTkRFWDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodmFsdWUgPCBtYWNyby5NSU5fWklOREVYKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLndhcm5JRCgxNjM3KTtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBtYWNyby5NSU5fWklOREVYO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnpJbmRleCAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9jYWxaT3JkZXIgPSAodGhpcy5fbG9jYWxaT3JkZXIgJiAweDAwMDBmZmZmKSB8ICh2YWx1ZSA8PCAxNik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdChFdmVudFR5cGUuU0lCTElOR19PUkRFUl9DSEFOR0VEKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vblNpYmxpbmdJbmRleENoYW5nZWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICFlblxuICAgICAgICAgKiBTd2l0Y2ggMkQvM0Qgbm9kZS4gVGhlIDJEIG5vZGVzIHdpbGwgcnVuIGZhc3Rlci5cbiAgICAgICAgICogIXpoXG4gICAgICAgICAqIOWIh+aNoiAyRC8zRCDoioLngrnvvIwyRCDoioLngrnkvJrmnInmm7Tpq5jnmoTov5DooYzmlYjnjodcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBpczNETm9kZVxuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAqL1xuICAgICAgICBpczNETm9kZToge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faXMzRE5vZGU7XG4gICAgICAgICAgICB9LCBzZXQgKHYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pczNETm9kZSA9IHY7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlM0RGdW5jdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IFtuYW1lXVxuICAgICAqL1xuICAgIGN0b3IgKCkge1xuICAgICAgICB0aGlzLl9yZW9yZGVyQ2hpbGREaXJ0eSA9IGZhbHNlO1xuXG4gICAgICAgIC8vIGNhY2hlIGNvbXBvbmVudFxuICAgICAgICB0aGlzLl93aWRnZXQgPSBudWxsO1xuICAgICAgICAvLyBmYXN0IHJlbmRlciBjb21wb25lbnQgYWNjZXNzXG4gICAgICAgIHRoaXMuX3JlbmRlckNvbXBvbmVudCA9IG51bGw7XG4gICAgICAgIC8vIEV2ZW50IGxpc3RlbmVyc1xuICAgICAgICB0aGlzLl9jYXB0dXJpbmdMaXN0ZW5lcnMgPSBudWxsO1xuICAgICAgICB0aGlzLl9idWJibGluZ0xpc3RlbmVycyA9IG51bGw7XG4gICAgICAgIC8vIFRvdWNoIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgIHRoaXMuX3RvdWNoTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICAvLyBNb3VzZSBldmVudCBsaXN0ZW5lclxuICAgICAgICB0aGlzLl9tb3VzZUxpc3RlbmVyID0gbnVsbDtcblxuICAgICAgICB0aGlzLl9pbml0RGF0YUZyb21Qb29sKCk7XG5cbiAgICAgICAgdGhpcy5fZXZlbnRNYXNrID0gMDtcbiAgICAgICAgdGhpcy5fY3VsbGluZ01hc2sgPSAxO1xuICAgICAgICB0aGlzLl9jaGlsZEFycml2YWxPcmRlciA9IDE7XG5cbiAgICAgICAgLy8gUHJveHlcbiAgICAgICAgaWYgKENDX0pTQiAmJiBDQ19OQVRJVkVSRU5ERVJFUikge1xuICAgICAgICAgICAgdGhpcy5fcHJveHkgPSBuZXcgcmVuZGVyZXIuTm9kZVByb3h5KHRoaXMuX3NwYWNlSW5mby51bml0SUQsIHRoaXMuX3NwYWNlSW5mby5pbmRleCwgdGhpcy5faWQsIHRoaXMuX25hbWUpO1xuICAgICAgICAgICAgdGhpcy5fcHJveHkuaW5pdCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBzaG91bGQgcmVzZXQgX3JlbmRlckZsYWcgZm9yIGJvdGggd2ViIGFuZCBuYXRpdmVcbiAgICAgICAgdGhpcy5fcmVuZGVyRmxhZyA9IFJlbmRlckZsb3cuRkxBR19UUkFOU0ZPUk0gfCBSZW5kZXJGbG93LkZMQUdfT1BBQ0lUWV9DT0xPUjtcbiAgICB9LFxuXG4gICAgc3RhdGljczoge1xuICAgICAgICBFdmVudFR5cGUsXG4gICAgICAgIF9Mb2NhbERpcnR5RmxhZzogTG9jYWxEaXJ0eUZsYWcsXG4gICAgICAgIC8vIGlzIG5vZGUgYnV0IG5vdCBzY2VuZVxuICAgICAgICBpc05vZGUgKG9iaikge1xuICAgICAgICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIE5vZGUgJiYgKG9iai5jb25zdHJ1Y3RvciA9PT0gTm9kZSB8fCAhKG9iaiBpbnN0YW5jZW9mIGNjLlNjZW5lKSk7XG4gICAgICAgIH0sXG4gICAgICAgIEJ1aWx0aW5Hcm91cEluZGV4XG4gICAgfSxcblxuICAgIC8vIE9WRVJSSURFU1xuXG4gICAgX29uU2libGluZ0luZGV4Q2hhbmdlZCAoKSB7XG4gICAgICAgIC8vIHVwZGF0ZSByZW5kZXJpbmcgc2NlbmUgZ3JhcGgsIHNvcnQgdGhlbSBieSBhcnJpdmFsT3JkZXJcbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudCkge1xuICAgICAgICAgICAgdGhpcy5fcGFyZW50Ll9kZWxheVNvcnQoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfb25QcmVEZXN0cm95ICgpIHtcbiAgICAgICAgdmFyIGRlc3Ryb3lCeVBhcmVudCA9IHRoaXMuX29uUHJlRGVzdHJveUJhc2UoKTtcblxuICAgICAgICAvLyBBY3Rpb25zXG4gICAgICAgIGlmIChBY3Rpb25NYW5hZ2VyRXhpc3QpIHtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmdldEFjdGlvbk1hbmFnZXIoKS5yZW1vdmVBbGxBY3Rpb25zRnJvbVRhcmdldCh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlbW92ZSBOb2RlLmN1cnJlbnRIb3ZlcmVkXG4gICAgICAgIGlmIChfY3VycmVudEhvdmVyZWQgPT09IHRoaXMpIHtcbiAgICAgICAgICAgIF9jdXJyZW50SG92ZXJlZCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZW1vdmUgYWxsIGV2ZW50IGxpc3RlbmVycyBpZiBuZWNlc3NhcnlcbiAgICAgICAgaWYgKHRoaXMuX3RvdWNoTGlzdGVuZXIgfHwgdGhpcy5fbW91c2VMaXN0ZW5lcikge1xuICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLnJlbW92ZUxpc3RlbmVycyh0aGlzKTtcbiAgICAgICAgICAgIGlmICh0aGlzLl90b3VjaExpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdG91Y2hMaXN0ZW5lci5vd25lciA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5fdG91Y2hMaXN0ZW5lci5tYXNrID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLl90b3VjaExpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl9tb3VzZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbW91c2VMaXN0ZW5lci5vd25lciA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5fbW91c2VMaXN0ZW5lci5tYXNrID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb3VzZUxpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChDQ19KU0IgJiYgQ0NfTkFUSVZFUkVOREVSRVIpIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb3h5LmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb3h5ID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2JhY2tEYXRhSW50b1Bvb2woKTtcblxuICAgICAgICBpZiAodGhpcy5fcmVvcmRlckNoaWxkRGlydHkpIHtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLl9fZmFzdE9mZihjYy5EaXJlY3Rvci5FVkVOVF9BRlRFUl9VUERBVEUsIHRoaXMuc29ydEFsbENoaWxkcmVuLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZGVzdHJveUJ5UGFyZW50KSB7XG4gICAgICAgICAgICAvLyBzaW11bGF0ZSBzb21lIGRlc3RydWN0IGxvZ2ljIHRvIG1ha2UgdW5kbyBzeXN0ZW0gd29yayBjb3JyZWN0bHlcbiAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAvLyBlbnN1cmUgdGhpcyBub2RlIGNhbiByZWF0dGFjaCB0byBzY2VuZSBieSB1bmRvIHN5c3RlbVxuICAgICAgICAgICAgICAgIHRoaXMuX3BhcmVudCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX29uUG9zdEFjdGl2YXRlZCAoYWN0aXZlKSB7XG4gICAgICAgIHZhciBhY3Rpb25NYW5hZ2VyID0gQWN0aW9uTWFuYWdlckV4aXN0ID8gY2MuZGlyZWN0b3IuZ2V0QWN0aW9uTWFuYWdlcigpIDogbnVsbDtcbiAgICAgICAgaWYgKGFjdGl2ZSkge1xuICAgICAgICAgICAgLy8gUmVmcmVzaCB0cmFuc2Zvcm1cbiAgICAgICAgICAgIHRoaXMuX3JlbmRlckZsYWcgfD0gUmVuZGVyRmxvdy5GTEFHX1dPUkxEX1RSQU5TRk9STTtcbiAgICAgICAgICAgIC8vIEFjdGlvbk1hbmFnZXIgJiBFdmVudE1hbmFnZXJcbiAgICAgICAgICAgIGFjdGlvbk1hbmFnZXIgJiYgYWN0aW9uTWFuYWdlci5yZXN1bWVUYXJnZXQodGhpcyk7XG4gICAgICAgICAgICBldmVudE1hbmFnZXIucmVzdW1lVGFyZ2V0KHRoaXMpO1xuICAgICAgICAgICAgLy8gU2VhcmNoIE1hc2sgaW4gcGFyZW50XG4gICAgICAgICAgICB0aGlzLl9jaGVja0xpc3RlbmVyTWFzaygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gZGVhY3RpdmF0ZVxuICAgICAgICAgICAgYWN0aW9uTWFuYWdlciAmJiBhY3Rpb25NYW5hZ2VyLnBhdXNlVGFyZ2V0KHRoaXMpO1xuICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLnBhdXNlVGFyZ2V0KHRoaXMpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9vbkhpZXJhcmNoeUNoYW5nZWQgKG9sZFBhcmVudCkge1xuICAgICAgICB0aGlzLl91cGRhdGVPcmRlck9mQXJyaXZhbCgpO1xuICAgICAgICAvLyBGaXhlZCBhIGJ1ZyB3aGVyZSBjaGlsZHJlbiBhbmQgcGFyZW50IG5vZGUgZ3JvdXBzIHdlcmUgZm9yY2VkIHRvIHN5bmNocm9uaXplLCBpbnN0ZWFkIG9mIG9ubHkgc3luY2hyb25pemluZyBgX2N1bGxpbmdNYXNrYCB2YWx1ZVxuICAgICAgICBfdXBkYXRlQ3VsbGluZ01hc2sodGhpcyk7XG4gICAgICAgIGlmICh0aGlzLl9wYXJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudC5fZGVsYXlTb3J0KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcmVuZGVyRmxhZyB8PSBSZW5kZXJGbG93LkZMQUdfV09STERfVFJBTlNGT1JNO1xuICAgICAgICB0aGlzLl9vbkhpZXJhcmNoeUNoYW5nZWRCYXNlKG9sZFBhcmVudCk7XG4gICAgICAgIGlmIChjYy5fd2lkZ2V0TWFuYWdlcikge1xuICAgICAgICAgICAgY2MuX3dpZGdldE1hbmFnZXIuX25vZGVzT3JkZXJEaXJ0eSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob2xkUGFyZW50ICYmIHRoaXMuX2FjdGl2ZUluSGllcmFyY2h5KSB7XG4gICAgICAgICAgICAvL1RPRE86IEl0IG1heSBiZSBuZWNlc3NhcnkgdG8gdXBkYXRlIHRoZSBsaXN0ZW5lciBtYXNrIG9mIGFsbCBjaGlsZCBub2Rlcy5cbiAgICAgICAgICAgIHRoaXMuX2NoZWNrTGlzdGVuZXJNYXNrKCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIE5vZGUgcHJveHlcbiAgICAgICAgaWYgKENDX0pTQiAmJiBDQ19OQVRJVkVSRU5ERVJFUikge1xuICAgICAgICAgICAgdGhpcy5fcHJveHkudXBkYXRlUGFyZW50KCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gSU5URVJOQUxcblxuICAgIF91cGRhdGUzREZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2lzM0ROb2RlKSB7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVMb2NhbE1hdHJpeCA9IHVwZGF0ZUxvY2FsTWF0cml4M0Q7XG4gICAgICAgICAgICB0aGlzLl9jYWxjdWxXb3JsZE1hdHJpeCA9IGNhbGN1bFdvcmxkTWF0cml4M0Q7XG4gICAgICAgICAgICB0aGlzLl9tdWxNYXQgPSBtdWxNYXQzRDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUxvY2FsTWF0cml4ID0gdXBkYXRlTG9jYWxNYXRyaXgyRDtcbiAgICAgICAgICAgIHRoaXMuX2NhbGN1bFdvcmxkTWF0cml4ID0gY2FsY3VsV29ybGRNYXRyaXgyRDtcbiAgICAgICAgICAgIHRoaXMuX211bE1hdCA9IG11bE1hdDJEO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9yZW5kZXJDb21wb25lbnQgJiYgdGhpcy5fcmVuZGVyQ29tcG9uZW50Ll9vbjNETm9kZUNoYW5nZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlckNvbXBvbmVudC5fb24zRE5vZGVDaGFuZ2VkKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcmVuZGVyRmxhZyB8PSBSZW5kZXJGbG93LkZMQUdfVFJBTlNGT1JNO1xuICAgICAgICB0aGlzLl9sb2NhbE1hdERpcnR5ID0gTG9jYWxEaXJ0eUZsYWcuQUxMO1xuXG4gICAgICAgIGlmIChDQ19KU0IgJiYgQ0NfTkFUSVZFUkVOREVSRVIpIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb3h5LnVwZGF0ZTNETm9kZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9pbml0RGF0YUZyb21Qb29sICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9zcGFjZUluZm8pIHtcbiAgICAgICAgICAgIGlmIChDQ19FRElUT1IgfHwgQ0NfVEVTVCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NwYWNlSW5mbyA9IHtcbiAgICAgICAgICAgICAgICAgICAgdHJzOiBuZXcgRmxvYXQ2NEFycmF5KDEwKSxcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxNYXQ6IG5ldyBGbG9hdDY0QXJyYXkoMTYpLFxuICAgICAgICAgICAgICAgICAgICB3b3JsZE1hdDogbmV3IEZsb2F0NjRBcnJheSgxNiksXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zcGFjZUluZm8gPSBub2RlTWVtUG9vbC5wb3AoKTsgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzcGFjZUluZm8gPSB0aGlzLl9zcGFjZUluZm87XG4gICAgICAgIHRoaXMuX21hdHJpeCA9IGNjLm1hdDQoc3BhY2VJbmZvLmxvY2FsTWF0KTtcbiAgICAgICAgTWF0NC5pZGVudGl0eSh0aGlzLl9tYXRyaXgpO1xuICAgICAgICB0aGlzLl93b3JsZE1hdHJpeCA9IGNjLm1hdDQoc3BhY2VJbmZvLndvcmxkTWF0KTtcbiAgICAgICAgTWF0NC5pZGVudGl0eSh0aGlzLl93b3JsZE1hdHJpeCk7XG4gICAgICAgIHRoaXMuX2xvY2FsTWF0RGlydHkgPSBMb2NhbERpcnR5RmxhZy5BTEw7XG4gICAgICAgIHRoaXMuX3dvcmxkTWF0RGlydHkgPSB0cnVlO1xuXG4gICAgICAgIGxldCB0cnMgPSB0aGlzLl90cnMgPSB0aGlzLl9zcGFjZUluZm8udHJzO1xuICAgICAgICB0cnNbMF0gPSAwOyAvLyBwb3NpdGlvbi54XG4gICAgICAgIHRyc1sxXSA9IDA7IC8vIHBvc2l0aW9uLnlcbiAgICAgICAgdHJzWzJdID0gMDsgLy8gcG9zaXRpb24uelxuICAgICAgICB0cnNbM10gPSAwOyAvLyByb3RhdGlvbi54XG4gICAgICAgIHRyc1s0XSA9IDA7IC8vIHJvdGF0aW9uLnlcbiAgICAgICAgdHJzWzVdID0gMDsgLy8gcm90YXRpb24uelxuICAgICAgICB0cnNbNl0gPSAxOyAvLyByb3RhdGlvbi53XG4gICAgICAgIHRyc1s3XSA9IDE7IC8vIHNjYWxlLnhcbiAgICAgICAgdHJzWzhdID0gMTsgLy8gc2NhbGUueVxuICAgICAgICB0cnNbOV0gPSAxOyAvLyBzY2FsZS56XG4gICAgfSxcblxuICAgIF9iYWNrRGF0YUludG9Qb29sICgpIHtcbiAgICAgICAgaWYgKCEoQ0NfRURJVE9SIHx8IENDX1RFU1QpKSB7XG4gICAgICAgICAgICAvLyBwdXNoIGJhY2sgdG8gcG9vbFxuICAgICAgICAgICAgbm9kZU1lbVBvb2wucHVzaCh0aGlzLl9zcGFjZUluZm8pO1xuICAgICAgICAgICAgdGhpcy5fbWF0cml4ID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX3dvcmxkTWF0cml4ID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX3RycyA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLl9zcGFjZUluZm8gPSBudWxsO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF90b0V1bGVyICgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXMzRE5vZGUpIHtcbiAgICAgICAgICAgIFRycy50b0V1bGVyKHRoaXMuX2V1bGVyQW5nbGVzLCB0aGlzLl90cnMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IHogPSBNYXRoLmFzaW4odGhpcy5fdHJzWzVdKSAvIE9ORV9ERUdSRUUgKiAyO1xuICAgICAgICAgICAgVmVjMy5zZXQodGhpcy5fZXVsZXJBbmdsZXMsIDAsIDAsIHopO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9mcm9tRXVsZXIgKCkge1xuICAgICAgICBpZiAodGhpcy5pczNETm9kZSkge1xuICAgICAgICAgICAgVHJzLmZyb21FdWxlcih0aGlzLl90cnMsIHRoaXMuX2V1bGVyQW5nbGVzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIFRycy5mcm9tQW5nbGVaKHRoaXMuX3RycywgdGhpcy5fZXVsZXJBbmdsZXMueik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3VwZ3JhZGVfMXhfdG9fMnggKCkge1xuICAgICAgICBpZiAodGhpcy5faXMzRE5vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZTNERnVuY3Rpb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB0cnMgPSB0aGlzLl90cnM7XG4gICAgICAgIGlmICh0cnMpIHtcbiAgICAgICAgICAgIGxldCBkZXNUcnMgPSB0cnM7XG4gICAgICAgICAgICB0cnMgPSB0aGlzLl90cnMgPSB0aGlzLl9zcGFjZUluZm8udHJzO1xuICAgICAgICAgICAgLy8ganVzdCBhZGFwdCB0byBvbGQgdHJzXG4gICAgICAgICAgICBpZiAoZGVzVHJzLmxlbmd0aCA9PT0gMTEpIHtcbiAgICAgICAgICAgICAgICB0cnMuc2V0KGRlc1Rycy5zdWJhcnJheSgxKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRycy5zZXQoZGVzVHJzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRycyA9IHRoaXMuX3RycyA9IHRoaXMuX3NwYWNlSW5mby50cnM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fekluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvY2FsWk9yZGVyID0gdGhpcy5fekluZGV4IDw8IDE2O1xuICAgICAgICAgICAgdGhpcy5fekluZGV4ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3NrZXdYICE9PSAwIHx8IHRoaXMuX3NrZXdZICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIE5vZGVVdGlscyA9IEVkaXRvci5yZXF1aXJlKCdzY2VuZTovL3V0aWxzL25vZGUnKTtcbiAgICAgICAgICAgICAgICBjYy53YXJuKFwiYGNjLk5vZGUuc2tld1gvWWAgaXMgZGVwcmVjYXRlZCBzaW5jZSB2Mi4yLjEsIHBsZWFzZSB1c2UgM0Qgbm9kZSBpbnN0ZWFkLlwiLCBgTm9kZTogJHtOb2RlVXRpbHMuZ2V0Tm9kZVBhdGgodGhpcyl9LmApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZnJvbUV1bGVyKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuX2xvY2FsWk9yZGVyICE9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl96SW5kZXggPSAodGhpcy5fbG9jYWxaT3JkZXIgJiAweGZmZmYwMDAwKSA+PiAxNjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFVwZ3JhZGUgZnJvbSAyLjAuMCBwcmV2aWV3IDQgJiBlYXJsaWVyIHZlcnNpb25zXG4gICAgICAgIC8vIFRPRE86IFJlbW92ZSBhZnRlciBmaW5hbCB2ZXJzaW9uXG4gICAgICAgIGlmICh0aGlzLl9jb2xvci5hIDwgMjU1ICYmIHRoaXMuX29wYWNpdHkgPT09IDI1NSkge1xuICAgICAgICAgICAgdGhpcy5fb3BhY2l0eSA9IHRoaXMuX2NvbG9yLmE7XG4gICAgICAgICAgICB0aGlzLl9jb2xvci5hID0gMjU1O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKENDX0pTQiAmJiBDQ19OQVRJVkVSRU5ERVJFUikge1xuICAgICAgICAgICAgdGhpcy5fcmVuZGVyRmxhZyB8PSBSZW5kZXJGbG93LkZMQUdfVFJBTlNGT1JNIHwgUmVuZGVyRmxvdy5GTEFHX09QQUNJVFlfQ09MT1I7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBUaGUgaW5pdGlhbGl6ZXIgZm9yIE5vZGUgd2hpY2ggd2lsbCBiZSBjYWxsZWQgYmVmb3JlIGFsbCBjb21wb25lbnRzIG9uTG9hZFxuICAgICAqL1xuICAgIF9vbkJhdGNoQ3JlYXRlZCAoKSB7XG4gICAgICAgIGxldCBwcmVmYWJJbmZvID0gdGhpcy5fcHJlZmFiO1xuICAgICAgICBpZiAocHJlZmFiSW5mbyAmJiBwcmVmYWJJbmZvLnN5bmMgJiYgcHJlZmFiSW5mby5yb290ID09PSB0aGlzKSB7XG4gICAgICAgICAgICBpZiAoQ0NfREVWKSB7XG4gICAgICAgICAgICAgICAgLy8gVE9ETyAtIHJlbW92ZSBhbGwgdXNhZ2Ugb2YgX3N5bmNlZFxuICAgICAgICAgICAgICAgIGNjLmFzc2VydCghcHJlZmFiSW5mby5fc3luY2VkLCAncHJlZmFiIHNob3VsZCBub3Qgc3luY2VkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBQcmVmYWJIZWxwZXIuc3luY1dpdGhQcmVmYWIodGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl91cGdyYWRlXzF4X3RvXzJ4KCk7XG5cbiAgICAgICAgdGhpcy5fdXBkYXRlT3JkZXJPZkFycml2YWwoKTtcblxuICAgICAgICAvLyBGaXhlZCBhIGJ1ZyB3aGVyZSBjaGlsZHJlbiBhbmQgcGFyZW50IG5vZGUgZ3JvdXBzIHdlcmUgZm9yY2VkIHRvIHN5bmNocm9uaXplLCBpbnN0ZWFkIG9mIG9ubHkgc3luY2hyb25pemluZyBgX2N1bGxpbmdNYXNrYCB2YWx1ZVxuICAgICAgICB0aGlzLl9jdWxsaW5nTWFzayA9IDEgPDwgX2dldEFjdHVhbEdyb3VwSW5kZXgodGhpcyk7XG4gICAgICAgIGlmIChDQ19KU0IgJiYgQ0NfTkFUSVZFUkVOREVSRVIpIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb3h5ICYmIHRoaXMuX3Byb3h5LnVwZGF0ZUN1bGxpbmdNYXNrKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCF0aGlzLl9hY3RpdmVJbkhpZXJhcmNoeSkge1xuICAgICAgICAgICAgLy8gZGVhY3RpdmF0ZSBBY3Rpb25NYW5hZ2VyIGFuZCBFdmVudE1hbmFnZXIgYnkgZGVmYXVsdFxuICAgICAgICAgICAgaWYgKEFjdGlvbk1hbmFnZXJFeGlzdCkge1xuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmdldEFjdGlvbk1hbmFnZXIoKS5wYXVzZVRhcmdldCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGV2ZW50TWFuYWdlci5wYXVzZVRhcmdldCh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGNoaWxkcmVuW2ldLl9vbkJhdGNoQ3JlYXRlZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlckZsYWcgfD0gUmVuZGVyRmxvdy5GTEFHX0NISUxEUkVOO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKENDX0pTQiAmJiBDQ19OQVRJVkVSRU5ERVJFUikge1xuICAgICAgICAgICAgdGhpcy5fcHJveHkuaW5pdE5hdGl2ZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHRoZSBzYW1lIGFzIF9vbkJhdGNoQ3JlYXRlZCBidXQgdW50b3VjaCBwcmVmYWJcbiAgICBfb25CYXRjaFJlc3RvcmVkICgpIHtcbiAgICAgICAgdGhpcy5fdXBncmFkZV8xeF90b18yeCgpO1xuXG4gICAgICAgIC8vIEZpeGVkIGEgYnVnIHdoZXJlIGNoaWxkcmVuIGFuZCBwYXJlbnQgbm9kZSBncm91cHMgd2VyZSBmb3JjZWQgdG8gc3luY2hyb25pemUsIGluc3RlYWQgb2Ygb25seSBzeW5jaHJvbml6aW5nIGBfY3VsbGluZ01hc2tgIHZhbHVlXG4gICAgICAgIHRoaXMuX2N1bGxpbmdNYXNrID0gMSA8PCBfZ2V0QWN0dWFsR3JvdXBJbmRleCh0aGlzKTtcbiAgICAgICAgaWYgKENDX0pTQiAmJiBDQ19OQVRJVkVSRU5ERVJFUikge1xuICAgICAgICAgICAgdGhpcy5fcHJveHkgJiYgdGhpcy5fcHJveHkudXBkYXRlQ3VsbGluZ01hc2soKTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoIXRoaXMuX2FjdGl2ZUluSGllcmFyY2h5KSB7XG4gICAgICAgICAgICAvLyBkZWFjdGl2YXRlIEFjdGlvbk1hbmFnZXIgYW5kIEV2ZW50TWFuYWdlciBieSBkZWZhdWx0XG5cbiAgICAgICAgICAgIC8vIEFjdGlvbk1hbmFnZXIgbWF5IG5vdCBiZSBpbml0ZWQgaW4gdGhlIGVkaXRvciB3b3JrZXIuXG4gICAgICAgICAgICBsZXQgbWFuYWdlciA9IGNjLmRpcmVjdG9yLmdldEFjdGlvbk1hbmFnZXIoKTtcbiAgICAgICAgICAgIG1hbmFnZXIgJiYgbWFuYWdlci5wYXVzZVRhcmdldCh0aGlzKTtcblxuICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLnBhdXNlVGFyZ2V0KHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW47XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgY2hpbGRyZW5baV0uX29uQmF0Y2hSZXN0b3JlZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlckZsYWcgfD0gUmVuZGVyRmxvdy5GTEFHX0NISUxEUkVOO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKENDX0pTQiAmJiBDQ19OQVRJVkVSRU5ERVJFUikge1xuICAgICAgICAgICAgdGhpcy5fcHJveHkuaW5pdE5hdGl2ZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIEVWRU5UIFRBUkdFVFxuICAgIF9jaGVja0xpc3RlbmVyTWFzayAoKSB7XG4gICAgICAgIC8vIEJlY2F1c2UgTWFzayBtYXkgYmUgbmVzdGVkLCBuZWVkIHRvIGZpbmQgYWxsIHRoZSBNYXNrIGNvbXBvbmVudHMgaW4gdGhlIHBhcmVudCBub2RlLiBcbiAgICAgICAgLy8gVGhlIGNsaWNrIGFyZWEgbXVzdCBzYXRpc2Z5IGFsbCBNYXNrcyB0byB0cmlnZ2VyIHRoZSBjbGljay5cbiAgICAgICAgaWYgKHRoaXMuX3RvdWNoTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHZhciBtYXNrID0gdGhpcy5fdG91Y2hMaXN0ZW5lci5tYXNrID0gX3NlYXJjaENvbXBvbmVudHNJblBhcmVudCh0aGlzLCBjYy5NYXNrKTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9tb3VzZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbW91c2VMaXN0ZW5lci5tYXNrID0gbWFzaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9tb3VzZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLl9tb3VzZUxpc3RlbmVyLm1hc2sgPSBfc2VhcmNoQ29tcG9uZW50c0luUGFyZW50KHRoaXMsIGNjLk1hc2spO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9jaGVja25TZXR1cFN5c0V2ZW50ICh0eXBlKSB7XG4gICAgICAgIGxldCBuZXdBZGRlZCA9IGZhbHNlO1xuICAgICAgICBsZXQgZm9yRGlzcGF0Y2ggPSBmYWxzZTtcbiAgICAgICAgaWYgKF90b3VjaEV2ZW50cy5pbmRleE9mKHR5cGUpICE9PSAtMSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl90b3VjaExpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdG91Y2hMaXN0ZW5lciA9IGNjLkV2ZW50TGlzdGVuZXIuY3JlYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQ6IGNjLkV2ZW50TGlzdGVuZXIuVE9VQ0hfT05FX0JZX09ORSxcbiAgICAgICAgICAgICAgICAgICAgc3dhbGxvd1RvdWNoZXM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiB0aGlzLFxuICAgICAgICAgICAgICAgICAgICBtYXNrOiBfc2VhcmNoQ29tcG9uZW50c0luUGFyZW50KHRoaXMsIGNjLk1hc2spLFxuICAgICAgICAgICAgICAgICAgICBvblRvdWNoQmVnYW46IF90b3VjaFN0YXJ0SGFuZGxlcixcbiAgICAgICAgICAgICAgICAgICAgb25Ub3VjaE1vdmVkOiBfdG91Y2hNb3ZlSGFuZGxlcixcbiAgICAgICAgICAgICAgICAgICAgb25Ub3VjaEVuZGVkOiBfdG91Y2hFbmRIYW5kbGVyLFxuICAgICAgICAgICAgICAgICAgICBvblRvdWNoQ2FuY2VsbGVkOiBfdG91Y2hDYW5jZWxIYW5kbGVyXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKHRoaXMuX3RvdWNoTGlzdGVuZXIsIHRoaXMpO1xuICAgICAgICAgICAgICAgIG5ld0FkZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvckRpc3BhdGNoID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChfbW91c2VFdmVudHMuaW5kZXhPZih0eXBlKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fbW91c2VMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIHRoaXMuX21vdXNlTGlzdGVuZXIgPSBjYy5FdmVudExpc3RlbmVyLmNyZWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50OiBjYy5FdmVudExpc3RlbmVyLk1PVVNFLFxuICAgICAgICAgICAgICAgICAgICBfcHJldmlvdXNJbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiB0aGlzLFxuICAgICAgICAgICAgICAgICAgICBtYXNrOiBfc2VhcmNoQ29tcG9uZW50c0luUGFyZW50KHRoaXMsIGNjLk1hc2spLFxuICAgICAgICAgICAgICAgICAgICBvbk1vdXNlRG93bjogX21vdXNlRG93bkhhbmRsZXIsXG4gICAgICAgICAgICAgICAgICAgIG9uTW91c2VNb3ZlOiBfbW91c2VNb3ZlSGFuZGxlcixcbiAgICAgICAgICAgICAgICAgICAgb25Nb3VzZVVwOiBfbW91c2VVcEhhbmRsZXIsXG4gICAgICAgICAgICAgICAgICAgIG9uTW91c2VTY3JvbGw6IF9tb3VzZVdoZWVsSGFuZGxlcixcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIodGhpcy5fbW91c2VMaXN0ZW5lciwgdGhpcyk7XG4gICAgICAgICAgICAgICAgbmV3QWRkZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yRGlzcGF0Y2ggPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuZXdBZGRlZCAmJiAhdGhpcy5fYWN0aXZlSW5IaWVyYXJjaHkpIHtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmdldFNjaGVkdWxlcigpLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2FjdGl2ZUluSGllcmFyY2h5KSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50TWFuYWdlci5wYXVzZVRhcmdldCh0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzLCAwLCAwLCAwLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZvckRpc3BhdGNoO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmVnaXN0ZXIgYSBjYWxsYmFjayBvZiBhIHNwZWNpZmljIGV2ZW50IHR5cGUgb24gTm9kZS48YnIvPlxuICAgICAqIFVzZSB0aGlzIG1ldGhvZCB0byByZWdpc3RlciB0b3VjaCBvciBtb3VzZSBldmVudCBwZXJtaXQgcHJvcGFnYXRpb24gYmFzZWQgb24gc2NlbmUgZ3JhcGgsPGJyLz5cbiAgICAgKiBUaGVzZSBraW5kcyBvZiBldmVudCBhcmUgdHJpZ2dlcmVkIHdpdGggZGlzcGF0Y2hFdmVudCwgdGhlIGRpc3BhdGNoIHByb2Nlc3MgaGFzIHRocmVlIHN0ZXBzOjxici8+XG4gICAgICogMS4gQ2FwdHVyaW5nIHBoYXNlOiBkaXNwYXRjaCBpbiBjYXB0dXJlIHRhcmdldHMgKGBfZ2V0Q2FwdHVyaW5nVGFyZ2V0c2ApLCBlLmcuIHBhcmVudHMgaW4gbm9kZSB0cmVlLCBmcm9tIHJvb3QgdG8gdGhlIHJlYWwgdGFyZ2V0PGJyLz5cbiAgICAgKiAyLiBBdCB0YXJnZXQgcGhhc2U6IGRpc3BhdGNoIHRvIHRoZSBsaXN0ZW5lcnMgb2YgdGhlIHJlYWwgdGFyZ2V0PGJyLz5cbiAgICAgKiAzLiBCdWJibGluZyBwaGFzZTogZGlzcGF0Y2ggaW4gYnViYmxlIHRhcmdldHMgKGBfZ2V0QnViYmxpbmdUYXJnZXRzYCksIGUuZy4gcGFyZW50cyBpbiBub2RlIHRyZWUsIGZyb20gdGhlIHJlYWwgdGFyZ2V0IHRvIHJvb3Q8YnIvPlxuICAgICAqIEluIGFueSBtb21lbnQgb2YgdGhlIGRpc3BhdGNoaW5nIHByb2Nlc3MsIGl0IGNhbiBiZSBzdG9wcGVkIHZpYSBgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClgIG9yIGBldmVudC5zdG9wUHJvcGFnYXRpb25JbW1pZGlhdGUoKWAuPGJyLz5cbiAgICAgKiBJdCdzIHRoZSByZWNvbW1lbmRlZCB3YXkgdG8gcmVnaXN0ZXIgdG91Y2gvbW91c2UgZXZlbnQgZm9yIE5vZGUsPGJyLz5cbiAgICAgKiBwbGVhc2UgZG8gbm90IHVzZSBjYy5ldmVudE1hbmFnZXIgZGlyZWN0bHkgZm9yIE5vZGUuPGJyLz5cbiAgICAgKiBZb3UgY2FuIGFsc28gcmVnaXN0ZXIgY3VzdG9tIGV2ZW50IGFuZCB1c2UgYGVtaXRgIHRvIHRyaWdnZXIgY3VzdG9tIGV2ZW50IG9uIE5vZGUuPGJyLz5cbiAgICAgKiBGb3Igc3VjaCBldmVudHMsIHRoZXJlIHdvbid0IGJlIGNhcHR1cmluZyBhbmQgYnViYmxpbmcgcGhhc2UsIHlvdXIgZXZlbnQgd2lsbCBiZSBkaXNwYXRjaGVkIGRpcmVjdGx5IHRvIGl0cyBsaXN0ZW5lcnMgcmVnaXN0ZXJlZCBvbiB0aGUgc2FtZSBub2RlLjxici8+XG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgZXZlbnQgY2FsbGJhY2sgcGFyYW1ldGVycyB3aXRoIGBlbWl0YCBieSBwYXNzaW5nIHBhcmFtZXRlcnMgYWZ0ZXIgYHR5cGVgLlxuICAgICAqICEjemhcbiAgICAgKiDlnKjoioLngrnkuIrms6jlhozmjIflrprnsbvlnovnmoTlm57osIPlh73mlbDvvIzkuZ/lj6/ku6Xorr7nva4gdGFyZ2V0IOeUqOS6jue7keWumuWTjeW6lOWHveaVsOeahCB0aGlzIOWvueixoeOAgjxici8+XG4gICAgICog6byg5qCH5oiW6Kem5pG45LqL5Lu25Lya6KKr57O757uf6LCD55SoIGRpc3BhdGNoRXZlbnQg5pa55rOV6Kem5Y+R77yM6Kem5Y+R55qE6L+H56iL5YyF5ZCr5LiJ5Liq6Zi25q6177yaPGJyLz5cbiAgICAgKiAxLiDmjZXojrfpmLbmrrXvvJrmtL7lj5Hkuovku7bnu5nmjZXojrfnm67moIfvvIjpgJrov4cgYF9nZXRDYXB0dXJpbmdUYXJnZXRzYCDojrflj5bvvInvvIzmr5TlpoLvvIzoioLngrnmoJHkuK3ms6jlhozkuobmjZXojrfpmLbmrrXnmoTniLboioLngrnvvIzku47moLnoioLngrnlvIDlp4vmtL7lj5Hnm7TliLDnm67moIfoioLngrnjgII8YnIvPlxuICAgICAqIDIuIOebruagh+mYtuaute+8mua0vuWPkee7meebruagh+iKgueCueeahOebkeWQrOWZqOOAgjxici8+XG4gICAgICogMy4g5YaS5rOh6Zi25q6177ya5rS+5Y+R5LqL5Lu257uZ5YaS5rOh55uu5qCH77yI6YCa6L+HIGBfZ2V0QnViYmxpbmdUYXJnZXRzYCDojrflj5bvvInvvIzmr5TlpoLvvIzoioLngrnmoJHkuK3ms6jlhozkuoblhpLms6HpmLbmrrXnmoTniLboioLngrnvvIzku47nm67moIfoioLngrnlvIDlp4vmtL7lj5Hnm7TliLDmoLnoioLngrnjgII8YnIvPlxuICAgICAqIOWQjOaXtuaCqOWPr+S7peWwhuS6i+S7tua0vuWPkeWIsOeItuiKgueCueaIluiAhemAmui/h+iwg+eUqCBzdG9wUHJvcGFnYXRpb24g5oum5oiq5a6D44CCPGJyLz5cbiAgICAgKiDmjqjojZDkvb/nlKjov5nnp43mlrnlvI/mnaXnm5HlkKzoioLngrnkuIrnmoTop6bmkbjmiJbpvKDmoIfkuovku7bvvIzor7fkuI3opoHlnKjoioLngrnkuIrnm7TmjqXkvb/nlKggY2MuZXZlbnRNYW5hZ2Vy44CCPGJyLz5cbiAgICAgKiDkvaDkuZ/lj6/ku6Xms6jlhozoh6rlrprkuYnkuovku7bliLDoioLngrnkuIrvvIzlubbpgJrov4cgZW1pdCDmlrnms5Xop6blj5HmraTnsbvkuovku7bvvIzlr7nkuo7ov5nnsbvkuovku7bvvIzkuI3kvJrlj5HnlJ/mjZXojrflhpLms6HpmLbmrrXvvIzlj6rkvJrnm7TmjqXmtL7lj5Hnu5nms6jlhozlnKjor6XoioLngrnkuIrnmoTnm5HlkKzlmag8YnIvPlxuICAgICAqIOS9oOWPr+S7pemAmui/h+WcqCBlbWl0IOaWueazleiwg+eUqOaXtuWcqCB0eXBlIOS5i+WQjuS8oOmAkumineWklueahOWPguaVsOS9nOS4uuS6i+S7tuWbnuiwg+eahOWPguaVsOWIl+ihqFxuICAgICAqIEBtZXRob2Qgb25cbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xOb2RlLkV2ZW50VHlwZX0gdHlwZSAtIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgZXZlbnQgdHlwZSB0byBsaXN0ZW4gZm9yLjxicj5TZWUge3sjY3Jvc3NMaW5rIFwiTm9kZS9FdmVudFR5dXBlL1BPU0lUSU9OX0NIQU5HRURcIn19Tm9kZSBFdmVudHN7ey9jcm9zc0xpbmt9fSBmb3IgYWxsIGJ1aWx0aW4gZXZlbnRzLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRoYXQgd2lsbCBiZSBpbnZva2VkIHdoZW4gdGhlIGV2ZW50IGlzIGRpc3BhdGNoZWQuIFRoZSBjYWxsYmFjayBpcyBpZ25vcmVkIGlmIGl0IGlzIGEgZHVwbGljYXRlICh0aGUgY2FsbGJhY2tzIGFyZSB1bmlxdWUpLlxuICAgICAqIEBwYXJhbSB7RXZlbnR8YW55fSBbY2FsbGJhY2suZXZlbnRdIGV2ZW50IG9yIGZpcnN0IGFyZ3VtZW50IHdoZW4gZW1pdFxuICAgICAqIEBwYXJhbSB7YW55fSBbY2FsbGJhY2suYXJnMl0gYXJnMlxuICAgICAqIEBwYXJhbSB7YW55fSBbY2FsbGJhY2suYXJnM10gYXJnM1xuICAgICAqIEBwYXJhbSB7YW55fSBbY2FsbGJhY2suYXJnNF0gYXJnNFxuICAgICAqIEBwYXJhbSB7YW55fSBbY2FsbGJhY2suYXJnNV0gYXJnNVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbdGFyZ2V0XSAtIFRoZSB0YXJnZXQgKHRoaXMgb2JqZWN0KSB0byBpbnZva2UgdGhlIGNhbGxiYWNrLCBjYW4gYmUgbnVsbFxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3VzZUNhcHR1cmU9ZmFsc2VdIC0gV2hlbiBzZXQgdG8gdHJ1ZSwgdGhlIGxpc3RlbmVyIHdpbGwgYmUgdHJpZ2dlcmVkIGF0IGNhcHR1cmluZyBwaGFzZSB3aGljaCBpcyBhaGVhZCBvZiB0aGUgZmluYWwgdGFyZ2V0IGVtaXQsIG90aGVyd2lzZSBpdCB3aWxsIGJlIHRyaWdnZXJlZCBkdXJpbmcgYnViYmxpbmcgcGhhc2UuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IC0gSnVzdCByZXR1cm5zIHRoZSBpbmNvbWluZyBjYWxsYmFjayBzbyB5b3UgY2FuIHNhdmUgdGhlIGFub255bW91cyBmdW5jdGlvbiBlYXNpZXIuXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBvbjxUIGV4dGVuZHMgRnVuY3Rpb24+KHR5cGU6IHN0cmluZywgY2FsbGJhY2s6IFQsIHRhcmdldD86IGFueSwgdXNlQ2FwdHVyZT86IGJvb2xlYW4pOiBUXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMubWVtYmVyRnVuY3Rpb24sIHRoaXMpOyAgLy8gaWYgXCJ0aGlzXCIgaXMgY29tcG9uZW50IGFuZCB0aGUgXCJtZW1iZXJGdW5jdGlvblwiIGRlY2xhcmVkIGluIENDQ2xhc3MuXG4gICAgICogbm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgY2FsbGJhY2ssIHRoaXMpO1xuICAgICAqIG5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgY2FsbGJhY2ssIHRoaXMpO1xuICAgICAqIG5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCBjYWxsYmFjaywgdGhpcyk7XG4gICAgICogbm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9DQU5DRUwsIGNhbGxiYWNrLCB0aGlzKTtcbiAgICAgKiBub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLkFOQ0hPUl9DSEFOR0VELCBjYWxsYmFjayk7XG4gICAgICogbm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5DT0xPUl9DSEFOR0VELCBjYWxsYmFjayk7XG4gICAgICovXG4gICAgb24gKHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQsIHVzZUNhcHR1cmUpIHtcbiAgICAgICAgbGV0IGZvckRpc3BhdGNoID0gdGhpcy5fY2hlY2tuU2V0dXBTeXNFdmVudCh0eXBlKTtcbiAgICAgICAgaWYgKGZvckRpc3BhdGNoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25EaXNwYXRjaCh0eXBlLCBjYWxsYmFjaywgdGFyZ2V0LCB1c2VDYXB0dXJlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgRXZlbnRUeXBlLlBPU0lUSU9OX0NIQU5HRUQ6XG4gICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRNYXNrIHw9IFBPU0lUSU9OX09OO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgRXZlbnRUeXBlLlNDQUxFX0NIQU5HRUQ6XG4gICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRNYXNrIHw9IFNDQUxFX09OO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgRXZlbnRUeXBlLlJPVEFUSU9OX0NIQU5HRUQ6XG4gICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRNYXNrIHw9IFJPVEFUSU9OX09OO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRDpcbiAgICAgICAgICAgICAgICB0aGlzLl9ldmVudE1hc2sgfD0gU0laRV9PTjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEV2ZW50VHlwZS5BTkNIT1JfQ0hBTkdFRDpcbiAgICAgICAgICAgICAgICB0aGlzLl9ldmVudE1hc2sgfD0gQU5DSE9SX09OO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgRXZlbnRUeXBlLkNPTE9SX0NIQU5HRUQ6XG4gICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRNYXNrIHw9IENPTE9SX09OO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0aGlzLl9idWJibGluZ0xpc3RlbmVycykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2J1YmJsaW5nTGlzdGVuZXJzID0gbmV3IEV2ZW50VGFyZ2V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYnViYmxpbmdMaXN0ZW5lcnMub24odHlwZSwgY2FsbGJhY2ssIHRhcmdldCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJlZ2lzdGVyIGFuIGNhbGxiYWNrIG9mIGEgc3BlY2lmaWMgZXZlbnQgdHlwZSBvbiB0aGUgTm9kZSxcbiAgICAgKiB0aGUgY2FsbGJhY2sgd2lsbCByZW1vdmUgaXRzZWxmIGFmdGVyIHRoZSBmaXJzdCB0aW1lIGl0IGlzIHRyaWdnZXJlZC5cbiAgICAgKiAhI3poXG4gICAgICog5rOo5YaM6IqC54K555qE54m55a6a5LqL5Lu257G75Z6L5Zue6LCD77yM5Zue6LCD5Lya5Zyo56ys5LiA5pe26Ze06KKr6Kem5Y+R5ZCO5Yig6Zmk6Ieq6Lqr44CCXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIG9uY2VcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgZXZlbnQgdHlwZSB0byBsaXN0ZW4gZm9yLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRoYXQgd2lsbCBiZSBpbnZva2VkIHdoZW4gdGhlIGV2ZW50IGlzIGRpc3BhdGNoZWQuXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgY2FsbGJhY2sgaXMgaWdub3JlZCBpZiBpdCBpcyBhIGR1cGxpY2F0ZSAodGhlIGNhbGxiYWNrcyBhcmUgdW5pcXVlKS5cbiAgICAgKiBAcGFyYW0ge0V2ZW50fGFueX0gW2NhbGxiYWNrLmV2ZW50XSBldmVudCBvciBmaXJzdCBhcmd1bWVudCB3aGVuIGVtaXRcbiAgICAgKiBAcGFyYW0ge2FueX0gW2NhbGxiYWNrLmFyZzJdIGFyZzJcbiAgICAgKiBAcGFyYW0ge2FueX0gW2NhbGxiYWNrLmFyZzNdIGFyZzNcbiAgICAgKiBAcGFyYW0ge2FueX0gW2NhbGxiYWNrLmFyZzRdIGFyZzRcbiAgICAgKiBAcGFyYW0ge2FueX0gW2NhbGxiYWNrLmFyZzVdIGFyZzVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW3RhcmdldF0gLSBUaGUgdGFyZ2V0ICh0aGlzIG9iamVjdCkgdG8gaW52b2tlIHRoZSBjYWxsYmFjaywgY2FuIGJlIG51bGxcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIG9uY2U8VCBleHRlbmRzIEZ1bmN0aW9uPih0eXBlOiBzdHJpbmcsIGNhbGxiYWNrOiBULCB0YXJnZXQ/OiBhbnksIHVzZUNhcHR1cmU/OiBib29sZWFuKTogVFxuICAgICAqIEBleGFtcGxlXG4gICAgICogbm9kZS5vbmNlKGNjLk5vZGUuRXZlbnRUeXBlLkFOQ0hPUl9DSEFOR0VELCBjYWxsYmFjayk7XG4gICAgICovXG4gICAgb25jZSAodHlwZSwgY2FsbGJhY2ssIHRhcmdldCwgdXNlQ2FwdHVyZSkge1xuICAgICAgICBsZXQgZm9yRGlzcGF0Y2ggPSB0aGlzLl9jaGVja25TZXR1cFN5c0V2ZW50KHR5cGUpO1xuXG4gICAgICAgIGxldCBsaXN0ZW5lcnMgPSBudWxsO1xuICAgICAgICBpZiAoZm9yRGlzcGF0Y2ggJiYgdXNlQ2FwdHVyZSkge1xuICAgICAgICAgICAgbGlzdGVuZXJzID0gdGhpcy5fY2FwdHVyaW5nTGlzdGVuZXJzID0gdGhpcy5fY2FwdHVyaW5nTGlzdGVuZXJzIHx8IG5ldyBFdmVudFRhcmdldCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGlzdGVuZXJzID0gdGhpcy5fYnViYmxpbmdMaXN0ZW5lcnMgPSB0aGlzLl9idWJibGluZ0xpc3RlbmVycyB8fCBuZXcgRXZlbnRUYXJnZXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxpc3RlbmVycy5vbmNlKHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQpO1xuICAgIH0sXG5cbiAgICBfb25EaXNwYXRjaCAodHlwZSwgY2FsbGJhY2ssIHRhcmdldCwgdXNlQ2FwdHVyZSkge1xuICAgICAgICAvLyBBY2NlcHQgYWxzbyBwYXRhbWV0ZXJzIGxpa2U6ICh0eXBlLCBjYWxsYmFjaywgdXNlQ2FwdHVyZSlcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgdXNlQ2FwdHVyZSA9IHRhcmdldDtcbiAgICAgICAgICAgIHRhcmdldCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHVzZUNhcHR1cmUgPSAhIXVzZUNhcHR1cmU7XG4gICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNjLmVycm9ySUQoNjgwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbGlzdGVuZXJzID0gbnVsbDtcbiAgICAgICAgaWYgKHVzZUNhcHR1cmUpIHtcbiAgICAgICAgICAgIGxpc3RlbmVycyA9IHRoaXMuX2NhcHR1cmluZ0xpc3RlbmVycyA9IHRoaXMuX2NhcHR1cmluZ0xpc3RlbmVycyB8fCBuZXcgRXZlbnRUYXJnZXQoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxpc3RlbmVycyA9IHRoaXMuX2J1YmJsaW5nTGlzdGVuZXJzID0gdGhpcy5fYnViYmxpbmdMaXN0ZW5lcnMgfHwgbmV3IEV2ZW50VGFyZ2V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoICFsaXN0ZW5lcnMuaGFzRXZlbnRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjaywgdGFyZ2V0KSApIHtcbiAgICAgICAgICAgIGxpc3RlbmVycy5vbih0eXBlLCBjYWxsYmFjaywgdGFyZ2V0KTtcblxuICAgICAgICAgICAgaWYgKHRhcmdldCAmJiB0YXJnZXQuX19ldmVudFRhcmdldHMpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQuX19ldmVudFRhcmdldHMucHVzaCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjYWxsYmFjaztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJlbW92ZXMgdGhlIGNhbGxiYWNrIHByZXZpb3VzbHkgcmVnaXN0ZXJlZCB3aXRoIHRoZSBzYW1lIHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQgYW5kIG9yIHVzZUNhcHR1cmUuXG4gICAgICogVGhpcyBtZXRob2QgaXMgbWVyZWx5IGFuIGFsaWFzIHRvIHJlbW92ZUV2ZW50TGlzdGVuZXIuXG4gICAgICogISN6aCDliKDpmaTkuYvliY3kuI7lkIznsbvlnovvvIzlm57osIPvvIznm67moIfmiJYgdXNlQ2FwdHVyZSDms6jlhoznmoTlm57osIPjgIJcbiAgICAgKiBAbWV0aG9kIG9mZlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBldmVudCB0eXBlIGJlaW5nIHJlbW92ZWQuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXSAtIFRoZSBjYWxsYmFjayB0byByZW1vdmUuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFt0YXJnZXRdIC0gVGhlIHRhcmdldCAodGhpcyBvYmplY3QpIHRvIGludm9rZSB0aGUgY2FsbGJhY2ssIGlmIGl0J3Mgbm90IGdpdmVuLCBvbmx5IGNhbGxiYWNrIHdpdGhvdXQgdGFyZ2V0IHdpbGwgYmUgcmVtb3ZlZFxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3VzZUNhcHR1cmU9ZmFsc2VdIC0gV2hlbiBzZXQgdG8gdHJ1ZSwgdGhlIGxpc3RlbmVyIHdpbGwgYmUgdHJpZ2dlcmVkIGF0IGNhcHR1cmluZyBwaGFzZSB3aGljaCBpcyBhaGVhZCBvZiB0aGUgZmluYWwgdGFyZ2V0IGVtaXQsIG90aGVyd2lzZSBpdCB3aWxsIGJlIHRyaWdnZXJlZCBkdXJpbmcgYnViYmxpbmcgcGhhc2UuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLm1lbWJlckZ1bmN0aW9uLCB0aGlzKTtcbiAgICAgKiBub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgY2FsbGJhY2ssIHRoaXMubm9kZSk7XG4gICAgICogbm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuQU5DSE9SX0NIQU5HRUQsIGNhbGxiYWNrLCB0aGlzKTtcbiAgICAgKi9cbiAgICBvZmYgKHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQsIHVzZUNhcHR1cmUpIHtcbiAgICAgICAgbGV0IHRvdWNoRXZlbnQgPSBfdG91Y2hFdmVudHMuaW5kZXhPZih0eXBlKSAhPT0gLTE7XG4gICAgICAgIGxldCBtb3VzZUV2ZW50ID0gIXRvdWNoRXZlbnQgJiYgX21vdXNlRXZlbnRzLmluZGV4T2YodHlwZSkgIT09IC0xO1xuICAgICAgICBpZiAodG91Y2hFdmVudCB8fCBtb3VzZUV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9vZmZEaXNwYXRjaCh0eXBlLCBjYWxsYmFjaywgdGFyZ2V0LCB1c2VDYXB0dXJlKTtcblxuICAgICAgICAgICAgaWYgKHRvdWNoRXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdG91Y2hMaXN0ZW5lciAmJiAhX2NoZWNrTGlzdGVuZXJzKHRoaXMsIF90b3VjaEV2ZW50cykpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLnJlbW92ZUxpc3RlbmVyKHRoaXMuX3RvdWNoTGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl90b3VjaExpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChtb3VzZUV2ZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX21vdXNlTGlzdGVuZXIgJiYgIV9jaGVja0xpc3RlbmVycyh0aGlzLCBfbW91c2VFdmVudHMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50TWFuYWdlci5yZW1vdmVMaXN0ZW5lcih0aGlzLl9tb3VzZUxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbW91c2VMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX2J1YmJsaW5nTGlzdGVuZXJzKSB7XG4gICAgICAgICAgICB0aGlzLl9idWJibGluZ0xpc3RlbmVycy5vZmYodHlwZSwgY2FsbGJhY2ssIHRhcmdldCk7XG5cbiAgICAgICAgICAgIHZhciBoYXNMaXN0ZW5lcnMgPSB0aGlzLl9idWJibGluZ0xpc3RlbmVycy5oYXNFdmVudExpc3RlbmVyKHR5cGUpO1xuICAgICAgICAgICAgLy8gQWxsIGxpc3RlbmVyIHJlbW92ZWRcbiAgICAgICAgICAgIGlmICghaGFzTGlzdGVuZXJzKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgRXZlbnRUeXBlLlBPU0lUSU9OX0NIQU5HRUQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50TWFzayAmPSB+UE9TSVRJT05fT047XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIEV2ZW50VHlwZS5TQ0FMRV9DSEFOR0VEOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudE1hc2sgJj0gflNDQUxFX09OO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBFdmVudFR5cGUuUk9UQVRJT05fQ0hBTkdFRDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRNYXNrICY9IH5ST1RBVElPTl9PTjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRNYXNrICY9IH5TSVpFX09OO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBFdmVudFR5cGUuQU5DSE9SX0NIQU5HRUQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50TWFzayAmPSB+QU5DSE9SX09OO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBFdmVudFR5cGUuQ09MT1JfQ0hBTkdFRDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRNYXNrICY9IH5DT0xPUl9PTjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9vZmZEaXNwYXRjaCAodHlwZSwgY2FsbGJhY2ssIHRhcmdldCwgdXNlQ2FwdHVyZSkge1xuICAgICAgICAvLyBBY2NlcHQgYWxzbyBwYXRhbWV0ZXJzIGxpa2U6ICh0eXBlLCBjYWxsYmFjaywgdXNlQ2FwdHVyZSlcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgdXNlQ2FwdHVyZSA9IHRhcmdldDtcbiAgICAgICAgICAgIHRhcmdldCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHVzZUNhcHR1cmUgPSAhIXVzZUNhcHR1cmU7XG4gICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMuX2NhcHR1cmluZ0xpc3RlbmVycyAmJiB0aGlzLl9jYXB0dXJpbmdMaXN0ZW5lcnMucmVtb3ZlQWxsKHR5cGUpO1xuICAgICAgICAgICAgdGhpcy5fYnViYmxpbmdMaXN0ZW5lcnMgJiYgdGhpcy5fYnViYmxpbmdMaXN0ZW5lcnMucmVtb3ZlQWxsKHR5cGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGxpc3RlbmVycyA9IHVzZUNhcHR1cmUgPyB0aGlzLl9jYXB0dXJpbmdMaXN0ZW5lcnMgOiB0aGlzLl9idWJibGluZ0xpc3RlbmVycztcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnMub2ZmKHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldCAmJiB0YXJnZXQuX19ldmVudFRhcmdldHMpIHtcbiAgICAgICAgICAgICAgICAgICAganMuYXJyYXkuZmFzdFJlbW92ZSh0YXJnZXQuX19ldmVudFRhcmdldHMsIHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmVtb3ZlcyBhbGwgY2FsbGJhY2tzIHByZXZpb3VzbHkgcmVnaXN0ZXJlZCB3aXRoIHRoZSBzYW1lIHRhcmdldC5cbiAgICAgKiAhI3poIOenu+mZpOebruagh+S4iueahOaJgOacieazqOWGjOS6i+S7tuOAglxuICAgICAqIEBtZXRob2QgdGFyZ2V0T2ZmXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCAtIFRoZSB0YXJnZXQgdG8gYmUgc2VhcmNoZWQgZm9yIGFsbCByZWxhdGVkIGNhbGxiYWNrc1xuICAgICAqIEBleGFtcGxlXG4gICAgICogbm9kZS50YXJnZXRPZmYodGFyZ2V0KTtcbiAgICAgKi9cbiAgICB0YXJnZXRPZmYgKHRhcmdldCkge1xuICAgICAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5fYnViYmxpbmdMaXN0ZW5lcnM7XG4gICAgICAgIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGxpc3RlbmVycy50YXJnZXRPZmYodGFyZ2V0KTtcblxuICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIGV2ZW50IG1hc2sgcmVzZXRcbiAgICAgICAgICAgIGlmICgodGhpcy5fZXZlbnRNYXNrICYgUE9TSVRJT05fT04pICYmICFsaXN0ZW5lcnMuaGFzRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuUE9TSVRJT05fQ0hBTkdFRCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9ldmVudE1hc2sgJj0gflBPU0lUSU9OX09OO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCh0aGlzLl9ldmVudE1hc2sgJiBTQ0FMRV9PTikgJiYgIWxpc3RlbmVycy5oYXNFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5TQ0FMRV9DSEFOR0VEKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50TWFzayAmPSB+U0NBTEVfT047XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKHRoaXMuX2V2ZW50TWFzayAmIFJPVEFUSU9OX09OKSAmJiAhbGlzdGVuZXJzLmhhc0V2ZW50TGlzdGVuZXIoRXZlbnRUeXBlLlJPVEFUSU9OX0NIQU5HRUQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRNYXNrICY9IH5ST1RBVElPTl9PTjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgodGhpcy5fZXZlbnRNYXNrICYgU0laRV9PTikgJiYgIWxpc3RlbmVycy5oYXNFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5TSVpFX0NIQU5HRUQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRNYXNrICY9IH5TSVpFX09OO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCh0aGlzLl9ldmVudE1hc2sgJiBBTkNIT1JfT04pICYmICFsaXN0ZW5lcnMuaGFzRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuQU5DSE9SX0NIQU5HRUQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRNYXNrICY9IH5BTkNIT1JfT047XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKHRoaXMuX2V2ZW50TWFzayAmIENPTE9SX09OKSAmJiAhbGlzdGVuZXJzLmhhc0V2ZW50TGlzdGVuZXIoRXZlbnRUeXBlLkNPTE9SX0NIQU5HRUQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRNYXNrICY9IH5DT0xPUl9PTjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fY2FwdHVyaW5nTGlzdGVuZXJzKSB7XG4gICAgICAgICAgICB0aGlzLl9jYXB0dXJpbmdMaXN0ZW5lcnMudGFyZ2V0T2ZmKHRhcmdldCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGFyZ2V0ICYmIHRhcmdldC5fX2V2ZW50VGFyZ2V0cykge1xuICAgICAgICAgICAganMuYXJyYXkuZmFzdFJlbW92ZSh0YXJnZXQuX19ldmVudFRhcmdldHMsIHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX3RvdWNoTGlzdGVuZXIgJiYgIV9jaGVja0xpc3RlbmVycyh0aGlzLCBfdG91Y2hFdmVudHMpKSB7XG4gICAgICAgICAgICBldmVudE1hbmFnZXIucmVtb3ZlTGlzdGVuZXIodGhpcy5fdG91Y2hMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLl90b3VjaExpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fbW91c2VMaXN0ZW5lciAmJiAhX2NoZWNrTGlzdGVuZXJzKHRoaXMsIF9tb3VzZUV2ZW50cykpIHtcbiAgICAgICAgICAgIGV2ZW50TWFuYWdlci5yZW1vdmVMaXN0ZW5lcih0aGlzLl9tb3VzZUxpc3RlbmVyKTtcbiAgICAgICAgICAgIHRoaXMuX21vdXNlTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2hlY2tzIHdoZXRoZXIgdGhlIEV2ZW50VGFyZ2V0IG9iamVjdCBoYXMgYW55IGNhbGxiYWNrIHJlZ2lzdGVyZWQgZm9yIGEgc3BlY2lmaWMgdHlwZSBvZiBldmVudC5cbiAgICAgKiAhI3poIOajgOafpeS6i+S7tuebruagh+WvueixoeaYr+WQpuacieS4uueJueWumuexu+Wei+eahOS6i+S7tuazqOWGjOeahOWbnuiwg+OAglxuICAgICAqIEBtZXRob2QgaGFzRXZlbnRMaXN0ZW5lclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gVGhlIHR5cGUgb2YgZXZlbnQuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gVHJ1ZSBpZiBhIGNhbGxiYWNrIG9mIHRoZSBzcGVjaWZpZWQgdHlwZSBpcyByZWdpc3RlcmVkOyBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgaGFzRXZlbnRMaXN0ZW5lciAodHlwZSkge1xuICAgICAgICBsZXQgaGFzID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLl9idWJibGluZ0xpc3RlbmVycykge1xuICAgICAgICAgICAgaGFzID0gdGhpcy5fYnViYmxpbmdMaXN0ZW5lcnMuaGFzRXZlbnRMaXN0ZW5lcih0eXBlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWhhcyAmJiB0aGlzLl9jYXB0dXJpbmdMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGhhcyA9IHRoaXMuX2NhcHR1cmluZ0xpc3RlbmVycy5oYXNFdmVudExpc3RlbmVyKHR5cGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBUcmlnZ2VyIGFuIGV2ZW50IGRpcmVjdGx5IHdpdGggdGhlIGV2ZW50IG5hbWUgYW5kIG5lY2Vzc2FyeSBhcmd1bWVudHMuXG4gICAgICogISN6aFxuICAgICAqIOmAmui/h+S6i+S7tuWQjeWPkemAgeiHquWumuS5ieS6i+S7tlxuICAgICAqXG4gICAgICogQG1ldGhvZCBlbWl0XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBldmVudCB0eXBlXG4gICAgICogQHBhcmFtIHsqfSBbYXJnMV0gLSBGaXJzdCBhcmd1bWVudCBpbiBjYWxsYmFja1xuICAgICAqIEBwYXJhbSB7Kn0gW2FyZzJdIC0gU2Vjb25kIGFyZ3VtZW50IGluIGNhbGxiYWNrXG4gICAgICogQHBhcmFtIHsqfSBbYXJnM10gLSBUaGlyZCBhcmd1bWVudCBpbiBjYWxsYmFja1xuICAgICAqIEBwYXJhbSB7Kn0gW2FyZzRdIC0gRm91cnRoIGFyZ3VtZW50IGluIGNhbGxiYWNrXG4gICAgICogQHBhcmFtIHsqfSBbYXJnNV0gLSBGaWZ0aCBhcmd1bWVudCBpbiBjYWxsYmFja1xuICAgICAqIEBleGFtcGxlXG4gICAgICogXG4gICAgICogZXZlbnRUYXJnZXQuZW1pdCgnZmlyZScsIGV2ZW50KTtcbiAgICAgKiBldmVudFRhcmdldC5lbWl0KCdmaXJlJywgbWVzc2FnZSwgZW1pdHRlcik7XG4gICAgICovXG4gICAgZW1pdCAodHlwZSwgYXJnMSwgYXJnMiwgYXJnMywgYXJnNCwgYXJnNSkge1xuICAgICAgICBpZiAodGhpcy5fYnViYmxpbmdMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIHRoaXMuX2J1YmJsaW5nTGlzdGVuZXJzLmVtaXQodHlwZSwgYXJnMSwgYXJnMiwgYXJnMywgYXJnNCwgYXJnNSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIERpc3BhdGNoZXMgYW4gZXZlbnQgaW50byB0aGUgZXZlbnQgZmxvdy5cbiAgICAgKiBUaGUgZXZlbnQgdGFyZ2V0IGlzIHRoZSBFdmVudFRhcmdldCBvYmplY3QgdXBvbiB3aGljaCB0aGUgZGlzcGF0Y2hFdmVudCgpIG1ldGhvZCBpcyBjYWxsZWQuXG4gICAgICogISN6aCDliIblj5Hkuovku7bliLDkuovku7bmtYHkuK3jgIJcbiAgICAgKlxuICAgICAqIEBtZXRob2QgZGlzcGF0Y2hFdmVudFxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IC0gVGhlIEV2ZW50IG9iamVjdCB0aGF0IGlzIGRpc3BhdGNoZWQgaW50byB0aGUgZXZlbnQgZmxvd1xuICAgICAqL1xuICAgIGRpc3BhdGNoRXZlbnQgKGV2ZW50KSB7XG4gICAgICAgIF9kb0Rpc3BhdGNoRXZlbnQodGhpcywgZXZlbnQpO1xuICAgICAgICBfY2FjaGVkQXJyYXkubGVuZ3RoID0gMDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBQYXVzZSBub2RlIHJlbGF0ZWQgc3lzdGVtIGV2ZW50cyByZWdpc3RlcmVkIHdpdGggdGhlIGN1cnJlbnQgTm9kZS4gTm9kZSBzeXN0ZW0gZXZlbnRzIGluY2x1ZGVzIHRvdWNoIGFuZCBtb3VzZSBldmVudHMuXG4gICAgICogSWYgcmVjdXJzaXZlIGlzIHNldCB0byB0cnVlLCB0aGVuIHRoaXMgQVBJIHdpbGwgcGF1c2UgdGhlIG5vZGUgc3lzdGVtIGV2ZW50cyBmb3IgdGhlIG5vZGUgYW5kIGFsbCBub2RlcyBpbiBpdHMgc3ViIG5vZGUgdHJlZS5cbiAgICAgKiBSZWZlcmVuY2U6IGh0dHA6Ly9kb2NzLmNvY29zMmQteC5vcmcvZWRpdG9yc19hbmRfdG9vbHMvY3JlYXRvci1jaGFwdGVycy9zY3JpcHRpbmcvaW50ZXJuYWwtZXZlbnRzL1xuICAgICAqICEjemgg5pqC5YGc5b2T5YmN6IqC54K55LiK5rOo5YaM55qE5omA5pyJ6IqC54K557O757uf5LqL5Lu277yM6IqC54K557O757uf5LqL5Lu25YyF5ZCr6Kem5pG45ZKM6byg5qCH5LqL5Lu244CCXG4gICAgICog5aaC5p6c5Lyg6YCSIHJlY3Vyc2l2ZSDkuLogdHJ1Ze+8jOmCo+S5iOi/meS4qiBBUEkg5bCG5pqC5YGc5pys6IqC54K55ZKM5a6D55qE5a2Q5qCR5LiK5omA5pyJ6IqC54K555qE6IqC54K557O757uf5LqL5Lu244CCXG4gICAgICog5Y+C6ICD77yaaHR0cHM6Ly93d3cuY29jb3MuY29tL2RvY3MvY3JlYXRvci9zY3JpcHRpbmcvaW50ZXJuYWwtZXZlbnRzLmh0bWxcbiAgICAgKiBAbWV0aG9kIHBhdXNlU3lzdGVtRXZlbnRzXG4gICAgICogQHBhcmFtIHtCb29sZWFufSByZWN1cnNpdmUgLSBXaGV0aGVyIHRvIHBhdXNlIG5vZGUgc3lzdGVtIGV2ZW50cyBvbiB0aGUgc3ViIG5vZGUgdHJlZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIG5vZGUucGF1c2VTeXN0ZW1FdmVudHModHJ1ZSk7XG4gICAgICovXG4gICAgcGF1c2VTeXN0ZW1FdmVudHMgKHJlY3Vyc2l2ZSkge1xuICAgICAgICBldmVudE1hbmFnZXIucGF1c2VUYXJnZXQodGhpcywgcmVjdXJzaXZlKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXN1bWUgbm9kZSByZWxhdGVkIHN5c3RlbSBldmVudHMgcmVnaXN0ZXJlZCB3aXRoIHRoZSBjdXJyZW50IE5vZGUuIE5vZGUgc3lzdGVtIGV2ZW50cyBpbmNsdWRlcyB0b3VjaCBhbmQgbW91c2UgZXZlbnRzLlxuICAgICAqIElmIHJlY3Vyc2l2ZSBpcyBzZXQgdG8gdHJ1ZSwgdGhlbiB0aGlzIEFQSSB3aWxsIHJlc3VtZSB0aGUgbm9kZSBzeXN0ZW0gZXZlbnRzIGZvciB0aGUgbm9kZSBhbmQgYWxsIG5vZGVzIGluIGl0cyBzdWIgbm9kZSB0cmVlLlxuICAgICAqIFJlZmVyZW5jZTogaHR0cDovL2RvY3MuY29jb3MyZC14Lm9yZy9lZGl0b3JzX2FuZF90b29scy9jcmVhdG9yLWNoYXB0ZXJzL3NjcmlwdGluZy9pbnRlcm5hbC1ldmVudHMvXG4gICAgICogISN6aCDmgaLlpI3lvZPliY3oioLngrnkuIrms6jlhoznmoTmiYDmnInoioLngrnns7vnu5/kuovku7bvvIzoioLngrnns7vnu5/kuovku7bljIXlkKvop6bmkbjlkozpvKDmoIfkuovku7bjgIJcbiAgICAgKiDlpoLmnpzkvKDpgJIgcmVjdXJzaXZlIOS4uiB0cnVl77yM6YKj5LmI6L+Z5LiqIEFQSSDlsIbmgaLlpI3mnKzoioLngrnlkozlroPnmoTlrZDmoJHkuIrmiYDmnInoioLngrnnmoToioLngrnns7vnu5/kuovku7bjgIJcbiAgICAgKiDlj4LogIPvvJpodHRwczovL3d3dy5jb2Nvcy5jb20vZG9jcy9jcmVhdG9yL3NjcmlwdGluZy9pbnRlcm5hbC1ldmVudHMuaHRtbFxuICAgICAqIEBtZXRob2QgcmVzdW1lU3lzdGVtRXZlbnRzXG4gICAgICogQHBhcmFtIHtCb29sZWFufSByZWN1cnNpdmUgLSBXaGV0aGVyIHRvIHJlc3VtZSBub2RlIHN5c3RlbSBldmVudHMgb24gdGhlIHN1YiBub2RlIHRyZWUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBub2RlLnJlc3VtZVN5c3RlbUV2ZW50cyh0cnVlKTtcbiAgICAgKi9cbiAgICByZXN1bWVTeXN0ZW1FdmVudHMgKHJlY3Vyc2l2ZSkge1xuICAgICAgICBldmVudE1hbmFnZXIucmVzdW1lVGFyZ2V0KHRoaXMsIHJlY3Vyc2l2ZSk7XG4gICAgfSxcblxuICAgIF9oaXRUZXN0IChwb2ludCwgbGlzdGVuZXIpIHtcbiAgICAgICAgbGV0IHcgPSB0aGlzLl9jb250ZW50U2l6ZS53aWR0aCxcbiAgICAgICAgICAgIGggPSB0aGlzLl9jb250ZW50U2l6ZS5oZWlnaHQsXG4gICAgICAgICAgICBjYW1lcmFQdCA9IF9odFZlYzNhLFxuICAgICAgICAgICAgdGVzdFB0ID0gX2h0VmVjM2I7XG4gICAgICAgIFxuICAgICAgICBsZXQgY2FtZXJhID0gY2MuQ2FtZXJhLmZpbmRDYW1lcmEodGhpcyk7XG4gICAgICAgIGlmIChjYW1lcmEpIHtcbiAgICAgICAgICAgIGNhbWVyYS5nZXRTY3JlZW5Ub1dvcmxkUG9pbnQocG9pbnQsIGNhbWVyYVB0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNhbWVyYVB0LnNldChwb2ludCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl91cGRhdGVXb3JsZE1hdHJpeCgpO1xuICAgICAgICAvLyBJZiBzY2FsZSBpcyAwLCBpdCBjYW4ndCBiZSBoaXQuXG4gICAgICAgIGlmICghTWF0NC5pbnZlcnQoX21hdDRfdGVtcCwgdGhpcy5fd29ybGRNYXRyaXgpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgVmVjMi50cmFuc2Zvcm1NYXQ0KHRlc3RQdCwgY2FtZXJhUHQsIF9tYXQ0X3RlbXApO1xuICAgICAgICB0ZXN0UHQueCArPSB0aGlzLl9hbmNob3JQb2ludC54ICogdztcbiAgICAgICAgdGVzdFB0LnkgKz0gdGhpcy5fYW5jaG9yUG9pbnQueSAqIGg7XG5cbiAgICAgICAgbGV0IGhpdCA9IGZhbHNlO1xuICAgICAgICBpZiAodGVzdFB0LnggPj0gMCAmJiB0ZXN0UHQueSA+PSAwICYmIHRlc3RQdC54IDw9IHcgJiYgdGVzdFB0LnkgPD0gaCkge1xuICAgICAgICAgICAgaGl0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lciAmJiBsaXN0ZW5lci5tYXNrKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1hc2sgPSBsaXN0ZW5lci5tYXNrO1xuICAgICAgICAgICAgICAgIGxldCBwYXJlbnQgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGxldCBsZW5ndGggPSBtYXNrID8gbWFzay5sZW5ndGggOiAwO1xuICAgICAgICAgICAgICAgIC8vIGZpbmQgbWFzayBwYXJlbnQsIHNob3VsZCBoaXQgdGVzdCBpdFxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBqID0gMDsgcGFyZW50ICYmIGogPCBsZW5ndGg7ICsraSwgcGFyZW50ID0gcGFyZW50LnBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcCA9IG1hc2tbal07XG4gICAgICAgICAgICAgICAgICAgIGlmIChpID09PSB0ZW1wLmluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyZW50ID09PSB0ZW1wLm5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY29tcCA9IHBhcmVudC5nZXRDb21wb25lbnQoY2MuTWFzayk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXAgJiYgY29tcC5fZW5hYmxlZCAmJiAhY29tcC5faGl0VGVzdChjYW1lcmFQdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGl0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGorKztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFzayBwYXJlbnQgbm8gbG9uZ2VyIGV4aXN0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hc2subGVuZ3RoID0gajtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPiB0ZW1wLmluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYXNrIHBhcmVudCBubyBsb25nZXIgZXhpc3RzXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXNrLmxlbmd0aCA9IGo7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IFxuXG4gICAgICAgIHJldHVybiBoaXQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBhbGwgdGhlIHRhcmdldHMgbGlzdGVuaW5nIHRvIHRoZSBzdXBwbGllZCB0eXBlIG9mIGV2ZW50IGluIHRoZSB0YXJnZXQncyBjYXB0dXJpbmcgcGhhc2UuXG4gICAgICogVGhlIGNhcHR1cmluZyBwaGFzZSBjb21wcmlzZXMgdGhlIGpvdXJuZXkgZnJvbSB0aGUgcm9vdCB0byB0aGUgbGFzdCBub2RlIEJFRk9SRSB0aGUgZXZlbnQgdGFyZ2V0J3Mgbm9kZS5cbiAgICAgKiBUaGUgcmVzdWx0IHNob3VsZCBzYXZlIGluIHRoZSBhcnJheSBwYXJhbWV0ZXIsIGFuZCBNVVNUIFNPUlQgZnJvbSBjaGlsZCBub2RlcyB0byBwYXJlbnQgbm9kZXMuXG4gICAgICpcbiAgICAgKiBTdWJjbGFzc2VzIGNhbiBvdmVycmlkZSB0aGlzIG1ldGhvZCB0byBtYWtlIGV2ZW50IHByb3BhZ2FibGUuXG4gICAgICogQG1ldGhvZCBfZ2V0Q2FwdHVyaW5nVGFyZ2V0c1xuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSB0aGUgZXZlbnQgdHlwZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IC0gdGhlIGFycmF5IHRvIHJlY2VpdmUgdGFyZ2V0c1xuICAgICAqIEBleGFtcGxlIHtAbGluayBjb2NvczJkL2NvcmUvZXZlbnQvX2dldENhcHR1cmluZ1RhcmdldHMuanN9XG4gICAgICovXG4gICAgX2dldENhcHR1cmluZ1RhcmdldHMgKHR5cGUsIGFycmF5KSB7XG4gICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudDtcbiAgICAgICAgd2hpbGUgKHBhcmVudCkge1xuICAgICAgICAgICAgaWYgKHBhcmVudC5fY2FwdHVyaW5nTGlzdGVuZXJzICYmIHBhcmVudC5fY2FwdHVyaW5nTGlzdGVuZXJzLmhhc0V2ZW50TGlzdGVuZXIodHlwZSkpIHtcbiAgICAgICAgICAgICAgICBhcnJheS5wdXNoKHBhcmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBhbGwgdGhlIHRhcmdldHMgbGlzdGVuaW5nIHRvIHRoZSBzdXBwbGllZCB0eXBlIG9mIGV2ZW50IGluIHRoZSB0YXJnZXQncyBidWJibGluZyBwaGFzZS5cbiAgICAgKiBUaGUgYnViYmxpbmcgcGhhc2UgY29tcHJpc2VzIGFueSBTVUJTRVFVRU5UIG5vZGVzIGVuY291bnRlcmVkIG9uIHRoZSByZXR1cm4gdHJpcCB0byB0aGUgcm9vdCBvZiB0aGUgdHJlZS5cbiAgICAgKiBUaGUgcmVzdWx0IHNob3VsZCBzYXZlIGluIHRoZSBhcnJheSBwYXJhbWV0ZXIsIGFuZCBNVVNUIFNPUlQgZnJvbSBjaGlsZCBub2RlcyB0byBwYXJlbnQgbm9kZXMuXG4gICAgICpcbiAgICAgKiBTdWJjbGFzc2VzIGNhbiBvdmVycmlkZSB0aGlzIG1ldGhvZCB0byBtYWtlIGV2ZW50IHByb3BhZ2FibGUuXG4gICAgICogQG1ldGhvZCBfZ2V0QnViYmxpbmdUYXJnZXRzXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIHRoZSBldmVudCB0eXBlXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgLSB0aGUgYXJyYXkgdG8gcmVjZWl2ZSB0YXJnZXRzXG4gICAgICovXG4gICAgX2dldEJ1YmJsaW5nVGFyZ2V0cyAodHlwZSwgYXJyYXkpIHtcbiAgICAgICAgdmFyIHBhcmVudCA9IHRoaXMucGFyZW50O1xuICAgICAgICB3aGlsZSAocGFyZW50KSB7XG4gICAgICAgICAgICBpZiAocGFyZW50Ll9idWJibGluZ0xpc3RlbmVycyAmJiBwYXJlbnQuX2J1YmJsaW5nTGlzdGVuZXJzLmhhc0V2ZW50TGlzdGVuZXIodHlwZSkpIHtcbiAgICAgICAgICAgICAgICBhcnJheS5wdXNoKHBhcmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICAgICAgICB9XG4gICAgfSxcblxuLy8gQUNUSU9OU1xuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBFeGVjdXRlcyBhbiBhY3Rpb24sIGFuZCByZXR1cm5zIHRoZSBhY3Rpb24gdGhhdCBpcyBleGVjdXRlZC48YnIvPlxuICAgICAqIFRoZSBub2RlIGJlY29tZXMgdGhlIGFjdGlvbidzIHRhcmdldC4gUmVmZXIgdG8gY2MuQWN0aW9uJ3MgZ2V0VGFyZ2V0KCkgPGJyLz5cbiAgICAgKiBDYWxsaW5nIHJ1bkFjdGlvbiB3aGlsZSB0aGUgbm9kZSBpcyBub3QgYWN0aXZlIHdvbid0IGhhdmUgYW55IGVmZmVjdC4gPGJyLz5cbiAgICAgKiBOb3Rl77yaWW91IHNob3VsZG4ndCBtb2RpZnkgdGhlIGFjdGlvbiBhZnRlciBydW5BY3Rpb24sIHRoYXQgd29uJ3QgdGFrZSBhbnkgZWZmZWN0Ljxici8+XG4gICAgICogaWYgeW91IHdhbnQgdG8gbW9kaWZ5LCB3aGVuIHlvdSBkZWZpbmUgYWN0aW9uIHBsdXMuXG4gICAgICogISN6aFxuICAgICAqIOaJp+ihjOW5tui/lOWbnuivpeaJp+ihjOeahOWKqOS9nOOAguivpeiKgueCueWwhuS8muWPmOaIkOWKqOS9nOeahOebruagh+OAgjxici8+XG4gICAgICog6LCD55SoIHJ1bkFjdGlvbiDml7bvvIzoioLngrnoh6rouqvlpITkuo7kuI3mv4DmtLvnirbmgIHlsIbkuI3kvJrmnInku7vkvZXmlYjmnpzjgII8YnIvPlxuICAgICAqIOazqOaEj++8muS9oOS4jeW6lOivpeS/ruaUuSBydW5BY3Rpb24g5ZCO55qE5Yqo5L2c77yM5bCG5peg5rOV5Y+R5oyl5L2c55So77yM5aaC5p6c5oOz6L+b6KGM5L+u5pS577yM6K+35Zyo5a6a5LmJIGFjdGlvbiDml7bliqDlhaXjgIJcbiAgICAgKiBAbWV0aG9kIHJ1bkFjdGlvblxuICAgICAqIEBwYXJhbSB7QWN0aW9ufSBhY3Rpb25cbiAgICAgKiBAcmV0dXJuIHtBY3Rpb259IEFuIEFjdGlvbiBwb2ludGVyXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgYWN0aW9uID0gY2Muc2NhbGVUbygwLjIsIDEsIDAuNik7XG4gICAgICogbm9kZS5ydW5BY3Rpb24oYWN0aW9uKTtcbiAgICAgKiBub2RlLnJ1bkFjdGlvbihhY3Rpb24pLnJlcGVhdEZvcmV2ZXIoKTsgLy8gZmFpbFxuICAgICAqIG5vZGUucnVuQWN0aW9uKGFjdGlvbi5yZXBlYXRGb3JldmVyKCkpOyAvLyByaWdodFxuICAgICAqL1xuICAgIHJ1bkFjdGlvbjogQWN0aW9uTWFuYWdlckV4aXN0ID8gZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjYy5hc3NlcnRJRChhY3Rpb24sIDE2MTgpO1xuICAgICAgICBjYy53YXJuSUQoMTYzOSk7XG4gICAgICAgIGNjLmRpcmVjdG9yLmdldEFjdGlvbk1hbmFnZXIoKS5hZGRBY3Rpb24oYWN0aW9uLCB0aGlzLCBmYWxzZSk7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfSA6IGVtcHR5RnVuYyxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUGF1c2UgYWxsIGFjdGlvbnMgcnVubmluZyBvbiB0aGUgY3VycmVudCBub2RlLiBFcXVhbHMgdG8gYGNjLmRpcmVjdG9yLmdldEFjdGlvbk1hbmFnZXIoKS5wYXVzZVRhcmdldChub2RlKWAuXG4gICAgICogISN6aCDmmoLlgZzmnKzoioLngrnkuIrmiYDmnInmraPlnKjov5DooYznmoTliqjkvZzjgILlkowgYGNjLmRpcmVjdG9yLmdldEFjdGlvbk1hbmFnZXIoKS5wYXVzZVRhcmdldChub2RlKTtgIOetieS7t+OAglxuICAgICAqIEBtZXRob2QgcGF1c2VBbGxBY3Rpb25zXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBub2RlLnBhdXNlQWxsQWN0aW9ucygpO1xuICAgICAqL1xuICAgIHBhdXNlQWxsQWN0aW9uczogQWN0aW9uTWFuYWdlckV4aXN0ID8gZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5nZXRBY3Rpb25NYW5hZ2VyKCkucGF1c2VUYXJnZXQodGhpcyk7XG4gICAgfSA6IGVtcHR5RnVuYyxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmVzdW1lIGFsbCBwYXVzZWQgYWN0aW9ucyBvbiB0aGUgY3VycmVudCBub2RlLiBFcXVhbHMgdG8gYGNjLmRpcmVjdG9yLmdldEFjdGlvbk1hbmFnZXIoKS5yZXN1bWVUYXJnZXQobm9kZSlgLlxuICAgICAqICEjemgg5oGi5aSN6L+Q6KGM5pys6IqC54K55LiK5omA5pyJ5pqC5YGc55qE5Yqo5L2c44CC5ZKMIGBjYy5kaXJlY3Rvci5nZXRBY3Rpb25NYW5hZ2VyKCkucmVzdW1lVGFyZ2V0KG5vZGUpO2Ag562J5Lu344CCXG4gICAgICogQG1ldGhvZCByZXN1bWVBbGxBY3Rpb25zXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBub2RlLnJlc3VtZUFsbEFjdGlvbnMoKTtcbiAgICAgKi9cbiAgICByZXN1bWVBbGxBY3Rpb25zOiBBY3Rpb25NYW5hZ2VyRXhpc3QgPyBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmdldEFjdGlvbk1hbmFnZXIoKS5yZXN1bWVUYXJnZXQodGhpcyk7XG4gICAgfSA6IGVtcHR5RnVuYyxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU3RvcHMgYW5kIHJlbW92ZXMgYWxsIGFjdGlvbnMgZnJvbSB0aGUgcnVubmluZyBhY3Rpb24gbGlzdCAuXG4gICAgICogISN6aCDlgZzmraLlubbkuJTnp7vpmaTmiYDmnInmraPlnKjov5DooYznmoTliqjkvZzliJfooajjgIJcbiAgICAgKiBAbWV0aG9kIHN0b3BBbGxBY3Rpb25zXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBub2RlLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICovXG4gICAgc3RvcEFsbEFjdGlvbnM6IEFjdGlvbk1hbmFnZXJFeGlzdCA/IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0QWN0aW9uTWFuYWdlcigpLnJlbW92ZUFsbEFjdGlvbnNGcm9tVGFyZ2V0KHRoaXMpO1xuICAgIH0gOiBlbXB0eUZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFN0b3BzIGFuZCByZW1vdmVzIGFuIGFjdGlvbiBmcm9tIHRoZSBydW5uaW5nIGFjdGlvbiBsaXN0LlxuICAgICAqICEjemgg5YGc5q2i5bm256e76Zmk5oyH5a6a55qE5Yqo5L2c44CCXG4gICAgICogQG1ldGhvZCBzdG9wQWN0aW9uXG4gICAgICogQHBhcmFtIHtBY3Rpb259IGFjdGlvbiBBbiBhY3Rpb24gb2JqZWN0IHRvIGJlIHJlbW92ZWQuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgYWN0aW9uID0gY2Muc2NhbGVUbygwLjIsIDEsIDAuNik7XG4gICAgICogbm9kZS5zdG9wQWN0aW9uKGFjdGlvbik7XG4gICAgICovXG4gICAgc3RvcEFjdGlvbjogQWN0aW9uTWFuYWdlckV4aXN0ID8gZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgICBjYy5kaXJlY3Rvci5nZXRBY3Rpb25NYW5hZ2VyKCkucmVtb3ZlQWN0aW9uKGFjdGlvbik7XG4gICAgfSA6IGVtcHR5RnVuYyxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmVtb3ZlcyBhbiBhY3Rpb24gZnJvbSB0aGUgcnVubmluZyBhY3Rpb24gbGlzdCBieSBpdHMgdGFnLlxuICAgICAqICEjemgg5YGc5q2i5bm25LiU56e76Zmk5oyH5a6a5qCH562+55qE5Yqo5L2c44CCXG4gICAgICogQG1ldGhvZCBzdG9wQWN0aW9uQnlUYWdcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdGFnIEEgdGFnIHRoYXQgaW5kaWNhdGVzIHRoZSBhY3Rpb24gdG8gYmUgcmVtb3ZlZC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIG5vZGUuc3RvcEFjdGlvbkJ5VGFnKDEpO1xuICAgICAqL1xuICAgIHN0b3BBY3Rpb25CeVRhZzogQWN0aW9uTWFuYWdlckV4aXN0ID8gZnVuY3Rpb24gKHRhZykge1xuICAgICAgICBpZiAodGFnID09PSBjYy5BY3Rpb24uVEFHX0lOVkFMSUQpIHtcbiAgICAgICAgICAgIGNjLmxvZ0lEKDE2MTIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNjLmRpcmVjdG9yLmdldEFjdGlvbk1hbmFnZXIoKS5yZW1vdmVBY3Rpb25CeVRhZyh0YWcsIHRoaXMpO1xuICAgIH0gOiBlbXB0eUZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgYW4gYWN0aW9uIGZyb20gdGhlIHJ1bm5pbmcgYWN0aW9uIGxpc3QgYnkgaXRzIHRhZy5cbiAgICAgKiAhI3poIOmAmui/h+agh+etvuiOt+WPluaMh+WumuWKqOS9nOOAglxuICAgICAqIEBtZXRob2QgZ2V0QWN0aW9uQnlUYWdcbiAgICAgKiBAc2VlIGNjLkFjdGlvbiNnZXRUYWcgYW5kIGNjLkFjdGlvbiNzZXRUYWdcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdGFnXG4gICAgICogQHJldHVybiB7QWN0aW9ufSBUaGUgYWN0aW9uIG9iamVjdCB3aXRoIHRoZSBnaXZlbiB0YWcuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgYWN0aW9uID0gbm9kZS5nZXRBY3Rpb25CeVRhZygxKTtcbiAgICAgKi9cbiAgICBnZXRBY3Rpb25CeVRhZzogQWN0aW9uTWFuYWdlckV4aXN0ID8gZnVuY3Rpb24gKHRhZykge1xuICAgICAgICBpZiAodGFnID09PSBjYy5BY3Rpb24uVEFHX0lOVkFMSUQpIHtcbiAgICAgICAgICAgIGNjLmxvZ0lEKDE2MTMpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNjLmRpcmVjdG9yLmdldEFjdGlvbk1hbmFnZXIoKS5nZXRBY3Rpb25CeVRhZyh0YWcsIHRoaXMpO1xuICAgIH0gOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmV0dXJucyB0aGUgbnVtYmVycyBvZiBhY3Rpb25zIHRoYXQgYXJlIHJ1bm5pbmcgcGx1cyB0aGUgb25lcyB0aGF0IGFyZSBzY2hlZHVsZSB0byBydW4gKGFjdGlvbnMgaW4gYWN0aW9uc1RvQWRkIGFuZCBhY3Rpb25zIGFycmF5cykuPGJyLz5cbiAgICAgKiAgICBDb21wb3NhYmxlIGFjdGlvbnMgYXJlIGNvdW50ZWQgYXMgMSBhY3Rpb24uIEV4YW1wbGU6PGJyLz5cbiAgICAgKiAgICBJZiB5b3UgYXJlIHJ1bm5pbmcgMSBTZXF1ZW5jZSBvZiA3IGFjdGlvbnMsIGl0IHdpbGwgcmV0dXJuIDEuIDxici8+XG4gICAgICogICAgSWYgeW91IGFyZSBydW5uaW5nIDcgU2VxdWVuY2VzIG9mIDIgYWN0aW9ucywgaXQgd2lsbCByZXR1cm4gNy48L3A+XG4gICAgICogISN6aFxuICAgICAqIOiOt+WPlui/kOihjOedgOeahOWKqOS9nOWKoOS4iuato+WcqOiwg+W6pui/kOihjOeahOWKqOS9nOeahOaAu+aVsOOAgjxici8+XG4gICAgICog5L6L5aaC77yaPGJyLz5cbiAgICAgKiAtIOWmguaenOS9oOato+WcqOi/kOihjCA3IOS4quWKqOS9nOS4reeahCAxIOS4qiBTZXF1ZW5jZe+8jOWug+Wwhui/lOWbniAx44CCPGJyLz5cbiAgICAgKiAtIOWmguaenOS9oOato+WcqOi/kOihjCAyIOS4quWKqOS9nOS4reeahCA3IOS4qiBTZXF1ZW5jZe+8jOWug+Wwhui/lOWbniA344CCPGJyLz5cbiAgICAgKlxuICAgICAqIEBtZXRob2QgZ2V0TnVtYmVyT2ZSdW5uaW5nQWN0aW9uc1xuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIG51bWJlciBvZiBhY3Rpb25zIHRoYXQgYXJlIHJ1bm5pbmcgcGx1cyB0aGUgb25lcyB0aGF0IGFyZSBzY2hlZHVsZSB0byBydW5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBjb3VudCA9IG5vZGUuZ2V0TnVtYmVyT2ZSdW5uaW5nQWN0aW9ucygpO1xuICAgICAqIGNjLmxvZyhcIlJ1bm5pbmcgQWN0aW9uIENvdW50OiBcIiArIGNvdW50KTtcbiAgICAgKi9cbiAgICBnZXROdW1iZXJPZlJ1bm5pbmdBY3Rpb25zOiBBY3Rpb25NYW5hZ2VyRXhpc3QgPyBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjYy5kaXJlY3Rvci5nZXRBY3Rpb25NYW5hZ2VyKCkuZ2V0TnVtYmVyT2ZSdW5uaW5nQWN0aW9uc0luVGFyZ2V0KHRoaXMpO1xuICAgIH0gOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH0sXG5cblxuLy8gVFJBTlNGT1JNIFJFTEFURURcbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmV0dXJucyBhIGNvcHkgb2YgdGhlIHBvc2l0aW9uICh4LCB5LCB6KSBvZiB0aGUgbm9kZSBpbiBpdHMgcGFyZW50J3MgY29vcmRpbmF0ZXMuXG4gICAgICogWW91IGNhbiBwYXNzIGEgY2MuVmVjMiBvciBjYy5WZWMzIGFzIHRoZSBhcmd1bWVudCB0byByZWNlaXZlIHRoZSByZXR1cm4gdmFsdWVzLlxuICAgICAqICEjemhcbiAgICAgKiDojrflj5boioLngrnlnKjniLboioLngrnlnZDmoIfns7vkuK3nmoTkvY3nva7vvIh4LCB5LCB677yJ44CCXG4gICAgICog5L2g5Y+v5Lul5Lyg5LiA5LiqIGNjLlZlYzIg5oiW6ICFIGNjLlZlYzMg5L2c5Li65Y+C5pWw5p2l5o6l5pS26L+U5Zue5YC844CCXG4gICAgICogQG1ldGhvZCBnZXRQb3NpdGlvblxuICAgICAqIEBwYXJhbSB7VmVjMnxWZWMzfSBbb3V0XSAtIFRoZSByZXR1cm4gdmFsdWUgdG8gcmVjZWl2ZSBwb3NpdGlvblxuICAgICAqIEByZXR1cm4ge1ZlYzJ8VmVjM30gVGhlIHBvc2l0aW9uICh4LCB5LCB6KSBvZiB0aGUgbm9kZSBpbiBpdHMgcGFyZW50J3MgY29vcmRpbmF0ZXNcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNjLmxvZyhcIk5vZGUgUG9zaXRpb246IFwiICsgbm9kZS5nZXRQb3NpdGlvbigpKTtcbiAgICAgKi9cbiAgICBnZXRQb3NpdGlvbiAob3V0KSB7XG4gICAgICAgIG91dCA9IG91dCB8fCBuZXcgVmVjMygpO1xuICAgICAgICByZXR1cm4gVHJzLnRvUG9zaXRpb24ob3V0LCB0aGlzLl90cnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogU2V0cyB0aGUgcG9zaXRpb24gKHgsIHksIHopIG9mIHRoZSBub2RlIGluIGl0cyBwYXJlbnQncyBjb29yZGluYXRlcy48YnIvPlxuICAgICAqIFVzdWFsbHkgd2UgdXNlIGNjLnYyKHgsIHkpIHRvIGNvbXBvc2UgY2MuVmVjMiBvYmplY3QsPGJyLz5cbiAgICAgKiBhbmQgcGFzc2luZyB0d28gbnVtYmVycyAoeCwgeSkgaXMgbW9yZSBlZmZpY2llbnQgdGhhbiBwYXNzaW5nIGNjLlZlYzIgb2JqZWN0LlxuICAgICAqIEZvciAzRCBub2RlIHdlIGNhbiB1c2UgY2MudjMoeCwgeSwgeikgdG8gY29tcG9zZSBjYy5WZWMzIG9iamVjdCw8YnIvPlxuICAgICAqIGFuZCBwYXNzaW5nIHRocmVlIG51bWJlcnMgKHgsIHksIHopIGlzIG1vcmUgZWZmaWNpZW50IHRoYW4gcGFzc2luZyBjYy5WZWMzIG9iamVjdC5cbiAgICAgKiAhI3poXG4gICAgICog6K6+572u6IqC54K55Zyo54i26IqC54K55Z2Q5qCH57O75Lit55qE5L2N572u44CCPGJyLz5cbiAgICAgKiDlj6/ku6XpgJrov4fkuIvpnaLnmoTmlrnlvI/orr7nva7lnZDmoIfngrnvvJo8YnIvPlxuICAgICAqIDEuIOS8oOWFpSAyIOS4quaVsOWAvCB4LCB544CCPGJyLz5cbiAgICAgKiAyLiDkvKDlhaUgY2MudjIoeCwgeSkg57G75Z6L5Li6IGNjLlZlYzIg55qE5a+56LGh44CCXG4gICAgICogMy4g5a+55LqOIDNEIOiKgueCueWPr+S7peS8oOWFpSAzIOS4quaVsOWAvCB4LCB5LCB644CCPGJyLz5cbiAgICAgKiA0LiDlr7nkuo4gM0Qg6IqC54K55Y+v5Lul5Lyg5YWlIGNjLnYzKHgsIHksIHopIOexu+Wei+S4uiBjYy5WZWMzIOeahOWvueixoeOAglxuICAgICAqIEBtZXRob2Qgc2V0UG9zaXRpb25cbiAgICAgKiBAcGFyYW0ge1ZlYzJ8VmVjM3xOdW1iZXJ9IG5ld1Bvc09yWCAtIFggY29vcmRpbmF0ZSBmb3IgcG9zaXRpb24gb3IgdGhlIHBvc2l0aW9uICh4LCB5LCB6KSBvZiB0aGUgbm9kZSBpbiBjb29yZGluYXRlc1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbeV0gLSBZIGNvb3JkaW5hdGUgZm9yIHBvc2l0aW9uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFt6XSAtIFogY29vcmRpbmF0ZSBmb3IgcG9zaXRpb25cbiAgICAgKi9cbiAgICBzZXRQb3NpdGlvbiAobmV3UG9zT3JYLCB5LCB6KSB7XG4gICAgICAgIGxldCB4O1xuICAgICAgICBpZiAoeSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB4ID0gbmV3UG9zT3JYLng7XG4gICAgICAgICAgICB5ID0gbmV3UG9zT3JYLnk7XG4gICAgICAgICAgICB6ID0gbmV3UG9zT3JYLnogfHwgMDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHggPSBuZXdQb3NPclg7XG4gICAgICAgICAgICB6ID0geiB8fCAwXG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgbGV0IHRycyA9IHRoaXMuX3RycztcbiAgICAgICAgaWYgKHRyc1swXSA9PT0geCAmJiB0cnNbMV0gPT09IHkgJiYgdHJzWzJdID09PSB6KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgdmFyIG9sZFBvc2l0aW9uID0gbmV3IGNjLlZlYzModHJzWzBdLCB0cnNbMV0sIHRyc1syXSk7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgdHJzWzBdID0geDtcbiAgICAgICAgdHJzWzFdID0geTtcbiAgICAgICAgdHJzWzJdID0gejtcbiAgICAgICAgdGhpcy5zZXRMb2NhbERpcnR5KExvY2FsRGlydHlGbGFnLkFMTF9QT1NJVElPTik7XG4gICAgICAgICFDQ19OQVRJVkVSRU5ERVJFUiAmJiAodGhpcy5fcmVuZGVyRmxhZyB8PSBSZW5kZXJGbG93LkZMQUdfV09STERfVFJBTlNGT1JNKTtcbiAgICBcbiAgICAgICAgLy8gZmFzdCBjaGVjayBldmVudFxuICAgICAgICBpZiAodGhpcy5fZXZlbnRNYXNrICYgUE9TSVRJT05fT04pIHtcbiAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoRXZlbnRUeXBlLlBPU0lUSU9OX0NIQU5HRUQsIG9sZFBvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChFdmVudFR5cGUuUE9TSVRJT05fQ0hBTkdFRCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJldHVybnMgdGhlIHNjYWxlIGZhY3RvciBvZiB0aGUgbm9kZS5cbiAgICAgKiBOZWVkIHBhc3MgYSBjYy5WZWMyIG9yIGNjLlZlYzMgYXMgdGhlIGFyZ3VtZW50IHRvIHJlY2VpdmUgdGhlIHJldHVybiB2YWx1ZXMuXG4gICAgICogISN6aCDojrflj5boioLngrnnmoTnvKnmlL7vvIzpnIDopoHkvKDkuIDkuKogY2MuVmVjMiDmiJbogIUgY2MuVmVjMyDkvZzkuLrlj4LmlbDmnaXmjqXmlLbov5Tlm57lgLzjgIJcbiAgICAgKiBAbWV0aG9kIGdldFNjYWxlXG4gICAgICogQHBhcmFtIHtWZWMyfFZlYzN9IG91dFxuICAgICAqIEByZXR1cm4ge1ZlYzJ8VmVjM30gVGhlIHNjYWxlIGZhY3RvclxuICAgICAqIEBleGFtcGxlXG4gICAgICogY2MubG9nKFwiTm9kZSBTY2FsZTogXCIgKyBub2RlLmdldFNjYWxlKGNjLnYzKCkpKTtcbiAgICAgKi9cbiAgICBnZXRTY2FsZSAob3V0KSB7XG4gICAgICAgIGlmIChvdXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIFRycy50b1NjYWxlKG91dCwgdGhpcy5fdHJzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNjLndhcm5JRCgxNDAwLCAnY2MuTm9kZS5nZXRTY2FsZScsICdjYy5Ob2RlLnNjYWxlIG9yIGNjLk5vZGUuZ2V0U2NhbGUoY2MuVmVjMyknKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90cnNbN107XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNldHMgdGhlIHNjYWxlIG9mIGF4aXMgaW4gbG9jYWwgY29vcmRpbmF0ZXMgb2YgdGhlIG5vZGUuXG4gICAgICogWW91IGNhbiBvcGVyYXRlIDIgYXhpcyBpbiAyRCBub2RlLCBhbmQgMyBheGlzIGluIDNEIG5vZGUuXG4gICAgICogISN6aFxuICAgICAqIOiuvue9ruiKgueCueWcqOacrOWcsOWdkOagh+ezu+S4reWdkOagh+i9tOS4iueahOe8qeaUvuavlOS+i+OAglxuICAgICAqIDJEIOiKgueCueWPr+S7peaTjeS9nOS4pOS4quWdkOagh+i9tO+8jOiAjCAzRCDoioLngrnlj6/ku6Xmk43kvZzkuInkuKrlnZDmoIfovbTjgIJcbiAgICAgKiBAbWV0aG9kIHNldFNjYWxlXG4gICAgICogQHBhcmFtIHtOdW1iZXJ8VmVjMnxWZWMzfSB4IC0gc2NhbGVYIG9yIHNjYWxlIG9iamVjdFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbeV1cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3pdXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBub2RlLnNldFNjYWxlKGNjLnYyKDIsIDIpKTtcbiAgICAgKiBub2RlLnNldFNjYWxlKGNjLnYzKDIsIDIsIDIpKTsgLy8gZm9yIDNEIG5vZGVcbiAgICAgKiBub2RlLnNldFNjYWxlKDIpO1xuICAgICAqL1xuICAgIHNldFNjYWxlICh4LCB5LCB6KSB7XG4gICAgICAgIGlmICh4ICYmIHR5cGVvZiB4ICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgeSA9IHgueTtcbiAgICAgICAgICAgIHogPSB4LnogPT09IHVuZGVmaW5lZCA/IDEgOiB4Lno7XG4gICAgICAgICAgICB4ID0geC54O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHggIT09IHVuZGVmaW5lZCAmJiB5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHkgPSB4O1xuICAgICAgICAgICAgeiA9IHg7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoeiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB6ID0gMTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdHJzID0gdGhpcy5fdHJzO1xuICAgICAgICBpZiAodHJzWzddICE9PSB4IHx8IHRyc1s4XSAhPT0geSB8fCB0cnNbOV0gIT09IHopIHtcbiAgICAgICAgICAgIHRyc1s3XSA9IHg7XG4gICAgICAgICAgICB0cnNbOF0gPSB5O1xuICAgICAgICAgICAgdHJzWzldID0gejtcbiAgICAgICAgICAgIHRoaXMuc2V0TG9jYWxEaXJ0eShMb2NhbERpcnR5RmxhZy5BTExfU0NBTEUpO1xuICAgICAgICAgICAgIUNDX05BVElWRVJFTkRFUkVSICYmICh0aGlzLl9yZW5kZXJGbGFnIHw9IFJlbmRlckZsb3cuRkxBR19UUkFOU0ZPUk0pO1xuICAgIFxuICAgICAgICAgICAgaWYgKHRoaXMuX2V2ZW50TWFzayAmIFNDQUxFX09OKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KEV2ZW50VHlwZS5TQ0FMRV9DSEFOR0VEKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogR2V0IHJvdGF0aW9uIG9mIG5vZGUgKGluIHF1YXRlcm5pb24pLlxuICAgICAqIE5lZWQgcGFzcyBhIGNjLlF1YXQgYXMgdGhlIGFyZ3VtZW50IHRvIHJlY2VpdmUgdGhlIHJldHVybiB2YWx1ZXMuXG4gICAgICogISN6aFxuICAgICAqIOiOt+WPluivpeiKgueCueeahCBxdWF0ZXJuaW9uIOaXi+i9rOinkuW6pu+8jOmcgOimgeS8oOS4gOS4qiBjYy5RdWF0IOS9nOS4uuWPguaVsOadpeaOpeaUtui/lOWbnuWAvOOAglxuICAgICAqIEBtZXRob2QgZ2V0Um90YXRpb25cbiAgICAgKiBAcGFyYW0ge1F1YXR9IG91dFxuICAgICAqIEByZXR1cm4ge1F1YXR9IFF1YXRlcm5pb24gb2JqZWN0IHJlcHJlc2VudHMgdGhlIHJvdGF0aW9uXG4gICAgICovXG4gICAgZ2V0Um90YXRpb24gKG91dCkge1xuICAgICAgICBpZiAob3V0IGluc3RhbmNlb2YgUXVhdCkge1xuICAgICAgICAgICAgcmV0dXJuIFRycy50b1JvdGF0aW9uKG91dCwgdGhpcy5fdHJzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChDQ19ERUJVRykge1xuICAgICAgICAgICAgICAgIGNjLndhcm4oXCJgY2MuTm9kZS5nZXRSb3RhdGlvbigpYCBpcyBkZXByZWNhdGVkIHNpbmNlIHYyLjEuMCwgcGxlYXNlIHVzZSBgLWNjLk5vZGUuYW5nbGVgIGluc3RlYWQuIChgdGhpcy5ub2RlLmdldFJvdGF0aW9uKClgIC0+IGAtdGhpcy5ub2RlLmFuZ2xlYClcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gLXRoaXMuYW5nbGU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgcm90YXRpb24gb2Ygbm9kZSAoaW4gcXVhdGVybmlvbikuXG4gICAgICogISN6aCDorr7nva7or6XoioLngrnnmoQgcXVhdGVybmlvbiDml4vovazop5LluqbjgIJcbiAgICAgKiBAbWV0aG9kIHNldFJvdGF0aW9uXG4gICAgICogQHBhcmFtIHtjYy5RdWF0fE51bWJlcn0gcXVhdCBRdWF0ZXJuaW9uIG9iamVjdCByZXByZXNlbnRzIHRoZSByb3RhdGlvbiBvciB0aGUgeCB2YWx1ZSBvZiBxdWF0ZXJuaW9uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFt5XSB5IHZhbHVlIG9mIHF1dGVybmlvblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbel0geiB2YWx1ZSBvZiBxdXRlcm5pb25cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3ddIHcgdmFsdWUgb2YgcXV0ZXJuaW9uXG4gICAgICovXG4gICAgc2V0Um90YXRpb24gKHJvdGF0aW9uLCB5LCB6LCB3KSB7XG4gICAgICAgIGlmICh0eXBlb2Ygcm90YXRpb24gPT09ICdudW1iZXInICYmIHkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKENDX0RFQlVHKSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybihcImBjYy5Ob2RlLnNldFJvdGF0aW9uKGRlZ3JlZSlgIGlzIGRlcHJlY2F0ZWQgc2luY2UgdjIuMS4wLCBwbGVhc2Ugc2V0IGAtY2MuTm9kZS5hbmdsZWAgaW5zdGVhZC4gKGB0aGlzLm5vZGUuc2V0Um90YXRpb24oeClgIC0+IGB0aGlzLm5vZGUuYW5nbGUgPSAteGApXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5hbmdsZSA9IC1yb3RhdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCB4ID0gcm90YXRpb247XG4gICAgICAgICAgICBpZiAoeSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgeCA9IHJvdGF0aW9uLng7XG4gICAgICAgICAgICAgICAgeSA9IHJvdGF0aW9uLnk7XG4gICAgICAgICAgICAgICAgeiA9IHJvdGF0aW9uLno7XG4gICAgICAgICAgICAgICAgdyA9IHJvdGF0aW9uLnc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB0cnMgPSB0aGlzLl90cnM7XG4gICAgICAgICAgICBpZiAodHJzWzNdICE9PSB4IHx8IHRyc1s0XSAhPT0geSB8fCB0cnNbNV0gIT09IHogfHwgdHJzWzZdICE9PSB3KSB7XG4gICAgICAgICAgICAgICAgdHJzWzNdID0geDtcbiAgICAgICAgICAgICAgICB0cnNbNF0gPSB5O1xuICAgICAgICAgICAgICAgIHRyc1s1XSA9IHo7XG4gICAgICAgICAgICAgICAgdHJzWzZdID0gdztcbiAgICAgICAgICAgICAgICB0aGlzLnNldExvY2FsRGlydHkoTG9jYWxEaXJ0eUZsYWcuQUxMX1JPVEFUSU9OKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9ldmVudE1hc2sgJiBST1RBVElPTl9PTikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoRXZlbnRUeXBlLlJPVEFUSU9OX0NIQU5HRUQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdG9FdWxlcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmV0dXJucyBhIGNvcHkgdGhlIHVudHJhbnNmb3JtZWQgc2l6ZSBvZiB0aGUgbm9kZS4gPGJyLz5cbiAgICAgKiBUaGUgY29udGVudFNpemUgcmVtYWlucyB0aGUgc2FtZSBubyBtYXR0ZXIgdGhlIG5vZGUgaXMgc2NhbGVkIG9yIHJvdGF0ZWQuPGJyLz5cbiAgICAgKiBBbGwgbm9kZXMgaGFzIGEgc2l6ZS4gTGF5ZXIgYW5kIFNjZW5lIGhhcyB0aGUgc2FtZSBzaXplIG9mIHRoZSBzY3JlZW4gYnkgZGVmYXVsdC4gPGJyLz5cbiAgICAgKiAhI3poIOiOt+WPluiKgueCueiHqui6q+Wkp+Wwj++8jOS4jeWPl+ivpeiKgueCueaYr+WQpuiiq+e8qeaUvuaIluiAheaXi+i9rOeahOW9seWTjeOAglxuICAgICAqIEBtZXRob2QgZ2V0Q29udGVudFNpemVcbiAgICAgKiBAcmV0dXJuIHtTaXplfSBUaGUgdW50cmFuc2Zvcm1lZCBzaXplIG9mIHRoZSBub2RlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogY2MubG9nKFwiQ29udGVudCBTaXplOiBcIiArIG5vZGUuZ2V0Q29udGVudFNpemUoKSk7XG4gICAgICovXG4gICAgZ2V0Q29udGVudFNpemUgKCkge1xuICAgICAgICByZXR1cm4gY2Muc2l6ZSh0aGlzLl9jb250ZW50U2l6ZS53aWR0aCwgdGhpcy5fY29udGVudFNpemUuaGVpZ2h0KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNldHMgdGhlIHVudHJhbnNmb3JtZWQgc2l6ZSBvZiB0aGUgbm9kZS48YnIvPlxuICAgICAqIFRoZSBjb250ZW50U2l6ZSByZW1haW5zIHRoZSBzYW1lIG5vIG1hdHRlciB0aGUgbm9kZSBpcyBzY2FsZWQgb3Igcm90YXRlZC48YnIvPlxuICAgICAqIEFsbCBub2RlcyBoYXMgYSBzaXplLiBMYXllciBhbmQgU2NlbmUgaGFzIHRoZSBzYW1lIHNpemUgb2YgdGhlIHNjcmVlbi5cbiAgICAgKiAhI3poIOiuvue9ruiKgueCueWOn+Wni+Wkp+Wwj++8jOS4jeWPl+ivpeiKgueCueaYr+WQpuiiq+e8qeaUvuaIluiAheaXi+i9rOeahOW9seWTjeOAglxuICAgICAqIEBtZXRob2Qgc2V0Q29udGVudFNpemVcbiAgICAgKiBAcGFyYW0ge1NpemV8TnVtYmVyfSBzaXplIC0gVGhlIHVudHJhbnNmb3JtZWQgc2l6ZSBvZiB0aGUgbm9kZSBvciBUaGUgdW50cmFuc2Zvcm1lZCBzaXplJ3Mgd2lkdGggb2YgdGhlIG5vZGUuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtoZWlnaHRdIC0gVGhlIHVudHJhbnNmb3JtZWQgc2l6ZSdzIGhlaWdodCBvZiB0aGUgbm9kZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIG5vZGUuc2V0Q29udGVudFNpemUoY2Muc2l6ZSgxMDAsIDEwMCkpO1xuICAgICAqIG5vZGUuc2V0Q29udGVudFNpemUoMTAwLCAxMDApO1xuICAgICAqL1xuICAgIHNldENvbnRlbnRTaXplIChzaXplLCBoZWlnaHQpIHtcbiAgICAgICAgdmFyIGxvY0NvbnRlbnRTaXplID0gdGhpcy5fY29udGVudFNpemU7XG4gICAgICAgIHZhciBjbG9uZTtcbiAgICAgICAgaWYgKGhlaWdodCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoKHNpemUud2lkdGggPT09IGxvY0NvbnRlbnRTaXplLndpZHRoKSAmJiAoc2l6ZS5oZWlnaHQgPT09IGxvY0NvbnRlbnRTaXplLmhlaWdodCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgIGNsb25lID0gY2Muc2l6ZShsb2NDb250ZW50U2l6ZS53aWR0aCwgbG9jQ29udGVudFNpemUuaGVpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxvY0NvbnRlbnRTaXplLndpZHRoID0gc2l6ZS53aWR0aDtcbiAgICAgICAgICAgIGxvY0NvbnRlbnRTaXplLmhlaWdodCA9IHNpemUuaGVpZ2h0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKChzaXplID09PSBsb2NDb250ZW50U2l6ZS53aWR0aCkgJiYgKGhlaWdodCA9PT0gbG9jQ29udGVudFNpemUuaGVpZ2h0KSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgY2xvbmUgPSBjYy5zaXplKGxvY0NvbnRlbnRTaXplLndpZHRoLCBsb2NDb250ZW50U2l6ZS5oZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbG9jQ29udGVudFNpemUud2lkdGggPSBzaXplO1xuICAgICAgICAgICAgbG9jQ29udGVudFNpemUuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9ldmVudE1hc2sgJiBTSVpFX09OKSB7XG4gICAgICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KEV2ZW50VHlwZS5TSVpFX0NIQU5HRUQsIGNsb25lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChFdmVudFR5cGUuU0laRV9DSEFOR0VEKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmV0dXJucyBhIGNvcHkgb2YgdGhlIGFuY2hvciBwb2ludC48YnIvPlxuICAgICAqIEFuY2hvciBwb2ludCBpcyB0aGUgcG9pbnQgYXJvdW5kIHdoaWNoIGFsbCB0cmFuc2Zvcm1hdGlvbnMgYW5kIHBvc2l0aW9uaW5nIG1hbmlwdWxhdGlvbnMgdGFrZSBwbGFjZS48YnIvPlxuICAgICAqIEl0J3MgbGlrZSBhIHBpbiBpbiB0aGUgbm9kZSB3aGVyZSBpdCBpcyBcImF0dGFjaGVkXCIgdG8gaXRzIHBhcmVudC4gPGJyLz5cbiAgICAgKiBUaGUgYW5jaG9yUG9pbnQgaXMgbm9ybWFsaXplZCwgbGlrZSBhIHBlcmNlbnRhZ2UuICgwLDApIG1lYW5zIHRoZSBib3R0b20tbGVmdCBjb3JuZXIgYW5kICgxLDEpIG1lYW5zIHRoZSB0b3AtcmlnaHQgY29ybmVyLiA8YnIvPlxuICAgICAqIEJ1dCB5b3UgY2FuIHVzZSB2YWx1ZXMgaGlnaGVyIHRoYW4gKDEsMSkgYW5kIGxvd2VyIHRoYW4gKDAsMCkgdG9vLiAgPGJyLz5cbiAgICAgKiBUaGUgZGVmYXVsdCBhbmNob3IgcG9pbnQgaXMgKDAuNSwwLjUpLCBzbyBpdCBzdGFydHMgYXQgdGhlIGNlbnRlciBvZiB0aGUgbm9kZS5cbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W6IqC54K56ZSa54K577yM55So55m+5YiG5q+U6KGo56S644CCPGJyLz5cbiAgICAgKiDplJrngrnlupTnlKjkuo7miYDmnInlj5jmjaLlkozlnZDmoIfngrnnmoTmk43kvZzvvIzlroPlsLHlg4/lnKjoioLngrnkuIrov57mjqXlhbbniLboioLngrnnmoTlpKflpLTpkojjgII8YnIvPlxuICAgICAqIOmUmueCueaYr+agh+WHhuWMlueahO+8jOWwseWDj+eZvuWIhuavlOS4gOagt+OAgigw77yMMCkg6KGo56S65bem5LiL6KeS77yMKDHvvIwxKSDooajnpLrlj7PkuIrop5LjgII8YnIvPlxuICAgICAqIOS9huaYr+S9oOWPr+S7peS9v+eUqOavlO+8iDHvvIwx77yJ5pu06auY55qE5YC85oiW6ICF5q+U77yIMO+8jDDvvInmm7TkvY7nmoTlgLzjgII8YnIvPlxuICAgICAqIOm7mOiupOeahOmUmueCueaYr++8iDAuNe+8jDAuNe+8ie+8jOWboOatpOWug+W8gOWni+S6juiKgueCueeahOS4reW/g+S9jee9ruOAgjxici8+XG4gICAgICog5rOo5oSP77yaQ3JlYXRvciDkuK3nmoTplJrngrnku4XnlKjkuo7lrprkvY3miYDlnKjnmoToioLngrnvvIzlrZDoioLngrnnmoTlrprkvY3kuI3lj5flvbHlk43jgIJcbiAgICAgKiBAbWV0aG9kIGdldEFuY2hvclBvaW50XG4gICAgICogQHJldHVybiB7VmVjMn0gVGhlIGFuY2hvciBwb2ludCBvZiBub2RlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogY2MubG9nKFwiTm9kZSBBbmNob3JQb2ludDogXCIgKyBub2RlLmdldEFuY2hvclBvaW50KCkpO1xuICAgICAqL1xuICAgIGdldEFuY2hvclBvaW50ICgpIHtcbiAgICAgICAgcmV0dXJuIGNjLnYyKHRoaXMuX2FuY2hvclBvaW50KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNldHMgdGhlIGFuY2hvciBwb2ludCBpbiBwZXJjZW50LiA8YnIvPlxuICAgICAqIGFuY2hvciBwb2ludCBpcyB0aGUgcG9pbnQgYXJvdW5kIHdoaWNoIGFsbCB0cmFuc2Zvcm1hdGlvbnMgYW5kIHBvc2l0aW9uaW5nIG1hbmlwdWxhdGlvbnMgdGFrZSBwbGFjZS4gPGJyLz5cbiAgICAgKiBJdCdzIGxpa2UgYSBwaW4gaW4gdGhlIG5vZGUgd2hlcmUgaXQgaXMgXCJhdHRhY2hlZFwiIHRvIGl0cyBwYXJlbnQuIDxici8+XG4gICAgICogVGhlIGFuY2hvclBvaW50IGlzIG5vcm1hbGl6ZWQsIGxpa2UgYSBwZXJjZW50YWdlLiAoMCwwKSBtZWFucyB0aGUgYm90dG9tLWxlZnQgY29ybmVyIGFuZCAoMSwxKSBtZWFucyB0aGUgdG9wLXJpZ2h0IGNvcm5lci48YnIvPlxuICAgICAqIEJ1dCB5b3UgY2FuIHVzZSB2YWx1ZXMgaGlnaGVyIHRoYW4gKDEsMSkgYW5kIGxvd2VyIHRoYW4gKDAsMCkgdG9vLjxici8+XG4gICAgICogVGhlIGRlZmF1bHQgYW5jaG9yIHBvaW50IGlzICgwLjUsMC41KSwgc28gaXQgc3RhcnRzIGF0IHRoZSBjZW50ZXIgb2YgdGhlIG5vZGUuXG4gICAgICogISN6aFxuICAgICAqIOiuvue9rumUmueCueeahOeZvuWIhuavlOOAgjxici8+XG4gICAgICog6ZSa54K55bqU55So5LqO5omA5pyJ5Y+Y5o2i5ZKM5Z2Q5qCH54K555qE5pON5L2c77yM5a6D5bCx5YOP5Zyo6IqC54K55LiK6L+e5o6l5YW254i26IqC54K555qE5aSn5aS06ZKI44CCPGJyLz5cbiAgICAgKiDplJrngrnmmK/moIflh4bljJbnmoTvvIzlsLHlg4/nmb7liIbmr5TkuIDmoLfjgIIoMO+8jDApIOihqOekuuW3puS4i+inku+8jCgx77yMMSkg6KGo56S65Y+z5LiK6KeS44CCPGJyLz5cbiAgICAgKiDkvYbmmK/kvaDlj6/ku6Xkvb/nlKjmr5TvvIgx77yMMe+8ieabtOmrmOeahOWAvOaIluiAheavlO+8iDDvvIww77yJ5pu05L2O55qE5YC844CCPGJyLz5cbiAgICAgKiDpu5jorqTnmoTplJrngrnmmK/vvIgwLjXvvIwwLjXvvInvvIzlm6DmraTlroPlvIDlp4vkuo7oioLngrnnmoTkuK3lv4PkvY3nva7jgII8YnIvPlxuICAgICAqIOazqOaEj++8mkNyZWF0b3Ig5Lit55qE6ZSa54K55LuF55So5LqO5a6a5L2N5omA5Zyo55qE6IqC54K577yM5a2Q6IqC54K555qE5a6a5L2N5LiN5Y+X5b2x5ZON44CCXG4gICAgICogQG1ldGhvZCBzZXRBbmNob3JQb2ludFxuICAgICAqIEBwYXJhbSB7VmVjMnxOdW1iZXJ9IHBvaW50IC0gVGhlIGFuY2hvciBwb2ludCBvZiBub2RlIG9yIFRoZSB4IGF4aXMgYW5jaG9yIG9mIG5vZGUuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFt5XSAtIFRoZSB5IGF4aXMgYW5jaG9yIG9mIG5vZGUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBub2RlLnNldEFuY2hvclBvaW50KGNjLnYyKDEsIDEpKTtcbiAgICAgKiBub2RlLnNldEFuY2hvclBvaW50KDEsIDEpO1xuICAgICAqL1xuICAgIHNldEFuY2hvclBvaW50IChwb2ludCwgeSkge1xuICAgICAgICB2YXIgbG9jQW5jaG9yUG9pbnQgPSB0aGlzLl9hbmNob3JQb2ludDtcbiAgICAgICAgaWYgKHkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKChwb2ludC54ID09PSBsb2NBbmNob3JQb2ludC54KSAmJiAocG9pbnQueSA9PT0gbG9jQW5jaG9yUG9pbnQueSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgbG9jQW5jaG9yUG9pbnQueCA9IHBvaW50Lng7XG4gICAgICAgICAgICBsb2NBbmNob3JQb2ludC55ID0gcG9pbnQueTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICgocG9pbnQgPT09IGxvY0FuY2hvclBvaW50LngpICYmICh5ID09PSBsb2NBbmNob3JQb2ludC55KSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBsb2NBbmNob3JQb2ludC54ID0gcG9pbnQ7XG4gICAgICAgICAgICBsb2NBbmNob3JQb2ludC55ID0geTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldExvY2FsRGlydHkoTG9jYWxEaXJ0eUZsYWcuQUxMX1BPU0lUSU9OKTtcbiAgICAgICAgaWYgKHRoaXMuX2V2ZW50TWFzayAmIEFOQ0hPUl9PTikge1xuICAgICAgICAgICAgdGhpcy5lbWl0KEV2ZW50VHlwZS5BTkNIT1JfQ0hBTkdFRCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBUcmFuc2Zvcm1zIHBvc2l0aW9uIGZyb20gd29ybGQgc3BhY2UgdG8gbG9jYWwgc3BhY2UuXG4gICAgICogQG1ldGhvZCBfaW52VHJhbnNmb3JtUG9pbnRcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IG91dFxuICAgICAqIEBwYXJhbSB7VmVjM30gdmVjM1xuICAgICAqL1xuICAgIF9pbnZUcmFuc2Zvcm1Qb2ludCAob3V0LCBwb3MpIHtcbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudCkge1xuICAgICAgICAgICAgdGhpcy5fcGFyZW50Ll9pbnZUcmFuc2Zvcm1Qb2ludChvdXQsIHBvcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBWZWMzLmNvcHkob3V0LCBwb3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGx0cnMgPSB0aGlzLl90cnM7XG4gICAgICAgIC8vIG91dCA9IHBhcmVudF9pbnZfcG9zIC0gcG9zXG4gICAgICAgIFRycy50b1Bvc2l0aW9uKF90cFZlYzNhLCBsdHJzKTtcbiAgICAgICAgVmVjMy5zdWIob3V0LCBvdXQsIF90cFZlYzNhKTtcblxuICAgICAgICAvLyBvdXQgPSBpbnYocm90KSAqIG91dFxuICAgICAgICBUcnMudG9Sb3RhdGlvbihfdHBRdWF0YSwgbHRycyk7XG4gICAgICAgIFF1YXQuY29uanVnYXRlKF90cFF1YXRiLCBfdHBRdWF0YSk7XG4gICAgICAgIFZlYzMudHJhbnNmb3JtUXVhdChvdXQsIG91dCwgX3RwUXVhdGIpO1xuXG4gICAgICAgIC8vIG91dCA9ICgxL3NjYWxlKSAqIG91dFxuICAgICAgICBUcnMudG9TY2FsZShfdHBWZWMzYSwgbHRycyk7XG4gICAgICAgIFZlYzMuaW52ZXJzZVNhZmUoX3RwVmVjM2IsIF90cFZlYzNhKTtcbiAgICAgICAgVmVjMy5tdWwob3V0LCBvdXQsIF90cFZlYzNiKTtcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0sXG4gICAgXG4gICAgLypcbiAgICAgKiBDYWxjdWxhdGUgYW5kIHJldHVybiB3b3JsZCBwb3NpdGlvbi5cbiAgICAgKiBUaGlzIGlzIG5vdCBhIHB1YmxpYyBBUEkgeWV0LCBpdHMgdXNhZ2UgY291bGQgYmUgdXBkYXRlZFxuICAgICAqIEBtZXRob2QgZ2V0V29ybGRQb3NpdGlvblxuICAgICAqIEBwYXJhbSB7VmVjM30gb3V0XG4gICAgICogQHJldHVybiB7VmVjM31cbiAgICAgKi9cbiAgICBnZXRXb3JsZFBvc2l0aW9uIChvdXQpIHtcbiAgICAgICAgVHJzLnRvUG9zaXRpb24ob3V0LCB0aGlzLl90cnMpO1xuICAgICAgICBsZXQgY3VyciA9IHRoaXMuX3BhcmVudDtcbiAgICAgICAgbGV0IGx0cnM7XG4gICAgICAgIHdoaWxlIChjdXJyKSB7XG4gICAgICAgICAgICBsdHJzID0gY3Vyci5fdHJzO1xuICAgICAgICAgICAgLy8gb3V0ID0gcGFyZW50X3NjYWxlICogcG9zXG4gICAgICAgICAgICBUcnMudG9TY2FsZShfZ3dwVmVjMywgbHRycyk7XG4gICAgICAgICAgICBWZWMzLm11bChvdXQsIG91dCwgX2d3cFZlYzMpO1xuICAgICAgICAgICAgLy8gb3V0ID0gcGFyZW50X3F1YXQgKiBvdXRcbiAgICAgICAgICAgIFRycy50b1JvdGF0aW9uKF9nd3BRdWF0LCBsdHJzKTtcbiAgICAgICAgICAgIFZlYzMudHJhbnNmb3JtUXVhdChvdXQsIG91dCwgX2d3cFF1YXQpO1xuICAgICAgICAgICAgLy8gb3V0ID0gb3V0ICsgcG9zXG4gICAgICAgICAgICBUcnMudG9Qb3NpdGlvbihfZ3dwVmVjMywgbHRycyk7XG4gICAgICAgICAgICBWZWMzLmFkZChvdXQsIG91dCwgX2d3cFZlYzMpO1xuICAgICAgICAgICAgY3VyciA9IGN1cnIuX3BhcmVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIFNldCB3b3JsZCBwb3NpdGlvbi5cbiAgICAgKiBUaGlzIGlzIG5vdCBhIHB1YmxpYyBBUEkgeWV0LCBpdHMgdXNhZ2UgY291bGQgYmUgdXBkYXRlZFxuICAgICAqIEBtZXRob2Qgc2V0V29ybGRQb3NpdGlvblxuICAgICAqIEBwYXJhbSB7VmVjM30gcG9zXG4gICAgICovXG4gICAgc2V0V29ybGRQb3NpdGlvbiAocG9zKSB7XG4gICAgICAgIGxldCBsdHJzID0gdGhpcy5fdHJzO1xuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICB2YXIgb2xkUG9zaXRpb24gPSBuZXcgY2MuVmVjMyhsdHJzWzBdLCBsdHJzWzFdLCBsdHJzWzJdKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBOT1RFOiB0aGlzIGlzIGZhc3RlciB0aGFuIGludmVydCB3b3JsZCBtYXRyaXggYW5kIHRyYW5zZm9ybSB0aGUgcG9pbnRcbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudCkge1xuICAgICAgICAgICAgdGhpcy5fcGFyZW50Ll9pbnZUcmFuc2Zvcm1Qb2ludChfc3dwVmVjMywgcG9zKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIFZlYzMuY29weShfc3dwVmVjMywgcG9zKTtcbiAgICAgICAgfVxuICAgICAgICBUcnMuZnJvbVBvc2l0aW9uKGx0cnMsIF9zd3BWZWMzKTtcbiAgICAgICAgdGhpcy5zZXRMb2NhbERpcnR5KExvY2FsRGlydHlGbGFnLkFMTF9QT1NJVElPTik7XG5cbiAgICAgICAgLy8gZmFzdCBjaGVjayBldmVudFxuICAgICAgICBpZiAodGhpcy5fZXZlbnRNYXNrICYgUE9TSVRJT05fT04pIHtcbiAgICAgICAgICAgIC8vIHNlbmQgZXZlbnRcbiAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoRXZlbnRUeXBlLlBPU0lUSU9OX0NIQU5HRUQsIG9sZFBvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChFdmVudFR5cGUuUE9TSVRJT05fQ0hBTkdFRCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBDYWxjdWxhdGUgYW5kIHJldHVybiB3b3JsZCByb3RhdGlvblxuICAgICAqIFRoaXMgaXMgbm90IGEgcHVibGljIEFQSSB5ZXQsIGl0cyB1c2FnZSBjb3VsZCBiZSB1cGRhdGVkXG4gICAgICogQG1ldGhvZCBnZXRXb3JsZFJvdGF0aW9uXG4gICAgICogQHBhcmFtIHtRdWF0fSBvdXRcbiAgICAgKiBAcmV0dXJuIHtRdWF0fVxuICAgICAqL1xuICAgIGdldFdvcmxkUm90YXRpb24gKG91dCkge1xuICAgICAgICBUcnMudG9Sb3RhdGlvbihfZ3dyUXVhdCwgdGhpcy5fdHJzKTtcbiAgICAgICAgUXVhdC5jb3B5KG91dCwgX2d3clF1YXQpO1xuICAgICAgICBsZXQgY3VyciA9IHRoaXMuX3BhcmVudDtcbiAgICAgICAgd2hpbGUgKGN1cnIpIHtcbiAgICAgICAgICAgIFRycy50b1JvdGF0aW9uKF9nd3JRdWF0LCBjdXJyLl90cnMpO1xuICAgICAgICAgICAgUXVhdC5tdWwob3V0LCBfZ3dyUXVhdCwgb3V0KTtcbiAgICAgICAgICAgIGN1cnIgPSBjdXJyLl9wYXJlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBTZXQgd29ybGQgcm90YXRpb24gd2l0aCBxdWF0ZXJuaW9uXG4gICAgICogVGhpcyBpcyBub3QgYSBwdWJsaWMgQVBJIHlldCwgaXRzIHVzYWdlIGNvdWxkIGJlIHVwZGF0ZWRcbiAgICAgKiBAbWV0aG9kIHNldFdvcmxkUm90YXRpb25cbiAgICAgKiBAcGFyYW0ge1F1YXR9IHZhbFxuICAgICAqL1xuICAgIHNldFdvcmxkUm90YXRpb24gKHZhbCkge1xuICAgICAgICBpZiAodGhpcy5fcGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQuZ2V0V29ybGRSb3RhdGlvbihfc3dyUXVhdCk7XG4gICAgICAgICAgICBRdWF0LmNvbmp1Z2F0ZShfc3dyUXVhdCwgX3N3clF1YXQpO1xuICAgICAgICAgICAgUXVhdC5tdWwoX3N3clF1YXQsIF9zd3JRdWF0LCB2YWwpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgUXVhdC5jb3B5KF9zd3JRdWF0LCB2YWwpO1xuICAgICAgICB9XG4gICAgICAgIFRycy5mcm9tUm90YXRpb24odGhpcy5fdHJzLCBfc3dyUXVhdCk7XG4gICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHRoaXMuX3RvRXVsZXIoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldExvY2FsRGlydHkoTG9jYWxEaXJ0eUZsYWcuQUxMX1JPVEFUSU9OKTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBDYWxjdWxhdGUgYW5kIHJldHVybiB3b3JsZCBzY2FsZVxuICAgICAqIFRoaXMgaXMgbm90IGEgcHVibGljIEFQSSB5ZXQsIGl0cyB1c2FnZSBjb3VsZCBiZSB1cGRhdGVkXG4gICAgICogQG1ldGhvZCBnZXRXb3JsZFNjYWxlXG4gICAgICogQHBhcmFtIHtWZWMzfSBvdXRcbiAgICAgKiBAcmV0dXJuIHtWZWMzfVxuICAgICAqL1xuICAgIGdldFdvcmxkU2NhbGUgKG91dCkge1xuICAgICAgICBUcnMudG9TY2FsZShfZ3dzVmVjMywgdGhpcy5fdHJzKTtcbiAgICAgICAgVmVjMy5jb3B5KG91dCwgX2d3c1ZlYzMpO1xuICAgICAgICBsZXQgY3VyciA9IHRoaXMuX3BhcmVudDtcbiAgICAgICAgd2hpbGUgKGN1cnIpIHtcbiAgICAgICAgICAgIFRycy50b1NjYWxlKF9nd3NWZWMzLCBjdXJyLl90cnMpO1xuICAgICAgICAgICAgVmVjMy5tdWwob3V0LCBvdXQsIF9nd3NWZWMzKTtcbiAgICAgICAgICAgIGN1cnIgPSBjdXJyLl9wYXJlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBTZXQgd29ybGQgc2NhbGUgd2l0aCB2ZWMzXG4gICAgICogVGhpcyBpcyBub3QgYSBwdWJsaWMgQVBJIHlldCwgaXRzIHVzYWdlIGNvdWxkIGJlIHVwZGF0ZWRcbiAgICAgKiBAbWV0aG9kIHNldFdvcmxkU2NhbGVcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IHNjYWxlXG4gICAgICovXG4gICAgc2V0V29ybGRTY2FsZSAoc2NhbGUpIHtcbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudCkge1xuICAgICAgICAgICAgdGhpcy5fcGFyZW50LmdldFdvcmxkU2NhbGUoX3N3c1ZlYzMpO1xuICAgICAgICAgICAgVmVjMy5kaXYoX3N3c1ZlYzMsIHNjYWxlLCBfc3dzVmVjMyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBWZWMzLmNvcHkoX3N3c1ZlYzMsIHNjYWxlKTtcbiAgICAgICAgfVxuICAgICAgICBUcnMuZnJvbVNjYWxlKHRoaXMuX3RycywgX3N3c1ZlYzMpO1xuICAgICAgICB0aGlzLnNldExvY2FsRGlydHkoTG9jYWxEaXJ0eUZsYWcuQUxMX1NDQUxFKTtcbiAgICB9LFxuXG4gICAgZ2V0V29ybGRSVCAob3V0KSB7XG4gICAgICAgIGxldCBvcG9zID0gX2d3cnRWZWMzYTtcbiAgICAgICAgbGV0IG9yb3QgPSBfZ3dydFF1YXRhO1xuICAgICAgICBsZXQgbHRycyA9IHRoaXMuX3RycztcbiAgICAgICAgVHJzLnRvUG9zaXRpb24ob3BvcywgbHRycyk7XG4gICAgICAgIFRycy50b1JvdGF0aW9uKG9yb3QsIGx0cnMpO1xuXG4gICAgICAgIGxldCBjdXJyID0gdGhpcy5fcGFyZW50O1xuICAgICAgICB3aGlsZSAoY3Vycikge1xuICAgICAgICAgICAgbHRycyA9IGN1cnIuX3RycztcbiAgICAgICAgICAgIC8vIG9wb3MgPSBwYXJlbnRfbHNjYWxlICogbHBvc1xuICAgICAgICAgICAgVHJzLnRvU2NhbGUoX2d3cnRWZWMzYiwgbHRycyk7XG4gICAgICAgICAgICBWZWMzLm11bChvcG9zLCBvcG9zLCBfZ3dydFZlYzNiKTtcbiAgICAgICAgICAgIC8vIG9wb3MgPSBwYXJlbnRfbHJvdCAqIG9wb3NcbiAgICAgICAgICAgIFRycy50b1JvdGF0aW9uKF9nd3J0UXVhdGIsIGx0cnMpO1xuICAgICAgICAgICAgVmVjMy50cmFuc2Zvcm1RdWF0KG9wb3MsIG9wb3MsIF9nd3J0UXVhdGIpO1xuICAgICAgICAgICAgLy8gb3BvcyA9IG9wb3MgKyBscG9zXG4gICAgICAgICAgICBUcnMudG9Qb3NpdGlvbihfZ3dydFZlYzNiLCBsdHJzKTtcbiAgICAgICAgICAgIFZlYzMuYWRkKG9wb3MsIG9wb3MsIF9nd3J0VmVjM2IpO1xuICAgICAgICAgICAgLy8gb3JvdCA9IGxyb3QgKiBvcm90XG4gICAgICAgICAgICBRdWF0Lm11bChvcm90LCBfZ3dydFF1YXRiLCBvcm90KTtcbiAgICAgICAgICAgIGN1cnIgPSBjdXJyLl9wYXJlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgTWF0NC5mcm9tUlQob3V0LCBvcm90LCBvcG9zKTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgcm90YXRpb24gYnkgbG9va0F0IHRhcmdldCBwb2ludCwgbm9ybWFsbHkgdXNlZCBieSBDYW1lcmEgTm9kZVxuICAgICAqICEjemgg6YCa6L+H6KeC5a+f55uu5qCH5p2l6K6+572uIHJvdGF0aW9u77yM5LiA6Iis55So5LqOIENhbWVyYSBOb2RlIOS4ilxuICAgICAqIEBtZXRob2QgbG9va0F0XG4gICAgICogQHBhcmFtIHtWZWMzfSBwb3NcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IFt1cF0gLSBkZWZhdWx0IGlzICgwLDEsMClcbiAgICAgKi9cbiAgICBsb29rQXQgKHBvcywgdXApIHtcbiAgICAgICAgdGhpcy5nZXRXb3JsZFBvc2l0aW9uKF9sYVZlYzMpO1xuICAgICAgICBWZWMzLnN1YihfbGFWZWMzLCBfbGFWZWMzLCBwb3MpOyAvLyBOT1RFOiB3ZSB1c2UgLXogZm9yIHZpZXctZGlyXG4gICAgICAgIFZlYzMubm9ybWFsaXplKF9sYVZlYzMsIF9sYVZlYzMpO1xuICAgICAgICBRdWF0LmZyb21WaWV3VXAoX2xhUXVhdCwgX2xhVmVjMywgdXApO1xuICAgIFxuICAgICAgICB0aGlzLnNldFdvcmxkUm90YXRpb24oX2xhUXVhdCk7XG4gICAgfSxcblxuICAgIF91cGRhdGVMb2NhbE1hdHJpeDogdXBkYXRlTG9jYWxNYXRyaXgyRCxcblxuICAgIF9jYWxjdWxXb3JsZE1hdHJpeCAoKSB7XG4gICAgICAgIC8vIEF2b2lkIGFzIG11Y2ggZnVuY3Rpb24gY2FsbCBhcyBwb3NzaWJsZVxuICAgICAgICBpZiAodGhpcy5fbG9jYWxNYXREaXJ0eSAmIExvY2FsRGlydHlGbGFnLlRSU1MpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUxvY2FsTWF0cml4KCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIEFzc3VtZSBwYXJlbnQgd29ybGQgbWF0cml4IGlzIGNvcnJlY3RcbiAgICAgICAgbGV0IHBhcmVudCA9IHRoaXMuX3BhcmVudDtcbiAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgICAgdGhpcy5fbXVsTWF0KHRoaXMuX3dvcmxkTWF0cml4LCBwYXJlbnQuX3dvcmxkTWF0cml4LCB0aGlzLl9tYXRyaXgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgTWF0NC5jb3B5KHRoaXMuX3dvcmxkTWF0cml4LCB0aGlzLl9tYXRyaXgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3dvcmxkTWF0RGlydHkgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgX211bE1hdDogbXVsTWF0MkQsXG5cbiAgICBfdXBkYXRlV29ybGRNYXRyaXggKCkge1xuICAgICAgICBpZiAodGhpcy5fcGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVdvcmxkTWF0cml4KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX3dvcmxkTWF0RGlydHkpIHtcbiAgICAgICAgICAgIHRoaXMuX2NhbGN1bFdvcmxkTWF0cml4KCk7XG4gICAgICAgICAgICAvLyBTeW5jIGRpcnR5IHRvIGNoaWxkcmVuXG4gICAgICAgICAgICBsZXQgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbjtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW5baV0uX3dvcmxkTWF0RGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHNldExvY2FsRGlydHkgKGZsYWcpIHtcbiAgICAgICAgdGhpcy5fbG9jYWxNYXREaXJ0eSB8PSBmbGFnO1xuICAgICAgICB0aGlzLl93b3JsZE1hdERpcnR5ID0gdHJ1ZTtcblxuICAgICAgICBpZiAoZmxhZyA9PT0gTG9jYWxEaXJ0eUZsYWcuQUxMX1BPU0lUSU9OIHx8IGZsYWcgPT09IExvY2FsRGlydHlGbGFnLlBPU0lUSU9OKSB7XG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJGbGFnIHw9IFJlbmRlckZsb3cuRkxBR19XT1JMRF9UUkFOU0ZPUk07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJGbGFnIHw9IFJlbmRlckZsb3cuRkxBR19UUkFOU0ZPUk07XG4gICAgICAgIH0gICAgICAgIFxuICAgIH0sXG5cbiAgICBzZXRXb3JsZERpcnR5ICgpIHtcbiAgICAgICAgdGhpcy5fd29ybGRNYXREaXJ0eSA9IHRydWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXQgdGhlIGxvY2FsIHRyYW5zZm9ybSBtYXRyaXggKDR4NCksIGJhc2VkIG9uIHBhcmVudCBub2RlIGNvb3JkaW5hdGVzXG4gICAgICogISN6aCDov5Tlm57lsYDpg6jnqbrpl7TlnZDmoIfns7vnmoTnn6npmLXvvIzln7rkuo7niLboioLngrnlnZDmoIfns7vjgIJcbiAgICAgKiBAbWV0aG9kIGdldExvY2FsTWF0cml4XG4gICAgICogQHBhcmFtIHtNYXQ0fSBvdXQgVGhlIG1hdHJpeCBvYmplY3QgdG8gYmUgZmlsbGVkIHdpdGggZGF0YVxuICAgICAqIEByZXR1cm4ge01hdDR9IFNhbWUgYXMgdGhlIG91dCBtYXRyaXggb2JqZWN0XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBsZXQgbWF0NCA9IGNjLm1hdDQoKTtcbiAgICAgKiBub2RlLmdldExvY2FsTWF0cml4KG1hdDQpO1xuICAgICAqL1xuICAgIGdldExvY2FsTWF0cml4IChvdXQpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlTG9jYWxNYXRyaXgoKTtcbiAgICAgICAgcmV0dXJuIE1hdDQuY29weShvdXQsIHRoaXMuX21hdHJpeCk7XG4gICAgfSxcbiAgICBcbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogR2V0IHRoZSB3b3JsZCB0cmFuc2Zvcm0gbWF0cml4ICg0eDQpXG4gICAgICogISN6aCDov5Tlm57kuJbnlYznqbrpl7TlnZDmoIfns7vnmoTnn6npmLXjgIJcbiAgICAgKiBAbWV0aG9kIGdldFdvcmxkTWF0cml4XG4gICAgICogQHBhcmFtIHtNYXQ0fSBvdXQgVGhlIG1hdHJpeCBvYmplY3QgdG8gYmUgZmlsbGVkIHdpdGggZGF0YVxuICAgICAqIEByZXR1cm4ge01hdDR9IFNhbWUgYXMgdGhlIG91dCBtYXRyaXggb2JqZWN0XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBsZXQgbWF0NCA9IGNjLm1hdDQoKTtcbiAgICAgKiBub2RlLmdldFdvcmxkTWF0cml4KG1hdDQpO1xuICAgICAqL1xuICAgIGdldFdvcmxkTWF0cml4IChvdXQpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlV29ybGRNYXRyaXgoKTtcbiAgICAgICAgcmV0dXJuIE1hdDQuY29weShvdXQsIHRoaXMuX3dvcmxkTWF0cml4KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIENvbnZlcnRzIGEgUG9pbnQgdG8gbm9kZSAobG9jYWwpIHNwYWNlIGNvb3JkaW5hdGVzLlxuICAgICAqICEjemhcbiAgICAgKiDlsIbkuIDkuKrngrnovazmjaLliLDoioLngrkgKOWxgOmDqCkg56m66Ze05Z2Q5qCH57O744CCXG4gICAgICogQG1ldGhvZCBjb252ZXJ0VG9Ob2RlU3BhY2VBUlxuICAgICAqIEBwYXJhbSB7VmVjM3xWZWMyfSB3b3JsZFBvaW50XG4gICAgICogQHBhcmFtIHtWZWMzfFZlYzJ9IFtvdXRdXG4gICAgICogQHJldHVybiB7VmVjM3xWZWMyfVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogY29udmVydFRvTm9kZVNwYWNlQVI8VCBleHRlbmRzIGNjLlZlYzIgfCBjYy5WZWMzPih3b3JsZFBvaW50OiBULCBvdXQ/OiBUKTogVFxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIG5ld1ZlYzIgPSBub2RlLmNvbnZlcnRUb05vZGVTcGFjZUFSKGNjLnYyKDEwMCwgMTAwKSk7XG4gICAgICogdmFyIG5ld1ZlYzMgPSBub2RlLmNvbnZlcnRUb05vZGVTcGFjZUFSKGNjLnYzKDEwMCwgMTAwLCAxMDApKTtcbiAgICAgKi9cbiAgICBjb252ZXJ0VG9Ob2RlU3BhY2VBUiAod29ybGRQb2ludCwgb3V0KSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVdvcmxkTWF0cml4KCk7XG4gICAgICAgIE1hdDQuaW52ZXJ0KF9tYXQ0X3RlbXAsIHRoaXMuX3dvcmxkTWF0cml4KTtcblxuICAgICAgICBpZiAod29ybGRQb2ludCBpbnN0YW5jZW9mIGNjLlZlYzIpIHtcbiAgICAgICAgICAgIG91dCA9IG91dCB8fCBuZXcgY2MuVmVjMigpO1xuICAgICAgICAgICAgcmV0dXJuIFZlYzIudHJhbnNmb3JtTWF0NChvdXQsIHdvcmxkUG9pbnQsIF9tYXQ0X3RlbXApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBjYy5WZWMzKCk7XG4gICAgICAgICAgICByZXR1cm4gVmVjMy50cmFuc2Zvcm1NYXQ0KG91dCwgd29ybGRQb2ludCwgX21hdDRfdGVtcCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIENvbnZlcnRzIGEgUG9pbnQgaW4gbm9kZSBjb29yZGluYXRlcyB0byB3b3JsZCBzcGFjZSBjb29yZGluYXRlcy5cbiAgICAgKiAhI3poXG4gICAgICog5bCG6IqC54K55Z2Q5qCH57O75LiL55qE5LiA5Liq54K56L2s5o2i5Yiw5LiW55WM56m66Ze05Z2Q5qCH57O744CCXG4gICAgICogQG1ldGhvZCBjb252ZXJ0VG9Xb3JsZFNwYWNlQVJcbiAgICAgKiBAcGFyYW0ge1ZlYzN8VmVjMn0gbm9kZVBvaW50XG4gICAgICogQHBhcmFtIHtWZWMzfFZlYzJ9IFtvdXRdXG4gICAgICogQHJldHVybiB7VmVjM3xWZWMyfVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogY29udmVydFRvV29ybGRTcGFjZUFSPFQgZXh0ZW5kcyBjYy5WZWMyIHwgY2MuVmVjMz4obm9kZVBvaW50OiBULCBvdXQ/OiBUKTogVFxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIG5ld1ZlYzIgPSBub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUihjYy52MigxMDAsIDEwMCkpO1xuICAgICAqIHZhciBuZXdWZWMzID0gbm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIoY2MudjMoMTAwLCAxMDAsIDEwMCkpO1xuICAgICAqL1xuICAgIGNvbnZlcnRUb1dvcmxkU3BhY2VBUiAobm9kZVBvaW50LCBvdXQpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlV29ybGRNYXRyaXgoKTtcbiAgICAgICAgaWYgKG5vZGVQb2ludCBpbnN0YW5jZW9mIGNjLlZlYzIpIHtcbiAgICAgICAgICAgIG91dCA9IG91dCB8fCBuZXcgY2MuVmVjMigpO1xuICAgICAgICAgICAgcmV0dXJuIFZlYzIudHJhbnNmb3JtTWF0NChvdXQsIG5vZGVQb2ludCwgdGhpcy5fd29ybGRNYXRyaXgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBjYy5WZWMzKCk7XG4gICAgICAgICAgICByZXR1cm4gVmVjMy50cmFuc2Zvcm1NYXQ0KG91dCwgbm9kZVBvaW50LCB0aGlzLl93b3JsZE1hdHJpeCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4vLyBPTEQgVFJBTlNGT1JNIEFDQ0VTUyBBUElzXG4gLyoqXG4gICAgICogISNlbiBDb252ZXJ0cyBhIFBvaW50IHRvIG5vZGUgKGxvY2FsKSBzcGFjZSBjb29yZGluYXRlcyB0aGVuIGFkZCB0aGUgYW5jaG9yIHBvaW50IHBvc2l0aW9uLlxuICAgICAqIFNvIHRoZSByZXR1cm4gcG9zaXRpb24gd2lsbCBiZSByZWxhdGVkIHRvIHRoZSBsZWZ0IGJvdHRvbSBjb3JuZXIgb2YgdGhlIG5vZGUncyBib3VuZGluZyBib3guXG4gICAgICogVGhpcyBlcXVhbHMgdG8gdGhlIEFQSSBiZWhhdmlvciBvZiBjb2NvczJkLXgsIHlvdSBwcm9iYWJseSB3YW50IHRvIHVzZSBjb252ZXJ0VG9Ob2RlU3BhY2VBUiBpbnN0ZWFkXG4gICAgICogISN6aCDlsIbkuIDkuKrngrnovazmjaLliLDoioLngrkgKOWxgOmDqCkg5Z2Q5qCH57O777yM5bm25Yqg5LiK6ZSa54K555qE5Z2Q5qCH44CCPGJyLz5cbiAgICAgKiDkuZ/lsLHmmK/or7Tov5Tlm57nmoTlnZDmoIfmmK/nm7jlr7nkuo7oioLngrnljIXlm7Tnm5Llt6bkuIvop5LnmoTlnZDmoIfjgII8YnIvPlxuICAgICAqIOi/meS4qiBBUEkg55qE6K6+6K6h5piv5Li65LqG5ZKMIGNvY29zMmQteCDkuK3ooYzkuLrkuIDoh7TvvIzmm7TlpJrmg4XlhrXkuIvkvaDlj6/og73pnIDopoHkvb/nlKggY29udmVydFRvTm9kZVNwYWNlQVLjgIJcbiAgICAgKiBAbWV0aG9kIGNvbnZlcnRUb05vZGVTcGFjZVxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjEuM1xuICAgICAqIEBwYXJhbSB7VmVjMn0gd29ybGRQb2ludFxuICAgICAqIEByZXR1cm4ge1ZlYzJ9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgbmV3VmVjMiA9IG5vZGUuY29udmVydFRvTm9kZVNwYWNlKGNjLnYyKDEwMCwgMTAwKSk7XG4gICAgICovXG4gICAgY29udmVydFRvTm9kZVNwYWNlICh3b3JsZFBvaW50KSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVdvcmxkTWF0cml4KCk7XG4gICAgICAgIE1hdDQuaW52ZXJ0KF9tYXQ0X3RlbXAsIHRoaXMuX3dvcmxkTWF0cml4KTtcbiAgICAgICAgbGV0IG91dCA9IG5ldyBjYy5WZWMyKCk7XG4gICAgICAgIFZlYzIudHJhbnNmb3JtTWF0NChvdXQsIHdvcmxkUG9pbnQsIF9tYXQ0X3RlbXApO1xuICAgICAgICBvdXQueCArPSB0aGlzLl9hbmNob3JQb2ludC54ICogdGhpcy5fY29udGVudFNpemUud2lkdGg7XG4gICAgICAgIG91dC55ICs9IHRoaXMuX2FuY2hvclBvaW50LnkgKiB0aGlzLl9jb250ZW50U2l6ZS5oZWlnaHQ7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQ29udmVydHMgYSBQb2ludCByZWxhdGVkIHRvIHRoZSBsZWZ0IGJvdHRvbSBjb3JuZXIgb2YgdGhlIG5vZGUncyBib3VuZGluZyBib3ggdG8gd29ybGQgc3BhY2UgY29vcmRpbmF0ZXMuXG4gICAgICogVGhpcyBlcXVhbHMgdG8gdGhlIEFQSSBiZWhhdmlvciBvZiBjb2NvczJkLXgsIHlvdSBwcm9iYWJseSB3YW50IHRvIHVzZSBjb252ZXJ0VG9Xb3JsZFNwYWNlQVIgaW5zdGVhZFxuICAgICAqICEjemgg5bCG5LiA5Liq55u45a+55LqO6IqC54K55bem5LiL6KeS55qE5Z2Q5qCH5L2N572u6L2s5o2i5Yiw5LiW55WM56m66Ze05Z2Q5qCH57O744CCXG4gICAgICog6L+Z5LiqIEFQSSDnmoTorr7orqHmmK/kuLrkuoblkowgY29jb3MyZC14IOS4reihjOS4uuS4gOiHtO+8jOabtOWkmuaDheWGteS4i+S9oOWPr+iDvemcgOimgeS9v+eUqCBjb252ZXJ0VG9Xb3JsZFNwYWNlQVJcbiAgICAgKiBAbWV0aG9kIGNvbnZlcnRUb1dvcmxkU3BhY2VcbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4xLjNcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IG5vZGVQb2ludFxuICAgICAqIEByZXR1cm4ge1ZlYzJ9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgbmV3VmVjMiA9IG5vZGUuY29udmVydFRvV29ybGRTcGFjZShjYy52MigxMDAsIDEwMCkpO1xuICAgICAqL1xuICAgIGNvbnZlcnRUb1dvcmxkU3BhY2UgKG5vZGVQb2ludCkge1xuICAgICAgICB0aGlzLl91cGRhdGVXb3JsZE1hdHJpeCgpO1xuICAgICAgICBsZXQgb3V0ID0gbmV3IGNjLlZlYzIoXG4gICAgICAgICAgICBub2RlUG9pbnQueCAtIHRoaXMuX2FuY2hvclBvaW50LnggKiB0aGlzLl9jb250ZW50U2l6ZS53aWR0aCxcbiAgICAgICAgICAgIG5vZGVQb2ludC55IC0gdGhpcy5fYW5jaG9yUG9pbnQueSAqIHRoaXMuX2NvbnRlbnRTaXplLmhlaWdodFxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gVmVjMi50cmFuc2Zvcm1NYXQ0KG91dCwgb3V0LCB0aGlzLl93b3JsZE1hdHJpeCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXR1cm5zIHRoZSBtYXRyaXggdGhhdCB0cmFuc2Zvcm0gdGhlIG5vZGUncyAobG9jYWwpIHNwYWNlIGNvb3JkaW5hdGVzIGludG8gdGhlIHBhcmVudCdzIHNwYWNlIGNvb3JkaW5hdGVzLjxici8+XG4gICAgICogVGhlIG1hdHJpeCBpcyBpbiBQaXhlbHMuXG4gICAgICogISN6aCDov5Tlm57ov5nkuKrlsIboioLngrnvvIjlsYDpg6jvvInnmoTnqbrpl7TlnZDmoIfns7vovazmjaLmiJDniLboioLngrnnmoTnqbrpl7TlnZDmoIfns7vnmoTnn6npmLXjgILov5nkuKrnn6npmLXku6Xlg4/ntKDkuLrljZXkvY3jgIJcbiAgICAgKiBAbWV0aG9kIGdldE5vZGVUb1BhcmVudFRyYW5zZm9ybVxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjBcbiAgICAgKiBAcGFyYW0ge0FmZmluZVRyYW5zZm9ybX0gW291dF0gVGhlIGFmZmluZSB0cmFuc2Zvcm0gb2JqZWN0IHRvIGJlIGZpbGxlZCB3aXRoIGRhdGFcbiAgICAgKiBAcmV0dXJuIHtBZmZpbmVUcmFuc2Zvcm19IFNhbWUgYXMgdGhlIG91dCBhZmZpbmUgdHJhbnNmb3JtIG9iamVjdFxuICAgICAqIEBleGFtcGxlXG4gICAgICogbGV0IGFmZmluZVRyYW5zZm9ybSA9IGNjLkFmZmluZVRyYW5zZm9ybS5jcmVhdGUoKTtcbiAgICAgKiBub2RlLmdldE5vZGVUb1BhcmVudFRyYW5zZm9ybShhZmZpbmVUcmFuc2Zvcm0pO1xuICAgICAqL1xuICAgIGdldE5vZGVUb1BhcmVudFRyYW5zZm9ybSAob3V0KSB7XG4gICAgICAgIGlmICghb3V0KSB7XG4gICAgICAgICAgICBvdXQgPSBBZmZpbmVUcmFucy5pZGVudGl0eSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3VwZGF0ZUxvY2FsTWF0cml4KCk7XG4gICAgICAgIFxuICAgICAgICB2YXIgY29udGVudFNpemUgPSB0aGlzLl9jb250ZW50U2l6ZTtcbiAgICAgICAgX3ZlYzNfdGVtcC54ID0gLXRoaXMuX2FuY2hvclBvaW50LnggKiBjb250ZW50U2l6ZS53aWR0aDtcbiAgICAgICAgX3ZlYzNfdGVtcC55ID0gLXRoaXMuX2FuY2hvclBvaW50LnkgKiBjb250ZW50U2l6ZS5oZWlnaHQ7XG5cbiAgICAgICAgTWF0NC5jb3B5KF9tYXQ0X3RlbXAsIHRoaXMuX21hdHJpeCk7XG4gICAgICAgIE1hdDQudHJhbnNmb3JtKF9tYXQ0X3RlbXAsIF9tYXQ0X3RlbXAsIF92ZWMzX3RlbXApO1xuICAgICAgICByZXR1cm4gQWZmaW5lVHJhbnMuZnJvbU1hdDQob3V0LCBfbWF0NF90ZW1wKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJldHVybnMgdGhlIG1hdHJpeCB0aGF0IHRyYW5zZm9ybSB0aGUgbm9kZSdzIChsb2NhbCkgc3BhY2UgY29vcmRpbmF0ZXMgaW50byB0aGUgcGFyZW50J3Mgc3BhY2UgY29vcmRpbmF0ZXMuPGJyLz5cbiAgICAgKiBUaGUgbWF0cml4IGlzIGluIFBpeGVscy48YnIvPlxuICAgICAqIFRoaXMgbWV0aG9kIGlzIEFSIChBbmNob3IgUmVsYXRpdmUpLlxuICAgICAqICEjemhcbiAgICAgKiDov5Tlm57ov5nkuKrlsIboioLngrnvvIjlsYDpg6jvvInnmoTnqbrpl7TlnZDmoIfns7vovazmjaLmiJDniLboioLngrnnmoTnqbrpl7TlnZDmoIfns7vnmoTnn6npmLXjgII8YnIvPlxuICAgICAqIOi/meS4quefqemYteS7peWDj+e0oOS4uuWNleS9jeOAgjxici8+XG4gICAgICog6K+l5pa55rOV5Z+65LqO6IqC54K55Z2Q5qCH44CCXG4gICAgICogQG1ldGhvZCBnZXROb2RlVG9QYXJlbnRUcmFuc2Zvcm1BUlxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjBcbiAgICAgKiBAcGFyYW0ge0FmZmluZVRyYW5zZm9ybX0gW291dF0gVGhlIGFmZmluZSB0cmFuc2Zvcm0gb2JqZWN0IHRvIGJlIGZpbGxlZCB3aXRoIGRhdGFcbiAgICAgKiBAcmV0dXJuIHtBZmZpbmVUcmFuc2Zvcm19IFNhbWUgYXMgdGhlIG91dCBhZmZpbmUgdHJhbnNmb3JtIG9iamVjdFxuICAgICAqIEBleGFtcGxlXG4gICAgICogbGV0IGFmZmluZVRyYW5zZm9ybSA9IGNjLkFmZmluZVRyYW5zZm9ybS5jcmVhdGUoKTtcbiAgICAgKiBub2RlLmdldE5vZGVUb1BhcmVudFRyYW5zZm9ybUFSKGFmZmluZVRyYW5zZm9ybSk7XG4gICAgICovXG4gICAgZ2V0Tm9kZVRvUGFyZW50VHJhbnNmb3JtQVIgKG91dCkge1xuICAgICAgICBpZiAoIW91dCkge1xuICAgICAgICAgICAgb3V0ID0gQWZmaW5lVHJhbnMuaWRlbnRpdHkoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl91cGRhdGVMb2NhbE1hdHJpeCgpO1xuICAgICAgICByZXR1cm4gQWZmaW5lVHJhbnMuZnJvbU1hdDQob3V0LCB0aGlzLl9tYXRyaXgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgdGhlIHdvcmxkIGFmZmluZSB0cmFuc2Zvcm0gbWF0cml4LiBUaGUgbWF0cml4IGlzIGluIFBpeGVscy5cbiAgICAgKiAhI3poIOi/lOWbnuiKgueCueWIsOS4lueVjOWdkOagh+ezu+eahOS7v+WwhOWPmOaNouefqemYteOAguefqemYteWNleS9jeaYr+WDj+e0oOOAglxuICAgICAqIEBtZXRob2QgZ2V0Tm9kZVRvV29ybGRUcmFuc2Zvcm1cbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wXG4gICAgICogQHBhcmFtIHtBZmZpbmVUcmFuc2Zvcm19IFtvdXRdIFRoZSBhZmZpbmUgdHJhbnNmb3JtIG9iamVjdCB0byBiZSBmaWxsZWQgd2l0aCBkYXRhXG4gICAgICogQHJldHVybiB7QWZmaW5lVHJhbnNmb3JtfSBTYW1lIGFzIHRoZSBvdXQgYWZmaW5lIHRyYW5zZm9ybSBvYmplY3RcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGxldCBhZmZpbmVUcmFuc2Zvcm0gPSBjYy5BZmZpbmVUcmFuc2Zvcm0uY3JlYXRlKCk7XG4gICAgICogbm9kZS5nZXROb2RlVG9Xb3JsZFRyYW5zZm9ybShhZmZpbmVUcmFuc2Zvcm0pO1xuICAgICAqL1xuICAgIGdldE5vZGVUb1dvcmxkVHJhbnNmb3JtIChvdXQpIHtcbiAgICAgICAgaWYgKCFvdXQpIHtcbiAgICAgICAgICAgIG91dCA9IEFmZmluZVRyYW5zLmlkZW50aXR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdXBkYXRlV29ybGRNYXRyaXgoKTtcbiAgICAgICAgXG4gICAgICAgIHZhciBjb250ZW50U2l6ZSA9IHRoaXMuX2NvbnRlbnRTaXplO1xuICAgICAgICBfdmVjM190ZW1wLnggPSAtdGhpcy5fYW5jaG9yUG9pbnQueCAqIGNvbnRlbnRTaXplLndpZHRoO1xuICAgICAgICBfdmVjM190ZW1wLnkgPSAtdGhpcy5fYW5jaG9yUG9pbnQueSAqIGNvbnRlbnRTaXplLmhlaWdodDtcblxuICAgICAgICBNYXQ0LmNvcHkoX21hdDRfdGVtcCwgdGhpcy5fd29ybGRNYXRyaXgpO1xuICAgICAgICBNYXQ0LnRyYW5zZm9ybShfbWF0NF90ZW1wLCBfbWF0NF90ZW1wLCBfdmVjM190ZW1wKTtcblxuICAgICAgICByZXR1cm4gQWZmaW5lVHJhbnMuZnJvbU1hdDQob3V0LCBfbWF0NF90ZW1wKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJldHVybnMgdGhlIHdvcmxkIGFmZmluZSB0cmFuc2Zvcm0gbWF0cml4LiBUaGUgbWF0cml4IGlzIGluIFBpeGVscy48YnIvPlxuICAgICAqIFRoaXMgbWV0aG9kIGlzIEFSIChBbmNob3IgUmVsYXRpdmUpLlxuICAgICAqICEjemhcbiAgICAgKiDov5Tlm57oioLngrnliLDkuJbnlYzlnZDmoIfku7/lsITlj5jmjaLnn6npmLXjgILnn6npmLXljZXkvY3mmK/lg4/ntKDjgII8YnIvPlxuICAgICAqIOivpeaWueazleWfuuS6juiKgueCueWdkOagh+OAglxuICAgICAqIEBtZXRob2QgZ2V0Tm9kZVRvV29ybGRUcmFuc2Zvcm1BUlxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjBcbiAgICAgKiBAcGFyYW0ge0FmZmluZVRyYW5zZm9ybX0gW291dF0gVGhlIGFmZmluZSB0cmFuc2Zvcm0gb2JqZWN0IHRvIGJlIGZpbGxlZCB3aXRoIGRhdGFcbiAgICAgKiBAcmV0dXJuIHtBZmZpbmVUcmFuc2Zvcm19IFNhbWUgYXMgdGhlIG91dCBhZmZpbmUgdHJhbnNmb3JtIG9iamVjdFxuICAgICAqIEBleGFtcGxlXG4gICAgICogbGV0IGFmZmluZVRyYW5zZm9ybSA9IGNjLkFmZmluZVRyYW5zZm9ybS5jcmVhdGUoKTtcbiAgICAgKiBub2RlLmdldE5vZGVUb1dvcmxkVHJhbnNmb3JtQVIoYWZmaW5lVHJhbnNmb3JtKTtcbiAgICAgKi9cbiAgICBnZXROb2RlVG9Xb3JsZFRyYW5zZm9ybUFSIChvdXQpIHtcbiAgICAgICAgaWYgKCFvdXQpIHtcbiAgICAgICAgICAgIG91dCA9IEFmZmluZVRyYW5zLmlkZW50aXR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdXBkYXRlV29ybGRNYXRyaXgoKTtcbiAgICAgICAgcmV0dXJuIEFmZmluZVRyYW5zLmZyb21NYXQ0KG91dCwgdGhpcy5fd29ybGRNYXRyaXgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmV0dXJucyB0aGUgbWF0cml4IHRoYXQgdHJhbnNmb3JtIHBhcmVudCdzIHNwYWNlIGNvb3JkaW5hdGVzIHRvIHRoZSBub2RlJ3MgKGxvY2FsKSBzcGFjZSBjb29yZGluYXRlcy48YnIvPlxuICAgICAqIFRoZSBtYXRyaXggaXMgaW4gUGl4ZWxzLiBUaGUgcmV0dXJuZWQgdHJhbnNmb3JtIGlzIHJlYWRvbmx5IGFuZCBjYW5ub3QgYmUgY2hhbmdlZC5cbiAgICAgKiAhI3poXG4gICAgICog6L+U5Zue5bCG54i26IqC54K555qE5Z2Q5qCH57O76L2s5o2i5oiQ6IqC54K577yI5bGA6YOo77yJ55qE56m66Ze05Z2Q5qCH57O755qE55+p6Zi144CCPGJyLz5cbiAgICAgKiDor6Xnn6npmLXku6Xlg4/ntKDkuLrljZXkvY3jgILov5Tlm57nmoTnn6npmLXmmK/lj6ror7vnmoTvvIzkuI3og73mm7TmlLnjgIJcbiAgICAgKiBAbWV0aG9kIGdldFBhcmVudFRvTm9kZVRyYW5zZm9ybVxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjBcbiAgICAgKiBAcGFyYW0ge0FmZmluZVRyYW5zZm9ybX0gW291dF0gVGhlIGFmZmluZSB0cmFuc2Zvcm0gb2JqZWN0IHRvIGJlIGZpbGxlZCB3aXRoIGRhdGFcbiAgICAgKiBAcmV0dXJuIHtBZmZpbmVUcmFuc2Zvcm19IFNhbWUgYXMgdGhlIG91dCBhZmZpbmUgdHJhbnNmb3JtIG9iamVjdFxuICAgICAqIEBleGFtcGxlXG4gICAgICogbGV0IGFmZmluZVRyYW5zZm9ybSA9IGNjLkFmZmluZVRyYW5zZm9ybS5jcmVhdGUoKTtcbiAgICAgKiBub2RlLmdldFBhcmVudFRvTm9kZVRyYW5zZm9ybShhZmZpbmVUcmFuc2Zvcm0pO1xuICAgICAqL1xuICAgIGdldFBhcmVudFRvTm9kZVRyYW5zZm9ybSAob3V0KSB7XG4gICAgICAgIGlmICghb3V0KSB7XG4gICAgICAgICAgICBvdXQgPSBBZmZpbmVUcmFucy5pZGVudGl0eSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3VwZGF0ZUxvY2FsTWF0cml4KCk7XG4gICAgICAgIE1hdDQuaW52ZXJ0KF9tYXQ0X3RlbXAsIHRoaXMuX21hdHJpeCk7XG4gICAgICAgIHJldHVybiBBZmZpbmVUcmFucy5mcm9tTWF0NChvdXQsIF9tYXQ0X3RlbXApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgdGhlIGludmVyc2Ugd29ybGQgYWZmaW5lIHRyYW5zZm9ybSBtYXRyaXguIFRoZSBtYXRyaXggaXMgaW4gUGl4ZWxzLlxuICAgICAqICEjZW4g6L+U5Zue5LiW55WM5Z2Q5qCH57O75Yiw6IqC54K55Z2Q5qCH57O755qE6YCG55+p6Zi144CCXG4gICAgICogQG1ldGhvZCBnZXRXb3JsZFRvTm9kZVRyYW5zZm9ybVxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjBcbiAgICAgKiBAcGFyYW0ge0FmZmluZVRyYW5zZm9ybX0gW291dF0gVGhlIGFmZmluZSB0cmFuc2Zvcm0gb2JqZWN0IHRvIGJlIGZpbGxlZCB3aXRoIGRhdGFcbiAgICAgKiBAcmV0dXJuIHtBZmZpbmVUcmFuc2Zvcm19IFNhbWUgYXMgdGhlIG91dCBhZmZpbmUgdHJhbnNmb3JtIG9iamVjdFxuICAgICAqIEBleGFtcGxlXG4gICAgICogbGV0IGFmZmluZVRyYW5zZm9ybSA9IGNjLkFmZmluZVRyYW5zZm9ybS5jcmVhdGUoKTtcbiAgICAgKiBub2RlLmdldFdvcmxkVG9Ob2RlVHJhbnNmb3JtKGFmZmluZVRyYW5zZm9ybSk7XG4gICAgICovXG4gICAgZ2V0V29ybGRUb05vZGVUcmFuc2Zvcm0gKG91dCkge1xuICAgICAgICBpZiAoIW91dCkge1xuICAgICAgICAgICAgb3V0ID0gQWZmaW5lVHJhbnMuaWRlbnRpdHkoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl91cGRhdGVXb3JsZE1hdHJpeCgpO1xuICAgICAgICBNYXQ0LmludmVydChfbWF0NF90ZW1wLCB0aGlzLl93b3JsZE1hdHJpeCk7XG4gICAgICAgIHJldHVybiBBZmZpbmVUcmFucy5mcm9tTWF0NChvdXQsIF9tYXQ0X3RlbXApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIGNvbnZlbmllbmNlIG1ldGhvZHMgd2hpY2ggdGFrZSBhIGNjLlRvdWNoIGluc3RlYWQgb2YgY2MuVmVjMi5cbiAgICAgKiAhI3poIOWwhuinpuaRuOeCuei9rOaNouaIkOacrOWcsOWdkOagh+ezu+S4reS9jee9ruOAglxuICAgICAqIEBtZXRob2QgY29udmVydFRvdWNoVG9Ob2RlU3BhY2VcbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wXG4gICAgICogQHBhcmFtIHtUb3VjaH0gdG91Y2ggLSBUaGUgdG91Y2ggb2JqZWN0XG4gICAgICogQHJldHVybiB7VmVjMn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBuZXdWZWMyID0gbm9kZS5jb252ZXJ0VG91Y2hUb05vZGVTcGFjZSh0b3VjaCk7XG4gICAgICovXG4gICAgY29udmVydFRvdWNoVG9Ob2RlU3BhY2UgKHRvdWNoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnZlcnRUb05vZGVTcGFjZSh0b3VjaC5nZXRMb2NhdGlvbigpKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBjb252ZXJ0cyBhIGNjLlRvdWNoICh3b3JsZCBjb29yZGluYXRlcykgaW50byBhIGxvY2FsIGNvb3JkaW5hdGUuIFRoaXMgbWV0aG9kIGlzIEFSIChBbmNob3IgUmVsYXRpdmUpLlxuICAgICAqICEjemgg6L2s5o2i5LiA5LiqIGNjLlRvdWNo77yI5LiW55WM5Z2Q5qCH77yJ5Yiw5LiA5Liq5bGA6YOo5Z2Q5qCH77yM6K+l5pa55rOV5Z+65LqO6IqC54K55Z2Q5qCH44CCXG4gICAgICogQG1ldGhvZCBjb252ZXJ0VG91Y2hUb05vZGVTcGFjZUFSXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMFxuICAgICAqIEBwYXJhbSB7VG91Y2h9IHRvdWNoIC0gVGhlIHRvdWNoIG9iamVjdFxuICAgICAqIEByZXR1cm4ge1ZlYzJ9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgbmV3VmVjMiA9IG5vZGUuY29udmVydFRvdWNoVG9Ob2RlU3BhY2VBUih0b3VjaCk7XG4gICAgICovXG4gICAgY29udmVydFRvdWNoVG9Ob2RlU3BhY2VBUiAodG91Y2gpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udmVydFRvTm9kZVNwYWNlQVIodG91Y2guZ2V0TG9jYXRpb24oKSk7XG4gICAgfSxcbiAgICBcbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmV0dXJucyBhIFwibG9jYWxcIiBheGlzIGFsaWduZWQgYm91bmRpbmcgYm94IG9mIHRoZSBub2RlLiA8YnIvPlxuICAgICAqIFRoZSByZXR1cm5lZCBib3ggaXMgcmVsYXRpdmUgb25seSB0byBpdHMgcGFyZW50LlxuICAgICAqICEjemgg6L+U5Zue54i26IqC5Z2Q5qCH57O75LiL55qE6L205ZCR5a+56b2Q55qE5YyF5Zu055uS44CCXG4gICAgICogQG1ldGhvZCBnZXRCb3VuZGluZ0JveFxuICAgICAqIEByZXR1cm4ge1JlY3R9IFRoZSBjYWxjdWxhdGVkIGJvdW5kaW5nIGJveCBvZiB0aGUgbm9kZVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIGJvdW5kaW5nQm94ID0gbm9kZS5nZXRCb3VuZGluZ0JveCgpO1xuICAgICAqL1xuICAgIGdldEJvdW5kaW5nQm94ICgpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlTG9jYWxNYXRyaXgoKTtcbiAgICAgICAgbGV0IHdpZHRoID0gdGhpcy5fY29udGVudFNpemUud2lkdGg7XG4gICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLl9jb250ZW50U2l6ZS5oZWlnaHQ7XG4gICAgICAgIGxldCByZWN0ID0gY2MucmVjdChcbiAgICAgICAgICAgIC10aGlzLl9hbmNob3JQb2ludC54ICogd2lkdGgsIFxuICAgICAgICAgICAgLXRoaXMuX2FuY2hvclBvaW50LnkgKiBoZWlnaHQsIFxuICAgICAgICAgICAgd2lkdGgsIFxuICAgICAgICAgICAgaGVpZ2h0KTtcbiAgICAgICAgcmV0dXJuIHJlY3QudHJhbnNmb3JtTWF0NChyZWN0LCB0aGlzLl9tYXRyaXgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmV0dXJucyBhIFwid29ybGRcIiBheGlzIGFsaWduZWQgYm91bmRpbmcgYm94IG9mIHRoZSBub2RlLjxici8+XG4gICAgICogVGhlIGJvdW5kaW5nIGJveCBjb250YWlucyBzZWxmIGFuZCBhY3RpdmUgY2hpbGRyZW4ncyB3b3JsZCBib3VuZGluZyBib3guXG4gICAgICogISN6aFxuICAgICAqIOi/lOWbnuiKgueCueWcqOS4lueVjOWdkOagh+ezu+S4i+eahOWvuem9kOi9tOWQkeeahOWMheWbtOebku+8iEFBQkLvvInjgII8YnIvPlxuICAgICAqIOivpei+ueahhuWMheWQq+iHqui6q+WSjOW3sua/gOa0u+eahOWtkOiKgueCueeahOS4lueVjOi+ueahhuOAglxuICAgICAqIEBtZXRob2QgZ2V0Qm91bmRpbmdCb3hUb1dvcmxkXG4gICAgICogQHJldHVybiB7UmVjdH1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBuZXdSZWN0ID0gbm9kZS5nZXRCb3VuZGluZ0JveFRvV29ybGQoKTtcbiAgICAgKi9cbiAgICBnZXRCb3VuZGluZ0JveFRvV29ybGQgKCkge1xuICAgICAgICBpZiAodGhpcy5fcGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVdvcmxkTWF0cml4KCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2V0Qm91bmRpbmdCb3hUbygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Qm91bmRpbmdCb3goKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZ2V0Qm91bmRpbmdCb3hUbyAoKSB7XG4gICAgICAgIGxldCB3aWR0aCA9IHRoaXMuX2NvbnRlbnRTaXplLndpZHRoO1xuICAgICAgICBsZXQgaGVpZ2h0ID0gdGhpcy5fY29udGVudFNpemUuaGVpZ2h0O1xuICAgICAgICBsZXQgcmVjdCA9IGNjLnJlY3QoXG4gICAgICAgICAgICAtdGhpcy5fYW5jaG9yUG9pbnQueCAqIHdpZHRoLCBcbiAgICAgICAgICAgIC10aGlzLl9hbmNob3JQb2ludC55ICogaGVpZ2h0LCBcbiAgICAgICAgICAgIHdpZHRoLCBcbiAgICAgICAgICAgIGhlaWdodCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLl9jYWxjdWxXb3JsZE1hdHJpeCgpO1xuICAgICAgICByZWN0LnRyYW5zZm9ybU1hdDQocmVjdCwgdGhpcy5fd29ybGRNYXRyaXgpO1xuXG4gICAgICAgIC8vcXVlcnkgY2hpbGQncyBCb3VuZGluZ0JveFxuICAgICAgICBpZiAoIXRoaXMuX2NoaWxkcmVuKVxuICAgICAgICAgICAgcmV0dXJuIHJlY3Q7XG5cbiAgICAgICAgdmFyIGxvY0NoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW47XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbG9jQ2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IGxvY0NoaWxkcmVuW2ldO1xuICAgICAgICAgICAgaWYgKGNoaWxkICYmIGNoaWxkLmFjdGl2ZSkge1xuICAgICAgICAgICAgICAgIHZhciBjaGlsZFJlY3QgPSBjaGlsZC5fZ2V0Qm91bmRpbmdCb3hUbygpO1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZFJlY3QpXG4gICAgICAgICAgICAgICAgICAgIHJlY3QudW5pb24ocmVjdCwgY2hpbGRSZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVjdDtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZU9yZGVyT2ZBcnJpdmFsICgpIHtcbiAgICAgICAgdmFyIGFycml2YWxPcmRlciA9IHRoaXMuX3BhcmVudCA/ICsrdGhpcy5fcGFyZW50Ll9jaGlsZEFycml2YWxPcmRlciA6IDA7XG4gICAgICAgIHRoaXMuX2xvY2FsWk9yZGVyID0gKHRoaXMuX2xvY2FsWk9yZGVyICYgMHhmZmZmMDAwMCkgfCBhcnJpdmFsT3JkZXI7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmVtaXQoRXZlbnRUeXBlLlNJQkxJTkdfT1JERVJfQ0hBTkdFRCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBBZGRzIGEgY2hpbGQgdG8gdGhlIG5vZGUgd2l0aCB6IG9yZGVyIGFuZCBuYW1lLlxuICAgICAqICEjemhcbiAgICAgKiDmt7vliqDlrZDoioLngrnvvIzlubbkuJTlj6/ku6Xkv67mlLnor6XoioLngrnnmoQg5bGA6YOoIFog6aG65bqP5ZKM5ZCN5a2X44CCXG4gICAgICogQG1ldGhvZCBhZGRDaGlsZFxuICAgICAqIEBwYXJhbSB7Tm9kZX0gY2hpbGQgLSBBIGNoaWxkIG5vZGVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3pJbmRleF0gLSBaIG9yZGVyIGZvciBkcmF3aW5nIHByaW9yaXR5LiBQbGVhc2UgcmVmZXIgdG8gekluZGV4IHByb3BlcnR5XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IFtuYW1lXSAtIEEgbmFtZSB0byBpZGVudGlmeSB0aGUgbm9kZSBlYXNpbHkuIFBsZWFzZSByZWZlciB0byBuYW1lIHByb3BlcnR5XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBub2RlLmFkZENoaWxkKG5ld05vZGUsIDEsIFwibm9kZVwiKTtcbiAgICAgKi9cbiAgICBhZGRDaGlsZCAoY2hpbGQsIHpJbmRleCwgbmFtZSkge1xuICAgICAgICBpZiAoQ0NfREVWICYmICFjYy5Ob2RlLmlzTm9kZShjaGlsZCkpIHtcbiAgICAgICAgICAgIHJldHVybiBjYy5lcnJvcklEKDE2MzQsIGNjLmpzLmdldENsYXNzTmFtZShjaGlsZCkpO1xuICAgICAgICB9XG4gICAgICAgIGNjLmFzc2VydElEKGNoaWxkLCAxNjA2KTtcbiAgICAgICAgY2MuYXNzZXJ0SUQoY2hpbGQuX3BhcmVudCA9PT0gbnVsbCwgMTYwNSk7XG5cbiAgICAgICAgLy8gaW52b2tlcyB0aGUgcGFyZW50IHNldHRlclxuICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xuXG4gICAgICAgIGlmICh6SW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY2hpbGQuekluZGV4ID0gekluZGV4O1xuICAgICAgICB9XG4gICAgICAgIGlmIChuYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNoaWxkLm5hbWUgPSBuYW1lO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU3RvcHMgYWxsIHJ1bm5pbmcgYWN0aW9ucyBhbmQgc2NoZWR1bGVycy5cbiAgICAgKiAhI3poIOWBnOatouaJgOacieato+WcqOaSreaUvueahOWKqOS9nOWSjOiuoeaXtuWZqOOAglxuICAgICAqIEBtZXRob2QgY2xlYW51cFxuICAgICAqIEBleGFtcGxlXG4gICAgICogbm9kZS5jbGVhbnVwKCk7XG4gICAgICovXG4gICAgY2xlYW51cCAoKSB7XG4gICAgICAgIC8vIGFjdGlvbnNcbiAgICAgICAgQWN0aW9uTWFuYWdlckV4aXN0ICYmIGNjLmRpcmVjdG9yLmdldEFjdGlvbk1hbmFnZXIoKS5yZW1vdmVBbGxBY3Rpb25zRnJvbVRhcmdldCh0aGlzKTtcbiAgICAgICAgLy8gZXZlbnRcbiAgICAgICAgZXZlbnRNYW5hZ2VyLnJlbW92ZUxpc3RlbmVycyh0aGlzKTtcblxuICAgICAgICAvLyBjaGlsZHJlblxuICAgICAgICB2YXIgaSwgbGVuID0gdGhpcy5fY2hpbGRyZW4ubGVuZ3RoLCBub2RlO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgICAgIG5vZGUgPSB0aGlzLl9jaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGlmIChub2RlKVxuICAgICAgICAgICAgICAgIG5vZGUuY2xlYW51cCgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU29ydHMgdGhlIGNoaWxkcmVuIGFycmF5IGRlcGVuZHMgb24gY2hpbGRyZW4ncyB6SW5kZXggYW5kIGFycml2YWxPcmRlcixcbiAgICAgKiBub3JtYWxseSB5b3Ugd29uJ3QgbmVlZCB0byBpbnZva2UgdGhpcyBmdW5jdGlvbi5cbiAgICAgKiAhI3poIOagueaNruWtkOiKgueCueeahCB6SW5kZXgg5ZKMIGFycml2YWxPcmRlciDov5vooYzmjpLluo/vvIzmraPluLjmg4XlhrXkuIvlvIDlj5HogIXkuI3pnIDopoHmiYvliqjosIPnlKjov5nkuKrlh73mlbDjgIJcbiAgICAgKlxuICAgICAqIEBtZXRob2Qgc29ydEFsbENoaWxkcmVuXG4gICAgICovXG4gICAgc29ydEFsbENoaWxkcmVuICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3Jlb3JkZXJDaGlsZERpcnR5KSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuX3Jlb3JkZXJDaGlsZERpcnR5ID0gZmFsc2U7XG5cbiAgICAgICAgICAgIC8vIGRlbGF5IHVwZGF0ZSBhcnJpdmFsT3JkZXIgYmVmb3JlIHNvcnQgY2hpbGRyZW5cbiAgICAgICAgICAgIHZhciBfY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbiwgY2hpbGQ7XG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQgJiYgKHRoaXMuX3BhcmVudC5fY2hpbGRBcnJpdmFsT3JkZXIgPSAxKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBfY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjaGlsZCA9IF9jaGlsZHJlbltpXTtcbiAgICAgICAgICAgICAgICBjaGlsZC5fdXBkYXRlT3JkZXJPZkFycml2YWwoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gT3B0aW1pemUgcmVvcmRlcmluZyBldmVudCBjb2RlIHRvIGZpeCBwcm9ibGVtcyB3aXRoIHNldHRpbmcgemluZGV4XG4gICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vY29jb3MtY3JlYXRvci8yZC10YXNrcy9pc3N1ZXMvMTE4NlxuICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLl9zZXREaXJ0eUZvck5vZGUodGhpcyk7XG5cbiAgICAgICAgICAgIGlmIChfY2hpbGRyZW4ubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIC8vIGluc2VydGlvbiBzb3J0XG4gICAgICAgICAgICAgICAgdmFyIGosIGNoaWxkO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAxLCBsZW4gPSBfY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQgPSBfY2hpbGRyZW5baV07XG4gICAgICAgICAgICAgICAgICAgIGogPSBpIC0gMTtcblxuICAgICAgICAgICAgICAgICAgICAvL2NvbnRpbnVlIG1vdmluZyBlbGVtZW50IGRvd253YXJkcyB3aGlsZSB6T3JkZXIgaXMgc21hbGxlciBvciB3aGVuIHpPcmRlciBpcyB0aGUgc2FtZSBidXQgbXV0YXRlZEluZGV4IGlzIHNtYWxsZXJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGogPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkLl9sb2NhbFpPcmRlciA8IF9jaGlsZHJlbltqXS5fbG9jYWxaT3JkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfY2hpbGRyZW5baiArIDFdID0gX2NoaWxkcmVuW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGotLTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBfY2hpbGRyZW5baiArIDFdID0gY2hpbGQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChFdmVudFR5cGUuQ0hJTERfUkVPUkRFUiwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5fX2Zhc3RPZmYoY2MuRGlyZWN0b3IuRVZFTlRfQUZURVJfVVBEQVRFLCB0aGlzLnNvcnRBbGxDaGlsZHJlbiwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2RlbGF5U29ydCAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fcmVvcmRlckNoaWxkRGlydHkpIHtcbiAgICAgICAgICAgIHRoaXMuX3Jlb3JkZXJDaGlsZERpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLl9fZmFzdE9uKGNjLkRpcmVjdG9yLkVWRU5UX0FGVEVSX1VQREFURSwgdGhpcy5zb3J0QWxsQ2hpbGRyZW4sIHRoaXMpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9yZXN0b3JlUHJvcGVydGllczogQ0NfRURJVE9SICYmIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLypcbiAgICAgICAgICogVE9ETzogUmVmaW5lIHRoaXMgY29kZSBhZnRlciBjb21wbGV0aW5nIHVuZG8vcmVkbyAyLjAuXG4gICAgICAgICAqIFRoZSBub2RlIHdpbGwgYmUgZGVzdHJveWVkIHdoZW4gZGVsZXRpbmcgaW4gdGhlIGVkaXRvcixcbiAgICAgICAgICogYnV0IGl0IHdpbGwgYmUgcmVzZXJ2ZWQgYW5kIHJldXNlZCBmb3IgdW5kby5cbiAgICAgICAgKi9cblxuICAgICAgICAvLyByZXN0b3JlIDNkIG5vZGVcbiAgICAgICAgdGhpcy5pczNETm9kZSA9IHRoaXMuaXMzRE5vZGU7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9tYXRyaXgpIHtcbiAgICAgICAgICAgIHRoaXMuX21hdHJpeCA9IGNjLm1hdDQodGhpcy5fc3BhY2VJbmZvLmxvY2FsTWF0KTtcbiAgICAgICAgICAgIE1hdDQuaWRlbnRpdHkodGhpcy5fbWF0cml4KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX3dvcmxkTWF0cml4KSB7XG4gICAgICAgICAgICB0aGlzLl93b3JsZE1hdHJpeCA9IGNjLm1hdDQodGhpcy5fc3BhY2VJbmZvLndvcmxkTWF0KTtcbiAgICAgICAgICAgIE1hdDQuaWRlbnRpdHkodGhpcy5fd29ybGRNYXRyaXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbG9jYWxNYXREaXJ0eSA9IExvY2FsRGlydHlGbGFnLkFMTDtcbiAgICAgICAgdGhpcy5fd29ybGRNYXREaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5fZnJvbUV1bGVyKCk7XG5cbiAgICAgICAgdGhpcy5fcmVuZGVyRmxhZyB8PSBSZW5kZXJGbG93LkZMQUdfVFJBTlNGT1JNO1xuICAgICAgICBpZiAodGhpcy5fcmVuZGVyQ29tcG9uZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJDb21wb25lbnQubWFya0ZvclJlbmRlcih0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJGbGFnIHw9IFJlbmRlckZsb3cuRkxBR19DSElMRFJFTjtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvblJlc3RvcmU6IENDX0VESVRPUiAmJiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX29uUmVzdG9yZUJhc2UoKTtcblxuICAgICAgICB0aGlzLl9yZXN0b3JlUHJvcGVydGllcygpO1xuXG4gICAgICAgIHZhciBhY3Rpb25NYW5hZ2VyID0gY2MuZGlyZWN0b3IuZ2V0QWN0aW9uTWFuYWdlcigpO1xuICAgICAgICBpZiAodGhpcy5fYWN0aXZlSW5IaWVyYXJjaHkpIHtcbiAgICAgICAgICAgIGFjdGlvbk1hbmFnZXIgJiYgYWN0aW9uTWFuYWdlci5yZXN1bWVUYXJnZXQodGhpcyk7XG4gICAgICAgICAgICBldmVudE1hbmFnZXIucmVzdW1lVGFyZ2V0KHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYWN0aW9uTWFuYWdlciAmJiBhY3Rpb25NYW5hZ2VyLnBhdXNlVGFyZ2V0KHRoaXMpO1xuICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLnBhdXNlVGFyZ2V0KHRoaXMpO1xuICAgICAgICB9XG4gICAgfSxcblxuXG59O1xuXG5pZiAoQ0NfRURJVE9SKSB7XG4gICAgLy8gZGVwcmVjYXRlZCwgb25seSB1c2VkIHRvIGltcG9ydCBvbGQgZGF0YSBpbiBlZGl0b3JcbiAgICBqcy5taXhpbihOb2RlRGVmaW5lcy5wcm9wZXJ0aWVzLCB7XG4gICAgICAgIF9zY2FsZVg6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkZsb2F0LFxuICAgICAgICAgICAgZWRpdG9yT25seTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBfc2NhbGVZOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICB0eXBlOiBjYy5GbG9hdCxcbiAgICAgICAgICAgIGVkaXRvck9ubHk6IHRydWVcbiAgICAgICAgfSxcbiAgICB9KTtcbn1cblxubGV0IE5vZGUgPSBjYy5DbGFzcyhOb2RlRGVmaW5lcyk7XG5cbi8vIDNEIE5vZGUgUHJvcGVydHlcblxuXG4vLyBOb2RlIEV2ZW50XG5cbi8qKlxuICogISNlblxuICogVGhlIHBvc2l0aW9uIGNoYW5naW5nIGV2ZW50LCB5b3UgY2FuIGxpc3RlbiB0byB0aGlzIGV2ZW50IHRocm91Z2ggdGhlIHN0YXRlbWVudCB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuUE9TSVRJT05fQ0hBTkdFRCwgY2FsbGJhY2ssIHRoaXMpO1xuICogISN6aFxuICog5L2N572u5Y+Y5Yqo55uR5ZCs5LqL5Lu2LCDpgJrov4cgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlBPU0lUSU9OX0NIQU5HRUQsIGNhbGxiYWNrLCB0aGlzKTsg6L+b6KGM55uR5ZCs44CCXG4gKiBAZXZlbnQgcG9zaXRpb24tY2hhbmdlZFxuICogQHBhcmFtIHtWZWMyfSBvbGRQb3MgLSBUaGUgb2xkIHBvc2l0aW9uLCBidXQgdGhpcyBwYXJhbWV0ZXIgaXMgb25seSBhdmFpbGFibGUgaW4gZWRpdG9yIVxuICovXG4vKipcbiAqICEjZW5cbiAqIFRoZSBzaXplIGNoYW5naW5nIGV2ZW50LCB5b3UgY2FuIGxpc3RlbiB0byB0aGlzIGV2ZW50IHRocm91Z2ggdGhlIHN0YXRlbWVudCB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuU0laRV9DSEFOR0VELCBjYWxsYmFjaywgdGhpcyk7XG4gKiAhI3poXG4gKiDlsLrlr7jlj5jliqjnm5HlkKzkuovku7bvvIzpgJrov4cgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCwgY2FsbGJhY2ssIHRoaXMpOyDov5vooYznm5HlkKzjgIJcbiAqIEBldmVudCBzaXplLWNoYW5nZWRcbiAqIEBwYXJhbSB7U2l6ZX0gb2xkU2l6ZSAtIFRoZSBvbGQgc2l6ZSwgYnV0IHRoaXMgcGFyYW1ldGVyIGlzIG9ubHkgYXZhaWxhYmxlIGluIGVkaXRvciFcbiAqL1xuLyoqXG4gKiAhI2VuXG4gKiBUaGUgYW5jaG9yIGNoYW5naW5nIGV2ZW50LCB5b3UgY2FuIGxpc3RlbiB0byB0aGlzIGV2ZW50IHRocm91Z2ggdGhlIHN0YXRlbWVudCB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuQU5DSE9SX0NIQU5HRUQsIGNhbGxiYWNrLCB0aGlzKTtcbiAqICEjemhcbiAqIOmUmueCueWPmOWKqOebkeWQrOS6i+S7tu+8jOmAmui/hyB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuQU5DSE9SX0NIQU5HRUQsIGNhbGxiYWNrLCB0aGlzKTsg6L+b6KGM55uR5ZCs44CCXG4gKiBAZXZlbnQgYW5jaG9yLWNoYW5nZWRcbiAqL1xuLyoqXG4gKiAhI2VuXG4gKiBUaGUgYWRkaW5nIGNoaWxkIGV2ZW50LCB5b3UgY2FuIGxpc3RlbiB0byB0aGlzIGV2ZW50IHRocm91Z2ggdGhlIHN0YXRlbWVudCB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuQ0hJTERfQURERUQsIGNhbGxiYWNrLCB0aGlzKTtcbiAqICEjemhcbiAqIOWinuWKoOWtkOiKgueCueebkeWQrOS6i+S7tu+8jOmAmui/hyB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuQ0hJTERfQURERUQsIGNhbGxiYWNrLCB0aGlzKTsg6L+b6KGM55uR5ZCs44CCXG4gKiBAZXZlbnQgY2hpbGQtYWRkZWRcbiAqIEBwYXJhbSB7Tm9kZX0gY2hpbGQgLSBjaGlsZCB3aGljaCBoYXZlIGJlZW4gYWRkZWRcbiAqL1xuLyoqXG4gKiAhI2VuXG4gKiBUaGUgcmVtb3ZpbmcgY2hpbGQgZXZlbnQsIHlvdSBjYW4gbGlzdGVuIHRvIHRoaXMgZXZlbnQgdGhyb3VnaCB0aGUgc3RhdGVtZW50IHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5DSElMRF9SRU1PVkVELCBjYWxsYmFjaywgdGhpcyk7XG4gKiAhI3poXG4gKiDliKDpmaTlrZDoioLngrnnm5HlkKzkuovku7bvvIzpgJrov4cgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLkNISUxEX1JFTU9WRUQsIGNhbGxiYWNrLCB0aGlzKTsg6L+b6KGM55uR5ZCs44CCXG4gKiBAZXZlbnQgY2hpbGQtcmVtb3ZlZFxuICogQHBhcmFtIHtOb2RlfSBjaGlsZCAtIGNoaWxkIHdoaWNoIGhhdmUgYmVlbiByZW1vdmVkXG4gKi9cbi8qKlxuICogISNlblxuICogVGhlIHJlb3JkZXJpbmcgY2hpbGQgZXZlbnQsIHlvdSBjYW4gbGlzdGVuIHRvIHRoaXMgZXZlbnQgdGhyb3VnaCB0aGUgc3RhdGVtZW50IHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5DSElMRF9SRU9SREVSLCBjYWxsYmFjaywgdGhpcyk7XG4gKiAhI3poXG4gKiDlrZDoioLngrnpobrluo/lj5jliqjnm5HlkKzkuovku7bvvIzpgJrov4cgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLkNISUxEX1JFT1JERVIsIGNhbGxiYWNrLCB0aGlzKTsg6L+b6KGM55uR5ZCs44CCXG4gKiBAZXZlbnQgY2hpbGQtcmVvcmRlclxuICogQHBhcmFtIHtOb2RlfSBub2RlIC0gbm9kZSB3aG9zZSBjaGlsZHJlbiBoYXZlIGJlZW4gcmVvcmRlcmVkXG4gKi9cbi8qKlxuICogISNlblxuICogVGhlIGdyb3VwIGNoYW5naW5nIGV2ZW50LCB5b3UgY2FuIGxpc3RlbiB0byB0aGlzIGV2ZW50IHRocm91Z2ggdGhlIHN0YXRlbWVudCB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuR1JPVVBfQ0hBTkdFRCwgY2FsbGJhY2ssIHRoaXMpO1xuICogISN6aFxuICog6IqC54K55YiG57uE5Y+Y5Yqo55uR5ZCs5LqL5Lu277yM6YCa6L+HIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5HUk9VUF9DSEFOR0VELCBjYWxsYmFjaywgdGhpcyk7IOi/m+ihjOebkeWQrOOAglxuICogQGV2ZW50IGdyb3VwLWNoYW5nZWRcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSAtIG5vZGUgd2hvc2UgZ3JvdXAgaGFzIGNoYW5nZWRcbiAqL1xuXG4vLyBEZXByZWNhdGVkIEFQSXNcblxuLyoqXG4gKiAhI2VuXG4gKiBSZXR1cm5zIHRoZSBkaXNwbGF5ZWQgb3BhY2l0eSBvZiBOb2RlLFxuICogdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiBkaXNwbGF5ZWQgb3BhY2l0eSBhbmQgb3BhY2l0eSBpcyB0aGF0IGRpc3BsYXllZCBvcGFjaXR5IGlzIGNhbGN1bGF0ZWQgYmFzZWQgb24gb3BhY2l0eSBhbmQgcGFyZW50IG5vZGUncyBvcGFjaXR5IHdoZW4gY2FzY2FkZSBvcGFjaXR5IGVuYWJsZWQuXG4gKiAhI3poXG4gKiDojrflj5boioLngrnmmL7npLrpgI/mmI7luqbvvIxcbiAqIOaYvuekuumAj+aYjuW6puWSjOmAj+aYjuW6puS5i+mXtOeahOS4jeWQjOS5i+WkhOWcqOS6juW9k+WQr+eUqOe6p+i/numAj+aYjuW6puaXtu+8jFxuICog5pi+56S66YCP5piO5bqm5piv5Z+65LqO6Ieq6Lqr6YCP5piO5bqm5ZKM54i26IqC54K56YCP5piO5bqm6K6h566X55qE44CCXG4gKlxuICogQG1ldGhvZCBnZXREaXNwbGF5ZWRPcGFjaXR5XG4gKiBAcmV0dXJuIHtudW1iZXJ9IGRpc3BsYXllZCBvcGFjaXR5XG4gKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wLCBwbGVhc2UgdXNlIG9wYWNpdHkgcHJvcGVydHksIGNhc2NhZGUgb3BhY2l0eSBpcyByZW1vdmVkXG4gKi9cblxuLyoqXG4gKiAhI2VuXG4gKiBSZXR1cm5zIHRoZSBkaXNwbGF5ZWQgY29sb3Igb2YgTm9kZSxcbiAqIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gZGlzcGxheWVkIGNvbG9yIGFuZCBjb2xvciBpcyB0aGF0IGRpc3BsYXllZCBjb2xvciBpcyBjYWxjdWxhdGVkIGJhc2VkIG9uIGNvbG9yIGFuZCBwYXJlbnQgbm9kZSdzIGNvbG9yIHdoZW4gY2FzY2FkZSBjb2xvciBlbmFibGVkLlxuICogISN6aFxuICog6I635Y+W6IqC54K555qE5pi+56S66aKc6Imy77yMXG4gKiDmmL7npLrpopzoibLlkozpopzoibLkuYvpl7TnmoTkuI3lkIzkuYvlpITlnKjkuo7lvZPlkK/nlKjnuqfov57popzoibLml7bvvIxcbiAqIOaYvuekuuminOiJsuaYr+WfuuS6juiHqui6q+minOiJsuWSjOeItuiKgueCueminOiJsuiuoeeul+eahOOAglxuICpcbiAqIEBtZXRob2QgZ2V0RGlzcGxheWVkQ29sb3JcbiAqIEByZXR1cm4ge0NvbG9yfVxuICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMCwgcGxlYXNlIHVzZSBjb2xvciBwcm9wZXJ0eSwgY2FzY2FkZSBjb2xvciBpcyByZW1vdmVkXG4gKi9cblxuLyoqXG4gKiAhI2VuIENhc2NhZGUgb3BhY2l0eSBpcyByZW1vdmVkIGZyb20gdjIuMFxuICogSW5kaWNhdGUgd2hldGhlciBub2RlJ3Mgb3BhY2l0eSB2YWx1ZSBhZmZlY3QgaXRzIGNoaWxkIG5vZGVzLCBkZWZhdWx0IHZhbHVlIGlzIHRydWUuXG4gKiAhI3poIOmAj+aYjuW6pue6p+iBlOWKn+iDveS7jiB2Mi4wIOW8gOWni+W3suenu+mZpFxuICog6IqC54K555qE5LiN6YCP5piO5bqm5YC85piv5ZCm5b2x5ZON5YW25a2Q6IqC54K577yM6buY6K6k5YC85Li6IHRydWXjgIJcbiAqIEBwcm9wZXJ0eSBjYXNjYWRlT3BhY2l0eVxuICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMFxuICogQHR5cGUge0Jvb2xlYW59XG4gKi9cblxuLyoqXG4gKiAhI2VuIENhc2NhZGUgb3BhY2l0eSBpcyByZW1vdmVkIGZyb20gdjIuMFxuICogUmV0dXJucyB3aGV0aGVyIG5vZGUncyBvcGFjaXR5IHZhbHVlIGFmZmVjdCBpdHMgY2hpbGQgbm9kZXMuXG4gKiAhI3poIOmAj+aYjuW6pue6p+iBlOWKn+iDveS7jiB2Mi4wIOW8gOWni+W3suenu+mZpFxuICog6L+U5Zue6IqC54K555qE5LiN6YCP5piO5bqm5YC85piv5ZCm5b2x5ZON5YW25a2Q6IqC54K544CCXG4gKiBAbWV0aG9kIGlzQ2FzY2FkZU9wYWNpdHlFbmFibGVkXG4gKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbi8qKlxuICogISNlbiBDYXNjYWRlIG9wYWNpdHkgaXMgcmVtb3ZlZCBmcm9tIHYyLjBcbiAqIEVuYWJsZSBvciBkaXNhYmxlIGNhc2NhZGUgb3BhY2l0eSwgaWYgY2FzY2FkZSBlbmFibGVkLCBjaGlsZCBub2Rlcycgb3BhY2l0eSB3aWxsIGJlIHRoZSBtdWx0aXBsaWNhdGlvbiBvZiBwYXJlbnQgb3BhY2l0eSBhbmQgaXRzIG93biBvcGFjaXR5LlxuICogISN6aCDpgI/mmI7luqbnuqfogZTlip/og73ku44gdjIuMCDlvIDlp4vlt7Lnp7vpmaRcbiAqIOWQr+eUqOaIluemgeeUqOe6p+i/nuS4jemAj+aYjuW6pu+8jOWmguaenOe6p+i/nuWQr+eUqO+8jOWtkOiKgueCueeahOS4jemAj+aYjuW6puWwhuaYr+eItuS4jemAj+aYjuW6puS5mOS4iuWug+iHquW3seeahOS4jemAj+aYjuW6puOAglxuICogQG1ldGhvZCBzZXRDYXNjYWRlT3BhY2l0eUVuYWJsZWRcbiAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gY2FzY2FkZU9wYWNpdHlFbmFibGVkXG4gKi9cblxuLyoqXG4gKiAhI2VuIE9wYWNpdHkgbW9kaWZ5IFJHQiBoYXZlIGJlZW4gcmVtb3ZlZCBzaW5jZSB2Mi4wXG4gKiBTZXQgd2hldGhlciBjb2xvciBzaG91bGQgYmUgY2hhbmdlZCB3aXRoIHRoZSBvcGFjaXR5IHZhbHVlLFxuICogdXNlbGVzcyBpbiBjY3NnLk5vZGUsIGJ1dCB0aGlzIGZ1bmN0aW9uIGlzIG92ZXJyaWRlIGluIHNvbWUgY2xhc3MgdG8gaGF2ZSBzdWNoIGJlaGF2aW9yLlxuICogISN6aCDpgI/mmI7luqblvbHlk43popzoibLphY3nva7lt7Lnu4/ooqvlup/lvINcbiAqIOiuvue9ruabtOaUuemAj+aYjuW6puaXtuaYr+WQpuS/ruaUuVJHQuWAvO+8jFxuICogQG1ldGhvZCBzZXRPcGFjaXR5TW9kaWZ5UkdCXG4gKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wXG4gKiBAcGFyYW0ge0Jvb2xlYW59IG9wYWNpdHlWYWx1ZVxuICovXG5cbi8qKlxuICogISNlbiBPcGFjaXR5IG1vZGlmeSBSR0IgaGF2ZSBiZWVuIHJlbW92ZWQgc2luY2UgdjIuMFxuICogR2V0IHdoZXRoZXIgY29sb3Igc2hvdWxkIGJlIGNoYW5nZWQgd2l0aCB0aGUgb3BhY2l0eSB2YWx1ZS5cbiAqICEjemgg6YCP5piO5bqm5b2x5ZON6aKc6Imy6YWN572u5bey57uP6KKr5bqf5byDXG4gKiDojrflj5bmm7TmlLnpgI/mmI7luqbml7bmmK/lkKbkv67mlLlSR0LlgLzjgIJcbiAqIEBtZXRob2QgaXNPcGFjaXR5TW9kaWZ5UkdCXG4gKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cblxubGV0IF9wID0gTm9kZS5wcm90b3R5cGU7XG5qcy5nZXRzZXQoX3AsICdwb3NpdGlvbicsIF9wLmdldFBvc2l0aW9uLCBfcC5zZXRQb3NpdGlvbiwgZmFsc2UsIHRydWUpO1xuXG5pZiAoQ0NfRURJVE9SKSB7XG4gICAgbGV0IHZlYzNfdG1wID0gbmV3IFZlYzMoKTtcbiAgICBjYy5qcy5nZXRzZXQoX3AsICd3b3JsZEV1bGVyQW5nbGVzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgYW5nbGVzID0gbmV3IFZlYzModGhpcy5fZXVsZXJBbmdsZXMpO1xuICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy5wYXJlbnQ7XG4gICAgICAgIHdoaWxlIChwYXJlbnQpIHtcbiAgICAgICAgICAgIGFuZ2xlcy5hZGRTZWxmKHBhcmVudC5fZXVsZXJBbmdsZXMpO1xuICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYW5nbGVzO1xuICAgIH0sIGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIHZlYzNfdG1wLnNldCh2KTtcbiAgICAgICAgbGV0IHBhcmVudCA9IHRoaXMucGFyZW50O1xuICAgICAgICB3aGlsZSAocGFyZW50KSB7XG4gICAgICAgICAgICB2ZWMzX3RtcC5zdWJTZWxmKHBhcmVudC5fZXVsZXJBbmdsZXMpO1xuICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmV1bGVyQW5nbGVzID0gdmVjM190bXA7XG4gICAgfSk7XG59XG5cbmNjLk5vZGUgPSBtb2R1bGUuZXhwb3J0cyA9IE5vZGU7XG4iXX0=