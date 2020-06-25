
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/particle/renderer/trail.js';
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

var _gfx = _interopRequireDefault(require("../../../../renderer/gfx"));

var _pool = _interopRequireDefault(require("../../../../renderer/memop/pool"));

var _curveRange = _interopRequireDefault(require("../animator/curve-range"));

var _gradientRange = _interopRequireDefault(require("../animator/gradient-range"));

var _enum = require("../enum");

var _utils = _interopRequireDefault(require("../utils"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

var renderer = require('../../../renderer'); // tslint:disable: max-line-length


var PRE_TRIANGLE_INDEX = 1;
var NEXT_TRIANGLE_INDEX = 1 << 2;
var DIRECTION_THRESHOLD = Math.cos((0, _valueTypes.toRadian)(100));
var _temp_trailEle = {
  position: cc.v3(),
  velocity: cc.v3()
};

var _temp_quat = cc.quat();

var _temp_xform = cc.mat4();

var _temp_Vec3 = cc.v3();

var _temp_Vec3_1 = cc.v3();

var _temp_color = cc.color();

var ITrailElement = function ITrailElement() {
  this.position = void 0;
  this.lifetime = void 0;
  this.width = void 0;
  this.velocity = void 0;
  this.color = void 0;
}; // the valid element is in [start,end) range.if start equals -1,it represents the array is empty.


var TrailSegment =
/*#__PURE__*/
function () {
  function TrailSegment(maxTrailElementNum) {
    this.start = void 0;
    this.end = void 0;
    this.trailElements = [];
    this.start = -1;
    this.end = -1;
    this.trailElements = [];

    while (maxTrailElementNum--) {
      this.trailElements.push({
        position: cc.v3(),
        lifetime: 0,
        width: 0,
        velocity: cc.v3(),
        color: cc.color()
      });
    }
  }

  var _proto = TrailSegment.prototype;

  _proto.getElement = function getElement(idx) {
    if (this.start === -1) {
      return null;
    }

    if (idx < 0) {
      idx = (idx + this.trailElements.length) % this.trailElements.length;
    }

    if (idx >= this.trailElements.length) {
      idx %= this.trailElements.length;
    }

    return this.trailElements[idx];
  };

  _proto.addElement = function addElement() {
    if (this.trailElements.length === 0) {
      return null;
    }

    if (this.start === -1) {
      this.start = 0;
      this.end = 1;
      return this.trailElements[0];
    }

    if (this.start === this.end) {
      this.trailElements.splice(this.end, 0, {
        position: cc.v3(),
        lifetime: 0,
        width: 0,
        velocity: cc.v3(),
        color: cc.color()
      });
      this.start++;
      this.start %= this.trailElements.length;
    }

    var newEleLoc = this.end++;
    this.end %= this.trailElements.length;
    return this.trailElements[newEleLoc];
  };

  _proto.iterateElement = function iterateElement(target, f, p, dt) {
    var end = this.start >= this.end ? this.end + this.trailElements.length : this.end;

    for (var i = this.start; i < end; i++) {
      if (f(target, this.trailElements[i % this.trailElements.length], p, dt)) {
        this.start++;
        this.start %= this.trailElements.length;
      }
    }

    if (this.start === end) {
      this.start = -1;
      this.end = -1;
    }
  };

  _proto.count = function count() {
    if (this.start < this.end) {
      return this.end - this.start;
    } else {
      return this.trailElements.length + this.end - this.start;
    }
  };

  _proto.clear = function clear() {
    this.start = -1;
    this.end = -1;
  };

  return TrailSegment;
}();

var TrailModule = (_dec = (0, _CCClassDecorator.ccclass)('cc.TrailModule'), _dec2 = (0, _CCClassDecorator.property)({
  type: _enum.TrailMode
}), _dec3 = (0, _CCClassDecorator.property)({
  type: _curveRange["default"]
}), _dec4 = (0, _CCClassDecorator.property)({
  type: _enum.Space
}), _dec5 = (0, _CCClassDecorator.property)({
  type: _enum.TextureMode
}), _dec6 = (0, _CCClassDecorator.property)({
  type: _curveRange["default"]
}), _dec7 = (0, _CCClassDecorator.property)({
  type: _gradientRange["default"]
}), _dec8 = (0, _CCClassDecorator.property)({
  type: _gradientRange["default"]
}), _dec(_class = (_class2 = (_temp =
/*#__PURE__*/
function () {
  _createClass(TrailModule, [{
    key: "enable",

    /**
     * !#en The enable of trailModule.
     * !#zh 是否启用
     * @property {Boolean} enable
     */
    get: function get() {
      return this._enable;
    },
    set: function set(val) {
      if (val) {
        this._createTrailData();
      }

      if (val && !this._enable) {
        this._enable = val;

        this._particleSystem._assembler._updateTrailMaterial();
      }

      this._enable = val;

      this._particleSystem._assembler._updateTrailEnable(this._enable);
    }
    /**
     * !#en Sets how particles generate trajectories.
     * !#zh 设定粒子生成轨迹的方式。
     * @property {TrailMode} mode
     */

  }, {
    key: "minParticleDistance",

    /**
     * !#en Minimum spacing between each track particle
     * !#zh 每个轨迹粒子之间的最小间距。
     * @property {Number} minParticleDistance
     */
    get: function get() {
      return this._minParticleDistance;
    },
    set: function set(val) {
      this._minParticleDistance = val;
      this._minSquaredDistance = val * val;
    }
  }, {
    key: "space",

    /**
     * !#en The coordinate system of trajectories.
     * !#zh 轨迹设定时的坐标系。
     * @property {Space} space
     */
    get: function get() {
      return this._space;
    },
    set: function set(val) {
      this._space = val;

      if (this._particleSystem) {
        this._particleSystem._assembler._updateTrailMaterial();
      }
    }
    /**
     * !#en Whether the particle itself exists.
     * !#zh 粒子本身是否存在。
     * @property {Boolean} existWithParticles
     */

  }]);

  function TrailModule() {
    _initializerDefineProperty(this, "_enable", _descriptor, this);

    _initializerDefineProperty(this, "mode", _descriptor2, this);

    _initializerDefineProperty(this, "lifeTime", _descriptor3, this);

    _initializerDefineProperty(this, "_minParticleDistance", _descriptor4, this);

    _initializerDefineProperty(this, "_space", _descriptor5, this);

    _initializerDefineProperty(this, "existWithParticles", _descriptor6, this);

    _initializerDefineProperty(this, "textureMode", _descriptor7, this);

    _initializerDefineProperty(this, "widthFromParticle", _descriptor8, this);

    _initializerDefineProperty(this, "widthRatio", _descriptor9, this);

    _initializerDefineProperty(this, "colorFromParticle", _descriptor10, this);

    _initializerDefineProperty(this, "colorOverTrail", _descriptor11, this);

    _initializerDefineProperty(this, "colorOvertime", _descriptor12, this);

    this._particleSystem = null;
    this._minSquaredDistance = 0;
    this._vertSize = 0;
    this._trailNum = 0;
    this._trailLifetime = 0;
    this.vbOffset = 0;
    this.ibOffset = 0;
    this._trailSegments = null;
    this._particleTrail = null;
    this._ia = null;
    this._gfxVFmt = null;
    this._vbF32 = null;
    this._vbUint32 = null;
    this._iBuffer = null;
    this._needTransform = null;
    this._defaultMat = null;
    this._material = null;
    this._gfxVFmt = new _gfx["default"].VertexFormat([{
      name: _gfx["default"].ATTR_POSITION,
      type: _gfx["default"].ATTR_TYPE_FLOAT32,
      num: 3
    }, {
      name: _gfx["default"].ATTR_TEX_COORD,
      type: _gfx["default"].ATTR_TYPE_FLOAT32,
      num: 4
    }, {
      name: _gfx["default"].ATTR_TEX_COORD1,
      type: _gfx["default"].ATTR_TYPE_FLOAT32,
      num: 3
    }, {
      name: _gfx["default"].ATTR_COLOR,
      type: _gfx["default"].ATTR_TYPE_UINT8,
      num: 4,
      normalize: true
    }]);
    this._vertSize = this._gfxVFmt._bytes;
    this._particleTrail = new _utils["default"](); // Map<Particle, TrailSegment>();
  }

  var _proto2 = TrailModule.prototype;

  _proto2.onInit = function onInit(ps) {
    this._particleSystem = ps;
    this.minParticleDistance = this._minParticleDistance;
    var burstCount = 0;

    for (var _iterator = ps.bursts, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var b = _ref;
      burstCount += b.getMaxCount(ps);
    }

    this.lifeTime.constant = 1;
    this._trailNum = Math.ceil(ps.startLifetime.getMax() * this.lifeTime.getMax() * 60 * (ps.rateOverTime.getMax() * ps.duration + burstCount));
    this._trailSegments = new _pool["default"](function () {
      return new TrailSegment(10);
    }, Math.ceil(ps.rateOverTime.getMax() * ps.duration));

    if (this._enable) {
      this.enable = this._enable;

      this._updateMaterial();
    }
  };

  _proto2.onEnable = function onEnable() {};

  _proto2.onDisable = function onDisable() {};

  _proto2.destroy = function destroy() {
    if (this._trailSegments) {
      this._trailSegments.clear(function (obj) {
        obj.trailElements.length = 0;
      });

      this._trailSegments = null;
    }
  };

  _proto2.clear = function clear() {
    if (this.enable) {
      var trailIter = this._particleTrail.values();

      var trail = trailIter.next();

      while (!trail.done) {
        trail.value.clear();
        trail = trailIter.next();
      }

      this._particleTrail.clear();

      this.updateTrailBuffer();
    }
  };

  _proto2._createTrailData = function _createTrailData() {
    var model = this._particleSystem._assembler._model;

    if (model) {
      model.createTrailData(this._gfxVFmt, this._trailNum);
      var subData = model._subDatas[1];
      this._vbF32 = subData.getVData();
      this._vbUint32 = subData.getVData(Uint32Array);
      this._iBuffer = subData.iData;
    }
  };

  _proto2._updateMaterial = function _updateMaterial() {
    if (this._particleSystem) {
      var mat = this._particleSystem.trailMaterial;

      if (mat) {
        this._material = mat;
      } else {
        this._material = this._particleSystem._assembler._defaultTrailMat;
      }
    }
  };

  _proto2.update = function update() {
    this._trailLifetime = this.lifeTime.evaluate(this._particleSystem._time, 1);

    if (this.space === _enum.Space.World && this._particleSystem._simulationSpace === _enum.Space.Local) {
      this._needTransform = true;

      this._particleSystem.node.getWorldMatrix(_temp_xform);

      this._particleSystem.node.getWorldRotation(_temp_quat);
    } else {
      this._needTransform = false;
    }
  };

  _proto2.animate = function animate(p, scaledDt) {
    if (!this._trailSegments) {
      return;
    }

    var trail = this._particleTrail.get(p);

    if (!trail) {
      trail = this._trailSegments.alloc();

      this._particleTrail.set(p, trail);
    }

    var lastSeg = trail.getElement(trail.end - 1);

    if (this._needTransform) {
      _valueTypes.Vec3.transformMat4(_temp_Vec3, p.position, _temp_xform);
    } else {
      _valueTypes.Vec3.copy(_temp_Vec3, p.position);
    }

    if (lastSeg) {
      trail.iterateElement(this, this._updateTrailElement, p, scaledDt);

      if (_valueTypes.Vec3.squaredDistance(lastSeg.position, _temp_Vec3) < this._minSquaredDistance) {
        return;
      }
    }

    lastSeg = trail.addElement();

    if (!lastSeg) {
      return;
    }

    _valueTypes.Vec3.copy(lastSeg.position, _temp_Vec3);

    lastSeg.lifetime = 0;

    if (this.widthFromParticle) {
      lastSeg.width = p.size.x * this.widthRatio.evaluate(0, 1);
    } else {
      lastSeg.width = this.widthRatio.evaluate(0, 1);
    }

    var trailNum = trail.count();

    if (trailNum === 2) {
      var lastSecondTrail = trail.getElement(trail.end - 2);

      _valueTypes.Vec3.subtract(lastSecondTrail.velocity, lastSeg.position, lastSecondTrail.position);
    } else if (trailNum > 2) {
      var _lastSecondTrail = trail.getElement(trail.end - 2);

      var lastThirdTrail = trail.getElement(trail.end - 3);

      _valueTypes.Vec3.subtract(_temp_Vec3, lastThirdTrail.position, _lastSecondTrail.position);

      _valueTypes.Vec3.subtract(_temp_Vec3_1, lastSeg.position, _lastSecondTrail.position);

      _valueTypes.Vec3.subtract(_lastSecondTrail.velocity, _temp_Vec3_1, _temp_Vec3);

      if (_valueTypes.Vec3.equals(cc.Vec3.ZERO, _lastSecondTrail.velocity)) {
        _valueTypes.Vec3.copy(_lastSecondTrail.velocity, _temp_Vec3);
      }
    }

    if (this.colorFromParticle) {
      lastSeg.color.set(p.color);
    } else {
      lastSeg.color.set(this.colorOvertime.evaluate(0, 1));
    }
  };

  _proto2._updateTrailElement = function _updateTrailElement(trail, trailEle, p, dt) {
    trailEle.lifetime += dt;

    if (trail.colorFromParticle) {
      trailEle.color.set(p.color);
      trailEle.color.multiply(trail.colorOvertime.evaluate(1.0 - p.remainingLifetime / p.startLifetime, 1));
    } else {
      trailEle.color.set(trail.colorOvertime.evaluate(1.0 - p.remainingLifetime / p.startLifetime, 1));
    }

    if (trail.widthFromParticle) {
      trailEle.width = p.size.x * trail.widthRatio.evaluate(trailEle.lifetime / trail._trailLifetime, 1);
    } else {
      trailEle.width = trail.widthRatio.evaluate(trailEle.lifetime / trail._trailLifetime, 1);
    }

    return trailEle.lifetime > trail._trailLifetime;
  };

  _proto2.removeParticle = function removeParticle(p) {
    var trail = this._particleTrail.get(p);

    if (trail && this._trailSegments) {
      trail.clear();

      this._trailSegments.free(trail);

      this._particleTrail["delete"](p);
    }
  };

  _proto2.updateTrailBuffer = function updateTrailBuffer() {
    this.vbOffset = 0;
    this.ibOffset = 0;

    for (var _i2 = 0, _Array$from = Array.from(this._particleTrail.keys()); _i2 < _Array$from.length; _i2++) {
      var p = _Array$from[_i2];

      var trailSeg = this._particleTrail.get(p);

      if (trailSeg.start === -1) {
        continue;
      }

      var indexOffset = this.vbOffset * 4 / this._vertSize;
      var end = trailSeg.start >= trailSeg.end ? trailSeg.end + trailSeg.trailElements.length : trailSeg.end;
      var trailNum = end - trailSeg.start; // const lastSegRatio = Vec3.distance(trailSeg.getTailElement()!.position, p.position) / this._minParticleDistance;

      var textCoordSeg = 1 / trailNum
      /*- 1 + lastSegRatio*/
      ;
      var startSegEle = trailSeg.trailElements[trailSeg.start];

      this._fillVertexBuffer(startSegEle, this.colorOverTrail.evaluate(1, 1), indexOffset, 1, 0, NEXT_TRIANGLE_INDEX);

      for (var i = trailSeg.start + 1; i < end; i++) {
        var segEle = trailSeg.trailElements[i % trailSeg.trailElements.length];
        var j = i - trailSeg.start;

        this._fillVertexBuffer(segEle, this.colorOverTrail.evaluate(1 - j / trailNum, 1), indexOffset, 1 - j * textCoordSeg, j, PRE_TRIANGLE_INDEX | NEXT_TRIANGLE_INDEX);
      }

      if (this._needTransform) {
        _valueTypes.Vec3.transformMat4(_temp_trailEle.position, p.position, _temp_xform);
      } else {
        _valueTypes.Vec3.copy(_temp_trailEle.position, p.position);
      }

      if (trailNum === 1 || trailNum === 2) {
        var lastSecondTrail = trailSeg.getElement(trailSeg.end - 1);

        _valueTypes.Vec3.subtract(lastSecondTrail.velocity, _temp_trailEle.position, lastSecondTrail.position);

        this._vbF32[this.vbOffset - this._vertSize / 4 - 4] = lastSecondTrail.velocity.x;
        this._vbF32[this.vbOffset - this._vertSize / 4 - 3] = lastSecondTrail.velocity.y;
        this._vbF32[this.vbOffset - this._vertSize / 4 - 2] = lastSecondTrail.velocity.z;
        this._vbF32[this.vbOffset - 4] = lastSecondTrail.velocity.x;
        this._vbF32[this.vbOffset - 3] = lastSecondTrail.velocity.y;
        this._vbF32[this.vbOffset - 2] = lastSecondTrail.velocity.z;

        _valueTypes.Vec3.subtract(_temp_trailEle.velocity, _temp_trailEle.position, lastSecondTrail.position);

        this._checkDirectionReverse(_temp_trailEle, lastSecondTrail);
      } else if (trailNum > 2) {
        var _lastSecondTrail2 = trailSeg.getElement(trailSeg.end - 1);

        var lastThirdTrail = trailSeg.getElement(trailSeg.end - 2);

        _valueTypes.Vec3.subtract(_temp_Vec3, lastThirdTrail.position, _lastSecondTrail2.position);

        _valueTypes.Vec3.subtract(_temp_Vec3_1, _temp_trailEle.position, _lastSecondTrail2.position);

        _valueTypes.Vec3.subtract(_lastSecondTrail2.velocity, _temp_Vec3_1, _temp_Vec3);

        _valueTypes.Vec3.normalize(_lastSecondTrail2.velocity, _lastSecondTrail2.velocity);

        this._checkDirectionReverse(_lastSecondTrail2, lastThirdTrail);

        this._vbF32[this.vbOffset - this._vertSize / 4 - 4] = _lastSecondTrail2.velocity.x;
        this._vbF32[this.vbOffset - this._vertSize / 4 - 3] = _lastSecondTrail2.velocity.y;
        this._vbF32[this.vbOffset - this._vertSize / 4 - 2] = _lastSecondTrail2.velocity.z;
        this._vbF32[this.vbOffset - 4] = _lastSecondTrail2.velocity.x;
        this._vbF32[this.vbOffset - 3] = _lastSecondTrail2.velocity.y;
        this._vbF32[this.vbOffset - 2] = _lastSecondTrail2.velocity.z;

        _valueTypes.Vec3.subtract(_temp_trailEle.velocity, _temp_trailEle.position, _lastSecondTrail2.position);

        _valueTypes.Vec3.normalize(_temp_trailEle.velocity, _temp_trailEle.velocity);

        this._checkDirectionReverse(_temp_trailEle, _lastSecondTrail2);
      }

      _temp_trailEle.width = p.size.x;
      _temp_trailEle.color = p.color;

      if (_valueTypes.Vec3.equals(_temp_trailEle.velocity, cc.Vec3.ZERO)) {
        this.ibOffset -= 3;
      } else {
        this._fillVertexBuffer(_temp_trailEle, this.colorOverTrail.evaluate(0, 1), indexOffset, 0, trailNum, PRE_TRIANGLE_INDEX);
      }
    }

    this._updateIA(this.ibOffset);
  };

  _proto2._fillVertexBuffer = function _fillVertexBuffer(trailSeg, colorModifer, indexOffset, xTexCoord, trailEleIdx, indexSet) {
    this._vbF32[this.vbOffset++] = trailSeg.position.x;
    this._vbF32[this.vbOffset++] = trailSeg.position.y;
    this._vbF32[this.vbOffset++] = trailSeg.position.z;
    this._vbF32[this.vbOffset++] = 0;
    this._vbF32[this.vbOffset++] = trailSeg.width;
    this._vbF32[this.vbOffset++] = xTexCoord;
    this._vbF32[this.vbOffset++] = 0;
    this._vbF32[this.vbOffset++] = trailSeg.velocity.x;
    this._vbF32[this.vbOffset++] = trailSeg.velocity.y;
    this._vbF32[this.vbOffset++] = trailSeg.velocity.z;

    _temp_color.set(trailSeg.color);

    _temp_color.multiply(colorModifer);

    this._vbUint32[this.vbOffset++] = _temp_color._val;
    this._vbF32[this.vbOffset++] = trailSeg.position.x;
    this._vbF32[this.vbOffset++] = trailSeg.position.y;
    this._vbF32[this.vbOffset++] = trailSeg.position.z;
    this._vbF32[this.vbOffset++] = 1;
    this._vbF32[this.vbOffset++] = trailSeg.width;
    this._vbF32[this.vbOffset++] = xTexCoord;
    this._vbF32[this.vbOffset++] = 1;
    this._vbF32[this.vbOffset++] = trailSeg.velocity.x;
    this._vbF32[this.vbOffset++] = trailSeg.velocity.y;
    this._vbF32[this.vbOffset++] = trailSeg.velocity.z;
    this._vbUint32[this.vbOffset++] = _temp_color._val;

    if (indexSet & PRE_TRIANGLE_INDEX) {
      this._iBuffer[this.ibOffset++] = indexOffset + 2 * trailEleIdx;
      this._iBuffer[this.ibOffset++] = indexOffset + 2 * trailEleIdx - 1;
      this._iBuffer[this.ibOffset++] = indexOffset + 2 * trailEleIdx + 1;
    }

    if (indexSet & NEXT_TRIANGLE_INDEX) {
      this._iBuffer[this.ibOffset++] = indexOffset + 2 * trailEleIdx;
      this._iBuffer[this.ibOffset++] = indexOffset + 2 * trailEleIdx + 1;
      this._iBuffer[this.ibOffset++] = indexOffset + 2 * trailEleIdx + 2;
    }
  };

  _proto2._updateIA = function _updateIA(count) {
    if (this._particleSystem && this._particleSystem._assembler) {
      this._particleSystem._assembler.updateIA(1, count, true, true);
    }
  };

  _proto2._checkDirectionReverse = function _checkDirectionReverse(currElement, prevElement) {
    if (_valueTypes.Vec3.dot(currElement.velocity, prevElement.velocity) < DIRECTION_THRESHOLD) {
      currElement.direction = 1 - prevElement.direction;
    } else {
      currElement.direction = prevElement.direction;
    }
  };

  return TrailModule;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_enable", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "enable", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "enable"), _class2.prototype), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "mode", [_dec2], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return _enum.TrailMode.Particles;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "lifeTime", [_dec3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_minParticleDistance", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0.1;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "minParticleDistance", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "minParticleDistance"), _class2.prototype), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_space", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return _enum.Space.World;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "space", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "space"), _class2.prototype), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "existWithParticles", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "textureMode", [_dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return _enum.TextureMode.Stretch;
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "widthFromParticle", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "widthRatio", [_dec6], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "colorFromParticle", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "colorOverTrail", [_dec7], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _gradientRange["default"]();
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "colorOvertime", [_dec8], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _gradientRange["default"]();
  }
})), _class2)) || _class);
exports["default"] = TrailModule;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyYWlsLnRzIl0sIm5hbWVzIjpbInJlbmRlcmVyIiwicmVxdWlyZSIsIlBSRV9UUklBTkdMRV9JTkRFWCIsIk5FWFRfVFJJQU5HTEVfSU5ERVgiLCJESVJFQ1RJT05fVEhSRVNIT0xEIiwiTWF0aCIsImNvcyIsIl90ZW1wX3RyYWlsRWxlIiwicG9zaXRpb24iLCJjYyIsInYzIiwidmVsb2NpdHkiLCJfdGVtcF9xdWF0IiwicXVhdCIsIl90ZW1wX3hmb3JtIiwibWF0NCIsIl90ZW1wX1ZlYzMiLCJfdGVtcF9WZWMzXzEiLCJfdGVtcF9jb2xvciIsImNvbG9yIiwiSVRyYWlsRWxlbWVudCIsImxpZmV0aW1lIiwid2lkdGgiLCJUcmFpbFNlZ21lbnQiLCJtYXhUcmFpbEVsZW1lbnROdW0iLCJzdGFydCIsImVuZCIsInRyYWlsRWxlbWVudHMiLCJwdXNoIiwiZ2V0RWxlbWVudCIsImlkeCIsImxlbmd0aCIsImFkZEVsZW1lbnQiLCJzcGxpY2UiLCJuZXdFbGVMb2MiLCJpdGVyYXRlRWxlbWVudCIsInRhcmdldCIsImYiLCJwIiwiZHQiLCJpIiwiY291bnQiLCJjbGVhciIsIlRyYWlsTW9kdWxlIiwidHlwZSIsIlRyYWlsTW9kZSIsIkN1cnZlUmFuZ2UiLCJTcGFjZSIsIlRleHR1cmVNb2RlIiwiR3JhZGllbnRSYW5nZSIsIl9lbmFibGUiLCJ2YWwiLCJfY3JlYXRlVHJhaWxEYXRhIiwiX3BhcnRpY2xlU3lzdGVtIiwiX2Fzc2VtYmxlciIsIl91cGRhdGVUcmFpbE1hdGVyaWFsIiwiX3VwZGF0ZVRyYWlsRW5hYmxlIiwiX21pblBhcnRpY2xlRGlzdGFuY2UiLCJfbWluU3F1YXJlZERpc3RhbmNlIiwiX3NwYWNlIiwiX3ZlcnRTaXplIiwiX3RyYWlsTnVtIiwiX3RyYWlsTGlmZXRpbWUiLCJ2Yk9mZnNldCIsImliT2Zmc2V0IiwiX3RyYWlsU2VnbWVudHMiLCJfcGFydGljbGVUcmFpbCIsIl9pYSIsIl9nZnhWRm10IiwiX3ZiRjMyIiwiX3ZiVWludDMyIiwiX2lCdWZmZXIiLCJfbmVlZFRyYW5zZm9ybSIsIl9kZWZhdWx0TWF0IiwiX21hdGVyaWFsIiwiZ2Z4IiwiVmVydGV4Rm9ybWF0IiwibmFtZSIsIkFUVFJfUE9TSVRJT04iLCJBVFRSX1RZUEVfRkxPQVQzMiIsIm51bSIsIkFUVFJfVEVYX0NPT1JEIiwiQVRUUl9URVhfQ09PUkQxIiwiQVRUUl9DT0xPUiIsIkFUVFJfVFlQRV9VSU5UOCIsIm5vcm1hbGl6ZSIsIl9ieXRlcyIsIk1hcFV0aWxzIiwib25Jbml0IiwicHMiLCJtaW5QYXJ0aWNsZURpc3RhbmNlIiwiYnVyc3RDb3VudCIsImJ1cnN0cyIsImIiLCJnZXRNYXhDb3VudCIsImxpZmVUaW1lIiwiY29uc3RhbnQiLCJjZWlsIiwic3RhcnRMaWZldGltZSIsImdldE1heCIsInJhdGVPdmVyVGltZSIsImR1cmF0aW9uIiwiUG9vbCIsImVuYWJsZSIsIl91cGRhdGVNYXRlcmlhbCIsIm9uRW5hYmxlIiwib25EaXNhYmxlIiwiZGVzdHJveSIsIm9iaiIsInRyYWlsSXRlciIsInZhbHVlcyIsInRyYWlsIiwibmV4dCIsImRvbmUiLCJ2YWx1ZSIsInVwZGF0ZVRyYWlsQnVmZmVyIiwibW9kZWwiLCJfbW9kZWwiLCJjcmVhdGVUcmFpbERhdGEiLCJzdWJEYXRhIiwiX3N1YkRhdGFzIiwiZ2V0VkRhdGEiLCJVaW50MzJBcnJheSIsImlEYXRhIiwibWF0IiwidHJhaWxNYXRlcmlhbCIsIl9kZWZhdWx0VHJhaWxNYXQiLCJ1cGRhdGUiLCJldmFsdWF0ZSIsIl90aW1lIiwic3BhY2UiLCJXb3JsZCIsIl9zaW11bGF0aW9uU3BhY2UiLCJMb2NhbCIsIm5vZGUiLCJnZXRXb3JsZE1hdHJpeCIsImdldFdvcmxkUm90YXRpb24iLCJhbmltYXRlIiwic2NhbGVkRHQiLCJnZXQiLCJhbGxvYyIsInNldCIsImxhc3RTZWciLCJWZWMzIiwidHJhbnNmb3JtTWF0NCIsImNvcHkiLCJfdXBkYXRlVHJhaWxFbGVtZW50Iiwic3F1YXJlZERpc3RhbmNlIiwid2lkdGhGcm9tUGFydGljbGUiLCJzaXplIiwieCIsIndpZHRoUmF0aW8iLCJ0cmFpbE51bSIsImxhc3RTZWNvbmRUcmFpbCIsInN1YnRyYWN0IiwibGFzdFRoaXJkVHJhaWwiLCJlcXVhbHMiLCJaRVJPIiwiY29sb3JGcm9tUGFydGljbGUiLCJjb2xvck92ZXJ0aW1lIiwidHJhaWxFbGUiLCJtdWx0aXBseSIsInJlbWFpbmluZ0xpZmV0aW1lIiwicmVtb3ZlUGFydGljbGUiLCJmcmVlIiwiQXJyYXkiLCJmcm9tIiwia2V5cyIsInRyYWlsU2VnIiwiaW5kZXhPZmZzZXQiLCJ0ZXh0Q29vcmRTZWciLCJzdGFydFNlZ0VsZSIsIl9maWxsVmVydGV4QnVmZmVyIiwiY29sb3JPdmVyVHJhaWwiLCJzZWdFbGUiLCJqIiwieSIsInoiLCJfY2hlY2tEaXJlY3Rpb25SZXZlcnNlIiwiX3VwZGF0ZUlBIiwiY29sb3JNb2RpZmVyIiwieFRleENvb3JkIiwidHJhaWxFbGVJZHgiLCJpbmRleFNldCIsIl92YWwiLCJ1cGRhdGVJQSIsImN1cnJFbGVtZW50IiwicHJldkVsZW1lbnQiLCJkb3QiLCJkaXJlY3Rpb24iLCJwcm9wZXJ0eSIsIlBhcnRpY2xlcyIsIlN0cmV0Y2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLFFBQVEsR0FBR0MsT0FBTyxDQUFDLG1CQUFELENBQXhCLEVBRUE7OztBQUNBLElBQU1DLGtCQUFrQixHQUFHLENBQTNCO0FBQ0EsSUFBTUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFqQztBQUNBLElBQU1DLG1CQUFtQixHQUFHQyxJQUFJLENBQUNDLEdBQUwsQ0FBUywwQkFBUyxHQUFULENBQVQsQ0FBNUI7QUFFQSxJQUFNQyxjQUFjLEdBQUc7QUFBRUMsRUFBQUEsUUFBUSxFQUFFQyxFQUFFLENBQUNDLEVBQUgsRUFBWjtBQUFxQkMsRUFBQUEsUUFBUSxFQUFFRixFQUFFLENBQUNDLEVBQUg7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QUM7Ozs7O1dBQ1M7OzREQU9UQTs7Ozs7V0EyQk1qSixnQkFBVWtKOzs7Ozs7O1dBVU4sSUFBSWpKLHNCQUFKOzt5RkFFVmdKOzs7OztXQUNzQjs7eUVBT3RCQSxtTUFVQUE7Ozs7O1dBQ1EvSSxZQUFNb0Y7O3VPQTBCZDJEOzs7OztXQUNvQjs7Ozs7OztXQVVQOUksa0JBQVlnSjs7c0ZBT3pCRjs7Ozs7V0FDbUI7Ozs7Ozs7V0FXUCxJQUFJaEosc0JBQUo7O3VGQU9aZ0o7Ozs7O1dBQ21COzs7Ozs7O1dBVUgsSUFBSTdJLHlCQUFKOzs7Ozs7O1dBVUQsSUFBSUEseUJBQUoiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjY2NsYXNzLCBwcm9wZXJ0eSB9IGZyb20gJy4uLy4uLy4uL3BsYXRmb3JtL0NDQ2xhc3NEZWNvcmF0b3InO1xuaW1wb3J0IHsgVmVjMywgdG9SYWRpYW4sIENvbG9yfSBmcm9tICcuLi8uLi8uLi92YWx1ZS10eXBlcyc7XG5pbXBvcnQgZ2Z4IGZyb20gJy4uLy4uLy4uLy4uL3JlbmRlcmVyL2dmeCc7XG5pbXBvcnQgUG9vbCBmcm9tICcuLi8uLi8uLi8uLi9yZW5kZXJlci9tZW1vcC9wb29sJztcbmltcG9ydCBDdXJ2ZVJhbmdlIGZyb20gJy4uL2FuaW1hdG9yL2N1cnZlLXJhbmdlJztcbmltcG9ydCBHcmFkaWVudFJhbmdlIGZyb20gJy4uL2FuaW1hdG9yL2dyYWRpZW50LXJhbmdlJztcbmltcG9ydCB7IFNwYWNlLCBUZXh0dXJlTW9kZSwgVHJhaWxNb2RlIH0gZnJvbSAnLi4vZW51bSc7XG5pbXBvcnQgTWFwVXRpbHMgZnJvbSAnLi4vdXRpbHMnO1xuXG5jb25zdCByZW5kZXJlciA9IHJlcXVpcmUoJy4uLy4uLy4uL3JlbmRlcmVyJyk7XG5cbi8vIHRzbGludDpkaXNhYmxlOiBtYXgtbGluZS1sZW5ndGhcbmNvbnN0IFBSRV9UUklBTkdMRV9JTkRFWCA9IDE7XG5jb25zdCBORVhUX1RSSUFOR0xFX0lOREVYID0gMSA8PCAyO1xuY29uc3QgRElSRUNUSU9OX1RIUkVTSE9MRCA9IE1hdGguY29zKHRvUmFkaWFuKDEwMCkpO1xuXG5jb25zdCBfdGVtcF90cmFpbEVsZSA9IHsgcG9zaXRpb246IGNjLnYzKCksIHZlbG9jaXR5OiBjYy52MygpIH07XG5jb25zdCBfdGVtcF9xdWF0ID0gY2MucXVhdCgpO1xuY29uc3QgX3RlbXBfeGZvcm0gPSBjYy5tYXQ0KCk7XG5jb25zdCBfdGVtcF9WZWMzID0gY2MudjMoKTtcbmNvbnN0IF90ZW1wX1ZlYzNfMSA9IGNjLnYzKCk7XG5jb25zdCBfdGVtcF9jb2xvciA9IGNjLmNvbG9yKCk7XG5cblxuY2xhc3MgSVRyYWlsRWxlbWVudCB7XG4gICAgcG9zaXRpb247XG4gICAgbGlmZXRpbWU7XG4gICAgd2lkdGg7XG4gICAgdmVsb2NpdHk7XG4gICAgY29sb3I7XG59XG5cbi8vIHRoZSB2YWxpZCBlbGVtZW50IGlzIGluIFtzdGFydCxlbmQpIHJhbmdlLmlmIHN0YXJ0IGVxdWFscyAtMSxpdCByZXByZXNlbnRzIHRoZSBhcnJheSBpcyBlbXB0eS5cbmNsYXNzIFRyYWlsU2VnbWVudCB7XG4gICAgc3RhcnQ7XG4gICAgZW5kO1xuICAgIHRyYWlsRWxlbWVudHMgPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yIChtYXhUcmFpbEVsZW1lbnROdW0pIHtcbiAgICAgICAgdGhpcy5zdGFydCA9IC0xO1xuICAgICAgICB0aGlzLmVuZCA9IC0xO1xuICAgICAgICB0aGlzLnRyYWlsRWxlbWVudHMgPSBbXTtcbiAgICAgICAgd2hpbGUgKG1heFRyYWlsRWxlbWVudE51bS0tKSB7XG4gICAgICAgICAgICB0aGlzLnRyYWlsRWxlbWVudHMucHVzaCh7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246IGNjLnYzKCksXG4gICAgICAgICAgICAgICAgbGlmZXRpbWU6IDAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgdmVsb2NpdHk6IGNjLnYzKCksXG4gICAgICAgICAgICAgICAgY29sb3I6IGNjLmNvbG9yKCksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEVsZW1lbnQgKGlkeCkge1xuICAgICAgICBpZiAodGhpcy5zdGFydCA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpZHggPCAwKSB7XG4gICAgICAgICAgICBpZHggPSAoaWR4ICsgdGhpcy50cmFpbEVsZW1lbnRzLmxlbmd0aCkgJSB0aGlzLnRyYWlsRWxlbWVudHMubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpZHggPj0gdGhpcy50cmFpbEVsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWR4ICU9IHRoaXMudHJhaWxFbGVtZW50cy5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMudHJhaWxFbGVtZW50c1tpZHhdO1xuICAgIH1cblxuICAgIGFkZEVsZW1lbnQgKCkge1xuICAgICAgICBpZiAodGhpcy50cmFpbEVsZW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc3RhcnQgPT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0ID0gMDtcbiAgICAgICAgICAgIHRoaXMuZW5kID0gMTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyYWlsRWxlbWVudHNbMF07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc3RhcnQgPT09IHRoaXMuZW5kKSB7XG4gICAgICAgICAgICB0aGlzLnRyYWlsRWxlbWVudHMuc3BsaWNlKHRoaXMuZW5kLCAwLCB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246IGNjLnYzKCksXG4gICAgICAgICAgICAgICAgbGlmZXRpbWU6IDAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgdmVsb2NpdHk6IGNjLnYzKCksXG4gICAgICAgICAgICAgICAgY29sb3I6IGNjLmNvbG9yKCksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuc3RhcnQrKztcbiAgICAgICAgICAgIHRoaXMuc3RhcnQgJT0gdGhpcy50cmFpbEVsZW1lbnRzLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuZXdFbGVMb2MgPSB0aGlzLmVuZCsrO1xuICAgICAgICB0aGlzLmVuZCAlPSB0aGlzLnRyYWlsRWxlbWVudHMubGVuZ3RoO1xuICAgICAgICByZXR1cm4gdGhpcy50cmFpbEVsZW1lbnRzW25ld0VsZUxvY107XG4gICAgfVxuXG4gICAgaXRlcmF0ZUVsZW1lbnQgKHRhcmdldCwgZiwgcCwgZHQpIHtcbiAgICAgICAgY29uc3QgZW5kID0gdGhpcy5zdGFydCA+PSB0aGlzLmVuZCA/IHRoaXMuZW5kICsgdGhpcy50cmFpbEVsZW1lbnRzLmxlbmd0aCA6IHRoaXMuZW5kO1xuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5zdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZih0YXJnZXQsIHRoaXMudHJhaWxFbGVtZW50c1tpICUgdGhpcy50cmFpbEVsZW1lbnRzLmxlbmd0aF0sIHAsIGR0KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnQrKztcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0ICU9IHRoaXMudHJhaWxFbGVtZW50cy5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc3RhcnQgPT09IGVuZCkge1xuICAgICAgICAgICAgdGhpcy5zdGFydCA9IC0xO1xuICAgICAgICAgICAgdGhpcy5lbmQgPSAtMTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvdW50ICgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhcnQgPCB0aGlzLmVuZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW5kIC0gdGhpcy5zdGFydDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyYWlsRWxlbWVudHMubGVuZ3RoICsgdGhpcy5lbmQgLSB0aGlzLnN0YXJ0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXIgKCkge1xuICAgICAgICB0aGlzLnN0YXJ0ID0gLTE7XG4gICAgICAgIHRoaXMuZW5kID0gLTE7XG4gICAgfVxufVxuXG5AY2NjbGFzcygnY2MuVHJhaWxNb2R1bGUnKVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhaWxNb2R1bGUge1xuXG4gICAgQHByb3BlcnR5XG4gICAgX2VuYWJsZSA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZW5hYmxlIG9mIHRyYWlsTW9kdWxlLlxuICAgICAqICEjemgg5piv5ZCm5ZCv55SoXG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSBlbmFibGVcbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBnZXQgZW5hYmxlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VuYWJsZTtcbiAgICB9XG5cbiAgICBzZXQgZW5hYmxlICh2YWwpIHtcbiAgICAgICAgaWYgKHZhbCkge1xuICAgICAgICAgICAgdGhpcy5fY3JlYXRlVHJhaWxEYXRhKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsICYmICF0aGlzLl9lbmFibGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2VuYWJsZSA9IHZhbDtcbiAgICAgICAgICAgIHRoaXMuX3BhcnRpY2xlU3lzdGVtLl9hc3NlbWJsZXIuX3VwZGF0ZVRyYWlsTWF0ZXJpYWwoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2VuYWJsZSA9IHZhbDtcbiAgICAgICAgdGhpcy5fcGFydGljbGVTeXN0ZW0uX2Fzc2VtYmxlci5fdXBkYXRlVHJhaWxFbmFibGUodGhpcy5fZW5hYmxlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgaG93IHBhcnRpY2xlcyBnZW5lcmF0ZSB0cmFqZWN0b3JpZXMuXG4gICAgICogISN6aCDorr7lrprnspLlrZDnlJ/miJDovajov7nnmoTmlrnlvI/jgIJcbiAgICAgKiBAcHJvcGVydHkge1RyYWlsTW9kZX0gbW9kZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IFRyYWlsTW9kZSxcbiAgICB9KVxuICAgIG1vZGUgPSBUcmFpbE1vZGUuUGFydGljbGVzO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBMaWZlIGN5Y2xlIG9mIHRyYWplY3RvcnkuXG4gICAgICogISN6aCDovajov7nlrZjlnKjnmoTnlJ/lkb3lkajmnJ/jgIJcbiAgICAgKiBAcHJvcGVydHkge0N1cnZlUmFuZ2V9IGxpZmVUaW1lXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogQ3VydmVSYW5nZSxcbiAgICB9KVxuICAgIGxpZmVUaW1lID0gbmV3IEN1cnZlUmFuZ2UoKTtcblxuICAgIEBwcm9wZXJ0eVxuICAgIF9taW5QYXJ0aWNsZURpc3RhbmNlID0gMC4xO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBNaW5pbXVtIHNwYWNpbmcgYmV0d2VlbiBlYWNoIHRyYWNrIHBhcnRpY2xlXG4gICAgICogISN6aCDmr4/kuKrovajov7nnspLlrZDkuYvpl7TnmoTmnIDlsI/pl7Tot53jgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gbWluUGFydGljbGVEaXN0YW5jZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eVxuICAgIGdldCBtaW5QYXJ0aWNsZURpc3RhbmNlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21pblBhcnRpY2xlRGlzdGFuY2U7XG4gICAgfVxuXG4gICAgc2V0IG1pblBhcnRpY2xlRGlzdGFuY2UgKHZhbCkge1xuICAgICAgICB0aGlzLl9taW5QYXJ0aWNsZURpc3RhbmNlID0gdmFsO1xuICAgICAgICB0aGlzLl9taW5TcXVhcmVkRGlzdGFuY2UgPSB2YWwgKiB2YWw7XG4gICAgfVxuXG4gICAgQHByb3BlcnR5XG4gICAgX3NwYWNlID0gU3BhY2UuV29ybGQ7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBjb29yZGluYXRlIHN5c3RlbSBvZiB0cmFqZWN0b3JpZXMuXG4gICAgICogISN6aCDovajov7norr7lrprml7bnmoTlnZDmoIfns7vjgIJcbiAgICAgKiBAcHJvcGVydHkge1NwYWNlfSBzcGFjZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IFNwYWNlLFxuICAgIH0pXG4gICAgZ2V0IHNwYWNlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NwYWNlO1xuICAgIH1cblxuICAgIHNldCBzcGFjZSAodmFsKSB7XG4gICAgICAgIHRoaXMuX3NwYWNlID0gdmFsO1xuICAgICAgICBpZiAodGhpcy5fcGFydGljbGVTeXN0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMuX3BhcnRpY2xlU3lzdGVtLl9hc3NlbWJsZXIuX3VwZGF0ZVRyYWlsTWF0ZXJpYWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gV2hldGhlciB0aGUgcGFydGljbGUgaXRzZWxmIGV4aXN0cy5cbiAgICAgKiAhI3poIOeykuWtkOacrOi6q+aYr+WQpuWtmOWcqOOAglxuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZXhpc3RXaXRoUGFydGljbGVzXG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgZXhpc3RXaXRoUGFydGljbGVzID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHRoZSB0ZXh0dXJlIGZpbGwgbWV0aG9kXG4gICAgICogISN6aCDorr7lrprnurnnkIbloavlhYXmlrnlvI/jgIJcbiAgICAgKiBAcHJvcGVydHkge1RleHR1cmVNb2RlfSB0ZXh0dXJlTW9kZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IFRleHR1cmVNb2RlLFxuICAgIH0pXG4gICAgdGV4dHVyZU1vZGUgPSBUZXh0dXJlTW9kZS5TdHJldGNoO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBXaGV0aGVyIHRvIHVzZSBwYXJ0aWNsZSB3aWR0aFxuICAgICAqICEjemgg5piv5ZCm5L2/55So57KS5a2Q55qE5a695bqm44CCXG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSB3aWR0aEZyb21QYXJ0aWNsZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eVxuICAgIHdpZHRoRnJvbVBhcnRpY2xlID0gdHJ1ZTtcblxuXG4gICAgLyoqXG4gICAgICogISNlbiBDdXJ2ZXMgdGhhdCBjb250cm9sIHRyYWNrIGxlbmd0aFxuICAgICAqICEjemgg5o6n5Yi26L2o6L+56ZW/5bqm55qE5puy57q/44CCXG4gICAgICogQHByb3BlcnR5IHtDdXJ2ZVJhbmdlfSB3aWR0aFJhdGlvXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogQ3VydmVSYW5nZSxcbiAgICB9KVxuICAgIHdpZHRoUmF0aW8gPSBuZXcgQ3VydmVSYW5nZSgpO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBXaGV0aGVyIHRvIHVzZSBwYXJ0aWNsZSBjb2xvclxuICAgICAqICEjemgg5piv5ZCm5L2/55So57KS5a2Q55qE6aKc6Imy44CCXG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSBjb2xvckZyb21QYXJ0aWNsZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eVxuICAgIGNvbG9yRnJvbVBhcnRpY2xlID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBjb2xvciBvZiB0cmFqZWN0b3JpZXMuXG4gICAgICogISN6aCDovajov7nnmoTpopzoibLjgIJcbiAgICAgKiBAcHJvcGVydHkge0dyYWRpZW50UmFuZ2V9IGNvbG9yT3ZlclRyYWlsXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogR3JhZGllbnRSYW5nZSxcbiAgICB9KVxuICAgIGNvbG9yT3ZlclRyYWlsID0gbmV3IEdyYWRpZW50UmFuZ2UoKTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gVHJhamVjdG9yaWVzIGNvbG9yIG92ZXIgdGltZS5cbiAgICAgKiAhI3poIOi9qOi/uemaj+aXtumXtOWPmOWMlueahOminOiJsuOAglxuICAgICAqIEBwcm9wZXJ0eSB7R3JhZGllbnRSYW5nZX0gY29sb3JPdmVydGltZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IEdyYWRpZW50UmFuZ2UsXG4gICAgfSlcbiAgICBjb2xvck92ZXJ0aW1lID0gbmV3IEdyYWRpZW50UmFuZ2UoKTtcblxuICAgIF9wYXJ0aWNsZVN5c3RlbSA9IG51bGw7XG4gICAgX21pblNxdWFyZWREaXN0YW5jZSA9IDA7XG4gICAgX3ZlcnRTaXplID0gMDtcbiAgICBfdHJhaWxOdW0gPSAwO1xuICAgIF90cmFpbExpZmV0aW1lID0gMDtcbiAgICB2Yk9mZnNldCA9IDA7XG4gICAgaWJPZmZzZXQgPSAwO1xuICAgIF90cmFpbFNlZ21lbnRzID0gbnVsbDtcbiAgICBfcGFydGljbGVUcmFpbCA9IG51bGw7XG4gICAgX2lhID0gbnVsbDtcbiAgICBfZ2Z4VkZtdCA9IG51bGw7XG4gICAgX3ZiRjMyID0gbnVsbDtcbiAgICBfdmJVaW50MzIgPSBudWxsO1xuICAgIF9pQnVmZmVyID0gbnVsbDtcbiAgICBfbmVlZFRyYW5zZm9ybSA9IG51bGw7XG4gICAgX2RlZmF1bHRNYXQgPSBudWxsO1xuICAgIF9tYXRlcmlhbCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHRoaXMuX2dmeFZGbXQgPSBuZXcgZ2Z4LlZlcnRleEZvcm1hdChbXG4gICAgICAgICAgICB7IG5hbWU6IGdmeC5BVFRSX1BPU0lUSU9OLCB0eXBlOiBnZnguQVRUUl9UWVBFX0ZMT0FUMzIsIG51bTogM30sXG4gICAgICAgICAgICB7IG5hbWU6IGdmeC5BVFRSX1RFWF9DT09SRCwgdHlwZTogZ2Z4LkFUVFJfVFlQRV9GTE9BVDMyLCBudW06IDR9LFxuICAgICAgICAgICAgeyBuYW1lOiBnZnguQVRUUl9URVhfQ09PUkQxLCB0eXBlOiBnZnguQVRUUl9UWVBFX0ZMT0FUMzIsIG51bTogM30sXG4gICAgICAgICAgICB7IG5hbWU6IGdmeC5BVFRSX0NPTE9SLCB0eXBlOiBnZnguQVRUUl9UWVBFX1VJTlQ4LCBudW06IDQsIG5vcm1hbGl6ZTogdHJ1ZSB9LFxuICAgICAgICBdKTtcblxuICAgICAgICB0aGlzLl92ZXJ0U2l6ZSA9IHRoaXMuX2dmeFZGbXQuX2J5dGVzO1xuXG4gICAgICAgIHRoaXMuX3BhcnRpY2xlVHJhaWwgPSBuZXcgTWFwVXRpbHMoKTsgLy8gTWFwPFBhcnRpY2xlLCBUcmFpbFNlZ21lbnQ+KCk7XG4gICAgfVxuXG4gICAgb25Jbml0IChwcykge1xuICAgICAgICB0aGlzLl9wYXJ0aWNsZVN5c3RlbSA9IHBzO1xuICAgICAgICB0aGlzLm1pblBhcnRpY2xlRGlzdGFuY2UgPSB0aGlzLl9taW5QYXJ0aWNsZURpc3RhbmNlO1xuICAgICAgICBsZXQgYnVyc3RDb3VudCA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgYiBvZiBwcy5idXJzdHMpIHtcbiAgICAgICAgICAgIGJ1cnN0Q291bnQgKz0gYi5nZXRNYXhDb3VudChwcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5saWZlVGltZS5jb25zdGFudCA9IDE7XG4gICAgICAgIHRoaXMuX3RyYWlsTnVtID0gTWF0aC5jZWlsKHBzLnN0YXJ0TGlmZXRpbWUuZ2V0TWF4KCkgKiB0aGlzLmxpZmVUaW1lLmdldE1heCgpICogNjAgKiAocHMucmF0ZU92ZXJUaW1lLmdldE1heCgpICogcHMuZHVyYXRpb24gKyBidXJzdENvdW50KSk7XG4gICAgICAgIHRoaXMuX3RyYWlsU2VnbWVudHMgPSBuZXcgUG9vbCgoKSA9PiBuZXcgVHJhaWxTZWdtZW50KDEwKSwgTWF0aC5jZWlsKHBzLnJhdGVPdmVyVGltZS5nZXRNYXgoKSAqIHBzLmR1cmF0aW9uKSk7XG4gICAgICAgIGlmICh0aGlzLl9lbmFibGUpIHtcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlID0gdGhpcy5fZW5hYmxlO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlTWF0ZXJpYWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uRW5hYmxlICgpIHtcbiAgICB9XG5cbiAgICBvbkRpc2FibGUgKCkge1xuICAgIH1cblxuICAgIGRlc3Ryb3kgKCkge1xuICAgICAgICBpZiAodGhpcy5fdHJhaWxTZWdtZW50cykge1xuICAgICAgICAgICAgdGhpcy5fdHJhaWxTZWdtZW50cy5jbGVhcigob2JqKSA9PiB7IG9iai50cmFpbEVsZW1lbnRzLmxlbmd0aCA9IDA7IH0pO1xuICAgICAgICAgICAgdGhpcy5fdHJhaWxTZWdtZW50cyA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhciAoKSB7XG4gICAgICAgIGlmICh0aGlzLmVuYWJsZSkge1xuICAgICAgICAgICAgY29uc3QgdHJhaWxJdGVyID0gdGhpcy5fcGFydGljbGVUcmFpbC52YWx1ZXMoKTtcbiAgICAgICAgICAgIGxldCB0cmFpbCA9IHRyYWlsSXRlci5uZXh0KCk7XG4gICAgICAgICAgICB3aGlsZSAoIXRyYWlsLmRvbmUpIHtcbiAgICAgICAgICAgICAgICB0cmFpbC52YWx1ZS5jbGVhcigpO1xuICAgICAgICAgICAgICAgIHRyYWlsID0gdHJhaWxJdGVyLm5leHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3BhcnRpY2xlVHJhaWwuY2xlYXIoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVHJhaWxCdWZmZXIoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9jcmVhdGVUcmFpbERhdGEgKCkge1xuICAgICAgICBsZXQgbW9kZWwgPSB0aGlzLl9wYXJ0aWNsZVN5c3RlbS5fYXNzZW1ibGVyLl9tb2RlbDtcbiAgICAgICAgXG4gICAgICAgIGlmIChtb2RlbCkge1xuICAgICAgICAgICAgbW9kZWwuY3JlYXRlVHJhaWxEYXRhKHRoaXMuX2dmeFZGbXQsIHRoaXMuX3RyYWlsTnVtKTtcblxuICAgICAgICAgICAgbGV0IHN1YkRhdGEgPSBtb2RlbC5fc3ViRGF0YXNbMV07XG4gICAgICAgICAgICB0aGlzLl92YkYzMiA9IHN1YkRhdGEuZ2V0VkRhdGEoKTtcbiAgICAgICAgICAgIHRoaXMuX3ZiVWludDMyID0gc3ViRGF0YS5nZXRWRGF0YShVaW50MzJBcnJheSk7XG4gICAgICAgICAgICB0aGlzLl9pQnVmZmVyID0gc3ViRGF0YS5pRGF0YTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF91cGRhdGVNYXRlcmlhbCAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9wYXJ0aWNsZVN5c3RlbSkge1xuICAgICAgICAgICAgY29uc3QgbWF0ID0gdGhpcy5fcGFydGljbGVTeXN0ZW0udHJhaWxNYXRlcmlhbDtcbiAgICAgICAgICAgIGlmIChtYXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXRlcmlhbCA9IG1hdDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWF0ZXJpYWwgPSB0aGlzLl9wYXJ0aWNsZVN5c3RlbS5fYXNzZW1ibGVyLl9kZWZhdWx0VHJhaWxNYXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGUgKCkge1xuICAgICAgICB0aGlzLl90cmFpbExpZmV0aW1lID0gdGhpcy5saWZlVGltZS5ldmFsdWF0ZSh0aGlzLl9wYXJ0aWNsZVN5c3RlbS5fdGltZSwgMSk7XG4gICAgICAgIGlmICh0aGlzLnNwYWNlID09PSBTcGFjZS5Xb3JsZCAmJiB0aGlzLl9wYXJ0aWNsZVN5c3RlbS5fc2ltdWxhdGlvblNwYWNlID09PSBTcGFjZS5Mb2NhbCkge1xuICAgICAgICAgICAgdGhpcy5fbmVlZFRyYW5zZm9ybSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLl9wYXJ0aWNsZVN5c3RlbS5ub2RlLmdldFdvcmxkTWF0cml4KF90ZW1wX3hmb3JtKTtcbiAgICAgICAgICAgIHRoaXMuX3BhcnRpY2xlU3lzdGVtLm5vZGUuZ2V0V29ybGRSb3RhdGlvbihfdGVtcF9xdWF0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX25lZWRUcmFuc2Zvcm0gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFuaW1hdGUgKHAsIHNjYWxlZER0KSB7XG4gICAgICAgIGlmICghdGhpcy5fdHJhaWxTZWdtZW50cykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCB0cmFpbCA9IHRoaXMuX3BhcnRpY2xlVHJhaWwuZ2V0KHApO1xuICAgICAgICBpZiAoIXRyYWlsKSB7XG4gICAgICAgICAgICB0cmFpbCA9IHRoaXMuX3RyYWlsU2VnbWVudHMuYWxsb2MoKTtcbiAgICAgICAgICAgIHRoaXMuX3BhcnRpY2xlVHJhaWwuc2V0KHAsIHRyYWlsKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbGFzdFNlZyA9IHRyYWlsLmdldEVsZW1lbnQodHJhaWwuZW5kIC0gMSk7XG4gICAgICAgIGlmICh0aGlzLl9uZWVkVHJhbnNmb3JtKSB7XG4gICAgICAgICAgICBWZWMzLnRyYW5zZm9ybU1hdDQoX3RlbXBfVmVjMywgcC5wb3NpdGlvbiwgX3RlbXBfeGZvcm0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgVmVjMy5jb3B5KF90ZW1wX1ZlYzMsIHAucG9zaXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsYXN0U2VnKSB7XG4gICAgICAgICAgICB0cmFpbC5pdGVyYXRlRWxlbWVudCh0aGlzLCB0aGlzLl91cGRhdGVUcmFpbEVsZW1lbnQsIHAsIHNjYWxlZER0KTtcbiAgICAgICAgICAgIGlmIChWZWMzLnNxdWFyZWREaXN0YW5jZShsYXN0U2VnLnBvc2l0aW9uLCBfdGVtcF9WZWMzKSA8IHRoaXMuX21pblNxdWFyZWREaXN0YW5jZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsYXN0U2VnID0gdHJhaWwuYWRkRWxlbWVudCgpO1xuICAgICAgICBpZiAoIWxhc3RTZWcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBWZWMzLmNvcHkobGFzdFNlZy5wb3NpdGlvbiwgX3RlbXBfVmVjMyk7XG4gICAgICAgIGxhc3RTZWcubGlmZXRpbWUgPSAwO1xuICAgICAgICBpZiAodGhpcy53aWR0aEZyb21QYXJ0aWNsZSkge1xuICAgICAgICAgICAgbGFzdFNlZy53aWR0aCA9IHAuc2l6ZS54ICogdGhpcy53aWR0aFJhdGlvLmV2YWx1YXRlKDAsIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGFzdFNlZy53aWR0aCA9IHRoaXMud2lkdGhSYXRpby5ldmFsdWF0ZSgwLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0cmFpbE51bSA9IHRyYWlsLmNvdW50KCk7XG4gICAgICAgIGlmICh0cmFpbE51bSA9PT0gMikge1xuICAgICAgICAgICAgY29uc3QgbGFzdFNlY29uZFRyYWlsID0gdHJhaWwuZ2V0RWxlbWVudCh0cmFpbC5lbmQgLSAyKTtcbiAgICAgICAgICAgIFZlYzMuc3VidHJhY3QobGFzdFNlY29uZFRyYWlsLnZlbG9jaXR5LCBsYXN0U2VnLnBvc2l0aW9uLCBsYXN0U2Vjb25kVHJhaWwucG9zaXRpb24pO1xuICAgICAgICB9IGVsc2UgaWYgKHRyYWlsTnVtID4gMikge1xuICAgICAgICAgICAgY29uc3QgbGFzdFNlY29uZFRyYWlsID0gdHJhaWwuZ2V0RWxlbWVudCh0cmFpbC5lbmQgLSAyKTtcbiAgICAgICAgICAgIGNvbnN0IGxhc3RUaGlyZFRyYWlsID0gdHJhaWwuZ2V0RWxlbWVudCh0cmFpbC5lbmQgLSAzKTtcbiAgICAgICAgICAgIFZlYzMuc3VidHJhY3QoX3RlbXBfVmVjMywgbGFzdFRoaXJkVHJhaWwucG9zaXRpb24sIGxhc3RTZWNvbmRUcmFpbC5wb3NpdGlvbik7XG4gICAgICAgICAgICBWZWMzLnN1YnRyYWN0KF90ZW1wX1ZlYzNfMSwgbGFzdFNlZy5wb3NpdGlvbiwgbGFzdFNlY29uZFRyYWlsLnBvc2l0aW9uKTtcbiAgICAgICAgICAgIFZlYzMuc3VidHJhY3QobGFzdFNlY29uZFRyYWlsLnZlbG9jaXR5LCBfdGVtcF9WZWMzXzEsIF90ZW1wX1ZlYzMpO1xuICAgICAgICAgICAgaWYgKFZlYzMuZXF1YWxzKGNjLlZlYzMuWkVSTywgbGFzdFNlY29uZFRyYWlsLnZlbG9jaXR5KSkge1xuICAgICAgICAgICAgICAgIFZlYzMuY29weShsYXN0U2Vjb25kVHJhaWwudmVsb2NpdHksIF90ZW1wX1ZlYzMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNvbG9yRnJvbVBhcnRpY2xlKSB7XG4gICAgICAgICAgICBsYXN0U2VnLmNvbG9yLnNldChwLmNvbG9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxhc3RTZWcuY29sb3Iuc2V0KHRoaXMuY29sb3JPdmVydGltZS5ldmFsdWF0ZSgwLCAxKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfdXBkYXRlVHJhaWxFbGVtZW50ICh0cmFpbCwgdHJhaWxFbGUsIHAsIGR0KSB7XG4gICAgICAgIHRyYWlsRWxlLmxpZmV0aW1lICs9IGR0O1xuICAgICAgICBpZiAodHJhaWwuY29sb3JGcm9tUGFydGljbGUpIHtcbiAgICAgICAgICAgIHRyYWlsRWxlLmNvbG9yLnNldChwLmNvbG9yKTtcbiAgICAgICAgICAgIHRyYWlsRWxlLmNvbG9yLm11bHRpcGx5KHRyYWlsLmNvbG9yT3ZlcnRpbWUuZXZhbHVhdGUoMS4wIC0gcC5yZW1haW5pbmdMaWZldGltZSAvIHAuc3RhcnRMaWZldGltZSwgMSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHJhaWxFbGUuY29sb3Iuc2V0KHRyYWlsLmNvbG9yT3ZlcnRpbWUuZXZhbHVhdGUoMS4wIC0gcC5yZW1haW5pbmdMaWZldGltZSAvIHAuc3RhcnRMaWZldGltZSwgMSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0cmFpbC53aWR0aEZyb21QYXJ0aWNsZSkge1xuICAgICAgICAgICAgdHJhaWxFbGUud2lkdGggPSBwLnNpemUueCAqIHRyYWlsLndpZHRoUmF0aW8uZXZhbHVhdGUodHJhaWxFbGUubGlmZXRpbWUgLyB0cmFpbC5fdHJhaWxMaWZldGltZSwgMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cmFpbEVsZS53aWR0aCA9IHRyYWlsLndpZHRoUmF0aW8uZXZhbHVhdGUodHJhaWxFbGUubGlmZXRpbWUgLyB0cmFpbC5fdHJhaWxMaWZldGltZSwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRyYWlsRWxlLmxpZmV0aW1lID4gdHJhaWwuX3RyYWlsTGlmZXRpbWU7XG4gICAgfVxuXG4gICAgcmVtb3ZlUGFydGljbGUgKHApIHtcbiAgICAgICAgY29uc3QgdHJhaWwgPSB0aGlzLl9wYXJ0aWNsZVRyYWlsLmdldChwKTtcbiAgICAgICAgaWYgKHRyYWlsICYmIHRoaXMuX3RyYWlsU2VnbWVudHMpIHtcbiAgICAgICAgICAgIHRyYWlsLmNsZWFyKCk7XG4gICAgICAgICAgICB0aGlzLl90cmFpbFNlZ21lbnRzLmZyZWUodHJhaWwpO1xuICAgICAgICAgICAgdGhpcy5fcGFydGljbGVUcmFpbC5kZWxldGUocCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVUcmFpbEJ1ZmZlciAoKSB7XG4gICAgICAgIHRoaXMudmJPZmZzZXQgPSAwO1xuICAgICAgICB0aGlzLmliT2Zmc2V0ID0gMDtcbiAgICAgICAgXG4gICAgICAgIGZvciAoY29uc3QgcCBvZiBBcnJheS5mcm9tKHRoaXMuX3BhcnRpY2xlVHJhaWwua2V5cygpKSkge1xuICAgICAgICAgICAgY29uc3QgdHJhaWxTZWcgPSB0aGlzLl9wYXJ0aWNsZVRyYWlsLmdldChwKTtcbiAgICAgICAgICAgIGlmICh0cmFpbFNlZy5zdGFydCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGluZGV4T2Zmc2V0ID0gdGhpcy52Yk9mZnNldCAqIDQgLyB0aGlzLl92ZXJ0U2l6ZTtcbiAgICAgICAgICAgIGNvbnN0IGVuZCA9IHRyYWlsU2VnLnN0YXJ0ID49IHRyYWlsU2VnLmVuZCA/IHRyYWlsU2VnLmVuZCArIHRyYWlsU2VnLnRyYWlsRWxlbWVudHMubGVuZ3RoIDogdHJhaWxTZWcuZW5kO1xuICAgICAgICAgICAgY29uc3QgdHJhaWxOdW0gPSBlbmQgLSB0cmFpbFNlZy5zdGFydDtcbiAgICAgICAgICAgIC8vIGNvbnN0IGxhc3RTZWdSYXRpbyA9IFZlYzMuZGlzdGFuY2UodHJhaWxTZWcuZ2V0VGFpbEVsZW1lbnQoKSEucG9zaXRpb24sIHAucG9zaXRpb24pIC8gdGhpcy5fbWluUGFydGljbGVEaXN0YW5jZTtcbiAgICAgICAgICAgIGNvbnN0IHRleHRDb29yZFNlZyA9IDEgLyAodHJhaWxOdW0gLyotIDEgKyBsYXN0U2VnUmF0aW8qLyk7XG4gICAgICAgICAgICBjb25zdCBzdGFydFNlZ0VsZSA9IHRyYWlsU2VnLnRyYWlsRWxlbWVudHNbdHJhaWxTZWcuc3RhcnRdO1xuICAgICAgICAgICAgdGhpcy5fZmlsbFZlcnRleEJ1ZmZlcihzdGFydFNlZ0VsZSwgdGhpcy5jb2xvck92ZXJUcmFpbC5ldmFsdWF0ZSgxLCAxKSwgaW5kZXhPZmZzZXQsIDEsIDAsIE5FWFRfVFJJQU5HTEVfSU5ERVgpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IHRyYWlsU2VnLnN0YXJ0ICsgMTsgaSA8IGVuZDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VnRWxlID0gdHJhaWxTZWcudHJhaWxFbGVtZW50c1tpICUgdHJhaWxTZWcudHJhaWxFbGVtZW50cy5sZW5ndGhdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGogPSBpIC0gdHJhaWxTZWcuc3RhcnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fZmlsbFZlcnRleEJ1ZmZlcihzZWdFbGUsIHRoaXMuY29sb3JPdmVyVHJhaWwuZXZhbHVhdGUoMSAtIGogLyB0cmFpbE51bSwgMSksIGluZGV4T2Zmc2V0LCAxIC0gaiAqIHRleHRDb29yZFNlZywgaiwgUFJFX1RSSUFOR0xFX0lOREVYIHwgTkVYVF9UUklBTkdMRV9JTkRFWCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fbmVlZFRyYW5zZm9ybSkge1xuICAgICAgICAgICAgICAgIFZlYzMudHJhbnNmb3JtTWF0NChfdGVtcF90cmFpbEVsZS5wb3NpdGlvbiwgcC5wb3NpdGlvbiwgX3RlbXBfeGZvcm0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBWZWMzLmNvcHkoX3RlbXBfdHJhaWxFbGUucG9zaXRpb24sIHAucG9zaXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRyYWlsTnVtID09PSAxIHx8IHRyYWlsTnVtID09PSAyKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGFzdFNlY29uZFRyYWlsID0gdHJhaWxTZWcuZ2V0RWxlbWVudCh0cmFpbFNlZy5lbmQgLSAxKTtcbiAgICAgICAgICAgICAgICBWZWMzLnN1YnRyYWN0KGxhc3RTZWNvbmRUcmFpbC52ZWxvY2l0eSwgX3RlbXBfdHJhaWxFbGUucG9zaXRpb24sIGxhc3RTZWNvbmRUcmFpbC5wb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgdGhpcy5fdmJGMzJbdGhpcy52Yk9mZnNldCAtIHRoaXMuX3ZlcnRTaXplIC8gNCAtIDRdID0gbGFzdFNlY29uZFRyYWlsLnZlbG9jaXR5Lng7XG4gICAgICAgICAgICAgICAgdGhpcy5fdmJGMzJbdGhpcy52Yk9mZnNldCAtIHRoaXMuX3ZlcnRTaXplIC8gNCAtIDNdID0gbGFzdFNlY29uZFRyYWlsLnZlbG9jaXR5Lnk7XG4gICAgICAgICAgICAgICAgdGhpcy5fdmJGMzJbdGhpcy52Yk9mZnNldCAtIHRoaXMuX3ZlcnRTaXplIC8gNCAtIDJdID0gbGFzdFNlY29uZFRyYWlsLnZlbG9jaXR5Lno7XG4gICAgICAgICAgICAgICAgdGhpcy5fdmJGMzJbdGhpcy52Yk9mZnNldCAtIDRdID0gbGFzdFNlY29uZFRyYWlsLnZlbG9jaXR5Lng7XG4gICAgICAgICAgICAgICAgdGhpcy5fdmJGMzJbdGhpcy52Yk9mZnNldCAtIDNdID0gbGFzdFNlY29uZFRyYWlsLnZlbG9jaXR5Lnk7XG4gICAgICAgICAgICAgICAgdGhpcy5fdmJGMzJbdGhpcy52Yk9mZnNldCAtIDJdID0gbGFzdFNlY29uZFRyYWlsLnZlbG9jaXR5Lno7XG4gICAgICAgICAgICAgICAgVmVjMy5zdWJ0cmFjdChfdGVtcF90cmFpbEVsZS52ZWxvY2l0eSwgX3RlbXBfdHJhaWxFbGUucG9zaXRpb24sIGxhc3RTZWNvbmRUcmFpbC5wb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2hlY2tEaXJlY3Rpb25SZXZlcnNlKF90ZW1wX3RyYWlsRWxlLCBsYXN0U2Vjb25kVHJhaWwpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0cmFpbE51bSA+IDIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBsYXN0U2Vjb25kVHJhaWwgPSB0cmFpbFNlZy5nZXRFbGVtZW50KHRyYWlsU2VnLmVuZCAtIDEpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RUaGlyZFRyYWlsID0gdHJhaWxTZWcuZ2V0RWxlbWVudCh0cmFpbFNlZy5lbmQgLSAyKTtcbiAgICAgICAgICAgICAgICBWZWMzLnN1YnRyYWN0KF90ZW1wX1ZlYzMsIGxhc3RUaGlyZFRyYWlsLnBvc2l0aW9uLCBsYXN0U2Vjb25kVHJhaWwucG9zaXRpb24pO1xuICAgICAgICAgICAgICAgIFZlYzMuc3VidHJhY3QoX3RlbXBfVmVjM18xLCBfdGVtcF90cmFpbEVsZS5wb3NpdGlvbiwgbGFzdFNlY29uZFRyYWlsLnBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICBWZWMzLnN1YnRyYWN0KGxhc3RTZWNvbmRUcmFpbC52ZWxvY2l0eSwgX3RlbXBfVmVjM18xLCBfdGVtcF9WZWMzKTtcbiAgICAgICAgICAgICAgICBWZWMzLm5vcm1hbGl6ZShsYXN0U2Vjb25kVHJhaWwudmVsb2NpdHksIGxhc3RTZWNvbmRUcmFpbC52ZWxvY2l0eSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2hlY2tEaXJlY3Rpb25SZXZlcnNlKGxhc3RTZWNvbmRUcmFpbCwgbGFzdFRoaXJkVHJhaWwpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3ZiRjMyW3RoaXMudmJPZmZzZXQgLSB0aGlzLl92ZXJ0U2l6ZSAvIDQgLSA0XSA9IGxhc3RTZWNvbmRUcmFpbC52ZWxvY2l0eS54O1xuICAgICAgICAgICAgICAgIHRoaXMuX3ZiRjMyW3RoaXMudmJPZmZzZXQgLSB0aGlzLl92ZXJ0U2l6ZSAvIDQgLSAzXSA9IGxhc3RTZWNvbmRUcmFpbC52ZWxvY2l0eS55O1xuICAgICAgICAgICAgICAgIHRoaXMuX3ZiRjMyW3RoaXMudmJPZmZzZXQgLSB0aGlzLl92ZXJ0U2l6ZSAvIDQgLSAyXSA9IGxhc3RTZWNvbmRUcmFpbC52ZWxvY2l0eS56O1xuICAgICAgICAgICAgICAgIHRoaXMuX3ZiRjMyW3RoaXMudmJPZmZzZXQgLSA0XSA9IGxhc3RTZWNvbmRUcmFpbC52ZWxvY2l0eS54O1xuICAgICAgICAgICAgICAgIHRoaXMuX3ZiRjMyW3RoaXMudmJPZmZzZXQgLSAzXSA9IGxhc3RTZWNvbmRUcmFpbC52ZWxvY2l0eS55O1xuICAgICAgICAgICAgICAgIHRoaXMuX3ZiRjMyW3RoaXMudmJPZmZzZXQgLSAyXSA9IGxhc3RTZWNvbmRUcmFpbC52ZWxvY2l0eS56O1xuICAgICAgICAgICAgICAgIFZlYzMuc3VidHJhY3QoX3RlbXBfdHJhaWxFbGUudmVsb2NpdHksIF90ZW1wX3RyYWlsRWxlLnBvc2l0aW9uLCBsYXN0U2Vjb25kVHJhaWwucG9zaXRpb24pO1xuICAgICAgICAgICAgICAgIFZlYzMubm9ybWFsaXplKF90ZW1wX3RyYWlsRWxlLnZlbG9jaXR5LCBfdGVtcF90cmFpbEVsZS52ZWxvY2l0eSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2hlY2tEaXJlY3Rpb25SZXZlcnNlKF90ZW1wX3RyYWlsRWxlLCBsYXN0U2Vjb25kVHJhaWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RlbXBfdHJhaWxFbGUud2lkdGggPSBwLnNpemUueDtcbiAgICAgICAgICAgIF90ZW1wX3RyYWlsRWxlLmNvbG9yID0gcC5jb2xvcjtcblxuICAgICAgICAgICAgaWYgKFZlYzMuZXF1YWxzKF90ZW1wX3RyYWlsRWxlLnZlbG9jaXR5LCBjYy5WZWMzLlpFUk8pKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pYk9mZnNldCAtPSAzO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9maWxsVmVydGV4QnVmZmVyKF90ZW1wX3RyYWlsRWxlLCB0aGlzLmNvbG9yT3ZlclRyYWlsLmV2YWx1YXRlKDAsIDEpLCBpbmRleE9mZnNldCwgMCwgdHJhaWxOdW0sIFBSRV9UUklBTkdMRV9JTkRFWCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdXBkYXRlSUEodGhpcy5pYk9mZnNldCk7XG4gICAgfVxuXG4gICAgX2ZpbGxWZXJ0ZXhCdWZmZXIgKHRyYWlsU2VnLCBjb2xvck1vZGlmZXIsIGluZGV4T2Zmc2V0LCB4VGV4Q29vcmQsIHRyYWlsRWxlSWR4LCBpbmRleFNldCkge1xuICAgICAgICB0aGlzLl92YkYzMlt0aGlzLnZiT2Zmc2V0KytdID0gdHJhaWxTZWcucG9zaXRpb24ueDtcbiAgICAgICAgdGhpcy5fdmJGMzJbdGhpcy52Yk9mZnNldCsrXSA9IHRyYWlsU2VnLnBvc2l0aW9uLnk7XG4gICAgICAgIHRoaXMuX3ZiRjMyW3RoaXMudmJPZmZzZXQrK10gPSB0cmFpbFNlZy5wb3NpdGlvbi56O1xuICAgICAgICB0aGlzLl92YkYzMlt0aGlzLnZiT2Zmc2V0KytdID0gMDtcbiAgICAgICAgdGhpcy5fdmJGMzJbdGhpcy52Yk9mZnNldCsrXSA9IHRyYWlsU2VnLndpZHRoO1xuICAgICAgICB0aGlzLl92YkYzMlt0aGlzLnZiT2Zmc2V0KytdID0geFRleENvb3JkO1xuICAgICAgICB0aGlzLl92YkYzMlt0aGlzLnZiT2Zmc2V0KytdID0gMDtcbiAgICAgICAgdGhpcy5fdmJGMzJbdGhpcy52Yk9mZnNldCsrXSA9IHRyYWlsU2VnLnZlbG9jaXR5Lng7XG4gICAgICAgIHRoaXMuX3ZiRjMyW3RoaXMudmJPZmZzZXQrK10gPSB0cmFpbFNlZy52ZWxvY2l0eS55O1xuICAgICAgICB0aGlzLl92YkYzMlt0aGlzLnZiT2Zmc2V0KytdID0gdHJhaWxTZWcudmVsb2NpdHkuejtcbiAgICAgICAgX3RlbXBfY29sb3Iuc2V0KHRyYWlsU2VnLmNvbG9yKTtcbiAgICAgICAgX3RlbXBfY29sb3IubXVsdGlwbHkoY29sb3JNb2RpZmVyKTtcbiAgICAgICAgdGhpcy5fdmJVaW50MzJbdGhpcy52Yk9mZnNldCsrXSA9IF90ZW1wX2NvbG9yLl92YWw7XG4gICAgICAgIHRoaXMuX3ZiRjMyW3RoaXMudmJPZmZzZXQrK10gPSB0cmFpbFNlZy5wb3NpdGlvbi54O1xuICAgICAgICB0aGlzLl92YkYzMlt0aGlzLnZiT2Zmc2V0KytdID0gdHJhaWxTZWcucG9zaXRpb24ueTtcbiAgICAgICAgdGhpcy5fdmJGMzJbdGhpcy52Yk9mZnNldCsrXSA9IHRyYWlsU2VnLnBvc2l0aW9uLno7XG4gICAgICAgIHRoaXMuX3ZiRjMyW3RoaXMudmJPZmZzZXQrK10gPSAxO1xuICAgICAgICB0aGlzLl92YkYzMlt0aGlzLnZiT2Zmc2V0KytdID0gdHJhaWxTZWcud2lkdGg7XG4gICAgICAgIHRoaXMuX3ZiRjMyW3RoaXMudmJPZmZzZXQrK10gPSB4VGV4Q29vcmQ7XG4gICAgICAgIHRoaXMuX3ZiRjMyW3RoaXMudmJPZmZzZXQrK10gPSAxO1xuICAgICAgICB0aGlzLl92YkYzMlt0aGlzLnZiT2Zmc2V0KytdID0gdHJhaWxTZWcudmVsb2NpdHkueDtcbiAgICAgICAgdGhpcy5fdmJGMzJbdGhpcy52Yk9mZnNldCsrXSA9IHRyYWlsU2VnLnZlbG9jaXR5Lnk7XG4gICAgICAgIHRoaXMuX3ZiRjMyW3RoaXMudmJPZmZzZXQrK10gPSB0cmFpbFNlZy52ZWxvY2l0eS56O1xuICAgICAgICB0aGlzLl92YlVpbnQzMlt0aGlzLnZiT2Zmc2V0KytdID0gX3RlbXBfY29sb3IuX3ZhbDtcbiAgICAgICAgaWYgKGluZGV4U2V0ICYgUFJFX1RSSUFOR0xFX0lOREVYKSB7XG4gICAgICAgICAgICB0aGlzLl9pQnVmZmVyW3RoaXMuaWJPZmZzZXQrK10gPSBpbmRleE9mZnNldCArIDIgKiB0cmFpbEVsZUlkeDtcbiAgICAgICAgICAgIHRoaXMuX2lCdWZmZXJbdGhpcy5pYk9mZnNldCsrXSA9IGluZGV4T2Zmc2V0ICsgMiAqIHRyYWlsRWxlSWR4IC0gMTtcbiAgICAgICAgICAgIHRoaXMuX2lCdWZmZXJbdGhpcy5pYk9mZnNldCsrXSA9IGluZGV4T2Zmc2V0ICsgMiAqIHRyYWlsRWxlSWR4ICsgMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5kZXhTZXQgJiBORVhUX1RSSUFOR0xFX0lOREVYKSB7XG4gICAgICAgICAgICB0aGlzLl9pQnVmZmVyW3RoaXMuaWJPZmZzZXQrK10gPSBpbmRleE9mZnNldCArIDIgKiB0cmFpbEVsZUlkeDtcbiAgICAgICAgICAgIHRoaXMuX2lCdWZmZXJbdGhpcy5pYk9mZnNldCsrXSA9IGluZGV4T2Zmc2V0ICsgMiAqIHRyYWlsRWxlSWR4ICsgMTtcbiAgICAgICAgICAgIHRoaXMuX2lCdWZmZXJbdGhpcy5pYk9mZnNldCsrXSA9IGluZGV4T2Zmc2V0ICsgMiAqIHRyYWlsRWxlSWR4ICsgMjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF91cGRhdGVJQSAoY291bnQpIHtcbiAgICAgICAgaWYgKHRoaXMuX3BhcnRpY2xlU3lzdGVtICYmIHRoaXMuX3BhcnRpY2xlU3lzdGVtLl9hc3NlbWJsZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhcnRpY2xlU3lzdGVtLl9hc3NlbWJsZXIudXBkYXRlSUEoMSwgY291bnQsIHRydWUsIHRydWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2NoZWNrRGlyZWN0aW9uUmV2ZXJzZSAoY3VyckVsZW1lbnQsIHByZXZFbGVtZW50KSB7XG4gICAgICAgIGlmIChWZWMzLmRvdChjdXJyRWxlbWVudC52ZWxvY2l0eSwgcHJldkVsZW1lbnQudmVsb2NpdHkpIDwgRElSRUNUSU9OX1RIUkVTSE9MRCkge1xuICAgICAgICAgICAgY3VyckVsZW1lbnQuZGlyZWN0aW9uID0gMSAtIHByZXZFbGVtZW50LmRpcmVjdGlvbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN1cnJFbGVtZW50LmRpcmVjdGlvbiA9IHByZXZFbGVtZW50LmRpcmVjdGlvbjtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==