
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/CCLightComponent.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _enums = _interopRequireDefault(require("../../renderer/enums"));

var _color = _interopRequireDefault(require("../value-types/color"));

var _valueTypes = require("../value-types");

var _index = _interopRequireDefault(require("../renderer/index"));

var _CCEnum = _interopRequireDefault(require("../platform/CCEnum"));

var _CCComponent2 = _interopRequireDefault(require("../components/CCComponent"));

var _CCClassDecorator = require("../platform/CCClassDecorator");

var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _class3, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

var RendererLight = null;

if (CC_JSB && CC_NATIVERENDERER) {
  // @ts-ignore
  RendererLight = window.renderer.Light;
} else {
  // @ts-ignore
  RendererLight = require('../../renderer/scene/light');
}

/**
 * !#en The light source type
 *
 * !#zh 光源类型
 * @static
 * @enum Light.Type
 */
var LightType = (0, _CCEnum["default"])({
  /**
   * !#en The direction of light
   *
   * !#zh 平行光
   * @property {Number} DIRECTIONAL
   * @readonly
   */
  DIRECTIONAL: 0,

  /**
   * !#en The point of light
   *
   * !#zh 点光源
   * @property {Number} POINT
   * @readonly
   */
  POINT: 1,

  /**
   * !#en The spot of light
   *
   * !#zh 聚光灯
   * @property {Number} SPOT
   * @readonly
   */
  SPOT: 2,

  /**
   * !#en The ambient light
   * !#zh 环境光
   * @property {Number} AMBIENT
   * @readonly
   */
  AMBIENT: 3
});
/**
 * !#en The shadow type
 *
 * !#zh 阴影类型
 * @static
 * @enum Light.ShadowType
 */

var LightShadowType = (0, _CCEnum["default"])({
  /**
   * !#en No shadows
   *
   * !#zh 阴影关闭
   * @property NONE
   * @readonly
   * @type {Number}
   */
  NONE: 0,
  // /**
  //  * !#en Soft shadows
  //  *
  //  * !#zh 软阴影
  //  * @property SOFT
  //  * @readonly
  //  * @type {Number}
  //  */
  // SOFT: 1,

  /**
   * !#en Hard shadows
   *
   * !#zh 阴硬影
   * @property HARD
   * @readonly
   * @type {Number}
   */
  HARD: 2
});
/**
 * !#en The Light Component
 *
 * !#zh 光源组件
 * @class Light
 * @extends Component
 */

var Light = (_dec = (0, _CCClassDecorator.ccclass)('cc.Light'), _dec2 = (0, _CCClassDecorator.menu)('i18n:MAIN_MENU.component.renderers/Light'), _dec3 = (0, _CCClassDecorator.inspector)('packages://inspector/inspectors/comps/light.js'), _dec4 = (0, _CCClassDecorator.property)({
  type: LightType
}), _dec5 = (0, _CCClassDecorator.property)({
  type: LightShadowType
}), _dec(_class = _dec2(_class = (0, _CCClassDecorator.executeInEditMode)(_class = _dec3(_class = (_class2 = (_temp = _class3 =
/*#__PURE__*/
function (_CCComponent) {
  _inheritsLoose(Light, _CCComponent);

  _createClass(Light, [{
    key: "type",

    /**
     * !#en The light source type，currently we have directional, point, spot three type.
     * !#zh 光源类型，目前有 平行光，聚光灯，点光源 三种类型
     * @type {LightType}
     */
    get: function get() {
      return this._type;
    },
    set: function set(val) {
      this._type = val;
      var type = _enums["default"].LIGHT_DIRECTIONAL;

      if (val === LightType.POINT) {
        type = _enums["default"].LIGHT_POINT;
      } else if (val === LightType.SPOT) {
        type = _enums["default"].LIGHT_SPOT;
      } else if (val === LightType.AMBIENT) {
        type = _enums["default"].LIGHT_AMBIENT;
      }

      this._light.setType(type);
    }
    /**
     * !#en The light source color
     * !#zh 光源颜色
     * @type {Color}
     */

  }, {
    key: "color",
    get: function get() {
      return this._color;
    },
    set: function set(val) {
      this._color = val;

      this._light.setColor(val.r / 255, val.g / 255, val.b / 255);
    }
    /**
     * !#en The light source intensity
     *
     * !#zh 光源强度
     * @type {Number}
     */

  }, {
    key: "intensity",
    get: function get() {
      return this._intensity;
    },
    set: function set(val) {
      this._intensity = val;

      this._light.setIntensity(val);
    }
    /**
     * !#en The light range, used for spot and point light
     *
     * !#zh 针对聚光灯和点光源设置光源范围
     * @type {Number}
     */

  }, {
    key: "range",
    get: function get() {
      return this._range;
    },
    set: function set(val) {
      this._range = val;

      this._light.setRange(val);
    }
    /**
     * !#en The spot light cone angle
     *
     * !#zh 聚光灯锥角
     * @type {Number}
     */

  }, {
    key: "spotAngle",
    get: function get() {
      return this._spotAngle;
    },
    set: function set(val) {
      this._spotAngle = val;

      this._light.setSpotAngle((0, _valueTypes.toRadian)(val));
    }
    /**
     * !#en The spot light exponential
     *
     * !#zh 聚光灯指数
     * @type {Number}
     */

  }, {
    key: "spotExp",
    get: function get() {
      return this._spotExp;
    },
    set: function set(val) {
      this._spotExp = val;

      this._light.setSpotExp(val);
    }
    /**
     * !#en The shadow type
     *
     * !#zh 阴影类型
     * @type {Number} shadowType
     */

  }, {
    key: "shadowType",
    get: function get() {
      return this._shadowType;
    },
    set: function set(val) {
      this._shadowType = val;
      var type = _enums["default"].SHADOW_NONE;

      if (val === LightShadowType.HARD) {
        type = _enums["default"].SHADOW_HARD;
      } else if (val === LightShadowType.SOFT) {
        type = _enums["default"].SHADOW_SOFT;
      }

      this._light.setShadowType(type);
    }
    /**
     * !#en The shadow resolution
     *
     * !#zh 阴影分辨率
     *
     * @type {Number}
     */

  }, {
    key: "shadowResolution",
    get: function get() {
      return this._shadowResolution;
    },
    set: function set(val) {
      this._shadowResolution = val;

      this._light.setShadowResolution(val);
    }
    /**
     * !#en The shadow darkness
     *
     * !#zh 阴影灰度值
     *
     * @type {Number}
     */

  }, {
    key: "shadowDarkness",
    get: function get() {
      return this._shadowDarkness;
    },
    set: function set(val) {
      this._shadowDarkness = val;

      this._light.setShadowDarkness(val);
    }
    /**
     * !#en The shadow min depth
     *
     * !#zh 阴影最小深度
     *
     * @type {Number}
     */

  }, {
    key: "shadowMinDepth",
    get: function get() {
      return this._shadowMinDepth;
    },
    set: function set(val) {
      this._shadowMinDepth = val;

      this._light.setShadowMinDepth(val);
    }
    /**
     * !#en The shadow max depth
     *
     * !#zh 阴影最大深度
     *
     * @type {Number}
     */

  }, {
    key: "shadowMaxDepth",
    get: function get() {
      return this._shadowMaxDepth;
    },
    set: function set(val) {
      this._shadowMaxDepth = val;

      this._light.setShadowMaxDepth(val);
    }
    /**
     * !#en The shadow depth scale
     *
     * !#zh 阴影深度比例
     *
     * @type {Number}
     */

  }, {
    key: "shadowDepthScale",
    get: function get() {
      return this._shadowDepthScale;
    },
    set: function set(val) {
      this._shadowDepthScale = val;

      this._light.setShadowDepthScale(val);
    }
    /**
     * !#en The shadow frustum size
     *
     * !#zh 阴影截锥体大小
     *
     * @type {Number}
     */

  }, {
    key: "shadowFrustumSize",
    get: function get() {
      return this._shadowFrustumSize;
    },
    set: function set(val) {
      this._shadowFrustumSize = val;

      this._light.setShadowFrustumSize(val);
    } // /**
    //  * !#en The shadow bias
    //  *
    //  * !#zh 阴影偏移量
    //  *
    //  * @type {Number}
    //  */
    // @property
    // get shadowBias() {
    //     return this._shadowBias;
    // }
    // set shadowBias(val) {
    //     this._shadowBias = val;
    //     this._light.setShadowBias(val);
    // }

  }]);

  function Light() {
    var _this;

    _this = _CCComponent.call(this) || this;

    _initializerDefineProperty(_this, "_type", _descriptor, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_color", _descriptor2, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_intensity", _descriptor3, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_range", _descriptor4, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_spotAngle", _descriptor5, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_spotExp", _descriptor6, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_shadowType", _descriptor7, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_shadowResolution", _descriptor8, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_shadowDarkness", _descriptor9, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_shadowMinDepth", _descriptor10, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_shadowMaxDepth", _descriptor11, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_shadowDepthScale", _descriptor12, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_shadowFrustumSize", _descriptor13, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_shadowBias", _descriptor14, _assertThisInitialized(_this));

    _this._light = new RendererLight();
    return _this;
  }

  var _proto = Light.prototype;

  _proto.onLoad = function onLoad() {
    this._light.setNode(this.node);

    this.type = this._type;
    this.color = this._color;
    this.intensity = this._intensity;
    this.range = this._range;
    this.spotAngle = this._spotAngle;
    this.spotExp = this._spotExp;
    this.shadowType = this._shadowType;
    this.shadowResolution = this._shadowResolution;
    this.shadowDarkness = this._shadowDarkness;
    this.shadowMaxDepth = this._shadowMaxDepth;
    this.shadowDepthScale = this._shadowDepthScale;
    this.shadowFrustumSize = this._shadowFrustumSize;
    this.shadowBias = this._shadowBias;
  };

  _proto.onEnable = function onEnable() {
    _index["default"].scene.addLight(this._light);
  };

  _proto.onDisable = function onDisable() {
    _index["default"].scene.removeLight(this._light);
  };

  return Light;
}(_CCComponent2["default"]), _class3.Type = LightType, _class3.ShadowType = LightShadowType, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_type", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return LightType.DIRECTIONAL;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_color", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return _color["default"].WHITE;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_intensity", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_range", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1000;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_spotAngle", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 60;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_spotExp", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "_shadowType", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return LightShadowType.NONE;
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "_shadowResolution", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1024;
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "_shadowDarkness", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0.5;
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "_shadowMinDepth", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1;
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "_shadowMaxDepth", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 4096;
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "_shadowDepthScale", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 250;
  }
}), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "_shadowFrustumSize", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1024;
  }
}), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "_shadowBias", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0.0005;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "type", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "type"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "color", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "color"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "intensity", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "intensity"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "range", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "range"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "spotAngle", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "spotAngle"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "spotExp", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "spotExp"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "shadowType", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "shadowType"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "shadowResolution", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "shadowResolution"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "shadowDarkness", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "shadowDarkness"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "shadowMinDepth", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "shadowMinDepth"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "shadowMaxDepth", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "shadowMaxDepth"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "shadowDepthScale", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "shadowDepthScale"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "shadowFrustumSize", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "shadowFrustumSize"), _class2.prototype)), _class2)) || _class) || _class) || _class) || _class);
exports["default"] = Light;
cc.Light = Light;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDTGlnaHRDb21wb25lbnQuanMiXSwibmFtZXMiOlsiUmVuZGVyZXJMaWdodCIsIkNDX0pTQiIsIkNDX05BVElWRVJFTkRFUkVSIiwid2luZG93IiwicmVuZGVyZXIiLCJMaWdodCIsInJlcXVpcmUiLCJMaWdodFR5cGUiLCJESVJFQ1RJT05BTCIsIlBPSU5UIiwiU1BPVCIsIkFNQklFTlQiLCJMaWdodFNoYWRvd1R5cGUiLCJOT05FIiwiSEFSRCIsInR5cGUiLCJleGVjdXRlSW5FZGl0TW9kZSIsIl90eXBlIiwidmFsIiwiZW51bXMiLCJMSUdIVF9ESVJFQ1RJT05BTCIsIkxJR0hUX1BPSU5UIiwiTElHSFRfU1BPVCIsIkxJR0hUX0FNQklFTlQiLCJfbGlnaHQiLCJzZXRUeXBlIiwiX2NvbG9yIiwic2V0Q29sb3IiLCJyIiwiZyIsImIiLCJfaW50ZW5zaXR5Iiwic2V0SW50ZW5zaXR5IiwiX3JhbmdlIiwic2V0UmFuZ2UiLCJfc3BvdEFuZ2xlIiwic2V0U3BvdEFuZ2xlIiwiX3Nwb3RFeHAiLCJzZXRTcG90RXhwIiwiX3NoYWRvd1R5cGUiLCJTSEFET1dfTk9ORSIsIlNIQURPV19IQVJEIiwiU09GVCIsIlNIQURPV19TT0ZUIiwic2V0U2hhZG93VHlwZSIsIl9zaGFkb3dSZXNvbHV0aW9uIiwic2V0U2hhZG93UmVzb2x1dGlvbiIsIl9zaGFkb3dEYXJrbmVzcyIsInNldFNoYWRvd0RhcmtuZXNzIiwiX3NoYWRvd01pbkRlcHRoIiwic2V0U2hhZG93TWluRGVwdGgiLCJfc2hhZG93TWF4RGVwdGgiLCJzZXRTaGFkb3dNYXhEZXB0aCIsIl9zaGFkb3dEZXB0aFNjYWxlIiwic2V0U2hhZG93RGVwdGhTY2FsZSIsIl9zaGFkb3dGcnVzdHVtU2l6ZSIsInNldFNoYWRvd0ZydXN0dW1TaXplIiwib25Mb2FkIiwic2V0Tm9kZSIsIm5vZGUiLCJjb2xvciIsImludGVuc2l0eSIsInJhbmdlIiwic3BvdEFuZ2xlIiwic3BvdEV4cCIsInNoYWRvd1R5cGUiLCJzaGFkb3dSZXNvbHV0aW9uIiwic2hhZG93RGFya25lc3MiLCJzaGFkb3dNYXhEZXB0aCIsInNoYWRvd0RlcHRoU2NhbGUiLCJzaGFkb3dGcnVzdHVtU2l6ZSIsInNoYWRvd0JpYXMiLCJfc2hhZG93QmlhcyIsIm9uRW5hYmxlIiwic2NlbmUiLCJhZGRMaWdodCIsIm9uRGlzYWJsZSIsInJlbW92ZUxpZ2h0IiwiQ0NDb21wb25lbnQiLCJUeXBlIiwiU2hhZG93VHlwZSIsInByb3BlcnR5IiwiQ29sb3IiLCJXSElURSIsImNjIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBOztBQUNBOztBQUNBOztBQVdBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVpBLElBQUlBLGFBQWEsR0FBRyxJQUFwQjs7QUFDQSxJQUFJQyxNQUFNLElBQUlDLGlCQUFkLEVBQWlDO0FBQzdCO0FBQ0FGLEVBQUFBLGFBQWEsR0FBR0csTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxLQUFoQztBQUNILENBSEQsTUFHTztBQUNIO0FBQ0FMLEVBQUFBLGFBQWEsR0FBR00sT0FBTyxDQUFDLDRCQUFELENBQXZCO0FBQ0g7O0FBT0Q7Ozs7Ozs7QUFPQSxJQUFNQyxTQUFTLEdBQUcsd0JBQUs7QUFDbkI7Ozs7Ozs7QUFPQUMsRUFBQUEsV0FBVyxFQUFFLENBUk07O0FBU25COzs7Ozs7O0FBT0FDLEVBQUFBLEtBQUssRUFBRSxDQWhCWTs7QUFpQm5COzs7Ozs7O0FBT0FDLEVBQUFBLElBQUksRUFBRSxDQXhCYTs7QUEwQm5COzs7Ozs7QUFNQUMsRUFBQUEsT0FBTyxFQUFFO0FBaENVLENBQUwsQ0FBbEI7QUFtQ0E7Ozs7Ozs7O0FBT0EsSUFBTUMsZUFBZSxHQUFHLHdCQUFLO0FBQ3pCOzs7Ozs7OztBQVFBQyxFQUFBQSxJQUFJLEVBQUUsQ0FUbUI7QUFVekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBOzs7Ozs7OztBQVFBQyxFQUFBQSxJQUFJLEVBQUU7QUEzQm1CLENB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LFNBQVMsQ0FBQ0M7OzJFQUVqQnlFOzs7OztXQUNRQyxrQkFBTUM7OytFQUVkRjs7Ozs7V0FDWTs7MkVBRVpBOzs7OztXQUNROzsrRUFFUkE7Ozs7O1dBQ1k7OzZFQUVaQTs7Ozs7V0FDVTs7Z0ZBRVZBOzs7OztXQUNhckUsZUFBZSxDQUFDQzs7c0ZBRTdCb0U7Ozs7O1dBQ21COztvRkFFbkJBOzs7OztXQUNpQjs7cUZBRWpCQTs7Ozs7V0FDaUI7O3FGQUVqQkE7Ozs7O1dBQ2lCOzt1RkFFakJBOzs7OztXQUNtQjs7d0ZBRW5CQTs7Ozs7V0FDb0I7O2lGQUVwQkE7Ozs7O1dBQ2E7O3lNQWtDYkEseUtBZ0JBQSx5S0FnQkFBLHlLQWdCQUEsMktBZ0JBQSw0VUEwQ0FBLHlMQWlCQUEsdUxBaUJBQSx1TEFpQkFBLHlMQWlCQUEsNExBaUJBQTs7QUErRExHLEVBQUUsQ0FBQy9FLEtBQUgsR0FBV0EsS0FBWCIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgZW51bXMgZnJvbSAnLi4vLi4vcmVuZGVyZXIvZW51bXMnO1xuaW1wb3J0IENvbG9yIGZyb20gJy4uL3ZhbHVlLXR5cGVzL2NvbG9yJztcbmltcG9ydCB7IHRvUmFkaWFuIH0gZnJvbSAnLi4vdmFsdWUtdHlwZXMnO1xuXG5sZXQgUmVuZGVyZXJMaWdodCA9IG51bGw7XG5pZiAoQ0NfSlNCICYmIENDX05BVElWRVJFTkRFUkVSKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIFJlbmRlcmVyTGlnaHQgPSB3aW5kb3cucmVuZGVyZXIuTGlnaHQ7XG59IGVsc2Uge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBSZW5kZXJlckxpZ2h0ID0gcmVxdWlyZSgnLi4vLi4vcmVuZGVyZXIvc2NlbmUvbGlnaHQnKTtcbn1cblxuaW1wb3J0IHJlbmRlcmVyIGZyb20gJy4uL3JlbmRlcmVyL2luZGV4JztcbmltcG9ydCBFbnVtIGZyb20gJy4uL3BsYXRmb3JtL0NDRW51bSc7XG5pbXBvcnQgQ0NDb21wb25lbnQgZnJvbSAnLi4vY29tcG9uZW50cy9DQ0NvbXBvbmVudCc7XG5pbXBvcnQgeyBjY2NsYXNzLCBtZW51LCBpbnNwZWN0b3IsIHByb3BlcnR5LCBleGVjdXRlSW5FZGl0TW9kZSB9IGZyb20gJy4uL3BsYXRmb3JtL0NDQ2xhc3NEZWNvcmF0b3InO1xuXG4vKipcbiAqICEjZW4gVGhlIGxpZ2h0IHNvdXJjZSB0eXBlXG4gKlxuICogISN6aCDlhYnmupDnsbvlnotcbiAqIEBzdGF0aWNcbiAqIEBlbnVtIExpZ2h0LlR5cGVcbiAqL1xuY29uc3QgTGlnaHRUeXBlID0gRW51bSh7XG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZGlyZWN0aW9uIG9mIGxpZ2h0XG4gICAgICpcbiAgICAgKiAhI3poIOW5s+ihjOWFiVxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBESVJFQ1RJT05BTFxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIERJUkVDVElPTkFMOiAwLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHBvaW50IG9mIGxpZ2h0XG4gICAgICpcbiAgICAgKiAhI3poIOeCueWFiea6kFxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBQT0lOVFxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIFBPSU5UOiAxLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHNwb3Qgb2YgbGlnaHRcbiAgICAgKlxuICAgICAqICEjemgg6IGa5YWJ54GvXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFNQT1RcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBTUE9UOiAyLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgYW1iaWVudCBsaWdodFxuICAgICAqICEjemgg546v5aKD5YWJXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEFNQklFTlRcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBBTUJJRU5UOiAzXG59KTtcblxuLyoqXG4gKiAhI2VuIFRoZSBzaGFkb3cgdHlwZVxuICpcbiAqICEjemgg6Zi05b2x57G75Z6LXG4gKiBAc3RhdGljXG4gKiBAZW51bSBMaWdodC5TaGFkb3dUeXBlXG4gKi9cbmNvbnN0IExpZ2h0U2hhZG93VHlwZSA9IEVudW0oe1xuICAgIC8qKlxuICAgICAqICEjZW4gTm8gc2hhZG93c1xuICAgICAqXG4gICAgICogISN6aCDpmLTlvbHlhbPpl61cbiAgICAgKiBAcHJvcGVydHkgTk9ORVxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgTk9ORTogMCxcbiAgICAvLyAvKipcbiAgICAvLyAgKiAhI2VuIFNvZnQgc2hhZG93c1xuICAgIC8vICAqXG4gICAgLy8gICogISN6aCDova/pmLTlvbFcbiAgICAvLyAgKiBAcHJvcGVydHkgU09GVFxuICAgIC8vICAqIEByZWFkb25seVxuICAgIC8vICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgLy8gICovXG4gICAgLy8gU09GVDogMSxcbiAgICAvKipcbiAgICAgKiAhI2VuIEhhcmQgc2hhZG93c1xuICAgICAqXG4gICAgICogISN6aCDpmLTnoazlvbFcbiAgICAgKiBAcHJvcGVydHkgSEFSRFxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgSEFSRDogMixcbn0pO1xuXG4vKipcbiAqICEjZW4gVGhlIExpZ2h0IENvbXBvbmVudFxuICpcbiAqICEjemgg5YWJ5rqQ57uE5Lu2XG4gKiBAY2xhc3MgTGlnaHRcbiAqIEBleHRlbmRzIENvbXBvbmVudFxuICovXG5AY2NjbGFzcygnY2MuTGlnaHQnKVxuQG1lbnUoJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC5yZW5kZXJlcnMvTGlnaHQnKVxuQGV4ZWN1dGVJbkVkaXRNb2RlXG5AaW5zcGVjdG9yKCdwYWNrYWdlczovL2luc3BlY3Rvci9pbnNwZWN0b3JzL2NvbXBzL2xpZ2h0LmpzJylcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpZ2h0IGV4dGVuZHMgQ0NDb21wb25lbnQge1xuICAgIEBwcm9wZXJ0eVxuICAgIF90eXBlID0gTGlnaHRUeXBlLkRJUkVDVElPTkFMO1xuXG4gICAgQHByb3BlcnR5XG4gICAgX2NvbG9yID0gQ29sb3IuV0hJVEU7XG5cbiAgICBAcHJvcGVydHlcbiAgICBfaW50ZW5zaXR5ID0gMTtcblxuICAgIEBwcm9wZXJ0eVxuICAgIF9yYW5nZSA9IDEwMDA7XG5cbiAgICBAcHJvcGVydHlcbiAgICBfc3BvdEFuZ2xlID0gNjA7XG5cbiAgICBAcHJvcGVydHlcbiAgICBfc3BvdEV4cCA9IDE7XG5cbiAgICBAcHJvcGVydHlcbiAgICBfc2hhZG93VHlwZSA9IExpZ2h0U2hhZG93VHlwZS5OT05FO1xuXG4gICAgQHByb3BlcnR5XG4gICAgX3NoYWRvd1Jlc29sdXRpb24gPSAxMDI0O1xuXG4gICAgQHByb3BlcnR5XG4gICAgX3NoYWRvd0RhcmtuZXNzID0gMC41O1xuXG4gICAgQHByb3BlcnR5XG4gICAgX3NoYWRvd01pbkRlcHRoID0gMTtcblxuICAgIEBwcm9wZXJ0eVxuICAgIF9zaGFkb3dNYXhEZXB0aCA9IDQwOTY7XG5cbiAgICBAcHJvcGVydHlcbiAgICBfc2hhZG93RGVwdGhTY2FsZSA9IDI1MDtcblxuICAgIEBwcm9wZXJ0eVxuICAgIF9zaGFkb3dGcnVzdHVtU2l6ZSA9IDEwMjQ7XG5cbiAgICBAcHJvcGVydHlcbiAgICBfc2hhZG93QmlhcyA9IDAuMDAwNTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGxpZ2h0IHNvdXJjZSB0eXBl77yMY3VycmVudGx5IHdlIGhhdmUgZGlyZWN0aW9uYWwsIHBvaW50LCBzcG90IHRocmVlIHR5cGUuXG4gICAgICogISN6aCDlhYnmupDnsbvlnovvvIznm67liY3mnIkg5bmz6KGM5YWJ77yM6IGa5YWJ54Gv77yM54K55YWJ5rqQIOS4ieenjeexu+Wei1xuICAgICAqIEB0eXBlIHtMaWdodFR5cGV9XG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogTGlnaHRUeXBlXG4gICAgfSlcbiAgICBnZXQgdHlwZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3R5cGU7XG4gICAgfVxuXG4gICAgc2V0IHR5cGUodmFsKSB7XG4gICAgICAgIHRoaXMuX3R5cGUgPSB2YWw7XG5cbiAgICAgICAgbGV0IHR5cGUgPSBlbnVtcy5MSUdIVF9ESVJFQ1RJT05BTDtcbiAgICAgICAgaWYgKHZhbCA9PT0gTGlnaHRUeXBlLlBPSU5UKSB7XG4gICAgICAgICAgICB0eXBlID0gZW51bXMuTElHSFRfUE9JTlQ7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsID09PSBMaWdodFR5cGUuU1BPVCkge1xuICAgICAgICAgICAgdHlwZSA9IGVudW1zLkxJR0hUX1NQT1Q7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodmFsID09PSBMaWdodFR5cGUuQU1CSUVOVCkge1xuICAgICAgICAgICAgdHlwZSA9IGVudW1zLkxJR0hUX0FNQklFTlQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbGlnaHQuc2V0VHlwZSh0eXBlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBsaWdodCBzb3VyY2UgY29sb3JcbiAgICAgKiAhI3poIOWFiea6kOminOiJslxuICAgICAqIEB0eXBlIHtDb2xvcn1cbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBnZXQgY29sb3IoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jb2xvcjtcbiAgICB9XG5cbiAgICBzZXQgY29sb3IodmFsKSB7XG4gICAgICAgIHRoaXMuX2NvbG9yID0gdmFsO1xuICAgICAgICB0aGlzLl9saWdodC5zZXRDb2xvcih2YWwuciAvIDI1NSwgdmFsLmcgLyAyNTUsIHZhbC5iIC8gMjU1KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBsaWdodCBzb3VyY2UgaW50ZW5zaXR5XG4gICAgICpcbiAgICAgKiAhI3poIOWFiea6kOW8uuW6plxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgZ2V0IGludGVuc2l0eSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludGVuc2l0eTtcbiAgICB9XG5cbiAgICBzZXQgaW50ZW5zaXR5KHZhbCkge1xuICAgICAgICB0aGlzLl9pbnRlbnNpdHkgPSB2YWw7XG4gICAgICAgIHRoaXMuX2xpZ2h0LnNldEludGVuc2l0eSh2YWwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGxpZ2h0IHJhbmdlLCB1c2VkIGZvciBzcG90IGFuZCBwb2ludCBsaWdodFxuICAgICAqXG4gICAgICogISN6aCDpkojlr7nogZrlhYnnga/lkozngrnlhYnmupDorr7nva7lhYnmupDojIPlm7RcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eVxuICAgIGdldCByYW5nZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JhbmdlO1xuICAgIH1cblxuICAgIHNldCByYW5nZSh2YWwpIHtcbiAgICAgICAgdGhpcy5fcmFuZ2UgPSB2YWw7XG4gICAgICAgIHRoaXMuX2xpZ2h0LnNldFJhbmdlKHZhbCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgc3BvdCBsaWdodCBjb25lIGFuZ2xlXG4gICAgICpcbiAgICAgKiAhI3poIOiBmuWFieeBr+mUpeinklxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgZ2V0IHNwb3RBbmdsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Nwb3RBbmdsZTtcbiAgICB9XG5cbiAgICBzZXQgc3BvdEFuZ2xlKHZhbCkge1xuICAgICAgICB0aGlzLl9zcG90QW5nbGUgPSB2YWw7XG4gICAgICAgIHRoaXMuX2xpZ2h0LnNldFNwb3RBbmdsZSh0b1JhZGlhbih2YWwpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBzcG90IGxpZ2h0IGV4cG9uZW50aWFsXG4gICAgICpcbiAgICAgKiAhI3poIOiBmuWFieeBr+aMh+aVsFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgZ2V0IHNwb3RFeHAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zcG90RXhwO1xuICAgIH1cblxuICAgIHNldCBzcG90RXhwKHZhbCkge1xuICAgICAgICB0aGlzLl9zcG90RXhwID0gdmFsO1xuICAgICAgICB0aGlzLl9saWdodC5zZXRTcG90RXhwKHZhbCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgc2hhZG93IHR5cGVcbiAgICAgKlxuICAgICAqICEjemgg6Zi05b2x57G75Z6LXG4gICAgICogQHR5cGUge051bWJlcn0gc2hhZG93VHlwZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IExpZ2h0U2hhZG93VHlwZVxuICAgIH0pXG4gICAgZ2V0IHNoYWRvd1R5cGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFkb3dUeXBlO1xuICAgIH1cblxuICAgIHNldCBzaGFkb3dUeXBlKHZhbCkge1xuICAgICAgICB0aGlzLl9zaGFkb3dUeXBlID0gdmFsO1xuXG4gICAgICAgIGxldCB0eXBlID0gZW51bXMuU0hBRE9XX05PTkU7XG4gICAgICAgIGlmICh2YWwgPT09IExpZ2h0U2hhZG93VHlwZS5IQVJEKSB7XG4gICAgICAgICAgICB0eXBlID0gZW51bXMuU0hBRE9XX0hBUkQ7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsID09PSBMaWdodFNoYWRvd1R5cGUuU09GVCkge1xuICAgICAgICAgICAgdHlwZSA9IGVudW1zLlNIQURPV19TT0ZUO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2xpZ2h0LnNldFNoYWRvd1R5cGUodHlwZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgc2hhZG93IHJlc29sdXRpb25cbiAgICAgKlxuICAgICAqICEjemgg6Zi05b2x5YiG6L6o546HXG4gICAgICpcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eVxuICAgIGdldCBzaGFkb3dSZXNvbHV0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2hhZG93UmVzb2x1dGlvbjtcbiAgICB9XG5cbiAgICBzZXQgc2hhZG93UmVzb2x1dGlvbih2YWwpIHtcbiAgICAgICAgdGhpcy5fc2hhZG93UmVzb2x1dGlvbiA9IHZhbDtcbiAgICAgICAgdGhpcy5fbGlnaHQuc2V0U2hhZG93UmVzb2x1dGlvbih2YWwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHNoYWRvdyBkYXJrbmVzc1xuICAgICAqXG4gICAgICogISN6aCDpmLTlvbHngbDluqblgLxcbiAgICAgKlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgZ2V0IHNoYWRvd0RhcmtuZXNzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2hhZG93RGFya25lc3M7XG4gICAgfVxuXG4gICAgc2V0IHNoYWRvd0RhcmtuZXNzKHZhbCkge1xuICAgICAgICB0aGlzLl9zaGFkb3dEYXJrbmVzcyA9IHZhbDtcbiAgICAgICAgdGhpcy5fbGlnaHQuc2V0U2hhZG93RGFya25lc3ModmFsKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBzaGFkb3cgbWluIGRlcHRoXG4gICAgICpcbiAgICAgKiAhI3poIOmYtOW9seacgOWwj+a3seW6plxuICAgICAqXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBnZXQgc2hhZG93TWluRGVwdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFkb3dNaW5EZXB0aDtcbiAgICB9XG5cbiAgICBzZXQgc2hhZG93TWluRGVwdGgodmFsKSB7XG4gICAgICAgIHRoaXMuX3NoYWRvd01pbkRlcHRoID0gdmFsO1xuICAgICAgICB0aGlzLl9saWdodC5zZXRTaGFkb3dNaW5EZXB0aCh2YWwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHNoYWRvdyBtYXggZGVwdGhcbiAgICAgKlxuICAgICAqICEjemgg6Zi05b2x5pyA5aSn5rex5bqmXG4gICAgICpcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eVxuICAgIGdldCBzaGFkb3dNYXhEZXB0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYWRvd01heERlcHRoO1xuICAgIH1cblxuICAgIHNldCBzaGFkb3dNYXhEZXB0aCh2YWwpIHtcbiAgICAgICAgdGhpcy5fc2hhZG93TWF4RGVwdGggPSB2YWw7XG4gICAgICAgIHRoaXMuX2xpZ2h0LnNldFNoYWRvd01heERlcHRoKHZhbCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgc2hhZG93IGRlcHRoIHNjYWxlXG4gICAgICpcbiAgICAgKiAhI3poIOmYtOW9sea3seW6puavlOS+i1xuICAgICAqXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBnZXQgc2hhZG93RGVwdGhTY2FsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYWRvd0RlcHRoU2NhbGU7XG4gICAgfVxuXG4gICAgc2V0IHNoYWRvd0RlcHRoU2NhbGUodmFsKSB7XG4gICAgICAgIHRoaXMuX3NoYWRvd0RlcHRoU2NhbGUgPSB2YWw7XG4gICAgICAgIHRoaXMuX2xpZ2h0LnNldFNoYWRvd0RlcHRoU2NhbGUodmFsKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBzaGFkb3cgZnJ1c3R1bSBzaXplXG4gICAgICpcbiAgICAgKiAhI3poIOmYtOW9seaIqumUpeS9k+Wkp+Wwj1xuICAgICAqXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBnZXQgc2hhZG93RnJ1c3R1bVNpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFkb3dGcnVzdHVtU2l6ZTtcbiAgICB9XG5cbiAgICBzZXQgc2hhZG93RnJ1c3R1bVNpemUodmFsKSB7XG4gICAgICAgIHRoaXMuX3NoYWRvd0ZydXN0dW1TaXplID0gdmFsO1xuICAgICAgICB0aGlzLl9saWdodC5zZXRTaGFkb3dGcnVzdHVtU2l6ZSh2YWwpO1xuICAgIH1cblxuICAgIC8vIC8qKlxuICAgIC8vICAqICEjZW4gVGhlIHNoYWRvdyBiaWFzXG4gICAgLy8gICpcbiAgICAvLyAgKiAhI3poIOmYtOW9seWBj+enu+mHj1xuICAgIC8vICAqXG4gICAgLy8gICogQHR5cGUge051bWJlcn1cbiAgICAvLyAgKi9cbiAgICAvLyBAcHJvcGVydHlcbiAgICAvLyBnZXQgc2hhZG93QmlhcygpIHtcbiAgICAvLyAgICAgcmV0dXJuIHRoaXMuX3NoYWRvd0JpYXM7XG4gICAgLy8gfVxuXG4gICAgLy8gc2V0IHNoYWRvd0JpYXModmFsKSB7XG4gICAgLy8gICAgIHRoaXMuX3NoYWRvd0JpYXMgPSB2YWw7XG4gICAgLy8gICAgIHRoaXMuX2xpZ2h0LnNldFNoYWRvd0JpYXModmFsKTtcbiAgICAvLyB9XG5cbiAgICBzdGF0aWMgVHlwZSA9IExpZ2h0VHlwZTtcblxuICAgIHN0YXRpYyBTaGFkb3dUeXBlID0gTGlnaHRTaGFkb3dUeXBlO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5fbGlnaHQgPSBuZXcgUmVuZGVyZXJMaWdodCgpO1xuICAgIH1cblxuICAgIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fbGlnaHQuc2V0Tm9kZSh0aGlzLm5vZGUpO1xuICAgICAgICB0aGlzLnR5cGUgPSB0aGlzLl90eXBlO1xuICAgICAgICB0aGlzLmNvbG9yID0gdGhpcy5fY29sb3I7XG4gICAgICAgIHRoaXMuaW50ZW5zaXR5ID0gdGhpcy5faW50ZW5zaXR5O1xuICAgICAgICB0aGlzLnJhbmdlID0gdGhpcy5fcmFuZ2U7XG4gICAgICAgIHRoaXMuc3BvdEFuZ2xlID0gdGhpcy5fc3BvdEFuZ2xlO1xuICAgICAgICB0aGlzLnNwb3RFeHAgPSB0aGlzLl9zcG90RXhwO1xuICAgICAgICB0aGlzLnNoYWRvd1R5cGUgPSB0aGlzLl9zaGFkb3dUeXBlO1xuICAgICAgICB0aGlzLnNoYWRvd1Jlc29sdXRpb24gPSB0aGlzLl9zaGFkb3dSZXNvbHV0aW9uO1xuICAgICAgICB0aGlzLnNoYWRvd0RhcmtuZXNzID0gdGhpcy5fc2hhZG93RGFya25lc3M7XG4gICAgICAgIHRoaXMuc2hhZG93TWF4RGVwdGggPSB0aGlzLl9zaGFkb3dNYXhEZXB0aDtcbiAgICAgICAgdGhpcy5zaGFkb3dEZXB0aFNjYWxlID0gdGhpcy5fc2hhZG93RGVwdGhTY2FsZTtcbiAgICAgICAgdGhpcy5zaGFkb3dGcnVzdHVtU2l6ZSA9IHRoaXMuX3NoYWRvd0ZydXN0dW1TaXplO1xuICAgICAgICB0aGlzLnNoYWRvd0JpYXMgPSB0aGlzLl9zaGFkb3dCaWFzO1xuICAgIH1cblxuICAgIG9uRW5hYmxlKCkge1xuICAgICAgICByZW5kZXJlci5zY2VuZS5hZGRMaWdodCh0aGlzLl9saWdodCk7XG4gICAgfVxuXG4gICAgb25EaXNhYmxlKCkge1xuICAgICAgICByZW5kZXJlci5zY2VuZS5yZW1vdmVMaWdodCh0aGlzLl9saWdodCk7XG4gICAgfVxufVxuXG5jYy5MaWdodCA9IExpZ2h0O1xuIl19