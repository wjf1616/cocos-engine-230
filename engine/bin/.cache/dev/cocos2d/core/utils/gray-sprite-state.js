
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/utils/gray-sprite-state.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _materialVariant = _interopRequireDefault(require("../assets/material/material-variant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Material = require('../assets/material/CCMaterial');
/**
 * HelpClass for switching render component's material between normal sprite material and gray sprite material.
 */


var GraySpriteState = cc.Class({
  properties: {
    _normalMaterial: null,

    /**
     * !#en The normal material.
     * !#zh 正常状态的材质。
     * @property normalMaterial
     * @type {Material}
     * @default null
     */
    normalMaterial: {
      get: function get() {
        return this._normalMaterial;
      },
      set: function set(val) {
        this._normalMaterial = val;
        this._updateDisabledState && this._updateDisabledState();
      },
      type: Material,
      tooltip: CC_DEV && 'i18n:COMPONENT.button.normal_material',
      animatable: false
    },
    _grayMaterial: null,

    /**
     * !#en The gray material.
     * !#zh 置灰状态的材质。
     * @property grayMaterial
     * @type {Material}
     * @default null
     */
    grayMaterial: {
      get: function get() {
        return this._grayMaterial;
      },
      set: function set(val) {
        this._grayMaterial = val;
        this._updateDisabledState && this._updateDisabledState();
      },
      type: Material,
      tooltip: CC_DEV && 'i18n:COMPONENT.button.gray_material',
      animatable: false
    }
  },
  _switchGrayMaterial: function _switchGrayMaterial(useGrayMaterial, renderComp) {
    var material;

    if (useGrayMaterial) {
      material = this._grayMaterial;

      if (!material) {
        material = Material.getBuiltinMaterial('2d-gray-sprite');
      }

      material = this._grayMaterial = _materialVariant["default"].create(material, renderComp);
    } else {
      material = this._normalMaterial;

      if (!material) {
        material = Material.getBuiltinMaterial('2d-sprite', renderComp);
      }

      material = this._normalMaterial = _materialVariant["default"].create(material, renderComp);
    }

    renderComp.setMaterial(0, material);
  }
});
module.exports = GraySpriteState;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdyYXktc3ByaXRlLXN0YXRlLmpzIl0sIm5hbWVzIjpbIk1hdGVyaWFsIiwicmVxdWlyZSIsIkdyYXlTcHJpdGVTdGF0ZSIsImNjIiwiQ2xhc3MiLCJwcm9wZXJ0aWVzIiwiX25vcm1hbE1hdGVyaWFsIiwibm9ybWFsTWF0ZXJpYWwiLCJnZXQiLCJzZXQiLCJ2YWwiLCJfdXBkYXRlRGlzYWJsZWRTdGF0ZSIsInR5cGUiLCJ0b29sdGlwIiwiQ0NfREVWIiwiYW5pbWF0YWJsZSIsIl9ncmF5TWF0ZXJpYWwiLCJncmF5TWF0ZXJpYWwiLCJfc3dpdGNoR3JheU1hdGVyaWFsIiwidXNlR3JheU1hdGVyaWFsIiwicmVuZGVyQ29tcCIsIm1hdGVyaWFsIiwiZ2V0QnVpbHRpbk1hdGVyaWFsIiwiTWF0ZXJpYWxWYXJpYW50IiwiY3JlYXRlIiwic2V0TWF0ZXJpYWwiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQ0E7Ozs7QUFDQSxJQUFNQSxRQUFRLEdBQUdDLE9BQU8sQ0FBQywrQkFBRCxDQUF4QjtBQUVBOzs7OztBQUlBLElBQUlDLGVBQWUsR0FBR0MsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDM0JDLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxlQUFlLEVBQUUsSUFEVDs7QUFHUjs7Ozs7OztBQU9BQyxJQUFBQSxjQUFjLEVBQUU7QUFDWkMsTUFBQUEsR0FEWSxpQkFDTDtBQUNILGVBQU8sS0FBS0YsZUFBWjtBQUNILE9BSFc7QUFJWkcsTUFBQUEsR0FKWSxlQUlQQyxHQUpPLEVBSUY7QUFDTixhQUFLSixlQUFMLEdBQXVCSSxHQUF2QjtBQUNBLGFBQUtDLG9CQUFMLElBQTZCLEtBQUtBLG9CQUFMLEVBQTdCO0FBQ0gsT0FQVztBQVFaQyxNQUFBQSxJQUFJLEVBQUVaLFFBUk07QUFTWmEsTUFBQUEsT0FBTyxFQUFFQyxNQUFNLElBQUksdUNBVFA7QUFVWkMsTUFBQUEsVUFBVSxFQUFFO0FBVkEsS0FWUjtBQXVCUkMsSUFBQUEsYUFBYSxFQUFFLElBdkJQOztBQXlCUjs7Ozs7OztBQU9BQyxJQUFBQSxZQUFZLEVBQUU7QUFDVlQsTUFBQUEsR0FEVSxpQkFDSDtBQUNILGVBQU8sS0FBS1EsYUFBWjtBQUNILE9BSFM7QUFJVlAsTUFBQUEsR0FKVSxlQUlMQyxHQUpLLEVBSUE7QUFDTixhQUFLTSxhQUFMLEdBQXFCTixHQUFyQjtBQUNBLGFBQUtDLG9CQUFMLElBQTZCLEtBQUtBLG9CQUFMLEVBQTdCO0FBQ0gsT0FQUztBQVFWQyxNQUFBQSxJQUFJLEVBQUVaLFFBUkk7QUFTVmEsTUFBQUEsT0FBTyxFQUFFQyxNQUFNLElBQUkscUNBVFQ7QUFVVkMsTUFBQUEsVUFBVSxFQUFFO0FBVkY7QUFoQ04sR0FEZTtBQStDM0JHLEVBQUFBLG1CQS9DMkIsK0JBK0NOQyxlQS9DTSxFQStDV0MsVUEvQ1gsRUErQ3VCO0FBQzlDLFFBQUlDLFFBQUo7O0FBQ0EsUUFBSUYsZUFBSixFQUFxQjtBQUNqQkUsTUFBQUEsUUFBUSxHQUFHLEtBQUtMLGFBQWhCOztBQUNBLFVBQUksQ0FBQ0ssUUFBTCxFQUFlO0FBQ1hBLFFBQUFBLFFBQVEsR0FBR3JCLFFBQVEsQ0FBQ3NCLGtCQUFULENBQTRCLGdCQUE1QixDQUFYO0FBQ0g7O0FBQ0RELE1BQUFBLFFBQVEsR0FBRyxLQUFLTCxhQUFMLEdBQXFCTyw0QkFBZ0JDLE1BQWhCLENBQXVCSCxRQUF2QixFQUFpQ0QsVUFBakMsQ0FBaEM7QUFDSCxLQU5ELE1BT0s7QUFDREMsTUFBQUEsUUFBUSxHQUFHLEtBQUtmLGVBQWhCOztBQUNBLFVBQUksQ0FBQ2UsUUFBTCxFQUFlO0FBQ1hBLFFBQUFBLFFBQVEsR0FBR3JCLFFBQVEsQ0FBQ3NCLGtCQUFULENBQTRCLFdBQTVCLEVBQXlDRixVQUF6QyxDQUFYO0FBQ0g7O0FBQ0RDLE1BQUFBLFFBQVEsR0FBRyxLQUFLZixlQUFMLEdBQXVCaUIsNEJBQWdCQyxNQUFoQixDQUF1QkgsUUFBdkIsRUFBaUNELFVBQWpDLENBQWxDO0FBQ0g7O0FBRURBLElBQUFBLFVBQVUsQ0FBQ0ssV0FBWCxDQUF1QixDQUF2QixFQUEwQkosUUFBMUI7QUFDSDtBQWpFMEIsQ0FBVCxDQUF0QjtBQW9FQUssTUFBTSxDQUFDQyxPQUFQLEdBQWlCekIsZUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBNYXRlcmlhbFZhcmlhbnQgZnJvbSAnLi4vYXNzZXRzL21hdGVyaWFsL21hdGVyaWFsLXZhcmlhbnQnO1xuY29uc3QgTWF0ZXJpYWwgPSByZXF1aXJlKCcuLi9hc3NldHMvbWF0ZXJpYWwvQ0NNYXRlcmlhbCcpO1xuXG4vKipcbiAqIEhlbHBDbGFzcyBmb3Igc3dpdGNoaW5nIHJlbmRlciBjb21wb25lbnQncyBtYXRlcmlhbCBiZXR3ZWVuIG5vcm1hbCBzcHJpdGUgbWF0ZXJpYWwgYW5kIGdyYXkgc3ByaXRlIG1hdGVyaWFsLlxuICovXG5cbmxldCBHcmF5U3ByaXRlU3RhdGUgPSBjYy5DbGFzcyh7XG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBfbm9ybWFsTWF0ZXJpYWw6IG51bGwsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIG5vcm1hbCBtYXRlcmlhbC5cbiAgICAgICAgICogISN6aCDmraPluLjnirbmgIHnmoTmnZDotKjjgIJcbiAgICAgICAgICogQHByb3BlcnR5IG5vcm1hbE1hdGVyaWFsXG4gICAgICAgICAqIEB0eXBlIHtNYXRlcmlhbH1cbiAgICAgICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAgICAgKi9cbiAgICAgICAgbm9ybWFsTWF0ZXJpYWw6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX25vcm1hbE1hdGVyaWFsO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbm9ybWFsTWF0ZXJpYWwgPSB2YWw7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlRGlzYWJsZWRTdGF0ZSAmJiB0aGlzLl91cGRhdGVEaXNhYmxlZFN0YXRlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHlwZTogTWF0ZXJpYWwsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmJ1dHRvbi5ub3JtYWxfbWF0ZXJpYWwnLFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICBfZ3JheU1hdGVyaWFsOiBudWxsLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBncmF5IG1hdGVyaWFsLlxuICAgICAgICAgKiAhI3poIOe9rueBsOeKtuaAgeeahOadkOi0qOOAglxuICAgICAgICAgKiBAcHJvcGVydHkgZ3JheU1hdGVyaWFsXG4gICAgICAgICAqIEB0eXBlIHtNYXRlcmlhbH1cbiAgICAgICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAgICAgKi9cbiAgICAgICAgZ3JheU1hdGVyaWFsOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9ncmF5TWF0ZXJpYWw7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9ncmF5TWF0ZXJpYWwgPSB2YWw7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlRGlzYWJsZWRTdGF0ZSAmJiB0aGlzLl91cGRhdGVEaXNhYmxlZFN0YXRlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHlwZTogTWF0ZXJpYWwsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmJ1dHRvbi5ncmF5X21hdGVyaWFsJyxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9LFxuICBcbiAgICBfc3dpdGNoR3JheU1hdGVyaWFsICh1c2VHcmF5TWF0ZXJpYWwsIHJlbmRlckNvbXApIHtcbiAgICAgICAgbGV0IG1hdGVyaWFsO1xuICAgICAgICBpZiAodXNlR3JheU1hdGVyaWFsKSB7XG4gICAgICAgICAgICBtYXRlcmlhbCA9IHRoaXMuX2dyYXlNYXRlcmlhbDtcbiAgICAgICAgICAgIGlmICghbWF0ZXJpYWwpIHtcbiAgICAgICAgICAgICAgICBtYXRlcmlhbCA9IE1hdGVyaWFsLmdldEJ1aWx0aW5NYXRlcmlhbCgnMmQtZ3JheS1zcHJpdGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1hdGVyaWFsID0gdGhpcy5fZ3JheU1hdGVyaWFsID0gTWF0ZXJpYWxWYXJpYW50LmNyZWF0ZShtYXRlcmlhbCwgcmVuZGVyQ29tcCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBtYXRlcmlhbCA9IHRoaXMuX25vcm1hbE1hdGVyaWFsO1xuICAgICAgICAgICAgaWYgKCFtYXRlcmlhbCkge1xuICAgICAgICAgICAgICAgIG1hdGVyaWFsID0gTWF0ZXJpYWwuZ2V0QnVpbHRpbk1hdGVyaWFsKCcyZC1zcHJpdGUnLCByZW5kZXJDb21wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1hdGVyaWFsID0gdGhpcy5fbm9ybWFsTWF0ZXJpYWwgPSBNYXRlcmlhbFZhcmlhbnQuY3JlYXRlKG1hdGVyaWFsLCByZW5kZXJDb21wKTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICByZW5kZXJDb21wLnNldE1hdGVyaWFsKDAsIG1hdGVyaWFsKTtcbiAgICB9XG59KVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdyYXlTcHJpdGVTdGF0ZTtcbiJdfQ==