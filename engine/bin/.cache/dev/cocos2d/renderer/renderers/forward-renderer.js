
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/renderers/forward-renderer.js';
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

var _baseRenderer = _interopRequireDefault(require("../core/base-renderer"));

var _enums = _interopRequireDefault(require("../enums"));

var _memop = require("../memop");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _a16_view = new Float32Array(16);

var _a16_proj = new Float32Array(16);

var _a16_viewProj = new Float32Array(16);

var _a4_camPos = new Float32Array(4);

var _a64_shadow_lightViewProj = new Float32Array(64);

var _a16_shadow_lightViewProjs = [];

var _a4_shadow_info = new Float32Array(4);

var _camPos = new _valueTypes.Vec4(0, 0, 0, 0);

var _camFwd = new _valueTypes.Vec3(0, 0, 0);

var _v3_tmp1 = new _valueTypes.Vec3(0, 0, 0);

var CC_MAX_LIGHTS = 4;
var CC_MAX_SHADOW_LIGHTS = 2;

var _float16_pool = new _memop.RecyclePool(function () {
  return new Float32Array(16);
}, 8);

var ForwardRenderer =
/*#__PURE__*/
function (_BaseRenderer) {
  _inheritsLoose(ForwardRenderer, _BaseRenderer);

  function ForwardRenderer(device, builtin) {
    var _this;

    _this = _BaseRenderer.call(this, device, builtin) || this;
    _this._time = new Float32Array(4);
    _this._directionalLights = [];
    _this._pointLights = [];
    _this._spotLights = [];
    _this._shadowLights = [];
    _this._ambientLights = [];
    _this._numLights = 0;
    _this._defines = {};

    _this._registerStage('shadowcast', _this._shadowStage.bind(_assertThisInitialized(_this)));

    _this._registerStage('opaque', _this._opaqueStage.bind(_assertThisInitialized(_this)));

    _this._registerStage('transparent', _this._transparentStage.bind(_assertThisInitialized(_this)));

    return _this;
  }

  var _proto = ForwardRenderer.prototype;

  _proto.reset = function reset() {
    _float16_pool.reset();

    _BaseRenderer.prototype.reset.call(this);
  };

  _proto.render = function render(scene, dt) {
    this.reset();

    if (!CC_EDITOR) {
      this._time[0] += dt;

      this._device.setUniform('cc_time', this._time);
    }

    this._updateLights(scene);

    var canvas = this._device._gl.canvas;

    for (var i = 0; i < scene._cameras.length; ++i) {
      var view = this._requestView();

      var width = canvas.width;
      var height = canvas.height;
      var camera = scene._cameras.data[i];
      camera.extractView(view, width, height);
    } // render by cameras


    this._viewPools.sort(function (a, b) {
      return a._priority - b._priority;
    });

    for (var _i = 0; _i < this._viewPools.length; ++_i) {
      var _view = this._viewPools.data[_i];

      this._render(_view, scene);
    }
  } // direct render a single camera
  ;

  _proto.renderCamera = function renderCamera(camera, scene) {
    this.reset();
    var canvas = this._device._gl.canvas;
    var width = canvas.width;
    var height = canvas.height;

    var view = this._requestView();

    camera.extractView(view, width, height);

    this._render(view, scene);
  };

  _proto._updateLights = function _updateLights(scene) {
    this._directionalLights.length = 0;
    this._pointLights.length = 0;
    this._spotLights.length = 0;
    this._shadowLights.length = 0;
    this._ambientLights.length = 0;
    var lights = scene._lights;

    for (var i = 0; i < lights.length; ++i) {
      var light = lights.data[i];
      light.update(this._device);

      if (light.shadowType !== _enums["default"].SHADOW_NONE) {
        if (this._shadowLights.length < CC_MAX_SHADOW_LIGHTS) {
          this._shadowLights.push(light);
        }

        var view = this._requestView();

        light.extractView(view, ['shadowcast']);
      }

      if (light._type === _enums["default"].LIGHT_DIRECTIONAL) {
        this._directionalLights.push(light);
      } else if (light._type === _enums["default"].LIGHT_POINT) {
        this._pointLights.push(light);
      } else if (light._type === _enums["default"].LIGHT_SPOT) {
        this._spotLights.push(light);
      } else {
        this._ambientLights.push(light);
      }
    }

    this._updateDefines();

    this._numLights = lights._count;
  };

  _proto._updateDefines = function _updateDefines() {
    var defines = this._defines;
    defines.CC_NUM_DIR_LIGHTS = Math.min(CC_MAX_LIGHTS, this._directionalLights.length);
    defines.CC_NUM_POINT_LIGHTS = Math.min(CC_MAX_LIGHTS, this._pointLights.length);
    defines.CC_NUM_SPOT_LIGHTS = Math.min(CC_MAX_LIGHTS, this._spotLights.length);
    defines.CC_NUM_AMBIENT_LIGHTS = Math.min(CC_MAX_LIGHTS, this._ambientLights.length);
    defines.CC_NUM_SHADOW_LIGHTS = Math.min(CC_MAX_LIGHTS, this._shadowLights.length);
  };

  _proto._submitLightsUniforms = function _submitLightsUniforms() {
    var device = this._device;

    if (this._directionalLights.length > 0) {
      var directions = _float16_pool.add();

      var colors = _float16_pool.add();

      var lightNum = Math.min(CC_MAX_LIGHTS, this._directionalLights.length);

      for (var i = 0; i < lightNum; ++i) {
        var light = this._directionalLights[i];
        var index = i * 4;
        directions.set(light._directionUniform, index);
        colors.set(light._colorUniform, index);
      }

      device.setUniform('cc_dirLightDirection', directions);
      device.setUniform('cc_dirLightColor', colors);
    }

    if (this._pointLights.length > 0) {
      var positionAndRanges = _float16_pool.add();

      var _colors = _float16_pool.add();

      var _lightNum = Math.min(CC_MAX_LIGHTS, this._pointLights.length);

      for (var _i2 = 0; _i2 < _lightNum; ++_i2) {
        var _light = this._pointLights[_i2];

        var _index = _i2 * 4;

        positionAndRanges.set(_light._positionUniform, _index);
        positionAndRanges[_index + 3] = _light._range;

        _colors.set(_light._colorUniform, _index);
      }

      device.setUniform('cc_pointLightPositionAndRange', positionAndRanges);
      device.setUniform('cc_pointLightColor', _colors);
    }

    if (this._spotLights.length > 0) {
      var _positionAndRanges = _float16_pool.add();

      var _directions = _float16_pool.add();

      var _colors2 = _float16_pool.add();

      var _lightNum2 = Math.min(CC_MAX_LIGHTS, this._spotLights.length);

      for (var _i3 = 0; _i3 < _lightNum2; ++_i3) {
        var _light2 = this._spotLights[_i3];

        var _index2 = _i3 * 4;

        _positionAndRanges.set(_light2._positionUniform, _index2);

        _positionAndRanges[_index2 + 3] = _light2._range;

        _directions.set(_light2._directionUniform, _index2);

        _directions[_index2 + 3] = _light2._spotUniform[0];

        _colors2.set(_light2._colorUniform, _index2);

        _colors2[_index2 + 3] = _light2._spotUniform[1];
      }

      device.setUniform('cc_spotLightPositionAndRange', _positionAndRanges);
      device.setUniform('cc_spotLightDirection', _directions);
      device.setUniform('cc_spotLightColor', _colors2);
    }

    if (this._ambientLights.length > 0) {
      var _colors3 = _float16_pool.add();

      var _lightNum3 = Math.min(CC_MAX_LIGHTS, this._ambientLights.length);

      for (var _i4 = 0; _i4 < _lightNum3; ++_i4) {
        var _light3 = this._ambientLights[_i4];

        var _index3 = _i4 * 4;

        _colors3.set(_light3._colorUniform, _index3);
      }

      device.setUniform('cc_ambientColor', _colors3);
    }
  };

  _proto._submitShadowStageUniforms = function _submitShadowStageUniforms(view) {
    var light = view._shadowLight;
    var shadowInfo = _a4_shadow_info;
    shadowInfo[0] = light.shadowMinDepth;
    shadowInfo[1] = light.shadowMaxDepth;
    shadowInfo[2] = light.shadowDepthScale;
    shadowInfo[3] = light.shadowDarkness;

    this._device.setUniform('cc_shadow_map_lightViewProjMatrix', _valueTypes.Mat4.toArray(_a16_viewProj, view._matViewProj));

    this._device.setUniform('cc_shadow_map_info', shadowInfo);

    this._device.setUniform('cc_shadow_map_bias', light.shadowBias);
  };

  _proto._submitOtherStagesUniforms = function _submitOtherStagesUniforms() {
    var shadowInfo = _float16_pool.add();

    for (var i = 0; i < this._shadowLights.length; ++i) {
      var light = this._shadowLights[i];
      var view = _a16_shadow_lightViewProjs[i];

      if (!view) {
        view = _a16_shadow_lightViewProjs[i] = new Float32Array(_a64_shadow_lightViewProj.buffer, i * 64, 16);
      }

      _valueTypes.Mat4.toArray(view, light.viewProjMatrix);

      var infoIndex = i * 4;
      shadowInfo[infoIndex] = light.shadowMinDepth;
      shadowInfo[infoIndex + 1] = light.shadowMaxDepth;
      shadowInfo[infoIndex + 2] = light.shadowDepthScale;
      shadowInfo[infoIndex + 3] = light.shadowDarkness;
    }

    this._device.setUniform("cc_shadow_lightViewProjMatrix", _a64_shadow_lightViewProj);

    this._device.setUniform("cc_shadow_info", shadowInfo); // this._device.setUniform(`cc_frustumEdgeFalloff_${index}`, light.frustumEdgeFalloff);

  };

  _proto._sortItems = function _sortItems(items) {
    // sort items
    items.sort(function (a, b) {
      // if (a.layer !== b.layer) {
      //   return a.layer - b.layer;
      // }
      if (a.passes.length !== b.passes.length) {
        return a.passes.length - b.passes.length;
      }

      return a.sortKey - b.sortKey;
    });
  };

  _proto._shadowStage = function _shadowStage(view, items) {
    // update rendering
    this._submitShadowStageUniforms(view); // this._sortItems(items);
    // draw it


    for (var i = 0; i < items.length; ++i) {
      var item = items.data[i];

      if (item.effect.getDefine('CC_CASTING_SHADOW')) {
        this._draw(item);
      }
    }
  };

  _proto._drawItems = function _drawItems(view, items) {
    var shadowLights = this._shadowLights;

    if (shadowLights.length === 0 && this._numLights === 0) {
      for (var i = 0; i < items.length; ++i) {
        var item = items.data[i];

        this._draw(item);
      }
    } else {
      for (var _i5 = 0; _i5 < items.length; ++_i5) {
        var _item = items.data[_i5];

        for (var shadowIdx = 0; shadowIdx < shadowLights.length; ++shadowIdx) {
          this._device.setTexture('cc_shadow_map_' + shadowIdx, shadowLights[shadowIdx].shadowMap, this._allocTextureUnit());
        }

        this._draw(_item);
      }
    }
  };

  _proto._opaqueStage = function _opaqueStage(view, items) {
    view.getPosition(_camPos); // update uniforms

    this._device.setUniform('cc_matView', _valueTypes.Mat4.toArray(_a16_view, view._matView));

    this._device.setUniform('cc_matpProj', _valueTypes.Mat4.toArray(_a16_proj, view._matProj));

    this._device.setUniform('cc_matViewProj', _valueTypes.Mat4.toArray(_a16_viewProj, view._matViewProj));

    this._device.setUniform('cc_cameraPos', _valueTypes.Vec4.toArray(_a4_camPos, _camPos)); // update rendering


    this._submitLightsUniforms();

    this._submitOtherStagesUniforms();

    this._drawItems(view, items);
  };

  _proto._transparentStage = function _transparentStage(view, items) {
    view.getPosition(_camPos);
    view.getForward(_camFwd); // update uniforms

    this._device.setUniform('cc_matView', _valueTypes.Mat4.toArray(_a16_view, view._matView));

    this._device.setUniform('cc_matpProj', _valueTypes.Mat4.toArray(_a16_proj, view._matProj));

    this._device.setUniform('cc_matViewProj', _valueTypes.Mat4.toArray(_a16_viewProj, view._matViewProj));

    this._device.setUniform('cc_cameraPos', _valueTypes.Vec4.toArray(_a4_camPos, _camPos));

    this._submitLightsUniforms();

    this._submitOtherStagesUniforms(); // calculate zdist


    for (var i = 0; i < items.length; ++i) {
      var item = items.data[i]; // TODO: we should use mesh center instead!

      item.node.getWorldPosition(_v3_tmp1);

      _valueTypes.Vec3.sub(_v3_tmp1, _v3_tmp1, _camPos);

      item.sortKey = -_valueTypes.Vec3.dot(_v3_tmp1, _camFwd);
    }

    this._sortItems(items);

    this._drawItems(view, items);
  };

  return ForwardRenderer;
}(_baseRenderer["default"]);

exports["default"] = ForwardRenderer;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvcndhcmQtcmVuZGVyZXIuanMiXSwibmFtZXMiOlsiX2ExNl92aWV3IiwiRmxvYXQzMkFycmF5IiwiX2ExNl9wcm9qIiwiX2ExNl92aWV3UHJvaiIsIl9hNF9jYW1Qb3MiLCJfYTY0X3NoYWRvd19saWdodFZpZXdQcm9qIiwiX2ExNl9zaGFkb3dfbGlnaHRWaWV3UHJvanMiLCJfYTRfc2hhZG93X2luZm8iLCJfY2FtUG9zIiwiVmVjNCIsIl9jYW1Gd2QiLCJWZWMzIiwiX3YzX3RtcDEiLCJDQ19NQVhfTElHSFRTIiwiQ0NfTUFYX1NIQURPV19MSUdIVFMiLCJfZmxvYXQxNl9wb29sIiwiUmVjeWNsZVBvb2wiLCJGb3J3YXJkUmVuZGVyZXIiLCJkZXZpY2UiLCJidWlsdGluIiwiX3RpbWUiLCJfZGlyZWN0aW9uYWxMaWdodHMiLCJfcG9pbnRMaWdodHMiLCJfc3BvdExpZ2h0cyIsIl9zaGFkb3dMaWdodHMiLCJfYW1iaWVudExpZ2h0cyIsIl9udW1MaWdodHMiLCJfZGVmaW5lcyIsIl9yZWdpc3RlclN0YWdlIiwiX3NoYWRvd1N0YWdlIiwiYmluZCIsIl9vcGFxdWVTdGFnZSIsIl90cmFuc3BhcmVudFN0YWdlIiwicmVzZXQiLCJyZW5kZXIiLCJzY2VuZSIsImR0IiwiQ0NfRURJVE9SIiwiX2RldmljZSIsInNldFVuaWZvcm0iLCJfdXBkYXRlTGlnaHRzIiwiY2FudmFzIiwiX2dsIiwiaSIsIl9jYW1lcmFzIiwibGVuZ3RoIiwidmlldyIsIl9yZXF1ZXN0VmlldyIsIndpZHRoIiwiaGVpZ2h0IiwiY2FtZXJhIiwiZGF0YSIsImV4dHJhY3RWaWV3IiwiX3ZpZXdQb29scyIsInNvcnQiLCJhIiwiYiIsIl9wcmlvcml0eSIsIl9yZW5kZXIiLCJyZW5kZXJDYW1lcmEiLCJsaWdodHMiLCJfbGlnaHRzIiwibGlnaHQiLCJ1cGRhdGUiLCJzaGFkb3dUeXBlIiwiZW51bXMiLCJTSEFET1dfTk9ORSIsInB1c2giLCJfdHlwZSIsIkxJR0hUX0RJUkVDVElPTkFMIiwiTElHSFRfUE9JTlQiLCJMSUdIVF9TUE9UIiwiX3VwZGF0ZURlZmluZXMiLCJfY291bnQiLCJkZWZpbmVzIiwiQ0NfTlVNX0RJUl9MSUdIVFMiLCJNYXRoIiwibWluIiwiQ0NfTlVNX1BPSU5UX0xJR0hUUyIsIkNDX05VTV9TUE9UX0xJR0hUUyIsIkNDX05VTV9BTUJJRU5UX0xJR0hUUyIsIkNDX05VTV9TSEFET1dfTElHSFRTIiwiX3N1Ym1pdExpZ2h0c1VuaWZvcm1zIiwiZGlyZWN0aW9ucyIsImFkZCIsImNvbG9ycyIsImxpZ2h0TnVtIiwiaW5kZXgiLCJzZXQiLCJfZGlyZWN0aW9uVW5pZm9ybSIsIl9jb2xvclVuaWZvcm0iLCJwb3NpdGlvbkFuZFJhbmdlcyIsIl9wb3NpdGlvblVuaWZvcm0iLCJfcmFuZ2UiLCJfc3BvdFVuaWZvcm0iLCJfc3VibWl0U2hhZG93U3RhZ2VVbmlmb3JtcyIsIl9zaGFkb3dMaWdodCIsInNoYWRvd0luZm8iLCJzaGFkb3dNaW5EZXB0aCIsInNoYWRvd01heERlcHRoIiwic2hhZG93RGVwdGhTY2FsZSIsInNoYWRvd0RhcmtuZXNzIiwiTWF0NCIsInRvQXJyYXkiLCJfbWF0Vmlld1Byb2oiLCJzaGFkb3dCaWFzIiwiX3N1Ym1pdE90aGVyU3RhZ2VzVW5pZm9ybXMiLCJidWZmZXIiLCJ2aWV3UHJvak1hdHJpeCIsImluZm9JbmRleCIsIl9zb3J0SXRlbXMiLCJpdGVtcyIsInBhc3NlcyIsInNvcnRLZXkiLCJpdGVtIiwiZWZmZWN0IiwiZ2V0RGVmaW5lIiwiX2RyYXciLCJfZHJhd0l0ZW1zIiwic2hhZG93TGlnaHRzIiwic2hhZG93SWR4Iiwic2V0VGV4dHVyZSIsInNoYWRvd01hcCIsIl9hbGxvY1RleHR1cmVVbml0IiwiZ2V0UG9zaXRpb24iLCJfbWF0VmlldyIsIl9tYXRQcm9qIiwiZ2V0Rm9yd2FyZCIsIm5vZGUiLCJnZXRXb3JsZFBvc2l0aW9uIiwic3ViIiwiZG90IiwiQmFzZVJlbmRlcmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBSUEsU0FBUyxHQUFHLElBQUlDLFlBQUosQ0FBaUIsRUFBakIsQ0FBaEI7O0FBQ0EsSUFBSUMsU0FBUyxHQUFHLElBQUlELFlBQUosQ0FBaUIsRUFBakIsQ0FBaEI7O0FBQ0EsSUFBSUUsYUFBYSxHQUFHLElBQUlGLFlBQUosQ0FBaUIsRUFBakIsQ0FBcEI7O0FBQ0EsSUFBSUcsVUFBVSxHQUFHLElBQUlILFlBQUosQ0FBaUIsQ0FBakIsQ0FBakI7O0FBRUEsSUFBSUkseUJBQXlCLEdBQUcsSUFBSUosWUFBSixDQUFpQixFQUFqQixDQUFoQzs7QUFDQSxJQUFJSywwQkFBMEIsR0FBRyxFQUFqQzs7QUFDQSxJQUFJQyxlQUFlLEdBQUcsSUFBSU4sWUFBSixDQUFpQixDQUFqQixDQUF0Qjs7QUFFQSxJQUFJTyxPQUFPLEdBQUcsSUFBSUMsZ0JBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsRUFBa0IsQ0FBbEIsQ0FBZDs7QUFDQSxJQUFJQyxPQUFPLEdBQUcsSUFBSUMsZ0JBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQ0FBZDs7QUFDQSxJQUFJQyxRQUFRLEdBQUcsSUFBSUQsZ0JBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQ0FBZjs7QUFFQSxJQUFNRSxhQUFhLEdBQUcsQ0FBdEI7QUFDQSxJQUFNQyxvQkFBb0IsR0FBRyxDQUE3Qjs7QUFFQSxJQUFJQyxhQUFhLEdBQUcsSUFBSUMsa0JBQUosQ0FBZ0IsWUFBTTtBQUN4QyxTQUFPLElBQUlmLFlBQUosQ0FBaUIsRUFBakIsQ0FBUDtBQUNELENBRm1CLEVBRWpCLENBRmlCLENBQXBCOztJQUlxQmdCOzs7OztBQUNuQiwyQkFBWUMsTUFBWixFQUFvQkMsT0FBcEIsRUFBNkI7QUFBQTs7QUFDM0IscUNBQU1ELE1BQU4sRUFBY0MsT0FBZDtBQUVBLFVBQUtDLEtBQUwsR0FBYSxJQUFJbkIsWUFBSixDQUFpQixDQUFqQixDQUFiO0FBRUEsVUFBS29CLGtCQUFMLEdBQTBCLEVBQTFCO0FBQ0EsVUFBS0MsWUFBTCxHQUFvQixFQUFwQjtBQUNBLFVBQUtDLFdBQUwsR0FBbUIsRUFBbkI7QUFDQSxVQUFLQyxhQUFMLEdBQXFCLEVBQXJCO0FBQ0EsVUFBS0MsY0FBTCxHQUFzQixFQUF0QjtBQUVBLFVBQUtDLFVBQUwsR0FBa0IsQ0FBbEI7QUFFQSxVQUFLQyxRQUFMLEdBQWdCLEVBQWhCOztBQUVBLFVBQUtDLGNBQUwsQ0FBb0IsWUFBcEIsRUFBa0MsTUFBS0MsWUFBTCxDQUFrQkMsSUFBbEIsK0JBQWxDOztBQUNBLFVBQUtGLGNBQUwsQ0FBb0IsUUFBcEIsRUFBOEIsTUFBS0csWUFBTCxDQUFrQkQsSUFBbEIsK0JBQTlCOztBQUNBLFVBQUtGLGNBQUwsQ0FBb0IsYUFBcEIsRUFBbUMsTUFBS0ksaUJBQUwsQ0FBdUJGLElBQXZCLCtCQUFuQzs7QUFqQjJCO0FBa0I1Qjs7OztTQUVERyxRQUFBLGlCQUFTO0FBQ1BsQixJQUFBQSxhQUFhLENBQUNrQixLQUFkOztBQUNBLDRCQUFNQSxLQUFOO0FBQ0Q7O1NBRURDLFNBQUEsZ0JBQVFDLEtBQVIsRUFBZUMsRUFBZixFQUFtQjtBQUNqQixTQUFLSCxLQUFMOztBQUVBLFFBQUksQ0FBQ0ksU0FBTCxFQUFnQjtBQUNkLFdBQUtqQixLQUFMLENBQVcsQ0FBWCxLQUFpQmdCLEVBQWpCOztBQUNBLFdBQUtFLE9BQUwsQ0FBYUMsVUFBYixDQUF3QixTQUF4QixFQUFtQyxLQUFLbkIsS0FBeEM7QUFDRDs7QUFFRCxTQUFLb0IsYUFBTCxDQUFtQkwsS0FBbkI7O0FBRUEsUUFBTU0sTUFBTSxHQUFHLEtBQUtILE9BQUwsQ0FBYUksR0FBYixDQUFpQkQsTUFBaEM7O0FBQ0EsU0FBSyxJQUFJRSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHUixLQUFLLENBQUNTLFFBQU4sQ0FBZUMsTUFBbkMsRUFBMkMsRUFBRUYsQ0FBN0MsRUFBZ0Q7QUFDOUMsVUFBSUcsSUFBSSxHQUFHLEtBQUtDLFlBQUwsRUFBWDs7QUFDQSxVQUFJQyxLQUFLLEdBQUdQLE1BQU0sQ0FBQ08sS0FBbkI7QUFDQSxVQUFJQyxNQUFNLEdBQUdSLE1BQU0sQ0FBQ1EsTUFBcEI7QUFDQSxVQUFJQyxNQUFNLEdBQUdmLEtBQUssQ0FBQ1MsUUFBTixDQUFlTyxJQUFmLENBQW9CUixDQUFwQixDQUFiO0FBQ0FPLE1BQUFBLE1BQU0sQ0FBQ0UsV0FBUCxDQUFtQk4sSUFBbkIsRUFBeUJFLEtBQXpCLEVBQWdDQyxNQUFoQztBQUNELEtBakJnQixDQW1CakI7OztBQUNBLFNBQUtJLFVBQUwsQ0FBZ0JDLElBQWhCLENBQXFCLFVBQUNDLENBQUQsRUFBSUMsQ0FBSixFQUFVO0FBQzdCLGFBQVFELENBQUMsQ0FBQ0UsU0FBRixHQUFjRCxDQUFDLENBQUNDLFNBQXhCO0FBQ0QsS0FGRDs7QUFJQSxTQUFLLElBQUlkLEVBQUMsR0FBRyxDQUFiLEVBQWdCQSxFQUFDLEdBQUcsS0FBS1UsVUFBTCxDQUFnQlIsTUFBcEMsRUFBNEMsRUFBRUYsRUFBOUMsRUFBaUQ7QUFDL0MsVUFBSUcsS0FBSSxHQUFHLEtBQUtPLFVBQUwsQ0FBZ0JGLElBQWhCLENBQXFCUixFQUFyQixDQUFYOztBQUNBLFdBQUtlLE9BQUwsQ0FBYVosS0FBYixFQUFtQlgsS0FBbkI7QUFDRDtBQUNGLElBRUQ7OztTQUNBd0IsZUFBQSxzQkFBY1QsTUFBZCxFQUFzQmYsS0FBdEIsRUFBNkI7QUFDM0IsU0FBS0YsS0FBTDtBQUVBLFFBQU1RLE1BQU0sR0FBRyxLQUFLSCxPQUFMLENBQWFJLEdBQWIsQ0FBaUJELE1BQWhDO0FBQ0EsUUFBSU8sS0FBSyxHQUFHUCxNQUFNLENBQUNPLEtBQW5CO0FBQ0EsUUFBSUMsTUFBTSxHQUFHUixNQUFNLENBQUNRLE1BQXBCOztBQUVBLFFBQUlILElBQUksR0FBRyxLQUFLQyxZQUFMLEVBQVg7O0FBQ0FHLElBQUFBLE1BQU0sQ0FBQ0UsV0FBUCxDQUFtQk4sSUFBbkIsRUFBeUJFLEtBQXpCLEVBQWdDQyxNQUFoQzs7QUFFQSxTQUFLUyxPQUFMLENBQWFaLElBQWIsRUFBbUJYLEtBQW5CO0FBQ0Q7O1NBRURLLGdCQUFBLHVCQUFlTCxLQUFmLEVBQXNCO0FBQ3BCLFNBQUtkLGtCQUFMLENBQXdCd0IsTUFBeEIsR0FBaUMsQ0FBakM7QUFDQSxTQUFLdkIsWUFBTCxDQUFrQnVCLE1BQWxCLEdBQTJCLENBQTNCO0FBQ0EsU0FBS3RCLFdBQUwsQ0FBaUJzQixNQUFqQixHQUEwQixDQUExQjtBQUNBLFNBQUtyQixhQUFMLENBQW1CcUIsTUFBbkIsR0FBNEIsQ0FBNUI7QUFDQSxTQUFLcEIsY0FBTCxDQUFvQm9CLE1BQXBCLEdBQTZCLENBQTdCO0FBRUEsUUFBSWUsTUFBTSxHQUFHekIsS0FBSyxDQUFDMEIsT0FBbkI7O0FBQ0EsU0FBSyxJQUFJbEIsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR2lCLE1BQU0sQ0FBQ2YsTUFBM0IsRUFBbUMsRUFBRUYsQ0FBckMsRUFBd0M7QUFDdEMsVUFBSW1CLEtBQUssR0FBR0YsTUFBTSxDQUFDVCxJQUFQLENBQVlSLENBQVosQ0FBWjtBQUNBbUIsTUFBQUEsS0FBSyxDQUFDQyxNQUFOLENBQWEsS0FBS3pCLE9BQWxCOztBQUNBLFVBQUl3QixLQUFLLENBQUNFLFVBQU4sS0FBcUJDLGtCQUFNQyxXQUEvQixFQUE0QztBQUMxQyxZQUFJLEtBQUsxQyxhQUFMLENBQW1CcUIsTUFBbkIsR0FBNEIvQixvQkFBaEMsRUFBc0Q7QUFDcEQsZUFBS1UsYUFBTCxDQUFtQjJDLElBQW5CLENBQXdCTCxLQUF4QjtBQUNEOztBQUNELFlBQUloQixJQUFJLEdBQUcsS0FBS0MsWUFBTCxFQUFYOztBQUNBZSxRQUFBQSxLQUFLLENBQUNWLFdBQU4sQ0FBa0JOLElBQWxCLEVBQXdCLENBQUMsWUFBRCxDQUF4QjtBQUNEOztBQUNELFVBQUlnQixLQUFLLENBQUNNLEtBQU4sS0FBZ0JILGtCQUFNSSxpQkFBMUIsRUFBNkM7QUFDM0MsYUFBS2hELGtCQUFMLENBQXdCOEMsSUFBeEIsQ0FBNkJMLEtBQTdCO0FBQ0QsT0FGRCxNQUdLLElBQUlBLEtBQUssQ0FBQ00sS0FBTixLQUFnQkgsa0JBQU1LLFdBQTFCLEVBQXVDO0FBQzFDLGFBQUtoRCxZQUFMLENBQWtCNkMsSUFBbEIsQ0FBdUJMLEtBQXZCO0FBQ0QsT0FGSSxNQUdBLElBQUlBLEtBQUssQ0FBQ00sS0FBTixLQUFnQkgsa0JBQU1NLFVBQTFCLEVBQXNDO0FBQ3pDLGFBQUtoRCxXQUFMLENBQWlCNEMsSUFBakIsQ0FBc0JMLEtBQXRCO0FBQ0QsT0FGSSxNQUdBO0FBQ0gsYUFBS3JDLGNBQUwsQ0FBb0IwQyxJQUFwQixDQUF5QkwsS0FBekI7QUFDRDtBQUNGOztBQUVELFNBQUtVLGNBQUw7O0FBRUEsU0FBSzlDLFVBQUwsR0FBa0JrQyxNQUFNLENBQUNhLE1BQXpCO0FBQ0Q7O1NBRURELGlCQUFBLDBCQUFrQjtBQUNoQixRQUFJRSxPQUFPLEdBQUcsS0FBSy9DLFFBQW5CO0FBQ0ErQyxJQUFBQSxPQUFPLENBQUNDLGlCQUFSLEdBQTRCQyxJQUFJLENBQUNDLEdBQUwsQ0FBU2hFLGFBQVQsRUFBd0IsS0FBS1Esa0JBQUwsQ0FBd0J3QixNQUFoRCxDQUE1QjtBQUNBNkIsSUFBQUEsT0FBTyxDQUFDSSxtQkFBUixHQUE4QkYsSUFBSSxDQUFDQyxHQUFMLENBQVNoRSxhQUFULEVBQXdCLEtBQUtTLFlBQUwsQ0FBa0J1QixNQUExQyxDQUE5QjtBQUNBNkIsSUFBQUEsT0FBTyxDQUFDSyxrQkFBUixHQUE2QkgsSUFBSSxDQUFDQyxHQUFMLENBQVNoRSxhQUFULEVBQXdCLEtBQUtVLFdBQUwsQ0FBaUJzQixNQUF6QyxDQUE3QjtBQUNBNkIsSUFBQUEsT0FBTyxDQUFDTSxxQkFBUixHQUFnQ0osSUFBSSxDQUFDQyxHQUFMLENBQVNoRSxhQUFULEVBQXdCLEtBQUtZLGNBQUwsQ0FBb0JvQixNQUE1QyxDQUFoQztBQUVBNkIsSUFBQUEsT0FBTyxDQUFDTyxvQkFBUixHQUErQkwsSUFBSSxDQUFDQyxHQUFMLENBQVNoRSxhQUFULEVBQXdCLEtBQUtXLGFBQUwsQ0FBbUJxQixNQUEzQyxDQUEvQjtBQUNEOztTQUVEcUMsd0JBQUEsaUNBQXlCO0FBQ3ZCLFFBQUloRSxNQUFNLEdBQUcsS0FBS29CLE9BQWxCOztBQUVBLFFBQUksS0FBS2pCLGtCQUFMLENBQXdCd0IsTUFBeEIsR0FBaUMsQ0FBckMsRUFBd0M7QUFDdEMsVUFBSXNDLFVBQVUsR0FBR3BFLGFBQWEsQ0FBQ3FFLEdBQWQsRUFBakI7O0FBQ0EsVUFBSUMsTUFBTSxHQUFHdEUsYUFBYSxDQUFDcUUsR0FBZCxFQUFiOztBQUNBLFVBQUlFLFFBQVEsR0FBR1YsSUFBSSxDQUFDQyxHQUFMLENBQVNoRSxhQUFULEVBQXdCLEtBQUtRLGtCQUFMLENBQXdCd0IsTUFBaEQsQ0FBZjs7QUFDQSxXQUFLLElBQUlGLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcyQyxRQUFwQixFQUE4QixFQUFFM0MsQ0FBaEMsRUFBbUM7QUFDakMsWUFBSW1CLEtBQUssR0FBRyxLQUFLekMsa0JBQUwsQ0FBd0JzQixDQUF4QixDQUFaO0FBQ0EsWUFBSTRDLEtBQUssR0FBRzVDLENBQUMsR0FBRyxDQUFoQjtBQUNBd0MsUUFBQUEsVUFBVSxDQUFDSyxHQUFYLENBQWUxQixLQUFLLENBQUMyQixpQkFBckIsRUFBd0NGLEtBQXhDO0FBQ0FGLFFBQUFBLE1BQU0sQ0FBQ0csR0FBUCxDQUFXMUIsS0FBSyxDQUFDNEIsYUFBakIsRUFBZ0NILEtBQWhDO0FBQ0Q7O0FBRURyRSxNQUFBQSxNQUFNLENBQUNxQixVQUFQLENBQWtCLHNCQUFsQixFQUEwQzRDLFVBQTFDO0FBQ0FqRSxNQUFBQSxNQUFNLENBQUNxQixVQUFQLENBQWtCLGtCQUFsQixFQUFzQzhDLE1BQXRDO0FBQ0Q7O0FBRUQsUUFBSSxLQUFLL0QsWUFBTCxDQUFrQnVCLE1BQWxCLEdBQTJCLENBQS9CLEVBQWtDO0FBQ2hDLFVBQUk4QyxpQkFBaUIsR0FBRzVFLGFBQWEsQ0FBQ3FFLEdBQWQsRUFBeEI7O0FBQ0EsVUFBSUMsT0FBTSxHQUFHdEUsYUFBYSxDQUFDcUUsR0FBZCxFQUFiOztBQUNBLFVBQUlFLFNBQVEsR0FBR1YsSUFBSSxDQUFDQyxHQUFMLENBQVNoRSxhQUFULEVBQXdCLEtBQUtTLFlBQUwsQ0FBa0J1QixNQUExQyxDQUFmOztBQUNBLFdBQUssSUFBSUYsR0FBQyxHQUFHLENBQWIsRUFBZ0JBLEdBQUMsR0FBRzJDLFNBQXBCLEVBQThCLEVBQUUzQyxHQUFoQyxFQUFtQztBQUNqQyxZQUFJbUIsTUFBSyxHQUFHLEtBQUt4QyxZQUFMLENBQWtCcUIsR0FBbEIsQ0FBWjs7QUFDQSxZQUFJNEMsTUFBSyxHQUFHNUMsR0FBQyxHQUFHLENBQWhCOztBQUNBZ0QsUUFBQUEsaUJBQWlCLENBQUNILEdBQWxCLENBQXNCMUIsTUFBSyxDQUFDOEIsZ0JBQTVCLEVBQThDTCxNQUE5QztBQUNBSSxRQUFBQSxpQkFBaUIsQ0FBQ0osTUFBSyxHQUFDLENBQVAsQ0FBakIsR0FBNkJ6QixNQUFLLENBQUMrQixNQUFuQzs7QUFDQVIsUUFBQUEsT0FBTSxDQUFDRyxHQUFQLENBQVcxQixNQUFLLENBQUM0QixhQUFqQixFQUFnQ0gsTUFBaEM7QUFDRDs7QUFFRHJFLE1BQUFBLE1BQU0sQ0FBQ3FCLFVBQVAsQ0FBa0IsK0JBQWxCLEVBQW1Eb0QsaUJBQW5EO0FBQ0F6RSxNQUFBQSxNQUFNLENBQUNxQixVQUFQLENBQWtCLG9CQUFsQixFQUF3QzhDLE9BQXhDO0FBQ0Q7O0FBRUQsUUFBSSxLQUFLOUQsV0FBTCxDQUFpQnNCLE1BQWpCLEdBQTBCLENBQTlCLEVBQWlDO0FBQy9CLFVBQUk4QyxrQkFBaUIsR0FBRzVFLGFBQWEsQ0FBQ3FFLEdBQWQsRUFBeEI7O0FBQ0EsVUFBSUQsV0FBVSxHQUFHcEUsYUFBYSxDQUFDcUUsR0FBZCxFQUFqQjs7QUFDQSxVQUFJQyxRQUFNLEdBQUd0RSxhQUFhLENBQUNxRSxHQUFkLEVBQWI7O0FBQ0EsVUFBSUUsVUFBUSxHQUFHVixJQUFJLENBQUNDLEdBQUwsQ0FBU2hFLGFBQVQsRUFBd0IsS0FBS1UsV0FBTCxDQUFpQnNCLE1BQXpDLENBQWY7O0FBQ0EsV0FBSyxJQUFJRixHQUFDLEdBQUcsQ0FBYixFQUFnQkEsR0FBQyxHQUFHMkMsVUFBcEIsRUFBOEIsRUFBRTNDLEdBQWhDLEVBQW1DO0FBQ2pDLFlBQUltQixPQUFLLEdBQUcsS0FBS3ZDLFdBQUwsQ0FBaUJvQixHQUFqQixDQUFaOztBQUNBLFlBQUk0QyxPQUFLLEdBQUc1QyxHQUFDLEdBQUcsQ0FBaEI7O0FBRUFnRCxRQUFBQSxrQkFBaUIsQ0FBQ0gsR0FBbEIsQ0FBc0IxQixPQUFLLENBQUM4QixnQkFBNUIsRUFBOENMLE9BQTlDOztBQUNBSSxRQUFBQSxrQkFBaUIsQ0FBQ0osT0FBSyxHQUFDLENBQVAsQ0FBakIsR0FBNkJ6QixPQUFLLENBQUMrQixNQUFuQzs7QUFFQVYsUUFBQUEsV0FBVSxDQUFDSyxHQUFYLENBQWUxQixPQUFLLENBQUMyQixpQkFBckIsRUFBd0NGLE9BQXhDOztBQUNBSixRQUFBQSxXQUFVLENBQUNJLE9BQUssR0FBQyxDQUFQLENBQVYsR0FBc0J6QixPQUFLLENBQUNnQyxZQUFOLENBQW1CLENBQW5CLENBQXRCOztBQUVBVCxRQUFBQSxRQUFNLENBQUNHLEdBQVAsQ0FBVzFCLE9BQUssQ0FBQzRCLGFBQWpCLEVBQWdDSCxPQUFoQzs7QUFDQUYsUUFBQUEsUUFBTSxDQUFDRSxPQUFLLEdBQUMsQ0FBUCxDQUFOLEdBQWtCekIsT0FBSyxDQUFDZ0MsWUFBTixDQUFtQixDQUFuQixDQUFsQjtBQUNEOztBQUVENUUsTUFBQUEsTUFBTSxDQUFDcUIsVUFBUCxDQUFrQiw4QkFBbEIsRUFBa0RvRCxrQkFBbEQ7QUFDQXpFLE1BQUFBLE1BQU0sQ0FBQ3FCLFVBQVAsQ0FBa0IsdUJBQWxCLEVBQTJDNEMsV0FBM0M7QUFDQWpFLE1BQUFBLE1BQU0sQ0FBQ3FCLFVBQVAsQ0FBa0IsbUJBQWxCLEVBQXVDOEMsUUFBdkM7QUFDRDs7QUFFRCxRQUFJLEtBQUs1RCxjQUFMLENBQW9Cb0IsTUFBcEIsR0FBNkIsQ0FBakMsRUFBb0M7QUFDbEMsVUFBSXdDLFFBQU0sR0FBR3RFLGFBQWEsQ0FBQ3FFLEdBQWQsRUFBYjs7QUFDQSxVQUFJRSxVQUFRLEdBQUdWLElBQUksQ0FBQ0MsR0FBTCxDQUFTaEUsYUFBVCxFQUF3QixLQUFLWSxjQUFMLENBQW9Cb0IsTUFBNUMsQ0FBZjs7QUFDQSxXQUFLLElBQUlGLEdBQUMsR0FBRyxDQUFiLEVBQWdCQSxHQUFDLEdBQUcyQyxVQUFwQixFQUE4QixFQUFFM0MsR0FBaEMsRUFBbUM7QUFDakMsWUFBSW1CLE9BQUssR0FBRyxLQUFLckMsY0FBTCxDQUFvQmtCLEdBQXBCLENBQVo7O0FBQ0EsWUFBSTRDLE9BQUssR0FBRzVDLEdBQUMsR0FBRyxDQUFoQjs7QUFDQTBDLFFBQUFBLFFBQU0sQ0FBQ0csR0FBUCxDQUFXMUIsT0FBSyxDQUFDNEIsYUFBakIsRUFBZ0NILE9BQWhDO0FBQ0Q7O0FBRURyRSxNQUFBQSxNQUFNLENBQUNxQixVQUFQLENBQWtCLGlCQUFsQixFQUFxQzhDLFFBQXJDO0FBQ0Q7QUFDRjs7U0FFRFUsNkJBQUEsb0NBQTJCakQsSUFBM0IsRUFBaUM7QUFFL0IsUUFBSWdCLEtBQUssR0FBR2hCLElBQUksQ0FBQ2tELFlBQWpCO0FBRUEsUUFBSUMsVUFBVSxHQUFHMUYsZUFBakI7QUFDQTBGLElBQUFBLFVBQVUsQ0FBQyxDQUFELENBQVYsR0FBZ0JuQyxLQUFLLENBQUNvQyxjQUF0QjtBQUNBRCxJQUFBQSxVQUFVLENBQUMsQ0FBRCxDQUFWLEdBQWdCbkMsS0FBSyxDQUFDcUMsY0FBdEI7QUFDQUYsSUFBQUEsVUFBVSxDQUFDLENBQUQsQ0FBVixHQUFnQm5DLEtBQUssQ0FBQ3NDLGdCQUF0QjtBQUNBSCxJQUFBQSxVQUFVLENBQUMsQ0FBRCxDQUFWLEdBQWdCbkMsS0FBSyxDQUFDdUMsY0FBdEI7O0FBRUEsU0FBSy9ELE9BQUwsQ0FBYUMsVUFBYixDQUF3QixtQ0FBeEIsRUFBNkQrRCxpQkFBS0MsT0FBTCxDQUFhcEcsYUFBYixFQUE0QjJDLElBQUksQ0FBQzBELFlBQWpDLENBQTdEOztBQUNBLFNBQUtsRSxPQUFMLENBQWFDLFVBQWIsQ0FBd0Isb0JBQXhCLEVBQThDMEQsVUFBOUM7O0FBQ0EsU0FBSzNELE9BQUwsQ0FBYUMsVUFBYixDQUF3QixvQkFBeEIsRUFBOEN1QixLQUFLLENBQUMyQyxVQUFwRDtBQUNEOztTQUVEQyw2QkFBQSxzQ0FBNkI7QUFDM0IsUUFBSVQsVUFBVSxHQUFHbEYsYUFBYSxDQUFDcUUsR0FBZCxFQUFqQjs7QUFFQSxTQUFLLElBQUl6QyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHLEtBQUtuQixhQUFMLENBQW1CcUIsTUFBdkMsRUFBK0MsRUFBRUYsQ0FBakQsRUFBb0Q7QUFDbEQsVUFBSW1CLEtBQUssR0FBRyxLQUFLdEMsYUFBTCxDQUFtQm1CLENBQW5CLENBQVo7QUFDQSxVQUFJRyxJQUFJLEdBQUd4QywwQkFBMEIsQ0FBQ3FDLENBQUQsQ0FBckM7O0FBQ0EsVUFBSSxDQUFDRyxJQUFMLEVBQVc7QUFDVEEsUUFBQUEsSUFBSSxHQUFHeEMsMEJBQTBCLENBQUNxQyxDQUFELENBQTFCLEdBQWdDLElBQUkxQyxZQUFKLENBQWlCSSx5QkFBeUIsQ0FBQ3NHLE1BQTNDLEVBQW1EaEUsQ0FBQyxHQUFHLEVBQXZELEVBQTJELEVBQTNELENBQXZDO0FBQ0Q7O0FBQ0QyRCx1QkFBS0MsT0FBTCxDQUFhekQsSUFBYixFQUFtQmdCLEtBQUssQ0FBQzhDLGNBQXpCOztBQUVBLFVBQUlDLFNBQVMsR0FBR2xFLENBQUMsR0FBQyxDQUFsQjtBQUNBc0QsTUFBQUEsVUFBVSxDQUFDWSxTQUFELENBQVYsR0FBd0IvQyxLQUFLLENBQUNvQyxjQUE5QjtBQUNBRCxNQUFBQSxVQUFVLENBQUNZLFNBQVMsR0FBQyxDQUFYLENBQVYsR0FBMEIvQyxLQUFLLENBQUNxQyxjQUFoQztBQUNBRixNQUFBQSxVQUFVLENBQUNZLFNBQVMsR0FBQyxDQUFYLENBQVYsR0FBMEIvQyxLQUFLLENBQUNzQyxnQkFBaEM7QUFDQUgsTUFBQUEsVUFBVSxDQUFDWSxTQUFTLEdBQUMsQ0FBWCxDQUFWLEdBQTBCL0MsS0FBSyxDQUFDdUMsY0FBaEM7QUFDRDs7QUFFRCxTQUFLL0QsT0FBTCxDQUFhQyxVQUFiLGtDQUF5RGxDLHlCQUF6RDs7QUFDQSxTQUFLaUMsT0FBTCxDQUFhQyxVQUFiLG1CQUEwQzBELFVBQTFDLEVBbkIyQixDQW9CM0I7O0FBQ0Q7O1NBRURhLGFBQUEsb0JBQVlDLEtBQVosRUFBbUI7QUFDakI7QUFDQUEsSUFBQUEsS0FBSyxDQUFDekQsSUFBTixDQUFXLFVBQUNDLENBQUQsRUFBSUMsQ0FBSixFQUFVO0FBQ25CO0FBQ0E7QUFDQTtBQUVBLFVBQUlELENBQUMsQ0FBQ3lELE1BQUYsQ0FBU25FLE1BQVQsS0FBb0JXLENBQUMsQ0FBQ3dELE1BQUYsQ0FBU25FLE1BQWpDLEVBQXlDO0FBQ3ZDLGVBQU9VLENBQUMsQ0FBQ3lELE1BQUYsQ0FBU25FLE1BQVQsR0FBa0JXLENBQUMsQ0FBQ3dELE1BQUYsQ0FBU25FLE1BQWxDO0FBQ0Q7O0FBRUQsYUFBT1UsQ0FBQyxDQUFDMEQsT0FBRixHQUFZekQsQ0FBQyxDQUFDeUQsT0FBckI7QUFDRCxLQVZEO0FBV0Q7O1NBRURwRixlQUFBLHNCQUFjaUIsSUFBZCxFQUFvQmlFLEtBQXBCLEVBQTJCO0FBQ3pCO0FBQ0EsU0FBS2hCLDBCQUFMLENBQWdDakQsSUFBaEMsRUFGeUIsQ0FJekI7QUFFQTs7O0FBQ0EsU0FBSyxJQUFJSCxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHb0UsS0FBSyxDQUFDbEUsTUFBMUIsRUFBa0MsRUFBRUYsQ0FBcEMsRUFBdUM7QUFDckMsVUFBSXVFLElBQUksR0FBR0gsS0FBSyxDQUFDNUQsSUFBTixDQUFXUixDQUFYLENBQVg7O0FBQ0EsVUFBSXVFLElBQUksQ0FBQ0MsTUFBTCxDQUFZQyxTQUFaLENBQXNCLG1CQUF0QixDQUFKLEVBQWdEO0FBQzlDLGFBQUtDLEtBQUwsQ0FBV0gsSUFBWDtBQUNEO0FBQ0Y7QUFDRjs7U0FFREksYUFBQSxvQkFBWXhFLElBQVosRUFBa0JpRSxLQUFsQixFQUF5QjtBQUN2QixRQUFJUSxZQUFZLEdBQUcsS0FBSy9GLGFBQXhCOztBQUNBLFFBQUkrRixZQUFZLENBQUMxRSxNQUFiLEtBQXdCLENBQXhCLElBQTZCLEtBQUtuQixVQUFMLEtBQW9CLENBQXJELEVBQXdEO0FBQ3RELFdBQUssSUFBSWlCLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdvRSxLQUFLLENBQUNsRSxNQUExQixFQUFrQyxFQUFFRixDQUFwQyxFQUF1QztBQUNyQyxZQUFJdUUsSUFBSSxHQUFHSCxLQUFLLENBQUM1RCxJQUFOLENBQVdSLENBQVgsQ0FBWDs7QUFDQSxhQUFLMEUsS0FBTCxDQUFXSCxJQUFYO0FBQ0Q7QUFDRixLQUxELE1BTUs7QUFDSCxXQUFLLElBQUl2RSxHQUFDLEdBQUcsQ0FBYixFQUFnQkEsR0FBQyxHQUFHb0UsS0FBSyxDQUFDbEUsTUFBMUIsRUFBa0MsRUFBRUYsR0FBcEMsRUFBdUM7QUFDckMsWUFBSXVFLEtBQUksR0FBR0gsS0FBSyxDQUFDNUQsSUFBTixDQUFXUixHQUFYLENBQVg7O0FBRUEsYUFBSyxJQUFJNkUsU0FBUyxHQUFHLENBQXJCLEVBQXdCQSxTQUFTLEdBQUdELFlBQVksQ0FBQzFFLE1BQWpELEVBQXlELEVBQUUyRSxTQUEzRCxFQUFzRTtBQUNwRSxlQUFLbEYsT0FBTCxDQUFhbUYsVUFBYixDQUF3QixtQkFBaUJELFNBQXpDLEVBQW9ERCxZQUFZLENBQUNDLFNBQUQsQ0FBWixDQUF3QkUsU0FBNUUsRUFBdUYsS0FBS0MsaUJBQUwsRUFBdkY7QUFDRDs7QUFFRCxhQUFLTixLQUFMLENBQVdILEtBQVg7QUFDRDtBQUNGO0FBQ0Y7O1NBRURuRixlQUFBLHNCQUFjZSxJQUFkLEVBQW9CaUUsS0FBcEIsRUFBMkI7QUFDekJqRSxJQUFBQSxJQUFJLENBQUM4RSxXQUFMLENBQWlCcEgsT0FBakIsRUFEeUIsQ0FHekI7O0FBQ0EsU0FBSzhCLE9BQUwsQ0FBYUMsVUFBYixDQUF3QixZQUF4QixFQUFzQytELGlCQUFLQyxPQUFMLENBQWF2RyxTQUFiLEVBQXdCOEMsSUFBSSxDQUFDK0UsUUFBN0IsQ0FBdEM7O0FBQ0EsU0FBS3ZGLE9BQUwsQ0FBYUMsVUFBYixDQUF3QixhQUF4QixFQUF1QytELGlCQUFLQyxPQUFMLENBQWFyRyxTQUFiLEVBQXdCNEMsSUFBSSxDQUFDZ0YsUUFBN0IsQ0FBdkM7O0FBQ0EsU0FBS3hGLE9BQUwsQ0FBYUMsVUFBYixDQUF3QixnQkFBeEIsRUFBMEMrRCxpQkFBS0MsT0FBTCxDQUFhcEcsYUFBYixFQUE0QjJDLElBQUksQ0FBQzBELFlBQWpDLENBQTFDOztBQUNBLFNBQUtsRSxPQUFMLENBQWFDLFVBQWIsQ0FBd0IsY0FBeEIsRUFBd0M5QixpQkFBSzhGLE9BQUwsQ0FBYW5HLFVBQWIsRUFBeUJJLE9BQXpCLENBQXhDLEVBUHlCLENBU3pCOzs7QUFDQSxTQUFLMEUscUJBQUw7O0FBQ0EsU0FBS3dCLDBCQUFMOztBQUVBLFNBQUtZLFVBQUwsQ0FBZ0J4RSxJQUFoQixFQUFzQmlFLEtBQXRCO0FBQ0Q7O1NBRUQvRSxvQkFBQSwyQkFBbUJjLElBQW5CLEVBQXlCaUUsS0FBekIsRUFBZ0M7QUFDOUJqRSxJQUFBQSxJQUFJLENBQUM4RSxXQUFMLENBQWlCcEgsT0FBakI7QUFDQXNDLElBQUFBLElBQUksQ0FBQ2lGLFVBQUwsQ0FBZ0JySCxPQUFoQixFQUY4QixDQUk5Qjs7QUFDQSxTQUFLNEIsT0FBTCxDQUFhQyxVQUFiLENBQXdCLFlBQXhCLEVBQXNDK0QsaUJBQUtDLE9BQUwsQ0FBYXZHLFNBQWIsRUFBd0I4QyxJQUFJLENBQUMrRSxRQUE3QixDQUF0Qzs7QUFDQSxTQUFLdkYsT0FBTCxDQUFhQyxVQUFiLENBQXdCLGFBQXhCLEVBQXVDK0QsaUJBQUtDLE9BQUwsQ0FBYXJHLFNBQWIsRUFBd0I0QyxJQUFJLENBQUNnRixRQUE3QixDQUF2Qzs7QUFDQSxTQUFLeEYsT0FBTCxDQUFhQyxVQUFiLENBQXdCLGdCQUF4QixFQUEwQytELGlCQUFLQyxPQUFMLENBQWFwRyxhQUFiLEVBQTRCMkMsSUFBSSxDQUFDMEQsWUFBakMsQ0FBMUM7O0FBQ0EsU0FBS2xFLE9BQUwsQ0FBYUMsVUFBYixDQUF3QixjQUF4QixFQUF3QzlCLGlCQUFLOEYsT0FBTCxDQUFhbkcsVUFBYixFQUF5QkksT0FBekIsQ0FBeEM7O0FBRUEsU0FBSzBFLHFCQUFMOztBQUNBLFNBQUt3QiwwQkFBTCxHQVg4QixDQWE5Qjs7O0FBQ0EsU0FBSyxJQUFJL0QsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR29FLEtBQUssQ0FBQ2xFLE1BQTFCLEVBQWtDLEVBQUVGLENBQXBDLEVBQXVDO0FBQ3JDLFVBQUl1RSxJQUFJLEdBQUdILEtBQUssQ0FBQzVELElBQU4sQ0FBV1IsQ0FBWCxDQUFYLENBRHFDLENBR3JDOztBQUNBdUUsTUFBQUEsSUFBSSxDQUFDYyxJQUFMLENBQVVDLGdCQUFWLENBQTJCckgsUUFBM0I7O0FBRUFELHVCQUFLdUgsR0FBTCxDQUFTdEgsUUFBVCxFQUFtQkEsUUFBbkIsRUFBNkJKLE9BQTdCOztBQUNBMEcsTUFBQUEsSUFBSSxDQUFDRCxPQUFMLEdBQWUsQ0FBQ3RHLGlCQUFLd0gsR0FBTCxDQUFTdkgsUUFBVCxFQUFtQkYsT0FBbkIsQ0FBaEI7QUFDRDs7QUFFRCxTQUFLb0csVUFBTCxDQUFnQkMsS0FBaEI7O0FBQ0EsU0FBS08sVUFBTCxDQUFnQnhFLElBQWhCLEVBQXNCaUUsS0FBdEI7QUFDRDs7O0VBL1QwQ3FCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuICBcblxuaW1wb3J0IHsgVmVjMywgVmVjNCwgTWF0NCB9IGZyb20gJy4uLy4uL2NvcmUvdmFsdWUtdHlwZXMnO1xuaW1wb3J0IEJhc2VSZW5kZXJlciBmcm9tICcuLi9jb3JlL2Jhc2UtcmVuZGVyZXInO1xuaW1wb3J0IGVudW1zIGZyb20gJy4uL2VudW1zJztcbmltcG9ydCB7IFJlY3ljbGVQb29sIH0gZnJvbSAnLi4vbWVtb3AnO1xuXG5sZXQgX2ExNl92aWV3ID0gbmV3IEZsb2F0MzJBcnJheSgxNik7XG5sZXQgX2ExNl9wcm9qID0gbmV3IEZsb2F0MzJBcnJheSgxNik7XG5sZXQgX2ExNl92aWV3UHJvaiA9IG5ldyBGbG9hdDMyQXJyYXkoMTYpO1xubGV0IF9hNF9jYW1Qb3MgPSBuZXcgRmxvYXQzMkFycmF5KDQpO1xuXG5sZXQgX2E2NF9zaGFkb3dfbGlnaHRWaWV3UHJvaiA9IG5ldyBGbG9hdDMyQXJyYXkoNjQpO1xubGV0IF9hMTZfc2hhZG93X2xpZ2h0Vmlld1Byb2pzID0gW107XG5sZXQgX2E0X3NoYWRvd19pbmZvID0gbmV3IEZsb2F0MzJBcnJheSg0KTtcblxubGV0IF9jYW1Qb3MgPSBuZXcgVmVjNCgwLCAwLCAwLCAwKTtcbmxldCBfY2FtRndkID0gbmV3IFZlYzMoMCwgMCwgMCk7XG5sZXQgX3YzX3RtcDEgPSBuZXcgVmVjMygwLCAwLCAwKTtcblxuY29uc3QgQ0NfTUFYX0xJR0hUUyA9IDQ7XG5jb25zdCBDQ19NQVhfU0hBRE9XX0xJR0hUUyA9IDI7XG5cbmxldCBfZmxvYXQxNl9wb29sID0gbmV3IFJlY3ljbGVQb29sKCgpID0+IHtcbiAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoMTYpO1xufSwgOCk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZvcndhcmRSZW5kZXJlciBleHRlbmRzIEJhc2VSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKGRldmljZSwgYnVpbHRpbikge1xuICAgIHN1cGVyKGRldmljZSwgYnVpbHRpbik7XG5cbiAgICB0aGlzLl90aW1lID0gbmV3IEZsb2F0MzJBcnJheSg0KTtcblxuICAgIHRoaXMuX2RpcmVjdGlvbmFsTGlnaHRzID0gW107XG4gICAgdGhpcy5fcG9pbnRMaWdodHMgPSBbXTtcbiAgICB0aGlzLl9zcG90TGlnaHRzID0gW107XG4gICAgdGhpcy5fc2hhZG93TGlnaHRzID0gW107XG4gICAgdGhpcy5fYW1iaWVudExpZ2h0cyA9IFtdO1xuXG4gICAgdGhpcy5fbnVtTGlnaHRzID0gMDtcblxuICAgIHRoaXMuX2RlZmluZXMgPSB7fTtcblxuICAgIHRoaXMuX3JlZ2lzdGVyU3RhZ2UoJ3NoYWRvd2Nhc3QnLCB0aGlzLl9zaGFkb3dTdGFnZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9yZWdpc3RlclN0YWdlKCdvcGFxdWUnLCB0aGlzLl9vcGFxdWVTdGFnZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9yZWdpc3RlclN0YWdlKCd0cmFuc3BhcmVudCcsIHRoaXMuX3RyYW5zcGFyZW50U3RhZ2UuYmluZCh0aGlzKSk7XG4gIH1cblxuICByZXNldCAoKSB7XG4gICAgX2Zsb2F0MTZfcG9vbC5yZXNldCgpO1xuICAgIHN1cGVyLnJlc2V0KCk7XG4gIH1cblxuICByZW5kZXIgKHNjZW5lLCBkdCkge1xuICAgIHRoaXMucmVzZXQoKTtcblxuICAgIGlmICghQ0NfRURJVE9SKSB7XG4gICAgICB0aGlzLl90aW1lWzBdICs9IGR0O1xuICAgICAgdGhpcy5fZGV2aWNlLnNldFVuaWZvcm0oJ2NjX3RpbWUnLCB0aGlzLl90aW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLl91cGRhdGVMaWdodHMoc2NlbmUpO1xuXG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5fZGV2aWNlLl9nbC5jYW52YXM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzY2VuZS5fY2FtZXJhcy5sZW5ndGg7ICsraSkge1xuICAgICAgbGV0IHZpZXcgPSB0aGlzLl9yZXF1ZXN0VmlldygpO1xuICAgICAgbGV0IHdpZHRoID0gY2FudmFzLndpZHRoO1xuICAgICAgbGV0IGhlaWdodCA9IGNhbnZhcy5oZWlnaHQ7XG4gICAgICBsZXQgY2FtZXJhID0gc2NlbmUuX2NhbWVyYXMuZGF0YVtpXTtcbiAgICAgIGNhbWVyYS5leHRyYWN0Vmlldyh2aWV3LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICB9XG5cbiAgICAvLyByZW5kZXIgYnkgY2FtZXJhc1xuICAgIHRoaXMuX3ZpZXdQb29scy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICByZXR1cm4gKGEuX3ByaW9yaXR5IC0gYi5fcHJpb3JpdHkpO1xuICAgIH0pO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl92aWV3UG9vbHMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGxldCB2aWV3ID0gdGhpcy5fdmlld1Bvb2xzLmRhdGFbaV07XG4gICAgICB0aGlzLl9yZW5kZXIodmlldywgc2NlbmUpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGRpcmVjdCByZW5kZXIgYSBzaW5nbGUgY2FtZXJhXG4gIHJlbmRlckNhbWVyYSAoY2FtZXJhLCBzY2VuZSkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgICBcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLl9kZXZpY2UuX2dsLmNhbnZhcztcbiAgICBsZXQgd2lkdGggPSBjYW52YXMud2lkdGg7XG4gICAgbGV0IGhlaWdodCA9IGNhbnZhcy5oZWlnaHQ7XG5cbiAgICBsZXQgdmlldyA9IHRoaXMuX3JlcXVlc3RWaWV3KCk7XG4gICAgY2FtZXJhLmV4dHJhY3RWaWV3KHZpZXcsIHdpZHRoLCBoZWlnaHQpO1xuICAgIFxuICAgIHRoaXMuX3JlbmRlcih2aWV3LCBzY2VuZSk7XG4gIH1cblxuICBfdXBkYXRlTGlnaHRzIChzY2VuZSkge1xuICAgIHRoaXMuX2RpcmVjdGlvbmFsTGlnaHRzLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5fcG9pbnRMaWdodHMubGVuZ3RoID0gMDtcbiAgICB0aGlzLl9zcG90TGlnaHRzLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5fc2hhZG93TGlnaHRzLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5fYW1iaWVudExpZ2h0cy5sZW5ndGggPSAwO1xuXG4gICAgbGV0IGxpZ2h0cyA9IHNjZW5lLl9saWdodHM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaWdodHMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGxldCBsaWdodCA9IGxpZ2h0cy5kYXRhW2ldO1xuICAgICAgbGlnaHQudXBkYXRlKHRoaXMuX2RldmljZSk7XG4gICAgICBpZiAobGlnaHQuc2hhZG93VHlwZSAhPT0gZW51bXMuU0hBRE9XX05PTkUpIHtcbiAgICAgICAgaWYgKHRoaXMuX3NoYWRvd0xpZ2h0cy5sZW5ndGggPCBDQ19NQVhfU0hBRE9XX0xJR0hUUykge1xuICAgICAgICAgIHRoaXMuX3NoYWRvd0xpZ2h0cy5wdXNoKGxpZ2h0KTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdmlldyA9IHRoaXMuX3JlcXVlc3RWaWV3KCk7XG4gICAgICAgIGxpZ2h0LmV4dHJhY3RWaWV3KHZpZXcsIFsnc2hhZG93Y2FzdCddKTtcbiAgICAgIH1cbiAgICAgIGlmIChsaWdodC5fdHlwZSA9PT0gZW51bXMuTElHSFRfRElSRUNUSU9OQUwpIHtcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9uYWxMaWdodHMucHVzaChsaWdodCk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChsaWdodC5fdHlwZSA9PT0gZW51bXMuTElHSFRfUE9JTlQpIHtcbiAgICAgICAgdGhpcy5fcG9pbnRMaWdodHMucHVzaChsaWdodCk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChsaWdodC5fdHlwZSA9PT0gZW51bXMuTElHSFRfU1BPVCkge1xuICAgICAgICB0aGlzLl9zcG90TGlnaHRzLnB1c2gobGlnaHQpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuX2FtYmllbnRMaWdodHMucHVzaChsaWdodCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fdXBkYXRlRGVmaW5lcygpO1xuXG4gICAgdGhpcy5fbnVtTGlnaHRzID0gbGlnaHRzLl9jb3VudDtcbiAgfVxuXG4gIF91cGRhdGVEZWZpbmVzICgpIHtcbiAgICBsZXQgZGVmaW5lcyA9IHRoaXMuX2RlZmluZXM7XG4gICAgZGVmaW5lcy5DQ19OVU1fRElSX0xJR0hUUyA9IE1hdGgubWluKENDX01BWF9MSUdIVFMsIHRoaXMuX2RpcmVjdGlvbmFsTGlnaHRzLmxlbmd0aCk7XG4gICAgZGVmaW5lcy5DQ19OVU1fUE9JTlRfTElHSFRTID0gTWF0aC5taW4oQ0NfTUFYX0xJR0hUUywgdGhpcy5fcG9pbnRMaWdodHMubGVuZ3RoKTtcbiAgICBkZWZpbmVzLkNDX05VTV9TUE9UX0xJR0hUUyA9IE1hdGgubWluKENDX01BWF9MSUdIVFMsIHRoaXMuX3Nwb3RMaWdodHMubGVuZ3RoKTtcbiAgICBkZWZpbmVzLkNDX05VTV9BTUJJRU5UX0xJR0hUUyA9IE1hdGgubWluKENDX01BWF9MSUdIVFMsIHRoaXMuX2FtYmllbnRMaWdodHMubGVuZ3RoKTtcblxuICAgIGRlZmluZXMuQ0NfTlVNX1NIQURPV19MSUdIVFMgPSBNYXRoLm1pbihDQ19NQVhfTElHSFRTLCB0aGlzLl9zaGFkb3dMaWdodHMubGVuZ3RoKTtcbiAgfVxuXG4gIF9zdWJtaXRMaWdodHNVbmlmb3JtcyAoKSB7XG4gICAgbGV0IGRldmljZSA9IHRoaXMuX2RldmljZTtcblxuICAgIGlmICh0aGlzLl9kaXJlY3Rpb25hbExpZ2h0cy5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgZGlyZWN0aW9ucyA9IF9mbG9hdDE2X3Bvb2wuYWRkKCk7XG4gICAgICBsZXQgY29sb3JzID0gX2Zsb2F0MTZfcG9vbC5hZGQoKTtcbiAgICAgIGxldCBsaWdodE51bSA9IE1hdGgubWluKENDX01BWF9MSUdIVFMsIHRoaXMuX2RpcmVjdGlvbmFsTGlnaHRzLmxlbmd0aCk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpZ2h0TnVtOyArK2kpIHtcbiAgICAgICAgbGV0IGxpZ2h0ID0gdGhpcy5fZGlyZWN0aW9uYWxMaWdodHNbaV07XG4gICAgICAgIGxldCBpbmRleCA9IGkgKiA0O1xuICAgICAgICBkaXJlY3Rpb25zLnNldChsaWdodC5fZGlyZWN0aW9uVW5pZm9ybSwgaW5kZXgpO1xuICAgICAgICBjb2xvcnMuc2V0KGxpZ2h0Ll9jb2xvclVuaWZvcm0sIGluZGV4KTtcbiAgICAgIH1cblxuICAgICAgZGV2aWNlLnNldFVuaWZvcm0oJ2NjX2RpckxpZ2h0RGlyZWN0aW9uJywgZGlyZWN0aW9ucyk7XG4gICAgICBkZXZpY2Uuc2V0VW5pZm9ybSgnY2NfZGlyTGlnaHRDb2xvcicsIGNvbG9ycyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3BvaW50TGlnaHRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBwb3NpdGlvbkFuZFJhbmdlcyA9IF9mbG9hdDE2X3Bvb2wuYWRkKCk7XG4gICAgICBsZXQgY29sb3JzID0gX2Zsb2F0MTZfcG9vbC5hZGQoKTtcbiAgICAgIGxldCBsaWdodE51bSA9IE1hdGgubWluKENDX01BWF9MSUdIVFMsIHRoaXMuX3BvaW50TGlnaHRzLmxlbmd0aCk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpZ2h0TnVtOyArK2kpIHtcbiAgICAgICAgbGV0IGxpZ2h0ID0gdGhpcy5fcG9pbnRMaWdodHNbaV07XG4gICAgICAgIGxldCBpbmRleCA9IGkgKiA0O1xuICAgICAgICBwb3NpdGlvbkFuZFJhbmdlcy5zZXQobGlnaHQuX3Bvc2l0aW9uVW5pZm9ybSwgaW5kZXgpO1xuICAgICAgICBwb3NpdGlvbkFuZFJhbmdlc1tpbmRleCszXSA9IGxpZ2h0Ll9yYW5nZTtcbiAgICAgICAgY29sb3JzLnNldChsaWdodC5fY29sb3JVbmlmb3JtLCBpbmRleCk7XG4gICAgICB9XG5cbiAgICAgIGRldmljZS5zZXRVbmlmb3JtKCdjY19wb2ludExpZ2h0UG9zaXRpb25BbmRSYW5nZScsIHBvc2l0aW9uQW5kUmFuZ2VzKTtcbiAgICAgIGRldmljZS5zZXRVbmlmb3JtKCdjY19wb2ludExpZ2h0Q29sb3InLCBjb2xvcnMpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9zcG90TGlnaHRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBwb3NpdGlvbkFuZFJhbmdlcyA9IF9mbG9hdDE2X3Bvb2wuYWRkKCk7XG4gICAgICBsZXQgZGlyZWN0aW9ucyA9IF9mbG9hdDE2X3Bvb2wuYWRkKCk7XG4gICAgICBsZXQgY29sb3JzID0gX2Zsb2F0MTZfcG9vbC5hZGQoKTtcbiAgICAgIGxldCBsaWdodE51bSA9IE1hdGgubWluKENDX01BWF9MSUdIVFMsIHRoaXMuX3Nwb3RMaWdodHMubGVuZ3RoKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlnaHROdW07ICsraSkge1xuICAgICAgICBsZXQgbGlnaHQgPSB0aGlzLl9zcG90TGlnaHRzW2ldO1xuICAgICAgICBsZXQgaW5kZXggPSBpICogNDtcbiAgICAgICAgXG4gICAgICAgIHBvc2l0aW9uQW5kUmFuZ2VzLnNldChsaWdodC5fcG9zaXRpb25Vbmlmb3JtLCBpbmRleCk7XG4gICAgICAgIHBvc2l0aW9uQW5kUmFuZ2VzW2luZGV4KzNdID0gbGlnaHQuX3JhbmdlO1xuXG4gICAgICAgIGRpcmVjdGlvbnMuc2V0KGxpZ2h0Ll9kaXJlY3Rpb25Vbmlmb3JtLCBpbmRleCk7XG4gICAgICAgIGRpcmVjdGlvbnNbaW5kZXgrM10gPSBsaWdodC5fc3BvdFVuaWZvcm1bMF07XG5cbiAgICAgICAgY29sb3JzLnNldChsaWdodC5fY29sb3JVbmlmb3JtLCBpbmRleCk7XG4gICAgICAgIGNvbG9yc1tpbmRleCszXSA9IGxpZ2h0Ll9zcG90VW5pZm9ybVsxXTtcbiAgICAgIH1cblxuICAgICAgZGV2aWNlLnNldFVuaWZvcm0oJ2NjX3Nwb3RMaWdodFBvc2l0aW9uQW5kUmFuZ2UnLCBwb3NpdGlvbkFuZFJhbmdlcyk7XG4gICAgICBkZXZpY2Uuc2V0VW5pZm9ybSgnY2Nfc3BvdExpZ2h0RGlyZWN0aW9uJywgZGlyZWN0aW9ucyk7XG4gICAgICBkZXZpY2Uuc2V0VW5pZm9ybSgnY2Nfc3BvdExpZ2h0Q29sb3InLCBjb2xvcnMpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9hbWJpZW50TGlnaHRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBjb2xvcnMgPSBfZmxvYXQxNl9wb29sLmFkZCgpO1xuICAgICAgbGV0IGxpZ2h0TnVtID0gTWF0aC5taW4oQ0NfTUFYX0xJR0hUUywgdGhpcy5fYW1iaWVudExpZ2h0cy5sZW5ndGgpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaWdodE51bTsgKytpKSB7XG4gICAgICAgIGxldCBsaWdodCA9IHRoaXMuX2FtYmllbnRMaWdodHNbaV07XG4gICAgICAgIGxldCBpbmRleCA9IGkgKiA0O1xuICAgICAgICBjb2xvcnMuc2V0KGxpZ2h0Ll9jb2xvclVuaWZvcm0sIGluZGV4KTtcbiAgICAgIH1cblxuICAgICAgZGV2aWNlLnNldFVuaWZvcm0oJ2NjX2FtYmllbnRDb2xvcicsIGNvbG9ycyk7XG4gICAgfVxuICB9XG5cbiAgX3N1Ym1pdFNoYWRvd1N0YWdlVW5pZm9ybXModmlldykge1xuXG4gICAgbGV0IGxpZ2h0ID0gdmlldy5fc2hhZG93TGlnaHQ7XG5cbiAgICBsZXQgc2hhZG93SW5mbyA9IF9hNF9zaGFkb3dfaW5mbztcbiAgICBzaGFkb3dJbmZvWzBdID0gbGlnaHQuc2hhZG93TWluRGVwdGg7XG4gICAgc2hhZG93SW5mb1sxXSA9IGxpZ2h0LnNoYWRvd01heERlcHRoO1xuICAgIHNoYWRvd0luZm9bMl0gPSBsaWdodC5zaGFkb3dEZXB0aFNjYWxlO1xuICAgIHNoYWRvd0luZm9bM10gPSBsaWdodC5zaGFkb3dEYXJrbmVzcztcblxuICAgIHRoaXMuX2RldmljZS5zZXRVbmlmb3JtKCdjY19zaGFkb3dfbWFwX2xpZ2h0Vmlld1Byb2pNYXRyaXgnLCBNYXQ0LnRvQXJyYXkoX2ExNl92aWV3UHJvaiwgdmlldy5fbWF0Vmlld1Byb2opKTtcbiAgICB0aGlzLl9kZXZpY2Uuc2V0VW5pZm9ybSgnY2Nfc2hhZG93X21hcF9pbmZvJywgc2hhZG93SW5mbyk7XG4gICAgdGhpcy5fZGV2aWNlLnNldFVuaWZvcm0oJ2NjX3NoYWRvd19tYXBfYmlhcycsIGxpZ2h0LnNoYWRvd0JpYXMpO1xuICB9XG5cbiAgX3N1Ym1pdE90aGVyU3RhZ2VzVW5pZm9ybXMoKSB7XG4gICAgbGV0IHNoYWRvd0luZm8gPSBfZmxvYXQxNl9wb29sLmFkZCgpO1xuICAgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fc2hhZG93TGlnaHRzLmxlbmd0aDsgKytpKSB7XG4gICAgICBsZXQgbGlnaHQgPSB0aGlzLl9zaGFkb3dMaWdodHNbaV07XG4gICAgICBsZXQgdmlldyA9IF9hMTZfc2hhZG93X2xpZ2h0Vmlld1Byb2pzW2ldO1xuICAgICAgaWYgKCF2aWV3KSB7XG4gICAgICAgIHZpZXcgPSBfYTE2X3NoYWRvd19saWdodFZpZXdQcm9qc1tpXSA9IG5ldyBGbG9hdDMyQXJyYXkoX2E2NF9zaGFkb3dfbGlnaHRWaWV3UHJvai5idWZmZXIsIGkgKiA2NCwgMTYpO1xuICAgICAgfVxuICAgICAgTWF0NC50b0FycmF5KHZpZXcsIGxpZ2h0LnZpZXdQcm9qTWF0cml4KTtcbiAgICAgIFxuICAgICAgbGV0IGluZm9JbmRleCA9IGkqNDtcbiAgICAgIHNoYWRvd0luZm9baW5mb0luZGV4XSA9IGxpZ2h0LnNoYWRvd01pbkRlcHRoO1xuICAgICAgc2hhZG93SW5mb1tpbmZvSW5kZXgrMV0gPSBsaWdodC5zaGFkb3dNYXhEZXB0aDtcbiAgICAgIHNoYWRvd0luZm9baW5mb0luZGV4KzJdID0gbGlnaHQuc2hhZG93RGVwdGhTY2FsZTtcbiAgICAgIHNoYWRvd0luZm9baW5mb0luZGV4KzNdID0gbGlnaHQuc2hhZG93RGFya25lc3M7XG4gICAgfVxuXG4gICAgdGhpcy5fZGV2aWNlLnNldFVuaWZvcm0oYGNjX3NoYWRvd19saWdodFZpZXdQcm9qTWF0cml4YCwgX2E2NF9zaGFkb3dfbGlnaHRWaWV3UHJvaik7XG4gICAgdGhpcy5fZGV2aWNlLnNldFVuaWZvcm0oYGNjX3NoYWRvd19pbmZvYCwgc2hhZG93SW5mbyk7XG4gICAgLy8gdGhpcy5fZGV2aWNlLnNldFVuaWZvcm0oYGNjX2ZydXN0dW1FZGdlRmFsbG9mZl8ke2luZGV4fWAsIGxpZ2h0LmZydXN0dW1FZGdlRmFsbG9mZik7XG4gIH1cblxuICBfc29ydEl0ZW1zIChpdGVtcykge1xuICAgIC8vIHNvcnQgaXRlbXNcbiAgICBpdGVtcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAvLyBpZiAoYS5sYXllciAhPT0gYi5sYXllcikge1xuICAgICAgLy8gICByZXR1cm4gYS5sYXllciAtIGIubGF5ZXI7XG4gICAgICAvLyB9XG5cbiAgICAgIGlmIChhLnBhc3Nlcy5sZW5ndGggIT09IGIucGFzc2VzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gYS5wYXNzZXMubGVuZ3RoIC0gYi5wYXNzZXMubGVuZ3RoO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYS5zb3J0S2V5IC0gYi5zb3J0S2V5O1xuICAgIH0pO1xuICB9XG5cbiAgX3NoYWRvd1N0YWdlICh2aWV3LCBpdGVtcykge1xuICAgIC8vIHVwZGF0ZSByZW5kZXJpbmdcbiAgICB0aGlzLl9zdWJtaXRTaGFkb3dTdGFnZVVuaWZvcm1zKHZpZXcpO1xuXG4gICAgLy8gdGhpcy5fc29ydEl0ZW1zKGl0ZW1zKTtcblxuICAgIC8vIGRyYXcgaXRcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgKytpKSB7XG4gICAgICBsZXQgaXRlbSA9IGl0ZW1zLmRhdGFbaV07XG4gICAgICBpZiAoaXRlbS5lZmZlY3QuZ2V0RGVmaW5lKCdDQ19DQVNUSU5HX1NIQURPVycpKSB7XG4gICAgICAgIHRoaXMuX2RyYXcoaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX2RyYXdJdGVtcyAodmlldywgaXRlbXMpIHtcbiAgICBsZXQgc2hhZG93TGlnaHRzID0gdGhpcy5fc2hhZG93TGlnaHRzO1xuICAgIGlmIChzaGFkb3dMaWdodHMubGVuZ3RoID09PSAwICYmIHRoaXMuX251bUxpZ2h0cyA9PT0gMCkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7ICsraSkge1xuICAgICAgICBsZXQgaXRlbSA9IGl0ZW1zLmRhdGFbaV07XG4gICAgICAgIHRoaXMuX2RyYXcoaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7ICsraSkge1xuICAgICAgICBsZXQgaXRlbSA9IGl0ZW1zLmRhdGFbaV07XG5cbiAgICAgICAgZm9yIChsZXQgc2hhZG93SWR4ID0gMDsgc2hhZG93SWR4IDwgc2hhZG93TGlnaHRzLmxlbmd0aDsgKytzaGFkb3dJZHgpIHtcbiAgICAgICAgICB0aGlzLl9kZXZpY2Uuc2V0VGV4dHVyZSgnY2Nfc2hhZG93X21hcF8nK3NoYWRvd0lkeCwgc2hhZG93TGlnaHRzW3NoYWRvd0lkeF0uc2hhZG93TWFwLCB0aGlzLl9hbGxvY1RleHR1cmVVbml0KCkpOyAgXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9kcmF3KGl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9vcGFxdWVTdGFnZSAodmlldywgaXRlbXMpIHtcbiAgICB2aWV3LmdldFBvc2l0aW9uKF9jYW1Qb3MpO1xuXG4gICAgLy8gdXBkYXRlIHVuaWZvcm1zXG4gICAgdGhpcy5fZGV2aWNlLnNldFVuaWZvcm0oJ2NjX21hdFZpZXcnLCBNYXQ0LnRvQXJyYXkoX2ExNl92aWV3LCB2aWV3Ll9tYXRWaWV3KSk7XG4gICAgdGhpcy5fZGV2aWNlLnNldFVuaWZvcm0oJ2NjX21hdHBQcm9qJywgTWF0NC50b0FycmF5KF9hMTZfcHJvaiwgdmlldy5fbWF0UHJvaikpO1xuICAgIHRoaXMuX2RldmljZS5zZXRVbmlmb3JtKCdjY19tYXRWaWV3UHJvaicsIE1hdDQudG9BcnJheShfYTE2X3ZpZXdQcm9qLCB2aWV3Ll9tYXRWaWV3UHJvaikpO1xuICAgIHRoaXMuX2RldmljZS5zZXRVbmlmb3JtKCdjY19jYW1lcmFQb3MnLCBWZWM0LnRvQXJyYXkoX2E0X2NhbVBvcywgX2NhbVBvcykpO1xuXG4gICAgLy8gdXBkYXRlIHJlbmRlcmluZ1xuICAgIHRoaXMuX3N1Ym1pdExpZ2h0c1VuaWZvcm1zKCk7XG4gICAgdGhpcy5fc3VibWl0T3RoZXJTdGFnZXNVbmlmb3JtcygpO1xuXG4gICAgdGhpcy5fZHJhd0l0ZW1zKHZpZXcsIGl0ZW1zKTtcbiAgfVxuXG4gIF90cmFuc3BhcmVudFN0YWdlICh2aWV3LCBpdGVtcykge1xuICAgIHZpZXcuZ2V0UG9zaXRpb24oX2NhbVBvcyk7XG4gICAgdmlldy5nZXRGb3J3YXJkKF9jYW1Gd2QpO1xuXG4gICAgLy8gdXBkYXRlIHVuaWZvcm1zXG4gICAgdGhpcy5fZGV2aWNlLnNldFVuaWZvcm0oJ2NjX21hdFZpZXcnLCBNYXQ0LnRvQXJyYXkoX2ExNl92aWV3LCB2aWV3Ll9tYXRWaWV3KSk7XG4gICAgdGhpcy5fZGV2aWNlLnNldFVuaWZvcm0oJ2NjX21hdHBQcm9qJywgTWF0NC50b0FycmF5KF9hMTZfcHJvaiwgdmlldy5fbWF0UHJvaikpO1xuICAgIHRoaXMuX2RldmljZS5zZXRVbmlmb3JtKCdjY19tYXRWaWV3UHJvaicsIE1hdDQudG9BcnJheShfYTE2X3ZpZXdQcm9qLCB2aWV3Ll9tYXRWaWV3UHJvaikpO1xuICAgIHRoaXMuX2RldmljZS5zZXRVbmlmb3JtKCdjY19jYW1lcmFQb3MnLCBWZWM0LnRvQXJyYXkoX2E0X2NhbVBvcywgX2NhbVBvcykpO1xuXG4gICAgdGhpcy5fc3VibWl0TGlnaHRzVW5pZm9ybXMoKTtcbiAgICB0aGlzLl9zdWJtaXRPdGhlclN0YWdlc1VuaWZvcm1zKCk7XG5cbiAgICAvLyBjYWxjdWxhdGUgemRpc3RcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgKytpKSB7XG4gICAgICBsZXQgaXRlbSA9IGl0ZW1zLmRhdGFbaV07XG5cbiAgICAgIC8vIFRPRE86IHdlIHNob3VsZCB1c2UgbWVzaCBjZW50ZXIgaW5zdGVhZCFcbiAgICAgIGl0ZW0ubm9kZS5nZXRXb3JsZFBvc2l0aW9uKF92M190bXAxKTtcblxuICAgICAgVmVjMy5zdWIoX3YzX3RtcDEsIF92M190bXAxLCBfY2FtUG9zKTtcbiAgICAgIGl0ZW0uc29ydEtleSA9IC1WZWMzLmRvdChfdjNfdG1wMSwgX2NhbUZ3ZCk7XG4gICAgfVxuXG4gICAgdGhpcy5fc29ydEl0ZW1zKGl0ZW1zKTtcbiAgICB0aGlzLl9kcmF3SXRlbXModmlldywgaXRlbXMpO1xuICB9XG59XG4iXX0=