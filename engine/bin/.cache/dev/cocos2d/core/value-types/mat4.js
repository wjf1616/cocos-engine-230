
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/value-types/mat4.js';
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

var _vec = _interopRequireDefault(require("./vec3"));

var _quat = _interopRequireDefault(require("./quat"));

var _utils = require("./utils");

var _mat = _interopRequireDefault(require("./mat3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _a00 = 0;
var _a01 = 0;
var _a02 = 0;
var _a03 = 0;
var _a10 = 0;
var _a11 = 0;
var _a12 = 0;
var _a13 = 0;
var _a20 = 0;
var _a21 = 0;
var _a22 = 0;
var _a23 = 0;
var _a30 = 0;
var _a31 = 0;
var _a32 = 0;
var _a33 = 0;
/**
 * !#en Representation of 4*4 matrix.
 * !#zh 表示 4*4 矩阵
 *
 * @class Mat4
 * @extends ValueType
 */

var Mat4 =
/*#__PURE__*/
function (_ValueType) {
  _inheritsLoose(Mat4, _ValueType);

  var _proto = Mat4.prototype;

  _proto.mul = function mul(m, out) {
    return Mat4.multiply(out || new Mat4(), this, m);
  };

  _proto.mulScalar = function mulScalar(num, out) {
    Mat4.multiplyScalar(out || new Mat4(), this, num);
  };

  _proto.sub = function sub(m, out) {
    Mat4.subtract(out || new Mat4(), this, m);
  }
  /**
   * Identity  of Mat4
   * @property {Mat4} IDENTITY
   * @static
   */
  ;

  /**
   * !#zh 获得指定矩阵的拷贝
   * !#en Copy of the specified matrix to obtain
   * @method clone
   * @typescript
   * static clone<Out extends IMat4Like> (a: Out)
   * @static
   */
  Mat4.clone = function clone(a) {
    var m = a.m;
    return new Mat4(m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9], m[10], m[11], m[12], m[13], m[14], m[15]);
  }
  /**
   * !#zh 复制目标矩阵
   * !#en Copy the target matrix
   * @method copy
   * @typescript
   * static copy<Out extends IMat4Like> (out: Out, a: Out)
   * @static
   */
  ;

  Mat4.copy = function copy(out, a) {
    var m = out.m,
        am = a.m;
    m[0] = am[0];
    m[1] = am[1];
    m[2] = am[2];
    m[3] = am[3];
    m[4] = am[4];
    m[5] = am[5];
    m[6] = am[6];
    m[7] = am[7];
    m[8] = am[8];
    m[9] = am[9];
    m[10] = am[10];
    m[11] = am[11];
    m[12] = am[12];
    m[13] = am[13];
    m[14] = am[14];
    m[15] = am[15];
    return out;
  }
  /**
   * !#zh 设置矩阵值
   * !#en Setting matrix values
   * @static
   */
  ;

  Mat4.set = function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    var m = out.m;
    m[0] = m00;
    m[1] = m01;
    m[2] = m02;
    m[3] = m03;
    m[4] = m10;
    m[5] = m11;
    m[6] = m12;
    m[7] = m13;
    m[8] = m20;
    m[9] = m21;
    m[10] = m22;
    m[11] = m23;
    m[12] = m30;
    m[13] = m31;
    m[14] = m32;
    m[15] = m33;
    return out;
  }
  /**
   * !#zh 将目标赋值为单位矩阵
   * !#en The target of an assignment is the identity matrix
   * @method identity
   * @typescript
   * static identity<Out extends IMat4Like> (out: Out)
   * @static
   */
  ;

  Mat4.identity = function identity(out) {
    var m = out.m;
    m[0] = 1;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = 1;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = 1;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 转置矩阵
   * !#en Transposed matrix
   * @method transpose
   * @typescript
   * static transpose<Out extends IMat4Like> (out: Out, a: Out)
   * @static
   */
  ;

  Mat4.transpose = function transpose(out, a) {
    var m = out.m,
        am = a.m; // If we are transposing ourselves we can skip a few steps but have to cache some values

    if (out === a) {
      var a01 = am[1],
          a02 = am[2],
          a03 = am[3],
          a12 = am[6],
          a13 = am[7],
          a23 = am[11];
      m[1] = am[4];
      m[2] = am[8];
      m[3] = am[12];
      m[4] = a01;
      m[6] = am[9];
      m[7] = am[13];
      m[8] = a02;
      m[9] = a12;
      m[11] = am[14];
      m[12] = a03;
      m[13] = a13;
      m[14] = a23;
    } else {
      m[0] = am[0];
      m[1] = am[4];
      m[2] = am[8];
      m[3] = am[12];
      m[4] = am[1];
      m[5] = am[5];
      m[6] = am[9];
      m[7] = am[13];
      m[8] = am[2];
      m[9] = am[6];
      m[10] = am[10];
      m[11] = am[14];
      m[12] = am[3];
      m[13] = am[7];
      m[14] = am[11];
      m[15] = am[15];
    }

    return out;
  }
  /**
   * !#zh 矩阵求逆
   * !#en Matrix inversion
   * @method invert
   * @typescript
   * static invert<Out extends IMat4Like> (out: Out, a: Out)
   * @static
   */
  ;

  Mat4.invert = function invert(out, a) {
    var am = a.m;
    _a00 = am[0];
    _a01 = am[1];
    _a02 = am[2];
    _a03 = am[3];
    _a10 = am[4];
    _a11 = am[5];
    _a12 = am[6];
    _a13 = am[7];
    _a20 = am[8];
    _a21 = am[9];
    _a22 = am[10];
    _a23 = am[11];
    _a30 = am[12];
    _a31 = am[13];
    _a32 = am[14];
    _a33 = am[15];
    var b00 = _a00 * _a11 - _a01 * _a10;
    var b01 = _a00 * _a12 - _a02 * _a10;
    var b02 = _a00 * _a13 - _a03 * _a10;
    var b03 = _a01 * _a12 - _a02 * _a11;
    var b04 = _a01 * _a13 - _a03 * _a11;
    var b05 = _a02 * _a13 - _a03 * _a12;
    var b06 = _a20 * _a31 - _a21 * _a30;
    var b07 = _a20 * _a32 - _a22 * _a30;
    var b08 = _a20 * _a33 - _a23 * _a30;
    var b09 = _a21 * _a32 - _a22 * _a31;
    var b10 = _a21 * _a33 - _a23 * _a31;
    var b11 = _a22 * _a33 - _a23 * _a32; // Calculate the determinant

    var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (det === 0) {
      return null;
    }

    det = 1.0 / det;
    var m = out.m;
    m[0] = (_a11 * b11 - _a12 * b10 + _a13 * b09) * det;
    m[1] = (_a02 * b10 - _a01 * b11 - _a03 * b09) * det;
    m[2] = (_a31 * b05 - _a32 * b04 + _a33 * b03) * det;
    m[3] = (_a22 * b04 - _a21 * b05 - _a23 * b03) * det;
    m[4] = (_a12 * b08 - _a10 * b11 - _a13 * b07) * det;
    m[5] = (_a00 * b11 - _a02 * b08 + _a03 * b07) * det;
    m[6] = (_a32 * b02 - _a30 * b05 - _a33 * b01) * det;
    m[7] = (_a20 * b05 - _a22 * b02 + _a23 * b01) * det;
    m[8] = (_a10 * b10 - _a11 * b08 + _a13 * b06) * det;
    m[9] = (_a01 * b08 - _a00 * b10 - _a03 * b06) * det;
    m[10] = (_a30 * b04 - _a31 * b02 + _a33 * b00) * det;
    m[11] = (_a21 * b02 - _a20 * b04 - _a23 * b00) * det;
    m[12] = (_a11 * b07 - _a10 * b09 - _a12 * b06) * det;
    m[13] = (_a00 * b09 - _a01 * b07 + _a02 * b06) * det;
    m[14] = (_a31 * b01 - _a30 * b03 - _a32 * b00) * det;
    m[15] = (_a20 * b03 - _a21 * b01 + _a22 * b00) * det;
    return out;
  }
  /**
   * !#zh 矩阵行列式
   * !#en Matrix determinant
   * @method determinant
   * @typescript
   * static determinant<Out extends IMat4Like> (a: Out): number
   * @static
   */
  ;

  Mat4.determinant = function determinant(a) {
    var m = a.m;
    _a00 = m[0];
    _a01 = m[1];
    _a02 = m[2];
    _a03 = m[3];
    _a10 = m[4];
    _a11 = m[5];
    _a12 = m[6];
    _a13 = m[7];
    _a20 = m[8];
    _a21 = m[9];
    _a22 = m[10];
    _a23 = m[11];
    _a30 = m[12];
    _a31 = m[13];
    _a32 = m[14];
    _a33 = m[15];
    var b00 = _a00 * _a11 - _a01 * _a10;
    var b01 = _a00 * _a12 - _a02 * _a10;
    var b02 = _a00 * _a13 - _a03 * _a10;
    var b03 = _a01 * _a12 - _a02 * _a11;
    var b04 = _a01 * _a13 - _a03 * _a11;
    var b05 = _a02 * _a13 - _a03 * _a12;
    var b06 = _a20 * _a31 - _a21 * _a30;
    var b07 = _a20 * _a32 - _a22 * _a30;
    var b08 = _a20 * _a33 - _a23 * _a30;
    var b09 = _a21 * _a32 - _a22 * _a31;
    var b10 = _a21 * _a33 - _a23 * _a31;
    var b11 = _a22 * _a33 - _a23 * _a32; // Calculate the determinant

    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  }
  /**
   * !#zh 矩阵乘法
   * !#en Matrix Multiplication
   * @method multiply
   * @typescript
   * static multiply<Out extends IMat4Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Mat4.multiply = function multiply(out, a, b) {
    var m = out.m,
        am = a.m,
        bm = b.m;
    _a00 = am[0];
    _a01 = am[1];
    _a02 = am[2];
    _a03 = am[3];
    _a10 = am[4];
    _a11 = am[5];
    _a12 = am[6];
    _a13 = am[7];
    _a20 = am[8];
    _a21 = am[9];
    _a22 = am[10];
    _a23 = am[11];
    _a30 = am[12];
    _a31 = am[13];
    _a32 = am[14];
    _a33 = am[15]; // Cache only the current line of the second matrix

    var b0 = bm[0],
        b1 = bm[1],
        b2 = bm[2],
        b3 = bm[3];
    m[0] = b0 * _a00 + b1 * _a10 + b2 * _a20 + b3 * _a30;
    m[1] = b0 * _a01 + b1 * _a11 + b2 * _a21 + b3 * _a31;
    m[2] = b0 * _a02 + b1 * _a12 + b2 * _a22 + b3 * _a32;
    m[3] = b0 * _a03 + b1 * _a13 + b2 * _a23 + b3 * _a33;
    b0 = bm[4];
    b1 = bm[5];
    b2 = bm[6];
    b3 = bm[7];
    m[4] = b0 * _a00 + b1 * _a10 + b2 * _a20 + b3 * _a30;
    m[5] = b0 * _a01 + b1 * _a11 + b2 * _a21 + b3 * _a31;
    m[6] = b0 * _a02 + b1 * _a12 + b2 * _a22 + b3 * _a32;
    m[7] = b0 * _a03 + b1 * _a13 + b2 * _a23 + b3 * _a33;
    b0 = bm[8];
    b1 = bm[9];
    b2 = bm[10];
    b3 = bm[11];
    m[8] = b0 * _a00 + b1 * _a10 + b2 * _a20 + b3 * _a30;
    m[9] = b0 * _a01 + b1 * _a11 + b2 * _a21 + b3 * _a31;
    m[10] = b0 * _a02 + b1 * _a12 + b2 * _a22 + b3 * _a32;
    m[11] = b0 * _a03 + b1 * _a13 + b2 * _a23 + b3 * _a33;
    b0 = bm[12];
    b1 = bm[13];
    b2 = bm[14];
    b3 = bm[15];
    m[12] = b0 * _a00 + b1 * _a10 + b2 * _a20 + b3 * _a30;
    m[13] = b0 * _a01 + b1 * _a11 + b2 * _a21 + b3 * _a31;
    m[14] = b0 * _a02 + b1 * _a12 + b2 * _a22 + b3 * _a32;
    m[15] = b0 * _a03 + b1 * _a13 + b2 * _a23 + b3 * _a33;
    return out;
  }
  /**
   * !#zh 在给定矩阵变换基础上加入变换
   * !#en Was added in a given transformation matrix transformation on the basis of
   * @method transform
   * @typescript
   * static transform<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, a: Out, v: VecLike)
   * @static
   */
  ;

  Mat4.transform = function transform(out, a, v) {
    var x = v.x,
        y = v.y,
        z = v.z;
    var m = out.m,
        am = a.m;

    if (a === out) {
      m[12] = am[0] * x + am[4] * y + am[8] * z + am[12];
      m[13] = am[1] * x + am[5] * y + am[9] * z + am[13];
      m[14] = am[2] * x + am[6] * y + am[10] * z + am[14];
      m[15] = am[3] * x + am[7] * y + am[11] * z + am[15];
    } else {
      _a00 = am[0];
      _a01 = am[1];
      _a02 = am[2];
      _a03 = am[3];
      _a10 = am[4];
      _a11 = am[5];
      _a12 = am[6];
      _a13 = am[7];
      _a20 = am[8];
      _a21 = am[9];
      _a22 = am[10];
      _a23 = am[11];
      _a30 = am[12];
      _a31 = am[13];
      _a32 = am[14];
      _a33 = am[15];
      m[0] = _a00;
      m[1] = _a01;
      m[2] = _a02;
      m[3] = _a03;
      m[4] = _a10;
      m[5] = _a11;
      m[6] = _a12;
      m[7] = _a13;
      m[8] = _a20;
      m[9] = _a21;
      m[10] = _a22;
      m[11] = _a23;
      m[12] = _a00 * x + _a10 * y + _a20 * z + am[12];
      m[13] = _a01 * x + _a11 * y + _a21 * z + am[13];
      m[14] = _a02 * x + _a12 * y + _a22 * z + am[14];
      m[15] = _a03 * x + _a13 * y + _a23 * z + am[15];
    }

    return out;
  }
  /**
   * !#zh 在给定矩阵变换基础上加入新位移变换
   * !#en Add new displacement transducer in a matrix transformation on the basis of a given
   * @method translate
   * @typescript
   * static translate<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, a: Out, v: VecLike)
   * @static
   */
  ;

  Mat4.translate = function translate(out, a, v) {
    var m = out.m,
        am = a.m;

    if (a === out) {
      m[12] += v.x;
      m[13] += v.y;
      m[14] += v.y;
    } else {
      m[0] = am[0];
      m[1] = am[1];
      m[2] = am[2];
      m[3] = am[3];
      m[4] = am[4];
      m[5] = am[5];
      m[6] = am[6];
      m[7] = am[7];
      m[8] = am[8];
      m[9] = am[9];
      m[10] = am[10];
      m[11] = am[11];
      m[12] += v.x;
      m[13] += v.y;
      m[14] += v.z;
      m[15] = am[15];
    }

    return out;
  }
  /**
   * !#zh 在给定矩阵变换基础上加入新缩放变换
   * !#en Add new scaling transformation in a given matrix transformation on the basis of
   * @method scale
   * @typescript
   * static scale<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, a: Out, v: VecLike)
   * @static
   */
  ;

  Mat4.scale = function scale(out, a, v) {
    var x = v.x,
        y = v.y,
        z = v.z;
    var m = out.m,
        am = a.m;
    m[0] = am[0] * x;
    m[1] = am[1] * x;
    m[2] = am[2] * x;
    m[3] = am[3] * x;
    m[4] = am[4] * y;
    m[5] = am[5] * y;
    m[6] = am[6] * y;
    m[7] = am[7] * y;
    m[8] = am[8] * z;
    m[9] = am[9] * z;
    m[10] = am[10] * z;
    m[11] = am[11] * z;
    m[12] = am[12];
    m[13] = am[13];
    m[14] = am[14];
    m[15] = am[15];
    return out;
  }
  /**
   * !#zh 在给定矩阵变换基础上加入新旋转变换
   * !#en Add a new rotational transform matrix transformation on the basis of a given
   * @method rotate
   * @typescript
   * static rotate<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, a: Out, rad: number, axis: VecLike)
   * @param rad 旋转角度
   * @param axis 旋转轴
   * @static
   */
  ;

  Mat4.rotate = function rotate(out, a, rad, axis) {
    var x = axis.x,
        y = axis.y,
        z = axis.z;
    var len = Math.sqrt(x * x + y * y + z * z);

    if (Math.abs(len) < _utils.EPSILON) {
      return null;
    }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var t = 1 - c;
    var am = a.m;
    _a00 = am[0];
    _a01 = am[1];
    _a02 = am[2];
    _a03 = am[3];
    _a10 = am[4];
    _a11 = am[5];
    _a12 = am[6];
    _a13 = am[7];
    _a20 = am[8];
    _a21 = am[9];
    _a22 = am[10];
    _a23 = am[11]; // Construct the elements of the rotation matrix

    var b00 = x * x * t + c,
        b01 = y * x * t + z * s,
        b02 = z * x * t - y * s;
    var b10 = x * y * t - z * s,
        b11 = y * y * t + c,
        b12 = z * y * t + x * s;
    var b20 = x * z * t + y * s,
        b21 = y * z * t - x * s,
        b22 = z * z * t + c;
    var m = out.m; // Perform rotation-specific matrix multiplication

    m[0] = _a00 * b00 + _a10 * b01 + _a20 * b02;
    m[1] = _a01 * b00 + _a11 * b01 + _a21 * b02;
    m[2] = _a02 * b00 + _a12 * b01 + _a22 * b02;
    m[3] = _a03 * b00 + _a13 * b01 + _a23 * b02;
    m[4] = _a00 * b10 + _a10 * b11 + _a20 * b12;
    m[5] = _a01 * b10 + _a11 * b11 + _a21 * b12;
    m[6] = _a02 * b10 + _a12 * b11 + _a22 * b12;
    m[7] = _a03 * b10 + _a13 * b11 + _a23 * b12;
    m[8] = _a00 * b20 + _a10 * b21 + _a20 * b22;
    m[9] = _a01 * b20 + _a11 * b21 + _a21 * b22;
    m[10] = _a02 * b20 + _a12 * b21 + _a22 * b22;
    m[11] = _a03 * b20 + _a13 * b21 + _a23 * b22; // If the source and destination differ, copy the unchanged last row

    if (a !== out) {
      m[12] = am[12];
      m[13] = am[13];
      m[14] = am[14];
      m[15] = am[15];
    }

    return out;
  }
  /**
   * !#zh 在给定矩阵变换基础上加入绕 X 轴的旋转变换
   * !#en Add rotational transformation around the X axis at a given matrix transformation on the basis of
   * @method rotateX
   * @typescript
   * static rotateX<Out extends IMat4Like> (out: Out, a: Out, rad: number)
   * @param rad 旋转角度
   * @static
   */
  ;

  Mat4.rotateX = function rotateX(out, a, rad) {
    var m = out.m,
        am = a.m;
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a10 = am[4],
        a11 = am[5],
        a12 = am[6],
        a13 = am[7],
        a20 = am[8],
        a21 = am[9],
        a22 = am[10],
        a23 = am[11];

    if (a !== out) {
      // If the source and destination differ, copy the unchanged rows
      m[0] = am[0];
      m[1] = am[1];
      m[2] = am[2];
      m[3] = am[3];
      m[12] = am[12];
      m[13] = am[13];
      m[14] = am[14];
      m[15] = am[15];
    } // Perform axis-specific matrix multiplication


    m[4] = a10 * c + a20 * s;
    m[5] = a11 * c + a21 * s;
    m[6] = a12 * c + a22 * s;
    m[7] = a13 * c + a23 * s;
    m[8] = a20 * c - a10 * s;
    m[9] = a21 * c - a11 * s;
    m[10] = a22 * c - a12 * s;
    m[11] = a23 * c - a13 * s;
    return out;
  }
  /**
   * !#zh 在给定矩阵变换基础上加入绕 Y 轴的旋转变换
   * !#en Add about the Y axis rotation transformation in a given matrix transformation on the basis of
   * @method rotateY
   * @typescript
   * static rotateY<Out extends IMat4Like> (out: Out, a: Out, rad: number)
   * @param rad 旋转角度
   * @static
   */
  ;

  Mat4.rotateY = function rotateY(out, a, rad) {
    var m = out.m,
        am = a.m;
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = am[0],
        a01 = am[1],
        a02 = am[2],
        a03 = am[3],
        a20 = am[8],
        a21 = am[9],
        a22 = am[10],
        a23 = am[11];

    if (a !== out) {
      // If the source and destination differ, copy the unchanged rows
      m[4] = am[4];
      m[5] = am[5];
      m[6] = am[6];
      m[7] = am[7];
      m[12] = am[12];
      m[13] = am[13];
      m[14] = am[14];
      m[15] = am[15];
    } // Perform axis-specific matrix multiplication


    m[0] = a00 * c - a20 * s;
    m[1] = a01 * c - a21 * s;
    m[2] = a02 * c - a22 * s;
    m[3] = a03 * c - a23 * s;
    m[8] = a00 * s + a20 * c;
    m[9] = a01 * s + a21 * c;
    m[10] = a02 * s + a22 * c;
    m[11] = a03 * s + a23 * c;
    return out;
  }
  /**
   * !#zh 在给定矩阵变换基础上加入绕 Z 轴的旋转变换
   * !#en Added about the Z axis at a given rotational transformation matrix transformation on the basis of
   * @method rotateZ
   * @typescript
   * static rotateZ<Out extends IMat4Like> (out: Out, a: Out, rad: number)
   * @param rad 旋转角度
   * @static
   */
  ;

  Mat4.rotateZ = function rotateZ(out, a, rad) {
    var am = a.m;
    var m = out.m;
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a.m[0],
        a01 = a.m[1],
        a02 = a.m[2],
        a03 = a.m[3],
        a10 = a.m[4],
        a11 = a.m[5],
        a12 = a.m[6],
        a13 = a.m[7]; // If the source and destination differ, copy the unchanged last row

    if (a !== out) {
      m[8] = am[8];
      m[9] = am[9];
      m[10] = am[10];
      m[11] = am[11];
      m[12] = am[12];
      m[13] = am[13];
      m[14] = am[14];
      m[15] = am[15];
    } // Perform axis-specific matrix multiplication


    m[0] = a00 * c + a10 * s;
    m[1] = a01 * c + a11 * s;
    m[2] = a02 * c + a12 * s;
    m[3] = a03 * c + a13 * s;
    m[4] = a10 * c - a00 * s;
    m[5] = a11 * c - a01 * s;
    m[6] = a12 * c - a02 * s;
    m[7] = a13 * c - a03 * s;
    return out;
  }
  /**
   * !#zh 计算位移矩阵
   * !#en Displacement matrix calculation
   * @method fromTranslation
   * @typescript
   * static fromTranslation<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, v: VecLike)
   * @static
   */
  ;

  Mat4.fromTranslation = function fromTranslation(out, v) {
    var m = out.m;
    m[0] = 1;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = 1;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = 1;
    m[11] = 0;
    m[12] = v.x;
    m[13] = v.y;
    m[14] = v.z;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 计算缩放矩阵
   * !#en Scaling matrix calculation
   * @method fromScaling
   * @typescript
   * static fromScaling<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, v: VecLike)
   * @static
   */
  ;

  Mat4.fromScaling = function fromScaling(out, v) {
    var m = out.m;
    m[0] = v.x;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = v.y;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = v.z;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 计算旋转矩阵
   * !#en Calculates the rotation matrix
   * @method fromRotation
   * @typescript
   * static fromRotation<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, rad: number, axis: VecLike)
   * @static
   */
  ;

  Mat4.fromRotation = function fromRotation(out, rad, axis) {
    var x = axis.x,
        y = axis.y,
        z = axis.z;
    var len = Math.sqrt(x * x + y * y + z * z);

    if (Math.abs(len) < _utils.EPSILON) {
      return null;
    }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var t = 1 - c; // Perform rotation-specific matrix multiplication

    var m = out.m;
    m[0] = x * x * t + c;
    m[1] = y * x * t + z * s;
    m[2] = z * x * t - y * s;
    m[3] = 0;
    m[4] = x * y * t - z * s;
    m[5] = y * y * t + c;
    m[6] = z * y * t + x * s;
    m[7] = 0;
    m[8] = x * z * t + y * s;
    m[9] = y * z * t - x * s;
    m[10] = z * z * t + c;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 计算绕 X 轴的旋转矩阵
   * !#en Calculating rotation matrix about the X axis
   * @method fromXRotation
   * @typescript
   * static fromXRotation<Out extends IMat4Like> (out: Out, rad: number)
   * @static
   */
  ;

  Mat4.fromXRotation = function fromXRotation(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad); // Perform axis-specific matrix multiplication

    var m = out.m;
    m[0] = 1;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = c;
    m[6] = s;
    m[7] = 0;
    m[8] = 0;
    m[9] = -s;
    m[10] = c;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 计算绕 Y 轴的旋转矩阵
   * !#en Calculating rotation matrix about the Y axis
   * @method fromYRotation
   * @typescript
   * static fromYRotation<Out extends IMat4Like> (out: Out, rad: number)
   * @static
   */
  ;

  Mat4.fromYRotation = function fromYRotation(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad); // Perform axis-specific matrix multiplication

    var m = out.m;
    m[0] = c;
    m[1] = 0;
    m[2] = -s;
    m[3] = 0;
    m[4] = 0;
    m[5] = 1;
    m[6] = 0;
    m[7] = 0;
    m[8] = s;
    m[9] = 0;
    m[10] = c;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 计算绕 Z 轴的旋转矩阵
   * !#en Calculating rotation matrix about the Z axis
   * @method fromZRotation
   * @typescript
   * static fromZRotation<Out extends IMat4Like> (out: Out, rad: number)
   * @static
   */
  ;

  Mat4.fromZRotation = function fromZRotation(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad); // Perform axis-specific matrix multiplication

    var m = out.m;
    m[0] = c;
    m[1] = s;
    m[2] = 0;
    m[3] = 0;
    m[4] = -s;
    m[5] = c;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = 1;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 根据旋转和位移信息计算矩阵
   * !#en The rotation and displacement information calculating matrix
   * @method fromRT
   * @typescript
   * static fromRT<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, q: Quat, v: VecLike)
   * @static
   */
  ;

  Mat4.fromRT = function fromRT(out, q, v) {
    var x = q.x,
        y = q.y,
        z = q.z,
        w = q.w;
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var m = out.m;
    m[0] = 1 - (yy + zz);
    m[1] = xy + wz;
    m[2] = xz - wy;
    m[3] = 0;
    m[4] = xy - wz;
    m[5] = 1 - (xx + zz);
    m[6] = yz + wx;
    m[7] = 0;
    m[8] = xz + wy;
    m[9] = yz - wx;
    m[10] = 1 - (xx + yy);
    m[11] = 0;
    m[12] = v.x;
    m[13] = v.y;
    m[14] = v.z;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 提取矩阵的位移信息, 默认矩阵中的变换以 S->R->T 的顺序应用
   * !#en Extracting displacement information of the matrix, the matrix transform to the default sequential application S-> R-> T is
   * @method getTranslation
   * @typescript
   * static getTranslation<Out extends IMat4Like, VecLike extends IVec3Like> (out: VecLike, mat: Out)
   * @static
   */
  ;

  Mat4.getTranslation = function getTranslation(out, mat) {
    var m = mat.m;
    out.x = m[12];
    out.y = m[13];
    out.z = m[14];
    return out;
  }
  /**
   * !#zh 提取矩阵的缩放信息, 默认矩阵中的变换以 S->R->T 的顺序应用
   * !#en Scaling information extraction matrix, the matrix transform to the default sequential application S-> R-> T is
   * @method getScaling
   * @typescript
   * static getScaling<Out extends IMat4Like, VecLike extends IVec3Like> (out: VecLike, mat: Out)
   * @static
   */
  ;

  Mat4.getScaling = function getScaling(out, mat) {
    var m = mat.m;
    var m3 = m3_1.m;
    var m00 = m3[0] = m[0];
    var m01 = m3[1] = m[1];
    var m02 = m3[2] = m[2];
    var m04 = m3[3] = m[4];
    var m05 = m3[4] = m[5];
    var m06 = m3[5] = m[6];
    var m08 = m3[6] = m[8];
    var m09 = m3[7] = m[9];
    var m10 = m3[8] = m[10];
    out.x = Math.sqrt(m00 * m00 + m01 * m01 + m02 * m02);
    out.y = Math.sqrt(m04 * m04 + m05 * m05 + m06 * m06);
    out.z = Math.sqrt(m08 * m08 + m09 * m09 + m10 * m10); // account for refections

    if (_mat["default"].determinant(m3_1) < 0) {
      out.x *= -1;
    }

    return out;
  }
  /**
   * !#zh 提取矩阵的旋转信息, 默认输入矩阵不含有缩放信息，如考虑缩放应使用 `toRTS` 函数。
   * !#en Rotation information extraction matrix, the matrix containing no default input scaling information, such as the use of `toRTS` should consider the scaling function.
   * @method getRotation
   * @typescript
   * static getRotation<Out extends IMat4Like> (out: Quat, mat: Out)
   * @static
   */
  ;

  Mat4.getRotation = function getRotation(out, mat) {
    var m = mat.m;
    var trace = m[0] + m[5] + m[10];
    var S = 0;

    if (trace > 0) {
      S = Math.sqrt(trace + 1.0) * 2;
      out.w = 0.25 * S;
      out.x = (m[6] - m[9]) / S;
      out.y = (m[8] - m[2]) / S;
      out.z = (m[1] - m[4]) / S;
    } else if (m[0] > m[5] && m[0] > m[10]) {
      S = Math.sqrt(1.0 + m[0] - m[5] - m[10]) * 2;
      out.w = (m[6] - m[9]) / S;
      out.x = 0.25 * S;
      out.y = (m[1] + m[4]) / S;
      out.z = (m[8] + m[2]) / S;
    } else if (m[5] > m[10]) {
      S = Math.sqrt(1.0 + m[5] - m[0] - m[10]) * 2;
      out.w = (m[8] - m[2]) / S;
      out.x = (m[1] + m[4]) / S;
      out.y = 0.25 * S;
      out.z = (m[6] + m[9]) / S;
    } else {
      S = Math.sqrt(1.0 + m[10] - m[0] - m[5]) * 2;
      out.w = (m[1] - m[4]) / S;
      out.x = (m[8] + m[2]) / S;
      out.y = (m[6] + m[9]) / S;
      out.z = 0.25 * S;
    }

    return out;
  }
  /**
   * !#zh 提取旋转、位移、缩放信息， 默认矩阵中的变换以 S->R->T 的顺序应用
   * !#en Extracting rotational displacement, zoom information, the default matrix transformation in order S-> R-> T applications
   * @method toRTS
   * @typescript
   * static toRTS<Out extends IMat4Like, VecLike extends IVec3Like> (mat: Out, q: Quat, v: VecLike, s: VecLike)
   * @static
   */
  ;

  Mat4.toRTS = function toRTS(mat, q, v, s) {
    var m = mat.m;
    var m3 = m3_1.m;
    s.x = _vec["default"].set(v3_1, m[0], m[1], m[2]).mag();
    m3[0] = m[0] / s.x;
    m3[1] = m[1] / s.x;
    m3[2] = m[2] / s.x;
    s.y = _vec["default"].set(v3_1, m[4], m[5], m[6]).mag();
    m3[3] = m[4] / s.y;
    m3[4] = m[5] / s.y;
    m3[5] = m[6] / s.y;
    s.z = _vec["default"].set(v3_1, m[8], m[9], m[10]).mag();
    m3[6] = m[8] / s.z;
    m3[7] = m[9] / s.z;
    m3[8] = m[10] / s.z;

    var det = _mat["default"].determinant(m3_1);

    if (det < 0) {
      s.x *= -1;
      m3[0] *= -1;
      m3[1] *= -1;
      m3[2] *= -1;
    }

    _quat["default"].fromMat3(q, m3_1); // already normalized


    _vec["default"].set(v, m[12], m[13], m[14]);
  }
  /**
   * !#zh 根据旋转、位移、缩放信息计算矩阵，以 S->R->T 的顺序应用
   * !#en The rotary displacement, the scaling matrix calculation information, the order S-> R-> T applications
   * @method fromRTS
   * @typescript
   * static fromRTS<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, q: Quat, v: VecLike, s: VecLike)
   * @static
   */
  ;

  Mat4.fromRTS = function fromRTS(out, q, v, s) {
    var x = q.x,
        y = q.y,
        z = q.z,
        w = q.w;
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var sx = s.x;
    var sy = s.y;
    var sz = s.z;
    var m = out.m;
    m[0] = (1 - (yy + zz)) * sx;
    m[1] = (xy + wz) * sx;
    m[2] = (xz - wy) * sx;
    m[3] = 0;
    m[4] = (xy - wz) * sy;
    m[5] = (1 - (xx + zz)) * sy;
    m[6] = (yz + wx) * sy;
    m[7] = 0;
    m[8] = (xz + wy) * sz;
    m[9] = (yz - wx) * sz;
    m[10] = (1 - (xx + yy)) * sz;
    m[11] = 0;
    m[12] = v.x;
    m[13] = v.y;
    m[14] = v.z;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 根据指定的旋转、位移、缩放及变换中心信息计算矩阵，以 S->R->T 的顺序应用
   * !#en According to the specified rotation, displacement, and scale conversion matrix calculation information center, order S-> R-> T applications
   * @method fromRTSOrigin
   * @typescript
   * static fromRTSOrigin<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, q: Quat, v: VecLike, s: VecLike, o: VecLike)
   * @param q 旋转值
   * @param v 位移值
   * @param s 缩放值
   * @param o 指定变换中心
   * @static
   */
  ;

  Mat4.fromRTSOrigin = function fromRTSOrigin(out, q, v, s, o) {
    var x = q.x,
        y = q.y,
        z = q.z,
        w = q.w;
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var sx = s.x;
    var sy = s.y;
    var sz = s.z;
    var ox = o.x;
    var oy = o.y;
    var oz = o.z;
    var m = out.m;
    m[0] = (1 - (yy + zz)) * sx;
    m[1] = (xy + wz) * sx;
    m[2] = (xz - wy) * sx;
    m[3] = 0;
    m[4] = (xy - wz) * sy;
    m[5] = (1 - (xx + zz)) * sy;
    m[6] = (yz + wx) * sy;
    m[7] = 0;
    m[8] = (xz + wy) * sz;
    m[9] = (yz - wx) * sz;
    m[10] = (1 - (xx + yy)) * sz;
    m[11] = 0;
    m[12] = v.x + ox - (m[0] * ox + m[4] * oy + m[8] * oz);
    m[13] = v.y + oy - (m[1] * ox + m[5] * oy + m[9] * oz);
    m[14] = v.z + oz - (m[2] * ox + m[6] * oy + m[10] * oz);
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 根据指定的旋转信息计算矩阵
   * !#en The rotation matrix calculation information specified
   * @method fromQuat
   * @typescript
   * static fromQuat<Out extends IMat4Like> (out: Out, q: Quat)
   * @static
   */
  ;

  Mat4.fromQuat = function fromQuat(out, q) {
    var x = q.x,
        y = q.y,
        z = q.z,
        w = q.w;
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var yx = y * x2;
    var yy = y * y2;
    var zx = z * x2;
    var zy = z * y2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var m = out.m;
    m[0] = 1 - yy - zz;
    m[1] = yx + wz;
    m[2] = zx - wy;
    m[3] = 0;
    m[4] = yx - wz;
    m[5] = 1 - xx - zz;
    m[6] = zy + wx;
    m[7] = 0;
    m[8] = zx + wy;
    m[9] = zy - wx;
    m[10] = 1 - xx - yy;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 根据指定的视锥体信息计算矩阵
   * !#en The matrix calculation information specified frustum
   * @method frustum
   * @typescript
   * static frustum<Out extends IMat4Like> (out: Out, left: number, right: number, bottom: number, top: number, near: number, far: number)
   * @param left 左平面距离
   * @param right 右平面距离
   * @param bottom 下平面距离
   * @param top 上平面距离
   * @param near 近平面距离
   * @param far 远平面距离
   * @static
   */
  ;

  Mat4.frustum = function frustum(out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left);
    var tb = 1 / (top - bottom);
    var nf = 1 / (near - far);
    var m = out.m;
    m[0] = near * 2 * rl;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = near * 2 * tb;
    m[6] = 0;
    m[7] = 0;
    m[8] = (right + left) * rl;
    m[9] = (top + bottom) * tb;
    m[10] = (far + near) * nf;
    m[11] = -1;
    m[12] = 0;
    m[13] = 0;
    m[14] = far * near * 2 * nf;
    m[15] = 0;
    return out;
  }
  /**
   * !#zh 计算透视投影矩阵
   * !#en Perspective projection matrix calculation
   * @method perspective
   * @typescript
   * static perspective<Out extends IMat4Like> (out: Out, fovy: number, aspect: number, near: number, far: number)
   * @param fovy 纵向视角高度
   * @param aspect 长宽比
   * @param near 近平面距离
   * @param far 远平面距离
   * @static
   */
  ;

  Mat4.perspective = function perspective(out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2);
    var nf = 1 / (near - far);
    var m = out.m;
    m[0] = f / aspect;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = f;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = (far + near) * nf;
    m[11] = -1;
    m[12] = 0;
    m[13] = 0;
    m[14] = 2 * far * near * nf;
    m[15] = 0;
    return out;
  }
  /**
   * !#zh 计算正交投影矩阵
   * !#en Computing orthogonal projection matrix
   * @method ortho
   * @typescript
   * static ortho<Out extends IMat4Like> (out: Out, left: number, right: number, bottom: number, top: number, near: number, far: number)
   * @param left 左平面距离
   * @param right 右平面距离
   * @param bottom 下平面距离
   * @param top 上平面距离
   * @param near 近平面距离
   * @param far 远平面距离
   * @static
   */
  ;

  Mat4.ortho = function ortho(out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right);
    var bt = 1 / (bottom - top);
    var nf = 1 / (near - far);
    var m = out.m;
    m[0] = -2 * lr;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = -2 * bt;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = 2 * nf;
    m[11] = 0;
    m[12] = (left + right) * lr;
    m[13] = (top + bottom) * bt;
    m[14] = (far + near) * nf;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 根据视点计算矩阵，注意 `eye - center` 不能为零向量或与 `up` 向量平行
   * !#en `Up` parallel vector or vector center` not be zero - the matrix calculation according to the viewpoint, note` eye
   * @method lookAt
   * @typescript
   * static lookAt<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, eye: VecLike, center: VecLike, up: VecLike)
   * @param eye 当前位置
   * @param center 目标视点
   * @param up 视口上方向
   * @static
   */
  ;

  Mat4.lookAt = function lookAt(out, eye, center, up) {
    var eyex = eye.x;
    var eyey = eye.y;
    var eyez = eye.z;
    var upx = up.x;
    var upy = up.y;
    var upz = up.z;
    var centerx = center.x;
    var centery = center.y;
    var centerz = center.z;
    var z0 = eyex - centerx;
    var z1 = eyey - centery;
    var z2 = eyez - centerz;
    var len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;
    var x0 = upy * z2 - upz * z1;
    var x1 = upz * z0 - upx * z2;
    var x2 = upx * z1 - upy * z0;
    len = 1 / Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    x0 *= len;
    x1 *= len;
    x2 *= len;
    var y0 = z1 * x2 - z2 * x1;
    var y1 = z2 * x0 - z0 * x2;
    var y2 = z0 * x1 - z1 * x0;
    var m = out.m;
    m[0] = x0;
    m[1] = y0;
    m[2] = z0;
    m[3] = 0;
    m[4] = x1;
    m[5] = y1;
    m[6] = z1;
    m[7] = 0;
    m[8] = x2;
    m[9] = y2;
    m[10] = z2;
    m[11] = 0;
    m[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    m[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    m[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 计算逆转置矩阵
   * !#en Reversal matrix calculation
   * @method inverseTranspose
   * @typescript
   * static inverseTranspose<Out extends IMat4Like> (out: Out, a: Out)
   * @static
   */
  ;

  Mat4.inverseTranspose = function inverseTranspose(out, a) {
    var m = a.m;
    _a00 = m[0];
    _a01 = m[1];
    _a02 = m[2];
    _a03 = m[3];
    _a10 = m[4];
    _a11 = m[5];
    _a12 = m[6];
    _a13 = m[7];
    _a20 = m[8];
    _a21 = m[9];
    _a22 = m[10];
    _a23 = m[11];
    _a30 = m[12];
    _a31 = m[13];
    _a32 = m[14];
    _a33 = m[15];
    var b00 = _a00 * _a11 - _a01 * _a10;
    var b01 = _a00 * _a12 - _a02 * _a10;
    var b02 = _a00 * _a13 - _a03 * _a10;
    var b03 = _a01 * _a12 - _a02 * _a11;
    var b04 = _a01 * _a13 - _a03 * _a11;
    var b05 = _a02 * _a13 - _a03 * _a12;
    var b06 = _a20 * _a31 - _a21 * _a30;
    var b07 = _a20 * _a32 - _a22 * _a30;
    var b08 = _a20 * _a33 - _a23 * _a30;
    var b09 = _a21 * _a32 - _a22 * _a31;
    var b10 = _a21 * _a33 - _a23 * _a31;
    var b11 = _a22 * _a33 - _a23 * _a32; // Calculate the determinant

    var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
      return null;
    }

    det = 1.0 / det;
    m = out.m;
    m[0] = (_a11 * b11 - _a12 * b10 + _a13 * b09) * det;
    m[1] = (_a12 * b08 - _a10 * b11 - _a13 * b07) * det;
    m[2] = (_a10 * b10 - _a11 * b08 + _a13 * b06) * det;
    m[3] = 0;
    m[4] = (_a02 * b10 - _a01 * b11 - _a03 * b09) * det;
    m[5] = (_a00 * b11 - _a02 * b08 + _a03 * b07) * det;
    m[6] = (_a01 * b08 - _a00 * b10 - _a03 * b06) * det;
    m[7] = 0;
    m[8] = (_a31 * b05 - _a32 * b04 + _a33 * b03) * det;
    m[9] = (_a32 * b02 - _a30 * b05 - _a33 * b01) * det;
    m[10] = (_a30 * b04 - _a31 * b02 + _a33 * b00) * det;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 逐元素矩阵加法
   * !#en Element by element matrix addition
   * @method add
   * @typescript
   * static add<Out extends IMat4Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Mat4.add = function add(out, a, b) {
    var m = out.m,
        am = a.m,
        bm = b.m;
    m[0] = am[0] + bm[0];
    m[1] = am[1] + bm[1];
    m[2] = am[2] + bm[2];
    m[3] = am[3] + bm[3];
    m[4] = am[4] + bm[4];
    m[5] = am[5] + bm[5];
    m[6] = am[6] + bm[6];
    m[7] = am[7] + bm[7];
    m[8] = am[8] + bm[8];
    m[9] = am[9] + bm[9];
    m[10] = am[10] + bm[10];
    m[11] = am[11] + bm[11];
    m[12] = am[12] + bm[12];
    m[13] = am[13] + bm[13];
    m[14] = am[14] + bm[14];
    m[15] = am[15] + bm[15];
    return out;
  }
  /**
   * !#zh 逐元素矩阵减法
   * !#en Matrix element by element subtraction
   * @method subtract
   * @typescript
   * static subtract<Out extends IMat4Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Mat4.subtract = function subtract(out, a, b) {
    var m = out.m,
        am = a.m,
        bm = b.m;
    m[0] = am[0] - bm[0];
    m[1] = am[1] - bm[1];
    m[2] = am[2] - bm[2];
    m[3] = am[3] - bm[3];
    m[4] = am[4] - bm[4];
    m[5] = am[5] - bm[5];
    m[6] = am[6] - bm[6];
    m[7] = am[7] - bm[7];
    m[8] = am[8] - bm[8];
    m[9] = am[9] - bm[9];
    m[10] = am[10] - bm[10];
    m[11] = am[11] - bm[11];
    m[12] = am[12] - bm[12];
    m[13] = am[13] - bm[13];
    m[14] = am[14] - bm[14];
    m[15] = am[15] - bm[15];
    return out;
  }
  /**
   * !#zh 矩阵标量乘法
   * !#en Matrix scalar multiplication
   * @method multiplyScalar
   * @typescript
   * static multiplyScalar<Out extends IMat4Like> (out: Out, a: Out, b: number)
   * @static
   */
  ;

  Mat4.multiplyScalar = function multiplyScalar(out, a, b) {
    var m = out.m,
        am = a.m;
    m[0] = am[0] * b;
    m[1] = am[1] * b;
    m[2] = am[2] * b;
    m[3] = am[3] * b;
    m[4] = am[4] * b;
    m[5] = am[5] * b;
    m[6] = am[6] * b;
    m[7] = am[7] * b;
    m[8] = am[8] * b;
    m[9] = am[9] * b;
    m[10] = am[10] * b;
    m[11] = am[11] * b;
    m[12] = am[12] * b;
    m[13] = am[13] * b;
    m[14] = am[14] * b;
    m[15] = am[15] * b;
    return out;
  }
  /**
   * !#zh 逐元素矩阵标量乘加: A + B * scale
   * !#en Elements of the matrix by the scalar multiplication and addition: A + B * scale
   * @method multiplyScalarAndAdd
   * @typescript
   * static multiplyScalarAndAdd<Out extends IMat4Like> (out: Out, a: Out, b: Out, scale: number)
   * @static
   */
  ;

  Mat4.multiplyScalarAndAdd = function multiplyScalarAndAdd(out, a, b, scale) {
    var m = out.m,
        am = a.m,
        bm = b.m;
    m[0] = am[0] + bm[0] * scale;
    m[1] = am[1] + bm[1] * scale;
    m[2] = am[2] + bm[2] * scale;
    m[3] = am[3] + bm[3] * scale;
    m[4] = am[4] + bm[4] * scale;
    m[5] = am[5] + bm[5] * scale;
    m[6] = am[6] + bm[6] * scale;
    m[7] = am[7] + bm[7] * scale;
    m[8] = am[8] + bm[8] * scale;
    m[9] = am[9] + bm[9] * scale;
    m[10] = am[10] + bm[10] * scale;
    m[11] = am[11] + bm[11] * scale;
    m[12] = am[12] + bm[12] * scale;
    m[13] = am[13] + bm[13] * scale;
    m[14] = am[14] + bm[14] * scale;
    m[15] = am[15] + bm[15] * scale;
    return out;
  }
  /**
   * !#zh 矩阵等价判断
   * !#en Analyzing the equivalent matrix
   * @method strictEquals
   * @typescript
   * static strictEquals<Out extends IMat4Like> (a: Out, b: Out)
   * @static
   */
  ;

  Mat4.strictEquals = function strictEquals(a, b) {
    var am = a.m,
        bm = b.m;
    return am[0] === bm[0] && am[1] === bm[1] && am[2] === bm[2] && am[3] === bm[3] && am[4] === bm[4] && am[5] === bm[5] && am[6] === bm[6] && am[7] === bm[7] && am[8] === bm[8] && am[9] === bm[9] && am[10] === bm[10] && am[11] === bm[11] && am[12] === bm[12] && am[13] === bm[13] && am[14] === bm[14] && am[15] === bm[15];
  }
  /**
   * !#zh 排除浮点数误差的矩阵近似等价判断
   * !#en Negative floating point error is approximately equivalent to determining a matrix
   * @method equals
   * @typescript
   * static equals<Out extends IMat4Like> (a: Out, b: Out, epsilon = EPSILON)
   * @static
   */
  ;

  Mat4.equals = function equals(a, b, epsilon) {
    if (epsilon === void 0) {
      epsilon = _utils.EPSILON;
    }

    var am = a.m,
        bm = b.m;
    return Math.abs(am[0] - bm[0]) <= epsilon * Math.max(1.0, Math.abs(am[0]), Math.abs(bm[0])) && Math.abs(am[1] - bm[1]) <= epsilon * Math.max(1.0, Math.abs(am[1]), Math.abs(bm[1])) && Math.abs(am[2] - bm[2]) <= epsilon * Math.max(1.0, Math.abs(am[2]), Math.abs(bm[2])) && Math.abs(am[3] - bm[3]) <= epsilon * Math.max(1.0, Math.abs(am[3]), Math.abs(bm[3])) && Math.abs(am[4] - bm[4]) <= epsilon * Math.max(1.0, Math.abs(am[4]), Math.abs(bm[4])) && Math.abs(am[5] - bm[5]) <= epsilon * Math.max(1.0, Math.abs(am[5]), Math.abs(bm[5])) && Math.abs(am[6] - bm[6]) <= epsilon * Math.max(1.0, Math.abs(am[6]), Math.abs(bm[6])) && Math.abs(am[7] - bm[7]) <= epsilon * Math.max(1.0, Math.abs(am[7]), Math.abs(bm[7])) && Math.abs(am[8] - bm[8]) <= epsilon * Math.max(1.0, Math.abs(am[8]), Math.abs(bm[8])) && Math.abs(am[9] - bm[9]) <= epsilon * Math.max(1.0, Math.abs(am[9]), Math.abs(bm[9])) && Math.abs(am[10] - bm[10]) <= epsilon * Math.max(1.0, Math.abs(am[10]), Math.abs(bm[10])) && Math.abs(am[11] - bm[11]) <= epsilon * Math.max(1.0, Math.abs(am[11]), Math.abs(bm[11])) && Math.abs(am[12] - bm[12]) <= epsilon * Math.max(1.0, Math.abs(am[12]), Math.abs(bm[12])) && Math.abs(am[13] - bm[13]) <= epsilon * Math.max(1.0, Math.abs(am[13]), Math.abs(bm[13])) && Math.abs(am[14] - bm[14]) <= epsilon * Math.max(1.0, Math.abs(am[14]), Math.abs(bm[14])) && Math.abs(am[15] - bm[15]) <= epsilon * Math.max(1.0, Math.abs(am[15]), Math.abs(bm[15]));
  }
  /**
   * Calculates the adjugate of a matrix.
   *
   * @param {Mat4} out - Matrix to store result.
   * @param {Mat4} a - Matrix to calculate.
   * @returns {Mat4} out.
   */
  ;

  Mat4.adjoint = function adjoint(out, a) {
    var am = a.m,
        outm = out.m;
    var a00 = am[0],
        a01 = am[1],
        a02 = am[2],
        a03 = am[3],
        a10 = am[4],
        a11 = am[5],
        a12 = am[6],
        a13 = am[7],
        a20 = am[8],
        a21 = am[9],
        a22 = am[10],
        a23 = am[11],
        a30 = am[12],
        a31 = am[13],
        a32 = am[14],
        a33 = am[15];
    outm[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
    outm[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    outm[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
    outm[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    outm[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    outm[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
    outm[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    outm[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
    outm[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
    outm[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    outm[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
    outm[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    outm[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    outm[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
    outm[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    outm[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
    return out;
  }
  /**
   * !#zh 矩阵转数组
   * !#en Matrix transpose array
   * @method toArray
   * @typescript
   * static toArray <Out extends IWritableArrayLike<number>> (out: Out, mat: IMat4Like, ofs = 0)
   * @param ofs 数组内的起始偏移量
   * @static
   */
  ;

  Mat4.toArray = function toArray(out, mat, ofs) {
    if (ofs === void 0) {
      ofs = 0;
    }

    var m = mat.m;

    for (var i = 0; i < 16; i++) {
      out[ofs + i] = m[i];
    }

    return out;
  }
  /**
   * !#zh 数组转矩阵
   * !#en Transfer matrix array
   * @method fromArray
   * @typescript
   * static fromArray <Out extends IMat4Like> (out: Out, arr: IWritableArrayLike<number>, ofs = 0)
   * @param ofs 数组起始偏移量
   * @static
   */
  ;

  Mat4.fromArray = function fromArray(out, arr, ofs) {
    if (ofs === void 0) {
      ofs = 0;
    }

    var m = out.m;

    for (var i = 0; i < 16; i++) {
      m[i] = arr[ofs + i];
    }

    return out;
  }
  /**
   * !#en Matrix Data
   * !#zh 矩阵数据
   * @property {Float64Array | Float32Array} m
   */
  ;

  /**
   * !#en
   * Constructor
   * see {{#crossLink "cc/mat4:method"}}cc.mat4{{/crossLink}}
   * !#zh
   * 构造函数，可查看 {{#crossLink "cc/mat4:method"}}cc.mat4{{/crossLink}}
   * @method constructor
   * @typescript
   * constructor (
          m00: number = 1, m01: number = 0, m02: number = 0, m03: number = 0,
          m10: number = 0, m11: number = 1, m12: number = 0, m13: number = 0,
          m20: number = 0, m21: number = 0, m22: number = 1, m23: number = 0,
          m30: number = 0, m31: number = 0, m32: number = 0, m33: number = 1
      )
   */
  function Mat4(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    var _this;

    if (m00 === void 0) {
      m00 = 1;
    }

    if (m01 === void 0) {
      m01 = 0;
    }

    if (m02 === void 0) {
      m02 = 0;
    }

    if (m03 === void 0) {
      m03 = 0;
    }

    if (m10 === void 0) {
      m10 = 0;
    }

    if (m11 === void 0) {
      m11 = 1;
    }

    if (m12 === void 0) {
      m12 = 0;
    }

    if (m13 === void 0) {
      m13 = 0;
    }

    if (m20 === void 0) {
      m20 = 0;
    }

    if (m21 === void 0) {
      m21 = 0;
    }

    if (m22 === void 0) {
      m22 = 1;
    }

    if (m23 === void 0) {
      m23 = 0;
    }

    if (m30 === void 0) {
      m30 = 0;
    }

    if (m31 === void 0) {
      m31 = 0;
    }

    if (m32 === void 0) {
      m32 = 0;
    }

    if (m33 === void 0) {
      m33 = 1;
    }

    _this = _ValueType.call(this) || this;
    _this.m = void 0;

    if (m00 instanceof _utils.FLOAT_ARRAY_TYPE) {
      _this.m = m00;
    } else {
      _this.m = new _utils.FLOAT_ARRAY_TYPE(16);
      var tm = _this.m;
      tm[0] = m00;
      tm[1] = m01;
      tm[2] = m02;
      tm[3] = m03;
      tm[4] = m10;
      tm[5] = m11;
      tm[6] = m12;
      tm[7] = m13;
      tm[8] = m20;
      tm[9] = m21;
      tm[10] = m22;
      tm[11] = m23;
      tm[12] = m30;
      tm[13] = m31;
      tm[14] = m32;
      tm[15] = m33;
    }

    return _this;
  }
  /**
   * !#en clone a Mat4 object
   * !#zh 克隆一个 Mat4 对象
   * @method clone
   * @return {Mat4}
   */


  _proto.clone = function clone() {
    var t = this;
    var tm = t.m;
    return new Mat4(tm[0], tm[1], tm[2], tm[3], tm[4], tm[5], tm[6], tm[7], tm[8], tm[9], tm[10], tm[11], tm[12], tm[13], tm[14], tm[15]);
  }
  /**
   * !#en Sets the matrix with another one's value
   * !#zh 用另一个矩阵设置这个矩阵的值。
   * @method set
   * @param {Mat4} srcObj
   * @return {Mat4} returns this
   * @chainable
   */
  ;

  _proto.set = function set(s) {
    var t = this;
    var tm = t.m,
        sm = s.m;
    tm[0] = sm[0];
    tm[1] = sm[1];
    tm[2] = sm[2];
    tm[3] = sm[3];
    tm[4] = sm[4];
    tm[5] = sm[5];
    tm[6] = sm[6];
    tm[7] = sm[7];
    tm[8] = sm[8];
    tm[9] = sm[9];
    tm[10] = sm[10];
    tm[11] = sm[11];
    tm[12] = sm[12];
    tm[13] = sm[13];
    tm[14] = sm[14];
    tm[15] = sm[15];
    return this;
  }
  /**
   * !#en Check whether two matrix equal
   * !#zh 当前的矩阵是否与指定的矩阵相等。
   * @method equals
   * @param {Mat4} other
   * @return {Boolean}
   */
  ;

  _proto.equals = function equals(other) {
    return Mat4.strictEquals(this, other);
  }
  /**
   * !#en Check whether two matrix equal with default degree of variance.
   * !#zh
   * 近似判断两个矩阵是否相等。<br/>
   * 判断 2 个矩阵是否在默认误差范围之内，如果在则返回 true，反之则返回 false。
   * @method fuzzyEquals
   * @param {Mat4} other
   * @return {Boolean}
   */
  ;

  _proto.fuzzyEquals = function fuzzyEquals(other) {
    return Mat4.equals(this, other);
  }
  /**
   * !#en Transform to string with matrix informations
   * !#zh 转换为方便阅读的字符串。
   * @method toString
   * @return {string}
   */
  ;

  _proto.toString = function toString() {
    var tm = this.m;

    if (tm) {
      return "[\n" + tm[0] + ", " + tm[1] + ", " + tm[2] + ", " + tm[3] + ",\n" + tm[4] + ", " + tm[5] + ", " + tm[6] + ", " + tm[7] + ",\n" + tm[8] + ", " + tm[9] + ", " + tm[10] + ", " + tm[11] + ",\n" + tm[12] + ", " + tm[13] + ", " + tm[14] + ", " + tm[15] + "\n" + "]";
    } else {
      return "[\n" + "1, 0, 0, 0\n" + "0, 1, 0, 0\n" + "0, 0, 1, 0\n" + "0, 0, 0, 1\n" + "]";
    }
  }
  /**
   * Set the matrix to the identity matrix
   * @method identity
   * @returns {Mat4} self
   * @chainable
   */
  ;

  _proto.identity = function identity() {
    return Mat4.identity(this);
  }
  /**
   * Transpose the values of a mat4
   * @method transpose
   * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created.
   * @returns {Mat4} out
   */
  ;

  _proto.transpose = function transpose(out) {
    out = out || new Mat4();
    return Mat4.transpose(out, this);
  }
  /**
   * Inverts a mat4
   * @method invert
   * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created.
   * @returns {Mat4} out
   */
  ;

  _proto.invert = function invert(out) {
    out = out || new Mat4();
    return Mat4.invert(out, this);
  }
  /**
   * Calculates the adjugate of a mat4
   * @method adjoint
   * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created.
   * @returns {Mat4} out
   */
  ;

  _proto.adjoint = function adjoint(out) {
    out = out || new Mat4();
    return Mat4.adjoint(out, this);
  }
  /**
   * Calculates the determinant of a mat4
   * @method determinant
   * @returns {Number} determinant of a
   */
  ;

  _proto.determinant = function determinant() {
    return Mat4.determinant(this);
  }
  /**
   * Adds two Mat4
   * @method add
   * @param {Mat4} other the second operand
   * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created.
   * @returns {Mat4} out
   */
  ;

  _proto.add = function add(other, out) {
    out = out || new Mat4();
    return Mat4.add(out, this, other);
  }
  /**
   * Subtracts the current matrix with another one
   * @method subtract
   * @param {Mat4} other the second operand
   * @returns {Mat4} this
   */
  ;

  _proto.subtract = function subtract(other) {
    return Mat4.subtract(this, this, other);
  }
  /**
   * Subtracts the current matrix with another one
   * @method multiply
   * @param {Mat4} other the second operand
   * @returns {Mat4} this
   */
  ;

  _proto.multiply = function multiply(other) {
    return Mat4.multiply(this, this, other);
  }
  /**
   * Multiply each element of the matrix by a scalar.
   * @method multiplyScalar
   * @param {Number} number amount to scale the matrix's elements by
   * @returns {Mat4} this
   */
  ;

  _proto.multiplyScalar = function multiplyScalar(number) {
    return Mat4.multiplyScalar(this, this, number);
  }
  /**
   * Translate a mat4 by the given vector
   * @method translate
   * @param {Vec3} v vector to translate by
   * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created
   * @returns {Mat4} out
   */
  ;

  _proto.translate = function translate(v, out) {
    out = out || new Mat4();
    return Mat4.translate(out, this, v);
  }
  /**
   * Scales the mat4 by the dimensions in the given vec3
   * @method scale
   * @param {Vec3} v vector to scale by
   * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created
   * @returns {Mat4} out
   */
  ;

  _proto.scale = function scale(v, out) {
    out = out || new Mat4();
    return Mat4.scale(out, this, v);
  }
  /**
   * Rotates a mat4 by the given angle around the given axis
   * @method rotate
   * @param {Number} rad the angle to rotate the matrix by
   * @param {Vec3} axis the axis to rotate around
   * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created
   * @returns {Mat4} out
   */
  ;

  _proto.rotate = function rotate(rad, axis, out) {
    out = out || new Mat4();
    return Mat4.rotate(out, this, rad, axis);
  }
  /**
   * Returns the translation vector component of a transformation matrix.
   * @method getTranslation
   * @param  {Vec3} out Vector to receive translation component, if not provided, a new vec3 will be created
   * @return {Vec3} out
   */
  ;

  _proto.getTranslation = function getTranslation(out) {
    out = out || new _vec["default"]();
    return Mat4.getTranslation(out, this);
  }
  /**
   * Returns the scale factor component of a transformation matrix
   * @method getScale
   * @param  {Vec3} out Vector to receive scale component, if not provided, a new vec3 will be created
   * @return {Vec3} out
   */
  ;

  _proto.getScale = function getScale(out) {
    out = out || new _vec["default"]();
    return Mat4.getScaling(out, this);
  }
  /**
   * Returns the rotation factor component of a transformation matrix
   * @method getRotation
   * @param  {Quat} out Vector to receive rotation component, if not provided, a new quaternion object will be created
   * @return {Quat} out
   */
  ;

  _proto.getRotation = function getRotation(out) {
    out = out || new _quat["default"]();
    return Mat4.getRotation(out, this);
  }
  /**
   * Restore the matrix values from a quaternion rotation, vector translation and vector scale
   * @method fromRTS
   * @param {Quat} q Rotation quaternion
   * @param {Vec3} v Translation vector
   * @param {Vec3} s Scaling vector
   * @returns {Mat4} the current mat4 object
   * @chainable
   */
  ;

  _proto.fromRTS = function fromRTS(q, v, s) {
    return Mat4.fromRTS(this, q, v, s);
  }
  /**
   * Restore the matrix values from a quaternion rotation
   * @method fromQuat
   * @param {Quat} q Rotation quaternion
   * @returns {Mat4} the current mat4 object
   * @chainable
   */
  ;

  _proto.fromQuat = function fromQuat(quat) {
    return Mat4.fromQuat(this, quat);
  };

  return Mat4;
}(_valueType["default"]);

exports["default"] = Mat4;
Mat4.mul = Mat4.multiply;
Mat4.sub = Mat4.subtract;
Mat4.IDENTITY = Object.freeze(new Mat4());
var v3_1 = new _vec["default"]();
var m3_1 = new _mat["default"]();

_CCClass["default"].fastDefine('cc.Mat4', Mat4, {
  m00: 1,
  m01: 0,
  m02: 0,
  m03: 0,
  m04: 0,
  m05: 1,
  m06: 0,
  m07: 0,
  m08: 0,
  m09: 0,
  m10: 1,
  m11: 0,
  m12: 0,
  m13: 0,
  m14: 0,
  m15: 1
});

var _loop = function _loop(i) {
  Object.defineProperty(Mat4.prototype, 'm' + i, {
    get: function get() {
      return this.m[i];
    },
    set: function set(value) {
      this.m[i] = value;
    }
  });
};

for (var i = 0; i < 16; i++) {
  _loop(i);
}
/**
 * @module cc
 */

/**
 * !#en The convenience method to create a new {{#crossLink "Mat4"}}cc.Mat4{{/crossLink}}.
 * !#zh 通过该简便的函数进行创建 {{#crossLink "Mat4"}}cc.Mat4{{/crossLink}} 对象。
 * @method mat4
 * @param {Number} [m00] Component in column 0, row 0 position (index 0)
 * @param {Number} [m01] Component in column 0, row 1 position (index 1)
 * @param {Number} [m02] Component in column 0, row 2 position (index 2)
 * @param {Number} [m03] Component in column 0, row 3 position (index 3)
 * @param {Number} [m10] Component in column 1, row 0 position (index 4)
 * @param {Number} [m11] Component in column 1, row 1 position (index 5)
 * @param {Number} [m12] Component in column 1, row 2 position (index 6)
 * @param {Number} [m13] Component in column 1, row 3 position (index 7)
 * @param {Number} [m20] Component in column 2, row 0 position (index 8)
 * @param {Number} [m21] Component in column 2, row 1 position (index 9)
 * @param {Number} [m22] Component in column 2, row 2 position (index 10)
 * @param {Number} [m23] Component in column 2, row 3 position (index 11)
 * @param {Number} [m30] Component in column 3, row 0 position (index 12)
 * @param {Number} [m31] Component in column 3, row 1 position (index 13)
 * @param {Number} [m32] Component in column 3, row 2 position (index 14)
 * @param {Number} [m33] Component in column 3, row 3 position (index 15)
 * @return {Mat4}
 */


cc.mat4 = function (m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  var mat = new Mat4(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);

  if (m00 === undefined) {
    Mat4.identity(mat);
  }

  return mat;
};

cc.Mat4 = Mat4;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hdDQudHMiXSwibmFtZXMiOlsiX2EwMCIsIl9hMDEiLCJfYTAyIiwiX2EwMyIsIl9hMTAiLCJfYTExIiwiX2ExMiIsIl9hMTMiLCJfYTIwIiwiX2EyMSIsIl9hMjIiLCJfYTIzIiwiX2EzMCIsIl9hMzEiLCJfYTMyIiwiX2EzMyIsIk1hdDQiLCJtdWwiLCJtIiwib3V0IiwibXVsdGlwbHkiLCJtdWxTY2FsYXIiLCJudW0iLCJtdWx0aXBseVNjYWxhciIsInN1YiIsInN1YnRyYWN0IiwiY2xvbmUiLCJhIiwiY29weSIsImFtIiwic2V0IiwibTAwIiwibTAxIiwibTAyIiwibTAzIiwibTEwIiwibTExIiwibTEyIiwibTEzIiwibTIwIiwibTIxIiwibTIyIiwibTIzIiwibTMwIiwibTMxIiwibTMyIiwibTMzIiwiaWRlbnRpdHkiLCJ0cmFuc3Bvc2UiLCJhMDEiLCJhMDIiLCJhMDMiLCJhMTIiLCJhMTMiLCJhMjMiLCJpbnZlcnQiLCJiMDAiLCJiMDEiLCJiMDIiLCJiMDMiLCJiMDQiLCJiMDUiLCJiMDYiLCJiMDciLCJiMDgiLCJiMDkiLCJiMTAiLCJiMTEiLCJkZXQiLCJkZXRlcm1pbmFudCIsImIiLCJibSIsImIwIiwiYjEiLCJiMiIsImIzIiwidHJhbnNmb3JtIiwidiIsIngiLCJ5IiwieiIsInRyYW5zbGF0ZSIsInNjYWxlIiwicm90YXRlIiwicmFkIiwiYXhpcyIsImxlbiIsIk1hdGgiLCJzcXJ0IiwiYWJzIiwiRVBTSUxPTiIsInMiLCJzaW4iLCJjIiwiY29zIiwidCIsImIxMiIsImIyMCIsImIyMSIsImIyMiIsInJvdGF0ZVgiLCJhMTAiLCJhMTEiLCJhMjAiLCJhMjEiLCJhMjIiLCJyb3RhdGVZIiwiYTAwIiwicm90YXRlWiIsImZyb21UcmFuc2xhdGlvbiIsImZyb21TY2FsaW5nIiwiZnJvbVJvdGF0aW9uIiwiZnJvbVhSb3RhdGlvbiIsImZyb21ZUm90YXRpb24iLCJmcm9tWlJvdGF0aW9uIiwiZnJvbVJUIiwicSIsInciLCJ4MiIsInkyIiwiejIiLCJ4eCIsInh5IiwieHoiLCJ5eSIsInl6IiwienoiLCJ3eCIsInd5Iiwid3oiLCJnZXRUcmFuc2xhdGlvbiIsIm1hdCIsImdldFNjYWxpbmciLCJtMyIsIm0zXzEiLCJtMDQiLCJtMDUiLCJtMDYiLCJtMDgiLCJtMDkiLCJNYXQzIiwiZ2V0Um90YXRpb24iLCJ0cmFjZSIsIlMiLCJ0b1JUUyIsIlZlYzMiLCJ2M18xIiwibWFnIiwiUXVhdCIsImZyb21NYXQzIiwiZnJvbVJUUyIsInN4Iiwic3kiLCJzeiIsImZyb21SVFNPcmlnaW4iLCJvIiwib3giLCJveSIsIm96IiwiZnJvbVF1YXQiLCJ5eCIsInp4IiwienkiLCJmcnVzdHVtIiwibGVmdCIsInJpZ2h0IiwiYm90dG9tIiwidG9wIiwibmVhciIsImZhciIsInJsIiwidGIiLCJuZiIsInBlcnNwZWN0aXZlIiwiZm92eSIsImFzcGVjdCIsImYiLCJ0YW4iLCJvcnRobyIsImxyIiwiYnQiLCJsb29rQXQiLCJleWUiLCJjZW50ZXIiLCJ1cCIsImV5ZXgiLCJleWV5IiwiZXlleiIsInVweCIsInVweSIsInVweiIsImNlbnRlcngiLCJjZW50ZXJ5IiwiY2VudGVyeiIsInowIiwiejEiLCJ4MCIsIngxIiwieTAiLCJ5MSIsImludmVyc2VUcmFuc3Bvc2UiLCJhZGQiLCJtdWx0aXBseVNjYWxhckFuZEFkZCIsInN0cmljdEVxdWFscyIsImVxdWFscyIsImVwc2lsb24iLCJtYXgiLCJhZGpvaW50Iiwib3V0bSIsImEzMCIsImEzMSIsImEzMiIsImEzMyIsInRvQXJyYXkiLCJvZnMiLCJpIiwiZnJvbUFycmF5IiwiYXJyIiwiRkxPQVRfQVJSQVlfVFlQRSIsInRtIiwic20iLCJvdGhlciIsImZ1enp5RXF1YWxzIiwidG9TdHJpbmciLCJudW1iZXIiLCJnZXRTY2FsZSIsInF1YXQiLCJWYWx1ZVR5cGUiLCJJREVOVElUWSIsIk9iamVjdCIsImZyZWV6ZSIsIkNDQ2xhc3MiLCJmYXN0RGVmaW5lIiwibTA3IiwibTE0IiwibTE1IiwiZGVmaW5lUHJvcGVydHki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LEdBQVI7QUFDQWpDLE1BQUFBLENBQUMsQ0FBQyxFQUFELENBQUQsR0FBUW1DLEdBQVI7QUFDQW5DLE1BQUFBLENBQUMsQ0FBQyxFQUFELENBQUQsR0FBUW9DLEdBQVI7QUFDSCxLQWRELE1BY087QUFDSHBDLE1BQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT1csRUFBRSxDQUFDLENBQUQsQ0FBVDtBQUNBWCxNQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQVQ7QUFDQVgsTUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFUO0FBQ0FYLE1BQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT1csRUFBRSxDQUFDLEVBQUQsQ0FBVDtBQUNBWCxNQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQVQ7QUFDQVgsTUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFUO0FBQ0FYLE1BQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT1csRUFBRSxDQUFDLENBQUQsQ0FBVDtBQUNBWCxNQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxFQUFELENBQVQ7QUFDQVgsTUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFUO0FBQ0FYLE1BQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT1csRUFBRSxDQUFDLENBQUQsQ0FBVDtBQUNBWCxNQUFBQSxDQUFDLENBQUMsRUFBRCxDQUFELEdBQVFXLEVBQUUsQ0FBQyxFQUFELENBQVY7QUFDQVgsTUFBQUEsQ0FBQyxDQUFDLEVBQUQsQ0FBRCxHQUFRVyxFQUFFLENBQUMsRUFBRCxDQUFWO0FBQ0FYLE1BQUFBLENBQUMsQ0FBQyxFQUFELENBQUQsR0FBUVcsRUFBRSxDQUFDLENBQUQsQ0FBVjtBQUNBWCxNQUFBQSxDQUFDLENBQUMsRUFBRCxDQUFELEdB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Q0FBQyxDQUFDLEVBQUQsQ0FBRCxJQUFTMkQsQ0FBQyxDQUFDQyxDQUFYO0FBQ0E1RCxNQUFBQSxDQUFDLENBQUMsRUFBRCxDQUFELElBQVMyRCxDQUFDLENBQUNFLENBQVg7QUFDQTdELE1BQUFBLENBQUMsQ0FBQyxFQUFELENBQUQsSUFBUzJELENBQUMsQ0FBQ0UsQ0FBWDtBQUNILEtBSkQsTUFJTztBQUNIN0QsTUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFUO0FBQWNYLE1BQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT1csRUFBRSxDQUFDLENBQUQsQ0FBVDtBQUFjWCxNQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQVQ7QUFBY1gsTUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFUO0FBQzFDWCxNQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQVQ7QUFBY1gsTUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFUO0FBQWNYLE1BQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT1csRUFBRSxDQUFDLENBQUQsQ0FBVDtBQUFjWCxNQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQVQ7QUFDMUNYLE1BQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT1csRUFBRSxDQUFDLENBQUQsQ0FBVDtBQUFjWCxNQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQVQ7QUFBY1gsTUFBQUEsQ0FBQyxDQUFDLEVBQUQsQ0FBRCxHQUFRVyxFQUFFLENBQUMsRUFBRCxDQUFWO0FBQWdCWCxNQUFBQSxDQUFDLENBQUMsRUFBRCxDQUFELEdBQVFXLEVBQUUsQ0FBQyxFQUFELENBQVY7QUFDNUNYLE1BQUFBLENBQUMsQ0FBQyxFQUFELENB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QUNELENBQVo7QUFBQSxRQUFlVyxFQUFFLEdBQUdGLENBQUMsQ0FBQ1QsQ0FBdEI7QUFBQSxRQUF5QnFELEVBQUUsR0FBR0QsQ0FBQyxDQUFDcEQsQ0FBaEM7QUFDQUEsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEwQyxFQUFFLENBQUMsQ0FBRCxDQUFqQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEwQyxFQUFFLENBQUMsQ0FBRCxDQUFqQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEwQyxFQUFFLENBQUMsQ0FBRCxDQUFqQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEwQyxFQUFFLENBQUMsQ0FBRCxDQUFqQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEwQyxFQUFFLENBQUMsQ0FBRCxDQUFqQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEwQyxFQUFFLENBQUMsQ0FBRCxDQUFqQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEwQyxFQUFFLENBQUMsQ0FBRCxDQUFqQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEwQyxFQUFFLENBQUMsQ0FBRCxDQUFqQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEwQyxFQUFFLENBQUMsQ0FBRCxDQUFqQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEwQyxFQUFFLENBQUMsQ0FBRCxDQUFqQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLEVBQUQsQ0FBRCxHQUFRVyxFQUFFLENBQUMsRUFBRCxDQUFGLEdBQVMwQyxFQUFFLENBQUMsRUFBRCxDQUFuQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLEVBQUQsQ0FBRCxHQUFRVyxFQUFFLENBQUMsRUFBRCxDQUFGLEdBQVMwQyxFQUFFLENBQUMsRUFBRCxDQUFuQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLEVBQUQsQ0FBRCxHQUFRVyxFQUFFLENBQUMsRUFBRCxDQUFGLEdBQVMwQyxFQUFFLENBQUMsRUFBRCxDQUFuQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLEVBQUQsQ0FBRCxHQUFRVyxFQUFFLENBQUMsRUFBRCxDQUFGLEdBQVMwQyxFQUFFLENBQUMsRUFBRCxDQUFuQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLEVBQUQsQ0FBRCxHQUFRVyxFQUFFLENBQUMsRUFBRCxDQUFGLEdBQVMwQyxFQUFFLENBQUMsRUFBRCxDQUFuQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLEVBQUQsQ0FBRCxHQUFRVyxFQUFFLENBQUMsRUFBRCxDQUFGLEdBQVMwQyxFQUFFLENBQUMsRUFBRCxDQUFuQjtBQUNBLFdBQU9wRCxHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7OztPQVFPTSxXQUFQLGtCQUF3Q04sR0FBeEMsRUFBa0RRLENBQWxELEVBQTBEMkMsQ0FBMUQsRUFBa0U7QUFDOUQsUUFBSXBELENBQUMsR0FBR0MsR0FBRyxDQUFDRCxDQUFaO0FBQUEsUUFBZVcsRUFBRSxHQUFHRixDQUFDLENBQUNULENBQXRCO0FBQUEsUUFBeUJxRCxFQUFFLEdBQUdELENBQUMsQ0FBQ3BELENBQWhDO0FBQ0FBLElBQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT1csRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFRMEMsRUFBRSxDQUFDLENBQUQsQ0FBakI7QUFDQXJELElBQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT1csRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFRMEMsRUFBRSxDQUFDLENBQUQsQ0FBakI7QUFDQXJELElBQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT1csRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFRMEMsRUFBRSxDQUFDLENBQUQsQ0FBakI7QUFDQXJELElBQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT1csRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFRMEMsRUFBRSxDQUFDLENBQUQsQ0FBakI7QUFDQXJELElBQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT1csRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFRMEMsRUFBRSxDQUFDLENBQUQsQ0FBakI7QUFDQXJELElBQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT1csRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFRMEMsRUFBRSxDQUFDLENBQUQsQ0FBakI7QUFDQXJELElBQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT1csRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFRMEMsRUFBRSxDQUFDLENBQUQsQ0FBakI7QUFDQXJELElBQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT1csRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFRMEMsRUFBRSxDQUFDLENBQUQsQ0FBakI7QUFDQXJELElBQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT1csRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFRMEMsRUFBRSxDQUFDLENBQUQsQ0FBakI7QUFDQXJELElBQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT1csRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFRMEMsRUFBRSxDQUFDLENBQUQsQ0FBakI7QUFDQXJELElBQUFBLENBQUMsQ0FBQyxFQUFELENBQUQsR0FBUVcsRUFBRSxDQUFDLEVBQUQsQ0FBRixHQUFTMEMsRUFBRSxDQUFDLEVBQUQsQ0FBbkI7QUFDQXJELElBQUFBLENBQUMsQ0FBQyxFQUFELENBQUQsR0FBUVcsRUFBRSxDQUFD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Q0FBQ0UsR0FBTCxDQUFTNUQsRUFBRSxDQUFDLENBQUQsQ0FBWCxDQUFkLEVBQStCMEQsSUFBSSxDQUFDRSxHQUFMLENBQVNsQixFQUFFLENBQUMsQ0FBRCxDQUFYLENBQS9CLENBRnJDLElBR0FnQixJQUFJLENBQUNFLEdBQUwsQ0FBUzVELEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQW5CLEtBQTJCc0ksT0FBTyxHQUFHdEgsSUFBSSxDQUFDdUgsR0FBTCxDQUFTLEdBQVQsRUFBY3ZILElBQUksQ0FBQ0UsR0FBTCxDQUFTNUQsRUFBRSxDQUFDLENBQUQsQ0FBWCxDQUFkLEVBQStCMEQsSUFBSSxDQUFDRSxHQUFMLENBQVNsQixFQUFFLENBQUMsQ0FBRCxDQUFYLENBQS9CLENBSHJDLElBSUFnQixJQUFJLENBQUNFLEdBQUwsQ0FBUzVELEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQW5CLEtBQTJCc0ksT0FBTyxHQUFHdEgsSUFBSSxDQUFDdUgsR0FBTCxDQUFTLEdBQVQsRUFBY3ZILElBQUksQ0FBQ0UsR0FBTCxDQUFTNUQsRUFBRSxDQUFDLENBQUQsQ0FBWCxDQUFkLEVBQStCMEQsSUFBSSxDQUFDRSxHQUFMLENBQVNsQixFQUFFLENBQUMsQ0FBRCxDQUFYLENBQS9CLENBSnJDLElBS0FnQixJQUFJLENBQUNFLEdBQUwsQ0FBUzVELEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQW5CLEtBQTJCc0ksT0FBTyxHQUFHdEgsSUFBSSxDQUFDdUgsR0FBTCxDQUFTLEdBQVQsRUFBY3ZILElBQUksQ0FBQ0UsR0FBTCxDQUFTNUQsRUFBRSxDQUFDLENBQUQsQ0FBWCxDQUFkLEVBQStCMEQsSUFBSSxDQUFDRSxHQUFMLENBQVNsQixFQUFFLENBQUMsQ0FBRCxDQUFYLENBQS9CLENBTHJDLElBTUFnQixJQUFJLENBQUNFLEdBQUwsQ0FBUzVELEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQW5CLEtBQTJCc0ksT0FBTyxHQUFHdEgsSUFBSSxDQUFDdUgsR0FBTCxDQUFTLEdBQVQsRUFBY3ZILElBQUksQ0FBQ0UsR0FBTCxDQUFTNUQsRUFBRSxDQUFDLENBQUQsQ0FBWCxDQUFkLEVBQStCMEQsSUFBSSxDQUFDRSxHQUFMLENBQVNsQixFQUFFLENBQUMsQ0FBRCxDQUFYLENBQS9CLENBTnJDLElBT0FnQixJQUFJLENBQUNFLEdBQUwsQ0FBUzVELEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQW5CLEtBQTJCc0ksT0FBTyxHQUFHdEgsSUFBSSxDQUFDdUgsR0FBTCxDQUFTLEdBQVQsRUFBY3ZILElBQUksQ0FBQ0UsR0FBTCxDQUFTNUQsRUFBRSxDQUFDLENBQUQsQ0FBWCxDQUFkLEVBQStCMEQsSUFBSSxDQUFDRSxHQUFMLENBQVNsQixFQUFFLENBQUMsQ0FBRCxDQUFYLENBQS9CLENBUHJDLElBUUFnQixJQUFJLENBQUNFLEdBQUwsQ0FBUzVELEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQW5CLEtBQTJCc0ksT0FBTyxHQUFHdEgsSUFBSSxDQUFDdUgsR0FBTCxDQUFTLEdBQVQsRUFBY3ZILElBQUksQ0FBQ0UsR0FBTCxDQUFTNUQsRUFBRSxDQUFDLENBQUQsQ0FBWCxDQUFkLEVBQStCMEQsSUFBSSxDQUFDRSxHQUFMLENBQVNsQixFQUFFLENBQUMsQ0FBRCxDQUFYLENBQS9CLENBUnJDLElBU0FnQixJQUFJLENBQUNFLEdBQUwsQ0FBUzVELEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQW5CLEtBQTJCc0ksT0FBTyxHQUFHdEgsSUFBSSxDQUFDdUgsR0FBTCxDQUFTLEdBQVQsRUFBY3ZILElBQUksQ0FBQ0UsR0FBTCxDQUFTNUQsRUFBRSxDQUFDLENBQUQsQ0FBWCxDQUFkLEVBQStCMEQsSUFBSSxDQUFDRSxHQUFMLENBQVNsQixFQUFFLENBQUMsQ0FBRCxDQUFYLENBQS9CLENBVHJDLElBVUFnQixJQUFJLENBQUNFLEdBQUwsQ0FBUzVELEVBQUUsQ0FBQyxFQUFELENBQUYsR0FBUzBDLEVBQUUsQ0FBQyxFQUFELENBQXBCLEtBQTZCc0ksT0FBTyxHQUFHdEgsSUFBSSxDQUFDdUgsR0FBTCxDQUFTLEdBQVQsRUFBY3ZILElBQUksQ0FBQ0UsR0FBTCxDQUFTNUQsRUFBRSxDQUFDLEVBQUQsQ0FBWCxDQUFkLEVBQWdDMEQsSUFBSSxDQUFDRSxHQUFMLENBQVNsQixFQUFFLENBQUMsRUFBRCxDQUFYLENBQWhDLENBVnZDLElBV0FnQixJQUFJLENBQUNFLEdBQUwsQ0FBUzVELEVBQUUsQ0FBQyxFQUFELENBQUYsR0FBUzBDLEVBQUUsQ0FBQyxFQUFELENBQXBCLEtBQTZCc0ksT0FBTyxHQUFHdEgsSUFBSSxDQUFDdUgsR0FBTCxDQUFTLEdBQVQsRUFBY3ZILElBQUksQ0FBQ0UsR0FBTCxDQUFTNUQsRUFBRSxDQUFDLEVBQUQsQ0FBWCxDQUFkLEVBQWdDMEQsSUFBSSxDQUFDRSxHQUFMLENBQVNsQixFQUFFLENBQUMsRUFBRCxDQUFYLENBQWhDLENBWHZDLElBWUFnQixJQUFJLENBQUNFLEdBQUwsQ0FBUzVELEVBQUUsQ0FBQyxFQUFELENBQUYsR0FBUzBDLEVBQUUsQ0FBQyxFQUFELENBQXBCLEtBQTZCc0ksT0FBTyxHQUFHdEgsSUFBSSxDQUFDdUgsR0FBTCxDQUFTLEdBQVQsRUFBY3ZILElBQUksQ0FBQ0UsR0FBTCxDQUFTNUQsRUFBRSxDQUFDLEVBQUQsQ0FBWCxDQUFkLEVBQWdDMEQsSUFBSSxDQUFDRSxHQUFMLENBQVNsQixFQUFFLENBQUMsRUFBRCxDQUFYLENBQWhDLENBWnZDLElBYUFnQixJQUFJLENBQUNFLEdBQUwsQ0FBUzVELEVBQUUsQ0FBQyxFQUFELENBQUYsR0FBUzBDLEVBQUUsQ0FBQyxFQUFELENBQXBCLEtBQTZCc0ksT0FBTyxHQUFHdEgsSUFBSSxDQUFDdUgsR0FBTCxDQUFTLEdBQVQsRUFBY3ZILElBQUksQ0FBQ0UsR0FBTCxDQUFTNUQsRUFBRSxDQUFD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REMsR0FBNUQsRUFBaUVDLEdBQWpFLEVBQXNFQyxHQUF0RSxFQUEyRUMsR0FBM0UsRUFBZ0ZDLEdBQWhGLEVBQXFGQyxHQUFyRixFQUEwRjtBQUNoRyxNQUFJcUYsR0FBRyxHQUFHLElBQUluSCxJQUFKLENBQVNlLEdBQVQsRUFBY0MsR0FBZCxFQUFtQkMsR0FBbkIsRUFBd0JDLEdBQXhCLEVBQTZCQyxHQUE3QixFQUFrQ0MsR0FBbEMsRUFBdUNDLEdBQXZDLEVBQTRDQyxHQUE1QyxFQUFpREMsR0FBakQsRUFBc0RDLEdBQXRELEVBQTJEQyxHQUEzRCxFQUFnRUMsR0FBaEUsRUFBcUVDLEdBQXJFLEVBQTBFQyxHQUExRSxFQUErRUMsR0FBL0UsRUFBb0ZDLEdBQXBGLENBQVY7O0FBQ0EsTUFBSWYsR0FBRyxLQUFLbU4sU0FBWixFQUF1QjtBQUNuQmxPLElBQUFBLElBQUksQ0FBQytCLFFBQUwsQ0FBY29GLEdBQWQ7QUFDSDs7QUFDRCxTQUFPQSxHQUFQO0FBQ0gsQ0FORDs7QUFRQTZHLEVBQUUsQ0FBQ2hPLElBQUgsR0FBVUEsSUFBViIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgVmFsdWVUeXBlIGZyb20gJy4vdmFsdWUtdHlwZSc7XG5pbXBvcnQgQ0NDbGFzcyBmcm9tICcuLi9wbGF0Zm9ybS9DQ0NsYXNzJztcbmltcG9ydCBWZWMzIGZyb20gJy4vdmVjMyc7XG5pbXBvcnQgUXVhdCBmcm9tICcuL3F1YXQnO1xuaW1wb3J0IHsgRVBTSUxPTiwgRkxPQVRfQVJSQVlfVFlQRSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IE1hdDMgZnJvbSAnLi9tYXQzJztcbmltcG9ydCB7IElNYXQ0TGlrZSwgSVZlYzNMaWtlIH0gZnJvbSAnLi9tYXRoJztcblxubGV0IF9hMDA6IG51bWJlciA9IDA7IGxldCBfYTAxOiBudW1iZXIgPSAwOyBsZXQgX2EwMjogbnVtYmVyID0gMDsgbGV0IF9hMDM6IG51bWJlciA9IDA7XG5sZXQgX2ExMDogbnVtYmVyID0gMDsgbGV0IF9hMTE6IG51bWJlciA9IDA7IGxldCBfYTEyOiBudW1iZXIgPSAwOyBsZXQgX2ExMzogbnVtYmVyID0gMDtcbmxldCBfYTIwOiBudW1iZXIgPSAwOyBsZXQgX2EyMTogbnVtYmVyID0gMDsgbGV0IF9hMjI6IG51bWJlciA9IDA7IGxldCBfYTIzOiBudW1iZXIgPSAwO1xubGV0IF9hMzA6IG51bWJlciA9IDA7IGxldCBfYTMxOiBudW1iZXIgPSAwOyBsZXQgX2EzMjogbnVtYmVyID0gMDsgbGV0IF9hMzM6IG51bWJlciA9IDA7XG5cbi8qKlxuICogISNlbiBSZXByZXNlbnRhdGlvbiBvZiA0KjQgbWF0cml4LlxuICogISN6aCDooajnpLogNCo0IOefqemYtVxuICpcbiAqIEBjbGFzcyBNYXQ0XG4gKiBAZXh0ZW5kcyBWYWx1ZVR5cGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWF0NCBleHRlbmRzIFZhbHVlVHlwZSB7XG4gICAgc3RhdGljIG11bCA9IE1hdDQubXVsdGlwbHk7XG4gICAgc3RhdGljIHN1YiA9IE1hdDQuc3VidHJhY3Q7XG4gICAgbXVsIChtOiBNYXQ0LCBvdXQ6IE1hdDQpOiBNYXQ0IHtcbiAgICAgICAgcmV0dXJuIE1hdDQubXVsdGlwbHkob3V0IHx8IG5ldyBNYXQ0KCksIHRoaXMsIG0pO1xuICAgIH1cbiAgICBtdWxTY2FsYXIgKG51bTogbnVtYmVyLCBvdXQ6IE1hdDQpIHtcbiAgICAgICAgTWF0NC5tdWx0aXBseVNjYWxhcihvdXQgfHwgbmV3IE1hdDQoKSwgdGhpcywgbnVtKTtcbiAgICB9XG4gICAgc3ViIChtOiBNYXQ0LCBvdXQ6IE1hdDQpIHtcbiAgICAgICAgTWF0NC5zdWJ0cmFjdChvdXQgfHwgbmV3IE1hdDQoKSwgdGhpcywgbSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSWRlbnRpdHkgIG9mIE1hdDRcbiAgICAgKiBAcHJvcGVydHkge01hdDR9IElERU5USVRZXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBJREVOVElUWSA9IE9iamVjdC5mcmVlemUobmV3IE1hdDQoKSk7XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOiOt+W+l+aMh+WumuefqemYteeahOaLt+i0nVxuICAgICAqICEjZW4gQ29weSBvZiB0aGUgc3BlY2lmaWVkIG1hdHJpeCB0byBvYnRhaW5cbiAgICAgKiBAbWV0aG9kIGNsb25lXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgY2xvbmU8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAoYTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgY2xvbmU8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAoYTogT3V0KSB7XG4gICAgICAgIGxldCBtID0gYS5tO1xuICAgICAgICByZXR1cm4gbmV3IE1hdDQoXG4gICAgICAgICAgICBtWzBdLCBtWzFdLCBtWzJdLCBtWzNdLFxuICAgICAgICAgICAgbVs0XSwgbVs1XSwgbVs2XSwgbVs3XSxcbiAgICAgICAgICAgIG1bOF0sIG1bOV0sIG1bMTBdLCBtWzExXSxcbiAgICAgICAgICAgIG1bMTJdLCBtWzEzXSwgbVsxNF0sIG1bMTVdLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5aSN5Yi255uu5qCH55+p6Zi1XG4gICAgICogISNlbiBDb3B5IHRoZSB0YXJnZXQgbWF0cml4XG4gICAgICogQG1ldGhvZCBjb3B5XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgY29weTxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgY29weTxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XG4gICAgICAgIGxldCBtID0gb3V0Lm0sIGFtID0gYS5tO1xuICAgICAgICBtWzBdID0gYW1bMF07XG4gICAgICAgIG1bMV0gPSBhbVsxXTtcbiAgICAgICAgbVsyXSA9IGFtWzJdO1xuICAgICAgICBtWzNdID0gYW1bM107XG4gICAgICAgIG1bNF0gPSBhbVs0XTtcbiAgICAgICAgbVs1XSA9IGFtWzVdO1xuICAgICAgICBtWzZdID0gYW1bNl07XG4gICAgICAgIG1bN10gPSBhbVs3XTtcbiAgICAgICAgbVs4XSA9IGFtWzhdO1xuICAgICAgICBtWzldID0gYW1bOV07XG4gICAgICAgIG1bMTBdID0gYW1bMTBdO1xuICAgICAgICBtWzExXSA9IGFtWzExXTtcbiAgICAgICAgbVsxMl0gPSBhbVsxMl07XG4gICAgICAgIG1bMTNdID0gYW1bMTNdO1xuICAgICAgICBtWzE0XSA9IGFtWzE0XTtcbiAgICAgICAgbVsxNV0gPSBhbVsxNV07XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDorr7nva7nn6npmLXlgLxcbiAgICAgKiAhI2VuIFNldHRpbmcgbWF0cml4IHZhbHVlc1xuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgc2V0PE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKFxuICAgICAgICBvdXQ6IE91dCxcbiAgICAgICAgbTAwOiBudW1iZXIsIG0wMTogbnVtYmVyLCBtMDI6IG51bWJlciwgbTAzOiBudW1iZXIsXG4gICAgICAgIG0xMDogbnVtYmVyLCBtMTE6IG51bWJlciwgbTEyOiBudW1iZXIsIG0xMzogbnVtYmVyLFxuICAgICAgICBtMjA6IG51bWJlciwgbTIxOiBudW1iZXIsIG0yMjogbnVtYmVyLCBtMjM6IG51bWJlcixcbiAgICAgICAgbTMwOiBudW1iZXIsIG0zMTogbnVtYmVyLCBtMzI6IG51bWJlciwgbTMzOiBudW1iZXIsXG4gICAgKSB7XG4gICAgICAgIGxldCBtID0gb3V0Lm07XG4gICAgICAgIG1bMF0gPSBtMDA7IG1bMV0gPSBtMDE7IG1bMl0gPSBtMDI7IG1bM10gPSBtMDM7XG4gICAgICAgIG1bNF0gPSBtMTA7IG1bNV0gPSBtMTE7IG1bNl0gPSBtMTI7IG1bN10gPSBtMTM7XG4gICAgICAgIG1bOF0gPSBtMjA7IG1bOV0gPSBtMjE7IG1bMTBdID0gbTIyOyBtWzExXSA9IG0yMztcbiAgICAgICAgbVsxMl0gPSBtMzA7IG1bMTNdID0gbTMxOyBtWzE0XSA9IG0zMjsgbVsxNV0gPSBtMzM7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlsIbnm67moIfotYvlgLzkuLrljZXkvY3nn6npmLVcbiAgICAgKiAhI2VuIFRoZSB0YXJnZXQgb2YgYW4gYXNzaWdubWVudCBpcyB0aGUgaWRlbnRpdHkgbWF0cml4XG4gICAgICogQG1ldGhvZCBpZGVudGl0eVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIGlkZW50aXR5PE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgaWRlbnRpdHk8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQpIHtcbiAgICAgICAgbGV0IG0gPSBvdXQubTtcbiAgICAgICAgbVswXSA9IDE7XG4gICAgICAgIG1bMV0gPSAwO1xuICAgICAgICBtWzJdID0gMDtcbiAgICAgICAgbVszXSA9IDA7XG4gICAgICAgIG1bNF0gPSAwO1xuICAgICAgICBtWzVdID0gMTtcbiAgICAgICAgbVs2XSA9IDA7XG4gICAgICAgIG1bN10gPSAwO1xuICAgICAgICBtWzhdID0gMDtcbiAgICAgICAgbVs5XSA9IDA7XG4gICAgICAgIG1bMTBdID0gMTtcbiAgICAgICAgbVsxMV0gPSAwO1xuICAgICAgICBtWzEyXSA9IDA7XG4gICAgICAgIG1bMTNdID0gMDtcbiAgICAgICAgbVsxNF0gPSAwO1xuICAgICAgICBtWzE1XSA9IDE7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDovaznva7nn6npmLVcbiAgICAgKiAhI2VuIFRyYW5zcG9zZWQgbWF0cml4XG4gICAgICogQG1ldGhvZCB0cmFuc3Bvc2VcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyB0cmFuc3Bvc2U8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHRyYW5zcG9zZTxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XG4gICAgICAgIGxldCBtID0gb3V0Lm0sIGFtID0gYS5tO1xuICAgICAgICAvLyBJZiB3ZSBhcmUgdHJhbnNwb3Npbmcgb3Vyc2VsdmVzIHdlIGNhbiBza2lwIGEgZmV3IHN0ZXBzIGJ1dCBoYXZlIHRvIGNhY2hlIHNvbWUgdmFsdWVzXG4gICAgICAgIGlmIChvdXQgPT09IGEpIHtcbiAgICAgICAgICAgIGNvbnN0IGEwMSA9IGFtWzFdLCBhMDIgPSBhbVsyXSwgYTAzID0gYW1bM10sIGExMiA9IGFtWzZdLCBhMTMgPSBhbVs3XSwgYTIzID0gYW1bMTFdO1xuICAgICAgICAgICAgbVsxXSA9IGFtWzRdO1xuICAgICAgICAgICAgbVsyXSA9IGFtWzhdO1xuICAgICAgICAgICAgbVszXSA9IGFtWzEyXTtcbiAgICAgICAgICAgIG1bNF0gPSBhMDE7XG4gICAgICAgICAgICBtWzZdID0gYW1bOV07XG4gICAgICAgICAgICBtWzddID0gYW1bMTNdO1xuICAgICAgICAgICAgbVs4XSA9IGEwMjtcbiAgICAgICAgICAgIG1bOV0gPSBhMTI7XG4gICAgICAgICAgICBtWzExXSA9IGFtWzE0XTtcbiAgICAgICAgICAgIG1bMTJdID0gYTAzO1xuICAgICAgICAgICAgbVsxM10gPSBhMTM7XG4gICAgICAgICAgICBtWzE0XSA9IGEyMztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1bMF0gPSBhbVswXTtcbiAgICAgICAgICAgIG1bMV0gPSBhbVs0XTtcbiAgICAgICAgICAgIG1bMl0gPSBhbVs4XTtcbiAgICAgICAgICAgIG1bM10gPSBhbVsxMl07XG4gICAgICAgICAgICBtWzRdID0gYW1bMV07XG4gICAgICAgICAgICBtWzVdID0gYW1bNV07XG4gICAgICAgICAgICBtWzZdID0gYW1bOV07XG4gICAgICAgICAgICBtWzddID0gYW1bMTNdO1xuICAgICAgICAgICAgbVs4XSA9IGFtWzJdO1xuICAgICAgICAgICAgbVs5XSA9IGFtWzZdO1xuICAgICAgICAgICAgbVsxMF0gPSBhbVsxMF07XG4gICAgICAgICAgICBtWzExXSA9IGFtWzE0XTtcbiAgICAgICAgICAgIG1bMTJdID0gYW1bM107XG4gICAgICAgICAgICBtWzEzXSA9IGFtWzddO1xuICAgICAgICAgICAgbVsxNF0gPSBhbVsxMV07XG4gICAgICAgICAgICBtWzE1XSA9IGFtWzE1XTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg55+p6Zi15rGC6YCGXG4gICAgICogISNlbiBNYXRyaXggaW52ZXJzaW9uXG4gICAgICogQG1ldGhvZCBpbnZlcnRcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBpbnZlcnQ8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGludmVydDxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XG4gICAgICAgIGxldCBhbSA9IGEubTtcbiAgICAgICAgX2EwMCA9IGFtWzBdOyBfYTAxID0gYW1bMV07IF9hMDIgPSBhbVsyXTsgX2EwMyA9IGFtWzNdO1xuICAgICAgICBfYTEwID0gYW1bNF07IF9hMTEgPSBhbVs1XTsgX2ExMiA9IGFtWzZdOyBfYTEzID0gYW1bN107XG4gICAgICAgIF9hMjAgPSBhbVs4XTsgX2EyMSA9IGFtWzldOyBfYTIyID0gYW1bMTBdOyBfYTIzID0gYW1bMTFdO1xuICAgICAgICBfYTMwID0gYW1bMTJdOyBfYTMxID0gYW1bMTNdOyBfYTMyID0gYW1bMTRdOyBfYTMzID0gYW1bMTVdO1xuXG4gICAgICAgIGNvbnN0IGIwMCA9IF9hMDAgKiBfYTExIC0gX2EwMSAqIF9hMTA7XG4gICAgICAgIGNvbnN0IGIwMSA9IF9hMDAgKiBfYTEyIC0gX2EwMiAqIF9hMTA7XG4gICAgICAgIGNvbnN0IGIwMiA9IF9hMDAgKiBfYTEzIC0gX2EwMyAqIF9hMTA7XG4gICAgICAgIGNvbnN0IGIwMyA9IF9hMDEgKiBfYTEyIC0gX2EwMiAqIF9hMTE7XG4gICAgICAgIGNvbnN0IGIwNCA9IF9hMDEgKiBfYTEzIC0gX2EwMyAqIF9hMTE7XG4gICAgICAgIGNvbnN0IGIwNSA9IF9hMDIgKiBfYTEzIC0gX2EwMyAqIF9hMTI7XG4gICAgICAgIGNvbnN0IGIwNiA9IF9hMjAgKiBfYTMxIC0gX2EyMSAqIF9hMzA7XG4gICAgICAgIGNvbnN0IGIwNyA9IF9hMjAgKiBfYTMyIC0gX2EyMiAqIF9hMzA7XG4gICAgICAgIGNvbnN0IGIwOCA9IF9hMjAgKiBfYTMzIC0gX2EyMyAqIF9hMzA7XG4gICAgICAgIGNvbnN0IGIwOSA9IF9hMjEgKiBfYTMyIC0gX2EyMiAqIF9hMzE7XG4gICAgICAgIGNvbnN0IGIxMCA9IF9hMjEgKiBfYTMzIC0gX2EyMyAqIF9hMzE7XG4gICAgICAgIGNvbnN0IGIxMSA9IF9hMjIgKiBfYTMzIC0gX2EyMyAqIF9hMzI7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBkZXRlcm1pbmFudFxuICAgICAgICBsZXQgZGV0ID0gYjAwICogYjExIC0gYjAxICogYjEwICsgYjAyICogYjA5ICsgYjAzICogYjA4IC0gYjA0ICogYjA3ICsgYjA1ICogYjA2O1xuXG4gICAgICAgIGlmIChkZXQgPT09IDApIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgICAgZGV0ID0gMS4wIC8gZGV0O1xuXG4gICAgICAgIGxldCBtID0gb3V0Lm07XG4gICAgICAgIG1bMF0gPSAoX2ExMSAqIGIxMSAtIF9hMTIgKiBiMTAgKyBfYTEzICogYjA5KSAqIGRldDtcbiAgICAgICAgbVsxXSA9IChfYTAyICogYjEwIC0gX2EwMSAqIGIxMSAtIF9hMDMgKiBiMDkpICogZGV0O1xuICAgICAgICBtWzJdID0gKF9hMzEgKiBiMDUgLSBfYTMyICogYjA0ICsgX2EzMyAqIGIwMykgKiBkZXQ7XG4gICAgICAgIG1bM10gPSAoX2EyMiAqIGIwNCAtIF9hMjEgKiBiMDUgLSBfYTIzICogYjAzKSAqIGRldDtcbiAgICAgICAgbVs0XSA9IChfYTEyICogYjA4IC0gX2ExMCAqIGIxMSAtIF9hMTMgKiBiMDcpICogZGV0O1xuICAgICAgICBtWzVdID0gKF9hMDAgKiBiMTEgLSBfYTAyICogYjA4ICsgX2EwMyAqIGIwNykgKiBkZXQ7XG4gICAgICAgIG1bNl0gPSAoX2EzMiAqIGIwMiAtIF9hMzAgKiBiMDUgLSBfYTMzICogYjAxKSAqIGRldDtcbiAgICAgICAgbVs3XSA9IChfYTIwICogYjA1IC0gX2EyMiAqIGIwMiArIF9hMjMgKiBiMDEpICogZGV0O1xuICAgICAgICBtWzhdID0gKF9hMTAgKiBiMTAgLSBfYTExICogYjA4ICsgX2ExMyAqIGIwNikgKiBkZXQ7XG4gICAgICAgIG1bOV0gPSAoX2EwMSAqIGIwOCAtIF9hMDAgKiBiMTAgLSBfYTAzICogYjA2KSAqIGRldDtcbiAgICAgICAgbVsxMF0gPSAoX2EzMCAqIGIwNCAtIF9hMzEgKiBiMDIgKyBfYTMzICogYjAwKSAqIGRldDtcbiAgICAgICAgbVsxMV0gPSAoX2EyMSAqIGIwMiAtIF9hMjAgKiBiMDQgLSBfYTIzICogYjAwKSAqIGRldDtcbiAgICAgICAgbVsxMl0gPSAoX2ExMSAqIGIwNyAtIF9hMTAgKiBiMDkgLSBfYTEyICogYjA2KSAqIGRldDtcbiAgICAgICAgbVsxM10gPSAoX2EwMCAqIGIwOSAtIF9hMDEgKiBiMDcgKyBfYTAyICogYjA2KSAqIGRldDtcbiAgICAgICAgbVsxNF0gPSAoX2EzMSAqIGIwMSAtIF9hMzAgKiBiMDMgLSBfYTMyICogYjAwKSAqIGRldDtcbiAgICAgICAgbVsxNV0gPSAoX2EyMCAqIGIwMyAtIF9hMjEgKiBiMDEgKyBfYTIyICogYjAwKSAqIGRldDtcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg55+p6Zi16KGM5YiX5byPXG4gICAgICogISNlbiBNYXRyaXggZGV0ZXJtaW5hbnRcbiAgICAgKiBAbWV0aG9kIGRldGVybWluYW50XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgZGV0ZXJtaW5hbnQ8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAoYTogT3V0KTogbnVtYmVyXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBkZXRlcm1pbmFudDxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChhOiBPdXQpOiBudW1iZXIge1xuICAgICAgICBsZXQgbSA9IGEubTtcbiAgICAgICAgX2EwMCA9IG1bMF07IF9hMDEgPSBtWzFdOyBfYTAyID0gbVsyXTsgX2EwMyA9IG1bM107XG4gICAgICAgIF9hMTAgPSBtWzRdOyBfYTExID0gbVs1XTsgX2ExMiA9IG1bNl07IF9hMTMgPSBtWzddO1xuICAgICAgICBfYTIwID0gbVs4XTsgX2EyMSA9IG1bOV07IF9hMjIgPSBtWzEwXTsgX2EyMyA9IG1bMTFdO1xuICAgICAgICBfYTMwID0gbVsxMl07IF9hMzEgPSBtWzEzXTsgX2EzMiA9IG1bMTRdOyBfYTMzID0gbVsxNV07XG5cbiAgICAgICAgY29uc3QgYjAwID0gX2EwMCAqIF9hMTEgLSBfYTAxICogX2ExMDtcbiAgICAgICAgY29uc3QgYjAxID0gX2EwMCAqIF9hMTIgLSBfYTAyICogX2ExMDtcbiAgICAgICAgY29uc3QgYjAyID0gX2EwMCAqIF9hMTMgLSBfYTAzICogX2ExMDtcbiAgICAgICAgY29uc3QgYjAzID0gX2EwMSAqIF9hMTIgLSBfYTAyICogX2ExMTtcbiAgICAgICAgY29uc3QgYjA0ID0gX2EwMSAqIF9hMTMgLSBfYTAzICogX2ExMTtcbiAgICAgICAgY29uc3QgYjA1ID0gX2EwMiAqIF9hMTMgLSBfYTAzICogX2ExMjtcbiAgICAgICAgY29uc3QgYjA2ID0gX2EyMCAqIF9hMzEgLSBfYTIxICogX2EzMDtcbiAgICAgICAgY29uc3QgYjA3ID0gX2EyMCAqIF9hMzIgLSBfYTIyICogX2EzMDtcbiAgICAgICAgY29uc3QgYjA4ID0gX2EyMCAqIF9hMzMgLSBfYTIzICogX2EzMDtcbiAgICAgICAgY29uc3QgYjA5ID0gX2EyMSAqIF9hMzIgLSBfYTIyICogX2EzMTtcbiAgICAgICAgY29uc3QgYjEwID0gX2EyMSAqIF9hMzMgLSBfYTIzICogX2EzMTtcbiAgICAgICAgY29uc3QgYjExID0gX2EyMiAqIF9hMzMgLSBfYTIzICogX2EzMjtcblxuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGRldGVybWluYW50XG4gICAgICAgIHJldHVybiBiMDAgKiBiMTEgLSBiMDEgKiBiMTAgKyBiMDIgKiBiMDkgKyBiMDMgKiBiMDggLSBiMDQgKiBiMDcgKyBiMDUgKiBiMDY7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDnn6npmLXkuZjms5VcbiAgICAgKiAhI2VuIE1hdHJpeCBNdWx0aXBsaWNhdGlvblxuICAgICAqIEBtZXRob2QgbXVsdGlwbHlcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBtdWx0aXBseTxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBtdWx0aXBseTxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgbGV0IG0gPSBvdXQubSwgYW0gPSBhLm0sIGJtID0gYi5tO1xuICAgICAgICBfYTAwID0gYW1bMF07IF9hMDEgPSBhbVsxXTsgX2EwMiA9IGFtWzJdOyBfYTAzID0gYW1bM107XG4gICAgICAgIF9hMTAgPSBhbVs0XTsgX2ExMSA9IGFtWzVdOyBfYTEyID0gYW1bNl07IF9hMTMgPSBhbVs3XTtcbiAgICAgICAgX2EyMCA9IGFtWzhdOyBfYTIxID0gYW1bOV07IF9hMjIgPSBhbVsxMF07IF9hMjMgPSBhbVsxMV07XG4gICAgICAgIF9hMzAgPSBhbVsxMl07IF9hMzEgPSBhbVsxM107IF9hMzIgPSBhbVsxNF07IF9hMzMgPSBhbVsxNV07XG5cbiAgICAgICAgLy8gQ2FjaGUgb25seSB0aGUgY3VycmVudCBsaW5lIG9mIHRoZSBzZWNvbmQgbWF0cml4XG4gICAgICAgIGxldCBiMCA9IGJtWzBdLCBiMSA9IGJtWzFdLCBiMiA9IGJtWzJdLCBiMyA9IGJtWzNdO1xuICAgICAgICBtWzBdID0gYjAgKiBfYTAwICsgYjEgKiBfYTEwICsgYjIgKiBfYTIwICsgYjMgKiBfYTMwO1xuICAgICAgICBtWzFdID0gYjAgKiBfYTAxICsgYjEgKiBfYTExICsgYjIgKiBfYTIxICsgYjMgKiBfYTMxO1xuICAgICAgICBtWzJdID0gYjAgKiBfYTAyICsgYjEgKiBfYTEyICsgYjIgKiBfYTIyICsgYjMgKiBfYTMyO1xuICAgICAgICBtWzNdID0gYjAgKiBfYTAzICsgYjEgKiBfYTEzICsgYjIgKiBfYTIzICsgYjMgKiBfYTMzO1xuXG4gICAgICAgIGIwID0gYm1bNF07IGIxID0gYm1bNV07IGIyID0gYm1bNl07IGIzID0gYm1bN107XG4gICAgICAgIG1bNF0gPSBiMCAqIF9hMDAgKyBiMSAqIF9hMTAgKyBiMiAqIF9hMjAgKyBiMyAqIF9hMzA7XG4gICAgICAgIG1bNV0gPSBiMCAqIF9hMDEgKyBiMSAqIF9hMTEgKyBiMiAqIF9hMjEgKyBiMyAqIF9hMzE7XG4gICAgICAgIG1bNl0gPSBiMCAqIF9hMDIgKyBiMSAqIF9hMTIgKyBiMiAqIF9hMjIgKyBiMyAqIF9hMzI7XG4gICAgICAgIG1bN10gPSBiMCAqIF9hMDMgKyBiMSAqIF9hMTMgKyBiMiAqIF9hMjMgKyBiMyAqIF9hMzM7XG5cbiAgICAgICAgYjAgPSBibVs4XTsgYjEgPSBibVs5XTsgYjIgPSBibVsxMF07IGIzID0gYm1bMTFdO1xuICAgICAgICBtWzhdID0gYjAgKiBfYTAwICsgYjEgKiBfYTEwICsgYjIgKiBfYTIwICsgYjMgKiBfYTMwO1xuICAgICAgICBtWzldID0gYjAgKiBfYTAxICsgYjEgKiBfYTExICsgYjIgKiBfYTIxICsgYjMgKiBfYTMxO1xuICAgICAgICBtWzEwXSA9IGIwICogX2EwMiArIGIxICogX2ExMiArIGIyICogX2EyMiArIGIzICogX2EzMjtcbiAgICAgICAgbVsxMV0gPSBiMCAqIF9hMDMgKyBiMSAqIF9hMTMgKyBiMiAqIF9hMjMgKyBiMyAqIF9hMzM7XG5cbiAgICAgICAgYjAgPSBibVsxMl07IGIxID0gYm1bMTNdOyBiMiA9IGJtWzE0XTsgYjMgPSBibVsxNV07XG4gICAgICAgIG1bMTJdID0gYjAgKiBfYTAwICsgYjEgKiBfYTEwICsgYjIgKiBfYTIwICsgYjMgKiBfYTMwO1xuICAgICAgICBtWzEzXSA9IGIwICogX2EwMSArIGIxICogX2ExMSArIGIyICogX2EyMSArIGIzICogX2EzMTtcbiAgICAgICAgbVsxNF0gPSBiMCAqIF9hMDIgKyBiMSAqIF9hMTIgKyBiMiAqIF9hMjIgKyBiMyAqIF9hMzI7XG4gICAgICAgIG1bMTVdID0gYjAgKiBfYTAzICsgYjEgKiBfYTEzICsgYjIgKiBfYTIzICsgYjMgKiBfYTMzO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5Zyo57uZ5a6a55+p6Zi15Y+Y5o2i5Z+656GA5LiK5Yqg5YWl5Y+Y5o2iXG4gICAgICogISNlbiBXYXMgYWRkZWQgaW4gYSBnaXZlbiB0cmFuc2Zvcm1hdGlvbiBtYXRyaXggdHJhbnNmb3JtYXRpb24gb24gdGhlIGJhc2lzIG9mXG4gICAgICogQG1ldGhvZCB0cmFuc2Zvcm1cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyB0cmFuc2Zvcm08T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgdjogVmVjTGlrZSlcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHRyYW5zZm9ybTxPdXQgZXh0ZW5kcyBJTWF0NExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogT3V0LCB2OiBWZWNMaWtlKSB7XG4gICAgICAgIGNvbnN0IHggPSB2LngsIHkgPSB2LnksIHogPSB2Lno7XG4gICAgICAgIGxldCBtID0gb3V0Lm0sIGFtID0gYS5tO1xuICAgICAgICBpZiAoYSA9PT0gb3V0KSB7XG4gICAgICAgICAgICBtWzEyXSA9IGFtWzBdICogeCArIGFtWzRdICogeSArIGFtWzhdICogeiArIGFtWzEyXTtcbiAgICAgICAgICAgIG1bMTNdID0gYW1bMV0gKiB4ICsgYW1bNV0gKiB5ICsgYW1bOV0gKiB6ICsgYW1bMTNdO1xuICAgICAgICAgICAgbVsxNF0gPSBhbVsyXSAqIHggKyBhbVs2XSAqIHkgKyBhbVsxMF0gKiB6ICsgYW1bMTRdO1xuICAgICAgICAgICAgbVsxNV0gPSBhbVszXSAqIHggKyBhbVs3XSAqIHkgKyBhbVsxMV0gKiB6ICsgYW1bMTVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX2EwMCA9IGFtWzBdOyBfYTAxID0gYW1bMV07IF9hMDIgPSBhbVsyXTsgX2EwMyA9IGFtWzNdO1xuICAgICAgICAgICAgX2ExMCA9IGFtWzRdOyBfYTExID0gYW1bNV07IF9hMTIgPSBhbVs2XTsgX2ExMyA9IGFtWzddO1xuICAgICAgICAgICAgX2EyMCA9IGFtWzhdOyBfYTIxID0gYW1bOV07IF9hMjIgPSBhbVsxMF07IF9hMjMgPSBhbVsxMV07XG4gICAgICAgICAgICBfYTMwID0gYW1bMTJdOyBfYTMxID0gYW1bMTNdOyBfYTMyID0gYW1bMTRdOyBfYTMzID0gYW1bMTVdO1xuXG4gICAgICAgICAgICBtWzBdID0gX2EwMDsgbVsxXSA9IF9hMDE7IG1bMl0gPSBfYTAyOyBtWzNdID0gX2EwMztcbiAgICAgICAgICAgIG1bNF0gPSBfYTEwOyBtWzVdID0gX2ExMTsgbVs2XSA9IF9hMTI7IG1bN10gPSBfYTEzO1xuICAgICAgICAgICAgbVs4XSA9IF9hMjA7IG1bOV0gPSBfYTIxOyBtWzEwXSA9IF9hMjI7IG1bMTFdID0gX2EyMztcblxuICAgICAgICAgICAgbVsxMl0gPSBfYTAwICogeCArIF9hMTAgKiB5ICsgX2EyMCAqIHogKyBhbVsxMl07XG4gICAgICAgICAgICBtWzEzXSA9IF9hMDEgKiB4ICsgX2ExMSAqIHkgKyBfYTIxICogeiArIGFtWzEzXTtcbiAgICAgICAgICAgIG1bMTRdID0gX2EwMiAqIHggKyBfYTEyICogeSArIF9hMjIgKiB6ICsgYW1bMTRdO1xuICAgICAgICAgICAgbVsxNV0gPSBfYTAzICogeCArIF9hMTMgKiB5ICsgX2EyMyAqIHogKyBhbVsxNV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWcqOe7meWumuefqemYteWPmOaNouWfuuehgOS4iuWKoOWFpeaWsOS9jeenu+WPmOaNolxuICAgICAqICEjZW4gQWRkIG5ldyBkaXNwbGFjZW1lbnQgdHJhbnNkdWNlciBpbiBhIG1hdHJpeCB0cmFuc2Zvcm1hdGlvbiBvbiB0aGUgYmFzaXMgb2YgYSBnaXZlblxuICAgICAqIEBtZXRob2QgdHJhbnNsYXRlXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgdHJhbnNsYXRlPE91dCBleHRlbmRzIElNYXQ0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIHY6IFZlY0xpa2UpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyB0cmFuc2xhdGU8T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgdjogVmVjTGlrZSkge1xuICAgICAgICBsZXQgbSA9IG91dC5tLCBhbSA9IGEubTtcbiAgICAgICAgaWYgKGEgPT09IG91dCkge1xuICAgICAgICAgICAgbVsxMl0gKz0gdi54O1xuICAgICAgICAgICAgbVsxM10gKz0gdi55O1xuICAgICAgICAgICAgbVsxNF0gKz0gdi55O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbVswXSA9IGFtWzBdOyBtWzFdID0gYW1bMV07IG1bMl0gPSBhbVsyXTsgbVszXSA9IGFtWzNdO1xuICAgICAgICAgICAgbVs0XSA9IGFtWzRdOyBtWzVdID0gYW1bNV07IG1bNl0gPSBhbVs2XTsgbVs3XSA9IGFtWzddO1xuICAgICAgICAgICAgbVs4XSA9IGFtWzhdOyBtWzldID0gYW1bOV07IG1bMTBdID0gYW1bMTBdOyBtWzExXSA9IGFtWzExXTtcbiAgICAgICAgICAgIG1bMTJdICs9IHYueDtcbiAgICAgICAgICAgIG1bMTNdICs9IHYueTtcbiAgICAgICAgICAgIG1bMTRdICs9IHYuejtcbiAgICAgICAgICAgIG1bMTVdID0gYW1bMTVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlnKjnu5nlrprnn6npmLXlj5jmjaLln7rnoYDkuIrliqDlhaXmlrDnvKnmlL7lj5jmjaJcbiAgICAgKiAhI2VuIEFkZCBuZXcgc2NhbGluZyB0cmFuc2Zvcm1hdGlvbiBpbiBhIGdpdmVuIG1hdHJpeCB0cmFuc2Zvcm1hdGlvbiBvbiB0aGUgYmFzaXMgb2ZcbiAgICAgKiBAbWV0aG9kIHNjYWxlXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgc2NhbGU8T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgdjogVmVjTGlrZSlcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHNjYWxlPE91dCBleHRlbmRzIElNYXQ0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIHY6IFZlY0xpa2UpIHtcbiAgICAgICAgY29uc3QgeCA9IHYueCwgeSA9IHYueSwgeiA9IHYuejtcbiAgICAgICAgbGV0IG0gPSBvdXQubSwgYW0gPSBhLm07XG4gICAgICAgIG1bMF0gPSBhbVswXSAqIHg7XG4gICAgICAgIG1bMV0gPSBhbVsxXSAqIHg7XG4gICAgICAgIG1bMl0gPSBhbVsyXSAqIHg7XG4gICAgICAgIG1bM10gPSBhbVszXSAqIHg7XG4gICAgICAgIG1bNF0gPSBhbVs0XSAqIHk7XG4gICAgICAgIG1bNV0gPSBhbVs1XSAqIHk7XG4gICAgICAgIG1bNl0gPSBhbVs2XSAqIHk7XG4gICAgICAgIG1bN10gPSBhbVs3XSAqIHk7XG4gICAgICAgIG1bOF0gPSBhbVs4XSAqIHo7XG4gICAgICAgIG1bOV0gPSBhbVs5XSAqIHo7XG4gICAgICAgIG1bMTBdID0gYW1bMTBdICogejtcbiAgICAgICAgbVsxMV0gPSBhbVsxMV0gKiB6O1xuICAgICAgICBtWzEyXSA9IGFtWzEyXTtcbiAgICAgICAgbVsxM10gPSBhbVsxM107XG4gICAgICAgIG1bMTRdID0gYW1bMTRdO1xuICAgICAgICBtWzE1XSA9IGFtWzE1XTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWcqOe7meWumuefqemYteWPmOaNouWfuuehgOS4iuWKoOWFpeaWsOaXi+i9rOWPmOaNolxuICAgICAqICEjZW4gQWRkIGEgbmV3IHJvdGF0aW9uYWwgdHJhbnNmb3JtIG1hdHJpeCB0cmFuc2Zvcm1hdGlvbiBvbiB0aGUgYmFzaXMgb2YgYSBnaXZlblxuICAgICAqIEBtZXRob2Qgcm90YXRlXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgcm90YXRlPE91dCBleHRlbmRzIElNYXQ0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIHJhZDogbnVtYmVyLCBheGlzOiBWZWNMaWtlKVxuICAgICAqIEBwYXJhbSByYWQg5peL6L2s6KeS5bqmXG4gICAgICogQHBhcmFtIGF4aXMg5peL6L2s6L20XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyByb3RhdGU8T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgcmFkOiBudW1iZXIsIGF4aXM6IFZlY0xpa2UpIHtcbiAgICAgICAgbGV0IHggPSBheGlzLngsIHkgPSBheGlzLnksIHogPSBheGlzLno7XG5cbiAgICAgICAgbGV0IGxlbiA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopO1xuXG4gICAgICAgIGlmIChNYXRoLmFicyhsZW4pIDwgRVBTSUxPTikge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBsZW4gPSAxIC8gbGVuO1xuICAgICAgICB4ICo9IGxlbjtcbiAgICAgICAgeSAqPSBsZW47XG4gICAgICAgIHogKj0gbGVuO1xuXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihyYWQpO1xuICAgICAgICBjb25zdCBjID0gTWF0aC5jb3MocmFkKTtcbiAgICAgICAgY29uc3QgdCA9IDEgLSBjO1xuXG4gICAgICAgIGxldCBhbSA9IGEubTtcbiAgICAgICAgX2EwMCA9IGFtWzBdOyBfYTAxID0gYW1bMV07IF9hMDIgPSBhbVsyXTsgX2EwMyA9IGFtWzNdO1xuICAgICAgICBfYTEwID0gYW1bNF07IF9hMTEgPSBhbVs1XTsgX2ExMiA9IGFtWzZdOyBfYTEzID0gYW1bN107XG4gICAgICAgIF9hMjAgPSBhbVs4XTsgX2EyMSA9IGFtWzldOyBfYTIyID0gYW1bMTBdOyBfYTIzID0gYW1bMTFdO1xuXG4gICAgICAgIC8vIENvbnN0cnVjdCB0aGUgZWxlbWVudHMgb2YgdGhlIHJvdGF0aW9uIG1hdHJpeFxuICAgICAgICBjb25zdCBiMDAgPSB4ICogeCAqIHQgKyBjLCBiMDEgPSB5ICogeCAqIHQgKyB6ICogcywgYjAyID0geiAqIHggKiB0IC0geSAqIHM7XG4gICAgICAgIGNvbnN0IGIxMCA9IHggKiB5ICogdCAtIHogKiBzLCBiMTEgPSB5ICogeSAqIHQgKyBjLCBiMTIgPSB6ICogeSAqIHQgKyB4ICogcztcbiAgICAgICAgY29uc3QgYjIwID0geCAqIHogKiB0ICsgeSAqIHMsIGIyMSA9IHkgKiB6ICogdCAtIHggKiBzLCBiMjIgPSB6ICogeiAqIHQgKyBjO1xuXG4gICAgICAgIGxldCBtID0gb3V0Lm07XG4gICAgICAgIC8vIFBlcmZvcm0gcm90YXRpb24tc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXG4gICAgICAgIG1bMF0gPSBfYTAwICogYjAwICsgX2ExMCAqIGIwMSArIF9hMjAgKiBiMDI7XG4gICAgICAgIG1bMV0gPSBfYTAxICogYjAwICsgX2ExMSAqIGIwMSArIF9hMjEgKiBiMDI7XG4gICAgICAgIG1bMl0gPSBfYTAyICogYjAwICsgX2ExMiAqIGIwMSArIF9hMjIgKiBiMDI7XG4gICAgICAgIG1bM10gPSBfYTAzICogYjAwICsgX2ExMyAqIGIwMSArIF9hMjMgKiBiMDI7XG4gICAgICAgIG1bNF0gPSBfYTAwICogYjEwICsgX2ExMCAqIGIxMSArIF9hMjAgKiBiMTI7XG4gICAgICAgIG1bNV0gPSBfYTAxICogYjEwICsgX2ExMSAqIGIxMSArIF9hMjEgKiBiMTI7XG4gICAgICAgIG1bNl0gPSBfYTAyICogYjEwICsgX2ExMiAqIGIxMSArIF9hMjIgKiBiMTI7XG4gICAgICAgIG1bN10gPSBfYTAzICogYjEwICsgX2ExMyAqIGIxMSArIF9hMjMgKiBiMTI7XG4gICAgICAgIG1bOF0gPSBfYTAwICogYjIwICsgX2ExMCAqIGIyMSArIF9hMjAgKiBiMjI7XG4gICAgICAgIG1bOV0gPSBfYTAxICogYjIwICsgX2ExMSAqIGIyMSArIF9hMjEgKiBiMjI7XG4gICAgICAgIG1bMTBdID0gX2EwMiAqIGIyMCArIF9hMTIgKiBiMjEgKyBfYTIyICogYjIyO1xuICAgICAgICBtWzExXSA9IF9hMDMgKiBiMjAgKyBfYTEzICogYjIxICsgX2EyMyAqIGIyMjtcblxuICAgICAgICAvLyBJZiB0aGUgc291cmNlIGFuZCBkZXN0aW5hdGlvbiBkaWZmZXIsIGNvcHkgdGhlIHVuY2hhbmdlZCBsYXN0IHJvd1xuICAgICAgICBpZiAoYSAhPT0gb3V0KSB7XG4gICAgICAgICAgICBtWzEyXSA9IGFtWzEyXTtcbiAgICAgICAgICAgIG1bMTNdID0gYW1bMTNdO1xuICAgICAgICAgICAgbVsxNF0gPSBhbVsxNF07XG4gICAgICAgICAgICBtWzE1XSA9IGFtWzE1XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlnKjnu5nlrprnn6npmLXlj5jmjaLln7rnoYDkuIrliqDlhaXnu5UgWCDovbTnmoTml4vovazlj5jmjaJcbiAgICAgKiAhI2VuIEFkZCByb3RhdGlvbmFsIHRyYW5zZm9ybWF0aW9uIGFyb3VuZCB0aGUgWCBheGlzIGF0IGEgZ2l2ZW4gbWF0cml4IHRyYW5zZm9ybWF0aW9uIG9uIHRoZSBiYXNpcyBvZlxuICAgICAqIEBtZXRob2Qgcm90YXRlWFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIHJvdGF0ZVg8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgcmFkOiBudW1iZXIpXG4gICAgICogQHBhcmFtIHJhZCDml4vovazop5LluqZcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHJvdGF0ZVg8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgcmFkOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IG0gPSBvdXQubSwgYW0gPSBhLm07XG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihyYWQpLFxuICAgICAgICAgICAgYyA9IE1hdGguY29zKHJhZCksXG4gICAgICAgICAgICBhMTAgPSBhbVs0XSxcbiAgICAgICAgICAgIGExMSA9IGFtWzVdLFxuICAgICAgICAgICAgYTEyID0gYW1bNl0sXG4gICAgICAgICAgICBhMTMgPSBhbVs3XSxcbiAgICAgICAgICAgIGEyMCA9IGFtWzhdLFxuICAgICAgICAgICAgYTIxID0gYW1bOV0sXG4gICAgICAgICAgICBhMjIgPSBhbVsxMF0sXG4gICAgICAgICAgICBhMjMgPSBhbVsxMV07XG5cbiAgICAgICAgaWYgKGEgIT09IG91dCkgeyAvLyBJZiB0aGUgc291cmNlIGFuZCBkZXN0aW5hdGlvbiBkaWZmZXIsIGNvcHkgdGhlIHVuY2hhbmdlZCByb3dzXG4gICAgICAgICAgICBtWzBdID0gYW1bMF07XG4gICAgICAgICAgICBtWzFdID0gYW1bMV07XG4gICAgICAgICAgICBtWzJdID0gYW1bMl07XG4gICAgICAgICAgICBtWzNdID0gYW1bM107XG4gICAgICAgICAgICBtWzEyXSA9IGFtWzEyXTtcbiAgICAgICAgICAgIG1bMTNdID0gYW1bMTNdO1xuICAgICAgICAgICAgbVsxNF0gPSBhbVsxNF07XG4gICAgICAgICAgICBtWzE1XSA9IGFtWzE1XTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFBlcmZvcm0gYXhpcy1zcGVjaWZpYyBtYXRyaXggbXVsdGlwbGljYXRpb25cbiAgICAgICAgbVs0XSA9IGExMCAqIGMgKyBhMjAgKiBzO1xuICAgICAgICBtWzVdID0gYTExICogYyArIGEyMSAqIHM7XG4gICAgICAgIG1bNl0gPSBhMTIgKiBjICsgYTIyICogcztcbiAgICAgICAgbVs3XSA9IGExMyAqIGMgKyBhMjMgKiBzO1xuICAgICAgICBtWzhdID0gYTIwICogYyAtIGExMCAqIHM7XG4gICAgICAgIG1bOV0gPSBhMjEgKiBjIC0gYTExICogcztcbiAgICAgICAgbVsxMF0gPSBhMjIgKiBjIC0gYTEyICogcztcbiAgICAgICAgbVsxMV0gPSBhMjMgKiBjIC0gYTEzICogcztcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5Zyo57uZ5a6a55+p6Zi15Y+Y5o2i5Z+656GA5LiK5Yqg5YWl57uVIFkg6L2055qE5peL6L2s5Y+Y5o2iXG4gICAgICogISNlbiBBZGQgYWJvdXQgdGhlIFkgYXhpcyByb3RhdGlvbiB0cmFuc2Zvcm1hdGlvbiBpbiBhIGdpdmVuIG1hdHJpeCB0cmFuc2Zvcm1hdGlvbiBvbiB0aGUgYmFzaXMgb2ZcbiAgICAgKiBAbWV0aG9kIHJvdGF0ZVlcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyByb3RhdGVZPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIHJhZDogbnVtYmVyKVxuICAgICAqIEBwYXJhbSByYWQg5peL6L2s6KeS5bqmXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyByb3RhdGVZPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIHJhZDogbnVtYmVyKSB7XG4gICAgICAgIGxldCBtID0gb3V0Lm0sIGFtID0gYS5tO1xuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4ocmFkKSxcbiAgICAgICAgICAgIGMgPSBNYXRoLmNvcyhyYWQpLFxuICAgICAgICAgICAgYTAwID0gYW1bMF0sXG4gICAgICAgICAgICBhMDEgPSBhbVsxXSxcbiAgICAgICAgICAgIGEwMiA9IGFtWzJdLFxuICAgICAgICAgICAgYTAzID0gYW1bM10sXG4gICAgICAgICAgICBhMjAgPSBhbVs4XSxcbiAgICAgICAgICAgIGEyMSA9IGFtWzldLFxuICAgICAgICAgICAgYTIyID0gYW1bMTBdLFxuICAgICAgICAgICAgYTIzID0gYW1bMTFdO1xuXG4gICAgICAgIGlmIChhICE9PSBvdXQpIHsgLy8gSWYgdGhlIHNvdXJjZSBhbmQgZGVzdGluYXRpb24gZGlmZmVyLCBjb3B5IHRoZSB1bmNoYW5nZWQgcm93c1xuICAgICAgICAgICAgbVs0XSA9IGFtWzRdO1xuICAgICAgICAgICAgbVs1XSA9IGFtWzVdO1xuICAgICAgICAgICAgbVs2XSA9IGFtWzZdO1xuICAgICAgICAgICAgbVs3XSA9IGFtWzddO1xuICAgICAgICAgICAgbVsxMl0gPSBhbVsxMl07XG4gICAgICAgICAgICBtWzEzXSA9IGFtWzEzXTtcbiAgICAgICAgICAgIG1bMTRdID0gYW1bMTRdO1xuICAgICAgICAgICAgbVsxNV0gPSBhbVsxNV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQZXJmb3JtIGF4aXMtc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXG4gICAgICAgIG1bMF0gPSBhMDAgKiBjIC0gYTIwICogcztcbiAgICAgICAgbVsxXSA9IGEwMSAqIGMgLSBhMjEgKiBzO1xuICAgICAgICBtWzJdID0gYTAyICogYyAtIGEyMiAqIHM7XG4gICAgICAgIG1bM10gPSBhMDMgKiBjIC0gYTIzICogcztcbiAgICAgICAgbVs4XSA9IGEwMCAqIHMgKyBhMjAgKiBjO1xuICAgICAgICBtWzldID0gYTAxICogcyArIGEyMSAqIGM7XG4gICAgICAgIG1bMTBdID0gYTAyICogcyArIGEyMiAqIGM7XG4gICAgICAgIG1bMTFdID0gYTAzICogcyArIGEyMyAqIGM7XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWcqOe7meWumuefqemYteWPmOaNouWfuuehgOS4iuWKoOWFpee7lSBaIOi9tOeahOaXi+i9rOWPmOaNolxuICAgICAqICEjZW4gQWRkZWQgYWJvdXQgdGhlIFogYXhpcyBhdCBhIGdpdmVuIHJvdGF0aW9uYWwgdHJhbnNmb3JtYXRpb24gbWF0cml4IHRyYW5zZm9ybWF0aW9uIG9uIHRoZSBiYXNpcyBvZlxuICAgICAqIEBtZXRob2Qgcm90YXRlWlxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIHJvdGF0ZVo8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgcmFkOiBudW1iZXIpXG4gICAgICogQHBhcmFtIHJhZCDml4vovazop5LluqZcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHJvdGF0ZVo8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgcmFkOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgYW0gPSBhLm07XG4gICAgICAgIGxldCBtID0gb3V0Lm07XG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihyYWQpLFxuICAgICAgICAgICAgYyA9IE1hdGguY29zKHJhZCksXG4gICAgICAgICAgICBhMDAgPSBhLm1bMF0sXG4gICAgICAgICAgICBhMDEgPSBhLm1bMV0sXG4gICAgICAgICAgICBhMDIgPSBhLm1bMl0sXG4gICAgICAgICAgICBhMDMgPSBhLm1bM10sXG4gICAgICAgICAgICBhMTAgPSBhLm1bNF0sXG4gICAgICAgICAgICBhMTEgPSBhLm1bNV0sXG4gICAgICAgICAgICBhMTIgPSBhLm1bNl0sXG4gICAgICAgICAgICBhMTMgPSBhLm1bN107XG5cbiAgICAgICAgLy8gSWYgdGhlIHNvdXJjZSBhbmQgZGVzdGluYXRpb24gZGlmZmVyLCBjb3B5IHRoZSB1bmNoYW5nZWQgbGFzdCByb3dcbiAgICAgICAgaWYgKGEgIT09IG91dCkge1xuICAgICAgICAgICAgbVs4XSA9IGFtWzhdO1xuICAgICAgICAgICAgbVs5XSA9IGFtWzldO1xuICAgICAgICAgICAgbVsxMF0gPSBhbVsxMF07XG4gICAgICAgICAgICBtWzExXSA9IGFtWzExXTtcbiAgICAgICAgICAgIG1bMTJdID0gYW1bMTJdO1xuICAgICAgICAgICAgbVsxM10gPSBhbVsxM107XG4gICAgICAgICAgICBtWzE0XSA9IGFtWzE0XTtcbiAgICAgICAgICAgIG1bMTVdID0gYW1bMTVdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUGVyZm9ybSBheGlzLXNwZWNpZmljIG1hdHJpeCBtdWx0aXBsaWNhdGlvblxuICAgICAgICBtWzBdID0gYTAwICogYyArIGExMCAqIHM7XG4gICAgICAgIG1bMV0gPSBhMDEgKiBjICsgYTExICogcztcbiAgICAgICAgbVsyXSA9IGEwMiAqIGMgKyBhMTIgKiBzO1xuICAgICAgICBtWzNdID0gYTAzICogYyArIGExMyAqIHM7XG4gICAgICAgIG1bNF0gPSBhMTAgKiBjIC0gYTAwICogcztcbiAgICAgICAgbVs1XSA9IGExMSAqIGMgLSBhMDEgKiBzO1xuICAgICAgICBtWzZdID0gYTEyICogYyAtIGEwMiAqIHM7XG4gICAgICAgIG1bN10gPSBhMTMgKiBjIC0gYTAzICogcztcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6K6h566X5L2N56e755+p6Zi1XG4gICAgICogISNlbiBEaXNwbGFjZW1lbnQgbWF0cml4IGNhbGN1bGF0aW9uXG4gICAgICogQG1ldGhvZCBmcm9tVHJhbnNsYXRpb25cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBmcm9tVHJhbnNsYXRpb248T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHY6IFZlY0xpa2UpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tVHJhbnNsYXRpb248T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHY6IFZlY0xpa2UpIHtcbiAgICAgICAgbGV0IG0gPSBvdXQubTtcbiAgICAgICAgbVswXSA9IDE7XG4gICAgICAgIG1bMV0gPSAwO1xuICAgICAgICBtWzJdID0gMDtcbiAgICAgICAgbVszXSA9IDA7XG4gICAgICAgIG1bNF0gPSAwO1xuICAgICAgICBtWzVdID0gMTtcbiAgICAgICAgbVs2XSA9IDA7XG4gICAgICAgIG1bN10gPSAwO1xuICAgICAgICBtWzhdID0gMDtcbiAgICAgICAgbVs5XSA9IDA7XG4gICAgICAgIG1bMTBdID0gMTtcbiAgICAgICAgbVsxMV0gPSAwO1xuICAgICAgICBtWzEyXSA9IHYueDtcbiAgICAgICAgbVsxM10gPSB2Lnk7XG4gICAgICAgIG1bMTRdID0gdi56O1xuICAgICAgICBtWzE1XSA9IDE7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDorqHnrpfnvKnmlL7nn6npmLVcbiAgICAgKiAhI2VuIFNjYWxpbmcgbWF0cml4IGNhbGN1bGF0aW9uXG4gICAgICogQG1ldGhvZCBmcm9tU2NhbGluZ1xuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIGZyb21TY2FsaW5nPE91dCBleHRlbmRzIElNYXQ0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCB2OiBWZWNMaWtlKVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbVNjYWxpbmc8T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHY6IFZlY0xpa2UpIHtcbiAgICAgICAgbGV0IG0gPSBvdXQubTtcbiAgICAgICAgbVswXSA9IHYueDtcbiAgICAgICAgbVsxXSA9IDA7XG4gICAgICAgIG1bMl0gPSAwO1xuICAgICAgICBtWzNdID0gMDtcbiAgICAgICAgbVs0XSA9IDA7XG4gICAgICAgIG1bNV0gPSB2Lnk7XG4gICAgICAgIG1bNl0gPSAwO1xuICAgICAgICBtWzddID0gMDtcbiAgICAgICAgbVs4XSA9IDA7XG4gICAgICAgIG1bOV0gPSAwO1xuICAgICAgICBtWzEwXSA9IHYuejtcbiAgICAgICAgbVsxMV0gPSAwO1xuICAgICAgICBtWzEyXSA9IDA7XG4gICAgICAgIG1bMTNdID0gMDtcbiAgICAgICAgbVsxNF0gPSAwO1xuICAgICAgICBtWzE1XSA9IDE7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDorqHnrpfml4vovaznn6npmLVcbiAgICAgKiAhI2VuIENhbGN1bGF0ZXMgdGhlIHJvdGF0aW9uIG1hdHJpeFxuICAgICAqIEBtZXRob2QgZnJvbVJvdGF0aW9uXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgZnJvbVJvdGF0aW9uPE91dCBleHRlbmRzIElNYXQ0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCByYWQ6IG51bWJlciwgYXhpczogVmVjTGlrZSlcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGZyb21Sb3RhdGlvbjxPdXQgZXh0ZW5kcyBJTWF0NExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgcmFkOiBudW1iZXIsIGF4aXM6IFZlY0xpa2UpIHtcbiAgICAgICAgbGV0IHggPSBheGlzLngsIHkgPSBheGlzLnksIHogPSBheGlzLno7XG4gICAgICAgIGxldCBsZW4gPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KTtcblxuICAgICAgICBpZiAoTWF0aC5hYnMobGVuKSA8IEVQU0lMT04pIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgbGVuID0gMSAvIGxlbjtcbiAgICAgICAgeCAqPSBsZW47XG4gICAgICAgIHkgKj0gbGVuO1xuICAgICAgICB6ICo9IGxlbjtcblxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4ocmFkKTtcbiAgICAgICAgY29uc3QgYyA9IE1hdGguY29zKHJhZCk7XG4gICAgICAgIGNvbnN0IHQgPSAxIC0gYztcblxuICAgICAgICAvLyBQZXJmb3JtIHJvdGF0aW9uLXNwZWNpZmljIG1hdHJpeCBtdWx0aXBsaWNhdGlvblxuICAgICAgICBsZXQgbSA9IG91dC5tO1xuICAgICAgICBtWzBdID0geCAqIHggKiB0ICsgYztcbiAgICAgICAgbVsxXSA9IHkgKiB4ICogdCArIHogKiBzO1xuICAgICAgICBtWzJdID0geiAqIHggKiB0IC0geSAqIHM7XG4gICAgICAgIG1bM10gPSAwO1xuICAgICAgICBtWzRdID0geCAqIHkgKiB0IC0geiAqIHM7XG4gICAgICAgIG1bNV0gPSB5ICogeSAqIHQgKyBjO1xuICAgICAgICBtWzZdID0geiAqIHkgKiB0ICsgeCAqIHM7XG4gICAgICAgIG1bN10gPSAwO1xuICAgICAgICBtWzhdID0geCAqIHogKiB0ICsgeSAqIHM7XG4gICAgICAgIG1bOV0gPSB5ICogeiAqIHQgLSB4ICogcztcbiAgICAgICAgbVsxMF0gPSB6ICogeiAqIHQgKyBjO1xuICAgICAgICBtWzExXSA9IDA7XG4gICAgICAgIG1bMTJdID0gMDtcbiAgICAgICAgbVsxM10gPSAwO1xuICAgICAgICBtWzE0XSA9IDA7XG4gICAgICAgIG1bMTVdID0gMTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOiuoeeul+e7lSBYIOi9tOeahOaXi+i9rOefqemYtVxuICAgICAqICEjZW4gQ2FsY3VsYXRpbmcgcm90YXRpb24gbWF0cml4IGFib3V0IHRoZSBYIGF4aXNcbiAgICAgKiBAbWV0aG9kIGZyb21YUm90YXRpb25cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBmcm9tWFJvdGF0aW9uPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCByYWQ6IG51bWJlcilcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGZyb21YUm90YXRpb248T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIHJhZDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihyYWQpLCBjID0gTWF0aC5jb3MocmFkKTtcblxuICAgICAgICAvLyBQZXJmb3JtIGF4aXMtc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXG4gICAgICAgIGxldCBtID0gb3V0Lm07XG4gICAgICAgIG1bMF0gPSAxO1xuICAgICAgICBtWzFdID0gMDtcbiAgICAgICAgbVsyXSA9IDA7XG4gICAgICAgIG1bM10gPSAwO1xuICAgICAgICBtWzRdID0gMDtcbiAgICAgICAgbVs1XSA9IGM7XG4gICAgICAgIG1bNl0gPSBzO1xuICAgICAgICBtWzddID0gMDtcbiAgICAgICAgbVs4XSA9IDA7XG4gICAgICAgIG1bOV0gPSAtcztcbiAgICAgICAgbVsxMF0gPSBjO1xuICAgICAgICBtWzExXSA9IDA7XG4gICAgICAgIG1bMTJdID0gMDtcbiAgICAgICAgbVsxM10gPSAwO1xuICAgICAgICBtWzE0XSA9IDA7XG4gICAgICAgIG1bMTVdID0gMTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOiuoeeul+e7lSBZIOi9tOeahOaXi+i9rOefqemYtVxuICAgICAqICEjZW4gQ2FsY3VsYXRpbmcgcm90YXRpb24gbWF0cml4IGFib3V0IHRoZSBZIGF4aXNcbiAgICAgKiBAbWV0aG9kIGZyb21ZUm90YXRpb25cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBmcm9tWVJvdGF0aW9uPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCByYWQ6IG51bWJlcilcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGZyb21ZUm90YXRpb248T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIHJhZDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihyYWQpLCBjID0gTWF0aC5jb3MocmFkKTtcblxuICAgICAgICAvLyBQZXJmb3JtIGF4aXMtc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXG4gICAgICAgIGxldCBtID0gb3V0Lm07XG4gICAgICAgIG1bMF0gPSBjO1xuICAgICAgICBtWzFdID0gMDtcbiAgICAgICAgbVsyXSA9IC1zO1xuICAgICAgICBtWzNdID0gMDtcbiAgICAgICAgbVs0XSA9IDA7XG4gICAgICAgIG1bNV0gPSAxO1xuICAgICAgICBtWzZdID0gMDtcbiAgICAgICAgbVs3XSA9IDA7XG4gICAgICAgIG1bOF0gPSBzO1xuICAgICAgICBtWzldID0gMDtcbiAgICAgICAgbVsxMF0gPSBjO1xuICAgICAgICBtWzExXSA9IDA7XG4gICAgICAgIG1bMTJdID0gMDtcbiAgICAgICAgbVsxM10gPSAwO1xuICAgICAgICBtWzE0XSA9IDA7XG4gICAgICAgIG1bMTVdID0gMTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOiuoeeul+e7lSBaIOi9tOeahOaXi+i9rOefqemYtVxuICAgICAqICEjZW4gQ2FsY3VsYXRpbmcgcm90YXRpb24gbWF0cml4IGFib3V0IHRoZSBaIGF4aXNcbiAgICAgKiBAbWV0aG9kIGZyb21aUm90YXRpb25cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBmcm9tWlJvdGF0aW9uPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCByYWQ6IG51bWJlcilcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGZyb21aUm90YXRpb248T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIHJhZDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihyYWQpLCBjID0gTWF0aC5jb3MocmFkKTtcblxuICAgICAgICAvLyBQZXJmb3JtIGF4aXMtc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXG4gICAgICAgIGxldCBtID0gb3V0Lm07XG4gICAgICAgIG1bMF0gPSBjO1xuICAgICAgICBtWzFdID0gcztcbiAgICAgICAgbVsyXSA9IDA7XG4gICAgICAgIG1bM10gPSAwO1xuICAgICAgICBtWzRdID0gLXM7XG4gICAgICAgIG1bNV0gPSBjO1xuICAgICAgICBtWzZdID0gMDtcbiAgICAgICAgbVs3XSA9IDA7XG4gICAgICAgIG1bOF0gPSAwO1xuICAgICAgICBtWzldID0gMDtcbiAgICAgICAgbVsxMF0gPSAxO1xuICAgICAgICBtWzExXSA9IDA7XG4gICAgICAgIG1bMTJdID0gMDtcbiAgICAgICAgbVsxM10gPSAwO1xuICAgICAgICBtWzE0XSA9IDA7XG4gICAgICAgIG1bMTVdID0gMTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOagueaNruaXi+i9rOWSjOS9jeenu+S/oeaBr+iuoeeul+efqemYtVxuICAgICAqICEjZW4gVGhlIHJvdGF0aW9uIGFuZCBkaXNwbGFjZW1lbnQgaW5mb3JtYXRpb24gY2FsY3VsYXRpbmcgbWF0cml4XG4gICAgICogQG1ldGhvZCBmcm9tUlRcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBmcm9tUlQ8T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHE6IFF1YXQsIHY6IFZlY0xpa2UpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tUlQ8T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHE6IFF1YXQsIHY6IFZlY0xpa2UpIHtcbiAgICAgICAgY29uc3QgeCA9IHEueCwgeSA9IHEueSwgeiA9IHEueiwgdyA9IHEudztcbiAgICAgICAgY29uc3QgeDIgPSB4ICsgeDtcbiAgICAgICAgY29uc3QgeTIgPSB5ICsgeTtcbiAgICAgICAgY29uc3QgejIgPSB6ICsgejtcblxuICAgICAgICBjb25zdCB4eCA9IHggKiB4MjtcbiAgICAgICAgY29uc3QgeHkgPSB4ICogeTI7XG4gICAgICAgIGNvbnN0IHh6ID0geCAqIHoyO1xuICAgICAgICBjb25zdCB5eSA9IHkgKiB5MjtcbiAgICAgICAgY29uc3QgeXogPSB5ICogejI7XG4gICAgICAgIGNvbnN0IHp6ID0geiAqIHoyO1xuICAgICAgICBjb25zdCB3eCA9IHcgKiB4MjtcbiAgICAgICAgY29uc3Qgd3kgPSB3ICogeTI7XG4gICAgICAgIGNvbnN0IHd6ID0gdyAqIHoyO1xuXG4gICAgICAgIGxldCBtID0gb3V0Lm07XG4gICAgICAgIG1bMF0gPSAxIC0gKHl5ICsgenopO1xuICAgICAgICBtWzFdID0geHkgKyB3ejtcbiAgICAgICAgbVsyXSA9IHh6IC0gd3k7XG4gICAgICAgIG1bM10gPSAwO1xuICAgICAgICBtWzRdID0geHkgLSB3ejtcbiAgICAgICAgbVs1XSA9IDEgLSAoeHggKyB6eik7XG4gICAgICAgIG1bNl0gPSB5eiArIHd4O1xuICAgICAgICBtWzddID0gMDtcbiAgICAgICAgbVs4XSA9IHh6ICsgd3k7XG4gICAgICAgIG1bOV0gPSB5eiAtIHd4O1xuICAgICAgICBtWzEwXSA9IDEgLSAoeHggKyB5eSk7XG4gICAgICAgIG1bMTFdID0gMDtcbiAgICAgICAgbVsxMl0gPSB2Lng7XG4gICAgICAgIG1bMTNdID0gdi55O1xuICAgICAgICBtWzE0XSA9IHYuejtcbiAgICAgICAgbVsxNV0gPSAxO1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmj5Dlj5bnn6npmLXnmoTkvY3np7vkv6Hmga8sIOm7mOiupOefqemYteS4reeahOWPmOaNouS7pSBTLT5SLT5UIOeahOmhuuW6j+W6lOeUqFxuICAgICAqICEjZW4gRXh0cmFjdGluZyBkaXNwbGFjZW1lbnQgaW5mb3JtYXRpb24gb2YgdGhlIG1hdHJpeCwgdGhlIG1hdHJpeCB0cmFuc2Zvcm0gdG8gdGhlIGRlZmF1bHQgc2VxdWVudGlhbCBhcHBsaWNhdGlvbiBTLT4gUi0+IFQgaXNcbiAgICAgKiBAbWV0aG9kIGdldFRyYW5zbGF0aW9uXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgZ2V0VHJhbnNsYXRpb248T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBWZWNMaWtlLCBtYXQ6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGdldFRyYW5zbGF0aW9uPE91dCBleHRlbmRzIElNYXQ0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogVmVjTGlrZSwgbWF0OiBPdXQpIHtcbiAgICAgICAgbGV0IG0gPSBtYXQubTtcbiAgICAgICAgb3V0LnggPSBtWzEyXTtcbiAgICAgICAgb3V0LnkgPSBtWzEzXTtcbiAgICAgICAgb3V0LnogPSBtWzE0XTtcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5o+Q5Y+W55+p6Zi155qE57yp5pS+5L+h5oGvLCDpu5jorqTnn6npmLXkuK3nmoTlj5jmjaLku6UgUy0+Ui0+VCDnmoTpobrluo/lupTnlKhcbiAgICAgKiAhI2VuIFNjYWxpbmcgaW5mb3JtYXRpb24gZXh0cmFjdGlvbiBtYXRyaXgsIHRoZSBtYXRyaXggdHJhbnNmb3JtIHRvIHRoZSBkZWZhdWx0IHNlcXVlbnRpYWwgYXBwbGljYXRpb24gUy0+IFItPiBUIGlzXG4gICAgICogQG1ldGhvZCBnZXRTY2FsaW5nXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgZ2V0U2NhbGluZzxPdXQgZXh0ZW5kcyBJTWF0NExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IFZlY0xpa2UsIG1hdDogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0U2NhbGluZzxPdXQgZXh0ZW5kcyBJTWF0NExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IFZlY0xpa2UsIG1hdDogT3V0KSB7XG4gICAgICAgIGxldCBtID0gbWF0Lm07XG4gICAgICAgIGxldCBtMyA9IG0zXzEubTtcbiAgICAgICAgY29uc3QgbTAwID0gbTNbMF0gPSBtWzBdO1xuICAgICAgICBjb25zdCBtMDEgPSBtM1sxXSA9IG1bMV07XG4gICAgICAgIGNvbnN0IG0wMiA9IG0zWzJdID0gbVsyXTtcbiAgICAgICAgY29uc3QgbTA0ID0gbTNbM10gPSBtWzRdO1xuICAgICAgICBjb25zdCBtMDUgPSBtM1s0XSA9IG1bNV07XG4gICAgICAgIGNvbnN0IG0wNiA9IG0zWzVdID0gbVs2XTtcbiAgICAgICAgY29uc3QgbTA4ID0gbTNbNl0gPSBtWzhdO1xuICAgICAgICBjb25zdCBtMDkgPSBtM1s3XSA9IG1bOV07XG4gICAgICAgIGNvbnN0IG0xMCA9IG0zWzhdID0gbVsxMF07XG4gICAgICAgIG91dC54ID0gTWF0aC5zcXJ0KG0wMCAqIG0wMCArIG0wMSAqIG0wMSArIG0wMiAqIG0wMik7XG4gICAgICAgIG91dC55ID0gTWF0aC5zcXJ0KG0wNCAqIG0wNCArIG0wNSAqIG0wNSArIG0wNiAqIG0wNik7XG4gICAgICAgIG91dC56ID0gTWF0aC5zcXJ0KG0wOCAqIG0wOCArIG0wOSAqIG0wOSArIG0xMCAqIG0xMCk7XG4gICAgICAgIC8vIGFjY291bnQgZm9yIHJlZmVjdGlvbnNcbiAgICAgICAgaWYgKE1hdDMuZGV0ZXJtaW5hbnQobTNfMSkgPCAwKSB7IG91dC54ICo9IC0xOyB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmj5Dlj5bnn6npmLXnmoTml4vovazkv6Hmga8sIOm7mOiupOi+k+WFpeefqemYteS4jeWQq+aciee8qeaUvuS/oeaBr++8jOWmguiAg+iZkee8qeaUvuW6lOS9v+eUqCBgdG9SVFNgIOWHveaVsOOAglxuICAgICAqICEjZW4gUm90YXRpb24gaW5mb3JtYXRpb24gZXh0cmFjdGlvbiBtYXRyaXgsIHRoZSBtYXRyaXggY29udGFpbmluZyBubyBkZWZhdWx0IGlucHV0IHNjYWxpbmcgaW5mb3JtYXRpb24sIHN1Y2ggYXMgdGhlIHVzZSBvZiBgdG9SVFNgIHNob3VsZCBjb25zaWRlciB0aGUgc2NhbGluZyBmdW5jdGlvbi5cbiAgICAgKiBAbWV0aG9kIGdldFJvdGF0aW9uXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgZ2V0Um90YXRpb248T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBRdWF0LCBtYXQ6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGdldFJvdGF0aW9uPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogUXVhdCwgbWF0OiBPdXQpIHtcbiAgICAgICAgbGV0IG0gPSBtYXQubTtcbiAgICAgICAgY29uc3QgdHJhY2UgPSBtWzBdICsgbVs1XSArIG1bMTBdO1xuICAgICAgICBsZXQgUyA9IDA7XG5cbiAgICAgICAgaWYgKHRyYWNlID4gMCkge1xuICAgICAgICAgICAgUyA9IE1hdGguc3FydCh0cmFjZSArIDEuMCkgKiAyO1xuICAgICAgICAgICAgb3V0LncgPSAwLjI1ICogUztcbiAgICAgICAgICAgIG91dC54ID0gKG1bNl0gLSBtWzldKSAvIFM7XG4gICAgICAgICAgICBvdXQueSA9IChtWzhdIC0gbVsyXSkgLyBTO1xuICAgICAgICAgICAgb3V0LnogPSAobVsxXSAtIG1bNF0pIC8gUztcbiAgICAgICAgfSBlbHNlIGlmICgobVswXSA+IG1bNV0pICYmIChtWzBdID4gbVsxMF0pKSB7XG4gICAgICAgICAgICBTID0gTWF0aC5zcXJ0KDEuMCArIG1bMF0gLSBtWzVdIC0gbVsxMF0pICogMjtcbiAgICAgICAgICAgIG91dC53ID0gKG1bNl0gLSBtWzldKSAvIFM7XG4gICAgICAgICAgICBvdXQueCA9IDAuMjUgKiBTO1xuICAgICAgICAgICAgb3V0LnkgPSAobVsxXSArIG1bNF0pIC8gUztcbiAgICAgICAgICAgIG91dC56ID0gKG1bOF0gKyBtWzJdKSAvIFM7XG4gICAgICAgIH0gZWxzZSBpZiAobVs1XSA+IG1bMTBdKSB7XG4gICAgICAgICAgICBTID0gTWF0aC5zcXJ0KDEuMCArIG1bNV0gLSBtWzBdIC0gbVsxMF0pICogMjtcbiAgICAgICAgICAgIG91dC53ID0gKG1bOF0gLSBtWzJdKSAvIFM7XG4gICAgICAgICAgICBvdXQueCA9IChtWzFdICsgbVs0XSkgLyBTO1xuICAgICAgICAgICAgb3V0LnkgPSAwLjI1ICogUztcbiAgICAgICAgICAgIG91dC56ID0gKG1bNl0gKyBtWzldKSAvIFM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBTID0gTWF0aC5zcXJ0KDEuMCArIG1bMTBdIC0gbVswXSAtIG1bNV0pICogMjtcbiAgICAgICAgICAgIG91dC53ID0gKG1bMV0gLSBtWzRdKSAvIFM7XG4gICAgICAgICAgICBvdXQueCA9IChtWzhdICsgbVsyXSkgLyBTO1xuICAgICAgICAgICAgb3V0LnkgPSAobVs2XSArIG1bOV0pIC8gUztcbiAgICAgICAgICAgIG91dC56ID0gMC4yNSAqIFM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5o+Q5Y+W5peL6L2s44CB5L2N56e744CB57yp5pS+5L+h5oGv77yMIOm7mOiupOefqemYteS4reeahOWPmOaNouS7pSBTLT5SLT5UIOeahOmhuuW6j+W6lOeUqFxuICAgICAqICEjZW4gRXh0cmFjdGluZyByb3RhdGlvbmFsIGRpc3BsYWNlbWVudCwgem9vbSBpbmZvcm1hdGlvbiwgdGhlIGRlZmF1bHQgbWF0cml4IHRyYW5zZm9ybWF0aW9uIGluIG9yZGVyIFMtPiBSLT4gVCBhcHBsaWNhdGlvbnNcbiAgICAgKiBAbWV0aG9kIHRvUlRTXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgdG9SVFM8T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAobWF0OiBPdXQsIHE6IFF1YXQsIHY6IFZlY0xpa2UsIHM6IFZlY0xpa2UpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyB0b1JUUzxPdXQgZXh0ZW5kcyBJTWF0NExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChtYXQ6IE91dCwgcTogUXVhdCwgdjogVmVjTGlrZSwgczogVmVjTGlrZSkge1xuICAgICAgICBsZXQgbSA9IG1hdC5tO1xuICAgICAgICBsZXQgbTMgPSBtM18xLm07XG4gICAgICAgIHMueCA9IFZlYzMuc2V0KHYzXzEsIG1bMF0sIG1bMV0sIG1bMl0pLm1hZygpO1xuICAgICAgICBtM1swXSA9IG1bMF0gLyBzLng7XG4gICAgICAgIG0zWzFdID0gbVsxXSAvIHMueDtcbiAgICAgICAgbTNbMl0gPSBtWzJdIC8gcy54O1xuICAgICAgICBzLnkgPSBWZWMzLnNldCh2M18xLCBtWzRdLCBtWzVdLCBtWzZdKS5tYWcoKTtcbiAgICAgICAgbTNbM10gPSBtWzRdIC8gcy55O1xuICAgICAgICBtM1s0XSA9IG1bNV0gLyBzLnk7XG4gICAgICAgIG0zWzVdID0gbVs2XSAvIHMueTtcbiAgICAgICAgcy56ID0gVmVjMy5zZXQodjNfMSwgbVs4XSwgbVs5XSwgbVsxMF0pLm1hZygpO1xuICAgICAgICBtM1s2XSA9IG1bOF0gLyBzLno7XG4gICAgICAgIG0zWzddID0gbVs5XSAvIHMuejtcbiAgICAgICAgbTNbOF0gPSBtWzEwXSAvIHMuejtcbiAgICAgICAgY29uc3QgZGV0ID0gTWF0My5kZXRlcm1pbmFudChtM18xKTtcbiAgICAgICAgaWYgKGRldCA8IDApIHsgcy54ICo9IC0xOyBtM1swXSAqPSAtMTsgbTNbMV0gKj0gLTE7IG0zWzJdICo9IC0xOyB9XG4gICAgICAgIFF1YXQuZnJvbU1hdDMocSwgbTNfMSk7IC8vIGFscmVhZHkgbm9ybWFsaXplZFxuICAgICAgICBWZWMzLnNldCh2LCBtWzEyXSwgbVsxM10sIG1bMTRdKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOagueaNruaXi+i9rOOAgeS9jeenu+OAgee8qeaUvuS/oeaBr+iuoeeul+efqemYte+8jOS7pSBTLT5SLT5UIOeahOmhuuW6j+W6lOeUqFxuICAgICAqICEjZW4gVGhlIHJvdGFyeSBkaXNwbGFjZW1lbnQsIHRoZSBzY2FsaW5nIG1hdHJpeCBjYWxjdWxhdGlvbiBpbmZvcm1hdGlvbiwgdGhlIG9yZGVyIFMtPiBSLT4gVCBhcHBsaWNhdGlvbnNcbiAgICAgKiBAbWV0aG9kIGZyb21SVFNcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBmcm9tUlRTPE91dCBleHRlbmRzIElNYXQ0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBxOiBRdWF0LCB2OiBWZWNMaWtlLCBzOiBWZWNMaWtlKVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbVJUUzxPdXQgZXh0ZW5kcyBJTWF0NExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgcTogUXVhdCwgdjogVmVjTGlrZSwgczogVmVjTGlrZSkge1xuICAgICAgICBjb25zdCB4ID0gcS54LCB5ID0gcS55LCB6ID0gcS56LCB3ID0gcS53O1xuICAgICAgICBjb25zdCB4MiA9IHggKyB4O1xuICAgICAgICBjb25zdCB5MiA9IHkgKyB5O1xuICAgICAgICBjb25zdCB6MiA9IHogKyB6O1xuXG4gICAgICAgIGNvbnN0IHh4ID0geCAqIHgyO1xuICAgICAgICBjb25zdCB4eSA9IHggKiB5MjtcbiAgICAgICAgY29uc3QgeHogPSB4ICogejI7XG4gICAgICAgIGNvbnN0IHl5ID0geSAqIHkyO1xuICAgICAgICBjb25zdCB5eiA9IHkgKiB6MjtcbiAgICAgICAgY29uc3QgenogPSB6ICogejI7XG4gICAgICAgIGNvbnN0IHd4ID0gdyAqIHgyO1xuICAgICAgICBjb25zdCB3eSA9IHcgKiB5MjtcbiAgICAgICAgY29uc3Qgd3ogPSB3ICogejI7XG4gICAgICAgIGNvbnN0IHN4ID0gcy54O1xuICAgICAgICBjb25zdCBzeSA9IHMueTtcbiAgICAgICAgY29uc3Qgc3ogPSBzLno7XG5cbiAgICAgICAgbGV0IG0gPSBvdXQubTtcbiAgICAgICAgbVswXSA9ICgxIC0gKHl5ICsgenopKSAqIHN4O1xuICAgICAgICBtWzFdID0gKHh5ICsgd3opICogc3g7XG4gICAgICAgIG1bMl0gPSAoeHogLSB3eSkgKiBzeDtcbiAgICAgICAgbVszXSA9IDA7XG4gICAgICAgIG1bNF0gPSAoeHkgLSB3eikgKiBzeTtcbiAgICAgICAgbVs1XSA9ICgxIC0gKHh4ICsgenopKSAqIHN5O1xuICAgICAgICBtWzZdID0gKHl6ICsgd3gpICogc3k7XG4gICAgICAgIG1bN10gPSAwO1xuICAgICAgICBtWzhdID0gKHh6ICsgd3kpICogc3o7XG4gICAgICAgIG1bOV0gPSAoeXogLSB3eCkgKiBzejtcbiAgICAgICAgbVsxMF0gPSAoMSAtICh4eCArIHl5KSkgKiBzejtcbiAgICAgICAgbVsxMV0gPSAwO1xuICAgICAgICBtWzEyXSA9IHYueDtcbiAgICAgICAgbVsxM10gPSB2Lnk7XG4gICAgICAgIG1bMTRdID0gdi56O1xuICAgICAgICBtWzE1XSA9IDE7XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOagueaNruaMh+WumueahOaXi+i9rOOAgeS9jeenu+OAgee8qeaUvuWPiuWPmOaNouS4reW/g+S/oeaBr+iuoeeul+efqemYte+8jOS7pSBTLT5SLT5UIOeahOmhuuW6j+W6lOeUqFxuICAgICAqICEjZW4gQWNjb3JkaW5nIHRvIHRoZSBzcGVjaWZpZWQgcm90YXRpb24sIGRpc3BsYWNlbWVudCwgYW5kIHNjYWxlIGNvbnZlcnNpb24gbWF0cml4IGNhbGN1bGF0aW9uIGluZm9ybWF0aW9uIGNlbnRlciwgb3JkZXIgUy0+IFItPiBUIGFwcGxpY2F0aW9uc1xuICAgICAqIEBtZXRob2QgZnJvbVJUU09yaWdpblxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIGZyb21SVFNPcmlnaW48T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHE6IFF1YXQsIHY6IFZlY0xpa2UsIHM6IFZlY0xpa2UsIG86IFZlY0xpa2UpXG4gICAgICogQHBhcmFtIHEg5peL6L2s5YC8XG4gICAgICogQHBhcmFtIHYg5L2N56e75YC8XG4gICAgICogQHBhcmFtIHMg57yp5pS+5YC8XG4gICAgICogQHBhcmFtIG8g5oyH5a6a5Y+Y5o2i5Lit5b+DXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tUlRTT3JpZ2luPE91dCBleHRlbmRzIElNYXQ0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBxOiBRdWF0LCB2OiBWZWNMaWtlLCBzOiBWZWNMaWtlLCBvOiBWZWNMaWtlKSB7XG4gICAgICAgIGNvbnN0IHggPSBxLngsIHkgPSBxLnksIHogPSBxLnosIHcgPSBxLnc7XG4gICAgICAgIGNvbnN0IHgyID0geCArIHg7XG4gICAgICAgIGNvbnN0IHkyID0geSArIHk7XG4gICAgICAgIGNvbnN0IHoyID0geiArIHo7XG5cbiAgICAgICAgY29uc3QgeHggPSB4ICogeDI7XG4gICAgICAgIGNvbnN0IHh5ID0geCAqIHkyO1xuICAgICAgICBjb25zdCB4eiA9IHggKiB6MjtcbiAgICAgICAgY29uc3QgeXkgPSB5ICogeTI7XG4gICAgICAgIGNvbnN0IHl6ID0geSAqIHoyO1xuICAgICAgICBjb25zdCB6eiA9IHogKiB6MjtcbiAgICAgICAgY29uc3Qgd3ggPSB3ICogeDI7XG4gICAgICAgIGNvbnN0IHd5ID0gdyAqIHkyO1xuICAgICAgICBjb25zdCB3eiA9IHcgKiB6MjtcblxuICAgICAgICBjb25zdCBzeCA9IHMueDtcbiAgICAgICAgY29uc3Qgc3kgPSBzLnk7XG4gICAgICAgIGNvbnN0IHN6ID0gcy56O1xuXG4gICAgICAgIGNvbnN0IG94ID0gby54O1xuICAgICAgICBjb25zdCBveSA9IG8ueTtcbiAgICAgICAgY29uc3Qgb3ogPSBvLno7XG5cbiAgICAgICAgbGV0IG0gPSBvdXQubTtcbiAgICAgICAgbVswXSA9ICgxIC0gKHl5ICsgenopKSAqIHN4O1xuICAgICAgICBtWzFdID0gKHh5ICsgd3opICogc3g7XG4gICAgICAgIG1bMl0gPSAoeHogLSB3eSkgKiBzeDtcbiAgICAgICAgbVszXSA9IDA7XG4gICAgICAgIG1bNF0gPSAoeHkgLSB3eikgKiBzeTtcbiAgICAgICAgbVs1XSA9ICgxIC0gKHh4ICsgenopKSAqIHN5O1xuICAgICAgICBtWzZdID0gKHl6ICsgd3gpICogc3k7XG4gICAgICAgIG1bN10gPSAwO1xuICAgICAgICBtWzhdID0gKHh6ICsgd3kpICogc3o7XG4gICAgICAgIG1bOV0gPSAoeXogLSB3eCkgKiBzejtcbiAgICAgICAgbVsxMF0gPSAoMSAtICh4eCArIHl5KSkgKiBzejtcbiAgICAgICAgbVsxMV0gPSAwO1xuICAgICAgICBtWzEyXSA9IHYueCArIG94IC0gKG1bMF0gKiBveCArIG1bNF0gKiBveSArIG1bOF0gKiBveik7XG4gICAgICAgIG1bMTNdID0gdi55ICsgb3kgLSAobVsxXSAqIG94ICsgbVs1XSAqIG95ICsgbVs5XSAqIG96KTtcbiAgICAgICAgbVsxNF0gPSB2LnogKyBveiAtIChtWzJdICogb3ggKyBtWzZdICogb3kgKyBtWzEwXSAqIG96KTtcbiAgICAgICAgbVsxNV0gPSAxO1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmoLnmja7mjIflrprnmoTml4vovazkv6Hmga/orqHnrpfnn6npmLVcbiAgICAgKiAhI2VuIFRoZSByb3RhdGlvbiBtYXRyaXggY2FsY3VsYXRpb24gaW5mb3JtYXRpb24gc3BlY2lmaWVkXG4gICAgICogQG1ldGhvZCBmcm9tUXVhdFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIGZyb21RdWF0PE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBxOiBRdWF0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbVF1YXQ8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIHE6IFF1YXQpIHtcbiAgICAgICAgY29uc3QgeCA9IHEueCwgeSA9IHEueSwgeiA9IHEueiwgdyA9IHEudztcbiAgICAgICAgY29uc3QgeDIgPSB4ICsgeDtcbiAgICAgICAgY29uc3QgeTIgPSB5ICsgeTtcbiAgICAgICAgY29uc3QgejIgPSB6ICsgejtcblxuICAgICAgICBjb25zdCB4eCA9IHggKiB4MjtcbiAgICAgICAgY29uc3QgeXggPSB5ICogeDI7XG4gICAgICAgIGNvbnN0IHl5ID0geSAqIHkyO1xuICAgICAgICBjb25zdCB6eCA9IHogKiB4MjtcbiAgICAgICAgY29uc3QgenkgPSB6ICogeTI7XG4gICAgICAgIGNvbnN0IHp6ID0geiAqIHoyO1xuICAgICAgICBjb25zdCB3eCA9IHcgKiB4MjtcbiAgICAgICAgY29uc3Qgd3kgPSB3ICogeTI7XG4gICAgICAgIGNvbnN0IHd6ID0gdyAqIHoyO1xuXG4gICAgICAgIGxldCBtID0gb3V0Lm07XG4gICAgICAgIG1bMF0gPSAxIC0geXkgLSB6ejtcbiAgICAgICAgbVsxXSA9IHl4ICsgd3o7XG4gICAgICAgIG1bMl0gPSB6eCAtIHd5O1xuICAgICAgICBtWzNdID0gMDtcblxuICAgICAgICBtWzRdID0geXggLSB3ejtcbiAgICAgICAgbVs1XSA9IDEgLSB4eCAtIHp6O1xuICAgICAgICBtWzZdID0genkgKyB3eDtcbiAgICAgICAgbVs3XSA9IDA7XG5cbiAgICAgICAgbVs4XSA9IHp4ICsgd3k7XG4gICAgICAgIG1bOV0gPSB6eSAtIHd4O1xuICAgICAgICBtWzEwXSA9IDEgLSB4eCAtIHl5O1xuICAgICAgICBtWzExXSA9IDA7XG5cbiAgICAgICAgbVsxMl0gPSAwO1xuICAgICAgICBtWzEzXSA9IDA7XG4gICAgICAgIG1bMTRdID0gMDtcbiAgICAgICAgbVsxNV0gPSAxO1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmoLnmja7mjIflrprnmoTop4bplKXkvZPkv6Hmga/orqHnrpfnn6npmLVcbiAgICAgKiAhI2VuIFRoZSBtYXRyaXggY2FsY3VsYXRpb24gaW5mb3JtYXRpb24gc3BlY2lmaWVkIGZydXN0dW1cbiAgICAgKiBAbWV0aG9kIGZydXN0dW1cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBmcnVzdHVtPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBsZWZ0OiBudW1iZXIsIHJpZ2h0OiBudW1iZXIsIGJvdHRvbTogbnVtYmVyLCB0b3A6IG51bWJlciwgbmVhcjogbnVtYmVyLCBmYXI6IG51bWJlcilcbiAgICAgKiBAcGFyYW0gbGVmdCDlt6blubPpnaLot53nprtcbiAgICAgKiBAcGFyYW0gcmlnaHQg5Y+z5bmz6Z2i6Led56a7XG4gICAgICogQHBhcmFtIGJvdHRvbSDkuIvlubPpnaLot53nprtcbiAgICAgKiBAcGFyYW0gdG9wIOS4iuW5s+mdoui3neemu1xuICAgICAqIEBwYXJhbSBuZWFyIOi/keW5s+mdoui3neemu1xuICAgICAqIEBwYXJhbSBmYXIg6L+c5bmz6Z2i6Led56a7XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBmcnVzdHVtPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBsZWZ0OiBudW1iZXIsIHJpZ2h0OiBudW1iZXIsIGJvdHRvbTogbnVtYmVyLCB0b3A6IG51bWJlciwgbmVhcjogbnVtYmVyLCBmYXI6IG51bWJlcikge1xuICAgICAgICBjb25zdCBybCA9IDEgLyAocmlnaHQgLSBsZWZ0KTtcbiAgICAgICAgY29uc3QgdGIgPSAxIC8gKHRvcCAtIGJvdHRvbSk7XG4gICAgICAgIGNvbnN0IG5mID0gMSAvIChuZWFyIC0gZmFyKTtcblxuICAgICAgICBsZXQgbSA9IG91dC5tO1xuICAgICAgICBtWzBdID0gKG5lYXIgKiAyKSAqIHJsO1xuICAgICAgICBtWzFdID0gMDtcbiAgICAgICAgbVsyXSA9IDA7XG4gICAgICAgIG1bM10gPSAwO1xuICAgICAgICBtWzRdID0gMDtcbiAgICAgICAgbVs1XSA9IChuZWFyICogMikgKiB0YjtcbiAgICAgICAgbVs2XSA9IDA7XG4gICAgICAgIG1bN10gPSAwO1xuICAgICAgICBtWzhdID0gKHJpZ2h0ICsgbGVmdCkgKiBybDtcbiAgICAgICAgbVs5XSA9ICh0b3AgKyBib3R0b20pICogdGI7XG4gICAgICAgIG1bMTBdID0gKGZhciArIG5lYXIpICogbmY7XG4gICAgICAgIG1bMTFdID0gLTE7XG4gICAgICAgIG1bMTJdID0gMDtcbiAgICAgICAgbVsxM10gPSAwO1xuICAgICAgICBtWzE0XSA9IChmYXIgKiBuZWFyICogMikgKiBuZjtcbiAgICAgICAgbVsxNV0gPSAwO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6K6h566X6YCP6KeG5oqV5b2x55+p6Zi1XG4gICAgICogISNlbiBQZXJzcGVjdGl2ZSBwcm9qZWN0aW9uIG1hdHJpeCBjYWxjdWxhdGlvblxuICAgICAqIEBtZXRob2QgcGVyc3BlY3RpdmVcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBwZXJzcGVjdGl2ZTxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgZm92eTogbnVtYmVyLCBhc3BlY3Q6IG51bWJlciwgbmVhcjogbnVtYmVyLCBmYXI6IG51bWJlcilcbiAgICAgKiBAcGFyYW0gZm92eSDnurXlkJHop4bop5Lpq5jluqZcbiAgICAgKiBAcGFyYW0gYXNwZWN0IOmVv+WuveavlFxuICAgICAqIEBwYXJhbSBuZWFyIOi/keW5s+mdoui3neemu1xuICAgICAqIEBwYXJhbSBmYXIg6L+c5bmz6Z2i6Led56a7XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBwZXJzcGVjdGl2ZTxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgZm92eTogbnVtYmVyLCBhc3BlY3Q6IG51bWJlciwgbmVhcjogbnVtYmVyLCBmYXI6IG51bWJlcikge1xuICAgICAgICBjb25zdCBmID0gMS4wIC8gTWF0aC50YW4oZm92eSAvIDIpO1xuICAgICAgICBjb25zdCBuZiA9IDEgLyAobmVhciAtIGZhcik7XG5cbiAgICAgICAgbGV0IG0gPSBvdXQubTtcbiAgICAgICAgbVswXSA9IGYgLyBhc3BlY3Q7XG4gICAgICAgIG1bMV0gPSAwO1xuICAgICAgICBtWzJdID0gMDtcbiAgICAgICAgbVszXSA9IDA7XG4gICAgICAgIG1bNF0gPSAwO1xuICAgICAgICBtWzVdID0gZjtcbiAgICAgICAgbVs2XSA9IDA7XG4gICAgICAgIG1bN10gPSAwO1xuICAgICAgICBtWzhdID0gMDtcbiAgICAgICAgbVs5XSA9IDA7XG4gICAgICAgIG1bMTBdID0gKGZhciArIG5lYXIpICogbmY7XG4gICAgICAgIG1bMTFdID0gLTE7XG4gICAgICAgIG1bMTJdID0gMDtcbiAgICAgICAgbVsxM10gPSAwO1xuICAgICAgICBtWzE0XSA9ICgyICogZmFyICogbmVhcikgKiBuZjtcbiAgICAgICAgbVsxNV0gPSAwO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6K6h566X5q2j5Lqk5oqV5b2x55+p6Zi1XG4gICAgICogISNlbiBDb21wdXRpbmcgb3J0aG9nb25hbCBwcm9qZWN0aW9uIG1hdHJpeFxuICAgICAqIEBtZXRob2Qgb3J0aG9cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBvcnRobzxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgbGVmdDogbnVtYmVyLCByaWdodDogbnVtYmVyLCBib3R0b206IG51bWJlciwgdG9wOiBudW1iZXIsIG5lYXI6IG51bWJlciwgZmFyOiBudW1iZXIpXG4gICAgICogQHBhcmFtIGxlZnQg5bem5bmz6Z2i6Led56a7XG4gICAgICogQHBhcmFtIHJpZ2h0IOWPs+W5s+mdoui3neemu1xuICAgICAqIEBwYXJhbSBib3R0b20g5LiL5bmz6Z2i6Led56a7XG4gICAgICogQHBhcmFtIHRvcCDkuIrlubPpnaLot53nprtcbiAgICAgKiBAcGFyYW0gbmVhciDov5HlubPpnaLot53nprtcbiAgICAgKiBAcGFyYW0gZmFyIOi/nOW5s+mdoui3neemu1xuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgb3J0aG88T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGxlZnQ6IG51bWJlciwgcmlnaHQ6IG51bWJlciwgYm90dG9tOiBudW1iZXIsIHRvcDogbnVtYmVyLCBuZWFyOiBudW1iZXIsIGZhcjogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGxyID0gMSAvIChsZWZ0IC0gcmlnaHQpO1xuICAgICAgICBjb25zdCBidCA9IDEgLyAoYm90dG9tIC0gdG9wKTtcbiAgICAgICAgY29uc3QgbmYgPSAxIC8gKG5lYXIgLSBmYXIpO1xuICAgICAgICBsZXQgbSA9IG91dC5tO1xuICAgICAgICBtWzBdID0gLTIgKiBscjtcbiAgICAgICAgbVsxXSA9IDA7XG4gICAgICAgIG1bMl0gPSAwO1xuICAgICAgICBtWzNdID0gMDtcbiAgICAgICAgbVs0XSA9IDA7XG4gICAgICAgIG1bNV0gPSAtMiAqIGJ0O1xuICAgICAgICBtWzZdID0gMDtcbiAgICAgICAgbVs3XSA9IDA7XG4gICAgICAgIG1bOF0gPSAwO1xuICAgICAgICBtWzldID0gMDtcbiAgICAgICAgbVsxMF0gPSAyICogbmY7XG4gICAgICAgIG1bMTFdID0gMDtcbiAgICAgICAgbVsxMl0gPSAobGVmdCArIHJpZ2h0KSAqIGxyO1xuICAgICAgICBtWzEzXSA9ICh0b3AgKyBib3R0b20pICogYnQ7XG4gICAgICAgIG1bMTRdID0gKGZhciArIG5lYXIpICogbmY7XG4gICAgICAgIG1bMTVdID0gMTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOagueaNruinhueCueiuoeeul+efqemYte+8jOazqOaEjyBgZXllIC0gY2VudGVyYCDkuI3og73kuLrpm7blkJHph4/miJbkuI4gYHVwYCDlkJHph4/lubPooYxcbiAgICAgKiAhI2VuIGBVcGAgcGFyYWxsZWwgdmVjdG9yIG9yIHZlY3RvciBjZW50ZXJgIG5vdCBiZSB6ZXJvIC0gdGhlIG1hdHJpeCBjYWxjdWxhdGlvbiBhY2NvcmRpbmcgdG8gdGhlIHZpZXdwb2ludCwgbm90ZWAgZXllXG4gICAgICogQG1ldGhvZCBsb29rQXRcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBsb29rQXQ8T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGV5ZTogVmVjTGlrZSwgY2VudGVyOiBWZWNMaWtlLCB1cDogVmVjTGlrZSlcbiAgICAgKiBAcGFyYW0gZXllIOW9k+WJjeS9jee9rlxuICAgICAqIEBwYXJhbSBjZW50ZXIg55uu5qCH6KeG54K5XG4gICAgICogQHBhcmFtIHVwIOinhuWPo+S4iuaWueWQkVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgbG9va0F0PE91dCBleHRlbmRzIElNYXQ0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBleWU6IFZlY0xpa2UsIGNlbnRlcjogVmVjTGlrZSwgdXA6IFZlY0xpa2UpIHtcbiAgICAgICAgY29uc3QgZXlleCA9IGV5ZS54O1xuICAgICAgICBjb25zdCBleWV5ID0gZXllLnk7XG4gICAgICAgIGNvbnN0IGV5ZXogPSBleWUuejtcbiAgICAgICAgY29uc3QgdXB4ID0gdXAueDtcbiAgICAgICAgY29uc3QgdXB5ID0gdXAueTtcbiAgICAgICAgY29uc3QgdXB6ID0gdXAuejtcbiAgICAgICAgY29uc3QgY2VudGVyeCA9IGNlbnRlci54O1xuICAgICAgICBjb25zdCBjZW50ZXJ5ID0gY2VudGVyLnk7XG4gICAgICAgIGNvbnN0IGNlbnRlcnogPSBjZW50ZXIuejtcblxuICAgICAgICBsZXQgejAgPSBleWV4IC0gY2VudGVyeDtcbiAgICAgICAgbGV0IHoxID0gZXlleSAtIGNlbnRlcnk7XG4gICAgICAgIGxldCB6MiA9IGV5ZXogLSBjZW50ZXJ6O1xuXG4gICAgICAgIGxldCBsZW4gPSAxIC8gTWF0aC5zcXJ0KHowICogejAgKyB6MSAqIHoxICsgejIgKiB6Mik7XG4gICAgICAgIHowICo9IGxlbjtcbiAgICAgICAgejEgKj0gbGVuO1xuICAgICAgICB6MiAqPSBsZW47XG5cbiAgICAgICAgbGV0IHgwID0gdXB5ICogejIgLSB1cHogKiB6MTtcbiAgICAgICAgbGV0IHgxID0gdXB6ICogejAgLSB1cHggKiB6MjtcbiAgICAgICAgbGV0IHgyID0gdXB4ICogejEgLSB1cHkgKiB6MDtcbiAgICAgICAgbGVuID0gMSAvIE1hdGguc3FydCh4MCAqIHgwICsgeDEgKiB4MSArIHgyICogeDIpO1xuICAgICAgICB4MCAqPSBsZW47XG4gICAgICAgIHgxICo9IGxlbjtcbiAgICAgICAgeDIgKj0gbGVuO1xuXG4gICAgICAgIGNvbnN0IHkwID0gejEgKiB4MiAtIHoyICogeDE7XG4gICAgICAgIGNvbnN0IHkxID0gejIgKiB4MCAtIHowICogeDI7XG4gICAgICAgIGNvbnN0IHkyID0gejAgKiB4MSAtIHoxICogeDA7XG5cbiAgICAgICAgbGV0IG0gPSBvdXQubTtcbiAgICAgICAgbVswXSA9IHgwO1xuICAgICAgICBtWzFdID0geTA7XG4gICAgICAgIG1bMl0gPSB6MDtcbiAgICAgICAgbVszXSA9IDA7XG4gICAgICAgIG1bNF0gPSB4MTtcbiAgICAgICAgbVs1XSA9IHkxO1xuICAgICAgICBtWzZdID0gejE7XG4gICAgICAgIG1bN10gPSAwO1xuICAgICAgICBtWzhdID0geDI7XG4gICAgICAgIG1bOV0gPSB5MjtcbiAgICAgICAgbVsxMF0gPSB6MjtcbiAgICAgICAgbVsxMV0gPSAwO1xuICAgICAgICBtWzEyXSA9IC0oeDAgKiBleWV4ICsgeDEgKiBleWV5ICsgeDIgKiBleWV6KTtcbiAgICAgICAgbVsxM10gPSAtKHkwICogZXlleCArIHkxICogZXlleSArIHkyICogZXlleik7XG4gICAgICAgIG1bMTRdID0gLSh6MCAqIGV5ZXggKyB6MSAqIGV5ZXkgKyB6MiAqIGV5ZXopO1xuICAgICAgICBtWzE1XSA9IDE7XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOiuoeeul+mAhui9rOe9ruefqemYtVxuICAgICAqICEjZW4gUmV2ZXJzYWwgbWF0cml4IGNhbGN1bGF0aW9uXG4gICAgICogQG1ldGhvZCBpbnZlcnNlVHJhbnNwb3NlXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgaW52ZXJzZVRyYW5zcG9zZTxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgaW52ZXJzZVRyYW5zcG9zZTxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XG5cbiAgICAgICAgbGV0IG0gPSBhLm07XG4gICAgICAgIF9hMDAgPSBtWzBdOyBfYTAxID0gbVsxXTsgX2EwMiA9IG1bMl07IF9hMDMgPSBtWzNdO1xuICAgICAgICBfYTEwID0gbVs0XTsgX2ExMSA9IG1bNV07IF9hMTIgPSBtWzZdOyBfYTEzID0gbVs3XTtcbiAgICAgICAgX2EyMCA9IG1bOF07IF9hMjEgPSBtWzldOyBfYTIyID0gbVsxMF07IF9hMjMgPSBtWzExXTtcbiAgICAgICAgX2EzMCA9IG1bMTJdOyBfYTMxID0gbVsxM107IF9hMzIgPSBtWzE0XTsgX2EzMyA9IG1bMTVdO1xuXG4gICAgICAgIGNvbnN0IGIwMCA9IF9hMDAgKiBfYTExIC0gX2EwMSAqIF9hMTA7XG4gICAgICAgIGNvbnN0IGIwMSA9IF9hMDAgKiBfYTEyIC0gX2EwMiAqIF9hMTA7XG4gICAgICAgIGNvbnN0IGIwMiA9IF9hMDAgKiBfYTEzIC0gX2EwMyAqIF9hMTA7XG4gICAgICAgIGNvbnN0IGIwMyA9IF9hMDEgKiBfYTEyIC0gX2EwMiAqIF9hMTE7XG4gICAgICAgIGNvbnN0IGIwNCA9IF9hMDEgKiBfYTEzIC0gX2EwMyAqIF9hMTE7XG4gICAgICAgIGNvbnN0IGIwNSA9IF9hMDIgKiBfYTEzIC0gX2EwMyAqIF9hMTI7XG4gICAgICAgIGNvbnN0IGIwNiA9IF9hMjAgKiBfYTMxIC0gX2EyMSAqIF9hMzA7XG4gICAgICAgIGNvbnN0IGIwNyA9IF9hMjAgKiBfYTMyIC0gX2EyMiAqIF9hMzA7XG4gICAgICAgIGNvbnN0IGIwOCA9IF9hMjAgKiBfYTMzIC0gX2EyMyAqIF9hMzA7XG4gICAgICAgIGNvbnN0IGIwOSA9IF9hMjEgKiBfYTMyIC0gX2EyMiAqIF9hMzE7XG4gICAgICAgIGNvbnN0IGIxMCA9IF9hMjEgKiBfYTMzIC0gX2EyMyAqIF9hMzE7XG4gICAgICAgIGNvbnN0IGIxMSA9IF9hMjIgKiBfYTMzIC0gX2EyMyAqIF9hMzI7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBkZXRlcm1pbmFudFxuICAgICAgICBsZXQgZGV0ID0gYjAwICogYjExIC0gYjAxICogYjEwICsgYjAyICogYjA5ICsgYjAzICogYjA4IC0gYjA0ICogYjA3ICsgYjA1ICogYjA2O1xuXG4gICAgICAgIGlmICghZGV0KSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBkZXQgPSAxLjAgLyBkZXQ7XG5cbiAgICAgICAgbSA9IG91dC5tO1xuICAgICAgICBtWzBdID0gKF9hMTEgKiBiMTEgLSBfYTEyICogYjEwICsgX2ExMyAqIGIwOSkgKiBkZXQ7XG4gICAgICAgIG1bMV0gPSAoX2ExMiAqIGIwOCAtIF9hMTAgKiBiMTEgLSBfYTEzICogYjA3KSAqIGRldDtcbiAgICAgICAgbVsyXSA9IChfYTEwICogYjEwIC0gX2ExMSAqIGIwOCArIF9hMTMgKiBiMDYpICogZGV0O1xuICAgICAgICBtWzNdID0gMDtcblxuICAgICAgICBtWzRdID0gKF9hMDIgKiBiMTAgLSBfYTAxICogYjExIC0gX2EwMyAqIGIwOSkgKiBkZXQ7XG4gICAgICAgIG1bNV0gPSAoX2EwMCAqIGIxMSAtIF9hMDIgKiBiMDggKyBfYTAzICogYjA3KSAqIGRldDtcbiAgICAgICAgbVs2XSA9IChfYTAxICogYjA4IC0gX2EwMCAqIGIxMCAtIF9hMDMgKiBiMDYpICogZGV0O1xuICAgICAgICBtWzddID0gMDtcblxuICAgICAgICBtWzhdID0gKF9hMzEgKiBiMDUgLSBfYTMyICogYjA0ICsgX2EzMyAqIGIwMykgKiBkZXQ7XG4gICAgICAgIG1bOV0gPSAoX2EzMiAqIGIwMiAtIF9hMzAgKiBiMDUgLSBfYTMzICogYjAxKSAqIGRldDtcbiAgICAgICAgbVsxMF0gPSAoX2EzMCAqIGIwNCAtIF9hMzEgKiBiMDIgKyBfYTMzICogYjAwKSAqIGRldDtcbiAgICAgICAgbVsxMV0gPSAwO1xuXG4gICAgICAgIG1bMTJdID0gMDtcbiAgICAgICAgbVsxM10gPSAwO1xuICAgICAgICBtWzE0XSA9IDA7XG4gICAgICAgIG1bMTVdID0gMTtcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg55+p6Zi15Yqg5rOVXG4gICAgICogISNlbiBFbGVtZW50IGJ5IGVsZW1lbnQgbWF0cml4IGFkZGl0aW9uXG4gICAgICogQG1ldGhvZCBhZGRcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBhZGQ8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgYWRkPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICBsZXQgbSA9IG91dC5tLCBhbSA9IGEubSwgYm0gPSBiLm07XG4gICAgICAgIG1bMF0gPSBhbVswXSArIGJtWzBdO1xuICAgICAgICBtWzFdID0gYW1bMV0gKyBibVsxXTtcbiAgICAgICAgbVsyXSA9IGFtWzJdICsgYm1bMl07XG4gICAgICAgIG1bM10gPSBhbVszXSArIGJtWzNdO1xuICAgICAgICBtWzRdID0gYW1bNF0gKyBibVs0XTtcbiAgICAgICAgbVs1XSA9IGFtWzVdICsgYm1bNV07XG4gICAgICAgIG1bNl0gPSBhbVs2XSArIGJtWzZdO1xuICAgICAgICBtWzddID0gYW1bN10gKyBibVs3XTtcbiAgICAgICAgbVs4XSA9IGFtWzhdICsgYm1bOF07XG4gICAgICAgIG1bOV0gPSBhbVs5XSArIGJtWzldO1xuICAgICAgICBtWzEwXSA9IGFtWzEwXSArIGJtWzEwXTtcbiAgICAgICAgbVsxMV0gPSBhbVsxMV0gKyBibVsxMV07XG4gICAgICAgIG1bMTJdID0gYW1bMTJdICsgYm1bMTJdO1xuICAgICAgICBtWzEzXSA9IGFtWzEzXSArIGJtWzEzXTtcbiAgICAgICAgbVsxNF0gPSBhbVsxNF0gKyBibVsxNF07XG4gICAgICAgIG1bMTVdID0gYW1bMTVdICsgYm1bMTVdO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg55+p6Zi15YeP5rOVXG4gICAgICogISNlbiBNYXRyaXggZWxlbWVudCBieSBlbGVtZW50IHN1YnRyYWN0aW9uXG4gICAgICogQG1ldGhvZCBzdWJ0cmFjdFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIHN1YnRyYWN0PE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHN1YnRyYWN0PE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICBsZXQgbSA9IG91dC5tLCBhbSA9IGEubSwgYm0gPSBiLm07XG4gICAgICAgIG1bMF0gPSBhbVswXSAtIGJtWzBdO1xuICAgICAgICBtWzFdID0gYW1bMV0gLSBibVsxXTtcbiAgICAgICAgbVsyXSA9IGFtWzJdIC0gYm1bMl07XG4gICAgICAgIG1bM10gPSBhbVszXSAtIGJtWzNdO1xuICAgICAgICBtWzRdID0gYW1bNF0gLSBibVs0XTtcbiAgICAgICAgbVs1XSA9IGFtWzVdIC0gYm1bNV07XG4gICAgICAgIG1bNl0gPSBhbVs2XSAtIGJtWzZdO1xuICAgICAgICBtWzddID0gYW1bN10gLSBibVs3XTtcbiAgICAgICAgbVs4XSA9IGFtWzhdIC0gYm1bOF07XG4gICAgICAgIG1bOV0gPSBhbVs5XSAtIGJtWzldO1xuICAgICAgICBtWzEwXSA9IGFtWzEwXSAtIGJtWzEwXTtcbiAgICAgICAgbVsxMV0gPSBhbVsxMV0gLSBibVsxMV07XG4gICAgICAgIG1bMTJdID0gYW1bMTJdIC0gYm1bMTJdO1xuICAgICAgICBtWzEzXSA9IGFtWzEzXSAtIGJtWzEzXTtcbiAgICAgICAgbVsxNF0gPSBhbVsxNF0gLSBibVsxNF07XG4gICAgICAgIG1bMTVdID0gYW1bMTVdIC0gYm1bMTVdO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg55+p6Zi15qCH6YeP5LmY5rOVXG4gICAgICogISNlbiBNYXRyaXggc2NhbGFyIG11bHRpcGxpY2F0aW9uXG4gICAgICogQG1ldGhvZCBtdWx0aXBseVNjYWxhclxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIG11bHRpcGx5U2NhbGFyPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IG51bWJlcilcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIG11bHRpcGx5U2NhbGFyPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IG51bWJlcikge1xuICAgICAgICBsZXQgbSA9IG91dC5tLCBhbSA9IGEubTtcbiAgICAgICAgbVswXSA9IGFtWzBdICogYjtcbiAgICAgICAgbVsxXSA9IGFtWzFdICogYjtcbiAgICAgICAgbVsyXSA9IGFtWzJdICogYjtcbiAgICAgICAgbVszXSA9IGFtWzNdICogYjtcbiAgICAgICAgbVs0XSA9IGFtWzRdICogYjtcbiAgICAgICAgbVs1XSA9IGFtWzVdICogYjtcbiAgICAgICAgbVs2XSA9IGFtWzZdICogYjtcbiAgICAgICAgbVs3XSA9IGFtWzddICogYjtcbiAgICAgICAgbVs4XSA9IGFtWzhdICogYjtcbiAgICAgICAgbVs5XSA9IGFtWzldICogYjtcbiAgICAgICAgbVsxMF0gPSBhbVsxMF0gKiBiO1xuICAgICAgICBtWzExXSA9IGFtWzExXSAqIGI7XG4gICAgICAgIG1bMTJdID0gYW1bMTJdICogYjtcbiAgICAgICAgbVsxM10gPSBhbVsxM10gKiBiO1xuICAgICAgICBtWzE0XSA9IGFtWzE0XSAqIGI7XG4gICAgICAgIG1bMTVdID0gYW1bMTVdICogYjtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOefqemYteagh+mHj+S5mOWKoDogQSArIEIgKiBzY2FsZVxuICAgICAqICEjZW4gRWxlbWVudHMgb2YgdGhlIG1hdHJpeCBieSB0aGUgc2NhbGFyIG11bHRpcGxpY2F0aW9uIGFuZCBhZGRpdGlvbjogQSArIEIgKiBzY2FsZVxuICAgICAqIEBtZXRob2QgbXVsdGlwbHlTY2FsYXJBbmRBZGRcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBtdWx0aXBseVNjYWxhckFuZEFkZDxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQsIHNjYWxlOiBudW1iZXIpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBtdWx0aXBseVNjYWxhckFuZEFkZDxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQsIHNjYWxlOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IG0gPSBvdXQubSwgYW0gPSBhLm0sIGJtID0gYi5tO1xuICAgICAgICBtWzBdID0gYW1bMF0gKyAoYm1bMF0gKiBzY2FsZSk7XG4gICAgICAgIG1bMV0gPSBhbVsxXSArIChibVsxXSAqIHNjYWxlKTtcbiAgICAgICAgbVsyXSA9IGFtWzJdICsgKGJtWzJdICogc2NhbGUpO1xuICAgICAgICBtWzNdID0gYW1bM10gKyAoYm1bM10gKiBzY2FsZSk7XG4gICAgICAgIG1bNF0gPSBhbVs0XSArIChibVs0XSAqIHNjYWxlKTtcbiAgICAgICAgbVs1XSA9IGFtWzVdICsgKGJtWzVdICogc2NhbGUpO1xuICAgICAgICBtWzZdID0gYW1bNl0gKyAoYm1bNl0gKiBzY2FsZSk7XG4gICAgICAgIG1bN10gPSBhbVs3XSArIChibVs3XSAqIHNjYWxlKTtcbiAgICAgICAgbVs4XSA9IGFtWzhdICsgKGJtWzhdICogc2NhbGUpO1xuICAgICAgICBtWzldID0gYW1bOV0gKyAoYm1bOV0gKiBzY2FsZSk7XG4gICAgICAgIG1bMTBdID0gYW1bMTBdICsgKGJtWzEwXSAqIHNjYWxlKTtcbiAgICAgICAgbVsxMV0gPSBhbVsxMV0gKyAoYm1bMTFdICogc2NhbGUpO1xuICAgICAgICBtWzEyXSA9IGFtWzEyXSArIChibVsxMl0gKiBzY2FsZSk7XG4gICAgICAgIG1bMTNdID0gYW1bMTNdICsgKGJtWzEzXSAqIHNjYWxlKTtcbiAgICAgICAgbVsxNF0gPSBhbVsxNF0gKyAoYm1bMTRdICogc2NhbGUpO1xuICAgICAgICBtWzE1XSA9IGFtWzE1XSArIChibVsxNV0gKiBzY2FsZSk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDnn6npmLXnrYnku7fliKTmlq1cbiAgICAgKiAhI2VuIEFuYWx5emluZyB0aGUgZXF1aXZhbGVudCBtYXRyaXhcbiAgICAgKiBAbWV0aG9kIHN0cmljdEVxdWFsc1xuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIHN0cmljdEVxdWFsczxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChhOiBPdXQsIGI6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHN0cmljdEVxdWFsczxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICBsZXQgYW0gPSBhLm0sIGJtID0gYi5tO1xuICAgICAgICByZXR1cm4gYW1bMF0gPT09IGJtWzBdICYmIGFtWzFdID09PSBibVsxXSAmJiBhbVsyXSA9PT0gYm1bMl0gJiYgYW1bM10gPT09IGJtWzNdICYmXG4gICAgICAgICAgICBhbVs0XSA9PT0gYm1bNF0gJiYgYW1bNV0gPT09IGJtWzVdICYmIGFtWzZdID09PSBibVs2XSAmJiBhbVs3XSA9PT0gYm1bN10gJiZcbiAgICAgICAgICAgIGFtWzhdID09PSBibVs4XSAmJiBhbVs5XSA9PT0gYm1bOV0gJiYgYW1bMTBdID09PSBibVsxMF0gJiYgYW1bMTFdID09PSBibVsxMV0gJiZcbiAgICAgICAgICAgIGFtWzEyXSA9PT0gYm1bMTJdICYmIGFtWzEzXSA9PT0gYm1bMTNdICYmIGFtWzE0XSA9PT0gYm1bMTRdICYmIGFtWzE1XSA9PT0gYm1bMTVdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5o6S6Zmk5rWu54K55pWw6K+v5beu55qE55+p6Zi16L+R5Ly8562J5Lu35Yik5patXG4gICAgICogISNlbiBOZWdhdGl2ZSBmbG9hdGluZyBwb2ludCBlcnJvciBpcyBhcHByb3hpbWF0ZWx5IGVxdWl2YWxlbnQgdG8gZGV0ZXJtaW5pbmcgYSBtYXRyaXhcbiAgICAgKiBAbWV0aG9kIGVxdWFsc1xuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RhdGljIGVxdWFsczxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChhOiBPdXQsIGI6IE91dCwgZXBzaWxvbiA9IEVQU0lMT04pXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBlcXVhbHM8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAoYTogT3V0LCBiOiBPdXQsIGVwc2lsb24gPSBFUFNJTE9OKSB7XG5cbiAgICAgICAgbGV0IGFtID0gYS5tLCBibSA9IGIubTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIE1hdGguYWJzKGFtWzBdIC0gYm1bMF0pIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGFtWzBdKSwgTWF0aC5hYnMoYm1bMF0pKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYW1bMV0gLSBibVsxXSkgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYW1bMV0pLCBNYXRoLmFicyhibVsxXSkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhbVsyXSAtIGJtWzJdKSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhbVsyXSksIE1hdGguYWJzKGJtWzJdKSkgJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGFtWzNdIC0gYm1bM10pIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGFtWzNdKSwgTWF0aC5hYnMoYm1bM10pKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYW1bNF0gLSBibVs0XSkgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYW1bNF0pLCBNYXRoLmFicyhibVs0XSkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhbVs1XSAtIGJtWzVdKSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhbVs1XSksIE1hdGguYWJzKGJtWzVdKSkgJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGFtWzZdIC0gYm1bNl0pIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGFtWzZdKSwgTWF0aC5hYnMoYm1bNl0pKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYW1bN10gLSBibVs3XSkgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYW1bN10pLCBNYXRoLmFicyhibVs3XSkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhbVs4XSAtIGJtWzhdKSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhbVs4XSksIE1hdGguYWJzKGJtWzhdKSkgJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGFtWzldIC0gYm1bOV0pIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGFtWzldKSwgTWF0aC5hYnMoYm1bOV0pKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYW1bMTBdIC0gYm1bMTBdKSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhbVsxMF0pLCBNYXRoLmFicyhibVsxMF0pKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYW1bMTFdIC0gYm1bMTFdKSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhbVsxMV0pLCBNYXRoLmFicyhibVsxMV0pKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYW1bMTJdIC0gYm1bMTJdKSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhbVsxMl0pLCBNYXRoLmFicyhibVsxMl0pKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYW1bMTNdIC0gYm1bMTNdKSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhbVsxM10pLCBNYXRoLmFicyhibVsxM10pKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYW1bMTRdIC0gYm1bMTRdKSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhbVsxNF0pLCBNYXRoLmFicyhibVsxNF0pKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYW1bMTVdIC0gYm1bMTVdKSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhbVsxNV0pLCBNYXRoLmFicyhibVsxNV0pKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGN1bGF0ZXMgdGhlIGFkanVnYXRlIG9mIGEgbWF0cml4LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtNYXQ0fSBvdXQgLSBNYXRyaXggdG8gc3RvcmUgcmVzdWx0LlxuICAgICAqIEBwYXJhbSB7TWF0NH0gYSAtIE1hdHJpeCB0byBjYWxjdWxhdGUuXG4gICAgICogQHJldHVybnMge01hdDR9IG91dC5cbiAgICAgKi9cbiAgICBzdGF0aWMgYWRqb2ludCAob3V0LCBhKSB7XG4gICAgICAgIGxldCBhbSA9IGEubSwgb3V0bSA9IG91dC5tO1xuICAgICAgICBsZXQgYTAwID0gYW1bMF0sIGEwMSA9IGFtWzFdLCBhMDIgPSBhbVsyXSwgYTAzID0gYW1bM10sXG4gICAgICAgICAgICBhMTAgPSBhbVs0XSwgYTExID0gYW1bNV0sIGExMiA9IGFtWzZdLCBhMTMgPSBhbVs3XSxcbiAgICAgICAgICAgIGEyMCA9IGFtWzhdLCBhMjEgPSBhbVs5XSwgYTIyID0gYW1bMTBdLCBhMjMgPSBhbVsxMV0sXG4gICAgICAgICAgICBhMzAgPSBhbVsxMl0sIGEzMSA9IGFtWzEzXSwgYTMyID0gYW1bMTRdLCBhMzMgPSBhbVsxNV07XG5cbiAgICAgICAgb3V0bVswXSA9IChhMTEgKiAoYTIyICogYTMzIC0gYTIzICogYTMyKSAtIGEyMSAqIChhMTIgKiBhMzMgLSBhMTMgKiBhMzIpICsgYTMxICogKGExMiAqIGEyMyAtIGExMyAqIGEyMikpO1xuICAgICAgICBvdXRtWzFdID0gLShhMDEgKiAoYTIyICogYTMzIC0gYTIzICogYTMyKSAtIGEyMSAqIChhMDIgKiBhMzMgLSBhMDMgKiBhMzIpICsgYTMxICogKGEwMiAqIGEyMyAtIGEwMyAqIGEyMikpO1xuICAgICAgICBvdXRtWzJdID0gKGEwMSAqIChhMTIgKiBhMzMgLSBhMTMgKiBhMzIpIC0gYTExICogKGEwMiAqIGEzMyAtIGEwMyAqIGEzMikgKyBhMzEgKiAoYTAyICogYTEzIC0gYTAzICogYTEyKSk7XG4gICAgICAgIG91dG1bM10gPSAtKGEwMSAqIChhMTIgKiBhMjMgLSBhMTMgKiBhMjIpIC0gYTExICogKGEwMiAqIGEyMyAtIGEwMyAqIGEyMikgKyBhMjEgKiAoYTAyICogYTEzIC0gYTAzICogYTEyKSk7XG4gICAgICAgIG91dG1bNF0gPSAtKGExMCAqIChhMjIgKiBhMzMgLSBhMjMgKiBhMzIpIC0gYTIwICogKGExMiAqIGEzMyAtIGExMyAqIGEzMikgKyBhMzAgKiAoYTEyICogYTIzIC0gYTEzICogYTIyKSk7XG4gICAgICAgIG91dG1bNV0gPSAoYTAwICogKGEyMiAqIGEzMyAtIGEyMyAqIGEzMikgLSBhMjAgKiAoYTAyICogYTMzIC0gYTAzICogYTMyKSArIGEzMCAqIChhMDIgKiBhMjMgLSBhMDMgKiBhMjIpKTtcbiAgICAgICAgb3V0bVs2XSA9IC0oYTAwICogKGExMiAqIGEzMyAtIGExMyAqIGEzMikgLSBhMTAgKiAoYTAyICogYTMzIC0gYTAzICogYTMyKSArIGEzMCAqIChhMDIgKiBhMTMgLSBhMDMgKiBhMTIpKTtcbiAgICAgICAgb3V0bVs3XSA9IChhMDAgKiAoYTEyICogYTIzIC0gYTEzICogYTIyKSAtIGExMCAqIChhMDIgKiBhMjMgLSBhMDMgKiBhMjIpICsgYTIwICogKGEwMiAqIGExMyAtIGEwMyAqIGExMikpO1xuICAgICAgICBvdXRtWzhdID0gKGExMCAqIChhMjEgKiBhMzMgLSBhMjMgKiBhMzEpIC0gYTIwICogKGExMSAqIGEzMyAtIGExMyAqIGEzMSkgKyBhMzAgKiAoYTExICogYTIzIC0gYTEzICogYTIxKSk7XG4gICAgICAgIG91dG1bOV0gPSAtKGEwMCAqIChhMjEgKiBhMzMgLSBhMjMgKiBhMzEpIC0gYTIwICogKGEwMSAqIGEzMyAtIGEwMyAqIGEzMSkgKyBhMzAgKiAoYTAxICogYTIzIC0gYTAzICogYTIxKSk7XG4gICAgICAgIG91dG1bMTBdID0gKGEwMCAqIChhMTEgKiBhMzMgLSBhMTMgKiBhMzEpIC0gYTEwICogKGEwMSAqIGEzMyAtIGEwMyAqIGEzMSkgKyBhMzAgKiAoYTAxICogYTEzIC0gYTAzICogYTExKSk7XG4gICAgICAgIG91dG1bMTFdID0gLShhMDAgKiAoYTExICogYTIzIC0gYTEzICogYTIxKSAtIGExMCAqIChhMDEgKiBhMjMgLSBhMDMgKiBhMjEpICsgYTIwICogKGEwMSAqIGExMyAtIGEwMyAqIGExMSkpO1xuICAgICAgICBvdXRtWzEyXSA9IC0oYTEwICogKGEyMSAqIGEzMiAtIGEyMiAqIGEzMSkgLSBhMjAgKiAoYTExICogYTMyIC0gYTEyICogYTMxKSArIGEzMCAqIChhMTEgKiBhMjIgLSBhMTIgKiBhMjEpKTtcbiAgICAgICAgb3V0bVsxM10gPSAoYTAwICogKGEyMSAqIGEzMiAtIGEyMiAqIGEzMSkgLSBhMjAgKiAoYTAxICogYTMyIC0gYTAyICogYTMxKSArIGEzMCAqIChhMDEgKiBhMjIgLSBhMDIgKiBhMjEpKTtcbiAgICAgICAgb3V0bVsxNF0gPSAtKGEwMCAqIChhMTEgKiBhMzIgLSBhMTIgKiBhMzEpIC0gYTEwICogKGEwMSAqIGEzMiAtIGEwMiAqIGEzMSkgKyBhMzAgKiAoYTAxICogYTEyIC0gYTAyICogYTExKSk7XG4gICAgICAgIG91dG1bMTVdID0gKGEwMCAqIChhMTEgKiBhMjIgLSBhMTIgKiBhMjEpIC0gYTEwICogKGEwMSAqIGEyMiAtIGEwMiAqIGEyMSkgKyBhMjAgKiAoYTAxICogYTEyIC0gYTAyICogYTExKSk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDnn6npmLXovazmlbDnu4RcbiAgICAgKiAhI2VuIE1hdHJpeCB0cmFuc3Bvc2UgYXJyYXlcbiAgICAgKiBAbWV0aG9kIHRvQXJyYXlcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyB0b0FycmF5IDxPdXQgZXh0ZW5kcyBJV3JpdGFibGVBcnJheUxpa2U8bnVtYmVyPj4gKG91dDogT3V0LCBtYXQ6IElNYXQ0TGlrZSwgb2ZzID0gMClcbiAgICAgKiBAcGFyYW0gb2ZzIOaVsOe7hOWGheeahOi1t+Wni+WBj+enu+mHj1xuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgdG9BcnJheTxPdXQgZXh0ZW5kcyBJV3JpdGFibGVBcnJheUxpa2U8bnVtYmVyPj4gKG91dDogT3V0LCBtYXQ6IElNYXQ0TGlrZSwgb2ZzID0gMCkge1xuICAgICAgICBsZXQgbSA9IG1hdC5tO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyBpKyspIHtcbiAgICAgICAgICAgIG91dFtvZnMgKyBpXSA9IG1baV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOaVsOe7hOi9rOefqemYtVxuICAgICAqICEjZW4gVHJhbnNmZXIgbWF0cml4IGFycmF5XG4gICAgICogQG1ldGhvZCBmcm9tQXJyYXlcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBmcm9tQXJyYXkgPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhcnI6IElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+LCBvZnMgPSAwKVxuICAgICAqIEBwYXJhbSBvZnMg5pWw57uE6LW35aeL5YGP56e76YePXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tQXJyYXk8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGFycjogSVdyaXRhYmxlQXJyYXlMaWtlPG51bWJlcj4sIG9mcyA9IDApIHtcbiAgICAgICAgbGV0IG0gPSBvdXQubTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgaSsrKSB7XG4gICAgICAgICAgICBtW2ldID0gYXJyW29mcyArIGldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBNYXRyaXggRGF0YVxuICAgICAqICEjemgg55+p6Zi15pWw5o2uXG4gICAgICogQHByb3BlcnR5IHtGbG9hdDY0QXJyYXkgfCBGbG9hdDMyQXJyYXl9IG1cbiAgICAgKi9cbiAgICBtOiBGbG9hdEFycmF5O1xuXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQ29uc3RydWN0b3JcbiAgICAgKiBzZWUge3sjY3Jvc3NMaW5rIFwiY2MvbWF0NDptZXRob2RcIn19Y2MubWF0NHt7L2Nyb3NzTGlua319XG4gICAgICogISN6aFxuICAgICAqIOaehOmAoOWHveaVsO+8jOWPr+afpeeciyB7eyNjcm9zc0xpbmsgXCJjYy9tYXQ0Om1ldGhvZFwifX1jYy5tYXQ0e3svY3Jvc3NMaW5rfX1cbiAgICAgKiBAbWV0aG9kIGNvbnN0cnVjdG9yXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdHJ1Y3RvciAoXG4gICAgICAgICAgICBtMDA6IG51bWJlciA9IDEsIG0wMTogbnVtYmVyID0gMCwgbTAyOiBudW1iZXIgPSAwLCBtMDM6IG51bWJlciA9IDAsXG4gICAgICAgICAgICBtMTA6IG51bWJlciA9IDAsIG0xMTogbnVtYmVyID0gMSwgbTEyOiBudW1iZXIgPSAwLCBtMTM6IG51bWJlciA9IDAsXG4gICAgICAgICAgICBtMjA6IG51bWJlciA9IDAsIG0yMTogbnVtYmVyID0gMCwgbTIyOiBudW1iZXIgPSAxLCBtMjM6IG51bWJlciA9IDAsXG4gICAgICAgICAgICBtMzA6IG51bWJlciA9IDAsIG0zMTogbnVtYmVyID0gMCwgbTMyOiBudW1iZXIgPSAwLCBtMzM6IG51bWJlciA9IDFcbiAgICAgICAgKVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yIChcbiAgICAgICAgbTAwOiBudW1iZXIgfCBGbG9hdEFycmF5ID0gMSwgbTAxOiBudW1iZXIgPSAwLCBtMDI6IG51bWJlciA9IDAsIG0wMzogbnVtYmVyID0gMCxcbiAgICAgICAgbTEwOiBudW1iZXIgPSAwLCBtMTE6IG51bWJlciA9IDEsIG0xMjogbnVtYmVyID0gMCwgbTEzOiBudW1iZXIgPSAwLFxuICAgICAgICBtMjA6IG51bWJlciA9IDAsIG0yMTogbnVtYmVyID0gMCwgbTIyOiBudW1iZXIgPSAxLCBtMjM6IG51bWJlciA9IDAsXG4gICAgICAgIG0zMDogbnVtYmVyID0gMCwgbTMxOiBudW1iZXIgPSAwLCBtMzI6IG51bWJlciA9IDAsIG0zMzogbnVtYmVyID0gMSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBpZiAobTAwIGluc3RhbmNlb2YgRkxPQVRfQVJSQVlfVFlQRSkge1xuICAgICAgICAgICAgdGhpcy5tID0gbTAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tID0gbmV3IEZMT0FUX0FSUkFZX1RZUEUoMTYpO1xuICAgICAgICAgICAgbGV0IHRtID0gdGhpcy5tO1xuICAgICAgICAgICAgdG1bMF0gPSBtMDA7XG4gICAgICAgICAgICB0bVsxXSA9IG0wMTtcbiAgICAgICAgICAgIHRtWzJdID0gbTAyO1xuICAgICAgICAgICAgdG1bM10gPSBtMDM7XG4gICAgICAgICAgICB0bVs0XSA9IG0xMDtcbiAgICAgICAgICAgIHRtWzVdID0gbTExO1xuICAgICAgICAgICAgdG1bNl0gPSBtMTI7XG4gICAgICAgICAgICB0bVs3XSA9IG0xMztcbiAgICAgICAgICAgIHRtWzhdID0gbTIwO1xuICAgICAgICAgICAgdG1bOV0gPSBtMjE7XG4gICAgICAgICAgICB0bVsxMF0gPSBtMjI7XG4gICAgICAgICAgICB0bVsxMV0gPSBtMjM7XG4gICAgICAgICAgICB0bVsxMl0gPSBtMzA7XG4gICAgICAgICAgICB0bVsxM10gPSBtMzE7XG4gICAgICAgICAgICB0bVsxNF0gPSBtMzI7XG4gICAgICAgICAgICB0bVsxNV0gPSBtMzM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIGNsb25lIGEgTWF0NCBvYmplY3RcbiAgICAgKiAhI3poIOWFi+mahuS4gOS4qiBNYXQ0IOWvueixoVxuICAgICAqIEBtZXRob2QgY2xvbmVcbiAgICAgKiBAcmV0dXJuIHtNYXQ0fVxuICAgICAqL1xuICAgIGNsb25lICgpIHtcbiAgICAgICAgbGV0IHQgPSB0aGlzO1xuICAgICAgICBsZXQgdG0gPSB0Lm07XG4gICAgICAgIHJldHVybiBuZXcgTWF0NChcbiAgICAgICAgICAgIHRtWzBdLCB0bVsxXSwgdG1bMl0sIHRtWzNdLFxuICAgICAgICAgICAgdG1bNF0sIHRtWzVdLCB0bVs2XSwgdG1bN10sXG4gICAgICAgICAgICB0bVs4XSwgdG1bOV0sIHRtWzEwXSwgdG1bMTFdLFxuICAgICAgICAgICAgdG1bMTJdLCB0bVsxM10sIHRtWzE0XSwgdG1bMTVdKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgdGhlIG1hdHJpeCB3aXRoIGFub3RoZXIgb25lJ3MgdmFsdWVcbiAgICAgKiAhI3poIOeUqOWPpuS4gOS4quefqemYteiuvue9rui/meS4quefqemYteeahOWAvOOAglxuICAgICAqIEBtZXRob2Qgc2V0XG4gICAgICogQHBhcmFtIHtNYXQ0fSBzcmNPYmpcbiAgICAgKiBAcmV0dXJuIHtNYXQ0fSByZXR1cm5zIHRoaXNcbiAgICAgKiBAY2hhaW5hYmxlXG4gICAgICovXG4gICAgc2V0IChzKSB7XG4gICAgICAgIGxldCB0ID0gdGhpcztcbiAgICAgICAgbGV0IHRtID0gdC5tLCBzbSA9IHMubTtcbiAgICAgICAgdG1bMF0gPSBzbVswXTtcbiAgICAgICAgdG1bMV0gPSBzbVsxXTtcbiAgICAgICAgdG1bMl0gPSBzbVsyXTtcbiAgICAgICAgdG1bM10gPSBzbVszXTtcbiAgICAgICAgdG1bNF0gPSBzbVs0XTtcbiAgICAgICAgdG1bNV0gPSBzbVs1XTtcbiAgICAgICAgdG1bNl0gPSBzbVs2XTtcbiAgICAgICAgdG1bN10gPSBzbVs3XTtcbiAgICAgICAgdG1bOF0gPSBzbVs4XTtcbiAgICAgICAgdG1bOV0gPSBzbVs5XTtcbiAgICAgICAgdG1bMTBdID0gc21bMTBdO1xuICAgICAgICB0bVsxMV0gPSBzbVsxMV07XG4gICAgICAgIHRtWzEyXSA9IHNtWzEyXTtcbiAgICAgICAgdG1bMTNdID0gc21bMTNdO1xuICAgICAgICB0bVsxNF0gPSBzbVsxNF07XG4gICAgICAgIHRtWzE1XSA9IHNtWzE1XTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBDaGVjayB3aGV0aGVyIHR3byBtYXRyaXggZXF1YWxcbiAgICAgKiAhI3poIOW9k+WJjeeahOefqemYteaYr+WQpuS4juaMh+WumueahOefqemYteebuOetieOAglxuICAgICAqIEBtZXRob2QgZXF1YWxzXG4gICAgICogQHBhcmFtIHtNYXQ0fSBvdGhlclxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgZXF1YWxzIChvdGhlcikge1xuICAgICAgICByZXR1cm4gTWF0NC5zdHJpY3RFcXVhbHModGhpcywgb3RoZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2hlY2sgd2hldGhlciB0d28gbWF0cml4IGVxdWFsIHdpdGggZGVmYXVsdCBkZWdyZWUgb2YgdmFyaWFuY2UuXG4gICAgICogISN6aFxuICAgICAqIOi/keS8vOWIpOaWreS4pOS4quefqemYteaYr+WQpuebuOetieOAgjxici8+XG4gICAgICog5Yik5patIDIg5Liq55+p6Zi15piv5ZCm5Zyo6buY6K6k6K+v5beu6IyD5Zu05LmL5YaF77yM5aaC5p6c5Zyo5YiZ6L+U5ZueIHRydWXvvIzlj43kuYvliJnov5Tlm54gZmFsc2XjgIJcbiAgICAgKiBAbWV0aG9kIGZ1enp5RXF1YWxzXG4gICAgICogQHBhcmFtIHtNYXQ0fSBvdGhlclxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgZnV6enlFcXVhbHMgKG90aGVyKSB7XG4gICAgICAgIHJldHVybiBNYXQ0LmVxdWFscyh0aGlzLCBvdGhlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBUcmFuc2Zvcm0gdG8gc3RyaW5nIHdpdGggbWF0cml4IGluZm9ybWF0aW9uc1xuICAgICAqICEjemgg6L2s5o2i5Li65pa55L6/6ZiF6K+755qE5a2X56ym5Liy44CCXG4gICAgICogQG1ldGhvZCB0b1N0cmluZ1xuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICB0b1N0cmluZyAoKSB7XG4gICAgICAgIGxldCB0bSA9IHRoaXMubTtcbiAgICAgICAgaWYgKHRtKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJbXFxuXCIgK1xuICAgICAgICAgICAgICAgIHRtWzBdICsgXCIsIFwiICsgdG1bMV0gKyBcIiwgXCIgKyB0bVsyXSArIFwiLCBcIiArIHRtWzNdICsgXCIsXFxuXCIgK1xuICAgICAgICAgICAgICAgIHRtWzRdICsgXCIsIFwiICsgdG1bNV0gKyBcIiwgXCIgKyB0bVs2XSArIFwiLCBcIiArIHRtWzddICsgXCIsXFxuXCIgK1xuICAgICAgICAgICAgICAgIHRtWzhdICsgXCIsIFwiICsgdG1bOV0gKyBcIiwgXCIgKyB0bVsxMF0gKyBcIiwgXCIgKyB0bVsxMV0gKyBcIixcXG5cIiArXG4gICAgICAgICAgICAgICAgdG1bMTJdICsgXCIsIFwiICsgdG1bMTNdICsgXCIsIFwiICsgdG1bMTRdICsgXCIsIFwiICsgdG1bMTVdICsgXCJcXG5cIiArXG4gICAgICAgICAgICAgICAgXCJdXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gXCJbXFxuXCIgK1xuICAgICAgICAgICAgICAgIFwiMSwgMCwgMCwgMFxcblwiICtcbiAgICAgICAgICAgICAgICBcIjAsIDEsIDAsIDBcXG5cIiArXG4gICAgICAgICAgICAgICAgXCIwLCAwLCAxLCAwXFxuXCIgK1xuICAgICAgICAgICAgICAgIFwiMCwgMCwgMCwgMVxcblwiICtcbiAgICAgICAgICAgICAgICBcIl1cIjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgbWF0cml4IHRvIHRoZSBpZGVudGl0eSBtYXRyaXhcbiAgICAgKiBAbWV0aG9kIGlkZW50aXR5XG4gICAgICogQHJldHVybnMge01hdDR9IHNlbGZcbiAgICAgKiBAY2hhaW5hYmxlXG4gICAgICovXG4gICAgaWRlbnRpdHkgKCk6IHRoaXMge1xuICAgICAgICByZXR1cm4gTWF0NC5pZGVudGl0eSh0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmFuc3Bvc2UgdGhlIHZhbHVlcyBvZiBhIG1hdDRcbiAgICAgKiBAbWV0aG9kIHRyYW5zcG9zZVxuICAgICAqIEBwYXJhbSB7TWF0NH0gW291dF0gdGhlIHJlY2VpdmluZyBtYXRyaXgsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSBtYXRyaXggdG8gc2F2ZSByZXN1bHQgdG8gaXRzZWxmLCBpZiBub3QgcHJvdmlkZWQsIGEgbmV3IG1hdHJpeCB3aWxsIGJlIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMge01hdDR9IG91dFxuICAgICAqL1xuICAgIHRyYW5zcG9zZSAob3V0KSB7XG4gICAgICAgIG91dCA9IG91dCB8fCBuZXcgTWF0NCgpO1xuICAgICAgICByZXR1cm4gTWF0NC50cmFuc3Bvc2Uob3V0LCB0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZlcnRzIGEgbWF0NFxuICAgICAqIEBtZXRob2QgaW52ZXJ0XG4gICAgICogQHBhcmFtIHtNYXQ0fSBbb3V0XSB0aGUgcmVjZWl2aW5nIG1hdHJpeCwgeW91IGNhbiBwYXNzIHRoZSBzYW1lIG1hdHJpeCB0byBzYXZlIHJlc3VsdCB0byBpdHNlbGYsIGlmIG5vdCBwcm92aWRlZCwgYSBuZXcgbWF0cml4IHdpbGwgYmUgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyB7TWF0NH0gb3V0XG4gICAgICovXG4gICAgaW52ZXJ0IChvdXQpIHtcbiAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBNYXQ0KCk7XG4gICAgICAgIHJldHVybiBNYXQ0LmludmVydChvdXQsIHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGN1bGF0ZXMgdGhlIGFkanVnYXRlIG9mIGEgbWF0NFxuICAgICAqIEBtZXRob2QgYWRqb2ludFxuICAgICAqIEBwYXJhbSB7TWF0NH0gW291dF0gdGhlIHJlY2VpdmluZyBtYXRyaXgsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSBtYXRyaXggdG8gc2F2ZSByZXN1bHQgdG8gaXRzZWxmLCBpZiBub3QgcHJvdmlkZWQsIGEgbmV3IG1hdHJpeCB3aWxsIGJlIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMge01hdDR9IG91dFxuICAgICAqL1xuICAgIGFkam9pbnQgKG91dCkge1xuICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IE1hdDQoKTtcbiAgICAgICAgcmV0dXJuIE1hdDQuYWRqb2ludChvdXQsIHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGN1bGF0ZXMgdGhlIGRldGVybWluYW50IG9mIGEgbWF0NFxuICAgICAqIEBtZXRob2QgZGV0ZXJtaW5hbnRcbiAgICAgKiBAcmV0dXJucyB7TnVtYmVyfSBkZXRlcm1pbmFudCBvZiBhXG4gICAgICovXG4gICAgZGV0ZXJtaW5hbnQgKCkge1xuICAgICAgICByZXR1cm4gTWF0NC5kZXRlcm1pbmFudCh0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIHR3byBNYXQ0XG4gICAgICogQG1ldGhvZCBhZGRcbiAgICAgKiBAcGFyYW0ge01hdDR9IG90aGVyIHRoZSBzZWNvbmQgb3BlcmFuZFxuICAgICAqIEBwYXJhbSB7TWF0NH0gW291dF0gdGhlIHJlY2VpdmluZyBtYXRyaXgsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSBtYXRyaXggdG8gc2F2ZSByZXN1bHQgdG8gaXRzZWxmLCBpZiBub3QgcHJvdmlkZWQsIGEgbmV3IG1hdHJpeCB3aWxsIGJlIGNyZWF0ZWQuXG4gICAgICogQHJldHVybnMge01hdDR9IG91dFxuICAgICAqL1xuICAgIGFkZCAob3RoZXIsIG91dCkge1xuICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IE1hdDQoKTtcbiAgICAgICAgcmV0dXJuIE1hdDQuYWRkKG91dCwgdGhpcywgb3RoZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN1YnRyYWN0cyB0aGUgY3VycmVudCBtYXRyaXggd2l0aCBhbm90aGVyIG9uZVxuICAgICAqIEBtZXRob2Qgc3VidHJhY3RcbiAgICAgKiBAcGFyYW0ge01hdDR9IG90aGVyIHRoZSBzZWNvbmQgb3BlcmFuZFxuICAgICAqIEByZXR1cm5zIHtNYXQ0fSB0aGlzXG4gICAgICovXG4gICAgc3VidHJhY3QgKG90aGVyKTogdGhpcyB7XG4gICAgICAgIHJldHVybiBNYXQ0LnN1YnRyYWN0KHRoaXMsIHRoaXMsIG90aGVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdWJ0cmFjdHMgdGhlIGN1cnJlbnQgbWF0cml4IHdpdGggYW5vdGhlciBvbmVcbiAgICAgKiBAbWV0aG9kIG11bHRpcGx5XG4gICAgICogQHBhcmFtIHtNYXQ0fSBvdGhlciB0aGUgc2Vjb25kIG9wZXJhbmRcbiAgICAgKiBAcmV0dXJucyB7TWF0NH0gdGhpc1xuICAgICAqL1xuICAgIG11bHRpcGx5IChvdGhlcik6IHRoaXMge1xuICAgICAgICByZXR1cm4gTWF0NC5tdWx0aXBseSh0aGlzLCB0aGlzLCBvdGhlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTXVsdGlwbHkgZWFjaCBlbGVtZW50IG9mIHRoZSBtYXRyaXggYnkgYSBzY2FsYXIuXG4gICAgICogQG1ldGhvZCBtdWx0aXBseVNjYWxhclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBudW1iZXIgYW1vdW50IHRvIHNjYWxlIHRoZSBtYXRyaXgncyBlbGVtZW50cyBieVxuICAgICAqIEByZXR1cm5zIHtNYXQ0fSB0aGlzXG4gICAgICovXG4gICAgbXVsdGlwbHlTY2FsYXIgKG51bWJlcik6IHRoaXMge1xuICAgICAgICByZXR1cm4gTWF0NC5tdWx0aXBseVNjYWxhcih0aGlzLCB0aGlzLCBudW1iZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyYW5zbGF0ZSBhIG1hdDQgYnkgdGhlIGdpdmVuIHZlY3RvclxuICAgICAqIEBtZXRob2QgdHJhbnNsYXRlXG4gICAgICogQHBhcmFtIHtWZWMzfSB2IHZlY3RvciB0byB0cmFuc2xhdGUgYnlcbiAgICAgKiBAcGFyYW0ge01hdDR9IFtvdXRdIHRoZSByZWNlaXZpbmcgbWF0cml4LCB5b3UgY2FuIHBhc3MgdGhlIHNhbWUgbWF0cml4IHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyBtYXRyaXggd2lsbCBiZSBjcmVhdGVkXG4gICAgICogQHJldHVybnMge01hdDR9IG91dFxuICAgICAqL1xuICAgIHRyYW5zbGF0ZSAodiwgb3V0KSB7XG4gICAgICAgIG91dCA9IG91dCB8fCBuZXcgTWF0NCgpO1xuICAgICAgICByZXR1cm4gTWF0NC50cmFuc2xhdGUob3V0LCB0aGlzLCB2KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTY2FsZXMgdGhlIG1hdDQgYnkgdGhlIGRpbWVuc2lvbnMgaW4gdGhlIGdpdmVuIHZlYzNcbiAgICAgKiBAbWV0aG9kIHNjYWxlXG4gICAgICogQHBhcmFtIHtWZWMzfSB2IHZlY3RvciB0byBzY2FsZSBieVxuICAgICAqIEBwYXJhbSB7TWF0NH0gW291dF0gdGhlIHJlY2VpdmluZyBtYXRyaXgsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSBtYXRyaXggdG8gc2F2ZSByZXN1bHQgdG8gaXRzZWxmLCBpZiBub3QgcHJvdmlkZWQsIGEgbmV3IG1hdHJpeCB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgKiBAcmV0dXJucyB7TWF0NH0gb3V0XG4gICAgICovXG4gICAgc2NhbGUgKHYsIG91dCkge1xuICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IE1hdDQoKTtcbiAgICAgICAgcmV0dXJuIE1hdDQuc2NhbGUob3V0LCB0aGlzLCB2KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSb3RhdGVzIGEgbWF0NCBieSB0aGUgZ2l2ZW4gYW5nbGUgYXJvdW5kIHRoZSBnaXZlbiBheGlzXG4gICAgICogQG1ldGhvZCByb3RhdGVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcmFkIHRoZSBhbmdsZSB0byByb3RhdGUgdGhlIG1hdHJpeCBieVxuICAgICAqIEBwYXJhbSB7VmVjM30gYXhpcyB0aGUgYXhpcyB0byByb3RhdGUgYXJvdW5kXG4gICAgICogQHBhcmFtIHtNYXQ0fSBbb3V0XSB0aGUgcmVjZWl2aW5nIG1hdHJpeCwgeW91IGNhbiBwYXNzIHRoZSBzYW1lIG1hdHJpeCB0byBzYXZlIHJlc3VsdCB0byBpdHNlbGYsIGlmIG5vdCBwcm92aWRlZCwgYSBuZXcgbWF0cml4IHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm5zIHtNYXQ0fSBvdXRcbiAgICAgKi9cbiAgICByb3RhdGUgKHJhZCwgYXhpcywgb3V0KSB7XG4gICAgICAgIG91dCA9IG91dCB8fCBuZXcgTWF0NCgpO1xuICAgICAgICByZXR1cm4gTWF0NC5yb3RhdGUob3V0LCB0aGlzLCByYWQsIGF4aXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHRyYW5zbGF0aW9uIHZlY3RvciBjb21wb25lbnQgb2YgYSB0cmFuc2Zvcm1hdGlvbiBtYXRyaXguXG4gICAgICogQG1ldGhvZCBnZXRUcmFuc2xhdGlvblxuICAgICAqIEBwYXJhbSAge1ZlYzN9IG91dCBWZWN0b3IgdG8gcmVjZWl2ZSB0cmFuc2xhdGlvbiBjb21wb25lbnQsIGlmIG5vdCBwcm92aWRlZCwgYSBuZXcgdmVjMyB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgKiBAcmV0dXJuIHtWZWMzfSBvdXRcbiAgICAgKi9cbiAgICBnZXRUcmFuc2xhdGlvbiAob3V0KSB7XG4gICAgICAgIG91dCA9IG91dCB8fCBuZXcgVmVjMygpO1xuICAgICAgICByZXR1cm4gTWF0NC5nZXRUcmFuc2xhdGlvbihvdXQsIHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHNjYWxlIGZhY3RvciBjb21wb25lbnQgb2YgYSB0cmFuc2Zvcm1hdGlvbiBtYXRyaXhcbiAgICAgKiBAbWV0aG9kIGdldFNjYWxlXG4gICAgICogQHBhcmFtICB7VmVjM30gb3V0IFZlY3RvciB0byByZWNlaXZlIHNjYWxlIGNvbXBvbmVudCwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyB2ZWMzIHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm4ge1ZlYzN9IG91dFxuICAgICAqL1xuICAgIGdldFNjYWxlIChvdXQpIHtcbiAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBWZWMzKCk7XG4gICAgICAgIHJldHVybiBNYXQ0LmdldFNjYWxpbmcob3V0LCB0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSByb3RhdGlvbiBmYWN0b3IgY29tcG9uZW50IG9mIGEgdHJhbnNmb3JtYXRpb24gbWF0cml4XG4gICAgICogQG1ldGhvZCBnZXRSb3RhdGlvblxuICAgICAqIEBwYXJhbSAge1F1YXR9IG91dCBWZWN0b3IgdG8gcmVjZWl2ZSByb3RhdGlvbiBjb21wb25lbnQsIGlmIG5vdCBwcm92aWRlZCwgYSBuZXcgcXVhdGVybmlvbiBvYmplY3Qgd2lsbCBiZSBjcmVhdGVkXG4gICAgICogQHJldHVybiB7UXVhdH0gb3V0XG4gICAgICovXG4gICAgZ2V0Um90YXRpb24gKG91dCkge1xuICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IFF1YXQoKTtcbiAgICAgICAgcmV0dXJuIE1hdDQuZ2V0Um90YXRpb24ob3V0LCB0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXN0b3JlIHRoZSBtYXRyaXggdmFsdWVzIGZyb20gYSBxdWF0ZXJuaW9uIHJvdGF0aW9uLCB2ZWN0b3IgdHJhbnNsYXRpb24gYW5kIHZlY3RvciBzY2FsZVxuICAgICAqIEBtZXRob2QgZnJvbVJUU1xuICAgICAqIEBwYXJhbSB7UXVhdH0gcSBSb3RhdGlvbiBxdWF0ZXJuaW9uXG4gICAgICogQHBhcmFtIHtWZWMzfSB2IFRyYW5zbGF0aW9uIHZlY3RvclxuICAgICAqIEBwYXJhbSB7VmVjM30gcyBTY2FsaW5nIHZlY3RvclxuICAgICAqIEByZXR1cm5zIHtNYXQ0fSB0aGUgY3VycmVudCBtYXQ0IG9iamVjdFxuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKi9cbiAgICBmcm9tUlRTIChxLCB2LCBzKTogdGhpcyB7XG4gICAgICAgIHJldHVybiBNYXQ0LmZyb21SVFModGhpcywgcSwgdiwgcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzdG9yZSB0aGUgbWF0cml4IHZhbHVlcyBmcm9tIGEgcXVhdGVybmlvbiByb3RhdGlvblxuICAgICAqIEBtZXRob2QgZnJvbVF1YXRcbiAgICAgKiBAcGFyYW0ge1F1YXR9IHEgUm90YXRpb24gcXVhdGVybmlvblxuICAgICAqIEByZXR1cm5zIHtNYXQ0fSB0aGUgY3VycmVudCBtYXQ0IG9iamVjdFxuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKi9cbiAgICBmcm9tUXVhdCAocXVhdCk6IHRoaXMge1xuICAgICAgICByZXR1cm4gTWF0NC5mcm9tUXVhdCh0aGlzLCBxdWF0KTtcbiAgICB9XG59XG5cbmNvbnN0IHYzXzE6IFZlYzMgPSBuZXcgVmVjMygpO1xuY29uc3QgbTNfMTogTWF0MyA9IG5ldyBNYXQzKCk7XG5cbkNDQ2xhc3MuZmFzdERlZmluZSgnY2MuTWF0NCcsIE1hdDQsIHtcbiAgICBtMDA6IDEsIG0wMTogMCwgbTAyOiAwLCBtMDM6IDAsXG4gICAgbTA0OiAwLCBtMDU6IDEsIG0wNjogMCwgbTA3OiAwLFxuICAgIG0wODogMCwgbTA5OiAwLCBtMTA6IDEsIG0xMTogMCxcbiAgICBtMTI6IDAsIG0xMzogMCwgbTE0OiAwLCBtMTU6IDFcbn0pO1xuXG5mb3IgKGxldCBpID0gMDsgaSA8IDE2OyBpKyspIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWF0NC5wcm90b3R5cGUsICdtJyArIGksIHtcbiAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1baV07XG4gICAgICAgIH0sXG4gICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMubVtpXSA9IHZhbHVlO1xuICAgICAgICB9LFxuICAgIH0pO1xufVxuXG4vKipcbiAqIEBtb2R1bGUgY2NcbiAqL1xuXG4vKipcbiAqICEjZW4gVGhlIGNvbnZlbmllbmNlIG1ldGhvZCB0byBjcmVhdGUgYSBuZXcge3sjY3Jvc3NMaW5rIFwiTWF0NFwifX1jYy5NYXQ0e3svY3Jvc3NMaW5rfX0uXG4gKiAhI3poIOmAmui/h+ivpeeugOS+v+eahOWHveaVsOi/m+ihjOWIm+W7uiB7eyNjcm9zc0xpbmsgXCJNYXQ0XCJ9fWNjLk1hdDR7ey9jcm9zc0xpbmt9fSDlr7nosaHjgIJcbiAqIEBtZXRob2QgbWF0NFxuICogQHBhcmFtIHtOdW1iZXJ9IFttMDBdIENvbXBvbmVudCBpbiBjb2x1bW4gMCwgcm93IDAgcG9zaXRpb24gKGluZGV4IDApXG4gKiBAcGFyYW0ge051bWJlcn0gW20wMV0gQ29tcG9uZW50IGluIGNvbHVtbiAwLCByb3cgMSBwb3NpdGlvbiAoaW5kZXggMSlcbiAqIEBwYXJhbSB7TnVtYmVyfSBbbTAyXSBDb21wb25lbnQgaW4gY29sdW1uIDAsIHJvdyAyIHBvc2l0aW9uIChpbmRleCAyKVxuICogQHBhcmFtIHtOdW1iZXJ9IFttMDNdIENvbXBvbmVudCBpbiBjb2x1bW4gMCwgcm93IDMgcG9zaXRpb24gKGluZGV4IDMpXG4gKiBAcGFyYW0ge051bWJlcn0gW20xMF0gQ29tcG9uZW50IGluIGNvbHVtbiAxLCByb3cgMCBwb3NpdGlvbiAoaW5kZXggNClcbiAqIEBwYXJhbSB7TnVtYmVyfSBbbTExXSBDb21wb25lbnQgaW4gY29sdW1uIDEsIHJvdyAxIHBvc2l0aW9uIChpbmRleCA1KVxuICogQHBhcmFtIHtOdW1iZXJ9IFttMTJdIENvbXBvbmVudCBpbiBjb2x1bW4gMSwgcm93IDIgcG9zaXRpb24gKGluZGV4IDYpXG4gKiBAcGFyYW0ge051bWJlcn0gW20xM10gQ29tcG9uZW50IGluIGNvbHVtbiAxLCByb3cgMyBwb3NpdGlvbiAoaW5kZXggNylcbiAqIEBwYXJhbSB7TnVtYmVyfSBbbTIwXSBDb21wb25lbnQgaW4gY29sdW1uIDIsIHJvdyAwIHBvc2l0aW9uIChpbmRleCA4KVxuICogQHBhcmFtIHtOdW1iZXJ9IFttMjFdIENvbXBvbmVudCBpbiBjb2x1bW4gMiwgcm93IDEgcG9zaXRpb24gKGluZGV4IDkpXG4gKiBAcGFyYW0ge051bWJlcn0gW20yMl0gQ29tcG9uZW50IGluIGNvbHVtbiAyLCByb3cgMiBwb3NpdGlvbiAoaW5kZXggMTApXG4gKiBAcGFyYW0ge051bWJlcn0gW20yM10gQ29tcG9uZW50IGluIGNvbHVtbiAyLCByb3cgMyBwb3NpdGlvbiAoaW5kZXggMTEpXG4gKiBAcGFyYW0ge051bWJlcn0gW20zMF0gQ29tcG9uZW50IGluIGNvbHVtbiAzLCByb3cgMCBwb3NpdGlvbiAoaW5kZXggMTIpXG4gKiBAcGFyYW0ge051bWJlcn0gW20zMV0gQ29tcG9uZW50IGluIGNvbHVtbiAzLCByb3cgMSBwb3NpdGlvbiAoaW5kZXggMTMpXG4gKiBAcGFyYW0ge051bWJlcn0gW20zMl0gQ29tcG9uZW50IGluIGNvbHVtbiAzLCByb3cgMiBwb3NpdGlvbiAoaW5kZXggMTQpXG4gKiBAcGFyYW0ge051bWJlcn0gW20zM10gQ29tcG9uZW50IGluIGNvbHVtbiAzLCByb3cgMyBwb3NpdGlvbiAoaW5kZXggMTUpXG4gKiBAcmV0dXJuIHtNYXQ0fVxuICovXG5jYy5tYXQ0ID0gZnVuY3Rpb24gKG0wMCwgbTAxLCBtMDIsIG0wMywgbTEwLCBtMTEsIG0xMiwgbTEzLCBtMjAsIG0yMSwgbTIyLCBtMjMsIG0zMCwgbTMxLCBtMzIsIG0zMykge1xuICAgIGxldCBtYXQgPSBuZXcgTWF0NChtMDAsIG0wMSwgbTAyLCBtMDMsIG0xMCwgbTExLCBtMTIsIG0xMywgbTIwLCBtMjEsIG0yMiwgbTIzLCBtMzAsIG0zMSwgbTMyLCBtMzMpO1xuICAgIGlmIChtMDAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBNYXQ0LmlkZW50aXR5KG1hdCk7XG4gICAgfVxuICAgIHJldHVybiBtYXQ7XG59O1xuXG5jYy5NYXQ0ID0gTWF0NDtcbiJdfQ==