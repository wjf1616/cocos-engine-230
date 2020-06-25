
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/scene/camera.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _valueTypes = require("../../core/value-types");

var _geomUtils = require("../../core/geom-utils");

var _enums = _interopRequireDefault(require("../enums"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _tmp_mat4 = new _valueTypes.Mat4();

var _matView = new _valueTypes.Mat4();

var _matProj = new _valueTypes.Mat4();

var _matViewProj = new _valueTypes.Mat4();

var _matInvViewProj = new _valueTypes.Mat4();

var _tmp_v3 = new _valueTypes.Vec3();

var _tmp2_v3 = new _valueTypes.Vec3();
/**
 * A representation of a camera instance
 */


var Camera =
/*#__PURE__*/
function () {
  function Camera() {
    this._poolID = -1;
    this._node = null;
    this._projection = _enums["default"].PROJ_PERSPECTIVE;
    this._priority = 0;
    this._color = new _valueTypes.Vec4(0.2, 0.3, 0.47, 1);
    this._depth = 1;
    this._stencil = 0;
    this._clearFlags = _enums["default"].CLEAR_COLOR | _enums["default"].CLEAR_DEPTH;
    this._clearModel = null;
    this._stages = [];
    this._framebuffer = null;
    this._near = 0.01;
    this._far = 1000.0;
    this._fov = Math.PI / 4.0;
    this._rect = {
      x: 0,
      y: 0,
      w: 1,
      h: 1
    };
    this._orthoHeight = 10;
    this._cullingMask = 0xffffffff;
  }

  var _proto = Camera.prototype;

  _proto.setCullingMask = function setCullingMask(mask) {
    this._cullingMask = mask;
  }
  /**
   * Get the hosting node of this camera
   * @returns {Node} the hosting node
   */
  ;

  _proto.getNode = function getNode() {
    return this._node;
  }
  /**
   * Set the hosting node of this camera
   * @param {Node} node the hosting node
   */
  ;

  _proto.setNode = function setNode(node) {
    this._node = node;
  }
  /**
   * Get the projection type of the camera
   * @returns {number} camera projection type
   */
  ;

  _proto.getType = function getType() {
    return this._projection;
  }
  /**
   * Set the projection type of the camera
   * @param {number} type camera projection type
   */
  ;

  _proto.setType = function setType(type) {
    this._projection = type;
  }
  /**
   * Get the priority of the camera
   * @returns {number} camera priority
   */
  ;

  _proto.getPriority = function getPriority() {
    return this._priority;
  }
  /**
   * Set the priority of the camera
   * @param {number} priority camera priority
   */
  ;

  _proto.setPriority = function setPriority(priority) {
    this._priority = priority;
  }
  /**
   * Get the orthogonal height of the camera
   * @returns {number} camera height
   */
  ;

  _proto.getOrthoHeight = function getOrthoHeight() {
    return this._orthoHeight;
  }
  /**
   * Set the orthogonal height of the camera
   * @param {number} val camera height
   */
  ;

  _proto.setOrthoHeight = function setOrthoHeight(val) {
    this._orthoHeight = val;
  }
  /**
   * Get the field of view of the camera
   * @returns {number} camera field of view
   */
  ;

  _proto.getFov = function getFov() {
    return this._fov;
  }
  /**
   * Set the field of view of the camera
   * @param {number} fov camera field of view
   */
  ;

  _proto.setFov = function setFov(fov) {
    this._fov = fov;
  }
  /**
   * Get the near clipping distance of the camera
   * @returns {number} camera near clipping distance
   */
  ;

  _proto.getNear = function getNear() {
    return this._near;
  }
  /**
   * Set the near clipping distance of the camera
   * @param {number} near camera near clipping distance
   */
  ;

  _proto.setNear = function setNear(near) {
    this._near = near;
  }
  /**
   * Get the far clipping distance of the camera
   * @returns {number} camera far clipping distance
   */
  ;

  _proto.getFar = function getFar() {
    return this._far;
  }
  /**
   * Set the far clipping distance of the camera
   * @param {number} far camera far clipping distance
   */
  ;

  _proto.setFar = function setFar(far) {
    this._far = far;
  }
  /**
   * Get the clear color of the camera
   * @returns {Vec4} out the receiving color vector
   */
  ;

  _proto.getColor = function getColor(out) {
    return _valueTypes.Vec4.copy(out, this._color);
  }
  /**
   * Set the clear color of the camera
   * @param {number} r red channel of camera clear color
   * @param {number} g green channel of camera clear color
   * @param {number} b blue channel of camera clear color
   * @param {number} a alpha channel of camera clear color
   */
  ;

  _proto.setColor = function setColor(r, g, b, a) {
    _valueTypes.Vec4.set(this._color, r, g, b, a);
  }
  /**
   * Get the clear depth of the camera
   * @returns {number} camera clear depth
   */
  ;

  _proto.getDepth = function getDepth() {
    return this._depth;
  }
  /**
   * Set the clear depth of the camera
   * @param {number} depth camera clear depth
   */
  ;

  _proto.setDepth = function setDepth(depth) {
    this._depth = depth;
  }
  /**
   * Get the clearing stencil value of the camera
   * @returns {number} camera clearing stencil value
   */
  ;

  _proto.getStencil = function getStencil() {
    return this._stencil;
  }
  /**
   * Set the clearing stencil value of the camera
   * @param {number} stencil camera clearing stencil value
   */
  ;

  _proto.setStencil = function setStencil(stencil) {
    this._stencil = stencil;
  }
  /**
   * Get the clearing flags of the camera
   * @returns {number} camera clearing flags
   */
  ;

  _proto.getClearFlags = function getClearFlags() {
    return this._clearFlags;
  }
  /**
   * Set the clearing flags of the camera
   * @param {number} flags camera clearing flags
   */
  ;

  _proto.setClearFlags = function setClearFlags(flags) {
    this._clearFlags = flags;
  }
  /**
   * Get the rect of the camera
   * @param {Object} out the receiving object
   * @returns {Object} camera rect
   */
  ;

  _proto.getRect = function getRect(out) {
    out.x = this._rect.x;
    out.y = this._rect.y;
    out.w = this._rect.w;
    out.h = this._rect.h;
    return out;
  }
  /**
   * Set the rect of the camera
   * @param {Number} x - [0,1]
   * @param {Number} y - [0,1]
   * @param {Number} w - [0,1]
   * @param {Number} h - [0,1]
   */
  ;

  _proto.setRect = function setRect(x, y, w, h) {
    this._rect.x = x;
    this._rect.y = y;
    this._rect.w = w;
    this._rect.h = h;
  }
  /**
   * Get the stages of the camera
   * @returns {string[]} camera stages
   */
  ;

  _proto.getStages = function getStages() {
    return this._stages;
  }
  /**
   * Set the stages of the camera
   * @param {string[]} stages camera stages
   */
  ;

  _proto.setStages = function setStages(stages) {
    this._stages = stages;
  }
  /**
   * Get the framebuffer of the camera
   * @returns {FrameBuffer} camera framebuffer
   */
  ;

  _proto.getFramebuffer = function getFramebuffer() {
    return this._framebuffer;
  }
  /**
   * Set the framebuffer of the camera
   * @param {FrameBuffer} framebuffer camera framebuffer
   */
  ;

  _proto.setFrameBuffer = function setFrameBuffer(framebuffer) {
    this._framebuffer = framebuffer;
  };

  _proto._calcMatrices = function _calcMatrices(width, height) {
    // view matrix
    this._node.getWorldRT(_matView);

    _valueTypes.Mat4.invert(_matView, _matView); // projection matrix


    var aspect = width / height;

    if (this._projection === _enums["default"].PROJ_PERSPECTIVE) {
      _valueTypes.Mat4.perspective(_matProj, this._fov, aspect, this._near, this._far);
    } else {
      var x = this._orthoHeight * aspect;
      var y = this._orthoHeight;

      _valueTypes.Mat4.ortho(_matProj, -x, x, -y, y, this._near, this._far);
    } // view-projection


    _valueTypes.Mat4.mul(_matViewProj, _matProj, _matView); // inv view-projection


    _valueTypes.Mat4.invert(_matInvViewProj, _matViewProj);
  }
  /**
   * extract a view of this camera
   * @param {View} out the receiving view
   * @param {number} width framebuffer width
   * @param {number} height framebuffer height
   */
  ;

  _proto.extractView = function extractView(out, width, height) {
    if (this._framebuffer) {
      width = this._framebuffer._width;
      height = this._framebuffer._height;
    } // priority


    out._priority = this._priority; // rect

    out._rect.x = this._rect.x * width;
    out._rect.y = this._rect.y * height;
    out._rect.w = this._rect.w * width;
    out._rect.h = this._rect.h * height; // clear opts

    this.getColor(out._color);
    out._depth = this._depth;
    out._stencil = this._stencil;
    out._clearFlags = this._clearFlags;
    out._clearModel = this._clearModel; // stages & framebuffer

    out._stages = this._stages;
    out._framebuffer = this._framebuffer;

    this._calcMatrices(width, height);

    _valueTypes.Mat4.copy(out._matView, _matView);

    _valueTypes.Mat4.copy(out._matProj, _matProj);

    _valueTypes.Mat4.copy(out._matViewProj, _matViewProj);

    _valueTypes.Mat4.copy(out._matInvViewProj, _matInvViewProj);

    out._cullingMask = this._cullingMask;
  }
  /**
   * transform a screen position to a world space ray
   * @param {number} x the screen x position to be transformed
   * @param {number} y the screen y position to be transformed
   * @param {number} width framebuffer width
   * @param {number} height framebuffer height
   * @param {Ray} out the resulting ray
   * @returns {Ray} the resulting ray
   */
  ;

  _proto.screenPointToRay = function screenPointToRay(x, y, width, height, out) {
    if (!cc.geomUtils) return out;
    out = out || new _geomUtils.Ray();

    this._calcMatrices(width, height);

    var cx = this._rect.x * width;
    var cy = this._rect.y * height;
    var cw = this._rect.w * width;
    var ch = this._rect.h * height; // far plane intersection

    _valueTypes.Vec3.set(_tmp2_v3, (x - cx) / cw * 2 - 1, (y - cy) / ch * 2 - 1, 1);

    _valueTypes.Vec3.transformMat4(_tmp2_v3, _tmp2_v3, _matInvViewProj);

    if (this._projection === _enums["default"].PROJ_PERSPECTIVE) {
      // camera origin
      this._node.getWorldPosition(_tmp_v3);
    } else {
      // near plane intersection
      _valueTypes.Vec3.set(_tmp_v3, (x - cx) / cw * 2 - 1, (y - cy) / ch * 2 - 1, -1);

      _valueTypes.Vec3.transformMat4(_tmp_v3, _tmp_v3, _matInvViewProj);
    }

    return _geomUtils.Ray.fromPoints(out, _tmp_v3, _tmp2_v3);
  }
  /**
   * transform a screen position to world space
   * @param {Vec3} out the resulting vector
   * @param {Vec3} screenPos the screen position to be transformed
   * @param {number} width framebuffer width
   * @param {number} height framebuffer height
   * @returns {Vec3} the resulting vector
   */
  ;

  _proto.screenToWorld = function screenToWorld(out, screenPos, width, height) {
    this._calcMatrices(width, height);

    var cx = this._rect.x * width;
    var cy = this._rect.y * height;
    var cw = this._rect.w * width;
    var ch = this._rect.h * height;

    if (this._projection === _enums["default"].PROJ_PERSPECTIVE) {
      // calculate screen pos in far clip plane
      _valueTypes.Vec3.set(out, (screenPos.x - cx) / cw * 2 - 1, (screenPos.y - cy) / ch * 2 - 1, 0.9999); // transform to world


      _valueTypes.Vec3.transformMat4(out, out, _matInvViewProj); // lerp to depth z


      this._node.getWorldPosition(_tmp_v3);

      _valueTypes.Vec3.lerp(out, _tmp_v3, out, (0, _valueTypes.lerp)(this._near / this._far, 1, screenPos.z));
    } else {
      _valueTypes.Vec3.set(out, (screenPos.x - cx) / cw * 2 - 1, (screenPos.y - cy) / ch * 2 - 1, screenPos.z * 2 - 1); // transform to world


      _valueTypes.Vec3.transformMat4(out, out, _matInvViewProj);
    }

    return out;
  }
  /**
   * transform a world space position to screen space
   * @param {Vec3} out the resulting vector
   * @param {Vec3} worldPos the world space position to be transformed
   * @param {number} width framebuffer width
   * @param {number} height framebuffer height
   * @returns {Vec3} the resulting vector
   */
  ;

  _proto.worldToScreen = function worldToScreen(out, worldPos, width, height) {
    this._calcMatrices(width, height);

    var cx = this._rect.x * width;
    var cy = this._rect.y * height;
    var cw = this._rect.w * width;
    var ch = this._rect.h * height;

    _valueTypes.Vec3.transformMat4(out, worldPos, _matViewProj);

    out.x = cx + (out.x + 1) * 0.5 * cw;
    out.y = cy + (out.y + 1) * 0.5 * ch;
    out.z = out.z * 0.5 + 0.5;
    return out;
  }
  /**
   * transform a world space matrix to screen space
   * @param {Mat4} out the resulting vector
   * @param {Mat4} worldMatrix the world space matrix to be transformed
   * @param {number} width framebuffer width
   * @param {number} height framebuffer height
   * @returns {Mat4} the resulting vector
   */
  ;

  _proto.worldMatrixToScreen = function worldMatrixToScreen(out, worldMatrix, width, height) {
    this._calcMatrices(width, height);

    _valueTypes.Mat4.mul(out, _matViewProj, worldMatrix);

    var halfWidth = width / 2;
    var halfHeight = height / 2;

    _valueTypes.Mat4.identity(_tmp_mat4);

    _valueTypes.Mat4.transform(_tmp_mat4, _tmp_mat4, _valueTypes.Vec3.set(_tmp_v3, halfWidth, halfHeight, 0));

    _valueTypes.Mat4.scale(_tmp_mat4, _tmp_mat4, _valueTypes.Vec3.set(_tmp_v3, halfWidth, halfHeight, 1));

    _valueTypes.Mat4.mul(out, _tmp_mat4, out);

    return out;
  };

  _createClass(Camera, [{
    key: "cullingMask",
    // culling mask
    get: function get() {
      return this._cullingMask;
    },
    set: function set(mask) {
      this._cullingMask = mask;
    }
  }]);

  return Camera;
}();

exports["default"] = Camera;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhbWVyYS5qcyJdLCJuYW1lcyI6WyJfdG1wX21hdDQiLCJNYXQ0IiwiX21hdFZpZXciLCJfbWF0UHJvaiIsIl9tYXRWaWV3UHJvaiIsIl9tYXRJbnZWaWV3UHJvaiIsIl90bXBfdjMiLCJWZWMzIiwiX3RtcDJfdjMiLCJDYW1lcmEiLCJfcG9vbElEIiwiX25vZGUiLCJfcHJvamVjdGlvbiIsImVudW1zIiwiUFJPSl9QRVJTUEVDVElWRSIsIl9wcmlvcml0eSIsIl9jb2xvciIsIlZlYzQiLCJfZGVwdGgiLCJfc3RlbmNpbCIsIl9jbGVhckZsYWdzIiwiQ0xFQVJfQ09MT1IiLCJDTEVBUl9ERVBUSCIsIl9jbGVhck1vZGVsIiwiX3N0YWdlcyIsIl9mcmFtZWJ1ZmZlciIsIl9uZWFyIiwiX2ZhciIsIl9mb3YiLCJNYXRoIiwiUEkiLCJfcmVjdCIsIngiLCJ5IiwidyIsImgiLCJfb3J0aG9IZWlnaHQiLCJfY3VsbGluZ01hc2siLCJzZXRDdWxsaW5nTWFzayIsIm1hc2siLCJnZXROb2RlIiwic2V0Tm9kZSIsIm5vZGUiLCJnZXRUeXBlIiwic2V0VHlwZSIsInR5cGUiLCJnZXRQcmlvcml0eSIsInNldFByaW9yaXR5IiwicHJpb3JpdHkiLCJnZXRPcnRob0hlaWdodCIsInNldE9ydGhvSGVpZ2h0IiwidmFsIiwiZ2V0Rm92Iiwic2V0Rm92IiwiZm92IiwiZ2V0TmVhciIsInNldE5lYXIiLCJuZWFyIiwiZ2V0RmFyIiwic2V0RmFyIiwiZmFyIiwiZ2V0Q29sb3IiLCJvdXQiLCJjb3B5Iiwic2V0Q29sb3IiLCJyIiwiZyIsImIiLCJhIiwic2V0IiwiZ2V0RGVwdGgiLCJzZXREZXB0aCIsImRlcHRoIiwiZ2V0U3RlbmNpbCIsInNldFN0ZW5jaWwiLCJzdGVuY2lsIiwiZ2V0Q2xlYXJGbGFncyIsInNldENsZWFyRmxhZ3MiLCJmbGFncyIsImdldFJlY3QiLCJzZXRSZWN0IiwiZ2V0U3RhZ2VzIiwic2V0U3RhZ2VzIiwic3RhZ2VzIiwiZ2V0RnJhbWVidWZmZXIiLCJzZXRGcmFtZUJ1ZmZlciIsImZyYW1lYnVmZmVyIiwiX2NhbGNNYXRyaWNlcyIsIndpZHRoIiwiaGVpZ2h0IiwiZ2V0V29ybGRSVCIsImludmVydCIsImFzcGVjdCIsInBlcnNwZWN0aXZlIiwib3J0aG8iLCJtdWwiLCJleHRyYWN0VmlldyIsIl93aWR0aCIsIl9oZWlnaHQiLCJzY3JlZW5Qb2ludFRvUmF5IiwiY2MiLCJnZW9tVXRpbHMiLCJSYXkiLCJjeCIsImN5IiwiY3ciLCJjaCIsInRyYW5zZm9ybU1hdDQiLCJnZXRXb3JsZFBvc2l0aW9uIiwiZnJvbVBvaW50cyIsInNjcmVlblRvV29ybGQiLCJzY3JlZW5Qb3MiLCJsZXJwIiwieiIsIndvcmxkVG9TY3JlZW4iLCJ3b3JsZFBvcyIsIndvcmxkTWF0cml4VG9TY3JlZW4iLCJ3b3JsZE1hdHJpeCIsImhhbGZXaWR0aCIsImhhbGZIZWlnaHQiLCJpZGVudGl0eSIsInRyYW5zZm9ybSIsInNjYWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBSUEsU0FBUyxHQUFHLElBQUlDLGdCQUFKLEVBQWhCOztBQUVBLElBQUlDLFFBQVEsR0FBRyxJQUFJRCxnQkFBSixFQUFmOztBQUNBLElBQUlFLFFBQVEsR0FBRyxJQUFJRixnQkFBSixFQUFmOztBQUNBLElBQUlHLFlBQVksR0FBRyxJQUFJSCxnQkFBSixFQUFuQjs7QUFDQSxJQUFJSSxlQUFlLEdBQUcsSUFBSUosZ0JBQUosRUFBdEI7O0FBQ0EsSUFBSUssT0FBTyxHQUFHLElBQUlDLGdCQUFKLEVBQWQ7O0FBQ0EsSUFBSUMsUUFBUSxHQUFHLElBQUlELGdCQUFKLEVBQWY7QUFFQTs7Ozs7SUFHcUJFOzs7O1NBQ25CQyxVQUFVLENBQUM7U0FDWEMsUUFBUTtTQUNSQyxjQUFjQyxrQkFBTUM7U0FHcEJDLFlBQVk7U0FHWkMsU0FBUyxJQUFJQyxnQkFBSixDQUFTLEdBQVQsRUFBYyxHQUFkLEVBQW1CLElBQW5CLEVBQXlCLENBQXpCO1NBQ1RD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QUExQjs7QUFDQXhGLHFCQUFLdUgsUUFBTCxDQUFjeEgsU0FBZDs7QUFDQUMscUJBQUt3SCxTQUFMLENBQWV6SCxTQUFmLEVBQTBCQSxTQUExQixFQUFxQ08saUJBQUs4RCxHQUFMLENBQVMvRCxPQUFULEVBQWtCZ0gsU0FBbEIsRUFBNkJDLFVBQTdCLEVBQXlDLENBQXpDLENBQXJDOztBQUNBdEgscUJBQUt5SCxLQUFMLENBQVcxSCxTQUFYLEVBQXNCQSxTQUF0QixFQUFpQ08saUJBQUs4RCxHQUFMLENBQVMvRCxPQUFULEVBQWtCZ0gsU0FBbEIsRUFBNkJDLFVBQTdCLEVBQXlDLENBQXpDLENBQWpDOztBQUVBdEgscUJBQUs4RixHQUFMLENBQVNqQyxHQUFULEVBQWM5RCxTQUFkLEVBQXlCOEQsR0FBekI7O0FBRUEsV0FBT0EsR0FBUDtBQUNEOzs7O0FBaGNEO3dCQUNtQjtBQUNqQixhQUFPLEtBQUt6QixZQUFaO0FBQ0Q7c0JBRWdCRSxNQUFNO0FBQ3JCLFdBQUtGLFlBQUwsR0FBb0JFLElBQXBCO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuaW1wb3J0IHsgVmVjMywgTWF0NCwgbGVycCwgVmVjNCB9IGZyb20gJy4uLy4uL2NvcmUvdmFsdWUtdHlwZXMnO1xuaW1wb3J0IHsgUmF5IH0gZnJvbSAnLi4vLi4vY29yZS9nZW9tLXV0aWxzJztcbmltcG9ydCBlbnVtcyBmcm9tICcuLi9lbnVtcyc7XG5cbmxldCBfdG1wX21hdDQgPSBuZXcgTWF0NCgpO1xuXG5sZXQgX21hdFZpZXcgPSBuZXcgTWF0NCgpO1xubGV0IF9tYXRQcm9qID0gbmV3IE1hdDQoKTtcbmxldCBfbWF0Vmlld1Byb2ogPSBuZXcgTWF0NCgpO1xubGV0IF9tYXRJbnZWaWV3UHJvaiA9IG5ldyBNYXQ0KCk7XG5sZXQgX3RtcF92MyA9IG5ldyBWZWMzKCk7XG5sZXQgX3RtcDJfdjMgPSBuZXcgVmVjMygpO1xuXG4vKipcbiAqIEEgcmVwcmVzZW50YXRpb24gb2YgYSBjYW1lcmEgaW5zdGFuY2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FtZXJhIHtcbiAgX3Bvb2xJRCA9IC0xO1xuICBfbm9kZSA9IG51bGw7XG4gIF9wcm9qZWN0aW9uID0gZW51bXMuUFJPSl9QRVJTUEVDVElWRTtcblxuICAvLyBwcmlvcml0eS4gdGhlIHNtYWxsZXIgb25lIHdpbGwgYmUgcmVuZGVyZWQgZmlyc3RcbiAgX3ByaW9yaXR5ID0gMDtcblxuICAvLyBjbGVhciBvcHRpb25zXG4gIF9jb2xvciA9IG5ldyBWZWM0KDAuMiwgMC4zLCAwLjQ3LCAxKTtcbiAgX2RlcHRoID0gMTtcbiAgX3N0ZW5jaWwgPSAwO1xuICBfY2xlYXJGbGFncyA9IGVudW1zLkNMRUFSX0NPTE9SIHwgZW51bXMuQ0xFQVJfREVQVEg7XG4gIF9jbGVhck1vZGVsID0gbnVsbDtcblxuICAvLyBzdGFnZXMgJiBmcmFtZWJ1ZmZlclxuICBfc3RhZ2VzID0gW107XG4gIF9mcmFtZWJ1ZmZlciA9IG51bGw7XG5cbiAgLy8gcHJvamVjdGlvbiBwcm9wZXJ0aWVzXG4gIF9uZWFyID0gMC4wMTtcbiAgX2ZhciA9IDEwMDAuMDtcbiAgX2ZvdiA9IE1hdGguUEkgLyA0LjA7IC8vIHZlcnRpY2FsIGZvdlxuICBfcmVjdCA9IHtcbiAgICB4OiAwLCB5OiAwLCB3OiAxLCBoOiAxXG4gIH07XG5cbiAgLy8gb3J0aG8gcHJvcGVydGllc1xuICBfb3J0aG9IZWlnaHQgPSAxMDtcblxuICBfY3VsbGluZ01hc2sgPSAweGZmZmZmZmZmO1xuXG5cbiAgLy8gY3VsbGluZyBtYXNrXG4gIGdldCBjdWxsaW5nTWFzayAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2N1bGxpbmdNYXNrO1xuICB9XG5cbiAgc2V0IGN1bGxpbmdNYXNrIChtYXNrKSB7XG4gICAgdGhpcy5fY3VsbGluZ01hc2sgPSBtYXNrO1xuICB9XG5cbiAgc2V0Q3VsbGluZ01hc2sgKG1hc2spIHtcbiAgICB0aGlzLl9jdWxsaW5nTWFzayA9IG1hc2s7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBob3N0aW5nIG5vZGUgb2YgdGhpcyBjYW1lcmFcbiAgICogQHJldHVybnMge05vZGV9IHRoZSBob3N0aW5nIG5vZGVcbiAgICovXG4gIGdldE5vZGUgKCkge1xuICAgIHJldHVybiB0aGlzLl9ub2RlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgaG9zdGluZyBub2RlIG9mIHRoaXMgY2FtZXJhXG4gICAqIEBwYXJhbSB7Tm9kZX0gbm9kZSB0aGUgaG9zdGluZyBub2RlXG4gICAqL1xuICBzZXROb2RlIChub2RlKSB7XG4gICAgdGhpcy5fbm9kZSA9IG5vZGU7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBwcm9qZWN0aW9uIHR5cGUgb2YgdGhlIGNhbWVyYVxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBjYW1lcmEgcHJvamVjdGlvbiB0eXBlXG4gICAqL1xuICBnZXRUeXBlICgpIHtcbiAgICByZXR1cm4gdGhpcy5fcHJvamVjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHByb2plY3Rpb24gdHlwZSBvZiB0aGUgY2FtZXJhXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0eXBlIGNhbWVyYSBwcm9qZWN0aW9uIHR5cGVcbiAgICovXG4gIHNldFR5cGUgKHR5cGUpIHtcbiAgICB0aGlzLl9wcm9qZWN0aW9uID0gdHlwZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHByaW9yaXR5IG9mIHRoZSBjYW1lcmFcbiAgICogQHJldHVybnMge251bWJlcn0gY2FtZXJhIHByaW9yaXR5XG4gICAqL1xuICBnZXRQcmlvcml0eSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ByaW9yaXR5O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgcHJpb3JpdHkgb2YgdGhlIGNhbWVyYVxuICAgKiBAcGFyYW0ge251bWJlcn0gcHJpb3JpdHkgY2FtZXJhIHByaW9yaXR5XG4gICAqL1xuICBzZXRQcmlvcml0eSAocHJpb3JpdHkpIHtcbiAgICB0aGlzLl9wcmlvcml0eSA9IHByaW9yaXR5O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgb3J0aG9nb25hbCBoZWlnaHQgb2YgdGhlIGNhbWVyYVxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBjYW1lcmEgaGVpZ2h0XG4gICAqL1xuICBnZXRPcnRob0hlaWdodCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29ydGhvSGVpZ2h0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgb3J0aG9nb25hbCBoZWlnaHQgb2YgdGhlIGNhbWVyYVxuICAgKiBAcGFyYW0ge251bWJlcn0gdmFsIGNhbWVyYSBoZWlnaHRcbiAgICovXG4gIHNldE9ydGhvSGVpZ2h0ICh2YWwpIHtcbiAgICB0aGlzLl9vcnRob0hlaWdodCA9IHZhbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGZpZWxkIG9mIHZpZXcgb2YgdGhlIGNhbWVyYVxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBjYW1lcmEgZmllbGQgb2Ygdmlld1xuICAgKi9cbiAgZ2V0Rm92ICgpIHtcbiAgICByZXR1cm4gdGhpcy5fZm92O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgZmllbGQgb2YgdmlldyBvZiB0aGUgY2FtZXJhXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBmb3YgY2FtZXJhIGZpZWxkIG9mIHZpZXdcbiAgICovXG4gIHNldEZvdiAoZm92KSB7XG4gICAgdGhpcy5fZm92ID0gZm92O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgbmVhciBjbGlwcGluZyBkaXN0YW5jZSBvZiB0aGUgY2FtZXJhXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGNhbWVyYSBuZWFyIGNsaXBwaW5nIGRpc3RhbmNlXG4gICAqL1xuICBnZXROZWFyICgpIHtcbiAgICByZXR1cm4gdGhpcy5fbmVhcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIG5lYXIgY2xpcHBpbmcgZGlzdGFuY2Ugb2YgdGhlIGNhbWVyYVxuICAgKiBAcGFyYW0ge251bWJlcn0gbmVhciBjYW1lcmEgbmVhciBjbGlwcGluZyBkaXN0YW5jZVxuICAgKi9cbiAgc2V0TmVhciAobmVhcikge1xuICAgIHRoaXMuX25lYXIgPSBuZWFyO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgZmFyIGNsaXBwaW5nIGRpc3RhbmNlIG9mIHRoZSBjYW1lcmFcbiAgICogQHJldHVybnMge251bWJlcn0gY2FtZXJhIGZhciBjbGlwcGluZyBkaXN0YW5jZVxuICAgKi9cbiAgZ2V0RmFyICgpIHtcbiAgICByZXR1cm4gdGhpcy5fZmFyO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgZmFyIGNsaXBwaW5nIGRpc3RhbmNlIG9mIHRoZSBjYW1lcmFcbiAgICogQHBhcmFtIHtudW1iZXJ9IGZhciBjYW1lcmEgZmFyIGNsaXBwaW5nIGRpc3RhbmNlXG4gICAqL1xuICBzZXRGYXIgKGZhcikge1xuICAgIHRoaXMuX2ZhciA9IGZhcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGNsZWFyIGNvbG9yIG9mIHRoZSBjYW1lcmFcbiAgICogQHJldHVybnMge1ZlYzR9IG91dCB0aGUgcmVjZWl2aW5nIGNvbG9yIHZlY3RvclxuICAgKi9cbiAgZ2V0Q29sb3IgKG91dCkge1xuICAgIHJldHVybiBWZWM0LmNvcHkob3V0LCB0aGlzLl9jb2xvcik7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBjbGVhciBjb2xvciBvZiB0aGUgY2FtZXJhXG4gICAqIEBwYXJhbSB7bnVtYmVyfSByIHJlZCBjaGFubmVsIG9mIGNhbWVyYSBjbGVhciBjb2xvclxuICAgKiBAcGFyYW0ge251bWJlcn0gZyBncmVlbiBjaGFubmVsIG9mIGNhbWVyYSBjbGVhciBjb2xvclxuICAgKiBAcGFyYW0ge251bWJlcn0gYiBibHVlIGNoYW5uZWwgb2YgY2FtZXJhIGNsZWFyIGNvbG9yXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhIGFscGhhIGNoYW5uZWwgb2YgY2FtZXJhIGNsZWFyIGNvbG9yXG4gICAqL1xuICBzZXRDb2xvciAociwgZywgYiwgYSkge1xuICAgIFZlYzQuc2V0KHRoaXMuX2NvbG9yLCByLCBnLCBiLCBhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGNsZWFyIGRlcHRoIG9mIHRoZSBjYW1lcmFcbiAgICogQHJldHVybnMge251bWJlcn0gY2FtZXJhIGNsZWFyIGRlcHRoXG4gICAqL1xuICBnZXREZXB0aCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RlcHRoO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgY2xlYXIgZGVwdGggb2YgdGhlIGNhbWVyYVxuICAgKiBAcGFyYW0ge251bWJlcn0gZGVwdGggY2FtZXJhIGNsZWFyIGRlcHRoXG4gICAqL1xuICBzZXREZXB0aCAoZGVwdGgpIHtcbiAgICB0aGlzLl9kZXB0aCA9IGRlcHRoO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY2xlYXJpbmcgc3RlbmNpbCB2YWx1ZSBvZiB0aGUgY2FtZXJhXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGNhbWVyYSBjbGVhcmluZyBzdGVuY2lsIHZhbHVlXG4gICAqL1xuICBnZXRTdGVuY2lsICgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RlbmNpbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGNsZWFyaW5nIHN0ZW5jaWwgdmFsdWUgb2YgdGhlIGNhbWVyYVxuICAgKiBAcGFyYW0ge251bWJlcn0gc3RlbmNpbCBjYW1lcmEgY2xlYXJpbmcgc3RlbmNpbCB2YWx1ZVxuICAgKi9cbiAgc2V0U3RlbmNpbCAoc3RlbmNpbCkge1xuICAgIHRoaXMuX3N0ZW5jaWwgPSBzdGVuY2lsO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY2xlYXJpbmcgZmxhZ3Mgb2YgdGhlIGNhbWVyYVxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBjYW1lcmEgY2xlYXJpbmcgZmxhZ3NcbiAgICovXG4gIGdldENsZWFyRmxhZ3MgKCkge1xuICAgIHJldHVybiB0aGlzLl9jbGVhckZsYWdzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgY2xlYXJpbmcgZmxhZ3Mgb2YgdGhlIGNhbWVyYVxuICAgKiBAcGFyYW0ge251bWJlcn0gZmxhZ3MgY2FtZXJhIGNsZWFyaW5nIGZsYWdzXG4gICAqL1xuICBzZXRDbGVhckZsYWdzIChmbGFncykge1xuICAgIHRoaXMuX2NsZWFyRmxhZ3MgPSBmbGFncztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHJlY3Qgb2YgdGhlIGNhbWVyYVxuICAgKiBAcGFyYW0ge09iamVjdH0gb3V0IHRoZSByZWNlaXZpbmcgb2JqZWN0XG4gICAqIEByZXR1cm5zIHtPYmplY3R9IGNhbWVyYSByZWN0XG4gICAqL1xuICBnZXRSZWN0IChvdXQpIHtcbiAgICBvdXQueCA9IHRoaXMuX3JlY3QueDtcbiAgICBvdXQueSA9IHRoaXMuX3JlY3QueTtcbiAgICBvdXQudyA9IHRoaXMuX3JlY3QudztcbiAgICBvdXQuaCA9IHRoaXMuX3JlY3QuaDtcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSByZWN0IG9mIHRoZSBjYW1lcmFcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHggLSBbMCwxXVxuICAgKiBAcGFyYW0ge051bWJlcn0geSAtIFswLDFdXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB3IC0gWzAsMV1cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGggLSBbMCwxXVxuICAgKi9cbiAgc2V0UmVjdCAoeCwgeSwgdywgaCkge1xuICAgIHRoaXMuX3JlY3QueCA9IHg7XG4gICAgdGhpcy5fcmVjdC55ID0geTtcbiAgICB0aGlzLl9yZWN0LncgPSB3O1xuICAgIHRoaXMuX3JlY3QuaCA9IGg7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBzdGFnZXMgb2YgdGhlIGNhbWVyYVxuICAgKiBAcmV0dXJucyB7c3RyaW5nW119IGNhbWVyYSBzdGFnZXNcbiAgICovXG4gIGdldFN0YWdlcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YWdlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHN0YWdlcyBvZiB0aGUgY2FtZXJhXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IHN0YWdlcyBjYW1lcmEgc3RhZ2VzXG4gICAqL1xuICBzZXRTdGFnZXMgKHN0YWdlcykge1xuICAgIHRoaXMuX3N0YWdlcyA9IHN0YWdlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGZyYW1lYnVmZmVyIG9mIHRoZSBjYW1lcmFcbiAgICogQHJldHVybnMge0ZyYW1lQnVmZmVyfSBjYW1lcmEgZnJhbWVidWZmZXJcbiAgICovXG4gIGdldEZyYW1lYnVmZmVyICgpIHtcbiAgICByZXR1cm4gdGhpcy5fZnJhbWVidWZmZXI7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBmcmFtZWJ1ZmZlciBvZiB0aGUgY2FtZXJhXG4gICAqIEBwYXJhbSB7RnJhbWVCdWZmZXJ9IGZyYW1lYnVmZmVyIGNhbWVyYSBmcmFtZWJ1ZmZlclxuICAgKi9cbiAgc2V0RnJhbWVCdWZmZXIgKGZyYW1lYnVmZmVyKSB7XG4gICAgdGhpcy5fZnJhbWVidWZmZXIgPSBmcmFtZWJ1ZmZlcjtcbiAgfVxuXG4gIF9jYWxjTWF0cmljZXMgKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAvLyB2aWV3IG1hdHJpeFxuICAgIHRoaXMuX25vZGUuZ2V0V29ybGRSVChfbWF0Vmlldyk7XG4gICAgTWF0NC5pbnZlcnQoX21hdFZpZXcsIF9tYXRWaWV3KTtcblxuICAgIC8vIHByb2plY3Rpb24gbWF0cml4XG4gICAgbGV0IGFzcGVjdCA9IHdpZHRoIC8gaGVpZ2h0O1xuICAgIGlmICh0aGlzLl9wcm9qZWN0aW9uID09PSBlbnVtcy5QUk9KX1BFUlNQRUNUSVZFKSB7XG4gICAgICBNYXQ0LnBlcnNwZWN0aXZlKF9tYXRQcm9qLFxuICAgICAgICB0aGlzLl9mb3YsXG4gICAgICAgIGFzcGVjdCxcbiAgICAgICAgdGhpcy5fbmVhcixcbiAgICAgICAgdGhpcy5fZmFyXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgeCA9IHRoaXMuX29ydGhvSGVpZ2h0ICogYXNwZWN0O1xuICAgICAgbGV0IHkgPSB0aGlzLl9vcnRob0hlaWdodDtcbiAgICAgIE1hdDQub3J0aG8oX21hdFByb2osXG4gICAgICAgIC14LCB4LCAteSwgeSwgdGhpcy5fbmVhciwgdGhpcy5fZmFyXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIHZpZXctcHJvamVjdGlvblxuICAgIE1hdDQubXVsKF9tYXRWaWV3UHJvaiwgX21hdFByb2osIF9tYXRWaWV3KTtcbiAgICAvLyBpbnYgdmlldy1wcm9qZWN0aW9uXG4gICAgTWF0NC5pbnZlcnQoX21hdEludlZpZXdQcm9qLCBfbWF0Vmlld1Byb2opO1xuICB9XG5cbiAgLyoqXG4gICAqIGV4dHJhY3QgYSB2aWV3IG9mIHRoaXMgY2FtZXJhXG4gICAqIEBwYXJhbSB7Vmlld30gb3V0IHRoZSByZWNlaXZpbmcgdmlld1xuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggZnJhbWVidWZmZXIgd2lkdGhcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCBmcmFtZWJ1ZmZlciBoZWlnaHRcbiAgICovXG4gIGV4dHJhY3RWaWV3IChvdXQsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBpZiAodGhpcy5fZnJhbWVidWZmZXIpIHtcbiAgICAgIHdpZHRoID0gdGhpcy5fZnJhbWVidWZmZXIuX3dpZHRoO1xuICAgICAgaGVpZ2h0ID0gdGhpcy5fZnJhbWVidWZmZXIuX2hlaWdodDtcbiAgICB9XG5cbiAgICAvLyBwcmlvcml0eVxuICAgIG91dC5fcHJpb3JpdHkgPSB0aGlzLl9wcmlvcml0eTtcblxuICAgIC8vIHJlY3RcbiAgICBvdXQuX3JlY3QueCA9IHRoaXMuX3JlY3QueCAqIHdpZHRoO1xuICAgIG91dC5fcmVjdC55ID0gdGhpcy5fcmVjdC55ICogaGVpZ2h0O1xuICAgIG91dC5fcmVjdC53ID0gdGhpcy5fcmVjdC53ICogd2lkdGg7XG4gICAgb3V0Ll9yZWN0LmggPSB0aGlzLl9yZWN0LmggKiBoZWlnaHQ7XG5cbiAgICAvLyBjbGVhciBvcHRzXG4gICAgdGhpcy5nZXRDb2xvcihvdXQuX2NvbG9yKTtcbiAgICBvdXQuX2RlcHRoID0gdGhpcy5fZGVwdGg7XG4gICAgb3V0Ll9zdGVuY2lsID0gdGhpcy5fc3RlbmNpbDtcbiAgICBvdXQuX2NsZWFyRmxhZ3MgPSB0aGlzLl9jbGVhckZsYWdzO1xuICAgIG91dC5fY2xlYXJNb2RlbCA9IHRoaXMuX2NsZWFyTW9kZWw7XG5cbiAgICAvLyBzdGFnZXMgJiBmcmFtZWJ1ZmZlclxuICAgIG91dC5fc3RhZ2VzID0gdGhpcy5fc3RhZ2VzO1xuICAgIG91dC5fZnJhbWVidWZmZXIgPSB0aGlzLl9mcmFtZWJ1ZmZlcjtcblxuICAgIHRoaXMuX2NhbGNNYXRyaWNlcyh3aWR0aCwgaGVpZ2h0KTtcbiAgICBNYXQ0LmNvcHkob3V0Ll9tYXRWaWV3LCBfbWF0Vmlldyk7XG4gICAgTWF0NC5jb3B5KG91dC5fbWF0UHJvaiwgX21hdFByb2opO1xuICAgIE1hdDQuY29weShvdXQuX21hdFZpZXdQcm9qLCBfbWF0Vmlld1Byb2opO1xuICAgIE1hdDQuY29weShvdXQuX21hdEludlZpZXdQcm9qLCBfbWF0SW52Vmlld1Byb2opO1xuXG4gICAgb3V0Ll9jdWxsaW5nTWFzayA9IHRoaXMuX2N1bGxpbmdNYXNrO1xuICB9XG5cbiAgLyoqXG4gICAqIHRyYW5zZm9ybSBhIHNjcmVlbiBwb3NpdGlvbiB0byBhIHdvcmxkIHNwYWNlIHJheVxuICAgKiBAcGFyYW0ge251bWJlcn0geCB0aGUgc2NyZWVuIHggcG9zaXRpb24gdG8gYmUgdHJhbnNmb3JtZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHkgdGhlIHNjcmVlbiB5IHBvc2l0aW9uIHRvIGJlIHRyYW5zZm9ybWVkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCBmcmFtZWJ1ZmZlciB3aWR0aFxuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IGZyYW1lYnVmZmVyIGhlaWdodFxuICAgKiBAcGFyYW0ge1JheX0gb3V0IHRoZSByZXN1bHRpbmcgcmF5XG4gICAqIEByZXR1cm5zIHtSYXl9IHRoZSByZXN1bHRpbmcgcmF5XG4gICAqL1xuICBzY3JlZW5Qb2ludFRvUmF5ICh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBvdXQpIHtcbiAgICBpZiAoIWNjLmdlb21VdGlscykgcmV0dXJuIG91dDtcblxuICAgIG91dCA9IG91dCB8fCBuZXcgUmF5KCk7XG4gICAgdGhpcy5fY2FsY01hdHJpY2VzKHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgbGV0IGN4ID0gdGhpcy5fcmVjdC54ICogd2lkdGg7XG4gICAgbGV0IGN5ID0gdGhpcy5fcmVjdC55ICogaGVpZ2h0O1xuICAgIGxldCBjdyA9IHRoaXMuX3JlY3QudyAqIHdpZHRoO1xuICAgIGxldCBjaCA9IHRoaXMuX3JlY3QuaCAqIGhlaWdodDtcblxuICAgIC8vIGZhciBwbGFuZSBpbnRlcnNlY3Rpb25cbiAgICBWZWMzLnNldChfdG1wMl92MywgKHggLSBjeCkgLyBjdyAqIDIgLSAxLCAoeSAtIGN5KSAvIGNoICogMiAtIDEsIDEpO1xuICAgIFZlYzMudHJhbnNmb3JtTWF0NChfdG1wMl92MywgX3RtcDJfdjMsIF9tYXRJbnZWaWV3UHJvaik7XG5cbiAgICBpZiAodGhpcy5fcHJvamVjdGlvbiA9PT0gZW51bXMuUFJPSl9QRVJTUEVDVElWRSkge1xuICAgICAgLy8gY2FtZXJhIG9yaWdpblxuICAgICAgdGhpcy5fbm9kZS5nZXRXb3JsZFBvc2l0aW9uKF90bXBfdjMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBuZWFyIHBsYW5lIGludGVyc2VjdGlvblxuICAgICAgVmVjMy5zZXQoX3RtcF92MywgKHggLSBjeCkgLyBjdyAqIDIgLSAxLCAoeSAtIGN5KSAvIGNoICogMiAtIDEsIC0xKTtcbiAgICAgIFZlYzMudHJhbnNmb3JtTWF0NChfdG1wX3YzLCBfdG1wX3YzLCBfbWF0SW52Vmlld1Byb2opO1xuICAgIH1cblxuICAgIHJldHVybiBSYXkuZnJvbVBvaW50cyhvdXQsIF90bXBfdjMsIF90bXAyX3YzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0cmFuc2Zvcm0gYSBzY3JlZW4gcG9zaXRpb24gdG8gd29ybGQgc3BhY2VcbiAgICogQHBhcmFtIHtWZWMzfSBvdXQgdGhlIHJlc3VsdGluZyB2ZWN0b3JcbiAgICogQHBhcmFtIHtWZWMzfSBzY3JlZW5Qb3MgdGhlIHNjcmVlbiBwb3NpdGlvbiB0byBiZSB0cmFuc2Zvcm1lZFxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggZnJhbWVidWZmZXIgd2lkdGhcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCBmcmFtZWJ1ZmZlciBoZWlnaHRcbiAgICogQHJldHVybnMge1ZlYzN9IHRoZSByZXN1bHRpbmcgdmVjdG9yXG4gICAqL1xuICBzY3JlZW5Ub1dvcmxkIChvdXQsIHNjcmVlblBvcywgd2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMuX2NhbGNNYXRyaWNlcyh3aWR0aCwgaGVpZ2h0KTtcblxuICAgIGxldCBjeCA9IHRoaXMuX3JlY3QueCAqIHdpZHRoO1xuICAgIGxldCBjeSA9IHRoaXMuX3JlY3QueSAqIGhlaWdodDtcbiAgICBsZXQgY3cgPSB0aGlzLl9yZWN0LncgKiB3aWR0aDtcbiAgICBsZXQgY2ggPSB0aGlzLl9yZWN0LmggKiBoZWlnaHQ7XG5cbiAgICBpZiAodGhpcy5fcHJvamVjdGlvbiA9PT0gZW51bXMuUFJPSl9QRVJTUEVDVElWRSkge1xuICAgICAgLy8gY2FsY3VsYXRlIHNjcmVlbiBwb3MgaW4gZmFyIGNsaXAgcGxhbmVcbiAgICAgIFZlYzMuc2V0KG91dCxcbiAgICAgICAgKHNjcmVlblBvcy54IC0gY3gpIC8gY3cgKiAyIC0gMSxcbiAgICAgICAgKHNjcmVlblBvcy55IC0gY3kpIC8gY2ggKiAyIC0gMSxcbiAgICAgICAgMC45OTk5XG4gICAgICApO1xuXG4gICAgICAvLyB0cmFuc2Zvcm0gdG8gd29ybGRcbiAgICAgIFZlYzMudHJhbnNmb3JtTWF0NChvdXQsIG91dCwgX21hdEludlZpZXdQcm9qKTtcblxuICAgICAgLy8gbGVycCB0byBkZXB0aCB6XG4gICAgICB0aGlzLl9ub2RlLmdldFdvcmxkUG9zaXRpb24oX3RtcF92Myk7XG5cbiAgICAgIFZlYzMubGVycChvdXQsIF90bXBfdjMsIG91dCwgbGVycCh0aGlzLl9uZWFyIC8gdGhpcy5fZmFyLCAxLCBzY3JlZW5Qb3MueikpO1xuICAgIH0gZWxzZSB7XG4gICAgICBWZWMzLnNldChvdXQsXG4gICAgICAgIChzY3JlZW5Qb3MueCAtIGN4KSAvIGN3ICogMiAtIDEsXG4gICAgICAgIChzY3JlZW5Qb3MueSAtIGN5KSAvIGNoICogMiAtIDEsXG4gICAgICAgIHNjcmVlblBvcy56ICogMiAtIDFcbiAgICAgICk7XG5cbiAgICAgIC8vIHRyYW5zZm9ybSB0byB3b3JsZFxuICAgICAgVmVjMy50cmFuc2Zvcm1NYXQ0KG91dCwgb3V0LCBfbWF0SW52Vmlld1Byb2opO1xuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICAvKipcbiAgICogdHJhbnNmb3JtIGEgd29ybGQgc3BhY2UgcG9zaXRpb24gdG8gc2NyZWVuIHNwYWNlXG4gICAqIEBwYXJhbSB7VmVjM30gb3V0IHRoZSByZXN1bHRpbmcgdmVjdG9yXG4gICAqIEBwYXJhbSB7VmVjM30gd29ybGRQb3MgdGhlIHdvcmxkIHNwYWNlIHBvc2l0aW9uIHRvIGJlIHRyYW5zZm9ybWVkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCBmcmFtZWJ1ZmZlciB3aWR0aFxuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IGZyYW1lYnVmZmVyIGhlaWdodFxuICAgKiBAcmV0dXJucyB7VmVjM30gdGhlIHJlc3VsdGluZyB2ZWN0b3JcbiAgICovXG4gIHdvcmxkVG9TY3JlZW4gKG91dCwgd29ybGRQb3MsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICB0aGlzLl9jYWxjTWF0cmljZXMod2lkdGgsIGhlaWdodCk7XG5cbiAgICBsZXQgY3ggPSB0aGlzLl9yZWN0LnggKiB3aWR0aDtcbiAgICBsZXQgY3kgPSB0aGlzLl9yZWN0LnkgKiBoZWlnaHQ7XG4gICAgbGV0IGN3ID0gdGhpcy5fcmVjdC53ICogd2lkdGg7XG4gICAgbGV0IGNoID0gdGhpcy5fcmVjdC5oICogaGVpZ2h0O1xuXG4gICAgVmVjMy50cmFuc2Zvcm1NYXQ0KG91dCwgd29ybGRQb3MsIF9tYXRWaWV3UHJvaik7XG4gICAgb3V0LnggPSBjeCArIChvdXQueCArIDEpICogMC41ICogY3c7XG4gICAgb3V0LnkgPSBjeSArIChvdXQueSArIDEpICogMC41ICogY2g7XG4gICAgb3V0LnogPSBvdXQueiAqIDAuNSArIDAuNTtcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICAvKipcbiAgICogdHJhbnNmb3JtIGEgd29ybGQgc3BhY2UgbWF0cml4IHRvIHNjcmVlbiBzcGFjZVxuICAgKiBAcGFyYW0ge01hdDR9IG91dCB0aGUgcmVzdWx0aW5nIHZlY3RvclxuICAgKiBAcGFyYW0ge01hdDR9IHdvcmxkTWF0cml4IHRoZSB3b3JsZCBzcGFjZSBtYXRyaXggdG8gYmUgdHJhbnNmb3JtZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIGZyYW1lYnVmZmVyIHdpZHRoXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgZnJhbWVidWZmZXIgaGVpZ2h0XG4gICAqIEByZXR1cm5zIHtNYXQ0fSB0aGUgcmVzdWx0aW5nIHZlY3RvclxuICAgKi9cbiAgd29ybGRNYXRyaXhUb1NjcmVlbiAob3V0LCB3b3JsZE1hdHJpeCwgd2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMuX2NhbGNNYXRyaWNlcyh3aWR0aCwgaGVpZ2h0KTtcblxuICAgIE1hdDQubXVsKG91dCwgX21hdFZpZXdQcm9qLCB3b3JsZE1hdHJpeCk7XG5cbiAgICBsZXQgaGFsZldpZHRoID0gd2lkdGggLyAyO1xuICAgIGxldCBoYWxmSGVpZ2h0ID0gaGVpZ2h0IC8gMjtcbiAgICBNYXQ0LmlkZW50aXR5KF90bXBfbWF0NCk7XG4gICAgTWF0NC50cmFuc2Zvcm0oX3RtcF9tYXQ0LCBfdG1wX21hdDQsIFZlYzMuc2V0KF90bXBfdjMsIGhhbGZXaWR0aCwgaGFsZkhlaWdodCwgMCkpO1xuICAgIE1hdDQuc2NhbGUoX3RtcF9tYXQ0LCBfdG1wX21hdDQsIFZlYzMuc2V0KF90bXBfdjMsIGhhbGZXaWR0aCwgaGFsZkhlaWdodCwgMSkpO1xuXG4gICAgTWF0NC5tdWwob3V0LCBfdG1wX21hdDQsIG91dCk7XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG59XG4iXX0=