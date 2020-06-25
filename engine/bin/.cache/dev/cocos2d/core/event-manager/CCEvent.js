
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/event-manager/CCEvent.js';
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
var js = cc.js;

require('../event/event');
/**
 * !#en The mouse event
 * !#zh 鼠标事件类型
 * @class Event.EventMouse
 *
 * @extends Event
 * @param {Number} eventType - The mouse event type, UP, DOWN, MOVE, CANCELED
 * @param {Boolean} [bubbles=false] - A boolean indicating whether the event bubbles up through the tree or not
 */


var EventMouse = function EventMouse(eventType, bubbles) {
  cc.Event.call(this, cc.Event.MOUSE, bubbles);
  this._eventType = eventType;
  this._button = 0;
  this._x = 0;
  this._y = 0;
  this._prevX = 0;
  this._prevY = 0;
  this._scrollX = 0;
  this._scrollY = 0;
};

js.extend(EventMouse, cc.Event);
var proto = EventMouse.prototype;
/**
 * !#en Sets scroll data.
 * !#zh 设置鼠标的滚动数据。
 * @method setScrollData
 * @param {Number} scrollX
 * @param {Number} scrollY
 */

proto.setScrollData = function (scrollX, scrollY) {
  this._scrollX = scrollX;
  this._scrollY = scrollY;
};
/**
 * !#en Returns the x axis scroll value.
 * !#zh 获取鼠标滚动的X轴距离，只有滚动时才有效。
 * @method getScrollX
 * @returns {Number}
 */


proto.getScrollX = function () {
  return this._scrollX;
};
/**
 * !#en Returns the y axis scroll value.
 * !#zh 获取滚轮滚动的 Y 轴距离，只有滚动时才有效。
 * @method getScrollY
 * @returns {Number}
 */


proto.getScrollY = function () {
  return this._scrollY;
};
/**
 * !#en Sets cursor location.
 * !#zh 设置当前鼠标位置。
 * @method setLocation
 * @param {Number} x
 * @param {Number} y
 */


proto.setLocation = function (x, y) {
  this._x = x;
  this._y = y;
};
/**
 * !#en Returns cursor location.
 * !#zh 获取鼠标位置对象，对象包含 x 和 y 属性。
 * @method getLocation
 * @return {Vec2} location
 */


proto.getLocation = function () {
  return cc.v2(this._x, this._y);
};
/**
 * !#en Returns the current cursor location in screen coordinates.
 * !#zh 获取当前事件在游戏窗口内的坐标位置对象，对象包含 x 和 y 属性。
 * @method getLocationInView
 * @return {Vec2}
 */


proto.getLocationInView = function () {
  return cc.v2(this._x, cc.view._designResolutionSize.height - this._y);
};

proto._setPrevCursor = function (x, y) {
  this._prevX = x;
  this._prevY = y;
};
/**
 * !#en Returns the previous touch location.
 * !#zh 获取鼠标点击在上一次事件时的位置对象，对象包含 x 和 y 属性。
 * @method getPreviousLocation
 * @return {Vec2}
 */


proto.getPreviousLocation = function () {
  return cc.v2(this._prevX, this._prevY);
};
/**
 * !#en Returns the delta distance from the previous location to current location.
 * !#zh 获取鼠标距离上一次事件移动的距离对象，对象包含 x 和 y 属性。
 * @method getDelta
 * @return {Vec2}
 */


proto.getDelta = function () {
  return cc.v2(this._x - this._prevX, this._y - this._prevY);
};
/**
 * !#en Returns the X axis delta distance from the previous location to current location.
 * !#zh 获取鼠标距离上一次事件移动的 X 轴距离。
 * @method getDeltaX
 * @return {Number}
 */


proto.getDeltaX = function () {
  return this._x - this._prevX;
};
/**
 * !#en Returns the Y axis delta distance from the previous location to current location.
 * !#zh 获取鼠标距离上一次事件移动的 Y 轴距离。
 * @method getDeltaY
 * @return {Number}
 */


proto.getDeltaY = function () {
  return this._y - this._prevY;
};
/**
 * !#en Sets mouse button.
 * !#zh 设置鼠标按键。
 * @method setButton
 * @param {Number} button
 */


proto.setButton = function (button) {
  this._button = button;
};
/**
 * !#en Returns mouse button.
 * !#zh 获取鼠标按键。
 * @method getButton
 * @returns {Number}
 */


proto.getButton = function () {
  return this._button;
};
/**
 * !#en Returns location X axis data.
 * !#zh 获取鼠标当前位置 X 轴。
 * @method getLocationX
 * @returns {Number}
 */


proto.getLocationX = function () {
  return this._x;
};
/**
 * !#en Returns location Y axis data.
 * !#zh 获取鼠标当前位置 Y 轴。
 * @method getLocationY
 * @returns {Number}
 */


proto.getLocationY = function () {
  return this._y;
}; //Inner event types of MouseEvent

/**
 * !#en The none event code of mouse event.
 * !#zh 无。
 * @property NONE
 * @static
 * @type {Number}
 */


EventMouse.NONE = 0;
/**
 * !#en The event type code of mouse down event.
 * !#zh 鼠标按下事件。
 * @property DOWN
 * @static
 * @type {Number}
 */

EventMouse.DOWN = 1;
/**
 * !#en The event type code of mouse up event.
 * !#zh 鼠标按下后释放事件。
 * @property UP
 * @static
 * @type {Number}
 */

EventMouse.UP = 2;
/**
 * !#en The event type code of mouse move event.
 * !#zh 鼠标移动事件。
 * @property MOVE
 * @static
 * @type {Number}
 */

EventMouse.MOVE = 3;
/**
 * !#en The event type code of mouse scroll event.
 * !#zh 鼠标滚轮事件。
 * @property SCROLL
 * @static
 * @type {Number}
 */

EventMouse.SCROLL = 4;
/**
 * !#en The tag of Mouse left button.
 * !#zh 鼠标左键的标签。
 * @property BUTTON_LEFT
 * @static
 * @type {Number}
 */

EventMouse.BUTTON_LEFT = 0;
/**
 * !#en The tag of Mouse right button  (The right button number is 2 on browser).
 * !#zh 鼠标右键的标签。
 * @property BUTTON_RIGHT
 * @static
 * @type {Number}
 */

EventMouse.BUTTON_RIGHT = 2;
/**
 * !#en The tag of Mouse middle button  (The right button number is 1 on browser).
 * !#zh 鼠标中键的标签。
 * @property BUTTON_MIDDLE
 * @static
 * @type {Number}
 */

EventMouse.BUTTON_MIDDLE = 1;
/**
 * !#en The tag of Mouse button 4.
 * !#zh 鼠标按键 4 的标签。
 * @property BUTTON_4
 * @static
 * @type {Number}
 */

EventMouse.BUTTON_4 = 3;
/**
 * !#en The tag of Mouse button 5.
 * !#zh 鼠标按键 5 的标签。
 * @property BUTTON_5
 * @static
 * @type {Number}
 */

EventMouse.BUTTON_5 = 4;
/**
 * !#en The tag of Mouse button 6.
 * !#zh 鼠标按键 6 的标签。
 * @property BUTTON_6
 * @static
 * @type {Number}
 */

EventMouse.BUTTON_6 = 5;
/**
 * !#en The tag of Mouse button 7.
 * !#zh 鼠标按键 7 的标签。
 * @property BUTTON_7
 * @static
 * @type {Number}
 */

EventMouse.BUTTON_7 = 6;
/**
 * !#en The tag of Mouse button 8.
 * !#zh 鼠标按键 8 的标签。
 * @property BUTTON_8
 * @static
 * @type {Number}
 */

EventMouse.BUTTON_8 = 7;
/**
 * !#en The touch event
 * !#zh 触摸事件
 * @class Event.EventTouch
 * @constructor
 * @extends Event
 */

/**
 * @method constructor
 * @param {Array} touchArr - The array of the touches
 * @param {Boolean} bubbles - A boolean indicating whether the event bubbles up through the tree or not
 */

var EventTouch = function EventTouch(touchArr, bubbles) {
  cc.Event.call(this, cc.Event.TOUCH, bubbles);
  this._eventCode = 0;
  this._touches = touchArr || [];
  /**
   * !#en The current touch object
   * !#zh 当前触点对象
   * @property touch
   * @type {Touch}
   */

  this.touch = null; // Actually duplicated, because of history issue, currentTouch was in the original design, touch was added in creator engine
  // They should point to the same object

  this.currentTouch = null;
};

js.extend(EventTouch, cc.Event);
proto = EventTouch.prototype;
/**
 * !#en Returns event code.
 * !#zh 获取事件类型。
 * @method getEventCode
 * @returns {Number}
 */

proto.getEventCode = function () {
  return this._eventCode;
};
/**
 * !#en Returns touches of event.
 * !#zh 获取触摸点的列表。
 * @method getTouches
 * @returns {Array}
 */


proto.getTouches = function () {
  return this._touches;
};

proto._setEventCode = function (eventCode) {
  this._eventCode = eventCode;
};

proto._setTouches = function (touches) {
  this._touches = touches;
};
/**
 * !#en Sets touch location.
 * !#zh 设置当前触点位置
 * @method setLocation
 * @param {Number} x
 * @param {Number} y
 */


proto.setLocation = function (x, y) {
  this.touch && this.touch.setTouchInfo(this.touch.getID(), x, y);
};
/**
 * !#en Returns touch location.
 * !#zh 获取触点位置。
 * @method getLocation
 * @return {Vec2} location
 */


proto.getLocation = function () {
  return this.touch ? this.touch.getLocation() : cc.v2();
};
/**
 * !#en Returns the current touch location in screen coordinates.
 * !#zh 获取当前触点在游戏窗口中的位置。
 * @method getLocationInView
 * @return {Vec2}
 */


proto.getLocationInView = function () {
  return this.touch ? this.touch.getLocationInView() : cc.v2();
};
/**
 * !#en Returns the previous touch location.
 * !#zh 获取触点在上一次事件时的位置对象，对象包含 x 和 y 属性。
 * @method getPreviousLocation
 * @return {Vec2}
 */


proto.getPreviousLocation = function () {
  return this.touch ? this.touch.getPreviousLocation() : cc.v2();
};
/**
 * !#en Returns the start touch location.
 * !#zh 获取触点落下时的位置对象，对象包含 x 和 y 属性。
 * @method getStartLocation
 * @returns {Vec2}
 */


proto.getStartLocation = function () {
  return this.touch ? this.touch.getStartLocation() : cc.v2();
};
/**
 * !#en Returns the id of cc.Touch.
 * !#zh 触点的标识 ID，可以用来在多点触摸中跟踪触点。
 * @method getID
 * @return {Number}
 */


proto.getID = function () {
  return this.touch ? this.touch.getID() : null;
};
/**
 * !#en Returns the delta distance from the previous location to current location.
 * !#zh 获取触点距离上一次事件移动的距离对象，对象包含 x 和 y 属性。
 * @method getDelta
 * @return {Vec2}
 */


proto.getDelta = function () {
  return this.touch ? this.touch.getDelta() : cc.v2();
};
/**
 * !#en Returns the X axis delta distance from the previous location to current location.
 * !#zh 获取触点距离上一次事件移动的 x 轴距离。
 * @method getDeltaX
 * @return {Number}
 */


proto.getDeltaX = function () {
  return this.touch ? this.touch.getDelta().x : 0;
};
/**
 * !#en Returns the Y axis delta distance from the previous location to current location.
 * !#zh 获取触点距离上一次事件移动的 y 轴距离。
 * @method getDeltaY
 * @return {Number}
 */


proto.getDeltaY = function () {
  return this.touch ? this.touch.getDelta().y : 0;
};
/**
 * !#en Returns location X axis data.
 * !#zh 获取当前触点 X 轴位置。
 * @method getLocationX
 * @returns {Number}
 */


proto.getLocationX = function () {
  return this.touch ? this.touch.getLocationX() : 0;
};
/**
 * !#en Returns location Y axis data.
 * !#zh 获取当前触点 Y 轴位置。
 * @method getLocationY
 * @returns {Number}
 */


proto.getLocationY = function () {
  return this.touch ? this.touch.getLocationY() : 0;
};
/**
 * !#en The maximum touch numbers
 * !#zh 最大触摸数量。
 * @constant
 * @type {Number}
 */


EventTouch.MAX_TOUCHES = 5;
/**
 * !#en The event type code of touch began event.
 * !#zh 开始触摸事件
 * @constant
 * @type {Number}
 */

EventTouch.BEGAN = 0;
/**
 * !#en The event type code of touch moved event.
 * !#zh 触摸后移动事件
 * @constant
 * @type {Number}
 */

EventTouch.MOVED = 1;
/**
 * !#en The event type code of touch ended event.
 * !#zh 结束触摸事件
 * @constant
 * @type {Number}
 */

EventTouch.ENDED = 2;
/**
 * !#en The event type code of touch cancelled event.
 * !#zh 取消触摸事件
 * @constant
 * @type {Number}
 */

EventTouch.CANCELED = 3;
/**
 * !#en The acceleration event
 * !#zh 加速度事件
 * @class Event.EventAcceleration
 * @extends Event
 *
 * @param {Object} acc - The acceleration
 * @param {Boolean} bubbles - A boolean indicating whether the event bubbles up through the tree or not
 */

var EventAcceleration = function EventAcceleration(acc, bubbles) {
  cc.Event.call(this, cc.Event.ACCELERATION, bubbles);
  this.acc = acc;
};

js.extend(EventAcceleration, cc.Event);
/**
 * !#en The keyboard event
 * !#zh 键盘事件
 * @class Event.EventKeyboard
 * @extends Event
 *
 * @param {Number} keyCode - The key code of which triggered this event
 * @param {Boolean} isPressed - A boolean indicating whether the key have been pressed
 * @param {Boolean} bubbles - A boolean indicating whether the event bubbles up through the tree or not
 */

var EventKeyboard = function EventKeyboard(keyCode, isPressed, bubbles) {
  cc.Event.call(this, cc.Event.KEYBOARD, bubbles);
  /**
   * !#en
   * The keyCode read-only property represents a system and implementation dependent numerical code identifying the unmodified value of the pressed key.
   * This is usually the decimal ASCII (RFC 20) or Windows 1252 code corresponding to the key.
   * If the key can't be identified, this value is 0.
   *
   * !#zh
   * keyCode 是只读属性它表示一个系统和依赖于实现的数字代码，可以识别按键的未修改值。
   * 这通常是十进制 ASCII (RFC20) 或者 Windows 1252 代码，所对应的密钥。
   * 如果无法识别该键，则该值为 0。
   *
   * @property keyCode
   * @type {Number}
   */

  this.keyCode = keyCode;
  this.isPressed = isPressed;
};

js.extend(EventKeyboard, cc.Event);
cc.Event.EventMouse = EventMouse;
cc.Event.EventTouch = EventTouch;
cc.Event.EventAcceleration = EventAcceleration;
cc.Event.EventKeyboard = EventKeyboard;
module.exports = cc.Event;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDRXZlbnQuanMiXSwibmFtZXMiOlsianMiLCJjYyIsInJlcXVpcmUiLCJFdmVudE1vdXNlIiwiZXZlbnRUeXBlIiwiYnViYmxlcyIsIkV2ZW50IiwiY2FsbCIsIk1PVVNFIiwiX2V2ZW50VHlwZSIsIl9idXR0b24iLCJfeCIsIl95IiwiX3ByZXZYIiwiX3ByZXZZIiwiX3Njcm9sbFgiLCJfc2Nyb2xsWSIsImV4dGVuZCIsInByb3RvIiwicHJvdG90eXBlIiwic2V0U2Nyb2xsRGF0YSIsInNjcm9sbFgiLCJzY3JvbGxZIiwiZ2V0U2Nyb2xsWCIsImdldFNjcm9sbFkiLCJzZXRMb2NhdGlvbiIsIngiLCJ5IiwiZ2V0TG9jYXRpb24iLCJ2MiIsImdldExvY2F0aW9uSW5WaWV3IiwidmlldyIsIl9kZXNpZ25SZXNvbHV0aW9uU2l6ZSIsImhlaWdodCIsIl9zZXRQcmV2Q3Vyc29yIiwiZ2V0UHJldmlvdXNMb2NhdGlvbiIsImdldERlbHRhIiwiZ2V0RGVsdGFYIiwiZ2V0RGVsdGFZIiwic2V0QnV0dG9uIiwiYnV0dG9uIiwiZ2V0QnV0dG9uIiwiZ2V0TG9jYXRpb25YIiwiZ2V0TG9jYXRpb25ZIiwiTk9ORSIsIkRPV04iLCJVUCIsIk1PVkUiLCJTQ1JPTEwiLCJCVVRUT05fTEVGVCIsIkJVVFRPTl9SSUdIVCIsIkJVVFRPTl9NSURETEUiLCJCVVRUT05fNCIsIkJVVFRPTl81IiwiQlVUVE9OXzYiLCJCVVRUT05fNyIsIkJVVFRPTl84IiwiRXZlbnRUb3VjaCIsInRvdWNoQXJyIiwiVE9VQ0giLCJfZXZlbnRDb2RlIiwiX3RvdWNoZXMiLCJ0b3VjaCIsImN1cnJlbnRUb3VjaCIsImdldEV2ZW50Q29kZSIsImdldFRvdWNoZXMiLCJfc2V0RXZlbnRDb2RlIiwiZXZlbnRDb2RlIiwiX3NldFRvdWNoZXMiLCJ0b3VjaGVzIiwic2V0VG91Y2hJbmZvIiwiZ2V0SUQiLCJnZXRTdGFydExvY2F0aW9uIiwiTUFYX1RPVUNIRVMiLCJCRUdBTiIsIk1PVkVEIiwiRU5ERUQiLCJDQU5DRUxFRCIsIkV2ZW50QWNjZWxlcmF0aW9uIiwiYWNjIiwiQUNDRUxFUkFUSU9OIiwiRXZlbnRLZXlib2FyZCIsImtleUNvZGUiLCJpc1ByZXNzZWQiLCJLRVlCT0FSRCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFJQSxFQUFFLEdBQUdDLEVBQUUsQ0FBQ0QsRUFBWjs7QUFFQUUsT0FBTyxDQUFDLGdCQUFELENBQVA7QUFFQTs7Ozs7Ozs7Ozs7QUFTQSxJQUFJQyxVQUFVLEdBQUcsU0FBYkEsVUFBYSxDQUFVQyxTQUFWLEVBQXFCQyxPQUFyQixFQUE4QjtBQUMzQ0osRUFBQUEsRUFBRSxDQUFDSyxLQUFILENBQVNDLElBQVQsQ0FBYyxJQUFkLEVBQW9CTixFQUFFLENBQUNLLEtBQUgsQ0FBU0UsS0FBN0IsRUFBb0NILE9BQXBDO0FBQ0EsT0FBS0ksVUFBTCxHQUFrQkwsU0FBbEI7QUFDQSxPQUFLTSxPQUFMLEdBQWUsQ0FBZjtBQUNBLE9BQUtDLEVBQUwsR0FBVSxDQUFWO0FBQ0EsT0FBS0MsRUFBTCxHQUFVLENBQVY7QUFDQSxPQUFLQyxNQUFMLEdBQWMsQ0FBZDtBQUNBLE9BQUtDLE1BQUwsR0FBYyxDQUFkO0FBQ0EsT0FBS0MsUUFBTCxHQUFnQixDQUFoQjtBQUNBLE9BQUtDLFFBQUwsR0FBZ0IsQ0FBaEI7QUFDSCxDQVZEOztBQVlBaEIsRUFBRSxDQUFDaUIsTUFBSCxDQUFVZCxVQUFWLEVBQXNCRixFQUFFLENBQUNLLEtBQXpCO0FBQ0EsSUFBSVksS0FBSyxHQUFHZixVQUFVLENBQUNnQixTQUF2QjtBQUVBOzs7Ozs7OztBQU9BRCxLQUFLLENBQUNFLGFBQU4sR0FBc0IsVUFBVUMsT0FBVixFQUFtQkMsT0FBbkIsRUFBNEI7QUFDOUMsT0FBS1AsUUFBTCxHQUFnQk0sT0FBaEI7QUFDQSxPQUFLTCxRQUFMLEdBQWdCTSxPQUFoQjtBQUNILENBSEQ7QUFLQTs7Ozs7Ozs7QUFNQUos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c0JBLFVBQXRCO0FBQ0F4RCxFQUFFLENBQUNLLEtBQUgsQ0FBU3dFLGlCQUFULEdBQTZCQSxpQkFBN0I7QUFDQTdFLEVBQUUsQ0FBQ0ssS0FBSCxDQUFTMkUsYUFBVCxHQUF5QkEsYUFBekI7QUFFQUksTUFBTSxDQUFDQyxPQUFQLEdBQWlCckYsRUFBRSxDQUFDSyxLQUFwQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG52YXIganMgPSBjYy5qcztcblxucmVxdWlyZSgnLi4vZXZlbnQvZXZlbnQnKTtcblxuLyoqXG4gKiAhI2VuIFRoZSBtb3VzZSBldmVudFxuICogISN6aCDpvKDmoIfkuovku7bnsbvlnotcbiAqIEBjbGFzcyBFdmVudC5FdmVudE1vdXNlXG4gKlxuICogQGV4dGVuZHMgRXZlbnRcbiAqIEBwYXJhbSB7TnVtYmVyfSBldmVudFR5cGUgLSBUaGUgbW91c2UgZXZlbnQgdHlwZSwgVVAsIERPV04sIE1PVkUsIENBTkNFTEVEXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtidWJibGVzPWZhbHNlXSAtIEEgYm9vbGVhbiBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIGV2ZW50IGJ1YmJsZXMgdXAgdGhyb3VnaCB0aGUgdHJlZSBvciBub3RcbiAqL1xudmFyIEV2ZW50TW91c2UgPSBmdW5jdGlvbiAoZXZlbnRUeXBlLCBidWJibGVzKSB7XG4gICAgY2MuRXZlbnQuY2FsbCh0aGlzLCBjYy5FdmVudC5NT1VTRSwgYnViYmxlcyk7XG4gICAgdGhpcy5fZXZlbnRUeXBlID0gZXZlbnRUeXBlO1xuICAgIHRoaXMuX2J1dHRvbiA9IDA7XG4gICAgdGhpcy5feCA9IDA7XG4gICAgdGhpcy5feSA9IDA7XG4gICAgdGhpcy5fcHJldlggPSAwO1xuICAgIHRoaXMuX3ByZXZZID0gMDtcbiAgICB0aGlzLl9zY3JvbGxYID0gMDtcbiAgICB0aGlzLl9zY3JvbGxZID0gMDtcbn07XG5cbmpzLmV4dGVuZChFdmVudE1vdXNlLCBjYy5FdmVudCk7XG52YXIgcHJvdG8gPSBFdmVudE1vdXNlLnByb3RvdHlwZTtcblxuLyoqXG4gKiAhI2VuIFNldHMgc2Nyb2xsIGRhdGEuXG4gKiAhI3poIOiuvue9rum8oOagh+eahOa7muWKqOaVsOaNruOAglxuICogQG1ldGhvZCBzZXRTY3JvbGxEYXRhXG4gKiBAcGFyYW0ge051bWJlcn0gc2Nyb2xsWFxuICogQHBhcmFtIHtOdW1iZXJ9IHNjcm9sbFlcbiAqL1xucHJvdG8uc2V0U2Nyb2xsRGF0YSA9IGZ1bmN0aW9uIChzY3JvbGxYLCBzY3JvbGxZKSB7XG4gICAgdGhpcy5fc2Nyb2xsWCA9IHNjcm9sbFg7XG4gICAgdGhpcy5fc2Nyb2xsWSA9IHNjcm9sbFk7XG59O1xuXG4vKipcbiAqICEjZW4gUmV0dXJucyB0aGUgeCBheGlzIHNjcm9sbCB2YWx1ZS5cbiAqICEjemgg6I635Y+W6byg5qCH5rua5Yqo55qEWOi9tOi3neemu++8jOWPquaciea7muWKqOaXtuaJjeacieaViOOAglxuICogQG1ldGhvZCBnZXRTY3JvbGxYXG4gKiBAcmV0dXJucyB7TnVtYmVyfVxuICovXG5wcm90by5nZXRTY3JvbGxYID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9zY3JvbGxYO1xufTtcblxuLyoqXG4gKiAhI2VuIFJldHVybnMgdGhlIHkgYXhpcyBzY3JvbGwgdmFsdWUuXG4gKiAhI3poIOiOt+WPlua7mui9rua7muWKqOeahCBZIOi9tOi3neemu++8jOWPquaciea7muWKqOaXtuaJjeacieaViOOAglxuICogQG1ldGhvZCBnZXRTY3JvbGxZXG4gKiBAcmV0dXJucyB7TnVtYmVyfVxuICovXG5wcm90by5nZXRTY3JvbGxZID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9zY3JvbGxZO1xufTtcblxuLyoqXG4gKiAhI2VuIFNldHMgY3Vyc29yIGxvY2F0aW9uLlxuICogISN6aCDorr7nva7lvZPliY3pvKDmoIfkvY3nva7jgIJcbiAqIEBtZXRob2Qgc2V0TG9jYXRpb25cbiAqIEBwYXJhbSB7TnVtYmVyfSB4XG4gKiBAcGFyYW0ge051bWJlcn0geVxuICovXG5wcm90by5zZXRMb2NhdGlvbiA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgdGhpcy5feCA9IHg7XG4gICAgdGhpcy5feSA9IHk7XG59O1xuXG4vKipcbiAqICEjZW4gUmV0dXJucyBjdXJzb3IgbG9jYXRpb24uXG4gKiAhI3poIOiOt+WPlum8oOagh+S9jee9ruWvueixoe+8jOWvueixoeWMheWQqyB4IOWSjCB5IOWxnuaAp+OAglxuICogQG1ldGhvZCBnZXRMb2NhdGlvblxuICogQHJldHVybiB7VmVjMn0gbG9jYXRpb25cbiAqL1xucHJvdG8uZ2V0TG9jYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNjLnYyKHRoaXMuX3gsIHRoaXMuX3kpO1xufTtcblxuLyoqXG4gKiAhI2VuIFJldHVybnMgdGhlIGN1cnJlbnQgY3Vyc29yIGxvY2F0aW9uIGluIHNjcmVlbiBjb29yZGluYXRlcy5cbiAqICEjemgg6I635Y+W5b2T5YmN5LqL5Lu25Zyo5ri45oiP56qX5Y+j5YaF55qE5Z2Q5qCH5L2N572u5a+56LGh77yM5a+56LGh5YyF5ZCrIHgg5ZKMIHkg5bGe5oCn44CCXG4gKiBAbWV0aG9kIGdldExvY2F0aW9uSW5WaWV3XG4gKiBAcmV0dXJuIHtWZWMyfVxuICovXG5wcm90by5nZXRMb2NhdGlvbkluVmlldyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBjYy52Mih0aGlzLl94LCBjYy52aWV3Ll9kZXNpZ25SZXNvbHV0aW9uU2l6ZS5oZWlnaHQgLSB0aGlzLl95KTtcbn07XG5cbnByb3RvLl9zZXRQcmV2Q3Vyc29yID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICB0aGlzLl9wcmV2WCA9IHg7XG4gICAgdGhpcy5fcHJldlkgPSB5O1xufTtcblxuLyoqXG4gKiAhI2VuIFJldHVybnMgdGhlIHByZXZpb3VzIHRvdWNoIGxvY2F0aW9uLlxuICogISN6aCDojrflj5bpvKDmoIfngrnlh7vlnKjkuIrkuIDmrKHkuovku7bml7bnmoTkvY3nva7lr7nosaHvvIzlr7nosaHljIXlkKsgeCDlkowgeSDlsZ7mgKfjgIJcbiAqIEBtZXRob2QgZ2V0UHJldmlvdXNMb2NhdGlvblxuICogQHJldHVybiB7VmVjMn1cbiAqL1xucHJvdG8uZ2V0UHJldmlvdXNMb2NhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY2MudjIodGhpcy5fcHJldlgsIHRoaXMuX3ByZXZZKTtcbn07XG5cbi8qKlxuICogISNlbiBSZXR1cm5zIHRoZSBkZWx0YSBkaXN0YW5jZSBmcm9tIHRoZSBwcmV2aW91cyBsb2NhdGlvbiB0byBjdXJyZW50IGxvY2F0aW9uLlxuICogISN6aCDojrflj5bpvKDmoIfot53nprvkuIrkuIDmrKHkuovku7bnp7vliqjnmoTot53nprvlr7nosaHvvIzlr7nosaHljIXlkKsgeCDlkowgeSDlsZ7mgKfjgIJcbiAqIEBtZXRob2QgZ2V0RGVsdGFcbiAqIEByZXR1cm4ge1ZlYzJ9XG4gKi9cbnByb3RvLmdldERlbHRhID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjYy52Mih0aGlzLl94IC0gdGhpcy5fcHJldlgsIHRoaXMuX3kgLSB0aGlzLl9wcmV2WSk7XG59O1xuXG4vKipcbiAqICEjZW4gUmV0dXJucyB0aGUgWCBheGlzIGRlbHRhIGRpc3RhbmNlIGZyb20gdGhlIHByZXZpb3VzIGxvY2F0aW9uIHRvIGN1cnJlbnQgbG9jYXRpb24uXG4gKiAhI3poIOiOt+WPlum8oOagh+i3neemu+S4iuS4gOasoeS6i+S7tuenu+WKqOeahCBYIOi9tOi3neemu+OAglxuICogQG1ldGhvZCBnZXREZWx0YVhcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xucHJvdG8uZ2V0RGVsdGFYID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl94IC0gdGhpcy5fcHJldlg7XG59O1xuXG4vKipcbiAqICEjZW4gUmV0dXJucyB0aGUgWSBheGlzIGRlbHRhIGRpc3RhbmNlIGZyb20gdGhlIHByZXZpb3VzIGxvY2F0aW9uIHRvIGN1cnJlbnQgbG9jYXRpb24uXG4gKiAhI3poIOiOt+WPlum8oOagh+i3neemu+S4iuS4gOasoeS6i+S7tuenu+WKqOeahCBZIOi9tOi3neemu+OAglxuICogQG1ldGhvZCBnZXREZWx0YVlcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xucHJvdG8uZ2V0RGVsdGFZID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl95IC0gdGhpcy5fcHJldlk7XG59O1xuXG4vKipcbiAqICEjZW4gU2V0cyBtb3VzZSBidXR0b24uXG4gKiAhI3poIOiuvue9rum8oOagh+aMiemUruOAglxuICogQG1ldGhvZCBzZXRCdXR0b25cbiAqIEBwYXJhbSB7TnVtYmVyfSBidXR0b25cbiAqL1xucHJvdG8uc2V0QnV0dG9uID0gZnVuY3Rpb24gKGJ1dHRvbikge1xuICAgIHRoaXMuX2J1dHRvbiA9IGJ1dHRvbjtcbn07XG5cbi8qKlxuICogISNlbiBSZXR1cm5zIG1vdXNlIGJ1dHRvbi5cbiAqICEjemgg6I635Y+W6byg5qCH5oyJ6ZSu44CCXG4gKiBAbWV0aG9kIGdldEJ1dHRvblxuICogQHJldHVybnMge051bWJlcn1cbiAqL1xucHJvdG8uZ2V0QnV0dG9uID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9idXR0b247XG59O1xuXG4vKipcbiAqICEjZW4gUmV0dXJucyBsb2NhdGlvbiBYIGF4aXMgZGF0YS5cbiAqICEjemgg6I635Y+W6byg5qCH5b2T5YmN5L2N572uIFgg6L2044CCXG4gKiBAbWV0aG9kIGdldExvY2F0aW9uWFxuICogQHJldHVybnMge051bWJlcn1cbiAqL1xucHJvdG8uZ2V0TG9jYXRpb25YID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl94O1xufTtcblxuLyoqXG4gKiAhI2VuIFJldHVybnMgbG9jYXRpb24gWSBheGlzIGRhdGEuXG4gKiAhI3poIOiOt+WPlum8oOagh+W9k+WJjeS9jee9riBZIOi9tOOAglxuICogQG1ldGhvZCBnZXRMb2NhdGlvbllcbiAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gKi9cbnByb3RvLmdldExvY2F0aW9uWSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5feTtcbn07XG5cbi8vSW5uZXIgZXZlbnQgdHlwZXMgb2YgTW91c2VFdmVudFxuLyoqXG4gKiAhI2VuIFRoZSBub25lIGV2ZW50IGNvZGUgb2YgbW91c2UgZXZlbnQuXG4gKiAhI3poIOaXoOOAglxuICogQHByb3BlcnR5IE5PTkVcbiAqIEBzdGF0aWNcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKi9cbkV2ZW50TW91c2UuTk9ORSA9IDA7XG4vKipcbiAqICEjZW4gVGhlIGV2ZW50IHR5cGUgY29kZSBvZiBtb3VzZSBkb3duIGV2ZW50LlxuICogISN6aCDpvKDmoIfmjInkuIvkuovku7bjgIJcbiAqIEBwcm9wZXJ0eSBET1dOXG4gKiBAc3RhdGljXG4gKiBAdHlwZSB7TnVtYmVyfVxuICovXG5FdmVudE1vdXNlLkRPV04gPSAxO1xuLyoqXG4gKiAhI2VuIFRoZSBldmVudCB0eXBlIGNvZGUgb2YgbW91c2UgdXAgZXZlbnQuXG4gKiAhI3poIOm8oOagh+aMieS4i+WQjumHiuaUvuS6i+S7tuOAglxuICogQHByb3BlcnR5IFVQXG4gKiBAc3RhdGljXG4gKiBAdHlwZSB7TnVtYmVyfVxuICovXG5FdmVudE1vdXNlLlVQID0gMjtcbi8qKlxuICogISNlbiBUaGUgZXZlbnQgdHlwZSBjb2RlIG9mIG1vdXNlIG1vdmUgZXZlbnQuXG4gKiAhI3poIOm8oOagh+enu+WKqOS6i+S7tuOAglxuICogQHByb3BlcnR5IE1PVkVcbiAqIEBzdGF0aWNcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKi9cbkV2ZW50TW91c2UuTU9WRSA9IDM7XG4vKipcbiAqICEjZW4gVGhlIGV2ZW50IHR5cGUgY29kZSBvZiBtb3VzZSBzY3JvbGwgZXZlbnQuXG4gKiAhI3poIOm8oOagh+a7mui9ruS6i+S7tuOAglxuICogQHByb3BlcnR5IFNDUk9MTFxuICogQHN0YXRpY1xuICogQHR5cGUge051bWJlcn1cbiAqL1xuRXZlbnRNb3VzZS5TQ1JPTEwgPSA0O1xuXG4vKipcbiAqICEjZW4gVGhlIHRhZyBvZiBNb3VzZSBsZWZ0IGJ1dHRvbi5cbiAqICEjemgg6byg5qCH5bem6ZSu55qE5qCH562+44CCXG4gKiBAcHJvcGVydHkgQlVUVE9OX0xFRlRcbiAqIEBzdGF0aWNcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKi9cbkV2ZW50TW91c2UuQlVUVE9OX0xFRlQgPSAwO1xuXG4vKipcbiAqICEjZW4gVGhlIHRhZyBvZiBNb3VzZSByaWdodCBidXR0b24gIChUaGUgcmlnaHQgYnV0dG9uIG51bWJlciBpcyAyIG9uIGJyb3dzZXIpLlxuICogISN6aCDpvKDmoIflj7PplK7nmoTmoIfnrb7jgIJcbiAqIEBwcm9wZXJ0eSBCVVRUT05fUklHSFRcbiAqIEBzdGF0aWNcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKi9cbkV2ZW50TW91c2UuQlVUVE9OX1JJR0hUID0gMjtcblxuLyoqXG4gKiAhI2VuIFRoZSB0YWcgb2YgTW91c2UgbWlkZGxlIGJ1dHRvbiAgKFRoZSByaWdodCBidXR0b24gbnVtYmVyIGlzIDEgb24gYnJvd3NlcikuXG4gKiAhI3poIOm8oOagh+S4remUrueahOagh+etvuOAglxuICogQHByb3BlcnR5IEJVVFRPTl9NSURETEVcbiAqIEBzdGF0aWNcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKi9cbkV2ZW50TW91c2UuQlVUVE9OX01JRERMRSA9IDE7XG5cbi8qKlxuICogISNlbiBUaGUgdGFnIG9mIE1vdXNlIGJ1dHRvbiA0LlxuICogISN6aCDpvKDmoIfmjInplK4gNCDnmoTmoIfnrb7jgIJcbiAqIEBwcm9wZXJ0eSBCVVRUT05fNFxuICogQHN0YXRpY1xuICogQHR5cGUge051bWJlcn1cbiAqL1xuRXZlbnRNb3VzZS5CVVRUT05fNCA9IDM7XG5cbi8qKlxuICogISNlbiBUaGUgdGFnIG9mIE1vdXNlIGJ1dHRvbiA1LlxuICogISN6aCDpvKDmoIfmjInplK4gNSDnmoTmoIfnrb7jgIJcbiAqIEBwcm9wZXJ0eSBCVVRUT05fNVxuICogQHN0YXRpY1xuICogQHR5cGUge051bWJlcn1cbiAqL1xuRXZlbnRNb3VzZS5CVVRUT05fNSA9IDQ7XG5cbi8qKlxuICogISNlbiBUaGUgdGFnIG9mIE1vdXNlIGJ1dHRvbiA2LlxuICogISN6aCDpvKDmoIfmjInplK4gNiDnmoTmoIfnrb7jgIJcbiAqIEBwcm9wZXJ0eSBCVVRUT05fNlxuICogQHN0YXRpY1xuICogQHR5cGUge051bWJlcn1cbiAqL1xuRXZlbnRNb3VzZS5CVVRUT05fNiA9IDU7XG5cbi8qKlxuICogISNlbiBUaGUgdGFnIG9mIE1vdXNlIGJ1dHRvbiA3LlxuICogISN6aCDpvKDmoIfmjInplK4gNyDnmoTmoIfnrb7jgIJcbiAqIEBwcm9wZXJ0eSBCVVRUT05fN1xuICogQHN0YXRpY1xuICogQHR5cGUge051bWJlcn1cbiAqL1xuRXZlbnRNb3VzZS5CVVRUT05fNyA9IDY7XG5cbi8qKlxuICogISNlbiBUaGUgdGFnIG9mIE1vdXNlIGJ1dHRvbiA4LlxuICogISN6aCDpvKDmoIfmjInplK4gOCDnmoTmoIfnrb7jgIJcbiAqIEBwcm9wZXJ0eSBCVVRUT05fOFxuICogQHN0YXRpY1xuICogQHR5cGUge051bWJlcn1cbiAqL1xuRXZlbnRNb3VzZS5CVVRUT05fOCA9IDc7XG5cbi8qKlxuICogISNlbiBUaGUgdG91Y2ggZXZlbnRcbiAqICEjemgg6Kem5pG45LqL5Lu2XG4gKiBAY2xhc3MgRXZlbnQuRXZlbnRUb3VjaFxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBFdmVudFxuICovXG4vKipcbiAqIEBtZXRob2QgY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IHRvdWNoQXJyIC0gVGhlIGFycmF5IG9mIHRoZSB0b3VjaGVzXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGJ1YmJsZXMgLSBBIGJvb2xlYW4gaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBldmVudCBidWJibGVzIHVwIHRocm91Z2ggdGhlIHRyZWUgb3Igbm90XG4gKi9cbnZhciBFdmVudFRvdWNoID0gZnVuY3Rpb24gKHRvdWNoQXJyLCBidWJibGVzKSB7XG4gICAgY2MuRXZlbnQuY2FsbCh0aGlzLCBjYy5FdmVudC5UT1VDSCwgYnViYmxlcyk7XG4gICAgdGhpcy5fZXZlbnRDb2RlID0gMDtcbiAgICB0aGlzLl90b3VjaGVzID0gdG91Y2hBcnIgfHwgW107XG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgY3VycmVudCB0b3VjaCBvYmplY3RcbiAgICAgKiAhI3poIOW9k+WJjeinpueCueWvueixoVxuICAgICAqIEBwcm9wZXJ0eSB0b3VjaFxuICAgICAqIEB0eXBlIHtUb3VjaH1cbiAgICAgKi9cbiAgICB0aGlzLnRvdWNoID0gbnVsbDtcbiAgICAvLyBBY3R1YWxseSBkdXBsaWNhdGVkLCBiZWNhdXNlIG9mIGhpc3RvcnkgaXNzdWUsIGN1cnJlbnRUb3VjaCB3YXMgaW4gdGhlIG9yaWdpbmFsIGRlc2lnbiwgdG91Y2ggd2FzIGFkZGVkIGluIGNyZWF0b3IgZW5naW5lXG4gICAgLy8gVGhleSBzaG91bGQgcG9pbnQgdG8gdGhlIHNhbWUgb2JqZWN0XG4gICAgdGhpcy5jdXJyZW50VG91Y2ggPSBudWxsO1xufTtcblxuanMuZXh0ZW5kKEV2ZW50VG91Y2gsIGNjLkV2ZW50KTtcbnByb3RvID0gRXZlbnRUb3VjaC5wcm90b3R5cGU7XG5cbi8qKlxuICogISNlbiBSZXR1cm5zIGV2ZW50IGNvZGUuXG4gKiAhI3poIOiOt+WPluS6i+S7tuexu+Wei+OAglxuICogQG1ldGhvZCBnZXRFdmVudENvZGVcbiAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gKi9cbnByb3RvLmdldEV2ZW50Q29kZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fZXZlbnRDb2RlO1xufTtcblxuLyoqXG4gKiAhI2VuIFJldHVybnMgdG91Y2hlcyBvZiBldmVudC5cbiAqICEjemgg6I635Y+W6Kem5pG454K555qE5YiX6KGo44CCXG4gKiBAbWV0aG9kIGdldFRvdWNoZXNcbiAqIEByZXR1cm5zIHtBcnJheX1cbiAqL1xucHJvdG8uZ2V0VG91Y2hlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fdG91Y2hlcztcbn07XG5cbnByb3RvLl9zZXRFdmVudENvZGUgPSBmdW5jdGlvbiAoZXZlbnRDb2RlKSB7XG4gICAgdGhpcy5fZXZlbnRDb2RlID0gZXZlbnRDb2RlO1xufTtcblxucHJvdG8uX3NldFRvdWNoZXMgPSBmdW5jdGlvbiAodG91Y2hlcykge1xuICAgIHRoaXMuX3RvdWNoZXMgPSB0b3VjaGVzO1xufTtcblxuLyoqXG4gKiAhI2VuIFNldHMgdG91Y2ggbG9jYXRpb24uXG4gKiAhI3poIOiuvue9ruW9k+WJjeinpueCueS9jee9rlxuICogQG1ldGhvZCBzZXRMb2NhdGlvblxuICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAqIEBwYXJhbSB7TnVtYmVyfSB5XG4gKi9cbnByb3RvLnNldExvY2F0aW9uID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICB0aGlzLnRvdWNoICYmIHRoaXMudG91Y2guc2V0VG91Y2hJbmZvKHRoaXMudG91Y2guZ2V0SUQoKSwgeCwgeSk7XG59O1xuXG4vKipcbiAqICEjZW4gUmV0dXJucyB0b3VjaCBsb2NhdGlvbi5cbiAqICEjemgg6I635Y+W6Kem54K55L2N572u44CCXG4gKiBAbWV0aG9kIGdldExvY2F0aW9uXG4gKiBAcmV0dXJuIHtWZWMyfSBsb2NhdGlvblxuICovXG5wcm90by5nZXRMb2NhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy50b3VjaCA/IHRoaXMudG91Y2guZ2V0TG9jYXRpb24oKSA6IGNjLnYyKCk7XG59O1xuXG4vKipcbiAqICEjZW4gUmV0dXJucyB0aGUgY3VycmVudCB0b3VjaCBsb2NhdGlvbiBpbiBzY3JlZW4gY29vcmRpbmF0ZXMuXG4gKiAhI3poIOiOt+WPluW9k+WJjeinpueCueWcqOa4uOaIj+eql+WPo+S4reeahOS9jee9ruOAglxuICogQG1ldGhvZCBnZXRMb2NhdGlvbkluVmlld1xuICogQHJldHVybiB7VmVjMn1cbiAqL1xucHJvdG8uZ2V0TG9jYXRpb25JblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy50b3VjaCA/IHRoaXMudG91Y2guZ2V0TG9jYXRpb25JblZpZXcoKSA6IGNjLnYyKCk7XG59O1xuXG4vKipcbiAqICEjZW4gUmV0dXJucyB0aGUgcHJldmlvdXMgdG91Y2ggbG9jYXRpb24uXG4gKiAhI3poIOiOt+WPluinpueCueWcqOS4iuS4gOasoeS6i+S7tuaXtueahOS9jee9ruWvueixoe+8jOWvueixoeWMheWQqyB4IOWSjCB5IOWxnuaAp+OAglxuICogQG1ldGhvZCBnZXRQcmV2aW91c0xvY2F0aW9uXG4gKiBAcmV0dXJuIHtWZWMyfVxuICovXG5wcm90by5nZXRQcmV2aW91c0xvY2F0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnRvdWNoID8gdGhpcy50b3VjaC5nZXRQcmV2aW91c0xvY2F0aW9uKCkgOiBjYy52MigpO1xufTtcblxuLyoqXG4gKiAhI2VuIFJldHVybnMgdGhlIHN0YXJ0IHRvdWNoIGxvY2F0aW9uLlxuICogISN6aCDojrflj5bop6bngrnokL3kuIvml7bnmoTkvY3nva7lr7nosaHvvIzlr7nosaHljIXlkKsgeCDlkowgeSDlsZ7mgKfjgIJcbiAqIEBtZXRob2QgZ2V0U3RhcnRMb2NhdGlvblxuICogQHJldHVybnMge1ZlYzJ9XG4gKi9cbnByb3RvLmdldFN0YXJ0TG9jYXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy50b3VjaCA/IHRoaXMudG91Y2guZ2V0U3RhcnRMb2NhdGlvbigpIDogY2MudjIoKTtcbn07XG5cbi8qKlxuICogISNlbiBSZXR1cm5zIHRoZSBpZCBvZiBjYy5Ub3VjaC5cbiAqICEjemgg6Kem54K555qE5qCH6K+GIElE77yM5Y+v5Lul55So5p2l5Zyo5aSa54K56Kem5pG45Lit6Lef6Liq6Kem54K544CCXG4gKiBAbWV0aG9kIGdldElEXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbnByb3RvLmdldElEID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnRvdWNoID8gdGhpcy50b3VjaC5nZXRJRCgpIDogbnVsbDtcbn07XG5cbi8qKlxuICogISNlbiBSZXR1cm5zIHRoZSBkZWx0YSBkaXN0YW5jZSBmcm9tIHRoZSBwcmV2aW91cyBsb2NhdGlvbiB0byBjdXJyZW50IGxvY2F0aW9uLlxuICogISN6aCDojrflj5bop6bngrnot53nprvkuIrkuIDmrKHkuovku7bnp7vliqjnmoTot53nprvlr7nosaHvvIzlr7nosaHljIXlkKsgeCDlkowgeSDlsZ7mgKfjgIJcbiAqIEBtZXRob2QgZ2V0RGVsdGFcbiAqIEByZXR1cm4ge1ZlYzJ9XG4gKi9cbnByb3RvLmdldERlbHRhID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnRvdWNoID8gdGhpcy50b3VjaC5nZXREZWx0YSgpIDogY2MudjIoKTtcbn07XG5cbi8qKlxuICogISNlbiBSZXR1cm5zIHRoZSBYIGF4aXMgZGVsdGEgZGlzdGFuY2UgZnJvbSB0aGUgcHJldmlvdXMgbG9jYXRpb24gdG8gY3VycmVudCBsb2NhdGlvbi5cbiAqICEjemgg6I635Y+W6Kem54K56Led56a75LiK5LiA5qyh5LqL5Lu256e75Yqo55qEIHgg6L206Led56a744CCXG4gKiBAbWV0aG9kIGdldERlbHRhWFxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5wcm90by5nZXREZWx0YVggPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMudG91Y2ggPyB0aGlzLnRvdWNoLmdldERlbHRhKCkueCA6IDA7XG59O1xuXG4vKipcbiAqICEjZW4gUmV0dXJucyB0aGUgWSBheGlzIGRlbHRhIGRpc3RhbmNlIGZyb20gdGhlIHByZXZpb3VzIGxvY2F0aW9uIHRvIGN1cnJlbnQgbG9jYXRpb24uXG4gKiAhI3poIOiOt+WPluinpueCuei3neemu+S4iuS4gOasoeS6i+S7tuenu+WKqOeahCB5IOi9tOi3neemu+OAglxuICogQG1ldGhvZCBnZXREZWx0YVlcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xucHJvdG8uZ2V0RGVsdGFZID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnRvdWNoID8gdGhpcy50b3VjaC5nZXREZWx0YSgpLnkgOiAwO1xufTtcblxuLyoqXG4gKiAhI2VuIFJldHVybnMgbG9jYXRpb24gWCBheGlzIGRhdGEuXG4gKiAhI3poIOiOt+WPluW9k+WJjeinpueCuSBYIOi9tOS9jee9ruOAglxuICogQG1ldGhvZCBnZXRMb2NhdGlvblhcbiAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gKi9cbnByb3RvLmdldExvY2F0aW9uWCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy50b3VjaCA/IHRoaXMudG91Y2guZ2V0TG9jYXRpb25YKCkgOiAwO1xufTtcblxuLyoqXG4gKiAhI2VuIFJldHVybnMgbG9jYXRpb24gWSBheGlzIGRhdGEuXG4gKiAhI3poIOiOt+WPluW9k+WJjeinpueCuSBZIOi9tOS9jee9ruOAglxuICogQG1ldGhvZCBnZXRMb2NhdGlvbllcbiAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gKi9cbnByb3RvLmdldExvY2F0aW9uWSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy50b3VjaCA/IHRoaXMudG91Y2guZ2V0TG9jYXRpb25ZKCkgOiAwO1xufTtcblxuLyoqXG4gKiAhI2VuIFRoZSBtYXhpbXVtIHRvdWNoIG51bWJlcnNcbiAqICEjemgg5pyA5aSn6Kem5pG45pWw6YeP44CCXG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKi9cbkV2ZW50VG91Y2guTUFYX1RPVUNIRVMgPSA1O1xuXG4vKipcbiAqICEjZW4gVGhlIGV2ZW50IHR5cGUgY29kZSBvZiB0b3VjaCBiZWdhbiBldmVudC5cbiAqICEjemgg5byA5aeL6Kem5pG45LqL5Lu2XG4gKiBAY29uc3RhbnRcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKi9cbkV2ZW50VG91Y2guQkVHQU4gPSAwO1xuLyoqXG4gKiAhI2VuIFRoZSBldmVudCB0eXBlIGNvZGUgb2YgdG91Y2ggbW92ZWQgZXZlbnQuXG4gKiAhI3poIOinpuaRuOWQjuenu+WKqOS6i+S7tlxuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7TnVtYmVyfVxuICovXG5FdmVudFRvdWNoLk1PVkVEID0gMTtcbi8qKlxuICogISNlbiBUaGUgZXZlbnQgdHlwZSBjb2RlIG9mIHRvdWNoIGVuZGVkIGV2ZW50LlxuICogISN6aCDnu5PmnZ/op6bmkbjkuovku7ZcbiAqIEBjb25zdGFudFxuICogQHR5cGUge051bWJlcn1cbiAqL1xuRXZlbnRUb3VjaC5FTkRFRCA9IDI7XG4vKipcbiAqICEjZW4gVGhlIGV2ZW50IHR5cGUgY29kZSBvZiB0b3VjaCBjYW5jZWxsZWQgZXZlbnQuXG4gKiAhI3poIOWPlua2iOinpuaRuOS6i+S7tlxuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7TnVtYmVyfVxuICovXG5FdmVudFRvdWNoLkNBTkNFTEVEID0gMztcblxuLyoqXG4gKiAhI2VuIFRoZSBhY2NlbGVyYXRpb24gZXZlbnRcbiAqICEjemgg5Yqg6YCf5bqm5LqL5Lu2XG4gKiBAY2xhc3MgRXZlbnQuRXZlbnRBY2NlbGVyYXRpb25cbiAqIEBleHRlbmRzIEV2ZW50XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGFjYyAtIFRoZSBhY2NlbGVyYXRpb25cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gYnViYmxlcyAtIEEgYm9vbGVhbiBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIGV2ZW50IGJ1YmJsZXMgdXAgdGhyb3VnaCB0aGUgdHJlZSBvciBub3RcbiAqL1xudmFyIEV2ZW50QWNjZWxlcmF0aW9uID0gZnVuY3Rpb24gKGFjYywgYnViYmxlcykge1xuICAgIGNjLkV2ZW50LmNhbGwodGhpcywgY2MuRXZlbnQuQUNDRUxFUkFUSU9OLCBidWJibGVzKTtcbiAgICB0aGlzLmFjYyA9IGFjYztcbn07XG5qcy5leHRlbmQoRXZlbnRBY2NlbGVyYXRpb24sIGNjLkV2ZW50KTtcblxuLyoqXG4gKiAhI2VuIFRoZSBrZXlib2FyZCBldmVudFxuICogISN6aCDplK7nm5jkuovku7ZcbiAqIEBjbGFzcyBFdmVudC5FdmVudEtleWJvYXJkXG4gKiBAZXh0ZW5kcyBFdmVudFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBrZXlDb2RlIC0gVGhlIGtleSBjb2RlIG9mIHdoaWNoIHRyaWdnZXJlZCB0aGlzIGV2ZW50XG4gKiBAcGFyYW0ge0Jvb2xlYW59IGlzUHJlc3NlZCAtIEEgYm9vbGVhbiBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIGtleSBoYXZlIGJlZW4gcHJlc3NlZFxuICogQHBhcmFtIHtCb29sZWFufSBidWJibGVzIC0gQSBib29sZWFuIGluZGljYXRpbmcgd2hldGhlciB0aGUgZXZlbnQgYnViYmxlcyB1cCB0aHJvdWdoIHRoZSB0cmVlIG9yIG5vdFxuICovXG52YXIgRXZlbnRLZXlib2FyZCA9IGZ1bmN0aW9uIChrZXlDb2RlLCBpc1ByZXNzZWQsIGJ1YmJsZXMpIHtcbiAgICBjYy5FdmVudC5jYWxsKHRoaXMsIGNjLkV2ZW50LktFWUJPQVJELCBidWJibGVzKTtcbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogVGhlIGtleUNvZGUgcmVhZC1vbmx5IHByb3BlcnR5IHJlcHJlc2VudHMgYSBzeXN0ZW0gYW5kIGltcGxlbWVudGF0aW9uIGRlcGVuZGVudCBudW1lcmljYWwgY29kZSBpZGVudGlmeWluZyB0aGUgdW5tb2RpZmllZCB2YWx1ZSBvZiB0aGUgcHJlc3NlZCBrZXkuXG4gICAgICogVGhpcyBpcyB1c3VhbGx5IHRoZSBkZWNpbWFsIEFTQ0lJIChSRkMgMjApIG9yIFdpbmRvd3MgMTI1MiBjb2RlIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGtleS5cbiAgICAgKiBJZiB0aGUga2V5IGNhbid0IGJlIGlkZW50aWZpZWQsIHRoaXMgdmFsdWUgaXMgMC5cbiAgICAgKlxuICAgICAqICEjemhcbiAgICAgKiBrZXlDb2RlIOaYr+WPquivu+WxnuaAp+Wug+ihqOekuuS4gOS4quezu+e7n+WSjOS+nei1luS6juWunueOsOeahOaVsOWtl+S7o+egge+8jOWPr+S7peivhuWIq+aMiemUrueahOacquS/ruaUueWAvOOAglxuICAgICAqIOi/memAmuW4uOaYr+WNgei/m+WItiBBU0NJSSAoUkZDMjApIOaIluiAhSBXaW5kb3dzIDEyNTIg5Luj56CB77yM5omA5a+55bqU55qE5a+G6ZKl44CCXG4gICAgICog5aaC5p6c5peg5rOV6K+G5Yir6K+l6ZSu77yM5YiZ6K+l5YC85Li6IDDjgIJcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBrZXlDb2RlXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmtleUNvZGUgPSBrZXlDb2RlO1xuICAgIHRoaXMuaXNQcmVzc2VkID0gaXNQcmVzc2VkO1xufTtcbmpzLmV4dGVuZChFdmVudEtleWJvYXJkLCBjYy5FdmVudCk7XG5cbmNjLkV2ZW50LkV2ZW50TW91c2UgPSBFdmVudE1vdXNlO1xuY2MuRXZlbnQuRXZlbnRUb3VjaCA9IEV2ZW50VG91Y2g7XG5jYy5FdmVudC5FdmVudEFjY2VsZXJhdGlvbiA9IEV2ZW50QWNjZWxlcmF0aW9uO1xuY2MuRXZlbnQuRXZlbnRLZXlib2FyZCA9IEV2ZW50S2V5Ym9hcmQ7XG5cbm1vZHVsZS5leHBvcnRzID0gY2MuRXZlbnQ7XG4iXX0=