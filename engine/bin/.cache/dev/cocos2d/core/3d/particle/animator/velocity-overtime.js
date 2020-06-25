
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/particle/animator/velocity-overtime.js';
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

var _particleGeneralFunction = require("../particle-general-function");

var _curveRange = _interopRequireDefault(require("./curve-range"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

// tslint:disable: max-line-length
var VELOCITY_OVERTIME_RAND_OFFSET = 197866;

var _temp_v3 = cc.v3();

var VelocityOvertimeModule = (_dec = (0, _CCClassDecorator.ccclass)('cc.VelocityOvertimeModule'), _dec2 = (0, _CCClassDecorator.property)({
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
   * !#en The enable of VelocityOvertimeModule.
   * !#zh 是否启用
   * @property {Boolean} enable
   */

  /**
   * !#en Coordinate system used in speed calculation.
   * !#zh 速度计算时采用的坐标系。
   * @property {Space} space
   */

  /**
   * !#en Velocity component in X axis direction
   * !#zh X 轴方向上的速度分量。
   * @property {CurveRange} x
   */

  /**
   * !#en Velocity component in Y axis direction
   * !#zh Y 轴方向上的速度分量。
   * @property {CurveRange} y
   */

  /**
   * !#en Velocity component in Z axis direction
   * !#zh Z 轴方向上的速度分量。
   * @property {CurveRange} z
   */

  /**
   * !#en Speed correction factor (only supports CPU particles).
   * !#zh 速度修正系数（只支持 CPU 粒子）。
   * @property {CurveRange} speedModifier
   */
  function VelocityOvertimeModule() {
    _initializerDefineProperty(this, "enable", _descriptor, this);

    _initializerDefineProperty(this, "space", _descriptor2, this);

    _initializerDefineProperty(this, "x", _descriptor3, this);

    _initializerDefineProperty(this, "y", _descriptor4, this);

    _initializerDefineProperty(this, "z", _descriptor5, this);

    _initializerDefineProperty(this, "speedModifier", _descriptor6, this);

    this.rotation = null;
    this.needTransform = false;
    this.rotation = new _valueTypes.Quat();
    this.speedModifier.constant = 1;
    this.needTransform = false;
  }

  var _proto = VelocityOvertimeModule.prototype;

  _proto.update = function update(space, worldTransform) {
    this.needTransform = (0, _particleGeneralFunction.calculateTransform)(space, this.space, worldTransform, this.rotation);
  };

  _proto.animate = function animate(p) {
    var normalizedTime = 1 - p.remainingLifetime / p.startLifetime;

    var vel = _valueTypes.Vec3.set(_temp_v3, this.x.evaluate(normalizedTime, (0, _valueTypes.pseudoRandom)(p.randomSeed + VELOCITY_OVERTIME_RAND_OFFSET)), this.y.evaluate(normalizedTime, (0, _valueTypes.pseudoRandom)(p.randomSeed + VELOCITY_OVERTIME_RAND_OFFSET)), this.z.evaluate(normalizedTime, (0, _valueTypes.pseudoRandom)(p.randomSeed + VELOCITY_OVERTIME_RAND_OFFSET)));

    if (this.needTransform) {
      _valueTypes.Vec3.transformQuat(vel, vel, this.rotation);
    }

    _valueTypes.Vec3.add(p.animatedVelocity, p.animatedVelocity, vel);

    _valueTypes.Vec3.add(p.ultimateVelocity, p.velocity, p.animatedVelocity);

    _valueTypes.Vec3.scale(p.ultimateVelocity, p.ultimateVelocity, this.speedModifier.evaluate(1 - p.remainingLifetime / p.startLifetime, (0, _valueTypes.pseudoRandom)(p.randomSeed + VELOCITY_OVERTIME_RAND_OFFSET)));
  };

  return VelocityOvertimeModule;
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
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "x", [_dec3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "y", [_dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "z", [_dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "speedModifier", [_dec6], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
})), _class2)) || _class);
exports["default"] = VelocityOvertimeModule;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlbG9jaXR5LW92ZXJ0aW1lLnRzIl0sIm5hbWVzIjpbIlZFTE9DSVRZX09WRVJUSU1FX1JBTkRfT0ZGU0VUIiwiX3RlbXBfdjMiLCJjYyIsInYzIiwiVmVsb2NpdHlPdmVydGltZU1vZHVsZSIsInR5cGUiLCJTcGFjZSIsIkN1cnZlUmFuZ2UiLCJyYW5nZSIsInJvdGF0aW9uIiwibmVlZFRyYW5zZm9ybSIsIlF1YXQiLCJzcGVlZE1vZGlmaWVyIiwiY29uc3RhbnQiLCJ1cGRhdGUiLCJzcGFjZSIsIndvcmxkVHJhbnNmb3JtIiwiYW5pbWF0ZSIsInAiLCJub3JtYWxpemVkVGltZSIsInJlbWFpbmluZ0xpZmV0aW1lIiwic3RhcnRMaWZldGltZSIsInZlbCIsIlZlYzMiLCJzZXQiLCJ4IiwiZXZhbHVhdGUiLCJyYW5kb21TZWVkIiwieSIsInoiLCJ0cmFuc2Zvcm1RdWF0IiwiYWRkIiwiYW5pbWF0ZWRWZWxvY2l0eSIsInVsdGltYXRlVmVsb2NpdHkiLCJ2ZWxvY2l0eSIsInNjYWxlIiwicHJvcGVydHkiLCJMb2NhbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTtBQUNBLElBQU1BLDZCQUE2QixHQUFHLE1BQXRDOztBQUVBLElBQU1DLFFBQVEsR0FBR0MsRUFBRSxDQUFDQyxFQUFILEVBQWpCOztJQUdxQkMsaUNBRHBCLCtCQUFRLDJCQUFSLFdBZ0JJLGdDQUFTO0FBQ05DLEVBQUFBLElBQUksRUFBRUM7QUFEQSxDQUFULFdBVUEsZ0NBQVM7QUFDTkQsRUFBQUEsSUFBSSxFQUFFRSxzQkFEQTtBQUVOQyxFQUFBQSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUYsRUFBSyxDQUFMO0FBRkQsQ0FBVCxXQVdBLGdDQUFTO0FBQ05ILEVBQUFBLElBQUksRUFBRUUsc0JBREE7QUFFTkMsRUFBQUEsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFGLEVBQUssQ0FBTDtBQUZELENBQVQsV0FXQSxnQ0FBUztBQUNOSCxFQUFBQSxJQUFJLEVBQUVFLHNCQURBO0FBRU5DLEVBQUFBLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBRixFQUFLLENBQUw7QUFGRCxDQUFULFdBV0EsZ0NBQVM7QUFDTkgsRUFBQUEsSUFBSSxFQUFFRSxzQkFEQTtBQUVOQyxFQUFBQSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUYsRUFBSyxDQUFMO0FBRkQsQ0FBVDs7O0FBeEREOzs7Ozs7QUFRQTs7Ozs7O0FBVUE7Ozs7OztBQVdBOzs7Ozs7QUFXQTs7Ozs7O0FBV0E7Ozs7O0FBY0Esb0NBQWU7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQSxTQUhmQyxRQUdlLEdBSEosSUFHSTtBQUFBLFNBRmZDLGFBRWUsR0FGQyxLQUVEO0FBQ1gsU0FBS0QsUUFBTCxHQUFnQixJQUFJRSxnQkFBSixFQUFoQjtBQUNBLFNBQUtDLGFBQUwsQ0FBbUJDLFFBQW5CLEdBQThCLENBQTlCO0FBQ0EsU0FBS0gsYUFBTCxHQUFxQixLQUFyQjtBQUNIOzs7O1NBRURJLFNBQUEsZ0JBQVFDLEtBQVIsRUFBZUMsY0FBZixFQUErQjtBQUMzQixTQUFLTixhQUFMLEdBQXFCLGlEQUFtQkssS0FBbkIsRUFBMEIsS0FBS0EsS0FBL0IsRUFBc0NDLGNBQXRDLEVBQXNELEtBQUtQLFFBQTNELENBQXJCO0FBQ0g7O1NBRURRLFVBQUEsaUJBQVNDLENBQVQsRUFBWTtBQUNSLFFBQU1DLGNBQWMsR0FBRyxJQUFJRCxDQUFDLENBQUNFLGlCQUFGLEdBQXNCRixDQUFDLENBQUNHLGFBQW5EOztBQUNBLFFBQU1DLEdBQUcsR0FBR0MsaUJBQUtDLEdBQUwsQ0FBU3ZCLFFBQVQsRUFBbUIsS0FBS3dCLENBQUwsQ0FBT0MsUUFBUCxDQUFnQlAsY0FBaEIsRUFBZ0MsOEJBQWFELENBQUMsQ0FBQ1MsVUFBRixHQUFlM0IsNkJBQTVCLENBQWhDLENBQW5CLEVBQWdILEtBQUs0QixDQUFMLENBQU9GLFFBQVAsQ0FBZ0JQLGNBQWhCLEVBQWdDLDhCQUFhRCxDQUFDLENBQUNTLFVBQUYsR0FBZTNCLDZCQUE1QixDQUFoQyxDQUFoSCxFQUE2TSxLQUFLNkIsQ0FBTCxDQUFPSCxRQUFQLENBQWdCUCxjQUFoQixFQUFnQyw4QkFBYUQsQ0FBQyxDQUFDUyxVQUFGLEdBQWUzQiw2QkFBNUIsQ0FBaEMsQ0FBN00sQ0FBWjs7QUFDQSxRQUFJLEtBQUtVLGFBQVQsRUFBd0I7QUFDcEJhLHVCQUFLTyxhQUFMLENBQW1CUixHQUFuQixFQUF3QkEsR0FBeEIsRUFBNkIsS0FBS2IsUUFBbEM7QUFDSDs7QUFDRGMscUJBQUtRLEdBQUwsQ0FBU2IsQ0FBQyxDQUFDYyxnQkFBWCxFQUE2QmQsQ0FBQyxDQUFDYyxnQkFBL0IsRUFBaURWLEdBQWpEOztBQUNBQyxxQkFBS1EsR0FBTCxDQUFTYixDQUFDLENBQUNlLGdCQUFYLEVBQTZCZixDQUFDLENBQUNnQixRQUEvQixFQUF5Q2hCLENBQUMsQ0FBQ2MsZ0JBQTNDOztBQUNBVCxxQkFBS1ksS0FBTCxDQUFXakIsQ0FBQyxDQUFDZSxnQkFBYixFQUErQmYsQ0FBQyxDQUFDZSxnQkFBakMsRUFBbUQsS0FBS3JCLGFBQUwsQ0FBbUJjLFFBQW5CLENBQTRCLElBQUlSLENBQUMsQ0FBQ0UsaUJBQUYsR0FBc0JGLENBQUMsQ0FBQ0csYUFBeEQsRUFBdUUsOEJBQWFILENBQUMsQ0FBQ1MsVUFBRixHQUFlM0IsNkJBQTVCLENBQXZFLENBQW5EO0FBQ0g7OztvRkEvRUFvQzs7Ozs7V0FDUTs7Ozs7OztXQVVEOUIsWUFBTStCOzs7Ozs7O1dBV1YsSUFBSTlCLHNCQUFKOzs7Ozs7O1dBV0EsSUFBSUEsc0JBQUo7Ozs7Ozs7V0FXQSxJQUFJQSxzQkFBSjs7Ozs7OztXQVdZLElBQUlBLHNCQUFKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2NjbGFzcywgcHJvcGVydHkgfSBmcm9tICcuLi8uLi8uLi9wbGF0Zm9ybS9DQ0NsYXNzRGVjb3JhdG9yJztcbmltcG9ydCB7IHBzZXVkb1JhbmRvbSwgUXVhdCwgVmVjMyB9IGZyb20gJy4uLy4uLy4uL3ZhbHVlLXR5cGVzJztcbmltcG9ydCB7IFNwYWNlIH0gZnJvbSAnLi4vZW51bSc7XG5pbXBvcnQgeyBjYWxjdWxhdGVUcmFuc2Zvcm0gfSBmcm9tICcuLi9wYXJ0aWNsZS1nZW5lcmFsLWZ1bmN0aW9uJztcbmltcG9ydCBDdXJ2ZVJhbmdlIGZyb20gJy4vY3VydmUtcmFuZ2UnO1xuXG4vLyB0c2xpbnQ6ZGlzYWJsZTogbWF4LWxpbmUtbGVuZ3RoXG5jb25zdCBWRUxPQ0lUWV9PVkVSVElNRV9SQU5EX09GRlNFVCA9IDE5Nzg2NjtcblxuY29uc3QgX3RlbXBfdjMgPSBjYy52MygpO1xuXG5AY2NjbGFzcygnY2MuVmVsb2NpdHlPdmVydGltZU1vZHVsZScpXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWZWxvY2l0eU92ZXJ0aW1lTW9kdWxlIHtcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGVuYWJsZSBvZiBWZWxvY2l0eU92ZXJ0aW1lTW9kdWxlLlxuICAgICAqICEjemgg5piv5ZCm5ZCv55SoXG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSBlbmFibGVcbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBlbmFibGUgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gQ29vcmRpbmF0ZSBzeXN0ZW0gdXNlZCBpbiBzcGVlZCBjYWxjdWxhdGlvbi5cbiAgICAgKiAhI3poIOmAn+W6puiuoeeul+aXtumHh+eUqOeahOWdkOagh+ezu+OAglxuICAgICAqIEBwcm9wZXJ0eSB7U3BhY2V9IHNwYWNlXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogU3BhY2UsXG4gICAgfSlcbiAgICBzcGFjZSA9IFNwYWNlLkxvY2FsO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBWZWxvY2l0eSBjb21wb25lbnQgaW4gWCBheGlzIGRpcmVjdGlvblxuICAgICAqICEjemggWCDovbTmlrnlkJHkuIrnmoTpgJ/luqbliIbph4/jgIJcbiAgICAgKiBAcHJvcGVydHkge0N1cnZlUmFuZ2V9IHhcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBDdXJ2ZVJhbmdlLFxuICAgICAgICByYW5nZTogWy0xLCAxXSxcbiAgICB9KVxuICAgIHggPSBuZXcgQ3VydmVSYW5nZSgpO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBWZWxvY2l0eSBjb21wb25lbnQgaW4gWSBheGlzIGRpcmVjdGlvblxuICAgICAqICEjemggWSDovbTmlrnlkJHkuIrnmoTpgJ/luqbliIbph4/jgIJcbiAgICAgKiBAcHJvcGVydHkge0N1cnZlUmFuZ2V9IHlcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBDdXJ2ZVJhbmdlLFxuICAgICAgICByYW5nZTogWy0xLCAxXSxcbiAgICB9KVxuICAgIHkgPSBuZXcgQ3VydmVSYW5nZSgpO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBWZWxvY2l0eSBjb21wb25lbnQgaW4gWiBheGlzIGRpcmVjdGlvblxuICAgICAqICEjemggWiDovbTmlrnlkJHkuIrnmoTpgJ/luqbliIbph4/jgIJcbiAgICAgKiBAcHJvcGVydHkge0N1cnZlUmFuZ2V9IHpcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBDdXJ2ZVJhbmdlLFxuICAgICAgICByYW5nZTogWy0xLCAxXSxcbiAgICB9KVxuICAgIHogPSBuZXcgQ3VydmVSYW5nZSgpO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBTcGVlZCBjb3JyZWN0aW9uIGZhY3RvciAob25seSBzdXBwb3J0cyBDUFUgcGFydGljbGVzKS5cbiAgICAgKiAhI3poIOmAn+W6puS/ruato+ezu+aVsO+8iOWPquaUr+aMgSBDUFUg57KS5a2Q77yJ44CCXG4gICAgICogQHByb3BlcnR5IHtDdXJ2ZVJhbmdlfSBzcGVlZE1vZGlmaWVyXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogQ3VydmVSYW5nZSxcbiAgICAgICAgcmFuZ2U6IFstMSwgMV0sXG4gICAgfSlcbiAgICBzcGVlZE1vZGlmaWVyID0gbmV3IEN1cnZlUmFuZ2UoKTtcblxuICAgIHJvdGF0aW9uID0gbnVsbDtcbiAgICBuZWVkVHJhbnNmb3JtID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHRoaXMucm90YXRpb24gPSBuZXcgUXVhdCgpO1xuICAgICAgICB0aGlzLnNwZWVkTW9kaWZpZXIuY29uc3RhbnQgPSAxO1xuICAgICAgICB0aGlzLm5lZWRUcmFuc2Zvcm0gPSBmYWxzZTtcbiAgICB9XG5cbiAgICB1cGRhdGUgKHNwYWNlLCB3b3JsZFRyYW5zZm9ybSkge1xuICAgICAgICB0aGlzLm5lZWRUcmFuc2Zvcm0gPSBjYWxjdWxhdGVUcmFuc2Zvcm0oc3BhY2UsIHRoaXMuc3BhY2UsIHdvcmxkVHJhbnNmb3JtLCB0aGlzLnJvdGF0aW9uKTtcbiAgICB9XG5cbiAgICBhbmltYXRlIChwKSB7XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRUaW1lID0gMSAtIHAucmVtYWluaW5nTGlmZXRpbWUgLyBwLnN0YXJ0TGlmZXRpbWU7XG4gICAgICAgIGNvbnN0IHZlbCA9IFZlYzMuc2V0KF90ZW1wX3YzLCB0aGlzLnguZXZhbHVhdGUobm9ybWFsaXplZFRpbWUsIHBzZXVkb1JhbmRvbShwLnJhbmRvbVNlZWQgKyBWRUxPQ0lUWV9PVkVSVElNRV9SQU5EX09GRlNFVCkpLCB0aGlzLnkuZXZhbHVhdGUobm9ybWFsaXplZFRpbWUsIHBzZXVkb1JhbmRvbShwLnJhbmRvbVNlZWQgKyBWRUxPQ0lUWV9PVkVSVElNRV9SQU5EX09GRlNFVCkpLCB0aGlzLnouZXZhbHVhdGUobm9ybWFsaXplZFRpbWUsIHBzZXVkb1JhbmRvbShwLnJhbmRvbVNlZWQgKyBWRUxPQ0lUWV9PVkVSVElNRV9SQU5EX09GRlNFVCkpKTtcbiAgICAgICAgaWYgKHRoaXMubmVlZFRyYW5zZm9ybSkge1xuICAgICAgICAgICAgVmVjMy50cmFuc2Zvcm1RdWF0KHZlbCwgdmVsLCB0aGlzLnJvdGF0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBWZWMzLmFkZChwLmFuaW1hdGVkVmVsb2NpdHksIHAuYW5pbWF0ZWRWZWxvY2l0eSwgdmVsKTtcbiAgICAgICAgVmVjMy5hZGQocC51bHRpbWF0ZVZlbG9jaXR5LCBwLnZlbG9jaXR5LCBwLmFuaW1hdGVkVmVsb2NpdHkpO1xuICAgICAgICBWZWMzLnNjYWxlKHAudWx0aW1hdGVWZWxvY2l0eSwgcC51bHRpbWF0ZVZlbG9jaXR5LCB0aGlzLnNwZWVkTW9kaWZpZXIuZXZhbHVhdGUoMSAtIHAucmVtYWluaW5nTGlmZXRpbWUgLyBwLnN0YXJ0TGlmZXRpbWUsIHBzZXVkb1JhbmRvbShwLnJhbmRvbVNlZWQgKyBWRUxPQ0lUWV9PVkVSVElNRV9SQU5EX09GRlNFVCkpKTtcbiAgICB9XG5cbn1cbiJdfQ==