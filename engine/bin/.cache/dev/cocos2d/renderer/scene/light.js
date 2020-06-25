
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/scene/light.js';
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

var _gfx = _interopRequireDefault(require("../gfx"));

var _enums = _interopRequireDefault(require("../enums"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _forward = cc.v3(0, 0, -1);

var _m4_tmp = cc.mat4();

var _m3_tmp = _valueTypes.Mat3.create();

var _transformedLightDirection = cc.v3(0, 0, 0); // compute light viewProjMat for shadow.


function _computeSpotLightViewProjMatrix(light, outView, outProj) {
  // view matrix
  light._node.getWorldRT(outView);

  _valueTypes.Mat4.invert(outView, outView); // proj matrix


  _valueTypes.Mat4.perspective(outProj, light._spotAngle * light._spotAngleScale, 1, light._shadowMinDepth, light._shadowMaxDepth);
}

function _computeDirectionalLightViewProjMatrix(light, outView, outProj) {
  // view matrix
  light._node.getWorldRT(outView);

  _valueTypes.Mat4.invert(outView, outView); // TODO: should compute directional light frustum based on rendered meshes in scene.
  // proj matrix


  var halfSize = light._shadowFrustumSize / 2;

  _valueTypes.Mat4.ortho(outProj, -halfSize, halfSize, -halfSize, halfSize, light._shadowMinDepth, light._shadowMaxDepth);
}

function _computePointLightViewProjMatrix(light, outView, outProj) {
  // view matrix
  light._node.getWorldRT(outView);

  _valueTypes.Mat4.invert(outView, outView); // The transformation from Cartesian to polar coordinates is not a linear function,
  // so it cannot be achieved by means of a fixed matrix multiplication.
  // Here we just use a nearly 180 degree perspective matrix instead.


  _valueTypes.Mat4.perspective(outProj, (0, _valueTypes.toRadian)(179), 1, light._shadowMinDepth, light._shadowMaxDepth);
}
/**
 * A representation of a light source.
 * Could be a point light, a spot light or a directional light.
 */


var Light =
/*#__PURE__*/
function () {
  /**
   * Setup a default directional light with no shadows
   */
  function Light() {
    this._poolID = -1;
    this._node = null;
    this._type = _enums["default"].LIGHT_DIRECTIONAL;
    this._color = new _valueTypes.Vec3(1, 1, 1);
    this._intensity = 1; // used for spot and point light

    this._range = 1; // used for spot light, default to 60 degrees

    this._spotAngle = (0, _valueTypes.toRadian)(60);
    this._spotExp = 1; // cached for uniform

    this._directionUniform = new Float32Array(3);
    this._positionUniform = new Float32Array(3);
    this._colorUniform = new Float32Array([this._color.x * this._intensity, this._color.y * this._intensity, this._color.z * this._intensity]);
    this._spotUniform = new Float32Array([Math.cos(this._spotAngle * 0.5), this._spotExp]); // shadow params

    this._shadowType = _enums["default"].SHADOW_NONE;
    this._shadowFrameBuffer = null;
    this._shadowMap = null;
    this._shadowMapDirty = false;
    this._shadowDepthBuffer = null;
    this._shadowResolution = 1024;
    this._shadowBias = 0.0005;
    this._shadowDarkness = 1;
    this._shadowMinDepth = 1;
    this._shadowMaxDepth = 1000;
    this._shadowDepthScale = 50; // maybe need to change it if the distance between shadowMaxDepth and shadowMinDepth is small.

    this._frustumEdgeFalloff = 0; // used by directional and spot light.

    this._viewProjMatrix = cc.mat4();
    this._spotAngleScale = 1; // used for spot light.

    this._shadowFrustumSize = 50; // used for directional light.
  }
  /**
   * Get the hosting node of this camera
   * @returns {Node} the hosting node
   */


  var _proto = Light.prototype;

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
   * set the color of the light source
   * @param {number} r red channel of the light color
   * @param {number} g green channel of the light color
   * @param {number} b blue channel of the light color
   */
  ;

  _proto.setColor = function setColor(r, g, b) {
    _valueTypes.Vec3.set(this._color, r, g, b);

    this._colorUniform[0] = r * this._intensity;
    this._colorUniform[1] = g * this._intensity;
    this._colorUniform[2] = b * this._intensity;
  }
  /**
   * get the color of the light source
   * @returns {Vec3} the light color
   */
  ;

  /**
   * set the intensity of the light source
   * @param {number} val the light intensity
   */
  _proto.setIntensity = function setIntensity(val) {
    this._intensity = val;
    this._colorUniform[0] = val * this._color.x;
    this._colorUniform[1] = val * this._color.y;
    this._colorUniform[2] = val * this._color.z;
  }
  /**
   * get the intensity of the light source
   * @returns {number} the light intensity
   */
  ;

  /**
   * set the type of the light source
   * @param {number} type light source type
   */
  _proto.setType = function setType(type) {
    this._type = type;
  }
  /**
   * get the type of the light source
   * @returns {number} light source type
   */
  ;

  /**
   * set the spot light angle
   * @param {number} val spot light angle
   */
  _proto.setSpotAngle = function setSpotAngle(val) {
    this._spotAngle = val;
    this._spotUniform[0] = Math.cos(this._spotAngle * 0.5);
  }
  /**
   * get the spot light angle
   * @returns {number} spot light angle
   */
  ;

  /**
   * set the spot light exponential
   * @param {number} val spot light exponential
   */
  _proto.setSpotExp = function setSpotExp(val) {
    this._spotExp = val;
    this._spotUniform[1] = val;
  }
  /**
   * get the spot light exponential
   * @returns {number} spot light exponential
   */
  ;

  /**
   * set the range of the light source
   * @param {number} val light source range
   */
  _proto.setRange = function setRange(val) {
    this._range = val;
  }
  /**
   * get the range of the light source
   * @returns {number} range of the light source
   */
  ;

  /**
   * set the shadow type of the light source
   * @param {number} type light source shadow type
   */
  _proto.setShadowType = function setShadowType(type) {
    if (this._shadowType === _enums["default"].SHADOW_NONE && type !== _enums["default"].SHADOW_NONE) {
      this._shadowMapDirty = true;
    }

    this._shadowType = type;
  }
  /**
   * get the shadow type of the light source
   * @returns {number} light source shadow type
   */
  ;

  /**
   * set the shadow resolution of the light source
   * @param {number} val light source shadow resolution
   */
  _proto.setShadowResolution = function setShadowResolution(val) {
    if (this._shadowResolution !== val) {
      this._shadowMapDirty = true;
    }

    this._shadowResolution = val;
  }
  /**
   * get the shadow resolution of the light source
   * @returns {number} light source shadow resolution
   */
  ;

  /**
   * set the shadow bias of the light source
   * @param {number} val light source shadow bias
   */
  _proto.setShadowBias = function setShadowBias(val) {
    this._shadowBias = val;
  }
  /**
   * get the shadow bias of the light source
   * @returns {number} light source shadow bias
   */
  ;

  /**
   * set the shadow darkness of the light source
   * @param {number} val light source shadow darkness
   */
  _proto.setShadowDarkness = function setShadowDarkness(val) {
    this._shadowDarkness = val;
  }
  /**
   * get the shadow darkness of the light source
   * @returns {number} light source shadow darkness
   */
  ;

  /**
   * set the shadow min depth of the light source
   * @param {number} val light source shadow min depth
   */
  _proto.setShadowMinDepth = function setShadowMinDepth(val) {
    this._shadowMinDepth = val;
  }
  /**
   * get the shadow min depth of the light source
   * @returns {number} light source shadow min depth
   */
  ;

  /**
   * set the shadow max depth of the light source
   * @param {number} val light source shadow max depth
   */
  _proto.setShadowMaxDepth = function setShadowMaxDepth(val) {
    this._shadowMaxDepth = val;
  }
  /**
   * get the shadow max depth of the light source
   * @returns {number} light source shadow max depth
   */
  ;

  /**
   * set the shadow depth scale of the light source
   * @param {number} val light source shadow depth scale
   */
  _proto.setShadowDepthScale = function setShadowDepthScale(val) {
    this._shadowDepthScale = val;
  }
  /**
   * get the shadow depth scale of the light source
   * @returns {number} light source shadow depth scale
   */
  ;

  /**
   * set the frustum edge falloff of the light source
   * @param {number} val light source frustum edge falloff
   */
  _proto.setFrustumEdgeFalloff = function setFrustumEdgeFalloff(val) {
    this._frustumEdgeFalloff = val;
  }
  /**
   * get the frustum edge falloff of the light source
   * @returns {number} light source frustum edge falloff
   */
  ;

  /**
   * set the shadow frustum size of the light source
   * @param {number} val light source shadow frustum size
   */
  _proto.setShadowFrustumSize = function setShadowFrustumSize(val) {
    this._shadowFrustumSize = val;
  }
  /**
   * get the shadow frustum size of the light source
   * @returns {number} light source shadow frustum size
   */
  ;

  /**
   * extract a view of this light source
   * @param {View} out the receiving view
   * @param {string[]} stages the stages using the view
   */
  _proto.extractView = function extractView(out, stages) {
    // TODO: view should not handle light.
    out._shadowLight = this; // priority. TODO: use varying value for shadow view?

    out._priority = -1; // rect

    out._rect.x = 0;
    out._rect.y = 0;
    out._rect.w = this._shadowResolution;
    out._rect.h = this._shadowResolution; // clear opts

    _valueTypes.Vec3.set(out._color, 1, 1, 1);

    out._depth = 1;
    out._stencil = 1;
    out._clearFlags = _enums["default"].CLEAR_COLOR | _enums["default"].CLEAR_DEPTH; // stages & framebuffer

    out._stages = stages;
    out._framebuffer = this._shadowFrameBuffer; // view projection matrix

    switch (this._type) {
      case _enums["default"].LIGHT_SPOT:
        _computeSpotLightViewProjMatrix(this, out._matView, out._matProj);

        break;

      case _enums["default"].LIGHT_DIRECTIONAL:
        _computeDirectionalLightViewProjMatrix(this, out._matView, out._matProj);

        break;

      case _enums["default"].LIGHT_POINT:
        _computePointLightViewProjMatrix(this, out._matView, out._matProj);

        break;

      case _enums["default"].LIGHT_AMBIENT:
        break;

      default:
        console.warn('shadow of this light type is not supported');
    } // view-projection


    _valueTypes.Mat4.mul(out._matViewProj, out._matProj, out._matView);

    this._viewProjMatrix = out._matViewProj;

    _valueTypes.Mat4.invert(out._matInvViewProj, out._matViewProj); // update view's frustum
    // out._frustum.update(out._matViewProj, out._matInvViewProj);


    out._cullingMask = 0xffffffff;
  };

  _proto._updateLightPositionAndDirection = function _updateLightPositionAndDirection() {
    this._node.getWorldMatrix(_m4_tmp);

    _valueTypes.Mat3.fromMat4(_m3_tmp, _m4_tmp);

    _valueTypes.Vec3.transformMat3(_transformedLightDirection, _forward, _m3_tmp);

    _valueTypes.Vec3.toArray(this._directionUniform, _transformedLightDirection);

    var pos = this._positionUniform;
    var m = _m4_tmp.m;
    pos[0] = m[12];
    pos[1] = m[13];
    pos[2] = m[14];
  };

  _proto._generateShadowMap = function _generateShadowMap(device) {
    this._shadowMap = new _gfx["default"].Texture2D(device, {
      width: this._shadowResolution,
      height: this._shadowResolution,
      format: _gfx["default"].TEXTURE_FMT_RGBA8,
      wrapS: _gfx["default"].WRAP_CLAMP,
      wrapT: _gfx["default"].WRAP_CLAMP
    });
    this._shadowDepthBuffer = new _gfx["default"].RenderBuffer(device, _gfx["default"].RB_FMT_D16, this._shadowResolution, this._shadowResolution);
    this._shadowFrameBuffer = new _gfx["default"].FrameBuffer(device, this._shadowResolution, this._shadowResolution, {
      colors: [this._shadowMap],
      depth: this._shadowDepthBuffer
    });
  };

  _proto._destroyShadowMap = function _destroyShadowMap() {
    if (this._shadowMap) {
      this._shadowMap.destroy();

      this._shadowDepthBuffer.destroy();

      this._shadowFrameBuffer.destroy();

      this._shadowMap = null;
      this._shadowDepthBuffer = null;
      this._shadowFrameBuffer = null;
    }
  }
  /**
   * update the light source
   * @param {Device} device the rendering device
   */
  ;

  _proto.update = function update(device) {
    this._updateLightPositionAndDirection();

    if (this._shadowType === _enums["default"].SHADOW_NONE) {
      this._destroyShadowMap();
    } else if (this._shadowMapDirty) {
      this._destroyShadowMap();

      this._generateShadowMap(device);

      this._shadowMapDirty = false;
    }
  };

  _createClass(Light, [{
    key: "color",
    get: function get() {
      return this._color;
    }
  }, {
    key: "intensity",
    get: function get() {
      return this._intensity;
    }
  }, {
    key: "type",
    get: function get() {
      return this._type;
    }
  }, {
    key: "spotAngle",
    get: function get() {
      return this._spotAngle;
    }
  }, {
    key: "spotExp",
    get: function get() {
      return this._spotExp;
    }
  }, {
    key: "range",
    get: function get() {
      return this._range;
    }
  }, {
    key: "shadowType",
    get: function get() {
      return this._shadowType;
    }
    /**
     * get the shadowmap of the light source
     * @returns {Texture2D} light source shadowmap
     */

  }, {
    key: "shadowMap",
    get: function get() {
      return this._shadowMap;
    }
    /**
     * get the view-projection matrix of the light source
     * @returns {Mat4} light source view-projection matrix
     */

  }, {
    key: "viewProjMatrix",
    get: function get() {
      return this._viewProjMatrix;
    }
  }, {
    key: "shadowResolution",
    get: function get() {
      return this._shadowResolution;
    }
  }, {
    key: "shadowBias",
    get: function get() {
      return this._shadowBias;
    }
  }, {
    key: "shadowDarkness",
    get: function get() {
      return this._shadowDarkness;
    }
  }, {
    key: "shadowMinDepth",
    get: function get() {
      if (this._type === _enums["default"].LIGHT_DIRECTIONAL) {
        return 1.0;
      }

      return this._shadowMinDepth;
    }
  }, {
    key: "shadowMaxDepth",
    get: function get() {
      if (this._type === _enums["default"].LIGHT_DIRECTIONAL) {
        return 1.0;
      }

      return this._shadowMaxDepth;
    }
  }, {
    key: "shadowDepthScale",
    get: function get() {
      return this._shadowDepthScale;
    }
  }, {
    key: "frustumEdgeFalloff",
    get: function get() {
      return this._frustumEdgeFalloff;
    }
  }, {
    key: "shadowFrustumSize",
    get: function get() {
      return this._shadowFrustumSize;
    }
  }]);

  return Light;
}();

exports["default"] = Light;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpZ2h0LmpzIl0sIm5hbWVzIjpbIl9mb3J3YXJkIiwiY2MiLCJ2MyIsIl9tNF90bXAiLCJtYXQ0IiwiX20zX3RtcCIsIk1hdDMiLCJjcmVhdGUiLCJfdHJhbnNmb3JtZWRMaWdodERpcmVjdGlvbiIsIl9jb21wdXRlU3BvdExpZ2h0Vmlld1Byb2pNYXRyaXgiLCJsaWdodCIsIm91dFZpZXciLCJvdXRQcm9qIiwiX25vZGUiLCJnZXRXb3JsZFJUIiwiTWF0NCIsImludmVydCIsInBlcnNwZWN0aXZlIiwiX3Nwb3RBbmdsZSIsIl9zcG90QW5nbGVTY2FsZSIsIl9zaGFkb3dNaW5EZXB0aCIsIl9zaGFkb3dNYXhEZXB0aCIsIl9jb21wdXRlRGlyZWN0aW9uYWxMaWdodFZpZXdQcm9qTWF0cml4IiwiaGFsZlNpemUiLCJfc2hhZG93RnJ1c3R1bVNpemUiLCJvcnRobyIsIl9jb21wdXRlUG9pbnRMaWdodFZpZXdQcm9qTWF0cml4IiwiTGlnaHQiLCJfcG9vbElEIiwiX3R5cGUiLCJlbnVtcyIsIkxJR0hUX0RJUkVDVElPTkFMIiwiX2NvbG9yIiwiVmVjMyIsIl9pbnRlbnNpdHkiLCJfcmFuZ2UiLCJfc3BvdEV4cCIsIl9kaXJlY3Rpb25Vbmlmb3JtIiwiRmxvYXQzMkFycmF5IiwiX3Bvc2l0aW9uVW5pZm9ybSIsIl9jb2xvclVuaWZvcm0iLCJ4IiwieSIsInoiLCJfc3BvdFVuaWZvcm0iLCJNYXRoIiwiY29zIiwiX3NoYWRvd1R5cGUiLCJTSEFET1dfTk9ORSIsIl9zaGFkb3dGcmFtZUJ1ZmZlciIsIl9zaGFkb3dNYXAiLCJfc2hhZG93TWFwRGlydHkiLCJfc2hhZG93RGVwdGhCdWZmZXIiLCJfc2hhZG93UmVzb2x1dGlvbiIsIl9zaGFkb3dCaWFzIiwiX3NoYWRvd0RhcmtuZXNzIiwiX3NoYWRvd0RlcHRoU2NhbGUiLCJfZnJ1c3R1bUVkZ2VGYWxsb2ZmIiwiX3ZpZXdQcm9qTWF0cml4IiwiZ2V0Tm9kZSIsInNldE5vZGUiLCJub2RlIiwic2V0Q29sb3IiLCJyIiwiZyIsImIiLCJzZXQiLCJzZXRJbnRlbnNpdHkiLCJ2YWwiLCJzZXRUeXBlIiwidHlwZSIsInNldFNwb3RBbmdsZSIsInNldFNwb3RFeHAiLCJzZXRSYW5nZSIsInNldFNoYWRvd1R5cGUiLCJzZXRTaGFkb3dSZXNvbHV0aW9uIiwic2V0U2hhZG93QmlhcyIsInNldFNoYWRvd0RhcmtuZXNzIiwic2V0U2hhZG93TWluRGVwdGgiLCJzZXRTaGFkb3dNYXhEZXB0aCIsInNldFNoYWRvd0RlcHRoU2NhbGUiLCJzZXRGcnVzdHVtRWRnZUZhbGxvZmYiLCJzZXRTaGFkb3dGcnVzdHVtU2l6ZSIsImV4dHJhY3RWaWV3Iiwib3V0Iiwic3RhZ2VzIiwiX3NoYWRvd0xpZ2h0IiwiX3ByaW9yaXR5IiwiX3JlY3QiLCJ3IiwiaCIsIl9kZXB0aCIsIl9zdGVuY2lsIiwiX2NsZWFyRmxhZ3MiLCJDTEVBUl9DT0xPUiIsIkNMRUFSX0RFUFRIIiwiX3N0YWdlcyIsIl9mcmFtZWJ1ZmZlciIsIkxJR0hUX1NQT1QiLCJfbWF0VmlldyIsIl9tYXRQcm9qIiwiTElHSFRfUE9JTlQiLCJMSUdIVF9BTUJJRU5UIiwiY29uc29sZSIsIndhcm4iLCJtdWwiLCJfbWF0Vmlld1Byb2oiLCJfbWF0SW52Vmlld1Byb2oiLCJfY3VsbGluZ01hc2siLCJfdXBkYXRlTGlnaHRQb3NpdGlvbkFuZERpcmVjdGlvbiIsImdldFdvcmxkTWF0cml4IiwiZnJvbU1hdDQiLCJ0cmFuc2Zvcm1NYXQzIiwidG9BcnJheSIsInBvcyIsIm0iLCJfZ2VuZXJhdGVTaGFkb3dNYXAiLCJkZXZpY2UiLCJnZngiLCJUZXh0dXJlMkQiLCJ3aWR0aCIsImhlaWdodCIsImZvcm1hdCIsIlRFWFRVUkVfRk1UX1JHQkE4Iiwid3JhcFMiLCJXUkFQX0NMQU1QIiwid3JhcFQiLCJSZW5kZXJCdWZmZXIiLCJSQl9GTVRfRDE2IiwiRnJhbWVCdWZmZXIiLCJjb2xvcnMiLCJkZXB0aCIsIl9kZXN0cm95U2hhZG93TWFwIiwiZGVzdHJveSIsInVwZGF0ZSJdLCJtYXBwaW5n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QjtBQUNmLGFBQU8sS0FBS1ksV0FBWjtBQUNEO0FBRUQ7Ozs7Ozs7d0JBSWdCO0FBQ2QsYUFBTyxLQUFLRyxVQUFaO0FBQ0Q7QUFFRDs7Ozs7Ozt3QkFJcUI7QUFDbkIsYUFBTyxLQUFLUSxlQUFaO0FBQ0Q7Ozt3QkFpQnNCO0FBQ3JCLGFBQU8sS0FBS0wsaUJBQVo7QUFDRDs7O3dCQWNnQjtBQUNmLGFBQU8sS0FBS0MsV0FBWjtBQUNEOzs7d0JBY29CO0FBQ25CLGFBQU8sS0FBS0MsZUFBWjtBQUNEOzs7d0JBY29CO0FBQ25CLFVBQUksS0FBSzFCLEtBQUwsS0FBZUMsa0JBQU1DLGlCQUF6QixFQUE0QztBQUMxQyxlQUFPLEdBQVA7QUFDRDs7QUFDRCxhQUFPLEtBQUtYLGVBQVo7QUFDRDs7O3dCQWNvQjtBQUNuQixVQUFJLEtBQUtTLEtBQUwsS0FBZUMsa0JBQU1DLGlCQUF6QixFQUE0QztBQUMxQyxlQUFPLEdBQVA7QUFDRDs7QUFDRCxhQUFPLEtBQUtWLGVBQVo7QUFDRDs7O3dCQWNzQjtBQUNyQixhQUFPLEtBQUttQyxpQkFBWjtBQUNEOzs7d0JBY3dCO0FBQ3ZCLGFBQU8sS0FBS0MsbUJBQVo7QUFDRDs7O3dCQWN1QjtBQUN0QixhQUFPLEtBQUtqQyxrQkFBWjtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbmltcG9ydCB7IE1hdDQsIE1hdDMsIFZlYzMsIHRvUmFkaWFuIH0gZnJvbSAnLi4vLi4vY29yZS92YWx1ZS10eXBlcyc7XG5pbXBvcnQgZ2Z4IGZyb20gJy4uL2dmeCc7XG5cbmltcG9ydCBlbnVtcyBmcm9tICcuLi9lbnVtcyc7XG5cbmNvbnN0IF9mb3J3YXJkID0gY2MudjMoMCwgMCwgLTEpO1xuXG5sZXQgX200X3RtcCA9IGNjLm1hdDQoKTtcbmxldCBfbTNfdG1wID0gTWF0My5jcmVhdGUoKTtcbmxldCBfdHJhbnNmb3JtZWRMaWdodERpcmVjdGlvbiA9IGNjLnYzKDAsIDAsIDApO1xuXG4vLyBjb21wdXRlIGxpZ2h0IHZpZXdQcm9qTWF0IGZvciBzaGFkb3cuXG5mdW5jdGlvbiBfY29tcHV0ZVNwb3RMaWdodFZpZXdQcm9qTWF0cml4KGxpZ2h0LCBvdXRWaWV3LCBvdXRQcm9qKSB7XG4gIC8vIHZpZXcgbWF0cml4XG4gIGxpZ2h0Ll9ub2RlLmdldFdvcmxkUlQob3V0Vmlldyk7XG4gIE1hdDQuaW52ZXJ0KG91dFZpZXcsIG91dFZpZXcpO1xuXG4gIC8vIHByb2ogbWF0cml4XG4gIE1hdDQucGVyc3BlY3RpdmUob3V0UHJvaiwgbGlnaHQuX3Nwb3RBbmdsZSAqIGxpZ2h0Ll9zcG90QW5nbGVTY2FsZSwgMSwgbGlnaHQuX3NoYWRvd01pbkRlcHRoLCBsaWdodC5fc2hhZG93TWF4RGVwdGgpO1xufVxuXG5mdW5jdGlvbiBfY29tcHV0ZURpcmVjdGlvbmFsTGlnaHRWaWV3UHJvak1hdHJpeChsaWdodCwgb3V0Vmlldywgb3V0UHJvaikge1xuICAvLyB2aWV3IG1hdHJpeFxuICBsaWdodC5fbm9kZS5nZXRXb3JsZFJUKG91dFZpZXcpO1xuICBNYXQ0LmludmVydChvdXRWaWV3LCBvdXRWaWV3KTtcblxuICAvLyBUT0RPOiBzaG91bGQgY29tcHV0ZSBkaXJlY3Rpb25hbCBsaWdodCBmcnVzdHVtIGJhc2VkIG9uIHJlbmRlcmVkIG1lc2hlcyBpbiBzY2VuZS5cbiAgLy8gcHJvaiBtYXRyaXhcbiAgbGV0IGhhbGZTaXplID0gbGlnaHQuX3NoYWRvd0ZydXN0dW1TaXplIC8gMjtcbiAgTWF0NC5vcnRobyhvdXRQcm9qLCAtaGFsZlNpemUsIGhhbGZTaXplLCAtaGFsZlNpemUsIGhhbGZTaXplLCBsaWdodC5fc2hhZG93TWluRGVwdGgsIGxpZ2h0Ll9zaGFkb3dNYXhEZXB0aCk7XG59XG5cbmZ1bmN0aW9uIF9jb21wdXRlUG9pbnRMaWdodFZpZXdQcm9qTWF0cml4KGxpZ2h0LCBvdXRWaWV3LCBvdXRQcm9qKSB7XG4gIC8vIHZpZXcgbWF0cml4XG4gIGxpZ2h0Ll9ub2RlLmdldFdvcmxkUlQob3V0Vmlldyk7XG4gIE1hdDQuaW52ZXJ0KG91dFZpZXcsIG91dFZpZXcpO1xuXG4gIC8vIFRoZSB0cmFuc2Zvcm1hdGlvbiBmcm9tIENhcnRlc2lhbiB0byBwb2xhciBjb29yZGluYXRlcyBpcyBub3QgYSBsaW5lYXIgZnVuY3Rpb24sXG4gIC8vIHNvIGl0IGNhbm5vdCBiZSBhY2hpZXZlZCBieSBtZWFucyBvZiBhIGZpeGVkIG1hdHJpeCBtdWx0aXBsaWNhdGlvbi5cbiAgLy8gSGVyZSB3ZSBqdXN0IHVzZSBhIG5lYXJseSAxODAgZGVncmVlIHBlcnNwZWN0aXZlIG1hdHJpeCBpbnN0ZWFkLlxuICBNYXQ0LnBlcnNwZWN0aXZlKG91dFByb2osIHRvUmFkaWFuKDE3OSksIDEsIGxpZ2h0Ll9zaGFkb3dNaW5EZXB0aCwgbGlnaHQuX3NoYWRvd01heERlcHRoKTtcbn1cblxuLyoqXG4gKiBBIHJlcHJlc2VudGF0aW9uIG9mIGEgbGlnaHQgc291cmNlLlxuICogQ291bGQgYmUgYSBwb2ludCBsaWdodCwgYSBzcG90IGxpZ2h0IG9yIGEgZGlyZWN0aW9uYWwgbGlnaHQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpZ2h0IHtcbiAgLyoqXG4gICAqIFNldHVwIGEgZGVmYXVsdCBkaXJlY3Rpb25hbCBsaWdodCB3aXRoIG5vIHNoYWRvd3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3Bvb2xJRCA9IC0xO1xuICAgIHRoaXMuX25vZGUgPSBudWxsO1xuXG4gICAgdGhpcy5fdHlwZSA9IGVudW1zLkxJR0hUX0RJUkVDVElPTkFMO1xuXG4gICAgdGhpcy5fY29sb3IgPSBuZXcgVmVjMygxLCAxLCAxKTtcbiAgICB0aGlzLl9pbnRlbnNpdHkgPSAxO1xuXG4gICAgLy8gdXNlZCBmb3Igc3BvdCBhbmQgcG9pbnQgbGlnaHRcbiAgICB0aGlzLl9yYW5nZSA9IDE7XG4gICAgLy8gdXNlZCBmb3Igc3BvdCBsaWdodCwgZGVmYXVsdCB0byA2MCBkZWdyZWVzXG4gICAgdGhpcy5fc3BvdEFuZ2xlID0gdG9SYWRpYW4oNjApO1xuICAgIHRoaXMuX3Nwb3RFeHAgPSAxO1xuICAgIC8vIGNhY2hlZCBmb3IgdW5pZm9ybVxuICAgIHRoaXMuX2RpcmVjdGlvblVuaWZvcm0gPSBuZXcgRmxvYXQzMkFycmF5KDMpO1xuICAgIHRoaXMuX3Bvc2l0aW9uVW5pZm9ybSA9IG5ldyBGbG9hdDMyQXJyYXkoMyk7XG4gICAgdGhpcy5fY29sb3JVbmlmb3JtID0gbmV3IEZsb2F0MzJBcnJheShbdGhpcy5fY29sb3IueCAqIHRoaXMuX2ludGVuc2l0eSwgdGhpcy5fY29sb3IueSAqIHRoaXMuX2ludGVuc2l0eSwgdGhpcy5fY29sb3IueiAqIHRoaXMuX2ludGVuc2l0eV0pO1xuICAgIHRoaXMuX3Nwb3RVbmlmb3JtID0gbmV3IEZsb2F0MzJBcnJheShbTWF0aC5jb3ModGhpcy5fc3BvdEFuZ2xlICogMC41KSwgdGhpcy5fc3BvdEV4cF0pO1xuXG4gICAgLy8gc2hhZG93IHBhcmFtc1xuICAgIHRoaXMuX3NoYWRvd1R5cGUgPSBlbnVtcy5TSEFET1dfTk9ORTtcbiAgICB0aGlzLl9zaGFkb3dGcmFtZUJ1ZmZlciA9IG51bGw7XG4gICAgdGhpcy5fc2hhZG93TWFwID0gbnVsbDtcbiAgICB0aGlzLl9zaGFkb3dNYXBEaXJ0eSA9IGZhbHNlO1xuICAgIHRoaXMuX3NoYWRvd0RlcHRoQnVmZmVyID0gbnVsbDtcbiAgICB0aGlzLl9zaGFkb3dSZXNvbHV0aW9uID0gMTAyNDtcbiAgICB0aGlzLl9zaGFkb3dCaWFzID0gMC4wMDA1O1xuICAgIHRoaXMuX3NoYWRvd0RhcmtuZXNzID0gMTtcbiAgICB0aGlzLl9zaGFkb3dNaW5EZXB0aCA9IDE7XG4gICAgdGhpcy5fc2hhZG93TWF4RGVwdGggPSAxMDAwO1xuICAgIHRoaXMuX3NoYWRvd0RlcHRoU2NhbGUgPSA1MDsgLy8gbWF5YmUgbmVlZCB0byBjaGFuZ2UgaXQgaWYgdGhlIGRpc3RhbmNlIGJldHdlZW4gc2hhZG93TWF4RGVwdGggYW5kIHNoYWRvd01pbkRlcHRoIGlzIHNtYWxsLlxuICAgIHRoaXMuX2ZydXN0dW1FZGdlRmFsbG9mZiA9IDA7IC8vIHVzZWQgYnkgZGlyZWN0aW9uYWwgYW5kIHNwb3QgbGlnaHQuXG4gICAgdGhpcy5fdmlld1Byb2pNYXRyaXggPSBjYy5tYXQ0KCk7XG4gICAgdGhpcy5fc3BvdEFuZ2xlU2NhbGUgPSAxOyAvLyB1c2VkIGZvciBzcG90IGxpZ2h0LlxuICAgIHRoaXMuX3NoYWRvd0ZydXN0dW1TaXplID0gNTA7IC8vIHVzZWQgZm9yIGRpcmVjdGlvbmFsIGxpZ2h0LlxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgaG9zdGluZyBub2RlIG9mIHRoaXMgY2FtZXJhXG4gICAqIEByZXR1cm5zIHtOb2RlfSB0aGUgaG9zdGluZyBub2RlXG4gICAqL1xuICBnZXROb2RlKCkge1xuICAgIHJldHVybiB0aGlzLl9ub2RlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgaG9zdGluZyBub2RlIG9mIHRoaXMgY2FtZXJhXG4gICAqIEBwYXJhbSB7Tm9kZX0gbm9kZSB0aGUgaG9zdGluZyBub2RlXG4gICAqL1xuICBzZXROb2RlKG5vZGUpIHtcbiAgICB0aGlzLl9ub2RlID0gbm9kZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBzZXQgdGhlIGNvbG9yIG9mIHRoZSBsaWdodCBzb3VyY2VcbiAgICogQHBhcmFtIHtudW1iZXJ9IHIgcmVkIGNoYW5uZWwgb2YgdGhlIGxpZ2h0IGNvbG9yXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBnIGdyZWVuIGNoYW5uZWwgb2YgdGhlIGxpZ2h0IGNvbG9yXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBiIGJsdWUgY2hhbm5lbCBvZiB0aGUgbGlnaHQgY29sb3JcbiAgICovXG4gIHNldENvbG9yKHIsIGcsIGIpIHtcbiAgICBWZWMzLnNldCh0aGlzLl9jb2xvciwgciwgZywgYik7XG4gICAgdGhpcy5fY29sb3JVbmlmb3JtWzBdID0gciAqIHRoaXMuX2ludGVuc2l0eTtcbiAgICB0aGlzLl9jb2xvclVuaWZvcm1bMV0gPSBnICogdGhpcy5faW50ZW5zaXR5O1xuICAgIHRoaXMuX2NvbG9yVW5pZm9ybVsyXSA9IGIgKiB0aGlzLl9pbnRlbnNpdHk7XG4gIH1cblxuICAvKipcbiAgICogZ2V0IHRoZSBjb2xvciBvZiB0aGUgbGlnaHQgc291cmNlXG4gICAqIEByZXR1cm5zIHtWZWMzfSB0aGUgbGlnaHQgY29sb3JcbiAgICovXG4gIGdldCBjb2xvcigpIHtcbiAgICByZXR1cm4gdGhpcy5fY29sb3I7XG4gIH1cblxuICAvKipcbiAgICogc2V0IHRoZSBpbnRlbnNpdHkgb2YgdGhlIGxpZ2h0IHNvdXJjZVxuICAgKiBAcGFyYW0ge251bWJlcn0gdmFsIHRoZSBsaWdodCBpbnRlbnNpdHlcbiAgICovXG4gIHNldEludGVuc2l0eSh2YWwpIHtcbiAgICB0aGlzLl9pbnRlbnNpdHkgPSB2YWw7XG4gICAgdGhpcy5fY29sb3JVbmlmb3JtWzBdID0gdmFsICogdGhpcy5fY29sb3IueDtcbiAgICB0aGlzLl9jb2xvclVuaWZvcm1bMV0gPSB2YWwgKiB0aGlzLl9jb2xvci55O1xuICAgIHRoaXMuX2NvbG9yVW5pZm9ybVsyXSA9IHZhbCAqIHRoaXMuX2NvbG9yLno7XG4gIH1cblxuICAvKipcbiAgICogZ2V0IHRoZSBpbnRlbnNpdHkgb2YgdGhlIGxpZ2h0IHNvdXJjZVxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgbGlnaHQgaW50ZW5zaXR5XG4gICAqL1xuICBnZXQgaW50ZW5zaXR5KCkge1xuICAgIHJldHVybiB0aGlzLl9pbnRlbnNpdHk7XG4gIH1cblxuICAvKipcbiAgICogc2V0IHRoZSB0eXBlIG9mIHRoZSBsaWdodCBzb3VyY2VcbiAgICogQHBhcmFtIHtudW1iZXJ9IHR5cGUgbGlnaHQgc291cmNlIHR5cGVcbiAgICovXG4gIHNldFR5cGUodHlwZSkge1xuICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xuICB9XG5cbiAgLyoqXG4gICAqIGdldCB0aGUgdHlwZSBvZiB0aGUgbGlnaHQgc291cmNlXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGxpZ2h0IHNvdXJjZSB0eXBlXG4gICAqL1xuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fdHlwZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBzZXQgdGhlIHNwb3QgbGlnaHQgYW5nbGVcbiAgICogQHBhcmFtIHtudW1iZXJ9IHZhbCBzcG90IGxpZ2h0IGFuZ2xlXG4gICAqL1xuICBzZXRTcG90QW5nbGUodmFsKSB7XG4gICAgdGhpcy5fc3BvdEFuZ2xlID0gdmFsO1xuICAgIHRoaXMuX3Nwb3RVbmlmb3JtWzBdID0gTWF0aC5jb3ModGhpcy5fc3BvdEFuZ2xlICogMC41KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBnZXQgdGhlIHNwb3QgbGlnaHQgYW5nbGVcbiAgICogQHJldHVybnMge251bWJlcn0gc3BvdCBsaWdodCBhbmdsZVxuICAgKi9cbiAgZ2V0IHNwb3RBbmdsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3BvdEFuZ2xlO1xuICB9XG5cbiAgLyoqXG4gICAqIHNldCB0aGUgc3BvdCBsaWdodCBleHBvbmVudGlhbFxuICAgKiBAcGFyYW0ge251bWJlcn0gdmFsIHNwb3QgbGlnaHQgZXhwb25lbnRpYWxcbiAgICovXG4gIHNldFNwb3RFeHAodmFsKSB7XG4gICAgdGhpcy5fc3BvdEV4cCA9IHZhbDtcbiAgICB0aGlzLl9zcG90VW5pZm9ybVsxXSA9IHZhbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBnZXQgdGhlIHNwb3QgbGlnaHQgZXhwb25lbnRpYWxcbiAgICogQHJldHVybnMge251bWJlcn0gc3BvdCBsaWdodCBleHBvbmVudGlhbFxuICAgKi9cbiAgZ2V0IHNwb3RFeHAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Nwb3RFeHA7XG4gIH1cblxuICAvKipcbiAgICogc2V0IHRoZSByYW5nZSBvZiB0aGUgbGlnaHQgc291cmNlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB2YWwgbGlnaHQgc291cmNlIHJhbmdlXG4gICAqL1xuICBzZXRSYW5nZSh2YWwpIHtcbiAgICB0aGlzLl9yYW5nZSA9IHZhbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBnZXQgdGhlIHJhbmdlIG9mIHRoZSBsaWdodCBzb3VyY2VcbiAgICogQHJldHVybnMge251bWJlcn0gcmFuZ2Ugb2YgdGhlIGxpZ2h0IHNvdXJjZVxuICAgKi9cbiAgZ2V0IHJhbmdlKCkge1xuICAgIHJldHVybiB0aGlzLl9yYW5nZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBzZXQgdGhlIHNoYWRvdyB0eXBlIG9mIHRoZSBsaWdodCBzb3VyY2VcbiAgICogQHBhcmFtIHtudW1iZXJ9IHR5cGUgbGlnaHQgc291cmNlIHNoYWRvdyB0eXBlXG4gICAqL1xuICBzZXRTaGFkb3dUeXBlKHR5cGUpIHtcbiAgICBpZiAodGhpcy5fc2hhZG93VHlwZSA9PT0gZW51bXMuU0hBRE9XX05PTkUgJiYgdHlwZSAhPT0gZW51bXMuU0hBRE9XX05PTkUpIHtcbiAgICAgIHRoaXMuX3NoYWRvd01hcERpcnR5ID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy5fc2hhZG93VHlwZSA9IHR5cGU7XG4gIH1cblxuICAvKipcbiAgICogZ2V0IHRoZSBzaGFkb3cgdHlwZSBvZiB0aGUgbGlnaHQgc291cmNlXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGxpZ2h0IHNvdXJjZSBzaGFkb3cgdHlwZVxuICAgKi9cbiAgZ2V0IHNoYWRvd1R5cGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NoYWRvd1R5cGU7XG4gIH1cblxuICAvKipcbiAgICogZ2V0IHRoZSBzaGFkb3dtYXAgb2YgdGhlIGxpZ2h0IHNvdXJjZVxuICAgKiBAcmV0dXJucyB7VGV4dHVyZTJEfSBsaWdodCBzb3VyY2Ugc2hhZG93bWFwXG4gICAqL1xuICBnZXQgc2hhZG93TWFwKCkge1xuICAgIHJldHVybiB0aGlzLl9zaGFkb3dNYXA7XG4gIH1cblxuICAvKipcbiAgICogZ2V0IHRoZSB2aWV3LXByb2plY3Rpb24gbWF0cml4IG9mIHRoZSBsaWdodCBzb3VyY2VcbiAgICogQHJldHVybnMge01hdDR9IGxpZ2h0IHNvdXJjZSB2aWV3LXByb2plY3Rpb24gbWF0cml4XG4gICAqL1xuICBnZXQgdmlld1Byb2pNYXRyaXgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZpZXdQcm9qTWF0cml4O1xuICB9XG5cbiAgLyoqXG4gICAqIHNldCB0aGUgc2hhZG93IHJlc29sdXRpb24gb2YgdGhlIGxpZ2h0IHNvdXJjZVxuICAgKiBAcGFyYW0ge251bWJlcn0gdmFsIGxpZ2h0IHNvdXJjZSBzaGFkb3cgcmVzb2x1dGlvblxuICAgKi9cbiAgc2V0U2hhZG93UmVzb2x1dGlvbih2YWwpIHtcbiAgICBpZiAodGhpcy5fc2hhZG93UmVzb2x1dGlvbiAhPT0gdmFsKSB7XG4gICAgICB0aGlzLl9zaGFkb3dNYXBEaXJ0eSA9IHRydWU7XG4gICAgfVxuICAgIHRoaXMuX3NoYWRvd1Jlc29sdXRpb24gPSB2YWw7XG4gIH1cblxuICAvKipcbiAgICogZ2V0IHRoZSBzaGFkb3cgcmVzb2x1dGlvbiBvZiB0aGUgbGlnaHQgc291cmNlXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGxpZ2h0IHNvdXJjZSBzaGFkb3cgcmVzb2x1dGlvblxuICAgKi9cbiAgZ2V0IHNoYWRvd1Jlc29sdXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NoYWRvd1Jlc29sdXRpb247XG4gIH1cblxuICAvKipcbiAgICogc2V0IHRoZSBzaGFkb3cgYmlhcyBvZiB0aGUgbGlnaHQgc291cmNlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB2YWwgbGlnaHQgc291cmNlIHNoYWRvdyBiaWFzXG4gICAqL1xuICBzZXRTaGFkb3dCaWFzKHZhbCkge1xuICAgIHRoaXMuX3NoYWRvd0JpYXMgPSB2YWw7XG4gIH1cblxuICAvKipcbiAgICogZ2V0IHRoZSBzaGFkb3cgYmlhcyBvZiB0aGUgbGlnaHQgc291cmNlXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGxpZ2h0IHNvdXJjZSBzaGFkb3cgYmlhc1xuICAgKi9cbiAgZ2V0IHNoYWRvd0JpYXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NoYWRvd0JpYXM7XG4gIH1cblxuICAvKipcbiAgICogc2V0IHRoZSBzaGFkb3cgZGFya25lc3Mgb2YgdGhlIGxpZ2h0IHNvdXJjZVxuICAgKiBAcGFyYW0ge251bWJlcn0gdmFsIGxpZ2h0IHNvdXJjZSBzaGFkb3cgZGFya25lc3NcbiAgICovXG4gIHNldFNoYWRvd0RhcmtuZXNzKHZhbCkge1xuICAgIHRoaXMuX3NoYWRvd0RhcmtuZXNzID0gdmFsO1xuICB9XG5cbiAgLyoqXG4gICAqIGdldCB0aGUgc2hhZG93IGRhcmtuZXNzIG9mIHRoZSBsaWdodCBzb3VyY2VcbiAgICogQHJldHVybnMge251bWJlcn0gbGlnaHQgc291cmNlIHNoYWRvdyBkYXJrbmVzc1xuICAgKi9cbiAgZ2V0IHNoYWRvd0RhcmtuZXNzKCkge1xuICAgIHJldHVybiB0aGlzLl9zaGFkb3dEYXJrbmVzcztcbiAgfVxuXG4gIC8qKlxuICAgKiBzZXQgdGhlIHNoYWRvdyBtaW4gZGVwdGggb2YgdGhlIGxpZ2h0IHNvdXJjZVxuICAgKiBAcGFyYW0ge251bWJlcn0gdmFsIGxpZ2h0IHNvdXJjZSBzaGFkb3cgbWluIGRlcHRoXG4gICAqL1xuICBzZXRTaGFkb3dNaW5EZXB0aCh2YWwpIHtcbiAgICB0aGlzLl9zaGFkb3dNaW5EZXB0aCA9IHZhbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBnZXQgdGhlIHNoYWRvdyBtaW4gZGVwdGggb2YgdGhlIGxpZ2h0IHNvdXJjZVxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBsaWdodCBzb3VyY2Ugc2hhZG93IG1pbiBkZXB0aFxuICAgKi9cbiAgZ2V0IHNoYWRvd01pbkRlcHRoKCkge1xuICAgIGlmICh0aGlzLl90eXBlID09PSBlbnVtcy5MSUdIVF9ESVJFQ1RJT05BTCkge1xuICAgICAgcmV0dXJuIDEuMDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3NoYWRvd01pbkRlcHRoO1xuICB9XG5cbiAgLyoqXG4gICAqIHNldCB0aGUgc2hhZG93IG1heCBkZXB0aCBvZiB0aGUgbGlnaHQgc291cmNlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB2YWwgbGlnaHQgc291cmNlIHNoYWRvdyBtYXggZGVwdGhcbiAgICovXG4gIHNldFNoYWRvd01heERlcHRoKHZhbCkge1xuICAgIHRoaXMuX3NoYWRvd01heERlcHRoID0gdmFsO1xuICB9XG5cbiAgLyoqXG4gICAqIGdldCB0aGUgc2hhZG93IG1heCBkZXB0aCBvZiB0aGUgbGlnaHQgc291cmNlXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGxpZ2h0IHNvdXJjZSBzaGFkb3cgbWF4IGRlcHRoXG4gICAqL1xuICBnZXQgc2hhZG93TWF4RGVwdGgoKSB7XG4gICAgaWYgKHRoaXMuX3R5cGUgPT09IGVudW1zLkxJR0hUX0RJUkVDVElPTkFMKSB7XG4gICAgICByZXR1cm4gMS4wO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fc2hhZG93TWF4RGVwdGg7XG4gIH1cblxuICAvKipcbiAgICogc2V0IHRoZSBzaGFkb3cgZGVwdGggc2NhbGUgb2YgdGhlIGxpZ2h0IHNvdXJjZVxuICAgKiBAcGFyYW0ge251bWJlcn0gdmFsIGxpZ2h0IHNvdXJjZSBzaGFkb3cgZGVwdGggc2NhbGVcbiAgICovXG4gIHNldFNoYWRvd0RlcHRoU2NhbGUodmFsKSB7XG4gICAgdGhpcy5fc2hhZG93RGVwdGhTY2FsZSA9IHZhbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBnZXQgdGhlIHNoYWRvdyBkZXB0aCBzY2FsZSBvZiB0aGUgbGlnaHQgc291cmNlXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IGxpZ2h0IHNvdXJjZSBzaGFkb3cgZGVwdGggc2NhbGVcbiAgICovXG4gIGdldCBzaGFkb3dEZXB0aFNjYWxlKCkge1xuICAgIHJldHVybiB0aGlzLl9zaGFkb3dEZXB0aFNjYWxlO1xuICB9XG5cbiAgLyoqXG4gICAqIHNldCB0aGUgZnJ1c3R1bSBlZGdlIGZhbGxvZmYgb2YgdGhlIGxpZ2h0IHNvdXJjZVxuICAgKiBAcGFyYW0ge251bWJlcn0gdmFsIGxpZ2h0IHNvdXJjZSBmcnVzdHVtIGVkZ2UgZmFsbG9mZlxuICAgKi9cbiAgc2V0RnJ1c3R1bUVkZ2VGYWxsb2ZmKHZhbCkge1xuICAgIHRoaXMuX2ZydXN0dW1FZGdlRmFsbG9mZiA9IHZhbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBnZXQgdGhlIGZydXN0dW0gZWRnZSBmYWxsb2ZmIG9mIHRoZSBsaWdodCBzb3VyY2VcbiAgICogQHJldHVybnMge251bWJlcn0gbGlnaHQgc291cmNlIGZydXN0dW0gZWRnZSBmYWxsb2ZmXG4gICAqL1xuICBnZXQgZnJ1c3R1bUVkZ2VGYWxsb2ZmKCkge1xuICAgIHJldHVybiB0aGlzLl9mcnVzdHVtRWRnZUZhbGxvZmY7XG4gIH1cblxuICAvKipcbiAgICogc2V0IHRoZSBzaGFkb3cgZnJ1c3R1bSBzaXplIG9mIHRoZSBsaWdodCBzb3VyY2VcbiAgICogQHBhcmFtIHtudW1iZXJ9IHZhbCBsaWdodCBzb3VyY2Ugc2hhZG93IGZydXN0dW0gc2l6ZVxuICAgKi9cbiAgc2V0U2hhZG93RnJ1c3R1bVNpemUodmFsKSB7XG4gICAgdGhpcy5fc2hhZG93RnJ1c3R1bVNpemUgPSB2YWw7XG4gIH1cblxuICAvKipcbiAgICogZ2V0IHRoZSBzaGFkb3cgZnJ1c3R1bSBzaXplIG9mIHRoZSBsaWdodCBzb3VyY2VcbiAgICogQHJldHVybnMge251bWJlcn0gbGlnaHQgc291cmNlIHNoYWRvdyBmcnVzdHVtIHNpemVcbiAgICovXG4gIGdldCBzaGFkb3dGcnVzdHVtU2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc2hhZG93RnJ1c3R1bVNpemU7XG4gIH1cblxuICAvKipcbiAgICogZXh0cmFjdCBhIHZpZXcgb2YgdGhpcyBsaWdodCBzb3VyY2VcbiAgICogQHBhcmFtIHtWaWV3fSBvdXQgdGhlIHJlY2VpdmluZyB2aWV3XG4gICAqIEBwYXJhbSB7c3RyaW5nW119IHN0YWdlcyB0aGUgc3RhZ2VzIHVzaW5nIHRoZSB2aWV3XG4gICAqL1xuICBleHRyYWN0VmlldyhvdXQsIHN0YWdlcykge1xuICAgIC8vIFRPRE86IHZpZXcgc2hvdWxkIG5vdCBoYW5kbGUgbGlnaHQuXG4gICAgb3V0Ll9zaGFkb3dMaWdodCA9IHRoaXM7XG5cbiAgICAvLyBwcmlvcml0eS4gVE9ETzogdXNlIHZhcnlpbmcgdmFsdWUgZm9yIHNoYWRvdyB2aWV3P1xuICAgIG91dC5fcHJpb3JpdHkgPSAtMTtcblxuICAgIC8vIHJlY3RcbiAgICBvdXQuX3JlY3QueCA9IDA7XG4gICAgb3V0Ll9yZWN0LnkgPSAwO1xuICAgIG91dC5fcmVjdC53ID0gdGhpcy5fc2hhZG93UmVzb2x1dGlvbjtcbiAgICBvdXQuX3JlY3QuaCA9IHRoaXMuX3NoYWRvd1Jlc29sdXRpb247XG5cbiAgICAvLyBjbGVhciBvcHRzXG4gICAgVmVjMy5zZXQob3V0Ll9jb2xvciwgMSwgMSwgMSk7XG4gICAgb3V0Ll9kZXB0aCA9IDE7XG4gICAgb3V0Ll9zdGVuY2lsID0gMTtcbiAgICBvdXQuX2NsZWFyRmxhZ3MgPSBlbnVtcy5DTEVBUl9DT0xPUiB8IGVudW1zLkNMRUFSX0RFUFRIO1xuXG4gICAgLy8gc3RhZ2VzICYgZnJhbWVidWZmZXJcbiAgICBvdXQuX3N0YWdlcyA9IHN0YWdlcztcbiAgICBvdXQuX2ZyYW1lYnVmZmVyID0gdGhpcy5fc2hhZG93RnJhbWVCdWZmZXI7XG5cbiAgICAvLyB2aWV3IHByb2plY3Rpb24gbWF0cml4XG4gICAgc3dpdGNoKHRoaXMuX3R5cGUpIHtcbiAgICAgIGNhc2UgZW51bXMuTElHSFRfU1BPVDpcbiAgICAgICAgX2NvbXB1dGVTcG90TGlnaHRWaWV3UHJvak1hdHJpeCh0aGlzLCBvdXQuX21hdFZpZXcsIG91dC5fbWF0UHJvaik7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIGVudW1zLkxJR0hUX0RJUkVDVElPTkFMOlxuICAgICAgICBfY29tcHV0ZURpcmVjdGlvbmFsTGlnaHRWaWV3UHJvak1hdHJpeCh0aGlzLCBvdXQuX21hdFZpZXcsIG91dC5fbWF0UHJvaik7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIGVudW1zLkxJR0hUX1BPSU5UOlxuICAgICAgICBfY29tcHV0ZVBvaW50TGlnaHRWaWV3UHJvak1hdHJpeCh0aGlzLCBvdXQuX21hdFZpZXcsIG91dC5fbWF0UHJvaik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBlbnVtcy5MSUdIVF9BTUJJRU5UOlxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGNvbnNvbGUud2Fybignc2hhZG93IG9mIHRoaXMgbGlnaHQgdHlwZSBpcyBub3Qgc3VwcG9ydGVkJyk7XG4gICAgfVxuXG4gICAgLy8gdmlldy1wcm9qZWN0aW9uXG4gICAgTWF0NC5tdWwob3V0Ll9tYXRWaWV3UHJvaiwgb3V0Ll9tYXRQcm9qLCBvdXQuX21hdFZpZXcpO1xuICAgIHRoaXMuX3ZpZXdQcm9qTWF0cml4ID0gb3V0Ll9tYXRWaWV3UHJvajtcbiAgICBNYXQ0LmludmVydChvdXQuX21hdEludlZpZXdQcm9qLCBvdXQuX21hdFZpZXdQcm9qKTtcblxuICAgIC8vIHVwZGF0ZSB2aWV3J3MgZnJ1c3R1bVxuICAgIC8vIG91dC5fZnJ1c3R1bS51cGRhdGUob3V0Ll9tYXRWaWV3UHJvaiwgb3V0Ll9tYXRJbnZWaWV3UHJvaik7XG5cbiAgICBvdXQuX2N1bGxpbmdNYXNrID0gMHhmZmZmZmZmZjtcbiAgfVxuXG4gIF91cGRhdGVMaWdodFBvc2l0aW9uQW5kRGlyZWN0aW9uKCkge1xuICAgIHRoaXMuX25vZGUuZ2V0V29ybGRNYXRyaXgoX200X3RtcCk7XG4gICAgTWF0My5mcm9tTWF0NChfbTNfdG1wLCBfbTRfdG1wKTtcbiAgICBWZWMzLnRyYW5zZm9ybU1hdDMoX3RyYW5zZm9ybWVkTGlnaHREaXJlY3Rpb24sIF9mb3J3YXJkLCBfbTNfdG1wKTtcbiAgICBWZWMzLnRvQXJyYXkodGhpcy5fZGlyZWN0aW9uVW5pZm9ybSwgX3RyYW5zZm9ybWVkTGlnaHREaXJlY3Rpb24pO1xuICAgIGxldCBwb3MgPSB0aGlzLl9wb3NpdGlvblVuaWZvcm07XG4gICAgbGV0IG0gPSBfbTRfdG1wLm07XG4gICAgcG9zWzBdID0gbVsxMl07XG4gICAgcG9zWzFdID0gbVsxM107XG4gICAgcG9zWzJdID0gbVsxNF07XG4gIH1cblxuICBfZ2VuZXJhdGVTaGFkb3dNYXAoZGV2aWNlKSB7XG4gICAgdGhpcy5fc2hhZG93TWFwID0gbmV3IGdmeC5UZXh0dXJlMkQoZGV2aWNlLCB7XG4gICAgICB3aWR0aDogdGhpcy5fc2hhZG93UmVzb2x1dGlvbixcbiAgICAgIGhlaWdodDogdGhpcy5fc2hhZG93UmVzb2x1dGlvbixcbiAgICAgIGZvcm1hdDogZ2Z4LlRFWFRVUkVfRk1UX1JHQkE4LFxuICAgICAgd3JhcFM6IGdmeC5XUkFQX0NMQU1QLFxuICAgICAgd3JhcFQ6IGdmeC5XUkFQX0NMQU1QLFxuICAgIH0pO1xuICAgIHRoaXMuX3NoYWRvd0RlcHRoQnVmZmVyID0gbmV3IGdmeC5SZW5kZXJCdWZmZXIoZGV2aWNlLFxuICAgICAgZ2Z4LlJCX0ZNVF9EMTYsXG4gICAgICB0aGlzLl9zaGFkb3dSZXNvbHV0aW9uLFxuICAgICAgdGhpcy5fc2hhZG93UmVzb2x1dGlvblxuICAgICk7XG4gICAgdGhpcy5fc2hhZG93RnJhbWVCdWZmZXIgPSBuZXcgZ2Z4LkZyYW1lQnVmZmVyKGRldmljZSwgdGhpcy5fc2hhZG93UmVzb2x1dGlvbiwgdGhpcy5fc2hhZG93UmVzb2x1dGlvbiwge1xuICAgICAgY29sb3JzOiBbdGhpcy5fc2hhZG93TWFwXSxcbiAgICAgIGRlcHRoOiB0aGlzLl9zaGFkb3dEZXB0aEJ1ZmZlcixcbiAgICB9KTtcbiAgfVxuXG4gIF9kZXN0cm95U2hhZG93TWFwKCkge1xuICAgIGlmICh0aGlzLl9zaGFkb3dNYXApIHtcbiAgICAgIHRoaXMuX3NoYWRvd01hcC5kZXN0cm95KCk7XG4gICAgICB0aGlzLl9zaGFkb3dEZXB0aEJ1ZmZlci5kZXN0cm95KCk7XG4gICAgICB0aGlzLl9zaGFkb3dGcmFtZUJ1ZmZlci5kZXN0cm95KCk7XG4gICAgICB0aGlzLl9zaGFkb3dNYXAgPSBudWxsO1xuICAgICAgdGhpcy5fc2hhZG93RGVwdGhCdWZmZXIgPSBudWxsO1xuICAgICAgdGhpcy5fc2hhZG93RnJhbWVCdWZmZXIgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB1cGRhdGUgdGhlIGxpZ2h0IHNvdXJjZVxuICAgKiBAcGFyYW0ge0RldmljZX0gZGV2aWNlIHRoZSByZW5kZXJpbmcgZGV2aWNlXG4gICAqL1xuICB1cGRhdGUoZGV2aWNlKSB7XG4gICAgdGhpcy5fdXBkYXRlTGlnaHRQb3NpdGlvbkFuZERpcmVjdGlvbigpO1xuXG4gICAgaWYgKHRoaXMuX3NoYWRvd1R5cGUgPT09IGVudW1zLlNIQURPV19OT05FKSB7XG4gICAgICB0aGlzLl9kZXN0cm95U2hhZG93TWFwKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9zaGFkb3dNYXBEaXJ0eSkge1xuICAgICAgdGhpcy5fZGVzdHJveVNoYWRvd01hcCgpO1xuICAgICAgdGhpcy5fZ2VuZXJhdGVTaGFkb3dNYXAoZGV2aWNlKTtcbiAgICAgIHRoaXMuX3NoYWRvd01hcERpcnR5ID0gZmFsc2U7XG4gICAgfVxuXG4gIH1cbn1cbiJdfQ==