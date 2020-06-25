
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/event-manager/CCEventListener.js';
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
/**
 * !#en
 * <p>
 *     The base class of event listener.                                                                        <br/>
 *     If you need custom listener which with different callback, you need to inherit this class.               <br/>
 *     For instance, you could refer to EventListenerAcceleration, EventListenerKeyboard,                       <br/>
 *      EventListenerTouchOneByOne, EventListenerCustom.
 * </p>
 *
 * !#zh
 * 封装用户的事件处理逻辑。
 * 注意：这是一个抽象类，开发者不应该直接实例化这个类，请参考 {{#crossLink "EventListener/create:method"}}cc.EventListener.create{{/crossLink}}。
 *
 * @class EventListener
 */

/**
 * Constructor
 * @method constructor
 * @param {Number} type
 * @param {Number} listenerID
 * @param {Number} callback
 */


cc.EventListener = function (type, listenerID, callback) {
  this._onEvent = callback; // Event callback function

  this._type = type || 0; // Event listener type

  this._listenerID = listenerID || ""; // Event listener ID

  this._registered = false; // Whether the listener has been added to dispatcher.

  this._fixedPriority = 0; // The higher the number, the higher the priority, 0 is for scene graph base priority.

  this._node = null; // scene graph based priority

  this._target = null;
  this._paused = true; // Whether the listener is paused

  this._isEnabled = true; // Whether the listener is enabled
};

cc.EventListener.prototype = {
  constructor: cc.EventListener,

  /*
   * <p>
   *     Sets paused state for the listener
   *     The paused state is only used for scene graph priority listeners.
   *     `EventDispatcher::resumeAllEventListenersForTarget(node)` will set the paused state to `true`,
   *     while `EventDispatcher::pauseAllEventListenersForTarget(node)` will set it to `false`.
   *     @note 1) Fixed priority listeners will never get paused. If a fixed priority doesn't want to receive events,
   *              call `setEnabled(false)` instead.
   *            2) In `Node`'s onEnter and onExit, the `paused state` of the listeners which associated with that node will be automatically updated.
   * </p>
   * @param {Boolean} paused
   * @private
   */
  _setPaused: function _setPaused(paused) {
    this._paused = paused;
  },

  /*
   * Checks whether the listener is paused.
   * @returns {Boolean}
   * @private
   */
  _isPaused: function _isPaused() {
    return this._paused;
  },

  /*
   * Marks the listener was registered by EventDispatcher.
   * @param {Boolean} registered
   * @private
   */
  _setRegistered: function _setRegistered(registered) {
    this._registered = registered;
  },

  /*
   * Checks whether the listener was registered by EventDispatcher
   * @returns {Boolean}
   * @private
   */
  _isRegistered: function _isRegistered() {
    return this._registered;
  },

  /*
   * Gets the type of this listener
   * @note It's different from `EventType`, e.g. TouchEvent has two kinds of event listeners - EventListenerOneByOne, EventListenerAllAtOnce
   * @returns {Number}
   * @private
   */
  _getType: function _getType() {
    return this._type;
  },

  /*
   *  Gets the listener ID of this listener
   *  When event is being dispatched, listener ID is used as key for searching listeners according to event type.
   * @returns {String}
   * @private
   */
  _getListenerID: function _getListenerID() {
    return this._listenerID;
  },

  /*
   * Sets the fixed priority for this listener
   *  @note This method is only used for `fixed priority listeners`, it needs to access a non-zero value. 0 is reserved for scene graph priority listeners
   * @param {Number} fixedPriority
   * @private
   */
  _setFixedPriority: function _setFixedPriority(fixedPriority) {
    this._fixedPriority = fixedPriority;
  },

  /*
   * Gets the fixed priority of this listener
   * @returns {Number} 0 if it's a scene graph priority listener, non-zero for fixed priority listener
   * @private
   */
  _getFixedPriority: function _getFixedPriority() {
    return this._fixedPriority;
  },

  /*
   * Sets scene graph priority for this listener
   * @param {cc.Node} node
   * @private
   */
  _setSceneGraphPriority: function _setSceneGraphPriority(node) {
    this._target = node;
    this._node = node;
  },

  /*
   * Gets scene graph priority of this listener
   * @returns {cc.Node} if it's a fixed priority listener, non-null for scene graph priority listener
   * @private
   */
  _getSceneGraphPriority: function _getSceneGraphPriority() {
    return this._node;
  },

  /**
   * !#en Checks whether the listener is available.
   * !#zh 检测监听器是否有效
   * @method checkAvailable
   * @returns {Boolean}
   */
  checkAvailable: function checkAvailable() {
    return this._onEvent !== null;
  },

  /**
   * !#en Clones the listener, its subclasses have to override this method.
   * !#zh 克隆监听器,它的子类必须重写此方法。
   * @method clone
   * @returns {EventListener}
   */
  clone: function clone() {
    return null;
  },

  /**
   *  !#en Enables or disables the listener
   *  !#zh 启用或禁用监听器。
   *  @method setEnabled
   *  @param {Boolean} enabled
   *  @note Only listeners with `enabled` state will be able to receive events.
   *          When an listener was initialized, it's enabled by default.
   *          An event listener can receive events when it is enabled and is not paused.
   *          paused state is always false when it is a fixed priority listener.
   */
  setEnabled: function setEnabled(enabled) {
    this._isEnabled = enabled;
  },

  /**
   * !#en Checks whether the listener is enabled
   * !#zh 检查监听器是否可用。
   * @method isEnabled
   * @returns {Boolean}
   */
  isEnabled: function isEnabled() {
    return this._isEnabled;
  },

  /*
   * <p>Currently JavaScript Bindings (JSB), in some cases, needs to use retain and release. This is a bug in JSB,
   * and the ugly workaround is to use retain/release. So, these 2 methods were added to be compatible with JSB.
   * This is a hack, and should be removed once JSB fixes the retain/release bug<br/>
   * You will need to retain an object if you created a listener and haven't added it any target node during the same frame.<br/>
   * Otherwise, JSB's native autorelease pool will consider this object a useless one and release it directly,<br/>
   * when you want to use it later, a "Invalid Native Object" error will be raised.<br/>
   * The retain function can increase a reference count for the native object to avoid it being released,<br/>
   * you need to manually invoke release function when you think this object is no longer needed, otherwise, there will be memory learks.<br/>
   * retain and release function call should be paired in developer's game code.</p>
   *
   * @method retain
   * @see cc.EventListener#release
   */
  retain: function retain() {},

  /*
   * <p>Currently JavaScript Bindings (JSB), in some cases, needs to use retain and release. This is a bug in JSB,
   * and the ugly workaround is to use retain/release. So, these 2 methods were added to be compatible with JSB.
   * This is a hack, and should be removed once JSB fixes the retain/release bug<br/>
   * You will need to retain an object if you created a listener and haven't added it any target node during the same frame.<br/>
   * Otherwise, JSB's native autorelease pool will consider this object a useless one and release it directly,<br/>
   * when you want to use it later, a "Invalid Native Object" error will be raised.<br/>
   * The retain function can increase a reference count for the native object to avoid it being released,<br/>
   * you need to manually invoke release function when you think this object is no longer needed, otherwise, there will be memory learks.<br/>
   * retain and release function call should be paired in developer's game code.</p>
   *
   * @method release
   * @see cc.EventListener#retain
   */
  release: function release() {}
}; // event listener type

/**
 * !#en The type code of unknown event listener.
 * !#zh 未知的事件监听器类型
 * @property UNKNOWN
 * @type {Number}
 * @static
 */

cc.EventListener.UNKNOWN = 0;
/*
 * !#en The type code of one by one touch event listener.
 * !#zh 触摸事件监听器类型，触点会一个一个得分开被派发
 * @property TOUCH_ONE_BY_ONE
 * @type {Number}
 * @static
 */

cc.EventListener.TOUCH_ONE_BY_ONE = 1;
/*
 * !#en The type code of all at once touch event listener.
 * !#zh 触摸事件监听器类型，触点会被一次性全部派发
 * @property TOUCH_ALL_AT_ONCE
 * @type {Number}
 * @static
 */

cc.EventListener.TOUCH_ALL_AT_ONCE = 2;
/**
 * !#en The type code of keyboard event listener.
 * !#zh 键盘事件监听器类型
 * @property KEYBOARD
 * @type {Number}
 * @static
 */

cc.EventListener.KEYBOARD = 3;
/*
 * !#en The type code of mouse event listener.
 * !#zh 鼠标事件监听器类型
 * @property MOUSE
 * @type {Number}
 * @static
 */

cc.EventListener.MOUSE = 4;
/**
 * !#en The type code of acceleration event listener.
 * !#zh 加速器事件监听器类型
 * @property ACCELERATION
 * @type {Number}
 * @static
 */

cc.EventListener.ACCELERATION = 6;
/*
 * !#en The type code of custom event listener.
 * !#zh 自定义事件监听器类型
 * @property CUSTOM
 * @type {Number}
 * @static
 */

cc.EventListener.CUSTOM = 8;
var ListenerID = cc.EventListener.ListenerID = {
  MOUSE: '__cc_mouse',
  TOUCH_ONE_BY_ONE: '__cc_touch_one_by_one',
  TOUCH_ALL_AT_ONCE: '__cc_touch_all_at_once',
  KEYBOARD: '__cc_keyboard',
  ACCELERATION: '__cc_acceleration'
};

var Custom = function Custom(listenerId, callback) {
  this._onCustomEvent = callback;
  cc.EventListener.call(this, cc.EventListener.CUSTOM, listenerId, this._callback);
};

js.extend(Custom, cc.EventListener);
js.mixin(Custom.prototype, {
  _onCustomEvent: null,
  _callback: function _callback(event) {
    if (this._onCustomEvent !== null) this._onCustomEvent(event);
  },
  checkAvailable: function checkAvailable() {
    return cc.EventListener.prototype.checkAvailable.call(this) && this._onCustomEvent !== null;
  },
  clone: function clone() {
    return new Custom(this._listenerID, this._onCustomEvent);
  }
});

var Mouse = function Mouse() {
  cc.EventListener.call(this, cc.EventListener.MOUSE, ListenerID.MOUSE, this._callback);
};

js.extend(Mouse, cc.EventListener);
js.mixin(Mouse.prototype, {
  onMouseDown: null,
  onMouseUp: null,
  onMouseMove: null,
  onMouseScroll: null,
  _callback: function _callback(event) {
    var eventType = cc.Event.EventMouse;

    switch (event._eventType) {
      case eventType.DOWN:
        if (this.onMouseDown) this.onMouseDown(event);
        break;

      case eventType.UP:
        if (this.onMouseUp) this.onMouseUp(event);
        break;

      case eventType.MOVE:
        if (this.onMouseMove) this.onMouseMove(event);
        break;

      case eventType.SCROLL:
        if (this.onMouseScroll) this.onMouseScroll(event);
        break;

      default:
        break;
    }
  },
  clone: function clone() {
    var eventListener = new Mouse();
    eventListener.onMouseDown = this.onMouseDown;
    eventListener.onMouseUp = this.onMouseUp;
    eventListener.onMouseMove = this.onMouseMove;
    eventListener.onMouseScroll = this.onMouseScroll;
    return eventListener;
  },
  checkAvailable: function checkAvailable() {
    return true;
  }
});

var TouchOneByOne = function TouchOneByOne() {
  cc.EventListener.call(this, cc.EventListener.TOUCH_ONE_BY_ONE, ListenerID.TOUCH_ONE_BY_ONE, null);
  this._claimedTouches = [];
};

js.extend(TouchOneByOne, cc.EventListener);
js.mixin(TouchOneByOne.prototype, {
  constructor: TouchOneByOne,
  _claimedTouches: null,
  swallowTouches: false,
  onTouchBegan: null,
  onTouchMoved: null,
  onTouchEnded: null,
  onTouchCancelled: null,
  setSwallowTouches: function setSwallowTouches(needSwallow) {
    this.swallowTouches = needSwallow;
  },
  isSwallowTouches: function isSwallowTouches() {
    return this.swallowTouches;
  },
  clone: function clone() {
    var eventListener = new TouchOneByOne();
    eventListener.onTouchBegan = this.onTouchBegan;
    eventListener.onTouchMoved = this.onTouchMoved;
    eventListener.onTouchEnded = this.onTouchEnded;
    eventListener.onTouchCancelled = this.onTouchCancelled;
    eventListener.swallowTouches = this.swallowTouches;
    return eventListener;
  },
  checkAvailable: function checkAvailable() {
    if (!this.onTouchBegan) {
      cc.logID(1801);
      return false;
    }

    return true;
  }
});

var TouchAllAtOnce = function TouchAllAtOnce() {
  cc.EventListener.call(this, cc.EventListener.TOUCH_ALL_AT_ONCE, ListenerID.TOUCH_ALL_AT_ONCE, null);
};

js.extend(TouchAllAtOnce, cc.EventListener);
js.mixin(TouchAllAtOnce.prototype, {
  constructor: TouchAllAtOnce,
  onTouchesBegan: null,
  onTouchesMoved: null,
  onTouchesEnded: null,
  onTouchesCancelled: null,
  clone: function clone() {
    var eventListener = new TouchAllAtOnce();
    eventListener.onTouchesBegan = this.onTouchesBegan;
    eventListener.onTouchesMoved = this.onTouchesMoved;
    eventListener.onTouchesEnded = this.onTouchesEnded;
    eventListener.onTouchesCancelled = this.onTouchesCancelled;
    return eventListener;
  },
  checkAvailable: function checkAvailable() {
    if (this.onTouchesBegan === null && this.onTouchesMoved === null && this.onTouchesEnded === null && this.onTouchesCancelled === null) {
      cc.logID(1802);
      return false;
    }

    return true;
  }
}); //Acceleration

var Acceleration = function Acceleration(callback) {
  this._onAccelerationEvent = callback;
  cc.EventListener.call(this, cc.EventListener.ACCELERATION, ListenerID.ACCELERATION, this._callback);
};

js.extend(Acceleration, cc.EventListener);
js.mixin(Acceleration.prototype, {
  constructor: Acceleration,
  _onAccelerationEvent: null,
  _callback: function _callback(event) {
    this._onAccelerationEvent(event.acc, event);
  },
  checkAvailable: function checkAvailable() {
    cc.assertID(this._onAccelerationEvent, 1803);
    return true;
  },
  clone: function clone() {
    return new Acceleration(this._onAccelerationEvent);
  }
}); //Keyboard

var Keyboard = function Keyboard() {
  cc.EventListener.call(this, cc.EventListener.KEYBOARD, ListenerID.KEYBOARD, this._callback);
};

js.extend(Keyboard, cc.EventListener);
js.mixin(Keyboard.prototype, {
  constructor: Keyboard,
  onKeyPressed: null,
  onKeyReleased: null,
  _callback: function _callback(event) {
    if (event.isPressed) {
      if (this.onKeyPressed) this.onKeyPressed(event.keyCode, event);
    } else {
      if (this.onKeyReleased) this.onKeyReleased(event.keyCode, event);
    }
  },
  clone: function clone() {
    var eventListener = new Keyboard();
    eventListener.onKeyPressed = this.onKeyPressed;
    eventListener.onKeyReleased = this.onKeyReleased;
    return eventListener;
  },
  checkAvailable: function checkAvailable() {
    if (this.onKeyPressed === null && this.onKeyReleased === null) {
      cc.logID(1800);
      return false;
    }

    return true;
  }
});
/**
 * !#en
 * Create a EventListener object with configuration including the event type, handlers and other parameters.
 * In handlers, this refer to the event listener object itself.
 * You can also pass custom parameters in the configuration object,
 * all custom parameters will be polyfilled into the event listener object and can be accessed in handlers.
 * !#zh 通过指定不同的 Event 对象来设置想要创建的事件监听器。
 * @method create
 * @param {Object} argObj a json object
 * @returns {EventListener}
 * @static
 * @example {@link cocos2d/core/event-manager/CCEventListener/create.js}
 */

cc.EventListener.create = function (argObj) {
  cc.assertID(argObj && argObj.event, 1900);
  var listenerType = argObj.event;
  delete argObj.event;
  var listener = null;
  if (listenerType === cc.EventListener.TOUCH_ONE_BY_ONE) listener = new TouchOneByOne();else if (listenerType === cc.EventListener.TOUCH_ALL_AT_ONCE) listener = new TouchAllAtOnce();else if (listenerType === cc.EventListener.MOUSE) listener = new Mouse();else if (listenerType === cc.EventListener.CUSTOM) {
    listener = new Custom(argObj.eventName, argObj.callback);
    delete argObj.eventName;
    delete argObj.callback;
  } else if (listenerType === cc.EventListener.KEYBOARD) listener = new Keyboard();else if (listenerType === cc.EventListener.ACCELERATION) {
    listener = new Acceleration(argObj.callback);
    delete argObj.callback;
  }

  for (var key in argObj) {
    listener[key] = argObj[key];
  }

  return listener;
};

module.exports = cc.EventListener;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDRXZlbnRMaXN0ZW5lci5qcyJdLCJuYW1lcyI6WyJqcyIsInJlcXVpcmUiLCJjYyIsIkV2ZW50TGlzdGVuZXIiLCJ0eXBlIiwibGlzdGVuZXJJRCIsImNhbGxiYWNrIiwiX29uRXZlbnQiLCJfdHlwZSIsIl9saXN0ZW5lcklEIiwiX3JlZ2lzdGVyZWQiLCJfZml4ZWRQcmlvcml0eSIsIl9ub2RlIiwiX3RhcmdldCIsIl9wYXVzZWQiLCJfaXNFbmFibGVkIiwicHJvdG90eXBlIiwiY29uc3RydWN0b3IiLCJfc2V0UGF1c2VkIiwicGF1c2VkIiwiX2lzUGF1c2VkIiwiX3NldFJlZ2lzdGVyZWQiLCJyZWdpc3RlcmVkIiwiX2lzUmVnaXN0ZXJlZCIsIl9nZXRUeXBlIiwiX2dldExpc3RlbmVySUQiLCJfc2V0Rml4ZWRQcmlvcml0eSIsImZpeGVkUHJpb3JpdHkiLCJfZ2V0Rml4ZWRQcmlvcml0eSIsIl9zZXRTY2VuZUdyYXBoUHJpb3JpdHkiLCJub2RlIiwiX2dldFNjZW5lR3JhcGhQcmlvcml0eSIsImNoZWNrQXZhaWxhYmxlIiwiY2xvbmUiLCJzZXRFbmFibGVkIiwiZW5hYmxlZCIsImlzRW5hYmxlZCIsInJldGFpbiIsInJlbGVhc2UiLCJVTktOT1dOIiwiVE9VQ0hfT05FX0JZX09ORSIsIlRPVUNIX0FMTF9BVF9PTkNFIiwiS0VZQk9BUkQiLCJNT1VTRSIsIkFDQ0VMRVJBVElPTiIsIkNVU1RPTSIsIkxpc3RlbmVySUQiLCJDdXN0b20iLCJsaXN0ZW5lcklkIiwiX29uQ3VzdG9tRXZlbnQiLCJjYWxsIiwiX2NhbGxiYWNrIiwiZXh0ZW5kIiwibWl4aW4iLCJldmVudCIsIk1vdXNlIiwib25Nb3VzZURvd24iLCJvbk1vdXNlVXAiLCJvbk1vdXNlTW92ZSIsIm9uTW91c2VTY3JvbGwiLCJldmVudFR5cGUiLCJFdmVudCIsIkV2ZW50TW91c2UiLCJfZXZlbnRUeXBlIiwiRE9XTiIsIlVQIiwiTU9WRSIsIlNDUk9MTCIsImV2ZW50TGlzdGVuZXIiLCJUb3VjaE9uZUJ5T25lIiwiX2NsYWltZWRUb3VjaGVzIiwic3dhbGxvd1RvdWNoZXMiLCJvblRvdWNoQmVnYW4iLCJvblRvdWNoTW92ZWQiLCJvblRvdWNoRW5kZWQiLCJvblRvdWNoQ2FuY2VsbGVkIiwic2V0U3dhbGxvd1RvdWNoZXMiLCJuZWVkU3dhbGxvdyIsImlzU3dhbGxvd1RvdWNoZXMiLCJsb2dJRCIsIlRvdWNoQWxsQXRPbmNlIiwib25Ub3VjaGVzQmVnYW4iLCJvblRvdWNoZXNNb3ZlZCIsIm9uVG91Y2hlc0VuZGVkIiwib25Ub3VjaGVzQ2FuY2VsbGVkIiwiQWNjZWxlcmF0aW9uIiwiX29uQWNjZWxlcmF0aW9uRXZlbnQiLCJhY2MiLCJhc3NlcnRJRCIsIktleWJvYXJkIiwib25LZXlQcmVzc2VkIiwib25LZXlSZWxlYXNlZCIsImlzUHJlc3NlZCIsImtleUNvZGUiLCJjcmVhdGUiLCJhcmdPYmoiLCJsaXN0ZW5lclR5cGUiLCJsaXN0ZW5lciIsImV2ZW50TmFtZSIsImtleSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFJQSxFQUFFLEdBQUdDLE9BQU8sQ0FBQyxnQkFBRCxDQUFoQjtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBOzs7Ozs7Ozs7QUFPQUMsRUFBRSxDQUFDQyxhQUFILEdBQW1CLFVBQVVDLElBQVYsRUFBZ0JDLFVBQWhCLEVBQTRCQyxRQUE1QixFQUFzQztBQUNyRCxPQUFLQyxRQUFMLEdBQWdCRCxRQUFoQixDQURxRCxDQUN6Qjs7QUFDNUIsT0FBS0UsS0FBTCxHQUFhSixJQUFJLElBQUksQ0FBckIsQ0FGcUQsQ0FFekI7O0FBQzVCLE9BQUtLLFdBQUwsR0FBbUJKLFVBQVUsSUFBSSxFQUFqQyxDQUhxRCxDQUdiOztBQUN4QyxPQUFLSyxXQUFMLEdBQW1CLEtBQW5CLENBSnFELENBSXpCOztBQUU1QixPQUFLQyxjQUFMLEdBQXNCLENBQXRCLENBTnFELENBTXpCOztBQUM1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R08sWUFBWSxLQUFLOUYsRUFBRSxDQUFDQyxhQUFILENBQWlCeUMsWUFBckMsRUFBa0Q7QUFDbkRxRCxJQUFBQSxRQUFRLEdBQUcsSUFBSVosWUFBSixDQUFpQlUsTUFBTSxDQUFDekYsUUFBeEIsQ0FBWDtBQUNBLFdBQU95RixNQUFNLENBQUN6RixRQUFkO0FBQ0g7O0FBRUQsT0FBSSxJQUFJNkYsR0FBUixJQUFlSixNQUFmLEVBQXVCO0FBQ25CRSxJQUFBQSxRQUFRLENBQUNFLEdBQUQsQ0FBUixHQUFnQkosTUFBTSxDQUFDSSxHQUFELENBQXRCO0FBQ0g7O0FBQ0QsU0FBT0YsUUFBUDtBQUNILENBNUJEOztBQThCQUcsTUFBTSxDQUFDQyxPQUFQLEdBQWlCbkcsRUFBRSxDQUFDQyxhQUFwQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxudmFyIGpzID0gcmVxdWlyZSgnLi4vcGxhdGZvcm0vanMnKTtcblxuLyoqXG4gKiAhI2VuXG4gKiA8cD5cbiAqICAgICBUaGUgYmFzZSBjbGFzcyBvZiBldmVudCBsaXN0ZW5lci4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICogICAgIElmIHlvdSBuZWVkIGN1c3RvbSBsaXN0ZW5lciB3aGljaCB3aXRoIGRpZmZlcmVudCBjYWxsYmFjaywgeW91IG5lZWQgdG8gaW5oZXJpdCB0aGlzIGNsYXNzLiAgICAgICAgICAgICAgIDxici8+XG4gKiAgICAgRm9yIGluc3RhbmNlLCB5b3UgY291bGQgcmVmZXIgdG8gRXZlbnRMaXN0ZW5lckFjY2VsZXJhdGlvbiwgRXZlbnRMaXN0ZW5lcktleWJvYXJkLCAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAqICAgICAgRXZlbnRMaXN0ZW5lclRvdWNoT25lQnlPbmUsIEV2ZW50TGlzdGVuZXJDdXN0b20uXG4gKiA8L3A+XG4gKlxuICogISN6aFxuICog5bCB6KOF55So5oi355qE5LqL5Lu25aSE55CG6YC76L6R44CCXG4gKiDms6jmhI/vvJrov5nmmK/kuIDkuKrmir3osaHnsbvvvIzlvIDlj5HogIXkuI3lupTor6Xnm7TmjqXlrp7kvovljJbov5nkuKrnsbvvvIzor7flj4LogIMge3sjY3Jvc3NMaW5rIFwiRXZlbnRMaXN0ZW5lci9jcmVhdGU6bWV0aG9kXCJ9fWNjLkV2ZW50TGlzdGVuZXIuY3JlYXRle3svY3Jvc3NMaW5rfX3jgIJcbiAqXG4gKiBAY2xhc3MgRXZlbnRMaXN0ZW5lclxuICovXG5cbi8qKlxuICogQ29uc3RydWN0b3JcbiAqIEBtZXRob2QgY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7TnVtYmVyfSB0eXBlXG4gKiBAcGFyYW0ge051bWJlcn0gbGlzdGVuZXJJRFxuICogQHBhcmFtIHtOdW1iZXJ9IGNhbGxiYWNrXG4gKi9cbmNjLkV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbiAodHlwZSwgbGlzdGVuZXJJRCwgY2FsbGJhY2spIHtcbiAgICB0aGlzLl9vbkV2ZW50ID0gY2FsbGJhY2s7ICAgLy8gRXZlbnQgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICB0aGlzLl90eXBlID0gdHlwZSB8fCAwOyAgICAgLy8gRXZlbnQgbGlzdGVuZXIgdHlwZVxuICAgIHRoaXMuX2xpc3RlbmVySUQgPSBsaXN0ZW5lcklEIHx8IFwiXCI7ICAgIC8vIEV2ZW50IGxpc3RlbmVyIElEXG4gICAgdGhpcy5fcmVnaXN0ZXJlZCA9IGZhbHNlOyAgIC8vIFdoZXRoZXIgdGhlIGxpc3RlbmVyIGhhcyBiZWVuIGFkZGVkIHRvIGRpc3BhdGNoZXIuXG5cbiAgICB0aGlzLl9maXhlZFByaW9yaXR5ID0gMDsgICAgLy8gVGhlIGhpZ2hlciB0aGUgbnVtYmVyLCB0aGUgaGlnaGVyIHRoZSBwcmlvcml0eSwgMCBpcyBmb3Igc2NlbmUgZ3JhcGggYmFzZSBwcmlvcml0eS5cbiAgICB0aGlzLl9ub2RlID0gbnVsbDsgICAgICAgICAgLy8gc2NlbmUgZ3JhcGggYmFzZWQgcHJpb3JpdHlcbiAgICB0aGlzLl90YXJnZXQgPSBudWxsO1xuICAgIHRoaXMuX3BhdXNlZCA9IHRydWU7ICAgICAgICAvLyBXaGV0aGVyIHRoZSBsaXN0ZW5lciBpcyBwYXVzZWRcbiAgICB0aGlzLl9pc0VuYWJsZWQgPSB0cnVlOyAgICAgLy8gV2hldGhlciB0aGUgbGlzdGVuZXIgaXMgZW5hYmxlZFxufTtcblxuY2MuRXZlbnRMaXN0ZW5lci5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IGNjLkV2ZW50TGlzdGVuZXIsXG4gICAgLypcbiAgICAgKiA8cD5cbiAgICAgKiAgICAgU2V0cyBwYXVzZWQgc3RhdGUgZm9yIHRoZSBsaXN0ZW5lclxuICAgICAqICAgICBUaGUgcGF1c2VkIHN0YXRlIGlzIG9ubHkgdXNlZCBmb3Igc2NlbmUgZ3JhcGggcHJpb3JpdHkgbGlzdGVuZXJzLlxuICAgICAqICAgICBgRXZlbnREaXNwYXRjaGVyOjpyZXN1bWVBbGxFdmVudExpc3RlbmVyc0ZvclRhcmdldChub2RlKWAgd2lsbCBzZXQgdGhlIHBhdXNlZCBzdGF0ZSB0byBgdHJ1ZWAsXG4gICAgICogICAgIHdoaWxlIGBFdmVudERpc3BhdGNoZXI6OnBhdXNlQWxsRXZlbnRMaXN0ZW5lcnNGb3JUYXJnZXQobm9kZSlgIHdpbGwgc2V0IGl0IHRvIGBmYWxzZWAuXG4gICAgICogICAgIEBub3RlIDEpIEZpeGVkIHByaW9yaXR5IGxpc3RlbmVycyB3aWxsIG5ldmVyIGdldCBwYXVzZWQuIElmIGEgZml4ZWQgcHJpb3JpdHkgZG9lc24ndCB3YW50IHRvIHJlY2VpdmUgZXZlbnRzLFxuICAgICAqICAgICAgICAgICAgICBjYWxsIGBzZXRFbmFibGVkKGZhbHNlKWAgaW5zdGVhZC5cbiAgICAgKiAgICAgICAgICAgIDIpIEluIGBOb2RlYCdzIG9uRW50ZXIgYW5kIG9uRXhpdCwgdGhlIGBwYXVzZWQgc3RhdGVgIG9mIHRoZSBsaXN0ZW5lcnMgd2hpY2ggYXNzb2NpYXRlZCB3aXRoIHRoYXQgbm9kZSB3aWxsIGJlIGF1dG9tYXRpY2FsbHkgdXBkYXRlZC5cbiAgICAgKiA8L3A+XG4gICAgICogQHBhcmFtIHtCb29sZWFufSBwYXVzZWRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXRQYXVzZWQ6IGZ1bmN0aW9uIChwYXVzZWQpIHtcbiAgICAgICAgdGhpcy5fcGF1c2VkID0gcGF1c2VkO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIENoZWNrcyB3aGV0aGVyIHRoZSBsaXN0ZW5lciBpcyBwYXVzZWQuXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfaXNQYXVzZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhdXNlZDtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBNYXJrcyB0aGUgbGlzdGVuZXIgd2FzIHJlZ2lzdGVyZWQgYnkgRXZlbnREaXNwYXRjaGVyLlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gcmVnaXN0ZXJlZFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldFJlZ2lzdGVyZWQ6IGZ1bmN0aW9uIChyZWdpc3RlcmVkKSB7XG4gICAgICAgIHRoaXMuX3JlZ2lzdGVyZWQgPSByZWdpc3RlcmVkO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIENoZWNrcyB3aGV0aGVyIHRoZSBsaXN0ZW5lciB3YXMgcmVnaXN0ZXJlZCBieSBFdmVudERpc3BhdGNoZXJcbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9pc1JlZ2lzdGVyZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlZ2lzdGVyZWQ7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogR2V0cyB0aGUgdHlwZSBvZiB0aGlzIGxpc3RlbmVyXG4gICAgICogQG5vdGUgSXQncyBkaWZmZXJlbnQgZnJvbSBgRXZlbnRUeXBlYCwgZS5nLiBUb3VjaEV2ZW50IGhhcyB0d28ga2luZHMgb2YgZXZlbnQgbGlzdGVuZXJzIC0gRXZlbnRMaXN0ZW5lck9uZUJ5T25lLCBFdmVudExpc3RlbmVyQWxsQXRPbmNlXG4gICAgICogQHJldHVybnMge051bWJlcn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9nZXRUeXBlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90eXBlO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqICBHZXRzIHRoZSBsaXN0ZW5lciBJRCBvZiB0aGlzIGxpc3RlbmVyXG4gICAgICogIFdoZW4gZXZlbnQgaXMgYmVpbmcgZGlzcGF0Y2hlZCwgbGlzdGVuZXIgSUQgaXMgdXNlZCBhcyBrZXkgZm9yIHNlYXJjaGluZyBsaXN0ZW5lcnMgYWNjb3JkaW5nIHRvIGV2ZW50IHR5cGUuXG4gICAgICogQHJldHVybnMge1N0cmluZ31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9nZXRMaXN0ZW5lcklEOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9saXN0ZW5lcklEO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIFNldHMgdGhlIGZpeGVkIHByaW9yaXR5IGZvciB0aGlzIGxpc3RlbmVyXG4gICAgICogIEBub3RlIFRoaXMgbWV0aG9kIGlzIG9ubHkgdXNlZCBmb3IgYGZpeGVkIHByaW9yaXR5IGxpc3RlbmVyc2AsIGl0IG5lZWRzIHRvIGFjY2VzcyBhIG5vbi16ZXJvIHZhbHVlLiAwIGlzIHJlc2VydmVkIGZvciBzY2VuZSBncmFwaCBwcmlvcml0eSBsaXN0ZW5lcnNcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZml4ZWRQcmlvcml0eVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldEZpeGVkUHJpb3JpdHk6IGZ1bmN0aW9uIChmaXhlZFByaW9yaXR5KSB7XG4gICAgICAgIHRoaXMuX2ZpeGVkUHJpb3JpdHkgPSBmaXhlZFByaW9yaXR5O1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIEdldHMgdGhlIGZpeGVkIHByaW9yaXR5IG9mIHRoaXMgbGlzdGVuZXJcbiAgICAgKiBAcmV0dXJucyB7TnVtYmVyfSAwIGlmIGl0J3MgYSBzY2VuZSBncmFwaCBwcmlvcml0eSBsaXN0ZW5lciwgbm9uLXplcm8gZm9yIGZpeGVkIHByaW9yaXR5IGxpc3RlbmVyXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZ2V0Rml4ZWRQcmlvcml0eTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZml4ZWRQcmlvcml0eTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBTZXRzIHNjZW5lIGdyYXBoIHByaW9yaXR5IGZvciB0aGlzIGxpc3RlbmVyXG4gICAgICogQHBhcmFtIHtjYy5Ob2RlfSBub2RlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0U2NlbmVHcmFwaFByaW9yaXR5OiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICB0aGlzLl90YXJnZXQgPSBub2RlO1xuICAgICAgICB0aGlzLl9ub2RlID0gbm9kZTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBHZXRzIHNjZW5lIGdyYXBoIHByaW9yaXR5IG9mIHRoaXMgbGlzdGVuZXJcbiAgICAgKiBAcmV0dXJucyB7Y2MuTm9kZX0gaWYgaXQncyBhIGZpeGVkIHByaW9yaXR5IGxpc3RlbmVyLCBub24tbnVsbCBmb3Igc2NlbmUgZ3JhcGggcHJpb3JpdHkgbGlzdGVuZXJcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9nZXRTY2VuZUdyYXBoUHJpb3JpdHk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25vZGU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2hlY2tzIHdoZXRoZXIgdGhlIGxpc3RlbmVyIGlzIGF2YWlsYWJsZS5cbiAgICAgKiAhI3poIOajgOa1i+ebkeWQrOWZqOaYr+WQpuacieaViFxuICAgICAqIEBtZXRob2QgY2hlY2tBdmFpbGFibGVcbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBjaGVja0F2YWlsYWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fb25FdmVudCAhPT0gbnVsbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBDbG9uZXMgdGhlIGxpc3RlbmVyLCBpdHMgc3ViY2xhc3NlcyBoYXZlIHRvIG92ZXJyaWRlIHRoaXMgbWV0aG9kLlxuICAgICAqICEjemgg5YWL6ZqG55uR5ZCs5ZmoLOWug+eahOWtkOexu+W/hemhu+mHjeWGmeatpOaWueazleOAglxuICAgICAqIEBtZXRob2QgY2xvbmVcbiAgICAgKiBAcmV0dXJucyB7RXZlbnRMaXN0ZW5lcn1cbiAgICAgKi9cbiAgICBjbG9uZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogICEjZW4gRW5hYmxlcyBvciBkaXNhYmxlcyB0aGUgbGlzdGVuZXJcbiAgICAgKiAgISN6aCDlkK/nlKjmiJbnpoHnlKjnm5HlkKzlmajjgIJcbiAgICAgKiAgQG1ldGhvZCBzZXRFbmFibGVkXG4gICAgICogIEBwYXJhbSB7Qm9vbGVhbn0gZW5hYmxlZFxuICAgICAqICBAbm90ZSBPbmx5IGxpc3RlbmVycyB3aXRoIGBlbmFibGVkYCBzdGF0ZSB3aWxsIGJlIGFibGUgdG8gcmVjZWl2ZSBldmVudHMuXG4gICAgICogICAgICAgICAgV2hlbiBhbiBsaXN0ZW5lciB3YXMgaW5pdGlhbGl6ZWQsIGl0J3MgZW5hYmxlZCBieSBkZWZhdWx0LlxuICAgICAqICAgICAgICAgIEFuIGV2ZW50IGxpc3RlbmVyIGNhbiByZWNlaXZlIGV2ZW50cyB3aGVuIGl0IGlzIGVuYWJsZWQgYW5kIGlzIG5vdCBwYXVzZWQuXG4gICAgICogICAgICAgICAgcGF1c2VkIHN0YXRlIGlzIGFsd2F5cyBmYWxzZSB3aGVuIGl0IGlzIGEgZml4ZWQgcHJpb3JpdHkgbGlzdGVuZXIuXG4gICAgICovXG4gICAgc2V0RW5hYmxlZDogZnVuY3Rpb24oZW5hYmxlZCl7XG4gICAgICAgIHRoaXMuX2lzRW5hYmxlZCA9IGVuYWJsZWQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2hlY2tzIHdoZXRoZXIgdGhlIGxpc3RlbmVyIGlzIGVuYWJsZWRcbiAgICAgKiAhI3poIOajgOafpeebkeWQrOWZqOaYr+WQpuWPr+eUqOOAglxuICAgICAqIEBtZXRob2QgaXNFbmFibGVkXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAgICovXG4gICAgaXNFbmFibGVkOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5faXNFbmFibGVkO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIDxwPkN1cnJlbnRseSBKYXZhU2NyaXB0IEJpbmRpbmdzIChKU0IpLCBpbiBzb21lIGNhc2VzLCBuZWVkcyB0byB1c2UgcmV0YWluIGFuZCByZWxlYXNlLiBUaGlzIGlzIGEgYnVnIGluIEpTQixcbiAgICAgKiBhbmQgdGhlIHVnbHkgd29ya2Fyb3VuZCBpcyB0byB1c2UgcmV0YWluL3JlbGVhc2UuIFNvLCB0aGVzZSAyIG1ldGhvZHMgd2VyZSBhZGRlZCB0byBiZSBjb21wYXRpYmxlIHdpdGggSlNCLlxuICAgICAqIFRoaXMgaXMgYSBoYWNrLCBhbmQgc2hvdWxkIGJlIHJlbW92ZWQgb25jZSBKU0IgZml4ZXMgdGhlIHJldGFpbi9yZWxlYXNlIGJ1Zzxici8+XG4gICAgICogWW91IHdpbGwgbmVlZCB0byByZXRhaW4gYW4gb2JqZWN0IGlmIHlvdSBjcmVhdGVkIGEgbGlzdGVuZXIgYW5kIGhhdmVuJ3QgYWRkZWQgaXQgYW55IHRhcmdldCBub2RlIGR1cmluZyB0aGUgc2FtZSBmcmFtZS48YnIvPlxuICAgICAqIE90aGVyd2lzZSwgSlNCJ3MgbmF0aXZlIGF1dG9yZWxlYXNlIHBvb2wgd2lsbCBjb25zaWRlciB0aGlzIG9iamVjdCBhIHVzZWxlc3Mgb25lIGFuZCByZWxlYXNlIGl0IGRpcmVjdGx5LDxici8+XG4gICAgICogd2hlbiB5b3Ugd2FudCB0byB1c2UgaXQgbGF0ZXIsIGEgXCJJbnZhbGlkIE5hdGl2ZSBPYmplY3RcIiBlcnJvciB3aWxsIGJlIHJhaXNlZC48YnIvPlxuICAgICAqIFRoZSByZXRhaW4gZnVuY3Rpb24gY2FuIGluY3JlYXNlIGEgcmVmZXJlbmNlIGNvdW50IGZvciB0aGUgbmF0aXZlIG9iamVjdCB0byBhdm9pZCBpdCBiZWluZyByZWxlYXNlZCw8YnIvPlxuICAgICAqIHlvdSBuZWVkIHRvIG1hbnVhbGx5IGludm9rZSByZWxlYXNlIGZ1bmN0aW9uIHdoZW4geW91IHRoaW5rIHRoaXMgb2JqZWN0IGlzIG5vIGxvbmdlciBuZWVkZWQsIG90aGVyd2lzZSwgdGhlcmUgd2lsbCBiZSBtZW1vcnkgbGVhcmtzLjxici8+XG4gICAgICogcmV0YWluIGFuZCByZWxlYXNlIGZ1bmN0aW9uIGNhbGwgc2hvdWxkIGJlIHBhaXJlZCBpbiBkZXZlbG9wZXIncyBnYW1lIGNvZGUuPC9wPlxuICAgICAqXG4gICAgICogQG1ldGhvZCByZXRhaW5cbiAgICAgKiBAc2VlIGNjLkV2ZW50TGlzdGVuZXIjcmVsZWFzZVxuICAgICAqL1xuICAgIHJldGFpbjpmdW5jdGlvbiAoKSB7XG4gICAgfSxcbiAgICAvKlxuICAgICAqIDxwPkN1cnJlbnRseSBKYXZhU2NyaXB0IEJpbmRpbmdzIChKU0IpLCBpbiBzb21lIGNhc2VzLCBuZWVkcyB0byB1c2UgcmV0YWluIGFuZCByZWxlYXNlLiBUaGlzIGlzIGEgYnVnIGluIEpTQixcbiAgICAgKiBhbmQgdGhlIHVnbHkgd29ya2Fyb3VuZCBpcyB0byB1c2UgcmV0YWluL3JlbGVhc2UuIFNvLCB0aGVzZSAyIG1ldGhvZHMgd2VyZSBhZGRlZCB0byBiZSBjb21wYXRpYmxlIHdpdGggSlNCLlxuICAgICAqIFRoaXMgaXMgYSBoYWNrLCBhbmQgc2hvdWxkIGJlIHJlbW92ZWQgb25jZSBKU0IgZml4ZXMgdGhlIHJldGFpbi9yZWxlYXNlIGJ1Zzxici8+XG4gICAgICogWW91IHdpbGwgbmVlZCB0byByZXRhaW4gYW4gb2JqZWN0IGlmIHlvdSBjcmVhdGVkIGEgbGlzdGVuZXIgYW5kIGhhdmVuJ3QgYWRkZWQgaXQgYW55IHRhcmdldCBub2RlIGR1cmluZyB0aGUgc2FtZSBmcmFtZS48YnIvPlxuICAgICAqIE90aGVyd2lzZSwgSlNCJ3MgbmF0aXZlIGF1dG9yZWxlYXNlIHBvb2wgd2lsbCBjb25zaWRlciB0aGlzIG9iamVjdCBhIHVzZWxlc3Mgb25lIGFuZCByZWxlYXNlIGl0IGRpcmVjdGx5LDxici8+XG4gICAgICogd2hlbiB5b3Ugd2FudCB0byB1c2UgaXQgbGF0ZXIsIGEgXCJJbnZhbGlkIE5hdGl2ZSBPYmplY3RcIiBlcnJvciB3aWxsIGJlIHJhaXNlZC48YnIvPlxuICAgICAqIFRoZSByZXRhaW4gZnVuY3Rpb24gY2FuIGluY3JlYXNlIGEgcmVmZXJlbmNlIGNvdW50IGZvciB0aGUgbmF0aXZlIG9iamVjdCB0byBhdm9pZCBpdCBiZWluZyByZWxlYXNlZCw8YnIvPlxuICAgICAqIHlvdSBuZWVkIHRvIG1hbnVhbGx5IGludm9rZSByZWxlYXNlIGZ1bmN0aW9uIHdoZW4geW91IHRoaW5rIHRoaXMgb2JqZWN0IGlzIG5vIGxvbmdlciBuZWVkZWQsIG90aGVyd2lzZSwgdGhlcmUgd2lsbCBiZSBtZW1vcnkgbGVhcmtzLjxici8+XG4gICAgICogcmV0YWluIGFuZCByZWxlYXNlIGZ1bmN0aW9uIGNhbGwgc2hvdWxkIGJlIHBhaXJlZCBpbiBkZXZlbG9wZXIncyBnYW1lIGNvZGUuPC9wPlxuICAgICAqXG4gICAgICogQG1ldGhvZCByZWxlYXNlXG4gICAgICogQHNlZSBjYy5FdmVudExpc3RlbmVyI3JldGFpblxuICAgICAqL1xuICAgIHJlbGVhc2U6ZnVuY3Rpb24gKCkge1xuICAgIH1cbn07XG5cbi8vIGV2ZW50IGxpc3RlbmVyIHR5cGVcbi8qKlxuICogISNlbiBUaGUgdHlwZSBjb2RlIG9mIHVua25vd24gZXZlbnQgbGlzdGVuZXIuXG4gKiAhI3poIOacquefpeeahOS6i+S7tuebkeWQrOWZqOexu+Wei1xuICogQHByb3BlcnR5IFVOS05PV05cbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKiBAc3RhdGljXG4gKi9cbmNjLkV2ZW50TGlzdGVuZXIuVU5LTk9XTiA9IDA7XG4vKlxuICogISNlbiBUaGUgdHlwZSBjb2RlIG9mIG9uZSBieSBvbmUgdG91Y2ggZXZlbnQgbGlzdGVuZXIuXG4gKiAhI3poIOinpuaRuOS6i+S7tuebkeWQrOWZqOexu+Wei++8jOinpueCueS8muS4gOS4quS4gOS4quW+l+WIhuW8gOiiq+a0vuWPkVxuICogQHByb3BlcnR5IFRPVUNIX09ORV9CWV9PTkVcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKiBAc3RhdGljXG4gKi9cbmNjLkV2ZW50TGlzdGVuZXIuVE9VQ0hfT05FX0JZX09ORSA9IDE7XG4vKlxuICogISNlbiBUaGUgdHlwZSBjb2RlIG9mIGFsbCBhdCBvbmNlIHRvdWNoIGV2ZW50IGxpc3RlbmVyLlxuICogISN6aCDop6bmkbjkuovku7bnm5HlkKzlmajnsbvlnovvvIzop6bngrnkvJrooqvkuIDmrKHmgKflhajpg6jmtL7lj5FcbiAqIEBwcm9wZXJ0eSBUT1VDSF9BTExfQVRfT05DRVxuICogQHR5cGUge051bWJlcn1cbiAqIEBzdGF0aWNcbiAqL1xuY2MuRXZlbnRMaXN0ZW5lci5UT1VDSF9BTExfQVRfT05DRSA9IDI7XG4vKipcbiAqICEjZW4gVGhlIHR5cGUgY29kZSBvZiBrZXlib2FyZCBldmVudCBsaXN0ZW5lci5cbiAqICEjemgg6ZSu55uY5LqL5Lu255uR5ZCs5Zmo57G75Z6LXG4gKiBAcHJvcGVydHkgS0VZQk9BUkRcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKiBAc3RhdGljXG4gKi9cbmNjLkV2ZW50TGlzdGVuZXIuS0VZQk9BUkQgPSAzO1xuLypcbiAqICEjZW4gVGhlIHR5cGUgY29kZSBvZiBtb3VzZSBldmVudCBsaXN0ZW5lci5cbiAqICEjemgg6byg5qCH5LqL5Lu255uR5ZCs5Zmo57G75Z6LXG4gKiBAcHJvcGVydHkgTU9VU0VcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKiBAc3RhdGljXG4gKi9cbmNjLkV2ZW50TGlzdGVuZXIuTU9VU0UgPSA0O1xuLyoqXG4gKiAhI2VuIFRoZSB0eXBlIGNvZGUgb2YgYWNjZWxlcmF0aW9uIGV2ZW50IGxpc3RlbmVyLlxuICogISN6aCDliqDpgJ/lmajkuovku7bnm5HlkKzlmajnsbvlnotcbiAqIEBwcm9wZXJ0eSBBQ0NFTEVSQVRJT05cbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKiBAc3RhdGljXG4gKi9cbmNjLkV2ZW50TGlzdGVuZXIuQUNDRUxFUkFUSU9OID0gNjtcbi8qXG4gKiAhI2VuIFRoZSB0eXBlIGNvZGUgb2YgY3VzdG9tIGV2ZW50IGxpc3RlbmVyLlxuICogISN6aCDoh6rlrprkuYnkuovku7bnm5HlkKzlmajnsbvlnotcbiAqIEBwcm9wZXJ0eSBDVVNUT01cbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKiBAc3RhdGljXG4gKi9cbmNjLkV2ZW50TGlzdGVuZXIuQ1VTVE9NID0gODtcblxudmFyIExpc3RlbmVySUQgPSBjYy5FdmVudExpc3RlbmVyLkxpc3RlbmVySUQgPSB7XG4gICAgTU9VU0U6ICdfX2NjX21vdXNlJyxcbiAgICBUT1VDSF9PTkVfQllfT05FOiAnX19jY190b3VjaF9vbmVfYnlfb25lJyxcbiAgICBUT1VDSF9BTExfQVRfT05DRTogJ19fY2NfdG91Y2hfYWxsX2F0X29uY2UnLFxuICAgIEtFWUJPQVJEOiAnX19jY19rZXlib2FyZCcsXG4gICAgQUNDRUxFUkFUSU9OOiAnX19jY19hY2NlbGVyYXRpb24nLFxufTtcblxudmFyIEN1c3RvbSA9IGZ1bmN0aW9uIChsaXN0ZW5lcklkLCBjYWxsYmFjaykge1xuICAgIHRoaXMuX29uQ3VzdG9tRXZlbnQgPSBjYWxsYmFjaztcbiAgICBjYy5FdmVudExpc3RlbmVyLmNhbGwodGhpcywgY2MuRXZlbnRMaXN0ZW5lci5DVVNUT00sIGxpc3RlbmVySWQsIHRoaXMuX2NhbGxiYWNrKTtcbn07XG5qcy5leHRlbmQoQ3VzdG9tLCBjYy5FdmVudExpc3RlbmVyKTtcbmpzLm1peGluKEN1c3RvbS5wcm90b3R5cGUsIHtcbiAgICBfb25DdXN0b21FdmVudDogbnVsbCxcbiAgICBcbiAgICBfY2FsbGJhY2s6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBpZiAodGhpcy5fb25DdXN0b21FdmVudCAhPT0gbnVsbClcbiAgICAgICAgICAgIHRoaXMuX29uQ3VzdG9tRXZlbnQoZXZlbnQpO1xuICAgIH0sXG5cbiAgICBjaGVja0F2YWlsYWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKGNjLkV2ZW50TGlzdGVuZXIucHJvdG90eXBlLmNoZWNrQXZhaWxhYmxlLmNhbGwodGhpcykgJiYgdGhpcy5fb25DdXN0b21FdmVudCAhPT0gbnVsbCk7XG4gICAgfSxcblxuICAgIGNsb25lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ3VzdG9tKHRoaXMuX2xpc3RlbmVySUQsIHRoaXMuX29uQ3VzdG9tRXZlbnQpO1xuICAgIH1cbn0pO1xuXG52YXIgTW91c2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgY2MuRXZlbnRMaXN0ZW5lci5jYWxsKHRoaXMsIGNjLkV2ZW50TGlzdGVuZXIuTU9VU0UsIExpc3RlbmVySUQuTU9VU0UsIHRoaXMuX2NhbGxiYWNrKTtcbn07XG5qcy5leHRlbmQoTW91c2UsIGNjLkV2ZW50TGlzdGVuZXIpO1xuanMubWl4aW4oTW91c2UucHJvdG90eXBlLCB7XG4gICAgb25Nb3VzZURvd246IG51bGwsXG4gICAgb25Nb3VzZVVwOiBudWxsLFxuICAgIG9uTW91c2VNb3ZlOiBudWxsLFxuICAgIG9uTW91c2VTY3JvbGw6IG51bGwsXG5cbiAgICBfY2FsbGJhY2s6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB2YXIgZXZlbnRUeXBlID0gY2MuRXZlbnQuRXZlbnRNb3VzZTtcbiAgICAgICAgc3dpdGNoIChldmVudC5fZXZlbnRUeXBlKSB7XG4gICAgICAgICAgICBjYXNlIGV2ZW50VHlwZS5ET1dOOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9uTW91c2VEb3duKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTW91c2VEb3duKGV2ZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgZXZlbnRUeXBlLlVQOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9uTW91c2VVcClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbk1vdXNlVXAoZXZlbnQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBldmVudFR5cGUuTU9WRTpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vbk1vdXNlTW92ZSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShldmVudCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGV2ZW50VHlwZS5TQ1JPTEw6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub25Nb3VzZVNjcm9sbClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbk1vdXNlU2Nyb2xsKGV2ZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY2xvbmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGV2ZW50TGlzdGVuZXIgPSBuZXcgTW91c2UoKTtcbiAgICAgICAgZXZlbnRMaXN0ZW5lci5vbk1vdXNlRG93biA9IHRoaXMub25Nb3VzZURvd247XG4gICAgICAgIGV2ZW50TGlzdGVuZXIub25Nb3VzZVVwID0gdGhpcy5vbk1vdXNlVXA7XG4gICAgICAgIGV2ZW50TGlzdGVuZXIub25Nb3VzZU1vdmUgPSB0aGlzLm9uTW91c2VNb3ZlO1xuICAgICAgICBldmVudExpc3RlbmVyLm9uTW91c2VTY3JvbGwgPSB0aGlzLm9uTW91c2VTY3JvbGw7XG4gICAgICAgIHJldHVybiBldmVudExpc3RlbmVyO1xuICAgIH0sXG5cbiAgICBjaGVja0F2YWlsYWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59KTtcblxudmFyIFRvdWNoT25lQnlPbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgY2MuRXZlbnRMaXN0ZW5lci5jYWxsKHRoaXMsIGNjLkV2ZW50TGlzdGVuZXIuVE9VQ0hfT05FX0JZX09ORSwgTGlzdGVuZXJJRC5UT1VDSF9PTkVfQllfT05FLCBudWxsKTtcbiAgICB0aGlzLl9jbGFpbWVkVG91Y2hlcyA9IFtdO1xufTtcbmpzLmV4dGVuZChUb3VjaE9uZUJ5T25lLCBjYy5FdmVudExpc3RlbmVyKTtcbmpzLm1peGluKFRvdWNoT25lQnlPbmUucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IFRvdWNoT25lQnlPbmUsXG4gICAgX2NsYWltZWRUb3VjaGVzOiBudWxsLFxuICAgIHN3YWxsb3dUb3VjaGVzOiBmYWxzZSxcbiAgICBvblRvdWNoQmVnYW46IG51bGwsXG4gICAgb25Ub3VjaE1vdmVkOiBudWxsLFxuICAgIG9uVG91Y2hFbmRlZDogbnVsbCxcbiAgICBvblRvdWNoQ2FuY2VsbGVkOiBudWxsLFxuXG4gICAgc2V0U3dhbGxvd1RvdWNoZXM6IGZ1bmN0aW9uIChuZWVkU3dhbGxvdykge1xuICAgICAgICB0aGlzLnN3YWxsb3dUb3VjaGVzID0gbmVlZFN3YWxsb3c7XG4gICAgfSxcblxuICAgIGlzU3dhbGxvd1RvdWNoZXM6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLnN3YWxsb3dUb3VjaGVzO1xuICAgIH0sXG5cbiAgICBjbG9uZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZXZlbnRMaXN0ZW5lciA9IG5ldyBUb3VjaE9uZUJ5T25lKCk7XG4gICAgICAgIGV2ZW50TGlzdGVuZXIub25Ub3VjaEJlZ2FuID0gdGhpcy5vblRvdWNoQmVnYW47XG4gICAgICAgIGV2ZW50TGlzdGVuZXIub25Ub3VjaE1vdmVkID0gdGhpcy5vblRvdWNoTW92ZWQ7XG4gICAgICAgIGV2ZW50TGlzdGVuZXIub25Ub3VjaEVuZGVkID0gdGhpcy5vblRvdWNoRW5kZWQ7XG4gICAgICAgIGV2ZW50TGlzdGVuZXIub25Ub3VjaENhbmNlbGxlZCA9IHRoaXMub25Ub3VjaENhbmNlbGxlZDtcbiAgICAgICAgZXZlbnRMaXN0ZW5lci5zd2FsbG93VG91Y2hlcyA9IHRoaXMuc3dhbGxvd1RvdWNoZXM7XG4gICAgICAgIHJldHVybiBldmVudExpc3RlbmVyO1xuICAgIH0sXG5cbiAgICBjaGVja0F2YWlsYWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZighdGhpcy5vblRvdWNoQmVnYW4pe1xuICAgICAgICAgICAgY2MubG9nSUQoMTgwMSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufSk7XG5cbnZhciBUb3VjaEFsbEF0T25jZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBjYy5FdmVudExpc3RlbmVyLmNhbGwodGhpcywgY2MuRXZlbnRMaXN0ZW5lci5UT1VDSF9BTExfQVRfT05DRSwgTGlzdGVuZXJJRC5UT1VDSF9BTExfQVRfT05DRSwgbnVsbCk7XG59O1xuanMuZXh0ZW5kKFRvdWNoQWxsQXRPbmNlLCBjYy5FdmVudExpc3RlbmVyKTtcbmpzLm1peGluKFRvdWNoQWxsQXRPbmNlLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiBUb3VjaEFsbEF0T25jZSxcbiAgICBvblRvdWNoZXNCZWdhbjogbnVsbCxcbiAgICBvblRvdWNoZXNNb3ZlZDogbnVsbCxcbiAgICBvblRvdWNoZXNFbmRlZDogbnVsbCxcbiAgICBvblRvdWNoZXNDYW5jZWxsZWQ6IG51bGwsXG5cbiAgICBjbG9uZTogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGV2ZW50TGlzdGVuZXIgPSBuZXcgVG91Y2hBbGxBdE9uY2UoKTtcbiAgICAgICAgZXZlbnRMaXN0ZW5lci5vblRvdWNoZXNCZWdhbiA9IHRoaXMub25Ub3VjaGVzQmVnYW47XG4gICAgICAgIGV2ZW50TGlzdGVuZXIub25Ub3VjaGVzTW92ZWQgPSB0aGlzLm9uVG91Y2hlc01vdmVkO1xuICAgICAgICBldmVudExpc3RlbmVyLm9uVG91Y2hlc0VuZGVkID0gdGhpcy5vblRvdWNoZXNFbmRlZDtcbiAgICAgICAgZXZlbnRMaXN0ZW5lci5vblRvdWNoZXNDYW5jZWxsZWQgPSB0aGlzLm9uVG91Y2hlc0NhbmNlbGxlZDtcbiAgICAgICAgcmV0dXJuIGV2ZW50TGlzdGVuZXI7XG4gICAgfSxcblxuICAgIGNoZWNrQXZhaWxhYmxlOiBmdW5jdGlvbigpe1xuICAgICAgICBpZiAodGhpcy5vblRvdWNoZXNCZWdhbiA9PT0gbnVsbCAmJiB0aGlzLm9uVG91Y2hlc01vdmVkID09PSBudWxsXG4gICAgICAgICAgICAmJiB0aGlzLm9uVG91Y2hlc0VuZGVkID09PSBudWxsICYmIHRoaXMub25Ub3VjaGVzQ2FuY2VsbGVkID09PSBudWxsKSB7XG4gICAgICAgICAgICBjYy5sb2dJRCgxODAyKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59KTtcblxuLy9BY2NlbGVyYXRpb25cbnZhciBBY2NlbGVyYXRpb24gPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9vbkFjY2VsZXJhdGlvbkV2ZW50ID0gY2FsbGJhY2s7XG4gICAgY2MuRXZlbnRMaXN0ZW5lci5jYWxsKHRoaXMsIGNjLkV2ZW50TGlzdGVuZXIuQUNDRUxFUkFUSU9OLCBMaXN0ZW5lcklELkFDQ0VMRVJBVElPTiwgdGhpcy5fY2FsbGJhY2spO1xufTtcbmpzLmV4dGVuZChBY2NlbGVyYXRpb24sIGNjLkV2ZW50TGlzdGVuZXIpO1xuanMubWl4aW4oQWNjZWxlcmF0aW9uLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiBBY2NlbGVyYXRpb24sXG4gICAgX29uQWNjZWxlcmF0aW9uRXZlbnQ6IG51bGwsXG5cbiAgICBfY2FsbGJhY2s6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB0aGlzLl9vbkFjY2VsZXJhdGlvbkV2ZW50KGV2ZW50LmFjYywgZXZlbnQpO1xuICAgIH0sXG5cbiAgICBjaGVja0F2YWlsYWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5hc3NlcnRJRCh0aGlzLl9vbkFjY2VsZXJhdGlvbkV2ZW50LCAxODAzKTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgY2xvbmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBY2NlbGVyYXRpb24odGhpcy5fb25BY2NlbGVyYXRpb25FdmVudCk7XG4gICAgfVxufSk7XG5cblxuLy9LZXlib2FyZFxudmFyIEtleWJvYXJkID0gZnVuY3Rpb24gKCkge1xuICAgIGNjLkV2ZW50TGlzdGVuZXIuY2FsbCh0aGlzLCBjYy5FdmVudExpc3RlbmVyLktFWUJPQVJELCBMaXN0ZW5lcklELktFWUJPQVJELCB0aGlzLl9jYWxsYmFjayk7XG59O1xuanMuZXh0ZW5kKEtleWJvYXJkLCBjYy5FdmVudExpc3RlbmVyKTtcbmpzLm1peGluKEtleWJvYXJkLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiBLZXlib2FyZCxcbiAgICBvbktleVByZXNzZWQ6IG51bGwsXG4gICAgb25LZXlSZWxlYXNlZDogbnVsbCxcblxuICAgIF9jYWxsYmFjazogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC5pc1ByZXNzZWQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9uS2V5UHJlc3NlZClcbiAgICAgICAgICAgICAgICB0aGlzLm9uS2V5UHJlc3NlZChldmVudC5rZXlDb2RlLCBldmVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vbktleVJlbGVhc2VkKVxuICAgICAgICAgICAgICAgIHRoaXMub25LZXlSZWxlYXNlZChldmVudC5rZXlDb2RlLCBldmVudCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY2xvbmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGV2ZW50TGlzdGVuZXIgPSBuZXcgS2V5Ym9hcmQoKTtcbiAgICAgICAgZXZlbnRMaXN0ZW5lci5vbktleVByZXNzZWQgPSB0aGlzLm9uS2V5UHJlc3NlZDtcbiAgICAgICAgZXZlbnRMaXN0ZW5lci5vbktleVJlbGVhc2VkID0gdGhpcy5vbktleVJlbGVhc2VkO1xuICAgICAgICByZXR1cm4gZXZlbnRMaXN0ZW5lcjtcbiAgICB9LFxuXG4gICAgY2hlY2tBdmFpbGFibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMub25LZXlQcmVzc2VkID09PSBudWxsICYmIHRoaXMub25LZXlSZWxlYXNlZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgY2MubG9nSUQoMTgwMCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufSk7XG5cbi8qKlxuICogISNlblxuICogQ3JlYXRlIGEgRXZlbnRMaXN0ZW5lciBvYmplY3Qgd2l0aCBjb25maWd1cmF0aW9uIGluY2x1ZGluZyB0aGUgZXZlbnQgdHlwZSwgaGFuZGxlcnMgYW5kIG90aGVyIHBhcmFtZXRlcnMuXG4gKiBJbiBoYW5kbGVycywgdGhpcyByZWZlciB0byB0aGUgZXZlbnQgbGlzdGVuZXIgb2JqZWN0IGl0c2VsZi5cbiAqIFlvdSBjYW4gYWxzbyBwYXNzIGN1c3RvbSBwYXJhbWV0ZXJzIGluIHRoZSBjb25maWd1cmF0aW9uIG9iamVjdCxcbiAqIGFsbCBjdXN0b20gcGFyYW1ldGVycyB3aWxsIGJlIHBvbHlmaWxsZWQgaW50byB0aGUgZXZlbnQgbGlzdGVuZXIgb2JqZWN0IGFuZCBjYW4gYmUgYWNjZXNzZWQgaW4gaGFuZGxlcnMuXG4gKiAhI3poIOmAmui/h+aMh+WumuS4jeWQjOeahCBFdmVudCDlr7nosaHmnaXorr7nva7mg7PopoHliJvlu7rnmoTkuovku7bnm5HlkKzlmajjgIJcbiAqIEBtZXRob2QgY3JlYXRlXG4gKiBAcGFyYW0ge09iamVjdH0gYXJnT2JqIGEganNvbiBvYmplY3RcbiAqIEByZXR1cm5zIHtFdmVudExpc3RlbmVyfVxuICogQHN0YXRpY1xuICogQGV4YW1wbGUge0BsaW5rIGNvY29zMmQvY29yZS9ldmVudC1tYW5hZ2VyL0NDRXZlbnRMaXN0ZW5lci9jcmVhdGUuanN9XG4gKi9cbmNjLkV2ZW50TGlzdGVuZXIuY3JlYXRlID0gZnVuY3Rpb24gKGFyZ09iaikge1xuICAgIGNjLmFzc2VydElEKGFyZ09iaiYmYXJnT2JqLmV2ZW50LCAxOTAwKTtcblxuICAgIHZhciBsaXN0ZW5lclR5cGUgPSBhcmdPYmouZXZlbnQ7XG4gICAgZGVsZXRlIGFyZ09iai5ldmVudDtcblxuICAgIHZhciBsaXN0ZW5lciA9IG51bGw7XG4gICAgaWYobGlzdGVuZXJUeXBlID09PSBjYy5FdmVudExpc3RlbmVyLlRPVUNIX09ORV9CWV9PTkUpXG4gICAgICAgIGxpc3RlbmVyID0gbmV3IFRvdWNoT25lQnlPbmUoKTtcbiAgICBlbHNlIGlmKGxpc3RlbmVyVHlwZSA9PT0gY2MuRXZlbnRMaXN0ZW5lci5UT1VDSF9BTExfQVRfT05DRSlcbiAgICAgICAgbGlzdGVuZXIgPSBuZXcgVG91Y2hBbGxBdE9uY2UoKTtcbiAgICBlbHNlIGlmKGxpc3RlbmVyVHlwZSA9PT0gY2MuRXZlbnRMaXN0ZW5lci5NT1VTRSlcbiAgICAgICAgbGlzdGVuZXIgPSBuZXcgTW91c2UoKTtcbiAgICBlbHNlIGlmKGxpc3RlbmVyVHlwZSA9PT0gY2MuRXZlbnRMaXN0ZW5lci5DVVNUT00pe1xuICAgICAgICBsaXN0ZW5lciA9IG5ldyBDdXN0b20oYXJnT2JqLmV2ZW50TmFtZSwgYXJnT2JqLmNhbGxiYWNrKTtcbiAgICAgICAgZGVsZXRlIGFyZ09iai5ldmVudE5hbWU7XG4gICAgICAgIGRlbGV0ZSBhcmdPYmouY2FsbGJhY2s7XG4gICAgfSBlbHNlIGlmKGxpc3RlbmVyVHlwZSA9PT0gY2MuRXZlbnRMaXN0ZW5lci5LRVlCT0FSRClcbiAgICAgICAgbGlzdGVuZXIgPSBuZXcgS2V5Ym9hcmQoKTtcbiAgICBlbHNlIGlmKGxpc3RlbmVyVHlwZSA9PT0gY2MuRXZlbnRMaXN0ZW5lci5BQ0NFTEVSQVRJT04pe1xuICAgICAgICBsaXN0ZW5lciA9IG5ldyBBY2NlbGVyYXRpb24oYXJnT2JqLmNhbGxiYWNrKTtcbiAgICAgICAgZGVsZXRlIGFyZ09iai5jYWxsYmFjaztcbiAgICB9XG5cbiAgICBmb3IodmFyIGtleSBpbiBhcmdPYmopIHtcbiAgICAgICAgbGlzdGVuZXJba2V5XSA9IGFyZ09ialtrZXldO1xuICAgIH1cbiAgICByZXR1cm4gbGlzdGVuZXI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNjLkV2ZW50TGlzdGVuZXI7Il19