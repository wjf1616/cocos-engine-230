
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/particle/animator/gradient-range.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _CCClassDecorator = require("../../../platform/CCClassDecorator");

var _CCEnum = _interopRequireDefault(require("../../../platform/CCEnum"));

var _gradient = require("./gradient");

var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _class3, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

var GRADIENT_MODE_FIX = 0;
var GRADIENT_MODE_BLEND = 1;
var GRADIENT_RANGE_MODE_COLOR = 0;
var GRADIENT_RANGE_MODE_TWO_COLOR = 1;
var GRADIENT_RANGE_MODE_RANDOM_COLOR = 2;
var GRADIENT_RANGE_MODE_GRADIENT = 3;
var GRADIENT_RANGE_MODE_TWO_GRADIENT = 4;
var Mode = (0, _CCEnum["default"])({
  Color: 0,
  Gradient: 1,
  TwoColors: 2,
  TwoGradients: 3,
  RandomColor: 4
});
var GradientRange = (_dec = (0, _CCClassDecorator.ccclass)('cc.GradientRange'), _dec2 = (0, _CCClassDecorator.property)({
  type: Mode
}), _dec3 = (0, _CCClassDecorator.property)({
  type: _gradient.Gradient
}), _dec4 = (0, _CCClassDecorator.property)({
  type: _gradient.Gradient
}), _dec5 = (0, _CCClassDecorator.property)({
  type: _gradient.Gradient
}), _dec(_class = (_class2 = (_temp = _class3 =
/*#__PURE__*/
function () {
  function GradientRange() {
    _initializerDefineProperty(this, "_mode", _descriptor, this);

    _initializerDefineProperty(this, "_color", _descriptor2, this);

    _initializerDefineProperty(this, "color", _descriptor3, this);

    _initializerDefineProperty(this, "colorMin", _descriptor4, this);

    _initializerDefineProperty(this, "colorMax", _descriptor5, this);

    _initializerDefineProperty(this, "gradient", _descriptor6, this);

    _initializerDefineProperty(this, "gradientMin", _descriptor7, this);

    _initializerDefineProperty(this, "gradientMax", _descriptor8, this);
  }

  var _proto = GradientRange.prototype;

  _proto.evaluate = function evaluate(time, rndRatio) {
    switch (this.mode) {
      case Mode.Color:
        return this.color;

      case Mode.TwoColors:
        this.colorMin.lerp(this.colorMax, rndRatio, this._color);
        return this._color;

      case Mode.RandomColor:
        return this.gradient.randomColor();

      case Mode.Gradient:
        return this.gradient.evaluate(time);

      case Mode.TwoGradients:
        this.gradientMin.evaluate(time).lerp(this.gradientMax.evaluate(time), rndRatio, this._color);
        return this._color;

      default:
        return this.color;
    }
  };

  _createClass(GradientRange, [{
    key: "mode",

    /**
     * !#en Gradient type.
     * !#zh 渐变色类型。
     * @property {Mode} mode
     */
    get: function get() {
      return this._mode;
    },
    set: function set(m) {
      if (CC_EDITOR) {
        if (m === Mode.RandomColor) {
          if (this.gradient.colorKeys.length === 0) {
            this.gradient.colorKeys.push(new _gradient.ColorKey());
          }

          if (this.gradient.alphaKeys.length === 0) {
            this.gradient.alphaKeys.push(new _gradient.AlphaKey());
          }
        }
      }

      this._mode = m;
    }
  }]);

  return GradientRange;
}(), _class3.Mode = Mode, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_mode", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return Mode.Color;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "mode", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "mode"), _class2.prototype), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_color", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return cc.Color.WHITE.clone();
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "color", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return cc.Color.WHITE.clone();
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "colorMin", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return cc.Color.WHITE.clone();
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "colorMax", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return cc.Color.WHITE.clone();
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "gradient", [_dec3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _gradient.Gradient();
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "gradientMin", [_dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _gradient.Gradient();
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "gradientMax", [_dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _gradient.Gradient();
  }
})), _class2)) || _class);
exports["default"] = GradientRange;
cc.GradientRange = GradientRange;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdyYWRpZW50LXJhbmdlLnRzIl0sIm5hbWVzIjpbIkdSQURJRU5UX01PREVfRklYIiwiR1JBRElFTlRfTU9ERV9CTEVORCIsIkdSQURJRU5UX1JBTkdFX01PREVfQ09MT1IiLCJHUkFESUVOVF9SQU5HRV9NT0RFX1RXT19DT0xPUiIsIkdSQURJRU5UX1JBTkdFX01PREVfUkFORE9NX0NPTE9SIiwiR1JBRElFTlRfUkFOR0VfTU9ERV9HUkFESUVOVCIsIkdSQURJRU5UX1JBTkdFX01PREVfVFdPX0dSQURJRU5UIiwiTW9kZSIsIkNvbG9yIiwiR3JhZGllbnQiLCJUd29Db2xvcnMiLCJUd29HcmFkaWVudHMiLCJSYW5kb21Db2xvciIsIkdyYWRpZW50UmFuZ2UiLCJ0eXBlIiwiZXZhbHVhdGUiLCJ0aW1lIiwicm5kUmF0aW8iLCJtb2RlIiwiY29sb3IiLCJjb2xvck1pbiIsImxlcnAiLCJjb2xvck1heCIsIl9jb2xvciIsImdyYWRpZW50IiwicmFuZG9tQ29sb3IiLCJncmFkaWVudE1pbiIsImdyYWRpZW50TWF4IiwiX21vZGUiLCJtIiwiQ0NfRURJVE9SIiwiY29sb3JLZXlzIiwibGVuZ3RoIiwicHVzaCIsIkNvbG9yS2V5IiwiYWxwaGFLZXlzIiwiQWxwaGFLZXkiLCJwcm9wZXJ0eSIsImNjIiwiV0hJVEUiLCJjbG9uZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsaUJBQWlCLEdBQUcsQ0FBMUI7QUFDQSxJQUFNQyxtQkFBbUIsR0FBRyxDQUE1QjtBQUVBLElBQU1DLHlCQUF5QixHQUFHLENBQWxDO0FBQ0EsSUFBTUMsNkJBQTZCLEdBQUcsQ0FBdEM7QUFDQSxJQUFNQyxnQ0FBZ0MsR0FBRyxDQUF6QztBQUNBLElBQU1DLDRCQUE0QixHQUFHLENBQXJDO0FBQ0EsSUFBTUMsZ0NBQWdDLEdBQUcsQ0FBekM7QUFFQSxJQUFNQyxJQUFJLEdBQUcsd0JBQUs7QUFDZEMsRUFB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cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2NjbGFzcywgcHJvcGVydHkgfSBmcm9tICcuLi8uLi8uLi9wbGF0Zm9ybS9DQ0NsYXNzRGVjb3JhdG9yJztcbmltcG9ydCBFbnVtIGZyb20gJy4uLy4uLy4uL3BsYXRmb3JtL0NDRW51bSc7XG5pbXBvcnQgeyBDb2xvciB9IGZyb20gJy4uLy4uLy4uL3ZhbHVlLXR5cGVzJztcbmltcG9ydCB7IEdyYWRpZW50LCBBbHBoYUtleSwgQ29sb3JLZXkgfSBmcm9tICcuL2dyYWRpZW50JztcblxuY29uc3QgR1JBRElFTlRfTU9ERV9GSVggPSAwO1xuY29uc3QgR1JBRElFTlRfTU9ERV9CTEVORCA9IDE7XG5cbmNvbnN0IEdSQURJRU5UX1JBTkdFX01PREVfQ09MT1IgPSAwO1xuY29uc3QgR1JBRElFTlRfUkFOR0VfTU9ERV9UV09fQ09MT1IgPSAxO1xuY29uc3QgR1JBRElFTlRfUkFOR0VfTU9ERV9SQU5ET01fQ09MT1IgPSAyO1xuY29uc3QgR1JBRElFTlRfUkFOR0VfTU9ERV9HUkFESUVOVCA9IDM7XG5jb25zdCBHUkFESUVOVF9SQU5HRV9NT0RFX1RXT19HUkFESUVOVCA9IDQ7XG5cbmNvbnN0IE1vZGUgPSBFbnVtKHtcbiAgICBDb2xvcjogMCxcbiAgICBHcmFkaWVudDogMSxcbiAgICBUd29Db2xvcnM6IDIsXG4gICAgVHdvR3JhZGllbnRzOiAzLFxuICAgIFJhbmRvbUNvbG9yOiA0LFxufSk7XG5cbkBjY2NsYXNzKCdjYy5HcmFkaWVudFJhbmdlJylcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyYWRpZW50UmFuZ2Uge1xuXG4gICAgc3RhdGljIE1vZGUgPSBNb2RlO1xuXG4gICAgQHByb3BlcnR5XG4gICAgX21vZGUgPSBNb2RlLkNvbG9yO1xuICAgIC8qKlxuICAgICAqICEjZW4gR3JhZGllbnQgdHlwZS5cbiAgICAgKiAhI3poIOa4kOWPmOiJsuexu+Wei+OAglxuICAgICAqIEBwcm9wZXJ0eSB7TW9kZX0gbW9kZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IE1vZGUsXG4gICAgfSlcbiAgICBnZXQgbW9kZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tb2RlO1xuICAgIH1cblxuICAgIHNldCBtb2RlIChtKSB7XG4gICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIGlmIChtID09PSBNb2RlLlJhbmRvbUNvbG9yKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ3JhZGllbnQuY29sb3JLZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyYWRpZW50LmNvbG9yS2V5cy5wdXNoKG5ldyBDb2xvcktleSgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ3JhZGllbnQuYWxwaGFLZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyYWRpZW50LmFscGhhS2V5cy5wdXNoKG5ldyBBbHBoYUtleSgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbW9kZSA9IG07XG4gICAgfVxuXG4gICAgQHByb3BlcnR5XG4gICAgX2NvbG9yID0gY2MuQ29sb3IuV0hJVEUuY2xvbmUoKTtcbiAgICAvKiogXG4gICAgICogISNlbiBUaGUgY29sb3Igd2hlbiBtb2RlIGlzIENvbG9yLlxuICAgICAqICEjemgg5b2TIG1vZGUg5Li6IENvbG9yIOaXtueahOminOiJsuOAglxuICAgICAqIEBwcm9wZXJ0eSB7Q29sb3J9IGNvbG9yXG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgY29sb3IgPSBjYy5Db2xvci5XSElURS5jbG9uZSgpO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBMb3dlciBjb2xvciBsaW1pdCB3aGVuIG1vZGUgaXMgVHdvQ29sb3JzLlxuICAgICAqICEjemgg5b2TIG1vZGUg5Li6IFR3b0NvbG9ycyDml7bnmoTpopzoibLkuIvpmZDjgIJcbiAgICAgKiBAcHJvcGVydHkge0NvbG9yfSBjb2xvck1pblxuICAgICAqL1xuICAgIEBwcm9wZXJ0eVxuICAgIGNvbG9yTWluID0gY2MuQ29sb3IuV0hJVEUuY2xvbmUoKTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gVXBwZXIgY29sb3IgbGltaXQgd2hlbiBtb2RlIGlzIFR3b0NvbG9ycy5cbiAgICAgKiAhI3poIOW9kyBtb2RlIOS4uiBUd29Db2xvcnMg5pe255qE6aKc6Imy5LiK6ZmQ44CCXG4gICAgICogQHByb3BlcnR5IHtDb2xvcn0gY29sb3JNYXhcbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBjb2xvck1heCA9IGNjLkNvbG9yLldISVRFLmNsb25lKCk7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENvbG9yIGdyYWRpZW50IHdoZW4gbW9kZSBpcyBHcmFkaWVudFxuICAgICAqICEjemgg5b2TIG1vZGUg5Li6IEdyYWRpZW50IOaXtueahOminOiJsua4kOWPmOOAglxuICAgICAqIEBwcm9wZXJ0eSB7R3JhZGllbnR9IGdyYWRpZW50XG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogR3JhZGllbnQsXG4gICAgfSlcbiAgICBncmFkaWVudCA9IG5ldyBHcmFkaWVudCgpO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBMb3dlciBjb2xvciBncmFkaWVudCBsaW1pdCB3aGVuIG1vZGUgaXMgVHdvR3JhZGllbnRzLlxuICAgICAqICEjemgg5b2TIG1vZGUg5Li6IFR3b0dyYWRpZW50cyDml7bnmoTpopzoibLmuJDlj5jkuIvpmZDjgIJcbiAgICAgKiBAcHJvcGVydHkge0dyYWRpZW50fSBncmFkaWVudE1pblxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IEdyYWRpZW50LFxuICAgIH0pXG4gICAgZ3JhZGllbnRNaW4gPSBuZXcgR3JhZGllbnQoKTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gVXBwZXIgY29sb3IgZ3JhZGllbnQgbGltaXQgd2hlbiBtb2RlIGlzIFR3b0dyYWRpZW50cy5cbiAgICAgKiAhI3poIOW9kyBtb2RlIOS4uiBUd29HcmFkaWVudHMg5pe255qE6aKc6Imy5riQ5Y+Y5LiK6ZmQ44CCXG4gICAgICogQHByb3BlcnR5IHtHcmFkaWVudH0gZ3JhZGllbnRNYXhcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBHcmFkaWVudCxcbiAgICB9KVxuICAgIGdyYWRpZW50TWF4ID0gbmV3IEdyYWRpZW50KCk7XG5cbiAgICBldmFsdWF0ZSAodGltZSwgcm5kUmF0aW8pIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLm1vZGUpIHtcbiAgICAgICAgICAgIGNhc2UgTW9kZS5Db2xvcjpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb2xvcjtcbiAgICAgICAgICAgIGNhc2UgTW9kZS5Ud29Db2xvcnM6XG4gICAgICAgICAgICAgICAgdGhpcy5jb2xvck1pbi5sZXJwKHRoaXMuY29sb3JNYXgsIHJuZFJhdGlvLCB0aGlzLl9jb2xvcik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbG9yO1xuICAgICAgICAgICAgY2FzZSBNb2RlLlJhbmRvbUNvbG9yOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdyYWRpZW50LnJhbmRvbUNvbG9yKCk7XG4gICAgICAgICAgICBjYXNlIE1vZGUuR3JhZGllbnQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ3JhZGllbnQuZXZhbHVhdGUodGltZSk7XG4gICAgICAgICAgICBjYXNlIE1vZGUuVHdvR3JhZGllbnRzOlxuICAgICAgICAgICAgICAgIHRoaXMuZ3JhZGllbnRNaW4uZXZhbHVhdGUodGltZSkubGVycCh0aGlzLmdyYWRpZW50TWF4LmV2YWx1YXRlKHRpbWUpLCBybmRSYXRpbywgdGhpcy5fY29sb3IpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb2xvcjtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29sb3I7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNjLkdyYWRpZW50UmFuZ2UgPSBHcmFkaWVudFJhbmdlO1xuIl19