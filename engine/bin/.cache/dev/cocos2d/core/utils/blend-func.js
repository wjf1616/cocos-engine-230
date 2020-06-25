
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/utils/blend-func.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var RenderComponent = require('../components/CCRenderComponent');

var BlendFactor = require('../platform/CCMacro').BlendFactor;

var gfx = require('../../renderer/gfx');
/**
 * @module cc
 */

/**
 * !#en
 * Helper class for setting material blend function.
 * !#zh
 * 设置材质混合模式的辅助类。
 * @class BlendFunc
 */


var BlendFunc = cc.Class({
  properties: {
    _srcBlendFactor: BlendFactor.SRC_ALPHA,
    _dstBlendFactor: BlendFactor.ONE_MINUS_SRC_ALPHA,

    /**
     * !#en specify the source Blend Factor, this will generate a custom material object, please pay attention to the memory cost.
     * !#zh 指定原图的混合模式，这会克隆一个新的材质对象，注意这带来的开销
     * @property srcBlendFactor
     * @type {macro.BlendFactor}
     * @example
     * sprite.srcBlendFactor = cc.macro.BlendFactor.ONE;
     */
    srcBlendFactor: {
      get: function get() {
        return this._srcBlendFactor;
      },
      set: function set(value) {
        if (this._srcBlendFactor === value) return;
        this._srcBlendFactor = value;

        this._updateBlendFunc();
      },
      animatable: false,
      type: BlendFactor,
      tooltip: CC_DEV && 'i18n:COMPONENT.sprite.src_blend_factor',
      visible: true
    },

    /**
     * !#en specify the destination Blend Factor.
     * !#zh 指定目标的混合模式
     * @property dstBlendFactor
     * @type {macro.BlendFactor}
     * @example
     * sprite.dstBlendFactor = cc.macro.BlendFactor.ONE;
     */
    dstBlendFactor: {
      get: function get() {
        return this._dstBlendFactor;
      },
      set: function set(value) {
        if (this._dstBlendFactor === value) return;
        this._dstBlendFactor = value;

        this._updateBlendFunc();
      },
      animatable: false,
      type: BlendFactor,
      tooltip: CC_DEV && 'i18n:COMPONENT.sprite.dst_blend_factor',
      visible: true
    }
  },
  setMaterial: function setMaterial(index, material) {
    RenderComponent.prototype.setMaterial.call(this, index, material);

    if (this._srcBlendFactor === BlendFactor.SRC_ALPHA && this._dstBlendFactor === BlendFactor.ONE_MINUS_SRC_ALPHA) {
      return;
    }

    this._updateMaterialBlendFunc(material);
  },
  _updateMaterial: function _updateMaterial() {
    this._updateBlendFunc();
  },
  _updateBlendFunc: function _updateBlendFunc() {
    if (this._srcBlendFactor === BlendFactor.SRC_ALPHA && this._dstBlendFactor === BlendFactor.ONE_MINUS_SRC_ALPHA) {
      return;
    }

    var materials = this._materials;

    for (var i = 0; i < materials.length; i++) {
      var material = materials[i];

      this._updateMaterialBlendFunc(material);
    }
  },
  _updateMaterialBlendFunc: function _updateMaterialBlendFunc(material) {
    material.setBlend(true, gfx.BLEND_FUNC_ADD, this._srcBlendFactor, this._dstBlendFactor, gfx.BLEND_FUNC_ADD, this._srcBlendFactor, this._dstBlendFactor);
  }
});
module.exports = cc.BlendFunc = BlendFunc;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJsZW5kLWZ1bmMuanMiXSwibmFtZXMiOlsiUmVuZGVyQ29tcG9uZW50IiwicmVxdWlyZSIsIkJsZW5kRmFjdG9yIiwiZ2Z4IiwiQmxlbmRGdW5jIiwiY2MiLCJDbGFzcyIsInByb3BlcnRpZXMiLCJfc3JjQmxlbmRGYWN0b3IiLCJTUkNfQUxQSEEiLCJfZHN0QmxlbmRGYWN0b3IiLCJPTkVfTUlOVVNfU1JDX0FMUEhBIiwic3JjQmxlbmRGYWN0b3IiLCJnZXQiLCJzZXQiLCJ2YWx1ZSIsIl91cGRhdGVCbGVuZEZ1bmMiLCJhbmltYXRhYmxlIiwidHlwZSIsInRvb2x0aXAiLCJDQ19ERVYiLCJ2aXNpYmxlIiwiZHN0QmxlbmRGYWN0b3IiLCJzZXRNYXRlcmlhbCIsImluZGV4IiwibWF0ZXJpYWwiLCJwcm90b3R5cGUiLCJjYWxsIiwiX3VwZGF0ZU1hdGVyaWFsQmxlbmRGdW5jIiwiX3VwZGF0ZU1hdGVyaWFsIiwibWF0ZXJpYWxzIiwiX21hdGVyaWFscyIsImkiLCJsZW5ndGgiLCJzZXRCbGVuZCIsIkJMRU5EX0ZVTkNfQUREIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUNBLElBQU1BLGVBQWUsR0FBR0MsT0FBTyxDQUFDLGlDQUFELENBQS9COztBQUNBLElBQU1DLFdBQVcsR0FBR0QsT0FBTyxDQUFDLHFCQUFELENBQVAsQ0FBK0JDLFdBQW5EOztBQUNBLElBQU1DLEdBQUcsR0FBR0YsT0FBTyxDQUFDLG9CQUFELENBQW5CO0FBRUE7Ozs7QUFHQTs7Ozs7Ozs7O0FBT0EsSUFBSUcsU0FBUyxHQUFHQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNyQkMsRUFBQUEsVUFBVSxFQUFFO0FBQ1JDLElBQUFBLGVBQWUsRUFBRU4sV0FBVyxDQUFDTyxTQURyQjtBQUVSQyxJQUFBQSxlQUFlLEVBQUVSLFdBQVcsQ0FBQ1MsbUJBRnJCOztBQUlSOzs7Ozs7OztBQVFBQyxJQUFBQSxjQUFjLEVBQUU7QUFDWkMsTUFBQUEsR0FEWSxpQkFDTDtBQUNILGVBQU8sS0FBS0wsZUFBWjtBQUNILE9BSFc7QUFJWk0sTUFBQUEsR0FKWSxlQUlQQyxLQUpPLEVBSUE7QUFDUixZQUFJLEtBQUtQLGVBQUwsS0FBeUJPLEtBQTdCLEVBQW9DO0FBQ3BDLGFBQUtQLGVBQUwsR0FBdUJPLEtBQXZCOztBQUNBLGFBQUtDLGdCQUFMO0FBQ0gsT0FSVztBQVNaQyxNQUFBQSxVQUFVLEVBQUUsS0FUQTtBQVVaQyxNQUFBQSxJQUFJLEVBQUVoQixXQVZNO0FBV1ppQixNQUFBQSxPQUFPLEVBQUVDLE1BQU0sSUFBSSx3Q0FYUDtBQVlaQyxNQUFBQSxPQUFPLEVBQUU7QUFaRyxLQVpSOztBQTJCUjs7Ozs7Ozs7QUFRQUMsSUFBQUEsY0FBYyxFQUFFO0FBQ1pULE1BQUFBLEdBRFksaUJBQ0w7QUFDSCxlQUFPLEtBQUtILGVBQVo7QUFDSCxPQUhXO0FBSVpJLE1BQUFBLEdBSlksZUFJUEMsS0FKTyxFQUlBO0FBQ1IsWUFBSSxLQUFLTCxlQUFMLEtBQXlCSyxLQUE3QixFQUFvQztBQUNwQyxhQUFLTCxlQUFMLEdBQXVCSyxLQUF2Qjs7QUFDQSxhQUFLQyxnQkFBTDtBQUNILE9BUlc7QUFTWkMsTUFBQUEsVUFBVSxFQUFFLEtBVEE7QUFVWkMsTUFBQUEsSUFBSSxFQUFFaEIsV0FWTTtBQVdaaUIsTUFBQUEsT0FBTyxFQUFFQyxNQUFNLElBQUksd0NBWFA7QUFZWkMsTUFBQUEsT0FBTyxFQUFFO0FBWkc7QUFuQ1IsR0FEUztBQW9EckJFLEVBQUFBLFdBcERxQix1QkFvRFJDLEtBcERRLEVBb0REQyxRQXBEQyxFQW9EUztBQUMxQnpCLElBQUFBLGVBQWUsQ0FBQzBCLFNBQWhCLENBQTBCSCxXQUExQixDQUFzQ0ksSUFBdEMsQ0FBMkMsSUFBM0MsRUFBaURILEtBQWpELEVBQXdEQyxRQUF4RDs7QUFFQSxRQUFJLEtBQUtqQixlQUFMLEtBQXlCTixXQUFXLENBQUNPLFNBQXJDLElBQWtELEtBQUtDLGVBQUwsS0FBeUJSLFdBQVcsQ0FBQ1MsbUJBQTNGLEVBQWdIO0FBQzVHO0FBQ0g7O0FBQ0QsU0FBS2lCLHdCQUFMLENBQThCSCxRQUE5QjtBQUNILEdBM0RvQjtBQTZEckJJLEVBQUFBLGVBN0RxQiw2QkE2REY7QUFDZixTQUFLYixnQkFBTDtBQUNILEdBL0RvQjtBQWlFckJBLEVBQUFBLGdCQWpFcUIsOEJBaUVEO0FBQ2hCLFFBQUksS0FBS1IsZUFBTCxLQUF5Qk4sV0FBVyxDQUFDTyxTQUFyQyxJQUFrRCxLQUFLQyxlQUFMLEtBQXlCUixXQUFXLENBQUNTLG1CQUEzRixFQUFnSDtBQUM1RztBQUNIOztBQUNELFFBQUltQixTQUFTLEdBQUcsS0FBS0MsVUFBckI7O0FBQ0EsU0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRixTQUFTLENBQUNHLE1BQTlCLEVBQXNDRCxDQUFDLEVBQXZDLEVBQTJDO0FBQ3ZDLFVBQUlQLFFBQVEsR0FBR0ssU0FBUyxDQUFDRSxDQUFELENBQXhCOztBQUNBLFdBQUtKLHdCQUFMLENBQThCSCxRQUE5QjtBQUNIO0FBQ0osR0ExRW9CO0FBNEVyQkcsRUFBQUEsd0JBNUVxQixvQ0E0RUtILFFBNUVMLEVBNEVlO0FBQ2hDQSxJQUFBQSxRQUFRLENBQUNTLFFBQVQsQ0FDSSxJQURKLEVBRUkvQixHQUFHLENBQUNnQyxjQUZSLEVBR0ksS0FBSzNCLGVBSFQsRUFHMEIsS0FBS0UsZUFIL0IsRUFJSVAsR0FBRyxDQUFDZ0MsY0FKUixFQUtJLEtBQUszQixlQUxULEVBSzBCLEtBQUtFLGVBTC9CO0FBT0g7QUFwRm9CLENBQVQsQ0FBaEI7QUF1RkEwQixNQUFNLENBQUNDLE9BQVAsR0FBaUJoQyxFQUFFLENBQUNELFNBQUgsR0FBZUEsU0FBaEMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmNvbnN0IFJlbmRlckNvbXBvbmVudCA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvQ0NSZW5kZXJDb21wb25lbnQnKTtcbmNvbnN0IEJsZW5kRmFjdG9yID0gcmVxdWlyZSgnLi4vcGxhdGZvcm0vQ0NNYWNybycpLkJsZW5kRmFjdG9yO1xuY29uc3QgZ2Z4ID0gcmVxdWlyZSgnLi4vLi4vcmVuZGVyZXIvZ2Z4Jyk7XG5cbi8qKlxuICogQG1vZHVsZSBjY1xuICovXG4vKipcbiAqICEjZW5cbiAqIEhlbHBlciBjbGFzcyBmb3Igc2V0dGluZyBtYXRlcmlhbCBibGVuZCBmdW5jdGlvbi5cbiAqICEjemhcbiAqIOiuvue9ruadkOi0qOa3t+WQiOaooeW8j+eahOi+heWKqeexu+OAglxuICogQGNsYXNzIEJsZW5kRnVuY1xuICovXG5sZXQgQmxlbmRGdW5jID0gY2MuQ2xhc3Moe1xuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgX3NyY0JsZW5kRmFjdG9yOiBCbGVuZEZhY3Rvci5TUkNfQUxQSEEsXG4gICAgICAgIF9kc3RCbGVuZEZhY3RvcjogQmxlbmRGYWN0b3IuT05FX01JTlVTX1NSQ19BTFBIQSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBzcGVjaWZ5IHRoZSBzb3VyY2UgQmxlbmQgRmFjdG9yLCB0aGlzIHdpbGwgZ2VuZXJhdGUgYSBjdXN0b20gbWF0ZXJpYWwgb2JqZWN0LCBwbGVhc2UgcGF5IGF0dGVudGlvbiB0byB0aGUgbWVtb3J5IGNvc3QuXG4gICAgICAgICAqICEjemgg5oyH5a6a5Y6f5Zu+55qE5re35ZCI5qih5byP77yM6L+Z5Lya5YWL6ZqG5LiA5Liq5paw55qE5p2Q6LSo5a+56LGh77yM5rOo5oSP6L+Z5bim5p2l55qE5byA6ZSAXG4gICAgICAgICAqIEBwcm9wZXJ0eSBzcmNCbGVuZEZhY3RvclxuICAgICAgICAgKiBAdHlwZSB7bWFjcm8uQmxlbmRGYWN0b3J9XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIHNwcml0ZS5zcmNCbGVuZEZhY3RvciA9IGNjLm1hY3JvLkJsZW5kRmFjdG9yLk9ORTtcbiAgICAgICAgICovXG4gICAgICAgIHNyY0JsZW5kRmFjdG9yOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zcmNCbGVuZEZhY3RvcjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3NyY0JsZW5kRmFjdG9yID09PSB2YWx1ZSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHRoaXMuX3NyY0JsZW5kRmFjdG9yID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlQmxlbmRGdW5jKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0eXBlOiBCbGVuZEZhY3RvcixcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuc3ByaXRlLnNyY19ibGVuZF9mYWN0b3InLFxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIHNwZWNpZnkgdGhlIGRlc3RpbmF0aW9uIEJsZW5kIEZhY3Rvci5cbiAgICAgICAgICogISN6aCDmjIflrprnm67moIfnmoTmt7flkIjmqKHlvI9cbiAgICAgICAgICogQHByb3BlcnR5IGRzdEJsZW5kRmFjdG9yXG4gICAgICAgICAqIEB0eXBlIHttYWNyby5CbGVuZEZhY3Rvcn1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogc3ByaXRlLmRzdEJsZW5kRmFjdG9yID0gY2MubWFjcm8uQmxlbmRGYWN0b3IuT05FO1xuICAgICAgICAgKi9cbiAgICAgICAgZHN0QmxlbmRGYWN0b3I6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RzdEJsZW5kRmFjdG9yO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZHN0QmxlbmRGYWN0b3IgPT09IHZhbHVlKSByZXR1cm47XG4gICAgICAgICAgICAgICAgdGhpcy5fZHN0QmxlbmRGYWN0b3IgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVCbGVuZEZ1bmMoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHR5cGU6IEJsZW5kRmFjdG9yLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5zcHJpdGUuZHN0X2JsZW5kX2ZhY3RvcicsXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIHNldE1hdGVyaWFsIChpbmRleCwgbWF0ZXJpYWwpIHtcbiAgICAgICAgUmVuZGVyQ29tcG9uZW50LnByb3RvdHlwZS5zZXRNYXRlcmlhbC5jYWxsKHRoaXMsIGluZGV4LCBtYXRlcmlhbCk7XG4gICAgICAgIFxuICAgICAgICBpZiAodGhpcy5fc3JjQmxlbmRGYWN0b3IgPT09IEJsZW5kRmFjdG9yLlNSQ19BTFBIQSAmJiB0aGlzLl9kc3RCbGVuZEZhY3RvciA9PT0gQmxlbmRGYWN0b3IuT05FX01JTlVTX1NSQ19BTFBIQSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3VwZGF0ZU1hdGVyaWFsQmxlbmRGdW5jKG1hdGVyaWFsKTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZU1hdGVyaWFsICgpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlQmxlbmRGdW5jKCk7XG4gICAgfSxcblxuICAgIF91cGRhdGVCbGVuZEZ1bmMgKCkge1xuICAgICAgICBpZiAodGhpcy5fc3JjQmxlbmRGYWN0b3IgPT09IEJsZW5kRmFjdG9yLlNSQ19BTFBIQSAmJiB0aGlzLl9kc3RCbGVuZEZhY3RvciA9PT0gQmxlbmRGYWN0b3IuT05FX01JTlVTX1NSQ19BTFBIQSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBtYXRlcmlhbHMgPSB0aGlzLl9tYXRlcmlhbHM7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0ZXJpYWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbWF0ZXJpYWwgPSBtYXRlcmlhbHNbaV07XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVNYXRlcmlhbEJsZW5kRnVuYyhtYXRlcmlhbCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3VwZGF0ZU1hdGVyaWFsQmxlbmRGdW5jIChtYXRlcmlhbCkge1xuICAgICAgICBtYXRlcmlhbC5zZXRCbGVuZChcbiAgICAgICAgICAgIHRydWUsXG4gICAgICAgICAgICBnZnguQkxFTkRfRlVOQ19BREQsXG4gICAgICAgICAgICB0aGlzLl9zcmNCbGVuZEZhY3RvciwgdGhpcy5fZHN0QmxlbmRGYWN0b3IsXG4gICAgICAgICAgICBnZnguQkxFTkRfRlVOQ19BREQsXG4gICAgICAgICAgICB0aGlzLl9zcmNCbGVuZEZhY3RvciwgdGhpcy5fZHN0QmxlbmRGYWN0b3JcbiAgICAgICAgKTtcbiAgICB9LFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gY2MuQmxlbmRGdW5jID0gQmxlbmRGdW5jO1xuIl19