
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extensions/spine/skeleton-cache.js';
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
var TrackEntryListeners = require('./track-entry-listeners');

var spine = require('./lib/spine'); // Permit max cache time, unit is second.


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
var _preFinalColor = null;
var _preDarkColor = null; // x y u v c1 c2

var _perVertexSize = 6; // x y u v r1 g1 b1 a1 r2 g2 b2 a2

var _perClipVertexSize = 12;
var _vfCount = 0,
    _indexCount = 0;

var _tempr, _tempg, _tempb, _tempa;

var _finalColor32, _darkColor32;

var _finalColor = new spine.Color(1, 1, 1, 1);

var _darkColor = new spine.Color(1, 1, 1, 1);

var _quadTriangles = [0, 1, 2, 2, 3, 0]; //Cache all frames in an animation

var AnimationCache = cc.Class({
  ctor: function ctor() {
    this._privateMode = false;
    this._inited = false;
    this._invalid = true;
    this._enableCacheAttachedInfo = false;
    this.frames = [];
    this.totalTime = 0;
    this._frameIdx = -1;
    this.isCompleted = false;
    this._skeletonInfo = null;
    this._animationName = null;
    this._tempSegments = null;
    this._tempColors = null;
    this._tempBoneInfos = null;
  },
  init: function init(skeletonInfo, animationName) {
    this._inited = true;
    this._animationName = animationName;
    this._skeletonInfo = skeletonInfo;
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
  bind: function bind(listener) {
    var completeHandle = function (entry) {
      if (entry && entry.animation.name === this._animationName) {
        this.isCompleted = true;
      }
    }.bind(this);

    listener.complete = completeHandle;
  },
  unbind: function unbind(listener) {
    listener.complete = null;
  },
  begin: function begin() {
    if (!this._invalid) return;
    var skeletonInfo = this._skeletonInfo;
    var preAnimationCache = skeletonInfo.curAnimationCache;

    if (preAnimationCache && preAnimationCache !== this) {
      if (this._privateMode) {
        // Private cache mode just invalid pre animation frame.
        preAnimationCache.invalidAllFrame();
      } else {
        // If pre animation not finished, play it to the end.
        preAnimationCache.updateToFrame();
      }
    }

    var skeleton = skeletonInfo.skeleton;
    var listener = skeletonInfo.listener;
    var state = skeletonInfo.state;
    var animation = skeleton.data.findAnimation(this._animationName);
    state.setAnimationWith(0, animation, false);
    this.bind(listener); // record cur animation cache

    skeletonInfo.curAnimationCache = this;
    this._frameIdx = -1;
    this.isCompleted = false;
    this.totalTime = 0;
    this._invalid = false;
  },
  end: function end() {
    if (!this._needToUpdate()) {
      // clear cur animation cache
      this._skeletonInfo.curAnimationCache = null;
      this.frames.length = this._frameIdx + 1;
      this.isCompleted = true;
      this.unbind(this._skeletonInfo.listener);
    }
  },
  _needToUpdate: function _needToUpdate(toFrameIdx) {
    return !this.isCompleted && this.totalTime < MaxCacheTime && (toFrameIdx == undefined || this._frameIdx < toFrameIdx);
  },
  updateToFrame: function updateToFrame(toFrameIdx) {
    if (!this._inited) return;
    this.begin();
    if (!this._needToUpdate(toFrameIdx)) return;
    var skeletonInfo = this._skeletonInfo;
    var skeleton = skeletonInfo.skeleton;
    var clipper = skeletonInfo.clipper;
    var state = skeletonInfo.state;

    do {
      // Solid update frame rate 1/60.
      skeleton.update(FrameTime);
      state.update(FrameTime);
      state.apply(skeleton);
      skeleton.updateWorldTransform();
      this._frameIdx++;

      this._updateFrame(skeleton, clipper, this._frameIdx);

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
  _updateFrame: function _updateFrame(skeleton, clipper, index) {
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
    _preFinalColor = null;
    _preDarkColor = null;
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

    this._traverseSkeleton(skeleton, clipper);

    if (_colorOffset > 0) {
      colors[_colorOffset - 1].vfOffset = _vfOffset;
    }

    colors.length = _colorOffset;
    boneInfos.length = _boneInfoOffset; // Handle pre segment.

    var preSegOffset = _segOffset - 1;

    if (preSegOffset >= 0) {
      // Judge segment vertex count is not empty.
      if (_segICount > 0) {
        var preSegInfo = segments[preSegOffset];
        preSegInfo.indexCount = _segICount;
        preSegInfo.vfCount = _segVCount * _perVertexSize;
        preSegInfo.vertexCount = _segVCount;
        segments.length = _segOffset;
      } else {
        // Discard pre segment.
        segments.length = _segOffset - 1;
      }
    } // Segments is empty,discard all segments.


    if (segments.length == 0) return; // Fill vertices

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

      uintVert[i++] = _vertices[j++]; // color1

      uintVert[i++] = _vertices[j++]; // color2
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
  fillVertices: function fillVertices(skeletonColor, attachmentColor, slotColor, clipper, slot) {
    _tempa = slotColor.a * attachmentColor.a * skeletonColor.a * 255;
    _tempr = attachmentColor.r * skeletonColor.r * 255;
    _tempg = attachmentColor.g * skeletonColor.g * 255;
    _tempb = attachmentColor.b * skeletonColor.b * 255;
    _finalColor.r = _tempr * slotColor.r;
    _finalColor.g = _tempg * slotColor.g;
    _finalColor.b = _tempb * slotColor.b;
    _finalColor.a = _tempa;

    if (slot.darkColor == null) {
      _darkColor.set(0.0, 0, 0, 1.0);
    } else {
      _darkColor.r = slot.darkColor.r * _tempr;
      _darkColor.g = slot.darkColor.g * _tempg;
      _darkColor.b = slot.darkColor.b * _tempb;
    }

    _darkColor.a = 0;
    _finalColor32 = (_finalColor.a << 24 >>> 0) + (_finalColor.b << 16) + (_finalColor.g << 8) + _finalColor.r;
    _darkColor32 = (_darkColor.a << 24 >>> 0) + (_darkColor.b << 16) + (_darkColor.g << 8) + _darkColor.r;

    if (_preFinalColor !== _finalColor32 || _preDarkColor !== _darkColor32) {
      var colors = this._tempColors;
      _preFinalColor = _finalColor32;
      _preDarkColor = _darkColor32;

      if (_colorOffset > 0) {
        colors[_colorOffset - 1].vfOffset = _vfOffset;
      }

      colors[_colorOffset++] = {
        fr: _finalColor.r,
        fg: _finalColor.g,
        fb: _finalColor.b,
        fa: _finalColor.a,
        dr: _darkColor.r,
        dg: _darkColor.g,
        db: _darkColor.b,
        da: _darkColor.a,
        vfOffset: 0
      };
    }

    if (!clipper.isClipping()) {
      for (var v = _vfOffset, n = _vfOffset + _vfCount; v < n; v += _perVertexSize) {
        _vertices[v + 4] = _finalColor32; // light color

        _vertices[v + 5] = _darkColor32; // dark color
      }
    } else {
      clipper.clipTriangles(_vertices, _vfCount, _indices, _indexCount, _vertices, _finalColor, _darkColor, true, _perVertexSize, _indexOffset, _vfOffset, _vfOffset + 2);
      var clippedVertices = clipper.clippedVertices;
      var clippedTriangles = clipper.clippedTriangles; // insure capacity

      _indexCount = clippedTriangles.length;
      _vfCount = clippedVertices.length / _perClipVertexSize * _perVertexSize; // fill indices

      for (var ii = 0, jj = _indexOffset, nn = clippedTriangles.length; ii < nn;) {
        _indices[jj++] = clippedTriangles[ii++];
      } // fill vertices contain x y u v light color dark color


      for (var _v = 0, _n = clippedVertices.length, offset = _vfOffset; _v < _n; _v += 12, offset += _perVertexSize) {
        _vertices[offset] = clippedVertices[_v]; // x

        _vertices[offset + 1] = clippedVertices[_v + 1]; // y

        _vertices[offset + 2] = clippedVertices[_v + 6]; // u

        _vertices[offset + 3] = clippedVertices[_v + 7]; // v

        _vertices[offset + 4] = _finalColor32;
        _vertices[offset + 5] = _darkColor32;
      }
    }
  },
  _traverseSkeleton: function _traverseSkeleton(skeleton, clipper) {
    var segments = this._tempSegments;
    var boneInfos = this._tempBoneInfos;
    var skeletonColor = skeleton.color;
    var attachment, attachmentColor, slotColor, uvs, triangles;
    var isRegion, isMesh, isClip;
    var texture;
    var preSegOffset, preSegInfo;
    var blendMode;
    var slot;
    var bones = skeleton.bones;

    if (this._enableCacheAttachedInfo) {
      for (var i = 0, l = bones.length; i < l; i++, _boneInfoOffset++) {
        var bone = bones[i];
        var boneInfo = boneInfos[_boneInfoOffset];

        if (!boneInfo) {
          boneInfo = boneInfos[_boneInfoOffset] = {};
        }

        boneInfo.a = bone.a;
        boneInfo.b = bone.b;
        boneInfo.c = bone.c;
        boneInfo.d = bone.d;
        boneInfo.worldX = bone.worldX;
        boneInfo.worldY = bone.worldY;
      }
    }

    for (var slotIdx = 0, slotCount = skeleton.drawOrder.length; slotIdx < slotCount; slotIdx++) {
      slot = skeleton.drawOrder[slotIdx];
      _vfCount = 0;
      _indexCount = 0;
      attachment = slot.getAttachment();

      if (!attachment) {
        clipper.clipEndWithSlot(slot);
        continue;
      }

      isRegion = attachment instanceof spine.RegionAttachment;
      isMesh = attachment instanceof spine.MeshAttachment;
      isClip = attachment instanceof spine.ClippingAttachment;

      if (isClip) {
        clipper.clipStart(slot, attachment);
        continue;
      }

      if (!isRegion && !isMesh) {
        clipper.clipEndWithSlot(slot);
        continue;
      }

      texture = attachment.region.texture._texture;

      if (!texture) {
        clipper.clipEndWithSlot(slot);
        continue;
      }

      blendMode = slot.data.blendMode;

      if (_preTexUrl !== texture.url || _preBlendMode !== blendMode) {
        _preTexUrl = texture.url;
        _preBlendMode = blendMode; // Handle pre segment.

        preSegOffset = _segOffset - 1;

        if (preSegOffset >= 0) {
          if (_segICount > 0) {
            preSegInfo = segments[preSegOffset];
            preSegInfo.indexCount = _segICount;
            preSegInfo.vertexCount = _segVCount;
            preSegInfo.vfCount = _segVCount * _perVertexSize;
          } else {
            // Discard pre segment.
            _segOffset--;
          }
        } // Handle now segment.


        segments[_segOffset] = {
          tex: texture,
          blendMode: blendMode,
          indexCount: 0,
          vertexCount: 0,
          vfCount: 0
        };
        _segOffset++;
        _segICount = 0;
        _segVCount = 0;
      }

      if (isRegion) {
        triangles = _quadTriangles; // insure capacity

        _vfCount = 4 * _perVertexSize;
        _indexCount = 6; // compute vertex and fill x y

        attachment.computeWorldVertices(slot.bone, _vertices, _vfOffset, _perVertexSize);
      } else if (isMesh) {
        triangles = attachment.triangles; // insure capacity

        _vfCount = (attachment.worldVerticesLength >> 1) * _perVertexSize;
        _indexCount = triangles.length; // compute vertex and fill x y

        attachment.computeWorldVertices(slot, 0, attachment.worldVerticesLength, _vertices, _vfOffset, _perVertexSize);
      }

      if (_vfCount == 0 || _indexCount == 0) {
        clipper.clipEndWithSlot(slot);
        continue;
      } // fill indices


      for (var ii = 0, jj = _indexOffset, nn = triangles.length; ii < nn;) {
        _indices[jj++] = triangles[ii++];
      } // fill u v


      uvs = attachment.uvs;

      for (var v = _vfOffset, n = _vfOffset + _vfCount, u = 0; v < n; v += _perVertexSize, u += 2) {
        _vertices[v + 2] = uvs[u]; // u

        _vertices[v + 3] = uvs[u + 1]; // v
      }

      attachmentColor = attachment.color;
      slotColor = slot.color;
      this.fillVertices(skeletonColor, attachmentColor, slotColor, clipper, slot);

      if (_indexCount > 0) {
        for (var _ii = _indexOffset, _nn = _indexOffset + _indexCount; _ii < _nn; _ii++) {
          _indices[_ii] += _segVCount;
        }

        _indexOffset += _indexCount;
        _vfOffset += _vfCount;
        _vertexOffset = _vfOffset / _perVertexSize;
        _segICount += _indexCount;
        _segVCount += _vfCount / _perVertexSize;
      }

      clipper.clipEndWithSlot(slot);
    }

    clipper.clipEnd();
  }
});
var SkeletonCache = cc.Class({
  ctor: function ctor() {
    this._privateMode = false;
    this._animationPool = {};
    this._skeletonCache = {};
  },
  enablePrivateMode: function enablePrivateMode() {
    this._privateMode = true;
  },
  clear: function clear() {
    this._animationPool = {};
    this._skeletonCache = {};
  },
  removeSkeleton: function removeSkeleton(uuid) {
    var skeletonInfo = this._skeletonCache[uuid];
    if (!skeletonInfo) return;
    var animationsCache = skeletonInfo.animationsCache;

    for (var aniKey in animationsCache) {
      // Clear cache texture, and put cache into pool.
      // No need to create TypedArray next time.
      var animationCache = animationsCache[aniKey];
      if (!animationCache) continue;
      this._animationPool[uuid + "#" + aniKey] = animationCache;
      animationCache.clear();
    }

    delete this._skeletonCache[uuid];
  },
  getSkeletonCache: function getSkeletonCache(uuid, skeletonData) {
    var skeletonInfo = this._skeletonCache[uuid];

    if (!skeletonInfo) {
      var skeleton = new spine.Skeleton(skeletonData);
      var clipper = new spine.SkeletonClipping();
      var stateData = new spine.AnimationStateData(skeleton.data);
      var state = new spine.AnimationState(stateData);
      var listener = new TrackEntryListeners();
      state.addListener(listener);
      this._skeletonCache[uuid] = skeletonInfo = {
        skeleton: skeleton,
        clipper: clipper,
        state: state,
        listener: listener,
        // Cache all kinds of animation frame.
        // When skeleton is dispose, clear all animation cache.
        animationsCache: {},
        curAnimationCache: null
      };
    }

    return skeletonInfo;
  },
  getAnimationCache: function getAnimationCache(uuid, animationName) {
    var skeletonInfo = this._skeletonCache[uuid];
    if (!skeletonInfo) return null;
    var animationsCache = skeletonInfo.animationsCache;
    return animationsCache[animationName];
  },
  invalidAnimationCache: function invalidAnimationCache(uuid) {
    var skeletonInfo = this._skeletonCache[uuid];
    var skeleton = skeletonInfo && skeletonInfo.skeleton;
    if (!skeleton) return;
    var animationsCache = skeletonInfo.animationsCache;

    for (var aniKey in animationsCache) {
      var animationCache = animationsCache[aniKey];
      animationCache.invalidAllFrame();
    }
  },
  initAnimationCache: function initAnimationCache(uuid, animationName) {
    if (!animationName) return null;
    var skeletonInfo = this._skeletonCache[uuid];
    var skeleton = skeletonInfo && skeletonInfo.skeleton;
    if (!skeleton) return null;
    var animation = skeleton.data.findAnimation(animationName);

    if (!animation) {
      return null;
    }

    var animationsCache = skeletonInfo.animationsCache;
    var animationCache = animationsCache[animationName];

    if (!animationCache) {
      // If cache exist in pool, then just use it.
      var poolKey = uuid + "#" + animationName;
      animationCache = this._animationPool[poolKey];

      if (animationCache) {
        delete this._animationPool[poolKey];
      } else {
        animationCache = new AnimationCache();
        animationCache._privateMode = this._privateMode;
      }

      animationCache.init(skeletonInfo, animationName);
      animationsCache[animationName] = animationCache;
    }

    return animationCache;
  },
  updateAnimationCache: function updateAnimationCache(uuid, animationName) {
    if (animationName) {
      var animationCache = this.initAnimationCache(uuid, animationName);
      if (!animationCache) return null;
      animationCache.updateAllFrame();
    } else {
      var skeletonInfo = this._skeletonCache[uuid];
      var skeleton = skeletonInfo && skeletonInfo.skeleton;
      if (!skeleton) return;
      var animationsCache = skeletonInfo.animationsCache;

      for (var aniKey in animationsCache) {
        var _animationCache = animationsCache[aniKey];

        _animationCache.updateAllFrame();
      }
    }
  }
});
SkeletonCache.FrameTime = FrameTime;
SkeletonCache.sharedCache = new SkeletonCache();
module.exports = SkeletonCache;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNrZWxldG9uLWNhY2hlLmpzIl0sIm5hbWVzIjpbIlRyYWNrRW50cnlMaXN0ZW5lcnMiLCJyZXF1aXJlIiwic3BpbmUiLCJNYXhDYWNoZVRpbWUiLCJGcmFtZVRpbWUiLCJfdmVydGljZXMiLCJfaW5kaWNlcyIsIl9ib25lSW5mb09mZnNldCIsIl92ZXJ0ZXhPZmZzZXQiLCJfaW5kZXhPZmZzZXQiLCJfdmZPZmZzZXQiLCJfcHJlVGV4VXJsIiwiX3ByZUJsZW5kTW9kZSIsIl9zZWdWQ291bnQiLCJfc2VnSUNvdW50IiwiX3NlZ09mZnNldCIsIl9jb2xvck9mZnNldCIsIl9wcmVGaW5hbENvbG9yIiwiX3ByZURhcmtDb2xvciIsIl9wZXJWZXJ0ZXhTaXplIiwiX3BlckNsaXBWZXJ0ZXhTaXplIiwiX3ZmQ291bnQiLCJfaW5kZXhDb3VudCIsIl90ZW1wciIsIl90ZW1wZyIsIl90ZW1wYiIsIl90ZW1wYSIsIl9maW5hbENvbG9yMzIiLCJfZGFya0NvbG9yMzIiLCJfZmluYWxDb2xvciIsIkNvbG9yIiwiX2RhcmtDb2xvciIsIl9xdWFkVHJpYW5nbGVzIiwiQW5pbWF0aW9uQ2FjaGUiLCJjYyIsIkNsYXNzIiwiY3RvciIsIl9wcml2YXRlTW9kZSIsIl9pbml0ZWQiLCJfaW52YWxpZCIsIl9lbmFibGVDYWNoZUF0dGFjaGVkSW5mbyIsImZyYW1lcyIsInRvdGFsVGltZSIsIl9mcmFtZUlkeCIsImlzQ29tcGxldGVkIiwiX3NrZWxldG9uSW5mbyIsIl9hbmltYXRpb25OYW1lIiwiX3RlbXBTZWdtZW50cyIsIl90ZW1wQ29sb3JzIiwiX3RlbXBCb25lSW5mb3MiLCJpbml0Iiwic2tlbGV0b25JbmZvIiwiYW5pbWF0aW9uTmFtZSIsImNsZWFyIiwiaSIsIm4iLCJsZW5ndGgiLCJmcmFtZSIsInNlZ21lbnRzIiwiaW52YWxpZEFsbEZyYW1lIiwiYmluZCIsImxpc3RlbmVyIiwiY29tcGxldGVIYW5kbGUiLCJlbnRyeSIsImFuaW1hdGlvbiIsIm5hbWUiLCJjb21wbGV0ZSIsInVuYmluZCIsImJlZ2luIiwicHJlQW5pbWF0aW9uQ2FjaGUiLCJjdXJBbmltYXRpb25DYWNoZSIsInVwZGF0ZVRvRnJhbWUiLCJza2VsZXRvbiIsInN0YXRlIiwiZGF0YSIsImZpbmRBbmltYXRpb24iLCJzZXRBbmltYXRpb25XaXRoIiwiZW5kIiwiX25lZWRUb1VwZGF0ZSIsInRvRnJhbWVJZHgiLCJ1bmRlZmluZWQiLCJjbGlwcGVyIiwidXBkYXRlIiwiYXBwbHkiLCJ1cGRhdGVXb3JsZFRyYW5zZm9ybSIsIl91cGRhdGVGcmFtZSIsImlzSW5pdGVkIiwiaXNJbnZhbGlkIiwidXBkYXRlQWxsRnJhbWUiLCJlbmFibGVDYWNoZUF0dGFjaGVkSW5mbyIsImluZGV4IiwiY29sb3JzIiwiYm9uZUluZm9zIiwidmVydGljZXMiLCJ1aW50VmVydCIsImluZGljZXMiLCJfdHJhdmVyc2VTa2VsZXRvbiIsInZmT2Zmc2V0IiwicHJlU2VnT2Zmc2V0IiwicHJlU2VnSW5mbyIsImluZGV4Q291bnQiLCJ2ZkNvdW50IiwidmVydGV4Q291bnQiLCJGbG9hdDMyQXJyYXkiLCJVaW50MzJBcnJheSIsImJ1ZmZlciIsImoiLCJVaW50MTZBcnJheSIsImZpbGxWZXJ0aWNlcyIsInNrZWxldG9uQ29sb3IiLCJhdHRhY2htZW50Q29sb3IiLCJzbG90Q29sb3IiLCJzbG90IiwiYSIsInIiLCJnIiwiYiIsImRhcmtDb2xvciIsInNldCIsImZyIiwiZmciLCJmYiIsImZhIiwiZHIiLCJkZyIsImRiIiwiZGEiLCJpc0NsaXBwaW5nIiwidiIsImNsaXBUcmlhbmdsZXMiLCJjbGlwcGVkVmVydGljZXMiLCJjbGlwcGVkVHJpYW5nbGVzIiwiaWkiLCJqaiIsIm5uIiwib2Zmc2V0IiwiY29sb3IiLCJhdHRhY2htZW50IiwidXZzIiwidHJpYW5nbGVzIiwiaXNSZWdpb24iLCJpc01lc2giLCJpc0NsaXAiLCJ0ZXh0dXJlIiwiYmxlbmRNb2RlIiwiYm9uZXMiLCJsIiwiYm9uZSIsImJvbmVJbmZvIiwiYyIsImQiLCJ3b3JsZFgiLCJ3b3JsZFkiLCJzbG90SWR4Iiwic2xvdENvdW50IiwiZHJhd09yZGVyIiwiZ2V0QXR0YWNobWVudCIsImNsaXBFbmRXaXRoU2xvdCIsIlJlZ2lvbkF0dGFjaG1lbnQiLCJNZXNoQXR0YWNobWVudCIsIkNsaXBwaW5nQXR0YWNobWVudCIsImNsaXBTdGFydCIsInJlZ2lvbiIsIl90ZXh0dXJlIiwidXJsIiwidGV4IiwiY29tcHV0ZVdvcmxkVmVydGljZXMiLCJ3b3JsZFZlcnRpY2VzTGVuZ3RoIiwidSIsImNsaXBFbmQiLCJTa2VsZXRvbkNhY2hlIiwiX2FuaW1hdGlvblBvb2wiLCJfc2tlbGV0b25DYWNoZSIsImVuYWJsZVByaXZhdGVNb2RlIiwicmVtb3ZlU2tlbGV0b24iLCJ1dWlkIiwiYW5pbWF0aW9uc0NhY2hlIiwiYW5pS2V5IiwiYW5pbWF0aW9uQ2FjaGUiLCJnZXRTa2VsZXRvbkNhY2hlIiwic2tlbGV0b25EYXRhIiwiU2tlbGV0b24iLCJTa2VsZXRvbkNsaXBwaW5nIiwic3RhdGVEYXRhIiwiQW5pbWF0aW9uU3RhdGVEYXRhIiwiQW5pbWF0aW9uU3RhdGUiLCJhZGRMaXN0ZW5lciIsImdldEFuaW1hdGlvbkNhY2hlIiwiaW52YWxpZEFuaW1hdGlvbkNhY2hlIiwiaW5pdEFuaW1hdGlvbkNhY2hlIiwicG9vbEtleSIsInVwZGF0ZUFuaW1hdGlvbkNhY2hlIiwic2hhcmVkQ2FjaGUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCQSxJQUFNQSxtQkFBbUIsR0FBR0MsT0FBTyxDQUFDLHlCQUFELENBQW5DOztBQUNBLElBQU1DLEtBQUssR0FBR0QsT0FBTyxDQUFDLGFBQUQsQ0FBckIsRUFDQTs7O0FBQ0EsSUFBTUUsWUFBWSxHQUFHLEVBQXJCO0FBQ0EsSUFBTUMsU0FBUyxHQUFHLElBQUksRUFBdEI7QUFFQSxJQUFJQyxTQUFTLEdBQUcsRUFBaEI7QUFDQSxJQUFJQyxRQUFRLEdBQUcsRUFBZjtB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dCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbmNvbnN0IFRyYWNrRW50cnlMaXN0ZW5lcnMgPSByZXF1aXJlKCcuL3RyYWNrLWVudHJ5LWxpc3RlbmVycycpO1xuY29uc3Qgc3BpbmUgPSByZXF1aXJlKCcuL2xpYi9zcGluZScpO1xuLy8gUGVybWl0IG1heCBjYWNoZSB0aW1lLCB1bml0IGlzIHNlY29uZC5cbmNvbnN0IE1heENhY2hlVGltZSA9IDMwO1xuY29uc3QgRnJhbWVUaW1lID0gMSAvIDYwO1xuXG5sZXQgX3ZlcnRpY2VzID0gW107XG5sZXQgX2luZGljZXMgPSBbXTtcbmxldCBfYm9uZUluZm9PZmZzZXQgPSAwO1xubGV0IF92ZXJ0ZXhPZmZzZXQgPSAwO1xubGV0IF9pbmRleE9mZnNldCA9IDA7XG5sZXQgX3ZmT2Zmc2V0ID0gMDtcbmxldCBfcHJlVGV4VXJsID0gbnVsbDtcbmxldCBfcHJlQmxlbmRNb2RlID0gbnVsbDtcbmxldCBfc2VnVkNvdW50ID0gMDtcbmxldCBfc2VnSUNvdW50ID0gMDtcbmxldCBfc2VnT2Zmc2V0ID0gMDtcbmxldCBfY29sb3JPZmZzZXQgPSAwO1xubGV0IF9wcmVGaW5hbENvbG9yID0gbnVsbDtcbmxldCBfcHJlRGFya0NvbG9yID0gbnVsbDtcbi8vIHggeSB1IHYgYzEgYzJcbmxldCBfcGVyVmVydGV4U2l6ZSA9IDY7XG4vLyB4IHkgdSB2IHIxIGcxIGIxIGExIHIyIGcyIGIyIGEyXG5sZXQgX3BlckNsaXBWZXJ0ZXhTaXplID0gMTI7XG5sZXQgX3ZmQ291bnQgPSAwLCBfaW5kZXhDb3VudCA9IDA7XG5sZXQgX3RlbXByLCBfdGVtcGcsIF90ZW1wYiwgX3RlbXBhO1xubGV0IF9maW5hbENvbG9yMzIsIF9kYXJrQ29sb3IzMjtcbmxldCBfZmluYWxDb2xvciA9IG5ldyBzcGluZS5Db2xvcigxLCAxLCAxLCAxKTtcbmxldCBfZGFya0NvbG9yID0gbmV3IHNwaW5lLkNvbG9yKDEsIDEsIDEsIDEpO1xubGV0IF9xdWFkVHJpYW5nbGVzID0gWzAsIDEsIDIsIDIsIDMsIDBdO1xuXG4vL0NhY2hlIGFsbCBmcmFtZXMgaW4gYW4gYW5pbWF0aW9uXG5sZXQgQW5pbWF0aW9uQ2FjaGUgPSBjYy5DbGFzcyh7XG4gICAgY3RvciAoKSB7XG4gICAgICAgIHRoaXMuX3ByaXZhdGVNb2RlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2luaXRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pbnZhbGlkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fZW5hYmxlQ2FjaGVBdHRhY2hlZEluZm8gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5mcmFtZXMgPSBbXTtcbiAgICAgICAgdGhpcy50b3RhbFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9mcmFtZUlkeCA9IC0xO1xuICAgICAgICB0aGlzLmlzQ29tcGxldGVkID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5fc2tlbGV0b25JbmZvID0gbnVsbDtcbiAgICAgICAgdGhpcy5fYW5pbWF0aW9uTmFtZSA9IG51bGw7XG4gICAgICAgIHRoaXMuX3RlbXBTZWdtZW50cyA9IG51bGw7XG4gICAgICAgIHRoaXMuX3RlbXBDb2xvcnMgPSBudWxsO1xuICAgICAgICB0aGlzLl90ZW1wQm9uZUluZm9zID0gbnVsbDtcbiAgICB9LFxuXG4gICAgaW5pdCAoc2tlbGV0b25JbmZvLCBhbmltYXRpb25OYW1lKSB7XG4gICAgICAgIHRoaXMuX2luaXRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX2FuaW1hdGlvbk5hbWUgPSBhbmltYXRpb25OYW1lO1xuICAgICAgICB0aGlzLl9za2VsZXRvbkluZm8gPSBza2VsZXRvbkluZm87XG4gICAgfSxcblxuICAgIC8vIENsZWFyIHRleHR1cmUgcXVvdGUuXG4gICAgY2xlYXIgKCkge1xuICAgICAgICB0aGlzLl9pbml0ZWQgPSBmYWxzZTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIG4gPSB0aGlzLmZyYW1lcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBmcmFtZSA9IHRoaXMuZnJhbWVzW2ldO1xuICAgICAgICAgICAgZnJhbWUuc2VnbWVudHMubGVuZ3RoID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmludmFsaWRBbGxGcmFtZSgpO1xuICAgIH0sXG5cbiAgICBiaW5kIChsaXN0ZW5lcikge1xuICAgICAgICBsZXQgY29tcGxldGVIYW5kbGUgPSBmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgICAgICAgIGlmIChlbnRyeSAmJiBlbnRyeS5hbmltYXRpb24ubmFtZSA9PT0gdGhpcy5fYW5pbWF0aW9uTmFtZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNDb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgICAgbGlzdGVuZXIuY29tcGxldGUgPSBjb21wbGV0ZUhhbmRsZTtcbiAgICB9LFxuXG4gICAgdW5iaW5kIChsaXN0ZW5lcikge1xuICAgICAgICBsaXN0ZW5lci5jb21wbGV0ZSA9IG51bGw7XG4gICAgfSxcblxuICAgIGJlZ2luICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pbnZhbGlkKSByZXR1cm47XG5cbiAgICAgICAgbGV0IHNrZWxldG9uSW5mbyA9IHRoaXMuX3NrZWxldG9uSW5mbztcbiAgICAgICAgbGV0IHByZUFuaW1hdGlvbkNhY2hlID0gc2tlbGV0b25JbmZvLmN1ckFuaW1hdGlvbkNhY2hlO1xuICAgICAgICBcbiAgICAgICAgaWYgKHByZUFuaW1hdGlvbkNhY2hlICYmIHByZUFuaW1hdGlvbkNhY2hlICE9PSB0aGlzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fcHJpdmF0ZU1vZGUpIHtcbiAgICAgICAgICAgICAgICAvLyBQcml2YXRlIGNhY2hlIG1vZGUganVzdCBpbnZhbGlkIHByZSBhbmltYXRpb24gZnJhbWUuXG4gICAgICAgICAgICAgICAgcHJlQW5pbWF0aW9uQ2FjaGUuaW52YWxpZEFsbEZyYW1lKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIElmIHByZSBhbmltYXRpb24gbm90IGZpbmlzaGVkLCBwbGF5IGl0IHRvIHRoZSBlbmQuXG4gICAgICAgICAgICAgICAgcHJlQW5pbWF0aW9uQ2FjaGUudXBkYXRlVG9GcmFtZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNrZWxldG9uID0gc2tlbGV0b25JbmZvLnNrZWxldG9uO1xuICAgICAgICBsZXQgbGlzdGVuZXIgPSBza2VsZXRvbkluZm8ubGlzdGVuZXI7XG4gICAgICAgIGxldCBzdGF0ZSA9IHNrZWxldG9uSW5mby5zdGF0ZTtcblxuICAgICAgICBsZXQgYW5pbWF0aW9uID0gc2tlbGV0b24uZGF0YS5maW5kQW5pbWF0aW9uKHRoaXMuX2FuaW1hdGlvbk5hbWUpO1xuICAgICAgICBzdGF0ZS5zZXRBbmltYXRpb25XaXRoKDAsIGFuaW1hdGlvbiwgZmFsc2UpO1xuICAgICAgICB0aGlzLmJpbmQobGlzdGVuZXIpO1xuXG4gICAgICAgIC8vIHJlY29yZCBjdXIgYW5pbWF0aW9uIGNhY2hlXG4gICAgICAgIHNrZWxldG9uSW5mby5jdXJBbmltYXRpb25DYWNoZSA9IHRoaXM7XG4gICAgICAgIHRoaXMuX2ZyYW1lSWR4ID0gLTE7XG4gICAgICAgIHRoaXMuaXNDb21wbGV0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy50b3RhbFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9pbnZhbGlkID0gZmFsc2U7XG4gICAgfSxcblxuICAgIGVuZCAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fbmVlZFRvVXBkYXRlKCkpIHtcbiAgICAgICAgICAgIC8vIGNsZWFyIGN1ciBhbmltYXRpb24gY2FjaGVcbiAgICAgICAgICAgIHRoaXMuX3NrZWxldG9uSW5mby5jdXJBbmltYXRpb25DYWNoZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmZyYW1lcy5sZW5ndGggPSB0aGlzLl9mcmFtZUlkeCArIDE7XG4gICAgICAgICAgICB0aGlzLmlzQ29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMudW5iaW5kKHRoaXMuX3NrZWxldG9uSW5mby5saXN0ZW5lcik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX25lZWRUb1VwZGF0ZSAodG9GcmFtZUlkeCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuaXNDb21wbGV0ZWQgJiYgXG4gICAgICAgICAgICAgICAgdGhpcy50b3RhbFRpbWUgPCBNYXhDYWNoZVRpbWUgJiYgXG4gICAgICAgICAgICAgICAgKHRvRnJhbWVJZHggPT0gdW5kZWZpbmVkIHx8IHRoaXMuX2ZyYW1lSWR4IDwgdG9GcmFtZUlkeCk7XG4gICAgfSxcblxuICAgIHVwZGF0ZVRvRnJhbWUgKHRvRnJhbWVJZHgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pbml0ZWQpIHJldHVybjtcblxuICAgICAgICB0aGlzLmJlZ2luKCk7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9uZWVkVG9VcGRhdGUodG9GcmFtZUlkeCkpIHJldHVybjtcblxuICAgICAgICBsZXQgc2tlbGV0b25JbmZvID0gdGhpcy5fc2tlbGV0b25JbmZvO1xuICAgICAgICBsZXQgc2tlbGV0b24gPSBza2VsZXRvbkluZm8uc2tlbGV0b247XG4gICAgICAgIGxldCBjbGlwcGVyID0gc2tlbGV0b25JbmZvLmNsaXBwZXI7XG4gICAgICAgIGxldCBzdGF0ZSA9IHNrZWxldG9uSW5mby5zdGF0ZTtcblxuICAgICAgICBkbyB7XG4gICAgICAgICAgICAvLyBTb2xpZCB1cGRhdGUgZnJhbWUgcmF0ZSAxLzYwLlxuICAgICAgICAgICAgc2tlbGV0b24udXBkYXRlKEZyYW1lVGltZSk7XG4gICAgICAgICAgICBzdGF0ZS51cGRhdGUoRnJhbWVUaW1lKTtcbiAgICAgICAgICAgIHN0YXRlLmFwcGx5KHNrZWxldG9uKTtcbiAgICAgICAgICAgIHNrZWxldG9uLnVwZGF0ZVdvcmxkVHJhbnNmb3JtKCk7XG4gICAgICAgICAgICB0aGlzLl9mcmFtZUlkeCsrO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlRnJhbWUoc2tlbGV0b24sIGNsaXBwZXIsIHRoaXMuX2ZyYW1lSWR4KTtcbiAgICAgICAgICAgIHRoaXMudG90YWxUaW1lICs9IEZyYW1lVGltZTtcbiAgICAgICAgfSB3aGlsZSAodGhpcy5fbmVlZFRvVXBkYXRlKHRvRnJhbWVJZHgpKTtcblxuICAgICAgICB0aGlzLmVuZCgpO1xuICAgIH0sXG5cbiAgICBpc0luaXRlZCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbml0ZWQ7XG4gICAgfSxcblxuICAgIGlzSW52YWxpZCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZhbGlkO1xuICAgIH0sXG5cbiAgICBpbnZhbGlkQWxsRnJhbWUgKCkge1xuICAgICAgICB0aGlzLmlzQ29tcGxldGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2ludmFsaWQgPSB0cnVlO1xuICAgIH0sXG5cbiAgICB1cGRhdGVBbGxGcmFtZSAoKSB7XG4gICAgICAgIHRoaXMuaW52YWxpZEFsbEZyYW1lKCk7XG4gICAgICAgIHRoaXMudXBkYXRlVG9GcmFtZSgpO1xuICAgIH0sXG5cbiAgICBlbmFibGVDYWNoZUF0dGFjaGVkSW5mbyAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fZW5hYmxlQ2FjaGVBdHRhY2hlZEluZm8pIHtcbiAgICAgICAgICAgIHRoaXMuX2VuYWJsZUNhY2hlQXR0YWNoZWRJbmZvID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuaW52YWxpZEFsbEZyYW1lKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3VwZGF0ZUZyYW1lIChza2VsZXRvbiwgY2xpcHBlciwgaW5kZXgpIHtcbiAgICAgICAgX3ZmT2Zmc2V0ID0gMDtcbiAgICAgICAgX2JvbmVJbmZvT2Zmc2V0ID0gMDtcbiAgICAgICAgX2luZGV4T2Zmc2V0ID0gMDtcbiAgICAgICAgX3ZlcnRleE9mZnNldCA9IDA7XG4gICAgICAgIF9wcmVUZXhVcmwgPSBudWxsO1xuICAgICAgICBfcHJlQmxlbmRNb2RlID0gbnVsbDtcbiAgICAgICAgX3NlZ1ZDb3VudCA9IDA7XG4gICAgICAgIF9zZWdJQ291bnQgPSAwO1xuICAgICAgICBfc2VnT2Zmc2V0ID0gMDtcbiAgICAgICAgX2NvbG9yT2Zmc2V0ID0gMDtcbiAgICAgICAgX3ByZUZpbmFsQ29sb3IgPSBudWxsO1xuICAgICAgICBfcHJlRGFya0NvbG9yID0gbnVsbDtcblxuICAgICAgICB0aGlzLmZyYW1lc1tpbmRleF0gPSB0aGlzLmZyYW1lc1tpbmRleF0gfHwge1xuICAgICAgICAgICAgc2VnbWVudHMgOiBbXSxcbiAgICAgICAgICAgIGNvbG9ycyA6IFtdLFxuICAgICAgICAgICAgYm9uZUluZm9zIDogW10sXG4gICAgICAgICAgICB2ZXJ0aWNlcyA6IG51bGwsXG4gICAgICAgICAgICB1aW50VmVydCA6IG51bGwsXG4gICAgICAgICAgICBpbmRpY2VzIDogbnVsbCxcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IGZyYW1lID0gdGhpcy5mcmFtZXNbaW5kZXhdO1xuXG4gICAgICAgIGxldCBzZWdtZW50cyA9IHRoaXMuX3RlbXBTZWdtZW50cyA9IGZyYW1lLnNlZ21lbnRzO1xuICAgICAgICBsZXQgY29sb3JzID0gdGhpcy5fdGVtcENvbG9ycyA9IGZyYW1lLmNvbG9ycztcbiAgICAgICAgbGV0IGJvbmVJbmZvcyA9IHRoaXMuX3RlbXBCb25lSW5mb3MgPSBmcmFtZS5ib25lSW5mb3M7XG4gICAgICAgIHRoaXMuX3RyYXZlcnNlU2tlbGV0b24oc2tlbGV0b24sIGNsaXBwZXIpO1xuICAgICAgICBpZiAoX2NvbG9yT2Zmc2V0ID4gMCkge1xuICAgICAgICAgICAgY29sb3JzW19jb2xvck9mZnNldCAtIDFdLnZmT2Zmc2V0ID0gX3ZmT2Zmc2V0O1xuICAgICAgICB9XG4gICAgICAgIGNvbG9ycy5sZW5ndGggPSBfY29sb3JPZmZzZXQ7XG4gICAgICAgIGJvbmVJbmZvcy5sZW5ndGggPSBfYm9uZUluZm9PZmZzZXQ7XG4gICAgICAgIC8vIEhhbmRsZSBwcmUgc2VnbWVudC5cbiAgICAgICAgbGV0IHByZVNlZ09mZnNldCA9IF9zZWdPZmZzZXQgLSAxO1xuICAgICAgICBpZiAocHJlU2VnT2Zmc2V0ID49IDApIHtcbiAgICAgICAgICAgIC8vIEp1ZGdlIHNlZ21lbnQgdmVydGV4IGNvdW50IGlzIG5vdCBlbXB0eS5cbiAgICAgICAgICAgIGlmIChfc2VnSUNvdW50ID4gMCkge1xuICAgICAgICAgICAgICAgIGxldCBwcmVTZWdJbmZvID0gc2VnbWVudHNbcHJlU2VnT2Zmc2V0XTtcbiAgICAgICAgICAgICAgICBwcmVTZWdJbmZvLmluZGV4Q291bnQgPSBfc2VnSUNvdW50O1xuICAgICAgICAgICAgICAgIHByZVNlZ0luZm8udmZDb3VudCA9IF9zZWdWQ291bnQgKiBfcGVyVmVydGV4U2l6ZTtcbiAgICAgICAgICAgICAgICBwcmVTZWdJbmZvLnZlcnRleENvdW50ID0gX3NlZ1ZDb3VudDtcbiAgICAgICAgICAgICAgICBzZWdtZW50cy5sZW5ndGggPSBfc2VnT2Zmc2V0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBEaXNjYXJkIHByZSBzZWdtZW50LlxuICAgICAgICAgICAgICAgIHNlZ21lbnRzLmxlbmd0aCA9IF9zZWdPZmZzZXQgLSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2VnbWVudHMgaXMgZW1wdHksZGlzY2FyZCBhbGwgc2VnbWVudHMuXG4gICAgICAgIGlmIChzZWdtZW50cy5sZW5ndGggPT0gMCkgcmV0dXJuO1xuXG4gICAgICAgIC8vIEZpbGwgdmVydGljZXNcbiAgICAgICAgbGV0IHZlcnRpY2VzID0gZnJhbWUudmVydGljZXM7XG4gICAgICAgIGxldCB1aW50VmVydCA9IGZyYW1lLnVpbnRWZXJ0O1xuICAgICAgICBpZiAoIXZlcnRpY2VzIHx8IHZlcnRpY2VzLmxlbmd0aCA8IF92Zk9mZnNldCkge1xuICAgICAgICAgICAgdmVydGljZXMgPSBmcmFtZS52ZXJ0aWNlcyA9IG5ldyBGbG9hdDMyQXJyYXkoX3ZmT2Zmc2V0KTtcbiAgICAgICAgICAgIHVpbnRWZXJ0ID0gZnJhbWUudWludFZlcnQgPSBuZXcgVWludDMyQXJyYXkodmVydGljZXMuYnVmZmVyKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMCwgaiA9IDA7IGkgPCBfdmZPZmZzZXQ7KSB7XG4gICAgICAgICAgICB2ZXJ0aWNlc1tpKytdID0gX3ZlcnRpY2VzW2orK107IC8vIHhcbiAgICAgICAgICAgIHZlcnRpY2VzW2krK10gPSBfdmVydGljZXNbaisrXTsgLy8geVxuICAgICAgICAgICAgdmVydGljZXNbaSsrXSA9IF92ZXJ0aWNlc1tqKytdOyAvLyB1XG4gICAgICAgICAgICB2ZXJ0aWNlc1tpKytdID0gX3ZlcnRpY2VzW2orK107IC8vIHZcbiAgICAgICAgICAgIHVpbnRWZXJ0W2krK10gPSBfdmVydGljZXNbaisrXTsgLy8gY29sb3IxXG4gICAgICAgICAgICB1aW50VmVydFtpKytdID0gX3ZlcnRpY2VzW2orK107IC8vIGNvbG9yMlxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRmlsbCBpbmRpY2VzXG4gICAgICAgIGxldCBpbmRpY2VzID0gZnJhbWUuaW5kaWNlcztcbiAgICAgICAgaWYgKCFpbmRpY2VzIHx8IGluZGljZXMubGVuZ3RoIDwgX2luZGV4T2Zmc2V0KSB7XG4gICAgICAgICAgICBpbmRpY2VzID0gZnJhbWUuaW5kaWNlcyA9IG5ldyBVaW50MTZBcnJheShfaW5kZXhPZmZzZXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBfaW5kZXhPZmZzZXQ7IGkrKykge1xuICAgICAgICAgICAgaW5kaWNlc1tpXSA9IF9pbmRpY2VzW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgZnJhbWUudmVydGljZXMgPSB2ZXJ0aWNlcztcbiAgICAgICAgZnJhbWUudWludFZlcnQgPSB1aW50VmVydDtcbiAgICAgICAgZnJhbWUuaW5kaWNlcyA9IGluZGljZXM7XG4gICAgfSxcblxuICAgIGZpbGxWZXJ0aWNlcyAoc2tlbGV0b25Db2xvciwgYXR0YWNobWVudENvbG9yLCBzbG90Q29sb3IsIGNsaXBwZXIsIHNsb3QpIHtcblxuICAgICAgICBfdGVtcGEgPSBzbG90Q29sb3IuYSAqIGF0dGFjaG1lbnRDb2xvci5hICogc2tlbGV0b25Db2xvci5hICogMjU1O1xuICAgICAgICBfdGVtcHIgPSBhdHRhY2htZW50Q29sb3IuciAqIHNrZWxldG9uQ29sb3IuciAqIDI1NTtcbiAgICAgICAgX3RlbXBnID0gYXR0YWNobWVudENvbG9yLmcgKiBza2VsZXRvbkNvbG9yLmcgKiAyNTU7XG4gICAgICAgIF90ZW1wYiA9IGF0dGFjaG1lbnRDb2xvci5iICogc2tlbGV0b25Db2xvci5iICogMjU1O1xuICAgICAgICBcbiAgICAgICAgX2ZpbmFsQ29sb3IuciA9IF90ZW1wciAqIHNsb3RDb2xvci5yO1xuICAgICAgICBfZmluYWxDb2xvci5nID0gX3RlbXBnICogc2xvdENvbG9yLmc7XG4gICAgICAgIF9maW5hbENvbG9yLmIgPSBfdGVtcGIgKiBzbG90Q29sb3IuYjtcbiAgICAgICAgX2ZpbmFsQ29sb3IuYSA9IF90ZW1wYTtcblxuICAgICAgICBpZiAoc2xvdC5kYXJrQ29sb3IgPT0gbnVsbCkge1xuICAgICAgICAgICAgX2RhcmtDb2xvci5zZXQoMC4wLCAwLCAwLCAxLjApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX2RhcmtDb2xvci5yID0gc2xvdC5kYXJrQ29sb3IuciAqIF90ZW1wcjtcbiAgICAgICAgICAgIF9kYXJrQ29sb3IuZyA9IHNsb3QuZGFya0NvbG9yLmcgKiBfdGVtcGc7XG4gICAgICAgICAgICBfZGFya0NvbG9yLmIgPSBzbG90LmRhcmtDb2xvci5iICogX3RlbXBiO1xuICAgICAgICB9XG4gICAgICAgIF9kYXJrQ29sb3IuYSA9IDA7XG5cbiAgICAgICAgX2ZpbmFsQ29sb3IzMiA9ICgoX2ZpbmFsQ29sb3IuYTw8MjQpID4+PiAwKSArIChfZmluYWxDb2xvci5iPDwxNikgKyAoX2ZpbmFsQ29sb3IuZzw8OCkgKyBfZmluYWxDb2xvci5yO1xuICAgICAgICBfZGFya0NvbG9yMzIgPSAoKF9kYXJrQ29sb3IuYTw8MjQpID4+PiAwKSArIChfZGFya0NvbG9yLmI8PDE2KSArIChfZGFya0NvbG9yLmc8PDgpICsgX2RhcmtDb2xvci5yO1xuXG4gICAgICAgIGlmIChfcHJlRmluYWxDb2xvciAhPT0gX2ZpbmFsQ29sb3IzMiB8fCBfcHJlRGFya0NvbG9yICE9PSBfZGFya0NvbG9yMzIpIHtcbiAgICAgICAgICAgIGxldCBjb2xvcnMgPSB0aGlzLl90ZW1wQ29sb3JzO1xuICAgICAgICAgICAgX3ByZUZpbmFsQ29sb3IgPSBfZmluYWxDb2xvcjMyO1xuICAgICAgICAgICAgX3ByZURhcmtDb2xvciA9IF9kYXJrQ29sb3IzMjtcbiAgICAgICAgICAgIGlmIChfY29sb3JPZmZzZXQgPiAwKSB7XG4gICAgICAgICAgICAgICAgY29sb3JzW19jb2xvck9mZnNldCAtIDFdLnZmT2Zmc2V0ID0gX3ZmT2Zmc2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29sb3JzW19jb2xvck9mZnNldCsrXSA9IHtcbiAgICAgICAgICAgICAgICBmciA6IF9maW5hbENvbG9yLnIsXG4gICAgICAgICAgICAgICAgZmcgOiBfZmluYWxDb2xvci5nLFxuICAgICAgICAgICAgICAgIGZiIDogX2ZpbmFsQ29sb3IuYixcbiAgICAgICAgICAgICAgICBmYSA6IF9maW5hbENvbG9yLmEsXG4gICAgICAgICAgICAgICAgZHIgOiBfZGFya0NvbG9yLnIsXG4gICAgICAgICAgICAgICAgZGcgOiBfZGFya0NvbG9yLmcsXG4gICAgICAgICAgICAgICAgZGIgOiBfZGFya0NvbG9yLmIsXG4gICAgICAgICAgICAgICAgZGEgOiBfZGFya0NvbG9yLmEsXG4gICAgICAgICAgICAgICAgdmZPZmZzZXQgOiAwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNsaXBwZXIuaXNDbGlwcGluZygpKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZvciAobGV0IHYgPSBfdmZPZmZzZXQsIG4gPSBfdmZPZmZzZXQgKyBfdmZDb3VudDsgdiA8IG47IHYgKz0gX3BlclZlcnRleFNpemUpIHtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbdiArIDRdICA9IF9maW5hbENvbG9yMzI7ICAgICAvLyBsaWdodCBjb2xvclxuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1t2ICsgNV0gID0gX2RhcmtDb2xvcjMyOyAgICAgIC8vIGRhcmsgY29sb3JcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2xpcHBlci5jbGlwVHJpYW5nbGVzKF92ZXJ0aWNlcywgX3ZmQ291bnQsIF9pbmRpY2VzLCBfaW5kZXhDb3VudCwgX3ZlcnRpY2VzLCBfZmluYWxDb2xvciwgX2RhcmtDb2xvciwgdHJ1ZSwgX3BlclZlcnRleFNpemUsIF9pbmRleE9mZnNldCwgX3ZmT2Zmc2V0LCBfdmZPZmZzZXQgKyAyKTtcbiAgICAgICAgICAgIGxldCBjbGlwcGVkVmVydGljZXMgPSBjbGlwcGVyLmNsaXBwZWRWZXJ0aWNlcztcbiAgICAgICAgICAgIGxldCBjbGlwcGVkVHJpYW5nbGVzID0gY2xpcHBlci5jbGlwcGVkVHJpYW5nbGVzO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBpbnN1cmUgY2FwYWNpdHlcbiAgICAgICAgICAgIF9pbmRleENvdW50ID0gY2xpcHBlZFRyaWFuZ2xlcy5sZW5ndGg7XG4gICAgICAgICAgICBfdmZDb3VudCA9IGNsaXBwZWRWZXJ0aWNlcy5sZW5ndGggLyBfcGVyQ2xpcFZlcnRleFNpemUgKiBfcGVyVmVydGV4U2l6ZTtcblxuICAgICAgICAgICAgLy8gZmlsbCBpbmRpY2VzXG4gICAgICAgICAgICBmb3IgKGxldCBpaSA9IDAsIGpqID0gX2luZGV4T2Zmc2V0LCBubiA9IGNsaXBwZWRUcmlhbmdsZXMubGVuZ3RoOyBpaSA8IG5uOykge1xuICAgICAgICAgICAgICAgIF9pbmRpY2VzW2pqKytdID0gY2xpcHBlZFRyaWFuZ2xlc1tpaSsrXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZmlsbCB2ZXJ0aWNlcyBjb250YWluIHggeSB1IHYgbGlnaHQgY29sb3IgZGFyayBjb2xvclxuICAgICAgICAgICAgZm9yIChsZXQgdiA9IDAsIG4gPSBjbGlwcGVkVmVydGljZXMubGVuZ3RoLCBvZmZzZXQgPSBfdmZPZmZzZXQ7IHYgPCBuOyB2ICs9IDEyLCBvZmZzZXQgKz0gX3BlclZlcnRleFNpemUpIHtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbb2Zmc2V0XSA9IGNsaXBwZWRWZXJ0aWNlc1t2XTsgICAgICAgICAgICAgICAgIC8vIHhcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbb2Zmc2V0ICsgMV0gPSBjbGlwcGVkVmVydGljZXNbdiArIDFdOyAgICAgICAgIC8vIHlcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbb2Zmc2V0ICsgMl0gPSBjbGlwcGVkVmVydGljZXNbdiArIDZdOyAgICAgICAgIC8vIHVcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbb2Zmc2V0ICsgM10gPSBjbGlwcGVkVmVydGljZXNbdiArIDddOyAgICAgICAgIC8vIHZcblxuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1tvZmZzZXQgKyA0XSA9IF9maW5hbENvbG9yMzI7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzW29mZnNldCArIDVdID0gX2RhcmtDb2xvcjMyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF90cmF2ZXJzZVNrZWxldG9uIChza2VsZXRvbiwgY2xpcHBlcikge1xuICAgICAgICBsZXQgc2VnbWVudHMgPSB0aGlzLl90ZW1wU2VnbWVudHM7XG4gICAgICAgIGxldCBib25lSW5mb3MgPSB0aGlzLl90ZW1wQm9uZUluZm9zO1xuICAgICAgICBsZXQgc2tlbGV0b25Db2xvciA9IHNrZWxldG9uLmNvbG9yO1xuICAgICAgICBsZXQgYXR0YWNobWVudCwgYXR0YWNobWVudENvbG9yLCBzbG90Q29sb3IsIHV2cywgdHJpYW5nbGVzO1xuICAgICAgICBsZXQgaXNSZWdpb24sIGlzTWVzaCwgaXNDbGlwO1xuICAgICAgICBsZXQgdGV4dHVyZTtcbiAgICAgICAgbGV0IHByZVNlZ09mZnNldCwgcHJlU2VnSW5mbztcbiAgICAgICAgbGV0IGJsZW5kTW9kZTtcbiAgICAgICAgbGV0IHNsb3Q7XG5cbiAgICAgICAgbGV0IGJvbmVzID0gc2tlbGV0b24uYm9uZXM7XG4gICAgICAgIGlmICh0aGlzLl9lbmFibGVDYWNoZUF0dGFjaGVkSW5mbykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBib25lcy5sZW5ndGg7IGkgPCBsOyBpKyssIF9ib25lSW5mb09mZnNldCsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGJvbmUgPSBib25lc1tpXTtcbiAgICAgICAgICAgICAgICBsZXQgYm9uZUluZm8gPSBib25lSW5mb3NbX2JvbmVJbmZvT2Zmc2V0XTtcbiAgICAgICAgICAgICAgICBpZiAoIWJvbmVJbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgIGJvbmVJbmZvID0gYm9uZUluZm9zW19ib25lSW5mb09mZnNldF0gPSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYm9uZUluZm8uYSA9IGJvbmUuYTtcbiAgICAgICAgICAgICAgICBib25lSW5mby5iID0gYm9uZS5iO1xuICAgICAgICAgICAgICAgIGJvbmVJbmZvLmMgPSBib25lLmM7XG4gICAgICAgICAgICAgICAgYm9uZUluZm8uZCA9IGJvbmUuZDtcbiAgICAgICAgICAgICAgICBib25lSW5mby53b3JsZFggPSBib25lLndvcmxkWDtcbiAgICAgICAgICAgICAgICBib25lSW5mby53b3JsZFkgPSBib25lLndvcmxkWTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IHNsb3RJZHggPSAwLCBzbG90Q291bnQgPSBza2VsZXRvbi5kcmF3T3JkZXIubGVuZ3RoOyBzbG90SWR4IDwgc2xvdENvdW50OyBzbG90SWR4KyspIHtcbiAgICAgICAgICAgIHNsb3QgPSBza2VsZXRvbi5kcmF3T3JkZXJbc2xvdElkeF07XG4gICAgXG4gICAgICAgICAgICBfdmZDb3VudCA9IDA7XG4gICAgICAgICAgICBfaW5kZXhDb3VudCA9IDA7XG5cbiAgICAgICAgICAgIGF0dGFjaG1lbnQgPSBzbG90LmdldEF0dGFjaG1lbnQoKTtcbiAgICAgICAgICAgIGlmICghYXR0YWNobWVudCkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpc1JlZ2lvbiA9IGF0dGFjaG1lbnQgaW5zdGFuY2VvZiBzcGluZS5SZWdpb25BdHRhY2htZW50O1xuICAgICAgICAgICAgaXNNZXNoID0gYXR0YWNobWVudCBpbnN0YW5jZW9mIHNwaW5lLk1lc2hBdHRhY2htZW50O1xuICAgICAgICAgICAgaXNDbGlwID0gYXR0YWNobWVudCBpbnN0YW5jZW9mIHNwaW5lLkNsaXBwaW5nQXR0YWNobWVudDtcblxuICAgICAgICAgICAgaWYgKGlzQ2xpcCkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcFN0YXJ0KHNsb3QsIGF0dGFjaG1lbnQpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWlzUmVnaW9uICYmICFpc01lc2gpIHtcbiAgICAgICAgICAgICAgICBjbGlwcGVyLmNsaXBFbmRXaXRoU2xvdChzbG90KTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGV4dHVyZSA9IGF0dGFjaG1lbnQucmVnaW9uLnRleHR1cmUuX3RleHR1cmU7XG4gICAgICAgICAgICBpZiAoIXRleHR1cmUpIHtcbiAgICAgICAgICAgICAgICBjbGlwcGVyLmNsaXBFbmRXaXRoU2xvdChzbG90KTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGJsZW5kTW9kZSA9IHNsb3QuZGF0YS5ibGVuZE1vZGU7XG4gICAgICAgICAgICBpZiAoX3ByZVRleFVybCAhPT0gdGV4dHVyZS51cmwgfHwgX3ByZUJsZW5kTW9kZSAhPT0gYmxlbmRNb2RlKSB7XG4gICAgICAgICAgICAgICAgX3ByZVRleFVybCA9IHRleHR1cmUudXJsO1xuICAgICAgICAgICAgICAgIF9wcmVCbGVuZE1vZGUgPSBibGVuZE1vZGU7XG4gICAgICAgICAgICAgICAgLy8gSGFuZGxlIHByZSBzZWdtZW50LlxuICAgICAgICAgICAgICAgIHByZVNlZ09mZnNldCA9IF9zZWdPZmZzZXQgLSAxO1xuICAgICAgICAgICAgICAgIGlmIChwcmVTZWdPZmZzZXQgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoX3NlZ0lDb3VudCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZVNlZ0luZm8gPSBzZWdtZW50c1twcmVTZWdPZmZzZXRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlU2VnSW5mby5pbmRleENvdW50ID0gX3NlZ0lDb3VudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZVNlZ0luZm8udmVydGV4Q291bnQgPSBfc2VnVkNvdW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlU2VnSW5mby52ZkNvdW50ID0gX3NlZ1ZDb3VudCAqIF9wZXJWZXJ0ZXhTaXplO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRGlzY2FyZCBwcmUgc2VnbWVudC5cbiAgICAgICAgICAgICAgICAgICAgICAgIF9zZWdPZmZzZXQtLTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgbm93IHNlZ21lbnQuXG4gICAgICAgICAgICAgICAgc2VnbWVudHNbX3NlZ09mZnNldF0gPSB7XG4gICAgICAgICAgICAgICAgICAgIHRleCA6IHRleHR1cmUsXG4gICAgICAgICAgICAgICAgICAgIGJsZW5kTW9kZSA6IGJsZW5kTW9kZSxcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhDb3VudCA6IDAsXG4gICAgICAgICAgICAgICAgICAgIHZlcnRleENvdW50IDogMCxcbiAgICAgICAgICAgICAgICAgICAgdmZDb3VudCA6IDBcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIF9zZWdPZmZzZXQrKztcbiAgICAgICAgICAgICAgICBfc2VnSUNvdW50ID0gMDtcbiAgICAgICAgICAgICAgICBfc2VnVkNvdW50ID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGlzUmVnaW9uKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdHJpYW5nbGVzID0gX3F1YWRUcmlhbmdsZXM7XG4gICAgXG4gICAgICAgICAgICAgICAgLy8gaW5zdXJlIGNhcGFjaXR5XG4gICAgICAgICAgICAgICAgX3ZmQ291bnQgPSA0ICogX3BlclZlcnRleFNpemU7XG4gICAgICAgICAgICAgICAgX2luZGV4Q291bnQgPSA2O1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIGNvbXB1dGUgdmVydGV4IGFuZCBmaWxsIHggeVxuICAgICAgICAgICAgICAgIGF0dGFjaG1lbnQuY29tcHV0ZVdvcmxkVmVydGljZXMoc2xvdC5ib25lLCBfdmVydGljZXMsIF92Zk9mZnNldCwgX3BlclZlcnRleFNpemUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaXNNZXNoKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdHJpYW5nbGVzID0gYXR0YWNobWVudC50cmlhbmdsZXM7XG4gICAgXG4gICAgICAgICAgICAgICAgLy8gaW5zdXJlIGNhcGFjaXR5XG4gICAgICAgICAgICAgICAgX3ZmQ291bnQgPSAoYXR0YWNobWVudC53b3JsZFZlcnRpY2VzTGVuZ3RoID4+IDEpICogX3BlclZlcnRleFNpemU7XG4gICAgICAgICAgICAgICAgX2luZGV4Q291bnQgPSB0cmlhbmdsZXMubGVuZ3RoO1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIGNvbXB1dGUgdmVydGV4IGFuZCBmaWxsIHggeVxuICAgICAgICAgICAgICAgIGF0dGFjaG1lbnQuY29tcHV0ZVdvcmxkVmVydGljZXMoc2xvdCwgMCwgYXR0YWNobWVudC53b3JsZFZlcnRpY2VzTGVuZ3RoLCBfdmVydGljZXMsIF92Zk9mZnNldCwgX3BlclZlcnRleFNpemUpO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgaWYgKF92ZkNvdW50ID09IDAgfHwgX2luZGV4Q291bnQgPT0gMCkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgLy8gZmlsbCBpbmRpY2VzXG4gICAgICAgICAgICBmb3IgKGxldCBpaSA9IDAsIGpqID0gX2luZGV4T2Zmc2V0LCBubiA9IHRyaWFuZ2xlcy5sZW5ndGg7IGlpIDwgbm47KSB7XG4gICAgICAgICAgICAgICAgX2luZGljZXNbamorK10gPSB0cmlhbmdsZXNbaWkrK107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGZpbGwgdSB2XG4gICAgICAgICAgICB1dnMgPSBhdHRhY2htZW50LnV2cztcbiAgICAgICAgICAgIGZvciAobGV0IHYgPSBfdmZPZmZzZXQsIG4gPSBfdmZPZmZzZXQgKyBfdmZDb3VudCwgdSA9IDA7IHYgPCBuOyB2ICs9IF9wZXJWZXJ0ZXhTaXplLCB1ICs9IDIpIHtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbdiArIDJdID0gdXZzW3VdOyAgICAgICAgICAgLy8gdVxuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1t2ICsgM10gPSB1dnNbdSArIDFdOyAgICAgICAvLyB2XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF0dGFjaG1lbnRDb2xvciA9IGF0dGFjaG1lbnQuY29sb3I7XG4gICAgICAgICAgICBzbG90Q29sb3IgPSBzbG90LmNvbG9yO1xuXG4gICAgICAgICAgICB0aGlzLmZpbGxWZXJ0aWNlcyhza2VsZXRvbkNvbG9yLCBhdHRhY2htZW50Q29sb3IsIHNsb3RDb2xvciwgY2xpcHBlciwgc2xvdCk7XG4gICAgXG4gICAgICAgICAgICBpZiAoX2luZGV4Q291bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaWkgPSBfaW5kZXhPZmZzZXQsIG5uID0gX2luZGV4T2Zmc2V0ICsgX2luZGV4Q291bnQ7IGlpIDwgbm47IGlpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgX2luZGljZXNbaWldICs9IF9zZWdWQ291bnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF9pbmRleE9mZnNldCArPSBfaW5kZXhDb3VudDtcbiAgICAgICAgICAgICAgICBfdmZPZmZzZXQgKz0gX3ZmQ291bnQ7XG4gICAgICAgICAgICAgICAgX3ZlcnRleE9mZnNldCA9IF92Zk9mZnNldCAvIF9wZXJWZXJ0ZXhTaXplO1xuICAgICAgICAgICAgICAgIF9zZWdJQ291bnQgKz0gX2luZGV4Q291bnQ7XG4gICAgICAgICAgICAgICAgX3NlZ1ZDb3VudCArPSBfdmZDb3VudCAvIF9wZXJWZXJ0ZXhTaXplO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgY2xpcHBlci5jbGlwRW5kV2l0aFNsb3Qoc2xvdCk7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgY2xpcHBlci5jbGlwRW5kKCk7XG4gICAgfVxufSk7XG5cbmxldCBTa2VsZXRvbkNhY2hlID0gY2MuQ2xhc3Moe1xuICAgIGN0b3IgKCkge1xuICAgICAgICB0aGlzLl9wcml2YXRlTW9kZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9hbmltYXRpb25Qb29sID0ge307XG4gICAgICAgIHRoaXMuX3NrZWxldG9uQ2FjaGUgPSB7fTtcbiAgICB9LFxuXG4gICAgZW5hYmxlUHJpdmF0ZU1vZGUgKCkge1xuICAgICAgICB0aGlzLl9wcml2YXRlTW9kZSA9IHRydWU7XG4gICAgfSxcblxuICAgIGNsZWFyICgpIHtcbiAgICAgICAgdGhpcy5fYW5pbWF0aW9uUG9vbCA9IHt9O1xuICAgICAgICB0aGlzLl9za2VsZXRvbkNhY2hlID0ge307XG4gICAgfSxcblxuICAgIHJlbW92ZVNrZWxldG9uICh1dWlkKSB7XG4gICAgICAgIHZhciBza2VsZXRvbkluZm8gPSB0aGlzLl9za2VsZXRvbkNhY2hlW3V1aWRdO1xuICAgICAgICBpZiAoIXNrZWxldG9uSW5mbykgcmV0dXJuO1xuICAgICAgICBsZXQgYW5pbWF0aW9uc0NhY2hlID0gc2tlbGV0b25JbmZvLmFuaW1hdGlvbnNDYWNoZTtcbiAgICAgICAgZm9yICh2YXIgYW5pS2V5IGluIGFuaW1hdGlvbnNDYWNoZSkge1xuICAgICAgICAgICAgLy8gQ2xlYXIgY2FjaGUgdGV4dHVyZSwgYW5kIHB1dCBjYWNoZSBpbnRvIHBvb2wuXG4gICAgICAgICAgICAvLyBObyBuZWVkIHRvIGNyZWF0ZSBUeXBlZEFycmF5IG5leHQgdGltZS5cbiAgICAgICAgICAgIGxldCBhbmltYXRpb25DYWNoZSA9IGFuaW1hdGlvbnNDYWNoZVthbmlLZXldO1xuICAgICAgICAgICAgaWYgKCFhbmltYXRpb25DYWNoZSkgY29udGludWU7XG4gICAgICAgICAgICB0aGlzLl9hbmltYXRpb25Qb29sW3V1aWQgKyBcIiNcIiArIGFuaUtleV0gPSBhbmltYXRpb25DYWNoZTtcbiAgICAgICAgICAgIGFuaW1hdGlvbkNhY2hlLmNsZWFyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGUgdGhpcy5fc2tlbGV0b25DYWNoZVt1dWlkXTtcbiAgICB9LFxuXG4gICAgZ2V0U2tlbGV0b25DYWNoZSAodXVpZCwgc2tlbGV0b25EYXRhKSB7XG4gICAgICAgIGxldCBza2VsZXRvbkluZm8gPSB0aGlzLl9za2VsZXRvbkNhY2hlW3V1aWRdO1xuICAgICAgICBpZiAoIXNrZWxldG9uSW5mbykge1xuICAgICAgICAgICAgbGV0IHNrZWxldG9uID0gbmV3IHNwaW5lLlNrZWxldG9uKHNrZWxldG9uRGF0YSk7XG4gICAgICAgICAgICBsZXQgY2xpcHBlciA9IG5ldyBzcGluZS5Ta2VsZXRvbkNsaXBwaW5nKCk7XG4gICAgICAgICAgICBsZXQgc3RhdGVEYXRhID0gbmV3IHNwaW5lLkFuaW1hdGlvblN0YXRlRGF0YShza2VsZXRvbi5kYXRhKTtcbiAgICAgICAgICAgIGxldCBzdGF0ZSA9IG5ldyBzcGluZS5BbmltYXRpb25TdGF0ZShzdGF0ZURhdGEpO1xuICAgICAgICAgICAgbGV0IGxpc3RlbmVyID0gbmV3IFRyYWNrRW50cnlMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIHN0YXRlLmFkZExpc3RlbmVyKGxpc3RlbmVyKTtcblxuICAgICAgICAgICAgdGhpcy5fc2tlbGV0b25DYWNoZVt1dWlkXSA9IHNrZWxldG9uSW5mbyA9IHtcbiAgICAgICAgICAgICAgICBza2VsZXRvbiA6IHNrZWxldG9uLFxuICAgICAgICAgICAgICAgIGNsaXBwZXIgOiBjbGlwcGVyLFxuICAgICAgICAgICAgICAgIHN0YXRlIDogc3RhdGUsXG4gICAgICAgICAgICAgICAgbGlzdGVuZXIgOiBsaXN0ZW5lcixcbiAgICAgICAgICAgICAgICAvLyBDYWNoZSBhbGwga2luZHMgb2YgYW5pbWF0aW9uIGZyYW1lLlxuICAgICAgICAgICAgICAgIC8vIFdoZW4gc2tlbGV0b24gaXMgZGlzcG9zZSwgY2xlYXIgYWxsIGFuaW1hdGlvbiBjYWNoZS5cbiAgICAgICAgICAgICAgICBhbmltYXRpb25zQ2FjaGUgOiB7fSxcbiAgICAgICAgICAgICAgICBjdXJBbmltYXRpb25DYWNoZTogbnVsbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2tlbGV0b25JbmZvO1xuICAgIH0sXG5cbiAgICBnZXRBbmltYXRpb25DYWNoZSAodXVpZCwgYW5pbWF0aW9uTmFtZSkge1xuICAgICAgICBsZXQgc2tlbGV0b25JbmZvID0gdGhpcy5fc2tlbGV0b25DYWNoZVt1dWlkXTtcbiAgICAgICAgaWYgKCFza2VsZXRvbkluZm8pIHJldHVybiBudWxsO1xuXG4gICAgICAgIGxldCBhbmltYXRpb25zQ2FjaGUgPSBza2VsZXRvbkluZm8uYW5pbWF0aW9uc0NhY2hlO1xuICAgICAgICByZXR1cm4gYW5pbWF0aW9uc0NhY2hlW2FuaW1hdGlvbk5hbWVdO1xuICAgIH0sXG5cbiAgICBpbnZhbGlkQW5pbWF0aW9uQ2FjaGUgKHV1aWQpIHtcbiAgICAgICAgbGV0IHNrZWxldG9uSW5mbyA9IHRoaXMuX3NrZWxldG9uQ2FjaGVbdXVpZF07XG4gICAgICAgIGxldCBza2VsZXRvbiA9IHNrZWxldG9uSW5mbyAmJiBza2VsZXRvbkluZm8uc2tlbGV0b247XG4gICAgICAgIGlmICghc2tlbGV0b24pIHJldHVybjtcblxuICAgICAgICBsZXQgYW5pbWF0aW9uc0NhY2hlID0gc2tlbGV0b25JbmZvLmFuaW1hdGlvbnNDYWNoZTtcbiAgICAgICAgZm9yICh2YXIgYW5pS2V5IGluIGFuaW1hdGlvbnNDYWNoZSkge1xuICAgICAgICAgICAgbGV0IGFuaW1hdGlvbkNhY2hlID0gYW5pbWF0aW9uc0NhY2hlW2FuaUtleV07XG4gICAgICAgICAgICBhbmltYXRpb25DYWNoZS5pbnZhbGlkQWxsRnJhbWUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBpbml0QW5pbWF0aW9uQ2FjaGUgKHV1aWQsIGFuaW1hdGlvbk5hbWUpIHtcbiAgICAgICAgaWYgKCFhbmltYXRpb25OYW1lKSByZXR1cm4gbnVsbDtcbiAgICAgICAgbGV0IHNrZWxldG9uSW5mbyA9IHRoaXMuX3NrZWxldG9uQ2FjaGVbdXVpZF07XG4gICAgICAgIGxldCBza2VsZXRvbiA9IHNrZWxldG9uSW5mbyAmJiBza2VsZXRvbkluZm8uc2tlbGV0b247XG4gICAgICAgIGlmICghc2tlbGV0b24pIHJldHVybiBudWxsO1xuXG4gICAgICAgIGxldCBhbmltYXRpb24gPSBza2VsZXRvbi5kYXRhLmZpbmRBbmltYXRpb24oYW5pbWF0aW9uTmFtZSk7XG4gICAgICAgIGlmICghYW5pbWF0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBhbmltYXRpb25zQ2FjaGUgPSBza2VsZXRvbkluZm8uYW5pbWF0aW9uc0NhY2hlO1xuICAgICAgICBsZXQgYW5pbWF0aW9uQ2FjaGUgPSBhbmltYXRpb25zQ2FjaGVbYW5pbWF0aW9uTmFtZV07XG4gICAgICAgIGlmICghYW5pbWF0aW9uQ2FjaGUpIHtcbiAgICAgICAgICAgIC8vIElmIGNhY2hlIGV4aXN0IGluIHBvb2wsIHRoZW4ganVzdCB1c2UgaXQuXG4gICAgICAgICAgICBsZXQgcG9vbEtleSA9IHV1aWQgKyBcIiNcIiArIGFuaW1hdGlvbk5hbWU7XG4gICAgICAgICAgICBhbmltYXRpb25DYWNoZSA9IHRoaXMuX2FuaW1hdGlvblBvb2xbcG9vbEtleV07XG4gICAgICAgICAgICBpZiAoYW5pbWF0aW9uQ2FjaGUpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fYW5pbWF0aW9uUG9vbFtwb29sS2V5XTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uQ2FjaGUgPSBuZXcgQW5pbWF0aW9uQ2FjaGUoKTtcbiAgICAgICAgICAgICAgICBhbmltYXRpb25DYWNoZS5fcHJpdmF0ZU1vZGUgPSB0aGlzLl9wcml2YXRlTW9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFuaW1hdGlvbkNhY2hlLmluaXQoc2tlbGV0b25JbmZvLCBhbmltYXRpb25OYW1lKTtcbiAgICAgICAgICAgIGFuaW1hdGlvbnNDYWNoZVthbmltYXRpb25OYW1lXSA9IGFuaW1hdGlvbkNhY2hlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbmltYXRpb25DYWNoZTtcbiAgICB9LFxuXG4gICAgdXBkYXRlQW5pbWF0aW9uQ2FjaGUgKHV1aWQsIGFuaW1hdGlvbk5hbWUpIHtcbiAgICAgICAgaWYgKGFuaW1hdGlvbk5hbWUpIHtcbiAgICAgICAgICAgIGxldCBhbmltYXRpb25DYWNoZSA9IHRoaXMuaW5pdEFuaW1hdGlvbkNhY2hlKHV1aWQsIGFuaW1hdGlvbk5hbWUpO1xuICAgICAgICAgICAgaWYgKCFhbmltYXRpb25DYWNoZSkgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBhbmltYXRpb25DYWNoZS51cGRhdGVBbGxGcmFtZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHNrZWxldG9uSW5mbyA9IHRoaXMuX3NrZWxldG9uQ2FjaGVbdXVpZF07XG4gICAgICAgICAgICBsZXQgc2tlbGV0b24gPSBza2VsZXRvbkluZm8gJiYgc2tlbGV0b25JbmZvLnNrZWxldG9uO1xuICAgICAgICAgICAgaWYgKCFza2VsZXRvbikgcmV0dXJuO1xuXG4gICAgICAgICAgICBsZXQgYW5pbWF0aW9uc0NhY2hlID0gc2tlbGV0b25JbmZvLmFuaW1hdGlvbnNDYWNoZTtcbiAgICAgICAgICAgIGZvciAodmFyIGFuaUtleSBpbiBhbmltYXRpb25zQ2FjaGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgYW5pbWF0aW9uQ2FjaGUgPSBhbmltYXRpb25zQ2FjaGVbYW5pS2V5XTtcbiAgICAgICAgICAgICAgICBhbmltYXRpb25DYWNoZS51cGRhdGVBbGxGcmFtZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cblNrZWxldG9uQ2FjaGUuRnJhbWVUaW1lID0gRnJhbWVUaW1lO1xuU2tlbGV0b25DYWNoZS5zaGFyZWRDYWNoZSA9IG5ldyBTa2VsZXRvbkNhY2hlKCk7XG5tb2R1bGUuZXhwb3J0cyA9IFNrZWxldG9uQ2FjaGU7Il19