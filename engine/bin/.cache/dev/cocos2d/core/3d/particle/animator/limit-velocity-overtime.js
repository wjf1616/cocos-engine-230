
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/particle/animator/limit-velocity-overtime.js';
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

var _valueTypes = require("../../../value-types");

var _enum = require("../enum");

var _curveRange = _interopRequireDefault(require("./curve-range"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

// tslint:disable: max-line-length
var LIMIT_VELOCITY_RAND_OFFSET = 23541;

var _temp_v3 = cc.v3();

function dampenBeyondLimit(vel, limit, dampen) {
  var sgn = Math.sign(vel);
  var abs = Math.abs(vel);

  if (abs > limit) {
    abs = (0, _valueTypes.lerp)(abs, limit, dampen);
  }

  return abs * sgn;
}

var LimitVelocityOvertimeModule = (_dec = (0, _CCClassDecorator.ccclass)('cc.LimitVelocityOvertimeModule'), _dec2 = (0, _CCClassDecorator.property)({
  type: _enum.Space
}), _dec3 = (0, _CCClassDecorator.property)({
  type: _curveRange["default"],
  range: [-1, 1]
}), _dec4 = (0, _CCClassDecorator.property)({
  type: _curveRange["default"],
  range: [-1, 1]
}), _dec5 = (0, _CCClassDecorator.property)({
  type: _curveRange["default"],
  range: [-1, 1]
}), _dec6 = (0, _CCClassDecorator.property)({
  type: _curveRange["default"],
  range: [-1, 1]
}), _dec(_class = (_class2 = (_temp =
/*#__PURE__*/
function () {
  /**
   * !#en The enable of LimitVelocityOvertimeModule.
   * !#zh 是否启用
   * @property {Boolean} enable
   */

  /**
   * !#en The coordinate system used when calculating the lower speed limit.
   * !#zh 计算速度下限时采用的坐标系。
   * @property {Space} space
   */

  /**
   * !#en Whether to limit the three axes separately.
   * !#zh 是否三个轴分开限制。
   * @property {Boolean} separateAxes
   */

  /**
   * !#en Lower speed limit
   * !#zh 速度下限。
   * @property {CurveRange} limit
   */

  /**
   * !#en Lower speed limit in X direction.
   * !#zh X 轴方向上的速度下限。
   * @property {CurveRange} limitX
   */

  /**
   * !#en Lower speed limit in Y direction.
   * !#zh Y 轴方向上的速度下限。
   * @property {CurveRange} limitY
   */

  /**
   * !#en Lower speed limit in Z direction.
   * !#zh Z 轴方向上的速度下限。
   * @property {CurveRange} limitZ
   */

  /**
   * !#en Interpolation of current speed and lower speed limit.
   * !#zh 当前速度与速度下限的插值。
   * @property {Number} dampen
   */
  // TODO:functions related to drag are temporarily not supported
  function LimitVelocityOvertimeModule() {
    _initializerDefineProperty(this, "enable", _descriptor, this);

    _initializerDefineProperty(this, "space", _descriptor2, this);

    _initializerDefineProperty(this, "separateAxes", _descriptor3, this);

    _initializerDefineProperty(this, "limit", _descriptor4, this);

    _initializerDefineProperty(this, "limitX", _descriptor5, this);

    _initializerDefineProperty(this, "limitY", _descriptor6, this);

    _initializerDefineProperty(this, "limitZ", _descriptor7, this);

    _initializerDefineProperty(this, "dampen", _descriptor8, this);

    this.drag = null;
    this.multiplyDragByParticleSize = false;
    this.multiplyDragByParticleVelocity = false;
  }

  var _proto = LimitVelocityOvertimeModule.prototype;

  _proto.animate = function animate(p) {
    var normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
    var dampedVel = _temp_v3;

    if (this.separateAxes) {
      _valueTypes.Vec3.set(dampedVel, dampenBeyondLimit(p.ultimateVelocity.x, this.limitX.evaluate(normalizedTime, (0, _valueTypes.pseudoRandom)(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET)), this.dampen), dampenBeyondLimit(p.ultimateVelocity.y, this.limitY.evaluate(normalizedTime, (0, _valueTypes.pseudoRandom)(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET)), this.dampen), dampenBeyondLimit(p.ultimateVelocity.z, this.limitZ.evaluate(normalizedTime, (0, _valueTypes.pseudoRandom)(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET)), this.dampen));
    } else {
      _valueTypes.Vec3.normalize(dampedVel, p.ultimateVelocity);

      _valueTypes.Vec3.scale(dampedVel, dampedVel, dampenBeyondLimit(p.ultimateVelocity.len(), this.limit.evaluate(normalizedTime, (0, _valueTypes.pseudoRandom)(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET)), this.dampen));
    }

    _valueTypes.Vec3.copy(p.ultimateVelocity, dampedVel);
  };

  return LimitVelocityOvertimeModule;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "enable", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "space", [_dec2], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return _enum.Space.Local;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "separateAxes", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "limit", [_dec3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "limitX", [_dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "limitY", [_dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "limitZ", [_dec6], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "dampen", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 3;
  }
})), _class2)) || _class);
exports["default"] = LimitVelocityOvertimeModule;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpbWl0LXZlbG9jaXR5LW92ZXJ0aW1lLnRzIl0sIm5hbWVzIjpbIkxJTUlUX1ZFTE9DSVRZX1JBTkRfT0ZGU0VUIiwiX3RlbXBfdjMiLCJjYyIsInYzIiwiZGFtcGVuQmV5b25kTGltaXQiLCJ2ZWwiLCJsaW1pdCIsImRhbXBlbiIsInNnbiIsIk1hdGgiLCJzaWduIiwiYWJzIiwiTGltaXRWZWxvY2l0eU92ZXJ0aW1lTW9kdWxlIiwidHlwZSIsIlNwYWNlIiwiQ3VydmVSYW5nZSIsInJhbmdlIiwiZHJhZyIsIm11bHRpcGx5RHJhZ0J5UGFydGljbGVTaXplIiwibXVsdGlwbHlEcmFnQnlQYXJ0aWNsZVZlbG9jaXR5IiwiYW5pbWF0ZSIsInAiLCJub3JtYWxpemVkVGltZSIsInJlbWFpbmluZ0xpZmV0aW1lIiwic3RhcnRMaWZldGltZSIsImRhbXBlZFZlbCIsInNlcGFyYXRlQXhlcyIsIlZlYzMiLCJzZXQiLCJ1bHRpbWF0ZVZlbG9jaXR5IiwieCIsImxpbWl0WCIsImV2YWx1YXRlIiwicmFuZG9tU2VlZCIsInkiLCJsaW1pdFkiLCJ6IiwibGltaXRaIiwibm9ybWFsaXplIiwic2NhbGUiLCJsZW4iLCJjb3B5IiwicHJvcGVydHkiLCJMb2NhbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTtBQUNBLElBQU1BLDBCQUEwQixHQUFHLEtBQW5DOztBQUVBLElBQU1DLFFBQVEsR0FBR0MsRUFBRSxDQUFDQyxFQUFILEVBQWpCOztBQUVBLFNBQVNDLGlCQUFULENBQTRCQyxHQUE1QixFQUFpQ0MsS0FBakMsRUFBd0NDLE1BQXhDLEVBQWdEO0FBQzVDLE1BQU1DLEdBQUcsR0FBR0MsSUFBSSxDQUFDQyxJQUFMLENBQVVMLEdBQVYsQ0FBWjtBQUNBLE1BQUlNLEdBQUcsR0FBR0YsSUFBSSxDQUFDRSxHQUFMLENBQVNOLEdBQVQsQ0FBVjs7QUFDQSxNQUFJTSxHQUFHLEdBQUdMLEtBQVYs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RG9CLHFCQUFLYyxJQUFMLENBQVVwQixDQUFDLENBQUNRLGdCQUFaLEVBQThCSixTQUE5QjtBQUNIOzs7b0ZBakdBaUI7Ozs7O1dBQ1E7Ozs7Ozs7V0FVRDVCLFlBQU02Qjs7aUZBT2JEOzs7OztXQUNjOzs7Ozs7O1dBV1AsSUFBSTNCLHNCQUFKOzs7Ozs7O1dBV0MsSUFBSUEsc0JBQUo7Ozs7Ozs7V0FXQSxJQUFJQSxzQkFBSjs7Ozs7OztXQVdBLElBQUlBLHNCQUFKOzsyRUFPUjJCOzs7OztXQUNRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2NjbGFzcywgcHJvcGVydHkgfSBmcm9tICcuLi8uLi8uLi9wbGF0Zm9ybS9DQ0NsYXNzRGVjb3JhdG9yJztcbmltcG9ydCB7IGxlcnAsIHBzZXVkb1JhbmRvbSwgVmVjMyB9IGZyb20gJy4uLy4uLy4uL3ZhbHVlLXR5cGVzJztcbmltcG9ydCB7IFNwYWNlIH0gZnJvbSAnLi4vZW51bSc7XG5pbXBvcnQgQ3VydmVSYW5nZSBmcm9tICcuL2N1cnZlLXJhbmdlJztcblxuLy8gdHNsaW50OmRpc2FibGU6IG1heC1saW5lLWxlbmd0aFxuY29uc3QgTElNSVRfVkVMT0NJVFlfUkFORF9PRkZTRVQgPSAyMzU0MTtcblxuY29uc3QgX3RlbXBfdjMgPSBjYy52MygpO1xuXG5mdW5jdGlvbiBkYW1wZW5CZXlvbmRMaW1pdCAodmVsLCBsaW1pdCwgZGFtcGVuKSB7XG4gICAgY29uc3Qgc2duID0gTWF0aC5zaWduKHZlbCk7XG4gICAgbGV0IGFicyA9IE1hdGguYWJzKHZlbCk7XG4gICAgaWYgKGFicyA+IGxpbWl0KSB7XG4gICAgICAgIGFicyA9IGxlcnAoYWJzLCBsaW1pdCwgZGFtcGVuKTtcbiAgICB9XG4gICAgcmV0dXJuIGFicyAqIHNnbjtcbn1cblxuQGNjY2xhc3MoJ2NjLkxpbWl0VmVsb2NpdHlPdmVydGltZU1vZHVsZScpXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW1pdFZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUge1xuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZW5hYmxlIG9mIExpbWl0VmVsb2NpdHlPdmVydGltZU1vZHVsZS5cbiAgICAgKiAhI3poIOaYr+WQpuWQr+eUqFxuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZW5hYmxlXG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgZW5hYmxlID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBjb29yZGluYXRlIHN5c3RlbSB1c2VkIHdoZW4gY2FsY3VsYXRpbmcgdGhlIGxvd2VyIHNwZWVkIGxpbWl0LlxuICAgICAqICEjemgg6K6h566X6YCf5bqm5LiL6ZmQ5pe26YeH55So55qE5Z2Q5qCH57O744CCXG4gICAgICogQHByb3BlcnR5IHtTcGFjZX0gc3BhY2VcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBTcGFjZSxcbiAgICB9KVxuICAgIHNwYWNlID0gU3BhY2UuTG9jYWw7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFdoZXRoZXIgdG8gbGltaXQgdGhlIHRocmVlIGF4ZXMgc2VwYXJhdGVseS5cbiAgICAgKiAhI3poIOaYr+WQpuS4ieS4qui9tOWIhuW8gOmZkOWItuOAglxuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gc2VwYXJhdGVBeGVzXG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgc2VwYXJhdGVBeGVzID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIExvd2VyIHNwZWVkIGxpbWl0XG4gICAgICogISN6aCDpgJ/luqbkuIvpmZDjgIJcbiAgICAgKiBAcHJvcGVydHkge0N1cnZlUmFuZ2V9IGxpbWl0XG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogQ3VydmVSYW5nZSxcbiAgICAgICAgcmFuZ2U6IFstMSwgMV0sXG4gICAgfSlcbiAgICBsaW1pdCA9IG5ldyBDdXJ2ZVJhbmdlKCk7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIExvd2VyIHNwZWVkIGxpbWl0IGluIFggZGlyZWN0aW9uLlxuICAgICAqICEjemggWCDovbTmlrnlkJHkuIrnmoTpgJ/luqbkuIvpmZDjgIJcbiAgICAgKiBAcHJvcGVydHkge0N1cnZlUmFuZ2V9IGxpbWl0WFxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IEN1cnZlUmFuZ2UsXG4gICAgICAgIHJhbmdlOiBbLTEsIDFdLFxuICAgIH0pXG4gICAgbGltaXRYID0gbmV3IEN1cnZlUmFuZ2UoKTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gTG93ZXIgc3BlZWQgbGltaXQgaW4gWSBkaXJlY3Rpb24uXG4gICAgICogISN6aCBZIOi9tOaWueWQkeS4iueahOmAn+W6puS4i+mZkOOAglxuICAgICAqIEBwcm9wZXJ0eSB7Q3VydmVSYW5nZX0gbGltaXRZXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogQ3VydmVSYW5nZSxcbiAgICAgICAgcmFuZ2U6IFstMSwgMV0sXG4gICAgfSlcbiAgICBsaW1pdFkgPSBuZXcgQ3VydmVSYW5nZSgpO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBMb3dlciBzcGVlZCBsaW1pdCBpbiBaIGRpcmVjdGlvbi5cbiAgICAgKiAhI3poIFog6L205pa55ZCR5LiK55qE6YCf5bqm5LiL6ZmQ44CCXG4gICAgICogQHByb3BlcnR5IHtDdXJ2ZVJhbmdlfSBsaW1pdFpcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBDdXJ2ZVJhbmdlLFxuICAgICAgICByYW5nZTogWy0xLCAxXSxcbiAgICB9KVxuICAgIGxpbWl0WiA9IG5ldyBDdXJ2ZVJhbmdlKCk7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEludGVycG9sYXRpb24gb2YgY3VycmVudCBzcGVlZCBhbmQgbG93ZXIgc3BlZWQgbGltaXQuXG4gICAgICogISN6aCDlvZPliY3pgJ/luqbkuI7pgJ/luqbkuIvpmZDnmoTmj5LlgLzjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gZGFtcGVuXG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgZGFtcGVuID0gMztcblxuICAgIC8vIFRPRE86ZnVuY3Rpb25zIHJlbGF0ZWQgdG8gZHJhZyBhcmUgdGVtcG9yYXJpbHkgbm90IHN1cHBvcnRlZFxuICAgIGRyYWcgPSBudWxsO1xuXG4gICAgbXVsdGlwbHlEcmFnQnlQYXJ0aWNsZVNpemUgPSBmYWxzZTtcblxuICAgIG11bHRpcGx5RHJhZ0J5UGFydGljbGVWZWxvY2l0eSA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgIH1cblxuICAgIGFuaW1hdGUgKHApIHtcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZFRpbWUgPSAxIC0gcC5yZW1haW5pbmdMaWZldGltZSAvIHAuc3RhcnRMaWZldGltZTtcbiAgICAgICAgY29uc3QgZGFtcGVkVmVsID0gX3RlbXBfdjM7XG4gICAgICAgIGlmICh0aGlzLnNlcGFyYXRlQXhlcykge1xuICAgICAgICAgICAgVmVjMy5zZXQoZGFtcGVkVmVsLFxuICAgICAgICAgICAgICAgIGRhbXBlbkJleW9uZExpbWl0KHAudWx0aW1hdGVWZWxvY2l0eS54LCB0aGlzLmxpbWl0WC5ldmFsdWF0ZShub3JtYWxpemVkVGltZSwgcHNldWRvUmFuZG9tKHAucmFuZG9tU2VlZCArIExJTUlUX1ZFTE9DSVRZX1JBTkRfT0ZGU0VUKSksIHRoaXMuZGFtcGVuKSxcbiAgICAgICAgICAgICAgICBkYW1wZW5CZXlvbmRMaW1pdChwLnVsdGltYXRlVmVsb2NpdHkueSwgdGhpcy5saW1pdFkuZXZhbHVhdGUobm9ybWFsaXplZFRpbWUsIHBzZXVkb1JhbmRvbShwLnJhbmRvbVNlZWQgKyBMSU1JVF9WRUxPQ0lUWV9SQU5EX09GRlNFVCkpLCB0aGlzLmRhbXBlbiksXG4gICAgICAgICAgICAgICAgZGFtcGVuQmV5b25kTGltaXQocC51bHRpbWF0ZVZlbG9jaXR5LnosIHRoaXMubGltaXRaLmV2YWx1YXRlKG5vcm1hbGl6ZWRUaW1lLCBwc2V1ZG9SYW5kb20ocC5yYW5kb21TZWVkICsgTElNSVRfVkVMT0NJVFlfUkFORF9PRkZTRVQpKSwgdGhpcy5kYW1wZW4pKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIFZlYzMubm9ybWFsaXplKGRhbXBlZFZlbCwgcC51bHRpbWF0ZVZlbG9jaXR5KTtcbiAgICAgICAgICAgIFZlYzMuc2NhbGUoZGFtcGVkVmVsLCBkYW1wZWRWZWwsIGRhbXBlbkJleW9uZExpbWl0KHAudWx0aW1hdGVWZWxvY2l0eS5sZW4oKSwgdGhpcy5saW1pdC5ldmFsdWF0ZShub3JtYWxpemVkVGltZSwgcHNldWRvUmFuZG9tKHAucmFuZG9tU2VlZCArIExJTUlUX1ZFTE9DSVRZX1JBTkRfT0ZGU0VUKSksIHRoaXMuZGFtcGVuKSk7XG4gICAgICAgIH1cbiAgICAgICAgVmVjMy5jb3B5KHAudWx0aW1hdGVWZWxvY2l0eSwgZGFtcGVkVmVsKTtcbiAgICB9XG5cbn1cblxuIl19