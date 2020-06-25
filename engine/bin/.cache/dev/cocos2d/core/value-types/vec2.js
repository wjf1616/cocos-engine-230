
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/value-types/vec2.js';
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

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _x = 0.0;
var _y = 0.0;
/**
 * !#en Representation of 2D vectors and points.
 * !#zh 表示 2D 向量和坐标
 *
 * @class Vec2
 * @extends ValueType
 */

var Vec2 =
/*#__PURE__*/
function (_ValueType) {
  _inheritsLoose(Vec2, _ValueType);

  var _proto = Vec2.prototype;

  // deprecated
  _proto.sub = function sub(vector, out) {
    return Vec2.subtract(out || new Vec2(), this, vector);
  };

  _proto.mul = function mul(num, out) {
    return Vec2.multiplyScalar(out || new Vec2(), this, num);
  };

  _proto.div = function div(vector, out) {
    return Vec2.divide(out || new Vec2(), this, vector);
  };

  _proto.scale = function scale(vector, out) {
    return Vec2.multiply(out || new Vec2(), this, vector);
  };

  _proto.neg = function neg(out) {
    return Vec2.negate(out || new Vec2(), this);
  }
  /**
   * !#en return a Vec2 object with x = 1 and y = 1.
   * !#zh 新 Vec2 对象。
   * @property ONE
   * @type Vec2
   * @static
   */
  ;

  /**
   * !#zh 获得指定向量的拷贝
   * @method clone
   * @typescript
   * static clone <Out extends IVec2Like> (a: Out)
   * @static
   */
  Vec2.clone = function clone(a) {
    return new Vec2(a.x, a.y);
  }
  /**
   * !#zh 复制指定向量的值
   * @method copy
   * @typescript
   * static copy <Out extends IVec2Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec2.copy = function copy(out, a) {
    out.x = a.x;
    out.y = a.y;
    return out;
  }
  /**
   * !#zh  设置向量值
   * @method set
   * @typescript
   * static set <Out extends IVec2Like> (out: Out, x: number, y: number)
   * @static
   */
  ;

  Vec2.set = function set(out, x, y) {
    out.x = x;
    out.y = y;
    return out;
  }
  /**
   * !#zh 逐元素向量加法
   * @method add
   * @typescript
   * static add <Out extends IVec2Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Vec2.add = function add(out, a, b) {
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    return out;
  }
  /**
   * !#zh 逐元素向量减法
   * @method subtract
   * @typescript
   * static subtract <Out extends IVec2Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Vec2.subtract = function subtract(out, a, b) {
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    return out;
  }
  /**
   * !#zh 逐元素向量乘法
   * @method multiply
   * @typescript
   * static multiply <Out extends IVec2Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Vec2.multiply = function multiply(out, a, b) {
    out.x = a.x * b.x;
    out.y = a.y * b.y;
    return out;
  }
  /**
   * !#zh 逐元素向量除法
   * @method divide
   * @typescript
   * static divide <Out extends IVec2Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Vec2.divide = function divide(out, a, b) {
    out.x = a.x / b.x;
    out.y = a.y / b.y;
    return out;
  }
  /**
   * !#zh 逐元素向量向上取整
   * @method ceil
   * @typescript
   * static ceil <Out extends IVec2Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec2.ceil = function ceil(out, a) {
    out.x = Math.ceil(a.x);
    out.y = Math.ceil(a.y);
    return out;
  }
  /**
   * !#zh 逐元素向量向下取整
   * @method ceil
   * @typescript
   * static floor <Out extends IVec2Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec2.floor = function floor(out, a) {
    out.x = Math.floor(a.x);
    out.y = Math.floor(a.y);
    return out;
  }
  /**
   * !#zh 逐元素向量最小值
   * @method min
   * @typescript
   * static min <Out extends IVec2Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Vec2.min = function min(out, a, b) {
    out.x = Math.min(a.x, b.x);
    out.y = Math.min(a.y, b.y);
    return out;
  }
  /**
   * !#zh 逐元素向量最大值
   * @method max
   * @typescript
   * static max <Out extends IVec2Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Vec2.max = function max(out, a, b) {
    out.x = Math.max(a.x, b.x);
    out.y = Math.max(a.y, b.y);
    return out;
  }
  /**
   * !#zh 逐元素向量四舍五入取整
   * @method round
   * @typescript
   * static round <Out extends IVec2Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec2.round = function round(out, a) {
    out.x = Math.round(a.x);
    out.y = Math.round(a.y);
    return out;
  }
  /**
   * !#zh 向量标量乘法
   * @method multiplyScalar
   * @typescript
   * static multiplyScalar <Out extends IVec2Like> (out: Out, a: Out, b: number)
   * @static
   */
  ;

  Vec2.multiplyScalar = function multiplyScalar(out, a, b) {
    out.x = a.x * b;
    out.y = a.y * b;
    return out;
  }
  /**
   * !#zh 逐元素向量乘加: A + B * scale
   * @method scaleAndAdd
   * @typescript
   * static scaleAndAdd <Out extends IVec2Like> (out: Out, a: Out, b: Out, scale: number)
   * @static
   */
  ;

  Vec2.scaleAndAdd = function scaleAndAdd(out, a, b, scale) {
    out.x = a.x + b.x * scale;
    out.y = a.y + b.y * scale;
    return out;
  }
  /**
   * !#zh 求两向量的欧氏距离
   * @method distance
   * @typescript
   * static distance <Out extends IVec2Like> (a: Out, b: Out)
   * @static
   */
  ;

  Vec2.distance = function distance(a, b) {
    _x = b.x - a.x;
    _y = b.y - a.y;
    return Math.sqrt(_x * _x + _y * _y);
  }
  /**
   * !#zh 求两向量的欧氏距离平方
   * @method squaredDistance
   * @typescript
   * static squaredDistance <Out extends IVec2Like> (a: Out, b: Out)
   * @static
   */
  ;

  Vec2.squaredDistance = function squaredDistance(a, b) {
    _x = b.x - a.x;
    _y = b.y - a.y;
    return _x * _x + _y * _y;
  }
  /**
   * !#zh 求向量长度
   * @method len
   * @typescript
   * static len <Out extends IVec2Like> (a: Out)
   * @static
   */
  ;

  Vec2.len = function len(a) {
    _x = a.x;
    _y = a.y;
    return Math.sqrt(_x * _x + _y * _y);
  }
  /**
   * !#zh 求向量长度平方
   * @method lengthSqr
   * @typescript
   * static lengthSqr <Out extends IVec2Like> (a: Out)
   * @static
   */
  ;

  Vec2.lengthSqr = function lengthSqr(a) {
    _x = a.x;
    _y = a.y;
    return _x * _x + _y * _y;
  }
  /**
   * !#zh 逐元素向量取负
   * @method negate
   * @typescript
   * static negate <Out extends IVec2Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec2.negate = function negate(out, a) {
    out.x = -a.x;
    out.y = -a.y;
    return out;
  }
  /**
   * !#zh 逐元素向量取倒数，接近 0 时返回 Infinity
   * @method inverse
   * @typescript
   * static inverse <Out extends IVec2Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec2.inverse = function inverse(out, a) {
    out.x = 1.0 / a.x;
    out.y = 1.0 / a.y;
    return out;
  }
  /**
   * !#zh 逐元素向量取倒数，接近 0 时返回 0
   * @method inverseSafe
   * @typescript
   * static inverseSafe <Out extends IVec2Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec2.inverseSafe = function inverseSafe(out, a) {
    _x = a.x;
    _y = a.y;

    if (Math.abs(_x) < _utils.EPSILON) {
      out.x = 0;
    } else {
      out.x = 1.0 / _x;
    }

    if (Math.abs(_y) < _utils.EPSILON) {
      out.y = 0;
    } else {
      out.y = 1.0 / _y;
    }

    return out;
  }
  /**
   * !#zh 归一化向量
   * @method normalize
   * @typescript
   * static normalize <Out extends IVec2Like, Vec2Like extends IVec2Like> (out: Out, a: Vec2Like)
   * @static
   */
  ;

  Vec2.normalize = function normalize(out, a) {
    _x = a.x;
    _y = a.y;
    var len = _x * _x + _y * _y;

    if (len > 0) {
      len = 1 / Math.sqrt(len);
      out.x = _x * len;
      out.y = _y * len;
    }

    return out;
  }
  /**
   * !#zh 向量点积（数量积）
   * @method dot
   * @typescript
   * static dot <Out extends IVec2Like> (a: Out, b: Out)
   * @static
   */
  ;

  Vec2.dot = function dot(a, b) {
    return a.x * b.x + a.y * b.y;
  }
  /**
   * !#zh 向量叉积（向量积），注意二维向量的叉积为与 Z 轴平行的三维向量
   * @method cross
   * @typescript
   * static cross <Out extends IVec2Like> (out: Vec2, a: Out, b: Out)
   * @static
   */
  ;

  Vec2.cross = function cross(out, a, b) {
    out.x = out.y = 0;
    out.z = a.x * b.y - a.y * b.x;
    return out;
  }
  /**
   * !#zh 逐元素向量线性插值： A + t * (B - A)
   * @method lerp
   * @typescript
   * static lerp <Out extends IVec2Like> (out: Out, a: Out, b: Out, t: number)
   * @static
   */
  ;

  Vec2.lerp = function lerp(out, a, b, t) {
    _x = a.x;
    _y = a.y;
    out.x = _x + t * (b.x - _x);
    out.y = _y + t * (b.y - _y);
    return out;
  }
  /**
   * !#zh 生成一个在单位圆上均匀分布的随机向量
   * @method random
   * @typescript
   * static random <Out extends IVec2Like> (out: Out, scale?: number)
   * @static
   */
  ;

  Vec2.random = function random(out, scale) {
    scale = scale || 1.0;
    var r = (0, _utils.random)() * 2.0 * Math.PI;
    out.x = Math.cos(r) * scale;
    out.y = Math.sin(r) * scale;
    return out;
  }
  /**
   * !#zh 向量与三维矩阵乘法，默认向量第三位为 1。
   * @method transformMat3
   * @typescript
   * static transformMat3 <Out extends IVec2Like, MatLike extends IMat3Like> (out: Out, a: Out, mat: IMat3Like)
   * @static
   */
  ;

  Vec2.transformMat3 = function transformMat3(out, a, mat) {
    _x = a.x;
    _y = a.y;
    var m = mat.m;
    out.x = m[0] * _x + m[3] * _y + m[6];
    out.y = m[1] * _x + m[4] * _y + m[7];
    return out;
  }
  /**
   * !#zh 向量与四维矩阵乘法，默认向量第三位为 0，第四位为 1。
   * @method transformMat4
   * @typescript
   * static transformMat4 <Out extends IVec2Like, MatLike extends IMat4Like> (out: Out, a: Out, mat: MatLike)
   * @static
   */
  ;

  Vec2.transformMat4 = function transformMat4(out, a, mat) {
    _x = a.x;
    _y = a.y;
    var m = mat.m;
    out.x = m[0] * _x + m[4] * _y + m[12];
    out.y = m[1] * _x + m[5] * _y + m[13];
    return out;
  }
  /**
   * !#zh 向量等价判断
   * @method strictEquals
   * @typescript
   * static strictEquals <Out extends IVec2Like> (a: Out, b: Out)
   * @static
   */
  ;

  Vec2.strictEquals = function strictEquals(a, b) {
    return a.x === b.x && a.y === b.y;
  }
  /**
   * !#zh 排除浮点数误差的向量近似等价判断
   * @method equals
   * @typescript
   * static equals <Out extends IVec2Like> (a: Out, b: Out,  epsilon = EPSILON)
   * @static
   */
  ;

  Vec2.equals = function equals(a, b, epsilon) {
    if (epsilon === void 0) {
      epsilon = _utils.EPSILON;
    }

    return Math.abs(a.x - b.x) <= epsilon * Math.max(1.0, Math.abs(a.x), Math.abs(b.x)) && Math.abs(a.y - b.y) <= epsilon * Math.max(1.0, Math.abs(a.y), Math.abs(b.y));
  }
  /**
   * !#zh 排除浮点数误差的向量近似等价判断
   * @method angle
   * @typescript
   * static angle <Out extends IVec2Like> (a: Out, b: Out)
   * @static
   */
  ;

  Vec2.angle = function angle(a, b) {
    Vec2.normalize(v2_1, a);
    Vec2.normalize(v2_2, b);
    var cosine = Vec2.dot(v2_1, v2_2);

    if (cosine > 1.0) {
      return 0;
    }

    if (cosine < -1.0) {
      return Math.PI;
    }

    return Math.acos(cosine);
  }
  /**
   * !#zh 向量转数组
   * @method toArray
   * @typescript
   * static toArray <Out extends IWritableArrayLike<number>> (out: Out, v: IVec2Like, ofs = 0)
   * @static
   */
  ;

  Vec2.toArray = function toArray(out, v, ofs) {
    if (ofs === void 0) {
      ofs = 0;
    }

    out[ofs + 0] = v.x;
    out[ofs + 1] = v.y;
    return out;
  }
  /**
   * !#zh 数组转向量
   * @method fromArray
   * @typescript
   * static fromArray <Out extends IVec2Like> (out: Out, arr: IWritableArrayLike<number>, ofs = 0)
   * @static
   */
  ;

  Vec2.fromArray = function fromArray(out, arr, ofs) {
    if (ofs === void 0) {
      ofs = 0;
    }

    out.x = arr[ofs + 0];
    out.y = arr[ofs + 1];
    return out;
  }
  /**
   * @property {Number} x
   */
  ;

  _createClass(Vec2, null, [{
    key: "ONE",
    get: function get() {
      return new Vec2(1, 1);
    }
  }, {
    key: "ZERO",

    /**
     * !#en return a Vec2 object with x = 0 and y = 0.
     * !#zh 返回 x = 0 和 y = 0 的 Vec2 对象。
     * @property {Vec2} ZERO
     * @static
     */
    get: function get() {
      return new Vec2(0, 0);
    }
  }, {
    key: "UP",

    /**
     * !#en return a Vec2 object with x = 0 and y = 1.
     * !#zh 返回 x = 0 和 y = 1 的 Vec2 对象。
     * @property {Vec2} UP
     * @static
     */
    get: function get() {
      return new Vec2(0, 1);
    }
  }, {
    key: "RIGHT",

    /**
     * !#en return a readonly Vec2 object with x = 1 and y = 0.
     * !#zh 返回 x = 1 和 y = 0 的 Vec2 只读对象。
     * @property {Vec2} RIGHT
     * @static
     */
    get: function get() {
      return new Vec2(1, 0);
    }
  }]);

  /**
   * !#en
   * Constructor
   * see {{#crossLink "cc/vec2:method"}}cc.v2{{/crossLink}} or {{#crossLink "cc/p:method"}}cc.p{{/crossLink}}
   * !#zh
   * 构造函数，可查看 {{#crossLink "cc/vec2:method"}}cc.v2{{/crossLink}} 或者 {{#crossLink "cc/p:method"}}cc.p{{/crossLink}}
   * @method constructor
   * @param {Number} [x=0]
   * @param {Number} [y=0]
   */
  function Vec2(x, y) {
    var _this;

    if (x === void 0) {
      x = 0;
    }

    if (y === void 0) {
      y = 0;
    }

    _this = _ValueType.call(this) || this;
    _this.mag = Vec2.prototype.len;
    _this.magSqr = Vec2.prototype.lengthSqr;
    _this.subSelf = Vec2.prototype.subtract;
    _this.mulSelf = Vec2.prototype.multiplyScalar;
    _this.divSelf = Vec2.prototype.divide;
    _this.scaleSelf = Vec2.prototype.multiply;
    _this.negSelf = Vec2.prototype.negate;
    _this.x = void 0;
    _this.y = void 0;
    _this.z = 0;

    if (x && typeof x === 'object') {
      _this.y = x.y || 0;
      _this.x = x.x || 0;
    } else {
      _this.x = x || 0;
      _this.y = y || 0;
    }

    return _this;
  }
  /**
   * !#en clone a Vec2 object
   * !#zh 克隆一个 Vec2 对象
   * @method clone
   * @return {Vec2}
   */


  _proto.clone = function clone() {
    return new Vec2(this.x, this.y);
  }
  /**
   * !#en Sets vector with another's value
   * !#zh 设置向量值。
   * @method set
   * @param {Vec2} newValue - !#en new value to set. !#zh 要设置的新值
   * @return {Vec2} returns this
   * @chainable
   */
  ;

  _proto.set = function set(newValue) {
    this.x = newValue.x;
    this.y = newValue.y;
    return this;
  }
  /**
   * !#en Check whether two vector equal
   * !#zh 当前的向量是否与指定的向量相等。
   * @method equals
   * @param {Vec2} other
   * @return {Boolean}
   */
  ;

  _proto.equals = function equals(other) {
    return other && this.x === other.x && this.y === other.y;
  }
  /**
   * !#en Check whether two vector equal with some degree of variance.
   * !#zh
   * 近似判断两个点是否相等。<br/>
   * 判断 2 个向量是否在指定数值的范围之内，如果在则返回 true，反之则返回 false。
   * @method fuzzyEquals
   * @param {Vec2} other
   * @param {Number} variance
   * @return {Boolean}
   */
  ;

  _proto.fuzzyEquals = function fuzzyEquals(other, variance) {
    if (this.x - variance <= other.x && other.x <= this.x + variance) {
      if (this.y - variance <= other.y && other.y <= this.y + variance) return true;
    }

    return false;
  }
  /**
   * !#en Transform to string with vector informations
   * !#zh 转换为方便阅读的字符串。
   * @method toString
   * @return {string}
   */
  ;

  _proto.toString = function toString() {
    return "(" + this.x.toFixed(2) + ", " + this.y.toFixed(2) + ")";
  }
  /**
   * !#en Calculate linear interpolation result between this vector and another one with given ratio
   * !#zh 线性插值。
   * @method lerp
   * @param {Vec2} to
   * @param {Number} ratio - the interpolation coefficient
   * @param {Vec2} [out] - optional, the receiving vector, you can pass the same vec2 to save result to itself, if not provided, a new vec2 will be created
   * @return {Vec2}
   */
  ;

  _proto.lerp = function lerp(to, ratio, out) {
    out = out || new Vec2();
    var x = this.x;
    var y = this.y;
    out.x = x + (to.x - x) * ratio;
    out.y = y + (to.y - y) * ratio;
    return out;
  }
  /**
   * !#en Clamp the vector between from float and to float.
   * !#zh
   * 返回指定限制区域后的向量。<br/>
   * 向量大于 max_inclusive 则返回 max_inclusive。<br/>
   * 向量小于 min_inclusive 则返回 min_inclusive。<br/>
   * 否则返回自身。
   * @method clampf
   * @param {Vec2} min_inclusive
   * @param {Vec2} max_inclusive
   * @return {Vec2}
   * @example
   * var min_inclusive = cc.v2(0, 0);
   * var max_inclusive = cc.v2(20, 20);
   * var v1 = cc.v2(20, 20).clampf(min_inclusive, max_inclusive); // Vec2 {x: 20, y: 20};
   * var v2 = cc.v2(0, 0).clampf(min_inclusive, max_inclusive);   // Vec2 {x: 0, y: 0};
   * var v3 = cc.v2(10, 10).clampf(min_inclusive, max_inclusive); // Vec2 {x: 10, y: 10};
   */
  ;

  _proto.clampf = function clampf(min_inclusive, max_inclusive) {
    this.x = _misc["default"].clampf(this.x, min_inclusive.x, max_inclusive.x);
    this.y = _misc["default"].clampf(this.y, min_inclusive.y, max_inclusive.y);
    return this;
  }
  /**
   * !#en Adds this vector.
   * !#zh 向量加法。
   * @method add
   * @param {Vec2} vector
   * @param {Vec2} [out]
   * @return {Vec2} returns this
   * @chainable
   * @example
   * var v = cc.v2(10, 10);
   * v.add(cc.v2(5, 5));// return Vec2 {x: 15, y: 15};
   */
  ;

  _proto.add = function add(vector, out) {
    out = out || new Vec2();
    out.x = this.x + vector.x;
    out.y = this.y + vector.y;
    return out;
  }
  /**
   * !#en Adds this vector. If you want to save result to another vector, use add() instead.
   * !#zh 向量加法。如果你想保存结果到另一个向量，使用 add() 代替。
   * @method addSelf
   * @param {Vec2} vector
   * @return {Vec2} returns this
   * @chainable
   */
  ;

  _proto.addSelf = function addSelf(vector) {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
    return this;
  }
  /**
   * !#en Subtracts one vector from this.
   * !#zh 向量减法。
   * @method subtract
   * @param {Vec2} vector
   * @return {Vec2} returns this
   * @chainable
   * @example
   * var v = cc.v2(10, 10);
   * v.subSelf(cc.v2(5, 5));// return Vec2 {x: 5, y: 5};
   */
  ;

  _proto.subtract = function subtract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }
  /**
   * !#en Multiplies this by a number.
   * !#zh 缩放当前向量。
   * @method multiply
   * @param {number} num
   * @return {Vec2} returns this
   * @chainable
   * @example
   * var v = cc.v2(10, 10);
   * v.multiply(5);// return Vec2 {x: 50, y: 50};
   */
  ;

  _proto.multiplyScalar = function multiplyScalar(num) {
    this.x *= num;
    this.y *= num;
    return this;
  }
  /**
   * !#en Multiplies two vectors.
   * !#zh 分量相乘。
   * @method multiply
   * @param {Vec2} vector
   * @return {Vec2} returns this
   * @chainable
   * @example
   * var v = cc.v2(10, 10);
   * v.multiply(cc.v2(5, 5));// return Vec2 {x: 50, y: 50};
   */
  ;

  _proto.multiply = function multiply(vector) {
    this.x *= vector.x;
    this.y *= vector.y;
    return this;
  }
  /**
   * !#en Divides by a number.
   * !#zh 向量除法。
   * @method divide
   * @param {number} num
   * @return {Vec2} returns this
   * @chainable
   * @example
   * var v = cc.v2(10, 10);
   * v.divide(5); // return Vec2 {x: 2, y: 2};
   */
  ;

  _proto.divide = function divide(num) {
    this.x /= num;
    this.y /= num;
    return this;
  }
  /**
   * !#en Negates the components.
   * !#zh 向量取反。
   * @method negate
   * @return {Vec2} returns this
   * @chainable
   * @example
   * var v = cc.v2(10, 10);
   * v.negate(); // return Vec2 {x: -10, y: -10};
   */
  ;

  _proto.negate = function negate() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }
  /**
   * !#en Dot product
   * !#zh 当前向量与指定向量进行点乘。
   * @method dot
   * @param {Vec2} [vector]
   * @return {number} the result
   * @example
   * var v = cc.v2(10, 10);
   * v.dot(cc.v2(5, 5)); // return 100;
   */
  ;

  _proto.dot = function dot(vector) {
    return this.x * vector.x + this.y * vector.y;
  }
  /**
   * !#en Cross product
   * !#zh 当前向量与指定向量进行叉乘。
   * @method cross
   * @param {Vec2} [vector]
   * @return {number} the result
   * @example
   * var v = cc.v2(10, 10);
   * v.cross(cc.v2(5, 5)); // return 0;
   */
  ;

  _proto.cross = function cross(vector) {
    return this.x * vector.y - this.y * vector.x;
  }
  /**
   * !#en Returns the length of this vector.
   * !#zh 返回该向量的长度。
   * @method len
   * @return {number} the result
   * @example
   * var v = cc.v2(10, 10);
   * v.len(); // return 14.142135623730951;
   */
  ;

  _proto.len = function len() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  /**
   * !#en Returns the squared length of this vector.
   * !#zh 返回该向量的长度平方。
   * @method lengthSqr
   * @return {number} the result
   * @example
   * var v = cc.v2(10, 10);
   * v.lengthSqr(); // return 200;
   */
  ;

  _proto.lengthSqr = function lengthSqr() {
    return this.x * this.x + this.y * this.y;
  }
  /**
   * !#en Make the length of this vector to 1.
   * !#zh 向量归一化，让这个向量的长度为 1。
   * @method normalizeSelf
   * @return {Vec2} returns this
   * @chainable
   * @example
   * var v = cc.v2(10, 10);
   * v.normalizeSelf(); // return Vec2 {x: 0.7071067811865475, y: 0.7071067811865475};
   */
  ;

  _proto.normalizeSelf = function normalizeSelf() {
    var magSqr = this.x * this.x + this.y * this.y;
    if (magSqr === 1.0) return this;

    if (magSqr === 0.0) {
      return this;
    }

    var invsqrt = 1.0 / Math.sqrt(magSqr);
    this.x *= invsqrt;
    this.y *= invsqrt;
    return this;
  }
  /**
   * !#en
   * Returns this vector with a magnitude of 1.<br/>
   * <br/>
   * Note that the current vector is unchanged and a new normalized vector is returned. If you want to normalize the current vector, use normalizeSelf function.
   * !#zh
   * 返回归一化后的向量。<br/>
   * <br/>
   * 注意，当前向量不变，并返回一个新的归一化向量。如果你想来归一化当前向量，可使用 normalizeSelf 函数。
   * @method normalize
   * @param {Vec2} [out] - optional, the receiving vector, you can pass the same vec2 to save result to itself, if not provided, a new vec2 will be created
   * @return {Vec2} result
   * var v = cc.v2(10, 10);
   * v.normalize();   // return Vec2 {x: 0.7071067811865475, y: 0.7071067811865475};
   */
  ;

  _proto.normalize = function normalize(out) {
    out = out || new Vec2();
    out.x = this.x;
    out.y = this.y;
    out.normalizeSelf();
    return out;
  }
  /**
   * !#en Get angle in radian between this and vector.
   * !#zh 夹角的弧度。
   * @method angle
   * @param {Vec2} vector
   * @return {number} from 0 to Math.PI
   */
  ;

  _proto.angle = function angle(vector) {
    var magSqr1 = this.magSqr();
    var magSqr2 = vector.magSqr();

    if (magSqr1 === 0 || magSqr2 === 0) {
      console.warn("Can't get angle between zero vector");
      return 0.0;
    }

    var dot = this.dot(vector);
    var theta = dot / Math.sqrt(magSqr1 * magSqr2);
    theta = _misc["default"].clampf(theta, -1.0, 1.0);
    return Math.acos(theta);
  }
  /**
   * !#en Get angle in radian between this and vector with direction.
   * !#zh 带方向的夹角的弧度。
   * @method signAngle
   * @param {Vec2} vector
   * @return {number} from -MathPI to Math.PI
   */
  ;

  _proto.signAngle = function signAngle(vector) {
    var angle = this.angle(vector);
    return this.cross(vector) < 0 ? -angle : angle;
  }
  /**
   * !#en rotate
   * !#zh 返回旋转给定弧度后的新向量。
   * @method rotate
   * @param {number} radians
   * @param {Vec2} [out] - optional, the receiving vector, you can pass the same vec2 to save result to itself, if not provided, a new vec2 will be created
   * @return {Vec2} the result
   */
  ;

  _proto.rotate = function rotate(radians, out) {
    out = out || new Vec2();
    out.x = this.x;
    out.y = this.y;
    return out.rotateSelf(radians);
  }
  /**
   * !#en rotate self
   * !#zh 按指定弧度旋转向量。
   * @method rotateSelf
   * @param {number} radians
   * @return {Vec2} returns this
   * @chainable
   */
  ;

  _proto.rotateSelf = function rotateSelf(radians) {
    var sin = Math.sin(radians);
    var cos = Math.cos(radians);
    var x = this.x;
    this.x = cos * x - sin * this.y;
    this.y = sin * x + cos * this.y;
    return this;
  }
  /**
   * !#en Calculates the projection of the current vector over the given vector.
   * !#zh 返回当前向量在指定 vector 向量上的投影向量。
   * @method project
   * @param {Vec2} vector
   * @return {Vec2}
   * @example
   * var v1 = cc.v2(20, 20);
   * var v2 = cc.v2(5, 5);
   * v1.project(v2); // Vec2 {x: 20, y: 20};
   */
  ;

  _proto.project = function project(vector) {
    return vector.multiplyScalar(this.dot(vector) / vector.dot(vector));
  }
  /**
   * Transforms the vec2 with a mat4. 3rd vector component is implicitly '0', 4th vector component is implicitly '1'
   * @method transformMat4
   * @param {Mat4} m matrix to transform with
   * @param {Vec2} [out] the receiving vector, you can pass the same vec2 to save result to itself, if not provided, a new vec2 will be created
   * @returns {Vec2} out
   */
  ;

  _proto.transformMat4 = function transformMat4(m, out) {
    out = out || new Vec2();
    Vec2.transformMat4(out, this, m);
    return out;
  }
  /**
   * Returns the maximum value in x, y.
   * @method maxAxis
   * @returns {number}
   */
  ;

  _proto.maxAxis = function maxAxis() {
    return Math.max(this.x, this.y);
  };

  return Vec2;
}(_valueType["default"]);

exports["default"] = Vec2;
Vec2.sub = Vec2.subtract;
Vec2.mul = Vec2.multiply;
Vec2.scale = Vec2.multiplyScalar;
Vec2.mag = Vec2.len;
Vec2.squaredMagnitude = Vec2.lengthSqr;
Vec2.div = Vec2.divide;
Vec2.ONE_R = Vec2.ONE;
Vec2.ZERO_R = Vec2.ZERO;
Vec2.UP_R = Vec2.UP;
Vec2.RIGHT_R = Vec2.RIGHT;
var v2_1 = new Vec2();
var v2_2 = new Vec2();

_CCClass["default"].fastDefine('cc.Vec2', Vec2, {
  x: 0,
  y: 0
});
/**
 * @module cc
 */

/**
 * !#en The convenience method to create a new {{#crossLink "Vec2"}}cc.Vec2{{/crossLink}}.
 * !#zh 通过该简便的函数进行创建 {{#crossLink "Vec2"}}cc.Vec2{{/crossLink}} 对象。
 * @method v2
 * @param {Number|Object} [x=0]
 * @param {Number} [y=0]
 * @return {Vec2}
 * @example
 * var v1 = cc.v2();
 * var v2 = cc.v2(0, 0);
 * var v3 = cc.v2(v2);
 * var v4 = cc.v2({x: 100, y: 100});
 */


cc.v2 = function v2(x, y) {
  return new Vec2(x, y);
};

cc.Vec2 = Vec2;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlYzIudHMiXSwibmFtZXMiOlsiX3giLCJfeSIsIlZlYzIiLCJzdWIiLCJ2ZWN0b3IiLCJvdXQiLCJzdWJ0cmFjdCIsIm11bCIsIm51bSIsIm11bHRpcGx5U2NhbGFyIiwiZGl2IiwiZGl2aWRlIiwic2NhbGUiLCJtdWx0aXBseSIsIm5lZyIsIm5lZ2F0ZSIsImNsb25lIiwiYSIsIngiLCJ5IiwiY29weSIsInNldCIsImFkZCIsImIiLCJjZWlsIiwiTWF0aCIsImZsb29yIiwibWluIiwibWF4Iiwicm91bmQiLCJzY2FsZUFuZEFkZCIsImRpc3RhbmNlIiwic3FydCIsInNxdWFyZWREaXN0YW5jZSIsImxlbiIsImxlbmd0aFNxciIsImludmVyc2UiLCJpbnZlcnNlU2FmZSIsImFicyIsIkVQU0lMT04iLCJub3JtYWxpemUiLCJkb3QiLCJjcm9zcyIsInoiLCJsZXJwIiwidCIsInJhbmRvbSIsInIiLCJQSSIsImNvcyIsInNpbiIsInRyYW5zZm9ybU1hdDMiLCJtYXQiLCJtIiwidHJhbnNmb3JtTWF0NCIsInN0cmljdEVxdWFscyIsImVxdWFscyIsImVwc2lsb24iLCJhbmdsZSIsInYyXzEiLCJ2Ml8yIiwiY29zaW5lIiwiYWNvcyIsInRvQXJyYXkiLCJ2Iiwib2ZzIiwiZnJvbUFycmF5IiwiYXJyIiwibWFnIiwicHJvdG90eXBlIiwibWFnU3FyIiwic3ViU2VsZiIsIm11bFNlbGYiLCJkaXZTZWxmIiwic2NhbGVTZWxmIiwibmVnU2VsZiIsIm5ld1ZhbHVlIiwib3RoZXIiLCJmdXp6eUVxdWFscyIsInZhcmlhbmNlIiwidG9TdHJpbmciLCJ0b0ZpeGVkIiwidG8iLCJyYXRpbyIsImNsYW1wZiIsIm1pbl9pbmNsdXNpdmUiLCJtYXhfaW5jbHVzaXZlIiwibWlzYyIsImFkZFNlbGYiLCJub3JtYWxpemVTZWxmIiwiaW52c3FydCIsIm1hZ1NxcjEiLCJtYWdTcXIyIiwiY29uc29sZSIsIndhcm4iLCJ0aGV0YSIsInNpZ25BbmdsZSIsInJvdGF0ZSIsInJhZGlhbnMiLCJyb3RhdGVTZWxmIiwicHJvamVjdCIsIm1heEF4aXMiLCJWYWx1ZVR5cGUiLCJzcXVhcmVkTWFnbml0dWRlIiwiT05FX1IiLCJPTkUiLCJaRVJPX1IiLCJaRVJPIiwiVVBfUiIsIlVQIiwiUklHSFRfUiIsIlJJR0hUIiwiQ0NDbGFzcyIsImZhc3REZWZpbmUiLCJjYyIsInYyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBOztBQUVBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBR0EsSUFBSUEsRUFBVSxHQUFHLEdBQWpCO0FBQ0EsSUFBSUMsRUFBVSxHQUFHLEdBQWpCO0FBRUE7Ozs7Ozs7O0lBUXFCQzs7Ozs7OztBQUNqQjtTQVVBQyxNQUFBLGFBQUtDLE1BQUwsRUFBbUJDLEdBQW5CLEVBQXFDO0FBQ2pDLFdBQU9ILElBQUksQ0FBQ0ksUUFBTCxDQUFjRCxHQUFHLElBQUksSUFBSUgsSUFBSixFQUFyQixFQUFpQyxJQUFqQyxFQUF1Q0UsTUFBdkMsQ0FBUDtBQUNIOztTQUVERyxNQUFBLGFBQUtDLEdBQUwsRUFBa0JILEdBQWxCLEVBQW9DO0FBQ2hDLFdBQU9ILElBQUksQ0FBQ08sY0FBTCxDQUFvQkosR0FBRyxJQUFJLElBQUlILElBQUosRUFBM0IsRUFBdUMsSUFBdkMsRUFBNkNNLEdBQTdDLENBQVA7QUFDSDs7U0FFREUsTUFBQSxhQUFLTixNQUFMLEVBQW1CQyxHQUFuQixFQUFxQztBQUNqQyxXQUFPSCxJQUFJLENBQUNTLE1BQUwsQ0FBWU4sR0FBRyxJQUFJLElBQUlILElBQUosRUFBbkIsRUFBK0IsSUFBL0IsRUFBcUNFLE1BQXJDLENBQVA7QUFDSDs7U0FFRFEsUUFBQSxlQUFPUixNQUFQLEVBQXFCQyxHQUFyQixFQUF1QztBQUNuQyxXQUFPSCxJQUFJLENBQUNXLFFBQUwsQ0FBY1IsR0FBRyxJQUFJLElBQUlILElBQUosRUFBckIsRUFBaUMsSUFBakMsRUFBdUNFLE1BQXZDLENBQVA7QUFDSDs7U0FFRFUsTUFBQSxhQUFLVCxHQUFMLEVBQXVCO0FBQ25CLFdBQU9ILElBQUksQ0FBQ2EsTUFBTCxDQUFZVixHQUFHLElBQUksSUFBSUgsSUFBSixFQUFuQixFQUErQixJQUEvQixDQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7O0FBMERBOzs7Ozs7O09BT09jLFFBQVAsZUFBc0NDLENBQXRDLEVBQThDO0FBQzFDLFdBQU8sSUFBSWYsSUFBSixDQUFTZSxDQUFDLENBQUNDLENBQVgsRUFBY0QsQ0FBQyxDQUFDRSxDQUFoQixDQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7O09BT09DLE9BQVAsY0FBcUNmLEdBQXJDLEVBQStDWSxDQUEvQyxFQUF1RDtBQUNuRFosSUFBQUEsR0FBRyxDQUFDYSxDQUFKLEdBQVFELENBQUMsQ0FBQ0MsQ0FBVjtBQUNBYixJQUFBQSxHQUFHLENBQUNjLENBQUosR0FBUUYsQ0FBQyxDQUFDRSxDQUFWO0FBQ0EsV0FBT2QsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7OztPQU9PZ0IsTUFBUCxhQUFvQ2hCLEdBQXBDLEVBQThDYSxDQUE5QyxFQUF5REMsQ0FBekQsRUFBb0U7QUFDaEVkLElBQUFBLEdBQUcsQ0FBQ2EsQ0FBSixHQUFRQSxDQUFSO0FBQ0FiLElBQUFBLEdBQUcsQ0FBQ2MsQ0FBSixHQUFRQSxDQUFSO0FBQ0EsV0FBT2QsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7OztPQU9PaUIsTUFBUCxhQUFvQ2pCLEdBQXBDLEVBQThDWSxDQUE5QyxFQUFzRE0sQ0FBdEQsRUFBOEQ7QUFDMURsQixJQUFBQSxHQUFHLENBQUNhLENBQUosR0FBUUQsQ0FBQyxDQUFDQyxDQUFGLEdBQU1LLENBQUMsQ0FBQ0wsQ0FBaEI7QUFDQWIsSUFBQUEsR0FBRyxDQUFDYyxDQUFKLEdBQVFGLENBQUMsQ0FBQ0UsQ0FBRixHQUFNSSxDQUFDLENBQUNKLENBQWhCO0FBQ0EsV0FBT2QsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7OztPQU9PQyxXQUFQLGtCQUF5Q0QsR0FBekMsRUFBbURZLENBQW5ELEVBQTJETSxDQUEzRCxFQUFtRTtBQUMvRGxCLElBQUFBLEdBQUcsQ0FBQ2EsQ0FBSixHQUFRRCxDQUFDLENBQUNDLENBQUYsR0FBTUssQ0FBQyxDQUFDTCxDQUFoQjtBQUNBYixJQUFBQSxHQUFHLENBQUNjLENBQUosR0FBUUYsQ0FBQyxDQUFDRSxDQUFGLEdBQU1JLENBQUMsQ0FBQ0osQ0FBaEI7QUFDQSxXQUFPZCxHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7O09BT09RLFdBQVAsa0JBQXlDUixHQUF6QyxFQUFtRFksQ0FBbkQsRUFBMkRNLENBQTNELEVBQW1FO0FBQy9EbEIsSUFBQUEsR0FBRyxDQUFDYSxDQUFKLEdBQVFELENBQUMsQ0FBQ0MsQ0FBRixHQUFNSyxDQUFDLENBQUNMLENBQWhCO0FBQ0FiLElBQUFBLEdBQUcsQ0FBQ2MsQ0FBSixHQUFRRixDQUFDLENBQUNFLENBQUYsR0FBTUksQ0FBQyxDQUFDSixDQUFoQjtBQUNBLFdBQU9kLEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7T0FPT00sU0FBUCxnQkFBdUNOLEdBQXZDLEVBQWlEWSxDQUFqRCxFQUF5RE0sQ0FBekQsRUFBaUU7QUFDN0RsQixJQUFBQSxHQUFHLENBQUNhLENBQUosR0FBUUQsQ0FBQyxDQUFDQyxDQUFGLEdBQU1LLENBQUMsQ0FBQ0wsQ0FBaEI7QUFDQWIsSUFBQUEsR0FBRyxDQUFDYyxDQUFKLEdBQVFGLENBQUMsQ0FBQ0UsQ0FBRixHQUFNSSxDQUFDLENBQUNKLENBQWhCO0FBQ0EsV0FBT2QsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7OztPQU9PbUIsT0FBUCxjQUFxQ25CLEdBQXJDLEVBQStDWSxDQUEvQyxFQUF1RDtBQUNuRFosSUFBQUEsR0FBRyxDQUFDYSxDQUFKLEdBQVFPLElBQUksQ0FBQ0QsSUFBTCxDQUFVUCxDQUFDLENBQUNDLENBQVosQ0FBUjtBQUNBYixJQUFBQSxHQUFHLENBQUNjLENBQUosR0FBUU0sSUFBSSxDQUFDRCxJQUFMLENBQVVQLENBQUMsQ0FBQ0UsQ0FBWixDQUFSO0FBQ0EsV0FBT2QsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7OztPQU9PcUIsUUFBUCxlQUFzQ3JCLEdBQXRDLEVBQWdEWSxDQUFoRCxFQUF3RDtBQUNwRFosSUFBQUEsR0FBRyxDQUFDYSxDQUFKLEdBQVFPLElBQUksQ0FBQ0MsS0FBTCxDQUFXVCxDQUFDLENBQUNDLENBQWIsQ0FBUjtBQUNBYixJQUFBQSxHQUFHLENBQUNjLENBQUosR0FBUU0sSUFBSSxDQUFDQyxLQUFMLENBQVdULENBQUMsQ0FBQ0UsQ0FBYixDQUFSO0FBQ0EsV0FBT2QsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7OztPQU9Pc0IsTUFBUCxhQUFvQ3RCLEdBQXBDLEVBQThDWSxDQUE5QyxFQUFzRE0sQ0FBdEQsRUFBOEQ7QUFDMURsQixJQUFBQSxHQUFHLENBQUNhLENBQUosR0FBUU8sSUFBSSxDQUFDRSxHQUFMLENBQVNWLENBQUMsQ0FBQ0MsQ0FBWCxFQUFjSyxDQUFDLENBQUNMLENBQWhCLENBQVI7QUFDQWIsSUFBQUEsR0FBRyxDQUFDYyxDQUFKLEdBQVFNLElBQUksQ0FBQ0UsR0FBTCxDQUFTVixDQUFDLENBQUNFLENBQVgsRUFBY0ksQ0FBQyxDQUFDSixDQUFoQixDQUFSO0FBQ0EsV0FBT2QsR0FBUDtBQUNIO0FBR0Q7Ozs7Ozs7OztPQU9PdUIsTUFBUCxhQUFvQ3ZCLEdBQXBDLEVBQThDWSxDQUE5QyxFQUFzRE0sQ0FBdEQsRUFBOEQ7QUFDMURsQixJQUFBQSxHQUFHLENBQUNhLENBQUosR0FBUU8sSUFBSSxDQUFDRyxHQUFMLENBQVNYLENBQUMsQ0FBQ0MsQ0FBWCxFQUFjSyxDQUFDLENBQUNMLENBQWhCLENBQVI7QUFDQWIsSUFBQUEsR0FBRyxDQUFDYyxDQUFKLEdBQVFNLElBQUksQ0FBQ0csR0FBTCxDQUFTWCxDQUFDLENBQUNFLENBQVgsRUFBY0ksQ0FBQyxDQUFDSixDQUFoQixDQUFSO0FBQ0EsV0FBT2QsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7OztPQU9Pd0IsUUFBUCxlQUFzQ3hCLEdBQXRDLEVBQWdEWSxDQUFoRCxFQUF3RDtBQUNwRFosSUFBQUEsR0FBRyxDQUFDYSxDQUFKLEdBQVFPLElBQUksQ0FBQ0ksS0FBTCxDQUFXWixDQUFDLENBQUNDLENBQWIsQ0FBUjtBQUNBYixJQUFBQSxHQUFHLENBQUNjLENBQUosR0FBUU0sSUFBSSxDQUFDSSxLQUFMLENBQVdaLENBQUMsQ0FBQ0UsQ0FBYixDQUFSO0FBQ0EsV0FBT2QsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7OztPQU9PSSxpQkFBUCx3QkFBK0NKLEdBQS9DLEVBQXlEWSxDQUF6RCxFQUFpRU0sQ0FBakUsRUFBNEU7QUFDeEVsQixJQUFBQSxHQUFHLENBQUNhLENBQUosR0FBUUQsQ0FBQyxDQUFDQyxDQUFGLEdBQU1LLENBQWQ7QUFDQWxCLElBQUFBLEdBQUcsQ0FBQ2MsQ0FBSixHQUFRRixDQUFDLENBQUNFLENBQUYsR0FBTUksQ0FBZDtBQUNBLFdBQU9sQixHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7O09BT095QixjQUFQLHFCQUE0Q3pCLEdBQTVDLEVBQXNEWSxDQUF0RCxFQUE4RE0sQ0FBOUQsRUFBc0VYLEtBQXRFLEVBQXFGO0FBQ2pGUCxJQUFBQSxHQUFHLENBQUNhLENBQUosR0FBUUQsQ0FBQyxDQUFDQyxDQUFGLEdBQU9LLENBQUMsQ0FBQ0wsQ0FBRixHQUFNTixLQUFyQjtBQUNBUCxJQUFBQSxHQUFHLENBQUNjLENBQUosR0FBUUYsQ0FBQyxDQUFDRSxDQUFGLEdBQU9JLENBQUMsQ0FBQ0osQ0FBRixHQUFNUCxLQUFyQjtBQUNBLFdBQU9QLEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7T0FPTzBCLFdBQVAsa0JBQXlDZCxDQUF6QyxFQUFpRE0sQ0FBakQsRUFBeUQ7QUFDckR2QixJQUFBQSxFQUFFLEdBQUd1QixDQUFDLENBQUNMLENBQUYsR0FBTUQsQ0FBQyxDQUFDQyxDQUFiO0FBQ0FqQixJQUFBQSxFQUFFLEdBQUdzQixDQUFDLENBQUNKLENBQUYsR0FBTUYsQ0FBQyxDQUFDRSxDQUFiO0FBQ0EsV0FBT00sSUFBSSxDQUFDTyxJQUFMLENBQVVoQyxFQUFFLEdBQUdBLEVBQUwsR0FBVUMsRUFBRSxHQUFHQSxFQUF6QixDQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7O09BT09nQyxrQkFBUCx5QkFBZ0RoQixDQUFoRCxFQUF3RE0sQ0FBeEQsRUFBZ0U7QUFDNUR2QixJQUFBQSxFQUFFLEdBQUd1QixDQUFDLENBQUNMLENBQUYsR0FBTUQsQ0FBQyxDQUFDQyxDQUFiO0FBQ0FqQixJQUFBQSxFQUFFLEdBQUdzQixDQUFDLENBQUNKLENBQUYsR0FBTUYsQ0FBQyxDQUFDRSxDQUFiO0FBQ0EsV0FBT25CLEVBQUUsR0FBR0EsRUFBTCxHQUFVQyxFQUFFLEdBQUdBLEVBQXRCO0FBQ0g7QUFFRDs7Ozs7Ozs7O09BT09pQyxNQUFQLGFBQW9DakIsQ0FBcEMsRUFBNEM7QUFDeENqQixJQUFBQSxFQUFFLEdBQUdpQixDQUFDLENBQUNDLENBQVA7QUFDQWpCLElBQUFBLEVBQUUsR0FBR2dCLENBQUMsQ0FBQ0UsQ0FBUDtBQUNBLFdBQU9NLElBQUksQ0FBQ08sSUFBTCxDQUFVaEMsRUFBRSxHQUFHQSxFQUFMLEdBQVVDLEVBQUUsR0FBR0EsRUFBekIsQ0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7OztPQU9Pa0MsWUFBUCxtQkFBMENsQixDQUExQyxFQUFrRDtBQUM5Q2pCLElBQUFBLEVBQUUsR0FBR2lCLENBQUMsQ0FBQ0MsQ0FBUDtBQUNBakIsSUFBQUEsRUFBRSxHQUFHZ0IsQ0FBQyxDQUFDRSxDQUFQO0FBQ0EsV0FBT25CLEVBQUUsR0FBR0EsRUFBTCxHQUFVQyxFQUFFLEdBQUdBLEVBQXRCO0FBQ0g7QUFFRDs7Ozs7Ozs7O09BT09jLFNBQVAsZ0JBQXVDVixHQUF2QyxFQUFpRFksQ0FBakQsRUFBeUQ7QUFDckRaLElBQUFBLEdBQUcsQ0FBQ2EsQ0FBSixHQUFRLENBQUNELENBQUMsQ0FBQ0MsQ0FBWDtBQUNBYixJQUFBQSxHQUFHLENBQUNjLENBQUosR0FBUSxDQUFDRixDQUFDLENBQUNFLENBQVg7QUFDQSxXQUFPZCxHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7O09BT08rQixVQUFQLGlCQUF3Qy9CLEdBQXhDLEVBQWtEWSxDQUFsRCxFQUEwRDtBQUN0RFosSUFBQUEsR0FBRyxDQUFDYSxDQUFKLEdBQVEsTUFBTUQsQ0FBQyxDQUFDQyxDQUFoQjtBQUNBYixJQUFBQSxHQUFHLENBQUNjLENBQUosR0FBUSxNQUFNRixDQUFDLENBQUNFLENBQWhCO0FBQ0EsV0FBT2QsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7OztPQU9PZ0MsY0FBUCxxQkFBNENoQyxHQUE1QyxFQUFzRFksQ0FBdEQsRUFBOEQ7QUFDMURqQixJQUFBQSxFQUFFLEdBQUdpQixDQUFDLENBQUNDLENBQVA7QUFDQWpCLElBQUFBLEVBQUUsR0FBR2dCLENBQUMsQ0FBQ0UsQ0FBUDs7QUFFQSxRQUFJTSxJQUFJLENBQUNhLEdBQUwsQ0FBU3RDLEVBQVQsSUFBZXVDLGNBQW5CLEVBQTRCO0FBQ3hCbEMsTUFBQUEsR0FBRyxDQUFDYSxDQUFKLEdBQVEsQ0FBUjtBQUNILEtBRkQsTUFFTztBQUNIYixNQUFBQSxHQUFHLENBQUNhLENBQUosR0FBUSxNQUFNbEIsRUFBZDtBQUNIOztBQUVELFFBQUl5QixJQUFJLENBQUNhLEdBQUwsQ0FBU3JDLEVBQVQsSUFBZXNDLGNBQW5CLEVBQTRCO0FBQ3hCbEMsTUFBQUEsR0FBRyxDQUFDYyxDQUFKLEdBQVEsQ0FBUjtBQUNILEtBRkQsTUFFTztBQUNIZCxNQUFBQSxHQUFHLENBQUNjLENBQUosR0FBUSxNQUFNbEIsRUFBZDtBQUNIOztBQUVELFdBQU9JLEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7T0FPT21DLFlBQVAsbUJBQXNFbkMsR0FBdEUsRUFBZ0ZZLENBQWhGLEVBQTZGO0FBQ3pGakIsSUFBQUEsRUFBRSxHQUFHaUIsQ0FBQyxDQUFDQyxDQUFQO0FBQ0FqQixJQUFBQSxFQUFFLEdBQUdnQixDQUFDLENBQUNFLENBQVA7QUFDQSxRQUFJZSxHQUFHLEdBQUdsQyxFQUFFLEdBQUdBLEVBQUwsR0FBVUMsRUFBRSxHQUFHQSxFQUF6Qjs7QUFDQSxRQUFJaUMsR0FBRyxHQUFHLENBQVYsRUFBYTtBQUNUQSxNQUFBQSxHQUFHLEdBQUcsSUFBSVQsSUFBSSxDQUFDTyxJQUFMLENBQVVFLEdBQVYsQ0FBVjtBQUNBN0IsTUFBQUEsR0FBRyxDQUFDYSxDQUFKLEdBQVFsQixFQUFFLEdBQUdrQyxHQUFiO0FBQ0E3QixNQUFBQSxHQUFHLENBQUNjLENBQUosR0FBUWxCLEVBQUUsR0FBR2lDLEdBQWI7QUFDSDs7QUFDRCxXQUFPN0IsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7OztPQU9Pb0MsTUFBUCxhQUFvQ3hCLENBQXBDLEVBQTRDTSxDQUE1QyxFQUFvRDtBQUNoRCxXQUFPTixDQUFDLENBQUNDLENBQUYsR0FBTUssQ0FBQyxDQUFDTCxDQUFSLEdBQVlELENBQUMsQ0FBQ0UsQ0FBRixHQUFNSSxDQUFDLENBQUNKLENBQTNCO0FBQ0g7QUFFRDs7Ozs7Ozs7O09BT091QixRQUFQLGVBQXNDckMsR0FBdEMsRUFBaURZLENBQWpELEVBQXlETSxDQUF6RCxFQUFpRTtBQUM3RGxCLElBQUFBLEdBQUcsQ0FBQ2EsQ0FBSixHQUFRYixHQUFHLENBQUNjLENBQUosR0FBUSxDQUFoQjtBQUNBZCxJQUFBQSxHQUFHLENBQUNzQyxDQUFKLEdBQVExQixDQUFDLENBQUNDLENBQUYsR0FBTUssQ0FBQyxDQUFDSixDQUFSLEdBQVlGLENBQUMsQ0FBQ0UsQ0FBRixHQUFNSSxDQUFDLENBQUNMLENBQTVCO0FBQ0EsV0FBT2IsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7OztPQU9PdUMsT0FBUCxjQUFxQ3ZDLEdBQXJDLEVBQStDWSxDQUEvQyxFQUF1RE0sQ0FBdkQsRUFBK0RzQixDQUEvRCxFQUEwRTtBQUN0RTdDLElBQUFBLEVBQUUsR0FBR2lCLENBQUMsQ0FBQ0MsQ0FBUDtBQUNBakIsSUFBQUEsRUFBRSxHQUFHZ0IsQ0FBQyxDQUFDRSxDQUFQO0FBQ0FkLElBQUFBLEdBQUcsQ0FBQ2EsQ0FBSixHQUFRbEIsRUFBRSxHQUFHNkMsQ0FBQyxJQUFJdEIsQ0FBQyxDQUFDTCxDQUFGLEdBQU1sQixFQUFWLENBQWQ7QUFDQUssSUFBQUEsR0FBRyxDQUFDYyxDQUFKLEdBQVFsQixFQUFFLEdBQUc0QyxDQUFDLElBQUl0QixDQUFDLENBQUNKLENBQUYsR0FBTWxCLEVBQVYsQ0FBZDtBQUNBLFdBQU9JLEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7T0FPT3lDLFNBQVAsZ0JBQXVDekMsR0FBdkMsRUFBaURPLEtBQWpELEVBQWlFO0FBQzdEQSxJQUFBQSxLQUFLLEdBQUdBLEtBQUssSUFBSSxHQUFqQjtBQUNBLFFBQU1tQyxDQUFDLEdBQUcsdUJBQVcsR0FBWCxHQUFpQnRCLElBQUksQ0FBQ3VCLEVBQWhDO0FBQ0EzQyxJQUFBQSxHQUFHLENBQUNhLENBQUosR0FBUU8sSUFBSSxDQUFDd0IsR0FBTCxDQUFTRixDQUFULElBQWNuQyxLQUF0QjtBQUNBUCxJQUFBQSxHQUFHLENBQUNjLENBQUosR0FBUU0sSUFBSSxDQUFDeUIsR0FBTCxDQUFTSCxDQUFULElBQWNuQyxLQUF0QjtBQUNBLFdBQU9QLEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7T0FPTzhDLGdCQUFQLHVCQUF5RTlDLEdBQXpFLEVBQW1GWSxDQUFuRixFQUEyRm1DLEdBQTNGLEVBQXlHO0FBQ3JHcEQsSUFBQUEsRUFBRSxHQUFHaUIsQ0FBQyxDQUFDQyxDQUFQO0FBQ0FqQixJQUFBQSxFQUFFLEdBQUdnQixDQUFDLENBQUNFLENBQVA7QUFDQSxRQUFJa0MsQ0FBQyxHQUFHRCxHQUFHLENBQUNDLENBQVo7QUFDQWhELElBQUFBLEdBQUcsQ0FBQ2EsQ0FBSixHQUFRbUMsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPckQsRUFBUCxHQUFZcUQsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPcEQsRUFBbkIsR0FBd0JvRCxDQUFDLENBQUMsQ0FBRCxDQUFqQztBQUNBaEQsSUFBQUEsR0FBRyxDQUFDYyxDQUFKLEdBQVFrQyxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9yRCxFQUFQLEdBQVlxRCxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9wRCxFQUFuQixHQUF3Qm9ELENBQUMsQ0FBQyxDQUFELENBQWpDO0FBQ0EsV0FBT2hELEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7T0FPT2lELGdCQUFQLHVCQUF5RWpELEdBQXpFLEVBQW1GWSxDQUFuRixFQUEyRm1DLEdBQTNGLEVBQXlHO0FBQ3JHcEQsSUFBQUEsRUFBRSxHQUFHaUIsQ0FBQyxDQUFDQyxDQUFQO0FBQ0FqQixJQUFBQSxFQUFFLEdBQUdnQixDQUFDLENBQUNFLENBQVA7QUFDQSxRQUFJa0MsQ0FBQyxHQUFHRCxHQUFHLENBQUNDLENBQVo7QUFDQWhELElBQUFBLEdBQUcsQ0FBQ2EsQ0FBSixHQUFRbUMsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPckQsRUFBUCxHQUFZcUQsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPcEQsRUFBbkIsR0FBd0JvRCxDQUFDLENBQUMsRUFBRCxDQUFqQztBQUNBaEQsSUFBQUEsR0FBRyxDQUFDYyxDQUFKLEdBQVFrQyxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9yRCxFQUFQLEdBQVlxRCxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9wRCxFQUFuQixHQUF3Qm9ELENBQUMsQ0FBQyxFQUFELENBQWpDO0FBQ0EsV0FBT2hELEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7T0FPT2tELGVBQVAsc0JBQTZDdEMsQ0FBN0MsRUFBcURNLENBQXJELEVBQTZEO0FBQ3pELFdBQU9OLENBQUMsQ0FBQ0MsQ0FBRixLQUFRSyxDQUFDLENBQUNMLENBQVYsSUFBZUQsQ0FBQyxDQUFDRSxDQUFGLEtBQVFJLENBQUMsQ0FBQ0osQ0FBaEM7QUFDSDtBQUVEOzs7Ozs7Ozs7T0FPT3FDLFNBQVAsZ0JBQXVDdkMsQ0FBdkMsRUFBK0NNLENBQS9DLEVBQXdEa0MsT0FBeEQsRUFBMkU7QUFBQSxRQUFuQkEsT0FBbUI7QUFBbkJBLE1BQUFBLE9BQW1CLEdBQVRsQixjQUFTO0FBQUE7O0FBQ3ZFLFdBQ0lkLElBQUksQ0FBQ2EsR0FBTCxDQUFTckIsQ0FBQyxDQUFDQyxDQUFGLEdBQU1LLENBQUMsQ0FBQ0wsQ0FBakIsS0FDQXVDLE9BQU8sR0FBR2hDLElBQUksQ0FBQ0csR0FBTCxDQUFTLEdBQVQsRUFBY0gsSUFBSSxDQUFDYSxHQUFMLENBQVNyQixDQUFDLENBQUNDLENBQVgsQ0FBZCxFQUE2Qk8sSUFBSSxDQUFDYSxHQUFMLENBQVNmLENBQUMsQ0FBQ0wsQ0FBWCxDQUE3QixDQURWLElBRUFPLElBQUksQ0FBQ2EsR0FBTCxDQUFTckIsQ0FBQyxDQUFDRSxDQUFGLEdBQU1JLENBQUMsQ0FBQ0osQ0FBakIsS0FDQXNDLE9BQU8sR0FBR2hDLElBQUksQ0FBQ0csR0FBTCxDQUFTLEdBQVQsRUFBY0gsSUFBSSxDQUFDYSxHQUFMLENBQVNyQixDQUFDLENBQUNFLENBQVgsQ0FBZCxFQUE2Qk0sSUFBSSxDQUFDYSxHQUFMLENBQVNmLENBQUMsQ0FBQ0osQ0FBWCxDQUE3QixDQUpkO0FBTUg7QUFFRDs7Ozs7Ozs7O09BT091QyxRQUFQLGVBQXNDekMsQ0FBdEMsRUFBOENNLENBQTlDLEVBQXNEO0FBQ2xEckIsSUFBQUEsSUFBSSxDQUFDc0MsU0FBTCxDQUFlbUIsSUFBZixFQUFxQjFDLENBQXJCO0FBQ0FmLElBQUFBLElBQUksQ0FBQ3NDLFNBQUwsQ0FBZW9CLElBQWYsRUFBcUJyQyxDQUFyQjtBQUNBLFFBQU1zQyxNQUFNLEdBQUczRCxJQUFJLENBQUN1QyxHQUFMLENBQVNrQixJQUFULEVBQWVDLElBQWYsQ0FBZjs7QUFDQSxRQUFJQyxNQUFNLEdBQUcsR0FBYixFQUFrQjtBQUNkLGFBQU8sQ0FBUDtBQUNIOztBQUNELFFBQUlBLE1BQU0sR0FBRyxDQUFDLEdBQWQsRUFBbUI7QUFDZixhQUFPcEMsSUFBSSxDQUFDdUIsRUFBWjtBQUNIOztBQUNELFdBQU92QixJQUFJLENBQUNxQyxJQUFMLENBQVVELE1BQVYsQ0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7OztPQU9PRSxVQUFQLGlCQUF5RDFELEdBQXpELEVBQW1FMkQsQ0FBbkUsRUFBaUZDLEdBQWpGLEVBQTBGO0FBQUEsUUFBVEEsR0FBUztBQUFUQSxNQUFBQSxHQUFTLEdBQUgsQ0FBRztBQUFBOztBQUN0RjVELElBQUFBLEdBQUcsQ0FBQzRELEdBQUcsR0FBRyxDQUFQLENBQUgsR0FBZUQsQ0FBQyxDQUFDOUMsQ0FBakI7QUFDQWIsSUFBQUEsR0FBRyxDQUFDNEQsR0FBRyxHQUFHLENBQVAsQ0FBSCxHQUFlRCxDQUFDLENBQUM3QyxDQUFqQjtBQUNBLFdBQU9kLEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7T0FPTzZELFlBQVAsbUJBQTBDN0QsR0FBMUMsRUFBb0Q4RCxHQUFwRCxFQUFxRkYsR0FBckYsRUFBOEY7QUFBQSxRQUFUQSxHQUFTO0FBQVRBLE1BQUFBLEdBQVMsR0FBSCxDQUFHO0FBQUE7O0FBQzFGNUQsSUFBQUEsR0FBRyxDQUFDYSxDQUFKLEdBQVFpRCxHQUFHLENBQUNGLEdBQUcsR0FBRyxDQUFQLENBQVg7QUFDQTVELElBQUFBLEdBQUcsQ0FBQ2MsQ0FBSixHQUFRZ0QsR0FBRyxDQUFDRixHQUFHLEdBQUcsQ0FBUCxDQUFYO0FBQ0EsV0FBTzVELEdBQVA7QUFDSDtBQUVEOzs7Ozs7O3dCQWxnQmtCO0FBQUUsYUFBTyxJQUFJSCxJQUFKLENBQVMsQ0FBVCxFQUFZLENBQVosQ0FBUDtBQUF1Qjs7OztBQUczQzs7Ozs7O3dCQU1tQjtBQUFFLGFBQU8sSUFBSUEsSUFBSixDQUFTLENBQVQsRUFBWSxDQUFaLENBQVA7QUFBdUI7Ozs7QUFVNUM7Ozs7Ozt3QkFNaUI7QUFBRSxhQUFPLElBQUlBLElBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixDQUFQO0FBQXVCOzs7O0FBVTFDOzs7Ozs7d0JBTW9CO0FBQUUsYUFBTyxJQUFJQSxJQUFKLENBQVMsQ0FBVCxFQUFZLENBQVosQ0FBUDtBQUF1Qjs7O0FBc2U3Qzs7Ozs7Ozs7OztBQVVBLGdCQUFhZ0IsQ0FBYixFQUFtQ0MsQ0FBbkMsRUFBa0Q7QUFBQTs7QUFBQSxRQUFyQ0QsQ0FBcUM7QUFBckNBLE1BQUFBLENBQXFDLEdBQWxCLENBQWtCO0FBQUE7O0FBQUEsUUFBZkMsQ0FBZTtBQUFmQSxNQUFBQSxDQUFlLEdBQUgsQ0FBRztBQUFBOztBQUM5QztBQUQ4QyxVQXZqQmxEaUQsR0F1akJrRCxHQXZqQjNDbEUsSUFBSSxDQUFDbUUsU0FBTCxDQUFlbkMsR0F1akI0QjtBQUFBLFVBdGpCbERvQyxNQXNqQmtELEdBdGpCekNwRSxJQUFJLENBQUNtRSxTQUFMLENBQWVsQyxTQXNqQjBCO0FBQUEsVUFyakJsRG9DLE9BcWpCa0QsR0FyakJ2Q3JFLElBQUksQ0FBQ21FLFNBQUwsQ0FBZS9ELFFBcWpCd0I7QUFBQSxVQWpqQmxEa0UsT0FpakJrRCxHQWpqQnZDdEUsSUFBSSxDQUFDbUUsU0FBTCxDQUFlNUQsY0FpakJ3QjtBQUFBLFVBN2lCbERnRSxPQTZpQmtELEdBN2lCdkN2RSxJQUFJLENBQUNtRSxTQUFMLENBQWUxRCxNQTZpQndCO0FBQUEsVUF6aUJsRCtELFNBeWlCa0QsR0F6aUJ0Q3hFLElBQUksQ0FBQ21FLFNBQUwsQ0FBZXhELFFBeWlCdUI7QUFBQSxVQXJpQmxEOEQsT0FxaUJrRCxHQXJpQnhDekUsSUFBSSxDQUFDbUUsU0FBTCxDQUFldEQsTUFxaUJ5QjtBQUFBLFVBcEJsREcsQ0FvQmtEO0FBQUEsVUFmbERDLENBZWtEO0FBQUEsVUFabER3QixDQVlrRCxHQVp0QyxDQVlzQzs7QUFHOUMsUUFBSXpCLENBQUMsSUFBSSxPQUFPQSxDQUFQLEtBQWEsUUFBdEIsRUFBZ0M7QUFDNUIsWUFBS0MsQ0FBTCxHQUFTRCxDQUFDLENBQUNDLENBQUYsSUFBTyxDQUFoQjtBQUNBLFlBQUtELENBQUwsR0FBU0EsQ0FBQyxDQUFDQSxDQUFGLElBQU8sQ0FBaEI7QUFDSCxLQUhELE1BR087QUFDSCxZQUFLQSxDQUFMLEdBQVNBLENBQUMsSUFBYyxDQUF4QjtBQUNBLFlBQUtDLENBQUwsR0FBU0EsQ0FBQyxJQUFJLENBQWQ7QUFDSDs7QUFUNkM7QUFVakQ7QUFFRDs7Ozs7Ozs7U0FNQUgsUUFBQSxpQkFBZTtBQUNYLFdBQU8sSUFBSWQsSUFBSixDQUFTLEtBQUtnQixDQUFkLEVBQWlCLEtBQUtDLENBQXRCLENBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7O1NBUUFFLE1BQUEsYUFBS3VELFFBQUwsRUFBMkI7QUFDdkIsU0FBSzFELENBQUwsR0FBUzBELFFBQVEsQ0FBQzFELENBQWxCO0FBQ0EsU0FBS0MsQ0FBTCxHQUFTeUQsUUFBUSxDQUFDekQsQ0FBbEI7QUFDQSxXQUFPLElBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7U0FPQXFDLFNBQUEsZ0JBQVFxQixLQUFSLEVBQThCO0FBQzFCLFdBQU9BLEtBQUssSUFBSSxLQUFLM0QsQ0FBTCxLQUFXMkQsS0FBSyxDQUFDM0QsQ0FBMUIsSUFBK0IsS0FBS0MsQ0FBTCxLQUFXMEQsS0FBSyxDQUFDMUQsQ0FBdkQ7QUFDSDtBQUVEOzs7Ozs7Ozs7Ozs7U0FVQTJELGNBQUEscUJBQWFELEtBQWIsRUFBMEJFLFFBQTFCLEVBQTZDO0FBQ3pDLFFBQUksS0FBSzdELENBQUwsR0FBUzZELFFBQVQsSUFBcUJGLEtBQUssQ0FBQzNELENBQTNCLElBQWdDMkQsS0FBSyxDQUFDM0QsQ0FBTixJQUFXLEtBQUtBLENBQUwsR0FBUzZELFFBQXhELEVBQWtFO0FBQzlELFVBQUksS0FBSzVELENBQUwsR0FBUzRELFFBQVQsSUFBcUJGLEtBQUssQ0FBQzFELENBQTNCLElBQWdDMEQsS0FBSyxDQUFDMUQsQ0FBTixJQUFXLEtBQUtBLENBQUwsR0FBUzRELFFBQXhELEVBQ0ksT0FBTyxJQUFQO0FBQ1A7O0FBQ0QsV0FBTyxLQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7U0FNQUMsV0FBQSxvQkFBb0I7QUFDaEIsV0FBTyxNQUNILEtBQUs5RCxDQUFMLENBQU8rRCxPQUFQLENBQWUsQ0FBZixDQURHLEdBQ2lCLElBRGpCLEdBRUgsS0FBSzlELENBQUwsQ0FBTzhELE9BQVAsQ0FBZSxDQUFmLENBRkcsR0FFaUIsR0FGeEI7QUFJSDtBQUVEOzs7Ozs7Ozs7OztTQVNBckMsT0FBQSxjQUFNc0MsRUFBTixFQUFnQkMsS0FBaEIsRUFBK0I5RSxHQUEvQixFQUFpRDtBQUM3Q0EsSUFBQUEsR0FBRyxHQUFHQSxHQUFHLElBQUksSUFBSUgsSUFBSixFQUFiO0FBQ0EsUUFBSWdCLENBQUMsR0FBRyxLQUFLQSxDQUFiO0FBQ0EsUUFBSUMsQ0FBQyxHQUFHLEtBQUtBLENBQWI7QUFDQWQsSUFBQUEsR0FBRyxDQUFDYSxDQUFKLEdBQVFBLENBQUMsR0FBRyxDQUFDZ0UsRUFBRSxDQUFDaEUsQ0FBSCxHQUFPQSxDQUFSLElBQWFpRSxLQUF6QjtBQUNBOUUsSUFBQUEsR0FBRyxDQUFDYyxDQUFKLEdBQVFBLENBQUMsR0FBRyxDQUFDK0QsRUFBRSxDQUFDL0QsQ0FBSCxHQUFPQSxDQUFSLElBQWFnRSxLQUF6QjtBQUNBLFdBQU85RSxHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7U0FrQkErRSxTQUFBLGdCQUFRQyxhQUFSLEVBQTZCQyxhQUE3QixFQUF3RDtBQUNwRCxTQUFLcEUsQ0FBTCxHQUFTcUUsaUJBQUtILE1BQUwsQ0FBWSxLQUFLbEUsQ0FBakIsRUFBb0JtRSxhQUFhLENBQUNuRSxDQUFsQyxFQUFxQ29FLGFBQWEsQ0FBQ3BFLENBQW5ELENBQVQ7QUFDQSxTQUFLQyxDQUFMLEdBQVNvRSxpQkFBS0gsTUFBTCxDQUFZLEtBQUtqRSxDQUFqQixFQUFvQmtFLGFBQWEsQ0FBQ2xFLENBQWxDLEVBQXFDbUUsYUFBYSxDQUFDbkUsQ0FBbkQsQ0FBVDtBQUNBLFdBQU8sSUFBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7Ozs7O1NBWUFHLE1BQUEsYUFBS2xCLE1BQUwsRUFBbUJDLEdBQW5CLEVBQXFDO0FBQ2pDQSxJQUFBQSxHQUFHLEdBQUdBLEdBQUcsSUFBSSxJQUFJSCxJQUFKLEVBQWI7QUFDQUcsSUFBQUEsR0FBRyxDQUFDYSxDQUFKLEdBQVEsS0FBS0EsQ0FBTCxHQUFTZCxNQUFNLENBQUNjLENBQXhCO0FBQ0FiLElBQUFBLEdBQUcsQ0FBQ2MsQ0FBSixHQUFRLEtBQUtBLENBQUwsR0FBU2YsTUFBTSxDQUFDZSxDQUF4QjtBQUNBLFdBQU9kLEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7O1NBUUFtRixVQUFBLGlCQUFTcEYsTUFBVCxFQUE2QjtBQUN6QixTQUFLYyxDQUFMLElBQVVkLE1BQU0sQ0FBQ2MsQ0FBakI7QUFDQSxTQUFLQyxDQUFMLElBQVVmLE1BQU0sQ0FBQ2UsQ0FBakI7QUFDQSxTQUFLd0IsQ0FBTCxJQUFVdkMsTUFBTSxDQUFDdUMsQ0FBakI7QUFDQSxXQUFPLElBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7Ozs7O1NBV0FyQyxXQUFBLGtCQUFVRixNQUFWLEVBQThCO0FBQzFCLFNBQUtjLENBQUwsSUFBVWQsTUFBTSxDQUFDYyxDQUFqQjtBQUNBLFNBQUtDLENBQUwsSUFBVWYsTUFBTSxDQUFDZSxDQUFqQjtBQUNBLFdBQU8sSUFBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7Ozs7U0FXQVYsaUJBQUEsd0JBQWdCRCxHQUFoQixFQUFtQztBQUMvQixTQUFLVSxDQUFMLElBQVVWLEdBQVY7QUFDQSxTQUFLVyxDQUFMLElBQVVYLEdBQVY7QUFDQSxXQUFPLElBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7Ozs7O1NBV0FLLFdBQUEsa0JBQVVULE1BQVYsRUFBOEI7QUFDMUIsU0FBS2MsQ0FBTCxJQUFVZCxNQUFNLENBQUNjLENBQWpCO0FBQ0EsU0FBS0MsQ0FBTCxJQUFVZixNQUFNLENBQUNlLENBQWpCO0FBQ0EsV0FBTyxJQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7OztTQVdBUixTQUFBLGdCQUFRSCxHQUFSLEVBQTJCO0FBQ3ZCLFNBQUtVLENBQUwsSUFBVVYsR0FBVjtBQUNBLFNBQUtXLENBQUwsSUFBVVgsR0FBVjtBQUNBLFdBQU8sSUFBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7OztTQVVBTyxTQUFBLGtCQUFnQjtBQUNaLFNBQUtHLENBQUwsR0FBUyxDQUFDLEtBQUtBLENBQWY7QUFDQSxTQUFLQyxDQUFMLEdBQVMsQ0FBQyxLQUFLQSxDQUFmO0FBQ0EsV0FBTyxJQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7O1NBVUFzQixNQUFBLGFBQUtyQyxNQUFMLEVBQTJCO0FBQ3ZCLFdBQU8sS0FBS2MsQ0FBTCxHQUFTZCxNQUFNLENBQUNjLENBQWhCLEdBQW9CLEtBQUtDLENBQUwsR0FBU2YsTUFBTSxDQUFDZSxDQUEzQztBQUNIO0FBRUQ7Ozs7Ozs7Ozs7OztTQVVBdUIsUUFBQSxlQUFPdEMsTUFBUCxFQUE2QjtBQUN6QixXQUFPLEtBQUtjLENBQUwsR0FBU2QsTUFBTSxDQUFDZSxDQUFoQixHQUFvQixLQUFLQSxDQUFMLEdBQVNmLE1BQU0sQ0FBQ2MsQ0FBM0M7QUFDSDtBQUVEOzs7Ozs7Ozs7OztTQVNBZ0IsTUFBQSxlQUFlO0FBQ1gsV0FBT1QsSUFBSSxDQUFDTyxJQUFMLENBQVUsS0FBS2QsQ0FBTCxHQUFTLEtBQUtBLENBQWQsR0FBa0IsS0FBS0MsQ0FBTCxHQUFTLEtBQUtBLENBQTFDLENBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7OztTQVNBZ0IsWUFBQSxxQkFBcUI7QUFDakIsV0FBTyxLQUFLakIsQ0FBTCxHQUFTLEtBQUtBLENBQWQsR0FBa0IsS0FBS0MsQ0FBTCxHQUFTLEtBQUtBLENBQXZDO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7O1NBVUFzRSxnQkFBQSx5QkFBdUI7QUFDbkIsUUFBSW5CLE1BQU0sR0FBRyxLQUFLcEQsQ0FBTCxHQUFTLEtBQUtBLENBQWQsR0FBa0IsS0FBS0MsQ0FBTCxHQUFTLEtBQUtBLENBQTdDO0FBQ0EsUUFBSW1ELE1BQU0sS0FBSyxHQUFmLEVBQ0ksT0FBTyxJQUFQOztBQUVKLFFBQUlBLE1BQU0sS0FBSyxHQUFmLEVBQW9CO0FBQ2hCLGFBQU8sSUFBUDtBQUNIOztBQUVELFFBQUlvQixPQUFPLEdBQUcsTUFBTWpFLElBQUksQ0FBQ08sSUFBTCxDQUFVc0MsTUFBVixDQUFwQjtBQUNBLFNBQUtwRCxDQUFMLElBQVV3RSxPQUFWO0FBQ0EsU0FBS3ZFLENBQUwsSUFBVXVFLE9BQVY7QUFFQSxXQUFPLElBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7Ozs7Ozs7OztTQWVBbEQsWUFBQSxtQkFBV25DLEdBQVgsRUFBNkI7QUFDekJBLElBQUFBLEdBQUcsR0FBR0EsR0FBRyxJQUFJLElBQUlILElBQUosRUFBYjtBQUNBRyxJQUFBQSxHQUFHLENBQUNhLENBQUosR0FBUSxLQUFLQSxDQUFiO0FBQ0FiLElBQUFBLEdBQUcsQ0FBQ2MsQ0FBSixHQUFRLEtBQUtBLENBQWI7QUFDQWQsSUFBQUEsR0FBRyxDQUFDb0YsYUFBSjtBQUNBLFdBQU9wRixHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7O1NBT0FxRCxRQUFBLGVBQU90RCxNQUFQLEVBQTZCO0FBQ3pCLFFBQUl1RixPQUFPLEdBQUcsS0FBS3JCLE1BQUwsRUFBZDtBQUNBLFFBQUlzQixPQUFPLEdBQUd4RixNQUFNLENBQUNrRSxNQUFQLEVBQWQ7O0FBRUEsUUFBSXFCLE9BQU8sS0FBSyxDQUFaLElBQWlCQyxPQUFPLEtBQUssQ0FBakMsRUFBb0M7QUFDaENDLE1BQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLHFDQUFiO0FBQ0EsYUFBTyxHQUFQO0FBQ0g7O0FBRUQsUUFBSXJELEdBQUcsR0FBRyxLQUFLQSxHQUFMLENBQVNyQyxNQUFULENBQVY7QUFDQSxRQUFJMkYsS0FBSyxHQUFHdEQsR0FBRyxHQUFJaEIsSUFBSSxDQUFDTyxJQUFMLENBQVUyRCxPQUFPLEdBQUdDLE9BQXBCLENBQW5CO0FBQ0FHLElBQUFBLEtBQUssR0FBR1IsaUJBQUtILE1BQUwsQ0FBWVcsS0FBWixFQUFtQixDQUFDLEdBQXBCLEVBQXlCLEdBQXpCLENBQVI7QUFDQSxXQUFPdEUsSUFBSSxDQUFDcUMsSUFBTCxDQUFVaUMsS0FBVixDQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7O1NBT0FDLFlBQUEsbUJBQVc1RixNQUFYLEVBQWlDO0FBQzdCLFFBQUlzRCxLQUFLLEdBQUcsS0FBS0EsS0FBTCxDQUFXdEQsTUFBWCxDQUFaO0FBQ0EsV0FBTyxLQUFLc0MsS0FBTCxDQUFXdEMsTUFBWCxJQUFxQixDQUFyQixHQUF5QixDQUFDc0QsS0FBMUIsR0FBa0NBLEtBQXpDO0FBQ0g7QUFFRDs7Ozs7Ozs7OztTQVFBdUMsU0FBQSxnQkFBUUMsT0FBUixFQUF5QjdGLEdBQXpCLEVBQTJDO0FBQ3ZDQSxJQUFBQSxHQUFHLEdBQUdBLEdBQUcsSUFBSSxJQUFJSCxJQUFKLEVBQWI7QUFDQUcsSUFBQUEsR0FBRyxDQUFDYSxDQUFKLEdBQVEsS0FBS0EsQ0FBYjtBQUNBYixJQUFBQSxHQUFHLENBQUNjLENBQUosR0FBUSxLQUFLQSxDQUFiO0FBQ0EsV0FBT2QsR0FBRyxDQUFDOEYsVUFBSixDQUFlRCxPQUFmLENBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7O1NBUUFDLGFBQUEsb0JBQVlELE9BQVosRUFBbUM7QUFDL0IsUUFBSWhELEdBQUcsR0FBR3pCLElBQUksQ0FBQ3lCLEdBQUwsQ0FBU2dELE9BQVQsQ0FBVjtBQUNBLFFBQUlqRCxHQUFHLEdBQUd4QixJQUFJLENBQUN3QixHQUFMLENBQVNpRCxPQUFULENBQVY7QUFDQSxRQUFJaEYsQ0FBQyxHQUFHLEtBQUtBLENBQWI7QUFDQSxTQUFLQSxDQUFMLEdBQVMrQixHQUFHLEdBQUcvQixDQUFOLEdBQVVnQyxHQUFHLEdBQUcsS0FBSy9CLENBQTlCO0FBQ0EsU0FBS0EsQ0FBTCxHQUFTK0IsR0FBRyxHQUFHaEMsQ0FBTixHQUFVK0IsR0FBRyxHQUFHLEtBQUs5QixDQUE5QjtBQUNBLFdBQU8sSUFBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7Ozs7U0FXQWlGLFVBQUEsaUJBQVNoRyxNQUFULEVBQTZCO0FBQ3pCLFdBQU9BLE1BQU0sQ0FBQ0ssY0FBUCxDQUFzQixLQUFLZ0MsR0FBTCxDQUFTckMsTUFBVCxJQUFtQkEsTUFBTSxDQUFDcUMsR0FBUCxDQUFXckMsTUFBWCxDQUF6QyxDQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7O1NBT0FrRCxnQkFBQSx1QkFBZUQsQ0FBZixFQUF3QmhELEdBQXhCLEVBQTBDO0FBQ3RDQSxJQUFBQSxHQUFHLEdBQUdBLEdBQUcsSUFBSSxJQUFJSCxJQUFKLEVBQWI7QUFDQUEsSUFBQUEsSUFBSSxDQUFDb0QsYUFBTCxDQUFtQmpELEdBQW5CLEVBQXdCLElBQXhCLEVBQThCZ0QsQ0FBOUI7QUFDQSxXQUFPaEQsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7U0FLQWdHLFVBQUEsbUJBQW1CO0FBQ2YsV0FBTzVFLElBQUksQ0FBQ0csR0FBTCxDQUFTLEtBQUtWLENBQWQsRUFBaUIsS0FBS0MsQ0FBdEIsQ0FBUDtBQUNIOzs7RUF6L0I2Qm1GOzs7QUFBYnBHLEtBRVZDLE1BQVFELElBQUksQ0FBQ0k7QUFGSEosS0FHVkssTUFBUUwsSUFBSSxDQUFDVztBQUhIWCxLQUlWVSxRQUFRVixJQUFJLENBQUNPO0FBSkhQLEtBS1ZrRSxNQUFRbEUsSUFBSSxDQUFDZ0M7QUFMSGhDLEtBTVZxRyxtQkFBbUJyRyxJQUFJLENBQUNpQztBQU5kakMsS0FPVlEsTUFBTVIsSUFBSSxDQUFDUztBQVBEVCxLQXVDRHNHLFFBQVF0RyxJQUFJLENBQUN1RztBQXZDWnZHLEtBdUREd0csU0FBU3hHLElBQUksQ0FBQ3lHO0FBdkRiekcsS0F1RUQwRyxPQUFPMUcsSUFBSSxDQUFDMkc7QUF2RVgzRyxLQXVGRDRHLFVBQVU1RyxJQUFJLENBQUM2RztBQXE2Qm5DLElBQU1wRCxJQUFJLEdBQUcsSUFBSXpELElBQUosRUFBYjtBQUNBLElBQU0wRCxJQUFJLEdBQUcsSUFBSTFELElBQUosRUFBYjs7QUFFQThHLG9CQUFRQyxVQUFSLENBQW1CLFNBQW5CLEVBQThCL0csSUFBOUIsRUFBb0M7QUFBRWdCLEVBQUFBLENBQUMsRUFBRSxDQUFMO0FBQVFDLEVBQUFBLENBQUMsRUFBRTtBQUFYLENBQXBDO0FBSUE7Ozs7QUFLQTs7Ozs7Ozs7Ozs7Ozs7O0FBYUErRixFQUFFLENBQUNDLEVBQUgsR0FBUSxTQUFTQSxFQUFULENBQWFqRyxDQUFiLEVBQWdCQyxDQUFoQixFQUFtQjtBQUN2QixTQUFPLElBQUlqQixJQUFKLENBQVNnQixDQUFULEVBQVlDLENBQVosQ0FBUDtBQUNILENBRkQ7O0FBSUErRixFQUFFLENBQUNoSCxJQUFILEdBQVVBLElBQVYiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCBWYWx1ZVR5cGUgZnJvbSAnLi92YWx1ZS10eXBlJztcbmltcG9ydCBNYXQ0IGZyb20gJy4vbWF0NCc7XG5pbXBvcnQgQ0NDbGFzcyBmcm9tICcuLi9wbGF0Zm9ybS9DQ0NsYXNzJztcbmltcG9ydCBtaXNjIGZyb20gJy4uL3V0aWxzL21pc2MnO1xuaW1wb3J0IHsgRVBTSUxPTiwgcmFuZG9tIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBJVmVjMkxpa2UsIElNYXQ0TGlrZSwgSU1hdDNMaWtlIH0gZnJvbSAnLi9tYXRoJztcblxubGV0IF94OiBudW1iZXIgPSAwLjA7XG5sZXQgX3k6IG51bWJlciA9IDAuMDtcblxuLyoqXG4gKiAhI2VuIFJlcHJlc2VudGF0aW9uIG9mIDJEIHZlY3RvcnMgYW5kIHBvaW50cy5cbiAqICEjemgg6KGo56S6IDJEIOWQkemHj+WSjOWdkOagh1xuICpcbiAqIEBjbGFzcyBWZWMyXG4gKiBAZXh0ZW5kcyBWYWx1ZVR5cGVcbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWZWMyIGV4dGVuZHMgVmFsdWVUeXBlIHtcbiAgICAvLyBkZXByZWNhdGVkXG4gICAgc3RhdGljIHN1YiAgID0gVmVjMi5zdWJ0cmFjdDtcbiAgICBzdGF0aWMgbXVsICAgPSBWZWMyLm11bHRpcGx5O1xuICAgIHN0YXRpYyBzY2FsZSA9IFZlYzIubXVsdGlwbHlTY2FsYXI7XG4gICAgc3RhdGljIG1hZyAgID0gVmVjMi5sZW47XG4gICAgc3RhdGljIHNxdWFyZWRNYWduaXR1ZGUgPSBWZWMyLmxlbmd0aFNxcjtcbiAgICBzdGF0aWMgZGl2ID0gVmVjMi5kaXZpZGU7XG4gICAgbWFnICA9IFZlYzIucHJvdG90eXBlLmxlbjtcbiAgICBtYWdTcXIgPSBWZWMyLnByb3RvdHlwZS5sZW5ndGhTcXI7XG4gICAgc3ViU2VsZiAgPSBWZWMyLnByb3RvdHlwZS5zdWJ0cmFjdDtcbiAgICBzdWIgKHZlY3RvcjogVmVjMiwgb3V0PzogVmVjMik6IFZlYzIge1xuICAgICAgICByZXR1cm4gVmVjMi5zdWJ0cmFjdChvdXQgfHwgbmV3IFZlYzIoKSwgdGhpcywgdmVjdG9yKTtcbiAgICB9XG4gICAgbXVsU2VsZiAgPSBWZWMyLnByb3RvdHlwZS5tdWx0aXBseVNjYWxhcjtcbiAgICBtdWwgKG51bTogbnVtYmVyLCBvdXQ/OiBWZWMyKTogVmVjMiB7XG4gICAgICAgIHJldHVybiBWZWMyLm11bHRpcGx5U2NhbGFyKG91dCB8fCBuZXcgVmVjMigpLCB0aGlzLCBudW0pO1xuICAgIH1cbiAgICBkaXZTZWxmICA9IFZlYzIucHJvdG90eXBlLmRpdmlkZTtcbiAgICBkaXYgKHZlY3RvcjogVmVjMiwgb3V0PzogVmVjMik6IFZlYzIge1xuICAgICAgICByZXR1cm4gVmVjMi5kaXZpZGUob3V0IHx8IG5ldyBWZWMyKCksIHRoaXMsIHZlY3Rvcik7XG4gICAgfVxuICAgIHNjYWxlU2VsZiA9IFZlYzIucHJvdG90eXBlLm11bHRpcGx5O1xuICAgIHNjYWxlICh2ZWN0b3I6IFZlYzIsIG91dD86IFZlYzIpOiBWZWMyIHtcbiAgICAgICAgcmV0dXJuIFZlYzIubXVsdGlwbHkob3V0IHx8IG5ldyBWZWMyKCksIHRoaXMsIHZlY3Rvcik7XG4gICAgfVxuICAgIG5lZ1NlbGYgPSBWZWMyLnByb3RvdHlwZS5uZWdhdGU7XG4gICAgbmVnIChvdXQ/OiBWZWMyKTogVmVjMiB7XG4gICAgICAgIHJldHVybiBWZWMyLm5lZ2F0ZShvdXQgfHwgbmV3IFZlYzIoKSwgdGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiByZXR1cm4gYSBWZWMyIG9iamVjdCB3aXRoIHggPSAxIGFuZCB5ID0gMS5cbiAgICAgKiAhI3poIOaWsCBWZWMyIOWvueixoeOAglxuICAgICAqIEBwcm9wZXJ0eSBPTkVcbiAgICAgKiBAdHlwZSBWZWMyXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgT05FICgpIHsgcmV0dXJuIG5ldyBWZWMyKDEsIDEpIH07XG4gICAgc3RhdGljIHJlYWRvbmx5IE9ORV9SID0gVmVjMi5PTkU7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIHJldHVybiBhIFZlYzIgb2JqZWN0IHdpdGggeCA9IDAgYW5kIHkgPSAwLlxuICAgICAqICEjemgg6L+U5ZueIHggPSAwIOWSjCB5ID0gMCDnmoQgVmVjMiDlr7nosaHjgIJcbiAgICAgKiBAcHJvcGVydHkge1ZlYzJ9IFpFUk9cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGdldCBaRVJPICgpIHsgcmV0dXJuIG5ldyBWZWMyKDAsIDApIH07XG4gICAgLyoqXG4gICAgICogISNlbiByZXR1cm4gYSByZWFkb25seSBWZWMyIG9iamVjdCB3aXRoIHggPSAwIGFuZCB5ID0gMC5cbiAgICAgKiAhI3poIOi/lOWbnuS4gOS4qiB4ID0gMCDlkowgeSA9IDAg55qEIFZlYzIg5Y+q6K+75a+56LGh44CCXG4gICAgICogQHByb3BlcnR5IHtWZWMyfSBaRVJPX1JcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHJlYWRvbmx5IFpFUk9fUiA9IFZlYzIuWkVSTztcblxuICAgIC8qKlxuICAgICAqICEjZW4gcmV0dXJuIGEgVmVjMiBvYmplY3Qgd2l0aCB4ID0gMCBhbmQgeSA9IDEuXG4gICAgICogISN6aCDov5Tlm54geCA9IDAg5ZKMIHkgPSAxIOeahCBWZWMyIOWvueixoeOAglxuICAgICAqIEBwcm9wZXJ0eSB7VmVjMn0gVVBcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGdldCBVUCAoKSB7IHJldHVybiBuZXcgVmVjMigwLCAxKSB9O1xuICAgIC8qKlxuICAgICAqICEjZW4gcmV0dXJuIGEgcmVhZG9ubHkgVmVjMiBvYmplY3Qgd2l0aCB4ID0gMCBhbmQgeSA9IDEuXG4gICAgICogISN6aCDov5Tlm54geCA9IDAg5ZKMIHkgPSAxIOeahCBWZWMyIOWPquivu+WvueixoeOAglxuICAgICAqIEBwcm9wZXJ0eSB7VmVjMn0gVVBcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgc3RhdGljIHJlYWRvbmx5IFVQX1IgPSBWZWMyLlVQO1xuXG4gICAgLyoqXG4gICAgICogISNlbiByZXR1cm4gYSByZWFkb25seSBWZWMyIG9iamVjdCB3aXRoIHggPSAxIGFuZCB5ID0gMC5cbiAgICAgKiAhI3poIOi/lOWbniB4ID0gMSDlkowgeSA9IDAg55qEIFZlYzIg5Y+q6K+75a+56LGh44CCXG4gICAgICogQHByb3BlcnR5IHtWZWMyfSBSSUdIVFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IFJJR0hUICgpIHsgcmV0dXJuIG5ldyBWZWMyKDEsIDApIH07XG4gICAgLyoqXG4gICAgICogISNlbiByZXR1cm4gYSBWZWMyIG9iamVjdCB3aXRoIHggPSAxIGFuZCB5ID0gMC5cbiAgICAgKiAhI3poIOi/lOWbniB4ID0gMSDlkowgeSA9IDAg55qEIFZlYzIg5a+56LGh44CCXG4gICAgICogQHByb3BlcnR5IHtWZWMyfSBSSUdIVF9SXG4gICAgICogQHN0YXRpY1xuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHN0YXRpYyByZWFkb25seSBSSUdIVF9SID0gVmVjMi5SSUdIVDtcblxuICAgIC8qKlxuICAgICAqICEjemgg6I635b6X5oyH5a6a5ZCR6YeP55qE5ou36LSdXG4gICAgICogQG1ldGhvZCBjbG9uZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIGNsb25lIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChhOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBjbG9uZSA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAoYTogT3V0KSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMihhLngsIGEueSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlpI3liLbmjIflrprlkJHph4/nmoTlgLxcbiAgICAgKiBAbWV0aG9kIGNvcHlcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBjb3B5IDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgY29weSA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xuICAgICAgICBvdXQueCA9IGEueDtcbiAgICAgICAgb3V0LnkgPSBhLnk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCAg6K6+572u5ZCR6YeP5YC8XG4gICAgICogQG1ldGhvZCBzZXRcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBzZXQgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCB4OiBudW1iZXIsIHk6IG51bWJlcilcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHNldCA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgICAgIG91dC54ID0geDtcbiAgICAgICAgb3V0LnkgPSB5O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP5Yqg5rOVXG4gICAgICogQG1ldGhvZCBhZGRcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBhZGQgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGFkZCA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KSB7XG4gICAgICAgIG91dC54ID0gYS54ICsgYi54O1xuICAgICAgICBvdXQueSA9IGEueSArIGIueTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+WHj+azlVxuICAgICAqIEBtZXRob2Qgc3VidHJhY3RcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBzdWJ0cmFjdCA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgc3VidHJhY3QgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICBvdXQueCA9IGEueCAtIGIueDtcbiAgICAgICAgb3V0LnkgPSBhLnkgLSBiLnk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/kuZjms5VcbiAgICAgKiBAbWV0aG9kIG11bHRpcGx5XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgbXVsdGlwbHkgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIG11bHRpcGx5IDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgb3V0LnggPSBhLnggKiBiLng7XG4gICAgICAgIG91dC55ID0gYS55ICogYi55O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP6Zmk5rOVXG4gICAgICogQG1ldGhvZCBkaXZpZGVcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBkaXZpZGUgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGRpdmlkZSA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KSB7XG4gICAgICAgIG91dC54ID0gYS54IC8gYi54O1xuICAgICAgICBvdXQueSA9IGEueSAvIGIueTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+WQkeS4iuWPluaVtFxuICAgICAqIEBtZXRob2QgY2VpbFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIGNlaWwgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCBhOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBjZWlsIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XG4gICAgICAgIG91dC54ID0gTWF0aC5jZWlsKGEueCk7XG4gICAgICAgIG91dC55ID0gTWF0aC5jZWlsKGEueSk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/lkJHkuIvlj5bmlbRcbiAgICAgKiBAbWV0aG9kIGNlaWxcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBmbG9vciA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGZsb29yIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XG4gICAgICAgIG91dC54ID0gTWF0aC5mbG9vcihhLngpO1xuICAgICAgICBvdXQueSA9IE1hdGguZmxvb3IoYS55KTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+acgOWwj+WAvFxuICAgICAqIEBtZXRob2QgbWluXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgbWluIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBtaW4gPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICBvdXQueCA9IE1hdGgubWluKGEueCwgYi54KTtcbiAgICAgICAgb3V0LnkgPSBNYXRoLm1pbihhLnksIGIueSk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/mnIDlpKflgLxcbiAgICAgKiBAbWV0aG9kIG1heFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIG1heCA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgbWF4IDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgb3V0LnggPSBNYXRoLm1heChhLngsIGIueCk7XG4gICAgICAgIG91dC55ID0gTWF0aC5tYXgoYS55LCBiLnkpO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP5Zub6IiN5LqU5YWl5Y+W5pW0XG4gICAgICogQG1ldGhvZCByb3VuZFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIHJvdW5kIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgcm91bmQgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcbiAgICAgICAgb3V0LnggPSBNYXRoLnJvdW5kKGEueCk7XG4gICAgICAgIG91dC55ID0gTWF0aC5yb3VuZChhLnkpO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5ZCR6YeP5qCH6YeP5LmY5rOVXG4gICAgICogQG1ldGhvZCBtdWx0aXBseVNjYWxhclxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIG11bHRpcGx5U2NhbGFyIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBudW1iZXIpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBtdWx0aXBseVNjYWxhciA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogbnVtYmVyKSB7XG4gICAgICAgIG91dC54ID0gYS54ICogYjtcbiAgICAgICAgb3V0LnkgPSBhLnkgKiBiO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP5LmY5YqgOiBBICsgQiAqIHNjYWxlXG4gICAgICogQG1ldGhvZCBzY2FsZUFuZEFkZFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIHNjYWxlQW5kQWRkIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQsIHNjYWxlOiBudW1iZXIpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBzY2FsZUFuZEFkZCA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0LCBzY2FsZTogbnVtYmVyKSB7XG4gICAgICAgIG91dC54ID0gYS54ICsgKGIueCAqIHNjYWxlKTtcbiAgICAgICAgb3V0LnkgPSBhLnkgKyAoYi55ICogc2NhbGUpO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5rGC5Lik5ZCR6YeP55qE5qyn5rCP6Led56a7XG4gICAgICogQG1ldGhvZCBkaXN0YW5jZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIGRpc3RhbmNlIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChhOiBPdXQsIGI6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGRpc3RhbmNlIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICBfeCA9IGIueCAtIGEueDtcbiAgICAgICAgX3kgPSBiLnkgLSBhLnk7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoX3ggKiBfeCArIF95ICogX3kpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5rGC5Lik5ZCR6YeP55qE5qyn5rCP6Led56a75bmz5pa5XG4gICAgICogQG1ldGhvZCBzcXVhcmVkRGlzdGFuY2VcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBzcXVhcmVkRGlzdGFuY2UgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKGE6IE91dCwgYjogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgc3F1YXJlZERpc3RhbmNlIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICBfeCA9IGIueCAtIGEueDtcbiAgICAgICAgX3kgPSBiLnkgLSBhLnk7XG4gICAgICAgIHJldHVybiBfeCAqIF94ICsgX3kgKiBfeTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOaxguWQkemHj+mVv+W6plxuICAgICAqIEBtZXRob2QgbGVuXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgbGVuIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChhOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBsZW4gPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKGE6IE91dCkge1xuICAgICAgICBfeCA9IGEueDtcbiAgICAgICAgX3kgPSBhLnk7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoX3ggKiBfeCArIF95ICogX3kpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5rGC5ZCR6YeP6ZW/5bqm5bmz5pa5XG4gICAgICogQG1ldGhvZCBsZW5ndGhTcXJcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBsZW5ndGhTcXIgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKGE6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGxlbmd0aFNxciA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAoYTogT3V0KSB7XG4gICAgICAgIF94ID0gYS54O1xuICAgICAgICBfeSA9IGEueTtcbiAgICAgICAgcmV0dXJuIF94ICogX3ggKyBfeSAqIF95O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP5Y+W6LSfXG4gICAgICogQG1ldGhvZCBuZWdhdGVcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBuZWdhdGUgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCBhOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBuZWdhdGUgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcbiAgICAgICAgb3V0LnggPSAtYS54O1xuICAgICAgICBvdXQueSA9IC1hLnk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/lj5blgJLmlbDvvIzmjqXov5EgMCDml7bov5Tlm54gSW5maW5pdHlcbiAgICAgKiBAbWV0aG9kIGludmVyc2VcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBpbnZlcnNlIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgaW52ZXJzZSA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xuICAgICAgICBvdXQueCA9IDEuMCAvIGEueDtcbiAgICAgICAgb3V0LnkgPSAxLjAgLyBhLnk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/lj5blgJLmlbDvvIzmjqXov5EgMCDml7bov5Tlm54gMFxuICAgICAqIEBtZXRob2QgaW52ZXJzZVNhZmVcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBpbnZlcnNlU2FmZSA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGludmVyc2VTYWZlIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XG4gICAgICAgIF94ID0gYS54O1xuICAgICAgICBfeSA9IGEueTtcblxuICAgICAgICBpZiAoTWF0aC5hYnMoX3gpIDwgRVBTSUxPTikge1xuICAgICAgICAgICAgb3V0LnggPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0LnggPSAxLjAgLyBfeDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChNYXRoLmFicyhfeSkgPCBFUFNJTE9OKSB7XG4gICAgICAgICAgICBvdXQueSA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXQueSA9IDEuMCAvIF95O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOW9kuS4gOWMluWQkemHj1xuICAgICAqIEBtZXRob2Qgbm9ybWFsaXplXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgbm9ybWFsaXplIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2UsIFZlYzJMaWtlIGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IFZlYzJMaWtlKVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgbm9ybWFsaXplIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2UsIFZlYzJMaWtlIGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IFZlYzJMaWtlKSB7XG4gICAgICAgIF94ID0gYS54O1xuICAgICAgICBfeSA9IGEueTtcbiAgICAgICAgbGV0IGxlbiA9IF94ICogX3ggKyBfeSAqIF95O1xuICAgICAgICBpZiAobGVuID4gMCkge1xuICAgICAgICAgICAgbGVuID0gMSAvIE1hdGguc3FydChsZW4pO1xuICAgICAgICAgICAgb3V0LnggPSBfeCAqIGxlbjtcbiAgICAgICAgICAgIG91dC55ID0gX3kgKiBsZW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWQkemHj+eCueenr++8iOaVsOmHj+enr++8iVxuICAgICAqIEBtZXRob2QgZG90XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgZG90IDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChhOiBPdXQsIGI6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGRvdCA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAoYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgcmV0dXJuIGEueCAqIGIueCArIGEueSAqIGIueTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWQkemHj+WPieenr++8iOWQkemHj+enr++8ie+8jOazqOaEj+S6jOe7tOWQkemHj+eahOWPieenr+S4uuS4jiBaIOi9tOW5s+ihjOeahOS4iee7tOWQkemHj1xuICAgICAqIEBtZXRob2QgY3Jvc3NcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBjcm9zcyA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBWZWMyLCBhOiBPdXQsIGI6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGNyb3NzIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IFZlYzIsIGE6IE91dCwgYjogT3V0KSB7XG4gICAgICAgIG91dC54ID0gb3V0LnkgPSAwO1xuICAgICAgICBvdXQueiA9IGEueCAqIGIueSAtIGEueSAqIGIueDtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+e6v+aAp+aPkuWAvO+8miBBICsgdCAqIChCIC0gQSlcbiAgICAgKiBAbWV0aG9kIGxlcnBcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBsZXJwIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQsIHQ6IG51bWJlcilcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGxlcnAgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCwgdDogbnVtYmVyKSB7XG4gICAgICAgIF94ID0gYS54O1xuICAgICAgICBfeSA9IGEueTtcbiAgICAgICAgb3V0LnggPSBfeCArIHQgKiAoYi54IC0gX3gpO1xuICAgICAgICBvdXQueSA9IF95ICsgdCAqIChiLnkgLSBfeSk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDnlJ/miJDkuIDkuKrlnKjljZXkvY3lnIbkuIrlnYfljIDliIbluIPnmoTpmo/mnLrlkJHph49cbiAgICAgKiBAbWV0aG9kIHJhbmRvbVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIHJhbmRvbSA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIHNjYWxlPzogbnVtYmVyKVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgcmFuZG9tIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgc2NhbGU/OiBudW1iZXIpIHtcbiAgICAgICAgc2NhbGUgPSBzY2FsZSB8fCAxLjA7XG4gICAgICAgIGNvbnN0IHIgPSByYW5kb20oKSAqIDIuMCAqIE1hdGguUEk7XG4gICAgICAgIG91dC54ID0gTWF0aC5jb3MocikgKiBzY2FsZTtcbiAgICAgICAgb3V0LnkgPSBNYXRoLnNpbihyKSAqIHNjYWxlO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5ZCR6YeP5LiO5LiJ57u055+p6Zi15LmY5rOV77yM6buY6K6k5ZCR6YeP56ys5LiJ5L2N5Li6IDHjgIJcbiAgICAgKiBAbWV0aG9kIHRyYW5zZm9ybU1hdDNcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyB0cmFuc2Zvcm1NYXQzIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2UsIE1hdExpa2UgZXh0ZW5kcyBJTWF0M0xpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBtYXQ6IElNYXQzTGlrZSlcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHRyYW5zZm9ybU1hdDMgPE91dCBleHRlbmRzIElWZWMyTGlrZSwgTWF0TGlrZSBleHRlbmRzIElNYXQzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIG1hdDogTWF0TGlrZSkge1xuICAgICAgICBfeCA9IGEueDtcbiAgICAgICAgX3kgPSBhLnk7XG4gICAgICAgIGxldCBtID0gbWF0Lm07XG4gICAgICAgIG91dC54ID0gbVswXSAqIF94ICsgbVszXSAqIF95ICsgbVs2XTtcbiAgICAgICAgb3V0LnkgPSBtWzFdICogX3ggKyBtWzRdICogX3kgKyBtWzddO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5ZCR6YeP5LiO5Zub57u055+p6Zi15LmY5rOV77yM6buY6K6k5ZCR6YeP56ys5LiJ5L2N5Li6IDDvvIznrKzlm5vkvY3kuLogMeOAglxuICAgICAqIEBtZXRob2QgdHJhbnNmb3JtTWF0NFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIHRyYW5zZm9ybU1hdDQgPE91dCBleHRlbmRzIElWZWMyTGlrZSwgTWF0TGlrZSBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIG1hdDogTWF0TGlrZSlcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHRyYW5zZm9ybU1hdDQgPE91dCBleHRlbmRzIElWZWMyTGlrZSwgTWF0TGlrZSBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIG1hdDogTWF0TGlrZSkge1xuICAgICAgICBfeCA9IGEueDtcbiAgICAgICAgX3kgPSBhLnk7XG4gICAgICAgIGxldCBtID0gbWF0Lm07XG4gICAgICAgIG91dC54ID0gbVswXSAqIF94ICsgbVs0XSAqIF95ICsgbVsxMl07XG4gICAgICAgIG91dC55ID0gbVsxXSAqIF94ICsgbVs1XSAqIF95ICsgbVsxM107XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlkJHph4/nrYnku7fliKTmlq1cbiAgICAgKiBAbWV0aG9kIHN0cmljdEVxdWFsc1xuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIHN0cmljdEVxdWFscyA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAoYTogT3V0LCBiOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBzdHJpY3RFcXVhbHMgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKGE6IE91dCwgYjogT3V0KSB7XG4gICAgICAgIHJldHVybiBhLnggPT09IGIueCAmJiBhLnkgPT09IGIueTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOaOkumZpOa1rueCueaVsOivr+W3rueahOWQkemHj+i/keS8vOetieS7t+WIpOaWrVxuICAgICAqIEBtZXRob2QgZXF1YWxzXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgZXF1YWxzIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChhOiBPdXQsIGI6IE91dCwgIGVwc2lsb24gPSBFUFNJTE9OKVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZXF1YWxzIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChhOiBPdXQsIGI6IE91dCwgIGVwc2lsb24gPSBFUFNJTE9OKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBNYXRoLmFicyhhLnggLSBiLngpIDw9XG4gICAgICAgICAgICBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhLngpLCBNYXRoLmFicyhiLngpKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYS55IC0gYi55KSA8PVxuICAgICAgICAgICAgZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYS55KSwgTWF0aC5hYnMoYi55KSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOaOkumZpOa1rueCueaVsOivr+W3rueahOWQkemHj+i/keS8vOetieS7t+WIpOaWrVxuICAgICAqIEBtZXRob2QgYW5nbGVcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBhbmdsZSA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAoYTogT3V0LCBiOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBhbmdsZSA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAoYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgVmVjMi5ub3JtYWxpemUodjJfMSwgYSk7XG4gICAgICAgIFZlYzIubm9ybWFsaXplKHYyXzIsIGIpO1xuICAgICAgICBjb25zdCBjb3NpbmUgPSBWZWMyLmRvdCh2Ml8xLCB2Ml8yKTtcbiAgICAgICAgaWYgKGNvc2luZSA+IDEuMCkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvc2luZSA8IC0xLjApIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLlBJO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNYXRoLmFjb3MoY29zaW5lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWQkemHj+i9rOaVsOe7hFxuICAgICAqIEBtZXRob2QgdG9BcnJheVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIHRvQXJyYXkgPE91dCBleHRlbmRzIElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+PiAob3V0OiBPdXQsIHY6IElWZWMyTGlrZSwgb2ZzID0gMClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHRvQXJyYXkgPE91dCBleHRlbmRzIElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+PiAob3V0OiBPdXQsIHY6IElWZWMyTGlrZSwgb2ZzID0gMCkge1xuICAgICAgICBvdXRbb2ZzICsgMF0gPSB2Lng7XG4gICAgICAgIG91dFtvZnMgKyAxXSA9IHYueTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOaVsOe7hOi9rOWQkemHj1xuICAgICAqIEBtZXRob2QgZnJvbUFycmF5XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgZnJvbUFycmF5IDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYXJyOiBJV3JpdGFibGVBcnJheUxpa2U8bnVtYmVyPiwgb2ZzID0gMClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGZyb21BcnJheSA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGFycjogSVdyaXRhYmxlQXJyYXlMaWtlPG51bWJlcj4sIG9mcyA9IDApIHtcbiAgICAgICAgb3V0LnggPSBhcnJbb2ZzICsgMF07XG4gICAgICAgIG91dC55ID0gYXJyW29mcyArIDFdO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB4XG4gICAgICovXG4gICAgeDogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHlcbiAgICAgKi9cbiAgICB5OiBudW1iZXI7XG5cbiAgICAvLyBjb21wYXRpYmxlIHdpdGggdmVjM1xuICAgIHo6IG51bWJlciA9IDA7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQ29uc3RydWN0b3JcbiAgICAgKiBzZWUge3sjY3Jvc3NMaW5rIFwiY2MvdmVjMjptZXRob2RcIn19Y2MudjJ7ey9jcm9zc0xpbmt9fSBvciB7eyNjcm9zc0xpbmsgXCJjYy9wOm1ldGhvZFwifX1jYy5we3svY3Jvc3NMaW5rfX1cbiAgICAgKiAhI3poXG4gICAgICog5p6E6YCg5Ye95pWw77yM5Y+v5p+l55yLIHt7I2Nyb3NzTGluayBcImNjL3ZlYzI6bWV0aG9kXCJ9fWNjLnYye3svY3Jvc3NMaW5rfX0g5oiW6ICFIHt7I2Nyb3NzTGluayBcImNjL3A6bWV0aG9kXCJ9fWNjLnB7ey9jcm9zc0xpbmt9fVxuICAgICAqIEBtZXRob2QgY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3g9MF1cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3k9MF1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvciAoeDogbnVtYmVyIHwgVmVjMiA9IDAsIHk6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICBpZiAoeCAmJiB0eXBlb2YgeCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHRoaXMueSA9IHgueSB8fCAwO1xuICAgICAgICAgICAgdGhpcy54ID0geC54IHx8IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnggPSB4IGFzIG51bWJlciB8fCAwO1xuICAgICAgICAgICAgdGhpcy55ID0geSB8fCAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBjbG9uZSBhIFZlYzIgb2JqZWN0XG4gICAgICogISN6aCDlhYvpmobkuIDkuKogVmVjMiDlr7nosaFcbiAgICAgKiBAbWV0aG9kIGNsb25lXG4gICAgICogQHJldHVybiB7VmVjMn1cbiAgICAgKi9cbiAgICBjbG9uZSAoKTogVmVjMiB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMih0aGlzLngsIHRoaXMueSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXRzIHZlY3RvciB3aXRoIGFub3RoZXIncyB2YWx1ZVxuICAgICAqICEjemgg6K6+572u5ZCR6YeP5YC844CCXG4gICAgICogQG1ldGhvZCBzZXRcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IG5ld1ZhbHVlIC0gISNlbiBuZXcgdmFsdWUgdG8gc2V0LiAhI3poIOimgeiuvue9rueahOaWsOWAvFxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IHJldHVybnMgdGhpc1xuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKi9cbiAgICBzZXQgKG5ld1ZhbHVlOiBWZWMyKTogdGhpcyB7XG4gICAgICAgIHRoaXMueCA9IG5ld1ZhbHVlLng7XG4gICAgICAgIHRoaXMueSA9IG5ld1ZhbHVlLnk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2hlY2sgd2hldGhlciB0d28gdmVjdG9yIGVxdWFsXG4gICAgICogISN6aCDlvZPliY3nmoTlkJHph4/mmK/lkKbkuI7mjIflrprnmoTlkJHph4/nm7jnrYnjgIJcbiAgICAgKiBAbWV0aG9kIGVxdWFsc1xuICAgICAqIEBwYXJhbSB7VmVjMn0gb3RoZXJcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGVxdWFscyAob3RoZXI6IFZlYzIpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIG90aGVyICYmIHRoaXMueCA9PT0gb3RoZXIueCAmJiB0aGlzLnkgPT09IG90aGVyLnk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBDaGVjayB3aGV0aGVyIHR3byB2ZWN0b3IgZXF1YWwgd2l0aCBzb21lIGRlZ3JlZSBvZiB2YXJpYW5jZS5cbiAgICAgKiAhI3poXG4gICAgICog6L+R5Ly85Yik5pat5Lik5Liq54K55piv5ZCm55u4562J44CCPGJyLz5cbiAgICAgKiDliKTmlq0gMiDkuKrlkJHph4/mmK/lkKblnKjmjIflrprmlbDlgLznmoTojIPlm7TkuYvlhoXvvIzlpoLmnpzlnKjliJnov5Tlm54gdHJ1Ze+8jOWPjeS5i+WImei/lOWbniBmYWxzZeOAglxuICAgICAqIEBtZXRob2QgZnV6enlFcXVhbHNcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IG90aGVyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHZhcmlhbmNlXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBmdXp6eUVxdWFscyAob3RoZXI6IFZlYzIsIHZhcmlhbmNlKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLnggLSB2YXJpYW5jZSA8PSBvdGhlci54ICYmIG90aGVyLnggPD0gdGhpcy54ICsgdmFyaWFuY2UpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnkgLSB2YXJpYW5jZSA8PSBvdGhlci55ICYmIG90aGVyLnkgPD0gdGhpcy55ICsgdmFyaWFuY2UpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gVHJhbnNmb3JtIHRvIHN0cmluZyB3aXRoIHZlY3RvciBpbmZvcm1hdGlvbnNcbiAgICAgKiAhI3poIOi9rOaNouS4uuaWueS+v+mYheivu+eahOWtl+espuS4suOAglxuICAgICAqIEBtZXRob2QgdG9TdHJpbmdcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgdG9TdHJpbmcgKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBcIihcIiArXG4gICAgICAgICAgICB0aGlzLngudG9GaXhlZCgyKSArIFwiLCBcIiArXG4gICAgICAgICAgICB0aGlzLnkudG9GaXhlZCgyKSArIFwiKVwiXG4gICAgICAgICAgICA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBDYWxjdWxhdGUgbGluZWFyIGludGVycG9sYXRpb24gcmVzdWx0IGJldHdlZW4gdGhpcyB2ZWN0b3IgYW5kIGFub3RoZXIgb25lIHdpdGggZ2l2ZW4gcmF0aW9cbiAgICAgKiAhI3poIOe6v+aAp+aPkuWAvOOAglxuICAgICAqIEBtZXRob2QgbGVycFxuICAgICAqIEBwYXJhbSB7VmVjMn0gdG9cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcmF0aW8gLSB0aGUgaW50ZXJwb2xhdGlvbiBjb2VmZmljaWVudFxuICAgICAqIEBwYXJhbSB7VmVjMn0gW291dF0gLSBvcHRpb25hbCwgdGhlIHJlY2VpdmluZyB2ZWN0b3IsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSB2ZWMyIHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyB2ZWMyIHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm4ge1ZlYzJ9XG4gICAgICovXG4gICAgbGVycCAodG86IFZlYzIsIHJhdGlvOiBudW1iZXIsIG91dD86IFZlYzIpOiBWZWMyIHtcbiAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBWZWMyKCk7XG4gICAgICAgIHZhciB4ID0gdGhpcy54O1xuICAgICAgICB2YXIgeSA9IHRoaXMueTtcbiAgICAgICAgb3V0LnggPSB4ICsgKHRvLnggLSB4KSAqIHJhdGlvO1xuICAgICAgICBvdXQueSA9IHkgKyAodG8ueSAtIHkpICogcmF0aW87XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBDbGFtcCB0aGUgdmVjdG9yIGJldHdlZW4gZnJvbSBmbG9hdCBhbmQgdG8gZmxvYXQuXG4gICAgICogISN6aFxuICAgICAqIOi/lOWbnuaMh+WumumZkOWItuWMuuWfn+WQjueahOWQkemHj+OAgjxici8+XG4gICAgICog5ZCR6YeP5aSn5LqOIG1heF9pbmNsdXNpdmUg5YiZ6L+U5ZueIG1heF9pbmNsdXNpdmXjgII8YnIvPlxuICAgICAqIOWQkemHj+Wwj+S6jiBtaW5faW5jbHVzaXZlIOWImei/lOWbniBtaW5faW5jbHVzaXZl44CCPGJyLz5cbiAgICAgKiDlkKbliJnov5Tlm57oh6rouqvjgIJcbiAgICAgKiBAbWV0aG9kIGNsYW1wZlxuICAgICAqIEBwYXJhbSB7VmVjMn0gbWluX2luY2x1c2l2ZVxuICAgICAqIEBwYXJhbSB7VmVjMn0gbWF4X2luY2x1c2l2ZVxuICAgICAqIEByZXR1cm4ge1ZlYzJ9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgbWluX2luY2x1c2l2ZSA9IGNjLnYyKDAsIDApO1xuICAgICAqIHZhciBtYXhfaW5jbHVzaXZlID0gY2MudjIoMjAsIDIwKTtcbiAgICAgKiB2YXIgdjEgPSBjYy52MigyMCwgMjApLmNsYW1wZihtaW5faW5jbHVzaXZlLCBtYXhfaW5jbHVzaXZlKTsgLy8gVmVjMiB7eDogMjAsIHk6IDIwfTtcbiAgICAgKiB2YXIgdjIgPSBjYy52MigwLCAwKS5jbGFtcGYobWluX2luY2x1c2l2ZSwgbWF4X2luY2x1c2l2ZSk7ICAgLy8gVmVjMiB7eDogMCwgeTogMH07XG4gICAgICogdmFyIHYzID0gY2MudjIoMTAsIDEwKS5jbGFtcGYobWluX2luY2x1c2l2ZSwgbWF4X2luY2x1c2l2ZSk7IC8vIFZlYzIge3g6IDEwLCB5OiAxMH07XG4gICAgICovXG4gICAgY2xhbXBmIChtaW5faW5jbHVzaXZlOiBWZWMyLCBtYXhfaW5jbHVzaXZlOiBWZWMyKTogdGhpcyB7XG4gICAgICAgIHRoaXMueCA9IG1pc2MuY2xhbXBmKHRoaXMueCwgbWluX2luY2x1c2l2ZS54LCBtYXhfaW5jbHVzaXZlLngpO1xuICAgICAgICB0aGlzLnkgPSBtaXNjLmNsYW1wZih0aGlzLnksIG1pbl9pbmNsdXNpdmUueSwgbWF4X2luY2x1c2l2ZS55KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBBZGRzIHRoaXMgdmVjdG9yLlxuICAgICAqICEjemgg5ZCR6YeP5Yqg5rOV44CCXG4gICAgICogQG1ldGhvZCBhZGRcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IHZlY3RvclxuICAgICAqIEBwYXJhbSB7VmVjMn0gW291dF1cbiAgICAgKiBAcmV0dXJuIHtWZWMyfSByZXR1cm5zIHRoaXNcbiAgICAgKiBAY2hhaW5hYmxlXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgdiA9IGNjLnYyKDEwLCAxMCk7XG4gICAgICogdi5hZGQoY2MudjIoNSwgNSkpOy8vIHJldHVybiBWZWMyIHt4OiAxNSwgeTogMTV9O1xuICAgICAqL1xuICAgIGFkZCAodmVjdG9yOiBWZWMyLCBvdXQ/OiBWZWMyKTogVmVjMiB7XG4gICAgICAgIG91dCA9IG91dCB8fCBuZXcgVmVjMigpO1xuICAgICAgICBvdXQueCA9IHRoaXMueCArIHZlY3Rvci54O1xuICAgICAgICBvdXQueSA9IHRoaXMueSArIHZlY3Rvci55O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gQWRkcyB0aGlzIHZlY3Rvci4gSWYgeW91IHdhbnQgdG8gc2F2ZSByZXN1bHQgdG8gYW5vdGhlciB2ZWN0b3IsIHVzZSBhZGQoKSBpbnN0ZWFkLlxuICAgICAqICEjemgg5ZCR6YeP5Yqg5rOV44CC5aaC5p6c5L2g5oOz5L+d5a2Y57uT5p6c5Yiw5Y+m5LiA5Liq5ZCR6YeP77yM5L2/55SoIGFkZCgpIOS7o+abv+OAglxuICAgICAqIEBtZXRob2QgYWRkU2VsZlxuICAgICAqIEBwYXJhbSB7VmVjMn0gdmVjdG9yXG4gICAgICogQHJldHVybiB7VmVjMn0gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqL1xuICAgIGFkZFNlbGYgKHZlY3RvcjogVmVjMik6IHRoaXMge1xuICAgICAgICB0aGlzLnggKz0gdmVjdG9yLng7XG4gICAgICAgIHRoaXMueSArPSB2ZWN0b3IueTtcbiAgICAgICAgdGhpcy56ICs9IHZlY3Rvci56O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFN1YnRyYWN0cyBvbmUgdmVjdG9yIGZyb20gdGhpcy5cbiAgICAgKiAhI3poIOWQkemHj+WHj+azleOAglxuICAgICAqIEBtZXRob2Qgc3VidHJhY3RcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IHZlY3RvclxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IHJldHVybnMgdGhpc1xuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciB2ID0gY2MudjIoMTAsIDEwKTtcbiAgICAgKiB2LnN1YlNlbGYoY2MudjIoNSwgNSkpOy8vIHJldHVybiBWZWMyIHt4OiA1LCB5OiA1fTtcbiAgICAgKi9cbiAgICBzdWJ0cmFjdCAodmVjdG9yOiBWZWMyKTogdGhpcyB7XG4gICAgICAgIHRoaXMueCAtPSB2ZWN0b3IueDtcbiAgICAgICAgdGhpcy55IC09IHZlY3Rvci55O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIE11bHRpcGxpZXMgdGhpcyBieSBhIG51bWJlci5cbiAgICAgKiAhI3poIOe8qeaUvuW9k+WJjeWQkemHj+OAglxuICAgICAqIEBtZXRob2QgbXVsdGlwbHlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtXG4gICAgICogQHJldHVybiB7VmVjMn0gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIHYgPSBjYy52MigxMCwgMTApO1xuICAgICAqIHYubXVsdGlwbHkoNSk7Ly8gcmV0dXJuIFZlYzIge3g6IDUwLCB5OiA1MH07XG4gICAgICovXG4gICAgbXVsdGlwbHlTY2FsYXIgKG51bTogbnVtYmVyKTogdGhpcyB7XG4gICAgICAgIHRoaXMueCAqPSBudW07XG4gICAgICAgIHRoaXMueSAqPSBudW07XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gTXVsdGlwbGllcyB0d28gdmVjdG9ycy5cbiAgICAgKiAhI3poIOWIhumHj+ebuOS5mOOAglxuICAgICAqIEBtZXRob2QgbXVsdGlwbHlcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IHZlY3RvclxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IHJldHVybnMgdGhpc1xuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciB2ID0gY2MudjIoMTAsIDEwKTtcbiAgICAgKiB2Lm11bHRpcGx5KGNjLnYyKDUsIDUpKTsvLyByZXR1cm4gVmVjMiB7eDogNTAsIHk6IDUwfTtcbiAgICAgKi9cbiAgICBtdWx0aXBseSAodmVjdG9yOiBWZWMyKTogdGhpcyB7XG4gICAgICAgIHRoaXMueCAqPSB2ZWN0b3IueDtcbiAgICAgICAgdGhpcy55ICo9IHZlY3Rvci55O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIERpdmlkZXMgYnkgYSBudW1iZXIuXG4gICAgICogISN6aCDlkJHph4/pmaTms5XjgIJcbiAgICAgKiBAbWV0aG9kIGRpdmlkZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1cbiAgICAgKiBAcmV0dXJuIHtWZWMyfSByZXR1cm5zIHRoaXNcbiAgICAgKiBAY2hhaW5hYmxlXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgdiA9IGNjLnYyKDEwLCAxMCk7XG4gICAgICogdi5kaXZpZGUoNSk7IC8vIHJldHVybiBWZWMyIHt4OiAyLCB5OiAyfTtcbiAgICAgKi9cbiAgICBkaXZpZGUgKG51bTogbnVtYmVyKTogdGhpcyB7XG4gICAgICAgIHRoaXMueCAvPSBudW07XG4gICAgICAgIHRoaXMueSAvPSBudW07XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gTmVnYXRlcyB0aGUgY29tcG9uZW50cy5cbiAgICAgKiAhI3poIOWQkemHj+WPluWPjeOAglxuICAgICAqIEBtZXRob2QgbmVnYXRlXG4gICAgICogQHJldHVybiB7VmVjMn0gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIHYgPSBjYy52MigxMCwgMTApO1xuICAgICAqIHYubmVnYXRlKCk7IC8vIHJldHVybiBWZWMyIHt4OiAtMTAsIHk6IC0xMH07XG4gICAgICovXG4gICAgbmVnYXRlICgpOiB0aGlzIHtcbiAgICAgICAgdGhpcy54ID0gLXRoaXMueDtcbiAgICAgICAgdGhpcy55ID0gLXRoaXMueTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBEb3QgcHJvZHVjdFxuICAgICAqICEjemgg5b2T5YmN5ZCR6YeP5LiO5oyH5a6a5ZCR6YeP6L+b6KGM54K55LmY44CCXG4gICAgICogQG1ldGhvZCBkb3RcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IFt2ZWN0b3JdXG4gICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgcmVzdWx0XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgdiA9IGNjLnYyKDEwLCAxMCk7XG4gICAgICogdi5kb3QoY2MudjIoNSwgNSkpOyAvLyByZXR1cm4gMTAwO1xuICAgICAqL1xuICAgIGRvdCAodmVjdG9yOiBWZWMyKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHZlY3Rvci54ICsgdGhpcy55ICogdmVjdG9yLnk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBDcm9zcyBwcm9kdWN0XG4gICAgICogISN6aCDlvZPliY3lkJHph4/kuI7mjIflrprlkJHph4/ov5vooYzlj4nkuZjjgIJcbiAgICAgKiBAbWV0aG9kIGNyb3NzXG4gICAgICogQHBhcmFtIHtWZWMyfSBbdmVjdG9yXVxuICAgICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHJlc3VsdFxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIHYgPSBjYy52MigxMCwgMTApO1xuICAgICAqIHYuY3Jvc3MoY2MudjIoNSwgNSkpOyAvLyByZXR1cm4gMDtcbiAgICAgKi9cbiAgICBjcm9zcyAodmVjdG9yOiBWZWMyKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHZlY3Rvci55IC0gdGhpcy55ICogdmVjdG9yLng7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHRoZSBsZW5ndGggb2YgdGhpcyB2ZWN0b3IuXG4gICAgICogISN6aCDov5Tlm57or6XlkJHph4/nmoTplb/luqbjgIJcbiAgICAgKiBAbWV0aG9kIGxlblxuICAgICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHJlc3VsdFxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIHYgPSBjYy52MigxMCwgMTApO1xuICAgICAqIHYubGVuKCk7IC8vIHJldHVybiAxNC4xNDIxMzU2MjM3MzA5NTE7XG4gICAgICovXG4gICAgbGVuICgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHRoZSBzcXVhcmVkIGxlbmd0aCBvZiB0aGlzIHZlY3Rvci5cbiAgICAgKiAhI3poIOi/lOWbnuivpeWQkemHj+eahOmVv+W6puW5s+aWueOAglxuICAgICAqIEBtZXRob2QgbGVuZ3RoU3FyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgcmVzdWx0XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgdiA9IGNjLnYyKDEwLCAxMCk7XG4gICAgICogdi5sZW5ndGhTcXIoKTsgLy8gcmV0dXJuIDIwMDtcbiAgICAgKi9cbiAgICBsZW5ndGhTcXIgKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBNYWtlIHRoZSBsZW5ndGggb2YgdGhpcyB2ZWN0b3IgdG8gMS5cbiAgICAgKiAhI3poIOWQkemHj+W9kuS4gOWMlu+8jOiuqei/meS4quWQkemHj+eahOmVv+W6puS4uiAx44CCXG4gICAgICogQG1ldGhvZCBub3JtYWxpemVTZWxmXG4gICAgICogQHJldHVybiB7VmVjMn0gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIHYgPSBjYy52MigxMCwgMTApO1xuICAgICAqIHYubm9ybWFsaXplU2VsZigpOyAvLyByZXR1cm4gVmVjMiB7eDogMC43MDcxMDY3ODExODY1NDc1LCB5OiAwLjcwNzEwNjc4MTE4NjU0NzV9O1xuICAgICAqL1xuICAgIG5vcm1hbGl6ZVNlbGYgKCk6IFZlYzIge1xuICAgICAgICB2YXIgbWFnU3FyID0gdGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55O1xuICAgICAgICBpZiAobWFnU3FyID09PSAxLjApXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgICBpZiAobWFnU3FyID09PSAwLjApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGludnNxcnQgPSAxLjAgLyBNYXRoLnNxcnQobWFnU3FyKTtcbiAgICAgICAgdGhpcy54ICo9IGludnNxcnQ7XG4gICAgICAgIHRoaXMueSAqPSBpbnZzcXJ0O1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXR1cm5zIHRoaXMgdmVjdG9yIHdpdGggYSBtYWduaXR1ZGUgb2YgMS48YnIvPlxuICAgICAqIDxici8+XG4gICAgICogTm90ZSB0aGF0IHRoZSBjdXJyZW50IHZlY3RvciBpcyB1bmNoYW5nZWQgYW5kIGEgbmV3IG5vcm1hbGl6ZWQgdmVjdG9yIGlzIHJldHVybmVkLiBJZiB5b3Ugd2FudCB0byBub3JtYWxpemUgdGhlIGN1cnJlbnQgdmVjdG9yLCB1c2Ugbm9ybWFsaXplU2VsZiBmdW5jdGlvbi5cbiAgICAgKiAhI3poXG4gICAgICog6L+U5Zue5b2S5LiA5YyW5ZCO55qE5ZCR6YeP44CCPGJyLz5cbiAgICAgKiA8YnIvPlxuICAgICAqIOazqOaEj++8jOW9k+WJjeWQkemHj+S4jeWPmO+8jOW5tui/lOWbnuS4gOS4quaWsOeahOW9kuS4gOWMluWQkemHj+OAguWmguaenOS9oOaDs+adpeW9kuS4gOWMluW9k+WJjeWQkemHj++8jOWPr+S9v+eUqCBub3JtYWxpemVTZWxmIOWHveaVsOOAglxuICAgICAqIEBtZXRob2Qgbm9ybWFsaXplXG4gICAgICogQHBhcmFtIHtWZWMyfSBbb3V0XSAtIG9wdGlvbmFsLCB0aGUgcmVjZWl2aW5nIHZlY3RvciwgeW91IGNhbiBwYXNzIHRoZSBzYW1lIHZlYzIgdG8gc2F2ZSByZXN1bHQgdG8gaXRzZWxmLCBpZiBub3QgcHJvdmlkZWQsIGEgbmV3IHZlYzIgd2lsbCBiZSBjcmVhdGVkXG4gICAgICogQHJldHVybiB7VmVjMn0gcmVzdWx0XG4gICAgICogdmFyIHYgPSBjYy52MigxMCwgMTApO1xuICAgICAqIHYubm9ybWFsaXplKCk7ICAgLy8gcmV0dXJuIFZlYzIge3g6IDAuNzA3MTA2NzgxMTg2NTQ3NSwgeTogMC43MDcxMDY3ODExODY1NDc1fTtcbiAgICAgKi9cbiAgICBub3JtYWxpemUgKG91dD86IFZlYzIpOiBWZWMyIHtcbiAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBWZWMyKCk7XG4gICAgICAgIG91dC54ID0gdGhpcy54O1xuICAgICAgICBvdXQueSA9IHRoaXMueTtcbiAgICAgICAgb3V0Lm5vcm1hbGl6ZVNlbGYoKTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldCBhbmdsZSBpbiByYWRpYW4gYmV0d2VlbiB0aGlzIGFuZCB2ZWN0b3IuXG4gICAgICogISN6aCDlpLnop5LnmoTlvKfluqbjgIJcbiAgICAgKiBAbWV0aG9kIGFuZ2xlXG4gICAgICogQHBhcmFtIHtWZWMyfSB2ZWN0b3JcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IGZyb20gMCB0byBNYXRoLlBJXG4gICAgICovXG4gICAgYW5nbGUgKHZlY3RvcjogVmVjMik6IG51bWJlciB7XG4gICAgICAgIHZhciBtYWdTcXIxID0gdGhpcy5tYWdTcXIoKTtcbiAgICAgICAgdmFyIG1hZ1NxcjIgPSB2ZWN0b3IubWFnU3FyKCk7XG5cbiAgICAgICAgaWYgKG1hZ1NxcjEgPT09IDAgfHwgbWFnU3FyMiA9PT0gMCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiQ2FuJ3QgZ2V0IGFuZ2xlIGJldHdlZW4gemVybyB2ZWN0b3JcIik7XG4gICAgICAgICAgICByZXR1cm4gMC4wO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRvdCA9IHRoaXMuZG90KHZlY3Rvcik7XG4gICAgICAgIHZhciB0aGV0YSA9IGRvdCAvIChNYXRoLnNxcnQobWFnU3FyMSAqIG1hZ1NxcjIpKTtcbiAgICAgICAgdGhldGEgPSBtaXNjLmNsYW1wZih0aGV0YSwgLTEuMCwgMS4wKTtcbiAgICAgICAgcmV0dXJuIE1hdGguYWNvcyh0aGV0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBHZXQgYW5nbGUgaW4gcmFkaWFuIGJldHdlZW4gdGhpcyBhbmQgdmVjdG9yIHdpdGggZGlyZWN0aW9uLlxuICAgICAqICEjemgg5bim5pa55ZCR55qE5aS56KeS55qE5byn5bqm44CCXG4gICAgICogQG1ldGhvZCBzaWduQW5nbGVcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IHZlY3RvclxuICAgICAqIEByZXR1cm4ge251bWJlcn0gZnJvbSAtTWF0aFBJIHRvIE1hdGguUElcbiAgICAgKi9cbiAgICBzaWduQW5nbGUgKHZlY3RvcjogVmVjMik6IG51bWJlciB7XG4gICAgICAgIGxldCBhbmdsZSA9IHRoaXMuYW5nbGUodmVjdG9yKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3Jvc3ModmVjdG9yKSA8IDAgPyAtYW5nbGUgOiBhbmdsZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIHJvdGF0ZVxuICAgICAqICEjemgg6L+U5Zue5peL6L2s57uZ5a6a5byn5bqm5ZCO55qE5paw5ZCR6YeP44CCXG4gICAgICogQG1ldGhvZCByb3RhdGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFkaWFuc1xuICAgICAqIEBwYXJhbSB7VmVjMn0gW291dF0gLSBvcHRpb25hbCwgdGhlIHJlY2VpdmluZyB2ZWN0b3IsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSB2ZWMyIHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyB2ZWMyIHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IHRoZSByZXN1bHRcbiAgICAgKi9cbiAgICByb3RhdGUgKHJhZGlhbnM6IG51bWJlciwgb3V0PzogVmVjMik6IFZlYzIge1xuICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IFZlYzIoKTtcbiAgICAgICAgb3V0LnggPSB0aGlzLng7XG4gICAgICAgIG91dC55ID0gdGhpcy55O1xuICAgICAgICByZXR1cm4gb3V0LnJvdGF0ZVNlbGYocmFkaWFucyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiByb3RhdGUgc2VsZlxuICAgICAqICEjemgg5oyJ5oyH5a6a5byn5bqm5peL6L2s5ZCR6YeP44CCXG4gICAgICogQG1ldGhvZCByb3RhdGVTZWxmXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJhZGlhbnNcbiAgICAgKiBAcmV0dXJuIHtWZWMyfSByZXR1cm5zIHRoaXNcbiAgICAgKiBAY2hhaW5hYmxlXG4gICAgICovXG4gICAgcm90YXRlU2VsZiAocmFkaWFuczogbnVtYmVyKTogVmVjMiB7XG4gICAgICAgIHZhciBzaW4gPSBNYXRoLnNpbihyYWRpYW5zKTtcbiAgICAgICAgdmFyIGNvcyA9IE1hdGguY29zKHJhZGlhbnMpO1xuICAgICAgICB2YXIgeCA9IHRoaXMueDtcbiAgICAgICAgdGhpcy54ID0gY29zICogeCAtIHNpbiAqIHRoaXMueTtcbiAgICAgICAgdGhpcy55ID0gc2luICogeCArIGNvcyAqIHRoaXMueTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBDYWxjdWxhdGVzIHRoZSBwcm9qZWN0aW9uIG9mIHRoZSBjdXJyZW50IHZlY3RvciBvdmVyIHRoZSBnaXZlbiB2ZWN0b3IuXG4gICAgICogISN6aCDov5Tlm57lvZPliY3lkJHph4/lnKjmjIflrpogdmVjdG9yIOWQkemHj+S4iueahOaKleW9seWQkemHj+OAglxuICAgICAqIEBtZXRob2QgcHJvamVjdFxuICAgICAqIEBwYXJhbSB7VmVjMn0gdmVjdG9yXG4gICAgICogQHJldHVybiB7VmVjMn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciB2MSA9IGNjLnYyKDIwLCAyMCk7XG4gICAgICogdmFyIHYyID0gY2MudjIoNSwgNSk7XG4gICAgICogdjEucHJvamVjdCh2Mik7IC8vIFZlYzIge3g6IDIwLCB5OiAyMH07XG4gICAgICovXG4gICAgcHJvamVjdCAodmVjdG9yOiBWZWMyKTogVmVjMiB7XG4gICAgICAgIHJldHVybiB2ZWN0b3IubXVsdGlwbHlTY2FsYXIodGhpcy5kb3QodmVjdG9yKSAvIHZlY3Rvci5kb3QodmVjdG9yKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVHJhbnNmb3JtcyB0aGUgdmVjMiB3aXRoIGEgbWF0NC4gM3JkIHZlY3RvciBjb21wb25lbnQgaXMgaW1wbGljaXRseSAnMCcsIDR0aCB2ZWN0b3IgY29tcG9uZW50IGlzIGltcGxpY2l0bHkgJzEnXG4gICAgICogQG1ldGhvZCB0cmFuc2Zvcm1NYXQ0XG4gICAgICogQHBhcmFtIHtNYXQ0fSBtIG1hdHJpeCB0byB0cmFuc2Zvcm0gd2l0aFxuICAgICAqIEBwYXJhbSB7VmVjMn0gW291dF0gdGhlIHJlY2VpdmluZyB2ZWN0b3IsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSB2ZWMyIHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyB2ZWMyIHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm5zIHtWZWMyfSBvdXRcbiAgICAgKi9cbiAgICB0cmFuc2Zvcm1NYXQ0IChtOiBNYXQ0LCBvdXQ/OiBWZWMyKTogVmVjMiB7XG4gICAgICAgIG91dCA9IG91dCB8fCBuZXcgVmVjMigpO1xuICAgICAgICBWZWMyLnRyYW5zZm9ybU1hdDQob3V0LCB0aGlzLCBtKTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBtYXhpbXVtIHZhbHVlIGluIHgsIHkuXG4gICAgICogQG1ldGhvZCBtYXhBeGlzXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBtYXhBeGlzICgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5tYXgodGhpcy54LCB0aGlzLnkpO1xuICAgIH1cbn1cblxuY29uc3QgdjJfMSA9IG5ldyBWZWMyKCk7XG5jb25zdCB2Ml8yID0gbmV3IFZlYzIoKTtcblxuQ0NDbGFzcy5mYXN0RGVmaW5lKCdjYy5WZWMyJywgVmVjMiwgeyB4OiAwLCB5OiAwIH0pO1xuXG5cblxuLyoqXG4gKiBAbW9kdWxlIGNjXG4gKi9cblxuXG4vKipcbiAqICEjZW4gVGhlIGNvbnZlbmllbmNlIG1ldGhvZCB0byBjcmVhdGUgYSBuZXcge3sjY3Jvc3NMaW5rIFwiVmVjMlwifX1jYy5WZWMye3svY3Jvc3NMaW5rfX0uXG4gKiAhI3poIOmAmui/h+ivpeeugOS+v+eahOWHveaVsOi/m+ihjOWIm+W7uiB7eyNjcm9zc0xpbmsgXCJWZWMyXCJ9fWNjLlZlYzJ7ey9jcm9zc0xpbmt9fSDlr7nosaHjgIJcbiAqIEBtZXRob2QgdjJcbiAqIEBwYXJhbSB7TnVtYmVyfE9iamVjdH0gW3g9MF1cbiAqIEBwYXJhbSB7TnVtYmVyfSBbeT0wXVxuICogQHJldHVybiB7VmVjMn1cbiAqIEBleGFtcGxlXG4gKiB2YXIgdjEgPSBjYy52MigpO1xuICogdmFyIHYyID0gY2MudjIoMCwgMCk7XG4gKiB2YXIgdjMgPSBjYy52Mih2Mik7XG4gKiB2YXIgdjQgPSBjYy52Mih7eDogMTAwLCB5OiAxMDB9KTtcbiAqL1xuY2MudjIgPSBmdW5jdGlvbiB2MiAoeCwgeSkge1xuICAgIHJldHVybiBuZXcgVmVjMih4LCB5KTtcbn07XG5cbmNjLlZlYzIgPSBWZWMyO1xuIl19