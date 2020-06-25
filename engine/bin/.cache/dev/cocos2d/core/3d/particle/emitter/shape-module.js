
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/particle/emitter/shape-module.js';
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

var _curveRange = _interopRequireDefault(require("../animator/curve-range"));

var _particleGeneralFunction = require("../particle-general-function");

var _enum = require("../enum");

var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

// tslint:disable: max-line-length
var _intermediVec = new _valueTypes.Vec3(0, 0, 0);

var _intermediArr = new Array();

var _unitBoxExtent = new _valueTypes.Vec3(0.5, 0.5, 0.5);

var ShapeModule = (_dec = (0, _CCClassDecorator.ccclass)('cc.ShapeModule'), _dec2 = (0, _CCClassDecorator.property)({
  type: _enum.ShapeType
}), _dec3 = (0, _CCClassDecorator.property)({
  type: _enum.EmitLocation
}), _dec4 = (0, _CCClassDecorator.property)({
  type: _enum.ArcMode
}), _dec5 = (0, _CCClassDecorator.property)({
  type: _curveRange["default"]
}), _dec(_class = (_class2 = (_temp =
/*#__PURE__*/
function () {
  _createClass(ShapeModule, [{
    key: "shapeType",

    /**
     * !#en The enable of shapeModule.
     * !#zh 是否启用
     * @property {Boolean} enable
     */

    /**
     * !#en Particle emitter type.
     * !#zh 粒子发射器类型。
     * @property {ShapeType} shapeType
     */
    get: function get() {
      return this._shapeType;
    },
    set: function set(val) {
      this._shapeType = val;

      switch (this._shapeType) {
        case _enum.ShapeType.Box:
          if (this.emitFrom === _enum.EmitLocation.Base) {
            this.emitFrom = _enum.EmitLocation.Volume;
          }

          break;

        case _enum.ShapeType.Cone:
          if (this.emitFrom === _enum.EmitLocation.Edge) {
            this.emitFrom = _enum.EmitLocation.Base;
          }

          break;

        case _enum.ShapeType.Sphere:
        case _enum.ShapeType.Hemisphere:
          if (this.emitFrom === _enum.EmitLocation.Base || this.emitFrom === _enum.EmitLocation.Edge) {
            this.emitFrom = _enum.EmitLocation.Volume;
          }

          break;
      }
    }
    /**
     * !#en The emission site of the particle.
     * !#zh 粒子从发射器哪个部位发射。
     * @property {EmitLocation} emitFrom
     */

  }, {
    key: "angle",

    /**
     * !#en The angle between the axis of the cone and the generatrix<bg>
     * Determines the opening and closing of the cone launcher
     * !#zh 圆锥的轴与母线的夹角<bg>。
     * 决定圆锥发射器的开合程度。
     * @property {Number} angle
     */
    get: function get() {
      return Math.round((0, _valueTypes.toDegree)(this._angle) * 100) / 100;
    },
    set: function set(val) {
      this._angle = (0, _valueTypes.toRadian)(val);
    }
  }, {
    key: "arc",

    /**
     * !#en Particle emitters emit in a fan-shaped range.
     * !#zh 粒子发射器在一个扇形范围内发射。
     * @property {Number} arc
     */
    get: function get() {
      return (0, _valueTypes.toDegree)(this._arc);
    },
    set: function set(val) {
      this._arc = (0, _valueTypes.toRadian)(val);
    }
    /**
     * !#en How particles are emitted in the sector range.
     * !#zh 粒子在扇形范围内的发射方式。
     * @property {ArcMode} arcMode
     */

  }, {
    key: "position",

    /**
     * !#en Particle Emitter Position
     * !#zh 粒子发射器位置。
     * @property {Vec3} position
     */
    get: function get() {
      return this._position;
    },
    set: function set(val) {
      this._position = val;
      this.constructMat();
    }
  }, {
    key: "rotation",

    /**
     * !#en Particle emitter rotation angle.
     * !#zh 粒子发射器旋转角度。
     * @property {Vec3} rotation
     */
    get: function get() {
      return this._rotation;
    },
    set: function set(val) {
      this._rotation = val;
      this.constructMat();
    }
  }, {
    key: "scale",

    /**
     * !#en Particle emitter scaling
     * !#zh 粒子发射器缩放比例。
     * @property {Vec3} scale
     */
    get: function get() {
      return this._scale;
    },
    set: function set(val) {
      this._scale = val;
      this.constructMat();
    }
    /**
     * !#en The direction of particle movement is determined based on the initial direction of the particles.
     * !#zh 根据粒子的初始方向决定粒子的移动方向。
     * @property {Boolean} alignToDirection
     */

  }]);

  function ShapeModule() {
    _initializerDefineProperty(this, "enable", _descriptor, this);

    _initializerDefineProperty(this, "_shapeType", _descriptor2, this);

    _initializerDefineProperty(this, "emitFrom", _descriptor3, this);

    _initializerDefineProperty(this, "radius", _descriptor4, this);

    _initializerDefineProperty(this, "radiusThickness", _descriptor5, this);

    _initializerDefineProperty(this, "_angle", _descriptor6, this);

    _initializerDefineProperty(this, "_arc", _descriptor7, this);

    _initializerDefineProperty(this, "arcMode", _descriptor8, this);

    _initializerDefineProperty(this, "arcSpread", _descriptor9, this);

    _initializerDefineProperty(this, "arcSpeed", _descriptor10, this);

    _initializerDefineProperty(this, "length", _descriptor11, this);

    _initializerDefineProperty(this, "boxThickness", _descriptor12, this);

    _initializerDefineProperty(this, "_position", _descriptor13, this);

    _initializerDefineProperty(this, "_rotation", _descriptor14, this);

    _initializerDefineProperty(this, "_scale", _descriptor15, this);

    _initializerDefineProperty(this, "alignToDirection", _descriptor16, this);

    _initializerDefineProperty(this, "randomDirectionAmount", _descriptor17, this);

    _initializerDefineProperty(this, "sphericalDirectionAmount", _descriptor18, this);

    _initializerDefineProperty(this, "randomPositionAmount", _descriptor19, this);

    this.mat = null;
    this.Quat = null;
    this.particleSystem = null;
    this.lastTime = null;
    this.totalAngle = null;
    this.mat = new _valueTypes.Mat4();
    this.quat = new _valueTypes.Quat();
    this.particleSystem = null;
    this.lastTime = 0;
    this.totalAngle = 0;
  }

  var _proto = ShapeModule.prototype;

  _proto.onInit = function onInit(ps) {
    this.particleSystem = ps;
    this.constructMat();
    this.lastTime = this.particleSystem._time;
  };

  _proto.constructMat = function constructMat() {
    _valueTypes.Quat.fromEuler(this.quat, this._rotation.x, this._rotation.y, this._rotation.z);

    _valueTypes.Mat4.fromRTS(this.mat, this.quat, this._position, this._scale);
  };

  _proto.emit = function emit(p) {
    switch (this.shapeType) {
      case _enum.ShapeType.Box:
        boxEmit(this.emitFrom, this.boxThickness, p.position, p.velocity);
        break;

      case _enum.ShapeType.Circle:
        circleEmit(this.radius, this.radiusThickness, this.generateArcAngle(), p.position, p.velocity);
        break;

      case _enum.ShapeType.Cone:
        coneEmit(this.emitFrom, this.radius, this.radiusThickness, this.generateArcAngle(), this._angle, this.length, p.position, p.velocity);
        break;

      case _enum.ShapeType.Sphere:
        sphereEmit(this.emitFrom, this.radius, this.radiusThickness, p.position, p.velocity);
        break;

      case _enum.ShapeType.Hemisphere:
        hemisphereEmit(this.emitFrom, this.radius, this.radiusThickness, p.position, p.velocity);
        break;

      default:
        console.warn(this.shapeType + ' shapeType is not supported by ShapeModule.');
    }

    if (this.randomPositionAmount > 0) {
      p.position.x += (0, _valueTypes.randomRange)(-this.randomPositionAmount, this.randomPositionAmount);
      p.position.y += (0, _valueTypes.randomRange)(-this.randomPositionAmount, this.randomPositionAmount);
      p.position.z += (0, _valueTypes.randomRange)(-this.randomPositionAmount, this.randomPositionAmount);
    }

    _valueTypes.Vec3.transformQuat(p.velocity, p.velocity, this.quat);

    _valueTypes.Vec3.transformMat4(p.position, p.position, this.mat);

    if (this.sphericalDirectionAmount > 0) {
      var sphericalVel = _valueTypes.Vec3.normalize(_intermediVec, p.position);

      _valueTypes.Vec3.lerp(p.velocity, p.velocity, sphericalVel, this.sphericalDirectionAmount);
    }

    this.lastTime = this.particleSystem._time;
  };

  _proto.generateArcAngle = function generateArcAngle() {
    if (this.arcMode === _enum.ArcMode.Random) {
      return (0, _valueTypes.randomRange)(0, this._arc);
    }

    var angle = this.totalAngle + 2 * Math.PI * this.arcSpeed.evaluate(this.particleSystem._time, 1) * (this.particleSystem._time - this.lastTime);
    this.totalAngle = angle;

    if (this.arcSpread !== 0) {
      angle = Math.floor(angle / (this._arc * this.arcSpread)) * this._arc * this.arcSpread;
    }

    switch (this.arcMode) {
      case _enum.ArcMode.Loop:
        return (0, _valueTypes.repeat)(angle, this._arc);

      case _enum.ArcMode.PingPong:
        return (0, _valueTypes.pingPong)(angle, this._arc);
    }
  };

  return ShapeModule;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "enable", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_shapeType", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return _enum.ShapeType.Cone;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "shapeType", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "shapeType"), _class2.prototype), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "emitFrom", [_dec3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return _enum.EmitLocation.Volume;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "radius", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "radiusThickness", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_angle", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return (0, _valueTypes.toRadian)(25);
  }
}), _applyDecoratedDescriptor(_class2.prototype, "angle", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "angle"), _class2.prototype), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "_arc", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return (0, _valueTypes.toRadian)(360);
  }
}), _applyDecoratedDescriptor(_class2.prototype, "arc", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "arc"), _class2.prototype), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "arcMode", [_dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return _enum.ArcMode.Random;
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "arcSpread", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "arcSpeed", [_dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "length", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 5;
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "boxThickness", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _valueTypes.Vec3(0, 0, 0);
  }
}), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "_position", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _valueTypes.Vec3(0, 0, 0);
  }
}), _applyDecoratedDescriptor(_class2.prototype, "position", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "position"), _class2.prototype), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "_rotation", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _valueTypes.Vec3(0, 0, 0);
  }
}), _applyDecoratedDescriptor(_class2.prototype, "rotation", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "rotation"), _class2.prototype), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "_scale", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _valueTypes.Vec3(1, 1, 1);
  }
}), _applyDecoratedDescriptor(_class2.prototype, "scale", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "scale"), _class2.prototype), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "alignToDirection", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "randomDirectionAmount", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "sphericalDirectionAmount", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "randomPositionAmount", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
})), _class2)) || _class);
exports["default"] = ShapeModule;

function sphereEmit(emitFrom, radius, radiusThickness, pos, dir) {
  switch (emitFrom) {
    case _enum.EmitLocation.Volume:
      (0, _particleGeneralFunction.randomPointBetweenSphere)(pos, radius * (1 - radiusThickness), radius);

      _valueTypes.Vec3.copy(dir, pos);

      _valueTypes.Vec3.normalize(dir, dir);

      break;

    case _enum.EmitLocation.Shell:
      (0, _particleGeneralFunction.randomUnitVector)(pos);

      _valueTypes.Vec3.scale(pos, pos, radius);

      _valueTypes.Vec3.copy(dir, pos);

      break;

    default:
      console.warn(emitFrom + ' is not supported for sphere emitter.');
  }
}

function hemisphereEmit(emitFrom, radius, radiusThickness, pos, dir) {
  switch (emitFrom) {
    case _enum.EmitLocation.Volume:
      (0, _particleGeneralFunction.randomPointBetweenSphere)(pos, radius * (1 - radiusThickness), radius);

      if (pos.z > 0) {
        pos.z *= -1;
      }

      _valueTypes.Vec3.copy(dir, pos);

      _valueTypes.Vec3.normalize(dir, dir);

      break;

    case _enum.EmitLocation.Shell:
      (0, _particleGeneralFunction.randomUnitVector)(pos);

      _valueTypes.Vec3.scale(pos, pos, radius);

      if (pos.z < 0) {
        pos.z *= -1;
      }

      _valueTypes.Vec3.copy(dir, pos);

      break;

    default:
      console.warn(emitFrom + ' is not supported for hemisphere emitter.');
  }
}

function coneEmit(emitFrom, radius, radiusThickness, theta, angle, length, pos, dir) {
  switch (emitFrom) {
    case _enum.EmitLocation.Base:
      (0, _particleGeneralFunction.randomPointBetweenCircleAtFixedAngle)(pos, radius * (1 - radiusThickness), radius, theta);

      _valueTypes.Vec2.scale(dir, pos, Math.sin(angle));

      dir.z = -Math.cos(angle) * radius;

      _valueTypes.Vec3.normalize(dir, dir);

      pos.z = 0;
      break;

    case _enum.EmitLocation.Shell:
      (0, _particleGeneralFunction.fixedAngleUnitVector2)(pos, theta);

      _valueTypes.Vec2.scale(dir, pos, Math.sin(angle));

      dir.z = -Math.cos(angle);

      _valueTypes.Vec3.normalize(dir, dir);

      _valueTypes.Vec2.scale(pos, pos, radius);

      pos.z = 0;
      break;

    case _enum.EmitLocation.Volume:
      (0, _particleGeneralFunction.randomPointBetweenCircleAtFixedAngle)(pos, radius * (1 - radiusThickness), radius, theta);

      _valueTypes.Vec2.scale(dir, pos, Math.sin(angle));

      dir.z = -Math.cos(angle) * radius;

      _valueTypes.Vec3.normalize(dir, dir);

      pos.z = 0;

      _valueTypes.Vec3.add(pos, pos, _valueTypes.Vec3.scale(_intermediVec, dir, length * (0, _valueTypes.random)() / -dir.z));

      break;

    default:
      console.warn(emitFrom + ' is not supported for cone emitter.');
  }
}

function boxEmit(emitFrom, boxThickness, pos, dir) {
  switch (emitFrom) {
    case _enum.EmitLocation.Volume:
      (0, _particleGeneralFunction.randomPointInCube)(pos, _unitBoxExtent); // randomPointBetweenCube(pos, Vec3.multiply(_intermediVec, _unitBoxExtent, boxThickness), _unitBoxExtent);

      break;

    case _enum.EmitLocation.Shell:
      _intermediArr.splice(0, _intermediArr.length);

      _intermediArr.push((0, _valueTypes.randomRange)(-0.5, 0.5));

      _intermediArr.push((0, _valueTypes.randomRange)(-0.5, 0.5));

      _intermediArr.push((0, _particleGeneralFunction.randomSign)() * 0.5);

      (0, _particleGeneralFunction.randomSortArray)(_intermediArr);
      applyBoxThickness(_intermediArr, boxThickness);

      _valueTypes.Vec3.set(pos, _intermediArr[0], _intermediArr[1], _intermediArr[2]);

      break;

    case _enum.EmitLocation.Edge:
      _intermediArr.splice(0, _intermediArr.length);

      _intermediArr.push((0, _valueTypes.randomRange)(-0.5, 0.5));

      _intermediArr.push((0, _particleGeneralFunction.randomSign)() * 0.5);

      _intermediArr.push((0, _particleGeneralFunction.randomSign)() * 0.5);

      (0, _particleGeneralFunction.randomSortArray)(_intermediArr);
      applyBoxThickness(_intermediArr, boxThickness);

      _valueTypes.Vec3.set(pos, _intermediArr[0], _intermediArr[1], _intermediArr[2]);

      break;

    default:
      console.warn(emitFrom + ' is not supported for box emitter.');
  }

  _valueTypes.Vec3.copy(dir, _particleGeneralFunction.particleEmitZAxis);
}

function circleEmit(radius, radiusThickness, theta, pos, dir) {
  (0, _particleGeneralFunction.randomPointBetweenCircleAtFixedAngle)(pos, radius * (1 - radiusThickness), radius, theta);

  _valueTypes.Vec3.normalize(dir, pos);
}

function applyBoxThickness(pos, thickness) {
  if (thickness.x > 0) {
    pos[0] += 0.5 * (0, _valueTypes.randomRange)(-thickness.x, thickness.x);
    pos[0] = (0, _valueTypes.clamp)(pos[0], -0.5, 0.5);
  }

  if (thickness.y > 0) {
    pos[1] += 0.5 * (0, _valueTypes.randomRange)(-thickness.y, thickness.y);
    pos[1] = (0, _valueTypes.clamp)(pos[1], -0.5, 0.5);
  }

  if (thickness.z > 0) {
    pos[2] += 0.5 * (0, _valueTypes.randomRange)(-thickness.z, thickness.z);
    pos[2] = (0, _valueTypes.clamp)(pos[2], -0.5, 0.5);
  }
}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNoYXBlLW1vZHVsZS50cyJdLCJuYW1lcyI6WyJfaW50ZXJtZWRpVmVjIiwiVmVjMyIsIl9pbnRlcm1lZGlBcnIiLCJBcnJheSIsIl91bml0Qm94RXh0ZW50IiwiU2hhcGVNb2R1bGUiLCJ0eXBlIiwiU2hhcGVUeXBlIiwiRW1pdExvY2F0aW9uIiwiQXJjTW9kZSIsIkN1cnZlUmFuZ2UiLCJfc2hhcGVUeXBlIiwidmFsIiwiQm94IiwiZW1pdEZyb20iLCJCYXNlIiwiVm9sdW1lIiwiQ29uZSIsIkVkZ2UiLCJTcGhlcmUiLCJIZW1pc3BoZXJlIiwiTWF0aCIsInJvdW5kIiwiX2FuZ2xlIiwiX2FyYyIsIl9wb3NpdGlvbiIsImNvbnN0cnVjdE1hdCIsIl9yb3RhdGlvbiIsIl9zY2FsZSIsIm1hdCIsIlF1YXQiLCJwYXJ0aWNsZVN5c3RlbSIsImxhc3RUaW1lIiwidG90YWxBbmdsZSIsIk1hdDQiLCJxdWF0Iiwib25Jbml0IiwicHMiLCJfdGltZSIsImZyb21FdWxlciIsIngiLCJ5IiwieiIsImZyb21SVFMiLCJlbWl0IiwicCIsInNoYXBlVHlwZSIsImJveEVtaXQiLCJib3hUaGlja25lc3MiLCJwb3NpdGlvbiIsInZlbG9jaXR5IiwiQ2lyY2xlIiwiY2lyY2xlRW1pdCIsInJhZGl1cyIsInJhZGl1c1RoaWNrbmVzcyIsImdlbmVyYXRlQXJjQW5nbGUiLCJjb25lRW1pdCIsImxlbmd0aCIsInNwaGVyZUVtaXQiLCJoZW1pc3BoZXJlRW1pdCIsImNvbnNvbGUiLCJ3YXJuIiwicmFuZG9tUG9zaXRpb25BbW91bnQiLCJ0cmFuc2Zvcm1RdWF0IiwidHJhbnNmb3JtTWF0NCIsInNwaGVyaWNhbERpcmVjdGlvbkFtb3VudCIsInNwaGVyaWNhbFZlbCIsIm5vcm1hbGl6ZSIsImxlcnAiLCJhcmNNb2RlIiwiUmFuZG9tIiwiYW5nbGUiLCJQSSIsImFyY1NwZWVkIiwiZXZhbHVhdGUiLCJhcmNTcHJlYWQiLCJmbG9vciIsIkxvb3AiLCJQaW5nUG9uZyIsInByb3BlcnR5IiwicG9zIiwiZGlyIiwiY29weSIsIlNoZWxsIiwic2NhbGUiLCJ0aGV0YSIsIlZlYzIiLCJzaW4iLCJjb3MiLCJhZGQiLCJzcGxpY2UiLCJwdXNoIiwiYXBwbHlCb3hUaGlja25lc3MiLCJzZXQiLCJwYXJ0aWNsZUVtaXRaQXhpcyIsInRoaWNrbmVzcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7QUFDQSxJQUFNQSxhQUFhLEdBQUcsSUFBSUMsZ0JBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQ0FBdEI7O0FBQ0EsSUFBTUMsYUFBYSxHQUFHLElBQUlDLEtBQUosRUFBdEI7O0FBQ0EsSUFBTUMsY0FBYyxHQUFHLElBQUlILGdCQUFKLENBQVMsR0FBVCxFQUFjLEdBQWQsRUFBbUIsR0FBbkIsQ0FBdkI7O0lBR3FCSSxzQkFEcEIsK0JBQVEsZ0JBQVIsV0FtQkksZ0NBQVM7QUFDTkMsRUFBQUEsSUFBSSxFQUFFQztBQURBLENBQVQsV0FrQ0EsZ0NBQVM7QUFDTkQsRUFBQUEsSUFBSSxFQUFFRTtBQURBLENBQVQsV0FvRUEsZ0NBQVM7QUFDTkYsRUFBQUEsSUFBSSxFQUFFRztBQURBLENBQVQsV0FrQkEsZ0NBQVM7QUFDTkgsRUFBQUEsSUFBSSxFQUFFSTtBQURBLENBQVQ7Ozs7OztBQXhJRDs7Ozs7O0FBV0E7Ozs7O3dCQVF3QjtBQUNwQixhQUFPLEtBQUtDLFVBQVo7QUFDSDtzQkFFcUJDLEtBQUs7QUFDdkIsV0FBS0QsVUFBTCxHQUFrQkMsR0FBbEI7O0FBQ0EsY0FBUSxLQUFLRCxVQUFiO0FBQ0ksYUFBS0osZ0JBQVVNLEdBQWY7QUFDSSxjQUFJLEtBQUtDLFFBQUwsS0FBa0JOLG1CQUFhTyxJQUFuQyxFQUF5QztBQUNyQyxpQkFBS0QsUUFBTCxHQUFnQk4sbUJBQWFRLE1BQTdCO0FBQ0g7O0FBQ0Q7O0FBQ0osYUFBS1QsZ0JBQVVVLElBQWY7QUFDSSxjQUFJLEtBQUtILFFBQUwsS0FB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QUFDZSxTQUFTLENBQUN2RCxDQUF2QixFQUEwQnVELFNBQVMsQ0FBQ3ZELENBQXBDLENBQWhCO0FBQ0F3QyxJQUFBQSxHQUFHLENBQUMsQ0FBRCxDQUFILEdBQVMsdUJBQU1BLEdBQUcsQ0FBQyxDQUFELENBQVQsRUFBYyxDQUFDLEdBQWYsRUFBb0IsR0FBcEIsQ0FBVDtBQUNIOztBQUNELE1BQUllLFNBQVMsQ0FBQ3RELENBQVYsR0FBYyxDQUFsQixFQUFxQjtBQUNqQnVDLElBQUFBLEdBQUcsQ0FBQyxDQUFELENBQUgsSUFBVSxNQUFNLDZCQUFZLENBQUNlLFNBQVMsQ0FBQ3RELENBQXZCLEVBQTBCc0QsU0FBUyxDQUFDdEQsQ0FBcEMsQ0FBaEI7QUFDQXVDLElBQUFBLEdBQUcsQ0FBQyxDQUFELENBQUgsR0FBUyx1QkFBTUEsR0FBRyxDQUFDLENBQUQsQ0FBVCxFQUFjLENBQUMsR0FBZixFQUFvQixHQUFwQixDQUFUO0FBQ0g7O0FBQ0QsTUFBSWUsU0FBUyxDQUFDckQsQ0FBVixHQUFjLENBQWxCLEVBQXFCO0FBQ2pCc0MsSUFBQUEsR0FBRyxDQUFDLENBQUQsQ0FBSCxJQUFVLE1BQU0sNkJBQVksQ0FBQ2UsU0FBUyxDQUFDckQsQ0FBdkIsRUFBMEJxRCxTQUFTLENBQUNyRCxDQUFwQyxDQUFoQjtBQUNBc0MsSUFBQUEsR0FBRyxDQUFDLENBQUQsQ0FBSCxHQUFTLHVCQUFNQSxHQUFHLENBQUMsQ0FBRCxDQUFULEVBQWMsQ0FBQyxHQUFmLEVBQW9CLEdBQXBCLENBQVQ7QUFDSDtBQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2NjbGFzcywgcHJvcGVydHkgfSBmcm9tICcuLi8uLi8uLi9wbGF0Zm9ybS9DQ0NsYXNzRGVjb3JhdG9yJztcbmltcG9ydCB7IGNsYW1wLCBNYXQ0LCBwaW5nUG9uZywgUXVhdCwgcmFuZG9tLCByYW5kb21SYW5nZSwgcmVwZWF0LCB0b0RlZ3JlZSwgdG9SYWRpYW4sIFZlYzIsIFZlYzMgfSBmcm9tICcuLi8uLi8uLi92YWx1ZS10eXBlcyc7XG5pbXBvcnQgQ3VydmVSYW5nZSBmcm9tICcuLi9hbmltYXRvci9jdXJ2ZS1yYW5nZSc7XG5pbXBvcnQgeyBmaXhlZEFuZ2xlVW5pdFZlY3RvcjIsIHBhcnRpY2xlRW1pdFpBeGlzLCByYW5kb21Qb2ludEJldHdlZW5DaXJjbGVBdEZpeGVkQW5nbGUsIHJhbmRvbVBvaW50QmV0d2VlblNwaGVyZSwgcmFuZG9tUG9pbnRJbkN1YmUsIHJhbmRvbVNpZ24sIHJhbmRvbVNvcnRBcnJheSwgcmFuZG9tVW5pdFZlY3RvciB9IGZyb20gJy4uL3BhcnRpY2xlLWdlbmVyYWwtZnVuY3Rpb24nO1xuaW1wb3J0IHsgU2hhcGVUeXBlLCBFbWl0TG9jYXRpb24sIEFyY01vZGUgfSBmcm9tICcuLi9lbnVtJztcblxuLy8gdHNsaW50OmRpc2FibGU6IG1heC1saW5lLWxlbmd0aFxuY29uc3QgX2ludGVybWVkaVZlYyA9IG5ldyBWZWMzKDAsIDAsIDApO1xuY29uc3QgX2ludGVybWVkaUFyciA9IG5ldyBBcnJheSgpO1xuY29uc3QgX3VuaXRCb3hFeHRlbnQgPSBuZXcgVmVjMygwLjUsIDAuNSwgMC41KTtcblxuQGNjY2xhc3MoJ2NjLlNoYXBlTW9kdWxlJylcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoYXBlTW9kdWxlIHtcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGVuYWJsZSBvZiBzaGFwZU1vZHVsZS5cbiAgICAgKiAhI3poIOaYr+WQpuWQr+eUqFxuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZW5hYmxlXG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgZW5hYmxlID0gZmFsc2U7XG5cbiAgICBAcHJvcGVydHlcbiAgICBfc2hhcGVUeXBlID0gU2hhcGVUeXBlLkNvbmU7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFBhcnRpY2xlIGVtaXR0ZXIgdHlwZS5cbiAgICAgKiAhI3poIOeykuWtkOWPkeWwhOWZqOexu+Wei+OAglxuICAgICAqIEBwcm9wZXJ0eSB7U2hhcGVUeXBlfSBzaGFwZVR5cGVcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBTaGFwZVR5cGUsXG4gICAgfSlcbiAgICBwdWJsaWMgZ2V0IHNoYXBlVHlwZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFwZVR5cGU7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBzaGFwZVR5cGUgKHZhbCkge1xuICAgICAgICB0aGlzLl9zaGFwZVR5cGUgPSB2YWw7XG4gICAgICAgIHN3aXRjaCAodGhpcy5fc2hhcGVUeXBlKSB7XG4gICAgICAgICAgICBjYXNlIFNoYXBlVHlwZS5Cb3g6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZW1pdEZyb20gPT09IEVtaXRMb2NhdGlvbi5CYXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdEZyb20gPSBFbWl0TG9jYXRpb24uVm9sdW1lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgU2hhcGVUeXBlLkNvbmU6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZW1pdEZyb20gPT09IEVtaXRMb2NhdGlvbi5FZGdlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdEZyb20gPSBFbWl0TG9jYXRpb24uQmFzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFNoYXBlVHlwZS5TcGhlcmU6XG4gICAgICAgICAgICBjYXNlIFNoYXBlVHlwZS5IZW1pc3BoZXJlOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmVtaXRGcm9tID09PSBFbWl0TG9jYXRpb24uQmFzZSB8fCB0aGlzLmVtaXRGcm9tID09PSBFbWl0TG9jYXRpb24uRWRnZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXRGcm9tID0gRW1pdExvY2F0aW9uLlZvbHVtZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBlbWlzc2lvbiBzaXRlIG9mIHRoZSBwYXJ0aWNsZS5cbiAgICAgKiAhI3poIOeykuWtkOS7juWPkeWwhOWZqOWTquS4qumDqOS9jeWPkeWwhOOAglxuICAgICAqIEBwcm9wZXJ0eSB7RW1pdExvY2F0aW9ufSBlbWl0RnJvbVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IEVtaXRMb2NhdGlvbixcbiAgICB9KVxuICAgIGVtaXRGcm9tID0gRW1pdExvY2F0aW9uLlZvbHVtZTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gUGFydGljbGUgZW1pdHRlciByYWRpdXMuXG4gICAgICogISN6aCDnspLlrZDlj5HlsITlmajljYrlvoTjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gcmFkaXVzXG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgcmFkaXVzID0gMTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gUGFydGljbGUgZW1pdHRlciBlbWlzc2lvbiBwb3NpdGlvbiAobm90IHZhbGlkIGZvciBCb3ggdHlwZSBlbWl0dGVycynvvJo8Ymc+XG4gICAgICogLSAwIG1lYW5zIGVtaXR0ZWQgZnJvbSB0aGUgc3VyZmFjZTtcbsKgwqDCoMKgwqAqIC0gMSBtZWFucyBsYXVuY2ggZnJvbSB0aGUgY2VudGVyO1xuwqDCoMKgwqDCoCogLSAwIH4gMSBpbmRpY2F0ZXMgZW1pc3Npb24gZnJvbSB0aGUgY2VudGVyIHRvIHRoZSBzdXJmYWNlLlxuICAgICAqICEjemgg57KS5a2Q5Y+R5bCE5Zmo5Y+R5bCE5L2N572u77yI5a+5IEJveCDnsbvlnovnmoTlj5HlsITlmajml6DmlYjvvInvvJo8Ymc+XG4gICAgICogLSAwIOihqOekuuS7juihqOmdouWPkeWwhO+8m1xuICAgICAqIC0gMSDooajnpLrku47kuK3lv4Plj5HlsITvvJtcbiAgICAgKiAtIDAgfiAxIOS5i+mXtOihqOekuuWcqOS4reW/g+WIsOihqOmdouS5i+mXtOWPkeWwhOOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSByYWRpdXNUaGlja25lc3NcbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICByYWRpdXNUaGlja25lc3MgPSAxO1xuXG4gICAgQHByb3BlcnR5XG4gICAgX2FuZ2xlID0gdG9SYWRpYW4oMjUpO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgYW5nbGUgYmV0d2VlbiB0aGUgYXhpcyBvZiB0aGUgY29uZSBhbmQgdGhlIGdlbmVyYXRyaXg8Ymc+XG4gICAgICogRGV0ZXJtaW5lcyB0aGUgb3BlbmluZyBhbmQgY2xvc2luZyBvZiB0aGUgY29uZSBsYXVuY2hlclxuICAgICAqICEjemgg5ZyG6ZSl55qE6L205LiO5q+N57q/55qE5aS56KeSPGJnPuOAglxuICAgICAqIOWGs+WumuWchumUpeWPkeWwhOWZqOeahOW8gOWQiOeoi+W6puOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBhbmdsZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eVxuICAgIGdldCBhbmdsZSAoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKHRvRGVncmVlKHRoaXMuX2FuZ2xlKSAqIDEwMCkgLyAxMDA7XG4gICAgfVxuXG4gICAgc2V0IGFuZ2xlICh2YWwpIHtcbiAgICAgICAgdGhpcy5fYW5nbGUgPSB0b1JhZGlhbih2YWwpO1xuICAgIH1cblxuICAgIEBwcm9wZXJ0eVxuICAgIF9hcmMgPSB0b1JhZGlhbigzNjApO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBQYXJ0aWNsZSBlbWl0dGVycyBlbWl0IGluIGEgZmFuLXNoYXBlZCByYW5nZS5cbiAgICAgKiAhI3poIOeykuWtkOWPkeWwhOWZqOWcqOS4gOS4quaJh+W9ouiMg+WbtOWGheWPkeWwhOOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBhcmNcbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBnZXQgYXJjICgpIHtcbiAgICAgICAgcmV0dXJuIHRvRGVncmVlKHRoaXMuX2FyYyk7XG4gICAgfVxuXG4gICAgc2V0IGFyYyAodmFsKSB7XG4gICAgICAgIHRoaXMuX2FyYyA9IHRvUmFkaWFuKHZhbCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBIb3cgcGFydGljbGVzIGFyZSBlbWl0dGVkIGluIHRoZSBzZWN0b3IgcmFuZ2UuXG4gICAgICogISN6aCDnspLlrZDlnKjmiYflvaLojIPlm7TlhoXnmoTlj5HlsITmlrnlvI/jgIJcbiAgICAgKiBAcHJvcGVydHkge0FyY01vZGV9IGFyY01vZGVcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBBcmNNb2RlLFxuICAgIH0pXG4gICAgYXJjTW9kZSA9IEFyY01vZGUuUmFuZG9tO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBDb250cm9scyB0aGUgZGlzY3JldGUgaW50ZXJ2YWxzIGFyb3VuZCB0aGUgYXJjcyB3aGVyZSBwYXJ0aWNsZXMgbWlnaHQgYmUgZ2VuZXJhdGVkLlxuICAgICAqICEjemgg5o6n5Yi25Y+v6IO95Lqn55Sf57KS5a2Q55qE5byn5ZGo5Zu055qE56a75pWj6Ze06ZqU44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGFyY1NwcmVhZFxuICAgICAqL1xuICAgIEBwcm9wZXJ0eVxuICAgIGFyY1NwcmVhZCA9IDA7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBzcGVlZCBhdCB3aGljaCBwYXJ0aWNsZXMgYXJlIGVtaXR0ZWQgYXJvdW5kIHRoZSBjaXJjdW1mZXJlbmNlLlxuICAgICAqICEjemgg57KS5a2Q5rK/5ZyG5ZGo5Y+R5bCE55qE6YCf5bqm44CCXG4gICAgICogQHByb3BlcnR5IHtDdXJ2ZVJhbmdlfSBhcmNTcGVlZFxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IEN1cnZlUmFuZ2UsXG4gICAgfSlcbiAgICBhcmNTcGVlZCA9IG5ldyBDdXJ2ZVJhbmdlKCk7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEF4aXMgbGVuZ3RoIGZyb20gdG9wIG9mIGNvbmUgdG8gYm90dG9tIG9mIGNvbmUgPGJnPi5cbsKgwqDCoMKgwqAqIERldGVybWluZXMgdGhlIGhlaWdodCBvZiB0aGUgY29uZSBlbWl0dGVyLlxuICAgICAqICEjemgg5ZyG6ZSl6aG26YOo5oiq6Z2i6Led56a75bqV6YOo55qE6L206ZW/PGJnPuOAglxuICAgICAqIOWGs+WumuWchumUpeWPkeWwhOWZqOeahOmrmOW6puOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBsZW5ndGhcbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBsZW5ndGggPSA1O1xuXG4gICAgLyoqXG4gICAgICogISNlbiBQYXJ0aWNsZSBlbWl0dGVyIGVtaXNzaW9uIGxvY2F0aW9uIChmb3IgYm94LXR5cGUgcGFydGljbGUgZW1pdHRlcnMpLlxuICAgICAqICEjemgg57KS5a2Q5Y+R5bCE5Zmo5Y+R5bCE5L2N572u77yI6ZKI5a+5IEJveCDnsbvlnovnmoTnspLlrZDlj5HlsITlmajjgIJcbiAgICAgKiBAcHJvcGVydHkge1ZlYzN9IGJveFRoaWNrbmVzc1xuICAgICAqL1xuICAgIEBwcm9wZXJ0eVxuICAgIGJveFRoaWNrbmVzcyA9IG5ldyBWZWMzKDAsIDAsIDApO1xuXG4gICAgQHByb3BlcnR5XG4gICAgX3Bvc2l0aW9uID0gbmV3IFZlYzMoMCwgMCwgMCk7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFBhcnRpY2xlIEVtaXR0ZXIgUG9zaXRpb25cbiAgICAgKiAhI3poIOeykuWtkOWPkeWwhOWZqOS9jee9ruOAglxuICAgICAqIEBwcm9wZXJ0eSB7VmVjM30gcG9zaXRpb25cbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBnZXQgcG9zaXRpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcG9zaXRpb247XG4gICAgfVxuICAgIHNldCBwb3NpdGlvbiAodmFsKSB7XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uID0gdmFsO1xuICAgICAgICB0aGlzLmNvbnN0cnVjdE1hdCgpO1xuICAgIH1cblxuICAgIEBwcm9wZXJ0eVxuICAgIF9yb3RhdGlvbiA9IG5ldyBWZWMzKDAsIDAsIDApO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBQYXJ0aWNsZSBlbWl0dGVyIHJvdGF0aW9uIGFuZ2xlLlxuICAgICAqICEjemgg57KS5a2Q5Y+R5bCE5Zmo5peL6L2s6KeS5bqm44CCXG4gICAgICogQHByb3BlcnR5IHtWZWMzfSByb3RhdGlvblxuICAgICAqL1xuICAgIEBwcm9wZXJ0eVxuICAgIGdldCByb3RhdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yb3RhdGlvbjtcbiAgICB9XG4gICAgc2V0IHJvdGF0aW9uICh2YWwpIHtcbiAgICAgICAgdGhpcy5fcm90YXRpb24gPSB2YWw7XG4gICAgICAgIHRoaXMuY29uc3RydWN0TWF0KCk7XG4gICAgfVxuXG4gICAgQHByb3BlcnR5XG4gICAgX3NjYWxlID0gbmV3IFZlYzMoMSwgMSwgMSk7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFBhcnRpY2xlIGVtaXR0ZXIgc2NhbGluZ1xuICAgICAqICEjemgg57KS5a2Q5Y+R5bCE5Zmo57yp5pS+5q+U5L6L44CCXG4gICAgICogQHByb3BlcnR5IHtWZWMzfSBzY2FsZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eVxuICAgIGdldCBzY2FsZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zY2FsZTtcbiAgICB9XG4gICAgc2V0IHNjYWxlICh2YWwpIHtcbiAgICAgICAgdGhpcy5fc2NhbGUgPSB2YWw7XG4gICAgICAgIHRoaXMuY29uc3RydWN0TWF0KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZGlyZWN0aW9uIG9mIHBhcnRpY2xlIG1vdmVtZW50IGlzIGRldGVybWluZWQgYmFzZWQgb24gdGhlIGluaXRpYWwgZGlyZWN0aW9uIG9mIHRoZSBwYXJ0aWNsZXMuXG4gICAgICogISN6aCDmoLnmja7nspLlrZDnmoTliJ3lp4vmlrnlkJHlhrPlrprnspLlrZDnmoTnp7vliqjmlrnlkJHjgIJcbiAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGFsaWduVG9EaXJlY3Rpb25cbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBhbGlnblRvRGlyZWN0aW9uID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCBwYXJ0aWNsZSBnZW5lcmF0aW9uIGRpcmVjdGlvbiByYW5kb21seS5cbiAgICAgKiAhI3poIOeykuWtkOeUn+aIkOaWueWQkemaj+acuuiuvuWumuOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSByYW5kb21EaXJlY3Rpb25BbW91bnRcbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICByYW5kb21EaXJlY3Rpb25BbW91bnQgPSAwO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBJbnRlcnBvbGF0aW9uIGJldHdlZW4gdGhlIGN1cnJlbnQgZW1pc3Npb24gZGlyZWN0aW9uIGFuZCB0aGUgZGlyZWN0aW9uIGZyb20gdGhlIGN1cnJlbnQgcG9zaXRpb24gdG8gdGhlIGNlbnRlciBvZiB0aGUgbm9kZS5cbiAgICAgKiAhI3poIOihqOekuuW9k+WJjeWPkeWwhOaWueWQkeS4juW9k+WJjeS9jee9ruWIsOe7k+eCueS4reW/g+i/nue6v+aWueWQkeeahOaPkuWAvOOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBzcGhlcmljYWxEaXJlY3Rpb25BbW91bnRcbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBzcGhlcmljYWxEaXJlY3Rpb25BbW91bnQgPSAwO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgdGhlIHBhcnRpY2xlIGdlbmVyYXRpb24gcG9zaXRpb24gcmFuZG9tbHkgKHNldHRpbmcgdGhpcyB2YWx1ZSB0byBhIHZhbHVlIG90aGVyIHRoYW4gMCB3aWxsIGNhdXNlIHRoZSBwYXJ0aWNsZSBnZW5lcmF0aW9uIHBvc2l0aW9uIHRvIGV4Y2VlZCB0aGUgZ2VuZXJhdG9yIHNpemUgcmFuZ2UpXG4gICAgICogISN6aCDnspLlrZDnlJ/miJDkvY3nva7pmo/mnLrorr7lrprvvIjorr7lrprmraTlgLzkuLrpnZ4gMCDkvJrkvb/nspLlrZDnlJ/miJDkvY3nva7otoXlh7rnlJ/miJDlmajlpKflsI/ojIPlm7TvvInjgIJcbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICByYW5kb21Qb3NpdGlvbkFtb3VudCA9IDA7XG5cbiAgICBtYXQgPSBudWxsO1xuICAgIFF1YXQgPSBudWxsO1xuICAgIHBhcnRpY2xlU3lzdGVtID0gbnVsbDtcbiAgICBsYXN0VGltZSA9IG51bGw7XG4gICAgdG90YWxBbmdsZSA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHRoaXMubWF0ID0gbmV3IE1hdDQoKTtcbiAgICAgICAgdGhpcy5xdWF0ID0gbmV3IFF1YXQoKTtcbiAgICAgICAgdGhpcy5wYXJ0aWNsZVN5c3RlbSA9IG51bGw7XG4gICAgICAgIHRoaXMubGFzdFRpbWUgPSAwO1xuICAgICAgICB0aGlzLnRvdGFsQW5nbGUgPSAwO1xuICAgIH1cblxuICAgIG9uSW5pdCAocHMpIHtcbiAgICAgICAgdGhpcy5wYXJ0aWNsZVN5c3RlbSA9IHBzO1xuICAgICAgICB0aGlzLmNvbnN0cnVjdE1hdCgpO1xuICAgICAgICB0aGlzLmxhc3RUaW1lID0gdGhpcy5wYXJ0aWNsZVN5c3RlbS5fdGltZTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RNYXQgKCkge1xuICAgICAgICBRdWF0LmZyb21FdWxlcih0aGlzLnF1YXQsIHRoaXMuX3JvdGF0aW9uLngsIHRoaXMuX3JvdGF0aW9uLnksIHRoaXMuX3JvdGF0aW9uLnopO1xuICAgICAgICBNYXQ0LmZyb21SVFModGhpcy5tYXQsIHRoaXMucXVhdCwgdGhpcy5fcG9zaXRpb24sIHRoaXMuX3NjYWxlKTtcbiAgICB9XG5cbiAgICBlbWl0IChwKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5zaGFwZVR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgU2hhcGVUeXBlLkJveDpcbiAgICAgICAgICAgICAgICBib3hFbWl0KHRoaXMuZW1pdEZyb20sIHRoaXMuYm94VGhpY2tuZXNzLCBwLnBvc2l0aW9uLCBwLnZlbG9jaXR5KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgU2hhcGVUeXBlLkNpcmNsZTpcbiAgICAgICAgICAgICAgICBjaXJjbGVFbWl0KHRoaXMucmFkaXVzLCB0aGlzLnJhZGl1c1RoaWNrbmVzcywgdGhpcy5nZW5lcmF0ZUFyY0FuZ2xlKCksIHAucG9zaXRpb24sIHAudmVsb2NpdHkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBTaGFwZVR5cGUuQ29uZTpcbiAgICAgICAgICAgICAgICBjb25lRW1pdCh0aGlzLmVtaXRGcm9tLCB0aGlzLnJhZGl1cywgdGhpcy5yYWRpdXNUaGlja25lc3MsIHRoaXMuZ2VuZXJhdGVBcmNBbmdsZSgpLCB0aGlzLl9hbmdsZSwgdGhpcy5sZW5ndGgsIHAucG9zaXRpb24sIHAudmVsb2NpdHkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBTaGFwZVR5cGUuU3BoZXJlOlxuICAgICAgICAgICAgICAgIHNwaGVyZUVtaXQodGhpcy5lbWl0RnJvbSwgdGhpcy5yYWRpdXMsIHRoaXMucmFkaXVzVGhpY2tuZXNzLCBwLnBvc2l0aW9uLCBwLnZlbG9jaXR5KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgU2hhcGVUeXBlLkhlbWlzcGhlcmU6XG4gICAgICAgICAgICAgICAgaGVtaXNwaGVyZUVtaXQodGhpcy5lbWl0RnJvbSwgdGhpcy5yYWRpdXMsIHRoaXMucmFkaXVzVGhpY2tuZXNzLCBwLnBvc2l0aW9uLCBwLnZlbG9jaXR5KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKHRoaXMuc2hhcGVUeXBlICsgJyBzaGFwZVR5cGUgaXMgbm90IHN1cHBvcnRlZCBieSBTaGFwZU1vZHVsZS4nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5yYW5kb21Qb3NpdGlvbkFtb3VudCA+IDApIHtcbiAgICAgICAgICAgIHAucG9zaXRpb24ueCArPSByYW5kb21SYW5nZSgtdGhpcy5yYW5kb21Qb3NpdGlvbkFtb3VudCwgdGhpcy5yYW5kb21Qb3NpdGlvbkFtb3VudCk7XG4gICAgICAgICAgICBwLnBvc2l0aW9uLnkgKz0gcmFuZG9tUmFuZ2UoLXRoaXMucmFuZG9tUG9zaXRpb25BbW91bnQsIHRoaXMucmFuZG9tUG9zaXRpb25BbW91bnQpO1xuICAgICAgICAgICAgcC5wb3NpdGlvbi56ICs9IHJhbmRvbVJhbmdlKC10aGlzLnJhbmRvbVBvc2l0aW9uQW1vdW50LCB0aGlzLnJhbmRvbVBvc2l0aW9uQW1vdW50KTtcbiAgICAgICAgfVxuICAgICAgICBWZWMzLnRyYW5zZm9ybVF1YXQocC52ZWxvY2l0eSwgcC52ZWxvY2l0eSwgdGhpcy5xdWF0KTtcbiAgICAgICAgVmVjMy50cmFuc2Zvcm1NYXQ0KHAucG9zaXRpb24sIHAucG9zaXRpb24sIHRoaXMubWF0KTtcbiAgICAgICAgaWYgKHRoaXMuc3BoZXJpY2FsRGlyZWN0aW9uQW1vdW50ID4gMCkge1xuICAgICAgICAgICAgY29uc3Qgc3BoZXJpY2FsVmVsID0gVmVjMy5ub3JtYWxpemUoX2ludGVybWVkaVZlYywgcC5wb3NpdGlvbik7XG4gICAgICAgICAgICBWZWMzLmxlcnAocC52ZWxvY2l0eSwgcC52ZWxvY2l0eSwgc3BoZXJpY2FsVmVsLCB0aGlzLnNwaGVyaWNhbERpcmVjdGlvbkFtb3VudCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sYXN0VGltZSA9IHRoaXMucGFydGljbGVTeXN0ZW0uX3RpbWU7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVBcmNBbmdsZSAoKSB7XG4gICAgICAgIGlmICh0aGlzLmFyY01vZGUgPT09IEFyY01vZGUuUmFuZG9tKSB7XG4gICAgICAgICAgICByZXR1cm4gcmFuZG9tUmFuZ2UoMCwgdGhpcy5fYXJjKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgYW5nbGUgPSB0aGlzLnRvdGFsQW5nbGUgKyAyICogTWF0aC5QSSAqIHRoaXMuYXJjU3BlZWQuZXZhbHVhdGUodGhpcy5wYXJ0aWNsZVN5c3RlbS5fdGltZSwgMSkgKiAodGhpcy5wYXJ0aWNsZVN5c3RlbS5fdGltZSAtIHRoaXMubGFzdFRpbWUpO1xuICAgICAgICB0aGlzLnRvdGFsQW5nbGUgPSBhbmdsZTtcbiAgICAgICAgaWYgKHRoaXMuYXJjU3ByZWFkICE9PSAwKSB7XG4gICAgICAgICAgICBhbmdsZSA9IE1hdGguZmxvb3IoYW5nbGUgLyAodGhpcy5fYXJjICogdGhpcy5hcmNTcHJlYWQpKSAqIHRoaXMuX2FyYyAqIHRoaXMuYXJjU3ByZWFkO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAodGhpcy5hcmNNb2RlKSB7XG4gICAgICAgICAgICBjYXNlIEFyY01vZGUuTG9vcDpcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwZWF0KGFuZ2xlLCB0aGlzLl9hcmMpO1xuICAgICAgICAgICAgY2FzZSBBcmNNb2RlLlBpbmdQb25nOlxuICAgICAgICAgICAgICAgIHJldHVybiBwaW5nUG9uZyhhbmdsZSwgdGhpcy5fYXJjKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gc3BoZXJlRW1pdCAoZW1pdEZyb20sIHJhZGl1cywgcmFkaXVzVGhpY2tuZXNzLCBwb3MsIGRpcikge1xuICAgIHN3aXRjaCAoZW1pdEZyb20pIHtcbiAgICAgICAgY2FzZSBFbWl0TG9jYXRpb24uVm9sdW1lOlxuICAgICAgICAgICAgcmFuZG9tUG9pbnRCZXR3ZWVuU3BoZXJlKHBvcywgcmFkaXVzICogKDEgLSByYWRpdXNUaGlja25lc3MpLCByYWRpdXMpO1xuICAgICAgICAgICAgVmVjMy5jb3B5KGRpciwgcG9zKTtcbiAgICAgICAgICAgIFZlYzMubm9ybWFsaXplKGRpciwgZGlyKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEVtaXRMb2NhdGlvbi5TaGVsbDpcbiAgICAgICAgICAgIHJhbmRvbVVuaXRWZWN0b3IocG9zKTtcbiAgICAgICAgICAgIFZlYzMuc2NhbGUocG9zLCBwb3MsIHJhZGl1cyk7XG4gICAgICAgICAgICBWZWMzLmNvcHkoZGlyLCBwb3MpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oZW1pdEZyb20gKyAnIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIHNwaGVyZSBlbWl0dGVyLicpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaGVtaXNwaGVyZUVtaXQgKGVtaXRGcm9tLCByYWRpdXMsIHJhZGl1c1RoaWNrbmVzcywgcG9zLCBkaXIpIHtcbiAgICBzd2l0Y2ggKGVtaXRGcm9tKSB7XG4gICAgICAgIGNhc2UgRW1pdExvY2F0aW9uLlZvbHVtZTpcbiAgICAgICAgICAgIHJhbmRvbVBvaW50QmV0d2VlblNwaGVyZShwb3MsIHJhZGl1cyAqICgxIC0gcmFkaXVzVGhpY2tuZXNzKSwgcmFkaXVzKTtcbiAgICAgICAgICAgIGlmIChwb3MueiA+IDApIHtcbiAgICAgICAgICAgICAgICBwb3MueiAqPSAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFZlYzMuY29weShkaXIsIHBvcyk7XG4gICAgICAgICAgICBWZWMzLm5vcm1hbGl6ZShkaXIsIGRpcik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBFbWl0TG9jYXRpb24uU2hlbGw6XG4gICAgICAgICAgICByYW5kb21Vbml0VmVjdG9yKHBvcyk7XG4gICAgICAgICAgICBWZWMzLnNjYWxlKHBvcywgcG9zLCByYWRpdXMpO1xuICAgICAgICAgICAgaWYgKHBvcy56IDwgMCkge1xuICAgICAgICAgICAgICAgIHBvcy56ICo9IC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgVmVjMy5jb3B5KGRpciwgcG9zKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY29uc29sZS53YXJuKGVtaXRGcm9tICsgJyBpcyBub3Qgc3VwcG9ydGVkIGZvciBoZW1pc3BoZXJlIGVtaXR0ZXIuJyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjb25lRW1pdCAoZW1pdEZyb20sIHJhZGl1cywgcmFkaXVzVGhpY2tuZXNzLCB0aGV0YSwgYW5nbGUsIGxlbmd0aCwgcG9zLCBkaXIpIHtcbiAgICBzd2l0Y2ggKGVtaXRGcm9tKSB7XG4gICAgICAgIGNhc2UgRW1pdExvY2F0aW9uLkJhc2U6XG4gICAgICAgICAgICByYW5kb21Qb2ludEJldHdlZW5DaXJjbGVBdEZpeGVkQW5nbGUocG9zLCByYWRpdXMgKiAoMSAtIHJhZGl1c1RoaWNrbmVzcyksIHJhZGl1cywgdGhldGEpO1xuICAgICAgICAgICAgVmVjMi5zY2FsZShkaXIsIHBvcywgTWF0aC5zaW4oYW5nbGUpKTtcbiAgICAgICAgICAgIGRpci56ID0gLU1hdGguY29zKGFuZ2xlKSAqIHJhZGl1cztcbiAgICAgICAgICAgIFZlYzMubm9ybWFsaXplKGRpciwgZGlyKTtcbiAgICAgICAgICAgIHBvcy56ID0gMDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEVtaXRMb2NhdGlvbi5TaGVsbDpcbiAgICAgICAgICAgIGZpeGVkQW5nbGVVbml0VmVjdG9yMihwb3MsIHRoZXRhKTtcbiAgICAgICAgICAgIFZlYzIuc2NhbGUoZGlyLCBwb3MsIE1hdGguc2luKGFuZ2xlKSk7XG4gICAgICAgICAgICBkaXIueiA9IC1NYXRoLmNvcyhhbmdsZSk7XG4gICAgICAgICAgICBWZWMzLm5vcm1hbGl6ZShkaXIsIGRpcik7XG4gICAgICAgICAgICBWZWMyLnNjYWxlKHBvcywgcG9zLCByYWRpdXMpO1xuICAgICAgICAgICAgcG9zLnogPSAwO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgRW1pdExvY2F0aW9uLlZvbHVtZTpcbiAgICAgICAgICAgIHJhbmRvbVBvaW50QmV0d2VlbkNpcmNsZUF0Rml4ZWRBbmdsZShwb3MsIHJhZGl1cyAqICgxIC0gcmFkaXVzVGhpY2tuZXNzKSwgcmFkaXVzLCB0aGV0YSk7XG4gICAgICAgICAgICBWZWMyLnNjYWxlKGRpciwgcG9zLCBNYXRoLnNpbihhbmdsZSkpO1xuICAgICAgICAgICAgZGlyLnogPSAtTWF0aC5jb3MoYW5nbGUpICogcmFkaXVzO1xuICAgICAgICAgICAgVmVjMy5ub3JtYWxpemUoZGlyLCBkaXIpO1xuICAgICAgICAgICAgcG9zLnogPSAwO1xuICAgICAgICAgICAgVmVjMy5hZGQocG9zLCBwb3MsIFZlYzMuc2NhbGUoX2ludGVybWVkaVZlYywgZGlyLCBsZW5ndGggKiByYW5kb20oKSAvIC1kaXIueikpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oZW1pdEZyb20gKyAnIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIGNvbmUgZW1pdHRlci4nKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGJveEVtaXQgKGVtaXRGcm9tLCBib3hUaGlja25lc3MsIHBvcywgZGlyKSB7XG4gICAgc3dpdGNoIChlbWl0RnJvbSkge1xuICAgICAgICBjYXNlIEVtaXRMb2NhdGlvbi5Wb2x1bWU6XG4gICAgICAgICAgICByYW5kb21Qb2ludEluQ3ViZShwb3MsIF91bml0Qm94RXh0ZW50KTtcbiAgICAgICAgICAgIC8vIHJhbmRvbVBvaW50QmV0d2VlbkN1YmUocG9zLCBWZWMzLm11bHRpcGx5KF9pbnRlcm1lZGlWZWMsIF91bml0Qm94RXh0ZW50LCBib3hUaGlja25lc3MpLCBfdW5pdEJveEV4dGVudCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBFbWl0TG9jYXRpb24uU2hlbGw6XG4gICAgICAgICAgICBfaW50ZXJtZWRpQXJyLnNwbGljZSgwLCBfaW50ZXJtZWRpQXJyLmxlbmd0aCk7XG4gICAgICAgICAgICBfaW50ZXJtZWRpQXJyLnB1c2gocmFuZG9tUmFuZ2UoLTAuNSwgMC41KSk7XG4gICAgICAgICAgICBfaW50ZXJtZWRpQXJyLnB1c2gocmFuZG9tUmFuZ2UoLTAuNSwgMC41KSk7XG4gICAgICAgICAgICBfaW50ZXJtZWRpQXJyLnB1c2gocmFuZG9tU2lnbigpICogMC41KTtcbiAgICAgICAgICAgIHJhbmRvbVNvcnRBcnJheShfaW50ZXJtZWRpQXJyKTtcbiAgICAgICAgICAgIGFwcGx5Qm94VGhpY2tuZXNzKF9pbnRlcm1lZGlBcnIsIGJveFRoaWNrbmVzcyk7XG4gICAgICAgICAgICBWZWMzLnNldChwb3MsIF9pbnRlcm1lZGlBcnJbMF0sIF9pbnRlcm1lZGlBcnJbMV0sIF9pbnRlcm1lZGlBcnJbMl0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgRW1pdExvY2F0aW9uLkVkZ2U6XG4gICAgICAgICAgICBfaW50ZXJtZWRpQXJyLnNwbGljZSgwLCBfaW50ZXJtZWRpQXJyLmxlbmd0aCk7XG4gICAgICAgICAgICBfaW50ZXJtZWRpQXJyLnB1c2gocmFuZG9tUmFuZ2UoLTAuNSwgMC41KSk7XG4gICAgICAgICAgICBfaW50ZXJtZWRpQXJyLnB1c2gocmFuZG9tU2lnbigpICogMC41KTtcbiAgICAgICAgICAgIF9pbnRlcm1lZGlBcnIucHVzaChyYW5kb21TaWduKCkgKiAwLjUpO1xuICAgICAgICAgICAgcmFuZG9tU29ydEFycmF5KF9pbnRlcm1lZGlBcnIpO1xuICAgICAgICAgICAgYXBwbHlCb3hUaGlja25lc3MoX2ludGVybWVkaUFyciwgYm94VGhpY2tuZXNzKTtcbiAgICAgICAgICAgIFZlYzMuc2V0KHBvcywgX2ludGVybWVkaUFyclswXSwgX2ludGVybWVkaUFyclsxXSwgX2ludGVybWVkaUFyclsyXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihlbWl0RnJvbSArICcgaXMgbm90IHN1cHBvcnRlZCBmb3IgYm94IGVtaXR0ZXIuJyk7XG4gICAgfVxuICAgIFZlYzMuY29weShkaXIsIHBhcnRpY2xlRW1pdFpBeGlzKTtcbn1cblxuZnVuY3Rpb24gY2lyY2xlRW1pdCAocmFkaXVzLCByYWRpdXNUaGlja25lc3MsIHRoZXRhLCBwb3MsIGRpcikge1xuICAgIHJhbmRvbVBvaW50QmV0d2VlbkNpcmNsZUF0Rml4ZWRBbmdsZShwb3MsIHJhZGl1cyAqICgxIC0gcmFkaXVzVGhpY2tuZXNzKSwgcmFkaXVzLCB0aGV0YSk7XG4gICAgVmVjMy5ub3JtYWxpemUoZGlyLCBwb3MpO1xufVxuXG5mdW5jdGlvbiBhcHBseUJveFRoaWNrbmVzcyAocG9zLCB0aGlja25lc3MpIHtcbiAgICBpZiAodGhpY2tuZXNzLnggPiAwKSB7XG4gICAgICAgIHBvc1swXSArPSAwLjUgKiByYW5kb21SYW5nZSgtdGhpY2tuZXNzLngsIHRoaWNrbmVzcy54KTtcbiAgICAgICAgcG9zWzBdID0gY2xhbXAocG9zWzBdLCAtMC41LCAwLjUpO1xuICAgIH1cbiAgICBpZiAodGhpY2tuZXNzLnkgPiAwKSB7XG4gICAgICAgIHBvc1sxXSArPSAwLjUgKiByYW5kb21SYW5nZSgtdGhpY2tuZXNzLnksIHRoaWNrbmVzcy55KTtcbiAgICAgICAgcG9zWzFdID0gY2xhbXAocG9zWzFdLCAtMC41LCAwLjUpO1xuICAgIH1cbiAgICBpZiAodGhpY2tuZXNzLnogPiAwKSB7XG4gICAgICAgIHBvc1syXSArPSAwLjUgKiByYW5kb21SYW5nZSgtdGhpY2tuZXNzLnosIHRoaWNrbmVzcy56KTtcbiAgICAgICAgcG9zWzJdID0gY2xhbXAocG9zWzJdLCAtMC41LCAwLjUpO1xuICAgIH1cbn1cbiJdfQ==