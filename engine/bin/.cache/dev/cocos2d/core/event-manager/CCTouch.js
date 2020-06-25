
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/event-manager/CCTouch.js';
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

/**
 * !#en The touch event class
 * !#zh 封装了触摸相关的信息。
 * @class Touch
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} id
 */
cc.Touch = function (x, y, id) {
  this._lastModified = 0;
  this.setTouchInfo(id, x, y);
};

cc.Touch.prototype = {
  constructor: cc.Touch,

  /**
   * !#en Returns the current touch location in OpenGL coordinates.、
   * !#zh 获取当前触点位置。
   * @method getLocation
   * @return {Vec2}
   */
  getLocation: function getLocation() {
    return cc.v2(this._point.x, this._point.y);
  },

  /**
   * !#en Returns X axis location value.
      * !#zh 获取当前触点 X 轴位置。
      * @method getLocationX
   * @returns {Number}
   */
  getLocationX: function getLocationX() {
    return this._point.x;
  },

  /**
      * !#en Returns Y axis location value.
      * !#zh 获取当前触点 Y 轴位置。
      * @method getLocationY
   * @returns {Number}
   */
  getLocationY: function getLocationY() {
    return this._point.y;
  },

  /**
   * !#en Returns the previous touch location in OpenGL coordinates.
   * !#zh 获取触点在上一次事件时的位置对象，对象包含 x 和 y 属性。
   * @method getPreviousLocation
   * @return {Vec2}
   */
  getPreviousLocation: function getPreviousLocation() {
    return cc.v2(this._prevPoint.x, this._prevPoint.y);
  },

  /**
   * !#en Returns the start touch location in OpenGL coordinates.
   * !#zh 获取触点落下时的位置对象，对象包含 x 和 y 属性。
   * @method getStartLocation
   * @returns {Vec2}
   */
  getStartLocation: function getStartLocation() {
    return cc.v2(this._startPoint.x, this._startPoint.y);
  },

  /**
   * !#en Returns the delta distance from the previous touche to the current one in screen coordinates.
   * !#zh 获取触点距离上一次事件移动的距离对象，对象包含 x 和 y 属性。
   * @method getDelta
   * @return {Vec2}
   */
  getDelta: function getDelta() {
    return this._point.sub(this._prevPoint);
  },

  /**
   * !#en Returns the current touch location in screen coordinates.
   * !#zh 获取当前事件在游戏窗口内的坐标位置对象，对象包含 x 和 y 属性。
   * @method getLocationInView
   * @return {Vec2}
   */
  getLocationInView: function getLocationInView() {
    return cc.v2(this._point.x, cc.view._designResolutionSize.height - this._point.y);
  },

  /**
   * !#en Returns the previous touch location in screen coordinates.
   * !#zh 获取触点在上一次事件时在游戏窗口中的位置对象，对象包含 x 和 y 属性。
   * @method getPreviousLocationInView
   * @return {Vec2}
   */
  getPreviousLocationInView: function getPreviousLocationInView() {
    return cc.v2(this._prevPoint.x, cc.view._designResolutionSize.height - this._prevPoint.y);
  },

  /**
   * !#en Returns the start touch location in screen coordinates.
   * !#zh 获取触点落下时在游戏窗口中的位置对象，对象包含 x 和 y 属性。
   * @method getStartLocationInView
   * @return {Vec2}
   */
  getStartLocationInView: function getStartLocationInView() {
    return cc.v2(this._startPoint.x, cc.view._designResolutionSize.height - this._startPoint.y);
  },

  /**
   * !#en Returns the id of cc.Touch.
   * !#zh 触点的标识 ID，可以用来在多点触摸中跟踪触点。
   * @method getID
   * @return {Number}
   */
  getID: function getID() {
    return this._id;
  },

  /**
   * !#en Sets information to touch.
   * !#zh 设置触摸相关的信息。用于监控触摸事件。
   * @method setTouchInfo
   * @param {Number} id
   * @param  {Number} x
   * @param  {Number} y
   */
  setTouchInfo: function setTouchInfo(id, x, y) {
    this._prevPoint = this._point;
    this._point = cc.v2(x || 0, y || 0);
    this._id = id;

    if (!this._startPointCaptured) {
      this._startPoint = cc.v2(this._point);

      cc.view._convertPointWithScale(this._startPoint);

      this._startPointCaptured = true;
    }
  },
  _setPoint: function _setPoint(x, y) {
    if (y === undefined) {
      this._point.x = x.x;
      this._point.y = x.y;
    } else {
      this._point.x = x;
      this._point.y = y;
    }
  },
  _setPrevPoint: function _setPrevPoint(x, y) {
    if (y === undefined) this._prevPoint = cc.v2(x.x, x.y);else this._prevPoint = cc.v2(x || 0, y || 0);
  }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDVG91Y2guanMiXSwibmFtZXMiOlsiY2MiLCJUb3VjaCIsIngiLCJ5IiwiaWQiLCJfbGFzdE1vZGlmaWVkIiwic2V0VG91Y2hJbmZvIiwicHJvdG90eXBlIiwiY29uc3RydWN0b3IiLCJnZXRMb2NhdGlvbiIsInYyIiwiX3BvaW50IiwiZ2V0TG9jYXRpb25YIiwiZ2V0TG9jYXRpb25ZIiwiZ2V0UHJldmlvdXNMb2NhdGlvbiIsIl9wcmV2UG9pbnQiLCJnZXRTdGFydExvY2F0aW9uIiwiX3N0YXJ0UG9pbnQiLCJnZXREZWx0YSIsInN1YiIsImdldExvY2F0aW9uSW5WaWV3IiwidmlldyIsIl9kZXNpZ25SZXNvbHV0aW9uU2l6ZSIsImhlaWdodCIsImdldFByZXZpb3VzTG9jYXRpb25JblZpZXciLCJnZXRTdGFydExvY2F0aW9uSW5WaWV3IiwiZ2V0SUQiLCJfaWQiLCJfc3RhcnRQb2ludENhcHR1cmVkIiwiX2NvbnZlcnRQb2ludFdpdGhTY2FsZSIsIl9zZXRQb2ludCIsInVuZGVmaW5lZCIsIl9zZXRQcmV2UG9pbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkE7Ozs7Ozs7OztBQVNBQSxFQUFFLENBQUNDLEtBQUgsR0FBVyxVQUFVQyxDQUFWLEVBQWFDLENBQWIsRUFBZ0JDLEVBQWhCLEVBQW9CO0FBQzNCLE9BQUtDLGFBQUwsR0FBcUIsQ0FBckI7QUFDQSxPQUFLQyxZQUFMLENBQWtCRixFQUFsQixFQUFzQkYsQ0FBdEIsRUFBeUJDLENBQXpCO0FBQ0gsQ0FIRDs7QUFJQUgsRUFBRSxDQUFDQyxLQUFILENBQVNNLFNBQVQsR0FBcUI7QUFDakJDLEVBQUFBLFdBQVcsRUFBRVIsRUFBRSxDQUFDQyxLQURDOztBQUVqQjs7Ozs7O0FBTUFRLEVBQUFBLFdBQVcsRUFBQyx1QkFBWTtBQUNwQixXQUFPVCxFQUFFLENBQUNVLEVBQUgsQ0FBTSxLQUFLQyxNQUFMLENBQVlULENBQWxCLEVBQXFC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RUFBbUI7QUFDZixXQUFLcEIsTUFBTCxDQUFZVCxDQUFaLEdBQWdCQSxDQUFDLENBQUNBLENBQWxCO0FBQ0EsV0FBS1MsTUFBTCxDQUFZUixDQUFaLEdBQWdCRCxDQUFDLENBQUNDLENBQWxCO0FBQ0gsS0FIRCxNQUdLO0FBQ0QsV0FBS1EsTUFBTCxDQUFZVCxDQUFaLEdBQWdCQSxDQUFoQjtBQUNBLFdBQUtTLE1BQUwsQ0FBWVIsQ0FBWixHQUFnQkEsQ0FBaEI7QUFDSDtBQUNKLEdBaklnQjtBQW1JakI2QixFQUFBQSxhQUFhLEVBQUMsdUJBQVU5QixDQUFWLEVBQWFDLENBQWIsRUFBZ0I7QUFDMUIsUUFBR0EsQ0FBQyxLQUFLNEIsU0FBVCxFQUNJLEtBQUtoQixVQUFMLEdBQWtCZixFQUFFLENBQUNVLEVBQUgsQ0FBTVIsQ0FBQyxDQUFDQSxDQUFSLEVBQVdBLENBQUMsQ0FBQ0MsQ0FBYixDQUFsQixDQURKLEtBR0ksS0FBS1ksVUFBTCxHQUFrQmYsRUFBRSxDQUFDVSxFQUFILENBQU1SLENBQUMsSUFBSSxDQUFYLEVBQWNDLENBQUMsSUFBSSxDQUFuQixDQUFsQjtBQUNQO0FBeElnQixDQUFyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLyoqXG4gKiAhI2VuIFRoZSB0b3VjaCBldmVudCBjbGFzc1xuICogISN6aCDlsIHoo4Xkuobop6bmkbjnm7jlhbPnmoTkv6Hmga/jgIJcbiAqIEBjbGFzcyBUb3VjaFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSB4XG4gKiBAcGFyYW0ge051bWJlcn0geVxuICogQHBhcmFtIHtOdW1iZXJ9IGlkXG4gKi9cbmNjLlRvdWNoID0gZnVuY3Rpb24gKHgsIHksIGlkKSB7XG4gICAgdGhpcy5fbGFzdE1vZGlmaWVkID0gMDtcbiAgICB0aGlzLnNldFRvdWNoSW5mbyhpZCwgeCwgeSk7XG59O1xuY2MuVG91Y2gucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBjYy5Ub3VjaCxcbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgdGhlIGN1cnJlbnQgdG91Y2ggbG9jYXRpb24gaW4gT3BlbkdMIGNvb3JkaW5hdGVzLuOAgVxuICAgICAqICEjemgg6I635Y+W5b2T5YmN6Kem54K55L2N572u44CCXG4gICAgICogQG1ldGhvZCBnZXRMb2NhdGlvblxuICAgICAqIEByZXR1cm4ge1ZlYzJ9XG4gICAgICovXG4gICAgZ2V0TG9jYXRpb246ZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gY2MudjIodGhpcy5fcG9pbnQueCwgdGhpcy5fcG9pbnQueSk7XG4gICAgfSxcblxuXHQvKipcblx0ICogISNlbiBSZXR1cm5zIFggYXhpcyBsb2NhdGlvbiB2YWx1ZS5cbiAgICAgKiAhI3poIOiOt+WPluW9k+WJjeinpueCuSBYIOi9tOS9jee9ruOAglxuICAgICAqIEBtZXRob2QgZ2V0TG9jYXRpb25YXG5cdCAqIEByZXR1cm5zIHtOdW1iZXJ9XG5cdCAqL1xuXHRnZXRMb2NhdGlvblg6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gdGhpcy5fcG9pbnQueDtcblx0fSxcblxuXHQvKipcbiAgICAgKiAhI2VuIFJldHVybnMgWSBheGlzIGxvY2F0aW9uIHZhbHVlLlxuICAgICAqICEjemgg6I635Y+W5b2T5YmN6Kem54K5IFkg6L205L2N572u44CCXG4gICAgICogQG1ldGhvZCBnZXRMb2NhdGlvbllcblx0ICogQHJldHVybnMge051bWJlcn1cblx0ICovXG5cdGdldExvY2F0aW9uWTogZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB0aGlzLl9wb2ludC55O1xuXHR9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHRoZSBwcmV2aW91cyB0b3VjaCBsb2NhdGlvbiBpbiBPcGVuR0wgY29vcmRpbmF0ZXMuXG4gICAgICogISN6aCDojrflj5bop6bngrnlnKjkuIrkuIDmrKHkuovku7bml7bnmoTkvY3nva7lr7nosaHvvIzlr7nosaHljIXlkKsgeCDlkowgeSDlsZ7mgKfjgIJcbiAgICAgKiBAbWV0aG9kIGdldFByZXZpb3VzTG9jYXRpb25cbiAgICAgKiBAcmV0dXJuIHtWZWMyfVxuICAgICAqL1xuICAgIGdldFByZXZpb3VzTG9jYXRpb246ZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gY2MudjIodGhpcy5fcHJldlBvaW50LngsIHRoaXMuX3ByZXZQb2ludC55KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHRoZSBzdGFydCB0b3VjaCBsb2NhdGlvbiBpbiBPcGVuR0wgY29vcmRpbmF0ZXMuXG4gICAgICogISN6aCDojrflj5bop6bngrnokL3kuIvml7bnmoTkvY3nva7lr7nosaHvvIzlr7nosaHljIXlkKsgeCDlkowgeSDlsZ7mgKfjgIJcbiAgICAgKiBAbWV0aG9kIGdldFN0YXJ0TG9jYXRpb25cbiAgICAgKiBAcmV0dXJucyB7VmVjMn1cbiAgICAgKi9cbiAgICBnZXRTdGFydExvY2F0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGNjLnYyKHRoaXMuX3N0YXJ0UG9pbnQueCwgdGhpcy5fc3RhcnRQb2ludC55KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHRoZSBkZWx0YSBkaXN0YW5jZSBmcm9tIHRoZSBwcmV2aW91cyB0b3VjaGUgdG8gdGhlIGN1cnJlbnQgb25lIGluIHNjcmVlbiBjb29yZGluYXRlcy5cbiAgICAgKiAhI3poIOiOt+WPluinpueCuei3neemu+S4iuS4gOasoeS6i+S7tuenu+WKqOeahOi3neemu+Wvueixoe+8jOWvueixoeWMheWQqyB4IOWSjCB5IOWxnuaAp+OAglxuICAgICAqIEBtZXRob2QgZ2V0RGVsdGFcbiAgICAgKiBAcmV0dXJuIHtWZWMyfVxuICAgICAqL1xuICAgIGdldERlbHRhOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BvaW50LnN1Yih0aGlzLl9wcmV2UG9pbnQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgdGhlIGN1cnJlbnQgdG91Y2ggbG9jYXRpb24gaW4gc2NyZWVuIGNvb3JkaW5hdGVzLlxuICAgICAqICEjemgg6I635Y+W5b2T5YmN5LqL5Lu25Zyo5ri45oiP56qX5Y+j5YaF55qE5Z2Q5qCH5L2N572u5a+56LGh77yM5a+56LGh5YyF5ZCrIHgg5ZKMIHkg5bGe5oCn44CCXG4gICAgICogQG1ldGhvZCBnZXRMb2NhdGlvbkluVmlld1xuICAgICAqIEByZXR1cm4ge1ZlYzJ9XG4gICAgICovXG4gICAgZ2V0TG9jYXRpb25JblZpZXc6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gY2MudjIodGhpcy5fcG9pbnQueCwgY2Mudmlldy5fZGVzaWduUmVzb2x1dGlvblNpemUuaGVpZ2h0IC0gdGhpcy5fcG9pbnQueSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB0aGUgcHJldmlvdXMgdG91Y2ggbG9jYXRpb24gaW4gc2NyZWVuIGNvb3JkaW5hdGVzLlxuICAgICAqICEjemgg6I635Y+W6Kem54K55Zyo5LiK5LiA5qyh5LqL5Lu25pe25Zyo5ri45oiP56qX5Y+j5Lit55qE5L2N572u5a+56LGh77yM5a+56LGh5YyF5ZCrIHgg5ZKMIHkg5bGe5oCn44CCXG4gICAgICogQG1ldGhvZCBnZXRQcmV2aW91c0xvY2F0aW9uSW5WaWV3XG4gICAgICogQHJldHVybiB7VmVjMn1cbiAgICAgKi9cbiAgICBnZXRQcmV2aW91c0xvY2F0aW9uSW5WaWV3OiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gY2MudjIodGhpcy5fcHJldlBvaW50LngsIGNjLnZpZXcuX2Rlc2lnblJlc29sdXRpb25TaXplLmhlaWdodCAtIHRoaXMuX3ByZXZQb2ludC55KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHRoZSBzdGFydCB0b3VjaCBsb2NhdGlvbiBpbiBzY3JlZW4gY29vcmRpbmF0ZXMuXG4gICAgICogISN6aCDojrflj5bop6bngrnokL3kuIvml7blnKjmuLjmiI/nqpflj6PkuK3nmoTkvY3nva7lr7nosaHvvIzlr7nosaHljIXlkKsgeCDlkowgeSDlsZ7mgKfjgIJcbiAgICAgKiBAbWV0aG9kIGdldFN0YXJ0TG9jYXRpb25JblZpZXdcbiAgICAgKiBAcmV0dXJuIHtWZWMyfVxuICAgICAqL1xuICAgIGdldFN0YXJ0TG9jYXRpb25JblZpZXc6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBjYy52Mih0aGlzLl9zdGFydFBvaW50LngsIGNjLnZpZXcuX2Rlc2lnblJlc29sdXRpb25TaXplLmhlaWdodCAtIHRoaXMuX3N0YXJ0UG9pbnQueSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB0aGUgaWQgb2YgY2MuVG91Y2guXG4gICAgICogISN6aCDop6bngrnnmoTmoIfor4YgSUTvvIzlj6/ku6XnlKjmnaXlnKjlpJrngrnop6bmkbjkuK3ot5/ouKrop6bngrnjgIJcbiAgICAgKiBAbWV0aG9kIGdldElEXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldElEOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lkO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgaW5mb3JtYXRpb24gdG8gdG91Y2guXG4gICAgICogISN6aCDorr7nva7op6bmkbjnm7jlhbPnmoTkv6Hmga/jgILnlKjkuo7nm5Hmjqfop6bmkbjkuovku7bjgIJcbiAgICAgKiBAbWV0aG9kIHNldFRvdWNoSW5mb1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpZFxuICAgICAqIEBwYXJhbSAge051bWJlcn0geFxuICAgICAqIEBwYXJhbSAge051bWJlcn0geVxuICAgICAqL1xuICAgIHNldFRvdWNoSW5mbzpmdW5jdGlvbiAoaWQsIHgsIHkpIHtcbiAgICAgICAgdGhpcy5fcHJldlBvaW50ID0gdGhpcy5fcG9pbnQ7XG4gICAgICAgIHRoaXMuX3BvaW50ID0gY2MudjIoeCB8fCAwLCB5IHx8IDApO1xuICAgICAgICB0aGlzLl9pZCA9IGlkO1xuICAgICAgICBpZighdGhpcy5fc3RhcnRQb2ludENhcHR1cmVkKXtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0UG9pbnQgPSBjYy52Mih0aGlzLl9wb2ludCk7XG4gICAgICAgICAgICBjYy52aWV3Ll9jb252ZXJ0UG9pbnRXaXRoU2NhbGUodGhpcy5fc3RhcnRQb2ludCk7XG4gICAgICAgICAgICB0aGlzLl9zdGFydFBvaW50Q2FwdHVyZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9zZXRQb2ludDogZnVuY3Rpb24oeCwgeSl7XG4gICAgICAgIGlmKHkgPT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICB0aGlzLl9wb2ludC54ID0geC54O1xuICAgICAgICAgICAgdGhpcy5fcG9pbnQueSA9IHgueTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLl9wb2ludC54ID0geDtcbiAgICAgICAgICAgIHRoaXMuX3BvaW50LnkgPSB5O1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9zZXRQcmV2UG9pbnQ6ZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgaWYoeSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhpcy5fcHJldlBvaW50ID0gY2MudjIoeC54LCB4LnkpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLl9wcmV2UG9pbnQgPSBjYy52Mih4IHx8IDAsIHkgfHwgMCk7XG4gICAgfVxufTsiXX0=