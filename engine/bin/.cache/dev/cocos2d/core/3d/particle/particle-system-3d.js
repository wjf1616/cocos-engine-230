
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/particle/particle-system-3d.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _valueTypes = require("../../value-types");

var _utils = require("../../value-types/utils");

var _CCMaterial = _interopRequireDefault(require("../../assets/material/CCMaterial"));

var _colorOvertime = _interopRequireDefault(require("./animator/color-overtime"));

var _curveRange = _interopRequireWildcard(require("./animator/curve-range"));

var _forceOvertime = _interopRequireDefault(require("./animator/force-overtime"));

var _gradientRange = _interopRequireDefault(require("./animator/gradient-range"));

var _limitVelocityOvertime = _interopRequireDefault(require("./animator/limit-velocity-overtime"));

var _rotationOvertime = _interopRequireDefault(require("./animator/rotation-overtime"));

var _sizeOvertime = _interopRequireDefault(require("./animator/size-overtime"));

var _textureAnimation = _interopRequireDefault(require("./animator/texture-animation"));

var _velocityOvertime = _interopRequireDefault(require("./animator/velocity-overtime"));

var _burst = _interopRequireDefault(require("./burst"));

var _shapeModule = _interopRequireDefault(require("./emitter/shape-module"));

var _enum = require("./enum");

var _particleGeneralFunction = require("./particle-general-function");

var _trail = _interopRequireDefault(require("./renderer/trail"));

var _CCMesh = _interopRequireDefault(require("../../mesh/CCMesh"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _temp;

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

var _require = require('../../platform/CCClassDecorator'),
    ccclass = _require.ccclass,
    menu = _require.menu,
    property = _require.property,
    executeInEditMode = _require.executeInEditMode,
    executionOrder = _require.executionOrder;

var RenderComponent = require('../../components/CCRenderComponent');

var _world_mat = new _valueTypes.Mat4();
/**
 * !#en The ParticleSystem3D Component.
 * !#zh 3D 粒子组件
 * @class ParticleSystem3D
 * @extends RenderComponent
 */


var ParticleSystem3D = (_dec = ccclass('cc.ParticleSystem3D'), _dec2 = menu('i18n:MAIN_MENU.component.renderers/ParticleSystem3D'), _dec3 = executionOrder(99), _dec4 = property({
  type: _enum.Space
}), _dec5 = property({
  type: _curveRange["default"]
}), _dec6 = property({
  type: _curveRange["default"]
}), _dec7 = property({
  type: _gradientRange["default"]
}), _dec8 = property({
  type: _enum.Space
}), _dec9 = property({
  type: _curveRange["default"]
}), _dec10 = property({
  type: _curveRange["default"],
  range: [-1, 1]
}), _dec11 = property({
  type: _curveRange["default"],
  range: [-1, 1],
  radian: true
}), _dec12 = property({
  type: _curveRange["default"],
  range: [-1, 1]
}), _dec13 = property({
  type: _curveRange["default"]
}), _dec14 = property({
  type: _curveRange["default"]
}), _dec15 = property({
  type: [_burst["default"]]
}), _dec16 = property({
  type: [_CCMaterial["default"]],
  displayName: 'Materials',
  visible: false,
  override: true
}), _dec17 = property({
  type: _shapeModule["default"]
}), _dec18 = property({
  type: _colorOvertime["default"]
}), _dec19 = property({
  type: _sizeOvertime["default"]
}), _dec20 = property({
  type: _velocityOvertime["default"]
}), _dec21 = property({
  type: _forceOvertime["default"]
}), _dec22 = property({
  type: _limitVelocityOvertime["default"]
}), _dec23 = property({
  type: _rotationOvertime["default"]
}), _dec24 = property({
  type: _textureAnimation["default"]
}), _dec25 = property({
  type: _trail["default"]
}), _dec26 = property({
  type: _enum.RenderMode
}), _dec27 = property({
  type: _CCMesh["default"]
}), _dec28 = property({
  type: _CCMaterial["default"]
}), _dec29 = property({
  type: _CCMaterial["default"]
}), _dec(_class = _dec2(_class = _dec3(_class = executeInEditMode(_class = (_class2 = (_temp =
/*#__PURE__*/
function (_RenderComponent) {
  _inheritsLoose(ParticleSystem3D, _RenderComponent);

  _createClass(ParticleSystem3D, [{
    key: "capacity",

    /**
     * !#en The run time of particle.
     * !#zh 粒子系统运行时间
     * @property {Number} duration
     */

    /**
     * !#en The maximum number of particles that a particle system can generate.
     * !#zh 粒子系统能生成的最大粒子数量
     * @property {Number} capacity
     */
    get: function get() {
      return this._capacity;
    },
    set: function set(val) {
      this._capacity = val;

      if (this._assembler) {
        this._assembler.setCapacity(this._capacity);
      }
    }
    /**
     * !#en Whether the particle system loops.
     * !#zh 粒子系统是否循环播放
     * @property {Boolean} loop
     */

  }, {
    key: "prewarm",

    /**
     * !#en When selected, the particle system will start playing after one round has been played (only effective when loop is enabled).
     * !#zh 选中之后，粒子系统会以已播放完一轮之后的状态开始播放（仅当循环播放启用时有效）
     * @property {Boolean} prewarm
     */
    get: function get() {
      return this._prewarm;
    },
    set: function set(val) {
      if (val === true && this.loop === false) {// console.warn('prewarm only works if loop is also enabled.');
      }

      this._prewarm = val;
    }
  }, {
    key: "simulationSpace",

    /**
     * !#en The coordinate system in which the particle system is located.<br>
     * World coordinates (does not change when the position of other objects changes)<br>
     * Local coordinates (moving as the position of the parent node changes)<br>
     * Custom coordinates (moving with the position of a custom node)
     * !#zh 选择粒子系统所在的坐标系<br>
     * 世界坐标（不随其他物体位置改变而变换）<br>
     * 局部坐标（跟随父节点位置改变而移动）<br>
     * 自定坐标（跟随自定义节点的位置改变而移动）
     * @property {Space} simulationSpace
     */
    get: function get() {
      return this._simulationSpace;
    },
    set: function set(val) {
      if (val !== this._simulationSpace) {
        this._simulationSpace = val;

        this._assembler._updateMaterialParams();

        this._assembler._updateTrailMaterial();
      }
    }
    /**
     * !#en Controlling the update speed of the entire particle system.
     * !#zh 控制整个粒子系统的更新速度。
     * @property {Number} simulationSpeed
     */

  }, {
    key: "materials",
    get: function get() {
      // if we don't create an array copy, the editor will modify the original array directly.
      return this._materials;
    },
    set: function set(val) {
      this._materials = val;

      this._activateMaterial();
    } // shpae module

    /**
     * !#en Particle emitter module
     * !#zh 粒子发射器模块
     * @property {ShapeModule} shapeModule
     */

  }, {
    key: "renderMode",

    /**
     * !#en Particle generation mode
     * !#zh 设定粒子生成模式
     * @property {RenderMode} renderMode
     */
    get: function get() {
      return this._renderMode;
    },
    set: function set(val) {
      if (this._renderMode === val) {
        return;
      }

      this._renderMode = val;

      this._assembler._setVertexAttrib();

      this._assembler._updateModel();

      this._assembler._updateMaterialParams();
    }
  }, {
    key: "velocityScale",

    /**
     * !#en When the particle generation mode is StrecthedBillboard, in the direction of movement of the particles is stretched by velocity magnitude
     * !#zh 在粒子生成方式为 StrecthedBillboard 时,对粒子在运动方向上按速度大小进行拉伸
     * @property {Number} velocityScale
     */
    get: function get() {
      return this._velocityScale;
    },
    set: function set(val) {
      this._velocityScale = val;

      this._assembler._updateMaterialParams();
    }
  }, {
    key: "lengthScale",

    /**
     * !#en When the particle generation method is StrecthedBillboard, the particles are stretched according to the particle size in the direction of motion
     * !#zh 在粒子生成方式为 StrecthedBillboard 时,对粒子在运动方向上按粒子大小进行拉伸
     * @property {Number} lengthScale
     */
    get: function get() {
      return this._lengthScale;
    },
    set: function set(val) {
      this._lengthScale = val;

      this._assembler._updateMaterialParams();
    }
  }, {
    key: "mesh",

    /**
     * !#en Particle model
     * !#zh 粒子模型
     * @property {Mesh} mesh
     */
    get: function get() {
      return this._mesh;
    },
    set: function set(val) {
      this._mesh = val;

      this._assembler._updateModel();
    }
    /**
     * !#en Particle material
     * !#zh 粒子材质
     * @property {Material} particleMaterial
     */

  }, {
    key: "particleMaterial",
    get: function get() {
      return this.getMaterial(0);
    },
    set: function set(val) {
      this.setMaterial(0, val);

      this._onMaterialModified(0, val);
    }
    /**
     * !#en Particle trail material
     * !#zh 粒子轨迹材质
     * @property {Material} trailMaterial
     */

  }, {
    key: "trailMaterial",
    get: function get() {
      return this.getMaterial(1);
    },
    set: function set(val) {
      this.setMaterial(1, val);

      this._onMaterialModified(0, val);
    }
  }]);

  // array of { emitter: ParticleSystem3D, type: 'birth', 'collision' or 'death'}
  function ParticleSystem3D() {
    var _this;

    _this = _RenderComponent.call(this) || this;

    _initializerDefineProperty(_this, "duration", _descriptor, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_capacity", _descriptor2, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "loop", _descriptor3, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "playOnAwake", _descriptor4, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_prewarm", _descriptor5, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_simulationSpace", _descriptor6, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "simulationSpeed", _descriptor7, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "startDelay", _descriptor8, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "startLifetime", _descriptor9, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "startColor", _descriptor10, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "scaleSpace", _descriptor11, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "startSize", _descriptor12, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "startSpeed", _descriptor13, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "startRotation", _descriptor14, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "gravityModifier", _descriptor15, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "rateOverTime", _descriptor16, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "rateOverDistance", _descriptor17, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "bursts", _descriptor18, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "shapeModule", _descriptor19, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "colorOverLifetimeModule", _descriptor20, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "sizeOvertimeModule", _descriptor21, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "velocityOvertimeModule", _descriptor22, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "forceOvertimeModule", _descriptor23, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "limitVelocityOvertimeModule", _descriptor24, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "rotationOvertimeModule", _descriptor25, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "textureAnimationModule", _descriptor26, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "trailModule", _descriptor27, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_renderMode", _descriptor28, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_velocityScale", _descriptor29, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_lengthScale", _descriptor30, _assertThisInitialized(_this));

    _initializerDefineProperty(_this, "_mesh", _descriptor31, _assertThisInitialized(_this));

    _this._isPlaying = void 0;
    _this._isPaused = void 0;
    _this._isStopped = void 0;
    _this._isEmitting = void 0;
    _this._time = void 0;
    _this._emitRateTimeCounter = void 0;
    _this._emitRateDistanceCounter = void 0;
    _this._oldWPos = void 0;
    _this._curWPos = void 0;
    _this._customData1 = void 0;
    _this._customData2 = void 0;
    _this._subEmitters = void 0;
    _this.rateOverTime.constant = 10;
    _this.startLifetime.constant = 5;
    _this.startSize.constant = 1;
    _this.startSpeed.constant = 5; // internal status

    _this._isPlaying = false;
    _this._isPaused = false;
    _this._isStopped = true;
    _this._isEmitting = false;
    _this._time = 0.0; // playback position in seconds.

    _this._emitRateTimeCounter = 0.0;
    _this._emitRateDistanceCounter = 0.0;
    _this._oldWPos = new _valueTypes.Vec3(0, 0, 0);
    _this._curWPos = new _valueTypes.Vec3(0, 0, 0);
    _this._customData1 = new _valueTypes.Vec2(0, 0);
    _this._customData2 = new _valueTypes.Vec2(0, 0);
    _this._subEmitters = []; // array of { emitter: ParticleSystemComponent, type: 'birth', 'collision' or 'death'}

    return _this;
  }

  var _proto = ParticleSystem3D.prototype;

  _proto.onLoad = function onLoad() {
    this._assembler.onInit(this);

    this.shapeModule.onInit(this);
    this.trailModule.onInit(this);
    this.textureAnimationModule.onInit(this);

    this._resetPosition(); // this._system.add(this);

  };

  _proto._onMaterialModified = function _onMaterialModified(index, material) {
    this._assembler._onMaterialModified(index, material);
  };

  _proto._onRebuildPSO = function _onRebuildPSO(index, material) {
    this._assembler._onRebuildPSO(index, material);
  } // TODO: fastforward current particle system by simulating particles over given period of time, then pause it.
  // simulate(time, withChildren, restart, fixedTimeStep) {
  // }

  /**
   * !#en Playing particle effects
   * !#zh 播放粒子效果
   * @method play
   */
  ;

  _proto.play = function play() {
    if (this._isPaused) {
      this._isPaused = false;
    }

    if (this._isStopped) {
      this._isStopped = false;
    }

    this._isPlaying = true;
    this._isEmitting = true;

    this._resetPosition(); // prewarm


    if (this._prewarm) {
      this._prewarmSystem();
    }
  }
  /**
   * !#en Pause particle effect
   * !#zh 暂停播放粒子效果
   * @method pause
   */
  ;

  _proto.pause = function pause() {
    if (this._isStopped) {
      console.warn('pause(): particle system is already stopped.');
      return;
    }

    if (this._isPlaying) {
      this._isPlaying = false;
    }

    this._isPaused = true;
  }
  /**
   * !#en Stop particle effect
   * !#zh 停止播放粒子效果
   * @method stop
   */
  ;

  _proto.stop = function stop() {
    if (this._isPlaying || this._isPaused) {
      this.clear();
    }

    if (this._isPlaying) {
      this._isPlaying = false;
    }

    if (this._isPaused) {
      this._isPaused = false;
    }

    this._time = 0.0;
    this._emitRateTimeCounter = 0.0;
    this._emitRateDistanceCounter = 0.0;
    this._isStopped = true;
  } // remove all particles from current particle system.

  /**
   * !#en Remove all particle effect
   * !#zh 将所有粒子从粒子系统中清除
   * @method clear
   */
  ;

  _proto.clear = function clear() {
    if (this.enabledInHierarchy) {
      this._assembler.clear();

      this.trailModule.clear();
    }
  };

  _proto.getParticleCount = function getParticleCount() {
    return this._assembler.getParticleCount();
  };

  _proto.setCustomData1 = function setCustomData1(x, y) {
    _valueTypes.Vec2.set(this._customData1, x, y);
  };

  _proto.setCustomData2 = function setCustomData2(x, y) {
    _valueTypes.Vec2.set(this._customData2, x, y);
  };

  _proto.onDestroy = function onDestroy() {
    // this._system.remove(this);
    this._assembler.onDestroy();

    this.trailModule.destroy();
  };

  _proto.onEnable = function onEnable() {
    _RenderComponent.prototype.onEnable.call(this);

    if (this.playOnAwake) {
      this.play();
    }

    this._assembler.onEnable();

    this.trailModule.onEnable();
  };

  _proto.onDisable = function onDisable() {
    _RenderComponent.prototype.onDisable.call(this);

    this._assembler.onDisable();

    this.trailModule.onDisable();
  };

  _proto.update = function update(dt) {
    var scaledDeltaTime = dt * this.simulationSpeed;

    if (this._isPlaying) {
      this._time += scaledDeltaTime; // excute emission

      this._emit(scaledDeltaTime); // simulation, update particles.


      if (this._assembler._updateParticles(scaledDeltaTime) === 0 && !this._isEmitting) {
        this.stop();
      } // update render data


      this._assembler.updateParticleBuffer(); // update trail


      if (this.trailModule.enable) {
        this.trailModule.updateTrailBuffer();
      }
    }
  };

  _proto.emit = function emit(count, dt) {
    if (this._simulationSpace === _enum.Space.World) {
      this.node.getWorldMatrix(_world_mat);
    }

    for (var i = 0; i < count; ++i) {
      var particle = this._assembler._getFreeParticle();

      if (particle === null) {
        return;
      }

      var rand = (0, _valueTypes.pseudoRandom)((0, _valueTypes.randomRangeInt)(0, _utils.INT_MAX));

      if (this.shapeModule.enable) {
        this.shapeModule.emit(particle);
      } else {
        _valueTypes.Vec3.set(particle.position, 0, 0, 0);

        _valueTypes.Vec3.copy(particle.velocity, _particleGeneralFunction.particleEmitZAxis);
      }

      if (this.textureAnimationModule.enable) {
        this.textureAnimationModule.init(particle);
      }

      _valueTypes.Vec3.scale(particle.velocity, particle.velocity, this.startSpeed.evaluate(this._time / this.duration, rand));

      switch (this._simulationSpace) {
        case _enum.Space.Local:
          break;

        case _enum.Space.World:
          _valueTypes.Vec3.transformMat4(particle.position, particle.position, _world_mat);

          var worldRot = new _valueTypes.Quat();
          this.node.getWorldRotation(worldRot);

          _valueTypes.Vec3.transformQuat(particle.velocity, particle.velocity, worldRot);

          break;

        case _enum.Space.Custom:
          // TODO:
          break;
      }

      _valueTypes.Vec3.copy(particle.ultimateVelocity, particle.velocity); // apply startRotation. now 2D only.


      _valueTypes.Vec3.set(particle.rotation, 0, 0, this.startRotation.evaluate(this._time / this.duration, rand)); // apply startSize. now 2D only.


      _valueTypes.Vec3.set(particle.startSize, this.startSize.evaluate(this._time / this.duration, rand), 1, 1);

      particle.startSize.y = particle.startSize.x;

      _valueTypes.Vec3.copy(particle.size, particle.startSize); // apply startColor.


      particle.startColor.set(this.startColor.evaluate(this._time / this.duration, rand));
      particle.color.set(particle.startColor); // apply startLifetime.

      particle.startLifetime = this.startLifetime.evaluate(this._time / this.duration, rand) + dt;
      particle.remainingLifetime = particle.startLifetime;
      particle.randomSeed = (0, _valueTypes.randomRangeInt)(0, 233280);

      this._assembler._setNewParticle(particle);
    } // end of particles forLoop.

  } // initialize particle system as though it had already completed a full cycle.
  ;

  _proto._prewarmSystem = function _prewarmSystem() {
    this.startDelay.mode = _curveRange.Mode.Constant; // clear startDelay.

    this.startDelay.constant = 0;
    var dt = 1.0; // should use varying value?

    var cnt = this.duration / dt;

    for (var i = 0; i < cnt; ++i) {
      this._time += dt;

      this._emit(dt);

      this._assembler._updateParticles(dt);
    }
  } // internal function
  ;

  _proto._emit = function _emit(dt) {
    // emit particles.
    var startDelay = this.startDelay.evaluate(0, 1);

    if (this._time > startDelay) {
      if (this._time > this.duration + startDelay) {
        // this._time = startDelay; // delay will not be applied from the second loop.(Unity)
        // this._emitRateTimeCounter = 0.0;
        // this._emitRateDistanceCounter = 0.0;
        if (!this.loop) {
          this._isEmitting = false;
          return;
        }
      } // emit by rateOverTime


      this._emitRateTimeCounter += this.rateOverTime.evaluate(this._time / this.duration, 1) * dt;

      if (this._emitRateTimeCounter > 1 && this._isEmitting) {
        var emitNum = Math.floor(this._emitRateTimeCounter);
        this._emitRateTimeCounter -= emitNum;
        this.emit(emitNum, dt);
      } // emit by rateOverDistance


      this.node.getWorldPosition(this._curWPos);

      var distance = _valueTypes.Vec3.distance(this._curWPos, this._oldWPos);

      _valueTypes.Vec3.copy(this._oldWPos, this._curWPos);

      this._emitRateDistanceCounter += distance * this.rateOverDistance.evaluate(this._time / this.duration, 1);

      if (this._emitRateDistanceCounter > 1 && this._isEmitting) {
        var _emitNum = Math.floor(this._emitRateDistanceCounter);

        this._emitRateDistanceCounter -= _emitNum;
        this.emit(_emitNum, dt);
      } // bursts


      for (var _iterator = this.bursts, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var burst = _ref;
        burst.update(this, dt);
      }
    }
  };

  _proto._activateMaterial = function _activateMaterial() {};

  _proto._resetPosition = function _resetPosition() {
    this.node.getWorldPosition(this._oldWPos);

    _valueTypes.Vec3.copy(this._curWPos, this._oldWPos);
  };

  _proto.addSubEmitter = function addSubEmitter(subEmitter) {
    this._subEmitters.push(subEmitter);
  };

  _proto.removeSubEmitter = function removeSubEmitter(idx) {
    this._subEmitters.splice(this._subEmitters.indexOf(idx), 1);
  };

  _proto.addBurst = function addBurst(burst) {
    this.bursts.push(burst);
  };

  _proto.removeBurst = function removeBurst(idx) {
    this.bursts.splice(this.bursts.indexOf(idx), 1);
  };

  _proto._checkBacth = function _checkBacth() {};

  _createClass(ParticleSystem3D, [{
    key: "isPlaying",
    get: function get() {
      return this._isPlaying;
    }
  }, {
    key: "isPaused",
    get: function get() {
      return this._isPaused;
    }
  }, {
    key: "isStopped",
    get: function get() {
      return this._isStopped;
    }
  }, {
    key: "isEmitting",
    get: function get() {
      return this._isEmitting;
    }
  }, {
    key: "time",
    get: function get() {
      return this._time;
    }
  }]);

  return ParticleSystem3D;
}(RenderComponent), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "duration", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 5.0;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_capacity", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 100;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "capacity", [property], Object.getOwnPropertyDescriptor(_class2.prototype, "capacity"), _class2.prototype), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "loop", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "playOnAwake", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_prewarm", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "prewarm", [property], Object.getOwnPropertyDescriptor(_class2.prototype, "prewarm"), _class2.prototype), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_simulationSpace", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return _enum.Space.Local;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "simulationSpace", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "simulationSpace"), _class2.prototype), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "simulationSpeed", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1.0;
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "startDelay", [_dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "startLifetime", [_dec6], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "startColor", [_dec7], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _gradientRange["default"]();
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "scaleSpace", [_dec8], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return _enum.Space.Local;
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "startSize", [_dec9], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "startSpeed", [_dec10], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "startRotation", [_dec11], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "gravityModifier", [_dec12], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "rateOverTime", [_dec13], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "rateOverDistance", [_dec14], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "bursts", [_dec15], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Array();
  }
}), _applyDecoratedDescriptor(_class2.prototype, "materials", [_dec16], Object.getOwnPropertyDescriptor(_class2.prototype, "materials"), _class2.prototype), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "shapeModule", [_dec17], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _shapeModule["default"]();
  }
}), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "colorOverLifetimeModule", [_dec18], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _colorOvertime["default"]();
  }
}), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "sizeOvertimeModule", [_dec19], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _sizeOvertime["default"]();
  }
}), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "velocityOvertimeModule", [_dec20], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _velocityOvertime["default"]();
  }
}), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, "forceOvertimeModule", [_dec21], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _forceOvertime["default"]();
  }
}), _descriptor24 = _applyDecoratedDescriptor(_class2.prototype, "limitVelocityOvertimeModule", [_dec22], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _limitVelocityOvertime["default"]();
  }
}), _descriptor25 = _applyDecoratedDescriptor(_class2.prototype, "rotationOvertimeModule", [_dec23], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _rotationOvertime["default"]();
  }
}), _descriptor26 = _applyDecoratedDescriptor(_class2.prototype, "textureAnimationModule", [_dec24], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _textureAnimation["default"]();
  }
}), _descriptor27 = _applyDecoratedDescriptor(_class2.prototype, "trailModule", [_dec25], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _trail["default"]();
  }
}), _descriptor28 = _applyDecoratedDescriptor(_class2.prototype, "_renderMode", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return _enum.RenderMode.Billboard;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "renderMode", [_dec26], Object.getOwnPropertyDescriptor(_class2.prototype, "renderMode"), _class2.prototype), _descriptor29 = _applyDecoratedDescriptor(_class2.prototype, "_velocityScale", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "velocityScale", [property], Object.getOwnPropertyDescriptor(_class2.prototype, "velocityScale"), _class2.prototype), _descriptor30 = _applyDecoratedDescriptor(_class2.prototype, "_lengthScale", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "lengthScale", [property], Object.getOwnPropertyDescriptor(_class2.prototype, "lengthScale"), _class2.prototype), _descriptor31 = _applyDecoratedDescriptor(_class2.prototype, "_mesh", [property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return null;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "mesh", [_dec27], Object.getOwnPropertyDescriptor(_class2.prototype, "mesh"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "particleMaterial", [_dec28], Object.getOwnPropertyDescriptor(_class2.prototype, "particleMaterial"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "trailMaterial", [_dec29], Object.getOwnPropertyDescriptor(_class2.prototype, "trailMaterial"), _class2.prototype)), _class2)) || _class) || _class) || _class) || _class);
exports["default"] = ParticleSystem3D;
cc.ParticleSystem3D = ParticleSystem3D;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhcnRpY2xlLXN5c3RlbS0zZC50cyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiY2NjbGFzcyIsIm1lbnUiLCJwcm9wZXJ0eSIsImV4ZWN1dGVJbkVkaXRNb2RlIiwiZXhlY3V0aW9uT3JkZXIiLCJSZW5kZXJDb21wb25lbnQiLCJfd29ybGRfbWF0IiwiTWF0NCIsIlBhcnRpY2xlU3lzdGVtM0QiLCJ0eXBlIiwiU3BhY2UiLCJDdXJ2ZVJhbmdlIiwiR3JhZGllbnRSYW5nZSIsInJhbmdlIiwicmFkaWFuIiwiQnVyc3QiLCJNYXRlcmlhbCIsImRpc3BsYXlOYW1lIiwidmlzaWJsZSIsIm92ZXJyaWRlIiwiU2hhcGVNb2R1bGUiLCJDb2xvck92ZXJMaWZldGltZU1vZHVsZSIsIlNpemVPdmVydGltZU1vZHVsZSIsIlZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUiLCJGb3JjZU92ZXJ0aW1lTW9kdWxlIiwiTGltaXRWZWxvY2l0eU92ZXJ0aW1lTW9kdWxlIiwiUm90YXRpb25PdmVydGltZU1vZHVsZSIsIlRleHR1cmVBbmltYXRpb25Nb2R1bGUiLCJUcmFpbE1vZHVsZSIsIlJlbmRlck1vZGUiLCJNZXNoIiwiX2NhcGFjaXR5IiwidmFsIiwiX2Fzc2VtYmxlciIsInNldENhcGFjaXR5IiwiX3ByZXdhcm0iLCJsb29wIiwiX3NpbXVsYXRpb25TcGFjZSIsIl91cGRhdGVNYXRlcmlhbFBhcmFtcyIsIl91cGRhdGVUcmFpbE1hdGVyaWFsIiwiX21hdGVyaWFscyIsIl9hY3RpdmF0ZU1hdGVyaWFsIiwiX3JlbmRlck1vZGUiLCJfc2V0VmVydGV4QXR0cmliIiwiX3VwZGF0ZU1vZGVsIiwiX3ZlbG9jaXR5U2NhbGUiLCJfbGVuZ3RoU2NhbGUiLCJfbWVzaCIsImdldE1hdGVyaWFsIiwic2V0TWF0ZXJpYWwiLCJfb25NYXRlcmlhbE1vZGlmaWVkIiwiX2lzUGxheWluZyIsIl9pc1BhdXNlZCIsIl9pc1N0b3BwZWQiLCJfaXNFbWl0dGluZyIsIl90aW1lIiwiX2VtaXRSYXRlVGltZUNvdW50ZXIiLCJfZW1pdFJhdGVEaXN0YW5jZUNvdW50ZXIiLCJfb2xkV1BvcyIsIl9jdXJXUG9zIiwiX2N1c3RvbURhdGExIiwiX2N1c3RvbURhdGEyIiwiX3N1YkVtaXR0ZXJzIiwicmF0ZU92ZXJUaW1lIiwiY29uc3RhbnQiLCJzdGFydExpZmV0aW1lIiwic3RhcnRTaXplIiwic3RhcnRTcGVlZCIsIlZlYzMiLCJWZWMyIiwib25Mb2FkIiwib25Jbml0Iiwic2hhcGVNb2R1bGUiLCJ0cmFpbE1vZHVsZSIsInRleHR1cmVBbmltYXRpb25Nb2R1bGUiLCJfcmVzZXRQb3NpdGlvbiIsImluZGV4IiwibWF0ZXJpYWwiLCJfb25SZWJ1aWxkUFNPIiwicGxheSIsIl9wcmV3YXJtU3lzdGVtIiwicGF1c2UiLCJjb25zb2xlIiwid2FybiIsInN0b3AiLCJjbGVhciIsImVuYWJsZWRJbkhpZXJhcmNoeSIsImdldFBhcnRpY2xlQ291bnQiLCJzZXRDdXN0b21EYXRhMSIsIngiLCJ5Iiwic2V0Iiwic2V0Q3VzdG9tRGF0YTIiLCJvbkRlc3Ryb3kiLCJkZXN0cm95Iiwib25FbmFibGUiLCJwbGF5T25Bd2FrZSIsIm9uRGlzYWJsZSIsInVwZGF0ZSIsImR0Iiwic2NhbGVkRGVsdGFUaW1lIiwic2ltdWxhdGlvblNwZWVkIiwiX2VtaXQiLCJfdXBkYXRlUGFydGljbGVzIiwidXBkYXRlUGFydGljbGVCdWZmZXIiLCJlbmFibGUiLCJ1cGRhdGVUcmFpbEJ1ZmZlciIsImVtaXQiLCJjb3VudCIsIldvcmxkIiwibm9kZSIsImdldFdvcmxkTWF0cml4IiwiaSIsInBhcnRpY2xlIiwiX2dldEZyZWVQYXJ0aWNsZSIsInJhbmQiLCJJTlRfTUFYIiwicG9zaXRpb24iLCJjb3B5IiwidmVsb2NpdHkiLCJwYXJ0aWNsZUVtaXRaQXhpcyIsImluaXQiLCJzY2FsZSIsImV2YWx1YXRlIiwiZHVyYXRpb24iLCJMb2NhbCIsInRyYW5zZm9ybU1hdDQiLCJ3b3JsZFJvdCIsIlF1YXQiLCJnZXRXb3JsZFJvdGF0aW9uIiwidHJhbnNmb3JtUXVhdCIsIkN1c3RvbSIsInVsdGltYXRlVmVsb2NpdHkiLCJyb3RhdGlvbiIsInN0YXJ0Um90YXRpb24iLCJzaXplIiwic3RhcnRDb2xvciIsImNvbG9yIiwicmVtYWluaW5nTGlmZXRpbWUiLCJyYW5kb21TZWVkIiwiX3NldE5ld1BhcnRpY2xlIiwic3RhcnREZWxheSIsIm1vZGUiLCJNb2RlIiwiQ29uc3RhbnQiLCJjbnQiLCJlbWl0TnVtIiwiTWF0aCIsImZsb29yIiwiZ2V0V29ybGRQb3NpdGlvbiIsImRpc3RhbmNlIiwicmF0ZU92ZXJEaXN0YW5jZSIsImJ1cnN0cyIsImJ1cnN0IiwiYWRkU3ViRW1pdHRlciIsInN1YkVtaXR0ZXIiLCJwdXNoIiwicmVtb3ZlU3ViRW1pdHRlciIsImlkeCIsInNwbGljZSIsImluZGV4T2YiLCJhZGRCdXJzdCIsInJlbW92ZUJ1cnN0IiwiX2NoZWNrQmFjdGgiLCJBcnJheSIsIkJpbGxib2FyZCIsImNjIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7ZUFFc0VBLE9BQU8sQ0FBQyxpQ0FBRDtJQUFyRUMsbUJBQUFBO0lBQVNDLGdCQUFBQTtJQUFNQyxvQkFBQUE7SUFBVUMsNkJBQUFBO0lBQW1CQywwQkFBQUE7O0FBQ3BELElBQU1DLGVBQWUsR0FBR04sT0FBTyxDQUFDLG9DQUFELENBQS9COztBQUVBLElBQU1PLFVBQVUsR0FBRyxJQUFJQyxnQkFBSixFQUFuQjtBQUVBOzs7Ozs7OztJQVVxQkMsMkJBSnBCUixPQUFPLENBQUMscUJBQUQsV0FDUEMsSUFBSSxDQUFDLHFEQUFELFdBQ0pHLGNBQWMsQ0FBQyxFQUFELFdBOEVWRixRQUFRLENBQUM7QUFDTk8sRUFBQUEsSUFBSSxFQUFFQztBQURBLENBQUQsV0E0QlJS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Ozs7RUE3eEJ5Q2xELG1HQU16Q0g7Ozs7O1dBQ1U7OzhFQUVWQTs7Ozs7V0FDVzs7OERBTVhBLG9LQWlCQUE7Ozs7O1dBQ007O2dGQU9OQTs7Ozs7V0FDYTs7NkVBRWJBOzs7OztXQUNVOzs2REFNVkEsK0tBWUFBOzs7OztXQUNrQlEsWUFBTW1IOzt3UEFnQ3hCM0g7Ozs7O1dBQ2lCOzs7Ozs7O1dBVUwsSUFBSVMsc0JBQUo7Ozs7Ozs7V0FVRyxJQUFJQSxzQkFBSjs7Ozs7OztXQVVILElBQUlDLHlCQUFKOzs7Ozs7O1dBVUFGLFlBQU1tSDs7Ozs7OztXQVVQLElBQUlsSCxzQkFBSjs7Ozs7OztXQVdDLElBQUlBLHNCQUFKOzs7Ozs7O1dBWUcsSUFBSUEsc0JBQUo7Ozs7Ozs7V0FXRSxJQUFJQSxzQkFBSjs7Ozs7OztXQVdILElBQUlBLHNCQUFKOzs7Ozs7O1dBVUksSUFBSUEsc0JBQUo7Ozs7Ozs7V0FVVixJQUFJeUosS0FBSjs7Ozs7OztXQTJCSyxJQUFJaEosdUJBQUo7Ozs7Ozs7V0FXWSxJQUFJQyx5QkFBSjs7Ozs7OztXQVdMLElBQUlDLHdCQUFKOzs7Ozs7O1dBVUksSUFBSUMsNEJBQUo7Ozs7Ozs7V0FVSCxJQUFJQyx5QkFBSjs7Ozs7OztXQVVRLElBQUlDLGlDQUFKOzs7Ozs7O1dBVUwsSUFBSUMsNEJBQUo7Ozs7Ozs7V0FVQSxJQUFJQyw0QkFBSjs7Ozs7OztXQVVYLElBQUlDLGlCQUFKOztpRkFFYjFCOzs7OztXQUNhMkIsaUJBQVd3STs7K09Bd0J4Qm5LOzs7OztXQUNnQjs7bUVBT2hCQSxrTEFVQUE7Ozs7O1dBQ2M7O2lFQU1kQSx5S0FVQUE7Ozs7O1dBQ087Ozs7QUFnYVpvSyxFQUFFLENBQUM5SixnQkFBSCxHQUFzQkEsZ0JBQXRCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTkgWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgeyBNYXQ0LCBwc2V1ZG9SYW5kb20sIFF1YXQsIHJhbmRvbVJhbmdlSW50LCBWZWMyLCBWZWMzIH0gZnJvbSAnLi4vLi4vdmFsdWUtdHlwZXMnO1xuaW1wb3J0IHsgSU5UX01BWCB9IGZyb20gJy4uLy4uL3ZhbHVlLXR5cGVzL3V0aWxzJztcbmltcG9ydCBNYXRlcmlhbCBmcm9tICcuLi8uLi9hc3NldHMvbWF0ZXJpYWwvQ0NNYXRlcmlhbCc7XG5pbXBvcnQgQ29sb3JPdmVyTGlmZXRpbWVNb2R1bGUgZnJvbSAnLi9hbmltYXRvci9jb2xvci1vdmVydGltZSc7XG5pbXBvcnQgQ3VydmVSYW5nZSwgeyBNb2RlIH1mcm9tICcuL2FuaW1hdG9yL2N1cnZlLXJhbmdlJztcbmltcG9ydCBGb3JjZU92ZXJ0aW1lTW9kdWxlIGZyb20gJy4vYW5pbWF0b3IvZm9yY2Utb3ZlcnRpbWUnO1xuaW1wb3J0IEdyYWRpZW50UmFuZ2UgZnJvbSAnLi9hbmltYXRvci9ncmFkaWVudC1yYW5nZSc7XG5pbXBvcnQgTGltaXRWZWxvY2l0eU92ZXJ0aW1lTW9kdWxlIGZyb20gJy4vYW5pbWF0b3IvbGltaXQtdmVsb2NpdHktb3ZlcnRpbWUnO1xuaW1wb3J0IFJvdGF0aW9uT3ZlcnRpbWVNb2R1bGUgZnJvbSAnLi9hbmltYXRvci9yb3RhdGlvbi1vdmVydGltZSc7XG5pbXBvcnQgU2l6ZU92ZXJ0aW1lTW9kdWxlIGZyb20gJy4vYW5pbWF0b3Ivc2l6ZS1vdmVydGltZSc7XG5pbXBvcnQgVGV4dHVyZUFuaW1hdGlvbk1vZHVsZSBmcm9tICcuL2FuaW1hdG9yL3RleHR1cmUtYW5pbWF0aW9uJztcbmltcG9ydCBWZWxvY2l0eU92ZXJ0aW1lTW9kdWxlIGZyb20gJy4vYW5pbWF0b3IvdmVsb2NpdHktb3ZlcnRpbWUnO1xuaW1wb3J0IEJ1cnN0IGZyb20gJy4vYnVyc3QnO1xuaW1wb3J0IFNoYXBlTW9kdWxlIGZyb20gJy4vZW1pdHRlci9zaGFwZS1tb2R1bGUnO1xuaW1wb3J0IHsgUmVuZGVyTW9kZSwgU3BhY2UgfSBmcm9tICcuL2VudW0nO1xuaW1wb3J0IHsgcGFydGljbGVFbWl0WkF4aXMgfSBmcm9tICcuL3BhcnRpY2xlLWdlbmVyYWwtZnVuY3Rpb24nO1xuaW1wb3J0IFRyYWlsTW9kdWxlIGZyb20gJy4vcmVuZGVyZXIvdHJhaWwnO1xuaW1wb3J0IE1lc2ggZnJvbSAnLi4vLi4vbWVzaC9DQ01lc2gnO1xuXG5jb25zdCB7IGNjY2xhc3MsIG1lbnUsIHByb3BlcnR5LCBleGVjdXRlSW5FZGl0TW9kZSwgZXhlY3V0aW9uT3JkZXJ9ID0gcmVxdWlyZSgnLi4vLi4vcGxhdGZvcm0vQ0NDbGFzc0RlY29yYXRvcicpXG5jb25zdCBSZW5kZXJDb21wb25lbnQgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL0NDUmVuZGVyQ29tcG9uZW50Jyk7XG5cbmNvbnN0IF93b3JsZF9tYXQgPSBuZXcgTWF0NCgpO1xuXG4vKipcbiAqICEjZW4gVGhlIFBhcnRpY2xlU3lzdGVtM0QgQ29tcG9uZW50LlxuICogISN6aCAzRCDnspLlrZDnu4Tku7ZcbiAqIEBjbGFzcyBQYXJ0aWNsZVN5c3RlbTNEXG4gKiBAZXh0ZW5kcyBSZW5kZXJDb21wb25lbnRcbiAqL1xuQGNjY2xhc3MoJ2NjLlBhcnRpY2xlU3lzdGVtM0QnKVxuQG1lbnUoJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC5yZW5kZXJlcnMvUGFydGljbGVTeXN0ZW0zRCcpXG5AZXhlY3V0aW9uT3JkZXIoOTkpXG5AZXhlY3V0ZUluRWRpdE1vZGVcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnRpY2xlU3lzdGVtM0QgZXh0ZW5kcyBSZW5kZXJDb21wb25lbnQge1xuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHJ1biB0aW1lIG9mIHBhcnRpY2xlLlxuICAgICAqICEjemgg57KS5a2Q57O757uf6L+Q6KGM5pe26Ze0XG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGR1cmF0aW9uXG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgZHVyYXRpb24gPSA1LjA7XG5cbiAgICBAcHJvcGVydHlcbiAgICBfY2FwYWNpdHkgPSAxMDA7XG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgbWF4aW11bSBudW1iZXIgb2YgcGFydGljbGVzIHRoYXQgYSBwYXJ0aWNsZSBzeXN0ZW0gY2FuIGdlbmVyYXRlLlxuICAgICAqICEjemgg57KS5a2Q57O757uf6IO955Sf5oiQ55qE5pyA5aSn57KS5a2Q5pWw6YePXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGNhcGFjaXR5XG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgZ2V0IGNhcGFjaXR5ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhcGFjaXR5O1xuICAgIH1cblxuICAgIHNldCBjYXBhY2l0eSAodmFsKSB7XG4gICAgICAgIHRoaXMuX2NhcGFjaXR5ID0gdmFsO1xuICAgICAgICBpZiAodGhpcy5fYXNzZW1ibGVyKSB7XG4gICAgICAgICAgICB0aGlzLl9hc3NlbWJsZXIuc2V0Q2FwYWNpdHkodGhpcy5fY2FwYWNpdHkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBXaGV0aGVyIHRoZSBwYXJ0aWNsZSBzeXN0ZW0gbG9vcHMuXG4gICAgICogISN6aCDnspLlrZDns7vnu5/mmK/lkKblvqrnjq/mkq3mlL5cbiAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGxvb3BcbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBsb29wID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gV2hldGhlciB0aGUgcGFydGljbGVzIHN0YXJ0IHBsYXlpbmcgYXV0b21hdGljYWxseSBhZnRlciBsb2FkZWQuXG4gICAgICogISN6aCDnspLlrZDns7vnu5/liqDovb3lkI7mmK/lkKboh6rliqjlvIDlp4vmkq3mlL5cbiAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IHBsYXlPbkF3YWtlXG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgcGxheU9uQXdha2UgPSB0cnVlO1xuXG4gICAgQHByb3BlcnR5XG4gICAgX3ByZXdhcm0gPSBmYWxzZTtcbiAgICAvKipcbiAgICAgKiAhI2VuIFdoZW4gc2VsZWN0ZWQsIHRoZSBwYXJ0aWNsZSBzeXN0ZW0gd2lsbCBzdGFydCBwbGF5aW5nIGFmdGVyIG9uZSByb3VuZCBoYXMgYmVlbiBwbGF5ZWQgKG9ubHkgZWZmZWN0aXZlIHdoZW4gbG9vcCBpcyBlbmFibGVkKS5cbiAgICAgKiAhI3poIOmAieS4reS5i+WQju+8jOeykuWtkOezu+e7n+S8muS7peW3suaSreaUvuWujOS4gOi9ruS5i+WQjueahOeKtuaAgeW8gOWni+aSreaUvu+8iOS7heW9k+W+queOr+aSreaUvuWQr+eUqOaXtuacieaViO+8iVxuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gcHJld2FybVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eVxuICAgIGdldCBwcmV3YXJtICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ByZXdhcm07XG4gICAgfVxuXG4gICAgc2V0IHByZXdhcm0gKHZhbCkge1xuICAgICAgICBpZiAodmFsID09PSB0cnVlICYmIHRoaXMubG9vcCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUud2FybigncHJld2FybSBvbmx5IHdvcmtzIGlmIGxvb3AgaXMgYWxzbyBlbmFibGVkLicpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3ByZXdhcm0gPSB2YWw7XG4gICAgfVxuXG4gICAgQHByb3BlcnR5XG4gICAgX3NpbXVsYXRpb25TcGFjZSA9IFNwYWNlLkxvY2FsO1xuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGNvb3JkaW5hdGUgc3lzdGVtIGluIHdoaWNoIHRoZSBwYXJ0aWNsZSBzeXN0ZW0gaXMgbG9jYXRlZC48YnI+XG4gICAgICogV29ybGQgY29vcmRpbmF0ZXMgKGRvZXMgbm90IGNoYW5nZSB3aGVuIHRoZSBwb3NpdGlvbiBvZiBvdGhlciBvYmplY3RzIGNoYW5nZXMpPGJyPlxuICAgICAqIExvY2FsIGNvb3JkaW5hdGVzIChtb3ZpbmcgYXMgdGhlIHBvc2l0aW9uIG9mIHRoZSBwYXJlbnQgbm9kZSBjaGFuZ2VzKTxicj5cbiAgICAgKiBDdXN0b20gY29vcmRpbmF0ZXMgKG1vdmluZyB3aXRoIHRoZSBwb3NpdGlvbiBvZiBhIGN1c3RvbSBub2RlKVxuICAgICAqICEjemgg6YCJ5oup57KS5a2Q57O757uf5omA5Zyo55qE5Z2Q5qCH57O7PGJyPlxuICAgICAqIOS4lueVjOWdkOagh++8iOS4jemaj+WFtuS7lueJqeS9k+S9jee9ruaUueWPmOiAjOWPmOaNou+8iTxicj5cbiAgICAgKiDlsYDpg6jlnZDmoIfvvIjot5/pmo/niLboioLngrnkvY3nva7mlLnlj5jogIznp7vliqjvvIk8YnI+XG4gICAgICog6Ieq5a6a5Z2Q5qCH77yI6Lef6ZqP6Ieq5a6a5LmJ6IqC54K555qE5L2N572u5pS55Y+Y6ICM56e75Yqo77yJXG4gICAgICogQHByb3BlcnR5IHtTcGFjZX0gc2ltdWxhdGlvblNwYWNlXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogU3BhY2UsXG4gICAgfSlcbiAgICBnZXQgc2ltdWxhdGlvblNwYWNlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NpbXVsYXRpb25TcGFjZTtcbiAgICB9XG5cbiAgICBzZXQgc2ltdWxhdGlvblNwYWNlICh2YWwpIHtcbiAgICAgICAgaWYgKHZhbCAhPT0gdGhpcy5fc2ltdWxhdGlvblNwYWNlKSB7XG4gICAgICAgICAgICB0aGlzLl9zaW11bGF0aW9uU3BhY2UgPSB2YWw7XG4gICAgICAgICAgICB0aGlzLl9hc3NlbWJsZXIuX3VwZGF0ZU1hdGVyaWFsUGFyYW1zKCk7XG4gICAgICAgICAgICB0aGlzLl9hc3NlbWJsZXIuX3VwZGF0ZVRyYWlsTWF0ZXJpYWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gQ29udHJvbGxpbmcgdGhlIHVwZGF0ZSBzcGVlZCBvZiB0aGUgZW50aXJlIHBhcnRpY2xlIHN5c3RlbS5cbiAgICAgKiAhI3poIOaOp+WItuaVtOS4queykuWtkOezu+e7n+eahOabtOaWsOmAn+W6puOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBzaW11bGF0aW9uU3BlZWRcbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBzaW11bGF0aW9uU3BlZWQgPSAxLjA7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIERlbGF5IHBhcnRpY2xlIGVtaXNzaW9uIHRpbWUgYWZ0ZXIgcGFydGljbGUgc3lzdGVtIHN0YXJ0cyBydW5uaW5nLlxuICAgICAqICEjemgg57KS5a2Q57O757uf5byA5aeL6L+Q6KGM5ZCO77yM5bu26L+f57KS5a2Q5Y+R5bCE55qE5pe26Ze044CCXG4gICAgICogQHByb3BlcnR5IHtDdXJ2ZVJhbmdlfSBzdGFydERlbGF5XG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogQ3VydmVSYW5nZSxcbiAgICB9KVxuICAgIHN0YXJ0RGVsYXkgPSBuZXcgQ3VydmVSYW5nZSgpO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBQYXJ0aWNsZSBsaWZlIGN5Y2xl44CCXG4gICAgICogISN6aCDnspLlrZDnlJ/lkb3lkajmnJ/jgIJcbiAgICAgKiBAcHJvcGVydHkge0N1cnZlUmFuZ2V9IHN0YXJ0TGlmZXRpbWVcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBDdXJ2ZVJhbmdlLFxuICAgIH0pXG4gICAgc3RhcnRMaWZldGltZSA9IG5ldyBDdXJ2ZVJhbmdlKCk7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFBhcnRpY2xlIGluaXRpYWwgY29sb3JcbiAgICAgKiAhI3poIOeykuWtkOWIneWni+minOiJslxuICAgICAqIEBwcm9wZXJ0eSB7R3JhZGllbnRSYW5nZX0gc3RhcnRDb2xvclxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IEdyYWRpZW50UmFuZ2UsXG4gICAgfSlcbiAgICBzdGFydENvbG9yID0gbmV3IEdyYWRpZW50UmFuZ2UoKTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gUGFydGljbGUgc2NhbGUgc3BhY2VcbiAgICAgKiAhI3poIOe8qeaUvuepuumXtFxuICAgICAqIEBwcm9wZXJ0eSB7U3BhY2V9IHNjYWxlU3BhY2VcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBTcGFjZSxcbiAgICB9KVxuICAgIHNjYWxlU3BhY2UgPSBTcGFjZS5Mb2NhbDtcblxuICAgIC8qKlxuICAgICAqICEjZW4gSW5pdGlhbCBwYXJ0aWNsZSBzaXplXG4gICAgICogISN6aCDnspLlrZDliJ3lp4vlpKflsI9cbiAgICAgKiBAcHJvcGVydHkge0N1cnZlUmFuZ2V9IHN0YXJ0U2l6ZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IEN1cnZlUmFuZ2UsXG4gICAgfSlcbiAgICBzdGFydFNpemUgPSBuZXcgQ3VydmVSYW5nZSgpO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBJbml0aWFsIHBhcnRpY2xlIHNwZWVkXG4gICAgICogISN6aCDnspLlrZDliJ3lp4vpgJ/luqZcbiAgICAgKiBAcHJvcGVydHkge0N1cnZlUmFuZ2V9IHN0YXJ0U3BlZWRcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBDdXJ2ZVJhbmdlLFxuICAgICAgICByYW5nZTogWy0xLCAxXSxcbiAgICB9KVxuICAgIHN0YXJ0U3BlZWQgPSBuZXcgQ3VydmVSYW5nZSgpO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBQYXJ0aWNsZSBpbml0aWFsIHJvdGF0aW9uIGFuZ2xlXG4gICAgICogISN6aCDnspLlrZDliJ3lp4vml4vovazop5LluqZcbiAgICAgKiBAcHJvcGVydHkge0N1cnZlUmFuZ2V9IHN0YXJ0Um90YXRpb25cbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBDdXJ2ZVJhbmdlLFxuICAgICAgICByYW5nZTogWy0xLCAxXSxcbiAgICAgICAgcmFkaWFuOiB0cnVlLFxuICAgIH0pXG4gICAgc3RhcnRSb3RhdGlvbiA9IG5ldyBDdXJ2ZVJhbmdlKCk7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdyYXZpdHkgY29lZmZpY2llbnQgb2YgcGFydGljbGVzIGFmZmVjdGVkIGJ5IGdyYXZpdHlcbiAgICAgKiAhI3poIOeykuWtkOWPl+mHjeWKm+W9seWTjeeahOmHjeWKm+ezu+aVsFxuICAgICAqIEBwcm9wZXJ0eSB7Q3VydmVSYW5nZX0gZ3Jhdml0eU1vZGlmaWVyXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogQ3VydmVSYW5nZSxcbiAgICAgICAgcmFuZ2U6IFstMSwgMV0sXG4gICAgfSlcbiAgICBncmF2aXR5TW9kaWZpZXIgPSBuZXcgQ3VydmVSYW5nZSgpO1xuXG4gICAgLy8gZW1pc3Npb24gbW9kdWxlXG4gICAgLyoqXG4gICAgICogISNlbiBQYXJ0aWNsZXMgZW1pdHRlZCBwZXIgc2Vjb25kXG4gICAgICogISN6aCDmr4/np5Llj5HlsITnmoTnspLlrZDmlbBcbiAgICAgKiBAcHJvcGVydHkge0N1cnZlUmFuZ2V9IHJhdGVPdmVyVGltZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IEN1cnZlUmFuZ2UsXG4gICAgfSlcbiAgICByYXRlT3ZlclRpbWUgPSBuZXcgQ3VydmVSYW5nZSgpO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBOdW1iZXIgb2YgcGFydGljbGVzIGVtaXR0ZWQgcGVyIHVuaXQgZGlzdGFuY2UgbW92ZWRcbiAgICAgKiAhI3poIOavj+enu+WKqOWNleS9jei3neemu+WPkeWwhOeahOeykuWtkOaVsFxuICAgICAqIEBwcm9wZXJ0eSB7Q3VydmVSYW5nZX0gcmF0ZU92ZXJEaXN0YW5jZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IEN1cnZlUmFuZ2UsXG4gICAgfSlcbiAgICByYXRlT3ZlckRpc3RhbmNlID0gbmV3IEN1cnZlUmFuZ2UoKTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG51bWJlciBvZiBCcnVzdHMgdGhhdCBlbWl0IGEgc3BlY2lmaWVkIG51bWJlciBvZiBwYXJ0aWNsZXMgYXQgYSBzcGVjaWZpZWQgdGltZVxuICAgICAqICEjemgg6K6+5a6a5Zyo5oyH5a6a5pe26Ze05Y+R5bCE5oyH5a6a5pWw6YeP55qE57KS5a2Q55qEIEJydXN0IOeahOaVsOmHj1xuICAgICAqIEBwcm9wZXJ0eSB7W0J1cnN0XX0gYnVyc3RzXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogW0J1cnN0XSxcbiAgICB9KVxuICAgIGJ1cnN0cyA9IG5ldyBBcnJheSgpO1xuXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogW01hdGVyaWFsXSxcbiAgICAgICAgZGlzcGxheU5hbWU6ICdNYXRlcmlhbHMnLFxuICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgICAgb3ZlcnJpZGU6IHRydWUsXG4gICAgfSlcbiAgICBnZXQgbWF0ZXJpYWxzICgpIHtcbiAgICAgICAgLy8gaWYgd2UgZG9uJ3QgY3JlYXRlIGFuIGFycmF5IGNvcHksIHRoZSBlZGl0b3Igd2lsbCBtb2RpZnkgdGhlIG9yaWdpbmFsIGFycmF5IGRpcmVjdGx5LlxuICAgICAgICByZXR1cm4gdGhpcy5fbWF0ZXJpYWxzO1xuICAgIH1cblxuICAgIHNldCBtYXRlcmlhbHMgKHZhbCkge1xuICAgICAgICB0aGlzLl9tYXRlcmlhbHMgPSB2YWw7XG4gICAgICAgIHRoaXMuX2FjdGl2YXRlTWF0ZXJpYWwoKTtcbiAgICB9XG5cbiAgICAvLyBzaHBhZSBtb2R1bGVcbiAgICAvKipcbiAgICAgKiAhI2VuIFBhcnRpY2xlIGVtaXR0ZXIgbW9kdWxlXG4gICAgICogISN6aCDnspLlrZDlj5HlsITlmajmqKHlnZdcbiAgICAgKiBAcHJvcGVydHkge1NoYXBlTW9kdWxlfSBzaGFwZU1vZHVsZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IFNoYXBlTW9kdWxlLFxuICAgIH0pXG4gICAgc2hhcGVNb2R1bGUgPSBuZXcgU2hhcGVNb2R1bGUoKTtcblxuICAgIC8vIGNvbG9yIG92ZXIgbGlmZXRpbWUgbW9kdWxlXG4gICAgLyoqXG4gICAgICogISNlbiBDb2xvciBjb250cm9sIG1vZHVsZVxuICAgICAqICEjemgg6aKc6Imy5o6n5Yi25qih5Z2XXG4gICAgICogQHByb3BlcnR5IHtDb2xvck92ZXJMaWZldGltZU1vZHVsZX0gY29sb3JPdmVyTGlmZXRpbWVNb2R1bGVcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBDb2xvck92ZXJMaWZldGltZU1vZHVsZSxcbiAgICB9KVxuICAgIGNvbG9yT3ZlckxpZmV0aW1lTW9kdWxlID0gbmV3IENvbG9yT3ZlckxpZmV0aW1lTW9kdWxlKCk7XG5cbiAgICAvLyBzaXplIG92ZXIgbGlmZXRpbWUgbW9kdWxlXG4gICAgLyoqXG4gICAgICogISNlbiBQYXJ0aWNsZSBzaXplIG1vZHVsZVxuICAgICAqICEjemgg57KS5a2Q5aSn5bCP5qih5Z2XXG4gICAgICogQHByb3BlcnR5IHtTaXplT3ZlcnRpbWVNb2R1bGV9IHNpemVPdmVydGltZU1vZHVsZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IFNpemVPdmVydGltZU1vZHVsZSxcbiAgICB9KVxuICAgIHNpemVPdmVydGltZU1vZHVsZSA9IG5ldyBTaXplT3ZlcnRpbWVNb2R1bGUoKTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gUGFydGljbGUgc3BlZWQgbW9kdWxlXG4gICAgICogISN6aCDnspLlrZDpgJ/luqbmqKHlnZdcbiAgICAgKiBAcHJvcGVydHkge1ZlbG9jaXR5T3ZlcnRpbWVNb2R1bGV9IHZlbG9jaXR5T3ZlcnRpbWVNb2R1bGVcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBWZWxvY2l0eU92ZXJ0aW1lTW9kdWxlLFxuICAgIH0pXG4gICAgdmVsb2NpdHlPdmVydGltZU1vZHVsZSA9IG5ldyBWZWxvY2l0eU92ZXJ0aW1lTW9kdWxlKCk7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFBhcnRpY2xlIGFjY2VsZXJhdGlvbiBtb2R1bGVcbiAgICAgKiAhI3poIOeykuWtkOWKoOmAn+W6puaooeWdl1xuICAgICAqIEBwcm9wZXJ0eSB7Rm9yY2VPdmVydGltZU1vZHVsZX0gZm9yY2VPdmVydGltZU1vZHVsZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IEZvcmNlT3ZlcnRpbWVNb2R1bGUsXG4gICAgfSlcbiAgICBmb3JjZU92ZXJ0aW1lTW9kdWxlID0gbmV3IEZvcmNlT3ZlcnRpbWVNb2R1bGUoKTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gUGFydGljbGUgbGltaXQgc3BlZWQgbW9kdWxlIChvbmx5IENQVSBwYXJ0aWNsZXMgYXJlIHN1cHBvcnRlZClcbiAgICAgKiAhI3poIOeykuWtkOmZkOWItumAn+W6puaooeWdl++8iOWPquaUr+aMgSBDUFUg57KS5a2Q77yJXG4gICAgICogQHByb3BlcnR5IHtMaW1pdFZlbG9jaXR5T3ZlcnRpbWVNb2R1bGV9IGxpbWl0VmVsb2NpdHlPdmVydGltZU1vZHVsZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IExpbWl0VmVsb2NpdHlPdmVydGltZU1vZHVsZSxcbiAgICB9KVxuICAgIGxpbWl0VmVsb2NpdHlPdmVydGltZU1vZHVsZSA9IG5ldyBMaW1pdFZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUoKTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gUGFydGljbGUgcm90YXRpb24gbW9kdWxlXG4gICAgICogISN6aCDnspLlrZDml4vovazmqKHlnZdcbiAgICAgKiBAcHJvcGVydHkge1JvdGF0aW9uT3ZlcnRpbWVNb2R1bGV9IHJvdGF0aW9uT3ZlcnRpbWVNb2R1bGVcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBSb3RhdGlvbk92ZXJ0aW1lTW9kdWxlLFxuICAgIH0pXG4gICAgcm90YXRpb25PdmVydGltZU1vZHVsZSA9IG5ldyBSb3RhdGlvbk92ZXJ0aW1lTW9kdWxlKCk7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRleHR1cmUgQW5pbWF0aW9uIE1vZHVsZVxuICAgICAqICEjemgg6LS05Zu+5Yqo55S75qih5Z2XXG4gICAgICogQHByb3BlcnR5IHtUZXh0dXJlQW5pbWF0aW9uTW9kdWxlfSB0ZXh0dXJlQW5pbWF0aW9uTW9kdWxlXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogVGV4dHVyZUFuaW1hdGlvbk1vZHVsZSxcbiAgICB9KVxuICAgIHRleHR1cmVBbmltYXRpb25Nb2R1bGUgPSBuZXcgVGV4dHVyZUFuaW1hdGlvbk1vZHVsZSgpO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBQYXJ0aWNsZSBUcmFqZWN0b3J5IE1vZHVsZVxuICAgICAqICEjemgg57KS5a2Q6L2o6L+55qih5Z2XXG4gICAgICogQHByb3BlcnR5IHtUcmFpbE1vZHVsZX0gdHJhaWxNb2R1bGVcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBUcmFpbE1vZHVsZSxcbiAgICB9KVxuICAgIHRyYWlsTW9kdWxlID0gbmV3IFRyYWlsTW9kdWxlKCk7XG5cbiAgICBAcHJvcGVydHlcbiAgICBfcmVuZGVyTW9kZSA9IFJlbmRlck1vZGUuQmlsbGJvYXJkO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBQYXJ0aWNsZSBnZW5lcmF0aW9uIG1vZGVcbiAgICAgKiAhI3poIOiuvuWumueykuWtkOeUn+aIkOaooeW8j1xuICAgICAqIEBwcm9wZXJ0eSB7UmVuZGVyTW9kZX0gcmVuZGVyTW9kZVxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IFJlbmRlck1vZGUsXG4gICAgfSlcbiAgICBnZXQgcmVuZGVyTW9kZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZW5kZXJNb2RlO1xuICAgIH1cblxuICAgIHNldCByZW5kZXJNb2RlICh2YWwpIHtcbiAgICAgICAgaWYgKHRoaXMuX3JlbmRlck1vZGUgPT09IHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3JlbmRlck1vZGUgPSB2YWw7XG4gICAgICAgIHRoaXMuX2Fzc2VtYmxlci5fc2V0VmVydGV4QXR0cmliKCk7XG4gICAgICAgIHRoaXMuX2Fzc2VtYmxlci5fdXBkYXRlTW9kZWwoKTtcbiAgICAgICAgdGhpcy5fYXNzZW1ibGVyLl91cGRhdGVNYXRlcmlhbFBhcmFtcygpO1xuICAgIH1cblxuICAgIEBwcm9wZXJ0eVxuICAgIF92ZWxvY2l0eVNjYWxlID0gMTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gV2hlbiB0aGUgcGFydGljbGUgZ2VuZXJhdGlvbiBtb2RlIGlzIFN0cmVjdGhlZEJpbGxib2FyZCwgaW4gdGhlIGRpcmVjdGlvbiBvZiBtb3ZlbWVudCBvZiB0aGUgcGFydGljbGVzIGlzIHN0cmV0Y2hlZCBieSB2ZWxvY2l0eSBtYWduaXR1ZGVcbiAgICAgKiAhI3poIOWcqOeykuWtkOeUn+aIkOaWueW8j+S4uiBTdHJlY3RoZWRCaWxsYm9hcmQg5pe2LOWvueeykuWtkOWcqOi/kOWKqOaWueWQkeS4iuaMiemAn+W6puWkp+Wwj+i/m+ihjOaLieS8uFxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB2ZWxvY2l0eVNjYWxlXG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgZ2V0IHZlbG9jaXR5U2NhbGUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmVsb2NpdHlTY2FsZTtcbiAgICB9XG5cbiAgICBzZXQgdmVsb2NpdHlTY2FsZSAodmFsKSB7XG4gICAgICAgIHRoaXMuX3ZlbG9jaXR5U2NhbGUgPSB2YWw7XG4gICAgICAgIHRoaXMuX2Fzc2VtYmxlci5fdXBkYXRlTWF0ZXJpYWxQYXJhbXMoKTtcbiAgICB9XG5cbiAgICBAcHJvcGVydHlcbiAgICBfbGVuZ3RoU2NhbGUgPSAxO1xuICAgIC8qKlxuICAgICAqICEjZW4gV2hlbiB0aGUgcGFydGljbGUgZ2VuZXJhdGlvbiBtZXRob2QgaXMgU3RyZWN0aGVkQmlsbGJvYXJkLCB0aGUgcGFydGljbGVzIGFyZSBzdHJldGNoZWQgYWNjb3JkaW5nIHRvIHRoZSBwYXJ0aWNsZSBzaXplIGluIHRoZSBkaXJlY3Rpb24gb2YgbW90aW9uXG4gICAgICogISN6aCDlnKjnspLlrZDnlJ/miJDmlrnlvI/kuLogU3RyZWN0aGVkQmlsbGJvYXJkIOaXtizlr7nnspLlrZDlnKjov5DliqjmlrnlkJHkuIrmjInnspLlrZDlpKflsI/ov5vooYzmi4nkvLhcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gbGVuZ3RoU2NhbGVcbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBnZXQgbGVuZ3RoU2NhbGUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGVuZ3RoU2NhbGU7XG4gICAgfVxuXG4gICAgc2V0IGxlbmd0aFNjYWxlICh2YWwpIHtcbiAgICAgICAgdGhpcy5fbGVuZ3RoU2NhbGUgPSB2YWw7XG4gICAgICAgIHRoaXMuX2Fzc2VtYmxlci5fdXBkYXRlTWF0ZXJpYWxQYXJhbXMoKTtcbiAgICB9XG5cbiAgICBAcHJvcGVydHlcbiAgICBfbWVzaCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFBhcnRpY2xlIG1vZGVsXG4gICAgICogISN6aCDnspLlrZDmqKHlnotcbiAgICAgKiBAcHJvcGVydHkge01lc2h9IG1lc2hcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBNZXNoLFxuICAgIH0pXG4gICAgZ2V0IG1lc2ggKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWVzaDtcbiAgICB9XG5cbiAgICBzZXQgbWVzaCAodmFsKSB7XG4gICAgICAgIHRoaXMuX21lc2ggPSB2YWw7XG4gICAgICAgIHRoaXMuX2Fzc2VtYmxlci5fdXBkYXRlTW9kZWwoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFBhcnRpY2xlIG1hdGVyaWFsXG4gICAgICogISN6aCDnspLlrZDmnZDotKhcbiAgICAgKiBAcHJvcGVydHkge01hdGVyaWFsfSBwYXJ0aWNsZU1hdGVyaWFsXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogTWF0ZXJpYWwsXG4gICAgfSlcbiAgICBnZXQgcGFydGljbGVNYXRlcmlhbCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldE1hdGVyaWFsKDApO1xuICAgIH1cblxuICAgIHNldCBwYXJ0aWNsZU1hdGVyaWFsICh2YWwpIHtcbiAgICAgICAgdGhpcy5zZXRNYXRlcmlhbCgwLCB2YWwpO1xuICAgICAgICB0aGlzLl9vbk1hdGVyaWFsTW9kaWZpZWQoMCwgdmFsKTtcbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogISNlbiBQYXJ0aWNsZSB0cmFpbCBtYXRlcmlhbFxuICAgICAqICEjemgg57KS5a2Q6L2o6L+55p2Q6LSoXG4gICAgICogQHByb3BlcnR5IHtNYXRlcmlhbH0gdHJhaWxNYXRlcmlhbFxuICAgICAqL1xuICAgIEBwcm9wZXJ0eSh7XG4gICAgICAgIHR5cGU6IE1hdGVyaWFsLFxuICAgIH0pXG4gICAgZ2V0IHRyYWlsTWF0ZXJpYWwgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRNYXRlcmlhbCgxKTtcbiAgICB9XG5cbiAgICBzZXQgdHJhaWxNYXRlcmlhbCAodmFsKSB7XG4gICAgICAgIHRoaXMuc2V0TWF0ZXJpYWwoMSwgdmFsKTtcbiAgICAgICAgdGhpcy5fb25NYXRlcmlhbE1vZGlmaWVkKDAsIHZhbCk7XG4gICAgfVxuXG4gICAgX2lzUGxheWluZztcbiAgICBfaXNQYXVzZWQ7XG4gICAgX2lzU3RvcHBlZDtcbiAgICBfaXNFbWl0dGluZztcbiAgICBfdGltZTsgIC8vIHBsYXliYWNrIHBvc2l0aW9uIGluIHNlY29uZHMuXG4gICAgX2VtaXRSYXRlVGltZUNvdW50ZXI7XG4gICAgX2VtaXRSYXRlRGlzdGFuY2VDb3VudGVyO1xuICAgIF9vbGRXUG9zO1xuICAgIF9jdXJXUG9zO1xuICAgIF9jdXN0b21EYXRhMTtcbiAgICBfY3VzdG9tRGF0YTI7XG4gICAgX3N1YkVtaXR0ZXJzOyAvLyBhcnJheSBvZiB7IGVtaXR0ZXI6IFBhcnRpY2xlU3lzdGVtM0QsIHR5cGU6ICdiaXJ0aCcsICdjb2xsaXNpb24nIG9yICdkZWF0aCd9XG5cbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5yYXRlT3ZlclRpbWUuY29uc3RhbnQgPSAxMDtcbiAgICAgICAgdGhpcy5zdGFydExpZmV0aW1lLmNvbnN0YW50ID0gNTtcbiAgICAgICAgdGhpcy5zdGFydFNpemUuY29uc3RhbnQgPSAxO1xuICAgICAgICB0aGlzLnN0YXJ0U3BlZWQuY29uc3RhbnQgPSA1O1xuXG4gICAgICAgIC8vIGludGVybmFsIHN0YXR1c1xuICAgICAgICB0aGlzLl9pc1BsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5faXNQYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5faXNTdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5faXNFbWl0dGluZyA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuX3RpbWUgPSAwLjA7ICAvLyBwbGF5YmFjayBwb3NpdGlvbiBpbiBzZWNvbmRzLlxuICAgICAgICB0aGlzLl9lbWl0UmF0ZVRpbWVDb3VudGVyID0gMC4wO1xuICAgICAgICB0aGlzLl9lbWl0UmF0ZURpc3RhbmNlQ291bnRlciA9IDAuMDtcbiAgICAgICAgdGhpcy5fb2xkV1BvcyA9IG5ldyBWZWMzKDAsIDAsIDApO1xuICAgICAgICB0aGlzLl9jdXJXUG9zID0gbmV3IFZlYzMoMCwgMCwgMCk7XG5cbiAgICAgICAgdGhpcy5fY3VzdG9tRGF0YTEgPSBuZXcgVmVjMigwLCAwKTtcbiAgICAgICAgdGhpcy5fY3VzdG9tRGF0YTIgPSBuZXcgVmVjMigwLCAwKTtcblxuICAgICAgICB0aGlzLl9zdWJFbWl0dGVycyA9IFtdOyAvLyBhcnJheSBvZiB7IGVtaXR0ZXI6IFBhcnRpY2xlU3lzdGVtQ29tcG9uZW50LCB0eXBlOiAnYmlydGgnLCAnY29sbGlzaW9uJyBvciAnZGVhdGgnfVxuICAgIH1cblxuICAgIG9uTG9hZCAoKSB7XG4gICAgICAgIHRoaXMuX2Fzc2VtYmxlci5vbkluaXQodGhpcyk7XG4gICAgICAgIHRoaXMuc2hhcGVNb2R1bGUub25Jbml0KHRoaXMpO1xuICAgICAgICB0aGlzLnRyYWlsTW9kdWxlLm9uSW5pdCh0aGlzKTtcbiAgICAgICAgdGhpcy50ZXh0dXJlQW5pbWF0aW9uTW9kdWxlLm9uSW5pdCh0aGlzKTtcblxuICAgICAgICB0aGlzLl9yZXNldFBvc2l0aW9uKCk7XG5cbiAgICAgICAgLy8gdGhpcy5fc3lzdGVtLmFkZCh0aGlzKTtcbiAgICB9XG5cbiAgICBfb25NYXRlcmlhbE1vZGlmaWVkIChpbmRleCwgbWF0ZXJpYWwpIHtcbiAgICAgICAgdGhpcy5fYXNzZW1ibGVyLl9vbk1hdGVyaWFsTW9kaWZpZWQoaW5kZXgsIG1hdGVyaWFsKTtcbiAgICB9XG5cbiAgICBfb25SZWJ1aWxkUFNPIChpbmRleCwgbWF0ZXJpYWwpIHtcbiAgICAgICAgdGhpcy5fYXNzZW1ibGVyLl9vblJlYnVpbGRQU08oaW5kZXgsIG1hdGVyaWFsKTtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBmYXN0Zm9yd2FyZCBjdXJyZW50IHBhcnRpY2xlIHN5c3RlbSBieSBzaW11bGF0aW5nIHBhcnRpY2xlcyBvdmVyIGdpdmVuIHBlcmlvZCBvZiB0aW1lLCB0aGVuIHBhdXNlIGl0LlxuICAgIC8vIHNpbXVsYXRlKHRpbWUsIHdpdGhDaGlsZHJlbiwgcmVzdGFydCwgZml4ZWRUaW1lU3RlcCkge1xuXG4gICAgLy8gfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBQbGF5aW5nIHBhcnRpY2xlIGVmZmVjdHNcbiAgICAgKiAhI3poIOaSreaUvueykuWtkOaViOaenFxuICAgICAqIEBtZXRob2QgcGxheVxuICAgICAqL1xuICAgIHBsYXkgKCkge1xuICAgICAgICBpZiAodGhpcy5faXNQYXVzZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX2lzUGF1c2VkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2lzU3RvcHBlZCkge1xuICAgICAgICAgICAgdGhpcy5faXNTdG9wcGVkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9pc1BsYXlpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLl9pc0VtaXR0aW5nID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLl9yZXNldFBvc2l0aW9uKCk7XG5cbiAgICAgICAgLy8gcHJld2FybVxuICAgICAgICBpZiAodGhpcy5fcHJld2FybSkge1xuICAgICAgICAgICAgdGhpcy5fcHJld2FybVN5c3RlbSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBQYXVzZSBwYXJ0aWNsZSBlZmZlY3RcbiAgICAgKiAhI3poIOaaguWBnOaSreaUvueykuWtkOaViOaenFxuICAgICAqIEBtZXRob2QgcGF1c2VcbiAgICAgKi9cbiAgICBwYXVzZSAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9pc1N0b3BwZWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybigncGF1c2UoKTogcGFydGljbGUgc3lzdGVtIGlzIGFscmVhZHkgc3RvcHBlZC4nKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5faXNQbGF5aW5nKSB7XG4gICAgICAgICAgICB0aGlzLl9pc1BsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2lzUGF1c2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFN0b3AgcGFydGljbGUgZWZmZWN0XG4gICAgICogISN6aCDlgZzmraLmkq3mlL7nspLlrZDmlYjmnpxcbiAgICAgKiBAbWV0aG9kIHN0b3BcbiAgICAgKi9cbiAgICBzdG9wICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2lzUGxheWluZyB8fCB0aGlzLl9pc1BhdXNlZCkge1xuICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9pc1BsYXlpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuX2lzUGxheWluZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9pc1BhdXNlZCkge1xuICAgICAgICAgICAgdGhpcy5faXNQYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3RpbWUgPSAwLjA7XG4gICAgICAgIHRoaXMuX2VtaXRSYXRlVGltZUNvdW50ZXIgPSAwLjA7XG4gICAgICAgIHRoaXMuX2VtaXRSYXRlRGlzdGFuY2VDb3VudGVyID0gMC4wO1xuXG4gICAgICAgIHRoaXMuX2lzU3RvcHBlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIGFsbCBwYXJ0aWNsZXMgZnJvbSBjdXJyZW50IHBhcnRpY2xlIHN5c3RlbS5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJlbW92ZSBhbGwgcGFydGljbGUgZWZmZWN0XG4gICAgICogISN6aCDlsIbmiYDmnInnspLlrZDku47nspLlrZDns7vnu5/kuK3muIXpmaRcbiAgICAgKiBAbWV0aG9kIGNsZWFyXG4gICAgICovXG4gICAgY2xlYXIgKCkge1xuICAgICAgICBpZiAodGhpcy5lbmFibGVkSW5IaWVyYXJjaHkpIHtcbiAgICAgICAgICAgIHRoaXMuX2Fzc2VtYmxlci5jbGVhcigpO1xuICAgICAgICAgICAgdGhpcy50cmFpbE1vZHVsZS5jbGVhcigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0UGFydGljbGVDb3VudCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hc3NlbWJsZXIuZ2V0UGFydGljbGVDb3VudCgpO1xuICAgIH1cblxuICAgIHNldEN1c3RvbURhdGExICh4LCB5KSB7XG4gICAgICAgIFZlYzIuc2V0KHRoaXMuX2N1c3RvbURhdGExLCB4LCB5KTtcbiAgICB9XG5cbiAgICBzZXRDdXN0b21EYXRhMiAoeCwgeSkge1xuICAgICAgICBWZWMyLnNldCh0aGlzLl9jdXN0b21EYXRhMiwgeCwgeSk7XG4gICAgfVxuXG4gICAgb25EZXN0cm95ICgpIHtcbiAgICAgICAgLy8gdGhpcy5fc3lzdGVtLnJlbW92ZSh0aGlzKTtcbiAgICAgICAgdGhpcy5fYXNzZW1ibGVyLm9uRGVzdHJveSgpO1xuICAgICAgICB0aGlzLnRyYWlsTW9kdWxlLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICBvbkVuYWJsZSAoKSB7XG4gICAgICAgIHN1cGVyLm9uRW5hYmxlKCk7XG4gICAgICAgIGlmICh0aGlzLnBsYXlPbkF3YWtlKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9hc3NlbWJsZXIub25FbmFibGUoKTtcbiAgICAgICAgdGhpcy50cmFpbE1vZHVsZS5vbkVuYWJsZSgpO1xuICAgIH1cblxuICAgIG9uRGlzYWJsZSAoKSB7XG4gICAgICAgIHN1cGVyLm9uRGlzYWJsZSgpO1xuICAgICAgICB0aGlzLl9hc3NlbWJsZXIub25EaXNhYmxlKCk7XG4gICAgICAgIHRoaXMudHJhaWxNb2R1bGUub25EaXNhYmxlKCk7XG4gICAgfVxuXG4gICAgdXBkYXRlIChkdCkge1xuICAgICAgICBjb25zdCBzY2FsZWREZWx0YVRpbWUgPSBkdCAqIHRoaXMuc2ltdWxhdGlvblNwZWVkO1xuICAgICAgICBpZiAodGhpcy5faXNQbGF5aW5nKSB7XG4gICAgICAgICAgICB0aGlzLl90aW1lICs9IHNjYWxlZERlbHRhVGltZTtcblxuICAgICAgICAgICAgLy8gZXhjdXRlIGVtaXNzaW9uXG4gICAgICAgICAgICB0aGlzLl9lbWl0KHNjYWxlZERlbHRhVGltZSk7XG5cbiAgICAgICAgICAgIC8vIHNpbXVsYXRpb24sIHVwZGF0ZSBwYXJ0aWNsZXMuXG4gICAgICAgICAgICBpZiAodGhpcy5fYXNzZW1ibGVyLl91cGRhdGVQYXJ0aWNsZXMoc2NhbGVkRGVsdGFUaW1lKSA9PT0gMCAmJiAhdGhpcy5faXNFbWl0dGluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB1cGRhdGUgcmVuZGVyIGRhdGFcbiAgICAgICAgICAgIHRoaXMuX2Fzc2VtYmxlci51cGRhdGVQYXJ0aWNsZUJ1ZmZlcigpO1xuXG4gICAgICAgICAgICAvLyB1cGRhdGUgdHJhaWxcbiAgICAgICAgICAgIGlmICh0aGlzLnRyYWlsTW9kdWxlLmVuYWJsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMudHJhaWxNb2R1bGUudXBkYXRlVHJhaWxCdWZmZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGVtaXQgKGNvdW50LCBkdCkge1xuXG4gICAgICAgIGlmICh0aGlzLl9zaW11bGF0aW9uU3BhY2UgPT09IFNwYWNlLldvcmxkKSB7XG4gICAgICAgICAgICB0aGlzLm5vZGUuZ2V0V29ybGRNYXRyaXgoX3dvcmxkX21hdCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnRpY2xlID0gdGhpcy5fYXNzZW1ibGVyLl9nZXRGcmVlUGFydGljbGUoKTtcbiAgICAgICAgICAgIGlmIChwYXJ0aWNsZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHJhbmQgPSBwc2V1ZG9SYW5kb20ocmFuZG9tUmFuZ2VJbnQoMCwgSU5UX01BWCkpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5zaGFwZU1vZHVsZS5lbmFibGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNoYXBlTW9kdWxlLmVtaXQocGFydGljbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgVmVjMy5zZXQocGFydGljbGUucG9zaXRpb24sIDAsIDAsIDApO1xuICAgICAgICAgICAgICAgIFZlYzMuY29weShwYXJ0aWNsZS52ZWxvY2l0eSwgcGFydGljbGVFbWl0WkF4aXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy50ZXh0dXJlQW5pbWF0aW9uTW9kdWxlLmVuYWJsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMudGV4dHVyZUFuaW1hdGlvbk1vZHVsZS5pbml0KHBhcnRpY2xlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgVmVjMy5zY2FsZShwYXJ0aWNsZS52ZWxvY2l0eSwgcGFydGljbGUudmVsb2NpdHksIHRoaXMuc3RhcnRTcGVlZC5ldmFsdWF0ZSh0aGlzLl90aW1lIC8gdGhpcy5kdXJhdGlvbiwgcmFuZCkpO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMuX3NpbXVsYXRpb25TcGFjZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgU3BhY2UuTG9jYWw6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgU3BhY2UuV29ybGQ6XG4gICAgICAgICAgICAgICAgICAgIFZlYzMudHJhbnNmb3JtTWF0NChwYXJ0aWNsZS5wb3NpdGlvbiwgcGFydGljbGUucG9zaXRpb24sIF93b3JsZF9tYXQpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB3b3JsZFJvdCA9IG5ldyBRdWF0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5nZXRXb3JsZFJvdGF0aW9uKHdvcmxkUm90KTtcbiAgICAgICAgICAgICAgICAgICAgVmVjMy50cmFuc2Zvcm1RdWF0KHBhcnRpY2xlLnZlbG9jaXR5LCBwYXJ0aWNsZS52ZWxvY2l0eSwgd29ybGRSb3QpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFNwYWNlLkN1c3RvbTpcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBWZWMzLmNvcHkocGFydGljbGUudWx0aW1hdGVWZWxvY2l0eSwgcGFydGljbGUudmVsb2NpdHkpO1xuICAgICAgICAgICAgLy8gYXBwbHkgc3RhcnRSb3RhdGlvbi4gbm93IDJEIG9ubHkuXG4gICAgICAgICAgICBWZWMzLnNldChwYXJ0aWNsZS5yb3RhdGlvbiwgMCwgMCwgdGhpcy5zdGFydFJvdGF0aW9uLmV2YWx1YXRlKHRoaXMuX3RpbWUgLyB0aGlzLmR1cmF0aW9uLCByYW5kKSk7XG5cbiAgICAgICAgICAgIC8vIGFwcGx5IHN0YXJ0U2l6ZS4gbm93IDJEIG9ubHkuXG4gICAgICAgICAgICBWZWMzLnNldChwYXJ0aWNsZS5zdGFydFNpemUsIHRoaXMuc3RhcnRTaXplLmV2YWx1YXRlKHRoaXMuX3RpbWUgLyB0aGlzLmR1cmF0aW9uLCByYW5kKSwgMSwgMSk7XG4gICAgICAgICAgICBwYXJ0aWNsZS5zdGFydFNpemUueSA9IHBhcnRpY2xlLnN0YXJ0U2l6ZS54O1xuICAgICAgICAgICAgVmVjMy5jb3B5KHBhcnRpY2xlLnNpemUsIHBhcnRpY2xlLnN0YXJ0U2l6ZSk7XG5cbiAgICAgICAgICAgIC8vIGFwcGx5IHN0YXJ0Q29sb3IuXG4gICAgICAgICAgICBwYXJ0aWNsZS5zdGFydENvbG9yLnNldCh0aGlzLnN0YXJ0Q29sb3IuZXZhbHVhdGUodGhpcy5fdGltZSAvIHRoaXMuZHVyYXRpb24sIHJhbmQpKTtcbiAgICAgICAgICAgIHBhcnRpY2xlLmNvbG9yLnNldChwYXJ0aWNsZS5zdGFydENvbG9yKTtcblxuICAgICAgICAgICAgLy8gYXBwbHkgc3RhcnRMaWZldGltZS5cbiAgICAgICAgICAgIHBhcnRpY2xlLnN0YXJ0TGlmZXRpbWUgPSB0aGlzLnN0YXJ0TGlmZXRpbWUuZXZhbHVhdGUodGhpcy5fdGltZSAvIHRoaXMuZHVyYXRpb24sIHJhbmQpICsgZHQ7XG4gICAgICAgICAgICBwYXJ0aWNsZS5yZW1haW5pbmdMaWZldGltZSA9IHBhcnRpY2xlLnN0YXJ0TGlmZXRpbWU7XG5cbiAgICAgICAgICAgIHBhcnRpY2xlLnJhbmRvbVNlZWQgPSByYW5kb21SYW5nZUludCgwLCAyMzMyODApO1xuXG4gICAgICAgICAgICB0aGlzLl9hc3NlbWJsZXIuX3NldE5ld1BhcnRpY2xlKHBhcnRpY2xlKTtcblxuICAgICAgICB9IC8vIGVuZCBvZiBwYXJ0aWNsZXMgZm9yTG9vcC5cbiAgICB9XG5cbiAgICAvLyBpbml0aWFsaXplIHBhcnRpY2xlIHN5c3RlbSBhcyB0aG91Z2ggaXQgaGFkIGFscmVhZHkgY29tcGxldGVkIGEgZnVsbCBjeWNsZS5cbiAgICBfcHJld2FybVN5c3RlbSAoKSB7XG4gICAgICAgIHRoaXMuc3RhcnREZWxheS5tb2RlID0gTW9kZS5Db25zdGFudDsgLy8gY2xlYXIgc3RhcnREZWxheS5cbiAgICAgICAgdGhpcy5zdGFydERlbGF5LmNvbnN0YW50ID0gMDtcbiAgICAgICAgY29uc3QgZHQgPSAxLjA7IC8vIHNob3VsZCB1c2UgdmFyeWluZyB2YWx1ZT9cbiAgICAgICAgY29uc3QgY250ID0gdGhpcy5kdXJhdGlvbiAvIGR0O1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNudDsgKytpKSB7XG4gICAgICAgICAgICB0aGlzLl90aW1lICs9IGR0O1xuICAgICAgICAgICAgdGhpcy5fZW1pdChkdCk7XG4gICAgICAgICAgICB0aGlzLl9hc3NlbWJsZXIuX3VwZGF0ZVBhcnRpY2xlcyhkdCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBpbnRlcm5hbCBmdW5jdGlvblxuICAgIF9lbWl0IChkdCkge1xuICAgICAgICAvLyBlbWl0IHBhcnRpY2xlcy5cbiAgICAgICAgY29uc3Qgc3RhcnREZWxheSA9IHRoaXMuc3RhcnREZWxheS5ldmFsdWF0ZSgwLCAxKTtcbiAgICAgICAgaWYgKHRoaXMuX3RpbWUgPiBzdGFydERlbGF5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fdGltZSA+ICh0aGlzLmR1cmF0aW9uICsgc3RhcnREZWxheSkpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzLl90aW1lID0gc3RhcnREZWxheTsgLy8gZGVsYXkgd2lsbCBub3QgYmUgYXBwbGllZCBmcm9tIHRoZSBzZWNvbmQgbG9vcC4oVW5pdHkpXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5fZW1pdFJhdGVUaW1lQ291bnRlciA9IDAuMDtcbiAgICAgICAgICAgICAgICAvLyB0aGlzLl9lbWl0UmF0ZURpc3RhbmNlQ291bnRlciA9IDAuMDtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMubG9vcCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pc0VtaXR0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGVtaXQgYnkgcmF0ZU92ZXJUaW1lXG4gICAgICAgICAgICB0aGlzLl9lbWl0UmF0ZVRpbWVDb3VudGVyICs9IHRoaXMucmF0ZU92ZXJUaW1lLmV2YWx1YXRlKHRoaXMuX3RpbWUgLyB0aGlzLmR1cmF0aW9uLCAxKSAqIGR0O1xuICAgICAgICAgICAgaWYgKHRoaXMuX2VtaXRSYXRlVGltZUNvdW50ZXIgPiAxICYmIHRoaXMuX2lzRW1pdHRpbmcpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbWl0TnVtID0gTWF0aC5mbG9vcih0aGlzLl9lbWl0UmF0ZVRpbWVDb3VudGVyKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbWl0UmF0ZVRpbWVDb3VudGVyIC09IGVtaXROdW07XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KGVtaXROdW0sIGR0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGVtaXQgYnkgcmF0ZU92ZXJEaXN0YW5jZVxuICAgICAgICAgICAgdGhpcy5ub2RlLmdldFdvcmxkUG9zaXRpb24odGhpcy5fY3VyV1Bvcyk7XG4gICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IFZlYzMuZGlzdGFuY2UodGhpcy5fY3VyV1BvcywgdGhpcy5fb2xkV1Bvcyk7XG4gICAgICAgICAgICBWZWMzLmNvcHkodGhpcy5fb2xkV1BvcywgdGhpcy5fY3VyV1Bvcyk7XG4gICAgICAgICAgICB0aGlzLl9lbWl0UmF0ZURpc3RhbmNlQ291bnRlciArPSBkaXN0YW5jZSAqIHRoaXMucmF0ZU92ZXJEaXN0YW5jZS5ldmFsdWF0ZSh0aGlzLl90aW1lIC8gdGhpcy5kdXJhdGlvbiwgMSk7XG4gICAgICAgICAgICBpZiAodGhpcy5fZW1pdFJhdGVEaXN0YW5jZUNvdW50ZXIgPiAxICYmIHRoaXMuX2lzRW1pdHRpbmcpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbWl0TnVtID0gTWF0aC5mbG9vcih0aGlzLl9lbWl0UmF0ZURpc3RhbmNlQ291bnRlcik7XG4gICAgICAgICAgICAgICAgdGhpcy5fZW1pdFJhdGVEaXN0YW5jZUNvdW50ZXIgLT0gZW1pdE51bTtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoZW1pdE51bSwgZHQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBidXJzdHNcbiAgICAgICAgICAgIGZvciAoY29uc3QgYnVyc3Qgb2YgdGhpcy5idXJzdHMpIHtcbiAgICAgICAgICAgICAgICBidXJzdC51cGRhdGUodGhpcywgZHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2FjdGl2YXRlTWF0ZXJpYWwgKCkge1xuICAgICAgICBcbiAgICB9XG5cbiAgICBfcmVzZXRQb3NpdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubm9kZS5nZXRXb3JsZFBvc2l0aW9uKHRoaXMuX29sZFdQb3MpO1xuICAgICAgICBWZWMzLmNvcHkodGhpcy5fY3VyV1BvcywgdGhpcy5fb2xkV1Bvcyk7XG4gICAgfVxuXG4gICAgYWRkU3ViRW1pdHRlciAoc3ViRW1pdHRlcikge1xuICAgICAgICB0aGlzLl9zdWJFbWl0dGVycy5wdXNoKHN1YkVtaXR0ZXIpO1xuICAgIH1cblxuICAgIHJlbW92ZVN1YkVtaXR0ZXIgKGlkeCkge1xuICAgICAgICB0aGlzLl9zdWJFbWl0dGVycy5zcGxpY2UodGhpcy5fc3ViRW1pdHRlcnMuaW5kZXhPZihpZHgpLCAxKTtcbiAgICB9XG5cbiAgICBhZGRCdXJzdCAoYnVyc3QpIHtcbiAgICAgICAgdGhpcy5idXJzdHMucHVzaChidXJzdCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlQnVyc3QgKGlkeCkge1xuICAgICAgICB0aGlzLmJ1cnN0cy5zcGxpY2UodGhpcy5idXJzdHMuaW5kZXhPZihpZHgpLCAxKTtcbiAgICB9XG5cbiAgICBfY2hlY2tCYWN0aCAoKSB7XG4gICAgICAgIFxuICAgIH1cblxuICAgIGdldCBpc1BsYXlpbmcgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNQbGF5aW5nO1xuICAgIH1cblxuICAgIGdldCBpc1BhdXNlZCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc1BhdXNlZDtcbiAgICB9XG5cbiAgICBnZXQgaXNTdG9wcGVkICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzU3RvcHBlZDtcbiAgICB9XG5cbiAgICBnZXQgaXNFbWl0dGluZyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc0VtaXR0aW5nO1xuICAgIH1cblxuICAgIGdldCB0aW1lICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RpbWU7XG4gICAgfVxufVxuXG5jYy5QYXJ0aWNsZVN5c3RlbTNEID0gUGFydGljbGVTeXN0ZW0zRDtcbiJdfQ==