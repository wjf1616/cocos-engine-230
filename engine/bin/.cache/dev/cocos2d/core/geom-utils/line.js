
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/geom-utils/line.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _valueTypes = require("../value-types");

var _enums = _interopRequireDefault(require("./enums"));

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

/**
 * !#en 
 * line
 * !#zh
 * 直线
 * @class geomUtils.Line
 */
var Line =
/*#__PURE__*/
function () {
  /**
   * !#en
   * create a new line
   * !#zh
   * 创建一个新的 line。
   * @method create
   * @param sx The x part of the starting point.
   * @param sy The y part of the starting point.
   * @param sz The z part of the starting point.
   * @param ex The x part of the end point.
   * @param ey The y part of the end point.
   * @param ez The z part of the end point.
   * @return
   */
  Line.create = function create(sx, sy, sz, ex, ey, ez) {
    return new line(sx, sy, sz, ex, ey, ez);
  }
  /**
   * !#en
   * Creates a new line initialized with values from an existing line
   * !#zh
   * 克隆一个新的 line。
   * @method clone
   * @param a The source of cloning.
   * @return The cloned object.
   */
  ;

  Line.clone = function clone(a) {
    return new line(a.s.x, a.s.y, a.s.z, a.e.x, a.e.y, a.e.z);
  }
  /**
   * !#en
   * Copy the values from one line to another
   * !#zh
   * 复制一个线的值到另一个。
   * @method copy
   * @param out The object that accepts the action.
   * @param a The source of the copy.
   * @return The object that accepts the action.
   */
  ;

  Line.copy = function copy(out, a) {
    _valueTypes.Vec3.copy(out.s, a.s);

    _valueTypes.Vec3.copy(out.e, a.e);

    return out;
  }
  /**
   * !#en
   * create a line from two points
   * !#zh
   * 用两个点创建一个线。
   * @method fromPoints
   * @param out The object that accepts the action.
   * @param start The starting point.
   * @param end At the end.
   * @return out The object that accepts the action.
   */
  ;

  Line.fromPoints = function fromPoints(out, start, end) {
    _valueTypes.Vec3.copy(out.s, start);

    _valueTypes.Vec3.copy(out.e, end);

    return out;
  }
  /**
   * !#en
   * Set the components of a Vec3 to the given values
   * !#zh
   * 将给定线的属性设置为给定值。
   * @method set
   * @param out The object that accepts the action.
   * @param sx The x part of the starting point.
   * @param sy The y part of the starting point.
   * @param sz The z part of the starting point.
   * @param ex The x part of the end point.
   * @param ey The y part of the end point.
   * @param ez The z part of the end point.
   * @return out The object that accepts the action.
   */
  ;

  Line.set = function set(out, sx, sy, sz, ex, ey, ez) {
    out.s.x = sx;
    out.s.y = sy;
    out.s.z = sz;
    out.e.x = ex;
    out.e.y = ey;
    out.e.z = ez;
    return out;
  }
  /**
   * !#en
   * Calculate the length of the line.
   * !#zh
   * 计算线的长度。
   * @method len
   * @param a The line to calculate.
   * @return Length.
   */
  ;

  Line.len = function len(a) {
    return _valueTypes.Vec3.distance(a.s, a.e);
  }
  /**
   * !#en
   * Start points.
   * !#zh
   * 起点。
   * @property {Vec3} s
   */
  ;

  /**
   * !#en Construct a line.
   * !#zh 构造一条线。
   * @constructor
   * @param sx The x part of the starting point.
   * @param sy The y part of the starting point.
   * @param sz The z part of the starting point.
   * @param ex The x part of the end point.
   * @param ey The y part of the end point.
   * @param ez The z part of the end point.
   */
  function Line(sx, sy, sz, ex, ey, ez) {
    if (sx === void 0) {
      sx = 0;
    }

    if (sy === void 0) {
      sy = 0;
    }

    if (sz === void 0) {
      sz = 0;
    }

    if (ex === void 0) {
      ex = 0;
    }

    if (ey === void 0) {
      ey = 0;
    }

    if (ez === void 0) {
      ez = -1;
    }

    this.s = void 0;
    this.e = void 0;
    this._type = void 0;
    this._type = _enums["default"].SHAPE_LINE;
    this.s = new _valueTypes.Vec3(sx, sy, sz);
    this.e = new _valueTypes.Vec3(ex, ey, ez);
  }
  /**
   * !#en
   * Calculate the length of the line.
   * !#zh
   * 计算线的长度。
   * @method length
   * @param a The line to calculate.
   * @return Length.
   */


  var _proto = Line.prototype;

  _proto.length = function length() {
    return _valueTypes.Vec3.distance(this.s, this.e);
  };

  return Line;
}();

exports["default"] = Line;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpbmUudHMiXSwibmFtZXMiOlsiTGluZSIsImNyZWF0ZSIsInN4Iiwic3kiLCJzeiIsImV4IiwiZXkiLCJleiIsImxpbmUiLCJjbG9uZSIsImEiLCJzIiwieCIsInkiLCJ6IiwiZSIsImNvcHkiLCJvdXQiLCJWZWMzIiwiZnJvbVBvaW50cyIsInN0YXJ0IiwiZW5kIiwic2V0IiwibGVuIiwiZGlzdGFuY2UiLCJfdHlwZSIsImVudW1zIiwiU0hBUEVfTElORSIsImxlbmd0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQXdCQTs7QUFDQTs7OztBQXpCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCQTs7Ozs7OztJQU9xQkE7OztBQUVqQjs7Ozs7Ozs7Ozs7Ozs7T0FjY0MsU0FBZCxnQkFBc0JDLEVBQXRCLEVBQWtDQyxFQUFsQyxFQUE4Q0MsRUFBOUMsRUFBMERDLEVBQTFELEVBQXNFQyxFQUF0RSxFQUFrRkMsRUFBbEYsRUFBOEY7QUFDMUYsV0FBTyxJQUFJQyxJQUFKLENBQVNOLEVBQVQsRUFBYUMsRUFBYixFQUFpQkMsRUFBakIsRUFBcUJDLEVBQXJCLEVBQXlCQyxFQUF6QixFQUE2QkMsRUFBN0IsQ0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7O09BU2NFLFFBQWQsZUFBcUJDLENBQXJCLEVBQThCO0FBQzFCLFdBQU8sSUFBSUYsSUFBSixDQUNIRSxDQUFDLENBQUNDLENBQUYsQ0FBSUMsQ0FERCxFQUNJRixDQUFDLENBQUNDLENBQUYsQ0FBSUUsQ0FEUixFQUNXSCxDQUFDLENBQUNDLENBQUYsQ0FBSUcsQ0FEZixFQUVISixDQUFDLENBQUNLLENBQUYsQ0FBSUgsQ0FGRCxFQUVJRixDQUFDLENBQUNLLENBQUYsQ0FBSUYsQ0FGUixFQUVXSCxDQUFDLENBQUNLLENBQUYsQ0FBSUQsQ0FGZixDQUFQO0FBSUg7QUFFRDs7Ozs7Ozs7Ozs7O09BVWNFLE9BQWQsY0FBb0JDLEdBQXBCLEVBQStCUCxDQUEvQixFQUF3QztBQUNwQ1EscUJBQUtGLElBQUwsQ0FBVUMsR0FBRyxDQUFDTixDQUFkLEVBQWlCRCxDQUFDLENBQUNDLENBQW5COztBQUNBTyxxQkFBS0YsSUFBTCxDQUFVQyxHQUFHLENBQUNGLENBQWQsRUFBaUJMLENBQUMsQ0FBQ0ssQ0FBbkI7O0FBRUEsV0FBT0UsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7Ozs7T0FXY0UsYUFBZCxvQkFBMEJGLEdBQTFCLEVBQXFDRyxLQUFyQyxFQUFrREMsR0FBbEQsRUFBNkQ7QUFDekRILHFCQUFLRixJQUFMLENBQVVDLEdBQUcsQ0FBQ04sQ0FBZCxFQUFpQlMsS0FBakI7O0FBQ0FGLHFCQUFLRixJQUFMLENBQVVDLEdBQUcsQ0FBQ0YsQ0FBZCxFQUFpQk0sR0FBakI7O0FBQ0EsV0FBT0osR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7O09BZWNLLE1BQWQsYUFBbUJMLEdBQW5CLEVBQThCZixFQUE5QixFQUEwQ0MsRUFBMUMsRUFBc0RDLEVBQXRELEVBQWtFQyxFQUFsRSxFQUE4RUMsRUFBOUUsRUFBMEZDLEVBQTFGLEVBQXNHO0FBQ2xHVSxJQUFBQSxHQUFHLENBQUNOLENBQUosQ0FBTUMsQ0FBTixHQUFVVixFQUFWO0FBQ0FlLElBQUFBLEdBQUcsQ0FBQ04sQ0FBSixDQUFNRSxDQUFOLEdBQVVWLEVBQVY7QUFDQWMsSUFBQUEsR0FBRyxDQUFDTixDQUFKLENBQU1HLENBQU4sR0FBVVYsRUFBVjtBQUNBYSxJQUFBQSxHQUFHLENBQUNGLENBQUosQ0FBTUgsQ0FBTixHQUFVUCxFQUFWO0FBQ0FZLElBQUFBLEdBQUcsQ0FBQ0YsQ0FBSixDQUFNRixDQUFOLEdBQVVQLEVBQVY7QUFDQVcsSUFBQUEsR0FBRyxDQUFDRixDQUFKLENBQU1ELENBQU4sR0FBVVAsRUFBVjtBQUVBLFdBQU9VLEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7OztPQVNjTSxNQUFkLGFBQW1CYixDQUFuQixFQUE0QjtBQUN4QixXQUFPUSxpQkFBS00sUUFBTCxDQUFjZCxDQUFDLENBQUNDLENBQWhCLEVBQW1CRCxDQUFDLENBQUNLLENBQXJCLENBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7QUFvQkE7Ozs7Ozs7Ozs7O0FBV0EsZ0JBQWFiLEVBQWIsRUFBcUJDLEVBQXJCLEVBQTZCQyxFQUE3QixFQUFxQ0MsRUFBckMsRUFBNkNDLEVBQTdDLEVBQXFEQyxFQUFyRCxFQUE4RDtBQUFBLFFBQWpETCxFQUFpRDtBQUFqREEsTUFBQUEsRUFBaUQsR0FBNUMsQ0FBNEM7QUFBQTs7QUFBQSxRQUF6Q0MsRUFBeUM7QUFBekNBLE1BQUFBLEVBQXlDLEdBQXBDLENBQW9DO0FBQUE7O0FBQUEsUUFBakNDLEVBQWlDO0FBQWpDQSxNQUFBQSxFQUFpQyxHQUE1QixDQUE0QjtBQUFBOztBQUFBLFFBQXpCQyxFQUF5QjtBQUF6QkEsTUFBQUEsRUFBeUIsR0FBcEIsQ0FBb0I7QUFBQTs7QUFBQSxRQUFqQkMsRUFBaUI7QUFBakJBLE1BQUFBLEVBQWlCLEdBQVosQ0FBWTtBQUFBOztBQUFBLFFBQVRDLEVBQVM7QUFBVEEsTUFBQUEsRUFBUyxHQUFKLENBQUMsQ0FBRztBQUFBOztBQUFBLFNBeEJ2REksQ0F3QnVEO0FBQUEsU0FmdkRJLENBZXVEO0FBQUEsU0FidERVLEtBYXNEO0FBQzFELFNBQUtBLEtBQUwsR0FBYUMsa0JBQU1DLFVBQW5CO0FBQ0EsU0FBS2hCLENBQUwsR0FBUyxJQUFJTyxnQkFBSixDQUFTaEIsRUFBVCxFQUFhQyxFQUFiLEVBQWlCQyxFQUFqQixDQUFUO0FBQ0EsU0FBS1csQ0FBTCxHQUFTLElBQUlHLGdCQUFKLENBQVNiLEVBQVQsRUFBYUMsRUFBYixFQUFpQkMsRUFBakIsQ0FBVDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7Ozs7U0FTT3FCLFNBQVAsa0JBQWlCO0FBQ2IsV0FBT1YsaUJBQUtNLFFBQUwsQ0FBYyxLQUFLYixDQUFuQixFQUFzQixLQUFLSSxDQUEzQixDQUFQO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbmltcG9ydCB7IFZlYzMgfSBmcm9tICcuLi92YWx1ZS10eXBlcyc7XG5pbXBvcnQgZW51bXMgZnJvbSAnLi9lbnVtcyc7XG5cbi8qKlxuICogISNlbiBcbiAqIGxpbmVcbiAqICEjemhcbiAqIOebtOe6v1xuICogQGNsYXNzIGdlb21VdGlscy5MaW5lXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmUge1xuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIGNyZWF0ZSBhIG5ldyBsaW5lXG4gICAgICogISN6aFxuICAgICAqIOWIm+W7uuS4gOS4quaWsOeahCBsaW5l44CCXG4gICAgICogQG1ldGhvZCBjcmVhdGVcbiAgICAgKiBAcGFyYW0gc3ggVGhlIHggcGFydCBvZiB0aGUgc3RhcnRpbmcgcG9pbnQuXG4gICAgICogQHBhcmFtIHN5IFRoZSB5IHBhcnQgb2YgdGhlIHN0YXJ0aW5nIHBvaW50LlxuICAgICAqIEBwYXJhbSBzeiBUaGUgeiBwYXJ0IG9mIHRoZSBzdGFydGluZyBwb2ludC5cbiAgICAgKiBAcGFyYW0gZXggVGhlIHggcGFydCBvZiB0aGUgZW5kIHBvaW50LlxuICAgICAqIEBwYXJhbSBleSBUaGUgeSBwYXJ0IG9mIHRoZSBlbmQgcG9pbnQuXG4gICAgICogQHBhcmFtIGV6IFRoZSB6IHBhcnQgb2YgdGhlIGVuZCBwb2ludC5cbiAgICAgKiBAcmV0dXJuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGUgKHN4OiBudW1iZXIsIHN5OiBudW1iZXIsIHN6OiBudW1iZXIsIGV4OiBudW1iZXIsIGV5OiBudW1iZXIsIGV6OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBsaW5lKHN4LCBzeSwgc3osIGV4LCBleSwgZXopO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBDcmVhdGVzIGEgbmV3IGxpbmUgaW5pdGlhbGl6ZWQgd2l0aCB2YWx1ZXMgZnJvbSBhbiBleGlzdGluZyBsaW5lXG4gICAgICogISN6aFxuICAgICAqIOWFi+mahuS4gOS4quaWsOeahCBsaW5l44CCXG4gICAgICogQG1ldGhvZCBjbG9uZVxuICAgICAqIEBwYXJhbSBhIFRoZSBzb3VyY2Ugb2YgY2xvbmluZy5cbiAgICAgKiBAcmV0dXJuIFRoZSBjbG9uZWQgb2JqZWN0LlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgY2xvbmUgKGE6IGxpbmUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBsaW5lKFxuICAgICAgICAgICAgYS5zLngsIGEucy55LCBhLnMueixcbiAgICAgICAgICAgIGEuZS54LCBhLmUueSwgYS5lLnosXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIENvcHkgdGhlIHZhbHVlcyBmcm9tIG9uZSBsaW5lIHRvIGFub3RoZXJcbiAgICAgKiAhI3poXG4gICAgICog5aSN5Yi25LiA5Liq57q/55qE5YC85Yiw5Y+m5LiA5Liq44CCXG4gICAgICogQG1ldGhvZCBjb3B5XG4gICAgICogQHBhcmFtIG91dCBUaGUgb2JqZWN0IHRoYXQgYWNjZXB0cyB0aGUgYWN0aW9uLlxuICAgICAqIEBwYXJhbSBhIFRoZSBzb3VyY2Ugb2YgdGhlIGNvcHkuXG4gICAgICogQHJldHVybiBUaGUgb2JqZWN0IHRoYXQgYWNjZXB0cyB0aGUgYWN0aW9uLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgY29weSAob3V0OiBsaW5lLCBhOiBsaW5lKSB7XG4gICAgICAgIFZlYzMuY29weShvdXQucywgYS5zKTtcbiAgICAgICAgVmVjMy5jb3B5KG91dC5lLCBhLmUpO1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIGNyZWF0ZSBhIGxpbmUgZnJvbSB0d28gcG9pbnRzXG4gICAgICogISN6aFxuICAgICAqIOeUqOS4pOS4queCueWIm+W7uuS4gOS4que6v+OAglxuICAgICAqIEBtZXRob2QgZnJvbVBvaW50c1xuICAgICAqIEBwYXJhbSBvdXQgVGhlIG9iamVjdCB0aGF0IGFjY2VwdHMgdGhlIGFjdGlvbi5cbiAgICAgKiBAcGFyYW0gc3RhcnQgVGhlIHN0YXJ0aW5nIHBvaW50LlxuICAgICAqIEBwYXJhbSBlbmQgQXQgdGhlIGVuZC5cbiAgICAgKiBAcmV0dXJuIG91dCBUaGUgb2JqZWN0IHRoYXQgYWNjZXB0cyB0aGUgYWN0aW9uLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZnJvbVBvaW50cyAob3V0OiBsaW5lLCBzdGFydDogVmVjMywgZW5kOiBWZWMzKSB7XG4gICAgICAgIFZlYzMuY29weShvdXQucywgc3RhcnQpO1xuICAgICAgICBWZWMzLmNvcHkob3V0LmUsIGVuZCk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNldCB0aGUgY29tcG9uZW50cyBvZiBhIFZlYzMgdG8gdGhlIGdpdmVuIHZhbHVlc1xuICAgICAqICEjemhcbiAgICAgKiDlsIbnu5nlrprnur/nmoTlsZ7mgKforr7nva7kuLrnu5nlrprlgLzjgIJcbiAgICAgKiBAbWV0aG9kIHNldFxuICAgICAqIEBwYXJhbSBvdXQgVGhlIG9iamVjdCB0aGF0IGFjY2VwdHMgdGhlIGFjdGlvbi5cbiAgICAgKiBAcGFyYW0gc3ggVGhlIHggcGFydCBvZiB0aGUgc3RhcnRpbmcgcG9pbnQuXG4gICAgICogQHBhcmFtIHN5IFRoZSB5IHBhcnQgb2YgdGhlIHN0YXJ0aW5nIHBvaW50LlxuICAgICAqIEBwYXJhbSBzeiBUaGUgeiBwYXJ0IG9mIHRoZSBzdGFydGluZyBwb2ludC5cbiAgICAgKiBAcGFyYW0gZXggVGhlIHggcGFydCBvZiB0aGUgZW5kIHBvaW50LlxuICAgICAqIEBwYXJhbSBleSBUaGUgeSBwYXJ0IG9mIHRoZSBlbmQgcG9pbnQuXG4gICAgICogQHBhcmFtIGV6IFRoZSB6IHBhcnQgb2YgdGhlIGVuZCBwb2ludC5cbiAgICAgKiBAcmV0dXJuIG91dCBUaGUgb2JqZWN0IHRoYXQgYWNjZXB0cyB0aGUgYWN0aW9uLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgc2V0IChvdXQ6IGxpbmUsIHN4OiBudW1iZXIsIHN5OiBudW1iZXIsIHN6OiBudW1iZXIsIGV4OiBudW1iZXIsIGV5OiBudW1iZXIsIGV6OiBudW1iZXIpIHtcbiAgICAgICAgb3V0LnMueCA9IHN4O1xuICAgICAgICBvdXQucy55ID0gc3k7XG4gICAgICAgIG91dC5zLnogPSBzejtcbiAgICAgICAgb3V0LmUueCA9IGV4O1xuICAgICAgICBvdXQuZS55ID0gZXk7XG4gICAgICAgIG91dC5lLnogPSBlejtcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBDYWxjdWxhdGUgdGhlIGxlbmd0aCBvZiB0aGUgbGluZS5cbiAgICAgKiAhI3poXG4gICAgICog6K6h566X57q/55qE6ZW/5bqm44CCXG4gICAgICogQG1ldGhvZCBsZW5cbiAgICAgKiBAcGFyYW0gYSBUaGUgbGluZSB0byBjYWxjdWxhdGUuXG4gICAgICogQHJldHVybiBMZW5ndGguXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBsZW4gKGE6IGxpbmUpIHtcbiAgICAgICAgcmV0dXJuIFZlYzMuZGlzdGFuY2UoYS5zLCBhLmUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBTdGFydCBwb2ludHMuXG4gICAgICogISN6aFxuICAgICAqIOi1t+eCueOAglxuICAgICAqIEBwcm9wZXJ0eSB7VmVjM30gc1xuICAgICAqL1xuICAgIHB1YmxpYyBzOiBWZWMzO1xuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEVuZCBwb2ludHMuXG4gICAgICogISN6aFxuICAgICAqIOe7iOeCueOAglxuICAgICAqIEBwcm9wZXJ0eSB7VmVjM30gZVxuICAgICAqL1xuICAgIHB1YmxpYyBlOiBWZWMzO1xuXG4gICAgcHJpdmF0ZSBfdHlwZTogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBDb25zdHJ1Y3QgYSBsaW5lLlxuICAgICAqICEjemgg5p6E6YCg5LiA5p2h57q/44CCXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHN4IFRoZSB4IHBhcnQgb2YgdGhlIHN0YXJ0aW5nIHBvaW50LlxuICAgICAqIEBwYXJhbSBzeSBUaGUgeSBwYXJ0IG9mIHRoZSBzdGFydGluZyBwb2ludC5cbiAgICAgKiBAcGFyYW0gc3ogVGhlIHogcGFydCBvZiB0aGUgc3RhcnRpbmcgcG9pbnQuXG4gICAgICogQHBhcmFtIGV4IFRoZSB4IHBhcnQgb2YgdGhlIGVuZCBwb2ludC5cbiAgICAgKiBAcGFyYW0gZXkgVGhlIHkgcGFydCBvZiB0aGUgZW5kIHBvaW50LlxuICAgICAqIEBwYXJhbSBleiBUaGUgeiBwYXJ0IG9mIHRoZSBlbmQgcG9pbnQuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKHN4ID0gMCwgc3kgPSAwLCBzeiA9IDAsIGV4ID0gMCwgZXkgPSAwLCBleiA9IC0xKSB7XG4gICAgICAgIHRoaXMuX3R5cGUgPSBlbnVtcy5TSEFQRV9MSU5FO1xuICAgICAgICB0aGlzLnMgPSBuZXcgVmVjMyhzeCwgc3ksIHN6KTtcbiAgICAgICAgdGhpcy5lID0gbmV3IFZlYzMoZXgsIGV5LCBleik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIENhbGN1bGF0ZSB0aGUgbGVuZ3RoIG9mIHRoZSBsaW5lLlxuICAgICAqICEjemhcbiAgICAgKiDorqHnrpfnur/nmoTplb/luqbjgIJcbiAgICAgKiBAbWV0aG9kIGxlbmd0aFxuICAgICAqIEBwYXJhbSBhIFRoZSBsaW5lIHRvIGNhbGN1bGF0ZS5cbiAgICAgKiBAcmV0dXJuIExlbmd0aC5cbiAgICAgKi9cbiAgICBwdWJsaWMgbGVuZ3RoICgpIHtcbiAgICAgICAgcmV0dXJuIFZlYzMuZGlzdGFuY2UodGhpcy5zLCB0aGlzLmUpO1xuICAgIH1cbn1cbiJdfQ==