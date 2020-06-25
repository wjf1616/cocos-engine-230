
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/value-types/rect.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _valueType = _interopRequireDefault(require("./value-type"));

var _CCClass = _interopRequireDefault(require("../platform/CCClass"));

var _vec = _interopRequireDefault(require("./vec2"));

var _size = _interopRequireDefault(require("./size"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * !#en A 2D rectangle defined by x, y position and width, height.
 * !#zh 通过位置和宽高定义的 2D 矩形。
 * @class Rect
 * @extends ValueType
 */

/**
 * !#en
 * Constructor of Rect class.
 * see {{#crossLink "cc/rect:method"}} cc.rect {{/crossLink}} for convenience method.
 * !#zh
 * Rect类的构造函数。可以通过 {{#crossLink "cc/rect:method"}} cc.rect {{/crossLink}} 简便方法进行创建。
 *
 * @method constructor
 * @param {Number} [x=0]
 * @param {Number} [y=0]
 * @param {Number} [w=0]
 * @param {Number} [h=0]
 */
var Rect =
/*#__PURE__*/
function (_ValueType) {
  _inheritsLoose(Rect, _ValueType);

  /**
   * !#en Creates a rectangle from two coordinate values.
   * !#zh 根据指定 2 个坐标创建出一个矩形区域。
   * @static
   * @method fromMinMax
   * @param {Vec2} v1
   * @param {Vec2} v2
   * @return {Rect}
   * @example
   * cc.Rect.fromMinMax(cc.v2(10, 10), cc.v2(20, 20)); // Rect {x: 10, y: 10, width: 10, height: 10};
   */
  Rect.fromMinMax = function fromMinMax(v1, v2) {
    var min_x = Math.min(v1.x, v2.x);
    var min_y = Math.min(v1.y, v2.y);
    var max_x = Math.max(v1.x, v2.x);
    var max_y = Math.max(v1.y, v2.y);
    return new Rect(min_x, min_y, max_x - min_x, max_y - min_y);
  }
  /**
   * @property {Number} x
   */
  ;

  function Rect(x, y, w, h) {
    var _this;

    if (x === void 0) {
      x = 0;
    }

    if (y === void 0) {
      y = 0;
    }

    if (w === void 0) {
      w = 0;
    }

    if (h === void 0) {
      h = 0;
    }

    _this = _ValueType.call(this) || this;
    _this.x = void 0;
    _this.y = void 0;
    _this.width = void 0;
    _this.height = void 0;

    if (x && typeof x === 'object') {
      y = x.y;
      w = x.width;
      h = x.height;
      x = x.x;
    }

    _this.x = x || 0;
    _this.y = y || 0;
    _this.width = w || 0;
    _this.height = h || 0;
    return _this;
  }
  /**
   * !#en TODO
   * !#zh 克隆一个新的 Rect。
   * @method clone
   * @return {Rect}
   * @example
   * var a = new cc.Rect(0, 0, 10, 10);
   * a.clone();// Rect {x: 0, y: 0, width: 10, height: 10}
   */


  var _proto = Rect.prototype;

  _proto.clone = function clone() {
    return new Rect(this.x, this.y, this.width, this.height);
  }
  /**
   * !#en TODO
   * !#zh 是否等于指定的矩形。
   * @method equals
   * @param {Rect} other
   * @return {Boolean}
   * @example
   * var a = new cc.Rect(0, 0, 10, 10);
   * var b = new cc.Rect(0, 0, 10, 10);
   * a.equals(b);// true;
   */
  ;

  _proto.equals = function equals(other) {
    return other && this.x === other.x && this.y === other.y && this.width === other.width && this.height === other.height;
  };

  /**
   * !#en TODO
   * !#zh 线性插值
   * @method lerp
   * @param {Rect} to
   * @param {Number} ratio - the interpolation coefficient.
   * @param {Rect} [out] - optional, the receiving vector.
   * @return {Rect}
   * @example
   * var a = new cc.Rect(0, 0, 10, 10);
   * var b = new cc.Rect(50, 50, 100, 100);
   * update (dt) {
   *    // method 1;
   *    var c = a.lerp(b, dt * 0.1);
   *    // method 2;
   *    a.lerp(b, dt * 0.1, c);
   * }
   */
  _proto.lerp = function lerp(to, ratio, out) {
    out = out || new Rect();
    var x = this.x;
    var y = this.y;
    var width = this.width;
    var height = this.height;
    out.x = x + (to.x - x) * ratio;
    out.y = y + (to.y - y) * ratio;
    out.width = width + (to.width - width) * ratio;
    out.height = height + (to.height - height) * ratio;
    return out;
  };

  _proto.set = function set(source) {
    this.x = source.x;
    this.y = source.y;
    this.width = source.width;
    this.height = source.height;
    return this;
  }
  /**
   * !#en Check whether the current rectangle intersects with the given one
   * !#zh 当前矩形与指定矩形是否相交。
   * @method intersects
   * @param {Rect} rect
   * @return {Boolean}
   * @example
   * var a = new cc.Rect(0, 0, 10, 10);
   * var b = new cc.Rect(0, 0, 20, 20);
   * a.intersects(b);// true
   */
  ;

  _proto.intersects = function intersects(rect) {
    var maxax = this.x + this.width,
        maxay = this.y + this.height,
        maxbx = rect.x + rect.width,
        maxby = rect.y + rect.height;
    return !(maxax < rect.x || maxbx < this.x || maxay < rect.y || maxby < this.y);
  }
  /**
   * !#en Returns the overlapping portion of 2 rectangles.
   * !#zh 返回 2 个矩形重叠的部分。
   * @method intersection
   * @param {Rect} out Stores the result
   * @param {Rect} rectB
   * @return {Rect} Returns the out parameter
   * @example
   * var a = new cc.Rect(0, 10, 20, 20);
   * var b = new cc.Rect(0, 10, 10, 10);
   * var intersection = new cc.Rect();
   * a.intersection(intersection, b); // intersection {x: 0, y: 10, width: 10, height: 10};
   */
  ;

  _proto.intersection = function intersection(out, rectB) {
    var axMin = this.x,
        ayMin = this.y,
        axMax = this.x + this.width,
        ayMax = this.y + this.height;
    var bxMin = rectB.x,
        byMin = rectB.y,
        bxMax = rectB.x + rectB.width,
        byMax = rectB.y + rectB.height;
    out.x = Math.max(axMin, bxMin);
    out.y = Math.max(ayMin, byMin);
    out.width = Math.min(axMax, bxMax) - out.x;
    out.height = Math.min(ayMax, byMax) - out.y;
    return out;
  }
  /**
   * !#en Check whether the current rect contains the given point
   * !#zh 当前矩形是否包含指定坐标点。
   * Returns true if the point inside this rectangle.
   * @method contains
   * @param {Vec2} point
   * @return {Boolean}
   * @example
   * var a = new cc.Rect(0, 0, 10, 10);
   * var b = new cc.Vec2(0, 5);
   * a.contains(b);// true
   */
  ;

  _proto.contains = function contains(point) {
    return this.x <= point.x && this.x + this.width >= point.x && this.y <= point.y && this.y + this.height >= point.y;
  }
  /**
   * !#en Returns true if the other rect totally inside this rectangle.
   * !#zh 当前矩形是否包含指定矩形。
   * @method containsRect
   * @param {Rect} rect
   * @return {Boolean}
   * @example
   * var a = new cc.Rect(0, 0, 20, 20);
   * var b = new cc.Rect(0, 0, 10, 10);
   * a.containsRect(b);// true
   */
  ;

  _proto.containsRect = function containsRect(rect) {
    return this.x <= rect.x && this.x + this.width >= rect.x + rect.width && this.y <= rect.y && this.y + this.height >= rect.y + rect.height;
  }
  /**
   * !#en Returns the smallest rectangle that contains the current rect and the given rect.
   * !#zh 返回一个包含当前矩形和指定矩形的最小矩形。
   * @method union
   * @param {Rect} out Stores the result
   * @param {Rect} rectB
   * @return {Rect} Returns the out parameter
   * @example
   * var a = new cc.Rect(0, 10, 20, 20);
   * var b = new cc.Rect(0, 10, 10, 10);
   * var union = new cc.Rect();
   * a.union(union, b); // union {x: 0, y: 10, width: 20, height: 20};
   */
  ;

  _proto.union = function union(out, rectB) {
    var ax = this.x,
        ay = this.y,
        aw = this.width,
        ah = this.height;
    var bx = rectB.x,
        by = rectB.y,
        bw = rectB.width,
        bh = rectB.height;
    out.x = Math.min(ax, bx);
    out.y = Math.min(ay, by);
    out.width = Math.max(ax + aw, bx + bw) - out.x;
    out.height = Math.max(ay + ah, by + bh) - out.y;
    return out;
  }
  /**
   * !#en Apply matrix4 to the rect.
   * !#zh 使用 mat4 对矩形进行矩阵转换。
   * @method transformMat4
   * @param out {Rect} The output rect
   * @param mat {Mat4} The matrix4
   */
  ;

  _proto.transformMat4 = function transformMat4(out, mat) {
    var ol = this.x;
    var ob = this.y;
    var or = ol + this.width;
    var ot = ob + this.height;
    var matm = mat.m;
    var lbx = matm[0] * ol + matm[4] * ob + matm[12];
    var lby = matm[1] * ol + matm[5] * ob + matm[13];
    var rbx = matm[0] * or + matm[4] * ob + matm[12];
    var rby = matm[1] * or + matm[5] * ob + matm[13];
    var ltx = matm[0] * ol + matm[4] * ot + matm[12];
    var lty = matm[1] * ol + matm[5] * ot + matm[13];
    var rtx = matm[0] * or + matm[4] * ot + matm[12];
    var rty = matm[1] * or + matm[5] * ot + matm[13];
    var minX = Math.min(lbx, rbx, ltx, rtx);
    var maxX = Math.max(lbx, rbx, ltx, rtx);
    var minY = Math.min(lby, rby, lty, rty);
    var maxY = Math.max(lby, rby, lty, rty);
    out.x = minX;
    out.y = minY;
    out.width = maxX - minX;
    out.height = maxY - minY;
    return out;
  }
  /**
   * !#en Output rect informations to string
   * !#zh 转换为方便阅读的字符串
   * @method toString
   * @return {String}
   * @example
   * var a = new cc.Rect(0, 0, 10, 10);
   * a.toString();// "(0.00, 0.00, 10.00, 10.00)";
   */
  ;

  _proto.toString = function toString() {
    return '(' + this.x.toFixed(2) + ', ' + this.y.toFixed(2) + ', ' + this.width.toFixed(2) + ', ' + this.height.toFixed(2) + ')';
  }
  /**
   * !#en The minimum x value, equals to rect.x
   * !#zh 矩形 x 轴上的最小值，等价于 rect.x。
   * @property xMin
   * @type {Number}
   */
  ;

  _createClass(Rect, [{
    key: "xMin",
    get: function get() {
      return this.x;
    },
    set: function set(v) {
      this.width += this.x - v;
      this.x = v;
    }
    /**
    * !#en The minimum y value, equals to rect.y
    * !#zh 矩形 y 轴上的最小值。
    * @property yMin
    * @type {Number}
    */

  }, {
    key: "yMin",
    get: function get() {
      return this.y;
    },
    set: function set(v) {
      this.height += this.y - v;
      this.y = v;
    }
    /**
    * !#en The maximum x value.
    * !#zh 矩形 x 轴上的最大值。
    * @property xMax
    * @type {Number}
    */

  }, {
    key: "xMax",
    get: function get() {
      return this.x + this.width;
    },
    set: function set(value) {
      this.width = value - this.x;
    }
    /**
    * !#en The maximum y value.
    * !#zh 矩形 y 轴上的最大值。
    * @property yMax
    * @type {Number}
    */

  }, {
    key: "yMax",
    get: function get() {
      return this.y + this.height;
    },
    set: function set(value) {
      this.height = value - this.y;
    }
    /**
    * !#en The position of the center of the rectangle.
    * !#zh 矩形的中心点。
    * @property {Vec2} center
    */

  }, {
    key: "center",
    get: function get() {
      return new _vec["default"](this.x + this.width * 0.5, this.y + this.height * 0.5);
    },
    set: function set(value) {
      this.x = value.x - this.width * 0.5;
      this.y = value.y - this.height * 0.5;
    }
    /**
    * !#en The X and Y position of the rectangle.
    * !#zh 矩形的 x 和 y 坐标。
    * @property {Vec2} origin
    */

  }, {
    key: "origin",
    get: function get() {
      return new _vec["default"](this.x, this.y);
    },
    set: function set(value) {
      this.x = value.x;
      this.y = value.y;
    }
    /**
    * !#en Width and height of the rectangle.
    * !#zh 矩形的大小。
    * @property {Size} size
    */

  }, {
    key: "size",
    get: function get() {
      return new _size["default"](this.width, this.height);
    },
    set: function set(value) {
      this.width = value.width;
      this.height = value.height;
    }
  }]);

  return Rect;
}(_valueType["default"]);

exports["default"] = Rect;

_CCClass["default"].fastDefine('cc.Rect', Rect, {
  x: 0,
  y: 0,
  width: 0,
  height: 0
});

cc.Rect = Rect;
/**
 * @module cc
 */

/**
 * !#en
 * The convenience method to create a new Rect.
 * see {{#crossLink "Rect/Rect:method"}}cc.Rect{{/crossLink}}
 * !#zh
 * 该方法用来快速创建一个新的矩形。{{#crossLink "Rect/Rect:method"}}cc.Rect{{/crossLink}}
 * @method rect
 * @param {Number} [x=0]
 * @param {Number} [y=0]
 * @param {Number} [w=0]
 * @param {Number} [h=0]
 * @return {Rect}
 * @example
 * var a = new cc.Rect(0 , 0, 10, 0);
 */

cc.rect = function rect(x, y, w, h) {
  return new Rect(x, y, w, h);
};

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlY3QudHMiXSwibmFtZXMiOlsiUmVjdCIsImZyb21NaW5NYXgiLCJ2MSIsInYyIiwibWluX3giLCJNYXRoIiwibWluIiwieCIsIm1pbl95IiwieSIsIm1heF94IiwibWF4IiwibWF4X3kiLCJ3IiwiaCIsIndpZHRoIiwiaGVpZ2h0IiwiY2xvbmUiLCJlcXVhbHMiLCJvdGhlciIsImxlcnAiLCJ0byIsInJhdGlvIiwib3V0Iiwic2V0Iiwic291cmNlIiwiaW50ZXJzZWN0cyIsInJlY3QiLCJtYXhheCIsIm1heGF5IiwibWF4YngiLCJtYXhieSIsImludGVyc2VjdGlvbiIsInJlY3RCIiwiYXhNaW4iLCJheU1pbiIsImF4TWF4IiwiYXlNYXgiLCJieE1pbiIsImJ5TWluIiwiYnhNYXgiLCJieU1heCIsImNvbnRhaW5zIiwicG9pbnQiLCJjb250YWluc1JlY3QiLCJ1bmlvbiIsImF4IiwiYXkiLCJhdyIsImFoIiwiYngiLCJieSIsImJ3IiwiYmgiLCJ0cmFuc2Zvcm1NYXQ0IiwibWF0Iiwib2wiLCJvYiIsIm9yIiwib3QiLCJtYXRtIiwibSIsImxieCIsImxieSIsInJieCIsInJieSIsImx0eCIsImx0eSIsInJ0eCIsInJ0eSIsIm1pblgiLCJtYXhYIiwibWluWSIsIm1heFkiLCJ0b1N0cmluZyIsInRvRml4ZWQiLCJ2IiwidmFsdWUiLCJWZWMyIiwiU2l6ZSIsIlZhbHVlVHlwZSIsIkNDQ2xhc3MiLCJmYXN0RGVmaW5lIiwiY2MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkE7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7QUFFQTs7Ozs7OztBQU1BOzs7Ozs7Ozs7Ozs7O0lBYXFCQTs7Ozs7QUFFakI7Ozs7Ozs7Ozs7O09BV09DLGFBQVAsb0JBQW1CQyxFQUFuQixFQUE2QkMsRUFBN0IsRUFBdUM7QUFDbkMsUUFBSUMsS0FBSyxHQUFHQyxJQUFJLENBQUNDLEdBQUwsQ0FBU0osRUFBRSxDQUFDSyxDQUFaLEVBQWVKLEVBQUUsQ0FBQ0ks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LEtBQUtDLE1BQTFCLENBQVA7QUFDSDtzQkFDUzZELE9BQU87QUFDYixXQUFLOUQsS0FBTCxHQUFhOEQsS0FBSyxDQUFDOUQsS0FBbkI7QUFDQSxXQUFLQyxNQUFMLEdBQWM2RCxLQUFLLENBQUM3RCxNQUFwQjtBQUNIOzs7O0VBL1c2QmdFOzs7O0FBa1hsQ0Msb0JBQVFDLFVBQVIsQ0FBbUIsU0FBbkIsRUFBOEJsRixJQUE5QixFQUFvQztBQUFFTyxFQUFBQSxDQUFDLEVBQUUsQ0FBTDtBQUFRRSxFQUFBQSxDQUFDLEVBQUUsQ0FBWDtBQUFjTSxFQUFBQSxLQUFLLEVBQUUsQ0FBckI7QUFBd0JDLEVBQUFBLE1BQU0sRUFBRTtBQUFoQyxDQUFwQzs7QUFDQW1FLEVBQUUsQ0FBQ25GLElBQUgsR0FBVUEsSUFBVjtBQUdBOzs7O0FBSUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlQW1GLEVBQUUsQ0FBQ3hELElBQUgsR0FBVSxTQUFTQSxJQUFULENBQWVwQixDQUFmLEVBQWtCRSxDQUFsQixFQUFxQkksQ0FBckIsRUFBd0JDLENBQXhCLEVBQTJCO0FBQ2pDLFNBQU8sSUFBSWQsSUFBSixDQUFTTyxDQUFULEVBQVlFLENBQVosRUFBZUksQ0FBZixFQUFrQkMsQ0FBbEIsQ0FBUDtBQUNILENBRkQiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCBWYWx1ZVR5cGUgZnJvbSAnLi92YWx1ZS10eXBlJztcbmltcG9ydCBDQ0NsYXNzIGZyb20gJy4uL3BsYXRmb3JtL0NDQ2xhc3MnO1xuaW1wb3J0IFZlYzIgZnJvbSAnLi92ZWMyJztcbmltcG9ydCBNYXQ0IGZyb20gJy4vbWF0NCc7XG5pbXBvcnQgU2l6ZSBmcm9tICcuL3NpemUnO1xuXG4vKipcbiAqICEjZW4gQSAyRCByZWN0YW5nbGUgZGVmaW5lZCBieSB4LCB5IHBvc2l0aW9uIGFuZCB3aWR0aCwgaGVpZ2h0LlxuICogISN6aCDpgJrov4fkvY3nva7lkozlrr3pq5jlrprkuYnnmoQgMkQg55+p5b2i44CCXG4gKiBAY2xhc3MgUmVjdFxuICogQGV4dGVuZHMgVmFsdWVUeXBlXG4gKi9cbi8qKlxuICogISNlblxuICogQ29uc3RydWN0b3Igb2YgUmVjdCBjbGFzcy5cbiAqIHNlZSB7eyNjcm9zc0xpbmsgXCJjYy9yZWN0Om1ldGhvZFwifX0gY2MucmVjdCB7ey9jcm9zc0xpbmt9fSBmb3IgY29udmVuaWVuY2UgbWV0aG9kLlxuICogISN6aFxuICogUmVjdOexu+eahOaehOmAoOWHveaVsOOAguWPr+S7pemAmui/hyB7eyNjcm9zc0xpbmsgXCJjYy9yZWN0Om1ldGhvZFwifX0gY2MucmVjdCB7ey9jcm9zc0xpbmt9fSDnroDkvr/mlrnms5Xov5vooYzliJvlu7rjgIJcbiAqXG4gKiBAbWV0aG9kIGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge051bWJlcn0gW3g9MF1cbiAqIEBwYXJhbSB7TnVtYmVyfSBbeT0wXVxuICogQHBhcmFtIHtOdW1iZXJ9IFt3PTBdXG4gKiBAcGFyYW0ge051bWJlcn0gW2g9MF1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjdCBleHRlbmRzIFZhbHVlVHlwZSB7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENyZWF0ZXMgYSByZWN0YW5nbGUgZnJvbSB0d28gY29vcmRpbmF0ZSB2YWx1ZXMuXG4gICAgICogISN6aCDmoLnmja7mjIflrpogMiDkuKrlnZDmoIfliJvlu7rlh7rkuIDkuKrnn6nlvaLljLrln5/jgIJcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1ldGhvZCBmcm9tTWluTWF4XG4gICAgICogQHBhcmFtIHtWZWMyfSB2MVxuICAgICAqIEBwYXJhbSB7VmVjMn0gdjJcbiAgICAgKiBAcmV0dXJuIHtSZWN0fVxuICAgICAqIEBleGFtcGxlXG4gICAgICogY2MuUmVjdC5mcm9tTWluTWF4KGNjLnYyKDEwLCAxMCksIGNjLnYyKDIwLCAyMCkpOyAvLyBSZWN0IHt4OiAxMCwgeTogMTAsIHdpZHRoOiAxMCwgaGVpZ2h0OiAxMH07XG4gICAgICovXG4gICAgc3RhdGljIGZyb21NaW5NYXggKHYxOiBWZWMyLCB2MjogVmVjMikge1xuICAgICAgICB2YXIgbWluX3ggPSBNYXRoLm1pbih2MS54LCB2Mi54KTtcbiAgICAgICAgdmFyIG1pbl95ID0gTWF0aC5taW4odjEueSwgdjIueSk7XG4gICAgICAgIHZhciBtYXhfeCA9IE1hdGgubWF4KHYxLngsIHYyLngpO1xuICAgICAgICB2YXIgbWF4X3kgPSBNYXRoLm1heCh2MS55LCB2Mi55KTtcblxuICAgICAgICByZXR1cm4gbmV3IFJlY3QobWluX3gsIG1pbl95LCBtYXhfeCAtIG1pbl94LCBtYXhfeSAtIG1pbl95KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0geFxuICAgICAqL1xuICAgIHg6IG51bWJlcjtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0geVxuICAgICAqL1xuICAgIHk6IG51bWJlcjtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gd2lkdGhcbiAgICAgKi9cbiAgICB3aWR0aDogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBoZWlnaHRcbiAgICAgKi9cbiAgICBoZWlnaHQ6IG51bWJlcjtcbiAgICBjb25zdHJ1Y3RvciAoeDogUmVjdCB8IG51bWJlciA9IDAsIHk6IG51bWJlciA9IDAsIHc6IG51bWJlciA9IDAsIGg6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgaWYgKHggJiYgdHlwZW9mIHggPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB5ID0geC55O1xuICAgICAgICAgICAgdyA9IHgud2lkdGg7XG4gICAgICAgICAgICBoID0geC5oZWlnaHQ7XG4gICAgICAgICAgICB4ID0geC54O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMueCA9IHggYXMgbnVtYmVyIHx8IDA7XG4gICAgICAgIHRoaXMueSA9IHkgfHwgMDtcbiAgICAgICAgdGhpcy53aWR0aCA9IHcgfHwgMDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoIHx8IDA7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRPRE9cbiAgICAgKiAhI3poIOWFi+mahuS4gOS4quaWsOeahCBSZWN044CCXG4gICAgICogQG1ldGhvZCBjbG9uZVxuICAgICAqIEByZXR1cm4ge1JlY3R9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgYSA9IG5ldyBjYy5SZWN0KDAsIDAsIDEwLCAxMCk7XG4gICAgICogYS5jbG9uZSgpOy8vIFJlY3Qge3g6IDAsIHk6IDAsIHdpZHRoOiAxMCwgaGVpZ2h0OiAxMH1cbiAgICAgKi9cbiAgICBjbG9uZSAoKTogUmVjdCB7XG4gICAgICAgIHJldHVybiBuZXcgUmVjdCh0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gVE9ET1xuICAgICAqICEjemgg5piv5ZCm562J5LqO5oyH5a6a55qE55+p5b2i44CCXG4gICAgICogQG1ldGhvZCBlcXVhbHNcbiAgICAgKiBAcGFyYW0ge1JlY3R9IG90aGVyXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBhID0gbmV3IGNjLlJlY3QoMCwgMCwgMTAsIDEwKTtcbiAgICAgKiB2YXIgYiA9IG5ldyBjYy5SZWN0KDAsIDAsIDEwLCAxMCk7XG4gICAgICogYS5lcXVhbHMoYik7Ly8gdHJ1ZTtcbiAgICAgKi9cbiAgICBlcXVhbHMgKG90aGVyOiBSZWN0KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBvdGhlciAmJlxuICAgICAgICAgICAgdGhpcy54ID09PSBvdGhlci54ICYmXG4gICAgICAgICAgICB0aGlzLnkgPT09IG90aGVyLnkgJiZcbiAgICAgICAgICAgIHRoaXMud2lkdGggPT09IG90aGVyLndpZHRoICYmXG4gICAgICAgICAgICB0aGlzLmhlaWdodCA9PT0gb3RoZXIuaGVpZ2h0O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRPRE9cbiAgICAgKiAhI3poIOe6v+aAp+aPkuWAvFxuICAgICAqIEBtZXRob2QgbGVycFxuICAgICAqIEBwYXJhbSB7UmVjdH0gdG9cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcmF0aW8gLSB0aGUgaW50ZXJwb2xhdGlvbiBjb2VmZmljaWVudC5cbiAgICAgKiBAcGFyYW0ge1JlY3R9IFtvdXRdIC0gb3B0aW9uYWwsIHRoZSByZWNlaXZpbmcgdmVjdG9yLlxuICAgICAqIEByZXR1cm4ge1JlY3R9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgYSA9IG5ldyBjYy5SZWN0KDAsIDAsIDEwLCAxMCk7XG4gICAgICogdmFyIGIgPSBuZXcgY2MuUmVjdCg1MCwgNTAsIDEwMCwgMTAwKTtcbiAgICAgKiB1cGRhdGUgKGR0KSB7XG4gICAgICogICAgLy8gbWV0aG9kIDE7XG4gICAgICogICAgdmFyIGMgPSBhLmxlcnAoYiwgZHQgKiAwLjEpO1xuICAgICAqICAgIC8vIG1ldGhvZCAyO1xuICAgICAqICAgIGEubGVycChiLCBkdCAqIDAuMSwgYyk7XG4gICAgICogfVxuICAgICAqL1xuICAgIGxlcnAgKHRvOiBSZWN0LCByYXRpbzogbnVtYmVyLCBvdXQ/OiBSZWN0KTogUmVjdCB7XG4gICAgICAgIG91dCA9IG91dCB8fCBuZXcgUmVjdCgpO1xuICAgICAgICB2YXIgeCA9IHRoaXMueDtcbiAgICAgICAgdmFyIHkgPSB0aGlzLnk7XG4gICAgICAgIHZhciB3aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgIHZhciBoZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICAgICAgb3V0LnggPSB4ICsgKHRvLnggLSB4KSAqIHJhdGlvO1xuICAgICAgICBvdXQueSA9IHkgKyAodG8ueSAtIHkpICogcmF0aW87XG4gICAgICAgIG91dC53aWR0aCA9IHdpZHRoICsgKHRvLndpZHRoIC0gd2lkdGgpICogcmF0aW87XG4gICAgICAgIG91dC5oZWlnaHQgPSBoZWlnaHQgKyAodG8uaGVpZ2h0IC0gaGVpZ2h0KSAqIHJhdGlvO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH07XG5cbiAgICBzZXQgKHNvdXJjZTogUmVjdCk6IFJlY3Qge1xuICAgICAgICB0aGlzLnggPSBzb3VyY2UueDtcbiAgICAgICAgdGhpcy55ID0gc291cmNlLnk7XG4gICAgICAgIHRoaXMud2lkdGggPSBzb3VyY2Uud2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gc291cmNlLmhlaWdodDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBDaGVjayB3aGV0aGVyIHRoZSBjdXJyZW50IHJlY3RhbmdsZSBpbnRlcnNlY3RzIHdpdGggdGhlIGdpdmVuIG9uZVxuICAgICAqICEjemgg5b2T5YmN55+p5b2i5LiO5oyH5a6a55+p5b2i5piv5ZCm55u45Lqk44CCXG4gICAgICogQG1ldGhvZCBpbnRlcnNlY3RzXG4gICAgICogQHBhcmFtIHtSZWN0fSByZWN0XG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBhID0gbmV3IGNjLlJlY3QoMCwgMCwgMTAsIDEwKTtcbiAgICAgKiB2YXIgYiA9IG5ldyBjYy5SZWN0KDAsIDAsIDIwLCAyMCk7XG4gICAgICogYS5pbnRlcnNlY3RzKGIpOy8vIHRydWVcbiAgICAgKi9cbiAgICBpbnRlcnNlY3RzIChyZWN0OiBSZWN0KTogYm9vbGVhbiB7XG4gICAgICAgIHZhciBtYXhheCA9IHRoaXMueCArIHRoaXMud2lkdGgsXG4gICAgICAgICAgICBtYXhheSA9IHRoaXMueSArIHRoaXMuaGVpZ2h0LFxuICAgICAgICAgICAgbWF4YnggPSByZWN0LnggKyByZWN0LndpZHRoLFxuICAgICAgICAgICAgbWF4YnkgPSByZWN0LnkgKyByZWN0LmhlaWdodDtcbiAgICAgICAgcmV0dXJuICEobWF4YXggPCByZWN0LnggfHwgbWF4YnggPCB0aGlzLnggfHwgbWF4YXkgPCByZWN0LnkgfHwgbWF4YnkgPCB0aGlzLnkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB0aGUgb3ZlcmxhcHBpbmcgcG9ydGlvbiBvZiAyIHJlY3RhbmdsZXMuXG4gICAgICogISN6aCDov5Tlm54gMiDkuKrnn6nlvaLph43lj6DnmoTpg6jliIbjgIJcbiAgICAgKiBAbWV0aG9kIGludGVyc2VjdGlvblxuICAgICAqIEBwYXJhbSB7UmVjdH0gb3V0IFN0b3JlcyB0aGUgcmVzdWx0XG4gICAgICogQHBhcmFtIHtSZWN0fSByZWN0QlxuICAgICAqIEByZXR1cm4ge1JlY3R9IFJldHVybnMgdGhlIG91dCBwYXJhbWV0ZXJcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBhID0gbmV3IGNjLlJlY3QoMCwgMTAsIDIwLCAyMCk7XG4gICAgICogdmFyIGIgPSBuZXcgY2MuUmVjdCgwLCAxMCwgMTAsIDEwKTtcbiAgICAgKiB2YXIgaW50ZXJzZWN0aW9uID0gbmV3IGNjLlJlY3QoKTtcbiAgICAgKiBhLmludGVyc2VjdGlvbihpbnRlcnNlY3Rpb24sIGIpOyAvLyBpbnRlcnNlY3Rpb24ge3g6IDAsIHk6IDEwLCB3aWR0aDogMTAsIGhlaWdodDogMTB9O1xuICAgICAqL1xuICAgIGludGVyc2VjdGlvbiAob3V0OiBSZWN0LCByZWN0QjogUmVjdCk6IFJlY3Qge1xuICAgICAgICB2YXIgYXhNaW4gPSB0aGlzLngsIGF5TWluID0gdGhpcy55LCBheE1heCA9IHRoaXMueCArIHRoaXMud2lkdGgsIGF5TWF4ID0gdGhpcy55ICsgdGhpcy5oZWlnaHQ7XG4gICAgICAgIHZhciBieE1pbiA9IHJlY3RCLngsIGJ5TWluID0gcmVjdEIueSwgYnhNYXggPSByZWN0Qi54ICsgcmVjdEIud2lkdGgsIGJ5TWF4ID0gcmVjdEIueSArIHJlY3RCLmhlaWdodDtcbiAgICAgICAgb3V0LnggPSBNYXRoLm1heChheE1pbiwgYnhNaW4pO1xuICAgICAgICBvdXQueSA9IE1hdGgubWF4KGF5TWluLCBieU1pbik7XG4gICAgICAgIG91dC53aWR0aCA9IE1hdGgubWluKGF4TWF4LCBieE1heCkgLSBvdXQueDtcbiAgICAgICAgb3V0LmhlaWdodCA9IE1hdGgubWluKGF5TWF4LCBieU1heCkgLSBvdXQueTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENoZWNrIHdoZXRoZXIgdGhlIGN1cnJlbnQgcmVjdCBjb250YWlucyB0aGUgZ2l2ZW4gcG9pbnRcbiAgICAgKiAhI3poIOW9k+WJjeefqeW9ouaYr+WQpuWMheWQq+aMh+WumuWdkOagh+eCueOAglxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgcG9pbnQgaW5zaWRlIHRoaXMgcmVjdGFuZ2xlLlxuICAgICAqIEBtZXRob2QgY29udGFpbnNcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IHBvaW50XG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBhID0gbmV3IGNjLlJlY3QoMCwgMCwgMTAsIDEwKTtcbiAgICAgKiB2YXIgYiA9IG5ldyBjYy5WZWMyKDAsIDUpO1xuICAgICAqIGEuY29udGFpbnMoYik7Ly8gdHJ1ZVxuICAgICAqL1xuICAgIGNvbnRhaW5zIChwb2ludDogVmVjMik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKHRoaXMueCA8PSBwb2ludC54ICYmXG4gICAgICAgICAgICB0aGlzLnggKyB0aGlzLndpZHRoID49IHBvaW50LnggJiZcbiAgICAgICAgICAgIHRoaXMueSA8PSBwb2ludC55ICYmXG4gICAgICAgICAgICB0aGlzLnkgKyB0aGlzLmhlaWdodCA+PSBwb2ludC55KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgdHJ1ZSBpZiB0aGUgb3RoZXIgcmVjdCB0b3RhbGx5IGluc2lkZSB0aGlzIHJlY3RhbmdsZS5cbiAgICAgKiAhI3poIOW9k+WJjeefqeW9ouaYr+WQpuWMheWQq+aMh+WumuefqeW9ouOAglxuICAgICAqIEBtZXRob2QgY29udGFpbnNSZWN0XG4gICAgICogQHBhcmFtIHtSZWN0fSByZWN0XG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBhID0gbmV3IGNjLlJlY3QoMCwgMCwgMjAsIDIwKTtcbiAgICAgKiB2YXIgYiA9IG5ldyBjYy5SZWN0KDAsIDAsIDEwLCAxMCk7XG4gICAgICogYS5jb250YWluc1JlY3QoYik7Ly8gdHJ1ZVxuICAgICAqL1xuICAgIGNvbnRhaW5zUmVjdCAocmVjdDogUmVjdCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKHRoaXMueCA8PSByZWN0LnggJiZcbiAgICAgICAgICAgIHRoaXMueCArIHRoaXMud2lkdGggPj0gcmVjdC54ICsgcmVjdC53aWR0aCAmJlxuICAgICAgICAgICAgdGhpcy55IDw9IHJlY3QueSAmJlxuICAgICAgICAgICAgdGhpcy55ICsgdGhpcy5oZWlnaHQgPj0gcmVjdC55ICsgcmVjdC5oZWlnaHQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB0aGUgc21hbGxlc3QgcmVjdGFuZ2xlIHRoYXQgY29udGFpbnMgdGhlIGN1cnJlbnQgcmVjdCBhbmQgdGhlIGdpdmVuIHJlY3QuXG4gICAgICogISN6aCDov5Tlm57kuIDkuKrljIXlkKvlvZPliY3nn6nlvaLlkozmjIflrprnn6nlvaLnmoTmnIDlsI/nn6nlvaLjgIJcbiAgICAgKiBAbWV0aG9kIHVuaW9uXG4gICAgICogQHBhcmFtIHtSZWN0fSBvdXQgU3RvcmVzIHRoZSByZXN1bHRcbiAgICAgKiBAcGFyYW0ge1JlY3R9IHJlY3RCXG4gICAgICogQHJldHVybiB7UmVjdH0gUmV0dXJucyB0aGUgb3V0IHBhcmFtZXRlclxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIGEgPSBuZXcgY2MuUmVjdCgwLCAxMCwgMjAsIDIwKTtcbiAgICAgKiB2YXIgYiA9IG5ldyBjYy5SZWN0KDAsIDEwLCAxMCwgMTApO1xuICAgICAqIHZhciB1bmlvbiA9IG5ldyBjYy5SZWN0KCk7XG4gICAgICogYS51bmlvbih1bmlvbiwgYik7IC8vIHVuaW9uIHt4OiAwLCB5OiAxMCwgd2lkdGg6IDIwLCBoZWlnaHQ6IDIwfTtcbiAgICAgKi9cbiAgICB1bmlvbiAob3V0OiBSZWN0LCByZWN0QjogUmVjdCk6IFJlY3Qge1xuICAgICAgICB2YXIgYXggPSB0aGlzLngsIGF5ID0gdGhpcy55LCBhdyA9IHRoaXMud2lkdGgsIGFoID0gdGhpcy5oZWlnaHQ7XG4gICAgICAgIHZhciBieCA9IHJlY3RCLngsIGJ5ID0gcmVjdEIueSwgYncgPSByZWN0Qi53aWR0aCwgYmggPSByZWN0Qi5oZWlnaHQ7XG4gICAgICAgIG91dC54ID0gTWF0aC5taW4oYXgsIGJ4KTtcbiAgICAgICAgb3V0LnkgPSBNYXRoLm1pbihheSwgYnkpO1xuICAgICAgICBvdXQud2lkdGggPSBNYXRoLm1heChheCArIGF3LCBieCArIGJ3KSAtIG91dC54O1xuICAgICAgICBvdXQuaGVpZ2h0ID0gTWF0aC5tYXgoYXkgKyBhaCwgYnkgKyBiaCkgLSBvdXQueTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEFwcGx5IG1hdHJpeDQgdG8gdGhlIHJlY3QuXG4gICAgICogISN6aCDkvb/nlKggbWF0NCDlr7nnn6nlvaLov5vooYznn6npmLXovazmjaLjgIJcbiAgICAgKiBAbWV0aG9kIHRyYW5zZm9ybU1hdDRcbiAgICAgKiBAcGFyYW0gb3V0IHtSZWN0fSBUaGUgb3V0cHV0IHJlY3RcbiAgICAgKiBAcGFyYW0gbWF0IHtNYXQ0fSBUaGUgbWF0cml4NFxuICAgICAqL1xuICAgIHRyYW5zZm9ybU1hdDQgKG91dDogUmVjdCwgbWF0OiBNYXQ0KTogUmVjdCB7XG4gICAgICAgIGxldCBvbCA9IHRoaXMueDtcbiAgICAgICAgbGV0IG9iID0gdGhpcy55O1xuICAgICAgICBsZXQgb3IgPSBvbCArIHRoaXMud2lkdGg7XG4gICAgICAgIGxldCBvdCA9IG9iICsgdGhpcy5oZWlnaHQ7XG4gICAgICAgIGxldCBtYXRtID0gbWF0Lm07XG4gICAgICAgIGxldCBsYnggPSBtYXRtWzBdICogb2wgKyBtYXRtWzRdICogb2IgKyBtYXRtWzEyXTtcbiAgICAgICAgbGV0IGxieSA9IG1hdG1bMV0gKiBvbCArIG1hdG1bNV0gKiBvYiArIG1hdG1bMTNdO1xuICAgICAgICBsZXQgcmJ4ID0gbWF0bVswXSAqIG9yICsgbWF0bVs0XSAqIG9iICsgbWF0bVsxMl07XG4gICAgICAgIGxldCByYnkgPSBtYXRtWzFdICogb3IgKyBtYXRtWzVdICogb2IgKyBtYXRtWzEzXTtcbiAgICAgICAgbGV0IGx0eCA9IG1hdG1bMF0gKiBvbCArIG1hdG1bNF0gKiBvdCArIG1hdG1bMTJdO1xuICAgICAgICBsZXQgbHR5ID0gbWF0bVsxXSAqIG9sICsgbWF0bVs1XSAqIG90ICsgbWF0bVsxM107XG4gICAgICAgIGxldCBydHggPSBtYXRtWzBdICogb3IgKyBtYXRtWzRdICogb3QgKyBtYXRtWzEyXTtcbiAgICAgICAgbGV0IHJ0eSA9IG1hdG1bMV0gKiBvciArIG1hdG1bNV0gKiBvdCArIG1hdG1bMTNdO1xuXG4gICAgICAgIGxldCBtaW5YID0gTWF0aC5taW4obGJ4LCByYngsIGx0eCwgcnR4KTtcbiAgICAgICAgbGV0IG1heFggPSBNYXRoLm1heChsYngsIHJieCwgbHR4LCBydHgpO1xuICAgICAgICBsZXQgbWluWSA9IE1hdGgubWluKGxieSwgcmJ5LCBsdHksIHJ0eSk7XG4gICAgICAgIGxldCBtYXhZID0gTWF0aC5tYXgobGJ5LCByYnksIGx0eSwgcnR5KTtcblxuICAgICAgICBvdXQueCA9IG1pblg7XG4gICAgICAgIG91dC55ID0gbWluWTtcbiAgICAgICAgb3V0LndpZHRoID0gbWF4WCAtIG1pblg7XG4gICAgICAgIG91dC5oZWlnaHQgPSBtYXhZIC0gbWluWTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIE91dHB1dCByZWN0IGluZm9ybWF0aW9ucyB0byBzdHJpbmdcbiAgICAgKiAhI3poIOi9rOaNouS4uuaWueS+v+mYheivu+eahOWtl+espuS4slxuICAgICAqIEBtZXRob2QgdG9TdHJpbmdcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgYSA9IG5ldyBjYy5SZWN0KDAsIDAsIDEwLCAxMCk7XG4gICAgICogYS50b1N0cmluZygpOy8vIFwiKDAuMDAsIDAuMDAsIDEwLjAwLCAxMC4wMClcIjtcbiAgICAgKi9cbiAgICB0b1N0cmluZyAoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICcoJyArIHRoaXMueC50b0ZpeGVkKDIpICsgJywgJyArIHRoaXMueS50b0ZpeGVkKDIpICsgJywgJyArIHRoaXMud2lkdGgudG9GaXhlZCgyKSArXG4gICAgICAgICAgICAnLCAnICsgdGhpcy5oZWlnaHQudG9GaXhlZCgyKSArICcpJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBtaW5pbXVtIHggdmFsdWUsIGVxdWFscyB0byByZWN0LnhcbiAgICAgKiAhI3poIOefqeW9oiB4IOi9tOS4iueahOacgOWwj+WAvO+8jOetieS7t+S6jiByZWN0LnjjgIJcbiAgICAgKiBAcHJvcGVydHkgeE1pblxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0IHhNaW4gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy54O1xuICAgIH1cbiAgICBzZXQgeE1pbiAodikge1xuICAgICAgICB0aGlzLndpZHRoICs9IHRoaXMueCAtIHY7XG4gICAgICAgIHRoaXMueCA9IHY7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiAhI2VuIFRoZSBtaW5pbXVtIHkgdmFsdWUsIGVxdWFscyB0byByZWN0LnlcbiAgICAqICEjemgg55+p5b2iIHkg6L205LiK55qE5pyA5bCP5YC844CCXG4gICAgKiBAcHJvcGVydHkgeU1pblxuICAgICogQHR5cGUge051bWJlcn1cbiAgICAqL1xuICAgIGdldCB5TWluICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueTtcbiAgICB9XG4gICAgc2V0IHlNaW4gKHYpIHtcbiAgICAgICAgdGhpcy5oZWlnaHQgKz0gdGhpcy55IC0gdjtcbiAgICAgICAgdGhpcy55ID0gdjtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICogISNlbiBUaGUgbWF4aW11bSB4IHZhbHVlLlxuICAgICogISN6aCDnn6nlvaIgeCDovbTkuIrnmoTmnIDlpKflgLzjgIJcbiAgICAqIEBwcm9wZXJ0eSB4TWF4XG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICovXG4gICAgZ2V0IHhNYXggKCkge1xuICAgICAgICByZXR1cm4gdGhpcy54ICsgdGhpcy53aWR0aDtcbiAgICB9XG4gICAgc2V0IHhNYXggKHZhbHVlKSB7XG4gICAgICAgIHRoaXMud2lkdGggPSB2YWx1ZSAtIHRoaXMueDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAqICEjZW4gVGhlIG1heGltdW0geSB2YWx1ZS5cbiAgICAqICEjemgg55+p5b2iIHkg6L205LiK55qE5pyA5aSn5YC844CCXG4gICAgKiBAcHJvcGVydHkgeU1heFxuICAgICogQHR5cGUge051bWJlcn1cbiAgICAqL1xuICAgIGdldCB5TWF4ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueSArIHRoaXMuaGVpZ2h0O1xuICAgIH1cbiAgICBzZXQgeU1heCAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSB2YWx1ZSAtIHRoaXMueTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAqICEjZW4gVGhlIHBvc2l0aW9uIG9mIHRoZSBjZW50ZXIgb2YgdGhlIHJlY3RhbmdsZS5cbiAgICAqICEjemgg55+p5b2i55qE5Lit5b+D54K544CCXG4gICAgKiBAcHJvcGVydHkge1ZlYzJ9IGNlbnRlclxuICAgICovXG4gICAgZ2V0IGNlbnRlciAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLnggKyB0aGlzLndpZHRoICogMC41LFxuICAgICAgICAgICAgdGhpcy55ICsgdGhpcy5oZWlnaHQgKiAwLjUpO1xuICAgIH1cbiAgICBzZXQgY2VudGVyICh2YWx1ZSkge1xuICAgICAgICB0aGlzLnggPSB2YWx1ZS54IC0gdGhpcy53aWR0aCAqIDAuNTtcbiAgICAgICAgdGhpcy55ID0gdmFsdWUueSAtIHRoaXMuaGVpZ2h0ICogMC41O1xuICAgIH1cblxuICAgIC8qKlxuICAgICogISNlbiBUaGUgWCBhbmQgWSBwb3NpdGlvbiBvZiB0aGUgcmVjdGFuZ2xlLlxuICAgICogISN6aCDnn6nlvaLnmoQgeCDlkowgeSDlnZDmoIfjgIJcbiAgICAqIEBwcm9wZXJ0eSB7VmVjMn0gb3JpZ2luXG4gICAgKi9cbiAgICBnZXQgb3JpZ2luICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCwgdGhpcy55KTtcbiAgICB9XG4gICAgc2V0IG9yaWdpbiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy54ID0gdmFsdWUueDtcbiAgICAgICAgdGhpcy55ID0gdmFsdWUueTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAqICEjZW4gV2lkdGggYW5kIGhlaWdodCBvZiB0aGUgcmVjdGFuZ2xlLlxuICAgICogISN6aCDnn6nlvaLnmoTlpKflsI/jgIJcbiAgICAqIEBwcm9wZXJ0eSB7U2l6ZX0gc2l6ZVxuICAgICovXG4gICAgZ2V0IHNpemUgKCkge1xuICAgICAgICByZXR1cm4gbmV3IFNpemUodGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgIH1cbiAgICBzZXQgc2l6ZSAodmFsdWUpIHtcbiAgICAgICAgdGhpcy53aWR0aCA9IHZhbHVlLndpZHRoO1xuICAgICAgICB0aGlzLmhlaWdodCA9IHZhbHVlLmhlaWdodDtcbiAgICB9XG59XG5cbkNDQ2xhc3MuZmFzdERlZmluZSgnY2MuUmVjdCcsIFJlY3QsIHsgeDogMCwgeTogMCwgd2lkdGg6IDAsIGhlaWdodDogMCB9KTtcbmNjLlJlY3QgPSBSZWN0O1xuXG5cbi8qKlxuICogQG1vZHVsZSBjY1xuICovXG5cbi8qKlxuICogISNlblxuICogVGhlIGNvbnZlbmllbmNlIG1ldGhvZCB0byBjcmVhdGUgYSBuZXcgUmVjdC5cbiAqIHNlZSB7eyNjcm9zc0xpbmsgXCJSZWN0L1JlY3Q6bWV0aG9kXCJ9fWNjLlJlY3R7ey9jcm9zc0xpbmt9fVxuICogISN6aFxuICog6K+l5pa55rOV55So5p2l5b+r6YCf5Yib5bu65LiA5Liq5paw55qE55+p5b2i44CCe3sjY3Jvc3NMaW5rIFwiUmVjdC9SZWN0Om1ldGhvZFwifX1jYy5SZWN0e3svY3Jvc3NMaW5rfX1cbiAqIEBtZXRob2QgcmVjdFxuICogQHBhcmFtIHtOdW1iZXJ9IFt4PTBdXG4gKiBAcGFyYW0ge051bWJlcn0gW3k9MF1cbiAqIEBwYXJhbSB7TnVtYmVyfSBbdz0wXVxuICogQHBhcmFtIHtOdW1iZXJ9IFtoPTBdXG4gKiBAcmV0dXJuIHtSZWN0fVxuICogQGV4YW1wbGVcbiAqIHZhciBhID0gbmV3IGNjLlJlY3QoMCAsIDAsIDEwLCAwKTtcbiAqL1xuY2MucmVjdCA9IGZ1bmN0aW9uIHJlY3QgKHgsIHksIHcsIGgpIHtcbiAgICByZXR1cm4gbmV3IFJlY3QoeCwgeSwgdywgaCk7XG59O1xuIl19