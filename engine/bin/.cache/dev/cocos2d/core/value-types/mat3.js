
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/value-types/mat3.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _utils = require("../value-types/utils");

var _vec = _interopRequireDefault(require("./vec3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Mathematical 3x3 matrix.
 *
 * NOTE: we use column-major matrix for all matrix calculation.
 *
 * This may lead to some confusion when referencing OpenGL documentation,
 * however, which represents out all matricies in column-major format.
 * This means that while in code a matrix may be typed out as:
 *
 * [1, 0, 0, 0,
 *  0, 1, 0, 0,
 *  0, 0, 1, 0,
 *  x, y, z, 0]
 *
 * The same matrix in the [OpenGL documentation](https://www.khronos.org/registry/OpenGL-Refpages/gl2.1/xhtml/glTranslate.xml)
 * is written as:
 *
 *  1 0 0 x
 *  0 1 0 y
 *  0 0 1 z
 *  0 0 0 0
 *
 * Please rest assured, however, that they are the same thing!
 * This is not unique to glMatrix, either, as OpenGL developers have long been confused by the
 * apparent lack of consistency between the memory layout and the documentation.
 */
var Mat3 =
/*#__PURE__*/
function () {
  /**
   * Identity  of Mat3
   * @property {Mat3} IDENTITY
   * @static
   */

  /**
   * Creates a matrix, with elements specified separately.
   *
   * @param {Number} m00 - Value assigned to element at column 0 row 0.
   * @param {Number} m01 - Value assigned to element at column 0 row 1.
   * @param {Number} m02 - Value assigned to element at column 0 row 2.
   * @param {Number} m03 - Value assigned to element at column 1 row 0.
   * @param {Number} m04 - Value assigned to element at column 1 row 1.
   * @param {Number} m05 - Value assigned to element at column 1 row 2.
   * @param {Number} m06 - Value assigned to element at column 2 row 0.
   * @param {Number} m07 - Value assigned to element at column 2 row 1.
   * @param {Number} m08 - Value assigned to element at column 2 row 2.
   * @returns {Mat3} The newly created matrix.
   * @static
   */
  Mat3.create = function create(m00, m01, m02, m03, m04, m05, m06, m07, m08) {
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

    if (m04 === void 0) {
      m04 = 1;
    }

    if (m05 === void 0) {
      m05 = 0;
    }

    if (m06 === void 0) {
      m06 = 0;
    }

    if (m07 === void 0) {
      m07 = 0;
    }

    if (m08 === void 0) {
      m08 = 1;
    }

    return new Mat3(m00, m01, m02, m03, m04, m05, m06, m07, m08);
  }
  /**
   * Clone a matrix.
   *
   * @param {Mat3} a - Matrix to clone.
   * @returns {Mat3} The newly created matrix.
   * @static
   */
  ;

  Mat3.clone = function clone(a) {
    var am = a.m;
    return new Mat3(am[0], am[1], am[2], am[3], am[4], am[5], am[6], am[7], am[8]);
  }
  /**
   * Copy content of a matrix into another.
   *
   * @param {Mat3} out - Matrix to modified.
   * @param {Mat3} a - The specified matrix.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.copy = function copy(out, a) {
    out.m.set(a.m);
    return out;
  }
  /**
   * Sets the elements of a matrix to the given values.
   *
   * @param {Mat3} out - The matrix to modified.
   * @param {Number} m00 - Value assigned to element at column 0 row 0.
   * @param {Number} m01 - Value assigned to element at column 0 row 1.
   * @param {Number} m02 - Value assigned to element at column 0 row 2.
   * @param {Number} m10 - Value assigned to element at column 1 row 0.
   * @param {Number} m11 - Value assigned to element at column 1 row 1.
   * @param {Number} m12 - Value assigned to element at column 1 row 2.
   * @param {Number} m20 - Value assigned to element at column 2 row 0.
   * @param {Number} m21 - Value assigned to element at column 2 row 1.
   * @param {Number} m22 - Value assigned to element at column 2 row 2.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.set = function set(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
    var outm = out.m;
    outm[0] = m00;
    outm[1] = m01;
    outm[2] = m02;
    outm[3] = m10;
    outm[4] = m11;
    outm[5] = m12;
    outm[6] = m20;
    outm[7] = m21;
    outm[8] = m22;
    return out;
  }
  /**
   * return an identity matrix.
   *
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.identity = function identity(out) {
    var outm = out.m;
    outm[0] = 1;
    outm[1] = 0;
    outm[2] = 0;
    outm[3] = 0;
    outm[4] = 1;
    outm[5] = 0;
    outm[6] = 0;
    outm[7] = 0;
    outm[8] = 1;
    return out;
  }
  /**
   * Transposes a matrix.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {Mat3} a - Matrix to transpose.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.transpose = function transpose(out, a) {
    var am = a.m,
        outm = out.m; // If we are transposing ourselves we can skip a few steps but have to cache some values

    if (out === a) {
      var a01 = am[1],
          a02 = am[2],
          a12 = am[5];
      outm[1] = am[3];
      outm[2] = am[6];
      outm[3] = a01;
      outm[5] = am[7];
      outm[6] = a02;
      outm[7] = a12;
    } else {
      outm[0] = am[0];
      outm[1] = am[3];
      outm[2] = am[6];
      outm[3] = am[1];
      outm[4] = am[4];
      outm[5] = am[7];
      outm[6] = am[2];
      outm[7] = am[5];
      outm[8] = am[8];
    }

    return out;
  }
  /**
   * Inverts a matrix.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {Mat3} a - Matrix to invert.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.invert = function invert(out, a) {
    var am = a.m,
        outm = out.m;
    var a00 = am[0],
        a01 = am[1],
        a02 = am[2],
        a10 = am[3],
        a11 = am[4],
        a12 = am[5],
        a20 = am[6],
        a21 = am[7],
        a22 = am[8];
    var b01 = a22 * a11 - a12 * a21;
    var b11 = -a22 * a10 + a12 * a20;
    var b21 = a21 * a10 - a11 * a20; // Calculate the determinant

    var det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) {
      return out;
    }

    det = 1.0 / det;
    outm[0] = b01 * det;
    outm[1] = (-a22 * a01 + a02 * a21) * det;
    outm[2] = (a12 * a01 - a02 * a11) * det;
    outm[3] = b11 * det;
    outm[4] = (a22 * a00 - a02 * a20) * det;
    outm[5] = (-a12 * a00 + a02 * a10) * det;
    outm[6] = b21 * det;
    outm[7] = (-a21 * a00 + a01 * a20) * det;
    outm[8] = (a11 * a00 - a01 * a10) * det;
    return out;
  }
  /**
   * Calculates the adjugate of a matrix.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {Mat3} a - Matrix to calculate.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.adjoint = function adjoint(out, a) {
    var am = a.m,
        outm = out.m;
    var a00 = am[0],
        a01 = am[1],
        a02 = am[2],
        a10 = am[3],
        a11 = am[4],
        a12 = am[5],
        a20 = am[6],
        a21 = am[7],
        a22 = am[8];
    outm[0] = a11 * a22 - a12 * a21;
    outm[1] = a02 * a21 - a01 * a22;
    outm[2] = a01 * a12 - a02 * a11;
    outm[3] = a12 * a20 - a10 * a22;
    outm[4] = a00 * a22 - a02 * a20;
    outm[5] = a02 * a10 - a00 * a12;
    outm[6] = a10 * a21 - a11 * a20;
    outm[7] = a01 * a20 - a00 * a21;
    outm[8] = a00 * a11 - a01 * a10;
    return out;
  }
  /**
   * Calculates the determinant of a matrix.
   *
   * @param {Mat3} a - Matrix to calculate.
   * @returns {Number} Determinant of a.
   * @static
   */
  ;

  Mat3.determinant = function determinant(a) {
    var am = a.m;
    var a00 = am[0],
        a01 = am[1],
        a02 = am[2],
        a10 = am[3],
        a11 = am[4],
        a12 = am[5],
        a20 = am[6],
        a21 = am[7],
        a22 = am[8];
    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
  }
  /**
   * Multiply two matrices explicitly.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {Mat3} a - The first operand.
   * @param {Mat3} b - The second operand.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.multiply = function multiply(out, a, b) {
    var am = a.m,
        bm = b.m,
        outm = out.m;
    var a00 = am[0],
        a01 = am[1],
        a02 = am[2],
        a10 = am[3],
        a11 = am[4],
        a12 = am[5],
        a20 = am[6],
        a21 = am[7],
        a22 = am[8];
    var b00 = bm[0],
        b01 = bm[1],
        b02 = bm[2];
    var b10 = bm[3],
        b11 = bm[4],
        b12 = bm[5];
    var b20 = bm[6],
        b21 = bm[7],
        b22 = bm[8];
    outm[0] = b00 * a00 + b01 * a10 + b02 * a20;
    outm[1] = b00 * a01 + b01 * a11 + b02 * a21;
    outm[2] = b00 * a02 + b01 * a12 + b02 * a22;
    outm[3] = b10 * a00 + b11 * a10 + b12 * a20;
    outm[4] = b10 * a01 + b11 * a11 + b12 * a21;
    outm[5] = b10 * a02 + b11 * a12 + b12 * a22;
    outm[6] = b20 * a00 + b21 * a10 + b22 * a20;
    outm[7] = b20 * a01 + b21 * a11 + b22 * a21;
    outm[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
  }
  /**
   * !#en Take the first third order of the fourth order matrix and multiply by the third order matrix
   * !#zh 取四阶矩阵的前三阶，与三阶矩阵相乘
   * @param {Mat3} out - Matrix to store result.
   * @param {Mat3} a - The first operand.
   * @param {Mat3} b - The second operand.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.multiplyMat4 = function multiplyMat4(out, a, b) {
    var am = a.m,
        bm = b.m,
        outm = out.m;
    var a00 = am[0],
        a01 = am[1],
        a02 = am[2],
        a10 = am[3],
        a11 = am[4],
        a12 = am[5],
        a20 = am[6],
        a21 = am[7],
        a22 = am[8];
    var b00 = bm[0],
        b01 = bm[1],
        b02 = bm[2];
    var b10 = bm[4],
        b11 = bm[5],
        b12 = bm[6];
    var b20 = bm[8],
        b21 = bm[9],
        b22 = bm[10];
    outm[0] = b00 * a00 + b01 * a10 + b02 * a20;
    outm[1] = b00 * a01 + b01 * a11 + b02 * a21;
    outm[2] = b00 * a02 + b01 * a12 + b02 * a22;
    outm[3] = b10 * a00 + b11 * a10 + b12 * a20;
    outm[4] = b10 * a01 + b11 * a11 + b12 * a21;
    outm[5] = b10 * a02 + b11 * a12 + b12 * a22;
    outm[6] = b20 * a00 + b21 * a10 + b22 * a20;
    outm[7] = b20 * a01 + b21 * a11 + b22 * a21;
    outm[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
  }
  /**
   * Multiply a matrix with a translation matrix given by a translation offset.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {Mat3} a - Matrix to multiply.
   * @param {vec2} v - The translation offset.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.translate = function translate(out, a, v) {
    var am = a.m,
        outm = out.m;
    var a00 = am[0],
        a01 = am[1],
        a02 = am[2],
        a10 = am[3],
        a11 = am[4],
        a12 = am[5],
        a20 = am[6],
        a21 = am[7],
        a22 = am[8];
    var x = v.x,
        y = v.y;
    outm[0] = a00;
    outm[1] = a01;
    outm[2] = a02;
    outm[3] = a10;
    outm[4] = a11;
    outm[5] = a12;
    outm[6] = x * a00 + y * a10 + a20;
    outm[7] = x * a01 + y * a11 + a21;
    outm[8] = x * a02 + y * a12 + a22;
    return out;
  }
  /**
   * Rotates a matrix by the given angle.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {Mat3} a - Matrix to rotate.
   * @param {Number} rad - The rotation angle.
   * @returns {Mat3} out
   * @static
   */
  ;

  Mat3.rotate = function rotate(out, a, rad) {
    var am = a.m,
        outm = out.m;
    var a00 = am[0],
        a01 = am[1],
        a02 = am[2],
        a10 = am[3],
        a11 = am[4],
        a12 = am[5],
        a20 = am[6],
        a21 = am[7],
        a22 = am[8];
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    outm[0] = c * a00 + s * a10;
    outm[1] = c * a01 + s * a11;
    outm[2] = c * a02 + s * a12;
    outm[3] = c * a10 - s * a00;
    outm[4] = c * a11 - s * a01;
    outm[5] = c * a12 - s * a02;
    outm[6] = a20;
    outm[7] = a21;
    outm[8] = a22;
    return out;
  }
  /**
   * Multiply a matrix with a scale matrix given by a scale vector.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {Mat3} a - Matrix to multiply.
   * @param {vec2} v - The scale vector.
   * @returns {Mat3} out
   **/
  ;

  Mat3.scale = function scale(out, a, v) {
    var x = v.x,
        y = v.y;
    var am = a.m,
        outm = out.m;
    outm[0] = x * am[0];
    outm[1] = x * am[1];
    outm[2] = x * am[2];
    outm[3] = y * am[3];
    outm[4] = y * am[4];
    outm[5] = y * am[5];
    outm[6] = am[6];
    outm[7] = am[7];
    outm[8] = am[8];
    return out;
  }
  /**
   * Copies the upper-left 3x3 values of a 4x4 matrix into a 3x3 matrix.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {mat4} a - The 4x4 matrix.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.fromMat4 = function fromMat4(out, a) {
    var am = a.m,
        outm = out.m;
    outm[0] = am[0];
    outm[1] = am[1];
    outm[2] = am[2];
    outm[3] = am[4];
    outm[4] = am[5];
    outm[5] = am[6];
    outm[6] = am[8];
    outm[7] = am[9];
    outm[8] = am[10];
    return out;
  }
  /**
   * Creates a matrix from a translation offset.
   * This is equivalent to (but much faster than):
   *
   *     mat3.identity(dest);
   *     mat3.translate(dest, dest, vec);
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {vec2} v - The translation offset.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.fromTranslation = function fromTranslation(out, v) {
    var outm = out.m;
    outm[0] = 1;
    outm[1] = 0;
    outm[2] = 0;
    outm[3] = 0;
    outm[4] = 1;
    outm[5] = 0;
    outm[6] = v.x;
    outm[7] = v.y;
    outm[8] = 1;
    return out;
  }
  /**
   * Creates a matrix from a given angle.
   * This is equivalent to (but much faster than):
   *
   *     mat3.identity(dest);
   *     mat3.rotate(dest, dest, rad);
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {Number} rad - The rotation angle.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.fromRotation = function fromRotation(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad);
    var outm = out.m;
    outm[0] = c;
    outm[1] = s;
    outm[2] = 0;
    outm[3] = -s;
    outm[4] = c;
    outm[5] = 0;
    outm[6] = 0;
    outm[7] = 0;
    outm[8] = 1;
    return out;
  }
  /**
   * Creates a matrix from a scale vector.
   * This is equivalent to (but much faster than):
   *
   *     mat3.identity(dest);
   *     mat3.scale(dest, dest, vec);
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {vec2} v - Scale vector.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.fromScaling = function fromScaling(out, v) {
    var outm = out.m;
    outm[0] = v.x;
    outm[1] = 0;
    outm[2] = 0;
    outm[3] = 0;
    outm[4] = v.y;
    outm[5] = 0;
    outm[6] = 0;
    outm[7] = 0;
    outm[8] = 1;
    return out;
  }
  /**
   * Calculates a 3x3 matrix from the given quaternion.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {quat} q - The quaternion.
   *
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.fromQuat = function fromQuat(out, q) {
    var outm = out.m;
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
    outm[0] = 1 - yy - zz;
    outm[3] = yx - wz;
    outm[6] = zx + wy;
    outm[1] = yx + wz;
    outm[4] = 1 - xx - zz;
    outm[7] = zy - wx;
    outm[2] = zx - wy;
    outm[5] = zy + wx;
    outm[8] = 1 - xx - yy;
    return out;
  }
  /**
   * Calculates a 3x3 matrix from view direction and up direction.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {vec3} view - View direction (must be normalized).
   * @param {vec3} [up] - Up direction, default is (0,1,0) (must be normalized).
   *
   * @returns {Mat3} out
   * @static
   */
  ;

  Mat3.fromViewUp = function fromViewUp(out, view, up) {
    var _fromViewUpIIFE = function () {
      var default_up = new _vec["default"](0, 1, 0);
      var x = new _vec["default"]();
      var y = new _vec["default"]();
      return function (out, view, up) {
        if (_vec["default"].lengthSqr(view) < _utils.EPSILON * _utils.EPSILON) {
          Mat3.identity(out);
          return out;
        }

        up = up || default_up;

        _vec["default"].normalize(x, _vec["default"].cross(x, up, view));

        if (_vec["default"].lengthSqr(x) < _utils.EPSILON * _utils.EPSILON) {
          Mat3.identity(out);
          return out;
        }

        _vec["default"].cross(y, view, x);

        Mat3.set(out, x.x, x.y, x.z, y.x, y.y, y.z, view.x, view.y, view.z);
        return out;
      };
    }();

    return _fromViewUpIIFE(out, view, up);
  }
  /**
   * Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {mat4} a - A 4x4 matrix to derive the normal matrix from.
   *
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.normalFromMat4 = function normalFromMat4(out, a) {
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
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

    var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
      return out;
    }

    det = 1.0 / det;
    outm[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    outm[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    outm[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    outm[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    outm[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    outm[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    outm[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    outm[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    outm[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    return out;
  }
  /**
   * Returns Frobenius norm of a matrix.
   *
   * @param {Mat3} a - Matrix to calculate Frobenius norm of.
   * @returns {Number} - The frobenius norm.
   * @static
   */
  ;

  Mat3.frob = function frob(a) {
    var am = a.m;
    return Math.sqrt(Math.pow(am[0], 2) + Math.pow(am[1], 2) + Math.pow(am[2], 2) + Math.pow(am[3], 2) + Math.pow(am[4], 2) + Math.pow(am[5], 2) + Math.pow(am[6], 2) + Math.pow(am[7], 2) + Math.pow(am[8], 2));
  }
  /**
   * Adds two matrices.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {Mat3} a - The first operand.
   * @param {Mat3} b - The second operand.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.add = function add(out, a, b) {
    var am = a.m,
        bm = b.m,
        outm = out.m;
    outm[0] = am[0] + bm[0];
    outm[1] = am[1] + bm[1];
    outm[2] = am[2] + bm[2];
    outm[3] = am[3] + bm[3];
    outm[4] = am[4] + bm[4];
    outm[5] = am[5] + bm[5];
    outm[6] = am[6] + bm[6];
    outm[7] = am[7] + bm[7];
    outm[8] = am[8] + bm[8];
    return out;
  }
  /**
   * Subtracts matrix b from matrix a.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {Mat3} a - The first operand.
   * @param {Mat3} b - The second operand.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.subtract = function subtract(out, a, b) {
    var am = a.m,
        bm = b.m,
        outm = out.m;
    outm[0] = am[0] - bm[0];
    outm[1] = am[1] - bm[1];
    outm[2] = am[2] - bm[2];
    outm[3] = am[3] - bm[3];
    outm[4] = am[4] - bm[4];
    outm[5] = am[5] - bm[5];
    outm[6] = am[6] - bm[6];
    outm[7] = am[7] - bm[7];
    outm[8] = am[8] - bm[8];
    return out;
  }
  /**
   * Multiply each element of a matrix by a scalar number.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {Mat3} a - Matrix to scale
   * @param {Number} b - The scale number.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.multiplyScalar = function multiplyScalar(out, a, b) {
    var am = a.m,
        outm = out.m;
    outm[0] = am[0] * b;
    outm[1] = am[1] * b;
    outm[2] = am[2] * b;
    outm[3] = am[3] * b;
    outm[4] = am[4] * b;
    outm[5] = am[5] * b;
    outm[6] = am[6] * b;
    outm[7] = am[7] * b;
    outm[8] = am[8] * b;
    return out;
  }
  /**
   * Adds two matrices after multiplying each element of the second operand by a scalar number.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {Mat3} a - The first operand.
   * @param {Mat3} b - The second operand.
   * @param {Number} scale - The scale number.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.multiplyScalarAndAdd = function multiplyScalarAndAdd(out, a, b, scale) {
    var am = a.m,
        bm = b.m,
        outm = out.m;
    outm[0] = am[0] + bm[0] * scale;
    outm[1] = am[1] + bm[1] * scale;
    outm[2] = am[2] + bm[2] * scale;
    outm[3] = am[3] + bm[3] * scale;
    outm[4] = am[4] + bm[4] * scale;
    outm[5] = am[5] + bm[5] * scale;
    outm[6] = am[6] + bm[6] * scale;
    outm[7] = am[7] + bm[7] * scale;
    outm[8] = am[8] + bm[8] * scale;
    return out;
  }
  /**
   * Returns whether the specified matrices are equal. (Compared using ===)
   *
   * @param {Mat3} a - The first matrix.
   * @param {Mat3} b - The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   * @static
   */
  ;

  Mat3.exactEquals = function exactEquals(a, b) {
    var am = a.m,
        bm = b.m;
    return am[0] === bm[0] && am[1] === bm[1] && am[2] === bm[2] && am[3] === bm[3] && am[4] === bm[4] && am[5] === bm[5] && am[6] === bm[6] && am[7] === bm[7] && am[8] === bm[8];
  }
  /**
   * Returns whether the specified matrices are approximately equal.
   *
   * @param {Mat3} a - The first matrix.
   * @param {Mat3} b - The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   * @static
   */
  ;

  Mat3.equals = function equals(a, b) {
    var am = a.m,
        bm = b.m;
    var a0 = am[0],
        a1 = am[1],
        a2 = am[2],
        a3 = am[3],
        a4 = am[4],
        a5 = am[5],
        a6 = am[6],
        a7 = am[7],
        a8 = am[8];
    var b0 = bm[0],
        b1 = bm[1],
        b2 = bm[2],
        b3 = bm[3],
        b4 = bm[4],
        b5 = bm[5],
        b6 = bm[6],
        b7 = bm[7],
        b8 = bm[8];
    return Math.abs(a0 - b0) <= _utils.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _utils.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _utils.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= _utils.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= _utils.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= _utils.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= _utils.EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= _utils.EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= _utils.EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8));
  }
  /**
   * !#zh 矩阵转数组
   * !#en Matrix transpose array
   * @method toArray
   * @typescript
   * static toArray <Out extends IWritableArrayLike<number>> (out: Out, mat: IMat3Like, ofs = 0)
   * @param ofs 数组内的起始偏移量
   */
  ;

  Mat3.toArray = function toArray(out, mat, ofs) {
    if (ofs === void 0) {
      ofs = 0;
    }

    var m = mat.m;

    for (var i = 0; i < 9; i++) {
      out[ofs + i] = m[i];
    }

    return out;
  }
  /**
   * !#zh 数组转矩阵
   * !#en Transfer matrix array
   * @method fromArray
   * @typescript
   * static fromArray <Out extends IMat3Like> (out: Out, arr: IWritableArrayLike<number>, ofs = 0)
   * @param ofs 数组起始偏移量
   */
  ;

  Mat3.fromArray = function fromArray(out, arr, ofs) {
    if (ofs === void 0) {
      ofs = 0;
    }

    var m = out.m;

    for (var i = 0; i < 9; i++) {
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
   * Creates a matrix, with elements specified separately.
   *
   * @method constructor
   * @typescript
   * constructor (
          m00: number | Float32Array = 1, m01 = 0, m02 = 0,
          m03 = 0, m04 = 1, m05 = 0,
          m06 = 0, m07 = 0, m08 = 1
      )
   */
  function Mat3(m00, m01, m02, m03, m04, m05, m06, m07, m08) {
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

    if (m04 === void 0) {
      m04 = 1;
    }

    if (m05 === void 0) {
      m05 = 0;
    }

    if (m06 === void 0) {
      m06 = 0;
    }

    if (m07 === void 0) {
      m07 = 0;
    }

    if (m08 === void 0) {
      m08 = 1;
    }

    this.m = void 0;

    if (m00 instanceof _utils.FLOAT_ARRAY_TYPE) {
      this.m = m00;
    } else {
      this.m = new _utils.FLOAT_ARRAY_TYPE(9);
      var m = this.m;
      /**
       * The element at column 0 row 0.
       * @type {number}
       * */

      m[0] = m00;
      /**
       * The element at column 0 row 1.
       * @type {number}
       * */

      m[1] = m01;
      /**
       * The element at column 0 row 2.
       * @type {number}
       * */

      m[2] = m02;
      /**
       * The element at column 1 row 0.
       * @type {number}
       * */

      m[3] = m03;
      /**
       * The element at column 1 row 1.
       * @type {number}
       * */

      m[4] = m04;
      /**
       * The element at column 1 row 2.
       * @type {number}
       * */

      m[5] = m05;
      /**
       * The element at column 2 row 0.
       * @type {number}
       * */

      m[6] = m06;
      /**
       * The element at column 2 row 1.
       * @type {number}
       * */

      m[7] = m07;
      /**
       * The element at column 2 row 2.
       * @type {number}
       * */

      m[8] = m08;
    }
  }
  /**
   * Returns a string representation of a matrix.
   *
   * @param {Mat3} a - The matrix.
   * @returns {String} String representation of this matrix.
   */


  var _proto = Mat3.prototype;

  _proto.toString = function toString() {
    var am = this.m;
    return "mat3(" + am[0] + ", " + am[1] + ", " + am[2] + ", " + am[3] + ", " + am[4] + ", " + am[5] + ", " + am[6] + ", " + am[7] + ", " + am[8] + ")";
  };

  return Mat3;
}();

exports["default"] = Mat3;
Mat3.sub = Mat3.subtract;
Mat3.mul = Mat3.multiply;
Mat3.IDENTITY = Object.freeze(new Mat3());
cc.Mat3 = Mat3;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hdDMudHMiXSwibmFtZXMiOlsiTWF0MyIsImNyZWF0ZSIsIm0wMCIsIm0wMSIsIm0wMiIsIm0wMyIsIm0wNCIsIm0wNSIsIm0wNiIsIm0wNyIsIm0wOCIsImNsb25lIiwiYSIsImFtIiwibSIsImNvcHkiLCJvdXQiLCJzZXQiLCJtMTAiLCJtMTEiLCJtMTIiLCJtMjAiLCJtMjEiLCJtMjIiLCJvdXRtIiwiaWRlbnRpdHkiLCJ0cmFuc3Bvc2UiLCJhMDEiLCJhMDIiLCJhMTIiLCJpbnZlcnQiLCJhMDAiLCJhMTAiLCJhMTEiLCJhMjAiLCJhMjEiLCJhMjIiLCJiMDEiLCJiMTEiLCJiMjEiLCJkZXQiLCJhZGpvaW50IiwiZGV0ZXJtaW5hbnQiLCJtdWx0aXBseSIsImIiLCJibSIsImIwMCIsImIwMiIsImIxMCIsImIxMiIsImIyMCIsImIyMiIsIm11bHRpcGx5TWF0NCIsInRyYW5zbGF0ZSIsInYiLCJ4IiwieSIsInJvdGF0ZSIsInJhZCIsInMiLCJNYXRoIiwic2luIiwiYyIsImNvcyIsInNjYWxlIiwiZnJvbU1hdDQiLCJmcm9tVHJhbnNsYXRpb24iLCJmcm9tUm90YXRpb24iLCJmcm9tU2NhbGluZyIsImZyb21RdWF0IiwicSIsInoiLCJ3IiwieDIiLCJ5MiIsInoyIiwieHgiLCJ5eCIsInl5IiwiengiLCJ6eSIsInp6Iiwid3giLCJ3eSIsInd6IiwiZnJvbVZpZXdVcCIsInZpZXciLCJ1cCIsIl9mcm9tVmlld1VwSUlGRSIsImRlZmF1bHRfdXAiLCJWZWMzIiwibGVuZ3RoU3FyIiwiRVBTSUxPTiIsIm5vcm1hbGl6ZSIsImNyb3NzIiwibm9ybWFsRnJvbU1hdDQiLCJhMDMiLCJhMTMiLCJhMjMiLCJhMzAiLCJhMzEiLCJhMzIiLCJhMzMiLCJiMDMiLCJiMDQiLCJiMDUiLCJiMDYiLCJiMDciLCJiMDgiLCJiMDkiLCJmcm9iIiwic3FydCIsInBvdyIsImFkZCIsInN1YnRyYWN0IiwibXVsdGlwbHlTY2FsYXIiLCJtdWx0aXBseVNjYWxhckFuZEFkZCIsImV4YWN0RXF1YWxzIiwiZXF1YWxzIiwiYTAiLCJhMSIsImEyIiwiYTMiLCJhNCIsImE1IiwiYTYiLCJhNyIsImE4IiwiYjAiLCJiMSIsImIyIiwiYjMiLCJiNCIsImI1IiwiYjYiLCJiNyIsImI4IiwiYWJzIiwibWF4IiwidG9BcnJheSIsIm1hdCIsIm9mcyIsImkiLCJmcm9tQXJyYXkiLCJhcnIiLCJGTE9BVF9BUlJBWV9UWVBFIiwidG9TdHJpbmciLCJzdWIiLCJtdWwiLCJJREVOVElUWSIsIk9iamVjdCIsImZyZWV6ZSIsImNjIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFNQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUEwQnFCQTs7O0FBSWpCOzs7Ozs7QUFPQTs7Ozs7Ozs7Ozs7Ozs7O09BZU9DLFNBQVAsZ0JBQWVDLEdBQWYsRUFBZ0NDLEdBQWhDLEVBQWlEQyxHQUFqRCxFQUFrRUMsR0FBbEUsRUFBbUZDLEdBQW5GLEVBQW9HQyxHQUFwRyxFQUFxSEMsR0FBckgsRUFBc0lDLEdBQXRJLEVBQXVKQyxHQUF2SixFQUE4SztBQUFBLFFBQS9KUixHQUErSjtBQUEvSkEsTUFBQUEsR0FBK0osR0FBakosQ0FBaUo7QUFBQTs7QUFBQSxRQUE5SUMsR0FBOEk7QUFBOUlBLE1BQUFBLEdBQThJLEdBQWhJLENBQWdJO0FBQUE7O0FBQUEsUUFBN0hDLEdBQTZIO0FBQTdIQSxNQUFBQSxHQUE2SCxHQUEvRyxDQUErRztBQUFBOztBQUFBLFFBQTVHQyxHQUE0RztBQUE1R0EsTUFBQUEsR0FBNEcsR0FBOUYsQ0FBOEY7QUFBQTs7QUFBQSxRQUEzRkMsR0FBMkY7QUFBM0ZBLE1BQUFBLEdBQTJGLEdBQTdFLENBQTZFO0FBQUE7O0FBQUEsUUFBMUVDLEdBQTBFO0FBQTFFQSxNQUFBQSxHQUEwRSxHQUE1RCxDQUE0RDtBQUFBOztBQUFBLFFBQXpEQyxHQUF5RDtBQUF6REEsTUFBQUEsR0FBeUQsR0FBM0MsQ0FBMkM7QUFBQTs7QUFBQSxRQUF4Q0MsR0FBd0M7QUFBeENB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LENBQUMsQ0FBQ0UsQ0FBWDtBQUFBLFFBQWMrQixFQUFFLEdBQUdELENBQUMsQ0FBQzlCLENBQXJCO0FBQUEsUUFBd0JVLElBQUksR0FBR1IsR0FBRyxDQUFDRixDQUFuQztBQUNBVSxJQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVYLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUWdDLEVBQUUsQ0FBQyxDQUFELENBQXBCO0FBQ0FyQixJQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVYLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUWdDLEVBQUUsQ0FBQyxDQUFELENBQXBCO0FBQ0FyQixJQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVYLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUWdDLEVBQUUsQ0FBQyxDQUFELENBQXBCO0FBQ0FyQixJQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVYLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUWdDLEVBQUUsQ0FBQyxDQUFELENBQXBCO0FBQ0FyQixJQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVYLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUWdDLEVBQUUsQ0FBQyxDQUFELENBQXBCO0FBQ0FyQixJQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVYLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUWdDLEVBQUUsQ0FBQyxDQUFELENBQXBCO0FBQ0FyQixJQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVYLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUWdDLEVBQUUsQ0FBQyxDQUFELENBQXBCO0FBQ0FyQixJQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVYLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUWdDLEVBQUUsQ0FBQyxDQUFELENBQXBCO0FBQ0FyQixJQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVYLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUWdDLEVBQUUsQ0FBQyxDQUFELENBQXBCO0FBQ0EsV0FBTzdCLEdBQVA7QUFD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Q0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPSixHQUFQO0FBQ0g7QUFDSjtBQUdEOzs7Ozs7Ozs7O1NBTUF3SSxXQUFBLG9CQUFZO0FBQ1IsUUFBSXJJLEVBQUUsR0FBRyxLQUFLQyxDQUFkO0FBQ0EscUJBQWVELEVBQUUsQ0FBQyxDQUFELENBQWpCLFVBQXlCQSxFQUFFLENBQUMsQ0FBRCxDQUEzQixVQUFtQ0EsRUFBRSxDQUFDLENBQUQsQ0FBckMsVUFBNkNBLEVBQUUsQ0FBQyxDQUFELENBQS9DLFVBQXVEQSxFQUFFLENBQUMsQ0FBRCxDQUF6RCxVQUFpRUEsRUFBRSxDQUFDLENBQUQsQ0FBbkUsVUFBMkVBLEVBQUUsQ0FBQyxDQUFELENBQTdFLFVBQXFGQSxFQUFFLENBQUMsQ0FBRCxDQUF2RixVQUErRkEsRUFBRSxDQUFDLENBQUQsQ0FBakc7QUFDSDs7Ozs7O0FBMTNCZ0JiLEtBQ1ZtSixNQUFNbkosSUFBSSxDQUFDa0g7QUFERGxILEtBRVZvSixNQUFNcEosSUFBSSxDQUFDMkM7QUFGRDNDLEtBU1ZxSixXQUFXQyxNQUFNLENBQUNDLE1BQVAsQ0FBYyxJQUFJdkosSUFBSixFQUFkO0FBbzNCdEJ3SixFQUFFLENBQUN4SixJQUFILEdBQVVBLElBQVYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFUFNJTE9OLCBGTE9BVF9BUlJBWV9UWVBFIH0gZnJvbSAnLi4vdmFsdWUtdHlwZXMvdXRpbHMnO1xuaW1wb3J0IFZlYzMgZnJvbSAnLi92ZWMzJztcbmltcG9ydCBWZWMyIGZyb20gJy4vdmVjMic7XG5pbXBvcnQgTWF0NCBmcm9tICcuL21hdDQnO1xuaW1wb3J0IFF1YXQgZnJvbSAnLi9xdWF0JztcbmltcG9ydCB7IElNYXQzTGlrZSB9IGZyb20gJy4vbWF0aCc7XG5cbi8qKlxuICogTWF0aGVtYXRpY2FsIDN4MyBtYXRyaXguXG4gKlxuICogTk9URTogd2UgdXNlIGNvbHVtbi1tYWpvciBtYXRyaXggZm9yIGFsbCBtYXRyaXggY2FsY3VsYXRpb24uXG4gKlxuICogVGhpcyBtYXkgbGVhZCB0byBzb21lIGNvbmZ1c2lvbiB3aGVuIHJlZmVyZW5jaW5nIE9wZW5HTCBkb2N1bWVudGF0aW9uLFxuICogaG93ZXZlciwgd2hpY2ggcmVwcmVzZW50cyBvdXQgYWxsIG1hdHJpY2llcyBpbiBjb2x1bW4tbWFqb3IgZm9ybWF0LlxuICogVGhpcyBtZWFucyB0aGF0IHdoaWxlIGluIGNvZGUgYSBtYXRyaXggbWF5IGJlIHR5cGVkIG91dCBhczpcbiAqXG4gKiBbMSwgMCwgMCwgMCxcbiAqICAwLCAxLCAwLCAwLFxuICogIDAsIDAsIDEsIDAsXG4gKiAgeCwgeSwgeiwgMF1cbiAqXG4gKiBUaGUgc2FtZSBtYXRyaXggaW4gdGhlIFtPcGVuR0wgZG9jdW1lbnRhdGlvbl0oaHR0cHM6Ly93d3cua2hyb25vcy5vcmcvcmVnaXN0cnkvT3BlbkdMLVJlZnBhZ2VzL2dsMi4xL3hodG1sL2dsVHJhbnNsYXRlLnhtbClcbiAqIGlzIHdyaXR0ZW4gYXM6XG4gKlxuICogIDEgMCAwIHhcbiAqICAwIDEgMCB5XG4gKiAgMCAwIDEgelxuICogIDAgMCAwIDBcbiAqXG4gKiBQbGVhc2UgcmVzdCBhc3N1cmVkLCBob3dldmVyLCB0aGF0IHRoZXkgYXJlIHRoZSBzYW1lIHRoaW5nIVxuICogVGhpcyBpcyBub3QgdW5pcXVlIHRvIGdsTWF0cml4LCBlaXRoZXIsIGFzIE9wZW5HTCBkZXZlbG9wZXJzIGhhdmUgbG9uZyBiZWVuIGNvbmZ1c2VkIGJ5IHRoZVxuICogYXBwYXJlbnQgbGFjayBvZiBjb25zaXN0ZW5jeSBiZXR3ZWVuIHRoZSBtZW1vcnkgbGF5b3V0IGFuZCB0aGUgZG9jdW1lbnRhdGlvbi5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWF0MyB7XG4gICAgc3RhdGljIHN1YiA9IE1hdDMuc3VidHJhY3Q7XG4gICAgc3RhdGljIG11bCA9IE1hdDMubXVsdGlwbHk7XG4gICAgXG4gICAgLyoqXG4gICAgICogSWRlbnRpdHkgIG9mIE1hdDNcbiAgICAgKiBAcHJvcGVydHkge01hdDN9IElERU5USVRZXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBJREVOVElUWSA9IE9iamVjdC5mcmVlemUobmV3IE1hdDMoKSk7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbWF0cml4LCB3aXRoIGVsZW1lbnRzIHNwZWNpZmllZCBzZXBhcmF0ZWx5LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG0wMCAtIFZhbHVlIGFzc2lnbmVkIHRvIGVsZW1lbnQgYXQgY29sdW1uIDAgcm93IDAuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG0wMSAtIFZhbHVlIGFzc2lnbmVkIHRvIGVsZW1lbnQgYXQgY29sdW1uIDAgcm93IDEuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG0wMiAtIFZhbHVlIGFzc2lnbmVkIHRvIGVsZW1lbnQgYXQgY29sdW1uIDAgcm93IDIuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG0wMyAtIFZhbHVlIGFzc2lnbmVkIHRvIGVsZW1lbnQgYXQgY29sdW1uIDEgcm93IDAuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG0wNCAtIFZhbHVlIGFzc2lnbmVkIHRvIGVsZW1lbnQgYXQgY29sdW1uIDEgcm93IDEuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG0wNSAtIFZhbHVlIGFzc2lnbmVkIHRvIGVsZW1lbnQgYXQgY29sdW1uIDEgcm93IDIuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG0wNiAtIFZhbHVlIGFzc2lnbmVkIHRvIGVsZW1lbnQgYXQgY29sdW1uIDIgcm93IDAuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG0wNyAtIFZhbHVlIGFzc2lnbmVkIHRvIGVsZW1lbnQgYXQgY29sdW1uIDIgcm93IDEuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG0wOCAtIFZhbHVlIGFzc2lnbmVkIHRvIGVsZW1lbnQgYXQgY29sdW1uIDIgcm93IDIuXG4gICAgICogQHJldHVybnMge01hdDN9IFRoZSBuZXdseSBjcmVhdGVkIG1hdHJpeC5cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGNyZWF0ZSAobTAwOiBudW1iZXIgPSAxLCBtMDE6IG51bWJlciA9IDAsIG0wMjogbnVtYmVyID0gMCwgbTAzOiBudW1iZXIgPSAwLCBtMDQ6IG51bWJlciA9IDEsIG0wNTogbnVtYmVyID0gMCwgbTA2OiBudW1iZXIgPSAwLCBtMDc6IG51bWJlciA9IDAsIG0wODogbnVtYmVyID0gMSk6IE1hdDMge1xuICAgICAgICByZXR1cm4gbmV3IE1hdDMobTAwLCBtMDEsIG0wMiwgbTAzLCBtMDQsIG0wNSwgbTA2LCBtMDcsIG0wOCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2xvbmUgYSBtYXRyaXguXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge01hdDN9IGEgLSBNYXRyaXggdG8gY2xvbmUuXG4gICAgICogQHJldHVybnMge01hdDN9IFRoZSBuZXdseSBjcmVhdGVkIG1hdHJpeC5cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGNsb25lIChhOiBNYXQzKTogTWF0MyB7XG4gICAgICAgIGxldCBhbSA9IGEubTtcbiAgICAgICAgcmV0dXJuIG5ldyBNYXQzKFxuICAgICAgICAgICAgYW1bMF0sIGFtWzFdLCBhbVsyXSxcbiAgICAgICAgICAgIGFtWzNdLCBhbVs0XSwgYW1bNV0sXG4gICAgICAgICAgICBhbVs2XSwgYW1bN10sIGFtWzhdXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29weSBjb250ZW50IG9mIGEgbWF0cml4IGludG8gYW5vdGhlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TWF0M30gb3V0IC0gTWF0cml4IHRvIG1vZGlmaWVkLlxuICAgICAqIEBwYXJhbSB7TWF0M30gYSAtIFRoZSBzcGVjaWZpZWQgbWF0cml4LlxuICAgICAqIEByZXR1cm5zIHtNYXQzfSBvdXQuXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBjb3B5IChvdXQ6IE1hdDMsIGE6IE1hdDMpOiBNYXQzIHtcbiAgICAgICAgb3V0Lm0uc2V0KGEubSk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgZWxlbWVudHMgb2YgYSBtYXRyaXggdG8gdGhlIGdpdmVuIHZhbHVlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TWF0M30gb3V0IC0gVGhlIG1hdHJpeCB0byBtb2RpZmllZC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbTAwIC0gVmFsdWUgYXNzaWduZWQgdG8gZWxlbWVudCBhdCBjb2x1bW4gMCByb3cgMC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbTAxIC0gVmFsdWUgYXNzaWduZWQgdG8gZWxlbWVudCBhdCBjb2x1bW4gMCByb3cgMS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbTAyIC0gVmFsdWUgYXNzaWduZWQgdG8gZWxlbWVudCBhdCBjb2x1bW4gMCByb3cgMi5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbTEwIC0gVmFsdWUgYXNzaWduZWQgdG8gZWxlbWVudCBhdCBjb2x1bW4gMSByb3cgMC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbTExIC0gVmFsdWUgYXNzaWduZWQgdG8gZWxlbWVudCBhdCBjb2x1bW4gMSByb3cgMS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbTEyIC0gVmFsdWUgYXNzaWduZWQgdG8gZWxlbWVudCBhdCBjb2x1bW4gMSByb3cgMi5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbTIwIC0gVmFsdWUgYXNzaWduZWQgdG8gZWxlbWVudCBhdCBjb2x1bW4gMiByb3cgMC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbTIxIC0gVmFsdWUgYXNzaWduZWQgdG8gZWxlbWVudCBhdCBjb2x1bW4gMiByb3cgMS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbTIyIC0gVmFsdWUgYXNzaWduZWQgdG8gZWxlbWVudCBhdCBjb2x1bW4gMiByb3cgMi5cbiAgICAgKiBAcmV0dXJucyB7TWF0M30gb3V0LlxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgc2V0IChvdXQ6IE1hdDMsIG0wMDogbnVtYmVyLCBtMDE6IG51bWJlciwgbTAyOiBudW1iZXIsIG0xMDogbnVtYmVyLCBtMTE6IG51bWJlciwgbTEyOiBudW1iZXIsIG0yMDogbnVtYmVyLCBtMjE6IG51bWJlciwgbTIyOiBudW1iZXIpOiBNYXQzIHtcbiAgICAgICAgbGV0IG91dG0gPSBvdXQubTtcbiAgICAgICAgb3V0bVswXSA9IG0wMDtcbiAgICAgICAgb3V0bVsxXSA9IG0wMTtcbiAgICAgICAgb3V0bVsyXSA9IG0wMjtcbiAgICAgICAgb3V0bVszXSA9IG0xMDtcbiAgICAgICAgb3V0bVs0XSA9IG0xMTtcbiAgICAgICAgb3V0bVs1XSA9IG0xMjtcbiAgICAgICAgb3V0bVs2XSA9IG0yMDtcbiAgICAgICAgb3V0bVs3XSA9IG0yMTtcbiAgICAgICAgb3V0bVs4XSA9IG0yMjtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm4gYW4gaWRlbnRpdHkgbWF0cml4LlxuICAgICAqXG4gICAgICogQHJldHVybnMge01hdDN9IG91dC5cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGlkZW50aXR5IChvdXQ6IE1hdDMpOiBNYXQzIHtcbiAgICAgICAgbGV0IG91dG0gPSBvdXQubTtcbiAgICAgICAgb3V0bVswXSA9IDE7XG4gICAgICAgIG91dG1bMV0gPSAwO1xuICAgICAgICBvdXRtWzJdID0gMDtcbiAgICAgICAgb3V0bVszXSA9IDA7XG4gICAgICAgIG91dG1bNF0gPSAxO1xuICAgICAgICBvdXRtWzVdID0gMDtcbiAgICAgICAgb3V0bVs2XSA9IDA7XG4gICAgICAgIG91dG1bN10gPSAwO1xuICAgICAgICBvdXRtWzhdID0gMTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmFuc3Bvc2VzIGEgbWF0cml4LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtNYXQzfSBvdXQgLSBNYXRyaXggdG8gc3RvcmUgcmVzdWx0LlxuICAgICAqIEBwYXJhbSB7TWF0M30gYSAtIE1hdHJpeCB0byB0cmFuc3Bvc2UuXG4gICAgICogQHJldHVybnMge01hdDN9IG91dC5cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHRyYW5zcG9zZSAob3V0OiBNYXQzLCBhOiBNYXQzKTogTWF0MyB7XG4gICAgICAgIGxldCBhbSA9IGEubSwgb3V0bSA9IG91dC5tO1xuICAgICAgICAvLyBJZiB3ZSBhcmUgdHJhbnNwb3Npbmcgb3Vyc2VsdmVzIHdlIGNhbiBza2lwIGEgZmV3IHN0ZXBzIGJ1dCBoYXZlIHRvIGNhY2hlIHNvbWUgdmFsdWVzXG4gICAgICAgIGlmIChvdXQgPT09IGEpIHtcbiAgICAgICAgICAgIGxldCBhMDEgPSBhbVsxXSwgYTAyID0gYW1bMl0sIGExMiA9IGFtWzVdO1xuICAgICAgICAgICAgb3V0bVsxXSA9IGFtWzNdO1xuICAgICAgICAgICAgb3V0bVsyXSA9IGFtWzZdO1xuICAgICAgICAgICAgb3V0bVszXSA9IGEwMTtcbiAgICAgICAgICAgIG91dG1bNV0gPSBhbVs3XTtcbiAgICAgICAgICAgIG91dG1bNl0gPSBhMDI7XG4gICAgICAgICAgICBvdXRtWzddID0gYTEyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0bVswXSA9IGFtWzBdO1xuICAgICAgICAgICAgb3V0bVsxXSA9IGFtWzNdO1xuICAgICAgICAgICAgb3V0bVsyXSA9IGFtWzZdO1xuICAgICAgICAgICAgb3V0bVszXSA9IGFtWzFdO1xuICAgICAgICAgICAgb3V0bVs0XSA9IGFtWzRdO1xuICAgICAgICAgICAgb3V0bVs1XSA9IGFtWzddO1xuICAgICAgICAgICAgb3V0bVs2XSA9IGFtWzJdO1xuICAgICAgICAgICAgb3V0bVs3XSA9IGFtWzVdO1xuICAgICAgICAgICAgb3V0bVs4XSA9IGFtWzhdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZlcnRzIGEgbWF0cml4LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtNYXQzfSBvdXQgLSBNYXRyaXggdG8gc3RvcmUgcmVzdWx0LlxuICAgICAqIEBwYXJhbSB7TWF0M30gYSAtIE1hdHJpeCB0byBpbnZlcnQuXG4gICAgICogQHJldHVybnMge01hdDN9IG91dC5cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGludmVydCAob3V0OiBNYXQzLCBhOiBNYXQzKTogTWF0MyB7XG4gICAgICAgIGxldCBhbSA9IGEubSwgb3V0bSA9IG91dC5tO1xuICAgICAgICBsZXQgYTAwID0gYW1bMF0sIGEwMSA9IGFtWzFdLCBhMDIgPSBhbVsyXSxcbiAgICAgICAgICAgIGExMCA9IGFtWzNdLCBhMTEgPSBhbVs0XSwgYTEyID0gYW1bNV0sXG4gICAgICAgICAgICBhMjAgPSBhbVs2XSwgYTIxID0gYW1bN10sIGEyMiA9IGFtWzhdO1xuXG4gICAgICAgIGxldCBiMDEgPSBhMjIgKiBhMTEgLSBhMTIgKiBhMjE7XG4gICAgICAgIGxldCBiMTEgPSAtYTIyICogYTEwICsgYTEyICogYTIwO1xuICAgICAgICBsZXQgYjIxID0gYTIxICogYTEwIC0gYTExICogYTIwO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgZGV0ZXJtaW5hbnRcbiAgICAgICAgbGV0IGRldCA9IGEwMCAqIGIwMSArIGEwMSAqIGIxMSArIGEwMiAqIGIyMTtcblxuICAgICAgICBpZiAoIWRldCkge1xuICAgICAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgICAgfVxuICAgICAgICBkZXQgPSAxLjAgLyBkZXQ7XG5cbiAgICAgICAgb3V0bVswXSA9IGIwMSAqIGRldDtcbiAgICAgICAgb3V0bVsxXSA9ICgtYTIyICogYTAxICsgYTAyICogYTIxKSAqIGRldDtcbiAgICAgICAgb3V0bVsyXSA9IChhMTIgKiBhMDEgLSBhMDIgKiBhMTEpICogZGV0O1xuICAgICAgICBvdXRtWzNdID0gYjExICogZGV0O1xuICAgICAgICBvdXRtWzRdID0gKGEyMiAqIGEwMCAtIGEwMiAqIGEyMCkgKiBkZXQ7XG4gICAgICAgIG91dG1bNV0gPSAoLWExMiAqIGEwMCArIGEwMiAqIGExMCkgKiBkZXQ7XG4gICAgICAgIG91dG1bNl0gPSBiMjEgKiBkZXQ7XG4gICAgICAgIG91dG1bN10gPSAoLWEyMSAqIGEwMCArIGEwMSAqIGEyMCkgKiBkZXQ7XG4gICAgICAgIG91dG1bOF0gPSAoYTExICogYTAwIC0gYTAxICogYTEwKSAqIGRldDtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGVzIHRoZSBhZGp1Z2F0ZSBvZiBhIG1hdHJpeC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TWF0M30gb3V0IC0gTWF0cml4IHRvIHN0b3JlIHJlc3VsdC5cbiAgICAgKiBAcGFyYW0ge01hdDN9IGEgLSBNYXRyaXggdG8gY2FsY3VsYXRlLlxuICAgICAqIEByZXR1cm5zIHtNYXQzfSBvdXQuXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBhZGpvaW50IChvdXQ6IE1hdDMsIGE6IE1hdDMpOiBNYXQzIHtcbiAgICAgICAgbGV0IGFtID0gYS5tLCBvdXRtID0gb3V0Lm07XG4gICAgICAgIGxldCBhMDAgPSBhbVswXSwgYTAxID0gYW1bMV0sIGEwMiA9IGFtWzJdLFxuICAgICAgICAgICAgYTEwID0gYW1bM10sIGExMSA9IGFtWzRdLCBhMTIgPSBhbVs1XSxcbiAgICAgICAgICAgIGEyMCA9IGFtWzZdLCBhMjEgPSBhbVs3XSwgYTIyID0gYW1bOF07XG5cbiAgICAgICAgb3V0bVswXSA9IChhMTEgKiBhMjIgLSBhMTIgKiBhMjEpO1xuICAgICAgICBvdXRtWzFdID0gKGEwMiAqIGEyMSAtIGEwMSAqIGEyMik7XG4gICAgICAgIG91dG1bMl0gPSAoYTAxICogYTEyIC0gYTAyICogYTExKTtcbiAgICAgICAgb3V0bVszXSA9IChhMTIgKiBhMjAgLSBhMTAgKiBhMjIpO1xuICAgICAgICBvdXRtWzRdID0gKGEwMCAqIGEyMiAtIGEwMiAqIGEyMCk7XG4gICAgICAgIG91dG1bNV0gPSAoYTAyICogYTEwIC0gYTAwICogYTEyKTtcbiAgICAgICAgb3V0bVs2XSA9IChhMTAgKiBhMjEgLSBhMTEgKiBhMjApO1xuICAgICAgICBvdXRtWzddID0gKGEwMSAqIGEyMCAtIGEwMCAqIGEyMSk7XG4gICAgICAgIG91dG1bOF0gPSAoYTAwICogYTExIC0gYTAxICogYTEwKTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGVzIHRoZSBkZXRlcm1pbmFudCBvZiBhIG1hdHJpeC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TWF0M30gYSAtIE1hdHJpeCB0byBjYWxjdWxhdGUuXG4gICAgICogQHJldHVybnMge051bWJlcn0gRGV0ZXJtaW5hbnQgb2YgYS5cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGRldGVybWluYW50IChhOiBNYXQzKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGFtID0gYS5tO1xuICAgICAgICBsZXQgYTAwID0gYW1bMF0sIGEwMSA9IGFtWzFdLCBhMDIgPSBhbVsyXSxcbiAgICAgICAgICAgIGExMCA9IGFtWzNdLCBhMTEgPSBhbVs0XSwgYTEyID0gYW1bNV0sXG4gICAgICAgICAgICBhMjAgPSBhbVs2XSwgYTIxID0gYW1bN10sIGEyMiA9IGFtWzhdO1xuXG4gICAgICAgIHJldHVybiBhMDAgKiAoYTIyICogYTExIC0gYTEyICogYTIxKSArIGEwMSAqICgtYTIyICogYTEwICsgYTEyICogYTIwKSArIGEwMiAqIChhMjEgKiBhMTAgLSBhMTEgKiBhMjApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE11bHRpcGx5IHR3byBtYXRyaWNlcyBleHBsaWNpdGx5LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtNYXQzfSBvdXQgLSBNYXRyaXggdG8gc3RvcmUgcmVzdWx0LlxuICAgICAqIEBwYXJhbSB7TWF0M30gYSAtIFRoZSBmaXJzdCBvcGVyYW5kLlxuICAgICAqIEBwYXJhbSB7TWF0M30gYiAtIFRoZSBzZWNvbmQgb3BlcmFuZC5cbiAgICAgKiBAcmV0dXJucyB7TWF0M30gb3V0LlxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgbXVsdGlwbHkgKG91dDogTWF0MywgYTogTWF0MywgYjogTWF0Myk6IE1hdDMge1xuICAgICAgICBsZXQgYW0gPSBhLm0sIGJtID0gYi5tLCBvdXRtID0gb3V0Lm07XG4gICAgICAgIGxldCBhMDAgPSBhbVswXSwgYTAxID0gYW1bMV0sIGEwMiA9IGFtWzJdLFxuICAgICAgICAgICAgYTEwID0gYW1bM10sIGExMSA9IGFtWzRdLCBhMTIgPSBhbVs1XSxcbiAgICAgICAgICAgIGEyMCA9IGFtWzZdLCBhMjEgPSBhbVs3XSwgYTIyID0gYW1bOF07XG5cbiAgICAgICAgbGV0IGIwMCA9IGJtWzBdLCBiMDEgPSBibVsxXSwgYjAyID0gYm1bMl07XG4gICAgICAgIGxldCBiMTAgPSBibVszXSwgYjExID0gYm1bNF0sIGIxMiA9IGJtWzVdO1xuICAgICAgICBsZXQgYjIwID0gYm1bNl0sIGIyMSA9IGJtWzddLCBiMjIgPSBibVs4XTtcblxuICAgICAgICBvdXRtWzBdID0gYjAwICogYTAwICsgYjAxICogYTEwICsgYjAyICogYTIwO1xuICAgICAgICBvdXRtWzFdID0gYjAwICogYTAxICsgYjAxICogYTExICsgYjAyICogYTIxO1xuICAgICAgICBvdXRtWzJdID0gYjAwICogYTAyICsgYjAxICogYTEyICsgYjAyICogYTIyO1xuXG4gICAgICAgIG91dG1bM10gPSBiMTAgKiBhMDAgKyBiMTEgKiBhMTAgKyBiMTIgKiBhMjA7XG4gICAgICAgIG91dG1bNF0gPSBiMTAgKiBhMDEgKyBiMTEgKiBhMTEgKyBiMTIgKiBhMjE7XG4gICAgICAgIG91dG1bNV0gPSBiMTAgKiBhMDIgKyBiMTEgKiBhMTIgKyBiMTIgKiBhMjI7XG5cbiAgICAgICAgb3V0bVs2XSA9IGIyMCAqIGEwMCArIGIyMSAqIGExMCArIGIyMiAqIGEyMDtcbiAgICAgICAgb3V0bVs3XSA9IGIyMCAqIGEwMSArIGIyMSAqIGExMSArIGIyMiAqIGEyMTtcbiAgICAgICAgb3V0bVs4XSA9IGIyMCAqIGEwMiArIGIyMSAqIGExMiArIGIyMiAqIGEyMjtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRha2UgdGhlIGZpcnN0IHRoaXJkIG9yZGVyIG9mIHRoZSBmb3VydGggb3JkZXIgbWF0cml4IGFuZCBtdWx0aXBseSBieSB0aGUgdGhpcmQgb3JkZXIgbWF0cml4XG4gICAgICogISN6aCDlj5blm5vpmLbnn6npmLXnmoTliY3kuInpmLbvvIzkuI7kuInpmLbnn6npmLXnm7jkuZhcbiAgICAgKiBAcGFyYW0ge01hdDN9IG91dCAtIE1hdHJpeCB0byBzdG9yZSByZXN1bHQuXG4gICAgICogQHBhcmFtIHtNYXQzfSBhIC0gVGhlIGZpcnN0IG9wZXJhbmQuXG4gICAgICogQHBhcmFtIHtNYXQzfSBiIC0gVGhlIHNlY29uZCBvcGVyYW5kLlxuICAgICAqIEByZXR1cm5zIHtNYXQzfSBvdXQuXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBtdWx0aXBseU1hdDQgPE91dCBleHRlbmRzIElNYXQzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IElNYXQ0TGlrZSkge1xuICAgICAgICBsZXQgYW0gPSBhLm0sIGJtID0gYi5tLCBvdXRtID0gb3V0Lm07XG4gICAgICAgIGxldCBhMDAgPSBhbVswXSwgYTAxID0gYW1bMV0sIGEwMiA9IGFtWzJdLFxuICAgICAgICAgICAgYTEwID0gYW1bM10sIGExMSA9IGFtWzRdLCBhMTIgPSBhbVs1XSxcbiAgICAgICAgICAgIGEyMCA9IGFtWzZdLCBhMjEgPSBhbVs3XSwgYTIyID0gYW1bOF07XG5cbiAgICAgICAgY29uc3QgYjAwID0gYm1bMF0sIGIwMSA9IGJtWzFdLCBiMDIgPSBibVsyXTtcbiAgICAgICAgY29uc3QgYjEwID0gYm1bNF0sIGIxMSA9IGJtWzVdLCBiMTIgPSBibVs2XTtcbiAgICAgICAgY29uc3QgYjIwID0gYm1bOF0sIGIyMSA9IGJtWzldLCBiMjIgPSBibVsxMF07XG5cbiAgICAgICAgb3V0bVswXSA9IGIwMCAqIGEwMCArIGIwMSAqIGExMCArIGIwMiAqIGEyMDtcbiAgICAgICAgb3V0bVsxXSA9IGIwMCAqIGEwMSArIGIwMSAqIGExMSArIGIwMiAqIGEyMTtcbiAgICAgICAgb3V0bVsyXSA9IGIwMCAqIGEwMiArIGIwMSAqIGExMiArIGIwMiAqIGEyMjtcbiAgICAgICAgb3V0bVszXSA9IGIxMCAqIGEwMCArIGIxMSAqIGExMCArIGIxMiAqIGEyMDtcbiAgICAgICAgb3V0bVs0XSA9IGIxMCAqIGEwMSArIGIxMSAqIGExMSArIGIxMiAqIGEyMTtcbiAgICAgICAgb3V0bVs1XSA9IGIxMCAqIGEwMiArIGIxMSAqIGExMiArIGIxMiAqIGEyMjtcbiAgICAgICAgb3V0bVs2XSA9IGIyMCAqIGEwMCArIGIyMSAqIGExMCArIGIyMiAqIGEyMDtcbiAgICAgICAgb3V0bVs3XSA9IGIyMCAqIGEwMSArIGIyMSAqIGExMSArIGIyMiAqIGEyMTtcbiAgICAgICAgb3V0bVs4XSA9IGIyMCAqIGEwMiArIGIyMSAqIGExMiArIGIyMiAqIGEyMjtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNdWx0aXBseSBhIG1hdHJpeCB3aXRoIGEgdHJhbnNsYXRpb24gbWF0cml4IGdpdmVuIGJ5IGEgdHJhbnNsYXRpb24gb2Zmc2V0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtNYXQzfSBvdXQgLSBNYXRyaXggdG8gc3RvcmUgcmVzdWx0LlxuICAgICAqIEBwYXJhbSB7TWF0M30gYSAtIE1hdHJpeCB0byBtdWx0aXBseS5cbiAgICAgKiBAcGFyYW0ge3ZlYzJ9IHYgLSBUaGUgdHJhbnNsYXRpb24gb2Zmc2V0LlxuICAgICAqIEByZXR1cm5zIHtNYXQzfSBvdXQuXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyB0cmFuc2xhdGUgKG91dDogTWF0MywgYTogTWF0MywgdjogVmVjMik6IE1hdDMge1xuICAgICAgICBsZXQgYW0gPSBhLm0sIG91dG0gPSBvdXQubTtcbiAgICAgICAgbGV0IGEwMCA9IGFtWzBdLCBhMDEgPSBhbVsxXSwgYTAyID0gYW1bMl0sXG4gICAgICAgICAgICBhMTAgPSBhbVszXSwgYTExID0gYW1bNF0sIGExMiA9IGFtWzVdLFxuICAgICAgICAgICAgYTIwID0gYW1bNl0sIGEyMSA9IGFtWzddLCBhMjIgPSBhbVs4XTtcbiAgICAgICAgbGV0IHggPSB2LngsIHkgPSB2Lnk7XG5cbiAgICAgICAgb3V0bVswXSA9IGEwMDtcbiAgICAgICAgb3V0bVsxXSA9IGEwMTtcbiAgICAgICAgb3V0bVsyXSA9IGEwMjtcblxuICAgICAgICBvdXRtWzNdID0gYTEwO1xuICAgICAgICBvdXRtWzRdID0gYTExO1xuICAgICAgICBvdXRtWzVdID0gYTEyO1xuXG4gICAgICAgIG91dG1bNl0gPSB4ICogYTAwICsgeSAqIGExMCArIGEyMDtcbiAgICAgICAgb3V0bVs3XSA9IHggKiBhMDEgKyB5ICogYTExICsgYTIxO1xuICAgICAgICBvdXRtWzhdID0geCAqIGEwMiArIHkgKiBhMTIgKyBhMjI7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUm90YXRlcyBhIG1hdHJpeCBieSB0aGUgZ2l2ZW4gYW5nbGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge01hdDN9IG91dCAtIE1hdHJpeCB0byBzdG9yZSByZXN1bHQuXG4gICAgICogQHBhcmFtIHtNYXQzfSBhIC0gTWF0cml4IHRvIHJvdGF0ZS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcmFkIC0gVGhlIHJvdGF0aW9uIGFuZ2xlLlxuICAgICAqIEByZXR1cm5zIHtNYXQzfSBvdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHJvdGF0ZSAob3V0OiBNYXQzLCBhOiBNYXQzLCByYWQ6IG51bWJlcik6IE1hdDMge1xuICAgICAgICBsZXQgYW0gPSBhLm0sIG91dG0gPSBvdXQubTtcbiAgICAgICAgbGV0IGEwMCA9IGFtWzBdLCBhMDEgPSBhbVsxXSwgYTAyID0gYW1bMl0sXG4gICAgICAgICAgICBhMTAgPSBhbVszXSwgYTExID0gYW1bNF0sIGExMiA9IGFtWzVdLFxuICAgICAgICAgICAgYTIwID0gYW1bNl0sIGEyMSA9IGFtWzddLCBhMjIgPSBhbVs4XTtcblxuICAgICAgICBsZXQgcyA9IE1hdGguc2luKHJhZCk7XG4gICAgICAgIGxldCBjID0gTWF0aC5jb3MocmFkKTtcblxuICAgICAgICBvdXRtWzBdID0gYyAqIGEwMCArIHMgKiBhMTA7XG4gICAgICAgIG91dG1bMV0gPSBjICogYTAxICsgcyAqIGExMTtcbiAgICAgICAgb3V0bVsyXSA9IGMgKiBhMDIgKyBzICogYTEyO1xuXG4gICAgICAgIG91dG1bM10gPSBjICogYTEwIC0gcyAqIGEwMDtcbiAgICAgICAgb3V0bVs0XSA9IGMgKiBhMTEgLSBzICogYTAxO1xuICAgICAgICBvdXRtWzVdID0gYyAqIGExMiAtIHMgKiBhMDI7XG5cbiAgICAgICAgb3V0bVs2XSA9IGEyMDtcbiAgICAgICAgb3V0bVs3XSA9IGEyMTtcbiAgICAgICAgb3V0bVs4XSA9IGEyMjtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNdWx0aXBseSBhIG1hdHJpeCB3aXRoIGEgc2NhbGUgbWF0cml4IGdpdmVuIGJ5IGEgc2NhbGUgdmVjdG9yLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtNYXQzfSBvdXQgLSBNYXRyaXggdG8gc3RvcmUgcmVzdWx0LlxuICAgICAqIEBwYXJhbSB7TWF0M30gYSAtIE1hdHJpeCB0byBtdWx0aXBseS5cbiAgICAgKiBAcGFyYW0ge3ZlYzJ9IHYgLSBUaGUgc2NhbGUgdmVjdG9yLlxuICAgICAqIEByZXR1cm5zIHtNYXQzfSBvdXRcbiAgICAgKiovXG4gICAgc3RhdGljIHNjYWxlIChvdXQ6IE1hdDMsIGE6IE1hdDMsIHY6IFZlYzIpOiBNYXQzIHtcbiAgICAgICAgbGV0IHggPSB2LngsIHkgPSB2Lnk7XG4gICAgICAgIGxldCBhbSA9IGEubSwgb3V0bSA9IG91dC5tO1xuXG4gICAgICAgIG91dG1bMF0gPSB4ICogYW1bMF07XG4gICAgICAgIG91dG1bMV0gPSB4ICogYW1bMV07XG4gICAgICAgIG91dG1bMl0gPSB4ICogYW1bMl07XG5cbiAgICAgICAgb3V0bVszXSA9IHkgKiBhbVszXTtcbiAgICAgICAgb3V0bVs0XSA9IHkgKiBhbVs0XTtcbiAgICAgICAgb3V0bVs1XSA9IHkgKiBhbVs1XTtcblxuICAgICAgICBvdXRtWzZdID0gYW1bNl07XG4gICAgICAgIG91dG1bN10gPSBhbVs3XTtcbiAgICAgICAgb3V0bVs4XSA9IGFtWzhdO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvcGllcyB0aGUgdXBwZXItbGVmdCAzeDMgdmFsdWVzIG9mIGEgNHg0IG1hdHJpeCBpbnRvIGEgM3gzIG1hdHJpeC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TWF0M30gb3V0IC0gTWF0cml4IHRvIHN0b3JlIHJlc3VsdC5cbiAgICAgKiBAcGFyYW0ge21hdDR9IGEgLSBUaGUgNHg0IG1hdHJpeC5cbiAgICAgKiBAcmV0dXJucyB7TWF0M30gb3V0LlxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbU1hdDQgKG91dDogTWF0MywgYTogTWF0NCk6IE1hdDMge1xuICAgICAgICBsZXQgYW0gPSBhLm0sIG91dG0gPSBvdXQubTtcbiAgICAgICAgb3V0bVswXSA9IGFtWzBdO1xuICAgICAgICBvdXRtWzFdID0gYW1bMV07XG4gICAgICAgIG91dG1bMl0gPSBhbVsyXTtcbiAgICAgICAgb3V0bVszXSA9IGFtWzRdO1xuICAgICAgICBvdXRtWzRdID0gYW1bNV07XG4gICAgICAgIG91dG1bNV0gPSBhbVs2XTtcbiAgICAgICAgb3V0bVs2XSA9IGFtWzhdO1xuICAgICAgICBvdXRtWzddID0gYW1bOV07XG4gICAgICAgIG91dG1bOF0gPSBhbVsxMF07XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG1hdHJpeCBmcm9tIGEgdHJhbnNsYXRpb24gb2Zmc2V0LlxuICAgICAqIFRoaXMgaXMgZXF1aXZhbGVudCB0byAoYnV0IG11Y2ggZmFzdGVyIHRoYW4pOlxuICAgICAqXG4gICAgICogICAgIG1hdDMuaWRlbnRpdHkoZGVzdCk7XG4gICAgICogICAgIG1hdDMudHJhbnNsYXRlKGRlc3QsIGRlc3QsIHZlYyk7XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge01hdDN9IG91dCAtIE1hdHJpeCB0byBzdG9yZSByZXN1bHQuXG4gICAgICogQHBhcmFtIHt2ZWMyfSB2IC0gVGhlIHRyYW5zbGF0aW9uIG9mZnNldC5cbiAgICAgKiBAcmV0dXJucyB7TWF0M30gb3V0LlxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbVRyYW5zbGF0aW9uIChvdXQ6IE1hdDMsIHY6IFZlYzIpOiBNYXQzIHtcbiAgICAgICAgbGV0IG91dG0gPSBvdXQubTtcbiAgICAgICAgb3V0bVswXSA9IDE7XG4gICAgICAgIG91dG1bMV0gPSAwO1xuICAgICAgICBvdXRtWzJdID0gMDtcbiAgICAgICAgb3V0bVszXSA9IDA7XG4gICAgICAgIG91dG1bNF0gPSAxO1xuICAgICAgICBvdXRtWzVdID0gMDtcbiAgICAgICAgb3V0bVs2XSA9IHYueDtcbiAgICAgICAgb3V0bVs3XSA9IHYueTtcbiAgICAgICAgb3V0bVs4XSA9IDE7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG1hdHJpeCBmcm9tIGEgZ2l2ZW4gYW5nbGUuXG4gICAgICogVGhpcyBpcyBlcXVpdmFsZW50IHRvIChidXQgbXVjaCBmYXN0ZXIgdGhhbik6XG4gICAgICpcbiAgICAgKiAgICAgbWF0My5pZGVudGl0eShkZXN0KTtcbiAgICAgKiAgICAgbWF0My5yb3RhdGUoZGVzdCwgZGVzdCwgcmFkKTtcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TWF0M30gb3V0IC0gTWF0cml4IHRvIHN0b3JlIHJlc3VsdC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcmFkIC0gVGhlIHJvdGF0aW9uIGFuZ2xlLlxuICAgICAqIEByZXR1cm5zIHtNYXQzfSBvdXQuXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tUm90YXRpb24gKG91dDogTWF0MywgcmFkOiBudW1iZXIpOiBNYXQzIHtcbiAgICAgICAgbGV0IHMgPSBNYXRoLnNpbihyYWQpLCBjID0gTWF0aC5jb3MocmFkKTtcbiAgICAgICAgbGV0IG91dG0gPSBvdXQubTtcblxuICAgICAgICBvdXRtWzBdID0gYztcbiAgICAgICAgb3V0bVsxXSA9IHM7XG4gICAgICAgIG91dG1bMl0gPSAwO1xuXG4gICAgICAgIG91dG1bM10gPSAtcztcbiAgICAgICAgb3V0bVs0XSA9IGM7XG4gICAgICAgIG91dG1bNV0gPSAwO1xuXG4gICAgICAgIG91dG1bNl0gPSAwO1xuICAgICAgICBvdXRtWzddID0gMDtcbiAgICAgICAgb3V0bVs4XSA9IDE7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG1hdHJpeCBmcm9tIGEgc2NhbGUgdmVjdG9yLlxuICAgICAqIFRoaXMgaXMgZXF1aXZhbGVudCB0byAoYnV0IG11Y2ggZmFzdGVyIHRoYW4pOlxuICAgICAqXG4gICAgICogICAgIG1hdDMuaWRlbnRpdHkoZGVzdCk7XG4gICAgICogICAgIG1hdDMuc2NhbGUoZGVzdCwgZGVzdCwgdmVjKTtcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TWF0M30gb3V0IC0gTWF0cml4IHRvIHN0b3JlIHJlc3VsdC5cbiAgICAgKiBAcGFyYW0ge3ZlYzJ9IHYgLSBTY2FsZSB2ZWN0b3IuXG4gICAgICogQHJldHVybnMge01hdDN9IG91dC5cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGZyb21TY2FsaW5nIChvdXQ6IE1hdDMsIHY6IFZlYzIpOiBNYXQzIHtcbiAgICAgICAgbGV0IG91dG0gPSBvdXQubTtcbiAgICAgICAgb3V0bVswXSA9IHYueDtcbiAgICAgICAgb3V0bVsxXSA9IDA7XG4gICAgICAgIG91dG1bMl0gPSAwO1xuXG4gICAgICAgIG91dG1bM10gPSAwO1xuICAgICAgICBvdXRtWzRdID0gdi55O1xuICAgICAgICBvdXRtWzVdID0gMDtcblxuICAgICAgICBvdXRtWzZdID0gMDtcbiAgICAgICAgb3V0bVs3XSA9IDA7XG4gICAgICAgIG91dG1bOF0gPSAxO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGN1bGF0ZXMgYSAzeDMgbWF0cml4IGZyb20gdGhlIGdpdmVuIHF1YXRlcm5pb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge01hdDN9IG91dCAtIE1hdHJpeCB0byBzdG9yZSByZXN1bHQuXG4gICAgICogQHBhcmFtIHtxdWF0fSBxIC0gVGhlIHF1YXRlcm5pb24uXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7TWF0M30gb3V0LlxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbVF1YXQgKG91dDogTWF0MywgcTogUXVhdCk6IE1hdDMge1xuICAgICAgICBsZXQgb3V0bSA9IG91dC5tO1xuICAgICAgICBsZXQgeCA9IHEueCwgeSA9IHEueSwgeiA9IHEueiwgdyA9IHEudztcbiAgICAgICAgbGV0IHgyID0geCArIHg7XG4gICAgICAgIGxldCB5MiA9IHkgKyB5O1xuICAgICAgICBsZXQgejIgPSB6ICsgejtcblxuICAgICAgICBsZXQgeHggPSB4ICogeDI7XG4gICAgICAgIGxldCB5eCA9IHkgKiB4MjtcbiAgICAgICAgbGV0IHl5ID0geSAqIHkyO1xuICAgICAgICBsZXQgenggPSB6ICogeDI7XG4gICAgICAgIGxldCB6eSA9IHogKiB5MjtcbiAgICAgICAgbGV0IHp6ID0geiAqIHoyO1xuICAgICAgICBsZXQgd3ggPSB3ICogeDI7XG4gICAgICAgIGxldCB3eSA9IHcgKiB5MjtcbiAgICAgICAgbGV0IHd6ID0gdyAqIHoyO1xuXG4gICAgICAgIG91dG1bMF0gPSAxIC0geXkgLSB6ejtcbiAgICAgICAgb3V0bVszXSA9IHl4IC0gd3o7XG4gICAgICAgIG91dG1bNl0gPSB6eCArIHd5O1xuXG4gICAgICAgIG91dG1bMV0gPSB5eCArIHd6O1xuICAgICAgICBvdXRtWzRdID0gMSAtIHh4IC0geno7XG4gICAgICAgIG91dG1bN10gPSB6eSAtIHd4O1xuXG4gICAgICAgIG91dG1bMl0gPSB6eCAtIHd5O1xuICAgICAgICBvdXRtWzVdID0genkgKyB3eDtcbiAgICAgICAgb3V0bVs4XSA9IDEgLSB4eCAtIHl5O1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlcyBhIDN4MyBtYXRyaXggZnJvbSB2aWV3IGRpcmVjdGlvbiBhbmQgdXAgZGlyZWN0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtNYXQzfSBvdXQgLSBNYXRyaXggdG8gc3RvcmUgcmVzdWx0LlxuICAgICAqIEBwYXJhbSB7dmVjM30gdmlldyAtIFZpZXcgZGlyZWN0aW9uIChtdXN0IGJlIG5vcm1hbGl6ZWQpLlxuICAgICAqIEBwYXJhbSB7dmVjM30gW3VwXSAtIFVwIGRpcmVjdGlvbiwgZGVmYXVsdCBpcyAoMCwxLDApIChtdXN0IGJlIG5vcm1hbGl6ZWQpLlxuICAgICAqXG4gICAgICogQHJldHVybnMge01hdDN9IG91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbVZpZXdVcCAob3V0OiBNYXQzLCB2aWV3OiBWZWMzLCB1cD86IFZlYzMpOiBNYXQzIHtcbiAgICAgICAgbGV0IF9mcm9tVmlld1VwSUlGRSA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgZGVmYXVsdF91cCA9IG5ldyBWZWMzKDAsIDEsIDApO1xuICAgICAgICAgICAgbGV0IHggPSBuZXcgVmVjMygpO1xuICAgICAgICAgICAgbGV0IHkgPSBuZXcgVmVjMygpO1xuXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG91dCwgdmlldywgdXApIHtcbiAgICAgICAgICAgICAgICBpZiAoVmVjMy5sZW5ndGhTcXIodmlldykgPCBFUFNJTE9OICogRVBTSUxPTikge1xuICAgICAgICAgICAgICAgICAgICBNYXQzLmlkZW50aXR5KG91dCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvdXQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdXAgPSB1cCB8fCBkZWZhdWx0X3VwO1xuICAgICAgICAgICAgICAgIFZlYzMubm9ybWFsaXplKHgsIFZlYzMuY3Jvc3MoeCwgdXAsIHZpZXcpKTtcblxuICAgICAgICAgICAgICAgIGlmIChWZWMzLmxlbmd0aFNxcih4KSA8IEVQU0lMT04gKiBFUFNJTE9OKSB7XG4gICAgICAgICAgICAgICAgICAgIE1hdDMuaWRlbnRpdHkob3V0KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBWZWMzLmNyb3NzKHksIHZpZXcsIHgpO1xuICAgICAgICAgICAgICAgIE1hdDMuc2V0KFxuICAgICAgICAgICAgICAgICAgICBvdXQsXG4gICAgICAgICAgICAgICAgICAgIHgueCwgeC55LCB4LnosXG4gICAgICAgICAgICAgICAgICAgIHkueCwgeS55LCB5LnosXG4gICAgICAgICAgICAgICAgICAgIHZpZXcueCwgdmlldy55LCB2aWV3LnpcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHJldHVybiBfZnJvbVZpZXdVcElJRkUob3V0LCB2aWV3LCB1cCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlcyBhIDN4MyBub3JtYWwgbWF0cml4ICh0cmFuc3Bvc2UgaW52ZXJzZSkgZnJvbSB0aGUgNHg0IG1hdHJpeC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TWF0M30gb3V0IC0gTWF0cml4IHRvIHN0b3JlIHJlc3VsdC5cbiAgICAgKiBAcGFyYW0ge21hdDR9IGEgLSBBIDR4NCBtYXRyaXggdG8gZGVyaXZlIHRoZSBub3JtYWwgbWF0cml4IGZyb20uXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7TWF0M30gb3V0LlxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgbm9ybWFsRnJvbU1hdDQgKG91dDogTWF0MywgYTogTWF0NCk6IE1hdDMge1xuICAgICAgICBsZXQgYW0gPSBhLm0sIG91dG0gPSBvdXQubTtcbiAgICAgICAgbGV0IGEwMCA9IGFtWzBdLCBhMDEgPSBhbVsxXSwgYTAyID0gYW1bMl0sIGEwMyA9IGFtWzNdLFxuICAgICAgICAgICAgYTEwID0gYW1bNF0sIGExMSA9IGFtWzVdLCBhMTIgPSBhbVs2XSwgYTEzID0gYW1bN10sXG4gICAgICAgICAgICBhMjAgPSBhbVs4XSwgYTIxID0gYW1bOV0sIGEyMiA9IGFtWzEwXSwgYTIzID0gYW1bMTFdLFxuICAgICAgICAgICAgYTMwID0gYW1bMTJdLCBhMzEgPSBhbVsxM10sIGEzMiA9IGFtWzE0XSwgYTMzID0gYW1bMTVdO1xuXG4gICAgICAgIGxldCBiMDAgPSBhMDAgKiBhMTEgLSBhMDEgKiBhMTA7XG4gICAgICAgIGxldCBiMDEgPSBhMDAgKiBhMTIgLSBhMDIgKiBhMTA7XG4gICAgICAgIGxldCBiMDIgPSBhMDAgKiBhMTMgLSBhMDMgKiBhMTA7XG4gICAgICAgIGxldCBiMDMgPSBhMDEgKiBhMTIgLSBhMDIgKiBhMTE7XG4gICAgICAgIGxldCBiMDQgPSBhMDEgKiBhMTMgLSBhMDMgKiBhMTE7XG4gICAgICAgIGxldCBiMDUgPSBhMDIgKiBhMTMgLSBhMDMgKiBhMTI7XG4gICAgICAgIGxldCBiMDYgPSBhMjAgKiBhMzEgLSBhMjEgKiBhMzA7XG4gICAgICAgIGxldCBiMDcgPSBhMjAgKiBhMzIgLSBhMjIgKiBhMzA7XG4gICAgICAgIGxldCBiMDggPSBhMjAgKiBhMzMgLSBhMjMgKiBhMzA7XG4gICAgICAgIGxldCBiMDkgPSBhMjEgKiBhMzIgLSBhMjIgKiBhMzE7XG4gICAgICAgIGxldCBiMTAgPSBhMjEgKiBhMzMgLSBhMjMgKiBhMzE7XG4gICAgICAgIGxldCBiMTEgPSBhMjIgKiBhMzMgLSBhMjMgKiBhMzI7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBkZXRlcm1pbmFudFxuICAgICAgICBsZXQgZGV0ID0gYjAwICogYjExIC0gYjAxICogYjEwICsgYjAyICogYjA5ICsgYjAzICogYjA4IC0gYjA0ICogYjA3ICsgYjA1ICogYjA2O1xuXG4gICAgICAgIGlmICghZGV0KSB7XG4gICAgICAgICAgICByZXR1cm4gb3V0O1xuICAgICAgICB9XG4gICAgICAgIGRldCA9IDEuMCAvIGRldDtcblxuICAgICAgICBvdXRtWzBdID0gKGExMSAqIGIxMSAtIGExMiAqIGIxMCArIGExMyAqIGIwOSkgKiBkZXQ7XG4gICAgICAgIG91dG1bMV0gPSAoYTEyICogYjA4IC0gYTEwICogYjExIC0gYTEzICogYjA3KSAqIGRldDtcbiAgICAgICAgb3V0bVsyXSA9IChhMTAgKiBiMTAgLSBhMTEgKiBiMDggKyBhMTMgKiBiMDYpICogZGV0O1xuXG4gICAgICAgIG91dG1bM10gPSAoYTAyICogYjEwIC0gYTAxICogYjExIC0gYTAzICogYjA5KSAqIGRldDtcbiAgICAgICAgb3V0bVs0XSA9IChhMDAgKiBiMTEgLSBhMDIgKiBiMDggKyBhMDMgKiBiMDcpICogZGV0O1xuICAgICAgICBvdXRtWzVdID0gKGEwMSAqIGIwOCAtIGEwMCAqIGIxMCAtIGEwMyAqIGIwNikgKiBkZXQ7XG5cbiAgICAgICAgb3V0bVs2XSA9IChhMzEgKiBiMDUgLSBhMzIgKiBiMDQgKyBhMzMgKiBiMDMpICogZGV0O1xuICAgICAgICBvdXRtWzddID0gKGEzMiAqIGIwMiAtIGEzMCAqIGIwNSAtIGEzMyAqIGIwMSkgKiBkZXQ7XG4gICAgICAgIG91dG1bOF0gPSAoYTMwICogYjA0IC0gYTMxICogYjAyICsgYTMzICogYjAwKSAqIGRldDtcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgRnJvYmVuaXVzIG5vcm0gb2YgYSBtYXRyaXguXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge01hdDN9IGEgLSBNYXRyaXggdG8gY2FsY3VsYXRlIEZyb2Jlbml1cyBub3JtIG9mLlxuICAgICAqIEByZXR1cm5zIHtOdW1iZXJ9IC0gVGhlIGZyb2Jlbml1cyBub3JtLlxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvYiAoYTogTWF0Myk6IG51bWJlciB7XG4gICAgICAgIGxldCBhbSA9IGEubTtcbiAgICAgICAgcmV0dXJuIChNYXRoLnNxcnQoTWF0aC5wb3coYW1bMF0sIDIpICsgTWF0aC5wb3coYW1bMV0sIDIpICsgTWF0aC5wb3coYW1bMl0sIDIpICsgTWF0aC5wb3coYW1bM10sIDIpICsgTWF0aC5wb3coYW1bNF0sIDIpICsgTWF0aC5wb3coYW1bNV0sIDIpICsgTWF0aC5wb3coYW1bNl0sIDIpICsgTWF0aC5wb3coYW1bN10sIDIpICsgTWF0aC5wb3coYW1bOF0sIDIpKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyB0d28gbWF0cmljZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge01hdDN9IG91dCAtIE1hdHJpeCB0byBzdG9yZSByZXN1bHQuXG4gICAgICogQHBhcmFtIHtNYXQzfSBhIC0gVGhlIGZpcnN0IG9wZXJhbmQuXG4gICAgICogQHBhcmFtIHtNYXQzfSBiIC0gVGhlIHNlY29uZCBvcGVyYW5kLlxuICAgICAqIEByZXR1cm5zIHtNYXQzfSBvdXQuXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBhZGQgKG91dDogTWF0MywgYTogTWF0MywgYjogTWF0Myk6IE1hdDMge1xuICAgICAgICBsZXQgYW0gPSBhLm0sIGJtID0gYi5tLCBvdXRtID0gb3V0Lm07XG4gICAgICAgIG91dG1bMF0gPSBhbVswXSArIGJtWzBdO1xuICAgICAgICBvdXRtWzFdID0gYW1bMV0gKyBibVsxXTtcbiAgICAgICAgb3V0bVsyXSA9IGFtWzJdICsgYm1bMl07XG4gICAgICAgIG91dG1bM10gPSBhbVszXSArIGJtWzNdO1xuICAgICAgICBvdXRtWzRdID0gYW1bNF0gKyBibVs0XTtcbiAgICAgICAgb3V0bVs1XSA9IGFtWzVdICsgYm1bNV07XG4gICAgICAgIG91dG1bNl0gPSBhbVs2XSArIGJtWzZdO1xuICAgICAgICBvdXRtWzddID0gYW1bN10gKyBibVs3XTtcbiAgICAgICAgb3V0bVs4XSA9IGFtWzhdICsgYm1bOF07XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3VidHJhY3RzIG1hdHJpeCBiIGZyb20gbWF0cml4IGEuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge01hdDN9IG91dCAtIE1hdHJpeCB0byBzdG9yZSByZXN1bHQuXG4gICAgICogQHBhcmFtIHtNYXQzfSBhIC0gVGhlIGZpcnN0IG9wZXJhbmQuXG4gICAgICogQHBhcmFtIHtNYXQzfSBiIC0gVGhlIHNlY29uZCBvcGVyYW5kLlxuICAgICAqIEByZXR1cm5zIHtNYXQzfSBvdXQuXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBzdWJ0cmFjdCAob3V0OiBNYXQzLCBhOiBNYXQzLCBiOiBNYXQzKTogTWF0MyB7XG4gICAgICAgIGxldCBhbSA9IGEubSwgYm0gPSBiLm0sIG91dG0gPSBvdXQubTtcbiAgICAgICAgb3V0bVswXSA9IGFtWzBdIC0gYm1bMF07XG4gICAgICAgIG91dG1bMV0gPSBhbVsxXSAtIGJtWzFdO1xuICAgICAgICBvdXRtWzJdID0gYW1bMl0gLSBibVsyXTtcbiAgICAgICAgb3V0bVszXSA9IGFtWzNdIC0gYm1bM107XG4gICAgICAgIG91dG1bNF0gPSBhbVs0XSAtIGJtWzRdO1xuICAgICAgICBvdXRtWzVdID0gYW1bNV0gLSBibVs1XTtcbiAgICAgICAgb3V0bVs2XSA9IGFtWzZdIC0gYm1bNl07XG4gICAgICAgIG91dG1bN10gPSBhbVs3XSAtIGJtWzddO1xuICAgICAgICBvdXRtWzhdID0gYW1bOF0gLSBibVs4XTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNdWx0aXBseSBlYWNoIGVsZW1lbnQgb2YgYSBtYXRyaXggYnkgYSBzY2FsYXIgbnVtYmVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtNYXQzfSBvdXQgLSBNYXRyaXggdG8gc3RvcmUgcmVzdWx0LlxuICAgICAqIEBwYXJhbSB7TWF0M30gYSAtIE1hdHJpeCB0byBzY2FsZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBiIC0gVGhlIHNjYWxlIG51bWJlci5cbiAgICAgKiBAcmV0dXJucyB7TWF0M30gb3V0LlxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgbXVsdGlwbHlTY2FsYXIgKG91dDogTWF0MywgYTogTWF0MywgYjogbnVtYmVyKTogTWF0MyB7XG4gICAgICAgIGxldCBhbSA9IGEubSwgb3V0bSA9IG91dC5tO1xuICAgICAgICBvdXRtWzBdID0gYW1bMF0gKiBiO1xuICAgICAgICBvdXRtWzFdID0gYW1bMV0gKiBiO1xuICAgICAgICBvdXRtWzJdID0gYW1bMl0gKiBiO1xuICAgICAgICBvdXRtWzNdID0gYW1bM10gKiBiO1xuICAgICAgICBvdXRtWzRdID0gYW1bNF0gKiBiO1xuICAgICAgICBvdXRtWzVdID0gYW1bNV0gKiBiO1xuICAgICAgICBvdXRtWzZdID0gYW1bNl0gKiBiO1xuICAgICAgICBvdXRtWzddID0gYW1bN10gKiBiO1xuICAgICAgICBvdXRtWzhdID0gYW1bOF0gKiBiO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZHMgdHdvIG1hdHJpY2VzIGFmdGVyIG11bHRpcGx5aW5nIGVhY2ggZWxlbWVudCBvZiB0aGUgc2Vjb25kIG9wZXJhbmQgYnkgYSBzY2FsYXIgbnVtYmVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtNYXQzfSBvdXQgLSBNYXRyaXggdG8gc3RvcmUgcmVzdWx0LlxuICAgICAqIEBwYXJhbSB7TWF0M30gYSAtIFRoZSBmaXJzdCBvcGVyYW5kLlxuICAgICAqIEBwYXJhbSB7TWF0M30gYiAtIFRoZSBzZWNvbmQgb3BlcmFuZC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gc2NhbGUgLSBUaGUgc2NhbGUgbnVtYmVyLlxuICAgICAqIEByZXR1cm5zIHtNYXQzfSBvdXQuXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBtdWx0aXBseVNjYWxhckFuZEFkZCAob3V0OiBNYXQzLCBhOiBNYXQzLCBiOiBNYXQzLCBzY2FsZTogbnVtYmVyKTogTWF0MyB7XG4gICAgICAgIGxldCBhbSA9IGEubSwgYm0gPSBiLm0sIG91dG0gPSBvdXQubTtcbiAgICAgICAgb3V0bVswXSA9IGFtWzBdICsgKGJtWzBdICogc2NhbGUpO1xuICAgICAgICBvdXRtWzFdID0gYW1bMV0gKyAoYm1bMV0gKiBzY2FsZSk7XG4gICAgICAgIG91dG1bMl0gPSBhbVsyXSArIChibVsyXSAqIHNjYWxlKTtcbiAgICAgICAgb3V0bVszXSA9IGFtWzNdICsgKGJtWzNdICogc2NhbGUpO1xuICAgICAgICBvdXRtWzRdID0gYW1bNF0gKyAoYm1bNF0gKiBzY2FsZSk7XG4gICAgICAgIG91dG1bNV0gPSBhbVs1XSArIChibVs1XSAqIHNjYWxlKTtcbiAgICAgICAgb3V0bVs2XSA9IGFtWzZdICsgKGJtWzZdICogc2NhbGUpO1xuICAgICAgICBvdXRtWzddID0gYW1bN10gKyAoYm1bN10gKiBzY2FsZSk7XG4gICAgICAgIG91dG1bOF0gPSBhbVs4XSArIChibVs4XSAqIHNjYWxlKTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHdoZXRoZXIgdGhlIHNwZWNpZmllZCBtYXRyaWNlcyBhcmUgZXF1YWwuIChDb21wYXJlZCB1c2luZyA9PT0pXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge01hdDN9IGEgLSBUaGUgZmlyc3QgbWF0cml4LlxuICAgICAqIEBwYXJhbSB7TWF0M30gYiAtIFRoZSBzZWNvbmQgbWF0cml4LlxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSBtYXRyaWNlcyBhcmUgZXF1YWwsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGV4YWN0RXF1YWxzIChhOiBNYXQzLCBiOiBNYXQzKTogYm9vbGVhbiB7XG4gICAgICAgIGxldCBhbSA9IGEubSwgYm0gPSBiLm07XG4gICAgICAgIHJldHVybiBhbVswXSA9PT0gYm1bMF0gJiYgYW1bMV0gPT09IGJtWzFdICYmIGFtWzJdID09PSBibVsyXSAmJlxuICAgICAgICAgICAgYW1bM10gPT09IGJtWzNdICYmIGFtWzRdID09PSBibVs0XSAmJiBhbVs1XSA9PT0gYm1bNV0gJiZcbiAgICAgICAgICAgIGFtWzZdID09PSBibVs2XSAmJiBhbVs3XSA9PT0gYm1bN10gJiYgYW1bOF0gPT09IGJtWzhdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgd2hldGhlciB0aGUgc3BlY2lmaWVkIG1hdHJpY2VzIGFyZSBhcHByb3hpbWF0ZWx5IGVxdWFsLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtNYXQzfSBhIC0gVGhlIGZpcnN0IG1hdHJpeC5cbiAgICAgKiBAcGFyYW0ge01hdDN9IGIgLSBUaGUgc2Vjb25kIG1hdHJpeC5cbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgbWF0cmljZXMgYXJlIGVxdWFsLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBlcXVhbHMgKGE6IE1hdDMsIGI6IE1hdDMpOiBib29sZWFuIHtcbiAgICAgICAgbGV0IGFtID0gYS5tLCBibSA9IGIubTtcbiAgICAgICAgbGV0IGEwID0gYW1bMF0sIGExID0gYW1bMV0sIGEyID0gYW1bMl0sIGEzID0gYW1bM10sIGE0ID0gYW1bNF0sIGE1ID0gYW1bNV0sIGE2ID0gYW1bNl0sIGE3ID0gYW1bN10sIGE4ID0gYW1bOF07XG4gICAgICAgIGxldCBiMCA9IGJtWzBdLCBiMSA9IGJtWzFdLCBiMiA9IGJtWzJdLCBiMyA9IGJtWzNdLCBiNCA9IGJtWzRdLCBiNSA9IGJtWzVdLCBiNiA9IGJtWzZdLCBiNyA9IGJtWzddLCBiOCA9IGJtWzhdO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgTWF0aC5hYnMoYTAgLSBiMCkgPD0gRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTApLCBNYXRoLmFicyhiMCkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhMSAtIGIxKSA8PSBFUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhMSksIE1hdGguYWJzKGIxKSkgJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGEyIC0gYjIpIDw9IEVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEyKSwgTWF0aC5hYnMoYjIpKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYTMgLSBiMykgPD0gRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTMpLCBNYXRoLmFicyhiMykpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhNCAtIGI0KSA8PSBFUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhNCksIE1hdGguYWJzKGI0KSkgJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGE1IC0gYjUpIDw9IEVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGE1KSwgTWF0aC5hYnMoYjUpKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYTYgLSBiNikgPD0gRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTYpLCBNYXRoLmFicyhiNikpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhNyAtIGI3KSA8PSBFUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhNyksIE1hdGguYWJzKGI3KSkgJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGE4IC0gYjgpIDw9IEVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGE4KSwgTWF0aC5hYnMoYjgpKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg55+p6Zi16L2s5pWw57uEXG4gICAgICogISNlbiBNYXRyaXggdHJhbnNwb3NlIGFycmF5XG4gICAgICogQG1ldGhvZCB0b0FycmF5XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdGF0aWMgdG9BcnJheSA8T3V0IGV4dGVuZHMgSVdyaXRhYmxlQXJyYXlMaWtlPG51bWJlcj4+IChvdXQ6IE91dCwgbWF0OiBJTWF0M0xpa2UsIG9mcyA9IDApXG4gICAgICogQHBhcmFtIG9mcyDmlbDnu4TlhoXnmoTotbflp4vlgY/np7vph49cbiAgICAgKi9cbiAgICBzdGF0aWMgdG9BcnJheSA8T3V0IGV4dGVuZHMgSVdyaXRhYmxlQXJyYXlMaWtlPG51bWJlcj4+IChvdXQ6IE91dCwgbWF0OiBJTWF0M0xpa2UsIG9mcyA9IDApIHtcbiAgICAgICAgbGV0IG0gPSBtYXQubTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA5OyBpKyspIHtcbiAgICAgICAgICAgIG91dFtvZnMgKyBpXSA9IG1baV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOaVsOe7hOi9rOefqemYtVxuICAgICAqICEjZW4gVHJhbnNmZXIgbWF0cml4IGFycmF5XG4gICAgICogQG1ldGhvZCBmcm9tQXJyYXlcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0YXRpYyBmcm9tQXJyYXkgPE91dCBleHRlbmRzIElNYXQzTGlrZT4gKG91dDogT3V0LCBhcnI6IElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+LCBvZnMgPSAwKVxuICAgICAqIEBwYXJhbSBvZnMg5pWw57uE6LW35aeL5YGP56e76YePXG4gICAgICovXG4gICAgc3RhdGljIGZyb21BcnJheSA8T3V0IGV4dGVuZHMgSU1hdDNMaWtlPiAob3V0OiBPdXQsIGFycjogSVdyaXRhYmxlQXJyYXlMaWtlPG51bWJlcj4sIG9mcyA9IDApIHtcbiAgICAgICAgbGV0IG0gPSBvdXQubTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA5OyBpKyspIHtcbiAgICAgICAgICAgIG1baV0gPSBhcnJbb2ZzICsgaV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIE1hdHJpeCBEYXRhXG4gICAgICogISN6aCDnn6npmLXmlbDmja5cbiAgICAgKiBAcHJvcGVydHkge0Zsb2F0NjRBcnJheSB8IEZsb2F0MzJBcnJheX0gbVxuICAgICAqL1xuICAgIG06IEZsb2F0QXJyYXk7XG5cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBtYXRyaXgsIHdpdGggZWxlbWVudHMgc3BlY2lmaWVkIHNlcGFyYXRlbHkuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGNvbnN0cnVjdG9yXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdHJ1Y3RvciAoXG4gICAgICAgICAgICBtMDA6IG51bWJlciB8IEZsb2F0MzJBcnJheSA9IDEsIG0wMSA9IDAsIG0wMiA9IDAsXG4gICAgICAgICAgICBtMDMgPSAwLCBtMDQgPSAxLCBtMDUgPSAwLFxuICAgICAgICAgICAgbTA2ID0gMCwgbTA3ID0gMCwgbTA4ID0gMVxuICAgICAgICApXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKFxuICAgICAgICBtMDA6IG51bWJlciB8IEZsb2F0QXJyYXkgPSAxLCBtMDEgPSAwLCBtMDIgPSAwLFxuICAgICAgICBtMDMgPSAwLCBtMDQgPSAxLCBtMDUgPSAwLFxuICAgICAgICBtMDYgPSAwLCBtMDcgPSAwLCBtMDggPSAxXG4gICAgKSB7XG4gICAgICAgIGlmIChtMDAgaW5zdGFuY2VvZiBGTE9BVF9BUlJBWV9UWVBFKSB7XG4gICAgICAgICAgICB0aGlzLm0gPSBtMDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm0gPSBuZXcgRkxPQVRfQVJSQVlfVFlQRSg5KTtcbiAgICAgICAgICAgIGxldCBtID0gdGhpcy5tO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUaGUgZWxlbWVudCBhdCBjb2x1bW4gMCByb3cgMC5cbiAgICAgICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAgICAgKiAqL1xuICAgICAgICAgICAgbVswXSA9IG0wMDtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUaGUgZWxlbWVudCBhdCBjb2x1bW4gMCByb3cgMS5cbiAgICAgICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAgICAgKiAqL1xuICAgICAgICAgICAgbVsxXSA9IG0wMTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUaGUgZWxlbWVudCBhdCBjb2x1bW4gMCByb3cgMi5cbiAgICAgICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAgICAgKiAqL1xuICAgICAgICAgICAgbVsyXSA9IG0wMjtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUaGUgZWxlbWVudCBhdCBjb2x1bW4gMSByb3cgMC5cbiAgICAgICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAgICAgKiAqL1xuICAgICAgICAgICAgbVszXSA9IG0wMztcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUaGUgZWxlbWVudCBhdCBjb2x1bW4gMSByb3cgMS5cbiAgICAgICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAgICAgKiAqL1xuICAgICAgICAgICAgbVs0XSA9IG0wNDtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUaGUgZWxlbWVudCBhdCBjb2x1bW4gMSByb3cgMi5cbiAgICAgICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAgICAgKiAqL1xuICAgICAgICAgICAgbVs1XSA9IG0wNTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUaGUgZWxlbWVudCBhdCBjb2x1bW4gMiByb3cgMC5cbiAgICAgICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAgICAgKiAqL1xuICAgICAgICAgICAgbVs2XSA9IG0wNjtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUaGUgZWxlbWVudCBhdCBjb2x1bW4gMiByb3cgMS5cbiAgICAgICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAgICAgKiAqL1xuICAgICAgICAgICAgbVs3XSA9IG0wNztcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUaGUgZWxlbWVudCBhdCBjb2x1bW4gMiByb3cgMi5cbiAgICAgICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAgICAgKiAqL1xuICAgICAgICAgICAgbVs4XSA9IG0wODtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIG1hdHJpeC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TWF0M30gYSAtIFRoZSBtYXRyaXguXG4gICAgICogQHJldHVybnMge1N0cmluZ30gU3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgbWF0cml4LlxuICAgICAqL1xuICAgIHRvU3RyaW5nICgpIHtcbiAgICAgICAgbGV0IGFtID0gdGhpcy5tO1xuICAgICAgICByZXR1cm4gYG1hdDMoJHthbVswXX0sICR7YW1bMV19LCAke2FtWzJdfSwgJHthbVszXX0sICR7YW1bNF19LCAke2FtWzVdfSwgJHthbVs2XX0sICR7YW1bN119LCAke2FtWzhdfSlgO1xuICAgIH1cbn1cblxuY2MuTWF0MyA9IE1hdDM7XG4iXX0=