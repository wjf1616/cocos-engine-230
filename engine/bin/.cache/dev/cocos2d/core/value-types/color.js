
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/value-types/color.js';
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

var _misc = _interopRequireDefault(require("../utils/misc"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * !#en
 * Representation of RGBA colors.
 *
 * Each color component is a floating point value with a range from 0 to 255.
 *
 * You can also use the convenience method {{#crossLink "cc/color:method"}}cc.color{{/crossLink}} to create a new Color.
 *
 * !#zh
 * cc.Color 用于表示颜色。
 *
 * 它包含 RGBA 四个以浮点数保存的颜色分量，每个的值都在 0 到 255 之间。
 *
 * 您也可以通过使用 {{#crossLink "cc/color:method"}}cc.color{{/crossLink}} 的便捷方法来创建一个新的 Color。
 *
 * @class Color
 * @extends ValueType
 */
var Color =
/*#__PURE__*/
function (_ValueType) {
  _inheritsLoose(Color, _ValueType);

  /**
   * Copy content of a color into another.
   * @method copy
   * @typescript
   * static copy (out: Color, a: Color): Color
   * @static
   */
  Color.copy = function copy(out, a) {
    out.r = a.r;
    out.g = a.g;
    out.b = a.b;
    out.a = a.a;
    return out;
  }
  /**
   * Clone a new color.
   * @method clone
   * @typescript
   * static clone (a: Color): Color
   * @static
   */
  ;

  Color.clone = function clone(a) {
    return new Color(a.r, a.g, a.b, a.a);
  }
  /**
   * Set the components of a color to the given values.
   * @method set
   * @typescript
   * static set (out: Color, r = 255, g = 255, b = 255, a = 255): Color
   * @static
   */
  ;

  Color.set = function set(out, r, g, b, a) {
    if (r === void 0) {
      r = 255;
    }

    if (g === void 0) {
      g = 255;
    }

    if (b === void 0) {
      b = 255;
    }

    if (a === void 0) {
      a = 255;
    }

    out.r = r;
    out.g = g;
    out.b = b;
    out.a = a;
    return out;
  }
  /**
   * Converts the hexadecimal formal color into rgb formal.
   * @method fromHex
   * @typescript
   * static fromHex (out: Color, hex: number): Color
   * @static
   */
  ;

  Color.fromHex = function fromHex(out, hex) {
    var r = (hex >> 24) / 255.0;
    var g = (hex >> 16 & 0xff) / 255.0;
    var b = (hex >> 8 & 0xff) / 255.0;
    var a = (hex & 0xff) / 255.0;
    out.r = r;
    out.g = g;
    out.b = b;
    out.a = a;
    return out;
  }
  /**
   * Add components of two colors, respectively.
   * @method add
   * @typescript
   * static add (out: Color, a: Color, b: Color): Color
   * @static
   */
  ;

  Color.add = function add(out, a, b) {
    out.r = a.r + b.r;
    out.g = a.g + b.g;
    out.b = a.b + b.b;
    out.a = a.a + b.a;
    return out;
  }
  /**
   * Subtract components of color b from components of color a, respectively.
   * @method subtract
   * @typescript
   * static subtract (out: Color, a: Color, b: Color): Color
   * @static
   */
  ;

  Color.subtract = function subtract(out, a, b) {
    out.r = a.r - b.r;
    out.g = a.g - b.g;
    out.b = a.b - b.b;
    out.a = a.a - b.a;
    return out;
  }
  /**
   * Multiply components of two colors, respectively.
   * @method multiply
   * @typescript
   * static multiply (out: Color, a: Color, b: Color): Color
   * @static
   */
  ;

  Color.multiply = function multiply(out, a, b) {
    out.r = a.r * b.r;
    out.g = a.g * b.g;
    out.b = a.b * b.b;
    out.a = a.a * b.a;
    return out;
  }
  /**
   * Divide components of color a by components of color b, respectively.
   * @method divide
   * @typescript
   * static divide (out: Color, a: Color, b: Color): Color
   * @static
   */
  ;

  Color.divide = function divide(out, a, b) {
    out.r = a.r / b.r;
    out.g = a.g / b.g;
    out.b = a.b / b.b;
    out.a = a.a / b.a;
    return out;
  }
  /**
   * Scales a color by a number.
   * @method scale
   * @typescript
   * static scale (out: Color, a: Color, b: number): Color
   * @static
   */
  ;

  Color.scale = function scale(out, a, b) {
    out.r = a.r * b;
    out.g = a.g * b;
    out.b = a.b * b;
    out.a = a.a * b;
    return out;
  }
  /**
   * Performs a linear interpolation between two colors.
   * @method lerp
   * @typescript
   * static lerp (out: Color, a: Color, b: Color, t: number): Color
   * @static
   */
  ;

  Color.lerp = function lerp(out, a, b, t) {
    var ar = a.r,
        ag = a.g,
        ab = a.b,
        aa = a.a;
    out.r = ar + t * (b.r - ar);
    out.g = ag + t * (b.g - ag);
    out.b = ab + t * (b.b - ab);
    out.a = aa + t * (b.a - aa);
    return out;
  }
  /**
   * !#zh 颜色转数组
   * !#en Turn an array of colors
   * @method toArray
   * @typescript
   * static toArray <Out extends IWritableArrayLike<number>> (out: Out, a: IColorLike, ofs = 0)
   * @param ofs 数组起始偏移量
   * @static
   */
  ;

  Color.toArray = function toArray(out, a, ofs) {
    if (ofs === void 0) {
      ofs = 0;
    }

    var scale = a instanceof Color || a.a > 1 ? 1 / 255 : 1;
    out[ofs + 0] = a.r * scale;
    out[ofs + 1] = a.g * scale;
    out[ofs + 2] = a.b * scale;
    out[ofs + 3] = a.a * scale;
    return out;
  }
  /**
   * !#zh 数组转颜色
   * !#en An array of colors turn
   * @method fromArray
   * @typescript
   * static fromArray <Out extends IColorLike> (arr: IWritableArrayLike<number>, out: Out, ofs = 0)
   * @param ofs 数组起始偏移量
   * @static
   */
  ;

  Color.fromArray = function fromArray(arr, out, ofs) {
    if (ofs === void 0) {
      ofs = 0;
    }

    out.r = arr[ofs + 0] * 255;
    out.g = arr[ofs + 1] * 255;
    out.b = arr[ofs + 2] * 255;
    out.a = arr[ofs + 3] * 255;
    return out;
  };

  _createClass(Color, null, [{
    key: "WHITE",

    /**
     * !#en Solid white, RGBA is [255, 255, 255, 255].
     * !#zh 纯白色，RGBA 是 [255, 255, 255, 255]。
     * @property WHITE
     * @type {Color}
     * @static
     */
    get: function get() {
      return new Color(255, 255, 255, 255);
    }
  }, {
    key: "BLACK",

    /**
     * !#en Solid black, RGBA is [0, 0, 0, 255].
     * !#zh 纯黑色，RGBA 是 [0, 0, 0, 255]。
     * @property BLACK
     * @type {Color}
     * @static
     */
    get: function get() {
      return new Color(0, 0, 0, 255);
    }
  }, {
    key: "TRANSPARENT",

    /**
     * !#en Transparent, RGBA is [0, 0, 0, 0].
     * !#zh 透明，RGBA 是 [0, 0, 0, 0]。
     * @property TRANSPARENT
     * @type {Color}
     * @static
     */
    get: function get() {
      return new Color(0, 0, 0, 0);
    }
  }, {
    key: "GRAY",

    /**
     * !#en Grey, RGBA is [127.5, 127.5, 127.5].
     * !#zh 灰色，RGBA 是 [127.5, 127.5, 127.5]。
     * @property GRAY
     * @type {Color}
     * @static
     */
    get: function get() {
      return new Color(127.5, 127.5, 127.5);
    }
  }, {
    key: "RED",

    /**
     * !#en Solid red, RGBA is [255, 0, 0].
     * !#zh 纯红色，RGBA 是 [255, 0, 0]。
     * @property RED
     * @type {Color}
     * @static
     */
    get: function get() {
      return new Color(255, 0, 0);
    }
  }, {
    key: "GREEN",

    /**
     * !#en Solid green, RGBA is [0, 255, 0].
     * !#zh 纯绿色，RGBA 是 [0, 255, 0]。
     * @property GREEN
     * @type {Color}
     * @static
     */
    get: function get() {
      return new Color(0, 255, 0);
    }
  }, {
    key: "BLUE",

    /**
     * !#en Solid blue, RGBA is [0, 0, 255].
     * !#zh 纯蓝色，RGBA 是 [0, 0, 255]。
     * @property BLUE
     * @type {Color}
     * @static
     */
    get: function get() {
      return new Color(0, 0, 255);
    }
  }, {
    key: "YELLOW",

    /**
     * !#en Yellow, RGBA is [255, 235, 4].
     * !#zh 黄色，RGBA 是 [255, 235, 4]。
     * @property YELLOW
     * @type {Color}
     * @static
     */
    get: function get() {
      return new Color(255, 235, 4);
    }
  }, {
    key: "ORANGE",

    /**
     * !#en Orange, RGBA is [255, 127, 0].
     * !#zh 橙色，RGBA 是 [255, 127, 0]。
     * @property ORANGE
     * @type {Color}
     * @static
     */
    get: function get() {
      return new Color(255, 127, 0);
    }
  }, {
    key: "CYAN",

    /**
     * !#en Cyan, RGBA is [0, 255, 255].
     * !#zh 青色，RGBA 是 [0, 255, 255]。
     * @property CYAN
     * @type {Color}
     * @static
     */
    get: function get() {
      return new Color(0, 255, 255);
    }
  }, {
    key: "MAGENTA",

    /**
     * !#en Magenta, RGBA is [255, 0, 255].
     * !#zh 洋红色（品红色），RGBA 是 [255, 0, 255]。
     * @property MAGENTA
     * @type {Color}
     * @static
     */
    get: function get() {
      return new Color(255, 0, 255);
    }
  }]);

  /**
   * @method constructor
   * @param {Number} [r=0] - red component of the color, default value is 0.
   * @param {Number} [g=0] - green component of the color, defualt value is 0.
   * @param {Number} [b=0] - blue component of the color, default value is 0.
   * @param {Number} [a=255] - alpha component of the color, default value is 255.
   */
  function Color(r, g, b, a) {
    var _this;

    if (r === void 0) {
      r = 0;
    }

    if (g === void 0) {
      g = 0;
    }

    if (b === void 0) {
      b = 0;
    }

    if (a === void 0) {
      a = 255;
    }

    _this = _ValueType.call(this) || this;
    _this._val = 0;

    if (typeof r === 'object') {
      g = r.g;
      b = r.b;
      a = r.a;
      r = r.r;
    }

    _this._val = (a << 24 >>> 0) + (b << 16) + (g << 8) + r;
    return _this;
  }
  /**
   * !#en Clone a new color from the current color.
   * !#zh 克隆当前颜色。
   * @method clone
   * @return {Color} Newly created color.
   * @example
   * var color = new cc.Color();
   * var newColor = color.clone();// Color {r: 0, g: 0, b: 0, a: 255}
   */


  var _proto = Color.prototype;

  _proto.clone = function clone() {
    var ret = new Color();
    ret._val = this._val;
    return ret;
  }
  /**
   * !#en TODO
   * !#zh 判断两个颜色是否相等。
   * @method equals
   * @param {Color} other
   * @return {Boolean}
   * @example
   * var color1 = cc.Color.WHITE;
   * var color2 = new cc.Color(255, 255, 255);
   * cc.log(color1.equals(color2)); // true;
   * color2 = cc.Color.RED;
   * cc.log(color2.equals(color1)); // false;
   */
  ;

  _proto.equals = function equals(other) {
    return other && this._val === other._val;
  }
  /**
   * !#en TODO
   * !#zh 线性插值
   * @method lerp
   * @param {Color} to
   * @param {number} ratio - the interpolation coefficient.
   * @param {Color} [out] - optional, the receiving vector.
   * @return {Color}
   * @example {@link cocos2d/core/value-types/CCColor/lerp.js}
   */
  ;

  _proto.lerp = function lerp(to, ratio, out) {
    out = out || new Color();
    var r = this.r;
    var g = this.g;
    var b = this.b;
    var a = this.a;
    out.r = r + (to.r - r) * ratio;
    out.g = g + (to.g - g) * ratio;
    out.b = b + (to.b - b) * ratio;
    out.a = a + (to.a - a) * ratio;
    return out;
  };

  /**
   * !#en TODO
   * !#zh 转换为方便阅读的字符串。
   * @method toString
   * @return {String}
   * @example
   * var color = cc.Color.WHITE;
   * color.toString(); // "rgba(255, 255, 255, 255)"
   */
  _proto.toString = function toString() {
    return "rgba(" + this.r.toFixed() + ", " + this.g.toFixed() + ", " + this.b.toFixed() + ", " + this.a.toFixed() + ")";
  };

  /**
   * !#en Gets red channel value
   * !#zh 获取当前颜色的红色值。
   * @method getR
   * @return {Number} red value.
   */
  _proto.getR = function getR() {
    return this._val & 0x000000ff;
  }
  /**
   * !#en Sets red value and return the current color object
   * !#zh 设置当前的红色值，并返回当前对象。
   * @method setR
   * @param {Number} red - the new Red component.
   * @return {Color} this color.
   * @example
   * var color = new cc.Color();
   * color.setR(255); // Color {r: 255, g: 0, b: 0, a: 255}
   */
  ;

  _proto.setR = function setR(red) {
    red = ~~_misc["default"].clampf(red, 0, 255);
    this._val = (this._val & 0xffffff00 | red) >>> 0;
    return this;
  }
  /**
   * !#en Gets green channel value
   * !#zh 获取当前颜色的绿色值。
   * @method getG
   * @return {Number} green value.
   */
  ;

  _proto.getG = function getG() {
    return (this._val & 0x0000ff00) >> 8;
  }
  /**
   * !#en Sets green value and return the current color object
   * !#zh 设置当前的绿色值，并返回当前对象。
   * @method setG
   * @param {Number} green - the new Green component.
   * @return {Color} this color.
   * @example
   * var color = new cc.Color();
   * color.setG(255); // Color {r: 0, g: 255, b: 0, a: 255}
   */
  ;

  _proto.setG = function setG(green) {
    green = ~~_misc["default"].clampf(green, 0, 255);
    this._val = (this._val & 0xffff00ff | green << 8) >>> 0;
    return this;
  }
  /**
   * !#en Gets blue channel value
   * !#zh 获取当前颜色的蓝色值。
   * @method getB
   * @return {Number} blue value.
   */
  ;

  _proto.getB = function getB() {
    return (this._val & 0x00ff0000) >> 16;
  }
  /**
   * !#en Sets blue value and return the current color object
   * !#zh 设置当前的蓝色值，并返回当前对象。
   * @method setB
   * @param {Number} blue - the new Blue component.
   * @return {Color} this color.
   * @example
   * var color = new cc.Color();
   * color.setB(255); // Color {r: 0, g: 0, b: 255, a: 255}
   */
  ;

  _proto.setB = function setB(blue) {
    blue = ~~_misc["default"].clampf(blue, 0, 255);
    this._val = (this._val & 0xff00ffff | blue << 16) >>> 0;
    return this;
  }
  /**
   * !#en Gets alpha channel value
   * !#zh 获取当前颜色的透明度值。
   * @method getA
   * @return {Number} alpha value.
   */
  ;

  _proto.getA = function getA() {
    return (this._val & 0xff000000) >>> 24;
  }
  /**
   * !#en Sets alpha value and return the current color object
   * !#zh 设置当前的透明度，并返回当前对象。
   * @method setA
   * @param {Number} alpha - the new Alpha component.
   * @return {Color} this color.
   * @example
   * var color = new cc.Color();
   * color.setA(0); // Color {r: 0, g: 0, b: 0, a: 0}
   */
  ;

  _proto.setA = function setA(alpha) {
    alpha = ~~_misc["default"].clampf(alpha, 0, 255);
    this._val = (this._val & 0x00ffffff | alpha << 24) >>> 0;
    return this;
  }
  /**
   * !#en Convert color to css format.
   * !#zh 转换为 CSS 格式。
   * @method toCSS
   * @param {String} opt - "rgba", "rgb", "#rgb" or "#rrggbb".
   * @return {String}
   * @example {@link cocos2d/core/value-types/CCColor/toCSS.js}
   */
  ;

  _proto.toCSS = function toCSS(opt) {
    if (opt === 'rgba') {
      return "rgba(" + (this.r | 0) + "," + (this.g | 0) + "," + (this.b | 0) + "," + (this.a / 255).toFixed(2) + ")";
    } else if (opt === 'rgb') {
      return "rgb(" + (this.r | 0) + "," + (this.g | 0) + "," + (this.b | 0) + ")";
    } else {
      return '#' + this.toHEX(opt);
    }
  }
  /**
   * !#en Read hex string and store color data into the current color object, the hex string must be formated as rgba or rgb.
   * !#zh 读取 16 进制颜色。
   * @method fromHEX
   * @param {String} hexString
   * @return {Color}
   * @chainable
   * @example
   * var color = cc.Color.BLACK;
   * color.fromHEX("#FFFF33"); // Color {r: 255, g: 255, b: 51, a: 255};
   */
  ;

  _proto.fromHEX = function fromHEX(hexString) {
    hexString = hexString.indexOf('#') === 0 ? hexString.substring(1) : hexString;
    var r = parseInt(hexString.substr(0, 2), 16) || 0;
    var g = parseInt(hexString.substr(2, 2), 16) || 0;
    var b = parseInt(hexString.substr(4, 2), 16) || 0;
    var a = parseInt(hexString.substr(6, 2), 16) || 255;
    this._val = (a << 24 >>> 0) + (b << 16) + (g << 8) + r;
    return this;
  }
  /**
   * !#en convert Color to HEX color string.
   * e.g.  cc.color(255,6,255)  to : "#ff06ff"
   * !#zh 转换为 16 进制。
   * @method toHEX
   * @param {String} fmt - "#rgb", "#rrggbb" or "#rrggbbaa".
   * @return {String}
   * @example
   * var color = cc.Color.BLACK;
   * color.toHEX("#rgb");     // "000";
   * color.toHEX("#rrggbb");  // "000000";
   */
  ;

  _proto.toHEX = function toHEX(fmt) {
    var prefix = '0';
    var hex = [(this.r < 16 ? prefix : '') + (this.r | 0).toString(16), (this.g < 16 ? prefix : '') + (this.g | 0).toString(16), (this.b < 16 ? prefix : '') + (this.b | 0).toString(16)];
    var i = -1;

    if (fmt === '#rgb') {
      for (i = 0; i < hex.length; ++i) {
        if (hex[i].length > 1) {
          hex[i] = hex[i][0];
        }
      }
    } else if (fmt === '#rrggbb') {
      for (i = 0; i < hex.length; ++i) {
        if (hex[i].length === 1) {
          hex[i] = '0' + hex[i];
        }
      }
    } else if (fmt === '#rrggbbaa') {
      hex.push((this.a < 16 ? prefix : '') + (this.a | 0).toString(16));
    }

    return hex.join('');
  };

  /**
   * !#en Convert to 24bit rgb value.
   * !#zh 转换为 24bit 的 RGB 值。
   * @method toRGBValue
   * @return {Number}
   * @example
   * var color = cc.Color.YELLOW;
   * color.toRGBValue(); // 16771844;
   */
  _proto.toRGBValue = function toRGBValue() {
    return this._val & 0x00ffffff;
  }
  /**
   * !#en Read HSV model color and convert to RGB color
   * !#zh 读取 HSV（色彩模型）格式。
   * @method fromHSV
   * @param {Number} h
   * @param {Number} s
   * @param {Number} v
   * @return {Color}
   * @chainable
   * @example
   * var color = cc.Color.YELLOW;
   * color.fromHSV(0, 0, 1); // Color {r: 255, g: 255, b: 255, a: 255};
   */
  ;

  _proto.fromHSV = function fromHSV(h, s, v) {
    var r, g, b;

    if (s === 0) {
      r = g = b = v;
    } else {
      if (v === 0) {
        r = g = b = 0;
      } else {
        if (h === 1) h = 0;
        h *= 6;
        s = s;
        v = v;
        var i = Math.floor(h);
        var f = h - i;
        var p = v * (1 - s);
        var q = v * (1 - s * f);
        var t = v * (1 - s * (1 - f));

        switch (i) {
          case 0:
            r = v;
            g = t;
            b = p;
            break;

          case 1:
            r = q;
            g = v;
            b = p;
            break;

          case 2:
            r = p;
            g = v;
            b = t;
            break;

          case 3:
            r = p;
            g = q;
            b = v;
            break;

          case 4:
            r = t;
            g = p;
            b = v;
            break;

          case 5:
            r = v;
            g = p;
            b = q;
            break;
        }
      }
    }

    r *= 255;
    g *= 255;
    b *= 255;
    this._val = (this.a << 24 >>> 0) + (b << 16) + (g << 8) + r;
    return this;
  }
  /**
   * !#en Transform to HSV model color
   * !#zh 转换为 HSV（色彩模型）格式。
   * @method toHSV
   * @return {Object} - {h: number, s: number, v: number}.
   * @example
   * var color = cc.Color.YELLOW;
   * color.toHSV(); // Object {h: 0.1533864541832669, s: 0.9843137254901961, v: 1};
   */
  ;

  _proto.toHSV = function toHSV() {
    var r = this.r / 255;
    var g = this.g / 255;
    var b = this.b / 255;
    var hsv = {
      h: 0,
      s: 0,
      v: 0
    };
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var delta = 0;
    hsv.v = max;
    hsv.s = max ? (max - min) / max : 0;
    if (!hsv.s) hsv.h = 0;else {
      delta = max - min;
      if (r === max) hsv.h = (g - b) / delta;else if (g === max) hsv.h = 2 + (b - r) / delta;else hsv.h = 4 + (r - g) / delta;
      hsv.h /= 6;
      if (hsv.h < 0) hsv.h += 1.0;
    }
    return hsv;
  }
  /**
   * !#en Set the color
   * !#zh 设置颜色
   * @method set
   * @typescript
   * set (color: Color): Color
   * @param {Color} color 
   */
  ;

  _proto.set = function set(color) {
    if (color._val) {
      this._val = color._val;
    } else {
      this.r = color.r;
      this.g = color.g;
      this.b = color.b;
      this.a = color.a;
    }

    return this;
  };

  _proto._fastSetA = function _fastSetA(alpha) {
    this._val = (this._val & 0x00ffffff | alpha << 24) >>> 0;
  }
  /**
   * !#en Multiplies the current color by the specified color
   * !#zh 将当前颜色乘以与指定颜色
   * @method multiply
   * @return {Color}
   * @param {Color} other
   */
  ;

  _proto.multiply = function multiply(other) {
    var r = (this._val & 0x000000ff) * other.r >> 8;
    var g = (this._val & 0x0000ff00) * other.g >> 8;
    var b = (this._val & 0x00ff0000) * other.b >> 8;
    var a = ((this._val & 0xff000000) >>> 8) * other.a;
    this._val = a & 0xff000000 | b & 0x00ff0000 | g & 0x0000ff00 | r & 0x000000ff;
    return this;
  };

  _createClass(Color, [{
    key: "r",

    /**
     * !#en Get or set red channel value
     * !#zh 获取或者设置红色通道
     * @property {number} r
     */
    get: function get() {
      return this.getR();
    },
    set: function set(v) {
      this.setR(v);
    }
    /**
     * !#en Get or set green channel value
     * !#zh 获取或者设置绿色通道
     * @property {number} g
     */

  }, {
    key: "g",
    get: function get() {
      return this.getG();
    },
    set: function set(v) {
      this.setG(v);
    }
    /**
     * !#en Get or set blue channel value
     * !#zh 获取或者设置蓝色通道
     * @property {number} b
     */

  }, {
    key: "b",
    get: function get() {
      return this.getB();
    },
    set: function set(v) {
      this.setB(v);
    }
    /**
     * !#en Get or set alpha channel value
     * !#zh 获取或者设置透明通道
     * @property {number} a
     */

  }, {
    key: "a",
    get: function get() {
      return this.getA();
    },
    set: function set(v) {
      this.setA(v);
    }
  }]);

  return Color;
}(_valueType["default"]);

exports["default"] = Color;
Color.div = Color.divide;
Color.sub = Color.subtract;
Color.mul = Color.multiply;
Color.WHITE_R = Color.WHITE;
Color.BLACK_R = Color.BLACK;
Color.TRANSPARENT_R = Color.TRANSPARENT;
Color.GRAY_R = Color.GRAY;
Color.RED_R = Color.RED;
Color.GREEN_R = Color.GREEN;
Color.BLUE_R = Color.BLUE;
Color.YELLOW_R = Color.YELLOW;
Color.ORANGE_R = Color.ORANGE;
Color.CYAN_R = Color.CYAN;
Color.MAGENTA_R = Color.MAGENTA;

_CCClass["default"].fastDefine('cc.Color', Color, {
  r: 0,
  g: 0,
  b: 0,
  a: 255
});

cc.Color = Color;
/**
 * @module cc
 */

/**
 * !#en
 * The convenience method to create a new {{#crossLink "Color/Color:method"}}cc.Color{{/crossLink}}
 * Alpha channel is optional. Default value is 255.
 *
 * !#zh
 * 通过该方法来创建一个新的 {{#crossLink "Color/Color:method"}}cc.Color{{/crossLink}} 对象。
 * Alpha 通道是可选的。默认值是 255。
 *
 * @method color
 * @param {Number} [r=0]
 * @param {Number} [g=0]
 * @param {Number} [b=0]
 * @param {Number} [a=255]
 * @return {Color}
 * @example {@link cocos2d/core/value-types/CCColor/color.js}
 */

cc.color = function color(r, g, b, a) {
  if (typeof r === 'string') {
    var result = new Color();
    return result.fromHEX(r);
  }

  if (typeof r === 'object') {
    return new Color(r.r, r.g, r.b, r.a);
  }

  return new Color(r, g, b, a);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbG9yLnRzIl0sIm5hbWVzIjpbIkNvbG9yIiwiY29weSIsIm91dCIsImEiLCJyIiwiZyIsImIiLCJjbG9uZSIsInNldCIsImZyb21IZXgiLCJoZXgiLCJhZGQiLCJzdWJ0cmFjdCIsIm11bHRpcGx5IiwiZGl2aWRlIiwic2NhbGUiLCJsZXJwIiwidCIsImFyIiwiYWciLCJhYiIsImFhIiwidG9BcnJheSIsIm9mcyIsImZyb21BcnJheSIsImFyciIsIl92YWwiLCJyZXQiLCJlcXVhbHMiLCJvdGhlciIsInRvIiwicmF0aW8iLCJ0b1N0cmluZyIsInRvRml4ZWQiLCJnZXRSIiwic2V0UiIsInJlZCIsIm1pc2MiLCJjbGFtcGYiLCJnZXRHIiwic2V0RyIsImdyZWVuIiwiZ2V0QiIsInNldEIiLCJibHVlIiwiZ2V0QSIsInNldEEiLCJhbHBoYSIsInRvQ1NTIiwib3B0IiwidG9IRVgiLCJmcm9tSEVYIiwiaGV4U3RyaW5nIiwiaW5kZXhPZiIsInN1YnN0cmluZyIsInBhcnNlSW50Iiwic3Vic3RyIiwiZm10IiwicHJlZml4IiwiaSIsImxlbmd0aCIsInB1c2giLCJqb2luIiwidG9SR0JWYWx1ZSIsImZyb21IU1YiLCJoIiwicyIsInYiLCJNYXRoIiwiZmxvb3IiLCJmIiwicCIsInEiLCJ0b0hTViIsImhzdiIsIm1heCIsIm1pbiIsImRlbHRhIiwiY29sb3IiLCJfZmFzdFNldEEiLCJWYWx1ZVR5cGUiLCJkaXYiLCJzdWIiLCJtdWwiLCJXSElURV9SIiwiV0hJVEUiLCJCTEFDS19SIiwiQkxBQ0siLCJUUkFOU1BBUkVOVF9SIiwiVFJBTlNQQVJFTlQiLCJHUkFZX1IiLCJHUkFZIiwiUkVEX1IiLCJSRUQiLCJHUkVFTl9SIiwiR1JFRU4iLCJCTFVFX1IiLCJCTFVFIiwiWUVMTE9XX1IiLCJZRUxMT1ciLCJPUkFOR0VfUiIsIk9SQU5HRSIsIkNZQU5fUiIsIkNZQU4iLCJNQUdFTlRBX1IiLCJNQUdFTlRBIiwiQ0NDbGFzcyIsImZhc3REZWZpbmUiLCJjYyIsInJl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QkFBUUMsVUFBUixDQUFtQixVQUFuQixFQUErQjNHLEtBQS9CLEVBQXNDO0FBQUVJLEVBQUFBLENBQUMsRUFBRSxDQUFMO0FBQVFDLEVBQUFBLENBQUMsRUFBRSxDQUFYO0FBQWNDLEVBQUFBLENBQUMsRUFBRSxDQUFqQjtBQUFvQkgsRUFBQUEsQ0FBQyxFQUFFO0FBQXZCLENBQXRDOztBQUdBeUcsRUFBRSxDQUFDNUcsS0FBSCxHQUFXQSxLQUFYO0FBRUE7Ozs7QUFJQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBNEcsRUFBRSxDQUFDOUIsS0FBSCxHQUFXLFNBQVNBLEtBQVQsQ0FBZ0IxRSxDQUFoQixFQUFtQkMsQ0FBbkIsRUFBc0JDLENBQXRCLEVBQXlCSCxDQUF6QixFQUE0QjtBQUNuQyxNQUFJLE9BQU9DLENBQVAsS0FBYSxRQUFqQixFQUEyQjtBQUN2QixRQUFJeUcsTUFBTSxHQUFHLElBQUk3RyxLQUFKLEVBQWI7QUFDQSxXQUFPNkcsTUFBTSxDQUFDMUQsT0FBUCxDQUFlL0MsQ0FBZixDQUFQO0FBQ0g7O0FBQ0QsTUFBSSxPQUFPQSxDQUFQLEtBQWEsUUFBakIsRUFBMkI7QUFDdkIsV0FBTyxJQUFJSixLQUFKLENBQVVJLENBQUMsQ0FBQ0EsQ0FBWixFQUFlQSxDQUFDLENBQUNDLENBQWpCLEVBQW9CRCxDQUFDLENBQUNFLENBQXRCLEVBQXlCRixDQUFDLENBQUNELENBQTNCLENBQVA7QUFDSDs7QUFDRCxTQUFPLElBQUlILEtBQUosQ0FBVUksQ0FBVixFQUFhQyxDQUFiLEVBQWdCQyxDQUFoQixFQUFtQkgsQ0FBbkIsQ0FBUDtBQUNILENBVEQiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCBWYWx1ZVR5cGUgZnJvbSAnLi92YWx1ZS10eXBlJztcbmltcG9ydCBDQ0NsYXNzIGZyb20gJy4uL3BsYXRmb3JtL0NDQ2xhc3MnO1xuaW1wb3J0IG1pc2MgZnJvbSAnLi4vdXRpbHMvbWlzYyc7XG5cbmltcG9ydCB7IElDb2xvckxpa2UgfSBmcm9tICcuL21hdGgnO1xuXG4vKipcbiAqICEjZW5cbiAqIFJlcHJlc2VudGF0aW9uIG9mIFJHQkEgY29sb3JzLlxuICpcbiAqIEVhY2ggY29sb3IgY29tcG9uZW50IGlzIGEgZmxvYXRpbmcgcG9pbnQgdmFsdWUgd2l0aCBhIHJhbmdlIGZyb20gMCB0byAyNTUuXG4gKlxuICogWW91IGNhbiBhbHNvIHVzZSB0aGUgY29udmVuaWVuY2UgbWV0aG9kIHt7I2Nyb3NzTGluayBcImNjL2NvbG9yOm1ldGhvZFwifX1jYy5jb2xvcnt7L2Nyb3NzTGlua319IHRvIGNyZWF0ZSBhIG5ldyBDb2xvci5cbiAqXG4gKiAhI3poXG4gKiBjYy5Db2xvciDnlKjkuo7ooajnpLrpopzoibLjgIJcbiAqXG4gKiDlroPljIXlkKsgUkdCQSDlm5vkuKrku6Xmta7ngrnmlbDkv53lrZjnmoTpopzoibLliIbph4/vvIzmr4/kuKrnmoTlgLzpg73lnKggMCDliLAgMjU1IOS5i+mXtOOAglxuICpcbiAqIOaCqOS5n+WPr+S7pemAmui/h+S9v+eUqCB7eyNjcm9zc0xpbmsgXCJjYy9jb2xvcjptZXRob2RcIn19Y2MuY29sb3J7ey9jcm9zc0xpbmt9fSDnmoTkvr/mjbfmlrnms5XmnaXliJvlu7rkuIDkuKrmlrDnmoQgQ29sb3LjgIJcbiAqXG4gKiBAY2xhc3MgQ29sb3JcbiAqIEBleHRlbmRzIFZhbHVlVHlwZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb2xvciBleHRlbmRzIFZhbHVlVHlwZSB7XG4gICAgc3RhdGljIGRpdiA9IENvbG9yLmRpdmlkZTtcbiAgICBzdGF0aWMgc3ViID0gQ29sb3Iuc3VidHJhY3Q7XG4gICAgc3RhdGljIG11bCA9IENvbG9yLm11bHRpcGx5O1xuXG4gICAgLyoqXG4gICAgICogISNlbiBTb2xpZCB3aGl0ZSwgUkdCQSBpcyBbMjU1LCAyNTUsIDI1NSwgMjU1XS5cbiAgICAgKiAhI3poIOe6r+eZveiJsu+8jFJHQkEg5pivIFsyNTUsIDI1NSwgMjU1LCAyNTVd44CCXG4gICAgICogQHByb3BlcnR5IFdISVRFXG4gICAgICogQHR5cGUge0NvbG9yfVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IFdISVRFICgpIHsgcmV0dXJuIG5ldyBDb2xvcigyNTUsIDI1NSwgMjU1LCAyNTUpOyB9XG4gICAgc3RhdGljIHJlYWRvbmx5IFdISVRFX1I6IENvbG9yID0gQ29sb3IuV0hJVEU7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNvbGlkIGJsYWNrLCBSR0JBIGlzIFswLCAwLCAwLCAyNTVdLlxuICAgICAqICEjemgg57qv6buR6Imy77yMUkdCQSDmmK8gWzAsIDAsIDAsIDI1NV3jgIJcbiAgICAgKiBAcHJvcGVydHkgQkxBQ0tcbiAgICAgKiBAdHlwZSB7Q29sb3J9XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgQkxBQ0sgKCkgeyByZXR1cm4gbmV3IENvbG9yKDAsIDAsIDAsIDI1NSk7IH1cbiAgICBzdGF0aWMgcmVhZG9ubHkgQkxBQ0tfUjogQ29sb3IgPSBDb2xvci5CTEFDSztcblxuICAgIC8qKlxuICAgICAqICEjZW4gVHJhbnNwYXJlbnQsIFJHQkEgaXMgWzAsIDAsIDAsIDBdLlxuICAgICAqICEjemgg6YCP5piO77yMUkdCQSDmmK8gWzAsIDAsIDAsIDBd44CCXG4gICAgICogQHByb3BlcnR5IFRSQU5TUEFSRU5UXG4gICAgICogQHR5cGUge0NvbG9yfVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IFRSQU5TUEFSRU5UICgpIHsgcmV0dXJuIG5ldyBDb2xvcigwLCAwLCAwLCAwKTsgfVxuICAgIHN0YXRpYyByZWFkb25seSBUUkFOU1BBUkVOVF9SOiBDb2xvciA9IENvbG9yLlRSQU5TUEFSRU5UO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBHcmV5LCBSR0JBIGlzIFsxMjcuNSwgMTI3LjUsIDEyNy41XS5cbiAgICAgKiAhI3poIOeBsOiJsu+8jFJHQkEg5pivIFsxMjcuNSwgMTI3LjUsIDEyNy41XeOAglxuICAgICAqIEBwcm9wZXJ0eSBHUkFZXG4gICAgICogQHR5cGUge0NvbG9yfVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IEdSQVkgKCkgeyByZXR1cm4gbmV3IENvbG9yKDEyNy41LCAxMjcuNSwgMTI3LjUpOyB9XG4gICAgc3RhdGljIHJlYWRvbmx5IEdSQVlfUjogQ29sb3IgPSBDb2xvci5HUkFZO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBTb2xpZCByZWQsIFJHQkEgaXMgWzI1NSwgMCwgMF0uXG4gICAgICogISN6aCDnuq/nuqLoibLvvIxSR0JBIOaYryBbMjU1LCAwLCAwXeOAglxuICAgICAqIEBwcm9wZXJ0eSBSRURcbiAgICAgKiBAdHlwZSB7Q29sb3J9XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgUkVEICgpIHsgcmV0dXJuIG5ldyBDb2xvcigyNTUsIDAsIDApOyB9XG4gICAgc3RhdGljIHJlYWRvbmx5IFJFRF9SOiBDb2xvciA9IENvbG9yLlJFRDtcbiAgICAvKipcbiAgICAgKiAhI2VuIFNvbGlkIGdyZWVuLCBSR0JBIGlzIFswLCAyNTUsIDBdLlxuICAgICAqICEjemgg57qv57u/6Imy77yMUkdCQSDmmK8gWzAsIDI1NSwgMF3jgIJcbiAgICAgKiBAcHJvcGVydHkgR1JFRU5cbiAgICAgKiBAdHlwZSB7Q29sb3J9XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgR1JFRU4gKCkgeyByZXR1cm4gbmV3IENvbG9yKDAsIDI1NSwgMCk7IH1cbiAgICBzdGF0aWMgcmVhZG9ubHkgR1JFRU5fUjogQ29sb3IgPSBDb2xvci5HUkVFTjtcbiAgICAvKipcbiAgICAgKiAhI2VuIFNvbGlkIGJsdWUsIFJHQkEgaXMgWzAsIDAsIDI1NV0uXG4gICAgICogISN6aCDnuq/ok53oibLvvIxSR0JBIOaYryBbMCwgMCwgMjU1XeOAglxuICAgICAqIEBwcm9wZXJ0eSBCTFVFXG4gICAgICogQHR5cGUge0NvbG9yfVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IEJMVUUgKCkgeyByZXR1cm4gbmV3IENvbG9yKDAsIDAsIDI1NSk7IH1cbiAgICBzdGF0aWMgcmVhZG9ubHkgQkxVRV9SOiBDb2xvciA9IENvbG9yLkJMVUU7XG4gICAgLyoqXG4gICAgICogISNlbiBZZWxsb3csIFJHQkEgaXMgWzI1NSwgMjM1LCA0XS5cbiAgICAgKiAhI3poIOm7hOiJsu+8jFJHQkEg5pivIFsyNTUsIDIzNSwgNF3jgIJcbiAgICAgKiBAcHJvcGVydHkgWUVMTE9XXG4gICAgICogQHR5cGUge0NvbG9yfVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IFlFTExPVyAoKSB7IHJldHVybiBuZXcgQ29sb3IoMjU1LCAyMzUsIDQpOyB9XG4gICAgc3RhdGljIHJlYWRvbmx5IFlFTExPV19SOiBDb2xvciA9IENvbG9yLllFTExPVztcbiAgICAvKipcbiAgICAgKiAhI2VuIE9yYW5nZSwgUkdCQSBpcyBbMjU1LCAxMjcsIDBdLlxuICAgICAqICEjemgg5qmZ6Imy77yMUkdCQSDmmK8gWzI1NSwgMTI3LCAwXeOAglxuICAgICAqIEBwcm9wZXJ0eSBPUkFOR0VcbiAgICAgKiBAdHlwZSB7Q29sb3J9XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgT1JBTkdFICgpIHsgcmV0dXJuIG5ldyBDb2xvcigyNTUsIDEyNywgMCk7IH1cbiAgICBzdGF0aWMgcmVhZG9ubHkgT1JBTkdFX1I6IENvbG9yID0gQ29sb3IuT1JBTkdFO1xuICAgIC8qKlxuICAgICAqICEjZW4gQ3lhbiwgUkdCQSBpcyBbMCwgMjU1LCAyNTVdLlxuICAgICAqICEjemgg6Z2S6Imy77yMUkdCQSDmmK8gWzAsIDI1NSwgMjU1XeOAglxuICAgICAqIEBwcm9wZXJ0eSBDWUFOXG4gICAgICogQHR5cGUge0NvbG9yfVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IENZQU4gKCkgeyByZXR1cm4gbmV3IENvbG9yKDAsIDI1NSwgMjU1KTsgfVxuICAgIHN0YXRpYyByZWFkb25seSBDWUFOX1I6IENvbG9yID0gQ29sb3IuQ1lBTjtcbiAgICAvKipcbiAgICAgKiAhI2VuIE1hZ2VudGEsIFJHQkEgaXMgWzI1NSwgMCwgMjU1XS5cbiAgICAgKiAhI3poIOa0i+e6ouiJsu+8iOWTgee6ouiJsu+8ie+8jFJHQkEg5pivIFsyNTUsIDAsIDI1NV3jgIJcbiAgICAgKiBAcHJvcGVydHkgTUFHRU5UQVxuICAgICAqIEB0eXBlIHtDb2xvcn1cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGdldCBNQUdFTlRBICgpIHsgcmV0dXJuIG5ldyBDb2xvcigyNTUsIDAsIDI1NSk7IH1cbiAgICBzdGF0aWMgcmVhZG9ubHkgTUFHRU5UQV9SOiBDb2xvciA9IENvbG9yLk1BR0VOVEE7XG5cbiAgICAvKipcbiAgICAgKiBDb3B5IGNvbnRlbnQgb2YgYSBjb2xvciBpbnRvIGFub3RoZXIuXG4gICAgICogQG1ldGhvZCBjb3B5XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgY29weSAob3V0OiBDb2xvciwgYTogQ29sb3IpOiBDb2xvclxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgY29weSAob3V0OiBDb2xvciwgYTogQ29sb3IpOiBDb2xvciB7XG4gICAgICAgIG91dC5yID0gYS5yO1xuICAgICAgICBvdXQuZyA9IGEuZztcbiAgICAgICAgb3V0LmIgPSBhLmI7XG4gICAgICAgIG91dC5hID0gYS5hO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsb25lIGEgbmV3IGNvbG9yLlxuICAgICAqIEBtZXRob2QgY2xvbmVcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBjbG9uZSAoYTogQ29sb3IpOiBDb2xvclxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgY2xvbmUgKGE6IENvbG9yKTogQ29sb3Ige1xuICAgICAgICByZXR1cm4gbmV3IENvbG9yKGEuciwgYS5nLCBhLmIsIGEuYSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBjb21wb25lbnRzIG9mIGEgY29sb3IgdG8gdGhlIGdpdmVuIHZhbHVlcy5cbiAgICAgKiBAbWV0aG9kIHNldFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIHNldCAob3V0OiBDb2xvciwgciA9IDI1NSwgZyA9IDI1NSwgYiA9IDI1NSwgYSA9IDI1NSk6IENvbG9yXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBzZXQgKG91dDogQ29sb3IsIHIgPSAyNTUsIGcgPSAyNTUsIGIgPSAyNTUsIGEgPSAyNTUpOiBDb2xvciB7XG4gICAgICAgIG91dC5yID0gcjtcbiAgICAgICAgb3V0LmcgPSBnO1xuICAgICAgICBvdXQuYiA9IGI7XG4gICAgICAgIG91dC5hID0gYTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyB0aGUgaGV4YWRlY2ltYWwgZm9ybWFsIGNvbG9yIGludG8gcmdiIGZvcm1hbC5cbiAgICAgKiBAbWV0aG9kIGZyb21IZXhcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBmcm9tSGV4IChvdXQ6IENvbG9yLCBoZXg6IG51bWJlcik6IENvbG9yXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tSGV4IChvdXQ6IENvbG9yLCBoZXg6IG51bWJlcik6IENvbG9yIHtcbiAgICAgICAgbGV0IHIgPSAoKGhleCA+PiAyNCkpIC8gMjU1LjA7XG4gICAgICAgIGxldCBnID0gKChoZXggPj4gMTYpICYgMHhmZikgLyAyNTUuMDtcbiAgICAgICAgbGV0IGIgPSAoKGhleCA+PiA4KSAmIDB4ZmYpIC8gMjU1LjA7XG4gICAgICAgIGxldCBhID0gKChoZXgpICYgMHhmZikgLyAyNTUuMDtcblxuICAgICAgICBvdXQuciA9IHI7XG4gICAgICAgIG91dC5nID0gZztcbiAgICAgICAgb3V0LmIgPSBiO1xuICAgICAgICBvdXQuYSA9IGE7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGNvbXBvbmVudHMgb2YgdHdvIGNvbG9ycywgcmVzcGVjdGl2ZWx5LlxuICAgICAqIEBtZXRob2QgYWRkXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgYWRkIChvdXQ6IENvbG9yLCBhOiBDb2xvciwgYjogQ29sb3IpOiBDb2xvclxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgYWRkIChvdXQ6IENvbG9yLCBhOiBDb2xvciwgYjogQ29sb3IpOiBDb2xvciB7XG4gICAgICAgIG91dC5yID0gYS5yICsgYi5yO1xuICAgICAgICBvdXQuZyA9IGEuZyArIGIuZztcbiAgICAgICAgb3V0LmIgPSBhLmIgKyBiLmI7XG4gICAgICAgIG91dC5hID0gYS5hICsgYi5hO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN1YnRyYWN0IGNvbXBvbmVudHMgb2YgY29sb3IgYiBmcm9tIGNvbXBvbmVudHMgb2YgY29sb3IgYSwgcmVzcGVjdGl2ZWx5LlxuICAgICAqIEBtZXRob2Qgc3VidHJhY3RcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBzdWJ0cmFjdCAob3V0OiBDb2xvciwgYTogQ29sb3IsIGI6IENvbG9yKTogQ29sb3JcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHN1YnRyYWN0IChvdXQ6IENvbG9yLCBhOiBDb2xvciwgYjogQ29sb3IpOiBDb2xvciB7XG4gICAgICAgIG91dC5yID0gYS5yIC0gYi5yO1xuICAgICAgICBvdXQuZyA9IGEuZyAtIGIuZztcbiAgICAgICAgb3V0LmIgPSBhLmIgLSBiLmI7XG4gICAgICAgIG91dC5hID0gYS5hIC0gYi5hO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE11bHRpcGx5IGNvbXBvbmVudHMgb2YgdHdvIGNvbG9ycywgcmVzcGVjdGl2ZWx5LlxuICAgICAqIEBtZXRob2QgbXVsdGlwbHlcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBtdWx0aXBseSAob3V0OiBDb2xvciwgYTogQ29sb3IsIGI6IENvbG9yKTogQ29sb3JcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIG11bHRpcGx5IChvdXQ6IENvbG9yLCBhOiBDb2xvciwgYjogQ29sb3IpOiBDb2xvciB7XG4gICAgICAgIG91dC5yID0gYS5yICogYi5yO1xuICAgICAgICBvdXQuZyA9IGEuZyAqIGIuZztcbiAgICAgICAgb3V0LmIgPSBhLmIgKiBiLmI7XG4gICAgICAgIG91dC5hID0gYS5hICogYi5hO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERpdmlkZSBjb21wb25lbnRzIG9mIGNvbG9yIGEgYnkgY29tcG9uZW50cyBvZiBjb2xvciBiLCByZXNwZWN0aXZlbHkuXG4gICAgICogQG1ldGhvZCBkaXZpZGVcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBkaXZpZGUgKG91dDogQ29sb3IsIGE6IENvbG9yLCBiOiBDb2xvcik6IENvbG9yXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBkaXZpZGUgKG91dDogQ29sb3IsIGE6IENvbG9yLCBiOiBDb2xvcik6IENvbG9yIHtcbiAgICAgICAgb3V0LnIgPSBhLnIgLyBiLnI7XG4gICAgICAgIG91dC5nID0gYS5nIC8gYi5nO1xuICAgICAgICBvdXQuYiA9IGEuYiAvIGIuYjtcbiAgICAgICAgb3V0LmEgPSBhLmEgLyBiLmE7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2NhbGVzIGEgY29sb3IgYnkgYSBudW1iZXIuXG4gICAgICogQG1ldGhvZCBzY2FsZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIHNjYWxlIChvdXQ6IENvbG9yLCBhOiBDb2xvciwgYjogbnVtYmVyKTogQ29sb3JcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHNjYWxlIChvdXQ6IENvbG9yLCBhOiBDb2xvciwgYjogbnVtYmVyKTogQ29sb3Ige1xuICAgICAgICBvdXQuciA9IGEuciAqIGI7XG4gICAgICAgIG91dC5nID0gYS5nICogYjtcbiAgICAgICAgb3V0LmIgPSBhLmIgKiBiO1xuICAgICAgICBvdXQuYSA9IGEuYSAqIGI7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGVyZm9ybXMgYSBsaW5lYXIgaW50ZXJwb2xhdGlvbiBiZXR3ZWVuIHR3byBjb2xvcnMuXG4gICAgICogQG1ldGhvZCBsZXJwXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgbGVycCAob3V0OiBDb2xvciwgYTogQ29sb3IsIGI6IENvbG9yLCB0OiBudW1iZXIpOiBDb2xvclxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgbGVycCAob3V0OiBDb2xvciwgYTogQ29sb3IsIGI6IENvbG9yLCB0OiBudW1iZXIpOiBDb2xvciB7XG4gICAgICAgIGxldCBhciA9IGEucixcbiAgICAgICAgICAgIGFnID0gYS5nLFxuICAgICAgICAgICAgYWIgPSBhLmIsXG4gICAgICAgICAgICBhYSA9IGEuYTtcbiAgICAgICAgb3V0LnIgPSBhciArIHQgKiAoYi5yIC0gYXIpO1xuICAgICAgICBvdXQuZyA9IGFnICsgdCAqIChiLmcgLSBhZyk7XG4gICAgICAgIG91dC5iID0gYWIgKyB0ICogKGIuYiAtIGFiKTtcbiAgICAgICAgb3V0LmEgPSBhYSArIHQgKiAoYi5hIC0gYWEpO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6aKc6Imy6L2s5pWw57uEXG4gICAgICogISNlbiBUdXJuIGFuIGFycmF5IG9mIGNvbG9yc1xuICAgICAqIEBtZXRob2QgdG9BcnJheVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIHRvQXJyYXkgPE91dCBleHRlbmRzIElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+PiAob3V0OiBPdXQsIGE6IElDb2xvckxpa2UsIG9mcyA9IDApXG4gICAgICogQHBhcmFtIG9mcyDmlbDnu4Totbflp4vlgY/np7vph49cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHRvQXJyYXk8T3V0IGV4dGVuZHMgSVdyaXRhYmxlQXJyYXlMaWtlPG51bWJlcj4+IChvdXQ6IE91dCwgYTogSUNvbG9yTGlrZSwgb2ZzID0gMCkge1xuICAgICAgICBjb25zdCBzY2FsZSA9IChhIGluc3RhbmNlb2YgQ29sb3IgfHwgYS5hID4gMSkgPyAxIC8gMjU1IDogMTtcbiAgICAgICAgb3V0W29mcyArIDBdID0gYS5yICogc2NhbGU7XG4gICAgICAgIG91dFtvZnMgKyAxXSA9IGEuZyAqIHNjYWxlO1xuICAgICAgICBvdXRbb2ZzICsgMl0gPSBhLmIgKiBzY2FsZTtcbiAgICAgICAgb3V0W29mcyArIDNdID0gYS5hICogc2NhbGU7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmlbDnu4TovazpopzoibJcbiAgICAgKiAhI2VuIEFuIGFycmF5IG9mIGNvbG9ycyB0dXJuXG4gICAgICogQG1ldGhvZCBmcm9tQXJyYXlcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBmcm9tQXJyYXkgPE91dCBleHRlbmRzIElDb2xvckxpa2U+IChhcnI6IElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+LCBvdXQ6IE91dCwgb2ZzID0gMClcbiAgICAgKiBAcGFyYW0gb2ZzIOaVsOe7hOi1t+Wni+WBj+enu+mHj1xuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbUFycmF5PE91dCBleHRlbmRzIElDb2xvckxpa2U+IChhcnI6IElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+LCBvdXQ6IE91dCwgb2ZzID0gMCkge1xuICAgICAgICBvdXQuciA9IGFycltvZnMgKyAwXSAqIDI1NTtcbiAgICAgICAgb3V0LmcgPSBhcnJbb2ZzICsgMV0gKiAyNTU7XG4gICAgICAgIG91dC5iID0gYXJyW29mcyArIDJdICogMjU1O1xuICAgICAgICBvdXQuYSA9IGFycltvZnMgKyAzXSAqIDI1NTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICBfdmFsOiBudW1iZXIgPSAwO1xuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbcj0wXSAtIHJlZCBjb21wb25lbnQgb2YgdGhlIGNvbG9yLCBkZWZhdWx0IHZhbHVlIGlzIDAuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtnPTBdIC0gZ3JlZW4gY29tcG9uZW50IG9mIHRoZSBjb2xvciwgZGVmdWFsdCB2YWx1ZSBpcyAwLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbYj0wXSAtIGJsdWUgY29tcG9uZW50IG9mIHRoZSBjb2xvciwgZGVmYXVsdCB2YWx1ZSBpcyAwLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbYT0yNTVdIC0gYWxwaGEgY29tcG9uZW50IG9mIHRoZSBjb2xvciwgZGVmYXVsdCB2YWx1ZSBpcyAyNTUuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKHI6IENvbG9yIHwgbnVtYmVyID0gMCwgZzogbnVtYmVyID0gMCwgYjogbnVtYmVyID0gMCwgYTogbnVtYmVyID0gMjU1KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGlmICh0eXBlb2YgciA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGcgPSByLmc7XG4gICAgICAgICAgICBiID0gci5iO1xuICAgICAgICAgICAgYSA9IHIuYTtcbiAgICAgICAgICAgIHIgPSByLnI7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl92YWwgPSAoKGEgPDwgMjQpID4+PiAwKSArIChiIDw8IDE2KSArIChnIDw8IDgpICsgcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENsb25lIGEgbmV3IGNvbG9yIGZyb20gdGhlIGN1cnJlbnQgY29sb3IuXG4gICAgICogISN6aCDlhYvpmoblvZPliY3popzoibLjgIJcbiAgICAgKiBAbWV0aG9kIGNsb25lXG4gICAgICogQHJldHVybiB7Q29sb3J9IE5ld2x5IGNyZWF0ZWQgY29sb3IuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgY29sb3IgPSBuZXcgY2MuQ29sb3IoKTtcbiAgICAgKiB2YXIgbmV3Q29sb3IgPSBjb2xvci5jbG9uZSgpOy8vIENvbG9yIHtyOiAwLCBnOiAwLCBiOiAwLCBhOiAyNTV9XG4gICAgICovXG4gICAgY2xvbmUgKCk6IENvbG9yIHtcbiAgICAgICAgdmFyIHJldCA9IG5ldyBDb2xvcigpO1xuICAgICAgICByZXQuX3ZhbCA9IHRoaXMuX3ZhbDtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRPRE9cbiAgICAgKiAhI3poIOWIpOaWreS4pOS4quminOiJsuaYr+WQpuebuOetieOAglxuICAgICAqIEBtZXRob2QgZXF1YWxzXG4gICAgICogQHBhcmFtIHtDb2xvcn0gb3RoZXJcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIGNvbG9yMSA9IGNjLkNvbG9yLldISVRFO1xuICAgICAqIHZhciBjb2xvcjIgPSBuZXcgY2MuQ29sb3IoMjU1LCAyNTUsIDI1NSk7XG4gICAgICogY2MubG9nKGNvbG9yMS5lcXVhbHMoY29sb3IyKSk7IC8vIHRydWU7XG4gICAgICogY29sb3IyID0gY2MuQ29sb3IuUkVEO1xuICAgICAqIGNjLmxvZyhjb2xvcjIuZXF1YWxzKGNvbG9yMSkpOyAvLyBmYWxzZTtcbiAgICAgKi9cbiAgICBlcXVhbHMgKG90aGVyOiBDb2xvcik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gb3RoZXIgJiYgdGhpcy5fdmFsID09PSBvdGhlci5fdmFsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gVE9ET1xuICAgICAqICEjemgg57q/5oCn5o+S5YC8XG4gICAgICogQG1ldGhvZCBsZXJwXG4gICAgICogQHBhcmFtIHtDb2xvcn0gdG9cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmF0aW8gLSB0aGUgaW50ZXJwb2xhdGlvbiBjb2VmZmljaWVudC5cbiAgICAgKiBAcGFyYW0ge0NvbG9yfSBbb3V0XSAtIG9wdGlvbmFsLCB0aGUgcmVjZWl2aW5nIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJuIHtDb2xvcn1cbiAgICAgKiBAZXhhbXBsZSB7QGxpbmsgY29jb3MyZC9jb3JlL3ZhbHVlLXR5cGVzL0NDQ29sb3IvbGVycC5qc31cbiAgICAgKi9cbiAgICBsZXJwICh0bzogQ29sb3IsIHJhdGlvOiBudW1iZXIsIG91dD86IENvbG9yKTogQ29sb3Ige1xuICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IENvbG9yKCk7XG4gICAgICAgIHZhciByID0gdGhpcy5yO1xuICAgICAgICB2YXIgZyA9IHRoaXMuZztcbiAgICAgICAgdmFyIGIgPSB0aGlzLmI7XG4gICAgICAgIHZhciBhID0gdGhpcy5hO1xuICAgICAgICBvdXQuciA9IHIgKyAodG8uciAtIHIpICogcmF0aW87XG4gICAgICAgIG91dC5nID0gZyArICh0by5nIC0gZykgKiByYXRpbztcbiAgICAgICAgb3V0LmIgPSBiICsgKHRvLmIgLSBiKSAqIHJhdGlvO1xuICAgICAgICBvdXQuYSA9IGEgKyAodG8uYSAtIGEpICogcmF0aW87XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gVE9ET1xuICAgICAqICEjemgg6L2s5o2i5Li65pa55L6/6ZiF6K+755qE5a2X56ym5Liy44CCXG4gICAgICogQG1ldGhvZCB0b1N0cmluZ1xuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBjb2xvciA9IGNjLkNvbG9yLldISVRFO1xuICAgICAqIGNvbG9yLnRvU3RyaW5nKCk7IC8vIFwicmdiYSgyNTUsIDI1NSwgMjU1LCAyNTUpXCJcbiAgICAgKi9cbiAgICB0b1N0cmluZyAoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIFwicmdiYShcIiArXG4gICAgICAgICAgICB0aGlzLnIudG9GaXhlZCgpICsgXCIsIFwiICtcbiAgICAgICAgICAgIHRoaXMuZy50b0ZpeGVkKCkgKyBcIiwgXCIgK1xuICAgICAgICAgICAgdGhpcy5iLnRvRml4ZWQoKSArIFwiLCBcIiArXG4gICAgICAgICAgICB0aGlzLmEudG9GaXhlZCgpICsgXCIpXCI7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0IG9yIHNldCByZWQgY2hhbm5lbCB2YWx1ZVxuICAgICAqICEjemgg6I635Y+W5oiW6ICF6K6+572u57qi6Imy6YCa6YGTXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHJcbiAgICAgKi9cbiAgICBnZXQgciAoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UigpO1xuICAgIH1cbiAgICBzZXQgciAodjogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuc2V0Uih2KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldCBvciBzZXQgZ3JlZW4gY2hhbm5lbCB2YWx1ZVxuICAgICAqICEjemgg6I635Y+W5oiW6ICF6K6+572u57u/6Imy6YCa6YGTXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGdcbiAgICAgKi9cbiAgICBnZXQgZyAoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RygpO1xuICAgIH1cbiAgICBzZXQgZyAodjogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuc2V0Ryh2KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldCBvciBzZXQgYmx1ZSBjaGFubmVsIHZhbHVlXG4gICAgICogISN6aCDojrflj5bmiJbogIXorr7nva7ok53oibLpgJrpgZNcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gYlxuICAgICAqL1xuICAgIGdldCBiICgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRCKCk7XG4gICAgfVxuICAgIHNldCBiICh2OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5zZXRCKHYpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0IG9yIHNldCBhbHBoYSBjaGFubmVsIHZhbHVlXG4gICAgICogISN6aCDojrflj5bmiJbogIXorr7nva7pgI/mmI7pgJrpgZNcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gYVxuICAgICAqL1xuICAgIGdldCBhICgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRBKCk7XG4gICAgfVxuICAgIHNldCBhICh2OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5zZXRBKHYpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0cyByZWQgY2hhbm5lbCB2YWx1ZVxuICAgICAqICEjemgg6I635Y+W5b2T5YmN6aKc6Imy55qE57qi6Imy5YC844CCXG4gICAgICogQG1ldGhvZCBnZXRSXG4gICAgICogQHJldHVybiB7TnVtYmVyfSByZWQgdmFsdWUuXG4gICAgICovXG4gICAgZ2V0UiAoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbCAmIDB4MDAwMDAwZmY7XG4gICAgfVxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0cyByZWQgdmFsdWUgYW5kIHJldHVybiB0aGUgY3VycmVudCBjb2xvciBvYmplY3RcbiAgICAgKiAhI3poIOiuvue9ruW9k+WJjeeahOe6ouiJsuWAvO+8jOW5tui/lOWbnuW9k+WJjeWvueixoeOAglxuICAgICAqIEBtZXRob2Qgc2V0UlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSByZWQgLSB0aGUgbmV3IFJlZCBjb21wb25lbnQuXG4gICAgICogQHJldHVybiB7Q29sb3J9IHRoaXMgY29sb3IuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgY29sb3IgPSBuZXcgY2MuQ29sb3IoKTtcbiAgICAgKiBjb2xvci5zZXRSKDI1NSk7IC8vIENvbG9yIHtyOiAyNTUsIGc6IDAsIGI6IDAsIGE6IDI1NX1cbiAgICAgKi9cbiAgICBzZXRSIChyZWQpOiB0aGlzIHtcbiAgICAgICAgcmVkID0gfn5taXNjLmNsYW1wZihyZWQsIDAsIDI1NSk7XG4gICAgICAgIHRoaXMuX3ZhbCA9ICgodGhpcy5fdmFsICYgMHhmZmZmZmYwMCkgfCByZWQpID4+PiAwO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogISNlbiBHZXRzIGdyZWVuIGNoYW5uZWwgdmFsdWVcbiAgICAgKiAhI3poIOiOt+WPluW9k+WJjeminOiJsueahOe7v+iJsuWAvOOAglxuICAgICAqIEBtZXRob2QgZ2V0R1xuICAgICAqIEByZXR1cm4ge051bWJlcn0gZ3JlZW4gdmFsdWUuXG4gICAgICovXG4gICAgZ2V0RyAoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLl92YWwgJiAweDAwMDBmZjAwKSA+PiA4O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgZ3JlZW4gdmFsdWUgYW5kIHJldHVybiB0aGUgY3VycmVudCBjb2xvciBvYmplY3RcbiAgICAgKiAhI3poIOiuvue9ruW9k+WJjeeahOe7v+iJsuWAvO+8jOW5tui/lOWbnuW9k+WJjeWvueixoeOAglxuICAgICAqIEBtZXRob2Qgc2V0R1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBncmVlbiAtIHRoZSBuZXcgR3JlZW4gY29tcG9uZW50LlxuICAgICAqIEByZXR1cm4ge0NvbG9yfSB0aGlzIGNvbG9yLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIGNvbG9yID0gbmV3IGNjLkNvbG9yKCk7XG4gICAgICogY29sb3Iuc2V0RygyNTUpOyAvLyBDb2xvciB7cjogMCwgZzogMjU1LCBiOiAwLCBhOiAyNTV9XG4gICAgICovXG4gICAgc2V0RyAoZ3JlZW4pOiB0aGlzIHtcbiAgICAgICAgZ3JlZW4gPSB+fm1pc2MuY2xhbXBmKGdyZWVuLCAwLCAyNTUpO1xuICAgICAgICB0aGlzLl92YWwgPSAoKHRoaXMuX3ZhbCAmIDB4ZmZmZjAwZmYpIHwgKGdyZWVuIDw8IDgpKSA+Pj4gMDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0cyBibHVlIGNoYW5uZWwgdmFsdWVcbiAgICAgKiAhI3poIOiOt+WPluW9k+WJjeminOiJsueahOiTneiJsuWAvOOAglxuICAgICAqIEBtZXRob2QgZ2V0QlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gYmx1ZSB2YWx1ZS5cbiAgICAgKi9cbiAgICBnZXRCICgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gKHRoaXMuX3ZhbCAmIDB4MDBmZjAwMDApID4+IDE2O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgYmx1ZSB2YWx1ZSBhbmQgcmV0dXJuIHRoZSBjdXJyZW50IGNvbG9yIG9iamVjdFxuICAgICAqICEjemgg6K6+572u5b2T5YmN55qE6JOd6Imy5YC877yM5bm26L+U5Zue5b2T5YmN5a+56LGh44CCXG4gICAgICogQG1ldGhvZCBzZXRCXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGJsdWUgLSB0aGUgbmV3IEJsdWUgY29tcG9uZW50LlxuICAgICAqIEByZXR1cm4ge0NvbG9yfSB0aGlzIGNvbG9yLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIGNvbG9yID0gbmV3IGNjLkNvbG9yKCk7XG4gICAgICogY29sb3Iuc2V0QigyNTUpOyAvLyBDb2xvciB7cjogMCwgZzogMCwgYjogMjU1LCBhOiAyNTV9XG4gICAgICovXG4gICAgc2V0QiAoYmx1ZSk6IHRoaXMge1xuICAgICAgICBibHVlID0gfn5taXNjLmNsYW1wZihibHVlLCAwLCAyNTUpO1xuICAgICAgICB0aGlzLl92YWwgPSAoKHRoaXMuX3ZhbCAmIDB4ZmYwMGZmZmYpIHwgKGJsdWUgPDwgMTYpKSA+Pj4gMDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0cyBhbHBoYSBjaGFubmVsIHZhbHVlXG4gICAgICogISN6aCDojrflj5blvZPliY3popzoibLnmoTpgI/mmI7luqblgLzjgIJcbiAgICAgKiBAbWV0aG9kIGdldEFcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IGFscGhhIHZhbHVlLlxuICAgICAqL1xuICAgIGdldEEgKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiAodGhpcy5fdmFsICYgMHhmZjAwMDAwMCkgPj4+IDI0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgYWxwaGEgdmFsdWUgYW5kIHJldHVybiB0aGUgY3VycmVudCBjb2xvciBvYmplY3RcbiAgICAgKiAhI3poIOiuvue9ruW9k+WJjeeahOmAj+aYjuW6pu+8jOW5tui/lOWbnuW9k+WJjeWvueixoeOAglxuICAgICAqIEBtZXRob2Qgc2V0QVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBhbHBoYSAtIHRoZSBuZXcgQWxwaGEgY29tcG9uZW50LlxuICAgICAqIEByZXR1cm4ge0NvbG9yfSB0aGlzIGNvbG9yLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIGNvbG9yID0gbmV3IGNjLkNvbG9yKCk7XG4gICAgICogY29sb3Iuc2V0QSgwKTsgLy8gQ29sb3Ige3I6IDAsIGc6IDAsIGI6IDAsIGE6IDB9XG4gICAgICovXG4gICAgc2V0QSAoYWxwaGEpOiB0aGlzIHtcbiAgICAgICAgYWxwaGEgPSB+fm1pc2MuY2xhbXBmKGFscGhhLCAwLCAyNTUpO1xuICAgICAgICB0aGlzLl92YWwgPSAoKHRoaXMuX3ZhbCAmIDB4MDBmZmZmZmYpIHwgKGFscGhhIDw8IDI0KSkgPj4+IDA7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gQ29udmVydCBjb2xvciB0byBjc3MgZm9ybWF0LlxuICAgICAqICEjemgg6L2s5o2i5Li6IENTUyDmoLzlvI/jgIJcbiAgICAgKiBAbWV0aG9kIHRvQ1NTXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdCAtIFwicmdiYVwiLCBcInJnYlwiLCBcIiNyZ2JcIiBvciBcIiNycmdnYmJcIi5cbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICogQGV4YW1wbGUge0BsaW5rIGNvY29zMmQvY29yZS92YWx1ZS10eXBlcy9DQ0NvbG9yL3RvQ1NTLmpzfVxuICAgICAqL1xuICAgIHRvQ1NTIChvcHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmIChvcHQgPT09ICdyZ2JhJykge1xuICAgICAgICAgICAgcmV0dXJuIFwicmdiYShcIiArXG4gICAgICAgICAgICAgICAgKHRoaXMuciB8IDApICsgXCIsXCIgK1xuICAgICAgICAgICAgICAgICh0aGlzLmcgfCAwKSArIFwiLFwiICtcbiAgICAgICAgICAgICAgICAodGhpcy5iIHwgMCkgKyBcIixcIiArXG4gICAgICAgICAgICAgICAgKHRoaXMuYSAvIDI1NSkudG9GaXhlZCgyKSArIFwiKVwiXG4gICAgICAgICAgICAgICAgO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG9wdCA9PT0gJ3JnYicpIHtcbiAgICAgICAgICAgIHJldHVybiBcInJnYihcIiArXG4gICAgICAgICAgICAgICAgKHRoaXMuciB8IDApICsgXCIsXCIgK1xuICAgICAgICAgICAgICAgICh0aGlzLmcgfCAwKSArIFwiLFwiICtcbiAgICAgICAgICAgICAgICAodGhpcy5iIHwgMCkgKyBcIilcIlxuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAnIycgKyB0aGlzLnRvSEVYKG9wdCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJlYWQgaGV4IHN0cmluZyBhbmQgc3RvcmUgY29sb3IgZGF0YSBpbnRvIHRoZSBjdXJyZW50IGNvbG9yIG9iamVjdCwgdGhlIGhleCBzdHJpbmcgbXVzdCBiZSBmb3JtYXRlZCBhcyByZ2JhIG9yIHJnYi5cbiAgICAgKiAhI3poIOivu+WPliAxNiDov5vliLbpopzoibLjgIJcbiAgICAgKiBAbWV0aG9kIGZyb21IRVhcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gaGV4U3RyaW5nXG4gICAgICogQHJldHVybiB7Q29sb3J9XG4gICAgICogQGNoYWluYWJsZVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIGNvbG9yID0gY2MuQ29sb3IuQkxBQ0s7XG4gICAgICogY29sb3IuZnJvbUhFWChcIiNGRkZGMzNcIik7IC8vIENvbG9yIHtyOiAyNTUsIGc6IDI1NSwgYjogNTEsIGE6IDI1NX07XG4gICAgICovXG4gICAgZnJvbUhFWCAoaGV4U3RyaW5nOiBzdHJpbmcpOiB0aGlzIHtcbiAgICAgICAgaGV4U3RyaW5nID0gKGhleFN0cmluZy5pbmRleE9mKCcjJykgPT09IDApID8gaGV4U3RyaW5nLnN1YnN0cmluZygxKSA6IGhleFN0cmluZztcbiAgICAgICAgbGV0IHIgPSBwYXJzZUludChoZXhTdHJpbmcuc3Vic3RyKDAsIDIpLCAxNikgfHwgMDtcbiAgICAgICAgbGV0IGcgPSBwYXJzZUludChoZXhTdHJpbmcuc3Vic3RyKDIsIDIpLCAxNikgfHwgMDtcbiAgICAgICAgbGV0IGIgPSBwYXJzZUludChoZXhTdHJpbmcuc3Vic3RyKDQsIDIpLCAxNikgfHwgMDtcbiAgICAgICAgbGV0IGEgPSBwYXJzZUludChoZXhTdHJpbmcuc3Vic3RyKDYsIDIpLCAxNikgfHwgMjU1O1xuICAgICAgICB0aGlzLl92YWwgPSAoKGEgPDwgMjQpID4+PiAwKSArIChiIDw8IDE2KSArIChnIDw8IDgpICsgcjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBjb252ZXJ0IENvbG9yIHRvIEhFWCBjb2xvciBzdHJpbmcuXG4gICAgICogZS5nLiAgY2MuY29sb3IoMjU1LDYsMjU1KSAgdG8gOiBcIiNmZjA2ZmZcIlxuICAgICAqICEjemgg6L2s5o2i5Li6IDE2IOi/m+WItuOAglxuICAgICAqIEBtZXRob2QgdG9IRVhcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZm10IC0gXCIjcmdiXCIsIFwiI3JyZ2diYlwiIG9yIFwiI3JyZ2diYmFhXCIuXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIGNvbG9yID0gY2MuQ29sb3IuQkxBQ0s7XG4gICAgICogY29sb3IudG9IRVgoXCIjcmdiXCIpOyAgICAgLy8gXCIwMDBcIjtcbiAgICAgKiBjb2xvci50b0hFWChcIiNycmdnYmJcIik7ICAvLyBcIjAwMDAwMFwiO1xuICAgICAqL1xuICAgIHRvSEVYIChmbXQpOiBzdHJpbmcge1xuICAgICAgICBsZXQgcHJlZml4ID0gJzAnO1xuICAgICAgICBsZXQgaGV4ID0gW1xuICAgICAgICAgICAgKHRoaXMuciA8IDE2ID8gcHJlZml4IDogJycpICsgKHRoaXMuciB8IDApLnRvU3RyaW5nKDE2KSxcbiAgICAgICAgICAgICh0aGlzLmcgPCAxNiA/IHByZWZpeCA6ICcnKSArICh0aGlzLmcgfCAwKS50b1N0cmluZygxNiksXG4gICAgICAgICAgICAodGhpcy5iIDwgMTYgPyBwcmVmaXggOiAnJykgKyAodGhpcy5iIHwgMCkudG9TdHJpbmcoMTYpLFxuICAgICAgICBdO1xuICAgICAgICB2YXIgaSA9IC0xO1xuICAgICAgICBpZiAoZm10ID09PSAnI3JnYicpIHtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBoZXgubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBpZiAoaGV4W2ldLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaGV4W2ldID0gaGV4W2ldWzBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChmbXQgPT09ICcjcnJnZ2JiJykge1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGhleC5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGlmIChoZXhbaV0ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGhleFtpXSA9ICcwJyArIGhleFtpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZm10ID09PSAnI3JyZ2diYmFhJykge1xuICAgICAgICAgICAgaGV4LnB1c2goKHRoaXMuYSA8IDE2ID8gcHJlZml4IDogJycpICsgKHRoaXMuYSB8IDApLnRvU3RyaW5nKDE2KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhleC5qb2luKCcnKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogISNlbiBDb252ZXJ0IHRvIDI0Yml0IHJnYiB2YWx1ZS5cbiAgICAgKiAhI3poIOi9rOaNouS4uiAyNGJpdCDnmoQgUkdCIOWAvOOAglxuICAgICAqIEBtZXRob2QgdG9SR0JWYWx1ZVxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBjb2xvciA9IGNjLkNvbG9yLllFTExPVztcbiAgICAgKiBjb2xvci50b1JHQlZhbHVlKCk7IC8vIDE2NzcxODQ0O1xuICAgICAqL1xuICAgIHRvUkdCVmFsdWUgKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl92YWwgJiAweDAwZmZmZmZmO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gUmVhZCBIU1YgbW9kZWwgY29sb3IgYW5kIGNvbnZlcnQgdG8gUkdCIGNvbG9yXG4gICAgICogISN6aCDor7vlj5YgSFNW77yI6Imy5b2p5qih5Z6L77yJ5qC85byP44CCXG4gICAgICogQG1ldGhvZCBmcm9tSFNWXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGhcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gc1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB2XG4gICAgICogQHJldHVybiB7Q29sb3J9XG4gICAgICogQGNoYWluYWJsZVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIGNvbG9yID0gY2MuQ29sb3IuWUVMTE9XO1xuICAgICAqIGNvbG9yLmZyb21IU1YoMCwgMCwgMSk7IC8vIENvbG9yIHtyOiAyNTUsIGc6IDI1NSwgYjogMjU1LCBhOiAyNTV9O1xuICAgICAqL1xuICAgIGZyb21IU1YgKGgsIHMsIHYpOiB0aGlzIHtcbiAgICAgICAgdmFyIHIsIGcsIGI7XG4gICAgICAgIGlmIChzID09PSAwKSB7XG4gICAgICAgICAgICByID0gZyA9IGIgPSB2O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHYgPT09IDApIHtcbiAgICAgICAgICAgICAgICByID0gZyA9IGIgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGggPT09IDEpIGggPSAwO1xuICAgICAgICAgICAgICAgIGggKj0gNjtcbiAgICAgICAgICAgICAgICBzID0gcztcbiAgICAgICAgICAgICAgICB2ID0gdjtcbiAgICAgICAgICAgICAgICB2YXIgaSA9IE1hdGguZmxvb3IoaCk7XG4gICAgICAgICAgICAgICAgdmFyIGYgPSBoIC0gaTtcbiAgICAgICAgICAgICAgICB2YXIgcCA9IHYgKiAoMSAtIHMpO1xuICAgICAgICAgICAgICAgIHZhciBxID0gdiAqICgxIC0gKHMgKiBmKSk7XG4gICAgICAgICAgICAgICAgdmFyIHQgPSB2ICogKDEgLSAocyAqICgxIC0gZikpKTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgciA9IHY7XG4gICAgICAgICAgICAgICAgICAgICAgICBnID0gdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGIgPSBwO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgciA9IHE7XG4gICAgICAgICAgICAgICAgICAgICAgICBnID0gdjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGIgPSBwO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgciA9IHA7XG4gICAgICAgICAgICAgICAgICAgICAgICBnID0gdjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGIgPSB0O1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICAgICAgciA9IHA7XG4gICAgICAgICAgICAgICAgICAgICAgICBnID0gcTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGIgPSB2O1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICAgICAgciA9IHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBnID0gcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGIgPSB2O1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgICAgICAgICAgciA9IHY7XG4gICAgICAgICAgICAgICAgICAgICAgICBnID0gcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGIgPSBxO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHIgKj0gMjU1O1xuICAgICAgICBnICo9IDI1NTtcbiAgICAgICAgYiAqPSAyNTU7XG4gICAgICAgIHRoaXMuX3ZhbCA9ICgodGhpcy5hIDw8IDI0KSA+Pj4gMCkgKyAoYiA8PCAxNikgKyAoZyA8PCA4KSArIHI7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gVHJhbnNmb3JtIHRvIEhTViBtb2RlbCBjb2xvclxuICAgICAqICEjemgg6L2s5o2i5Li6IEhTVu+8iOiJsuW9qeaooeWei++8ieagvOW8j+OAglxuICAgICAqIEBtZXRob2QgdG9IU1ZcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IC0ge2g6IG51bWJlciwgczogbnVtYmVyLCB2OiBudW1iZXJ9LlxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIGNvbG9yID0gY2MuQ29sb3IuWUVMTE9XO1xuICAgICAqIGNvbG9yLnRvSFNWKCk7IC8vIE9iamVjdCB7aDogMC4xNTMzODY0NTQxODMyNjY5LCBzOiAwLjk4NDMxMzcyNTQ5MDE5NjEsIHY6IDF9O1xuICAgICAqL1xuICAgIHRvSFNWICgpIHtcbiAgICAgICAgdmFyIHIgPSB0aGlzLnIgLyAyNTU7XG4gICAgICAgIHZhciBnID0gdGhpcy5nIC8gMjU1O1xuICAgICAgICB2YXIgYiA9IHRoaXMuYiAvIDI1NTtcbiAgICAgICAgdmFyIGhzdiA9IHsgaDogMCwgczogMCwgdjogMCB9O1xuICAgICAgICB2YXIgbWF4ID0gTWF0aC5tYXgociwgZywgYik7XG4gICAgICAgIHZhciBtaW4gPSBNYXRoLm1pbihyLCBnLCBiKTtcbiAgICAgICAgdmFyIGRlbHRhID0gMDtcbiAgICAgICAgaHN2LnYgPSBtYXg7XG4gICAgICAgIGhzdi5zID0gbWF4ID8gKG1heCAtIG1pbikgLyBtYXggOiAwO1xuICAgICAgICBpZiAoIWhzdi5zKSBoc3YuaCA9IDA7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZGVsdGEgPSBtYXggLSBtaW47XG4gICAgICAgICAgICBpZiAociA9PT0gbWF4KSBoc3YuaCA9IChnIC0gYikgLyBkZWx0YTtcbiAgICAgICAgICAgIGVsc2UgaWYgKGcgPT09IG1heCkgaHN2LmggPSAyICsgKGIgLSByKSAvIGRlbHRhO1xuICAgICAgICAgICAgZWxzZSBoc3YuaCA9IDQgKyAociAtIGcpIC8gZGVsdGE7XG4gICAgICAgICAgICBoc3YuaCAvPSA2O1xuICAgICAgICAgICAgaWYgKGhzdi5oIDwgMCkgaHN2LmggKz0gMS4wO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoc3Y7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgdGhlIGNvbG9yXG4gICAgICogISN6aCDorr7nva7popzoibJcbiAgICAgKiBAbWV0aG9kIHNldFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc2V0IChjb2xvcjogQ29sb3IpOiBDb2xvclxuICAgICAqIEBwYXJhbSB7Q29sb3J9IGNvbG9yIFxuICAgICAqL1xuICAgIHNldCAoY29sb3I6IENvbG9yKTogdGhpcyB7XG4gICAgICAgIGlmIChjb2xvci5fdmFsKSB7XG4gICAgICAgICAgICB0aGlzLl92YWwgPSBjb2xvci5fdmFsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yID0gY29sb3IucjtcbiAgICAgICAgICAgIHRoaXMuZyA9IGNvbG9yLmc7XG4gICAgICAgICAgICB0aGlzLmIgPSBjb2xvci5iO1xuICAgICAgICAgICAgdGhpcy5hID0gY29sb3IuYTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBfZmFzdFNldEEgKGFscGhhKSB7XG4gICAgICAgIHRoaXMuX3ZhbCA9ICgodGhpcy5fdmFsICYgMHgwMGZmZmZmZikgfCAoYWxwaGEgPDwgMjQpKSA+Pj4gMDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIE11bHRpcGxpZXMgdGhlIGN1cnJlbnQgY29sb3IgYnkgdGhlIHNwZWNpZmllZCBjb2xvclxuICAgICAqICEjemgg5bCG5b2T5YmN6aKc6Imy5LmY5Lul5LiO5oyH5a6a6aKc6ImyXG4gICAgICogQG1ldGhvZCBtdWx0aXBseVxuICAgICAqIEByZXR1cm4ge0NvbG9yfVxuICAgICAqIEBwYXJhbSB7Q29sb3J9IG90aGVyXG4gICAgICovXG4gICAgbXVsdGlwbHkgKG90aGVyOiBDb2xvcikge1xuICAgICAgICBsZXQgciA9ICgodGhpcy5fdmFsICYgMHgwMDAwMDBmZikgKiBvdGhlci5yKSA+PiA4O1xuICAgICAgICBsZXQgZyA9ICgodGhpcy5fdmFsICYgMHgwMDAwZmYwMCkgKiBvdGhlci5nKSA+PiA4O1xuICAgICAgICBsZXQgYiA9ICgodGhpcy5fdmFsICYgMHgwMGZmMDAwMCkgKiBvdGhlci5iKSA+PiA4O1xuICAgICAgICBsZXQgYSA9ICgodGhpcy5fdmFsICYgMHhmZjAwMDAwMCkgPj4+IDgpICogb3RoZXIuYTtcbiAgICAgICAgdGhpcy5fdmFsID0gKGEgJiAweGZmMDAwMDAwKSB8IChiICYgMHgwMGZmMDAwMCkgfCAoZyAmIDB4MDAwMGZmMDApIHwgKHIgJiAweDAwMDAwMGZmKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuXG5DQ0NsYXNzLmZhc3REZWZpbmUoJ2NjLkNvbG9yJywgQ29sb3IsIHsgcjogMCwgZzogMCwgYjogMCwgYTogMjU1IH0pO1xuXG5cbmNjLkNvbG9yID0gQ29sb3I7XG5cbi8qKlxuICogQG1vZHVsZSBjY1xuICovXG5cbi8qKlxuICogISNlblxuICogVGhlIGNvbnZlbmllbmNlIG1ldGhvZCB0byBjcmVhdGUgYSBuZXcge3sjY3Jvc3NMaW5rIFwiQ29sb3IvQ29sb3I6bWV0aG9kXCJ9fWNjLkNvbG9ye3svY3Jvc3NMaW5rfX1cbiAqIEFscGhhIGNoYW5uZWwgaXMgb3B0aW9uYWwuIERlZmF1bHQgdmFsdWUgaXMgMjU1LlxuICpcbiAqICEjemhcbiAqIOmAmui/h+ivpeaWueazleadpeWIm+W7uuS4gOS4quaWsOeahCB7eyNjcm9zc0xpbmsgXCJDb2xvci9Db2xvcjptZXRob2RcIn19Y2MuQ29sb3J7ey9jcm9zc0xpbmt9fSDlr7nosaHjgIJcbiAqIEFscGhhIOmAmumBk+aYr+WPr+mAieeahOOAgum7mOiupOWAvOaYryAyNTXjgIJcbiAqXG4gKiBAbWV0aG9kIGNvbG9yXG4gKiBAcGFyYW0ge051bWJlcn0gW3I9MF1cbiAqIEBwYXJhbSB7TnVtYmVyfSBbZz0wXVxuICogQHBhcmFtIHtOdW1iZXJ9IFtiPTBdXG4gKiBAcGFyYW0ge051bWJlcn0gW2E9MjU1XVxuICogQHJldHVybiB7Q29sb3J9XG4gKiBAZXhhbXBsZSB7QGxpbmsgY29jb3MyZC9jb3JlL3ZhbHVlLXR5cGVzL0NDQ29sb3IvY29sb3IuanN9XG4gKi9cbmNjLmNvbG9yID0gZnVuY3Rpb24gY29sb3IgKHIsIGcsIGIsIGEpIHtcbiAgICBpZiAodHlwZW9mIHIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBuZXcgQ29sb3IoKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5mcm9tSEVYKHIpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHIgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ29sb3Ioci5yLCByLmcsIHIuYiwgci5hKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBDb2xvcihyLCBnLCBiLCBhKTtcbn07XG4iXX0=