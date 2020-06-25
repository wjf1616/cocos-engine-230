
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/geom-utils/distance.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.point_plane = point_plane;
exports.pt_point_plane = pt_point_plane;
exports.pt_point_aabb = pt_point_aabb;
exports.pt_point_obb = pt_point_obb;

var _valueTypes = require("../value-types");

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
var X = new _valueTypes.Vec3();
var Y = new _valueTypes.Vec3();
var Z = new _valueTypes.Vec3();
var d = new _valueTypes.Vec3();
var min = new _valueTypes.Vec3();
var max = new _valueTypes.Vec3();
var u = new Array(3);
var e = new Array(3);
/**
 * !#en
 * the distance between a point and a plane
 * !#zh
 * 计算点和平面之间的距离。
 * @method point_plane
 * @param {Vec3} point
 * @param {Plane} plane
 * @return Distance
 */

function point_plane(point, plane_) {
  return _valueTypes.Vec3.dot(plane_.n, point) - plane_.d;
}
/**
 * !#en
 * the closest point on plane to a given point
 * !#zh
 * 计算平面上最接近给定点的点。
 * @method pt_point_plane
 * @param out Closest point
 * @param point Given point
 * @param plane
 * @return Closest point
 */


function pt_point_plane(out, point, plane_) {
  var t = point_plane(point, plane_);
  return _valueTypes.Vec3.subtract(out, point, _valueTypes.Vec3.multiplyScalar(out, plane_.n, t));
}
/**
 * !#en
 * the closest point on aabb to a given point
 * !#zh
 * 计算 aabb 上最接近给定点的点。
 * @method pt_point_aabb
 * @param {Vec3} out Closest point.
 * @param {Vec3} point Given point.
 * @param {Aabb} aabb Align the axis around the box.
 * @return {Vec3} Closest point.
 */


function pt_point_aabb(out, point, aabb_) {
  _valueTypes.Vec3.copy(out, point);

  _valueTypes.Vec3.subtract(min, aabb_.center, aabb_.halfExtents);

  _valueTypes.Vec3.add(max, aabb_.center, aabb_.halfExtents);

  out.x = out.x < min.x ? min.x : out.x;
  out.y = out.y < min.x ? min.y : out.y;
  out.z = out.z < min.x ? min.z : out.z;
  out.x = out.x > max.x ? max.x : out.x;
  out.y = out.y > max.x ? max.y : out.y;
  out.z = out.z > max.x ? max.z : out.z;
  return out;
}
/**
 * !#en
 * the closest point on obb to a given point
 * !#zh
 * 计算 obb 上最接近给定点的点。
 * @method pt_point_obb
 * @param {Vec3} out Closest point
 * @param {Vec3} point Given point
 * @param {Obb} obb Direction box
 * @return {Vec3} closest point
 */


function pt_point_obb(out, point, obb_) {
  var obbm = obb_.orientation.m;

  _valueTypes.Vec3.set(X, obbm[0], obbm[1], obbm[2]);

  _valueTypes.Vec3.set(Y, obbm[3], obbm[4], obbm[5]);

  _valueTypes.Vec3.set(Z, obbm[6], obbm[7], obbm[8]);

  u[0] = X;
  u[1] = Y;
  u[2] = Z;
  e[0] = obb_.halfExtents.x;
  e[1] = obb_.halfExtents.y;
  e[2] = obb_.halfExtents.z;

  _valueTypes.Vec3.subtract(d, point, obb_.center); // Start result at center of obb; make steps from there


  _valueTypes.Vec3.set(out, obb_.center.x, obb_.center.y, obb_.center.z); // For each OBB axis...


  for (var i = 0; i < 3; i++) {
    // ...project d onto that axis to get the distance
    // along the axis of d from the obb center
    var dist = _valueTypes.Vec3.dot(d, u[i]); // if distance farther than the obb extents, clamp to the obb


    if (dist > e[i]) {
      dist = e[i];
    }

    if (dist < -e[i]) {
      dist = -e[i];
    } // Step that distance along the axis to get world coordinate


    out.x += dist * u[i].x;
    out.y += dist * u[i].y;
    out.z += dist * u[i].z;
  }

  return out;
}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRpc3RhbmNlLnRzIl0sIm5hbWVzIjpbIlgiLCJWZWMzIiwiWSIsIloiLCJkIiwibWluIiwibWF4IiwidSIsIkFycmF5IiwiZSIsInBvaW50X3BsYW5lIiwicG9pbnQiLCJwbGFuZV8iLCJkb3QiLCJuIiwicHRfcG9pbnRfcGxhbmUiLCJvdXQiLCJ0Iiwic3VidHJhY3QiLCJtdWx0aXBseVNjYWxhciIsInB0X3BvaW50X2FhYmIiLCJhYWJiXyIsImNvcHkiLCJjZW50ZXIiLCJoYWxmRXh0ZW50cyIsImFkZCIsIngiLCJ5IiwieiIsInB0X3BvaW50X29iYiIsIm9iYl8iLCJvYmJtIiwib3JpZW50YXRpb24iLCJtIiwic2V0IiwiaSIsImRpc3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkE7O0FBekJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE2QkEsSUFBTUEsQ0FBQyxHQUFHLElBQUlDLGdCQUFKLEVBQVY7QUFDQSxJQUFNQyxDQUFDLEdBQUcsSUFBSUQsZ0JBQUosRUFBVjtBQUNBLElBQU1FLENBQUMsR0FBRyxJQUFJRixnQkFBSixFQUFWO0FBQ0EsSUFBTUcsQ0FBQyxHQUFHLElBQUlILGdCQUFKLEVBQVY7QUFDQSxJQUFNSSxHQUFHLEdBQUcsSUFBSUosZ0JBQUosRUFBWjtBQUNBLElBQU1LLEdBQUcsR0FBRyxJQUFJTCxnQkFBSixFQUFaO0FBQ0EsSUFBTU0sQ0FBQyxHQUFHLElBQUlDLEtBQUosQ0FBVSxDQUFWLENBQVY7QUFDQSxJQUFNQyxDQUFDLEdBQUcsSUFBSUQsS0FBSixDQUFVLENBQVYsQ0FBVjtBQUVBOzs7Ozs7Ozs7OztBQVVPLFNBQVNFLFdBQVQsQ0FBc0JDLEtBQXRCLEVBQW1DQyxNQUFuQyxFQUFrRDtBQUNyRCxTQUFPWCxpQkFBS1ksR0FBTCxDQUFTRCxNQUFNLENBQUNFLENBQWhCLEVBQW1CSCxLQUFuQixJQUE0QkMsTUFBTSxDQUFDUixDQUExQztBQUNIO0FBRUQ7Ozs7Ozs7Ozs7Ozs7QUFXTyxTQUFT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SSxHQUFHLENBQUMzQixDQUFDLENBQUMwQixDQUFELENBQVQ7QUFDSCxLQVp1QixDQWN4Qjs7O0FBQ0FuQixJQUFBQSxHQUFHLENBQUNVLENBQUosSUFBU1UsSUFBSSxHQUFHN0IsQ0FBQyxDQUFDNEIsQ0FBRCxDQUFELENBQUtULENBQXJCO0FBQ0FWLElBQUFBLEdBQUcsQ0FBQ1csQ0FBSixJQUFTUyxJQUFJLEdBQUc3QixDQUFDLENBQUM0QixDQUFELENBQUQsQ0FBS1IsQ0FBckI7QUFDQVgsSUFBQUEsR0FBRyxDQUFDWSxDQUFKLElBQVNRLElBQUksR0FBRzdCLENBQUMsQ0FBQzRCLENBQUQsQ0FBRCxDQUFLUCxDQUFyQjtBQUNIOztBQUNELFNBQU9aLEdBQVA7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE5IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgeyBWZWMzIH0gZnJvbSAnLi4vdmFsdWUtdHlwZXMnO1xuaW1wb3J0IGFhYmIgZnJvbSAnLi9hYWJiJztcbmltcG9ydCBvYmIgZnJvbSAnLi9vYmInO1xuaW1wb3J0IHBsYW5lIGZyb20gJy4vcGxhbmUnO1xuY29uc3QgWCA9IG5ldyBWZWMzKCk7XG5jb25zdCBZID0gbmV3IFZlYzMoKTtcbmNvbnN0IFogPSBuZXcgVmVjMygpO1xuY29uc3QgZCA9IG5ldyBWZWMzKCk7XG5jb25zdCBtaW4gPSBuZXcgVmVjMygpO1xuY29uc3QgbWF4ID0gbmV3IFZlYzMoKTtcbmNvbnN0IHUgPSBuZXcgQXJyYXkoMyk7XG5jb25zdCBlID0gbmV3IEFycmF5KDMpO1xuXG4vKipcbiAqICEjZW5cbiAqIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIGEgcG9pbnQgYW5kIGEgcGxhbmVcbiAqICEjemhcbiAqIOiuoeeul+eCueWSjOW5s+mdouS5i+mXtOeahOi3neemu+OAglxuICogQG1ldGhvZCBwb2ludF9wbGFuZVxuICogQHBhcmFtIHtWZWMzfSBwb2ludFxuICogQHBhcmFtIHtQbGFuZX0gcGxhbmVcbiAqIEByZXR1cm4gRGlzdGFuY2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBvaW50X3BsYW5lIChwb2ludDogVmVjMywgcGxhbmVfOiBwbGFuZSkge1xuICAgIHJldHVybiBWZWMzLmRvdChwbGFuZV8ubiwgcG9pbnQpIC0gcGxhbmVfLmQ7XG59XG5cbi8qKlxuICogISNlblxuICogdGhlIGNsb3Nlc3QgcG9pbnQgb24gcGxhbmUgdG8gYSBnaXZlbiBwb2ludFxuICogISN6aFxuICog6K6h566X5bmz6Z2i5LiK5pyA5o6l6L+R57uZ5a6a54K555qE54K544CCXG4gKiBAbWV0aG9kIHB0X3BvaW50X3BsYW5lXG4gKiBAcGFyYW0gb3V0IENsb3Nlc3QgcG9pbnRcbiAqIEBwYXJhbSBwb2ludCBHaXZlbiBwb2ludFxuICogQHBhcmFtIHBsYW5lXG4gKiBAcmV0dXJuIENsb3Nlc3QgcG9pbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHB0X3BvaW50X3BsYW5lIChvdXQ6IFZlYzMsIHBvaW50OiBWZWMzLCBwbGFuZV86IHBsYW5lKSB7XG4gICAgY29uc3QgdCA9IHBvaW50X3BsYW5lKHBvaW50LCBwbGFuZV8pO1xuICAgIHJldHVybiBWZWMzLnN1YnRyYWN0KG91dCwgcG9pbnQsIFZlYzMubXVsdGlwbHlTY2FsYXIob3V0LCBwbGFuZV8ubiwgdCkpO1xufVxuXG4vKipcbiAqICEjZW5cbiAqIHRoZSBjbG9zZXN0IHBvaW50IG9uIGFhYmIgdG8gYSBnaXZlbiBwb2ludFxuICogISN6aFxuICog6K6h566XIGFhYmIg5LiK5pyA5o6l6L+R57uZ5a6a54K555qE54K544CCXG4gKiBAbWV0aG9kIHB0X3BvaW50X2FhYmJcbiAqIEBwYXJhbSB7VmVjM30gb3V0IENsb3Nlc3QgcG9pbnQuXG4gKiBAcGFyYW0ge1ZlYzN9IHBvaW50IEdpdmVuIHBvaW50LlxuICogQHBhcmFtIHtBYWJifSBhYWJiIEFsaWduIHRoZSBheGlzIGFyb3VuZCB0aGUgYm94LlxuICogQHJldHVybiB7VmVjM30gQ2xvc2VzdCBwb2ludC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHB0X3BvaW50X2FhYmIgKG91dDogVmVjMywgcG9pbnQ6IFZlYzMsIGFhYmJfOiBhYWJiKTogVmVjMyB7XG4gICAgVmVjMy5jb3B5KG91dCwgcG9pbnQpO1xuICAgIFZlYzMuc3VidHJhY3QobWluLCBhYWJiXy5jZW50ZXIsIGFhYmJfLmhhbGZFeHRlbnRzKTtcbiAgICBWZWMzLmFkZChtYXgsIGFhYmJfLmNlbnRlciwgYWFiYl8uaGFsZkV4dGVudHMpO1xuXG4gICAgb3V0LnggPSAob3V0LnggPCBtaW4ueCkgPyBtaW4ueCA6IG91dC54O1xuICAgIG91dC55ID0gKG91dC55IDwgbWluLngpID8gbWluLnkgOiBvdXQueTtcbiAgICBvdXQueiA9IChvdXQueiA8IG1pbi54KSA/IG1pbi56IDogb3V0Lno7XG5cbiAgICBvdXQueCA9IChvdXQueCA+IG1heC54KSA/IG1heC54IDogb3V0Lng7XG4gICAgb3V0LnkgPSAob3V0LnkgPiBtYXgueCkgPyBtYXgueSA6IG91dC55O1xuICAgIG91dC56ID0gKG91dC56ID4gbWF4LngpID8gbWF4LnogOiBvdXQuejtcbiAgICByZXR1cm4gb3V0O1xufVxuXG4vKipcbiAqICEjZW5cbiAqIHRoZSBjbG9zZXN0IHBvaW50IG9uIG9iYiB0byBhIGdpdmVuIHBvaW50XG4gKiAhI3poXG4gKiDorqHnrpcgb2JiIOS4iuacgOaOpei/kee7meWumueCueeahOeCueOAglxuICogQG1ldGhvZCBwdF9wb2ludF9vYmJcbiAqIEBwYXJhbSB7VmVjM30gb3V0IENsb3Nlc3QgcG9pbnRcbiAqIEBwYXJhbSB7VmVjM30gcG9pbnQgR2l2ZW4gcG9pbnRcbiAqIEBwYXJhbSB7T2JifSBvYmIgRGlyZWN0aW9uIGJveFxuICogQHJldHVybiB7VmVjM30gY2xvc2VzdCBwb2ludFxuICovXG5leHBvcnQgZnVuY3Rpb24gcHRfcG9pbnRfb2JiIChvdXQ6IFZlYzMsIHBvaW50OiBWZWMzLCBvYmJfOiBvYmIpOiBWZWMzIHtcbiAgICBsZXQgb2JibSA9IG9iYl8ub3JpZW50YXRpb24ubTtcbiAgICBWZWMzLnNldChYLCBvYmJtWzBdLCBvYmJtWzFdLCBvYmJtWzJdKTtcbiAgICBWZWMzLnNldChZLCBvYmJtWzNdLCBvYmJtWzRdLCBvYmJtWzVdKTtcbiAgICBWZWMzLnNldChaLCBvYmJtWzZdLCBvYmJtWzddLCBvYmJtWzhdKTtcblxuICAgIHVbMF0gPSBYO1xuICAgIHVbMV0gPSBZO1xuICAgIHVbMl0gPSBaO1xuICAgIGVbMF0gPSBvYmJfLmhhbGZFeHRlbnRzLng7XG4gICAgZVsxXSA9IG9iYl8uaGFsZkV4dGVudHMueTtcbiAgICBlWzJdID0gb2JiXy5oYWxmRXh0ZW50cy56O1xuXG4gICAgVmVjMy5zdWJ0cmFjdChkLCBwb2ludCwgb2JiXy5jZW50ZXIpO1xuXG4gICAgLy8gU3RhcnQgcmVzdWx0IGF0IGNlbnRlciBvZiBvYmI7IG1ha2Ugc3RlcHMgZnJvbSB0aGVyZVxuICAgIFZlYzMuc2V0KG91dCwgb2JiXy5jZW50ZXIueCwgb2JiXy5jZW50ZXIueSwgb2JiXy5jZW50ZXIueik7XG5cbiAgICAvLyBGb3IgZWFjaCBPQkIgYXhpcy4uLlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG5cbiAgICAgICAgLy8gLi4ucHJvamVjdCBkIG9udG8gdGhhdCBheGlzIHRvIGdldCB0aGUgZGlzdGFuY2VcbiAgICAgICAgLy8gYWxvbmcgdGhlIGF4aXMgb2YgZCBmcm9tIHRoZSBvYmIgY2VudGVyXG4gICAgICAgIGxldCBkaXN0ID0gVmVjMy5kb3QoZCwgdVtpXSk7XG5cbiAgICAgICAgLy8gaWYgZGlzdGFuY2UgZmFydGhlciB0aGFuIHRoZSBvYmIgZXh0ZW50cywgY2xhbXAgdG8gdGhlIG9iYlxuICAgICAgICBpZiAoZGlzdCA+IGVbaV0pIHtcbiAgICAgICAgICAgIGRpc3QgPSBlW2ldO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkaXN0IDwgLWVbaV0pIHtcbiAgICAgICAgICAgIGRpc3QgPSAtZVtpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFN0ZXAgdGhhdCBkaXN0YW5jZSBhbG9uZyB0aGUgYXhpcyB0byBnZXQgd29ybGQgY29vcmRpbmF0ZVxuICAgICAgICBvdXQueCArPSBkaXN0ICogdVtpXS54O1xuICAgICAgICBvdXQueSArPSBkaXN0ICogdVtpXS55O1xuICAgICAgICBvdXQueiArPSBkaXN0ICogdVtpXS56O1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xufVxuIl19