
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/geom-utils/intersect.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _gfx = _interopRequireDefault(require("../../renderer/gfx"));

var _recyclePool = _interopRequireDefault(require("../../renderer/memop/recycle-pool"));

var _valueTypes = require("../value-types");

var _aabb = _interopRequireDefault(require("./aabb"));

var distance = _interopRequireWildcard(require("./distance"));

var _enums = _interopRequireDefault(require("./enums"));

var _ray = _interopRequireDefault(require("./ray"));

var _triangle = _interopRequireDefault(require("./triangle"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
var ray_mesh = function () {
  var tri = _triangle["default"].create();

  var minDist = Infinity;

  function getVec3(out, data, idx, stride) {
    _valueTypes.Vec3.set(out, data[idx * stride], data[idx * stride + 1], data[idx * stride + 2]);
  }

  return function (ray, mesh) {
    minDist = Infinity;
    var subMeshes = mesh._subMeshes;

    for (var i = 0; i < subMeshes.length; i++) {
      if (subMeshes[i]._primitiveType !== _gfx["default"].PT_TRIANGLES) continue;
      var subData = mesh._subDatas[i] || mesh._subDatas[0];

      var posData = mesh._getAttrMeshData(i, _gfx["default"].ATTR_POSITION);

      var iData = subData.getIData(Uint16Array);
      var format = subData.vfm;
      var fmt = format.element(_gfx["default"].ATTR_POSITION);
      var num = fmt.num;

      for (var _i = 0; _i < iData.length; _i += 3) {
        getVec3(tri.a, posData, iData[_i], num);
        getVec3(tri.b, posData, iData[_i + 1], num);
        getVec3(tri.c, posData, iData[_i + 2], num);
        var dist = ray_triangle(ray, tri);

        if (dist > 0 && dist < minDist) {
          minDist = dist;
        }
      }
    }

    return minDist;
  };
}(); // adapt to old api


var rayMesh = ray_mesh;
/** 
 * !#en
 * Check whether ray intersect with nodes
 * !#zh
 * 检测射线是否与物体有交集
 * @method ray_cast
 * @param {Node} root - If root is null, then traversal nodes from scene node
 * @param {Ray} worldRay
 * @param {Function} handler
 * @param {Function} filter
 * @return {[]} [{node, distance}]
*/

var ray_cast = function () {
  function traversal(node, cb) {
    var children = node.children;

    for (var i = children.length - 1; i >= 0; i--) {
      var child = children[i];
      traversal(child, cb);
    }

    cb(node);
  }

  function cmp(a, b) {
    return a.distance - b.distance;
  }

  function transformMat4Normal(out, a, m) {
    var mm = m.m;
    var x = a.x,
        y = a.y,
        z = a.z,
        rhw = mm[3] * x + mm[7] * y + mm[11] * z;
    rhw = rhw ? 1 / rhw : 1;
    out.x = (mm[0] * x + mm[4] * y + mm[8] * z) * rhw;
    out.y = (mm[1] * x + mm[5] * y + mm[9] * z) * rhw;
    out.z = (mm[2] * x + mm[6] * y + mm[10] * z) * rhw;
    return out;
  }

  var resultsPool = new _recyclePool["default"](function () {
    return {
      distance: 0,
      node: null
    };
  }, 1);
  var results = []; // temp variable

  var nodeAabb = _aabb["default"].create();

  var minPos = new _valueTypes.Vec3();
  var maxPos = new _valueTypes.Vec3();
  var modelRay = new _ray["default"]();
  var m4_1 = cc.mat4();
  var m4_2 = cc.mat4();
  var d = new _valueTypes.Vec3();

  function distanceValid(distance) {
    return distance > 0 && distance < Infinity;
  }

  return function (root, worldRay, handler, filter) {
    resultsPool.reset();
    results.length = 0;
    root = root || cc.director.getScene();
    traversal(root, function (node) {
      if (filter && !filter(node)) return; // transform world ray to model ray

      _valueTypes.Mat4.invert(m4_2, node.getWorldMatrix(m4_1));

      _valueTypes.Vec3.transformMat4(modelRay.o, worldRay.o, m4_2);

      _valueTypes.Vec3.normalize(modelRay.d, transformMat4Normal(modelRay.d, worldRay.d, m4_2)); // raycast with bounding box


      var distance = Infinity;
      var component = node._renderComponent;

      if (component instanceof cc.MeshRenderer) {
        distance = ray_aabb(modelRay, component._boundingBox);
      } else if (node.width && node.height) {
        _valueTypes.Vec3.set(minPos, -node.width * node.anchorX, -node.height * node.anchorY, node.z);

        _valueTypes.Vec3.set(maxPos, node.width * (1 - node.anchorX), node.height * (1 - node.anchorY), node.z);

        _aabb["default"].fromPoints(nodeAabb, minPos, maxPos);

        distance = ray_aabb(modelRay, nodeAabb);
      }

      if (!distanceValid(distance)) return;

      if (handler) {
        distance = handler(modelRay, node, distance);
      }

      if (distanceValid(distance)) {
        _valueTypes.Vec3.scale(d, modelRay.d, distance);

        transformMat4Normal(d, d, m4_1);
        var res = resultsPool.add();
        res.node = node;
        res.distance = _valueTypes.Vec3.mag(d);
        results.push(res);
      }
    });
    results.sort(cmp);
    return results;
  };
}(); // adapt to old api


var raycast = ray_cast;
/**
 * !#en ray-plane intersect<br/>
 * !#zh 射线与平面的相交性检测。
 * @method ray_plane
 * @param {Ray} ray
 * @param {Plane} plane
 * @return {number} 0 or not 0
 */

var ray_plane = function () {
  var pt = new _valueTypes.Vec3(0, 0, 0);
  return function (ray, plane) {
    var denom = _valueTypes.Vec3.dot(ray.d, plane.n);

    if (Math.abs(denom) < Number.EPSILON) {
      return 0;
    }

    _valueTypes.Vec3.multiplyScalar(pt, plane.n, plane.d);

    var t = _valueTypes.Vec3.dot(_valueTypes.Vec3.subtract(pt, pt, ray.o), plane.n) / denom;

    if (t < 0) {
      return 0;
    }

    return t;
  };
}();
/**
 * !#en line-plane intersect<br/>
 * !#zh 线段与平面的相交性检测。
 * @method line_plane
 * @param {Line} line
 * @param {Plane} plane
 * @return {number} 0 or not 0
 */


var line_plane = function () {
  var ab = new _valueTypes.Vec3(0, 0, 0);
  return function (line, plane) {
    _valueTypes.Vec3.subtract(ab, line.e, line.s);

    var t = (plane.d - _valueTypes.Vec3.dot(line.s, plane.n)) / _valueTypes.Vec3.dot(ab, plane.n);

    if (t < 0 || t > 1) {
      return 0;
    }

    return t;
  };
}(); // based on http://fileadmin.cs.lth.se/cs/Personal/Tomas_Akenine-Moller/raytri/

/**
 * !#en ray-triangle intersect<br/>
 * !#zh 射线与三角形的相交性检测。
 * @method ray_triangle
 * @param {Ray} ray
 * @param {Triangle} triangle
 * @param {boolean} doubleSided
 * @return {number} 0 or not 0
 */


var ray_triangle = function () {
  var ab = new _valueTypes.Vec3(0, 0, 0);
  var ac = new _valueTypes.Vec3(0, 0, 0);
  var pvec = new _valueTypes.Vec3(0, 0, 0);
  var tvec = new _valueTypes.Vec3(0, 0, 0);
  var qvec = new _valueTypes.Vec3(0, 0, 0);
  return function (ray, triangle, doubleSided) {
    _valueTypes.Vec3.subtract(ab, triangle.b, triangle.a);

    _valueTypes.Vec3.subtract(ac, triangle.c, triangle.a);

    _valueTypes.Vec3.cross(pvec, ray.d, ac);

    var det = _valueTypes.Vec3.dot(ab, pvec);

    if (det < Number.EPSILON && (!doubleSided || det > -Number.EPSILON)) {
      return 0;
    }

    var inv_det = 1 / det;

    _valueTypes.Vec3.subtract(tvec, ray.o, triangle.a);

    var u = _valueTypes.Vec3.dot(tvec, pvec) * inv_det;

    if (u < 0 || u > 1) {
      return 0;
    }

    _valueTypes.Vec3.cross(qvec, tvec, ab);

    var v = _valueTypes.Vec3.dot(ray.d, qvec) * inv_det;

    if (v < 0 || u + v > 1) {
      return 0;
    }

    var t = _valueTypes.Vec3.dot(ac, qvec) * inv_det;
    return t < 0 ? 0 : t;
  };
}(); // adapt to old api


var rayTriangle = ray_triangle;
/**
 * !#en line-triangle intersect<br/>
 * !#zh 线段与三角形的相交性检测。
 * @method line_triangle
 * @param {Line} line
 * @param {Triangle} triangle
 * @param {Vec3} outPt optional, The intersection point
 * @return {number} 0 or not 0
 */

var line_triangle = function () {
  var ab = new _valueTypes.Vec3(0, 0, 0);
  var ac = new _valueTypes.Vec3(0, 0, 0);
  var qp = new _valueTypes.Vec3(0, 0, 0);
  var ap = new _valueTypes.Vec3(0, 0, 0);
  var n = new _valueTypes.Vec3(0, 0, 0);
  var e = new _valueTypes.Vec3(0, 0, 0);
  return function (line, triangle, outPt) {
    _valueTypes.Vec3.subtract(ab, triangle.b, triangle.a);

    _valueTypes.Vec3.subtract(ac, triangle.c, triangle.a);

    _valueTypes.Vec3.subtract(qp, line.s, line.e);

    _valueTypes.Vec3.cross(n, ab, ac);

    var det = _valueTypes.Vec3.dot(qp, n);

    if (det <= 0.0) {
      return 0;
    }

    _valueTypes.Vec3.subtract(ap, line.s, triangle.a);

    var t = _valueTypes.Vec3.dot(ap, n);

    if (t < 0 || t > det) {
      return 0;
    }

    _valueTypes.Vec3.cross(e, qp, ap);

    var v = _valueTypes.Vec3.dot(ac, e);

    if (v < 0 || v > det) {
      return 0;
    }

    var w = -_valueTypes.Vec3.dot(ab, e);

    if (w < 0.0 || v + w > det) {
      return 0;
    }

    if (outPt) {
      var invDet = 1.0 / det;
      v *= invDet;
      w *= invDet;
      var u = 1.0 - v - w; // outPt = u*a + v*d + w*c;

      _valueTypes.Vec3.set(outPt, triangle.a.x * u + triangle.b.x * v + triangle.c.x * w, triangle.a.y * u + triangle.b.y * v + triangle.c.y * w, triangle.a.z * u + triangle.b.z * v + triangle.c.z * w);
    }

    return 1;
  };
}();
/**
 * !#en line-quad intersect<br/>
 * !#zh 线段与四边形的相交性检测。
 * @method line_quad
 * @param {Vec3} p A point on a line segment
 * @param {Vec3} q Another point on the line segment
 * @param {Vec3} a Quadrilateral point a
 * @param {Vec3} b Quadrilateral point b
 * @param {Vec3} c Quadrilateral point c
 * @param {Vec3} d Quadrilateral point d
 * @param {Vec3} outPt optional, The intersection point
 * @return {number} 0 or not 0
 */


var line_quad = function () {
  var pq = new _valueTypes.Vec3(0, 0, 0);
  var pa = new _valueTypes.Vec3(0, 0, 0);
  var pb = new _valueTypes.Vec3(0, 0, 0);
  var pc = new _valueTypes.Vec3(0, 0, 0);
  var pd = new _valueTypes.Vec3(0, 0, 0);
  var m = new _valueTypes.Vec3(0, 0, 0);
  var tmp = new _valueTypes.Vec3(0, 0, 0);
  return function (p, q, a, b, c, d, outPt) {
    _valueTypes.Vec3.subtract(pq, q, p);

    _valueTypes.Vec3.subtract(pa, a, p);

    _valueTypes.Vec3.subtract(pb, b, p);

    _valueTypes.Vec3.subtract(pc, c, p); // Determine which triangle to test against by testing against diagonal first


    _valueTypes.Vec3.cross(m, pc, pq);

    var v = _valueTypes.Vec3.dot(pa, m);

    if (v >= 0) {
      // Test intersection against triangle abc
      var u = -_valueTypes.Vec3.dot(pb, m);

      if (u < 0) {
        return 0;
      }

      var w = _valueTypes.Vec3.dot(_valueTypes.Vec3.cross(tmp, pq, pb), pa);

      if (w < 0) {
        return 0;
      } // outPt = u*a + v*b + w*c;


      if (outPt) {
        var denom = 1.0 / (u + v + w);
        u *= denom;
        v *= denom;
        w *= denom;

        _valueTypes.Vec3.set(outPt, a.x * u + b.x * v + c.x * w, a.y * u + b.y * v + c.y * w, a.z * u + b.z * v + c.z * w);
      }
    } else {
      // Test intersection against triangle dac
      _valueTypes.Vec3.subtract(pd, d, p);

      var _u = _valueTypes.Vec3.dot(pd, m);

      if (_u < 0) {
        return 0;
      }

      var _w = _valueTypes.Vec3.dot(_valueTypes.Vec3.cross(tmp, pq, pa), pd);

      if (_w < 0) {
        return 0;
      } // outPt = u*a + v*d + w*c;


      if (outPt) {
        v = -v;

        var _denom = 1.0 / (_u + v + _w);

        _u *= _denom;
        v *= _denom;
        _w *= _denom;

        _valueTypes.Vec3.set(outPt, a.x * _u + d.x * v + c.x * _w, a.y * _u + d.y * v + c.y * _w, a.z * _u + d.z * v + c.z * _w);
      }
    }

    return 1;
  };
}();
/**
 * !#en ray-sphere intersect<br/>
 * !#zh 射线和球的相交性检测。
 * @method ray_sphere
 * @param {Ray} ray
 * @param {Sphere} sphere
 * @return {number} 0 or not 0
 */


var ray_sphere = function () {
  var e = new _valueTypes.Vec3(0, 0, 0);
  return function (ray, sphere) {
    var r = sphere.radius;
    var c = sphere.center;
    var o = ray.o;
    var d = ray.d;
    var rSq = r * r;

    _valueTypes.Vec3.subtract(e, c, o);

    var eSq = e.lengthSqr();

    var aLength = _valueTypes.Vec3.dot(e, d); // assume ray direction already normalized


    var fSq = rSq - (eSq - aLength * aLength);

    if (fSq < 0) {
      return 0;
    }

    var f = Math.sqrt(fSq);
    var t = eSq < rSq ? aLength + f : aLength - f;

    if (t < 0) {
      return 0;
    }

    return t;
  };
}();
/**
 * !#en ray-aabb intersect<br/>
 * !#zh 射线和轴对齐包围盒的相交性检测。
 * @method ray_aabb
 * @param {Ray} ray
 * @param {Aabb} aabb Align the axis around the box
 * @return {number} 0 or not 0
 */


var ray_aabb = function () {
  var min = new _valueTypes.Vec3();
  var max = new _valueTypes.Vec3();
  return function (ray, aabb) {
    var o = ray.o,
        d = ray.d;
    var ix = 1 / d.x,
        iy = 1 / d.y,
        iz = 1 / d.z;

    _valueTypes.Vec3.subtract(min, aabb.center, aabb.halfExtents);

    _valueTypes.Vec3.add(max, aabb.center, aabb.halfExtents);

    var t1 = (min.x - o.x) * ix;
    var t2 = (max.x - o.x) * ix;
    var t3 = (min.y - o.y) * iy;
    var t4 = (max.y - o.y) * iy;
    var t5 = (min.z - o.z) * iz;
    var t6 = (max.z - o.z) * iz;
    var tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6));
    var tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6));

    if (tmax < 0 || tmin > tmax) {
      return 0;
    }

    ;
    return tmin;
  };
}(); // adapt to old api


var rayAabb = ray_aabb;
/**
 * !#en ray-obb intersect<br/>
 * !#zh 射线和方向包围盒的相交性检测。
 * @method ray_obb
 * @param {Ray} ray
 * @param {Obb} obb Direction box
 * @return {number} 0 or or 0
 */

var ray_obb = function () {
  var center = new _valueTypes.Vec3();
  var o = new _valueTypes.Vec3();
  var d = new _valueTypes.Vec3();
  var X = new _valueTypes.Vec3();
  var Y = new _valueTypes.Vec3();
  var Z = new _valueTypes.Vec3();
  var p = new _valueTypes.Vec3();
  var size = new Array(3);
  var f = new Array(3);
  var e = new Array(3);
  var t = new Array(6);
  return function (ray, obb) {
    size[0] = obb.halfExtents.x;
    size[1] = obb.halfExtents.y;
    size[2] = obb.halfExtents.z;
    center = obb.center;
    o = ray.o;
    d = ray.d;
    var obbm = obb.orientation.m;

    _valueTypes.Vec3.set(X, obbm[0], obbm[1], obbm[2]);

    _valueTypes.Vec3.set(Y, obbm[3], obbm[4], obbm[5]);

    _valueTypes.Vec3.set(Z, obbm[6], obbm[7], obbm[8]);

    _valueTypes.Vec3.subtract(p, center, o); // The cos values of the ray on the X, Y, Z


    f[0] = _valueTypes.Vec3.dot(X, d);
    f[1] = _valueTypes.Vec3.dot(Y, d);
    f[2] = _valueTypes.Vec3.dot(Z, d); // The projection length of P on X, Y, Z

    e[0] = _valueTypes.Vec3.dot(X, p);
    e[1] = _valueTypes.Vec3.dot(Y, p);
    e[2] = _valueTypes.Vec3.dot(Z, p);

    for (var i = 0; i < 3; ++i) {
      if (f[i] === 0) {
        if (-e[i] - size[i] > 0 || -e[i] + size[i] < 0) {
          return 0;
        } // Avoid div by 0!


        f[i] = 0.0000001;
      } // min


      t[i * 2 + 0] = (e[i] + size[i]) / f[i]; // max

      t[i * 2 + 1] = (e[i] - size[i]) / f[i];
    }

    var tmin = Math.max(Math.max(Math.min(t[0], t[1]), Math.min(t[2], t[3])), Math.min(t[4], t[5]));
    var tmax = Math.min(Math.min(Math.max(t[0], t[1]), Math.max(t[2], t[3])), Math.max(t[4], t[5]));

    if (tmax < 0 || tmin > tmax || tmin < 0) {
      return 0;
    }

    return tmin;
  };
}();
/**
 * !#en aabb-aabb intersect<br/>
 * !#zh 轴对齐包围盒和轴对齐包围盒的相交性检测。
 * @method aabb_aabb
 * @param {Aabb} aabb1 Axis alignment surrounds box 1
 * @param {Aabb} aabb2 Axis alignment surrounds box 2
 * @return {number} 0 or not 0
 */


var aabb_aabb = function () {
  var aMin = new _valueTypes.Vec3();
  var aMax = new _valueTypes.Vec3();
  var bMin = new _valueTypes.Vec3();
  var bMax = new _valueTypes.Vec3();
  return function (aabb1, aabb2) {
    _valueTypes.Vec3.subtract(aMin, aabb1.center, aabb1.halfExtents);

    _valueTypes.Vec3.add(aMax, aabb1.center, aabb1.halfExtents);

    _valueTypes.Vec3.subtract(bMin, aabb2.center, aabb2.halfExtents);

    _valueTypes.Vec3.add(bMax, aabb2.center, aabb2.halfExtents);

    return aMin.x <= bMax.x && aMax.x >= bMin.x && aMin.y <= bMax.y && aMax.y >= bMin.y && aMin.z <= bMax.z && aMax.z >= bMin.z;
  };
}();

function getAABBVertices(min, max, out) {
  _valueTypes.Vec3.set(out[0], min.x, max.y, max.z);

  _valueTypes.Vec3.set(out[1], min.x, max.y, min.z);

  _valueTypes.Vec3.set(out[2], min.x, min.y, max.z);

  _valueTypes.Vec3.set(out[3], min.x, min.y, min.z);

  _valueTypes.Vec3.set(out[4], max.x, max.y, max.z);

  _valueTypes.Vec3.set(out[5], max.x, max.y, min.z);

  _valueTypes.Vec3.set(out[6], max.x, min.y, max.z);

  _valueTypes.Vec3.set(out[7], max.x, min.y, min.z);
}

function getOBBVertices(c, e, a1, a2, a3, out) {
  _valueTypes.Vec3.set(out[0], c.x + a1.x * e.x + a2.x * e.y + a3.x * e.z, c.y + a1.y * e.x + a2.y * e.y + a3.y * e.z, c.z + a1.z * e.x + a2.z * e.y + a3.z * e.z);

  _valueTypes.Vec3.set(out[1], c.x - a1.x * e.x + a2.x * e.y + a3.x * e.z, c.y - a1.y * e.x + a2.y * e.y + a3.y * e.z, c.z - a1.z * e.x + a2.z * e.y + a3.z * e.z);

  _valueTypes.Vec3.set(out[2], c.x + a1.x * e.x - a2.x * e.y + a3.x * e.z, c.y + a1.y * e.x - a2.y * e.y + a3.y * e.z, c.z + a1.z * e.x - a2.z * e.y + a3.z * e.z);

  _valueTypes.Vec3.set(out[3], c.x + a1.x * e.x + a2.x * e.y - a3.x * e.z, c.y + a1.y * e.x + a2.y * e.y - a3.y * e.z, c.z + a1.z * e.x + a2.z * e.y - a3.z * e.z);

  _valueTypes.Vec3.set(out[4], c.x - a1.x * e.x - a2.x * e.y - a3.x * e.z, c.y - a1.y * e.x - a2.y * e.y - a3.y * e.z, c.z - a1.z * e.x - a2.z * e.y - a3.z * e.z);

  _valueTypes.Vec3.set(out[5], c.x + a1.x * e.x - a2.x * e.y - a3.x * e.z, c.y + a1.y * e.x - a2.y * e.y - a3.y * e.z, c.z + a1.z * e.x - a2.z * e.y - a3.z * e.z);

  _valueTypes.Vec3.set(out[6], c.x - a1.x * e.x + a2.x * e.y - a3.x * e.z, c.y - a1.y * e.x + a2.y * e.y - a3.y * e.z, c.z - a1.z * e.x + a2.z * e.y - a3.z * e.z);

  _valueTypes.Vec3.set(out[7], c.x - a1.x * e.x - a2.x * e.y + a3.x * e.z, c.y - a1.y * e.x - a2.y * e.y + a3.y * e.z, c.z - a1.z * e.x - a2.z * e.y + a3.z * e.z);
}

function getInterval(vertices, axis) {
  var min = _valueTypes.Vec3.dot(axis, vertices[0]),
      max = min;

  for (var i = 1; i < 8; ++i) {
    var projection = _valueTypes.Vec3.dot(axis, vertices[i]);

    min = projection < min ? projection : min;
    max = projection > max ? projection : max;
  }

  return [min, max];
}
/**
 * !#en aabb-obb intersect<br/>
 * !#zh 轴对齐包围盒和方向包围盒的相交性检测。
 * @method aabb_obb
 * @param {Aabb} aabb Align the axis around the box
 * @param {Obb} obb Direction box
 * @return {number} 0 or not 0
 */


var aabb_obb = function () {
  var test = new Array(15);

  for (var i = 0; i < 15; i++) {
    test[i] = new _valueTypes.Vec3(0, 0, 0);
  }

  var vertices = new Array(8);
  var vertices2 = new Array(8);

  for (var _i2 = 0; _i2 < 8; _i2++) {
    vertices[_i2] = new _valueTypes.Vec3(0, 0, 0);
    vertices2[_i2] = new _valueTypes.Vec3(0, 0, 0);
  }

  var min = new _valueTypes.Vec3();
  var max = new _valueTypes.Vec3();
  return function (aabb, obb) {
    var obbm = obb.orientation.m;

    _valueTypes.Vec3.set(test[0], 1, 0, 0);

    _valueTypes.Vec3.set(test[1], 0, 1, 0);

    _valueTypes.Vec3.set(test[2], 0, 0, 1);

    _valueTypes.Vec3.set(test[3], obbm[0], obbm[1], obbm[2]);

    _valueTypes.Vec3.set(test[4], obbm[3], obbm[4], obbm[5]);

    _valueTypes.Vec3.set(test[5], obbm[6], obbm[7], obbm[8]);

    for (var _i3 = 0; _i3 < 3; ++_i3) {
      // Fill out rest of axis
      _valueTypes.Vec3.cross(test[6 + _i3 * 3 + 0], test[_i3], test[0]);

      _valueTypes.Vec3.cross(test[6 + _i3 * 3 + 1], test[_i3], test[1]);

      _valueTypes.Vec3.cross(test[6 + _i3 * 3 + 1], test[_i3], test[2]);
    }

    _valueTypes.Vec3.subtract(min, aabb.center, aabb.halfExtents);

    _valueTypes.Vec3.add(max, aabb.center, aabb.halfExtents);

    getAABBVertices(min, max, vertices);
    getOBBVertices(obb.center, obb.halfExtents, test[3], test[4], test[5], vertices2);

    for (var j = 0; j < 15; ++j) {
      var a = getInterval(vertices, test[j]);
      var b = getInterval(vertices2, test[j]);

      if (b[0] > a[1] || a[0] > b[1]) {
        return 0; // Seperating axis found
      }
    }

    return 1;
  };
}();
/**
 * !#en aabb-plane intersect<br/>
 * !#zh 轴对齐包围盒和平面的相交性检测。
 * @method aabb_plane
 * @param {Aabb} aabb Align the axis around the box
 * @param {Plane} plane
 * @return {number} inside(back) = -1, outside(front) = 0, intersect = 1
 */


var aabb_plane = function aabb_plane(aabb, plane) {
  var r = aabb.halfExtents.x * Math.abs(plane.n.x) + aabb.halfExtents.y * Math.abs(plane.n.y) + aabb.halfExtents.z * Math.abs(plane.n.z);

  var dot = _valueTypes.Vec3.dot(plane.n, aabb.center);

  if (dot + r < plane.d) {
    return -1;
  } else if (dot - r > plane.d) {
    return 0;
  }

  return 1;
};
/**
 * !#en aabb-frustum intersect, faster but has false positive corner cases<br/>
 * !#zh 轴对齐包围盒和锥台相交性检测，速度快，但有错误情况。
 * @method aabb_frustum
 * @param {Aabb} aabb Align the axis around the box
 * @param {Frustum} frustum
 * @return {number} 0 or not 0
 */


var aabb_frustum = function aabb_frustum(aabb, frustum) {
  for (var i = 0; i < frustum.planes.length; i++) {
    // frustum plane normal points to the inside
    if (aabb_plane(aabb, frustum.planes[i]) === -1) {
      return 0;
    }
  } // completely outside


  return 1;
}; // https://cesium.com/blog/2017/02/02/tighter-frustum-culling-and-why-you-may-want-to-disregard-it/

/**
 * !#en aabb-frustum intersect, handles most of the false positives correctly<br/>
 * !#zh 轴对齐包围盒和锥台相交性检测，正确处理大多数错误情况。
 * @method aabb_frustum_accurate
 * @param {Aabb} aabb Align the axis around the box
 * @param {Frustum} frustum
 * @return {number}
 */


var aabb_frustum_accurate = function () {
  var tmp = new Array(8);
  var out1 = 0,
      out2 = 0;

  for (var i = 0; i < tmp.length; i++) {
    tmp[i] = new _valueTypes.Vec3(0, 0, 0);
  }

  return function (aabb, frustum) {
    var result = 0,
        intersects = false; // 1. aabb inside/outside frustum test

    for (var _i4 = 0; _i4 < frustum.planes.length; _i4++) {
      result = aabb_plane(aabb, frustum.planes[_i4]); // frustum plane normal points to the inside

      if (result === -1) {
        return 0;
      } // completely outside
      else if (result === 1) {
          intersects = true;
        }
    }

    if (!intersects) {
      return 1;
    } // completely inside
    // in case of false positives
    // 2. frustum inside/outside aabb test


    for (var _i5 = 0; _i5 < frustum.vertices.length; _i5++) {
      _valueTypes.Vec3.subtract(tmp[_i5], frustum.vertices[_i5], aabb.center);
    }

    out1 = 0, out2 = 0;

    for (var _i6 = 0; _i6 < frustum.vertices.length; _i6++) {
      if (tmp[_i6].x > aabb.halfExtents.x) {
        out1++;
      } else if (tmp[_i6].x < -aabb.halfExtents.x) {
        out2++;
      }
    }

    if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) {
      return 0;
    }

    out1 = 0;
    out2 = 0;

    for (var _i7 = 0; _i7 < frustum.vertices.length; _i7++) {
      if (tmp[_i7].y > aabb.halfExtents.y) {
        out1++;
      } else if (tmp[_i7].y < -aabb.halfExtents.y) {
        out2++;
      }
    }

    if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) {
      return 0;
    }

    out1 = 0;
    out2 = 0;

    for (var _i8 = 0; _i8 < frustum.vertices.length; _i8++) {
      if (tmp[_i8].z > aabb.halfExtents.z) {
        out1++;
      } else if (tmp[_i8].z < -aabb.halfExtents.z) {
        out2++;
      }
    }

    if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) {
      return 0;
    }

    return 1;
  };
}();
/**
 * !#en obb-point intersect<br/>
 * !#zh 方向包围盒和点的相交性检测。
 * @method obb_point
 * @param {Obb} obb Direction box
 * @param {Vec3} point
 * @return {boolean} true or false
 */


var obb_point = function () {
  var tmp = new _valueTypes.Vec3(0, 0, 0),
      m3 = new _valueTypes.Mat3();

  var lessThan = function lessThan(a, b) {
    return Math.abs(a.x) < b.x && Math.abs(a.y) < b.y && Math.abs(a.z) < b.z;
  };

  return function (obb, point) {
    _valueTypes.Vec3.subtract(tmp, point, obb.center);

    _valueTypes.Vec3.transformMat3(tmp, tmp, _valueTypes.Mat3.transpose(m3, obb.orientation));

    return lessThan(tmp, obb.halfExtents);
  };
}();
/**
 * !#en obb-plane intersect<br/>
 * !#zh 方向包围盒和平面的相交性检测。
 * @method obb_plane
 * @param {Obb} obb Direction box
 * @param {Plane} plane
 * @return {number} inside(back) = -1, outside(front) = 0, intersect = 1
 */


var obb_plane = function () {
  var absDot = function absDot(n, x, y, z) {
    return Math.abs(n.x * x + n.y * y + n.z * z);
  };

  return function (obb, plane) {
    var obbm = obb.orientation.m; // Real-Time Collision Detection, Christer Ericson, p. 163.

    var r = obb.halfExtents.x * absDot(plane.n, obbm[0], obbm[1], obbm[2]) + obb.halfExtents.y * absDot(plane.n, obbm[3], obbm[4], obbm[5]) + obb.halfExtents.z * absDot(plane.n, obbm[6], obbm[7], obbm[8]);

    var dot = _valueTypes.Vec3.dot(plane.n, obb.center);

    if (dot + r < plane.d) {
      return -1;
    } else if (dot - r > plane.d) {
      return 0;
    }

    return 1;
  };
}();
/**
 * !#en obb-frustum intersect, faster but has false positive corner cases<br/>
 * !#zh 方向包围盒和锥台相交性检测，速度快，但有错误情况。
 * @method obb_frustum
 * @param {Obb} obb Direction box
 * @param {Frustum} frustum
 * @return {number} 0 or not 0
 */


var obb_frustum = function obb_frustum(obb, frustum) {
  for (var i = 0; i < frustum.planes.length; i++) {
    // frustum plane normal points to the inside
    if (obb_plane(obb, frustum.planes[i]) === -1) {
      return 0;
    }
  } // completely outside


  return 1;
}; // https://cesium.com/blog/2017/02/02/tighter-frustum-culling-and-why-you-may-want-to-disregard-it/

/**
 * !#en obb-frustum intersect, handles most of the false positives correctly<br/>
 * !#zh 方向包围盒和锥台相交性检测，正确处理大多数错误情况。
 * @method obb_frustum_accurate
 * @param {Obb} obb Direction box
 * @param {Frustum} frustum
 * @return {number} 0 or not 0
 */


var obb_frustum_accurate = function () {
  var tmp = new Array(8);
  var dist = 0,
      out1 = 0,
      out2 = 0;

  for (var i = 0; i < tmp.length; i++) {
    tmp[i] = new _valueTypes.Vec3(0, 0, 0);
  }

  var dot = function dot(n, x, y, z) {
    return n.x * x + n.y * y + n.z * z;
  };

  return function (obb, frustum) {
    var result = 0,
        intersects = false; // 1. obb inside/outside frustum test

    for (var _i9 = 0; _i9 < frustum.planes.length; _i9++) {
      result = obb_plane(obb, frustum.planes[_i9]); // frustum plane normal points to the inside

      if (result === -1) {
        return 0;
      } // completely outside
      else if (result === 1) {
          intersects = true;
        }
    }

    if (!intersects) {
      return 1;
    } // completely inside
    // in case of false positives
    // 2. frustum inside/outside obb test


    for (var _i10 = 0; _i10 < frustum.vertices.length; _i10++) {
      _valueTypes.Vec3.subtract(tmp[_i10], frustum.vertices[_i10], obb.center);
    }

    out1 = 0, out2 = 0;
    var obbm = obb.orientation.m;

    for (var _i11 = 0; _i11 < frustum.vertices.length; _i11++) {
      dist = dot(tmp[_i11], obbm[0], obbm[1], obbm[2]);

      if (dist > obb.halfExtents.x) {
        out1++;
      } else if (dist < -obb.halfExtents.x) {
        out2++;
      }
    }

    if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) {
      return 0;
    }

    out1 = 0;
    out2 = 0;

    for (var _i12 = 0; _i12 < frustum.vertices.length; _i12++) {
      dist = dot(tmp[_i12], obbm[3], obbm[4], obbm[5]);

      if (dist > obb.halfExtents.y) {
        out1++;
      } else if (dist < -obb.halfExtents.y) {
        out2++;
      }
    }

    if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) {
      return 0;
    }

    out1 = 0;
    out2 = 0;

    for (var _i13 = 0; _i13 < frustum.vertices.length; _i13++) {
      dist = dot(tmp[_i13], obbm[6], obbm[7], obbm[8]);

      if (dist > obb.halfExtents.z) {
        out1++;
      } else if (dist < -obb.halfExtents.z) {
        out2++;
      }
    }

    if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) {
      return 0;
    }

    return 1;
  };
}();
/**
 * !#en obb-obb intersect<br/>
 * !#zh 方向包围盒和方向包围盒的相交性检测。
 * @method obb_obb
 * @param {Obb} obb1 Direction box1
 * @param {Obb} obb2 Direction box2
 * @return {number} 0 or not 0
 */


var obb_obb = function () {
  var test = new Array(15);

  for (var i = 0; i < 15; i++) {
    test[i] = new _valueTypes.Vec3(0, 0, 0);
  }

  var vertices = new Array(8);
  var vertices2 = new Array(8);

  for (var _i14 = 0; _i14 < 8; _i14++) {
    vertices[_i14] = new _valueTypes.Vec3(0, 0, 0);
    vertices2[_i14] = new _valueTypes.Vec3(0, 0, 0);
  }

  return function (obb1, obb2) {
    var obb1m = obb1.orientation.m;
    var obb2m = obb2.orientation.m;

    _valueTypes.Vec3.set(test[0], obb1m[0], obb1m[1], obb1m[2]);

    _valueTypes.Vec3.set(test[1], obb1m[3], obb1m[4], obb1m[5]);

    _valueTypes.Vec3.set(test[2], obb1m[6], obb1m[7], obb1m[8]);

    _valueTypes.Vec3.set(test[3], obb2m[0], obb2m[1], obb2m[2]);

    _valueTypes.Vec3.set(test[4], obb2m[3], obb2m[4], obb2m[5]);

    _valueTypes.Vec3.set(test[5], obb2m[6], obb2m[7], obb2m[8]);

    for (var _i15 = 0; _i15 < 3; ++_i15) {
      // Fill out rest of axis
      _valueTypes.Vec3.cross(test[6 + _i15 * 3 + 0], test[_i15], test[0]);

      _valueTypes.Vec3.cross(test[6 + _i15 * 3 + 1], test[_i15], test[1]);

      _valueTypes.Vec3.cross(test[6 + _i15 * 3 + 1], test[_i15], test[2]);
    }

    getOBBVertices(obb1.center, obb1.halfExtents, test[0], test[1], test[2], vertices);
    getOBBVertices(obb2.center, obb2.halfExtents, test[3], test[4], test[5], vertices2);

    for (var _i16 = 0; _i16 < 15; ++_i16) {
      var a = getInterval(vertices, test[_i16]);
      var b = getInterval(vertices2, test[_i16]);

      if (b[0] > a[1] || a[0] > b[1]) {
        return 0; // Seperating axis found
      }
    }

    return 1;
  };
}();
/**
 * !#en phere-plane intersect, not necessarily faster than obb-plane<br/>
 * due to the length calculation of the plane normal to factor out<br/>
 * the unnomalized plane distance<br/>
 * !#zh 球与平面的相交性检测。
 * @method sphere_plane
 * @param {Sphere} sphere
 * @param {Plane} plane
 * @return {number} inside(back) = -1, outside(front) = 0, intersect = 1
 */


var sphere_plane = function sphere_plane(sphere, plane) {
  var dot = _valueTypes.Vec3.dot(plane.n, sphere.center);

  var r = sphere.radius * plane.n.length();

  if (dot + r < plane.d) {
    return -1;
  } else if (dot - r > plane.d) {
    return 0;
  }

  return 1;
};
/**
 * !#en sphere-frustum intersect, faster but has false positive corner cases<br/>
 * !#zh 球和锥台的相交性检测，速度快，但有错误情况。
 * @method sphere_frustum
 * @param {Sphere} sphere
 * @param {Frustum} frustum
 * @return {number} 0 or not 0
 */


var sphere_frustum = function sphere_frustum(sphere, frustum) {
  for (var i = 0; i < frustum.planes.length; i++) {
    // frustum plane normal points to the inside
    if (sphere_plane(sphere, frustum.planes[i]) === -1) {
      return 0;
    }
  } // completely outside


  return 1;
}; // https://stackoverflow.com/questions/20912692/view-frustum-culling-corner-cases

/**
 * !#en sphere-frustum intersect, handles the false positives correctly<br/>
 * !#zh 球和锥台的相交性检测，正确处理大多数错误情况。
 * @method sphere_frustum_accurate
 * @param {Sphere} sphere
 * @param {Frustum} frustum
 * @return {number} 0 or not 0
 */


var sphere_frustum_accurate = function () {
  var pt = new _valueTypes.Vec3(0, 0, 0),
      map = [1, -1, 1, -1, 1, -1];
  return function (sphere, frustum) {
    for (var i = 0; i < 6; i++) {
      var plane = frustum.planes[i];
      var r = sphere.radius,
          c = sphere.center;
      var n = plane.n,
          d = plane.d;

      var dot = _valueTypes.Vec3.dot(n, c); // frustum plane normal points to the inside


      if (dot + r < d) {
        return 0;
      } // completely outside
      else if (dot - r > d) {
          continue;
        } // in case of false positives
      // has false negatives, still working on it


      _valueTypes.Vec3.add(pt, c, _valueTypes.Vec3.multiplyScalar(pt, n, r));

      for (var j = 0; j < 6; j++) {
        if (j === i || j === i + map[i]) {
          continue;
        }

        var test = frustum.planes[j];

        if (_valueTypes.Vec3.dot(test.n, pt) < test.d) {
          return 0;
        }
      }
    }

    return 1;
  };
}();
/**
 * !#en sphere-sphere intersect<br/>
 * !#zh 球和球的相交性检测。
 * @method sphere_sphere
 * @param {Sphere} sphere0
 * @param {Sphere} sphere1
 * @return {boolean} true or false
 */


var sphere_sphere = function sphere_sphere(sphere0, sphere1) {
  var r = sphere0.radius + sphere1.radius;
  return _valueTypes.Vec3.squaredDistance(sphere0.center, sphere1.center) < r * r;
};
/**
 * !#en sphere-aabb intersect<br/>
 * !#zh 球和轴对齐包围盒的相交性检测。
 * @method sphere_aabb
 * @param {Sphere} sphere
 * @param {Aabb} aabb
 * @return {boolean} true or false
 */


var sphere_aabb = function () {
  var pt = new _valueTypes.Vec3();
  return function (sphere, aabb) {
    distance.pt_point_aabb(pt, sphere.center, aabb);
    return _valueTypes.Vec3.squaredDistance(sphere.center, pt) < sphere.radius * sphere.radius;
  };
}();
/**
 * !#en sphere-obb intersect<br/>
 * !#zh 球和方向包围盒的相交性检测。
 * @method sphere_obb
 * @param {Sphere} sphere
 * @param {Obb} obb
 * @return {boolean} true or false
 */


var sphere_obb = function () {
  var pt = new _valueTypes.Vec3();
  return function (sphere, obb) {
    distance.pt_point_obb(pt, sphere.center, obb);
    return _valueTypes.Vec3.squaredDistance(sphere.center, pt) < sphere.radius * sphere.radius;
  };
}();

var intersect = {
  // old api
  rayAabb: rayAabb,
  rayMesh: rayMesh,
  raycast: raycast,
  rayTriangle: rayTriangle,
  ray_sphere: ray_sphere,
  ray_aabb: ray_aabb,
  ray_obb: ray_obb,
  ray_plane: ray_plane,
  ray_triangle: ray_triangle,
  line_plane: line_plane,
  line_triangle: line_triangle,
  line_quad: line_quad,
  sphere_sphere: sphere_sphere,
  sphere_aabb: sphere_aabb,
  sphere_obb: sphere_obb,
  sphere_plane: sphere_plane,
  sphere_frustum: sphere_frustum,
  sphere_frustum_accurate: sphere_frustum_accurate,
  aabb_aabb: aabb_aabb,
  aabb_obb: aabb_obb,
  aabb_plane: aabb_plane,
  aabb_frustum: aabb_frustum,
  aabb_frustum_accurate: aabb_frustum_accurate,
  obb_obb: obb_obb,
  obb_plane: obb_plane,
  obb_frustum: obb_frustum,
  obb_frustum_accurate: obb_frustum_accurate,
  obb_point: obb_point,

  /**
   * !#en
   * The intersection detection of g1 and g2 can fill in the shape in the basic geometry.
   * !#zh
   * g1 和 g2 的相交性检测，可填入基础几何中的形状。
   * @method resolve
   * @param g1 Geometry 1
   * @param g2 Geometry 2
   * @param outPt optional, Intersection point. (note: only partial shape detection with this return value)
   */
  resolve: function resolve(g1, g2, outPt) {
    if (outPt === void 0) {
      outPt = null;
    }

    var type1 = g1._type,
        type2 = g2._type;
    var resolver = this[type1 | type2];

    if (type1 < type2) {
      return resolver(g1, g2, outPt);
    } else {
      return resolver(g2, g1, outPt);
    }
  }
};
intersect[_enums["default"].SHAPE_RAY | _enums["default"].SHAPE_SPHERE] = ray_sphere;
intersect[_enums["default"].SHAPE_RAY | _enums["default"].SHAPE_AABB] = ray_aabb;
intersect[_enums["default"].SHAPE_RAY | _enums["default"].SHAPE_OBB] = ray_obb;
intersect[_enums["default"].SHAPE_RAY | _enums["default"].SHAPE_PLANE] = ray_plane;
intersect[_enums["default"].SHAPE_RAY | _enums["default"].SHAPE_TRIANGLE] = ray_triangle;
intersect[_enums["default"].SHAPE_LINE | _enums["default"].SHAPE_PLANE] = line_plane;
intersect[_enums["default"].SHAPE_LINE | _enums["default"].SHAPE_TRIANGLE] = line_triangle;
intersect[_enums["default"].SHAPE_SPHERE] = sphere_sphere;
intersect[_enums["default"].SHAPE_SPHERE | _enums["default"].SHAPE_AABB] = sphere_aabb;
intersect[_enums["default"].SHAPE_SPHERE | _enums["default"].SHAPE_OBB] = sphere_obb;
intersect[_enums["default"].SHAPE_SPHERE | _enums["default"].SHAPE_PLANE] = sphere_plane;
intersect[_enums["default"].SHAPE_SPHERE | _enums["default"].SHAPE_FRUSTUM] = sphere_frustum;
intersect[_enums["default"].SHAPE_SPHERE | _enums["default"].SHAPE_FRUSTUM_ACCURATE] = sphere_frustum_accurate;
intersect[_enums["default"].SHAPE_AABB] = aabb_aabb;
intersect[_enums["default"].SHAPE_AABB | _enums["default"].SHAPE_OBB] = aabb_obb;
intersect[_enums["default"].SHAPE_AABB | _enums["default"].SHAPE_PLANE] = aabb_plane;
intersect[_enums["default"].SHAPE_AABB | _enums["default"].SHAPE_FRUSTUM] = aabb_frustum;
intersect[_enums["default"].SHAPE_AABB | _enums["default"].SHAPE_FRUSTUM_ACCURATE] = aabb_frustum_accurate;
intersect[_enums["default"].SHAPE_OBB] = obb_obb;
intersect[_enums["default"].SHAPE_OBB | _enums["default"].SHAPE_PLANE] = obb_plane;
intersect[_enums["default"].SHAPE_OBB | _enums["default"].SHAPE_FRUSTUM] = obb_frustum;
intersect[_enums["default"].SHAPE_OBB | _enums["default"].SHAPE_FRUSTUM_ACCURATE] = obb_frustum_accurate;
var _default = intersect;
exports["default"] = _default;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVyc2VjdC50cyJdLCJuYW1lcyI6WyJyYXlfbWVzaCIsInRyaSIsInRyaWFuZ2xlIiwiY3JlYXRlIiwibWluRGlzdCIsIkluZmluaXR5IiwiZ2V0VmVjMyIsIm91dCIsImRhdGEiLCJpZHgiLCJzdHJpZGUiLCJWZWMzIiwic2V0IiwicmF5IiwibWVzaCIsInN1Yk1lc2hlcyIsIl9zdWJNZXNoZXMiLCJpIiwibGVuZ3RoIiwiX3ByaW1pdGl2ZVR5cGUiLCJnZngiLCJQVF9UUklBTkdMRVMiLCJzdWJEYXRhIiwiX3N1YkRhdGFzIiwicG9zRGF0YSIsIl9nZXRBdHRyTWVzaERhdGEiLCJBVFRSX1BPU0lUSU9OIiwiaURhdGEiLCJnZXRJRGF0YSIsIlVpbnQxNkFycmF5IiwiZm9ybWF0IiwidmZtIiwiZm10IiwiZWxlbWVudCIsIm51bSIsImEiLCJiIiwiYyIsImRpc3QiLCJyYXlfdHJpYW5nbGUiLCJyYXlNZXNoIiwicmF5X2Nhc3QiLCJ0cmF2ZXJzYWwiLCJub2RlIiwiY2IiLCJjaGlsZHJlbiIsImNoaWxkIiwiY21wIiwiZGlzdGFuY2UiLCJ0cmFuc2Zvcm1NYXQ0Tm9ybWFsIiwibSIsIm1tIiwieCIsInkiLCJ6Iiwicmh3IiwicmVzdWx0c1Bvb2wiLCJSZWN5Y2xlUG9vbCIsInJlc3VsdHMiLCJub2RlQWFiYiIsImFhYmIiLCJtaW5Qb3MiLCJtYXhQb3MiLCJtb2RlbFJheSIsIm00XzEiLCJjYyIsIm1hdDQiLCJtNF8yIiwiZCIsImRpc3RhbmNlVmFsaWQiLCJyb290Iiwid29ybGRSYXkiLCJoYW5kbGVyIiwiZmlsdGVyIiwicmVzZXQiLCJkaXJlY3RvciIsImdldFNjZW5lIiwiTWF0NCIsImludmVydCIsImdldFdvcmxkTWF0cml4IiwidHJhbnNmb3JtTWF0NCIsIm8iLCJub3JtYWxpemUiLCJjb21wb25lbnQiLCJfcmVuZGVyQ29tcG9uZW50IiwiTWVzaFJlbmRlcmVyIiwicmF5X2FhYmIiLCJfYm91bmRpbmdCb3giLCJ3aWR0aCIsImhlaWdodCIsImFuY2hvclgiLCJhbmNob3JZIiwiZnJvbVBvaW50cyIsInNjYWxlIiwicmVzIiwiYWRkIiwibWFnIiwicHVzaCIsInNvcnQiLCJyYXljYXN0IiwicmF5X3BsYW5lIiwicHQiLCJwbGFuZSIsImRlbm9tIiwiZG90IiwibiIsIk1hdGgiLCJhYnMiLCJOdW1iZXIiLCJFUFNJTE9OIiwibXVsdGlwbHlTY2FsYXIiLCJ0Iiwic3VidHJhY3QiLCJsaW5lX3BsYW5lIiwiYWIiLCJsaW5lIiwiZSIsInMiLCJhYyIsInB2ZWMiLCJ0dmVjIiwicXZlYyIsImRvdWJsZVNpZGVkIiwiY3Jvc3MiLCJkZXQiLCJpbnZfZGV0IiwidSIsInYiLCJyYXlUcmlhbmdsZSIsImxpbmVfdHJpYW5nbGUiLCJxcCIsImFwIiwib3V0UHQiLCJ3IiwiaW52RGV0IiwibGluZV9xdWFkIiwicHEiLCJwYSIsInBiIiwicGMiLCJwZCIsInRtcCIsInAiLCJxIiwicmF5X3NwaGVyZSIsInNwaGVyZSIsInIiLCJyYWRpdXMiLCJjZW50ZXIiLCJyU3EiLCJlU3EiLCJsZW5ndGhTcXIiLCJhTGVuZ3RoIiwiZlNxIiwiZiIsInNxcnQiLCJtaW4iLCJtYXgiLCJpeCIsIml5IiwiaXoiLCJoYWxmRXh0ZW50cyIsInQxIiwidDIiLCJ0MyIsInQ0IiwidDUiLCJ0NiIsInRtaW4iLCJ0bWF4IiwicmF5QWFiYiIsInJheV9vYmIiLCJYIiwiWSIsIloiLCJzaXplIiwiQXJyYXkiLCJvYmIiLCJvYmJtIiwib3JpZW50YXRpb24iLCJhYWJiX2FhYmIiLCJhTWluIiwiYU1heCIsImJNaW4iLCJiTWF4IiwiYWFiYjEiLCJhYWJiMiIsImdldEFBQkJWZXJ0aWNlcyIsImdldE9CQlZlcnRpY2VzIiwiYTEiLCJhMiIsImEzIiwiZ2V0SW50ZXJ2YWwiLCJ2ZXJ0aWNlcyIsImF4aXMiLCJwcm9qZWN0aW9uIiwiYWFiYl9vYmIiLCJ0ZXN0IiwidmVydGljZXMyIiwiaiIsImFhYmJfcGxhbmUiLCJhYWJiX2ZydXN0dW0iLCJmcnVzdHVtIiwicGxhbmVzIiwiYWFiYl9mcnVzdHVtX2FjY3VyYXRlIiwib3V0MSIsIm91dDIiLCJyZXN1bHQiLCJpbnRlcnNlY3RzIiwib2JiX3BvaW50IiwibTMiLCJNYXQzIiwibGVzc1RoYW4iLCJwb2ludCIsInRyYW5zZm9ybU1hdDMiLCJ0cmFuc3Bvc2UiLCJvYmJfcGxhbmUiLCJhYnNEb3QiLCJvYmJfZnJ1c3R1bSIsIm9iYl9mcnVzdHVtX2FjY3VyYXRlIiwib2JiX29iYiIsIm9iYjEiLCJvYmIyIiwib2JiMW0iLCJvYmIybSIsInNwaGVyZV9wbGFuZSIsInNwaGVyZV9mcnVzdHVtIiwic3BoZXJlX2ZydXN0dW1fYWNjdXJhdGUiLCJtYXAiLCJzcGhlcmVfc3BoZXJlIiwic3BoZXJlMCIsInNwaGVyZTEiLCJzcXVhcmVkRGlzdGFuY2UiLCJzcGhlcmVfYWFiYiIsInB0X3BvaW50X2FhYmIiLCJzcGhlcmVfb2JiIiwicHRfcG9pbnRfb2JiIiwiaW50ZXJzZWN0IiwicmVzb2x2ZSIsImcxIiwiZzIiLCJ0eXBlMSIsIl90eXBlIiwidHlwZTIiLCJyZXNvbHZlciIsImVudW1zIiwiU0hBUEVfUkFZIiwiU0hBUEVfU1BIRVJFIiwiU0hBUEVfQUFCQiIsIlNIQVBFX09CQiIsIlNIQVBFX1BMQU5FIiwiU0hBUEVfVFJJQU5HTEUiLCJTSEFQRV9MSU5FIiwiU0hBUEVfRlJVU1RVTSIsIlNIQVBFX0ZSVVNUVU1fQUNDVVJBVEUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkE7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBS0E7O0FBRUE7Ozs7Ozs7O0FBdENBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3Q0EsSUFBTUEsUUFBUSxHQUFJLFlBQVk7QUFDMUIsTUFBSUMsR0FBRyxHQUFHQyxxQkFBU0MsTUFBVCxFQUFWOztBQUNBLE1BQUlDLE9BQU8sR0FBR0MsUUFBZDs7QUFFQSxXQUFTQyxPQUFULENBQWtCQyxHQUFsQixFQUF1QkMsSUFBdkIsRUFBNkJDLEdBQTdCLEVBQWtDQyxNQUFsQyxFQUEwQztBQUN0Q0Ms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RCxRQUFoRDtBQUNBeUMsU0FBUyxDQUFDUSxrQkFBTUcsVUFBTixHQUFtQkgsa0JBQU1LLFdBQTFCLENBQVQsR0FBa0RsRCxVQUFsRDtBQUNBcUMsU0FBUyxDQUFDUSxrQkFBTUcsVUFBTixHQUFtQkgsa0JBQU1RLGFBQTFCLENBQVQsR0FBb0RwRCxZQUFwRDtBQUNBb0MsU0FBUyxDQUFDUSxrQkFBTUcsVUFBTixHQUFtQkgsa0JBQU1TLHNCQUExQixDQUFULEdBQTZEbEQscUJBQTdEO0FBRUFpQyxTQUFTLENBQUNRLGtCQUFNSSxTQUFQLENBQVQsR0FBNkI3QixPQUE3QjtBQUNBaUIsU0FBUyxDQUFDUSxrQkFBTUksU0FBTixHQUFrQkosa0JBQU1LLFdBQXpCLENBQVQsR0FBaURsQyxTQUFqRDtBQUNBcUIsU0FBUyxDQUFDUSxrQkFBTUksU0FBTixHQUFrQkosa0JBQU1RLGFBQXpCLENBQVQsR0FBbURuQyxXQUFuRDtBQUNBbUIsU0FBUyxDQUFDUSxrQkFBTUksU0FBTixHQUFrQkosa0JBQU1TLHNCQUF6QixDQUFULEdBQTREbkMsb0JBQTVEO2VBRWVrQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE5IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgZ2Z4IGZyb20gJy4uLy4uL3JlbmRlcmVyL2dmeCc7XG5pbXBvcnQgUmVjeWNsZVBvb2wgZnJvbSAnLi4vLi4vcmVuZGVyZXIvbWVtb3AvcmVjeWNsZS1wb29sJztcblxuaW1wb3J0IHsgTWF0MywgVmVjMywgTWF0NCB9IGZyb20gJy4uL3ZhbHVlLXR5cGVzJztcbmltcG9ydCBhYWJiIGZyb20gJy4vYWFiYic7XG5pbXBvcnQgKiBhcyBkaXN0YW5jZSBmcm9tICcuL2Rpc3RhbmNlJztcbmltcG9ydCBlbnVtcyBmcm9tICcuL2VudW1zJztcbmltcG9ydCB7IGZydXN0dW0gfSBmcm9tICcuL2ZydXN0dW0nO1xuaW1wb3J0IGxpbmUgZnJvbSAnLi9saW5lJztcbmltcG9ydCBvYmIgZnJvbSAnLi9vYmInO1xuaW1wb3J0IHBsYW5lIGZyb20gJy4vcGxhbmUnO1xuaW1wb3J0IHJheSBmcm9tICcuL3JheSc7XG5pbXBvcnQgc3BoZXJlIGZyb20gJy4vc3BoZXJlJztcbmltcG9ydCB0cmlhbmdsZSBmcm9tICcuL3RyaWFuZ2xlJztcblxuY29uc3QgcmF5X21lc2ggPSAoZnVuY3Rpb24gKCkge1xuICAgIGxldCB0cmkgPSB0cmlhbmdsZS5jcmVhdGUoKTtcbiAgICBsZXQgbWluRGlzdCA9IEluZmluaXR5O1xuXG4gICAgZnVuY3Rpb24gZ2V0VmVjMyAob3V0LCBkYXRhLCBpZHgsIHN0cmlkZSkge1xuICAgICAgICBWZWMzLnNldChvdXQsIGRhdGFbaWR4KnN0cmlkZV0sIGRhdGFbaWR4KnN0cmlkZSArIDFdLCBkYXRhW2lkeCpzdHJpZGUgKyAyXSk7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBmdW5jdGlvbiAocmF5LCBtZXNoKSB7XG4gICAgICAgIG1pbkRpc3QgPSBJbmZpbml0eTtcbiAgICAgICAgbGV0IHN1Yk1lc2hlcyA9IG1lc2guX3N1Yk1lc2hlcztcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1Yk1lc2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHN1Yk1lc2hlc1tpXS5fcHJpbWl0aXZlVHlwZSAhPT0gZ2Z4LlBUX1RSSUFOR0xFUykgY29udGludWU7XG5cbiAgICAgICAgICAgIGxldCBzdWJEYXRhID0gKG1lc2guX3N1YkRhdGFzW2ldIHx8IG1lc2guX3N1YkRhdGFzWzBdKTtcbiAgICAgICAgICAgIGxldCBwb3NEYXRhID0gbWVzaC5fZ2V0QXR0ck1lc2hEYXRhKGksIGdmeC5BVFRSX1BPU0lUSU9OKTtcbiAgICAgICAgICAgIGxldCBpRGF0YSA9IHN1YkRhdGEuZ2V0SURhdGEoVWludDE2QXJyYXkpO1xuXG4gICAgICAgICAgICBsZXQgZm9ybWF0ID0gc3ViRGF0YS52Zm07XG4gICAgICAgICAgICBsZXQgZm10ID0gZm9ybWF0LmVsZW1lbnQoZ2Z4LkFUVFJfUE9TSVRJT04pO1xuICAgICAgICAgICAgbGV0IG51bSA9IGZtdC5udW07XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlEYXRhLmxlbmd0aDsgaSArPSAzKSB7XG4gICAgICAgICAgICAgICAgZ2V0VmVjMyh0cmkuYSwgcG9zRGF0YSwgaURhdGFbIGkgXSwgbnVtKTtcbiAgICAgICAgICAgICAgICBnZXRWZWMzKHRyaS5iLCBwb3NEYXRhLCBpRGF0YVtpKzFdLCBudW0pO1xuICAgICAgICAgICAgICAgIGdldFZlYzModHJpLmMsIHBvc0RhdGEsIGlEYXRhW2krMl0sIG51bSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgZGlzdCA9IHJheV90cmlhbmdsZShyYXksIHRyaSk7XG4gICAgICAgICAgICAgICAgaWYgKGRpc3QgPiAwICYmIGRpc3QgPCBtaW5EaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIG1pbkRpc3QgPSBkaXN0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWluRGlzdDtcbiAgICB9O1xufSkoKTtcblxuLy8gYWRhcHQgdG8gb2xkIGFwaVxuY29uc3QgcmF5TWVzaCA9IHJheV9tZXNoO1xuXG4vKiogXG4gKiAhI2VuXG4gKiBDaGVjayB3aGV0aGVyIHJheSBpbnRlcnNlY3Qgd2l0aCBub2Rlc1xuICogISN6aFxuICog5qOA5rWL5bCE57q/5piv5ZCm5LiO54mp5L2T5pyJ5Lqk6ZuGXG4gKiBAbWV0aG9kIHJheV9jYXN0XG4gKiBAcGFyYW0ge05vZGV9IHJvb3QgLSBJZiByb290IGlzIG51bGwsIHRoZW4gdHJhdmVyc2FsIG5vZGVzIGZyb20gc2NlbmUgbm9kZVxuICogQHBhcmFtIHtSYXl9IHdvcmxkUmF5XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmaWx0ZXJcbiAqIEByZXR1cm4ge1tdfSBbe25vZGUsIGRpc3RhbmNlfV1cbiovXG5jb25zdCByYXlfY2FzdCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gdHJhdmVyc2FsIChub2RlLCBjYikge1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSBjaGlsZHJlbi5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgICAgICAgICB0cmF2ZXJzYWwoY2hpbGQsIGNiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNiKG5vZGUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNtcCAoYSwgYikge1xuICAgICAgICByZXR1cm4gYS5kaXN0YW5jZSAtIGIuZGlzdGFuY2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdHJhbnNmb3JtTWF0NE5vcm1hbCAob3V0LCBhLCBtKSB7XG4gICAgICAgIGxldCBtbSA9IG0ubTtcbiAgICAgICAgbGV0IHggPSBhLngsIHkgPSBhLnksIHogPSBhLnosXG4gICAgICAgICAgICByaHcgPSBtbVszXSAqIHggKyBtbVs3XSAqIHkgKyBtbVsxMV0gKiB6O1xuICAgICAgICByaHcgPSByaHcgPyAxIC8gcmh3IDogMTtcbiAgICAgICAgb3V0LnggPSAobW1bMF0gKiB4ICsgbW1bNF0gKiB5ICsgbW1bOF0gKiB6KSAqIHJodztcbiAgICAgICAgb3V0LnkgPSAobW1bMV0gKiB4ICsgbW1bNV0gKiB5ICsgbW1bOV0gKiB6KSAqIHJodztcbiAgICAgICAgb3V0LnogPSAobW1bMl0gKiB4ICsgbW1bNl0gKiB5ICsgbW1bMTBdICogeikgKiByaHc7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdHNQb29sID0gbmV3IFJlY3ljbGVQb29sKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRpc3RhbmNlOiAwLFxuICAgICAgICAgICAgbm9kZTogbnVsbFxuICAgICAgICB9XG4gICAgfSwgMSk7XG5cbiAgICBsZXQgcmVzdWx0cyA9IFtdO1xuXG4gICAgLy8gdGVtcCB2YXJpYWJsZVxuICAgIGxldCBub2RlQWFiYiA9IGFhYmIuY3JlYXRlKCk7XG4gICAgbGV0IG1pblBvcyA9IG5ldyBWZWMzKCk7XG4gICAgbGV0IG1heFBvcyA9IG5ldyBWZWMzKCk7XG5cbiAgICBsZXQgbW9kZWxSYXkgPSBuZXcgcmF5KCk7XG4gICAgbGV0IG00XzEgPSBjYy5tYXQ0KCk7XG4gICAgbGV0IG00XzIgPSBjYy5tYXQ0KCk7XG4gICAgbGV0IGQgPSBuZXcgVmVjMygpO1xuXG4gICAgZnVuY3Rpb24gZGlzdGFuY2VWYWxpZCAoZGlzdGFuY2UpIHtcbiAgICAgICAgcmV0dXJuIGRpc3RhbmNlID4gMCAmJiBkaXN0YW5jZSA8IEluZmluaXR5O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiAocm9vdCwgd29ybGRSYXksIGhhbmRsZXIsIGZpbHRlcikge1xuICAgICAgICByZXN1bHRzUG9vbC5yZXNldCgpO1xuICAgICAgICByZXN1bHRzLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgcm9vdCA9IHJvb3QgfHwgY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKTtcbiAgICAgICAgdHJhdmVyc2FsKHJvb3QsIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICBpZiAoZmlsdGVyICYmICFmaWx0ZXIobm9kZSkpIHJldHVybjtcblxuICAgICAgICAgICAgLy8gdHJhbnNmb3JtIHdvcmxkIHJheSB0byBtb2RlbCByYXlcbiAgICAgICAgICAgIE1hdDQuaW52ZXJ0KG00XzIsIG5vZGUuZ2V0V29ybGRNYXRyaXgobTRfMSkpO1xuICAgICAgICAgICAgVmVjMy50cmFuc2Zvcm1NYXQ0KG1vZGVsUmF5Lm8sIHdvcmxkUmF5Lm8sIG00XzIpO1xuICAgICAgICAgICAgVmVjMy5ub3JtYWxpemUobW9kZWxSYXkuZCwgdHJhbnNmb3JtTWF0NE5vcm1hbChtb2RlbFJheS5kLCB3b3JsZFJheS5kLCBtNF8yKSk7XG5cbiAgICAgICAgICAgIC8vIHJheWNhc3Qgd2l0aCBib3VuZGluZyBib3hcbiAgICAgICAgICAgIGxldCBkaXN0YW5jZSA9IEluZmluaXR5O1xuICAgICAgICAgICAgbGV0IGNvbXBvbmVudCA9IG5vZGUuX3JlbmRlckNvbXBvbmVudDtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBjYy5NZXNoUmVuZGVyZXIgKSB7XG4gICAgICAgICAgICAgICAgZGlzdGFuY2UgPSByYXlfYWFiYihtb2RlbFJheSwgY29tcG9uZW50Ll9ib3VuZGluZ0JveCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChub2RlLndpZHRoICYmIG5vZGUuaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgVmVjMy5zZXQobWluUG9zLCAtbm9kZS53aWR0aCAqIG5vZGUuYW5jaG9yWCwgLW5vZGUuaGVpZ2h0ICogbm9kZS5hbmNob3JZLCBub2RlLnopO1xuICAgICAgICAgICAgICAgIFZlYzMuc2V0KG1heFBvcywgbm9kZS53aWR0aCAqICgxIC0gbm9kZS5hbmNob3JYKSwgbm9kZS5oZWlnaHQgKiAoMSAtIG5vZGUuYW5jaG9yWSksIG5vZGUueik7XG4gICAgICAgICAgICAgICAgYWFiYi5mcm9tUG9pbnRzKG5vZGVBYWJiLCBtaW5Qb3MsIG1heFBvcyk7XG4gICAgICAgICAgICAgICAgZGlzdGFuY2UgPSByYXlfYWFiYihtb2RlbFJheSwgbm9kZUFhYmIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWRpc3RhbmNlVmFsaWQoZGlzdGFuY2UpKSByZXR1cm47XG5cbiAgICAgICAgICAgIGlmIChoYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgZGlzdGFuY2UgPSBoYW5kbGVyKG1vZGVsUmF5LCBub2RlLCBkaXN0YW5jZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkaXN0YW5jZVZhbGlkKGRpc3RhbmNlKSkge1xuICAgICAgICAgICAgICAgIFZlYzMuc2NhbGUoZCwgbW9kZWxSYXkuZCwgZGlzdGFuY2UpO1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybU1hdDROb3JtYWwoZCwgZCwgbTRfMSk7XG4gICAgICAgICAgICAgICAgbGV0IHJlcyA9IHJlc3VsdHNQb29sLmFkZCgpO1xuICAgICAgICAgICAgICAgIHJlcy5ub2RlID0gbm9kZTtcbiAgICAgICAgICAgICAgICByZXMuZGlzdGFuY2UgPSBWZWMzLm1hZyhkKTtcbiAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2gocmVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzdWx0cy5zb3J0KGNtcCk7XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cbn0pKCk7XG5cbi8vIGFkYXB0IHRvIG9sZCBhcGlcbmNvbnN0IHJheWNhc3QgPSByYXlfY2FzdDtcblxuLyoqXG4gKiAhI2VuIHJheS1wbGFuZSBpbnRlcnNlY3Q8YnIvPlxuICogISN6aCDlsITnur/kuI7lubPpnaLnmoTnm7jkuqTmgKfmo4DmtYvjgIJcbiAqIEBtZXRob2QgcmF5X3BsYW5lXG4gKiBAcGFyYW0ge1JheX0gcmF5XG4gKiBAcGFyYW0ge1BsYW5lfSBwbGFuZVxuICogQHJldHVybiB7bnVtYmVyfSAwIG9yIG5vdCAwXG4gKi9cbmNvbnN0IHJheV9wbGFuZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgcHQgPSBuZXcgVmVjMygwLCAwLCAwKTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAocmF5OiByYXksIHBsYW5lOiBwbGFuZSk6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IGRlbm9tID0gVmVjMy5kb3QocmF5LmQsIHBsYW5lLm4pO1xuICAgICAgICBpZiAoTWF0aC5hYnMoZGVub20pIDwgTnVtYmVyLkVQU0lMT04pIHsgcmV0dXJuIDA7IH1cbiAgICAgICAgVmVjMy5tdWx0aXBseVNjYWxhcihwdCwgcGxhbmUubiwgcGxhbmUuZCk7XG4gICAgICAgIGNvbnN0IHQgPSBWZWMzLmRvdChWZWMzLnN1YnRyYWN0KHB0LCBwdCwgcmF5Lm8pLCBwbGFuZS5uKSAvIGRlbm9tO1xuICAgICAgICBpZiAodCA8IDApIHsgcmV0dXJuIDA7IH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbn0pKCk7XG5cbi8qKlxuICogISNlbiBsaW5lLXBsYW5lIGludGVyc2VjdDxici8+XG4gKiAhI3poIOe6v+auteS4juW5s+mdoueahOebuOS6pOaAp+ajgOa1i+OAglxuICogQG1ldGhvZCBsaW5lX3BsYW5lXG4gKiBAcGFyYW0ge0xpbmV9IGxpbmVcbiAqIEBwYXJhbSB7UGxhbmV9IHBsYW5lXG4gKiBAcmV0dXJuIHtudW1iZXJ9IDAgb3Igbm90IDBcbiAqL1xuY29uc3QgbGluZV9wbGFuZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgYWIgPSBuZXcgVmVjMygwLCAwLCAwKTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAobGluZTogbGluZSwgcGxhbmU6IHBsYW5lKTogbnVtYmVyIHtcbiAgICAgICAgVmVjMy5zdWJ0cmFjdChhYiwgbGluZS5lLCBsaW5lLnMpO1xuICAgICAgICBjb25zdCB0ID0gKHBsYW5lLmQgLSBWZWMzLmRvdChsaW5lLnMsIHBsYW5lLm4pKSAvIFZlYzMuZG90KGFiLCBwbGFuZS5uKTtcbiAgICAgICAgaWYgKHQgPCAwIHx8IHQgPiAxKSB7IHJldHVybiAwOyB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG59KSgpO1xuXG4vLyBiYXNlZCBvbiBodHRwOi8vZmlsZWFkbWluLmNzLmx0aC5zZS9jcy9QZXJzb25hbC9Ub21hc19Ba2VuaW5lLU1vbGxlci9yYXl0cmkvXG4vKipcbiAqICEjZW4gcmF5LXRyaWFuZ2xlIGludGVyc2VjdDxici8+XG4gKiAhI3poIOWwhOe6v+S4juS4ieinkuW9oueahOebuOS6pOaAp+ajgOa1i+OAglxuICogQG1ldGhvZCByYXlfdHJpYW5nbGVcbiAqIEBwYXJhbSB7UmF5fSByYXlcbiAqIEBwYXJhbSB7VHJpYW5nbGV9IHRyaWFuZ2xlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGRvdWJsZVNpZGVkXG4gKiBAcmV0dXJuIHtudW1iZXJ9IDAgb3Igbm90IDBcbiAqL1xuY29uc3QgcmF5X3RyaWFuZ2xlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBhYiA9IG5ldyBWZWMzKDAsIDAsIDApO1xuICAgIGNvbnN0IGFjID0gbmV3IFZlYzMoMCwgMCwgMCk7XG4gICAgY29uc3QgcHZlYyA9IG5ldyBWZWMzKDAsIDAsIDApO1xuICAgIGNvbnN0IHR2ZWMgPSBuZXcgVmVjMygwLCAwLCAwKTtcbiAgICBjb25zdCBxdmVjID0gbmV3IFZlYzMoMCwgMCwgMCk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKHJheTogcmF5LCB0cmlhbmdsZTogdHJpYW5nbGUsIGRvdWJsZVNpZGVkPzogYm9vbGVhbikge1xuICAgICAgICBWZWMzLnN1YnRyYWN0KGFiLCB0cmlhbmdsZS5iLCB0cmlhbmdsZS5hKTtcbiAgICAgICAgVmVjMy5zdWJ0cmFjdChhYywgdHJpYW5nbGUuYywgdHJpYW5nbGUuYSk7XG5cbiAgICAgICAgVmVjMy5jcm9zcyhwdmVjLCByYXkuZCwgYWMpO1xuICAgICAgICBjb25zdCBkZXQgPSBWZWMzLmRvdChhYiwgcHZlYyk7XG4gICAgICAgIGlmIChkZXQgPCBOdW1iZXIuRVBTSUxPTiAmJiAoIWRvdWJsZVNpZGVkIHx8IGRldCA+IC1OdW1iZXIuRVBTSUxPTikpIHsgcmV0dXJuIDA7IH1cblxuICAgICAgICBjb25zdCBpbnZfZGV0ID0gMSAvIGRldDtcblxuICAgICAgICBWZWMzLnN1YnRyYWN0KHR2ZWMsIHJheS5vLCB0cmlhbmdsZS5hKTtcbiAgICAgICAgY29uc3QgdSA9IFZlYzMuZG90KHR2ZWMsIHB2ZWMpICogaW52X2RldDtcbiAgICAgICAgaWYgKHUgPCAwIHx8IHUgPiAxKSB7IHJldHVybiAwOyB9XG5cbiAgICAgICAgVmVjMy5jcm9zcyhxdmVjLCB0dmVjLCBhYik7XG4gICAgICAgIGNvbnN0IHYgPSBWZWMzLmRvdChyYXkuZCwgcXZlYykgKiBpbnZfZGV0O1xuICAgICAgICBpZiAodiA8IDAgfHwgdSArIHYgPiAxKSB7IHJldHVybiAwOyB9XG5cbiAgICAgICAgY29uc3QgdCA9IFZlYzMuZG90KGFjLCBxdmVjKSAqIGludl9kZXQ7XG4gICAgICAgIHJldHVybiB0IDwgMCA/IDAgOiB0O1xuICAgIH07XG59KSgpO1xuXG4vLyBhZGFwdCB0byBvbGQgYXBpXG5jb25zdCByYXlUcmlhbmdsZSA9IHJheV90cmlhbmdsZTtcblxuLyoqXG4gKiAhI2VuIGxpbmUtdHJpYW5nbGUgaW50ZXJzZWN0PGJyLz5cbiAqICEjemgg57q/5q615LiO5LiJ6KeS5b2i55qE55u45Lqk5oCn5qOA5rWL44CCXG4gKiBAbWV0aG9kIGxpbmVfdHJpYW5nbGVcbiAqIEBwYXJhbSB7TGluZX0gbGluZVxuICogQHBhcmFtIHtUcmlhbmdsZX0gdHJpYW5nbGVcbiAqIEBwYXJhbSB7VmVjM30gb3V0UHQgb3B0aW9uYWwsIFRoZSBpbnRlcnNlY3Rpb24gcG9pbnRcbiAqIEByZXR1cm4ge251bWJlcn0gMCBvciBub3QgMFxuICovXG5jb25zdCBsaW5lX3RyaWFuZ2xlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBhYiA9IG5ldyBWZWMzKDAsIDAsIDApO1xuICAgIGNvbnN0IGFjID0gbmV3IFZlYzMoMCwgMCwgMCk7XG4gICAgY29uc3QgcXAgPSBuZXcgVmVjMygwLCAwLCAwKTtcbiAgICBjb25zdCBhcCA9IG5ldyBWZWMzKDAsIDAsIDApO1xuICAgIGNvbnN0IG4gPSBuZXcgVmVjMygwLCAwLCAwKTtcbiAgICBjb25zdCBlID0gbmV3IFZlYzMoMCwgMCwgMCk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKGxpbmU6IGxpbmUsIHRyaWFuZ2xlOiB0cmlhbmdsZSwgb3V0UHQ6IFZlYzMpOiBudW1iZXIge1xuICAgICAgICBWZWMzLnN1YnRyYWN0KGFiLCB0cmlhbmdsZS5iLCB0cmlhbmdsZS5hKTtcbiAgICAgICAgVmVjMy5zdWJ0cmFjdChhYywgdHJpYW5nbGUuYywgdHJpYW5nbGUuYSk7XG4gICAgICAgIFZlYzMuc3VidHJhY3QocXAsIGxpbmUucywgbGluZS5lKTtcblxuICAgICAgICBWZWMzLmNyb3NzKG4sIGFiLCBhYyk7XG4gICAgICAgIGNvbnN0IGRldCA9IFZlYzMuZG90KHFwLCBuKTtcblxuICAgICAgICBpZiAoZGV0IDw9IDAuMCkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cblxuICAgICAgICBWZWMzLnN1YnRyYWN0KGFwLCBsaW5lLnMsIHRyaWFuZ2xlLmEpO1xuICAgICAgICBjb25zdCB0ID0gVmVjMy5kb3QoYXAsIG4pO1xuICAgICAgICBpZiAodCA8IDAgfHwgdCA+IGRldCkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cblxuICAgICAgICBWZWMzLmNyb3NzKGUsIHFwLCBhcCk7XG4gICAgICAgIGxldCB2ID0gVmVjMy5kb3QoYWMsIGUpO1xuICAgICAgICBpZiAodiA8IDAgfHwgdiA+IGRldCkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdyA9IC1WZWMzLmRvdChhYiwgZSk7XG4gICAgICAgIGlmICh3IDwgMC4wIHx8IHYgKyB3ID4gZGV0KSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvdXRQdCkge1xuICAgICAgICAgICAgY29uc3QgaW52RGV0ID0gMS4wIC8gZGV0O1xuICAgICAgICAgICAgdiAqPSBpbnZEZXQ7XG4gICAgICAgICAgICB3ICo9IGludkRldDtcbiAgICAgICAgICAgIGNvbnN0IHUgPSAxLjAgLSB2IC0gdztcblxuICAgICAgICAgICAgLy8gb3V0UHQgPSB1KmEgKyB2KmQgKyB3KmM7XG4gICAgICAgICAgICBWZWMzLnNldChvdXRQdCxcbiAgICAgICAgICAgICAgICB0cmlhbmdsZS5hLnggKiB1ICsgdHJpYW5nbGUuYi54ICogdiArIHRyaWFuZ2xlLmMueCAqIHcsXG4gICAgICAgICAgICAgICAgdHJpYW5nbGUuYS55ICogdSArIHRyaWFuZ2xlLmIueSAqIHYgKyB0cmlhbmdsZS5jLnkgKiB3LFxuICAgICAgICAgICAgICAgIHRyaWFuZ2xlLmEueiAqIHUgKyB0cmlhbmdsZS5iLnogKiB2ICsgdHJpYW5nbGUuYy56ICogdyxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMTtcbiAgICB9O1xufSkoKTtcblxuLyoqXG4gKiAhI2VuIGxpbmUtcXVhZCBpbnRlcnNlY3Q8YnIvPlxuICogISN6aCDnur/mrrXkuI7lm5vovrnlvaLnmoTnm7jkuqTmgKfmo4DmtYvjgIJcbiAqIEBtZXRob2QgbGluZV9xdWFkXG4gKiBAcGFyYW0ge1ZlYzN9IHAgQSBwb2ludCBvbiBhIGxpbmUgc2VnbWVudFxuICogQHBhcmFtIHtWZWMzfSBxIEFub3RoZXIgcG9pbnQgb24gdGhlIGxpbmUgc2VnbWVudFxuICogQHBhcmFtIHtWZWMzfSBhIFF1YWRyaWxhdGVyYWwgcG9pbnQgYVxuICogQHBhcmFtIHtWZWMzfSBiIFF1YWRyaWxhdGVyYWwgcG9pbnQgYlxuICogQHBhcmFtIHtWZWMzfSBjIFF1YWRyaWxhdGVyYWwgcG9pbnQgY1xuICogQHBhcmFtIHtWZWMzfSBkIFF1YWRyaWxhdGVyYWwgcG9pbnQgZFxuICogQHBhcmFtIHtWZWMzfSBvdXRQdCBvcHRpb25hbCwgVGhlIGludGVyc2VjdGlvbiBwb2ludFxuICogQHJldHVybiB7bnVtYmVyfSAwIG9yIG5vdCAwXG4gKi9cbmNvbnN0IGxpbmVfcXVhZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgcHEgPSBuZXcgVmVjMygwLCAwLCAwKTtcbiAgICBjb25zdCBwYSA9IG5ldyBWZWMzKDAsIDAsIDApO1xuICAgIGNvbnN0IHBiID0gbmV3IFZlYzMoMCwgMCwgMCk7XG4gICAgY29uc3QgcGMgPSBuZXcgVmVjMygwLCAwLCAwKTtcbiAgICBjb25zdCBwZCA9IG5ldyBWZWMzKDAsIDAsIDApO1xuICAgIGNvbnN0IG0gPSBuZXcgVmVjMygwLCAwLCAwKTtcbiAgICBjb25zdCB0bXAgPSBuZXcgVmVjMygwLCAwLCAwKTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAocDogVmVjMywgcTogVmVjMywgYTogVmVjMywgYjogVmVjMywgYzogVmVjMywgZDogVmVjMywgb3V0UHQ6IFZlYzMpOiBudW1iZXIge1xuICAgICAgICBWZWMzLnN1YnRyYWN0KHBxLCBxLCBwKTtcbiAgICAgICAgVmVjMy5zdWJ0cmFjdChwYSwgYSwgcCk7XG4gICAgICAgIFZlYzMuc3VidHJhY3QocGIsIGIsIHApO1xuICAgICAgICBWZWMzLnN1YnRyYWN0KHBjLCBjLCBwKTtcblxuICAgICAgICAvLyBEZXRlcm1pbmUgd2hpY2ggdHJpYW5nbGUgdG8gdGVzdCBhZ2FpbnN0IGJ5IHRlc3RpbmcgYWdhaW5zdCBkaWFnb25hbCBmaXJzdFxuICAgICAgICBWZWMzLmNyb3NzKG0sIHBjLCBwcSk7XG4gICAgICAgIGxldCB2ID0gVmVjMy5kb3QocGEsIG0pO1xuXG4gICAgICAgIGlmICh2ID49IDApIHtcbiAgICAgICAgICAgIC8vIFRlc3QgaW50ZXJzZWN0aW9uIGFnYWluc3QgdHJpYW5nbGUgYWJjXG4gICAgICAgICAgICBsZXQgdSA9IC1WZWMzLmRvdChwYiwgbSk7XG4gICAgICAgICAgICBpZiAodSA8IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHcgPSBWZWMzLmRvdChWZWMzLmNyb3NzKHRtcCwgcHEsIHBiKSwgcGEpO1xuICAgICAgICAgICAgaWYgKHcgPCAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIG91dFB0ID0gdSphICsgdipiICsgdypjO1xuICAgICAgICAgICAgaWYgKG91dFB0KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGVub20gPSAxLjAgLyAodSArIHYgKyB3KTtcbiAgICAgICAgICAgICAgICB1ICo9IGRlbm9tO1xuICAgICAgICAgICAgICAgIHYgKj0gZGVub207XG4gICAgICAgICAgICAgICAgdyAqPSBkZW5vbTtcblxuICAgICAgICAgICAgICAgIFZlYzMuc2V0KG91dFB0LFxuICAgICAgICAgICAgICAgICAgICBhLnggKiB1ICsgYi54ICogdiArIGMueCAqIHcsXG4gICAgICAgICAgICAgICAgICAgIGEueSAqIHUgKyBiLnkgKiB2ICsgYy55ICogdyxcbiAgICAgICAgICAgICAgICAgICAgYS56ICogdSArIGIueiAqIHYgKyBjLnogKiB3LFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBUZXN0IGludGVyc2VjdGlvbiBhZ2FpbnN0IHRyaWFuZ2xlIGRhY1xuICAgICAgICAgICAgVmVjMy5zdWJ0cmFjdChwZCwgZCwgcCk7XG5cbiAgICAgICAgICAgIGxldCB1ID0gVmVjMy5kb3QocGQsIG0pO1xuICAgICAgICAgICAgaWYgKHUgPCAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB3ID0gVmVjMy5kb3QoVmVjMy5jcm9zcyh0bXAsIHBxLCBwYSksIHBkKTtcbiAgICAgICAgICAgIGlmICh3IDwgMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBvdXRQdCA9IHUqYSArIHYqZCArIHcqYztcbiAgICAgICAgICAgIGlmIChvdXRQdCkge1xuICAgICAgICAgICAgICAgIHYgPSAtdjtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGRlbm9tID0gMS4wIC8gKHUgKyB2ICsgdyk7XG4gICAgICAgICAgICAgICAgdSAqPSBkZW5vbTtcbiAgICAgICAgICAgICAgICB2ICo9IGRlbm9tO1xuICAgICAgICAgICAgICAgIHcgKj0gZGVub207XG5cbiAgICAgICAgICAgICAgICBWZWMzLnNldChvdXRQdCxcbiAgICAgICAgICAgICAgICAgICAgYS54ICogdSArIGQueCAqIHYgKyBjLnggKiB3LFxuICAgICAgICAgICAgICAgICAgICBhLnkgKiB1ICsgZC55ICogdiArIGMueSAqIHcsXG4gICAgICAgICAgICAgICAgICAgIGEueiAqIHUgKyBkLnogKiB2ICsgYy56ICogdyxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfTtcbn0pKCk7XG5cbi8qKlxuICogISNlbiByYXktc3BoZXJlIGludGVyc2VjdDxici8+XG4gKiAhI3poIOWwhOe6v+WSjOeQg+eahOebuOS6pOaAp+ajgOa1i+OAglxuICogQG1ldGhvZCByYXlfc3BoZXJlXG4gKiBAcGFyYW0ge1JheX0gcmF5XG4gKiBAcGFyYW0ge1NwaGVyZX0gc3BoZXJlXG4gKiBAcmV0dXJuIHtudW1iZXJ9IDAgb3Igbm90IDBcbiAqL1xuY29uc3QgcmF5X3NwaGVyZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgZSA9IG5ldyBWZWMzKDAsIDAsIDApO1xuICAgIHJldHVybiBmdW5jdGlvbiAocmF5OiByYXksIHNwaGVyZTogc3BoZXJlKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgciA9IHNwaGVyZS5yYWRpdXM7XG4gICAgICAgIGNvbnN0IGMgPSBzcGhlcmUuY2VudGVyO1xuICAgICAgICBjb25zdCBvID0gcmF5Lm87XG4gICAgICAgIGNvbnN0IGQgPSByYXkuZDtcbiAgICAgICAgY29uc3QgclNxID0gciAqIHI7XG4gICAgICAgIFZlYzMuc3VidHJhY3QoZSwgYywgbyk7XG4gICAgICAgIGNvbnN0IGVTcSA9IGUubGVuZ3RoU3FyKCk7XG5cbiAgICAgICAgY29uc3QgYUxlbmd0aCA9IFZlYzMuZG90KGUsIGQpOyAvLyBhc3N1bWUgcmF5IGRpcmVjdGlvbiBhbHJlYWR5IG5vcm1hbGl6ZWRcbiAgICAgICAgY29uc3QgZlNxID0gclNxIC0gKGVTcSAtIGFMZW5ndGggKiBhTGVuZ3RoKTtcbiAgICAgICAgaWYgKGZTcSA8IDApIHsgcmV0dXJuIDA7IH1cblxuICAgICAgICBjb25zdCBmID0gTWF0aC5zcXJ0KGZTcSk7XG4gICAgICAgIGNvbnN0IHQgPSBlU3EgPCByU3EgPyBhTGVuZ3RoICsgZiA6IGFMZW5ndGggLSBmO1xuICAgICAgICBpZiAodCA8IDApIHsgcmV0dXJuIDA7IH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbn0pKCk7XG5cbi8qKlxuICogISNlbiByYXktYWFiYiBpbnRlcnNlY3Q8YnIvPlxuICogISN6aCDlsITnur/lkozovbTlr7npvZDljIXlm7Tnm5LnmoTnm7jkuqTmgKfmo4DmtYvjgIJcbiAqIEBtZXRob2QgcmF5X2FhYmJcbiAqIEBwYXJhbSB7UmF5fSByYXlcbiAqIEBwYXJhbSB7QWFiYn0gYWFiYiBBbGlnbiB0aGUgYXhpcyBhcm91bmQgdGhlIGJveFxuICogQHJldHVybiB7bnVtYmVyfSAwIG9yIG5vdCAwXG4gKi9cbmNvbnN0IHJheV9hYWJiID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBtaW4gPSBuZXcgVmVjMygpO1xuICAgIGNvbnN0IG1heCA9IG5ldyBWZWMzKCk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChyYXk6IHJheSwgYWFiYjogYWFiYik6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IG8gPSByYXkubywgZCA9IHJheS5kO1xuICAgICAgICBjb25zdCBpeCA9IDEgLyBkLngsIGl5ID0gMSAvIGQueSwgaXogPSAxIC8gZC56O1xuICAgICAgICBWZWMzLnN1YnRyYWN0KG1pbiwgYWFiYi5jZW50ZXIsIGFhYmIuaGFsZkV4dGVudHMpO1xuICAgICAgICBWZWMzLmFkZChtYXgsIGFhYmIuY2VudGVyLCBhYWJiLmhhbGZFeHRlbnRzKTtcbiAgICAgICAgY29uc3QgdDEgPSAobWluLnggLSBvLngpICogaXg7XG4gICAgICAgIGNvbnN0IHQyID0gKG1heC54IC0gby54KSAqIGl4O1xuICAgICAgICBjb25zdCB0MyA9IChtaW4ueSAtIG8ueSkgKiBpeTtcbiAgICAgICAgY29uc3QgdDQgPSAobWF4LnkgLSBvLnkpICogaXk7XG4gICAgICAgIGNvbnN0IHQ1ID0gKG1pbi56IC0gby56KSAqIGl6O1xuICAgICAgICBjb25zdCB0NiA9IChtYXgueiAtIG8ueikgKiBpejtcbiAgICAgICAgY29uc3QgdG1pbiA9IE1hdGgubWF4KE1hdGgubWF4KE1hdGgubWluKHQxLCB0MiksIE1hdGgubWluKHQzLCB0NCkpLCBNYXRoLm1pbih0NSwgdDYpKTtcbiAgICAgICAgY29uc3QgdG1heCA9IE1hdGgubWluKE1hdGgubWluKE1hdGgubWF4KHQxLCB0MiksIE1hdGgubWF4KHQzLCB0NCkpLCBNYXRoLm1heCh0NSwgdDYpKTtcbiAgICAgICAgaWYgKHRtYXggPCAwIHx8IHRtaW4gPiB0bWF4KSB7IHJldHVybiAwIH07XG4gICAgICAgIHJldHVybiB0bWluO1xuICAgIH07XG59KSgpO1xuXG4vLyBhZGFwdCB0byBvbGQgYXBpXG5jb25zdCByYXlBYWJiID0gcmF5X2FhYmI7XG5cbi8qKlxuICogISNlbiByYXktb2JiIGludGVyc2VjdDxici8+XG4gKiAhI3poIOWwhOe6v+WSjOaWueWQkeWMheWbtOebkueahOebuOS6pOaAp+ajgOa1i+OAglxuICogQG1ldGhvZCByYXlfb2JiXG4gKiBAcGFyYW0ge1JheX0gcmF5XG4gKiBAcGFyYW0ge09iYn0gb2JiIERpcmVjdGlvbiBib3hcbiAqIEByZXR1cm4ge251bWJlcn0gMCBvciBvciAwXG4gKi9cbmNvbnN0IHJheV9vYmIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGxldCBjZW50ZXIgPSBuZXcgVmVjMygpO1xuICAgIGxldCBvID0gbmV3IFZlYzMoKTtcbiAgICBsZXQgZCA9IG5ldyBWZWMzKCk7XG4gICAgY29uc3QgWCA9IG5ldyBWZWMzKCk7XG4gICAgY29uc3QgWSA9IG5ldyBWZWMzKCk7XG4gICAgY29uc3QgWiA9IG5ldyBWZWMzKCk7XG4gICAgY29uc3QgcCA9IG5ldyBWZWMzKCk7XG4gICAgY29uc3Qgc2l6ZSA9IG5ldyBBcnJheSgzKTtcbiAgICBjb25zdCBmID0gbmV3IEFycmF5KDMpO1xuICAgIGNvbnN0IGUgPSBuZXcgQXJyYXkoMyk7XG4gICAgY29uc3QgdCA9IG5ldyBBcnJheSg2KTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAocmF5OiByYXksIG9iYjogb2JiKTogbnVtYmVyIHtcbiAgICAgICAgc2l6ZVswXSA9IG9iYi5oYWxmRXh0ZW50cy54O1xuICAgICAgICBzaXplWzFdID0gb2JiLmhhbGZFeHRlbnRzLnk7XG4gICAgICAgIHNpemVbMl0gPSBvYmIuaGFsZkV4dGVudHMuejtcbiAgICAgICAgY2VudGVyID0gb2JiLmNlbnRlcjtcbiAgICAgICAgbyA9IHJheS5vO1xuICAgICAgICBkID0gcmF5LmQ7XG5cbiAgICAgICAgbGV0IG9iYm0gPSBvYmIub3JpZW50YXRpb24ubTtcblxuICAgICAgICBWZWMzLnNldChYLCBvYmJtWzBdLCBvYmJtWzFdLCBvYmJtWzJdKTtcbiAgICAgICAgVmVjMy5zZXQoWSwgb2JibVszXSwgb2JibVs0XSwgb2JibVs1XSk7XG4gICAgICAgIFZlYzMuc2V0KFosIG9iYm1bNl0sIG9iYm1bN10sIG9iYm1bOF0pO1xuICAgICAgICBWZWMzLnN1YnRyYWN0KHAsIGNlbnRlciwgbyk7XG5cbiAgICAgICAgLy8gVGhlIGNvcyB2YWx1ZXMgb2YgdGhlIHJheSBvbiB0aGUgWCwgWSwgWlxuICAgICAgICBmWzBdID0gVmVjMy5kb3QoWCwgZCk7XG4gICAgICAgIGZbMV0gPSBWZWMzLmRvdChZLCBkKTtcbiAgICAgICAgZlsyXSA9IFZlYzMuZG90KFosIGQpO1xuXG4gICAgICAgIC8vIFRoZSBwcm9qZWN0aW9uIGxlbmd0aCBvZiBQIG9uIFgsIFksIFpcbiAgICAgICAgZVswXSA9IFZlYzMuZG90KFgsIHApO1xuICAgICAgICBlWzFdID0gVmVjMy5kb3QoWSwgcCk7XG4gICAgICAgIGVbMl0gPSBWZWMzLmRvdChaLCBwKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7ICsraSkge1xuICAgICAgICAgICAgaWYgKGZbaV0gPT09IDApIHtcbiAgICAgICAgICAgICAgICBpZiAoLWVbaV0gLSBzaXplW2ldID4gMCB8fCAtZVtpXSArIHNpemVbaV0gPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBBdm9pZCBkaXYgYnkgMCFcbiAgICAgICAgICAgICAgICBmW2ldID0gMC4wMDAwMDAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gbWluXG4gICAgICAgICAgICB0W2kgKiAyICsgMF0gPSAoZVtpXSArIHNpemVbaV0pIC8gZltpXTtcbiAgICAgICAgICAgIC8vIG1heFxuICAgICAgICAgICAgdFtpICogMiArIDFdID0gKGVbaV0gLSBzaXplW2ldKSAvIGZbaV07XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdG1pbiA9IE1hdGgubWF4KFxuICAgICAgICAgICAgTWF0aC5tYXgoXG4gICAgICAgICAgICAgICAgTWF0aC5taW4odFswXSwgdFsxXSksXG4gICAgICAgICAgICAgICAgTWF0aC5taW4odFsyXSwgdFszXSkpLFxuICAgICAgICAgICAgTWF0aC5taW4odFs0XSwgdFs1XSksXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHRtYXggPSBNYXRoLm1pbihcbiAgICAgICAgICAgIE1hdGgubWluKFxuICAgICAgICAgICAgICAgIE1hdGgubWF4KHRbMF0sIHRbMV0pLFxuICAgICAgICAgICAgICAgIE1hdGgubWF4KHRbMl0sIHRbM10pKSxcbiAgICAgICAgICAgIE1hdGgubWF4KHRbNF0sIHRbNV0pLFxuICAgICAgICApO1xuICAgICAgICBpZiAodG1heCA8IDAgfHwgdG1pbiA+IHRtYXggfHwgdG1pbiA8IDApIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRtaW47XG4gICAgfTtcbn0pKCk7XG5cbi8qKlxuICogISNlbiBhYWJiLWFhYmIgaW50ZXJzZWN0PGJyLz5cbiAqICEjemgg6L205a+56b2Q5YyF5Zu055uS5ZKM6L205a+56b2Q5YyF5Zu055uS55qE55u45Lqk5oCn5qOA5rWL44CCXG4gKiBAbWV0aG9kIGFhYmJfYWFiYlxuICogQHBhcmFtIHtBYWJifSBhYWJiMSBBeGlzIGFsaWdubWVudCBzdXJyb3VuZHMgYm94IDFcbiAqIEBwYXJhbSB7QWFiYn0gYWFiYjIgQXhpcyBhbGlnbm1lbnQgc3Vycm91bmRzIGJveCAyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IDAgb3Igbm90IDBcbiAqL1xuY29uc3QgYWFiYl9hYWJiID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBhTWluID0gbmV3IFZlYzMoKTtcbiAgICBjb25zdCBhTWF4ID0gbmV3IFZlYzMoKTtcbiAgICBjb25zdCBiTWluID0gbmV3IFZlYzMoKTtcbiAgICBjb25zdCBiTWF4ID0gbmV3IFZlYzMoKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGFhYmIxOiBhYWJiLCBhYWJiMjogYWFiYikge1xuICAgICAgICBWZWMzLnN1YnRyYWN0KGFNaW4sIGFhYmIxLmNlbnRlciwgYWFiYjEuaGFsZkV4dGVudHMpO1xuICAgICAgICBWZWMzLmFkZChhTWF4LCBhYWJiMS5jZW50ZXIsIGFhYmIxLmhhbGZFeHRlbnRzKTtcbiAgICAgICAgVmVjMy5zdWJ0cmFjdChiTWluLCBhYWJiMi5jZW50ZXIsIGFhYmIyLmhhbGZFeHRlbnRzKTtcbiAgICAgICAgVmVjMy5hZGQoYk1heCwgYWFiYjIuY2VudGVyLCBhYWJiMi5oYWxmRXh0ZW50cyk7XG4gICAgICAgIHJldHVybiAoYU1pbi54IDw9IGJNYXgueCAmJiBhTWF4LnggPj0gYk1pbi54KSAmJlxuICAgICAgICAgICAgKGFNaW4ueSA8PSBiTWF4LnkgJiYgYU1heC55ID49IGJNaW4ueSkgJiZcbiAgICAgICAgICAgIChhTWluLnogPD0gYk1heC56ICYmIGFNYXgueiA+PSBiTWluLnopO1xuICAgIH07XG59KSgpO1xuXG5mdW5jdGlvbiBnZXRBQUJCVmVydGljZXMgKG1pbjogVmVjMywgbWF4OiBWZWMzLCBvdXQ6IFZlYzNbXSkge1xuICAgIFZlYzMuc2V0KG91dFswXSwgbWluLngsIG1heC55LCBtYXgueik7XG4gICAgVmVjMy5zZXQob3V0WzFdLCBtaW4ueCwgbWF4LnksIG1pbi56KTtcbiAgICBWZWMzLnNldChvdXRbMl0sIG1pbi54LCBtaW4ueSwgbWF4LnopO1xuICAgIFZlYzMuc2V0KG91dFszXSwgbWluLngsIG1pbi55LCBtaW4ueik7XG4gICAgVmVjMy5zZXQob3V0WzRdLCBtYXgueCwgbWF4LnksIG1heC56KTtcbiAgICBWZWMzLnNldChvdXRbNV0sIG1heC54LCBtYXgueSwgbWluLnopO1xuICAgIFZlYzMuc2V0KG91dFs2XSwgbWF4LngsIG1pbi55LCBtYXgueik7XG4gICAgVmVjMy5zZXQob3V0WzddLCBtYXgueCwgbWluLnksIG1pbi56KTtcbn1cblxuZnVuY3Rpb24gZ2V0T0JCVmVydGljZXMgKGM6IFZlYzMsIGU6IFZlYzMsIGExOiBWZWMzLCBhMjogVmVjMywgYTM6IFZlYzMsIG91dDogVmVjM1tdKSB7XG4gICAgVmVjMy5zZXQob3V0WzBdLFxuICAgICAgICBjLnggKyBhMS54ICogZS54ICsgYTIueCAqIGUueSArIGEzLnggKiBlLnosXG4gICAgICAgIGMueSArIGExLnkgKiBlLnggKyBhMi55ICogZS55ICsgYTMueSAqIGUueixcbiAgICAgICAgYy56ICsgYTEueiAqIGUueCArIGEyLnogKiBlLnkgKyBhMy56ICogZS56LFxuICAgICk7XG4gICAgVmVjMy5zZXQob3V0WzFdLFxuICAgICAgICBjLnggLSBhMS54ICogZS54ICsgYTIueCAqIGUueSArIGEzLnggKiBlLnosXG4gICAgICAgIGMueSAtIGExLnkgKiBlLnggKyBhMi55ICogZS55ICsgYTMueSAqIGUueixcbiAgICAgICAgYy56IC0gYTEueiAqIGUueCArIGEyLnogKiBlLnkgKyBhMy56ICogZS56LFxuICAgICk7XG4gICAgVmVjMy5zZXQob3V0WzJdLFxuICAgICAgICBjLnggKyBhMS54ICogZS54IC0gYTIueCAqIGUueSArIGEzLnggKiBlLnosXG4gICAgICAgIGMueSArIGExLnkgKiBlLnggLSBhMi55ICogZS55ICsgYTMueSAqIGUueixcbiAgICAgICAgYy56ICsgYTEueiAqIGUueCAtIGEyLnogKiBlLnkgKyBhMy56ICogZS56LFxuICAgICk7XG4gICAgVmVjMy5zZXQob3V0WzNdLFxuICAgICAgICBjLnggKyBhMS54ICogZS54ICsgYTIueCAqIGUueSAtIGEzLnggKiBlLnosXG4gICAgICAgIGMueSArIGExLnkgKiBlLnggKyBhMi55ICogZS55IC0gYTMueSAqIGUueixcbiAgICAgICAgYy56ICsgYTEueiAqIGUueCArIGEyLnogKiBlLnkgLSBhMy56ICogZS56LFxuICAgICk7XG4gICAgVmVjMy5zZXQob3V0WzRdLFxuICAgICAgICBjLnggLSBhMS54ICogZS54IC0gYTIueCAqIGUueSAtIGEzLnggKiBlLnosXG4gICAgICAgIGMueSAtIGExLnkgKiBlLnggLSBhMi55ICogZS55IC0gYTMueSAqIGUueixcbiAgICAgICAgYy56IC0gYTEueiAqIGUueCAtIGEyLnogKiBlLnkgLSBhMy56ICogZS56LFxuICAgICk7XG4gICAgVmVjMy5zZXQob3V0WzVdLFxuICAgICAgICBjLnggKyBhMS54ICogZS54IC0gYTIueCAqIGUueSAtIGEzLnggKiBlLnosXG4gICAgICAgIGMueSArIGExLnkgKiBlLnggLSBhMi55ICogZS55IC0gYTMueSAqIGUueixcbiAgICAgICAgYy56ICsgYTEueiAqIGUueCAtIGEyLnogKiBlLnkgLSBhMy56ICogZS56LFxuICAgICk7XG4gICAgVmVjMy5zZXQob3V0WzZdLFxuICAgICAgICBjLnggLSBhMS54ICogZS54ICsgYTIueCAqIGUueSAtIGEzLnggKiBlLnosXG4gICAgICAgIGMueSAtIGExLnkgKiBlLnggKyBhMi55ICogZS55IC0gYTMueSAqIGUueixcbiAgICAgICAgYy56IC0gYTEueiAqIGUueCArIGEyLnogKiBlLnkgLSBhMy56ICogZS56LFxuICAgICk7XG4gICAgVmVjMy5zZXQob3V0WzddLFxuICAgICAgICBjLnggLSBhMS54ICogZS54IC0gYTIueCAqIGUueSArIGEzLnggKiBlLnosXG4gICAgICAgIGMueSAtIGExLnkgKiBlLnggLSBhMi55ICogZS55ICsgYTMueSAqIGUueixcbiAgICAgICAgYy56IC0gYTEueiAqIGUueCAtIGEyLnogKiBlLnkgKyBhMy56ICogZS56LFxuICAgICk7XG59XG5cbmZ1bmN0aW9uIGdldEludGVydmFsICh2ZXJ0aWNlczogYW55W10gfCBWZWMzW10sIGF4aXM6IFZlYzMpIHtcbiAgICBsZXQgbWluID0gVmVjMy5kb3QoYXhpcywgdmVydGljZXNbMF0pLCBtYXggPSBtaW47XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCA4OyArK2kpIHtcbiAgICAgICAgY29uc3QgcHJvamVjdGlvbiA9IFZlYzMuZG90KGF4aXMsIHZlcnRpY2VzW2ldKTtcbiAgICAgICAgbWluID0gKHByb2plY3Rpb24gPCBtaW4pID8gcHJvamVjdGlvbiA6IG1pbjtcbiAgICAgICAgbWF4ID0gKHByb2plY3Rpb24gPiBtYXgpID8gcHJvamVjdGlvbiA6IG1heDtcbiAgICB9XG4gICAgcmV0dXJuIFttaW4sIG1heF07XG59XG5cbi8qKlxuICogISNlbiBhYWJiLW9iYiBpbnRlcnNlY3Q8YnIvPlxuICogISN6aCDovbTlr7npvZDljIXlm7Tnm5LlkozmlrnlkJHljIXlm7Tnm5LnmoTnm7jkuqTmgKfmo4DmtYvjgIJcbiAqIEBtZXRob2QgYWFiYl9vYmJcbiAqIEBwYXJhbSB7QWFiYn0gYWFiYiBBbGlnbiB0aGUgYXhpcyBhcm91bmQgdGhlIGJveFxuICogQHBhcmFtIHtPYmJ9IG9iYiBEaXJlY3Rpb24gYm94XG4gKiBAcmV0dXJuIHtudW1iZXJ9IDAgb3Igbm90IDBcbiAqL1xuY29uc3QgYWFiYl9vYmIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHRlc3QgPSBuZXcgQXJyYXkoMTUpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTU7IGkrKykge1xuICAgICAgICB0ZXN0W2ldID0gbmV3IFZlYzMoMCwgMCwgMCk7XG4gICAgfVxuICAgIGNvbnN0IHZlcnRpY2VzID0gbmV3IEFycmF5KDgpO1xuICAgIGNvbnN0IHZlcnRpY2VzMiA9IG5ldyBBcnJheSg4KTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDg7IGkrKykge1xuICAgICAgICB2ZXJ0aWNlc1tpXSA9IG5ldyBWZWMzKDAsIDAsIDApO1xuICAgICAgICB2ZXJ0aWNlczJbaV0gPSBuZXcgVmVjMygwLCAwLCAwKTtcbiAgICB9XG4gICAgY29uc3QgbWluID0gbmV3IFZlYzMoKTtcbiAgICBjb25zdCBtYXggPSBuZXcgVmVjMygpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoYWFiYjogYWFiYiwgb2JiOiBvYmIpOiBudW1iZXIge1xuICAgICAgICBsZXQgb2JibSA9IG9iYi5vcmllbnRhdGlvbi5tO1xuXG4gICAgICAgIFZlYzMuc2V0KHRlc3RbMF0sIDEsIDAsIDApO1xuICAgICAgICBWZWMzLnNldCh0ZXN0WzFdLCAwLCAxLCAwKTtcbiAgICAgICAgVmVjMy5zZXQodGVzdFsyXSwgMCwgMCwgMSk7XG4gICAgICAgIFZlYzMuc2V0KHRlc3RbM10sIG9iYm1bMF0sIG9iYm1bMV0sIG9iYm1bMl0pO1xuICAgICAgICBWZWMzLnNldCh0ZXN0WzRdLCBvYmJtWzNdLCBvYmJtWzRdLCBvYmJtWzVdKTtcbiAgICAgICAgVmVjMy5zZXQodGVzdFs1XSwgb2JibVs2XSwgb2JibVs3XSwgb2JibVs4XSk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyArK2kpIHsgLy8gRmlsbCBvdXQgcmVzdCBvZiBheGlzXG4gICAgICAgICAgICBWZWMzLmNyb3NzKHRlc3RbNiArIGkgKiAzICsgMF0sIHRlc3RbaV0sIHRlc3RbMF0pO1xuICAgICAgICAgICAgVmVjMy5jcm9zcyh0ZXN0WzYgKyBpICogMyArIDFdLCB0ZXN0W2ldLCB0ZXN0WzFdKTtcbiAgICAgICAgICAgIFZlYzMuY3Jvc3ModGVzdFs2ICsgaSAqIDMgKyAxXSwgdGVzdFtpXSwgdGVzdFsyXSk7XG4gICAgICAgIH1cblxuICAgICAgICBWZWMzLnN1YnRyYWN0KG1pbiwgYWFiYi5jZW50ZXIsIGFhYmIuaGFsZkV4dGVudHMpO1xuICAgICAgICBWZWMzLmFkZChtYXgsIGFhYmIuY2VudGVyLCBhYWJiLmhhbGZFeHRlbnRzKTtcbiAgICAgICAgZ2V0QUFCQlZlcnRpY2VzKG1pbiwgbWF4LCB2ZXJ0aWNlcyk7XG4gICAgICAgIGdldE9CQlZlcnRpY2VzKG9iYi5jZW50ZXIsIG9iYi5oYWxmRXh0ZW50cywgdGVzdFszXSwgdGVzdFs0XSwgdGVzdFs1XSwgdmVydGljZXMyKTtcblxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDE1OyArK2opIHtcbiAgICAgICAgICAgIGNvbnN0IGEgPSBnZXRJbnRlcnZhbCh2ZXJ0aWNlcywgdGVzdFtqXSk7XG4gICAgICAgICAgICBjb25zdCBiID0gZ2V0SW50ZXJ2YWwodmVydGljZXMyLCB0ZXN0W2pdKTtcbiAgICAgICAgICAgIGlmIChiWzBdID4gYVsxXSB8fCBhWzBdID4gYlsxXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAwOyAvLyBTZXBlcmF0aW5nIGF4aXMgZm91bmRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAxO1xuICAgIH07XG59KSgpO1xuXG4vKipcbiAqICEjZW4gYWFiYi1wbGFuZSBpbnRlcnNlY3Q8YnIvPlxuICogISN6aCDovbTlr7npvZDljIXlm7Tnm5LlkozlubPpnaLnmoTnm7jkuqTmgKfmo4DmtYvjgIJcbiAqIEBtZXRob2QgYWFiYl9wbGFuZVxuICogQHBhcmFtIHtBYWJifSBhYWJiIEFsaWduIHRoZSBheGlzIGFyb3VuZCB0aGUgYm94XG4gKiBAcGFyYW0ge1BsYW5lfSBwbGFuZVxuICogQHJldHVybiB7bnVtYmVyfSBpbnNpZGUoYmFjaykgPSAtMSwgb3V0c2lkZShmcm9udCkgPSAwLCBpbnRlcnNlY3QgPSAxXG4gKi9cbmNvbnN0IGFhYmJfcGxhbmUgPSBmdW5jdGlvbiAoYWFiYjogYWFiYiwgcGxhbmU6IHBsYW5lKTogbnVtYmVyIHtcbiAgICBjb25zdCByID0gYWFiYi5oYWxmRXh0ZW50cy54ICogTWF0aC5hYnMocGxhbmUubi54KSArXG4gICAgICAgIGFhYmIuaGFsZkV4dGVudHMueSAqIE1hdGguYWJzKHBsYW5lLm4ueSkgK1xuICAgICAgICBhYWJiLmhhbGZFeHRlbnRzLnogKiBNYXRoLmFicyhwbGFuZS5uLnopO1xuICAgIGNvbnN0IGRvdCA9IFZlYzMuZG90KHBsYW5lLm4sIGFhYmIuY2VudGVyKTtcbiAgICBpZiAoZG90ICsgciA8IHBsYW5lLmQpIHsgcmV0dXJuIC0xOyB9XG4gICAgZWxzZSBpZiAoZG90IC0gciA+IHBsYW5lLmQpIHsgcmV0dXJuIDA7IH1cbiAgICByZXR1cm4gMTtcbn07XG5cbi8qKlxuICogISNlbiBhYWJiLWZydXN0dW0gaW50ZXJzZWN0LCBmYXN0ZXIgYnV0IGhhcyBmYWxzZSBwb3NpdGl2ZSBjb3JuZXIgY2FzZXM8YnIvPlxuICogISN6aCDovbTlr7npvZDljIXlm7Tnm5LlkozplKXlj7Dnm7jkuqTmgKfmo4DmtYvvvIzpgJ/luqblv6vvvIzkvYbmnInplJnor6/mg4XlhrXjgIJcbiAqIEBtZXRob2QgYWFiYl9mcnVzdHVtXG4gKiBAcGFyYW0ge0FhYmJ9IGFhYmIgQWxpZ24gdGhlIGF4aXMgYXJvdW5kIHRoZSBib3hcbiAqIEBwYXJhbSB7RnJ1c3R1bX0gZnJ1c3R1bVxuICogQHJldHVybiB7bnVtYmVyfSAwIG9yIG5vdCAwXG4gKi9cbmNvbnN0IGFhYmJfZnJ1c3R1bSA9IGZ1bmN0aW9uIChhYWJiOiBhYWJiLCBmcnVzdHVtOiBmcnVzdHVtKTogbnVtYmVyIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZydXN0dW0ucGxhbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vIGZydXN0dW0gcGxhbmUgbm9ybWFsIHBvaW50cyB0byB0aGUgaW5zaWRlXG4gICAgICAgIGlmIChhYWJiX3BsYW5lKGFhYmIsIGZydXN0dW0ucGxhbmVzW2ldKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfSAvLyBjb21wbGV0ZWx5IG91dHNpZGVcbiAgICByZXR1cm4gMTtcbn07XG5cbi8vIGh0dHBzOi8vY2VzaXVtLmNvbS9ibG9nLzIwMTcvMDIvMDIvdGlnaHRlci1mcnVzdHVtLWN1bGxpbmctYW5kLXdoeS15b3UtbWF5LXdhbnQtdG8tZGlzcmVnYXJkLWl0L1xuLyoqXG4gKiAhI2VuIGFhYmItZnJ1c3R1bSBpbnRlcnNlY3QsIGhhbmRsZXMgbW9zdCBvZiB0aGUgZmFsc2UgcG9zaXRpdmVzIGNvcnJlY3RseTxici8+XG4gKiAhI3poIOi9tOWvuem9kOWMheWbtOebkuWSjOmUpeWPsOebuOS6pOaAp+ajgOa1i++8jOato+ehruWkhOeQhuWkp+WkmuaVsOmUmeivr+aDheWGteOAglxuICogQG1ldGhvZCBhYWJiX2ZydXN0dW1fYWNjdXJhdGVcbiAqIEBwYXJhbSB7QWFiYn0gYWFiYiBBbGlnbiB0aGUgYXhpcyBhcm91bmQgdGhlIGJveFxuICogQHBhcmFtIHtGcnVzdHVtfSBmcnVzdHVtXG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cbmNvbnN0IGFhYmJfZnJ1c3R1bV9hY2N1cmF0ZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgdG1wID0gbmV3IEFycmF5KDgpO1xuICAgIGxldCBvdXQxID0gMCwgb3V0MiA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0bXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdG1wW2ldID0gbmV3IFZlYzMoMCwgMCwgMCk7XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiAoYWFiYjogYWFiYiwgZnJ1c3R1bTogZnJ1c3R1bSk6IG51bWJlciB7XG4gICAgICAgIGxldCByZXN1bHQgPSAwLCBpbnRlcnNlY3RzID0gZmFsc2U7XG4gICAgICAgIC8vIDEuIGFhYmIgaW5zaWRlL291dHNpZGUgZnJ1c3R1bSB0ZXN0XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJ1c3R1bS5wbGFuZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGFhYmJfcGxhbmUoYWFiYiwgZnJ1c3R1bS5wbGFuZXNbaV0pO1xuICAgICAgICAgICAgLy8gZnJ1c3R1bSBwbGFuZSBub3JtYWwgcG9pbnRzIHRvIHRoZSBpbnNpZGVcbiAgICAgICAgICAgIGlmIChyZXN1bHQgPT09IC0xKSB7IHJldHVybiAwOyB9IC8vIGNvbXBsZXRlbHkgb3V0c2lkZVxuICAgICAgICAgICAgZWxzZSBpZiAocmVzdWx0ID09PSAxKSB7IGludGVyc2VjdHMgPSB0cnVlOyB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpbnRlcnNlY3RzKSB7IHJldHVybiAxOyB9IC8vIGNvbXBsZXRlbHkgaW5zaWRlXG4gICAgICAgIC8vIGluIGNhc2Ugb2YgZmFsc2UgcG9zaXRpdmVzXG4gICAgICAgIC8vIDIuIGZydXN0dW0gaW5zaWRlL291dHNpZGUgYWFiYiB0ZXN0XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgVmVjMy5zdWJ0cmFjdCh0bXBbaV0sIGZydXN0dW0udmVydGljZXNbaV0sIGFhYmIuY2VudGVyKTtcbiAgICAgICAgfVxuICAgICAgICBvdXQxID0gMCwgb3V0MiA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRtcFtpXS54ID4gYWFiYi5oYWxmRXh0ZW50cy54KSB7IG91dDErKzsgfVxuICAgICAgICAgICAgZWxzZSBpZiAodG1wW2ldLnggPCAtYWFiYi5oYWxmRXh0ZW50cy54KSB7IG91dDIrKzsgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChvdXQxID09PSBmcnVzdHVtLnZlcnRpY2VzLmxlbmd0aCB8fCBvdXQyID09PSBmcnVzdHVtLnZlcnRpY2VzLmxlbmd0aCkgeyByZXR1cm4gMDsgfVxuICAgICAgICBvdXQxID0gMDsgb3V0MiA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRtcFtpXS55ID4gYWFiYi5oYWxmRXh0ZW50cy55KSB7IG91dDErKzsgfVxuICAgICAgICAgICAgZWxzZSBpZiAodG1wW2ldLnkgPCAtYWFiYi5oYWxmRXh0ZW50cy55KSB7IG91dDIrKzsgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChvdXQxID09PSBmcnVzdHVtLnZlcnRpY2VzLmxlbmd0aCB8fCBvdXQyID09PSBmcnVzdHVtLnZlcnRpY2VzLmxlbmd0aCkgeyByZXR1cm4gMDsgfVxuICAgICAgICBvdXQxID0gMDsgb3V0MiA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRtcFtpXS56ID4gYWFiYi5oYWxmRXh0ZW50cy56KSB7IG91dDErKzsgfVxuICAgICAgICAgICAgZWxzZSBpZiAodG1wW2ldLnogPCAtYWFiYi5oYWxmRXh0ZW50cy56KSB7IG91dDIrKzsgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChvdXQxID09PSBmcnVzdHVtLnZlcnRpY2VzLmxlbmd0aCB8fCBvdXQyID09PSBmcnVzdHVtLnZlcnRpY2VzLmxlbmd0aCkgeyByZXR1cm4gMDsgfVxuICAgICAgICByZXR1cm4gMTtcbiAgICB9O1xufSkoKTtcblxuLyoqXG4gKiAhI2VuIG9iYi1wb2ludCBpbnRlcnNlY3Q8YnIvPlxuICogISN6aCDmlrnlkJHljIXlm7Tnm5LlkozngrnnmoTnm7jkuqTmgKfmo4DmtYvjgIJcbiAqIEBtZXRob2Qgb2JiX3BvaW50XG4gKiBAcGFyYW0ge09iYn0gb2JiIERpcmVjdGlvbiBib3hcbiAqIEBwYXJhbSB7VmVjM30gcG9pbnRcbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgb3IgZmFsc2VcbiAqL1xuY29uc3Qgb2JiX3BvaW50ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCB0bXAgPSBuZXcgVmVjMygwLCAwLCAwKSwgbTMgPSBuZXcgTWF0MygpO1xuICAgIGNvbnN0IGxlc3NUaGFuID0gZnVuY3Rpb24gKGE6IFZlYzMsIGI6IFZlYzMpOiBib29sZWFuIHsgcmV0dXJuIE1hdGguYWJzKGEueCkgPCBiLnggJiYgTWF0aC5hYnMoYS55KSA8IGIueSAmJiBNYXRoLmFicyhhLnopIDwgYi56OyB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAob2JiOiBvYmIsIHBvaW50OiBWZWMzKTogYm9vbGVhbiB7XG4gICAgICAgIFZlYzMuc3VidHJhY3QodG1wLCBwb2ludCwgb2JiLmNlbnRlcik7XG4gICAgICAgIFZlYzMudHJhbnNmb3JtTWF0Myh0bXAsIHRtcCwgTWF0My50cmFuc3Bvc2UobTMsIG9iYi5vcmllbnRhdGlvbikpO1xuICAgICAgICByZXR1cm4gbGVzc1RoYW4odG1wLCBvYmIuaGFsZkV4dGVudHMpO1xuICAgIH07XG59KSgpO1xuXG4vKipcbiAqICEjZW4gb2JiLXBsYW5lIGludGVyc2VjdDxici8+XG4gKiAhI3poIOaWueWQkeWMheWbtOebkuWSjOW5s+mdoueahOebuOS6pOaAp+ajgOa1i+OAglxuICogQG1ldGhvZCBvYmJfcGxhbmVcbiAqIEBwYXJhbSB7T2JifSBvYmIgRGlyZWN0aW9uIGJveFxuICogQHBhcmFtIHtQbGFuZX0gcGxhbmVcbiAqIEByZXR1cm4ge251bWJlcn0gaW5zaWRlKGJhY2spID0gLTEsIG91dHNpZGUoZnJvbnQpID0gMCwgaW50ZXJzZWN0ID0gMVxuICovXG5jb25zdCBvYmJfcGxhbmUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGFic0RvdCA9IGZ1bmN0aW9uIChuOiBWZWMzLCB4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmFicyhuLnggKiB4ICsgbi55ICogeSArIG4ueiAqIHopO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvYmI6IG9iYiwgcGxhbmU6IHBsYW5lKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IG9iYm0gPSBvYmIub3JpZW50YXRpb24ubTtcbiAgICAgICAgLy8gUmVhbC1UaW1lIENvbGxpc2lvbiBEZXRlY3Rpb24sIENocmlzdGVyIEVyaWNzb24sIHAuIDE2My5cbiAgICAgICAgY29uc3QgciA9IG9iYi5oYWxmRXh0ZW50cy54ICogYWJzRG90KHBsYW5lLm4sIG9iYm1bMF0sIG9iYm1bMV0sIG9iYm1bMl0pICtcbiAgICAgICAgICAgIG9iYi5oYWxmRXh0ZW50cy55ICogYWJzRG90KHBsYW5lLm4sIG9iYm1bM10sIG9iYm1bNF0sIG9iYm1bNV0pICtcbiAgICAgICAgICAgIG9iYi5oYWxmRXh0ZW50cy56ICogYWJzRG90KHBsYW5lLm4sIG9iYm1bNl0sIG9iYm1bN10sIG9iYm1bOF0pO1xuXG4gICAgICAgIGNvbnN0IGRvdCA9IFZlYzMuZG90KHBsYW5lLm4sIG9iYi5jZW50ZXIpO1xuICAgICAgICBpZiAoZG90ICsgciA8IHBsYW5lLmQpIHsgcmV0dXJuIC0xOyB9XG4gICAgICAgIGVsc2UgaWYgKGRvdCAtIHIgPiBwbGFuZS5kKSB7IHJldHVybiAwOyB9XG4gICAgICAgIHJldHVybiAxO1xuICAgIH07XG59KSgpO1xuXG4vKipcbiAqICEjZW4gb2JiLWZydXN0dW0gaW50ZXJzZWN0LCBmYXN0ZXIgYnV0IGhhcyBmYWxzZSBwb3NpdGl2ZSBjb3JuZXIgY2FzZXM8YnIvPlxuICogISN6aCDmlrnlkJHljIXlm7Tnm5LlkozplKXlj7Dnm7jkuqTmgKfmo4DmtYvvvIzpgJ/luqblv6vvvIzkvYbmnInplJnor6/mg4XlhrXjgIJcbiAqIEBtZXRob2Qgb2JiX2ZydXN0dW1cbiAqIEBwYXJhbSB7T2JifSBvYmIgRGlyZWN0aW9uIGJveFxuICogQHBhcmFtIHtGcnVzdHVtfSBmcnVzdHVtXG4gKiBAcmV0dXJuIHtudW1iZXJ9IDAgb3Igbm90IDBcbiAqL1xuY29uc3Qgb2JiX2ZydXN0dW0gPSBmdW5jdGlvbiAob2JiOiBvYmIsIGZydXN0dW06IGZydXN0dW0pOiBudW1iZXIge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJ1c3R1bS5wbGFuZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gZnJ1c3R1bSBwbGFuZSBub3JtYWwgcG9pbnRzIHRvIHRoZSBpbnNpZGVcbiAgICAgICAgaWYgKG9iYl9wbGFuZShvYmIsIGZydXN0dW0ucGxhbmVzW2ldKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfSAvLyBjb21wbGV0ZWx5IG91dHNpZGVcbiAgICByZXR1cm4gMTtcbn07XG5cbi8vIGh0dHBzOi8vY2VzaXVtLmNvbS9ibG9nLzIwMTcvMDIvMDIvdGlnaHRlci1mcnVzdHVtLWN1bGxpbmctYW5kLXdoeS15b3UtbWF5LXdhbnQtdG8tZGlzcmVnYXJkLWl0L1xuLyoqXG4gKiAhI2VuIG9iYi1mcnVzdHVtIGludGVyc2VjdCwgaGFuZGxlcyBtb3N0IG9mIHRoZSBmYWxzZSBwb3NpdGl2ZXMgY29ycmVjdGx5PGJyLz5cbiAqICEjemgg5pa55ZCR5YyF5Zu055uS5ZKM6ZSl5Y+w55u45Lqk5oCn5qOA5rWL77yM5q2j56Gu5aSE55CG5aSn5aSa5pWw6ZSZ6K+v5oOF5Ya144CCXG4gKiBAbWV0aG9kIG9iYl9mcnVzdHVtX2FjY3VyYXRlXG4gKiBAcGFyYW0ge09iYn0gb2JiIERpcmVjdGlvbiBib3hcbiAqIEBwYXJhbSB7RnJ1c3R1bX0gZnJ1c3R1bVxuICogQHJldHVybiB7bnVtYmVyfSAwIG9yIG5vdCAwXG4gKi9cbmNvbnN0IG9iYl9mcnVzdHVtX2FjY3VyYXRlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCB0bXAgPSBuZXcgQXJyYXkoOCk7XG4gICAgbGV0IGRpc3QgPSAwLCBvdXQxID0gMCwgb3V0MiA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0bXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdG1wW2ldID0gbmV3IFZlYzMoMCwgMCwgMCk7XG4gICAgfVxuICAgIGNvbnN0IGRvdCA9IGZ1bmN0aW9uIChuOiBWZWMzLCB4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIG4ueCAqIHggKyBuLnkgKiB5ICsgbi56ICogejtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAob2JiOiBvYmIsIGZydXN0dW06IGZydXN0dW0pOiBudW1iZXIge1xuICAgICAgICBsZXQgcmVzdWx0ID0gMCwgaW50ZXJzZWN0cyA9IGZhbHNlO1xuICAgICAgICAvLyAxLiBvYmIgaW5zaWRlL291dHNpZGUgZnJ1c3R1bSB0ZXN0XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJ1c3R1bS5wbGFuZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IG9iYl9wbGFuZShvYmIsIGZydXN0dW0ucGxhbmVzW2ldKTtcbiAgICAgICAgICAgIC8vIGZydXN0dW0gcGxhbmUgbm9ybWFsIHBvaW50cyB0byB0aGUgaW5zaWRlXG4gICAgICAgICAgICBpZiAocmVzdWx0ID09PSAtMSkgeyByZXR1cm4gMDsgfSAvLyBjb21wbGV0ZWx5IG91dHNpZGVcbiAgICAgICAgICAgIGVsc2UgaWYgKHJlc3VsdCA9PT0gMSkgeyBpbnRlcnNlY3RzID0gdHJ1ZTsgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghaW50ZXJzZWN0cykgeyByZXR1cm4gMTsgfSAvLyBjb21wbGV0ZWx5IGluc2lkZVxuICAgICAgICAvLyBpbiBjYXNlIG9mIGZhbHNlIHBvc2l0aXZlc1xuICAgICAgICAvLyAyLiBmcnVzdHVtIGluc2lkZS9vdXRzaWRlIG9iYiB0ZXN0XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgVmVjMy5zdWJ0cmFjdCh0bXBbaV0sIGZydXN0dW0udmVydGljZXNbaV0sIG9iYi5jZW50ZXIpO1xuICAgICAgICB9XG4gICAgICAgIG91dDEgPSAwLCBvdXQyID0gMDtcbiAgICAgICAgbGV0IG9iYm0gPSBvYmIub3JpZW50YXRpb24ubTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcnVzdHVtLnZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBkaXN0ID0gZG90KHRtcFtpXSwgb2JibVswXSwgb2JibVsxXSwgb2JibVsyXSk7XG4gICAgICAgICAgICBpZiAoZGlzdCA+IG9iYi5oYWxmRXh0ZW50cy54KSB7IG91dDErKzsgfVxuICAgICAgICAgICAgZWxzZSBpZiAoZGlzdCA8IC1vYmIuaGFsZkV4dGVudHMueCkgeyBvdXQyKys7IH1cbiAgICAgICAgfVxuICAgICAgICBpZiAob3V0MSA9PT0gZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGggfHwgb3V0MiA9PT0gZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGgpIHsgcmV0dXJuIDA7IH1cbiAgICAgICAgb3V0MSA9IDA7IG91dDIgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZydXN0dW0udmVydGljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGRpc3QgPSBkb3QodG1wW2ldLCBvYmJtWzNdLCBvYmJtWzRdLCBvYmJtWzVdKTtcbiAgICAgICAgICAgIGlmIChkaXN0ID4gb2JiLmhhbGZFeHRlbnRzLnkpIHsgb3V0MSsrOyB9XG4gICAgICAgICAgICBlbHNlIGlmIChkaXN0IDwgLW9iYi5oYWxmRXh0ZW50cy55KSB7IG91dDIrKzsgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChvdXQxID09PSBmcnVzdHVtLnZlcnRpY2VzLmxlbmd0aCB8fCBvdXQyID09PSBmcnVzdHVtLnZlcnRpY2VzLmxlbmd0aCkgeyByZXR1cm4gMDsgfVxuICAgICAgICBvdXQxID0gMDsgb3V0MiA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZGlzdCA9IGRvdCh0bXBbaV0sIG9iYm1bNl0sIG9iYm1bN10sIG9iYm1bOF0pO1xuICAgICAgICAgICAgaWYgKGRpc3QgPiBvYmIuaGFsZkV4dGVudHMueikgeyBvdXQxKys7IH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGRpc3QgPCAtb2JiLmhhbGZFeHRlbnRzLnopIHsgb3V0MisrOyB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG91dDEgPT09IGZydXN0dW0udmVydGljZXMubGVuZ3RoIHx8IG91dDIgPT09IGZydXN0dW0udmVydGljZXMubGVuZ3RoKSB7IHJldHVybiAwOyB9XG4gICAgICAgIHJldHVybiAxO1xuICAgIH07XG59KSgpO1xuXG4vKipcbiAqICEjZW4gb2JiLW9iYiBpbnRlcnNlY3Q8YnIvPlxuICogISN6aCDmlrnlkJHljIXlm7Tnm5LlkozmlrnlkJHljIXlm7Tnm5LnmoTnm7jkuqTmgKfmo4DmtYvjgIJcbiAqIEBtZXRob2Qgb2JiX29iYlxuICogQHBhcmFtIHtPYmJ9IG9iYjEgRGlyZWN0aW9uIGJveDFcbiAqIEBwYXJhbSB7T2JifSBvYmIyIERpcmVjdGlvbiBib3gyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IDAgb3Igbm90IDBcbiAqL1xuY29uc3Qgb2JiX29iYiA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgdGVzdCA9IG5ldyBBcnJheSgxNSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNTsgaSsrKSB7XG4gICAgICAgIHRlc3RbaV0gPSBuZXcgVmVjMygwLCAwLCAwKTtcbiAgICB9XG5cbiAgICBjb25zdCB2ZXJ0aWNlcyA9IG5ldyBBcnJheSg4KTtcbiAgICBjb25zdCB2ZXJ0aWNlczIgPSBuZXcgQXJyYXkoOCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA4OyBpKyspIHtcbiAgICAgICAgdmVydGljZXNbaV0gPSBuZXcgVmVjMygwLCAwLCAwKTtcbiAgICAgICAgdmVydGljZXMyW2ldID0gbmV3IFZlYzMoMCwgMCwgMCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvYmIxOiBvYmIsIG9iYjI6IG9iYik6IG51bWJlciB7XG5cbiAgICAgICAgbGV0IG9iYjFtID0gb2JiMS5vcmllbnRhdGlvbi5tO1xuICAgICAgICBsZXQgb2JiMm0gPSBvYmIyLm9yaWVudGF0aW9uLm07XG5cbiAgICAgICAgVmVjMy5zZXQodGVzdFswXSwgb2JiMW1bMF0sIG9iYjFtWzFdLCBvYmIxbVsyXSk7XG4gICAgICAgIFZlYzMuc2V0KHRlc3RbMV0sIG9iYjFtWzNdLCBvYmIxbVs0XSwgb2JiMW1bNV0pO1xuICAgICAgICBWZWMzLnNldCh0ZXN0WzJdLCBvYmIxbVs2XSwgb2JiMW1bN10sIG9iYjFtWzhdKTtcbiAgICAgICAgVmVjMy5zZXQodGVzdFszXSwgb2JiMm1bMF0sIG9iYjJtWzFdLCBvYmIybVsyXSk7XG4gICAgICAgIFZlYzMuc2V0KHRlc3RbNF0sIG9iYjJtWzNdLCBvYmIybVs0XSwgb2JiMm1bNV0pO1xuICAgICAgICBWZWMzLnNldCh0ZXN0WzVdLCBvYmIybVs2XSwgb2JiMm1bN10sIG9iYjJtWzhdKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7ICsraSkgeyAvLyBGaWxsIG91dCByZXN0IG9mIGF4aXNcbiAgICAgICAgICAgIFZlYzMuY3Jvc3ModGVzdFs2ICsgaSAqIDMgKyAwXSwgdGVzdFtpXSwgdGVzdFswXSk7XG4gICAgICAgICAgICBWZWMzLmNyb3NzKHRlc3RbNiArIGkgKiAzICsgMV0sIHRlc3RbaV0sIHRlc3RbMV0pO1xuICAgICAgICAgICAgVmVjMy5jcm9zcyh0ZXN0WzYgKyBpICogMyArIDFdLCB0ZXN0W2ldLCB0ZXN0WzJdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldE9CQlZlcnRpY2VzKG9iYjEuY2VudGVyLCBvYmIxLmhhbGZFeHRlbnRzLCB0ZXN0WzBdLCB0ZXN0WzFdLCB0ZXN0WzJdLCB2ZXJ0aWNlcyk7XG4gICAgICAgIGdldE9CQlZlcnRpY2VzKG9iYjIuY2VudGVyLCBvYmIyLmhhbGZFeHRlbnRzLCB0ZXN0WzNdLCB0ZXN0WzRdLCB0ZXN0WzVdLCB2ZXJ0aWNlczIpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTU7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgYSA9IGdldEludGVydmFsKHZlcnRpY2VzLCB0ZXN0W2ldKTtcbiAgICAgICAgICAgIGNvbnN0IGIgPSBnZXRJbnRlcnZhbCh2ZXJ0aWNlczIsIHRlc3RbaV0pO1xuICAgICAgICAgICAgaWYgKGJbMF0gPiBhWzFdIHx8IGFbMF0gPiBiWzFdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7IC8vIFNlcGVyYXRpbmcgYXhpcyBmb3VuZFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfTtcbn0pKCk7XG5cbi8qKlxuICogISNlbiBwaGVyZS1wbGFuZSBpbnRlcnNlY3QsIG5vdCBuZWNlc3NhcmlseSBmYXN0ZXIgdGhhbiBvYmItcGxhbmU8YnIvPlxuICogZHVlIHRvIHRoZSBsZW5ndGggY2FsY3VsYXRpb24gb2YgdGhlIHBsYW5lIG5vcm1hbCB0byBmYWN0b3Igb3V0PGJyLz5cbiAqIHRoZSB1bm5vbWFsaXplZCBwbGFuZSBkaXN0YW5jZTxici8+XG4gKiAhI3poIOeQg+S4juW5s+mdoueahOebuOS6pOaAp+ajgOa1i+OAglxuICogQG1ldGhvZCBzcGhlcmVfcGxhbmVcbiAqIEBwYXJhbSB7U3BoZXJlfSBzcGhlcmVcbiAqIEBwYXJhbSB7UGxhbmV9IHBsYW5lXG4gKiBAcmV0dXJuIHtudW1iZXJ9IGluc2lkZShiYWNrKSA9IC0xLCBvdXRzaWRlKGZyb250KSA9IDAsIGludGVyc2VjdCA9IDFcbiAqL1xuY29uc3Qgc3BoZXJlX3BsYW5lID0gZnVuY3Rpb24gKHNwaGVyZTogc3BoZXJlLCBwbGFuZTogcGxhbmUpOiBudW1iZXIge1xuICAgIGNvbnN0IGRvdCA9IFZlYzMuZG90KHBsYW5lLm4sIHNwaGVyZS5jZW50ZXIpO1xuICAgIGNvbnN0IHIgPSBzcGhlcmUucmFkaXVzICogcGxhbmUubi5sZW5ndGgoKTtcbiAgICBpZiAoZG90ICsgciA8IHBsYW5lLmQpIHsgcmV0dXJuIC0xOyB9XG4gICAgZWxzZSBpZiAoZG90IC0gciA+IHBsYW5lLmQpIHsgcmV0dXJuIDA7IH1cbiAgICByZXR1cm4gMTtcbn07XG5cbi8qKlxuICogISNlbiBzcGhlcmUtZnJ1c3R1bSBpbnRlcnNlY3QsIGZhc3RlciBidXQgaGFzIGZhbHNlIHBvc2l0aXZlIGNvcm5lciBjYXNlczxici8+XG4gKiAhI3poIOeQg+WSjOmUpeWPsOeahOebuOS6pOaAp+ajgOa1i++8jOmAn+W6puW/q++8jOS9huaciemUmeivr+aDheWGteOAglxuICogQG1ldGhvZCBzcGhlcmVfZnJ1c3R1bVxuICogQHBhcmFtIHtTcGhlcmV9IHNwaGVyZVxuICogQHBhcmFtIHtGcnVzdHVtfSBmcnVzdHVtXG4gKiBAcmV0dXJuIHtudW1iZXJ9IDAgb3Igbm90IDBcbiAqL1xuY29uc3Qgc3BoZXJlX2ZydXN0dW0gPSBmdW5jdGlvbiAoc3BoZXJlOiBzcGhlcmUsIGZydXN0dW06IGZydXN0dW0pOiBudW1iZXIge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJ1c3R1bS5wbGFuZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gZnJ1c3R1bSBwbGFuZSBub3JtYWwgcG9pbnRzIHRvIHRoZSBpbnNpZGVcbiAgICAgICAgaWYgKHNwaGVyZV9wbGFuZShzcGhlcmUsIGZydXN0dW0ucGxhbmVzW2ldKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfSAvLyBjb21wbGV0ZWx5IG91dHNpZGVcbiAgICByZXR1cm4gMTtcbn07XG5cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzIwOTEyNjkyL3ZpZXctZnJ1c3R1bS1jdWxsaW5nLWNvcm5lci1jYXNlc1xuLyoqXG4gKiAhI2VuIHNwaGVyZS1mcnVzdHVtIGludGVyc2VjdCwgaGFuZGxlcyB0aGUgZmFsc2UgcG9zaXRpdmVzIGNvcnJlY3RseTxici8+XG4gKiAhI3poIOeQg+WSjOmUpeWPsOeahOebuOS6pOaAp+ajgOa1i++8jOato+ehruWkhOeQhuWkp+WkmuaVsOmUmeivr+aDheWGteOAglxuICogQG1ldGhvZCBzcGhlcmVfZnJ1c3R1bV9hY2N1cmF0ZVxuICogQHBhcmFtIHtTcGhlcmV9IHNwaGVyZVxuICogQHBhcmFtIHtGcnVzdHVtfSBmcnVzdHVtXG4gKiBAcmV0dXJuIHtudW1iZXJ9IDAgb3Igbm90IDBcbiAqL1xuY29uc3Qgc3BoZXJlX2ZydXN0dW1fYWNjdXJhdGUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHB0ID0gbmV3IFZlYzMoMCwgMCwgMCksIG1hcCA9IFsxLCAtMSwgMSwgLTEsIDEsIC0xXTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHNwaGVyZTogc3BoZXJlLCBmcnVzdHVtOiBmcnVzdHVtKTogbnVtYmVyIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA2OyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHBsYW5lID0gZnJ1c3R1bS5wbGFuZXNbaV07XG4gICAgICAgICAgICBjb25zdCByID0gc3BoZXJlLnJhZGl1cywgYyA9IHNwaGVyZS5jZW50ZXI7XG4gICAgICAgICAgICBjb25zdCBuID0gcGxhbmUubiwgZCA9IHBsYW5lLmQ7XG4gICAgICAgICAgICBjb25zdCBkb3QgPSBWZWMzLmRvdChuLCBjKTtcbiAgICAgICAgICAgIC8vIGZydXN0dW0gcGxhbmUgbm9ybWFsIHBvaW50cyB0byB0aGUgaW5zaWRlXG4gICAgICAgICAgICBpZiAoZG90ICsgciA8IGQpIHsgcmV0dXJuIDA7IH0gLy8gY29tcGxldGVseSBvdXRzaWRlXG4gICAgICAgICAgICBlbHNlIGlmIChkb3QgLSByID4gZCkgeyBjb250aW51ZTsgfVxuICAgICAgICAgICAgLy8gaW4gY2FzZSBvZiBmYWxzZSBwb3NpdGl2ZXNcbiAgICAgICAgICAgIC8vIGhhcyBmYWxzZSBuZWdhdGl2ZXMsIHN0aWxsIHdvcmtpbmcgb24gaXRcbiAgICAgICAgICAgIFZlYzMuYWRkKHB0LCBjLCBWZWMzLm11bHRpcGx5U2NhbGFyKHB0LCBuLCByKSk7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDY7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChqID09PSBpIHx8IGogPT09IGkgKyBtYXBbaV0pIHsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICBjb25zdCB0ZXN0ID0gZnJ1c3R1bS5wbGFuZXNbal07XG4gICAgICAgICAgICAgICAgaWYgKFZlYzMuZG90KHRlc3QubiwgcHQpIDwgdGVzdC5kKSB7IHJldHVybiAwOyB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfTtcbn0pKCk7XG5cbi8qKlxuICogISNlbiBzcGhlcmUtc3BoZXJlIGludGVyc2VjdDxici8+XG4gKiAhI3poIOeQg+WSjOeQg+eahOebuOS6pOaAp+ajgOa1i+OAglxuICogQG1ldGhvZCBzcGhlcmVfc3BoZXJlXG4gKiBAcGFyYW0ge1NwaGVyZX0gc3BoZXJlMFxuICogQHBhcmFtIHtTcGhlcmV9IHNwaGVyZTFcbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgb3IgZmFsc2VcbiAqL1xuY29uc3Qgc3BoZXJlX3NwaGVyZSA9IGZ1bmN0aW9uIChzcGhlcmUwOiBzcGhlcmUsIHNwaGVyZTE6IHNwaGVyZSk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHIgPSBzcGhlcmUwLnJhZGl1cyArIHNwaGVyZTEucmFkaXVzO1xuICAgIHJldHVybiBWZWMzLnNxdWFyZWREaXN0YW5jZShzcGhlcmUwLmNlbnRlciwgc3BoZXJlMS5jZW50ZXIpIDwgciAqIHI7XG59O1xuXG4vKipcbiAqICEjZW4gc3BoZXJlLWFhYmIgaW50ZXJzZWN0PGJyLz5cbiAqICEjemgg55CD5ZKM6L205a+56b2Q5YyF5Zu055uS55qE55u45Lqk5oCn5qOA5rWL44CCXG4gKiBAbWV0aG9kIHNwaGVyZV9hYWJiXG4gKiBAcGFyYW0ge1NwaGVyZX0gc3BoZXJlXG4gKiBAcGFyYW0ge0FhYmJ9IGFhYmJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgb3IgZmFsc2VcbiAqL1xuY29uc3Qgc3BoZXJlX2FhYmIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHB0ID0gbmV3IFZlYzMoKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHNwaGVyZTogc3BoZXJlLCBhYWJiOiBhYWJiKTogYm9vbGVhbiB7XG4gICAgICAgIGRpc3RhbmNlLnB0X3BvaW50X2FhYmIocHQsIHNwaGVyZS5jZW50ZXIsIGFhYmIpO1xuICAgICAgICByZXR1cm4gVmVjMy5zcXVhcmVkRGlzdGFuY2Uoc3BoZXJlLmNlbnRlciwgcHQpIDwgc3BoZXJlLnJhZGl1cyAqIHNwaGVyZS5yYWRpdXM7XG4gICAgfTtcbn0pKCk7XG5cbi8qKlxuICogISNlbiBzcGhlcmUtb2JiIGludGVyc2VjdDxici8+XG4gKiAhI3poIOeQg+WSjOaWueWQkeWMheWbtOebkueahOebuOS6pOaAp+ajgOa1i+OAglxuICogQG1ldGhvZCBzcGhlcmVfb2JiXG4gKiBAcGFyYW0ge1NwaGVyZX0gc3BoZXJlXG4gKiBAcGFyYW0ge09iYn0gb2JiXG4gKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIG9yIGZhbHNlXG4gKi9cbmNvbnN0IHNwaGVyZV9vYmIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHB0ID0gbmV3IFZlYzMoKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHNwaGVyZTogc3BoZXJlLCBvYmI6IG9iYik6IGJvb2xlYW4ge1xuICAgICAgICBkaXN0YW5jZS5wdF9wb2ludF9vYmIocHQsIHNwaGVyZS5jZW50ZXIsIG9iYik7XG4gICAgICAgIHJldHVybiBWZWMzLnNxdWFyZWREaXN0YW5jZShzcGhlcmUuY2VudGVyLCBwdCkgPCBzcGhlcmUucmFkaXVzICogc3BoZXJlLnJhZGl1cztcbiAgICB9O1xufSkoKTtcblxuY29uc3QgaW50ZXJzZWN0ID0ge1xuICAgIC8vIG9sZCBhcGlcbiAgICByYXlBYWJiLFxuICAgIHJheU1lc2gsXG4gICAgcmF5Y2FzdCxcbiAgICByYXlUcmlhbmdsZSxcblxuICAgIHJheV9zcGhlcmUsXG4gICAgcmF5X2FhYmIsXG4gICAgcmF5X29iYixcbiAgICByYXlfcGxhbmUsXG4gICAgcmF5X3RyaWFuZ2xlLFxuICAgIGxpbmVfcGxhbmUsXG4gICAgbGluZV90cmlhbmdsZSxcbiAgICBsaW5lX3F1YWQsXG5cbiAgICBzcGhlcmVfc3BoZXJlLFxuICAgIHNwaGVyZV9hYWJiLFxuICAgIHNwaGVyZV9vYmIsXG4gICAgc3BoZXJlX3BsYW5lLFxuICAgIHNwaGVyZV9mcnVzdHVtLFxuICAgIHNwaGVyZV9mcnVzdHVtX2FjY3VyYXRlLFxuXG4gICAgYWFiYl9hYWJiLFxuICAgIGFhYmJfb2JiLFxuICAgIGFhYmJfcGxhbmUsXG4gICAgYWFiYl9mcnVzdHVtLFxuICAgIGFhYmJfZnJ1c3R1bV9hY2N1cmF0ZSxcblxuICAgIG9iYl9vYmIsXG4gICAgb2JiX3BsYW5lLFxuICAgIG9iYl9mcnVzdHVtLFxuICAgIG9iYl9mcnVzdHVtX2FjY3VyYXRlLFxuICAgIG9iYl9wb2ludCxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBUaGUgaW50ZXJzZWN0aW9uIGRldGVjdGlvbiBvZiBnMSBhbmQgZzIgY2FuIGZpbGwgaW4gdGhlIHNoYXBlIGluIHRoZSBiYXNpYyBnZW9tZXRyeS5cbiAgICAgKiAhI3poXG4gICAgICogZzEg5ZKMIGcyIOeahOebuOS6pOaAp+ajgOa1i++8jOWPr+Whq+WFpeWfuuehgOWHoOS9leS4reeahOW9oueKtuOAglxuICAgICAqIEBtZXRob2QgcmVzb2x2ZVxuICAgICAqIEBwYXJhbSBnMSBHZW9tZXRyeSAxXG4gICAgICogQHBhcmFtIGcyIEdlb21ldHJ5IDJcbiAgICAgKiBAcGFyYW0gb3V0UHQgb3B0aW9uYWwsIEludGVyc2VjdGlvbiBwb2ludC4gKG5vdGU6IG9ubHkgcGFydGlhbCBzaGFwZSBkZXRlY3Rpb24gd2l0aCB0aGlzIHJldHVybiB2YWx1ZSlcbiAgICAgKi9cbiAgICByZXNvbHZlIChnMTogYW55LCBnMjogYW55LCBvdXRQdCA9IG51bGwpIHtcbiAgICAgICAgY29uc3QgdHlwZTEgPSBnMS5fdHlwZSwgdHlwZTIgPSBnMi5fdHlwZTtcbiAgICAgICAgY29uc3QgcmVzb2x2ZXIgPSB0aGlzW3R5cGUxIHwgdHlwZTJdO1xuICAgICAgICBpZiAodHlwZTEgPCB0eXBlMikgeyByZXR1cm4gcmVzb2x2ZXIoZzEsIGcyLCBvdXRQdCk7IH1cbiAgICAgICAgZWxzZSB7IHJldHVybiByZXNvbHZlcihnMiwgZzEsIG91dFB0KTsgfVxuICAgIH0sXG59O1xuXG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfUkFZIHwgZW51bXMuU0hBUEVfU1BIRVJFXSA9IHJheV9zcGhlcmU7XG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfUkFZIHwgZW51bXMuU0hBUEVfQUFCQl0gPSByYXlfYWFiYjtcbmludGVyc2VjdFtlbnVtcy5TSEFQRV9SQVkgfCBlbnVtcy5TSEFQRV9PQkJdID0gcmF5X29iYjtcbmludGVyc2VjdFtlbnVtcy5TSEFQRV9SQVkgfCBlbnVtcy5TSEFQRV9QTEFORV0gPSByYXlfcGxhbmU7XG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfUkFZIHwgZW51bXMuU0hBUEVfVFJJQU5HTEVdID0gcmF5X3RyaWFuZ2xlO1xuaW50ZXJzZWN0W2VudW1zLlNIQVBFX0xJTkUgfCBlbnVtcy5TSEFQRV9QTEFORV0gPSBsaW5lX3BsYW5lO1xuaW50ZXJzZWN0W2VudW1zLlNIQVBFX0xJTkUgfCBlbnVtcy5TSEFQRV9UUklBTkdMRV0gPSBsaW5lX3RyaWFuZ2xlO1xuXG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfU1BIRVJFXSA9IHNwaGVyZV9zcGhlcmU7XG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfU1BIRVJFIHwgZW51bXMuU0hBUEVfQUFCQl0gPSBzcGhlcmVfYWFiYjtcbmludGVyc2VjdFtlbnVtcy5TSEFQRV9TUEhFUkUgfCBlbnVtcy5TSEFQRV9PQkJdID0gc3BoZXJlX29iYjtcbmludGVyc2VjdFtlbnVtcy5TSEFQRV9TUEhFUkUgfCBlbnVtcy5TSEFQRV9QTEFORV0gPSBzcGhlcmVfcGxhbmU7XG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfU1BIRVJFIHwgZW51bXMuU0hBUEVfRlJVU1RVTV0gPSBzcGhlcmVfZnJ1c3R1bTtcbmludGVyc2VjdFtlbnVtcy5TSEFQRV9TUEhFUkUgfCBlbnVtcy5TSEFQRV9GUlVTVFVNX0FDQ1VSQVRFXSA9IHNwaGVyZV9mcnVzdHVtX2FjY3VyYXRlO1xuXG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfQUFCQl0gPSBhYWJiX2FhYmI7XG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfQUFCQiB8IGVudW1zLlNIQVBFX09CQl0gPSBhYWJiX29iYjtcbmludGVyc2VjdFtlbnVtcy5TSEFQRV9BQUJCIHwgZW51bXMuU0hBUEVfUExBTkVdID0gYWFiYl9wbGFuZTtcbmludGVyc2VjdFtlbnVtcy5TSEFQRV9BQUJCIHwgZW51bXMuU0hBUEVfRlJVU1RVTV0gPSBhYWJiX2ZydXN0dW07XG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfQUFCQiB8IGVudW1zLlNIQVBFX0ZSVVNUVU1fQUNDVVJBVEVdID0gYWFiYl9mcnVzdHVtX2FjY3VyYXRlO1xuXG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfT0JCXSA9IG9iYl9vYmI7XG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfT0JCIHwgZW51bXMuU0hBUEVfUExBTkVdID0gb2JiX3BsYW5lO1xuaW50ZXJzZWN0W2VudW1zLlNIQVBFX09CQiB8IGVudW1zLlNIQVBFX0ZSVVNUVU1dID0gb2JiX2ZydXN0dW07XG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfT0JCIHwgZW51bXMuU0hBUEVfRlJVU1RVTV9BQ0NVUkFURV0gPSBvYmJfZnJ1c3R1bV9hY2N1cmF0ZTtcblxuZXhwb3J0IGRlZmF1bHQgaW50ZXJzZWN0O1xuIl19