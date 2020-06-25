
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/particle/animator/curve-range.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = exports.Mode = void 0;

var _CCClassDecorator = require("../../../platform/CCClassDecorator");

var _CCEnum = _interopRequireDefault(require("../../../platform/CCEnum"));

var _valueTypes = require("../../../value-types");

var _curve = require("../curve");

var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _class3, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

var Mode = (0, _CCEnum["default"])({
  Constant: 0,
  Curve: 1,
  TwoCurves: 2,
  TwoConstants: 3
});
exports.Mode = Mode;
var CurveRange = (_dec = (0, _CCClassDecorator.ccclass)('cc.CurveRange'), _dec2 = (0, _CCClassDecorator.property)({
  type: Mode
}), _dec3 = (0, _CCClassDecorator.property)({
  type: _curve.AnimationCurve
}), _dec4 = (0, _CCClassDecorator.property)({
  type: _curve.AnimationCurve
}), _dec5 = (0, _CCClassDecorator.property)({
  type: _curve.AnimationCurve
}), _dec(_class = (_class2 = (_temp = _class3 =
/*#__PURE__*/
function () {
  /**
   * !#en Curve type.
   * !#zh 曲线类型。
   * @property {Mode} mode
   */

  /**
   * !#en The curve to use when mode is Curve.
   * !#zh 当 mode 为 Curve 时，使用的曲线。
   * @property {AnimationCurve} curve
   */

  /**
   * !#en The lower limit of the curve to use when mode is TwoCurves
   * !#zh 当 mode 为 TwoCurves 时，使用的曲线下限。
   * @property {AnimationCurve} curveMin
   */

  /**
   * !#en The upper limit of the curve to use when mode is TwoCurves
   * !#zh 当 mode 为 TwoCurves 时，使用的曲线上限。
   * @property {AnimationCurve} curveMax
   */

  /**
   * !#en When mode is Constant, the value of the curve.
   * !#zh 当 mode 为 Constant 时，曲线的值。
   * @property {Number} constant
   */

  /**
   * !#en The lower limit of the curve to use when mode is TwoConstants
   * !#zh 当 mode 为 TwoConstants 时，曲线的下限。
   * @property {Number} constantMin
   */

  /**
   * !#en The upper limit of the curve to use when mode is TwoConstants
   * !#zh 当 mode 为 TwoConstants 时，曲线的上限。
   * @property {Number} constantMax
   */

  /**
   * !#en Coefficients applied to curve interpolation.
   * !#zh 应用于曲线插值的系数。
   * @property {Number} multiplier
   */
  function CurveRange() {
    _initializerDefineProperty(this, "mode", _descriptor, this);

    _initializerDefineProperty(this, "curve", _descriptor2, this);

    _initializerDefineProperty(this, "curveMin", _descriptor3, this);

    _initializerDefineProperty(this, "curveMax", _descriptor4, this);

    _initializerDefineProperty(this, "constant", _descriptor5, this);

    _initializerDefineProperty(this, "constantMin", _descriptor6, this);

    _initializerDefineProperty(this, "constantMax", _descriptor7, this);

    _initializerDefineProperty(this, "multiplier", _descriptor8, this);
  }

  var _proto = CurveRange.prototype;

  _proto.evaluate = function evaluate(time, rndRatio) {
    switch (this.mode) {
      case Mode.Constant:
        return this.constant;

      case Mode.Curve:
        return this.curve.evaluate(time) * this.multiplier;

      case Mode.TwoCurves:
        return (0, _valueTypes.lerp)(this.curveMin.evaluate(time), this.curveMax.evaluate(time), rndRatio) * this.multiplier;

      case Mode.TwoConstants:
        return (0, _valueTypes.lerp)(this.constantMin, this.constantMax, rndRatio);
    }
  };

  _proto.getMax = function getMax() {
    switch (this.mode) {
      case Mode.Constant:
        return this.constant;

      case Mode.Curve:
        return this.multiplier;

      case Mode.TwoConstants:
        return this.constantMax;

      case Mode.TwoCurves:
        return this.multiplier;
    }

    return 0;
  };

  return CurveRange;
}(), _class3.Mode = Mode, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "mode", [_dec2], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return Mode.Constant;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "curve", [_dec3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curve.AnimationCurve();
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "curveMin", [_dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curve.AnimationCurve();
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "curveMax", [_dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curve.AnimationCurve();
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "constant", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "constantMin", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "constantMax", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "multiplier", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1;
  }
})), _class2)) || _class);
exports["default"] = CurveRange;
cc.CurveRange = CurveRange;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1cnZlLXJhbmdlLnRzIl0sIm5hbWVzIjpbIk1vZGUiLCJDb25zdGFudCIsIkN1cnZlIiwiVHdvQ3VydmVzIiwiVHdvQ29uc3RhbnRzIiwiQ3VydmVSYW5nZSIsInR5cGUiLCJBbmltYXRpb25DdXJ2ZSIsImV2YWx1YXRlIiwidGltZSIsInJuZFJhdGlvIiwibW9kZSIsImNvbnN0YW50IiwiY3VydmUiLCJtdWx0aXBsaWVyIiwiY3VydmVNaW4iLCJjdXJ2ZU1heCIsImNvbnN0YW50TWluIiwiY29uc3RhbnRNYXgiLCJnZXRNYXgiLCJwcm9wZXJ0eSIsImNjIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVPLElBQU1BLElBQUksR0FBRyx3QkFBSztBQUNyQkMsRUFBQUEsUUFBUSxFQUFFLENBRFc7QUFFckJDLEVBQUFBLEtBQUssRUFBRSxDQUZjO0FBR3JCQyxFQUFBQSxTQUFTLEVBQUUsQ0FIVTtBQUlyQkMsRUFBQUEsWUFBWSxFQUFFO0FBSk8sQ0FBTCxDQUFiOztJQVFjQyxxQkFEcEIsK0JBQVEsZUFBUixXQVNJLGdDQUFTO0FBQ05DLEVBQUFBLElBQUksRUFBRU47QUFEQSxDQUFULFdBVUEsZ0NBQVM7QUFDTk0sRUFBQUEsSUFBSSxFQUFFQztBQURBLENBQVQsV0FVQSxnQ0FBUztBQUNORCxFQUFBQSxJQUFJLEVBQUVDO0FBREEsQ0FBVCxXQVVBLGdDQUFTO0FBQ05ELEVBQUFBLElBQUksRUFBRUM7QUFEQSxDQUFUOzs7QUFuQ0Q7Ozs7OztBQVVBOzs7Ozs7QUFVQTs7Ozs7O0FBVUE7Ozs7OztBQVVBOzs7Ozs7QUFRQTs7Ozs7O0FBU0E7Ozs7OztBQVFBOzs7OztBQVFBLHdCQUFlO0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7QUFFZDs7OztTQUVEQyxXQUFBLGtCQUFVQyxJQUFWLEVBQWdCQyxRQUFoQixFQUEwQjtBQUN0QixZQUFRLEtBQUtDLElBQWI7QUFDSSxXQUFLWCxJQUFJLENBQUNDLFFBQVY7QUFDSSxlQUFPLEtBQUtXLFFBQVo7O0FBQ0osV0FBS1osSUFBSSxDQUFDRSxLQUFWO0FBQ0ksZUFBTyxLQUFLVyxLQUFMLENBQVdMLFFBQVgsQ0FBb0JDLElBQXBCLElBQTRCLEtBQUtLLFVBQXhDOztBQUNKLFdBQUtkLElBQUksQ0FBQ0csU0FBVjtBQUNJLGVBQU8sc0JBQUssS0FBS1ksUUFBTCxDQUFjUCxRQUFkLENBQXVCQyxJQUF2QixDQUFMLEVBQW1DLEtBQUtPLFFBQUwsQ0FBY1IsUUFBZCxDQUF1QkMsSUFBdkIsQ0FBbkMsRUFBaUVDLFFBQWpFLElBQTZFLEtBQUtJLFVBQXpGOztBQUNKLFdBQUtkLElBQUksQ0FBQ0ksWUFBVjtBQUNJLGVBQU8sc0JBQUssS0FBS2EsV0FBVixFQUF1QixLQUFLQyxXQUE1QixFQUF5Q1IsUUFBekMsQ0FBUDtBQVJSO0FBVUg7O1NBRURTLFNBQUEsa0JBQVU7QUFDTixZQUFRLEtBQUtSLElBQWI7QUFDSSxXQUFLWCxJQUFJLENBQUNDLFFBQVY7QUFDSSxlQUFPLEtBQUtXLFFBQVo7O0FBQ0osV0FBS1osSUFBSSxDQUFDRSxLQUFWO0FBQ0ksZUFBTyxLQUFLWSxVQUFaOztBQUNKLFdBQUtkLElBQUksQ0FBQ0ksWUFBVjtBQUNJLGVBQU8sS0FBS2MsV0FBWjs7QUFDSixXQUFLbEIsSUFBSSxDQUFDRyxTQUFWO0FBQ0ksZUFBTyxLQUFLVyxVQUFaO0FBUlI7O0FBVUEsV0FBTyxDQUFQO0FBQ0g7OzthQXhHTWQsT0FBT0E7Ozs7O1dBVVBBLElBQUksQ0FBQ0M7Ozs7Ozs7V0FVSixJQUFJTSxxQkFBSjs7Ozs7OztXQVVHLElBQUlBLHFCQUFKOzs7Ozs7O1dBVUEsSUFBSUEscUJBQUo7OzZFQU9WYTs7Ozs7V0FDVTs7Z0ZBT1ZBOzs7OztXQUNhOztnRkFRYkE7Ozs7O1dBQ2E7OytFQU9iQTs7Ozs7V0FDWTs7OztBQWtDakJDLEVBQUUsQ0FBQ2hCLFVBQUgsR0FBZ0JBLFVBQWhCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2NjbGFzcywgcHJvcGVydHkgfSBmcm9tICcuLi8uLi8uLi9wbGF0Zm9ybS9DQ0NsYXNzRGVjb3JhdG9yJztcbmltcG9ydCBFbnVtICBmcm9tICcuLi8uLi8uLi9wbGF0Zm9ybS9DQ0VudW0nO1xuaW1wb3J0IHsgbGVycCB9IGZyb20gJy4uLy4uLy4uL3ZhbHVlLXR5cGVzJztcbmltcG9ydCB7IEFuaW1hdGlvbkN1cnZlIH0gZnJvbSAnLi4vY3VydmUnO1xuXG5leHBvcnQgY29uc3QgTW9kZSA9IEVudW0oe1xuICAgIENvbnN0YW50OiAwLFxuICAgIEN1cnZlOiAxLFxuICAgIFR3b0N1cnZlczogMixcbiAgICBUd29Db25zdGFudHM6IDMsXG59KTtcblxuQGNjY2xhc3MoJ2NjLkN1cnZlUmFuZ2UnKVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3VydmVSYW5nZSB7XG4gICAgc3RhdGljIE1vZGUgPSBNb2RlO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBDdXJ2ZSB0eXBlLlxuICAgICAqICEjemgg5puy57q/57G75Z6L44CCXG4gICAgICogQHByb3BlcnR5IHtNb2RlfSBtb2RlXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogTW9kZSxcbiAgICB9KVxuICAgIG1vZGUgPSBNb2RlLkNvbnN0YW50O1xuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgY3VydmUgdG8gdXNlIHdoZW4gbW9kZSBpcyBDdXJ2ZS5cbiAgICAgKiAhI3poIOW9kyBtb2RlIOS4uiBDdXJ2ZSDml7bvvIzkvb/nlKjnmoTmm7Lnur/jgIJcbiAgICAgKiBAcHJvcGVydHkge0FuaW1hdGlvbkN1cnZlfSBjdXJ2ZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IEFuaW1hdGlvbkN1cnZlLFxuICAgIH0pXG4gICAgY3VydmUgPSBuZXcgQW5pbWF0aW9uQ3VydmUoKTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGxvd2VyIGxpbWl0IG9mIHRoZSBjdXJ2ZSB0byB1c2Ugd2hlbiBtb2RlIGlzIFR3b0N1cnZlc1xuICAgICAqICEjemgg5b2TIG1vZGUg5Li6IFR3b0N1cnZlcyDml7bvvIzkvb/nlKjnmoTmm7Lnur/kuIvpmZDjgIJcbiAgICAgKiBAcHJvcGVydHkge0FuaW1hdGlvbkN1cnZlfSBjdXJ2ZU1pblxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IEFuaW1hdGlvbkN1cnZlLFxuICAgIH0pXG4gICAgY3VydmVNaW4gPSBuZXcgQW5pbWF0aW9uQ3VydmUoKTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHVwcGVyIGxpbWl0IG9mIHRoZSBjdXJ2ZSB0byB1c2Ugd2hlbiBtb2RlIGlzIFR3b0N1cnZlc1xuICAgICAqICEjemgg5b2TIG1vZGUg5Li6IFR3b0N1cnZlcyDml7bvvIzkvb/nlKjnmoTmm7Lnur/kuIrpmZDjgIJcbiAgICAgKiBAcHJvcGVydHkge0FuaW1hdGlvbkN1cnZlfSBjdXJ2ZU1heFxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IEFuaW1hdGlvbkN1cnZlLFxuICAgIH0pXG4gICAgY3VydmVNYXggPSBuZXcgQW5pbWF0aW9uQ3VydmUoKTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gV2hlbiBtb2RlIGlzIENvbnN0YW50LCB0aGUgdmFsdWUgb2YgdGhlIGN1cnZlLlxuICAgICAqICEjemgg5b2TIG1vZGUg5Li6IENvbnN0YW50IOaXtu+8jOabsue6v+eahOWAvOOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBjb25zdGFudFxuICAgICAqL1xuICAgIEBwcm9wZXJ0eVxuICAgIGNvbnN0YW50ID0gMDtcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGxvd2VyIGxpbWl0IG9mIHRoZSBjdXJ2ZSB0byB1c2Ugd2hlbiBtb2RlIGlzIFR3b0NvbnN0YW50c1xuICAgICAqICEjemgg5b2TIG1vZGUg5Li6IFR3b0NvbnN0YW50cyDml7bvvIzmm7Lnur/nmoTkuIvpmZDjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gY29uc3RhbnRNaW5cbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBjb25zdGFudE1pbiA9IDA7XG5cblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHVwcGVyIGxpbWl0IG9mIHRoZSBjdXJ2ZSB0byB1c2Ugd2hlbiBtb2RlIGlzIFR3b0NvbnN0YW50c1xuICAgICAqICEjemgg5b2TIG1vZGUg5Li6IFR3b0NvbnN0YW50cyDml7bvvIzmm7Lnur/nmoTkuIrpmZDjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gY29uc3RhbnRNYXhcbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBjb25zdGFudE1heCA9IDA7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENvZWZmaWNpZW50cyBhcHBsaWVkIHRvIGN1cnZlIGludGVycG9sYXRpb24uXG4gICAgICogISN6aCDlupTnlKjkuo7mm7Lnur/mj5LlgLznmoTns7vmlbDjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gbXVsdGlwbGllclxuICAgICAqL1xuICAgIEBwcm9wZXJ0eVxuICAgIG11bHRpcGxpZXIgPSAxO1xuXG4gICAgY29uc3RydWN0b3IgKCkge1xuXG4gICAgfVxuXG4gICAgZXZhbHVhdGUgKHRpbWUsIHJuZFJhdGlvKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5tb2RlKSB7XG4gICAgICAgICAgICBjYXNlIE1vZGUuQ29uc3RhbnQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RhbnQ7XG4gICAgICAgICAgICBjYXNlIE1vZGUuQ3VydmU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VydmUuZXZhbHVhdGUodGltZSkgKiB0aGlzLm11bHRpcGxpZXI7XG4gICAgICAgICAgICBjYXNlIE1vZGUuVHdvQ3VydmVzOlxuICAgICAgICAgICAgICAgIHJldHVybiBsZXJwKHRoaXMuY3VydmVNaW4uZXZhbHVhdGUodGltZSksIHRoaXMuY3VydmVNYXguZXZhbHVhdGUodGltZSksIHJuZFJhdGlvKSAqIHRoaXMubXVsdGlwbGllcjtcbiAgICAgICAgICAgIGNhc2UgTW9kZS5Ud29Db25zdGFudHM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlcnAodGhpcy5jb25zdGFudE1pbiwgdGhpcy5jb25zdGFudE1heCwgcm5kUmF0aW8pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0TWF4ICgpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLm1vZGUpIHtcbiAgICAgICAgICAgIGNhc2UgTW9kZS5Db25zdGFudDpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb25zdGFudDtcbiAgICAgICAgICAgIGNhc2UgTW9kZS5DdXJ2ZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tdWx0aXBsaWVyO1xuICAgICAgICAgICAgY2FzZSBNb2RlLlR3b0NvbnN0YW50czpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb25zdGFudE1heDtcbiAgICAgICAgICAgIGNhc2UgTW9kZS5Ud29DdXJ2ZXM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubXVsdGlwbGllcjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG59XG5cbmNjLkN1cnZlUmFuZ2UgPSBDdXJ2ZVJhbmdlO1xuIl19