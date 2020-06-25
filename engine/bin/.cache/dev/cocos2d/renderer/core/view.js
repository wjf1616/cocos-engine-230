
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/core/view.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _valueTypes = require("../../core/value-types");

var _enums = _interopRequireDefault(require("../enums"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
var _m4_tmp = new _valueTypes.Mat4();

var _genID = 0;
/**
 * A representation of a single camera view
 */

var View =
/*#__PURE__*/
function () {
  /**
   * Setup a default view
   */
  function View() {
    this._id = _genID++; // priority. the smaller one will be rendered first

    this._priority = 0; // viewport

    this._rect = {
      x: 0,
      y: 0,
      w: 1,
      h: 1
    }; // TODO:
    // this._scissor = {
    //   x: 0, y: 0, w: 1, h: 1
    // };
    // clear options

    this._color = new _valueTypes.Vec4(0.3, 0.3, 0.3, 1);
    this._depth = 1;
    this._stencil = 0;
    this._clearFlags = _enums["default"].CLEAR_COLOR | _enums["default"].CLEAR_DEPTH;
    this._clearModel = null; // matrix

    this._matView = cc.mat4();
    this._matProj = cc.mat4();
    this._matViewProj = cc.mat4();
    this._matInvViewProj = cc.mat4(); // stages & framebuffer

    this._stages = [];
    this._cullingByID = false;
    this._framebuffer = null;
    this._shadowLight = null; // TODO: should not refer light in view.

    this._cullingMask = 0xffffffff;
  }
  /**
   * Get the view's forward direction
   * @param {Vec3} out the receiving vector
   * @returns {Vec3} the receiving vector
   */


  var _proto = View.prototype;

  _proto.getForward = function getForward(out) {
    var m = this._matView.m;
    return _valueTypes.Vec3.set(out, -m[2], -m[6], -m[10]);
  }
  /**
   * Get the view's observing location
   * @param {Vec3} out the receiving vector
   * @returns {Vec3} the receiving vector
   */
  ;

  _proto.getPosition = function getPosition(out) {
    _valueTypes.Mat4.invert(_m4_tmp, this._matView);

    return _valueTypes.Mat4.getTranslation(out, _m4_tmp);
  };

  return View;
}();

exports["default"] = View;
module.exports = exports["default"];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXcuanMiXSwibmFtZXMiOlsiX200X3RtcCIsIk1hdDQiLCJfZ2VuSUQiLCJWaWV3IiwiX2lkIiwiX3ByaW9yaXR5IiwiX3JlY3QiLCJ4IiwieSIsInciLCJoIiwiX2NvbG9yIiwiVmVjNCIsIl9kZXB0aCIsIl9zdGVuY2lsIiwiX2NsZWFyRmxhZ3MiLCJlbnVtcyIsIkNMRUFSX0NPTE9SIiwiQ0xFQVJfREVQVEgiLCJfY2xlYXJNb2RlbCIsIl9tYXRWaWV3IiwiY2MiLCJtYXQ0IiwiX21hdFByb2oiLCJfbWF0Vmlld1Byb2oiLCJfbWF0SW52Vmlld1Byb2oiLCJfc3RhZ2VzIiwiX2N1bGxpbmdCeUlEIiwiX2ZyYW1lYnVmZmVyIiwiX3NoYWRvd0xpZ2h0IiwiX2N1bGxpbmdNYXNrIiwiZ2V0Rm9yd2FyZCIsIm91dCIsIm0iLCJWZWMzIiwic2V0IiwiZ2V0UG9zaXRpb24iLCJpbnZlcnQiLCJnZXRUcmFuc2xhdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUVBOztBQUNBOzs7O0FBSEE7QUFLQSxJQUFJQSxPQUFPLEdBQUcsSUFBSUMsZ0JBQUosRUFBZDs7QUFDQSxJQUFJQyxNQUFNLEdBQUcsQ0FBYjtBQUVBOzs7O0lBR3FCQzs7O0FBQ25COzs7QUFHQSxrQkFBYztBQUNaLFNBQUtDLEdBQUwsR0FBV0YsTUFBTSxFQUFqQixDQURZLENBR1o7O0FBQ0EsU0FBS0csU0FBTCxHQUFpQixDQUFqQixDQUpZLENBTVo7O0FBQ0EsU0FBS0MsS0FBTCxHQUFhO0FBQ1hDLE1BQUFBLENBQUMsRUFBRSxDQURRO0FBQ0xDLE1BQUFBLENBQUMsRUFBRSxDQURFO0FBQ0NDLE1BQUFBLENBQUMsRUFBRSxDQURKO0FBQ09DLE1BQUFBLENBQUMsRUFBRTtBQURWLEtBQWIsQ0FQWSxDQVdaO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBQ0EsU0FBS0MsTUFBTCxHQUFjLElBQUlDLGdCQUFKLENBQVMsR0FBVCxFQUFjLEdBQWQsRUFBbUIsR0FBbkIsRUFBd0IsQ0FBeEIsQ0FBZDtBQUNBLFNBQUtDLE1BQUwsR0FBYyxDQUFkO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQixDQUFoQjtBQUNBLFNBQUtDLFdBQUwsR0FBbUJDLGtCQUFNQyxXQUFOLEdBQW9CRCxrQkFBTUUsV0FBN0M7QUFDQSxTQUFLQyxXQUFMLEdBQW1CLElBQW5CLENBckJZLENBdUJaOztBQUNBLFNBQUtDLFFBQUwsR0FBZ0JDLEVBQUUsQ0FBQ0MsSUFBSCxFQUFoQjtBQUNBLFNBQUtDLFFBQUwsR0FBZ0JGLEVBQUUsQ0FBQ0MsSUFBSCxFQUFoQjtBQUNBLFNBQUtFLFlBQUwsR0FBb0JILEVBQUUsQ0FBQ0MsSUFBSCxFQUFwQjtBQUNBLFNBQUtHLGVBQUwsR0FBdUJKLEVBQUUsQ0FBQ0MsSUFBSCxFQUF2QixDQTNCWSxDQTZCWjs7QUFDQSxTQUFLSSxPQUFMLEdBQWUsRUFBZjtBQUNBLFNBQUtDLFlBQUwsR0FBb0IsS0FBcEI7QUFDQSxTQUFLQyxZQUFMLEdBQW9CLElBQXBCO0FBRUEsU0FBS0MsWUFBTCxHQUFvQixJQUFwQixDQWxDWSxDQWtDYzs7QUFFMUIsU0FBS0MsWUFBTCxHQUFvQixVQUFwQjtBQUNEO0FBRUQ7Ozs7Ozs7OztTQUtBQyxhQUFBLG9CQUFXQyxHQUFYLEVBQWdCO0FBQ2QsUUFBSUMsQ0FBQyxHQUFHLEtBQUtiLFFBQUwsQ0FBY2EsQ0FBdEI7QUFDQSxXQUFPQyxpQkFBS0MsR0FBTCxDQUNMSCxHQURLLEVBRUwsQ0FBQ0MsQ0FBQyxDQUFDLENBQUQsQ0FGRyxFQUdMLENBQUNBLENBQUMsQ0FBQyxDQUFELENBSEcsRUFJTCxDQUFDQSxDQUFDLENBQUMsRUFBRCxDQUpHLENBQVA7QUFNRDtBQUVEOzs7Ozs7O1NBS0FHLGNBQUEscUJBQVlKLEdBQVosRUFBaUI7QUFDZi9CLHFCQUFLb0MsTUFBTCxDQUFZckMsT0FBWixFQUFxQixLQUFLb0IsUUFBMUI7O0FBQ0EsV0FBT25CLGlCQUFLcUMsY0FBTCxDQUFvQk4sR0FBcEIsRUFBeUJoQyxPQUF6QixDQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuaW1wb3J0IHsgVmVjMywgTWF0NCwgVmVjNCB9IGZyb20gJy4uLy4uL2NvcmUvdmFsdWUtdHlwZXMnO1xuaW1wb3J0IGVudW1zIGZyb20gJy4uL2VudW1zJztcblxubGV0IF9tNF90bXAgPSBuZXcgTWF0NCgpO1xubGV0IF9nZW5JRCA9IDA7XG5cbi8qKlxuICogQSByZXByZXNlbnRhdGlvbiBvZiBhIHNpbmdsZSBjYW1lcmEgdmlld1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3IHtcbiAgLyoqXG4gICAqIFNldHVwIGEgZGVmYXVsdCB2aWV3XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9pZCA9IF9nZW5JRCsrO1xuXG4gICAgLy8gcHJpb3JpdHkuIHRoZSBzbWFsbGVyIG9uZSB3aWxsIGJlIHJlbmRlcmVkIGZpcnN0XG4gICAgdGhpcy5fcHJpb3JpdHkgPSAwO1xuXG4gICAgLy8gdmlld3BvcnRcbiAgICB0aGlzLl9yZWN0ID0ge1xuICAgICAgeDogMCwgeTogMCwgdzogMSwgaDogMVxuICAgIH07XG5cbiAgICAvLyBUT0RPOlxuICAgIC8vIHRoaXMuX3NjaXNzb3IgPSB7XG4gICAgLy8gICB4OiAwLCB5OiAwLCB3OiAxLCBoOiAxXG4gICAgLy8gfTtcblxuICAgIC8vIGNsZWFyIG9wdGlvbnNcbiAgICB0aGlzLl9jb2xvciA9IG5ldyBWZWM0KDAuMywgMC4zLCAwLjMsIDEpO1xuICAgIHRoaXMuX2RlcHRoID0gMTtcbiAgICB0aGlzLl9zdGVuY2lsID0gMDtcbiAgICB0aGlzLl9jbGVhckZsYWdzID0gZW51bXMuQ0xFQVJfQ09MT1IgfCBlbnVtcy5DTEVBUl9ERVBUSDtcbiAgICB0aGlzLl9jbGVhck1vZGVsID0gbnVsbDtcblxuICAgIC8vIG1hdHJpeFxuICAgIHRoaXMuX21hdFZpZXcgPSBjYy5tYXQ0KCk7XG4gICAgdGhpcy5fbWF0UHJvaiA9IGNjLm1hdDQoKTtcbiAgICB0aGlzLl9tYXRWaWV3UHJvaiA9IGNjLm1hdDQoKTtcbiAgICB0aGlzLl9tYXRJbnZWaWV3UHJvaiA9IGNjLm1hdDQoKTtcblxuICAgIC8vIHN0YWdlcyAmIGZyYW1lYnVmZmVyXG4gICAgdGhpcy5fc3RhZ2VzID0gW107XG4gICAgdGhpcy5fY3VsbGluZ0J5SUQgPSBmYWxzZTtcbiAgICB0aGlzLl9mcmFtZWJ1ZmZlciA9IG51bGw7XG5cbiAgICB0aGlzLl9zaGFkb3dMaWdodCA9IG51bGw7IC8vIFRPRE86IHNob3VsZCBub3QgcmVmZXIgbGlnaHQgaW4gdmlldy5cblxuICAgIHRoaXMuX2N1bGxpbmdNYXNrID0gMHhmZmZmZmZmZjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHZpZXcncyBmb3J3YXJkIGRpcmVjdGlvblxuICAgKiBAcGFyYW0ge1ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKiBAcmV0dXJucyB7VmVjM30gdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAgICovXG4gIGdldEZvcndhcmQob3V0KSB7XG4gICAgbGV0IG0gPSB0aGlzLl9tYXRWaWV3Lm07XG4gICAgcmV0dXJuIFZlYzMuc2V0KFxuICAgICAgb3V0LFxuICAgICAgLW1bMl0sXG4gICAgICAtbVs2XSxcbiAgICAgIC1tWzEwXVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSB2aWV3J3Mgb2JzZXJ2aW5nIGxvY2F0aW9uXG4gICAqIEBwYXJhbSB7VmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gICAqIEByZXR1cm5zIHtWZWMzfSB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICAgKi9cbiAgZ2V0UG9zaXRpb24ob3V0KSB7XG4gICAgTWF0NC5pbnZlcnQoX200X3RtcCwgdGhpcy5fbWF0Vmlldyk7XG4gICAgcmV0dXJuIE1hdDQuZ2V0VHJhbnNsYXRpb24ob3V0LCBfbTRfdG1wKTtcbiAgfVxufVxuIl19