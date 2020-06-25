
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/particle/animator/force-overtime.js';
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

var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

// tslint:disable: max-line-length
var FORCE_OVERTIME_RAND_OFFSET = 212165;

var _temp_v3 = cc.v3();

var ForceOvertimeModule = (_dec = (0, _CCClassDecorator.ccclass)('cc.ForceOvertimeModule'), _dec2 = (0, _CCClassDecorator.property)({
  type: _enum.Space
}), _dec3 = (0, _CCClassDecorator.property)({
  type: _curveRange["default"],
  range: [-1, 1]
}), _dec4 = (0, _CCClassDecorator.property)({
  type: _curveRange["default"],
  range: [-1, 1]
}), _dec5 = (0, _CCClassDecorator.property)({
  type: _curveRange["default"],
  range: [-1, 1],
  displayOrder: 4
}), _dec(_class = (_class2 = (_temp =
/*#__PURE__*/
function () {
  /**
   * !#en The enable of ColorOvertimeModule.
   * !#zh 是否启用
   * @property {Boolean} enable
   */

  /**
   * !#en Coordinate system used in acceleration calculation.
   * !#zh 加速度计算时采用的坐标系。
   * @property {Space} space
   */

  /**
   * !#en X-axis acceleration component.
   * !#zh X 轴方向上的加速度分量。
   * @property {CurveRange} x
   */

  /**
   * !#en Y-axis acceleration component.
   * !#zh Y 轴方向上的加速度分量。
   * @property {CurveRange} y
   */

  /**
   * !#en Z-axis acceleration component.
   * !#zh Z 轴方向上的加速度分量。
   * @property {CurveRange} z
   */
  // TODO:currently not supported
  function ForceOvertimeModule() {
    _initializerDefineProperty(this, "enable", _descriptor, this);

    _initializerDefineProperty(this, "space", _descriptor2, this);

    _initializerDefineProperty(this, "x", _descriptor3, this);

    _initializerDefineProperty(this, "y", _descriptor4, this);

    _initializerDefineProperty(this, "z", _descriptor5, this);

    this.randomized = false;
    this.rotation = null;
    this.needTransform = false;
    this.rotation = new _valueTypes.Quat();
    this.needTransform = false;
  }

  var _proto = ForceOvertimeModule.prototype;

  _proto.update = function update(space, worldTransform) {
    this.needTransform = (0, _particleGeneralFunction.calculateTransform)(space, this.space, worldTransform, this.rotation);
  };

  _proto.animate = function animate(p, dt) {
    var normalizedTime = 1 - p.remainingLifetime / p.startLifetime;

    var force = _valueTypes.Vec3.set(_temp_v3, this.x.evaluate(normalizedTime, (0, _valueTypes.pseudoRandom)(p.randomSeed + FORCE_OVERTIME_RAND_OFFSET)), this.y.evaluate(normalizedTime, (0, _valueTypes.pseudoRandom)(p.randomSeed + FORCE_OVERTIME_RAND_OFFSET)), this.z.evaluate(normalizedTime, (0, _valueTypes.pseudoRandom)(p.randomSeed + FORCE_OVERTIME_RAND_OFFSET)));

    if (this.needTransform) {
      _valueTypes.Vec3.transformQuat(force, force, this.rotation);
    }

    _valueTypes.Vec3.scaleAndAdd(p.velocity, p.velocity, force, dt);
  };

  return ForceOvertimeModule;
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
})), _class2)) || _class);
exports["default"] = ForceOvertimeModule;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvcmNlLW92ZXJ0aW1lLnRzIl0sIm5hbWVzIjpbIkZPUkNFX09WRVJUSU1FX1JBTkRfT0ZGU0VUIiwiX3RlbXBfdjMiLCJjYyIsInYzIiwiRm9yY2VPdmVydGltZU1vZHVsZSIsInR5cGUiLCJTcGFjZSIsIkN1cnZlUmFuZ2UiLCJyYW5nZSIsImRpc3BsYXlPcmRlciIsInJhbmRvbWl6ZWQiLCJyb3RhdGlvbiIsIm5lZWRUcmFuc2Zvcm0iLCJRdWF0IiwidXBkYXRlIiwic3BhY2UiLCJ3b3JsZFRyYW5zZm9ybSIsImFuaW1hdGUiLCJwIiwiZHQiLCJub3JtYWxpemVkVGltZSIsInJlbWFpbmluZ0xpZmV0aW1lIiwic3RhcnRMaWZldGltZSIsImZvcmNlIiwiVmVjMyIsInNldCIsIngiLCJldmFsdWF0ZSIsInJhbmRvbVNlZWQiLCJ5IiwieiIsInRyYW5zZm9ybVF1YXQiLCJzY2FsZUFuZEFkZCIsInZlbG9jaXR5IiwicHJvcGVydHkiLCJMb2NhbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTtBQUNBLElBQU1BLDBCQUEwQixHQUFHLE1BQW5DOztBQUVBLElBQU1DLFFBQVEsR0FBR0MsRUFBRSxDQUFDQyxFQUFILEVBQWpCOztJQUdxQkMsOEJBRHBCLCtCQUFRLHdCQUFSLFdBZ0JJLGdDQUFTO0FBQ05DLEVBQUFBLElBQUksRUFBRUM7QUFEQSxDQUFULFdBVUEsZ0NBQVM7QUFDTkQsRUFBQUEsSUFBSSxFQUFFRSxzQkFEQTtBQUVOQyxFQUFBQSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUYsRUFBSyxDQUFMO0FBRkQsQ0FBVCxXQVdBLGdDQUFTO0FBQ05ILEVBQUFBLElBQUksRUFBRUUsc0JBREE7QUFFTkMsRUFBQUEsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFGLEVBQUssQ0FBTDtBQUZELENBQVQsV0FXQSxnQ0FBUztBQUNOSCxFQUFBQSxJQUFJLEVBQUVFLHNCQURBO0FBRU5DLEVBQUFBLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBRixFQUFLLENBQUwsQ0FGRDtBQUdOQyxFQUFBQSxZQUFZLEVBQUU7QUFIUixDQUFUOzs7QUE3Q0Q7Ozs7OztBQVFBOzs7Ozs7QUFVQTs7Ozs7O0FBV0E7Ozs7OztBQVdBOzs7OztBQVlBO0FBTUEsaUNBQWU7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQSxTQUxmQyxVQUtlLEdBTEYsS0FLRTtBQUFBLFNBSGZDLFFBR2UsR0FISixJQUdJO0FBQUEsU0FGZkMsYUFFZSxHQUZDLEtBRUQ7QUFDWCxTQUFLRCxRQUFMLEdBQWdCLElBQUlFLGdCQUFKLEVBQWhCO0FBQ0EsU0FBS0QsYUFBTCxHQUFxQixLQUFyQjtBQUNIOzs7O1NBRURFLFNBQUEsZ0JBQVFDLEtBQVIsRUFBZUMsY0FBZixFQUErQjtBQUMzQixTQUFLSixhQUFMLEdBQXFCLGlEQUFtQkcsS0FBbkIsRUFBMEIsS0FBS0EsS0FBL0IsRUFBc0NDLGNBQXRDLEVBQXNELEtBQUtMLFFBQTNELENBQXJCO0FBQ0g7O1NBRURNLFVBQUEsaUJBQVNDLENBQVQsRUFBWUMsRUFBWixFQUFnQjtBQUNaLFFBQU1DLGNBQWMsR0FBRyxJQUFJRixDQUFDLENBQUNHLGlCQUFGLEdBQXNCSCxDQUFDLENBQUNJLGFBQW5EOztBQUNBLFFBQU1DLEtBQUssR0FBR0MsaUJBQUtDLEdBQUwsQ0FBU3hCLFFBQVQsRUFBbUIsS0FBS3lCLENBQUwsQ0FBT0MsUUFBUCxDQUFnQlAsY0FBaEIsRUFBZ0MsOEJBQWFGLENBQUMsQ0FBQ1UsVUFBRixHQUFlNUIsMEJBQTVCLENBQWhDLENBQW5CLEVBQTZHLEtBQUs2QixDQUFMLENBQU9GLFFBQVAsQ0FBZ0JQLGNBQWhCLEVBQWdDLDhCQUFhRixDQUFDLENBQUNVLFVBQUYsR0FBZTVCLDBCQUE1QixDQUFoQyxDQUE3RyxFQUF1TSxLQUFLOEIsQ0FBTCxDQUFPSCxRQUFQLENBQWdCUCxjQUFoQixFQUFnQyw4QkFBYUYsQ0FBQyxDQUFDVSxVQUFGLEdBQWU1QiwwQkFBNUIsQ0FBaEMsQ0FBdk0sQ0FBZDs7QUFDQSxRQUFJLEtBQUtZLGFBQVQsRUFBd0I7QUFDcEJZLHVCQUFLTyxhQUFMLENBQW1CUixLQUFuQixFQUEwQkEsS0FBMUIsRUFBaUMsS0FBS1osUUFBdEM7QUFDSDs7QUFDRGEscUJBQUtRLFdBQUwsQ0FBaUJkLENBQUMsQ0FBQ2UsUUFBbkIsRUFBNkJmLENBQUMsQ0FBQ2UsUUFBL0IsRUFBeUNWLEtBQXpDLEVBQWdESixFQUFoRDtBQUNIOzs7b0ZBckVBZTs7Ozs7V0FDUTs7Ozs7OztXQVVENUIsWUFBTTZCOzs7Ozs7O1dBV1YsSUFBSTVCLHNCQUFKOzs7Ozs7O1dBV0EsSUFBSUEsc0JBQUo7Ozs7Ozs7V0FZQSxJQUFJQSxzQkFBSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNjY2xhc3MsIHByb3BlcnR5IH0gZnJvbSAnLi4vLi4vLi4vcGxhdGZvcm0vQ0NDbGFzc0RlY29yYXRvcic7XG5pbXBvcnQgeyBwc2V1ZG9SYW5kb20sIFF1YXQsIFZlYzMgfSBmcm9tICcuLi8uLi8uLi92YWx1ZS10eXBlcyc7XG5pbXBvcnQgeyBTcGFjZSB9IGZyb20gJy4uL2VudW0nO1xuaW1wb3J0IHsgY2FsY3VsYXRlVHJhbnNmb3JtIH0gZnJvbSAnLi4vcGFydGljbGUtZ2VuZXJhbC1mdW5jdGlvbic7XG5pbXBvcnQgQ3VydmVSYW5nZSBmcm9tICcuL2N1cnZlLXJhbmdlJztcblxuLy8gdHNsaW50OmRpc2FibGU6IG1heC1saW5lLWxlbmd0aFxuY29uc3QgRk9SQ0VfT1ZFUlRJTUVfUkFORF9PRkZTRVQgPSAyMTIxNjU7XG5cbmNvbnN0IF90ZW1wX3YzID0gY2MudjMoKTtcblxuQGNjY2xhc3MoJ2NjLkZvcmNlT3ZlcnRpbWVNb2R1bGUnKVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRm9yY2VPdmVydGltZU1vZHVsZSB7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBlbmFibGUgb2YgQ29sb3JPdmVydGltZU1vZHVsZS5cbiAgICAgKiAhI3poIOaYr+WQpuWQr+eUqFxuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZW5hYmxlXG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgZW5hYmxlID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENvb3JkaW5hdGUgc3lzdGVtIHVzZWQgaW4gYWNjZWxlcmF0aW9uIGNhbGN1bGF0aW9uLlxuICAgICAqICEjemgg5Yqg6YCf5bqm6K6h566X5pe26YeH55So55qE5Z2Q5qCH57O744CCXG4gICAgICogQHByb3BlcnR5IHtTcGFjZX0gc3BhY2VcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBTcGFjZSxcbiAgICB9KVxuICAgIHNwYWNlID0gU3BhY2UuTG9jYWw7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFgtYXhpcyBhY2NlbGVyYXRpb24gY29tcG9uZW50LlxuICAgICAqICEjemggWCDovbTmlrnlkJHkuIrnmoTliqDpgJ/luqbliIbph4/jgIJcbiAgICAgKiBAcHJvcGVydHkge0N1cnZlUmFuZ2V9IHhcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBDdXJ2ZVJhbmdlLFxuICAgICAgICByYW5nZTogWy0xLCAxXSxcbiAgICB9KVxuICAgIHggPSBuZXcgQ3VydmVSYW5nZSgpO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBZLWF4aXMgYWNjZWxlcmF0aW9uIGNvbXBvbmVudC5cbiAgICAgKiAhI3poIFkg6L205pa55ZCR5LiK55qE5Yqg6YCf5bqm5YiG6YeP44CCXG4gICAgICogQHByb3BlcnR5IHtDdXJ2ZVJhbmdlfSB5XG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogQ3VydmVSYW5nZSxcbiAgICAgICAgcmFuZ2U6IFstMSwgMV0sXG4gICAgfSlcbiAgICB5ID0gbmV3IEN1cnZlUmFuZ2UoKTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gWi1heGlzIGFjY2VsZXJhdGlvbiBjb21wb25lbnQuXG4gICAgICogISN6aCBaIOi9tOaWueWQkeS4iueahOWKoOmAn+W6puWIhumHj+OAglxuICAgICAqIEBwcm9wZXJ0eSB7Q3VydmVSYW5nZX0gelxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IEN1cnZlUmFuZ2UsXG4gICAgICAgIHJhbmdlOiBbLTEsIDFdLFxuICAgICAgICBkaXNwbGF5T3JkZXI6IDQsXG4gICAgfSlcbiAgICB6ID0gbmV3IEN1cnZlUmFuZ2UoKTtcblxuICAgIC8vIFRPRE86Y3VycmVudGx5IG5vdCBzdXBwb3J0ZWRcbiAgICByYW5kb21pemVkID0gZmFsc2U7XG5cbiAgICByb3RhdGlvbiA9IG51bGw7XG4gICAgbmVlZFRyYW5zZm9ybSA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICB0aGlzLnJvdGF0aW9uID0gbmV3IFF1YXQoKTtcbiAgICAgICAgdGhpcy5uZWVkVHJhbnNmb3JtID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdXBkYXRlIChzcGFjZSwgd29ybGRUcmFuc2Zvcm0pIHtcbiAgICAgICAgdGhpcy5uZWVkVHJhbnNmb3JtID0gY2FsY3VsYXRlVHJhbnNmb3JtKHNwYWNlLCB0aGlzLnNwYWNlLCB3b3JsZFRyYW5zZm9ybSwgdGhpcy5yb3RhdGlvbik7XG4gICAgfVxuXG4gICAgYW5pbWF0ZSAocCwgZHQpIHtcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZFRpbWUgPSAxIC0gcC5yZW1haW5pbmdMaWZldGltZSAvIHAuc3RhcnRMaWZldGltZTtcbiAgICAgICAgY29uc3QgZm9yY2UgPSBWZWMzLnNldChfdGVtcF92MywgdGhpcy54LmV2YWx1YXRlKG5vcm1hbGl6ZWRUaW1lLCBwc2V1ZG9SYW5kb20ocC5yYW5kb21TZWVkICsgRk9SQ0VfT1ZFUlRJTUVfUkFORF9PRkZTRVQpKSwgdGhpcy55LmV2YWx1YXRlKG5vcm1hbGl6ZWRUaW1lLCBwc2V1ZG9SYW5kb20ocC5yYW5kb21TZWVkICsgRk9SQ0VfT1ZFUlRJTUVfUkFORF9PRkZTRVQpKSwgdGhpcy56LmV2YWx1YXRlKG5vcm1hbGl6ZWRUaW1lLCBwc2V1ZG9SYW5kb20ocC5yYW5kb21TZWVkICsgRk9SQ0VfT1ZFUlRJTUVfUkFORF9PRkZTRVQpKSk7XG4gICAgICAgIGlmICh0aGlzLm5lZWRUcmFuc2Zvcm0pIHtcbiAgICAgICAgICAgIFZlYzMudHJhbnNmb3JtUXVhdChmb3JjZSwgZm9yY2UsIHRoaXMucm90YXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIFZlYzMuc2NhbGVBbmRBZGQocC52ZWxvY2l0eSwgcC52ZWxvY2l0eSwgZm9yY2UsIGR0KTtcbiAgICB9XG59XG5cbiJdfQ==