
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extensions/spine/spine-assembler.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _assembler = _interopRequireDefault(require("../../cocos2d/core/renderer/assembler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Skeleton = require('./Skeleton');

var spine = require('./lib/spine');

var RenderFlow = require('../../cocos2d/core/renderer/render-flow');

var VertexFormat = require('../../cocos2d/core/renderer/webgl/vertex-format');

var VFOneColor = VertexFormat.vfmtPosUvColor;
var VFTwoColor = VertexFormat.vfmtPosUvTwoColor;
var gfx = cc.gfx;
var FLAG_BATCH = 0x10;
var FLAG_TWO_COLOR = 0x01;
var _handleVal = 0x00;
var _quadTriangles = [0, 1, 2, 2, 3, 0];

var _slotColor = cc.color(0, 0, 255, 255);

var _boneColor = cc.color(255, 0, 0, 255);

var _originColor = cc.color(0, 255, 0, 255);

var _meshColor = cc.color(255, 255, 0, 255);

var _finalColor = null;
var _darkColor = null;
var _tempPos = null,
    _tempUv = null;

if (!CC_NATIVERENDERER) {
  _finalColor = new spine.Color(1, 1, 1, 1);
  _darkColor = new spine.Color(1, 1, 1, 1);
  _tempPos = new spine.Vector2();
  _tempUv = new spine.Vector2();
}

var _premultipliedAlpha;

var _multiplier;

var _slotRangeStart;

var _slotRangeEnd;

var _useTint;

var _debugSlots;

var _debugBones;

var _debugMesh;

var _nodeR, _nodeG, _nodeB, _nodeA;

var _finalColor32, _darkColor32;

var _vertexFormat;

var _perVertexSize;

var _perClipVertexSize;

var _vertexFloatCount = 0,
    _vertexCount = 0,
    _vertexFloatOffset = 0,
    _vertexOffset = 0,
    _indexCount = 0,
    _indexOffset = 0,
    _vfOffset = 0;

var _tempr, _tempg, _tempb;

var _inRange;

var _mustFlush;

var _x, _y, _m00, _m04, _m12, _m01, _m05, _m13;

var _r, _g, _b, _fr, _fg, _fb, _fa, _dr, _dg, _db, _da;

var _comp, _buffer, _renderer, _node, _needColor, _vertexEffect;

function _getSlotMaterial(tex, blendMode) {
  var src, dst;

  switch (blendMode) {
    case spine.BlendMode.Additive:
      src = _premultipliedAlpha ? cc.macro.ONE : cc.macro.SRC_ALPHA;
      dst = cc.macro.ONE;
      break;

    case spine.BlendMode.Multiply:
      src = cc.macro.DST_COLOR;
      dst = cc.macro.ONE_MINUS_SRC_ALPHA;
      break;

    case spine.BlendMode.Screen:
      src = cc.macro.ONE;
      dst = cc.macro.ONE_MINUS_SRC_COLOR;
      break;

    case spine.BlendMode.Normal:
    default:
      src = _premultipliedAlpha ? cc.macro.ONE : cc.macro.SRC_ALPHA;
      dst = cc.macro.ONE_MINUS_SRC_ALPHA;
      break;
  }

  var useModel = !_comp.enableBatch;
  var baseMaterial = _comp._materials[0];
  if (!baseMaterial) return null; // The key use to find corresponding material

  var key = tex.getId() + src + dst + _useTint + useModel;
  var materialCache = _comp._materialCache;
  var material = materialCache[key];

  if (!material) {
    if (!materialCache.baseMaterial) {
      material = baseMaterial;
      materialCache.baseMaterial = baseMaterial;
    } else {
      material = cc.MaterialVariant.create(baseMaterial);
    }

    material.define('CC_USE_MODEL', useModel);
    material.define('USE_TINT', _useTint); // update texture

    material.setProperty('texture', tex); // update blend function

    material.setBlend(true, gfx.BLEND_FUNC_ADD, src, dst, gfx.BLEND_FUNC_ADD, src, dst);
    materialCache[key] = material;
  }

  return material;
}

function _handleColor(color) {
  // temp rgb has multiply 255, so need divide 255;
  _fa = color.fa * _nodeA;
  _multiplier = _premultipliedAlpha ? _fa / 255 : 1;
  _r = _nodeR * _multiplier;
  _g = _nodeG * _multiplier;
  _b = _nodeB * _multiplier;
  _fr = color.fr * _r;
  _fg = color.fg * _g;
  _fb = color.fb * _b;
  _finalColor32 = (_fa << 24 >>> 0) + (_fb << 16) + (_fg << 8) + _fr;
  _dr = color.dr * _r;
  _dg = color.dg * _g;
  _db = color.db * _b;
  _da = _premultipliedAlpha ? 255 : 0;
  _darkColor32 = (_da << 24 >>> 0) + (_db << 16) + (_dg << 8) + _dr;
}

function _spineColorToInt32(spineColor) {
  return (spineColor.a << 24 >>> 0) + (spineColor.b << 16) + (spineColor.g << 8) + spineColor.r;
}

var SpineAssembler =
/*#__PURE__*/
function (_Assembler) {
  _inheritsLoose(SpineAssembler, _Assembler);

  function SpineAssembler() {
    return _Assembler.apply(this, arguments) || this;
  }

  var _proto = SpineAssembler.prototype;

  _proto.updateRenderData = function updateRenderData(comp) {
    if (comp.isAnimationCached()) return;
    var skeleton = comp._skeleton;

    if (skeleton) {
      skeleton.updateWorldTransform();
    }
  };

  _proto.fillVertices = function fillVertices(skeletonColor, attachmentColor, slotColor, clipper, slot) {
    var vbuf = _buffer._vData,
        ibuf = _buffer._iData,
        uintVData = _buffer._uintVData;
    var offsetInfo;
    _finalColor.a = slotColor.a * attachmentColor.a * skeletonColor.a * _nodeA * 255;
    _multiplier = _premultipliedAlpha ? _finalColor.a : 255;
    _tempr = _nodeR * attachmentColor.r * skeletonColor.r * _multiplier;
    _tempg = _nodeG * attachmentColor.g * skeletonColor.g * _multiplier;
    _tempb = _nodeB * attachmentColor.b * skeletonColor.b * _multiplier;
    _finalColor.r = _tempr * slotColor.r;
    _finalColor.g = _tempg * slotColor.g;
    _finalColor.b = _tempb * slotColor.b;

    if (slot.darkColor == null) {
      _darkColor.set(0.0, 0.0, 0.0, 1.0);
    } else {
      _darkColor.r = slot.darkColor.r * _tempr;
      _darkColor.g = slot.darkColor.g * _tempg;
      _darkColor.b = slot.darkColor.b * _tempb;
    }

    _darkColor.a = _premultipliedAlpha ? 255 : 0;

    if (!clipper.isClipping()) {
      if (_vertexEffect) {
        for (var v = _vertexFloatOffset, n = _vertexFloatOffset + _vertexFloatCount; v < n; v += _perVertexSize) {
          _tempPos.x = vbuf[v];
          _tempPos.y = vbuf[v + 1];
          _tempUv.x = vbuf[v + 2];
          _tempUv.y = vbuf[v + 3];

          _vertexEffect.transform(_tempPos, _tempUv, _finalColor, _darkColor);

          vbuf[v] = _tempPos.x; // x

          vbuf[v + 1] = _tempPos.y; // y

          vbuf[v + 2] = _tempUv.x; // u

          vbuf[v + 3] = _tempUv.y; // v

          uintVData[v + 4] = _spineColorToInt32(_finalColor); // light color

          _useTint && (uintVData[v + 5] = _spineColorToInt32(_darkColor)); // dark color
        }
      } else {
        _finalColor32 = _spineColorToInt32(_finalColor);
        _darkColor32 = _spineColorToInt32(_darkColor);

        for (var _v = _vertexFloatOffset, _n = _vertexFloatOffset + _vertexFloatCount; _v < _n; _v += _perVertexSize) {
          uintVData[_v + 4] = _finalColor32; // light color

          _useTint && (uintVData[_v + 5] = _darkColor32); // dark color
        }
      }
    } else {
      var uvs = vbuf.subarray(_vertexFloatOffset + 2);
      clipper.clipTriangles(vbuf.subarray(_vertexFloatOffset), _vertexFloatCount, ibuf.subarray(_indexOffset), _indexCount, uvs, _finalColor, _darkColor, _useTint, _perVertexSize);
      var clippedVertices = new Float32Array(clipper.clippedVertices);
      var clippedTriangles = clipper.clippedTriangles; // insure capacity

      _indexCount = clippedTriangles.length;
      _vertexFloatCount = clippedVertices.length / _perClipVertexSize * _perVertexSize;
      offsetInfo = _buffer.request(_vertexFloatCount / _perVertexSize, _indexCount);
      _indexOffset = offsetInfo.indiceOffset, _vertexOffset = offsetInfo.vertexOffset, _vertexFloatOffset = offsetInfo.byteOffset >> 2;
      vbuf = _buffer._vData, ibuf = _buffer._iData;
      uintVData = _buffer._uintVData; // fill indices

      ibuf.set(clippedTriangles, _indexOffset); // fill vertices contain x y u v light color dark color

      if (_vertexEffect) {
        for (var _v2 = 0, _n2 = clippedVertices.length, offset = _vertexFloatOffset; _v2 < _n2; _v2 += _perClipVertexSize, offset += _perVertexSize) {
          _tempPos.x = clippedVertices[_v2];
          _tempPos.y = clippedVertices[_v2 + 1];

          _finalColor.set(clippedVertices[_v2 + 2], clippedVertices[_v2 + 3], clippedVertices[_v2 + 4], clippedVertices[_v2 + 5]);

          _tempUv.x = clippedVertices[_v2 + 6];
          _tempUv.y = clippedVertices[_v2 + 7];

          if (_useTint) {
            _darkColor.set(clippedVertices[_v2 + 8], clippedVertices[_v2 + 9], clippedVertices[_v2 + 10], clippedVertices[_v2 + 11]);
          } else {
            _darkColor.set(0, 0, 0, 0);
          }

          _vertexEffect.transform(_tempPos, _tempUv, _finalColor, _darkColor);

          vbuf[offset] = _tempPos.x; // x

          vbuf[offset + 1] = _tempPos.y; // y

          vbuf[offset + 2] = _tempUv.x; // u

          vbuf[offset + 3] = _tempUv.y; // v

          uintVData[offset + 4] = _spineColorToInt32(_finalColor);

          if (_useTint) {
            uintVData[offset + 5] = _spineColorToInt32(_darkColor);
          }
        }
      } else {
        for (var _v3 = 0, _n3 = clippedVertices.length, _offset = _vertexFloatOffset; _v3 < _n3; _v3 += _perClipVertexSize, _offset += _perVertexSize) {
          vbuf[_offset] = clippedVertices[_v3]; // x

          vbuf[_offset + 1] = clippedVertices[_v3 + 1]; // y

          vbuf[_offset + 2] = clippedVertices[_v3 + 6]; // u

          vbuf[_offset + 3] = clippedVertices[_v3 + 7]; // v

          _finalColor32 = (clippedVertices[_v3 + 5] << 24 >>> 0) + (clippedVertices[_v3 + 4] << 16) + (clippedVertices[_v3 + 3] << 8) + clippedVertices[_v3 + 2];
          uintVData[_offset + 4] = _finalColor32;

          if (_useTint) {
            _darkColor32 = (clippedVertices[_v3 + 11] << 24 >>> 0) + (clippedVertices[_v3 + 10] << 16) + (clippedVertices[_v3 + 9] << 8) + clippedVertices[_v3 + 8];
            uintVData[_offset + 5] = _darkColor32;
          }
        }
      }
    }
  };

  _proto.realTimeTraverse = function realTimeTraverse(worldMat) {
    var vbuf;
    var ibuf;
    var locSkeleton = _comp._skeleton;
    var skeletonColor = locSkeleton.color;
    var graphics = _comp._debugRenderer;
    var clipper = _comp._clipper;
    var material = null;
    var attachment, attachmentColor, slotColor, uvs, triangles;
    var isRegion, isMesh, isClip;
    var offsetInfo;
    var slot;
    var worldMatm;
    _slotRangeStart = _comp._startSlotIndex;
    _slotRangeEnd = _comp._endSlotIndex;
    _inRange = false;
    if (_slotRangeStart == -1) _inRange = true;
    _debugSlots = _comp.debugSlots;
    _debugBones = _comp.debugBones;
    _debugMesh = _comp.debugMesh;

    if (graphics && (_debugBones || _debugSlots || _debugMesh)) {
      graphics.clear();
      graphics.lineWidth = 2;
    } // x y u v r1 g1 b1 a1 r2 g2 b2 a2 or x y u v r g b a 


    _perClipVertexSize = _useTint ? 12 : 8;
    _vertexFloatCount = 0;
    _vertexFloatOffset = 0;
    _vertexOffset = 0;
    _indexCount = 0;
    _indexOffset = 0;

    for (var slotIdx = 0, slotCount = locSkeleton.drawOrder.length; slotIdx < slotCount; slotIdx++) {
      slot = locSkeleton.drawOrder[slotIdx];

      if (_slotRangeStart >= 0 && _slotRangeStart == slot.data.index) {
        _inRange = true;
      }

      if (!_inRange) {
        clipper.clipEndWithSlot(slot);
        continue;
      }

      if (_slotRangeEnd >= 0 && _slotRangeEnd == slot.data.index) {
        _inRange = false;
      }

      _vertexFloatCount = 0;
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

      material = _getSlotMaterial(attachment.region.texture._texture, slot.data.blendMode);

      if (!material) {
        clipper.clipEndWithSlot(slot);
        continue;
      } //启用宏定义


      var useHsl = attachment._hslEnable ? true : false;

      if (material.getDefine('USE_HSL', 0) != undefined) {
        material.define('USE_HSL', useHsl);
      }

      if (useHsl && attachment._colorH != undefined && attachment._colorS != undefined && attachment._colorL != undefined) {
        var _colorArray = new cc.Vec4(attachment._colorH, attachment._colorS, attachment._colorL, 1);

        material.setProperty("hsl", _colorArray, void 0, true);
      }

      if (_mustFlush || material.getHash() !== _renderer.material.getHash()) {
        _mustFlush = false;

        _renderer._flush();

        _renderer.node = _node;
        _renderer.material = material;
      }

      if (isRegion) {
        triangles = _quadTriangles; // insure capacity

        _vertexFloatCount = 4 * _perVertexSize;
        _indexCount = 6;
        offsetInfo = _buffer.request(4, 6);
        _indexOffset = offsetInfo.indiceOffset, _vertexOffset = offsetInfo.vertexOffset, _vertexFloatOffset = offsetInfo.byteOffset >> 2;
        vbuf = _buffer._vData, ibuf = _buffer._iData; // compute vertex and fill x y

        attachment.computeWorldVertices(slot.bone, vbuf, _vertexFloatOffset, _perVertexSize); // draw debug slots if enabled graphics

        if (graphics && _debugSlots) {
          graphics.strokeColor = _slotColor;
          graphics.moveTo(vbuf[_vertexFloatOffset], vbuf[_vertexFloatOffset + 1]);

          for (var ii = _vertexFloatOffset + _perVertexSize, nn = _vertexFloatOffset + _vertexFloatCount; ii < nn; ii += _perVertexSize) {
            graphics.lineTo(vbuf[ii], vbuf[ii + 1]);
          }

          graphics.close();
          graphics.stroke();
        }
      } else if (isMesh) {
        triangles = attachment.triangles; // insure capacity

        _vertexFloatCount = (attachment.worldVerticesLength >> 1) * _perVertexSize;
        _indexCount = triangles.length;
        offsetInfo = _buffer.request(_vertexFloatCount / _perVertexSize, _indexCount);
        _indexOffset = offsetInfo.indiceOffset, _vertexOffset = offsetInfo.vertexOffset, _vertexFloatOffset = offsetInfo.byteOffset >> 2;
        vbuf = _buffer._vData, ibuf = _buffer._iData; // compute vertex and fill x y

        attachment.computeWorldVertices(slot, 0, attachment.worldVerticesLength, vbuf, _vertexFloatOffset, _perVertexSize); // draw debug mesh if enabled graphics

        if (graphics && _debugMesh) {
          graphics.strokeColor = _meshColor;

          for (var _ii = 0, _nn = triangles.length; _ii < _nn; _ii += 3) {
            var v1 = triangles[_ii] * _perVertexSize + _vertexFloatOffset;
            var v2 = triangles[_ii + 1] * _perVertexSize + _vertexFloatOffset;
            var v3 = triangles[_ii + 2] * _perVertexSize + _vertexFloatOffset;
            graphics.moveTo(vbuf[v1], vbuf[v1 + 1]);
            graphics.lineTo(vbuf[v2], vbuf[v2 + 1]);
            graphics.lineTo(vbuf[v3], vbuf[v3 + 1]);
            graphics.close();
            graphics.stroke();
          }
        }
      }

      if (_vertexFloatCount == 0 || _indexCount == 0) {
        clipper.clipEndWithSlot(slot);
        continue;
      } // fill indices


      ibuf.set(triangles, _indexOffset); // fill u v

      uvs = attachment.uvs;

      for (var v = _vertexFloatOffset, n = _vertexFloatOffset + _vertexFloatCount, u = 0; v < n; v += _perVertexSize, u += 2) {
        vbuf[v + 2] = uvs[u]; // u

        vbuf[v + 3] = uvs[u + 1]; // v
      }

      attachmentColor = attachment.color, slotColor = slot.color;
      this.fillVertices(skeletonColor, attachmentColor, slotColor, clipper, slot);

      if (_indexCount > 0) {
        for (var _ii2 = _indexOffset, _nn2 = _indexOffset + _indexCount; _ii2 < _nn2; _ii2++) {
          ibuf[_ii2] += _vertexOffset;
        }

        if (worldMat) {
          worldMatm = worldMat.m;
          _m00 = worldMatm[0];
          _m04 = worldMatm[4];
          _m12 = worldMatm[12];
          _m01 = worldMatm[1];
          _m05 = worldMatm[5];
          _m13 = worldMatm[13];

          for (var _ii3 = _vertexFloatOffset, _nn3 = _vertexFloatOffset + _vertexFloatCount; _ii3 < _nn3; _ii3 += _perVertexSize) {
            _x = vbuf[_ii3];
            _y = vbuf[_ii3 + 1];
            vbuf[_ii3] = _x * _m00 + _y * _m04 + _m12;
            vbuf[_ii3 + 1] = _x * _m01 + _y * _m05 + _m13;
          }
        }

        _buffer.adjust(_vertexFloatCount / _perVertexSize, _indexCount);
      }

      clipper.clipEndWithSlot(slot);
    }

    clipper.clipEnd();

    if (graphics && _debugBones) {
      var bone;
      graphics.strokeColor = _boneColor;
      graphics.fillColor = _slotColor; // Root bone color is same as slot color.

      for (var i = 0, _n4 = locSkeleton.bones.length; i < _n4; i++) {
        bone = locSkeleton.bones[i];
        var x = bone.data.length * bone.a + bone.worldX;
        var y = bone.data.length * bone.c + bone.worldY; // Bone lengths.

        graphics.moveTo(bone.worldX, bone.worldY);
        graphics.lineTo(x, y);
        graphics.stroke(); // Bone origins.

        graphics.circle(bone.worldX, bone.worldY, Math.PI * 1.5);
        graphics.fill();

        if (i === 0) {
          graphics.fillColor = _originColor;
        }
      }
    }
  };

  _proto.cacheTraverse = function cacheTraverse(worldMat) {
    var frame = _comp._curFrame;
    if (!frame) return;
    var segments = frame.segments;
    if (segments.length == 0) return;
    var vbuf, ibuf, uintbuf;
    var material;
    var offsetInfo;
    var vertices = frame.vertices;
    var indices = frame.indices;
    var worldMatm;
    var frameVFOffset = 0,
        frameIndexOffset = 0,
        segVFCount = 0;

    if (worldMat) {
      worldMatm = worldMat.m;
      _m00 = worldMatm[0];
      _m01 = worldMatm[1];
      _m04 = worldMatm[4];
      _m05 = worldMatm[5];
      _m12 = worldMatm[12];
      _m13 = worldMatm[13];
    }

    var justTranslate = _m00 === 1 && _m01 === 0 && _m04 === 0 && _m05 === 1;
    var needBatch = _handleVal & FLAG_BATCH;
    var calcTranslate = needBatch && justTranslate;
    var colorOffset = 0;
    var colors = frame.colors;
    var nowColor = colors[colorOffset++];
    var maxVFOffset = nowColor.vfOffset;

    _handleColor(nowColor);

    for (var i = 0, n = segments.length; i < n; i++) {
      var segInfo = segments[i];
      material = _getSlotMaterial(segInfo.tex, segInfo.blendMode);
      if (!material) continue;

      if (_mustFlush || material.getHash() !== _renderer.material.getHash()) {
        _mustFlush = false;

        _renderer._flush();

        _renderer.node = _node;
        _renderer.material = material;
      }

      _vertexCount = segInfo.vertexCount;
      _indexCount = segInfo.indexCount;
      offsetInfo = _buffer.request(_vertexCount, _indexCount);
      _indexOffset = offsetInfo.indiceOffset;
      _vertexOffset = offsetInfo.vertexOffset;
      _vfOffset = offsetInfo.byteOffset >> 2;
      vbuf = _buffer._vData;
      ibuf = _buffer._iData;
      uintbuf = _buffer._uintVData;

      for (var ii = _indexOffset, il = _indexOffset + _indexCount; ii < il; ii++) {
        ibuf[ii] = _vertexOffset + indices[frameIndexOffset++];
      }

      segVFCount = segInfo.vfCount;
      vbuf.set(vertices.subarray(frameVFOffset, frameVFOffset + segVFCount), _vfOffset);
      frameVFOffset += segVFCount;

      if (calcTranslate) {
        for (var _ii4 = _vfOffset, _il = _vfOffset + segVFCount; _ii4 < _il; _ii4 += 6) {
          vbuf[_ii4] += _m12;
          vbuf[_ii4 + 1] += _m13;
        }
      } else if (needBatch) {
        for (var _ii5 = _vfOffset, _il2 = _vfOffset + segVFCount; _ii5 < _il2; _ii5 += 6) {
          _x = vbuf[_ii5];
          _y = vbuf[_ii5 + 1];
          vbuf[_ii5] = _x * _m00 + _y * _m04 + _m12;
          vbuf[_ii5 + 1] = _x * _m01 + _y * _m05 + _m13;
        }
      }

      _buffer.adjust(_vertexCount, _indexCount);

      if (!_needColor) continue; // handle color

      var frameColorOffset = frameVFOffset - segVFCount;

      for (var _ii6 = _vfOffset + 4, _il3 = _vfOffset + 4 + segVFCount; _ii6 < _il3; _ii6 += 6, frameColorOffset += 6) {
        if (frameColorOffset >= maxVFOffset) {
          nowColor = colors[colorOffset++];

          _handleColor(nowColor);

          maxVFOffset = nowColor.vfOffset;
        }

        uintbuf[_ii6] = _finalColor32;
        uintbuf[_ii6 + 1] = _darkColor32;
      }
    }
  };

  _proto.fillBuffers = function fillBuffers(comp, renderer) {
    var node = comp.node;
    node._renderFlag |= RenderFlow.FLAG_UPDATE_RENDER_DATA;
    if (!comp._skeleton) return;
    var nodeColor = node._color;
    _nodeR = nodeColor.r / 255;
    _nodeG = nodeColor.g / 255;
    _nodeB = nodeColor.b / 255;
    _nodeA = nodeColor.a / 255;
    _useTint = comp.useTint || comp.isAnimationCached();
    _vertexFormat = _useTint ? VFTwoColor : VFOneColor; // x y u v color1 color2 or x y u v color

    _perVertexSize = _useTint ? 6 : 5;
    _node = comp.node;
    _buffer = renderer.getBuffer('spine', _vertexFormat);
    _renderer = renderer;
    _comp = comp;
    _mustFlush = true;
    _premultipliedAlpha = comp.premultipliedAlpha;
    _multiplier = 1.0;
    _handleVal = 0x00;
    _needColor = false;
    _vertexEffect = comp._effectDelegate && comp._effectDelegate._vertexEffect;

    if (nodeColor._val !== 0xffffffff || _premultipliedAlpha) {
      _needColor = true;
    }

    if (_useTint) {
      _handleVal |= FLAG_TWO_COLOR;
    }

    var worldMat = undefined;

    if (_comp.enableBatch) {
      worldMat = _node._worldMatrix;
      _mustFlush = false;
      _handleVal |= FLAG_BATCH;
    }

    if (comp.isAnimationCached()) {
      // Traverse input assembler.
      this.cacheTraverse(worldMat);
    } else {
      if (_vertexEffect) _vertexEffect.begin(comp._skeleton);
      this.realTimeTraverse(worldMat);
      if (_vertexEffect) _vertexEffect.end();
    } // sync attached node matrix


    renderer.worldMatDirty++;

    comp.attachUtil._syncAttachedNode(); // Clear temp var.


    _node = undefined;
    _buffer = undefined;
    _renderer = undefined;
    _comp = undefined;
    _vertexEffect = null;
  };

  _proto.postFillBuffers = function postFillBuffers(comp, renderer) {
    renderer.worldMatDirty--;
  };

  return SpineAssembler;
}(_assembler["default"]);

exports["default"] = SpineAssembler;

_assembler["default"].register(Skeleton, SpineAssembler);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNwaW5lLWFzc2VtYmxlci5qcyJdLCJuYW1lcyI6WyJTa2VsZXRvbiIsInJlcXVpcmUiLCJzcGluZSIsIlJlbmRlckZsb3ciLCJWZXJ0ZXhGb3JtYXQiLCJWRk9uZUNvbG9yIiwidmZtdFBvc1V2Q29sb3IiLCJWRlR3b0NvbG9yIiwidmZtdFBvc1V2VHdvQ29sb3IiLCJnZngiLCJjYyIsIkZMQUdfQkFUQ0giLCJGTEFHX1RXT19DT0xPUiIsIl9oYW5kbGVWYWwiLCJfcXVhZFRyaWFuZ2xlcyIsIl9zbG90Q29sb3IiLCJjb2xvciIsIl9ib25lQ29sb3IiLCJfb3JpZ2luQ29sb3IiLCJfbWVzaENvbG9yIiwiX2ZpbmFsQ29sb3IiLCJfZGFya0NvbG9yIiwiX3RlbXBQb3MiLCJfdGVtcFV2IiwiQ0NfTkFUSVZFUkVOREVSRVIiLCJDb2xvciIsIlZlY3RvcjIiLCJfcHJlbXVsdGlwbGllZEFscGhhIiwiX211bHRpcGxpZXIiLCJfc2xvdFJhbmdlU3RhcnQiLCJfc2xvdFJhbmdlRW5kIiwiX3VzZVRpbnQiLCJfZGVidWdTbG90cyIsIl9kZWJ1Z0JvbmVzIiwiX2RlYnVnTWVzaCIsIl9ub2RlUiIsIl9ub2RlRyIsIl9ub2RlQiIsIl9ub2RlQSIsIl9maW5hbENvbG9yMzIiLCJfZGFya0NvbG9yMzIiLCJfdmVydGV4Rm9ybWF0IiwiX3BlclZlcnRleFNpemUiLCJfcGVyQ2xpcFZlcnRleFNpemUiLCJfdmVydGV4RmxvYXRDb3VudCIsIl92ZXJ0ZXhDb3VudCIsIl92ZXJ0ZXhGbG9hdE9mZnNldCIsIl92ZXJ0ZXhPZmZzZXQiLCJfaW5kZXhDb3VudCIsIl9pbmRleE9mZnNldCIsIl92Zk9mZnNldCIsIl90ZW1wciIsIl90ZW1wZyIsIl90ZW1wYiIsIl9pblJhbmdlIiwiX211c3RGbHVzaCIsIl94IiwiX3kiLCJfbTAwIiwiX20wNCIsIl9tMTIiLCJfbTAxIiwiX20wNSIsIl9tMTMiLCJfciIsIl9nIiwiX2IiLCJfZnIiLCJfZmciLCJfZmIiLCJfZmEiLCJfZHIiLCJfZGciLCJfZGIiLCJfZGEiLCJfY29tcCIsIl9idWZmZXIiLCJfcmVuZGVyZXIiLCJfbm9kZSIsIl9uZWVkQ29sb3IiLCJfdmVydGV4RWZmZWN0IiwiX2dldFNsb3RNYXRlcmlhbCIsInRleCIsImJsZW5kTW9kZSIsInNyYyIsImRzdCIsIkJsZW5kTW9kZSIsIkFkZGl0aXZlIiwibWFjcm8iLCJPTkUiLCJTUkNfQUxQSEEiLCJNdWx0aXBseSIsIkRTVF9DT0xPUiIsIk9ORV9NSU5VU19TUkNfQUxQSEEiLCJTY3JlZW4iLCJPTkVfTUlOVVNfU1JDX0NPTE9SIiwiTm9ybWFsIiwidXNlTW9kZWwiLCJlbmFibGVCYXRjaCIsImJhc2VNYXRlcmlhbCIsIl9tYXRlcmlhbHMiLCJrZXkiLCJnZXRJZCIsIm1hdGVyaWFsQ2FjaGUiLCJfbWF0ZXJpYWxDYWNoZSIsIm1hdGVyaWFsIiwiTWF0ZXJpYWxWYXJpYW50IiwiY3JlYXRlIiwiZGVmaW5lIiwic2V0UHJvcGVydHkiLCJzZXRCbGVuZCIsIkJMRU5EX0ZVTkNfQUREIiwiX2hhbmRsZUNvbG9yIiwiZmEiLCJmciIsImZnIiwiZmIiLCJkciIsImRnIiwiZGIiLCJfc3BpbmVDb2xvclRvSW50MzIiLCJzcGluZUNvbG9yIiwiYSIsImIiLCJnIiwiciIsIlNwaW5lQXNzZW1ibGVyIiwidXBkYXRlUmVuZGVyRGF0YSIsImNvbXAiLCJpc0FuaW1hdGlvbkNhY2hlZCIsInNrZWxldG9uIiwiX3NrZWxldG9uIiwidXBkYXRlV29ybGRUcmFuc2Zvcm0iLCJmaWxsVmVydGljZXMiLCJza2VsZXRvbkNvbG9yIiwiYXR0YWNobWVudENvbG9yIiwic2xvdENvbG9yIiwiY2xpcHBlciIsInNsb3QiLCJ2YnVmIiwiX3ZEYXRhIiwiaWJ1ZiIsIl9pRGF0YSIsInVpbnRWRGF0YSIsIl91aW50VkRhdGEiLCJvZmZzZXRJbmZvIiwiZGFya0NvbG9yIiwic2V0IiwiaXNDbGlwcGluZyIsInYiLCJuIiwieCIsInkiLCJ0cmFuc2Zvcm0iLCJ1dnMiLCJzdWJhcnJheSIsImNsaXBUcmlhbmdsZXMiLCJjbGlwcGVkVmVydGljZXMiLCJGbG9hdDMyQXJyYXkiLCJjbGlwcGVkVHJpYW5nbGVzIiwibGVuZ3RoIiwicmVxdWVzdCIsImluZGljZU9mZnNldCIsInZlcnRleE9mZnNldCIsImJ5dGVPZmZzZXQiLCJvZmZzZXQiLCJyZWFsVGltZVRyYXZlcnNlIiwid29ybGRNYXQiLCJsb2NTa2VsZXRvbiIsImdyYXBoaWNzIiwiX2RlYnVnUmVuZGVyZXIiLCJfY2xpcHBlciIsImF0dGFjaG1lbnQiLCJ0cmlhbmdsZXMiLCJpc1JlZ2lvbiIsImlzTWVzaCIsImlzQ2xpcCIsIndvcmxkTWF0bSIsIl9zdGFydFNsb3RJbmRleCIsIl9lbmRTbG90SW5kZXgiLCJkZWJ1Z1Nsb3RzIiwiZGVidWdCb25lcyIsImRlYnVnTWVzaCIsImNsZWFyIiwibGluZVdpZHRoIiwic2xvdElkeCIsInNsb3RDb3VudCIsImRyYXdPcmRlciIsImRhdGEiLCJpbmRleCIsImNsaXBFbmRXaXRoU2xvdCIsImdldEF0dGFjaG1lbnQiLCJSZWdpb25BdHRhY2htZW50IiwiTWVzaEF0dGFjaG1lbnQiLCJDbGlwcGluZ0F0dGFjaG1lbnQiLCJjbGlwU3RhcnQiLCJyZWdpb24iLCJ0ZXh0dXJlIiwiX3RleHR1cmUiLCJ1c2VIc2wiLCJfaHNsRW5hYmxlIiwiZ2V0RGVmaW5lIiwidW5kZWZpbmVkIiwiX2NvbG9ySCIsIl9jb2xvclMiLCJfY29sb3JMIiwiX2NvbG9yQXJyYXkiLCJWZWM0IiwiZ2V0SGFzaCIsIl9mbHVzaCIsIm5vZGUiLCJjb21wdXRlV29ybGRWZXJ0aWNlcyIsImJvbmUiLCJzdHJva2VDb2xvciIsIm1vdmVUbyIsImlpIiwibm4iLCJsaW5lVG8iLCJjbG9zZSIsInN0cm9rZSIsIndvcmxkVmVydGljZXNMZW5ndGgiLCJ2MSIsInYyIiwidjMiLCJ1IiwibSIsImFkanVzdCIsImNsaXBFbmQiLCJmaWxsQ29sb3IiLCJpIiwiYm9uZXMiLCJ3b3JsZFgiLCJjIiwid29ybGRZIiwiY2lyY2xlIiwiTWF0aCIsIlBJIiwiZmlsbCIsImNhY2hlVHJhdmVyc2UiLCJmcmFtZSIsIl9jdXJGcmFtZSIsInNlZ21lbnRzIiwidWludGJ1ZiIsInZlcnRpY2VzIiwiaW5kaWNlcyIsImZyYW1lVkZPZmZzZXQiLCJmcmFtZUluZGV4T2Zmc2V0Iiwic2VnVkZDb3VudCIsImp1c3RUcmFuc2xhdGUiLCJuZWVkQmF0Y2giLCJjYWxjVHJhbnNsYXRlIiwiY29sb3JPZmZzZXQiLCJjb2xvcnMiLCJub3dDb2xvciIsIm1heFZGT2Zmc2V0IiwidmZPZmZzZXQiLCJzZWdJbmZvIiwidmVydGV4Q291bnQiLCJpbmRleENvdW50IiwiaWwiLCJ2ZkNvdW50IiwiZnJhbWVDb2xvck9mZnNldCIsImZpbGxCdWZmZXJzIiwicmVuZGVyZXIiLCJfcmVuZGVyRmxhZyIsIkZMQUdfVVBEQVRFX1JFTkRFUl9EQVRBIiwibm9kZUNvbG9yIiwiX2NvbG9yIiwidXNlVGludCIsImdldEJ1ZmZlciIsInByZW11bHRpcGxpZWRBbHBoYSIsIl9lZmZlY3REZWxlZ2F0ZSIsIl92YWwiLCJfd29ybGRNYXRyaXgiLCJiZWdpbiIsImVuZCIsIndvcmxkTWF0RGlydHkiLCJhdHRhY2hVdGlsIiwiX3N5bmNBdHRhY2hlZE5vZGUiLCJwb3N0RmlsbEJ1ZmZlcnMiLCJBc3NlbWJsZXIiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7Ozs7O0FBRUEsSUFBTUEsUUFBUSxHQUFHQyxPQUFPLENBQUMsWUFBRCxDQUF4Qjs7QUFDQSxJQUFNQyxLQUFLLEdBQUdELE9BQU8sQ0FBQyxhQUFELENBQXJCOztBQUNBLElBQU1FLFVBQVUsR0FBR0YsT0FBTyxDQUFDLHlDQUFELENBQTFCOztBQUNBLElBQU1HLFlBQVksR0FBR0gsT0FBTyxDQUFDLGlEQUFELENBQTVCOztBQUNBLElBQU1JLFVBQVUsR0FBR0QsWUFBWSxDQUFDRSxjQUFoQztBQUNBLElBQU1DLFVBQVUsR0FBR0gsWUFBWSxDQUFDSSxpQkFBaEM7QUFDQSxJQUFNQyxHQUFHLEdBQUdDLEVBQUUsQ0FB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QUFJLENBQUNDLGlCQUFMLEVBQUosRUFBOEI7QUFDMUI7QUFDQSxXQUFLNkcsYUFBTCxDQUFtQnZFLFFBQW5CO0FBQ0gsS0FIRCxNQUdPO0FBQ0gsVUFBSXZGLGFBQUosRUFBbUJBLGFBQWEsQ0FBQ2tNLEtBQWQsQ0FBb0JsSixJQUFJLENBQUNHLFNBQXpCO0FBQ25CLFdBQUttQyxnQkFBTCxDQUFzQkMsUUFBdEI7QUFDQSxVQUFJdkYsYUFBSixFQUFtQkEsYUFBYSxDQUFDbU0sR0FBZDtBQUN0QixLQW5Ed0IsQ0FxRHpCOzs7QUFDQVosSUFBQUEsUUFBUSxDQUFDYSxhQUFUOztBQUNBcEosSUFBQUEsSUFBSSxDQUFDcUosVUFBTCxDQUFnQkMsaUJBQWhCLEdBdkR5QixDQXlEekI7OztBQUNBeE0sSUFBQUEsS0FBSyxHQUFHNEgsU0FBUjtBQUNBOUgsSUFBQUEsT0FBTyxHQUFHOEgsU0FBVjtBQUNBN0gsSUFBQUEsU0FBUyxHQUFHNkgsU0FBWjtBQUNBL0gsSUFBQUEsS0FBSyxHQUFHK0gsU0FBUjtBQUNBMUgsSUFBQUEsYUFBYSxHQUFHLElBQWhCO0FBQ0g7O1NBRUR1TSxrQkFBQSx5QkFBaUJ2SixJQUFqQixFQUF1QnVJLFFBQXZCLEVBQWlDO0FBQzdCQSxJQUFBQSxRQUFRLENBQUNhLGFBQVQ7QUFDSDs7O0VBaGhCdUNJOzs7O0FBbWhCNUNBLHNCQUFVQyxRQUFWLENBQW1CelIsUUFBbkIsRUFBNkI4SCxjQUE3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCBBc3NlbWJsZXIgZnJvbSAnLi4vLi4vY29jb3MyZC9jb3JlL3JlbmRlcmVyL2Fzc2VtYmxlcic7XG5cbmNvbnN0IFNrZWxldG9uID0gcmVxdWlyZSgnLi9Ta2VsZXRvbicpO1xuY29uc3Qgc3BpbmUgPSByZXF1aXJlKCcuL2xpYi9zcGluZScpO1xuY29uc3QgUmVuZGVyRmxvdyA9IHJlcXVpcmUoJy4uLy4uL2NvY29zMmQvY29yZS9yZW5kZXJlci9yZW5kZXItZmxvdycpO1xuY29uc3QgVmVydGV4Rm9ybWF0ID0gcmVxdWlyZSgnLi4vLi4vY29jb3MyZC9jb3JlL3JlbmRlcmVyL3dlYmdsL3ZlcnRleC1mb3JtYXQnKVxuY29uc3QgVkZPbmVDb2xvciA9IFZlcnRleEZvcm1hdC52Zm10UG9zVXZDb2xvcjtcbmNvbnN0IFZGVHdvQ29sb3IgPSBWZXJ0ZXhGb3JtYXQudmZtdFBvc1V2VHdvQ29sb3I7XG5jb25zdCBnZnggPSBjYy5nZng7XG5cbmNvbnN0IEZMQUdfQkFUQ0ggPSAweDEwO1xuY29uc3QgRkxBR19UV09fQ09MT1IgPSAweDAxO1xuXG5sZXQgX2hhbmRsZVZhbCA9IDB4MDA7XG5sZXQgX3F1YWRUcmlhbmdsZXMgPSBbMCwgMSwgMiwgMiwgMywgMF07XG5sZXQgX3Nsb3RDb2xvciA9IGNjLmNvbG9yKDAsIDAsIDI1NSwgMjU1KTtcbmxldCBfYm9uZUNvbG9yID0gY2MuY29sb3IoMjU1LCAwLCAwLCAyNTUpO1xubGV0IF9vcmlnaW5Db2xvciA9IGNjLmNvbG9yKDAsIDI1NSwgMCwgMjU1KTtcbmxldCBfbWVzaENvbG9yID0gY2MuY29sb3IoMjU1LCAyNTUsIDAsIDI1NSk7XG5cbmxldCBfZmluYWxDb2xvciA9IG51bGw7XG5sZXQgX2RhcmtDb2xvciA9IG51bGw7XG5sZXQgX3RlbXBQb3MgPSBudWxsLCBfdGVtcFV2ID0gbnVsbDtcbmlmICghQ0NfTkFUSVZFUkVOREVSRVIpIHtcbiAgICBfZmluYWxDb2xvciA9IG5ldyBzcGluZS5Db2xvcigxLCAxLCAxLCAxKTtcbiAgICBfZGFya0NvbG9yID0gbmV3IHNwaW5lLkNvbG9yKDEsIDEsIDEsIDEpO1xuICAgIF90ZW1wUG9zID0gbmV3IHNwaW5lLlZlY3RvcjIoKTtcbiAgICBfdGVtcFV2ID0gbmV3IHNwaW5lLlZlY3RvcjIoKTtcbn1cblxubGV0IF9wcmVtdWx0aXBsaWVkQWxwaGE7XG5sZXQgX211bHRpcGxpZXI7XG5sZXQgX3Nsb3RSYW5nZVN0YXJ0O1xubGV0IF9zbG90UmFuZ2VFbmQ7XG5sZXQgX3VzZVRpbnQ7XG5sZXQgX2RlYnVnU2xvdHM7XG5sZXQgX2RlYnVnQm9uZXM7XG5sZXQgX2RlYnVnTWVzaDtcbmxldCBfbm9kZVIsXG4gICAgX25vZGVHLFxuICAgIF9ub2RlQixcbiAgICBfbm9kZUE7XG5sZXQgX2ZpbmFsQ29sb3IzMiwgX2RhcmtDb2xvcjMyO1xubGV0IF92ZXJ0ZXhGb3JtYXQ7XG5sZXQgX3BlclZlcnRleFNpemU7XG5sZXQgX3BlckNsaXBWZXJ0ZXhTaXplO1xuXG5sZXQgX3ZlcnRleEZsb2F0Q291bnQgPSAwLCBfdmVydGV4Q291bnQgPSAwLCBfdmVydGV4RmxvYXRPZmZzZXQgPSAwLCBfdmVydGV4T2Zmc2V0ID0gMCxcbiAgICBfaW5kZXhDb3VudCA9IDAsIF9pbmRleE9mZnNldCA9IDAsIF92Zk9mZnNldCA9IDA7XG5sZXQgX3RlbXByLCBfdGVtcGcsIF90ZW1wYjtcbmxldCBfaW5SYW5nZTtcbmxldCBfbXVzdEZsdXNoO1xubGV0IF94LCBfeSwgX20wMCwgX20wNCwgX20xMiwgX20wMSwgX20wNSwgX20xMztcbmxldCBfciwgX2csIF9iLCBfZnIsIF9mZywgX2ZiLCBfZmEsIF9kciwgX2RnLCBfZGIsIF9kYTtcbmxldCBfY29tcCwgX2J1ZmZlciwgX3JlbmRlcmVyLCBfbm9kZSwgX25lZWRDb2xvciwgX3ZlcnRleEVmZmVjdDtcblxuZnVuY3Rpb24gX2dldFNsb3RNYXRlcmlhbCAodGV4LCBibGVuZE1vZGUpIHtcbiAgICBsZXQgc3JjLCBkc3Q7XG4gICAgc3dpdGNoIChibGVuZE1vZGUpIHtcbiAgICAgICAgY2FzZSBzcGluZS5CbGVuZE1vZGUuQWRkaXRpdmU6XG4gICAgICAgICAgICBzcmMgPSBfcHJlbXVsdGlwbGllZEFscGhhID8gY2MubWFjcm8uT05FIDogY2MubWFjcm8uU1JDX0FMUEhBO1xuICAgICAgICAgICAgZHN0ID0gY2MubWFjcm8uT05FO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2Ugc3BpbmUuQmxlbmRNb2RlLk11bHRpcGx5OlxuICAgICAgICAgICAgc3JjID0gY2MubWFjcm8uRFNUX0NPTE9SO1xuICAgICAgICAgICAgZHN0ID0gY2MubWFjcm8uT05FX01JTlVTX1NSQ19BTFBIQTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHNwaW5lLkJsZW5kTW9kZS5TY3JlZW46XG4gICAgICAgICAgICBzcmMgPSBjYy5tYWNyby5PTkU7XG4gICAgICAgICAgICBkc3QgPSBjYy5tYWNyby5PTkVfTUlOVVNfU1JDX0NPTE9SO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2Ugc3BpbmUuQmxlbmRNb2RlLk5vcm1hbDpcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHNyYyA9IF9wcmVtdWx0aXBsaWVkQWxwaGEgPyBjYy5tYWNyby5PTkUgOiBjYy5tYWNyby5TUkNfQUxQSEE7XG4gICAgICAgICAgICBkc3QgPSBjYy5tYWNyby5PTkVfTUlOVVNfU1JDX0FMUEhBO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIFxuICAgIGxldCB1c2VNb2RlbCA9ICFfY29tcC5lbmFibGVCYXRjaDtcbiAgICBsZXQgYmFzZU1hdGVyaWFsID0gX2NvbXAuX21hdGVyaWFsc1swXTtcbiAgICBpZiAoIWJhc2VNYXRlcmlhbCkgcmV0dXJuIG51bGw7XG5cbiAgICAvLyBUaGUga2V5IHVzZSB0byBmaW5kIGNvcnJlc3BvbmRpbmcgbWF0ZXJpYWxcbiAgICBsZXQga2V5ID0gdGV4LmdldElkKCkgKyBzcmMgKyBkc3QgKyBfdXNlVGludCArIHVzZU1vZGVsO1xuICAgIGxldCBtYXRlcmlhbENhY2hlID0gX2NvbXAuX21hdGVyaWFsQ2FjaGU7XG4gICAgbGV0IG1hdGVyaWFsID0gbWF0ZXJpYWxDYWNoZVtrZXldO1xuICAgIGlmICghbWF0ZXJpYWwpIHtcbiAgICAgICAgaWYgKCFtYXRlcmlhbENhY2hlLmJhc2VNYXRlcmlhbCkge1xuICAgICAgICAgICAgbWF0ZXJpYWwgPSBiYXNlTWF0ZXJpYWw7XG4gICAgICAgICAgICBtYXRlcmlhbENhY2hlLmJhc2VNYXRlcmlhbCA9IGJhc2VNYXRlcmlhbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1hdGVyaWFsID0gY2MuTWF0ZXJpYWxWYXJpYW50LmNyZWF0ZShiYXNlTWF0ZXJpYWwpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBtYXRlcmlhbC5kZWZpbmUoJ0NDX1VTRV9NT0RFTCcsIHVzZU1vZGVsKTtcbiAgICAgICAgbWF0ZXJpYWwuZGVmaW5lKCdVU0VfVElOVCcsIF91c2VUaW50KTtcbiAgICAgICAgLy8gdXBkYXRlIHRleHR1cmVcbiAgICAgICAgbWF0ZXJpYWwuc2V0UHJvcGVydHkoJ3RleHR1cmUnLCB0ZXgpO1xuXG4gICAgICAgIC8vIHVwZGF0ZSBibGVuZCBmdW5jdGlvblxuICAgICAgICBtYXRlcmlhbC5zZXRCbGVuZChcbiAgICAgICAgICAgIHRydWUsXG4gICAgICAgICAgICBnZnguQkxFTkRfRlVOQ19BREQsXG4gICAgICAgICAgICBzcmMsIGRzdCxcbiAgICAgICAgICAgIGdmeC5CTEVORF9GVU5DX0FERCxcbiAgICAgICAgICAgIHNyYywgZHN0XG4gICAgICAgICk7XG4gICAgICAgIG1hdGVyaWFsQ2FjaGVba2V5XSA9IG1hdGVyaWFsO1xuICAgIH1cbiAgICByZXR1cm4gbWF0ZXJpYWw7XG59XG5cbmZ1bmN0aW9uIF9oYW5kbGVDb2xvciAoY29sb3IpIHtcbiAgICAvLyB0ZW1wIHJnYiBoYXMgbXVsdGlwbHkgMjU1LCBzbyBuZWVkIGRpdmlkZSAyNTU7XG4gICAgX2ZhID0gY29sb3IuZmEgKiBfbm9kZUE7XG4gICAgX211bHRpcGxpZXIgPSBfcHJlbXVsdGlwbGllZEFscGhhID8gX2ZhIC8gMjU1IDogMTtcbiAgICBfciA9IF9ub2RlUiAqIF9tdWx0aXBsaWVyO1xuICAgIF9nID0gX25vZGVHICogX211bHRpcGxpZXI7XG4gICAgX2IgPSBfbm9kZUIgKiBfbXVsdGlwbGllcjtcblxuICAgIF9mciA9IGNvbG9yLmZyICogX3I7XG4gICAgX2ZnID0gY29sb3IuZmcgKiBfZztcbiAgICBfZmIgPSBjb2xvci5mYiAqIF9iO1xuICAgIF9maW5hbENvbG9yMzIgPSAoKF9mYTw8MjQpID4+PiAwKSArIChfZmI8PDE2KSArIChfZmc8PDgpICsgX2ZyO1xuXG4gICAgX2RyID0gY29sb3IuZHIgKiBfcjtcbiAgICBfZGcgPSBjb2xvci5kZyAqIF9nO1xuICAgIF9kYiA9IGNvbG9yLmRiICogX2I7XG4gICAgX2RhID0gX3ByZW11bHRpcGxpZWRBbHBoYSA/IDI1NSA6IDA7XG4gICAgX2RhcmtDb2xvcjMyID0gKChfZGE8PDI0KSA+Pj4gMCkgKyAoX2RiPDwxNikgKyAoX2RnPDw4KSArIF9kcjtcbn1cblxuZnVuY3Rpb24gX3NwaW5lQ29sb3JUb0ludDMyIChzcGluZUNvbG9yKSB7XG4gICAgcmV0dXJuICgoc3BpbmVDb2xvci5hPDwyNCkgPj4+IDApICsgKHNwaW5lQ29sb3IuYjw8MTYpICsgKHNwaW5lQ29sb3IuZzw8OCkgKyBzcGluZUNvbG9yLnI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNwaW5lQXNzZW1ibGVyIGV4dGVuZHMgQXNzZW1ibGVyIHtcbiAgICB1cGRhdGVSZW5kZXJEYXRhIChjb21wKSB7XG4gICAgICAgIGlmIChjb21wLmlzQW5pbWF0aW9uQ2FjaGVkKCkpIHJldHVybjtcbiAgICAgICAgbGV0IHNrZWxldG9uID0gY29tcC5fc2tlbGV0b247XG4gICAgICAgIGlmIChza2VsZXRvbikge1xuICAgICAgICAgICAgc2tlbGV0b24udXBkYXRlV29ybGRUcmFuc2Zvcm0oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbGxWZXJ0aWNlcyAoc2tlbGV0b25Db2xvciwgYXR0YWNobWVudENvbG9yLCBzbG90Q29sb3IsIGNsaXBwZXIsIHNsb3QpIHtcblxuICAgICAgICBsZXQgdmJ1ZiA9IF9idWZmZXIuX3ZEYXRhLFxuICAgICAgICAgICAgaWJ1ZiA9IF9idWZmZXIuX2lEYXRhLFxuICAgICAgICAgICAgdWludFZEYXRhID0gX2J1ZmZlci5fdWludFZEYXRhO1xuICAgICAgICBsZXQgb2Zmc2V0SW5mbztcblxuICAgICAgICBfZmluYWxDb2xvci5hID0gc2xvdENvbG9yLmEgKiBhdHRhY2htZW50Q29sb3IuYSAqIHNrZWxldG9uQ29sb3IuYSAqIF9ub2RlQSAqIDI1NTtcbiAgICAgICAgX211bHRpcGxpZXIgPSBfcHJlbXVsdGlwbGllZEFscGhhPyBfZmluYWxDb2xvci5hIDogMjU1O1xuICAgICAgICBfdGVtcHIgPSBfbm9kZVIgKiBhdHRhY2htZW50Q29sb3IuciAqIHNrZWxldG9uQ29sb3IuciAqIF9tdWx0aXBsaWVyO1xuICAgICAgICBfdGVtcGcgPSBfbm9kZUcgKiBhdHRhY2htZW50Q29sb3IuZyAqIHNrZWxldG9uQ29sb3IuZyAqIF9tdWx0aXBsaWVyO1xuICAgICAgICBfdGVtcGIgPSBfbm9kZUIgKiBhdHRhY2htZW50Q29sb3IuYiAqIHNrZWxldG9uQ29sb3IuYiAqIF9tdWx0aXBsaWVyO1xuICAgICAgICBcbiAgICAgICAgX2ZpbmFsQ29sb3IuciA9IF90ZW1wciAqIHNsb3RDb2xvci5yO1xuICAgICAgICBfZmluYWxDb2xvci5nID0gX3RlbXBnICogc2xvdENvbG9yLmc7XG4gICAgICAgIF9maW5hbENvbG9yLmIgPSBfdGVtcGIgKiBzbG90Q29sb3IuYjtcblxuICAgICAgICBpZiAoc2xvdC5kYXJrQ29sb3IgPT0gbnVsbCkge1xuICAgICAgICAgICAgX2RhcmtDb2xvci5zZXQoMC4wLCAwLjAsIDAuMCwgMS4wKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9kYXJrQ29sb3IuciA9IHNsb3QuZGFya0NvbG9yLnIgKiBfdGVtcHI7XG4gICAgICAgICAgICBfZGFya0NvbG9yLmcgPSBzbG90LmRhcmtDb2xvci5nICogX3RlbXBnO1xuICAgICAgICAgICAgX2RhcmtDb2xvci5iID0gc2xvdC5kYXJrQ29sb3IuYiAqIF90ZW1wYjtcbiAgICAgICAgfVxuICAgICAgICBfZGFya0NvbG9yLmEgPSBfcHJlbXVsdGlwbGllZEFscGhhID8gMjU1IDogMDtcblxuICAgICAgICBpZiAoIWNsaXBwZXIuaXNDbGlwcGluZygpKSB7XG4gICAgICAgICAgICBpZiAoX3ZlcnRleEVmZmVjdCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHYgPSBfdmVydGV4RmxvYXRPZmZzZXQsIG4gPSBfdmVydGV4RmxvYXRPZmZzZXQgKyBfdmVydGV4RmxvYXRDb3VudDsgdiA8IG47IHYgKz0gX3BlclZlcnRleFNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RlbXBQb3MueCA9IHZidWZbdl07XG4gICAgICAgICAgICAgICAgICAgIF90ZW1wUG9zLnkgPSB2YnVmW3YgKyAxXTtcbiAgICAgICAgICAgICAgICAgICAgX3RlbXBVdi54ID0gdmJ1Zlt2ICsgMl07XG4gICAgICAgICAgICAgICAgICAgIF90ZW1wVXYueSA9IHZidWZbdiArIDNdO1xuICAgICAgICAgICAgICAgICAgICBfdmVydGV4RWZmZWN0LnRyYW5zZm9ybShfdGVtcFBvcywgX3RlbXBVdiwgX2ZpbmFsQ29sb3IsIF9kYXJrQ29sb3IpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZidWZbdl0gICAgID0gX3RlbXBQb3MueDsgICAgICAgIC8vIHhcbiAgICAgICAgICAgICAgICAgICAgdmJ1Zlt2ICsgMV0gPSBfdGVtcFBvcy55OyAgICAgICAgLy8geVxuICAgICAgICAgICAgICAgICAgICB2YnVmW3YgKyAyXSA9IF90ZW1wVXYueDsgICAgICAgICAvLyB1XG4gICAgICAgICAgICAgICAgICAgIHZidWZbdiArIDNdID0gX3RlbXBVdi55OyAgICAgICAgIC8vIHZcbiAgICAgICAgICAgICAgICAgICAgdWludFZEYXRhW3YgKyA0XSAgPSBfc3BpbmVDb2xvclRvSW50MzIoX2ZpbmFsQ29sb3IpOyAgICAgICAgICAgICAgICAgIC8vIGxpZ2h0IGNvbG9yXG4gICAgICAgICAgICAgICAgICAgIF91c2VUaW50ICYmICh1aW50VkRhdGFbdiArIDVdID0gX3NwaW5lQ29sb3JUb0ludDMyKF9kYXJrQ29sb3IpKTsgICAgICAvLyBkYXJrIGNvbG9yXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfZmluYWxDb2xvcjMyID0gX3NwaW5lQ29sb3JUb0ludDMyKF9maW5hbENvbG9yKTtcbiAgICAgICAgICAgICAgICBfZGFya0NvbG9yMzIgPSBfc3BpbmVDb2xvclRvSW50MzIoX2RhcmtDb2xvcik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgdiA9IF92ZXJ0ZXhGbG9hdE9mZnNldCwgbiA9IF92ZXJ0ZXhGbG9hdE9mZnNldCArIF92ZXJ0ZXhGbG9hdENvdW50OyB2IDwgbjsgdiArPSBfcGVyVmVydGV4U2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICB1aW50VkRhdGFbdiArIDRdICA9IF9maW5hbENvbG9yMzI7ICAgICAgICAgICAgICAgICAgIC8vIGxpZ2h0IGNvbG9yXG4gICAgICAgICAgICAgICAgICAgIF91c2VUaW50ICYmICh1aW50VkRhdGFbdiArIDVdICA9IF9kYXJrQ29sb3IzMik7ICAgICAgLy8gZGFyayBjb2xvclxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCB1dnMgPSB2YnVmLnN1YmFycmF5KF92ZXJ0ZXhGbG9hdE9mZnNldCArIDIpO1xuICAgICAgICAgICAgY2xpcHBlci5jbGlwVHJpYW5nbGVzKHZidWYuc3ViYXJyYXkoX3ZlcnRleEZsb2F0T2Zmc2V0KSwgX3ZlcnRleEZsb2F0Q291bnQsIGlidWYuc3ViYXJyYXkoX2luZGV4T2Zmc2V0KSwgX2luZGV4Q291bnQsIHV2cywgX2ZpbmFsQ29sb3IsIF9kYXJrQ29sb3IsIF91c2VUaW50LCBfcGVyVmVydGV4U2l6ZSk7XG4gICAgICAgICAgICBsZXQgY2xpcHBlZFZlcnRpY2VzID0gbmV3IEZsb2F0MzJBcnJheShjbGlwcGVyLmNsaXBwZWRWZXJ0aWNlcyk7XG4gICAgICAgICAgICBsZXQgY2xpcHBlZFRyaWFuZ2xlcyA9IGNsaXBwZXIuY2xpcHBlZFRyaWFuZ2xlcztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gaW5zdXJlIGNhcGFjaXR5XG4gICAgICAgICAgICBfaW5kZXhDb3VudCA9IGNsaXBwZWRUcmlhbmdsZXMubGVuZ3RoO1xuICAgICAgICAgICAgX3ZlcnRleEZsb2F0Q291bnQgPSBjbGlwcGVkVmVydGljZXMubGVuZ3RoIC8gX3BlckNsaXBWZXJ0ZXhTaXplICogX3BlclZlcnRleFNpemU7XG5cbiAgICAgICAgICAgIG9mZnNldEluZm8gPSBfYnVmZmVyLnJlcXVlc3QoX3ZlcnRleEZsb2F0Q291bnQgLyBfcGVyVmVydGV4U2l6ZSwgX2luZGV4Q291bnQpO1xuICAgICAgICAgICAgX2luZGV4T2Zmc2V0ID0gb2Zmc2V0SW5mby5pbmRpY2VPZmZzZXQsXG4gICAgICAgICAgICBfdmVydGV4T2Zmc2V0ID0gb2Zmc2V0SW5mby52ZXJ0ZXhPZmZzZXQsXG4gICAgICAgICAgICBfdmVydGV4RmxvYXRPZmZzZXQgPSBvZmZzZXRJbmZvLmJ5dGVPZmZzZXQgPj4gMjtcbiAgICAgICAgICAgIHZidWYgPSBfYnVmZmVyLl92RGF0YSxcbiAgICAgICAgICAgIGlidWYgPSBfYnVmZmVyLl9pRGF0YTtcbiAgICAgICAgICAgIHVpbnRWRGF0YSA9IF9idWZmZXIuX3VpbnRWRGF0YTtcblxuICAgICAgICAgICAgLy8gZmlsbCBpbmRpY2VzXG4gICAgICAgICAgICBpYnVmLnNldChjbGlwcGVkVHJpYW5nbGVzLCBfaW5kZXhPZmZzZXQpO1xuXG4gICAgICAgICAgICAvLyBmaWxsIHZlcnRpY2VzIGNvbnRhaW4geCB5IHUgdiBsaWdodCBjb2xvciBkYXJrIGNvbG9yXG4gICAgICAgICAgICBpZiAoX3ZlcnRleEVmZmVjdCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHYgPSAwLCBuID0gY2xpcHBlZFZlcnRpY2VzLmxlbmd0aCwgb2Zmc2V0ID0gX3ZlcnRleEZsb2F0T2Zmc2V0OyB2IDwgbjsgdiArPSBfcGVyQ2xpcFZlcnRleFNpemUsIG9mZnNldCArPSBfcGVyVmVydGV4U2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICBfdGVtcFBvcy54ID0gY2xpcHBlZFZlcnRpY2VzW3ZdO1xuICAgICAgICAgICAgICAgICAgICBfdGVtcFBvcy55ID0gY2xpcHBlZFZlcnRpY2VzW3YgKyAxXTtcbiAgICAgICAgICAgICAgICAgICAgX2ZpbmFsQ29sb3Iuc2V0KGNsaXBwZWRWZXJ0aWNlc1t2ICsgMl0sIGNsaXBwZWRWZXJ0aWNlc1t2ICsgM10sIGNsaXBwZWRWZXJ0aWNlc1t2ICsgNF0sIGNsaXBwZWRWZXJ0aWNlc1t2ICsgNV0pO1xuICAgICAgICAgICAgICAgICAgICBfdGVtcFV2LnggPSBjbGlwcGVkVmVydGljZXNbdiArIDZdO1xuICAgICAgICAgICAgICAgICAgICBfdGVtcFV2LnkgPSBjbGlwcGVkVmVydGljZXNbdiArIDddO1xuICAgICAgICAgICAgICAgICAgICBpZiAoX3VzZVRpbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9kYXJrQ29sb3Iuc2V0KGNsaXBwZWRWZXJ0aWNlc1t2ICsgOF0sIGNsaXBwZWRWZXJ0aWNlc1t2ICsgOV0sIGNsaXBwZWRWZXJ0aWNlc1t2ICsgMTBdLCBjbGlwcGVkVmVydGljZXNbdiArIDExXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfZGFya0NvbG9yLnNldCgwLCAwLCAwLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBfdmVydGV4RWZmZWN0LnRyYW5zZm9ybShfdGVtcFBvcywgX3RlbXBVdiwgX2ZpbmFsQ29sb3IsIF9kYXJrQ29sb3IpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZidWZbb2Zmc2V0XSA9IF90ZW1wUG9zLng7ICAgICAgICAgICAgIC8vIHhcbiAgICAgICAgICAgICAgICAgICAgdmJ1ZltvZmZzZXQgKyAxXSA9IF90ZW1wUG9zLnk7ICAgICAgICAgLy8geVxuICAgICAgICAgICAgICAgICAgICB2YnVmW29mZnNldCArIDJdID0gX3RlbXBVdi54OyAgICAgICAgICAvLyB1XG4gICAgICAgICAgICAgICAgICAgIHZidWZbb2Zmc2V0ICsgM10gPSBfdGVtcFV2Lnk7ICAgICAgICAgIC8vIHZcbiAgICAgICAgICAgICAgICAgICAgdWludFZEYXRhW29mZnNldCArIDRdID0gX3NwaW5lQ29sb3JUb0ludDMyKF9maW5hbENvbG9yKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF91c2VUaW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1aW50VkRhdGFbb2Zmc2V0ICsgNV0gPSBfc3BpbmVDb2xvclRvSW50MzIoX2RhcmtDb2xvcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHYgPSAwLCBuID0gY2xpcHBlZFZlcnRpY2VzLmxlbmd0aCwgb2Zmc2V0ID0gX3ZlcnRleEZsb2F0T2Zmc2V0OyB2IDwgbjsgdiArPSBfcGVyQ2xpcFZlcnRleFNpemUsIG9mZnNldCArPSBfcGVyVmVydGV4U2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICB2YnVmW29mZnNldF0gICAgID0gY2xpcHBlZFZlcnRpY2VzW3ZdOyAgICAgICAgIC8vIHhcbiAgICAgICAgICAgICAgICAgICAgdmJ1ZltvZmZzZXQgKyAxXSA9IGNsaXBwZWRWZXJ0aWNlc1t2ICsgMV07ICAgICAvLyB5XG4gICAgICAgICAgICAgICAgICAgIHZidWZbb2Zmc2V0ICsgMl0gPSBjbGlwcGVkVmVydGljZXNbdiArIDZdOyAgICAgLy8gdVxuICAgICAgICAgICAgICAgICAgICB2YnVmW29mZnNldCArIDNdID0gY2xpcHBlZFZlcnRpY2VzW3YgKyA3XTsgICAgIC8vIHZcblxuICAgICAgICAgICAgICAgICAgICBfZmluYWxDb2xvcjMyID0gKChjbGlwcGVkVmVydGljZXNbdiArIDVdPDwyNCkgPj4+IDApICsgKGNsaXBwZWRWZXJ0aWNlc1t2ICsgNF08PDE2KSArIChjbGlwcGVkVmVydGljZXNbdiArIDNdPDw4KSArIGNsaXBwZWRWZXJ0aWNlc1t2ICsgMl07XG4gICAgICAgICAgICAgICAgICAgIHVpbnRWRGF0YVtvZmZzZXQgKyA0XSA9IF9maW5hbENvbG9yMzI7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKF91c2VUaW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfZGFya0NvbG9yMzIgPSAoKGNsaXBwZWRWZXJ0aWNlc1t2ICsgMTFdPDwyNCkgPj4+IDApICsgKGNsaXBwZWRWZXJ0aWNlc1t2ICsgMTBdPDwxNikgKyAoY2xpcHBlZFZlcnRpY2VzW3YgKyA5XTw8OCkgKyBjbGlwcGVkVmVydGljZXNbdiArIDhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdWludFZEYXRhW29mZnNldCArIDVdID0gX2RhcmtDb2xvcjMyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVhbFRpbWVUcmF2ZXJzZSAod29ybGRNYXQpIHtcbiAgICAgICAgbGV0IHZidWY7XG4gICAgICAgIGxldCBpYnVmO1xuXG4gICAgICAgIGxldCBsb2NTa2VsZXRvbiA9IF9jb21wLl9za2VsZXRvbjtcbiAgICAgICAgbGV0IHNrZWxldG9uQ29sb3IgPSBsb2NTa2VsZXRvbi5jb2xvcjtcbiAgICAgICAgbGV0IGdyYXBoaWNzID0gX2NvbXAuX2RlYnVnUmVuZGVyZXI7XG4gICAgICAgIGxldCBjbGlwcGVyID0gX2NvbXAuX2NsaXBwZXI7XG4gICAgICAgIGxldCBtYXRlcmlhbCA9IG51bGw7XG4gICAgICAgIGxldCBhdHRhY2htZW50LCBhdHRhY2htZW50Q29sb3IsIHNsb3RDb2xvciwgdXZzLCB0cmlhbmdsZXM7XG4gICAgICAgIGxldCBpc1JlZ2lvbiwgaXNNZXNoLCBpc0NsaXA7XG4gICAgICAgIGxldCBvZmZzZXRJbmZvO1xuICAgICAgICBsZXQgc2xvdDtcbiAgICAgICAgbGV0IHdvcmxkTWF0bTtcblxuICAgICAgICBfc2xvdFJhbmdlU3RhcnQgPSBfY29tcC5fc3RhcnRTbG90SW5kZXg7XG4gICAgICAgIF9zbG90UmFuZ2VFbmQgPSBfY29tcC5fZW5kU2xvdEluZGV4O1xuICAgICAgICBfaW5SYW5nZSA9IGZhbHNlO1xuICAgICAgICBpZiAoX3Nsb3RSYW5nZVN0YXJ0ID09IC0xKSBfaW5SYW5nZSA9IHRydWU7XG5cbiAgICAgICAgX2RlYnVnU2xvdHMgPSBfY29tcC5kZWJ1Z1Nsb3RzO1xuICAgICAgICBfZGVidWdCb25lcyA9IF9jb21wLmRlYnVnQm9uZXM7XG4gICAgICAgIF9kZWJ1Z01lc2ggPSBfY29tcC5kZWJ1Z01lc2g7XG4gICAgICAgIGlmIChncmFwaGljcyAmJiAoX2RlYnVnQm9uZXMgfHwgX2RlYnVnU2xvdHMgfHwgX2RlYnVnTWVzaCkpIHtcbiAgICAgICAgICAgIGdyYXBoaWNzLmNsZWFyKCk7XG4gICAgICAgICAgICBncmFwaGljcy5saW5lV2lkdGggPSAyO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIC8vIHggeSB1IHYgcjEgZzEgYjEgYTEgcjIgZzIgYjIgYTIgb3IgeCB5IHUgdiByIGcgYiBhIFxuICAgICAgICBfcGVyQ2xpcFZlcnRleFNpemUgPSBfdXNlVGludCA/IDEyIDogODtcbiAgICBcbiAgICAgICAgX3ZlcnRleEZsb2F0Q291bnQgPSAwO1xuICAgICAgICBfdmVydGV4RmxvYXRPZmZzZXQgPSAwO1xuICAgICAgICBfdmVydGV4T2Zmc2V0ID0gMDtcbiAgICAgICAgX2luZGV4Q291bnQgPSAwO1xuICAgICAgICBfaW5kZXhPZmZzZXQgPSAwO1xuXG4gICAgICAgIGZvciAobGV0IHNsb3RJZHggPSAwLCBzbG90Q291bnQgPSBsb2NTa2VsZXRvbi5kcmF3T3JkZXIubGVuZ3RoOyBzbG90SWR4IDwgc2xvdENvdW50OyBzbG90SWR4KyspIHtcbiAgICAgICAgICAgIHNsb3QgPSBsb2NTa2VsZXRvbi5kcmF3T3JkZXJbc2xvdElkeF07XG4gICAgXG4gICAgICAgICAgICBpZiAoX3Nsb3RSYW5nZVN0YXJ0ID49IDAgJiYgX3Nsb3RSYW5nZVN0YXJ0ID09IHNsb3QuZGF0YS5pbmRleCkge1xuICAgICAgICAgICAgICAgIF9pblJhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCFfaW5SYW5nZSkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgaWYgKF9zbG90UmFuZ2VFbmQgPj0gMCAmJiBfc2xvdFJhbmdlRW5kID09IHNsb3QuZGF0YS5pbmRleCkge1xuICAgICAgICAgICAgICAgIF9pblJhbmdlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICBfdmVydGV4RmxvYXRDb3VudCA9IDA7XG4gICAgICAgICAgICBfaW5kZXhDb3VudCA9IDA7XG5cbiAgICAgICAgICAgIGF0dGFjaG1lbnQgPSBzbG90LmdldEF0dGFjaG1lbnQoKTtcbiAgICAgICAgICAgIGlmICghYXR0YWNobWVudCkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpc1JlZ2lvbiA9IGF0dGFjaG1lbnQgaW5zdGFuY2VvZiBzcGluZS5SZWdpb25BdHRhY2htZW50O1xuICAgICAgICAgICAgaXNNZXNoID0gYXR0YWNobWVudCBpbnN0YW5jZW9mIHNwaW5lLk1lc2hBdHRhY2htZW50O1xuICAgICAgICAgICAgaXNDbGlwID0gYXR0YWNobWVudCBpbnN0YW5jZW9mIHNwaW5lLkNsaXBwaW5nQXR0YWNobWVudDtcblxuICAgICAgICAgICAgaWYgKGlzQ2xpcCkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcFN0YXJ0KHNsb3QsIGF0dGFjaG1lbnQpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWlzUmVnaW9uICYmICFpc01lc2gpIHtcbiAgICAgICAgICAgICAgICBjbGlwcGVyLmNsaXBFbmRXaXRoU2xvdChzbG90KTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbWF0ZXJpYWwgPSBfZ2V0U2xvdE1hdGVyaWFsKGF0dGFjaG1lbnQucmVnaW9uLnRleHR1cmUuX3RleHR1cmUsIHNsb3QuZGF0YS5ibGVuZE1vZGUpO1xuICAgICAgICAgICAgaWYgKCFtYXRlcmlhbCkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL+WQr+eUqOWuj+WumuS5iVxuICAgICAgICAgICAgbGV0IHVzZUhzbCA9IGF0dGFjaG1lbnQuX2hzbEVuYWJsZSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgIGlmIChtYXRlcmlhbC5nZXREZWZpbmUoJ1VTRV9IU0wnLDApICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG1hdGVyaWFsLmRlZmluZSgnVVNFX0hTTCcsIHVzZUhzbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh1c2VIc2wgJiYgYXR0YWNobWVudC5fY29sb3JIICE9IHVuZGVmaW5lZCAmJiBcbiAgICAgICAgICAgICAgICBhdHRhY2htZW50Ll9jb2xvclMgIT0gdW5kZWZpbmVkICYmIGF0dGFjaG1lbnQuX2NvbG9yTCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBsZXQgX2NvbG9yQXJyYXkgPSBuZXcgY2MuVmVjNChhdHRhY2htZW50Ll9jb2xvckgsYXR0YWNobWVudC5fY29sb3JTLGF0dGFjaG1lbnQuX2NvbG9yTCwxKTtcbiAgICAgICAgICAgICAgICBtYXRlcmlhbC5zZXRQcm9wZXJ0eShcImhzbFwiLF9jb2xvckFycmF5LHZvaWQgMCx0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF9tdXN0Rmx1c2ggfHwgbWF0ZXJpYWwuZ2V0SGFzaCgpICE9PSBfcmVuZGVyZXIubWF0ZXJpYWwuZ2V0SGFzaCgpKSB7XG4gICAgICAgICAgICAgICAgX211c3RGbHVzaCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIF9yZW5kZXJlci5fZmx1c2goKTtcbiAgICAgICAgICAgICAgICBfcmVuZGVyZXIubm9kZSA9IF9ub2RlO1xuICAgICAgICAgICAgICAgIF9yZW5kZXJlci5tYXRlcmlhbCA9IG1hdGVyaWFsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaXNSZWdpb24pIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0cmlhbmdsZXMgPSBfcXVhZFRyaWFuZ2xlcztcbiAgICBcbiAgICAgICAgICAgICAgICAvLyBpbnN1cmUgY2FwYWNpdHlcbiAgICAgICAgICAgICAgICBfdmVydGV4RmxvYXRDb3VudCA9IDQgKiBfcGVyVmVydGV4U2l6ZTtcbiAgICAgICAgICAgICAgICBfaW5kZXhDb3VudCA9IDY7XG5cbiAgICAgICAgICAgICAgICBvZmZzZXRJbmZvID0gX2J1ZmZlci5yZXF1ZXN0KDQsIDYpO1xuICAgICAgICAgICAgICAgIF9pbmRleE9mZnNldCA9IG9mZnNldEluZm8uaW5kaWNlT2Zmc2V0LFxuICAgICAgICAgICAgICAgIF92ZXJ0ZXhPZmZzZXQgPSBvZmZzZXRJbmZvLnZlcnRleE9mZnNldCxcbiAgICAgICAgICAgICAgICBfdmVydGV4RmxvYXRPZmZzZXQgPSBvZmZzZXRJbmZvLmJ5dGVPZmZzZXQgPj4gMjtcbiAgICAgICAgICAgICAgICB2YnVmID0gX2J1ZmZlci5fdkRhdGEsXG4gICAgICAgICAgICAgICAgaWJ1ZiA9IF9idWZmZXIuX2lEYXRhO1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIGNvbXB1dGUgdmVydGV4IGFuZCBmaWxsIHggeVxuICAgICAgICAgICAgICAgIGF0dGFjaG1lbnQuY29tcHV0ZVdvcmxkVmVydGljZXMoc2xvdC5ib25lLCB2YnVmLCBfdmVydGV4RmxvYXRPZmZzZXQsIF9wZXJWZXJ0ZXhTaXplKTtcbiAgICBcbiAgICAgICAgICAgICAgICAvLyBkcmF3IGRlYnVnIHNsb3RzIGlmIGVuYWJsZWQgZ3JhcGhpY3NcbiAgICAgICAgICAgICAgICBpZiAoZ3JhcGhpY3MgJiYgX2RlYnVnU2xvdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3Muc3Ryb2tlQ29sb3IgPSBfc2xvdENvbG9yO1xuICAgICAgICAgICAgICAgICAgICBncmFwaGljcy5tb3ZlVG8odmJ1ZltfdmVydGV4RmxvYXRPZmZzZXRdLCB2YnVmW192ZXJ0ZXhGbG9hdE9mZnNldCArIDFdKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaWkgPSBfdmVydGV4RmxvYXRPZmZzZXQgKyBfcGVyVmVydGV4U2l6ZSwgbm4gPSBfdmVydGV4RmxvYXRPZmZzZXQgKyBfdmVydGV4RmxvYXRDb3VudDsgaWkgPCBubjsgaWkgKz0gX3BlclZlcnRleFNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLmxpbmVUbyh2YnVmW2lpXSwgdmJ1ZltpaSArIDFdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBncmFwaGljcy5jbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICBncmFwaGljcy5zdHJva2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc01lc2gpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0cmlhbmdsZXMgPSBhdHRhY2htZW50LnRyaWFuZ2xlcztcbiAgICBcbiAgICAgICAgICAgICAgICAvLyBpbnN1cmUgY2FwYWNpdHlcbiAgICAgICAgICAgICAgICBfdmVydGV4RmxvYXRDb3VudCA9IChhdHRhY2htZW50LndvcmxkVmVydGljZXNMZW5ndGggPj4gMSkgKiBfcGVyVmVydGV4U2l6ZTtcbiAgICAgICAgICAgICAgICBfaW5kZXhDb3VudCA9IHRyaWFuZ2xlcy5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICBvZmZzZXRJbmZvID0gX2J1ZmZlci5yZXF1ZXN0KF92ZXJ0ZXhGbG9hdENvdW50IC8gX3BlclZlcnRleFNpemUsIF9pbmRleENvdW50KTtcbiAgICAgICAgICAgICAgICBfaW5kZXhPZmZzZXQgPSBvZmZzZXRJbmZvLmluZGljZU9mZnNldCxcbiAgICAgICAgICAgICAgICBfdmVydGV4T2Zmc2V0ID0gb2Zmc2V0SW5mby52ZXJ0ZXhPZmZzZXQsXG4gICAgICAgICAgICAgICAgX3ZlcnRleEZsb2F0T2Zmc2V0ID0gb2Zmc2V0SW5mby5ieXRlT2Zmc2V0ID4+IDI7XG4gICAgICAgICAgICAgICAgdmJ1ZiA9IF9idWZmZXIuX3ZEYXRhLFxuICAgICAgICAgICAgICAgIGlidWYgPSBfYnVmZmVyLl9pRGF0YTtcbiAgICBcbiAgICAgICAgICAgICAgICAvLyBjb21wdXRlIHZlcnRleCBhbmQgZmlsbCB4IHlcbiAgICAgICAgICAgICAgICBhdHRhY2htZW50LmNvbXB1dGVXb3JsZFZlcnRpY2VzKHNsb3QsIDAsIGF0dGFjaG1lbnQud29ybGRWZXJ0aWNlc0xlbmd0aCwgdmJ1ZiwgX3ZlcnRleEZsb2F0T2Zmc2V0LCBfcGVyVmVydGV4U2l6ZSk7XG5cbiAgICAgICAgICAgICAgICAvLyBkcmF3IGRlYnVnIG1lc2ggaWYgZW5hYmxlZCBncmFwaGljc1xuICAgICAgICAgICAgICAgIGlmIChncmFwaGljcyAmJiBfZGVidWdNZXNoKSB7XG4gICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLnN0cm9rZUNvbG9yID0gX21lc2hDb2xvcjtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpaSA9IDAsIG5uID0gdHJpYW5nbGVzLmxlbmd0aDsgaWkgPCBubjsgaWkgKz0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHYxID0gdHJpYW5nbGVzW2lpXSAqIF9wZXJWZXJ0ZXhTaXplICsgX3ZlcnRleEZsb2F0T2Zmc2V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHYyID0gdHJpYW5nbGVzW2lpICsgMV0gKiBfcGVyVmVydGV4U2l6ZSArIF92ZXJ0ZXhGbG9hdE9mZnNldDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2MyA9IHRyaWFuZ2xlc1tpaSArIDJdICogX3BlclZlcnRleFNpemUgKyBfdmVydGV4RmxvYXRPZmZzZXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLm1vdmVUbyh2YnVmW3YxXSwgdmJ1Zlt2MSArIDFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLmxpbmVUbyh2YnVmW3YyXSwgdmJ1Zlt2MiArIDFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLmxpbmVUbyh2YnVmW3YzXSwgdmJ1Zlt2MyArIDFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBncmFwaGljcy5zdHJva2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGlmIChfdmVydGV4RmxvYXRDb3VudCA9PSAwIHx8IF9pbmRleENvdW50ID09IDApIHtcbiAgICAgICAgICAgICAgICBjbGlwcGVyLmNsaXBFbmRXaXRoU2xvdChzbG90KTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIC8vIGZpbGwgaW5kaWNlc1xuICAgICAgICAgICAgaWJ1Zi5zZXQodHJpYW5nbGVzLCBfaW5kZXhPZmZzZXQpO1xuXG4gICAgICAgICAgICAvLyBmaWxsIHUgdlxuICAgICAgICAgICAgdXZzID0gYXR0YWNobWVudC51dnM7XG4gICAgICAgICAgICBmb3IgKGxldCB2ID0gX3ZlcnRleEZsb2F0T2Zmc2V0LCBuID0gX3ZlcnRleEZsb2F0T2Zmc2V0ICsgX3ZlcnRleEZsb2F0Q291bnQsIHUgPSAwOyB2IDwgbjsgdiArPSBfcGVyVmVydGV4U2l6ZSwgdSArPSAyKSB7XG4gICAgICAgICAgICAgICAgdmJ1Zlt2ICsgMl0gPSB1dnNbdV07ICAgICAgICAgICAvLyB1XG4gICAgICAgICAgICAgICAgdmJ1Zlt2ICsgM10gPSB1dnNbdSArIDFdOyAgICAgICAvLyB2XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF0dGFjaG1lbnRDb2xvciA9IGF0dGFjaG1lbnQuY29sb3IsXG4gICAgICAgICAgICBzbG90Q29sb3IgPSBzbG90LmNvbG9yO1xuXG4gICAgICAgICAgICB0aGlzLmZpbGxWZXJ0aWNlcyhza2VsZXRvbkNvbG9yLCBhdHRhY2htZW50Q29sb3IsIHNsb3RDb2xvciwgY2xpcHBlciwgc2xvdCk7XG4gICAgXG4gICAgICAgICAgICBpZiAoX2luZGV4Q291bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaWkgPSBfaW5kZXhPZmZzZXQsIG5uID0gX2luZGV4T2Zmc2V0ICsgX2luZGV4Q291bnQ7IGlpIDwgbm47IGlpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWJ1ZltpaV0gKz0gX3ZlcnRleE9mZnNldDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAod29ybGRNYXQpIHtcbiAgICAgICAgICAgICAgICAgICAgd29ybGRNYXRtID0gd29ybGRNYXQubTtcbiAgICAgICAgICAgICAgICAgICAgX20wMCA9IHdvcmxkTWF0bVswXTtcbiAgICAgICAgICAgICAgICAgICAgX20wNCA9IHdvcmxkTWF0bVs0XTtcbiAgICAgICAgICAgICAgICAgICAgX20xMiA9IHdvcmxkTWF0bVsxMl07XG4gICAgICAgICAgICAgICAgICAgIF9tMDEgPSB3b3JsZE1hdG1bMV07XG4gICAgICAgICAgICAgICAgICAgIF9tMDUgPSB3b3JsZE1hdG1bNV07XG4gICAgICAgICAgICAgICAgICAgIF9tMTMgPSB3b3JsZE1hdG1bMTNdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpaSA9IF92ZXJ0ZXhGbG9hdE9mZnNldCwgbm4gPSBfdmVydGV4RmxvYXRPZmZzZXQgKyBfdmVydGV4RmxvYXRDb3VudDsgaWkgPCBubjsgaWkgKz0gX3BlclZlcnRleFNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF94ID0gdmJ1ZltpaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBfeSA9IHZidWZbaWkgKyAxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZidWZbaWldID0gX3ggKiBfbTAwICsgX3kgKiBfbTA0ICsgX20xMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZidWZbaWkgKyAxXSA9IF94ICogX20wMSArIF95ICogX20wNSArIF9tMTM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX2J1ZmZlci5hZGp1c3QoX3ZlcnRleEZsb2F0Q291bnQgLyBfcGVyVmVydGV4U2l6ZSwgX2luZGV4Q291bnQpO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgY2xpcHBlci5jbGlwRW5kV2l0aFNsb3Qoc2xvdCk7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgY2xpcHBlci5jbGlwRW5kKCk7XG4gICAgXG4gICAgICAgIGlmIChncmFwaGljcyAmJiBfZGVidWdCb25lcykge1xuICAgICAgICAgICAgbGV0IGJvbmU7XG4gICAgICAgICAgICBncmFwaGljcy5zdHJva2VDb2xvciA9IF9ib25lQ29sb3I7XG4gICAgICAgICAgICBncmFwaGljcy5maWxsQ29sb3IgPSBfc2xvdENvbG9yOyAvLyBSb290IGJvbmUgY29sb3IgaXMgc2FtZSBhcyBzbG90IGNvbG9yLlxuICAgIFxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIG4gPSBsb2NTa2VsZXRvbi5ib25lcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBib25lID0gbG9jU2tlbGV0b24uYm9uZXNbaV07XG4gICAgICAgICAgICAgICAgbGV0IHggPSBib25lLmRhdGEubGVuZ3RoICogYm9uZS5hICsgYm9uZS53b3JsZFg7XG4gICAgICAgICAgICAgICAgbGV0IHkgPSBib25lLmRhdGEubGVuZ3RoICogYm9uZS5jICsgYm9uZS53b3JsZFk7XG4gICAgXG4gICAgICAgICAgICAgICAgLy8gQm9uZSBsZW5ndGhzLlxuICAgICAgICAgICAgICAgIGdyYXBoaWNzLm1vdmVUbyhib25lLndvcmxkWCwgYm9uZS53b3JsZFkpO1xuICAgICAgICAgICAgICAgIGdyYXBoaWNzLmxpbmVUbyh4LCB5KTtcbiAgICAgICAgICAgICAgICBncmFwaGljcy5zdHJva2UoKTtcbiAgICBcbiAgICAgICAgICAgICAgICAvLyBCb25lIG9yaWdpbnMuXG4gICAgICAgICAgICAgICAgZ3JhcGhpY3MuY2lyY2xlKGJvbmUud29ybGRYLCBib25lLndvcmxkWSwgTWF0aC5QSSAqIDEuNSk7XG4gICAgICAgICAgICAgICAgZ3JhcGhpY3MuZmlsbCgpO1xuICAgICAgICAgICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLmZpbGxDb2xvciA9IF9vcmlnaW5Db2xvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjYWNoZVRyYXZlcnNlICh3b3JsZE1hdCkge1xuICAgICAgICBcbiAgICAgICAgbGV0IGZyYW1lID0gX2NvbXAuX2N1ckZyYW1lO1xuICAgICAgICBpZiAoIWZyYW1lKSByZXR1cm47XG5cbiAgICAgICAgbGV0IHNlZ21lbnRzID0gZnJhbWUuc2VnbWVudHM7XG4gICAgICAgIGlmIChzZWdtZW50cy5sZW5ndGggPT0gMCkgcmV0dXJuO1xuXG4gICAgICAgIGxldCB2YnVmLCBpYnVmLCB1aW50YnVmO1xuICAgICAgICBsZXQgbWF0ZXJpYWw7XG4gICAgICAgIGxldCBvZmZzZXRJbmZvO1xuICAgICAgICBsZXQgdmVydGljZXMgPSBmcmFtZS52ZXJ0aWNlcztcbiAgICAgICAgbGV0IGluZGljZXMgPSBmcmFtZS5pbmRpY2VzO1xuICAgICAgICBsZXQgd29ybGRNYXRtO1xuXG4gICAgICAgIGxldCBmcmFtZVZGT2Zmc2V0ID0gMCwgZnJhbWVJbmRleE9mZnNldCA9IDAsIHNlZ1ZGQ291bnQgPSAwO1xuICAgICAgICBpZiAod29ybGRNYXQpIHtcbiAgICAgICAgICAgIHdvcmxkTWF0bSA9IHdvcmxkTWF0Lm07XG4gICAgICAgICAgICBfbTAwID0gd29ybGRNYXRtWzBdO1xuICAgICAgICAgICAgX20wMSA9IHdvcmxkTWF0bVsxXTtcbiAgICAgICAgICAgIF9tMDQgPSB3b3JsZE1hdG1bNF07XG4gICAgICAgICAgICBfbTA1ID0gd29ybGRNYXRtWzVdO1xuICAgICAgICAgICAgX20xMiA9IHdvcmxkTWF0bVsxMl07XG4gICAgICAgICAgICBfbTEzID0gd29ybGRNYXRtWzEzXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBqdXN0VHJhbnNsYXRlID0gX20wMCA9PT0gMSAmJiBfbTAxID09PSAwICYmIF9tMDQgPT09IDAgJiYgX20wNSA9PT0gMTtcbiAgICAgICAgbGV0IG5lZWRCYXRjaCA9IChfaGFuZGxlVmFsICYgRkxBR19CQVRDSCk7XG4gICAgICAgIGxldCBjYWxjVHJhbnNsYXRlID0gbmVlZEJhdGNoICYmIGp1c3RUcmFuc2xhdGU7XG5cbiAgICAgICAgbGV0IGNvbG9yT2Zmc2V0ID0gMDtcbiAgICAgICAgbGV0IGNvbG9ycyA9IGZyYW1lLmNvbG9ycztcbiAgICAgICAgbGV0IG5vd0NvbG9yID0gY29sb3JzW2NvbG9yT2Zmc2V0KytdO1xuICAgICAgICBsZXQgbWF4VkZPZmZzZXQgPSBub3dDb2xvci52Zk9mZnNldDtcbiAgICAgICAgX2hhbmRsZUNvbG9yKG5vd0NvbG9yKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbiA9IHNlZ21lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgbGV0IHNlZ0luZm8gPSBzZWdtZW50c1tpXTtcbiAgICAgICAgICAgIG1hdGVyaWFsID0gX2dldFNsb3RNYXRlcmlhbChzZWdJbmZvLnRleCwgc2VnSW5mby5ibGVuZE1vZGUpO1xuICAgICAgICAgICAgaWYgKCFtYXRlcmlhbCkgY29udGludWU7XG5cbiAgICAgICAgICAgIGlmIChfbXVzdEZsdXNoIHx8IG1hdGVyaWFsLmdldEhhc2goKSAhPT0gX3JlbmRlcmVyLm1hdGVyaWFsLmdldEhhc2goKSkge1xuICAgICAgICAgICAgICAgIF9tdXN0Rmx1c2ggPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBfcmVuZGVyZXIuX2ZsdXNoKCk7XG4gICAgICAgICAgICAgICAgX3JlbmRlcmVyLm5vZGUgPSBfbm9kZTtcbiAgICAgICAgICAgICAgICBfcmVuZGVyZXIubWF0ZXJpYWwgPSBtYXRlcmlhbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX3ZlcnRleENvdW50ID0gc2VnSW5mby52ZXJ0ZXhDb3VudDtcbiAgICAgICAgICAgIF9pbmRleENvdW50ID0gc2VnSW5mby5pbmRleENvdW50O1xuXG4gICAgICAgICAgICBvZmZzZXRJbmZvID0gX2J1ZmZlci5yZXF1ZXN0KF92ZXJ0ZXhDb3VudCwgX2luZGV4Q291bnQpO1xuICAgICAgICAgICAgX2luZGV4T2Zmc2V0ID0gb2Zmc2V0SW5mby5pbmRpY2VPZmZzZXQ7XG4gICAgICAgICAgICBfdmVydGV4T2Zmc2V0ID0gb2Zmc2V0SW5mby52ZXJ0ZXhPZmZzZXQ7XG4gICAgICAgICAgICBfdmZPZmZzZXQgPSBvZmZzZXRJbmZvLmJ5dGVPZmZzZXQgPj4gMjtcbiAgICAgICAgICAgIHZidWYgPSBfYnVmZmVyLl92RGF0YTtcbiAgICAgICAgICAgIGlidWYgPSBfYnVmZmVyLl9pRGF0YTtcbiAgICAgICAgICAgIHVpbnRidWYgPSBfYnVmZmVyLl91aW50VkRhdGE7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGlpID0gX2luZGV4T2Zmc2V0LCBpbCA9IF9pbmRleE9mZnNldCArIF9pbmRleENvdW50OyBpaSA8IGlsOyBpaSsrKSB7XG4gICAgICAgICAgICAgICAgaWJ1ZltpaV0gPSBfdmVydGV4T2Zmc2V0ICsgaW5kaWNlc1tmcmFtZUluZGV4T2Zmc2V0KytdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWdWRkNvdW50ID0gc2VnSW5mby52ZkNvdW50O1xuICAgICAgICAgICAgdmJ1Zi5zZXQodmVydGljZXMuc3ViYXJyYXkoZnJhbWVWRk9mZnNldCwgZnJhbWVWRk9mZnNldCArIHNlZ1ZGQ291bnQpLCBfdmZPZmZzZXQpO1xuICAgICAgICAgICAgZnJhbWVWRk9mZnNldCArPSBzZWdWRkNvdW50O1xuXG4gICAgICAgICAgICBpZiAoY2FsY1RyYW5zbGF0ZSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGlpID0gX3ZmT2Zmc2V0LCBpbCA9IF92Zk9mZnNldCArIHNlZ1ZGQ291bnQ7IGlpIDwgaWw7IGlpICs9IDYpIHtcbiAgICAgICAgICAgICAgICAgICAgdmJ1ZltpaV0gKz0gX20xMjtcbiAgICAgICAgICAgICAgICAgICAgdmJ1ZltpaSArIDFdICs9IF9tMTM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChuZWVkQmF0Y2gpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpaSA9IF92Zk9mZnNldCwgaWwgPSBfdmZPZmZzZXQgKyBzZWdWRkNvdW50OyBpaSA8IGlsOyBpaSArPSA2KSB7XG4gICAgICAgICAgICAgICAgICAgIF94ID0gdmJ1ZltpaV07XG4gICAgICAgICAgICAgICAgICAgIF95ID0gdmJ1ZltpaSArIDFdO1xuICAgICAgICAgICAgICAgICAgICB2YnVmW2lpXSA9IF94ICogX20wMCArIF95ICogX20wNCArIF9tMTI7XG4gICAgICAgICAgICAgICAgICAgIHZidWZbaWkgKyAxXSA9IF94ICogX20wMSArIF95ICogX20wNSArIF9tMTM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfYnVmZmVyLmFkanVzdChfdmVydGV4Q291bnQsIF9pbmRleENvdW50KTtcbiAgICAgICAgICAgIGlmICggIV9uZWVkQ29sb3IgKSBjb250aW51ZTtcblxuICAgICAgICAgICAgLy8gaGFuZGxlIGNvbG9yXG4gICAgICAgICAgICBsZXQgZnJhbWVDb2xvck9mZnNldCA9IGZyYW1lVkZPZmZzZXQgLSBzZWdWRkNvdW50O1xuICAgICAgICAgICAgZm9yIChsZXQgaWkgPSBfdmZPZmZzZXQgKyA0LCBpbCA9IF92Zk9mZnNldCArIDQgKyBzZWdWRkNvdW50OyBpaSA8IGlsOyBpaSArPSA2LCBmcmFtZUNvbG9yT2Zmc2V0ICs9IDYpIHtcbiAgICAgICAgICAgICAgICBpZiAoZnJhbWVDb2xvck9mZnNldCA+PSBtYXhWRk9mZnNldCkge1xuICAgICAgICAgICAgICAgICAgICBub3dDb2xvciA9IGNvbG9yc1tjb2xvck9mZnNldCsrXTtcbiAgICAgICAgICAgICAgICAgICAgX2hhbmRsZUNvbG9yKG5vd0NvbG9yKTtcbiAgICAgICAgICAgICAgICAgICAgbWF4VkZPZmZzZXQgPSBub3dDb2xvci52Zk9mZnNldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdWludGJ1ZltpaV0gPSBfZmluYWxDb2xvcjMyO1xuICAgICAgICAgICAgICAgIHVpbnRidWZbaWkgKyAxXSA9IF9kYXJrQ29sb3IzMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbGxCdWZmZXJzIChjb21wLCByZW5kZXJlcikge1xuICAgICAgICBcbiAgICAgICAgbGV0IG5vZGUgPSBjb21wLm5vZGU7XG4gICAgICAgIG5vZGUuX3JlbmRlckZsYWcgfD0gUmVuZGVyRmxvdy5GTEFHX1VQREFURV9SRU5ERVJfREFUQTtcbiAgICAgICAgaWYgKCFjb21wLl9za2VsZXRvbikgcmV0dXJuO1xuXG4gICAgICAgIGxldCBub2RlQ29sb3IgPSBub2RlLl9jb2xvcjtcbiAgICAgICAgX25vZGVSID0gbm9kZUNvbG9yLnIgLyAyNTU7XG4gICAgICAgIF9ub2RlRyA9IG5vZGVDb2xvci5nIC8gMjU1O1xuICAgICAgICBfbm9kZUIgPSBub2RlQ29sb3IuYiAvIDI1NTtcbiAgICAgICAgX25vZGVBID0gbm9kZUNvbG9yLmEgLyAyNTU7XG5cbiAgICAgICAgX3VzZVRpbnQgPSBjb21wLnVzZVRpbnQgfHwgY29tcC5pc0FuaW1hdGlvbkNhY2hlZCgpO1xuICAgICAgICBfdmVydGV4Rm9ybWF0ID0gX3VzZVRpbnQ/IFZGVHdvQ29sb3IgOiBWRk9uZUNvbG9yO1xuICAgICAgICAvLyB4IHkgdSB2IGNvbG9yMSBjb2xvcjIgb3IgeCB5IHUgdiBjb2xvclxuICAgICAgICBfcGVyVmVydGV4U2l6ZSA9IF91c2VUaW50ID8gNiA6IDU7XG5cbiAgICAgICAgX25vZGUgPSBjb21wLm5vZGU7XG4gICAgICAgIF9idWZmZXIgPSByZW5kZXJlci5nZXRCdWZmZXIoJ3NwaW5lJywgX3ZlcnRleEZvcm1hdCk7XG4gICAgICAgIF9yZW5kZXJlciA9IHJlbmRlcmVyO1xuICAgICAgICBfY29tcCA9IGNvbXA7XG5cbiAgICAgICAgX211c3RGbHVzaCA9IHRydWU7XG4gICAgICAgIF9wcmVtdWx0aXBsaWVkQWxwaGEgPSBjb21wLnByZW11bHRpcGxpZWRBbHBoYTtcbiAgICAgICAgX211bHRpcGxpZXIgPSAxLjA7XG4gICAgICAgIF9oYW5kbGVWYWwgPSAweDAwO1xuICAgICAgICBfbmVlZENvbG9yID0gZmFsc2U7XG4gICAgICAgIF92ZXJ0ZXhFZmZlY3QgPSBjb21wLl9lZmZlY3REZWxlZ2F0ZSAmJiBjb21wLl9lZmZlY3REZWxlZ2F0ZS5fdmVydGV4RWZmZWN0O1xuXG4gICAgICAgIGlmIChub2RlQ29sb3IuX3ZhbCAhPT0gMHhmZmZmZmZmZiB8fCBfcHJlbXVsdGlwbGllZEFscGhhKSB7XG4gICAgICAgICAgICBfbmVlZENvbG9yID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfdXNlVGludCkge1xuICAgICAgICAgICAgX2hhbmRsZVZhbCB8PSBGTEFHX1RXT19DT0xPUjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB3b3JsZE1hdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKF9jb21wLmVuYWJsZUJhdGNoKSB7XG4gICAgICAgICAgICB3b3JsZE1hdCA9IF9ub2RlLl93b3JsZE1hdHJpeDtcbiAgICAgICAgICAgIF9tdXN0Rmx1c2ggPSBmYWxzZTtcbiAgICAgICAgICAgIF9oYW5kbGVWYWwgfD0gRkxBR19CQVRDSDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb21wLmlzQW5pbWF0aW9uQ2FjaGVkKCkpIHtcbiAgICAgICAgICAgIC8vIFRyYXZlcnNlIGlucHV0IGFzc2VtYmxlci5cbiAgICAgICAgICAgIHRoaXMuY2FjaGVUcmF2ZXJzZSh3b3JsZE1hdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoX3ZlcnRleEVmZmVjdCkgX3ZlcnRleEVmZmVjdC5iZWdpbihjb21wLl9za2VsZXRvbik7XG4gICAgICAgICAgICB0aGlzLnJlYWxUaW1lVHJhdmVyc2Uod29ybGRNYXQpO1xuICAgICAgICAgICAgaWYgKF92ZXJ0ZXhFZmZlY3QpIF92ZXJ0ZXhFZmZlY3QuZW5kKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzeW5jIGF0dGFjaGVkIG5vZGUgbWF0cml4XG4gICAgICAgIHJlbmRlcmVyLndvcmxkTWF0RGlydHkrKztcbiAgICAgICAgY29tcC5hdHRhY2hVdGlsLl9zeW5jQXR0YWNoZWROb2RlKCk7XG5cbiAgICAgICAgLy8gQ2xlYXIgdGVtcCB2YXIuXG4gICAgICAgIF9ub2RlID0gdW5kZWZpbmVkO1xuICAgICAgICBfYnVmZmVyID0gdW5kZWZpbmVkO1xuICAgICAgICBfcmVuZGVyZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgIF9jb21wID0gdW5kZWZpbmVkO1xuICAgICAgICBfdmVydGV4RWZmZWN0ID0gbnVsbDtcbiAgICB9XG5cbiAgICBwb3N0RmlsbEJ1ZmZlcnMgKGNvbXAsIHJlbmRlcmVyKSB7XG4gICAgICAgIHJlbmRlcmVyLndvcmxkTWF0RGlydHktLTtcbiAgICB9XG59XG5cbkFzc2VtYmxlci5yZWdpc3RlcihTa2VsZXRvbiwgU3BpbmVBc3NlbWJsZXIpO1xuIl19