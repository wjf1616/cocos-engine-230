
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/deprecated.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
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
var js = cc.js;

if (CC_DEBUG) {
  var deprecateEnum = function deprecateEnum(obj, oldPath, newPath, hasTypePrefixBefore) {
    if (!CC_SUPPORT_JIT) {
      return;
    }

    hasTypePrefixBefore = hasTypePrefixBefore !== false;
    var enumDef = Function('return ' + newPath)();
    var entries = cc.Enum.getList(enumDef);
    var delimiter = hasTypePrefixBefore ? '_' : '.';

    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i].name;
      var oldPropName;

      if (hasTypePrefixBefore) {
        var oldTypeName = oldPath.split('.').slice(-1)[0];
        oldPropName = oldTypeName + '_' + entry;
      } else {
        oldPropName = entry;
      }

      js.get(obj, oldPropName, function (entry) {
        cc.errorID(1400, oldPath + delimiter + entry, newPath + '.' + entry);
        return enumDef[entry];
      }.bind(null, entry));
    }
  };

  var markAsRemoved = function markAsRemoved(ownerCtor, removedProps, ownerName) {
    if (!ownerCtor) {
      // 可能被裁剪了
      return;
    }

    ownerName = ownerName || js.getClassName(ownerCtor);
    removedProps.forEach(function (prop) {
      function error() {
        cc.errorID(1406, ownerName, prop);
      }

      js.getset(ownerCtor.prototype, prop, error, error);
    });
  };

  var markAsDeprecated = function markAsDeprecated(ownerCtor, deprecatedProps, ownerName) {
    if (!ownerCtor) {
      return;
    }

    ownerName = ownerName || js.getClassName(ownerCtor);
    var descriptors = Object.getOwnPropertyDescriptors(ownerCtor.prototype);
    deprecatedProps.forEach(function (prop) {
      var deprecatedProp = prop[0];
      var newProp = prop[1];
      var descriptor = descriptors[deprecatedProp];
      js.getset(ownerCtor.prototype, deprecatedProp, function () {
        cc.warnID(1400, ownerName + "." + deprecatedProp, ownerName + "." + newProp);
        return descriptor.get.call(this);
      }, function (v) {
        cc.warnID(1400, ownerName + "." + deprecatedProp, ownerName + "." + newProp);
        descriptor.set.call(this, v);
      });
    });
  };

  var markAsRemovedInObject = function markAsRemovedInObject(ownerObj, removedProps, ownerName) {
    if (!ownerObj) {
      // 可能被裁剪了
      return;
    }

    removedProps.forEach(function (prop) {
      function error() {
        cc.errorID(1406, ownerName, prop);
      }

      js.getset(ownerObj, prop, error);
    });
  };

  var provideClearError = function provideClearError(owner, obj, ownerName) {
    if (!owner) {
      // 可能被裁剪了
      return;
    }

    var className = ownerName || cc.js.getClassName(owner);
    var Info = 'Sorry, ' + className + '.%s is removed, please use %s instead.';

    var _loop = function _loop() {
      function define(prop, getset) {
        function accessor(newProp) {
          cc.error(Info, prop, newProp);
        }

        if (!Array.isArray(getset)) {
          getset = getset.split(',').map(function (x) {
            return x.trim();
          });
        }

        try {
          js.getset(owner, prop, accessor.bind(null, getset[0]), getset[1] && accessor.bind(null, getset[1]));
        } catch (e) {}
      }

      getset = obj[prop];

      if (prop[0] === '*') {
        // get set
        etProp = prop.slice(1);
        define('g' + etProp, getset);
        define('s' + etProp, getset);
      } else {
        prop.split(',').map(function (x) {
          return x.trim();
        }).forEach(function (x) {
          define(x, getset);
        });
      }
    };

    for (var prop in obj) {
      var getset;
      var etProp;

      _loop();
    }
  };

  var markFunctionWarning = function markFunctionWarning(ownerCtor, obj, ownerName) {
    if (!ownerCtor) {
      // 可能被裁剪了
      return;
    }

    ownerName = ownerName || js.getClassName(ownerCtor);

    for (var prop in obj) {
      (function () {
        var propName = prop;
        var originFunc = ownerCtor[propName];
        if (!originFunc) return;

        function warn() {
          cc.warn('Sorry, %s.%s is deprecated. Please use %s instead', ownerName, propName, obj[propName]);
          return originFunc.apply(this, arguments);
        }

        ownerCtor[propName] = warn;
      })();
    }
  }; // remove cc.info


  js.get(cc, 'info', function () {
    cc.warnID(1400, 'cc.info', 'cc.log');
    return cc.log;
  }); // cc.spriteFrameCache

  js.get(cc, "spriteFrameCache", function () {
    cc.errorID(1404);
  }); // cc.vmath

  js.get(cc, 'vmath', function () {
    cc.warnID(1400, 'cc.vmath', 'cc.math');
    return cc.math;
  });
  js.get(cc.math, 'vec2', function () {
    cc.warnID(1400, 'cc.vmath.vec2', 'cc.Vec2');
    return cc.Vec2;
  });
  js.get(cc.math, 'vec3', function () {
    cc.warnID(1400, 'cc.vmath.vec3', 'cc.Vec3');
    return cc.Vec3;
  });
  js.get(cc.math, 'vec4', function () {
    cc.warnID(1400, 'cc.vmath.vec4', 'cc.Vec4');
    return cc.Vec4;
  });
  js.get(cc.math, 'mat4', function () {
    cc.warnID(1400, 'cc.vmath.mat4', 'cc.Mat4');
    return cc.Mat4;
  });
  js.get(cc.math, 'mat3', function () {
    cc.warnID(1400, 'cc.vmath.mat3', 'cc.Mat3');
    return cc.Mat3;
  });
  js.get(cc.math, 'quat', function () {
    cc.warnID(1400, 'cc.vmath.quat', 'cc.Quat');
    return cc.Quat;
  }); // SpriteFrame

  js.get(cc.SpriteFrame.prototype, '_textureLoaded', function () {
    cc.errorID(1400, 'spriteFrame._textureLoaded', 'spriteFrame.textureLoaded()');
    return this.textureLoaded();
  });
  markAsRemoved(cc.SpriteFrame, ['addLoadedEventListener']);
  markFunctionWarning(cc.Sprite.prototype, {
    setState: 'cc.Sprite.setMaterial',
    getState: 'cc.Sprite.getMaterial'
  }, 'cc.Sprite');
  js.get(cc.SpriteFrame.prototype, 'clearTexture', function () {
    cc.warnID(1406, 'cc.SpriteFrame', 'clearTexture');
    return function () {};
  }); // cc.textureCache

  js.get(cc, 'textureCache', function () {
    cc.errorID(1406, 'cc', 'textureCache');
  }); // Texture

  var Texture2D = cc.Texture2D;
  js.obsolete(Texture2D.prototype, 'texture.releaseTexture', 'texture.destroy');
  js.get(Texture2D.prototype, 'getName', function () {
    cc.warnID(1400, 'texture.getName()', 'texture._glID');
    return function () {
      return this._glID || null;
    };
  });
  js.get(Texture2D.prototype, 'isLoaded', function () {
    cc.errorID(1400, 'texture.isLoaded function', 'texture.loaded property');
    return function () {
      return this.loaded;
    };
  });
  js.get(Texture2D.prototype, 'setAntiAliasTexParameters', function () {
    cc.warnID(1400, 'texture.setAntiAliasTexParameters()', 'texture.setFilters(cc.Texture2D.Filter.LINEAR, cc.Texture2D.Filter.LINEAR)');
    return function () {
      this.setFilters(Texture2D.Filter.LINEAR, Texture2D.Filter.LINEAR);
    };
  });
  js.get(Texture2D.prototype, 'setAliasTexParameters', function () {
    cc.warnID(1400, 'texture.setAntiAliasTexParameters()', 'texture.setFilters(cc.Texture2D.Filter.NEAREST, cc.Texture2D.Filter.NEAREST)');
    return function () {
      this.setFilters(Texture2D.Filter.NEAREST, Texture2D.Filter.NEAREST);
    };
  }); // cc.macro

  markAsRemovedInObject(cc.macro, ['ENABLE_GL_STATE_CACHE', 'FIX_ARTIFACTS_BY_STRECHING_TEXEL'], 'cc.macro');
  provideClearError(cc.macro, {
    PI: 'Math.PI',
    PI2: 'Math.PI*2',
    FLT_MAX: 'Number.MAX_VALUE',
    FLT_MIN: 'Number.MIN_VALUE',
    UINT_MAX: 'Number.MAX_SAFE_INTEGER'
  }, 'cc.macro'); // cc.game

  markAsRemovedInObject(cc.game, ['CONFIG_KEY'], 'cc.game'); // cc.sys

  markAsRemovedInObject(cc.sys, ['dumpRoot', 'cleanScript'], 'cc.sys'); // cc.Director

  provideClearError(cc.Director, {
    EVENT_PROJECTION_CHANGED: '',
    EVENT_BEFORE_VISIT: 'EVENT_AFTER_UPDATE',
    EVENT_AFTER_VISIT: 'EVENT_BEFORE_DRAW'
  }, 'cc.Director');
  markFunctionWarning(cc.Director.prototype, {
    convertToGL: 'cc.view.convertToLocationInView',
    convertToUI: '',
    getWinSize: 'cc.winSize',
    getWinSizeInPixels: 'cc.winSize',
    getVisibleSize: 'cc.view.getVisibleSize',
    getVisibleOrigin: 'cc.view.getVisibleOrigin',
    purgeCachedData: 'cc.loader.releaseAll',
    setDepthTest: 'cc.Camera.main.depth',
    setClearColor: 'cc.Camera.main.backgroundColor',
    getRunningScene: 'cc.director.getScene',
    getAnimationInterval: 'cc.game.getFrameRate',
    setAnimationInterval: 'cc.game.setFrameRate',
    isDisplayStats: 'cc.debug.isDisplayStats',
    setDisplayStats: 'cc.debug.setDisplayStats',
    stopAnimation: 'cc.game.pause',
    startAnimation: 'cc.game.resume'
  }, 'cc.Director');
  markAsRemoved(cc.Director, ['pushScene', 'popScene', 'popToRootScene', 'popToSceneStackLevel', 'setProjection', 'getProjection'], 'cc.Director'); // Scheduler

  provideClearError(cc.Scheduler, {
    scheduleCallbackForTarget: 'schedule',
    scheduleUpdateForTarget: 'scheduleUpdate',
    unscheduleCallbackForTarget: 'unschedule',
    unscheduleUpdateForTarget: 'unscheduleUpdate',
    unscheduleAllCallbacksForTarget: 'unscheduleAllForTarget',
    unscheduleAllCallbacks: 'unscheduleAll',
    unscheduleAllCallbacksWithMinPriority: 'unscheduleAllWithMinPriority'
  }, 'cc.Scheduler'); // cc.view

  provideClearError(cc.view, {
    adjustViewPort: 'adjustViewportMeta',
    setViewPortInPoints: 'setViewportInPoints',
    getViewPortRect: 'getViewportRect'
  }, 'cc.view');
  markAsRemovedInObject(cc.view, ['isViewReady', 'setTargetDensityDPI', 'getTargetDensityDPI', 'setFrameZoomFactor', 'canSetContentScaleFactor', 'setContentTranslateLeftTop', 'getContentTranslateLeftTop', 'setViewName', 'getViewName'], 'cc.view'); // Loader

  markAsRemoved(cc.Pipeline, ['flowInDeps', 'getItems'], 'cc.loader'); // cc.PhysicsManager

  markAsRemoved(cc.PhysicsManager, ['attachDebugDrawToCamera', 'detachDebugDrawFromCamera']); // cc.CollisionManager

  markAsRemoved(cc.CollisionManager, ['attachDebugDrawToCamera', 'detachDebugDrawFromCamera']); // cc.Node

  provideClearError(cc._BaseNode.prototype, {
    'tag': 'name',
    'getTag': 'name',
    'setTag': 'name',
    'getChildByTag': 'getChildByName',
    'removeChildByTag': 'getChildByName(name).destroy()'
  });
  markAsRemoved(cc.Node, ['_cascadeColorEnabled', 'cascadeColor', 'isCascadeColorEnabled', 'setCascadeColorEnabled', '_cascadeOpacityEnabled', 'cascadeOpacity', 'isCascadeOpacityEnabled', 'setCascadeOpacityEnabled', 'opacityModifyRGB', 'isOpacityModifyRGB', 'setOpacityModifyRGB', 'ignoreAnchor', 'isIgnoreAnchorPointForPosition', 'ignoreAnchorPointForPosition', 'isRunning', '_sgNode']);
  markFunctionWarning(cc.Node.prototype, {
    getNodeToParentTransform: 'getLocalMatrix',
    getNodeToParentTransformAR: 'getLocalMatrix',
    getNodeToWorldTransform: 'getWorldMatrix',
    getNodeToWorldTransformAR: 'getWorldMatrix',
    getParentToNodeTransform: 'getLocalMatrix',
    getWorldToNodeTransform: 'getWorldMatrix',
    convertTouchToNodeSpace: 'convertToNodeSpaceAR',
    convertTouchToNodeSpaceAR: 'convertToNodeSpaceAR',
    convertToWorldSpace: 'convertToWorldSpaceAR',
    convertToNodeSpace: 'convertToNodeSpaceAR'
  });
  provideClearError(cc.Node.prototype, {
    getRotationX: 'rotationX',
    setRotationX: 'rotationX',
    getRotationY: 'rotationY',
    setRotationY: 'rotationY',
    getPositionX: 'x',
    setPositionX: 'x',
    getPositionY: 'y',
    setPositionY: 'y',
    getSkewX: 'skewX',
    setSkewX: 'skewX',
    getSkewY: 'skewY',
    setSkewY: 'skewY',
    getScaleX: 'scaleX',
    setScaleX: 'scaleX',
    getScaleY: 'scaleY',
    setScaleY: 'scaleY',
    getOpacity: 'opacity',
    setOpacity: 'opacity',
    getColor: 'color',
    setColor: 'color',
    getLocalZOrder: 'zIndex',
    setLocalZOrder: 'zIndex'
  }); // cc.Component

  markAsRemoved(cc.Component, ['isRunning']);
  provideClearError(cc.Sprite.prototype, {
    setInsetLeft: 'cc.SpriteFrame insetLeft',
    setInsetRight: 'cc.SpriteFrame insetRight',
    setInsetTop: 'cc.SpriteFrame insetTop',
    setInsetBottom: 'cc.SpriteFrame insetBottom'
  }); // cc.Material

  cc.Material.getInstantiatedBuiltinMaterial = cc.MaterialVariant.createWithBuiltin;
  cc.Material.getInstantiatedMaterial = cc.MaterialVariant.create;
  markFunctionWarning(cc.Material, {
    getInstantiatedBuiltinMaterial: 'cc.MaterialVariant.createWithBuiltin',
    getInstantiatedMaterial: 'cc.MaterialVariant.create'
  }); // cc.RenderComponent

  cc.js.getset(cc.RenderComponent.prototype, 'sharedMaterials', function () {
    cc.warnID(1400, 'sharedMaterials', 'getMaterials');
    return this.materials;
  }, function (v) {
    cc.warnID(1400, 'sharedMaterials', 'setMaterial');
    this.materials = v;
  }); // cc.Camera

  markFunctionWarning(cc.Camera.prototype, {
    getNodeToCameraTransform: 'getWorldToScreenMatrix2D',
    getCameraToWorldPoint: 'getScreenToWorldPoint',
    getWorldToCameraPoint: 'getWorldToScreenPoint',
    getCameraToWorldMatrix: 'getScreenToWorldMatrix2D',
    getWorldToCameraMatrix: 'getWorldToScreenMatrix2D'
  });
  markAsRemoved(cc.Camera, ['addTarget', 'removeTarget', 'getTargets']); // SCENE

  var ERR = '"%s" is not defined in the Scene, it is only defined in normal nodes.';
  CC_EDITOR || Object.defineProperties(cc.Scene.prototype, {
    active: {
      get: function get() {
        cc.error(ERR, 'active');
        return true;
      },
      set: function set() {
        cc.error(ERR, 'active');
      }
    },
    activeInHierarchy: {
      get: function get() {
        cc.error(ERR, 'activeInHierarchy');
        return true;
      }
    },
    getComponent: {
      get: function get() {
        cc.error(ERR, 'getComponent');
        return function () {
          return null;
        };
      }
    },
    addComponent: {
      get: function get() {
        cc.error(ERR, 'addComponent');
        return function () {
          return null;
        };
      }
    }
  }); // cc.dynamicAtlasManager

  markAsRemovedInObject(cc.dynamicAtlasManager, ['minFrameSize'], 'cc.dynamicAtlasManager'); // Value types

  provideClearError(cc, {
    // AffineTransform
    affineTransformMake: 'cc.AffineTransform.create',
    affineTransformMakeIdentity: 'cc.AffineTransform.identity',
    affineTransformClone: 'cc.AffineTransform.clone',
    affineTransformConcat: 'cc.AffineTransform.concat',
    affineTransformConcatIn: 'cc.AffineTransform.concat',
    affineTransformInvert: 'cc.AffineTransform.invert',
    affineTransformInvertIn: 'cc.AffineTransform.invert',
    affineTransformInvertOut: 'cc.AffineTransform.invert',
    affineTransformEqualToTransform: 'cc.AffineTransform.equal',
    pointApplyAffineTransform: 'cc.AffineTransform.transformVec2',
    sizeApplyAffineTransform: 'cc.AffineTransform.transformSize',
    rectApplyAffineTransform: 'cc.AffineTransform.transformRect',
    obbApplyAffineTransform: 'cc.AffineTransform.transformObb',
    // Vec2
    pointEqualToPoint: 'cc.Vec2 equals',
    // Size
    sizeEqualToSize: 'cc.Size equals',
    // Rect
    rectEqualToRect: 'rectA.equals(rectB)',
    rectContainsRect: 'rectA.containsRect(rectB)',
    rectContainsPoint: 'rect.contains(vec2)',
    rectOverlapsRect: 'rectA.intersects(rectB)',
    rectIntersectsRect: 'rectA.intersects(rectB)',
    rectIntersection: 'rectA.intersection(intersection, rectB)',
    rectUnion: 'rectA.union(union, rectB)',
    rectGetMaxX: 'rect.xMax',
    rectGetMidX: 'rect.center.x',
    rectGetMinX: 'rect.xMin',
    rectGetMaxY: 'rect.yMax',
    rectGetMidY: 'rect.center.y',
    rectGetMinY: 'rect.yMin',
    // Color
    colorEqual: 'colorA.equals(colorB)',
    hexToColor: 'color.fromHEX(hexColor)',
    colorToHex: 'color.toHEX()',
    // Enums
    TextAlignment: 'cc.macro.TextAlignment',
    VerticalTextAlignment: 'cc.macro.VerticalTextAlignment',
    // Point Extensions
    pNeg: 'p.neg()',
    pAdd: 'p1.add(p2)',
    pSub: 'p1.sub(p2)',
    pMult: 'p.mul(factor)',
    pMidpoint: 'p1.add(p2).mul(0.5)',
    pDot: 'p1.dot(p2)',
    pCross: 'p1.cross(p2)',
    pPerp: 'p.rotate(-90 * Math.PI / 180)',
    pRPerp: 'p.rotate(90 * Math.PI / 180)',
    pProject: 'p1.project(p2)',
    pLengthSQ: 'p.magSqr()',
    pDistanceSQ: 'p1.sub(p2).magSqr()',
    pLength: 'p.mag()',
    pDistance: 'p1.sub(p2).mag()',
    pNormalize: 'p.normalize()',
    pForAngle: 'cc.v2(Math.cos(a), Math.sin(a))',
    pToAngle: 'Math.atan2(v.y, v.x)',
    pZeroIn: 'p.x = p.y = 0',
    pIn: 'p1.set(p2)',
    pMultIn: 'p.mulSelf(factor)',
    pSubIn: 'p1.subSelf(p2)',
    pAddIn: 'p1.addSelf(p2)',
    pNormalizeIn: 'p.normalizeSelf()',
    pSameAs: 'p1.equals(p2)',
    pAngle: 'v1.angle(v2)',
    pAngleSigned: 'v1.signAngle(v2)',
    pRotateByAngle: 'p.rotate(radians)',
    pCompMult: 'v1.dot(v2)',
    pFuzzyEqual: 'v1.fuzzyEquals(v2, tolerance)',
    pLerp: 'p.lerp(endPoint, ratio)',
    pClamp: 'p.clampf(min_inclusive, max_inclusive)',
    rand: 'Math.random() * 0xffffff',
    randomMinus1To1: '(Math.random() - 0.5) * 2',
    container: 'cc.game.container',
    _canvas: 'cc.game.canvas',
    _renderType: 'cc.game.renderType',
    _getError: 'cc.debug.getError',
    _initDebugSetting: 'cc.debug._resetDebugSetting',
    DebugMode: 'cc.debug.DebugMode'
  }, 'cc');
  markAsRemovedInObject(cc, ['blendFuncDisable', 'pFromSize', 'pCompOp', 'pIntersectPoint', 'pSegmentIntersect', 'pLineIntersect', 'obbApplyMatrix', 'getImageFormatByData', 'initEngine'], 'cc');
  markFunctionWarning(cc, {
    // cc.p
    p: 'cc.v2'
  }, 'cc'); // cc.Rect

  provideClearError(cc.Rect, {
    contain: 'rectA.contains(rectB)',
    transformMat4: 'rect.transformMat4(out, mat4)'
  }); // cc.Color

  provideClearError(cc.Color, {
    rgb2hsv: 'color.toHSV()',
    hsv2rgb: 'color.fromHSV(h, s, v)'
  }); // macro functions

  js.get(cc, 'lerp', function () {
    cc.warnID(1400, 'cc.lerp', 'cc.misc.lerp');
    return cc.misc.lerp;
  });
  js.get(cc, 'random0To1', function () {
    cc.warnID(1400, 'cc.random0To1', 'Math.random');
    return Math.random;
  });
  js.get(cc, 'degreesToRadians', function () {
    cc.warnID(1400, 'cc.degreesToRadians', 'cc.misc.degreesToRadians');
    return cc.misc.degreesToRadians;
  });
  js.get(cc, 'radiansToDegrees', function () {
    cc.warnID(1400, 'cc.radiansToDegrees', 'cc.misc.radiansToDegrees');
    return cc.misc.radiansToDegrees;
  });
  js.get(cc, 'clampf', function () {
    cc.warnID(1400, 'cc.clampf', 'cc.misc.clampf');
    return cc.misc.clampf;
  });
  js.get(cc, 'clamp01', function () {
    cc.warnID(1400, 'cc.clamp01', 'cc.misc.clamp01');
    return cc.misc.clamp01;
  });
  js.get(cc, 'ImageFormat', function () {
    cc.warnID(1400, 'cc.ImageFormat', 'cc.macro.ImageFormat');
    return cc.macro.ImageFormat;
  });
  js.get(cc, 'KEY', function () {
    cc.warnID(1400, 'cc.KEY', 'cc.macro.KEY');
    return cc.macro.KEY;
  });
  js.get(cc, 'Easing', function () {
    cc.warnID(1400, 'cc.Easing', 'cc.easing');
    return cc.easing;
  }); // cc.isChildClassOf

  js.get(cc, 'isChildClassOf', function () {
    cc.errorID(1400, 'cc.isChildClassOf', 'cc.js.isChildClassOf');
    return cc.js.isChildClassOf;
  }); // dragon bones

  if (typeof dragonBones !== 'undefined') {
    js.obsolete(dragonBones.CCFactory, 'dragonBones.CCFactory.getFactory', 'getInstance');
  } // renderEngine


  cc.renderer.renderEngine = {
    get gfx() {
      cc.warnID(1400, 'cc.renderer.renderEngine.gfx', 'cc.gfx');
      return cc.gfx;
    },

    get math() {
      cc.warnID(1400, 'cc.renderer.renderEngine.math', 'cc.math');
      return cc.vmath;
    },

    get InputAssembler() {
      cc.warnID(1400, 'cc.renderer.renderEngine.InputAssembler', 'cc.renderer.InputAssembler');
      return cc.renderer.InputAssembler;
    }

  };
}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlcHJlY2F0ZWQuanMiXSwibmFtZXMiOlsianMiLCJjYyIsIkNDX0RFQlVHIiwiZGVwcmVjYXRlRW51bSIsIm9iaiIsIm9sZFBhdGgiLCJuZXdQYXRoIiwiaGFzVHlwZVByZWZpeEJlZm9yZSIsIkNDX1NVUFBPUlRfSklUIiwiZW51bURlZiIsIkZ1bmN0aW9uIiwiZW50cmllcyIsIkVudW0iLCJnZXRMaXN0IiwiZGVsaW1pdGVyIiwiaSIsImxlbmd0aCIsImVudHJ5IiwibmFtZSIsIm9sZFByb3BOYW1lIiwib2xkVHlwZU5hbWUiLCJzcGxpdCIsInNsaWNlIiwiZ2V0IiwiZXJyb3JJRCIsImJpbmQiLCJtYXJrQXNSZW1vdmVkIiwib3duZXJDdG9yIiwicmVtb3ZlZFByb3BzIiwib3duZXJOYW1lIiwiZ2V0Q2xhc3NOYW1lIiwiZm9yRWFjaCIsInByb3AiLCJlcnJvciIsImdldHNldCIsInByb3RvdHlwZSIsIm1hcmtBc0RlcHJlY2F0ZWQiLCJkZXByZWNhdGVkUHJvcHMiLCJkZXNjcmlwdG9ycyIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCJkZXByZWNhdGVkUHJvcCIsIm5ld1Byb3AiLCJkZXNjcmlwdG9yIiwid2FybklEIiwiY2FsbCIsInYiLCJzZXQiLCJtYXJrQXNSZW1vdmVkSW5PYmplY3QiLCJvd25lck9iaiIsInByb3ZpZGVDbGVhckVycm9yIiwib3duZXIiLCJjbGFzc05hbWUiLCJJbmZvIiwiZGVmaW5lIiwiYWNjZXNzb3IiLCJBcnJheSIsImlzQXJyYXkiLCJtYXAiLCJ4IiwidHJpbSIsImUiLCJldFByb3AiLCJtYXJrRnVuY3Rpb25XYXJuaW5nIiwicHJvcE5hbWUiLCJvcmlnaW5GdW5jIiwid2FybiIsImFwcGx5IiwiYXJndW1lbnRzIiwibG9nIiwibWF0aCIsIlZlYzIiLCJWZWMzIiwiVmVjNCIsIk1hdDQiLCJNYXQzIiwiUXVhdCIsIlNwcml0ZUZyYW1lIiwidGV4dHVyZUxvYWRlZCIsIlNwcml0ZSIsInNldFN0YXRlIiwiZ2V0U3RhdGUiLCJUZXh0dXJlMkQiLCJvYnNvbGV0ZSIsIl9nbElEIiwibG9hZGVkIiwic2V0RmlsdGVycyIsIkZpbHRlciIsIkxJTkVBUiIsIk5FQVJFU1QiLCJtYWNybyIsIlBJIiwiUEkyIiwiRkxUX01BWCIsIkZMVF9NSU4iLCJVSU5UX01BWCIsImdhbWUiLCJzeXMiLCJEaXJlY3RvciIsIkVWRU5UX1BST0pFQ1RJT05fQ0hBTkdFRCIsIkVWRU5UX0JFRk9SRV9WSVNJVCIsIkVWRU5UX0FGVEVSX1ZJU0lUIiwiY29udmVydFRvR0wiLCJjb252ZXJ0VG9VSSIsImdldFdpblNpemUiLCJnZXRXaW5TaXplSW5QaXhlbHMiLCJnZXRWaXNpYmxlU2l6ZSIsImdldFZpc2libGVPcmlnaW4iLCJwdXJnZUNhY2hlZERhdGEiLCJzZXREZXB0aFRlc3QiLCJzZXRDbGVhckNvbG9yIiwiZ2V0UnVubmluZ1NjZW5lIiwiZ2V0QW5pbWF0aW9uSW50ZXJ2YWwiLCJzZXRBbmltYXRpb25JbnRlcnZhbCIsImlzRGlzcGxheVN0YXRzIiwic2V0RGlzcGxheVN0YXRzIiwic3RvcEFuaW1hdGlvbiIsInN0YXJ0QW5pbWF0aW9uIiwiU2NoZWR1bGVyIiwic2NoZWR1bGVDYWxsYmFja0ZvclRhcmdldCIsInNjaGVkdWxlVXBkYXRlRm9yVGFyZ2V0IiwidW5zY2hlZHVsZUNhbGxiYWNrRm9yVGFyZ2V0IiwidW5zY2hlZHVsZVVwZGF0ZUZvclRhcmdldCIsInVuc2NoZWR1bGVBbGxDYWxsYmFja3NGb3JUYXJnZXQiLCJ1bnNjaGVkdWxlQWxsQ2FsbGJhY2tzIiwidW5zY2hlZHVsZUFsbENhbGxiYWNrc1dpdGhNaW5Qcmlvcml0eSIsInZpZXciLCJhZGp1c3RWaWV3UG9ydCIsInNldFZpZXdQb3J0SW5Qb2ludHMiLCJnZXRWaWV3UG9ydFJlY3QiLCJQaXBlbGluZSIsIlBoeXNpY3NNYW5hZ2VyIiwiQ29sbGlzaW9uTWFuYWdlciIsIl9CYXNlTm9kZSIsIk5vZGUiLCJnZXROb2RlVG9QYXJlbnRUcmFuc2Zvcm0iLCJnZXROb2RlVG9QYXJlbnRUcmFuc2Zvcm1BUiIsImdldE5vZGVUb1dvcmxkVHJhbnNmb3JtIiwiZ2V0Tm9kZVRvV29ybGRUcmFuc2Zvcm1BUiIsImdldFBhcmVudFRvTm9kZVRyYW5zZm9ybSIsImdldFdvcmxkVG9Ob2RlVHJhbnNmb3JtIiwiY29udmVydFRvdWNoVG9Ob2RlU3BhY2UiLCJjb252ZXJ0VG91Y2hUb05vZGVTcGFjZUFSIiwiY29udmVydFRvV29ybGRTcGFjZSIsImNvbnZlcnRUb05vZGVTcGFjZSIsImdldFJvdGF0aW9uWCIsInNldFJvdGF0aW9uWCIsImdldFJvdGF0aW9uWSIsInNldFJvdGF0aW9uWSIsImdldFBvc2l0aW9uWCIsInNldFBvc2l0aW9uWCIsImdldFBvc2l0aW9uWSIsInNldFBvc2l0aW9uWSIsImdldFNrZXdYIiwic2V0U2tld1giLCJnZXRTa2V3WSIsInNldFNrZXdZIiwiZ2V0U2NhbGVYIiwic2V0U2NhbGVYIiwiZ2V0U2NhbGVZIiwic2V0U2NhbGVZIiwiZ2V0T3BhY2l0eSIsInNldE9wYWNpdHkiLCJnZXRDb2xvciIsInNldENvbG9yIiwiZ2V0TG9jYWxaT3JkZXIiLCJzZXRMb2NhbFpPcmRlciIsIkNvbXBvbmVudCIsInNldEluc2V0TGVmdCIsInNldEluc2V0UmlnaHQiLCJzZXRJbnNldFRvcCIsInNldEluc2V0Qm90dG9tIiwiTWF0ZXJpYWwiLCJnZXRJbnN0YW50aWF0ZWRCdWlsdGluTWF0ZXJpYWwiLCJNYXRlcmlhbFZhcmlhbnQiLCJjcmVhdGVXaXRoQnVpbHRpbiIsImdldEluc3RhbnRpYXRlZE1hdGVyaWFsIiwiY3JlYXRlIiwiUmVuZGVyQ29tcG9uZW50IiwibWF0ZXJpYWxzIiwiQ2FtZXJhIiwiZ2V0Tm9kZVRvQ2FtZXJhVHJhbnNmb3JtIiwiZ2V0Q2FtZXJhVG9Xb3JsZFBvaW50IiwiZ2V0V29ybGRUb0NhbWVyYVBvaW50IiwiZ2V0Q2FtZXJhVG9Xb3JsZE1hdHJpeCIsImdldFdvcmxkVG9DYW1lcmFNYXRyaXgiLCJFUlIiLCJDQ19FRElUT1IiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiU2NlbmUiLCJhY3RpdmUiLCJhY3RpdmVJbkhpZXJhcmNoeSIsImdldENvbXBvbmVudCIsImFkZENvbXBvbmVudCIsImR5bmFtaWNBdGxhc01hbmFnZXIiLCJhZmZpbmVUcmFuc2Zvcm1NYWtlIiwiYWZmaW5lVHJhbnNmb3JtTWFrZUlkZW50aXR5IiwiYWZmaW5lVHJhbnNmb3JtQ2xvbmUiLCJhZmZpbmVUcmFuc2Zvcm1Db25jYXQiLCJhZmZpbmVUcmFuc2Zvcm1Db25jYXRJbiIsImFmZmluZVRyYW5zZm9ybUludmVydCIsImFmZmluZVRyYW5zZm9ybUludmVydEluIiwiYWZmaW5lVHJhbnNmb3JtSW52ZXJ0T3V0IiwiYWZmaW5lVHJhbnNmb3JtRXF1YWxUb1RyYW5zZm9ybSIsInBvaW50QXBwbHlBZmZpbmVUcmFuc2Zvcm0iLCJzaXplQXBwbHlBZmZpbmVUcmFuc2Zvcm0iLCJyZWN0QXBwbHlBZmZpbmVUcmFuc2Zvcm0iLCJvYmJBcHBseUFmZmluZVRyYW5zZm9ybSIsInBvaW50RXF1YWxUb1BvaW50Iiwic2l6ZUVxdWFsVG9TaXplIiwicmVjdEVxdWFsVG9SZWN0IiwicmVjdENvbnRhaW5zUmVjdCIsInJlY3RDb250YWluc1BvaW50IiwicmVjdE92ZXJsYXBzUmVjdCIsInJlY3RJbnRlcnNlY3RzUmVjdCIsInJlY3RJbnRlcnNlY3Rpb24iLCJyZWN0VW5pb24iLCJyZWN0R2V0TWF4WCIsInJlY3RHZXRNaWRYIiwicmVjdEdldE1pblgiLCJyZWN0R2V0TWF4WSIsInJlY3RHZXRNaWRZIiwicmVjdEdldE1pblkiLCJjb2xvckVxdWFsIiwiaGV4VG9Db2xvciIsImNvbG9yVG9IZXgiLCJUZXh0QWxpZ25tZW50IiwiVmVydGljYWxUZXh0QWxpZ25tZW50IiwicE5lZyIsInBBZGQiLCJwU3ViIiwicE11bHQiLCJwTWlkcG9pbnQiLCJwRG90IiwicENyb3NzIiwicFBlcnAiLCJwUlBlcnAiLCJwUHJvamVjdCIsInBMZW5ndGhTUSIsInBEaXN0YW5jZVNRIiwicExlbmd0aCIsInBEaXN0YW5jZSIsInBOb3JtYWxpemUiLCJwRm9yQW5nbGUiLCJwVG9BbmdsZSIsInBaZXJvSW4iLCJwSW4iLCJwTXVsdEluIiwicFN1YkluIiwicEFkZEluIiwicE5vcm1hbGl6ZUluIiwicFNhbWVBcyIsInBBbmdsZSIsInBBbmdsZVNpZ25lZCIsInBSb3RhdGVCeUFuZ2xlIiwicENvbXBNdWx0IiwicEZ1enp5RXF1YWwiLCJwTGVycCIsInBDbGFtcCIsInJhbmQiLCJyYW5kb21NaW51czFUbzEiLCJjb250YWluZXIiLCJfY2FudmFzIiwiX3JlbmRlclR5cGUiLCJfZ2V0RXJyb3IiLCJfaW5pdERlYnVnU2V0dGluZyIsIkRlYnVnTW9kZSIsInAiLCJSZWN0IiwiY29udGFpbiIsInRyYW5zZm9ybU1hdDQiLCJDb2xvciIsInJnYjJoc3YiLCJoc3YycmdiIiwibWlzYyIsImxlcnAiLCJNYXRoIiwicmFuZG9tIiwiZGVncmVlc1RvUmFkaWFucyIsInJhZGlhbnNUb0RlZ3JlZXMiLCJjbGFtcGYiLCJjbGFtcDAxIiwiSW1hZ2VGb3JtYXQiLCJLRVkiLCJlYXNpbmciLCJpc0NoaWxkQ2xhc3NPZiIsImRyYWdvbkJvbmVzIiwiQ0NGYWN0b3J5IiwicmVuZGVyZXIiLCJyZW5kZXJFbmdpbmUiLCJnZngiLCJ2bWF0aCIsIklucHV0QXNzZW1ibGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFJQSxFQUFFLEdBQUdDLEVBQUUsQ0FBQ0QsRUFBWjs7QUFFQSxJQUFJRSxRQUFKLEVBQWM7QUFBQSxNQUVEQyxhQUZDLEdBRVYsU0FBU0EsYUFBVCxDQUF3QkMsR0FBeEIsRUFBNkJDLE9BQTdCLEVBQXNDQyxPQUF0QyxFQUErQ0MsbUJBQS9DLEVBQW9FO0FBQ2hFLFFBQUksQ0FBQ0MsY0FBTCxFQUFxQjtBQUNqQjtBQUNIOztBQUNERCxJQUFBQSxtQkFBbUIsR0FBR0EsbUJBQW1CLEtBQUssS0FBOUM7QUFDQSxRQUFJRSxPQUFPLEdBQUdDLFFB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LEVBQUUsQ0FBQ21GLFFBQUgsQ0FBWTJNLFdBQVcsQ0FBQ0MsU0FBeEIsRUFBbUMsa0NBQW5DLEVBQXVFLGFBQXZFO0FBQ0gsR0FocEJTLENBa3BCVjs7O0FBQ0E5UixFQUFBQSxFQUFFLENBQUMrUixRQUFILENBQVlDLFlBQVosR0FBMkI7QUFDdkIsUUFBSUMsR0FBSixHQUFXO0FBQ1BqUyxNQUFBQSxFQUFFLENBQUMyQyxNQUFILENBQVUsSUFBVixFQUFnQiw4QkFBaEIsRUFBZ0QsUUFBaEQ7QUFDQSxhQUFPM0MsRUFBRSxDQUFDaVMsR0FBVjtBQUNILEtBSnNCOztBQUt2QixRQUFJNU4sSUFBSixHQUFZO0FBQ1JyRSxNQUFBQSxFQUFFLENBQUMyQyxNQUFILENBQVUsSUFBVixFQUFnQiwrQkFBaEIsRUFBaUQsU0FBakQ7QUFDQSxhQUFPM0MsRUFBRSxDQUFDa1MsS0FBVjtBQUNILEtBUnNCOztBQVN2QixRQUFJQyxjQUFKLEdBQXNCO0FBQ2xCblMsTUFBQUEsRUFBRSxDQUFDMkMsTUFBSCxDQUFVLElBQVYsRUFBZ0IseUNBQWhCLEVBQTJELDRCQUEzRDtBQUNBLGFBQU8zQyxFQUFFLENBQUMrUixRQUFILENBQVlJLGNBQW5CO0FBQ0g7O0FBWnNCLEdBQTNCO0FBZUgiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbnZhciBqcyA9IGNjLmpzO1xuXG5pZiAoQ0NfREVCVUcpIHtcblxuICAgIGZ1bmN0aW9uIGRlcHJlY2F0ZUVudW0gKG9iaiwgb2xkUGF0aCwgbmV3UGF0aCwgaGFzVHlwZVByZWZpeEJlZm9yZSkge1xuICAgICAgICBpZiAoIUNDX1NVUFBPUlRfSklUKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaGFzVHlwZVByZWZpeEJlZm9yZSA9IGhhc1R5cGVQcmVmaXhCZWZvcmUgIT09IGZhbHNlO1xuICAgICAgICB2YXIgZW51bURlZiA9IEZ1bmN0aW9uKCdyZXR1cm4gJyArIG5ld1BhdGgpKCk7XG4gICAgICAgIHZhciBlbnRyaWVzID0gY2MuRW51bS5nZXRMaXN0KGVudW1EZWYpO1xuICAgICAgICB2YXIgZGVsaW1pdGVyID0gaGFzVHlwZVByZWZpeEJlZm9yZSA/ICdfJyA6ICcuJztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbnRyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2ldLm5hbWU7XG4gICAgICAgICAgICB2YXIgb2xkUHJvcE5hbWU7XG4gICAgICAgICAgICBpZiAoaGFzVHlwZVByZWZpeEJlZm9yZSkge1xuICAgICAgICAgICAgICAgIHZhciBvbGRUeXBlTmFtZSA9IG9sZFBhdGguc3BsaXQoJy4nKS5zbGljZSgtMSlbMF07XG4gICAgICAgICAgICAgICAgb2xkUHJvcE5hbWUgPSBvbGRUeXBlTmFtZSArICdfJyArIGVudHJ5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgb2xkUHJvcE5hbWUgPSBlbnRyeTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGpzLmdldChvYmosIG9sZFByb3BOYW1lLCBmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDE0MDAsIG9sZFBhdGggKyBkZWxpbWl0ZXIgKyBlbnRyeSwgbmV3UGF0aCArICcuJyArIGVudHJ5KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZW51bURlZltlbnRyeV07XG4gICAgICAgICAgICB9LmJpbmQobnVsbCwgZW50cnkpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1hcmtBc1JlbW92ZWQgKG93bmVyQ3RvciwgcmVtb3ZlZFByb3BzLCBvd25lck5hbWUpIHtcbiAgICAgICAgaWYgKCFvd25lckN0b3IpIHtcbiAgICAgICAgICAgIC8vIOWPr+iDveiiq+ijgeWJquS6hlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIG93bmVyTmFtZSA9IG93bmVyTmFtZSB8fCBqcy5nZXRDbGFzc05hbWUob3duZXJDdG9yKTtcbiAgICAgICAgcmVtb3ZlZFByb3BzLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGVycm9yICgpIHtcbiAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDE0MDYsIG93bmVyTmFtZSwgcHJvcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBqcy5nZXRzZXQob3duZXJDdG9yLnByb3RvdHlwZSwgcHJvcCwgZXJyb3IsIGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFya0FzRGVwcmVjYXRlZCAob3duZXJDdG9yLCBkZXByZWNhdGVkUHJvcHMsIG93bmVyTmFtZSkge1xuICAgICAgICBpZiAoIW93bmVyQ3Rvcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIG93bmVyTmFtZSA9IG93bmVyTmFtZSB8fCBqcy5nZXRDbGFzc05hbWUob3duZXJDdG9yKTtcbiAgICAgICAgbGV0IGRlc2NyaXB0b3JzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMob3duZXJDdG9yLnByb3RvdHlwZSk7XG4gICAgICAgIGRlcHJlY2F0ZWRQcm9wcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICAgICAgICBsZXQgZGVwcmVjYXRlZFByb3AgPSBwcm9wWzBdO1xuICAgICAgICAgICAgbGV0IG5ld1Byb3AgPSBwcm9wWzFdO1xuICAgICAgICAgICAgbGV0IGRlc2NyaXB0b3IgPSBkZXNjcmlwdG9yc1tkZXByZWNhdGVkUHJvcF07XG4gICAgICAgICAgICBqcy5nZXRzZXQob3duZXJDdG9yLnByb3RvdHlwZSwgZGVwcmVjYXRlZFByb3AsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjYy53YXJuSUQoMTQwMCwgYCR7b3duZXJOYW1lfS4ke2RlcHJlY2F0ZWRQcm9wfWAsIGAke293bmVyTmFtZX0uJHtuZXdQcm9wfWApO1xuICAgICAgICAgICAgICAgIHJldHVybiBkZXNjcmlwdG9yLmdldC5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICBjYy53YXJuSUQoMTQwMCwgYCR7b3duZXJOYW1lfS4ke2RlcHJlY2F0ZWRQcm9wfWAsIGAke293bmVyTmFtZX0uJHtuZXdQcm9wfWApO1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0b3Iuc2V0LmNhbGwodGhpcywgdik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYXJrQXNSZW1vdmVkSW5PYmplY3QgKG93bmVyT2JqLCByZW1vdmVkUHJvcHMsIG93bmVyTmFtZSkge1xuICAgICAgICBpZiAoIW93bmVyT2JqKSB7XG4gICAgICAgICAgICAvLyDlj6/og73ooqvoo4HliarkuoZcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZW1vdmVkUHJvcHMuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gZXJyb3IgKCkge1xuICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoMTQwNiwgb3duZXJOYW1lLCBwcm9wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGpzLmdldHNldChvd25lck9iaiwgcHJvcCwgZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcm92aWRlQ2xlYXJFcnJvciAob3duZXIsIG9iaiwgb3duZXJOYW1lKSB7XG4gICAgICAgIGlmICghb3duZXIpIHtcbiAgICAgICAgICAgIC8vIOWPr+iDveiiq+ijgeWJquS6hlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjbGFzc05hbWUgPSBvd25lck5hbWUgfHwgY2MuanMuZ2V0Q2xhc3NOYW1lKG93bmVyKTtcbiAgICAgICAgdmFyIEluZm8gPSAnU29ycnksICcgKyBjbGFzc05hbWUgKyAnLiVzIGlzIHJlbW92ZWQsIHBsZWFzZSB1c2UgJXMgaW5zdGVhZC4nO1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIG9iaikge1xuICAgICAgICAgICAgZnVuY3Rpb24gZGVmaW5lIChwcm9wLCBnZXRzZXQpIHtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBhY2Nlc3NvciAobmV3UHJvcCkge1xuICAgICAgICAgICAgICAgICAgICBjYy5lcnJvcihJbmZvLCBwcm9wLCBuZXdQcm9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGdldHNldCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0c2V0ID0gZ2V0c2V0LnNwbGl0KCcsJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geC50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAganMuZ2V0c2V0KG93bmVyLCBwcm9wLCBhY2Nlc3Nvci5iaW5kKG51bGwsIGdldHNldFswXSksIGdldHNldFsxXSAmJiBhY2Nlc3Nvci5iaW5kKG51bGwsIGdldHNldFsxXSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkge31cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBnZXRzZXQgPSBvYmpbcHJvcF07XG4gICAgICAgICAgICBpZiAocHJvcFswXSA9PT0gJyonKSB7XG4gICAgICAgICAgICAgICAgLy8gZ2V0IHNldFxuICAgICAgICAgICAgICAgIHZhciBldFByb3AgPSBwcm9wLnNsaWNlKDEpO1xuICAgICAgICAgICAgICAgIGRlZmluZSgnZycgKyBldFByb3AsIGdldHNldCk7XG4gICAgICAgICAgICAgICAgZGVmaW5lKCdzJyArIGV0UHJvcCwgZ2V0c2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHByb3Auc3BsaXQoJywnKVxuICAgICAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geC50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZpbmUoeCwgZ2V0c2V0KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYXJrRnVuY3Rpb25XYXJuaW5nIChvd25lckN0b3IsIG9iaiwgb3duZXJOYW1lKSB7XG4gICAgICAgIGlmICghb3duZXJDdG9yKSB7XG4gICAgICAgICAgICAvLyDlj6/og73ooqvoo4HliarkuoZcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBvd25lck5hbWUgPSBvd25lck5hbWUgfHwganMuZ2V0Q2xhc3NOYW1lKG93bmVyQ3Rvcik7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gb2JqKSB7XG4gICAgICAgICAgICAoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgcHJvcE5hbWUgPSBwcm9wO1xuICAgICAgICAgICAgICAgIHZhciBvcmlnaW5GdW5jID0gb3duZXJDdG9yW3Byb3BOYW1lXTtcbiAgICAgICAgICAgICAgICBpZiAoIW9yaWdpbkZ1bmMpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHdhcm4gKCkge1xuICAgICAgICAgICAgICAgICAgICBjYy53YXJuKCdTb3JyeSwgJXMuJXMgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSAlcyBpbnN0ZWFkJywgb3duZXJOYW1lLCBwcm9wTmFtZSwgb2JqW3Byb3BOYW1lXSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5GdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgb3duZXJDdG9yW3Byb3BOYW1lXSA9IHdhcm47XG4gICAgICAgICAgICB9KSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIHJlbW92ZSBjYy5pbmZvXG4gICAganMuZ2V0KGNjLCAnaW5mbycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Mud2FybklEKDE0MDAsICdjYy5pbmZvJywgJ2NjLmxvZycpO1xuICAgICAgICByZXR1cm4gY2MubG9nO1xuICAgIH0pO1xuICAgIC8vIGNjLnNwcml0ZUZyYW1lQ2FjaGVcbiAgICBqcy5nZXQoY2MsIFwic3ByaXRlRnJhbWVDYWNoZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmVycm9ySUQoMTQwNCk7XG4gICAgfSk7XG5cbiAgICAvLyBjYy52bWF0aFxuICAgIGpzLmdldChjYywgJ3ZtYXRoJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy53YXJuSUQoMTQwMCwgJ2NjLnZtYXRoJywgJ2NjLm1hdGgnKTtcbiAgICAgICAgcmV0dXJuIGNjLm1hdGg7XG4gICAgfSk7XG4gICAganMuZ2V0KGNjLm1hdGgsICd2ZWMyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy53YXJuSUQoMTQwMCwgJ2NjLnZtYXRoLnZlYzInLCAnY2MuVmVjMicpO1xuICAgICAgICByZXR1cm4gY2MuVmVjMjtcbiAgICB9KVxuICAgIGpzLmdldChjYy5tYXRoLCAndmVjMycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Mud2FybklEKDE0MDAsICdjYy52bWF0aC52ZWMzJywgJ2NjLlZlYzMnKTtcbiAgICAgICAgcmV0dXJuIGNjLlZlYzM7XG4gICAgfSlcbiAgICBqcy5nZXQoY2MubWF0aCwgJ3ZlYzQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLndhcm5JRCgxNDAwLCAnY2Mudm1hdGgudmVjNCcsICdjYy5WZWM0Jyk7XG4gICAgICAgIHJldHVybiBjYy5WZWM0O1xuICAgIH0pXG4gICAganMuZ2V0KGNjLm1hdGgsICdtYXQ0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy53YXJuSUQoMTQwMCwgJ2NjLnZtYXRoLm1hdDQnLCAnY2MuTWF0NCcpO1xuICAgICAgICByZXR1cm4gY2MuTWF0NDtcbiAgICB9KVxuICAgIGpzLmdldChjYy5tYXRoLCAnbWF0MycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Mud2FybklEKDE0MDAsICdjYy52bWF0aC5tYXQzJywgJ2NjLk1hdDMnKTtcbiAgICAgICAgcmV0dXJuIGNjLk1hdDM7XG4gICAgfSlcbiAgICBqcy5nZXQoY2MubWF0aCwgJ3F1YXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLndhcm5JRCgxNDAwLCAnY2Mudm1hdGgucXVhdCcsICdjYy5RdWF0Jyk7XG4gICAgICAgIHJldHVybiBjYy5RdWF0O1xuICAgIH0pXG5cbiAgICAvLyBTcHJpdGVGcmFtZVxuICAgIGpzLmdldChjYy5TcHJpdGVGcmFtZS5wcm90b3R5cGUsICdfdGV4dHVyZUxvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MuZXJyb3JJRCgxNDAwLCAnc3ByaXRlRnJhbWUuX3RleHR1cmVMb2FkZWQnLCAnc3ByaXRlRnJhbWUudGV4dHVyZUxvYWRlZCgpJyk7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHR1cmVMb2FkZWQoKTtcbiAgICB9KTtcbiAgICBtYXJrQXNSZW1vdmVkKGNjLlNwcml0ZUZyYW1lLCBbXG4gICAgICAgICdhZGRMb2FkZWRFdmVudExpc3RlbmVyJ1xuICAgIF0pO1xuICAgIG1hcmtGdW5jdGlvbldhcm5pbmcoY2MuU3ByaXRlLnByb3RvdHlwZSwge1xuICAgICAgICBzZXRTdGF0ZTogJ2NjLlNwcml0ZS5zZXRNYXRlcmlhbCcsXG4gICAgICAgIGdldFN0YXRlOiAnY2MuU3ByaXRlLmdldE1hdGVyaWFsJ1xuICAgIH0sICdjYy5TcHJpdGUnKTtcblxuICAgIGpzLmdldChjYy5TcHJpdGVGcmFtZS5wcm90b3R5cGUsICdjbGVhclRleHR1cmUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLndhcm5JRCgxNDA2LCAnY2MuU3ByaXRlRnJhbWUnLCAnY2xlYXJUZXh0dXJlJyk7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7fTtcbiAgICB9KTtcblxuICAgIC8vIGNjLnRleHR1cmVDYWNoZVxuICAgIGpzLmdldChjYywgJ3RleHR1cmVDYWNoZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MuZXJyb3JJRCgxNDA2LCAnY2MnLCAndGV4dHVyZUNhY2hlJyk7XG4gICAgfSk7XG5cbiAgICAvLyBUZXh0dXJlXG4gICAgbGV0IFRleHR1cmUyRCA9IGNjLlRleHR1cmUyRDtcbiAgICBqcy5vYnNvbGV0ZShUZXh0dXJlMkQucHJvdG90eXBlLCAndGV4dHVyZS5yZWxlYXNlVGV4dHVyZScsICd0ZXh0dXJlLmRlc3Ryb3knKTtcblxuICAgIGpzLmdldChUZXh0dXJlMkQucHJvdG90eXBlLCAnZ2V0TmFtZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Mud2FybklEKDE0MDAsICd0ZXh0dXJlLmdldE5hbWUoKScsICd0ZXh0dXJlLl9nbElEJyk7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2xJRCB8fCBudWxsO1xuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAganMuZ2V0KFRleHR1cmUyRC5wcm90b3R5cGUsICdpc0xvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MuZXJyb3JJRCgxNDAwLCAndGV4dHVyZS5pc0xvYWRlZCBmdW5jdGlvbicsICd0ZXh0dXJlLmxvYWRlZCBwcm9wZXJ0eScpO1xuICAgICAgICByZXR1cm4gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvYWRlZDtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBqcy5nZXQoVGV4dHVyZTJELnByb3RvdHlwZSwgJ3NldEFudGlBbGlhc1RleFBhcmFtZXRlcnMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLndhcm5JRCgxNDAwLCAndGV4dHVyZS5zZXRBbnRpQWxpYXNUZXhQYXJhbWV0ZXJzKCknLCAndGV4dHVyZS5zZXRGaWx0ZXJzKGNjLlRleHR1cmUyRC5GaWx0ZXIuTElORUFSLCBjYy5UZXh0dXJlMkQuRmlsdGVyLkxJTkVBUiknKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RmlsdGVycyhUZXh0dXJlMkQuRmlsdGVyLkxJTkVBUiwgVGV4dHVyZTJELkZpbHRlci5MSU5FQVIpO1xuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAganMuZ2V0KFRleHR1cmUyRC5wcm90b3R5cGUsICdzZXRBbGlhc1RleFBhcmFtZXRlcnMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLndhcm5JRCgxNDAwLCAndGV4dHVyZS5zZXRBbnRpQWxpYXNUZXhQYXJhbWV0ZXJzKCknLCAndGV4dHVyZS5zZXRGaWx0ZXJzKGNjLlRleHR1cmUyRC5GaWx0ZXIuTkVBUkVTVCwgY2MuVGV4dHVyZTJELkZpbHRlci5ORUFSRVNUKScpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5zZXRGaWx0ZXJzKFRleHR1cmUyRC5GaWx0ZXIuTkVBUkVTVCwgVGV4dHVyZTJELkZpbHRlci5ORUFSRVNUKTtcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIC8vIGNjLm1hY3JvXG4gICAgbWFya0FzUmVtb3ZlZEluT2JqZWN0KGNjLm1hY3JvLCBbXG4gICAgICAgICdFTkFCTEVfR0xfU1RBVEVfQ0FDSEUnLFxuICAgICAgICAnRklYX0FSVElGQUNUU19CWV9TVFJFQ0hJTkdfVEVYRUwnLFxuICAgIF0sICdjYy5tYWNybycpO1xuXG4gICAgcHJvdmlkZUNsZWFyRXJyb3IoY2MubWFjcm8sIHtcbiAgICAgICAgUEk6ICdNYXRoLlBJJyxcbiAgICAgICAgUEkyOiAnTWF0aC5QSSoyJyxcbiAgICAgICAgRkxUX01BWDogJ051bWJlci5NQVhfVkFMVUUnLFxuICAgICAgICBGTFRfTUlOOiAnTnVtYmVyLk1JTl9WQUxVRScsXG4gICAgICAgIFVJTlRfTUFYOiAnTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVInXG4gICAgfSwgJ2NjLm1hY3JvJyk7XG5cbiAgICAvLyBjYy5nYW1lXG4gICAgbWFya0FzUmVtb3ZlZEluT2JqZWN0KGNjLmdhbWUsIFtcbiAgICAgICAgJ0NPTkZJR19LRVknLFxuICAgIF0sICdjYy5nYW1lJyk7XG5cbiAgICAvLyBjYy5zeXNcbiAgICBtYXJrQXNSZW1vdmVkSW5PYmplY3QoY2Muc3lzLCBbXG4gICAgICAgICdkdW1wUm9vdCcsXG4gICAgICAgICdjbGVhblNjcmlwdCcsXG4gICAgXSwgJ2NjLnN5cycpO1xuXG4gICAgLy8gY2MuRGlyZWN0b3JcbiAgICBwcm92aWRlQ2xlYXJFcnJvcihjYy5EaXJlY3Rvciwge1xuICAgICAgICBFVkVOVF9QUk9KRUNUSU9OX0NIQU5HRUQ6ICcnLFxuICAgICAgICBFVkVOVF9CRUZPUkVfVklTSVQ6ICdFVkVOVF9BRlRFUl9VUERBVEUnLFxuICAgICAgICBFVkVOVF9BRlRFUl9WSVNJVDogJ0VWRU5UX0JFRk9SRV9EUkFXJyxcbiAgICB9LCAnY2MuRGlyZWN0b3InKTtcbiAgICBtYXJrRnVuY3Rpb25XYXJuaW5nKGNjLkRpcmVjdG9yLnByb3RvdHlwZSwge1xuICAgICAgICBjb252ZXJ0VG9HTDogJ2NjLnZpZXcuY29udmVydFRvTG9jYXRpb25JblZpZXcnLFxuICAgICAgICBjb252ZXJ0VG9VSTogJycsXG4gICAgICAgIGdldFdpblNpemU6ICdjYy53aW5TaXplJyxcbiAgICAgICAgZ2V0V2luU2l6ZUluUGl4ZWxzOiAnY2Mud2luU2l6ZScsXG4gICAgICAgIGdldFZpc2libGVTaXplOiAnY2Mudmlldy5nZXRWaXNpYmxlU2l6ZScsXG4gICAgICAgIGdldFZpc2libGVPcmlnaW46ICdjYy52aWV3LmdldFZpc2libGVPcmlnaW4nLFxuICAgICAgICBwdXJnZUNhY2hlZERhdGE6ICdjYy5sb2FkZXIucmVsZWFzZUFsbCcsXG4gICAgICAgIHNldERlcHRoVGVzdDogJ2NjLkNhbWVyYS5tYWluLmRlcHRoJyxcbiAgICAgICAgc2V0Q2xlYXJDb2xvcjogJ2NjLkNhbWVyYS5tYWluLmJhY2tncm91bmRDb2xvcicsXG4gICAgICAgIGdldFJ1bm5pbmdTY2VuZTogJ2NjLmRpcmVjdG9yLmdldFNjZW5lJyxcbiAgICAgICAgZ2V0QW5pbWF0aW9uSW50ZXJ2YWw6ICdjYy5nYW1lLmdldEZyYW1lUmF0ZScsXG4gICAgICAgIHNldEFuaW1hdGlvbkludGVydmFsOiAnY2MuZ2FtZS5zZXRGcmFtZVJhdGUnLFxuICAgICAgICBpc0Rpc3BsYXlTdGF0czogJ2NjLmRlYnVnLmlzRGlzcGxheVN0YXRzJyxcbiAgICAgICAgc2V0RGlzcGxheVN0YXRzOiAnY2MuZGVidWcuc2V0RGlzcGxheVN0YXRzJyxcbiAgICAgICAgc3RvcEFuaW1hdGlvbjogJ2NjLmdhbWUucGF1c2UnLFxuICAgICAgICBzdGFydEFuaW1hdGlvbjogJ2NjLmdhbWUucmVzdW1lJyxcbiAgICB9LCAnY2MuRGlyZWN0b3InKTtcbiAgICBtYXJrQXNSZW1vdmVkKGNjLkRpcmVjdG9yLCBbXG4gICAgICAgICdwdXNoU2NlbmUnLFxuICAgICAgICAncG9wU2NlbmUnLFxuICAgICAgICAncG9wVG9Sb290U2NlbmUnLFxuICAgICAgICAncG9wVG9TY2VuZVN0YWNrTGV2ZWwnLFxuICAgICAgICAnc2V0UHJvamVjdGlvbicsXG4gICAgICAgICdnZXRQcm9qZWN0aW9uJyxcbiAgICBdLCAnY2MuRGlyZWN0b3InKTtcblxuICAgIC8vIFNjaGVkdWxlclxuICAgIHByb3ZpZGVDbGVhckVycm9yKGNjLlNjaGVkdWxlciwge1xuICAgICAgICBzY2hlZHVsZUNhbGxiYWNrRm9yVGFyZ2V0OiAnc2NoZWR1bGUnLFxuICAgICAgICBzY2hlZHVsZVVwZGF0ZUZvclRhcmdldDogJ3NjaGVkdWxlVXBkYXRlJyxcbiAgICAgICAgdW5zY2hlZHVsZUNhbGxiYWNrRm9yVGFyZ2V0OiAndW5zY2hlZHVsZScsXG4gICAgICAgIHVuc2NoZWR1bGVVcGRhdGVGb3JUYXJnZXQ6ICd1bnNjaGVkdWxlVXBkYXRlJyxcbiAgICAgICAgdW5zY2hlZHVsZUFsbENhbGxiYWNrc0ZvclRhcmdldDogJ3Vuc2NoZWR1bGVBbGxGb3JUYXJnZXQnLFxuICAgICAgICB1bnNjaGVkdWxlQWxsQ2FsbGJhY2tzOiAndW5zY2hlZHVsZUFsbCcsXG4gICAgICAgIHVuc2NoZWR1bGVBbGxDYWxsYmFja3NXaXRoTWluUHJpb3JpdHk6ICd1bnNjaGVkdWxlQWxsV2l0aE1pblByaW9yaXR5J1xuICAgIH0sICdjYy5TY2hlZHVsZXInKTtcblxuICAgIC8vIGNjLnZpZXdcbiAgICBwcm92aWRlQ2xlYXJFcnJvcihjYy52aWV3LCB7XG4gICAgICAgIGFkanVzdFZpZXdQb3J0OiAnYWRqdXN0Vmlld3BvcnRNZXRhJyxcbiAgICAgICAgc2V0Vmlld1BvcnRJblBvaW50czogJ3NldFZpZXdwb3J0SW5Qb2ludHMnLFxuICAgICAgICBnZXRWaWV3UG9ydFJlY3Q6ICdnZXRWaWV3cG9ydFJlY3QnXG4gICAgfSwgJ2NjLnZpZXcnKTtcbiAgICBtYXJrQXNSZW1vdmVkSW5PYmplY3QoY2MudmlldywgW1xuICAgICAgICAnaXNWaWV3UmVhZHknLFxuICAgICAgICAnc2V0VGFyZ2V0RGVuc2l0eURQSScsXG4gICAgICAgICdnZXRUYXJnZXREZW5zaXR5RFBJJyxcbiAgICAgICAgJ3NldEZyYW1lWm9vbUZhY3RvcicsXG4gICAgICAgICdjYW5TZXRDb250ZW50U2NhbGVGYWN0b3InLFxuICAgICAgICAnc2V0Q29udGVudFRyYW5zbGF0ZUxlZnRUb3AnLFxuICAgICAgICAnZ2V0Q29udGVudFRyYW5zbGF0ZUxlZnRUb3AnLFxuICAgICAgICAnc2V0Vmlld05hbWUnLFxuICAgICAgICAnZ2V0Vmlld05hbWUnXG4gICAgXSwgJ2NjLnZpZXcnKTtcblxuICAgIC8vIExvYWRlclxuICAgIG1hcmtBc1JlbW92ZWQoY2MuUGlwZWxpbmUsIFtcbiAgICAgICAgJ2Zsb3dJbkRlcHMnLFxuICAgICAgICAnZ2V0SXRlbXMnXG4gICAgXSwgJ2NjLmxvYWRlcicpO1xuXG4gICAgLy8gY2MuUGh5c2ljc01hbmFnZXJcbiAgICBtYXJrQXNSZW1vdmVkKGNjLlBoeXNpY3NNYW5hZ2VyLCBbXG4gICAgICAgICdhdHRhY2hEZWJ1Z0RyYXdUb0NhbWVyYScsXG4gICAgICAgICdkZXRhY2hEZWJ1Z0RyYXdGcm9tQ2FtZXJhJyxcbiAgICBdKTtcblxuICAgIC8vIGNjLkNvbGxpc2lvbk1hbmFnZXJcbiAgICBtYXJrQXNSZW1vdmVkKGNjLkNvbGxpc2lvbk1hbmFnZXIsIFtcbiAgICAgICAgJ2F0dGFjaERlYnVnRHJhd1RvQ2FtZXJhJyxcbiAgICAgICAgJ2RldGFjaERlYnVnRHJhd0Zyb21DYW1lcmEnLFxuICAgIF0pO1xuXG4gICAgLy8gY2MuTm9kZVxuICAgIHByb3ZpZGVDbGVhckVycm9yKGNjLl9CYXNlTm9kZS5wcm90b3R5cGUsIHtcbiAgICAgICAgJ3RhZyc6ICduYW1lJyxcbiAgICAgICAgJ2dldFRhZyc6ICduYW1lJyxcbiAgICAgICAgJ3NldFRhZyc6ICduYW1lJyxcbiAgICAgICAgJ2dldENoaWxkQnlUYWcnOiAnZ2V0Q2hpbGRCeU5hbWUnLFxuICAgICAgICAncmVtb3ZlQ2hpbGRCeVRhZyc6ICdnZXRDaGlsZEJ5TmFtZShuYW1lKS5kZXN0cm95KCknXG4gICAgfSk7XG5cbiAgICBtYXJrQXNSZW1vdmVkKGNjLk5vZGUsIFtcbiAgICAgICAgJ19jYXNjYWRlQ29sb3JFbmFibGVkJyxcbiAgICAgICAgJ2Nhc2NhZGVDb2xvcicsXG4gICAgICAgICdpc0Nhc2NhZGVDb2xvckVuYWJsZWQnLFxuICAgICAgICAnc2V0Q2FzY2FkZUNvbG9yRW5hYmxlZCcsXG4gICAgICAgICdfY2FzY2FkZU9wYWNpdHlFbmFibGVkJyxcbiAgICAgICAgJ2Nhc2NhZGVPcGFjaXR5JyxcbiAgICAgICAgJ2lzQ2FzY2FkZU9wYWNpdHlFbmFibGVkJyxcbiAgICAgICAgJ3NldENhc2NhZGVPcGFjaXR5RW5hYmxlZCcsXG4gICAgICAgICdvcGFjaXR5TW9kaWZ5UkdCJyxcbiAgICAgICAgJ2lzT3BhY2l0eU1vZGlmeVJHQicsXG4gICAgICAgICdzZXRPcGFjaXR5TW9kaWZ5UkdCJyxcbiAgICAgICAgJ2lnbm9yZUFuY2hvcicsXG4gICAgICAgICdpc0lnbm9yZUFuY2hvclBvaW50Rm9yUG9zaXRpb24nLFxuICAgICAgICAnaWdub3JlQW5jaG9yUG9pbnRGb3JQb3NpdGlvbicsXG4gICAgICAgICdpc1J1bm5pbmcnLFxuICAgICAgICAnX3NnTm9kZScsXG4gICAgXSk7XG5cbiAgICBtYXJrRnVuY3Rpb25XYXJuaW5nKGNjLk5vZGUucHJvdG90eXBlLCB7XG4gICAgICAgIGdldE5vZGVUb1BhcmVudFRyYW5zZm9ybTogJ2dldExvY2FsTWF0cml4JyxcbiAgICAgICAgZ2V0Tm9kZVRvUGFyZW50VHJhbnNmb3JtQVI6ICdnZXRMb2NhbE1hdHJpeCcsXG4gICAgICAgIGdldE5vZGVUb1dvcmxkVHJhbnNmb3JtOiAnZ2V0V29ybGRNYXRyaXgnLFxuICAgICAgICBnZXROb2RlVG9Xb3JsZFRyYW5zZm9ybUFSOiAnZ2V0V29ybGRNYXRyaXgnLFxuICAgICAgICBnZXRQYXJlbnRUb05vZGVUcmFuc2Zvcm06ICdnZXRMb2NhbE1hdHJpeCcsXG4gICAgICAgIGdldFdvcmxkVG9Ob2RlVHJhbnNmb3JtOiAnZ2V0V29ybGRNYXRyaXgnLFxuICAgICAgICBjb252ZXJ0VG91Y2hUb05vZGVTcGFjZTogJ2NvbnZlcnRUb05vZGVTcGFjZUFSJyxcbiAgICAgICAgY29udmVydFRvdWNoVG9Ob2RlU3BhY2VBUjogJ2NvbnZlcnRUb05vZGVTcGFjZUFSJyxcbiAgICAgICAgY29udmVydFRvV29ybGRTcGFjZTogJ2NvbnZlcnRUb1dvcmxkU3BhY2VBUicsXG4gICAgICAgIGNvbnZlcnRUb05vZGVTcGFjZTogJ2NvbnZlcnRUb05vZGVTcGFjZUFSJ1xuICAgIH0pO1xuXG4gICAgcHJvdmlkZUNsZWFyRXJyb3IoY2MuTm9kZS5wcm90b3R5cGUsIHtcbiAgICAgICAgZ2V0Um90YXRpb25YOiAncm90YXRpb25YJyxcbiAgICAgICAgc2V0Um90YXRpb25YOiAncm90YXRpb25YJyxcbiAgICAgICAgZ2V0Um90YXRpb25ZOiAncm90YXRpb25ZJyxcbiAgICAgICAgc2V0Um90YXRpb25ZOiAncm90YXRpb25ZJyxcbiAgICAgICAgZ2V0UG9zaXRpb25YOiAneCcsXG4gICAgICAgIHNldFBvc2l0aW9uWDogJ3gnLFxuICAgICAgICBnZXRQb3NpdGlvblk6ICd5JyxcbiAgICAgICAgc2V0UG9zaXRpb25ZOiAneScsXG4gICAgICAgIGdldFNrZXdYOiAnc2tld1gnLFxuICAgICAgICBzZXRTa2V3WDogJ3NrZXdYJyxcbiAgICAgICAgZ2V0U2tld1k6ICdza2V3WScsXG4gICAgICAgIHNldFNrZXdZOiAnc2tld1knLFxuICAgICAgICBnZXRTY2FsZVg6ICdzY2FsZVgnLFxuICAgICAgICBzZXRTY2FsZVg6ICdzY2FsZVgnLFxuICAgICAgICBnZXRTY2FsZVk6ICdzY2FsZVknLFxuICAgICAgICBzZXRTY2FsZVk6ICdzY2FsZVknLFxuICAgICAgICBnZXRPcGFjaXR5OiAnb3BhY2l0eScsXG4gICAgICAgIHNldE9wYWNpdHk6ICdvcGFjaXR5JyxcbiAgICAgICAgZ2V0Q29sb3I6ICdjb2xvcicsXG4gICAgICAgIHNldENvbG9yOiAnY29sb3InLFxuICAgICAgICBnZXRMb2NhbFpPcmRlcjogJ3pJbmRleCcsXG4gICAgICAgIHNldExvY2FsWk9yZGVyOiAnekluZGV4JyxcbiAgICB9KTtcblxuICAgIC8vIGNjLkNvbXBvbmVudFxuICAgIG1hcmtBc1JlbW92ZWQoY2MuQ29tcG9uZW50LCBbXG4gICAgICAgICdpc1J1bm5pbmcnLFxuICAgIF0pO1xuXG4gICAgcHJvdmlkZUNsZWFyRXJyb3IoY2MuU3ByaXRlLnByb3RvdHlwZSwge1xuICAgICAgICBzZXRJbnNldExlZnQ6ICdjYy5TcHJpdGVGcmFtZSBpbnNldExlZnQnLFxuICAgICAgICBzZXRJbnNldFJpZ2h0OiAnY2MuU3ByaXRlRnJhbWUgaW5zZXRSaWdodCcsXG4gICAgICAgIHNldEluc2V0VG9wOiAnY2MuU3ByaXRlRnJhbWUgaW5zZXRUb3AnLFxuICAgICAgICBzZXRJbnNldEJvdHRvbTogJ2NjLlNwcml0ZUZyYW1lIGluc2V0Qm90dG9tJyxcbiAgICB9KTtcblxuICAgIC8vIGNjLk1hdGVyaWFsXG4gICAgY2MuTWF0ZXJpYWwuZ2V0SW5zdGFudGlhdGVkQnVpbHRpbk1hdGVyaWFsID0gY2MuTWF0ZXJpYWxWYXJpYW50LmNyZWF0ZVdpdGhCdWlsdGluO1xuICAgIGNjLk1hdGVyaWFsLmdldEluc3RhbnRpYXRlZE1hdGVyaWFsID0gY2MuTWF0ZXJpYWxWYXJpYW50LmNyZWF0ZTtcbiAgICBtYXJrRnVuY3Rpb25XYXJuaW5nKGNjLk1hdGVyaWFsLCB7XG4gICAgICAgIGdldEluc3RhbnRpYXRlZEJ1aWx0aW5NYXRlcmlhbDogJ2NjLk1hdGVyaWFsVmFyaWFudC5jcmVhdGVXaXRoQnVpbHRpbicsXG4gICAgICAgIGdldEluc3RhbnRpYXRlZE1hdGVyaWFsOiAnY2MuTWF0ZXJpYWxWYXJpYW50LmNyZWF0ZSdcbiAgICB9KVxuXG4gICAgLy8gY2MuUmVuZGVyQ29tcG9uZW50XG4gICAgY2MuanMuZ2V0c2V0KGNjLlJlbmRlckNvbXBvbmVudC5wcm90b3R5cGUsICdzaGFyZWRNYXRlcmlhbHMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLndhcm5JRCgxNDAwLCAnc2hhcmVkTWF0ZXJpYWxzJywgJ2dldE1hdGVyaWFscycpO1xuICAgICAgICByZXR1cm4gdGhpcy5tYXRlcmlhbHM7XG4gICAgfSwgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgY2Mud2FybklEKDE0MDAsICdzaGFyZWRNYXRlcmlhbHMnLCAnc2V0TWF0ZXJpYWwnKTtcbiAgICAgICAgdGhpcy5tYXRlcmlhbHMgPSB2O1xuICAgIH0pXG5cbiAgICAvLyBjYy5DYW1lcmFcbiAgICBtYXJrRnVuY3Rpb25XYXJuaW5nKGNjLkNhbWVyYS5wcm90b3R5cGUsIHtcbiAgICAgICAgZ2V0Tm9kZVRvQ2FtZXJhVHJhbnNmb3JtOiAnZ2V0V29ybGRUb1NjcmVlbk1hdHJpeDJEJyxcbiAgICAgICAgZ2V0Q2FtZXJhVG9Xb3JsZFBvaW50OiAnZ2V0U2NyZWVuVG9Xb3JsZFBvaW50JyxcbiAgICAgICAgZ2V0V29ybGRUb0NhbWVyYVBvaW50OiAnZ2V0V29ybGRUb1NjcmVlblBvaW50JyxcbiAgICAgICAgZ2V0Q2FtZXJhVG9Xb3JsZE1hdHJpeDogJ2dldFNjcmVlblRvV29ybGRNYXRyaXgyRCcsXG4gICAgICAgIGdldFdvcmxkVG9DYW1lcmFNYXRyaXg6ICdnZXRXb3JsZFRvU2NyZWVuTWF0cml4MkQnXG4gICAgfSk7XG5cbiAgICBtYXJrQXNSZW1vdmVkKGNjLkNhbWVyYSwgW1xuICAgICAgICAnYWRkVGFyZ2V0JyxcbiAgICAgICAgJ3JlbW92ZVRhcmdldCcsXG4gICAgICAgICdnZXRUYXJnZXRzJ1xuICAgIF0pO1xuXG4gICAgLy8gU0NFTkVcbiAgICB2YXIgRVJSID0gJ1wiJXNcIiBpcyBub3QgZGVmaW5lZCBpbiB0aGUgU2NlbmUsIGl0IGlzIG9ubHkgZGVmaW5lZCBpbiBub3JtYWwgbm9kZXMuJztcbiAgICBDQ19FRElUT1IgfHwgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoY2MuU2NlbmUucHJvdG90eXBlLCB7XG4gICAgICAgIGFjdGl2ZToge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY2MuZXJyb3IoRVJSLCAnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY2MuZXJyb3IoRVJSLCAnYWN0aXZlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGFjdGl2ZUluSGllcmFyY2h5OiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjYy5lcnJvcihFUlIsICdhY3RpdmVJbkhpZXJhcmNoeScpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0Q29tcG9uZW50OiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjYy5lcnJvcihFUlIsICdnZXRDb21wb25lbnQnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBhZGRDb21wb25lbnQ6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNjLmVycm9yKEVSUiwgJ2FkZENvbXBvbmVudCcpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBjYy5keW5hbWljQXRsYXNNYW5hZ2VyXG4gICAgbWFya0FzUmVtb3ZlZEluT2JqZWN0KGNjLmR5bmFtaWNBdGxhc01hbmFnZXIsIFtcbiAgICAgICAgJ21pbkZyYW1lU2l6ZSdcbiAgICBdLCAnY2MuZHluYW1pY0F0bGFzTWFuYWdlcicpXG5cbiAgICAvLyBWYWx1ZSB0eXBlc1xuICAgIHByb3ZpZGVDbGVhckVycm9yKGNjLCB7XG4gICAgICAgIC8vIEFmZmluZVRyYW5zZm9ybVxuICAgICAgICBhZmZpbmVUcmFuc2Zvcm1NYWtlOiAnY2MuQWZmaW5lVHJhbnNmb3JtLmNyZWF0ZScsXG4gICAgICAgIGFmZmluZVRyYW5zZm9ybU1ha2VJZGVudGl0eTogJ2NjLkFmZmluZVRyYW5zZm9ybS5pZGVudGl0eScsXG4gICAgICAgIGFmZmluZVRyYW5zZm9ybUNsb25lOiAnY2MuQWZmaW5lVHJhbnNmb3JtLmNsb25lJyxcbiAgICAgICAgYWZmaW5lVHJhbnNmb3JtQ29uY2F0OiAnY2MuQWZmaW5lVHJhbnNmb3JtLmNvbmNhdCcsXG4gICAgICAgIGFmZmluZVRyYW5zZm9ybUNvbmNhdEluOiAnY2MuQWZmaW5lVHJhbnNmb3JtLmNvbmNhdCcsXG4gICAgICAgIGFmZmluZVRyYW5zZm9ybUludmVydDogJ2NjLkFmZmluZVRyYW5zZm9ybS5pbnZlcnQnLFxuICAgICAgICBhZmZpbmVUcmFuc2Zvcm1JbnZlcnRJbjogJ2NjLkFmZmluZVRyYW5zZm9ybS5pbnZlcnQnLFxuICAgICAgICBhZmZpbmVUcmFuc2Zvcm1JbnZlcnRPdXQ6ICdjYy5BZmZpbmVUcmFuc2Zvcm0uaW52ZXJ0JyxcbiAgICAgICAgYWZmaW5lVHJhbnNmb3JtRXF1YWxUb1RyYW5zZm9ybTogJ2NjLkFmZmluZVRyYW5zZm9ybS5lcXVhbCcsXG4gICAgICAgIHBvaW50QXBwbHlBZmZpbmVUcmFuc2Zvcm06ICdjYy5BZmZpbmVUcmFuc2Zvcm0udHJhbnNmb3JtVmVjMicsXG4gICAgICAgIHNpemVBcHBseUFmZmluZVRyYW5zZm9ybTogJ2NjLkFmZmluZVRyYW5zZm9ybS50cmFuc2Zvcm1TaXplJyxcbiAgICAgICAgcmVjdEFwcGx5QWZmaW5lVHJhbnNmb3JtOiAnY2MuQWZmaW5lVHJhbnNmb3JtLnRyYW5zZm9ybVJlY3QnLFxuICAgICAgICBvYmJBcHBseUFmZmluZVRyYW5zZm9ybTogJ2NjLkFmZmluZVRyYW5zZm9ybS50cmFuc2Zvcm1PYmInLFxuXG4gICAgICAgIC8vIFZlYzJcbiAgICAgICAgcG9pbnRFcXVhbFRvUG9pbnQ6ICdjYy5WZWMyIGVxdWFscycsXG5cbiAgICAgICAgLy8gU2l6ZVxuICAgICAgICBzaXplRXF1YWxUb1NpemU6ICdjYy5TaXplIGVxdWFscycsXG5cbiAgICAgICAgLy8gUmVjdFxuICAgICAgICByZWN0RXF1YWxUb1JlY3Q6ICdyZWN0QS5lcXVhbHMocmVjdEIpJyxcbiAgICAgICAgcmVjdENvbnRhaW5zUmVjdDogJ3JlY3RBLmNvbnRhaW5zUmVjdChyZWN0QiknLFxuICAgICAgICByZWN0Q29udGFpbnNQb2ludDogJ3JlY3QuY29udGFpbnModmVjMiknLFxuICAgICAgICByZWN0T3ZlcmxhcHNSZWN0OiAncmVjdEEuaW50ZXJzZWN0cyhyZWN0QiknLFxuICAgICAgICByZWN0SW50ZXJzZWN0c1JlY3Q6ICdyZWN0QS5pbnRlcnNlY3RzKHJlY3RCKScsXG4gICAgICAgIHJlY3RJbnRlcnNlY3Rpb246ICdyZWN0QS5pbnRlcnNlY3Rpb24oaW50ZXJzZWN0aW9uLCByZWN0QiknLFxuICAgICAgICByZWN0VW5pb246ICdyZWN0QS51bmlvbih1bmlvbiwgcmVjdEIpJyxcbiAgICAgICAgcmVjdEdldE1heFg6ICdyZWN0LnhNYXgnLFxuICAgICAgICByZWN0R2V0TWlkWDogJ3JlY3QuY2VudGVyLngnLFxuICAgICAgICByZWN0R2V0TWluWDogJ3JlY3QueE1pbicsXG4gICAgICAgIHJlY3RHZXRNYXhZOiAncmVjdC55TWF4JyxcbiAgICAgICAgcmVjdEdldE1pZFk6ICdyZWN0LmNlbnRlci55JyxcbiAgICAgICAgcmVjdEdldE1pblk6ICdyZWN0LnlNaW4nLFxuXG4gICAgICAgIC8vIENvbG9yXG4gICAgICAgIGNvbG9yRXF1YWw6ICdjb2xvckEuZXF1YWxzKGNvbG9yQiknLFxuICAgICAgICBoZXhUb0NvbG9yOiAnY29sb3IuZnJvbUhFWChoZXhDb2xvciknLFxuICAgICAgICBjb2xvclRvSGV4OiAnY29sb3IudG9IRVgoKScsXG5cbiAgICAgICAgLy8gRW51bXNcbiAgICAgICAgVGV4dEFsaWdubWVudDogJ2NjLm1hY3JvLlRleHRBbGlnbm1lbnQnLFxuICAgICAgICBWZXJ0aWNhbFRleHRBbGlnbm1lbnQ6ICdjYy5tYWNyby5WZXJ0aWNhbFRleHRBbGlnbm1lbnQnLFxuXG4gICAgICAgIC8vIFBvaW50IEV4dGVuc2lvbnNcbiAgICAgICAgcE5lZzogJ3AubmVnKCknLFxuICAgICAgICBwQWRkOiAncDEuYWRkKHAyKScsXG4gICAgICAgIHBTdWI6ICdwMS5zdWIocDIpJyxcbiAgICAgICAgcE11bHQ6ICdwLm11bChmYWN0b3IpJyxcbiAgICAgICAgcE1pZHBvaW50OiAncDEuYWRkKHAyKS5tdWwoMC41KScsXG4gICAgICAgIHBEb3Q6ICdwMS5kb3QocDIpJyxcbiAgICAgICAgcENyb3NzOiAncDEuY3Jvc3MocDIpJyxcbiAgICAgICAgcFBlcnA6ICdwLnJvdGF0ZSgtOTAgKiBNYXRoLlBJIC8gMTgwKScsXG4gICAgICAgIHBSUGVycDogJ3Aucm90YXRlKDkwICogTWF0aC5QSSAvIDE4MCknLFxuICAgICAgICBwUHJvamVjdDogJ3AxLnByb2plY3QocDIpJyxcbiAgICAgICAgcExlbmd0aFNROiAncC5tYWdTcXIoKScsXG4gICAgICAgIHBEaXN0YW5jZVNROiAncDEuc3ViKHAyKS5tYWdTcXIoKScsXG4gICAgICAgIHBMZW5ndGg6ICdwLm1hZygpJyxcbiAgICAgICAgcERpc3RhbmNlOiAncDEuc3ViKHAyKS5tYWcoKScsXG4gICAgICAgIHBOb3JtYWxpemU6ICdwLm5vcm1hbGl6ZSgpJyxcbiAgICAgICAgcEZvckFuZ2xlOiAnY2MudjIoTWF0aC5jb3MoYSksIE1hdGguc2luKGEpKScsXG4gICAgICAgIHBUb0FuZ2xlOiAnTWF0aC5hdGFuMih2LnksIHYueCknLFxuICAgICAgICBwWmVyb0luOiAncC54ID0gcC55ID0gMCcsXG4gICAgICAgIHBJbjogJ3AxLnNldChwMiknLFxuICAgICAgICBwTXVsdEluOiAncC5tdWxTZWxmKGZhY3RvciknLFxuICAgICAgICBwU3ViSW46ICdwMS5zdWJTZWxmKHAyKScsXG4gICAgICAgIHBBZGRJbjogJ3AxLmFkZFNlbGYocDIpJyxcbiAgICAgICAgcE5vcm1hbGl6ZUluOiAncC5ub3JtYWxpemVTZWxmKCknLFxuICAgICAgICBwU2FtZUFzOiAncDEuZXF1YWxzKHAyKScsXG4gICAgICAgIHBBbmdsZTogJ3YxLmFuZ2xlKHYyKScsXG4gICAgICAgIHBBbmdsZVNpZ25lZDogJ3YxLnNpZ25BbmdsZSh2MiknLFxuICAgICAgICBwUm90YXRlQnlBbmdsZTogJ3Aucm90YXRlKHJhZGlhbnMpJyxcbiAgICAgICAgcENvbXBNdWx0OiAndjEuZG90KHYyKScsXG4gICAgICAgIHBGdXp6eUVxdWFsOiAndjEuZnV6enlFcXVhbHModjIsIHRvbGVyYW5jZSknLFxuICAgICAgICBwTGVycDogJ3AubGVycChlbmRQb2ludCwgcmF0aW8pJyxcbiAgICAgICAgcENsYW1wOiAncC5jbGFtcGYobWluX2luY2x1c2l2ZSwgbWF4X2luY2x1c2l2ZSknLFxuXG4gICAgICAgIHJhbmQ6ICdNYXRoLnJhbmRvbSgpICogMHhmZmZmZmYnLFxuICAgICAgICByYW5kb21NaW51czFUbzE6ICcoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAyJyxcblxuICAgICAgICBjb250YWluZXI6ICdjYy5nYW1lLmNvbnRhaW5lcicsXG4gICAgICAgIF9jYW52YXM6ICdjYy5nYW1lLmNhbnZhcycsXG4gICAgICAgIF9yZW5kZXJUeXBlOiAnY2MuZ2FtZS5yZW5kZXJUeXBlJyxcblxuICAgICAgICBfZ2V0RXJyb3I6ICdjYy5kZWJ1Zy5nZXRFcnJvcicsXG4gICAgICAgIF9pbml0RGVidWdTZXR0aW5nOiAnY2MuZGVidWcuX3Jlc2V0RGVidWdTZXR0aW5nJyxcbiAgICAgICAgRGVidWdNb2RlOiAnY2MuZGVidWcuRGVidWdNb2RlJyxcbiAgICB9LCAnY2MnKTtcbiAgICBtYXJrQXNSZW1vdmVkSW5PYmplY3QoY2MsIFtcbiAgICAgICAgJ2JsZW5kRnVuY0Rpc2FibGUnLFxuXG4gICAgICAgICdwRnJvbVNpemUnLFxuICAgICAgICAncENvbXBPcCcsXG4gICAgICAgICdwSW50ZXJzZWN0UG9pbnQnLFxuICAgICAgICAncFNlZ21lbnRJbnRlcnNlY3QnLFxuICAgICAgICAncExpbmVJbnRlcnNlY3QnLFxuXG4gICAgICAgICdvYmJBcHBseU1hdHJpeCcsXG5cbiAgICAgICAgJ2dldEltYWdlRm9ybWF0QnlEYXRhJyxcblxuICAgICAgICAnaW5pdEVuZ2luZScsXG4gICAgXSwgJ2NjJyk7XG4gICAgbWFya0Z1bmN0aW9uV2FybmluZyhjYywge1xuICAgICAgICAvLyBjYy5wXG4gICAgICAgIHA6ICdjYy52MidcbiAgICB9LCAnY2MnKTtcbiAgICAvLyBjYy5SZWN0XG4gICAgcHJvdmlkZUNsZWFyRXJyb3IoY2MuUmVjdCwge1xuICAgICAgICBjb250YWluOiAncmVjdEEuY29udGFpbnMocmVjdEIpJyxcbiAgICAgICAgdHJhbnNmb3JtTWF0NDogJ3JlY3QudHJhbnNmb3JtTWF0NChvdXQsIG1hdDQpJ1xuICAgIH0pO1xuICAgIC8vIGNjLkNvbG9yXG4gICAgcHJvdmlkZUNsZWFyRXJyb3IoY2MuQ29sb3IsIHtcbiAgICAgICAgcmdiMmhzdjogJ2NvbG9yLnRvSFNWKCknLFxuICAgICAgICBoc3YycmdiOiAnY29sb3IuZnJvbUhTVihoLCBzLCB2KSdcbiAgICB9KTtcblxuICAgIC8vIG1hY3JvIGZ1bmN0aW9uc1xuICAgIGpzLmdldChjYywgJ2xlcnAnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLndhcm5JRCgxNDAwLCAnY2MubGVycCcsICdjYy5taXNjLmxlcnAnKTtcbiAgICAgICAgcmV0dXJuIGNjLm1pc2MubGVycDtcbiAgICB9KTtcbiAgICBqcy5nZXQoY2MsICdyYW5kb20wVG8xJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy53YXJuSUQoMTQwMCwgJ2NjLnJhbmRvbTBUbzEnLCAnTWF0aC5yYW5kb20nKTtcbiAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tO1xuICAgIH0pO1xuICAgIGpzLmdldChjYywgJ2RlZ3JlZXNUb1JhZGlhbnMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLndhcm5JRCgxNDAwLCAnY2MuZGVncmVlc1RvUmFkaWFucycsICdjYy5taXNjLmRlZ3JlZXNUb1JhZGlhbnMnKTtcbiAgICAgICAgcmV0dXJuIGNjLm1pc2MuZGVncmVlc1RvUmFkaWFucztcbiAgICB9KTtcbiAgICBqcy5nZXQoY2MsICdyYWRpYW5zVG9EZWdyZWVzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy53YXJuSUQoMTQwMCwgJ2NjLnJhZGlhbnNUb0RlZ3JlZXMnLCAnY2MubWlzYy5yYWRpYW5zVG9EZWdyZWVzJyk7XG4gICAgICAgIHJldHVybiBjYy5taXNjLnJhZGlhbnNUb0RlZ3JlZXM7XG4gICAgfSk7XG4gICAganMuZ2V0KGNjLCAnY2xhbXBmJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy53YXJuSUQoMTQwMCwgJ2NjLmNsYW1wZicsICdjYy5taXNjLmNsYW1wZicpO1xuICAgICAgICByZXR1cm4gY2MubWlzYy5jbGFtcGY7XG4gICAgfSk7XG4gICAganMuZ2V0KGNjLCAnY2xhbXAwMScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Mud2FybklEKDE0MDAsICdjYy5jbGFtcDAxJywgJ2NjLm1pc2MuY2xhbXAwMScpO1xuICAgICAgICByZXR1cm4gY2MubWlzYy5jbGFtcDAxO1xuICAgIH0pO1xuICAgIGpzLmdldChjYywgJ0ltYWdlRm9ybWF0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy53YXJuSUQoMTQwMCwgJ2NjLkltYWdlRm9ybWF0JywgJ2NjLm1hY3JvLkltYWdlRm9ybWF0Jyk7XG4gICAgICAgIHJldHVybiBjYy5tYWNyby5JbWFnZUZvcm1hdDtcbiAgICB9KTtcbiAgICBqcy5nZXQoY2MsICdLRVknLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLndhcm5JRCgxNDAwLCAnY2MuS0VZJywgJ2NjLm1hY3JvLktFWScpO1xuICAgICAgICByZXR1cm4gY2MubWFjcm8uS0VZO1xuICAgIH0pO1xuICAgIGpzLmdldChjYywgJ0Vhc2luZycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Mud2FybklEKDE0MDAsICdjYy5FYXNpbmcnLCAnY2MuZWFzaW5nJyk7XG4gICAgICAgIHJldHVybiBjYy5lYXNpbmc7XG4gICAgfSk7XG5cbiAgICAvLyBjYy5pc0NoaWxkQ2xhc3NPZlxuICAgIGpzLmdldChjYywgJ2lzQ2hpbGRDbGFzc09mJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5lcnJvcklEKDE0MDAsICdjYy5pc0NoaWxkQ2xhc3NPZicsICdjYy5qcy5pc0NoaWxkQ2xhc3NPZicpO1xuICAgICAgICByZXR1cm4gY2MuanMuaXNDaGlsZENsYXNzT2Y7XG4gICAgfSk7XG5cbiAgICAvLyBkcmFnb24gYm9uZXNcbiAgICBpZiAodHlwZW9mIGRyYWdvbkJvbmVzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBqcy5vYnNvbGV0ZShkcmFnb25Cb25lcy5DQ0ZhY3RvcnksICdkcmFnb25Cb25lcy5DQ0ZhY3RvcnkuZ2V0RmFjdG9yeScsICdnZXRJbnN0YW5jZScpO1xuICAgIH1cblxuICAgIC8vIHJlbmRlckVuZ2luZVxuICAgIGNjLnJlbmRlcmVyLnJlbmRlckVuZ2luZSA9IHtcbiAgICAgICAgZ2V0IGdmeCAoKSB7XG4gICAgICAgICAgICBjYy53YXJuSUQoMTQwMCwgJ2NjLnJlbmRlcmVyLnJlbmRlckVuZ2luZS5nZngnLCAnY2MuZ2Z4Jyk7XG4gICAgICAgICAgICByZXR1cm4gY2MuZ2Z4O1xuICAgICAgICB9LFxuICAgICAgICBnZXQgbWF0aCAoKSB7XG4gICAgICAgICAgICBjYy53YXJuSUQoMTQwMCwgJ2NjLnJlbmRlcmVyLnJlbmRlckVuZ2luZS5tYXRoJywgJ2NjLm1hdGgnKTtcbiAgICAgICAgICAgIHJldHVybiBjYy52bWF0aDtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IElucHV0QXNzZW1ibGVyICgpIHtcbiAgICAgICAgICAgIGNjLndhcm5JRCgxNDAwLCAnY2MucmVuZGVyZXIucmVuZGVyRW5naW5lLklucHV0QXNzZW1ibGVyJywgJ2NjLnJlbmRlcmVyLklucHV0QXNzZW1ibGVyJyk7XG4gICAgICAgICAgICByZXR1cm4gY2MucmVuZGVyZXIuSW5wdXRBc3NlbWJsZXI7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFxufVxuIl19