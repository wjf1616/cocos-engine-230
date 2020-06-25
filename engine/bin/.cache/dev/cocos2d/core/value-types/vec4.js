
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/value-types/vec4.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.v4 = v4;
exports["default"] = void 0;

var _CCClass = _interopRequireDefault(require("../platform/CCClass"));

var _valueType = _interopRequireDefault(require("./value-type"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _x = 0.0;
var _y = 0.0;
var _z = 0.0;
var _w = 0.0;
/**
 * !#en Representation of 3D vectors and points.
 * !#zh 表示 3D 向量和坐标
 *
 * @class Vec4
 * @extends ValueType
 */

var Vec4 =
/*#__PURE__*/
function (_ValueType) {
  _inheritsLoose(Vec4, _ValueType);

  var _proto = Vec4.prototype;

  // deprecated
  _proto.sub = function sub(vector, out) {
    return Vec4.subtract(out || new Vec4(), this, vector);
  };

  _proto.mul = function mul(num, out) {
    return Vec4.multiplyScalar(out || new Vec4(), this, num);
  };

  _proto.div = function div(vector, out) {
    return Vec4.divide(out || new Vec4(), this, vector);
  };

  _proto.scale = function scale(vector, out) {
    return Vec4.multiply(out || new Vec4(), this, vector);
  };

  _proto.neg = function neg(out) {
    return Vec4.negate(out || new Vec4(), this);
  };

  /**
   * !#zh 获得指定向量的拷贝
   * !#en Obtaining copy vectors designated
   * @method clone
   * @typescript
   * public static clone <Out extends IVec4Like> (a: Out)
   * @static
   */
  Vec4.clone = function clone(a) {
    return new Vec4(a.x, a.y, a.z, a.w);
  }
  /**
   * !#zh 复制目标向量
   * !#en Copy the target vector
   * @method copy
   * @typescript
   * public static copy <Out extends IVec4Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec4.copy = function copy(out, a) {
    out.x = a.x;
    out.y = a.y;
    out.z = a.z;
    out.w = a.w;
    return out;
  }
  /**
   * !#zh 设置向量值
   * !#en Set to value
   * @method set
   * @typescript
   * public static set <Out extends IVec4Like> (out: Out, x: number, y: number, z: number, w: number)
   * @static
   */
  ;

  Vec4.set = function set(out, x, y, z, w) {
    out.x = x;
    out.y = y;
    out.z = z;
    out.w = w;
    return out;
  }
  /**
   * !#zh 逐元素向量加法
   * !#en Element-wise vector addition
   * @method add
   * @typescript
   * public static add <Out extends IVec4Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Vec4.add = function add(out, a, b) {
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    out.z = a.z + b.z;
    out.w = a.w + b.w;
    return out;
  }
  /**
   * !#zh 逐元素向量减法
   * !#en Element-wise vector subtraction
   * @method subtract
   * @typescript
   * public static subtract <Out extends IVec4Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Vec4.subtract = function subtract(out, a, b) {
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    out.z = a.z - b.z;
    out.w = a.w - b.w;
    return out;
  }
  /**
   * !#zh 逐元素向量乘法
   * !#en Element-wise vector multiplication
   * @method multiply
   * @typescript
   * public static multiply <Out extends IVec4Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Vec4.multiply = function multiply(out, a, b) {
    out.x = a.x * b.x;
    out.y = a.y * b.y;
    out.z = a.z * b.z;
    out.w = a.w * b.w;
    return out;
  }
  /**
   * !#zh 逐元素向量除法
   * !#en Element-wise vector division
   * @method divide
   * @typescript
   * public static divide <Out extends IVec4Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Vec4.divide = function divide(out, a, b) {
    out.x = a.x / b.x;
    out.y = a.y / b.y;
    out.z = a.z / b.z;
    out.w = a.w / b.w;
    return out;
  }
  /**
   * !#zh 逐元素向量向上取整
   * !#en Rounding up by elements of the vector
   * @method ceil
   * @typescript
   * public static ceil <Out extends IVec4Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec4.ceil = function ceil(out, a) {
    out.x = Math.ceil(a.x);
    out.y = Math.ceil(a.y);
    out.z = Math.ceil(a.z);
    out.w = Math.ceil(a.w);
    return out;
  }
  /**
   * !#zh 逐元素向量向下取整
   * !#en Element vector by rounding down
   * @method floor
   * @typescript
   * public static floor <Out extends IVec4Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec4.floor = function floor(out, a) {
    out.x = Math.floor(a.x);
    out.y = Math.floor(a.y);
    out.z = Math.floor(a.z);
    out.w = Math.floor(a.w);
    return out;
  }
  /**
   * !#zh 逐元素向量最小值
   * !#en The minimum by-element vector
   * @method min
   * @typescript
   * public static min <Out extends IVec4Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Vec4.min = function min(out, a, b) {
    out.x = Math.min(a.x, b.x);
    out.y = Math.min(a.y, b.y);
    out.z = Math.min(a.z, b.z);
    out.w = Math.min(a.w, b.w);
    return out;
  }
  /**
   * !#zh 逐元素向量最大值
   * !#en The maximum value of the element-wise vector
   * @method max
   * @typescript
   * public static max <Out extends IVec4Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Vec4.max = function max(out, a, b) {
    out.x = Math.max(a.x, b.x);
    out.y = Math.max(a.y, b.y);
    out.z = Math.max(a.z, b.z);
    out.w = Math.max(a.w, b.w);
    return out;
  }
  /**
   * !#zh 逐元素向量四舍五入取整
   * !#en Element-wise vector of rounding to whole
   * @method round
   * @typescript
   * public static round <Out extends IVec4Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec4.round = function round(out, a) {
    out.x = Math.round(a.x);
    out.y = Math.round(a.y);
    out.z = Math.round(a.z);
    out.w = Math.round(a.w);
    return out;
  }
  /**
   * !#zh 向量标量乘法
   * !#en Vector scalar multiplication
   * @method multiplyScalar
   * @typescript
   * public static multiplyScalar <Out extends IVec4Like> (out: Out, a: Out, b: number)
   * @static
   */
  ;

  Vec4.multiplyScalar = function multiplyScalar(out, a, b) {
    out.x = a.x * b;
    out.y = a.y * b;
    out.z = a.z * b;
    out.w = a.w * b;
    return out;
  }
  /**
   * !#zh 逐元素向量乘加: A + B * scale
   * !#en Element-wise vector multiply add: A + B * scale
   * @method scaleAndAdd
   * @typescript
   * public static scaleAndAdd <Out extends IVec4Like> (out: Out, a: Out, b: Out, scale: number)
   * @static
   */
  ;

  Vec4.scaleAndAdd = function scaleAndAdd(out, a, b, scale) {
    out.x = a.x + b.x * scale;
    out.y = a.y + b.y * scale;
    out.z = a.z + b.z * scale;
    out.w = a.w + b.w * scale;
    return out;
  }
  /**
   * !#zh 求两向量的欧氏距离
   * !#en Seeking two vectors Euclidean distance
   * @method distance
   * @typescript
   * public static distance <Out extends IVec4Like> (a: Out, b: Out)
   * @static
   */
  ;

  Vec4.distance = function distance(a, b) {
    var x = b.x - a.x;
    var y = b.y - a.y;
    var z = b.z - a.z;
    var w = b.w - a.w;
    return Math.sqrt(x * x + y * y + z * z + w * w);
  }
  /**
   * !#zh 求两向量的欧氏距离平方
   * !#en Euclidean distance squared seeking two vectors
   * @method squaredDistance
   * @typescript
   * public static squaredDistance <Out extends IVec4Like> (a: Out, b: Out)
   * @static
   */
  ;

  Vec4.squaredDistance = function squaredDistance(a, b) {
    var x = b.x - a.x;
    var y = b.y - a.y;
    var z = b.z - a.z;
    var w = b.w - a.w;
    return x * x + y * y + z * z + w * w;
  }
  /**
   * !#zh 求向量长度
   * !#en Seeking vector length
   * @method len
   * @typescript
   * public static len <Out extends IVec4Like> (a: Out)
   * @static
   */
  ;

  Vec4.len = function len(a) {
    _x = a.x;
    _y = a.y;
    _z = a.z;
    _w = a.w;
    return Math.sqrt(_x * _x + _y * _y + _z * _z + _w * _w);
  }
  /**
   * !#zh 求向量长度平方
   * !#en Seeking squared vector length
   * @method lengthSqr
   * @typescript
   * public static lengthSqr <Out extends IVec4Like> (a: Out)
   * @static
   */
  ;

  Vec4.lengthSqr = function lengthSqr(a) {
    _x = a.x;
    _y = a.y;
    _z = a.z;
    _w = a.w;
    return _x * _x + _y * _y + _z * _z + _w * _w;
  }
  /**
   * !#zh 逐元素向量取负
   * !#en By taking the negative elements of the vector
   * @method negate
   * @typescript
   * public static negate <Out extends IVec4Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec4.negate = function negate(out, a) {
    out.x = -a.x;
    out.y = -a.y;
    out.z = -a.z;
    out.w = -a.w;
    return out;
  }
  /**
   * !#zh 逐元素向量取倒数，接近 0 时返回 Infinity
   * !#en Element vector by taking the inverse, return near 0 Infinity
   * @method inverse
   * @typescript
   * public static inverse <Out extends IVec4Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec4.inverse = function inverse(out, a) {
    out.x = 1.0 / a.x;
    out.y = 1.0 / a.y;
    out.z = 1.0 / a.z;
    out.w = 1.0 / a.w;
    return out;
  }
  /**
   * !#zh 逐元素向量取倒数，接近 0 时返回 0
   * !#en Element vector by taking the inverse, return near 0 0
   * @method inverseSafe
   * @typescript
   * public static inverseSafe <Out extends IVec4Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec4.inverseSafe = function inverseSafe(out, a) {
    _x = a.x;
    _y = a.y;
    _z = a.z;
    _w = a.w;

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

    if (Math.abs(_z) < _utils.EPSILON) {
      out.z = 0;
    } else {
      out.z = 1.0 / _z;
    }

    if (Math.abs(_w) < _utils.EPSILON) {
      out.w = 0;
    } else {
      out.w = 1.0 / _w;
    }

    return out;
  }
  /**
   * !#zh 归一化向量
   * !#en Normalized vector
   * @method normalize
   * @typescript
   * public static normalize <Out extends IVec4Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec4.normalize = function normalize(out, a) {
    _x = a.x;
    _y = a.y;
    _z = a.z;
    _w = a.w;
    var len = _x * _x + _y * _y + _z * _z + _w * _w;

    if (len > 0) {
      len = 1 / Math.sqrt(len);
      out.x = _x * len;
      out.y = _y * len;
      out.z = _z * len;
      out.w = _w * len;
    }

    return out;
  }
  /**
   * !#zh 向量点积（数量积）
   * !#en Vector dot product (scalar product)
   * @method dot
   * @typescript
   * public static dot <Out extends IVec4Like> (a: Out, b: Out)
   * @static
   */
  ;

  Vec4.dot = function dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
  }
  /**
   * !#zh 逐元素向量线性插值： A + t * (B - A)
   * !#en Vector element by element linear interpolation: A + t * (B - A)
   * @method lerp
   * @typescript
   * public static lerp <Out extends IVec4Like> (out: Out, a: Out, b: Out, t: number)
   * @static
   */
  ;

  Vec4.lerp = function lerp(out, a, b, t) {
    out.x = a.x + t * (b.x - a.x);
    out.y = a.y + t * (b.y - a.y);
    out.z = a.z + t * (b.z - a.z);
    out.w = a.w + t * (b.w - a.w);
    return out;
  }
  /**
   * !#zh 生成一个在单位球体上均匀分布的随机向量
   * !#en Generates a uniformly distributed random vectors on the unit sphere
   * @method random
   * @typescript
   * public static random <Out extends IVec4Like> (out: Out, scale?: number)
   * @param scale 生成的向量长度
   * @static
   */
  ;

  Vec4.random = function random(out, scale) {
    scale = scale || 1.0;
    var phi = (0, _utils.random)() * 2.0 * Math.PI;
    var cosTheta = (0, _utils.random)() * 2 - 1;
    var sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
    out.x = sinTheta * Math.cos(phi) * scale;
    out.y = sinTheta * Math.sin(phi) * scale;
    out.z = cosTheta * scale;
    out.w = 0;
    return out;
  }
  /**
   * !#zh 向量矩阵乘法
   * !#en Vector matrix multiplication
   * @method transformMat4
   * @typescript
   * public static transformMat4 <Out extends IVec4Like, MatLike extends IMat4Like> (out: Out, a: Out, mat: MatLike)
   * @static
   */
  ;

  Vec4.transformMat4 = function transformMat4(out, a, mat) {
    _x = a.x;
    _y = a.y;
    _z = a.z;
    _w = a.w;
    var m = mat.m;
    out.x = m[0] * _x + m[4] * _y + m[8] * _z + m[12] * _w;
    out.y = m[1] * _x + m[5] * _y + m[9] * _z + m[13] * _w;
    out.z = m[2] * _x + m[6] * _y + m[10] * _z + m[14] * _w;
    out.w = m[3] * _x + m[7] * _y + m[11] * _z + m[15] * _w;
    return out;
  }
  /**
   * !#zh 向量仿射变换
   * !#en Affine transformation vector
   * @static
   */
  ;

  Vec4.transformAffine = function transformAffine(out, v, mat) {
    _x = v.x;
    _y = v.y;
    _z = v.z;
    _w = v.w;
    var m = mat.m;
    out.x = m[0] * _x + m[1] * _y + m[2] * _z + m[3] * _w;
    out.y = m[4] * _x + m[5] * _y + m[6] * _z + m[7] * _w;
    out.x = m[8] * _x + m[9] * _y + m[10] * _z + m[11] * _w;
    out.w = v.w;
    return out;
  }
  /**
   * !#zh 向量四元数乘法
   * !#en Vector quaternion multiplication
   * @method transformQuat
   * @typescript
   * public static transformQuat <Out extends IVec4Like, QuatLike extends IQuatLike> (out: Out, a: Out, q: QuatLike)
   * @static
   */
  ;

  Vec4.transformQuat = function transformQuat(out, a, q) {
    var x = a.x,
        y = a.y,
        z = a.z;
    _x = q.x;
    _y = q.y;
    _z = q.z;
    _w = q.w; // calculate quat * vec

    var ix = _w * x + _y * z - _z * y;
    var iy = _w * y + _z * x - _x * z;
    var iz = _w * z + _x * y - _y * x;
    var iw = -_x * x - _y * y - _z * z; // calculate result * inverse quat

    out.x = ix * _w + iw * -_x + iy * -_z - iz * -_y;
    out.y = iy * _w + iw * -_y + iz * -_x - ix * -_z;
    out.z = iz * _w + iw * -_z + ix * -_y - iy * -_x;
    out.w = a.w;
    return out;
  }
  /**
   * !#zh 向量等价判断
   * !#en Equivalent vectors Analyzing
   * @method strictEquals
   * @typescript
   * public static strictEquals <Out extends IVec4Like> (a: Out, b: Out)
   * @static
   */
  ;

  Vec4.strictEquals = function strictEquals(a, b) {
    return a.x === b.x && a.y === b.y && a.z === b.z && a.w === b.w;
  }
  /**
   * !#zh 排除浮点数误差的向量近似等价判断
   * !#en Negative error vector floating point approximately equivalent Analyzing
   * @method equals
   * @typescript
   * public static equals <Out extends IVec4Like> (a: Out, b: Out, epsilon = EPSILON)
   * @static
   */
  ;

  Vec4.equals = function equals(a, b, epsilon) {
    if (epsilon === void 0) {
      epsilon = _utils.EPSILON;
    }

    return Math.abs(a.x - b.x) <= epsilon * Math.max(1.0, Math.abs(a.x), Math.abs(b.x)) && Math.abs(a.y - b.y) <= epsilon * Math.max(1.0, Math.abs(a.y), Math.abs(b.y)) && Math.abs(a.z - b.z) <= epsilon * Math.max(1.0, Math.abs(a.z), Math.abs(b.z)) && Math.abs(a.w - b.w) <= epsilon * Math.max(1.0, Math.abs(a.w), Math.abs(b.w));
  }
  /**
   * !#zh 向量转数组
   * !#en Vector transfer array
   * @method toArray
   * @typescript
   * public static toArray <Out extends IWritableArrayLike<number>> (out: Out, v: IVec4Like, ofs = 0)
   * @param ofs 数组起始偏移量
   * @static
   */
  ;

  Vec4.toArray = function toArray(out, v, ofs) {
    if (ofs === void 0) {
      ofs = 0;
    }

    out[ofs + 0] = v.x;
    out[ofs + 1] = v.y;
    out[ofs + 2] = v.z;
    out[ofs + 3] = v.w;
    return out;
  }
  /**
   * !#zh 数组转向量
   * !#en Array steering amount
   * @method fromArray
   * @typescript
   * public static fromArray <Out extends IVec4Like> (out: Out, arr: IWritableArrayLike<number>, ofs = 0)
   * @param ofs 数组起始偏移量
   * @static
   */
  ;

  Vec4.fromArray = function fromArray(out, arr, ofs) {
    if (ofs === void 0) {
      ofs = 0;
    }

    out.x = arr[ofs + 0];
    out.y = arr[ofs + 1];
    out.z = arr[ofs + 2];
    out.w = arr[ofs + 3];
    return out;
  }
  /**
   * @property {Number} x
   */
  ;

  _createClass(Vec4, null, [{
    key: "ZERO",
    get: function get() {
      return new Vec4(0, 0, 0, 0);
    }
  }, {
    key: "ONE",
    get: function get() {
      return new Vec4(1, 1, 1, 1);
    }
  }, {
    key: "NEG_ONE",
    get: function get() {
      return new Vec4(-1, -1, -1, -1);
    }
  }]);

  /**
   * !#en
   * Constructor
   * see {{#crossLink "cc/vec4:method"}}cc.v4{{/crossLink}}
   * !#zh
   * 构造函数，可查看 {{#crossLink "cc/vec4:method"}}cc.v4{{/crossLink}}
   * @method constructor
   * @param {number} [x=0]
   * @param {number} [y=0]
   * @param {number} [z=0]
   * @param {number} [w=0]
   */
  function Vec4(x, y, z, w) {
    var _this;

    if (x === void 0) {
      x = 0;
    }

    if (y === void 0) {
      y = 0;
    }

    if (z === void 0) {
      z = 0;
    }

    if (w === void 0) {
      w = 0;
    }

    _this = _ValueType.call(this) || this;
    _this.mag = Vec4.prototype.len;
    _this.magSqr = Vec4.prototype.lengthSqr;
    _this.subSelf = Vec4.prototype.subtract;
    _this.mulSelf = Vec4.prototype.multiplyScalar;
    _this.divSelf = Vec4.prototype.divide;
    _this.scaleSelf = Vec4.prototype.multiply;
    _this.negSelf = Vec4.prototype.negate;
    _this.x = void 0;
    _this.y = void 0;
    _this.z = void 0;
    _this.w = void 0;

    if (x && typeof x === 'object') {
      _this.w = x.w;
      _this.z = x.z;
      _this.y = x.y;
      _this.x = x.x;
    } else {
      _this.x = x;
      _this.y = y;
      _this.z = z;
      _this.w = w;
    }

    return _this;
  }
  /**
   * !#en clone a Vec4 value
   * !#zh 克隆一个 Vec4 值
   * @method clone
   * @return {Vec4}
   */


  _proto.clone = function clone() {
    return new Vec4(this.x, this.y, this.z, this.w);
  }
  /**
   * !#en Set the current vector value with the given vector.
   * !#zh 用另一个向量设置当前的向量对象值。
   * @method set
   * @param {Vec4} newValue - !#en new value to set. !#zh 要设置的新值
   * @return {Vec4} returns this
   */
  ;

  _proto.set = function set(x, y, z, w) {
    if (x && typeof x === 'object') {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
      this.w = x.w;
    } else {
      this.x = x || 0;
      this.y = y || 0;
      this.z = z || 0;
      this.w = w || 0;
    }

    return this;
  }
  /**
   * !#en Check whether the vector equals another one
   * !#zh 当前的向量是否与指定的向量相等。
   * @method equals
   * @param {Vec4} other
   * @param {number} [epsilon]
   * @return {Boolean}
   */
  ;

  _proto.equals = function equals(other, epsilon) {
    if (epsilon === void 0) {
      epsilon = _utils.EPSILON;
    }

    return Math.abs(this.x - other.x) <= epsilon * Math.max(1.0, Math.abs(this.x), Math.abs(other.x)) && Math.abs(this.y - other.y) <= epsilon * Math.max(1.0, Math.abs(this.y), Math.abs(other.y)) && Math.abs(this.z - other.z) <= epsilon * Math.max(1.0, Math.abs(this.z), Math.abs(other.z)) && Math.abs(this.w - other.w) <= epsilon * Math.max(1.0, Math.abs(this.w), Math.abs(other.w));
  }
  /**
   * !#en Check whether the vector equals another one
   * !#zh 判断当前向量是否在误差范围内与指定分量的向量相等。
   * @method equals4f
   * @param {number} x 相比较的向量的 x 分量。
   * @param {number} y 相比较的向量的 y 分量。
   * @param {number} z 相比较的向量的 z 分量。
   * @param {number} w 相比较的向量的 w 分量。
   * @param {number} [epsilon] 允许的误差，应为非负数。
   * @returns {Boolean} 当两向量的各分量都在指定的误差范围内分别相等时，返回 `true`；否则返回 `false`。
   */
  ;

  _proto.equals4f = function equals4f(x, y, z, w, epsilon) {
    if (epsilon === void 0) {
      epsilon = _utils.EPSILON;
    }

    return Math.abs(this.x - x) <= epsilon * Math.max(1.0, Math.abs(this.x), Math.abs(x)) && Math.abs(this.y - y) <= epsilon * Math.max(1.0, Math.abs(this.y), Math.abs(y)) && Math.abs(this.z - z) <= epsilon * Math.max(1.0, Math.abs(this.z), Math.abs(z)) && Math.abs(this.w - w) <= epsilon * Math.max(1.0, Math.abs(this.w), Math.abs(w));
  }
  /**
   * !#en Check whether strict equals other Vec4
   * !#zh 判断当前向量是否与指定向量相等。
   * @method strictEquals
   * @param other 相比较的向量。
   * @returns 两向量的各分量都分别相等时返回 `true`；否则返回 `false`。
   */
  ;

  _proto.strictEquals = function strictEquals(other) {
    return this.x === other.x && this.y === other.y && this.z === other.z && this.w === other.w;
  }
  /**
   * !#en Check whether strict equals other Vec4
   * !#zh 判断当前向量是否与指定分量的向量相等。
   * @method strictEquals4f
   * @param x 指定向量的 x 分量。
   * @param y 指定向量的 y 分量。
   * @param z 指定向量的 z 分量。
   * @param w 指定向量的 w 分量。
   * @returns 两向量的各分量都分别相等时返回 `true`；否则返回 `false`。
   */
  ;

  _proto.strictEquals4f = function strictEquals4f(x, y, z, w) {
    return this.x === x && this.y === y && this.z === z && this.w === w;
  }
  /**
   * !#en Calculate linear interpolation result between this vector and another one with given ratio
   * !#zh 根据指定的插值比率，从当前向量到目标向量之间做插值。
   * @method lerp
   * @param {Vec4} to 目标向量。
   * @param {number} ratio 插值比率，范围为 [0,1]。
   * @returns {Vec4}
   */
  ;

  _proto.lerp = function lerp(to, ratio) {
    _x = this.x;
    _y = this.y;
    _z = this.z;
    _w = this.w;
    this.x = _x + ratio * (to.x - _x);
    this.y = _y + ratio * (to.y - _y);
    this.z = _z + ratio * (to.z - _z);
    this.w = _w + ratio * (to.w - _w);
    return this;
  }
  /**
   * !#en Transform to string with vector informations
   * !#zh 返回当前向量的字符串表示。
   * @method toString
   * @returns {string} 当前向量的字符串表示。
   */
  ;

  _proto.toString = function toString() {
    return "(" + this.x.toFixed(2) + ", " + this.y.toFixed(2) + ", " + this.z.toFixed(2) + ", " + this.w.toFixed(2) + ")";
  }
  /**
   * !#en Clamp the vector between minInclusive and maxInclusive.
   * !#zh 设置当前向量的值，使其各个分量都处于指定的范围内。
   * @method clampf
   * @param {Vec4} minInclusive 每个分量都代表了对应分量允许的最小值。
   * @param {Vec4} maxInclusive 每个分量都代表了对应分量允许的最大值。
   * @returns {Vec4}
   */
  ;

  _proto.clampf = function clampf(minInclusive, maxInclusive) {
    this.x = (0, _utils.clamp)(this.x, minInclusive.x, maxInclusive.x);
    this.y = (0, _utils.clamp)(this.y, minInclusive.y, maxInclusive.y);
    this.z = (0, _utils.clamp)(this.z, minInclusive.z, maxInclusive.z);
    this.w = (0, _utils.clamp)(this.w, minInclusive.w, maxInclusive.w);
    return this;
  }
  /**
   * !#en Adds this vector. If you want to save result to another vector, use add() instead.
   * !#zh 向量加法。如果你想保存结果到另一个向量，使用 add() 代替。
   * @method addSelf
   * @param {Vec4} vector
   * @return {Vec4} returns this
   * @chainable
   */
  ;

  _proto.addSelf = function addSelf(vector) {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
    this.w += vector.w;
    return this;
  }
  /**
   * !#en Adds two vectors, and returns the new result.
   * !#zh 向量加法，并返回新结果。
   * @method add
   * @param {Vec4} vector
   * @param {Vec4} [out] - optional, the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created
   * @return {Vec4} the result
   */
  ;

  _proto.add = function add(vector, out) {
    out = out || new Vec4();
    out.x = this.x + vector.x;
    out.y = this.y + vector.y;
    out.z = this.z + vector.z;
    out.w = this.w + vector.w;
    return out;
  }
  /**
   * !#en Subtracts one vector from this, and returns the new result.
   * !#zh 向量减法，并返回新结果。
   * @method subtract
   * @param {Vec4} vector
   * @param {Vec4} [out] - optional, the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created
   * @return {Vec4} the result
   */
  ;

  _proto.subtract = function subtract(vector, out) {
    out = out || new Vec4();
    out.x = this.x - vector.x;
    out.y = this.y - vector.y;
    out.z = this.z - vector.z;
    out.w = this.w - vector.w;
    return out;
  }
  /**
   * !#en Multiplies this by a number.
   * !#zh 缩放当前向量。
   * @method multiplyScalar
   * @param {number} num
   * @return {Vec4} returns this
   * @chainable
   */
  ;

  _proto.multiplyScalar = function multiplyScalar(num) {
    this.x *= num;
    this.y *= num;
    this.z *= num;
    this.w *= num;
    return this;
  }
  /**
   * !#en Multiplies two vectors.
   * !#zh 分量相乘。
   * @method multiply
   * @param {Vec4} vector
   * @return {Vec4} returns this
   * @chainable
   */
  ;

  _proto.multiply = function multiply(vector) {
    this.x *= vector.x;
    this.y *= vector.y;
    this.z *= vector.z;
    this.w *= vector.w;
    return this;
  }
  /**
   * !#en Divides by a number.
   * !#zh 向量除法。
   * @method divide
   * @param {number} num
   * @return {Vec4} returns this
   * @chainable
   */
  ;

  _proto.divide = function divide(num) {
    this.x /= num;
    this.y /= num;
    this.z /= num;
    this.w /= num;
    return this;
  }
  /**
   * !#en Negates the components.
   * !#zh 向量取反
   * @method negate
   * @return {Vec4} returns this
   * @chainable
   */
  ;

  _proto.negate = function negate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    this.w = -this.w;
    return this;
  }
  /**
   * !#en Dot product
   * !#zh 当前向量与指定向量进行点乘。
   * @method dot
   * @param {Vec4} [vector]
   * @return {number} the result
   */
  ;

  _proto.dot = function dot(vector) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z + this.w * vector.w;
  }
  /**
   * !#en Cross product
   * !#zh 当前向量与指定向量进行叉乘。
   * @method cross
   * @param {Vec4} vector
   * @param {Vec4} [out]
   * @return {Vec4} the result
   */
  ;

  _proto.cross = function cross(vector, out) {
    out = out || new Vec4();
    var ax = this.x,
        ay = this.y,
        az = this.z;
    var bx = vector.x,
        by = vector.y,
        bz = vector.z;
    out.x = ay * bz - az * by;
    out.y = az * bx - ax * bz;
    out.z = ax * by - ay * bx;
    return out;
  }
  /**
   * !#en Returns the length of this vector.
   * !#zh 返回该向量的长度。
   * @method len
   * @return {number} the result
   * @example
   * var v = cc.v4(10, 10);
   * v.len(); // return 14.142135623730951;
   */
  ;

  _proto.len = function len() {
    var x = this.x,
        y = this.y,
        z = this.z,
        w = this.w;
    return Math.sqrt(x * x + y * y + z * z + w * w);
  }
  /**
   * !#en Returns the squared length of this vector.
   * !#zh 返回该向量的长度平方。
   * @method lengthSqr
   * @return {number} the result
   */
  ;

  _proto.lengthSqr = function lengthSqr() {
    var x = this.x,
        y = this.y,
        z = this.z,
        w = this.w;
    return x * x + y * y + z * z + w * w;
  }
  /**
   * !#en Make the length of this vector to 1.
   * !#zh 向量归一化，让这个向量的长度为 1。
   * @method normalizeSelf
   * @return {Vec4} returns this
   * @chainable
   */
  ;

  _proto.normalizeSelf = function normalizeSelf() {
    this.normalize(this);
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
   * @param {Vec4} [out] - optional, the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created
   * @return {Vec4} result
   */
  ;

  _proto.normalize = function normalize(out) {
    out = out || new Vec4();
    _x = this.x;
    _y = this.y;
    _z = this.z;
    _w = this.w;
    var len = _x * _x + _y * _y + _z * _z + _w * _w;

    if (len > 0) {
      len = 1 / Math.sqrt(len);
      out.x = _x * len;
      out.y = _y * len;
      out.z = _z * len;
      out.w = _w * len;
    }

    return out;
  }
  /**
   * Transforms the vec4 with a mat4. 4th vector component is implicitly '1'
   * @method transformMat4
   * @param {Mat4} m matrix to transform with
   * @param {Vec4} [out] the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created
   * @returns {Vec4} out
   */
  ;

  _proto.transformMat4 = function transformMat4(matrix, out) {
    out = out || new Vec4();
    _x = this.x;
    _y = this.y;
    _z = this.z;
    _w = this.w;
    var m = matrix.m;
    out.x = m[0] * _x + m[4] * _y + m[8] * _z + m[12] * _w;
    out.y = m[1] * _x + m[5] * _y + m[9] * _z + m[13] * _w;
    out.z = m[2] * _x + m[6] * _y + m[10] * _z + m[14] * _w;
    out.w = m[3] * _x + m[7] * _y + m[11] * _z + m[15] * _w;
    return out;
  }
  /**
   * Returns the maximum value in x, y, z, w.
   * @method maxAxis
   * @returns {number}
   */
  ;

  _proto.maxAxis = function maxAxis() {
    return Math.max(this.x, this.y, this.z, this.w);
  };

  return Vec4;
}(_valueType["default"]);

exports["default"] = Vec4;
Vec4.sub = Vec4.subtract;
Vec4.mul = Vec4.multiply;
Vec4.div = Vec4.divide;
Vec4.scale = Vec4.multiplyScalar;
Vec4.mag = Vec4.len;
Vec4.squaredMagnitude = Vec4.lengthSqr;
Vec4.ZERO_R = Vec4.ZERO;
Vec4.ONE_R = Vec4.ONE;
Vec4.NEG_ONE_R = Vec4.NEG_ONE;

_CCClass["default"].fastDefine('cc.Vec4', Vec4, {
  x: 0,
  y: 0,
  z: 0,
  w: 0
});

function v4(x, y, z, w) {
  return new Vec4(x, y, z, w);
}

cc.v4 = v4;
cc.Vec4 = Vec4;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlYzQudHMiXSwibmFtZXMiOlsiX3giLCJfeSIsIl96IiwiX3ciLCJWZWM0Iiwic3ViIiwidmVjdG9yIiwib3V0Iiwic3VidHJhY3QiLCJtdWwiLCJudW0iLCJtdWx0aXBseVNjYWxhciIsImRpdiIsImRpdmlkZSIsInNjYWxlIiwibXVsdGlwbHkiLCJuZWciLCJuZWdhdGUiLCJjbG9uZSIsImEiLCJ4IiwieSIsInoiLCJ3IiwiY29weSIsInNldCIsImFkZCIsImIiLCJjZWlsIiwiTWF0aCIsImZsb29yIiwibWluIiwibWF4Iiwicm91bmQiLCJzY2FsZUFuZEFkZCIsImRpc3RhbmNlIiwic3FydCIsInNxdWFyZWREaXN0YW5jZSIsImxlbiIsImxlbmd0aFNxciIsImludmVyc2UiLCJpbnZlcnNlU2FmZSIsImFicyIsIkVQU0lMT04iLCJub3JtYWxpemUiLCJkb3QiLCJsZXJwIiwidCIsInJhbmRvbSIsInBoaSIsIlBJIiwiY29zVGhldGEiLCJzaW5UaGV0YSIsImNvcyIsInNpbiIsInRyYW5zZm9ybU1hdDQiLCJtYXQiLCJtIiwidHJhbnNmb3JtQWZmaW5lIiwidiIsInRyYW5zZm9ybVF1YXQiLCJxIiwiaXgiLCJpeSIsIml6IiwiaXciLCJzdHJpY3RFcXVhbHMiLCJlcXVhbHMiLCJlcHNpbG9uIiwidG9BcnJheSIsIm9mcyIsImZyb21BcnJheSIsImFyciIsIm1hZyIsInByb3RvdHlwZSIsIm1hZ1NxciIsInN1YlNlbGYiLCJtdWxTZWxmIiwiZGl2U2VsZiIsInNjYWxlU2VsZiIsIm5lZ1NlbGYiLCJvdGhlciIsImVxdWFsczRmIiwic3RyaWN0RXF1YWxzNGYiLCJ0byIsInJhdGlvIiwidG9TdHJpbmciLCJ0b0ZpeGVkIiwiY2xhbXBmIiwibWluSW5jbHVzaXZlIiwibWF4SW5jbHVzaXZlIiwiYWRkU2VsZiIsImNyb3NzIiwiYXgiLCJheSIsImF6IiwiYngiLCJieSIsImJ6Iiwibm9ybWFsaXplU2VsZiIsIm1hdHJpeCIsIm1heEF4aXMiLCJWYWx1ZVR5cGUiLCJzcXVhcmVkTWFnbml0dWRlIiwiWkVST19SIiwiWkVSTyIsIk9ORV9SIiwiT05FIiwiTkVHX09ORV9SIiwiTkVHX09ORSIsIkNDQ2xhc3MiLCJmYXN0RGVmaW5lIiwidjQiLCJjYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkE7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7QUFHQSxJQUFJQSxFQUFVLEdBQUcsR0FBakI7QUFDQSxJQUFJQyxFQUFVLEdBQUcsR0FBakI7QUFDQSxJQUFJQyxFQUFVLEdBQUcsR0FBakI7QUFDQSxJQUFJQyxFQUFVLEdBQUcsR0FBakI7QUFFQTs7Ozs7Ozs7SUFPcUJDOzs7Ozs7O0FBQ2pCO1NBVUFDLE1BQUEsYUFBS0MsTUFBTCxFQUFtQkMsR0FBbkIsRUFBK0I7QUFDM0IsV0FBT0gsSUFBSSxDQUFDSSxRQUFMLENBQWNELEdBQUcsSUFBSSxJQUFJSCxJQUFKLEVBQXJCLEVBQWlDLElBQWpDLEVBQXVDRSxNQUF2QyxDQUFQO0FBQ0g7O1NBRURHLE1BQUEsYUFBS0MsR0FBTCxFQUFrQkgsR0FBbEIsRUFBOEI7QUFDMUIsV0FBT0gsSUFBSSxDQUFDTyxjQUFMLENBQW9CSixHQUFHLElBQUksSUFBSUgsSUFBSixFQUEzQixFQUF1QyxJQUF2QyxFQUE2Q00sR0FBN0MsQ0FBUDtBQUNIOztTQUVERSxNQUFBLGFBQUtOLE1BQUwsRUFBbUJDLEdBQW5CLEVBQStCO0FBQzNCLFdBQU9ILElBQUksQ0FBQ1MsTUFBTCxDQUFZTixHQUFHLElBQUksSUFBSUgsSUFBSixFQUFuQixFQUErQixJQUEvQixFQUFxQ0UsTUFBckMsQ0FBUDtBQUNIOztTQUVEUSxRQUFBLGVBQU9SLE1BQVAsRUFBcUJDLEdBQXJCLEVBQWlDO0FBQzdCLFdBQU9ILElBQUksQ0FBQ1csUUFBTCxDQUFjUixHQUFHLElBQUksSUFBSUgsSUFBSixFQUFyQixFQUFpQyxJQUFqQyxFQUF1Q0UsTUFBdkMsQ0FBUDtBQUNIOztTQUVEVSxNQUFBLGFBQUtULEdBQUwsRUFBaUI7QUFDYixXQUFPSCxJQUFJ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O0FBS08sU0FBU3lGLEVBQVQsQ0FBYTVGLENBQWIsRUFBZ0NDLENBQWhDLEVBQTRDQyxDQUE1QyxFQUF3REMsQ0FBeEQsRUFBb0U7QUFDdkUsU0FBTyxJQUFJbkIsSUFBSixDQUFTZ0IsQ0FBVCxFQUFtQkMsQ0FBbkIsRUFBc0JDLENBQXRCLEVBQXlCQyxDQUF6QixDQUFQO0FBQ0g7O0FBRUQwRixFQUFFLENBQUNELEVBQUgsR0FBUUEsRUFBUjtBQUNBQyxFQUFFLENBQUM3RyxJQUFILEdBQVVBLElBQVYiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuIENvcHlyaWdodCAoYykgMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwOi8vd3d3LmNvY29zLmNvbVxuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiovXG5cbmltcG9ydCBDQ0NsYXNzIGZyb20gJy4uL3BsYXRmb3JtL0NDQ2xhc3MnO1xuaW1wb3J0IFZhbHVlVHlwZSBmcm9tICcuL3ZhbHVlLXR5cGUnO1xuaW1wb3J0IE1hdDQgZnJvbSAnLi9tYXQ0JztcbmltcG9ydCB7IGNsYW1wLCBFUFNJTE9OLCByYW5kb20gfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IElWZWM0TGlrZSwgSU1hdDRMaWtlLCBJUXVhdExpa2UgfSBmcm9tICcuL21hdGgnO1xuXG5sZXQgX3g6IG51bWJlciA9IDAuMDtcbmxldCBfeTogbnVtYmVyID0gMC4wO1xubGV0IF96OiBudW1iZXIgPSAwLjA7XG5sZXQgX3c6IG51bWJlciA9IDAuMDtcblxuLyoqXG4gKiAhI2VuIFJlcHJlc2VudGF0aW9uIG9mIDNEIHZlY3RvcnMgYW5kIHBvaW50cy5cbiAqICEjemgg6KGo56S6IDNEIOWQkemHj+WSjOWdkOagh1xuICpcbiAqIEBjbGFzcyBWZWM0XG4gKiBAZXh0ZW5kcyBWYWx1ZVR5cGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmVjNCBleHRlbmRzIFZhbHVlVHlwZSB7XG4gICAgLy8gZGVwcmVjYXRlZFxuICAgIHB1YmxpYyBzdGF0aWMgc3ViICAgPSBWZWM0LnN1YnRyYWN0O1xuICAgIHB1YmxpYyBzdGF0aWMgbXVsICAgPSBWZWM0Lm11bHRpcGx5O1xuICAgIHB1YmxpYyBzdGF0aWMgZGl2ID0gVmVjNC5kaXZpZGU7XG4gICAgcHVibGljIHN0YXRpYyBzY2FsZSA9IFZlYzQubXVsdGlwbHlTY2FsYXI7XG4gICAgcHVibGljIHN0YXRpYyBtYWcgICA9IFZlYzQubGVuO1xuICAgIHB1YmxpYyBzdGF0aWMgc3F1YXJlZE1hZ25pdHVkZSA9IFZlYzQubGVuZ3RoU3FyO1xuICAgIG1hZyAgPSBWZWM0LnByb3RvdHlwZS5sZW47XG4gICAgbWFnU3FyID0gVmVjNC5wcm90b3R5cGUubGVuZ3RoU3FyO1xuICAgIHN1YlNlbGYgID0gVmVjNC5wcm90b3R5cGUuc3VidHJhY3Q7XG4gICAgc3ViICh2ZWN0b3I6IFZlYzQsIG91dD86IFZlYzQpIHtcbiAgICAgICAgcmV0dXJuIFZlYzQuc3VidHJhY3Qob3V0IHx8IG5ldyBWZWM0KCksIHRoaXMsIHZlY3Rvcik7XG4gICAgfVxuICAgIG11bFNlbGYgID0gVmVjNC5wcm90b3R5cGUubXVsdGlwbHlTY2FsYXI7XG4gICAgbXVsIChudW06IG51bWJlciwgb3V0PzogVmVjNCkge1xuICAgICAgICByZXR1cm4gVmVjNC5tdWx0aXBseVNjYWxhcihvdXQgfHwgbmV3IFZlYzQoKSwgdGhpcywgbnVtKTtcbiAgICB9XG4gICAgZGl2U2VsZiAgPSBWZWM0LnByb3RvdHlwZS5kaXZpZGU7XG4gICAgZGl2ICh2ZWN0b3I6IFZlYzQsIG91dD86IFZlYzQpIHtcbiAgICAgICAgcmV0dXJuIFZlYzQuZGl2aWRlKG91dCB8fCBuZXcgVmVjNCgpLCB0aGlzLCB2ZWN0b3IpO1xuICAgIH1cbiAgICBzY2FsZVNlbGYgPSBWZWM0LnByb3RvdHlwZS5tdWx0aXBseTtcbiAgICBzY2FsZSAodmVjdG9yOiBWZWM0LCBvdXQ/OiBWZWM0KSB7XG4gICAgICAgIHJldHVybiBWZWM0Lm11bHRpcGx5KG91dCB8fCBuZXcgVmVjNCgpLCB0aGlzLCB2ZWN0b3IpO1xuICAgIH1cbiAgICBuZWdTZWxmID0gVmVjNC5wcm90b3R5cGUubmVnYXRlO1xuICAgIG5lZyAob3V0PzogVmVjNCkge1xuICAgICAgICByZXR1cm4gVmVjNC5uZWdhdGUob3V0IHx8IG5ldyBWZWM0KCksIHRoaXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IFpFUk8gKCkgeyByZXR1cm4gbmV3IFZlYzQoMCwgMCwgMCwgMCk7IH1cbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFpFUk9fUiA9IFZlYzQuWkVSTztcblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IE9ORSAoKSB7IHJldHVybiBuZXcgVmVjNCgxLCAxLCAxLCAxKTsgfVxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgT05FX1IgPSBWZWM0Lk9ORTtcblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IE5FR19PTkUgKCkgeyByZXR1cm4gbmV3IFZlYzQoLTEsIC0xLCAtMSwgLTEpOyB9XG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBORUdfT05FX1IgPSBWZWM0Lk5FR19PTkU7XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOiOt+W+l+aMh+WumuWQkemHj+eahOaLt+i0nVxuICAgICAqICEjZW4gT2J0YWluaW5nIGNvcHkgdmVjdG9ycyBkZXNpZ25hdGVkXG4gICAgICogQG1ldGhvZCBjbG9uZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcHVibGljIHN0YXRpYyBjbG9uZSA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAoYTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGNsb25lIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChhOiBPdXQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWM0KGEueCwgYS55LCBhLnosIGEudyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlpI3liLbnm67moIflkJHph49cbiAgICAgKiAhI2VuIENvcHkgdGhlIHRhcmdldCB2ZWN0b3JcbiAgICAgKiBAbWV0aG9kIGNvcHlcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHB1YmxpYyBzdGF0aWMgY29weSA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBjb3B5IDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XG4gICAgICAgIG91dC54ID0gYS54O1xuICAgICAgICBvdXQueSA9IGEueTtcbiAgICAgICAgb3V0LnogPSBhLno7XG4gICAgICAgIG91dC53ID0gYS53O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6K6+572u5ZCR6YeP5YC8XG4gICAgICogISNlbiBTZXQgdG8gdmFsdWVcbiAgICAgKiBAbWV0aG9kIHNldFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcHVibGljIHN0YXRpYyBzZXQgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCB4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB3OiBudW1iZXIpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgc2V0IDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgdzogbnVtYmVyKSB7XG4gICAgICAgIG91dC54ID0geDtcbiAgICAgICAgb3V0LnkgPSB5O1xuICAgICAgICBvdXQueiA9IHo7XG4gICAgICAgIG91dC53ID0gdztcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+WKoOazlVxuICAgICAqICEjZW4gRWxlbWVudC13aXNlIHZlY3RvciBhZGRpdGlvblxuICAgICAqIEBtZXRob2QgYWRkXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgc3RhdGljIGFkZCA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGFkZCA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KSB7XG4gICAgICAgIG91dC54ID0gYS54ICsgYi54O1xuICAgICAgICBvdXQueSA9IGEueSArIGIueTtcbiAgICAgICAgb3V0LnogPSBhLnogKyBiLno7XG4gICAgICAgIG91dC53ID0gYS53ICsgYi53O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP5YeP5rOVXG4gICAgICogISNlbiBFbGVtZW50LXdpc2UgdmVjdG9yIHN1YnRyYWN0aW9uXG4gICAgICogQG1ldGhvZCBzdWJ0cmFjdFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcHVibGljIHN0YXRpYyBzdWJ0cmFjdCA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHN1YnRyYWN0IDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgb3V0LnggPSBhLnggLSBiLng7XG4gICAgICAgIG91dC55ID0gYS55IC0gYi55O1xuICAgICAgICBvdXQueiA9IGEueiAtIGIuejtcbiAgICAgICAgb3V0LncgPSBhLncgLSBiLnc7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/kuZjms5VcbiAgICAgKiAhI2VuIEVsZW1lbnQtd2lzZSB2ZWN0b3IgbXVsdGlwbGljYXRpb25cbiAgICAgKiBAbWV0aG9kIG11bHRpcGx5XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgc3RhdGljIG11bHRpcGx5IDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgbXVsdGlwbHkgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICBvdXQueCA9IGEueCAqIGIueDtcbiAgICAgICAgb3V0LnkgPSBhLnkgKiBiLnk7XG4gICAgICAgIG91dC56ID0gYS56ICogYi56O1xuICAgICAgICBvdXQudyA9IGEudyAqIGIudztcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+mZpOazlVxuICAgICAqICEjZW4gRWxlbWVudC13aXNlIHZlY3RvciBkaXZpc2lvblxuICAgICAqIEBtZXRob2QgZGl2aWRlXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgc3RhdGljIGRpdmlkZSA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGRpdmlkZSA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KSB7XG4gICAgICAgIG91dC54ID0gYS54IC8gYi54O1xuICAgICAgICBvdXQueSA9IGEueSAvIGIueTtcbiAgICAgICAgb3V0LnogPSBhLnogLyBiLno7XG4gICAgICAgIG91dC53ID0gYS53IC8gYi53O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP5ZCR5LiK5Y+W5pW0XG4gICAgICogISNlbiBSb3VuZGluZyB1cCBieSBlbGVtZW50cyBvZiB0aGUgdmVjdG9yXG4gICAgICogQG1ldGhvZCBjZWlsXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgc3RhdGljIGNlaWwgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgY2VpbCA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xuICAgICAgICBvdXQueCA9IE1hdGguY2VpbChhLngpO1xuICAgICAgICBvdXQueSA9IE1hdGguY2VpbChhLnkpO1xuICAgICAgICBvdXQueiA9IE1hdGguY2VpbChhLnopO1xuICAgICAgICBvdXQudyA9IE1hdGguY2VpbChhLncpO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP5ZCR5LiL5Y+W5pW0XG4gICAgICogISNlbiBFbGVtZW50IHZlY3RvciBieSByb3VuZGluZyBkb3duXG4gICAgICogQG1ldGhvZCBmbG9vclxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcHVibGljIHN0YXRpYyBmbG9vciA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBmbG9vciA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xuICAgICAgICBvdXQueCA9IE1hdGguZmxvb3IoYS54KTtcbiAgICAgICAgb3V0LnkgPSBNYXRoLmZsb29yKGEueSk7XG4gICAgICAgIG91dC56ID0gTWF0aC5mbG9vcihhLnopO1xuICAgICAgICBvdXQudyA9IE1hdGguZmxvb3IoYS53KTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+acgOWwj+WAvFxuICAgICAqICEjZW4gVGhlIG1pbmltdW0gYnktZWxlbWVudCB2ZWN0b3JcbiAgICAgKiBAbWV0aG9kIG1pblxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcHVibGljIHN0YXRpYyBtaW4gPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBtaW4gPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICBvdXQueCA9IE1hdGgubWluKGEueCwgYi54KTtcbiAgICAgICAgb3V0LnkgPSBNYXRoLm1pbihhLnksIGIueSk7XG4gICAgICAgIG91dC56ID0gTWF0aC5taW4oYS56LCBiLnopO1xuICAgICAgICBvdXQudyA9IE1hdGgubWluKGEudywgYi53KTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+acgOWkp+WAvFxuICAgICAqICEjZW4gVGhlIG1heGltdW0gdmFsdWUgb2YgdGhlIGVsZW1lbnQtd2lzZSB2ZWN0b3JcbiAgICAgKiBAbWV0aG9kIG1heFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcHVibGljIHN0YXRpYyBtYXggPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBtYXggPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICBvdXQueCA9IE1hdGgubWF4KGEueCwgYi54KTtcbiAgICAgICAgb3V0LnkgPSBNYXRoLm1heChhLnksIGIueSk7XG4gICAgICAgIG91dC56ID0gTWF0aC5tYXgoYS56LCBiLnopO1xuICAgICAgICBvdXQudyA9IE1hdGgubWF4KGEudywgYi53KTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+Wbm+iIjeS6lOWFpeWPluaVtFxuICAgICAqICEjZW4gRWxlbWVudC13aXNlIHZlY3RvciBvZiByb3VuZGluZyB0byB3aG9sZVxuICAgICAqIEBtZXRob2Qgcm91bmRcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHB1YmxpYyBzdGF0aWMgcm91bmQgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcm91bmQgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcbiAgICAgICAgb3V0LnggPSBNYXRoLnJvdW5kKGEueCk7XG4gICAgICAgIG91dC55ID0gTWF0aC5yb3VuZChhLnkpO1xuICAgICAgICBvdXQueiA9IE1hdGgucm91bmQoYS56KTtcbiAgICAgICAgb3V0LncgPSBNYXRoLnJvdW5kKGEudyk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlkJHph4/moIfph4/kuZjms5VcbiAgICAgKiAhI2VuIFZlY3RvciBzY2FsYXIgbXVsdGlwbGljYXRpb25cbiAgICAgKiBAbWV0aG9kIG11bHRpcGx5U2NhbGFyXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgc3RhdGljIG11bHRpcGx5U2NhbGFyIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBudW1iZXIpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgbXVsdGlwbHlTY2FsYXIgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IG51bWJlcikge1xuICAgICAgICBvdXQueCA9IGEueCAqIGI7XG4gICAgICAgIG91dC55ID0gYS55ICogYjtcbiAgICAgICAgb3V0LnogPSBhLnogKiBiO1xuICAgICAgICBvdXQudyA9IGEudyAqIGI7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/kuZjliqA6IEEgKyBCICogc2NhbGVcbiAgICAgKiAhI2VuIEVsZW1lbnQtd2lzZSB2ZWN0b3IgbXVsdGlwbHkgYWRkOiBBICsgQiAqIHNjYWxlXG4gICAgICogQG1ldGhvZCBzY2FsZUFuZEFkZFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcHVibGljIHN0YXRpYyBzY2FsZUFuZEFkZCA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0LCBzY2FsZTogbnVtYmVyKVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHNjYWxlQW5kQWRkIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQsIHNjYWxlOiBudW1iZXIpIHtcbiAgICAgICAgb3V0LnggPSBhLnggKyAoYi54ICogc2NhbGUpO1xuICAgICAgICBvdXQueSA9IGEueSArIChiLnkgKiBzY2FsZSk7XG4gICAgICAgIG91dC56ID0gYS56ICsgKGIueiAqIHNjYWxlKTtcbiAgICAgICAgb3V0LncgPSBhLncgKyAoYi53ICogc2NhbGUpO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5rGC5Lik5ZCR6YeP55qE5qyn5rCP6Led56a7XG4gICAgICogISNlbiBTZWVraW5nIHR3byB2ZWN0b3JzIEV1Y2xpZGVhbiBkaXN0YW5jZVxuICAgICAqIEBtZXRob2QgZGlzdGFuY2VcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHB1YmxpYyBzdGF0aWMgZGlzdGFuY2UgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKGE6IE91dCwgYjogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGRpc3RhbmNlIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICBjb25zdCB4ID0gYi54IC0gYS54O1xuICAgICAgICBjb25zdCB5ID0gYi55IC0gYS55O1xuICAgICAgICBjb25zdCB6ID0gYi56IC0gYS56O1xuICAgICAgICBjb25zdCB3ID0gYi53IC0gYS53O1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeiArIHcgKiB3KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOaxguS4pOWQkemHj+eahOasp+awj+i3neemu+W5s+aWuVxuICAgICAqICEjZW4gRXVjbGlkZWFuIGRpc3RhbmNlIHNxdWFyZWQgc2Vla2luZyB0d28gdmVjdG9yc1xuICAgICAqIEBtZXRob2Qgc3F1YXJlZERpc3RhbmNlXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgc3RhdGljIHNxdWFyZWREaXN0YW5jZSA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAoYTogT3V0LCBiOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgc3F1YXJlZERpc3RhbmNlIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICBjb25zdCB4ID0gYi54IC0gYS54O1xuICAgICAgICBjb25zdCB5ID0gYi55IC0gYS55O1xuICAgICAgICBjb25zdCB6ID0gYi56IC0gYS56O1xuICAgICAgICBjb25zdCB3ID0gYi53IC0gYS53O1xuICAgICAgICByZXR1cm4geCAqIHggKyB5ICogeSArIHogKiB6ICsgdyAqIHc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmsYLlkJHph4/plb/luqZcbiAgICAgKiAhI2VuIFNlZWtpbmcgdmVjdG9yIGxlbmd0aFxuICAgICAqIEBtZXRob2QgbGVuXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgc3RhdGljIGxlbiA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAoYTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGxlbiA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAoYTogT3V0KSB7XG4gICAgICAgIF94ID0gYS54O1xuICAgICAgICBfeSA9IGEueTtcbiAgICAgICAgX3ogPSBhLno7XG4gICAgICAgIF93ID0gYS53O1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KF94ICogX3ggKyBfeSAqIF95ICsgX3ogKiBfeiArIF93ICogX3cpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5rGC5ZCR6YeP6ZW/5bqm5bmz5pa5XG4gICAgICogISNlbiBTZWVraW5nIHNxdWFyZWQgdmVjdG9yIGxlbmd0aFxuICAgICAqIEBtZXRob2QgbGVuZ3RoU3FyXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgc3RhdGljIGxlbmd0aFNxciA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAoYTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGxlbmd0aFNxciA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAoYTogT3V0KSB7XG4gICAgICAgIF94ID0gYS54O1xuICAgICAgICBfeSA9IGEueTtcbiAgICAgICAgX3ogPSBhLno7XG4gICAgICAgIF93ID0gYS53O1xuICAgICAgICByZXR1cm4gX3ggKiBfeCArIF95ICogX3kgKyBfeiAqIF96ICsgX3cgKiBfdztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+WPlui0n1xuICAgICAqICEjZW4gQnkgdGFraW5nIHRoZSBuZWdhdGl2ZSBlbGVtZW50cyBvZiB0aGUgdmVjdG9yXG4gICAgICogQG1ldGhvZCBuZWdhdGVcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHB1YmxpYyBzdGF0aWMgbmVnYXRlIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIG5lZ2F0ZSA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xuICAgICAgICBvdXQueCA9IC1hLng7XG4gICAgICAgIG91dC55ID0gLWEueTtcbiAgICAgICAgb3V0LnogPSAtYS56O1xuICAgICAgICBvdXQudyA9IC1hLnc7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/lj5blgJLmlbDvvIzmjqXov5EgMCDml7bov5Tlm54gSW5maW5pdHlcbiAgICAgKiAhI2VuIEVsZW1lbnQgdmVjdG9yIGJ5IHRha2luZyB0aGUgaW52ZXJzZSwgcmV0dXJuIG5lYXIgMCBJbmZpbml0eVxuICAgICAqIEBtZXRob2QgaW52ZXJzZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcHVibGljIHN0YXRpYyBpbnZlcnNlIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGludmVyc2UgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcbiAgICAgICAgb3V0LnggPSAxLjAgLyBhLng7XG4gICAgICAgIG91dC55ID0gMS4wIC8gYS55O1xuICAgICAgICBvdXQueiA9IDEuMCAvIGEuejtcbiAgICAgICAgb3V0LncgPSAxLjAgLyBhLnc7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/lj5blgJLmlbDvvIzmjqXov5EgMCDml7bov5Tlm54gMFxuICAgICAqICEjZW4gRWxlbWVudCB2ZWN0b3IgYnkgdGFraW5nIHRoZSBpbnZlcnNlLCByZXR1cm4gbmVhciAwIDBcbiAgICAgKiBAbWV0aG9kIGludmVyc2VTYWZlXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgc3RhdGljIGludmVyc2VTYWZlIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGludmVyc2VTYWZlIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XG4gICAgICAgIF94ID0gYS54O1xuICAgICAgICBfeSA9IGEueTtcbiAgICAgICAgX3ogPSBhLno7XG4gICAgICAgIF93ID0gYS53O1xuXG4gICAgICAgIGlmIChNYXRoLmFicyhfeCkgPCBFUFNJTE9OKSB7XG4gICAgICAgICAgICBvdXQueCA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXQueCA9IDEuMCAvIF94O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKE1hdGguYWJzKF95KSA8IEVQU0lMT04pIHtcbiAgICAgICAgICAgIG91dC55ID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dC55ID0gMS4wIC8gX3k7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoTWF0aC5hYnMoX3opIDwgRVBTSUxPTikge1xuICAgICAgICAgICAgb3V0LnogPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0LnogPSAxLjAgLyBfejtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChNYXRoLmFicyhfdykgPCBFUFNJTE9OKSB7XG4gICAgICAgICAgICBvdXQudyA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXQudyA9IDEuMCAvIF93O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOW9kuS4gOWMluWQkemHj1xuICAgICAqICEjZW4gTm9ybWFsaXplZCB2ZWN0b3JcbiAgICAgKiBAbWV0aG9kIG5vcm1hbGl6ZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcHVibGljIHN0YXRpYyBub3JtYWxpemUgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgbm9ybWFsaXplIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XG4gICAgICAgIF94ID0gYS54O1xuICAgICAgICBfeSA9IGEueTtcbiAgICAgICAgX3ogPSBhLno7XG4gICAgICAgIF93ID0gYS53O1xuICAgICAgICBsZXQgbGVuID0gX3ggKiBfeCArIF95ICogX3kgKyBfeiAqIF96ICsgX3cgKiBfdztcbiAgICAgICAgaWYgKGxlbiA+IDApIHtcbiAgICAgICAgICAgIGxlbiA9IDEgLyBNYXRoLnNxcnQobGVuKTtcbiAgICAgICAgICAgIG91dC54ID0gX3ggKiBsZW47XG4gICAgICAgICAgICBvdXQueSA9IF95ICogbGVuO1xuICAgICAgICAgICAgb3V0LnogPSBfeiAqIGxlbjtcbiAgICAgICAgICAgIG91dC53ID0gX3cgKiBsZW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWQkemHj+eCueenr++8iOaVsOmHj+enr++8iVxuICAgICAqICEjZW4gVmVjdG9yIGRvdCBwcm9kdWN0IChzY2FsYXIgcHJvZHVjdClcbiAgICAgKiBAbWV0aG9kIGRvdFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcHVibGljIHN0YXRpYyBkb3QgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKGE6IE91dCwgYjogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGRvdCA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAoYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgcmV0dXJuIGEueCAqIGIueCArIGEueSAqIGIueSArIGEueiAqIGIueiArIGEudyAqIGIudztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+e6v+aAp+aPkuWAvO+8miBBICsgdCAqIChCIC0gQSlcbiAgICAgKiAhI2VuIFZlY3RvciBlbGVtZW50IGJ5IGVsZW1lbnQgbGluZWFyIGludGVycG9sYXRpb246IEEgKyB0ICogKEIgLSBBKVxuICAgICAqIEBtZXRob2QgbGVycFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcHVibGljIHN0YXRpYyBsZXJwIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQsIHQ6IG51bWJlcilcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBsZXJwIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQsIHQ6IG51bWJlcikge1xuICAgICAgICBvdXQueCA9IGEueCArIHQgKiAoYi54IC0gYS54KTtcbiAgICAgICAgb3V0LnkgPSBhLnkgKyB0ICogKGIueSAtIGEueSk7XG4gICAgICAgIG91dC56ID0gYS56ICsgdCAqIChiLnogLSBhLnopO1xuICAgICAgICBvdXQudyA9IGEudyArIHQgKiAoYi53IC0gYS53KTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOeUn+aIkOS4gOS4quWcqOWNleS9jeeQg+S9k+S4iuWdh+WMgOWIhuW4g+eahOmaj+acuuWQkemHj1xuICAgICAqICEjZW4gR2VuZXJhdGVzIGEgdW5pZm9ybWx5IGRpc3RyaWJ1dGVkIHJhbmRvbSB2ZWN0b3JzIG9uIHRoZSB1bml0IHNwaGVyZVxuICAgICAqIEBtZXRob2QgcmFuZG9tXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgc3RhdGljIHJhbmRvbSA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIHNjYWxlPzogbnVtYmVyKVxuICAgICAqIEBwYXJhbSBzY2FsZSDnlJ/miJDnmoTlkJHph4/plb/luqZcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByYW5kb20gPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBzY2FsZT86IG51bWJlcikge1xuICAgICAgICBzY2FsZSA9IHNjYWxlIHx8IDEuMDtcblxuICAgICAgICBjb25zdCBwaGkgPSByYW5kb20oKSAqIDIuMCAqIE1hdGguUEk7XG4gICAgICAgIGNvbnN0IGNvc1RoZXRhID0gcmFuZG9tKCkgKiAyIC0gMTtcbiAgICAgICAgY29uc3Qgc2luVGhldGEgPSBNYXRoLnNxcnQoMSAtIGNvc1RoZXRhICogY29zVGhldGEpO1xuXG4gICAgICAgIG91dC54ID0gc2luVGhldGEgKiBNYXRoLmNvcyhwaGkpICogc2NhbGU7XG4gICAgICAgIG91dC55ID0gc2luVGhldGEgKiBNYXRoLnNpbihwaGkpICogc2NhbGU7XG4gICAgICAgIG91dC56ID0gY29zVGhldGEgKiBzY2FsZTtcbiAgICAgICAgb3V0LncgPSAwO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5ZCR6YeP55+p6Zi15LmY5rOVXG4gICAgICogISNlbiBWZWN0b3IgbWF0cml4IG11bHRpcGxpY2F0aW9uXG4gICAgICogQG1ldGhvZCB0cmFuc2Zvcm1NYXQ0XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgc3RhdGljIHRyYW5zZm9ybU1hdDQgPE91dCBleHRlbmRzIElWZWM0TGlrZSwgTWF0TGlrZSBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIG1hdDogTWF0TGlrZSlcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyB0cmFuc2Zvcm1NYXQ0IDxPdXQgZXh0ZW5kcyBJVmVjNExpa2UsIE1hdExpa2UgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBtYXQ6IE1hdExpa2UpIHtcbiAgICAgICAgX3ggPSBhLng7XG4gICAgICAgIF95ID0gYS55O1xuICAgICAgICBfeiA9IGEuejtcbiAgICAgICAgX3cgPSBhLnc7XG4gICAgICAgIGxldCBtID0gbWF0Lm07XG4gICAgICAgIG91dC54ID0gbVswXSAqIF94ICsgbVs0XSAqIF95ICsgbVs4XSAgKiBfeiArIG1bMTJdICogX3c7XG4gICAgICAgIG91dC55ID0gbVsxXSAqIF94ICsgbVs1XSAqIF95ICsgbVs5XSAgKiBfeiArIG1bMTNdICogX3c7XG4gICAgICAgIG91dC56ID0gbVsyXSAqIF94ICsgbVs2XSAqIF95ICsgbVsxMF0gKiBfeiArIG1bMTRdICogX3c7XG4gICAgICAgIG91dC53ID0gbVszXSAqIF94ICsgbVs3XSAqIF95ICsgbVsxMV0gKiBfeiArIG1bMTVdICogX3c7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlkJHph4/ku7/lsITlj5jmjaJcbiAgICAgKiAhI2VuIEFmZmluZSB0cmFuc2Zvcm1hdGlvbiB2ZWN0b3JcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyB0cmFuc2Zvcm1BZmZpbmU8T3V0IGV4dGVuZHMgSVZlYzRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzRMaWtlLCBNYXRMaWtlIGV4dGVuZHMgSU1hdDRMaWtlPlxuICAgICAgICAob3V0OiBPdXQsIHY6IFZlY0xpa2UsIG1hdDogTWF0TGlrZSkge1xuICAgICAgICBfeCA9IHYueDtcbiAgICAgICAgX3kgPSB2Lnk7XG4gICAgICAgIF96ID0gdi56O1xuICAgICAgICBfdyA9IHYudztcbiAgICAgICAgbGV0IG0gPSBtYXQubTtcbiAgICAgICAgb3V0LnggPSBtWzBdICogX3ggKyBtWzFdICogX3kgKyBtWzJdICAqIF96ICsgbVszXSAqIF93O1xuICAgICAgICBvdXQueSA9IG1bNF0gKiBfeCArIG1bNV0gKiBfeSArIG1bNl0gICogX3ogKyBtWzddICogX3c7XG4gICAgICAgIG91dC54ID0gbVs4XSAqIF94ICsgbVs5XSAqIF95ICsgbVsxMF0gKiBfeiArIG1bMTFdICogX3c7XG4gICAgICAgIG91dC53ID0gdi53O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5ZCR6YeP5Zub5YWD5pWw5LmY5rOVXG4gICAgICogISNlbiBWZWN0b3IgcXVhdGVybmlvbiBtdWx0aXBsaWNhdGlvblxuICAgICAqIEBtZXRob2QgdHJhbnNmb3JtUXVhdFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcHVibGljIHN0YXRpYyB0cmFuc2Zvcm1RdWF0IDxPdXQgZXh0ZW5kcyBJVmVjNExpa2UsIFF1YXRMaWtlIGV4dGVuZHMgSVF1YXRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgcTogUXVhdExpa2UpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgdHJhbnNmb3JtUXVhdCA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlLCBRdWF0TGlrZSBleHRlbmRzIElRdWF0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIHE6IFF1YXRMaWtlKSB7XG4gICAgICAgIGNvbnN0IHsgeCwgeSwgeiB9ID0gYTtcblxuICAgICAgICBfeCA9IHEueDtcbiAgICAgICAgX3kgPSBxLnk7XG4gICAgICAgIF96ID0gcS56O1xuICAgICAgICBfdyA9IHEudztcblxuICAgICAgICAvLyBjYWxjdWxhdGUgcXVhdCAqIHZlY1xuICAgICAgICBjb25zdCBpeCA9IF93ICogeCArIF95ICogeiAtIF96ICogeTtcbiAgICAgICAgY29uc3QgaXkgPSBfdyAqIHkgKyBfeiAqIHggLSBfeCAqIHo7XG4gICAgICAgIGNvbnN0IGl6ID0gX3cgKiB6ICsgX3ggKiB5IC0gX3kgKiB4O1xuICAgICAgICBjb25zdCBpdyA9IC1feCAqIHggLSBfeSAqIHkgLSBfeiAqIHo7XG5cbiAgICAgICAgLy8gY2FsY3VsYXRlIHJlc3VsdCAqIGludmVyc2UgcXVhdFxuICAgICAgICBvdXQueCA9IGl4ICogX3cgKyBpdyAqIC1feCArIGl5ICogLV96IC0gaXogKiAtX3k7XG4gICAgICAgIG91dC55ID0gaXkgKiBfdyArIGl3ICogLV95ICsgaXogKiAtX3ggLSBpeCAqIC1fejtcbiAgICAgICAgb3V0LnogPSBpeiAqIF93ICsgaXcgKiAtX3ogKyBpeCAqIC1feSAtIGl5ICogLV94O1xuICAgICAgICBvdXQudyA9IGEudztcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWQkemHj+etieS7t+WIpOaWrVxuICAgICAqICEjZW4gRXF1aXZhbGVudCB2ZWN0b3JzIEFuYWx5emluZ1xuICAgICAqIEBtZXRob2Qgc3RyaWN0RXF1YWxzXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgc3RhdGljIHN0cmljdEVxdWFscyA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAoYTogT3V0LCBiOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgc3RyaWN0RXF1YWxzIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICByZXR1cm4gYS54ID09PSBiLnggJiYgYS55ID09PSBiLnkgJiYgYS56ID09PSBiLnogJiYgYS53ID09PSBiLnc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmjpLpmaTmta7ngrnmlbDor6/lt67nmoTlkJHph4/ov5HkvLznrYnku7fliKTmlq1cbiAgICAgKiAhI2VuIE5lZ2F0aXZlIGVycm9yIHZlY3RvciBmbG9hdGluZyBwb2ludCBhcHByb3hpbWF0ZWx5IGVxdWl2YWxlbnQgQW5hbHl6aW5nXG4gICAgICogQG1ldGhvZCBlcXVhbHNcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHB1YmxpYyBzdGF0aWMgZXF1YWxzIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChhOiBPdXQsIGI6IE91dCwgZXBzaWxvbiA9IEVQU0lMT04pXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZXF1YWxzIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChhOiBPdXQsIGI6IE91dCwgZXBzaWxvbiA9IEVQU0lMT04pIHtcbiAgICAgICAgcmV0dXJuIChNYXRoLmFicyhhLnggLSBiLngpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEueCksIE1hdGguYWJzKGIueCkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhLnkgLSBiLnkpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEueSksIE1hdGguYWJzKGIueSkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhLnogLSBiLnopIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEueiksIE1hdGguYWJzKGIueikpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhLncgLSBiLncpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEudyksIE1hdGguYWJzKGIudykpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWQkemHj+i9rOaVsOe7hFxuICAgICAqICEjZW4gVmVjdG9yIHRyYW5zZmVyIGFycmF5XG4gICAgICogQG1ldGhvZCB0b0FycmF5XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgc3RhdGljIHRvQXJyYXkgPE91dCBleHRlbmRzIElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+PiAob3V0OiBPdXQsIHY6IElWZWM0TGlrZSwgb2ZzID0gMClcbiAgICAgKiBAcGFyYW0gb2ZzIOaVsOe7hOi1t+Wni+WBj+enu+mHj1xuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHRvQXJyYXkgPE91dCBleHRlbmRzIElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+PiAob3V0OiBPdXQsIHY6IElWZWM0TGlrZSwgb2ZzID0gMCkge1xuICAgICAgICBvdXRbb2ZzICsgMF0gPSB2Lng7XG4gICAgICAgIG91dFtvZnMgKyAxXSA9IHYueTtcbiAgICAgICAgb3V0W29mcyArIDJdID0gdi56O1xuICAgICAgICBvdXRbb2ZzICsgM10gPSB2Lnc7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmlbDnu4TovazlkJHph49cbiAgICAgKiAhI2VuIEFycmF5IHN0ZWVyaW5nIGFtb3VudFxuICAgICAqIEBtZXRob2QgZnJvbUFycmF5XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBwdWJsaWMgc3RhdGljIGZyb21BcnJheSA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGFycjogSVdyaXRhYmxlQXJyYXlMaWtlPG51bWJlcj4sIG9mcyA9IDApXG4gICAgICogQHBhcmFtIG9mcyDmlbDnu4Totbflp4vlgY/np7vph49cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBmcm9tQXJyYXkgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhcnI6IElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+LCBvZnMgPSAwKSB7XG4gICAgICAgIG91dC54ID0gYXJyW29mcyArIDBdO1xuICAgICAgICBvdXQueSA9IGFycltvZnMgKyAxXTtcbiAgICAgICAgb3V0LnogPSBhcnJbb2ZzICsgMl07XG4gICAgICAgIG91dC53ID0gYXJyW29mcyArIDNdO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB4XG4gICAgICovXG4gICAgcHVibGljIHg6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB5XG4gICAgICovXG4gICAgcHVibGljIHk6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB6XG4gICAgICovXG4gICAgcHVibGljIHo6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB3XG4gICAgICovXG4gICAgcHVibGljIHc6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBDb25zdHJ1Y3RvclxuICAgICAqIHNlZSB7eyNjcm9zc0xpbmsgXCJjYy92ZWM0Om1ldGhvZFwifX1jYy52NHt7L2Nyb3NzTGlua319XG4gICAgICogISN6aFxuICAgICAqIOaehOmAoOWHveaVsO+8jOWPr+afpeeciyB7eyNjcm9zc0xpbmsgXCJjYy92ZWM0Om1ldGhvZFwifX1jYy52NHt7L2Nyb3NzTGlua319XG4gICAgICogQG1ldGhvZCBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeD0wXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeT0wXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbej0wXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbdz0wXVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yICh4OiBudW1iZXIgfCBWZWM0ID0gMCwgeTogbnVtYmVyID0gMCwgejogbnVtYmVyID0gMCwgdzogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBpZiAoeCAmJiB0eXBlb2YgeCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHRoaXMudyA9IHgudztcbiAgICAgICAgICAgIHRoaXMueiA9IHguejtcbiAgICAgICAgICAgIHRoaXMueSA9IHgueTtcbiAgICAgICAgICAgIHRoaXMueCA9IHgueDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMueCA9IHggYXMgbnVtYmVyO1xuICAgICAgICAgICAgdGhpcy55ID0geTtcbiAgICAgICAgICAgIHRoaXMueiA9IHo7XG4gICAgICAgICAgICB0aGlzLncgPSB3O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBjbG9uZSBhIFZlYzQgdmFsdWVcbiAgICAgKiAhI3poIOWFi+mahuS4gOS4qiBWZWM0IOWAvFxuICAgICAqIEBtZXRob2QgY2xvbmVcbiAgICAgKiBAcmV0dXJuIHtWZWM0fVxuICAgICAqL1xuICAgIHB1YmxpYyBjbG9uZSAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjNCh0aGlzLngsIHRoaXMueSwgdGhpcy56LCB0aGlzLncpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHRoZSBjdXJyZW50IHZlY3RvciB2YWx1ZSB3aXRoIHRoZSBnaXZlbiB2ZWN0b3IuXG4gICAgICogISN6aCDnlKjlj6bkuIDkuKrlkJHph4/orr7nva7lvZPliY3nmoTlkJHph4/lr7nosaHlgLzjgIJcbiAgICAgKiBAbWV0aG9kIHNldFxuICAgICAqIEBwYXJhbSB7VmVjNH0gbmV3VmFsdWUgLSAhI2VuIG5ldyB2YWx1ZSB0byBzZXQuICEjemgg6KaB6K6+572u55qE5paw5YC8XG4gICAgICogQHJldHVybiB7VmVjNH0gcmV0dXJucyB0aGlzXG4gICAgICovXG4gICAgcHVibGljIHNldCAob3RoZXI6IFZlYzQpO1xuXG4gICAgcHVibGljIHNldCAoeD86IG51bWJlciwgeT86IG51bWJlciwgej86IG51bWJlciwgdz86IG51bWJlcik7XG5cbiAgICBwdWJsaWMgc2V0ICh4PzogbnVtYmVyIHwgVmVjNCwgeT86IG51bWJlciwgej86IG51bWJlciwgdz86IG51bWJlcikge1xuICAgICAgICBpZiAoeCAmJiB0eXBlb2YgeCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHRoaXMueCA9IHgueDtcbiAgICAgICAgICAgIHRoaXMueSA9IHgueTtcbiAgICAgICAgICAgIHRoaXMueiA9IHguejtcbiAgICAgICAgICAgIHRoaXMudyA9IHgudztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMueCA9IHggYXMgbnVtYmVyIHx8IDA7XG4gICAgICAgICAgICB0aGlzLnkgPSB5IHx8IDA7XG4gICAgICAgICAgICB0aGlzLnogPSB6IHx8IDA7XG4gICAgICAgICAgICB0aGlzLncgPSB3IHx8IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBDaGVjayB3aGV0aGVyIHRoZSB2ZWN0b3IgZXF1YWxzIGFub3RoZXIgb25lXG4gICAgICogISN6aCDlvZPliY3nmoTlkJHph4/mmK/lkKbkuI7mjIflrprnmoTlkJHph4/nm7jnrYnjgIJcbiAgICAgKiBAbWV0aG9kIGVxdWFsc1xuICAgICAqIEBwYXJhbSB7VmVjNH0gb3RoZXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2Vwc2lsb25dXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBwdWJsaWMgZXF1YWxzIChvdGhlcjogVmVjNCwgZXBzaWxvbiA9IEVQU0lMT04pIHtcbiAgICAgICAgcmV0dXJuIChNYXRoLmFicyh0aGlzLnggLSBvdGhlci54KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyh0aGlzLngpLCBNYXRoLmFicyhvdGhlci54KSkgJiZcbiAgICAgICAgICAgIE1hdGguYWJzKHRoaXMueSAtIG90aGVyLnkpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMueSksIE1hdGguYWJzKG90aGVyLnkpKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnModGhpcy56IC0gb3RoZXIueikgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnModGhpcy56KSwgTWF0aC5hYnMob3RoZXIueikpICYmXG4gICAgICAgICAgICBNYXRoLmFicyh0aGlzLncgLSBvdGhlci53KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyh0aGlzLncpLCBNYXRoLmFicyhvdGhlci53KSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2hlY2sgd2hldGhlciB0aGUgdmVjdG9yIGVxdWFscyBhbm90aGVyIG9uZVxuICAgICAqICEjemgg5Yik5pat5b2T5YmN5ZCR6YeP5piv5ZCm5Zyo6K+v5beu6IyD5Zu05YaF5LiO5oyH5a6a5YiG6YeP55qE5ZCR6YeP55u4562J44CCXG4gICAgICogQG1ldGhvZCBlcXVhbHM0ZlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IOebuOavlOi+g+eahOWQkemHj+eahCB4IOWIhumHj+OAglxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IOebuOavlOi+g+eahOWQkemHj+eahCB5IOWIhumHj+OAglxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB6IOebuOavlOi+g+eahOWQkemHj+eahCB6IOWIhumHj+OAglxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3IOebuOavlOi+g+eahOWQkemHj+eahCB3IOWIhumHj+OAglxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbZXBzaWxvbl0g5YWB6K6455qE6K+v5beu77yM5bqU5Li66Z2e6LSf5pWw44CCXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59IOW9k+S4pOWQkemHj+eahOWQhOWIhumHj+mDveWcqOaMh+WumueahOivr+W3ruiMg+WbtOWGheWIhuWIq+ebuOetieaXtu+8jOi/lOWbniBgdHJ1ZWDvvJvlkKbliJnov5Tlm54gYGZhbHNlYOOAglxuICAgICAqL1xuICAgIHB1YmxpYyBlcXVhbHM0ZiAoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgdzogbnVtYmVyLCBlcHNpbG9uID0gRVBTSUxPTikge1xuICAgICAgICByZXR1cm4gKE1hdGguYWJzKHRoaXMueCAtIHgpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMueCksIE1hdGguYWJzKHgpKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnModGhpcy55IC0geSkgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnModGhpcy55KSwgTWF0aC5hYnMoeSkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyh0aGlzLnogLSB6KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyh0aGlzLnopLCBNYXRoLmFicyh6KSkgJiZcbiAgICAgICAgICAgIE1hdGguYWJzKHRoaXMudyAtIHcpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMudyksIE1hdGguYWJzKHcpKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBDaGVjayB3aGV0aGVyIHN0cmljdCBlcXVhbHMgb3RoZXIgVmVjNFxuICAgICAqICEjemgg5Yik5pat5b2T5YmN5ZCR6YeP5piv5ZCm5LiO5oyH5a6a5ZCR6YeP55u4562J44CCXG4gICAgICogQG1ldGhvZCBzdHJpY3RFcXVhbHNcbiAgICAgKiBAcGFyYW0gb3RoZXIg55u45q+U6L6D55qE5ZCR6YeP44CCXG4gICAgICogQHJldHVybnMg5Lik5ZCR6YeP55qE5ZCE5YiG6YeP6YO95YiG5Yir55u4562J5pe26L+U5ZueIGB0cnVlYO+8m+WQpuWImei/lOWbniBgZmFsc2Vg44CCXG4gICAgICovXG4gICAgcHVibGljIHN0cmljdEVxdWFscyAob3RoZXI6IFZlYzQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCA9PT0gb3RoZXIueCAmJiB0aGlzLnkgPT09IG90aGVyLnkgJiYgdGhpcy56ID09PSBvdGhlci56ICYmIHRoaXMudyA9PT0gb3RoZXIudztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENoZWNrIHdoZXRoZXIgc3RyaWN0IGVxdWFscyBvdGhlciBWZWM0XG4gICAgICogISN6aCDliKTmlq3lvZPliY3lkJHph4/mmK/lkKbkuI7mjIflrprliIbph4/nmoTlkJHph4/nm7jnrYnjgIJcbiAgICAgKiBAbWV0aG9kIHN0cmljdEVxdWFsczRmXG4gICAgICogQHBhcmFtIHgg5oyH5a6a5ZCR6YeP55qEIHgg5YiG6YeP44CCXG4gICAgICogQHBhcmFtIHkg5oyH5a6a5ZCR6YeP55qEIHkg5YiG6YeP44CCXG4gICAgICogQHBhcmFtIHog5oyH5a6a5ZCR6YeP55qEIHog5YiG6YeP44CCXG4gICAgICogQHBhcmFtIHcg5oyH5a6a5ZCR6YeP55qEIHcg5YiG6YeP44CCXG4gICAgICogQHJldHVybnMg5Lik5ZCR6YeP55qE5ZCE5YiG6YeP6YO95YiG5Yir55u4562J5pe26L+U5ZueIGB0cnVlYO+8m+WQpuWImei/lOWbniBgZmFsc2Vg44CCXG4gICAgICovXG4gICAgcHVibGljIHN0cmljdEVxdWFsczRmICh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB3OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCA9PT0geCAmJiB0aGlzLnkgPT09IHkgJiYgdGhpcy56ID09PSB6ICYmIHRoaXMudyA9PT0gdztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENhbGN1bGF0ZSBsaW5lYXIgaW50ZXJwb2xhdGlvbiByZXN1bHQgYmV0d2VlbiB0aGlzIHZlY3RvciBhbmQgYW5vdGhlciBvbmUgd2l0aCBnaXZlbiByYXRpb1xuICAgICAqICEjemgg5qC55o2u5oyH5a6a55qE5o+S5YC85q+U546H77yM5LuO5b2T5YmN5ZCR6YeP5Yiw55uu5qCH5ZCR6YeP5LmL6Ze05YGa5o+S5YC844CCXG4gICAgICogQG1ldGhvZCBsZXJwXG4gICAgICogQHBhcmFtIHtWZWM0fSB0byDnm67moIflkJHph4/jgIJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmF0aW8g5o+S5YC85q+U546H77yM6IyD5Zu05Li6IFswLDFd44CCXG4gICAgICogQHJldHVybnMge1ZlYzR9XG4gICAgICovXG4gICAgcHVibGljIGxlcnAgKHRvOiBWZWM0LCByYXRpbzogbnVtYmVyKSB7XG4gICAgICAgIF94ID0gdGhpcy54O1xuICAgICAgICBfeSA9IHRoaXMueTtcbiAgICAgICAgX3ogPSB0aGlzLno7XG4gICAgICAgIF93ID0gdGhpcy53O1xuICAgICAgICB0aGlzLnggPSBfeCArIHJhdGlvICogKHRvLnggLSBfeCk7XG4gICAgICAgIHRoaXMueSA9IF95ICsgcmF0aW8gKiAodG8ueSAtIF95KTtcbiAgICAgICAgdGhpcy56ID0gX3ogKyByYXRpbyAqICh0by56IC0gX3opO1xuICAgICAgICB0aGlzLncgPSBfdyArIHJhdGlvICogKHRvLncgLSBfdyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gVHJhbnNmb3JtIHRvIHN0cmluZyB3aXRoIHZlY3RvciBpbmZvcm1hdGlvbnNcbiAgICAgKiAhI3poIOi/lOWbnuW9k+WJjeWQkemHj+eahOWtl+espuS4suihqOekuuOAglxuICAgICAqIEBtZXRob2QgdG9TdHJpbmdcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSDlvZPliY3lkJHph4/nmoTlrZfnrKbkuLLooajnpLrjgIJcbiAgICAgKi9cbiAgICBwdWJsaWMgdG9TdHJpbmcgKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBgKCR7dGhpcy54LnRvRml4ZWQoMil9LCAke3RoaXMueS50b0ZpeGVkKDIpfSwgJHt0aGlzLnoudG9GaXhlZCgyKX0sICR7dGhpcy53LnRvRml4ZWQoMil9KWA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBDbGFtcCB0aGUgdmVjdG9yIGJldHdlZW4gbWluSW5jbHVzaXZlIGFuZCBtYXhJbmNsdXNpdmUuXG4gICAgICogISN6aCDorr7nva7lvZPliY3lkJHph4/nmoTlgLzvvIzkvb/lhbblkITkuKrliIbph4/pg73lpITkuo7mjIflrprnmoTojIPlm7TlhoXjgIJcbiAgICAgKiBAbWV0aG9kIGNsYW1wZlxuICAgICAqIEBwYXJhbSB7VmVjNH0gbWluSW5jbHVzaXZlIOavj+S4quWIhumHj+mDveS7o+ihqOS6huWvueW6lOWIhumHj+WFgeiuuOeahOacgOWwj+WAvOOAglxuICAgICAqIEBwYXJhbSB7VmVjNH0gbWF4SW5jbHVzaXZlIOavj+S4quWIhumHj+mDveS7o+ihqOS6huWvueW6lOWIhumHj+WFgeiuuOeahOacgOWkp+WAvOOAglxuICAgICAqIEByZXR1cm5zIHtWZWM0fVxuICAgICAqL1xuICAgIHB1YmxpYyBjbGFtcGYgKG1pbkluY2x1c2l2ZTogVmVjNCwgbWF4SW5jbHVzaXZlOiBWZWM0KSB7XG4gICAgICAgIHRoaXMueCA9IGNsYW1wKHRoaXMueCwgbWluSW5jbHVzaXZlLngsIG1heEluY2x1c2l2ZS54KTtcbiAgICAgICAgdGhpcy55ID0gY2xhbXAodGhpcy55LCBtaW5JbmNsdXNpdmUueSwgbWF4SW5jbHVzaXZlLnkpO1xuICAgICAgICB0aGlzLnogPSBjbGFtcCh0aGlzLnosIG1pbkluY2x1c2l2ZS56LCBtYXhJbmNsdXNpdmUueik7XG4gICAgICAgIHRoaXMudyA9IGNsYW1wKHRoaXMudywgbWluSW5jbHVzaXZlLncsIG1heEluY2x1c2l2ZS53KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBBZGRzIHRoaXMgdmVjdG9yLiBJZiB5b3Ugd2FudCB0byBzYXZlIHJlc3VsdCB0byBhbm90aGVyIHZlY3RvciwgdXNlIGFkZCgpIGluc3RlYWQuXG4gICAgICogISN6aCDlkJHph4/liqDms5XjgILlpoLmnpzkvaDmg7Pkv53lrZjnu5PmnpzliLDlj6bkuIDkuKrlkJHph4/vvIzkvb/nlKggYWRkKCkg5Luj5pu/44CCXG4gICAgICogQG1ldGhvZCBhZGRTZWxmXG4gICAgICogQHBhcmFtIHtWZWM0fSB2ZWN0b3JcbiAgICAgKiBAcmV0dXJuIHtWZWM0fSByZXR1cm5zIHRoaXNcbiAgICAgKiBAY2hhaW5hYmxlXG4gICAgICovXG4gICAgYWRkU2VsZiAodmVjdG9yOiBWZWM0KTogdGhpcyB7XG4gICAgICAgIHRoaXMueCArPSB2ZWN0b3IueDtcbiAgICAgICAgdGhpcy55ICs9IHZlY3Rvci55O1xuICAgICAgICB0aGlzLnogKz0gdmVjdG9yLno7XG4gICAgICAgIHRoaXMudyArPSB2ZWN0b3IudztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBBZGRzIHR3byB2ZWN0b3JzLCBhbmQgcmV0dXJucyB0aGUgbmV3IHJlc3VsdC5cbiAgICAgKiAhI3poIOWQkemHj+WKoOazle+8jOW5tui/lOWbnuaWsOe7k+aenOOAglxuICAgICAqIEBtZXRob2QgYWRkXG4gICAgICogQHBhcmFtIHtWZWM0fSB2ZWN0b3JcbiAgICAgKiBAcGFyYW0ge1ZlYzR9IFtvdXRdIC0gb3B0aW9uYWwsIHRoZSByZWNlaXZpbmcgdmVjdG9yLCB5b3UgY2FuIHBhc3MgdGhlIHNhbWUgdmVjNCB0byBzYXZlIHJlc3VsdCB0byBpdHNlbGYsIGlmIG5vdCBwcm92aWRlZCwgYSBuZXcgdmVjNCB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgKiBAcmV0dXJuIHtWZWM0fSB0aGUgcmVzdWx0XG4gICAgICovXG4gICAgYWRkICh2ZWN0b3I6IFZlYzQsIG91dD86IFZlYzQpOiBWZWM0IHtcbiAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBWZWM0KCk7XG4gICAgICAgIG91dC54ID0gdGhpcy54ICsgdmVjdG9yLng7XG4gICAgICAgIG91dC55ID0gdGhpcy55ICsgdmVjdG9yLnk7XG4gICAgICAgIG91dC56ID0gdGhpcy56ICsgdmVjdG9yLno7XG4gICAgICAgIG91dC53ID0gdGhpcy53ICsgdmVjdG9yLnc7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBTdWJ0cmFjdHMgb25lIHZlY3RvciBmcm9tIHRoaXMsIGFuZCByZXR1cm5zIHRoZSBuZXcgcmVzdWx0LlxuICAgICAqICEjemgg5ZCR6YeP5YeP5rOV77yM5bm26L+U5Zue5paw57uT5p6c44CCXG4gICAgICogQG1ldGhvZCBzdWJ0cmFjdFxuICAgICAqIEBwYXJhbSB7VmVjNH0gdmVjdG9yXG4gICAgICogQHBhcmFtIHtWZWM0fSBbb3V0XSAtIG9wdGlvbmFsLCB0aGUgcmVjZWl2aW5nIHZlY3RvciwgeW91IGNhbiBwYXNzIHRoZSBzYW1lIHZlYzQgdG8gc2F2ZSByZXN1bHQgdG8gaXRzZWxmLCBpZiBub3QgcHJvdmlkZWQsIGEgbmV3IHZlYzQgd2lsbCBiZSBjcmVhdGVkXG4gICAgICogQHJldHVybiB7VmVjNH0gdGhlIHJlc3VsdFxuICAgICAqL1xuICAgIHN1YnRyYWN0ICh2ZWN0b3I6IFZlYzQsIG91dD86IFZlYzQpOiBWZWM0IHtcbiAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBWZWM0KCk7XG4gICAgICAgIG91dC54ID0gdGhpcy54IC0gdmVjdG9yLng7XG4gICAgICAgIG91dC55ID0gdGhpcy55IC0gdmVjdG9yLnk7XG4gICAgICAgIG91dC56ID0gdGhpcy56IC0gdmVjdG9yLno7XG4gICAgICAgIG91dC53ID0gdGhpcy53IC0gdmVjdG9yLnc7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBNdWx0aXBsaWVzIHRoaXMgYnkgYSBudW1iZXIuXG4gICAgICogISN6aCDnvKnmlL7lvZPliY3lkJHph4/jgIJcbiAgICAgKiBAbWV0aG9kIG11bHRpcGx5U2NhbGFyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bVxuICAgICAqIEByZXR1cm4ge1ZlYzR9IHJldHVybnMgdGhpc1xuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKi9cbiAgICBtdWx0aXBseVNjYWxhciAobnVtOiBudW1iZXIpOiB0aGlzIHtcbiAgICAgICAgdGhpcy54ICo9IG51bTtcbiAgICAgICAgdGhpcy55ICo9IG51bTtcbiAgICAgICAgdGhpcy56ICo9IG51bTtcbiAgICAgICAgdGhpcy53ICo9IG51bTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBNdWx0aXBsaWVzIHR3byB2ZWN0b3JzLlxuICAgICAqICEjemgg5YiG6YeP55u45LmY44CCXG4gICAgICogQG1ldGhvZCBtdWx0aXBseVxuICAgICAqIEBwYXJhbSB7VmVjNH0gdmVjdG9yXG4gICAgICogQHJldHVybiB7VmVjNH0gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqL1xuICAgIG11bHRpcGx5ICh2ZWN0b3I6IFZlYzQpOiB0aGlzIHtcbiAgICAgICAgdGhpcy54ICo9IHZlY3Rvci54O1xuICAgICAgICB0aGlzLnkgKj0gdmVjdG9yLnk7XG4gICAgICAgIHRoaXMueiAqPSB2ZWN0b3IuejtcbiAgICAgICAgdGhpcy53ICo9IHZlY3Rvci53O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIERpdmlkZXMgYnkgYSBudW1iZXIuXG4gICAgICogISN6aCDlkJHph4/pmaTms5XjgIJcbiAgICAgKiBAbWV0aG9kIGRpdmlkZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1cbiAgICAgKiBAcmV0dXJuIHtWZWM0fSByZXR1cm5zIHRoaXNcbiAgICAgKiBAY2hhaW5hYmxlXG4gICAgICovXG4gICAgZGl2aWRlIChudW06IG51bWJlcik6IHRoaXMge1xuICAgICAgICB0aGlzLnggLz0gbnVtO1xuICAgICAgICB0aGlzLnkgLz0gbnVtO1xuICAgICAgICB0aGlzLnogLz0gbnVtO1xuICAgICAgICB0aGlzLncgLz0gbnVtO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIE5lZ2F0ZXMgdGhlIGNvbXBvbmVudHMuXG4gICAgICogISN6aCDlkJHph4/lj5blj41cbiAgICAgKiBAbWV0aG9kIG5lZ2F0ZVxuICAgICAqIEByZXR1cm4ge1ZlYzR9IHJldHVybnMgdGhpc1xuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKi9cbiAgICBuZWdhdGUgKCk6IHRoaXMge1xuICAgICAgICB0aGlzLnggPSAtdGhpcy54O1xuICAgICAgICB0aGlzLnkgPSAtdGhpcy55O1xuICAgICAgICB0aGlzLnogPSAtdGhpcy56O1xuICAgICAgICB0aGlzLncgPSAtdGhpcy53O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIERvdCBwcm9kdWN0XG4gICAgICogISN6aCDlvZPliY3lkJHph4/kuI7mjIflrprlkJHph4/ov5vooYzngrnkuZjjgIJcbiAgICAgKiBAbWV0aG9kIGRvdFxuICAgICAqIEBwYXJhbSB7VmVjNH0gW3ZlY3Rvcl1cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSByZXN1bHRcbiAgICAgKi9cbiAgICBkb3QgKHZlY3RvcjogVmVjNCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnggKiB2ZWN0b3IueCArIHRoaXMueSAqIHZlY3Rvci55ICsgdGhpcy56ICogdmVjdG9yLnogKyB0aGlzLncgKiB2ZWN0b3IudztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENyb3NzIHByb2R1Y3RcbiAgICAgKiAhI3poIOW9k+WJjeWQkemHj+S4juaMh+WumuWQkemHj+i/m+ihjOWPieS5mOOAglxuICAgICAqIEBtZXRob2QgY3Jvc3NcbiAgICAgKiBAcGFyYW0ge1ZlYzR9IHZlY3RvclxuICAgICAqIEBwYXJhbSB7VmVjNH0gW291dF1cbiAgICAgKiBAcmV0dXJuIHtWZWM0fSB0aGUgcmVzdWx0XG4gICAgICovXG4gICAgY3Jvc3MgKHZlY3RvcjogVmVjNCwgb3V0PzogVmVjNCk6IFZlYzQge1xuICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IFZlYzQoKTtcbiAgICAgICAgY29uc3QgeyB4OiBheCwgeTogYXksIHo6IGF6IH0gPSB0aGlzO1xuICAgICAgICBjb25zdCB7IHg6IGJ4LCB5OiBieSwgejogYnogfSA9IHZlY3RvcjtcblxuICAgICAgICBvdXQueCA9IGF5ICogYnogLSBheiAqIGJ5O1xuICAgICAgICBvdXQueSA9IGF6ICogYnggLSBheCAqIGJ6O1xuICAgICAgICBvdXQueiA9IGF4ICogYnkgLSBheSAqIGJ4O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB0aGUgbGVuZ3RoIG9mIHRoaXMgdmVjdG9yLlxuICAgICAqICEjemgg6L+U5Zue6K+l5ZCR6YeP55qE6ZW/5bqm44CCXG4gICAgICogQG1ldGhvZCBsZW5cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSByZXN1bHRcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciB2ID0gY2MudjQoMTAsIDEwKTtcbiAgICAgKiB2LmxlbigpOyAvLyByZXR1cm4gMTQuMTQyMTM1NjIzNzMwOTUxO1xuICAgICAqL1xuICAgIGxlbiAoKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IHggPSB0aGlzLngsXG4gICAgICAgICAgeSA9IHRoaXMueSxcbiAgICAgICAgICB6ID0gdGhpcy56LFxuICAgICAgICAgIHcgPSB0aGlzLnc7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6ICsgdyAqIHcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB0aGUgc3F1YXJlZCBsZW5ndGggb2YgdGhpcyB2ZWN0b3IuXG4gICAgICogISN6aCDov5Tlm57or6XlkJHph4/nmoTplb/luqblubPmlrnjgIJcbiAgICAgKiBAbWV0aG9kIGxlbmd0aFNxclxuICAgICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHJlc3VsdFxuICAgICAqL1xuICAgIGxlbmd0aFNxciAoKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IHggPSB0aGlzLngsXG4gICAgICAgICAgeSA9IHRoaXMueSxcbiAgICAgICAgICB6ID0gdGhpcy56LFxuICAgICAgICAgIHcgPSB0aGlzLnc7XG4gICAgICAgIHJldHVybiB4ICogeCArIHkgKiB5ICsgeiAqIHogKyB3ICogdztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIE1ha2UgdGhlIGxlbmd0aCBvZiB0aGlzIHZlY3RvciB0byAxLlxuICAgICAqICEjemgg5ZCR6YeP5b2S5LiA5YyW77yM6K6p6L+Z5Liq5ZCR6YeP55qE6ZW/5bqm5Li6IDHjgIJcbiAgICAgKiBAbWV0aG9kIG5vcm1hbGl6ZVNlbGZcbiAgICAgKiBAcmV0dXJuIHtWZWM0fSByZXR1cm5zIHRoaXNcbiAgICAgKiBAY2hhaW5hYmxlXG4gICAgICovXG4gICAgbm9ybWFsaXplU2VsZiAoKSB7XG4gICAgICAgIHRoaXMubm9ybWFsaXplKHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmV0dXJucyB0aGlzIHZlY3RvciB3aXRoIGEgbWFnbml0dWRlIG9mIDEuPGJyLz5cbiAgICAgKiA8YnIvPlxuICAgICAqIE5vdGUgdGhhdCB0aGUgY3VycmVudCB2ZWN0b3IgaXMgdW5jaGFuZ2VkIGFuZCBhIG5ldyBub3JtYWxpemVkIHZlY3RvciBpcyByZXR1cm5lZC4gSWYgeW91IHdhbnQgdG8gbm9ybWFsaXplIHRoZSBjdXJyZW50IHZlY3RvciwgdXNlIG5vcm1hbGl6ZVNlbGYgZnVuY3Rpb24uXG4gICAgICogISN6aFxuICAgICAqIOi/lOWbnuW9kuS4gOWMluWQjueahOWQkemHj+OAgjxici8+XG4gICAgICogPGJyLz5cbiAgICAgKiDms6jmhI/vvIzlvZPliY3lkJHph4/kuI3lj5jvvIzlubbov5Tlm57kuIDkuKrmlrDnmoTlvZLkuIDljJblkJHph4/jgILlpoLmnpzkvaDmg7PmnaXlvZLkuIDljJblvZPliY3lkJHph4/vvIzlj6/kvb/nlKggbm9ybWFsaXplU2VsZiDlh73mlbDjgIJcbiAgICAgKiBAbWV0aG9kIG5vcm1hbGl6ZVxuICAgICAqIEBwYXJhbSB7VmVjNH0gW291dF0gLSBvcHRpb25hbCwgdGhlIHJlY2VpdmluZyB2ZWN0b3IsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSB2ZWM0IHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyB2ZWM0IHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm4ge1ZlYzR9IHJlc3VsdFxuICAgICAqL1xuICAgIG5vcm1hbGl6ZSAob3V0PzogVmVjNCk6IFZlYzQge1xuICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IFZlYzQoKTtcbiAgICAgICAgX3ggPSB0aGlzLng7XG4gICAgICAgIF95ID0gdGhpcy55O1xuICAgICAgICBfeiA9IHRoaXMuejtcbiAgICAgICAgX3cgPSB0aGlzLnc7XG4gICAgICAgIGxldCBsZW4gPSBfeCAqIF94ICsgX3kgKiBfeSArIF96ICogX3ogKyBfdyAqIF93O1xuICAgICAgICBpZiAobGVuID4gMCkge1xuICAgICAgICAgICAgbGVuID0gMSAvIE1hdGguc3FydChsZW4pO1xuICAgICAgICAgICAgb3V0LnggPSBfeCAqIGxlbjtcbiAgICAgICAgICAgIG91dC55ID0gX3kgKiBsZW47XG4gICAgICAgICAgICBvdXQueiA9IF96ICogbGVuO1xuICAgICAgICAgICAgb3V0LncgPSBfdyAqIGxlbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyYW5zZm9ybXMgdGhlIHZlYzQgd2l0aCBhIG1hdDQuIDR0aCB2ZWN0b3IgY29tcG9uZW50IGlzIGltcGxpY2l0bHkgJzEnXG4gICAgICogQG1ldGhvZCB0cmFuc2Zvcm1NYXQ0XG4gICAgICogQHBhcmFtIHtNYXQ0fSBtIG1hdHJpeCB0byB0cmFuc2Zvcm0gd2l0aFxuICAgICAqIEBwYXJhbSB7VmVjNH0gW291dF0gdGhlIHJlY2VpdmluZyB2ZWN0b3IsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSB2ZWM0IHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyB2ZWM0IHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm5zIHtWZWM0fSBvdXRcbiAgICAgKi9cbiAgICB0cmFuc2Zvcm1NYXQ0IChtYXRyaXg6IE1hdDQsIG91dDogVmVjNCk6IFZlYzQge1xuICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IFZlYzQoKTtcbiAgICAgICAgX3ggPSB0aGlzLng7XG4gICAgICAgIF95ID0gdGhpcy55O1xuICAgICAgICBfeiA9IHRoaXMuejtcbiAgICAgICAgX3cgPSB0aGlzLnc7XG4gICAgICAgIGxldCBtID0gbWF0cml4Lm07XG4gICAgICAgIG91dC54ID0gbVswXSAqIF94ICsgbVs0XSAqIF95ICsgbVs4XSAgKiBfeiArIG1bMTJdICogX3c7XG4gICAgICAgIG91dC55ID0gbVsxXSAqIF94ICsgbVs1XSAqIF95ICsgbVs5XSAgKiBfeiArIG1bMTNdICogX3c7XG4gICAgICAgIG91dC56ID0gbVsyXSAqIF94ICsgbVs2XSAqIF95ICsgbVsxMF0gKiBfeiArIG1bMTRdICogX3c7XG4gICAgICAgIG91dC53ID0gbVszXSAqIF94ICsgbVs3XSAqIF95ICsgbVsxMV0gKiBfeiArIG1bMTVdICogX3c7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbWF4aW11bSB2YWx1ZSBpbiB4LCB5LCB6LCB3LlxuICAgICAqIEBtZXRob2QgbWF4QXhpc1xuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgbWF4QXhpcyAoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KHRoaXMueCwgdGhpcy55LCB0aGlzLnosIHRoaXMudyk7XG4gICAgfVxufVxuXG5DQ0NsYXNzLmZhc3REZWZpbmUoJ2NjLlZlYzQnLCBWZWM0LCB7IHg6IDAsIHk6IDAsIHo6IDAsIHc6IDAgfSk7XG5cbmV4cG9ydCBmdW5jdGlvbiB2NCAob3RoZXI6IFZlYzQpOiBWZWM0O1xuZXhwb3J0IGZ1bmN0aW9uIHY0ICh4PzogbnVtYmVyLCB5PzogbnVtYmVyLCB6PzogbnVtYmVyLCB3PzogbnVtYmVyKTogVmVjNDtcblxuZXhwb3J0IGZ1bmN0aW9uIHY0ICh4PzogbnVtYmVyIHwgVmVjNCwgeT86IG51bWJlciwgej86IG51bWJlciwgdz86IG51bWJlcikge1xuICAgIHJldHVybiBuZXcgVmVjNCh4IGFzIGFueSwgeSwgeiwgdyk7XG59XG5cbmNjLnY0ID0gdjQ7XG5jYy5WZWM0ID0gVmVjNDtcbiJdfQ==