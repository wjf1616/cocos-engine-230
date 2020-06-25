
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extensions/dragonbones/ArmatureDisplay.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
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
var RenderComponent = require('../../cocos2d/core/components/CCRenderComponent');

var EventTarget = require('../../cocos2d/core/event/event-target');

var Graphics = require('../../cocos2d/core/graphics/graphics');

var RenderFlow = require('../../cocos2d/core/renderer/render-flow');

var FLAG_POST_RENDER = RenderFlow.FLAG_POST_RENDER;

var ArmatureCache = require('./ArmatureCache');

var AttachUtil = require('./AttachUtil');
/**
 * @module dragonBones
 */


var DefaultArmaturesEnum = cc.Enum({
  'default': -1
});
var DefaultAnimsEnum = cc.Enum({
  '<None>': 0
});
var DefaultCacheMode = cc.Enum({
  'REALTIME': 0
});
/**
 * !#en Enum for cache mode type.
 * !#zh Dragonbones渲染类型
 * @enum ArmatureDisplay.AnimationCacheMode
 */

var AnimationCacheMode = cc.Enum({
  /**
   * !#en The realtime mode.
   * !#zh 实时计算模式。
   * @property {Number} REALTIME
   */
  REALTIME: 0,

  /**
   * !#en The shared cache mode.
   * !#zh 共享缓存模式。
   * @property {Number} SHARED_CACHE
   */
  SHARED_CACHE: 1,

  /**
   * !#en The private cache mode.
   * !#zh 私有缓存模式。
   * @property {Number} PRIVATE_CACHE
   */
  PRIVATE_CACHE: 2
});

function setEnumAttr(obj, propName, enumDef) {
  cc.Class.Attr.setClassAttr(obj, propName, 'type', 'Enum');
  cc.Class.Attr.setClassAttr(obj, propName, 'enumList', cc.Enum.getList(enumDef));
}
/**
 * !#en
 * The Armature Display of DragonBones <br/>
 * <br/>
 * (Armature Display has a reference to a DragonBonesAsset and stores the state for ArmatureDisplay instance,
 * which consists of the current pose's bone SRT, slot colors, and which slot attachments are visible. <br/>
 * Multiple Armature Display can use the same DragonBonesAsset which includes all animations, skins, and attachments.) <br/>
 * !#zh
 * DragonBones 骨骼动画 <br/>
 * <br/>
 * (Armature Display 具有对骨骼数据的引用并且存储了骨骼实例的状态，
 * 它由当前的骨骼动作，slot 颜色，和可见的 slot attachments 组成。<br/>
 * 多个 Armature Display 可以使用相同的骨骼数据，其中包括所有的动画，皮肤和 attachments。)<br/>
 *
 * @class ArmatureDisplay
 * @extends RenderComponent
 */


var ArmatureDisplay = cc.Class({
  name: 'dragonBones.ArmatureDisplay',
  "extends": RenderComponent,
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.renderers/DragonBones',
    inspector: 'packages://inspector/inspectors/comps/skeleton2d.js'
  },
  statics: {
    AnimationCacheMode: AnimationCacheMode
  },
  properties: {
    _factory: {
      "default": null,
      type: dragonBones.CCFactory,
      serializable: false
    },

    /**
     * !#en
     * The DragonBones data contains the armatures information (bind pose bones, slots, draw order,
     * attachments, skins, etc) and animations but does not hold any state.<br/>
     * Multiple ArmatureDisplay can share the same DragonBones data.
     * !#zh
     * 骨骼数据包含了骨骼信息（绑定骨骼动作，slots，渲染顺序，
     * attachments，皮肤等等）和动画但不持有任何状态。<br/>
     * 多个 ArmatureDisplay 可以共用相同的骨骼数据。
     * @property {DragonBonesAsset} dragonAsset
     */
    dragonAsset: {
      "default": null,
      type: dragonBones.DragonBonesAsset,
      notify: function notify() {
        this._refresh();

        if (CC_EDITOR) {
          this._defaultArmatureIndex = 0;
          this._animationIndex = 0;
        }
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.dragon_bones_asset'
    },

    /**
     * !#en
     * The atlas asset for the DragonBones.
     * !#zh
     * 骨骼数据所需的 Atlas Texture 数据。
     * @property {DragonBonesAtlasAsset} dragonAtlasAsset
     */
    dragonAtlasAsset: {
      "default": null,
      type: dragonBones.DragonBonesAtlasAsset,
      notify: function notify() {
        // parse the atlas asset data
        this._parseDragonAtlasAsset();

        this._refresh();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.dragon_bones_atlas_asset'
    },
    _armatureName: '',

    /**
     * !#en The name of current armature.
     * !#zh 当前的 Armature 名称。
     * @property {String} armatureName
     */
    armatureName: {
      get: function get() {
        return this._armatureName;
      },
      set: function set(value) {
        this._armatureName = value;
        var animNames = this.getAnimationNames(this._armatureName);

        if (!this.animationName || animNames.indexOf(this.animationName) < 0) {
          if (CC_EDITOR) {
            this.animationName = animNames[0];
          } else {
            // Not use default animation name at runtime
            this.animationName = '';
          }
        }

        if (this._armature && !this.isAnimationCached()) {
          this._factory._dragonBones.clock.remove(this._armature);
        }

        this._refresh();

        if (this._armature && !this.isAnimationCached()) {
          this._factory._dragonBones.clock.add(this._armature);
        }
      },
      visible: false
    },
    _animationName: '',

    /**
     * !#en The name of current playing animation.
     * !#zh 当前播放的动画名称。
     * @property {String} animationName
     */
    animationName: {
      get: function get() {
        return this._animationName;
      },
      set: function set(value) {
        this._animationName = value;
      },
      visible: false
    },

    /**
     * @property {Number} _defaultArmatureIndex
     */
    _defaultArmatureIndex: {
      "default": 0,
      notify: function notify() {
        var armatureName = '';

        if (this.dragonAsset) {
          var armaturesEnum;

          if (this.dragonAsset) {
            armaturesEnum = this.dragonAsset.getArmatureEnum();
          }

          if (!armaturesEnum) {
            return cc.errorID(7400, this.name);
          }

          armatureName = armaturesEnum[this._defaultArmatureIndex];
        }

        if (armatureName !== undefined) {
          this.armatureName = armatureName;
        } else {
          cc.errorID(7401, this.name);
        }
      },
      type: DefaultArmaturesEnum,
      visible: true,
      editorOnly: true,
      animatable: false,
      displayName: "Armature",
      tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.armature_name'
    },
    // value of 0 represents no animation
    _animationIndex: {
      "default": 0,
      notify: function notify() {
        if (this._animationIndex === 0) {
          this.animationName = '';
          return;
        }

        var animsEnum;

        if (this.dragonAsset) {
          animsEnum = this.dragonAsset.getAnimsEnum(this.armatureName);
        }

        if (!animsEnum) {
          return;
        }

        var animName = animsEnum[this._animationIndex];

        if (animName !== undefined) {
          this.playAnimation(animName, this.playTimes);
        } else {
          cc.errorID(7402, this.name);
        }
      },
      type: DefaultAnimsEnum,
      visible: true,
      editorOnly: true,
      displayName: 'Animation',
      tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.animation_name'
    },
    // Record pre cache mode.
    _preCacheMode: -1,
    _cacheMode: AnimationCacheMode.REALTIME,
    _defaultCacheMode: {
      "default": 0,
      type: AnimationCacheMode,
      notify: function notify() {
        this.setAnimationCacheMode(this._defaultCacheMode);
      },
      editorOnly: true,
      visible: true,
      animatable: false,
      displayName: "Animation Cache Mode",
      tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.animation_cache_mode'
    },

    /**
     * !#en The time scale of this armature.
     * !#zh 当前骨骼中所有动画的时间缩放率。
     * @property {Number} timeScale
     * @default 1
     */
    timeScale: {
      "default": 1,
      notify: function notify() {
        if (this._armature && !this.isAnimationCached()) {
          this._armature.animation.timeScale = this.timeScale;
        }
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.time_scale'
    },

    /**
     * !#en The play times of the default animation.
     *      -1 means using the value of config file;
     *      0 means repeat for ever
     *      >0 means repeat times
     * !#zh 播放默认动画的循环次数
     *      -1 表示使用配置文件中的默认值;
     *      0 表示无限循环
     *      >0 表示循环次数
     * @property {Number} playTimes
     * @default -1
     */
    playTimes: {
      "default": -1,
      tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.play_times'
    },

    /**
     * !#en Indicates whether to enable premultiplied alpha.
     * You should disable this option when image's transparent area appears to have opaque pixels,
     * or enable this option when image's half transparent area appears to be darken.
     * !#zh 是否启用贴图预乘。
     * 当图片的透明区域出现色块时需要关闭该选项，当图片的半透明区域颜色变黑时需要启用该选项。
     * @property {Boolean} premultipliedAlpha
     * @default false
     */
    premultipliedAlpha: {
      "default": false,
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.premultipliedAlpha'
    },

    /**
     * !#en Indicates whether open debug bones.
     * !#zh 是否显示 bone 的 debug 信息。
     * @property {Boolean} debugBones
     * @default false
     */
    debugBones: {
      "default": false,
      notify: function notify() {
        this._updateDebugDraw();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.debug_bones'
    },

    /**
     * !#en Enabled batch model, if skeleton is complex, do not enable batch, or will lower performance.
     * !#zh 开启合批，如果渲染大量相同纹理，且结构简单的骨骼动画，开启合批可以降低drawcall，否则请不要开启，cpu消耗会上升。
     * @property {Boolean} enableBatch
     * @default false
     */
    enableBatch: {
      "default": false,
      notify: function notify() {
        this._updateBatch();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.enabled_batch'
    },
    // DragonBones data store key.
    _armatureKey: "",
    // Below properties will effect when cache mode is SHARED_CACHE or PRIVATE_CACHE.
    // accumulate time
    _accTime: 0,
    // Play times counter
    _playCount: 0,
    // Frame cache
    _frameCache: null,
    // Cur frame
    _curFrame: null,
    // Playing flag
    _playing: false,
    // Armature cache
    _armatureCache: null
  },
  ctor: function ctor() {
    // Property _materialCache Use to cache material,since dragonBones may use multiple texture,
    // it will clone from the '_material' property,if the dragonbones only have one texture,
    // it will just use the _material,won't clone it.
    // So if invoke getMaterial,it only return _material,if you want to change all materialCache,
    // you can change materialCache directly.
    this._eventTarget = new EventTarget();
    this._materialCache = {};
    this._inited = false;
    this.attachUtil = new AttachUtil();
    this._factory = dragonBones.CCFactory.getInstance();
  },
  onLoad: function onLoad() {
    // Adapt to old code,remove unuse child which is created by old code.
    // This logic can be remove after 2.2 or later.
    var children = this.node.children;

    for (var i = 0, n = children.length; i < n; i++) {
      var child = children[i];

      var pos = child._name && child._name.search('CHILD_ARMATURE-');

      if (pos === 0) {
        child.destroy();
      }
    }
  },
  // if change use batch mode, just clear material cache
  _updateBatch: function _updateBatch() {
    var baseMaterial = this.getMaterial(0);

    if (baseMaterial) {
      baseMaterial.define('CC_USE_MODEL', !this.enableBatch);
    }

    this._materialCache = {};
  },
  // override base class _updateMaterial to set define value and clear material cache
  _updateMaterial: function _updateMaterial() {
    var baseMaterial = this.getMaterial(0);

    if (baseMaterial) {
      baseMaterial.define('CC_USE_MODEL', !this.enableBatch);
      baseMaterial.define('USE_TEXTURE', true);
    }

    this._materialCache = {};
  },
  // override base class disableRender to clear post render flag
  disableRender: function disableRender() {
    this._super();

    this.node._renderFlag &= ~FLAG_POST_RENDER;
  },
  // override base class disableRender to add post render flag
  markForRender: function markForRender(enable) {
    this._super(enable);

    if (enable) {
      this.node._renderFlag |= FLAG_POST_RENDER;
    } else {
      this.node._renderFlag &= ~FLAG_POST_RENDER;
    }
  },
  _validateRender: function _validateRender() {
    var texture = this.dragonAtlasAsset && this.dragonAtlasAsset.texture;

    if (!texture || !texture.loaded) {
      this.disableRender();
      return;
    }

    this._super();
  },
  __preload: function __preload() {
    this._init();
  },
  _init: function _init() {
    if (this._inited) return;
    this._inited = true;

    this._resetAssembler();

    this._activateMaterial();

    this._parseDragonAtlasAsset();

    this._refresh();

    var children = this.node.children;

    for (var i = 0, n = children.length; i < n; i++) {
      var child = children[i];

      if (child && child._name === "DEBUG_DRAW_NODE") {
        child.destroy();
      }
    }

    this._updateDebugDraw();
  },

  /**
   * !#en
   * The key of dragonbones cache data, which is regard as 'dragonbonesName', when you want to change dragonbones cloth.
   * !#zh 
   * 缓存龙骨数据的key值，换装的时会使用到该值，作为dragonbonesName使用
   * @method getArmatureKey
   * @return {String}
   * @example
   * let factory = dragonBones.CCFactory.getInstance();
   * let needChangeSlot = needChangeArmature.armature().getSlot("changeSlotName");
   * factory.replaceSlotDisplay(toChangeArmature.getArmatureKey(), "armatureName", "slotName", "displayName", needChangeSlot);
   */
  getArmatureKey: function getArmatureKey() {
    return this._armatureKey;
  },

  /**
   * !#en
   * It's best to set cache mode before set property 'dragonAsset', or will waste some cpu time.
   * If set the mode in editor, then no need to worry about order problem.
   * !#zh 
   * 若想切换渲染模式，最好在设置'dragonAsset'之前，先设置好渲染模式，否则有运行时开销。
   * 若在编辑中设置渲染模式，则无需担心设置次序的问题。
   * 
   * @method setAnimationCacheMode
   * @param {AnimationCacheMode} cacheMode
   * @example
   * armatureDisplay.setAnimationCacheMode(dragonBones.ArmatureDisplay.AnimationCacheMode.SHARED_CACHE);
   */
  setAnimationCacheMode: function setAnimationCacheMode(cacheMode) {
    if (this._preCacheMode !== cacheMode) {
      this._cacheMode = cacheMode;

      this._buildArmature();
    }
  },

  /**
   * !#en Whether in cached mode.
   * !#zh 当前是否处于缓存模式。
   * @method isAnimationCached
   * @return {Boolean}
   */
  isAnimationCached: function isAnimationCached() {
    if (CC_EDITOR) return false;
    return this._cacheMode !== AnimationCacheMode.REALTIME;
  },
  onEnable: function onEnable() {
    this._super(); // If cache mode is cache, no need to update by dragonbones library.


    if (this._armature && !this.isAnimationCached()) {
      this._factory._dragonBones.clock.add(this._armature);
    }
  },
  onDisable: function onDisable() {
    this._super(); // If cache mode is cache, no need to update by dragonbones library.


    if (this._armature && !this.isAnimationCached()) {
      this._factory._dragonBones.clock.remove(this._armature);
    }
  },
  _emitCacheCompleteEvent: function _emitCacheCompleteEvent() {
    // Animation loop complete, the event diffrent from dragonbones inner event,
    // It has no event object.
    this._eventTarget.emit(dragonBones.EventObject.LOOP_COMPLETE); // Animation complete the event diffrent from dragonbones inner event,
    // It has no event object.


    this._eventTarget.emit(dragonBones.EventObject.COMPLETE);
  },
  update: function update(dt) {
    if (!this.isAnimationCached()) return;
    if (!this._frameCache) return;
    var frameCache = this._frameCache;

    if (!frameCache.isInited()) {
      return;
    }

    var frames = frameCache.frames;

    if (!this._playing) {
      if (frameCache.isInvalid()) {
        frameCache.updateToFrame();
        this._curFrame = frames[frames.length - 1];
      }

      return;
    }

    var frameTime = ArmatureCache.FrameTime; // Animation Start, the event diffrent from dragonbones inner event,
    // It has no event object.

    if (this._accTime == 0 && this._playCount == 0) {
      this._eventTarget.emit(dragonBones.EventObject.START);
    }

    var globalTimeScale = dragonBones.timeScale;
    this._accTime += dt * this.timeScale * globalTimeScale;
    var frameIdx = Math.floor(this._accTime / frameTime);

    if (!frameCache.isCompleted) {
      frameCache.updateToFrame(frameIdx);
    }

    if (frameCache.isCompleted && frameIdx >= frames.length) {
      this._playCount++;

      if (this.playTimes > 0 && this._playCount >= this.playTimes) {
        // set frame to end frame.
        this._curFrame = frames[frames.length - 1];
        this._accTime = 0;
        this._playing = false;
        this._playCount = 0;

        this._emitCacheCompleteEvent();

        return;
      }

      this._accTime = 0;
      frameIdx = 0;

      this._emitCacheCompleteEvent();
    }

    this._curFrame = frames[frameIdx];
  },
  onDestroy: function onDestroy() {
    this._super();

    this._inited = false;

    if (!CC_EDITOR) {
      if (this._cacheMode === AnimationCacheMode.PRIVATE_CACHE) {
        this._armatureCache.dispose();

        this._armatureCache = null;
        this._armature = null;
      } else if (this._cacheMode === AnimationCacheMode.SHARED_CACHE) {
        this._armatureCache = null;
        this._armature = null;
      } else if (this._armature) {
        this._armature.dispose();

        this._armature = null;
      }
    } else {
      if (this._armature) {
        this._armature.dispose();

        this._armature = null;
      }
    }
  },
  _updateDebugDraw: function _updateDebugDraw() {
    if (this.debugBones) {
      if (!this._debugDraw) {
        var debugDrawNode = new cc.PrivateNode();
        debugDrawNode.name = 'DEBUG_DRAW_NODE';
        var debugDraw = debugDrawNode.addComponent(Graphics);
        debugDraw.lineWidth = 1;
        debugDraw.strokeColor = cc.color(255, 0, 0, 255);
        this._debugDraw = debugDraw;
      }

      this._debugDraw.node.parent = this.node;
    } else if (this._debugDraw) {
      this._debugDraw.node.parent = null;
    }
  },
  _buildArmature: function _buildArmature() {
    if (!this.dragonAsset || !this.dragonAtlasAsset || !this.armatureName) return; // Switch Asset or Atlas or cacheMode will rebuild armature.

    if (this._armature) {
      // dispose pre build armature
      if (!CC_EDITOR) {
        if (this._preCacheMode === AnimationCacheMode.PRIVATE_CACHE) {
          this._armatureCache.dispose();
        } else if (this._preCacheMode === AnimationCacheMode.REALTIME) {
          this._armature.dispose();
        }
      } else {
        this._armature.dispose();
      }

      this._armatureCache = null;
      this._armature = null;
      this._displayProxy = null;
      this._frameCache = null;
      this._curFrame = null;
      this._playing = false;
      this._preCacheMode = null;
    }

    if (!CC_EDITOR) {
      if (this._cacheMode === AnimationCacheMode.SHARED_CACHE) {
        this._armatureCache = ArmatureCache.sharedCache;
      } else if (this._cacheMode === AnimationCacheMode.PRIVATE_CACHE) {
        this._armatureCache = new ArmatureCache();

        this._armatureCache.enablePrivateMode();
      }
    }

    var atlasUUID = this.dragonAtlasAsset._uuid;
    this._armatureKey = this.dragonAsset.init(this._factory, atlasUUID);

    if (this.isAnimationCached()) {
      this._armature = this._armatureCache.getArmatureCache(this.armatureName, this._armatureKey, atlasUUID);

      if (!this._armature) {
        // Cache fail,swith to REALTIME cache mode.
        this._cacheMode = AnimationCacheMode.REALTIME;
      }
    }

    this._preCacheMode = this._cacheMode;

    if (CC_EDITOR || this._cacheMode === AnimationCacheMode.REALTIME) {
      this._displayProxy = this._factory.buildArmatureDisplay(this.armatureName, this._armatureKey, "", atlasUUID);
      if (!this._displayProxy) return;
      this._displayProxy._ccNode = this.node;

      this._displayProxy.setEventTarget(this._eventTarget);

      this._armature = this._displayProxy._armature;
      this._armature.animation.timeScale = this.timeScale; // If change mode or armature, armature must insert into clock.

      this._factory._dragonBones.clock.add(this._armature);
    }

    if (this._cacheMode !== AnimationCacheMode.REALTIME && this.debugBones) {
      cc.warn("Debug bones is invalid in cached mode");
    }

    if (this._armature) {
      var armatureData = this._armature.armatureData;
      var aabb = armatureData.aabb;
      this.node.setContentSize(aabb.width, aabb.height);
    }

    this._updateBatch();

    this.attachUtil.init(this);

    this.attachUtil._associateAttachedNode();

    if (this.animationName) {
      this.playAnimation(this.animationName, this.playTimes);
    }

    this.markForRender(true);
  },
  _parseDragonAtlasAsset: function _parseDragonAtlasAsset() {
    if (this.dragonAtlasAsset) {
      this.dragonAtlasAsset.init(this._factory);
    }
  },
  _refresh: function _refresh() {
    this._buildArmature();

    if (CC_EDITOR) {
      // update inspector
      this._updateArmatureEnum();

      this._updateAnimEnum();

      this._updateCacheModeEnum();

      Editor.Utils.refreshSelectedInspector('node', this.node.uuid);
    }
  },
  _updateCacheModeEnum: CC_EDITOR && function () {
    if (this._armature && ArmatureCache.canCache(this._armature)) {
      setEnumAttr(this, '_defaultCacheMode', AnimationCacheMode);
    } else {
      setEnumAttr(this, '_defaultCacheMode', DefaultCacheMode);
    }
  },
  // update animation list for editor
  _updateAnimEnum: CC_EDITOR && function () {
    var animEnum;

    if (this.dragonAsset) {
      animEnum = this.dragonAsset.getAnimsEnum(this.armatureName);
    } // change enum


    setEnumAttr(this, '_animationIndex', animEnum || DefaultAnimsEnum);
  },
  // update armature list for editor
  _updateArmatureEnum: CC_EDITOR && function () {
    var armatureEnum;

    if (this.dragonAsset) {
      armatureEnum = this.dragonAsset.getArmatureEnum();
    } // change enum


    setEnumAttr(this, '_defaultArmatureIndex', armatureEnum || DefaultArmaturesEnum);
  },

  /**
   * !#en
   * Play the specified animation.
   * Parameter animName specify the animation name.
   * Parameter playTimes specify the repeat times of the animation.
   * -1 means use the value of the config file.
   * 0 means play the animation for ever.
   * >0 means repeat times.
   * !#zh 
   * 播放指定的动画.
   * animName 指定播放动画的名称。
   * playTimes 指定播放动画的次数。
   * -1 为使用配置文件中的次数。
   * 0 为无限循环播放。
   * >0 为动画的重复次数。
   * @method playAnimation
   * @param {String} animName
   * @param {Number} playTimes
   * @return {dragonBones.AnimationState}
   */
  playAnimation: function playAnimation(animName, playTimes) {
    this.playTimes = playTimes === undefined ? -1 : playTimes;
    this.animationName = animName;

    if (this.isAnimationCached()) {
      var cache = this._armatureCache.getAnimationCache(this._armatureKey, animName);

      if (!cache) {
        cache = this._armatureCache.initAnimationCache(this._armatureKey, animName);
      }

      if (cache) {
        this._accTime = 0;
        this._playCount = 0;
        this._frameCache = cache;

        if (this.attachUtil._hasAttachedNode()) {
          this._frameCache.enableCacheAttachedInfo();
        }

        this._frameCache.updateToFrame(0);

        this._playing = true;
        this._curFrame = this._frameCache.frames[0];
      }
    } else {
      if (this._armature) {
        return this._armature.animation.play(animName, this.playTimes);
      }
    }
  },

  /**
   * !#en
   * Updating an animation cache to calculate all frame data in the animation is a cost in 
   * performance due to calculating all data in a single frame.
   * To update the cache, use the invalidAnimationCache method with high performance.
   * !#zh
   * 更新某个动画缓存, 预计算动画中所有帧数据，由于在单帧计算所有数据，所以较消耗性能。
   * 若想更新缓存，可使用 invalidAnimationCache 方法，具有较高性能。
   * @method updateAnimationCache
   * @param {String} animName
   */
  updateAnimationCache: function updateAnimationCache(animName) {
    if (!this.isAnimationCached()) return;

    this._armatureCache.updateAnimationCache(this._armatureKey, animName);
  },

  /**
   * !#en
   * Invalidates the animation cache, which is then recomputed on each frame..
   * !#zh
   * 使动画缓存失效，之后会在每帧重新计算。
   * @method invalidAnimationCache
   */
  invalidAnimationCache: function invalidAnimationCache() {
    if (!this.isAnimationCached()) return;

    this._armatureCache.invalidAnimationCache(this._armatureKey);
  },

  /**
   * !#en
   * Get the all armature names in the DragonBones Data.
   * !#zh
   * 获取 DragonBones 数据中所有的 armature 名称
   * @method getArmatureNames
   * @returns {Array}
   */
  getArmatureNames: function getArmatureNames() {
    var dragonBonesData = this._factory.getDragonBonesData(this._armatureKey);

    return dragonBonesData && dragonBonesData.armatureNames || [];
  },

  /**
   * !#en
   * Get the all animation names of specified armature.
   * !#zh
   * 获取指定的 armature 的所有动画名称。
   * @method getAnimationNames
   * @param {String} armatureName
   * @returns {Array}
   */
  getAnimationNames: function getAnimationNames(armatureName) {
    var ret = [];

    var dragonBonesData = this._factory.getDragonBonesData(this._armatureKey);

    if (dragonBonesData) {
      var armatureData = dragonBonesData.getArmature(armatureName);

      if (armatureData) {
        for (var animName in armatureData.animations) {
          if (armatureData.animations.hasOwnProperty(animName)) {
            ret.push(animName);
          }
        }
      }
    }

    return ret;
  },

  /**
   * !#en
   * Add event listener for the DragonBones Event, the same to addEventListener.
   * !#zh
   * 添加 DragonBones 事件监听器，与 addEventListener 作用相同。
   * @method on
   * @param {String} type - A string representing the event type to listen for.
   * @param {Function} listener - The callback that will be invoked when the event is dispatched.
   * @param {Event} listener.event event
   * @param {Object} [target] - The target (this object) to invoke the callback, can be null
   */
  on: function on(eventType, listener, target) {
    this.addEventListener(eventType, listener, target);
  },

  /**
   * !#en
   * Remove the event listener for the DragonBones Event, the same to removeEventListener.
   * !#zh
   * 移除 DragonBones 事件监听器，与 removeEventListener 作用相同。
   * @method off
   * @param {String} type - A string representing the event type to listen for.
   * @param {Function} [listener]
   * @param {Object} [target]
   */
  off: function off(eventType, listener, target) {
    this.removeEventListener(eventType, listener, target);
  },

  /**
   * !#en
   * Add DragonBones one-time event listener, the callback will remove itself after the first time it is triggered.
   * !#zh
   * 添加 DragonBones 一次性事件监听器，回调会在第一时间被触发后删除自身。
   * @method once
   * @param {String} type - A string representing the event type to listen for.
   * @param {Function} listener - The callback that will be invoked when the event is dispatched.
   * @param {Event} listener.event event
   * @param {Object} [target] - The target (this object) to invoke the callback, can be null
   */
  once: function once(eventType, listener, target) {
    this._eventTarget.once(eventType, listener, target);
  },

  /**
   * !#en
   * Add event listener for the DragonBones Event.
   * !#zh
   * 添加 DragonBones 事件监听器。
   * @method addEventListener
   * @param {String} type - A string representing the event type to listen for.
   * @param {Function} listener - The callback that will be invoked when the event is dispatched.
   * @param {Event} listener.event event
   * @param {Object} [target] - The target (this object) to invoke the callback, can be null
   */
  addEventListener: function addEventListener(eventType, listener, target) {
    this._eventTarget.on(eventType, listener, target);
  },

  /**
   * !#en
   * Remove the event listener for the DragonBones Event.
   * !#zh
   * 移除 DragonBones 事件监听器。
   * @method removeEventListener
   * @param {String} type - A string representing the event type to listen for.
   * @param {Function} [listener]
   * @param {Object} [target]
   */
  removeEventListener: function removeEventListener(eventType, listener, target) {
    this._eventTarget.off(eventType, listener, target);
  },

  /**
   * !#en
   * Build the armature for specified name.
   * !#zh
   * 构建指定名称的 armature 对象
   * @method buildArmature
   * @param {String} armatureName
   * @param {Node} node
   * @return {dragonBones.ArmatureDisplay}
   */
  buildArmature: function buildArmature(armatureName, node) {
    return this._factory.createArmatureNode(this, armatureName, node);
  },

  /**
   * !#en
   * Get the current armature object of the ArmatureDisplay.
   * !#zh
   * 获取 ArmatureDisplay 当前使用的 Armature 对象
   * @method armature
   * @returns {Object}
   */
  armature: function armature() {
    return this._armature;
  }
});
/**
 * !#en
 * Animation start play.
 * !#zh
 * 动画开始播放。
 *
 * @event dragonBones.EventObject.START
 * @param {String} type - A string representing the event type to listen for.
 * @param {Function} callback - The callback that will be invoked when the event is dispatched.
 *                              The callback is ignored if it is a duplicate (the callbacks are unique).
 * @param {dragonBones.EventObject} [callback.event]
 * @param {String} [callback.event.type]
 * @param {dragonBones.Armature} [callback.event.armature]
 * @param {dragonBones.AnimationState} [callback.event.animationState]
 */

/**
 * !#en
 * Animation loop play complete once.
 * !#zh
 * 动画循环播放完成一次。
 *
 * @event dragonBones.EventObject.LOOP_COMPLETE
 * @param {String} type - A string representing the event type to listen for.
 * @param {Function} callback - The callback that will be invoked when the event is dispatched.
 *                              The callback is ignored if it is a duplicate (the callbacks are unique).
 * @param {dragonBones.EventObject} [callback.event]
 * @param {String} [callback.event.type]
 * @param {dragonBones.Armature} [callback.event.armature]
 * @param {dragonBones.AnimationState} [callback.event.animationState]
 */

/**
 * !#en
 * Animation play complete.
 * !#zh
 * 动画播放完成。
 *
 * @event dragonBones.EventObject.COMPLETE
 * @param {String} type - A string representing the event type to listen for.
 * @param {Function} callback - The callback that will be invoked when the event is dispatched.
 *                              The callback is ignored if it is a duplicate (the callbacks are unique).
 * @param {dragonBones.EventObject} [callback.event]
 * @param {String} [callback.event.type]
 * @param {dragonBones.Armature} [callback.event.armature]
 * @param {dragonBones.AnimationState} [callback.event.animationState]
 */

/**
 * !#en
 * Animation fade in start.
 * !#zh
 * 动画淡入开始。
 *
 * @event dragonBones.EventObject.FADE_IN
 * @param {String} type - A string representing the event type to listen for.
 * @param {Function} callback - The callback that will be invoked when the event is dispatched.
 *                              The callback is ignored if it is a duplicate (the callbacks are unique).
 * @param {dragonBones.EventObject} [callback.event]
 * @param {String} [callback.event.type]
 * @param {dragonBones.Armature} [callback.event.armature]
 * @param {dragonBones.AnimationState} [callback.event.animationState]
 */

/**
 * !#en
 * Animation fade in complete.
 * !#zh
 * 动画淡入完成。
 *
 * @event dragonBones.EventObject.FADE_IN_COMPLETE
 * @param {String} type - A string representing the event type to listen for.
 * @param {Function} callback - The callback that will be invoked when the event is dispatched.
 *                              The callback is ignored if it is a duplicate (the callbacks are unique).
 * @param {dragonBones.EventObject} [callback.event]
 * @param {String} [callback.event.type]
 * @param {dragonBones.Armature} [callback.event.armature]
 * @param {dragonBones.AnimationState} [callback.event.animationState]
 */

/**
 * !#en
 * Animation fade out start.
 * !#zh
 * 动画淡出开始。
 *
 * @event dragonBones.EventObject.FADE_OUT
 * @param {String} type - A string representing the event type to listen for.
 * @param {Function} callback - The callback that will be invoked when the event is dispatched.
 *                              The callback is ignored if it is a duplicate (the callbacks are unique).
 * @param {dragonBones.EventObject} [callback.event]
 * @param {String} [callback.event.type]
 * @param {dragonBones.Armature} [callback.event.armature]
 * @param {dragonBones.AnimationState} [callback.event.animationState]
 */

/**
 * !#en
 * Animation fade out complete.
 * !#zh
 * 动画淡出完成。
 *
 * @event dragonBones.EventObject.FADE_OUT_COMPLETE
 * @param {String} type - A string representing the event type to listen for.
 * @param {Function} callback - The callback that will be invoked when the event is dispatched.
 *                              The callback is ignored if it is a duplicate (the callbacks are unique).
 * @param {dragonBones.EventObject} [callback.event]
 * @param {String} [callback.event.type]
 * @param {dragonBones.Armature} [callback.event.armature]
 * @param {dragonBones.AnimationState} [callback.event.animationState]
 */

/**
 * !#en
 * Animation frame event.
 * !#zh
 * 动画帧事件。
 *
 * @event dragonBones.EventObject.FRAME_EVENT
 * @param {String} type - A string representing the event type to listen for.
 * @param {Function} callback - The callback that will be invoked when the event is dispatched.
 *                              The callback is ignored if it is a duplicate (the callbacks are unique).
 * @param {dragonBones.EventObject} [callback.event]
 * @param {String} [callback.event.type]
 * @param {String} [callback.event.name]
 * @param {dragonBones.Armature} [callback.event.armature]
 * @param {dragonBones.AnimationState} [callback.event.animationState]
 * @param {dragonBones.Bone} [callback.event.bone]
 * @param {dragonBones.Slot} [callback.event.slot]
 */

/**
 * !#en
 * Animation frame sound event.
 * !#zh
 * 动画帧声音事件。
 *
 * @event dragonBones.EventObject.SOUND_EVENT
 * @param {String} type - A string representing the event type to listen for.
 * @param {Function} callback - The callback that will be invoked when the event is dispatched.
 *                              The callback is ignored if it is a duplicate (the callbacks are unique).
 * @param {dragonBones.EventObject} [callback.event]
 * @param {String} [callback.event.type]
 * @param {String} [callback.event.name]
 * @param {dragonBones.Armature} [callback.event.armature]
 * @param {dragonBones.AnimationState} [callback.event.animationState]
 * @param {dragonBones.Bone} [callback.event.bone]
 * @param {dragonBones.Slot} [callback.event.slot]
 */

module.exports = dragonBones.ArmatureDisplay = ArmatureDisplay;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFybWF0dXJlRGlzcGxheS5qcyJdLCJuYW1lcyI6WyJSZW5kZXJDb21wb25lbnQiLCJyZXF1aXJlIiwiRXZlbnRUYXJnZXQiLCJHcmFwaGljcyIsIlJlbmRlckZsb3ciLCJGTEFHX1BPU1RfUkVOREVSIiwiQXJtYXR1cmVDYWNoZSIsIkF0dGFjaFV0aWwiLCJEZWZhdWx0QXJtYXR1cmVzRW51bSIsImNjIiwiRW51bSIsIkRlZmF1bHRBbmltc0VudW0iLCJEZWZhdWx0Q2FjaGVNb2RlIiwiQW5pbWF0aW9uQ2FjaGVNb2RlIiwiUkVBTFRJTUUiLCJTSEFSRURfQ0FDSEUiLCJQUklWQVRFX0NBQ0hFIiwic2V0RW51bUF0dHIiLCJvYmoiLCJwcm9wTmFtZSIsImVudW1EZWYiLCJDbGFzcyIsIkF0dHIiLCJzZXRDbGFzc0F0dHIiLCJnZXRMaXN0IiwiQXJtYXR1cmVEaXNwbGF5IiwibmFtZSIsImVkaXRvciIsIkNDX0VESVRPUiIsIm1lbnUiLCJpbnNwZWN0b3IiLCJzdGF0aWNzIiwicHJvcGVydGllcyIsIl9mYWN0b3J5IiwidHlwZSIsImRyYWdvbkJvbmVzIiwiQ0NGYWN0b3J5Iiwic2VyaWFsaXphYmxlIiwiZHJhZ29uQXNzZXQiLCJEcmFnb25Cb25lc0Fzc2V0Iiwibm90aWZ5IiwiX3JlZnJlc2giLCJfZGVmYXVsdEFybWF0dXJlSW5kZXgiLCJfYW5pbWF0aW9uSW5kZXgiLCJ0b29sdGlwIiwiQ0NfREVWIiwiZHJhZ29uQXRsYXNBc3NldCIsIkRyYWdvbkJvbmVzQXRsYXNBc3NldCIsIl9wYXJzZURyYWdvbkF0bGFzQXNzZXQiLCJfYXJtYXR1cmVOYW1lIiwiYXJtYXR1cmVOYW1lIiwiZ2V0Iiwic2V0IiwidmFsdWUiLCJhbmltTmFtZXMiLCJnZXRBbmltYXRpb25OYW1lcyIsImFuaW1hdGlvbk5hbWUiLCJpbmRleE9mIiwiX2FybWF0dXJlIiwiaXNBbmltYXRpb25DYWNoZWQiLCJfZHJhZ29uQm9uZXMiLCJjbG9jayIsInJlbW92ZSIsImFkZCIsInZpc2libGUiLCJfYW5pbWF0aW9uTmFtZSIsImFybWF0dXJlc0VudW0iLCJnZXRBcm1hdHVyZUVudW0iLCJlcnJvcklEIiwidW5kZWZpbmVkIiwiZWRpdG9yT25seSIsImFuaW1hdGFibGUiLCJkaXNwbGF5TmFtZSIsImFuaW1zRW51bSIsImdldEFuaW1zRW51bSIsImFuaW1OYW1lIiwicGxheUFuaW1hdGlvbiIsInBsYXlUaW1lcyIsIl9wcmVDYWNoZU1vZGUiLCJfY2FjaGVNb2RlIiwiX2RlZmF1bHRDYWNoZU1vZGUiLCJzZXRBbmltYXRpb25DYWNoZU1vZGUiLCJ0aW1lU2NhbGUiLCJhbmltYXRpb24iLCJwcmVtdWx0aXBsaWVkQWxwaGEiLCJkZWJ1Z0JvbmVzIiwiX3VwZGF0ZURlYnVnRHJhdyIsImVuYWJsZUJhdGNoIiwiX3VwZGF0ZUJhdGNoIiwiX2FybWF0dXJlS2V5IiwiX2FjY1RpbWUiLCJfcGxheUNvdW50IiwiX2ZyYW1lQ2FjaGUiLCJfY3VyRnJhbWUiLCJfcGxheWluZyIsIl9hcm1hdHVyZUNhY2hlIiwiY3RvciIsIl9ldmVudFRhcmdldCIsIl9tYXRlcmlhbENhY2hlIiwiX2luaXRlZCIsImF0dGFjaFV0aWwiLCJnZXRJbnN0YW5jZSIsIm9uTG9hZCIsImNoaWxkcmVuIiwibm9kZSIsImkiLCJuIiwibGVuZ3RoIiwiY2hpbGQiLCJwb3MiLCJfbmFtZSIsInNlYXJjaCIsImRlc3Ryb3kiLCJiYXNlTWF0ZXJpYWwiLCJnZXRNYXRlcmlhbCIsImRlZmluZSIsIl91cGRhdGVNYXRlcmlhbCIsImRpc2FibGVSZW5kZXIiLCJfc3VwZXIiLCJfcmVuZGVyRmxhZyIsIm1hcmtGb3JSZW5kZXIiLCJlbmFibGUiLCJfdmFsaWRhdGVSZW5kZXIiLCJ0ZXh0dXJlIiwibG9hZGVkIiwiX19wcmVsb2FkIiwiX2luaXQiLCJfcmVzZXRBc3NlbWJsZXIiLCJfYWN0aXZhdGVNYXRlcmlhbCIsImdldEFybWF0dXJlS2V5IiwiY2FjaGVNb2RlIiwiX2J1aWxkQXJtYXR1cmUiLCJvbkVuYWJsZSIsIm9uRGlzYWJsZSIsIl9lbWl0Q2FjaGVDb21wbGV0ZUV2ZW50IiwiZW1pdCIsIkV2ZW50T2JqZWN0IiwiTE9PUF9DT01QTEVURSIsIkNPTVBMRVRFIiwidXBkYXRlIiwiZHQiLCJmcmFtZUNhY2hlIiwiaXNJbml0ZWQiLCJmcmFtZXMiLCJpc0ludmFsaWQiLCJ1cGRhdGVUb0ZyYW1lIiwiZnJhbWVUaW1lIiwiRnJhbWVUaW1lIiwiU1RBUlQiLCJnbG9iYWxUaW1lU2NhbGUiLCJmcmFtZUlkeCIsIk1hdGgiLCJmbG9vciIsImlzQ29tcGxldGVkIiwib25EZXN0cm95IiwiZGlzcG9zZSIsIl9kZWJ1Z0RyYXciLCJkZWJ1Z0RyYXdOb2RlIiwiUHJpdmF0ZU5vZGUiLCJkZWJ1Z0RyYXciLCJhZGRDb21wb25lbnQiLCJsaW5lV2lkdGgiLCJzdHJva2VDb2xvciIsImNvbG9yIiwicGFyZW50IiwiX2Rpc3BsYXlQcm94eSIsInNoYXJlZENhY2hlIiwiZW5hYmxlUHJpdmF0ZU1vZGUiLCJhdGxhc1VVSUQiLCJfdXVpZCIsImluaXQiLCJnZXRBcm1hdHVyZUNhY2hlIiwiYnVpbGRBcm1hdHVyZURpc3BsYXkiLCJfY2NOb2RlIiwic2V0RXZlbnRUYXJnZXQiLCJ3YXJuIiwiYXJtYXR1cmVEYXRhIiwiYWFiYiIsInNldENvbnRlbnRTaXplIiwid2lkdGgiLCJoZWlnaHQiLCJfYXNzb2NpYXRlQXR0YWNoZWROb2RlIiwiX3VwZGF0ZUFybWF0dXJlRW51bSIsIl91cGRhdGVBbmltRW51bSIsIl91cGRhdGVDYWNoZU1vZGVFbnVtIiwiRWRpdG9yIiwiVXRpbHMiLCJyZWZyZXNoU2VsZWN0ZWRJbnNwZWN0b3IiLCJ1dWlkIiwiY2FuQ2FjaGUiLCJhbmltRW51bSIsImFybWF0dXJlRW51bSIsImNhY2hlIiwiZ2V0QW5pbWF0aW9uQ2FjaGUiLCJpbml0QW5pbWF0aW9uQ2FjaGUiLCJfaGFzQXR0YWNoZWROb2RlIiwiZW5hYmxlQ2FjaGVBdHRhY2hlZEluZm8iLCJwbGF5IiwidXBkYXRlQW5pbWF0aW9uQ2FjaGUiLCJpbnZhbGlkQW5pbWF0aW9uQ2FjaGUiLCJnZXRBcm1hdHVyZU5hbWVzIiwiZHJhZ29uQm9uZXNEYXRhIiwiZ2V0RHJhZ29uQm9uZXNEYXRhIiwiYXJtYXR1cmVOYW1lcyIsInJldCIsImdldEFybWF0dXJlIiwiYW5pbWF0aW9ucyIsImhhc093blByb3BlcnR5IiwicHVzaCIsIm9uIiwiZXZlbnRUeXBlIiwibGlzdGVuZXIiLCJ0YXJnZXQiLCJhZGRFdmVudExpc3RlbmVyIiwib2ZmIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm9uY2UiLCJidWlsZEFybWF0dXJlIiwiY3JlYXRlQXJtYXR1cmVOb2RlIiwiYXJtYXR1cmUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkEsSUFBTUEsZUFBZSxHQUFHQyxPQUFPLENBQUMsaURBQUQsQ0FBL0I7O0FBQ0EsSUFBSUMsV0FBVyxHQUFHRCxPQUFPLENBQUMsdUNBQUQsQ0FBekI7O0FBQ0EsSUFBTUUsUUFBUSxHQUFHRixPQUFPLENBQUMsc0NBQUQsQ0FBeEI7O0FBQ0EsSUFBTUcsVUFBVSxHQUFHSCxPQUFPLENBQUMseUNBQUQsQ0FBMUI7O0FBQ0EsSUFBTUksZ0JBQWdCLEdBQUdELFVBQVUsQ0FBQ0MsZ0JBQXBDOztBQUVBLElBQUlDLGFBQWEsR0FBR0wsT0FBTyxDQUFDLGlCQUFELENBQTNCOztBQUNBLElBQUlNLFVBQVUsR0FBR04sT0FBTyxDQUFDLGNBQUQsQ0FBeEI7QUFFQTs7Ozs7QUFJQSxJQUFJTyxvQkFBb0IsR0FBR0MsRUFBRSxDQUFDQyxJQUFILENBQVE7QUFBRSxhQUFXLENBQUM7QUFBZCxDQUFSLENBQTNCO0FBQ0EsSUFBSUMsZ0JBQWdCLEdBQUdGLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRO0FBQUUsWUFBVTtBQUFaLENBQVIsQ0FBdkI7QUFDQSxJQUFJRSxnQkFBZ0IsR0FBR0gsRUFBRSxDQUFDQyxJQUFILENBQVE7QUFBRSxjQUFZO0FBQWQsQ0FBUixDQUF2QjtBQUVBOzs7Ozs7QUFLQSxJQUFJRyxrQkFBa0IsR0FBR0osRUFBRSxDQUFDQyxJQUFILENBQVE7QUFDN0I7Ozs7O0FBS0FJLEVBQUFBLFFBQVEsRUFBRSxDQU5tQjs7QUFPN0I7Ozs7O0FBS0FDLEVBQUFBLFlBQVksRUFBRSxDQVplOztBQWE3Qjs7Ozs7QUFLQUMsRUFBQUEsYUFBYSxFQUFFO0FBbEJjLENBQVIsQ0FBekI7O0FBcUJBLFNBQVNDLFdBQVQsQ0FBc0JDLEdBQXRCLEVBQTJCQyxRQUEzQixFQUFxQ0MsT0FBckMsRUFBOEM7QUFDMUNYLEVBQUFBLEVBQUUsQ0FBQ1ksS0FBSCxDQUFTQyxJQUFULENBQWNDLFlBQWQsQ0FBMkJMLEdBQTNCLEVBQWdDQyxRQUFoQyxFQUEwQyxNQUExQyxFQUFrRCxNQUFsRDtBQUNBVixFQUFBQSxFQUFFLENBQUNZLEtBQUgsQ0FBU0MsSUFBVCxDQUFjQyxZQUFkLENBQTJCTCxHQUEzQixFQUFnQ0MsUUFBaEMsRUFBMEMsVUFBMUMsRUFBc0RWLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRYyxPQUFSLENBQWdCSixPQUFoQixDQUF0RDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsSUFBSUssZUFBZSxHQUFHaEIsRUFBRSxDQUFDWSxLQUFILENBQVM7QUFDM0JLLEVBQUFBLElBQUksRUFBRSw2QkFEcUI7QUFFM0IsYUFBUzFCLGVBRmtCO0FBSTNCMkIsRUFBQUEsTUFBTSxFQUFFQyxTQUFTLElBQUk7QUFDakJDLElBQUFBLElBQUksRUFBRSxnREFEVztBQUVqQkMsSUFBQUEsU0FBUyxFQUFFO0FBRk0sR0FKTTtBQVMzQkMsRUFBQUEsT0FBTyxFQUFFO0FBQ0xsQixJQUFBQSxrQkFBa0IsRUFBRUE7QUFEZixHQVRrQjtBQWEzQm1CLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxRQUFRLEVBQUU7QUFDTixpQkFBUyxJQURIO0FBRU5DLE1BQUFBLElBQUksRUFBRUMsV0FBVyxDQUFDQyxTQUZaO0FBR05DLE1BQUFBLFlBQVksRUFBRTtBQUhSLEtBREY7O0FBT1I7Ozs7Ozs7Ozs7O0FBV0FDLElBQUFBLFdBQVcsRUFBRTtBQUNULGlCQUFTLElBREE7QUFFVEosTUFBQUEsSUFBSSxFQUFFQyxXQUFXLENBQUNJLGdCQUZUO0FBR1RDLE1BQUFBLE1BSFMsb0JBR0M7QUFDTixhQUFLQyxRQUFMOztBQUNBLFlBQUliLFNBQUosRUFBZTtBQUNYLGVBQUtjLHFCQUFMLEdBQTZCLENBQTdCO0FBQ0EsZUFBS0MsZUFBTCxHQUF1QixDQUF2QjtBQUNIO0FBQ0osT0FUUTtBQVVUQyxNQUFBQSxPQUFPLEVBQUVDLE1BQU0sSUFBSTtBQVZWLEtBbEJMOztBQStCUjs7Ozs7OztBQU9BQyxJQUFBQSxnQkFBZ0IsRUFBRTtBQUNkLGlCQUFTLElBREs7QUFFZFosTUFBQUEsSUFBSSxFQUFFQyxXQUFXLENBQUNZLHFCQUZKO0FBR2RQLE1BQUFBLE1BSGMsb0JBR0o7QUFDTjtBQUNBLGFBQUtRLHNCQUFMOztBQUNBLGFBQUtQLFFBQUw7QUFDSCxPQVBhO0FBUWRHLE1BQUFBLE9BQU8sRUFBRUMsTUFBTSxJQUFJO0FBUkwsS0F0Q1Y7QUFpRFJJLElBQUFBLGFBQWEsRUFBRSxFQWpEUDs7QUFrRFI7Ozs7O0FBS0FDLElBQUFBLFlBQVksRUFBRTtBQUNWQyxNQUFBQSxHQURVLGlCQUNIO0FBQ0gsZUFBTyxLQUFLRixhQUFaO0FBQ0gsT0FIUztBQUlWRyxNQUFBQSxHQUpVLGVBSUxDLEtBSkssRUFJRTtBQUNSLGFBQUtKLGFBQUwsR0FBcUJJLEtBQXJCO0FBQ0EsWUFBSUMsU0FBUyxHQUFHLEtBQUtDLGlCQUFMLENBQXVCLEtBQUtOLGFBQTVCLENBQWhCOztBQUVBLFlBQUksQ0FBQyxLQUFLTyxhQUFOLElBQXVCRixTQUFTLENBQUNHLE9BQVYsQ0FBa0IsS0FBS0QsYUFBdkIsSUFBd0MsQ0FBbkUsRUFBc0U7QUFDbEUsY0FBSTVCLFNBQUosRUFBZTtBQUNYLGlCQUFLNEIsYUFBTCxHQUFxQkYsU0FBUyxDQUFDLENBQUQsQ0FBOUI7QUFDSCxXQUZELE1BR0s7QUFDRDtBQUNBLGlCQUFLRSxhQUFMLEdBQXFCLEVBQXJCO0FBQ0g7QUFDSjs7QUFFRCxZQUFJLEtBQUtFLFNBQUwsSUFBa0IsQ0FBQyxLQUFLQyxpQkFBTCxFQUF2QixFQUFpRDtBQUM3QyxlQUFLMUIsUUFBTCxDQUFjMkIsWUFBZCxDQUEyQkMsS0FBM0IsQ0FBaUNDLE1BQWpDLENBQXdDLEtBQUtKLFNBQTdDO0FBQ0g7O0FBRUQsYUFBS2pCLFFBQUw7O0FBRUEsWUFBSSxLQUFLaUIsU0FBTCxJQUFrQixDQUFDLEtBQUtDLGlCQUFMLEVBQXZCLEVBQWlEO0FBQzdDLGVBQUsxQixRQUFMLENBQWMyQixZQUFkLENBQTJCQyxLQUEzQixDQUFpQ0UsR0FBakMsQ0FBcUMsS0FBS0wsU0FBMUM7QUFDSDtBQUVKLE9BNUJTO0FBNkJWTSxNQUFBQSxPQUFPLEVBQUU7QUE3QkMsS0F2RE47QUF1RlJDLElBQUFBLGNBQWMsRUFBRSxFQXZGUjs7QUF3RlI7Ozs7O0FBS0FULElBQUFBLGFBQWEsRUFBRTtBQUNYTCxNQUFBQSxHQURXLGlCQUNKO0FBQ0gsZUFBTyxLQUFLYyxjQUFaO0FBQ0gsT0FIVTtBQUlYYixNQUFBQSxHQUpXLGVBSU5DLEtBSk0sRUFJQztBQUNSLGFBQUtZLGNBQUwsR0FBc0JaLEtBQXRCO0FBQ0gsT0FOVTtBQU9YVyxNQUFBQSxPQUFPLEVBQUU7QUFQRSxLQTdGUDs7QUF1R1I7OztBQUdBdEIsSUFBQUEscUJBQXFCLEVBQUU7QUFDbkIsaUJBQVMsQ0FEVTtBQUVuQkYsTUFBQUEsTUFGbUIsb0JBRVQ7QUFDTixZQUFJVSxZQUFZLEdBQUcsRUFBbkI7O0FBQ0EsWUFBSSxLQUFLWixXQUFULEVBQXNCO0FBQ2xCLGNBQUk0QixhQUFKOztBQUNBLGNBQUksS0FBSzVCLFdBQVQsRUFBc0I7QUFDbEI0QixZQUFBQSxhQUFhLEdBQUcsS0FBSzVCLFdBQUwsQ0FBaUI2QixlQUFqQixFQUFoQjtBQUNIOztBQUNELGNBQUksQ0FBQ0QsYUFBTCxFQUFvQjtBQUNoQixtQkFBT3pELEVBQUUsQ0FBQzJELE9BQUgsQ0FBVyxJQUFYLEVBQWlCLEtBQUsxQyxJQUF0QixDQUFQO0FBQ0g7O0FBRUR3QixVQUFBQSxZQUFZLEdBQUdnQixhQUFhLENBQUMsS0FBS3hCLHFCQUFOLENBQTVCO0FBQ0g7O0FBRUQsWUFBSVEsWUFBWSxLQUFLbUIsU0FBckIsRUFBZ0M7QUFDNUIsZUFBS25CLFlBQUwsR0FBb0JBLFlBQXBCO0FBQ0gsU0FGRCxNQUdLO0FBQ0R6QyxVQUFBQSxFQUFFLENBQUMyRCxPQUFILENBQVcsSUFBWCxFQUFpQixLQUFLMUMsSUFBdEI7QUFDSDtBQUNKLE9BdEJrQjtBQXVCbkJRLE1BQUFBLElBQUksRUFBRTFCLG9CQXZCYTtBQXdCbkJ3RCxNQUFBQSxPQUFPLEVBQUUsSUF4QlU7QUF5Qm5CTSxNQUFBQSxVQUFVLEVBQUUsSUF6Qk87QUEwQm5CQyxNQUFBQSxVQUFVLEVBQUUsS0ExQk87QUEyQm5CQyxNQUFBQSxXQUFXLEVBQUUsVUEzQk07QUE0Qm5CNUIsTUFBQUEsT0FBTyxFQUFFQyxNQUFNLElBQUk7QUE1QkEsS0ExR2Y7QUF5SVI7QUFDQUYsSUFBQUEsZUFBZSxFQUFFO0FBQ2IsaUJBQVMsQ0FESTtBQUViSCxNQUFBQSxNQUZhLG9CQUVIO0FBQ04sWUFBSSxLQUFLRyxlQUFMLEtBQXlCLENBQTdCLEVBQWdDO0FBQzVCLGVBQUthLGFBQUwsR0FBcUIsRUFBckI7QUFDQTtBQUNIOztBQUVELFlBQUlpQixTQUFKOztBQUNBLFlBQUksS0FBS25DLFdBQVQsRUFBc0I7QUFDbEJtQyxVQUFBQSxTQUFTLEdBQUcsS0FBS25DLFdBQUwsQ0FBaUJvQyxZQUFqQixDQUE4QixLQUFLeEIsWUFBbkMsQ0FBWjtBQUNIOztBQUVELFlBQUksQ0FBQ3VCLFNBQUwsRUFBZ0I7QUFDWjtBQUNIOztBQUVELFlBQUlFLFFBQVEsR0FBR0YsU0FBUyxDQUFDLEtBQUs5QixlQUFOLENBQXhCOztBQUNBLFlBQUlnQyxRQUFRLEtBQUtOLFNBQWpCLEVBQTRCO0FBQ3hCLGVBQUtPLGFBQUwsQ0FBbUJELFFBQW5CLEVBQTZCLEtBQUtFLFNBQWxDO0FBQ0gsU0FGRCxNQUdLO0FBQ0RwRSxVQUFBQSxFQUFFLENBQUMyRCxPQUFILENBQVcsSUFBWCxFQUFpQixLQUFLMUMsSUFBdEI7QUFDSDtBQUNKLE9BeEJZO0FBeUJiUSxNQUFBQSxJQUFJLEVBQUV2QixnQkF6Qk87QUEwQmJxRCxNQUFBQSxPQUFPLEVBQUUsSUExQkk7QUEyQmJNLE1BQUFBLFVBQVUsRUFBRSxJQTNCQztBQTRCYkUsTUFBQUEsV0FBVyxFQUFFLFdBNUJBO0FBNkJiNUIsTUFBQUEsT0FBTyxFQUFFQyxNQUFNLElBQUk7QUE3Qk4sS0ExSVQ7QUEwS1I7QUFDQWlDLElBQUFBLGFBQWEsRUFBRSxDQUFDLENBM0tSO0FBNEtSQyxJQUFBQSxVQUFVLEVBQUVsRSxrQkFBa0IsQ0FBQ0MsUUE1S3ZCO0FBNktSa0UsSUFBQUEsaUJBQWlCLEVBQUU7QUFDZixpQkFBUyxDQURNO0FBRWY5QyxNQUFBQSxJQUFJLEVBQUVyQixrQkFGUztBQUdmMkIsTUFBQUEsTUFIZSxvQkFHTDtBQUNOLGFBQUt5QyxxQkFBTCxDQUEyQixLQUFLRCxpQkFBaEM7QUFDSCxPQUxjO0FBTWZWLE1BQUFBLFVBQVUsRUFBRSxJQU5HO0FBT2ZOLE1BQUFBLE9BQU8sRUFBRSxJQVBNO0FBUWZPLE1BQUFBLFVBQVUsRUFBRSxLQVJHO0FBU2ZDLE1BQUFBLFdBQVcsRUFBRSxzQkFURTtBQVVmNUIsTUFBQUEsT0FBTyxFQUFFQyxNQUFNLElBQUk7QUFWSixLQTdLWDs7QUEwTFI7Ozs7OztBQU1BcUMsSUFBQUEsU0FBUyxFQUFFO0FBQ1AsaUJBQVMsQ0FERjtBQUVQMUMsTUFBQUEsTUFGTyxvQkFFRztBQUNOLFlBQUksS0FBS2tCLFNBQUwsSUFBa0IsQ0FBQyxLQUFLQyxpQkFBTCxFQUF2QixFQUFpRDtBQUM3QyxlQUFLRCxTQUFMLENBQWV5QixTQUFmLENBQXlCRCxTQUF6QixHQUFxQyxLQUFLQSxTQUExQztBQUNIO0FBQ0osT0FOTTtBQU9QdEMsTUFBQUEsT0FBTyxFQUFFQyxNQUFNLElBQUk7QUFQWixLQWhNSDs7QUEwTVI7Ozs7Ozs7Ozs7OztBQVlBZ0MsSUFBQUEsU0FBUyxFQUFFO0FBQ1AsaUJBQVMsQ0FBQyxDQURIO0FBRVBqQyxNQUFBQSxPQUFPLEVBQUVDLE1BQU0sSUFBSTtBQUZaLEtBdE5IOztBQTJOUjs7Ozs7Ozs7O0FBU0F1QyxJQUFBQSxrQkFBa0IsRUFBRTtBQUNoQixpQkFBUyxLQURPO0FBRWhCeEMsTUFBQUEsT0FBTyxFQUFFQyxNQUFNLElBQUk7QUFGSCxLQXBPWjs7QUF5T1I7Ozs7OztBQU1Bd0MsSUFBQUEsVUFBVSxFQUFFO0FBQ1IsaUJBQVMsS0FERDtBQUVSN0MsTUFBQUEsTUFGUSxvQkFFRTtBQUNOLGFBQUs4QyxnQkFBTDtBQUNILE9BSk87QUFLUjFDLE1BQUFBLE9BQU8sRUFBRUMsTUFBTSxJQUFJO0FBTFgsS0EvT0o7O0FBdVBSOzs7Ozs7QUFNQTBDLElBQUFBLFdBQVcsRUFBRTtBQUNULGlCQUFTLEtBREE7QUFFVC9DLE1BQUFBLE1BRlMsb0JBRUM7QUFDTixhQUFLZ0QsWUFBTDtBQUNILE9BSlE7QUFLVDVDLE1BQUFBLE9BQU8sRUFBRUMsTUFBTSxJQUFJO0FBTFYsS0E3UEw7QUFxUVI7QUFDQTRDLElBQUFBLFlBQVksRUFBRSxFQXRRTjtBQXdRUjtBQUNBO0FBQ0FDLElBQUFBLFFBQVEsRUFBRSxDQTFRRjtBQTJRUjtBQUNBQyxJQUFBQSxVQUFVLEVBQUUsQ0E1UUo7QUE2UVI7QUFDQUMsSUFBQUEsV0FBVyxFQUFFLElBOVFMO0FBK1FSO0FBQ0FDLElBQUFBLFNBQVMsRUFBRSxJQWhSSDtBQWlSUjtBQUNBQyxJQUFBQSxRQUFRLEVBQUUsS0FsUkY7QUFtUlI7QUFDQUMsSUFBQUEsY0FBYyxFQUFFO0FBcFJSLEdBYmU7QUFvUzNCQyxFQUFBQSxJQXBTMkIsa0JBb1NuQjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFLQyxZQUFMLEdBQW9CLElBQUkvRixXQUFKLEVBQXBCO0FBQ0EsU0FBS2dHLGNBQUwsR0FBc0IsRUFBdEI7QUFDQSxTQUFLQyxPQUFMLEdBQWUsS0FBZjtBQUNBLFNBQUtDLFVBQUwsR0FBa0IsSUFBSTdGLFVBQUosRUFBbEI7QUFDQSxTQUFLMEIsUUFBTCxHQUFnQkUsV0FBVyxDQUFDQyxTQUFaLENBQXNCaUUsV0FBdEIsRUFBaEI7QUFDSCxHQS9TMEI7QUFpVDNCQyxFQUFBQSxNQWpUMkIsb0JBaVRqQjtBQUNOO0FBQ0E7QUFDQSxRQUFJQyxRQUFRLEdBQUcsS0FBS0MsSUFBTCxDQUFVRCxRQUF6Qjs7QUFDQSxTQUFLLElBQUlFLENBQUMsR0FBRyxDQUFSLEVBQVdDLENBQUMsR0FBR0gsUUFBUSxDQUFDSSxNQUE3QixFQUFxQ0YsQ0FBQyxHQUFHQyxDQUF6QyxFQUE0Q0QsQ0FBQyxFQUE3QyxFQUFpRDtBQUM3QyxVQUFJRyxLQUFLLEdBQUdMLFFBQVEsQ0FBQ0UsQ0FBRCxDQUFwQjs7QUFDQSxVQUFJSSxHQUFHLEdBQUdELEtBQUssQ0FBQ0UsS0FBTixJQUFlRixLQUFLLENBQUNFLEtBQU4sQ0FBWUMsTUFBWixDQUFtQixpQkFBbkIsQ0FBekI7O0FBQ0EsVUFBSUYsR0FBRyxLQUFLLENBQVosRUFBZTtBQUNYRCxRQUFBQSxLQUFLLENBQUNJLE9BQU47QUFDSDtBQUNKO0FBQ0osR0E1VDBCO0FBOFQzQjtBQUNBeEIsRUFBQUEsWUEvVDJCLDBCQStUWDtBQUNaLFFBQUl5QixZQUFZLEdBQUcsS0FBS0MsV0FBTCxDQUFpQixDQUFqQixDQUFuQjs7QUFDQSxRQUFJRCxZQUFKLEVBQWtCO0FBQ2RBLE1BQUFBLFlBQVksQ0FBQ0UsTUFBYixDQUFvQixjQUFwQixFQUFvQyxDQUFDLEtBQUs1QixXQUExQztBQUNIOztBQUNELFNBQUtXLGNBQUwsR0FBc0IsRUFBdEI7QUFDSCxHQXJVMEI7QUF1VTNCO0FBQ0FrQixFQUFBQSxlQXhVMkIsNkJBd1VSO0FBQ2YsUUFBSUgsWUFBWSxHQUFHLEtBQUtDLFdBQUwsQ0FBaUIsQ0FBakIsQ0FBbkI7O0FBQ0EsUUFBSUQsWUFBSixFQUFrQjtBQUNkQSxNQUFBQSxZQUFZLENBQUNFLE1BQWIsQ0FBb0IsY0FBcEIsRUFBb0MsQ0FBQyxLQUFLNUIsV0FBMUM7QUFDQTBCLE1BQUFBLFlBQVksQ0FBQ0UsTUFBYixDQUFvQixhQUFwQixFQUFtQyxJQUFuQztBQUNIOztBQUNELFNBQUtqQixjQUFMLEdBQXNCLEVBQXRCO0FBQ0gsR0EvVTBCO0FBaVYzQjtBQUNBbUIsRUFBQUEsYUFsVjJCLDJCQWtWVjtBQUNiLFNBQUtDLE1BQUw7O0FBQ0EsU0FBS2QsSUFBTCxDQUFVZSxXQUFWLElBQXlCLENBQUNsSCxnQkFBMUI7QUFDSCxHQXJWMEI7QUF1VjNCO0FBQ0FtSCxFQUFBQSxhQXhWMkIseUJBd1ZaQyxNQXhWWSxFQXdWSjtBQUNuQixTQUFLSCxNQUFMLENBQVlHLE1BQVo7O0FBQ0EsUUFBSUEsTUFBSixFQUFZO0FBQ1IsV0FBS2pCLElBQUwsQ0FBVWUsV0FBVixJQUF5QmxILGdCQUF6QjtBQUNILEtBRkQsTUFFTztBQUNILFdBQUttRyxJQUFMLENBQVVlLFdBQVYsSUFBeUIsQ0FBQ2xILGdCQUExQjtBQUNIO0FBQ0osR0EvVjBCO0FBaVczQnFILEVBQUFBLGVBalcyQiw2QkFpV1I7QUFDZixRQUFJQyxPQUFPLEdBQUcsS0FBSzdFLGdCQUFMLElBQXlCLEtBQUtBLGdCQUFMLENBQXNCNkUsT0FBN0Q7O0FBQ0EsUUFBSSxDQUFDQSxPQUFELElBQVksQ0FBQ0EsT0FBTyxDQUFDQyxNQUF6QixFQUFpQztBQUM3QixXQUFLUCxhQUFMO0FBQ0E7QUFDSDs7QUFDRCxTQUFLQyxNQUFMO0FBQ0gsR0F4VzBCO0FBMFczQk8sRUFBQUEsU0ExVzJCLHVCQTBXZDtBQUNULFNBQUtDLEtBQUw7QUFDSCxHQTVXMEI7QUE4VzNCQSxFQUFBQSxLQTlXMkIsbUJBOFdsQjtBQUNMLFFBQUksS0FBSzNCLE9BQVQsRUFBa0I7QUFDbEIsU0FBS0EsT0FBTCxHQUFlLElBQWY7O0FBRUEsU0FBSzRCLGVBQUw7O0FBQ0EsU0FBS0MsaUJBQUw7O0FBQ0EsU0FBS2hGLHNCQUFMOztBQUNBLFNBQUtQLFFBQUw7O0FBRUEsUUFBSThELFFBQVEsR0FBRyxLQUFLQyxJQUFMLENBQVVELFFBQXpCOztBQUNBLFNBQUssSUFBSUUsQ0FBQyxHQUFHLENBQVIsRUFBV0MsQ0FBQyxHQUFHSCxRQUFRLENBQUNJLE1BQTdCLEVBQXFDRixDQUFDLEdBQUdDLENBQXpDLEVBQTRDRCxDQUFDLEVBQTdDLEVBQWlEO0FBQzdDLFVBQUlHLEtBQUssR0FBR0wsUUFBUSxDQUFDRSxDQUFELENBQXBCOztBQUNBLFVBQUlHLEtBQUssSUFBSUEsS0FBSyxDQUFDRSxLQUFOLEtBQWdCLGlCQUE3QixFQUFnRDtBQUM1Q0YsUUFBQUEsS0FBSyxDQUFDSSxPQUFOO0FBQ0g7QUFDSjs7QUFDRCxTQUFLMUIsZ0JBQUw7QUFDSCxHQS9YMEI7O0FBaVkzQjs7Ozs7Ozs7Ozs7O0FBWUEyQyxFQUFBQSxjQTdZMkIsNEJBNllUO0FBQ2QsV0FBTyxLQUFLeEMsWUFBWjtBQUNILEdBL1kwQjs7QUFpWjNCOzs7Ozs7Ozs7Ozs7O0FBYUFSLEVBQUFBLHFCQTlaMkIsaUNBOFpKaUQsU0E5WkksRUE4Wk87QUFDOUIsUUFBSSxLQUFLcEQsYUFBTCxLQUF1Qm9ELFNBQTNCLEVBQXNDO0FBQ2xDLFdBQUtuRCxVQUFMLEdBQWtCbUQsU0FBbEI7O0FBQ0EsV0FBS0MsY0FBTDtBQUNIO0FBQ0osR0FuYTBCOztBQXFhM0I7Ozs7OztBQU1BeEUsRUFBQUEsaUJBM2EyQiwrQkEyYU47QUFDakIsUUFBSS9CLFNBQUosRUFBZSxPQUFPLEtBQVA7QUFDZixXQUFPLEtBQUttRCxVQUFMLEtBQW9CbEUsa0JBQWtCLENBQUNDLFFBQTlDO0FBQ0gsR0E5YTBCO0FBZ2IzQnNILEVBQUFBLFFBaGIyQixzQkFnYmY7QUFDUixTQUFLZCxNQUFMLEdBRFEsQ0FFUjs7O0FBQ0EsUUFBSSxLQUFLNUQsU0FBTCxJQUFrQixDQUFDLEtBQUtDLGlCQUFMLEVBQXZCLEVBQWlEO0FBQzdDLFdBQUsxQixRQUFMLENBQWMyQixZQUFkLENBQTJCQyxLQUEzQixDQUFpQ0UsR0FBakMsQ0FBcUMsS0FBS0wsU0FBMUM7QUFDSDtBQUNKLEdBdGIwQjtBQXdiM0IyRSxFQUFBQSxTQXhiMkIsdUJBd2JkO0FBQ1QsU0FBS2YsTUFBTCxHQURTLENBRVQ7OztBQUNBLFFBQUksS0FBSzVELFNBQUwsSUFBa0IsQ0FBQyxLQUFLQyxpQkFBTCxFQUF2QixFQUFpRDtBQUM3QyxXQUFLMUIsUUFBTCxDQUFjMkIsWUFBZCxDQUEyQkMsS0FBM0IsQ0FBaUNDLE1BQWpDLENBQXdDLEtBQUtKLFNBQTdDO0FBQ0g7QUFDSixHQTliMEI7QUFnYzNCNEUsRUFBQUEsdUJBaGMyQixxQ0FnY0E7QUFDdkI7QUFDQTtBQUNBLFNBQUtyQyxZQUFMLENBQWtCc0MsSUFBbEIsQ0FBdUJwRyxXQUFXLENBQUNxRyxXQUFaLENBQXdCQyxhQUEvQyxFQUh1QixDQUt2QjtBQUNBOzs7QUFDQSxTQUFLeEMsWUFBTCxDQUFrQnNDLElBQWxCLENBQXVCcEcsV0FBVyxDQUFDcUcsV0FBWixDQUF3QkUsUUFBL0M7QUFDSCxHQXhjMEI7QUEwYzNCQyxFQUFBQSxNQTFjMkIsa0JBMGNuQkMsRUExY21CLEVBMGNmO0FBQ1IsUUFBSSxDQUFDLEtBQUtqRixpQkFBTCxFQUFMLEVBQStCO0FBQy9CLFFBQUksQ0FBQyxLQUFLaUMsV0FBVixFQUF1QjtBQUV2QixRQUFJaUQsVUFBVSxHQUFHLEtBQUtqRCxXQUF0Qjs7QUFDQSxRQUFJLENBQUNpRCxVQUFVLENBQUNDLFFBQVgsRUFBTCxFQUE0QjtBQUN4QjtBQUNIOztBQUVELFFBQUlDLE1BQU0sR0FBR0YsVUFBVSxDQUFDRSxNQUF4Qjs7QUFDQSxRQUFJLENBQUMsS0FBS2pELFFBQVYsRUFBb0I7QUFDaEIsVUFBSStDLFVBQVUsQ0FBQ0csU0FBWCxFQUFKLEVBQTRCO0FBQ3hCSCxRQUFBQSxVQUFVLENBQUNJLGFBQVg7QUFDQSxhQUFLcEQsU0FBTCxHQUFpQmtELE1BQU0sQ0FBQ0EsTUFBTSxDQUFDcEMsTUFBUCxHQUFnQixDQUFqQixDQUF2QjtBQUNIOztBQUNEO0FBQ0g7O0FBRUQsUUFBSXVDLFNBQVMsR0FBRzVJLGFBQWEsQ0FBQzZJLFNBQTlCLENBbEJRLENBb0JSO0FBQ0E7O0FBQ0EsUUFBSSxLQUFLekQsUUFBTCxJQUFpQixDQUFqQixJQUFzQixLQUFLQyxVQUFMLElBQW1CLENBQTdDLEVBQWdEO0FBQzVDLFdBQUtNLFlBQUwsQ0FBa0JzQyxJQUFsQixDQUF1QnBHLFdBQVcsQ0FBQ3FHLFdBQVosQ0FBd0JZLEtBQS9DO0FBQ0g7O0FBRUQsUUFBSUMsZUFBZSxHQUFHbEgsV0FBVyxDQUFDK0MsU0FBbEM7QUFDQSxTQUFLUSxRQUFMLElBQWlCa0QsRUFBRSxHQUFHLEtBQUsxRCxTQUFWLEdBQXNCbUUsZUFBdkM7QUFDQSxRQUFJQyxRQUFRLEdBQUdDLElBQUksQ0FBQ0MsS0FBTCxDQUFXLEtBQUs5RCxRQUFMLEdBQWdCd0QsU0FBM0IsQ0FBZjs7QUFDQSxRQUFJLENBQUNMLFVBQVUsQ0FBQ1ksV0FBaEIsRUFBNkI7QUFDekJaLE1BQUFBLFVBQVUsQ0FBQ0ksYUFBWCxDQUF5QkssUUFBekI7QUFDSDs7QUFFRCxRQUFJVCxVQUFVLENBQUNZLFdBQVgsSUFBMEJILFFBQVEsSUFBSVAsTUFBTSxDQUFDcEMsTUFBakQsRUFBeUQ7QUFDckQsV0FBS2hCLFVBQUw7O0FBQ0EsVUFBSyxLQUFLZCxTQUFMLEdBQWlCLENBQWpCLElBQXNCLEtBQUtjLFVBQUwsSUFBbUIsS0FBS2QsU0FBbkQsRUFBK0Q7QUFDM0Q7QUFDQSxhQUFLZ0IsU0FBTCxHQUFpQmtELE1BQU0sQ0FBQ0EsTUFBTSxDQUFDcEMsTUFBUCxHQUFnQixDQUFqQixDQUF2QjtBQUNBLGFBQUtqQixRQUFMLEdBQWdCLENBQWhCO0FBQ0EsYUFBS0ksUUFBTCxHQUFnQixLQUFoQjtBQUNBLGFBQUtILFVBQUwsR0FBa0IsQ0FBbEI7O0FBQ0EsYUFBSzJDLHVCQUFMOztBQUNBO0FBQ0g7O0FBQ0QsV0FBSzVDLFFBQUwsR0FBZ0IsQ0FBaEI7QUFDQTRELE1BQUFBLFFBQVEsR0FBRyxDQUFYOztBQUNBLFdBQUtoQix1QkFBTDtBQUNIOztBQUVELFNBQUt6QyxTQUFMLEdBQWlCa0QsTUFBTSxDQUFDTyxRQUFELENBQXZCO0FBQ0gsR0E1ZjBCO0FBOGYzQkksRUFBQUEsU0E5ZjJCLHVCQThmZDtBQUNULFNBQUtwQyxNQUFMOztBQUNBLFNBQUtuQixPQUFMLEdBQWUsS0FBZjs7QUFFQSxRQUFJLENBQUN2RSxTQUFMLEVBQWdCO0FBQ1osVUFBSSxLQUFLbUQsVUFBTCxLQUFvQmxFLGtCQUFrQixDQUFDRyxhQUEzQyxFQUEwRDtBQUN0RCxhQUFLK0UsY0FBTCxDQUFvQjRELE9BQXBCOztBQUNBLGFBQUs1RCxjQUFMLEdBQXNCLElBQXRCO0FBQ0EsYUFBS3JDLFNBQUwsR0FBaUIsSUFBakI7QUFDSCxPQUpELE1BSU8sSUFBSSxLQUFLcUIsVUFBTCxLQUFvQmxFLGtCQUFrQixDQUFDRSxZQUEzQyxFQUF5RDtBQUM1RCxhQUFLZ0YsY0FBTCxHQUFzQixJQUF0QjtBQUNBLGFBQUtyQyxTQUFMLEdBQWlCLElBQWpCO0FBQ0gsT0FITSxNQUdBLElBQUksS0FBS0EsU0FBVCxFQUFvQjtBQUN2QixhQUFLQSxTQUFMLENBQWVpRyxPQUFmOztBQUNBLGFBQUtqRyxTQUFMLEdBQWlCLElBQWpCO0FBQ0g7QUFDSixLQVpELE1BWU87QUFDSCxVQUFJLEtBQUtBLFNBQVQsRUFBb0I7QUFDaEIsYUFBS0EsU0FBTCxDQUFlaUcsT0FBZjs7QUFDQSxhQUFLakcsU0FBTCxHQUFpQixJQUFqQjtBQUNIO0FBQ0o7QUFDSixHQXBoQjBCO0FBc2hCM0I0QixFQUFBQSxnQkF0aEIyQiw4QkFzaEJQO0FBQ2hCLFFBQUksS0FBS0QsVUFBVCxFQUFxQjtBQUNqQixVQUFJLENBQUMsS0FBS3VFLFVBQVYsRUFBc0I7QUFDbEIsWUFBSUMsYUFBYSxHQUFHLElBQUlwSixFQUFFLENBQUNxSixXQUFQLEVBQXBCO0FBQ0FELFFBQUFBLGFBQWEsQ0FBQ25JLElBQWQsR0FBcUIsaUJBQXJCO0FBQ0EsWUFBSXFJLFNBQVMsR0FBR0YsYUFBYSxDQUFDRyxZQUFkLENBQTJCN0osUUFBM0IsQ0FBaEI7QUFDQTRKLFFBQUFBLFNBQVMsQ0FBQ0UsU0FBVixHQUFzQixDQUF0QjtBQUNBRixRQUFBQSxTQUFTLENBQUNHLFdBQVYsR0FBd0J6SixFQUFFLENBQUMwSixLQUFILENBQVMsR0FBVCxFQUFjLENBQWQsRUFBaUIsQ0FBakIsRUFBb0IsR0FBcEIsQ0FBeEI7QUFFQSxhQUFLUCxVQUFMLEdBQWtCRyxTQUFsQjtBQUNIOztBQUVELFdBQUtILFVBQUwsQ0FBZ0JwRCxJQUFoQixDQUFxQjRELE1BQXJCLEdBQThCLEtBQUs1RCxJQUFuQztBQUNILEtBWkQsTUFhSyxJQUFJLEtBQUtvRCxVQUFULEVBQXFCO0FBQ3RCLFdBQUtBLFVBQUwsQ0FBZ0JwRCxJQUFoQixDQUFxQjRELE1BQXJCLEdBQThCLElBQTlCO0FBQ0g7QUFDSixHQXZpQjBCO0FBeWlCM0JqQyxFQUFBQSxjQXppQjJCLDRCQXlpQlQ7QUFDZCxRQUFJLENBQUMsS0FBSzdGLFdBQU4sSUFBcUIsQ0FBQyxLQUFLUSxnQkFBM0IsSUFBK0MsQ0FBQyxLQUFLSSxZQUF6RCxFQUF1RSxPQUR6RCxDQUdkOztBQUNBLFFBQUksS0FBS1EsU0FBVCxFQUFvQjtBQUNoQjtBQUNBLFVBQUksQ0FBQzlCLFNBQUwsRUFBZ0I7QUFDWixZQUFJLEtBQUtrRCxhQUFMLEtBQXVCakUsa0JBQWtCLENBQUNHLGFBQTlDLEVBQTZEO0FBQ3pELGVBQUsrRSxjQUFMLENBQW9CNEQsT0FBcEI7QUFDSCxTQUZELE1BRU8sSUFBSSxLQUFLN0UsYUFBTCxLQUF1QmpFLGtCQUFrQixDQUFDQyxRQUE5QyxFQUF3RDtBQUMzRCxlQUFLNEMsU0FBTCxDQUFlaUcsT0FBZjtBQUNIO0FBQ0osT0FORCxNQU1PO0FBQ0gsYUFBS2pHLFNBQUwsQ0FBZWlHLE9BQWY7QUFDSDs7QUFFRCxXQUFLNUQsY0FBTCxHQUFzQixJQUF0QjtBQUNBLFdBQUtyQyxTQUFMLEdBQWlCLElBQWpCO0FBQ0EsV0FBSzJHLGFBQUwsR0FBcUIsSUFBckI7QUFDQSxXQUFLekUsV0FBTCxHQUFtQixJQUFuQjtBQUNBLFdBQUtDLFNBQUwsR0FBaUIsSUFBakI7QUFDQSxXQUFLQyxRQUFMLEdBQWdCLEtBQWhCO0FBQ0EsV0FBS2hCLGFBQUwsR0FBcUIsSUFBckI7QUFDSDs7QUFFRCxRQUFJLENBQUNsRCxTQUFMLEVBQWdCO0FBQ1osVUFBSSxLQUFLbUQsVUFBTCxLQUFvQmxFLGtCQUFrQixDQUFDRSxZQUEzQyxFQUF5RDtBQUNyRCxhQUFLZ0YsY0FBTCxHQUFzQnpGLGFBQWEsQ0FBQ2dLLFdBQXBDO0FBQ0gsT0FGRCxNQUVPLElBQUksS0FBS3ZGLFVBQUwsS0FBb0JsRSxrQkFBa0IsQ0FBQ0csYUFBM0MsRUFBMEQ7QUFDN0QsYUFBSytFLGNBQUwsR0FBc0IsSUFBSXpGLGFBQUosRUFBdEI7O0FBQ0EsYUFBS3lGLGNBQUwsQ0FBb0J3RSxpQkFBcEI7QUFDSDtBQUNKOztBQUVELFFBQUlDLFNBQVMsR0FBRyxLQUFLMUgsZ0JBQUwsQ0FBc0IySCxLQUF0QztBQUNBLFNBQUtoRixZQUFMLEdBQW9CLEtBQUtuRCxXQUFMLENBQWlCb0ksSUFBakIsQ0FBc0IsS0FBS3pJLFFBQTNCLEVBQXFDdUksU0FBckMsQ0FBcEI7O0FBRUEsUUFBSSxLQUFLN0csaUJBQUwsRUFBSixFQUE4QjtBQUMxQixXQUFLRCxTQUFMLEdBQWlCLEtBQUtxQyxjQUFMLENBQW9CNEUsZ0JBQXBCLENBQXFDLEtBQUt6SCxZQUExQyxFQUF3RCxLQUFLdUMsWUFBN0QsRUFBMkUrRSxTQUEzRSxDQUFqQjs7QUFDQSxVQUFJLENBQUMsS0FBSzlHLFNBQVYsRUFBcUI7QUFDakI7QUFDQSxhQUFLcUIsVUFBTCxHQUFrQmxFLGtCQUFrQixDQUFDQyxRQUFyQztBQUNIO0FBQ0o7O0FBRUQsU0FBS2dFLGFBQUwsR0FBcUIsS0FBS0MsVUFBMUI7O0FBQ0EsUUFBSW5ELFNBQVMsSUFBSSxLQUFLbUQsVUFBTCxLQUFvQmxFLGtCQUFrQixDQUFDQyxRQUF4RCxFQUFrRTtBQUM5RCxXQUFLdUosYUFBTCxHQUFxQixLQUFLcEksUUFBTCxDQUFjMkksb0JBQWQsQ0FBbUMsS0FBSzFILFlBQXhDLEVBQXNELEtBQUt1QyxZQUEzRCxFQUF5RSxFQUF6RSxFQUE2RStFLFNBQTdFLENBQXJCO0FBQ0EsVUFBSSxDQUFDLEtBQUtILGFBQVYsRUFBeUI7QUFDekIsV0FBS0EsYUFBTCxDQUFtQlEsT0FBbkIsR0FBNkIsS0FBS3JFLElBQWxDOztBQUNBLFdBQUs2RCxhQUFMLENBQW1CUyxjQUFuQixDQUFrQyxLQUFLN0UsWUFBdkM7O0FBQ0EsV0FBS3ZDLFNBQUwsR0FBaUIsS0FBSzJHLGFBQUwsQ0FBbUIzRyxTQUFwQztBQUNBLFdBQUtBLFNBQUwsQ0FBZXlCLFNBQWYsQ0FBeUJELFNBQXpCLEdBQXFDLEtBQUtBLFNBQTFDLENBTjhELENBTzlEOztBQUNBLFdBQUtqRCxRQUFMLENBQWMyQixZQUFkLENBQTJCQyxLQUEzQixDQUFpQ0UsR0FBakMsQ0FBcUMsS0FBS0wsU0FBMUM7QUFDSDs7QUFFRCxRQUFJLEtBQUtxQixVQUFMLEtBQW9CbEUsa0JBQWtCLENBQUNDLFFBQXZDLElBQW1ELEtBQUt1RSxVQUE1RCxFQUF3RTtBQUNwRTVFLE1BQUFBLEVBQUUsQ0FBQ3NLLElBQUgsQ0FBUSx1Q0FBUjtBQUNIOztBQUVELFFBQUksS0FBS3JILFNBQVQsRUFBb0I7QUFDaEIsVUFBSXNILFlBQVksR0FBRyxLQUFLdEgsU0FBTCxDQUFlc0gsWUFBbEM7QUFDQSxVQUFJQyxJQUFJLEdBQUdELFlBQVksQ0FBQ0MsSUFBeEI7QUFDQSxXQUFLekUsSUFBTCxDQUFVMEUsY0FBVixDQUF5QkQsSUFBSSxDQUFDRSxLQUE5QixFQUFxQ0YsSUFBSSxDQUFDRyxNQUExQztBQUNIOztBQUVELFNBQUs1RixZQUFMOztBQUNBLFNBQUtZLFVBQUwsQ0FBZ0JzRSxJQUFoQixDQUFxQixJQUFyQjs7QUFDQSxTQUFLdEUsVUFBTCxDQUFnQmlGLHNCQUFoQjs7QUFFQSxRQUFJLEtBQUs3SCxhQUFULEVBQXdCO0FBQ3BCLFdBQUtvQixhQUFMLENBQW1CLEtBQUtwQixhQUF4QixFQUF1QyxLQUFLcUIsU0FBNUM7QUFDSDs7QUFFRCxTQUFLMkMsYUFBTCxDQUFtQixJQUFuQjtBQUNILEdBcm5CMEI7QUF1bkIzQnhFLEVBQUFBLHNCQXZuQjJCLG9DQXVuQkQ7QUFDdEIsUUFBSSxLQUFLRixnQkFBVCxFQUEyQjtBQUN2QixXQUFLQSxnQkFBTCxDQUFzQjRILElBQXRCLENBQTJCLEtBQUt6SSxRQUFoQztBQUNIO0FBQ0osR0EzbkIwQjtBQTZuQjNCUSxFQUFBQSxRQTduQjJCLHNCQTZuQmY7QUFDUixTQUFLMEYsY0FBTDs7QUFFQSxRQUFJdkcsU0FBSixFQUFlO0FBQ1g7QUFDQSxXQUFLMEosbUJBQUw7O0FBQ0EsV0FBS0MsZUFBTDs7QUFDQSxXQUFLQyxvQkFBTDs7QUFDQUMsTUFBQUEsTUFBTSxDQUFDQyxLQUFQLENBQWFDLHdCQUFiLENBQXNDLE1BQXRDLEVBQThDLEtBQUtuRixJQUFMLENBQVVvRixJQUF4RDtBQUNIO0FBQ0osR0F2b0IwQjtBQXlvQjNCSixFQUFBQSxvQkFBb0IsRUFBRTVKLFNBQVMsSUFBSSxZQUFZO0FBQzNDLFFBQUksS0FBSzhCLFNBQUwsSUFBa0JwRCxhQUFhLENBQUN1TCxRQUFkLENBQXVCLEtBQUtuSSxTQUE1QixDQUF0QixFQUE4RDtBQUMxRHpDLE1BQUFBLFdBQVcsQ0FBQyxJQUFELEVBQU8sbUJBQVAsRUFBNEJKLGtCQUE1QixDQUFYO0FBQ0gsS0FGRCxNQUVPO0FBQ0hJLE1BQUFBLFdBQVcsQ0FBQyxJQUFELEVBQU8sbUJBQVAsRUFBNEJMLGdCQUE1QixDQUFYO0FBQ0g7QUFDSixHQS9vQjBCO0FBaXBCM0I7QUFDQTJLLEVBQUFBLGVBQWUsRUFBRTNKLFNBQVMsSUFBSSxZQUFZO0FBQ3RDLFFBQUlrSyxRQUFKOztBQUNBLFFBQUksS0FBS3hKLFdBQVQsRUFBc0I7QUFDbEJ3SixNQUFBQSxRQUFRLEdBQUcsS0FBS3hKLFdBQUwsQ0FBaUJvQyxZQUFqQixDQUE4QixLQUFLeEIsWUFBbkMsQ0FBWDtBQUNILEtBSnFDLENBS3RDOzs7QUFDQWpDLElBQUFBLFdBQVcsQ0FBQyxJQUFELEVBQU8saUJBQVAsRUFBMEI2SyxRQUFRLElBQUluTCxnQkFBdEMsQ0FBWDtBQUNILEdBenBCMEI7QUEycEIzQjtBQUNBMkssRUFBQUEsbUJBQW1CLEVBQUUxSixTQUFTLElBQUksWUFBWTtBQUMxQyxRQUFJbUssWUFBSjs7QUFDQSxRQUFJLEtBQUt6SixXQUFULEVBQXNCO0FBQ2xCeUosTUFBQUEsWUFBWSxHQUFHLEtBQUt6SixXQUFMLENBQWlCNkIsZUFBakIsRUFBZjtBQUNILEtBSnlDLENBSzFDOzs7QUFDQWxELElBQUFBLFdBQVcsQ0FBQyxJQUFELEVBQU8sdUJBQVAsRUFBZ0M4SyxZQUFZLElBQUl2TCxvQkFBaEQsQ0FBWDtBQUNILEdBbnFCMEI7O0FBcXFCM0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBb0UsRUFBQUEsYUF6ckIyQix5QkF5ckJaRCxRQXpyQlksRUF5ckJGRSxTQXpyQkUsRUF5ckJTO0FBRWhDLFNBQUtBLFNBQUwsR0FBa0JBLFNBQVMsS0FBS1IsU0FBZixHQUE0QixDQUFDLENBQTdCLEdBQWlDUSxTQUFsRDtBQUNBLFNBQUtyQixhQUFMLEdBQXFCbUIsUUFBckI7O0FBRUEsUUFBSSxLQUFLaEIsaUJBQUwsRUFBSixFQUE4QjtBQUMxQixVQUFJcUksS0FBSyxHQUFHLEtBQUtqRyxjQUFMLENBQW9Ca0csaUJBQXBCLENBQXNDLEtBQUt4RyxZQUEzQyxFQUF5RGQsUUFBekQsQ0FBWjs7QUFDQSxVQUFJLENBQUNxSCxLQUFMLEVBQVk7QUFDUkEsUUFBQUEsS0FBSyxHQUFHLEtBQUtqRyxjQUFMLENBQW9CbUcsa0JBQXBCLENBQXVDLEtBQUt6RyxZQUE1QyxFQUEwRGQsUUFBMUQsQ0FBUjtBQUNIOztBQUNELFVBQUlxSCxLQUFKLEVBQVc7QUFDUCxhQUFLdEcsUUFBTCxHQUFnQixDQUFoQjtBQUNBLGFBQUtDLFVBQUwsR0FBa0IsQ0FBbEI7QUFDQSxhQUFLQyxXQUFMLEdBQW1Cb0csS0FBbkI7O0FBQ0EsWUFBSSxLQUFLNUYsVUFBTCxDQUFnQitGLGdCQUFoQixFQUFKLEVBQXdDO0FBQ3BDLGVBQUt2RyxXQUFMLENBQWlCd0csdUJBQWpCO0FBQ0g7O0FBQ0QsYUFBS3hHLFdBQUwsQ0FBaUJxRCxhQUFqQixDQUErQixDQUEvQjs7QUFDQSxhQUFLbkQsUUFBTCxHQUFnQixJQUFoQjtBQUNBLGFBQUtELFNBQUwsR0FBaUIsS0FBS0QsV0FBTCxDQUFpQm1ELE1BQWpCLENBQXdCLENBQXhCLENBQWpCO0FBQ0g7QUFDSixLQWhCRCxNQWdCTztBQUNILFVBQUksS0FBS3JGLFNBQVQsRUFBb0I7QUFDaEIsZUFBTyxLQUFLQSxTQUFMLENBQWV5QixTQUFmLENBQXlCa0gsSUFBekIsQ0FBOEIxSCxRQUE5QixFQUF3QyxLQUFLRSxTQUE3QyxDQUFQO0FBQ0g7QUFDSjtBQUNKLEdBbnRCMEI7O0FBcXRCM0I7Ozs7Ozs7Ozs7O0FBV0F5SCxFQUFBQSxvQkFodUIyQixnQ0FndUJMM0gsUUFodUJLLEVBZ3VCSztBQUM1QixRQUFJLENBQUMsS0FBS2hCLGlCQUFMLEVBQUwsRUFBK0I7O0FBQy9CLFNBQUtvQyxjQUFMLENBQW9CdUcsb0JBQXBCLENBQXlDLEtBQUs3RyxZQUE5QyxFQUE0RGQsUUFBNUQ7QUFDSCxHQW51QjBCOztBQXF1QjNCOzs7Ozs7O0FBT0E0SCxFQUFBQSxxQkE1dUIyQixtQ0E0dUJGO0FBQ3JCLFFBQUksQ0FBQyxLQUFLNUksaUJBQUwsRUFBTCxFQUErQjs7QUFDL0IsU0FBS29DLGNBQUwsQ0FBb0J3RyxxQkFBcEIsQ0FBMEMsS0FBSzlHLFlBQS9DO0FBQ0gsR0EvdUIwQjs7QUFpdkIzQjs7Ozs7Ozs7QUFRQStHLEVBQUFBLGdCQXp2QjJCLDhCQXl2QlA7QUFDaEIsUUFBSUMsZUFBZSxHQUFHLEtBQUt4SyxRQUFMLENBQWN5SyxrQkFBZCxDQUFpQyxLQUFLakgsWUFBdEMsQ0FBdEI7O0FBQ0EsV0FBUWdILGVBQWUsSUFBSUEsZUFBZSxDQUFDRSxhQUFwQyxJQUFzRCxFQUE3RDtBQUNILEdBNXZCMEI7O0FBOHZCM0I7Ozs7Ozs7OztBQVNBcEosRUFBQUEsaUJBdndCMkIsNkJBdXdCUkwsWUF2d0JRLEVBdXdCTTtBQUM3QixRQUFJMEosR0FBRyxHQUFHLEVBQVY7O0FBQ0EsUUFBSUgsZUFBZSxHQUFHLEtBQUt4SyxRQUFMLENBQWN5SyxrQkFBZCxDQUFpQyxLQUFLakgsWUFBdEMsQ0FBdEI7O0FBQ0EsUUFBSWdILGVBQUosRUFBcUI7QUFDakIsVUFBSXpCLFlBQVksR0FBR3lCLGVBQWUsQ0FBQ0ksV0FBaEIsQ0FBNEIzSixZQUE1QixDQUFuQjs7QUFDQSxVQUFJOEgsWUFBSixFQUFrQjtBQUNkLGFBQUssSUFBSXJHLFFBQVQsSUFBcUJxRyxZQUFZLENBQUM4QixVQUFsQyxFQUE4QztBQUMxQyxjQUFJOUIsWUFBWSxDQUFDOEIsVUFBYixDQUF3QkMsY0FBeEIsQ0FBdUNwSSxRQUF2QyxDQUFKLEVBQXNEO0FBQ2xEaUksWUFBQUEsR0FBRyxDQUFDSSxJQUFKLENBQVNySSxRQUFUO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7O0FBQ0QsV0FBT2lJLEdBQVA7QUFDSCxHQXJ4QjBCOztBQXV4QjNCOzs7Ozs7Ozs7OztBQVdBSyxFQUFBQSxFQWx5QjJCLGNBa3lCdkJDLFNBbHlCdUIsRUFreUJaQyxRQWx5QlksRUFreUJGQyxNQWx5QkUsRUFreUJNO0FBQzdCLFNBQUtDLGdCQUFMLENBQXNCSCxTQUF0QixFQUFpQ0MsUUFBakMsRUFBMkNDLE1BQTNDO0FBQ0gsR0FweUIwQjs7QUFzeUIzQjs7Ozs7Ozs7OztBQVVBRSxFQUFBQSxHQWh6QjJCLGVBZ3pCdEJKLFNBaHpCc0IsRUFnekJYQyxRQWh6QlcsRUFnekJEQyxNQWh6QkMsRUFnekJPO0FBQzlCLFNBQUtHLG1CQUFMLENBQXlCTCxTQUF6QixFQUFvQ0MsUUFBcEMsRUFBOENDLE1BQTlDO0FBQ0gsR0FsekIwQjs7QUFvekIzQjs7Ozs7Ozs7Ozs7QUFXQUksRUFBQUEsSUEvekIyQixnQkErekJyQk4sU0EvekJxQixFQSt6QlZDLFFBL3pCVSxFQSt6QkFDLE1BL3pCQSxFQSt6QlE7QUFDL0IsU0FBS25ILFlBQUwsQ0FBa0J1SCxJQUFsQixDQUF1Qk4sU0FBdkIsRUFBa0NDLFFBQWxDLEVBQTRDQyxNQUE1QztBQUNILEdBajBCMEI7O0FBbTBCM0I7Ozs7Ozs7Ozs7O0FBV0FDLEVBQUFBLGdCQTkwQjJCLDRCQTgwQlRILFNBOTBCUyxFQTgwQkVDLFFBOTBCRixFQTgwQllDLE1BOTBCWixFQTgwQm9CO0FBQzNDLFNBQUtuSCxZQUFMLENBQWtCZ0gsRUFBbEIsQ0FBcUJDLFNBQXJCLEVBQWdDQyxRQUFoQyxFQUEwQ0MsTUFBMUM7QUFDSCxHQWgxQjBCOztBQWsxQjNCOzs7Ozs7Ozs7O0FBVUFHLEVBQUFBLG1CQTUxQjJCLCtCQTQxQk5MLFNBNTFCTSxFQTQxQktDLFFBNTFCTCxFQTQxQmVDLE1BNTFCZixFQTQxQnVCO0FBQzlDLFNBQUtuSCxZQUFMLENBQWtCcUgsR0FBbEIsQ0FBc0JKLFNBQXRCLEVBQWlDQyxRQUFqQyxFQUEyQ0MsTUFBM0M7QUFDSCxHQTkxQjBCOztBQWcyQjNCOzs7Ozs7Ozs7O0FBVUFLLEVBQUFBLGFBMTJCMkIseUJBMDJCWnZLLFlBMTJCWSxFQTAyQkVzRCxJQTEyQkYsRUEwMkJRO0FBQy9CLFdBQU8sS0FBS3ZFLFFBQUwsQ0FBY3lMLGtCQUFkLENBQWlDLElBQWpDLEVBQXVDeEssWUFBdkMsRUFBcURzRCxJQUFyRCxDQUFQO0FBQ0gsR0E1MkIwQjs7QUE4MkIzQjs7Ozs7Ozs7QUFRQW1ILEVBQUFBLFFBdDNCMkIsc0JBczNCZjtBQUNSLFdBQU8sS0FBS2pLLFNBQVo7QUFDSDtBQXgzQjBCLENBQVQsQ0FBdEI7QUEyM0JBOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBa0ssTUFBTSxDQUFDQyxPQUFQLEdBQWlCMUwsV0FBVyxDQUFDVixlQUFaLEdBQThCQSxlQUEvQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuY29uc3QgUmVuZGVyQ29tcG9uZW50ID0gcmVxdWlyZSgnLi4vLi4vY29jb3MyZC9jb3JlL2NvbXBvbmVudHMvQ0NSZW5kZXJDb21wb25lbnQnKTtcbmxldCBFdmVudFRhcmdldCA9IHJlcXVpcmUoJy4uLy4uL2NvY29zMmQvY29yZS9ldmVudC9ldmVudC10YXJnZXQnKTtcbmNvbnN0IEdyYXBoaWNzID0gcmVxdWlyZSgnLi4vLi4vY29jb3MyZC9jb3JlL2dyYXBoaWNzL2dyYXBoaWNzJyk7XG5jb25zdCBSZW5kZXJGbG93ID0gcmVxdWlyZSgnLi4vLi4vY29jb3MyZC9jb3JlL3JlbmRlcmVyL3JlbmRlci1mbG93Jyk7XG5jb25zdCBGTEFHX1BPU1RfUkVOREVSID0gUmVuZGVyRmxvdy5GTEFHX1BPU1RfUkVOREVSO1xuXG5sZXQgQXJtYXR1cmVDYWNoZSA9IHJlcXVpcmUoJy4vQXJtYXR1cmVDYWNoZScpO1xubGV0IEF0dGFjaFV0aWwgPSByZXF1aXJlKCcuL0F0dGFjaFV0aWwnKTtcblxuLyoqXG4gKiBAbW9kdWxlIGRyYWdvbkJvbmVzXG4gKi9cblxubGV0IERlZmF1bHRBcm1hdHVyZXNFbnVtID0gY2MuRW51bSh7ICdkZWZhdWx0JzogLTEgfSk7XG5sZXQgRGVmYXVsdEFuaW1zRW51bSA9IGNjLkVudW0oeyAnPE5vbmU+JzogMCB9KTtcbmxldCBEZWZhdWx0Q2FjaGVNb2RlID0gY2MuRW51bSh7ICdSRUFMVElNRSc6IDAgfSk7XG5cbi8qKlxuICogISNlbiBFbnVtIGZvciBjYWNoZSBtb2RlIHR5cGUuXG4gKiAhI3poIERyYWdvbmJvbmVz5riy5p+T57G75Z6LXG4gKiBAZW51bSBBcm1hdHVyZURpc3BsYXkuQW5pbWF0aW9uQ2FjaGVNb2RlXG4gKi9cbmxldCBBbmltYXRpb25DYWNoZU1vZGUgPSBjYy5FbnVtKHtcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSByZWFsdGltZSBtb2RlLlxuICAgICAqICEjemgg5a6e5pe26K6h566X5qih5byP44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFJFQUxUSU1FXG4gICAgICovXG4gICAgUkVBTFRJTUU6IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgc2hhcmVkIGNhY2hlIG1vZGUuXG4gICAgICogISN6aCDlhbHkuqvnvJPlrZjmqKHlvI/jgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gU0hBUkVEX0NBQ0hFXG4gICAgICovXG4gICAgU0hBUkVEX0NBQ0hFOiAxLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHByaXZhdGUgY2FjaGUgbW9kZS5cbiAgICAgKiAhI3poIOengeaciee8k+WtmOaooeW8j+OAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBQUklWQVRFX0NBQ0hFXG4gICAgICovXG4gICAgUFJJVkFURV9DQUNIRTogMiBcbn0pO1xuXG5mdW5jdGlvbiBzZXRFbnVtQXR0ciAob2JqLCBwcm9wTmFtZSwgZW51bURlZikge1xuICAgIGNjLkNsYXNzLkF0dHIuc2V0Q2xhc3NBdHRyKG9iaiwgcHJvcE5hbWUsICd0eXBlJywgJ0VudW0nKTtcbiAgICBjYy5DbGFzcy5BdHRyLnNldENsYXNzQXR0cihvYmosIHByb3BOYW1lLCAnZW51bUxpc3QnLCBjYy5FbnVtLmdldExpc3QoZW51bURlZikpO1xufVxuXG4vKipcbiAqICEjZW5cbiAqIFRoZSBBcm1hdHVyZSBEaXNwbGF5IG9mIERyYWdvbkJvbmVzIDxici8+XG4gKiA8YnIvPlxuICogKEFybWF0dXJlIERpc3BsYXkgaGFzIGEgcmVmZXJlbmNlIHRvIGEgRHJhZ29uQm9uZXNBc3NldCBhbmQgc3RvcmVzIHRoZSBzdGF0ZSBmb3IgQXJtYXR1cmVEaXNwbGF5IGluc3RhbmNlLFxuICogd2hpY2ggY29uc2lzdHMgb2YgdGhlIGN1cnJlbnQgcG9zZSdzIGJvbmUgU1JULCBzbG90IGNvbG9ycywgYW5kIHdoaWNoIHNsb3QgYXR0YWNobWVudHMgYXJlIHZpc2libGUuIDxici8+XG4gKiBNdWx0aXBsZSBBcm1hdHVyZSBEaXNwbGF5IGNhbiB1c2UgdGhlIHNhbWUgRHJhZ29uQm9uZXNBc3NldCB3aGljaCBpbmNsdWRlcyBhbGwgYW5pbWF0aW9ucywgc2tpbnMsIGFuZCBhdHRhY2htZW50cy4pIDxici8+XG4gKiAhI3poXG4gKiBEcmFnb25Cb25lcyDpqqjpqrzliqjnlLsgPGJyLz5cbiAqIDxici8+XG4gKiAoQXJtYXR1cmUgRGlzcGxheSDlhbfmnInlr7npqqjpqrzmlbDmja7nmoTlvJXnlKjlubbkuJTlrZjlgqjkuobpqqjpqrzlrp7kvovnmoTnirbmgIHvvIxcbiAqIOWug+eUseW9k+WJjeeahOmqqOmqvOWKqOS9nO+8jHNsb3Qg6aKc6Imy77yM5ZKM5Y+v6KeB55qEIHNsb3QgYXR0YWNobWVudHMg57uE5oiQ44CCPGJyLz5cbiAqIOWkmuS4qiBBcm1hdHVyZSBEaXNwbGF5IOWPr+S7peS9v+eUqOebuOWQjOeahOmqqOmqvOaVsOaNru+8jOWFtuS4reWMheaLrOaJgOacieeahOWKqOeUu++8jOearuiCpOWSjCBhdHRhY2htZW50c+OAgik8YnIvPlxuICpcbiAqIEBjbGFzcyBBcm1hdHVyZURpc3BsYXlcbiAqIEBleHRlbmRzIFJlbmRlckNvbXBvbmVudFxuICovXG5sZXQgQXJtYXR1cmVEaXNwbGF5ID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdkcmFnb25Cb25lcy5Bcm1hdHVyZURpc3BsYXknLFxuICAgIGV4dGVuZHM6IFJlbmRlckNvbXBvbmVudCxcblxuICAgIGVkaXRvcjogQ0NfRURJVE9SICYmIHtcbiAgICAgICAgbWVudTogJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC5yZW5kZXJlcnMvRHJhZ29uQm9uZXMnLFxuICAgICAgICBpbnNwZWN0b3I6ICdwYWNrYWdlczovL2luc3BlY3Rvci9pbnNwZWN0b3JzL2NvbXBzL3NrZWxldG9uMmQuanMnLFxuICAgIH0sXG4gICAgXG4gICAgc3RhdGljczoge1xuICAgICAgICBBbmltYXRpb25DYWNoZU1vZGU6IEFuaW1hdGlvbkNhY2hlTW9kZSxcbiAgICB9LFxuICAgIFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgX2ZhY3Rvcnk6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBkcmFnb25Cb25lcy5DQ0ZhY3RvcnksXG4gICAgICAgICAgICBzZXJpYWxpemFibGU6IGZhbHNlLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBEcmFnb25Cb25lcyBkYXRhIGNvbnRhaW5zIHRoZSBhcm1hdHVyZXMgaW5mb3JtYXRpb24gKGJpbmQgcG9zZSBib25lcywgc2xvdHMsIGRyYXcgb3JkZXIsXG4gICAgICAgICAqIGF0dGFjaG1lbnRzLCBza2lucywgZXRjKSBhbmQgYW5pbWF0aW9ucyBidXQgZG9lcyBub3QgaG9sZCBhbnkgc3RhdGUuPGJyLz5cbiAgICAgICAgICogTXVsdGlwbGUgQXJtYXR1cmVEaXNwbGF5IGNhbiBzaGFyZSB0aGUgc2FtZSBEcmFnb25Cb25lcyBkYXRhLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOmqqOmqvOaVsOaNruWMheWQq+S6humqqOmqvOS/oeaBr++8iOe7keWumumqqOmqvOWKqOS9nO+8jHNsb3Rz77yM5riy5p+T6aG65bqP77yMXG4gICAgICAgICAqIGF0dGFjaG1lbnRz77yM55qu6IKk562J562J77yJ5ZKM5Yqo55S75L2G5LiN5oyB5pyJ5Lu75L2V54q25oCB44CCPGJyLz5cbiAgICAgICAgICog5aSa5LiqIEFybWF0dXJlRGlzcGxheSDlj6/ku6XlhbHnlKjnm7jlkIznmoTpqqjpqrzmlbDmja7jgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtEcmFnb25Cb25lc0Fzc2V0fSBkcmFnb25Bc3NldFxuICAgICAgICAgKi9cbiAgICAgICAgZHJhZ29uQXNzZXQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBkcmFnb25Cb25lcy5EcmFnb25Cb25lc0Fzc2V0LFxuICAgICAgICAgICAgbm90aWZ5ICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWZyZXNoKCk7XG4gICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZWZhdWx0QXJtYXR1cmVJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FuaW1hdGlvbkluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5kcmFnb25fYm9uZXMuZHJhZ29uX2JvbmVzX2Fzc2V0J1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBhdGxhcyBhc3NldCBmb3IgdGhlIERyYWdvbkJvbmVzLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOmqqOmqvOaVsOaNruaJgOmcgOeahCBBdGxhcyBUZXh0dXJlIOaVsOaNruOAglxuICAgICAgICAgKiBAcHJvcGVydHkge0RyYWdvbkJvbmVzQXRsYXNBc3NldH0gZHJhZ29uQXRsYXNBc3NldFxuICAgICAgICAgKi9cbiAgICAgICAgZHJhZ29uQXRsYXNBc3NldDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGRyYWdvbkJvbmVzLkRyYWdvbkJvbmVzQXRsYXNBc3NldCxcbiAgICAgICAgICAgIG5vdGlmeSAoKSB7XG4gICAgICAgICAgICAgICAgLy8gcGFyc2UgdGhlIGF0bGFzIGFzc2V0IGRhdGFcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXJzZURyYWdvbkF0bGFzQXNzZXQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWZyZXNoKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5kcmFnb25fYm9uZXMuZHJhZ29uX2JvbmVzX2F0bGFzX2Fzc2V0J1xuICAgICAgICB9LFxuXG4gICAgICAgIF9hcm1hdHVyZU5hbWU6ICcnLFxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgbmFtZSBvZiBjdXJyZW50IGFybWF0dXJlLlxuICAgICAgICAgKiAhI3poIOW9k+WJjeeahCBBcm1hdHVyZSDlkI3np7DjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtTdHJpbmd9IGFybWF0dXJlTmFtZVxuICAgICAgICAgKi9cbiAgICAgICAgYXJtYXR1cmVOYW1lOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9hcm1hdHVyZU5hbWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2FybWF0dXJlTmFtZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGxldCBhbmltTmFtZXMgPSB0aGlzLmdldEFuaW1hdGlvbk5hbWVzKHRoaXMuX2FybWF0dXJlTmFtZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYW5pbWF0aW9uTmFtZSB8fCBhbmltTmFtZXMuaW5kZXhPZih0aGlzLmFuaW1hdGlvbk5hbWUpIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbk5hbWUgPSBhbmltTmFtZXNbMF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBOb3QgdXNlIGRlZmF1bHQgYW5pbWF0aW9uIG5hbWUgYXQgcnVudGltZVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25OYW1lID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fYXJtYXR1cmUgJiYgIXRoaXMuaXNBbmltYXRpb25DYWNoZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mYWN0b3J5Ll9kcmFnb25Cb25lcy5jbG9jay5yZW1vdmUodGhpcy5fYXJtYXR1cmUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuX3JlZnJlc2goKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9hcm1hdHVyZSAmJiAhdGhpcy5pc0FuaW1hdGlvbkNhY2hlZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZhY3RvcnkuX2RyYWdvbkJvbmVzLmNsb2NrLmFkZCh0aGlzLl9hcm1hdHVyZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgX2FuaW1hdGlvbk5hbWU6ICcnLFxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgbmFtZSBvZiBjdXJyZW50IHBsYXlpbmcgYW5pbWF0aW9uLlxuICAgICAgICAgKiAhI3poIOW9k+WJjeaSreaUvueahOWKqOeUu+WQjeensOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gYW5pbWF0aW9uTmFtZVxuICAgICAgICAgKi9cbiAgICAgICAgYW5pbWF0aW9uTmFtZToge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYW5pbWF0aW9uTmFtZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYW5pbWF0aW9uTmFtZSA9IHZhbHVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBfZGVmYXVsdEFybWF0dXJlSW5kZXhcbiAgICAgICAgICovXG4gICAgICAgIF9kZWZhdWx0QXJtYXR1cmVJbmRleDoge1xuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgICAgIG5vdGlmeSAoKSB7XG4gICAgICAgICAgICAgICAgbGV0IGFybWF0dXJlTmFtZSA9ICcnO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRyYWdvbkFzc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBhcm1hdHVyZXNFbnVtO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kcmFnb25Bc3NldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJtYXR1cmVzRW51bSA9IHRoaXMuZHJhZ29uQXNzZXQuZ2V0QXJtYXR1cmVFbnVtKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhcm1hdHVyZXNFbnVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2MuZXJyb3JJRCg3NDAwLCB0aGlzLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgYXJtYXR1cmVOYW1lID0gYXJtYXR1cmVzRW51bVt0aGlzLl9kZWZhdWx0QXJtYXR1cmVJbmRleF07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGFybWF0dXJlTmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXJtYXR1cmVOYW1lID0gYXJtYXR1cmVOYW1lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2MuZXJyb3JJRCg3NDAxLCB0aGlzLm5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBEZWZhdWx0QXJtYXR1cmVzRW51bSxcbiAgICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgICBlZGl0b3JPbmx5OiB0cnVlLFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogXCJBcm1hdHVyZVwiLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5kcmFnb25fYm9uZXMuYXJtYXR1cmVfbmFtZSdcbiAgICAgICAgfSxcblxuICAgICAgICAvLyB2YWx1ZSBvZiAwIHJlcHJlc2VudHMgbm8gYW5pbWF0aW9uXG4gICAgICAgIF9hbmltYXRpb25JbmRleDoge1xuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgICAgIG5vdGlmeSAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2FuaW1hdGlvbkluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uTmFtZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IGFuaW1zRW51bTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kcmFnb25Bc3NldCkge1xuICAgICAgICAgICAgICAgICAgICBhbmltc0VudW0gPSB0aGlzLmRyYWdvbkFzc2V0LmdldEFuaW1zRW51bSh0aGlzLmFybWF0dXJlTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCFhbmltc0VudW0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBhbmltTmFtZSA9IGFuaW1zRW51bVt0aGlzLl9hbmltYXRpb25JbmRleF07XG4gICAgICAgICAgICAgICAgaWYgKGFuaW1OYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGF5QW5pbWF0aW9uKGFuaW1OYW1lLCB0aGlzLnBsYXlUaW1lcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDc0MDIsIHRoaXMubmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6IERlZmF1bHRBbmltc0VudW0sXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgICAgICAgZWRpdG9yT25seTogdHJ1ZSxcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAnQW5pbWF0aW9uJyxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuZHJhZ29uX2JvbmVzLmFuaW1hdGlvbl9uYW1lJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFJlY29yZCBwcmUgY2FjaGUgbW9kZS5cbiAgICAgICAgX3ByZUNhY2hlTW9kZTogLTEsXG4gICAgICAgIF9jYWNoZU1vZGU6IEFuaW1hdGlvbkNhY2hlTW9kZS5SRUFMVElNRSxcbiAgICAgICAgX2RlZmF1bHRDYWNoZU1vZGU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IDAsXG4gICAgICAgICAgICB0eXBlOiBBbmltYXRpb25DYWNoZU1vZGUsXG4gICAgICAgICAgICBub3RpZnkgKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uQ2FjaGVNb2RlKHRoaXMuX2RlZmF1bHRDYWNoZU1vZGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVkaXRvck9ubHk6IHRydWUsXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogXCJBbmltYXRpb24gQ2FjaGUgTW9kZVwiLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5kcmFnb25fYm9uZXMuYW5pbWF0aW9uX2NhY2hlX21vZGUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIHRpbWUgc2NhbGUgb2YgdGhpcyBhcm1hdHVyZS5cbiAgICAgICAgICogISN6aCDlvZPliY3pqqjpqrzkuK3miYDmnInliqjnlLvnmoTml7bpl7TnvKnmlL7njofjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHRpbWVTY2FsZVxuICAgICAgICAgKiBAZGVmYXVsdCAxXG4gICAgICAgICAqL1xuICAgICAgICB0aW1lU2NhbGU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IDEsXG4gICAgICAgICAgICBub3RpZnkgKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9hcm1hdHVyZSAmJiAhdGhpcy5pc0FuaW1hdGlvbkNhY2hlZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FybWF0dXJlLmFuaW1hdGlvbi50aW1lU2NhbGUgPSB0aGlzLnRpbWVTY2FsZTtcbiAgICAgICAgICAgICAgICB9ICBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmRyYWdvbl9ib25lcy50aW1lX3NjYWxlJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBwbGF5IHRpbWVzIG9mIHRoZSBkZWZhdWx0IGFuaW1hdGlvbi5cbiAgICAgICAgICogICAgICAtMSBtZWFucyB1c2luZyB0aGUgdmFsdWUgb2YgY29uZmlnIGZpbGU7XG4gICAgICAgICAqICAgICAgMCBtZWFucyByZXBlYXQgZm9yIGV2ZXJcbiAgICAgICAgICogICAgICA+MCBtZWFucyByZXBlYXQgdGltZXNcbiAgICAgICAgICogISN6aCDmkq3mlL7pu5jorqTliqjnlLvnmoTlvqrnjq/mrKHmlbBcbiAgICAgICAgICogICAgICAtMSDooajnpLrkvb/nlKjphY3nva7mlofku7bkuK3nmoTpu5jorqTlgLw7XG4gICAgICAgICAqICAgICAgMCDooajnpLrml6DpmZDlvqrnjq9cbiAgICAgICAgICogICAgICA+MCDooajnpLrlvqrnjq/mrKHmlbBcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHBsYXlUaW1lc1xuICAgICAgICAgKiBAZGVmYXVsdCAtMVxuICAgICAgICAgKi9cbiAgICAgICAgcGxheVRpbWVzOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAtMSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuZHJhZ29uX2JvbmVzLnBsYXlfdGltZXMnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gSW5kaWNhdGVzIHdoZXRoZXIgdG8gZW5hYmxlIHByZW11bHRpcGxpZWQgYWxwaGEuXG4gICAgICAgICAqIFlvdSBzaG91bGQgZGlzYWJsZSB0aGlzIG9wdGlvbiB3aGVuIGltYWdlJ3MgdHJhbnNwYXJlbnQgYXJlYSBhcHBlYXJzIHRvIGhhdmUgb3BhcXVlIHBpeGVscyxcbiAgICAgICAgICogb3IgZW5hYmxlIHRoaXMgb3B0aW9uIHdoZW4gaW1hZ2UncyBoYWxmIHRyYW5zcGFyZW50IGFyZWEgYXBwZWFycyB0byBiZSBkYXJrZW4uXG4gICAgICAgICAqICEjemgg5piv5ZCm5ZCv55So6LS05Zu+6aKE5LmY44CCXG4gICAgICAgICAqIOW9k+WbvueJh+eahOmAj+aYjuWMuuWfn+WHuueOsOiJsuWdl+aXtumcgOimgeWFs+mXreivpemAiemhue+8jOW9k+WbvueJh+eahOWNiumAj+aYjuWMuuWfn+minOiJsuWPmOm7keaXtumcgOimgeWQr+eUqOivpemAiemhueOAglxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IHByZW11bHRpcGxpZWRBbHBoYVxuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgcHJlbXVsdGlwbGllZEFscGhhOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuc2tlbGV0b24ucHJlbXVsdGlwbGllZEFscGhhJ1xuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gSW5kaWNhdGVzIHdoZXRoZXIgb3BlbiBkZWJ1ZyBib25lcy5cbiAgICAgICAgICogISN6aCDmmK/lkKbmmL7npLogYm9uZSDnmoQgZGVidWcg5L+h5oGv44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZGVidWdCb25lc1xuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgZGVidWdCb25lczoge1xuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgICBub3RpZnkgKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZURlYnVnRHJhdygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuZHJhZ29uX2JvbmVzLmRlYnVnX2JvbmVzJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIEVuYWJsZWQgYmF0Y2ggbW9kZWwsIGlmIHNrZWxldG9uIGlzIGNvbXBsZXgsIGRvIG5vdCBlbmFibGUgYmF0Y2gsIG9yIHdpbGwgbG93ZXIgcGVyZm9ybWFuY2UuXG4gICAgICAgICAqICEjemgg5byA5ZCv5ZCI5om577yM5aaC5p6c5riy5p+T5aSn6YeP55u45ZCM57q555CG77yM5LiU57uT5p6E566A5Y2V55qE6aqo6aq85Yqo55S777yM5byA5ZCv5ZCI5om55Y+v5Lul6ZmN5L2OZHJhd2NhbGzvvIzlkKbliJnor7fkuI3opoHlvIDlkK/vvIxjcHXmtojogJfkvJrkuIrljYfjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBlbmFibGVCYXRjaFxuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgZW5hYmxlQmF0Y2g6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgICAgbm90aWZ5ICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVCYXRjaCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuZHJhZ29uX2JvbmVzLmVuYWJsZWRfYmF0Y2gnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gRHJhZ29uQm9uZXMgZGF0YSBzdG9yZSBrZXkuXG4gICAgICAgIF9hcm1hdHVyZUtleTogXCJcIixcblxuICAgICAgICAvLyBCZWxvdyBwcm9wZXJ0aWVzIHdpbGwgZWZmZWN0IHdoZW4gY2FjaGUgbW9kZSBpcyBTSEFSRURfQ0FDSEUgb3IgUFJJVkFURV9DQUNIRS5cbiAgICAgICAgLy8gYWNjdW11bGF0ZSB0aW1lXG4gICAgICAgIF9hY2NUaW1lOiAwLFxuICAgICAgICAvLyBQbGF5IHRpbWVzIGNvdW50ZXJcbiAgICAgICAgX3BsYXlDb3VudDogMCxcbiAgICAgICAgLy8gRnJhbWUgY2FjaGVcbiAgICAgICAgX2ZyYW1lQ2FjaGU6IG51bGwsXG4gICAgICAgIC8vIEN1ciBmcmFtZVxuICAgICAgICBfY3VyRnJhbWU6IG51bGwsXG4gICAgICAgIC8vIFBsYXlpbmcgZmxhZ1xuICAgICAgICBfcGxheWluZzogZmFsc2UsXG4gICAgICAgIC8vIEFybWF0dXJlIGNhY2hlXG4gICAgICAgIF9hcm1hdHVyZUNhY2hlOiBudWxsLFxuICAgIH0sXG5cbiAgICBjdG9yICgpIHtcbiAgICAgICAgLy8gUHJvcGVydHkgX21hdGVyaWFsQ2FjaGUgVXNlIHRvIGNhY2hlIG1hdGVyaWFsLHNpbmNlIGRyYWdvbkJvbmVzIG1heSB1c2UgbXVsdGlwbGUgdGV4dHVyZSxcbiAgICAgICAgLy8gaXQgd2lsbCBjbG9uZSBmcm9tIHRoZSAnX21hdGVyaWFsJyBwcm9wZXJ0eSxpZiB0aGUgZHJhZ29uYm9uZXMgb25seSBoYXZlIG9uZSB0ZXh0dXJlLFxuICAgICAgICAvLyBpdCB3aWxsIGp1c3QgdXNlIHRoZSBfbWF0ZXJpYWwsd29uJ3QgY2xvbmUgaXQuXG4gICAgICAgIC8vIFNvIGlmIGludm9rZSBnZXRNYXRlcmlhbCxpdCBvbmx5IHJldHVybiBfbWF0ZXJpYWwsaWYgeW91IHdhbnQgdG8gY2hhbmdlIGFsbCBtYXRlcmlhbENhY2hlLFxuICAgICAgICAvLyB5b3UgY2FuIGNoYW5nZSBtYXRlcmlhbENhY2hlIGRpcmVjdGx5LlxuICAgICAgICB0aGlzLl9ldmVudFRhcmdldCA9IG5ldyBFdmVudFRhcmdldCgpO1xuICAgICAgICB0aGlzLl9tYXRlcmlhbENhY2hlID0ge307XG4gICAgICAgIHRoaXMuX2luaXRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmF0dGFjaFV0aWwgPSBuZXcgQXR0YWNoVXRpbCgpO1xuICAgICAgICB0aGlzLl9mYWN0b3J5ID0gZHJhZ29uQm9uZXMuQ0NGYWN0b3J5LmdldEluc3RhbmNlKCk7XG4gICAgfSxcblxuICAgIG9uTG9hZCAoKSB7XG4gICAgICAgIC8vIEFkYXB0IHRvIG9sZCBjb2RlLHJlbW92ZSB1bnVzZSBjaGlsZCB3aGljaCBpcyBjcmVhdGVkIGJ5IG9sZCBjb2RlLlxuICAgICAgICAvLyBUaGlzIGxvZ2ljIGNhbiBiZSByZW1vdmUgYWZ0ZXIgMi4yIG9yIGxhdGVyLlxuICAgICAgICBsZXQgY2hpbGRyZW4gPSB0aGlzLm5vZGUuY2hpbGRyZW47XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBuID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGxldCBwb3MgPSBjaGlsZC5fbmFtZSAmJiBjaGlsZC5fbmFtZS5zZWFyY2goJ0NISUxEX0FSTUFUVVJFLScpO1xuICAgICAgICAgICAgaWYgKHBvcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGNoaWxkLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBpZiBjaGFuZ2UgdXNlIGJhdGNoIG1vZGUsIGp1c3QgY2xlYXIgbWF0ZXJpYWwgY2FjaGVcbiAgICBfdXBkYXRlQmF0Y2ggKCkge1xuICAgICAgICBsZXQgYmFzZU1hdGVyaWFsID0gdGhpcy5nZXRNYXRlcmlhbCgwKTtcbiAgICAgICAgaWYgKGJhc2VNYXRlcmlhbCkge1xuICAgICAgICAgICAgYmFzZU1hdGVyaWFsLmRlZmluZSgnQ0NfVVNFX01PREVMJywgIXRoaXMuZW5hYmxlQmF0Y2gpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX21hdGVyaWFsQ2FjaGUgPSB7fTtcbiAgICB9LFxuXG4gICAgLy8gb3ZlcnJpZGUgYmFzZSBjbGFzcyBfdXBkYXRlTWF0ZXJpYWwgdG8gc2V0IGRlZmluZSB2YWx1ZSBhbmQgY2xlYXIgbWF0ZXJpYWwgY2FjaGVcbiAgICBfdXBkYXRlTWF0ZXJpYWwgKCkge1xuICAgICAgICBsZXQgYmFzZU1hdGVyaWFsID0gdGhpcy5nZXRNYXRlcmlhbCgwKTtcbiAgICAgICAgaWYgKGJhc2VNYXRlcmlhbCkge1xuICAgICAgICAgICAgYmFzZU1hdGVyaWFsLmRlZmluZSgnQ0NfVVNFX01PREVMJywgIXRoaXMuZW5hYmxlQmF0Y2gpO1xuICAgICAgICAgICAgYmFzZU1hdGVyaWFsLmRlZmluZSgnVVNFX1RFWFRVUkUnLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9tYXRlcmlhbENhY2hlID0ge307XG4gICAgfSxcblxuICAgIC8vIG92ZXJyaWRlIGJhc2UgY2xhc3MgZGlzYWJsZVJlbmRlciB0byBjbGVhciBwb3N0IHJlbmRlciBmbGFnXG4gICAgZGlzYWJsZVJlbmRlciAoKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIHRoaXMubm9kZS5fcmVuZGVyRmxhZyAmPSB+RkxBR19QT1NUX1JFTkRFUjtcbiAgICB9LFxuXG4gICAgLy8gb3ZlcnJpZGUgYmFzZSBjbGFzcyBkaXNhYmxlUmVuZGVyIHRvIGFkZCBwb3N0IHJlbmRlciBmbGFnXG4gICAgbWFya0ZvclJlbmRlciAoZW5hYmxlKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKGVuYWJsZSk7XG4gICAgICAgIGlmIChlbmFibGUpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5fcmVuZGVyRmxhZyB8PSBGTEFHX1BPU1RfUkVOREVSO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ub2RlLl9yZW5kZXJGbGFnICY9IH5GTEFHX1BPU1RfUkVOREVSO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF92YWxpZGF0ZVJlbmRlciAoKSB7XG4gICAgICAgIGxldCB0ZXh0dXJlID0gdGhpcy5kcmFnb25BdGxhc0Fzc2V0ICYmIHRoaXMuZHJhZ29uQXRsYXNBc3NldC50ZXh0dXJlO1xuICAgICAgICBpZiAoIXRleHR1cmUgfHwgIXRleHR1cmUubG9hZGVkKSB7XG4gICAgICAgICAgICB0aGlzLmRpc2FibGVSZW5kZXIoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgIH0sXG5cbiAgICBfX3ByZWxvYWQgKCkge1xuICAgICAgICB0aGlzLl9pbml0KCk7XG4gICAgfSxcblxuICAgIF9pbml0ICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2luaXRlZCkgcmV0dXJuO1xuICAgICAgICB0aGlzLl9pbml0ZWQgPSB0cnVlO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5fcmVzZXRBc3NlbWJsZXIoKTtcbiAgICAgICAgdGhpcy5fYWN0aXZhdGVNYXRlcmlhbCgpO1xuICAgICAgICB0aGlzLl9wYXJzZURyYWdvbkF0bGFzQXNzZXQoKTtcbiAgICAgICAgdGhpcy5fcmVmcmVzaCgpO1xuXG4gICAgICAgIGxldCBjaGlsZHJlbiA9IHRoaXMubm9kZS5jaGlsZHJlbjtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIG4gPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgaWYgKGNoaWxkICYmIGNoaWxkLl9uYW1lID09PSBcIkRFQlVHX0RSQVdfTk9ERVwiKSB7XG4gICAgICAgICAgICAgICAgY2hpbGQuZGVzdHJveSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3VwZGF0ZURlYnVnRHJhdygpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogVGhlIGtleSBvZiBkcmFnb25ib25lcyBjYWNoZSBkYXRhLCB3aGljaCBpcyByZWdhcmQgYXMgJ2RyYWdvbmJvbmVzTmFtZScsIHdoZW4geW91IHdhbnQgdG8gY2hhbmdlIGRyYWdvbmJvbmVzIGNsb3RoLlxuICAgICAqICEjemggXG4gICAgICog57yT5a2Y6b6Z6aqo5pWw5o2u55qEa2V55YC877yM5o2i6KOF55qE5pe25Lya5L2/55So5Yiw6K+l5YC877yM5L2c5Li6ZHJhZ29uYm9uZXNOYW1l5L2/55SoXG4gICAgICogQG1ldGhvZCBnZXRBcm1hdHVyZUtleVxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGxldCBmYWN0b3J5ID0gZHJhZ29uQm9uZXMuQ0NGYWN0b3J5LmdldEluc3RhbmNlKCk7XG4gICAgICogbGV0IG5lZWRDaGFuZ2VTbG90ID0gbmVlZENoYW5nZUFybWF0dXJlLmFybWF0dXJlKCkuZ2V0U2xvdChcImNoYW5nZVNsb3ROYW1lXCIpO1xuICAgICAqIGZhY3RvcnkucmVwbGFjZVNsb3REaXNwbGF5KHRvQ2hhbmdlQXJtYXR1cmUuZ2V0QXJtYXR1cmVLZXkoKSwgXCJhcm1hdHVyZU5hbWVcIiwgXCJzbG90TmFtZVwiLCBcImRpc3BsYXlOYW1lXCIsIG5lZWRDaGFuZ2VTbG90KTtcbiAgICAgKi9cbiAgICBnZXRBcm1hdHVyZUtleSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcm1hdHVyZUtleTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEl0J3MgYmVzdCB0byBzZXQgY2FjaGUgbW9kZSBiZWZvcmUgc2V0IHByb3BlcnR5ICdkcmFnb25Bc3NldCcsIG9yIHdpbGwgd2FzdGUgc29tZSBjcHUgdGltZS5cbiAgICAgKiBJZiBzZXQgdGhlIG1vZGUgaW4gZWRpdG9yLCB0aGVuIG5vIG5lZWQgdG8gd29ycnkgYWJvdXQgb3JkZXIgcHJvYmxlbS5cbiAgICAgKiAhI3poIFxuICAgICAqIOiLpeaDs+WIh+aNoua4suafk+aooeW8j++8jOacgOWlveWcqOiuvue9ridkcmFnb25Bc3NldCfkuYvliY3vvIzlhYjorr7nva7lpb3muLLmn5PmqKHlvI/vvIzlkKbliJnmnInov5DooYzml7blvIDplIDjgIJcbiAgICAgKiDoi6XlnKjnvJbovpHkuK3orr7nva7muLLmn5PmqKHlvI/vvIzliJnml6DpnIDmi4Xlv4Porr7nva7mrKHluo/nmoTpl67popjjgIJcbiAgICAgKiBcbiAgICAgKiBAbWV0aG9kIHNldEFuaW1hdGlvbkNhY2hlTW9kZVxuICAgICAqIEBwYXJhbSB7QW5pbWF0aW9uQ2FjaGVNb2RlfSBjYWNoZU1vZGVcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGFybWF0dXJlRGlzcGxheS5zZXRBbmltYXRpb25DYWNoZU1vZGUoZHJhZ29uQm9uZXMuQXJtYXR1cmVEaXNwbGF5LkFuaW1hdGlvbkNhY2hlTW9kZS5TSEFSRURfQ0FDSEUpO1xuICAgICAqL1xuICAgIHNldEFuaW1hdGlvbkNhY2hlTW9kZSAoY2FjaGVNb2RlKSB7XG4gICAgICAgIGlmICh0aGlzLl9wcmVDYWNoZU1vZGUgIT09IGNhY2hlTW9kZSkge1xuICAgICAgICAgICAgdGhpcy5fY2FjaGVNb2RlID0gY2FjaGVNb2RlO1xuICAgICAgICAgICAgdGhpcy5fYnVpbGRBcm1hdHVyZSgpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBcbiAgICAvKipcbiAgICAgKiAhI2VuIFdoZXRoZXIgaW4gY2FjaGVkIG1vZGUuXG4gICAgICogISN6aCDlvZPliY3mmK/lkKblpITkuo7nvJPlrZjmqKHlvI/jgIJcbiAgICAgKiBAbWV0aG9kIGlzQW5pbWF0aW9uQ2FjaGVkXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpc0FuaW1hdGlvbkNhY2hlZCAoKSB7XG4gICAgICAgIGlmIChDQ19FRElUT1IpIHJldHVybiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlTW9kZSAhPT0gQW5pbWF0aW9uQ2FjaGVNb2RlLlJFQUxUSU1FO1xuICAgIH0sXG5cbiAgICBvbkVuYWJsZSAoKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIC8vIElmIGNhY2hlIG1vZGUgaXMgY2FjaGUsIG5vIG5lZWQgdG8gdXBkYXRlIGJ5IGRyYWdvbmJvbmVzIGxpYnJhcnkuXG4gICAgICAgIGlmICh0aGlzLl9hcm1hdHVyZSAmJiAhdGhpcy5pc0FuaW1hdGlvbkNhY2hlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLl9mYWN0b3J5Ll9kcmFnb25Cb25lcy5jbG9jay5hZGQodGhpcy5fYXJtYXR1cmUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uRGlzYWJsZSAoKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIC8vIElmIGNhY2hlIG1vZGUgaXMgY2FjaGUsIG5vIG5lZWQgdG8gdXBkYXRlIGJ5IGRyYWdvbmJvbmVzIGxpYnJhcnkuXG4gICAgICAgIGlmICh0aGlzLl9hcm1hdHVyZSAmJiAhdGhpcy5pc0FuaW1hdGlvbkNhY2hlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLl9mYWN0b3J5Ll9kcmFnb25Cb25lcy5jbG9jay5yZW1vdmUodGhpcy5fYXJtYXR1cmUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9lbWl0Q2FjaGVDb21wbGV0ZUV2ZW50ICgpIHtcbiAgICAgICAgLy8gQW5pbWF0aW9uIGxvb3AgY29tcGxldGUsIHRoZSBldmVudCBkaWZmcmVudCBmcm9tIGRyYWdvbmJvbmVzIGlubmVyIGV2ZW50LFxuICAgICAgICAvLyBJdCBoYXMgbm8gZXZlbnQgb2JqZWN0LlxuICAgICAgICB0aGlzLl9ldmVudFRhcmdldC5lbWl0KGRyYWdvbkJvbmVzLkV2ZW50T2JqZWN0LkxPT1BfQ09NUExFVEUpO1xuXG4gICAgICAgIC8vIEFuaW1hdGlvbiBjb21wbGV0ZSB0aGUgZXZlbnQgZGlmZnJlbnQgZnJvbSBkcmFnb25ib25lcyBpbm5lciBldmVudCxcbiAgICAgICAgLy8gSXQgaGFzIG5vIGV2ZW50IG9iamVjdC5cbiAgICAgICAgdGhpcy5fZXZlbnRUYXJnZXQuZW1pdChkcmFnb25Cb25lcy5FdmVudE9iamVjdC5DT01QTEVURSk7XG4gICAgfSxcblxuICAgIHVwZGF0ZSAoZHQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQW5pbWF0aW9uQ2FjaGVkKCkpIHJldHVybjtcbiAgICAgICAgaWYgKCF0aGlzLl9mcmFtZUNhY2hlKSByZXR1cm47XG5cbiAgICAgICAgbGV0IGZyYW1lQ2FjaGUgPSB0aGlzLl9mcmFtZUNhY2hlO1xuICAgICAgICBpZiAoIWZyYW1lQ2FjaGUuaXNJbml0ZWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBsZXQgZnJhbWVzID0gZnJhbWVDYWNoZS5mcmFtZXM7XG4gICAgICAgIGlmICghdGhpcy5fcGxheWluZykge1xuICAgICAgICAgICAgaWYgKGZyYW1lQ2FjaGUuaXNJbnZhbGlkKCkpIHtcbiAgICAgICAgICAgICAgICBmcmFtZUNhY2hlLnVwZGF0ZVRvRnJhbWUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJGcmFtZSA9IGZyYW1lc1tmcmFtZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZnJhbWVUaW1lID0gQXJtYXR1cmVDYWNoZS5GcmFtZVRpbWU7XG5cbiAgICAgICAgLy8gQW5pbWF0aW9uIFN0YXJ0LCB0aGUgZXZlbnQgZGlmZnJlbnQgZnJvbSBkcmFnb25ib25lcyBpbm5lciBldmVudCxcbiAgICAgICAgLy8gSXQgaGFzIG5vIGV2ZW50IG9iamVjdC5cbiAgICAgICAgaWYgKHRoaXMuX2FjY1RpbWUgPT0gMCAmJiB0aGlzLl9wbGF5Q291bnQgPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRUYXJnZXQuZW1pdChkcmFnb25Cb25lcy5FdmVudE9iamVjdC5TVEFSVCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZ2xvYmFsVGltZVNjYWxlID0gZHJhZ29uQm9uZXMudGltZVNjYWxlO1xuICAgICAgICB0aGlzLl9hY2NUaW1lICs9IGR0ICogdGhpcy50aW1lU2NhbGUgKiBnbG9iYWxUaW1lU2NhbGU7XG4gICAgICAgIGxldCBmcmFtZUlkeCA9IE1hdGguZmxvb3IodGhpcy5fYWNjVGltZSAvIGZyYW1lVGltZSk7XG4gICAgICAgIGlmICghZnJhbWVDYWNoZS5pc0NvbXBsZXRlZCkge1xuICAgICAgICAgICAgZnJhbWVDYWNoZS51cGRhdGVUb0ZyYW1lKGZyYW1lSWR4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmcmFtZUNhY2hlLmlzQ29tcGxldGVkICYmIGZyYW1lSWR4ID49IGZyYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuX3BsYXlDb3VudCArKztcbiAgICAgICAgICAgIGlmICgodGhpcy5wbGF5VGltZXMgPiAwICYmIHRoaXMuX3BsYXlDb3VudCA+PSB0aGlzLnBsYXlUaW1lcykpIHtcbiAgICAgICAgICAgICAgICAvLyBzZXQgZnJhbWUgdG8gZW5kIGZyYW1lLlxuICAgICAgICAgICAgICAgIHRoaXMuX2N1ckZyYW1lID0gZnJhbWVzW2ZyYW1lcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICB0aGlzLl9hY2NUaW1lID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLl9wbGF5aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGxheUNvdW50ID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbWl0Q2FjaGVDb21wbGV0ZUV2ZW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fYWNjVGltZSA9IDA7XG4gICAgICAgICAgICBmcmFtZUlkeCA9IDA7XG4gICAgICAgICAgICB0aGlzLl9lbWl0Q2FjaGVDb21wbGV0ZUV2ZW50KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9jdXJGcmFtZSA9IGZyYW1lc1tmcmFtZUlkeF07XG4gICAgfSxcblxuICAgIG9uRGVzdHJveSAoKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIHRoaXMuX2luaXRlZCA9IGZhbHNlO1xuXG4gICAgICAgIGlmICghQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fY2FjaGVNb2RlID09PSBBbmltYXRpb25DYWNoZU1vZGUuUFJJVkFURV9DQUNIRSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2FybWF0dXJlQ2FjaGUuZGlzcG9zZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2FybWF0dXJlQ2FjaGUgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuX2FybWF0dXJlID0gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fY2FjaGVNb2RlID09PSBBbmltYXRpb25DYWNoZU1vZGUuU0hBUkVEX0NBQ0hFKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXJtYXR1cmVDYWNoZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXJtYXR1cmUgPSBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9hcm1hdHVyZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2FybWF0dXJlLmRpc3Bvc2UoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9hcm1hdHVyZSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fYXJtYXR1cmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hcm1hdHVyZS5kaXNwb3NlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXJtYXR1cmUgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91cGRhdGVEZWJ1Z0RyYXcgKCkge1xuICAgICAgICBpZiAodGhpcy5kZWJ1Z0JvbmVzKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2RlYnVnRHJhdykge1xuICAgICAgICAgICAgICAgIGxldCBkZWJ1Z0RyYXdOb2RlID0gbmV3IGNjLlByaXZhdGVOb2RlKCk7XG4gICAgICAgICAgICAgICAgZGVidWdEcmF3Tm9kZS5uYW1lID0gJ0RFQlVHX0RSQVdfTk9ERSc7XG4gICAgICAgICAgICAgICAgbGV0IGRlYnVnRHJhdyA9IGRlYnVnRHJhd05vZGUuYWRkQ29tcG9uZW50KEdyYXBoaWNzKTtcbiAgICAgICAgICAgICAgICBkZWJ1Z0RyYXcubGluZVdpZHRoID0gMTtcbiAgICAgICAgICAgICAgICBkZWJ1Z0RyYXcuc3Ryb2tlQ29sb3IgPSBjYy5jb2xvcigyNTUsIDAsIDAsIDI1NSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5fZGVidWdEcmF3ID0gZGVidWdEcmF3O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9kZWJ1Z0RyYXcubm9kZS5wYXJlbnQgPSB0aGlzLm5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5fZGVidWdEcmF3KSB7XG4gICAgICAgICAgICB0aGlzLl9kZWJ1Z0RyYXcubm9kZS5wYXJlbnQgPSBudWxsO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9idWlsZEFybWF0dXJlICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRyYWdvbkFzc2V0IHx8ICF0aGlzLmRyYWdvbkF0bGFzQXNzZXQgfHwgIXRoaXMuYXJtYXR1cmVOYW1lKSByZXR1cm47XG5cbiAgICAgICAgLy8gU3dpdGNoIEFzc2V0IG9yIEF0bGFzIG9yIGNhY2hlTW9kZSB3aWxsIHJlYnVpbGQgYXJtYXR1cmUuXG4gICAgICAgIGlmICh0aGlzLl9hcm1hdHVyZSkge1xuICAgICAgICAgICAgLy8gZGlzcG9zZSBwcmUgYnVpbGQgYXJtYXR1cmVcbiAgICAgICAgICAgIGlmICghQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3ByZUNhY2hlTW9kZSA9PT0gQW5pbWF0aW9uQ2FjaGVNb2RlLlBSSVZBVEVfQ0FDSEUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXJtYXR1cmVDYWNoZS5kaXNwb3NlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9wcmVDYWNoZU1vZGUgPT09IEFuaW1hdGlvbkNhY2hlTW9kZS5SRUFMVElNRSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hcm1hdHVyZS5kaXNwb3NlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hcm1hdHVyZS5kaXNwb3NlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2FybWF0dXJlQ2FjaGUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fYXJtYXR1cmUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fZGlzcGxheVByb3h5ID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX2ZyYW1lQ2FjaGUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fY3VyRnJhbWUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fcGxheWluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5fcHJlQ2FjaGVNb2RlID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fY2FjaGVNb2RlID09PSBBbmltYXRpb25DYWNoZU1vZGUuU0hBUkVEX0NBQ0hFKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXJtYXR1cmVDYWNoZSA9IEFybWF0dXJlQ2FjaGUuc2hhcmVkQ2FjaGU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2NhY2hlTW9kZSA9PT0gQW5pbWF0aW9uQ2FjaGVNb2RlLlBSSVZBVEVfQ0FDSEUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hcm1hdHVyZUNhY2hlID0gbmV3IEFybWF0dXJlQ2FjaGU7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXJtYXR1cmVDYWNoZS5lbmFibGVQcml2YXRlTW9kZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGF0bGFzVVVJRCA9IHRoaXMuZHJhZ29uQXRsYXNBc3NldC5fdXVpZDtcbiAgICAgICAgdGhpcy5fYXJtYXR1cmVLZXkgPSB0aGlzLmRyYWdvbkFzc2V0LmluaXQodGhpcy5fZmFjdG9yeSwgYXRsYXNVVUlEKTtcblxuICAgICAgICBpZiAodGhpcy5pc0FuaW1hdGlvbkNhY2hlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLl9hcm1hdHVyZSA9IHRoaXMuX2FybWF0dXJlQ2FjaGUuZ2V0QXJtYXR1cmVDYWNoZSh0aGlzLmFybWF0dXJlTmFtZSwgdGhpcy5fYXJtYXR1cmVLZXksIGF0bGFzVVVJRCk7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2FybWF0dXJlKSB7XG4gICAgICAgICAgICAgICAgLy8gQ2FjaGUgZmFpbCxzd2l0aCB0byBSRUFMVElNRSBjYWNoZSBtb2RlLlxuICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlTW9kZSA9IEFuaW1hdGlvbkNhY2hlTW9kZS5SRUFMVElNRTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH0gXG4gICAgICAgIFxuICAgICAgICB0aGlzLl9wcmVDYWNoZU1vZGUgPSB0aGlzLl9jYWNoZU1vZGU7XG4gICAgICAgIGlmIChDQ19FRElUT1IgfHwgdGhpcy5fY2FjaGVNb2RlID09PSBBbmltYXRpb25DYWNoZU1vZGUuUkVBTFRJTUUpIHtcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BsYXlQcm94eSA9IHRoaXMuX2ZhY3RvcnkuYnVpbGRBcm1hdHVyZURpc3BsYXkodGhpcy5hcm1hdHVyZU5hbWUsIHRoaXMuX2FybWF0dXJlS2V5LCBcIlwiLCBhdGxhc1VVSUQpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9kaXNwbGF5UHJveHkpIHJldHVybjtcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BsYXlQcm94eS5fY2NOb2RlID0gdGhpcy5ub2RlO1xuICAgICAgICAgICAgdGhpcy5fZGlzcGxheVByb3h5LnNldEV2ZW50VGFyZ2V0KHRoaXMuX2V2ZW50VGFyZ2V0KTtcbiAgICAgICAgICAgIHRoaXMuX2FybWF0dXJlID0gdGhpcy5fZGlzcGxheVByb3h5Ll9hcm1hdHVyZTtcbiAgICAgICAgICAgIHRoaXMuX2FybWF0dXJlLmFuaW1hdGlvbi50aW1lU2NhbGUgPSB0aGlzLnRpbWVTY2FsZTtcbiAgICAgICAgICAgIC8vIElmIGNoYW5nZSBtb2RlIG9yIGFybWF0dXJlLCBhcm1hdHVyZSBtdXN0IGluc2VydCBpbnRvIGNsb2NrLlxuICAgICAgICAgICAgdGhpcy5fZmFjdG9yeS5fZHJhZ29uQm9uZXMuY2xvY2suYWRkKHRoaXMuX2FybWF0dXJlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9jYWNoZU1vZGUgIT09IEFuaW1hdGlvbkNhY2hlTW9kZS5SRUFMVElNRSAmJiB0aGlzLmRlYnVnQm9uZXMpIHtcbiAgICAgICAgICAgIGNjLndhcm4oXCJEZWJ1ZyBib25lcyBpcyBpbnZhbGlkIGluIGNhY2hlZCBtb2RlXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2FybWF0dXJlKSB7XG4gICAgICAgICAgICBsZXQgYXJtYXR1cmVEYXRhID0gdGhpcy5fYXJtYXR1cmUuYXJtYXR1cmVEYXRhO1xuICAgICAgICAgICAgbGV0IGFhYmIgPSBhcm1hdHVyZURhdGEuYWFiYjtcbiAgICAgICAgICAgIHRoaXMubm9kZS5zZXRDb250ZW50U2l6ZShhYWJiLndpZHRoLCBhYWJiLmhlaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl91cGRhdGVCYXRjaCgpO1xuICAgICAgICB0aGlzLmF0dGFjaFV0aWwuaW5pdCh0aGlzKTtcbiAgICAgICAgdGhpcy5hdHRhY2hVdGlsLl9hc3NvY2lhdGVBdHRhY2hlZE5vZGUoKTtcblxuICAgICAgICBpZiAodGhpcy5hbmltYXRpb25OYW1lKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXlBbmltYXRpb24odGhpcy5hbmltYXRpb25OYW1lLCB0aGlzLnBsYXlUaW1lcyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1hcmtGb3JSZW5kZXIodHJ1ZSk7XG4gICAgfSxcblxuICAgIF9wYXJzZURyYWdvbkF0bGFzQXNzZXQgKCkge1xuICAgICAgICBpZiAodGhpcy5kcmFnb25BdGxhc0Fzc2V0KSB7XG4gICAgICAgICAgICB0aGlzLmRyYWdvbkF0bGFzQXNzZXQuaW5pdCh0aGlzLl9mYWN0b3J5KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfcmVmcmVzaCAoKSB7XG4gICAgICAgIHRoaXMuX2J1aWxkQXJtYXR1cmUoKTtcblxuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICAvLyB1cGRhdGUgaW5zcGVjdG9yXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVBcm1hdHVyZUVudW0oKTtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUFuaW1FbnVtKCk7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVDYWNoZU1vZGVFbnVtKCk7XG4gICAgICAgICAgICBFZGl0b3IuVXRpbHMucmVmcmVzaFNlbGVjdGVkSW5zcGVjdG9yKCdub2RlJywgdGhpcy5ub2RlLnV1aWQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91cGRhdGVDYWNoZU1vZGVFbnVtOiBDQ19FRElUT1IgJiYgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fYXJtYXR1cmUgJiYgQXJtYXR1cmVDYWNoZS5jYW5DYWNoZSh0aGlzLl9hcm1hdHVyZSkpIHtcbiAgICAgICAgICAgIHNldEVudW1BdHRyKHRoaXMsICdfZGVmYXVsdENhY2hlTW9kZScsIEFuaW1hdGlvbkNhY2hlTW9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXRFbnVtQXR0cih0aGlzLCAnX2RlZmF1bHRDYWNoZU1vZGUnLCBEZWZhdWx0Q2FjaGVNb2RlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1cGRhdGUgYW5pbWF0aW9uIGxpc3QgZm9yIGVkaXRvclxuICAgIF91cGRhdGVBbmltRW51bTogQ0NfRURJVE9SICYmIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IGFuaW1FbnVtO1xuICAgICAgICBpZiAodGhpcy5kcmFnb25Bc3NldCkge1xuICAgICAgICAgICAgYW5pbUVudW0gPSB0aGlzLmRyYWdvbkFzc2V0LmdldEFuaW1zRW51bSh0aGlzLmFybWF0dXJlTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2hhbmdlIGVudW1cbiAgICAgICAgc2V0RW51bUF0dHIodGhpcywgJ19hbmltYXRpb25JbmRleCcsIGFuaW1FbnVtIHx8IERlZmF1bHRBbmltc0VudW0pO1xuICAgIH0sXG5cbiAgICAvLyB1cGRhdGUgYXJtYXR1cmUgbGlzdCBmb3IgZWRpdG9yXG4gICAgX3VwZGF0ZUFybWF0dXJlRW51bTogQ0NfRURJVE9SICYmIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IGFybWF0dXJlRW51bTtcbiAgICAgICAgaWYgKHRoaXMuZHJhZ29uQXNzZXQpIHtcbiAgICAgICAgICAgIGFybWF0dXJlRW51bSA9IHRoaXMuZHJhZ29uQXNzZXQuZ2V0QXJtYXR1cmVFbnVtKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2hhbmdlIGVudW1cbiAgICAgICAgc2V0RW51bUF0dHIodGhpcywgJ19kZWZhdWx0QXJtYXR1cmVJbmRleCcsIGFybWF0dXJlRW51bSB8fCBEZWZhdWx0QXJtYXR1cmVzRW51bSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBQbGF5IHRoZSBzcGVjaWZpZWQgYW5pbWF0aW9uLlxuICAgICAqIFBhcmFtZXRlciBhbmltTmFtZSBzcGVjaWZ5IHRoZSBhbmltYXRpb24gbmFtZS5cbiAgICAgKiBQYXJhbWV0ZXIgcGxheVRpbWVzIHNwZWNpZnkgdGhlIHJlcGVhdCB0aW1lcyBvZiB0aGUgYW5pbWF0aW9uLlxuICAgICAqIC0xIG1lYW5zIHVzZSB0aGUgdmFsdWUgb2YgdGhlIGNvbmZpZyBmaWxlLlxuICAgICAqIDAgbWVhbnMgcGxheSB0aGUgYW5pbWF0aW9uIGZvciBldmVyLlxuICAgICAqID4wIG1lYW5zIHJlcGVhdCB0aW1lcy5cbiAgICAgKiAhI3poIFxuICAgICAqIOaSreaUvuaMh+WumueahOWKqOeUuy5cbiAgICAgKiBhbmltTmFtZSDmjIflrprmkq3mlL7liqjnlLvnmoTlkI3np7DjgIJcbiAgICAgKiBwbGF5VGltZXMg5oyH5a6a5pKt5pS+5Yqo55S755qE5qyh5pWw44CCXG4gICAgICogLTEg5Li65L2/55So6YWN572u5paH5Lu25Lit55qE5qyh5pWw44CCXG4gICAgICogMCDkuLrml6DpmZDlvqrnjq/mkq3mlL7jgIJcbiAgICAgKiA+MCDkuLrliqjnlLvnmoTph43lpI3mrKHmlbDjgIJcbiAgICAgKiBAbWV0aG9kIHBsYXlBbmltYXRpb25cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYW5pbU5hbWVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcGxheVRpbWVzXG4gICAgICogQHJldHVybiB7ZHJhZ29uQm9uZXMuQW5pbWF0aW9uU3RhdGV9XG4gICAgICovXG4gICAgcGxheUFuaW1hdGlvbiAoYW5pbU5hbWUsIHBsYXlUaW1lcykge1xuICAgICAgICBcbiAgICAgICAgdGhpcy5wbGF5VGltZXMgPSAocGxheVRpbWVzID09PSB1bmRlZmluZWQpID8gLTEgOiBwbGF5VGltZXM7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uTmFtZSA9IGFuaW1OYW1lO1xuXG4gICAgICAgIGlmICh0aGlzLmlzQW5pbWF0aW9uQ2FjaGVkKCkpIHtcbiAgICAgICAgICAgIGxldCBjYWNoZSA9IHRoaXMuX2FybWF0dXJlQ2FjaGUuZ2V0QW5pbWF0aW9uQ2FjaGUodGhpcy5fYXJtYXR1cmVLZXksIGFuaW1OYW1lKTtcbiAgICAgICAgICAgIGlmICghY2FjaGUpIHtcbiAgICAgICAgICAgICAgICBjYWNoZSA9IHRoaXMuX2FybWF0dXJlQ2FjaGUuaW5pdEFuaW1hdGlvbkNhY2hlKHRoaXMuX2FybWF0dXJlS2V5LCBhbmltTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2FjaGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hY2NUaW1lID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLl9wbGF5Q291bnQgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZyYW1lQ2FjaGUgPSBjYWNoZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hdHRhY2hVdGlsLl9oYXNBdHRhY2hlZE5vZGUoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mcmFtZUNhY2hlLmVuYWJsZUNhY2hlQXR0YWNoZWRJbmZvKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2ZyYW1lQ2FjaGUudXBkYXRlVG9GcmFtZSgwKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wbGF5aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJGcmFtZSA9IHRoaXMuX2ZyYW1lQ2FjaGUuZnJhbWVzWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2FybWF0dXJlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FybWF0dXJlLmFuaW1hdGlvbi5wbGF5KGFuaW1OYW1lLCB0aGlzLnBsYXlUaW1lcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFVwZGF0aW5nIGFuIGFuaW1hdGlvbiBjYWNoZSB0byBjYWxjdWxhdGUgYWxsIGZyYW1lIGRhdGEgaW4gdGhlIGFuaW1hdGlvbiBpcyBhIGNvc3QgaW4gXG4gICAgICogcGVyZm9ybWFuY2UgZHVlIHRvIGNhbGN1bGF0aW5nIGFsbCBkYXRhIGluIGEgc2luZ2xlIGZyYW1lLlxuICAgICAqIFRvIHVwZGF0ZSB0aGUgY2FjaGUsIHVzZSB0aGUgaW52YWxpZEFuaW1hdGlvbkNhY2hlIG1ldGhvZCB3aXRoIGhpZ2ggcGVyZm9ybWFuY2UuXG4gICAgICogISN6aFxuICAgICAqIOabtOaWsOafkOS4quWKqOeUu+e8k+WtmCwg6aKE6K6h566X5Yqo55S75Lit5omA5pyJ5bin5pWw5o2u77yM55Sx5LqO5Zyo5Y2V5bin6K6h566X5omA5pyJ5pWw5o2u77yM5omA5Lul6L6D5raI6ICX5oCn6IO944CCXG4gICAgICog6Iul5oOz5pu05paw57yT5a2Y77yM5Y+v5L2/55SoIGludmFsaWRBbmltYXRpb25DYWNoZSDmlrnms5XvvIzlhbfmnInovoPpq5jmgKfog73jgIJcbiAgICAgKiBAbWV0aG9kIHVwZGF0ZUFuaW1hdGlvbkNhY2hlXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGFuaW1OYW1lXG4gICAgICovXG4gICAgdXBkYXRlQW5pbWF0aW9uQ2FjaGUgKGFuaW1OYW1lKSB7XG4gICAgICAgIGlmICghdGhpcy5pc0FuaW1hdGlvbkNhY2hlZCgpKSByZXR1cm47XG4gICAgICAgIHRoaXMuX2FybWF0dXJlQ2FjaGUudXBkYXRlQW5pbWF0aW9uQ2FjaGUodGhpcy5fYXJtYXR1cmVLZXksIGFuaW1OYW1lKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEludmFsaWRhdGVzIHRoZSBhbmltYXRpb24gY2FjaGUsIHdoaWNoIGlzIHRoZW4gcmVjb21wdXRlZCBvbiBlYWNoIGZyYW1lLi5cbiAgICAgKiAhI3poXG4gICAgICog5L2/5Yqo55S757yT5a2Y5aSx5pWI77yM5LmL5ZCO5Lya5Zyo5q+P5bin6YeN5paw6K6h566X44CCXG4gICAgICogQG1ldGhvZCBpbnZhbGlkQW5pbWF0aW9uQ2FjaGVcbiAgICAgKi9cbiAgICBpbnZhbGlkQW5pbWF0aW9uQ2FjaGUgKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNBbmltYXRpb25DYWNoZWQoKSkgcmV0dXJuO1xuICAgICAgICB0aGlzLl9hcm1hdHVyZUNhY2hlLmludmFsaWRBbmltYXRpb25DYWNoZSh0aGlzLl9hcm1hdHVyZUtleSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXQgdGhlIGFsbCBhcm1hdHVyZSBuYW1lcyBpbiB0aGUgRHJhZ29uQm9uZXMgRGF0YS5cbiAgICAgKiAhI3poXG4gICAgICog6I635Y+WIERyYWdvbkJvbmVzIOaVsOaNruS4reaJgOacieeahCBhcm1hdHVyZSDlkI3np7BcbiAgICAgKiBAbWV0aG9kIGdldEFybWF0dXJlTmFtZXNcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAgICovXG4gICAgZ2V0QXJtYXR1cmVOYW1lcyAoKSB7XG4gICAgICAgIGxldCBkcmFnb25Cb25lc0RhdGEgPSB0aGlzLl9mYWN0b3J5LmdldERyYWdvbkJvbmVzRGF0YSh0aGlzLl9hcm1hdHVyZUtleSk7XG4gICAgICAgIHJldHVybiAoZHJhZ29uQm9uZXNEYXRhICYmIGRyYWdvbkJvbmVzRGF0YS5hcm1hdHVyZU5hbWVzKSB8fCBbXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldCB0aGUgYWxsIGFuaW1hdGlvbiBuYW1lcyBvZiBzcGVjaWZpZWQgYXJtYXR1cmUuXG4gICAgICogISN6aFxuICAgICAqIOiOt+WPluaMh+WumueahCBhcm1hdHVyZSDnmoTmiYDmnInliqjnlLvlkI3np7DjgIJcbiAgICAgKiBAbWV0aG9kIGdldEFuaW1hdGlvbk5hbWVzXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGFybWF0dXJlTmFtZVxuICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgKi9cbiAgICBnZXRBbmltYXRpb25OYW1lcyAoYXJtYXR1cmVOYW1lKSB7XG4gICAgICAgIGxldCByZXQgPSBbXTtcbiAgICAgICAgbGV0IGRyYWdvbkJvbmVzRGF0YSA9IHRoaXMuX2ZhY3RvcnkuZ2V0RHJhZ29uQm9uZXNEYXRhKHRoaXMuX2FybWF0dXJlS2V5KTtcbiAgICAgICAgaWYgKGRyYWdvbkJvbmVzRGF0YSkge1xuICAgICAgICAgICAgbGV0IGFybWF0dXJlRGF0YSA9IGRyYWdvbkJvbmVzRGF0YS5nZXRBcm1hdHVyZShhcm1hdHVyZU5hbWUpO1xuICAgICAgICAgICAgaWYgKGFybWF0dXJlRGF0YSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGFuaW1OYW1lIGluIGFybWF0dXJlRGF0YS5hbmltYXRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhcm1hdHVyZURhdGEuYW5pbWF0aW9ucy5oYXNPd25Qcm9wZXJ0eShhbmltTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldC5wdXNoKGFuaW1OYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQWRkIGV2ZW50IGxpc3RlbmVyIGZvciB0aGUgRHJhZ29uQm9uZXMgRXZlbnQsIHRoZSBzYW1lIHRvIGFkZEV2ZW50TGlzdGVuZXIuXG4gICAgICogISN6aFxuICAgICAqIOa3u+WKoCBEcmFnb25Cb25lcyDkuovku7bnm5HlkKzlmajvvIzkuI4gYWRkRXZlbnRMaXN0ZW5lciDkvZznlKjnm7jlkIzjgIJcbiAgICAgKiBAbWV0aG9kIG9uXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGV2ZW50IHR5cGUgdG8gbGlzdGVuIGZvci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciAtIFRoZSBjYWxsYmFjayB0aGF0IHdpbGwgYmUgaW52b2tlZCB3aGVuIHRoZSBldmVudCBpcyBkaXNwYXRjaGVkLlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGxpc3RlbmVyLmV2ZW50IGV2ZW50XG4gICAgICogQHBhcmFtIHtPYmplY3R9IFt0YXJnZXRdIC0gVGhlIHRhcmdldCAodGhpcyBvYmplY3QpIHRvIGludm9rZSB0aGUgY2FsbGJhY2ssIGNhbiBiZSBudWxsXG4gICAgICovXG4gICAgb24gKGV2ZW50VHlwZSwgbGlzdGVuZXIsIHRhcmdldCkge1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBsaXN0ZW5lciwgdGFyZ2V0KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJlbW92ZSB0aGUgZXZlbnQgbGlzdGVuZXIgZm9yIHRoZSBEcmFnb25Cb25lcyBFdmVudCwgdGhlIHNhbWUgdG8gcmVtb3ZlRXZlbnRMaXN0ZW5lci5cbiAgICAgKiAhI3poXG4gICAgICog56e76ZmkIERyYWdvbkJvbmVzIOS6i+S7tuebkeWQrOWZqO+8jOS4jiByZW1vdmVFdmVudExpc3RlbmVyIOS9nOeUqOebuOWQjOOAglxuICAgICAqIEBtZXRob2Qgb2ZmXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGV2ZW50IHR5cGUgdG8gbGlzdGVuIGZvci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbbGlzdGVuZXJdXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFt0YXJnZXRdXG4gICAgICovXG4gICAgb2ZmIChldmVudFR5cGUsIGxpc3RlbmVyLCB0YXJnZXQpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgbGlzdGVuZXIsIHRhcmdldCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBBZGQgRHJhZ29uQm9uZXMgb25lLXRpbWUgZXZlbnQgbGlzdGVuZXIsIHRoZSBjYWxsYmFjayB3aWxsIHJlbW92ZSBpdHNlbGYgYWZ0ZXIgdGhlIGZpcnN0IHRpbWUgaXQgaXMgdHJpZ2dlcmVkLlxuICAgICAqICEjemhcbiAgICAgKiDmt7vliqAgRHJhZ29uQm9uZXMg5LiA5qyh5oCn5LqL5Lu255uR5ZCs5Zmo77yM5Zue6LCD5Lya5Zyo56ys5LiA5pe26Ze06KKr6Kem5Y+R5ZCO5Yig6Zmk6Ieq6Lqr44CCXG4gICAgICogQG1ldGhvZCBvbmNlXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGV2ZW50IHR5cGUgdG8gbGlzdGVuIGZvci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciAtIFRoZSBjYWxsYmFjayB0aGF0IHdpbGwgYmUgaW52b2tlZCB3aGVuIHRoZSBldmVudCBpcyBkaXNwYXRjaGVkLlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGxpc3RlbmVyLmV2ZW50IGV2ZW50XG4gICAgICogQHBhcmFtIHtPYmplY3R9IFt0YXJnZXRdIC0gVGhlIHRhcmdldCAodGhpcyBvYmplY3QpIHRvIGludm9rZSB0aGUgY2FsbGJhY2ssIGNhbiBiZSBudWxsXG4gICAgICovXG4gICAgb25jZSAoZXZlbnRUeXBlLCBsaXN0ZW5lciwgdGFyZ2V0KSB7XG4gICAgICAgIHRoaXMuX2V2ZW50VGFyZ2V0Lm9uY2UoZXZlbnRUeXBlLCBsaXN0ZW5lciwgdGFyZ2V0KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEFkZCBldmVudCBsaXN0ZW5lciBmb3IgdGhlIERyYWdvbkJvbmVzIEV2ZW50LlxuICAgICAqICEjemhcbiAgICAgKiDmt7vliqAgRHJhZ29uQm9uZXMg5LqL5Lu255uR5ZCs5Zmo44CCXG4gICAgICogQG1ldGhvZCBhZGRFdmVudExpc3RlbmVyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGV2ZW50IHR5cGUgdG8gbGlzdGVuIGZvci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciAtIFRoZSBjYWxsYmFjayB0aGF0IHdpbGwgYmUgaW52b2tlZCB3aGVuIHRoZSBldmVudCBpcyBkaXNwYXRjaGVkLlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGxpc3RlbmVyLmV2ZW50IGV2ZW50XG4gICAgICogQHBhcmFtIHtPYmplY3R9IFt0YXJnZXRdIC0gVGhlIHRhcmdldCAodGhpcyBvYmplY3QpIHRvIGludm9rZSB0aGUgY2FsbGJhY2ssIGNhbiBiZSBudWxsXG4gICAgICovXG4gICAgYWRkRXZlbnRMaXN0ZW5lciAoZXZlbnRUeXBlLCBsaXN0ZW5lciwgdGFyZ2V0KSB7XG4gICAgICAgIHRoaXMuX2V2ZW50VGFyZ2V0Lm9uKGV2ZW50VHlwZSwgbGlzdGVuZXIsIHRhcmdldCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZW1vdmUgdGhlIGV2ZW50IGxpc3RlbmVyIGZvciB0aGUgRHJhZ29uQm9uZXMgRXZlbnQuXG4gICAgICogISN6aFxuICAgICAqIOenu+mZpCBEcmFnb25Cb25lcyDkuovku7bnm5HlkKzlmajjgIJcbiAgICAgKiBAbWV0aG9kIHJlbW92ZUV2ZW50TGlzdGVuZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgZXZlbnQgdHlwZSB0byBsaXN0ZW4gZm9yLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtsaXN0ZW5lcl1cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW3RhcmdldF1cbiAgICAgKi9cbiAgICByZW1vdmVFdmVudExpc3RlbmVyIChldmVudFR5cGUsIGxpc3RlbmVyLCB0YXJnZXQpIHtcbiAgICAgICAgdGhpcy5fZXZlbnRUYXJnZXQub2ZmKGV2ZW50VHlwZSwgbGlzdGVuZXIsIHRhcmdldCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBCdWlsZCB0aGUgYXJtYXR1cmUgZm9yIHNwZWNpZmllZCBuYW1lLlxuICAgICAqICEjemhcbiAgICAgKiDmnoTlu7rmjIflrprlkI3np7DnmoQgYXJtYXR1cmUg5a+56LGhXG4gICAgICogQG1ldGhvZCBidWlsZEFybWF0dXJlXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGFybWF0dXJlTmFtZVxuICAgICAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICAgICAqIEByZXR1cm4ge2RyYWdvbkJvbmVzLkFybWF0dXJlRGlzcGxheX1cbiAgICAgKi9cbiAgICBidWlsZEFybWF0dXJlIChhcm1hdHVyZU5hbWUsIG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZhY3RvcnkuY3JlYXRlQXJtYXR1cmVOb2RlKHRoaXMsIGFybWF0dXJlTmFtZSwgbm9kZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXQgdGhlIGN1cnJlbnQgYXJtYXR1cmUgb2JqZWN0IG9mIHRoZSBBcm1hdHVyZURpc3BsYXkuXG4gICAgICogISN6aFxuICAgICAqIOiOt+WPliBBcm1hdHVyZURpc3BsYXkg5b2T5YmN5L2/55So55qEIEFybWF0dXJlIOWvueixoVxuICAgICAqIEBtZXRob2QgYXJtYXR1cmVcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgICAqL1xuICAgIGFybWF0dXJlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FybWF0dXJlO1xuICAgIH0sXG59KTtcblxuLyoqXG4gKiAhI2VuXG4gKiBBbmltYXRpb24gc3RhcnQgcGxheS5cbiAqICEjemhcbiAqIOWKqOeUu+W8gOWni+aSreaUvuOAglxuICpcbiAqIEBldmVudCBkcmFnb25Cb25lcy5FdmVudE9iamVjdC5TVEFSVFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGV2ZW50IHR5cGUgdG8gbGlzdGVuIGZvci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRoYXQgd2lsbCBiZSBpbnZva2VkIHdoZW4gdGhlIGV2ZW50IGlzIGRpc3BhdGNoZWQuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBjYWxsYmFjayBpcyBpZ25vcmVkIGlmIGl0IGlzIGEgZHVwbGljYXRlICh0aGUgY2FsbGJhY2tzIGFyZSB1bmlxdWUpLlxuICogQHBhcmFtIHtkcmFnb25Cb25lcy5FdmVudE9iamVjdH0gW2NhbGxiYWNrLmV2ZW50XVxuICogQHBhcmFtIHtTdHJpbmd9IFtjYWxsYmFjay5ldmVudC50eXBlXVxuICogQHBhcmFtIHtkcmFnb25Cb25lcy5Bcm1hdHVyZX0gW2NhbGxiYWNrLmV2ZW50LmFybWF0dXJlXVxuICogQHBhcmFtIHtkcmFnb25Cb25lcy5BbmltYXRpb25TdGF0ZX0gW2NhbGxiYWNrLmV2ZW50LmFuaW1hdGlvblN0YXRlXVxuICovXG5cbi8qKlxuICogISNlblxuICogQW5pbWF0aW9uIGxvb3AgcGxheSBjb21wbGV0ZSBvbmNlLlxuICogISN6aFxuICog5Yqo55S75b6q546v5pKt5pS+5a6M5oiQ5LiA5qyh44CCXG4gKlxuICogQGV2ZW50IGRyYWdvbkJvbmVzLkV2ZW50T2JqZWN0LkxPT1BfQ09NUExFVEVcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBldmVudCB0eXBlIHRvIGxpc3RlbiBmb3IuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0aGF0IHdpbGwgYmUgaW52b2tlZCB3aGVuIHRoZSBldmVudCBpcyBkaXNwYXRjaGVkLlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgY2FsbGJhY2sgaXMgaWdub3JlZCBpZiBpdCBpcyBhIGR1cGxpY2F0ZSAodGhlIGNhbGxiYWNrcyBhcmUgdW5pcXVlKS5cbiAqIEBwYXJhbSB7ZHJhZ29uQm9uZXMuRXZlbnRPYmplY3R9IFtjYWxsYmFjay5ldmVudF1cbiAqIEBwYXJhbSB7U3RyaW5nfSBbY2FsbGJhY2suZXZlbnQudHlwZV1cbiAqIEBwYXJhbSB7ZHJhZ29uQm9uZXMuQXJtYXR1cmV9IFtjYWxsYmFjay5ldmVudC5hcm1hdHVyZV1cbiAqIEBwYXJhbSB7ZHJhZ29uQm9uZXMuQW5pbWF0aW9uU3RhdGV9IFtjYWxsYmFjay5ldmVudC5hbmltYXRpb25TdGF0ZV1cbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIEFuaW1hdGlvbiBwbGF5IGNvbXBsZXRlLlxuICogISN6aFxuICog5Yqo55S75pKt5pS+5a6M5oiQ44CCXG4gKlxuICogQGV2ZW50IGRyYWdvbkJvbmVzLkV2ZW50T2JqZWN0LkNPTVBMRVRFXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgZXZlbnQgdHlwZSB0byBsaXN0ZW4gZm9yLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGludm9rZWQgd2hlbiB0aGUgZXZlbnQgaXMgZGlzcGF0Y2hlZC5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIGNhbGxiYWNrIGlzIGlnbm9yZWQgaWYgaXQgaXMgYSBkdXBsaWNhdGUgKHRoZSBjYWxsYmFja3MgYXJlIHVuaXF1ZSkuXG4gKiBAcGFyYW0ge2RyYWdvbkJvbmVzLkV2ZW50T2JqZWN0fSBbY2FsbGJhY2suZXZlbnRdXG4gKiBAcGFyYW0ge1N0cmluZ30gW2NhbGxiYWNrLmV2ZW50LnR5cGVdXG4gKiBAcGFyYW0ge2RyYWdvbkJvbmVzLkFybWF0dXJlfSBbY2FsbGJhY2suZXZlbnQuYXJtYXR1cmVdXG4gKiBAcGFyYW0ge2RyYWdvbkJvbmVzLkFuaW1hdGlvblN0YXRlfSBbY2FsbGJhY2suZXZlbnQuYW5pbWF0aW9uU3RhdGVdXG4gKi9cblxuLyoqXG4gKiAhI2VuXG4gKiBBbmltYXRpb24gZmFkZSBpbiBzdGFydC5cbiAqICEjemhcbiAqIOWKqOeUu+a3oeWFpeW8gOWni+OAglxuICpcbiAqIEBldmVudCBkcmFnb25Cb25lcy5FdmVudE9iamVjdC5GQURFX0lOXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgZXZlbnQgdHlwZSB0byBsaXN0ZW4gZm9yLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGludm9rZWQgd2hlbiB0aGUgZXZlbnQgaXMgZGlzcGF0Y2hlZC5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIGNhbGxiYWNrIGlzIGlnbm9yZWQgaWYgaXQgaXMgYSBkdXBsaWNhdGUgKHRoZSBjYWxsYmFja3MgYXJlIHVuaXF1ZSkuXG4gKiBAcGFyYW0ge2RyYWdvbkJvbmVzLkV2ZW50T2JqZWN0fSBbY2FsbGJhY2suZXZlbnRdXG4gKiBAcGFyYW0ge1N0cmluZ30gW2NhbGxiYWNrLmV2ZW50LnR5cGVdXG4gKiBAcGFyYW0ge2RyYWdvbkJvbmVzLkFybWF0dXJlfSBbY2FsbGJhY2suZXZlbnQuYXJtYXR1cmVdXG4gKiBAcGFyYW0ge2RyYWdvbkJvbmVzLkFuaW1hdGlvblN0YXRlfSBbY2FsbGJhY2suZXZlbnQuYW5pbWF0aW9uU3RhdGVdXG4gKi9cblxuLyoqXG4gKiAhI2VuXG4gKiBBbmltYXRpb24gZmFkZSBpbiBjb21wbGV0ZS5cbiAqICEjemhcbiAqIOWKqOeUu+a3oeWFpeWujOaIkOOAglxuICpcbiAqIEBldmVudCBkcmFnb25Cb25lcy5FdmVudE9iamVjdC5GQURFX0lOX0NPTVBMRVRFXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgZXZlbnQgdHlwZSB0byBsaXN0ZW4gZm9yLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGludm9rZWQgd2hlbiB0aGUgZXZlbnQgaXMgZGlzcGF0Y2hlZC5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIGNhbGxiYWNrIGlzIGlnbm9yZWQgaWYgaXQgaXMgYSBkdXBsaWNhdGUgKHRoZSBjYWxsYmFja3MgYXJlIHVuaXF1ZSkuXG4gKiBAcGFyYW0ge2RyYWdvbkJvbmVzLkV2ZW50T2JqZWN0fSBbY2FsbGJhY2suZXZlbnRdXG4gKiBAcGFyYW0ge1N0cmluZ30gW2NhbGxiYWNrLmV2ZW50LnR5cGVdXG4gKiBAcGFyYW0ge2RyYWdvbkJvbmVzLkFybWF0dXJlfSBbY2FsbGJhY2suZXZlbnQuYXJtYXR1cmVdXG4gKiBAcGFyYW0ge2RyYWdvbkJvbmVzLkFuaW1hdGlvblN0YXRlfSBbY2FsbGJhY2suZXZlbnQuYW5pbWF0aW9uU3RhdGVdXG4gKi9cblxuLyoqXG4gKiAhI2VuXG4gKiBBbmltYXRpb24gZmFkZSBvdXQgc3RhcnQuXG4gKiAhI3poXG4gKiDliqjnlLvmt6Hlh7rlvIDlp4vjgIJcbiAqXG4gKiBAZXZlbnQgZHJhZ29uQm9uZXMuRXZlbnRPYmplY3QuRkFERV9PVVRcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBldmVudCB0eXBlIHRvIGxpc3RlbiBmb3IuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0aGF0IHdpbGwgYmUgaW52b2tlZCB3aGVuIHRoZSBldmVudCBpcyBkaXNwYXRjaGVkLlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgY2FsbGJhY2sgaXMgaWdub3JlZCBpZiBpdCBpcyBhIGR1cGxpY2F0ZSAodGhlIGNhbGxiYWNrcyBhcmUgdW5pcXVlKS5cbiAqIEBwYXJhbSB7ZHJhZ29uQm9uZXMuRXZlbnRPYmplY3R9IFtjYWxsYmFjay5ldmVudF1cbiAqIEBwYXJhbSB7U3RyaW5nfSBbY2FsbGJhY2suZXZlbnQudHlwZV1cbiAqIEBwYXJhbSB7ZHJhZ29uQm9uZXMuQXJtYXR1cmV9IFtjYWxsYmFjay5ldmVudC5hcm1hdHVyZV1cbiAqIEBwYXJhbSB7ZHJhZ29uQm9uZXMuQW5pbWF0aW9uU3RhdGV9IFtjYWxsYmFjay5ldmVudC5hbmltYXRpb25TdGF0ZV1cbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIEFuaW1hdGlvbiBmYWRlIG91dCBjb21wbGV0ZS5cbiAqICEjemhcbiAqIOWKqOeUu+a3oeWHuuWujOaIkOOAglxuICpcbiAqIEBldmVudCBkcmFnb25Cb25lcy5FdmVudE9iamVjdC5GQURFX09VVF9DT01QTEVURVxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGV2ZW50IHR5cGUgdG8gbGlzdGVuIGZvci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRoYXQgd2lsbCBiZSBpbnZva2VkIHdoZW4gdGhlIGV2ZW50IGlzIGRpc3BhdGNoZWQuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBjYWxsYmFjayBpcyBpZ25vcmVkIGlmIGl0IGlzIGEgZHVwbGljYXRlICh0aGUgY2FsbGJhY2tzIGFyZSB1bmlxdWUpLlxuICogQHBhcmFtIHtkcmFnb25Cb25lcy5FdmVudE9iamVjdH0gW2NhbGxiYWNrLmV2ZW50XVxuICogQHBhcmFtIHtTdHJpbmd9IFtjYWxsYmFjay5ldmVudC50eXBlXVxuICogQHBhcmFtIHtkcmFnb25Cb25lcy5Bcm1hdHVyZX0gW2NhbGxiYWNrLmV2ZW50LmFybWF0dXJlXVxuICogQHBhcmFtIHtkcmFnb25Cb25lcy5BbmltYXRpb25TdGF0ZX0gW2NhbGxiYWNrLmV2ZW50LmFuaW1hdGlvblN0YXRlXVxuICovXG5cbi8qKlxuICogISNlblxuICogQW5pbWF0aW9uIGZyYW1lIGV2ZW50LlxuICogISN6aFxuICog5Yqo55S75bin5LqL5Lu244CCXG4gKlxuICogQGV2ZW50IGRyYWdvbkJvbmVzLkV2ZW50T2JqZWN0LkZSQU1FX0VWRU5UXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgZXZlbnQgdHlwZSB0byBsaXN0ZW4gZm9yLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGludm9rZWQgd2hlbiB0aGUgZXZlbnQgaXMgZGlzcGF0Y2hlZC5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIGNhbGxiYWNrIGlzIGlnbm9yZWQgaWYgaXQgaXMgYSBkdXBsaWNhdGUgKHRoZSBjYWxsYmFja3MgYXJlIHVuaXF1ZSkuXG4gKiBAcGFyYW0ge2RyYWdvbkJvbmVzLkV2ZW50T2JqZWN0fSBbY2FsbGJhY2suZXZlbnRdXG4gKiBAcGFyYW0ge1N0cmluZ30gW2NhbGxiYWNrLmV2ZW50LnR5cGVdXG4gKiBAcGFyYW0ge1N0cmluZ30gW2NhbGxiYWNrLmV2ZW50Lm5hbWVdXG4gKiBAcGFyYW0ge2RyYWdvbkJvbmVzLkFybWF0dXJlfSBbY2FsbGJhY2suZXZlbnQuYXJtYXR1cmVdXG4gKiBAcGFyYW0ge2RyYWdvbkJvbmVzLkFuaW1hdGlvblN0YXRlfSBbY2FsbGJhY2suZXZlbnQuYW5pbWF0aW9uU3RhdGVdXG4gKiBAcGFyYW0ge2RyYWdvbkJvbmVzLkJvbmV9IFtjYWxsYmFjay5ldmVudC5ib25lXVxuICogQHBhcmFtIHtkcmFnb25Cb25lcy5TbG90fSBbY2FsbGJhY2suZXZlbnQuc2xvdF1cbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIEFuaW1hdGlvbiBmcmFtZSBzb3VuZCBldmVudC5cbiAqICEjemhcbiAqIOWKqOeUu+W4p+WjsOmfs+S6i+S7tuOAglxuICpcbiAqIEBldmVudCBkcmFnb25Cb25lcy5FdmVudE9iamVjdC5TT1VORF9FVkVOVFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGV2ZW50IHR5cGUgdG8gbGlzdGVuIGZvci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRoYXQgd2lsbCBiZSBpbnZva2VkIHdoZW4gdGhlIGV2ZW50IGlzIGRpc3BhdGNoZWQuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBjYWxsYmFjayBpcyBpZ25vcmVkIGlmIGl0IGlzIGEgZHVwbGljYXRlICh0aGUgY2FsbGJhY2tzIGFyZSB1bmlxdWUpLlxuICogQHBhcmFtIHtkcmFnb25Cb25lcy5FdmVudE9iamVjdH0gW2NhbGxiYWNrLmV2ZW50XVxuICogQHBhcmFtIHtTdHJpbmd9IFtjYWxsYmFjay5ldmVudC50eXBlXVxuICogQHBhcmFtIHtTdHJpbmd9IFtjYWxsYmFjay5ldmVudC5uYW1lXVxuICogQHBhcmFtIHtkcmFnb25Cb25lcy5Bcm1hdHVyZX0gW2NhbGxiYWNrLmV2ZW50LmFybWF0dXJlXVxuICogQHBhcmFtIHtkcmFnb25Cb25lcy5BbmltYXRpb25TdGF0ZX0gW2NhbGxiYWNrLmV2ZW50LmFuaW1hdGlvblN0YXRlXVxuICogQHBhcmFtIHtkcmFnb25Cb25lcy5Cb25lfSBbY2FsbGJhY2suZXZlbnQuYm9uZV1cbiAqIEBwYXJhbSB7ZHJhZ29uQm9uZXMuU2xvdH0gW2NhbGxiYWNrLmV2ZW50LnNsb3RdXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBkcmFnb25Cb25lcy5Bcm1hdHVyZURpc3BsYXkgPSBBcm1hdHVyZURpc3BsYXk7XG4iXX0=