
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/value-types/vec3.js';
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

var _vec = _interopRequireDefault(require("./vec2"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _x = 0.0;
var _y = 0.0;
var _z = 0.0;
/**
 * !#en Representation of 3D vectors and points.
 * !#zh 表示 3D 向量和坐标
 *
 * @class Vec3
 * @extends ValueType
 */

var Vec3 =
/*#__PURE__*/
function (_ValueType) {
  _inheritsLoose(Vec3, _ValueType);

  var _proto = Vec3.prototype;

  // deprecated
  _proto.sub = function sub(vector, out) {
    return Vec3.subtract(out || new Vec3(), this, vector);
  };

  _proto.mul = function mul(num, out) {
    return Vec3.multiplyScalar(out || new Vec3(), this, num);
  };

  _proto.div = function div(vector, out) {
    return Vec3.divide(out || new Vec3(), this, vector);
  };

  _proto.scale = function scale(vector, out) {
    return Vec3.multiply(out || new Vec3(), this, vector);
  };

  _proto.neg = function neg(out) {
    return Vec3.negate(out || new Vec3(), this);
  }
  /**
   * !#en return a Vec3 object with x = 1, y = 1, z = 1.
   * !#zh 新 Vec3 对象。
   * @property ONE
   * @type Vec3
   * @static
   */
  ;

  /**
   * !#zh 将目标赋值为零向量
   * !#en The target of an assignment zero vector
   * @method zero
   * @typescript
   * static zero<Out extends IVec3Like> (out: Out)
   * @static
   */
  Vec3.zero = function zero(out) {
    out.x = 0;
    out.y = 0;
    out.z = 0;
    return out;
  }
  /**
   * !#zh 获得指定向量的拷贝
   * !#en Obtaining copy vectors designated
   * @method clone
   * @typescript
   * static clone<Out extends IVec3Like> (a: Out)
   * @static
   */
  ;

  Vec3.clone = function clone(a) {
    return new Vec3(a.x, a.y, a.z);
  }
  /**
   * !#zh 复制目标向量
   * !#en Copy the target vector
   * @method copy
   * @typescript
   * static copy<Out extends IVec3Like, Vec3Like extends IVec3Like> (out: Out, a: Vec3Like)
   * @static
   */
  ;

  Vec3.copy = function copy(out, a) {
    out.x = a.x;
    out.y = a.y;
    out.z = a.z;
    return out;
  }
  /**
   * !#zh 设置向量值
   * !#en Set to value
   * @method set
   * @typescript
   * static set<Out extends IVec3Like> (out: Out, x: number, y: number, z: number)
   * @static
   */
  ;

  Vec3.set = function set(out, x, y, z) {
    out.x = x;
    out.y = y;
    out.z = z;
    return out;
  }
  /**
   * !#zh 逐元素向量加法
   * !#en Element-wise vector addition
   * @method add
   * @typescript
   * static add<Out extends IVec3Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Vec3.add = function add(out, a, b) {
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    out.z = a.z + b.z;
    return out;
  }
  /**
   * !#zh 逐元素向量减法
   * !#en Element-wise vector subtraction
   * @method subtract
   * @typescript
   * static subtract<Out extends IVec3Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Vec3.subtract = function subtract(out, a, b) {
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    out.z = a.z - b.z;
    return out;
  }
  /**
   * !#zh 逐元素向量乘法 (分量积)
   * !#en Element-wise vector multiplication (product component)
   * @method multiply
   * @typescript
   * static multiply<Out extends IVec3Like, Vec3Like_1 extends IVec3Like, Vec3Like_2 extends IVec3Like> (out: Out, a: Vec3Like_1, b: Vec3Like_2)
   * @static
   */
  ;

  Vec3.multiply = function multiply(out, a, b) {
    out.x = a.x * b.x;
    out.y = a.y * b.y;
    out.z = a.z * b.z;
    return out;
  }
  /**
   * !#zh 逐元素向量除法
   * !#en Element-wise vector division
   * @method divide
   * @typescript
   * static divide<Out extends IVec3Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Vec3.divide = function divide(out, a, b) {
    out.x = a.x / b.x;
    out.y = a.y / b.y;
    out.z = a.z / b.z;
    return out;
  }
  /**
   * !#zh 逐元素向量向上取整
   * !#en Rounding up by elements of the vector
   * @method ceil
   * @typescript
   * static ceil<Out extends IVec3Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec3.ceil = function ceil(out, a) {
    out.x = Math.ceil(a.x);
    out.y = Math.ceil(a.y);
    out.z = Math.ceil(a.z);
    return out;
  }
  /**
   * !#zh 逐元素向量向下取整
   * !#en Element vector by rounding down
   * @method floor
   * @typescript
   * static floor<Out extends IVec3Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec3.floor = function floor(out, a) {
    out.x = Math.floor(a.x);
    out.y = Math.floor(a.y);
    out.z = Math.floor(a.z);
    return out;
  }
  /**
   * !#zh 逐元素向量最小值
   * !#en The minimum by-element vector
   * @method min
   * @typescript
   * static min<Out extends IVec3Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Vec3.min = function min(out, a, b) {
    out.x = Math.min(a.x, b.x);
    out.y = Math.min(a.y, b.y);
    out.z = Math.min(a.z, b.z);
    return out;
  }
  /**
   * !#zh 逐元素向量最大值
   * !#en The maximum value of the element-wise vector
   * @method max
   * @typescript
   * static max<Out extends IVec3Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Vec3.max = function max(out, a, b) {
    out.x = Math.max(a.x, b.x);
    out.y = Math.max(a.y, b.y);
    out.z = Math.max(a.z, b.z);
    return out;
  }
  /**
   * !#zh 逐元素向量四舍五入取整
   * !#en Element-wise vector of rounding to whole
   * @method round
   * @typescript
   * static round<Out extends IVec3Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec3.round = function round(out, a) {
    out.x = Math.round(a.x);
    out.y = Math.round(a.y);
    out.z = Math.round(a.z);
    return out;
  }
  /**
   * !#zh 向量标量乘法
   * !#en Vector scalar multiplication
   * @method multiplyScalar
   * @typescript
   * static multiplyScalar<Out extends IVec3Like, Vec3Like extends IVec3Like> (out: Out, a: Vec3Like, b: number)
   * @static
   */
  ;

  Vec3.multiplyScalar = function multiplyScalar(out, a, b) {
    out.x = a.x * b;
    out.y = a.y * b;
    out.z = a.z * b;
    return out;
  }
  /**
   * !#zh 逐元素向量乘加: A + B * scale
   * !#en Element-wise vector multiply add: A + B * scale
   * @method scaleAndAdd
   * @typescript
   * static scaleAndAdd<Out extends IVec3Like> (out: Out, a: Out, b: Out, scale: number)
   * @static
   */
  ;

  Vec3.scaleAndAdd = function scaleAndAdd(out, a, b, scale) {
    out.x = a.x + b.x * scale;
    out.y = a.y + b.y * scale;
    out.z = a.z + b.z * scale;
    return out;
  }
  /**
   * !#zh 求两向量的欧氏距离
   * !#en Seeking two vectors Euclidean distance
   * @method distance
   * @typescript
   * static distance<Out extends IVec3Like> (a: Out, b: Out)
   * @static
   */
  ;

  Vec3.distance = function distance(a, b) {
    _x = b.x - a.x;
    _y = b.y - a.y;
    _z = b.z - a.z;
    return Math.sqrt(_x * _x + _y * _y + _z * _z);
  }
  /**
   * !#zh 求两向量的欧氏距离平方
   * !#en Euclidean distance squared seeking two vectors
   * @method squaredDistance
   * @typescript
   * static squaredDistance<Out extends IVec3Like> (a: Out, b: Out)
   * @static
   */
  ;

  Vec3.squaredDistance = function squaredDistance(a, b) {
    _x = b.x - a.x;
    _y = b.y - a.y;
    _z = b.z - a.z;
    return _x * _x + _y * _y + _z * _z;
  }
  /**
   * !#zh 求向量长度
   * !#en Seeking vector length
   * @method len
   * @typescript
   * static len<Out extends IVec3Like> (a: Out)
   * @static
   */
  ;

  Vec3.len = function len(a) {
    _x = a.x;
    _y = a.y;
    _z = a.z;
    return Math.sqrt(_x * _x + _y * _y + _z * _z);
  }
  /**
   * !#zh 求向量长度平方
   * !#en Seeking squared vector length
   * @method lengthSqr
   * @typescript
   * static lengthSqr<Out extends IVec3Like> (a: Out)
   * @static
   */
  ;

  Vec3.lengthSqr = function lengthSqr(a) {
    _x = a.x;
    _y = a.y;
    _z = a.z;
    return _x * _x + _y * _y + _z * _z;
  }
  /**
   * !#zh 逐元素向量取负
   * !#en By taking the negative elements of the vector
   * @method negate
   * @typescript
   * static negate<Out extends IVec3Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec3.negate = function negate(out, a) {
    out.x = -a.x;
    out.y = -a.y;
    out.z = -a.z;
    return out;
  }
  /**
   * !#zh 逐元素向量取倒数，接近 0 时返回 Infinity
   * !#en Element vector by taking the inverse, return near 0 Infinity
   * @method inverse
   * @typescript
   * static inverse<Out extends IVec3Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec3.inverse = function inverse(out, a) {
    out.x = 1.0 / a.x;
    out.y = 1.0 / a.y;
    out.z = 1.0 / a.z;
    return out;
  }
  /**
   * !#zh 逐元素向量取倒数，接近 0 时返回 0
   * !#en Element vector by taking the inverse, return near 0 0
   * @method inverseSafe
   * @typescript
   * static inverseSafe<Out extends IVec3Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec3.inverseSafe = function inverseSafe(out, a) {
    _x = a.x;
    _y = a.y;
    _z = a.z;

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

    return out;
  }
  /**
   * !#zh 归一化向量
   * !#en Normalized vector
   * @method normalize
   * @typescript
   * static normalize<Out extends IVec3Like, Vec3Like extends IVec3Like> (out: Out, a: Vec3Like)
   * @static
   */
  ;

  Vec3.normalize = function normalize(out, a) {
    _x = a.x;
    _y = a.y;
    _z = a.z;
    var len = _x * _x + _y * _y + _z * _z;

    if (len > 0) {
      len = 1 / Math.sqrt(len);
      out.x = _x * len;
      out.y = _y * len;
      out.z = _z * len;
    }

    return out;
  }
  /**
   * !#zh 向量点积（数量积）
   * !#en Vector dot product (scalar product)
   * @method dot
   * @typescript
   * static dot<Out extends IVec3Like> (a: Out, b: Out)
   * @static
   */
  ;

  Vec3.dot = function dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }
  /**
   * !#zh 向量叉积（向量积）
   * !#en Vector cross product (vector product)
   * @method cross
   * @typescript
   * static cross<Out extends IVec3Like, Vec3Like_1 extends IVec3Like, Vec3Like_2 extends IVec3Like> (out: Out, a: Vec3Like_1, b: Vec3Like_2)
   * @static
   */
  ;

  Vec3.cross = function cross(out, a, b) {
    var ax = a.x,
        ay = a.y,
        az = a.z;
    var bx = b.x,
        by = b.y,
        bz = b.z;
    out.x = ay * bz - az * by;
    out.y = az * bx - ax * bz;
    out.z = ax * by - ay * bx;
    return out;
  }
  /**
   * !#zh 逐元素向量线性插值： A + t * (B - A)
   * !#en Vector element by element linear interpolation: A + t * (B - A)
   * @method lerp
   * @typescript
   * static lerp<Out extends IVec3Like> (out: Out, a: Out, b: Out, t: number)
   * @static
   */
  ;

  Vec3.lerp = function lerp(out, a, b, t) {
    out.x = a.x + t * (b.x - a.x);
    out.y = a.y + t * (b.y - a.y);
    out.z = a.z + t * (b.z - a.z);
    return out;
  }
  /**
   * !#zh 生成一个在单位球体上均匀分布的随机向量
   * !#en Generates a uniformly distributed random vectors on the unit sphere
   * @method random
   * @typescript
   * static random<Out extends IVec3Like> (out: Out, scale?: number)
   * @param scale 生成的向量长度
   * @static
   */
  ;

  Vec3.random = function random(out, scale) {
    scale = scale || 1.0;
    var phi = (0, _utils.random)() * 2.0 * Math.PI;
    var cosTheta = (0, _utils.random)() * 2 - 1;
    var sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
    out.x = sinTheta * Math.cos(phi) * scale;
    out.y = sinTheta * Math.sin(phi) * scale;
    out.z = cosTheta * scale;
    return out;
  }
  /**
   * !#zh 向量与四维矩阵乘法，默认向量第四位为 1。
   * !#en Four-dimensional vector and matrix multiplication, the default vectors fourth one.
   * @method transformMat4
   * @typescript
   * static transformMat4<Out extends IVec3Like, Vec3Like extends IVec3Like, MatLike extends IMat4Like> (out: Out, a: Vec3Like, mat: MatLike)
   * @static
   */
  ;

  Vec3.transformMat4 = function transformMat4(out, a, mat) {
    _x = a.x;
    _y = a.y;
    _z = a.z;
    var m = mat.m;
    var rhw = m[3] * _x + m[7] * _y + m[11] * _z + m[15];
    rhw = rhw ? 1 / rhw : 1;
    out.x = (m[0] * _x + m[4] * _y + m[8] * _z + m[12]) * rhw;
    out.y = (m[1] * _x + m[5] * _y + m[9] * _z + m[13]) * rhw;
    out.z = (m[2] * _x + m[6] * _y + m[10] * _z + m[14]) * rhw;
    return out;
  }
  /**
   * !#zh 向量与四维矩阵乘法，默认向量第四位为 0。
   * !#en Four-dimensional vector and matrix multiplication, vector fourth default is 0.
   * @method transformMat4Normal
   * @typescript
   * static transformMat4Normal<Out extends IVec3Like, MatLike extends IMat4Like> (out: Out, a: Out, mat: MatLike)
   * @static
   */
  ;

  Vec3.transformMat4Normal = function transformMat4Normal(out, a, mat) {
    _x = a.x;
    _y = a.y;
    _z = a.z;
    var m = mat.m;
    var rhw = m[3] * _x + m[7] * _y + m[11] * _z;
    rhw = rhw ? 1 / rhw : 1;
    out.x = (m[0] * _x + m[4] * _y + m[8] * _z) * rhw;
    out.y = (m[1] * _x + m[5] * _y + m[9] * _z) * rhw;
    out.z = (m[2] * _x + m[6] * _y + m[10] * _z) * rhw;
    return out;
  }
  /**
   * !#zh 向量与三维矩阵乘法
   * !#en Dimensional vector matrix multiplication
   * @method transformMat3
   * @typescript
   * static transformMat3<Out extends IVec3Like, MatLike extends IMat3Like> (out: Out, a: Out, mat: MatLike)
   * @static
   */
  ;

  Vec3.transformMat3 = function transformMat3(out, a, mat) {
    _x = a.x;
    _y = a.y;
    _z = a.z;
    var m = mat.m;
    out.x = _x * m[0] + _y * m[3] + _z * m[6];
    out.y = _x * m[1] + _y * m[4] + _z * m[7];
    out.z = _x * m[2] + _y * m[5] + _z * m[8];
    return out;
  }
  /**
   * !#zh 向量仿射变换
   * !#en Affine transformation vector
   * @static
   */
  ;

  Vec3.transformAffine = function transformAffine(out, v, mat) {
    _x = v.x;
    _y = v.y;
    _z = v.z;
    var m = mat.m;
    out.x = m[0] * _x + m[1] * _y + m[2] * _z + m[3];
    out.y = m[4] * _x + m[5] * _y + m[6] * _z + m[7];
    out.x = m[8] * _x + m[9] * _y + m[10] * _z + m[11];
    return out;
  }
  /**
   * !#zh 向量四元数乘法
   * !#en Vector quaternion multiplication
   * @method transformQuat
   * @typescript
   * static transformQuat<Out extends IVec3Like, VecLike extends IVec3Like, QuatLike extends IQuatLike> (out: Out, a: VecLike, q: QuatLike)
   * @static
   */
  ;

  Vec3.transformQuat = function transformQuat(out, a, q) {
    // benchmarks: http://jsperf.com/quaternion-transform-Vec3-implementations
    // calculate quat * vec
    var ix = q.w * a.x + q.y * a.z - q.z * a.y;
    var iy = q.w * a.y + q.z * a.x - q.x * a.z;
    var iz = q.w * a.z + q.x * a.y - q.y * a.x;
    var iw = -q.x * a.x - q.y * a.y - q.z * a.z; // calculate result * inverse quat

    out.x = ix * q.w + iw * -q.x + iy * -q.z - iz * -q.y;
    out.y = iy * q.w + iw * -q.y + iz * -q.x - ix * -q.z;
    out.z = iz * q.w + iw * -q.z + ix * -q.y - iy * -q.x;
    return out;
  }
  /**
   * !#zh 以缩放 -> 旋转 -> 平移顺序变换向量
   * !#en To scale -> rotation -> transformation vector sequence translation
   * @static
   */
  ;

  Vec3.transformRTS = function transformRTS(out, a, r, t, s) {
    var x = a.x * s.x;
    var y = a.y * s.y;
    var z = a.z * s.z;
    var ix = r.w * x + r.y * z - r.z * y;
    var iy = r.w * y + r.z * x - r.x * z;
    var iz = r.w * z + r.x * y - r.y * x;
    var iw = -r.x * x - r.y * y - r.z * z;
    out.x = ix * r.w + iw * -r.x + iy * -r.z - iz * -r.y + t.x;
    out.y = iy * r.w + iw * -r.y + iz * -r.x - ix * -r.z + t.y;
    out.z = iz * r.w + iw * -r.z + ix * -r.y - iy * -r.x + t.z;
    return out;
  }
  /**
   * !#zh 以平移 -> 旋转 -> 缩放顺序逆变换向量
   * !#en Translational -> rotation -> Zoom inverse transformation vector sequence
   * @static
   */
  ;

  Vec3.transformInverseRTS = function transformInverseRTS(out, a, r, t, s) {
    var x = a.x - t.x;
    var y = a.y - t.y;
    var z = a.z - t.z;
    var ix = r.w * x - r.y * z + r.z * y;
    var iy = r.w * y - r.z * x + r.x * z;
    var iz = r.w * z - r.x * y + r.y * x;
    var iw = r.x * x + r.y * y + r.z * z;
    out.x = (ix * r.w + iw * r.x + iy * r.z - iz * r.y) / s.x;
    out.y = (iy * r.w + iw * r.y + iz * r.x - ix * r.z) / s.y;
    out.z = (iz * r.w + iw * r.z + ix * r.y - iy * r.x) / s.z;
    return out;
  }
  /**
   * !#zh 绕 X 轴旋转向量指定弧度
   * !#en Rotation vector specified angle about the X axis
   * @method rotateX
   * @typescript
   * static rotateX<Out extends IVec3Like> (out: Out, v: Out, o: Out, a: number)
   * @param v 待旋转向量
   * @param o 旋转中心
   * @param a 旋转弧度
   * @static
   */
  ;

  Vec3.rotateX = function rotateX(out, v, o, a) {
    // Translate point to the origin
    _x = v.x - o.x;
    _y = v.y - o.y;
    _z = v.z - o.z; // perform rotation

    var cos = Math.cos(a);
    var sin = Math.sin(a);
    var rx = _x;
    var ry = _y * cos - _z * sin;
    var rz = _y * sin + _z * cos; // translate to correct position

    out.x = rx + o.x;
    out.y = ry + o.y;
    out.z = rz + o.z;
    return out;
  }
  /**
   * !#zh 绕 Y 轴旋转向量指定弧度
   * !#en Rotation vector specified angle around the Y axis
   * @method rotateY
   * @typescript
   * static rotateY<Out extends IVec3Like> (out: Out, v: Out, o: Out, a: number)
   * @param v 待旋转向量
   * @param o 旋转中心
   * @param a 旋转弧度
   * @static
   */
  ;

  Vec3.rotateY = function rotateY(out, v, o, a) {
    // Translate point to the origin
    _x = v.x - o.x;
    _y = v.y - o.y;
    _z = v.z - o.z; // perform rotation

    var cos = Math.cos(a);
    var sin = Math.sin(a);
    var rx = _z * sin + _x * cos;
    var ry = _y;
    var rz = _z * cos - _x * sin; // translate to correct position

    out.x = rx + o.x;
    out.y = ry + o.y;
    out.z = rz + o.z;
    return out;
  }
  /**
   * !#zh 绕 Z 轴旋转向量指定弧度
   * !#en Around the Z axis specified angle vector
   * @method rotateZ
   * @typescript
   * static rotateZ<Out extends IVec3Like> (out: Out, v: Out, o: Out, a: number)
   * @param v 待旋转向量
   * @param o 旋转中心
   * @param a 旋转弧度
   * @static
   */
  ;

  Vec3.rotateZ = function rotateZ(out, v, o, a) {
    // Translate point to the origin
    _x = v.x - o.x;
    _y = v.y - o.y;
    _z = v.z - o.z; // perform rotation

    var cos = Math.cos(a);
    var sin = Math.sin(a);
    var rx = _x * cos - _y * sin;
    var ry = _x * sin + _y * cos;
    var rz = _z; // translate to correct position

    out.x = rx + o.x;
    out.y = ry + o.y;
    out.z = rz + o.z;
    return out;
  }
  /**
   * !#zh 向量等价判断
   * !#en Equivalent vectors Analyzing
   * @method strictEquals
   * @typescript
   * static strictEquals<Out extends IVec3Like> (a: Out, b: Out)
   * @static
   */
  ;

  Vec3.strictEquals = function strictEquals(a, b) {
    return a.x === b.x && a.y === b.y && a.z === b.z;
  }
  /**
   * !#zh 排除浮点数误差的向量近似等价判断
   * !#en Negative error vector floating point approximately equivalent Analyzing
   * @method equals
   * @typescript
   * static equals<Out extends IVec3Like> (a: Out, b: Out, epsilon = EPSILON)
   * @static
   */
  ;

  Vec3.equals = function equals(a, b, epsilon) {
    if (epsilon === void 0) {
      epsilon = _utils.EPSILON;
    }

    var a0 = a.x,
        a1 = a.y,
        a2 = a.z;
    var b0 = b.x,
        b1 = b.y,
        b2 = b.z;
    return Math.abs(a0 - b0) <= epsilon * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= epsilon * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= epsilon * Math.max(1.0, Math.abs(a2), Math.abs(b2));
  }
  /**
   * !#zh 求两向量夹角弧度
   * !#en Radian angle between two vectors seek
   * @method angle
   * @typescript
   * static angle<Out extends IVec3Like> (a: Out, b: Out)
   * @static
   */
  ;

  Vec3.angle = function angle(a, b) {
    Vec3.normalize(v3_1, a);
    Vec3.normalize(v3_2, b);
    var cosine = Vec3.dot(v3_1, v3_2);

    if (cosine > 1.0) {
      return 0;
    }

    if (cosine < -1.0) {
      return Math.PI;
    }

    return Math.acos(cosine);
  }
  /**
   * !#zh 计算向量在指定平面上的投影
   * !#en Calculating a projection vector in the specified plane
   * @method projectOnPlane
   * @typescript
   * static projectOnPlane<Out extends IVec3Like> (out: Out, a: Out, n: Out)
   * @param a 待投影向量
   * @param n 指定平面的法线
   * @static
   */
  ;

  Vec3.projectOnPlane = function projectOnPlane(out, a, n) {
    return Vec3.subtract(out, a, Vec3.project(out, a, n));
  }
  /**
   * !#zh 计算向量在指定向量上的投影
   * !#en Projection vector calculated in the vector designated
   * @method project
   * @typescript
   * static project<Out extends IVec3Like> (out: Out, a: Out, b: Out)
   * @param a 待投影向量
   * @param n 目标向量
   * @static
   */
  ;

  Vec3.project = function project(out, a, b) {
    var sqrLen = Vec3.lengthSqr(b);

    if (sqrLen < 0.000001) {
      return Vec3.set(out, 0, 0, 0);
    } else {
      return Vec3.multiplyScalar(out, b, Vec3.dot(a, b) / sqrLen);
    }
  }
  /**
   * !#zh 向量转数组
   * !#en Vector transfer array
   * @method toArray
   * @typescript
   * static toArray <Out extends IWritableArrayLike<number>> (out: Out, v: IVec3Like, ofs = 0)
   * @param ofs 数组起始偏移量
   * @static
   */
  ;

  Vec3.toArray = function toArray(out, v, ofs) {
    if (ofs === void 0) {
      ofs = 0;
    }

    out[ofs + 0] = v.x;
    out[ofs + 1] = v.y;
    out[ofs + 2] = v.z;
    return out;
  }
  /**
   * !#zh 数组转向量
   * !#en Array steering amount
   * @method fromArray
   * @typescript
   * static fromArray <Out extends IVec3Like> (out: Out, arr: IWritableArrayLike<number>, ofs = 0)
   * @param ofs 数组起始偏移量
   * @static
   */
  ;

  Vec3.fromArray = function fromArray(out, arr, ofs) {
    if (ofs === void 0) {
      ofs = 0;
    }

    out.x = arr[ofs + 0];
    out.y = arr[ofs + 1];
    out.z = arr[ofs + 2];
    return out;
  }
  /**
   * @property {Number} x
   */
  ;

  _createClass(Vec3, null, [{
    key: "ONE",
    get: function get() {
      return new Vec3(1, 1, 1);
    }
  }, {
    key: "ZERO",

    /**
     * !#en return a Vec3 object with x = 0, y = 0, z = 0.
     * !#zh 返回 x = 0，y = 0，z = 0 的 Vec3 对象。
     * @property ZERO
     * @type Vec3
     * @static
     */
    get: function get() {
      return new Vec3();
    }
  }, {
    key: "UP",

    /**
     * !#en return a Vec3 object with x = 0, y = 1, z = 0.
     * !#zh 返回 x = 0, y = 1, z = 0 的 Vec3 对象。
     * @property UP
     * @type Vec3
     * @static
     */
    get: function get() {
      return new Vec3(0, 1, 0);
    }
  }, {
    key: "RIGHT",

    /**
     * !#en return a Vec3 object with x = 1, y = 0, z = 0.
     * !#zh 返回 x = 1，y = 0，z = 0 的 Vec3 对象。
     * @property RIGHT
     * @type Vec3
     * @static
     */
    get: function get() {
      return new Vec3(1, 0, 0);
    }
  }, {
    key: "FRONT",

    /**
     * !#en return a Vec3 object with x = 0, y = 0, z = 1.
     * !#zh 返回 x = 0，y = 0，z = 1 的 Vec3 对象。
     * @property FRONT
     * @type Vec3
     * @static
     */
    get: function get() {
      return new Vec3(0, 0, 1);
    }
  }]);

  /**
   * !#en
   * Constructor
   * see {{#crossLink "cc/vec3:method"}}cc.v3{{/crossLink}}
   * !#zh
   * 构造函数，可查看 {{#crossLink "cc/vec3:method"}}cc.v3{{/crossLink}}
   * @method constructor
   * @param {Vec3|number} [x=0]
   * @param {number} [y=0]
   * @param {number} [z=0]
   */
  function Vec3(x, y, z) {
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

    _this = _ValueType.call(this) || this;
    _this.mag = Vec3.prototype.len;
    _this.magSqr = Vec3.prototype.lengthSqr;
    _this.subSelf = Vec3.prototype.subtract;
    _this.mulSelf = Vec3.prototype.multiplyScalar;
    _this.divSelf = Vec3.prototype.divide;
    _this.scaleSelf = Vec3.prototype.multiply;
    _this.negSelf = Vec3.prototype.negate;
    _this.x = void 0;
    _this.y = void 0;
    _this.z = void 0;
    _this.angle = _vec["default"].prototype.angle;
    _this.project = _vec["default"].prototype.project;

    if (x && typeof x === 'object') {
      _this.z = x.z;
      _this.y = x.y;
      _this.x = x.x;
    } else {
      _this.x = x;
      _this.y = y;
      _this.z = z;
    }

    return _this;
  }
  /**
   * !#en clone a Vec3 value
   * !#zh 克隆一个 Vec3 值
   * @method clone
   * @return {Vec3}
   */


  _proto.clone = function clone() {
    return new Vec3(this.x, this.y, this.z);
  }
  /**
   * !#en Set the current vector value with the given vector.
   * !#zh 用另一个向量设置当前的向量对象值。
   * @method set
   * @param {Vec3} newValue - !#en new value to set. !#zh 要设置的新值
   * @return {Vec3} returns this
   * @chainable
   */
  ;

  _proto.set = function set(newValue) {
    this.x = newValue.x;
    this.y = newValue.y;
    this.z = newValue.z;
    return this;
  }
  /**
   * !#en Check whether the vector equals another one
   * !#zh 当前的向量是否与指定的向量相等。
   * @method equals
   * @param {Vec3} other
   * @return {Boolean}
   */
  ;

  _proto.equals = function equals(other) {
    return other && this.x === other.x && this.y === other.y && this.z === other.z;
  }
  /**
   * !#en Check whether two vector equal with some degree of variance.
   * !#zh
   * 近似判断两个点是否相等。<br/>
   * 判断 2 个向量是否在指定数值的范围之内，如果在则返回 true，反之则返回 false。
   * @method fuzzyEquals
   * @param {Vec3} other
   * @param {Number} variance
   * @return {Boolean}
   */
  ;

  _proto.fuzzyEquals = function fuzzyEquals(other, variance) {
    if (this.x - variance <= other.x && other.x <= this.x + variance) {
      if (this.y - variance <= other.y && other.y <= this.y + variance) {
        if (this.z - variance <= other.z && other.z <= this.z + variance) return true;
      }
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
    return "(" + this.x.toFixed(2) + ", " + this.y.toFixed(2) + ", " + this.z.toFixed(2) + ")";
  }
  /**
   * !#en Calculate linear interpolation result between this vector and another one with given ratio
   * !#zh 线性插值。
   * @method lerp
   * @param {Vec3} to
   * @param {number} ratio - the interpolation coefficient
   * @param {Vec3} [out] - optional, the receiving vector, you can pass the same vec3 to save result to itself, if not provided, a new vec3 will be created
   * @return {Vec3}
   */
  ;

  _proto.lerp = function lerp(to, ratio, out) {
    out = out || new Vec3();
    Vec3.lerp(out, this, to, ratio);
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
   * @param {Vec3} min_inclusive
   * @param {Vec3} max_inclusive
   * @return {Vec3}
   */
  ;

  _proto.clampf = function clampf(min_inclusive, max_inclusive) {
    this.x = _misc["default"].clampf(this.x, min_inclusive.x, max_inclusive.x);
    this.y = _misc["default"].clampf(this.y, min_inclusive.y, max_inclusive.y);
    this.z = _misc["default"].clampf(this.z, min_inclusive.z, max_inclusive.z);
    return this;
  }
  /**
   * !#en Adds this vector. If you want to save result to another vector, use add() instead.
   * !#zh 向量加法。如果你想保存结果到另一个向量，使用 add() 代替。
   * @method addSelf
   * @param {Vec3} vector
   * @return {Vec3} returns this
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
   * !#en Adds two vectors, and returns the new result.
   * !#zh 向量加法，并返回新结果。
   * @method add
   * @param {Vec3} vector
   * @param {Vec3} [out] - optional, the receiving vector, you can pass the same vec3 to save result to itself, if not provided, a new vec3 will be created
   * @return {Vec3} the result
   */
  ;

  _proto.add = function add(vector, out) {
    out = out || new Vec3();
    out.x = this.x + vector.x;
    out.y = this.y + vector.y;
    out.z = this.z + vector.z;
    return out;
  }
  /**
   * !#en Subtracts one vector from this.
   * !#zh 向量减法。
   * @method subtract
   * @param {Vec3} vector
   * @return {Vec3} returns this
   * @chainable
   */
  ;

  _proto.subtract = function subtract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    this.z -= vector.z;
    return this;
  }
  /**
   * !#en Multiplies this by a number.
   * !#zh 缩放当前向量。
   * @method multiplyScalar
   * @param {number} num
   * @return {Vec3} returns this
   * @chainable
   */
  ;

  _proto.multiplyScalar = function multiplyScalar(num) {
    this.x *= num;
    this.y *= num;
    this.z *= num;
    return this;
  }
  /**
   * !#en Multiplies two vectors.
   * !#zh 分量相乘。
   * @method multiply
   * @param {Vec3} vector
   * @return {Vec3} returns this
   * @chainable
   */
  ;

  _proto.multiply = function multiply(vector) {
    this.x *= vector.x;
    this.y *= vector.y;
    this.z *= vector.z;
    return this;
  }
  /**
   * !#en Divides by a number.
   * !#zh 向量除法。
   * @method divide
   * @param {number} num
   * @return {Vec3} returns this
   * @chainable
   */
  ;

  _proto.divide = function divide(num) {
    this.x /= num;
    this.y /= num;
    this.z /= num;
    return this;
  }
  /**
   * !#en Negates the components.
   * !#zh 向量取反。
   * @method negate
   * @return {Vec3} returns this
   * @chainable
   */
  ;

  _proto.negate = function negate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }
  /**
   * !#en Dot product
   * !#zh 当前向量与指定向量进行点乘。
   * @method dot
   * @param {Vec3} [vector]
   * @return {number} the result
   */
  ;

  _proto.dot = function dot(vector) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }
  /**
   * !#en Cross product
   * !#zh 当前向量与指定向量进行叉乘。
   * @method cross
   * @param {Vec3} vector
   * @param {Vec3} [out]
   * @return {Vec3} the result
   */
  ;

  _proto.cross = function cross(vector, out) {
    out = out || new Vec3();
    Vec3.cross(out, this, vector);
    return out;
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
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  /**
   * !#en Returns the squared length of this vector.
   * !#zh 返回该向量的长度平方。
   * @method lengthSqr
   * @return {number} the result
   */
  ;

  _proto.lengthSqr = function lengthSqr() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  /**
   * !#en Make the length of this vector to 1.
   * !#zh 向量归一化，让这个向量的长度为 1。
   * @method normalizeSelf
   * @return {Vec3} returns this
   * @chainable
   */
  ;

  _proto.normalizeSelf = function normalizeSelf() {
    Vec3.normalize(this, this);
    return this;
  };

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
   * @param {Vec3} [out] - optional, the receiving vector, you can pass the same vec3 to save result to itself, if not provided, a new vec3 will be created
   * @return {Vec3} result
   */
  _proto.normalize = function normalize(out) {
    out = out || new Vec3();
    Vec3.normalize(out, this);
    return out;
  }
  /**
   * Transforms the vec3 with a mat4. 4th vector component is implicitly '1'
   * @method transformMat4
   * @param {Mat4} m matrix to transform with
   * @param {Vec3} [out] the receiving vector, you can pass the same vec3 to save result to itself, if not provided, a new vec3 will be created
   * @returns {Vec3} out
   */
  ;

  _proto.transformMat4 = function transformMat4(m, out) {
    out = out || new Vec3();
    Vec3.transformMat4(out, this, m);
    return out;
  }
  /**
   * Returns the maximum value in x, y, and z
   * @method maxAxis
   * @returns {number}
   */
  ;

  _proto.maxAxis = function maxAxis() {
    return Math.max(this.x, this.y, this.z);
  }
  /**
   * !#en Get angle in radian between this and vector.
   * !#zh 夹角的弧度。
   * @method angle
   * @param {Vec3} vector
   * @return {number} from 0 to Math.PI
   */
  ;

  // Compatible with the vec2 API

  /**
   * !#en Get angle in radian between this and vector with direction. <br/>
   * In order to compatible with the vec2 API.
   * !#zh 带方向的夹角的弧度。该方法仅用做兼容 2D 计算。
   * @method signAngle
   * @param {Vec3 | Vec2} vector
   * @return {number} from -MathPI to Math.PI
   * @deprecated
   */
  _proto.signAngle = function signAngle(vector) {
    cc.warnID(1408, 'vec3.signAngle', 'v2.1', 'cc.v2(selfVector).signAngle(vector)');
    var vec1 = new _vec["default"](this.x, this.y);
    var vec2 = new _vec["default"](vector.x, vector.y);
    return vec1.signAngle(vec2);
  }
  /**
   * !#en rotate. In order to compatible with the vec2 API.
   * !#zh 返回旋转给定弧度后的新向量。该方法仅用做兼容 2D 计算。
   * @method rotate
   * @param {number} radians
   * @param {Vec3} [out] - optional, the receiving vector, you can pass the same vec2 to save result to itself, if not provided, a new vec2 will be created
   * @return {Vec2 | Vec3} if the 'out' value is a vec3 you will get a Vec3 return. 
   * @deprecated
   */
  ;

  _proto.rotate = function rotate(radians, out) {
    cc.warnID(1408, 'vec3.rotate', 'v2.1', 'cc.v2(selfVector).rotate(radians, out)');
    return _vec["default"].prototype.rotate.call(this, radians, out);
  }
  /**
   * !#en rotate self. In order to compatible with the vec2 API.
   * !#zh 按指定弧度旋转向量。该方法仅用做兼容 2D 计算。
   * @method rotateSelf
   * @param {number} radians
   * @return {Vec3} returns this
   * @chainable
   * @deprecated
   */
  ;

  _proto.rotateSelf = function rotateSelf(radians) {
    cc.warnID(1408, 'vec3.rotateSelf', 'v2.1', 'cc.v2(selfVector).rotateSelf(radians)');
    return _vec["default"].prototype.rotateSelf.call(this, radians);
  };

  return Vec3;
}(_valueType["default"]);

exports["default"] = Vec3;
Vec3.sub = Vec3.subtract;
Vec3.mul = Vec3.multiply;
Vec3.scale = Vec3.multiplyScalar;
Vec3.mag = Vec3.len;
Vec3.squaredMagnitude = Vec3.lengthSqr;
Vec3.div = Vec3.divide;
Vec3.ONE_R = Vec3.ONE;
Vec3.ZERO_R = Vec3.ZERO;
Vec3.UP_R = Vec3.UP;
Vec3.RIGHT_R = Vec3.RIGHT;
Vec3.FRONT_R = Vec3.FRONT;
var v3_1 = new Vec3();
var v3_2 = new Vec3();

_CCClass["default"].fastDefine('cc.Vec3', Vec3, {
  x: 0,
  y: 0,
  z: 0
});
/**
 * @module cc
 */

/**
 * !#en The convenience method to create a new {{#crossLink "Vec3"}}cc.Vec3{{/crossLink}}.
 * !#zh 通过该简便的函数进行创建 {{#crossLink "Vec3"}}cc.Vec3{{/crossLink}} 对象。
 * @method v3
 * @param {Number|Object} [x=0]
 * @param {Number} [y=0]
 * @param {Number} [z=0]
 * @return {Vec3}
 * @example
 * var v1 = cc.v3();
 * var v2 = cc.v3(0, 0, 0);
 * var v3 = cc.v3(v2);
 * var v4 = cc.v3({x: 100, y: 100, z: 0});
 */


cc.v3 = function v3(x, y, z) {
  return new Vec3(x, y, z);
};

cc.Vec3 = Vec3;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlYzMudHMiXSwibmFtZXMiOlsiX3giLCJfeSIsIl96IiwiVmVjMyIsInN1YiIsInZlY3RvciIsIm91dCIsInN1YnRyYWN0IiwibXVsIiwibnVtIiwibXVsdGlwbHlTY2FsYXIiLCJkaXYiLCJkaXZpZGUiLCJzY2FsZSIsIm11bHRpcGx5IiwibmVnIiwibmVnYXRlIiwiemVybyIsIngiLCJ5IiwieiIsImNsb25lIiwiYSIsImNvcHkiLCJzZXQiLCJhZGQiLCJiIiwiY2VpbCIsIk1hdGgiLCJmbG9vciIsIm1pbiIsIm1heCIsInJvdW5kIiwic2NhbGVBbmRBZGQiLCJkaXN0YW5jZSIsInNxcnQiLCJzcXVhcmVkRGlzdGFuY2UiLCJsZW4iLCJsZW5ndGhTcXIiLCJpbnZlcnNlIiwiaW52ZXJzZVNhZmUiLCJhYnMiLCJFUFNJTE9OIiwibm9ybWFsaXplIiwiZG90IiwiY3Jvc3MiLCJheCIsImF5IiwiYXoiLCJieCIsImJ5IiwiYnoiLCJsZXJwIiwidCIsInJhbmRvbSIsInBoaSIsIlBJIiwiY29zVGhldGEiLCJzaW5UaGV0YSIsImNvcyIsInNpbiIsInRyYW5zZm9ybU1hdDQiLCJtYXQiLCJtIiwicmh3IiwidHJhbnNmb3JtTWF0NE5vcm1hbCIsInRyYW5zZm9ybU1hdDMiLCJ0cmFuc2Zvcm1BZmZpbmUiLCJ2IiwidHJhbnNmb3JtUXVhdCIsInEiLCJpeCIsInciLCJpeSIsIml6IiwiaXciLCJ0cmFuc2Zvcm1SVFMiLCJyIiwicyIsInRyYW5zZm9ybUludmVyc2VSVFMiLCJyb3RhdGVYIiwibyIsInJ4IiwicnkiLCJyeiIsInJvdGF0ZVkiLCJyb3RhdGVaIiwic3RyaWN0RXF1YWxzIiwiZXF1YWxzIiwiZXBzaWxvbiIsImEwIiwiYTEiLCJhMiIsImIwIiwiYjEiLCJiMiIsImFuZ2xlIiwidjNfMSIsInYzXzIiLCJjb3NpbmUiLCJhY29zIiwicHJvamVjdE9uUGxhbmUiLCJuIiwicHJvamVjdCIsInNxckxlbiIsInRvQXJyYXkiLCJvZnMiLCJmcm9tQXJyYXkiLCJhcnIiLCJtYWciLCJwcm90b3R5cGUiLCJtYWdTcXIiLCJzdWJTZWxmIiwibXVsU2VsZiIsImRpdlNlbGYiLCJzY2FsZVNlbGYiLCJuZWdTZWxmIiwiVmVjMiIsIm5ld1ZhbHVlIiwib3RoZXIiLCJmdXp6eUVxdWFscyIsInZhcmlhbmNlIiwidG9TdHJpbmciLCJ0b0ZpeGVkIiwidG8iLCJyYXRpbyIsImNsYW1wZiIsIm1pbl9pbmNsdXNpdmUiLCJtYXhfaW5jbHVzaXZlIiwibWlzYyIsImFkZFNlbGYiLCJub3JtYWxpemVTZWxmIiwibWF4QXhpcyIsInNpZ25BbmdsZSIsImNjIiwid2FybklEIiwidmVjMSIsInZlYzIiLCJyb3RhdGUiLCJyYWRpYW5zIiwiY2FsbCIsInJvdGF0ZVNlbGYiLCJWYWx1ZVR5cGUiLCJzcXVhcmVkTWFnbml0dWRlIiwiT05FX1IiLCJPTkUiLCJaRVJPX1IiLCJaRVJPIiwiVVBfUiIsIlVQIiwiUklHSFRfUiIsIlJJR0hUIiwiRlJPTlRfUiIsIkZST05UIiwiQ0NDbGFzcyIsImZhc3REZWZpbmUiLCJ2MyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFHQTs7Ozs7Ozs7OztBQUVBLElBQUlBLEVBQVUsR0FBRyxHQUFqQjtBQUNBLElBQUlDLEVBQVUsR0FBRyxHQUFqQjtBQUNBLElBQUlDLEVBQVUsR0FBRyxHQUFqQjtBQUVBOzs7Ozs7OztJQVFxQkM7Ozs7Ozs7QUFDakI7U0FVQUMsTUFBQSxhQUFLQyxNQUFMLEVBQW1CQyxHQUFuQixFQUErQjtBQUMzQixXQUFPSCxJQUFJLENBQUNJLFFBQUwsQ0FBY0QsR0FBRyxJQUFJLElBQUlILElBQUosRUFBckIsRUFBaUMsSUFBakMsRUFBdUNFLE1BQXZDLENBQVA7QUFDSDs7U0FFREcsTUFBQSxhQUFLQyxHQUFMLEVBQWtCSCxHQUFsQixFQUE4QjtBQUMxQixXQUFPSCxJQUFJLENBQUNPLGNBQUwsQ0FBb0JKLEdBQUcsSUFBSSxJQUFJSCxJQUFKLEVBQTNCLEVBQXVDLElBQXZDLEVBQTZDTSxHQUE3QyxDQUFQO0FBQ0g7O1NBRURFLE1BQUEsYUFBS04sTUFBTCxFQUFtQkMsR0FBbkIsRUFBK0I7QUFDM0IsV0FBT0gsSUFBSSxDQUFDUyxNQUFMLENBQVlOLEdBQUcsSUFBSSxJQUFJSCxJQUFKLEVBQW5CLEVBQStCLElBQS9CLEVBQXFDRSxNQUFyQyxDQUFQO0FBQ0g7O1NBRURRLFFBQUEsZUFBT1IsTUFBUCxFQUFxQkMsR0FBckIsRUFBaUM7QUFDN0IsV0FBT0gsSUFBSSxDQUFDVyxRQUFMLENBQWNSLEdBQUcsSUFBSSxJQUFJSCxJQUFKLEVBQXJCLEVBQWlDLElBQWpDLEVBQXVDRSxNQUF2QyxDQUFQO0FBQ0g7O1NBRURVLE1BQUEsYUFBS1QsR0FBTCxFQUFpQjtBQUNiLFdBQU9ILElBQUksQ0FBQ2EsTUFBTCxDQUFZVixHQUFHLElBQUksSUFBSUgsSUFBSixFQUFuQixFQUErQixJQUEvQixDQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7O0FBbURBOzs7Ozs7OztPQVFPYyxPQUFQLGNBQW9DWCxHQUFwQyxFQUE4QztBQUMxQ0EsSUFBQUEsR0FBRyxDQUFDWSxDQUFKLEdBQVEsQ0FBUjtBQUNBWixJQUFBQSxHQUFHLENBQUNhLENBQUosR0FBUSxDQUFSO0FBQ0FiLElBQUFBLEdBQUcsQ0FBQ2MsQ0FBSixHQUFRLENBQVI7QUFDQSxXQUFPZCxHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7OztPQVFPZSxRQUFQLGVBQXFDQyxDQUFyQyxFQUE2QztBQUN6QyxXQUFPLElBQUluQixJQUFKLENBQVNtQixDQUFDLENBQUNKLENBQVgsRUFBY0ksQ0FBQyxDQUFDSCxDQUFoQixFQUFtQkcsQ0FBQyxDQUFDRixDQUFyQixDQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7OztPQVFPRyxPQUFQLGNBQWdFakIsR0FBaEUsRUFBMEVnQixDQUExRSxFQUF1RjtBQUNuRmhCLElBQUFBLEdBQUcsQ0FBQ1ksQ0FBSixHQUFRSSxDQUFDLENBQUNKLENBQVY7QUFDQVosSUFBQUEsR0FBRyxDQUFDYSxDQUFKLEdBQVFHLENBQUMsQ0FBQ0gsQ0FBVjtBQUNBYixJQUFBQSxHQUFHLENBQUNjLENBQUosR0FBUUUsQ0FBQyxDQUFDRixDQUFWO0FBQ0EsV0FBT2QsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7T0FRT2tCLE1BQVAsYUFBbUNsQixHQUFuQyxFQUE2Q1ksQ0FBN0MsRUFBd0RDLENBQXhELEVBQW1FQyxDQUFuRSxFQUE4RTtBQUMxRWQsSUFBQUEsR0FBRyxDQUFDWSxDQUFKLEdBQVFBLENBQVI7QUFDQVosSUFBQUEsR0FBRyxDQUFDYSxDQUFKLEdBQVFBLENBQVI7QUFDQWIsSUFBQUEsR0FBRyxDQUFDYyxDQUFKLEdBQVFBLENBQVI7QUFDQSxXQUFPZCxHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7OztPQVFPbUIsTUFBUCxhQUFtQ25CLEdBQW5DLEVBQTZDZ0IsQ0FBN0MsRUFBcURJLENBQXJELEVBQTZEO0FBQ3pEcEIsSUFBQUEsR0FBRyxDQUFDWSxDQUFKLEdBQVFJLENBQUMsQ0FBQ0osQ0FBRixHQUFNUSxDQUFDLENBQUNSLENBQWhCO0FBQ0FaLElBQUFBLEdBQUcsQ0FBQ2EsQ0FBSixHQUFRRyxDQUFDLENBQUNILENBQUYsR0FBTU8sQ0FBQyxDQUFDUCxDQUFoQjtBQUNBYixJQUFBQSxHQUFHLENBQUNjLENBQUosR0FBUUUsQ0FBQyxDQUFDRixDQUFGLEdBQU1NLENBQUMsQ0FBQ04sQ0FBaEI7QUFDQSxXQUFPZCxHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7OztPQVFPQyxXQUFQLGtCQUF3Q0QsR0FBeEMsRUFBa0RnQixDQUFsRCxFQUEwREksQ0FBMUQsRUFBa0U7QUFDOURwQixJQUFBQSxHQUFHLENBQUNZLENBQUosR0FBUUksQ0FBQyxDQUFDSixDQUFGLEdBQU1RLENBQUMsQ0FBQ1IsQ0FBaEI7QUFDQVosSUFBQUEsR0FBRyxDQUFDYSxDQUFKLEdBQVFHLENBQUMsQ0FBQ0gsQ0FBRixHQUFNTyxDQUFDLENBQUNQLENBQWhCO0FBQ0FiLElBQUFBLEdBQUcsQ0FBQ2MsQ0FBSixHQUFRRSxDQUFDLENBQUNGLENBQUYsR0FBTU0sQ0FBQyxDQUFDTixDQUFoQjtBQUNBLFdBQU9kLEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7O09BUU9RLFdBQVAsa0JBQW9HUixHQUFwRyxFQUE4R2dCLENBQTlHLEVBQTZISSxDQUE3SCxFQUE0STtBQUN4SXBCLElBQUFBLEdBQUcsQ0FBQ1ksQ0FBSixHQUFRSSxDQUFDLENBQUNKLENBQUYsR0FBTVEsQ0FBQyxDQUFDUixDQUFoQjtBQUNBWixJQUFBQSxHQUFHLENBQUNhLENBQUosR0FBUUcsQ0FBQyxDQUFDSCxDQUFGLEdBQU1PLENBQUMsQ0FBQ1AsQ0FBaEI7QUFDQWIsSUFBQUEsR0FBRyxDQUFDYyxDQUFKLEdBQVFFLENBQUMsQ0FBQ0YsQ0FBRixHQUFNTSxDQUFDLENBQUNOLENBQWhCO0FBQ0EsV0FBT2QsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7T0FRT00sU0FBUCxnQkFBc0NOLEdBQXRDLEVBQWdEZ0IsQ0FBaEQsRUFBd0RJLENBQXhELEVBQWdFO0FBQzVEcEIsSUFBQUEsR0FBRyxDQUFDWSxDQUFKLEdBQVFJLENBQUMsQ0FBQ0osQ0FBRixHQUFNUSxDQUFDLENBQUNSLENBQWhCO0FBQ0FaLElBQUFBLEdBQUcsQ0FBQ2EsQ0FBSixHQUFRRyxDQUFDLENBQUNILENBQUYsR0FBTU8sQ0FBQyxDQUFDUCxDQUFoQjtBQUNBYixJQUFBQSxHQUFHLENBQUNjLENBQUosR0FBUUUsQ0FBQyxDQUFDRixDQUFGLEdBQU1NLENBQUMsQ0FBQ04sQ0FBaEI7QUFDQSxXQUFPZCxHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7OztPQVFPcUIsT0FBUCxjQUFvQ3JCLEdBQXBDLEVBQThDZ0IsQ0FBOUMsRUFBc0Q7QUFDbERoQixJQUFBQSxHQUFHLENBQUNZLENBQUosR0FBUVUsSUFBSSxDQUFDRCxJQUFMLENBQVVMLENBQUMsQ0FBQ0osQ0FBWixDQUFSO0FBQ0FaLElBQUFBLEdBQUcsQ0FBQ2EsQ0FBSixHQUFRUyxJQUFJLENBQUNELElBQUwsQ0FBVUwsQ0FBQyxDQUFDSCxDQUFaLENBQVI7QUFDQWIsSUFBQUEsR0FBRyxDQUFDYyxDQUFKLEdBQVFRLElBQUksQ0FBQ0QsSUFBTCxDQUFVTCxDQUFDLENBQUNGLENBQVosQ0FBUjtBQUNBLFdBQU9kLEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7O09BUU91QixRQUFQLGVBQXFDdkIsR0FBckMsRUFBK0NnQixDQUEvQyxFQUF1RDtBQUNuRGhCLElBQUFBLEdBQUcsQ0FBQ1ksQ0FBSixHQUFRVSxJQUFJLENBQUNDLEtBQUwsQ0FBV1AsQ0FBQyxDQUFDSixDQUFiLENBQVI7QUFDQVosSUFBQUEsR0FBRyxDQUFDYSxDQUFKLEdBQVFTLElBQUksQ0FBQ0MsS0FBTCxDQUFXUCxDQUFDLENBQUNILENBQWIsQ0FBUjtBQUNBYixJQUFBQSxHQUFHLENBQUNjLENBQUosR0FBUVEsSUFBSSxDQUFDQyxLQUFMLENBQVdQLENBQUMsQ0FBQ0YsQ0FBYixDQUFSO0FBQ0EsV0FBT2QsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7T0FRT3dCLE1BQVAsYUFBbUN4QixHQUFuQyxFQUE2Q2dCLENBQTdDLEVBQXFESSxDQUFyRCxFQUE2RDtBQUN6RHBCLElBQUFBLEdBQUcsQ0FBQ1ksQ0FBSixHQUFRVSxJQUFJLENBQUNFLEdBQUwsQ0FBU1IsQ0FBQyxDQUFDSixDQUFYLEVBQWNRLENBQUMsQ0FBQ1IsQ0FBaEIsQ0FBUjtBQUNBWixJQUFBQSxHQUFHLENBQUNhLENBQUosR0FBUVMsSUFBSSxDQUFDRSxHQUFMLENBQVNSLENBQUMsQ0FBQ0gsQ0FBWCxFQUFjTyxDQUFDLENBQUNQLENBQWhCLENBQVI7QUFDQWIsSUFBQUEsR0FBRyxDQUFDYyxDQUFKLEdBQVFRLElBQUksQ0FBQ0UsR0FBTCxDQUFTUixDQUFDLENBQUNGLENBQVgsRUFBY00sQ0FBQyxDQUFDTixDQUFoQixDQUFSO0FBQ0EsV0FBT2QsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7T0FRT3lCLE1BQVAsYUFBbUN6QixHQUFuQyxFQUE2Q2dCLENBQTdDLEVBQXFESSxDQUFyRCxFQUE2RDtBQUN6RHBCLElBQUFBLEdBQUcsQ0FBQ1ksQ0FBSixHQUFRVSxJQUFJLENBQUNHLEdBQUwsQ0FBU1QsQ0FBQyxDQUFDSixDQUFYLEVBQWNRLENBQUMsQ0FBQ1IsQ0FBaEIsQ0FBUjtBQUNBWixJQUFBQSxHQUFHLENBQUNhLENBQUosR0FBUVMsSUFBSSxDQUFDRyxHQUFMLENBQVNULENBQUMsQ0FBQ0gsQ0FBWCxFQUFjTyxDQUFDLENBQUNQLENBQWhCLENBQVI7QUFDQWIsSUFBQUEsR0FBRyxDQUFDYyxDQUFKLEdBQVFRLElBQUksQ0FBQ0csR0FBTCxDQUFTVCxDQUFDLENBQUNGLENBQVgsRUFBY00sQ0FBQyxDQUFDTixDQUFoQixDQUFSO0FBQ0EsV0FBT2QsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7T0FRTzBCLFFBQVAsZUFBcUMxQixHQUFyQyxFQUErQ2dCLENBQS9DLEVBQXVEO0FBQ25EaEIsSUFBQUEsR0FBRyxDQUFDWSxDQUFKLEdBQVFVLElBQUksQ0FBQ0ksS0FBTCxDQUFXVixDQUFDLENBQUNKLENBQWIsQ0FBUjtBQUNBWixJQUFBQSxHQUFHLENBQUNhLENBQUosR0FBUVMsSUFBSSxDQUFDSSxLQUFMLENBQVdWLENBQUMsQ0FBQ0gsQ0FBYixDQUFSO0FBQ0FiLElBQUFBLEdBQUcsQ0FBQ2MsQ0FBSixHQUFRUSxJQUFJLENBQUNJLEtBQUwsQ0FBV1YsQ0FBQyxDQUFDRixDQUFiLENBQVI7QUFDQSxXQUFPZCxHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7OztPQVFPSSxpQkFBUCx3QkFBMEVKLEdBQTFFLEVBQW9GZ0IsQ0FBcEYsRUFBaUdJLENBQWpHLEVBQTRHO0FBQ3hHcEIsSUFBQUEsR0FBRyxDQUFDWSxDQUFKLEdBQVFJLENBQUMsQ0FBQ0osQ0FBRixHQUFNUSxDQUFkO0FBQ0FwQixJQUFBQSxHQUFHLENBQUNhLENBQUosR0FBUUcsQ0FBQyxDQUFDSCxDQUFGLEdBQU1PLENBQWQ7QUFDQXBCLElBQUFBLEdBQUcsQ0FBQ2MsQ0FBSixHQUFRRSxDQUFDLENBQUNGLENBQUYsR0FBTU0sQ0FBZDtBQUNBLFdBQU9wQixHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7OztPQVFPMkIsY0FBUCxxQkFBMkMzQixHQUEzQyxFQUFxRGdCLENBQXJELEVBQTZESSxDQUE3RCxFQUFxRWIsS0FBckUsRUFBb0Y7QUFDaEZQLElBQUFBLEdBQUcsQ0FBQ1ksQ0FBSixHQUFRSSxDQUFDLENBQUNKLENBQUYsR0FBTVEsQ0FBQyxDQUFDUixDQUFGLEdBQU1MLEtBQXBCO0FBQ0FQLElBQUFBLEdBQUcsQ0FBQ2EsQ0FBSixHQUFRRyxDQUFDLENBQUNILENBQUYsR0FBTU8sQ0FBQyxDQUFDUCxDQUFGLEdBQU1OLEtBQXBCO0FBQ0FQLElBQUFBLEdBQUcsQ0FBQ2MsQ0FBSixHQUFRRSxDQUFDLENBQUNGLENBQUYsR0FBTU0sQ0FBQyxDQUFDTixDQUFGLEdBQU1QLEtBQXBCO0FBQ0EsV0FBT1AsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7T0FRTzRCLFdBQVAsa0JBQXdDWixDQUF4QyxFQUFnREksQ0FBaEQsRUFBd0Q7QUFDcEQxQixJQUFBQSxFQUFFLEdBQUcwQixDQUFDLENBQUNSLENBQUYsR0FBTUksQ0FBQyxDQUFDSixDQUFiO0FBQ0FqQixJQUFBQSxFQUFFLEdBQUd5QixDQUFDLENBQUNQLENBQUYsR0FBTUcsQ0FBQyxDQUFDSCxDQUFiO0FBQ0FqQixJQUFBQSxFQUFFLEdBQUd3QixDQUFDLENBQUNOLENBQUYsR0FBTUUsQ0FBQyxDQUFDRixDQUFiO0FBQ0EsV0FBT1EsSUFBSSxDQUFDTyxJQUFMLENBQVVuQyxFQUFFLEdBQUdBLEVBQUwsR0FBVUMsRUFBRSxHQUFHQSxFQUFmLEdBQW9CQyxFQUFFLEdBQUdBLEVBQW5DLENBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7O09BUU9rQyxrQkFBUCx5QkFBK0NkLENBQS9DLEVBQXVESSxDQUF2RCxFQUErRDtBQUMzRDFCLElBQUFBLEVBQUUsR0FBRzBCLENBQUMsQ0FBQ1IsQ0FBRixHQUFNSSxDQUFDLENBQUNKLENBQWI7QUFDQWpCLElBQUFBLEVBQUUsR0FBR3lCLENBQUMsQ0FBQ1AsQ0FBRixHQUFNRyxDQUFDLENBQUNILENBQWI7QUFDQWpCLElBQUFBLEVBQUUsR0FBR3dCLENBQUMsQ0FBQ04sQ0FBRixHQUFNRSxDQUFDLENBQUNGLENBQWI7QUFDQSxXQUFPcEIsRUFBRSxHQUFHQSxFQUFMLEdBQVVDLEVBQUUsR0FBR0EsRUFBZixHQUFvQkMsRUFBRSxHQUFHQSxFQUFoQztBQUNIO0FBRUQ7Ozs7Ozs7Ozs7T0FRT21DLE1BQVAsYUFBbUNmLENBQW5DLEVBQTJDO0FBQ3ZDdEIsSUFBQUEsRUFBRSxHQUFHc0IsQ0FBQyxDQUFDSixDQUFQO0FBQ0FqQixJQUFBQSxFQUFFLEdBQUdxQixDQUFDLENBQUNILENBQVA7QUFDQWpCLElBQUFBLEVBQUUsR0FBR29CLENBQUMsQ0FBQ0YsQ0FBUDtBQUNBLFdBQU9RLElBQUksQ0FBQ08sSUFBTCxDQUFVbkMsRUFBRSxHQUFHQSxFQUFMLEdBQVVDLEVBQUUsR0FBR0EsRUFBZixHQUFvQkMsRUFBRSxHQUFHQSxFQUFuQyxDQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7OztPQVFPb0MsWUFBUCxtQkFBeUNoQixDQUF6QyxFQUFpRDtBQUM3Q3RCLElBQUFBLEVBQUUsR0FBR3NCLENBQUMsQ0FBQ0osQ0FBUDtBQUNBakIsSUFBQUEsRUFBRSxHQUFHcUIsQ0FBQyxDQUFDSCxDQUFQO0FBQ0FqQixJQUFBQSxFQUFFLEdBQUdvQixDQUFDLENBQUNGLENBQVA7QUFDQSxXQUFPcEIsRUFBRSxHQUFHQSxFQUFMLEdBQVVDLEVBQUUsR0FBR0EsRUFBZixHQUFvQkMsRUFBRSxHQUFHQSxFQUFoQztBQUNIO0FBRUQ7Ozs7Ozs7Ozs7T0FRT2MsU0FBUCxnQkFBc0NWLEdBQXRDLEVBQWdEZ0IsQ0FBaEQsRUFBd0Q7QUFDcERoQixJQUFBQSxHQUFHLENBQUNZLENBQUosR0FBUSxDQUFDSSxDQUFDLENBQUNKLENBQVg7QUFDQVosSUFBQUEsR0FBRyxDQUFDYSxDQUFKLEdBQVEsQ0FBQ0csQ0FBQyxDQUFDSCxDQUFYO0FBQ0FiLElBQUFBLEdBQUcsQ0FBQ2MsQ0FBSixHQUFRLENBQUNFLENBQUMsQ0FBQ0YsQ0FBWDtBQUNBLFdBQU9kLEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7O09BUU9pQyxVQUFQLGlCQUF1Q2pDLEdBQXZDLEVBQWlEZ0IsQ0FBakQsRUFBeUQ7QUFDckRoQixJQUFBQSxHQUFHLENBQUNZLENBQUosR0FBUSxNQUFNSSxDQUFDLENBQUNKLENBQWhCO0FBQ0FaLElBQUFBLEdBQUcsQ0FBQ2EsQ0FBSixHQUFRLE1BQU1HLENBQUMsQ0FBQ0gsQ0FBaEI7QUFDQWIsSUFBQUEsR0FBRyxDQUFDYyxDQUFKLEdBQVEsTUFBTUUsQ0FBQyxDQUFDRixDQUFoQjtBQUNBLFdBQU9kLEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7O09BUU9rQyxjQUFQLHFCQUEyQ2xDLEdBQTNDLEVBQXFEZ0IsQ0FBckQsRUFBNkQ7QUFDekR0QixJQUFBQSxFQUFFLEdBQUdzQixDQUFDLENBQUNKLENBQVA7QUFDQWpCLElBQUFBLEVBQUUsR0FBR3FCLENBQUMsQ0FBQ0gsQ0FBUDtBQUNBakIsSUFBQUEsRUFBRSxHQUFHb0IsQ0FBQyxDQUFDRixDQUFQOztBQUVBLFFBQUlRLElBQUksQ0FBQ2EsR0FBTCxDQUFTekMsRUFBVCxJQUFlMEMsY0FBbkIsRUFBNEI7QUFDeEJwQyxNQUFBQSxHQUFHLENBQUNZLENBQUosR0FBUSxDQUFSO0FBQ0gsS0FGRCxNQUVPO0FBQ0haLE1BQUFBLEdBQUcsQ0FBQ1ksQ0FBSixHQUFRLE1BQU1sQixFQUFkO0FBQ0g7O0FBRUQsUUFBSTRCLElBQUksQ0FBQ2EsR0FBTCxDQUFTeEMsRUFBVCxJQUFleUMsY0FBbkIsRUFBNEI7QUFDeEJwQyxNQUFBQSxHQUFHLENBQUNhLENBQUosR0FBUSxDQUFSO0FBQ0gsS0FGRCxNQUVPO0FBQ0hiLE1BQUFBLEdBQUcsQ0FBQ2EsQ0FBSixHQUFRLE1BQU1sQixFQUFkO0FBQ0g7O0FBRUQsUUFBSTJCLElBQUksQ0FBQ2EsR0FBTCxDQUFTdkMsRUFBVCxJQUFld0MsY0FBbkIsRUFBNEI7QUFDeEJwQyxNQUFBQSxHQUFHLENBQUNjLENBQUosR0FBUSxDQUFSO0FBQ0gsS0FGRCxNQUVPO0FBQ0hkLE1BQUFBLEdBQUcsQ0FBQ2MsQ0FBSixHQUFRLE1BQU1sQixFQUFkO0FBQ0g7O0FBRUQsV0FBT0ksR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7T0FRT3FDLFlBQVAsbUJBQXFFckMsR0FBckUsRUFBK0VnQixDQUEvRSxFQUE0RjtBQUN4RnRCLElBQUFBLEVBQUUsR0FBR3NCLENBQUMsQ0FBQ0osQ0FBUDtBQUNBakIsSUFBQUEsRUFBRSxHQUFHcUIsQ0FBQyxDQUFDSCxDQUFQO0FBQ0FqQixJQUFBQSxFQUFFLEdBQUdvQixDQUFDLENBQUNGLENBQVA7QUFFQSxRQUFJaUIsR0FBRyxHQUFHckMsRUFBRSxHQUFHQSxFQUFMLEdBQVVDLEVBQUUsR0FBR0EsRUFBZixHQUFvQkMsRUFBRSxHQUFHQSxFQUFuQzs7QUFDQSxRQUFJbUMsR0FBRyxHQUFHLENBQVYsRUFBYTtBQUNUQSxNQUFBQSxHQUFHLEdBQUcsSUFBSVQsSUFBSSxDQUFDTyxJQUFMLENBQVVFLEdBQVYsQ0FBVjtBQUNBL0IsTUFBQUEsR0FBRyxDQUFDWSxDQUFKLEdBQVFsQixFQUFFLEdBQUdxQyxHQUFiO0FBQ0EvQixNQUFBQSxHQUFHLENBQUNhLENBQUosR0FBUWxCLEVBQUUsR0FBR29DLEdBQWI7QUFDQS9CLE1BQUFBLEdBQUcsQ0FBQ2MsQ0FBSixHQUFRbEIsRUFBRSxHQUFHbUMsR0FBYjtBQUNIOztBQUNELFdBQU8vQixHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7OztPQVFPc0MsTUFBUCxhQUFtQ3RCLENBQW5DLEVBQTJDSSxDQUEzQyxFQUFtRDtBQUMvQyxXQUFPSixDQUFDLENBQUNKLENBQUYsR0FBTVEsQ0FBQyxDQUFDUixDQUFSLEdBQVlJLENBQUMsQ0FBQ0gsQ0FBRixHQUFNTyxDQUFDLENBQUNQLENBQXBCLEdBQXdCRyxDQUFDLENBQUNGLENBQUYsR0FBTU0sQ0FBQyxDQUFDTixDQUF2QztBQUNIO0FBRUQ7Ozs7Ozs7Ozs7T0FRT3lCLFFBQVAsZUFBaUd2QyxHQUFqRyxFQUEyR2dCLENBQTNHLEVBQTBISSxDQUExSCxFQUF5STtBQUFBLFFBQzFIb0IsRUFEMEgsR0FDckd4QixDQURxRyxDQUM3SEosQ0FENkg7QUFBQSxRQUNuSDZCLEVBRG1ILEdBQ3JHekIsQ0FEcUcsQ0FDdEhILENBRHNIO0FBQUEsUUFDNUc2QixFQUQ0RyxHQUNyRzFCLENBRHFHLENBQy9HRixDQUQrRztBQUFBLFFBRTFINkIsRUFGMEgsR0FFckd2QixDQUZxRyxDQUU3SFIsQ0FGNkg7QUFBQSxRQUVuSGdDLEVBRm1ILEdBRXJHeEIsQ0FGcUcsQ0FFdEhQLENBRnNIO0FBQUEsUUFFNUdnQyxFQUY0RyxHQUVyR3pCLENBRnFHLENBRS9HTixDQUYrRztBQUdySWQsSUFBQUEsR0FBRyxDQUFDWSxDQUFKLEdBQVE2QixFQUFFLEdBQUdJLEVBQUwsR0FBVUgsRUFBRSxHQUFHRSxFQUF2QjtBQUNBNUMsSUFBQUEsR0FBRyxDQUFDYSxDQUFKLEdBQVE2QixFQUFFLEdBQUdDLEVBQUwsR0FBVUgsRUFBRSxHQUFHSyxFQUF2QjtBQUNBN0MsSUFBQUEsR0FBRyxDQUFDYyxDQUFKLEdBQVEwQixFQUFFLEdBQUdJLEVBQUwsR0FBVUgsRUFBRSxHQUFHRSxFQUF2QjtBQUNBLFdBQU8zQyxHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7OztPQVFPOEMsT0FBUCxjQUFvQzlDLEdBQXBDLEVBQThDZ0IsQ0FBOUMsRUFBc0RJLENBQXRELEVBQThEMkIsQ0FBOUQsRUFBeUU7QUFDckUvQyxJQUFBQSxHQUFHLENBQUNZLENBQUosR0FBUUksQ0FBQyxDQUFDSixDQUFGLEdBQU1tQyxDQUFDLElBQUkzQixDQUFDLENBQUNSLENBQUYsR0FBTUksQ0FBQyxDQUFDSixDQUFaLENBQWY7QUFDQVosSUFBQUEsR0FBRyxDQUFDYSxDQUFKLEdBQVFHLENBQUMsQ0FBQ0gsQ0FBRixHQUFNa0MsQ0FBQyxJQUFJM0IsQ0FBQyxDQUFDUCxDQUFGLEdBQU1HLENBQUMsQ0FBQ0gsQ0FBWixDQUFmO0FBQ0FiLElBQUFBLEdBQUcsQ0FBQ2MsQ0FBSixHQUFRRSxDQUFDLENBQUNGLENBQUYsR0FBTWlDLENBQUMsSUFBSTNCLENBQUMsQ0FBQ04sQ0FBRixHQUFNRSxDQUFDLENBQUNGLENBQVosQ0FBZjtBQUNBLFdBQU9kLEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7OztPQVNPZ0QsU0FBUCxnQkFBc0NoRCxHQUF0QyxFQUFnRE8sS0FBaEQsRUFBZ0U7QUFDNURBLElBQUFBLEtBQUssR0FBR0EsS0FBSyxJQUFJLEdBQWpCO0FBRUEsUUFBTTBDLEdBQUcsR0FBRyx1QkFBVyxHQUFYLEdBQWlCM0IsSUFBSSxDQUFDNEIsRUFBbEM7QUFDQSxRQUFNQyxRQUFRLEdBQUcsdUJBQVcsQ0FBWCxHQUFlLENBQWhDO0FBQ0EsUUFBTUMsUUFBUSxHQUFHOUIsSUFBSSxDQUFDTyxJQUFMLENBQVUsSUFBSXNCLFFBQVEsR0FBR0EsUUFBekIsQ0FBakI7QUFFQW5ELElBQUFBLEdBQUcsQ0FBQ1ksQ0FBSixHQUFRd0MsUUFBUSxHQUFHOUIsSUFBSSxDQUFDK0IsR0FBTCxDQUFTSixHQUFULENBQVgsR0FBMkIxQyxLQUFuQztBQUNBUCxJQUFBQSxHQUFHLENBQUNhLENBQUosR0FBUXVDLFFBQVEsR0FBRzlCLElBQUksQ0FBQ2dDLEdBQUwsQ0FBU0wsR0FBVCxDQUFYLEdBQTJCMUMsS0FBbkM7QUFDQVAsSUFBQUEsR0FBRyxDQUFDYyxDQUFKLEdBQVFxQyxRQUFRLEdBQUc1QyxLQUFuQjtBQUNBLFdBQU9QLEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7O09BUU91RCxnQkFBUCx1QkFBb0d2RCxHQUFwRyxFQUE4R2dCLENBQTlHLEVBQTJId0MsR0FBM0gsRUFBeUk7QUFDckk5RCxJQUFBQSxFQUFFLEdBQUdzQixDQUFDLENBQUNKLENBQVA7QUFDQWpCLElBQUFBLEVBQUUsR0FBR3FCLENBQUMsQ0FBQ0gsQ0FBUDtBQUNBakIsSUFBQUEsRUFBRSxHQUFHb0IsQ0FBQyxDQUFDRixDQUFQO0FBQ0EsUUFBSTJDLENBQUMsR0FBR0QsR0FBRyxDQUFDQyxDQUFaO0FBQ0EsUUFBSUMsR0FBRyxHQUFHRCxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU8vRCxFQUFQLEdBQVkrRCxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU85RCxFQUFuQixHQUF3QjhELENBQUMsQ0FBQyxFQUFELENBQUQsR0FBUTdELEVBQWhDLEdBQXFDNkQsQ0FBQyxDQUFDLEVBQUQsQ0FBaEQ7QUFDQUMsSUFBQUEsR0FBRyxHQUFHQSxHQUFHLEdBQUcsSUFBSUEsR0FBUCxHQUFhLENBQXRCO0FBQ0ExRCxJQUFBQSxHQUFHLENBQUNZLENBQUosR0FBUSxDQUFDNkMsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPL0QsRUFBUCxHQUFZK0QsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPOUQsRUFBbkIsR0FBd0I4RCxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU83RCxFQUEvQixHQUFvQzZELENBQUMsQ0FBQyxFQUFELENBQXRDLElBQThDQyxHQUF0RDtBQUNBMUQsSUFBQUEsR0FBRyxDQUFDYSxDQUFKLEdBQVEsQ0FBQzRDLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBTy9ELEVBQVAsR0FBWStELENBQUMsQ0FBQyxDQUFELENBQUQsR0FBTzlELEVBQW5CLEdBQXdCOEQsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPN0QsRUFBL0IsR0FBb0M2RCxDQUFDLENBQUMsRUFBRCxDQUF0QyxJQUE4Q0MsR0FBdEQ7QUFDQTFELElBQUFBLEdBQUcsQ0FBQ2MsQ0FBSixHQUFRLENBQUMyQyxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU8vRCxFQUFQLEdBQVkrRCxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU85RCxFQUFuQixHQUF3QjhELENBQUMsQ0FBQyxFQUFELENBQUQsR0FBUTdELEVBQWhDLEdBQXFDNkQsQ0FBQyxDQUFDLEVBQUQsQ0FBdkMsSUFBK0NDLEdBQXZEO0FBQ0EsV0FBTzFELEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7O09BUU8yRCxzQkFBUCw2QkFBOEUzRCxHQUE5RSxFQUF3RmdCLENBQXhGLEVBQWdHd0MsR0FBaEcsRUFBOEc7QUFDMUc5RCxJQUFBQSxFQUFFLEdBQUdzQixDQUFDLENBQUNKLENBQVA7QUFDQWpCLElBQUFBLEVBQUUsR0FBR3FCLENBQUMsQ0FBQ0gsQ0FBUDtBQUNBakIsSUFBQUEsRUFBRSxHQUFHb0IsQ0FBQyxDQUFDRixDQUFQO0FBQ0EsUUFBSTJDLENBQUMsR0FBR0QsR0FBRyxDQUFDQyxDQUFaO0FBQ0EsUUFBSUMsR0FBRyxHQUFHRCxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU8vRCxFQUFQLEdBQVkrRCxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU85RCxFQUFuQixHQUF3QjhELENBQUMsQ0FBQyxFQUFELENBQUQsR0FBUTdELEVBQTFDO0FBQ0E4RCxJQUFBQSxHQUFHLEdBQUdBLEdBQUcsR0FBRyxJQUFJQSxHQUFQLEdBQWEsQ0FBdEI7QUFDQTFELElBQUFBLEdBQUcsQ0FBQ1ksQ0FBSixHQUFRLENBQUM2QyxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU8vRCxFQUFQLEdBQVkrRCxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU85RCxFQUFuQixHQUF3QjhELENBQUMsQ0FBQyxDQUFELENBQUQsR0FBTzdELEVBQWhDLElBQXNDOEQsR0FBOUM7QUFDQTFELElBQUFBLEdBQUcsQ0FBQ2EsQ0FBSixHQUFRLENBQUM0QyxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU8vRCxFQUFQLEdBQVkrRCxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU85RCxFQUFuQixHQUF3QjhELENBQUMsQ0FBQyxDQUFELENBQUQsR0FBTzdELEVBQWhDLElBQXNDOEQsR0FBOUM7QUFDQTFELElBQUFBLEdBQUcsQ0FBQ2MsQ0FBSixHQUFRLENBQUMyQyxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU8vRCxFQUFQLEdBQVkrRCxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU85RCxFQUFuQixHQUF3QjhELENBQUMsQ0FBQyxFQUFELENBQUQsR0FBUTdELEVBQWpDLElBQXVDOEQsR0FBL0M7QUFDQSxXQUFPMUQsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7T0FRTzRELGdCQUFQLHVCQUF3RTVELEdBQXhFLEVBQWtGZ0IsQ0FBbEYsRUFBMEZ3QyxHQUExRixFQUF3RztBQUNwRzlELElBQUFBLEVBQUUsR0FBR3NCLENBQUMsQ0FBQ0osQ0FBUDtBQUNBakIsSUFBQUEsRUFBRSxHQUFHcUIsQ0FBQyxDQUFDSCxDQUFQO0FBQ0FqQixJQUFBQSxFQUFFLEdBQUdvQixDQUFDLENBQUNGLENBQVA7QUFDQSxRQUFJMkMsQ0FBQyxHQUFHRCxHQUFHLENBQUNDLENBQVo7QUFDQXpELElBQUFBLEdBQUcsQ0FBQ1ksQ0FBSixHQUFRbEIsRUFBRSxHQUFHK0QsQ0FBQyxDQUFDLENBQUQsQ0FBTixHQUFZOUQsRUFBRSxHQUFHOEQsQ0FBQyxDQUFDLENBQUQsQ0FBbEIsR0FBd0I3RCxFQUFFLEdBQUc2RCxDQUFDLENBQUMsQ0FBRCxDQUF0QztBQUNBekQsSUFBQUEsR0FBRyxDQUFDYSxDQUFKLEdBQVFuQixFQUFFLEdBQUcrRCxDQUFDLENBQUMsQ0FBRCxDQUFOLEdBQVk5RCxFQUFFLEdBQUc4RCxDQUFDLENBQUMsQ0FBRCxDQUFsQixHQUF3QjdELEVBQUUsR0FBRzZELENBQUMsQ0FBQyxDQUFELENBQXRDO0FBQ0F6RCxJQUFBQSxHQUFHLENBQUNjLENBQUosR0FBUXBCLEVBQUUsR0FBRytELENBQUMsQ0FBQyxDQUFELENBQU4sR0FBWTlELEVBQUUsR0FBRzhELENBQUMsQ0FBQyxDQUFELENBQWxCLEdBQXdCN0QsRUFBRSxHQUFHNkQsQ0FBQyxDQUFDLENBQUQsQ0FBdEM7QUFDQSxXQUFPekQsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7T0FLTzZELGtCQUFQLHlCQUNLN0QsR0FETCxFQUNlOEQsQ0FEZixFQUMyQk4sR0FEM0IsRUFDeUM7QUFDckM5RCxJQUFBQSxFQUFFLEdBQUdvRSxDQUFDLENBQUNsRCxDQUFQO0FBQ0FqQixJQUFBQSxFQUFFLEdBQUdtRSxDQUFDLENBQUNqRCxDQUFQO0FBQ0FqQixJQUFBQSxFQUFFLEdBQUdrRSxDQUFDLENBQUNoRCxDQUFQO0FBQ0EsUUFBSTJDLENBQUMsR0FBR0QsR0FBRyxDQUFDQyxDQUFaO0FBQ0F6RCxJQUFBQSxHQUFHLENBQUNZLENBQUosR0FBUTZDLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBTy9ELEVBQVAsR0FBWStELENBQUMsQ0FBQyxDQUFELENBQUQsR0FBTzlELEVBQW5CLEdBQXdCOEQsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPN0QsRUFBL0IsR0FBb0M2RCxDQUFDLENBQUMsQ0FBRCxDQUE3QztBQUNBekQsSUFBQUEsR0FBRyxDQUFDYSxDQUFKLEdBQVE0QyxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU8vRCxFQUFQLEdBQVkrRCxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU85RCxFQUFuQixHQUF3QjhELENBQUMsQ0FBQyxDQUFELENBQUQsR0FBTzdELEVBQS9CLEdBQW9DNkQsQ0FBQyxDQUFDLENBQUQsQ0FBN0M7QUFDQXpELElBQUFBLEdBQUcsQ0FBQ1ksQ0FBSixHQUFRNkMsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPL0QsRUFBUCxHQUFZK0QsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPOUQsRUFBbkIsR0FBd0I4RCxDQUFDLENBQUMsRUFBRCxDQUFELEdBQVE3RCxFQUFoQyxHQUFxQzZELENBQUMsQ0FBQyxFQUFELENBQTlDO0FBQ0EsV0FBT3pELEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7O09BUU8rRCxnQkFBUCx1QkFBb0cvRCxHQUFwRyxFQUE4R2dCLENBQTlHLEVBQTBIZ0QsQ0FBMUgsRUFBdUk7QUFDbkk7QUFFQTtBQUNBLFFBQU1DLEVBQUUsR0FBR0QsQ0FBQyxDQUFDRSxDQUFGLEdBQU1sRCxDQUFDLENBQUNKLENBQVIsR0FBWW9ELENBQUMsQ0FBQ25ELENBQUYsR0FBTUcsQ0FBQyxDQUFDRixDQUFwQixHQUF3QmtELENBQUMsQ0FBQ2xELENBQUYsR0FBTUUsQ0FBQyxDQUFDSCxDQUEzQztBQUNBLFFBQU1zRCxFQUFFLEdBQUdILENBQUMsQ0FBQ0UsQ0FBRixHQUFNbEQsQ0FBQyxDQUFDSCxDQUFSLEdBQVltRCxDQUFDLENBQUNsRCxDQUFGLEdBQU1FLENBQUMsQ0FBQ0osQ0FBcEIsR0FBd0JvRCxDQUFDLENBQUNwRCxDQUFGLEdBQU1JLENBQUMsQ0FBQ0YsQ0FBM0M7QUFDQSxRQUFNc0QsRUFBRSxHQUFHSixDQUFDLENBQUNFLENBQUYsR0FBTWxELENBQUMsQ0FBQ0YsQ0FBUixHQUFZa0QsQ0FBQyxDQUFDcEQsQ0FBRixHQUFNSSxDQUFDLENBQUNILENBQXBCLEdBQXdCbUQsQ0FBQyxDQUFDbkQsQ0FBRixHQUFNRyxDQUFDLENBQUNKLENBQTNDO0FBQ0EsUUFBTXlELEVBQUUsR0FBRyxDQUFDTCxDQUFDLENBQUNwRCxDQUFILEdBQU9JLENBQUMsQ0FBQ0osQ0FBVCxHQUFhb0QsQ0FBQyxDQUFDbkQsQ0FBRixHQUFNRyxDQUFDLENBQUNILENBQXJCLEdBQXlCbUQsQ0FBQyxDQUFDbEQsQ0FBRixHQUFNRSxDQUFDLENBQUNGLENBQTVDLENBUG1JLENBU25JOztBQUNBZCxJQUFBQSxHQUFHLENBQUNZLENBQUosR0FBUXFELEVBQUUsR0FBR0QsQ0FBQyxDQUFDRSxDQUFQLEdBQVdHLEVBQUUsR0FBRyxDQUFDTCxDQUFDLENBQUNwRCxDQUFuQixHQUF1QnVELEVBQUUsR0FBRyxDQUFDSCxDQUFDLENBQUNsRCxDQUEvQixHQUFtQ3NELEVBQUUsR0FBRyxDQUFDSixDQUFDLENBQUNuRCxDQUFuRDtBQUNBYixJQUFBQSxHQUFHLENBQUNhLENBQUosR0FBUXNELEVBQUUsR0FBR0gsQ0FBQyxDQUFDRSxDQUFQLEdBQVdHLEVBQUUsR0FBRyxDQUFDTCxDQUFDLENBQUNuRCxDQUFuQixHQUF1QnVELEVBQUUsR0FBRyxDQUFDSixDQUFDLENBQUNwRCxDQUEvQixHQUFtQ3FELEVBQUUsR0FBRyxDQUFDRCxDQUFDLENBQUNsRCxDQUFuRDtBQUNBZCxJQUFBQSxHQUFHLENBQUNjLENBQUosR0FBUXNELEVBQUUsR0FBR0osQ0FBQyxDQUFDRSxDQUFQLEdBQVdHLEVBQUUsR0FBRyxDQUFDTCxDQUFDLENBQUNsRCxDQUFuQixHQUF1Qm1ELEVBQUUsR0FBRyxDQUFDRCxDQUFDLENBQUNuRCxDQUEvQixHQUFtQ3NELEVBQUUsR0FBRyxDQUFDSCxDQUFDLENBQUNwRCxDQUFuRDtBQUNBLFdBQU9aLEdBQVA7QUFDSDtBQUVEOzs7Ozs7O09BS09zRSxlQUFQLHNCQUNJdEUsR0FESixFQUNjZ0IsQ0FEZCxFQUMwQnVELENBRDFCLEVBQ3VDeEIsQ0FEdkMsRUFDbUR5QixDQURuRCxFQUMrRDtBQUMzRCxRQUFNNUQsQ0FBQyxHQUFHSSxDQUFDLENBQUNKLENBQUYsR0FBTTRELENBQUMsQ0FBQzVELENBQWxCO0FBQ0EsUUFBTUMsQ0FBQyxHQUFHRyxDQUFDLENBQUNILENBQUYsR0FBTTJELENBQUMsQ0FBQzNELENBQWxCO0FBQ0EsUUFBTUMsQ0FBQyxHQUFHRSxDQUFDLENBQUNGLENBQUYsR0FBTTBELENBQUMsQ0FBQzFELENBQWxCO0FBQ0EsUUFBTW1ELEVBQUUsR0FBR00sQ0FBQyxDQUFDTCxDQUFGLEdBQU10RCxDQUFOLEdBQVUyRCxDQUFDLENBQUMxRCxDQUFGLEdBQU1DLENBQWhCLEdBQW9CeUQsQ0FBQyxDQUFDekQsQ0FBRixHQUFNRCxDQUFyQztBQUNBLFFBQU1zRCxFQUFFLEdBQUdJLENBQUMsQ0FBQ0wsQ0FBRixHQUFNckQsQ0FBTixHQUFVMEQsQ0FBQyxDQUFDekQsQ0FBRixHQUFNRixDQUFoQixHQUFvQjJELENBQUMsQ0FBQzNELENBQUYsR0FBTUUsQ0FBckM7QUFDQSxRQUFNc0QsRUFBRSxHQUFHRyxDQUFDLENBQUNMLENBQUYsR0FBTXBELENBQU4sR0FBVXlELENBQUMsQ0FBQzNELENBQUYsR0FBTUMsQ0FBaEIsR0FBb0IwRCxDQUFDLENBQUMxRCxDQUFGLEdBQU1ELENBQXJDO0FBQ0EsUUFBTXlELEVBQUUsR0FBRyxDQUFDRSxDQUFDLENBQUMzRCxDQUFILEdBQU9BLENBQVAsR0FBVzJELENBQUMsQ0FBQzFELENBQUYsR0FBTUEsQ0FBakIsR0FBcUIwRCxDQUFDLENBQUN6RCxDQUFGLEdBQU1BLENBQXRDO0FBQ0FkLElBQUFBLEdBQUcsQ0FBQ1ksQ0FBSixHQUFRcUQsRUFBRSxHQUFHTSxDQUFDLENBQUNMLENBQVAsR0FBV0csRUFBRSxHQUFHLENBQUNFLENBQUMsQ0FBQzNELENBQW5CLEdBQXVCdUQsRUFBRSxHQUFHLENBQUNJLENBQUMsQ0FBQ3pELENBQS9CLEdBQW1Dc0QsRUFBRSxHQUFHLENBQUNHLENBQUMsQ0FBQzFELENBQTNDLEdBQStDa0MsQ0FBQyxDQUFDbkMsQ0FBekQ7QUFDQVosSUFBQUEsR0FBRyxDQUFDYSxDQUFKLEdBQVFzRCxFQUFFLEdBQUdJLENBQUMsQ0FBQ0wsQ0FBUCxHQUFXRyxFQUFFLEdBQUcsQ0FBQ0UsQ0FBQyxDQUFDMUQsQ0FBbkIsR0FBdUJ1RCxFQUFFLEdBQUcsQ0FBQ0csQ0FBQyxDQUFDM0QsQ0FBL0IsR0FBbUNxRCxFQUFFLEdBQUcsQ0FBQ00sQ0FBQyxDQUFDekQsQ0FBM0MsR0FBK0NpQyxDQUFDLENBQUNsQyxDQUF6RDtBQUNBYixJQUFBQSxHQUFHLENBQUNjLENBQUosR0FBUXNELEVBQUUsR0FBR0csQ0FBQyxDQUFDTCxDQUFQLEdBQVdHLEVBQUUsR0FBRyxDQUFDRSxDQUFDLENBQUN6RCxDQUFuQixHQUF1Qm1ELEVBQUUsR0FBRyxDQUFDTSxDQUFDLENBQUMxRCxDQUEvQixHQUFtQ3NELEVBQUUsR0FBRyxDQUFDSSxDQUFDLENBQUMzRCxDQUEzQyxHQUErQ21DLENBQUMsQ0FBQ2pDLENBQXpEO0FBQ0EsV0FBT2QsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7T0FLT3lFLHNCQUFQLDZCQUNJekUsR0FESixFQUNjZ0IsQ0FEZCxFQUMwQnVELENBRDFCLEVBQ3VDeEIsQ0FEdkMsRUFDbUR5QixDQURuRCxFQUMrRDtBQUMzRCxRQUFNNUQsQ0FBQyxHQUFHSSxDQUFDLENBQUNKLENBQUYsR0FBTW1DLENBQUMsQ0FBQ25DLENBQWxCO0FBQ0EsUUFBTUMsQ0FBQyxHQUFHRyxDQUFDLENBQUNILENBQUYsR0FBTWtDLENBQUMsQ0FBQ2xDLENBQWxCO0FBQ0EsUUFBTUMsQ0FBQyxHQUFHRSxDQUFDLENBQUNGLENBQUYsR0FBTWlDLENBQUMsQ0FBQ2pDLENBQWxCO0FBQ0EsUUFBTW1ELEVBQUUsR0FBR00sQ0FBQyxDQUFDTCxDQUFGLEdBQU10RCxDQUFOLEdBQVUyRCxDQUFDLENBQUMxRCxDQUFGLEdBQU1DLENBQWhCLEdBQW9CeUQsQ0FBQyxDQUFDekQsQ0FBRixHQUFNRCxDQUFyQztBQUNBLFFBQU1zRCxFQUFFLEdBQUdJLENBQUMsQ0FBQ0wsQ0FBRixHQUFNckQsQ0FBTixHQUFVMEQsQ0FBQyxDQUFDekQsQ0FBRixHQUFNRixDQUFoQixHQUFvQjJELENBQUMsQ0FBQzNELENBQUYsR0FBTUUsQ0FBckM7QUFDQSxRQUFNc0QsRUFBRSxHQUFHRyxDQUFDLENBQUNMLENBQUYsR0FBTXBELENBQU4sR0FBVXlELENBQUMsQ0FBQzNELENBQUYsR0FBTUMsQ0FBaEIsR0FBb0IwRCxDQUFDLENBQUMxRCxDQUFGLEdBQU1ELENBQXJDO0FBQ0EsUUFBTXlELEVBQUUsR0FBR0UsQ0FBQyxDQUFDM0QsQ0FBRixHQUFNQSxDQUFOLEdBQVUyRCxDQUFDLENBQUMxRCxDQUFGLEdBQU1BLENBQWhCLEdBQW9CMEQsQ0FBQyxDQUFDekQsQ0FBRixHQUFNQSxDQUFyQztBQUNBZCxJQUFBQSxHQUFHLENBQUNZLENBQUosR0FBUSxDQUFDcUQsRUFBRSxHQUFHTSxDQUFDLENBQUNMLENBQVAsR0FBV0csRUFBRSxHQUFHRSxDQUFDLENBQUMzRCxDQUFsQixHQUFzQnVELEVBQUUsR0FBR0ksQ0FBQyxDQUFDekQsQ0FBN0IsR0FBaUNzRCxFQUFFLEdBQUdHLENBQUMsQ0FBQzFELENBQXpDLElBQThDMkQsQ0FBQyxDQUFDNUQsQ0FBeEQ7QUFDQVosSUFBQUEsR0FBRyxDQUFDYSxDQUFKLEdBQVEsQ0FBQ3NELEVBQUUsR0FBR0ksQ0FBQyxDQUFDTCxDQUFQLEdBQVdHLEVBQUUsR0FBR0UsQ0FBQyxDQUFDMUQsQ0FBbEIsR0FBc0J1RCxFQUFFLEdBQUdHLENBQUMsQ0FBQzNELENBQTdCLEdBQWlDcUQsRUFBRSxHQUFHTSxDQUFDLENBQUN6RCxDQUF6QyxJQUE4QzBELENBQUMsQ0FBQzNELENBQXhEO0FBQ0FiLElBQUFBLEdBQUcsQ0FBQ2MsQ0FBSixHQUFRLENBQUNzRCxFQUFFLEdBQUdHLENBQUMsQ0FBQ0wsQ0FBUCxHQUFXRyxFQUFFLEdBQUdFLENBQUMsQ0FBQ3pELENBQWxCLEdBQXNCbUQsRUFBRSxHQUFHTSxDQUFDLENBQUMxRCxDQUE3QixHQUFpQ3NELEVBQUUsR0FBR0ksQ0FBQyxDQUFDM0QsQ0FBekMsSUFBOEM0RCxDQUFDLENBQUMxRCxDQUF4RDtBQUNBLFdBQU9kLEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7Ozs7O09BV08wRSxVQUFQLGlCQUF1QzFFLEdBQXZDLEVBQWlEOEQsQ0FBakQsRUFBeURhLENBQXpELEVBQWlFM0QsQ0FBakUsRUFBNEU7QUFDeEU7QUFDQXRCLElBQUFBLEVBQUUsR0FBR29FLENBQUMsQ0FBQ2xELENBQUYsR0FBTStELENBQUMsQ0FBQy9ELENBQWI7QUFDQWpCLElBQUFBLEVBQUUsR0FBR21FLENBQUMsQ0FBQ2pELENBQUYsR0FBTThELENBQUMsQ0FBQzlELENBQWI7QUFDQWpCLElBQUFBLEVBQUUsR0FBR2tFLENBQUMsQ0FBQ2hELENBQUYsR0FBTTZELENBQUMsQ0FBQzdELENBQWIsQ0FKd0UsQ0FNeEU7O0FBQ0EsUUFBTXVDLEdBQUcsR0FBRy9CLElBQUksQ0FBQytCLEdBQUwsQ0FBU3JDLENBQVQsQ0FBWjtBQUNBLFFBQU1zQyxHQUFHLEdBQUdoQyxJQUFJLENBQUNnQyxHQUFMLENBQVN0QyxDQUFULENBQVo7QUFDQSxRQUFNNEQsRUFBRSxHQUFHbEYsRUFBWDtBQUNBLFFBQU1tRixFQUFFLEdBQUdsRixFQUFFLEdBQUcwRCxHQUFMLEdBQVd6RCxFQUFFLEdBQUcwRCxHQUEzQjtBQUNBLFFBQU13QixFQUFFLEdBQUduRixFQUFFLEdBQUcyRCxHQUFMLEdBQVcxRCxFQUFFLEdBQUd5RCxHQUEzQixDQVh3RSxDQWF4RTs7QUFDQXJELElBQUFBLEdBQUcsQ0FBQ1ksQ0FBSixHQUFRZ0UsRUFBRSxHQUFHRCxDQUFDLENBQUMvRCxDQUFmO0FBQ0FaLElBQUFBLEdBQUcsQ0FBQ2EsQ0FBSixHQUFRZ0UsRUFBRSxHQUFHRixDQUFDLENBQUM5RCxDQUFmO0FBQ0FiLElBQUFBLEdBQUcsQ0FBQ2MsQ0FBSixHQUFRZ0UsRUFBRSxHQUFHSCxDQUFDLENBQUM3RCxDQUFmO0FBRUEsV0FBT2QsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7Ozs7T0FXTytFLFVBQVAsaUJBQXVDL0UsR0FBdkMsRUFBaUQ4RCxDQUFqRCxFQUF5RGEsQ0FBekQsRUFBaUUzRCxDQUFqRSxFQUE0RTtBQUN4RTtBQUNBdEIsSUFBQUEsRUFBRSxHQUFHb0UsQ0FBQyxDQUFDbEQsQ0FBRixHQUFNK0QsQ0FBQyxDQUFDL0QsQ0FBYjtBQUNBakIsSUFBQUEsRUFBRSxHQUFHbUUsQ0FBQyxDQUFDakQsQ0FBRixHQUFNOEQsQ0FBQyxDQUFDOUQsQ0FBYjtBQUNBakIsSUFBQUEsRUFBRSxHQUFHa0UsQ0FBQyxDQUFDaEQsQ0FBRixHQUFNNkQsQ0FBQyxDQUFDN0QsQ0FBYixDQUp3RSxDQU14RTs7QUFDQSxRQUFNdUMsR0FBRyxHQUFHL0IsSUFBSSxDQUFDK0IsR0FBTCxDQUFTckMsQ0FBVCxDQUFaO0FBQ0EsUUFBTXNDLEdBQUcsR0FBR2hDLElBQUksQ0FBQ2dDLEdBQUwsQ0FBU3RDLENBQVQsQ0FBWjtBQUNBLFFBQU00RCxFQUFFLEdBQUdoRixFQUFFLEdBQUcwRCxHQUFMLEdBQVc1RCxFQUFFLEdBQUcyRCxHQUEzQjtBQUNBLFFBQU13QixFQUFFLEdBQUdsRixFQUFYO0FBQ0EsUUFBTW1GLEVBQUUsR0FBR2xGLEVBQUUsR0FBR3lELEdBQUwsR0FBVzNELEVBQUUsR0FBRzRELEdBQTNCLENBWHdFLENBYXhFOztBQUNBdEQsSUFBQUEsR0FBRyxDQUFDWSxDQUFKLEdBQVFnRSxFQUFFLEdBQUdELENBQUMsQ0FBQy9ELENBQWY7QUFDQVosSUFBQUEsR0FBRyxDQUFDYSxDQUFKLEdBQVFnRSxFQUFFLEdBQUdGLENBQUMsQ0FBQzlELENBQWY7QUFDQWIsSUFBQUEsR0FBRyxDQUFDYyxDQUFKLEdBQVFnRSxFQUFFLEdBQUdILENBQUMsQ0FBQzdELENBQWY7QUFFQSxXQUFPZCxHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7OztPQVdPZ0YsVUFBUCxpQkFBdUNoRixHQUF2QyxFQUFpRDhELENBQWpELEVBQXlEYSxDQUF6RCxFQUFpRTNELENBQWpFLEVBQTRFO0FBQ3hFO0FBQ0F0QixJQUFBQSxFQUFFLEdBQUdvRSxDQUFDLENBQUNsRCxDQUFGLEdBQU0rRCxDQUFDLENBQUMvRCxDQUFiO0FBQ0FqQixJQUFBQSxFQUFFLEdBQUdtRSxDQUFDLENBQUNqRCxDQUFGLEdBQU04RCxDQUFDLENBQUM5RCxDQUFiO0FBQ0FqQixJQUFBQSxFQUFFLEdBQUdrRSxDQUFDLENBQUNoRCxDQUFGLEdBQU02RCxDQUFDLENBQUM3RCxDQUFiLENBSndFLENBTXhFOztBQUNBLFFBQU11QyxHQUFHLEdBQUcvQixJQUFJLENBQUMrQixHQUFMLENBQVNyQyxDQUFULENBQVo7QUFDQSxRQUFNc0MsR0FBRyxHQUFHaEMsSUFBSSxDQUFDZ0MsR0FBTCxDQUFTdEMsQ0FBVCxDQUFaO0FBQ0EsUUFBTTRELEVBQUUsR0FBR2xGLEVBQUUsR0FBRzJELEdBQUwsR0FBVzFELEVBQUUsR0FBRzJELEdBQTNCO0FBQ0EsUUFBTXVCLEVBQUUsR0FBR25GLEVBQUUsR0FBRzRELEdBQUwsR0FBVzNELEVBQUUsR0FBRzBELEdBQTNCO0FBQ0EsUUFBTXlCLEVBQUUsR0FBR2xGLEVBQVgsQ0FYd0UsQ0FheEU7O0FBQ0FJLElBQUFBLEdBQUcsQ0FBQ1ksQ0FBSixHQUFRZ0UsRUFBRSxHQUFHRCxDQUFDLENBQUMvRCxDQUFmO0FBQ0FaLElBQUFBLEdBQUcsQ0FBQ2EsQ0FBSixHQUFRZ0UsRUFBRSxHQUFHRixDQUFDLENBQUM5RCxDQUFmO0FBQ0FiLElBQUFBLEdBQUcsQ0FBQ2MsQ0FBSixHQUFRZ0UsRUFBRSxHQUFHSCxDQUFDLENBQUM3RCxDQUFmO0FBRUEsV0FBT2QsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7T0FRT2lGLGVBQVAsc0JBQTRDakUsQ0FBNUMsRUFBb0RJLENBQXBELEVBQTREO0FBQ3hELFdBQU9KLENBQUMsQ0FBQ0osQ0FBRixLQUFRUSxDQUFDLENBQUNSLENBQVYsSUFBZUksQ0FBQyxDQUFDSCxDQUFGLEtBQVFPLENBQUMsQ0FBQ1AsQ0FBekIsSUFBOEJHLENBQUMsQ0FBQ0YsQ0FBRixLQUFRTSxDQUFDLENBQUNOLENBQS9DO0FBQ0g7QUFFRDs7Ozs7Ozs7OztPQVFPb0UsU0FBUCxnQkFBc0NsRSxDQUF0QyxFQUE4Q0ksQ0FBOUMsRUFBc0QrRCxPQUF0RCxFQUF5RTtBQUFBLFFBQW5CQSxPQUFtQjtBQUFuQkEsTUFBQUEsT0FBbUIsR0FBVC9DLGNBQVM7QUFBQTs7QUFBQSxRQUMxRGdELEVBRDBELEdBQ3JDcEUsQ0FEcUMsQ0FDN0RKLENBRDZEO0FBQUEsUUFDbkR5RSxFQURtRCxHQUNyQ3JFLENBRHFDLENBQ3RESCxDQURzRDtBQUFBLFFBQzVDeUUsRUFENEMsR0FDckN0RSxDQURxQyxDQUMvQ0YsQ0FEK0M7QUFBQSxRQUUxRHlFLEVBRjBELEdBRXJDbkUsQ0FGcUMsQ0FFN0RSLENBRjZEO0FBQUEsUUFFbkQ0RSxFQUZtRCxHQUVyQ3BFLENBRnFDLENBRXREUCxDQUZzRDtBQUFBLFFBRTVDNEUsRUFGNEMsR0FFckNyRSxDQUZxQyxDQUUvQ04sQ0FGK0M7QUFHckUsV0FDSVEsSUFBSSxDQUFDYSxHQUFMLENBQVNpRCxFQUFFLEdBQUdHLEVBQWQsS0FDQUosT0FBTyxHQUFHN0QsSUFBSSxDQUFDRyxHQUFMLENBQVMsR0FBVCxFQUFjSCxJQUFJLENBQUNhLEdBQUwsQ0FBU2lELEVBQVQsQ0FBZCxFQUE0QjlELElBQUksQ0FBQ2EsR0FBTCxDQUFTb0QsRUFBVCxDQUE1QixDQURWLElBRUFqRSxJQUFJLENBQUNhLEdBQUwsQ0FBU2tELEVBQUUsR0FBR0csRUFBZCxLQUNBTCxPQUFPLEdBQUc3RCxJQUFJLENBQUNHLEdBQUwsQ0FBUyxHQUFULEVBQWNILElBQUksQ0FBQ2EsR0FBTCxDQUFTa0QsRUFBVCxDQUFkLEVBQTRCL0QsSUFBSSxDQUFDYSxHQUFMLENBQVNxRCxFQUFULENBQTVCLENBSFYsSUFJQWxFLElBQUksQ0FBQ2EsR0FBTCxDQUFTbUQsRUFBRSxHQUFHRyxFQUFkLEtBQ0FOLE9BQU8sR0FBRzdELElBQUksQ0FBQ0csR0FBTCxDQUFTLEdBQVQsRUFBY0gsSUFBSSxDQUFDYSxHQUFMLENBQVNtRCxFQUFULENBQWQsRUFBNEJoRSxJQUFJLENBQUNhLEdBQUwsQ0FBU3NELEVBQVQsQ0FBNUIsQ0FOZDtBQVFIO0FBRUQ7Ozs7Ozs7Ozs7T0FRT0MsUUFBUCxlQUFxQzFFLENBQXJDLEVBQTZDSSxDQUE3QyxFQUFxRDtBQUNqRHZCLElBQUFBLElBQUksQ0FBQ3dDLFNBQUwsQ0FBZXNELElBQWYsRUFBcUIzRSxDQUFyQjtBQUNBbkIsSUFBQUEsSUFBSSxDQUFDd0MsU0FBTCxDQUFldUQsSUFBZixFQUFxQnhFLENBQXJCO0FBQ0EsUUFBTXlFLE1BQU0sR0FBR2hHLElBQUksQ0FBQ3lDLEdBQUwsQ0FBU3FELElBQVQsRUFBZUMsSUFBZixDQUFmOztBQUNBLFFBQUlDLE1BQU0sR0FBRyxHQUFiLEVBQWtCO0FBQ2QsYUFBTyxDQUFQO0FBQ0g7O0FBQ0QsUUFBSUEsTUFBTSxHQUFHLENBQUMsR0FBZCxFQUFtQjtBQUNmLGFBQU92RSxJQUFJLENBQUM0QixFQUFaO0FBQ0g7O0FBQ0QsV0FBTzVCLElBQUksQ0FBQ3dFLElBQUwsQ0FBVUQsTUFBVixDQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7O09BVU9FLGlCQUFQLHdCQUE4Qy9GLEdBQTlDLEVBQXdEZ0IsQ0FBeEQsRUFBZ0VnRixDQUFoRSxFQUF3RTtBQUNwRSxXQUFPbkcsSUFBSSxDQUFDSSxRQUFMLENBQWNELEdBQWQsRUFBbUJnQixDQUFuQixFQUFzQm5CLElBQUksQ0FBQ29HLE9BQUwsQ0FBYWpHLEdBQWIsRUFBa0JnQixDQUFsQixFQUFxQmdGLENBQXJCLENBQXRCLENBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7Ozs7T0FVT0MsVUFBUCxpQkFBdUNqRyxHQUF2QyxFQUFpRGdCLENBQWpELEVBQXlESSxDQUF6RCxFQUFpRTtBQUM3RCxRQUFNOEUsTUFBTSxHQUFHckcsSUFBSSxDQUFDbUMsU0FBTCxDQUFlWixDQUFmLENBQWY7O0FBQ0EsUUFBSThFLE1BQU0sR0FBRyxRQUFiLEVBQXVCO0FBQ25CLGFBQU9yRyxJQUFJLENBQUNxQixHQUFMLENBQVNsQixHQUFULEVBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQixDQUFwQixDQUFQO0FBQ0gsS0FGRCxNQUVPO0FBQ0gsYUFBT0gsSUFBSSxDQUFDTyxjQUFMLENBQW9CSixHQUFwQixFQUF5Qm9CLENBQXpCLEVBQTRCdkIsSUFBSSxDQUFDeUMsR0FBTCxDQUFTdEIsQ0FBVCxFQUFZSSxDQUFaLElBQWlCOEUsTUFBN0MsQ0FBUDtBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozs7Ozs7T0FTT0MsVUFBUCxpQkFBeURuRyxHQUF6RCxFQUFtRThELENBQW5FLEVBQWlGc0MsR0FBakYsRUFBMEY7QUFBQSxRQUFUQSxHQUFTO0FBQVRBLE1BQUFBLEdBQVMsR0FBSCxDQUFHO0FBQUE7O0FBQ3RGcEcsSUFBQUEsR0FBRyxDQUFDb0csR0FBRyxHQUFHLENBQVAsQ0FBSCxHQUFldEMsQ0FBQyxDQUFDbEQsQ0FBakI7QUFDQVosSUFBQUEsR0FBRyxDQUFDb0csR0FBRyxHQUFHLENBQVAsQ0FBSCxHQUFldEMsQ0FBQyxDQUFDakQsQ0FBakI7QUFDQWIsSUFBQUEsR0FBRyxDQUFDb0csR0FBRyxHQUFHLENBQVAsQ0FBSCxHQUFldEMsQ0FBQyxDQUFDaEQsQ0FBakI7QUFFQSxXQUFPZCxHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7T0FTT3FHLFlBQVAsbUJBQTBDckcsR0FBMUMsRUFBb0RzRyxHQUFwRCxFQUFxRkYsR0FBckYsRUFBOEY7QUFBQSxRQUFUQSxHQUFTO0FBQVRBLE1BQUFBLEdBQVMsR0FBSCxDQUFHO0FBQUE7O0FBQzFGcEcsSUFBQUEsR0FBRyxDQUFDWSxDQUFKLEdBQVEwRixHQUFHLENBQUNGLEdBQUcsR0FBRyxDQUFQLENBQVg7QUFDQXBHLElBQUFBLEdBQUcsQ0FBQ2EsQ0FBSixHQUFReUYsR0FBRyxDQUFDRixHQUFHLEdBQUcsQ0FBUCxDQUFYO0FBQ0FwRyxJQUFBQSxHQUFHLENBQUNjLENBQUosR0FBUXdGLEdBQUcsQ0FBQ0YsR0FBRyxHQUFHLENBQVAsQ0FBWDtBQUNBLFdBQU9wRyxHQUFQO0FBQ0g7QUFHRDs7Ozs7Ozt3QkF0MEJrQjtBQUFFLGFBQU8sSUFBSUgsSUFBSixDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZixDQUFQO0FBQTJCOzs7O0FBRy9DOzs7Ozs7O3dCQU9tQjtBQUFFLGFBQU8sSUFBSUEsSUFBSixFQUFQO0FBQW9COzs7O0FBR3pDOzs7Ozs7O3dCQU9pQjtBQUFFLGFBQU8sSUFBSUEsSUFBSixDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZixDQUFQO0FBQTJCOzs7O0FBRzlDOzs7Ozs7O3dCQU9vQjtBQUFFLGFBQU8sSUFBSUEsSUFBSixDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZixDQUFQO0FBQTJCOzs7O0FBR2pEOzs7Ozs7O3dCQU9vQjtBQUFFLGFBQU8sSUFBSUEsSUFBSixDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZixDQUFQO0FBQTJCOzs7QUE0eUJqRDs7Ozs7Ozs7Ozs7QUFXQSxnQkFBYWUsQ0FBYixFQUFtQ0MsQ0FBbkMsRUFBa0RDLENBQWxELEVBQWlFO0FBQUE7O0FBQUEsUUFBcERGLENBQW9EO0FBQXBEQSxNQUFBQSxDQUFvRCxHQUFqQyxDQUFpQztBQUFBOztBQUFBLFFBQTlCQyxDQUE4QjtBQUE5QkEsTUFBQUEsQ0FBOEIsR0FBbEIsQ0FBa0I7QUFBQTs7QUFBQSxRQUFmQyxDQUFlO0FBQWZBLE1BQUFBLENBQWUsR0FBSCxDQUFHO0FBQUE7O0FBQzdEO0FBRDZELFVBNzNCakV5RixHQTYzQmlFLEdBNzNCMUQxRyxJQUFJLENBQUMyRyxTQUFMLENBQWV6RSxHQTYzQjJDO0FBQUEsVUE1M0JqRTBFLE1BNDNCaUUsR0E1M0J4RDVHLElBQUksQ0FBQzJHLFNBQUwsQ0FBZXhFLFNBNDNCeUM7QUFBQSxVQTMzQmpFMEUsT0EyM0JpRSxHQTMzQnREN0csSUFBSSxDQUFDMkcsU0FBTCxDQUFldkcsUUEyM0J1QztBQUFBLFVBdjNCakUwRyxPQXUzQmlFLEdBdjNCdEQ5RyxJQUFJLENBQUMyRyxTQUFMLENBQWVwRyxjQXUzQnVDO0FBQUEsVUFuM0JqRXdHLE9BbTNCaUUsR0FuM0J0RC9HLElBQUksQ0FBQzJHLFNBQUwsQ0FBZWxHLE1BbTNCdUM7QUFBQSxVQS8yQmpFdUcsU0ErMkJpRSxHQS8yQnJEaEgsSUFBSSxDQUFDMkcsU0FBTCxDQUFlaEcsUUErMkJzQztBQUFBLFVBMzJCakVzRyxPQTIyQmlFLEdBMzJCdkRqSCxJQUFJLENBQUMyRyxTQUFMLENBQWU5RixNQTIyQndDO0FBQUEsVUF0QmpFRSxDQXNCaUU7QUFBQSxVQWxCakVDLENBa0JpRTtBQUFBLFVBZGpFQyxDQWNpRTtBQUFBLFVBNFVqRTRFLEtBNVVpRSxHQTRVekRxQixnQkFBS1AsU0FBTCxDQUFlZCxLQTVVMEM7QUFBQSxVQXdWakVPLE9BeFZpRSxHQXdWdkRjLGdCQUFLUCxTQUFMLENBQWVQLE9BeFZ3Qzs7QUFFN0QsUUFBSXJGLENBQUMsSUFBSSxPQUFPQSxDQUFQLEtBQWEsUUFBdEIsRUFBZ0M7QUFDNUIsWUFBS0UsQ0FBTCxHQUFTRixDQUFDLENBQUNFLENBQVg7QUFDQSxZQUFLRCxDQUFMLEdBQVNELENBQUMsQ0FBQ0MsQ0FBWDtBQUNBLFlBQUtELENBQUwsR0FBU0EsQ0FBQyxDQUFDQSxDQUFYO0FBQ0gsS0FKRCxNQUtLO0FBQ0QsWUFBS0EsQ0FBTCxHQUFTQSxDQUFUO0FBQ0EsWUFBS0MsQ0FBTCxHQUFTQSxDQUFUO0FBQ0EsWUFBS0MsQ0FBTCxHQUFTQSxDQUFUO0FBQ0g7O0FBWDREO0FBWWhFO0FBRUQ7Ozs7Ozs7O1NBTUFDLFFBQUEsaUJBQWU7QUFDWCxXQUFPLElBQUlsQixJQUFKLENBQVMsS0FBS2UsQ0FBZCxFQUFpQixLQUFLQyxDQUF0QixFQUF5QixLQUFLQyxDQUE5QixDQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7OztTQVFBSSxNQUFBLGFBQUs4RixRQUFMLEVBQTJCO0FBQ3ZCLFNBQUtwRyxDQUFMLEdBQVNvRyxRQUFRLENBQUNwRyxDQUFsQjtBQUNBLFNBQUtDLENBQUwsR0FBU21HLFFBQVEsQ0FBQ25HLENBQWxCO0FBQ0EsU0FBS0MsQ0FBTCxHQUFTa0csUUFBUSxDQUFDbEcsQ0FBbEI7QUFDQSxXQUFPLElBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7U0FPQW9FLFNBQUEsZ0JBQVErQixLQUFSLEVBQThCO0FBQzFCLFdBQU9BLEtBQUssSUFBSSxLQUFLckcsQ0FBTCxLQUFXcUcsS0FBSyxDQUFDckcsQ0FBMUIsSUFBK0IsS0FBS0MsQ0FBTCxLQUFXb0csS0FBSyxDQUFDcEcsQ0FBaEQsSUFBcUQsS0FBS0MsQ0FBTCxLQUFXbUcsS0FBSyxDQUFDbkcsQ0FBN0U7QUFDSDtBQUdEOzs7Ozs7Ozs7Ozs7U0FVQW9HLGNBQUEscUJBQWFELEtBQWIsRUFBMEJFLFFBQTFCLEVBQXFEO0FBQ2pELFFBQUksS0FBS3ZHLENBQUwsR0FBU3VHLFFBQVQsSUFBcUJGLEtBQUssQ0FBQ3JHLENBQTNCLElBQWdDcUcsS0FBSyxDQUFDckcsQ0FBTixJQUFXLEtBQUtBLENBQUwsR0FBU3VHLFFBQXhELEVBQWtFO0FBQzlELFVBQUksS0FBS3RHLENBQUwsR0FBU3NHLFFBQVQsSUFBcUJGLEtBQUssQ0FBQ3BHLENBQTNCLElBQWdDb0csS0FBSyxDQUFDcEcsQ0FBTixJQUFXLEtBQUtBLENBQUwsR0FBU3NHLFFBQXhELEVBQWtFO0FBQzlELFlBQUksS0FBS3JHLENBQUwsR0FBU3FHLFFBQVQsSUFBcUJGLEtBQUssQ0FBQ25HLENBQTNCLElBQWdDbUcsS0FBSyxDQUFDbkcsQ0FBTixJQUFXLEtBQUtBLENBQUwsR0FBU3FHLFFBQXhELEVBQ0ksT0FBTyxJQUFQO0FBQ1A7QUFDSjs7QUFDRCxXQUFPLEtBQVA7QUFDSDtBQUVEOzs7Ozs7OztTQU1BQyxXQUFBLG9CQUFvQjtBQUNoQixXQUFPLE1BQ0gsS0FBS3hHLENBQUwsQ0FBT3lHLE9BQVAsQ0FBZSxDQUFmLENBREcsR0FDaUIsSUFEakIsR0FFSCxLQUFLeEcsQ0FBTCxDQUFPd0csT0FBUCxDQUFlLENBQWYsQ0FGRyxHQUVpQixJQUZqQixHQUdILEtBQUt2RyxDQUFMLENBQU91RyxPQUFQLENBQWUsQ0FBZixDQUhHLEdBR2lCLEdBSHhCO0FBS0g7QUFFRDs7Ozs7Ozs7Ozs7U0FTQXZFLE9BQUEsY0FBTXdFLEVBQU4sRUFBZ0JDLEtBQWhCLEVBQStCdkgsR0FBL0IsRUFBaUQ7QUFDN0NBLElBQUFBLEdBQUcsR0FBR0EsR0FBRyxJQUFJLElBQUlILElBQUosRUFBYjtBQUNBQSxJQUFBQSxJQUFJLENBQUNpRCxJQUFMLENBQVU5QyxHQUFWLEVBQWUsSUFBZixFQUFxQnNILEVBQXJCLEVBQXlCQyxLQUF6QjtBQUNBLFdBQU92SCxHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7Ozs7U0FZQXdILFNBQUEsZ0JBQVFDLGFBQVIsRUFBNkJDLGFBQTdCLEVBQXdEO0FBQ3BELFNBQUs5RyxDQUFMLEdBQVMrRyxpQkFBS0gsTUFBTCxDQUFZLEtBQUs1RyxDQUFqQixFQUFvQjZHLGFBQWEsQ0FBQzdHLENBQWxDLEVBQXFDOEcsYUFBYSxDQUFDOUcsQ0FBbkQsQ0FBVDtBQUNBLFNBQUtDLENBQUwsR0FBUzhHLGlCQUFLSCxNQUFMLENBQVksS0FBSzNHLENBQWpCLEVBQW9CNEcsYUFBYSxDQUFDNUcsQ0FBbEMsRUFBcUM2RyxhQUFhLENBQUM3RyxDQUFuRCxDQUFUO0FBQ0EsU0FBS0MsQ0FBTCxHQUFTNkcsaUJBQUtILE1BQUwsQ0FBWSxLQUFLMUcsQ0FBakIsRUFBb0IyRyxhQUFhLENBQUMzRyxDQUFsQyxFQUFxQzRHLGFBQWEsQ0FBQzVHLENBQW5ELENBQVQ7QUFDQSxXQUFPLElBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7O1NBUUE4RyxVQUFBLGlCQUFTN0gsTUFBVCxFQUE2QjtBQUN6QixTQUFLYSxDQUFMLElBQVViLE1BQU0sQ0FBQ2EsQ0FBakI7QUFDQSxTQUFLQyxDQUFMLElBQVVkLE1BQU0sQ0FBQ2MsQ0FBakI7QUFDQSxTQUFLQyxDQUFMLElBQVVmLE1BQU0sQ0FBQ2UsQ0FBakI7QUFDQSxXQUFPLElBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7O1NBUUFLLE1BQUEsYUFBS3BCLE1BQUwsRUFBbUJDLEdBQW5CLEVBQXFDO0FBQ2pDQSxJQUFBQSxHQUFHLEdBQUdBLEdBQUcsSUFBSSxJQUFJSCxJQUFKLEVBQWI7QUFDQUcsSUFBQUEsR0FBRyxDQUFDWSxDQUFKLEdBQVEsS0FBS0EsQ0FBTCxHQUFTYixNQUFNLENBQUNhLENBQXhCO0FBQ0FaLElBQUFBLEdBQUcsQ0FBQ2EsQ0FBSixHQUFRLEtBQUtBLENBQUwsR0FBU2QsTUFBTSxDQUFDYyxDQUF4QjtBQUNBYixJQUFBQSxHQUFHLENBQUNjLENBQUosR0FBUSxLQUFLQSxDQUFMLEdBQVNmLE1BQU0sQ0FBQ2UsQ0FBeEI7QUFDQSxXQUFPZCxHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7OztTQVFBQyxXQUFBLGtCQUFVRixNQUFWLEVBQThCO0FBQzFCLFNBQUthLENBQUwsSUFBVWIsTUFBTSxDQUFDYSxDQUFqQjtBQUNBLFNBQUtDLENBQUwsSUFBVWQsTUFBTSxDQUFDYyxDQUFqQjtBQUNBLFNBQUtDLENBQUwsSUFBVWYsTUFBTSxDQUFDZSxDQUFqQjtBQUNBLFdBQU8sSUFBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7U0FRQVYsaUJBQUEsd0JBQWdCRCxHQUFoQixFQUFtQztBQUMvQixTQUFLUyxDQUFMLElBQVVULEdBQVY7QUFDQSxTQUFLVSxDQUFMLElBQVVWLEdBQVY7QUFDQSxTQUFLVyxDQUFMLElBQVVYLEdBQVY7QUFDQSxXQUFPLElBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7O1NBUUFLLFdBQUEsa0JBQVVULE1BQVYsRUFBOEI7QUFDMUIsU0FBS2EsQ0FBTCxJQUFVYixNQUFNLENBQUNhLENBQWpCO0FBQ0EsU0FBS0MsQ0FBTCxJQUFVZCxNQUFNLENBQUNjLENBQWpCO0FBQ0EsU0FBS0MsQ0FBTCxJQUFVZixNQUFNLENBQUNlLENBQWpCO0FBQ0EsV0FBTyxJQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7OztTQVFBUixTQUFBLGdCQUFRSCxHQUFSLEVBQTJCO0FBQ3ZCLFNBQUtTLENBQUwsSUFBVVQsR0FBVjtBQUNBLFNBQUtVLENBQUwsSUFBVVYsR0FBVjtBQUNBLFNBQUtXLENBQUwsSUFBVVgsR0FBVjtBQUNBLFdBQU8sSUFBUDtBQUNIO0FBRUQ7Ozs7Ozs7OztTQU9BTyxTQUFBLGtCQUFnQjtBQUNaLFNBQUtFLENBQUwsR0FBUyxDQUFDLEtBQUtBLENBQWY7QUFDQSxTQUFLQyxDQUFMLEdBQVMsQ0FBQyxLQUFLQSxDQUFmO0FBQ0EsU0FBS0MsQ0FBTCxHQUFTLENBQUMsS0FBS0EsQ0FBZjtBQUNBLFdBQU8sSUFBUDtBQUNIO0FBRUQ7Ozs7Ozs7OztTQU9Bd0IsTUFBQSxhQUFLdkMsTUFBTCxFQUEyQjtBQUN2QixXQUFPLEtBQUthLENBQUwsR0FBU2IsTUFBTSxDQUFDYSxDQUFoQixHQUFvQixLQUFLQyxDQUFMLEdBQVNkLE1BQU0sQ0FBQ2MsQ0FBcEMsR0FBd0MsS0FBS0MsQ0FBTCxHQUFTZixNQUFNLENBQUNlLENBQS9EO0FBQ0g7QUFFRDs7Ozs7Ozs7OztTQVFBeUIsUUFBQSxlQUFPeEMsTUFBUCxFQUFxQkMsR0FBckIsRUFBdUM7QUFDbkNBLElBQUFBLEdBQUcsR0FBR0EsR0FBRyxJQUFJLElBQUlILElBQUosRUFBYjtBQUNBQSxJQUFBQSxJQUFJLENBQUMwQyxLQUFMLENBQVd2QyxHQUFYLEVBQWdCLElBQWhCLEVBQXNCRCxNQUF0QjtBQUNBLFdBQU9DLEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7OztTQVNBK0IsTUFBQSxlQUFlO0FBQ1gsV0FBT1QsSUFBSSxDQUFDTyxJQUFMLENBQVUsS0FBS2pCLENBQUwsR0FBUyxLQUFLQSxDQUFkLEdBQWtCLEtBQUtDLENBQUwsR0FBUyxLQUFLQSxDQUFoQyxHQUFvQyxLQUFLQyxDQUFMLEdBQVMsS0FBS0EsQ0FBNUQsQ0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7O1NBTUFrQixZQUFBLHFCQUFxQjtBQUNqQixXQUFPLEtBQUtwQixDQUFMLEdBQVMsS0FBS0EsQ0FBZCxHQUFrQixLQUFLQyxDQUFMLEdBQVMsS0FBS0EsQ0FBaEMsR0FBb0MsS0FBS0MsQ0FBTCxHQUFTLEtBQUtBLENBQXpEO0FBQ0g7QUFFRDs7Ozs7Ozs7O1NBT0ErRyxnQkFBQSx5QkFBdUI7QUFDbkJoSSxJQUFBQSxJQUFJLENBQUN3QyxTQUFMLENBQWUsSUFBZixFQUFxQixJQUFyQjtBQUNBLFdBQU8sSUFBUDtBQUNIOztBQUVEOzs7Ozs7Ozs7Ozs7O1NBYUFBLFlBQUEsbUJBQVdyQyxHQUFYLEVBQTZCO0FBQ3pCQSxJQUFBQSxHQUFHLEdBQUdBLEdBQUcsSUFBSSxJQUFJSCxJQUFKLEVBQWI7QUFDQUEsSUFBQUEsSUFBSSxDQUFDd0MsU0FBTCxDQUFlckMsR0FBZixFQUFvQixJQUFwQjtBQUNBLFdBQU9BLEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7U0FPQXVELGdCQUFBLHVCQUFlRSxDQUFmLEVBQXdCekQsR0FBeEIsRUFBMEM7QUFDdENBLElBQUFBLEdBQUcsR0FBR0EsR0FBRyxJQUFJLElBQUlILElBQUosRUFBYjtBQUNBQSxJQUFBQSxJQUFJLENBQUMwRCxhQUFMLENBQW1CdkQsR0FBbkIsRUFBd0IsSUFBeEIsRUFBOEJ5RCxDQUE5QjtBQUNBLFdBQU96RCxHQUFQO0FBQ0g7QUFFRDs7Ozs7OztTQUtBOEgsVUFBQSxtQkFBbUI7QUFDaEIsV0FBT3hHLElBQUksQ0FBQ0csR0FBTCxDQUFTLEtBQUtiLENBQWQsRUFBaUIsS0FBS0MsQ0FBdEIsRUFBeUIsS0FBS0MsQ0FBOUIsQ0FBUDtBQUNGO0FBRUQ7Ozs7Ozs7OztBQW9CQTs7QUFFQTs7Ozs7Ozs7O1NBU0FpSCxZQUFBLG1CQUFXaEksTUFBWCxFQUFtQjtBQUNmaUksSUFBQUEsRUFBRSxDQUFDQyxNQUFILENBQVUsSUFBVixFQUFnQixnQkFBaEIsRUFBa0MsTUFBbEMsRUFBMEMscUNBQTFDO0FBQ0EsUUFBSUMsSUFBSSxHQUFHLElBQUluQixlQUFKLENBQVMsS0FBS25HLENBQWQsRUFBaUIsS0FBS0MsQ0FBdEIsQ0FBWDtBQUNBLFFBQUlzSCxJQUFJLEdBQUcsSUFBSXBCLGVBQUosQ0FBU2hILE1BQU0sQ0FBQ2EsQ0FBaEIsRUFBbUJiLE1BQU0sQ0FBQ2MsQ0FBMUIsQ0FBWDtBQUNBLFdBQU9xSCxJQUFJLENBQUNILFNBQUwsQ0FBZUksSUFBZixDQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7U0FTQUMsU0FBQSxnQkFBUUMsT0FBUixFQUFpQnJJLEdBQWpCLEVBQXNCO0FBQ2xCZ0ksSUFBQUEsRUFBRSxDQUFDQyxNQUFILENBQVUsSUFBVixFQUFnQixhQUFoQixFQUErQixNQUEvQixFQUF1Qyx3Q0FBdkM7QUFDQSxXQUFPbEIsZ0JBQUtQLFNBQUwsQ0FBZTRCLE1BQWYsQ0FBc0JFLElBQXRCLENBQTJCLElBQTNCLEVBQWlDRCxPQUFqQyxFQUEwQ3JJLEdBQTFDLENBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7OztTQVNBdUksYUFBQSxvQkFBWUYsT0FBWixFQUFxQjtBQUNqQkwsSUFBQUEsRUFBRSxDQUFDQyxNQUFILENBQVUsSUFBVixFQUFnQixpQkFBaEIsRUFBbUMsTUFBbkMsRUFBMkMsdUNBQTNDO0FBQ0EsV0FBT2xCLGdCQUFLUCxTQUFMLENBQWUrQixVQUFmLENBQTBCRCxJQUExQixDQUErQixJQUEvQixFQUFxQ0QsT0FBckMsQ0FBUDtBQUNIOzs7RUExd0M2Qkc7OztBQUFiM0ksS0FFVkMsTUFBUUQsSUFBSSxDQUFDSTtBQUZISixLQUdWSyxNQUFRTCxJQUFJLENBQUNXO0FBSEhYLEtBSVZVLFFBQVFWLElBQUksQ0FBQ087QUFKSFAsS0FLVjBHLE1BQVExRyxJQUFJLENBQUNrQztBQUxIbEMsS0FNVjRJLG1CQUFtQjVJLElBQUksQ0FBQ21DO0FBTmRuQyxLQU9WUSxNQUFNUixJQUFJLENBQUNTO0FBUERULEtBdUNENkksUUFBUTdJLElBQUksQ0FBQzhJO0FBdkNaOUksS0FpREQrSSxTQUFTL0ksSUFBSSxDQUFDZ0o7QUFqRGJoSixLQTJERGlKLE9BQU9qSixJQUFJLENBQUNrSjtBQTNEWGxKLEtBcUVEbUosVUFBVW5KLElBQUksQ0FBQ29KO0FBckVkcEosS0ErRURxSixVQUFVckosSUFBSSxDQUFDc0o7QUE4ckNuQyxJQUFNeEQsSUFBSSxHQUFHLElBQUk5RixJQUFKLEVBQWI7QUFDQSxJQUFNK0YsSUFBSSxHQUFHLElBQUkvRixJQUFKLEVBQWI7O0FBRUF1SixvQkFBUUMsVUFBUixDQUFtQixTQUFuQixFQUE4QnhKLElBQTlCLEVBQW9DO0FBQUVlLEVBQUFBLENBQUMsRUFBRSxDQUFMO0FBQVFDLEVBQUFBLENBQUMsRUFBRSxDQUFYO0FBQWNDLEVBQUFBLENBQUMsRUFBRTtBQUFqQixDQUFwQztBQUVBOzs7O0FBSUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFjQWtILEVBQUUsQ0FBQ3NCLEVBQUgsR0FBUSxTQUFTQSxFQUFULENBQWExSSxDQUFiLEVBQWdCQyxDQUFoQixFQUFtQkMsQ0FBbkIsRUFBc0I7QUFDMUIsU0FBTyxJQUFJakIsSUFBSixDQUFTZSxDQUFULEVBQVlDLENBQVosRUFBZUMsQ0FBZixDQUFQO0FBQ0gsQ0FGRDs7QUFJQWtILEVBQUUsQ0FBQ25JLElBQUgsR0FBVUEsSUFBViIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IFZhbHVlVHlwZSBmcm9tICcuL3ZhbHVlLXR5cGUnO1xuaW1wb3J0IENDQ2xhc3MgZnJvbSAnLi4vcGxhdGZvcm0vQ0NDbGFzcyc7XG5pbXBvcnQgbWlzYyBmcm9tICcuLi91dGlscy9taXNjJztcbmltcG9ydCBWZWMyIGZyb20gJy4vdmVjMic7XG5pbXBvcnQgTWF0NCBmcm9tICcuL21hdDQnO1xuaW1wb3J0IHsgSVZlYzNMaWtlLCBJTWF0NExpa2UsIElRdWF0TGlrZSwgSU1hdDNMaWtlIH0gZnJvbSAnLi9tYXRoJztcbmltcG9ydCB7IEVQU0lMT04sIHJhbmRvbSB9IGZyb20gJy4vdXRpbHMnO1xuXG5sZXQgX3g6IG51bWJlciA9IDAuMDtcbmxldCBfeTogbnVtYmVyID0gMC4wO1xubGV0IF96OiBudW1iZXIgPSAwLjA7XG5cbi8qKlxuICogISNlbiBSZXByZXNlbnRhdGlvbiBvZiAzRCB2ZWN0b3JzIGFuZCBwb2ludHMuXG4gKiAhI3poIOihqOekuiAzRCDlkJHph4/lkozlnZDmoIdcbiAqXG4gKiBAY2xhc3MgVmVjM1xuICogQGV4dGVuZHMgVmFsdWVUeXBlXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmVjMyBleHRlbmRzIFZhbHVlVHlwZSB7XG4gICAgLy8gZGVwcmVjYXRlZFxuICAgIHN0YXRpYyBzdWIgICA9IFZlYzMuc3VidHJhY3Q7XG4gICAgc3RhdGljIG11bCAgID0gVmVjMy5tdWx0aXBseTtcbiAgICBzdGF0aWMgc2NhbGUgPSBWZWMzLm11bHRpcGx5U2NhbGFyO1xuICAgIHN0YXRpYyBtYWcgICA9IFZlYzMubGVuO1xuICAgIHN0YXRpYyBzcXVhcmVkTWFnbml0dWRlID0gVmVjMy5sZW5ndGhTcXI7XG4gICAgc3RhdGljIGRpdiA9IFZlYzMuZGl2aWRlO1xuICAgIG1hZyAgPSBWZWMzLnByb3RvdHlwZS5sZW47XG4gICAgbWFnU3FyID0gVmVjMy5wcm90b3R5cGUubGVuZ3RoU3FyO1xuICAgIHN1YlNlbGYgID0gVmVjMy5wcm90b3R5cGUuc3VidHJhY3Q7XG4gICAgc3ViICh2ZWN0b3I6IFZlYzMsIG91dD86IFZlYzMpIHtcbiAgICAgICAgcmV0dXJuIFZlYzMuc3VidHJhY3Qob3V0IHx8IG5ldyBWZWMzKCksIHRoaXMsIHZlY3Rvcik7XG4gICAgfVxuICAgIG11bFNlbGYgID0gVmVjMy5wcm90b3R5cGUubXVsdGlwbHlTY2FsYXI7XG4gICAgbXVsIChudW06IG51bWJlciwgb3V0PzogVmVjMykge1xuICAgICAgICByZXR1cm4gVmVjMy5tdWx0aXBseVNjYWxhcihvdXQgfHwgbmV3IFZlYzMoKSwgdGhpcywgbnVtKTtcbiAgICB9XG4gICAgZGl2U2VsZiAgPSBWZWMzLnByb3RvdHlwZS5kaXZpZGU7XG4gICAgZGl2ICh2ZWN0b3I6IFZlYzMsIG91dD86IFZlYzMpIHtcbiAgICAgICAgcmV0dXJuIFZlYzMuZGl2aWRlKG91dCB8fCBuZXcgVmVjMygpLCB0aGlzLCB2ZWN0b3IpO1xuICAgIH1cbiAgICBzY2FsZVNlbGYgPSBWZWMzLnByb3RvdHlwZS5tdWx0aXBseTtcbiAgICBzY2FsZSAodmVjdG9yOiBWZWMzLCBvdXQ/OiBWZWMzKSB7XG4gICAgICAgIHJldHVybiBWZWMzLm11bHRpcGx5KG91dCB8fCBuZXcgVmVjMygpLCB0aGlzLCB2ZWN0b3IpO1xuICAgIH1cbiAgICBuZWdTZWxmID0gVmVjMy5wcm90b3R5cGUubmVnYXRlO1xuICAgIG5lZyAob3V0PzogVmVjMykge1xuICAgICAgICByZXR1cm4gVmVjMy5uZWdhdGUob3V0IHx8IG5ldyBWZWMzKCksIHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gcmV0dXJuIGEgVmVjMyBvYmplY3Qgd2l0aCB4ID0gMSwgeSA9IDEsIHogPSAxLlxuICAgICAqICEjemgg5pawIFZlYzMg5a+56LGh44CCXG4gICAgICogQHByb3BlcnR5IE9ORVxuICAgICAqIEB0eXBlIFZlYzNcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGdldCBPTkUgKCkgeyByZXR1cm4gbmV3IFZlYzMoMSwgMSwgMSk7IH1cbiAgICBzdGF0aWMgcmVhZG9ubHkgT05FX1IgPSBWZWMzLk9ORTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gcmV0dXJuIGEgVmVjMyBvYmplY3Qgd2l0aCB4ID0gMCwgeSA9IDAsIHogPSAwLlxuICAgICAqICEjemgg6L+U5ZueIHggPSAw77yMeSA9IDDvvIx6ID0gMCDnmoQgVmVjMyDlr7nosaHjgIJcbiAgICAgKiBAcHJvcGVydHkgWkVST1xuICAgICAqIEB0eXBlIFZlYzNcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGdldCBaRVJPICgpIHsgcmV0dXJuIG5ldyBWZWMzKCk7IH1cbiAgICBzdGF0aWMgcmVhZG9ubHkgWkVST19SID0gVmVjMy5aRVJPO1xuXG4gICAgLyoqXG4gICAgICogISNlbiByZXR1cm4gYSBWZWMzIG9iamVjdCB3aXRoIHggPSAwLCB5ID0gMSwgeiA9IDAuXG4gICAgICogISN6aCDov5Tlm54geCA9IDAsIHkgPSAxLCB6ID0gMCDnmoQgVmVjMyDlr7nosaHjgIJcbiAgICAgKiBAcHJvcGVydHkgVVBcbiAgICAgKiBAdHlwZSBWZWMzXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgVVAgKCkgeyByZXR1cm4gbmV3IFZlYzMoMCwgMSwgMCk7IH1cbiAgICBzdGF0aWMgcmVhZG9ubHkgVVBfUiA9IFZlYzMuVVA7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIHJldHVybiBhIFZlYzMgb2JqZWN0IHdpdGggeCA9IDEsIHkgPSAwLCB6ID0gMC5cbiAgICAgKiAhI3poIOi/lOWbniB4ID0gMe+8jHkgPSAw77yMeiA9IDAg55qEIFZlYzMg5a+56LGh44CCXG4gICAgICogQHByb3BlcnR5IFJJR0hUXG4gICAgICogQHR5cGUgVmVjM1xuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IFJJR0hUICgpIHsgcmV0dXJuIG5ldyBWZWMzKDEsIDAsIDApOyB9XG4gICAgc3RhdGljIHJlYWRvbmx5IFJJR0hUX1IgPSBWZWMzLlJJR0hUO1xuICAgIFxuICAgIC8qKlxuICAgICAqICEjZW4gcmV0dXJuIGEgVmVjMyBvYmplY3Qgd2l0aCB4ID0gMCwgeSA9IDAsIHogPSAxLlxuICAgICAqICEjemgg6L+U5ZueIHggPSAw77yMeSA9IDDvvIx6ID0gMSDnmoQgVmVjMyDlr7nosaHjgIJcbiAgICAgKiBAcHJvcGVydHkgRlJPTlRcbiAgICAgKiBAdHlwZSBWZWMzXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgRlJPTlQgKCkgeyByZXR1cm4gbmV3IFZlYzMoMCwgMCwgMSk7IH1cbiAgICBzdGF0aWMgcmVhZG9ubHkgRlJPTlRfUiA9IFZlYzMuRlJPTlQ7XG5cblxuICAgIC8qKlxuICAgICAqICEjemgg5bCG55uu5qCH6LWL5YC85Li66Zu25ZCR6YePXG4gICAgICogISNlbiBUaGUgdGFyZ2V0IG9mIGFuIGFzc2lnbm1lbnQgemVybyB2ZWN0b3JcbiAgICAgKiBAbWV0aG9kIHplcm9cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyB6ZXJvPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgemVybzxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCkge1xuICAgICAgICBvdXQueCA9IDA7XG4gICAgICAgIG91dC55ID0gMDtcbiAgICAgICAgb3V0LnogPSAwO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6I635b6X5oyH5a6a5ZCR6YeP55qE5ou36LSdXG4gICAgICogISNlbiBPYnRhaW5pbmcgY29weSB2ZWN0b3JzIGRlc2lnbmF0ZWRcbiAgICAgKiBAbWV0aG9kIGNsb25lXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgY2xvbmU8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAoYTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgY2xvbmU8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAoYTogT3V0KSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMyhhLngsIGEueSwgYS56KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWkjeWItuebruagh+WQkemHj1xuICAgICAqICEjZW4gQ29weSB0aGUgdGFyZ2V0IHZlY3RvclxuICAgICAqIEBtZXRob2QgY29weVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIGNvcHk8T3V0IGV4dGVuZHMgSVZlYzNMaWtlLCBWZWMzTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBWZWMzTGlrZSlcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGNvcHk8T3V0IGV4dGVuZHMgSVZlYzNMaWtlLCBWZWMzTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBWZWMzTGlrZSkge1xuICAgICAgICBvdXQueCA9IGEueDtcbiAgICAgICAgb3V0LnkgPSBhLnk7XG4gICAgICAgIG91dC56ID0gYS56O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6K6+572u5ZCR6YeP5YC8XG4gICAgICogISNlbiBTZXQgdG8gdmFsdWVcbiAgICAgKiBAbWV0aG9kIHNldFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIHNldDxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcilcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHNldDxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcikge1xuICAgICAgICBvdXQueCA9IHg7XG4gICAgICAgIG91dC55ID0geTtcbiAgICAgICAgb3V0LnogPSB6O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP5Yqg5rOVXG4gICAgICogISNlbiBFbGVtZW50LXdpc2UgdmVjdG9yIGFkZGl0aW9uXG4gICAgICogQG1ldGhvZCBhZGRcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBhZGQ8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgYWRkPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICBvdXQueCA9IGEueCArIGIueDtcbiAgICAgICAgb3V0LnkgPSBhLnkgKyBiLnk7XG4gICAgICAgIG91dC56ID0gYS56ICsgYi56O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP5YeP5rOVXG4gICAgICogISNlbiBFbGVtZW50LXdpc2UgdmVjdG9yIHN1YnRyYWN0aW9uXG4gICAgICogQG1ldGhvZCBzdWJ0cmFjdFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIHN1YnRyYWN0PE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHN1YnRyYWN0PE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICBvdXQueCA9IGEueCAtIGIueDtcbiAgICAgICAgb3V0LnkgPSBhLnkgLSBiLnk7XG4gICAgICAgIG91dC56ID0gYS56IC0gYi56O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP5LmY5rOVICjliIbph4/np68pXG4gICAgICogISNlbiBFbGVtZW50LXdpc2UgdmVjdG9yIG11bHRpcGxpY2F0aW9uIChwcm9kdWN0IGNvbXBvbmVudClcbiAgICAgKiBAbWV0aG9kIG11bHRpcGx5XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgbXVsdGlwbHk8T3V0IGV4dGVuZHMgSVZlYzNMaWtlLCBWZWMzTGlrZV8xIGV4dGVuZHMgSVZlYzNMaWtlLCBWZWMzTGlrZV8yIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IFZlYzNMaWtlXzEsIGI6IFZlYzNMaWtlXzIpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBtdWx0aXBseTxPdXQgZXh0ZW5kcyBJVmVjM0xpa2UsIFZlYzNMaWtlXzEgZXh0ZW5kcyBJVmVjM0xpa2UsIFZlYzNMaWtlXzIgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogVmVjM0xpa2VfMSwgYjogVmVjM0xpa2VfMikge1xuICAgICAgICBvdXQueCA9IGEueCAqIGIueDtcbiAgICAgICAgb3V0LnkgPSBhLnkgKiBiLnk7XG4gICAgICAgIG91dC56ID0gYS56ICogYi56O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP6Zmk5rOVXG4gICAgICogISNlbiBFbGVtZW50LXdpc2UgdmVjdG9yIGRpdmlzaW9uXG4gICAgICogQG1ldGhvZCBkaXZpZGVcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBkaXZpZGU8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZGl2aWRlPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICBvdXQueCA9IGEueCAvIGIueDtcbiAgICAgICAgb3V0LnkgPSBhLnkgLyBiLnk7XG4gICAgICAgIG91dC56ID0gYS56IC8gYi56O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP5ZCR5LiK5Y+W5pW0XG4gICAgICogISNlbiBSb3VuZGluZyB1cCBieSBlbGVtZW50cyBvZiB0aGUgdmVjdG9yXG4gICAgICogQG1ldGhvZCBjZWlsXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgY2VpbDxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgY2VpbDxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XG4gICAgICAgIG91dC54ID0gTWF0aC5jZWlsKGEueCk7XG4gICAgICAgIG91dC55ID0gTWF0aC5jZWlsKGEueSk7XG4gICAgICAgIG91dC56ID0gTWF0aC5jZWlsKGEueik7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/lkJHkuIvlj5bmlbRcbiAgICAgKiAhI2VuIEVsZW1lbnQgdmVjdG9yIGJ5IHJvdW5kaW5nIGRvd25cbiAgICAgKiBAbWV0aG9kIGZsb29yXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgZmxvb3I8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGZsb29yPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcbiAgICAgICAgb3V0LnggPSBNYXRoLmZsb29yKGEueCk7XG4gICAgICAgIG91dC55ID0gTWF0aC5mbG9vcihhLnkpO1xuICAgICAgICBvdXQueiA9IE1hdGguZmxvb3IoYS56KTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+acgOWwj+WAvFxuICAgICAqICEjZW4gVGhlIG1pbmltdW0gYnktZWxlbWVudCB2ZWN0b3JcbiAgICAgKiBAbWV0aG9kIG1pblxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIG1pbjxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBtaW48T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KSB7XG4gICAgICAgIG91dC54ID0gTWF0aC5taW4oYS54LCBiLngpO1xuICAgICAgICBvdXQueSA9IE1hdGgubWluKGEueSwgYi55KTtcbiAgICAgICAgb3V0LnogPSBNYXRoLm1pbihhLnosIGIueik7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/mnIDlpKflgLxcbiAgICAgKiAhI2VuIFRoZSBtYXhpbXVtIHZhbHVlIG9mIHRoZSBlbGVtZW50LXdpc2UgdmVjdG9yXG4gICAgICogQG1ldGhvZCBtYXhcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBtYXg8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgbWF4PE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICBvdXQueCA9IE1hdGgubWF4KGEueCwgYi54KTtcbiAgICAgICAgb3V0LnkgPSBNYXRoLm1heChhLnksIGIueSk7XG4gICAgICAgIG91dC56ID0gTWF0aC5tYXgoYS56LCBiLnopO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP5Zub6IiN5LqU5YWl5Y+W5pW0XG4gICAgICogISNlbiBFbGVtZW50LXdpc2UgdmVjdG9yIG9mIHJvdW5kaW5nIHRvIHdob2xlXG4gICAgICogQG1ldGhvZCByb3VuZFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIHJvdW5kPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyByb3VuZDxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XG4gICAgICAgIG91dC54ID0gTWF0aC5yb3VuZChhLngpO1xuICAgICAgICBvdXQueSA9IE1hdGgucm91bmQoYS55KTtcbiAgICAgICAgb3V0LnogPSBNYXRoLnJvdW5kKGEueik7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlkJHph4/moIfph4/kuZjms5VcbiAgICAgKiAhI2VuIFZlY3RvciBzY2FsYXIgbXVsdGlwbGljYXRpb25cbiAgICAgKiBAbWV0aG9kIG11bHRpcGx5U2NhbGFyXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgbXVsdGlwbHlTY2FsYXI8T3V0IGV4dGVuZHMgSVZlYzNMaWtlLCBWZWMzTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBWZWMzTGlrZSwgYjogbnVtYmVyKVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgbXVsdGlwbHlTY2FsYXI8T3V0IGV4dGVuZHMgSVZlYzNMaWtlLCBWZWMzTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBWZWMzTGlrZSwgYjogbnVtYmVyKSB7XG4gICAgICAgIG91dC54ID0gYS54ICogYjtcbiAgICAgICAgb3V0LnkgPSBhLnkgKiBiO1xuICAgICAgICBvdXQueiA9IGEueiAqIGI7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/kuZjliqA6IEEgKyBCICogc2NhbGVcbiAgICAgKiAhI2VuIEVsZW1lbnQtd2lzZSB2ZWN0b3IgbXVsdGlwbHkgYWRkOiBBICsgQiAqIHNjYWxlXG4gICAgICogQG1ldGhvZCBzY2FsZUFuZEFkZFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIHNjYWxlQW5kQWRkPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCwgc2NhbGU6IG51bWJlcilcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHNjYWxlQW5kQWRkPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCwgc2NhbGU6IG51bWJlcikge1xuICAgICAgICBvdXQueCA9IGEueCArIGIueCAqIHNjYWxlO1xuICAgICAgICBvdXQueSA9IGEueSArIGIueSAqIHNjYWxlO1xuICAgICAgICBvdXQueiA9IGEueiArIGIueiAqIHNjYWxlO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5rGC5Lik5ZCR6YeP55qE5qyn5rCP6Led56a7XG4gICAgICogISNlbiBTZWVraW5nIHR3byB2ZWN0b3JzIEV1Y2xpZGVhbiBkaXN0YW5jZVxuICAgICAqIEBtZXRob2QgZGlzdGFuY2VcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBkaXN0YW5jZTxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChhOiBPdXQsIGI6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGRpc3RhbmNlPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKGE6IE91dCwgYjogT3V0KSB7XG4gICAgICAgIF94ID0gYi54IC0gYS54O1xuICAgICAgICBfeSA9IGIueSAtIGEueTtcbiAgICAgICAgX3ogPSBiLnogLSBhLno7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoX3ggKiBfeCArIF95ICogX3kgKyBfeiAqIF96KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOaxguS4pOWQkemHj+eahOasp+awj+i3neemu+W5s+aWuVxuICAgICAqICEjZW4gRXVjbGlkZWFuIGRpc3RhbmNlIHNxdWFyZWQgc2Vla2luZyB0d28gdmVjdG9yc1xuICAgICAqIEBtZXRob2Qgc3F1YXJlZERpc3RhbmNlXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgc3F1YXJlZERpc3RhbmNlPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKGE6IE91dCwgYjogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgc3F1YXJlZERpc3RhbmNlPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKGE6IE91dCwgYjogT3V0KSB7XG4gICAgICAgIF94ID0gYi54IC0gYS54O1xuICAgICAgICBfeSA9IGIueSAtIGEueTtcbiAgICAgICAgX3ogPSBiLnogLSBhLno7XG4gICAgICAgIHJldHVybiBfeCAqIF94ICsgX3kgKiBfeSArIF96ICogX3o7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmsYLlkJHph4/plb/luqZcbiAgICAgKiAhI2VuIFNlZWtpbmcgdmVjdG9yIGxlbmd0aFxuICAgICAqIEBtZXRob2QgbGVuXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgbGVuPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKGE6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGxlbjxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChhOiBPdXQpIHtcbiAgICAgICAgX3ggPSBhLng7XG4gICAgICAgIF95ID0gYS55O1xuICAgICAgICBfeiA9IGEuejtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChfeCAqIF94ICsgX3kgKiBfeSArIF96ICogX3opO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5rGC5ZCR6YeP6ZW/5bqm5bmz5pa5XG4gICAgICogISNlbiBTZWVraW5nIHNxdWFyZWQgdmVjdG9yIGxlbmd0aFxuICAgICAqIEBtZXRob2QgbGVuZ3RoU3FyXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgbGVuZ3RoU3FyPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKGE6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGxlbmd0aFNxcjxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChhOiBPdXQpIHtcbiAgICAgICAgX3ggPSBhLng7XG4gICAgICAgIF95ID0gYS55O1xuICAgICAgICBfeiA9IGEuejtcbiAgICAgICAgcmV0dXJuIF94ICogX3ggKyBfeSAqIF95ICsgX3ogKiBfejtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+WPlui0n1xuICAgICAqICEjZW4gQnkgdGFraW5nIHRoZSBuZWdhdGl2ZSBlbGVtZW50cyBvZiB0aGUgdmVjdG9yXG4gICAgICogQG1ldGhvZCBuZWdhdGVcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBuZWdhdGU8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIG5lZ2F0ZTxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XG4gICAgICAgIG91dC54ID0gLWEueDtcbiAgICAgICAgb3V0LnkgPSAtYS55O1xuICAgICAgICBvdXQueiA9IC1hLno7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/lj5blgJLmlbDvvIzmjqXov5EgMCDml7bov5Tlm54gSW5maW5pdHlcbiAgICAgKiAhI2VuIEVsZW1lbnQgdmVjdG9yIGJ5IHRha2luZyB0aGUgaW52ZXJzZSwgcmV0dXJuIG5lYXIgMCBJbmZpbml0eVxuICAgICAqIEBtZXRob2QgaW52ZXJzZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIGludmVyc2U8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGludmVyc2U8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xuICAgICAgICBvdXQueCA9IDEuMCAvIGEueDtcbiAgICAgICAgb3V0LnkgPSAxLjAgLyBhLnk7XG4gICAgICAgIG91dC56ID0gMS4wIC8gYS56O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP5Y+W5YCS5pWw77yM5o6l6L+RIDAg5pe26L+U5ZueIDBcbiAgICAgKiAhI2VuIEVsZW1lbnQgdmVjdG9yIGJ5IHRha2luZyB0aGUgaW52ZXJzZSwgcmV0dXJuIG5lYXIgMCAwXG4gICAgICogQG1ldGhvZCBpbnZlcnNlU2FmZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIGludmVyc2VTYWZlPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBpbnZlcnNlU2FmZTxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XG4gICAgICAgIF94ID0gYS54O1xuICAgICAgICBfeSA9IGEueTtcbiAgICAgICAgX3ogPSBhLno7XG5cbiAgICAgICAgaWYgKE1hdGguYWJzKF94KSA8IEVQU0lMT04pIHtcbiAgICAgICAgICAgIG91dC54ID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dC54ID0gMS4wIC8gX3g7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoTWF0aC5hYnMoX3kpIDwgRVBTSUxPTikge1xuICAgICAgICAgICAgb3V0LnkgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0LnkgPSAxLjAgLyBfeTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChNYXRoLmFicyhfeikgPCBFUFNJTE9OKSB7XG4gICAgICAgICAgICBvdXQueiA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXQueiA9IDEuMCAvIF96O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOW9kuS4gOWMluWQkemHj1xuICAgICAqICEjZW4gTm9ybWFsaXplZCB2ZWN0b3JcbiAgICAgKiBAbWV0aG9kIG5vcm1hbGl6ZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIG5vcm1hbGl6ZTxPdXQgZXh0ZW5kcyBJVmVjM0xpa2UsIFZlYzNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IFZlYzNMaWtlKVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgbm9ybWFsaXplPE91dCBleHRlbmRzIElWZWMzTGlrZSwgVmVjM0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogVmVjM0xpa2UpIHtcbiAgICAgICAgX3ggPSBhLng7XG4gICAgICAgIF95ID0gYS55O1xuICAgICAgICBfeiA9IGEuejtcblxuICAgICAgICBsZXQgbGVuID0gX3ggKiBfeCArIF95ICogX3kgKyBfeiAqIF96O1xuICAgICAgICBpZiAobGVuID4gMCkge1xuICAgICAgICAgICAgbGVuID0gMSAvIE1hdGguc3FydChsZW4pO1xuICAgICAgICAgICAgb3V0LnggPSBfeCAqIGxlbjtcbiAgICAgICAgICAgIG91dC55ID0gX3kgKiBsZW47XG4gICAgICAgICAgICBvdXQueiA9IF96ICogbGVuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlkJHph4/ngrnnp6/vvIjmlbDph4/np6/vvIlcbiAgICAgKiAhI2VuIFZlY3RvciBkb3QgcHJvZHVjdCAoc2NhbGFyIHByb2R1Y3QpXG4gICAgICogQG1ldGhvZCBkb3RcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBkb3Q8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAoYTogT3V0LCBiOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBkb3Q8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAoYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgcmV0dXJuIGEueCAqIGIueCArIGEueSAqIGIueSArIGEueiAqIGIuejtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWQkemHj+WPieenr++8iOWQkemHj+enr++8iVxuICAgICAqICEjZW4gVmVjdG9yIGNyb3NzIHByb2R1Y3QgKHZlY3RvciBwcm9kdWN0KVxuICAgICAqIEBtZXRob2QgY3Jvc3NcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBjcm9zczxPdXQgZXh0ZW5kcyBJVmVjM0xpa2UsIFZlYzNMaWtlXzEgZXh0ZW5kcyBJVmVjM0xpa2UsIFZlYzNMaWtlXzIgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogVmVjM0xpa2VfMSwgYjogVmVjM0xpa2VfMilcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGNyb3NzPE91dCBleHRlbmRzIElWZWMzTGlrZSwgVmVjM0xpa2VfMSBleHRlbmRzIElWZWMzTGlrZSwgVmVjM0xpa2VfMiBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBWZWMzTGlrZV8xLCBiOiBWZWMzTGlrZV8yKSB7XG4gICAgICAgIGNvbnN0IHsgeDogYXgsIHk6IGF5LCB6OiBheiB9ID0gYTtcbiAgICAgICAgY29uc3QgeyB4OiBieCwgeTogYnksIHo6IGJ6IH0gPSBiO1xuICAgICAgICBvdXQueCA9IGF5ICogYnogLSBheiAqIGJ5O1xuICAgICAgICBvdXQueSA9IGF6ICogYnggLSBheCAqIGJ6O1xuICAgICAgICBvdXQueiA9IGF4ICogYnkgLSBheSAqIGJ4O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP57q/5oCn5o+S5YC877yaIEEgKyB0ICogKEIgLSBBKVxuICAgICAqICEjZW4gVmVjdG9yIGVsZW1lbnQgYnkgZWxlbWVudCBsaW5lYXIgaW50ZXJwb2xhdGlvbjogQSArIHQgKiAoQiAtIEEpXG4gICAgICogQG1ldGhvZCBsZXJwXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgbGVycDxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQsIHQ6IG51bWJlcilcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGxlcnA8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0LCB0OiBudW1iZXIpIHtcbiAgICAgICAgb3V0LnggPSBhLnggKyB0ICogKGIueCAtIGEueCk7XG4gICAgICAgIG91dC55ID0gYS55ICsgdCAqIChiLnkgLSBhLnkpO1xuICAgICAgICBvdXQueiA9IGEueiArIHQgKiAoYi56IC0gYS56KTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOeUn+aIkOS4gOS4quWcqOWNleS9jeeQg+S9k+S4iuWdh+WMgOWIhuW4g+eahOmaj+acuuWQkemHj1xuICAgICAqICEjZW4gR2VuZXJhdGVzIGEgdW5pZm9ybWx5IGRpc3RyaWJ1dGVkIHJhbmRvbSB2ZWN0b3JzIG9uIHRoZSB1bml0IHNwaGVyZVxuICAgICAqIEBtZXRob2QgcmFuZG9tXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgcmFuZG9tPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBzY2FsZT86IG51bWJlcilcbiAgICAgKiBAcGFyYW0gc2NhbGUg55Sf5oiQ55qE5ZCR6YeP6ZW/5bqmXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyByYW5kb208T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHNjYWxlPzogbnVtYmVyKSB7XG4gICAgICAgIHNjYWxlID0gc2NhbGUgfHwgMS4wO1xuXG4gICAgICAgIGNvbnN0IHBoaSA9IHJhbmRvbSgpICogMi4wICogTWF0aC5QSTtcbiAgICAgICAgY29uc3QgY29zVGhldGEgPSByYW5kb20oKSAqIDIgLSAxO1xuICAgICAgICBjb25zdCBzaW5UaGV0YSA9IE1hdGguc3FydCgxIC0gY29zVGhldGEgKiBjb3NUaGV0YSk7XG5cbiAgICAgICAgb3V0LnggPSBzaW5UaGV0YSAqIE1hdGguY29zKHBoaSkgKiBzY2FsZTtcbiAgICAgICAgb3V0LnkgPSBzaW5UaGV0YSAqIE1hdGguc2luKHBoaSkgKiBzY2FsZTtcbiAgICAgICAgb3V0LnogPSBjb3NUaGV0YSAqIHNjYWxlO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5ZCR6YeP5LiO5Zub57u055+p6Zi15LmY5rOV77yM6buY6K6k5ZCR6YeP56ys5Zub5L2N5Li6IDHjgIJcbiAgICAgKiAhI2VuIEZvdXItZGltZW5zaW9uYWwgdmVjdG9yIGFuZCBtYXRyaXggbXVsdGlwbGljYXRpb24sIHRoZSBkZWZhdWx0IHZlY3RvcnMgZm91cnRoIG9uZS5cbiAgICAgKiBAbWV0aG9kIHRyYW5zZm9ybU1hdDRcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyB0cmFuc2Zvcm1NYXQ0PE91dCBleHRlbmRzIElWZWMzTGlrZSwgVmVjM0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2UsIE1hdExpa2UgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogVmVjM0xpa2UsIG1hdDogTWF0TGlrZSlcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHRyYW5zZm9ybU1hdDQ8T3V0IGV4dGVuZHMgSVZlYzNMaWtlLCBWZWMzTGlrZSBleHRlbmRzIElWZWMzTGlrZSwgTWF0TGlrZSBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBWZWMzTGlrZSwgbWF0OiBNYXRMaWtlKSB7XG4gICAgICAgIF94ID0gYS54O1xuICAgICAgICBfeSA9IGEueTtcbiAgICAgICAgX3ogPSBhLno7XG4gICAgICAgIGxldCBtID0gbWF0Lm07XG4gICAgICAgIGxldCByaHcgPSBtWzNdICogX3ggKyBtWzddICogX3kgKyBtWzExXSAqIF96ICsgbVsxNV07XG4gICAgICAgIHJodyA9IHJodyA/IDEgLyByaHcgOiAxO1xuICAgICAgICBvdXQueCA9IChtWzBdICogX3ggKyBtWzRdICogX3kgKyBtWzhdICogX3ogKyBtWzEyXSkgKiByaHc7XG4gICAgICAgIG91dC55ID0gKG1bMV0gKiBfeCArIG1bNV0gKiBfeSArIG1bOV0gKiBfeiArIG1bMTNdKSAqIHJodztcbiAgICAgICAgb3V0LnogPSAobVsyXSAqIF94ICsgbVs2XSAqIF95ICsgbVsxMF0gKiBfeiArIG1bMTRdKSAqIHJodztcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWQkemHj+S4juWbm+e7tOefqemYteS5mOazle+8jOm7mOiupOWQkemHj+esrOWbm+S9jeS4uiAw44CCXG4gICAgICogISNlbiBGb3VyLWRpbWVuc2lvbmFsIHZlY3RvciBhbmQgbWF0cml4IG11bHRpcGxpY2F0aW9uLCB2ZWN0b3IgZm91cnRoIGRlZmF1bHQgaXMgMC5cbiAgICAgKiBAbWV0aG9kIHRyYW5zZm9ybU1hdDROb3JtYWxcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyB0cmFuc2Zvcm1NYXQ0Tm9ybWFsPE91dCBleHRlbmRzIElWZWMzTGlrZSwgTWF0TGlrZSBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIG1hdDogTWF0TGlrZSlcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHRyYW5zZm9ybU1hdDROb3JtYWw8T3V0IGV4dGVuZHMgSVZlYzNMaWtlLCBNYXRMaWtlIGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgbWF0OiBNYXRMaWtlKSB7XG4gICAgICAgIF94ID0gYS54O1xuICAgICAgICBfeSA9IGEueTtcbiAgICAgICAgX3ogPSBhLno7XG4gICAgICAgIGxldCBtID0gbWF0Lm07XG4gICAgICAgIGxldCByaHcgPSBtWzNdICogX3ggKyBtWzddICogX3kgKyBtWzExXSAqIF96O1xuICAgICAgICByaHcgPSByaHcgPyAxIC8gcmh3IDogMTtcbiAgICAgICAgb3V0LnggPSAobVswXSAqIF94ICsgbVs0XSAqIF95ICsgbVs4XSAqIF96KSAqIHJodztcbiAgICAgICAgb3V0LnkgPSAobVsxXSAqIF94ICsgbVs1XSAqIF95ICsgbVs5XSAqIF96KSAqIHJodztcbiAgICAgICAgb3V0LnogPSAobVsyXSAqIF94ICsgbVs2XSAqIF95ICsgbVsxMF0gKiBfeikgKiByaHc7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlkJHph4/kuI7kuInnu7Tnn6npmLXkuZjms5VcbiAgICAgKiAhI2VuIERpbWVuc2lvbmFsIHZlY3RvciBtYXRyaXggbXVsdGlwbGljYXRpb25cbiAgICAgKiBAbWV0aG9kIHRyYW5zZm9ybU1hdDNcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyB0cmFuc2Zvcm1NYXQzPE91dCBleHRlbmRzIElWZWMzTGlrZSwgTWF0TGlrZSBleHRlbmRzIElNYXQzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIG1hdDogTWF0TGlrZSlcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHRyYW5zZm9ybU1hdDM8T3V0IGV4dGVuZHMgSVZlYzNMaWtlLCBNYXRMaWtlIGV4dGVuZHMgSU1hdDNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgbWF0OiBNYXRMaWtlKSB7XG4gICAgICAgIF94ID0gYS54O1xuICAgICAgICBfeSA9IGEueTtcbiAgICAgICAgX3ogPSBhLno7XG4gICAgICAgIGxldCBtID0gbWF0Lm07XG4gICAgICAgIG91dC54ID0gX3ggKiBtWzBdICsgX3kgKiBtWzNdICsgX3ogKiBtWzZdO1xuICAgICAgICBvdXQueSA9IF94ICogbVsxXSArIF95ICogbVs0XSArIF96ICogbVs3XTtcbiAgICAgICAgb3V0LnogPSBfeCAqIG1bMl0gKyBfeSAqIG1bNV0gKyBfeiAqIG1bOF07XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlkJHph4/ku7/lsITlj5jmjaJcbiAgICAgKiAhI2VuIEFmZmluZSB0cmFuc2Zvcm1hdGlvbiB2ZWN0b3JcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHRyYW5zZm9ybUFmZmluZTxPdXQgZXh0ZW5kcyBJVmVjM0xpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2UsIE1hdExpa2UgZXh0ZW5kcyBJTWF0NExpa2U+XG4gICAgICAgIChvdXQ6IE91dCwgdjogVmVjTGlrZSwgbWF0OiBNYXRMaWtlKSB7XG4gICAgICAgIF94ID0gdi54O1xuICAgICAgICBfeSA9IHYueTtcbiAgICAgICAgX3ogPSB2Lno7XG4gICAgICAgIGxldCBtID0gbWF0Lm07XG4gICAgICAgIG91dC54ID0gbVswXSAqIF94ICsgbVsxXSAqIF95ICsgbVsyXSAqIF96ICsgbVszXTtcbiAgICAgICAgb3V0LnkgPSBtWzRdICogX3ggKyBtWzVdICogX3kgKyBtWzZdICogX3ogKyBtWzddO1xuICAgICAgICBvdXQueCA9IG1bOF0gKiBfeCArIG1bOV0gKiBfeSArIG1bMTBdICogX3ogKyBtWzExXTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWQkemHj+Wbm+WFg+aVsOS5mOazlVxuICAgICAqICEjZW4gVmVjdG9yIHF1YXRlcm5pb24gbXVsdGlwbGljYXRpb25cbiAgICAgKiBAbWV0aG9kIHRyYW5zZm9ybVF1YXRcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyB0cmFuc2Zvcm1RdWF0PE91dCBleHRlbmRzIElWZWMzTGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZSwgUXVhdExpa2UgZXh0ZW5kcyBJUXVhdExpa2U+IChvdXQ6IE91dCwgYTogVmVjTGlrZSwgcTogUXVhdExpa2UpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyB0cmFuc2Zvcm1RdWF0PE91dCBleHRlbmRzIElWZWMzTGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZSwgUXVhdExpa2UgZXh0ZW5kcyBJUXVhdExpa2U+IChvdXQ6IE91dCwgYTogVmVjTGlrZSwgcTogUXVhdExpa2UpIHtcbiAgICAgICAgLy8gYmVuY2htYXJrczogaHR0cDovL2pzcGVyZi5jb20vcXVhdGVybmlvbi10cmFuc2Zvcm0tVmVjMy1pbXBsZW1lbnRhdGlvbnNcblxuICAgICAgICAvLyBjYWxjdWxhdGUgcXVhdCAqIHZlY1xuICAgICAgICBjb25zdCBpeCA9IHEudyAqIGEueCArIHEueSAqIGEueiAtIHEueiAqIGEueTtcbiAgICAgICAgY29uc3QgaXkgPSBxLncgKiBhLnkgKyBxLnogKiBhLnggLSBxLnggKiBhLno7XG4gICAgICAgIGNvbnN0IGl6ID0gcS53ICogYS56ICsgcS54ICogYS55IC0gcS55ICogYS54O1xuICAgICAgICBjb25zdCBpdyA9IC1xLnggKiBhLnggLSBxLnkgKiBhLnkgLSBxLnogKiBhLno7XG5cbiAgICAgICAgLy8gY2FsY3VsYXRlIHJlc3VsdCAqIGludmVyc2UgcXVhdFxuICAgICAgICBvdXQueCA9IGl4ICogcS53ICsgaXcgKiAtcS54ICsgaXkgKiAtcS56IC0gaXogKiAtcS55O1xuICAgICAgICBvdXQueSA9IGl5ICogcS53ICsgaXcgKiAtcS55ICsgaXogKiAtcS54IC0gaXggKiAtcS56O1xuICAgICAgICBvdXQueiA9IGl6ICogcS53ICsgaXcgKiAtcS56ICsgaXggKiAtcS55IC0gaXkgKiAtcS54O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5Lul57yp5pS+IC0+IOaXi+i9rCAtPiDlubPnp7vpobrluo/lj5jmjaLlkJHph49cbiAgICAgKiAhI2VuIFRvIHNjYWxlIC0+IHJvdGF0aW9uIC0+IHRyYW5zZm9ybWF0aW9uIHZlY3RvciBzZXF1ZW5jZSB0cmFuc2xhdGlvblxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgdHJhbnNmb3JtUlRTPE91dCBleHRlbmRzIElWZWMzTGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZSwgUXVhdExpa2UgZXh0ZW5kcyBJUXVhdExpa2U+IChcbiAgICAgICAgb3V0OiBPdXQsIGE6IFZlY0xpa2UsIHI6IFF1YXRMaWtlLCB0OiBWZWNMaWtlLCBzOiBWZWNMaWtlKSB7XG4gICAgICAgIGNvbnN0IHggPSBhLnggKiBzLng7XG4gICAgICAgIGNvbnN0IHkgPSBhLnkgKiBzLnk7XG4gICAgICAgIGNvbnN0IHogPSBhLnogKiBzLno7XG4gICAgICAgIGNvbnN0IGl4ID0gci53ICogeCArIHIueSAqIHogLSByLnogKiB5O1xuICAgICAgICBjb25zdCBpeSA9IHIudyAqIHkgKyByLnogKiB4IC0gci54ICogejtcbiAgICAgICAgY29uc3QgaXogPSByLncgKiB6ICsgci54ICogeSAtIHIueSAqIHg7XG4gICAgICAgIGNvbnN0IGl3ID0gLXIueCAqIHggLSByLnkgKiB5IC0gci56ICogejtcbiAgICAgICAgb3V0LnggPSBpeCAqIHIudyArIGl3ICogLXIueCArIGl5ICogLXIueiAtIGl6ICogLXIueSArIHQueDtcbiAgICAgICAgb3V0LnkgPSBpeSAqIHIudyArIGl3ICogLXIueSArIGl6ICogLXIueCAtIGl4ICogLXIueiArIHQueTtcbiAgICAgICAgb3V0LnogPSBpeiAqIHIudyArIGl3ICogLXIueiArIGl4ICogLXIueSAtIGl5ICogLXIueCArIHQuejtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOS7peW5s+enuyAtPiDml4vovawgLT4g57yp5pS+6aG65bqP6YCG5Y+Y5o2i5ZCR6YePXG4gICAgICogISNlbiBUcmFuc2xhdGlvbmFsIC0+IHJvdGF0aW9uIC0+IFpvb20gaW52ZXJzZSB0cmFuc2Zvcm1hdGlvbiB2ZWN0b3Igc2VxdWVuY2VcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHRyYW5zZm9ybUludmVyc2VSVFM8T3V0IGV4dGVuZHMgSVZlYzNMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlLCBRdWF0TGlrZSBleHRlbmRzIElRdWF0TGlrZT4gKFxuICAgICAgICBvdXQ6IE91dCwgYTogVmVjTGlrZSwgcjogUXVhdExpa2UsIHQ6IFZlY0xpa2UsIHM6IFZlY0xpa2UpIHtcbiAgICAgICAgY29uc3QgeCA9IGEueCAtIHQueDtcbiAgICAgICAgY29uc3QgeSA9IGEueSAtIHQueTtcbiAgICAgICAgY29uc3QgeiA9IGEueiAtIHQuejtcbiAgICAgICAgY29uc3QgaXggPSByLncgKiB4IC0gci55ICogeiArIHIueiAqIHk7XG4gICAgICAgIGNvbnN0IGl5ID0gci53ICogeSAtIHIueiAqIHggKyByLnggKiB6O1xuICAgICAgICBjb25zdCBpeiA9IHIudyAqIHogLSByLnggKiB5ICsgci55ICogeDtcbiAgICAgICAgY29uc3QgaXcgPSByLnggKiB4ICsgci55ICogeSArIHIueiAqIHo7XG4gICAgICAgIG91dC54ID0gKGl4ICogci53ICsgaXcgKiByLnggKyBpeSAqIHIueiAtIGl6ICogci55KSAvIHMueDtcbiAgICAgICAgb3V0LnkgPSAoaXkgKiByLncgKyBpdyAqIHIueSArIGl6ICogci54IC0gaXggKiByLnopIC8gcy55O1xuICAgICAgICBvdXQueiA9IChpeiAqIHIudyArIGl3ICogci56ICsgaXggKiByLnkgLSBpeSAqIHIueCkgLyBzLno7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDnu5UgWCDovbTml4vovazlkJHph4/mjIflrprlvKfluqZcbiAgICAgKiAhI2VuIFJvdGF0aW9uIHZlY3RvciBzcGVjaWZpZWQgYW5nbGUgYWJvdXQgdGhlIFggYXhpc1xuICAgICAqIEBtZXRob2Qgcm90YXRlWFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIHJvdGF0ZVg8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHY6IE91dCwgbzogT3V0LCBhOiBudW1iZXIpXG4gICAgICogQHBhcmFtIHYg5b6F5peL6L2s5ZCR6YePXG4gICAgICogQHBhcmFtIG8g5peL6L2s5Lit5b+DXG4gICAgICogQHBhcmFtIGEg5peL6L2s5byn5bqmXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyByb3RhdGVYPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCB2OiBPdXQsIG86IE91dCwgYTogbnVtYmVyKSB7XG4gICAgICAgIC8vIFRyYW5zbGF0ZSBwb2ludCB0byB0aGUgb3JpZ2luXG4gICAgICAgIF94ID0gdi54IC0gby54O1xuICAgICAgICBfeSA9IHYueSAtIG8ueTtcbiAgICAgICAgX3ogPSB2LnogLSBvLno7XG5cbiAgICAgICAgLy8gcGVyZm9ybSByb3RhdGlvblxuICAgICAgICBjb25zdCBjb3MgPSBNYXRoLmNvcyhhKTtcbiAgICAgICAgY29uc3Qgc2luID0gTWF0aC5zaW4oYSk7XG4gICAgICAgIGNvbnN0IHJ4ID0gX3g7XG4gICAgICAgIGNvbnN0IHJ5ID0gX3kgKiBjb3MgLSBfeiAqIHNpbjtcbiAgICAgICAgY29uc3QgcnogPSBfeSAqIHNpbiArIF96ICogY29zO1xuXG4gICAgICAgIC8vIHRyYW5zbGF0ZSB0byBjb3JyZWN0IHBvc2l0aW9uXG4gICAgICAgIG91dC54ID0gcnggKyBvLng7XG4gICAgICAgIG91dC55ID0gcnkgKyBvLnk7XG4gICAgICAgIG91dC56ID0gcnogKyBvLno7XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOe7lSBZIOi9tOaXi+i9rOWQkemHj+aMh+WumuW8p+W6plxuICAgICAqICEjZW4gUm90YXRpb24gdmVjdG9yIHNwZWNpZmllZCBhbmdsZSBhcm91bmQgdGhlIFkgYXhpc1xuICAgICAqIEBtZXRob2Qgcm90YXRlWVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIHJvdGF0ZVk8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHY6IE91dCwgbzogT3V0LCBhOiBudW1iZXIpXG4gICAgICogQHBhcmFtIHYg5b6F5peL6L2s5ZCR6YePXG4gICAgICogQHBhcmFtIG8g5peL6L2s5Lit5b+DXG4gICAgICogQHBhcmFtIGEg5peL6L2s5byn5bqmXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyByb3RhdGVZPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCB2OiBPdXQsIG86IE91dCwgYTogbnVtYmVyKSB7XG4gICAgICAgIC8vIFRyYW5zbGF0ZSBwb2ludCB0byB0aGUgb3JpZ2luXG4gICAgICAgIF94ID0gdi54IC0gby54O1xuICAgICAgICBfeSA9IHYueSAtIG8ueTtcbiAgICAgICAgX3ogPSB2LnogLSBvLno7XG5cbiAgICAgICAgLy8gcGVyZm9ybSByb3RhdGlvblxuICAgICAgICBjb25zdCBjb3MgPSBNYXRoLmNvcyhhKTtcbiAgICAgICAgY29uc3Qgc2luID0gTWF0aC5zaW4oYSk7XG4gICAgICAgIGNvbnN0IHJ4ID0gX3ogKiBzaW4gKyBfeCAqIGNvcztcbiAgICAgICAgY29uc3QgcnkgPSBfeTtcbiAgICAgICAgY29uc3QgcnogPSBfeiAqIGNvcyAtIF94ICogc2luO1xuXG4gICAgICAgIC8vIHRyYW5zbGF0ZSB0byBjb3JyZWN0IHBvc2l0aW9uXG4gICAgICAgIG91dC54ID0gcnggKyBvLng7XG4gICAgICAgIG91dC55ID0gcnkgKyBvLnk7XG4gICAgICAgIG91dC56ID0gcnogKyBvLno7XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOe7lSBaIOi9tOaXi+i9rOWQkemHj+aMh+WumuW8p+W6plxuICAgICAqICEjZW4gQXJvdW5kIHRoZSBaIGF4aXMgc3BlY2lmaWVkIGFuZ2xlIHZlY3RvclxuICAgICAqIEBtZXRob2Qgcm90YXRlWlxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIHJvdGF0ZVo8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHY6IE91dCwgbzogT3V0LCBhOiBudW1iZXIpXG4gICAgICogQHBhcmFtIHYg5b6F5peL6L2s5ZCR6YePXG4gICAgICogQHBhcmFtIG8g5peL6L2s5Lit5b+DXG4gICAgICogQHBhcmFtIGEg5peL6L2s5byn5bqmXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyByb3RhdGVaPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCB2OiBPdXQsIG86IE91dCwgYTogbnVtYmVyKSB7XG4gICAgICAgIC8vIFRyYW5zbGF0ZSBwb2ludCB0byB0aGUgb3JpZ2luXG4gICAgICAgIF94ID0gdi54IC0gby54O1xuICAgICAgICBfeSA9IHYueSAtIG8ueTtcbiAgICAgICAgX3ogPSB2LnogLSBvLno7XG5cbiAgICAgICAgLy8gcGVyZm9ybSByb3RhdGlvblxuICAgICAgICBjb25zdCBjb3MgPSBNYXRoLmNvcyhhKTtcbiAgICAgICAgY29uc3Qgc2luID0gTWF0aC5zaW4oYSk7XG4gICAgICAgIGNvbnN0IHJ4ID0gX3ggKiBjb3MgLSBfeSAqIHNpbjtcbiAgICAgICAgY29uc3QgcnkgPSBfeCAqIHNpbiArIF95ICogY29zO1xuICAgICAgICBjb25zdCByeiA9IF96O1xuXG4gICAgICAgIC8vIHRyYW5zbGF0ZSB0byBjb3JyZWN0IHBvc2l0aW9uXG4gICAgICAgIG91dC54ID0gcnggKyBvLng7XG4gICAgICAgIG91dC55ID0gcnkgKyBvLnk7XG4gICAgICAgIG91dC56ID0gcnogKyBvLno7XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWQkemHj+etieS7t+WIpOaWrVxuICAgICAqICEjZW4gRXF1aXZhbGVudCB2ZWN0b3JzIEFuYWx5emluZ1xuICAgICAqIEBtZXRob2Qgc3RyaWN0RXF1YWxzXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgc3RyaWN0RXF1YWxzPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKGE6IE91dCwgYjogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgc3RyaWN0RXF1YWxzPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKGE6IE91dCwgYjogT3V0KSB7XG4gICAgICAgIHJldHVybiBhLnggPT09IGIueCAmJiBhLnkgPT09IGIueSAmJiBhLnogPT09IGIuejtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOaOkumZpOa1rueCueaVsOivr+W3rueahOWQkemHj+i/keS8vOetieS7t+WIpOaWrVxuICAgICAqICEjZW4gTmVnYXRpdmUgZXJyb3IgdmVjdG9yIGZsb2F0aW5nIHBvaW50IGFwcHJveGltYXRlbHkgZXF1aXZhbGVudCBBbmFseXppbmdcbiAgICAgKiBAbWV0aG9kIGVxdWFsc1xuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIGVxdWFsczxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChhOiBPdXQsIGI6IE91dCwgZXBzaWxvbiA9IEVQU0lMT04pXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBlcXVhbHM8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAoYTogT3V0LCBiOiBPdXQsIGVwc2lsb24gPSBFUFNJTE9OKSB7XG4gICAgICAgIGNvbnN0IHsgeDogYTAsIHk6IGExLCB6OiBhMiB9ID0gYTtcbiAgICAgICAgY29uc3QgeyB4OiBiMCwgeTogYjEsIHo6IGIyIH0gPSBiO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgTWF0aC5hYnMoYTAgLSBiMCkgPD1cbiAgICAgICAgICAgIGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEwKSwgTWF0aC5hYnMoYjApKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYTEgLSBiMSkgPD1cbiAgICAgICAgICAgIGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGExKSwgTWF0aC5hYnMoYjEpKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYTIgLSBiMikgPD1cbiAgICAgICAgICAgIGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEyKSwgTWF0aC5hYnMoYjIpKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5rGC5Lik5ZCR6YeP5aS56KeS5byn5bqmXG4gICAgICogISNlbiBSYWRpYW4gYW5nbGUgYmV0d2VlbiB0d28gdmVjdG9ycyBzZWVrXG4gICAgICogQG1ldGhvZCBhbmdsZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIGFuZ2xlPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKGE6IE91dCwgYjogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgYW5nbGU8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAoYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgVmVjMy5ub3JtYWxpemUodjNfMSwgYSk7XG4gICAgICAgIFZlYzMubm9ybWFsaXplKHYzXzIsIGIpO1xuICAgICAgICBjb25zdCBjb3NpbmUgPSBWZWMzLmRvdCh2M18xLCB2M18yKTtcbiAgICAgICAgaWYgKGNvc2luZSA+IDEuMCkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvc2luZSA8IC0xLjApIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLlBJO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNYXRoLmFjb3MoY29zaW5lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOiuoeeul+WQkemHj+WcqOaMh+WumuW5s+mdouS4iueahOaKleW9sVxuICAgICAqICEjZW4gQ2FsY3VsYXRpbmcgYSBwcm9qZWN0aW9uIHZlY3RvciBpbiB0aGUgc3BlY2lmaWVkIHBsYW5lXG4gICAgICogQG1ldGhvZCBwcm9qZWN0T25QbGFuZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIHByb2plY3RPblBsYW5lPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIG46IE91dClcbiAgICAgKiBAcGFyYW0gYSDlvoXmipXlvbHlkJHph49cbiAgICAgKiBAcGFyYW0gbiDmjIflrprlubPpnaLnmoTms5Xnur9cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHByb2plY3RPblBsYW5lPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIG46IE91dCkge1xuICAgICAgICByZXR1cm4gVmVjMy5zdWJ0cmFjdChvdXQsIGEsIFZlYzMucHJvamVjdChvdXQsIGEsIG4pKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOiuoeeul+WQkemHj+WcqOaMh+WumuWQkemHj+S4iueahOaKleW9sVxuICAgICAqICEjZW4gUHJvamVjdGlvbiB2ZWN0b3IgY2FsY3VsYXRlZCBpbiB0aGUgdmVjdG9yIGRlc2lnbmF0ZWRcbiAgICAgKiBAbWV0aG9kIHByb2plY3RcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBwcm9qZWN0PE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dClcbiAgICAgKiBAcGFyYW0gYSDlvoXmipXlvbHlkJHph49cbiAgICAgKiBAcGFyYW0gbiDnm67moIflkJHph49cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHByb2plY3Q8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KSB7XG4gICAgICAgIGNvbnN0IHNxckxlbiA9IFZlYzMubGVuZ3RoU3FyKGIpO1xuICAgICAgICBpZiAoc3FyTGVuIDwgMC4wMDAwMDEpIHtcbiAgICAgICAgICAgIHJldHVybiBWZWMzLnNldChvdXQsIDAsIDAsIDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFZlYzMubXVsdGlwbHlTY2FsYXIob3V0LCBiLCBWZWMzLmRvdChhLCBiKSAvIHNxckxlbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWQkemHj+i9rOaVsOe7hFxuICAgICAqICEjZW4gVmVjdG9yIHRyYW5zZmVyIGFycmF5XG4gICAgICogQG1ldGhvZCB0b0FycmF5XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgdG9BcnJheSA8T3V0IGV4dGVuZHMgSVdyaXRhYmxlQXJyYXlMaWtlPG51bWJlcj4+IChvdXQ6IE91dCwgdjogSVZlYzNMaWtlLCBvZnMgPSAwKVxuICAgICAqIEBwYXJhbSBvZnMg5pWw57uE6LW35aeL5YGP56e76YePXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyB0b0FycmF5IDxPdXQgZXh0ZW5kcyBJV3JpdGFibGVBcnJheUxpa2U8bnVtYmVyPj4gKG91dDogT3V0LCB2OiBJVmVjM0xpa2UsIG9mcyA9IDApIHtcbiAgICAgICAgb3V0W29mcyArIDBdID0gdi54O1xuICAgICAgICBvdXRbb2ZzICsgMV0gPSB2Lnk7XG4gICAgICAgIG91dFtvZnMgKyAyXSA9IHYuejtcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5pWw57uE6L2s5ZCR6YePXG4gICAgICogISNlbiBBcnJheSBzdGVlcmluZyBhbW91bnRcbiAgICAgKiBAbWV0aG9kIGZyb21BcnJheVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIGZyb21BcnJheSA8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGFycjogSVdyaXRhYmxlQXJyYXlMaWtlPG51bWJlcj4sIG9mcyA9IDApXG4gICAgICogQHBhcmFtIG9mcyDmlbDnu4Totbflp4vlgY/np7vph49cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGZyb21BcnJheSA8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGFycjogSVdyaXRhYmxlQXJyYXlMaWtlPG51bWJlcj4sIG9mcyA9IDApIHtcbiAgICAgICAgb3V0LnggPSBhcnJbb2ZzICsgMF07XG4gICAgICAgIG91dC55ID0gYXJyW29mcyArIDFdO1xuICAgICAgICBvdXQueiA9IGFycltvZnMgKyAyXTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB4XG4gICAgICovXG4gICAgeDogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB5XG4gICAgICovXG4gICAgeTogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB6XG4gICAgICovXG4gICAgejogbnVtYmVyO1xuXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQ29uc3RydWN0b3JcbiAgICAgKiBzZWUge3sjY3Jvc3NMaW5rIFwiY2MvdmVjMzptZXRob2RcIn19Y2MudjN7ey9jcm9zc0xpbmt9fVxuICAgICAqICEjemhcbiAgICAgKiDmnoTpgKDlh73mlbDvvIzlj6/mn6XnnIsge3sjY3Jvc3NMaW5rIFwiY2MvdmVjMzptZXRob2RcIn19Y2MudjN7ey9jcm9zc0xpbmt9fVxuICAgICAqIEBtZXRob2QgY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge1ZlYzN8bnVtYmVyfSBbeD0wXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeT0wXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbej0wXVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yICh4OiBWZWMzIHwgbnVtYmVyID0gMCwgeTogbnVtYmVyID0gMCwgejogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBpZiAoeCAmJiB0eXBlb2YgeCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHRoaXMueiA9IHguejtcbiAgICAgICAgICAgIHRoaXMueSA9IHgueTtcbiAgICAgICAgICAgIHRoaXMueCA9IHgueDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMueCA9IHggYXMgbnVtYmVyO1xuICAgICAgICAgICAgdGhpcy55ID0geTtcbiAgICAgICAgICAgIHRoaXMueiA9IHo7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIGNsb25lIGEgVmVjMyB2YWx1ZVxuICAgICAqICEjemgg5YWL6ZqG5LiA5LiqIFZlYzMg5YC8XG4gICAgICogQG1ldGhvZCBjbG9uZVxuICAgICAqIEByZXR1cm4ge1ZlYzN9XG4gICAgICovXG4gICAgY2xvbmUgKCk6IFZlYzMge1xuICAgICAgICByZXR1cm4gbmV3IFZlYzModGhpcy54LCB0aGlzLnksIHRoaXMueik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgdGhlIGN1cnJlbnQgdmVjdG9yIHZhbHVlIHdpdGggdGhlIGdpdmVuIHZlY3Rvci5cbiAgICAgKiAhI3poIOeUqOWPpuS4gOS4quWQkemHj+iuvue9ruW9k+WJjeeahOWQkemHj+WvueixoeWAvOOAglxuICAgICAqIEBtZXRob2Qgc2V0XG4gICAgICogQHBhcmFtIHtWZWMzfSBuZXdWYWx1ZSAtICEjZW4gbmV3IHZhbHVlIHRvIHNldC4gISN6aCDopoHorr7nva7nmoTmlrDlgLxcbiAgICAgKiBAcmV0dXJuIHtWZWMzfSByZXR1cm5zIHRoaXNcbiAgICAgKiBAY2hhaW5hYmxlXG4gICAgICovXG4gICAgc2V0IChuZXdWYWx1ZTogVmVjMyk6IFZlYzMge1xuICAgICAgICB0aGlzLnggPSBuZXdWYWx1ZS54O1xuICAgICAgICB0aGlzLnkgPSBuZXdWYWx1ZS55O1xuICAgICAgICB0aGlzLnogPSBuZXdWYWx1ZS56O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENoZWNrIHdoZXRoZXIgdGhlIHZlY3RvciBlcXVhbHMgYW5vdGhlciBvbmVcbiAgICAgKiAhI3poIOW9k+WJjeeahOWQkemHj+aYr+WQpuS4juaMh+WumueahOWQkemHj+ebuOetieOAglxuICAgICAqIEBtZXRob2QgZXF1YWxzXG4gICAgICogQHBhcmFtIHtWZWMzfSBvdGhlclxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgZXF1YWxzIChvdGhlcjogVmVjMyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gb3RoZXIgJiYgdGhpcy54ID09PSBvdGhlci54ICYmIHRoaXMueSA9PT0gb3RoZXIueSAmJiB0aGlzLnogPT09IG90aGVyLno7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENoZWNrIHdoZXRoZXIgdHdvIHZlY3RvciBlcXVhbCB3aXRoIHNvbWUgZGVncmVlIG9mIHZhcmlhbmNlLlxuICAgICAqICEjemhcbiAgICAgKiDov5HkvLzliKTmlq3kuKTkuKrngrnmmK/lkKbnm7jnrYnjgII8YnIvPlxuICAgICAqIOWIpOaWrSAyIOS4quWQkemHj+aYr+WQpuWcqOaMh+WumuaVsOWAvOeahOiMg+WbtOS5i+WGhe+8jOWmguaenOWcqOWImei/lOWbniB0cnVl77yM5Y+N5LmL5YiZ6L+U5ZueIGZhbHNl44CCXG4gICAgICogQG1ldGhvZCBmdXp6eUVxdWFsc1xuICAgICAqIEBwYXJhbSB7VmVjM30gb3RoZXJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdmFyaWFuY2VcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGZ1enp5RXF1YWxzIChvdGhlcjogVmVjMywgdmFyaWFuY2U6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy54IC0gdmFyaWFuY2UgPD0gb3RoZXIueCAmJiBvdGhlci54IDw9IHRoaXMueCArIHZhcmlhbmNlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy55IC0gdmFyaWFuY2UgPD0gb3RoZXIueSAmJiBvdGhlci55IDw9IHRoaXMueSArIHZhcmlhbmNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMueiAtIHZhcmlhbmNlIDw9IG90aGVyLnogJiYgb3RoZXIueiA8PSB0aGlzLnogKyB2YXJpYW5jZSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gVHJhbnNmb3JtIHRvIHN0cmluZyB3aXRoIHZlY3RvciBpbmZvcm1hdGlvbnNcbiAgICAgKiAhI3poIOi9rOaNouS4uuaWueS+v+mYheivu+eahOWtl+espuS4suOAglxuICAgICAqIEBtZXRob2QgdG9TdHJpbmdcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgdG9TdHJpbmcgKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBcIihcIiArXG4gICAgICAgICAgICB0aGlzLngudG9GaXhlZCgyKSArIFwiLCBcIiArXG4gICAgICAgICAgICB0aGlzLnkudG9GaXhlZCgyKSArIFwiLCBcIiArXG4gICAgICAgICAgICB0aGlzLnoudG9GaXhlZCgyKSArIFwiKVwiXG4gICAgICAgICAgICA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBDYWxjdWxhdGUgbGluZWFyIGludGVycG9sYXRpb24gcmVzdWx0IGJldHdlZW4gdGhpcyB2ZWN0b3IgYW5kIGFub3RoZXIgb25lIHdpdGggZ2l2ZW4gcmF0aW9cbiAgICAgKiAhI3poIOe6v+aAp+aPkuWAvOOAglxuICAgICAqIEBtZXRob2QgbGVycFxuICAgICAqIEBwYXJhbSB7VmVjM30gdG9cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmF0aW8gLSB0aGUgaW50ZXJwb2xhdGlvbiBjb2VmZmljaWVudFxuICAgICAqIEBwYXJhbSB7VmVjM30gW291dF0gLSBvcHRpb25hbCwgdGhlIHJlY2VpdmluZyB2ZWN0b3IsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSB2ZWMzIHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyB2ZWMzIHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm4ge1ZlYzN9XG4gICAgICovXG4gICAgbGVycCAodG86IFZlYzMsIHJhdGlvOiBudW1iZXIsIG91dD86IFZlYzMpOiBWZWMzIHtcbiAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBWZWMzKCk7XG4gICAgICAgIFZlYzMubGVycChvdXQsIHRoaXMsIHRvLCByYXRpbyk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBDbGFtcCB0aGUgdmVjdG9yIGJldHdlZW4gZnJvbSBmbG9hdCBhbmQgdG8gZmxvYXQuXG4gICAgICogISN6aFxuICAgICAqIOi/lOWbnuaMh+WumumZkOWItuWMuuWfn+WQjueahOWQkemHj+OAgjxici8+XG4gICAgICog5ZCR6YeP5aSn5LqOIG1heF9pbmNsdXNpdmUg5YiZ6L+U5ZueIG1heF9pbmNsdXNpdmXjgII8YnIvPlxuICAgICAqIOWQkemHj+Wwj+S6jiBtaW5faW5jbHVzaXZlIOWImei/lOWbniBtaW5faW5jbHVzaXZl44CCPGJyLz5cbiAgICAgKiDlkKbliJnov5Tlm57oh6rouqvjgIJcbiAgICAgKiBAbWV0aG9kIGNsYW1wZlxuICAgICAqIEBwYXJhbSB7VmVjM30gbWluX2luY2x1c2l2ZVxuICAgICAqIEBwYXJhbSB7VmVjM30gbWF4X2luY2x1c2l2ZVxuICAgICAqIEByZXR1cm4ge1ZlYzN9XG4gICAgICovXG4gICAgY2xhbXBmIChtaW5faW5jbHVzaXZlOiBWZWMzLCBtYXhfaW5jbHVzaXZlOiBWZWMzKTogVmVjMyB7XG4gICAgICAgIHRoaXMueCA9IG1pc2MuY2xhbXBmKHRoaXMueCwgbWluX2luY2x1c2l2ZS54LCBtYXhfaW5jbHVzaXZlLngpO1xuICAgICAgICB0aGlzLnkgPSBtaXNjLmNsYW1wZih0aGlzLnksIG1pbl9pbmNsdXNpdmUueSwgbWF4X2luY2x1c2l2ZS55KTtcbiAgICAgICAgdGhpcy56ID0gbWlzYy5jbGFtcGYodGhpcy56LCBtaW5faW5jbHVzaXZlLnosIG1heF9pbmNsdXNpdmUueik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gQWRkcyB0aGlzIHZlY3Rvci4gSWYgeW91IHdhbnQgdG8gc2F2ZSByZXN1bHQgdG8gYW5vdGhlciB2ZWN0b3IsIHVzZSBhZGQoKSBpbnN0ZWFkLlxuICAgICAqICEjemgg5ZCR6YeP5Yqg5rOV44CC5aaC5p6c5L2g5oOz5L+d5a2Y57uT5p6c5Yiw5Y+m5LiA5Liq5ZCR6YeP77yM5L2/55SoIGFkZCgpIOS7o+abv+OAglxuICAgICAqIEBtZXRob2QgYWRkU2VsZlxuICAgICAqIEBwYXJhbSB7VmVjM30gdmVjdG9yXG4gICAgICogQHJldHVybiB7VmVjM30gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqL1xuICAgIGFkZFNlbGYgKHZlY3RvcjogVmVjMyk6IHRoaXMge1xuICAgICAgICB0aGlzLnggKz0gdmVjdG9yLng7XG4gICAgICAgIHRoaXMueSArPSB2ZWN0b3IueTtcbiAgICAgICAgdGhpcy56ICs9IHZlY3Rvci56O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEFkZHMgdHdvIHZlY3RvcnMsIGFuZCByZXR1cm5zIHRoZSBuZXcgcmVzdWx0LlxuICAgICAqICEjemgg5ZCR6YeP5Yqg5rOV77yM5bm26L+U5Zue5paw57uT5p6c44CCXG4gICAgICogQG1ldGhvZCBhZGRcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IHZlY3RvclxuICAgICAqIEBwYXJhbSB7VmVjM30gW291dF0gLSBvcHRpb25hbCwgdGhlIHJlY2VpdmluZyB2ZWN0b3IsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSB2ZWMzIHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyB2ZWMzIHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm4ge1ZlYzN9IHRoZSByZXN1bHRcbiAgICAgKi9cbiAgICBhZGQgKHZlY3RvcjogVmVjMywgb3V0PzogVmVjMyk6IFZlYzMge1xuICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IFZlYzMoKTtcbiAgICAgICAgb3V0LnggPSB0aGlzLnggKyB2ZWN0b3IueDtcbiAgICAgICAgb3V0LnkgPSB0aGlzLnkgKyB2ZWN0b3IueTtcbiAgICAgICAgb3V0LnogPSB0aGlzLnogKyB2ZWN0b3IuejtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFN1YnRyYWN0cyBvbmUgdmVjdG9yIGZyb20gdGhpcy5cbiAgICAgKiAhI3poIOWQkemHj+WHj+azleOAglxuICAgICAqIEBtZXRob2Qgc3VidHJhY3RcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IHZlY3RvclxuICAgICAqIEByZXR1cm4ge1ZlYzN9IHJldHVybnMgdGhpc1xuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKi9cbiAgICBzdWJ0cmFjdCAodmVjdG9yOiBWZWMzKTogVmVjMyB7XG4gICAgICAgIHRoaXMueCAtPSB2ZWN0b3IueDtcbiAgICAgICAgdGhpcy55IC09IHZlY3Rvci55O1xuICAgICAgICB0aGlzLnogLT0gdmVjdG9yLno7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gTXVsdGlwbGllcyB0aGlzIGJ5IGEgbnVtYmVyLlxuICAgICAqICEjemgg57yp5pS+5b2T5YmN5ZCR6YeP44CCXG4gICAgICogQG1ldGhvZCBtdWx0aXBseVNjYWxhclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1cbiAgICAgKiBAcmV0dXJuIHtWZWMzfSByZXR1cm5zIHRoaXNcbiAgICAgKiBAY2hhaW5hYmxlXG4gICAgICovXG4gICAgbXVsdGlwbHlTY2FsYXIgKG51bTogbnVtYmVyKTogVmVjMyB7XG4gICAgICAgIHRoaXMueCAqPSBudW07XG4gICAgICAgIHRoaXMueSAqPSBudW07XG4gICAgICAgIHRoaXMueiAqPSBudW07XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gTXVsdGlwbGllcyB0d28gdmVjdG9ycy5cbiAgICAgKiAhI3poIOWIhumHj+ebuOS5mOOAglxuICAgICAqIEBtZXRob2QgbXVsdGlwbHlcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IHZlY3RvclxuICAgICAqIEByZXR1cm4ge1ZlYzN9IHJldHVybnMgdGhpc1xuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKi9cbiAgICBtdWx0aXBseSAodmVjdG9yOiBWZWMzKTogVmVjMyB7XG4gICAgICAgIHRoaXMueCAqPSB2ZWN0b3IueDtcbiAgICAgICAgdGhpcy55ICo9IHZlY3Rvci55O1xuICAgICAgICB0aGlzLnogKj0gdmVjdG9yLno7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gRGl2aWRlcyBieSBhIG51bWJlci5cbiAgICAgKiAhI3poIOWQkemHj+mZpOazleOAglxuICAgICAqIEBtZXRob2QgZGl2aWRlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bVxuICAgICAqIEByZXR1cm4ge1ZlYzN9IHJldHVybnMgdGhpc1xuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKi9cbiAgICBkaXZpZGUgKG51bTogbnVtYmVyKTogVmVjMyB7XG4gICAgICAgIHRoaXMueCAvPSBudW07XG4gICAgICAgIHRoaXMueSAvPSBudW07XG4gICAgICAgIHRoaXMueiAvPSBudW07XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gTmVnYXRlcyB0aGUgY29tcG9uZW50cy5cbiAgICAgKiAhI3poIOWQkemHj+WPluWPjeOAglxuICAgICAqIEBtZXRob2QgbmVnYXRlXG4gICAgICogQHJldHVybiB7VmVjM30gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqL1xuICAgIG5lZ2F0ZSAoKTogdGhpcyB7XG4gICAgICAgIHRoaXMueCA9IC10aGlzLng7XG4gICAgICAgIHRoaXMueSA9IC10aGlzLnk7XG4gICAgICAgIHRoaXMueiA9IC10aGlzLno7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gRG90IHByb2R1Y3RcbiAgICAgKiAhI3poIOW9k+WJjeWQkemHj+S4juaMh+WumuWQkemHj+i/m+ihjOeCueS5mOOAglxuICAgICAqIEBtZXRob2QgZG90XG4gICAgICogQHBhcmFtIHtWZWMzfSBbdmVjdG9yXVxuICAgICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHJlc3VsdFxuICAgICAqL1xuICAgIGRvdCAodmVjdG9yOiBWZWMzKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHZlY3Rvci54ICsgdGhpcy55ICogdmVjdG9yLnkgKyB0aGlzLnogKiB2ZWN0b3IuejtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENyb3NzIHByb2R1Y3RcbiAgICAgKiAhI3poIOW9k+WJjeWQkemHj+S4juaMh+WumuWQkemHj+i/m+ihjOWPieS5mOOAglxuICAgICAqIEBtZXRob2QgY3Jvc3NcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IHZlY3RvclxuICAgICAqIEBwYXJhbSB7VmVjM30gW291dF1cbiAgICAgKiBAcmV0dXJuIHtWZWMzfSB0aGUgcmVzdWx0XG4gICAgICovXG4gICAgY3Jvc3MgKHZlY3RvcjogVmVjMywgb3V0PzogVmVjMyk6IFZlYzMge1xuICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IFZlYzMoKTtcbiAgICAgICAgVmVjMy5jcm9zcyhvdXQsIHRoaXMsIHZlY3RvcilcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgdGhlIGxlbmd0aCBvZiB0aGlzIHZlY3Rvci5cbiAgICAgKiAhI3poIOi/lOWbnuivpeWQkemHj+eahOmVv+W6puOAglxuICAgICAqIEBtZXRob2QgbGVuXG4gICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgcmVzdWx0XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgdiA9IGNjLnYyKDEwLCAxMCk7XG4gICAgICogdi5sZW4oKTsgLy8gcmV0dXJuIDE0LjE0MjEzNTYyMzczMDk1MTtcbiAgICAgKi9cbiAgICBsZW4gKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55ICsgdGhpcy56ICogdGhpcy56KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgdGhlIHNxdWFyZWQgbGVuZ3RoIG9mIHRoaXMgdmVjdG9yLlxuICAgICAqICEjemgg6L+U5Zue6K+l5ZCR6YeP55qE6ZW/5bqm5bmz5pa544CCXG4gICAgICogQG1ldGhvZCBsZW5ndGhTcXJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSByZXN1bHRcbiAgICAgKi9cbiAgICBsZW5ndGhTcXIgKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkgKyB0aGlzLnogKiB0aGlzLno7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBNYWtlIHRoZSBsZW5ndGggb2YgdGhpcyB2ZWN0b3IgdG8gMS5cbiAgICAgKiAhI3poIOWQkemHj+W9kuS4gOWMlu+8jOiuqei/meS4quWQkemHj+eahOmVv+W6puS4uiAx44CCXG4gICAgICogQG1ldGhvZCBub3JtYWxpemVTZWxmXG4gICAgICogQHJldHVybiB7VmVjM30gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqL1xuICAgIG5vcm1hbGl6ZVNlbGYgKCk6IFZlYzMge1xuICAgICAgICBWZWMzLm5vcm1hbGl6ZSh0aGlzLCB0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXR1cm5zIHRoaXMgdmVjdG9yIHdpdGggYSBtYWduaXR1ZGUgb2YgMS48YnIvPlxuICAgICAqIDxici8+XG4gICAgICogTm90ZSB0aGF0IHRoZSBjdXJyZW50IHZlY3RvciBpcyB1bmNoYW5nZWQgYW5kIGEgbmV3IG5vcm1hbGl6ZWQgdmVjdG9yIGlzIHJldHVybmVkLiBJZiB5b3Ugd2FudCB0byBub3JtYWxpemUgdGhlIGN1cnJlbnQgdmVjdG9yLCB1c2Ugbm9ybWFsaXplU2VsZiBmdW5jdGlvbi5cbiAgICAgKiAhI3poXG4gICAgICog6L+U5Zue5b2S5LiA5YyW5ZCO55qE5ZCR6YeP44CCPGJyLz5cbiAgICAgKiA8YnIvPlxuICAgICAqIOazqOaEj++8jOW9k+WJjeWQkemHj+S4jeWPmO+8jOW5tui/lOWbnuS4gOS4quaWsOeahOW9kuS4gOWMluWQkemHj+OAguWmguaenOS9oOaDs+adpeW9kuS4gOWMluW9k+WJjeWQkemHj++8jOWPr+S9v+eUqCBub3JtYWxpemVTZWxmIOWHveaVsOOAglxuICAgICAqIEBtZXRob2Qgbm9ybWFsaXplXG4gICAgICogQHBhcmFtIHtWZWMzfSBbb3V0XSAtIG9wdGlvbmFsLCB0aGUgcmVjZWl2aW5nIHZlY3RvciwgeW91IGNhbiBwYXNzIHRoZSBzYW1lIHZlYzMgdG8gc2F2ZSByZXN1bHQgdG8gaXRzZWxmLCBpZiBub3QgcHJvdmlkZWQsIGEgbmV3IHZlYzMgd2lsbCBiZSBjcmVhdGVkXG4gICAgICogQHJldHVybiB7VmVjM30gcmVzdWx0XG4gICAgICovXG4gICAgbm9ybWFsaXplIChvdXQ/OiBWZWMzKTogVmVjMyB7XG4gICAgICAgIG91dCA9IG91dCB8fCBuZXcgVmVjMygpO1xuICAgICAgICBWZWMzLm5vcm1hbGl6ZShvdXQsIHRoaXMpO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyYW5zZm9ybXMgdGhlIHZlYzMgd2l0aCBhIG1hdDQuIDR0aCB2ZWN0b3IgY29tcG9uZW50IGlzIGltcGxpY2l0bHkgJzEnXG4gICAgICogQG1ldGhvZCB0cmFuc2Zvcm1NYXQ0XG4gICAgICogQHBhcmFtIHtNYXQ0fSBtIG1hdHJpeCB0byB0cmFuc2Zvcm0gd2l0aFxuICAgICAqIEBwYXJhbSB7VmVjM30gW291dF0gdGhlIHJlY2VpdmluZyB2ZWN0b3IsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSB2ZWMzIHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyB2ZWMzIHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm5zIHtWZWMzfSBvdXRcbiAgICAgKi9cbiAgICB0cmFuc2Zvcm1NYXQ0IChtOiBNYXQ0LCBvdXQ/OiBWZWMzKTogVmVjMyB7XG4gICAgICAgIG91dCA9IG91dCB8fCBuZXcgVmVjMygpO1xuICAgICAgICBWZWMzLnRyYW5zZm9ybU1hdDQob3V0LCB0aGlzLCBtKTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBtYXhpbXVtIHZhbHVlIGluIHgsIHksIGFuZCB6XG4gICAgICogQG1ldGhvZCBtYXhBeGlzXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBtYXhBeGlzICgpOiBudW1iZXIge1xuICAgICAgIHJldHVybiBNYXRoLm1heCh0aGlzLngsIHRoaXMueSwgdGhpcy56KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldCBhbmdsZSBpbiByYWRpYW4gYmV0d2VlbiB0aGlzIGFuZCB2ZWN0b3IuXG4gICAgICogISN6aCDlpLnop5LnmoTlvKfluqbjgIJcbiAgICAgKiBAbWV0aG9kIGFuZ2xlXG4gICAgICogQHBhcmFtIHtWZWMzfSB2ZWN0b3JcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IGZyb20gMCB0byBNYXRoLlBJXG4gICAgICovXG4gICAgYW5nbGUgPSBWZWMyLnByb3RvdHlwZS5hbmdsZVxuICAgIC8qKlxuICAgICAqICEjZW4gQ2FsY3VsYXRlcyB0aGUgcHJvamVjdGlvbiBvZiB0aGUgY3VycmVudCB2ZWN0b3Igb3ZlciB0aGUgZ2l2ZW4gdmVjdG9yLlxuICAgICAqICEjemgg6L+U5Zue5b2T5YmN5ZCR6YeP5Zyo5oyH5a6aIHZlY3RvciDlkJHph4/kuIrnmoTmipXlvbHlkJHph4/jgIJcbiAgICAgKiBAbWV0aG9kIHByb2plY3RcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IHZlY3RvclxuICAgICAqIEByZXR1cm4ge1ZlYzN9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgdjEgPSBjYy52MygyMCwgMjAsIDIwKTtcbiAgICAgKiB2YXIgdjIgPSBjYy52Myg1LCA1LCA1KTtcbiAgICAgKiB2MS5wcm9qZWN0KHYyKTsgLy8gVmVjMyB7eDogMjAsIHk6IDIwLCB6OiAyMH07XG4gICAgICovXG4gICAgcHJvamVjdCA9IFZlYzIucHJvdG90eXBlLnByb2plY3RcbiAgICAvLyBDb21wYXRpYmxlIHdpdGggdGhlIHZlYzIgQVBJXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldCBhbmdsZSBpbiByYWRpYW4gYmV0d2VlbiB0aGlzIGFuZCB2ZWN0b3Igd2l0aCBkaXJlY3Rpb24uIDxici8+XG4gICAgICogSW4gb3JkZXIgdG8gY29tcGF0aWJsZSB3aXRoIHRoZSB2ZWMyIEFQSS5cbiAgICAgKiAhI3poIOW4puaWueWQkeeahOWkueinkueahOW8p+W6puOAguivpeaWueazleS7heeUqOWBmuWFvOWuuSAyRCDorqHnrpfjgIJcbiAgICAgKiBAbWV0aG9kIHNpZ25BbmdsZVxuICAgICAqIEBwYXJhbSB7VmVjMyB8IFZlYzJ9IHZlY3RvclxuICAgICAqIEByZXR1cm4ge251bWJlcn0gZnJvbSAtTWF0aFBJIHRvIE1hdGguUElcbiAgICAgKiBAZGVwcmVjYXRlZFxuICAgICAqL1xuICAgIHNpZ25BbmdsZSAodmVjdG9yKSB7XG4gICAgICAgIGNjLndhcm5JRCgxNDA4LCAndmVjMy5zaWduQW5nbGUnLCAndjIuMScsICdjYy52MihzZWxmVmVjdG9yKS5zaWduQW5nbGUodmVjdG9yKScpO1xuICAgICAgICBsZXQgdmVjMSA9IG5ldyBWZWMyKHRoaXMueCwgdGhpcy55KTtcbiAgICAgICAgbGV0IHZlYzIgPSBuZXcgVmVjMih2ZWN0b3IueCwgdmVjdG9yLnkpO1xuICAgICAgICByZXR1cm4gdmVjMS5zaWduQW5nbGUodmVjMik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiByb3RhdGUuIEluIG9yZGVyIHRvIGNvbXBhdGlibGUgd2l0aCB0aGUgdmVjMiBBUEkuXG4gICAgICogISN6aCDov5Tlm57ml4vovaznu5nlrprlvKfluqblkI7nmoTmlrDlkJHph4/jgILor6Xmlrnms5Xku4XnlKjlgZrlhbzlrrkgMkQg6K6h566X44CCXG4gICAgICogQG1ldGhvZCByb3RhdGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFkaWFuc1xuICAgICAqIEBwYXJhbSB7VmVjM30gW291dF0gLSBvcHRpb25hbCwgdGhlIHJlY2VpdmluZyB2ZWN0b3IsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSB2ZWMyIHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyB2ZWMyIHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm4ge1ZlYzIgfCBWZWMzfSBpZiB0aGUgJ291dCcgdmFsdWUgaXMgYSB2ZWMzIHlvdSB3aWxsIGdldCBhIFZlYzMgcmV0dXJuLiBcbiAgICAgKiBAZGVwcmVjYXRlZFxuICAgICAqL1xuICAgIHJvdGF0ZSAocmFkaWFucywgb3V0KSB7XG4gICAgICAgIGNjLndhcm5JRCgxNDA4LCAndmVjMy5yb3RhdGUnLCAndjIuMScsICdjYy52MihzZWxmVmVjdG9yKS5yb3RhdGUocmFkaWFucywgb3V0KScpO1xuICAgICAgICByZXR1cm4gVmVjMi5wcm90b3R5cGUucm90YXRlLmNhbGwodGhpcywgcmFkaWFucywgb3V0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIHJvdGF0ZSBzZWxmLiBJbiBvcmRlciB0byBjb21wYXRpYmxlIHdpdGggdGhlIHZlYzIgQVBJLlxuICAgICAqICEjemgg5oyJ5oyH5a6a5byn5bqm5peL6L2s5ZCR6YeP44CC6K+l5pa55rOV5LuF55So5YGa5YW85a65IDJEIOiuoeeul+OAglxuICAgICAqIEBtZXRob2Qgcm90YXRlU2VsZlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByYWRpYW5zXG4gICAgICogQHJldHVybiB7VmVjM30gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqIEBkZXByZWNhdGVkXG4gICAgICovXG4gICAgcm90YXRlU2VsZiAocmFkaWFucykge1xuICAgICAgICBjYy53YXJuSUQoMTQwOCwgJ3ZlYzMucm90YXRlU2VsZicsICd2Mi4xJywgJ2NjLnYyKHNlbGZWZWN0b3IpLnJvdGF0ZVNlbGYocmFkaWFucyknKTtcbiAgICAgICAgcmV0dXJuIFZlYzIucHJvdG90eXBlLnJvdGF0ZVNlbGYuY2FsbCh0aGlzLCByYWRpYW5zKTtcbiAgICB9XG59XG5cbmNvbnN0IHYzXzEgPSBuZXcgVmVjMygpO1xuY29uc3QgdjNfMiA9IG5ldyBWZWMzKCk7XG5cbkNDQ2xhc3MuZmFzdERlZmluZSgnY2MuVmVjMycsIFZlYzMsIHsgeDogMCwgeTogMCwgejogMCB9KTtcblxuLyoqXG4gKiBAbW9kdWxlIGNjXG4gKi9cblxuLyoqXG4gKiAhI2VuIFRoZSBjb252ZW5pZW5jZSBtZXRob2QgdG8gY3JlYXRlIGEgbmV3IHt7I2Nyb3NzTGluayBcIlZlYzNcIn19Y2MuVmVjM3t7L2Nyb3NzTGlua319LlxuICogISN6aCDpgJrov4for6XnroDkvr/nmoTlh73mlbDov5vooYzliJvlu7oge3sjY3Jvc3NMaW5rIFwiVmVjM1wifX1jYy5WZWMze3svY3Jvc3NMaW5rfX0g5a+56LGh44CCXG4gKiBAbWV0aG9kIHYzXG4gKiBAcGFyYW0ge051bWJlcnxPYmplY3R9IFt4PTBdXG4gKiBAcGFyYW0ge051bWJlcn0gW3k9MF1cbiAqIEBwYXJhbSB7TnVtYmVyfSBbej0wXVxuICogQHJldHVybiB7VmVjM31cbiAqIEBleGFtcGxlXG4gKiB2YXIgdjEgPSBjYy52MygpO1xuICogdmFyIHYyID0gY2MudjMoMCwgMCwgMCk7XG4gKiB2YXIgdjMgPSBjYy52Myh2Mik7XG4gKiB2YXIgdjQgPSBjYy52Myh7eDogMTAwLCB5OiAxMDAsIHo6IDB9KTtcbiAqL1xuY2MudjMgPSBmdW5jdGlvbiB2MyAoeCwgeSwgeikge1xuICAgIHJldHVybiBuZXcgVmVjMyh4LCB5LCB6KTtcbn07XG5cbmNjLlZlYzMgPSBWZWMzO1xuIl19