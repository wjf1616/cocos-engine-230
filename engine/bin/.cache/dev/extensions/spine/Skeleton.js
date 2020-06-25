
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extensions/spine/Skeleton.js';
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
var TrackEntryListeners = require('./track-entry-listeners');

var RenderComponent = require('../../cocos2d/core/components/CCRenderComponent');

var spine = require('./lib/spine');

var Graphics = require('../../cocos2d/core/graphics/graphics');

var RenderFlow = require('../../cocos2d/core/renderer/render-flow');

var FLAG_POST_RENDER = RenderFlow.FLAG_POST_RENDER;

var SkeletonCache = require('./skeleton-cache');

var AttachUtil = require('./AttachUtil');
/**
 * @module sp
 */


var DefaultSkinsEnum = cc.Enum({
  'default': -1
});
var DefaultAnimsEnum = cc.Enum({
  '<None>': 0
});
/**
 * !#en Enum for animation cache mode type.
 * !#zh Spine动画缓存类型
 * @enum Skeleton.AnimationCacheMode
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
 * The skeleton of Spine <br/>
 * <br/>
 * (Skeleton has a reference to a SkeletonData and stores the state for skeleton instance,
 * which consists of the current pose's bone SRT, slot colors, and which slot attachments are visible. <br/>
 * Multiple skeletons can use the same SkeletonData which includes all animations, skins, and attachments.) <br/>
 * !#zh
 * Spine 骨骼动画 <br/>
 * <br/>
 * (Skeleton 具有对骨骼数据的引用并且存储了骨骼实例的状态，
 * 它由当前的骨骼动作，slot 颜色，和可见的 slot attachments 组成。<br/>
 * 多个 Skeleton 可以使用相同的骨骼数据，其中包括所有的动画，皮肤和 attachments。
 *
 * @class Skeleton
 * @extends RenderComponent
 */


sp.Skeleton = cc.Class({
  name: 'sp.Skeleton',
  "extends": RenderComponent,
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.renderers/Spine Skeleton',
    help: 'app://docs/html/components/spine.html',
    inspector: 'packages://inspector/inspectors/comps/skeleton2d.js'
  },
  statics: {
    AnimationCacheMode: AnimationCacheMode
  },
  properties: {
    /**
     * !#en The skeletal animation is paused?
     * !#zh 该骨骼动画是否暂停。
     * @property paused
     * @type {Boolean}
     * @readOnly
     * @default false
     */
    paused: {
      "default": false,
      visible: false
    },

    /**
     * !#en
     * The skeleton data contains the skeleton information (bind pose bones, slots, draw order,
     * attachments, skins, etc) and animations but does not hold any state.<br/>
     * Multiple skeletons can share the same skeleton data.
     * !#zh
     * 骨骼数据包含了骨骼信息（绑定骨骼动作，slots，渲染顺序，
     * attachments，皮肤等等）和动画但不持有任何状态。<br/>
     * 多个 Skeleton 可以共用相同的骨骼数据。
     * @property {sp.SkeletonData} skeletonData
     */
    skeletonData: {
      "default": null,
      type: sp.SkeletonData,
      notify: function notify() {
        this.defaultSkin = '';
        this.defaultAnimation = '';

        if (CC_EDITOR) {
          this._refreshInspector();
        }

        this._updateSkeletonData();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.skeleton_data'
    },
    // 由于 spine 的 skin 是无法二次替换的，所以只能设置默认的 skin

    /**
     * !#en The name of default skin.
     * !#zh 默认的皮肤名称。
     * @property {String} defaultSkin
     */
    defaultSkin: {
      "default": '',
      visible: false
    },

    /**
     * !#en The name of default animation.
     * !#zh 默认的动画名称。
     * @property {String} defaultAnimation
     */
    defaultAnimation: {
      "default": '',
      visible: false
    },

    /**
     * !#en The name of current playing animation.
     * !#zh 当前播放的动画名称。
     * @property {String} animation
     */
    animation: {
      get: function get() {
        if (this.isAnimationCached()) {
          return this._animationName;
        } else {
          var entry = this.getCurrent(0);
          return entry && entry.animation.name || "";
        }
      },
      set: function set(value) {
        this.defaultAnimation = value;

        if (value) {
          this.setAnimation(0, value, this.loop);
        } else if (!this.isAnimationCached()) {
          this.clearTrack(0);
          this.setToSetupPose();
        }
      },
      visible: false
    },

    /**
     * @property {Number} _defaultSkinIndex
     */
    _defaultSkinIndex: {
      get: function get() {
        if (this.skeletonData && this.defaultSkin) {
          var skinsEnum = this.skeletonData.getSkinsEnum();

          if (skinsEnum) {
            var skinIndex = skinsEnum[this.defaultSkin];

            if (skinIndex !== undefined) {
              return skinIndex;
            }
          }
        }

        return 0;
      },
      set: function set(value) {
        var skinsEnum;

        if (this.skeletonData) {
          skinsEnum = this.skeletonData.getSkinsEnum();
        }

        if (!skinsEnum) {
          return cc.errorID('', this.name);
        }

        var skinName = skinsEnum[value];

        if (skinName !== undefined) {
          this.defaultSkin = skinName;
          this.setSkin(this.defaultSkin);

          if (CC_EDITOR && !cc.engine.isPlaying) {
            this._refreshInspector();
          }
        } else {
          cc.errorID(7501, this.name);
        }
      },
      type: DefaultSkinsEnum,
      visible: true,
      displayName: "Default Skin",
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.default_skin'
    },
    // value of 0 represents no animation
    _animationIndex: {
      get: function get() {
        var animationName = !CC_EDITOR || cc.engine.isPlaying ? this.animation : this.defaultAnimation;

        if (this.skeletonData && animationName) {
          var animsEnum = this.skeletonData.getAnimsEnum();

          if (animsEnum) {
            var animIndex = animsEnum[animationName];

            if (animIndex !== undefined) {
              return animIndex;
            }
          }
        }

        return 0;
      },
      set: function set(value) {
        if (value === 0) {
          this.animation = '';
          return;
        }

        var animsEnum;

        if (this.skeletonData) {
          animsEnum = this.skeletonData.getAnimsEnum();
        }

        if (!animsEnum) {
          return cc.errorID(7502, this.name);
        }

        var animName = animsEnum[value];

        if (animName !== undefined) {
          this.animation = animName;
        } else {
          cc.errorID(7503, this.name);
        }
      },
      type: DefaultAnimsEnum,
      visible: true,
      displayName: 'Animation',
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.animation'
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
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.animation_cache_mode'
    },

    /**
     * !#en TODO
     * !#zh 是否循环播放当前骨骼动画。
     * @property {Boolean} loop
     * @default true
     */
    loop: {
      "default": true,
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.loop'
    },

    /**
     * !#en Indicates whether to enable premultiplied alpha.
     * You should disable this option when image's transparent area appears to have opaque pixels,
     * or enable this option when image's half transparent area appears to be darken.
     * !#zh 是否启用贴图预乘。
     * 当图片的透明区域出现色块时需要关闭该选项，当图片的半透明区域颜色变黑时需要启用该选项。
     * @property {Boolean} premultipliedAlpha
     * @default true
     */
    premultipliedAlpha: {
      "default": true,
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.premultipliedAlpha'
    },

    /**
     * !#en The time scale of this skeleton.
     * !#zh 当前骨骼中所有动画的时间缩放率。
     * @property {Number} timeScale
     * @default 1
     */
    timeScale: {
      "default": 1,
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.time_scale'
    },

    /**
     * !#en Indicates whether open debug slots.
     * !#zh 是否显示 slot 的 debug 信息。
     * @property {Boolean} debugSlots
     * @default false
     */
    debugSlots: {
      "default": false,
      editorOnly: true,
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.debug_slots',
      notify: function notify() {
        this._updateDebugDraw();
      }
    },

    /**
     * !#en Indicates whether open debug bones.
     * !#zh 是否显示 bone 的 debug 信息。
     * @property {Boolean} debugBones
     * @default false
     */
    debugBones: {
      "default": false,
      editorOnly: true,
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.debug_bones',
      notify: function notify() {
        this._updateDebugDraw();
      }
    },

    /**
     * !#en Indicates whether open debug mesh.
     * !#zh 是否显示 mesh 的 debug 信息。
     * @property {Boolean} debugMesh
     * @default false
     */
    debugMesh: {
      "default": false,
      editorOnly: true,
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.debug_mesh',
      notify: function notify() {
        this._updateDebugDraw();
      }
    },

    /**
     * !#en Enabled two color tint.
     * !#zh 是否启用染色效果。
     * @property {Boolean} useTint
     * @default false
     */
    useTint: {
      "default": false,
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.use_tint',
      notify: function notify() {
        this._updateUseTint();
      }
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
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.enabled_batch'
    },
    // Below properties will effect when cache mode is SHARED_CACHE or PRIVATE_CACHE.
    // accumulate time
    _accTime: 0,
    // Play times counter
    _playCount: 0,
    // Frame cache
    _frameCache: null,
    // Cur frame
    _curFrame: null,
    // Skeleton cache
    _skeletonCache: null,
    // Aimation name
    _animationName: "",
    // Animation queue
    _animationQueue: [],
    // Head animation info of 
    _headAniInfo: null,
    // Play times
    _playTimes: 0,
    // Is animation complete.
    _isAniComplete: true
  },
  // CONSTRUCTOR
  ctor: function ctor() {
    this._effectDelegate = null;
    this._skeleton = null;
    this._rootBone = null;
    this._listener = null;
    this._materialCache = {};
    this._debugRenderer = null;
    this._startSlotIndex = -1;
    this._endSlotIndex = -1;
    this._startEntry = {
      animation: {
        name: ""
      },
      trackIndex: 0
    };
    this._endEntry = {
      animation: {
        name: ""
      },
      trackIndex: 0
    };
    this.attachUtil = new AttachUtil();
  },
  // override base class _getDefaultMaterial to modify default material
  _getDefaultMaterial: function _getDefaultMaterial() {
    return cc.Material.getBuiltinMaterial('2d-spine');
  },
  // override base class _updateMaterial to set define value and clear material cache
  _updateMaterial: function _updateMaterial() {
    var useTint = this.useTint || this.isAnimationCached() && !CC_NATIVERENDERER;
    var baseMaterial = this.getMaterial(0);

    if (baseMaterial) {
      baseMaterial.define('USE_TINT', useTint);
      baseMaterial.define('CC_USE_MODEL', !this.enableBatch);
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
  // if change use tint mode, just clear material cache
  _updateUseTint: function _updateUseTint() {
    var baseMaterial = this.getMaterial(0);

    if (baseMaterial) {
      var useTint = this.useTint || this.isAnimationCached() && !CC_NATIVERENDERER;
      baseMaterial.define('USE_TINT', useTint);
    }

    this._materialCache = {};
  },
  // if change use batch mode, just clear material cache
  _updateBatch: function _updateBatch() {
    var baseMaterial = this.getMaterial(0);

    if (baseMaterial) {
      baseMaterial.define('CC_USE_MODEL', !this.enableBatch);
    }

    this._materialCache = {};
  },
  _validateRender: function _validateRender() {
    var skeletonData = this.skeletonData;

    if (!skeletonData || !skeletonData.isTexturesLoaded()) {
      this.disableRender();
      return;
    }

    this._super();
  },

  /**
   * !#en
   * Sets runtime skeleton data to sp.Skeleton.<br>
   * This method is different from the `skeletonData` property. This method is passed in the raw data provided by the Spine runtime, and the skeletonData type is the asset type provided by Creator.
   * !#zh
   * 设置底层运行时用到的 SkeletonData。<br>
   * 这个接口有别于 `skeletonData` 属性，这个接口传入的是 Spine runtime 提供的原始数据，而 skeletonData 的类型是 Creator 提供的资源类型。
   * @method setSkeletonData
   * @param {sp.spine.SkeletonData} skeletonData
   */
  setSkeletonData: function setSkeletonData(skeletonData) {
    if (skeletonData.width != null && skeletonData.height != null) {
      this.node.setContentSize(skeletonData.width, skeletonData.height);
    }

    if (!CC_EDITOR) {
      if (this._cacheMode === AnimationCacheMode.SHARED_CACHE) {
        this._skeletonCache = SkeletonCache.sharedCache;
      } else if (this._cacheMode === AnimationCacheMode.PRIVATE_CACHE) {
        this._skeletonCache = new SkeletonCache();

        this._skeletonCache.enablePrivateMode();
      }
    }

    if (this.isAnimationCached()) {
      if (this.debugBones || this.debugSlots) {
        cc.warn("Debug bones or slots is invalid in cached mode");
      }

      var skeletonInfo = this._skeletonCache.getSkeletonCache(this.skeletonData._uuid, skeletonData);

      this._skeleton = skeletonInfo.skeleton;
      this._clipper = skeletonInfo.clipper;
      this._rootBone = this._skeleton.getRootBone();
    } else {
      this._skeleton = new spine.Skeleton(skeletonData);
      this._clipper = new spine.SkeletonClipping();
      this._rootBone = this._skeleton.getRootBone();
    }

    this.markForRender(true);
  },

  /**
   * !#en Sets slots visible range.
   * !#zh 设置骨骼插槽可视范围。
   * @method setSlotsRange
   * @param {Number} startSlotIndex
   * @param {Number} endSlotIndex
   */
  setSlotsRange: function setSlotsRange(startSlotIndex, endSlotIndex) {
    if (this.isAnimationCached()) {
      cc.warn("Slots visible range can not be modified in cached mode.");
    } else {
      this._startSlotIndex = startSlotIndex;
      this._endSlotIndex = endSlotIndex;
    }
  },

  /**
   * !#en Sets animation state data.<br>
   * The parameter type is {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.AnimationStateData.
   * !#zh 设置动画状态数据。<br>
   * 参数是 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.AnimationStateData。
   * @method setAnimationStateData
   * @param {sp.spine.AnimationStateData} stateData
   */
  setAnimationStateData: function setAnimationStateData(stateData) {
    if (this.isAnimationCached()) {
      cc.warn("'setAnimationStateData' interface can not be invoked in cached mode.");
    } else {
      var state = new spine.AnimationState(stateData);

      if (this._listener) {
        if (this._state) {
          this._state.removeListener(this._listener);
        }

        state.addListener(this._listener);
      }

      this._state = state;
    }
  },
  // IMPLEMENT
  __preload: function __preload() {
    this._super();

    if (CC_EDITOR) {
      var Flags = cc.Object.Flags;
      this._objFlags |= Flags.IsAnchorLocked | Flags.IsSizeLocked;

      this._refreshInspector();
    }

    var children = this.node.children;

    for (var i = 0, n = children.length; i < n; i++) {
      var child = children[i];

      if (child && child._name === "DEBUG_DRAW_NODE") {
        child.destroy();
      }
    }

    this._updateSkeletonData();

    this._updateDebugDraw();

    this._updateUseTint();

    this._updateBatch();
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
   * skeleton.setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.SHARED_CACHE);
   */
  setAnimationCacheMode: function setAnimationCacheMode(cacheMode) {
    if (this._preCacheMode !== cacheMode) {
      this._cacheMode = cacheMode;

      this._updateSkeletonData();

      this._updateUseTint();
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
  update: function update(dt) {
    if (CC_EDITOR) return;
    if (this.paused) return;
    dt *= this.timeScale * sp.timeScale;

    if (this.isAnimationCached()) {
      // Cache mode and has animation queue.
      if (this._isAniComplete) {
        if (this._animationQueue.length === 0 && !this._headAniInfo) {
          var frameCache = this._frameCache;

          if (frameCache && frameCache.isInvalid()) {
            frameCache.updateToFrame();
            var frames = frameCache.frames;
            this._curFrame = frames[frames.length - 1];
          }

          return;
        }

        if (!this._headAniInfo) {
          this._headAniInfo = this._animationQueue.shift();
        }

        this._accTime += dt;

        if (this._accTime > this._headAniInfo.delay) {
          var aniInfo = this._headAniInfo;
          this._headAniInfo = null;
          this.setAnimation(0, aniInfo.animationName, aniInfo.loop);
        }

        return;
      }

      this._updateCache(dt);
    } else {
      this._updateRealtime(dt);
    }
  },
  _emitCacheCompleteEvent: function _emitCacheCompleteEvent() {
    if (!this._listener) return;
    this._endEntry.animation.name = this._animationName;
    this._listener.complete && this._listener.complete(this._endEntry);
    this._listener.end && this._listener.end(this._endEntry);
  },
  _updateCache: function _updateCache(dt) {
    var frameCache = this._frameCache;

    if (!frameCache.isInited()) {
      return;
    }

    var frames = frameCache.frames;
    var frameTime = SkeletonCache.FrameTime; // Animation Start, the event diffrent from dragonbones inner event,
    // It has no event object.

    if (this._accTime == 0 && this._playCount == 0) {
      this._startEntry.animation.name = this._animationName;
      this._listener && this._listener.start && this._listener.start(this._startEntry);
    }

    this._accTime += dt;
    var frameIdx = Math.floor(this._accTime / frameTime);

    if (!frameCache.isCompleted) {
      frameCache.updateToFrame(frameIdx);
    }

    if (frameCache.isCompleted && frameIdx >= frames.length) {
      this._playCount++;

      if (this._playTimes > 0 && this._playCount >= this._playTimes) {
        // set frame to end frame.
        this._curFrame = frames[frames.length - 1];
        this._accTime = 0;
        this._playCount = 0;
        this._isAniComplete = true;

        this._emitCacheCompleteEvent();

        return;
      }

      this._accTime = 0;
      frameIdx = 0;

      this._emitCacheCompleteEvent();
    }

    this._curFrame = frames[frameIdx];
  },
  _updateRealtime: function _updateRealtime(dt) {
    var skeleton = this._skeleton;
    var state = this._state;

    if (skeleton) {
      skeleton.update(dt);

      if (state) {
        state.update(dt);
        state.apply(skeleton);
      }
    }
  },

  /**
   * !#en Sets vertex effect delegate.
   * !#zh 设置顶点动画代理
   * @method setVertexEffectDelegate
   * @param {sp.VertexEffectDelegate} effectDelegate
   */
  setVertexEffectDelegate: function setVertexEffectDelegate(effectDelegate) {
    this._effectDelegate = effectDelegate;
  },
  // RENDERER

  /**
   * !#en Computes the world SRT from the local SRT for each bone.
   * !#zh 重新更新所有骨骼的世界 Transform，
   * 当获取 bone 的数值未更新时，即可使用该函数进行更新数值。
   * @method updateWorldTransform
   * @example
   * var bone = spine.findBone('head');
   * cc.log(bone.worldX); // return 0;
   * spine.updateWorldTransform();
   * bone = spine.findBone('head');
   * cc.log(bone.worldX); // return -23.12;
   */
  updateWorldTransform: function updateWorldTransform() {
    if (!this.isAnimationCached()) return;

    if (this._skeleton) {
      this._skeleton.updateWorldTransform();
    }
  },

  /**
   * !#en Sets the bones and slots to the setup pose.
   * !#zh 还原到起始动作
   * @method setToSetupPose
   */
  setToSetupPose: function setToSetupPose() {
    if (this._skeleton) {
      this._skeleton.setToSetupPose();
    }
  },

  /**
   * !#en
   * Sets the bones to the setup pose,
   * using the values from the `BoneData` list in the `SkeletonData`.
   * !#zh
   * 设置 bone 到起始动作
   * 使用 SkeletonData 中的 BoneData 列表中的值。
   * @method setBonesToSetupPose
   */
  setBonesToSetupPose: function setBonesToSetupPose() {
    if (this._skeleton) {
      this._skeleton.setBonesToSetupPose();
    }
  },

  /**
   * !#en
   * Sets the slots to the setup pose,
   * using the values from the `SlotData` list in the `SkeletonData`.
   * !#zh
   * 设置 slot 到起始动作。
   * 使用 SkeletonData 中的 SlotData 列表中的值。
   * @method setSlotsToSetupPose
   */
  setSlotsToSetupPose: function setSlotsToSetupPose() {
    if (this._skeleton) {
      this._skeleton.setSlotsToSetupPose();
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
    var uuid = this.skeletonData._uuid;

    if (this._skeletonCache) {
      this._skeletonCache.updateAnimationCache(uuid, animName);
    }
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

    if (this._skeletonCache) {
      this._skeletonCache.invalidAnimationCache(this.skeletonData._uuid);
    }
  },

  /**
   * !#en
   * Finds a bone by name.
   * This does a string comparison for every bone.<br>
   * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Bone object.
   * !#zh
   * 通过名称查找 bone。
   * 这里对每个 bone 的名称进行了对比。<br>
   * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Bone 对象。
   *
   * @method findBone
   * @param {String} boneName
   * @return {sp.spine.Bone}
   */
  findBone: function findBone(boneName) {
    if (this._skeleton) {
      return this._skeleton.findBone(boneName);
    }

    return null;
  },

  /**
   * !#en
   * Finds a slot by name. This does a string comparison for every slot.<br>
   * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Slot object.
   * !#zh
   * 通过名称查找 slot。这里对每个 slot 的名称进行了比较。<br>
   * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Slot 对象。
   *
   * @method findSlot
   * @param {String} slotName
   * @return {sp.spine.Slot}
   */
  findSlot: function findSlot(slotName) {
    if (this._skeleton) {
      return this._skeleton.findSlot(slotName);
    }

    return null;
  },

  /**
   * !#en
   * Finds a skin by name and makes it the active skin.
   * This does a string comparison for every skin.<br>
   * Note that setting the skin does not change which attachments are visible.<br>
   * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Skin object.
   * !#zh
   * 按名称查找皮肤，激活该皮肤。这里对每个皮肤的名称进行了比较。<br>
   * 注意：设置皮肤不会改变 attachment 的可见性。<br>
   * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Skin 对象。
   *
   * @method setSkin
   * @param {String} skinName
   */
  setSkin: function setSkin(skinName) {
    if (this._skeleton) {
      this._skeleton.setSkinByName(skinName);

      this._skeleton.setSlotsToSetupPose();
    }

    this.invalidAnimationCache();
  },

  /**
   * !#en
   * Returns the attachment for the slot and attachment name.
   * The skeleton looks first in its skin, then in the skeleton data’s default skin.<br>
   * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Attachment object.
   * !#zh
   * 通过 slot 和 attachment 的名称获取 attachment。Skeleton 优先查找它的皮肤，然后才是 Skeleton Data 中默认的皮肤。<br>
   * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Attachment 对象。
   *
   * @method getAttachment
   * @param {String} slotName
   * @param {String} attachmentName
   * @return {sp.spine.Attachment}
   */
  getAttachment: function getAttachment(slotName, attachmentName) {
    if (this._skeleton) {
      return this._skeleton.getAttachmentByName(slotName, attachmentName);
    }

    return null;
  },

  /**
   * !#en
   * Sets the attachment for the slot and attachment name.
   * The skeleton looks first in its skin, then in the skeleton data’s default skin.
   * !#zh
   * 通过 slot 和 attachment 的名字来设置 attachment。
   * Skeleton 优先查找它的皮肤，然后才是 Skeleton Data 中默认的皮肤。
   * @method setAttachment
   * @param {String} slotName
   * @param {String} attachmentName
   */
  setAttachment: function setAttachment(slotName, attachmentName) {
    if (this._skeleton) {
      this._skeleton.setAttachment(slotName, attachmentName);
    }

    this.invalidAnimationCache();
  },

  /**
  * Return the renderer of attachment.
  * @method getTextureAtlas
  * @param {sp.spine.RegionAttachment|spine.BoundingBoxAttachment} regionAttachment
  * @return {sp.spine.TextureAtlasRegion}
  */
  getTextureAtlas: function getTextureAtlas(regionAttachment) {
    return regionAttachment.region;
  },
  // ANIMATION

  /**
   * !#en
   * Mix applies all keyframe values,
   * interpolated for the specified time and mixed with the current values.
   * !#zh 为所有关键帧设定混合及混合时间（从当前值开始差值）。
   * @method setMix
   * @param {String} fromAnimation
   * @param {String} toAnimation
   * @param {Number} duration
   */
  setMix: function setMix(fromAnimation, toAnimation, duration) {
    if (this._state) {
      this._state.data.setMix(fromAnimation, toAnimation, duration);
    }
  },

  /**
   * !#en Set the current animation. Any queued animations are cleared.<br>
   * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry object.
   * !#zh 设置当前动画。队列中的任何的动画将被清除。<br>
   * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry 对象。
   * @method setAnimation
   * @param {Number} trackIndex
   * @param {String} name
   * @param {Boolean} loop
   * @return {sp.spine.TrackEntry}
   */
  setAnimation: function setAnimation(trackIndex, name, loop) {
    this._playTimes = loop ? 0 : 1;
    this._animationName = name;

    if (this.isAnimationCached()) {
      if (trackIndex !== 0) {
        cc.warn("Track index can not greater than 0 in cached mode.");
      }

      if (!this._skeletonCache) return null;

      var cache = this._skeletonCache.getAnimationCache(this.skeletonData._uuid, name);

      if (!cache) {
        cache = this._skeletonCache.initAnimationCache(this.skeletonData._uuid, name);
      }

      if (cache) {
        this._isAniComplete = false;
        this._accTime = 0;
        this._playCount = 0;
        this._frameCache = cache;

        if (this.attachUtil._hasAttachedNode()) {
          this._frameCache.enableCacheAttachedInfo();
        }

        this._frameCache.updateToFrame(0);

        this._curFrame = this._frameCache.frames[0];
      }
    } else {
      if (this._skeleton) {
        var animation = this._skeleton.data.findAnimation(name);

        if (!animation) {
          cc.logID(7509, name);
          return null;
        }

        var res = this._state.setAnimationWith(trackIndex, animation, loop);

        this._state.apply(this._skeleton);

        return res;
      }
    }

    return null;
  },

  /**
   * !#en Adds an animation to be played delay seconds after the current or last queued animation.<br>
   * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry object.
   * !#zh 添加一个动画到动画队列尾部，还可以延迟指定的秒数。<br>
   * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry 对象。
   * @method addAnimation
   * @param {Number} trackIndex
   * @param {String} name
   * @param {Boolean} loop
   * @param {Number} [delay=0]
   * @return {sp.spine.TrackEntry}
   */
  addAnimation: function addAnimation(trackIndex, name, loop, delay) {
    delay = delay || 0;

    if (this.isAnimationCached()) {
      if (trackIndex !== 0) {
        cc.warn("Track index can not greater than 0 in cached mode.");
      }

      this._animationQueue.push({
        animationName: name,
        loop: loop,
        delay: delay
      });
    } else {
      if (this._skeleton) {
        var animation = this._skeleton.data.findAnimation(name);

        if (!animation) {
          cc.logID(7510, name);
          return null;
        }

        return this._state.addAnimationWith(trackIndex, animation, loop, delay);
      }
    }

    return null;
  },

  /**
   * !#en Find animation with specified name.
   * !#zh 查找指定名称的动画
   * @method findAnimation
   * @param {String} name
   * @returns {sp.spine.Animation}
   */
  findAnimation: function findAnimation(name) {
    if (this._skeleton) {
      return this._skeleton.data.findAnimation(name);
    }

    return null;
  },

  /**
   * !#en Returns track entry by trackIndex.<br>
   * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry object.
   * !#zh 通过 track 索引获取 TrackEntry。<br>
   * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry 对象。
   * @method getCurrent
   * @param trackIndex
   * @return {sp.spine.TrackEntry}
   */
  getCurrent: function getCurrent(trackIndex) {
    if (this.isAnimationCached()) {
      cc.warn("'getCurrent' interface can not be invoked in cached mode.");
    } else {
      if (this._state) {
        return this._state.getCurrent(trackIndex);
      }
    }

    return null;
  },

  /**
   * !#en Clears all tracks of animation state.
   * !#zh 清除所有 track 的动画状态。
   * @method clearTracks
   */
  clearTracks: function clearTracks() {
    if (this.isAnimationCached()) {
      cc.warn("'clearTracks' interface can not be invoked in cached mode.");
    } else {
      if (this._state) {
        this._state.clearTracks();
      }
    }
  },

  /**
   * !#en Clears track of animation state by trackIndex.
   * !#zh 清除出指定 track 的动画状态。
   * @method clearTrack
   * @param {number} trackIndex
   */
  clearTrack: function clearTrack(trackIndex) {
    if (this.isAnimationCached()) {
      cc.warn("'clearTrack' interface can not be invoked in cached mode.");
    } else {
      if (this._state) {
        this._state.clearTrack(trackIndex);

        if (CC_EDITOR && !cc.engine.isPlaying) {
          this._state.update(0);
        }
      }
    }
  },

  /**
   * !#en Set the start event listener.
   * !#zh 用来设置开始播放动画的事件监听。
   * @method setStartListener
   * @param {function} listener
   */
  setStartListener: function setStartListener(listener) {
    this._ensureListener();

    this._listener.start = listener;
  },

  /**
   * !#en Set the interrupt event listener.
   * !#zh 用来设置动画被打断的事件监听。
   * @method setInterruptListener
   * @param {function} listener
   */
  setInterruptListener: function setInterruptListener(listener) {
    this._ensureListener();

    this._listener.interrupt = listener;
  },

  /**
   * !#en Set the end event listener.
   * !#zh 用来设置动画播放完后的事件监听。
   * @method setEndListener
   * @param {function} listener
   */
  setEndListener: function setEndListener(listener) {
    this._ensureListener();

    this._listener.end = listener;
  },

  /**
   * !#en Set the dispose event listener.
   * !#zh 用来设置动画将被销毁的事件监听。
   * @method setDisposeListener
   * @param {function} listener
   */
  setDisposeListener: function setDisposeListener(listener) {
    this._ensureListener();

    this._listener.dispose = listener;
  },

  /**
   * !#en Set the complete event listener.
   * !#zh 用来设置动画播放一次循环结束后的事件监听。
   * @method setCompleteListener
   * @param {function} listener
   */
  setCompleteListener: function setCompleteListener(listener) {
    this._ensureListener();

    this._listener.complete = listener;
  },

  /**
   * !#en Set the animation event listener.
   * !#zh 用来设置动画播放过程中帧事件的监听。
   * @method setEventListener
   * @param {function} listener
   */
  setEventListener: function setEventListener(listener) {
    this._ensureListener();

    this._listener.event = listener;
  },

  /**
   * !#en Set the start event listener for specified TrackEntry.
   * !#zh 用来为指定的 TrackEntry 设置动画开始播放的事件监听。
   * @method setTrackStartListener
   * @param {sp.spine.TrackEntry} entry
   * @param {function} listener
   */
  setTrackStartListener: function setTrackStartListener(entry, listener) {
    TrackEntryListeners.getListeners(entry).start = listener;
  },

  /**
   * !#en Set the interrupt event listener for specified TrackEntry.
   * !#zh 用来为指定的 TrackEntry 设置动画被打断的事件监听。
   * @method setTrackInterruptListener
   * @param {sp.spine.TrackEntry} entry
   * @param {function} listener
   */
  setTrackInterruptListener: function setTrackInterruptListener(entry, listener) {
    TrackEntryListeners.getListeners(entry).interrupt = listener;
  },

  /**
   * !#en Set the end event listener for specified TrackEntry.
   * !#zh 用来为指定的 TrackEntry 设置动画播放结束的事件监听。
   * @method setTrackEndListener
   * @param {sp.spine.TrackEntry} entry
   * @param {function} listener
   */
  setTrackEndListener: function setTrackEndListener(entry, listener) {
    TrackEntryListeners.getListeners(entry).end = listener;
  },

  /**
   * !#en Set the dispose event listener for specified TrackEntry.
   * !#zh 用来为指定的 TrackEntry 设置动画即将被销毁的事件监听。
   * @method setTrackDisposeListener
   * @param {sp.spine.TrackEntry} entry
   * @param {function} listener
   */
  setTrackDisposeListener: function setTrackDisposeListener(entry, listener) {
    TrackEntryListeners.getListeners(entry).dispose = listener;
  },

  /**
   * !#en Set the complete event listener for specified TrackEntry.
   * !#zh 用来为指定的 TrackEntry 设置动画一次循环播放结束的事件监听。
   * @method setTrackCompleteListener
   * @param {sp.spine.TrackEntry} entry
   * @param {function} listener
   * @param {sp.spine.TrackEntry} listener.entry
   * @param {Number} listener.loopCount
   */
  setTrackCompleteListener: function setTrackCompleteListener(entry, listener) {
    TrackEntryListeners.getListeners(entry).complete = function (trackEntry) {
      var loopCount = Math.floor(trackEntry.trackTime / trackEntry.animationEnd);
      listener(trackEntry, loopCount);
    };
  },

  /**
   * !#en Set the event listener for specified TrackEntry.
   * !#zh 用来为指定的 TrackEntry 设置动画帧事件的监听。
   * @method setTrackEventListener
   * @param {sp.spine.TrackEntry} entry
   * @param {function} listener
   */
  setTrackEventListener: function setTrackEventListener(entry, listener) {
    TrackEntryListeners.getListeners(entry).event = listener;
  },

  /**
   * !#en Get the animation state object
   * !#zh 获取动画状态
   * @method getState
   * @return {sp.spine.AnimationState} state
   */
  getState: function getState() {
    return this._state;
  },
  // update animation list for editor
  _updateAnimEnum: CC_EDITOR && function () {
    var animEnum;

    if (this.skeletonData) {
      animEnum = this.skeletonData.getAnimsEnum();
    } // change enum


    setEnumAttr(this, '_animationIndex', animEnum || DefaultAnimsEnum);
  },
  // update skin list for editor
  _updateSkinEnum: CC_EDITOR && function () {
    var skinEnum;

    if (this.skeletonData) {
      skinEnum = this.skeletonData.getSkinsEnum();
    } // change enum


    setEnumAttr(this, '_defaultSkinIndex', skinEnum || DefaultSkinsEnum);
  },
  _ensureListener: function _ensureListener() {
    if (!this._listener) {
      this._listener = new TrackEntryListeners();

      if (this._state) {
        this._state.addListener(this._listener);
      }
    }
  },
  _updateSkeletonData: function _updateSkeletonData() {
    if (!this.skeletonData) {
      this.disableRender();
      return;
    }

    var data = this.skeletonData.getRuntimeData();

    if (!data) {
      this.disableRender();
      return;
    }

    try {
      this.setSkeletonData(data);

      if (!this.isAnimationCached()) {
        this.setAnimationStateData(new spine.AnimationStateData(this._skeleton.data));
      }

      this.defaultSkin && this.setSkin(this.defaultSkin);
    } catch (e) {
      cc.warn(e);
    }

    this.attachUtil.init(this);

    this.attachUtil._associateAttachedNode();

    this._preCacheMode = this._cacheMode;
    this.animation = this.defaultAnimation;
  },
  _refreshInspector: function _refreshInspector() {
    // update inspector
    this._updateAnimEnum();

    this._updateSkinEnum();

    Editor.Utils.refreshSelectedInspector('node', this.node.uuid);
  },
  _updateDebugDraw: function _updateDebugDraw() {
    if (this.debugBones || this.debugSlots) {
      if (!this._debugRenderer) {
        var debugDrawNode = new cc.PrivateNode();
        debugDrawNode.name = 'DEBUG_DRAW_NODE';
        var debugDraw = debugDrawNode.addComponent(Graphics);
        debugDraw.lineWidth = 1;
        debugDraw.strokeColor = cc.color(255, 0, 0, 255);
        this._debugRenderer = debugDraw;
      }

      this._debugRenderer.node.parent = this.node;

      if (this.isAnimationCached()) {
        cc.warn("Debug bones or slots is invalid in cached mode");
      }
    } else if (this._debugRenderer) {
      this._debugRenderer.node.parent = null;
    }
  },
  getSkeleton: function getSkeleton() {
    if (this._skeleton) {
      return this._skeleton.getSkeleton();
    }
  }
});
module.exports = sp.Skeleton;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNrZWxldG9uLmpzIl0sIm5hbWVzIjpbIlRyYWNrRW50cnlMaXN0ZW5lcnMiLCJyZXF1aXJlIiwiUmVuZGVyQ29tcG9uZW50Iiwic3BpbmUiLCJHcmFwaGljcyIsIlJlbmRlckZsb3ciLCJGTEFHX1BPU1RfUkVOREVSIiwiU2tlbGV0b25DYWNoZSIsIkF0dGFjaFV0aWwiLCJEZWZhdWx0U2tpbnNFbnVtIiwiY2MiLCJFbnVtIiwiRGVmYXVsdEFuaW1zRW51bSIsIkFuaW1hdGlvbkNhY2hlTW9kZSIsIlJFQUxUSU1FIiwiU0hBUkVEX0NBQ0hFIiwiUFJJVkFURV9DQUNIRSIsInNldEVudW1BdHRyIiwib2JqIiwicHJvcE5hbWUiLCJlbnVtRGVmIiwiQ2xhc3MiLCJBdHRyIiwic2V0Q2xhc3NBdHRyIiwiZ2V0TGlzdCIsInNwIiwiU2tlbGV0b24iLCJuYW1lIiwiZWRpdG9yIiwiQ0NfRURJVE9SIiwibWVudSIsImhlbHAiLCJpbnNwZWN0b3IiLCJzdGF0aWNzIiwicHJvcGVydGllcyIsInBhdXNlZCIsInZpc2libGUiLCJza2VsZXRvbkRhdGEiLCJ0eXBlIiwiU2tlbGV0b25EYXRhIiwibm90aWZ5IiwiZGVmYXVsdFNraW4iLCJkZWZhdWx0QW5pbWF0aW9uIiwiX3JlZnJlc2hJbnNwZWN0b3IiLCJfdXBkYXRlU2tlbGV0b25EYXRhIiwidG9vbHRpcCIsIkNDX0RFViIsImFuaW1hdGlvbiIsImdldCIsImlzQW5pbWF0aW9uQ2FjaGVkIiwiX2FuaW1hdGlvbk5hbWUiLCJlbnRyeSIsImdldEN1cnJlbnQiLCJzZXQiLCJ2YWx1ZSIsInNldEFuaW1hdGlvbiIsImxvb3AiLCJjbGVhclRyYWNrIiwic2V0VG9TZXR1cFBvc2UiLCJfZGVmYXVsdFNraW5JbmRleCIsInNraW5zRW51bSIsImdldFNraW5zRW51bSIsInNraW5JbmRleCIsInVuZGVmaW5lZCIsImVycm9ySUQiLCJza2luTmFtZSIsInNldFNraW4iLCJlbmdpbmUiLCJpc1BsYXlpbmciLCJkaXNwbGF5TmFtZSIsIl9hbmltYXRpb25JbmRleCIsImFuaW1hdGlvbk5hbWUiLCJhbmltc0VudW0iLCJnZXRBbmltc0VudW0iLCJhbmltSW5kZXgiLCJhbmltTmFtZSIsIl9wcmVDYWNoZU1vZGUiLCJfY2FjaGVNb2RlIiwiX2RlZmF1bHRDYWNoZU1vZGUiLCJzZXRBbmltYXRpb25DYWNoZU1vZGUiLCJlZGl0b3JPbmx5IiwiYW5pbWF0YWJsZSIsInByZW11bHRpcGxpZWRBbHBoYSIsInRpbWVTY2FsZSIsImRlYnVnU2xvdHMiLCJfdXBkYXRlRGVidWdEcmF3IiwiZGVidWdCb25lcyIsImRlYnVnTWVzaCIsInVzZVRpbnQiLCJfdXBkYXRlVXNlVGludCIsImVuYWJsZUJhdGNoIiwiX3VwZGF0ZUJhdGNoIiwiX2FjY1RpbWUiLCJfcGxheUNvdW50IiwiX2ZyYW1lQ2FjaGUiLCJfY3VyRnJhbWUiLCJfc2tlbGV0b25DYWNoZSIsIl9hbmltYXRpb25RdWV1ZSIsIl9oZWFkQW5pSW5mbyIsIl9wbGF5VGltZXMiLCJfaXNBbmlDb21wbGV0ZSIsImN0b3IiLCJfZWZmZWN0RGVsZWdhdGUiLCJfc2tlbGV0b24iLCJfcm9vdEJvbmUiLCJfbGlzdGVuZXIiLCJfbWF0ZXJpYWxDYWNoZSIsIl9kZWJ1Z1JlbmRlcmVyIiwiX3N0YXJ0U2xvdEluZGV4IiwiX2VuZFNsb3RJbmRleCIsIl9zdGFydEVudHJ5IiwidHJhY2tJbmRleCIsIl9lbmRFbnRyeSIsImF0dGFjaFV0aWwiLCJfZ2V0RGVmYXVsdE1hdGVyaWFsIiwiTWF0ZXJpYWwiLCJnZXRCdWlsdGluTWF0ZXJpYWwiLCJfdXBkYXRlTWF0ZXJpYWwiLCJDQ19OQVRJVkVSRU5ERVJFUiIsImJhc2VNYXRlcmlhbCIsImdldE1hdGVyaWFsIiwiZGVmaW5lIiwiZGlzYWJsZVJlbmRlciIsIl9zdXBlciIsIm5vZGUiLCJfcmVuZGVyRmxhZyIsIm1hcmtGb3JSZW5kZXIiLCJlbmFibGUiLCJfdmFsaWRhdGVSZW5kZXIiLCJpc1RleHR1cmVzTG9hZGVkIiwic2V0U2tlbGV0b25EYXRhIiwid2lkdGgiLCJoZWlnaHQiLCJzZXRDb250ZW50U2l6ZSIsInNoYXJlZENhY2hlIiwiZW5hYmxlUHJpdmF0ZU1vZGUiLCJ3YXJuIiwic2tlbGV0b25JbmZvIiwiZ2V0U2tlbGV0b25DYWNoZSIsIl91dWlkIiwic2tlbGV0b24iLCJfY2xpcHBlciIsImNsaXBwZXIiLCJnZXRSb290Qm9uZSIsIlNrZWxldG9uQ2xpcHBpbmciLCJzZXRTbG90c1JhbmdlIiwic3RhcnRTbG90SW5kZXgiLCJlbmRTbG90SW5kZXgiLCJzZXRBbmltYXRpb25TdGF0ZURhdGEiLCJzdGF0ZURhdGEiLCJzdGF0ZSIsIkFuaW1hdGlvblN0YXRlIiwiX3N0YXRlIiwicmVtb3ZlTGlzdGVuZXIiLCJhZGRMaXN0ZW5lciIsIl9fcHJlbG9hZCIsIkZsYWdzIiwiT2JqZWN0IiwiX29iakZsYWdzIiwiSXNBbmNob3JMb2NrZWQiLCJJc1NpemVMb2NrZWQiLCJjaGlsZHJlbiIsImkiLCJuIiwibGVuZ3RoIiwiY2hpbGQiLCJfbmFtZSIsImRlc3Ryb3kiLCJjYWNoZU1vZGUiLCJ1cGRhdGUiLCJkdCIsImZyYW1lQ2FjaGUiLCJpc0ludmFsaWQiLCJ1cGRhdGVUb0ZyYW1lIiwiZnJhbWVzIiwic2hpZnQiLCJkZWxheSIsImFuaUluZm8iLCJfdXBkYXRlQ2FjaGUiLCJfdXBkYXRlUmVhbHRpbWUiLCJfZW1pdENhY2hlQ29tcGxldGVFdmVudCIsImNvbXBsZXRlIiwiZW5kIiwiaXNJbml0ZWQiLCJmcmFtZVRpbWUiLCJGcmFtZVRpbWUiLCJzdGFydCIsImZyYW1lSWR4IiwiTWF0aCIsImZsb29yIiwiaXNDb21wbGV0ZWQiLCJhcHBseSIsInNldFZlcnRleEVmZmVjdERlbGVnYXRlIiwiZWZmZWN0RGVsZWdhdGUiLCJ1cGRhdGVXb3JsZFRyYW5zZm9ybSIsInNldEJvbmVzVG9TZXR1cFBvc2UiLCJzZXRTbG90c1RvU2V0dXBQb3NlIiwidXBkYXRlQW5pbWF0aW9uQ2FjaGUiLCJ1dWlkIiwiaW52YWxpZEFuaW1hdGlvbkNhY2hlIiwiZmluZEJvbmUiLCJib25lTmFtZSIsImZpbmRTbG90Iiwic2xvdE5hbWUiLCJzZXRTa2luQnlOYW1lIiwiZ2V0QXR0YWNobWVudCIsImF0dGFjaG1lbnROYW1lIiwiZ2V0QXR0YWNobWVudEJ5TmFtZSIsInNldEF0dGFjaG1lbnQiLCJnZXRUZXh0dXJlQXRsYXMiLCJyZWdpb25BdHRhY2htZW50IiwicmVnaW9uIiwic2V0TWl4IiwiZnJvbUFuaW1hdGlvbiIsInRvQW5pbWF0aW9uIiwiZHVyYXRpb24iLCJkYXRhIiwiY2FjaGUiLCJnZXRBbmltYXRpb25DYWNoZSIsImluaXRBbmltYXRpb25DYWNoZSIsIl9oYXNBdHRhY2hlZE5vZGUiLCJlbmFibGVDYWNoZUF0dGFjaGVkSW5mbyIsImZpbmRBbmltYXRpb24iLCJsb2dJRCIsInJlcyIsInNldEFuaW1hdGlvbldpdGgiLCJhZGRBbmltYXRpb24iLCJwdXNoIiwiYWRkQW5pbWF0aW9uV2l0aCIsImNsZWFyVHJhY2tzIiwic2V0U3RhcnRMaXN0ZW5lciIsImxpc3RlbmVyIiwiX2Vuc3VyZUxpc3RlbmVyIiwic2V0SW50ZXJydXB0TGlzdGVuZXIiLCJpbnRlcnJ1cHQiLCJzZXRFbmRMaXN0ZW5lciIsInNldERpc3Bvc2VMaXN0ZW5lciIsImRpc3Bvc2UiLCJzZXRDb21wbGV0ZUxpc3RlbmVyIiwic2V0RXZlbnRMaXN0ZW5lciIsImV2ZW50Iiwic2V0VHJhY2tTdGFydExpc3RlbmVyIiwiZ2V0TGlzdGVuZXJzIiwic2V0VHJhY2tJbnRlcnJ1cHRMaXN0ZW5lciIsInNldFRyYWNrRW5kTGlzdGVuZXIiLCJzZXRUcmFja0Rpc3Bvc2VMaXN0ZW5lciIsInNldFRyYWNrQ29tcGxldGVMaXN0ZW5lciIsInRyYWNrRW50cnkiLCJsb29wQ291bnQiLCJ0cmFja1RpbWUiLCJhbmltYXRpb25FbmQiLCJzZXRUcmFja0V2ZW50TGlzdGVuZXIiLCJnZXRTdGF0ZSIsIl91cGRhdGVBbmltRW51bSIsImFuaW1FbnVtIiwiX3VwZGF0ZVNraW5FbnVtIiwic2tpbkVudW0iLCJnZXRSdW50aW1lRGF0YSIsIkFuaW1hdGlvblN0YXRlRGF0YSIsImUiLCJpbml0IiwiX2Fzc29jaWF0ZUF0dGFjaGVkTm9kZSIsIkVkaXRvciIsIlV0aWxzIiwicmVmcmVzaFNlbGVjdGVkSW5zcGVjdG9yIiwiZGVidWdEcmF3Tm9kZSIsIlByaXZhdGVOb2RlIiwiZGVidWdEcmF3IiwiYWRkQ29tcG9uZW50IiwibGluZVdpZHRoIiwic3Ryb2tlQ29sb3IiLCJjb2xvciIsInBhcmVudCIsImdldFNrZWxldG9uIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLElBQU1BLG1CQUFtQixHQUFHQyxPQUFPLENBQUMseUJBQUQsQ0FBbkM7O0FBQ0EsSUFBTUMsZUFBZSxHQUFHRCxPQUFPLENBQUMsaURBQUQsQ0FBL0I7O0FBQ0EsSUFBTUUsS0FBSyxHQUFHRixPQUFPLENBQUMsYUFBRCxDQUFyQjs7QUFDQSxJQUFNRyxRQUFRLEdBQUdILE9BQU8sQ0FBQyxzQ0FBRCxDQUF4Qjs7QUFDQSxJQUFNSSxVQUFVLEdBQUdKLE9BQU8sQ0FBQyx5Q0FBRCxDQUExQjs7QUFDQSxJQUFNSyxnQkFBZ0IsR0FBR0QsVUFBVSxDQUFDQyxnQkFBcEM7O0FBRUEsSUFBSUMsYUFBYSxHQUFHTixPQUFPLENBQUMsa0JBQUQsQ0FBM0I7O0FBQ0EsSUFBSU8sVUFBVSxHQUFHUCxPQUFPLENBQUMsY0FBRCxDQUF4QjtBQUVBOzs7OztBQUdBLElBQUlRLGdCQUFnQixHQUFHQyxFQUFFLENBQUNDLElBQUgsQ0FBUTtBQUFFLGFBQVcsQ0FBQztBQUFkLENBQVIsQ0FBdkI7QUFDQSxJQUFJQyxnQkFBZ0IsR0FBR0YsRUFBRSxDQUFDQyxJQUFILENBQVE7QUFBRSxZQUFVO0FBQVosQ0FBUixDQUF2QjtBQUVBOzs7Ozs7QUFLQSxJQUFJRSxrQkFBa0IsR0FBR0gsRUFBRSxDQUFDQyxJQUFILENBQVE7QUFDN0I7Ozs7O0FBS0FHLEVBQUFBLFFBQVEsRUFBRSxDQU5t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RSxDQUFDZ1EsV0FBUCxFQUFwQjtBQUNBRCxRQUFBQSxhQUFhLENBQUM5TyxJQUFkLEdBQXFCLGlCQUFyQjtBQUNBLFlBQUlnUCxTQUFTLEdBQUdGLGFBQWEsQ0FBQ0csWUFBZCxDQUEyQnhRLFFBQTNCLENBQWhCO0FBQ0F1USxRQUFBQSxTQUFTLENBQUNFLFNBQVYsR0FBc0IsQ0FBdEI7QUFDQUYsUUFBQUEsU0FBUyxDQUFDRyxXQUFWLEdBQXdCcFEsRUFBRSxDQUFDcVEsS0FBSCxDQUFTLEdBQVQsRUFBYyxDQUFkLEVBQWlCLENBQWpCLEVBQW9CLEdBQXBCLENBQXhCO0FBRUEsYUFBS3BLLGNBQUwsR0FBc0JnSyxTQUF0QjtBQUNIOztBQUVELFdBQUtoSyxjQUFMLENBQW9CaUIsSUFBcEIsQ0FBeUJvSixNQUF6QixHQUFrQyxLQUFLcEosSUFBdkM7O0FBQ0EsVUFBSSxLQUFLM0UsaUJBQUwsRUFBSixFQUE4QjtBQUMxQnZDLFFBQUFBLEVBQUUsQ0FBQzhILElBQUgsQ0FBUSxnREFBUjtBQUNIO0FBQ0osS0FmRCxNQWdCSyxJQUFJLEtBQUs3QixjQUFULEVBQXlCO0FBQzFCLFdBQUtBLGNBQUwsQ0FBb0JpQixJQUFwQixDQUF5Qm9KLE1BQXpCLEdBQWtDLElBQWxDO0FBQ0g7QUFDSixHQXh1Q2tCO0FBMHVDbkJDLEVBQUFBLFdBQVcsRUFBRSx1QkFBWTtBQUNyQixRQUFJLEtBQUsxSyxTQUFULEVBQW9CO0FBQ2hCLGFBQU8sS0FBS0EsU0FBTCxDQUFlMEssV0FBZixFQUFQO0FBQ0g7QUFDSjtBQTl1Q2tCLENBQVQsQ0FBZDtBQWt2Q0FDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjFQLEVBQUUsQ0FBQ0MsUUFBcEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNvbnN0IFRyYWNrRW50cnlMaXN0ZW5lcnMgPSByZXF1aXJlKCcuL3RyYWNrLWVudHJ5LWxpc3RlbmVycycpO1xuY29uc3QgUmVuZGVyQ29tcG9uZW50ID0gcmVxdWlyZSgnLi4vLi4vY29jb3MyZC9jb3JlL2NvbXBvbmVudHMvQ0NSZW5kZXJDb21wb25lbnQnKTtcbmNvbnN0IHNwaW5lID0gcmVxdWlyZSgnLi9saWIvc3BpbmUnKTtcbmNvbnN0IEdyYXBoaWNzID0gcmVxdWlyZSgnLi4vLi4vY29jb3MyZC9jb3JlL2dyYXBoaWNzL2dyYXBoaWNzJyk7XG5jb25zdCBSZW5kZXJGbG93ID0gcmVxdWlyZSgnLi4vLi4vY29jb3MyZC9jb3JlL3JlbmRlcmVyL3JlbmRlci1mbG93Jyk7XG5jb25zdCBGTEFHX1BPU1RfUkVOREVSID0gUmVuZGVyRmxvdy5GTEFHX1BPU1RfUkVOREVSO1xuXG5sZXQgU2tlbGV0b25DYWNoZSA9IHJlcXVpcmUoJy4vc2tlbGV0b24tY2FjaGUnKTtcbmxldCBBdHRhY2hVdGlsID0gcmVxdWlyZSgnLi9BdHRhY2hVdGlsJyk7XG5cbi8qKlxuICogQG1vZHVsZSBzcFxuICovXG5sZXQgRGVmYXVsdFNraW5zRW51bSA9IGNjLkVudW0oeyAnZGVmYXVsdCc6IC0xIH0pO1xubGV0IERlZmF1bHRBbmltc0VudW0gPSBjYy5FbnVtKHsgJzxOb25lPic6IDAgfSk7XG5cbi8qKlxuICogISNlbiBFbnVtIGZvciBhbmltYXRpb24gY2FjaGUgbW9kZSB0eXBlLlxuICogISN6aCBTcGluZeWKqOeUu+e8k+WtmOexu+Wei1xuICogQGVudW0gU2tlbGV0b24uQW5pbWF0aW9uQ2FjaGVNb2RlXG4gKi9cbmxldCBBbmltYXRpb25DYWNoZU1vZGUgPSBjYy5FbnVtKHtcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSByZWFsdGltZSBtb2RlLlxuICAgICAqICEjemgg5a6e5pe26K6h566X5qih5byP44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFJFQUxUSU1FXG4gICAgICovXG4gICAgUkVBTFRJTUU6IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgc2hhcmVkIGNhY2hlIG1vZGUuXG4gICAgICogISN6aCDlhbHkuqvnvJPlrZjmqKHlvI/jgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gU0hBUkVEX0NBQ0hFXG4gICAgICovXG4gICAgU0hBUkVEX0NBQ0hFOiAxLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHByaXZhdGUgY2FjaGUgbW9kZS5cbiAgICAgKiAhI3poIOengeaciee8k+WtmOaooeW8j+OAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBQUklWQVRFX0NBQ0hFXG4gICAgICovXG4gICAgUFJJVkFURV9DQUNIRTogMiBcbn0pO1xuXG5mdW5jdGlvbiBzZXRFbnVtQXR0ciAob2JqLCBwcm9wTmFtZSwgZW51bURlZikge1xuICAgIGNjLkNsYXNzLkF0dHIuc2V0Q2xhc3NBdHRyKG9iaiwgcHJvcE5hbWUsICd0eXBlJywgJ0VudW0nKTtcbiAgICBjYy5DbGFzcy5BdHRyLnNldENsYXNzQXR0cihvYmosIHByb3BOYW1lLCAnZW51bUxpc3QnLCBjYy5FbnVtLmdldExpc3QoZW51bURlZikpO1xufVxuXG4vKipcbiAqICEjZW5cbiAqIFRoZSBza2VsZXRvbiBvZiBTcGluZSA8YnIvPlxuICogPGJyLz5cbiAqIChTa2VsZXRvbiBoYXMgYSByZWZlcmVuY2UgdG8gYSBTa2VsZXRvbkRhdGEgYW5kIHN0b3JlcyB0aGUgc3RhdGUgZm9yIHNrZWxldG9uIGluc3RhbmNlLFxuICogd2hpY2ggY29uc2lzdHMgb2YgdGhlIGN1cnJlbnQgcG9zZSdzIGJvbmUgU1JULCBzbG90IGNvbG9ycywgYW5kIHdoaWNoIHNsb3QgYXR0YWNobWVudHMgYXJlIHZpc2libGUuIDxici8+XG4gKiBNdWx0aXBsZSBza2VsZXRvbnMgY2FuIHVzZSB0aGUgc2FtZSBTa2VsZXRvbkRhdGEgd2hpY2ggaW5jbHVkZXMgYWxsIGFuaW1hdGlvbnMsIHNraW5zLCBhbmQgYXR0YWNobWVudHMuKSA8YnIvPlxuICogISN6aFxuICogU3BpbmUg6aqo6aq85Yqo55S7IDxici8+XG4gKiA8YnIvPlxuICogKFNrZWxldG9uIOWFt+acieWvuemqqOmqvOaVsOaNrueahOW8leeUqOW5tuS4lOWtmOWCqOS6humqqOmqvOWunuS+i+eahOeKtuaAge+8jFxuICog5a6D55Sx5b2T5YmN55qE6aqo6aq85Yqo5L2c77yMc2xvdCDpopzoibLvvIzlkozlj6/op4HnmoQgc2xvdCBhdHRhY2htZW50cyDnu4TmiJDjgII8YnIvPlxuICog5aSa5LiqIFNrZWxldG9uIOWPr+S7peS9v+eUqOebuOWQjOeahOmqqOmqvOaVsOaNru+8jOWFtuS4reWMheaLrOaJgOacieeahOWKqOeUu++8jOearuiCpOWSjCBhdHRhY2htZW50c+OAglxuICpcbiAqIEBjbGFzcyBTa2VsZXRvblxuICogQGV4dGVuZHMgUmVuZGVyQ29tcG9uZW50XG4gKi9cbnNwLlNrZWxldG9uID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdzcC5Ta2VsZXRvbicsXG4gICAgZXh0ZW5kczogUmVuZGVyQ29tcG9uZW50LFxuICAgIGVkaXRvcjogQ0NfRURJVE9SICYmIHtcbiAgICAgICAgbWVudTogJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC5yZW5kZXJlcnMvU3BpbmUgU2tlbGV0b24nLFxuICAgICAgICBoZWxwOiAnYXBwOi8vZG9jcy9odG1sL2NvbXBvbmVudHMvc3BpbmUuaHRtbCcsXG4gICAgICAgIGluc3BlY3RvcjogJ3BhY2thZ2VzOi8vaW5zcGVjdG9yL2luc3BlY3RvcnMvY29tcHMvc2tlbGV0b24yZC5qcycsXG4gICAgfSxcblxuICAgIHN0YXRpY3M6IHtcbiAgICAgICAgQW5pbWF0aW9uQ2FjaGVNb2RlOiBBbmltYXRpb25DYWNoZU1vZGUsXG4gICAgfSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIHNrZWxldGFsIGFuaW1hdGlvbiBpcyBwYXVzZWQ/XG4gICAgICAgICAqICEjemgg6K+l6aqo6aq85Yqo55S75piv5ZCm5pqC5YGc44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBwYXVzZWRcbiAgICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgICAqIEByZWFkT25seVxuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgcGF1c2VkOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIHNrZWxldG9uIGRhdGEgY29udGFpbnMgdGhlIHNrZWxldG9uIGluZm9ybWF0aW9uIChiaW5kIHBvc2UgYm9uZXMsIHNsb3RzLCBkcmF3IG9yZGVyLFxuICAgICAgICAgKiBhdHRhY2htZW50cywgc2tpbnMsIGV0YykgYW5kIGFuaW1hdGlvbnMgYnV0IGRvZXMgbm90IGhvbGQgYW55IHN0YXRlLjxici8+XG4gICAgICAgICAqIE11bHRpcGxlIHNrZWxldG9ucyBjYW4gc2hhcmUgdGhlIHNhbWUgc2tlbGV0b24gZGF0YS5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDpqqjpqrzmlbDmja7ljIXlkKvkuobpqqjpqrzkv6Hmga/vvIjnu5HlrprpqqjpqrzliqjkvZzvvIxzbG90c++8jOa4suafk+mhuuW6j++8jFxuICAgICAgICAgKiBhdHRhY2htZW50c++8jOearuiCpOetieetie+8ieWSjOWKqOeUu+S9huS4jeaMgeacieS7u+S9leeKtuaAgeOAgjxici8+XG4gICAgICAgICAqIOWkmuS4qiBTa2VsZXRvbiDlj6/ku6XlhbHnlKjnm7jlkIznmoTpqqjpqrzmlbDmja7jgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtzcC5Ta2VsZXRvbkRhdGF9IHNrZWxldG9uRGF0YVxuICAgICAgICAgKi9cbiAgICAgICAgc2tlbGV0b25EYXRhOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogc3AuU2tlbGV0b25EYXRhLFxuICAgICAgICAgICAgbm90aWZ5ICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRTa2luID0gJyc7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0QW5pbWF0aW9uID0gJyc7XG4gICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZWZyZXNoSW5zcGVjdG9yKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVNrZWxldG9uRGF0YSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuc2tlbGV0b24uc2tlbGV0b25fZGF0YSdcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDnlLHkuo4gc3BpbmUg55qEIHNraW4g5piv5peg5rOV5LqM5qyh5pu/5o2i55qE77yM5omA5Lul5Y+q6IO96K6+572u6buY6K6k55qEIHNraW5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIG5hbWUgb2YgZGVmYXVsdCBza2luLlxuICAgICAgICAgKiAhI3poIOm7mOiupOeahOearuiCpOWQjeensOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gZGVmYXVsdFNraW5cbiAgICAgICAgICovXG4gICAgICAgIGRlZmF1bHRTa2luOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAnJyxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIG5hbWUgb2YgZGVmYXVsdCBhbmltYXRpb24uXG4gICAgICAgICAqICEjemgg6buY6K6k55qE5Yqo55S75ZCN56ew44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBkZWZhdWx0QW5pbWF0aW9uXG4gICAgICAgICAqL1xuICAgICAgICBkZWZhdWx0QW5pbWF0aW9uOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAnJyxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIG5hbWUgb2YgY3VycmVudCBwbGF5aW5nIGFuaW1hdGlvbi5cbiAgICAgICAgICogISN6aCDlvZPliY3mkq3mlL7nmoTliqjnlLvlkI3np7DjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtTdHJpbmd9IGFuaW1hdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgYW5pbWF0aW9uOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzQW5pbWF0aW9uQ2FjaGVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FuaW1hdGlvbk5hbWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy5nZXRDdXJyZW50KDApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGVudHJ5ICYmIGVudHJ5LmFuaW1hdGlvbi5uYW1lKSB8fCBcIlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0QW5pbWF0aW9uID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uKDAsIHZhbHVlLCB0aGlzLmxvb3ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICghdGhpcy5pc0FuaW1hdGlvbkNhY2hlZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJUcmFjaygwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRUb1NldHVwUG9zZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gX2RlZmF1bHRTa2luSW5kZXhcbiAgICAgICAgICovXG4gICAgICAgIF9kZWZhdWx0U2tpbkluZGV4OiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNrZWxldG9uRGF0YSAmJiB0aGlzLmRlZmF1bHRTa2luKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBza2luc0VudW0gPSB0aGlzLnNrZWxldG9uRGF0YS5nZXRTa2luc0VudW0oKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNraW5zRW51bSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNraW5JbmRleCA9IHNraW5zRW51bVt0aGlzLmRlZmF1bHRTa2luXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChza2luSW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBza2luSW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBza2luc0VudW07XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2tlbGV0b25EYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHNraW5zRW51bSA9IHRoaXMuc2tlbGV0b25EYXRhLmdldFNraW5zRW51bSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoICFza2luc0VudW0gKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYy5lcnJvcklEKCcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHNraW5OYW1lID0gc2tpbnNFbnVtW3ZhbHVlXTtcbiAgICAgICAgICAgICAgICBpZiAoc2tpbk5hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRTa2luID0gc2tpbk5hbWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U2tpbih0aGlzLmRlZmF1bHRTa2luKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUiAmJiAhY2MuZW5naW5lLmlzUGxheWluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVmcmVzaEluc3BlY3RvcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDc1MDEsIHRoaXMubmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6IERlZmF1bHRTa2luc0VudW0sXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgICAgICAgZGlzcGxheU5hbWU6IFwiRGVmYXVsdCBTa2luXCIsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNrZWxldG9uLmRlZmF1bHRfc2tpbidcbiAgICAgICAgfSxcblxuICAgICAgICAvLyB2YWx1ZSBvZiAwIHJlcHJlc2VudHMgbm8gYW5pbWF0aW9uXG4gICAgICAgIF9hbmltYXRpb25JbmRleDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYW5pbWF0aW9uTmFtZSA9ICghQ0NfRURJVE9SIHx8IGNjLmVuZ2luZS5pc1BsYXlpbmcpID8gdGhpcy5hbmltYXRpb24gOiB0aGlzLmRlZmF1bHRBbmltYXRpb247XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2tlbGV0b25EYXRhICYmIGFuaW1hdGlvbk5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFuaW1zRW51bSA9IHRoaXMuc2tlbGV0b25EYXRhLmdldEFuaW1zRW51bSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5pbXNFbnVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYW5pbUluZGV4ID0gYW5pbXNFbnVtW2FuaW1hdGlvbk5hbWVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuaW1JbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFuaW1JbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGFuaW1zRW51bTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5za2VsZXRvbkRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgYW5pbXNFbnVtID0gdGhpcy5za2VsZXRvbkRhdGEuZ2V0QW5pbXNFbnVtKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICggIWFuaW1zRW51bSApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNjLmVycm9ySUQoNzUwMiwgdGhpcy5uYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGFuaW1OYW1lID0gYW5pbXNFbnVtW3ZhbHVlXTtcbiAgICAgICAgICAgICAgICBpZiAoYW5pbU5hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbiA9IGFuaW1OYW1lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2MuZXJyb3JJRCg3NTAzLCB0aGlzLm5hbWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6IERlZmF1bHRBbmltc0VudW0sXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdBbmltYXRpb24nLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5za2VsZXRvbi5hbmltYXRpb24nXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gUmVjb3JkIHByZSBjYWNoZSBtb2RlLlxuICAgICAgICBfcHJlQ2FjaGVNb2RlOiAtMSxcbiAgICAgICAgX2NhY2hlTW9kZTogQW5pbWF0aW9uQ2FjaGVNb2RlLlJFQUxUSU1FLFxuICAgICAgICBfZGVmYXVsdENhY2hlTW9kZToge1xuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgICAgIHR5cGU6IEFuaW1hdGlvbkNhY2hlTW9kZSxcbiAgICAgICAgICAgIG5vdGlmeSAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRBbmltYXRpb25DYWNoZU1vZGUodGhpcy5fZGVmYXVsdENhY2hlTW9kZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZWRpdG9yT25seTogdHJ1ZSxcbiAgICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBcIkFuaW1hdGlvbiBDYWNoZSBNb2RlXCIsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNrZWxldG9uLmFuaW1hdGlvbl9jYWNoZV9tb2RlJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRPRE9cbiAgICAgICAgICogISN6aCDmmK/lkKblvqrnjq/mkq3mlL7lvZPliY3pqqjpqrzliqjnlLvjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBsb29wXG4gICAgICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgICAgICovXG4gICAgICAgIGxvb3A6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNrZWxldG9uLmxvb3AnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gSW5kaWNhdGVzIHdoZXRoZXIgdG8gZW5hYmxlIHByZW11bHRpcGxpZWQgYWxwaGEuXG4gICAgICAgICAqIFlvdSBzaG91bGQgZGlzYWJsZSB0aGlzIG9wdGlvbiB3aGVuIGltYWdlJ3MgdHJhbnNwYXJlbnQgYXJlYSBhcHBlYXJzIHRvIGhhdmUgb3BhcXVlIHBpeGVscyxcbiAgICAgICAgICogb3IgZW5hYmxlIHRoaXMgb3B0aW9uIHdoZW4gaW1hZ2UncyBoYWxmIHRyYW5zcGFyZW50IGFyZWEgYXBwZWFycyB0byBiZSBkYXJrZW4uXG4gICAgICAgICAqICEjemgg5piv5ZCm5ZCv55So6LS05Zu+6aKE5LmY44CCXG4gICAgICAgICAqIOW9k+WbvueJh+eahOmAj+aYjuWMuuWfn+WHuueOsOiJsuWdl+aXtumcgOimgeWFs+mXreivpemAiemhue+8jOW9k+WbvueJh+eahOWNiumAj+aYjuWMuuWfn+minOiJsuWPmOm7keaXtumcgOimgeWQr+eUqOivpemAiemhueOAglxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IHByZW11bHRpcGxpZWRBbHBoYVxuICAgICAgICAgKiBAZGVmYXVsdCB0cnVlXG4gICAgICAgICAqL1xuICAgICAgICBwcmVtdWx0aXBsaWVkQWxwaGE6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNrZWxldG9uLnByZW11bHRpcGxpZWRBbHBoYSdcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgdGltZSBzY2FsZSBvZiB0aGlzIHNrZWxldG9uLlxuICAgICAgICAgKiAhI3poIOW9k+WJjemqqOmqvOS4reaJgOacieWKqOeUu+eahOaXtumXtOe8qeaUvueOh+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gdGltZVNjYWxlXG4gICAgICAgICAqIEBkZWZhdWx0IDFcbiAgICAgICAgICovXG4gICAgICAgIHRpbWVTY2FsZToge1xuICAgICAgICAgICAgZGVmYXVsdDogMSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuc2tlbGV0b24udGltZV9zY2FsZSdcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBJbmRpY2F0ZXMgd2hldGhlciBvcGVuIGRlYnVnIHNsb3RzLlxuICAgICAgICAgKiAhI3poIOaYr+WQpuaYvuekuiBzbG90IOeahCBkZWJ1ZyDkv6Hmga/jgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBkZWJ1Z1Nsb3RzXG4gICAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgICAqL1xuICAgICAgICBkZWJ1Z1Nsb3RzOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgIGVkaXRvck9ubHk6IHRydWUsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNrZWxldG9uLmRlYnVnX3Nsb3RzJyxcbiAgICAgICAgICAgIG5vdGlmeSAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlRGVidWdEcmF3KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gSW5kaWNhdGVzIHdoZXRoZXIgb3BlbiBkZWJ1ZyBib25lcy5cbiAgICAgICAgICogISN6aCDmmK/lkKbmmL7npLogYm9uZSDnmoQgZGVidWcg5L+h5oGv44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZGVidWdCb25lc1xuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgZGVidWdCb25lczoge1xuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgICBlZGl0b3JPbmx5OiB0cnVlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5za2VsZXRvbi5kZWJ1Z19ib25lcycsXG4gICAgICAgICAgICBub3RpZnkgKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZURlYnVnRHJhdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIEluZGljYXRlcyB3aGV0aGVyIG9wZW4gZGVidWcgbWVzaC5cbiAgICAgICAgICogISN6aCDmmK/lkKbmmL7npLogbWVzaCDnmoQgZGVidWcg5L+h5oGv44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZGVidWdNZXNoXG4gICAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgICAqL1xuICAgICAgICBkZWJ1Z01lc2g6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgICAgZWRpdG9yT25seTogdHJ1ZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuc2tlbGV0b24uZGVidWdfbWVzaCcsXG4gICAgICAgICAgICBub3RpZnkgKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZURlYnVnRHJhdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIEVuYWJsZWQgdHdvIGNvbG9yIHRpbnQuXG4gICAgICAgICAqICEjemgg5piv5ZCm5ZCv55So5p+T6Imy5pWI5p6c44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gdXNlVGludFxuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgdXNlVGludDoge1xuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNrZWxldG9uLnVzZV90aW50JyxcbiAgICAgICAgICAgIG5vdGlmeSAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlVXNlVGludCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIEVuYWJsZWQgYmF0Y2ggbW9kZWwsIGlmIHNrZWxldG9uIGlzIGNvbXBsZXgsIGRvIG5vdCBlbmFibGUgYmF0Y2gsIG9yIHdpbGwgbG93ZXIgcGVyZm9ybWFuY2UuXG4gICAgICAgICAqICEjemgg5byA5ZCv5ZCI5om577yM5aaC5p6c5riy5p+T5aSn6YeP55u45ZCM57q555CG77yM5LiU57uT5p6E566A5Y2V55qE6aqo6aq85Yqo55S777yM5byA5ZCv5ZCI5om55Y+v5Lul6ZmN5L2OZHJhd2NhbGzvvIzlkKbliJnor7fkuI3opoHlvIDlkK/vvIxjcHXmtojogJfkvJrkuIrljYfjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBlbmFibGVCYXRjaFxuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgZW5hYmxlQmF0Y2g6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgICAgbm90aWZ5ICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVCYXRjaCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuc2tlbGV0b24uZW5hYmxlZF9iYXRjaCdcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBCZWxvdyBwcm9wZXJ0aWVzIHdpbGwgZWZmZWN0IHdoZW4gY2FjaGUgbW9kZSBpcyBTSEFSRURfQ0FDSEUgb3IgUFJJVkFURV9DQUNIRS5cbiAgICAgICAgLy8gYWNjdW11bGF0ZSB0aW1lXG4gICAgICAgIF9hY2NUaW1lOiAwLFxuICAgICAgICAvLyBQbGF5IHRpbWVzIGNvdW50ZXJcbiAgICAgICAgX3BsYXlDb3VudDogMCxcbiAgICAgICAgLy8gRnJhbWUgY2FjaGVcbiAgICAgICAgX2ZyYW1lQ2FjaGU6IG51bGwsXG4gICAgICAgIC8vIEN1ciBmcmFtZVxuICAgICAgICBfY3VyRnJhbWU6IG51bGwsXG4gICAgICAgIC8vIFNrZWxldG9uIGNhY2hlXG4gICAgICAgIF9za2VsZXRvbkNhY2hlIDogbnVsbCxcbiAgICAgICAgLy8gQWltYXRpb24gbmFtZVxuICAgICAgICBfYW5pbWF0aW9uTmFtZSA6IFwiXCIsXG4gICAgICAgIC8vIEFuaW1hdGlvbiBxdWV1ZVxuICAgICAgICBfYW5pbWF0aW9uUXVldWUgOiBbXSxcbiAgICAgICAgLy8gSGVhZCBhbmltYXRpb24gaW5mbyBvZiBcbiAgICAgICAgX2hlYWRBbmlJbmZvIDogbnVsbCxcbiAgICAgICAgLy8gUGxheSB0aW1lc1xuICAgICAgICBfcGxheVRpbWVzIDogMCxcbiAgICAgICAgLy8gSXMgYW5pbWF0aW9uIGNvbXBsZXRlLlxuICAgICAgICBfaXNBbmlDb21wbGV0ZSA6IHRydWUsXG4gICAgfSxcblxuICAgIC8vIENPTlNUUlVDVE9SXG4gICAgY3RvciAoKSB7XG4gICAgICAgIHRoaXMuX2VmZmVjdERlbGVnYXRlID0gbnVsbDtcbiAgICAgICAgdGhpcy5fc2tlbGV0b24gPSBudWxsO1xuICAgICAgICB0aGlzLl9yb290Qm9uZSA9IG51bGw7XG4gICAgICAgIHRoaXMuX2xpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5fbWF0ZXJpYWxDYWNoZSA9IHt9O1xuICAgICAgICB0aGlzLl9kZWJ1Z1JlbmRlcmVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5fc3RhcnRTbG90SW5kZXggPSAtMTtcbiAgICAgICAgdGhpcy5fZW5kU2xvdEluZGV4ID0gLTE7XG4gICAgICAgIHRoaXMuX3N0YXJ0RW50cnkgPSB7YW5pbWF0aW9uIDoge25hbWUgOiBcIlwifSwgdHJhY2tJbmRleCA6IDB9O1xuICAgICAgICB0aGlzLl9lbmRFbnRyeSA9IHthbmltYXRpb24gOiB7bmFtZSA6IFwiXCJ9LCB0cmFja0luZGV4IDogMH07XG4gICAgICAgIHRoaXMuYXR0YWNoVXRpbCA9IG5ldyBBdHRhY2hVdGlsKCk7XG4gICAgfSxcblxuICAgIC8vIG92ZXJyaWRlIGJhc2UgY2xhc3MgX2dldERlZmF1bHRNYXRlcmlhbCB0byBtb2RpZnkgZGVmYXVsdCBtYXRlcmlhbFxuICAgIF9nZXREZWZhdWx0TWF0ZXJpYWwgKCkge1xuICAgICAgICByZXR1cm4gY2MuTWF0ZXJpYWwuZ2V0QnVpbHRpbk1hdGVyaWFsKCcyZC1zcGluZScpO1xuICAgIH0sXG5cbiAgICAvLyBvdmVycmlkZSBiYXNlIGNsYXNzIF91cGRhdGVNYXRlcmlhbCB0byBzZXQgZGVmaW5lIHZhbHVlIGFuZCBjbGVhciBtYXRlcmlhbCBjYWNoZVxuICAgIF91cGRhdGVNYXRlcmlhbCAoKSB7XG4gICAgICAgIGxldCB1c2VUaW50ID0gdGhpcy51c2VUaW50IHx8ICh0aGlzLmlzQW5pbWF0aW9uQ2FjaGVkKCkgJiYgIUNDX05BVElWRVJFTkRFUkVSKTtcbiAgICAgICAgbGV0IGJhc2VNYXRlcmlhbCA9IHRoaXMuZ2V0TWF0ZXJpYWwoMCk7XG4gICAgICAgIGlmIChiYXNlTWF0ZXJpYWwpIHtcbiAgICAgICAgICAgIGJhc2VNYXRlcmlhbC5kZWZpbmUoJ1VTRV9USU5UJywgdXNlVGludCk7XG4gICAgICAgICAgICBiYXNlTWF0ZXJpYWwuZGVmaW5lKCdDQ19VU0VfTU9ERUwnLCAhdGhpcy5lbmFibGVCYXRjaCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbWF0ZXJpYWxDYWNoZSA9IHt9O1xuICAgIH0sXG5cbiAgICAvLyBvdmVycmlkZSBiYXNlIGNsYXNzIGRpc2FibGVSZW5kZXIgdG8gY2xlYXIgcG9zdCByZW5kZXIgZmxhZ1xuICAgIGRpc2FibGVSZW5kZXIgKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICB0aGlzLm5vZGUuX3JlbmRlckZsYWcgJj0gfkZMQUdfUE9TVF9SRU5ERVI7XG4gICAgfSxcblxuICAgIC8vIG92ZXJyaWRlIGJhc2UgY2xhc3MgZGlzYWJsZVJlbmRlciB0byBhZGQgcG9zdCByZW5kZXIgZmxhZ1xuICAgIG1hcmtGb3JSZW5kZXIgKGVuYWJsZSkge1xuICAgICAgICB0aGlzLl9zdXBlcihlbmFibGUpO1xuICAgICAgICBpZiAoZW5hYmxlKSB7XG4gICAgICAgICAgICB0aGlzLm5vZGUuX3JlbmRlckZsYWcgfD0gRkxBR19QT1NUX1JFTkRFUjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5fcmVuZGVyRmxhZyAmPSB+RkxBR19QT1NUX1JFTkRFUjtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBpZiBjaGFuZ2UgdXNlIHRpbnQgbW9kZSwganVzdCBjbGVhciBtYXRlcmlhbCBjYWNoZVxuICAgIF91cGRhdGVVc2VUaW50ICgpIHtcbiAgICAgICAgbGV0IGJhc2VNYXRlcmlhbCA9IHRoaXMuZ2V0TWF0ZXJpYWwoMCk7XG4gICAgICAgIGlmIChiYXNlTWF0ZXJpYWwpIHtcbiAgICAgICAgICAgIGxldCB1c2VUaW50ID0gdGhpcy51c2VUaW50IHx8ICh0aGlzLmlzQW5pbWF0aW9uQ2FjaGVkKCkgJiYgIUNDX05BVElWRVJFTkRFUkVSKTtcbiAgICAgICAgICAgIGJhc2VNYXRlcmlhbC5kZWZpbmUoJ1VTRV9USU5UJywgdXNlVGludCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbWF0ZXJpYWxDYWNoZSA9IHt9O1xuICAgIH0sXG5cbiAgICAvLyBpZiBjaGFuZ2UgdXNlIGJhdGNoIG1vZGUsIGp1c3QgY2xlYXIgbWF0ZXJpYWwgY2FjaGVcbiAgICBfdXBkYXRlQmF0Y2ggKCkge1xuICAgICAgICBsZXQgYmFzZU1hdGVyaWFsID0gdGhpcy5nZXRNYXRlcmlhbCgwKTtcbiAgICAgICAgaWYgKGJhc2VNYXRlcmlhbCkge1xuICAgICAgICAgICAgYmFzZU1hdGVyaWFsLmRlZmluZSgnQ0NfVVNFX01PREVMJywgIXRoaXMuZW5hYmxlQmF0Y2gpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX21hdGVyaWFsQ2FjaGUgPSB7fTtcbiAgICB9LFxuXG4gICAgX3ZhbGlkYXRlUmVuZGVyICgpIHtcbiAgICAgICAgbGV0IHNrZWxldG9uRGF0YSA9IHRoaXMuc2tlbGV0b25EYXRhO1xuICAgICAgICBpZiAoIXNrZWxldG9uRGF0YSB8fCAhc2tlbGV0b25EYXRhLmlzVGV4dHVyZXNMb2FkZWQoKSkge1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxlUmVuZGVyKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNldHMgcnVudGltZSBza2VsZXRvbiBkYXRhIHRvIHNwLlNrZWxldG9uLjxicj5cbiAgICAgKiBUaGlzIG1ldGhvZCBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgYHNrZWxldG9uRGF0YWAgcHJvcGVydHkuIFRoaXMgbWV0aG9kIGlzIHBhc3NlZCBpbiB0aGUgcmF3IGRhdGEgcHJvdmlkZWQgYnkgdGhlIFNwaW5lIHJ1bnRpbWUsIGFuZCB0aGUgc2tlbGV0b25EYXRhIHR5cGUgaXMgdGhlIGFzc2V0IHR5cGUgcHJvdmlkZWQgYnkgQ3JlYXRvci5cbiAgICAgKiAhI3poXG4gICAgICog6K6+572u5bqV5bGC6L+Q6KGM5pe255So5Yiw55qEIFNrZWxldG9uRGF0YeOAgjxicj5cbiAgICAgKiDov5nkuKrmjqXlj6PmnInliKvkuo4gYHNrZWxldG9uRGF0YWAg5bGe5oCn77yM6L+Z5Liq5o6l5Y+j5Lyg5YWl55qE5pivIFNwaW5lIHJ1bnRpbWUg5o+Q5L6b55qE5Y6f5aeL5pWw5o2u77yM6ICMIHNrZWxldG9uRGF0YSDnmoTnsbvlnovmmK8gQ3JlYXRvciDmj5DkvpvnmoTotYTmupDnsbvlnovjgIJcbiAgICAgKiBAbWV0aG9kIHNldFNrZWxldG9uRGF0YVxuICAgICAqIEBwYXJhbSB7c3Auc3BpbmUuU2tlbGV0b25EYXRhfSBza2VsZXRvbkRhdGFcbiAgICAgKi9cbiAgICBzZXRTa2VsZXRvbkRhdGEgKHNrZWxldG9uRGF0YSkge1xuICAgICAgICBpZiAoc2tlbGV0b25EYXRhLndpZHRoICE9IG51bGwgJiYgc2tlbGV0b25EYXRhLmhlaWdodCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLm5vZGUuc2V0Q29udGVudFNpemUoc2tlbGV0b25EYXRhLndpZHRoLCBza2VsZXRvbkRhdGEuaGVpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fY2FjaGVNb2RlID09PSBBbmltYXRpb25DYWNoZU1vZGUuU0hBUkVEX0NBQ0hFKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2tlbGV0b25DYWNoZSA9IFNrZWxldG9uQ2FjaGUuc2hhcmVkQ2FjaGU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2NhY2hlTW9kZSA9PT0gQW5pbWF0aW9uQ2FjaGVNb2RlLlBSSVZBVEVfQ0FDSEUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9za2VsZXRvbkNhY2hlID0gbmV3IFNrZWxldG9uQ2FjaGU7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2tlbGV0b25DYWNoZS5lbmFibGVQcml2YXRlTW9kZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNBbmltYXRpb25DYWNoZWQoKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZGVidWdCb25lcyB8fCB0aGlzLmRlYnVnU2xvdHMpIHtcbiAgICAgICAgICAgICAgICBjYy53YXJuKFwiRGVidWcgYm9uZXMgb3Igc2xvdHMgaXMgaW52YWxpZCBpbiBjYWNoZWQgbW9kZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBza2VsZXRvbkluZm8gPSB0aGlzLl9za2VsZXRvbkNhY2hlLmdldFNrZWxldG9uQ2FjaGUodGhpcy5za2VsZXRvbkRhdGEuX3V1aWQsIHNrZWxldG9uRGF0YSk7XG4gICAgICAgICAgICB0aGlzLl9za2VsZXRvbiA9IHNrZWxldG9uSW5mby5za2VsZXRvbjtcbiAgICAgICAgICAgIHRoaXMuX2NsaXBwZXIgPSBza2VsZXRvbkluZm8uY2xpcHBlcjtcbiAgICAgICAgICAgIHRoaXMuX3Jvb3RCb25lID0gdGhpcy5fc2tlbGV0b24uZ2V0Um9vdEJvbmUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3NrZWxldG9uID0gbmV3IHNwaW5lLlNrZWxldG9uKHNrZWxldG9uRGF0YSk7XG4gICAgICAgICAgICB0aGlzLl9jbGlwcGVyID0gbmV3IHNwaW5lLlNrZWxldG9uQ2xpcHBpbmcoKTtcbiAgICAgICAgICAgIHRoaXMuX3Jvb3RCb25lID0gdGhpcy5fc2tlbGV0b24uZ2V0Um9vdEJvbmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubWFya0ZvclJlbmRlcih0cnVlKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXRzIHNsb3RzIHZpc2libGUgcmFuZ2UuXG4gICAgICogISN6aCDorr7nva7pqqjpqrzmj5Lmp73lj6/op4bojIPlm7TjgIJcbiAgICAgKiBAbWV0aG9kIHNldFNsb3RzUmFuZ2VcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhcnRTbG90SW5kZXhcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZW5kU2xvdEluZGV4XG4gICAgICovXG4gICAgc2V0U2xvdHNSYW5nZSAoc3RhcnRTbG90SW5kZXgsIGVuZFNsb3RJbmRleCkge1xuICAgICAgICBpZiAodGhpcy5pc0FuaW1hdGlvbkNhY2hlZCgpKSB7XG4gICAgICAgICAgICBjYy53YXJuKFwiU2xvdHMgdmlzaWJsZSByYW5nZSBjYW4gbm90IGJlIG1vZGlmaWVkIGluIGNhY2hlZCBtb2RlLlwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0U2xvdEluZGV4ID0gc3RhcnRTbG90SW5kZXg7XG4gICAgICAgICAgICB0aGlzLl9lbmRTbG90SW5kZXggPSBlbmRTbG90SW5kZXg7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXRzIGFuaW1hdGlvbiBzdGF0ZSBkYXRhLjxicj5cbiAgICAgKiBUaGUgcGFyYW1ldGVyIHR5cGUgaXMge3sjY3Jvc3NMaW5rTW9kdWxlIFwic3Auc3BpbmVcIn19c3Auc3BpbmV7ey9jcm9zc0xpbmtNb2R1bGV9fS5BbmltYXRpb25TdGF0ZURhdGEuXG4gICAgICogISN6aCDorr7nva7liqjnlLvnirbmgIHmlbDmja7jgII8YnI+XG4gICAgICog5Y+C5pWw5pivIHt7I2Nyb3NzTGlua01vZHVsZSBcInNwLnNwaW5lXCJ9fXNwLnNwaW5le3svY3Jvc3NMaW5rTW9kdWxlfX0uQW5pbWF0aW9uU3RhdGVEYXRh44CCXG4gICAgICogQG1ldGhvZCBzZXRBbmltYXRpb25TdGF0ZURhdGFcbiAgICAgKiBAcGFyYW0ge3NwLnNwaW5lLkFuaW1hdGlvblN0YXRlRGF0YX0gc3RhdGVEYXRhXG4gICAgICovXG4gICAgc2V0QW5pbWF0aW9uU3RhdGVEYXRhIChzdGF0ZURhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNBbmltYXRpb25DYWNoZWQoKSkge1xuICAgICAgICAgICAgY2Mud2FybihcIidzZXRBbmltYXRpb25TdGF0ZURhdGEnIGludGVyZmFjZSBjYW4gbm90IGJlIGludm9rZWQgaW4gY2FjaGVkIG1vZGUuXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHN0YXRlID0gbmV3IHNwaW5lLkFuaW1hdGlvblN0YXRlKHN0YXRlRGF0YSk7XG4gICAgICAgICAgICBpZiAodGhpcy5fbGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fc3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RhdGUucmVtb3ZlTGlzdGVuZXIodGhpcy5fbGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdGF0ZS5hZGRMaXN0ZW5lcih0aGlzLl9saXN0ZW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH0sXG5cbiAgICAvLyBJTVBMRU1FTlRcbiAgICBfX3ByZWxvYWQgKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICB2YXIgRmxhZ3MgPSBjYy5PYmplY3QuRmxhZ3M7XG4gICAgICAgICAgICB0aGlzLl9vYmpGbGFncyB8PSAoRmxhZ3MuSXNBbmNob3JMb2NrZWQgfCBGbGFncy5Jc1NpemVMb2NrZWQpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9yZWZyZXNoSW5zcGVjdG9yKCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLm5vZGUuY2hpbGRyZW47XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGlmIChjaGlsZCAmJiBjaGlsZC5fbmFtZSA9PT0gXCJERUJVR19EUkFXX05PREVcIiApIHtcbiAgICAgICAgICAgICAgICBjaGlsZC5kZXN0cm95KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl91cGRhdGVTa2VsZXRvbkRhdGEoKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlRGVidWdEcmF3KCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVVzZVRpbnQoKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlQmF0Y2goKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEl0J3MgYmVzdCB0byBzZXQgY2FjaGUgbW9kZSBiZWZvcmUgc2V0IHByb3BlcnR5ICdkcmFnb25Bc3NldCcsIG9yIHdpbGwgd2FzdGUgc29tZSBjcHUgdGltZS5cbiAgICAgKiBJZiBzZXQgdGhlIG1vZGUgaW4gZWRpdG9yLCB0aGVuIG5vIG5lZWQgdG8gd29ycnkgYWJvdXQgb3JkZXIgcHJvYmxlbS5cbiAgICAgKiAhI3poIFxuICAgICAqIOiLpeaDs+WIh+aNoua4suafk+aooeW8j++8jOacgOWlveWcqOiuvue9ridkcmFnb25Bc3NldCfkuYvliY3vvIzlhYjorr7nva7lpb3muLLmn5PmqKHlvI/vvIzlkKbliJnmnInov5DooYzml7blvIDplIDjgIJcbiAgICAgKiDoi6XlnKjnvJbovpHkuK3orr7nva7muLLmn5PmqKHlvI/vvIzliJnml6DpnIDmi4Xlv4Porr7nva7mrKHluo/nmoTpl67popjjgIJcbiAgICAgKiBcbiAgICAgKiBAbWV0aG9kIHNldEFuaW1hdGlvbkNhY2hlTW9kZVxuICAgICAqIEBwYXJhbSB7QW5pbWF0aW9uQ2FjaGVNb2RlfSBjYWNoZU1vZGVcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHNrZWxldG9uLnNldEFuaW1hdGlvbkNhY2hlTW9kZShzcC5Ta2VsZXRvbi5BbmltYXRpb25DYWNoZU1vZGUuU0hBUkVEX0NBQ0hFKTtcbiAgICAgKi9cbiAgICBzZXRBbmltYXRpb25DYWNoZU1vZGUgKGNhY2hlTW9kZSkge1xuICAgICAgICBpZiAodGhpcy5fcHJlQ2FjaGVNb2RlICE9PSBjYWNoZU1vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2NhY2hlTW9kZSA9IGNhY2hlTW9kZTtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVNrZWxldG9uRGF0YSgpO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlVXNlVGludCgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gV2hldGhlciBpbiBjYWNoZWQgbW9kZS5cbiAgICAgKiAhI3poIOW9k+WJjeaYr+WQpuWkhOS6jue8k+WtmOaooeW8j+OAglxuICAgICAqIEBtZXRob2QgaXNBbmltYXRpb25DYWNoZWRcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGlzQW5pbWF0aW9uQ2FjaGVkICgpIHtcbiAgICAgICAgaWYgKENDX0VESVRPUikgcmV0dXJuIGZhbHNlO1xuICAgICAgICByZXR1cm4gdGhpcy5fY2FjaGVNb2RlICE9PSBBbmltYXRpb25DYWNoZU1vZGUuUkVBTFRJTUU7XG4gICAgfSxcblxuICAgIHVwZGF0ZSAoZHQpIHtcbiAgICAgICAgaWYgKENDX0VESVRPUikgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy5wYXVzZWQpIHJldHVybjtcblxuICAgICAgICBkdCAqPSB0aGlzLnRpbWVTY2FsZSAqIHNwLnRpbWVTY2FsZTtcblxuICAgICAgICBpZiAodGhpcy5pc0FuaW1hdGlvbkNhY2hlZCgpKSB7XG5cbiAgICAgICAgICAgIC8vIENhY2hlIG1vZGUgYW5kIGhhcyBhbmltYXRpb24gcXVldWUuXG4gICAgICAgICAgICBpZiAodGhpcy5faXNBbmlDb21wbGV0ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9hbmltYXRpb25RdWV1ZS5sZW5ndGggPT09IDAgJiYgIXRoaXMuX2hlYWRBbmlJbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmcmFtZUNhY2hlID0gdGhpcy5fZnJhbWVDYWNoZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZyYW1lQ2FjaGUgJiYgZnJhbWVDYWNoZS5pc0ludmFsaWQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJhbWVDYWNoZS51cGRhdGVUb0ZyYW1lKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZnJhbWVzID0gZnJhbWVDYWNoZS5mcmFtZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJGcmFtZSA9IGZyYW1lc1tmcmFtZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2hlYWRBbmlJbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2hlYWRBbmlJbmZvID0gdGhpcy5fYW5pbWF0aW9uUXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fYWNjVGltZSArPSBkdDtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fYWNjVGltZSA+IHRoaXMuX2hlYWRBbmlJbmZvLmRlbGF5KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBhbmlJbmZvID0gdGhpcy5faGVhZEFuaUluZm87XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2hlYWRBbmlJbmZvID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBbmltYXRpb24gKDAsIGFuaUluZm8uYW5pbWF0aW9uTmFtZSwgYW5pSW5mby5sb29wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVDYWNoZShkdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVSZWFsdGltZShkdCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2VtaXRDYWNoZUNvbXBsZXRlRXZlbnQgKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2xpc3RlbmVyKSByZXR1cm47XG4gICAgICAgIHRoaXMuX2VuZEVudHJ5LmFuaW1hdGlvbi5uYW1lID0gdGhpcy5fYW5pbWF0aW9uTmFtZTtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXIuY29tcGxldGUgJiYgdGhpcy5fbGlzdGVuZXIuY29tcGxldGUodGhpcy5fZW5kRW50cnkpO1xuICAgICAgICB0aGlzLl9saXN0ZW5lci5lbmQgJiYgdGhpcy5fbGlzdGVuZXIuZW5kKHRoaXMuX2VuZEVudHJ5KTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZUNhY2hlIChkdCkge1xuICAgICAgICBsZXQgZnJhbWVDYWNoZSA9IHRoaXMuX2ZyYW1lQ2FjaGU7XG4gICAgICAgIGlmICghZnJhbWVDYWNoZS5pc0luaXRlZCgpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGZyYW1lcyA9IGZyYW1lQ2FjaGUuZnJhbWVzO1xuICAgICAgICBsZXQgZnJhbWVUaW1lID0gU2tlbGV0b25DYWNoZS5GcmFtZVRpbWU7XG5cbiAgICAgICAgLy8gQW5pbWF0aW9uIFN0YXJ0LCB0aGUgZXZlbnQgZGlmZnJlbnQgZnJvbSBkcmFnb25ib25lcyBpbm5lciBldmVudCxcbiAgICAgICAgLy8gSXQgaGFzIG5vIGV2ZW50IG9iamVjdC5cbiAgICAgICAgaWYgKHRoaXMuX2FjY1RpbWUgPT0gMCAmJiB0aGlzLl9wbGF5Q291bnQgPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRFbnRyeS5hbmltYXRpb24ubmFtZSA9IHRoaXMuX2FuaW1hdGlvbk5hbWU7XG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lciAmJiB0aGlzLl9saXN0ZW5lci5zdGFydCAmJiB0aGlzLl9saXN0ZW5lci5zdGFydCh0aGlzLl9zdGFydEVudHJ5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2FjY1RpbWUgKz0gZHQ7XG4gICAgICAgIGxldCBmcmFtZUlkeCA9IE1hdGguZmxvb3IodGhpcy5fYWNjVGltZSAvIGZyYW1lVGltZSk7XG4gICAgICAgIGlmICghZnJhbWVDYWNoZS5pc0NvbXBsZXRlZCkge1xuICAgICAgICAgICAgZnJhbWVDYWNoZS51cGRhdGVUb0ZyYW1lKGZyYW1lSWR4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmcmFtZUNhY2hlLmlzQ29tcGxldGVkICYmIGZyYW1lSWR4ID49IGZyYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuX3BsYXlDb3VudCArKztcbiAgICAgICAgICAgIGlmICh0aGlzLl9wbGF5VGltZXMgPiAwICYmIHRoaXMuX3BsYXlDb3VudCA+PSB0aGlzLl9wbGF5VGltZXMpIHtcbiAgICAgICAgICAgICAgICAvLyBzZXQgZnJhbWUgdG8gZW5kIGZyYW1lLlxuICAgICAgICAgICAgICAgIHRoaXMuX2N1ckZyYW1lID0gZnJhbWVzW2ZyYW1lcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICB0aGlzLl9hY2NUaW1lID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLl9wbGF5Q291bnQgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuX2lzQW5pQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX2VtaXRDYWNoZUNvbXBsZXRlRXZlbnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9hY2NUaW1lID0gMDtcbiAgICAgICAgICAgIGZyYW1lSWR4ID0gMDtcbiAgICAgICAgICAgIHRoaXMuX2VtaXRDYWNoZUNvbXBsZXRlRXZlbnQoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jdXJGcmFtZSA9IGZyYW1lc1tmcmFtZUlkeF07XG4gICAgfSxcblxuICAgIF91cGRhdGVSZWFsdGltZSAoZHQpIHtcbiAgICAgICAgbGV0IHNrZWxldG9uID0gdGhpcy5fc2tlbGV0b247XG4gICAgICAgIGxldCBzdGF0ZSA9IHRoaXMuX3N0YXRlO1xuICAgICAgICBpZiAoc2tlbGV0b24pIHtcbiAgICAgICAgICAgIHNrZWxldG9uLnVwZGF0ZShkdCk7XG4gICAgICAgICAgICBpZiAoc3RhdGUpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS51cGRhdGUoZHQpO1xuICAgICAgICAgICAgICAgIHN0YXRlLmFwcGx5KHNrZWxldG9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgdmVydGV4IGVmZmVjdCBkZWxlZ2F0ZS5cbiAgICAgKiAhI3poIOiuvue9rumhtueCueWKqOeUu+S7o+eQhlxuICAgICAqIEBtZXRob2Qgc2V0VmVydGV4RWZmZWN0RGVsZWdhdGVcbiAgICAgKiBAcGFyYW0ge3NwLlZlcnRleEVmZmVjdERlbGVnYXRlfSBlZmZlY3REZWxlZ2F0ZVxuICAgICAqL1xuICAgIHNldFZlcnRleEVmZmVjdERlbGVnYXRlIChlZmZlY3REZWxlZ2F0ZSkge1xuICAgICAgICB0aGlzLl9lZmZlY3REZWxlZ2F0ZSA9IGVmZmVjdERlbGVnYXRlO1xuICAgIH0sXG5cbiAgICAvLyBSRU5ERVJFUlxuXG4gICAgLyoqXG4gICAgICogISNlbiBDb21wdXRlcyB0aGUgd29ybGQgU1JUIGZyb20gdGhlIGxvY2FsIFNSVCBmb3IgZWFjaCBib25lLlxuICAgICAqICEjemgg6YeN5paw5pu05paw5omA5pyJ6aqo6aq855qE5LiW55WMIFRyYW5zZm9ybe+8jFxuICAgICAqIOW9k+iOt+WPliBib25lIOeahOaVsOWAvOacquabtOaWsOaXtu+8jOWNs+WPr+S9v+eUqOivpeWHveaVsOi/m+ihjOabtOaWsOaVsOWAvOOAglxuICAgICAqIEBtZXRob2QgdXBkYXRlV29ybGRUcmFuc2Zvcm1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBib25lID0gc3BpbmUuZmluZEJvbmUoJ2hlYWQnKTtcbiAgICAgKiBjYy5sb2coYm9uZS53b3JsZFgpOyAvLyByZXR1cm4gMDtcbiAgICAgKiBzcGluZS51cGRhdGVXb3JsZFRyYW5zZm9ybSgpO1xuICAgICAqIGJvbmUgPSBzcGluZS5maW5kQm9uZSgnaGVhZCcpO1xuICAgICAqIGNjLmxvZyhib25lLndvcmxkWCk7IC8vIHJldHVybiAtMjMuMTI7XG4gICAgICovXG4gICAgdXBkYXRlV29ybGRUcmFuc2Zvcm0gKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNBbmltYXRpb25DYWNoZWQoKSkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0aGlzLl9za2VsZXRvbikge1xuICAgICAgICAgICAgdGhpcy5fc2tlbGV0b24udXBkYXRlV29ybGRUcmFuc2Zvcm0oKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgdGhlIGJvbmVzIGFuZCBzbG90cyB0byB0aGUgc2V0dXAgcG9zZS5cbiAgICAgKiAhI3poIOi/mOWOn+WIsOi1t+Wni+WKqOS9nFxuICAgICAqIEBtZXRob2Qgc2V0VG9TZXR1cFBvc2VcbiAgICAgKi9cbiAgICBzZXRUb1NldHVwUG9zZSAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9za2VsZXRvbikge1xuICAgICAgICAgICAgdGhpcy5fc2tlbGV0b24uc2V0VG9TZXR1cFBvc2UoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogU2V0cyB0aGUgYm9uZXMgdG8gdGhlIHNldHVwIHBvc2UsXG4gICAgICogdXNpbmcgdGhlIHZhbHVlcyBmcm9tIHRoZSBgQm9uZURhdGFgIGxpc3QgaW4gdGhlIGBTa2VsZXRvbkRhdGFgLlxuICAgICAqICEjemhcbiAgICAgKiDorr7nva4gYm9uZSDliLDotbflp4vliqjkvZxcbiAgICAgKiDkvb/nlKggU2tlbGV0b25EYXRhIOS4reeahCBCb25lRGF0YSDliJfooajkuK3nmoTlgLzjgIJcbiAgICAgKiBAbWV0aG9kIHNldEJvbmVzVG9TZXR1cFBvc2VcbiAgICAgKi9cbiAgICBzZXRCb25lc1RvU2V0dXBQb3NlICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3NrZWxldG9uKSB7XG4gICAgICAgICAgICB0aGlzLl9za2VsZXRvbi5zZXRCb25lc1RvU2V0dXBQb3NlKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNldHMgdGhlIHNsb3RzIHRvIHRoZSBzZXR1cCBwb3NlLFxuICAgICAqIHVzaW5nIHRoZSB2YWx1ZXMgZnJvbSB0aGUgYFNsb3REYXRhYCBsaXN0IGluIHRoZSBgU2tlbGV0b25EYXRhYC5cbiAgICAgKiAhI3poXG4gICAgICog6K6+572uIHNsb3Qg5Yiw6LW35aeL5Yqo5L2c44CCXG4gICAgICog5L2/55SoIFNrZWxldG9uRGF0YSDkuK3nmoQgU2xvdERhdGEg5YiX6KGo5Lit55qE5YC844CCXG4gICAgICogQG1ldGhvZCBzZXRTbG90c1RvU2V0dXBQb3NlXG4gICAgICovXG4gICAgc2V0U2xvdHNUb1NldHVwUG9zZSAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9za2VsZXRvbikge1xuICAgICAgICAgICAgdGhpcy5fc2tlbGV0b24uc2V0U2xvdHNUb1NldHVwUG9zZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBVcGRhdGluZyBhbiBhbmltYXRpb24gY2FjaGUgdG8gY2FsY3VsYXRlIGFsbCBmcmFtZSBkYXRhIGluIHRoZSBhbmltYXRpb24gaXMgYSBjb3N0IGluIFxuICAgICAqIHBlcmZvcm1hbmNlIGR1ZSB0byBjYWxjdWxhdGluZyBhbGwgZGF0YSBpbiBhIHNpbmdsZSBmcmFtZS5cbiAgICAgKiBUbyB1cGRhdGUgdGhlIGNhY2hlLCB1c2UgdGhlIGludmFsaWRBbmltYXRpb25DYWNoZSBtZXRob2Qgd2l0aCBoaWdoIHBlcmZvcm1hbmNlLlxuICAgICAqICEjemhcbiAgICAgKiDmm7TmlrDmn5DkuKrliqjnlLvnvJPlrZgsIOmihOiuoeeul+WKqOeUu+S4reaJgOacieW4p+aVsOaNru+8jOeUseS6juWcqOWNleW4p+iuoeeul+aJgOacieaVsOaNru+8jOaJgOS7pei+g+a2iOiAl+aAp+iDveOAglxuICAgICAqIOiLpeaDs+abtOaWsOe8k+WtmO+8jOWPr+S9v+eUqCBpbnZhbGlkQW5pbWF0aW9uQ2FjaGUg5pa55rOV77yM5YW35pyJ6L6D6auY5oCn6IO944CCXG4gICAgICogQG1ldGhvZCB1cGRhdGVBbmltYXRpb25DYWNoZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhbmltTmFtZVxuICAgICAqL1xuICAgIHVwZGF0ZUFuaW1hdGlvbkNhY2hlIChhbmltTmFtZSkge1xuICAgICAgICBpZiAoIXRoaXMuaXNBbmltYXRpb25DYWNoZWQoKSkgcmV0dXJuO1xuICAgICAgICBsZXQgdXVpZCA9IHRoaXMuc2tlbGV0b25EYXRhLl91dWlkO1xuICAgICAgICBpZiAodGhpcy5fc2tlbGV0b25DYWNoZSkge1xuICAgICAgICAgICAgdGhpcy5fc2tlbGV0b25DYWNoZS51cGRhdGVBbmltYXRpb25DYWNoZSh1dWlkLCBhbmltTmFtZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEludmFsaWRhdGVzIHRoZSBhbmltYXRpb24gY2FjaGUsIHdoaWNoIGlzIHRoZW4gcmVjb21wdXRlZCBvbiBlYWNoIGZyYW1lLi5cbiAgICAgKiAhI3poXG4gICAgICog5L2/5Yqo55S757yT5a2Y5aSx5pWI77yM5LmL5ZCO5Lya5Zyo5q+P5bin6YeN5paw6K6h566X44CCXG4gICAgICogQG1ldGhvZCBpbnZhbGlkQW5pbWF0aW9uQ2FjaGVcbiAgICAgKi9cbiAgICBpbnZhbGlkQW5pbWF0aW9uQ2FjaGUgKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNBbmltYXRpb25DYWNoZWQoKSkgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy5fc2tlbGV0b25DYWNoZSkge1xuICAgICAgICAgICAgdGhpcy5fc2tlbGV0b25DYWNoZS5pbnZhbGlkQW5pbWF0aW9uQ2FjaGUodGhpcy5za2VsZXRvbkRhdGEuX3V1aWQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBGaW5kcyBhIGJvbmUgYnkgbmFtZS5cbiAgICAgKiBUaGlzIGRvZXMgYSBzdHJpbmcgY29tcGFyaXNvbiBmb3IgZXZlcnkgYm9uZS48YnI+XG4gICAgICogUmV0dXJucyBhIHt7I2Nyb3NzTGlua01vZHVsZSBcInNwLnNwaW5lXCJ9fXNwLnNwaW5le3svY3Jvc3NMaW5rTW9kdWxlfX0uQm9uZSBvYmplY3QuXG4gICAgICogISN6aFxuICAgICAqIOmAmui/h+WQjeensOafpeaJviBib25l44CCXG4gICAgICog6L+Z6YeM5a+55q+P5LiqIGJvbmUg55qE5ZCN56ew6L+b6KGM5LqG5a+55q+U44CCPGJyPlxuICAgICAqIOi/lOWbnuS4gOS4qiB7eyNjcm9zc0xpbmtNb2R1bGUgXCJzcC5zcGluZVwifX1zcC5zcGluZXt7L2Nyb3NzTGlua01vZHVsZX19LkJvbmUg5a+56LGh44CCXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGZpbmRCb25lXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGJvbmVOYW1lXG4gICAgICogQHJldHVybiB7c3Auc3BpbmUuQm9uZX1cbiAgICAgKi9cbiAgICBmaW5kQm9uZSAoYm9uZU5hbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuX3NrZWxldG9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2tlbGV0b24uZmluZEJvbmUoYm9uZU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogRmluZHMgYSBzbG90IGJ5IG5hbWUuIFRoaXMgZG9lcyBhIHN0cmluZyBjb21wYXJpc29uIGZvciBldmVyeSBzbG90Ljxicj5cbiAgICAgKiBSZXR1cm5zIGEge3sjY3Jvc3NMaW5rTW9kdWxlIFwic3Auc3BpbmVcIn19c3Auc3BpbmV7ey9jcm9zc0xpbmtNb2R1bGV9fS5TbG90IG9iamVjdC5cbiAgICAgKiAhI3poXG4gICAgICog6YCa6L+H5ZCN56ew5p+l5om+IHNsb3TjgILov5nph4zlr7nmr4/kuKogc2xvdCDnmoTlkI3np7Dov5vooYzkuobmr5TovoPjgII8YnI+XG4gICAgICog6L+U5Zue5LiA5LiqIHt7I2Nyb3NzTGlua01vZHVsZSBcInNwLnNwaW5lXCJ9fXNwLnNwaW5le3svY3Jvc3NMaW5rTW9kdWxlfX0uU2xvdCDlr7nosaHjgIJcbiAgICAgKlxuICAgICAqIEBtZXRob2QgZmluZFNsb3RcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc2xvdE5hbWVcbiAgICAgKiBAcmV0dXJuIHtzcC5zcGluZS5TbG90fVxuICAgICAqL1xuICAgIGZpbmRTbG90IChzbG90TmFtZSkge1xuICAgICAgICBpZiAodGhpcy5fc2tlbGV0b24pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9za2VsZXRvbi5maW5kU2xvdChzbG90TmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBGaW5kcyBhIHNraW4gYnkgbmFtZSBhbmQgbWFrZXMgaXQgdGhlIGFjdGl2ZSBza2luLlxuICAgICAqIFRoaXMgZG9lcyBhIHN0cmluZyBjb21wYXJpc29uIGZvciBldmVyeSBza2luLjxicj5cbiAgICAgKiBOb3RlIHRoYXQgc2V0dGluZyB0aGUgc2tpbiBkb2VzIG5vdCBjaGFuZ2Ugd2hpY2ggYXR0YWNobWVudHMgYXJlIHZpc2libGUuPGJyPlxuICAgICAqIFJldHVybnMgYSB7eyNjcm9zc0xpbmtNb2R1bGUgXCJzcC5zcGluZVwifX1zcC5zcGluZXt7L2Nyb3NzTGlua01vZHVsZX19LlNraW4gb2JqZWN0LlxuICAgICAqICEjemhcbiAgICAgKiDmjInlkI3np7Dmn6Xmib7nmq7ogqTvvIzmv4DmtLvor6Xnmq7ogqTjgILov5nph4zlr7nmr4/kuKrnmq7ogqTnmoTlkI3np7Dov5vooYzkuobmr5TovoPjgII8YnI+XG4gICAgICog5rOo5oSP77ya6K6+572u55qu6IKk5LiN5Lya5pS55Y+YIGF0dGFjaG1lbnQg55qE5Y+v6KeB5oCn44CCPGJyPlxuICAgICAqIOi/lOWbnuS4gOS4qiB7eyNjcm9zc0xpbmtNb2R1bGUgXCJzcC5zcGluZVwifX1zcC5zcGluZXt7L2Nyb3NzTGlua01vZHVsZX19LlNraW4g5a+56LGh44CCXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHNldFNraW5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc2tpbk5hbWVcbiAgICAgKi9cbiAgICBzZXRTa2luIChza2luTmFtZSkge1xuICAgICAgICBpZiAodGhpcy5fc2tlbGV0b24pIHtcbiAgICAgICAgICAgIHRoaXMuX3NrZWxldG9uLnNldFNraW5CeU5hbWUoc2tpbk5hbWUpO1xuICAgICAgICAgICAgdGhpcy5fc2tlbGV0b24uc2V0U2xvdHNUb1NldHVwUG9zZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW52YWxpZEFuaW1hdGlvbkNhY2hlKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXR1cm5zIHRoZSBhdHRhY2htZW50IGZvciB0aGUgc2xvdCBhbmQgYXR0YWNobWVudCBuYW1lLlxuICAgICAqIFRoZSBza2VsZXRvbiBsb29rcyBmaXJzdCBpbiBpdHMgc2tpbiwgdGhlbiBpbiB0aGUgc2tlbGV0b24gZGF0YeKAmXMgZGVmYXVsdCBza2luLjxicj5cbiAgICAgKiBSZXR1cm5zIGEge3sjY3Jvc3NMaW5rTW9kdWxlIFwic3Auc3BpbmVcIn19c3Auc3BpbmV7ey9jcm9zc0xpbmtNb2R1bGV9fS5BdHRhY2htZW50IG9iamVjdC5cbiAgICAgKiAhI3poXG4gICAgICog6YCa6L+HIHNsb3Qg5ZKMIGF0dGFjaG1lbnQg55qE5ZCN56ew6I635Y+WIGF0dGFjaG1lbnTjgIJTa2VsZXRvbiDkvJjlhYjmn6Xmib7lroPnmoTnmq7ogqTvvIznhLblkI7miY3mmK8gU2tlbGV0b24gRGF0YSDkuK3pu5jorqTnmoTnmq7ogqTjgII8YnI+XG4gICAgICog6L+U5Zue5LiA5LiqIHt7I2Nyb3NzTGlua01vZHVsZSBcInNwLnNwaW5lXCJ9fXNwLnNwaW5le3svY3Jvc3NMaW5rTW9kdWxlfX0uQXR0YWNobWVudCDlr7nosaHjgIJcbiAgICAgKlxuICAgICAqIEBtZXRob2QgZ2V0QXR0YWNobWVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzbG90TmFtZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRhY2htZW50TmFtZVxuICAgICAqIEByZXR1cm4ge3NwLnNwaW5lLkF0dGFjaG1lbnR9XG4gICAgICovXG4gICAgZ2V0QXR0YWNobWVudCAoc2xvdE5hbWUsIGF0dGFjaG1lbnROYW1lKSB7XG4gICAgICAgIGlmICh0aGlzLl9za2VsZXRvbikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NrZWxldG9uLmdldEF0dGFjaG1lbnRCeU5hbWUoc2xvdE5hbWUsIGF0dGFjaG1lbnROYW1lKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNldHMgdGhlIGF0dGFjaG1lbnQgZm9yIHRoZSBzbG90IGFuZCBhdHRhY2htZW50IG5hbWUuXG4gICAgICogVGhlIHNrZWxldG9uIGxvb2tzIGZpcnN0IGluIGl0cyBza2luLCB0aGVuIGluIHRoZSBza2VsZXRvbiBkYXRh4oCZcyBkZWZhdWx0IHNraW4uXG4gICAgICogISN6aFxuICAgICAqIOmAmui/hyBzbG90IOWSjCBhdHRhY2htZW50IOeahOWQjeWtl+adpeiuvue9riBhdHRhY2htZW5044CCXG4gICAgICogU2tlbGV0b24g5LyY5YWI5p+l5om+5a6D55qE55qu6IKk77yM54S25ZCO5omN5pivIFNrZWxldG9uIERhdGEg5Lit6buY6K6k55qE55qu6IKk44CCXG4gICAgICogQG1ldGhvZCBzZXRBdHRhY2htZW50XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNsb3ROYW1lXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGF0dGFjaG1lbnROYW1lXG4gICAgICovXG4gICAgc2V0QXR0YWNobWVudCAoc2xvdE5hbWUsIGF0dGFjaG1lbnROYW1lKSB7XG4gICAgICAgIGlmICh0aGlzLl9za2VsZXRvbikge1xuICAgICAgICAgICAgdGhpcy5fc2tlbGV0b24uc2V0QXR0YWNobWVudChzbG90TmFtZSwgYXR0YWNobWVudE5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW52YWxpZEFuaW1hdGlvbkNhY2hlKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICogUmV0dXJuIHRoZSByZW5kZXJlciBvZiBhdHRhY2htZW50LlxuICAgICogQG1ldGhvZCBnZXRUZXh0dXJlQXRsYXNcbiAgICAqIEBwYXJhbSB7c3Auc3BpbmUuUmVnaW9uQXR0YWNobWVudHxzcGluZS5Cb3VuZGluZ0JveEF0dGFjaG1lbnR9IHJlZ2lvbkF0dGFjaG1lbnRcbiAgICAqIEByZXR1cm4ge3NwLnNwaW5lLlRleHR1cmVBdGxhc1JlZ2lvbn1cbiAgICAqL1xuICAgIGdldFRleHR1cmVBdGxhcyAocmVnaW9uQXR0YWNobWVudCkge1xuICAgICAgICByZXR1cm4gcmVnaW9uQXR0YWNobWVudC5yZWdpb247XG4gICAgfSxcblxuICAgIC8vIEFOSU1BVElPTlxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBNaXggYXBwbGllcyBhbGwga2V5ZnJhbWUgdmFsdWVzLFxuICAgICAqIGludGVycG9sYXRlZCBmb3IgdGhlIHNwZWNpZmllZCB0aW1lIGFuZCBtaXhlZCB3aXRoIHRoZSBjdXJyZW50IHZhbHVlcy5cbiAgICAgKiAhI3poIOS4uuaJgOacieWFs+mUruW4p+iuvuWumua3t+WQiOWPiua3t+WQiOaXtumXtO+8iOS7juW9k+WJjeWAvOW8gOWni+W3ruWAvO+8ieOAglxuICAgICAqIEBtZXRob2Qgc2V0TWl4XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZyb21BbmltYXRpb25cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdG9BbmltYXRpb25cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb25cbiAgICAgKi9cbiAgICBzZXRNaXggKGZyb21BbmltYXRpb24sIHRvQW5pbWF0aW9uLCBkdXJhdGlvbikge1xuICAgICAgICBpZiAodGhpcy5fc3RhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlLmRhdGEuc2V0TWl4KGZyb21BbmltYXRpb24sIHRvQW5pbWF0aW9uLCBkdXJhdGlvbik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgdGhlIGN1cnJlbnQgYW5pbWF0aW9uLiBBbnkgcXVldWVkIGFuaW1hdGlvbnMgYXJlIGNsZWFyZWQuPGJyPlxuICAgICAqIFJldHVybnMgYSB7eyNjcm9zc0xpbmtNb2R1bGUgXCJzcC5zcGluZVwifX1zcC5zcGluZXt7L2Nyb3NzTGlua01vZHVsZX19LlRyYWNrRW50cnkgb2JqZWN0LlxuICAgICAqICEjemgg6K6+572u5b2T5YmN5Yqo55S744CC6Zif5YiX5Lit55qE5Lu75L2V55qE5Yqo55S75bCG6KKr5riF6Zmk44CCPGJyPlxuICAgICAqIOi/lOWbnuS4gOS4qiB7eyNjcm9zc0xpbmtNb2R1bGUgXCJzcC5zcGluZVwifX1zcC5zcGluZXt7L2Nyb3NzTGlua01vZHVsZX19LlRyYWNrRW50cnkg5a+56LGh44CCXG4gICAgICogQG1ldGhvZCBzZXRBbmltYXRpb25cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdHJhY2tJbmRleFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBsb29wXG4gICAgICogQHJldHVybiB7c3Auc3BpbmUuVHJhY2tFbnRyeX1cbiAgICAgKi9cbiAgICBzZXRBbmltYXRpb24gKHRyYWNrSW5kZXgsIG5hbWUsIGxvb3ApIHtcblxuICAgICAgICB0aGlzLl9wbGF5VGltZXMgPSBsb29wID8gMCA6IDE7XG4gICAgICAgIHRoaXMuX2FuaW1hdGlvbk5hbWUgPSBuYW1lO1xuXG4gICAgICAgIGlmICh0aGlzLmlzQW5pbWF0aW9uQ2FjaGVkKCkpIHtcbiAgICAgICAgICAgIGlmICh0cmFja0luZGV4ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybihcIlRyYWNrIGluZGV4IGNhbiBub3QgZ3JlYXRlciB0aGFuIDAgaW4gY2FjaGVkIG1vZGUuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0aGlzLl9za2VsZXRvbkNhY2hlKSByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIGxldCBjYWNoZSA9IHRoaXMuX3NrZWxldG9uQ2FjaGUuZ2V0QW5pbWF0aW9uQ2FjaGUodGhpcy5za2VsZXRvbkRhdGEuX3V1aWQsIG5hbWUpO1xuICAgICAgICAgICAgaWYgKCFjYWNoZSkge1xuICAgICAgICAgICAgICAgIGNhY2hlID0gdGhpcy5fc2tlbGV0b25DYWNoZS5pbml0QW5pbWF0aW9uQ2FjaGUodGhpcy5za2VsZXRvbkRhdGEuX3V1aWQsIG5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNhY2hlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faXNBbmlDb21wbGV0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuX2FjY1RpbWUgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuX3BsYXlDb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5fZnJhbWVDYWNoZSA9IGNhY2hlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmF0dGFjaFV0aWwuX2hhc0F0dGFjaGVkTm9kZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZyYW1lQ2FjaGUuZW5hYmxlQ2FjaGVBdHRhY2hlZEluZm8oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fZnJhbWVDYWNoZS51cGRhdGVUb0ZyYW1lKDApO1xuICAgICAgICAgICAgICAgIHRoaXMuX2N1ckZyYW1lID0gdGhpcy5fZnJhbWVDYWNoZS5mcmFtZXNbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fc2tlbGV0b24pIHtcbiAgICAgICAgICAgICAgICB2YXIgYW5pbWF0aW9uID0gdGhpcy5fc2tlbGV0b24uZGF0YS5maW5kQW5pbWF0aW9uKG5hbWUpO1xuICAgICAgICAgICAgICAgIGlmICghYW5pbWF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLmxvZ0lEKDc1MDksIG5hbWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHJlcyA9IHRoaXMuX3N0YXRlLnNldEFuaW1hdGlvbldpdGgodHJhY2tJbmRleCwgYW5pbWF0aW9uLCBsb29wKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZS5hcHBseSh0aGlzLl9za2VsZXRvbik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBBZGRzIGFuIGFuaW1hdGlvbiB0byBiZSBwbGF5ZWQgZGVsYXkgc2Vjb25kcyBhZnRlciB0aGUgY3VycmVudCBvciBsYXN0IHF1ZXVlZCBhbmltYXRpb24uPGJyPlxuICAgICAqIFJldHVybnMgYSB7eyNjcm9zc0xpbmtNb2R1bGUgXCJzcC5zcGluZVwifX1zcC5zcGluZXt7L2Nyb3NzTGlua01vZHVsZX19LlRyYWNrRW50cnkgb2JqZWN0LlxuICAgICAqICEjemgg5re75Yqg5LiA5Liq5Yqo55S75Yiw5Yqo55S76Zif5YiX5bC+6YOo77yM6L+Y5Y+v5Lul5bu26L+f5oyH5a6a55qE56eS5pWw44CCPGJyPlxuICAgICAqIOi/lOWbnuS4gOS4qiB7eyNjcm9zc0xpbmtNb2R1bGUgXCJzcC5zcGluZVwifX1zcC5zcGluZXt7L2Nyb3NzTGlua01vZHVsZX19LlRyYWNrRW50cnkg5a+56LGh44CCXG4gICAgICogQG1ldGhvZCBhZGRBbmltYXRpb25cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdHJhY2tJbmRleFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBsb29wXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtkZWxheT0wXVxuICAgICAqIEByZXR1cm4ge3NwLnNwaW5lLlRyYWNrRW50cnl9XG4gICAgICovXG4gICAgYWRkQW5pbWF0aW9uICh0cmFja0luZGV4LCBuYW1lLCBsb29wLCBkZWxheSkge1xuICAgICAgICBkZWxheSA9IGRlbGF5IHx8IDA7XG4gICAgICAgIGlmICh0aGlzLmlzQW5pbWF0aW9uQ2FjaGVkKCkpIHtcbiAgICAgICAgICAgIGlmICh0cmFja0luZGV4ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybihcIlRyYWNrIGluZGV4IGNhbiBub3QgZ3JlYXRlciB0aGFuIDAgaW4gY2FjaGVkIG1vZGUuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fYW5pbWF0aW9uUXVldWUucHVzaCh7YW5pbWF0aW9uTmFtZSA6IG5hbWUsIGxvb3A6IGxvb3AsIGRlbGF5IDogZGVsYXl9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9za2VsZXRvbikge1xuICAgICAgICAgICAgICAgIHZhciBhbmltYXRpb24gPSB0aGlzLl9za2VsZXRvbi5kYXRhLmZpbmRBbmltYXRpb24obmFtZSk7XG4gICAgICAgICAgICAgICAgaWYgKCFhbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgY2MubG9nSUQoNzUxMCwgbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdGUuYWRkQW5pbWF0aW9uV2l0aCh0cmFja0luZGV4LCBhbmltYXRpb24sIGxvb3AsIGRlbGF5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBGaW5kIGFuaW1hdGlvbiB3aXRoIHNwZWNpZmllZCBuYW1lLlxuICAgICAqICEjemgg5p+l5om+5oyH5a6a5ZCN56ew55qE5Yqo55S7XG4gICAgICogQG1ldGhvZCBmaW5kQW5pbWF0aW9uXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAgICAgKiBAcmV0dXJucyB7c3Auc3BpbmUuQW5pbWF0aW9ufVxuICAgICAqL1xuICAgIGZpbmRBbmltYXRpb24gKG5hbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuX3NrZWxldG9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2tlbGV0b24uZGF0YS5maW5kQW5pbWF0aW9uKG5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgdHJhY2sgZW50cnkgYnkgdHJhY2tJbmRleC48YnI+XG4gICAgICogUmV0dXJucyBhIHt7I2Nyb3NzTGlua01vZHVsZSBcInNwLnNwaW5lXCJ9fXNwLnNwaW5le3svY3Jvc3NMaW5rTW9kdWxlfX0uVHJhY2tFbnRyeSBvYmplY3QuXG4gICAgICogISN6aCDpgJrov4cgdHJhY2sg57Si5byV6I635Y+WIFRyYWNrRW50cnnjgII8YnI+XG4gICAgICog6L+U5Zue5LiA5LiqIHt7I2Nyb3NzTGlua01vZHVsZSBcInNwLnNwaW5lXCJ9fXNwLnNwaW5le3svY3Jvc3NMaW5rTW9kdWxlfX0uVHJhY2tFbnRyeSDlr7nosaHjgIJcbiAgICAgKiBAbWV0aG9kIGdldEN1cnJlbnRcbiAgICAgKiBAcGFyYW0gdHJhY2tJbmRleFxuICAgICAqIEByZXR1cm4ge3NwLnNwaW5lLlRyYWNrRW50cnl9XG4gICAgICovXG4gICAgZ2V0Q3VycmVudCAodHJhY2tJbmRleCkge1xuICAgICAgICBpZiAodGhpcy5pc0FuaW1hdGlvbkNhY2hlZCgpKSB7XG4gICAgICAgICAgICBjYy53YXJuKFwiJ2dldEN1cnJlbnQnIGludGVyZmFjZSBjYW4gbm90IGJlIGludm9rZWQgaW4gY2FjaGVkIG1vZGUuXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3N0YXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlLmdldEN1cnJlbnQodHJhY2tJbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2xlYXJzIGFsbCB0cmFja3Mgb2YgYW5pbWF0aW9uIHN0YXRlLlxuICAgICAqICEjemgg5riF6Zmk5omA5pyJIHRyYWNrIOeahOWKqOeUu+eKtuaAgeOAglxuICAgICAqIEBtZXRob2QgY2xlYXJUcmFja3NcbiAgICAgKi9cbiAgICBjbGVhclRyYWNrcyAoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzQW5pbWF0aW9uQ2FjaGVkKCkpIHtcbiAgICAgICAgICAgIGNjLndhcm4oXCInY2xlYXJUcmFja3MnIGludGVyZmFjZSBjYW4gbm90IGJlIGludm9rZWQgaW4gY2FjaGVkIG1vZGUuXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3N0YXRlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdGUuY2xlYXJUcmFja3MoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENsZWFycyB0cmFjayBvZiBhbmltYXRpb24gc3RhdGUgYnkgdHJhY2tJbmRleC5cbiAgICAgKiAhI3poIOa4hemZpOWHuuaMh+WumiB0cmFjayDnmoTliqjnlLvnirbmgIHjgIJcbiAgICAgKiBAbWV0aG9kIGNsZWFyVHJhY2tcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdHJhY2tJbmRleFxuICAgICAqL1xuICAgIGNsZWFyVHJhY2sgKHRyYWNrSW5kZXgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNBbmltYXRpb25DYWNoZWQoKSkge1xuICAgICAgICAgICAgY2Mud2FybihcIidjbGVhclRyYWNrJyBpbnRlcmZhY2UgY2FuIG5vdCBiZSBpbnZva2VkIGluIGNhY2hlZCBtb2RlLlwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdGF0ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlLmNsZWFyVHJhY2sodHJhY2tJbmRleCk7XG4gICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUiAmJiAhY2MuZW5naW5lLmlzUGxheWluZykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZS51cGRhdGUoMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHRoZSBzdGFydCBldmVudCBsaXN0ZW5lci5cbiAgICAgKiAhI3poIOeUqOadpeiuvue9ruW8gOWni+aSreaUvuWKqOeUu+eahOS6i+S7tuebkeWQrOOAglxuICAgICAqIEBtZXRob2Qgc2V0U3RhcnRMaXN0ZW5lclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyXG4gICAgICovXG4gICAgc2V0U3RhcnRMaXN0ZW5lciAobGlzdGVuZXIpIHtcbiAgICAgICAgdGhpcy5fZW5zdXJlTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXIuc3RhcnQgPSBsaXN0ZW5lcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgdGhlIGludGVycnVwdCBldmVudCBsaXN0ZW5lci5cbiAgICAgKiAhI3poIOeUqOadpeiuvue9ruWKqOeUu+iiq+aJk+aWreeahOS6i+S7tuebkeWQrOOAglxuICAgICAqIEBtZXRob2Qgc2V0SW50ZXJydXB0TGlzdGVuZXJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lclxuICAgICAqL1xuICAgIHNldEludGVycnVwdExpc3RlbmVyIChsaXN0ZW5lcikge1xuICAgICAgICB0aGlzLl9lbnN1cmVMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLl9saXN0ZW5lci5pbnRlcnJ1cHQgPSBsaXN0ZW5lcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgdGhlIGVuZCBldmVudCBsaXN0ZW5lci5cbiAgICAgKiAhI3poIOeUqOadpeiuvue9ruWKqOeUu+aSreaUvuWujOWQjueahOS6i+S7tuebkeWQrOOAglxuICAgICAqIEBtZXRob2Qgc2V0RW5kTGlzdGVuZXJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lclxuICAgICAqL1xuICAgIHNldEVuZExpc3RlbmVyIChsaXN0ZW5lcikge1xuICAgICAgICB0aGlzLl9lbnN1cmVMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLl9saXN0ZW5lci5lbmQgPSBsaXN0ZW5lcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgdGhlIGRpc3Bvc2UgZXZlbnQgbGlzdGVuZXIuXG4gICAgICogISN6aCDnlKjmnaXorr7nva7liqjnlLvlsIbooqvplIDmr4HnmoTkuovku7bnm5HlkKzjgIJcbiAgICAgKiBAbWV0aG9kIHNldERpc3Bvc2VMaXN0ZW5lclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyXG4gICAgICovXG4gICAgc2V0RGlzcG9zZUxpc3RlbmVyIChsaXN0ZW5lcikge1xuICAgICAgICB0aGlzLl9lbnN1cmVMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLl9saXN0ZW5lci5kaXNwb3NlID0gbGlzdGVuZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHRoZSBjb21wbGV0ZSBldmVudCBsaXN0ZW5lci5cbiAgICAgKiAhI3poIOeUqOadpeiuvue9ruWKqOeUu+aSreaUvuS4gOasoeW+queOr+e7k+adn+WQjueahOS6i+S7tuebkeWQrOOAglxuICAgICAqIEBtZXRob2Qgc2V0Q29tcGxldGVMaXN0ZW5lclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyXG4gICAgICovXG4gICAgc2V0Q29tcGxldGVMaXN0ZW5lciAobGlzdGVuZXIpIHtcbiAgICAgICAgdGhpcy5fZW5zdXJlTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXIuY29tcGxldGUgPSBsaXN0ZW5lcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgdGhlIGFuaW1hdGlvbiBldmVudCBsaXN0ZW5lci5cbiAgICAgKiAhI3poIOeUqOadpeiuvue9ruWKqOeUu+aSreaUvui/h+eoi+S4reW4p+S6i+S7tueahOebkeWQrOOAglxuICAgICAqIEBtZXRob2Qgc2V0RXZlbnRMaXN0ZW5lclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyXG4gICAgICovXG4gICAgc2V0RXZlbnRMaXN0ZW5lciAobGlzdGVuZXIpIHtcbiAgICAgICAgdGhpcy5fZW5zdXJlTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXIuZXZlbnQgPSBsaXN0ZW5lcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgdGhlIHN0YXJ0IGV2ZW50IGxpc3RlbmVyIGZvciBzcGVjaWZpZWQgVHJhY2tFbnRyeS5cbiAgICAgKiAhI3poIOeUqOadpeS4uuaMh+WumueahCBUcmFja0VudHJ5IOiuvue9ruWKqOeUu+W8gOWni+aSreaUvueahOS6i+S7tuebkeWQrOOAglxuICAgICAqIEBtZXRob2Qgc2V0VHJhY2tTdGFydExpc3RlbmVyXG4gICAgICogQHBhcmFtIHtzcC5zcGluZS5UcmFja0VudHJ5fSBlbnRyeVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyXG4gICAgICovXG4gICAgc2V0VHJhY2tTdGFydExpc3RlbmVyIChlbnRyeSwgbGlzdGVuZXIpIHtcbiAgICAgICAgVHJhY2tFbnRyeUxpc3RlbmVycy5nZXRMaXN0ZW5lcnMoZW50cnkpLnN0YXJ0ID0gbGlzdGVuZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHRoZSBpbnRlcnJ1cHQgZXZlbnQgbGlzdGVuZXIgZm9yIHNwZWNpZmllZCBUcmFja0VudHJ5LlxuICAgICAqICEjemgg55So5p2l5Li65oyH5a6a55qEIFRyYWNrRW50cnkg6K6+572u5Yqo55S76KKr5omT5pat55qE5LqL5Lu255uR5ZCs44CCXG4gICAgICogQG1ldGhvZCBzZXRUcmFja0ludGVycnVwdExpc3RlbmVyXG4gICAgICogQHBhcmFtIHtzcC5zcGluZS5UcmFja0VudHJ5fSBlbnRyeVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyXG4gICAgICovXG4gICAgc2V0VHJhY2tJbnRlcnJ1cHRMaXN0ZW5lciAoZW50cnksIGxpc3RlbmVyKSB7XG4gICAgICAgIFRyYWNrRW50cnlMaXN0ZW5lcnMuZ2V0TGlzdGVuZXJzKGVudHJ5KS5pbnRlcnJ1cHQgPSBsaXN0ZW5lcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgdGhlIGVuZCBldmVudCBsaXN0ZW5lciBmb3Igc3BlY2lmaWVkIFRyYWNrRW50cnkuXG4gICAgICogISN6aCDnlKjmnaXkuLrmjIflrprnmoQgVHJhY2tFbnRyeSDorr7nva7liqjnlLvmkq3mlL7nu5PmnZ/nmoTkuovku7bnm5HlkKzjgIJcbiAgICAgKiBAbWV0aG9kIHNldFRyYWNrRW5kTGlzdGVuZXJcbiAgICAgKiBAcGFyYW0ge3NwLnNwaW5lLlRyYWNrRW50cnl9IGVudHJ5XG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXJcbiAgICAgKi9cbiAgICBzZXRUcmFja0VuZExpc3RlbmVyIChlbnRyeSwgbGlzdGVuZXIpIHtcbiAgICAgICAgVHJhY2tFbnRyeUxpc3RlbmVycy5nZXRMaXN0ZW5lcnMoZW50cnkpLmVuZCA9IGxpc3RlbmVyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCB0aGUgZGlzcG9zZSBldmVudCBsaXN0ZW5lciBmb3Igc3BlY2lmaWVkIFRyYWNrRW50cnkuXG4gICAgICogISN6aCDnlKjmnaXkuLrmjIflrprnmoQgVHJhY2tFbnRyeSDorr7nva7liqjnlLvljbPlsIbooqvplIDmr4HnmoTkuovku7bnm5HlkKzjgIJcbiAgICAgKiBAbWV0aG9kIHNldFRyYWNrRGlzcG9zZUxpc3RlbmVyXG4gICAgICogQHBhcmFtIHtzcC5zcGluZS5UcmFja0VudHJ5fSBlbnRyeVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyXG4gICAgICovXG4gICAgc2V0VHJhY2tEaXNwb3NlTGlzdGVuZXIoZW50cnksIGxpc3RlbmVyKXtcbiAgICAgICAgVHJhY2tFbnRyeUxpc3RlbmVycy5nZXRMaXN0ZW5lcnMoZW50cnkpLmRpc3Bvc2UgPSBsaXN0ZW5lcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgdGhlIGNvbXBsZXRlIGV2ZW50IGxpc3RlbmVyIGZvciBzcGVjaWZpZWQgVHJhY2tFbnRyeS5cbiAgICAgKiAhI3poIOeUqOadpeS4uuaMh+WumueahCBUcmFja0VudHJ5IOiuvue9ruWKqOeUu+S4gOasoeW+queOr+aSreaUvue7k+adn+eahOS6i+S7tuebkeWQrOOAglxuICAgICAqIEBtZXRob2Qgc2V0VHJhY2tDb21wbGV0ZUxpc3RlbmVyXG4gICAgICogQHBhcmFtIHtzcC5zcGluZS5UcmFja0VudHJ5fSBlbnRyeVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyXG4gICAgICogQHBhcmFtIHtzcC5zcGluZS5UcmFja0VudHJ5fSBsaXN0ZW5lci5lbnRyeVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBsaXN0ZW5lci5sb29wQ291bnRcbiAgICAgKi9cbiAgICBzZXRUcmFja0NvbXBsZXRlTGlzdGVuZXIgKGVudHJ5LCBsaXN0ZW5lcikge1xuICAgICAgICBUcmFja0VudHJ5TGlzdGVuZXJzLmdldExpc3RlbmVycyhlbnRyeSkuY29tcGxldGUgPSBmdW5jdGlvbiAodHJhY2tFbnRyeSkge1xuICAgICAgICAgICAgdmFyIGxvb3BDb3VudCA9IE1hdGguZmxvb3IodHJhY2tFbnRyeS50cmFja1RpbWUgLyB0cmFja0VudHJ5LmFuaW1hdGlvbkVuZCk7IFxuICAgICAgICAgICAgbGlzdGVuZXIodHJhY2tFbnRyeSwgbG9vcENvdW50KTtcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgdGhlIGV2ZW50IGxpc3RlbmVyIGZvciBzcGVjaWZpZWQgVHJhY2tFbnRyeS5cbiAgICAgKiAhI3poIOeUqOadpeS4uuaMh+WumueahCBUcmFja0VudHJ5IOiuvue9ruWKqOeUu+W4p+S6i+S7tueahOebkeWQrOOAglxuICAgICAqIEBtZXRob2Qgc2V0VHJhY2tFdmVudExpc3RlbmVyXG4gICAgICogQHBhcmFtIHtzcC5zcGluZS5UcmFja0VudHJ5fSBlbnRyeVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyXG4gICAgICovXG4gICAgc2V0VHJhY2tFdmVudExpc3RlbmVyIChlbnRyeSwgbGlzdGVuZXIpIHtcbiAgICAgICAgVHJhY2tFbnRyeUxpc3RlbmVycy5nZXRMaXN0ZW5lcnMoZW50cnkpLmV2ZW50ID0gbGlzdGVuZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0IHRoZSBhbmltYXRpb24gc3RhdGUgb2JqZWN0XG4gICAgICogISN6aCDojrflj5bliqjnlLvnirbmgIFcbiAgICAgKiBAbWV0aG9kIGdldFN0YXRlXG4gICAgICogQHJldHVybiB7c3Auc3BpbmUuQW5pbWF0aW9uU3RhdGV9IHN0YXRlXG4gICAgICovXG4gICAgZ2V0U3RhdGUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3RhdGU7XG4gICAgfSxcblxuICAgIC8vIHVwZGF0ZSBhbmltYXRpb24gbGlzdCBmb3IgZWRpdG9yXG4gICAgX3VwZGF0ZUFuaW1FbnVtOiBDQ19FRElUT1IgJiYgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYW5pbUVudW07XG4gICAgICAgIGlmICh0aGlzLnNrZWxldG9uRGF0YSkge1xuICAgICAgICAgICAgYW5pbUVudW0gPSB0aGlzLnNrZWxldG9uRGF0YS5nZXRBbmltc0VudW0oKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjaGFuZ2UgZW51bVxuICAgICAgICBzZXRFbnVtQXR0cih0aGlzLCAnX2FuaW1hdGlvbkluZGV4JywgYW5pbUVudW0gfHwgRGVmYXVsdEFuaW1zRW51bSk7XG4gICAgfSxcbiAgICAvLyB1cGRhdGUgc2tpbiBsaXN0IGZvciBlZGl0b3JcbiAgICBfdXBkYXRlU2tpbkVudW06IENDX0VESVRPUiAmJiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBza2luRW51bTtcbiAgICAgICAgaWYgKHRoaXMuc2tlbGV0b25EYXRhKSB7XG4gICAgICAgICAgICBza2luRW51bSA9IHRoaXMuc2tlbGV0b25EYXRhLmdldFNraW5zRW51bSgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNoYW5nZSBlbnVtXG4gICAgICAgIHNldEVudW1BdHRyKHRoaXMsICdfZGVmYXVsdFNraW5JbmRleCcsIHNraW5FbnVtIHx8IERlZmF1bHRTa2luc0VudW0pO1xuICAgIH0sXG5cbiAgICBfZW5zdXJlTGlzdGVuZXIgKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2xpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lciA9IG5ldyBUcmFja0VudHJ5TGlzdGVuZXJzKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5fc3RhdGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZS5hZGRMaXN0ZW5lcih0aGlzLl9saXN0ZW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3VwZGF0ZVNrZWxldG9uRGF0YSAoKSB7XG4gICAgICAgIGlmICghdGhpcy5za2VsZXRvbkRhdGEpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZVJlbmRlcigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGRhdGEgPSB0aGlzLnNrZWxldG9uRGF0YS5nZXRSdW50aW1lRGF0YSgpO1xuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZVJlbmRlcigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5zZXRTa2VsZXRvbkRhdGEoZGF0YSk7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNBbmltYXRpb25DYWNoZWQoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uU3RhdGVEYXRhKG5ldyBzcGluZS5BbmltYXRpb25TdGF0ZURhdGEodGhpcy5fc2tlbGV0b24uZGF0YSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kZWZhdWx0U2tpbiAmJiB0aGlzLnNldFNraW4odGhpcy5kZWZhdWx0U2tpbik7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNjLndhcm4oZSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuYXR0YWNoVXRpbC5pbml0KHRoaXMpO1xuICAgICAgICB0aGlzLmF0dGFjaFV0aWwuX2Fzc29jaWF0ZUF0dGFjaGVkTm9kZSgpO1xuICAgICAgICB0aGlzLl9wcmVDYWNoZU1vZGUgPSB0aGlzLl9jYWNoZU1vZGU7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uID0gdGhpcy5kZWZhdWx0QW5pbWF0aW9uO1xuICAgIH0sXG5cbiAgICBfcmVmcmVzaEluc3BlY3RvciAoKSB7XG4gICAgICAgIC8vIHVwZGF0ZSBpbnNwZWN0b3JcbiAgICAgICAgdGhpcy5fdXBkYXRlQW5pbUVudW0oKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlU2tpbkVudW0oKTtcbiAgICAgICAgRWRpdG9yLlV0aWxzLnJlZnJlc2hTZWxlY3RlZEluc3BlY3Rvcignbm9kZScsIHRoaXMubm9kZS51dWlkKTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZURlYnVnRHJhdzogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5kZWJ1Z0JvbmVzIHx8IHRoaXMuZGVidWdTbG90cykge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9kZWJ1Z1JlbmRlcmVyKSB7XG4gICAgICAgICAgICAgICAgbGV0IGRlYnVnRHJhd05vZGUgPSBuZXcgY2MuUHJpdmF0ZU5vZGUoKTtcbiAgICAgICAgICAgICAgICBkZWJ1Z0RyYXdOb2RlLm5hbWUgPSAnREVCVUdfRFJBV19OT0RFJztcbiAgICAgICAgICAgICAgICBsZXQgZGVidWdEcmF3ID0gZGVidWdEcmF3Tm9kZS5hZGRDb21wb25lbnQoR3JhcGhpY3MpO1xuICAgICAgICAgICAgICAgIGRlYnVnRHJhdy5saW5lV2lkdGggPSAxO1xuICAgICAgICAgICAgICAgIGRlYnVnRHJhdy5zdHJva2VDb2xvciA9IGNjLmNvbG9yKDI1NSwgMCwgMCwgMjU1KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWJ1Z1JlbmRlcmVyID0gZGVidWdEcmF3O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9kZWJ1Z1JlbmRlcmVyLm5vZGUucGFyZW50ID0gdGhpcy5ub2RlO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNBbmltYXRpb25DYWNoZWQoKSkge1xuICAgICAgICAgICAgICAgIGNjLndhcm4oXCJEZWJ1ZyBib25lcyBvciBzbG90cyBpcyBpbnZhbGlkIGluIGNhY2hlZCBtb2RlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX2RlYnVnUmVuZGVyZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2RlYnVnUmVuZGVyZXIubm9kZS5wYXJlbnQgPSBudWxsO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGdldFNrZWxldG9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9za2VsZXRvbikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NrZWxldG9uLmdldFNrZWxldG9uKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBzcC5Ta2VsZXRvbjtcbiJdfQ==