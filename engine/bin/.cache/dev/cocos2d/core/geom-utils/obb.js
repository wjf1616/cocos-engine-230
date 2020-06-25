
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/geom-utils/obb.js';
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

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _v3_tmp = new _valueTypes.Vec3();

var _v3_tmp2 = new _valueTypes.Vec3();

var _m3_tmp = new _valueTypes.Mat3(); // https://zeuxcg.org/2010/10/17/aabb-from-obb-with-component-wise-abs/


var transform_extent_m3 = function transform_extent_m3(out, extent, m3) {
  var m3_tmpm = _m3_tmp.m,
      m3m = m3.m;
  m3_tmpm[0] = Math.abs(m3m[0]);
  m3_tmpm[1] = Math.abs(m3m[1]);
  m3_tmpm[2] = Math.abs(m3m[2]);
  m3_tmpm[3] = Math.abs(m3m[3]);
  m3_tmpm[4] = Math.abs(m3m[4]);
  m3_tmpm[5] = Math.abs(m3m[5]);
  m3_tmpm[6] = Math.abs(m3m[6]);
  m3_tmpm[7] = Math.abs(m3m[7]);
  m3_tmpm[8] = Math.abs(m3m[8]);

  _valueTypes.Vec3.transformMat3(out, extent, _m3_tmp);
};
/**
 * !#en obb
 * !#zh
 * 基础几何  方向包围盒。
 * @class geomUtils.Obb
 */


var obb =
/*#__PURE__*/
function () {
  /**
   * !#en
   * create a new obb
   * !#zh
   * 创建一个新的 obb 实例。
   * @method create
   * @param cx X coordinates of the shape relative to the origin.
   * @param cy Y coordinates of the shape relative to the origin.
   * @param cz Z coordinates of the shape relative to the origin.
   * @param hw Obb is half the width.
   * @param hh Obb is half the height.
   * @param hl Obb is half the Length.
   * @param ox_1 Direction matrix parameter.
   * @param ox_2 Direction matrix parameter.
   * @param ox_3 Direction matrix parameter.
   * @param oy_1 Direction matrix parameter.
   * @param oy_2 Direction matrix parameter.
   * @param oy_3 Direction matrix parameter.
   * @param oz_1 Direction matrix parameter.
   * @param oz_2 Direction matrix parameter.
   * @param oz_3 Direction matrix parameter.
   * @return Direction Box.
   */
  obb.create = function create(cx, cy, cz, hw, hh, hl, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3) {
    return new obb(cx, cy, cz, hw, hh, hl, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3);
  }
  /**
   * !#en
   * clone a new obb
   * !#zh
   * 克隆一个 obb。
   * @method clone
   * @param a The target of cloning.
   * @returns New object cloned.
   */
  ;

  obb.clone = function clone(a) {
    var aom = a.orientation.m;
    return new obb(a.center.x, a.center.y, a.center.z, a.halfExtents.x, a.halfExtents.y, a.halfExtents.z, aom[0], aom[1], aom[2], aom[3], aom[4], aom[5], aom[6], aom[7], aom[8]);
  }
  /**
   * !#en
   * copy the values from one obb to another
   * !#zh
   * 将从一个 obb 的值复制到另一个 obb。
   * @method copy
   * @param {Obb} out Obb that accepts the operation.
   * @param {Obb} a Obb being copied.
   * @return {Obb} out Obb that accepts the operation.
   */
  ;

  obb.copy = function copy(out, a) {
    _valueTypes.Vec3.copy(out.center, a.center);

    _valueTypes.Vec3.copy(out.halfExtents, a.halfExtents);

    _valueTypes.Mat3.copy(out.orientation, a.orientation);

    return out;
  }
  /**
   * !#en
   * create a new obb from two corner points
   * !#zh
   * 用两个点创建一个新的 obb。
   * @method fromPoints
   * @param out Obb that accepts the operation.
   * @param minPos The smallest point of obb.
   * @param maxPos Obb's maximum point.
   * @returns {Obb} out Obb that accepts the operation.
   */
  ;

  obb.fromPoints = function fromPoints(out, minPos, maxPos) {
    _valueTypes.Vec3.multiplyScalar(out.center, _valueTypes.Vec3.add(_v3_tmp, minPos, maxPos), 0.5);

    _valueTypes.Vec3.multiplyScalar(out.halfExtents, _valueTypes.Vec3.subtract(_v3_tmp2, maxPos, minPos), 0.5);

    _valueTypes.Mat3.identity(out.orientation);

    return out;
  }
  /**
   * !#en
   * Set the components of a obb to the given values
   * !#zh
   * 将给定 obb 的属性设置为给定的值。
   * @method set
   * @param cx X coordinates of the shape relative to the origin.
   * @param cy Y coordinates of the shape relative to the origin.
   * @param cz Z coordinates of the shape relative to the origin.
   * @param hw Obb is half the width.
   * @param hh Obb is half the height.
   * @param hl Obb is half the Length.
   * @param ox_1 Direction matrix parameter.
   * @param ox_2 Direction matrix parameter.
   * @param ox_3 Direction matrix parameter.
   * @param oy_1 Direction matrix parameter.
   * @param oy_2 Direction matrix parameter.
   * @param oy_3 Direction matrix parameter.
   * @param oz_1 Direction matrix parameter.
   * @param oz_2 Direction matrix parameter.
   * @param oz_3 Direction matrix parameter.
   * @return {Obb} out
   */
  ;

  obb.set = function set(out, cx, cy, cz, hw, hh, hl, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3) {
    _valueTypes.Vec3.set(out.center, cx, cy, cz);

    _valueTypes.Vec3.set(out.halfExtents, hw, hh, hl);

    _valueTypes.Mat3.set(out.orientation, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3);

    return out;
  }
  /**
   * !#en
   * The center of the local coordinate.
   * !#zh
   * 本地坐标的中心点。
   * @property {Vec3} center
   */
  ;

  _createClass(obb, [{
    key: "type",

    /**
     * !#zh
     * 获取形状的类型。
     * @property {number} type
     * @readonly
     */
    get: function get() {
      return this._type;
    }
  }]);

  function obb(cx, cy, cz, hw, hh, hl, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3) {
    if (cx === void 0) {
      cx = 0;
    }

    if (cy === void 0) {
      cy = 0;
    }

    if (cz === void 0) {
      cz = 0;
    }

    if (hw === void 0) {
      hw = 1;
    }

    if (hh === void 0) {
      hh = 1;
    }

    if (hl === void 0) {
      hl = 1;
    }

    if (ox_1 === void 0) {
      ox_1 = 1;
    }

    if (ox_2 === void 0) {
      ox_2 = 0;
    }

    if (ox_3 === void 0) {
      ox_3 = 0;
    }

    if (oy_1 === void 0) {
      oy_1 = 0;
    }

    if (oy_2 === void 0) {
      oy_2 = 1;
    }

    if (oy_3 === void 0) {
      oy_3 = 0;
    }

    if (oz_1 === void 0) {
      oz_1 = 0;
    }

    if (oz_2 === void 0) {
      oz_2 = 0;
    }

    if (oz_3 === void 0) {
      oz_3 = 1;
    }

    this.center = void 0;
    this.halfExtents = void 0;
    this.orientation = void 0;
    this._type = void 0;
    this._type = _enums["default"].SHAPE_OBB;
    this.center = new _valueTypes.Vec3(cx, cy, cz);
    this.halfExtents = new _valueTypes.Vec3(hw, hh, hl);
    this.orientation = new _valueTypes.Mat3(ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3);
  }
  /**
   * !#en
   * Get the bounding points of this shape
   * !#zh
   * 获取 obb 的最小点和最大点。
   * @method getBoundary
   * @param {Vec3} minPos
   * @param {Vec3} maxPos
   */


  var _proto = obb.prototype;

  _proto.getBoundary = function getBoundary(minPos, maxPos) {
    transform_extent_m3(_v3_tmp, this.halfExtents, this.orientation);

    _valueTypes.Vec3.subtract(minPos, this.center, _v3_tmp);

    _valueTypes.Vec3.add(maxPos, this.center, _v3_tmp);
  }
  /**
   * !#en Transform this shape
   * !#zh
   * 将 out 根据这个 obb 的数据进行变换。
   * @method transform
   * @param m The transformation matrix.
   * @param pos The position part of the transformation.
   * @param rot The rotating part of the transformation.
   * @param scale The scaling part of the transformation.
   * @param out Target of transformation.
   */
  ;

  _proto.transform = function transform(m, pos, rot, scale, out) {
    _valueTypes.Vec3.transformMat4(out.center, this.center, m); // parent shape doesn't contain rotations for now


    _valueTypes.Mat3.fromQuat(out.orientation, rot);

    _valueTypes.Vec3.multiply(out.halfExtents, this.halfExtents, scale);
  }
  /**
   * !#en
   * Transform out based on this obb data.
   * !#zh
   * 将 out 根据这个 obb 的数据进行变换。
   * @method translateAndRotate
   * @param m The transformation matrix.
   * @param rot The rotating part of the transformation.
   * @param out Target of transformation.
   */
  ;

  _proto.translateAndRotate = function translateAndRotate(m, rot, out) {
    _valueTypes.Vec3.transformMat4(out.center, this.center, m); // parent shape doesn't contain rotations for now


    _valueTypes.Mat3.fromQuat(out.orientation, rot);
  }
  /**
   * !#en
   * Scale out based on this obb data.
   * !#zh
   * 将 out 根据这个 obb 的数据进行缩放。
   * @method setScale
   * @param scale Scale value.
   * @param out Scaled target.
   */
  ;

  _proto.setScale = function setScale(scale, out) {
    _valueTypes.Vec3.multiply(out.halfExtents, this.halfExtents, scale);
  };

  return obb;
}();

exports["default"] = obb;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9iYi50cyJdLCJuYW1lcyI6WyJfdjNfdG1wIiwiVmVjMyIsIl92M190bXAyIiwiX20zX3RtcCIsIk1hdDMiLCJ0cmFuc2Zvcm1fZXh0ZW50X20zIiwib3V0IiwiZXh0ZW50IiwibTMiLCJtM190bXBtIiwibSIsIm0zbSIsIk1hdGgiLCJhYnMiLCJ0cmFuc2Zvcm1NYXQzIiwib2JiIiwiY3JlYXRlIiwiY3giLCJjeSIsImN6IiwiaHciLCJoaCIsImhsIiwib3hfMSIsIm94XzIiLCJveF8zIiwib3lfMSIsIm95XzIiLCJveV8zIiwib3pfMSIsIm96XzIiLCJvel8zIiwiY2xvbmUiLCJhIiwiYW9tIiwib3JpZW50YXRpb24iLCJjZW50ZXIiLCJ4IiwieSIsInoiLCJoYWxmRXh0ZW50cyIsImNvcHkiLCJmcm9tUG9pbnRzIiwibWluUG9zIiwibWF4UG9zIiwibXVsdGlwbHlTY2FsYXIiLCJhZGQiLCJzdWJ0cmFjdCIsImlkZW50aXR5Iiwic2V0IiwiX3R5cGUiLCJlbnVtcyIsIlNIQVBFX09CQiIsImdldEJvdW5kYXJ5IiwidHJhbnNmb3JtIiwicG9zIiwicm90Iiwic2NhbGUiLCJ0cmFuc2Zvcm1NYXQ0IiwiZnJvbVF1YXQiLCJtdWx0aXBseSIsInRyYW5zbGF0ZUFuZFJvdGF0ZSIsInNldFNjYWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBOztBQUNBOzs7Ozs7OztBQUVBLElBQU1BLE9BQU8sR0FBRyxJQUFJQyxnQkFBSixFQUFoQjs7QUFDQSxJQUFNQyxRQUFRLEdBQUcsSUFBSUQsZ0JBQUosRUFBakI7O0FBQ0EsSUFBTUUsT0FBTyxHQUFHLElBQUlDLGdCQUFKLEVBQWhCLEVBRUE7OztBQUNBLElBQU1DLG1CQUFtQixHQUFHLFNBQXRCQSxtQkFBc0IsQ0FBQ0MsR0FBRCxFQUFZQyxNQUFaLEVBQTBCQyxFQUExQixFQUF1QztBQUMvRCxNQUFJQyxPQUFPLEdBQUdOLE9BQU8sQ0FBQ08sQ0FBdEI7QUFBQSxNQUF5QkMsR0FBRyxHQUFH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QUErQixLQUFLQSxNQUFwQyxFQUE0QzFCLENBQTVDLEVBRG9ELENBRXBEOzs7QUFDQU4scUJBQUt1RCxRQUFMLENBQWNyRCxHQUFHLENBQUM2QixXQUFsQixFQUErQnFCLEdBQS9CO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7U0FTT00sV0FBUCxrQkFBaUJMLEtBQWpCLEVBQThCbkQsR0FBOUIsRUFBd0M7QUFDcENMLHFCQUFLMkQsUUFBTCxDQUFjdEQsR0FBRyxDQUFDa0MsV0FBbEIsRUFBK0IsS0FBS0EsV0FBcEMsRUFBaURpQixLQUFqRDtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTkgWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCB7IE1hdDMsIE1hdDQsIFF1YXQsIFZlYzMgfSBmcm9tICcuLi92YWx1ZS10eXBlcyc7XG5pbXBvcnQgZW51bXMgZnJvbSAnLi9lbnVtcyc7XG5cbmNvbnN0IF92M190bXAgPSBuZXcgVmVjMygpO1xuY29uc3QgX3YzX3RtcDIgPSBuZXcgVmVjMygpO1xuY29uc3QgX20zX3RtcCA9IG5ldyBNYXQzKCk7XG5cbi8vIGh0dHBzOi8vemV1eGNnLm9yZy8yMDEwLzEwLzE3L2FhYmItZnJvbS1vYmItd2l0aC1jb21wb25lbnQtd2lzZS1hYnMvXG5jb25zdCB0cmFuc2Zvcm1fZXh0ZW50X20zID0gKG91dDogVmVjMywgZXh0ZW50OiBWZWMzLCBtMzogTWF0MykgPT4ge1xuICAgIGxldCBtM190bXBtID0gX20zX3RtcC5tLCBtM20gPSBtMy5tO1xuICAgIG0zX3RtcG1bMF0gPSBNYXRoLmFicyhtM21bMF0pOyBtM190bXBtWzFdID0gTWF0aC5hYnMobTNtWzFdKTsgbTNfdG1wbVsyXSA9IE1hdGguYWJzKG0zbVsyXSk7XG4gICAgbTNfdG1wbVszXSA9IE1hdGguYWJzKG0zbVszXSk7IG0zX3RtcG1bNF0gPSBNYXRoLmFicyhtM21bNF0pOyBtM190bXBtWzVdID0gTWF0aC5hYnMobTNtWzVdKTtcbiAgICBtM190bXBtWzZdID0gTWF0aC5hYnMobTNtWzZdKTsgbTNfdG1wbVs3XSA9IE1hdGguYWJzKG0zbVs3XSk7IG0zX3RtcG1bOF0gPSBNYXRoLmFicyhtM21bOF0pO1xuICAgIFZlYzMudHJhbnNmb3JtTWF0MyhvdXQsIGV4dGVudCwgX20zX3RtcCk7XG59O1xuXG4vKipcbiAqICEjZW4gb2JiXG4gKiAhI3poXG4gKiDln7rnoYDlh6DkvZUgIOaWueWQkeWMheWbtOebkuOAglxuICogQGNsYXNzIGdlb21VdGlscy5PYmJcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3Mgb2JiIHtcblxuICAgIC8qKlxuICAgICAqICEjemhcbiAgICAgKiDojrflj5blvaLnirbnmoTnsbvlnovjgIJcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gdHlwZVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGdldCB0eXBlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3R5cGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIGNyZWF0ZSBhIG5ldyBvYmJcbiAgICAgKiAhI3poXG4gICAgICog5Yib5bu65LiA5Liq5paw55qEIG9iYiDlrp7kvovjgIJcbiAgICAgKiBAbWV0aG9kIGNyZWF0ZVxuICAgICAqIEBwYXJhbSBjeCBYIGNvb3JkaW5hdGVzIG9mIHRoZSBzaGFwZSByZWxhdGl2ZSB0byB0aGUgb3JpZ2luLlxuICAgICAqIEBwYXJhbSBjeSBZIGNvb3JkaW5hdGVzIG9mIHRoZSBzaGFwZSByZWxhdGl2ZSB0byB0aGUgb3JpZ2luLlxuICAgICAqIEBwYXJhbSBjeiBaIGNvb3JkaW5hdGVzIG9mIHRoZSBzaGFwZSByZWxhdGl2ZSB0byB0aGUgb3JpZ2luLlxuICAgICAqIEBwYXJhbSBodyBPYmIgaXMgaGFsZiB0aGUgd2lkdGguXG4gICAgICogQHBhcmFtIGhoIE9iYiBpcyBoYWxmIHRoZSBoZWlnaHQuXG4gICAgICogQHBhcmFtIGhsIE9iYiBpcyBoYWxmIHRoZSBMZW5ndGguXG4gICAgICogQHBhcmFtIG94XzEgRGlyZWN0aW9uIG1hdHJpeCBwYXJhbWV0ZXIuXG4gICAgICogQHBhcmFtIG94XzIgRGlyZWN0aW9uIG1hdHJpeCBwYXJhbWV0ZXIuXG4gICAgICogQHBhcmFtIG94XzMgRGlyZWN0aW9uIG1hdHJpeCBwYXJhbWV0ZXIuXG4gICAgICogQHBhcmFtIG95XzEgRGlyZWN0aW9uIG1hdHJpeCBwYXJhbWV0ZXIuXG4gICAgICogQHBhcmFtIG95XzIgRGlyZWN0aW9uIG1hdHJpeCBwYXJhbWV0ZXIuXG4gICAgICogQHBhcmFtIG95XzMgRGlyZWN0aW9uIG1hdHJpeCBwYXJhbWV0ZXIuXG4gICAgICogQHBhcmFtIG96XzEgRGlyZWN0aW9uIG1hdHJpeCBwYXJhbWV0ZXIuXG4gICAgICogQHBhcmFtIG96XzIgRGlyZWN0aW9uIG1hdHJpeCBwYXJhbWV0ZXIuXG4gICAgICogQHBhcmFtIG96XzMgRGlyZWN0aW9uIG1hdHJpeCBwYXJhbWV0ZXIuXG4gICAgICogQHJldHVybiBEaXJlY3Rpb24gQm94LlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlIChcbiAgICAgICAgY3g6IG51bWJlciwgY3k6IG51bWJlciwgY3o6IG51bWJlcixcbiAgICAgICAgaHc6IG51bWJlciwgaGg6IG51bWJlciwgaGw6IG51bWJlcixcbiAgICAgICAgb3hfMTogbnVtYmVyLCBveF8yOiBudW1iZXIsIG94XzM6IG51bWJlcixcbiAgICAgICAgb3lfMTogbnVtYmVyLCBveV8yOiBudW1iZXIsIG95XzM6IG51bWJlcixcbiAgICAgICAgb3pfMTogbnVtYmVyLCBvel8yOiBudW1iZXIsIG96XzM6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gbmV3IG9iYihjeCwgY3ksIGN6LCBodywgaGgsIGhsLCBveF8xLCBveF8yLCBveF8zLCBveV8xLCBveV8yLCBveV8zLCBvel8xLCBvel8yLCBvel8zKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogY2xvbmUgYSBuZXcgb2JiXG4gICAgICogISN6aFxuICAgICAqIOWFi+mahuS4gOS4qiBvYmLjgIJcbiAgICAgKiBAbWV0aG9kIGNsb25lXG4gICAgICogQHBhcmFtIGEgVGhlIHRhcmdldCBvZiBjbG9uaW5nLlxuICAgICAqIEByZXR1cm5zIE5ldyBvYmplY3QgY2xvbmVkLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgY2xvbmUgKGE6IG9iYikge1xuICAgICAgICBsZXQgYW9tID0gYS5vcmllbnRhdGlvbi5tO1xuICAgICAgICByZXR1cm4gbmV3IG9iYihhLmNlbnRlci54LCBhLmNlbnRlci55LCBhLmNlbnRlci56LFxuICAgICAgICAgICAgYS5oYWxmRXh0ZW50cy54LCBhLmhhbGZFeHRlbnRzLnksIGEuaGFsZkV4dGVudHMueixcbiAgICAgICAgICAgIGFvbVswXSwgYW9tWzFdLCBhb21bMl0sXG4gICAgICAgICAgICBhb21bM10sIGFvbVs0XSwgYW9tWzVdLFxuICAgICAgICAgICAgYW9tWzZdLCBhb21bN10sIGFvbVs4XSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIGNvcHkgdGhlIHZhbHVlcyBmcm9tIG9uZSBvYmIgdG8gYW5vdGhlclxuICAgICAqICEjemhcbiAgICAgKiDlsIbku47kuIDkuKogb2JiIOeahOWAvOWkjeWItuWIsOWPpuS4gOS4qiBvYmLjgIJcbiAgICAgKiBAbWV0aG9kIGNvcHlcbiAgICAgKiBAcGFyYW0ge09iYn0gb3V0IE9iYiB0aGF0IGFjY2VwdHMgdGhlIG9wZXJhdGlvbi5cbiAgICAgKiBAcGFyYW0ge09iYn0gYSBPYmIgYmVpbmcgY29waWVkLlxuICAgICAqIEByZXR1cm4ge09iYn0gb3V0IE9iYiB0aGF0IGFjY2VwdHMgdGhlIG9wZXJhdGlvbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGNvcHkgKG91dDogb2JiLCBhOiBvYmIpOiBvYmIge1xuICAgICAgICBWZWMzLmNvcHkob3V0LmNlbnRlciwgYS5jZW50ZXIpO1xuICAgICAgICBWZWMzLmNvcHkob3V0LmhhbGZFeHRlbnRzLCBhLmhhbGZFeHRlbnRzKTtcbiAgICAgICAgTWF0My5jb3B5KG91dC5vcmllbnRhdGlvbiwgYS5vcmllbnRhdGlvbik7XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogY3JlYXRlIGEgbmV3IG9iYiBmcm9tIHR3byBjb3JuZXIgcG9pbnRzXG4gICAgICogISN6aFxuICAgICAqIOeUqOS4pOS4queCueWIm+W7uuS4gOS4quaWsOeahCBvYmLjgIJcbiAgICAgKiBAbWV0aG9kIGZyb21Qb2ludHNcbiAgICAgKiBAcGFyYW0gb3V0IE9iYiB0aGF0IGFjY2VwdHMgdGhlIG9wZXJhdGlvbi5cbiAgICAgKiBAcGFyYW0gbWluUG9zIFRoZSBzbWFsbGVzdCBwb2ludCBvZiBvYmIuXG4gICAgICogQHBhcmFtIG1heFBvcyBPYmIncyBtYXhpbXVtIHBvaW50LlxuICAgICAqIEByZXR1cm5zIHtPYmJ9IG91dCBPYmIgdGhhdCBhY2NlcHRzIHRoZSBvcGVyYXRpb24uXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBmcm9tUG9pbnRzIChvdXQ6IG9iYiwgbWluUG9zOiBWZWMzLCBtYXhQb3M6IFZlYzMpOiBvYmIge1xuICAgICAgICBWZWMzLm11bHRpcGx5U2NhbGFyKG91dC5jZW50ZXIsIFZlYzMuYWRkKF92M190bXAsIG1pblBvcywgbWF4UG9zKSwgMC41KTtcbiAgICAgICAgVmVjMy5tdWx0aXBseVNjYWxhcihvdXQuaGFsZkV4dGVudHMsIFZlYzMuc3VidHJhY3QoX3YzX3RtcDIsIG1heFBvcywgbWluUG9zKSwgMC41KTtcbiAgICAgICAgTWF0My5pZGVudGl0eShvdXQub3JpZW50YXRpb24pO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBTZXQgdGhlIGNvbXBvbmVudHMgb2YgYSBvYmIgdG8gdGhlIGdpdmVuIHZhbHVlc1xuICAgICAqICEjemhcbiAgICAgKiDlsIbnu5nlrpogb2JiIOeahOWxnuaAp+iuvue9ruS4uue7meWumueahOWAvOOAglxuICAgICAqIEBtZXRob2Qgc2V0XG4gICAgICogQHBhcmFtIGN4IFggY29vcmRpbmF0ZXMgb2YgdGhlIHNoYXBlIHJlbGF0aXZlIHRvIHRoZSBvcmlnaW4uXG4gICAgICogQHBhcmFtIGN5IFkgY29vcmRpbmF0ZXMgb2YgdGhlIHNoYXBlIHJlbGF0aXZlIHRvIHRoZSBvcmlnaW4uXG4gICAgICogQHBhcmFtIGN6IFogY29vcmRpbmF0ZXMgb2YgdGhlIHNoYXBlIHJlbGF0aXZlIHRvIHRoZSBvcmlnaW4uXG4gICAgICogQHBhcmFtIGh3IE9iYiBpcyBoYWxmIHRoZSB3aWR0aC5cbiAgICAgKiBAcGFyYW0gaGggT2JiIGlzIGhhbGYgdGhlIGhlaWdodC5cbiAgICAgKiBAcGFyYW0gaGwgT2JiIGlzIGhhbGYgdGhlIExlbmd0aC5cbiAgICAgKiBAcGFyYW0gb3hfMSBEaXJlY3Rpb24gbWF0cml4IHBhcmFtZXRlci5cbiAgICAgKiBAcGFyYW0gb3hfMiBEaXJlY3Rpb24gbWF0cml4IHBhcmFtZXRlci5cbiAgICAgKiBAcGFyYW0gb3hfMyBEaXJlY3Rpb24gbWF0cml4IHBhcmFtZXRlci5cbiAgICAgKiBAcGFyYW0gb3lfMSBEaXJlY3Rpb24gbWF0cml4IHBhcmFtZXRlci5cbiAgICAgKiBAcGFyYW0gb3lfMiBEaXJlY3Rpb24gbWF0cml4IHBhcmFtZXRlci5cbiAgICAgKiBAcGFyYW0gb3lfMyBEaXJlY3Rpb24gbWF0cml4IHBhcmFtZXRlci5cbiAgICAgKiBAcGFyYW0gb3pfMSBEaXJlY3Rpb24gbWF0cml4IHBhcmFtZXRlci5cbiAgICAgKiBAcGFyYW0gb3pfMiBEaXJlY3Rpb24gbWF0cml4IHBhcmFtZXRlci5cbiAgICAgKiBAcGFyYW0gb3pfMyBEaXJlY3Rpb24gbWF0cml4IHBhcmFtZXRlci5cbiAgICAgKiBAcmV0dXJuIHtPYmJ9IG91dFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgc2V0IChcbiAgICAgICAgb3V0OiBvYmIsXG4gICAgICAgIGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIGN6OiBudW1iZXIsXG4gICAgICAgIGh3OiBudW1iZXIsIGhoOiBudW1iZXIsIGhsOiBudW1iZXIsXG4gICAgICAgIG94XzE6IG51bWJlciwgb3hfMjogbnVtYmVyLCBveF8zOiBudW1iZXIsXG4gICAgICAgIG95XzE6IG51bWJlciwgb3lfMjogbnVtYmVyLCBveV8zOiBudW1iZXIsXG4gICAgICAgIG96XzE6IG51bWJlciwgb3pfMjogbnVtYmVyLCBvel8zOiBudW1iZXIpOiBvYmIge1xuICAgICAgICBWZWMzLnNldChvdXQuY2VudGVyLCBjeCwgY3ksIGN6KTtcbiAgICAgICAgVmVjMy5zZXQob3V0LmhhbGZFeHRlbnRzLCBodywgaGgsIGhsKTtcbiAgICAgICAgTWF0My5zZXQob3V0Lm9yaWVudGF0aW9uLCBveF8xLCBveF8yLCBveF8zLCBveV8xLCBveV8yLCBveV8zLCBvel8xLCBvel8yLCBvel8zKTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogVGhlIGNlbnRlciBvZiB0aGUgbG9jYWwgY29vcmRpbmF0ZS5cbiAgICAgKiAhI3poXG4gICAgICog5pys5Zyw5Z2Q5qCH55qE5Lit5b+D54K544CCXG4gICAgICogQHByb3BlcnR5IHtWZWMzfSBjZW50ZXJcbiAgICAgKi9cbiAgICBwdWJsaWMgY2VudGVyOiBWZWMzO1xuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEhhbGYgdGhlIGxlbmd0aCwgd2lkdGgsIGFuZCBoZWlnaHQuXG4gICAgICogISN6aFxuICAgICAqIOmVv+WuvemrmOeahOS4gOWNiuOAglxuICAgICAqIEBwcm9wZXJ0eSB7VmVjM30gaGFsZkV4dGVudHNcbiAgICAgKi9cbiAgICBwdWJsaWMgaGFsZkV4dGVudHM6IFZlYzM7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogRGlyZWN0aW9uIG1hdHJpeC5cbiAgICAgKiAhI3poXG4gICAgICog5pa55ZCR55+p6Zi144CCXG4gICAgICogQHByb3BlcnR5IHttYXQzfSBvcmllbnRhdGlvblxuICAgICAqL1xuICAgIHB1YmxpYyBvcmllbnRhdGlvbjogTWF0MztcblxuICAgIHByb3RlY3RlZCBfdHlwZTogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IgKGN4ID0gMCwgY3kgPSAwLCBjeiA9IDAsXG4gICAgICAgICAgICAgICAgIGh3ID0gMSwgaGggPSAxLCBobCA9IDEsXG4gICAgICAgICAgICAgICAgIG94XzEgPSAxLCBveF8yID0gMCwgb3hfMyA9IDAsXG4gICAgICAgICAgICAgICAgIG95XzEgPSAwLCBveV8yID0gMSwgb3lfMyA9IDAsXG4gICAgICAgICAgICAgICAgIG96XzEgPSAwLCBvel8yID0gMCwgb3pfMyA9IDEpIHtcbiAgICAgICAgdGhpcy5fdHlwZSA9IGVudW1zLlNIQVBFX09CQjtcbiAgICAgICAgdGhpcy5jZW50ZXIgPSBuZXcgVmVjMyhjeCwgY3ksIGN6KTtcbiAgICAgICAgdGhpcy5oYWxmRXh0ZW50cyA9IG5ldyBWZWMzKGh3LCBoaCwgaGwpO1xuICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gbmV3IE1hdDMob3hfMSwgb3hfMiwgb3hfMywgb3lfMSwgb3lfMiwgb3lfMywgb3pfMSwgb3pfMiwgb3pfMyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldCB0aGUgYm91bmRpbmcgcG9pbnRzIG9mIHRoaXMgc2hhcGVcbiAgICAgKiAhI3poXG4gICAgICog6I635Y+WIG9iYiDnmoTmnIDlsI/ngrnlkozmnIDlpKfngrnjgIJcbiAgICAgKiBAbWV0aG9kIGdldEJvdW5kYXJ5XG4gICAgICogQHBhcmFtIHtWZWMzfSBtaW5Qb3NcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IG1heFBvc1xuICAgICAqL1xuICAgIHB1YmxpYyBnZXRCb3VuZGFyeSAobWluUG9zOiBWZWMzLCBtYXhQb3M6IFZlYzMpIHtcbiAgICAgICAgdHJhbnNmb3JtX2V4dGVudF9tMyhfdjNfdG1wLCB0aGlzLmhhbGZFeHRlbnRzLCB0aGlzLm9yaWVudGF0aW9uKTtcbiAgICAgICAgVmVjMy5zdWJ0cmFjdChtaW5Qb3MsIHRoaXMuY2VudGVyLCBfdjNfdG1wKTtcbiAgICAgICAgVmVjMy5hZGQobWF4UG9zLCB0aGlzLmNlbnRlciwgX3YzX3RtcCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBUcmFuc2Zvcm0gdGhpcyBzaGFwZVxuICAgICAqICEjemhcbiAgICAgKiDlsIYgb3V0IOagueaNrui/meS4qiBvYmIg55qE5pWw5o2u6L+b6KGM5Y+Y5o2i44CCXG4gICAgICogQG1ldGhvZCB0cmFuc2Zvcm1cbiAgICAgKiBAcGFyYW0gbSBUaGUgdHJhbnNmb3JtYXRpb24gbWF0cml4LlxuICAgICAqIEBwYXJhbSBwb3MgVGhlIHBvc2l0aW9uIHBhcnQgb2YgdGhlIHRyYW5zZm9ybWF0aW9uLlxuICAgICAqIEBwYXJhbSByb3QgVGhlIHJvdGF0aW5nIHBhcnQgb2YgdGhlIHRyYW5zZm9ybWF0aW9uLlxuICAgICAqIEBwYXJhbSBzY2FsZSBUaGUgc2NhbGluZyBwYXJ0IG9mIHRoZSB0cmFuc2Zvcm1hdGlvbi5cbiAgICAgKiBAcGFyYW0gb3V0IFRhcmdldCBvZiB0cmFuc2Zvcm1hdGlvbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgdHJhbnNmb3JtIChtOiBNYXQ0LCBwb3M6IFZlYzMsIHJvdDogUXVhdCwgc2NhbGU6IFZlYzMsIG91dDogb2JiKSB7XG4gICAgICAgIFZlYzMudHJhbnNmb3JtTWF0NChvdXQuY2VudGVyLCB0aGlzLmNlbnRlciwgbSk7XG4gICAgICAgIC8vIHBhcmVudCBzaGFwZSBkb2Vzbid0IGNvbnRhaW4gcm90YXRpb25zIGZvciBub3dcbiAgICAgICAgTWF0My5mcm9tUXVhdChvdXQub3JpZW50YXRpb24sIHJvdCk7XG4gICAgICAgIFZlYzMubXVsdGlwbHkob3V0LmhhbGZFeHRlbnRzLCB0aGlzLmhhbGZFeHRlbnRzLCBzY2FsZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFRyYW5zZm9ybSBvdXQgYmFzZWQgb24gdGhpcyBvYmIgZGF0YS5cbiAgICAgKiAhI3poXG4gICAgICog5bCGIG91dCDmoLnmja7ov5nkuKogb2JiIOeahOaVsOaNrui/m+ihjOWPmOaNouOAglxuICAgICAqIEBtZXRob2QgdHJhbnNsYXRlQW5kUm90YXRlXG4gICAgICogQHBhcmFtIG0gVGhlIHRyYW5zZm9ybWF0aW9uIG1hdHJpeC5cbiAgICAgKiBAcGFyYW0gcm90IFRoZSByb3RhdGluZyBwYXJ0IG9mIHRoZSB0cmFuc2Zvcm1hdGlvbi5cbiAgICAgKiBAcGFyYW0gb3V0IFRhcmdldCBvZiB0cmFuc2Zvcm1hdGlvbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgdHJhbnNsYXRlQW5kUm90YXRlIChtOiBNYXQ0LCByb3Q6IFF1YXQsIG91dDogb2JiKXtcbiAgICAgICAgVmVjMy50cmFuc2Zvcm1NYXQ0KG91dC5jZW50ZXIsIHRoaXMuY2VudGVyLCBtKTtcbiAgICAgICAgLy8gcGFyZW50IHNoYXBlIGRvZXNuJ3QgY29udGFpbiByb3RhdGlvbnMgZm9yIG5vd1xuICAgICAgICBNYXQzLmZyb21RdWF0KG91dC5vcmllbnRhdGlvbiwgcm90KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogU2NhbGUgb3V0IGJhc2VkIG9uIHRoaXMgb2JiIGRhdGEuXG4gICAgICogISN6aFxuICAgICAqIOWwhiBvdXQg5qC55o2u6L+Z5LiqIG9iYiDnmoTmlbDmja7ov5vooYznvKnmlL7jgIJcbiAgICAgKiBAbWV0aG9kIHNldFNjYWxlXG4gICAgICogQHBhcmFtIHNjYWxlIFNjYWxlIHZhbHVlLlxuICAgICAqIEBwYXJhbSBvdXQgU2NhbGVkIHRhcmdldC5cbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0U2NhbGUgKHNjYWxlOiBWZWMzLCBvdXQ6IG9iYikge1xuICAgICAgICBWZWMzLm11bHRpcGx5KG91dC5oYWxmRXh0ZW50cywgdGhpcy5oYWxmRXh0ZW50cywgc2NhbGUpO1xuICAgIH1cbn1cbiJdfQ==