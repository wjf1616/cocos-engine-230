
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extensions/dragonbones/ArmatureCache.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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
var MaxCacheTime = 30;
var FrameTime = 1 / 60;
var _vertices = [];
var _indices = [];
var _boneInfoOffset = 0;
var _vertexOffset = 0;
var _indexOffset = 0;
var _vfOffset = 0;
var _preTexUrl = null;
var _preBlendMode = null;
var _segVCount = 0;
var _segICount = 0;
var _segOffset = 0;
var _colorOffset = 0;
var _preColor = null;

var _x, _y; //Cache all frames in an animation


var AnimationCache = cc.Class({
  ctor: function ctor() {
    this._privateMode = false;
    this._inited = false;
    this._invalid = true;
    this._enableCacheAttachedInfo = false;
    this.frames = [];
    this.totalTime = 0;
    this.isCompleted = false;
    this._frameIdx = -1;
    this._armatureInfo = null;
    this._animationName = null;
    this._tempSegments = null;
    this._tempColors = null;
    this._tempBoneInfos = null;
  },
  init: function init(armatureInfo, animationName) {
    this._inited = true;
    this._armatureInfo = armatureInfo;
    this._animationName = animationName;
  },
  // Clear texture quote.
  clear: function clear() {
    this._inited = false;

    for (var i = 0, n = this.frames.length; i < n; i++) {
      var frame = this.frames[i];
      frame.segments.length = 0;
    }

    this.invalidAllFrame();
  },
  begin: function begin() {
    if (!this._invalid) return;
    var armatureInfo = this._armatureInfo;
    var curAnimationCache = armatureInfo.curAnimationCache;

    if (curAnimationCache && curAnimationCache != this) {
      if (this._privateMode) {
        curAnimationCache.invalidAllFrame();
      } else {
        curAnimationCache.updateToFrame();
      }
    }

    var armature = armatureInfo.armature;
    var animation = armature.animation;
    animation.play(this._animationName, 1);
    armatureInfo.curAnimationCache = this;
    this._invalid = false;
    this._frameIdx = -1;
    this.totalTime = 0;
    this.isCompleted = false;
  },
  end: function end() {
    if (!this._needToUpdate()) {
      this._armatureInfo.curAnimationCache = null;
      this.frames.length = this._frameIdx + 1;
      this.isCompleted = true;
    }
  },
  _needToUpdate: function _needToUpdate(toFrameIdx) {
    var armatureInfo = this._armatureInfo;
    var armature = armatureInfo.armature;
    var animation = armature.animation;
    return !animation.isCompleted && this.totalTime < MaxCacheTime && (toFrameIdx == undefined || this._frameIdx < toFrameIdx);
  },
  updateToFrame: function updateToFrame(toFrameIdx) {
    if (!this._inited) return;
    this.begin();
    if (!this._needToUpdate(toFrameIdx)) return;
    var armatureInfo = this._armatureInfo;
    var armature = armatureInfo.armature;

    do {
      // Solid update frame rate 1/60.
      armature.advanceTime(FrameTime);
      this._frameIdx++;

      this._updateFrame(armature, this._frameIdx);

      this.totalTime += FrameTime;
    } while (this._needToUpdate(toFrameIdx));

    this.end();
  },
  isInited: function isInited() {
    return this._inited;
  },
  isInvalid: function isInvalid() {
    return this._invalid;
  },
  invalidAllFrame: function invalidAllFrame() {
    this.isCompleted = false;
    this._invalid = true;
  },
  updateAllFrame: function updateAllFrame() {
    this.invalidAllFrame();
    this.updateToFrame();
  },
  enableCacheAttachedInfo: function enableCacheAttachedInfo() {
    if (!this._enableCacheAttachedInfo) {
      this._enableCacheAttachedInfo = true;
      this.invalidAllFrame();
    }
  },
  _updateFrame: function _updateFrame(armature, index) {
    _vfOffset = 0;
    _boneInfoOffset = 0;
    _indexOffset = 0;
    _vertexOffset = 0;
    _preTexUrl = null;
    _preBlendMode = null;
    _segVCount = 0;
    _segICount = 0;
    _segOffset = 0;
    _colorOffset = 0;
    _preColor = null;
    this.frames[index] = this.frames[index] || {
      segments: [],
      colors: [],
      boneInfos: [],
      vertices: null,
      uintVert: null,
      indices: null
    };
    var frame = this.frames[index];
    var segments = this._tempSegments = frame.segments;
    var colors = this._tempColors = frame.colors;
    var boneInfos = this._tempBoneInfos = frame.boneInfos;

    this._traverseArmature(armature, 1.0); // At last must handle pre color and segment.
    // Because vertex count will right at the end.
    // Handle pre color.


    if (_colorOffset > 0) {
      colors[_colorOffset - 1].vfOffset = _vfOffset;
    }

    colors.length = _colorOffset;
    boneInfos.length = _boneInfoOffset; // Handle pre segment

    var preSegOffset = _segOffset - 1;

    if (preSegOffset >= 0) {
      if (_segICount > 0) {
        var preSegInfo = segments[preSegOffset];
        preSegInfo.indexCount = _segICount;
        preSegInfo.vfCount = _segVCount * 5;
        preSegInfo.vertexCount = _segVCount;
        segments.length = _segOffset;
      } else {
        segments.length = _segOffset - 1;
      }
    } // Discard all segments.


    if (segments.length === 0) return; // Fill vertices

    var vertices = frame.vertices;
    var uintVert = frame.uintVert;

    if (!vertices || vertices.length < _vfOffset) {
      vertices = frame.vertices = new Float32Array(_vfOffset);
      uintVert = frame.uintVert = new Uint32Array(vertices.buffer);
    }

    for (var i = 0, j = 0; i < _vfOffset;) {
      vertices[i++] = _vertices[j++]; // x

      vertices[i++] = _vertices[j++]; // y

      vertices[i++] = _vertices[j++]; // u

      vertices[i++] = _vertices[j++]; // v

      uintVert[i++] = _vertices[j++]; // color
    } // Fill indices


    var indices = frame.indices;

    if (!indices || indices.length < _indexOffset) {
      indices = frame.indices = new Uint16Array(_indexOffset);
    }

    for (var _i = 0; _i < _indexOffset; _i++) {
      indices[_i] = _indices[_i];
    }

    frame.vertices = vertices;
    frame.uintVert = uintVert;
    frame.indices = indices;
  },
  _traverseArmature: function _traverseArmature(armature, parentOpacity) {
    var colors = this._tempColors;
    var segments = this._tempSegments;
    var boneInfos = this._tempBoneInfos;
    var gVertices = _vertices;
    var gIndices = _indices;
    var slotVertices, slotIndices;
    var slots = armature._slots,
        slot,
        slotMatrix,
        slotMatrixm,
        slotColor,
        colorVal;
    var texture;
    var preSegOffset, preSegInfo;
    var bones = armature._bones;

    if (this._enableCacheAttachedInfo) {
      for (var i = 0, l = bones.length; i < l; i++, _boneInfoOffset++) {
        var bone = bones[i];
        var boneInfo = boneInfos[_boneInfoOffset];

        if (!boneInfo) {
          boneInfo = boneInfos[_boneInfoOffset] = {
            globalTransformMatrix: new dragonBones.Matrix()
          };
        }

        var boneMat = bone.globalTransformMatrix;
        var cacheBoneMat = boneInfo.globalTransformMatrix;
        cacheBoneMat.copyFrom(boneMat);
      }
    }

    for (var _i2 = 0, _l = slots.length; _i2 < _l; _i2++) {
      slot = slots[_i2];
      if (!slot._visible || !slot._displayData) continue;
      slot.updateWorldMatrix();
      slotColor = slot._color;

      if (slot.childArmature) {
        this._traverseArmature(slot.childArmature, parentOpacity * slotColor.a / 255);

        continue;
      }

      texture = slot.getTexture();
      if (!texture) continue;

      if (_preTexUrl !== texture.url || _preBlendMode !== slot._blendMode) {
        _preTexUrl = texture.url;
        _preBlendMode = slot._blendMode; // Handle pre segment.

        preSegOffset = _segOffset - 1;

        if (preSegOffset >= 0) {
          if (_segICount > 0) {
            preSegInfo = segments[preSegOffset];
            preSegInfo.indexCount = _segICount;
            preSegInfo.vertexCount = _segVCount;
            preSegInfo.vfCount = _segVCount * 5;
          } else {
            // Discard pre segment.
            _segOffset--;
          }
        } // Handle now segment.


        segments[_segOffset] = {
          tex: texture,
          blendMode: slot._blendMode,
          indexCount: 0,
          vertexCount: 0,
          vfCount: 0
        };
        _segOffset++;
        _segICount = 0;
        _segVCount = 0;
      }

      colorVal = (slotColor.a * parentOpacity << 24 >>> 0) + (slotColor.b << 16) + (slotColor.g << 8) + slotColor.r;

      if (_preColor !== colorVal) {
        _preColor = colorVal;

        if (_colorOffset > 0) {
          colors[_colorOffset - 1].vfOffset = _vfOffset;
        }

        colors[_colorOffset++] = {
          r: slotColor.r,
          g: slotColor.g,
          b: slotColor.b,
          a: slotColor.a * parentOpacity,
          vfOffset: 0
        };
      }

      slotVertices = slot._localVertices;
      slotIndices = slot._indices;
      slotMatrix = slot._worldMatrix;
      slotMatrixm = slotMatrix.m;

      for (var j = 0, vl = slotVertices.length; j < vl;) {
        _x = slotVertices[j++];
        _y = slotVertices[j++];
        gVertices[_vfOffset++] = _x * slotMatrixm[0] + _y * slotMatrixm[4] + slotMatrixm[12];
        gVertices[_vfOffset++] = _x * slotMatrixm[1] + _y * slotMatrixm[5] + slotMatrixm[13];
        gVertices[_vfOffset++] = slotVertices[j++];
        gVertices[_vfOffset++] = slotVertices[j++];
        gVertices[_vfOffset++] = colorVal;
      } // This place must use segment vertex count to calculate vertex offset.
      // Assembler will calculate vertex offset again for different segment.


      for (var ii = 0, il = slotIndices.length; ii < il; ii++) {
        gIndices[_indexOffset++] = _segVCount + slotIndices[ii];
      }

      _vertexOffset = _vfOffset / 5;
      _segICount += slotIndices.length;
      _segVCount += slotVertices.length / 4;
    }
  }
});
var ArmatureCache = cc.Class({
  ctor: function ctor() {
    this._privateMode = false;
    this._animationPool = {};
    this._armatureCache = {};
  },
  enablePrivateMode: function enablePrivateMode() {
    this._privateMode = true;
  },
  // If cache is private, cache will be destroy when dragonbones node destroy.
  dispose: function dispose() {
    for (var key in this._armatureCache) {
      var armatureInfo = this._armatureCache[key];

      if (armatureInfo) {
        var armature = armatureInfo.armature;
        armature && armature.dispose();
      }
    }

    this._armatureCache = null;
    this._animationPool = null;
  },
  _removeArmature: function _removeArmature(armatureKey) {
    var armatureInfo = this._armatureCache[armatureKey];
    var animationsCache = armatureInfo.animationsCache;

    for (var aniKey in animationsCache) {
      // Clear cache texture, and put cache into pool.
      // No need to create TypedArray next time.
      var animationCache = animationsCache[aniKey];
      if (!animationCache) continue;
      this._animationPool[armatureKey + "#" + aniKey] = animationCache;
      animationCache.clear();
    }

    var armature = armatureInfo.armature;
    armature && armature.dispose();
    delete this._armatureCache[armatureKey];
  },
  // When db assets be destroy, remove armature from db cache.
  resetArmature: function resetArmature(uuid) {
    for (var armatureKey in this._armatureCache) {
      if (armatureKey.indexOf(uuid) == -1) continue;

      this._removeArmature(armatureKey);
    }
  },
  getArmatureCache: function getArmatureCache(armatureName, armatureKey, atlasUUID) {
    var armatureInfo = this._armatureCache[armatureKey];
    var armature;

    if (!armatureInfo) {
      var factory = dragonBones.CCFactory.getInstance();
      var proxy = factory.buildArmatureDisplay(armatureName, armatureKey, "", atlasUUID);
      if (!proxy || !proxy._armature) return;
      armature = proxy._armature; // If armature has child armature, can not be cache, because it's
      // animation data can not be precompute.

      if (!ArmatureCache.canCache(armature)) {
        armature.dispose();
        return;
      }

      this._armatureCache[armatureKey] = {
        armature: armature,
        // Cache all kinds of animation frame.
        // When armature is dispose, clear all animation cache.
        animationsCache: {},
        curAnimationCache: null
      };
    } else {
      armature = armatureInfo.armature;
    }

    return armature;
  },
  getAnimationCache: function getAnimationCache(armatureKey, animationName) {
    var armatureInfo = this._armatureCache[armatureKey];
    if (!armatureInfo) return null;
    var animationsCache = armatureInfo.animationsCache;
    return animationsCache[animationName];
  },
  initAnimationCache: function initAnimationCache(armatureKey, animationName) {
    if (!animationName) return null;
    var armatureInfo = this._armatureCache[armatureKey];
    var armature = armatureInfo && armatureInfo.armature;
    if (!armature) return null;
    var animation = armature.animation;
    var hasAni = animation.hasAnimation(animationName);
    if (!hasAni) return null;
    var animationsCache = armatureInfo.animationsCache;
    var animationCache = animationsCache[animationName];

    if (!animationCache) {
      // If cache exist in pool, then just use it.
      var poolKey = armatureKey + "#" + animationName;
      animationCache = this._animationPool[poolKey];

      if (animationCache) {
        delete this._animationPool[poolKey];
      } else {
        animationCache = new AnimationCache();
        animationCache._privateMode = this._privateMode;
      }

      animationCache.init(armatureInfo, animationName);
      animationsCache[animationName] = animationCache;
    }

    return animationCache;
  },
  invalidAnimationCache: function invalidAnimationCache(armatureKey) {
    var armatureInfo = this._armatureCache[armatureKey];
    var armature = armatureInfo && armatureInfo.armature;
    if (!armature) return null;
    var animationsCache = armatureInfo.animationsCache;

    for (var aniKey in animationsCache) {
      var animationCache = animationsCache[aniKey];
      animationCache.invalidAllFrame();
    }
  },
  updateAnimationCache: function updateAnimationCache(armatureKey, animationName) {
    if (animationName) {
      var animationCache = this.initAnimationCache(armatureKey, animationName);
      if (!animationCache) return;
      animationCache.updateAllFrame();
    } else {
      var armatureInfo = this._armatureCache[armatureKey];
      var armature = armatureInfo && armatureInfo.armature;
      if (!armature) return null;
      var animationsCache = armatureInfo.animationsCache;

      for (var aniKey in animationsCache) {
        var _animationCache = animationsCache[aniKey];

        _animationCache.updateAllFrame();
      }
    }
  }
});
ArmatureCache.FrameTime = FrameTime;
ArmatureCache.sharedCache = new ArmatureCache();
ArmatureCache.canCache = function (armature) {
  var slots = armature._slots;

  for (var i = 0, l = slots.length; i < l; i++) {
    var slot = slots[i];

    if (slot.childArmature) {
      return false;
    }
  }

  return true;
}, module.exports = ArmatureCache;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFybWF0dXJlQ2FjaGUuanMiXSwibmFtZXMiOlsiTWF4Q2FjaGVUaW1lIiwiRnJhbWVUaW1lIiwiX3ZlcnRpY2VzIiwiX2luZGljZXMiLCJfYm9uZUluZm9PZmZzZXQiLCJfdmVydGV4T2Zmc2V0IiwiX2luZGV4T2Zmc2V0IiwiX3ZmT2Zmc2V0IiwiX3ByZVRleFVybCIsIl9wcmVCbGVuZE1vZGUiLCJfc2VnVkNvdW50IiwiX3NlZ0lDb3VudCIsIl9zZWdPZmZzZXQiLCJfY29sb3JPZmZzZXQiLCJfcHJlQ29sb3IiLCJfeCIsIl95IiwiQW5pbWF0aW9uQ2FjaGUiLCJjYyIsIkNsYXNzIiwiY3RvciIsIl9wcml2YXRlTW9kZSIsIl9pbml0ZWQiLCJfaW52YWxpZCIsIl9lbmFibGVDYWNoZUF0dGFjaGVkSW5mbyIsImZyYW1lcyIsInRvdGFsVGltZSIsImlzQ29tcGxldGVkIiwiX2ZyYW1lSWR4IiwiX2FybWF0dXJlSW5mbyIsIl9hbmltYXRpb25OYW1lIiwiX3RlbXBTZWdtZW50cyIsIl90ZW1wQ29sb3JzIiwiX3RlbXBCb25lSW5mb3MiLCJpbml0IiwiYXJtYXR1cmVJbmZvIiwiYW5pbWF0aW9uTmFtZSIsImNsZWFyIiwiaSIsIm4iLCJsZW5ndGgiLCJmcmFtZSIsInNlZ21lbnRzIiwiaW52YWxpZEFsbEZyYW1lIiwiYmVnaW4iLCJjdXJBbmltYXRpb25DYWNoZSIsInVwZGF0ZVRvRnJhbWUiLCJhcm1hdHVyZSIsImFuaW1hdGlvbiIsInBsYXkiLCJlbmQiLCJfbmVlZFRvVXBkYXRlIiwidG9GcmFtZUlkeCIsInVuZGVmaW5lZCIsImFkdmFuY2VUaW1lIiwiX3VwZGF0ZUZyYW1lIiwiaXNJbml0ZWQiLCJpc0ludmFsaWQiLCJ1cGRhdGVBbGxGcmFtZSIsImVuYWJsZUNhY2hlQXR0YWNoZWRJbmZvIiwiaW5kZXgiLCJjb2xvcnMiLCJib25lSW5mb3MiLCJ2ZXJ0aWNlcyIsInVpbnRWZXJ0IiwiaW5kaWNlcyIsIl90cmF2ZXJzZUFybWF0dXJlIiwidmZPZmZzZXQiLCJwcmVTZWdPZmZzZXQiLCJwcmVTZWdJbmZvIiwiaW5kZXhDb3VudCIsInZmQ291bnQiLCJ2ZXJ0ZXhDb3VudCIsIkZsb2F0MzJBcnJheSIsIlVpbnQzMkFycmF5IiwiYnVmZmVyIiwiaiIsIlVpbnQxNkFycmF5IiwicGFyZW50T3BhY2l0eSIsImdWZXJ0aWNlcyIsImdJbmRpY2VzIiwic2xvdFZlcnRpY2VzIiwic2xvdEluZGljZXMiLCJzbG90cyIsIl9zbG90cyIsInNsb3QiLCJzbG90TWF0cml4Iiwic2xvdE1hdHJpeG0iLCJzbG90Q29sb3IiLCJjb2xvclZhbCIsInRleHR1cmUiLCJib25lcyIsIl9ib25lcyIsImwiLCJib25lIiwiYm9uZUluZm8iLCJnbG9iYWxUcmFuc2Zvcm1NYXRyaXgiLCJkcmFnb25Cb25lcyIsIk1hdHJpeCIsImJvbmVNYXQiLCJjYWNoZUJvbmVNYXQiLCJjb3B5RnJvbSIsIl92aXNpYmxlIiwiX2Rpc3BsYXlEYXRhIiwidXBkYXRlV29ybGRNYXRyaXgiLCJfY29sb3IiLCJjaGlsZEFybWF0dXJlIiwiYSIsImdldFRleHR1cmUiLCJ1cmwiLCJfYmxlbmRNb2RlIiwidGV4IiwiYmxlbmRNb2RlIiwiYiIsImciLCJyIiwiX2xvY2FsVmVydGljZXMiLCJfd29ybGRNYXRyaXgiLCJtIiwidmwiLCJpaSIsImlsIiwiQXJtYXR1cmVDYWNoZSIsIl9hbmltYXRpb25Qb29sIiwiX2FybWF0dXJlQ2FjaGUiLCJlbmFibGVQcml2YXRlTW9kZSIsImRpc3Bvc2UiLCJrZXkiLCJfcmVtb3ZlQXJtYXR1cmUiLCJhcm1hdHVyZUtleSIsImFuaW1hdGlvbnNDYWNoZSIsImFuaUtleSIsImFuaW1hdGlvbkNhY2hlIiwicmVzZXRBcm1hdHVyZSIsInV1aWQiLCJpbmRleE9mIiwiZ2V0QXJtYXR1cmVDYWNoZSIsImFybWF0dXJlTmFtZSIsImF0bGFzVVVJRCIsImZhY3RvcnkiLCJDQ0ZhY3RvcnkiLCJnZXRJbnN0YW5jZSIsInByb3h5IiwiYnVpbGRBcm1hdHVyZURpc3BsYXkiLCJfYXJtYXR1cmUiLCJjYW5DYWNoZSIsImdldEFuaW1hdGlvbkNhY2hlIiwiaW5pdEFuaW1hdGlvbkNhY2hlIiwiaGFzQW5pIiwiaGFzQW5pbWF0aW9uIiwicG9vbEtleSIsImludmFsaWRBbmltYXRpb25DYWNoZSIsInVwZGF0ZUFuaW1hdGlvbkNhY2hlIiwic2hhcmVkQ2FjaGUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCQSxJQUFNQSxZQUFZLEdBQUcsRUFBckI7QUFDQSxJQUFNQyxTQUFTLEdBQUcsSUFBSSxFQUF0QjtBQUVBLElBQUlDLFNBQVMsR0FBRyxFQUFoQjtBQUNBLElBQUlDLFFBQVEsR0FBRyxFQUFmO0FBQ0EsSUFBSUMsZUFBZSxHQUFHLENBQXRCO0FBQ0EsSUFBSUMsYUFBYSxHQUFHLENBQXBCO0FBQ0EsSUFBSUMsWUFBWSxHQUFHLENBQW5CO0FBQ0EsSUFBSUMsU0FBUyxHQUFHLENBQWhCO0FBQ0EsSUFBSUMsVUFBVSxHQUFHLElBQWpCO0FBQ0EsSUFBSUMsYUFBYSxHQUFHLElBQXBCO0FBQ0EsSUFBSUMsVUFBVSxHQUFHLENBQWpCO0FBQ0EsSUFBSUMsVUFBVSxHQUFHLENBQWpCO0FBQ0EsSUFBSUMsVUFBVSxHQUFHLENBQWpCO0FBQ0EsSUFBSUMsWUFBWSxHQUFHLENBQW5CO0FBQ0EsSUFBSUMsU0FBUyxHQUFHLElBQWhCOztBQUNBLElBQUlDLEVBQUosRUFBUUMsRUFBUixFQUVBOzs7QUFDQSxJQUFJQyxjQUFjLEdBQUdDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQzFCQyxFQUFBQSxJQUQwQixrQkFDbEI7QUFDSixTQUFLQyxZQUFMLEdBQW9CLEtBQXBCO0FBQ0EsU0FBS0MsT0FBTCxHQUFlLEtBQWY7QUFDQSxTQUFLQyxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsU0FBS0Msd0JBQUwsR0FBZ0MsS0FBaEM7QUFDQSxTQUFLQyxNQUFMLEdBQWMsRUFBZDtBQUNBLFNBQUtDLFNBQUwsR0FBaUIs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QU8sSUFBUDtBQUNILENBVEQsRUFXQWdELE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQmpDLGFBWGpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5jb25zdCBNYXhDYWNoZVRpbWUgPSAzMDtcbmNvbnN0IEZyYW1lVGltZSA9IDEgLyA2MDsgXG5cbmxldCBfdmVydGljZXMgPSBbXTtcbmxldCBfaW5kaWNlcyA9IFtdO1xubGV0IF9ib25lSW5mb09mZnNldCA9IDA7XG5sZXQgX3ZlcnRleE9mZnNldCA9IDA7XG5sZXQgX2luZGV4T2Zmc2V0ID0gMDtcbmxldCBfdmZPZmZzZXQgPSAwO1xubGV0IF9wcmVUZXhVcmwgPSBudWxsO1xubGV0IF9wcmVCbGVuZE1vZGUgPSBudWxsO1xubGV0IF9zZWdWQ291bnQgPSAwO1xubGV0IF9zZWdJQ291bnQgPSAwO1xubGV0IF9zZWdPZmZzZXQgPSAwO1xubGV0IF9jb2xvck9mZnNldCA9IDA7XG5sZXQgX3ByZUNvbG9yID0gbnVsbDtcbmxldCBfeCwgX3k7XG5cbi8vQ2FjaGUgYWxsIGZyYW1lcyBpbiBhbiBhbmltYXRpb25cbmxldCBBbmltYXRpb25DYWNoZSA9IGNjLkNsYXNzKHtcbiAgICBjdG9yICgpIHtcbiAgICAgICAgdGhpcy5fcHJpdmF0ZU1vZGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5faW5pdGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2ludmFsaWQgPSB0cnVlO1xuICAgICAgICB0aGlzLl9lbmFibGVDYWNoZUF0dGFjaGVkSW5mbyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmZyYW1lcyA9IFtdO1xuICAgICAgICB0aGlzLnRvdGFsVGltZSA9IDA7XG4gICAgICAgIHRoaXMuaXNDb21wbGV0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fZnJhbWVJZHggPSAtMTtcblxuICAgICAgICB0aGlzLl9hcm1hdHVyZUluZm8gPSBudWxsO1xuICAgICAgICB0aGlzLl9hbmltYXRpb25OYW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5fdGVtcFNlZ21lbnRzID0gbnVsbDtcbiAgICAgICAgdGhpcy5fdGVtcENvbG9ycyA9IG51bGw7XG4gICAgICAgIHRoaXMuX3RlbXBCb25lSW5mb3MgPSBudWxsO1xuICAgIH0sXG5cbiAgICBpbml0IChhcm1hdHVyZUluZm8sIGFuaW1hdGlvbk5hbWUpIHtcbiAgICAgICAgdGhpcy5faW5pdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fYXJtYXR1cmVJbmZvID0gYXJtYXR1cmVJbmZvO1xuICAgICAgICB0aGlzLl9hbmltYXRpb25OYW1lID0gYW5pbWF0aW9uTmFtZTtcbiAgICB9LFxuXG4gICAgLy8gQ2xlYXIgdGV4dHVyZSBxdW90ZS5cbiAgICBjbGVhciAoKSB7XG4gICAgICAgIHRoaXMuX2luaXRlZCA9IGZhbHNlO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbiA9IHRoaXMuZnJhbWVzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgbGV0IGZyYW1lID0gdGhpcy5mcmFtZXNbaV07XG4gICAgICAgICAgICBmcmFtZS5zZWdtZW50cy5sZW5ndGggPSAwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW52YWxpZEFsbEZyYW1lKCk7XG4gICAgfSxcblxuICAgIGJlZ2luICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pbnZhbGlkKSByZXR1cm47XG5cbiAgICAgICAgbGV0IGFybWF0dXJlSW5mbyA9IHRoaXMuX2FybWF0dXJlSW5mbztcbiAgICAgICAgbGV0IGN1ckFuaW1hdGlvbkNhY2hlID0gYXJtYXR1cmVJbmZvLmN1ckFuaW1hdGlvbkNhY2hlO1xuICAgICAgICBpZiAoY3VyQW5pbWF0aW9uQ2FjaGUgJiYgY3VyQW5pbWF0aW9uQ2FjaGUgIT0gdGhpcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3ByaXZhdGVNb2RlKSB7XG4gICAgICAgICAgICAgICAgY3VyQW5pbWF0aW9uQ2FjaGUuaW52YWxpZEFsbEZyYW1lKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGN1ckFuaW1hdGlvbkNhY2hlLnVwZGF0ZVRvRnJhbWUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgYXJtYXR1cmUgPSBhcm1hdHVyZUluZm8uYXJtYXR1cmU7XG4gICAgICAgIGxldCBhbmltYXRpb24gPSBhcm1hdHVyZS5hbmltYXRpb247XG4gICAgICAgIGFuaW1hdGlvbi5wbGF5KHRoaXMuX2FuaW1hdGlvbk5hbWUsIDEpO1xuXG4gICAgICAgIGFybWF0dXJlSW5mby5jdXJBbmltYXRpb25DYWNoZSA9IHRoaXM7XG4gICAgICAgIHRoaXMuX2ludmFsaWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fZnJhbWVJZHggPSAtMTtcbiAgICAgICAgdGhpcy50b3RhbFRpbWUgPSAwO1xuICAgICAgICB0aGlzLmlzQ29tcGxldGVkID0gZmFsc2U7XG4gICAgfSxcblxuICAgIGVuZCAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fbmVlZFRvVXBkYXRlKCkpIHtcbiAgICAgICAgICAgIHRoaXMuX2FybWF0dXJlSW5mby5jdXJBbmltYXRpb25DYWNoZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmZyYW1lcy5sZW5ndGggPSB0aGlzLl9mcmFtZUlkeCArIDE7XG4gICAgICAgICAgICB0aGlzLmlzQ29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfbmVlZFRvVXBkYXRlICh0b0ZyYW1lSWR4KSB7XG4gICAgICAgIGxldCBhcm1hdHVyZUluZm8gPSB0aGlzLl9hcm1hdHVyZUluZm87XG4gICAgICAgIGxldCBhcm1hdHVyZSA9IGFybWF0dXJlSW5mby5hcm1hdHVyZTtcbiAgICAgICAgbGV0IGFuaW1hdGlvbiA9IGFybWF0dXJlLmFuaW1hdGlvbjtcbiAgICAgICAgcmV0dXJuICFhbmltYXRpb24uaXNDb21wbGV0ZWQgJiYgXG4gICAgICAgICAgICAgICAgdGhpcy50b3RhbFRpbWUgPCBNYXhDYWNoZVRpbWUgJiYgXG4gICAgICAgICAgICAgICAgKHRvRnJhbWVJZHggPT0gdW5kZWZpbmVkIHx8IHRoaXMuX2ZyYW1lSWR4IDwgdG9GcmFtZUlkeCk7XG4gICAgfSxcblxuICAgIHVwZGF0ZVRvRnJhbWUgKHRvRnJhbWVJZHgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pbml0ZWQpIHJldHVybjtcblxuICAgICAgICB0aGlzLmJlZ2luKCk7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9uZWVkVG9VcGRhdGUodG9GcmFtZUlkeCkpIHJldHVybjtcblxuICAgICAgICBsZXQgYXJtYXR1cmVJbmZvID0gdGhpcy5fYXJtYXR1cmVJbmZvO1xuICAgICAgICBsZXQgYXJtYXR1cmUgPSBhcm1hdHVyZUluZm8uYXJtYXR1cmU7XG5cbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgLy8gU29saWQgdXBkYXRlIGZyYW1lIHJhdGUgMS82MC5cbiAgICAgICAgICAgIGFybWF0dXJlLmFkdmFuY2VUaW1lKEZyYW1lVGltZSk7XG4gICAgICAgICAgICB0aGlzLl9mcmFtZUlkeCsrO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlRnJhbWUoYXJtYXR1cmUsIHRoaXMuX2ZyYW1lSWR4KTtcbiAgICAgICAgICAgIHRoaXMudG90YWxUaW1lICs9IEZyYW1lVGltZTtcbiAgICAgICAgfSB3aGlsZSAodGhpcy5fbmVlZFRvVXBkYXRlKHRvRnJhbWVJZHgpKTtcbiAgICAgICBcbiAgICAgICAgdGhpcy5lbmQoKTtcbiAgICB9LFxuXG4gICAgaXNJbml0ZWQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faW5pdGVkO1xuICAgIH0sXG5cbiAgICBpc0ludmFsaWQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faW52YWxpZDtcbiAgICB9LFxuXG4gICAgaW52YWxpZEFsbEZyYW1lICgpIHtcbiAgICAgICAgdGhpcy5pc0NvbXBsZXRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pbnZhbGlkID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgdXBkYXRlQWxsRnJhbWUgKCkge1xuICAgICAgICB0aGlzLmludmFsaWRBbGxGcmFtZSgpO1xuICAgICAgICB0aGlzLnVwZGF0ZVRvRnJhbWUoKTtcbiAgICB9LFxuXG4gICAgZW5hYmxlQ2FjaGVBdHRhY2hlZEluZm8gKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2VuYWJsZUNhY2hlQXR0YWNoZWRJbmZvKSB7XG4gICAgICAgICAgICB0aGlzLl9lbmFibGVDYWNoZUF0dGFjaGVkSW5mbyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmludmFsaWRBbGxGcmFtZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91cGRhdGVGcmFtZSAoYXJtYXR1cmUsIGluZGV4KSB7XG4gICAgICAgIF92Zk9mZnNldCA9IDA7XG4gICAgICAgIF9ib25lSW5mb09mZnNldCA9IDA7XG4gICAgICAgIF9pbmRleE9mZnNldCA9IDA7XG4gICAgICAgIF92ZXJ0ZXhPZmZzZXQgPSAwO1xuICAgICAgICBfcHJlVGV4VXJsID0gbnVsbDtcbiAgICAgICAgX3ByZUJsZW5kTW9kZSA9IG51bGw7XG4gICAgICAgIF9zZWdWQ291bnQgPSAwO1xuICAgICAgICBfc2VnSUNvdW50ID0gMDtcbiAgICAgICAgX3NlZ09mZnNldCA9IDA7XG4gICAgICAgIF9jb2xvck9mZnNldCA9IDA7XG4gICAgICAgIF9wcmVDb2xvciA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5mcmFtZXNbaW5kZXhdID0gdGhpcy5mcmFtZXNbaW5kZXhdIHx8IHtcbiAgICAgICAgICAgIHNlZ21lbnRzIDogW10sXG4gICAgICAgICAgICBjb2xvcnMgOiBbXSxcbiAgICAgICAgICAgIGJvbmVJbmZvcyA6IFtdLFxuICAgICAgICAgICAgdmVydGljZXMgOiBudWxsLFxuICAgICAgICAgICAgdWludFZlcnQgOiBudWxsLFxuICAgICAgICAgICAgaW5kaWNlcyA6IG51bGwsXG4gICAgICAgIH07XG4gICAgICAgIGxldCBmcmFtZSA9IHRoaXMuZnJhbWVzW2luZGV4XTtcblxuICAgICAgICBsZXQgc2VnbWVudHMgPSB0aGlzLl90ZW1wU2VnbWVudHMgPSBmcmFtZS5zZWdtZW50cztcbiAgICAgICAgbGV0IGNvbG9ycyA9IHRoaXMuX3RlbXBDb2xvcnMgPSBmcmFtZS5jb2xvcnM7XG4gICAgICAgIGxldCBib25lSW5mb3MgPSB0aGlzLl90ZW1wQm9uZUluZm9zID0gZnJhbWUuYm9uZUluZm9zO1xuICAgICAgICB0aGlzLl90cmF2ZXJzZUFybWF0dXJlKGFybWF0dXJlLCAxLjApO1xuICAgICAgICAvLyBBdCBsYXN0IG11c3QgaGFuZGxlIHByZSBjb2xvciBhbmQgc2VnbWVudC5cbiAgICAgICAgLy8gQmVjYXVzZSB2ZXJ0ZXggY291bnQgd2lsbCByaWdodCBhdCB0aGUgZW5kLlxuICAgICAgICAvLyBIYW5kbGUgcHJlIGNvbG9yLlxuICAgICAgICBpZiAoX2NvbG9yT2Zmc2V0ID4gMCkge1xuICAgICAgICAgICAgY29sb3JzW19jb2xvck9mZnNldCAtIDFdLnZmT2Zmc2V0ID0gX3ZmT2Zmc2V0O1xuICAgICAgICB9XG4gICAgICAgIGNvbG9ycy5sZW5ndGggPSBfY29sb3JPZmZzZXQ7XG4gICAgICAgIGJvbmVJbmZvcy5sZW5ndGggPSBfYm9uZUluZm9PZmZzZXQ7XG4gICAgICAgIFxuICAgICAgICAvLyBIYW5kbGUgcHJlIHNlZ21lbnRcbiAgICAgICAgbGV0IHByZVNlZ09mZnNldCA9IF9zZWdPZmZzZXQgLSAxO1xuICAgICAgICBpZiAocHJlU2VnT2Zmc2V0ID49IDApIHtcbiAgICAgICAgICAgIGlmIChfc2VnSUNvdW50ID4gMCkge1xuICAgICAgICAgICAgICAgIGxldCBwcmVTZWdJbmZvID0gc2VnbWVudHNbcHJlU2VnT2Zmc2V0XTtcbiAgICAgICAgICAgICAgICBwcmVTZWdJbmZvLmluZGV4Q291bnQgPSBfc2VnSUNvdW50O1xuICAgICAgICAgICAgICAgIHByZVNlZ0luZm8udmZDb3VudCA9IF9zZWdWQ291bnQgKiA1O1xuICAgICAgICAgICAgICAgIHByZVNlZ0luZm8udmVydGV4Q291bnQgPSBfc2VnVkNvdW50O1xuICAgICAgICAgICAgICAgIHNlZ21lbnRzLmxlbmd0aCA9IF9zZWdPZmZzZXQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlZ21lbnRzLmxlbmd0aCA9IF9zZWdPZmZzZXQgLSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGlzY2FyZCBhbGwgc2VnbWVudHMuXG4gICAgICAgIGlmIChzZWdtZW50cy5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAgICAgICAvLyBGaWxsIHZlcnRpY2VzXG4gICAgICAgIGxldCB2ZXJ0aWNlcyA9IGZyYW1lLnZlcnRpY2VzO1xuICAgICAgICBsZXQgdWludFZlcnQgPSBmcmFtZS51aW50VmVydDtcbiAgICAgICAgaWYgKCF2ZXJ0aWNlcyB8fCB2ZXJ0aWNlcy5sZW5ndGggPCBfdmZPZmZzZXQpIHtcbiAgICAgICAgICAgIHZlcnRpY2VzID0gZnJhbWUudmVydGljZXMgPSBuZXcgRmxvYXQzMkFycmF5KF92Zk9mZnNldCk7XG4gICAgICAgICAgICB1aW50VmVydCA9IGZyYW1lLnVpbnRWZXJ0ID0gbmV3IFVpbnQzMkFycmF5KHZlcnRpY2VzLmJ1ZmZlcik7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpID0gMCwgaiA9IDA7IGkgPCBfdmZPZmZzZXQ7KSB7XG4gICAgICAgICAgICB2ZXJ0aWNlc1tpKytdID0gX3ZlcnRpY2VzW2orK107IC8vIHhcbiAgICAgICAgICAgIHZlcnRpY2VzW2krK10gPSBfdmVydGljZXNbaisrXTsgLy8geVxuICAgICAgICAgICAgdmVydGljZXNbaSsrXSA9IF92ZXJ0aWNlc1tqKytdOyAvLyB1XG4gICAgICAgICAgICB2ZXJ0aWNlc1tpKytdID0gX3ZlcnRpY2VzW2orK107IC8vIHZcbiAgICAgICAgICAgIHVpbnRWZXJ0W2krK10gPSBfdmVydGljZXNbaisrXTsgLy8gY29sb3JcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZpbGwgaW5kaWNlc1xuICAgICAgICBsZXQgaW5kaWNlcyA9IGZyYW1lLmluZGljZXM7XG4gICAgICAgIGlmICghaW5kaWNlcyB8fCBpbmRpY2VzLmxlbmd0aCA8IF9pbmRleE9mZnNldCkge1xuICAgICAgICAgICAgaW5kaWNlcyA9IGZyYW1lLmluZGljZXMgPSBuZXcgVWludDE2QXJyYXkoX2luZGV4T2Zmc2V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgX2luZGV4T2Zmc2V0OyBpKyspIHtcbiAgICAgICAgICAgIGluZGljZXNbaV0gPSBfaW5kaWNlc1tpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZyYW1lLnZlcnRpY2VzID0gdmVydGljZXM7XG4gICAgICAgIGZyYW1lLnVpbnRWZXJ0ID0gdWludFZlcnQ7XG4gICAgICAgIGZyYW1lLmluZGljZXMgPSBpbmRpY2VzO1xuICAgIH0sXG5cbiAgICBfdHJhdmVyc2VBcm1hdHVyZSAoYXJtYXR1cmUsIHBhcmVudE9wYWNpdHkpIHtcbiAgICAgICAgbGV0IGNvbG9ycyA9IHRoaXMuX3RlbXBDb2xvcnM7XG4gICAgICAgIGxldCBzZWdtZW50cyA9IHRoaXMuX3RlbXBTZWdtZW50cztcbiAgICAgICAgbGV0IGJvbmVJbmZvcyA9IHRoaXMuX3RlbXBCb25lSW5mb3M7XG4gICAgICAgIGxldCBnVmVydGljZXMgPSBfdmVydGljZXM7XG4gICAgICAgIGxldCBnSW5kaWNlcyA9IF9pbmRpY2VzO1xuICAgICAgICBsZXQgc2xvdFZlcnRpY2VzLCBzbG90SW5kaWNlcztcbiAgICAgICAgbGV0IHNsb3RzID0gYXJtYXR1cmUuX3Nsb3RzLCBzbG90LCBzbG90TWF0cml4LCBzbG90TWF0cml4bSwgc2xvdENvbG9yLCBjb2xvclZhbDtcbiAgICAgICAgbGV0IHRleHR1cmU7XG4gICAgICAgIGxldCBwcmVTZWdPZmZzZXQsIHByZVNlZ0luZm87XG4gICAgICAgIGxldCBib25lcyA9IGFybWF0dXJlLl9ib25lcztcblxuICAgICAgICBpZiAodGhpcy5fZW5hYmxlQ2FjaGVBdHRhY2hlZEluZm8pIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gYm9uZXMubGVuZ3RoOyBpIDwgbDsgaSsrLCBfYm9uZUluZm9PZmZzZXQrKykge1xuICAgICAgICAgICAgICAgIGxldCBib25lID0gYm9uZXNbaV07XG4gICAgICAgICAgICAgICAgbGV0IGJvbmVJbmZvID0gYm9uZUluZm9zW19ib25lSW5mb09mZnNldF07XG4gICAgICAgICAgICAgICAgaWYgKCFib25lSW5mbykge1xuICAgICAgICAgICAgICAgICAgICBib25lSW5mbyA9IGJvbmVJbmZvc1tfYm9uZUluZm9PZmZzZXRdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2xvYmFsVHJhbnNmb3JtTWF0cml4OiBuZXcgZHJhZ29uQm9uZXMuTWF0cml4KCksXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBib25lTWF0ID0gYm9uZS5nbG9iYWxUcmFuc2Zvcm1NYXRyaXg7XG4gICAgICAgICAgICAgICAgbGV0IGNhY2hlQm9uZU1hdCA9IGJvbmVJbmZvLmdsb2JhbFRyYW5zZm9ybU1hdHJpeDtcbiAgICAgICAgICAgICAgICBjYWNoZUJvbmVNYXQuY29weUZyb20oYm9uZU1hdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHNsb3RzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgc2xvdCA9IHNsb3RzW2ldO1xuICAgICAgICAgICAgaWYgKCFzbG90Ll92aXNpYmxlIHx8ICFzbG90Ll9kaXNwbGF5RGF0YSkgY29udGludWU7XG5cbiAgICAgICAgICAgIHNsb3QudXBkYXRlV29ybGRNYXRyaXgoKTtcbiAgICAgICAgICAgIHNsb3RDb2xvciA9IHNsb3QuX2NvbG9yO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoc2xvdC5jaGlsZEFybWF0dXJlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdHJhdmVyc2VBcm1hdHVyZShzbG90LmNoaWxkQXJtYXR1cmUsIHBhcmVudE9wYWNpdHkgKiBzbG90Q29sb3IuYSAvIDI1NSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRleHR1cmUgPSBzbG90LmdldFRleHR1cmUoKTtcbiAgICAgICAgICAgIGlmICghdGV4dHVyZSkgY29udGludWU7XG5cbiAgICAgICAgICAgIGlmIChfcHJlVGV4VXJsICE9PSB0ZXh0dXJlLnVybCB8fCBfcHJlQmxlbmRNb2RlICE9PSBzbG90Ll9ibGVuZE1vZGUpIHtcbiAgICAgICAgICAgICAgICBfcHJlVGV4VXJsID0gdGV4dHVyZS51cmw7XG4gICAgICAgICAgICAgICAgX3ByZUJsZW5kTW9kZSA9IHNsb3QuX2JsZW5kTW9kZTtcbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgcHJlIHNlZ21lbnQuXG4gICAgICAgICAgICAgICAgcHJlU2VnT2Zmc2V0ID0gX3NlZ09mZnNldCAtIDE7XG4gICAgICAgICAgICAgICAgaWYgKHByZVNlZ09mZnNldCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfc2VnSUNvdW50ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlU2VnSW5mbyA9IHNlZ21lbnRzW3ByZVNlZ09mZnNldF07XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVTZWdJbmZvLmluZGV4Q291bnQgPSBfc2VnSUNvdW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlU2VnSW5mby52ZXJ0ZXhDb3VudCA9IF9zZWdWQ291bnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVTZWdJbmZvLnZmQ291bnQgPSBfc2VnVkNvdW50ICogNTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIERpc2NhcmQgcHJlIHNlZ21lbnQuXG4gICAgICAgICAgICAgICAgICAgICAgICBfc2VnT2Zmc2V0LS07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gSGFuZGxlIG5vdyBzZWdtZW50LlxuICAgICAgICAgICAgICAgIHNlZ21lbnRzW19zZWdPZmZzZXRdID0ge1xuICAgICAgICAgICAgICAgICAgICB0ZXggOiB0ZXh0dXJlLFxuICAgICAgICAgICAgICAgICAgICBibGVuZE1vZGUgOiBzbG90Ll9ibGVuZE1vZGUsXG4gICAgICAgICAgICAgICAgICAgIGluZGV4Q291bnQgOiAwLFxuICAgICAgICAgICAgICAgICAgICB2ZXJ0ZXhDb3VudCA6IDAsXG4gICAgICAgICAgICAgICAgICAgIHZmQ291bnQgOiAwXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBfc2VnT2Zmc2V0Kys7XG4gICAgICAgICAgICAgICAgX3NlZ0lDb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgX3NlZ1ZDb3VudCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbG9yVmFsID0gKChzbG90Q29sb3IuYSAqIHBhcmVudE9wYWNpdHkgPDwgMjQpID4+PiAwKSArIChzbG90Q29sb3IuYiA8PCAxNikgKyAoc2xvdENvbG9yLmcgPDwgOCkgKyBzbG90Q29sb3IucjtcblxuICAgICAgICAgICAgaWYgKF9wcmVDb2xvciAhPT0gY29sb3JWYWwpIHtcbiAgICAgICAgICAgICAgICBfcHJlQ29sb3IgPSBjb2xvclZhbDtcbiAgICAgICAgICAgICAgICBpZiAoX2NvbG9yT2Zmc2V0ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcnNbX2NvbG9yT2Zmc2V0IC0gMV0udmZPZmZzZXQgPSBfdmZPZmZzZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbG9yc1tfY29sb3JPZmZzZXQrK10gPSB7XG4gICAgICAgICAgICAgICAgICAgIHIgOiBzbG90Q29sb3IucixcbiAgICAgICAgICAgICAgICAgICAgZyA6IHNsb3RDb2xvci5nLFxuICAgICAgICAgICAgICAgICAgICBiIDogc2xvdENvbG9yLmIsXG4gICAgICAgICAgICAgICAgICAgIGEgOiBzbG90Q29sb3IuYSAqIHBhcmVudE9wYWNpdHksXG4gICAgICAgICAgICAgICAgICAgIHZmT2Zmc2V0IDogMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2xvdFZlcnRpY2VzID0gc2xvdC5fbG9jYWxWZXJ0aWNlcztcbiAgICAgICAgICAgIHNsb3RJbmRpY2VzID0gc2xvdC5faW5kaWNlcztcblxuICAgICAgICAgICAgc2xvdE1hdHJpeCA9IHNsb3QuX3dvcmxkTWF0cml4O1xuICAgICAgICAgICAgc2xvdE1hdHJpeG0gPSBzbG90TWF0cml4Lm07XG5cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCB2bCA9IHNsb3RWZXJ0aWNlcy5sZW5ndGg7IGogPCB2bDspIHtcbiAgICAgICAgICAgICAgICBfeCA9IHNsb3RWZXJ0aWNlc1tqKytdO1xuICAgICAgICAgICAgICAgIF95ID0gc2xvdFZlcnRpY2VzW2orK107XG4gICAgICAgICAgICAgICAgZ1ZlcnRpY2VzW192Zk9mZnNldCsrXSA9IF94ICogc2xvdE1hdHJpeG1bMF0gKyBfeSAqIHNsb3RNYXRyaXhtWzRdICsgc2xvdE1hdHJpeG1bMTJdO1xuICAgICAgICAgICAgICAgIGdWZXJ0aWNlc1tfdmZPZmZzZXQrK10gPSBfeCAqIHNsb3RNYXRyaXhtWzFdICsgX3kgKiBzbG90TWF0cml4bVs1XSArIHNsb3RNYXRyaXhtWzEzXTtcbiAgICAgICAgICAgICAgICBnVmVydGljZXNbX3ZmT2Zmc2V0KytdID0gc2xvdFZlcnRpY2VzW2orK107XG4gICAgICAgICAgICAgICAgZ1ZlcnRpY2VzW192Zk9mZnNldCsrXSA9IHNsb3RWZXJ0aWNlc1tqKytdO1xuICAgICAgICAgICAgICAgIGdWZXJ0aWNlc1tfdmZPZmZzZXQrK10gPSBjb2xvclZhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gVGhpcyBwbGFjZSBtdXN0IHVzZSBzZWdtZW50IHZlcnRleCBjb3VudCB0byBjYWxjdWxhdGUgdmVydGV4IG9mZnNldC5cbiAgICAgICAgICAgIC8vIEFzc2VtYmxlciB3aWxsIGNhbGN1bGF0ZSB2ZXJ0ZXggb2Zmc2V0IGFnYWluIGZvciBkaWZmZXJlbnQgc2VnbWVudC5cbiAgICAgICAgICAgIGZvciAobGV0IGlpID0gMCwgaWwgPSBzbG90SW5kaWNlcy5sZW5ndGg7IGlpIDwgaWw7IGlpICsrKSB7XG4gICAgICAgICAgICAgICAgZ0luZGljZXNbX2luZGV4T2Zmc2V0KytdID0gX3NlZ1ZDb3VudCArIHNsb3RJbmRpY2VzW2lpXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX3ZlcnRleE9mZnNldCA9IF92Zk9mZnNldCAvIDU7XG4gICAgICAgICAgICBfc2VnSUNvdW50ICs9IHNsb3RJbmRpY2VzLmxlbmd0aDtcbiAgICAgICAgICAgIF9zZWdWQ291bnQgKz0gc2xvdFZlcnRpY2VzLmxlbmd0aCAvIDQ7XG4gICAgICAgIH1cbiAgICB9LFxufSk7XG5cbmxldCBBcm1hdHVyZUNhY2hlID0gY2MuQ2xhc3Moe1xuICAgIGN0b3IgKCkge1xuICAgICAgICB0aGlzLl9wcml2YXRlTW9kZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9hbmltYXRpb25Qb29sID0ge307XG4gICAgICAgIHRoaXMuX2FybWF0dXJlQ2FjaGUgPSB7fTtcbiAgICB9LFxuXG4gICAgZW5hYmxlUHJpdmF0ZU1vZGUgKCkge1xuICAgICAgICB0aGlzLl9wcml2YXRlTW9kZSA9IHRydWU7XG4gICAgfSxcblxuICAgIC8vIElmIGNhY2hlIGlzIHByaXZhdGUsIGNhY2hlIHdpbGwgYmUgZGVzdHJveSB3aGVuIGRyYWdvbmJvbmVzIG5vZGUgZGVzdHJveS5cbiAgICBkaXNwb3NlICgpIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMuX2FybWF0dXJlQ2FjaGUpIHtcbiAgICAgICAgICAgIHZhciBhcm1hdHVyZUluZm8gPSB0aGlzLl9hcm1hdHVyZUNhY2hlW2tleV07XG4gICAgICAgICAgICBpZiAoYXJtYXR1cmVJbmZvKSB7XG4gICAgICAgICAgICAgICAgbGV0IGFybWF0dXJlID0gYXJtYXR1cmVJbmZvLmFybWF0dXJlO1xuICAgICAgICAgICAgICAgIGFybWF0dXJlICYmIGFybWF0dXJlLmRpc3Bvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9hcm1hdHVyZUNhY2hlID0gbnVsbDtcbiAgICAgICAgdGhpcy5fYW5pbWF0aW9uUG9vbCA9IG51bGw7XG4gICAgfSxcblxuICAgIF9yZW1vdmVBcm1hdHVyZSAoYXJtYXR1cmVLZXkpIHtcbiAgICAgICAgdmFyIGFybWF0dXJlSW5mbyA9IHRoaXMuX2FybWF0dXJlQ2FjaGVbYXJtYXR1cmVLZXldO1xuICAgICAgICBsZXQgYW5pbWF0aW9uc0NhY2hlID0gYXJtYXR1cmVJbmZvLmFuaW1hdGlvbnNDYWNoZTtcbiAgICAgICAgZm9yICh2YXIgYW5pS2V5IGluIGFuaW1hdGlvbnNDYWNoZSkge1xuICAgICAgICAgICAgLy8gQ2xlYXIgY2FjaGUgdGV4dHVyZSwgYW5kIHB1dCBjYWNoZSBpbnRvIHBvb2wuXG4gICAgICAgICAgICAvLyBObyBuZWVkIHRvIGNyZWF0ZSBUeXBlZEFycmF5IG5leHQgdGltZS5cbiAgICAgICAgICAgIGxldCBhbmltYXRpb25DYWNoZSA9IGFuaW1hdGlvbnNDYWNoZVthbmlLZXldO1xuICAgICAgICAgICAgaWYgKCFhbmltYXRpb25DYWNoZSkgY29udGludWU7XG4gICAgICAgICAgICB0aGlzLl9hbmltYXRpb25Qb29sW2FybWF0dXJlS2V5ICsgXCIjXCIgKyBhbmlLZXldID0gYW5pbWF0aW9uQ2FjaGU7XG4gICAgICAgICAgICBhbmltYXRpb25DYWNoZS5jbGVhcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGFybWF0dXJlID0gYXJtYXR1cmVJbmZvLmFybWF0dXJlO1xuICAgICAgICBhcm1hdHVyZSAmJiBhcm1hdHVyZS5kaXNwb3NlKCk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9hcm1hdHVyZUNhY2hlW2FybWF0dXJlS2V5XTtcbiAgICB9LFxuXG4gICAgLy8gV2hlbiBkYiBhc3NldHMgYmUgZGVzdHJveSwgcmVtb3ZlIGFybWF0dXJlIGZyb20gZGIgY2FjaGUuXG4gICAgcmVzZXRBcm1hdHVyZSAodXVpZCkge1xuICAgICAgICBmb3IgKHZhciBhcm1hdHVyZUtleSBpbiB0aGlzLl9hcm1hdHVyZUNhY2hlKSB7XG4gICAgICAgICAgICBpZiAoYXJtYXR1cmVLZXkuaW5kZXhPZih1dWlkKSA9PSAtMSkgY29udGludWU7XG4gICAgICAgICAgICB0aGlzLl9yZW1vdmVBcm1hdHVyZShhcm1hdHVyZUtleSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZ2V0QXJtYXR1cmVDYWNoZSAoYXJtYXR1cmVOYW1lLCBhcm1hdHVyZUtleSwgYXRsYXNVVUlEKSB7XG4gICAgICAgIGxldCBhcm1hdHVyZUluZm8gPSB0aGlzLl9hcm1hdHVyZUNhY2hlW2FybWF0dXJlS2V5XTtcbiAgICAgICAgbGV0IGFybWF0dXJlO1xuICAgICAgICBpZiAoIWFybWF0dXJlSW5mbykge1xuICAgICAgICAgICAgbGV0IGZhY3RvcnkgPSBkcmFnb25Cb25lcy5DQ0ZhY3RvcnkuZ2V0SW5zdGFuY2UoKTtcbiAgICAgICAgICAgIGxldCBwcm94eSA9IGZhY3RvcnkuYnVpbGRBcm1hdHVyZURpc3BsYXkoYXJtYXR1cmVOYW1lLCBhcm1hdHVyZUtleSwgXCJcIiwgYXRsYXNVVUlEKTtcbiAgICAgICAgICAgIGlmICghcHJveHkgfHwgIXByb3h5Ll9hcm1hdHVyZSkgcmV0dXJuO1xuICAgICAgICAgICAgYXJtYXR1cmUgPSBwcm94eS5fYXJtYXR1cmU7XG4gICAgICAgICAgICAvLyBJZiBhcm1hdHVyZSBoYXMgY2hpbGQgYXJtYXR1cmUsIGNhbiBub3QgYmUgY2FjaGUsIGJlY2F1c2UgaXQnc1xuICAgICAgICAgICAgLy8gYW5pbWF0aW9uIGRhdGEgY2FuIG5vdCBiZSBwcmVjb21wdXRlLlxuICAgICAgICAgICAgaWYgKCFBcm1hdHVyZUNhY2hlLmNhbkNhY2hlKGFybWF0dXJlKSkge1xuICAgICAgICAgICAgICAgIGFybWF0dXJlLmRpc3Bvc2UoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2FybWF0dXJlQ2FjaGVbYXJtYXR1cmVLZXldID0ge1xuICAgICAgICAgICAgICAgIGFybWF0dXJlIDogYXJtYXR1cmUsXG4gICAgICAgICAgICAgICAgLy8gQ2FjaGUgYWxsIGtpbmRzIG9mIGFuaW1hdGlvbiBmcmFtZS5cbiAgICAgICAgICAgICAgICAvLyBXaGVuIGFybWF0dXJlIGlzIGRpc3Bvc2UsIGNsZWFyIGFsbCBhbmltYXRpb24gY2FjaGUuXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uc0NhY2hlIDoge30sXG4gICAgICAgICAgICAgICAgY3VyQW5pbWF0aW9uQ2FjaGU6IG51bGwsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXJtYXR1cmUgPSBhcm1hdHVyZUluZm8uYXJtYXR1cmU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFybWF0dXJlO1xuICAgIH0sXG5cbiAgICBnZXRBbmltYXRpb25DYWNoZSAoYXJtYXR1cmVLZXksIGFuaW1hdGlvbk5hbWUpIHtcbiAgICAgICAgbGV0IGFybWF0dXJlSW5mbyA9IHRoaXMuX2FybWF0dXJlQ2FjaGVbYXJtYXR1cmVLZXldO1xuICAgICAgICBpZiAoIWFybWF0dXJlSW5mbykgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgbGV0IGFuaW1hdGlvbnNDYWNoZSA9IGFybWF0dXJlSW5mby5hbmltYXRpb25zQ2FjaGU7XG4gICAgICAgIHJldHVybiBhbmltYXRpb25zQ2FjaGVbYW5pbWF0aW9uTmFtZV07XG4gICAgfSxcblxuICAgIGluaXRBbmltYXRpb25DYWNoZSAoYXJtYXR1cmVLZXksIGFuaW1hdGlvbk5hbWUpIHtcbiAgICAgICAgaWYgKCFhbmltYXRpb25OYW1lKSByZXR1cm4gbnVsbDtcblxuICAgICAgICBsZXQgYXJtYXR1cmVJbmZvID0gdGhpcy5fYXJtYXR1cmVDYWNoZVthcm1hdHVyZUtleV07XG4gICAgICAgIGxldCBhcm1hdHVyZSA9IGFybWF0dXJlSW5mbyAmJiBhcm1hdHVyZUluZm8uYXJtYXR1cmU7XG4gICAgICAgIGlmICghYXJtYXR1cmUpIHJldHVybiBudWxsO1xuICAgICAgICBsZXQgYW5pbWF0aW9uID0gYXJtYXR1cmUuYW5pbWF0aW9uO1xuICAgICAgICBsZXQgaGFzQW5pID0gYW5pbWF0aW9uLmhhc0FuaW1hdGlvbihhbmltYXRpb25OYW1lKTtcbiAgICAgICAgaWYgKCFoYXNBbmkpIHJldHVybiBudWxsO1xuXG4gICAgICAgIGxldCBhbmltYXRpb25zQ2FjaGUgPSBhcm1hdHVyZUluZm8uYW5pbWF0aW9uc0NhY2hlO1xuICAgICAgICBsZXQgYW5pbWF0aW9uQ2FjaGUgPSBhbmltYXRpb25zQ2FjaGVbYW5pbWF0aW9uTmFtZV07XG4gICAgICAgIGlmICghYW5pbWF0aW9uQ2FjaGUpIHtcbiAgICAgICAgICAgIC8vIElmIGNhY2hlIGV4aXN0IGluIHBvb2wsIHRoZW4ganVzdCB1c2UgaXQuXG4gICAgICAgICAgICBsZXQgcG9vbEtleSA9IGFybWF0dXJlS2V5ICsgXCIjXCIgKyBhbmltYXRpb25OYW1lO1xuICAgICAgICAgICAgYW5pbWF0aW9uQ2FjaGUgPSB0aGlzLl9hbmltYXRpb25Qb29sW3Bvb2xLZXldO1xuICAgICAgICAgICAgaWYgKGFuaW1hdGlvbkNhY2hlKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2FuaW1hdGlvblBvb2xbcG9vbEtleV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbkNhY2hlID0gbmV3IEFuaW1hdGlvbkNhY2hlKCk7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uQ2FjaGUuX3ByaXZhdGVNb2RlID0gdGhpcy5fcHJpdmF0ZU1vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhbmltYXRpb25DYWNoZS5pbml0KGFybWF0dXJlSW5mbywgYW5pbWF0aW9uTmFtZSk7XG4gICAgICAgICAgICBhbmltYXRpb25zQ2FjaGVbYW5pbWF0aW9uTmFtZV0gPSBhbmltYXRpb25DYWNoZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYW5pbWF0aW9uQ2FjaGU7XG4gICAgfSxcblxuICAgIGludmFsaWRBbmltYXRpb25DYWNoZSAoYXJtYXR1cmVLZXkpIHtcbiAgICAgICAgbGV0IGFybWF0dXJlSW5mbyA9IHRoaXMuX2FybWF0dXJlQ2FjaGVbYXJtYXR1cmVLZXldO1xuICAgICAgICBsZXQgYXJtYXR1cmUgPSBhcm1hdHVyZUluZm8gJiYgYXJtYXR1cmVJbmZvLmFybWF0dXJlO1xuICAgICAgICBpZiAoIWFybWF0dXJlKSByZXR1cm4gbnVsbDtcblxuICAgICAgICBsZXQgYW5pbWF0aW9uc0NhY2hlID0gYXJtYXR1cmVJbmZvLmFuaW1hdGlvbnNDYWNoZTtcbiAgICAgICAgZm9yICh2YXIgYW5pS2V5IGluIGFuaW1hdGlvbnNDYWNoZSkge1xuICAgICAgICAgICAgbGV0IGFuaW1hdGlvbkNhY2hlID0gYW5pbWF0aW9uc0NhY2hlW2FuaUtleV07XG4gICAgICAgICAgICBhbmltYXRpb25DYWNoZS5pbnZhbGlkQWxsRnJhbWUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB1cGRhdGVBbmltYXRpb25DYWNoZSAoYXJtYXR1cmVLZXksIGFuaW1hdGlvbk5hbWUpIHtcbiAgICAgICAgaWYgKGFuaW1hdGlvbk5hbWUpIHtcbiAgICAgICAgICAgIGxldCBhbmltYXRpb25DYWNoZSA9IHRoaXMuaW5pdEFuaW1hdGlvbkNhY2hlKGFybWF0dXJlS2V5LCBhbmltYXRpb25OYW1lKTtcbiAgICAgICAgICAgIGlmICghYW5pbWF0aW9uQ2FjaGUpIHJldHVybjtcbiAgICAgICAgICAgIGFuaW1hdGlvbkNhY2hlLnVwZGF0ZUFsbEZyYW1lKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgYXJtYXR1cmVJbmZvID0gdGhpcy5fYXJtYXR1cmVDYWNoZVthcm1hdHVyZUtleV07XG4gICAgICAgICAgICBsZXQgYXJtYXR1cmUgPSBhcm1hdHVyZUluZm8gJiYgYXJtYXR1cmVJbmZvLmFybWF0dXJlO1xuICAgICAgICAgICAgaWYgKCFhcm1hdHVyZSkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgICAgIGxldCBhbmltYXRpb25zQ2FjaGUgPSBhcm1hdHVyZUluZm8uYW5pbWF0aW9uc0NhY2hlO1xuICAgICAgICAgICAgZm9yICh2YXIgYW5pS2V5IGluIGFuaW1hdGlvbnNDYWNoZSkge1xuICAgICAgICAgICAgICAgIGxldCBhbmltYXRpb25DYWNoZSA9IGFuaW1hdGlvbnNDYWNoZVthbmlLZXldO1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbkNhY2hlLnVwZGF0ZUFsbEZyYW1lKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxufSk7XG5cbkFybWF0dXJlQ2FjaGUuRnJhbWVUaW1lID0gRnJhbWVUaW1lO1xuQXJtYXR1cmVDYWNoZS5zaGFyZWRDYWNoZSA9IG5ldyBBcm1hdHVyZUNhY2hlKCk7XG5Bcm1hdHVyZUNhY2hlLmNhbkNhY2hlID0gZnVuY3Rpb24gKGFybWF0dXJlKSB7XG4gICAgbGV0IHNsb3RzID0gYXJtYXR1cmUuX3Nsb3RzO1xuICAgIGZvciAobGV0IGkgPSAwLCBsID0gc2xvdHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGxldCBzbG90ID0gc2xvdHNbaV07XG4gICAgICAgIGlmIChzbG90LmNoaWxkQXJtYXR1cmUpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn0sXG5cbm1vZHVsZS5leHBvcnRzID0gQXJtYXR1cmVDYWNoZTsiXX0=