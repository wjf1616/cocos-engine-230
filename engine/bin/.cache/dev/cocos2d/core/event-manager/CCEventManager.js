
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/event-manager/CCEventManager.js';
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
var js = require('../platform/js');

require('./CCEventListener');

var ListenerID = cc.EventListener.ListenerID;

var _EventListenerVector = function _EventListenerVector() {
  this._fixedListeners = [];
  this._sceneGraphListeners = [];
  this.gt0Index = 0;
};

_EventListenerVector.prototype = {
  constructor: _EventListenerVector,
  size: function size() {
    return this._fixedListeners.length + this._sceneGraphListeners.length;
  },
  empty: function empty() {
    return this._fixedListeners.length === 0 && this._sceneGraphListeners.length === 0;
  },
  push: function push(listener) {
    if (listener._getFixedPriority() === 0) this._sceneGraphListeners.push(listener);else this._fixedListeners.push(listener);
  },
  clearSceneGraphListeners: function clearSceneGraphListeners() {
    this._sceneGraphListeners.length = 0;
  },
  clearFixedListeners: function clearFixedListeners() {
    this._fixedListeners.length = 0;
  },
  clear: function clear() {
    this._sceneGraphListeners.length = 0;
    this._fixedListeners.length = 0;
  },
  getFixedPriorityListeners: function getFixedPriorityListeners() {
    return this._fixedListeners;
  },
  getSceneGraphPriorityListeners: function getSceneGraphPriorityListeners() {
    return this._sceneGraphListeners;
  }
};

var __getListenerID = function __getListenerID(event) {
  var eventType = cc.Event,
      type = event.type;
  if (type === eventType.ACCELERATION) return ListenerID.ACCELERATION;
  if (type === eventType.KEYBOARD) return ListenerID.KEYBOARD;
  if (type.startsWith(eventType.MOUSE)) return ListenerID.MOUSE;

  if (type.startsWith(eventType.TOUCH)) {
    // Touch listener is very special, it contains two kinds of listeners, EventListenerTouchOneByOne and EventListenerTouchAllAtOnce.
    // return UNKNOWN instead.
    cc.logID(2000);
  }

  return "";
};
/**
 * !#en
 * This class has been deprecated, please use cc.systemEvent or cc.EventTarget instead. See [Listen to and launch events](../../../manual/en/scripting/events.md) for details.<br>
 * <br>
 * cc.eventManager is a singleton object which manages event listener subscriptions and event dispatching.
 * The EventListener list is managed in such way so that event listeners can be added and removed
 * while events are being dispatched.
 *
 * !#zh
 * 该类已废弃，请使用 cc.systemEvent 或 cc.EventTarget 代替，详见 [监听和发射事件](../../../manual/zh/scripting/events.md)。<br>
 * <br>
 * 事件管理器，它主要管理事件监听器注册和派发系统事件。
 *
 * @class eventManager
 * @static
 * @example {@link cocos2d/core/event-manager/CCEventManager/addListener.js}
 * @deprecated
 */


var eventManager = {
  //Priority dirty flag
  DIRTY_NONE: 0,
  DIRTY_FIXED_PRIORITY: 1 << 0,
  DIRTY_SCENE_GRAPH_PRIORITY: 1 << 1,
  DIRTY_ALL: 3,
  _listenersMap: {},
  _priorityDirtyFlagMap: {},
  _nodeListenersMap: {},
  _toAddedListeners: [],
  _toRemovedListeners: [],
  _dirtyListeners: {},
  _inDispatch: 0,
  _isEnabled: false,
  _currentTouch: null,
  _internalCustomListenerIDs: [],
  _setDirtyForNode: function _setDirtyForNode(node) {
    // Mark the node dirty only when there is an event listener associated with it.
    var selListeners = this._nodeListenersMap[node._id];

    if (selListeners !== undefined) {
      for (var j = 0, len = selListeners.length; j < len; j++) {
        var selListener = selListeners[j];

        var listenerID = selListener._getListenerID();

        if (this._dirtyListeners[listenerID] == null) this._dirtyListeners[listenerID] = true;
      }
    }

    if (node.childrenCount > 0) {
      var children = node._children;

      for (var i = 0, _len = children.length; i < _len; i++) {
        this._setDirtyForNode(children[i]);
      }
    }
  },

  /**
   * !#en Pauses all listeners which are associated the specified target.
   * !#zh 暂停传入的 node 相关的所有监听器的事件响应。
   * @method pauseTarget
   * @param {Node} node
   * @param {Boolean} [recursive=false]
   */
  pauseTarget: function pauseTarget(node, recursive) {
    if (!(node instanceof cc._BaseNode)) {
      cc.warnID(3506);
      return;
    }

    var listeners = this._nodeListenersMap[node._id],
        i,
        len;

    if (listeners) {
      for (i = 0, len = listeners.length; i < len; i++) {
        listeners[i]._setPaused(true);
      }
    }

    if (recursive === true) {
      var locChildren = node._children;

      for (i = 0, len = locChildren ? locChildren.length : 0; i < len; i++) {
        this.pauseTarget(locChildren[i], true);
      }
    }
  },

  /**
   * !#en Resumes all listeners which are associated the specified target.
   * !#zh 恢复传入的 node 相关的所有监听器的事件响应。
   * @method resumeTarget
   * @param {Node} node
   * @param {Boolean} [recursive=false]
   */
  resumeTarget: function resumeTarget(node, recursive) {
    if (!(node instanceof cc._BaseNode)) {
      cc.warnID(3506);
      return;
    }

    var listeners = this._nodeListenersMap[node._id],
        i,
        len;

    if (listeners) {
      for (i = 0, len = listeners.length; i < len; i++) {
        listeners[i]._setPaused(false);
      }
    }

    this._setDirtyForNode(node);

    if (recursive === true) {
      var locChildren = node._children;

      for (i = 0, len = locChildren ? locChildren.length : 0; i < len; i++) {
        this.resumeTarget(locChildren[i], true);
      }
    }
  },
  _addListener: function _addListener(listener) {
    if (this._inDispatch === 0) this._forceAddEventListener(listener);else this._toAddedListeners.push(listener);
  },
  _forceAddEventListener: function _forceAddEventListener(listener) {
    var listenerID = listener._getListenerID();

    var listeners = this._listenersMap[listenerID];

    if (!listeners) {
      listeners = new _EventListenerVector();
      this._listenersMap[listenerID] = listeners;
    }

    listeners.push(listener);

    if (listener._getFixedPriority() === 0) {
      this._setDirty(listenerID, this.DIRTY_SCENE_GRAPH_PRIORITY);

      var node = listener._getSceneGraphPriority();

      if (node === null) cc.logID(3507);

      this._associateNodeAndEventListener(node, listener);

      if (node.activeInHierarchy) this.resumeTarget(node);
    } else this._setDirty(listenerID, this.DIRTY_FIXED_PRIORITY);
  },
  _getListeners: function _getListeners(listenerID) {
    return this._listenersMap[listenerID];
  },
  _updateDirtyFlagForSceneGraph: function _updateDirtyFlagForSceneGraph() {
    var locDirtyListeners = this._dirtyListeners;

    for (var selKey in locDirtyListeners) {
      this._setDirty(selKey, this.DIRTY_SCENE_GRAPH_PRIORITY);
    }

    this._dirtyListeners = {};
  },
  _removeAllListenersInVector: function _removeAllListenersInVector(listenerVector) {
    if (!listenerVector) return;
    var selListener;

    for (var i = listenerVector.length - 1; i >= 0; i--) {
      selListener = listenerVector[i];

      selListener._setRegistered(false);

      if (selListener._getSceneGraphPriority() != null) {
        this._dissociateNodeAndEventListener(selListener._getSceneGraphPriority(), selListener);

        selListener._setSceneGraphPriority(null); // NULL out the node pointer so we don't have any dangling pointers to destroyed nodes.

      }

      if (this._inDispatch === 0) cc.js.array.removeAt(listenerVector, i);
    }
  },
  _removeListenersForListenerID: function _removeListenersForListenerID(listenerID) {
    var listeners = this._listenersMap[listenerID],
        i;

    if (listeners) {
      var fixedPriorityListeners = listeners.getFixedPriorityListeners();
      var sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();

      this._removeAllListenersInVector(sceneGraphPriorityListeners);

      this._removeAllListenersInVector(fixedPriorityListeners); // Remove the dirty flag according the 'listenerID'.
      // No need to check whether the dispatcher is dispatching event.


      delete this._priorityDirtyFlagMap[listenerID];

      if (!this._inDispatch) {
        listeners.clear();
        delete this._listenersMap[listenerID];
      }
    }

    var locToAddedListeners = this._toAddedListeners,
        listener;

    for (i = locToAddedListeners.length - 1; i >= 0; i--) {
      listener = locToAddedListeners[i];
      if (listener && listener._getListenerID() === listenerID) cc.js.array.removeAt(locToAddedListeners, i);
    }
  },
  _sortEventListeners: function _sortEventListeners(listenerID) {
    var dirtyFlag = this.DIRTY_NONE,
        locFlagMap = this._priorityDirtyFlagMap;
    if (locFlagMap[listenerID]) dirtyFlag = locFlagMap[listenerID];

    if (dirtyFlag !== this.DIRTY_NONE) {
      // Clear the dirty flag first, if `rootNode` is null, then set its dirty flag of scene graph priority
      locFlagMap[listenerID] = this.DIRTY_NONE;
      if (dirtyFlag & this.DIRTY_FIXED_PRIORITY) this._sortListenersOfFixedPriority(listenerID);

      if (dirtyFlag & this.DIRTY_SCENE_GRAPH_PRIORITY) {
        var rootEntity = cc.director.getScene();
        if (rootEntity) this._sortListenersOfSceneGraphPriority(listenerID);
      }
    }
  },
  _sortListenersOfSceneGraphPriority: function _sortListenersOfSceneGraphPriority(listenerID) {
    var listeners = this._getListeners(listenerID);

    if (!listeners) return;
    var sceneGraphListener = listeners.getSceneGraphPriorityListeners();
    if (!sceneGraphListener || sceneGraphListener.length === 0) return; // After sort: priority < 0, > 0

    listeners.getSceneGraphPriorityListeners().sort(this._sortEventListenersOfSceneGraphPriorityDes);
  },
  _sortEventListenersOfSceneGraphPriorityDes: function _sortEventListenersOfSceneGraphPriorityDes(l1, l2) {
    var node1 = l1._getSceneGraphPriority(),
        node2 = l2._getSceneGraphPriority();

    if (!l2 || !node2 || !node2._activeInHierarchy || node2._parent === null) return -1;else if (!l1 || !node1 || !node1._activeInHierarchy || node1._parent === null) return 1;
    var p1 = node1,
        p2 = node2,
        ex = false;

    while (p1._parent._id !== p2._parent._id) {
      p1 = p1._parent._parent === null ? (ex = true) && node2 : p1._parent;
      p2 = p2._parent._parent === null ? (ex = true) && node1 : p2._parent;
    }

    if (p1._id === p2._id) {
      if (p1._id === node2._id) return -1;
      if (p1._id === node1._id) return 1;
    }

    return ex ? p1._localZOrder - p2._localZOrder : p2._localZOrder - p1._localZOrder;
  },
  _sortListenersOfFixedPriority: function _sortListenersOfFixedPriority(listenerID) {
    var listeners = this._listenersMap[listenerID];
    if (!listeners) return;
    var fixedListeners = listeners.getFixedPriorityListeners();
    if (!fixedListeners || fixedListeners.length === 0) return; // After sort: priority < 0, > 0

    fixedListeners.sort(this._sortListenersOfFixedPriorityAsc); // FIXME: Should use binary search

    var index = 0;

    for (var len = fixedListeners.length; index < len;) {
      if (fixedListeners[index]._getFixedPriority() >= 0) break;
      ++index;
    }

    listeners.gt0Index = index;
  },
  _sortListenersOfFixedPriorityAsc: function _sortListenersOfFixedPriorityAsc(l1, l2) {
    return l1._getFixedPriority() - l2._getFixedPriority();
  },
  _onUpdateListeners: function _onUpdateListeners(listeners) {
    var fixedPriorityListeners = listeners.getFixedPriorityListeners();
    var sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();
    var i,
        selListener,
        idx,
        toRemovedListeners = this._toRemovedListeners;

    if (sceneGraphPriorityListeners) {
      for (i = sceneGraphPriorityListeners.length - 1; i >= 0; i--) {
        selListener = sceneGraphPriorityListeners[i];

        if (!selListener._isRegistered()) {
          cc.js.array.removeAt(sceneGraphPriorityListeners, i); // if item in toRemove list, remove it from the list

          idx = toRemovedListeners.indexOf(selListener);
          if (idx !== -1) toRemovedListeners.splice(idx, 1);
        }
      }
    }

    if (fixedPriorityListeners) {
      for (i = fixedPriorityListeners.length - 1; i >= 0; i--) {
        selListener = fixedPriorityListeners[i];

        if (!selListener._isRegistered()) {
          cc.js.array.removeAt(fixedPriorityListeners, i); // if item in toRemove list, remove it from the list

          idx = toRemovedListeners.indexOf(selListener);
          if (idx !== -1) toRemovedListeners.splice(idx, 1);
        }
      }
    }

    if (sceneGraphPriorityListeners && sceneGraphPriorityListeners.length === 0) listeners.clearSceneGraphListeners();
    if (fixedPriorityListeners && fixedPriorityListeners.length === 0) listeners.clearFixedListeners();
  },
  frameUpdateListeners: function frameUpdateListeners() {
    var locListenersMap = this._listenersMap,
        locPriorityDirtyFlagMap = this._priorityDirtyFlagMap;

    for (var selKey in locListenersMap) {
      if (locListenersMap[selKey].empty()) {
        delete locPriorityDirtyFlagMap[selKey];
        delete locListenersMap[selKey];
      }
    }

    var locToAddedListeners = this._toAddedListeners;

    if (locToAddedListeners.length !== 0) {
      for (var i = 0, len = locToAddedListeners.length; i < len; i++) {
        this._forceAddEventListener(locToAddedListeners[i]);
      }

      locToAddedListeners.length = 0;
    }

    if (this._toRemovedListeners.length !== 0) {
      this._cleanToRemovedListeners();
    }
  },
  _updateTouchListeners: function _updateTouchListeners(event) {
    var locInDispatch = this._inDispatch;
    cc.assertID(locInDispatch > 0, 3508);
    if (locInDispatch > 1) return;
    var listeners;
    listeners = this._listenersMap[ListenerID.TOUCH_ONE_BY_ONE];

    if (listeners) {
      this._onUpdateListeners(listeners);
    }

    listeners = this._listenersMap[ListenerID.TOUCH_ALL_AT_ONCE];

    if (listeners) {
      this._onUpdateListeners(listeners);
    }

    cc.assertID(locInDispatch === 1, 3509);
    var locToAddedListeners = this._toAddedListeners;

    if (locToAddedListeners.length !== 0) {
      for (var i = 0, len = locToAddedListeners.length; i < len; i++) {
        this._forceAddEventListener(locToAddedListeners[i]);
      }

      this._toAddedListeners.length = 0;
    }

    if (this._toRemovedListeners.length !== 0) {
      this._cleanToRemovedListeners();
    }
  },
  //Remove all listeners in _toRemoveListeners list and cleanup
  _cleanToRemovedListeners: function _cleanToRemovedListeners() {
    var toRemovedListeners = this._toRemovedListeners;

    for (var i = 0; i < toRemovedListeners.length; i++) {
      var selListener = toRemovedListeners[i];

      var listeners = this._listenersMap[selListener._getListenerID()];

      if (!listeners) continue;
      var idx,
          fixedPriorityListeners = listeners.getFixedPriorityListeners(),
          sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();

      if (sceneGraphPriorityListeners) {
        idx = sceneGraphPriorityListeners.indexOf(selListener);

        if (idx !== -1) {
          sceneGraphPriorityListeners.splice(idx, 1);
        }
      }

      if (fixedPriorityListeners) {
        idx = fixedPriorityListeners.indexOf(selListener);

        if (idx !== -1) {
          fixedPriorityListeners.splice(idx, 1);
        }
      }
    }

    toRemovedListeners.length = 0;
  },
  _onTouchEventCallback: function _onTouchEventCallback(listener, argsObj) {
    // Skip if the listener was removed.
    if (!listener._isRegistered()) return false;
    var event = argsObj.event,
        selTouch = event.currentTouch;
    event.currentTarget = listener._node;
    var isClaimed = false,
        removedIdx;
    var getCode = event.getEventCode(),
        EventTouch = cc.Event.EventTouch;

    if (getCode === EventTouch.BEGAN) {
      if (!cc.macro.ENABLE_MULTI_TOUCH && eventManager._currentTouch) {
        return false;
      }

      if (listener.onTouchBegan) {
        isClaimed = listener.onTouchBegan(selTouch, event);

        if (isClaimed && listener._registered) {
          listener._claimedTouches.push(selTouch);

          eventManager._currentTouch = selTouch;
        }
      }
    } else if (listener._claimedTouches.length > 0 && (removedIdx = listener._claimedTouches.indexOf(selTouch)) !== -1) {
      isClaimed = true;

      if (!cc.macro.ENABLE_MULTI_TOUCH && eventManager._currentTouch && eventManager._currentTouch !== selTouch) {
        return false;
      }

      if (getCode === EventTouch.MOVED && listener.onTouchMoved) {
        listener.onTouchMoved(selTouch, event);
      } else if (getCode === EventTouch.ENDED) {
        if (listener.onTouchEnded) listener.onTouchEnded(selTouch, event);
        if (listener._registered) listener._claimedTouches.splice(removedIdx, 1);
        eventManager._currentTouch = null;
      } else if (getCode === EventTouch.CANCELLED) {
        if (listener.onTouchCancelled) listener.onTouchCancelled(selTouch, event);
        if (listener._registered) listener._claimedTouches.splice(removedIdx, 1);
        eventManager._currentTouch = null;
      }
    } // If the event was stopped, return directly.


    if (event.isStopped()) {
      eventManager._updateTouchListeners(event);

      return true;
    }

    if (isClaimed && listener.swallowTouches) {
      if (argsObj.needsMutableSet) argsObj.touches.splice(selTouch, 1);
      return true;
    }

    return false;
  },
  _dispatchTouchEvent: function _dispatchTouchEvent(event) {
    this._sortEventListeners(ListenerID.TOUCH_ONE_BY_ONE);

    this._sortEventListeners(ListenerID.TOUCH_ALL_AT_ONCE);

    var oneByOneListeners = this._getListeners(ListenerID.TOUCH_ONE_BY_ONE);

    var allAtOnceListeners = this._getListeners(ListenerID.TOUCH_ALL_AT_ONCE); // If there aren't any touch listeners, return directly.


    if (null === oneByOneListeners && null === allAtOnceListeners) return;
    var originalTouches = event.getTouches(),
        mutableTouches = cc.js.array.copy(originalTouches);
    var oneByOneArgsObj = {
      event: event,
      needsMutableSet: oneByOneListeners && allAtOnceListeners,
      touches: mutableTouches,
      selTouch: null
    }; //
    // process the target handlers 1st
    //

    if (oneByOneListeners) {
      for (var i = 0; i < originalTouches.length; i++) {
        event.currentTouch = originalTouches[i];
        event._propagationStopped = event._propagationImmediateStopped = false;

        this._dispatchEventToListeners(oneByOneListeners, this._onTouchEventCallback, oneByOneArgsObj);
      }
    } //
    // process standard handlers 2nd
    //


    if (allAtOnceListeners && mutableTouches.length > 0) {
      this._dispatchEventToListeners(allAtOnceListeners, this._onTouchesEventCallback, {
        event: event,
        touches: mutableTouches
      });

      if (event.isStopped()) return;
    }

    this._updateTouchListeners(event);
  },
  _onTouchesEventCallback: function _onTouchesEventCallback(listener, callbackParams) {
    // Skip if the listener was removed.
    if (!listener._registered) return false;
    var EventTouch = cc.Event.EventTouch,
        event = callbackParams.event,
        touches = callbackParams.touches,
        getCode = event.getEventCode();
    event.currentTarget = listener._node;
    if (getCode === EventTouch.BEGAN && listener.onTouchesBegan) listener.onTouchesBegan(touches, event);else if (getCode === EventTouch.MOVED && listener.onTouchesMoved) listener.onTouchesMoved(touches, event);else if (getCode === EventTouch.ENDED && listener.onTouchesEnded) listener.onTouchesEnded(touches, event);else if (getCode === EventTouch.CANCELLED && listener.onTouchesCancelled) listener.onTouchesCancelled(touches, event); // If the event was stopped, return directly.

    if (event.isStopped()) {
      eventManager._updateTouchListeners(event);

      return true;
    }

    return false;
  },
  _associateNodeAndEventListener: function _associateNodeAndEventListener(node, listener) {
    var listeners = this._nodeListenersMap[node._id];

    if (!listeners) {
      listeners = [];
      this._nodeListenersMap[node._id] = listeners;
    }

    listeners.push(listener);
  },
  _dissociateNodeAndEventListener: function _dissociateNodeAndEventListener(node, listener) {
    var listeners = this._nodeListenersMap[node._id];

    if (listeners) {
      cc.js.array.remove(listeners, listener);
      if (listeners.length === 0) delete this._nodeListenersMap[node._id];
    }
  },
  _dispatchEventToListeners: function _dispatchEventToListeners(listeners, onEvent, eventOrArgs) {
    var shouldStopPropagation = false;
    var fixedPriorityListeners = listeners.getFixedPriorityListeners();
    var sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();
    var i = 0,
        j,
        selListener;

    if (fixedPriorityListeners) {
      // priority < 0
      if (fixedPriorityListeners.length !== 0) {
        for (; i < listeners.gt0Index; ++i) {
          selListener = fixedPriorityListeners[i];

          if (selListener.isEnabled() && !selListener._isPaused() && selListener._isRegistered() && onEvent(selListener, eventOrArgs)) {
            shouldStopPropagation = true;
            break;
          }
        }
      }
    }

    if (sceneGraphPriorityListeners && !shouldStopPropagation) {
      // priority == 0, scene graph priority
      for (j = 0; j < sceneGraphPriorityListeners.length; j++) {
        selListener = sceneGraphPriorityListeners[j];

        if (selListener.isEnabled() && !selListener._isPaused() && selListener._isRegistered() && onEvent(selListener, eventOrArgs)) {
          shouldStopPropagation = true;
          break;
        }
      }
    }

    if (fixedPriorityListeners && !shouldStopPropagation) {
      // priority > 0
      for (; i < fixedPriorityListeners.length; ++i) {
        selListener = fixedPriorityListeners[i];

        if (selListener.isEnabled() && !selListener._isPaused() && selListener._isRegistered() && onEvent(selListener, eventOrArgs)) {
          shouldStopPropagation = true;
          break;
        }
      }
    }
  },
  _setDirty: function _setDirty(listenerID, flag) {
    var locDirtyFlagMap = this._priorityDirtyFlagMap;
    if (locDirtyFlagMap[listenerID] == null) locDirtyFlagMap[listenerID] = flag;else locDirtyFlagMap[listenerID] = flag | locDirtyFlagMap[listenerID];
  },
  _sortNumberAsc: function _sortNumberAsc(a, b) {
    return a - b;
  },

  /**
   * !#en Query whether the specified event listener id has been added.
   * !#zh 查询指定的事件 ID 是否存在
   * @method hasEventListener
   * @param {String|Number} listenerID - The listener id.
   * @return {Boolean} true or false
   */
  hasEventListener: function hasEventListener(listenerID) {
    return !!this._getListeners(listenerID);
  },

  /**
   * !#en
   * <p>
   * Adds a event listener for a specified event.<br/>
   * if the parameter "nodeOrPriority" is a node,
   * it means to add a event listener for a specified event with the priority of scene graph.<br/>
   * if the parameter "nodeOrPriority" is a Number,
   * it means to add a event listener for a specified event with the fixed priority.<br/>
   * </p>
   * !#zh
   * 将事件监听器添加到事件管理器中。<br/>
   * 如果参数 “nodeOrPriority” 是节点，优先级由 node 的渲染顺序决定，显示在上层的节点将优先收到事件。<br/>
   * 如果参数 “nodeOrPriority” 是数字，优先级则固定为该参数的数值，数字越小，优先级越高。<br/>
   *
   * @method addListener
   * @param {EventListener|Object} listener - The listener of a specified event or a object of some event parameters.
   * @param {Node|Number} nodeOrPriority - The priority of the listener is based on the draw order of this node or fixedPriority The fixed priority of the listener.
   * @note  The priority of scene graph will be fixed value 0. So the order of listener item in the vector will be ' <0, scene graph (0 priority), >0'.
   *         A lower priority will be called before the ones that have a higher value. 0 priority is forbidden for fixed priority since it's used for scene graph based priority.
   *         The listener must be a cc.EventListener object when adding a fixed priority listener, because we can't remove a fixed priority listener without the listener handler,
   *         except calls removeAllListeners().
   * @return {EventListener} Return the listener. Needed in order to remove the event from the dispatcher.
   */
  addListener: function addListener(listener, nodeOrPriority) {
    cc.assertID(listener && nodeOrPriority, 3503);

    if (!(cc.js.isNumber(nodeOrPriority) || nodeOrPriority instanceof cc._BaseNode)) {
      cc.warnID(3506);
      return;
    }

    if (!(listener instanceof cc.EventListener)) {
      cc.assertID(!cc.js.isNumber(nodeOrPriority), 3504);
      listener = cc.EventListener.create(listener);
    } else {
      if (listener._isRegistered()) {
        cc.logID(3505);
        return;
      }
    }

    if (!listener.checkAvailable()) return;

    if (cc.js.isNumber(nodeOrPriority)) {
      if (nodeOrPriority === 0) {
        cc.logID(3500);
        return;
      }

      listener._setSceneGraphPriority(null);

      listener._setFixedPriority(nodeOrPriority);

      listener._setRegistered(true);

      listener._setPaused(false);

      this._addListener(listener);
    } else {
      listener._setSceneGraphPriority(nodeOrPriority);

      listener._setFixedPriority(0);

      listener._setRegistered(true);

      this._addListener(listener);
    }

    return listener;
  },

  /*
   * !#en Adds a Custom event listener. It will use a fixed priority of 1.
   * !#zh 向事件管理器添加一个自定义事件监听器。
   * @method addCustomListener
   * @param {String} eventName
   * @param {Function} callback
   * @return {EventListener} the generated event. Needed in order to remove the event from the dispatcher
   */
  addCustomListener: function addCustomListener(eventName, callback) {
    var listener = new cc.EventListener.create({
      event: cc.EventListener.CUSTOM,
      eventName: eventName,
      callback: callback
    });
    this.addListener(listener, 1);
    return listener;
  },

  /**
   * !#en Remove a listener.
   * !#zh 移除一个已添加的监听器。
   * @method removeListener
   * @param {EventListener} listener - an event listener or a registered node target
   * @example {@link cocos2d/core/event-manager/CCEventManager/removeListener.js}
   */
  removeListener: function removeListener(listener) {
    if (listener == null) return;
    var isFound,
        locListener = this._listenersMap;

    for (var selKey in locListener) {
      var listeners = locListener[selKey];
      var fixedPriorityListeners = listeners.getFixedPriorityListeners(),
          sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();
      isFound = this._removeListenerInVector(sceneGraphPriorityListeners, listener);

      if (isFound) {
        // fixed #4160: Dirty flag need to be updated after listeners were removed.
        this._setDirty(listener._getListenerID(), this.DIRTY_SCENE_GRAPH_PRIORITY);
      } else {
        isFound = this._removeListenerInVector(fixedPriorityListeners, listener);
        if (isFound) this._setDirty(listener._getListenerID(), this.DIRTY_FIXED_PRIORITY);
      }

      if (listeners.empty()) {
        delete this._priorityDirtyFlagMap[listener._getListenerID()];
        delete locListener[selKey];
      }

      if (isFound) break;
    }

    if (!isFound) {
      var locToAddedListeners = this._toAddedListeners;

      for (var i = locToAddedListeners.length - 1; i >= 0; i--) {
        var selListener = locToAddedListeners[i];

        if (selListener === listener) {
          cc.js.array.removeAt(locToAddedListeners, i);

          selListener._setRegistered(false);

          break;
        }
      }
    }
  },
  _removeListenerInCallback: function _removeListenerInCallback(listeners, callback) {
    if (listeners == null) return false;

    for (var i = listeners.length - 1; i >= 0; i--) {
      var selListener = listeners[i];

      if (selListener._onCustomEvent === callback || selListener._onEvent === callback) {
        selListener._setRegistered(false);

        if (selListener._getSceneGraphPriority() != null) {
          this._dissociateNodeAndEventListener(selListener._getSceneGraphPriority(), selListener);

          selListener._setSceneGraphPriority(null); // NULL out the node pointer so we don't have any dangling pointers to destroyed nodes.

        }

        if (this._inDispatch === 0) cc.js.array.removeAt(listeners, i);else this._toRemovedListeners.push(selListener);
        return true;
      }
    }

    return false;
  },
  _removeListenerInVector: function _removeListenerInVector(listeners, listener) {
    if (listeners == null) return false;

    for (var i = listeners.length - 1; i >= 0; i--) {
      var selListener = listeners[i];

      if (selListener === listener) {
        selListener._setRegistered(false);

        if (selListener._getSceneGraphPriority() != null) {
          this._dissociateNodeAndEventListener(selListener._getSceneGraphPriority(), selListener);

          selListener._setSceneGraphPriority(null); // NULL out the node pointer so we don't have any dangling pointers to destroyed nodes.

        }

        if (this._inDispatch === 0) cc.js.array.removeAt(listeners, i);else this._toRemovedListeners.push(selListener);
        return true;
      }
    }

    return false;
  },

  /**
   * !#en Removes all listeners with the same event listener type or removes all listeners of a node.
   * !#zh
   * 移除注册到 eventManager 中指定类型的所有事件监听器。<br/>
   * 1. 如果传入的第一个参数类型是 Node，那么事件管理器将移除与该对象相关的所有事件监听器。
   * （如果第二参数 recursive 是 true 的话，就会连同该对象的子控件上所有的事件监听器也一并移除）<br/>
   * 2. 如果传入的第一个参数类型是 Number（该类型 EventListener 中定义的事件类型），
   * 那么事件管理器将移除该类型的所有事件监听器。<br/>
   *
   * 下列是目前存在监听器类型：       <br/>
   * cc.EventListener.UNKNOWN       <br/>
   * cc.EventListener.KEYBOARD      <br/>
   * cc.EventListener.ACCELERATION，<br/>
   *
   * @method removeListeners
   * @param {Number|Node} listenerType - listenerType or a node
   * @param {Boolean} [recursive=false]
   */
  removeListeners: function removeListeners(listenerType, recursive) {
    var i,
        _t = this;

    if (!(cc.js.isNumber(listenerType) || listenerType instanceof cc._BaseNode)) {
      cc.warnID(3506);
      return;
    }

    if (listenerType._id !== undefined) {
      // Ensure the node is removed from these immediately also.
      // Don't want any dangling pointers or the possibility of dealing with deleted objects..
      var listeners = _t._nodeListenersMap[listenerType._id],
          i;

      if (listeners) {
        var listenersCopy = cc.js.array.copy(listeners);

        for (i = 0; i < listenersCopy.length; i++) {
          _t.removeListener(listenersCopy[i]);
        }

        delete _t._nodeListenersMap[listenerType._id];
      } // Bug fix: ensure there are no references to the node in the list of listeners to be added.
      // If we find any listeners associated with the destroyed node in this list then remove them.
      // This is to catch the scenario where the node gets destroyed before it's listener
      // is added into the event dispatcher fully. This could happen if a node registers a listener
      // and gets destroyed while we are dispatching an event (touch etc.)


      var locToAddedListeners = _t._toAddedListeners;

      for (i = 0; i < locToAddedListeners.length;) {
        var listener = locToAddedListeners[i];

        if (listener._getSceneGraphPriority() === listenerType) {
          listener._setSceneGraphPriority(null); // Ensure no dangling ptr to the target node.


          listener._setRegistered(false);

          locToAddedListeners.splice(i, 1);
        } else ++i;
      }

      if (recursive === true) {
        var locChildren = listenerType.children,
            len;

        for (i = 0, len = locChildren.length; i < len; i++) {
          _t.removeListeners(locChildren[i], true);
        }
      }
    } else {
      if (listenerType === cc.EventListener.TOUCH_ONE_BY_ONE) _t._removeListenersForListenerID(ListenerID.TOUCH_ONE_BY_ONE);else if (listenerType === cc.EventListener.TOUCH_ALL_AT_ONCE) _t._removeListenersForListenerID(ListenerID.TOUCH_ALL_AT_ONCE);else if (listenerType === cc.EventListener.MOUSE) _t._removeListenersForListenerID(ListenerID.MOUSE);else if (listenerType === cc.EventListener.ACCELERATION) _t._removeListenersForListenerID(ListenerID.ACCELERATION);else if (listenerType === cc.EventListener.KEYBOARD) _t._removeListenersForListenerID(ListenerID.KEYBOARD);else cc.logID(3501);
    }
  },

  /*
   * !#en Removes all custom listeners with the same event name.
   * !#zh 移除同一事件名的自定义事件监听器。
   * @method removeCustomListeners
   * @param {String} customEventName
   */
  removeCustomListeners: function removeCustomListeners(customEventName) {
    this._removeListenersForListenerID(customEventName);
  },

  /**
   * !#en Removes all listeners
   * !#zh 移除所有事件监听器。
   * @method removeAllListeners
   */
  removeAllListeners: function removeAllListeners() {
    var locListeners = this._listenersMap,
        locInternalCustomEventIDs = this._internalCustomListenerIDs;

    for (var selKey in locListeners) {
      if (locInternalCustomEventIDs.indexOf(selKey) === -1) this._removeListenersForListenerID(selKey);
    }
  },

  /**
   * !#en Sets listener's priority with fixed value.
   * !#zh 设置 FixedPriority 类型监听器的优先级。
   * @method setPriority
   * @param {EventListener} listener
   * @param {Number} fixedPriority
   */
  setPriority: function setPriority(listener, fixedPriority) {
    if (listener == null) return;
    var locListeners = this._listenersMap;

    for (var selKey in locListeners) {
      var selListeners = locListeners[selKey];
      var fixedPriorityListeners = selListeners.getFixedPriorityListeners();

      if (fixedPriorityListeners) {
        var found = fixedPriorityListeners.indexOf(listener);

        if (found !== -1) {
          if (listener._getSceneGraphPriority() != null) cc.logID(3502);

          if (listener._getFixedPriority() !== fixedPriority) {
            listener._setFixedPriority(fixedPriority);

            this._setDirty(listener._getListenerID(), this.DIRTY_FIXED_PRIORITY);
          }

          return;
        }
      }
    }
  },

  /**
   * !#en Whether to enable dispatching events
   * !#zh 启用或禁用事件管理器，禁用后不会分发任何事件。
   * @method setEnabled
   * @param {Boolean} enabled
   */
  setEnabled: function setEnabled(enabled) {
    this._isEnabled = enabled;
  },

  /**
   * !#en Checks whether dispatching events is enabled
   * !#zh 检测事件管理器是否启用。
   * @method isEnabled
   * @returns {Boolean}
   */
  isEnabled: function isEnabled() {
    return this._isEnabled;
  },

  /*
   * !#en Dispatches the event, also removes all EventListeners marked for deletion from the event dispatcher list.
   * !#zh 分发事件。
   * @method dispatchEvent
   * @param {Event} event
   */
  dispatchEvent: function dispatchEvent(event) {
    if (!this._isEnabled) return;

    this._updateDirtyFlagForSceneGraph();

    this._inDispatch++;

    if (!event || !event.getType) {
      cc.errorID(3511);
      return;
    }

    if (event.getType().startsWith(cc.Event.TOUCH)) {
      this._dispatchTouchEvent(event);

      this._inDispatch--;
      return;
    }

    var listenerID = __getListenerID(event);

    this._sortEventListeners(listenerID);

    var selListeners = this._listenersMap[listenerID];

    if (selListeners != null) {
      this._dispatchEventToListeners(selListeners, this._onListenerCallback, event);

      this._onUpdateListeners(selListeners);
    }

    this._inDispatch--;
  },
  _onListenerCallback: function _onListenerCallback(listener, event) {
    event.currentTarget = listener._target;

    listener._onEvent(event);

    return event.isStopped();
  },

  /*
   * !#en Dispatches a Custom Event with a event name an optional user data
   * !#zh 分发自定义事件。
   * @method dispatchCustomEvent
   * @param {String} eventName
   * @param {*} optionalUserData
   */
  dispatchCustomEvent: function dispatchCustomEvent(eventName, optionalUserData) {
    var ev = new cc.Event.EventCustom(eventName);
    ev.setUserData(optionalUserData);
    this.dispatchEvent(ev);
  }
};
js.get(cc, 'eventManager', function () {
  cc.warnID(1405, 'cc.eventManager', 'cc.EventTarget or cc.systemEvent');
  return eventManager;
});
module.exports = eventManager;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDRXZlbnRNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbImpzIiwicmVxdWlyZSIsIkxpc3RlbmVySUQiLCJjYyIsIkV2ZW50TGlzdGVuZXIiLCJfRXZlbnRMaXN0ZW5lclZlY3RvciIsIl9maXhlZExpc3RlbmVycyIsIl9zY2VuZUdyYXBoTGlzdGVuZXJzIiwiZ3QwSW5kZXgiLCJwcm90b3R5cGUiLCJjb25zdHJ1Y3RvciIsInNpemUiLCJsZW5ndGgiLCJlbXB0eSIsInB1c2giLCJsaXN0ZW5lciIsIl9nZXRGaXhlZFByaW9yaXR5IiwiY2xlYXJTY2VuZUdyYXBoTGlzdGVuZXJzIiwiY2xlYXJGaXhlZExpc3RlbmVycyIsImNsZWFyIiwiZ2V0Rml4ZWRQcmlvcml0eUxpc3RlbmVycyIsImdldFNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycyIsIl9fZ2V0TGlzdGVuZXJJRCIsImV2ZW50IiwiZXZlbnRUeXBlIiwiRXZlbnQiLCJ0eXBlIiwiQUNDRUxFUkFUSU9OIiwiS0VZQk9BUkQiLCJzdGFydHNXaXRoIiwiTU9VU0UiLCJUT1VDSCIsImxvZ0lEIiwiZXZlbnRNYW5hZ2VyIiwiRElSVFlfTk9ORSIsIkRJUlRZX0ZJWEVEX1BSSU9SSVRZIiwiRElSVFlfU0NFTkVfR1JBUEhfUFJJT1JJVFkiLCJESVJUWV9BTEwiLCJfbGlzdGVuZXJzTWFwIiwiX3ByaW9yaXR5RGlydHlGbGFnTWFwIiwiX25vZGVMaXN0ZW5lcnNNYXAiLCJfdG9BZGRlZExpc3RlbmVycyIsIl90b1JlbW92ZWRMaXN0ZW5lcnMiLCJfZGlydHlMaXN0ZW5lcnMiLCJfaW5EaXNwYXRjaCIsIl9pc0VuYWJsZWQiLCJfY3VycmVudFRvdWNoIiwiX2ludGVybmFsQ3VzdG9tTGlzdGVuZXJJRHMiLCJfc2V0RGlydHlGb3JOb2RlIiwibm9kZSIsInNlbExpc3RlbmVycyIsIl9pZCIsInVuZGVmaW5lZCIsImoiLCJsZW4iLCJzZWxMaXN0ZW5lciIsImxpc3RlbmVySUQiLCJfZ2V0TGlzdGVuZXJJRCIsImNoaWxkcmVuQ291bnQiLCJjaGlsZHJlbiIsIl9jaGlsZHJlbiIsImkiLCJwYXVzZVRhcmdldCIsInJlY3Vyc2l2ZSIsIl9CYXNlTm9kZSIsIndhcm5JRCIsImxpc3RlbmVycyIsIl9zZXRQYXVzZWQiLCJsb2NDaGlsZHJlbiIsInJlc3VtZVRhcmdldCIsIl9hZGRMaXN0ZW5lciIsIl9mb3JjZUFkZEV2ZW50TGlzdGVuZXIiLCJfc2V0RGlydHkiLCJfZ2V0U2NlbmVHcmFwaFByaW9yaXR5IiwiX2Fzc29jaWF0ZU5vZGVBbmRFdmVudExpc3RlbmVyIiwiYWN0aXZlSW5IaWVyYXJjaHkiLCJfZ2V0TGlzdGVuZXJzIiwiX3VwZGF0ZURpcnR5RmxhZ0ZvclNjZW5lR3JhcGgiLCJsb2NEaXJ0eUxpc3RlbmVycyIsInNlbEtleSIsIl9yZW1vdmVBbGxMaXN0ZW5lcnNJblZlY3RvciIsImxpc3RlbmVyVmVjdG9yIiwiX3NldFJlZ2lzdGVyZWQiLCJfZGlzc29jaWF0ZU5vZGVBbmRFdmVudExpc3RlbmVyIiwiX3NldFNjZW5lR3JhcGhQcmlvcml0eSIsImFycmF5IiwicmVtb3ZlQXQiLCJfcmVtb3ZlTGlzdGVuZXJzRm9yTGlzdGVuZXJJRCIsImZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMiLCJzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMiLCJsb2NUb0FkZGVkTGlzdGVuZXJzIiwiX3NvcnRFdmVudExpc3RlbmVycyIsImRpcnR5RmxhZyIsImxvY0ZsYWdNYXAiLCJfc29ydExpc3RlbmVyc09mRml4ZWRQcmlvcml0eSIsInJvb3RFbnRpdHkiLCJkaXJlY3RvciIsImdldFNjZW5lIiwiX3NvcnRMaXN0ZW5lcnNPZlNjZW5lR3JhcGhQcmlvcml0eSIsInNjZW5lR3JhcGhMaXN0ZW5lciIsInNvcnQiLCJfc29ydEV2ZW50TGlzdGVuZXJzT2ZTY2VuZUdyYXBoUHJpb3JpdHlEZXMiLCJsMSIsImwyIiwibm9kZTEiLCJub2RlMiIsIl9hY3RpdmVJbkhpZXJhcmNoeSIsIl9wYXJlbnQiLCJwMSIsInAyIiwiZXgiLCJfbG9jYWxaT3JkZXIiLCJmaXhlZExpc3RlbmVycyIsIl9zb3J0TGlzdGVuZXJzT2ZGaXhlZFByaW9yaXR5QXNjIiwiaW5kZXgiLCJfb25VcGRhdGVMaXN0ZW5lcnMiLCJpZHgiLCJ0b1JlbW92ZWRMaXN0ZW5lcnMiLCJfaXNSZWdpc3RlcmVkIiwiaW5kZXhPZiIsInNwbGljZSIsImZyYW1lVXBkYXRlTGlzdGVuZXJzIiwibG9jTGlzdGVuZXJzTWFwIiwibG9jUHJpb3JpdHlEaXJ0eUZsYWdNYXAiLCJfY2xlYW5Ub1JlbW92ZWRMaXN0ZW5lcnMiLCJfdXBkYXRlVG91Y2hMaXN0ZW5lcnMiLCJsb2NJbkRpc3BhdGNoIiwiYXNzZXJ0SUQiLCJUT1VDSF9PTkVfQllfT05FIiwiVE9VQ0hfQUxMX0FUX09OQ0UiLCJfb25Ub3VjaEV2ZW50Q2FsbGJhY2siLCJhcmdzT2JqIiwic2VsVG91Y2giLCJjdXJyZW50VG91Y2giLCJjdXJyZW50VGFyZ2V0IiwiX25vZGUiLCJpc0NsYWltZWQiLCJyZW1vdmVkSWR4IiwiZ2V0Q29kZSIsImdldEV2ZW50Q29kZSIsIkV2ZW50VG91Y2giLCJCRUdBTiIsIm1hY3JvIiwiRU5BQkxFX01VTFRJX1RPVUNIIiwib25Ub3VjaEJlZ2FuIiwiX3JlZ2lzdGVyZWQiLCJfY2xhaW1lZFRvdWNoZXMiLCJNT1ZFRCIsIm9uVG91Y2hNb3ZlZCIsIkVOREVEIiwib25Ub3VjaEVuZGVkIiwiQ0FOQ0VMTEVEIiwib25Ub3VjaENhbmNlbGxlZCIsImlzU3RvcHBlZCIsInN3YWxsb3dUb3VjaGVzIiwibmVlZHNNdXRhYmxlU2V0IiwidG91Y2hlcyIsIl9kaXNwYXRjaFRvdWNoRXZlbnQiLCJvbmVCeU9uZUxpc3RlbmVycyIsImFsbEF0T25jZUxpc3RlbmVycyIsIm9yaWdpbmFsVG91Y2hlcyIsImdldFRvdWNoZXMiLCJtdXRhYmxlVG91Y2hlcyIsImNvcHkiLCJvbmVCeU9uZUFyZ3NPYmoiLCJfcHJvcGFnYXRpb25TdG9wcGVkIiwiX3Byb3BhZ2F0aW9uSW1tZWRpYXRlU3RvcHBlZCIsIl9kaXNwYXRjaEV2ZW50VG9MaXN0ZW5lcnMiLCJfb25Ub3VjaGVzRXZlbnRDYWxsYmFjayIsImNhbGxiYWNrUGFyYW1zIiwib25Ub3VjaGVzQmVnYW4iLCJvblRvdWNoZXNNb3ZlZCIsIm9uVG91Y2hlc0VuZGVkIiwib25Ub3VjaGVzQ2FuY2VsbGVkIiwicmVtb3ZlIiwib25FdmVudCIsImV2ZW50T3JBcmdzIiwic2hvdWxkU3RvcFByb3BhZ2F0aW9uIiwiaXNFbmFibGVkIiwiX2lzUGF1c2VkIiwiZmxhZyIsImxvY0RpcnR5RmxhZ01hcCIsIl9zb3J0TnVtYmVyQXNjIiwiYSIsImIiLCJoYXNFdmVudExpc3RlbmVyIiwiYWRkTGlzdGVuZXIiLCJub2RlT3JQcmlvcml0eSIsImlzTnVtYmVyIiwiY3JlYXRlIiwiY2hlY2tBdmFpbGFibGUiLCJfc2V0Rml4ZWRQcmlvcml0eSIsImFkZEN1c3RvbUxpc3RlbmVyIiwiZXZlbnROYW1lIiwiY2FsbGJhY2siLCJDVVNUT00iLCJyZW1vdmVMaXN0ZW5lciIsImlzRm91bmQiLCJsb2NMaXN0ZW5lciIsIl9yZW1vdmVMaXN0ZW5lckluVmVjdG9yIiwiX3JlbW92ZUxpc3RlbmVySW5DYWxsYmFjayIsIl9vbkN1c3RvbUV2ZW50IiwiX29uRXZlbnQiLCJyZW1vdmVMaXN0ZW5lcnMiLCJsaXN0ZW5lclR5cGUiLCJfdCIsImxpc3RlbmVyc0NvcHkiLCJyZW1vdmVDdXN0b21MaXN0ZW5lcnMiLCJjdXN0b21FdmVudE5hbWUiLCJyZW1vdmVBbGxMaXN0ZW5lcnMiLCJsb2NMaXN0ZW5lcnMiLCJsb2NJbnRlcm5hbEN1c3RvbUV2ZW50SURzIiwic2V0UHJpb3JpdHkiLCJmaXhlZFByaW9yaXR5IiwiZm91bmQiLCJzZXRFbmFibGVkIiwiZW5hYmxlZCIsImRpc3BhdGNoRXZlbnQiLCJnZXRUeXBlIiwiZXJyb3JJRCIsIl9vbkxpc3RlbmVyQ2FsbGJhY2siLCJfdGFyZ2V0IiwiZGlzcGF0Y2hDdXN0b21FdmVudCIsIm9wdGlvbmFsVXNlckRhdGEiLCJldiIsIkV2ZW50Q3VzdG9tIiwic2V0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SyxtQkFBbEQsRUFBdUVyTSxLQUF2RTs7QUFDQSxXQUFLNEYsa0JBQUwsQ0FBd0JqRSxZQUF4QjtBQUNIOztBQUVELFNBQUtOLFdBQUw7QUFDSCxHQTc1QmM7QUErNUJmZ0wsRUFBQUEsbUJBQW1CLEVBQUUsNkJBQVM3TSxRQUFULEVBQW1CUSxLQUFuQixFQUF5QjtBQUMxQ0EsSUFBQUEsS0FBSyxDQUFDK0csYUFBTixHQUFzQnZILFFBQVEsQ0FBQzhNLE9BQS9COztBQUNBOU0sSUFBQUEsUUFBUSxDQUFDMkwsUUFBVCxDQUFrQm5MLEtBQWxCOztBQUNBLFdBQU9BLEtBQUssQ0FBQ2tJLFNBQU4sRUFBUDtBQUNILEdBbjZCYzs7QUFxNkJmOzs7Ozs7O0FBT0FxRSxFQUFBQSxtQkFBbUIsRUFBRSw2QkFBVTdCLFNBQVYsRUFBcUI4QixnQkFBckIsRUFBdUM7QUFDeEQsUUFBSUMsRUFBRSxHQUFHLElBQUk3TixFQUFFLENBQUNzQixLQUFILENBQVN3TSxXQUFiLENBQXlCaEMsU0FBekIsQ0FBVDtBQUNBK0IsSUFBQUEsRUFBRSxDQUFDRSxXQUFILENBQWVILGdCQUFmO0FBQ0EsU0FBS04sYUFBTCxDQUFtQk8sRUFBbkI7QUFDSDtBQWg3QmMsQ0FBbkI7QUFvN0JBaE8sRUFBRSxDQUFDbU8sR0FBSCxDQUFPaE8sRUFBUCxFQUFXLGNBQVgsRUFBMkIsWUFBWTtBQUNuQ0EsRUFBQUEsRUFBRSxDQUFDOEQsTUFBSCxDQUFVLElBQVYsRUFBZ0IsaUJBQWhCLEVBQW1DLGtDQUFuQztBQUNBLFNBQU9oQyxZQUFQO0FBQ0gsQ0FIRDtBQUtBbU0sTUFBTSxDQUFDQyxPQUFQLEdBQWlCcE0sWUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG52YXIganMgPSByZXF1aXJlKCcuLi9wbGF0Zm9ybS9qcycpO1xucmVxdWlyZSgnLi9DQ0V2ZW50TGlzdGVuZXInKTtcbnZhciBMaXN0ZW5lcklEID0gY2MuRXZlbnRMaXN0ZW5lci5MaXN0ZW5lcklEO1xuXG52YXIgX0V2ZW50TGlzdGVuZXJWZWN0b3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fZml4ZWRMaXN0ZW5lcnMgPSBbXTtcbiAgICB0aGlzLl9zY2VuZUdyYXBoTGlzdGVuZXJzID0gW107XG4gICAgdGhpcy5ndDBJbmRleCA9IDA7XG59O1xuX0V2ZW50TGlzdGVuZXJWZWN0b3IucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBfRXZlbnRMaXN0ZW5lclZlY3RvcixcbiAgICBzaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9maXhlZExpc3RlbmVycy5sZW5ndGggKyB0aGlzLl9zY2VuZUdyYXBoTGlzdGVuZXJzLmxlbmd0aDtcbiAgICB9LFxuXG4gICAgZW1wdHk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLl9maXhlZExpc3RlbmVycy5sZW5ndGggPT09IDApICYmICh0aGlzLl9zY2VuZUdyYXBoTGlzdGVuZXJzLmxlbmd0aCA9PT0gMCk7XG4gICAgfSxcblxuICAgIHB1c2g6IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgICBpZiAobGlzdGVuZXIuX2dldEZpeGVkUHJpb3JpdHkoKSA9PT0gMClcbiAgICAgICAgICAgIHRoaXMuX3NjZW5lR3JhcGhMaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXMuX2ZpeGVkTGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICAgIH0sXG5cbiAgICBjbGVhclNjZW5lR3JhcGhMaXN0ZW5lcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fc2NlbmVHcmFwaExpc3RlbmVycy5sZW5ndGggPSAwO1xuICAgIH0sXG5cbiAgICBjbGVhckZpeGVkTGlzdGVuZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2ZpeGVkTGlzdGVuZXJzLmxlbmd0aCA9IDA7XG4gICAgfSxcblxuICAgIGNsZWFyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3NjZW5lR3JhcGhMaXN0ZW5lcnMubGVuZ3RoID0gMDtcbiAgICAgICAgdGhpcy5fZml4ZWRMaXN0ZW5lcnMubGVuZ3RoID0gMDtcbiAgICB9LFxuXG4gICAgZ2V0Rml4ZWRQcmlvcml0eUxpc3RlbmVyczogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZml4ZWRMaXN0ZW5lcnM7XG4gICAgfSxcblxuICAgIGdldFNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVyczogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2NlbmVHcmFwaExpc3RlbmVycztcbiAgICB9XG59O1xuXG52YXIgX19nZXRMaXN0ZW5lcklEID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIGV2ZW50VHlwZSA9IGNjLkV2ZW50LCB0eXBlID0gZXZlbnQudHlwZTtcbiAgICBpZiAodHlwZSA9PT0gZXZlbnRUeXBlLkFDQ0VMRVJBVElPTilcbiAgICAgICAgcmV0dXJuIExpc3RlbmVySUQuQUNDRUxFUkFUSU9OO1xuICAgIGlmICh0eXBlID09PSBldmVudFR5cGUuS0VZQk9BUkQpXG4gICAgICAgIHJldHVybiBMaXN0ZW5lcklELktFWUJPQVJEO1xuICAgIGlmICh0eXBlLnN0YXJ0c1dpdGgoZXZlbnRUeXBlLk1PVVNFKSlcbiAgICAgICAgcmV0dXJuIExpc3RlbmVySUQuTU9VU0U7XG4gICAgaWYgKHR5cGUuc3RhcnRzV2l0aChldmVudFR5cGUuVE9VQ0gpKXtcbiAgICAgICAgLy8gVG91Y2ggbGlzdGVuZXIgaXMgdmVyeSBzcGVjaWFsLCBpdCBjb250YWlucyB0d28ga2luZHMgb2YgbGlzdGVuZXJzLCBFdmVudExpc3RlbmVyVG91Y2hPbmVCeU9uZSBhbmQgRXZlbnRMaXN0ZW5lclRvdWNoQWxsQXRPbmNlLlxuICAgICAgICAvLyByZXR1cm4gVU5LTk9XTiBpbnN0ZWFkLlxuICAgICAgICBjYy5sb2dJRCgyMDAwKTtcbiAgICB9XG4gICAgcmV0dXJuIFwiXCI7XG59O1xuXG4vKipcbiAqICEjZW5cbiAqIFRoaXMgY2xhc3MgaGFzIGJlZW4gZGVwcmVjYXRlZCwgcGxlYXNlIHVzZSBjYy5zeXN0ZW1FdmVudCBvciBjYy5FdmVudFRhcmdldCBpbnN0ZWFkLiBTZWUgW0xpc3RlbiB0byBhbmQgbGF1bmNoIGV2ZW50c10oLi4vLi4vLi4vbWFudWFsL2VuL3NjcmlwdGluZy9ldmVudHMubWQpIGZvciBkZXRhaWxzLjxicj5cbiAqIDxicj5cbiAqIGNjLmV2ZW50TWFuYWdlciBpcyBhIHNpbmdsZXRvbiBvYmplY3Qgd2hpY2ggbWFuYWdlcyBldmVudCBsaXN0ZW5lciBzdWJzY3JpcHRpb25zIGFuZCBldmVudCBkaXNwYXRjaGluZy5cbiAqIFRoZSBFdmVudExpc3RlbmVyIGxpc3QgaXMgbWFuYWdlZCBpbiBzdWNoIHdheSBzbyB0aGF0IGV2ZW50IGxpc3RlbmVycyBjYW4gYmUgYWRkZWQgYW5kIHJlbW92ZWRcbiAqIHdoaWxlIGV2ZW50cyBhcmUgYmVpbmcgZGlzcGF0Y2hlZC5cbiAqXG4gKiAhI3poXG4gKiDor6Xnsbvlt7Llup/lvIPvvIzor7fkvb/nlKggY2Muc3lzdGVtRXZlbnQg5oiWIGNjLkV2ZW50VGFyZ2V0IOS7o+abv++8jOivpuingSBb55uR5ZCs5ZKM5Y+R5bCE5LqL5Lu2XSguLi8uLi8uLi9tYW51YWwvemgvc2NyaXB0aW5nL2V2ZW50cy5tZCnjgII8YnI+XG4gKiA8YnI+XG4gKiDkuovku7bnrqHnkIblmajvvIzlroPkuLvopoHnrqHnkIbkuovku7bnm5HlkKzlmajms6jlhozlkozmtL7lj5Hns7vnu5/kuovku7bjgIJcbiAqXG4gKiBAY2xhc3MgZXZlbnRNYW5hZ2VyXG4gKiBAc3RhdGljXG4gKiBAZXhhbXBsZSB7QGxpbmsgY29jb3MyZC9jb3JlL2V2ZW50LW1hbmFnZXIvQ0NFdmVudE1hbmFnZXIvYWRkTGlzdGVuZXIuanN9XG4gKiBAZGVwcmVjYXRlZFxuICovXG52YXIgZXZlbnRNYW5hZ2VyID0ge1xuICAgIC8vUHJpb3JpdHkgZGlydHkgZmxhZ1xuICAgIERJUlRZX05PTkU6IDAsXG4gICAgRElSVFlfRklYRURfUFJJT1JJVFk6IDEgPDwgMCxcbiAgICBESVJUWV9TQ0VORV9HUkFQSF9QUklPUklUWTogMSA8PCAxLFxuICAgIERJUlRZX0FMTDogMyxcbiAgICBcbiAgICBfbGlzdGVuZXJzTWFwOiB7fSxcbiAgICBfcHJpb3JpdHlEaXJ0eUZsYWdNYXA6IHt9LFxuICAgIF9ub2RlTGlzdGVuZXJzTWFwOiB7fSxcbiAgICBfdG9BZGRlZExpc3RlbmVyczogW10sXG4gICAgX3RvUmVtb3ZlZExpc3RlbmVyczogW10sXG4gICAgX2RpcnR5TGlzdGVuZXJzOiB7fSxcbiAgICBfaW5EaXNwYXRjaDogMCxcbiAgICBfaXNFbmFibGVkOiBmYWxzZSxcbiAgICBfY3VycmVudFRvdWNoOiBudWxsLFxuXG4gICAgX2ludGVybmFsQ3VzdG9tTGlzdGVuZXJJRHM6W10sXG5cbiAgICBfc2V0RGlydHlGb3JOb2RlOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAvLyBNYXJrIHRoZSBub2RlIGRpcnR5IG9ubHkgd2hlbiB0aGVyZSBpcyBhbiBldmVudCBsaXN0ZW5lciBhc3NvY2lhdGVkIHdpdGggaXQuXG4gICAgICAgIGxldCBzZWxMaXN0ZW5lcnMgPSB0aGlzLl9ub2RlTGlzdGVuZXJzTWFwW25vZGUuX2lkXTtcbiAgICAgICAgaWYgKHNlbExpc3RlbmVycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gc2VsTGlzdGVuZXJzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNlbExpc3RlbmVyID0gc2VsTGlzdGVuZXJzW2pdO1xuICAgICAgICAgICAgICAgIGxldCBsaXN0ZW5lcklEID0gc2VsTGlzdGVuZXIuX2dldExpc3RlbmVySUQoKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZGlydHlMaXN0ZW5lcnNbbGlzdGVuZXJJRF0gPT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGlydHlMaXN0ZW5lcnNbbGlzdGVuZXJJRF0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLmNoaWxkcmVuQ291bnQgPiAwKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGRyZW4gPSBub2RlLl9jaGlsZHJlbjtcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDAsIGxlbiA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgICAgICAgIHRoaXMuX3NldERpcnR5Rm9yTm9kZShjaGlsZHJlbltpXSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBQYXVzZXMgYWxsIGxpc3RlbmVycyB3aGljaCBhcmUgYXNzb2NpYXRlZCB0aGUgc3BlY2lmaWVkIHRhcmdldC5cbiAgICAgKiAhI3poIOaaguWBnOS8oOWFpeeahCBub2RlIOebuOWFs+eahOaJgOacieebkeWQrOWZqOeahOS6i+S7tuWTjeW6lOOAglxuICAgICAqIEBtZXRob2QgcGF1c2VUYXJnZXRcbiAgICAgKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtyZWN1cnNpdmU9ZmFsc2VdXG4gICAgICovXG4gICAgcGF1c2VUYXJnZXQ6IGZ1bmN0aW9uIChub2RlLCByZWN1cnNpdmUpIHtcbiAgICAgICAgaWYgKCEobm9kZSBpbnN0YW5jZW9mIGNjLl9CYXNlTm9kZSkpIHtcbiAgICAgICAgICAgIGNjLndhcm5JRCgzNTA2KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fbm9kZUxpc3RlbmVyc01hcFtub2RlLl9pZF0sIGksIGxlbjtcbiAgICAgICAgaWYgKGxpc3RlbmVycykge1xuICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgICAgICAgIGxpc3RlbmVyc1tpXS5fc2V0UGF1c2VkKHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWN1cnNpdmUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHZhciBsb2NDaGlsZHJlbiA9IG5vZGUuX2NoaWxkcmVuO1xuICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gbG9jQ2hpbGRyZW4gPyBsb2NDaGlsZHJlbi5sZW5ndGggOiAwOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgICAgICAgdGhpcy5wYXVzZVRhcmdldChsb2NDaGlsZHJlbltpXSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXN1bWVzIGFsbCBsaXN0ZW5lcnMgd2hpY2ggYXJlIGFzc29jaWF0ZWQgdGhlIHNwZWNpZmllZCB0YXJnZXQuXG4gICAgICogISN6aCDmgaLlpI3kvKDlhaXnmoQgbm9kZSDnm7jlhbPnmoTmiYDmnInnm5HlkKzlmajnmoTkuovku7blk43lupTjgIJcbiAgICAgKiBAbWV0aG9kIHJlc3VtZVRhcmdldFxuICAgICAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3JlY3Vyc2l2ZT1mYWxzZV1cbiAgICAgKi9cbiAgICByZXN1bWVUYXJnZXQ6IGZ1bmN0aW9uIChub2RlLCByZWN1cnNpdmUpIHtcbiAgICAgICAgaWYgKCEobm9kZSBpbnN0YW5jZW9mIGNjLl9CYXNlTm9kZSkpIHtcbiAgICAgICAgICAgIGNjLndhcm5JRCgzNTA2KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fbm9kZUxpc3RlbmVyc01hcFtub2RlLl9pZF0sIGksIGxlbjtcbiAgICAgICAgaWYgKGxpc3RlbmVycyl7XG4gICAgICAgICAgICBmb3IgKCBpID0gMCwgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgICAgICAgIGxpc3RlbmVyc1tpXS5fc2V0UGF1c2VkKGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zZXREaXJ0eUZvck5vZGUobm9kZSk7XG4gICAgICAgIGlmIChyZWN1cnNpdmUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHZhciBsb2NDaGlsZHJlbiA9IG5vZGUuX2NoaWxkcmVuO1xuICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gbG9jQ2hpbGRyZW4gPyBsb2NDaGlsZHJlbi5sZW5ndGggOiAwOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgICAgICAgdGhpcy5yZXN1bWVUYXJnZXQobG9jQ2hpbGRyZW5baV0sIHRydWUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9hZGRMaXN0ZW5lcjogZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbkRpc3BhdGNoID09PSAwKVxuICAgICAgICAgICAgdGhpcy5fZm9yY2VBZGRFdmVudExpc3RlbmVyKGxpc3RlbmVyKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy5fdG9BZGRlZExpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICB9LFxuXG4gICAgX2ZvcmNlQWRkRXZlbnRMaXN0ZW5lcjogZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcklEID0gbGlzdGVuZXIuX2dldExpc3RlbmVySUQoKTtcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVyc01hcFtsaXN0ZW5lcklEXTtcbiAgICAgICAgaWYgKCFsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGxpc3RlbmVycyA9IG5ldyBfRXZlbnRMaXN0ZW5lclZlY3RvcigpO1xuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzTWFwW2xpc3RlbmVySURdID0gbGlzdGVuZXJzO1xuICAgICAgICB9XG4gICAgICAgIGxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcblxuICAgICAgICBpZiAobGlzdGVuZXIuX2dldEZpeGVkUHJpb3JpdHkoKSA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5fc2V0RGlydHkobGlzdGVuZXJJRCwgdGhpcy5ESVJUWV9TQ0VORV9HUkFQSF9QUklPUklUWSk7XG5cbiAgICAgICAgICAgIHZhciBub2RlID0gbGlzdGVuZXIuX2dldFNjZW5lR3JhcGhQcmlvcml0eSgpO1xuICAgICAgICAgICAgaWYgKG5vZGUgPT09IG51bGwpXG4gICAgICAgICAgICAgICAgY2MubG9nSUQoMzUwNyk7XG5cbiAgICAgICAgICAgIHRoaXMuX2Fzc29jaWF0ZU5vZGVBbmRFdmVudExpc3RlbmVyKG5vZGUsIGxpc3RlbmVyKTtcbiAgICAgICAgICAgIGlmIChub2RlLmFjdGl2ZUluSGllcmFyY2h5KVxuICAgICAgICAgICAgICAgIHRoaXMucmVzdW1lVGFyZ2V0KG5vZGUpO1xuICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIHRoaXMuX3NldERpcnR5KGxpc3RlbmVySUQsIHRoaXMuRElSVFlfRklYRURfUFJJT1JJVFkpO1xuICAgIH0sXG5cbiAgICBfZ2V0TGlzdGVuZXJzOiBmdW5jdGlvbiAobGlzdGVuZXJJRCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGlzdGVuZXJzTWFwW2xpc3RlbmVySURdO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlRGlydHlGbGFnRm9yU2NlbmVHcmFwaDogZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgbG9jRGlydHlMaXN0ZW5lcnMgPSB0aGlzLl9kaXJ0eUxpc3RlbmVyc1xuICAgICAgICBmb3IgKHZhciBzZWxLZXkgaW4gbG9jRGlydHlMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIHRoaXMuX3NldERpcnR5KHNlbEtleSwgdGhpcy5ESVJUWV9TQ0VORV9HUkFQSF9QUklPUklUWSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9kaXJ0eUxpc3RlbmVycyA9IHt9O1xuICAgIH0sXG5cbiAgICBfcmVtb3ZlQWxsTGlzdGVuZXJzSW5WZWN0b3I6IGZ1bmN0aW9uIChsaXN0ZW5lclZlY3Rvcikge1xuICAgICAgICBpZiAoIWxpc3RlbmVyVmVjdG9yKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB2YXIgc2VsTGlzdGVuZXI7XG4gICAgICAgIGZvciAodmFyIGkgPSBsaXN0ZW5lclZlY3Rvci5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgc2VsTGlzdGVuZXIgPSBsaXN0ZW5lclZlY3RvcltpXTtcbiAgICAgICAgICAgIHNlbExpc3RlbmVyLl9zZXRSZWdpc3RlcmVkKGZhbHNlKTtcbiAgICAgICAgICAgIGlmIChzZWxMaXN0ZW5lci5fZ2V0U2NlbmVHcmFwaFByaW9yaXR5KCkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3NvY2lhdGVOb2RlQW5kRXZlbnRMaXN0ZW5lcihzZWxMaXN0ZW5lci5fZ2V0U2NlbmVHcmFwaFByaW9yaXR5KCksIHNlbExpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICBzZWxMaXN0ZW5lci5fc2V0U2NlbmVHcmFwaFByaW9yaXR5KG51bGwpOyAgIC8vIE5VTEwgb3V0IHRoZSBub2RlIHBvaW50ZXIgc28gd2UgZG9uJ3QgaGF2ZSBhbnkgZGFuZ2xpbmcgcG9pbnRlcnMgdG8gZGVzdHJveWVkIG5vZGVzLlxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5faW5EaXNwYXRjaCA9PT0gMClcbiAgICAgICAgICAgICAgICBjYy5qcy5hcnJheS5yZW1vdmVBdChsaXN0ZW5lclZlY3RvciwgaSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3JlbW92ZUxpc3RlbmVyc0Zvckxpc3RlbmVySUQ6IGZ1bmN0aW9uIChsaXN0ZW5lcklEKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNNYXBbbGlzdGVuZXJJRF0sIGk7XG4gICAgICAgIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIHZhciBmaXhlZFByaW9yaXR5TGlzdGVuZXJzID0gbGlzdGVuZXJzLmdldEZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIHZhciBzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuZ2V0U2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3JlbW92ZUFsbExpc3RlbmVyc0luVmVjdG9yKHNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycyk7XG4gICAgICAgICAgICB0aGlzLl9yZW1vdmVBbGxMaXN0ZW5lcnNJblZlY3RvcihmaXhlZFByaW9yaXR5TGlzdGVuZXJzKTtcblxuICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBkaXJ0eSBmbGFnIGFjY29yZGluZyB0aGUgJ2xpc3RlbmVySUQnLlxuICAgICAgICAgICAgLy8gTm8gbmVlZCB0byBjaGVjayB3aGV0aGVyIHRoZSBkaXNwYXRjaGVyIGlzIGRpc3BhdGNoaW5nIGV2ZW50LlxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3ByaW9yaXR5RGlydHlGbGFnTWFwW2xpc3RlbmVySURdO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuX2luRGlzcGF0Y2gpIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnMuY2xlYXIoKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fbGlzdGVuZXJzTWFwW2xpc3RlbmVySURdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxvY1RvQWRkZWRMaXN0ZW5lcnMgPSB0aGlzLl90b0FkZGVkTGlzdGVuZXJzLCBsaXN0ZW5lcjtcbiAgICAgICAgZm9yIChpID0gbG9jVG9BZGRlZExpc3RlbmVycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgbGlzdGVuZXIgPSBsb2NUb0FkZGVkTGlzdGVuZXJzW2ldO1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVyICYmIGxpc3RlbmVyLl9nZXRMaXN0ZW5lcklEKCkgPT09IGxpc3RlbmVySUQpXG4gICAgICAgICAgICAgICAgY2MuanMuYXJyYXkucmVtb3ZlQXQobG9jVG9BZGRlZExpc3RlbmVycywgaSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3NvcnRFdmVudExpc3RlbmVyczogZnVuY3Rpb24gKGxpc3RlbmVySUQpIHtcbiAgICAgICAgdmFyIGRpcnR5RmxhZyA9IHRoaXMuRElSVFlfTk9ORSwgbG9jRmxhZ01hcCA9IHRoaXMuX3ByaW9yaXR5RGlydHlGbGFnTWFwO1xuICAgICAgICBpZiAobG9jRmxhZ01hcFtsaXN0ZW5lcklEXSlcbiAgICAgICAgICAgIGRpcnR5RmxhZyA9IGxvY0ZsYWdNYXBbbGlzdGVuZXJJRF07XG4gICAgICAgIFxuICAgICAgICBpZiAoZGlydHlGbGFnICE9PSB0aGlzLkRJUlRZX05PTkUpIHtcbiAgICAgICAgICAgIC8vIENsZWFyIHRoZSBkaXJ0eSBmbGFnIGZpcnN0LCBpZiBgcm9vdE5vZGVgIGlzIG51bGwsIHRoZW4gc2V0IGl0cyBkaXJ0eSBmbGFnIG9mIHNjZW5lIGdyYXBoIHByaW9yaXR5XG4gICAgICAgICAgICBsb2NGbGFnTWFwW2xpc3RlbmVySURdID0gdGhpcy5ESVJUWV9OT05FO1xuXG4gICAgICAgICAgICBpZiAoZGlydHlGbGFnICYgdGhpcy5ESVJUWV9GSVhFRF9QUklPUklUWSlcbiAgICAgICAgICAgICAgICB0aGlzLl9zb3J0TGlzdGVuZXJzT2ZGaXhlZFByaW9yaXR5KGxpc3RlbmVySUQpO1xuXG4gICAgICAgICAgICBpZiAoZGlydHlGbGFnICYgdGhpcy5ESVJUWV9TQ0VORV9HUkFQSF9QUklPUklUWSl7XG4gICAgICAgICAgICAgICAgdmFyIHJvb3RFbnRpdHkgPSBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpO1xuICAgICAgICAgICAgICAgIGlmKHJvb3RFbnRpdHkpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NvcnRMaXN0ZW5lcnNPZlNjZW5lR3JhcGhQcmlvcml0eShsaXN0ZW5lcklEKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfc29ydExpc3RlbmVyc09mU2NlbmVHcmFwaFByaW9yaXR5OiBmdW5jdGlvbiAobGlzdGVuZXJJRCkge1xuICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fZ2V0TGlzdGVuZXJzKGxpc3RlbmVySUQpO1xuICAgICAgICBpZiAoIWxpc3RlbmVycylcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB2YXIgc2NlbmVHcmFwaExpc3RlbmVyID0gbGlzdGVuZXJzLmdldFNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycygpO1xuICAgICAgICBpZiAoIXNjZW5lR3JhcGhMaXN0ZW5lciB8fCBzY2VuZUdyYXBoTGlzdGVuZXIubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIC8vIEFmdGVyIHNvcnQ6IHByaW9yaXR5IDwgMCwgPiAwXG4gICAgICAgIGxpc3RlbmVycy5nZXRTY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMoKS5zb3J0KHRoaXMuX3NvcnRFdmVudExpc3RlbmVyc09mU2NlbmVHcmFwaFByaW9yaXR5RGVzKTtcbiAgICB9LFxuXG4gICAgX3NvcnRFdmVudExpc3RlbmVyc09mU2NlbmVHcmFwaFByaW9yaXR5RGVzOiBmdW5jdGlvbiAobDEsIGwyKSB7XG4gICAgICAgIGxldCBub2RlMSA9IGwxLl9nZXRTY2VuZUdyYXBoUHJpb3JpdHkoKSxcbiAgICAgICAgICAgIG5vZGUyID0gbDIuX2dldFNjZW5lR3JhcGhQcmlvcml0eSgpO1xuXG4gICAgICAgIGlmICghbDIgfHwgIW5vZGUyIHx8ICFub2RlMi5fYWN0aXZlSW5IaWVyYXJjaHkgfHwgbm9kZTIuX3BhcmVudCA9PT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgZWxzZSBpZiAoIWwxIHx8ICFub2RlMSB8fCAhbm9kZTEuX2FjdGl2ZUluSGllcmFyY2h5IHx8IG5vZGUxLl9wYXJlbnQgPT09IG51bGwpXG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgXG4gICAgICAgIGxldCBwMSA9IG5vZGUxLCBwMiA9IG5vZGUyLCBleCA9IGZhbHNlO1xuICAgICAgICB3aGlsZSAocDEuX3BhcmVudC5faWQgIT09IHAyLl9wYXJlbnQuX2lkKSB7XG4gICAgICAgICAgICBwMSA9IHAxLl9wYXJlbnQuX3BhcmVudCA9PT0gbnVsbCA/IChleCA9IHRydWUpICYmIG5vZGUyIDogcDEuX3BhcmVudDtcbiAgICAgICAgICAgIHAyID0gcDIuX3BhcmVudC5fcGFyZW50ID09PSBudWxsID8gKGV4ID0gdHJ1ZSkgJiYgbm9kZTEgOiBwMi5fcGFyZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHAxLl9pZCA9PT0gcDIuX2lkKSB7XG4gICAgICAgICAgICBpZiAocDEuX2lkID09PSBub2RlMi5faWQpIFxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIGlmIChwMS5faWQgPT09IG5vZGUxLl9pZClcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBleCA/IHAxLl9sb2NhbFpPcmRlciAtIHAyLl9sb2NhbFpPcmRlciA6IHAyLl9sb2NhbFpPcmRlciAtIHAxLl9sb2NhbFpPcmRlcjtcbiAgICB9LFxuXG4gICAgX3NvcnRMaXN0ZW5lcnNPZkZpeGVkUHJpb3JpdHk6IGZ1bmN0aW9uIChsaXN0ZW5lcklEKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNNYXBbbGlzdGVuZXJJRF07XG4gICAgICAgIGlmICghbGlzdGVuZXJzKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHZhciBmaXhlZExpc3RlbmVycyA9IGxpc3RlbmVycy5nZXRGaXhlZFByaW9yaXR5TGlzdGVuZXJzKCk7XG4gICAgICAgIGlmKCFmaXhlZExpc3RlbmVycyB8fCBmaXhlZExpc3RlbmVycy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIC8vIEFmdGVyIHNvcnQ6IHByaW9yaXR5IDwgMCwgPiAwXG4gICAgICAgIGZpeGVkTGlzdGVuZXJzLnNvcnQodGhpcy5fc29ydExpc3RlbmVyc09mRml4ZWRQcmlvcml0eUFzYyk7XG5cbiAgICAgICAgLy8gRklYTUU6IFNob3VsZCB1c2UgYmluYXJ5IHNlYXJjaFxuICAgICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgICBmb3IgKHZhciBsZW4gPSBmaXhlZExpc3RlbmVycy5sZW5ndGg7IGluZGV4IDwgbGVuOykge1xuICAgICAgICAgICAgaWYgKGZpeGVkTGlzdGVuZXJzW2luZGV4XS5fZ2V0Rml4ZWRQcmlvcml0eSgpID49IDApXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICArK2luZGV4O1xuICAgICAgICB9XG4gICAgICAgIGxpc3RlbmVycy5ndDBJbmRleCA9IGluZGV4O1xuICAgIH0sXG5cbiAgICBfc29ydExpc3RlbmVyc09mRml4ZWRQcmlvcml0eUFzYzogZnVuY3Rpb24gKGwxLCBsMikge1xuICAgICAgICByZXR1cm4gbDEuX2dldEZpeGVkUHJpb3JpdHkoKSAtIGwyLl9nZXRGaXhlZFByaW9yaXR5KCk7XG4gICAgfSxcblxuICAgIF9vblVwZGF0ZUxpc3RlbmVyczogZnVuY3Rpb24gKGxpc3RlbmVycykge1xuICAgICAgICB2YXIgZml4ZWRQcmlvcml0eUxpc3RlbmVycyA9IGxpc3RlbmVycy5nZXRGaXhlZFByaW9yaXR5TGlzdGVuZXJzKCk7XG4gICAgICAgIHZhciBzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuZ2V0U2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzKCk7XG4gICAgICAgIHZhciBpLCBzZWxMaXN0ZW5lciwgaWR4LCB0b1JlbW92ZWRMaXN0ZW5lcnMgPSB0aGlzLl90b1JlbW92ZWRMaXN0ZW5lcnM7XG5cbiAgICAgICAgaWYgKHNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycykge1xuICAgICAgICAgICAgZm9yIChpID0gc2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgc2VsTGlzdGVuZXIgPSBzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnNbaV07XG4gICAgICAgICAgICAgICAgaWYgKCFzZWxMaXN0ZW5lci5faXNSZWdpc3RlcmVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2MuanMuYXJyYXkucmVtb3ZlQXQoc2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgaXRlbSBpbiB0b1JlbW92ZSBsaXN0LCByZW1vdmUgaXQgZnJvbSB0aGUgbGlzdFxuICAgICAgICAgICAgICAgICAgICBpZHggPSB0b1JlbW92ZWRMaXN0ZW5lcnMuaW5kZXhPZihzZWxMaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgICAgIGlmKGlkeCAhPT0gLTEpXG4gICAgICAgICAgICAgICAgICAgICAgICB0b1JlbW92ZWRMaXN0ZW5lcnMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGZvciAoaSA9IGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICBzZWxMaXN0ZW5lciA9IGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnNbaV07XG4gICAgICAgICAgICAgICAgaWYgKCFzZWxMaXN0ZW5lci5faXNSZWdpc3RlcmVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2MuanMuYXJyYXkucmVtb3ZlQXQoZml4ZWRQcmlvcml0eUxpc3RlbmVycywgaSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIGl0ZW0gaW4gdG9SZW1vdmUgbGlzdCwgcmVtb3ZlIGl0IGZyb20gdGhlIGxpc3RcbiAgICAgICAgICAgICAgICAgICAgaWR4ID0gdG9SZW1vdmVkTGlzdGVuZXJzLmluZGV4T2Yoc2VsTGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgICAgICBpZihpZHggIT09IC0xKVxuICAgICAgICAgICAgICAgICAgICAgICAgdG9SZW1vdmVkTGlzdGVuZXJzLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMgJiYgc2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgIGxpc3RlbmVycy5jbGVhclNjZW5lR3JhcGhMaXN0ZW5lcnMoKTtcblxuICAgICAgICBpZiAoZml4ZWRQcmlvcml0eUxpc3RlbmVycyAmJiBmaXhlZFByaW9yaXR5TGlzdGVuZXJzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgIGxpc3RlbmVycy5jbGVhckZpeGVkTGlzdGVuZXJzKCk7XG4gICAgfSxcblxuICAgIGZyYW1lVXBkYXRlTGlzdGVuZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsb2NMaXN0ZW5lcnNNYXAgPSB0aGlzLl9saXN0ZW5lcnNNYXAsIGxvY1ByaW9yaXR5RGlydHlGbGFnTWFwID0gdGhpcy5fcHJpb3JpdHlEaXJ0eUZsYWdNYXA7XG4gICAgICAgIGZvciAodmFyIHNlbEtleSBpbiBsb2NMaXN0ZW5lcnNNYXApIHtcbiAgICAgICAgICAgIGlmIChsb2NMaXN0ZW5lcnNNYXBbc2VsS2V5XS5lbXB0eSgpKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGxvY1ByaW9yaXR5RGlydHlGbGFnTWFwW3NlbEtleV07XG4gICAgICAgICAgICAgICAgZGVsZXRlIGxvY0xpc3RlbmVyc01hcFtzZWxLZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxvY1RvQWRkZWRMaXN0ZW5lcnMgPSB0aGlzLl90b0FkZGVkTGlzdGVuZXJzO1xuICAgICAgICBpZiAobG9jVG9BZGRlZExpc3RlbmVycy5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBsb2NUb0FkZGVkTGlzdGVuZXJzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmNlQWRkRXZlbnRMaXN0ZW5lcihsb2NUb0FkZGVkTGlzdGVuZXJzW2ldKTtcbiAgICAgICAgICAgIGxvY1RvQWRkZWRMaXN0ZW5lcnMubGVuZ3RoID0gMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fdG9SZW1vdmVkTGlzdGVuZXJzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5fY2xlYW5Ub1JlbW92ZWRMaXN0ZW5lcnMoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfdXBkYXRlVG91Y2hMaXN0ZW5lcnM6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB2YXIgbG9jSW5EaXNwYXRjaCA9IHRoaXMuX2luRGlzcGF0Y2g7XG4gICAgICAgIGNjLmFzc2VydElEKGxvY0luRGlzcGF0Y2ggPiAwLCAzNTA4KTtcblxuICAgICAgICBpZiAobG9jSW5EaXNwYXRjaCA+IDEpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdmFyIGxpc3RlbmVycztcbiAgICAgICAgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzTWFwW0xpc3RlbmVySUQuVE9VQ0hfT05FX0JZX09ORV07XG4gICAgICAgIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIHRoaXMuX29uVXBkYXRlTGlzdGVuZXJzKGxpc3RlbmVycyk7XG4gICAgICAgIH1cbiAgICAgICAgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzTWFwW0xpc3RlbmVySUQuVE9VQ0hfQUxMX0FUX09OQ0VdO1xuICAgICAgICBpZiAobGlzdGVuZXJzKSB7XG4gICAgICAgICAgICB0aGlzLl9vblVwZGF0ZUxpc3RlbmVycyhsaXN0ZW5lcnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2MuYXNzZXJ0SUQobG9jSW5EaXNwYXRjaCA9PT0gMSwgMzUwOSk7XG5cbiAgICAgICAgdmFyIGxvY1RvQWRkZWRMaXN0ZW5lcnMgPSB0aGlzLl90b0FkZGVkTGlzdGVuZXJzO1xuICAgICAgICBpZiAobG9jVG9BZGRlZExpc3RlbmVycy5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBsb2NUb0FkZGVkTGlzdGVuZXJzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmNlQWRkRXZlbnRMaXN0ZW5lcihsb2NUb0FkZGVkTGlzdGVuZXJzW2ldKTtcbiAgICAgICAgICAgIHRoaXMuX3RvQWRkZWRMaXN0ZW5lcnMubGVuZ3RoID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl90b1JlbW92ZWRMaXN0ZW5lcnMubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9jbGVhblRvUmVtb3ZlZExpc3RlbmVycygpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vUmVtb3ZlIGFsbCBsaXN0ZW5lcnMgaW4gX3RvUmVtb3ZlTGlzdGVuZXJzIGxpc3QgYW5kIGNsZWFudXBcbiAgICBfY2xlYW5Ub1JlbW92ZWRMaXN0ZW5lcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRvUmVtb3ZlZExpc3RlbmVycyA9IHRoaXMuX3RvUmVtb3ZlZExpc3RlbmVycztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b1JlbW92ZWRMaXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBzZWxMaXN0ZW5lciA9IHRvUmVtb3ZlZExpc3RlbmVyc1tpXTtcbiAgICAgICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNNYXBbc2VsTGlzdGVuZXIuX2dldExpc3RlbmVySUQoKV07XG4gICAgICAgICAgICBpZiAoIWxpc3RlbmVycylcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgdmFyIGlkeCwgZml4ZWRQcmlvcml0eUxpc3RlbmVycyA9IGxpc3RlbmVycy5nZXRGaXhlZFByaW9yaXR5TGlzdGVuZXJzKCksXG4gICAgICAgICAgICAgICAgc2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzID0gbGlzdGVuZXJzLmdldFNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycygpO1xuXG4gICAgICAgICAgICBpZiAoc2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzKSB7XG4gICAgICAgICAgICAgICAgaWR4ID0gc2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzLmluZGV4T2Yoc2VsTGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIGlmIChpZHggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycy5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZml4ZWRQcmlvcml0eUxpc3RlbmVycykge1xuICAgICAgICAgICAgICAgIGlkeCA9IGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMuaW5kZXhPZihzZWxMaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgaWYgKGlkeCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgZml4ZWRQcmlvcml0eUxpc3RlbmVycy5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdG9SZW1vdmVkTGlzdGVuZXJzLmxlbmd0aCA9IDA7XG4gICAgfSxcblxuICAgIF9vblRvdWNoRXZlbnRDYWxsYmFjazogZnVuY3Rpb24gKGxpc3RlbmVyLCBhcmdzT2JqKSB7XG4gICAgICAgIC8vIFNraXAgaWYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkLlxuICAgICAgICBpZiAoIWxpc3RlbmVyLl9pc1JlZ2lzdGVyZWQoKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICB2YXIgZXZlbnQgPSBhcmdzT2JqLmV2ZW50LCBzZWxUb3VjaCA9IGV2ZW50LmN1cnJlbnRUb3VjaDtcbiAgICAgICAgZXZlbnQuY3VycmVudFRhcmdldCA9IGxpc3RlbmVyLl9ub2RlO1xuXG4gICAgICAgIHZhciBpc0NsYWltZWQgPSBmYWxzZSwgcmVtb3ZlZElkeDtcbiAgICAgICAgdmFyIGdldENvZGUgPSBldmVudC5nZXRFdmVudENvZGUoKSwgRXZlbnRUb3VjaCA9IGNjLkV2ZW50LkV2ZW50VG91Y2g7XG4gICAgICAgIGlmIChnZXRDb2RlID09PSBFdmVudFRvdWNoLkJFR0FOKSB7XG4gICAgICAgICAgICBpZiAoIWNjLm1hY3JvLkVOQUJMRV9NVUxUSV9UT1VDSCAmJiBldmVudE1hbmFnZXIuX2N1cnJlbnRUb3VjaCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGxpc3RlbmVyLm9uVG91Y2hCZWdhbikge1xuICAgICAgICAgICAgICAgIGlzQ2xhaW1lZCA9IGxpc3RlbmVyLm9uVG91Y2hCZWdhbihzZWxUb3VjaCwgZXZlbnQpO1xuICAgICAgICAgICAgICAgIGlmIChpc0NsYWltZWQgJiYgbGlzdGVuZXIuX3JlZ2lzdGVyZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIuX2NsYWltZWRUb3VjaGVzLnB1c2goc2VsVG91Y2gpO1xuICAgICAgICAgICAgICAgICAgICBldmVudE1hbmFnZXIuX2N1cnJlbnRUb3VjaCA9IHNlbFRvdWNoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChsaXN0ZW5lci5fY2xhaW1lZFRvdWNoZXMubGVuZ3RoID4gMFxuICAgICAgICAgICAgJiYgKChyZW1vdmVkSWR4ID0gbGlzdGVuZXIuX2NsYWltZWRUb3VjaGVzLmluZGV4T2Yoc2VsVG91Y2gpKSAhPT0gLTEpKSB7XG4gICAgICAgICAgICBpc0NsYWltZWQgPSB0cnVlO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIWNjLm1hY3JvLkVOQUJMRV9NVUxUSV9UT1VDSCAmJiBldmVudE1hbmFnZXIuX2N1cnJlbnRUb3VjaCAmJiBldmVudE1hbmFnZXIuX2N1cnJlbnRUb3VjaCAhPT0gc2VsVG91Y2gpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChnZXRDb2RlID09PSBFdmVudFRvdWNoLk1PVkVEICYmIGxpc3RlbmVyLm9uVG91Y2hNb3ZlZCkge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyLm9uVG91Y2hNb3ZlZChzZWxUb3VjaCwgZXZlbnQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChnZXRDb2RlID09PSBFdmVudFRvdWNoLkVOREVEKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyLm9uVG91Y2hFbmRlZClcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIub25Ub3VjaEVuZGVkKHNlbFRvdWNoLCBldmVudCk7XG4gICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyLl9yZWdpc3RlcmVkKVxuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lci5fY2xhaW1lZFRvdWNoZXMuc3BsaWNlKHJlbW92ZWRJZHgsIDEpO1xuICAgICAgICAgICAgICAgIGV2ZW50TWFuYWdlci5fY3VycmVudFRvdWNoID0gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZ2V0Q29kZSA9PT0gRXZlbnRUb3VjaC5DQU5DRUxMRUQpIHtcbiAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIub25Ub3VjaENhbmNlbGxlZClcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIub25Ub3VjaENhbmNlbGxlZChzZWxUb3VjaCwgZXZlbnQpO1xuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lci5fcmVnaXN0ZXJlZClcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIuX2NsYWltZWRUb3VjaGVzLnNwbGljZShyZW1vdmVkSWR4LCAxKTtcbiAgICAgICAgICAgICAgICBldmVudE1hbmFnZXIuX2N1cnJlbnRUb3VjaCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGUgZXZlbnQgd2FzIHN0b3BwZWQsIHJldHVybiBkaXJlY3RseS5cbiAgICAgICAgaWYgKGV2ZW50LmlzU3RvcHBlZCgpKSB7XG4gICAgICAgICAgICBldmVudE1hbmFnZXIuX3VwZGF0ZVRvdWNoTGlzdGVuZXJzKGV2ZW50KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzQ2xhaW1lZCAmJiBsaXN0ZW5lci5zd2FsbG93VG91Y2hlcykge1xuICAgICAgICAgICAgaWYgKGFyZ3NPYmoubmVlZHNNdXRhYmxlU2V0KVxuICAgICAgICAgICAgICAgIGFyZ3NPYmoudG91Y2hlcy5zcGxpY2Uoc2VsVG91Y2gsIDEpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICBfZGlzcGF0Y2hUb3VjaEV2ZW50OiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5fc29ydEV2ZW50TGlzdGVuZXJzKExpc3RlbmVySUQuVE9VQ0hfT05FX0JZX09ORSk7XG4gICAgICAgIHRoaXMuX3NvcnRFdmVudExpc3RlbmVycyhMaXN0ZW5lcklELlRPVUNIX0FMTF9BVF9PTkNFKTtcblxuICAgICAgICB2YXIgb25lQnlPbmVMaXN0ZW5lcnMgPSB0aGlzLl9nZXRMaXN0ZW5lcnMoTGlzdGVuZXJJRC5UT1VDSF9PTkVfQllfT05FKTtcbiAgICAgICAgdmFyIGFsbEF0T25jZUxpc3RlbmVycyA9IHRoaXMuX2dldExpc3RlbmVycyhMaXN0ZW5lcklELlRPVUNIX0FMTF9BVF9PTkNFKTtcblxuICAgICAgICAvLyBJZiB0aGVyZSBhcmVuJ3QgYW55IHRvdWNoIGxpc3RlbmVycywgcmV0dXJuIGRpcmVjdGx5LlxuICAgICAgICBpZiAobnVsbCA9PT0gb25lQnlPbmVMaXN0ZW5lcnMgJiYgbnVsbCA9PT0gYWxsQXRPbmNlTGlzdGVuZXJzKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHZhciBvcmlnaW5hbFRvdWNoZXMgPSBldmVudC5nZXRUb3VjaGVzKCksIG11dGFibGVUb3VjaGVzID0gY2MuanMuYXJyYXkuY29weShvcmlnaW5hbFRvdWNoZXMpO1xuICAgICAgICB2YXIgb25lQnlPbmVBcmdzT2JqID0ge2V2ZW50OiBldmVudCwgbmVlZHNNdXRhYmxlU2V0OiAob25lQnlPbmVMaXN0ZW5lcnMgJiYgYWxsQXRPbmNlTGlzdGVuZXJzKSwgdG91Y2hlczogbXV0YWJsZVRvdWNoZXMsIHNlbFRvdWNoOiBudWxsfTtcblxuICAgICAgICAvL1xuICAgICAgICAvLyBwcm9jZXNzIHRoZSB0YXJnZXQgaGFuZGxlcnMgMXN0XG4gICAgICAgIC8vXG4gICAgICAgIGlmIChvbmVCeU9uZUxpc3RlbmVycykge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvcmlnaW5hbFRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBldmVudC5jdXJyZW50VG91Y2ggPSBvcmlnaW5hbFRvdWNoZXNbaV07XG4gICAgICAgICAgICAgICAgZXZlbnQuX3Byb3BhZ2F0aW9uU3RvcHBlZCA9IGV2ZW50Ll9wcm9wYWdhdGlvbkltbWVkaWF0ZVN0b3BwZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9kaXNwYXRjaEV2ZW50VG9MaXN0ZW5lcnMob25lQnlPbmVMaXN0ZW5lcnMsIHRoaXMuX29uVG91Y2hFdmVudENhbGxiYWNrLCBvbmVCeU9uZUFyZ3NPYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gcHJvY2VzcyBzdGFuZGFyZCBoYW5kbGVycyAybmRcbiAgICAgICAgLy9cbiAgICAgICAgaWYgKGFsbEF0T25jZUxpc3RlbmVycyAmJiBtdXRhYmxlVG91Y2hlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLl9kaXNwYXRjaEV2ZW50VG9MaXN0ZW5lcnMoYWxsQXRPbmNlTGlzdGVuZXJzLCB0aGlzLl9vblRvdWNoZXNFdmVudENhbGxiYWNrLCB7ZXZlbnQ6IGV2ZW50LCB0b3VjaGVzOiBtdXRhYmxlVG91Y2hlc30pO1xuICAgICAgICAgICAgaWYgKGV2ZW50LmlzU3RvcHBlZCgpKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl91cGRhdGVUb3VjaExpc3RlbmVycyhldmVudCk7XG4gICAgfSxcblxuICAgIF9vblRvdWNoZXNFdmVudENhbGxiYWNrOiBmdW5jdGlvbiAobGlzdGVuZXIsIGNhbGxiYWNrUGFyYW1zKSB7XG4gICAgICAgIC8vIFNraXAgaWYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkLlxuICAgICAgICBpZiAoIWxpc3RlbmVyLl9yZWdpc3RlcmVkKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHZhciBFdmVudFRvdWNoID0gY2MuRXZlbnQuRXZlbnRUb3VjaCwgZXZlbnQgPSBjYWxsYmFja1BhcmFtcy5ldmVudCwgdG91Y2hlcyA9IGNhbGxiYWNrUGFyYW1zLnRvdWNoZXMsIGdldENvZGUgPSBldmVudC5nZXRFdmVudENvZGUoKTtcbiAgICAgICAgZXZlbnQuY3VycmVudFRhcmdldCA9IGxpc3RlbmVyLl9ub2RlO1xuICAgICAgICBpZiAoZ2V0Q29kZSA9PT0gRXZlbnRUb3VjaC5CRUdBTiAmJiBsaXN0ZW5lci5vblRvdWNoZXNCZWdhbilcbiAgICAgICAgICAgIGxpc3RlbmVyLm9uVG91Y2hlc0JlZ2FuKHRvdWNoZXMsIGV2ZW50KTtcbiAgICAgICAgZWxzZSBpZiAoZ2V0Q29kZSA9PT0gRXZlbnRUb3VjaC5NT1ZFRCAmJiBsaXN0ZW5lci5vblRvdWNoZXNNb3ZlZClcbiAgICAgICAgICAgIGxpc3RlbmVyLm9uVG91Y2hlc01vdmVkKHRvdWNoZXMsIGV2ZW50KTtcbiAgICAgICAgZWxzZSBpZiAoZ2V0Q29kZSA9PT0gRXZlbnRUb3VjaC5FTkRFRCAmJiBsaXN0ZW5lci5vblRvdWNoZXNFbmRlZClcbiAgICAgICAgICAgIGxpc3RlbmVyLm9uVG91Y2hlc0VuZGVkKHRvdWNoZXMsIGV2ZW50KTtcbiAgICAgICAgZWxzZSBpZiAoZ2V0Q29kZSA9PT0gRXZlbnRUb3VjaC5DQU5DRUxMRUQgJiYgbGlzdGVuZXIub25Ub3VjaGVzQ2FuY2VsbGVkKVxuICAgICAgICAgICAgbGlzdGVuZXIub25Ub3VjaGVzQ2FuY2VsbGVkKHRvdWNoZXMsIGV2ZW50KTtcblxuICAgICAgICAvLyBJZiB0aGUgZXZlbnQgd2FzIHN0b3BwZWQsIHJldHVybiBkaXJlY3RseS5cbiAgICAgICAgaWYgKGV2ZW50LmlzU3RvcHBlZCgpKSB7XG4gICAgICAgICAgICBldmVudE1hbmFnZXIuX3VwZGF0ZVRvdWNoTGlzdGVuZXJzKGV2ZW50KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgX2Fzc29jaWF0ZU5vZGVBbmRFdmVudExpc3RlbmVyOiBmdW5jdGlvbiAobm9kZSwgbGlzdGVuZXIpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX25vZGVMaXN0ZW5lcnNNYXBbbm9kZS5faWRdO1xuICAgICAgICBpZiAoIWxpc3RlbmVycykge1xuICAgICAgICAgICAgbGlzdGVuZXJzID0gW107XG4gICAgICAgICAgICB0aGlzLl9ub2RlTGlzdGVuZXJzTWFwW25vZGUuX2lkXSA9IGxpc3RlbmVycztcbiAgICAgICAgfVxuICAgICAgICBsaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgfSxcblxuICAgIF9kaXNzb2NpYXRlTm9kZUFuZEV2ZW50TGlzdGVuZXI6IGZ1bmN0aW9uIChub2RlLCBsaXN0ZW5lcikge1xuICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fbm9kZUxpc3RlbmVyc01hcFtub2RlLl9pZF07XG4gICAgICAgIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGNjLmpzLmFycmF5LnJlbW92ZShsaXN0ZW5lcnMsIGxpc3RlbmVyKTtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcnMubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9ub2RlTGlzdGVuZXJzTWFwW25vZGUuX2lkXTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZGlzcGF0Y2hFdmVudFRvTGlzdGVuZXJzOiBmdW5jdGlvbiAobGlzdGVuZXJzLCBvbkV2ZW50LCBldmVudE9yQXJncykge1xuICAgICAgICB2YXIgc2hvdWxkU3RvcFByb3BhZ2F0aW9uID0gZmFsc2U7XG4gICAgICAgIHZhciBmaXhlZFByaW9yaXR5TGlzdGVuZXJzID0gbGlzdGVuZXJzLmdldEZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMoKTtcbiAgICAgICAgdmFyIHNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycyA9IGxpc3RlbmVycy5nZXRTY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMoKTtcblxuICAgICAgICB2YXIgaSA9IDAsIGosIHNlbExpc3RlbmVyO1xuICAgICAgICBpZiAoZml4ZWRQcmlvcml0eUxpc3RlbmVycykgeyAgLy8gcHJpb3JpdHkgPCAwXG4gICAgICAgICAgICBpZiAoZml4ZWRQcmlvcml0eUxpc3RlbmVycy5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgICBmb3IgKDsgaSA8IGxpc3RlbmVycy5ndDBJbmRleDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbExpc3RlbmVyID0gZml4ZWRQcmlvcml0eUxpc3RlbmVyc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbExpc3RlbmVyLmlzRW5hYmxlZCgpICYmICFzZWxMaXN0ZW5lci5faXNQYXVzZWQoKSAmJiBzZWxMaXN0ZW5lci5faXNSZWdpc3RlcmVkKCkgJiYgb25FdmVudChzZWxMaXN0ZW5lciwgZXZlbnRPckFyZ3MpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG91bGRTdG9wUHJvcGFnYXRpb24gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzICYmICFzaG91bGRTdG9wUHJvcGFnYXRpb24pIHsgICAgLy8gcHJpb3JpdHkgPT0gMCwgc2NlbmUgZ3JhcGggcHJpb3JpdHlcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBzZWxMaXN0ZW5lciA9IHNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVyc1tqXTtcbiAgICAgICAgICAgICAgICBpZiAoc2VsTGlzdGVuZXIuaXNFbmFibGVkKCkgJiYgIXNlbExpc3RlbmVyLl9pc1BhdXNlZCgpICYmIHNlbExpc3RlbmVyLl9pc1JlZ2lzdGVyZWQoKSAmJiBvbkV2ZW50KHNlbExpc3RlbmVyLCBldmVudE9yQXJncykpIHtcbiAgICAgICAgICAgICAgICAgICAgc2hvdWxkU3RvcFByb3BhZ2F0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMgJiYgIXNob3VsZFN0b3BQcm9wYWdhdGlvbikgeyAgICAvLyBwcmlvcml0eSA+IDBcbiAgICAgICAgICAgIGZvciAoOyBpIDwgZml4ZWRQcmlvcml0eUxpc3RlbmVycy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIHNlbExpc3RlbmVyID0gZml4ZWRQcmlvcml0eUxpc3RlbmVyc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoc2VsTGlzdGVuZXIuaXNFbmFibGVkKCkgJiYgIXNlbExpc3RlbmVyLl9pc1BhdXNlZCgpICYmIHNlbExpc3RlbmVyLl9pc1JlZ2lzdGVyZWQoKSAmJiBvbkV2ZW50KHNlbExpc3RlbmVyLCBldmVudE9yQXJncykpIHtcbiAgICAgICAgICAgICAgICAgICAgc2hvdWxkU3RvcFByb3BhZ2F0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9zZXREaXJ0eTogZnVuY3Rpb24gKGxpc3RlbmVySUQsIGZsYWcpIHtcbiAgICAgICAgdmFyIGxvY0RpcnR5RmxhZ01hcCA9IHRoaXMuX3ByaW9yaXR5RGlydHlGbGFnTWFwO1xuICAgICAgICBpZiAobG9jRGlydHlGbGFnTWFwW2xpc3RlbmVySURdID09IG51bGwpXG4gICAgICAgICAgICBsb2NEaXJ0eUZsYWdNYXBbbGlzdGVuZXJJRF0gPSBmbGFnO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBsb2NEaXJ0eUZsYWdNYXBbbGlzdGVuZXJJRF0gPSBmbGFnIHwgbG9jRGlydHlGbGFnTWFwW2xpc3RlbmVySURdO1xuICAgIH0sXG5cbiAgICBfc29ydE51bWJlckFzYzogZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFF1ZXJ5IHdoZXRoZXIgdGhlIHNwZWNpZmllZCBldmVudCBsaXN0ZW5lciBpZCBoYXMgYmVlbiBhZGRlZC5cbiAgICAgKiAhI3poIOafpeivouaMh+WumueahOS6i+S7tiBJRCDmmK/lkKblrZjlnKhcbiAgICAgKiBAbWV0aG9kIGhhc0V2ZW50TGlzdGVuZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IGxpc3RlbmVySUQgLSBUaGUgbGlzdGVuZXIgaWQuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBvciBmYWxzZVxuICAgICAqL1xuICAgIGhhc0V2ZW50TGlzdGVuZXI6IGZ1bmN0aW9uIChsaXN0ZW5lcklEKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX2dldExpc3RlbmVycyhsaXN0ZW5lcklEKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIDxwPlxuICAgICAqIEFkZHMgYSBldmVudCBsaXN0ZW5lciBmb3IgYSBzcGVjaWZpZWQgZXZlbnQuPGJyLz5cbiAgICAgKiBpZiB0aGUgcGFyYW1ldGVyIFwibm9kZU9yUHJpb3JpdHlcIiBpcyBhIG5vZGUsXG4gICAgICogaXQgbWVhbnMgdG8gYWRkIGEgZXZlbnQgbGlzdGVuZXIgZm9yIGEgc3BlY2lmaWVkIGV2ZW50IHdpdGggdGhlIHByaW9yaXR5IG9mIHNjZW5lIGdyYXBoLjxici8+XG4gICAgICogaWYgdGhlIHBhcmFtZXRlciBcIm5vZGVPclByaW9yaXR5XCIgaXMgYSBOdW1iZXIsXG4gICAgICogaXQgbWVhbnMgdG8gYWRkIGEgZXZlbnQgbGlzdGVuZXIgZm9yIGEgc3BlY2lmaWVkIGV2ZW50IHdpdGggdGhlIGZpeGVkIHByaW9yaXR5Ljxici8+XG4gICAgICogPC9wPlxuICAgICAqICEjemhcbiAgICAgKiDlsIbkuovku7bnm5HlkKzlmajmt7vliqDliLDkuovku7bnrqHnkIblmajkuK3jgII8YnIvPlxuICAgICAqIOWmguaenOWPguaVsCDigJxub2RlT3JQcmlvcml0eeKAnSDmmK/oioLngrnvvIzkvJjlhYjnuqfnlLEgbm9kZSDnmoTmuLLmn5Ppobrluo/lhrPlrprvvIzmmL7npLrlnKjkuIrlsYLnmoToioLngrnlsIbkvJjlhYjmlLbliLDkuovku7bjgII8YnIvPlxuICAgICAqIOWmguaenOWPguaVsCDigJxub2RlT3JQcmlvcml0eeKAnSDmmK/mlbDlrZfvvIzkvJjlhYjnuqfliJnlm7rlrprkuLror6Xlj4LmlbDnmoTmlbDlgLzvvIzmlbDlrZfotorlsI/vvIzkvJjlhYjnuqfotorpq5jjgII8YnIvPlxuICAgICAqXG4gICAgICogQG1ldGhvZCBhZGRMaXN0ZW5lclxuICAgICAqIEBwYXJhbSB7RXZlbnRMaXN0ZW5lcnxPYmplY3R9IGxpc3RlbmVyIC0gVGhlIGxpc3RlbmVyIG9mIGEgc3BlY2lmaWVkIGV2ZW50IG9yIGEgb2JqZWN0IG9mIHNvbWUgZXZlbnQgcGFyYW1ldGVycy5cbiAgICAgKiBAcGFyYW0ge05vZGV8TnVtYmVyfSBub2RlT3JQcmlvcml0eSAtIFRoZSBwcmlvcml0eSBvZiB0aGUgbGlzdGVuZXIgaXMgYmFzZWQgb24gdGhlIGRyYXcgb3JkZXIgb2YgdGhpcyBub2RlIG9yIGZpeGVkUHJpb3JpdHkgVGhlIGZpeGVkIHByaW9yaXR5IG9mIHRoZSBsaXN0ZW5lci5cbiAgICAgKiBAbm90ZSAgVGhlIHByaW9yaXR5IG9mIHNjZW5lIGdyYXBoIHdpbGwgYmUgZml4ZWQgdmFsdWUgMC4gU28gdGhlIG9yZGVyIG9mIGxpc3RlbmVyIGl0ZW0gaW4gdGhlIHZlY3RvciB3aWxsIGJlICcgPDAsIHNjZW5lIGdyYXBoICgwIHByaW9yaXR5KSwgPjAnLlxuICAgICAqICAgICAgICAgQSBsb3dlciBwcmlvcml0eSB3aWxsIGJlIGNhbGxlZCBiZWZvcmUgdGhlIG9uZXMgdGhhdCBoYXZlIGEgaGlnaGVyIHZhbHVlLiAwIHByaW9yaXR5IGlzIGZvcmJpZGRlbiBmb3IgZml4ZWQgcHJpb3JpdHkgc2luY2UgaXQncyB1c2VkIGZvciBzY2VuZSBncmFwaCBiYXNlZCBwcmlvcml0eS5cbiAgICAgKiAgICAgICAgIFRoZSBsaXN0ZW5lciBtdXN0IGJlIGEgY2MuRXZlbnRMaXN0ZW5lciBvYmplY3Qgd2hlbiBhZGRpbmcgYSBmaXhlZCBwcmlvcml0eSBsaXN0ZW5lciwgYmVjYXVzZSB3ZSBjYW4ndCByZW1vdmUgYSBmaXhlZCBwcmlvcml0eSBsaXN0ZW5lciB3aXRob3V0IHRoZSBsaXN0ZW5lciBoYW5kbGVyLFxuICAgICAqICAgICAgICAgZXhjZXB0IGNhbGxzIHJlbW92ZUFsbExpc3RlbmVycygpLlxuICAgICAqIEByZXR1cm4ge0V2ZW50TGlzdGVuZXJ9IFJldHVybiB0aGUgbGlzdGVuZXIuIE5lZWRlZCBpbiBvcmRlciB0byByZW1vdmUgdGhlIGV2ZW50IGZyb20gdGhlIGRpc3BhdGNoZXIuXG4gICAgICovXG4gICAgYWRkTGlzdGVuZXI6IGZ1bmN0aW9uIChsaXN0ZW5lciwgbm9kZU9yUHJpb3JpdHkpIHtcbiAgICAgICAgY2MuYXNzZXJ0SUQobGlzdGVuZXIgJiYgbm9kZU9yUHJpb3JpdHksIDM1MDMpO1xuICAgICAgICBpZiAoIShjYy5qcy5pc051bWJlcihub2RlT3JQcmlvcml0eSkgfHwgbm9kZU9yUHJpb3JpdHkgaW5zdGFuY2VvZiBjYy5fQmFzZU5vZGUpKSB7XG4gICAgICAgICAgICBjYy53YXJuSUQoMzUwNik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEobGlzdGVuZXIgaW5zdGFuY2VvZiBjYy5FdmVudExpc3RlbmVyKSkge1xuICAgICAgICAgICAgY2MuYXNzZXJ0SUQoIWNjLmpzLmlzTnVtYmVyKG5vZGVPclByaW9yaXR5KSwgMzUwNCk7XG4gICAgICAgICAgICBsaXN0ZW5lciA9IGNjLkV2ZW50TGlzdGVuZXIuY3JlYXRlKGxpc3RlbmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lci5faXNSZWdpc3RlcmVkKCkpIHtcbiAgICAgICAgICAgICAgICBjYy5sb2dJRCgzNTA1KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWxpc3RlbmVyLmNoZWNrQXZhaWxhYmxlKCkpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgaWYgKGNjLmpzLmlzTnVtYmVyKG5vZGVPclByaW9yaXR5KSkge1xuICAgICAgICAgICAgaWYgKG5vZGVPclByaW9yaXR5ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgY2MubG9nSUQoMzUwMCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaXN0ZW5lci5fc2V0U2NlbmVHcmFwaFByaW9yaXR5KG51bGwpO1xuICAgICAgICAgICAgbGlzdGVuZXIuX3NldEZpeGVkUHJpb3JpdHkobm9kZU9yUHJpb3JpdHkpO1xuICAgICAgICAgICAgbGlzdGVuZXIuX3NldFJlZ2lzdGVyZWQodHJ1ZSk7XG4gICAgICAgICAgICBsaXN0ZW5lci5fc2V0UGF1c2VkKGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuX2FkZExpc3RlbmVyKGxpc3RlbmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxpc3RlbmVyLl9zZXRTY2VuZUdyYXBoUHJpb3JpdHkobm9kZU9yUHJpb3JpdHkpO1xuICAgICAgICAgICAgbGlzdGVuZXIuX3NldEZpeGVkUHJpb3JpdHkoMCk7XG4gICAgICAgICAgICBsaXN0ZW5lci5fc2V0UmVnaXN0ZXJlZCh0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuX2FkZExpc3RlbmVyKGxpc3RlbmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaXN0ZW5lcjtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiAhI2VuIEFkZHMgYSBDdXN0b20gZXZlbnQgbGlzdGVuZXIuIEl0IHdpbGwgdXNlIGEgZml4ZWQgcHJpb3JpdHkgb2YgMS5cbiAgICAgKiAhI3poIOWQkeS6i+S7tueuoeeQhuWZqOa3u+WKoOS4gOS4quiHquWumuS5ieS6i+S7tuebkeWQrOWZqOOAglxuICAgICAqIEBtZXRob2QgYWRkQ3VzdG9tTGlzdGVuZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKiBAcmV0dXJuIHtFdmVudExpc3RlbmVyfSB0aGUgZ2VuZXJhdGVkIGV2ZW50LiBOZWVkZWQgaW4gb3JkZXIgdG8gcmVtb3ZlIHRoZSBldmVudCBmcm9tIHRoZSBkaXNwYXRjaGVyXG4gICAgICovXG4gICAgYWRkQ3VzdG9tTGlzdGVuZXI6IGZ1bmN0aW9uIChldmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lciA9IG5ldyBjYy5FdmVudExpc3RlbmVyLmNyZWF0ZSh7XG4gICAgICAgICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5DVVNUT00sXG4gICAgICAgICAgICBldmVudE5hbWU6IGV2ZW50TmFtZSwgXG4gICAgICAgICAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYWRkTGlzdGVuZXIobGlzdGVuZXIsIDEpO1xuICAgICAgICByZXR1cm4gbGlzdGVuZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmVtb3ZlIGEgbGlzdGVuZXIuXG4gICAgICogISN6aCDnp7vpmaTkuIDkuKrlt7Lmt7vliqDnmoTnm5HlkKzlmajjgIJcbiAgICAgKiBAbWV0aG9kIHJlbW92ZUxpc3RlbmVyXG4gICAgICogQHBhcmFtIHtFdmVudExpc3RlbmVyfSBsaXN0ZW5lciAtIGFuIGV2ZW50IGxpc3RlbmVyIG9yIGEgcmVnaXN0ZXJlZCBub2RlIHRhcmdldFxuICAgICAqIEBleGFtcGxlIHtAbGluayBjb2NvczJkL2NvcmUvZXZlbnQtbWFuYWdlci9DQ0V2ZW50TWFuYWdlci9yZW1vdmVMaXN0ZW5lci5qc31cbiAgICAgKi9cbiAgICByZW1vdmVMaXN0ZW5lcjogZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICAgIGlmIChsaXN0ZW5lciA9PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHZhciBpc0ZvdW5kLCBsb2NMaXN0ZW5lciA9IHRoaXMuX2xpc3RlbmVyc01hcDtcbiAgICAgICAgZm9yICh2YXIgc2VsS2V5IGluIGxvY0xpc3RlbmVyKSB7XG4gICAgICAgICAgICB2YXIgbGlzdGVuZXJzID0gbG9jTGlzdGVuZXJbc2VsS2V5XTtcbiAgICAgICAgICAgIHZhciBmaXhlZFByaW9yaXR5TGlzdGVuZXJzID0gbGlzdGVuZXJzLmdldEZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMoKSwgc2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzID0gbGlzdGVuZXJzLmdldFNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycygpO1xuXG4gICAgICAgICAgICBpc0ZvdW5kID0gdGhpcy5fcmVtb3ZlTGlzdGVuZXJJblZlY3RvcihzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMsIGxpc3RlbmVyKTtcbiAgICAgICAgICAgIGlmIChpc0ZvdW5kKXtcbiAgICAgICAgICAgICAgICAvLyBmaXhlZCAjNDE2MDogRGlydHkgZmxhZyBuZWVkIHRvIGJlIHVwZGF0ZWQgYWZ0ZXIgbGlzdGVuZXJzIHdlcmUgcmVtb3ZlZC5cbiAgICAgICAgICAgICAgICB0aGlzLl9zZXREaXJ0eShsaXN0ZW5lci5fZ2V0TGlzdGVuZXJJRCgpLCB0aGlzLkRJUlRZX1NDRU5FX0dSQVBIX1BSSU9SSVRZKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGlzRm91bmQgPSB0aGlzLl9yZW1vdmVMaXN0ZW5lckluVmVjdG9yKGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMsIGxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNGb3VuZClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0RGlydHkobGlzdGVuZXIuX2dldExpc3RlbmVySUQoKSwgdGhpcy5ESVJUWV9GSVhFRF9QUklPUklUWSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcnMuZW1wdHkoKSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9wcmlvcml0eURpcnR5RmxhZ01hcFtsaXN0ZW5lci5fZ2V0TGlzdGVuZXJJRCgpXTtcbiAgICAgICAgICAgICAgICBkZWxldGUgbG9jTGlzdGVuZXJbc2VsS2V5XTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGlzRm91bmQpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzRm91bmQpIHtcbiAgICAgICAgICAgIHZhciBsb2NUb0FkZGVkTGlzdGVuZXJzID0gdGhpcy5fdG9BZGRlZExpc3RlbmVycztcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBsb2NUb0FkZGVkTGlzdGVuZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbExpc3RlbmVyID0gbG9jVG9BZGRlZExpc3RlbmVyc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoc2VsTGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLmpzLmFycmF5LnJlbW92ZUF0KGxvY1RvQWRkZWRMaXN0ZW5lcnMsIGkpO1xuICAgICAgICAgICAgICAgICAgICBzZWxMaXN0ZW5lci5fc2V0UmVnaXN0ZXJlZChmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfcmVtb3ZlTGlzdGVuZXJJbkNhbGxiYWNrOiBmdW5jdGlvbihsaXN0ZW5lcnMsIGNhbGxiYWNrKXtcbiAgICAgICAgaWYgKGxpc3RlbmVycyA9PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSBsaXN0ZW5lcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIHZhciBzZWxMaXN0ZW5lciA9IGxpc3RlbmVyc1tpXTtcbiAgICAgICAgICAgIGlmIChzZWxMaXN0ZW5lci5fb25DdXN0b21FdmVudCA9PT0gY2FsbGJhY2sgfHwgc2VsTGlzdGVuZXIuX29uRXZlbnQgPT09IGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgc2VsTGlzdGVuZXIuX3NldFJlZ2lzdGVyZWQoZmFsc2UpO1xuICAgICAgICAgICAgICAgIGlmIChzZWxMaXN0ZW5lci5fZ2V0U2NlbmVHcmFwaFByaW9yaXR5KCkgIT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3NvY2lhdGVOb2RlQW5kRXZlbnRMaXN0ZW5lcihzZWxMaXN0ZW5lci5fZ2V0U2NlbmVHcmFwaFByaW9yaXR5KCksIHNlbExpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsTGlzdGVuZXIuX3NldFNjZW5lR3JhcGhQcmlvcml0eShudWxsKTsgICAgICAgICAvLyBOVUxMIG91dCB0aGUgbm9kZSBwb2ludGVyIHNvIHdlIGRvbid0IGhhdmUgYW55IGRhbmdsaW5nIHBvaW50ZXJzIHRvIGRlc3Ryb3llZCBub2Rlcy5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5faW5EaXNwYXRjaCA9PT0gMClcbiAgICAgICAgICAgICAgICAgICAgY2MuanMuYXJyYXkucmVtb3ZlQXQobGlzdGVuZXJzLCBpKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RvUmVtb3ZlZExpc3RlbmVycy5wdXNoKHNlbExpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIF9yZW1vdmVMaXN0ZW5lckluVmVjdG9yOiBmdW5jdGlvbiAobGlzdGVuZXJzLCBsaXN0ZW5lcikge1xuICAgICAgICBpZiAobGlzdGVuZXJzID09IG51bGwpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IGxpc3RlbmVycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgdmFyIHNlbExpc3RlbmVyID0gbGlzdGVuZXJzW2ldO1xuICAgICAgICAgICAgaWYgKHNlbExpc3RlbmVyID09PSBsaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIHNlbExpc3RlbmVyLl9zZXRSZWdpc3RlcmVkKGZhbHNlKTtcbiAgICAgICAgICAgICAgICBpZiAoc2VsTGlzdGVuZXIuX2dldFNjZW5lR3JhcGhQcmlvcml0eSgpICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGlzc29jaWF0ZU5vZGVBbmRFdmVudExpc3RlbmVyKHNlbExpc3RlbmVyLl9nZXRTY2VuZUdyYXBoUHJpb3JpdHkoKSwgc2VsTGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgICAgICBzZWxMaXN0ZW5lci5fc2V0U2NlbmVHcmFwaFByaW9yaXR5KG51bGwpOyAgICAgICAgIC8vIE5VTEwgb3V0IHRoZSBub2RlIHBvaW50ZXIgc28gd2UgZG9uJ3QgaGF2ZSBhbnkgZGFuZ2xpbmcgcG9pbnRlcnMgdG8gZGVzdHJveWVkIG5vZGVzLlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pbkRpc3BhdGNoID09PSAwKVxuICAgICAgICAgICAgICAgICAgICBjYy5qcy5hcnJheS5yZW1vdmVBdChsaXN0ZW5lcnMsIGkpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdG9SZW1vdmVkTGlzdGVuZXJzLnB1c2goc2VsTGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZW1vdmVzIGFsbCBsaXN0ZW5lcnMgd2l0aCB0aGUgc2FtZSBldmVudCBsaXN0ZW5lciB0eXBlIG9yIHJlbW92ZXMgYWxsIGxpc3RlbmVycyBvZiBhIG5vZGUuXG4gICAgICogISN6aFxuICAgICAqIOenu+mZpOazqOWGjOWIsCBldmVudE1hbmFnZXIg5Lit5oyH5a6a57G75Z6L55qE5omA5pyJ5LqL5Lu255uR5ZCs5Zmo44CCPGJyLz5cbiAgICAgKiAxLiDlpoLmnpzkvKDlhaXnmoTnrKzkuIDkuKrlj4LmlbDnsbvlnovmmK8gTm9kZe+8jOmCo+S5iOS6i+S7tueuoeeQhuWZqOWwhuenu+mZpOS4juivpeWvueixoeebuOWFs+eahOaJgOacieS6i+S7tuebkeWQrOWZqOOAglxuICAgICAqIO+8iOWmguaenOesrOS6jOWPguaVsCByZWN1cnNpdmUg5pivIHRydWUg55qE6K+d77yM5bCx5Lya6L+e5ZCM6K+l5a+56LGh55qE5a2Q5o6n5Lu25LiK5omA5pyJ55qE5LqL5Lu255uR5ZCs5Zmo5Lmf5LiA5bm256e76Zmk77yJPGJyLz5cbiAgICAgKiAyLiDlpoLmnpzkvKDlhaXnmoTnrKzkuIDkuKrlj4LmlbDnsbvlnovmmK8gTnVtYmVy77yI6K+l57G75Z6LIEV2ZW50TGlzdGVuZXIg5Lit5a6a5LmJ55qE5LqL5Lu257G75Z6L77yJ77yMXG4gICAgICog6YKj5LmI5LqL5Lu2566h55CG5Zmo5bCG56e76Zmk6K+l57G75Z6L55qE5omA5pyJ5LqL5Lu255uR5ZCs5Zmo44CCPGJyLz5cbiAgICAgKlxuICAgICAqIOS4i+WIl+aYr+ebruWJjeWtmOWcqOebkeWQrOWZqOexu+Wei++8miAgICAgICA8YnIvPlxuICAgICAqIGNjLkV2ZW50TGlzdGVuZXIuVU5LTk9XTiAgICAgICA8YnIvPlxuICAgICAqIGNjLkV2ZW50TGlzdGVuZXIuS0VZQk9BUkQgICAgICA8YnIvPlxuICAgICAqIGNjLkV2ZW50TGlzdGVuZXIuQUNDRUxFUkFUSU9O77yMPGJyLz5cbiAgICAgKlxuICAgICAqIEBtZXRob2QgcmVtb3ZlTGlzdGVuZXJzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ8Tm9kZX0gbGlzdGVuZXJUeXBlIC0gbGlzdGVuZXJUeXBlIG9yIGEgbm9kZVxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3JlY3Vyc2l2ZT1mYWxzZV1cbiAgICAgKi9cbiAgICByZW1vdmVMaXN0ZW5lcnM6IGZ1bmN0aW9uIChsaXN0ZW5lclR5cGUsIHJlY3Vyc2l2ZSkge1xuICAgICAgICB2YXIgaSwgX3QgPSB0aGlzO1xuICAgICAgICBpZiAoIShjYy5qcy5pc051bWJlcihsaXN0ZW5lclR5cGUpIHx8IGxpc3RlbmVyVHlwZSBpbnN0YW5jZW9mIGNjLl9CYXNlTm9kZSkpIHtcbiAgICAgICAgICAgIGNjLndhcm5JRCgzNTA2KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGlzdGVuZXJUeXBlLl9pZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBFbnN1cmUgdGhlIG5vZGUgaXMgcmVtb3ZlZCBmcm9tIHRoZXNlIGltbWVkaWF0ZWx5IGFsc28uXG4gICAgICAgICAgICAvLyBEb24ndCB3YW50IGFueSBkYW5nbGluZyBwb2ludGVycyBvciB0aGUgcG9zc2liaWxpdHkgb2YgZGVhbGluZyB3aXRoIGRlbGV0ZWQgb2JqZWN0cy4uXG4gICAgICAgICAgICB2YXIgbGlzdGVuZXJzID0gX3QuX25vZGVMaXN0ZW5lcnNNYXBbbGlzdGVuZXJUeXBlLl9pZF0sIGk7XG4gICAgICAgICAgICBpZiAobGlzdGVuZXJzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxpc3RlbmVyc0NvcHkgPSBjYy5qcy5hcnJheS5jb3B5KGxpc3RlbmVycyk7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxpc3RlbmVyc0NvcHkubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICAgICAgICAgIF90LnJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyc0NvcHlbaV0pO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBfdC5fbm9kZUxpc3RlbmVyc01hcFtsaXN0ZW5lclR5cGUuX2lkXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQnVnIGZpeDogZW5zdXJlIHRoZXJlIGFyZSBubyByZWZlcmVuY2VzIHRvIHRoZSBub2RlIGluIHRoZSBsaXN0IG9mIGxpc3RlbmVycyB0byBiZSBhZGRlZC5cbiAgICAgICAgICAgIC8vIElmIHdlIGZpbmQgYW55IGxpc3RlbmVycyBhc3NvY2lhdGVkIHdpdGggdGhlIGRlc3Ryb3llZCBub2RlIGluIHRoaXMgbGlzdCB0aGVuIHJlbW92ZSB0aGVtLlxuICAgICAgICAgICAgLy8gVGhpcyBpcyB0byBjYXRjaCB0aGUgc2NlbmFyaW8gd2hlcmUgdGhlIG5vZGUgZ2V0cyBkZXN0cm95ZWQgYmVmb3JlIGl0J3MgbGlzdGVuZXJcbiAgICAgICAgICAgIC8vIGlzIGFkZGVkIGludG8gdGhlIGV2ZW50IGRpc3BhdGNoZXIgZnVsbHkuIFRoaXMgY291bGQgaGFwcGVuIGlmIGEgbm9kZSByZWdpc3RlcnMgYSBsaXN0ZW5lclxuICAgICAgICAgICAgLy8gYW5kIGdldHMgZGVzdHJveWVkIHdoaWxlIHdlIGFyZSBkaXNwYXRjaGluZyBhbiBldmVudCAodG91Y2ggZXRjLilcbiAgICAgICAgICAgIHZhciBsb2NUb0FkZGVkTGlzdGVuZXJzID0gX3QuX3RvQWRkZWRMaXN0ZW5lcnM7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbG9jVG9BZGRlZExpc3RlbmVycy5sZW5ndGg7ICkge1xuICAgICAgICAgICAgICAgIHZhciBsaXN0ZW5lciA9IGxvY1RvQWRkZWRMaXN0ZW5lcnNbaV07XG4gICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyLl9nZXRTY2VuZUdyYXBoUHJpb3JpdHkoKSA9PT0gbGlzdGVuZXJUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyLl9zZXRTY2VuZUdyYXBoUHJpb3JpdHkobnVsbCk7ICAgICAgICAgICAgICAgICAgICAgIC8vIEVuc3VyZSBubyBkYW5nbGluZyBwdHIgdG8gdGhlIHRhcmdldCBub2RlLlxuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lci5fc2V0UmVnaXN0ZXJlZChmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGxvY1RvQWRkZWRMaXN0ZW5lcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgICAgICArK2k7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyZWN1cnNpdmUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgbG9jQ2hpbGRyZW4gPSBsaXN0ZW5lclR5cGUuY2hpbGRyZW4sIGxlbjtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBsb2NDaGlsZHJlbi5sZW5ndGg7IGk8IGxlbjsgaSsrKVxuICAgICAgICAgICAgICAgICAgICBfdC5yZW1vdmVMaXN0ZW5lcnMobG9jQ2hpbGRyZW5baV0sIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVyVHlwZSA9PT0gY2MuRXZlbnRMaXN0ZW5lci5UT1VDSF9PTkVfQllfT05FKVxuICAgICAgICAgICAgICAgIF90Ll9yZW1vdmVMaXN0ZW5lcnNGb3JMaXN0ZW5lcklEKExpc3RlbmVySUQuVE9VQ0hfT05FX0JZX09ORSk7XG4gICAgICAgICAgICBlbHNlIGlmIChsaXN0ZW5lclR5cGUgPT09IGNjLkV2ZW50TGlzdGVuZXIuVE9VQ0hfQUxMX0FUX09OQ0UpXG4gICAgICAgICAgICAgICAgX3QuX3JlbW92ZUxpc3RlbmVyc0Zvckxpc3RlbmVySUQoTGlzdGVuZXJJRC5UT1VDSF9BTExfQVRfT05DRSk7XG4gICAgICAgICAgICBlbHNlIGlmIChsaXN0ZW5lclR5cGUgPT09IGNjLkV2ZW50TGlzdGVuZXIuTU9VU0UpXG4gICAgICAgICAgICAgICAgX3QuX3JlbW92ZUxpc3RlbmVyc0Zvckxpc3RlbmVySUQoTGlzdGVuZXJJRC5NT1VTRSk7XG4gICAgICAgICAgICBlbHNlIGlmIChsaXN0ZW5lclR5cGUgPT09IGNjLkV2ZW50TGlzdGVuZXIuQUNDRUxFUkFUSU9OKVxuICAgICAgICAgICAgICAgIF90Ll9yZW1vdmVMaXN0ZW5lcnNGb3JMaXN0ZW5lcklEKExpc3RlbmVySUQuQUNDRUxFUkFUSU9OKTtcbiAgICAgICAgICAgIGVsc2UgaWYgKGxpc3RlbmVyVHlwZSA9PT0gY2MuRXZlbnRMaXN0ZW5lci5LRVlCT0FSRClcbiAgICAgICAgICAgICAgICBfdC5fcmVtb3ZlTGlzdGVuZXJzRm9yTGlzdGVuZXJJRChMaXN0ZW5lcklELktFWUJPQVJEKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBjYy5sb2dJRCgzNTAxKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKlxuICAgICAqICEjZW4gUmVtb3ZlcyBhbGwgY3VzdG9tIGxpc3RlbmVycyB3aXRoIHRoZSBzYW1lIGV2ZW50IG5hbWUuXG4gICAgICogISN6aCDnp7vpmaTlkIzkuIDkuovku7blkI3nmoToh6rlrprkuYnkuovku7bnm5HlkKzlmajjgIJcbiAgICAgKiBAbWV0aG9kIHJlbW92ZUN1c3RvbUxpc3RlbmVyc1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjdXN0b21FdmVudE5hbWVcbiAgICAgKi9cbiAgICByZW1vdmVDdXN0b21MaXN0ZW5lcnM6IGZ1bmN0aW9uIChjdXN0b21FdmVudE5hbWUpIHtcbiAgICAgICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXJzRm9yTGlzdGVuZXJJRChjdXN0b21FdmVudE5hbWUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJlbW92ZXMgYWxsIGxpc3RlbmVyc1xuICAgICAqICEjemgg56e76Zmk5omA5pyJ5LqL5Lu255uR5ZCs5Zmo44CCXG4gICAgICogQG1ldGhvZCByZW1vdmVBbGxMaXN0ZW5lcnNcbiAgICAgKi9cbiAgICByZW1vdmVBbGxMaXN0ZW5lcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGxvY0xpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVyc01hcCwgbG9jSW50ZXJuYWxDdXN0b21FdmVudElEcyA9IHRoaXMuX2ludGVybmFsQ3VzdG9tTGlzdGVuZXJJRHM7XG4gICAgICAgIGZvciAodmFyIHNlbEtleSBpbiBsb2NMaXN0ZW5lcnMpe1xuICAgICAgICAgICAgaWYobG9jSW50ZXJuYWxDdXN0b21FdmVudElEcy5pbmRleE9mKHNlbEtleSkgPT09IC0xKVxuICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZUxpc3RlbmVyc0Zvckxpc3RlbmVySUQoc2VsS2V5KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgbGlzdGVuZXIncyBwcmlvcml0eSB3aXRoIGZpeGVkIHZhbHVlLlxuICAgICAqICEjemgg6K6+572uIEZpeGVkUHJpb3JpdHkg57G75Z6L55uR5ZCs5Zmo55qE5LyY5YWI57qn44CCXG4gICAgICogQG1ldGhvZCBzZXRQcmlvcml0eVxuICAgICAqIEBwYXJhbSB7RXZlbnRMaXN0ZW5lcn0gbGlzdGVuZXJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZml4ZWRQcmlvcml0eVxuICAgICAqL1xuICAgIHNldFByaW9yaXR5OiBmdW5jdGlvbiAobGlzdGVuZXIsIGZpeGVkUHJpb3JpdHkpIHtcbiAgICAgICAgaWYgKGxpc3RlbmVyID09IG51bGwpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdmFyIGxvY0xpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVyc01hcDtcbiAgICAgICAgZm9yICh2YXIgc2VsS2V5IGluIGxvY0xpc3RlbmVycykge1xuICAgICAgICAgICAgdmFyIHNlbExpc3RlbmVycyA9IGxvY0xpc3RlbmVyc1tzZWxLZXldO1xuICAgICAgICAgICAgdmFyIGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMgPSBzZWxMaXN0ZW5lcnMuZ2V0Rml4ZWRQcmlvcml0eUxpc3RlbmVycygpO1xuICAgICAgICAgICAgaWYgKGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgZm91bmQgPSBmaXhlZFByaW9yaXR5TGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIGlmIChmb3VuZCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYobGlzdGVuZXIuX2dldFNjZW5lR3JhcGhQcmlvcml0eSgpICE9IG51bGwpXG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5sb2dJRCgzNTAyKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyLl9nZXRGaXhlZFByaW9yaXR5KCkgIT09IGZpeGVkUHJpb3JpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyLl9zZXRGaXhlZFByaW9yaXR5KGZpeGVkUHJpb3JpdHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0RGlydHkobGlzdGVuZXIuX2dldExpc3RlbmVySUQoKSwgdGhpcy5ESVJUWV9GSVhFRF9QUklPUklUWSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFdoZXRoZXIgdG8gZW5hYmxlIGRpc3BhdGNoaW5nIGV2ZW50c1xuICAgICAqICEjemgg5ZCv55So5oiW56aB55So5LqL5Lu2566h55CG5Zmo77yM56aB55So5ZCO5LiN5Lya5YiG5Y+R5Lu75L2V5LqL5Lu244CCXG4gICAgICogQG1ldGhvZCBzZXRFbmFibGVkXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBlbmFibGVkXG4gICAgICovXG4gICAgc2V0RW5hYmxlZDogZnVuY3Rpb24gKGVuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5faXNFbmFibGVkID0gZW5hYmxlZDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBDaGVja3Mgd2hldGhlciBkaXNwYXRjaGluZyBldmVudHMgaXMgZW5hYmxlZFxuICAgICAqICEjemgg5qOA5rWL5LqL5Lu2566h55CG5Zmo5piv5ZCm5ZCv55So44CCXG4gICAgICogQG1ldGhvZCBpc0VuYWJsZWRcbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpc0VuYWJsZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzRW5hYmxlZDtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiAhI2VuIERpc3BhdGNoZXMgdGhlIGV2ZW50LCBhbHNvIHJlbW92ZXMgYWxsIEV2ZW50TGlzdGVuZXJzIG1hcmtlZCBmb3IgZGVsZXRpb24gZnJvbSB0aGUgZXZlbnQgZGlzcGF0Y2hlciBsaXN0LlxuICAgICAqICEjemgg5YiG5Y+R5LqL5Lu244CCXG4gICAgICogQG1ldGhvZCBkaXNwYXRjaEV2ZW50XG4gICAgICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAgICAgKi9cbiAgICBkaXNwYXRjaEV2ZW50OiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pc0VuYWJsZWQpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdGhpcy5fdXBkYXRlRGlydHlGbGFnRm9yU2NlbmVHcmFwaCgpO1xuICAgICAgICB0aGlzLl9pbkRpc3BhdGNoKys7XG4gICAgICAgIGlmICghZXZlbnQgfHwgIWV2ZW50LmdldFR5cGUpIHtcbiAgICAgICAgICAgIGNjLmVycm9ySUQoMzUxMSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2ZW50LmdldFR5cGUoKS5zdGFydHNXaXRoKGNjLkV2ZW50LlRPVUNIKSkge1xuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hUb3VjaEV2ZW50KGV2ZW50KTtcbiAgICAgICAgICAgIHRoaXMuX2luRGlzcGF0Y2gtLTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsaXN0ZW5lcklEID0gX19nZXRMaXN0ZW5lcklEKGV2ZW50KTtcbiAgICAgICAgdGhpcy5fc29ydEV2ZW50TGlzdGVuZXJzKGxpc3RlbmVySUQpO1xuICAgICAgICB2YXIgc2VsTGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzTWFwW2xpc3RlbmVySURdO1xuICAgICAgICBpZiAoc2VsTGlzdGVuZXJzICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnRUb0xpc3RlbmVycyhzZWxMaXN0ZW5lcnMsIHRoaXMuX29uTGlzdGVuZXJDYWxsYmFjaywgZXZlbnQpO1xuICAgICAgICAgICAgdGhpcy5fb25VcGRhdGVMaXN0ZW5lcnMoc2VsTGlzdGVuZXJzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2luRGlzcGF0Y2gtLTtcbiAgICB9LFxuXG4gICAgX29uTGlzdGVuZXJDYWxsYmFjazogZnVuY3Rpb24obGlzdGVuZXIsIGV2ZW50KXtcbiAgICAgICAgZXZlbnQuY3VycmVudFRhcmdldCA9IGxpc3RlbmVyLl90YXJnZXQ7XG4gICAgICAgIGxpc3RlbmVyLl9vbkV2ZW50KGV2ZW50KTtcbiAgICAgICAgcmV0dXJuIGV2ZW50LmlzU3RvcHBlZCgpO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqICEjZW4gRGlzcGF0Y2hlcyBhIEN1c3RvbSBFdmVudCB3aXRoIGEgZXZlbnQgbmFtZSBhbiBvcHRpb25hbCB1c2VyIGRhdGFcbiAgICAgKiAhI3poIOWIhuWPkeiHquWumuS5ieS6i+S7tuOAglxuICAgICAqIEBtZXRob2QgZGlzcGF0Y2hDdXN0b21FdmVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiAgICAgKiBAcGFyYW0geyp9IG9wdGlvbmFsVXNlckRhdGFcbiAgICAgKi9cbiAgICBkaXNwYXRjaEN1c3RvbUV2ZW50OiBmdW5jdGlvbiAoZXZlbnROYW1lLCBvcHRpb25hbFVzZXJEYXRhKSB7XG4gICAgICAgIHZhciBldiA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbShldmVudE5hbWUpO1xuICAgICAgICBldi5zZXRVc2VyRGF0YShvcHRpb25hbFVzZXJEYXRhKTtcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KGV2KTtcbiAgICB9XG59O1xuXG5cbmpzLmdldChjYywgJ2V2ZW50TWFuYWdlcicsIGZ1bmN0aW9uICgpIHtcbiAgICBjYy53YXJuSUQoMTQwNSwgJ2NjLmV2ZW50TWFuYWdlcicsICdjYy5FdmVudFRhcmdldCBvciBjYy5zeXN0ZW1FdmVudCcpO1xuICAgIHJldHVybiBldmVudE1hbmFnZXI7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBldmVudE1hbmFnZXI7XG4iXX0=