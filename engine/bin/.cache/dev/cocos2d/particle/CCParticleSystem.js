
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/particle/CCParticleSystem.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var macro = require('../core/platform/CCMacro');

var ParticleAsset = require('./CCParticleAsset');

var RenderComponent = require('../core/components/CCRenderComponent');

var codec = require('../compression/ZipUtils');

var PNGReader = require('./CCPNGReader');

var tiffReader = require('./CCTIFFReader');

var textureUtil = require('../core/utils/texture-util');

var RenderFlow = require('../core/renderer/render-flow');

var ParticleSimulator = require('./particle-simulator');

var Material = require('../core/assets/material/CCMaterial');

var BlendFunc = require('../core/utils/blend-func');

function getImageFormatByData(imgData) {
  // if it is a png file buffer.
  if (imgData.length > 8 && imgData[0] === 0x89 && imgData[1] === 0x50 && imgData[2] === 0x4E && imgData[3] === 0x47 && imgData[4] === 0x0D && imgData[5] === 0x0A && imgData[6] === 0x1A && imgData[7] === 0x0A) {
    return macro.ImageFormat.PNG;
  } // if it is a tiff file buffer.


  if (imgData.length > 2 && (imgData[0] === 0x49 && imgData[1] === 0x49 || imgData[0] === 0x4d && imgData[1] === 0x4d || imgData[0] === 0xff && imgData[1] === 0xd8)) {
    return macro.ImageFormat.TIFF;
  }

  return macro.ImageFormat.UNKNOWN;
} //


function getParticleComponents(node) {
  var parent = node.parent,
      comp = node.getComponent(cc.ParticleSystem);

  if (!parent || !comp) {
    return node.getComponentsInChildren(cc.ParticleSystem);
  }

  return getParticleComponents(parent);
}
/**
 * !#en Enum for emitter modes
 * !#zh 发射模式
 * @enum ParticleSystem.EmitterMode
 */


var EmitterMode = cc.Enum({
  /**
   * !#en Uses gravity, speed, radial and tangential acceleration.
   * !#zh 重力模式，模拟重力，可让粒子围绕一个中心点移近或移远。
   * @property {Number} GRAVITY
   */
  GRAVITY: 0,

  /**
   * !#en Uses radius movement + rotation.
   * !#zh 半径模式，可以使粒子以圆圈方式旋转，它也可以创造螺旋效果让粒子急速前进或后退。
   * @property {Number} RADIUS - Uses radius movement + rotation.
   */
  RADIUS: 1
});
/**
 * !#en Enum for particles movement type.
 * !#zh 粒子位置类型
 * @enum ParticleSystem.PositionType
 */

var PositionType = cc.Enum({
  /**
   * !#en
   * Living particles are attached to the world and are unaffected by emitter repositioning.
   * !#zh
   * 自由模式，相对于世界坐标，不会随粒子节点移动而移动。（可产生火焰、蒸汽等效果）
   * @property {Number} FREE
   */
  FREE: 0,

  /**
   * !#en
   * Living particles are attached to the world but will follow the emitter repositioning.<br/>
   * Use case: Attach an emitter to an sprite, and you want that the emitter follows the sprite.
   * !#zh
   * 相对模式，粒子会随父节点移动而移动，可用于制作移动角色身上的特效等等。（该选项在 Creator 中暂时不支持）
   * @property {Number} RELATIVE
   */
  RELATIVE: 1,

  /**
   * !#en
   * Living particles are attached to the emitter and are translated along with it.
   * !#zh
   * 整组模式，粒子跟随发射器移动。（不会发生拖尾）
   * @property {Number} GROUPED
   */
  GROUPED: 2
});
/**
 * @class ParticleSystem
 */

var properties = {
  /**
   * !#en Play particle in edit mode.
   * !#zh 在编辑器模式下预览粒子，启用后选中粒子时，粒子将自动播放。
   * @property {Boolean} preview
   * @default false
   */
  preview: {
    "default": true,
    editorOnly: true,
    notify: CC_EDITOR && function () {
      this.resetSystem();

      if (!this.preview) {
        this.stopSystem();
        this.disableRender();
      }

      cc.engine.repaintInEditMode();
    },
    animatable: false,
    tooltip: CC_DEV && 'i18n:COMPONENT.particle_system.preview'
  },

  /**
   * !#en
   * If set custom to true, then use custom properties insteadof read particle file.
   * !#zh 是否自定义粒子属性。
   * @property {Boolean} custom
   * @default false
   */
  _custom: false,
  custom: {
    get: function get() {
      return this._custom;
    },
    set: function set(value) {
      if (CC_EDITOR && !value && !this._file) {
        return cc.warnID(6000);
      }

      if (this._custom !== value) {
        this._custom = value;

        this._applyFile();

        if (CC_EDITOR) {
          cc.engine.repaintInEditMode();
        }
      }
    },
    animatable: false,
    tooltip: CC_DEV && 'i18n:COMPONENT.particle_system.custom'
  },

  /**
   * !#en The plist file.
   * !#zh plist 格式的粒子配置文件。
   * @property {ParticleAsset} file
   * @default null
   */
  _file: {
    "default": null,
    type: ParticleAsset
  },
  file: {
    get: function get() {
      return this._file;
    },
    set: function set(value, force) {
      if (this._file !== value || CC_EDITOR && force) {
        this._file = value;

        if (value) {
          this._applyFile();

          if (CC_EDITOR) {
            cc.engine.repaintInEditMode();
          }
        } else {
          this.custom = true;
        }
      }
    },
    animatable: false,
    type: ParticleAsset,
    tooltip: CC_DEV && 'i18n:COMPONENT.particle_system.file'
  },

  /**
   * !#en SpriteFrame used for particles display
   * !#zh 用于粒子呈现的 SpriteFrame
   * @property spriteFrame
   * @type {SpriteFrame}
   */
  _spriteFrame: {
    "default": null,
    type: cc.SpriteFrame
  },
  spriteFrame: {
    get: function get() {
      return this._spriteFrame;
    },
    set: function set(value, force) {
      var lastSprite = this._renderSpriteFrame;

      if (CC_EDITOR) {
        if (!force && lastSprite === value) {
          return;
        }
      } else {
        if (lastSprite === value) {
          return;
        }
      }

      this._renderSpriteFrame = value;

      if (!value || value._uuid) {
        this._spriteFrame = value;
      }

      if ((lastSprite && lastSprite.getTexture()) !== (value && value.getTexture())) {
        this._applySpriteFrame(lastSprite);
      }

      if (CC_EDITOR) {
        this.node.emit('spriteframe-changed', this);
      }
    },
    type: cc.SpriteFrame,
    tooltip: CC_DEV && 'i18n:COMPONENT.particle_system.spriteFrame'
  },
  // just used to read data from 1.x
  _texture: {
    "default": null,
    type: cc.Texture2D,
    editorOnly: true
  },

  /**
   * !#en Texture of Particle System, readonly, please use spriteFrame to setup new texture。
   * !#zh 粒子贴图，只读属性，请使用 spriteFrame 属性来替换贴图。
   * @property texture
   * @type {String}
   * @readonly
   */
  texture: {
    get: function get() {
      return this._getTexture();
    },
    set: function set(value) {
      if (value) {
        cc.warnID(6017);
      }
    },
    type: cc.Texture2D,
    tooltip: CC_DEV && 'i18n:COMPONENT.particle_system.texture',
    readonly: true,
    visible: false,
    animatable: false
  },

  /**
   * !#en Current quantity of particles that are being simulated.
   * !#zh 当前播放的粒子数量。
   * @property {Number} particleCount
   * @readonly
   */
  particleCount: {
    visible: false,
    get: function get() {
      return this._simulator.particles.length;
    },
    readonly: true
  },

  /**
   * !#en Indicate whether the system simulation have stopped.
   * !#zh 指示粒子播放是否完毕。
   * @property {Boolean} stopped
   */
  _stopped: true,
  stopped: {
    get: function get() {
      return this._stopped;
    },
    animatable: false,
    visible: false
  },

  /**
   * !#en If set to true, the particle system will automatically start playing on onLoad.
   * !#zh 如果设置为 true 运行时会自动发射粒子。
   * @property playOnLoad
   * @type {boolean}
   * @default true
   */
  playOnLoad: true,

  /**
   * !#en Indicate whether the owner node will be auto-removed when it has no particles left.
   * !#zh 粒子播放完毕后自动销毁所在的节点。
   * @property {Boolean} autoRemoveOnFinish
   */
  autoRemoveOnFinish: {
    "default": false,
    animatable: false,
    tooltip: CC_DEV && 'i18n:COMPONENT.particle_system.autoRemoveOnFinish'
  },

  /**
   * !#en Indicate whether the particle system is activated.
   * !#zh 是否激活粒子。
   * @property {Boolean} active
   * @readonly
   */
  active: {
    get: function get() {
      return this._simulator.active;
    },
    visible: false
  },

  /**
   * !#en Maximum particles of the system.
   * !#zh 粒子最大数量。
   * @property {Number} totalParticles
   * @default 150
   */
  totalParticles: 150,

  /**
   * !#en How many seconds the emitter wil run. -1 means 'forever'.
   * !#zh 发射器生存时间，单位秒，-1表示持续发射。
   * @property {Number} duration
   * @default ParticleSystem.DURATION_INFINITY
   */
  duration: -1,

  /**
   * !#en Emission rate of the particles.
   * !#zh 每秒发射的粒子数目。
   * @property {Number} emissionRate
   * @default 10
   */
  emissionRate: 10,

  /**
   * !#en Life of each particle setter.
   * !#zh 粒子的运行时间。
   * @property {Number} life
   * @default 1
   */
  life: 1,

  /**
   * !#en Variation of life.
   * !#zh 粒子的运行时间变化范围。
   * @property {Number} lifeVar
   * @default 0
   */
  lifeVar: 0,

  /**
   * !#en Start color of each particle.
   * !#zh 粒子初始颜色。
   * @property {cc.Color} startColor
   * @default {r: 255, g: 255, b: 255, a: 255}
   */
  _startColor: null,
  startColor: {
    type: cc.Color,
    get: function get() {
      return this._startColor;
    },
    set: function set(val) {
      this._startColor.r = val.r;
      this._startColor.g = val.g;
      this._startColor.b = val.b;
      this._startColor.a = val.a;
    }
  },

  /**
   * !#en Variation of the start color.
   * !#zh 粒子初始颜色变化范围。
   * @property {cc.Color} startColorVar
   * @default {r: 0, g: 0, b: 0, a: 0}
   */
  _startColorVar: null,
  startColorVar: {
    type: cc.Color,
    get: function get() {
      return this._startColorVar;
    },
    set: function set(val) {
      this._startColorVar.r = val.r;
      this._startColorVar.g = val.g;
      this._startColorVar.b = val.b;
      this._startColorVar.a = val.a;
    }
  },

  /**
   * !#en Ending color of each particle.
   * !#zh 粒子结束颜色。
   * @property {cc.Color} endColor
   * @default {r: 255, g: 255, b: 255, a: 0}
   */
  _endColor: null,
  endColor: {
    type: cc.Color,
    get: function get() {
      return this._endColor;
    },
    set: function set(val) {
      this._endColor.r = val.r;
      this._endColor.g = val.g;
      this._endColor.b = val.b;
      this._endColor.a = val.a;
    }
  },

  /**
   * !#en Variation of the end color.
   * !#zh 粒子结束颜色变化范围。
   * @property {cc.Color} endColorVar
   * @default {r: 0, g: 0, b: 0, a: 0}
   */
  _endColorVar: null,
  endColorVar: {
    type: cc.Color,
    get: function get() {
      return this._endColorVar;
    },
    set: function set(val) {
      this._endColorVar.r = val.r;
      this._endColorVar.g = val.g;
      this._endColorVar.b = val.b;
      this._endColorVar.a = val.a;
    }
  },

  /**
   * !#en Angle of each particle setter.
   * !#zh 粒子角度。
   * @property {Number} angle
   * @default 90
   */
  angle: 90,

  /**
   * !#en Variation of angle of each particle setter.
   * !#zh 粒子角度变化范围。
   * @property {Number} angleVar
   * @default 20
   */
  angleVar: 20,

  /**
   * !#en Start size in pixels of each particle.
   * !#zh 粒子的初始大小。
   * @property {Number} startSize
   * @default 50
   */
  startSize: 50,

  /**
   * !#en Variation of start size in pixels.
   * !#zh 粒子初始大小的变化范围。
   * @property {Number} startSizeVar
   * @default 0
   */
  startSizeVar: 0,

  /**
   * !#en End size in pixels of each particle.
   * !#zh 粒子结束时的大小。
   * @property {Number} endSize
   * @default 0
   */
  endSize: 0,

  /**
   * !#en Variation of end size in pixels.
   * !#zh 粒子结束大小的变化范围。
   * @property {Number} endSizeVar
   * @default 0
   */
  endSizeVar: 0,

  /**
   * !#en Start angle of each particle.
   * !#zh 粒子开始自旋角度。
   * @property {Number} startSpin
   * @default 0
   */
  startSpin: 0,

  /**
   * !#en Variation of start angle.
   * !#zh 粒子开始自旋角度变化范围。
   * @property {Number} startSpinVar
   * @default 0
   */
  startSpinVar: 0,

  /**
   * !#en End angle of each particle.
   * !#zh 粒子结束自旋角度。
   * @property {Number} endSpin
   * @default 0
   */
  endSpin: 0,

  /**
   * !#en Variation of end angle.
   * !#zh 粒子结束自旋角度变化范围。
   * @property {Number} endSpinVar
   * @default 0
   */
  endSpinVar: 0,

  /**
   * !#en Source position of the emitter.
   * !#zh 发射器位置。
   * @property {Vec2} sourcePos
   * @default cc.Vec2.ZERO
   */
  sourcePos: cc.Vec2.ZERO,

  /**
   * !#en Variation of source position.
   * !#zh 发射器位置的变化范围。（横向和纵向）
   * @property {Vec2} posVar
   * @default cc.Vec2.ZERO
   */
  posVar: cc.Vec2.ZERO,

  /**
   * !#en Particles movement type.
   * !#zh 粒子位置类型。
   * @property {ParticleSystem.PositionType} positionType
   * @default ParticleSystem.PositionType.FREE
   */
  _positionType: {
    "default": PositionType.FREE,
    formerlySerializedAs: "positionType"
  },
  positionType: {
    type: PositionType,
    get: function get() {
      return this._positionType;
    },
    set: function set(val) {
      this._positionType = val;

      this._updateMaterial();
    }
  },

  /**
   * !#en Particles emitter modes.
   * !#zh 发射器类型。
   * @property {ParticleSystem.EmitterMode} emitterMode
   * @default ParticleSystem.EmitterMode.GRAVITY
   */
  emitterMode: {
    "default": EmitterMode.GRAVITY,
    type: EmitterMode
  },
  // GRAVITY MODE

  /**
   * !#en Gravity of the emitter.
   * !#zh 重力。
   * @property {Vec2} gravity
   * @default cc.Vec2.ZERO
   */
  gravity: cc.Vec2.ZERO,

  /**
   * !#en Speed of the emitter.
   * !#zh 速度。
   * @property {Number} speed
   * @default 180
   */
  speed: 180,

  /**
   * !#en Variation of the speed.
   * !#zh 速度变化范围。
   * @property {Number} speedVar
   * @default 50
   */
  speedVar: 50,

  /**
   * !#en Tangential acceleration of each particle. Only available in 'Gravity' mode.
   * !#zh 每个粒子的切向加速度，即垂直于重力方向的加速度，只有在重力模式下可用。
   * @property {Number} tangentialAccel
   * @default 80
   */
  tangentialAccel: 80,

  /**
   * !#en Variation of the tangential acceleration.
   * !#zh 每个粒子的切向加速度变化范围。
   * @property {Number} tangentialAccelVar
   * @default 0
   */
  tangentialAccelVar: 0,

  /**
   * !#en Acceleration of each particle. Only available in 'Gravity' mode.
   * !#zh 粒子径向加速度，即平行于重力方向的加速度，只有在重力模式下可用。
   * @property {Number} radialAccel
   * @default 0
   */
  radialAccel: 0,

  /**
   * !#en Variation of the radial acceleration.
   * !#zh 粒子径向加速度变化范围。
   * @property {Number} radialAccelVar
   * @default 0
   */
  radialAccelVar: 0,

  /**
   * !#en Indicate whether the rotation of each particle equals to its direction. Only available in 'Gravity' mode.
   * !#zh 每个粒子的旋转是否等于其方向，只有在重力模式下可用。
   * @property {Boolean} rotationIsDir
   * @default false
   */
  rotationIsDir: false,
  // RADIUS MODE

  /**
   * !#en Starting radius of the particles. Only available in 'Radius' mode.
   * !#zh 初始半径，表示粒子出生时相对发射器的距离，只有在半径模式下可用。
   * @property {Number} startRadius
   * @default 0
   */
  startRadius: 0,

  /**
   * !#en Variation of the starting radius.
   * !#zh 初始半径变化范围。
   * @property {Number} startRadiusVar
   * @default 0
   */
  startRadiusVar: 0,

  /**
   * !#en Ending radius of the particles. Only available in 'Radius' mode.
   * !#zh 结束半径，只有在半径模式下可用。
   * @property {Number} endRadius
   * @default 0
   */
  endRadius: 0,

  /**
   * !#en Variation of the ending radius.
   * !#zh 结束半径变化范围。
   * @property {Number} endRadiusVar
   * @default 0
   */
  endRadiusVar: 0,

  /**
   * !#en Number of degress to rotate a particle around the source pos per second. Only available in 'Radius' mode.
   * !#zh 粒子每秒围绕起始点的旋转角度，只有在半径模式下可用。
   * @property {Number} rotatePerS
   * @default 0
   */
  rotatePerS: 0,

  /**
   * !#en Variation of the degress to rotate a particle around the source pos per second.
   * !#zh 粒子每秒围绕起始点的旋转角度变化范围。
   * @property {Number} rotatePerSVar
   * @default 0
   */
  rotatePerSVar: 0
};
/**
 * Particle System base class. <br/>
 * Attributes of a Particle System:<br/>
 *  - emmision rate of the particles<br/>
 *  - Gravity Mode (Mode A): <br/>
 *  - gravity <br/>
 *  - direction <br/>
 *  - speed +-  variance <br/>
 *  - tangential acceleration +- variance<br/>
 *  - radial acceleration +- variance<br/>
 *  - Radius Mode (Mode B):      <br/>
 *  - startRadius +- variance    <br/>
 *  - endRadius +- variance      <br/>
 *  - rotate +- variance         <br/>
 *  - Properties common to all modes: <br/>
 *  - life +- life variance      <br/>
 *  - start spin +- variance     <br/>
 *  - end spin +- variance       <br/>
 *  - start size +- variance     <br/>
 *  - end size +- variance       <br/>
 *  - start color +- variance    <br/>
 *  - end color +- variance      <br/>
 *  - life +- variance           <br/>
 *  - blending function          <br/>
 *  - texture                    <br/>
 * <br/>
 * cocos2d also supports particles generated by Particle Designer (http://particledesigner.71squared.com/).<br/>
 * 'Radius Mode' in Particle Designer uses a fixed emit rate of 30 hz. Since that can't be guarateed in cocos2d,  <br/>
 * cocos2d uses a another approach, but the results are almost identical.<br/>
 * cocos2d supports all the variables used by Particle Designer plus a bit more:  <br/>
 *  - spinning particles (supported when using ParticleSystem)       <br/>
 *  - tangential acceleration (Gravity mode)                               <br/>
 *  - radial acceleration (Gravity mode)                                   <br/>
 *  - radius direction (Radius mode) (Particle Designer supports outwards to inwards direction only) <br/>
 * It is possible to customize any of the above mentioned properties in runtime. Example:   <br/>
 *
 * @example
 * emitter.radialAccel = 15;
 * emitter.startSpin = 0;
 *
 * @class ParticleSystem
 * @extends RenderComponent
 * @uses BlendFunc
 */

var ParticleSystem = cc.Class({
  name: 'cc.ParticleSystem',
  "extends": RenderComponent,
  mixins: [BlendFunc],
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.renderers/ParticleSystem',
    inspector: 'packages://inspector/inspectors/comps/particle-system.js',
    playOnFocus: true,
    executeInEditMode: true
  },
  ctor: function ctor() {
    this.initProperties();
  },
  initProperties: function initProperties() {
    this._previewTimer = null;
    this._focused = false;
    this._aspectRatio = 1;
    this._simulator = new ParticleSimulator(this); // colors

    this._startColor = cc.color(255, 255, 255, 255);
    this._startColorVar = cc.color(0, 0, 0, 0);
    this._endColor = cc.color(255, 255, 255, 0);
    this._endColorVar = cc.color(0, 0, 0, 0); // The temporary SpriteFrame object used for the renderer. Because there is no corresponding asset, it can't be serialized.

    this._renderSpriteFrame = null;
  },
  properties: properties,
  statics: {
    /**
     * !#en The Particle emitter lives forever.
     * !#zh 表示发射器永久存在
     * @property {Number} DURATION_INFINITY
     * @default -1
     * @static
     * @readonly
     */
    DURATION_INFINITY: -1,

    /**
     * !#en The starting size of the particle is equal to the ending size.
     * !#zh 表示粒子的起始大小等于结束大小。
     * @property {Number} START_SIZE_EQUAL_TO_END_SIZE
     * @default -1
     * @static
     * @readonly
     */
    START_SIZE_EQUAL_TO_END_SIZE: -1,

    /**
     * !#en The starting radius of the particle is equal to the ending radius.
     * !#zh 表示粒子的起始半径等于结束半径。
     * @property {Number} START_RADIUS_EQUAL_TO_END_RADIUS
     * @default -1
     * @static
     * @readonly
     */
    START_RADIUS_EQUAL_TO_END_RADIUS: -1,
    EmitterMode: EmitterMode,
    PositionType: PositionType,
    _PNGReader: PNGReader,
    _TIFFReader: tiffReader
  },
  // EDITOR RELATED METHODS
  onFocusInEditor: CC_EDITOR && function () {
    this._focused = true;
    var components = getParticleComponents(this.node);

    for (var i = 0; i < components.length; ++i) {
      components[i]._startPreview();
    }
  },
  onLostFocusInEditor: CC_EDITOR && function () {
    this._focused = false;
    var components = getParticleComponents(this.node);

    for (var i = 0; i < components.length; ++i) {
      components[i]._stopPreview();
    }
  },
  _startPreview: CC_EDITOR && function () {
    if (this.preview) {
      this.resetSystem();
    }
  },
  _stopPreview: CC_EDITOR && function () {
    if (this.preview) {
      this.resetSystem();
      this.stopSystem();
      this.disableRender();
      cc.engine.repaintInEditMode();
    }

    if (this._previewTimer) {
      clearInterval(this._previewTimer);
    }
  },
  // LIFE-CYCLE METHODS
  // just used to read data from 1.x
  _convertTextureToSpriteFrame: CC_EDITOR && function () {
    if (this._spriteFrame) {
      return;
    }

    var texture = this.texture;

    if (!texture || !texture._uuid) {
      return;
    }

    var _this = this;

    Editor.assetdb.queryMetaInfoByUuid(texture._uuid, function (err, metaInfo) {
      if (err) return Editor.error(err);
      var meta = JSON.parse(metaInfo.json);

      if (meta.type === 'raw') {
        var NodeUtils = Editor.require('app://editor/page/scene-utils/utils/node');

        var nodePath = NodeUtils.getNodePath(_this.node);
        return Editor.warn("The texture " + metaInfo.assetUrl + " used by particle " + nodePath + " does not contain any SpriteFrame, please set the texture type to Sprite and reassign the SpriteFrame to the particle component.");
      } else {
        var Url = require('fire-url');

        var name = Url.basenameNoExt(metaInfo.assetPath);
        var uuid = meta.subMetas[name].uuid;
        cc.AssetLibrary.loadAsset(uuid, function (err, sp) {
          if (err) return Editor.error(err);
          _this.spriteFrame = sp;
        });
      }
    });
  },
  __preload: function __preload() {
    this._super();

    if (CC_EDITOR) {
      this._convertTextureToSpriteFrame();
    }

    if (this._custom && this.spriteFrame && !this._renderSpriteFrame) {
      this._applySpriteFrame(this.spriteFrame);
    } else if (this._file) {
      if (this._custom) {
        var missCustomTexture = !this._getTexture();

        if (missCustomTexture) {
          this._applyFile();
        }
      } else {
        this._applyFile();
      }
    } // auto play


    if (!CC_EDITOR || cc.engine.isPlaying) {
      if (this.playOnLoad) {
        this.resetSystem();
      }
    } // Upgrade color type from v2.0.0


    if (CC_EDITOR && !(this._startColor instanceof cc.Color)) {
      this._startColor = cc.color(this._startColor);
      this._startColorVar = cc.color(this._startColorVar);
      this._endColor = cc.color(this._endColor);
      this._endColorVar = cc.color(this._endColorVar);
    }
  },
  onDestroy: function onDestroy() {
    if (this.autoRemoveOnFinish) {
      this.autoRemoveOnFinish = false; // already removed
    }

    if (this._buffer) {
      this._buffer.destroy();

      this._buffer = null;
    } // reset uv data so next time simulator will refill buffer uv info when exit edit mode from prefab.


    this._simulator._uvFilled = 0;

    this._super();
  },
  lateUpdate: function lateUpdate(dt) {
    if (!this._simulator.finished) {
      this._simulator.step(dt);
    }
  },
  // APIS

  /*
   * !#en Add a particle to the emitter.
   * !#zh 添加一个粒子到发射器中。
   * @method addParticle
   * @return {Boolean}
   */
  addParticle: function addParticle() {// Not implemented
  },

  /**
   * !#en Stop emitting particles. Running particles will continue to run until they die.
   * !#zh 停止发射器发射粒子，发射出去的粒子将继续运行，直至粒子生命结束。
   * @method stopSystem
   * @example
   * // stop particle system.
   * myParticleSystem.stopSystem();
   */
  stopSystem: function stopSystem() {
    this._stopped = true;

    this._simulator.stop();
  },

  /**
   * !#en Kill all living particles.
   * !#zh 杀死所有存在的粒子，然后重新启动粒子发射器。
   * @method resetSystem
   * @example
   * // play particle system.
   * myParticleSystem.resetSystem();
   */
  resetSystem: function resetSystem() {
    this._stopped = false;

    this._simulator.reset();

    this.markForRender(true);
  },

  /**
   * !#en Whether or not the system is full.
   * !#zh 发射器中粒子是否大于等于设置的总粒子数量。
   * @method isFull
   * @return {Boolean}
   */
  isFull: function isFull() {
    return this.particleCount >= this.totalParticles;
  },

  /**
   * !#en Sets a new texture with a rect. The rect is in texture position and size.
   * Please use spriteFrame property instead, this function is deprecated since v1.9
   * !#zh 设置一张新贴图和关联的矩形。
   * 请直接设置 spriteFrame 属性，这个函数从 v1.9 版本开始已经被废弃
   * @method setTextureWithRect
   * @param {Texture2D} texture
   * @param {Rect} rect
   * @deprecated since v1.9
   */
  setTextureWithRect: function setTextureWithRect(texture, rect) {
    if (texture instanceof cc.Texture2D) {
      this.spriteFrame = new cc.SpriteFrame(texture, rect);
    }
  },
  // PRIVATE METHODS
  _applyFile: function _applyFile() {
    var file = this._file;

    if (file) {
      var self = this;
      cc.loader.load(file.nativeUrl, function (err, content) {
        if (err || !content) {
          cc.errorID(6029);
          return;
        }

        if (!self.isValid) {
          return;
        }

        self._plistFile = file.nativeUrl;

        if (!self._custom) {
          self._initWithDictionary(content);
        }

        if (!self._spriteFrame) {
          if (file.spriteFrame) {
            self.spriteFrame = file.spriteFrame;
          } else if (self._custom) {
            self._initTextureWithDictionary(content);
          }
        } else if (!self._renderSpriteFrame && self._spriteFrame) {
          self._applySpriteFrame(self.spriteFrame);
        }
      });
    }
  },
  _initTextureWithDictionary: function _initTextureWithDictionary(dict) {
    var imgPath = cc.path.changeBasename(this._plistFile, dict["textureFileName"] || ''); // texture

    if (dict["textureFileName"]) {
      // Try to get the texture from the cache
      textureUtil.loadImage(imgPath, function (error, texture) {
        if (error) {
          dict["textureFileName"] = undefined;

          this._initTextureWithDictionary(dict);
        } else {
          this.spriteFrame = new cc.SpriteFrame(texture);
        }
      }, this);
    } else if (dict["textureImageData"]) {
      var textureData = dict["textureImageData"];

      if (textureData && textureData.length > 0) {
        var tex = cc.loader.getRes(imgPath);

        if (!tex) {
          var buffer = codec.unzipBase64AsArray(textureData, 1);

          if (!buffer) {
            cc.logID(6030);
            return false;
          }

          var imageFormat = getImageFormatByData(buffer);

          if (imageFormat !== macro.ImageFormat.TIFF && imageFormat !== macro.ImageFormat.PNG) {
            cc.logID(6031);
            return false;
          }

          var canvasObj = document.createElement("canvas");

          if (imageFormat === macro.ImageFormat.PNG) {
            var myPngObj = new PNGReader(buffer);
            myPngObj.render(canvasObj);
          } else {
            tiffReader.parseTIFF(buffer, canvasObj);
          }

          tex = textureUtil.cacheImage(imgPath, canvasObj);
        }

        if (!tex) cc.logID(6032); // TODO: Use cc.loader to load asynchronously the SpriteFrame object, avoid using textureUtil

        this.spriteFrame = new cc.SpriteFrame(tex);
      } else {
        return false;
      }
    }

    return true;
  },
  // parsing process
  _initWithDictionary: function _initWithDictionary(dict) {
    this.totalParticles = parseInt(dict["maxParticles"] || 0); // life span

    this.life = parseFloat(dict["particleLifespan"] || 0);
    this.lifeVar = parseFloat(dict["particleLifespanVariance"] || 0); // emission Rate

    var _tempEmissionRate = dict["emissionRate"];

    if (_tempEmissionRate) {
      this.emissionRate = _tempEmissionRate;
    } else {
      this.emissionRate = Math.min(this.totalParticles / this.life, Number.MAX_VALUE);
    } // duration


    this.duration = parseFloat(dict["duration"] || 0); // blend function

    this.srcBlendFactor = parseInt(dict["blendFuncSource"] || macro.SRC_ALPHA);
    this.dstBlendFactor = parseInt(dict["blendFuncDestination"] || macro.ONE_MINUS_SRC_ALPHA); // color

    var locStartColor = this._startColor;
    locStartColor.r = parseFloat(dict["startColorRed"] || 0) * 255;
    locStartColor.g = parseFloat(dict["startColorGreen"] || 0) * 255;
    locStartColor.b = parseFloat(dict["startColorBlue"] || 0) * 255;
    locStartColor.a = parseFloat(dict["startColorAlpha"] || 0) * 255;
    var locStartColorVar = this._startColorVar;
    locStartColorVar.r = parseFloat(dict["startColorVarianceRed"] || 0) * 255;
    locStartColorVar.g = parseFloat(dict["startColorVarianceGreen"] || 0) * 255;
    locStartColorVar.b = parseFloat(dict["startColorVarianceBlue"] || 0) * 255;
    locStartColorVar.a = parseFloat(dict["startColorVarianceAlpha"] || 0) * 255;
    var locEndColor = this._endColor;
    locEndColor.r = parseFloat(dict["finishColorRed"] || 0) * 255;
    locEndColor.g = parseFloat(dict["finishColorGreen"] || 0) * 255;
    locEndColor.b = parseFloat(dict["finishColorBlue"] || 0) * 255;
    locEndColor.a = parseFloat(dict["finishColorAlpha"] || 0) * 255;
    var locEndColorVar = this._endColorVar;
    locEndColorVar.r = parseFloat(dict["finishColorVarianceRed"] || 0) * 255;
    locEndColorVar.g = parseFloat(dict["finishColorVarianceGreen"] || 0) * 255;
    locEndColorVar.b = parseFloat(dict["finishColorVarianceBlue"] || 0) * 255;
    locEndColorVar.a = parseFloat(dict["finishColorVarianceAlpha"] || 0) * 255; // particle size

    this.startSize = parseFloat(dict["startParticleSize"] || 0);
    this.startSizeVar = parseFloat(dict["startParticleSizeVariance"] || 0);
    this.endSize = parseFloat(dict["finishParticleSize"] || 0);
    this.endSizeVar = parseFloat(dict["finishParticleSizeVariance"] || 0); // position
    // Make empty positionType value and old version compatible

    this.positionType = parseFloat(dict['positionType'] !== undefined ? dict['positionType'] : PositionType.RELATIVE); // for 

    this.sourcePos.x = 0;
    this.sourcePos.y = 0;
    this.posVar.x = parseFloat(dict["sourcePositionVariancex"] || 0);
    this.posVar.y = parseFloat(dict["sourcePositionVariancey"] || 0); // angle

    this.angle = parseFloat(dict["angle"] || 0);
    this.angleVar = parseFloat(dict["angleVariance"] || 0); // Spinning

    this.startSpin = parseFloat(dict["rotationStart"] || 0);
    this.startSpinVar = parseFloat(dict["rotationStartVariance"] || 0);
    this.endSpin = parseFloat(dict["rotationEnd"] || 0);
    this.endSpinVar = parseFloat(dict["rotationEndVariance"] || 0);
    this.emitterMode = parseInt(dict["emitterType"] || EmitterMode.GRAVITY); // Mode A: Gravity + tangential accel + radial accel

    if (this.emitterMode === EmitterMode.GRAVITY) {
      // gravity
      this.gravity.x = parseFloat(dict["gravityx"] || 0);
      this.gravity.y = parseFloat(dict["gravityy"] || 0); // speed

      this.speed = parseFloat(dict["speed"] || 0);
      this.speedVar = parseFloat(dict["speedVariance"] || 0); // radial acceleration

      this.radialAccel = parseFloat(dict["radialAcceleration"] || 0);
      this.radialAccelVar = parseFloat(dict["radialAccelVariance"] || 0); // tangential acceleration

      this.tangentialAccel = parseFloat(dict["tangentialAcceleration"] || 0);
      this.tangentialAccelVar = parseFloat(dict["tangentialAccelVariance"] || 0); // rotation is dir

      var locRotationIsDir = dict["rotationIsDir"] || "";

      if (locRotationIsDir !== null) {
        locRotationIsDir = locRotationIsDir.toString().toLowerCase();
        this.rotationIsDir = locRotationIsDir === "true" || locRotationIsDir === "1";
      } else {
        this.rotationIsDir = false;
      }
    } else if (this.emitterMode === EmitterMode.RADIUS) {
      // or Mode B: radius movement
      this.startRadius = parseFloat(dict["maxRadius"] || 0);
      this.startRadiusVar = parseFloat(dict["maxRadiusVariance"] || 0);
      this.endRadius = parseFloat(dict["minRadius"] || 0);
      this.endRadiusVar = parseFloat(dict["minRadiusVariance"] || 0);
      this.rotatePerS = parseFloat(dict["rotatePerSecond"] || 0);
      this.rotatePerSVar = parseFloat(dict["rotatePerSecondVariance"] || 0);
    } else {
      cc.warnID(6009);
      return false;
    }

    this._initTextureWithDictionary(dict);

    return true;
  },
  _validateRender: function _validateRender() {
    var texture = this._getTexture();

    if (!texture || !texture.loaded) {
      this.disableRender();
      return;
    }

    this._super();
  },
  _onTextureLoaded: function _onTextureLoaded() {
    this._simulator.updateUVs(true);

    this._syncAspect();

    this._updateMaterial();

    this.markForRender(true);
  },
  _syncAspect: function _syncAspect() {
    var frameRect = this._renderSpriteFrame._rect;
    this._aspectRatio = frameRect.width / frameRect.height;
  },
  _applySpriteFrame: function _applySpriteFrame() {
    this._renderSpriteFrame = this._renderSpriteFrame || this._spriteFrame;

    if (this._renderSpriteFrame) {
      if (this._renderSpriteFrame.textureLoaded()) {
        this._onTextureLoaded();
      } else {
        this._renderSpriteFrame.onTextureLoaded(this._onTextureLoaded, this);
      }
    }
  },
  _getTexture: function _getTexture() {
    return this._renderSpriteFrame && this._renderSpriteFrame.getTexture() || this._texture;
  },
  _updateMaterial: function _updateMaterial() {
    var material = this._materials[0];
    if (!material) return;
    material.define('CC_USE_MODEL', this._positionType !== PositionType.FREE);
    material.setProperty('texture', this._getTexture());

    BlendFunc.prototype._updateMaterial.call(this);
  },
  _finishedSimulation: function _finishedSimulation() {
    if (CC_EDITOR) {
      if (this.preview && this._focused && !this.active && !cc.engine.isPlaying) {
        this.resetSystem();
      }

      return;
    }

    this.resetSystem();
    this.stopSystem();
    this.disableRender();

    if (this.autoRemoveOnFinish && this._stopped) {
      this.node.destroy();
    }
  }
});
cc.ParticleSystem = module.exports = ParticleSystem;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDUGFydGljbGVTeXN0ZW0uanMiXSwibmFtZXMiOlsibWFjcm8iLCJyZXF1aXJlIiwiUGFydGljbGVBc3NldCIsIlJlbmRlckNvbXBvbmVudCIsImNvZGVjIiwiUE5HUmVhZGVyIiwidGlmZlJlYWRlciIsInRleHR1cmVVdGlsIiwiUmVuZGVyRmxvdyIsIlBhcnRpY2xlU2ltdWxhdG9yIiwiTWF0ZXJpYWwiLCJCbGVuZEZ1bmMiLCJnZXRJbWFnZUZvcm1hdEJ5RGF0YSIsImltZ0RhdGEiLCJsZW5ndGgiLCJJbWFnZUZvcm1hdCIsIlBORyIsIlRJRkYiLCJVTktOT1dOIiwiZ2V0UGFydGljbGVDb21wb25lbnRzIiwibm9kZSIsInBhcmVudCIsImNvbXAiLCJnZXRDb21wb25lbnQiLCJjYyIsIlBhcnRpY2xlU3lzdGVtIiwiZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW4iLCJFbWl0dGVyTW9kZSIsIkVudW0iLCJHUkFWSVRZIiwiUkFESVVTIiwiUG9zaXRpb25UeXBlIiwiRlJFRSIsIlJFTEFUSVZFIiwiR1JPVVBFRCIsInByb3BlcnRpZXMiLCJwcmV2aWV3IiwiZWRpdG9yT25seSIsIm5vdGlmeSIsIkNDX0VESVRPUiIsInJlc2V0U3lzdGVtIiwic3RvcFN5c3RlbSIsImRpc2FibGVSZW5kZXIiLCJlbmdpbmUiLCJyZXBhaW50SW5FZGl0TW9kZSIsImFuaW1hdGFibGUiLCJ0b29sdGlwIiwiQ0NfREVWIiwiX2N1c3RvbSIsImN1c3RvbSIsImdldCIsInNldCIsInZhbHVlIiwiX2ZpbGUiLCJ3YXJuSUQiLCJfYXBwbHlGaWxlIiwidHlwZSIsImZpbGUiLCJmb3JjZSIsIl9zcHJpdGVGcmFtZSIsIlNwcml0ZUZyYW1lIiwic3ByaXRlRnJhbWUiLCJsYXN0U3ByaXRlIiwiX3JlbmRlclNwcml0ZUZyYW1lIiwiX3V1aWQiLCJnZXRUZXh0dXJlIiwiX2FwcGx5U3ByaXRlRnJhbWUiLCJlbWl0IiwiX3RleHR1cmUiLCJUZXh0dXJlMkQiLCJ0ZXh0dXJlIiwiX2dldFRleHR1cmUiLCJyZWFkb25seSIsInZpc2libGUiLCJwYXJ0aWNsZUNvdW50IiwiX3NpbXVsYXRvciIsInBhcnRpY2xlcyIsIl9zdG9wcGVkIiwic3RvcHBlZCIsInBsYXlPbkxvYWQiLCJhdXRvUmVtb3ZlT25GaW5pc2giLCJhY3RpdmUiLCJ0b3RhbFBhcnRpY2xlcyIsImR1cmF0aW9uIiwiZW1pc3Npb25SYXRlIiwibGlmZSIsImxpZmVWYXIiLCJfc3RhcnRDb2xvciIsInN0YXJ0Q29sb3IiLCJDb2xvciIsInZhbCIsInIiLCJnIiwiYiIsImEiLCJfc3RhcnRDb2xvclZhciIsInN0YXJ0Q29sb3JWYXIiLCJfZW5kQ29sb3IiLCJlbmRDb2xvciIsIl9lbmRDb2xvclZhciIsImVuZENvbG9yVmFyIiwiYW5nbGUiLCJhbmdsZVZhciIsInN0YXJ0U2l6ZSIsInN0YXJ0U2l6ZVZhciIsImVuZFNpemUiLCJlbmRTaXplVmFyIiwic3RhcnRTcGluIiwic3RhcnRTcGluVmFyIiwiZW5kU3BpbiIsImVuZFNwaW5WYXIiLCJzb3VyY2VQb3MiLCJWZWMyIiwiWkVSTyIsInBvc1ZhciIsIl9wb3NpdGlvblR5cGUiLCJmb3JtZXJseVNlcmlhbGl6ZWRBcyIsInBvc2l0aW9uVHlwZSIsIl91cGRhdGVNYXRlcmlhbCIsImVtaXR0ZXJNb2RlIiwiZ3Jhdml0eSIsInNwZWVkIiwic3BlZWRWYXIiLCJ0YW5nZW50aWFsQWNjZWwiLCJ0YW5nZW50aWFsQWNjZWxWYXIiLCJyYWRpYWxBY2NlbCIsInJhZGlhbEFjY2VsVmFyIiwicm90YXRpb25Jc0RpciIsInN0YXJ0UmFkaXVzIiwic3RhcnRSYWRpdXNWYXIiLCJlbmRSYWRpdXMiLCJlbmRSYWRpdXNWYXIiLCJyb3RhdGVQZXJTIiwicm90YXRlUGVyU1ZhciIsIkNsYXNzIiwibmFtZSIsIm1peGlucyIsImVkaXRvciIsIm1lbnUiLCJpbnNwZWN0b3IiLCJwbGF5T25Gb2N1cyIsImV4ZWN1dGVJbkVkaXRNb2RlIiwiY3RvciIsImluaXRQcm9wZXJ0aWVzIiwiX3ByZXZpZXdUaW1lciIsIl9mb2N1c2VkIiwiX2FzcGVjdFJhdGlvIiwiY29sb3IiLCJzdGF0aWNzIiwiRFVSQVRJT05fSU5GSU5JVFkiLCJTVEFSVF9TSVpFX0VRVUFMX1RPX0VORF9TSVpFIiwiU1RBUlRfUkFESVVTX0VRVUFMX1RPX0VORF9SQURJVVMiLCJfUE5HUmVhZGVyIiwiX1RJRkZSZWFkZXIiLCJvbkZvY3VzSW5FZGl0b3IiLCJjb21wb25lbnRzIiwiaSIsIl9zdGFydFByZXZpZXciLCJvbkxvc3RGb2N1c0luRWRpdG9yIiwiX3N0b3BQcmV2aWV3IiwiY2xlYXJJbnRlcnZhbCIsIl9jb252ZXJ0VGV4dHVyZVRvU3ByaXRlRnJhbWUiLCJfdGhpcyIsIkVkaXRvciIsImFzc2V0ZGIiLCJxdWVyeU1ldGFJbmZvQnlVdWlkIiwiZXJyIiwibWV0YUluZm8iLCJlcnJvciIsIm1ldGEiLCJKU09OIiwicGFyc2UiLCJqc29uIiwiTm9kZVV0aWxzIiwibm9kZVBhdGgiLCJnZXROb2RlUGF0aCIsIndhcm4iLCJhc3NldFVybCIsIlVybCIsImJhc2VuYW1lTm9FeHQiLCJhc3NldFBhdGgiLCJ1dWlkIiwic3ViTWV0YXMiLCJBc3NldExpYnJhcnkiLCJsb2FkQXNzZXQiLCJzcCIsIl9fcHJlbG9hZCIsIl9zdXBlciIsIm1pc3NDdXN0b21UZXh0dXJlIiwiaXNQbGF5aW5nIiwib25EZXN0cm95IiwiX2J1ZmZlciIsImRlc3Ryb3kiLCJfdXZGaWxsZWQiLCJsYXRlVXBkYXRlIiwiZHQiLCJmaW5pc2hlZCIsInN0ZXAiLCJhZGRQYXJ0aWNsZSIsInN0b3AiLCJyZXNldCIsIm1hcmtGb3JSZW5kZXIiLCJpc0Z1bGwiLCJzZXRUZXh0dXJlV2l0aFJlY3QiLCJyZWN0Iiwic2VsZiIsImxvYWRlciIsImxvYWQiLCJuYXRpdmVVcmwiLCJjb250ZW50IiwiZXJyb3JJRCIsImlzVmFsaWQiLCJfcGxpc3RGaWxlIiwiX2luaXRXaXRoRGljdGlvbmFyeSIsIl9pbml0VGV4dHVyZVdpdGhEaWN0aW9uYXJ5IiwiZGljdCIsImltZ1BhdGgiLCJwYXRoIiwiY2hhbmdlQmFzZW5hbWUiLCJsb2FkSW1hZ2UiLCJ1bmRlZmluZWQiLCJ0ZXh0dXJlRGF0YSIsInRleCIsImdldFJlcyIsImJ1ZmZlciIsInVuemlwQmFzZTY0QXNBcnJheSIsImxvZ0lEIiwiaW1hZ2VGb3JtYXQiLCJjYW52YXNPYmoiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJteVBuZ09iaiIsInJlbmRlciIsInBhcnNlVElGRiIsImNhY2hlSW1hZ2UiLCJwYXJzZUludCIsInBhcnNlRmxvYXQiLCJfdGVtcEVtaXNzaW9uUmF0ZSIsIk1hdGgiLCJtaW4iLCJOdW1iZXIiLCJNQVhfVkFMVUUiLCJzcmNCbGVuZEZhY3RvciIsIlNSQ19BTFBIQSIsImRzdEJsZW5kRmFjdG9yIiwiT05FX01JTlVTX1NSQ19BTFBIQSIsImxvY1N0YXJ0Q29sb3IiLCJsb2NTdGFydENvbG9yVmFyIiwibG9jRW5kQ29sb3IiLCJsb2NFbmRDb2xvclZhciIsIngiLCJ5IiwibG9jUm90YXRpb25Jc0RpciIsInRvU3RyaW5nIiwidG9Mb3dlckNhc2UiLCJfdmFsaWRhdGVSZW5kZXIiLCJsb2FkZWQiLCJfb25UZXh0dXJlTG9hZGVkIiwidXBkYXRlVVZzIiwiX3N5bmNBc3BlY3QiLCJmcmFtZVJlY3QiLCJfcmVjdCIsIndpZHRoIiwiaGVpZ2h0IiwidGV4dHVyZUxvYWRlZCIsIm9uVGV4dHVyZUxvYWRlZCIsIm1hdGVyaWFsIiwiX21hdGVyaWFscyIsImRlZmluZSIsInNldFByb3BlcnR5IiwicHJvdG90eXBlIiwiY2FsbCIsIl9maW5pc2hlZFNpbXVsYXRpb24iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkEsSUFBTUEsS0FBSyxHQUFHQyxPQUFPLENBQUMsMEJBQUQsQ0FBckI7O0FBQ0EsSUFBTUMsYUFBYSxHQUFHRCxPQUFPLENBQUMsbUJBQUQsQ0FBN0I7O0FBQ0EsSUFBTUUsZUFBZSxHQUFHRixPQUFPLENB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QUEsU0FBUyxDQUFDbVEsU0FBVixDQUFvQnhKLGVBQXBCLENBQW9DeUosSUFBcEMsQ0FBeUMsSUFBekM7QUFDSCxHQXRnQnlCO0FBd2dCMUJDLEVBQUFBLG1CQUFtQixFQUFFLCtCQUFZO0FBQzdCLFFBQUl6TyxTQUFKLEVBQWU7QUFDWCxVQUFJLEtBQUtILE9BQUwsSUFBZ0IsS0FBSzZHLFFBQXJCLElBQWlDLENBQUMsS0FBS2hFLE1BQXZDLElBQWlELENBQUN6RCxFQUFFLENBQUNtQixNQUFILENBQVVrSixTQUFoRSxFQUEyRTtBQUN2RSxhQUFLckosV0FBTDtBQUNIOztBQUNEO0FBQ0g7O0FBQ0QsU0FBS0EsV0FBTDtBQUNBLFNBQUtDLFVBQUw7QUFDQSxTQUFLQyxhQUFMOztBQUNBLFFBQUksS0FBS3NDLGtCQUFMLElBQTJCLEtBQUtILFFBQXBDLEVBQThDO0FBQzFDLFdBQUt6RCxJQUFMLENBQVU0SyxPQUFWO0FBQ0g7QUFDSjtBQXJoQnlCLENBQVQsQ0FBckI7QUF3aEJBeEssRUFBRSxDQUFDQyxjQUFILEdBQW9Cd1AsTUFBTSxDQUFDQyxPQUFQLEdBQWlCelAsY0FBckMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNvbnN0IG1hY3JvID0gcmVxdWlyZSgnLi4vY29yZS9wbGF0Zm9ybS9DQ01hY3JvJyk7XG5jb25zdCBQYXJ0aWNsZUFzc2V0ID0gcmVxdWlyZSgnLi9DQ1BhcnRpY2xlQXNzZXQnKTtcbmNvbnN0IFJlbmRlckNvbXBvbmVudCA9IHJlcXVpcmUoJy4uL2NvcmUvY29tcG9uZW50cy9DQ1JlbmRlckNvbXBvbmVudCcpO1xuY29uc3QgY29kZWMgPSByZXF1aXJlKCcuLi9jb21wcmVzc2lvbi9aaXBVdGlscycpO1xuY29uc3QgUE5HUmVhZGVyID0gcmVxdWlyZSgnLi9DQ1BOR1JlYWRlcicpO1xuY29uc3QgdGlmZlJlYWRlciA9IHJlcXVpcmUoJy4vQ0NUSUZGUmVhZGVyJyk7XG5jb25zdCB0ZXh0dXJlVXRpbCA9IHJlcXVpcmUoJy4uL2NvcmUvdXRpbHMvdGV4dHVyZS11dGlsJyk7XG5jb25zdCBSZW5kZXJGbG93ID0gcmVxdWlyZSgnLi4vY29yZS9yZW5kZXJlci9yZW5kZXItZmxvdycpO1xuY29uc3QgUGFydGljbGVTaW11bGF0b3IgPSByZXF1aXJlKCcuL3BhcnRpY2xlLXNpbXVsYXRvcicpO1xuY29uc3QgTWF0ZXJpYWwgPSByZXF1aXJlKCcuLi9jb3JlL2Fzc2V0cy9tYXRlcmlhbC9DQ01hdGVyaWFsJyk7XG5jb25zdCBCbGVuZEZ1bmMgPSByZXF1aXJlKCcuLi9jb3JlL3V0aWxzL2JsZW5kLWZ1bmMnKTtcblxuZnVuY3Rpb24gZ2V0SW1hZ2VGb3JtYXRCeURhdGEgKGltZ0RhdGEpIHtcbiAgICAvLyBpZiBpdCBpcyBhIHBuZyBmaWxlIGJ1ZmZlci5cbiAgICBpZiAoaW1nRGF0YS5sZW5ndGggPiA4ICYmIGltZ0RhdGFbMF0gPT09IDB4ODlcbiAgICAgICAgJiYgaW1nRGF0YVsxXSA9PT0gMHg1MFxuICAgICAgICAmJiBpbWdEYXRhWzJdID09PSAweDRFXG4gICAgICAgICYmIGltZ0RhdGFbM10gPT09IDB4NDdcbiAgICAgICAgJiYgaW1nRGF0YVs0XSA9PT0gMHgwRFxuICAgICAgICAmJiBpbWdEYXRhWzVdID09PSAweDBBXG4gICAgICAgICYmIGltZ0RhdGFbNl0gPT09IDB4MUFcbiAgICAgICAgJiYgaW1nRGF0YVs3XSA9PT0gMHgwQSkge1xuICAgICAgICByZXR1cm4gbWFjcm8uSW1hZ2VGb3JtYXQuUE5HO1xuICAgIH1cblxuICAgIC8vIGlmIGl0IGlzIGEgdGlmZiBmaWxlIGJ1ZmZlci5cbiAgICBpZiAoaW1nRGF0YS5sZW5ndGggPiAyICYmICgoaW1nRGF0YVswXSA9PT0gMHg0OSAmJiBpbWdEYXRhWzFdID09PSAweDQ5KVxuICAgICAgICB8fCAoaW1nRGF0YVswXSA9PT0gMHg0ZCAmJiBpbWdEYXRhWzFdID09PSAweDRkKVxuICAgICAgICB8fCAoaW1nRGF0YVswXSA9PT0gMHhmZiAmJiBpbWdEYXRhWzFdID09PSAweGQ4KSkpIHtcbiAgICAgICAgcmV0dXJuIG1hY3JvLkltYWdlRm9ybWF0LlRJRkY7XG4gICAgfVxuICAgIHJldHVybiBtYWNyby5JbWFnZUZvcm1hdC5VTktOT1dOO1xufVxuXG4vL1xuZnVuY3Rpb24gZ2V0UGFydGljbGVDb21wb25lbnRzIChub2RlKSB7XG4gICAgbGV0IHBhcmVudCA9IG5vZGUucGFyZW50LCBjb21wID0gbm9kZS5nZXRDb21wb25lbnQoY2MuUGFydGljbGVTeXN0ZW0pO1xuICAgIGlmICghcGFyZW50IHx8ICFjb21wKSB7XG4gICAgICAgIHJldHVybiBub2RlLmdldENvbXBvbmVudHNJbkNoaWxkcmVuKGNjLlBhcnRpY2xlU3lzdGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIGdldFBhcnRpY2xlQ29tcG9uZW50cyhwYXJlbnQpO1xufVxuXG5cbi8qKlxuICogISNlbiBFbnVtIGZvciBlbWl0dGVyIG1vZGVzXG4gKiAhI3poIOWPkeWwhOaooeW8j1xuICogQGVudW0gUGFydGljbGVTeXN0ZW0uRW1pdHRlck1vZGVcbiAqL1xudmFyIEVtaXR0ZXJNb2RlID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogISNlbiBVc2VzIGdyYXZpdHksIHNwZWVkLCByYWRpYWwgYW5kIHRhbmdlbnRpYWwgYWNjZWxlcmF0aW9uLlxuICAgICAqICEjemgg6YeN5Yqb5qih5byP77yM5qih5ouf6YeN5Yqb77yM5Y+v6K6p57KS5a2Q5Zu057uV5LiA5Liq5Lit5b+D54K556e76L+R5oiW56e76L+c44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEdSQVZJVFlcbiAgICAgKi9cbiAgICBHUkFWSVRZOiAwLFxuICAgIC8qKlxuICAgICAqICEjZW4gVXNlcyByYWRpdXMgbW92ZW1lbnQgKyByb3RhdGlvbi5cbiAgICAgKiAhI3poIOWNiuW+hOaooeW8j++8jOWPr+S7peS9v+eykuWtkOS7peWchuWciOaWueW8j+aXi+i9rO+8jOWug+S5n+WPr+S7peWIm+mAoOieuuaXi+aViOaenOiuqeeykuWtkOaApemAn+WJjei/m+aIluWQjumAgOOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBSQURJVVMgLSBVc2VzIHJhZGl1cyBtb3ZlbWVudCArIHJvdGF0aW9uLlxuICAgICAqL1xuICAgIFJBRElVUzogMVxufSk7XG5cbi8qKlxuICogISNlbiBFbnVtIGZvciBwYXJ0aWNsZXMgbW92ZW1lbnQgdHlwZS5cbiAqICEjemgg57KS5a2Q5L2N572u57G75Z6LXG4gKiBAZW51bSBQYXJ0aWNsZVN5c3RlbS5Qb3NpdGlvblR5cGVcbiAqL1xudmFyIFBvc2l0aW9uVHlwZSA9IGNjLkVudW0oe1xuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBMaXZpbmcgcGFydGljbGVzIGFyZSBhdHRhY2hlZCB0byB0aGUgd29ybGQgYW5kIGFyZSB1bmFmZmVjdGVkIGJ5IGVtaXR0ZXIgcmVwb3NpdGlvbmluZy5cbiAgICAgKiAhI3poXG4gICAgICog6Ieq55Sx5qih5byP77yM55u45a+55LqO5LiW55WM5Z2Q5qCH77yM5LiN5Lya6ZqP57KS5a2Q6IqC54K556e75Yqo6ICM56e75Yqo44CC77yI5Y+v5Lqn55Sf54Gr54Sw44CB6JK45rG9562J5pWI5p6c77yJXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEZSRUVcbiAgICAgKi9cbiAgICBGUkVFOiAwLFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIExpdmluZyBwYXJ0aWNsZXMgYXJlIGF0dGFjaGVkIHRvIHRoZSB3b3JsZCBidXQgd2lsbCBmb2xsb3cgdGhlIGVtaXR0ZXIgcmVwb3NpdGlvbmluZy48YnIvPlxuICAgICAqIFVzZSBjYXNlOiBBdHRhY2ggYW4gZW1pdHRlciB0byBhbiBzcHJpdGUsIGFuZCB5b3Ugd2FudCB0aGF0IHRoZSBlbWl0dGVyIGZvbGxvd3MgdGhlIHNwcml0ZS5cbiAgICAgKiAhI3poXG4gICAgICog55u45a+55qih5byP77yM57KS5a2Q5Lya6ZqP54i26IqC54K556e75Yqo6ICM56e75Yqo77yM5Y+v55So5LqO5Yi25L2c56e75Yqo6KeS6Imy6Lqr5LiK55qE54m55pWI562J562J44CC77yI6K+l6YCJ6aG55ZyoIENyZWF0b3Ig5Lit5pqC5pe25LiN5pSv5oyB77yJXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFJFTEFUSVZFXG4gICAgICovXG4gICAgUkVMQVRJVkU6IDEsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogTGl2aW5nIHBhcnRpY2xlcyBhcmUgYXR0YWNoZWQgdG8gdGhlIGVtaXR0ZXIgYW5kIGFyZSB0cmFuc2xhdGVkIGFsb25nIHdpdGggaXQuXG4gICAgICogISN6aFxuICAgICAqIOaVtOe7hOaooeW8j++8jOeykuWtkOi3n+maj+WPkeWwhOWZqOenu+WKqOOAgu+8iOS4jeS8muWPkeeUn+aLluWwvu+8iVxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBHUk9VUEVEXG4gICAgICovXG4gICAgR1JPVVBFRDogMlxufSk7XG5cbi8qKlxuICogQGNsYXNzIFBhcnRpY2xlU3lzdGVtXG4gKi9cblxudmFyIHByb3BlcnRpZXMgPSB7XG4gICAgLyoqXG4gICAgICogISNlbiBQbGF5IHBhcnRpY2xlIGluIGVkaXQgbW9kZS5cbiAgICAgKiAhI3poIOWcqOe8lui+keWZqOaooeW8j+S4i+mihOiniOeykuWtkO+8jOWQr+eUqOWQjumAieS4reeykuWtkOaXtu+8jOeykuWtkOWwhuiHquWKqOaSreaUvuOAglxuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gcHJldmlld1xuICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICovXG4gICAgcHJldmlldzoge1xuICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICBlZGl0b3JPbmx5OiB0cnVlLFxuICAgICAgICBub3RpZnk6IENDX0VESVRPUiAmJiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0U3lzdGVtKCk7XG4gICAgICAgICAgICBpZiAoICF0aGlzLnByZXZpZXcgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wU3lzdGVtKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNhYmxlUmVuZGVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYy5lbmdpbmUucmVwYWludEluRWRpdE1vZGUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGFydGljbGVfc3lzdGVtLnByZXZpZXcnXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBJZiBzZXQgY3VzdG9tIHRvIHRydWUsIHRoZW4gdXNlIGN1c3RvbSBwcm9wZXJ0aWVzIGluc3RlYWRvZiByZWFkIHBhcnRpY2xlIGZpbGUuXG4gICAgICogISN6aCDmmK/lkKboh6rlrprkuYnnspLlrZDlsZ7mgKfjgIJcbiAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGN1c3RvbVxuICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICovXG4gICAgX2N1c3RvbTogZmFsc2UsXG4gICAgY3VzdG9tOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2N1c3RvbTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChDQ19FRElUT1IgJiYgIXZhbHVlICYmICF0aGlzLl9maWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNjLndhcm5JRCg2MDAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl9jdXN0b20gIT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3VzdG9tID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXBwbHlGaWxlKCk7XG4gICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICBjYy5lbmdpbmUucmVwYWludEluRWRpdE1vZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBhcnRpY2xlX3N5c3RlbS5jdXN0b20nXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHBsaXN0IGZpbGUuXG4gICAgICogISN6aCBwbGlzdCDmoLzlvI/nmoTnspLlrZDphY3nva7mlofku7bjgIJcbiAgICAgKiBAcHJvcGVydHkge1BhcnRpY2xlQXNzZXR9IGZpbGVcbiAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICovXG4gICAgX2ZpbGU6IHtcbiAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgdHlwZTogUGFydGljbGVBc3NldFxuICAgIH0sXG4gICAgZmlsZToge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9maWxlO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSwgZm9yY2UpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9maWxlICE9PSB2YWx1ZSB8fCAoQ0NfRURJVE9SICYmIGZvcmNlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZpbGUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXBwbHlGaWxlKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmVuZ2luZS5yZXBhaW50SW5FZGl0TW9kZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1c3RvbSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgdHlwZTogUGFydGljbGVBc3NldCxcbiAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5wYXJ0aWNsZV9zeXN0ZW0uZmlsZSdcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTcHJpdGVGcmFtZSB1c2VkIGZvciBwYXJ0aWNsZXMgZGlzcGxheVxuICAgICAqICEjemgg55So5LqO57KS5a2Q5ZGI546w55qEIFNwcml0ZUZyYW1lXG4gICAgICogQHByb3BlcnR5IHNwcml0ZUZyYW1lXG4gICAgICogQHR5cGUge1Nwcml0ZUZyYW1lfVxuICAgICAqL1xuICAgIF9zcHJpdGVGcmFtZToge1xuICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICB0eXBlOiBjYy5TcHJpdGVGcmFtZVxuICAgIH0sXG4gICAgc3ByaXRlRnJhbWU6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3ByaXRlRnJhbWU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlLCBmb3JjZSkge1xuICAgICAgICAgICAgdmFyIGxhc3RTcHJpdGUgPSB0aGlzLl9yZW5kZXJTcHJpdGVGcmFtZTtcbiAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWZvcmNlICYmIGxhc3RTcHJpdGUgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAobGFzdFNwcml0ZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3JlbmRlclNwcml0ZUZyYW1lID0gdmFsdWU7XG5cbiAgICAgICAgICAgIGlmICghdmFsdWUgfHwgdmFsdWUuX3V1aWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zcHJpdGVGcmFtZSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoKGxhc3RTcHJpdGUgJiYgbGFzdFNwcml0ZS5nZXRUZXh0dXJlKCkpICE9PSAodmFsdWUgJiYgdmFsdWUuZ2V0VGV4dHVyZSgpKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2FwcGx5U3ByaXRlRnJhbWUobGFzdFNwcml0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLmVtaXQoJ3Nwcml0ZWZyYW1lLWNoYW5nZWQnLCB0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdHlwZTogY2MuU3ByaXRlRnJhbWUsXG4gICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGFydGljbGVfc3lzdGVtLnNwcml0ZUZyYW1lJ1xuICAgIH0sXG5cblxuICAgIC8vIGp1c3QgdXNlZCB0byByZWFkIGRhdGEgZnJvbSAxLnhcbiAgICBfdGV4dHVyZToge1xuICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICB0eXBlOiBjYy5UZXh0dXJlMkQsXG4gICAgICAgIGVkaXRvck9ubHk6IHRydWUsXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGV4dHVyZSBvZiBQYXJ0aWNsZSBTeXN0ZW0sIHJlYWRvbmx5LCBwbGVhc2UgdXNlIHNwcml0ZUZyYW1lIHRvIHNldHVwIG5ldyB0ZXh0dXJl44CCXG4gICAgICogISN6aCDnspLlrZDotLTlm77vvIzlj6ror7vlsZ7mgKfvvIzor7fkvb/nlKggc3ByaXRlRnJhbWUg5bGe5oCn5p2l5pu/5o2i6LS05Zu+44CCXG4gICAgICogQHByb3BlcnR5IHRleHR1cmVcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRleHR1cmU6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2V0VGV4dHVyZSgpO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybklEKDYwMTcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB0eXBlOiBjYy5UZXh0dXJlMkQsXG4gICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucGFydGljbGVfc3lzdGVtLnRleHR1cmUnLFxuICAgICAgICByZWFkb25seTogdHJ1ZSxcbiAgICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQ3VycmVudCBxdWFudGl0eSBvZiBwYXJ0aWNsZXMgdGhhdCBhcmUgYmVpbmcgc2ltdWxhdGVkLlxuICAgICAqICEjemgg5b2T5YmN5pKt5pS+55qE57KS5a2Q5pWw6YeP44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHBhcnRpY2xlQ291bnRcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBwYXJ0aWNsZUNvdW50OiB7XG4gICAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NpbXVsYXRvci5wYXJ0aWNsZXMubGVuZ3RoO1xuICAgICAgICB9LFxuICAgICAgICByZWFkb25seTogdHJ1ZVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEluZGljYXRlIHdoZXRoZXIgdGhlIHN5c3RlbSBzaW11bGF0aW9uIGhhdmUgc3RvcHBlZC5cbiAgICAgKiAhI3poIOaMh+ekuueykuWtkOaSreaUvuaYr+WQpuWujOavleOAglxuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gc3RvcHBlZFxuICAgICAqL1xuICAgIF9zdG9wcGVkOiB0cnVlLFxuICAgIHN0b3BwZWQ6IHtcbiAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdG9wcGVkO1xuICAgICAgICB9LFxuICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBJZiBzZXQgdG8gdHJ1ZSwgdGhlIHBhcnRpY2xlIHN5c3RlbSB3aWxsIGF1dG9tYXRpY2FsbHkgc3RhcnQgcGxheWluZyBvbiBvbkxvYWQuXG4gICAgICogISN6aCDlpoLmnpzorr7nva7kuLogdHJ1ZSDov5DooYzml7bkvJroh6rliqjlj5HlsITnspLlrZDjgIJcbiAgICAgKiBAcHJvcGVydHkgcGxheU9uTG9hZFxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgKi9cbiAgICBwbGF5T25Mb2FkOiB0cnVlLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBJbmRpY2F0ZSB3aGV0aGVyIHRoZSBvd25lciBub2RlIHdpbGwgYmUgYXV0by1yZW1vdmVkIHdoZW4gaXQgaGFzIG5vIHBhcnRpY2xlcyBsZWZ0LlxuICAgICAqICEjemgg57KS5a2Q5pKt5pS+5a6M5q+V5ZCO6Ieq5Yqo6ZSA5q+B5omA5Zyo55qE6IqC54K544CCXG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSBhdXRvUmVtb3ZlT25GaW5pc2hcbiAgICAgKi9cbiAgICBhdXRvUmVtb3ZlT25GaW5pc2g6IHtcbiAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnBhcnRpY2xlX3N5c3RlbS5hdXRvUmVtb3ZlT25GaW5pc2gnXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gSW5kaWNhdGUgd2hldGhlciB0aGUgcGFydGljbGUgc3lzdGVtIGlzIGFjdGl2YXRlZC5cbiAgICAgKiAhI3poIOaYr+WQpua/gOa0u+eykuWtkOOAglxuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gYWN0aXZlXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgYWN0aXZlOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NpbXVsYXRvci5hY3RpdmU7XG4gICAgICAgIH0sXG4gICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gTWF4aW11bSBwYXJ0aWNsZXMgb2YgdGhlIHN5c3RlbS5cbiAgICAgKiAhI3poIOeykuWtkOacgOWkp+aVsOmHj+OAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB0b3RhbFBhcnRpY2xlc1xuICAgICAqIEBkZWZhdWx0IDE1MFxuICAgICAqL1xuICAgIHRvdGFsUGFydGljbGVzOiAxNTAsXG4gICAgLyoqXG4gICAgICogISNlbiBIb3cgbWFueSBzZWNvbmRzIHRoZSBlbWl0dGVyIHdpbCBydW4uIC0xIG1lYW5zICdmb3JldmVyJy5cbiAgICAgKiAhI3poIOWPkeWwhOWZqOeUn+WtmOaXtumXtO+8jOWNleS9jeenku+8jC0x6KGo56S65oyB57ut5Y+R5bCE44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGR1cmF0aW9uXG4gICAgICogQGRlZmF1bHQgUGFydGljbGVTeXN0ZW0uRFVSQVRJT05fSU5GSU5JVFlcbiAgICAgKi9cbiAgICBkdXJhdGlvbjogLTEsXG4gICAgLyoqXG4gICAgICogISNlbiBFbWlzc2lvbiByYXRlIG9mIHRoZSBwYXJ0aWNsZXMuXG4gICAgICogISN6aCDmr4/np5Llj5HlsITnmoTnspLlrZDmlbDnm67jgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gZW1pc3Npb25SYXRlXG4gICAgICogQGRlZmF1bHQgMTBcbiAgICAgKi9cbiAgICBlbWlzc2lvblJhdGU6IDEwLFxuICAgIC8qKlxuICAgICAqICEjZW4gTGlmZSBvZiBlYWNoIHBhcnRpY2xlIHNldHRlci5cbiAgICAgKiAhI3poIOeykuWtkOeahOi/kOihjOaXtumXtOOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBsaWZlXG4gICAgICogQGRlZmF1bHQgMVxuICAgICAqL1xuICAgIGxpZmU6IDEsXG4gICAgLyoqXG4gICAgICogISNlbiBWYXJpYXRpb24gb2YgbGlmZS5cbiAgICAgKiAhI3poIOeykuWtkOeahOi/kOihjOaXtumXtOWPmOWMluiMg+WbtOOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBsaWZlVmFyXG4gICAgICogQGRlZmF1bHQgMFxuICAgICAqL1xuICAgIGxpZmVWYXI6IDAsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFN0YXJ0IGNvbG9yIG9mIGVhY2ggcGFydGljbGUuXG4gICAgICogISN6aCDnspLlrZDliJ3lp4vpopzoibLjgIJcbiAgICAgKiBAcHJvcGVydHkge2NjLkNvbG9yfSBzdGFydENvbG9yXG4gICAgICogQGRlZmF1bHQge3I6IDI1NSwgZzogMjU1LCBiOiAyNTUsIGE6IDI1NX1cbiAgICAgKi9cbiAgICBfc3RhcnRDb2xvcjogbnVsbCxcbiAgICBzdGFydENvbG9yOiB7XG4gICAgICAgIHR5cGU6IGNjLkNvbG9yLFxuICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXJ0Q29sb3I7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCAodmFsKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGFydENvbG9yLnIgPSB2YWwucjtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0Q29sb3IuZyA9IHZhbC5nO1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRDb2xvci5iID0gdmFsLmI7XG4gICAgICAgICAgICB0aGlzLl9zdGFydENvbG9yLmEgPSB2YWwuYTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogISNlbiBWYXJpYXRpb24gb2YgdGhlIHN0YXJ0IGNvbG9yLlxuICAgICAqICEjemgg57KS5a2Q5Yid5aeL6aKc6Imy5Y+Y5YyW6IyD5Zu044CCXG4gICAgICogQHByb3BlcnR5IHtjYy5Db2xvcn0gc3RhcnRDb2xvclZhclxuICAgICAqIEBkZWZhdWx0IHtyOiAwLCBnOiAwLCBiOiAwLCBhOiAwfVxuICAgICAqL1xuICAgIF9zdGFydENvbG9yVmFyOiBudWxsLFxuICAgIHN0YXJ0Q29sb3JWYXI6IHtcbiAgICAgICAgdHlwZTogY2MuQ29sb3IsXG4gICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhcnRDb2xvclZhcjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0ICh2YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0Q29sb3JWYXIuciA9IHZhbC5yO1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRDb2xvclZhci5nID0gdmFsLmc7XG4gICAgICAgICAgICB0aGlzLl9zdGFydENvbG9yVmFyLmIgPSB2YWwuYjtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0Q29sb3JWYXIuYSA9IHZhbC5hO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiAhI2VuIEVuZGluZyBjb2xvciBvZiBlYWNoIHBhcnRpY2xlLlxuICAgICAqICEjemgg57KS5a2Q57uT5p2f6aKc6Imy44CCXG4gICAgICogQHByb3BlcnR5IHtjYy5Db2xvcn0gZW5kQ29sb3JcbiAgICAgKiBAZGVmYXVsdCB7cjogMjU1LCBnOiAyNTUsIGI6IDI1NSwgYTogMH1cbiAgICAgKi9cbiAgICBfZW5kQ29sb3I6IG51bGwsXG4gICAgZW5kQ29sb3I6IHtcbiAgICAgICAgdHlwZTogY2MuQ29sb3IsXG4gICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZW5kQ29sb3I7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCAodmFsKSB7XG4gICAgICAgICAgICB0aGlzLl9lbmRDb2xvci5yID0gdmFsLnI7XG4gICAgICAgICAgICB0aGlzLl9lbmRDb2xvci5nID0gdmFsLmc7XG4gICAgICAgICAgICB0aGlzLl9lbmRDb2xvci5iID0gdmFsLmI7XG4gICAgICAgICAgICB0aGlzLl9lbmRDb2xvci5hID0gdmFsLmE7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqICEjZW4gVmFyaWF0aW9uIG9mIHRoZSBlbmQgY29sb3IuXG4gICAgICogISN6aCDnspLlrZDnu5PmnZ/popzoibLlj5jljJbojIPlm7TjgIJcbiAgICAgKiBAcHJvcGVydHkge2NjLkNvbG9yfSBlbmRDb2xvclZhclxuICAgICAqIEBkZWZhdWx0IHtyOiAwLCBnOiAwLCBiOiAwLCBhOiAwfVxuICAgICAqL1xuICAgIF9lbmRDb2xvclZhcjogbnVsbCxcbiAgICBlbmRDb2xvclZhcjoge1xuICAgICAgICB0eXBlOiBjYy5Db2xvcixcbiAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9lbmRDb2xvclZhcjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0ICh2YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX2VuZENvbG9yVmFyLnIgPSB2YWwucjtcbiAgICAgICAgICAgIHRoaXMuX2VuZENvbG9yVmFyLmcgPSB2YWwuZztcbiAgICAgICAgICAgIHRoaXMuX2VuZENvbG9yVmFyLmIgPSB2YWwuYjtcbiAgICAgICAgICAgIHRoaXMuX2VuZENvbG9yVmFyLmEgPSB2YWwuYTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEFuZ2xlIG9mIGVhY2ggcGFydGljbGUgc2V0dGVyLlxuICAgICAqICEjemgg57KS5a2Q6KeS5bqm44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGFuZ2xlXG4gICAgICogQGRlZmF1bHQgOTBcbiAgICAgKi9cbiAgICBhbmdsZTogOTAsXG4gICAgLyoqXG4gICAgICogISNlbiBWYXJpYXRpb24gb2YgYW5nbGUgb2YgZWFjaCBwYXJ0aWNsZSBzZXR0ZXIuXG4gICAgICogISN6aCDnspLlrZDop5Lluqblj5jljJbojIPlm7TjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gYW5nbGVWYXJcbiAgICAgKiBAZGVmYXVsdCAyMFxuICAgICAqL1xuICAgIGFuZ2xlVmFyOiAyMCxcbiAgICAvKipcbiAgICAgKiAhI2VuIFN0YXJ0IHNpemUgaW4gcGl4ZWxzIG9mIGVhY2ggcGFydGljbGUuXG4gICAgICogISN6aCDnspLlrZDnmoTliJ3lp4vlpKflsI/jgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gc3RhcnRTaXplXG4gICAgICogQGRlZmF1bHQgNTBcbiAgICAgKi9cbiAgICBzdGFydFNpemU6IDUwLFxuICAgIC8qKlxuICAgICAqICEjZW4gVmFyaWF0aW9uIG9mIHN0YXJ0IHNpemUgaW4gcGl4ZWxzLlxuICAgICAqICEjemgg57KS5a2Q5Yid5aeL5aSn5bCP55qE5Y+Y5YyW6IyD5Zu044CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHN0YXJ0U2l6ZVZhclxuICAgICAqIEBkZWZhdWx0IDBcbiAgICAgKi9cbiAgICBzdGFydFNpemVWYXI6IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBFbmQgc2l6ZSBpbiBwaXhlbHMgb2YgZWFjaCBwYXJ0aWNsZS5cbiAgICAgKiAhI3poIOeykuWtkOe7k+adn+aXtueahOWkp+Wwj+OAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBlbmRTaXplXG4gICAgICogQGRlZmF1bHQgMFxuICAgICAqL1xuICAgIGVuZFNpemU6IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBWYXJpYXRpb24gb2YgZW5kIHNpemUgaW4gcGl4ZWxzLlxuICAgICAqICEjemgg57KS5a2Q57uT5p2f5aSn5bCP55qE5Y+Y5YyW6IyD5Zu044CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGVuZFNpemVWYXJcbiAgICAgKiBAZGVmYXVsdCAwXG4gICAgICovXG4gICAgZW5kU2l6ZVZhcjogMCxcbiAgICAvKipcbiAgICAgKiAhI2VuIFN0YXJ0IGFuZ2xlIG9mIGVhY2ggcGFydGljbGUuXG4gICAgICogISN6aCDnspLlrZDlvIDlp4voh6rml4vop5LluqbjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gc3RhcnRTcGluXG4gICAgICogQGRlZmF1bHQgMFxuICAgICAqL1xuICAgIHN0YXJ0U3BpbjogMCxcbiAgICAvKipcbiAgICAgKiAhI2VuIFZhcmlhdGlvbiBvZiBzdGFydCBhbmdsZS5cbiAgICAgKiAhI3poIOeykuWtkOW8gOWni+iHquaXi+inkuW6puWPmOWMluiMg+WbtOOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBzdGFydFNwaW5WYXJcbiAgICAgKiBAZGVmYXVsdCAwXG4gICAgICovXG4gICAgc3RhcnRTcGluVmFyOiAwLFxuICAgIC8qKlxuICAgICAqICEjZW4gRW5kIGFuZ2xlIG9mIGVhY2ggcGFydGljbGUuXG4gICAgICogISN6aCDnspLlrZDnu5PmnZ/oh6rml4vop5LluqbjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gZW5kU3BpblxuICAgICAqIEBkZWZhdWx0IDBcbiAgICAgKi9cbiAgICBlbmRTcGluOiAwLFxuICAgIC8qKlxuICAgICAqICEjZW4gVmFyaWF0aW9uIG9mIGVuZCBhbmdsZS5cbiAgICAgKiAhI3poIOeykuWtkOe7k+adn+iHquaXi+inkuW6puWPmOWMluiMg+WbtOOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBlbmRTcGluVmFyXG4gICAgICogQGRlZmF1bHQgMFxuICAgICAqL1xuICAgIGVuZFNwaW5WYXI6IDAsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNvdXJjZSBwb3NpdGlvbiBvZiB0aGUgZW1pdHRlci5cbiAgICAgKiAhI3poIOWPkeWwhOWZqOS9jee9ruOAglxuICAgICAqIEBwcm9wZXJ0eSB7VmVjMn0gc291cmNlUG9zXG4gICAgICogQGRlZmF1bHQgY2MuVmVjMi5aRVJPXG4gICAgICovXG4gICAgc291cmNlUG9zOiBjYy5WZWMyLlpFUk8sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFZhcmlhdGlvbiBvZiBzb3VyY2UgcG9zaXRpb24uXG4gICAgICogISN6aCDlj5HlsITlmajkvY3nva7nmoTlj5jljJbojIPlm7TjgILvvIjmqKrlkJHlkoznurXlkJHvvIlcbiAgICAgKiBAcHJvcGVydHkge1ZlYzJ9IHBvc1ZhclxuICAgICAqIEBkZWZhdWx0IGNjLlZlYzIuWkVST1xuICAgICAqL1xuICAgIHBvc1ZhcjogY2MuVmVjMi5aRVJPLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBQYXJ0aWNsZXMgbW92ZW1lbnQgdHlwZS5cbiAgICAgKiAhI3poIOeykuWtkOS9jee9ruexu+Wei+OAglxuICAgICAqIEBwcm9wZXJ0eSB7UGFydGljbGVTeXN0ZW0uUG9zaXRpb25UeXBlfSBwb3NpdGlvblR5cGVcbiAgICAgKiBAZGVmYXVsdCBQYXJ0aWNsZVN5c3RlbS5Qb3NpdGlvblR5cGUuRlJFRVxuICAgICAqL1xuICAgIF9wb3NpdGlvblR5cGU6IHtcbiAgICAgICAgZGVmYXVsdDogUG9zaXRpb25UeXBlLkZSRUUsXG4gICAgICAgIGZvcm1lcmx5U2VyaWFsaXplZEFzOiBcInBvc2l0aW9uVHlwZVwiXG4gICAgfSxcblxuICAgIHBvc2l0aW9uVHlwZToge1xuICAgICAgICB0eXBlOiBQb3NpdGlvblR5cGUsXG4gICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcG9zaXRpb25UeXBlO1xuICAgICAgICB9LFxuICAgICAgICBzZXQgKHZhbCkge1xuICAgICAgICAgICAgdGhpcy5fcG9zaXRpb25UeXBlID0gdmFsO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlTWF0ZXJpYWwoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFBhcnRpY2xlcyBlbWl0dGVyIG1vZGVzLlxuICAgICAqICEjemgg5Y+R5bCE5Zmo57G75Z6L44CCXG4gICAgICogQHByb3BlcnR5IHtQYXJ0aWNsZVN5c3RlbS5FbWl0dGVyTW9kZX0gZW1pdHRlck1vZGVcbiAgICAgKiBAZGVmYXVsdCBQYXJ0aWNsZVN5c3RlbS5FbWl0dGVyTW9kZS5HUkFWSVRZXG4gICAgICovXG4gICAgZW1pdHRlck1vZGU6IHtcbiAgICAgICAgZGVmYXVsdDogRW1pdHRlck1vZGUuR1JBVklUWSxcbiAgICAgICAgdHlwZTogRW1pdHRlck1vZGVcbiAgICB9LFxuXG4gICAgLy8gR1JBVklUWSBNT0RFXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdyYXZpdHkgb2YgdGhlIGVtaXR0ZXIuXG4gICAgICogISN6aCDph43lipvjgIJcbiAgICAgKiBAcHJvcGVydHkge1ZlYzJ9IGdyYXZpdHlcbiAgICAgKiBAZGVmYXVsdCBjYy5WZWMyLlpFUk9cbiAgICAgKi9cbiAgICBncmF2aXR5OiBjYy5WZWMyLlpFUk8sXG4gICAgLyoqXG4gICAgICogISNlbiBTcGVlZCBvZiB0aGUgZW1pdHRlci5cbiAgICAgKiAhI3poIOmAn+W6puOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBzcGVlZFxuICAgICAqIEBkZWZhdWx0IDE4MFxuICAgICAqL1xuICAgIHNwZWVkOiAxODAsXG4gICAgLyoqXG4gICAgICogISNlbiBWYXJpYXRpb24gb2YgdGhlIHNwZWVkLlxuICAgICAqICEjemgg6YCf5bqm5Y+Y5YyW6IyD5Zu044CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHNwZWVkVmFyXG4gICAgICogQGRlZmF1bHQgNTBcbiAgICAgKi9cbiAgICBzcGVlZFZhcjogNTAsXG4gICAgLyoqXG4gICAgICogISNlbiBUYW5nZW50aWFsIGFjY2VsZXJhdGlvbiBvZiBlYWNoIHBhcnRpY2xlLiBPbmx5IGF2YWlsYWJsZSBpbiAnR3Jhdml0eScgbW9kZS5cbiAgICAgKiAhI3poIOavj+S4queykuWtkOeahOWIh+WQkeWKoOmAn+W6pu+8jOWNs+WeguebtOS6jumHjeWKm+aWueWQkeeahOWKoOmAn+W6pu+8jOWPquacieWcqOmHjeWKm+aooeW8j+S4i+WPr+eUqOOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB0YW5nZW50aWFsQWNjZWxcbiAgICAgKiBAZGVmYXVsdCA4MFxuICAgICAqL1xuICAgIHRhbmdlbnRpYWxBY2NlbDogODAsXG4gICAgLyoqXG4gICAgICogISNlbiBWYXJpYXRpb24gb2YgdGhlIHRhbmdlbnRpYWwgYWNjZWxlcmF0aW9uLlxuICAgICAqICEjemgg5q+P5Liq57KS5a2Q55qE5YiH5ZCR5Yqg6YCf5bqm5Y+Y5YyW6IyD5Zu044CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHRhbmdlbnRpYWxBY2NlbFZhclxuICAgICAqIEBkZWZhdWx0IDBcbiAgICAgKi9cbiAgICB0YW5nZW50aWFsQWNjZWxWYXI6IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBBY2NlbGVyYXRpb24gb2YgZWFjaCBwYXJ0aWNsZS4gT25seSBhdmFpbGFibGUgaW4gJ0dyYXZpdHknIG1vZGUuXG4gICAgICogISN6aCDnspLlrZDlvoTlkJHliqDpgJ/luqbvvIzljbPlubPooYzkuo7ph43lipvmlrnlkJHnmoTliqDpgJ/luqbvvIzlj6rmnInlnKjph43lipvmqKHlvI/kuIvlj6/nlKjjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gcmFkaWFsQWNjZWxcbiAgICAgKiBAZGVmYXVsdCAwXG4gICAgICovXG4gICAgcmFkaWFsQWNjZWw6IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBWYXJpYXRpb24gb2YgdGhlIHJhZGlhbCBhY2NlbGVyYXRpb24uXG4gICAgICogISN6aCDnspLlrZDlvoTlkJHliqDpgJ/luqblj5jljJbojIPlm7TjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gcmFkaWFsQWNjZWxWYXJcbiAgICAgKiBAZGVmYXVsdCAwXG4gICAgICovXG4gICAgcmFkaWFsQWNjZWxWYXI6IDAsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEluZGljYXRlIHdoZXRoZXIgdGhlIHJvdGF0aW9uIG9mIGVhY2ggcGFydGljbGUgZXF1YWxzIHRvIGl0cyBkaXJlY3Rpb24uIE9ubHkgYXZhaWxhYmxlIGluICdHcmF2aXR5JyBtb2RlLlxuICAgICAqICEjemgg5q+P5Liq57KS5a2Q55qE5peL6L2s5piv5ZCm562J5LqO5YW25pa55ZCR77yM5Y+q5pyJ5Zyo6YeN5Yqb5qih5byP5LiL5Y+v55So44CCXG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSByb3RhdGlvbklzRGlyXG4gICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgKi9cbiAgICByb3RhdGlvbklzRGlyOiBmYWxzZSxcblxuICAgIC8vIFJBRElVUyBNT0RFXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFN0YXJ0aW5nIHJhZGl1cyBvZiB0aGUgcGFydGljbGVzLiBPbmx5IGF2YWlsYWJsZSBpbiAnUmFkaXVzJyBtb2RlLlxuICAgICAqICEjemgg5Yid5aeL5Y2K5b6E77yM6KGo56S657KS5a2Q5Ye655Sf5pe255u45a+55Y+R5bCE5Zmo55qE6Led56a777yM5Y+q5pyJ5Zyo5Y2K5b6E5qih5byP5LiL5Y+v55So44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHN0YXJ0UmFkaXVzXG4gICAgICogQGRlZmF1bHQgMFxuICAgICAqL1xuICAgIHN0YXJ0UmFkaXVzOiAwLFxuICAgIC8qKlxuICAgICAqICEjZW4gVmFyaWF0aW9uIG9mIHRoZSBzdGFydGluZyByYWRpdXMuXG4gICAgICogISN6aCDliJ3lp4vljYrlvoTlj5jljJbojIPlm7TjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gc3RhcnRSYWRpdXNWYXJcbiAgICAgKiBAZGVmYXVsdCAwXG4gICAgICovXG4gICAgc3RhcnRSYWRpdXNWYXI6IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBFbmRpbmcgcmFkaXVzIG9mIHRoZSBwYXJ0aWNsZXMuIE9ubHkgYXZhaWxhYmxlIGluICdSYWRpdXMnIG1vZGUuXG4gICAgICogISN6aCDnu5PmnZ/ljYrlvoTvvIzlj6rmnInlnKjljYrlvoTmqKHlvI/kuIvlj6/nlKjjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gZW5kUmFkaXVzXG4gICAgICogQGRlZmF1bHQgMFxuICAgICAqL1xuICAgIGVuZFJhZGl1czogMCxcbiAgICAvKipcbiAgICAgKiAhI2VuIFZhcmlhdGlvbiBvZiB0aGUgZW5kaW5nIHJhZGl1cy5cbiAgICAgKiAhI3poIOe7k+adn+WNiuW+hOWPmOWMluiMg+WbtOOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBlbmRSYWRpdXNWYXJcbiAgICAgKiBAZGVmYXVsdCAwXG4gICAgICovXG4gICAgZW5kUmFkaXVzVmFyOiAwLFxuICAgIC8qKlxuICAgICAqICEjZW4gTnVtYmVyIG9mIGRlZ3Jlc3MgdG8gcm90YXRlIGEgcGFydGljbGUgYXJvdW5kIHRoZSBzb3VyY2UgcG9zIHBlciBzZWNvbmQuIE9ubHkgYXZhaWxhYmxlIGluICdSYWRpdXMnIG1vZGUuXG4gICAgICogISN6aCDnspLlrZDmr4/np5Llm7Tnu5Xotbflp4vngrnnmoTml4vovazop5LluqbvvIzlj6rmnInlnKjljYrlvoTmqKHlvI/kuIvlj6/nlKjjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gcm90YXRlUGVyU1xuICAgICAqIEBkZWZhdWx0IDBcbiAgICAgKi9cbiAgICByb3RhdGVQZXJTOiAwLFxuICAgIC8qKlxuICAgICAqICEjZW4gVmFyaWF0aW9uIG9mIHRoZSBkZWdyZXNzIHRvIHJvdGF0ZSBhIHBhcnRpY2xlIGFyb3VuZCB0aGUgc291cmNlIHBvcyBwZXIgc2Vjb25kLlxuICAgICAqICEjemgg57KS5a2Q5q+P56eS5Zu057uV6LW35aeL54K555qE5peL6L2s6KeS5bqm5Y+Y5YyW6IyD5Zu044CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHJvdGF0ZVBlclNWYXJcbiAgICAgKiBAZGVmYXVsdCAwXG4gICAgICovXG4gICAgcm90YXRlUGVyU1ZhcjogMFxuXG59O1xuXG4vKipcbiAqIFBhcnRpY2xlIFN5c3RlbSBiYXNlIGNsYXNzLiA8YnIvPlxuICogQXR0cmlidXRlcyBvZiBhIFBhcnRpY2xlIFN5c3RlbTo8YnIvPlxuICogIC0gZW1taXNpb24gcmF0ZSBvZiB0aGUgcGFydGljbGVzPGJyLz5cbiAqICAtIEdyYXZpdHkgTW9kZSAoTW9kZSBBKTogPGJyLz5cbiAqICAtIGdyYXZpdHkgPGJyLz5cbiAqICAtIGRpcmVjdGlvbiA8YnIvPlxuICogIC0gc3BlZWQgKy0gIHZhcmlhbmNlIDxici8+XG4gKiAgLSB0YW5nZW50aWFsIGFjY2VsZXJhdGlvbiArLSB2YXJpYW5jZTxici8+XG4gKiAgLSByYWRpYWwgYWNjZWxlcmF0aW9uICstIHZhcmlhbmNlPGJyLz5cbiAqICAtIFJhZGl1cyBNb2RlIChNb2RlIEIpOiAgICAgIDxici8+XG4gKiAgLSBzdGFydFJhZGl1cyArLSB2YXJpYW5jZSAgICA8YnIvPlxuICogIC0gZW5kUmFkaXVzICstIHZhcmlhbmNlICAgICAgPGJyLz5cbiAqICAtIHJvdGF0ZSArLSB2YXJpYW5jZSAgICAgICAgIDxici8+XG4gKiAgLSBQcm9wZXJ0aWVzIGNvbW1vbiB0byBhbGwgbW9kZXM6IDxici8+XG4gKiAgLSBsaWZlICstIGxpZmUgdmFyaWFuY2UgICAgICA8YnIvPlxuICogIC0gc3RhcnQgc3BpbiArLSB2YXJpYW5jZSAgICAgPGJyLz5cbiAqICAtIGVuZCBzcGluICstIHZhcmlhbmNlICAgICAgIDxici8+XG4gKiAgLSBzdGFydCBzaXplICstIHZhcmlhbmNlICAgICA8YnIvPlxuICogIC0gZW5kIHNpemUgKy0gdmFyaWFuY2UgICAgICAgPGJyLz5cbiAqICAtIHN0YXJ0IGNvbG9yICstIHZhcmlhbmNlICAgIDxici8+XG4gKiAgLSBlbmQgY29sb3IgKy0gdmFyaWFuY2UgICAgICA8YnIvPlxuICogIC0gbGlmZSArLSB2YXJpYW5jZSAgICAgICAgICAgPGJyLz5cbiAqICAtIGJsZW5kaW5nIGZ1bmN0aW9uICAgICAgICAgIDxici8+XG4gKiAgLSB0ZXh0dXJlICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICogPGJyLz5cbiAqIGNvY29zMmQgYWxzbyBzdXBwb3J0cyBwYXJ0aWNsZXMgZ2VuZXJhdGVkIGJ5IFBhcnRpY2xlIERlc2lnbmVyIChodHRwOi8vcGFydGljbGVkZXNpZ25lci43MXNxdWFyZWQuY29tLykuPGJyLz5cbiAqICdSYWRpdXMgTW9kZScgaW4gUGFydGljbGUgRGVzaWduZXIgdXNlcyBhIGZpeGVkIGVtaXQgcmF0ZSBvZiAzMCBoei4gU2luY2UgdGhhdCBjYW4ndCBiZSBndWFyYXRlZWQgaW4gY29jb3MyZCwgIDxici8+XG4gKiBjb2NvczJkIHVzZXMgYSBhbm90aGVyIGFwcHJvYWNoLCBidXQgdGhlIHJlc3VsdHMgYXJlIGFsbW9zdCBpZGVudGljYWwuPGJyLz5cbiAqIGNvY29zMmQgc3VwcG9ydHMgYWxsIHRoZSB2YXJpYWJsZXMgdXNlZCBieSBQYXJ0aWNsZSBEZXNpZ25lciBwbHVzIGEgYml0IG1vcmU6ICA8YnIvPlxuICogIC0gc3Bpbm5pbmcgcGFydGljbGVzIChzdXBwb3J0ZWQgd2hlbiB1c2luZyBQYXJ0aWNsZVN5c3RlbSkgICAgICAgPGJyLz5cbiAqICAtIHRhbmdlbnRpYWwgYWNjZWxlcmF0aW9uIChHcmF2aXR5IG1vZGUpICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gKiAgLSByYWRpYWwgYWNjZWxlcmF0aW9uIChHcmF2aXR5IG1vZGUpICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICogIC0gcmFkaXVzIGRpcmVjdGlvbiAoUmFkaXVzIG1vZGUpIChQYXJ0aWNsZSBEZXNpZ25lciBzdXBwb3J0cyBvdXR3YXJkcyB0byBpbndhcmRzIGRpcmVjdGlvbiBvbmx5KSA8YnIvPlxuICogSXQgaXMgcG9zc2libGUgdG8gY3VzdG9taXplIGFueSBvZiB0aGUgYWJvdmUgbWVudGlvbmVkIHByb3BlcnRpZXMgaW4gcnVudGltZS4gRXhhbXBsZTogICA8YnIvPlxuICpcbiAqIEBleGFtcGxlXG4gKiBlbWl0dGVyLnJhZGlhbEFjY2VsID0gMTU7XG4gKiBlbWl0dGVyLnN0YXJ0U3BpbiA9IDA7XG4gKlxuICogQGNsYXNzIFBhcnRpY2xlU3lzdGVtXG4gKiBAZXh0ZW5kcyBSZW5kZXJDb21wb25lbnRcbiAqIEB1c2VzIEJsZW5kRnVuY1xuICovXG52YXIgUGFydGljbGVTeXN0ZW0gPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlBhcnRpY2xlU3lzdGVtJyxcbiAgICBleHRlbmRzOiBSZW5kZXJDb21wb25lbnQsXG4gICAgbWl4aW5zOiBbQmxlbmRGdW5jXSxcbiAgICBlZGl0b3I6IENDX0VESVRPUiAmJiB7XG4gICAgICAgIG1lbnU6ICdpMThuOk1BSU5fTUVOVS5jb21wb25lbnQucmVuZGVyZXJzL1BhcnRpY2xlU3lzdGVtJyxcbiAgICAgICAgaW5zcGVjdG9yOiAncGFja2FnZXM6Ly9pbnNwZWN0b3IvaW5zcGVjdG9ycy9jb21wcy9wYXJ0aWNsZS1zeXN0ZW0uanMnLFxuICAgICAgICBwbGF5T25Gb2N1czogdHJ1ZSxcbiAgICAgICAgZXhlY3V0ZUluRWRpdE1vZGU6IHRydWVcbiAgICB9LFxuXG4gICAgY3RvciAoKSB7XG4gICAgICAgIHRoaXMuaW5pdFByb3BlcnRpZXMoKTtcbiAgICB9LFxuXG4gICAgaW5pdFByb3BlcnRpZXMgKCkge1xuICAgICAgICB0aGlzLl9wcmV2aWV3VGltZXIgPSBudWxsO1xuICAgICAgICB0aGlzLl9mb2N1c2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2FzcGVjdFJhdGlvID0gMTtcblxuICAgICAgICB0aGlzLl9zaW11bGF0b3IgPSBuZXcgUGFydGljbGVTaW11bGF0b3IodGhpcyk7XG5cbiAgICAgICAgLy8gY29sb3JzXG4gICAgICAgIHRoaXMuX3N0YXJ0Q29sb3IgPSBjYy5jb2xvcigyNTUsIDI1NSwgMjU1LCAyNTUpO1xuICAgICAgICB0aGlzLl9zdGFydENvbG9yVmFyID0gY2MuY29sb3IoMCwgMCwgMCwgMCk7XG4gICAgICAgIHRoaXMuX2VuZENvbG9yID0gY2MuY29sb3IoMjU1LCAyNTUsIDI1NSwgMCk7XG4gICAgICAgIHRoaXMuX2VuZENvbG9yVmFyID0gY2MuY29sb3IoMCwgMCwgMCwgMCk7XG5cbiAgICAgICAgLy8gVGhlIHRlbXBvcmFyeSBTcHJpdGVGcmFtZSBvYmplY3QgdXNlZCBmb3IgdGhlIHJlbmRlcmVyLiBCZWNhdXNlIHRoZXJlIGlzIG5vIGNvcnJlc3BvbmRpbmcgYXNzZXQsIGl0IGNhbid0IGJlIHNlcmlhbGl6ZWQuXG4gICAgICAgIHRoaXMuX3JlbmRlclNwcml0ZUZyYW1lID0gbnVsbDtcbiAgICB9LFxuXG4gICAgcHJvcGVydGllczogcHJvcGVydGllcyxcblxuICAgIHN0YXRpY3M6IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgUGFydGljbGUgZW1pdHRlciBsaXZlcyBmb3JldmVyLlxuICAgICAgICAgKiAhI3poIOihqOekuuWPkeWwhOWZqOawuOS5heWtmOWcqFxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gRFVSQVRJT05fSU5GSU5JVFlcbiAgICAgICAgICogQGRlZmF1bHQgLTFcbiAgICAgICAgICogQHN0YXRpY1xuICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICovXG4gICAgICAgIERVUkFUSU9OX0lORklOSVRZOiAtMSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgc3RhcnRpbmcgc2l6ZSBvZiB0aGUgcGFydGljbGUgaXMgZXF1YWwgdG8gdGhlIGVuZGluZyBzaXplLlxuICAgICAgICAgKiAhI3poIOihqOekuueykuWtkOeahOi1t+Wni+Wkp+Wwj+etieS6jue7k+adn+Wkp+Wwj+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gU1RBUlRfU0laRV9FUVVBTF9UT19FTkRfU0laRVxuICAgICAgICAgKiBAZGVmYXVsdCAtMVxuICAgICAgICAgKiBAc3RhdGljXG4gICAgICAgICAqIEByZWFkb25seVxuICAgICAgICAgKi9cbiAgICAgICAgU1RBUlRfU0laRV9FUVVBTF9UT19FTkRfU0laRTogLTEsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIHN0YXJ0aW5nIHJhZGl1cyBvZiB0aGUgcGFydGljbGUgaXMgZXF1YWwgdG8gdGhlIGVuZGluZyByYWRpdXMuXG4gICAgICAgICAqICEjemgg6KGo56S657KS5a2Q55qE6LW35aeL5Y2K5b6E562J5LqO57uT5p2f5Y2K5b6E44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBTVEFSVF9SQURJVVNfRVFVQUxfVE9fRU5EX1JBRElVU1xuICAgICAgICAgKiBAZGVmYXVsdCAtMVxuICAgICAgICAgKiBAc3RhdGljXG4gICAgICAgICAqIEByZWFkb25seVxuICAgICAgICAgKi9cbiAgICAgICAgU1RBUlRfUkFESVVTX0VRVUFMX1RPX0VORF9SQURJVVM6IC0xLFxuXG4gICAgICAgIEVtaXR0ZXJNb2RlOiBFbWl0dGVyTW9kZSxcbiAgICAgICAgUG9zaXRpb25UeXBlOiBQb3NpdGlvblR5cGUsXG5cblxuICAgICAgICBfUE5HUmVhZGVyOiBQTkdSZWFkZXIsXG4gICAgICAgIF9USUZGUmVhZGVyOiB0aWZmUmVhZGVyLFxuICAgIH0sXG5cbiAgICAvLyBFRElUT1IgUkVMQVRFRCBNRVRIT0RTXG5cbiAgICBvbkZvY3VzSW5FZGl0b3I6IENDX0VESVRPUiAmJiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2ZvY3VzZWQgPSB0cnVlO1xuICAgICAgICBsZXQgY29tcG9uZW50cyA9IGdldFBhcnRpY2xlQ29tcG9uZW50cyh0aGlzLm5vZGUpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbXBvbmVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudHNbaV0uX3N0YXJ0UHJldmlldygpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uTG9zdEZvY3VzSW5FZGl0b3I6IENDX0VESVRPUiAmJiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2ZvY3VzZWQgPSBmYWxzZTtcbiAgICAgICAgbGV0IGNvbXBvbmVudHMgPSBnZXRQYXJ0aWNsZUNvbXBvbmVudHModGhpcy5ub2RlKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb21wb25lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBjb21wb25lbnRzW2ldLl9zdG9wUHJldmlldygpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9zdGFydFByZXZpZXc6IENDX0VESVRPUiAmJiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnByZXZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXRTeXN0ZW0oKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfc3RvcFByZXZpZXc6IENDX0VESVRPUiAmJiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnByZXZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXRTeXN0ZW0oKTtcbiAgICAgICAgICAgIHRoaXMuc3RvcFN5c3RlbSgpO1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxlUmVuZGVyKCk7XG4gICAgICAgICAgICBjYy5lbmdpbmUucmVwYWludEluRWRpdE1vZGUoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fcHJldmlld1RpbWVyKSB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuX3ByZXZpZXdUaW1lcik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gTElGRS1DWUNMRSBNRVRIT0RTXG5cbiAgICAvLyBqdXN0IHVzZWQgdG8gcmVhZCBkYXRhIGZyb20gMS54XG4gICAgX2NvbnZlcnRUZXh0dXJlVG9TcHJpdGVGcmFtZTogQ0NfRURJVE9SICYmIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3Nwcml0ZUZyYW1lKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHRleHR1cmUgPSB0aGlzLnRleHR1cmU7XG4gICAgICAgIGlmICghdGV4dHVyZSB8fCAhdGV4dHVyZS5fdXVpZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IF90aGlzID0gdGhpcztcbiAgICAgICAgRWRpdG9yLmFzc2V0ZGIucXVlcnlNZXRhSW5mb0J5VXVpZCh0ZXh0dXJlLl91dWlkLCBmdW5jdGlvbiAoZXJyLCBtZXRhSW5mbykge1xuICAgICAgICAgICAgaWYgKGVycikgcmV0dXJuIEVkaXRvci5lcnJvcihlcnIpO1xuICAgICAgICAgICAgbGV0IG1ldGEgPSBKU09OLnBhcnNlKG1ldGFJbmZvLmpzb24pO1xuICAgICAgICAgICAgaWYgKG1ldGEudHlwZSA9PT0gJ3JhdycpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBOb2RlVXRpbHMgPSBFZGl0b3IucmVxdWlyZSgnYXBwOi8vZWRpdG9yL3BhZ2Uvc2NlbmUtdXRpbHMvdXRpbHMvbm9kZScpO1xuICAgICAgICAgICAgICAgIGxldCBub2RlUGF0aCA9IE5vZGVVdGlscy5nZXROb2RlUGF0aChfdGhpcy5ub2RlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gRWRpdG9yLndhcm4oYFRoZSB0ZXh0dXJlICR7bWV0YUluZm8uYXNzZXRVcmx9IHVzZWQgYnkgcGFydGljbGUgJHtub2RlUGF0aH0gZG9lcyBub3QgY29udGFpbiBhbnkgU3ByaXRlRnJhbWUsIHBsZWFzZSBzZXQgdGhlIHRleHR1cmUgdHlwZSB0byBTcHJpdGUgYW5kIHJlYXNzaWduIHRoZSBTcHJpdGVGcmFtZSB0byB0aGUgcGFydGljbGUgY29tcG9uZW50LmApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IFVybCA9IHJlcXVpcmUoJ2ZpcmUtdXJsJyk7XG4gICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBVcmwuYmFzZW5hbWVOb0V4dChtZXRhSW5mby5hc3NldFBhdGgpO1xuICAgICAgICAgICAgICAgIGxldCB1dWlkID0gbWV0YS5zdWJNZXRhc1tuYW1lXS51dWlkO1xuICAgICAgICAgICAgICAgIGNjLkFzc2V0TGlicmFyeS5sb2FkQXNzZXQodXVpZCwgZnVuY3Rpb24gKGVyciwgc3ApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikgcmV0dXJuIEVkaXRvci5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5zcHJpdGVGcmFtZSA9IHNwO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgX19wcmVsb2FkICgpIHtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcblxuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICB0aGlzLl9jb252ZXJ0VGV4dHVyZVRvU3ByaXRlRnJhbWUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9jdXN0b20gJiYgdGhpcy5zcHJpdGVGcmFtZSAmJiAhdGhpcy5fcmVuZGVyU3ByaXRlRnJhbWUpIHtcbiAgICAgICAgICAgIHRoaXMuX2FwcGx5U3ByaXRlRnJhbWUodGhpcy5zcHJpdGVGcmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5fZmlsZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2N1c3RvbSkge1xuICAgICAgICAgICAgICAgIGxldCBtaXNzQ3VzdG9tVGV4dHVyZSA9ICF0aGlzLl9nZXRUZXh0dXJlKCk7XG4gICAgICAgICAgICAgICAgaWYgKG1pc3NDdXN0b21UZXh0dXJlKSB7IFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hcHBseUZpbGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hcHBseUZpbGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBhdXRvIHBsYXlcbiAgICAgICAgaWYgKCFDQ19FRElUT1IgfHwgY2MuZW5naW5lLmlzUGxheWluZykge1xuICAgICAgICAgICAgaWYgKHRoaXMucGxheU9uTG9hZCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzZXRTeXN0ZW0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBVcGdyYWRlIGNvbG9yIHR5cGUgZnJvbSB2Mi4wLjBcbiAgICAgICAgaWYgKENDX0VESVRPUiAmJiAhKHRoaXMuX3N0YXJ0Q29sb3IgaW5zdGFuY2VvZiBjYy5Db2xvcikpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0Q29sb3IgPSBjYy5jb2xvcih0aGlzLl9zdGFydENvbG9yKTtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0Q29sb3JWYXIgPSBjYy5jb2xvcih0aGlzLl9zdGFydENvbG9yVmFyKTtcbiAgICAgICAgICAgIHRoaXMuX2VuZENvbG9yID0gY2MuY29sb3IodGhpcy5fZW5kQ29sb3IpO1xuICAgICAgICAgICAgdGhpcy5fZW5kQ29sb3JWYXIgPSBjYy5jb2xvcih0aGlzLl9lbmRDb2xvclZhcik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25EZXN0cm95ICgpIHtcbiAgICAgICAgaWYgKHRoaXMuYXV0b1JlbW92ZU9uRmluaXNoKSB7XG4gICAgICAgICAgICB0aGlzLmF1dG9SZW1vdmVPbkZpbmlzaCA9IGZhbHNlOyAgICAvLyBhbHJlYWR5IHJlbW92ZWRcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fYnVmZmVyKSB7XG4gICAgICAgICAgICB0aGlzLl9idWZmZXIuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5fYnVmZmVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICAvLyByZXNldCB1diBkYXRhIHNvIG5leHQgdGltZSBzaW11bGF0b3Igd2lsbCByZWZpbGwgYnVmZmVyIHV2IGluZm8gd2hlbiBleGl0IGVkaXQgbW9kZSBmcm9tIHByZWZhYi5cbiAgICAgICAgdGhpcy5fc2ltdWxhdG9yLl91dkZpbGxlZCA9IDA7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgfSxcbiAgICBcbiAgICBsYXRlVXBkYXRlIChkdCkge1xuICAgICAgICBpZiAoIXRoaXMuX3NpbXVsYXRvci5maW5pc2hlZCkge1xuICAgICAgICAgICAgdGhpcy5fc2ltdWxhdG9yLnN0ZXAoZHQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIEFQSVNcblxuICAgIC8qXG4gICAgICogISNlbiBBZGQgYSBwYXJ0aWNsZSB0byB0aGUgZW1pdHRlci5cbiAgICAgKiAhI3poIOa3u+WKoOS4gOS4queykuWtkOWIsOWPkeWwhOWZqOS4reOAglxuICAgICAqIEBtZXRob2QgYWRkUGFydGljbGVcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGFkZFBhcnRpY2xlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIE5vdCBpbXBsZW1lbnRlZFxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFN0b3AgZW1pdHRpbmcgcGFydGljbGVzLiBSdW5uaW5nIHBhcnRpY2xlcyB3aWxsIGNvbnRpbnVlIHRvIHJ1biB1bnRpbCB0aGV5IGRpZS5cbiAgICAgKiAhI3poIOWBnOatouWPkeWwhOWZqOWPkeWwhOeykuWtkO+8jOWPkeWwhOWHuuWOu+eahOeykuWtkOWwhue7p+e7rei/kOihjO+8jOebtOiHs+eykuWtkOeUn+WRvee7k+adn+OAglxuICAgICAqIEBtZXRob2Qgc3RvcFN5c3RlbVxuICAgICAqIEBleGFtcGxlXG4gICAgICogLy8gc3RvcCBwYXJ0aWNsZSBzeXN0ZW0uXG4gICAgICogbXlQYXJ0aWNsZVN5c3RlbS5zdG9wU3lzdGVtKCk7XG4gICAgICovXG4gICAgc3RvcFN5c3RlbTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9zdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fc2ltdWxhdG9yLnN0b3AoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBLaWxsIGFsbCBsaXZpbmcgcGFydGljbGVzLlxuICAgICAqICEjemgg5p2A5q275omA5pyJ5a2Y5Zyo55qE57KS5a2Q77yM54S25ZCO6YeN5paw5ZCv5Yqo57KS5a2Q5Y+R5bCE5Zmo44CCXG4gICAgICogQG1ldGhvZCByZXNldFN5c3RlbVxuICAgICAqIEBleGFtcGxlXG4gICAgICogLy8gcGxheSBwYXJ0aWNsZSBzeXN0ZW0uXG4gICAgICogbXlQYXJ0aWNsZVN5c3RlbS5yZXNldFN5c3RlbSgpO1xuICAgICAqL1xuICAgIHJlc2V0U3lzdGVtOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3N0b3BwZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fc2ltdWxhdG9yLnJlc2V0KCk7XG4gICAgICAgIHRoaXMubWFya0ZvclJlbmRlcih0cnVlKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBXaGV0aGVyIG9yIG5vdCB0aGUgc3lzdGVtIGlzIGZ1bGwuXG4gICAgICogISN6aCDlj5HlsITlmajkuK3nspLlrZDmmK/lkKblpKfkuo7nrYnkuo7orr7nva7nmoTmgLvnspLlrZDmlbDph4/jgIJcbiAgICAgKiBAbWV0aG9kIGlzRnVsbFxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaXNGdWxsOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5wYXJ0aWNsZUNvdW50ID49IHRoaXMudG90YWxQYXJ0aWNsZXMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgYSBuZXcgdGV4dHVyZSB3aXRoIGEgcmVjdC4gVGhlIHJlY3QgaXMgaW4gdGV4dHVyZSBwb3NpdGlvbiBhbmQgc2l6ZS5cbiAgICAgKiBQbGVhc2UgdXNlIHNwcml0ZUZyYW1lIHByb3BlcnR5IGluc3RlYWQsIHRoaXMgZnVuY3Rpb24gaXMgZGVwcmVjYXRlZCBzaW5jZSB2MS45XG4gICAgICogISN6aCDorr7nva7kuIDlvKDmlrDotLTlm77lkozlhbPogZTnmoTnn6nlvaLjgIJcbiAgICAgKiDor7fnm7TmjqXorr7nva4gc3ByaXRlRnJhbWUg5bGe5oCn77yM6L+Z5Liq5Ye95pWw5LuOIHYxLjkg54mI5pys5byA5aeL5bey57uP6KKr5bqf5byDXG4gICAgICogQG1ldGhvZCBzZXRUZXh0dXJlV2l0aFJlY3RcbiAgICAgKiBAcGFyYW0ge1RleHR1cmUyRH0gdGV4dHVyZVxuICAgICAqIEBwYXJhbSB7UmVjdH0gcmVjdFxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYxLjlcbiAgICAgKi9cbiAgICBzZXRUZXh0dXJlV2l0aFJlY3Q6IGZ1bmN0aW9uICh0ZXh0dXJlLCByZWN0KSB7XG4gICAgICAgIGlmICh0ZXh0dXJlIGluc3RhbmNlb2YgY2MuVGV4dHVyZTJEKSB7XG4gICAgICAgICAgICB0aGlzLnNwcml0ZUZyYW1lID0gbmV3IGNjLlNwcml0ZUZyYW1lKHRleHR1cmUsIHJlY3QpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIFBSSVZBVEUgTUVUSE9EU1xuXG4gICAgX2FwcGx5RmlsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgZmlsZSA9IHRoaXMuX2ZpbGU7XG4gICAgICAgIGlmIChmaWxlKSB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBjYy5sb2FkZXIubG9hZChmaWxlLm5hdGl2ZVVybCwgZnVuY3Rpb24gKGVyciwgY29udGVudCkge1xuICAgICAgICAgICAgICAgIGlmIChlcnIgfHwgIWNvbnRlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2MuZXJyb3JJRCg2MDI5KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIXNlbGYuaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2VsZi5fcGxpc3RGaWxlID0gZmlsZS5uYXRpdmVVcmw7XG4gICAgICAgICAgICAgICAgaWYgKCFzZWxmLl9jdXN0b20pIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5faW5pdFdpdGhEaWN0aW9uYXJ5KGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghc2VsZi5fc3ByaXRlRnJhbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZpbGUuc3ByaXRlRnJhbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc3ByaXRlRnJhbWUgPSBmaWxlLnNwcml0ZUZyYW1lO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHNlbGYuX2N1c3RvbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5faW5pdFRleHR1cmVXaXRoRGljdGlvbmFyeShjb250ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICghc2VsZi5fcmVuZGVyU3ByaXRlRnJhbWUgJiYgc2VsZi5fc3ByaXRlRnJhbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fYXBwbHlTcHJpdGVGcmFtZShzZWxmLnNwcml0ZUZyYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfaW5pdFRleHR1cmVXaXRoRGljdGlvbmFyeTogZnVuY3Rpb24gKGRpY3QpIHtcbiAgICAgICAgbGV0IGltZ1BhdGggPSBjYy5wYXRoLmNoYW5nZUJhc2VuYW1lKHRoaXMuX3BsaXN0RmlsZSwgZGljdFtcInRleHR1cmVGaWxlTmFtZVwiXSB8fCAnJyk7XG4gICAgICAgIC8vIHRleHR1cmVcbiAgICAgICAgaWYgKGRpY3RbXCJ0ZXh0dXJlRmlsZU5hbWVcIl0pIHtcbiAgICAgICAgICAgIC8vIFRyeSB0byBnZXQgdGhlIHRleHR1cmUgZnJvbSB0aGUgY2FjaGVcbiAgICAgICAgICAgIHRleHR1cmVVdGlsLmxvYWRJbWFnZShpbWdQYXRoLCBmdW5jdGlvbiAoZXJyb3IsIHRleHR1cmUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgZGljdFtcInRleHR1cmVGaWxlTmFtZVwiXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW5pdFRleHR1cmVXaXRoRGljdGlvbmFyeShkaWN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlRnJhbWUgPSBuZXcgY2MuU3ByaXRlRnJhbWUodGV4dHVyZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGljdFtcInRleHR1cmVJbWFnZURhdGFcIl0pIHtcbiAgICAgICAgICAgIGxldCB0ZXh0dXJlRGF0YSA9IGRpY3RbXCJ0ZXh0dXJlSW1hZ2VEYXRhXCJdO1xuXG4gICAgICAgICAgICBpZiAodGV4dHVyZURhdGEgJiYgdGV4dHVyZURhdGEubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGxldCB0ZXggPSBjYy5sb2FkZXIuZ2V0UmVzKGltZ1BhdGgpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICghdGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBidWZmZXIgPSBjb2RlYy51bnppcEJhc2U2NEFzQXJyYXkodGV4dHVyZURhdGEsIDEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWJ1ZmZlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2MubG9nSUQoNjAzMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsZXQgaW1hZ2VGb3JtYXQgPSBnZXRJbWFnZUZvcm1hdEJ5RGF0YShidWZmZXIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW1hZ2VGb3JtYXQgIT09IG1hY3JvLkltYWdlRm9ybWF0LlRJRkYgJiYgaW1hZ2VGb3JtYXQgIT09IG1hY3JvLkltYWdlRm9ybWF0LlBORykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2MubG9nSUQoNjAzMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsZXQgY2FudmFzT2JqID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYoaW1hZ2VGb3JtYXQgPT09IG1hY3JvLkltYWdlRm9ybWF0LlBORyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbXlQbmdPYmogPSBuZXcgUE5HUmVhZGVyKGJ1ZmZlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBteVBuZ09iai5yZW5kZXIoY2FudmFzT2JqKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpZmZSZWFkZXIucGFyc2VUSUZGKGJ1ZmZlcixjYW52YXNPYmopO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRleCA9IHRleHR1cmVVdGlsLmNhY2hlSW1hZ2UoaW1nUGF0aCwgY2FudmFzT2JqKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKCF0ZXgpXG4gICAgICAgICAgICAgICAgICAgIGNjLmxvZ0lEKDYwMzIpO1xuICAgICAgICAgICAgICAgIC8vIFRPRE86IFVzZSBjYy5sb2FkZXIgdG8gbG9hZCBhc3luY2hyb25vdXNseSB0aGUgU3ByaXRlRnJhbWUgb2JqZWN0LCBhdm9pZCB1c2luZyB0ZXh0dXJlVXRpbFxuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlRnJhbWUgPSBuZXcgY2MuU3ByaXRlRnJhbWUodGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLy8gcGFyc2luZyBwcm9jZXNzXG4gICAgX2luaXRXaXRoRGljdGlvbmFyeTogZnVuY3Rpb24gKGRpY3QpIHtcbiAgICAgICAgdGhpcy50b3RhbFBhcnRpY2xlcyA9IHBhcnNlSW50KGRpY3RbXCJtYXhQYXJ0aWNsZXNcIl0gfHwgMCk7XG5cbiAgICAgICAgLy8gbGlmZSBzcGFuXG4gICAgICAgIHRoaXMubGlmZSA9IHBhcnNlRmxvYXQoZGljdFtcInBhcnRpY2xlTGlmZXNwYW5cIl0gfHwgMCk7XG4gICAgICAgIHRoaXMubGlmZVZhciA9IHBhcnNlRmxvYXQoZGljdFtcInBhcnRpY2xlTGlmZXNwYW5WYXJpYW5jZVwiXSB8fCAwKTtcblxuICAgICAgICAvLyBlbWlzc2lvbiBSYXRlXG4gICAgICAgIGxldCBfdGVtcEVtaXNzaW9uUmF0ZSA9IGRpY3RbXCJlbWlzc2lvblJhdGVcIl07XG4gICAgICAgIGlmIChfdGVtcEVtaXNzaW9uUmF0ZSkge1xuICAgICAgICAgICAgdGhpcy5lbWlzc2lvblJhdGUgPSBfdGVtcEVtaXNzaW9uUmF0ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZW1pc3Npb25SYXRlID0gTWF0aC5taW4odGhpcy50b3RhbFBhcnRpY2xlcyAvIHRoaXMubGlmZSwgTnVtYmVyLk1BWF9WQUxVRSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkdXJhdGlvblxuICAgICAgICB0aGlzLmR1cmF0aW9uID0gcGFyc2VGbG9hdChkaWN0W1wiZHVyYXRpb25cIl0gfHwgMCk7XG5cbiAgICAgICAgLy8gYmxlbmQgZnVuY3Rpb25cbiAgICAgICAgdGhpcy5zcmNCbGVuZEZhY3RvciA9IHBhcnNlSW50KGRpY3RbXCJibGVuZEZ1bmNTb3VyY2VcIl0gfHwgbWFjcm8uU1JDX0FMUEhBKTtcbiAgICAgICAgdGhpcy5kc3RCbGVuZEZhY3RvciA9IHBhcnNlSW50KGRpY3RbXCJibGVuZEZ1bmNEZXN0aW5hdGlvblwiXSB8fCBtYWNyby5PTkVfTUlOVVNfU1JDX0FMUEhBKTtcblxuICAgICAgICAvLyBjb2xvclxuICAgICAgICBsZXQgbG9jU3RhcnRDb2xvciA9IHRoaXMuX3N0YXJ0Q29sb3I7XG4gICAgICAgIGxvY1N0YXJ0Q29sb3IuciA9IHBhcnNlRmxvYXQoZGljdFtcInN0YXJ0Q29sb3JSZWRcIl0gfHwgMCkgKiAyNTU7XG4gICAgICAgIGxvY1N0YXJ0Q29sb3IuZyA9IHBhcnNlRmxvYXQoZGljdFtcInN0YXJ0Q29sb3JHcmVlblwiXSB8fCAwKSAqIDI1NTtcbiAgICAgICAgbG9jU3RhcnRDb2xvci5iID0gcGFyc2VGbG9hdChkaWN0W1wic3RhcnRDb2xvckJsdWVcIl0gfHwgMCkgKiAyNTU7XG4gICAgICAgIGxvY1N0YXJ0Q29sb3IuYSA9IHBhcnNlRmxvYXQoZGljdFtcInN0YXJ0Q29sb3JBbHBoYVwiXSB8fCAwKSAqIDI1NTtcblxuICAgICAgICBsZXQgbG9jU3RhcnRDb2xvclZhciA9IHRoaXMuX3N0YXJ0Q29sb3JWYXI7XG4gICAgICAgIGxvY1N0YXJ0Q29sb3JWYXIuciA9IHBhcnNlRmxvYXQoZGljdFtcInN0YXJ0Q29sb3JWYXJpYW5jZVJlZFwiXSB8fCAwKSAqIDI1NTtcbiAgICAgICAgbG9jU3RhcnRDb2xvclZhci5nID0gcGFyc2VGbG9hdChkaWN0W1wic3RhcnRDb2xvclZhcmlhbmNlR3JlZW5cIl0gfHwgMCkgKiAyNTU7XG4gICAgICAgIGxvY1N0YXJ0Q29sb3JWYXIuYiA9IHBhcnNlRmxvYXQoZGljdFtcInN0YXJ0Q29sb3JWYXJpYW5jZUJsdWVcIl0gfHwgMCkgKiAyNTU7XG4gICAgICAgIGxvY1N0YXJ0Q29sb3JWYXIuYSA9IHBhcnNlRmxvYXQoZGljdFtcInN0YXJ0Q29sb3JWYXJpYW5jZUFscGhhXCJdIHx8IDApICogMjU1O1xuXG4gICAgICAgIGxldCBsb2NFbmRDb2xvciA9IHRoaXMuX2VuZENvbG9yO1xuICAgICAgICBsb2NFbmRDb2xvci5yID0gcGFyc2VGbG9hdChkaWN0W1wiZmluaXNoQ29sb3JSZWRcIl0gfHwgMCkgKiAyNTU7XG4gICAgICAgIGxvY0VuZENvbG9yLmcgPSBwYXJzZUZsb2F0KGRpY3RbXCJmaW5pc2hDb2xvckdyZWVuXCJdIHx8IDApICogMjU1O1xuICAgICAgICBsb2NFbmRDb2xvci5iID0gcGFyc2VGbG9hdChkaWN0W1wiZmluaXNoQ29sb3JCbHVlXCJdIHx8IDApICogMjU1O1xuICAgICAgICBsb2NFbmRDb2xvci5hID0gcGFyc2VGbG9hdChkaWN0W1wiZmluaXNoQ29sb3JBbHBoYVwiXSB8fCAwKSAqIDI1NTtcblxuICAgICAgICBsZXQgbG9jRW5kQ29sb3JWYXIgPSB0aGlzLl9lbmRDb2xvclZhcjtcbiAgICAgICAgbG9jRW5kQ29sb3JWYXIuciA9IHBhcnNlRmxvYXQoZGljdFtcImZpbmlzaENvbG9yVmFyaWFuY2VSZWRcIl0gfHwgMCkgKiAyNTU7XG4gICAgICAgIGxvY0VuZENvbG9yVmFyLmcgPSBwYXJzZUZsb2F0KGRpY3RbXCJmaW5pc2hDb2xvclZhcmlhbmNlR3JlZW5cIl0gfHwgMCkgKiAyNTU7XG4gICAgICAgIGxvY0VuZENvbG9yVmFyLmIgPSBwYXJzZUZsb2F0KGRpY3RbXCJmaW5pc2hDb2xvclZhcmlhbmNlQmx1ZVwiXSB8fCAwKSAqIDI1NTtcbiAgICAgICAgbG9jRW5kQ29sb3JWYXIuYSA9IHBhcnNlRmxvYXQoZGljdFtcImZpbmlzaENvbG9yVmFyaWFuY2VBbHBoYVwiXSB8fCAwKSAqIDI1NTtcblxuICAgICAgICAvLyBwYXJ0aWNsZSBzaXplXG4gICAgICAgIHRoaXMuc3RhcnRTaXplID0gcGFyc2VGbG9hdChkaWN0W1wic3RhcnRQYXJ0aWNsZVNpemVcIl0gfHwgMCk7XG4gICAgICAgIHRoaXMuc3RhcnRTaXplVmFyID0gcGFyc2VGbG9hdChkaWN0W1wic3RhcnRQYXJ0aWNsZVNpemVWYXJpYW5jZVwiXSB8fCAwKTtcbiAgICAgICAgdGhpcy5lbmRTaXplID0gcGFyc2VGbG9hdChkaWN0W1wiZmluaXNoUGFydGljbGVTaXplXCJdIHx8IDApO1xuICAgICAgICB0aGlzLmVuZFNpemVWYXIgPSBwYXJzZUZsb2F0KGRpY3RbXCJmaW5pc2hQYXJ0aWNsZVNpemVWYXJpYW5jZVwiXSB8fCAwKTtcblxuICAgICAgICAvLyBwb3NpdGlvblxuICAgICAgICAvLyBNYWtlIGVtcHR5IHBvc2l0aW9uVHlwZSB2YWx1ZSBhbmQgb2xkIHZlcnNpb24gY29tcGF0aWJsZVxuICAgICAgICB0aGlzLnBvc2l0aW9uVHlwZSA9IHBhcnNlRmxvYXQoZGljdFsncG9zaXRpb25UeXBlJ10gIT09IHVuZGVmaW5lZCA/IGRpY3RbJ3Bvc2l0aW9uVHlwZSddIDogUG9zaXRpb25UeXBlLlJFTEFUSVZFKTtcbiAgICAgICAgLy8gZm9yIFxuICAgICAgICB0aGlzLnNvdXJjZVBvcy54ID0gMDtcbiAgICAgICAgdGhpcy5zb3VyY2VQb3MueSA9IDA7XG4gICAgICAgIHRoaXMucG9zVmFyLnggPSBwYXJzZUZsb2F0KGRpY3RbXCJzb3VyY2VQb3NpdGlvblZhcmlhbmNleFwiXSB8fCAwKTtcbiAgICAgICAgdGhpcy5wb3NWYXIueSA9IHBhcnNlRmxvYXQoZGljdFtcInNvdXJjZVBvc2l0aW9uVmFyaWFuY2V5XCJdIHx8IDApO1xuICAgICAgICBcbiAgICAgICAgLy8gYW5nbGVcbiAgICAgICAgdGhpcy5hbmdsZSA9IHBhcnNlRmxvYXQoZGljdFtcImFuZ2xlXCJdIHx8IDApO1xuICAgICAgICB0aGlzLmFuZ2xlVmFyID0gcGFyc2VGbG9hdChkaWN0W1wiYW5nbGVWYXJpYW5jZVwiXSB8fCAwKTtcblxuICAgICAgICAvLyBTcGlubmluZ1xuICAgICAgICB0aGlzLnN0YXJ0U3BpbiA9IHBhcnNlRmxvYXQoZGljdFtcInJvdGF0aW9uU3RhcnRcIl0gfHwgMCk7XG4gICAgICAgIHRoaXMuc3RhcnRTcGluVmFyID0gcGFyc2VGbG9hdChkaWN0W1wicm90YXRpb25TdGFydFZhcmlhbmNlXCJdIHx8IDApO1xuICAgICAgICB0aGlzLmVuZFNwaW4gPSBwYXJzZUZsb2F0KGRpY3RbXCJyb3RhdGlvbkVuZFwiXSB8fCAwKTtcbiAgICAgICAgdGhpcy5lbmRTcGluVmFyID0gcGFyc2VGbG9hdChkaWN0W1wicm90YXRpb25FbmRWYXJpYW5jZVwiXSB8fCAwKTtcblxuICAgICAgICB0aGlzLmVtaXR0ZXJNb2RlID0gcGFyc2VJbnQoZGljdFtcImVtaXR0ZXJUeXBlXCJdIHx8IEVtaXR0ZXJNb2RlLkdSQVZJVFkpO1xuXG4gICAgICAgIC8vIE1vZGUgQTogR3Jhdml0eSArIHRhbmdlbnRpYWwgYWNjZWwgKyByYWRpYWwgYWNjZWxcbiAgICAgICAgaWYgKHRoaXMuZW1pdHRlck1vZGUgPT09IEVtaXR0ZXJNb2RlLkdSQVZJVFkpIHtcbiAgICAgICAgICAgIC8vIGdyYXZpdHlcbiAgICAgICAgICAgIHRoaXMuZ3Jhdml0eS54ID0gcGFyc2VGbG9hdChkaWN0W1wiZ3Jhdml0eXhcIl0gfHwgMCk7XG4gICAgICAgICAgICB0aGlzLmdyYXZpdHkueSA9IHBhcnNlRmxvYXQoZGljdFtcImdyYXZpdHl5XCJdIHx8IDApO1xuXG4gICAgICAgICAgICAvLyBzcGVlZFxuICAgICAgICAgICAgdGhpcy5zcGVlZCA9IHBhcnNlRmxvYXQoZGljdFtcInNwZWVkXCJdIHx8IDApO1xuICAgICAgICAgICAgdGhpcy5zcGVlZFZhciA9IHBhcnNlRmxvYXQoZGljdFtcInNwZWVkVmFyaWFuY2VcIl0gfHwgMCk7XG5cbiAgICAgICAgICAgIC8vIHJhZGlhbCBhY2NlbGVyYXRpb25cbiAgICAgICAgICAgIHRoaXMucmFkaWFsQWNjZWwgPSBwYXJzZUZsb2F0KGRpY3RbXCJyYWRpYWxBY2NlbGVyYXRpb25cIl0gfHwgMCk7XG4gICAgICAgICAgICB0aGlzLnJhZGlhbEFjY2VsVmFyID0gcGFyc2VGbG9hdChkaWN0W1wicmFkaWFsQWNjZWxWYXJpYW5jZVwiXSB8fCAwKTtcblxuICAgICAgICAgICAgLy8gdGFuZ2VudGlhbCBhY2NlbGVyYXRpb25cbiAgICAgICAgICAgIHRoaXMudGFuZ2VudGlhbEFjY2VsID0gcGFyc2VGbG9hdChkaWN0W1widGFuZ2VudGlhbEFjY2VsZXJhdGlvblwiXSB8fCAwKTtcbiAgICAgICAgICAgIHRoaXMudGFuZ2VudGlhbEFjY2VsVmFyID0gcGFyc2VGbG9hdChkaWN0W1widGFuZ2VudGlhbEFjY2VsVmFyaWFuY2VcIl0gfHwgMCk7XG5cbiAgICAgICAgICAgIC8vIHJvdGF0aW9uIGlzIGRpclxuICAgICAgICAgICAgbGV0IGxvY1JvdGF0aW9uSXNEaXIgPSBkaWN0W1wicm90YXRpb25Jc0RpclwiXSB8fCBcIlwiO1xuICAgICAgICAgICAgaWYgKGxvY1JvdGF0aW9uSXNEaXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBsb2NSb3RhdGlvbklzRGlyID0gbG9jUm90YXRpb25Jc0Rpci50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5yb3RhdGlvbklzRGlyID0gKGxvY1JvdGF0aW9uSXNEaXIgPT09IFwidHJ1ZVwiIHx8IGxvY1JvdGF0aW9uSXNEaXIgPT09IFwiMVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucm90YXRpb25Jc0RpciA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZW1pdHRlck1vZGUgPT09IEVtaXR0ZXJNb2RlLlJBRElVUykge1xuICAgICAgICAgICAgLy8gb3IgTW9kZSBCOiByYWRpdXMgbW92ZW1lbnRcbiAgICAgICAgICAgIHRoaXMuc3RhcnRSYWRpdXMgPSBwYXJzZUZsb2F0KGRpY3RbXCJtYXhSYWRpdXNcIl0gfHwgMCk7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0UmFkaXVzVmFyID0gcGFyc2VGbG9hdChkaWN0W1wibWF4UmFkaXVzVmFyaWFuY2VcIl0gfHwgMCk7XG4gICAgICAgICAgICB0aGlzLmVuZFJhZGl1cyA9IHBhcnNlRmxvYXQoZGljdFtcIm1pblJhZGl1c1wiXSB8fCAwKTtcbiAgICAgICAgICAgIHRoaXMuZW5kUmFkaXVzVmFyID0gcGFyc2VGbG9hdChkaWN0W1wibWluUmFkaXVzVmFyaWFuY2VcIl0gfHwgMCk7XG4gICAgICAgICAgICB0aGlzLnJvdGF0ZVBlclMgPSBwYXJzZUZsb2F0KGRpY3RbXCJyb3RhdGVQZXJTZWNvbmRcIl0gfHwgMCk7XG4gICAgICAgICAgICB0aGlzLnJvdGF0ZVBlclNWYXIgPSBwYXJzZUZsb2F0KGRpY3RbXCJyb3RhdGVQZXJTZWNvbmRWYXJpYW5jZVwiXSB8fCAwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNjLndhcm5JRCg2MDA5KTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2luaXRUZXh0dXJlV2l0aERpY3Rpb25hcnkoZGljdCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICBfdmFsaWRhdGVSZW5kZXIgKCkge1xuICAgICAgICBsZXQgdGV4dHVyZSA9IHRoaXMuX2dldFRleHR1cmUoKTtcbiAgICAgICAgaWYgKCF0ZXh0dXJlIHx8ICF0ZXh0dXJlLmxvYWRlZCkge1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxlUmVuZGVyKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICB9LFxuXG4gICAgX29uVGV4dHVyZUxvYWRlZCAoKSB7XG4gICAgICAgIHRoaXMuX3NpbXVsYXRvci51cGRhdGVVVnModHJ1ZSk7XG4gICAgICAgIHRoaXMuX3N5bmNBc3BlY3QoKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlTWF0ZXJpYWwoKTtcbiAgICAgICAgdGhpcy5tYXJrRm9yUmVuZGVyKHRydWUpO1xuICAgIH0sXG5cbiAgICBfc3luY0FzcGVjdCAoKSB7XG4gICAgICAgIGxldCBmcmFtZVJlY3QgPSB0aGlzLl9yZW5kZXJTcHJpdGVGcmFtZS5fcmVjdDtcbiAgICAgICAgdGhpcy5fYXNwZWN0UmF0aW8gPSBmcmFtZVJlY3Qud2lkdGggLyBmcmFtZVJlY3QuaGVpZ2h0O1xuICAgIH0sXG5cbiAgICBfYXBwbHlTcHJpdGVGcmFtZSAoKSB7XG4gICAgICAgIHRoaXMuX3JlbmRlclNwcml0ZUZyYW1lID0gdGhpcy5fcmVuZGVyU3ByaXRlRnJhbWUgfHwgdGhpcy5fc3ByaXRlRnJhbWU7XG4gICAgICAgIGlmICh0aGlzLl9yZW5kZXJTcHJpdGVGcmFtZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3JlbmRlclNwcml0ZUZyYW1lLnRleHR1cmVMb2FkZWQoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX29uVGV4dHVyZUxvYWRlZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVuZGVyU3ByaXRlRnJhbWUub25UZXh0dXJlTG9hZGVkKHRoaXMuX29uVGV4dHVyZUxvYWRlZCwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2dldFRleHR1cmUgKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuX3JlbmRlclNwcml0ZUZyYW1lICYmIHRoaXMuX3JlbmRlclNwcml0ZUZyYW1lLmdldFRleHR1cmUoKSkgfHwgdGhpcy5fdGV4dHVyZTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZU1hdGVyaWFsICgpIHtcbiAgICAgICAgbGV0IG1hdGVyaWFsID0gdGhpcy5fbWF0ZXJpYWxzWzBdO1xuICAgICAgICBpZiAoIW1hdGVyaWFsKSByZXR1cm47XG4gICAgICAgIFxuICAgICAgICBtYXRlcmlhbC5kZWZpbmUoJ0NDX1VTRV9NT0RFTCcsIHRoaXMuX3Bvc2l0aW9uVHlwZSAhPT0gUG9zaXRpb25UeXBlLkZSRUUpO1xuICAgICAgICBtYXRlcmlhbC5zZXRQcm9wZXJ0eSgndGV4dHVyZScsIHRoaXMuX2dldFRleHR1cmUoKSk7XG5cbiAgICAgICAgQmxlbmRGdW5jLnByb3RvdHlwZS5fdXBkYXRlTWF0ZXJpYWwuY2FsbCh0aGlzKTtcbiAgICB9LFxuICAgIFxuICAgIF9maW5pc2hlZFNpbXVsYXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldmlldyAmJiB0aGlzLl9mb2N1c2VkICYmICF0aGlzLmFjdGl2ZSAmJiAhY2MuZW5naW5lLmlzUGxheWluZykge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzZXRTeXN0ZW0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlc2V0U3lzdGVtKCk7XG4gICAgICAgIHRoaXMuc3RvcFN5c3RlbSgpO1xuICAgICAgICB0aGlzLmRpc2FibGVSZW5kZXIoKTtcbiAgICAgICAgaWYgKHRoaXMuYXV0b1JlbW92ZU9uRmluaXNoICYmIHRoaXMuX3N0b3BwZWQpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuUGFydGljbGVTeXN0ZW0gPSBtb2R1bGUuZXhwb3J0cyA9IFBhcnRpY2xlU3lzdGVtO1xuXG4iXX0=