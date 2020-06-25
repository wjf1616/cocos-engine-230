
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/geom-utils/plane.js';
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
var v1 = new _valueTypes.Vec3(0, 0, 0);
var v2 = new _valueTypes.Vec3(0, 0, 0);
var temp_mat = cc.mat4();
var temp_vec4 = cc.v4();
/**
 * !#en
 * plane。
 * !#zh
 * 平面。
 * @class geomUtils.Plane
 */

var plane =
/*#__PURE__*/
function () {
  /**
   * !#en
   * create a new plane
   * !#zh
   * 创建一个新的 plane。
   * @method create
   * @param nx The x part of the normal component.
   * @param ny The y part of the normal component.
   * @param nz The z part of the normal component.
   * @param d Distance from the origin.
   * @return
   */
  plane.create = function create(nx, ny, nz, d) {
    return new plane(nx, ny, nz, d);
  }
  /**
   * !#en
   * clone a new plane
   * !#zh
   * 克隆一个新的 plane。
   * @method clone
   * @param p The source of cloning.
   * @return The cloned object.
   */
  ;

  plane.clone = function clone(p) {
    return new plane(p.n.x, p.n.y, p.n.z, p.d);
  }
  /**
   * !#en
   * copy the values from one plane to another
   * !#zh
   * 复制一个平面的值到另一个。
   * @method copy
   * @param out The object that accepts the action.
   * @param p The source of the copy.
   * @return The object that accepts the action.
   */
  ;

  plane.copy = function copy(out, p) {
    _valueTypes.Vec3.copy(out.n, p.n);

    out.d = p.d;
    return out;
  }
  /**
   * !#en
   * create a plane from three points
   * !#zh
   * 用三个点创建一个平面。
   * @method fromPoints
   * @param out The object that accepts the action.
   * @param a Point a。
   * @param b Point b。
   * @param c Point c。
   * @return out The object that accepts the action.
   */
  ;

  plane.fromPoints = function fromPoints(out, a, b, c) {
    _valueTypes.Vec3.subtract(v1, b, a);

    _valueTypes.Vec3.subtract(v2, c, a);

    _valueTypes.Vec3.normalize(out.n, _valueTypes.Vec3.cross(out.n, v1, v2));

    out.d = _valueTypes.Vec3.dot(out.n, a);
    return out;
  }
  /**
   * !#en
   * Set the components of a plane to the given values
   * !#zh
   * 将给定平面的属性设置为给定值。
   * @method set
   * @param out The object that accepts the action.
   * @param nx The x part of the normal component.
   * @param ny The y part of the normal component.
   * @param nz The z part of the normal component.
   * @param d Distance from the origin.
   * @return out The object that accepts the action.
   */
  ;

  plane.set = function set(out, nx, ny, nz, d) {
    out.n.x = nx;
    out.n.y = ny;
    out.n.z = nz;
    out.d = d;
    return out;
  }
  /**
   * !#en
   * create plane from normal and point
   * !#zh
   * 用一条法线和一个点创建平面。
   * @method fromNormalAndPoint
   * @param out The object that accepts the action.
   * @param normal The normal of a plane.
   * @param point A point on the plane.
   * @return out The object that accepts the action.
   */
  ;

  plane.fromNormalAndPoint = function fromNormalAndPoint(out, normal, point) {
    _valueTypes.Vec3.copy(out.n, normal);

    out.d = _valueTypes.Vec3.dot(normal, point);
    return out;
  }
  /**
   * !#en
   * normalize a plane
   * !#zh
   * 归一化一个平面。
   * @method normalize
   * @param out The object that accepts the action.
   * @param a Source data for operations.
   * @return out The object that accepts the action.
   */
  ;

  plane.normalize = function normalize(out, a) {
    var len = a.n.len();

    _valueTypes.Vec3.normalize(out.n, a.n);

    if (len > 0) {
      out.d = a.d / len;
    }

    return out;
  }
  /**
   * !#en
   * A normal vector.
   * !#zh
   * 法线向量。
   * @property {Vec3} n
   */
  ;

  /**
   * !#en Construct a plane.
   * !#zh 构造一个平面。
   * @constructor
   * @param nx The x part of the normal component.
   * @param ny The y part of the normal component.
   * @param nz The z part of the normal component.
   * @param d Distance from the origin.
   */
  function plane(nx, ny, nz, d) {
    if (nx === void 0) {
      nx = 0;
    }

    if (ny === void 0) {
      ny = 1;
    }

    if (nz === void 0) {
      nz = 0;
    }

    if (d === void 0) {
      d = 0;
    }

    this.n = void 0;
    this.d = void 0;
    this._type = void 0;
    this._type = _enums["default"].SHAPE_PLANE;
    this.n = new _valueTypes.Vec3(nx, ny, nz);
    this.d = d;
  }
  /**
   * !#en
   * Transform a plane.
   * !#zh
   * 变换一个平面。
   * @method transform
   * @param {Mat4} mat
   */


  var _proto = plane.prototype;

  _proto.transform = function transform(mat) {
    _valueTypes.Mat4.invert(temp_mat, mat);

    _valueTypes.Mat4.transpose(temp_mat, temp_mat);

    _valueTypes.Vec4.set(temp_vec4, this.n.x, this.n.y, this.n.z, this.d);

    _valueTypes.Vec4.transformMat4(temp_vec4, temp_vec4, temp_mat);

    _valueTypes.Vec3.set(this.n, temp_vec4.x, temp_vec4.y, temp_vec4.z);

    this.d = temp_vec4.w;
  };

  return plane;
}();

exports["default"] = plane;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBsYW5lLnRzIl0sIm5hbWVzIjpbInYxIiwiVmVjMyIsInYyIiwidGVtcF9tYXQiLCJjYyIsIm1hdDQiLCJ0ZW1wX3ZlYzQiLCJ2NCIsInBsYW5lIiwiY3JlYXRlIiwibngiLCJueSIsIm56IiwiZCIsImNsb25lIiwicCIsIm4iLCJ4IiwieSIsInoiLCJjb3B5Iiwib3V0IiwiZnJvbVBvaW50cyIsImEiLCJiIiwiYyIsInN1YnRyYWN0Iiwibm9ybWFsaXplIiwiY3Jvc3MiLCJkb3QiLCJzZXQiLCJmcm9tTm9ybWFsQW5kUG9pbnQiLCJub3JtYWwiLCJwb2ludCIsImxlbiIsIl90eXBlIiwiZW51bXMiLCJTSEFQRV9QTEFORSIsInRyYW5zZm9ybSIsIm1hdCIsIk1hdDQiLCJpbnZlcnQiLCJ0cmFuc3Bvc2UiLCJWZWM0IiwidHJhbnNmb3JtTWF0NCIsInciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkE7O0FBQ0E7Ozs7QUExQkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTRCQSxJQUFNQSxFQUFFLEdBQUcsSUFBSUMsZ0JBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQ0FBWDtBQUNBLElBQU1DLEVBQUUsR0FBRyxJQUFJRCxnQkFBSixDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZixDQUFYO0FBQ0EsSUFBTUUsUUFBUSxHQUFHQyxFQUFFLENBQUNDLElBQUgsRUFBakI7QUFDQSxJQUFNQyxTQUFTLEdBQUdGLEVBQUUsQ0FBQ0csRUFBSCxFQUFsQjtBQUVBOzs7Ozs7OztJQU9xQkM7OztBQUVqQjs7Ozs7Ozs7Ozs7O1FBWWNDLFNBQWQsZ0JBQXNCQyxFQUF0QixFQUFrQ0MsRUFBbEMsRUFBOENDLEVBQTlDLEVBQTBEQyxDQUExRCxFQUFxRTtBQUNqRSxXQUFPLElBQUlMLEtBQUosQ0FBVUUsRUFBVixFQUFjQyxFQUFkLEVBQWtCQyxFQUFsQixFQUFzQkMsQ0FBdEIsQ0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7O1FBU2ND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KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTkgWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCB7IE1hdDQsIFZlYzMsIFZlYzQgfSBmcm9tICcuLi92YWx1ZS10eXBlcyc7XG5pbXBvcnQgZW51bXMgZnJvbSAnLi9lbnVtcyc7XG5cbmNvbnN0IHYxID0gbmV3IFZlYzMoMCwgMCwgMCk7XG5jb25zdCB2MiA9IG5ldyBWZWMzKDAsIDAsIDApO1xuY29uc3QgdGVtcF9tYXQgPSBjYy5tYXQ0KCk7XG5jb25zdCB0ZW1wX3ZlYzQgPSBjYy52NCgpO1xuXG4vKipcbiAqICEjZW5cbiAqIHBsYW5l44CCXG4gKiAhI3poXG4gKiDlubPpnaLjgIJcbiAqIEBjbGFzcyBnZW9tVXRpbHMuUGxhbmVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgcGxhbmUge1xuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIGNyZWF0ZSBhIG5ldyBwbGFuZVxuICAgICAqICEjemhcbiAgICAgKiDliJvlu7rkuIDkuKrmlrDnmoQgcGxhbmXjgIJcbiAgICAgKiBAbWV0aG9kIGNyZWF0ZVxuICAgICAqIEBwYXJhbSBueCBUaGUgeCBwYXJ0IG9mIHRoZSBub3JtYWwgY29tcG9uZW50LlxuICAgICAqIEBwYXJhbSBueSBUaGUgeSBwYXJ0IG9mIHRoZSBub3JtYWwgY29tcG9uZW50LlxuICAgICAqIEBwYXJhbSBueiBUaGUgeiBwYXJ0IG9mIHRoZSBub3JtYWwgY29tcG9uZW50LlxuICAgICAqIEBwYXJhbSBkIERpc3RhbmNlIGZyb20gdGhlIG9yaWdpbi5cbiAgICAgKiBAcmV0dXJuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGUgKG54OiBudW1iZXIsIG55OiBudW1iZXIsIG56OiBudW1iZXIsIGQ6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gbmV3IHBsYW5lKG54LCBueSwgbnosIGQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBjbG9uZSBhIG5ldyBwbGFuZVxuICAgICAqICEjemhcbiAgICAgKiDlhYvpmobkuIDkuKrmlrDnmoQgcGxhbmXjgIJcbiAgICAgKiBAbWV0aG9kIGNsb25lXG4gICAgICogQHBhcmFtIHAgVGhlIHNvdXJjZSBvZiBjbG9uaW5nLlxuICAgICAqIEByZXR1cm4gVGhlIGNsb25lZCBvYmplY3QuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBjbG9uZSAocDogcGxhbmUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBwbGFuZShwLm4ueCwgcC5uLnksIHAubi56LCBwLmQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBjb3B5IHRoZSB2YWx1ZXMgZnJvbSBvbmUgcGxhbmUgdG8gYW5vdGhlclxuICAgICAqICEjemhcbiAgICAgKiDlpI3liLbkuIDkuKrlubPpnaLnmoTlgLzliLDlj6bkuIDkuKrjgIJcbiAgICAgKiBAbWV0aG9kIGNvcHlcbiAgICAgKiBAcGFyYW0gb3V0IFRoZSBvYmplY3QgdGhhdCBhY2NlcHRzIHRoZSBhY3Rpb24uXG4gICAgICogQHBhcmFtIHAgVGhlIHNvdXJjZSBvZiB0aGUgY29weS5cbiAgICAgKiBAcmV0dXJuIFRoZSBvYmplY3QgdGhhdCBhY2NlcHRzIHRoZSBhY3Rpb24uXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBjb3B5IChvdXQ6IHBsYW5lLCBwOiBwbGFuZSkge1xuICAgICAgICBWZWMzLmNvcHkob3V0Lm4sIHAubik7XG4gICAgICAgIG91dC5kID0gcC5kO1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIGNyZWF0ZSBhIHBsYW5lIGZyb20gdGhyZWUgcG9pbnRzXG4gICAgICogISN6aFxuICAgICAqIOeUqOS4ieS4queCueWIm+W7uuS4gOS4quW5s+mdouOAglxuICAgICAqIEBtZXRob2QgZnJvbVBvaW50c1xuICAgICAqIEBwYXJhbSBvdXQgVGhlIG9iamVjdCB0aGF0IGFjY2VwdHMgdGhlIGFjdGlvbi5cbiAgICAgKiBAcGFyYW0gYSBQb2ludCBh44CCXG4gICAgICogQHBhcmFtIGIgUG9pbnQgYuOAglxuICAgICAqIEBwYXJhbSBjIFBvaW50IGPjgIJcbiAgICAgKiBAcmV0dXJuIG91dCBUaGUgb2JqZWN0IHRoYXQgYWNjZXB0cyB0aGUgYWN0aW9uLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZnJvbVBvaW50cyAob3V0OiBwbGFuZSwgYTogVmVjMywgYjogVmVjMywgYzogVmVjMykge1xuICAgICAgICBWZWMzLnN1YnRyYWN0KHYxLCBiLCBhKTtcbiAgICAgICAgVmVjMy5zdWJ0cmFjdCh2MiwgYywgYSk7XG5cbiAgICAgICAgVmVjMy5ub3JtYWxpemUob3V0Lm4sIFZlYzMuY3Jvc3Mob3V0Lm4sIHYxLCB2MikpO1xuICAgICAgICBvdXQuZCA9IFZlYzMuZG90KG91dC5uLCBhKTtcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBTZXQgdGhlIGNvbXBvbmVudHMgb2YgYSBwbGFuZSB0byB0aGUgZ2l2ZW4gdmFsdWVzXG4gICAgICogISN6aFxuICAgICAqIOWwhue7meWumuW5s+mdoueahOWxnuaAp+iuvue9ruS4uue7meWumuWAvOOAglxuICAgICAqIEBtZXRob2Qgc2V0XG4gICAgICogQHBhcmFtIG91dCBUaGUgb2JqZWN0IHRoYXQgYWNjZXB0cyB0aGUgYWN0aW9uLlxuICAgICAqIEBwYXJhbSBueCBUaGUgeCBwYXJ0IG9mIHRoZSBub3JtYWwgY29tcG9uZW50LlxuICAgICAqIEBwYXJhbSBueSBUaGUgeSBwYXJ0IG9mIHRoZSBub3JtYWwgY29tcG9uZW50LlxuICAgICAqIEBwYXJhbSBueiBUaGUgeiBwYXJ0IG9mIHRoZSBub3JtYWwgY29tcG9uZW50LlxuICAgICAqIEBwYXJhbSBkIERpc3RhbmNlIGZyb20gdGhlIG9yaWdpbi5cbiAgICAgKiBAcmV0dXJuIG91dCBUaGUgb2JqZWN0IHRoYXQgYWNjZXB0cyB0aGUgYWN0aW9uLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgc2V0IChvdXQ6IHBsYW5lLCBueDogbnVtYmVyLCBueTogbnVtYmVyLCBuejogbnVtYmVyLCBkOiBudW1iZXIpIHtcbiAgICAgICAgb3V0Lm4ueCA9IG54O1xuICAgICAgICBvdXQubi55ID0gbnk7XG4gICAgICAgIG91dC5uLnogPSBuejtcbiAgICAgICAgb3V0LmQgPSBkO1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIGNyZWF0ZSBwbGFuZSBmcm9tIG5vcm1hbCBhbmQgcG9pbnRcbiAgICAgKiAhI3poXG4gICAgICog55So5LiA5p2h5rOV57q/5ZKM5LiA5Liq54K55Yib5bu65bmz6Z2i44CCXG4gICAgICogQG1ldGhvZCBmcm9tTm9ybWFsQW5kUG9pbnRcbiAgICAgKiBAcGFyYW0gb3V0IFRoZSBvYmplY3QgdGhhdCBhY2NlcHRzIHRoZSBhY3Rpb24uXG4gICAgICogQHBhcmFtIG5vcm1hbCBUaGUgbm9ybWFsIG9mIGEgcGxhbmUuXG4gICAgICogQHBhcmFtIHBvaW50IEEgcG9pbnQgb24gdGhlIHBsYW5lLlxuICAgICAqIEByZXR1cm4gb3V0IFRoZSBvYmplY3QgdGhhdCBhY2NlcHRzIHRoZSBhY3Rpb24uXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBmcm9tTm9ybWFsQW5kUG9pbnQgKG91dDogcGxhbmUsIG5vcm1hbDogVmVjMywgcG9pbnQ6IFZlYzMpIHtcbiAgICAgICAgVmVjMy5jb3B5KG91dC5uLCBub3JtYWwpO1xuICAgICAgICBvdXQuZCA9IFZlYzMuZG90KG5vcm1hbCwgcG9pbnQpO1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIG5vcm1hbGl6ZSBhIHBsYW5lXG4gICAgICogISN6aFxuICAgICAqIOW9kuS4gOWMluS4gOS4quW5s+mdouOAglxuICAgICAqIEBtZXRob2Qgbm9ybWFsaXplXG4gICAgICogQHBhcmFtIG91dCBUaGUgb2JqZWN0IHRoYXQgYWNjZXB0cyB0aGUgYWN0aW9uLlxuICAgICAqIEBwYXJhbSBhIFNvdXJjZSBkYXRhIGZvciBvcGVyYXRpb25zLlxuICAgICAqIEByZXR1cm4gb3V0IFRoZSBvYmplY3QgdGhhdCBhY2NlcHRzIHRoZSBhY3Rpb24uXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBub3JtYWxpemUgKG91dDogcGxhbmUsIGE6IHBsYW5lKSB7XG4gICAgICAgIGNvbnN0IGxlbiA9IGEubi5sZW4oKTtcbiAgICAgICAgVmVjMy5ub3JtYWxpemUob3V0Lm4sIGEubik7XG4gICAgICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgICAgICBvdXQuZCA9IGEuZCAvIGxlbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBBIG5vcm1hbCB2ZWN0b3IuXG4gICAgICogISN6aFxuICAgICAqIOazlee6v+WQkemHj+OAglxuICAgICAqIEBwcm9wZXJ0eSB7VmVjM30gblxuICAgICAqL1xuICAgIHB1YmxpYyBuOiBWZWMzO1xuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFRoZSBkaXN0YW5jZSBmcm9tIHRoZSBvcmlnaW4gdG8gdGhlIHBsYW5lLlxuICAgICAqICEjemhcbiAgICAgKiDljp/ngrnliLDlubPpnaLnmoTot53nprvjgIJcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gZFxuICAgICAqL1xuICAgIHB1YmxpYyBkOiBudW1iZXI7XG5cbiAgICBwcml2YXRlIF90eXBlOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENvbnN0cnVjdCBhIHBsYW5lLlxuICAgICAqICEjemgg5p6E6YCg5LiA5Liq5bmz6Z2i44CCXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIG54IFRoZSB4IHBhcnQgb2YgdGhlIG5vcm1hbCBjb21wb25lbnQuXG4gICAgICogQHBhcmFtIG55IFRoZSB5IHBhcnQgb2YgdGhlIG5vcm1hbCBjb21wb25lbnQuXG4gICAgICogQHBhcmFtIG56IFRoZSB6IHBhcnQgb2YgdGhlIG5vcm1hbCBjb21wb25lbnQuXG4gICAgICogQHBhcmFtIGQgRGlzdGFuY2UgZnJvbSB0aGUgb3JpZ2luLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yIChueCA9IDAsIG55ID0gMSwgbnogPSAwLCBkID0gMCkge1xuICAgICAgICB0aGlzLl90eXBlID0gZW51bXMuU0hBUEVfUExBTkU7XG4gICAgICAgIHRoaXMubiA9IG5ldyBWZWMzKG54LCBueSwgbnopO1xuICAgICAgICB0aGlzLmQgPSBkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBUcmFuc2Zvcm0gYSBwbGFuZS5cbiAgICAgKiAhI3poXG4gICAgICog5Y+Y5o2i5LiA5Liq5bmz6Z2i44CCXG4gICAgICogQG1ldGhvZCB0cmFuc2Zvcm1cbiAgICAgKiBAcGFyYW0ge01hdDR9IG1hdFxuICAgICAqL1xuICAgIHB1YmxpYyB0cmFuc2Zvcm0gKG1hdDogTWF0NCk6IHZvaWQge1xuICAgICAgICBNYXQ0LmludmVydCh0ZW1wX21hdCwgbWF0KTtcbiAgICAgICAgTWF0NC50cmFuc3Bvc2UodGVtcF9tYXQsIHRlbXBfbWF0KTtcbiAgICAgICAgVmVjNC5zZXQodGVtcF92ZWM0LCB0aGlzLm4ueCwgdGhpcy5uLnksIHRoaXMubi56LCB0aGlzLmQpO1xuICAgICAgICBWZWM0LnRyYW5zZm9ybU1hdDQodGVtcF92ZWM0LCB0ZW1wX3ZlYzQsIHRlbXBfbWF0KTtcbiAgICAgICAgVmVjMy5zZXQodGhpcy5uLCB0ZW1wX3ZlYzQueCwgdGVtcF92ZWM0LnksIHRlbXBfdmVjNC56KTtcbiAgICAgICAgdGhpcy5kID0gdGVtcF92ZWM0Lnc7XG4gICAgfVxufVxuIl19