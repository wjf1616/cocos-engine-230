
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/actions.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _quat = _interopRequireDefault(require("../value-types/quat"));

var _vec = _interopRequireDefault(require("../value-types/vec3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _quat_tmp = cc.quat();

var _vec3_tmp = cc.v3();
/*
 * Rotates a Node object to a certain angle by modifying its quaternion property. <br/>
 * The direction will be decided by the shortest angle.
 * @class Rotate3DTo
 * @extends ActionInterval
 * @param {Number} duration duration in seconds
 * @param {Number|Vec3} dstAngleX dstAngleX in degrees.
 * @param {Number} [dstAngleY] dstAngleY in degrees.
 * @param {Number} [dstAngleZ] dstAngleZ in degrees.
 * @example
 * var rotate3DTo = new cc.Rotate3DTo(2, cc.v3(0, 180, 0));
 */


cc.Rotate3DTo = cc.Class({
  name: 'cc.Rotate3DTo',
  "extends": cc.ActionInterval,
  ctor: function ctor(duration, dstAngleX, dstAngleY, dstAngleZ) {
    this._startQuat = cc.quat();
    this._dstQuat = cc.quat();
    dstAngleX !== undefined && this.initWithDuration(duration, dstAngleX, dstAngleY, dstAngleZ);
  },

  /*
   * Initializes the action.
   * @param {Number} duration
   * @param {Number|Vec3|Quat} dstAngleX
   * @param {Number} dstAngleY
   * @param {Number} dstAngleZ
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(duration, dstAngleX, dstAngleY, dstAngleZ) {
    if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
      var dstQuat = this._dstQuat;

      if (dstAngleX instanceof cc.Quat) {
        dstQuat.set(dstAngleX);
      } else {
        if (dstAngleX instanceof cc.Vec3) {
          dstAngleY = dstAngleX.y;
          dstAngleZ = dstAngleX.z;
          dstAngleX = dstAngleX.x;
        } else {
          dstAngleY = dstAngleY || 0;
          dstAngleZ = dstAngleZ || 0;
        }

        _quat["default"].fromEuler(dstQuat, dstAngleX, dstAngleY, dstAngleZ);
      }

      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.Rotate3DTo();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._dstQuat);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);

    this._startQuat.set(target.quat);
  },
  reverse: function reverse() {
    cc.logID(1016);
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);

    if (this.target) {
      _quat["default"].slerp(_quat_tmp, this._startQuat, this._dstQuat, dt);

      this.target.setRotation(_quat_tmp);
    }
  }
});
/**
 * !#en
 * Rotates a Node object to a certain angle by modifying its quternion property. <br/>
 * The direction will be decided by the shortest angle.
 * !#zh 旋转到目标角度，通过逐帧修改它的 quternion 属性，旋转方向将由最短的角度决定。
 * @method rotate3DTo
 * @param {Number} duration duration in seconds
 * @param {Number|Vec3|Quat} dstAngleX dstAngleX in degrees.
 * @param {Number} [dstAngleY] dstAngleY in degrees.
 * @param {Number} [dstAngleZ] dstAngleZ in degrees.
 * @return {ActionInterval}
 * @example
 * // example
 * var rotate3DTo = cc.rotate3DTo(2, cc.v3(0, 180, 0));
 */

cc.rotate3DTo = function (duration, dstAngleX, dstAngleY, dstAngleZ) {
  return new cc.Rotate3DTo(duration, dstAngleX, dstAngleY, dstAngleZ);
};
/*
 * Rotates a Node object counter clockwise a number of degrees by modifying its quaternion property.
 * Relative to its properties to modify.
 * @class Rotate3DBy
 * @extends ActionInterval
 * @param {Number} duration duration in seconds
 * @param {Number|Vec3} deltaAngleX deltaAngleX in degrees
 * @param {Number} [deltaAngleY] deltaAngleY in degrees
 * @param {Number} [deltaAngleZ] deltaAngleZ in degrees
 * @example
 * var actionBy = new cc.Rotate3DBy(2, cc.v3(0, 360, 0));
 */


cc.Rotate3DBy = cc.Class({
  name: 'cc.Rotate3DBy',
  "extends": cc.ActionInterval,
  ctor: function ctor(duration, deltaAngleX, deltaAngleY, deltaAngleZ) {
    this._angle = cc.v3();
    this._quat = cc.quat();
    this._lastDt = 0;
    deltaAngleX !== undefined && this.initWithDuration(duration, deltaAngleX, deltaAngleY, deltaAngleZ);
  },

  /*
   * Initializes the action.
   * @param {Number} duration duration in seconds
   * @param {Number|Vec3} deltaAngleX deltaAngleX in degrees
   * @param {Number} [deltaAngleY=] deltaAngleY in degrees
   * @param {Number} [deltaAngleZ=] deltaAngleZ in degrees
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(duration, deltaAngleX, deltaAngleY, deltaAngleZ) {
    if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
      if (deltaAngleX instanceof cc.Vec3) {
        deltaAngleY = deltaAngleX.y;
        deltaAngleZ = deltaAngleX.z;
        deltaAngleX = deltaAngleX.x;
      } else {
        deltaAngleY = deltaAngleY || 0;
        deltaAngleZ = deltaAngleZ || 0;
      }

      _vec["default"].set(this._angle, deltaAngleX, deltaAngleY, deltaAngleZ);

      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.Rotate3DBy();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._angle);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);

    this._quat.set(target.quat);

    this._lastDt = 0;
  },
  update: function () {
    var RAD = Math.PI / 180;
    return function (dt) {
      dt = this._computeEaseTime(dt);

      if (this.target) {
        var angle = this._angle;
        var dstQuat = this._quat;
        var delta = dt - this._lastDt;
        var angleX = angle.x,
            angleY = angle.y,
            angleZ = angle.z;
        if (angleX) _quat["default"].rotateX(dstQuat, dstQuat, angleX * RAD * delta);
        if (angleY) _quat["default"].rotateY(dstQuat, dstQuat, angleY * RAD * delta);
        if (angleZ) _quat["default"].rotateZ(dstQuat, dstQuat, angleZ * RAD * delta);
        this.target.setRotation(dstQuat);
        this._lastDt = dt;
      }
    };
  }(),
  reverse: function reverse() {
    var angle = this._angle;
    _vec3_tmp.x = -angle.x;
    _vec3_tmp.y = -angle.y;
    _vec3_tmp.z = -angle.z;
    var action = new cc.Rotate3DBy(this._duration, _vec3_tmp);

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  }
});
/**
 * !#en
 * Rotates a Node object counter clockwise a number of degrees by modifying its quaternion property.
 * Relative to its properties to modify.
 * !#zh 旋转指定的 3D 角度。
 * @method rotate3DBy
 * @param {Number} duration duration in seconds
 * @param {Number|Vec3} deltaAngleX deltaAngleX in degrees
 * @param {Number} [deltaAngleY] deltaAngleY in degrees
 * @param {Number} [deltaAngleZ] deltaAngleZ in degrees
 * @return {ActionInterval}
 * @example
 * // example
 * var actionBy = cc.rotate3DBy(2, cc.v3(0, 360, 0));
 */

cc.rotate3DBy = function (duration, deltaAngleX, deltaAngleY, deltaAngleZ) {
  return new cc.Rotate3DBy(duration, deltaAngleX, deltaAngleY, deltaAngleZ);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjdGlvbnMuanMiXSwibmFtZXMiOlsiX3F1YXRfdG1wIiwiY2MiLCJxdWF0IiwiX3ZlYzNfdG1wIiwidjMiLCJSb3RhdGUzRFRvIiwiQ2xhc3MiLCJuYW1lIiwiQWN0aW9uSW50ZXJ2YWwiLCJjdG9yIiwiZHVyYXRpb24iLCJkc3RBbmdsZVgiLCJkc3RBbmdsZVkiLCJkc3RBbmdsZVoiLCJfc3RhcnRRdWF0IiwiX2RzdFF1YXQiLCJ1bmRlZmluZWQiLCJpbml0V2l0aER1cmF0aW9uIiwicHJvdG90eXBlIiwiY2FsbCIsImRzdFF1YXQiLCJRdWF0Iiwic2V0IiwiVmVjMyIsInkiLCJ6IiwieCIsImZyb21FdWxlciIsImNsb25lIiwiYWN0aW9uIiwiX2Nsb25lRGVjb3JhdGlvbiIsIl9kdXJhdGlvbiIsInN0YXJ0V2l0aFRhcmdldCIsInRhcmdldCIsInJldmVyc2UiLCJsb2dJRCIsInVwZGF0ZSIsImR0IiwiX2NvbXB1dGVFYXNlVGltZSIsInNsZXJwIiwic2V0Um90YXRpb24iLCJyb3RhdGUzRFRvIiwiUm90YXRlM0RCeSIsImRlbHRhQW5nbGVYIiwiZGVsdGFBbmdsZVkiLCJkZWx0YUFuZ2xlWiIsIl9hbmdsZSIsIl9xdWF0IiwiX2xhc3REdCIsIlJBRCIsIk1hdGgiLCJQSSIsImFuZ2xlIiwiZGVsdGEiLCJhbmdsZVgiLCJhbmdsZVkiLCJhbmdsZVoiLCJyb3RhdGVYIiwicm90YXRlWSIsInJvdGF0ZVoiLCJfcmV2ZXJzZUVhc2VMaXN0Iiwicm90YXRlM0RCeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUNBOztBQUNBOzs7O0FBRUEsSUFBSUEsU0FBUyxHQUFHQyxFQUFFLENBQUNDLElBQUgsRUFBaEI7O0FBQ0EsSUFBSUMsU0FBUyxHQUFHRixFQUFFLENBQUNHLEVBQUgsRUFBaEI7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUFZQUgsRUFBRSxDQUFDSSxVQUFILEdBQWdCSixFQUFFLENBQUNLLEtBQUgsQ0FBUztBQUNyQkMsRUFBQUEsSUFBSSxFQUFF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QXJCLElBQUFBLFNBQVMsQ0FBQ3NCLENBQVYsR0FBYyxDQUFDMkIsS0FBSyxDQUFDM0IsQ0FBckI7QUFDQSxRQUFJSSxNQUFNLEdBQUcsSUFBSTVCLEVBQUUsQ0FBQ3lDLFVBQVAsQ0FBa0IsS0FBS1gsU0FBdkIsRUFBa0M1QixTQUFsQyxDQUFiOztBQUNBLFNBQUsyQixnQkFBTCxDQUFzQkQsTUFBdEI7O0FBQ0EsU0FBSytCLGdCQUFMLENBQXNCL0IsTUFBdEI7O0FBQ0EsV0FBT0EsTUFBUDtBQUNIO0FBN0VvQixDQUFULENBQWhCO0FBZ0ZBOzs7Ozs7Ozs7Ozs7Ozs7O0FBZUE1QixFQUFFLENBQUM0RCxVQUFILEdBQWdCLFVBQVVuRCxRQUFWLEVBQW9CaUMsV0FBcEIsRUFBaUNDLFdBQWpDLEVBQThDQyxXQUE5QyxFQUEyRDtBQUN2RSxTQUFPLElBQUk1QyxFQUFFLENBQUN5QyxVQUFQLENBQWtCaEMsUUFBbEIsRUFBNEJpQyxXQUE1QixFQUF5Q0MsV0FBekMsRUFBc0RDLFdBQXRELENBQVA7QUFDSCxDQUZEIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgUXVhdCBmcm9tICcuLi92YWx1ZS10eXBlcy9xdWF0JztcbmltcG9ydCBWZWMzIGZyb20gJy4uL3ZhbHVlLXR5cGVzL3ZlYzMnO1xuXG5sZXQgX3F1YXRfdG1wID0gY2MucXVhdCgpO1xubGV0IF92ZWMzX3RtcCA9IGNjLnYzKCk7XG5cbi8qXG4gKiBSb3RhdGVzIGEgTm9kZSBvYmplY3QgdG8gYSBjZXJ0YWluIGFuZ2xlIGJ5IG1vZGlmeWluZyBpdHMgcXVhdGVybmlvbiBwcm9wZXJ0eS4gPGJyLz5cbiAqIFRoZSBkaXJlY3Rpb24gd2lsbCBiZSBkZWNpZGVkIGJ5IHRoZSBzaG9ydGVzdCBhbmdsZS5cbiAqIEBjbGFzcyBSb3RhdGUzRFRvXG4gKiBAZXh0ZW5kcyBBY3Rpb25JbnRlcnZhbFxuICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uIGR1cmF0aW9uIGluIHNlY29uZHNcbiAqIEBwYXJhbSB7TnVtYmVyfFZlYzN9IGRzdEFuZ2xlWCBkc3RBbmdsZVggaW4gZGVncmVlcy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbZHN0QW5nbGVZXSBkc3RBbmdsZVkgaW4gZGVncmVlcy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbZHN0QW5nbGVaXSBkc3RBbmdsZVogaW4gZGVncmVlcy5cbiAqIEBleGFtcGxlXG4gKiB2YXIgcm90YXRlM0RUbyA9IG5ldyBjYy5Sb3RhdGUzRFRvKDIsIGNjLnYzKDAsIDE4MCwgMCkpO1xuICovXG5jYy5Sb3RhdGUzRFRvID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5Sb3RhdGUzRFRvJyxcbiAgICBleHRlbmRzOiBjYy5BY3Rpb25JbnRlcnZhbCxcblxuICAgIGN0b3I6ZnVuY3Rpb24gKGR1cmF0aW9uLCBkc3RBbmdsZVgsIGRzdEFuZ2xlWSwgZHN0QW5nbGVaKSB7XG4gICAgICAgIHRoaXMuX3N0YXJ0UXVhdCA9IGNjLnF1YXQoKTtcbiAgICAgICAgdGhpcy5fZHN0UXVhdCA9IGNjLnF1YXQoKTtcblxuXHRcdGRzdEFuZ2xlWCAhPT0gdW5kZWZpbmVkICYmIHRoaXMuaW5pdFdpdGhEdXJhdGlvbihkdXJhdGlvbiwgZHN0QW5nbGVYLCBkc3RBbmdsZVksIGRzdEFuZ2xlWik7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogSW5pdGlhbGl6ZXMgdGhlIGFjdGlvbi5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb25cbiAgICAgKiBAcGFyYW0ge051bWJlcnxWZWMzfFF1YXR9IGRzdEFuZ2xlWFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkc3RBbmdsZVlcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZHN0QW5nbGVaXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpbml0V2l0aER1cmF0aW9uOmZ1bmN0aW9uIChkdXJhdGlvbiwgZHN0QW5nbGVYLCBkc3RBbmdsZVksIGRzdEFuZ2xlWikge1xuICAgICAgICBpZiAoY2MuQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLmluaXRXaXRoRHVyYXRpb24uY2FsbCh0aGlzLCBkdXJhdGlvbikpIHtcbiAgICAgICAgICAgIGxldCBkc3RRdWF0ID0gdGhpcy5fZHN0UXVhdDtcbiAgICAgICAgICAgIGlmIChkc3RBbmdsZVggaW5zdGFuY2VvZiBjYy5RdWF0KSB7XG4gICAgICAgICAgICAgICAgZHN0UXVhdC5zZXQoZHN0QW5nbGVYKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChkc3RBbmdsZVggaW5zdGFuY2VvZiBjYy5WZWMzKSB7XG4gICAgICAgICAgICAgICAgICAgIGRzdEFuZ2xlWSA9IGRzdEFuZ2xlWC55O1xuICAgICAgICAgICAgICAgICAgICBkc3RBbmdsZVogPSBkc3RBbmdsZVguejtcbiAgICAgICAgICAgICAgICAgICAgZHN0QW5nbGVYID0gZHN0QW5nbGVYLng7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkc3RBbmdsZVkgPSBkc3RBbmdsZVkgfHwgMDtcbiAgICAgICAgICAgICAgICAgICAgZHN0QW5nbGVaID0gZHN0QW5nbGVaIHx8IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFF1YXQuZnJvbUV1bGVyKGRzdFF1YXQsIGRzdEFuZ2xlWCwgZHN0QW5nbGVZLCBkc3RBbmdsZVopO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICBjbG9uZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuUm90YXRlM0RUbygpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoRHVyYXRpb24odGhpcy5fZHVyYXRpb24sIHRoaXMuX2RzdFF1YXQpO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH0sXG5cbiAgICBzdGFydFdpdGhUYXJnZXQ6ZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICBjYy5BY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuc3RhcnRXaXRoVGFyZ2V0LmNhbGwodGhpcywgdGFyZ2V0KTtcbiAgICAgICAgdGhpcy5fc3RhcnRRdWF0LnNldCh0YXJnZXQucXVhdCk7XG4gICAgfSxcblxuICAgIHJldmVyc2U6ZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5sb2dJRCgxMDE2KTtcbiAgICB9LFxuXG4gICAgdXBkYXRlOmZ1bmN0aW9uIChkdCkge1xuICAgICAgICBkdCA9IHRoaXMuX2NvbXB1dGVFYXNlVGltZShkdCk7XG4gICAgICAgIGlmICh0aGlzLnRhcmdldCkge1xuICAgICAgICAgICAgUXVhdC5zbGVycChfcXVhdF90bXAsIHRoaXMuX3N0YXJ0UXVhdCwgdGhpcy5fZHN0UXVhdCwgZHQpO1xuICAgICAgICAgICAgdGhpcy50YXJnZXQuc2V0Um90YXRpb24oX3F1YXRfdG1wKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG4vKipcbiAqICEjZW5cbiAqIFJvdGF0ZXMgYSBOb2RlIG9iamVjdCB0byBhIGNlcnRhaW4gYW5nbGUgYnkgbW9kaWZ5aW5nIGl0cyBxdXRlcm5pb24gcHJvcGVydHkuIDxici8+XG4gKiBUaGUgZGlyZWN0aW9uIHdpbGwgYmUgZGVjaWRlZCBieSB0aGUgc2hvcnRlc3QgYW5nbGUuXG4gKiAhI3poIOaXi+i9rOWIsOebruagh+inkuW6pu+8jOmAmui/h+mAkOW4p+S/ruaUueWug+eahCBxdXRlcm5pb24g5bGe5oCn77yM5peL6L2s5pa55ZCR5bCG55Sx5pyA55+t55qE6KeS5bqm5Yaz5a6a44CCXG4gKiBAbWV0aG9kIHJvdGF0ZTNEVG9cbiAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvbiBkdXJhdGlvbiBpbiBzZWNvbmRzXG4gKiBAcGFyYW0ge051bWJlcnxWZWMzfFF1YXR9IGRzdEFuZ2xlWCBkc3RBbmdsZVggaW4gZGVncmVlcy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbZHN0QW5nbGVZXSBkc3RBbmdsZVkgaW4gZGVncmVlcy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbZHN0QW5nbGVaXSBkc3RBbmdsZVogaW4gZGVncmVlcy5cbiAqIEByZXR1cm4ge0FjdGlvbkludGVydmFsfVxuICogQGV4YW1wbGVcbiAqIC8vIGV4YW1wbGVcbiAqIHZhciByb3RhdGUzRFRvID0gY2Mucm90YXRlM0RUbygyLCBjYy52MygwLCAxODAsIDApKTtcbiAqL1xuY2Mucm90YXRlM0RUbyA9IGZ1bmN0aW9uIChkdXJhdGlvbiwgZHN0QW5nbGVYLCBkc3RBbmdsZVksIGRzdEFuZ2xlWikge1xuICAgIHJldHVybiBuZXcgY2MuUm90YXRlM0RUbyhkdXJhdGlvbiwgZHN0QW5nbGVYLCBkc3RBbmdsZVksIGRzdEFuZ2xlWik7XG59O1xuXG5cbi8qXG4gKiBSb3RhdGVzIGEgTm9kZSBvYmplY3QgY291bnRlciBjbG9ja3dpc2UgYSBudW1iZXIgb2YgZGVncmVlcyBieSBtb2RpZnlpbmcgaXRzIHF1YXRlcm5pb24gcHJvcGVydHkuXG4gKiBSZWxhdGl2ZSB0byBpdHMgcHJvcGVydGllcyB0byBtb2RpZnkuXG4gKiBAY2xhc3MgUm90YXRlM0RCeVxuICogQGV4dGVuZHMgQWN0aW9uSW50ZXJ2YWxcbiAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvbiBkdXJhdGlvbiBpbiBzZWNvbmRzXG4gKiBAcGFyYW0ge051bWJlcnxWZWMzfSBkZWx0YUFuZ2xlWCBkZWx0YUFuZ2xlWCBpbiBkZWdyZWVzXG4gKiBAcGFyYW0ge051bWJlcn0gW2RlbHRhQW5nbGVZXSBkZWx0YUFuZ2xlWSBpbiBkZWdyZWVzXG4gKiBAcGFyYW0ge051bWJlcn0gW2RlbHRhQW5nbGVaXSBkZWx0YUFuZ2xlWiBpbiBkZWdyZWVzXG4gKiBAZXhhbXBsZVxuICogdmFyIGFjdGlvbkJ5ID0gbmV3IGNjLlJvdGF0ZTNEQnkoMiwgY2MudjMoMCwgMzYwLCAwKSk7XG4gKi9cbmNjLlJvdGF0ZTNEQnkgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlJvdGF0ZTNEQnknLFxuICAgIGV4dGVuZHM6IGNjLkFjdGlvbkludGVydmFsLFxuXG4gICAgY3RvcjogZnVuY3Rpb24gKGR1cmF0aW9uLCBkZWx0YUFuZ2xlWCwgZGVsdGFBbmdsZVksIGRlbHRhQW5nbGVaKSB7XG4gICAgICAgIHRoaXMuX2FuZ2xlID0gY2MudjMoKTtcbiAgICAgICAgdGhpcy5fcXVhdCA9IGNjLnF1YXQoKTtcbiAgICAgICAgdGhpcy5fbGFzdER0ID0gMDtcblx0XHRkZWx0YUFuZ2xlWCAhPT0gdW5kZWZpbmVkICYmIHRoaXMuaW5pdFdpdGhEdXJhdGlvbihkdXJhdGlvbiwgZGVsdGFBbmdsZVgsIGRlbHRhQW5nbGVZLCBkZWx0YUFuZ2xlWik7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogSW5pdGlhbGl6ZXMgdGhlIGFjdGlvbi5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb24gZHVyYXRpb24gaW4gc2Vjb25kc1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfFZlYzN9IGRlbHRhQW5nbGVYIGRlbHRhQW5nbGVYIGluIGRlZ3JlZXNcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW2RlbHRhQW5nbGVZPV0gZGVsdGFBbmdsZVkgaW4gZGVncmVlc1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbZGVsdGFBbmdsZVo9XSBkZWx0YUFuZ2xlWiBpbiBkZWdyZWVzXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpbml0V2l0aER1cmF0aW9uOmZ1bmN0aW9uIChkdXJhdGlvbiwgZGVsdGFBbmdsZVgsIGRlbHRhQW5nbGVZLCBkZWx0YUFuZ2xlWikge1xuICAgICAgICBpZiAoY2MuQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLmluaXRXaXRoRHVyYXRpb24uY2FsbCh0aGlzLCBkdXJhdGlvbikpIHtcbiAgICAgICAgICAgIGlmIChkZWx0YUFuZ2xlWCBpbnN0YW5jZW9mIGNjLlZlYzMpIHtcbiAgICAgICAgICAgICAgICBkZWx0YUFuZ2xlWSA9IGRlbHRhQW5nbGVYLnk7XG4gICAgICAgICAgICAgICAgZGVsdGFBbmdsZVogPSBkZWx0YUFuZ2xlWC56O1xuICAgICAgICAgICAgICAgIGRlbHRhQW5nbGVYID0gZGVsdGFBbmdsZVgueDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlbHRhQW5nbGVZID0gZGVsdGFBbmdsZVkgfHwgMDtcbiAgICAgICAgICAgICAgICBkZWx0YUFuZ2xlWiA9IGRlbHRhQW5nbGVaIHx8IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBWZWMzLnNldCh0aGlzLl9hbmdsZSwgZGVsdGFBbmdsZVgsIGRlbHRhQW5nbGVZLCBkZWx0YUFuZ2xlWik7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIGNsb25lOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5Sb3RhdGUzREJ5KCk7XG4gICAgICAgIHRoaXMuX2Nsb25lRGVjb3JhdGlvbihhY3Rpb24pO1xuICAgICAgICBhY3Rpb24uaW5pdFdpdGhEdXJhdGlvbih0aGlzLl9kdXJhdGlvbiwgdGhpcy5fYW5nbGUpO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH0sXG5cbiAgICBzdGFydFdpdGhUYXJnZXQ6ZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICBjYy5BY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuc3RhcnRXaXRoVGFyZ2V0LmNhbGwodGhpcywgdGFyZ2V0KTtcbiAgICAgICAgdGhpcy5fcXVhdC5zZXQodGFyZ2V0LnF1YXQpO1xuICAgICAgICB0aGlzLl9sYXN0RHQgPSAwO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IChmdW5jdGlvbigpe1xuICAgICAgICBsZXQgUkFEID0gTWF0aC5QSSAvIDE4MDtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChkdCkge1xuICAgICAgICAgICAgZHQgPSB0aGlzLl9jb21wdXRlRWFzZVRpbWUoZHQpO1xuICAgICAgICAgICAgaWYgKHRoaXMudGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgbGV0IGFuZ2xlID0gdGhpcy5fYW5nbGU7XG4gICAgICAgICAgICAgICAgbGV0IGRzdFF1YXQgPSB0aGlzLl9xdWF0O1xuICAgICAgICAgICAgICAgIGxldCBkZWx0YSA9IGR0IC0gdGhpcy5fbGFzdER0O1xuICAgICAgICAgICAgICAgIGxldCBhbmdsZVggPSBhbmdsZS54LCBhbmdsZVkgPSBhbmdsZS55LCBhbmdsZVogPSBhbmdsZS56O1xuICAgICAgICAgICAgICAgIGlmIChhbmdsZVgpIFF1YXQucm90YXRlWChkc3RRdWF0LCBkc3RRdWF0LCBhbmdsZVggKiBSQUQgKiBkZWx0YSk7XG4gICAgICAgICAgICAgICAgaWYgKGFuZ2xlWSkgUXVhdC5yb3RhdGVZKGRzdFF1YXQsIGRzdFF1YXQsIGFuZ2xlWSAqIFJBRCAqIGRlbHRhKTtcbiAgICAgICAgICAgICAgICBpZiAoYW5nbGVaKSBRdWF0LnJvdGF0ZVooZHN0UXVhdCwgZHN0UXVhdCwgYW5nbGVaICogUkFEICogZGVsdGEpO1xuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0LnNldFJvdGF0aW9uKGRzdFF1YXQpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoaXMuX2xhc3REdCA9IGR0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSkoKSxcblxuICAgIHJldmVyc2U6ZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgYW5nbGUgPSB0aGlzLl9hbmdsZTtcbiAgICAgICAgX3ZlYzNfdG1wLnggPSAtYW5nbGUueDtcbiAgICAgICAgX3ZlYzNfdG1wLnkgPSAtYW5nbGUueTtcbiAgICAgICAgX3ZlYzNfdG1wLnogPSAtYW5nbGUuejtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5Sb3RhdGUzREJ5KHRoaXMuX2R1cmF0aW9uLCBfdmVjM190bXApO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgdGhpcy5fcmV2ZXJzZUVhc2VMaXN0KGFjdGlvbik7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfVxufSk7XG5cbi8qKlxuICogISNlblxuICogUm90YXRlcyBhIE5vZGUgb2JqZWN0IGNvdW50ZXIgY2xvY2t3aXNlIGEgbnVtYmVyIG9mIGRlZ3JlZXMgYnkgbW9kaWZ5aW5nIGl0cyBxdWF0ZXJuaW9uIHByb3BlcnR5LlxuICogUmVsYXRpdmUgdG8gaXRzIHByb3BlcnRpZXMgdG8gbW9kaWZ5LlxuICogISN6aCDml4vovazmjIflrprnmoQgM0Qg6KeS5bqm44CCXG4gKiBAbWV0aG9kIHJvdGF0ZTNEQnlcbiAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvbiBkdXJhdGlvbiBpbiBzZWNvbmRzXG4gKiBAcGFyYW0ge051bWJlcnxWZWMzfSBkZWx0YUFuZ2xlWCBkZWx0YUFuZ2xlWCBpbiBkZWdyZWVzXG4gKiBAcGFyYW0ge051bWJlcn0gW2RlbHRhQW5nbGVZXSBkZWx0YUFuZ2xlWSBpbiBkZWdyZWVzXG4gKiBAcGFyYW0ge051bWJlcn0gW2RlbHRhQW5nbGVaXSBkZWx0YUFuZ2xlWiBpbiBkZWdyZWVzXG4gKiBAcmV0dXJuIHtBY3Rpb25JbnRlcnZhbH1cbiAqIEBleGFtcGxlXG4gKiAvLyBleGFtcGxlXG4gKiB2YXIgYWN0aW9uQnkgPSBjYy5yb3RhdGUzREJ5KDIsIGNjLnYzKDAsIDM2MCwgMCkpO1xuICovXG5jYy5yb3RhdGUzREJ5ID0gZnVuY3Rpb24gKGR1cmF0aW9uLCBkZWx0YUFuZ2xlWCwgZGVsdGFBbmdsZVksIGRlbHRhQW5nbGVaKSB7XG4gICAgcmV0dXJuIG5ldyBjYy5Sb3RhdGUzREJ5KGR1cmF0aW9uLCBkZWx0YUFuZ2xlWCwgZGVsdGFBbmdsZVksIGRlbHRhQW5nbGVaKTtcbn07XG5cbiJdfQ==