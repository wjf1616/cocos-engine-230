
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/build/mappings/index.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}'use strict';
/**
 * enums
 */

var enums = {
  // buffer usage
  USAGE_STATIC: 35044,
  // gl.STATIC_DRAW
  USAGE_DYNAMIC: 35048,
  // gl.DYNAMIC_DRAW
  USAGE_STREAM: 35040,
  // gl.STREAM_DRAW
  // index buffer format
  INDEX_FMT_UINT8: 5121,
  // gl.UNSIGNED_BYTE
  INDEX_FMT_UINT16: 5123,
  // gl.UNSIGNED_SHORT
  INDEX_FMT_UINT32: 5125,
  // gl.UNSIGNED_INT (OES_element_index_uint)
  // vertex attribute semantic
  ATTR_POSITION: 'a_position',
  ATTR_NORMAL: 'a_normal',
  ATTR_TANGENT: 'a_tangent',
  ATTR_BITANGENT: 'a_bitangent',
  ATTR_WEIGHTS: 'a_weights',
  ATTR_JOINTS: 'a_joints',
  ATTR_COLOR: 'a_color',
  ATTR_COLOR0: 'a_color0',
  ATTR_COLOR1: 'a_color1',
  ATTR_UV: 'a_uv',
  ATTR_UV0: 'a_uv0',
  ATTR_UV1: 'a_uv1',
  ATTR_UV2: 'a_uv2',
  ATTR_UV3: 'a_uv3',
  ATTR_UV4: 'a_uv4',
  ATTR_UV5: 'a_uv5',
  ATTR_UV6: 'a_uv6',
  ATTR_UV7: 'a_uv7',
  // vertex attribute type
  ATTR_TYPE_INT8: 5120,
  // gl.BYTE
  ATTR_TYPE_UINT8: 5121,
  // gl.UNSIGNED_BYTE
  ATTR_TYPE_INT16: 5122,
  // gl.SHORT
  ATTR_TYPE_UINT16: 5123,
  // gl.UNSIGNED_SHORT
  ATTR_TYPE_INT32: 5124,
  // gl.INT
  ATTR_TYPE_UINT32: 5125,
  // gl.UNSIGNED_INT
  ATTR_TYPE_FLOAT32: 5126,
  // gl.FLOAT
  // texture filter
  FILTER_NEAREST: 0,
  FILTER_LINEAR: 1,
  // texture wrap mode
  WRAP_REPEAT: 10497,
  // gl.REPEAT
  WRAP_CLAMP: 33071,
  // gl.CLAMP_TO_EDGE
  WRAP_MIRROR: 33648,
  // gl.MIRRORED_REPEAT
  // texture format
  // compress formats
  TEXTURE_FMT_RGB_DXT1: 0,
  TEXTURE_FMT_RGBA_DXT1: 1,
  TEXTURE_FMT_RGBA_DXT3: 2,
  TEXTURE_FMT_RGBA_DXT5: 3,
  TEXTURE_FMT_RGB_ETC1: 4,
  TEXTURE_FMT_RGB_PVRTC_2BPPV1: 5,
  TEXTURE_FMT_RGBA_PVRTC_2BPPV1: 6,
  TEXTURE_FMT_RGB_PVRTC_4BPPV1: 7,
  TEXTURE_FMT_RGBA_PVRTC_4BPPV1: 8,
  // normal formats
  TEXTURE_FMT_A8: 9,
  TEXTURE_FMT_L8: 10,
  TEXTURE_FMT_L8_A8: 11,
  TEXTURE_FMT_R5_G6_B5: 12,
  TEXTURE_FMT_R5_G5_B5_A1: 13,
  TEXTURE_FMT_R4_G4_B4_A4: 14,
  TEXTURE_FMT_RGB8: 15,
  TEXTURE_FMT_RGBA8: 16,
  TEXTURE_FMT_RGB16F: 17,
  TEXTURE_FMT_RGBA16F: 18,
  TEXTURE_FMT_RGB32F: 19,
  TEXTURE_FMT_RGBA32F: 20,
  TEXTURE_FMT_R32F: 21,
  TEXTURE_FMT_111110F: 22,
  TEXTURE_FMT_SRGB: 23,
  TEXTURE_FMT_SRGBA: 24,
  // depth formats
  TEXTURE_FMT_D16: 25,
  TEXTURE_FMT_D32: 26,
  TEXTURE_FMT_D24S8: 27,
  // etc2 format
  TEXTURE_FMT_RGB_ETC2: 28,
  TEXTURE_FMT_RGBA_ETC2: 29,
  // depth and stencil function
  DS_FUNC_NEVER: 512,
  // gl.NEVER
  DS_FUNC_LESS: 513,
  // gl.LESS
  DS_FUNC_EQUAL: 514,
  // gl.EQUAL
  DS_FUNC_LEQUAL: 515,
  // gl.LEQUAL
  DS_FUNC_GREATER: 516,
  // gl.GREATER
  DS_FUNC_NOTEQUAL: 517,
  // gl.NOTEQUAL
  DS_FUNC_GEQUAL: 518,
  // gl.GEQUAL
  DS_FUNC_ALWAYS: 519,
  // gl.ALWAYS
  // render-buffer format
  RB_FMT_RGBA4: 32854,
  // gl.RGBA4
  RB_FMT_RGB5_A1: 32855,
  // gl.RGB5_A1
  RB_FMT_RGB565: 36194,
  // gl.RGB565
  RB_FMT_D16: 33189,
  // gl.DEPTH_COMPONENT16
  RB_FMT_S8: 36168,
  // gl.STENCIL_INDEX8
  RB_FMT_D24S8: 34041,
  // gl.DEPTH_STENCIL
  // blend-equation
  BLEND_FUNC_ADD: 32774,
  // gl.FUNC_ADD
  BLEND_FUNC_SUBTRACT: 32778,
  // gl.FUNC_SUBTRACT
  BLEND_FUNC_REVERSE_SUBTRACT: 32779,
  // gl.FUNC_REVERSE_SUBTRACT
  // blend
  BLEND_ZERO: 0,
  // gl.ZERO
  BLEND_ONE: 1,
  // gl.ONE
  BLEND_SRC_COLOR: 768,
  // gl.SRC_COLOR
  BLEND_ONE_MINUS_SRC_COLOR: 769,
  // gl.ONE_MINUS_SRC_COLOR
  BLEND_DST_COLOR: 774,
  // gl.DST_COLOR
  BLEND_ONE_MINUS_DST_COLOR: 775,
  // gl.ONE_MINUS_DST_COLOR
  BLEND_SRC_ALPHA: 770,
  // gl.SRC_ALPHA
  BLEND_ONE_MINUS_SRC_ALPHA: 771,
  // gl.ONE_MINUS_SRC_ALPHA
  BLEND_DST_ALPHA: 772,
  // gl.DST_ALPHA
  BLEND_ONE_MINUS_DST_ALPHA: 773,
  // gl.ONE_MINUS_DST_ALPHA
  BLEND_CONSTANT_COLOR: 32769,
  // gl.CONSTANT_COLOR
  BLEND_ONE_MINUS_CONSTANT_COLOR: 32770,
  // gl.ONE_MINUS_CONSTANT_COLOR
  BLEND_CONSTANT_ALPHA: 32771,
  // gl.CONSTANT_ALPHA
  BLEND_ONE_MINUS_CONSTANT_ALPHA: 32772,
  // gl.ONE_MINUS_CONSTANT_ALPHA
  BLEND_SRC_ALPHA_SATURATE: 776,
  // gl.SRC_ALPHA_SATURATE
  // stencil operation
  STENCIL_DISABLE: 0,
  // disable stencil
  STENCIL_ENABLE: 1,
  // enable stencil
  STENCIL_INHERIT: 2,
  // inherit stencil states
  STENCIL_OP_KEEP: 7680,
  // gl.KEEP
  STENCIL_OP_ZERO: 0,
  // gl.ZERO
  STENCIL_OP_REPLACE: 7681,
  // gl.REPLACE
  STENCIL_OP_INCR: 7682,
  // gl.INCR
  STENCIL_OP_INCR_WRAP: 34055,
  // gl.INCR_WRAP
  STENCIL_OP_DECR: 7683,
  // gl.DECR
  STENCIL_OP_DECR_WRAP: 34056,
  // gl.DECR_WRAP
  STENCIL_OP_INVERT: 5386,
  // gl.INVERT
  // cull
  CULL_NONE: 0,
  CULL_FRONT: 1028,
  CULL_BACK: 1029,
  CULL_FRONT_AND_BACK: 1032,
  // primitive type
  PT_POINTS: 0,
  // gl.POINTS
  PT_LINES: 1,
  // gl.LINES
  PT_LINE_LOOP: 2,
  // gl.LINE_LOOP
  PT_LINE_STRIP: 3,
  // gl.LINE_STRIP
  PT_TRIANGLES: 4,
  // gl.TRIANGLES
  PT_TRIANGLE_STRIP: 5,
  // gl.TRIANGLE_STRIP
  PT_TRIANGLE_FAN: 6 // gl.TRIANGLE_FAN

};
var RenderQueue = {
  OPAQUE: 0,
  TRANSPARENT: 1,
  OVERLAY: 2
};
/**
 * JS Implementation of MurmurHash2
 * 
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 * 
 * @param {string} str ASCII only
 * @param {number} seed Positive integer only
 * @return {number} 32-bit positive integer hash
 */

function murmurhash2_32_gc(str, seed) {
  var l = str.length,
      h = seed ^ l,
      i = 0,
      k;

  while (l >= 4) {
    k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
    k = (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16);
    k ^= k >>> 24;
    k = (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16);
    h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16) ^ k;
    l -= 4;
    ++i;
  }

  switch (l) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

    case 2:
      h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

    case 1:
      h ^= str.charCodeAt(i) & 0xff;
      h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16);
  }

  h ^= h >>> 13;
  h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16);
  h ^= h >>> 15;
  return h >>> 0;
} // Extensions


var WebGLEXT;

(function (WebGLEXT) {
  WebGLEXT[WebGLEXT["COMPRESSED_RGB_S3TC_DXT1_EXT"] = 33776] = "COMPRESSED_RGB_S3TC_DXT1_EXT";
  WebGLEXT[WebGLEXT["COMPRESSED_RGBA_S3TC_DXT1_EXT"] = 33777] = "COMPRESSED_RGBA_S3TC_DXT1_EXT";
  WebGLEXT[WebGLEXT["COMPRESSED_RGBA_S3TC_DXT3_EXT"] = 33778] = "COMPRESSED_RGBA_S3TC_DXT3_EXT";
  WebGLEXT[WebGLEXT["COMPRESSED_RGBA_S3TC_DXT5_EXT"] = 33779] = "COMPRESSED_RGBA_S3TC_DXT5_EXT";
  WebGLEXT[WebGLEXT["COMPRESSED_SRGB_S3TC_DXT1_EXT"] = 35916] = "COMPRESSED_SRGB_S3TC_DXT1_EXT";
  WebGLEXT[WebGLEXT["COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT"] = 35917] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT";
  WebGLEXT[WebGLEXT["COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT"] = 35918] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT";
  WebGLEXT[WebGLEXT["COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT"] = 35919] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT";
  WebGLEXT[WebGLEXT["COMPRESSED_RGB_PVRTC_4BPPV1_IMG"] = 35840] = "COMPRESSED_RGB_PVRTC_4BPPV1_IMG";
  WebGLEXT[WebGLEXT["COMPRESSED_RGB_PVRTC_2BPPV1_IMG"] = 35841] = "COMPRESSED_RGB_PVRTC_2BPPV1_IMG";
  WebGLEXT[WebGLEXT["COMPRESSED_RGBA_PVRTC_4BPPV1_IMG"] = 35842] = "COMPRESSED_RGBA_PVRTC_4BPPV1_IMG";
  WebGLEXT[WebGLEXT["COMPRESSED_RGBA_PVRTC_2BPPV1_IMG"] = 35843] = "COMPRESSED_RGBA_PVRTC_2BPPV1_IMG";
  WebGLEXT[WebGLEXT["COMPRESSED_RGB_ETC1_WEBGL"] = 36196] = "COMPRESSED_RGB_ETC1_WEBGL";
})(WebGLEXT || (WebGLEXT = {}));

var GFXObjectType;

(function (GFXObjectType) {
  GFXObjectType[GFXObjectType["UNKNOWN"] = 0] = "UNKNOWN";
  GFXObjectType[GFXObjectType["BUFFER"] = 1] = "BUFFER";
  GFXObjectType[GFXObjectType["TEXTURE"] = 2] = "TEXTURE";
  GFXObjectType[GFXObjectType["TEXTURE_VIEW"] = 3] = "TEXTURE_VIEW";
  GFXObjectType[GFXObjectType["RENDER_PASS"] = 4] = "RENDER_PASS";
  GFXObjectType[GFXObjectType["FRAMEBUFFER"] = 5] = "FRAMEBUFFER";
  GFXObjectType[GFXObjectType["SAMPLER"] = 6] = "SAMPLER";
  GFXObjectType[GFXObjectType["SHADER"] = 7] = "SHADER";
  GFXObjectType[GFXObjectType["PIPELINE_LAYOUT"] = 8] = "PIPELINE_LAYOUT";
  GFXObjectType[GFXObjectType["PIPELINE_STATE"] = 9] = "PIPELINE_STATE";
  GFXObjectType[GFXObjectType["BINDING_LAYOUT"] = 10] = "BINDING_LAYOUT";
  GFXObjectType[GFXObjectType["INPUT_ASSEMBLER"] = 11] = "INPUT_ASSEMBLER";
  GFXObjectType[GFXObjectType["COMMAND_ALLOCATOR"] = 12] = "COMMAND_ALLOCATOR";
  GFXObjectType[GFXObjectType["COMMAND_BUFFER"] = 13] = "COMMAND_BUFFER";
  GFXObjectType[GFXObjectType["QUEUE"] = 14] = "QUEUE";
  GFXObjectType[GFXObjectType["WINDOW"] = 15] = "WINDOW";
})(GFXObjectType || (GFXObjectType = {}));

var GFXStatus;

(function (GFXStatus) {
  GFXStatus[GFXStatus["UNREADY"] = 0] = "UNREADY";
  GFXStatus[GFXStatus["FAILED"] = 1] = "FAILED";
  GFXStatus[GFXStatus["SUCCESS"] = 2] = "SUCCESS";
})(GFXStatus || (GFXStatus = {}));

var GFXObject =
/** @class */
function () {
  function GFXObject(gfxType) {
    this._gfxType = GFXObjectType.UNKNOWN;
    this._status = GFXStatus.UNREADY;
    this._gfxType = gfxType;
  }

  Object.defineProperty(GFXObject.prototype, "gfxType", {
    get: function get() {
      return this._gfxType;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(GFXObject.prototype, "status", {
    get: function get() {
      return this._status;
    },
    enumerable: true,
    configurable: true
  });
  return GFXObject;
}();

var GFXAttributeName;

(function (GFXAttributeName) {
  GFXAttributeName["ATTR_POSITION"] = "a_position";
  GFXAttributeName["ATTR_NORMAL"] = "a_normal";
  GFXAttributeName["ATTR_TANGENT"] = "a_tangent";
  GFXAttributeName["ATTR_BITANGENT"] = "a_bitangent";
  GFXAttributeName["ATTR_WEIGHTS"] = "a_weights";
  GFXAttributeName["ATTR_JOINTS"] = "a_joints";
  GFXAttributeName["ATTR_COLOR"] = "a_color";
  GFXAttributeName["ATTR_COLOR1"] = "a_color1";
  GFXAttributeName["ATTR_COLOR2"] = "a_color2";
  GFXAttributeName["ATTR_TEX_COORD"] = "a_texCoord";
  GFXAttributeName["ATTR_TEX_COORD1"] = "a_texCoord1";
  GFXAttributeName["ATTR_TEX_COORD2"] = "a_texCoord2";
  GFXAttributeName["ATTR_TEX_COORD3"] = "a_texCoord3";
  GFXAttributeName["ATTR_TEX_COORD4"] = "a_texCoord4";
  GFXAttributeName["ATTR_TEX_COORD5"] = "a_texCoord5";
  GFXAttributeName["ATTR_TEX_COORD6"] = "a_texCoord6";
  GFXAttributeName["ATTR_TEX_COORD7"] = "a_texCoord7";
  GFXAttributeName["ATTR_TEX_COORD8"] = "a_texCoord8";
})(GFXAttributeName || (GFXAttributeName = {}));

var GFXType;

(function (GFXType) {
  GFXType[GFXType["UNKNOWN"] = 0] = "UNKNOWN";
  GFXType[GFXType["BOOL"] = 1] = "BOOL";
  GFXType[GFXType["BOOL2"] = 2] = "BOOL2";
  GFXType[GFXType["BOOL3"] = 3] = "BOOL3";
  GFXType[GFXType["BOOL4"] = 4] = "BOOL4";
  GFXType[GFXType["INT"] = 5] = "INT";
  GFXType[GFXType["INT2"] = 6] = "INT2";
  GFXType[GFXType["INT3"] = 7] = "INT3";
  GFXType[GFXType["INT4"] = 8] = "INT4";
  GFXType[GFXType["UINT"] = 9] = "UINT";
  GFXType[GFXType["UINT2"] = 10] = "UINT2";
  GFXType[GFXType["UINT3"] = 11] = "UINT3";
  GFXType[GFXType["UINT4"] = 12] = "UINT4";
  GFXType[GFXType["FLOAT"] = 13] = "FLOAT";
  GFXType[GFXType["FLOAT2"] = 14] = "FLOAT2";
  GFXType[GFXType["FLOAT3"] = 15] = "FLOAT3";
  GFXType[GFXType["FLOAT4"] = 16] = "FLOAT4";
  GFXType[GFXType["COLOR4"] = 17] = "COLOR4";
  GFXType[GFXType["MAT2"] = 18] = "MAT2";
  GFXType[GFXType["MAT2X3"] = 19] = "MAT2X3";
  GFXType[GFXType["MAT2X4"] = 20] = "MAT2X4";
  GFXType[GFXType["MAT3X2"] = 21] = "MAT3X2";
  GFXType[GFXType["MAT3"] = 22] = "MAT3";
  GFXType[GFXType["MAT3X4"] = 23] = "MAT3X4";
  GFXType[GFXType["MAT4X2"] = 24] = "MAT4X2";
  GFXType[GFXType["MAT4X3"] = 25] = "MAT4X3";
  GFXType[GFXType["MAT4"] = 26] = "MAT4";
  GFXType[GFXType["SAMPLER1D"] = 27] = "SAMPLER1D";
  GFXType[GFXType["SAMPLER1D_ARRAY"] = 28] = "SAMPLER1D_ARRAY";
  GFXType[GFXType["SAMPLER2D"] = 29] = "SAMPLER2D";
  GFXType[GFXType["SAMPLER2D_ARRAY"] = 30] = "SAMPLER2D_ARRAY";
  GFXType[GFXType["SAMPLER3D"] = 31] = "SAMPLER3D";
  GFXType[GFXType["SAMPLER_CUBE"] = 32] = "SAMPLER_CUBE";
  GFXType[GFXType["COUNT"] = 33] = "COUNT";
})(GFXType || (GFXType = {}));

var GFXFormat;

(function (GFXFormat) {
  GFXFormat[GFXFormat["UNKNOWN"] = 0] = "UNKNOWN";
  GFXFormat[GFXFormat["A8"] = 1] = "A8";
  GFXFormat[GFXFormat["L8"] = 2] = "L8";
  GFXFormat[GFXFormat["LA8"] = 3] = "LA8";
  GFXFormat[GFXFormat["R8"] = 4] = "R8";
  GFXFormat[GFXFormat["R8SN"] = 5] = "R8SN";
  GFXFormat[GFXFormat["R8UI"] = 6] = "R8UI";
  GFXFormat[GFXFormat["R8I"] = 7] = "R8I";
  GFXFormat[GFXFormat["R16F"] = 8] = "R16F";
  GFXFormat[GFXFormat["R16UI"] = 9] = "R16UI";
  GFXFormat[GFXFormat["R16I"] = 10] = "R16I";
  GFXFormat[GFXFormat["R32F"] = 11] = "R32F";
  GFXFormat[GFXFormat["R32UI"] = 12] = "R32UI";
  GFXFormat[GFXFormat["R32I"] = 13] = "R32I";
  GFXFormat[GFXFormat["RG8"] = 14] = "RG8";
  GFXFormat[GFXFormat["RG8SN"] = 15] = "RG8SN";
  GFXFormat[GFXFormat["RG8UI"] = 16] = "RG8UI";
  GFXFormat[GFXFormat["RG8I"] = 17] = "RG8I";
  GFXFormat[GFXFormat["RG16F"] = 18] = "RG16F";
  GFXFormat[GFXFormat["RG16UI"] = 19] = "RG16UI";
  GFXFormat[GFXFormat["RG16I"] = 20] = "RG16I";
  GFXFormat[GFXFormat["RG32F"] = 21] = "RG32F";
  GFXFormat[GFXFormat["RG32UI"] = 22] = "RG32UI";
  GFXFormat[GFXFormat["RG32I"] = 23] = "RG32I";
  GFXFormat[GFXFormat["RGB8"] = 24] = "RGB8";
  GFXFormat[GFXFormat["SRGB8"] = 25] = "SRGB8";
  GFXFormat[GFXFormat["RGB8SN"] = 26] = "RGB8SN";
  GFXFormat[GFXFormat["RGB8UI"] = 27] = "RGB8UI";
  GFXFormat[GFXFormat["RGB8I"] = 28] = "RGB8I";
  GFXFormat[GFXFormat["RGB16F"] = 29] = "RGB16F";
  GFXFormat[GFXFormat["RGB16UI"] = 30] = "RGB16UI";
  GFXFormat[GFXFormat["RGB16I"] = 31] = "RGB16I";
  GFXFormat[GFXFormat["RGB32F"] = 32] = "RGB32F";
  GFXFormat[GFXFormat["RGB32UI"] = 33] = "RGB32UI";
  GFXFormat[GFXFormat["RGB32I"] = 34] = "RGB32I";
  GFXFormat[GFXFormat["RGBA8"] = 35] = "RGBA8";
  GFXFormat[GFXFormat["SRGB8_A8"] = 36] = "SRGB8_A8";
  GFXFormat[GFXFormat["RGBA8SN"] = 37] = "RGBA8SN";
  GFXFormat[GFXFormat["RGBA8UI"] = 38] = "RGBA8UI";
  GFXFormat[GFXFormat["RGBA8I"] = 39] = "RGBA8I";
  GFXFormat[GFXFormat["RGBA16F"] = 40] = "RGBA16F";
  GFXFormat[GFXFormat["RGBA16UI"] = 41] = "RGBA16UI";
  GFXFormat[GFXFormat["RGBA16I"] = 42] = "RGBA16I";
  GFXFormat[GFXFormat["RGBA32F"] = 43] = "RGBA32F";
  GFXFormat[GFXFormat["RGBA32UI"] = 44] = "RGBA32UI";
  GFXFormat[GFXFormat["RGBA32I"] = 45] = "RGBA32I"; // Special Format

  GFXFormat[GFXFormat["R5G6B5"] = 46] = "R5G6B5";
  GFXFormat[GFXFormat["R11G11B10F"] = 47] = "R11G11B10F";
  GFXFormat[GFXFormat["RGB5A1"] = 48] = "RGB5A1";
  GFXFormat[GFXFormat["RGBA4"] = 49] = "RGBA4";
  GFXFormat[GFXFormat["RGB10A2"] = 50] = "RGB10A2";
  GFXFormat[GFXFormat["RGB10A2UI"] = 51] = "RGB10A2UI";
  GFXFormat[GFXFormat["RGB9E5"] = 52] = "RGB9E5"; // Depth-Stencil Format

  GFXFormat[GFXFormat["D16"] = 53] = "D16";
  GFXFormat[GFXFormat["D16S8"] = 54] = "D16S8";
  GFXFormat[GFXFormat["D24"] = 55] = "D24";
  GFXFormat[GFXFormat["D24S8"] = 56] = "D24S8";
  GFXFormat[GFXFormat["D32F"] = 57] = "D32F";
  GFXFormat[GFXFormat["D32F_S8"] = 58] = "D32F_S8"; // Compressed Format
  // Block Compression Format, DDS (DirectDraw Surface)
  // DXT1: 3 channels (5:6:5), 1/8 origianl size, with 0 or 1 bit of alpha

  GFXFormat[GFXFormat["BC1"] = 59] = "BC1";
  GFXFormat[GFXFormat["BC1_ALPHA"] = 60] = "BC1_ALPHA";
  GFXFormat[GFXFormat["BC1_SRGB"] = 61] = "BC1_SRGB";
  GFXFormat[GFXFormat["BC1_SRGB_ALPHA"] = 62] = "BC1_SRGB_ALPHA"; // DXT3: 4 channels (5:6:5), 1/4 origianl size, with 4 bits of alpha

  GFXFormat[GFXFormat["BC2"] = 63] = "BC2";
  GFXFormat[GFXFormat["BC2_SRGB"] = 64] = "BC2_SRGB"; // DXT5: 4 channels (5:6:5), 1/4 origianl size, with 8 bits of alpha

  GFXFormat[GFXFormat["BC3"] = 65] = "BC3";
  GFXFormat[GFXFormat["BC3_SRGB"] = 66] = "BC3_SRGB"; // 1 channel (8), 1/4 origianl size

  GFXFormat[GFXFormat["BC4"] = 67] = "BC4";
  GFXFormat[GFXFormat["BC4_SNORM"] = 68] = "BC4_SNORM"; // 2 channels (8:8), 1/2 origianl size

  GFXFormat[GFXFormat["BC5"] = 69] = "BC5";
  GFXFormat[GFXFormat["BC5_SNORM"] = 70] = "BC5_SNORM"; // 3 channels (16:16:16), half-floating point, 1/6 origianl size
  // UF16: unsigned float, 5 exponent bits + 11 mantissa bits
  // SF16: signed float, 1 signed bit + 5 exponent bits + 10 mantissa bits

  GFXFormat[GFXFormat["BC6H_UF16"] = 71] = "BC6H_UF16";
  GFXFormat[GFXFormat["BC6H_SF16"] = 72] = "BC6H_SF16"; // 4 channels (4~7 bits per channel) with 0 to 8 bits of alpha, 1/3 original size

  GFXFormat[GFXFormat["BC7"] = 73] = "BC7";
  GFXFormat[GFXFormat["BC7_SRGB"] = 74] = "BC7_SRGB"; // Ericsson Texture Compression Format

  GFXFormat[GFXFormat["ETC_RGB8"] = 75] = "ETC_RGB8";
  GFXFormat[GFXFormat["ETC2_RGB8"] = 76] = "ETC2_RGB8";
  GFXFormat[GFXFormat["ETC2_SRGB8"] = 77] = "ETC2_SRGB8";
  GFXFormat[GFXFormat["ETC2_RGB8_A1"] = 78] = "ETC2_RGB8_A1";
  GFXFormat[GFXFormat["ETC2_SRGB8_A1"] = 79] = "ETC2_SRGB8_A1";
  GFXFormat[GFXFormat["ETC2_RGBA8"] = 80] = "ETC2_RGBA8";
  GFXFormat[GFXFormat["ETC2_SRGB8_A8"] = 81] = "ETC2_SRGB8_A8";
  GFXFormat[GFXFormat["EAC_R11"] = 82] = "EAC_R11";
  GFXFormat[GFXFormat["EAC_R11SN"] = 83] = "EAC_R11SN";
  GFXFormat[GFXFormat["EAC_RG11"] = 84] = "EAC_RG11";
  GFXFormat[GFXFormat["EAC_RG11SN"] = 85] = "EAC_RG11SN"; // PVRTC (PowerVR)

  GFXFormat[GFXFormat["PVRTC_RGB2"] = 86] = "PVRTC_RGB2";
  GFXFormat[GFXFormat["PVRTC_RGBA2"] = 87] = "PVRTC_RGBA2";
  GFXFormat[GFXFormat["PVRTC_RGB4"] = 88] = "PVRTC_RGB4";
  GFXFormat[GFXFormat["PVRTC_RGBA4"] = 89] = "PVRTC_RGBA4";
  GFXFormat[GFXFormat["PVRTC2_2BPP"] = 90] = "PVRTC2_2BPP";
  GFXFormat[GFXFormat["PVRTC2_4BPP"] = 91] = "PVRTC2_4BPP";
})(GFXFormat || (GFXFormat = {}));

var GFXBufferUsageBit;

(function (GFXBufferUsageBit) {
  GFXBufferUsageBit[GFXBufferUsageBit["NONE"] = 0] = "NONE";
  GFXBufferUsageBit[GFXBufferUsageBit["TRANSFER_SRC"] = 1] = "TRANSFER_SRC";
  GFXBufferUsageBit[GFXBufferUsageBit["TRANSFER_DST"] = 2] = "TRANSFER_DST";
  GFXBufferUsageBit[GFXBufferUsageBit["INDEX"] = 4] = "INDEX";
  GFXBufferUsageBit[GFXBufferUsageBit["VERTEX"] = 8] = "VERTEX";
  GFXBufferUsageBit[GFXBufferUsageBit["UNIFORM"] = 16] = "UNIFORM";
  GFXBufferUsageBit[GFXBufferUsageBit["STORAGE"] = 32] = "STORAGE";
  GFXBufferUsageBit[GFXBufferUsageBit["INDIRECT"] = 64] = "INDIRECT";
})(GFXBufferUsageBit || (GFXBufferUsageBit = {}));

var GFXMemoryUsageBit;

(function (GFXMemoryUsageBit) {
  GFXMemoryUsageBit[GFXMemoryUsageBit["NONE"] = 0] = "NONE";
  GFXMemoryUsageBit[GFXMemoryUsageBit["DEVICE"] = 1] = "DEVICE";
  GFXMemoryUsageBit[GFXMemoryUsageBit["HOST"] = 2] = "HOST";
})(GFXMemoryUsageBit || (GFXMemoryUsageBit = {}));

var GFXBufferAccessBit;

(function (GFXBufferAccessBit) {
  GFXBufferAccessBit[GFXBufferAccessBit["NONE"] = 0] = "NONE";
  GFXBufferAccessBit[GFXBufferAccessBit["READ"] = 1] = "READ";
  GFXBufferAccessBit[GFXBufferAccessBit["WRITE"] = 2] = "WRITE";
})(GFXBufferAccessBit || (GFXBufferAccessBit = {}));

var GFXPrimitiveMode;

(function (GFXPrimitiveMode) {
  GFXPrimitiveMode[GFXPrimitiveMode["POINT_LIST"] = 0] = "POINT_LIST";
  GFXPrimitiveMode[GFXPrimitiveMode["LINE_LIST"] = 1] = "LINE_LIST";
  GFXPrimitiveMode[GFXPrimitiveMode["LINE_STRIP"] = 2] = "LINE_STRIP";
  GFXPrimitiveMode[GFXPrimitiveMode["LINE_LOOP"] = 3] = "LINE_LOOP";
  GFXPrimitiveMode[GFXPrimitiveMode["LINE_LIST_ADJACENCY"] = 4] = "LINE_LIST_ADJACENCY";
  GFXPrimitiveMode[GFXPrimitiveMode["LINE_STRIP_ADJACENCY"] = 5] = "LINE_STRIP_ADJACENCY";
  GFXPrimitiveMode[GFXPrimitiveMode["ISO_LINE_LIST"] = 6] = "ISO_LINE_LIST"; // raycast detectable:

  GFXPrimitiveMode[GFXPrimitiveMode["TRIANGLE_LIST"] = 7] = "TRIANGLE_LIST";
  GFXPrimitiveMode[GFXPrimitiveMode["TRIANGLE_STRIP"] = 8] = "TRIANGLE_STRIP";
  GFXPrimitiveMode[GFXPrimitiveMode["TRIANGLE_FAN"] = 9] = "TRIANGLE_FAN";
  GFXPrimitiveMode[GFXPrimitiveMode["TRIANGLE_LIST_ADJACENCY"] = 10] = "TRIANGLE_LIST_ADJACENCY";
  GFXPrimitiveMode[GFXPrimitiveMode["TRIANGLE_STRIP_ADJACENCY"] = 11] = "TRIANGLE_STRIP_ADJACENCY";
  GFXPrimitiveMode[GFXPrimitiveMode["TRIANGLE_PATCH_ADJACENCY"] = 12] = "TRIANGLE_PATCH_ADJACENCY";
  GFXPrimitiveMode[GFXPrimitiveMode["QUAD_PATCH_LIST"] = 13] = "QUAD_PATCH_LIST";
})(GFXPrimitiveMode || (GFXPrimitiveMode = {}));

var GFXPolygonMode;

(function (GFXPolygonMode) {
  GFXPolygonMode[GFXPolygonMode["FILL"] = 0] = "FILL";
  GFXPolygonMode[GFXPolygonMode["POINT"] = 1] = "POINT";
  GFXPolygonMode[GFXPolygonMode["LINE"] = 2] = "LINE";
})(GFXPolygonMode || (GFXPolygonMode = {}));

var GFXShadeModel;

(function (GFXShadeModel) {
  GFXShadeModel[GFXShadeModel["GOURAND"] = 0] = "GOURAND";
  GFXShadeModel[GFXShadeModel["FLAT"] = 1] = "FLAT";
})(GFXShadeModel || (GFXShadeModel = {}));

var GFXCullMode;

(function (GFXCullMode) {
  GFXCullMode[GFXCullMode["NONE"] = 0] = "NONE";
  GFXCullMode[GFXCullMode["FRONT"] = 1] = "FRONT";
  GFXCullMode[GFXCullMode["BACK"] = 2] = "BACK";
})(GFXCullMode || (GFXCullMode = {}));

var GFXComparisonFunc;

(function (GFXComparisonFunc) {
  GFXComparisonFunc[GFXComparisonFunc["NEVER"] = 0] = "NEVER";
  GFXComparisonFunc[GFXComparisonFunc["LESS"] = 1] = "LESS";
  GFXComparisonFunc[GFXComparisonFunc["EQUAL"] = 2] = "EQUAL";
  GFXComparisonFunc[GFXComparisonFunc["LESS_EQUAL"] = 3] = "LESS_EQUAL";
  GFXComparisonFunc[GFXComparisonFunc["GREATER"] = 4] = "GREATER";
  GFXComparisonFunc[GFXComparisonFunc["NOT_EQUAL"] = 5] = "NOT_EQUAL";
  GFXComparisonFunc[GFXComparisonFunc["GREATER_EQUAL"] = 6] = "GREATER_EQUAL";
  GFXComparisonFunc[GFXComparisonFunc["ALWAYS"] = 7] = "ALWAYS";
})(GFXComparisonFunc || (GFXComparisonFunc = {}));

var GFXStencilOp;

(function (GFXStencilOp) {
  GFXStencilOp[GFXStencilOp["ZERO"] = 0] = "ZERO";
  GFXStencilOp[GFXStencilOp["KEEP"] = 1] = "KEEP";
  GFXStencilOp[GFXStencilOp["REPLACE"] = 2] = "REPLACE";
  GFXStencilOp[GFXStencilOp["INCR"] = 3] = "INCR";
  GFXStencilOp[GFXStencilOp["DECR"] = 4] = "DECR";
  GFXStencilOp[GFXStencilOp["INVERT"] = 5] = "INVERT";
  GFXStencilOp[GFXStencilOp["INCR_WRAP"] = 6] = "INCR_WRAP";
  GFXStencilOp[GFXStencilOp["DECR_WRAP"] = 7] = "DECR_WRAP";
})(GFXStencilOp || (GFXStencilOp = {}));

var GFXBlendOp;

(function (GFXBlendOp) {
  GFXBlendOp[GFXBlendOp["ADD"] = 0] = "ADD";
  GFXBlendOp[GFXBlendOp["SUB"] = 1] = "SUB";
  GFXBlendOp[GFXBlendOp["REV_SUB"] = 2] = "REV_SUB";
  GFXBlendOp[GFXBlendOp["MIN"] = 3] = "MIN";
  GFXBlendOp[GFXBlendOp["MAX"] = 4] = "MAX";
})(GFXBlendOp || (GFXBlendOp = {}));

var GFXBlendFactor;

(function (GFXBlendFactor) {
  GFXBlendFactor[GFXBlendFactor["ZERO"] = 0] = "ZERO";
  GFXBlendFactor[GFXBlendFactor["ONE"] = 1] = "ONE";
  GFXBlendFactor[GFXBlendFactor["SRC_ALPHA"] = 2] = "SRC_ALPHA";
  GFXBlendFactor[GFXBlendFactor["DST_ALPHA"] = 3] = "DST_ALPHA";
  GFXBlendFactor[GFXBlendFactor["ONE_MINUS_SRC_ALPHA"] = 4] = "ONE_MINUS_SRC_ALPHA";
  GFXBlendFactor[GFXBlendFactor["ONE_MINUS_DST_ALPHA"] = 5] = "ONE_MINUS_DST_ALPHA";
  GFXBlendFactor[GFXBlendFactor["SRC_COLOR"] = 6] = "SRC_COLOR";
  GFXBlendFactor[GFXBlendFactor["DST_COLOR"] = 7] = "DST_COLOR";
  GFXBlendFactor[GFXBlendFactor["ONE_MINUS_SRC_COLOR"] = 8] = "ONE_MINUS_SRC_COLOR";
  GFXBlendFactor[GFXBlendFactor["ONE_MINUS_DST_COLOR"] = 9] = "ONE_MINUS_DST_COLOR";
  GFXBlendFactor[GFXBlendFactor["SRC_ALPHA_SATURATE"] = 10] = "SRC_ALPHA_SATURATE";
  GFXBlendFactor[GFXBlendFactor["CONSTANT_COLOR"] = 11] = "CONSTANT_COLOR";
  GFXBlendFactor[GFXBlendFactor["ONE_MINUS_CONSTANT_COLOR"] = 12] = "ONE_MINUS_CONSTANT_COLOR";
  GFXBlendFactor[GFXBlendFactor["CONSTANT_ALPHA"] = 13] = "CONSTANT_ALPHA";
  GFXBlendFactor[GFXBlendFactor["ONE_MINUS_CONSTANT_ALPHA"] = 14] = "ONE_MINUS_CONSTANT_ALPHA";
})(GFXBlendFactor || (GFXBlendFactor = {}));

var GFXColorMask;

(function (GFXColorMask) {
  GFXColorMask[GFXColorMask["NONE"] = 0] = "NONE";
  GFXColorMask[GFXColorMask["R"] = 1] = "R";
  GFXColorMask[GFXColorMask["G"] = 2] = "G";
  GFXColorMask[GFXColorMask["B"] = 4] = "B";
  GFXColorMask[GFXColorMask["A"] = 8] = "A";
  GFXColorMask[GFXColorMask["ALL"] = 15] = "ALL";
})(GFXColorMask || (GFXColorMask = {}));

var GFXFilter;

(function (GFXFilter) {
  GFXFilter[GFXFilter["NONE"] = 0] = "NONE";
  GFXFilter[GFXFilter["POINT"] = 1] = "POINT";
  GFXFilter[GFXFilter["LINEAR"] = 2] = "LINEAR";
  GFXFilter[GFXFilter["ANISOTROPIC"] = 3] = "ANISOTROPIC";
})(GFXFilter || (GFXFilter = {}));

var GFXAddress;

(function (GFXAddress) {
  GFXAddress[GFXAddress["WRAP"] = 0] = "WRAP";
  GFXAddress[GFXAddress["MIRROR"] = 1] = "MIRROR";
  GFXAddress[GFXAddress["CLAMP"] = 2] = "CLAMP";
  GFXAddress[GFXAddress["BORDER"] = 3] = "BORDER";
})(GFXAddress || (GFXAddress = {}));

var GFXTextureType;

(function (GFXTextureType) {
  GFXTextureType[GFXTextureType["TEX1D"] = 0] = "TEX1D";
  GFXTextureType[GFXTextureType["TEX2D"] = 1] = "TEX2D";
  GFXTextureType[GFXTextureType["TEX3D"] = 2] = "TEX3D";
})(GFXTextureType || (GFXTextureType = {}));

var GFXTextureUsageBit;

(function (GFXTextureUsageBit) {
  GFXTextureUsageBit[GFXTextureUsageBit["NONE"] = 0] = "NONE";
  GFXTextureUsageBit[GFXTextureUsageBit["TRANSFER_SRC"] = 1] = "TRANSFER_SRC";
  GFXTextureUsageBit[GFXTextureUsageBit["TRANSFER_DST"] = 2] = "TRANSFER_DST";
  GFXTextureUsageBit[GFXTextureUsageBit["SAMPLED"] = 4] = "SAMPLED";
  GFXTextureUsageBit[GFXTextureUsageBit["STORAGE"] = 8] = "STORAGE";
  GFXTextureUsageBit[GFXTextureUsageBit["COLOR_ATTACHMENT"] = 16] = "COLOR_ATTACHMENT";
  GFXTextureUsageBit[GFXTextureUsageBit["DEPTH_STENCIL_ATTACHMENT"] = 32] = "DEPTH_STENCIL_ATTACHMENT";
  GFXTextureUsageBit[GFXTextureUsageBit["TRANSIENT_ATTACHMENT"] = 64] = "TRANSIENT_ATTACHMENT";
  GFXTextureUsageBit[GFXTextureUsageBit["INPUT_ATTACHMENT"] = 128] = "INPUT_ATTACHMENT";
})(GFXTextureUsageBit || (GFXTextureUsageBit = {}));

var GFXSampleCount;

(function (GFXSampleCount) {
  GFXSampleCount[GFXSampleCount["X1"] = 0] = "X1";
  GFXSampleCount[GFXSampleCount["X2"] = 1] = "X2";
  GFXSampleCount[GFXSampleCount["X4"] = 2] = "X4";
  GFXSampleCount[GFXSampleCount["X8"] = 3] = "X8";
  GFXSampleCount[GFXSampleCount["X16"] = 4] = "X16";
  GFXSampleCount[GFXSampleCount["X32"] = 5] = "X32";
  GFXSampleCount[GFXSampleCount["X64"] = 6] = "X64";
})(GFXSampleCount || (GFXSampleCount = {}));

var GFXTextureFlagBit;

(function (GFXTextureFlagBit) {
  GFXTextureFlagBit[GFXTextureFlagBit["NONE"] = 0] = "NONE";
  GFXTextureFlagBit[GFXTextureFlagBit["GEN_MIPMAP"] = 1] = "GEN_MIPMAP";
  GFXTextureFlagBit[GFXTextureFlagBit["CUBEMAP"] = 2] = "CUBEMAP";
  GFXTextureFlagBit[GFXTextureFlagBit["BAKUP_BUFFER"] = 4] = "BAKUP_BUFFER";
})(GFXTextureFlagBit || (GFXTextureFlagBit = {}));

var GFXTextureViewType;

(function (GFXTextureViewType) {
  GFXTextureViewType[GFXTextureViewType["TV1D"] = 0] = "TV1D";
  GFXTextureViewType[GFXTextureViewType["TV2D"] = 1] = "TV2D";
  GFXTextureViewType[GFXTextureViewType["TV3D"] = 2] = "TV3D";
  GFXTextureViewType[GFXTextureViewType["CUBE"] = 3] = "CUBE";
  GFXTextureViewType[GFXTextureViewType["TV1D_ARRAY"] = 4] = "TV1D_ARRAY";
  GFXTextureViewType[GFXTextureViewType["TV2D_ARRAY"] = 5] = "TV2D_ARRAY";
})(GFXTextureViewType || (GFXTextureViewType = {}));

var GFXShaderType;

(function (GFXShaderType) {
  GFXShaderType[GFXShaderType["VERTEX"] = 0] = "VERTEX";
  GFXShaderType[GFXShaderType["HULL"] = 1] = "HULL";
  GFXShaderType[GFXShaderType["DOMAIN"] = 2] = "DOMAIN";
  GFXShaderType[GFXShaderType["GEOMETRY"] = 3] = "GEOMETRY";
  GFXShaderType[GFXShaderType["FRAGMENT"] = 4] = "FRAGMENT";
  GFXShaderType[GFXShaderType["COMPUTE"] = 5] = "COMPUTE";
  GFXShaderType[GFXShaderType["COUNT"] = 6] = "COUNT";
})(GFXShaderType || (GFXShaderType = {}));

var GFXBindingType;

(function (GFXBindingType) {
  GFXBindingType[GFXBindingType["UNKNOWN"] = 0] = "UNKNOWN";
  GFXBindingType[GFXBindingType["UNIFORM_BUFFER"] = 1] = "UNIFORM_BUFFER";
  GFXBindingType[GFXBindingType["SAMPLER"] = 2] = "SAMPLER";
  GFXBindingType[GFXBindingType["STORAGE_BUFFER"] = 3] = "STORAGE_BUFFER";
})(GFXBindingType || (GFXBindingType = {}));

var GFXCommandBufferType;

(function (GFXCommandBufferType) {
  GFXCommandBufferType[GFXCommandBufferType["PRIMARY"] = 0] = "PRIMARY";
  GFXCommandBufferType[GFXCommandBufferType["SECONDARY"] = 1] = "SECONDARY";
})(GFXCommandBufferType || (GFXCommandBufferType = {})); // Enumeration all possible values of operations to be performed on initially Loading a Framebuffer Object.


var GFXLoadOp;

(function (GFXLoadOp) {
  GFXLoadOp[GFXLoadOp["LOAD"] = 0] = "LOAD";
  GFXLoadOp[GFXLoadOp["CLEAR"] = 1] = "CLEAR";
  GFXLoadOp[GFXLoadOp["DISCARD"] = 2] = "DISCARD";
})(GFXLoadOp || (GFXLoadOp = {})); // Enumerates all possible values of operations to be performed when Storing to a Framebuffer Object.


var GFXStoreOp;

(function (GFXStoreOp) {
  GFXStoreOp[GFXStoreOp["STORE"] = 0] = "STORE";
  GFXStoreOp[GFXStoreOp["DISCARD"] = 1] = "DISCARD";
})(GFXStoreOp || (GFXStoreOp = {}));

var GFXTextureLayout;

(function (GFXTextureLayout) {
  GFXTextureLayout[GFXTextureLayout["UNDEFINED"] = 0] = "UNDEFINED";
  GFXTextureLayout[GFXTextureLayout["GENERAL"] = 1] = "GENERAL";
  GFXTextureLayout[GFXTextureLayout["COLOR_ATTACHMENT_OPTIMAL"] = 2] = "COLOR_ATTACHMENT_OPTIMAL";
  GFXTextureLayout[GFXTextureLayout["DEPTH_STENCIL_ATTACHMENT_OPTIMAL"] = 3] = "DEPTH_STENCIL_ATTACHMENT_OPTIMAL";
  GFXTextureLayout[GFXTextureLayout["DEPTH_STENCIL_READONLY_OPTIMAL"] = 4] = "DEPTH_STENCIL_READONLY_OPTIMAL";
  GFXTextureLayout[GFXTextureLayout["SHADER_READONLY_OPTIMAL"] = 5] = "SHADER_READONLY_OPTIMAL";
  GFXTextureLayout[GFXTextureLayout["TRANSFER_SRC_OPTIMAL"] = 6] = "TRANSFER_SRC_OPTIMAL";
  GFXTextureLayout[GFXTextureLayout["TRANSFER_DST_OPTIMAL"] = 7] = "TRANSFER_DST_OPTIMAL";
  GFXTextureLayout[GFXTextureLayout["PREINITIALIZED"] = 8] = "PREINITIALIZED";
  GFXTextureLayout[GFXTextureLayout["PRESENT_SRC"] = 9] = "PRESENT_SRC";
})(GFXTextureLayout || (GFXTextureLayout = {}));

var GFXPipelineBindPoint;

(function (GFXPipelineBindPoint) {
  GFXPipelineBindPoint[GFXPipelineBindPoint["GRAPHICS"] = 0] = "GRAPHICS";
  GFXPipelineBindPoint[GFXPipelineBindPoint["COMPUTE"] = 1] = "COMPUTE";
  GFXPipelineBindPoint[GFXPipelineBindPoint["RAY_TRACING"] = 2] = "RAY_TRACING";
})(GFXPipelineBindPoint || (GFXPipelineBindPoint = {}));

var GFXDynamicState;

(function (GFXDynamicState) {
  GFXDynamicState[GFXDynamicState["VIEWPORT"] = 0] = "VIEWPORT";
  GFXDynamicState[GFXDynamicState["SCISSOR"] = 1] = "SCISSOR";
  GFXDynamicState[GFXDynamicState["LINE_WIDTH"] = 2] = "LINE_WIDTH";
  GFXDynamicState[GFXDynamicState["DEPTH_BIAS"] = 3] = "DEPTH_BIAS";
  GFXDynamicState[GFXDynamicState["BLEND_CONSTANTS"] = 4] = "BLEND_CONSTANTS";
  GFXDynamicState[GFXDynamicState["DEPTH_BOUNDS"] = 5] = "DEPTH_BOUNDS";
  GFXDynamicState[GFXDynamicState["STENCIL_WRITE_MASK"] = 6] = "STENCIL_WRITE_MASK";
  GFXDynamicState[GFXDynamicState["STENCIL_COMPARE_MASK"] = 7] = "STENCIL_COMPARE_MASK";
})(GFXDynamicState || (GFXDynamicState = {}));

var GFXStencilFace;

(function (GFXStencilFace) {
  GFXStencilFace[GFXStencilFace["FRONT"] = 0] = "FRONT";
  GFXStencilFace[GFXStencilFace["BACK"] = 1] = "BACK";
  GFXStencilFace[GFXStencilFace["ALL"] = 2] = "ALL";
})(GFXStencilFace || (GFXStencilFace = {}));

var GFXQueueType;

(function (GFXQueueType) {
  GFXQueueType[GFXQueueType["GRAPHICS"] = 0] = "GRAPHICS";
  GFXQueueType[GFXQueueType["COMPUTE"] = 1] = "COMPUTE";
  GFXQueueType[GFXQueueType["TRANSFER"] = 2] = "TRANSFER";
})(GFXQueueType || (GFXQueueType = {}));

var GFXClearFlag;

(function (GFXClearFlag) {
  GFXClearFlag[GFXClearFlag["NONE"] = 0] = "NONE";
  GFXClearFlag[GFXClearFlag["COLOR"] = 1] = "COLOR";
  GFXClearFlag[GFXClearFlag["DEPTH"] = 2] = "DEPTH";
  GFXClearFlag[GFXClearFlag["STENCIL"] = 4] = "STENCIL";
  GFXClearFlag[GFXClearFlag["DEPTH_STENCIL"] = 6] = "DEPTH_STENCIL";
  GFXClearFlag[GFXClearFlag["ALL"] = 7] = "ALL";
})(GFXClearFlag || (GFXClearFlag = {}));

function GFXGetTypeSize(type) {
  switch (type) {
    case GFXType.BOOL:
    case GFXType.INT:
    case GFXType.UINT:
    case GFXType.FLOAT:
      return 4;

    case GFXType.BOOL2:
    case GFXType.INT2:
    case GFXType.UINT2:
    case GFXType.FLOAT2:
      return 8;

    case GFXType.BOOL3:
    case GFXType.INT3:
    case GFXType.UINT3:
    case GFXType.FLOAT3:
      return 12;

    case GFXType.BOOL4:
    case GFXType.INT4:
    case GFXType.UINT4:
    case GFXType.FLOAT4:
    case GFXType.MAT2:
      return 16;

    case GFXType.MAT2X3:
      return 24;

    case GFXType.MAT2X4:
      return 32;

    case GFXType.MAT3X2:
      return 24;

    case GFXType.MAT3:
      return 36;

    case GFXType.MAT3X4:
      return 48;

    case GFXType.MAT4X2:
      return 32;

    case GFXType.MAT4X2:
      return 32;

    case GFXType.MAT4:
      return 64;

    case GFXType.SAMPLER1D:
    case GFXType.SAMPLER1D_ARRAY:
    case GFXType.SAMPLER2D:
    case GFXType.SAMPLER2D_ARRAY:
    case GFXType.SAMPLER3D:
    case GFXType.SAMPLER_CUBE:
      return 4;

    default:
      {
        return 0;
      }
  }
} // import { GFXBuffer } from '../gfx/buffer';


var RenderPassStage;

(function (RenderPassStage) {
  RenderPassStage[RenderPassStage["DEFAULT"] = 100] = "DEFAULT";
})(RenderPassStage || (RenderPassStage = {}));

var RenderPriority;

(function (RenderPriority) {
  RenderPriority[RenderPriority["MIN"] = 0] = "MIN";
  RenderPriority[RenderPriority["MAX"] = 255] = "MAX";
  RenderPriority[RenderPriority["DEFAULT"] = 128] = "DEFAULT";
})(RenderPriority || (RenderPriority = {}));

var MAX_BINDING_SUPPORTED = 24; // from WebGL 2 spec

var UniformBinding;

(function (UniformBinding) {
  // UBOs
  UniformBinding[UniformBinding["UBO_GLOBAL"] = MAX_BINDING_SUPPORTED - 1] = "UBO_GLOBAL";
  UniformBinding[UniformBinding["UBO_SHADOW"] = MAX_BINDING_SUPPORTED - 2] = "UBO_SHADOW";
  UniformBinding[UniformBinding["UBO_LOCAL"] = MAX_BINDING_SUPPORTED - 3] = "UBO_LOCAL";
  UniformBinding[UniformBinding["UBO_FORWARD_LIGHTS"] = MAX_BINDING_SUPPORTED - 4] = "UBO_FORWARD_LIGHTS";
  UniformBinding[UniformBinding["UBO_SKINNING"] = MAX_BINDING_SUPPORTED - 5] = "UBO_SKINNING";
  UniformBinding[UniformBinding["UBO_SKINNING_TEXTURE"] = MAX_BINDING_SUPPORTED - 6] = "UBO_SKINNING_TEXTURE";
  UniformBinding[UniformBinding["UBO_UI"] = MAX_BINDING_SUPPORTED - 7] = "UBO_UI"; // samplers

  UniformBinding[UniformBinding["SAMPLER_JOINTS"] = MAX_BINDING_SUPPORTED + 1] = "SAMPLER_JOINTS";
  UniformBinding[UniformBinding["SAMPLER_ENVIRONMENT"] = MAX_BINDING_SUPPORTED + 2] = "SAMPLER_ENVIRONMENT"; // rooms left for custom bindings
  // effect importer prepares bindings according to this

  UniformBinding[UniformBinding["CUSTUM_UBO_BINDING_END_POINT"] = MAX_BINDING_SUPPORTED - 7] = "CUSTUM_UBO_BINDING_END_POINT";
  UniformBinding[UniformBinding["CUSTOM_SAMPLER_BINDING_START_POINT"] = MAX_BINDING_SUPPORTED + 6] = "CUSTOM_SAMPLER_BINDING_START_POINT";
})(UniformBinding || (UniformBinding = {})); // export class UBOGlobal {
//     public static TIME_OFFSET: number = 0;
//     public static SCREEN_SIZE_OFFSET: number = UBOGlobal.TIME_OFFSET + 4;
//     public static SCREEN_SCALE_OFFSET: number = UBOGlobal.SCREEN_SIZE_OFFSET + 4;
//     public static NATIVE_SIZE_OFFSET: number = UBOGlobal.SCREEN_SCALE_OFFSET + 4;
//     public static MAT_VIEW_OFFSET: number = UBOGlobal.NATIVE_SIZE_OFFSET + 4;
//     public static MAT_VIEW_INV_OFFSET: number = UBOGlobal.MAT_VIEW_OFFSET + 16;
//     public static MAT_PROJ_OFFSET: number = UBOGlobal.MAT_VIEW_INV_OFFSET + 16;
//     public static MAT_PROJ_INV_OFFSET: number = UBOGlobal.MAT_PROJ_OFFSET + 16;
//     public static MAT_VIEW_PROJ_OFFSET: number = UBOGlobal.MAT_PROJ_INV_OFFSET + 16;
//     public static MAT_VIEW_PROJ_INV_OFFSET: number = UBOGlobal.MAT_VIEW_PROJ_OFFSET + 16;
//     public static CAMERA_POS_OFFSET: number = UBOGlobal.MAT_VIEW_PROJ_INV_OFFSET + 16;
//     public static EXPOSURE_OFFSET: number = UBOGlobal.CAMERA_POS_OFFSET + 4;
//     public static MAIN_LIT_DIR_OFFSET: number = UBOGlobal.EXPOSURE_OFFSET + 4;
//     public static MAIN_LIT_COLOR_OFFSET: number = UBOGlobal.MAIN_LIT_DIR_OFFSET + 4;
//     public static AMBIENT_SKY_OFFSET: number = UBOGlobal.MAIN_LIT_COLOR_OFFSET + 4;
//     public static AMBIENT_GROUND_OFFSET: number = UBOGlobal.AMBIENT_SKY_OFFSET + 4;
//     public static COUNT: number = UBOGlobal.AMBIENT_GROUND_OFFSET + 4;
//     public static SIZE: number = UBOGlobal.COUNT * 4;
//     public static BLOCK: GFXUniformBlock = {
//         binding: UniformBinding.UBO_GLOBAL, name: 'CCGlobal', members: [
//             { name: 'cc_time', type: GFXType.FLOAT4, count: 1 },
//             { name: 'cc_screenSize', type: GFXType.FLOAT4, count: 1 },
//             { name: 'cc_screenScale', type: GFXType.FLOAT4, count: 1 },
//             { name: 'cc_nativeSize', type: GFXType.FLOAT4, count: 1 },
//             { name: 'cc_matView', type: GFXType.MAT4, count: 1 },
//             { name: 'cc_matViewInv', type: GFXType.MAT4, count: 1 },
//             { name: 'cc_matProj', type: GFXType.MAT4, count: 1 },
//             { name: 'cc_matProjInv', type: GFXType.MAT4, count: 1 },
//             { name: 'cc_matViewProj', type: GFXType.MAT4, count: 1 },
//             { name: 'cc_matViewProjInv', type: GFXType.MAT4, count: 1 },
//             { name: 'cc_cameraPos', type: GFXType.FLOAT4, count: 1 },
//             { name: 'cc_exposure', type: GFXType.FLOAT4, count: 1 },
//             { name: 'cc_mainLitDir', type: GFXType.FLOAT4, count: 1 },
//             { name: 'cc_mainLitColor', type: GFXType.FLOAT4, count: 1 },
//             { name: 'cc_ambientSky', type: GFXType.FLOAT4, count: 1 },
//             { name: 'cc_ambientGround', type: GFXType.FLOAT4, count: 1 },
//         ],
//     };
//     public view: Float32Array = new Float32Array(UBOGlobal.COUNT);
// }
// export class UBOShadow {
//     public static MAT_LIGHT_PLANE_PROJ_OFFSET: number = 0;
//     public static SHADOW_COLOR_OFFSET: number = UBOShadow.MAT_LIGHT_PLANE_PROJ_OFFSET + 16;
//     public static COUNT: number = UBOShadow.SHADOW_COLOR_OFFSET + 4;
//     public static SIZE: number = UBOShadow.COUNT * 4;
//     public static BLOCK: GFXUniformBlock = {
//         binding: UniformBinding.UBO_SHADOW, name: 'CCShadow', members: [
//             { name: 'cc_matLightPlaneProj', type: GFXType.MAT4, count: 1 },
//             { name: 'cc_shadowColor', type: GFXType.FLOAT4, count: 1 },
//         ],
//     };
//     public view: Float32Array = new Float32Array(UBOShadow.COUNT);
// }
// export const localBindingsDesc: Map<string, IInternalBindingDesc> = new Map<string, IInternalBindingDesc>();
// export class UBOLocal {
//     public static MAT_WORLD_OFFSET: number = 0;
//     public static MAT_WORLD_IT_OFFSET: number = UBOLocal.MAT_WORLD_OFFSET + 16;
//     public static COUNT: number = UBOLocal.MAT_WORLD_IT_OFFSET + 16;
//     public static SIZE: number = UBOLocal.COUNT * 4;
//     public static BLOCK: GFXUniformBlock = {
//         binding: UniformBinding.UBO_LOCAL, name: 'CCLocal', members: [
//             { name: 'cc_matWorld', type: GFXType.MAT4, count: 1 },
//             { name: 'cc_matWorldIT', type: GFXType.MAT4, count: 1 },
//         ],
//     };
//     public view: Float32Array = new Float32Array(UBOLocal.COUNT);
// }
// localBindingsDesc.set(UBOLocal.BLOCK.name, {
//     type: GFXBindingType.UNIFORM_BUFFER,
//     blockInfo: UBOLocal.BLOCK,
// });
// export class UBOForwardLight {
//     public static MAX_SPHERE_LIGHTS = 2;
//     public static MAX_SPOT_LIGHTS = 2;
//     public static SPHERE_LIGHT_POS_OFFSET: number = 0;
//     public static SPHERE_LIGHT_SIZE_RANGE_OFFSET: number = UBOForwardLight.SPHERE_LIGHT_POS_OFFSET + UBOForwardLight.MAX_SPHERE_LIGHTS * 4;
//     public static SPHERE_LIGHT_COLOR_OFFSET: number = UBOForwardLight.SPHERE_LIGHT_SIZE_RANGE_OFFSET + UBOForwardLight.MAX_SPHERE_LIGHTS * 4;
//     public static SPOT_LIGHT_POS_OFFSET: number = UBOForwardLight.SPHERE_LIGHT_COLOR_OFFSET + UBOForwardLight.MAX_SPOT_LIGHTS * 4;
//     public static SPOT_LIGHT_SIZE_RANGE_ANGLE_OFFSET: number = UBOForwardLight.SPOT_LIGHT_POS_OFFSET + UBOForwardLight.MAX_SPOT_LIGHTS * 4;
//     public static SPOT_LIGHT_DIR_OFFSET: number = UBOForwardLight.SPOT_LIGHT_SIZE_RANGE_ANGLE_OFFSET + UBOForwardLight.MAX_SPOT_LIGHTS * 4;
//     public static SPOT_LIGHT_COLOR_OFFSET: number = UBOForwardLight.SPOT_LIGHT_DIR_OFFSET + UBOForwardLight.MAX_SPOT_LIGHTS * 4;
//     public static COUNT: number = UBOForwardLight.SPOT_LIGHT_COLOR_OFFSET + UBOForwardLight.MAX_SPOT_LIGHTS * 4;
//     public static SIZE: number = UBOForwardLight.COUNT * 4;
//     public static BLOCK: GFXUniformBlock = {
//         binding: UniformBinding.UBO_FORWARD_LIGHTS, name: 'CCForwardLight', members: [
//             { name: 'cc_sphereLitPos', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPHERE_LIGHTS },
//             { name: 'cc_sphereLitSizeRange', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPHERE_LIGHTS },
//             { name: 'cc_sphereLitColor', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPHERE_LIGHTS },
//             { name: 'cc_spotLitPos', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPOT_LIGHTS },
//             { name: 'cc_spotLitSizeRangeAngle', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPOT_LIGHTS },
//             { name: 'cc_spotLitDir', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPOT_LIGHTS },
//             { name: 'cc_spotLitColor', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPOT_LIGHTS },
//         ],
//     };
//     public view: Float32Array = new Float32Array(UBOForwardLight.COUNT);
// }
// localBindingsDesc.set(UBOForwardLight.BLOCK.name, {
//     type: GFXBindingType.UNIFORM_BUFFER,
//     blockInfo: UBOForwardLight.BLOCK,
// });
// export class UBOSkinning {
//     public static MAT_JOINT_OFFSET: number = 0;
//     public static JOINTS_TEXTURE_SIZE_OFFSET: number = UBOSkinning.MAT_JOINT_OFFSET + 128 * 16;
//     public static COUNT: number = UBOSkinning.JOINTS_TEXTURE_SIZE_OFFSET + 4;
//     public static SIZE: number = UBOSkinning.COUNT * 4;
//     public static BLOCK: GFXUniformBlock = {
//         binding: UniformBinding.UBO_SKINNING, name: 'CCSkinning', members: [
//             { name: 'cc_matJoint', type: GFXType.MAT4, count: 128 },
//             { name: 'cc_jointsTextureSize', type: GFXType.FLOAT4, count: 1 },
//         ],
//     };
// }
// localBindingsDesc.set(UBOSkinning.BLOCK.name, {
//     type: GFXBindingType.UNIFORM_BUFFER,
//     blockInfo: UBOSkinning.BLOCK,
// });
// export const UNIFORM_JOINTS_TEXTURE: GFXUniformSampler = {
//     binding: UniformBinding.SAMPLER_JOINTS, name: 'cc_jointsTexture', type: GFXType.SAMPLER2D, count: 1,
// };
// localBindingsDesc.set(UNIFORM_JOINTS_TEXTURE.name, {
//     type: GFXBindingType.SAMPLER,
//     samplerInfo: UNIFORM_JOINTS_TEXTURE,
// });
// export interface IInternalBindingDesc {
//     type: GFXBindingType;
//     blockInfo?: GFXUniformBlock;
//     samplerInfo?: GFXUniformSampler;
// }
// export interface IInternalBindingInst extends IInternalBindingDesc {
//     buffer?: GFXBuffer;
//     sampler?: GFXSampler;
//     textureView?: GFXTextureView;
// }
// this file is used for offline effect building.


var _a, _b;

var SamplerInfoIndex;

(function (SamplerInfoIndex) {
  SamplerInfoIndex[SamplerInfoIndex["minFilter"] = 0] = "minFilter";
  SamplerInfoIndex[SamplerInfoIndex["magFilter"] = 1] = "magFilter";
  SamplerInfoIndex[SamplerInfoIndex["mipFilter"] = 2] = "mipFilter";
  SamplerInfoIndex[SamplerInfoIndex["addressU"] = 3] = "addressU";
  SamplerInfoIndex[SamplerInfoIndex["addressV"] = 4] = "addressV";
  SamplerInfoIndex[SamplerInfoIndex["addressW"] = 5] = "addressW";
  SamplerInfoIndex[SamplerInfoIndex["maxAnisotropy"] = 6] = "maxAnisotropy";
  SamplerInfoIndex[SamplerInfoIndex["cmpFunc"] = 7] = "cmpFunc";
  SamplerInfoIndex[SamplerInfoIndex["minLOD"] = 8] = "minLOD";
  SamplerInfoIndex[SamplerInfoIndex["maxLOD"] = 9] = "maxLOD";
  SamplerInfoIndex[SamplerInfoIndex["mipLODBias"] = 10] = "mipLODBias";
  SamplerInfoIndex[SamplerInfoIndex["borderColor"] = 11] = "borderColor";
  SamplerInfoIndex[SamplerInfoIndex["total"] = 15] = "total";
})(SamplerInfoIndex || (SamplerInfoIndex = {}));

var typeMap = {};
typeMap[typeMap['bool'] = GFXType.BOOL] = 'bool';
typeMap[typeMap['int'] = GFXType.INT] = 'int';
typeMap[typeMap['ivec2'] = GFXType.INT2] = 'ivec2invTypeParams';
typeMap[typeMap['ivec3'] = GFXType.INT3] = 'ivec3';
typeMap[typeMap['ivec4'] = GFXType.INT4] = 'ivec4';
typeMap[typeMap['float'] = GFXType.FLOAT] = 'float';
typeMap[typeMap['vec2'] = GFXType.FLOAT2] = 'vec2';
typeMap[typeMap['vec3'] = GFXType.FLOAT3] = 'vec3';
typeMap[typeMap['vec4'] = GFXType.FLOAT4] = 'vec4';
typeMap[typeMap['mat2'] = GFXType.MAT2] = 'mat2';
typeMap[typeMap['mat3'] = GFXType.MAT3] = 'mat3';
typeMap[typeMap['mat4'] = GFXType.MAT4] = 'mat4';
typeMap[typeMap['sampler2D'] = GFXType.SAMPLER2D] = 'sampler2D';
typeMap[typeMap['samplerCube'] = GFXType.SAMPLER_CUBE] = 'samplerCube';
var sizeMap = (_a = {}, _a[GFXType.BOOL] = 4, _a[GFXType.INT] = 4, _a[GFXType.INT2] = 8, _a[GFXType.INT3] = 12, _a[GFXType.INT4] = 16, _a[GFXType.FLOAT] = 4, _a[GFXType.FLOAT2] = 8, _a[GFXType.FLOAT3] = 12, _a[GFXType.FLOAT4] = 16, _a[GFXType.MAT2] = 16, _a[GFXType.MAT3] = 36, _a[GFXType.MAT4] = 64, _a[GFXType.SAMPLER2D] = 4, _a[GFXType.SAMPLER_CUBE] = 4, _a);
var formatMap = (_b = {}, _b[GFXType.BOOL] = GFXFormat.R32I, _b[GFXType.INT] = GFXFormat.R32I, _b[GFXType.INT2] = GFXFormat.RG32I, _b[GFXType.INT3] = GFXFormat.RGB32I, _b[GFXType.INT4] = GFXFormat.RGBA32I, _b[GFXType.FLOAT] = GFXFormat.R32F, _b[GFXType.FLOAT2] = GFXFormat.RG32F, _b[GFXType.FLOAT3] = GFXFormat.RGB32F, _b[GFXType.FLOAT4] = GFXFormat.RGBA32F, _b); // const passParams = {
//   // color mask
//   NONE: gfx.GFXColorMask.NONE,
//   R: gfx.GFXColorMask.R,
//   G: gfx.GFXColorMask.G,
//   B: gfx.GFXColorMask.B,
//   A: gfx.GFXColorMask.A,
//   RG: gfx.GFXColorMask.R | gfx.GFXColorMask.G,
//   RB: gfx.GFXColorMask.R | gfx.GFXColorMask.B,
//   RA: gfx.GFXColorMask.R | gfx.GFXColorMask.A,
//   GB: gfx.GFXColorMask.G | gfx.GFXColorMask.B,
//   GA: gfx.GFXColorMask.G | gfx.GFXColorMask.A,
//   BA: gfx.GFXColorMask.B | gfx.GFXColorMask.A,
//   RGB: gfx.GFXColorMask.R | gfx.GFXColorMask.G | gfx.GFXColorMask.B,
//   RGA: gfx.GFXColorMask.R | gfx.GFXColorMask.G | gfx.GFXColorMask.A,
//   RBA: gfx.GFXColorMask.R | gfx.GFXColorMask.B | gfx.GFXColorMask.A,
//   GBA: gfx.GFXColorMask.G | gfx.GFXColorMask.B | gfx.GFXColorMask.A,
//   ALL: gfx.GFXColorMask.ALL,
//   // blend operation
//   ADD: gfx.GFXBlendOp.ADD,
//   SUB: gfx.GFXBlendOp.SUB,
//   REV_SUB: gfx.GFXBlendOp.REV_SUB,
//   MIN: gfx.GFXBlendOp.MIN,
//   MAX: gfx.GFXBlendOp.MAX,
//   // blend factor
//   ZERO: gfx.GFXBlendFactor.ZERO,
//   ONE: gfx.GFXBlendFactor.ONE,
//   SRC_ALPHA: gfx.GFXBlendFactor.SRC_ALPHA,
//   DST_ALPHA: gfx.GFXBlendFactor.DST_ALPHA,
//   ONE_MINUS_SRC_ALPHA: gfx.GFXBlendFactor.ONE_MINUS_SRC_ALPHA,
//   ONE_MINUS_DST_ALPHA: gfx.GFXBlendFactor.ONE_MINUS_DST_ALPHA,
//   SRC_COLOR: gfx.GFXBlendFactor.SRC_COLOR,
//   DST_COLOR: gfx.GFXBlendFactor.DST_COLOR,
//   ONE_MINUS_SRC_COLOR: gfx.GFXBlendFactor.ONE_MINUS_SRC_COLOR,
//   ONE_MINUS_DST_COLOR: gfx.GFXBlendFactor.ONE_MINUS_DST_COLOR,
//   SRC_ALPHA_SATURATE: gfx.GFXBlendFactor.SRC_ALPHA_SATURATE,
//   CONSTANT_COLOR: gfx.GFXBlendFactor.CONSTANT_COLOR,
//   ONE_MINUS_CONSTANT_COLOR: gfx.GFXBlendFactor.ONE_MINUS_CONSTANT_COLOR,
//   CONSTANT_ALPHA: gfx.GFXBlendFactor.CONSTANT_ALPHA,
//   ONE_MINUS_CONSTANT_ALPHA: gfx.GFXBlendFactor.ONE_MINUS_CONSTANT_ALPHA,
//   // stencil operation
//   // ZERO: GFXStencilOp.ZERO, // duplicate, safely removed because enum value is(and always will be) the same
//   KEEP: gfx.GFXStencilOp.KEEP,
//   REPLACE: gfx.GFXStencilOp.REPLACE,
//   INCR: gfx.GFXStencilOp.INCR,
//   DECR: gfx.GFXStencilOp.DECR,
//   INVERT: gfx.GFXStencilOp.INVERT,
//   INCR_WRAP: gfx.GFXStencilOp.INCR_WRAP,
//   DECR_WRAP: gfx.GFXStencilOp.DECR_WRAP,
//     // comparison function
//   NEVER: gfx.GFXComparisonFunc.NEVER,
//   LESS: gfx.GFXComparisonFunc.LESS,
//   EQUAL: gfx.GFXComparisonFunc.EQUAL,
//   LESS_EQUAL: gfx.GFXComparisonFunc.LESS_EQUAL,
//   GREATER: gfx.GFXComparisonFunc.GREATER,
//   NOT_EQUAL: gfx.GFXComparisonFunc.NOT_EQUAL,
//   GREATER_EQUAL: gfx.GFXComparisonFunc.GREATER_EQUAL,
//   ALWAYS: gfx.GFXComparisonFunc.ALWAYS,
//   // cull mode
//   // NONE: GFXCullMode.NONE, // duplicate, safely removed because enum value is(and always will be) the same
//   FRONT: gfx.GFXCullMode.FRONT,
//   BACK: gfx.GFXCullMode.BACK,
//   // shade mode
//   GOURAND: gfx.GFXShadeModel.GOURAND,
//   FLAT: gfx.GFXShadeModel.FLAT,
//   // polygon mode
//   FILL: gfx.GFXPolygonMode.FILL,
//   LINE: gfx.GFXPolygonMode.LINE,
//   POINT: gfx.GFXPolygonMode.POINT,
//   // primitive mode
//   POINT_LIST: gfx.GFXPrimitiveMode.POINT_LIST,
//   LINE_LIST: gfx.GFXPrimitiveMode.LINE_LIST,
//   LINE_STRIP: gfx.GFXPrimitiveMode.LINE_STRIP,
//   LINE_LOOP: gfx.GFXPrimitiveMode.LINE_LOOP,
//   TRIANGLE_LIST: gfx.GFXPrimitiveMode.TRIANGLE_LIST,
//   TRIANGLE_STRIP: gfx.GFXPrimitiveMode.TRIANGLE_STRIP,
//   TRIANGLE_FAN: gfx.GFXPrimitiveMode.TRIANGLE_FAN,
//   LINE_LIST_ADJACENCY: gfx.GFXPrimitiveMode.LINE_LIST_ADJACENCY,
//   LINE_STRIP_ADJACENCY: gfx.GFXPrimitiveMode.LINE_STRIP_ADJACENCY,
//   TRIANGLE_LIST_ADJACENCY: gfx.GFXPrimitiveMode.TRIANGLE_LIST_ADJACENCY,
//   TRIANGLE_STRIP_ADJACENCY: gfx.GFXPrimitiveMode.TRIANGLE_STRIP_ADJACENCY,
//   TRIANGLE_PATCH_ADJACENCY: gfx.GFXPrimitiveMode.TRIANGLE_PATCH_ADJACENCY,
//   QUAD_PATCH_LIST: gfx.GFXPrimitiveMode.QUAD_PATCH_LIST,
//   ISO_LINE_LIST: gfx.GFXPrimitiveMode.ISO_LINE_LIST,
//   // POINT: gfx.GFXFilter.POINT, // duplicate, safely removed because enum value is(and always will be) the same
//   LINEAR: gfx.GFXFilter.LINEAR,
//   ANISOTROPIC: gfx.GFXFilter.ANISOTROPIC,
//   WRAP: gfx.GFXAddress.WRAP,
//   MIRROR: gfx.GFXAddress.MIRROR,
//   CLAMP: gfx.GFXAddress.CLAMP,
//   BORDER: gfx.GFXAddress.BORDER,
//   VIEWPORT: gfx.GFXDynamicState.VIEWPORT,
//   SCISSOR: gfx.GFXDynamicState.SCISSOR,
//   LINE_WIDTH: gfx.GFXDynamicState.LINE_WIDTH,
//   DEPTH_BIAS: gfx.GFXDynamicState.DEPTH_BIAS,
//   BLEND_CONSTANTS: gfx.GFXDynamicState.BLEND_CONSTANTS,
//   DEPTH_BOUNDS: gfx.GFXDynamicState.DEPTH_BOUNDS,
//   STENCIL_WRITE_MASK: gfx.GFXDynamicState.STENCIL_WRITE_MASK,
//   STENCIL_COMPARE_MASK: gfx.GFXDynamicState.STENCIL_COMPARE_MASK,
//   TRUE: true,
//   FALSE: false
// };

var passParams = {
  BACK: enums.CULL_BACK,
  FRONT: enums.CULL_FRONT,
  NONE: enums.CULL_NONE,
  ADD: enums.BLEND_FUNC_ADD,
  SUB: enums.BLEND_FUNC_SUBTRACT,
  REV_SUB: enums.BLEND_FUNC_REVERSE_SUBTRACT,
  ZERO: enums.BLEND_ZERO,
  ONE: enums.BLEND_ONE,
  SRC_COLOR: enums.BLEND_SRC_COLOR,
  ONE_MINUS_SRC_COLOR: enums.BLEND_ONE_MINUS_SRC_COLOR,
  DST_COLOR: enums.BLEND_DST_COLOR,
  ONE_MINUS_DST_COLOR: enums.BLEND_ONE_MINUS_DST_COLOR,
  SRC_ALPHA: enums.BLEND_SRC_ALPHA,
  ONE_MINUS_SRC_ALPHA: enums.BLEND_ONE_MINUS_SRC_ALPHA,
  DST_ALPHA: enums.BLEND_DST_ALPHA,
  ONE_MINUS_DST_ALPHA: enums.BLEND_ONE_MINUS_DST_ALPHA,
  CONSTANT_COLOR: enums.BLEND_CONSTANT_COLOR,
  ONE_MINUS_CONSTANT_COLOR: enums.BLEND_ONE_MINUS_CONSTANT_COLOR,
  CONSTANT_ALPHA: enums.BLEND_CONSTANT_ALPHA,
  ONE_MINUS_CONSTANT_ALPHA: enums.BLEND_ONE_MINUS_CONSTANT_ALPHA,
  SRC_ALPHA_SATURATE: enums.BLEND_SRC_ALPHA_SATURATE,
  NEVER: enums.DS_FUNC_NEVER,
  LESS: enums.DS_FUNC_LESS,
  EQUAL: enums.DS_FUNC_EQUAL,
  LEQUAL: enums.DS_FUNC_LEQUAL,
  GREATER: enums.DS_FUNC_GREATER,
  NOTEQUAL: enums.DS_FUNC_NOTEQUAL,
  GEQUAL: enums.DS_FUNC_GEQUAL,
  ALWAYS: enums.DS_FUNC_ALWAYS,
  KEEP: enums.STENCIL_OP_KEEP,
  REPLACE: enums.STENCIL_OP_REPLACE,
  INCR: enums.STENCIL_OP_INCR,
  INCR_WRAP: enums.STENCIL_OP_INCR_WRAP,
  DECR: enums.STENCIL_OP_DECR,
  DECR_WRAP: enums.STENCIL_OP_DECR_WRAP,
  INVERT: enums.STENCIL_OP_INVERT
};
Object.assign(passParams, RenderPassStage); // for structural type checking
// an 'any' key will check against all elements defined in that object
// a key start with '$' means its essential, and can't be undefined

var effectStructure = {
  $techniques: [{
    $passes: [{
      depthStencilState: {},
      rasterizerState: {},
      blendState: {
        targets: [{}]
      },
      properties: {
        any: {
          sampler: {},
          inspector: {}
        }
      }
    }]
  }]
};
var mappings = {
  murmurhash2_32_gc: murmurhash2_32_gc,
  SamplerInfoIndex: SamplerInfoIndex,
  effectStructure: effectStructure,
  typeMap: typeMap,
  sizeMap: sizeMap,
  formatMap: formatMap,
  passParams: passParams,
  RenderQueue: RenderQueue,
  RenderPriority: RenderPriority,
  GFXGetTypeSize: GFXGetTypeSize,
  UniformBinding: UniformBinding
};
module.exports = mappings;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImVudW1zIiwiVVNBR0VfU1RBVElDIiwiVVNBR0VfRFlOQU1JQyIsIlVTQUdFX1NUUkVBTSIsIklOREVYX0ZNVF9VSU5UOCIsIklOREVYX0ZNVF9VSU5UMTYiLCJJTkRFWF9GTVRfVUlOVDMyIiwiQVRUUl9QT1NJVElPTiIsIkFUVFJfTk9STUFMIiwiQVRUUl9UQU5HRU5UIiwiQVRUUl9CSVRBTkdFTlQiLCJBVFRSX1dFSUdIVFMiLCJBVFRSX0pPSU5UUyIsIkFUVFJfQ09MT1IiLCJBVFRSX0NPTE9SMCIsIkFUVFJfQ09MT1IxIiwiQVRUUl9VViIsIkFUVFJfVVYwIiwiQVRUUl9VVjEiLCJBVFRSX1VWMiIsIkFUVFJfVVYzIiwiQVRUUl9VVjQiLCJBVFRSX1VWNSIsIkFUVFJfVVY2IiwiQVRUUl9VVjciLCJBVFRSX1RZUEVfSU5UOCIsIkFUVFJfVFlQRV9VSU5UOCIsIkFUVFJfVFlQRV9JTlQxNiIsIkFUVFJfVFlQRV9VSU5UMTYiLCJBVFRSX1RZUEVfSU5UMzIiLCJBVFRSX1RZUEVfVUlOVDMyIiwiQVRUUl9UWVBFX0ZMT0FUMzIiLCJGSUxURVJfTkVBUkVTVCIsIkZJTFRFUl9MSU5FQVIiLCJXUkFQX1JFUEVBVCIsIldSQVBfQ0xBTVAiLCJXUkFQX01JUlJPUiIsIlRFWFRVUkVfRk1UX1JHQl9EWFQxIiwiVEVYVFVSRV9GTVRfUkdCQV9EWFQxIiwiVEVYVFVSRV9GTVRfUkdCQV9EWFQzIiwiVEVYVFVSRV9GTVRfUkdCQV9EWFQ1IiwiVEVYVFVSRV9GTVRfUkdCX0VUQzEiLCJURVhUVVJFX0ZNVF9SR0JfUFZSVENfMkJQUFYxIiwiVEVYVFVSRV9GTVRfUkdCQV9QVlJUQ18yQlBQVjEiLCJURVhUVVJFX0ZNVF9SR0JfUFZSVENfNEJQUFYxIiwiVEVYVFVSRV9GTVRfUkdCQV9QVlJUQ180QlBQVjEiLCJURVhUVVJFX0ZNVF9BOCIsIlRFWFRVUkVfRk1UX0w4IiwiVEVYVFVSRV9GTVRfTDhfQTgiLCJURVhUVVJFX0ZNVF9SNV9HNl9CNSIsIlRFWFRVUkVfRk1UX1I1X0c1X0I1X0ExIiwiVEVYVFVSRV9GTVRfUjRfRzRfQjRfQTQiLCJURVhUVVJFX0ZNVF9SR0I4IiwiVEVYVFVSRV9GTVRfUkdCQTgiLCJURVhUVVJFX0ZNVF9SR0IxNkYiLCJURVhUVVJFX0ZNVF9SR0JBMTZGIiwiVEVYVFVSRV9GTVRfUkdCMzJGIiwiVEVYVFVSRV9GTVRfUkdCQTMyRiIsIlRFWFRVUkVfRk1UX1IzMkYiLCJURVhUVVJFX0ZNVF8xMTExMTBGIiwiVEVYVFVSRV9GTVRfU1JHQiIsIlRFWFRVUkVfRk1UX1NSR0JBIiwiVEVYVFVSRV9GTVRfRDE2IiwiVEVYVFVSRV9GTVRfRDMyIiwiVEVYVFVSRV9GTVRfRDI0UzgiLCJURVhUVVJFX0ZNVF9SR0JfRVRDMiIsIlRFWFRVUkVfRk1UX1JHQkFfRVRDMiIsIkRTX0ZVTkNfTkVWRVIiLCJEU19GVU5DX0xFU1MiLCJEU19GVU5DX0VRVUFMIiwiRFNfRlVOQ19MRVFVQUwiLCJEU19GVU5DX0dSRUFURVIiLCJEU19GVU5DX05PVEVRVUFMIiwiRFNfRlVOQ19HRVFVQUwiLCJEU19GVU5DX0FMV0FZUyIsIlJCX0ZNVF9SR0JBNCIsIlJCX0ZNVF9SR0I1X0ExIiwiUkJfRk1UX1JHQjU2NSIsIlJCX0ZNVF9EMTYiLCJSQl9GTVRfUzgiLCJSQl9GTVRfRDI0UzgiLCJCTEVORF9GVU5DX0FERCIsIkJMRU5EX0ZVTkNfU1VCVFJBQ1QiLCJCTEVORF9GVU5DX1JFVkVSU0VfU1VCVFJBQ1QiLCJCTEVORF9aRVJPIiwiQkxFTkRfT05FIiwiQkxFTkRfU1JDX0NPTE9SIiwiQkxFTkRfT05FX01JTlVTX1NSQ19DT0xPUiIsIkJMRU5EX0RTVF9DT0xPUiIsIkJMRU5EX09ORV9NSU5VU19EU1RfQ09MT1IiLCJCTEVORF9TUkNfQUxQSEEiLCJCTEVORF9PTkVfTUlOVVNfU1JDX0FMUEhBIiwiQkxFTkRfRFNUX0FMUEhBIiwiQkxFTkRfT05FX01JTlVTX0RTVF9BTFBIQSIsIkJMRU5EX0NPTlNUQU5UX0NPTE9SIiwiQkxFTkRfT05FX01JTlVTX0NPTlNUQU5UX0NPTE9SIiwiQkxFTkRfQ09OU1RBTlRfQUxQSEEiLCJCTEVORF9PTkVfTUlOVVNfQ09OU1RBTlRfQUxQSEEiLCJCTEVORF9TUkNfQUxQSEFfU0FUVVJBVEUiLCJTVEVOQ0lMX0RJU0FCTEUiLCJTVEVOQ0lMX0VOQUJMRSIsIlNURU5DSUxfSU5IRVJJVCIsIlNURU5DSUxfT1BfS0VFUCIsIlNURU5DSUxfT1BfWkVSTyIsIlNURU5DSUxfT1BfUkVQTEFDRSIsIlNURU5DSUxfT1BfSU5DUiIsIlNURU5DSUxfT1BfSU5DUl9XUkFQIiwiU1RFTkNJTF9PUF9ERUNSIiwiU1RFTkNJTF9PUF9ERUNSX1dSQVAiLCJTVEVOQ0lMX09QX0lOVkVSVCIsIkNVTExfTk9ORSIsIkNVTExfRlJPTlQiLCJDVUxMX0JBQ0siLCJDVUxMX0ZST05UX0FORF9CQUNLIiwiUFRfUE9JTlRTIiwiUFRfTElORVMiLCJQVF9MSU5FX0xPT1AiLCJQVF9MSU5FX1NUUklQIiwiUFRfVFJJQU5HTEVTIiwiUFRfVFJJQU5HTEVfU1RSSVAiLCJQVF9UUklBTkdMRV9GQU4iLCJSZW5kZXJRdWV1ZSIsIk9QQVFVRSIsIlRSQU5TUEFSRU5UIiwiT1ZFUkxBWSIsIm11cm11cmhhc2gyXzMyX2djIiwic3RyIiwic2VlZCIsImwiLCJsZW5ndGgiLCJoIiwiaSIsImsiLCJjaGFyQ29kZUF0IiwiV2ViR0xFWFQiLCJHRlhPYmplY3RUeXBlIiwiR0ZYU3RhdHVzIiwiR0ZYT2JqZWN0IiwiZ2Z4VHlwZSIsIl9nZnhUeXBlIiwiVU5LTk9XTiIsIl9zdGF0dXMiLCJVTlJFQURZIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJwcm90b3R5cGUiLCJnZXQiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwiR0ZYQXR0cmlidXRlTmFtZSIsIkdGWFR5cGUiLCJHRlhGb3JtYXQiLCJHRlhCdWZmZXJVc2FnZUJpdCIsIkdGWE1lbW9yeVVzYWdlQml0IiwiR0ZYQnVmZmVyQWNjZXNzQml0IiwiR0ZYUHJpbWl0aXZlTW9kZSIsIkdGWFBvbHlnb25Nb2RlIiwiR0ZYU2hhZGVNb2RlbCIsIkdGWEN1bGxNb2RlIiwiR0ZYQ29tcGFyaXNvbkZ1bmMiLCJHRlhTdGVuY2lsT3AiLCJHRlhCbGVuZE9wIiwiR0ZYQmxlbmRGYWN0b3IiLCJHRlhDb2xvck1hc2siLCJHRlhGaWx0ZXIiLCJHRlhBZGRyZXNzIiwiR0ZYVGV4dHVyZVR5cGUiLCJHRlhUZXh0dXJlVXNhZ2VCaXQiLCJHRlhTYW1wbGVDb3VudCIsIkdGWFRleHR1cmVGbGFnQml0IiwiR0ZYVGV4dHVyZVZpZXdUeXBlIiwiR0ZYU2hhZGVyVHlwZSIsIkdGWEJpbmRpbmdUeXBlIiwiR0ZYQ29tbWFuZEJ1ZmZlclR5cGUiLCJHRlhMb2FkT3AiLCJHRlhTdG9yZU9wIiwiR0ZYVGV4dHVyZUxheW91dCIsIkdGWFBpcGVsaW5lQmluZFBvaW50IiwiR0ZYRHluYW1pY1N0YXRlIiwiR0ZYU3RlbmNpbEZhY2UiLCJHRlhRdWV1ZVR5cGUiLCJHRlhDbGVhckZsYWciLCJHRlhHZXRUeXBlU2l6ZSIsInR5cGUiLCJCT09MIiwiSU5UIiwiVUlOVCIsIkZMT0FUIiwiQk9PTDIiLCJJTlQyIiwiVUlOVDIiLCJGTE9BVDIiLCJCT09MMyIsIklOVDMiLCJVSU5UMyIsIkZMT0FUMyIsIkJPT0w0IiwiSU5UNCIsIlVJTlQ0IiwiRkxPQVQ0IiwiTUFUMiIsIk1BVDJYMyIsIk1BVDJYNCIsIk1BVDNYMiIsIk1BVDMiLCJNQVQzWDQiLCJNQVQ0WDIiLCJNQVQ0IiwiU0FNUExFUjFEIiwiU0FNUExFUjFEX0FSUkFZIiwiU0FNUExFUjJEIiwiU0FNUExFUjJEX0FSUkFZIiwiU0FNUExFUjNEIiwiU0FNUExFUl9DVUJFIiwiUmVuZGVyUGFzc1N0YWdlIiwiUmVuZGVyUHJpb3JpdHkiLCJNQVhfQklORElOR19TVVBQT1JURUQiLCJVbmlmb3JtQmluZGluZyIsIl9hIiwiX2IiLCJTYW1wbGVySW5mb0luZGV4IiwidHlwZU1hcCIsInNpemVNYXAiLCJmb3JtYXRNYXAiLCJSMzJJIiwiUkczMkkiLCJSR0IzMkkiLCJSR0JBMzJJIiwiUjMyRiIsIlJHMzJGIiwiUkdCMzJGIiwiUkdCQTMyRiIsInBhc3NQYXJhbXMiLCJCQUNLIiwiRlJPTlQiLCJOT05FIiwiQUREIiwiU1VCIiwiUkVWX1NVQiIsIlpFUk8iLCJPTkUiLCJTUkNfQ09MT1IiLCJPTkVfTUlOVVNfU1JDX0NPTE9SIiwiRFNUX0NPTE9SIiwiT05FX01JTlVTX0RTVF9DT0xPUiIsIlNSQ19BTFBIQSIsIk9ORV9NSU5VU19TUkNfQUxQSEEiLCJEU1RfQUxQSEEiLCJPTkVfTUlOVVNfRFNUX0FMUEhBIiwiQ09OU1RBTlRfQ09MT1IiLCJPTkVfTUlOVVNfQ09OU1RBTlRfQ09MT1IiLCJDT05TVEFOVF9BTFBIQSIsIk9ORV9NSU5VU19DT05TVEFOVF9BTFBIQSIsIlNSQ19BTFBIQV9TQVRVUkFURSIsIk5FVkVSIiwiTEVTUyIsIkVRVUFMIiwiTEVRVUFMIiwiR1JFQVRFUiIsIk5PVEVRVUFMIiwiR0VRVUFMIiwiQUxXQVlTIiwiS0VFUCIsIlJFUExBQ0UiLCJJTkNSIiwiSU5DUl9XUkFQIiwiREVDUiIsIkRFQ1JfV1JBUCIsIklOVkVSVCIsImFzc2lnbiIsImVmZmVjdFN0cnVjdHVyZSIsIiR0ZWNobmlxdWVzIiwiJHBhc3NlcyIsImRlcHRoU3RlbmNpbFN0YXRlIiwicmFzdGVyaXplclN0YXRlIiwiYmxlbmRTdGF0ZSIsInRhcmdldHMiLCJwcm9wZXJ0aWVzIiwiYW55Iiwic2FtcGxlciIsImluc3BlY3RvciIsIm1hcHBpbmdzIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTtBQUVBOzs7O0FBR0EsSUFBTUEsS0FBSyxHQUFHO0FBQ1o7QUFDQUMsRUFBQUEsWUFBWSxFQUFFLEtBRkY7QUFFVTtBQUN0QkMsRUFBQUEsYUFBYSxFQUFFLEtBSEg7QUFHVTtBQUN0QkMsRUFBQUEsWUFBWSxFQUFFLEtBSkY7QUFJVTtBQUV0QjtBQUNBQyxFQUFBQSxlQUFlLEVBQUUsSUFQTDtBQU9ZO0FBQ3hCQyxFQUFBQSxnQkFBZ0IsRUFBRSxJQVJOO0FBUVk7QUFDeEJDLEVBQUFBLGdCQUFnQixFQUFFLElBVE47QUFTWTtBQUV4QjtBQUNBQyxFQUFBQSxhQUFhLEVBQUUsWUFaSDtBQWFaQyxFQUFBQSxXQUFXLEVBQUUsVUFiRDtBQWNaQyxFQUFBQSxZQUFZLEVBQUUsV0FkRjtBQWVaQyxFQUFBQSxjQUFjLEVBQUUsYUFmSjtBQWdCWkMsRUFBQUEsWUFBWSxFQUFFLFdBaEJGO0FBaUJaQyxFQUFBQSxXQUFXLEVBQUUsVUFqQkQ7QUFrQlpDLEVBQUFBLFVBQVUsRUFBRSxTQWxCQTtBQW1CWkMsRUFBQUEsV0FBVyxFQUFFLFVBbkJEO0FBb0JaQyxFQUFBQSxXQUFXLEVBQUUsVUFwQkQ7QUFxQlpDLEVBQUFBLE9BQU8sRUFBRSxNQXJCRztBQXNCWkMsRUFBQUEsUUFBUSxFQUFFLE9BdEJFO0FBdUJaQyxFQUFBQSxRQUFRLEVBQUUsT0F2QkU7QUF3QlpDLEVBQUFBLFFBQVEsRUFBRSxPQXhCRTtBQXlCWkMsRUFBQUEsUUFBUSxFQUFFLE9BekJFO0FBMEJaQyxFQUFBQSxRQUFRLEVBQUUsT0ExQkU7QUEyQlpDLEVBQUFBLFFBQVEsRUFBRSxPQTNCRTtBQTRCWkMsRUFBQUEsUUFBUSxFQUFFLE9BNUJFO0FBNkJaQyxFQUFBQSxRQUFRLEVBQUUsT0E3QkU7QUErQlo7QUFDQUMsRUFBQUEsY0FBYyxFQUFFLElBaENKO0FBZ0NhO0FBQ3pCQyxFQUFBQSxlQUFlLEVBQUUsSUFqQ0w7QUFpQ2E7QUFDekJDLEVBQUFBLGVBQWUsRUFBRSxJQWxDTDtBQWtDYTtBQUN6QkMsRUFBQUEsZ0JBQWdCLEVBQUUsSUFuQ047QUFtQ2E7QUFDekJDLEVBQUFBLGVBQWUsRUFBRSxJQXBDTDtBQW9DYTtBQUN6QkMsRUFBQUEsZ0JBQWdCLEVBQUUsSUFyQ047QUFxQ2E7QUFDekJDLEVBQUFBLGlCQUFpQixFQUFFLElBdENQO0FBc0NhO0FBRXpCO0FBQ0FDLEVBQUFBLGNBQWMsRUFBRSxDQXpDSjtBQTBDWkMsRUFBQUEsYUFBYSxFQUFFLENBMUNIO0FBNENaO0FBQ0FDLEVBQUFBLFdBQVcsRUFBRSxLQTdDRDtBQTZDUTtBQUNwQkMsRUFBQUEsVUFBVSxFQUFFLEtBOUNBO0FBOENRO0FBQ3BCQyxFQUFBQSxXQUFXLEVBQUUsS0EvQ0Q7QUErQ1E7QUFFcEI7QUFDQTtBQUNBQyxFQUFBQSxvQkFBb0IsRUFBRSxDQW5EVjtBQW9EWkMsRUFBQUEscUJBQXFCLEVBQUUsQ0FwRFg7QUFxRFpDLEVBQUFBLHFCQUFxQixFQUFFLENBckRYO0FBc0RaQyxFQUFBQSxxQkFBcUIsRUFBRSxDQXREWDtBQXVEWkMsRUFBQUEsb0JBQW9CLEVBQUUsQ0F2RFY7QUF3RFpDLEVBQUFBLDRCQUE0QixFQUFFLENBeERsQjtBQXlEWkMsRUFBQUEsNkJBQTZCLEVBQUUsQ0F6RG5CO0FBMERaQyxFQUFBQSw0QkFBNEIsRUFBRSxDQTFEbEI7QUEyRFpDLEVBQUFBLDZCQUE2QixFQUFFLENBM0RuQjtBQTZEWjtBQUNBQyxFQUFBQSxjQUFjLEVBQUUsQ0E5REo7QUErRFpDLEVBQUFBLGNBQWMsRUFBRSxFQS9ESjtBQWdFWkMsRUFBQUEsaUJBQWlCLEVBQUUsRUFoRVA7QUFpRVpDLEVBQUFBLG9CQUFvQixFQUFFLEVBakVWO0FBa0VaQyxFQUFBQSx1QkFBdUIsRUFBRSxFQWxFYjtBQW1FWkMsRUFBQUEsdUJBQXVCLEVBQUUsRUFuRWI7QUFvRVpDLEVBQUFBLGdCQUFnQixFQUFFLEVBcEVOO0FBcUVaQyxFQUFBQSxpQkFBaUIsRUFBRSxFQXJFUDtBQXNFWkMsRUFBQUEsa0JBQWtCLEVBQUUsRUF0RVI7QUF1RVpDLEVBQUFBLG1CQUFtQixFQUFFLEVBdkVUO0FBd0VaQyxFQUFBQSxrQkFBa0IsRUFBRSxFQXhFUjtBQXlFWkMsRUFBQUEsbUJBQW1CLEVBQUUsRUF6RVQ7QUEwRVpDLEVBQUFBLGdCQUFnQixFQUFFLEVBMUVOO0FBMkVaQyxFQUFBQSxtQkFBbUIsRUFBRSxFQTNFVDtBQTRFWkMsRUFBQUEsZ0JBQWdCLEVBQUUsRUE1RU47QUE2RVpDLEVBQUFBLGlCQUFpQixFQUFFLEVBN0VQO0FBK0VaO0FBQ0FDLEVBQUFBLGVBQWUsRUFBRSxFQWhGTDtBQWlGWkMsRUFBQUEsZUFBZSxFQUFFLEVBakZMO0FBa0ZaQyxFQUFBQSxpQkFBaUIsRUFBRSxFQWxGUDtBQW9GWjtBQUNBQyxFQUFBQSxvQkFBb0IsRUFBRSxFQXJGVjtBQXNGWkMsRUFBQUEscUJBQXFCLEVBQUUsRUF0Rlg7QUF3Rlo7QUFDQUMsRUFBQUEsYUFBYSxFQUFFLEdBekZIO0FBeUZXO0FBQ3ZCQyxFQUFBQSxZQUFZLEVBQUUsR0ExRkY7QUEwRlc7QUFDdkJDLEVBQUFBLGFBQWEsRUFBRSxHQTNGSDtBQTJGVztBQUN2QkMsRUFBQUEsY0FBYyxFQUFFLEdBNUZKO0FBNEZXO0FBQ3ZCQyxFQUFBQSxlQUFlLEVBQUUsR0E3Rkw7QUE2Rlc7QUFDdkJDLEVBQUFBLGdCQUFnQixFQUFFLEdBOUZOO0FBOEZXO0FBQ3ZCQyxFQUFBQSxjQUFjLEVBQUUsR0EvRko7QUErRlc7QUFDdkJDLEVBQUFBLGNBQWMsRUFBRSxHQWhHSjtBQWdHVztBQUV2QjtBQUNBQyxFQUFBQSxZQUFZLEVBQUUsS0FuR0Y7QUFtR1k7QUFDeEJDLEVBQUFBLGNBQWMsRUFBRSxLQXBHSjtBQW9HWTtBQUN4QkMsRUFBQUEsYUFBYSxFQUFFLEtBckdIO0FBcUdZO0FBQ3hCQyxFQUFBQSxVQUFVLEVBQUUsS0F0R0E7QUFzR1k7QUFDeEJDLEVBQUFBLFNBQVMsRUFBRSxLQXZHQztBQXVHWTtBQUN4QkMsRUFBQUEsWUFBWSxFQUFFLEtBeEdGO0FBd0dZO0FBRXhCO0FBQ0FDLEVBQUFBLGNBQWMsRUFBRSxLQTNHSjtBQTJHd0I7QUFDcENDLEVBQUFBLG1CQUFtQixFQUFFLEtBNUdUO0FBNEd3QjtBQUNwQ0MsRUFBQUEsMkJBQTJCLEVBQUUsS0E3R2pCO0FBNkd3QjtBQUVwQztBQUNBQyxFQUFBQSxVQUFVLEVBQUUsQ0FoSEE7QUFnSDRCO0FBQ3hDQyxFQUFBQSxTQUFTLEVBQUUsQ0FqSEM7QUFpSDRCO0FBQ3hDQyxFQUFBQSxlQUFlLEVBQUUsR0FsSEw7QUFrSDRCO0FBQ3hDQyxFQUFBQSx5QkFBeUIsRUFBRSxHQW5IZjtBQW1INEI7QUFDeENDLEVBQUFBLGVBQWUsRUFBRSxHQXBITDtBQW9INEI7QUFDeENDLEVBQUFBLHlCQUF5QixFQUFFLEdBckhmO0FBcUg0QjtBQUN4Q0MsRUFBQUEsZUFBZSxFQUFFLEdBdEhMO0FBc0g0QjtBQUN4Q0MsRUFBQUEseUJBQXlCLEVBQUUsR0F2SGY7QUF1SDRCO0FBQ3hDQyxFQUFBQSxlQUFlLEVBQUUsR0F4SEw7QUF3SDRCO0FBQ3hDQyxFQUFBQSx5QkFBeUIsRUFBRSxHQXpIZjtBQXlINEI7QUFDeENDLEVBQUFBLG9CQUFvQixFQUFFLEtBMUhWO0FBMEg0QjtBQUN4Q0MsRUFBQUEsOEJBQThCLEVBQUUsS0EzSHBCO0FBMkg0QjtBQUN4Q0MsRUFBQUEsb0JBQW9CLEVBQUUsS0E1SFY7QUE0SDRCO0FBQ3hDQyxFQUFBQSw4QkFBOEIsRUFBRSxLQTdIcEI7QUE2SDRCO0FBQ3hDQyxFQUFBQSx3QkFBd0IsRUFBRSxHQTlIZDtBQThINEI7QUFFeEM7QUFDQUMsRUFBQUEsZUFBZSxFQUFFLENBaklMO0FBaUlvQjtBQUNoQ0MsRUFBQUEsY0FBYyxFQUFFLENBbElKO0FBa0lvQjtBQUNoQ0MsRUFBQUEsZUFBZSxFQUFFLENBbklMO0FBbUlvQjtBQUVoQ0MsRUFBQUEsZUFBZSxFQUFFLElBcklMO0FBcUlvQjtBQUNoQ0MsRUFBQUEsZUFBZSxFQUFFLENBdElMO0FBc0lvQjtBQUNoQ0MsRUFBQUEsa0JBQWtCLEVBQUUsSUF2SVI7QUF1SW9CO0FBQ2hDQyxFQUFBQSxlQUFlLEVBQUUsSUF4SUw7QUF3SW9CO0FBQ2hDQyxFQUFBQSxvQkFBb0IsRUFBRSxLQXpJVjtBQXlJb0I7QUFDaENDLEVBQUFBLGVBQWUsRUFBRSxJQTFJTDtBQTBJb0I7QUFDaENDLEVBQUFBLG9CQUFvQixFQUFFLEtBM0lWO0FBMklvQjtBQUNoQ0MsRUFBQUEsaUJBQWlCLEVBQUUsSUE1SVA7QUE0SW9CO0FBRWhDO0FBQ0FDLEVBQUFBLFNBQVMsRUFBRSxDQS9JQztBQWdKWkMsRUFBQUEsVUFBVSxFQUFFLElBaEpBO0FBaUpaQyxFQUFBQSxTQUFTLEVBQUUsSUFqSkM7QUFrSlpDLEVBQUFBLG1CQUFtQixFQUFFLElBbEpUO0FBb0paO0FBQ0FDLEVBQUFBLFNBQVMsRUFBRSxDQXJKQztBQXFKVTtBQUN0QkMsRUFBQUEsUUFBUSxFQUFFLENBdEpFO0FBc0pVO0FBQ3RCQyxFQUFBQSxZQUFZLEVBQUUsQ0F2SkY7QUF1SlU7QUFDdEJDLEVBQUFBLGFBQWEsRUFBRSxDQXhKSDtBQXdKVTtBQUN0QkMsRUFBQUEsWUFBWSxFQUFFLENBekpGO0FBeUpVO0FBQ3RCQyxFQUFBQSxpQkFBaUIsRUFBRSxDQTFKUDtBQTBKVTtBQUN0QkMsRUFBQUEsZUFBZSxFQUFFLENBM0pMLENBMkpVOztBQTNKVixDQUFkO0FBOEpBLElBQUlDLFdBQVcsR0FBRztBQUNkQyxFQUFBQSxNQUFNLEVBQUUsQ0FETTtBQUVkQyxFQUFBQSxXQUFXLEVBQUUsQ0FGQztBQUdkQyxFQUFBQSxPQUFPLEVBQUU7QUFISyxDQUFsQjtBQU1BOzs7Ozs7Ozs7Ozs7O0FBYUEsU0FBU0MsaUJBQVQsQ0FBMkJDLEdBQTNCLEVBQWdDQyxJQUFoQyxFQUFzQztBQUNwQyxNQUNFQyxDQUFDLEdBQUdGLEdBQUcsQ0FBQ0csTUFEVjtBQUFBLE1BRUVDLENBQUMsR0FBR0gsSUFBSSxHQUFHQyxDQUZiO0FBQUEsTUFHRUcsQ0FBQyxHQUFHLENBSE47QUFBQSxNQUlFQyxDQUpGOztBQU1BLFNBQU9KLENBQUMsSUFBSSxDQUFaLEVBQWU7QUFDZEksSUFBQUEsQ0FBQyxHQUNHTixHQUFHLENBQUNPLFVBQUosQ0FBZUYsQ0FBZixJQUFvQixJQUF0QixHQUNDLENBQUNMLEdBQUcsQ0FBQ08sVUFBSixDQUFlLEVBQUVGLENBQWpCLElBQXNCLElBQXZCLEtBQWdDLENBRGpDLEdBRUMsQ0FBQ0wsR0FBRyxDQUFDTyxVQUFKLENBQWUsRUFBRUYsQ0FBakIsSUFBc0IsSUFBdkIsS0FBZ0MsRUFGakMsR0FHQyxDQUFDTCxHQUFHLENBQUNPLFVBQUosQ0FBZSxFQUFFRixDQUFqQixJQUFzQixJQUF2QixLQUFnQyxFQUpuQztBQU1DQyxJQUFBQSxDQUFDLEdBQUssQ0FBQ0EsQ0FBQyxHQUFHLE1BQUwsSUFBZSxVQUFoQixJQUErQixDQUFFLENBQUNBLENBQUMsS0FBSyxFQUFQLElBQWEsVUFBZCxHQUE0QixNQUE3QixLQUF3QyxFQUF2RSxDQUFMO0FBQ0FBLElBQUFBLENBQUMsSUFBSUEsQ0FBQyxLQUFLLEVBQVg7QUFDQUEsSUFBQUEsQ0FBQyxHQUFLLENBQUNBLENBQUMsR0FBRyxNQUFMLElBQWUsVUFBaEIsSUFBK0IsQ0FBRSxDQUFDQSxDQUFDLEtBQUssRUFBUCxJQUFhLFVBQWQsR0FBNEIsTUFBN0IsS0FBd0MsRUFBdkUsQ0FBTDtBQUVIRixJQUFBQSxDQUFDLEdBQUssQ0FBQ0EsQ0FBQyxHQUFHLE1BQUwsSUFBZSxVQUFoQixJQUErQixDQUFFLENBQUNBLENBQUMsS0FBSyxFQUFQLElBQWEsVUFBZCxHQUE0QixNQUE3QixLQUF3QyxFQUF2RSxDQUFELEdBQStFRSxDQUFuRjtBQUVHSixJQUFBQSxDQUFDLElBQUksQ0FBTDtBQUNBLE1BQUVHLENBQUY7QUFDRDs7QUFFRCxVQUFRSCxDQUFSO0FBQ0EsU0FBSyxDQUFMO0FBQVFFLE1BQUFBLENBQUMsSUFBSSxDQUFDSixHQUFHLENBQUNPLFVBQUosQ0FBZUYsQ0FBQyxHQUFHLENBQW5CLElBQXdCLElBQXpCLEtBQWtDLEVBQXZDOztBQUNSLFNBQUssQ0FBTDtBQUFRRCxNQUFBQSxDQUFDLElBQUksQ0FBQ0osR0FBRyxDQUFDTyxVQUFKLENBQWVGLENBQUMsR0FBRyxDQUFuQixJQUF3QixJQUF6QixLQUFrQyxDQUF2Qzs7QUFDUixTQUFLLENBQUw7QUFBUUQsTUFBQUEsQ0FBQyxJQUFLSixHQUFHLENBQUNPLFVBQUosQ0FBZUYsQ0FBZixJQUFvQixJQUExQjtBQUNBRCxNQUFBQSxDQUFDLEdBQUssQ0FBQ0EsQ0FBQyxHQUFHLE1BQUwsSUFBZSxVQUFoQixJQUErQixDQUFFLENBQUNBLENBQUMsS0FBSyxFQUFQLElBQWEsVUFBZCxHQUE0QixNQUE3QixLQUF3QyxFQUF2RSxDQUFMO0FBSlI7O0FBT0FBLEVBQUFBLENBQUMsSUFBSUEsQ0FBQyxLQUFLLEVBQVg7QUFDQUEsRUFBQUEsQ0FBQyxHQUFLLENBQUNBLENBQUMsR0FBRyxNQUFMLElBQWUsVUFBaEIsSUFBK0IsQ0FBRSxDQUFDQSxDQUFDLEtBQUssRUFBUCxJQUFhLFVBQWQsR0FBNEIsTUFBN0IsS0FBd0MsRUFBdkUsQ0FBTDtBQUNBQSxFQUFBQSxDQUFDLElBQUlBLENBQUMsS0FBSyxFQUFYO0FBRUEsU0FBT0EsQ0FBQyxLQUFLLENBQWI7QUFDRCxFQUVEOzs7QUFDQSxJQUFJSSxRQUFKOztBQUNBLENBQUMsVUFBVUEsUUFBVixFQUFvQjtBQUNqQkEsRUFBQUEsUUFBUSxDQUFDQSxRQUFRLENBQUMsOEJBQUQsQ0FBUixHQUEyQyxLQUE1QyxDQUFSLEdBQTZELDhCQUE3RDtBQUNBQSxFQUFBQSxRQUFRLENBQUNBLFFBQVEsQ0FBQywrQkFBRCxDQUFSLEdBQTRDLEtBQTdDLENBQVIsR0FBOEQsK0JBQTlEO0FBQ0FBLEVBQUFBLFFBQVEsQ0FBQ0EsUUFBUSxDQUFDLCtCQUFELENBQVIsR0FBNEMsS0FBN0MsQ0FBUixHQUE4RCwrQkFBOUQ7QUFDQUEsRUFBQUEsUUFBUSxDQUFDQSxRQUFRLENBQUMsK0JBQUQsQ0FBUixHQUE0QyxLQUE3QyxDQUFSLEdBQThELCtCQUE5RDtBQUNBQSxFQUFBQSxRQUFRLENBQUNBLFFBQVEsQ0FBQywrQkFBRCxDQUFSLEdBQTRDLEtBQTdDLENBQVIsR0FBOEQsK0JBQTlEO0FBQ0FBLEVBQUFBLFFBQVEsQ0FBQ0EsUUFBUSxDQUFDLHFDQUFELENBQVIsR0FBa0QsS0FBbkQsQ0FBUixHQUFvRSxxQ0FBcEU7QUFDQUEsRUFBQUEsUUFBUSxDQUFDQSxRQUFRLENBQUMscUNBQUQsQ0FBUixHQUFrRCxLQUFuRCxDQUFSLEdBQW9FLHFDQUFwRTtBQUNBQSxFQUFBQSxRQUFRLENBQUNBLFFBQVEsQ0FBQyxxQ0FBRCxDQUFSLEdBQWtELEtBQW5ELENBQVIsR0FBb0UscUNBQXBFO0FBQ0FBLEVBQUFBLFFBQVEsQ0FBQ0EsUUFBUSxDQUFDLGlDQUFELENBQVIsR0FBOEMsS0FBL0MsQ0FBUixHQUFnRSxpQ0FBaEU7QUFDQUEsRUFBQUEsUUFBUSxDQUFDQSxRQUFRLENBQUMsaUNBQUQsQ0FBUixHQUE4QyxLQUEvQyxDQUFSLEdBQWdFLGlDQUFoRTtBQUNBQSxFQUFBQSxRQUFRLENBQUNBLFFBQVEsQ0FBQyxrQ0FBRCxDQUFSLEdBQStDLEtBQWhELENBQVIsR0FBaUUsa0NBQWpFO0FBQ0FBLEVBQUFBLFFBQVEsQ0FBQ0EsUUFBUSxDQUFDLGtDQUFELENBQVIsR0FBK0MsS0FBaEQsQ0FBUixHQUFpRSxrQ0FBakU7QUFDQUEsRUFBQUEsUUFBUSxDQUFDQSxRQUFRLENBQUMsMkJBQUQsQ0FBUixHQUF3QyxLQUF6QyxDQUFSLEdBQTBELDJCQUExRDtBQUNILENBZEQsRUFjR0EsUUFBUSxLQUFLQSxRQUFRLEdBQUcsRUFBaEIsQ0FkWDs7QUFlQSxJQUFJQyxhQUFKOztBQUNBLENBQUMsVUFBVUEsYUFBVixFQUF5QjtBQUN0QkEsRUFBQUEsYUFBYSxDQUFDQSxhQUFhLENBQUMsU0FBRCxDQUFiLEdBQTJCLENBQTVCLENBQWIsR0FBOEMsU0FBOUM7QUFDQUEsRUFBQUEsYUFBYSxDQUFDQSxhQUFhLENBQUMsUUFBRCxDQUFiLEdBQTBCLENBQTNCLENBQWIsR0FBNkMsUUFBN0M7QUFDQUEsRUFBQUEsYUFBYSxDQUFDQSxhQUFhLENBQUMsU0FBRCxDQUFiLEdBQTJCLENBQTVCLENBQWIsR0FBOEMsU0FBOUM7QUFDQUEsRUFBQUEsYUFBYSxDQUFDQSxhQUFhLENBQUMsY0FBRCxDQUFiLEdBQWdDLENBQWpDLENBQWIsR0FBbUQsY0FBbkQ7QUFDQUEsRUFBQUEsYUFBYSxDQUFDQSxhQUFhLENBQUMsYUFBRCxDQUFiLEdBQStCLENBQWhDLENBQWIsR0FBa0QsYUFBbEQ7QUFDQUEsRUFBQUEsYUFBYSxDQUFDQSxhQUFhLENBQUMsYUFBRCxDQUFiLEdBQStCLENBQWhDLENBQWIsR0FBa0QsYUFBbEQ7QUFDQUEsRUFBQUEsYUFBYSxDQUFDQSxhQUFhLENBQUMsU0FBRCxDQUFiLEdBQTJCLENBQTVCLENBQWIsR0FBOEMsU0FBOUM7QUFDQUEsRUFBQUEsYUFBYSxDQUFDQSxhQUFhLENBQUMsUUFBRCxDQUFiLEdBQTBCLENBQTNCLENBQWIsR0FBNkMsUUFBN0M7QUFDQUEsRUFBQUEsYUFBYSxDQUFDQSxhQUFhLENBQUMsaUJBQUQsQ0FBYixHQUFtQyxDQUFwQyxDQUFiLEdBQXNELGlCQUF0RDtBQUNBQSxFQUFBQSxhQUFhLENBQUNBLGFBQWEsQ0FBQyxnQkFBRCxDQUFiLEdBQWtDLENBQW5DLENBQWIsR0FBcUQsZ0JBQXJEO0FBQ0FBLEVBQUFBLGFBQWEsQ0FBQ0EsYUFBYSxDQUFDLGdCQUFELENBQWIsR0FBa0MsRUFBbkMsQ0FBYixHQUFzRCxnQkFBdEQ7QUFDQUEsRUFBQUEsYUFBYSxDQUFDQSxhQUFhLENBQUMsaUJBQUQsQ0FBYixHQUFtQyxFQUFwQyxDQUFiLEdBQXVELGlCQUF2RDtBQUNBQSxFQUFBQSxhQUFhLENBQUNBLGFBQWEsQ0FBQyxtQkFBRCxDQUFiLEdBQXFDLEVBQXRDLENBQWIsR0FBeUQsbUJBQXpEO0FBQ0FBLEVBQUFBLGFBQWEsQ0FBQ0EsYUFBYSxDQUFDLGdCQUFELENBQWIsR0FBa0MsRUFBbkMsQ0FBYixHQUFzRCxnQkFBdEQ7QUFDQUEsRUFBQUEsYUFBYSxDQUFDQSxhQUFhLENBQUMsT0FBRCxDQUFiLEdBQXlCLEVBQTFCLENBQWIsR0FBNkMsT0FBN0M7QUFDQUEsRUFBQUEsYUFBYSxDQUFDQSxhQUFhLENBQUMsUUFBRCxDQUFiLEdBQTBCLEVBQTNCLENBQWIsR0FBOEMsUUFBOUM7QUFDSCxDQWpCRCxFQWlCR0EsYUFBYSxLQUFLQSxhQUFhLEdBQUcsRUFBckIsQ0FqQmhCOztBQWtCQSxJQUFJQyxTQUFKOztBQUNBLENBQUMsVUFBVUEsU0FBVixFQUFxQjtBQUNsQkEsRUFBQUEsU0FBUyxDQUFDQSxTQUFTLENBQUMsU0FBRCxDQUFULEdBQXVCLENBQXhCLENBQVQsR0FBc0MsU0FBdEM7QUFDQUEsRUFBQUEsU0FBUyxDQUFDQSxTQUFTLENBQUMsUUFBRCxDQUFULEdBQXNCLENBQXZCLENBQVQsR0FBcUMsUUFBckM7QUFDQUEsRUFBQUEsU0FBUyxDQUFDQSxTQUFTLENBQUMsU0FBRCxDQUFULEdBQXVCLENBQXhCLENBQVQsR0FBc0MsU0FBdEM7QUFDSCxDQUpELEVBSUdBLFNBQVMsS0FBS0EsU0FBUyxHQUFHLEVBQWpCLENBSlo7O0FBS0EsSUFBSUMsU0FBUztBQUFHO0FBQWUsWUFBWTtBQUN2QyxXQUFTQSxTQUFULENBQW1CQyxPQUFuQixFQUE0QjtBQUN4QixTQUFLQyxRQUFMLEdBQWdCSixhQUFhLENBQUNLLE9BQTlCO0FBQ0EsU0FBS0MsT0FBTCxHQUFlTCxTQUFTLENBQUNNLE9BQXpCO0FBQ0EsU0FBS0gsUUFBTCxHQUFnQkQsT0FBaEI7QUFDSDs7QUFDREssRUFBQUEsTUFBTSxDQUFDQyxjQUFQLENBQXNCUCxTQUFTLENBQUNRLFNBQWhDLEVBQTJDLFNBQTNDLEVBQXNEO0FBQ2xEQyxJQUFBQSxHQUFHLEVBQUUsZUFBWTtBQUNiLGFBQU8sS0FBS1AsUUFBWjtBQUNILEtBSGlEO0FBSWxEUSxJQUFBQSxVQUFVLEVBQUUsSUFKc0M7QUFLbERDLElBQUFBLFlBQVksRUFBRTtBQUxvQyxHQUF0RDtBQU9BTCxFQUFBQSxNQUFNLENBQUNDLGNBQVAsQ0FBc0JQLFNBQVMsQ0FBQ1EsU0FBaEMsRUFBMkMsUUFBM0MsRUFBcUQ7QUFDakRDLElBQUFBLEdBQUcsRUFBRSxlQUFZO0FBQ2IsYUFBTyxLQUFLTCxPQUFaO0FBQ0gsS0FIZ0Q7QUFJakRNLElBQUFBLFVBQVUsRUFBRSxJQUpxQztBQUtqREMsSUFBQUEsWUFBWSxFQUFFO0FBTG1DLEdBQXJEO0FBT0EsU0FBT1gsU0FBUDtBQUNILENBckI4QixFQUEvQjs7QUFzQkEsSUFBSVksZ0JBQUo7O0FBQ0EsQ0FBQyxVQUFVQSxnQkFBVixFQUE0QjtBQUN6QkEsRUFBQUEsZ0JBQWdCLENBQUMsZUFBRCxDQUFoQixHQUFvQyxZQUFwQztBQUNBQSxFQUFBQSxnQkFBZ0IsQ0FBQyxhQUFELENBQWhCLEdBQWtDLFVBQWxDO0FBQ0FBLEVBQUFBLGdCQUFnQixDQUFDLGNBQUQsQ0FBaEIsR0FBbUMsV0FBbkM7QUFDQUEsRUFBQUEsZ0JBQWdCLENBQUMsZ0JBQUQsQ0FBaEIsR0FBcUMsYUFBckM7QUFDQUEsRUFBQUEsZ0JBQWdCLENBQUMsY0FBRCxDQUFoQixHQUFtQyxXQUFuQztBQUNBQSxFQUFBQSxnQkFBZ0IsQ0FBQyxhQUFELENBQWhCLEdBQWtDLFVBQWxDO0FBQ0FBLEVBQUFBLGdCQUFnQixDQUFDLFlBQUQsQ0FBaEIsR0FBaUMsU0FBakM7QUFDQUEsRUFBQUEsZ0JBQWdCLENBQUMsYUFBRCxDQUFoQixHQUFrQyxVQUFsQztBQUNBQSxFQUFBQSxnQkFBZ0IsQ0FBQyxhQUFELENBQWhCLEdBQWtDLFVBQWxDO0FBQ0FBLEVBQUFBLGdCQUFnQixDQUFDLGdCQUFELENBQWhCLEdBQXFDLFlBQXJDO0FBQ0FBLEVBQUFBLGdCQUFnQixDQUFDLGlCQUFELENBQWhCLEdBQXNDLGFBQXRDO0FBQ0FBLEVBQUFBLGdCQUFnQixDQUFDLGlCQUFELENBQWhCLEdBQXNDLGFBQXRDO0FBQ0FBLEVBQUFBLGdCQUFnQixDQUFDLGlCQUFELENBQWhCLEdBQXNDLGFBQXRDO0FBQ0FBLEVBQUFBLGdCQUFnQixDQUFDLGlCQUFELENBQWhCLEdBQXNDLGFBQXRDO0FBQ0FBLEVBQUFBLGdCQUFnQixDQUFDLGlCQUFELENBQWhCLEdBQXNDLGFBQXRDO0FBQ0FBLEVBQUFBLGdCQUFnQixDQUFDLGlCQUFELENBQWhCLEdBQXNDLGFBQXRDO0FBQ0FBLEVBQUFBLGdCQUFnQixDQUFDLGlCQUFELENBQWhCLEdBQXNDLGFBQXRDO0FBQ0FBLEVBQUFBLGdCQUFnQixDQUFDLGlCQUFELENBQWhCLEdBQXNDLGFBQXRDO0FBQ0gsQ0FuQkQsRUFtQkdBLGdCQUFnQixLQUFLQSxnQkFBZ0IsR0FBRyxFQUF4QixDQW5CbkI7O0FBb0JBLElBQUlDLE9BQUo7O0FBQ0EsQ0FBQyxVQUFVQSxPQUFWLEVBQW1CO0FBQ2hCQSxFQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQyxTQUFELENBQVAsR0FBcUIsQ0FBdEIsQ0FBUCxHQUFrQyxTQUFsQztBQUNBQSxFQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQyxNQUFELENBQVAsR0FBa0IsQ0FBbkIsQ0FBUCxHQUErQixNQUEvQjtBQUNBQSxFQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQyxPQUFELENBQVAsR0FBbUIsQ0FBcEIsQ0FBUCxHQUFnQyxPQUFoQztBQUNBQSxFQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQyxPQUFELENBQVAsR0FBbUIsQ0FBcEIsQ0FBUCxHQUFnQyxPQUFoQztBQUNBQSxFQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQyxPQUFELENBQVAsR0FBbUIsQ0FBcEIsQ0FBUCxHQUFnQyxPQUFoQztBQUNBQSxFQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQyxLQUFELENBQVAsR0FBaUIsQ0FBbEIsQ0FBUCxHQUE4QixLQUE5QjtBQUNBQSxFQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQyxNQUFELENBQVAsR0FBa0IsQ0FBbkIsQ0FBUCxHQUErQixNQUEvQjtBQUNBQSxFQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQyxNQUFELENBQVAsR0FBa0IsQ0FBbkIsQ0FBUCxHQUErQixNQUEvQjtBQUNBQSxFQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQyxNQUFELENBQVAsR0FBa0IsQ0FBbkIsQ0FBUCxHQUErQixNQUEvQjtBQUNBQSxFQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQyxNQUFELENBQVAsR0FBa0IsQ0FBbkIsQ0FBUCxHQUErQixNQUEvQjtBQUNBQSxFQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQyxPQUFELENBQVAsR0FBbUIsRUFBcEIsQ0FBUCxHQUFpQyxPQUFqQztBQUNBQSxFQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQyxPQUFELENBQVAsR0FBbUIsRUFBcEIsQ0FBUCxHQUFpQyxPQUFqQztBQUNBQSxFQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQyxPQUFELENBQVAsR0FBbUIsRUFBcEIsQ0FBUCxHQUFpQyxPQUFqQztBQUNBQSxFQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQyxPQUFELENBQVAsR0FBbUIsRUFBcEIsQ0FBUCxHQUFpQyxPQUFqQztBQUNBQSxFQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQyxRQUFELENBQVAsR0FBb0IsRUFBckIsQ0FBUCxHQUFrQyxRQUFsQztBQUNBQSxFQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQyxRQUFELENBQVAsR0FBb0IsRUFBckIsQ0FBUCxHQUFrQyxRQUFsQztBQUNBQSxFQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQyxRQUFELENBQVAsR0FBb0IsRUFBckIsQ0FBUCxHQUFrQyxRQUFsQztBQUNBQSxFQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQyxRQUFELENBQVAsR0FBb0IsRUFBckIsQ0FBUCxHQUFrQyxRQUFsQztBQUNBQSxFQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQyxNQUFELENBQVAsR0FBa0IsRUFBbkIsQ0FBUCxHQUFnQyxNQUFoQztBQUNBQSxFQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQyxRQUFELENBQVAsR0FBb0IsRUFBckIsQ0FBUCxHQUFrQyxRQUFsQztBQUNBQSxFQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQyxRQUFELENBQVAsR0FBb0IsRUFBckIsQ0FBUCxHQUFrQyxRQUFsQztBQUNBQSxFQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQyxRQUFELENBQVAsR0FBb0IsRUFBckIsQ0FBUCxHQUFrQyxRQUFsQztBQUNBQSxFQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQyxNQUFELENBQVAsR0FBa0IsRUFBbkIsQ0FBUCxHQUFnQyxNQUFoQztBQUNBQSxFQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQyxRQUFELENBQVAsR0FBb0IsRUFBckIsQ0FBUCxHQUFrQyxRQUFsQztBQUNBQSxFQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQyxRQUFELENBQVAsR0FBb0IsRUFBckIsQ0FBUCxHQUFrQyxRQUFsQztBQUNBQSxFQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQyxRQUFELENBQVAsR0FBb0IsRUFBckIsQ0FBUCxHQUFrQyxRQUFsQztBQUNBQSxFQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQyxNQUFELENBQVAsR0FBa0IsRUFBbkIsQ0FBUCxHQUFnQyxNQUFoQztBQUNBQSxFQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQyxXQUFELENBQVAsR0FBdUIsRUFBeEIsQ0FBUCxHQUFxQyxXQUFyQztBQUNBQSxFQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQyxpQkFBRCxDQUFQLEdBQTZCLEVBQTlCLENBQVAsR0FBMkMsaUJBQTNDO0FBQ0FBLEVBQUFBLE9BQU8sQ0FBQ0EsT0FBTyxDQUFDLFdBQUQsQ0FBUCxHQUF1QixFQUF4QixDQUFQLEdBQXFDLFdBQXJDO0FBQ0FBLEVBQUFBLE9BQU8sQ0FBQ0EsT0FBTyxDQUFDLGlCQUFELENBQVAsR0FBNkIsRUFBOUIsQ0FBUCxHQUEyQyxpQkFBM0M7QUFDQUEsRUFBQUEsT0FBTyxDQUFDQSxPQUFPLENBQUMsV0FBRCxDQUFQLEdBQXVCLEVBQXhCLENBQVAsR0FBcUMsV0FBckM7QUFDQUEsRUFBQUEsT0FBTyxDQUFDQSxPQUFPLENBQUMsY0FBRCxDQUFQLEdBQTBCLEVBQTNCLENBQVAsR0FBd0MsY0FBeEM7QUFDQUEsRUFBQUEsT0FBTyxDQUFDQSxPQUFPLENBQUMsT0FBRCxDQUFQLEdBQW1CLEVBQXBCLENBQVAsR0FBaUMsT0FBakM7QUFDSCxDQW5DRCxFQW1DR0EsT0FBTyxLQUFLQSxPQUFPLEdBQUcsRUFBZixDQW5DVjs7QUFvQ0EsSUFBSUMsU0FBSjs7QUFDQSxDQUFDLFVBQVVBLFNBQVYsRUFBcUI7QUFDbEJBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLFNBQUQsQ0FBVCxHQUF1QixDQUF4QixDQUFULEdBQXNDLFNBQXRDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLElBQUQsQ0FBVCxHQUFrQixDQUFuQixDQUFULEdBQWlDLElBQWpDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLElBQUQsQ0FBVCxHQUFrQixDQUFuQixDQUFULEdBQWlDLElBQWpDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLEtBQUQsQ0FBVCxHQUFtQixDQUFwQixDQUFULEdBQWtDLEtBQWxDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLElBQUQsQ0FBVCxHQUFrQixDQUFuQixDQUFULEdBQWlDLElBQWpDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLE1BQUQsQ0FBVCxHQUFvQixDQUFyQixDQUFULEdBQW1DLE1BQW5DO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLE1BQUQsQ0FBVCxHQUFvQixDQUFyQixDQUFULEdBQW1DLE1BQW5DO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLEtBQUQsQ0FBVCxHQUFtQixDQUFwQixDQUFULEdBQWtDLEtBQWxDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLE1BQUQsQ0FBVCxHQUFvQixDQUFyQixDQUFULEdBQW1DLE1BQW5DO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLE9BQUQsQ0FBVCxHQUFxQixDQUF0QixDQUFULEdBQW9DLE9BQXBDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLE1BQUQsQ0FBVCxHQUFvQixFQUFyQixDQUFULEdBQW9DLE1BQXBDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLE1BQUQsQ0FBVCxHQUFvQixFQUFyQixDQUFULEdBQW9DLE1BQXBDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLE9BQUQsQ0FBVCxHQUFxQixFQUF0QixDQUFULEdBQXFDLE9BQXJDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLE1BQUQsQ0FBVCxHQUFvQixFQUFyQixDQUFULEdBQW9DLE1BQXBDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLEtBQUQsQ0FBVCxHQUFtQixFQUFwQixDQUFULEdBQW1DLEtBQW5DO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLE9BQUQsQ0FBVCxHQUFxQixFQUF0QixDQUFULEdBQXFDLE9BQXJDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLE9BQUQsQ0FBVCxHQUFxQixFQUF0QixDQUFULEdBQXFDLE9BQXJDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLE1BQUQsQ0FBVCxHQUFvQixFQUFyQixDQUFULEdBQW9DLE1BQXBDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLE9BQUQsQ0FBVCxHQUFxQixFQUF0QixDQUFULEdBQXFDLE9BQXJDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLFFBQUQsQ0FBVCxHQUFzQixFQUF2QixDQUFULEdBQXNDLFFBQXRDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLE9BQUQsQ0FBVCxHQUFxQixFQUF0QixDQUFULEdBQXFDLE9BQXJDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLE9BQUQsQ0FBVCxHQUFxQixFQUF0QixDQUFULEdBQXFDLE9BQXJDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLFFBQUQsQ0FBVCxHQUFzQixFQUF2QixDQUFULEdBQXNDLFFBQXRDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLE9BQUQsQ0FBVCxHQUFxQixFQUF0QixDQUFULEdBQXFDLE9BQXJDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLE1BQUQsQ0FBVCxHQUFvQixFQUFyQixDQUFULEdBQW9DLE1BQXBDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLE9BQUQsQ0FBVCxHQUFxQixFQUF0QixDQUFULEdBQXFDLE9BQXJDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLFFBQUQsQ0FBVCxHQUFzQixFQUF2QixDQUFULEdBQXNDLFFBQXRDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLFFBQUQsQ0FBVCxHQUFzQixFQUF2QixDQUFULEdBQXNDLFFBQXRDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLE9BQUQsQ0FBVCxHQUFxQixFQUF0QixDQUFULEdBQXFDLE9BQXJDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLFFBQUQsQ0FBVCxHQUFzQixFQUF2QixDQUFULEdBQXNDLFFBQXRDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLFNBQUQsQ0FBVCxHQUF1QixFQUF4QixDQUFULEdBQXVDLFNBQXZDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLFFBQUQsQ0FBVCxHQUFzQixFQUF2QixDQUFULEdBQXNDLFFBQXRDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLFFBQUQsQ0FBVCxHQUFzQixFQUF2QixDQUFULEdBQXNDLFFBQXRDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLFNBQUQsQ0FBVCxHQUF1QixFQUF4QixDQUFULEdBQXVDLFNBQXZDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLFFBQUQsQ0FBVCxHQUFzQixFQUF2QixDQUFULEdBQXNDLFFBQXRDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLE9BQUQsQ0FBVCxHQUFxQixFQUF0QixDQUFULEdBQXFDLE9BQXJDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLFVBQUQsQ0FBVCxHQUF3QixFQUF6QixDQUFULEdBQXdDLFVBQXhDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLFNBQUQsQ0FBVCxHQUF1QixFQUF4QixDQUFULEdBQXVDLFNBQXZDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLFNBQUQsQ0FBVCxHQUF1QixFQUF4QixDQUFULEdBQXVDLFNBQXZDO0FBQ0FBLEVBQUFBLFNBQVMsQ0FBQ0EsU0FBUyxDQUFDLFFB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7O0FBQ0EsSUFBSUMsRUFBSixFQUFRQyxFQUFSOztBQUNBLElBQUlDLGdCQUFKOztBQUNBLENBQUMsVUFBVUEsZ0JBQVYsRUFBNEI7QUFDekJBLEVBQUFBLGdCQUFnQixDQUFDQSxnQkFBZ0IsQ0FBQyxXQUFELENBQWhCLEdBQWdDLENBQWpDLENBQWhCLEdBQXNELFdBQXREO0FBQ0FBLEVBQUFBLGdCQUFnQixDQUFDQSxnQkFBZ0IsQ0FBQyxXQUFELENBQWhCLEdBQWdDLENBQWpDLENBQWhCLEdBQXNELFdBQXREO0FBQ0FBLEVBQUFBLGdCQUFnQixDQUFDQSxnQkFBZ0IsQ0FBQyxXQUFELENBQWhCLEdBQWdDLENBQWpDLENBQWhCLEdBQXNELFdBQXREO0FBQ0FBLEVBQUFBLGdCQUFnQixDQUFDQSxnQkFBZ0IsQ0FBQyxVQUFELENBQWhCLEdBQStCLENBQWhDLENBQWhCLEdBQXFELFVBQXJEO0FBQ0FBLEVBQUFBLGdCQUFnQixDQUFDQSxnQkFBZ0IsQ0FBQyxVQUFELENBQWhCLEdBQStCLENBQWhDLENBQWhCLEdBQXFELFVBQXJEO0FBQ0FBLEVBQUFBLGdCQUFnQixDQUFDQSxnQkFBZ0Is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QixHQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFJd0QsZUFBZSxHQUFHO0FBQ2xCQyxFQUFBQSxXQUFXLEVBQUUsQ0FDVDtBQUNJQyxJQUFBQSxPQUFPLEVBQUUsQ0FDTDtBQUNJQyxNQUFBQSxpQkFBaUIsRUFBRSxFQUR2QjtBQUVJQyxNQUFBQSxlQUFlLEVBQUUsRUFGckI7QUFHSUMsTUFBQUEsVUFBVSxFQUFFO0FBQUVDLFFBQUFBLE9BQU8sRUFBRSxDQUFDLEVBQUQ7QUFBWCxPQUhoQjtBQUlJQyxNQUFBQSxVQUFVLEVBQUU7QUFBRUMsUUFBQUEsR0FBRyxFQUFFO0FBQUVDLFVBQUFBLE9BQU8sRUFBRSxFQUFYO0FBQWVDLFVBQUFBLFNBQVMsRUFBRTtBQUExQjtBQUFQO0FBSmhCLEtBREs7QUFEYixHQURTO0FBREssQ0FBdEI7QUFjQSxJQUFJQyxRQUFRLEdBQUc7QUFDWDVKLEVBQUFBLGlCQUFpQixFQUFFQSxpQkFEUjtBQUVYK0YsRUFBQUEsZ0JBQWdCLEVBQUVBLGdCQUZQO0FBR1hrRCxFQUFBQSxlQUFlLEVBQUVBLGVBSE47QUFJWGpELEVBQUFBLE9BQU8sRUFBRUEsT0FKRTtBQUtYQyxFQUFBQSxPQUFPLEVBQUVBLE9BTEU7QUFNWEMsRUFBQUEsU0FBUyxFQUFFQSxTQU5BO0FBT1hTLEVBQUFBLFVBQVUsRUFBRUEsVUFQRDtBQVFYL0csRUFBQUEsV0FBVyxFQUFFQSxXQVJGO0FBU1g4RixFQUFBQSxjQUFjLEVBQUVBLGNBVEw7QUFVWGpDLEVBQUFBLGNBQWMsRUFBRUEsY0FWTDtBQVdYbUMsRUFBQUEsY0FBYyxFQUFFQTtBQVhMLENBQWY7QUFjQWlFLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQkYsUUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogZW51bXNcbiAqL1xuY29uc3QgZW51bXMgPSB7XG4gIC8vIGJ1ZmZlciB1c2FnZVxuICBVU0FHRV9TVEFUSUM6IDM1MDQ0LCAgLy8gZ2wuU1RBVElDX0RSQVdcbiAgVVNBR0VfRFlOQU1JQzogMzUwNDgsIC8vIGdsLkRZTkFNSUNfRFJBV1xuICBVU0FHRV9TVFJFQU06IDM1MDQwLCAgLy8gZ2wuU1RSRUFNX0RSQVdcblxuICAvLyBpbmRleCBidWZmZXIgZm9ybWF0XG4gIElOREVYX0ZNVF9VSU5UODogNTEyMSwgIC8vIGdsLlVOU0lHTkVEX0JZVEVcbiAgSU5ERVhfRk1UX1VJTlQxNjogNTEyMywgLy8gZ2wuVU5TSUdORURfU0hPUlRcbiAgSU5ERVhfRk1UX1VJTlQzMjogNTEyNSwgLy8gZ2wuVU5TSUdORURfSU5UIChPRVNfZWxlbWVudF9pbmRleF91aW50KVxuXG4gIC8vIHZlcnRleCBhdHRyaWJ1dGUgc2VtYW50aWNcbiAgQVRUUl9QT1NJVElPTjogJ2FfcG9zaXRpb24nLFxuICBBVFRSX05PUk1BTDogJ2Ffbm9ybWFsJyxcbiAgQVRUUl9UQU5HRU5UOiAnYV90YW5nZW50JyxcbiAgQVRUUl9CSVRBTkdFTlQ6ICdhX2JpdGFuZ2VudCcsXG4gIEFUVFJfV0VJR0hUUzogJ2Ffd2VpZ2h0cycsXG4gIEFUVFJfSk9JTlRTOiAnYV9qb2ludHMnLFxuICBBVFRSX0NPTE9SOiAnYV9jb2xvcicsXG4gIEFUVFJfQ09MT1IwOiAnYV9jb2xvcjAnLFxuICBBVFRSX0NPTE9SMTogJ2FfY29sb3IxJyxcbiAgQVRUUl9VVjogJ2FfdXYnLFxuICBBVFRSX1VWMDogJ2FfdXYwJyxcbiAgQVRUUl9VVjE6ICdhX3V2MScsXG4gIEFUVFJfVVYyOiAnYV91djInLFxuICBBVFRSX1VWMzogJ2FfdXYzJyxcbiAgQVRUUl9VVjQ6ICdhX3V2NCcsXG4gIEFUVFJfVVY1OiAnYV91djUnLFxuICBBVFRSX1VWNjogJ2FfdXY2JyxcbiAgQVRUUl9VVjc6ICdhX3V2NycsXG5cbiAgLy8gdmVydGV4IGF0dHJpYnV0ZSB0eXBlXG4gIEFUVFJfVFlQRV9JTlQ4OiA1MTIwLCAgICAvLyBnbC5CWVRFXG4gIEFUVFJfVFlQRV9VSU5UODogNTEyMSwgICAvLyBnbC5VTlNJR05FRF9CWVRFXG4gIEFUVFJfVFlQRV9JTlQxNjogNTEyMiwgICAvLyBnbC5TSE9SVFxuICBBVFRSX1RZUEVfVUlOVDE2OiA1MTIzLCAgLy8gZ2wuVU5TSUdORURfU0hPUlRcbiAgQVRUUl9UWVBFX0lOVDMyOiA1MTI0LCAgIC8vIGdsLklOVFxuICBBVFRSX1RZUEVfVUlOVDMyOiA1MTI1LCAgLy8gZ2wuVU5TSUdORURfSU5UXG4gIEFUVFJfVFlQRV9GTE9BVDMyOiA1MTI2LCAvLyBnbC5GTE9BVFxuXG4gIC8vIHRleHR1cmUgZmlsdGVyXG4gIEZJTFRFUl9ORUFSRVNUOiAwLFxuICBGSUxURVJfTElORUFSOiAxLFxuXG4gIC8vIHRleHR1cmUgd3JhcCBtb2RlXG4gIFdSQVBfUkVQRUFUOiAxMDQ5NywgLy8gZ2wuUkVQRUFUXG4gIFdSQVBfQ0xBTVA6IDMzMDcxLCAgLy8gZ2wuQ0xBTVBfVE9fRURHRVxuICBXUkFQX01JUlJPUjogMzM2NDgsIC8vIGdsLk1JUlJPUkVEX1JFUEVBVFxuXG4gIC8vIHRleHR1cmUgZm9ybWF0XG4gIC8vIGNvbXByZXNzIGZvcm1hdHNcbiAgVEVYVFVSRV9GTVRfUkdCX0RYVDE6IDAsXG4gIFRFWFRVUkVfRk1UX1JHQkFfRFhUMTogMSxcbiAgVEVYVFVSRV9GTVRfUkdCQV9EWFQzOiAyLFxuICBURVhUVVJFX0ZNVF9SR0JBX0RYVDU6IDMsXG4gIFRFWFRVUkVfRk1UX1JHQl9FVEMxOiA0LFxuICBURVhUVVJFX0ZNVF9SR0JfUFZSVENfMkJQUFYxOiA1LFxuICBURVhUVVJFX0ZNVF9SR0JBX1BWUlRDXzJCUFBWMTogNixcbiAgVEVYVFVSRV9GTVRfUkdCX1BWUlRDXzRCUFBWMTogNyxcbiAgVEVYVFVSRV9GTVRfUkdCQV9QVlJUQ180QlBQVjE6IDgsXG5cbiAgLy8gbm9ybWFsIGZvcm1hdHNcbiAgVEVYVFVSRV9GTVRfQTg6IDksXG4gIFRFWFRVUkVfRk1UX0w4OiAxMCxcbiAgVEVYVFVSRV9GTVRfTDhfQTg6IDExLFxuICBURVhUVVJFX0ZNVF9SNV9HNl9CNTogMTIsXG4gIFRFWFRVUkVfRk1UX1I1X0c1X0I1X0ExOiAxMyxcbiAgVEVYVFVSRV9GTVRfUjRfRzRfQjRfQTQ6IDE0LFxuICBURVhUVVJFX0ZNVF9SR0I4OiAxNSxcbiAgVEVYVFVSRV9GTVRfUkdCQTg6IDE2LFxuICBURVhUVVJFX0ZNVF9SR0IxNkY6IDE3LFxuICBURVhUVVJFX0ZNVF9SR0JBMTZGOiAxOCxcbiAgVEVYVFVSRV9GTVRfUkdCMzJGOiAxOSxcbiAgVEVYVFVSRV9GTVRfUkdCQTMyRjogMjAsXG4gIFRFWFRVUkVfRk1UX1IzMkY6IDIxLFxuICBURVhUVVJFX0ZNVF8xMTExMTBGOiAyMixcbiAgVEVYVFVSRV9GTVRfU1JHQjogMjMsXG4gIFRFWFRVUkVfRk1UX1NSR0JBOiAyNCxcblxuICAvLyBkZXB0aCBmb3JtYXRzXG4gIFRFWFRVUkVfRk1UX0QxNjogMjUsXG4gIFRFWFRVUkVfRk1UX0QzMjogMjYsXG4gIFRFWFRVUkVfRk1UX0QyNFM4OiAyNyxcblxuICAvLyBldGMyIGZvcm1hdFxuICBURVhUVVJFX0ZNVF9SR0JfRVRDMjogMjgsXG4gIFRFWFRVUkVfRk1UX1JHQkFfRVRDMjogMjksXG5cbiAgLy8gZGVwdGggYW5kIHN0ZW5jaWwgZnVuY3Rpb25cbiAgRFNfRlVOQ19ORVZFUjogNTEyLCAgICAvLyBnbC5ORVZFUlxuICBEU19GVU5DX0xFU1M6IDUxMywgICAgIC8vIGdsLkxFU1NcbiAgRFNfRlVOQ19FUVVBTDogNTE0LCAgICAvLyBnbC5FUVVBTFxuICBEU19GVU5DX0xFUVVBTDogNTE1LCAgIC8vIGdsLkxFUVVBTFxuICBEU19GVU5DX0dSRUFURVI6IDUxNiwgIC8vIGdsLkdSRUFURVJcbiAgRFNfRlVOQ19OT1RFUVVBTDogNTE3LCAvLyBnbC5OT1RFUVVBTFxuICBEU19GVU5DX0dFUVVBTDogNTE4LCAgIC8vIGdsLkdFUVVBTFxuICBEU19GVU5DX0FMV0FZUzogNTE5LCAgIC8vIGdsLkFMV0FZU1xuXG4gIC8vIHJlbmRlci1idWZmZXIgZm9ybWF0XG4gIFJCX0ZNVF9SR0JBNDogMzI4NTQsICAgIC8vIGdsLlJHQkE0XG4gIFJCX0ZNVF9SR0I1X0ExOiAzMjg1NSwgIC8vIGdsLlJHQjVfQTFcbiAgUkJfRk1UX1JHQjU2NTogMzYxOTQsICAgLy8gZ2wuUkdCNTY1XG4gIFJCX0ZNVF9EMTY6IDMzMTg5LCAgICAgIC8vIGdsLkRFUFRIX0NPTVBPTkVOVDE2XG4gIFJCX0ZNVF9TODogMzYxNjgsICAgICAgIC8vIGdsLlNURU5DSUxfSU5ERVg4XG4gIFJCX0ZNVF9EMjRTODogMzQwNDEsICAgIC8vIGdsLkRFUFRIX1NURU5DSUxcblxuICAvLyBibGVuZC1lcXVhdGlvblxuICBCTEVORF9GVU5DX0FERDogMzI3NzQsICAgICAgICAgICAgICAvLyBnbC5GVU5DX0FERFxuICBCTEVORF9GVU5DX1NVQlRSQUNUOiAzMjc3OCwgICAgICAgICAvLyBnbC5GVU5DX1NVQlRSQUNUXG4gIEJMRU5EX0ZVTkNfUkVWRVJTRV9TVUJUUkFDVDogMzI3NzksIC8vIGdsLkZVTkNfUkVWRVJTRV9TVUJUUkFDVFxuXG4gIC8vIGJsZW5kXG4gIEJMRU5EX1pFUk86IDAsICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBnbC5aRVJPXG4gIEJMRU5EX09ORTogMSwgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBnbC5PTkVcbiAgQkxFTkRfU1JDX0NPTE9SOiA3NjgsICAgICAgICAgICAgICAgICAgIC8vIGdsLlNSQ19DT0xPUlxuICBCTEVORF9PTkVfTUlOVVNfU1JDX0NPTE9SOiA3NjksICAgICAgICAgLy8gZ2wuT05FX01JTlVTX1NSQ19DT0xPUlxuICBCTEVORF9EU1RfQ09MT1I6IDc3NCwgICAgICAgICAgICAgICAgICAgLy8gZ2wuRFNUX0NPTE9SXG4gIEJMRU5EX09ORV9NSU5VU19EU1RfQ09MT1I6IDc3NSwgICAgICAgICAvLyBnbC5PTkVfTUlOVVNfRFNUX0NPTE9SXG4gIEJMRU5EX1NSQ19BTFBIQTogNzcwLCAgICAgICAgICAgICAgICAgICAvLyBnbC5TUkNfQUxQSEFcbiAgQkxFTkRfT05FX01JTlVTX1NSQ19BTFBIQTogNzcxLCAgICAgICAgIC8vIGdsLk9ORV9NSU5VU19TUkNfQUxQSEFcbiAgQkxFTkRfRFNUX0FMUEhBOiA3NzIsICAgICAgICAgICAgICAgICAgIC8vIGdsLkRTVF9BTFBIQVxuICBCTEVORF9PTkVfTUlOVVNfRFNUX0FMUEhBOiA3NzMsICAgICAgICAgLy8gZ2wuT05FX01JTlVTX0RTVF9BTFBIQVxuICBCTEVORF9DT05TVEFOVF9DT0xPUjogMzI3NjksICAgICAgICAgICAgLy8gZ2wuQ09OU1RBTlRfQ09MT1JcbiAgQkxFTkRfT05FX01JTlVTX0NPTlNUQU5UX0NPTE9SOiAzMjc3MCwgIC8vIGdsLk9ORV9NSU5VU19DT05TVEFOVF9DT0xPUlxuICBCTEVORF9DT05TVEFOVF9BTFBIQTogMzI3NzEsICAgICAgICAgICAgLy8gZ2wuQ09OU1RBTlRfQUxQSEFcbiAgQkxFTkRfT05FX01JTlVTX0NPTlNUQU5UX0FMUEhBOiAzMjc3MiwgIC8vIGdsLk9ORV9NSU5VU19DT05TVEFOVF9BTFBIQVxuICBCTEVORF9TUkNfQUxQSEFfU0FUVVJBVEU6IDc3NiwgICAgICAgICAgLy8gZ2wuU1JDX0FMUEhBX1NBVFVSQVRFXG5cbiAgLy8gc3RlbmNpbCBvcGVyYXRpb25cbiAgU1RFTkNJTF9ESVNBQkxFOiAwLCAgICAgICAgICAgICAvLyBkaXNhYmxlIHN0ZW5jaWxcbiAgU1RFTkNJTF9FTkFCTEU6IDEsICAgICAgICAgICAgICAvLyBlbmFibGUgc3RlbmNpbFxuICBTVEVOQ0lMX0lOSEVSSVQ6IDIsICAgICAgICAgICAgIC8vIGluaGVyaXQgc3RlbmNpbCBzdGF0ZXNcblxuICBTVEVOQ0lMX09QX0tFRVA6IDc2ODAsICAgICAgICAgIC8vIGdsLktFRVBcbiAgU1RFTkNJTF9PUF9aRVJPOiAwLCAgICAgICAgICAgICAvLyBnbC5aRVJPXG4gIFNURU5DSUxfT1BfUkVQTEFDRTogNzY4MSwgICAgICAgLy8gZ2wuUkVQTEFDRVxuICBTVEVOQ0lMX09QX0lOQ1I6IDc2ODIsICAgICAgICAgIC8vIGdsLklOQ1JcbiAgU1RFTkNJTF9PUF9JTkNSX1dSQVA6IDM0MDU1LCAgICAvLyBnbC5JTkNSX1dSQVBcbiAgU1RFTkNJTF9PUF9ERUNSOiA3NjgzLCAgICAgICAgICAvLyBnbC5ERUNSXG4gIFNURU5DSUxfT1BfREVDUl9XUkFQOiAzNDA1NiwgICAgLy8gZ2wuREVDUl9XUkFQXG4gIFNURU5DSUxfT1BfSU5WRVJUOiA1Mzg2LCAgICAgICAgLy8gZ2wuSU5WRVJUXG5cbiAgLy8gY3VsbFxuICBDVUxMX05PTkU6IDAsXG4gIENVTExfRlJPTlQ6IDEwMjgsXG4gIENVTExfQkFDSzogMTAyOSxcbiAgQ1VMTF9GUk9OVF9BTkRfQkFDSzogMTAzMixcblxuICAvLyBwcmltaXRpdmUgdHlwZVxuICBQVF9QT0lOVFM6IDAsICAgICAgICAgLy8gZ2wuUE9JTlRTXG4gIFBUX0xJTkVTOiAxLCAgICAgICAgICAvLyBnbC5MSU5FU1xuICBQVF9MSU5FX0xPT1A6IDIsICAgICAgLy8gZ2wuTElORV9MT09QXG4gIFBUX0xJTkVfU1RSSVA6IDMsICAgICAvLyBnbC5MSU5FX1NUUklQXG4gIFBUX1RSSUFOR0xFUzogNCwgICAgICAvLyBnbC5UUklBTkdMRVNcbiAgUFRfVFJJQU5HTEVfU1RSSVA6IDUsIC8vIGdsLlRSSUFOR0xFX1NUUklQXG4gIFBUX1RSSUFOR0xFX0ZBTjogNiwgICAvLyBnbC5UUklBTkdMRV9GQU5cbn07XG5cbmxldCBSZW5kZXJRdWV1ZSA9IHtcbiAgICBPUEFRVUU6IDAsXG4gICAgVFJBTlNQQVJFTlQ6IDEsXG4gICAgT1ZFUkxBWTogMlxufTtcblxuLyoqXG4gKiBKUyBJbXBsZW1lbnRhdGlvbiBvZiBNdXJtdXJIYXNoMlxuICogXG4gKiBAYXV0aG9yIDxhIGhyZWY9XCJtYWlsdG86Z2FyeS5jb3VydEBnbWFpbC5jb21cIj5HYXJ5IENvdXJ0PC9hPlxuICogQHNlZSBodHRwOi8vZ2l0aHViLmNvbS9nYXJ5Y291cnQvbXVybXVyaGFzaC1qc1xuICogQGF1dGhvciA8YSBocmVmPVwibWFpbHRvOmFhcHBsZWJ5QGdtYWlsLmNvbVwiPkF1c3RpbiBBcHBsZWJ5PC9hPlxuICogQHNlZSBodHRwOi8vc2l0ZXMuZ29vZ2xlLmNvbS9zaXRlL211cm11cmhhc2gvXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgQVNDSUkgb25seVxuICogQHBhcmFtIHtudW1iZXJ9IHNlZWQgUG9zaXRpdmUgaW50ZWdlciBvbmx5XG4gKiBAcmV0dXJuIHtudW1iZXJ9IDMyLWJpdCBwb3NpdGl2ZSBpbnRlZ2VyIGhhc2hcbiAqL1xuXG5mdW5jdGlvbiBtdXJtdXJoYXNoMl8zMl9nYyhzdHIsIHNlZWQpIHtcbiAgdmFyXG4gICAgbCA9IHN0ci5sZW5ndGgsXG4gICAgaCA9IHNlZWQgXiBsLFxuICAgIGkgPSAwLFxuICAgIGs7XG4gIFxuICB3aGlsZSAobCA+PSA0KSB7XG4gIFx0ayA9IFxuICBcdCAgKChzdHIuY2hhckNvZGVBdChpKSAmIDB4ZmYpKSB8XG4gIFx0ICAoKHN0ci5jaGFyQ29kZUF0KCsraSkgJiAweGZmKSA8PCA4KSB8XG4gIFx0ICAoKHN0ci5jaGFyQ29kZUF0KCsraSkgJiAweGZmKSA8PCAxNikgfFxuICBcdCAgKChzdHIuY2hhckNvZGVBdCgrK2kpICYgMHhmZikgPDwgMjQpO1xuICAgIFxuICAgIGsgPSAoKChrICYgMHhmZmZmKSAqIDB4NWJkMWU5OTUpICsgKCgoKGsgPj4+IDE2KSAqIDB4NWJkMWU5OTUpICYgMHhmZmZmKSA8PCAxNikpO1xuICAgIGsgXj0gayA+Pj4gMjQ7XG4gICAgayA9ICgoKGsgJiAweGZmZmYpICogMHg1YmQxZTk5NSkgKyAoKCgoayA+Pj4gMTYpICogMHg1YmQxZTk5NSkgJiAweGZmZmYpIDw8IDE2KSk7XG5cblx0aCA9ICgoKGggJiAweGZmZmYpICogMHg1YmQxZTk5NSkgKyAoKCgoaCA+Pj4gMTYpICogMHg1YmQxZTk5NSkgJiAweGZmZmYpIDw8IDE2KSkgXiBrO1xuXG4gICAgbCAtPSA0O1xuICAgICsraTtcbiAgfVxuICBcbiAgc3dpdGNoIChsKSB7XG4gIGNhc2UgMzogaCBePSAoc3RyLmNoYXJDb2RlQXQoaSArIDIpICYgMHhmZikgPDwgMTY7XG4gIGNhc2UgMjogaCBePSAoc3RyLmNoYXJDb2RlQXQoaSArIDEpICYgMHhmZikgPDwgODtcbiAgY2FzZSAxOiBoIF49IChzdHIuY2hhckNvZGVBdChpKSAmIDB4ZmYpO1xuICAgICAgICAgIGggPSAoKChoICYgMHhmZmZmKSAqIDB4NWJkMWU5OTUpICsgKCgoKGggPj4+IDE2KSAqIDB4NWJkMWU5OTUpICYgMHhmZmZmKSA8PCAxNikpO1xuICB9XG5cbiAgaCBePSBoID4+PiAxMztcbiAgaCA9ICgoKGggJiAweGZmZmYpICogMHg1YmQxZTk5NSkgKyAoKCgoaCA+Pj4gMTYpICogMHg1YmQxZTk5NSkgJiAweGZmZmYpIDw8IDE2KSk7XG4gIGggXj0gaCA+Pj4gMTU7XG5cbiAgcmV0dXJuIGggPj4+IDA7XG59XG5cbi8vIEV4dGVuc2lvbnNcbnZhciBXZWJHTEVYVDtcbihmdW5jdGlvbiAoV2ViR0xFWFQpIHtcbiAgICBXZWJHTEVYVFtXZWJHTEVYVFtcIkNPTVBSRVNTRURfUkdCX1MzVENfRFhUMV9FWFRcIl0gPSAzMzc3Nl0gPSBcIkNPTVBSRVNTRURfUkdCX1MzVENfRFhUMV9FWFRcIjtcbiAgICBXZWJHTEVYVFtXZWJHTEVYVFtcIkNPTVBSRVNTRURfUkdCQV9TM1RDX0RYVDFfRVhUXCJdID0gMzM3NzddID0gXCJDT01QUkVTU0VEX1JHQkFfUzNUQ19EWFQxX0VYVFwiO1xuICAgIFdlYkdMRVhUW1dlYkdMRVhUW1wiQ09NUFJFU1NFRF9SR0JBX1MzVENfRFhUM19FWFRcIl0gPSAzMzc3OF0gPSBcIkNPTVBSRVNTRURfUkdCQV9TM1RDX0RYVDNfRVhUXCI7XG4gICAgV2ViR0xFWFRbV2ViR0xFWFRbXCJDT01QUkVTU0VEX1JHQkFfUzNUQ19EWFQ1X0VYVFwiXSA9IDMzNzc5XSA9IFwiQ09NUFJFU1NFRF9SR0JBX1MzVENfRFhUNV9FWFRcIjtcbiAgICBXZWJHTEVYVFtXZWJHTEVYVFtcIkNPTVBSRVNTRURfU1JHQl9TM1RDX0RYVDFfRVhUXCJdID0gMzU5MTZdID0gXCJDT01QUkVTU0VEX1NSR0JfUzNUQ19EWFQxX0VYVFwiO1xuICAgIFdlYkdMRVhUW1dlYkdMRVhUW1wiQ09NUFJFU1NFRF9TUkdCX0FMUEhBX1MzVENfRFhUMV9FWFRcIl0gPSAzNTkxN10gPSBcIkNPTVBSRVNTRURfU1JHQl9BTFBIQV9TM1RDX0RYVDFfRVhUXCI7XG4gICAgV2ViR0xFWFRbV2ViR0xFWFRbXCJDT01QUkVTU0VEX1NSR0JfQUxQSEFfUzNUQ19EWFQzX0VYVFwiXSA9IDM1OTE4XSA9IFwiQ09NUFJFU1NFRF9TUkdCX0FMUEhBX1MzVENfRFhUM19FWFRcIjtcbiAgICBXZWJHTEVYVFtXZWJHTEVYVFtcIkNPTVBSRVNTRURfU1JHQl9BTFBIQV9TM1RDX0RYVDVfRVhUXCJdID0gMzU5MTldID0gXCJDT01QUkVTU0VEX1NSR0JfQUxQSEFfUzNUQ19EWFQ1X0VYVFwiO1xuICAgIFdlYkdMRVhUW1dlYkdMRVhUW1wiQ09NUFJFU1NFRF9SR0JfUFZSVENfNEJQUFYxX0lNR1wiXSA9IDM1ODQwXSA9IFwiQ09NUFJFU1NFRF9SR0JfUFZSVENfNEJQUFYxX0lNR1wiO1xuICAgIFdlYkdMRVhUW1dlYkdMRVhUW1wiQ09NUFJFU1NFRF9SR0JfUFZSVENfMkJQUFYxX0lNR1wiXSA9IDM1ODQxXSA9IFwiQ09NUFJFU1NFRF9SR0JfUFZSVENfMkJQUFYxX0lNR1wiO1xuICAgIFdlYkdMRVhUW1dlYkdMRVhUW1wiQ09NUFJFU1NFRF9SR0JBX1BWUlRDXzRCUFBWMV9JTUdcIl0gPSAzNTg0Ml0gPSBcIkNPTVBSRVNTRURfUkdCQV9QVlJUQ180QlBQVjFfSU1HXCI7XG4gICAgV2ViR0xFWFRbV2ViR0xFWFRbXCJDT01QUkVTU0VEX1JHQkFfUFZSVENfMkJQUFYxX0lNR1wiXSA9IDM1ODQzXSA9IFwiQ09NUFJFU1NFRF9SR0JBX1BWUlRDXzJCUFBWMV9JTUdcIjtcbiAgICBXZWJHTEVYVFtXZWJHTEVYVFtcIkNPTVBSRVNTRURfUkdCX0VUQzFfV0VCR0xcIl0gPSAzNjE5Nl0gPSBcIkNPTVBSRVNTRURfUkdCX0VUQzFfV0VCR0xcIjtcbn0pKFdlYkdMRVhUIHx8IChXZWJHTEVYVCA9IHt9KSk7XG52YXIgR0ZYT2JqZWN0VHlwZTtcbihmdW5jdGlvbiAoR0ZYT2JqZWN0VHlwZSkge1xuICAgIEdGWE9iamVjdFR5cGVbR0ZYT2JqZWN0VHlwZVtcIlVOS05PV05cIl0gPSAwXSA9IFwiVU5LTk9XTlwiO1xuICAgIEdGWE9iamVjdFR5cGVbR0ZYT2JqZWN0VHlwZVtcIkJVRkZFUlwiXSA9IDFdID0gXCJCVUZGRVJcIjtcbiAgICBHRlhPYmplY3RUeXBlW0dGWE9iamVjdFR5cGVbXCJURVhUVVJFXCJdID0gMl0gPSBcIlRFWFRVUkVcIjtcbiAgICBHRlhPYmplY3RUeXBlW0dGWE9iamVjdFR5cGVbXCJURVhUVVJFX1ZJRVdcIl0gPSAzXSA9IFwiVEVYVFVSRV9WSUVXXCI7XG4gICAgR0ZYT2JqZWN0VHlwZVtHRlhPYmplY3RUeXBlW1wiUkVOREVSX1BBU1NcIl0gPSA0XSA9IFwiUkVOREVSX1BBU1NcIjtcbiAgICBHRlhPYmplY3RUeXBlW0dGWE9iamVjdFR5cGVbXCJGUkFNRUJVRkZFUlwiXSA9IDVdID0gXCJGUkFNRUJVRkZFUlwiO1xuICAgIEdGWE9iamVjdFR5cGVbR0ZYT2JqZWN0VHlwZVtcIlNBTVBMRVJcIl0gPSA2XSA9IFwiU0FNUExFUlwiO1xuICAgIEdGWE9iamVjdFR5cGVbR0ZYT2JqZWN0VHlwZVtcIlNIQURFUlwiXSA9IDddID0gXCJTSEFERVJcIjtcbiAgICBHRlhPYmplY3RUeXBlW0dGWE9iamVjdFR5cGVbXCJQSVBFTElORV9MQVlPVVRcIl0gPSA4XSA9IFwiUElQRUxJTkVfTEFZT1VUXCI7XG4gICAgR0ZYT2JqZWN0VHlwZVtHRlhPYmplY3RUeXBlW1wiUElQRUxJTkVfU1RBVEVcIl0gPSA5XSA9IFwiUElQRUxJTkVfU1RBVEVcIjtcbiAgICBHRlhPYmplY3RUeXBlW0dGWE9iamVjdFR5cGVbXCJCSU5ESU5HX0xBWU9VVFwiXSA9IDEwXSA9IFwiQklORElOR19MQVlPVVRcIjtcbiAgICBHRlhPYmplY3RUeXBlW0dGWE9iamVjdFR5cGVbXCJJTlBVVF9BU1NFTUJMRVJcIl0gPSAxMV0gPSBcIklOUFVUX0FTU0VNQkxFUlwiO1xuICAgIEdGWE9iamVjdFR5cGVbR0ZYT2JqZWN0VHlwZVtcIkNPTU1BTkRfQUxMT0NBVE9SXCJdID0gMTJdID0gXCJDT01NQU5EX0FMTE9DQVRPUlwiO1xuICAgIEdGWE9iamVjdFR5cGVbR0ZYT2JqZWN0VHlwZVtcIkNPTU1BTkRfQlVGRkVSXCJdID0gMTNdID0gXCJDT01NQU5EX0JVRkZFUlwiO1xuICAgIEdGWE9iamVjdFR5cGVbR0ZYT2JqZWN0VHlwZVtcIlFVRVVFXCJdID0gMTRdID0gXCJRVUVVRVwiO1xuICAgIEdGWE9iamVjdFR5cGVbR0ZYT2JqZWN0VHlwZVtcIldJTkRPV1wiXSA9IDE1XSA9IFwiV0lORE9XXCI7XG59KShHRlhPYmplY3RUeXBlIHx8IChHRlhPYmplY3RUeXBlID0ge30pKTtcbnZhciBHRlhTdGF0dXM7XG4oZnVuY3Rpb24gKEdGWFN0YXR1cykge1xuICAgIEdGWFN0YXR1c1tHRlhTdGF0dXNbXCJVTlJFQURZXCJdID0gMF0gPSBcIlVOUkVBRFlcIjtcbiAgICBHRlhTdGF0dXNbR0ZYU3RhdHVzW1wiRkFJTEVEXCJdID0gMV0gPSBcIkZBSUxFRFwiO1xuICAgIEdGWFN0YXR1c1tHRlhTdGF0dXNbXCJTVUNDRVNTXCJdID0gMl0gPSBcIlNVQ0NFU1NcIjtcbn0pKEdGWFN0YXR1cyB8fCAoR0ZYU3RhdHVzID0ge30pKTtcbnZhciBHRlhPYmplY3QgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gR0ZYT2JqZWN0KGdmeFR5cGUpIHtcbiAgICAgICAgdGhpcy5fZ2Z4VHlwZSA9IEdGWE9iamVjdFR5cGUuVU5LTk9XTjtcbiAgICAgICAgdGhpcy5fc3RhdHVzID0gR0ZYU3RhdHVzLlVOUkVBRFk7XG4gICAgICAgIHRoaXMuX2dmeFR5cGUgPSBnZnhUeXBlO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoR0ZYT2JqZWN0LnByb3RvdHlwZSwgXCJnZnhUeXBlXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2Z4VHlwZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEdGWE9iamVjdC5wcm90b3R5cGUsIFwic3RhdHVzXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdHVzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gR0ZYT2JqZWN0O1xufSgpKTtcbnZhciBHRlhBdHRyaWJ1dGVOYW1lO1xuKGZ1bmN0aW9uIChHRlhBdHRyaWJ1dGVOYW1lKSB7XG4gICAgR0ZYQXR0cmlidXRlTmFtZVtcIkFUVFJfUE9TSVRJT05cIl0gPSBcImFfcG9zaXRpb25cIjtcbiAgICBHRlhBdHRyaWJ1dGVOYW1lW1wiQVRUUl9OT1JNQUxcIl0gPSBcImFfbm9ybWFsXCI7XG4gICAgR0ZYQXR0cmlidXRlTmFtZVtcIkFUVFJfVEFOR0VOVFwiXSA9IFwiYV90YW5nZW50XCI7XG4gICAgR0ZYQXR0cmlidXRlTmFtZVtcIkFUVFJfQklUQU5HRU5UXCJdID0gXCJhX2JpdGFuZ2VudFwiO1xuICAgIEdGWEF0dHJpYnV0ZU5hbWVbXCJBVFRSX1dFSUdIVFNcIl0gPSBcImFfd2VpZ2h0c1wiO1xuICAgIEdGWEF0dHJpYnV0ZU5hbWVbXCJBVFRSX0pPSU5UU1wiXSA9IFwiYV9qb2ludHNcIjtcbiAgICBHRlhBdHRyaWJ1dGVOYW1lW1wiQVRUUl9DT0xPUlwiXSA9IFwiYV9jb2xvclwiO1xuICAgIEdGWEF0dHJpYnV0ZU5hbWVbXCJBVFRSX0NPTE9SMVwiXSA9IFwiYV9jb2xvcjFcIjtcbiAgICBHRlhBdHRyaWJ1dGVOYW1lW1wiQVRUUl9DT0xPUjJcIl0gPSBcImFfY29sb3IyXCI7XG4gICAgR0ZYQXR0cmlidXRlTmFtZVtcIkFUVFJfVEVYX0NPT1JEXCJdID0gXCJhX3RleENvb3JkXCI7XG4gICAgR0ZYQXR0cmlidXRlTmFtZVtcIkFUVFJfVEVYX0NPT1JEMVwiXSA9IFwiYV90ZXhDb29yZDFcIjtcbiAgICBHRlhBdHRyaWJ1dGVOYW1lW1wiQVRUUl9URVhfQ09PUkQyXCJdID0gXCJhX3RleENvb3JkMlwiO1xuICAgIEdGWEF0dHJpYnV0ZU5hbWVbXCJBVFRSX1RFWF9DT09SRDNcIl0gPSBcImFfdGV4Q29vcmQzXCI7XG4gICAgR0ZYQXR0cmlidXRlTmFtZVtcIkFUVFJfVEVYX0NPT1JENFwiXSA9IFwiYV90ZXhDb29yZDRcIjtcbiAgICBHRlhBdHRyaWJ1dGVOYW1lW1wiQVRUUl9URVhfQ09PUkQ1XCJdID0gXCJhX3RleENvb3JkNVwiO1xuICAgIEdGWEF0dHJpYnV0ZU5hbWVbXCJBVFRSX1RFWF9DT09SRDZcIl0gPSBcImFfdGV4Q29vcmQ2XCI7XG4gICAgR0ZYQXR0cmlidXRlTmFtZVtcIkFUVFJfVEVYX0NPT1JEN1wiXSA9IFwiYV90ZXhDb29yZDdcIjtcbiAgICBHRlhBdHRyaWJ1dGVOYW1lW1wiQVRUUl9URVhfQ09PUkQ4XCJdID0gXCJhX3RleENvb3JkOFwiO1xufSkoR0ZYQXR0cmlidXRlTmFtZSB8fCAoR0ZYQXR0cmlidXRlTmFtZSA9IHt9KSk7XG52YXIgR0ZYVHlwZTtcbihmdW5jdGlvbiAoR0ZYVHlwZSkge1xuICAgIEdGWFR5cGVbR0ZYVHlwZVtcIlVOS05PV05cIl0gPSAwXSA9IFwiVU5LTk9XTlwiO1xuICAgIEdGWFR5cGVbR0ZYVHlwZVtcIkJPT0xcIl0gPSAxXSA9IFwiQk9PTFwiO1xuICAgIEdGWFR5cGVbR0ZYVHlwZVtcIkJPT0wyXCJdID0gMl0gPSBcIkJPT0wyXCI7XG4gICAgR0ZYVHlwZVtHRlhUeXBlW1wiQk9PTDNcIl0gPSAzXSA9IFwiQk9PTDNcIjtcbiAgICBHRlhUeXBlW0dGWFR5cGVbXCJCT09MNFwiXSA9IDRdID0gXCJCT09MNFwiO1xuICAgIEdGWFR5cGVbR0ZYVHlwZVtcIklOVFwiXSA9IDVdID0gXCJJTlRcIjtcbiAgICBHRlhUeXBlW0dGWFR5cGVbXCJJTlQyXCJdID0gNl0gPSBcIklOVDJcIjtcbiAgICBHRlhUeXBlW0dGWFR5cGVbXCJJTlQzXCJdID0gN10gPSBcIklOVDNcIjtcbiAgICBHRlhUeXBlW0dGWFR5cGVbXCJJTlQ0XCJdID0gOF0gPSBcIklOVDRcIjtcbiAgICBHRlhUeXBlW0dGWFR5cGVbXCJVSU5UXCJdID0gOV0gPSBcIlVJTlRcIjtcbiAgICBHRlhUeXBlW0dGWFR5cGVbXCJVSU5UMlwiXSA9IDEwXSA9IFwiVUlOVDJcIjtcbiAgICBHRlhUeXBlW0dGWFR5cGVbXCJVSU5UM1wiXSA9IDExXSA9IFwiVUlOVDNcIjtcbiAgICBHRlhUeXBlW0dGWFR5cGVbXCJVSU5UNFwiXSA9IDEyXSA9IFwiVUlOVDRcIjtcbiAgICBHRlhUeXBlW0dGWFR5cGVbXCJGTE9BVFwiXSA9IDEzXSA9IFwiRkxPQVRcIjtcbiAgICBHRlhUeXBlW0dGWFR5cGVbXCJGTE9BVDJcIl0gPSAxNF0gPSBcIkZMT0FUMlwiO1xuICAgIEdGWFR5cGVbR0ZYVHlwZVtcIkZMT0FUM1wiXSA9IDE1XSA9IFwiRkxPQVQzXCI7XG4gICAgR0ZYVHlwZVtHRlhUeXBlW1wiRkxPQVQ0XCJdID0gMTZdID0gXCJGTE9BVDRcIjtcbiAgICBHRlhUeXBlW0dGWFR5cGVbXCJDT0xPUjRcIl0gPSAxN10gPSBcIkNPTE9SNFwiO1xuICAgIEdGWFR5cGVbR0ZYVHlwZVtcIk1BVDJcIl0gPSAxOF0gPSBcIk1BVDJcIjtcbiAgICBHRlhUeXBlW0dGWFR5cGVbXCJNQVQyWDNcIl0gPSAxOV0gPSBcIk1BVDJYM1wiO1xuICAgIEdGWFR5cGVbR0ZYVHlwZVtcIk1BVDJYNFwiXSA9IDIwXSA9IFwiTUFUMlg0XCI7XG4gICAgR0ZYVHlwZVtHRlhUeXBlW1wiTUFUM1gyXCJdID0gMjFdID0gXCJNQVQzWDJcIjtcbiAgICBHRlhUeXBlW0dGWFR5cGVbXCJNQVQzXCJdID0gMjJdID0gXCJNQVQzXCI7XG4gICAgR0ZYVHlwZVtHRlhUeXBlW1wiTUFUM1g0XCJdID0gMjNdID0gXCJNQVQzWDRcIjtcbiAgICBHRlhUeXBlW0dGWFR5cGVbXCJNQVQ0WDJcIl0gPSAyNF0gPSBcIk1BVDRYMlwiO1xuICAgIEdGWFR5cGVbR0ZYVHlwZVtcIk1BVDRYM1wiXSA9IDI1XSA9IFwiTUFUNFgzXCI7XG4gICAgR0ZYVHlwZVtHRlhUeXBlW1wiTUFUNFwiXSA9IDI2XSA9IFwiTUFUNFwiO1xuICAgIEdGWFR5cGVbR0ZYVHlwZVtcIlNBTVBMRVIxRFwiXSA9IDI3XSA9IFwiU0FNUExFUjFEXCI7XG4gICAgR0ZYVHlwZVtHRlhUeXBlW1wiU0FNUExFUjFEX0FSUkFZXCJdID0gMjhdID0gXCJTQU1QTEVSMURfQVJSQVlcIjtcbiAgICBHRlhUeXBlW0dGWFR5cGVbXCJTQU1QTEVSMkRcIl0gPSAyOV0gPSBcIlNBTVBMRVIyRFwiO1xuICAgIEdGWFR5cGVbR0ZYVHlwZVtcIlNBTVBMRVIyRF9BUlJBWVwiXSA9IDMwXSA9IFwiU0FNUExFUjJEX0FSUkFZXCI7XG4gICAgR0ZYVHlwZVtHRlhUeXBlW1wiU0FNUExFUjNEXCJdID0gMzFdID0gXCJTQU1QTEVSM0RcIjtcbiAgICBHRlhUeXBlW0dGWFR5cGVbXCJTQU1QTEVSX0NVQkVcIl0gPSAzMl0gPSBcIlNBTVBMRVJfQ1VCRVwiO1xuICAgIEdGWFR5cGVbR0ZYVHlwZVtcIkNPVU5UXCJdID0gMzNdID0gXCJDT1VOVFwiO1xufSkoR0ZYVHlwZSB8fCAoR0ZYVHlwZSA9IHt9KSk7XG52YXIgR0ZYRm9ybWF0O1xuKGZ1bmN0aW9uIChHRlhGb3JtYXQpIHtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiVU5LTk9XTlwiXSA9IDBdID0gXCJVTktOT1dOXCI7XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIkE4XCJdID0gMV0gPSBcIkE4XCI7XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIkw4XCJdID0gMl0gPSBcIkw4XCI7XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIkxBOFwiXSA9IDNdID0gXCJMQThcIjtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiUjhcIl0gPSA0XSA9IFwiUjhcIjtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiUjhTTlwiXSA9IDVdID0gXCJSOFNOXCI7XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIlI4VUlcIl0gPSA2XSA9IFwiUjhVSVwiO1xuICAgIEdGWEZvcm1hdFtHRlhGb3JtYXRbXCJSOElcIl0gPSA3XSA9IFwiUjhJXCI7XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIlIxNkZcIl0gPSA4XSA9IFwiUjE2RlwiO1xuICAgIEdGWEZvcm1hdFtHRlhGb3JtYXRbXCJSMTZVSVwiXSA9IDldID0gXCJSMTZVSVwiO1xuICAgIEdGWEZvcm1hdFtHRlhGb3JtYXRbXCJSMTZJXCJdID0gMTBdID0gXCJSMTZJXCI7XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIlIzMkZcIl0gPSAxMV0gPSBcIlIzMkZcIjtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiUjMyVUlcIl0gPSAxMl0gPSBcIlIzMlVJXCI7XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIlIzMklcIl0gPSAxM10gPSBcIlIzMklcIjtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiUkc4XCJdID0gMTRdID0gXCJSRzhcIjtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiUkc4U05cIl0gPSAxNV0gPSBcIlJHOFNOXCI7XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIlJHOFVJXCJdID0gMTZdID0gXCJSRzhVSVwiO1xuICAgIEdGWEZvcm1hdFtHRlhGb3JtYXRbXCJSRzhJXCJdID0gMTddID0gXCJSRzhJXCI7XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIlJHMTZGXCJdID0gMThdID0gXCJSRzE2RlwiO1xuICAgIEdGWEZvcm1hdFtHRlhGb3JtYXRbXCJSRzE2VUlcIl0gPSAxOV0gPSBcIlJHMTZVSVwiO1xuICAgIEdGWEZvcm1hdFtHRlhGb3JtYXRbXCJSRzE2SVwiXSA9IDIwXSA9IFwiUkcxNklcIjtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiUkczMkZcIl0gPSAyMV0gPSBcIlJHMzJGXCI7XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIlJHMzJVSVwiXSA9IDIyXSA9IFwiUkczMlVJXCI7XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIlJHMzJJXCJdID0gMjNdID0gXCJSRzMySVwiO1xuICAgIEdGWEZvcm1hdFtHRlhGb3JtYXRbXCJSR0I4XCJdID0gMjRdID0gXCJSR0I4XCI7XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIlNSR0I4XCJdID0gMjVdID0gXCJTUkdCOFwiO1xuICAgIEdGWEZvcm1hdFtHRlhGb3JtYXRbXCJSR0I4U05cIl0gPSAyNl0gPSBcIlJHQjhTTlwiO1xuICAgIEdGWEZvcm1hdFtHRlhGb3JtYXRbXCJSR0I4VUlcIl0gPSAyN10gPSBcIlJHQjhVSVwiO1xuICAgIEdGWEZvcm1hdFtHRlhGb3JtYXRbXCJSR0I4SVwiXSA9IDI4XSA9IFwiUkdCOElcIjtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiUkdCMTZGXCJdID0gMjldID0gXCJSR0IxNkZcIjtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiUkdCMTZVSVwiXSA9IDMwXSA9IFwiUkdCMTZVSVwiO1xuICAgIEdGWEZvcm1hdFtHRlhGb3JtYXRbXCJSR0IxNklcIl0gPSAzMV0gPSBcIlJHQjE2SVwiO1xuICAgIEdGWEZvcm1hdFtHRlhGb3JtYXRbXCJSR0IzMkZcIl0gPSAzMl0gPSBcIlJHQjMyRlwiO1xuICAgIEdGWEZvcm1hdFtHRlhGb3JtYXRbXCJSR0IzMlVJXCJdID0gMzNdID0gXCJSR0IzMlVJXCI7XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIlJHQjMySVwiXSA9IDM0XSA9IFwiUkdCMzJJXCI7XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIlJHQkE4XCJdID0gMzVdID0gXCJSR0JBOFwiO1xuICAgIEdGWEZvcm1hdFtHRlhGb3JtYXRbXCJTUkdCOF9BOFwiXSA9IDM2XSA9IFwiU1JHQjhfQThcIjtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiUkdCQThTTlwiXSA9IDM3XSA9IFwiUkdCQThTTlwiO1xuICAgIEdGWEZvcm1hdFtHRlhGb3JtYXRbXCJSR0JBOFVJXCJdID0gMzhdID0gXCJSR0JBOFVJXCI7XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIlJHQkE4SVwiXSA9IDM5XSA9IFwiUkdCQThJXCI7XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIlJHQkExNkZcIl0gPSA0MF0gPSBcIlJHQkExNkZcIjtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiUkdCQTE2VUlcIl0gPSA0MV0gPSBcIlJHQkExNlVJXCI7XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIlJHQkExNklcIl0gPSA0Ml0gPSBcIlJHQkExNklcIjtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiUkdCQTMyRlwiXSA9IDQzXSA9IFwiUkdCQTMyRlwiO1xuICAgIEdGWEZvcm1hdFtHRlhGb3JtYXRbXCJSR0JBMzJVSVwiXSA9IDQ0XSA9IFwiUkdCQTMyVUlcIjtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiUkdCQTMySVwiXSA9IDQ1XSA9IFwiUkdCQTMySVwiO1xuICAgIC8vIFNwZWNpYWwgRm9ybWF0XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIlI1RzZCNVwiXSA9IDQ2XSA9IFwiUjVHNkI1XCI7XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIlIxMUcxMUIxMEZcIl0gPSA0N10gPSBcIlIxMUcxMUIxMEZcIjtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiUkdCNUExXCJdID0gNDhdID0gXCJSR0I1QTFcIjtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiUkdCQTRcIl0gPSA0OV0gPSBcIlJHQkE0XCI7XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIlJHQjEwQTJcIl0gPSA1MF0gPSBcIlJHQjEwQTJcIjtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiUkdCMTBBMlVJXCJdID0gNTFdID0gXCJSR0IxMEEyVUlcIjtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiUkdCOUU1XCJdID0gNTJdID0gXCJSR0I5RTVcIjtcbiAgICAvLyBEZXB0aC1TdGVuY2lsIEZvcm1hdFxuICAgIEdGWEZvcm1hdFtHRlhGb3JtYXRbXCJEMTZcIl0gPSA1M10gPSBcIkQxNlwiO1xuICAgIEdGWEZvcm1hdFtHRlhGb3JtYXRbXCJEMTZTOFwiXSA9IDU0XSA9IFwiRDE2UzhcIjtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiRDI0XCJdID0gNTVdID0gXCJEMjRcIjtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiRDI0UzhcIl0gPSA1Nl0gPSBcIkQyNFM4XCI7XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIkQzMkZcIl0gPSA1N10gPSBcIkQzMkZcIjtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiRDMyRl9TOFwiXSA9IDU4XSA9IFwiRDMyRl9TOFwiO1xuICAgIC8vIENvbXByZXNzZWQgRm9ybWF0XG4gICAgLy8gQmxvY2sgQ29tcHJlc3Npb24gRm9ybWF0LCBERFMgKERpcmVjdERyYXcgU3VyZmFjZSlcbiAgICAvLyBEWFQxOiAzIGNoYW5uZWxzICg1OjY6NSksIDEvOCBvcmlnaWFubCBzaXplLCB3aXRoIDAgb3IgMSBiaXQgb2YgYWxwaGFcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiQkMxXCJdID0gNTldID0gXCJCQzFcIjtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiQkMxX0FMUEhBXCJdID0gNjBdID0gXCJCQzFfQUxQSEFcIjtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiQkMxX1NSR0JcIl0gPSA2MV0gPSBcIkJDMV9TUkdCXCI7XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIkJDMV9TUkdCX0FMUEhBXCJdID0gNjJdID0gXCJCQzFfU1JHQl9BTFBIQVwiO1xuICAgIC8vIERYVDM6IDQgY2hhbm5lbHMgKDU6Njo1KSwgMS80IG9yaWdpYW5sIHNpemUsIHdpdGggNCBiaXRzIG9mIGFscGhhXG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIkJDMlwiXSA9IDYzXSA9IFwiQkMyXCI7XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIkJDMl9TUkdCXCJdID0gNjRdID0gXCJCQzJfU1JHQlwiO1xuICAgIC8vIERYVDU6IDQgY2hhbm5lbHMgKDU6Njo1KSwgMS80IG9yaWdpYW5sIHNpemUsIHdpdGggOCBiaXRzIG9mIGFscGhhXG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIkJDM1wiXSA9IDY1XSA9IFwiQkMzXCI7XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIkJDM19TUkdCXCJdID0gNjZdID0gXCJCQzNfU1JHQlwiO1xuICAgIC8vIDEgY2hhbm5lbCAoOCksIDEvNCBvcmlnaWFubCBzaXplXG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIkJDNFwiXSA9IDY3XSA9IFwiQkM0XCI7XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIkJDNF9TTk9STVwiXSA9IDY4XSA9IFwiQkM0X1NOT1JNXCI7XG4gICAgLy8gMiBjaGFubmVscyAoODo4KSwgMS8yIG9yaWdpYW5sIHNpemVcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiQkM1XCJdID0gNjldID0gXCJCQzVcIjtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiQkM1X1NOT1JNXCJdID0gNzBdID0gXCJCQzVfU05PUk1cIjtcbiAgICAvLyAzIGNoYW5uZWxzICgxNjoxNjoxNiksIGhhbGYtZmxvYXRpbmcgcG9pbnQsIDEvNiBvcmlnaWFubCBzaXplXG4gICAgLy8gVUYxNjogdW5zaWduZWQgZmxvYXQsIDUgZXhwb25lbnQgYml0cyArIDExIG1hbnRpc3NhIGJpdHNcbiAgICAvLyBTRjE2OiBzaWduZWQgZmxvYXQsIDEgc2lnbmVkIGJpdCArIDUgZXhwb25lbnQgYml0cyArIDEwIG1hbnRpc3NhIGJpdHNcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiQkM2SF9VRjE2XCJdID0gNzFdID0gXCJCQzZIX1VGMTZcIjtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiQkM2SF9TRjE2XCJdID0gNzJdID0gXCJCQzZIX1NGMTZcIjtcbiAgICAvLyA0IGNoYW5uZWxzICg0fjcgYml0cyBwZXIgY2hhbm5lbCkgd2l0aCAwIHRvIDggYml0cyBvZiBhbHBoYSwgMS8zIG9yaWdpbmFsIHNpemVcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiQkM3XCJdID0gNzNdID0gXCJCQzdcIjtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiQkM3X1NSR0JcIl0gPSA3NF0gPSBcIkJDN19TUkdCXCI7XG4gICAgLy8gRXJpY3Nzb24gVGV4dHVyZSBDb21wcmVzc2lvbiBGb3JtYXRcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiRVRDX1JHQjhcIl0gPSA3NV0gPSBcIkVUQ19SR0I4XCI7XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIkVUQzJfUkdCOFwiXSA9IDc2XSA9IFwiRVRDMl9SR0I4XCI7XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIkVUQzJfU1JHQjhcIl0gPSA3N10gPSBcIkVUQzJfU1JHQjhcIjtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiRVRDMl9SR0I4X0ExXCJdID0gNzhdID0gXCJFVEMyX1JHQjhfQTFcIjtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiRVRDMl9TUkdCOF9BMVwiXSA9IDc5XSA9IFwiRVRDMl9TUkdCOF9BMVwiO1xuICAgIEdGWEZvcm1hdFtHRlhGb3JtYXRbXCJFVEMyX1JHQkE4XCJdID0gODBdID0gXCJFVEMyX1JHQkE4XCI7XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIkVUQzJfU1JHQjhfQThcIl0gPSA4MV0gPSBcIkVUQzJfU1JHQjhfQThcIjtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiRUFDX1IxMVwiXSA9IDgyXSA9IFwiRUFDX1IxMVwiO1xuICAgIEdGWEZvcm1hdFtHRlhGb3JtYXRbXCJFQUNfUjExU05cIl0gPSA4M10gPSBcIkVBQ19SMTFTTlwiO1xuICAgIEdGWEZvcm1hdFtHRlhGb3JtYXRbXCJFQUNfUkcxMVwiXSA9IDg0XSA9IFwiRUFDX1JHMTFcIjtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiRUFDX1JHMTFTTlwiXSA9IDg1XSA9IFwiRUFDX1JHMTFTTlwiO1xuICAgIC8vIFBWUlRDIChQb3dlclZSKVxuICAgIEdGWEZvcm1hdFtHRlhGb3JtYXRbXCJQVlJUQ19SR0IyXCJdID0gODZdID0gXCJQVlJUQ19SR0IyXCI7XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIlBWUlRDX1JHQkEyXCJdID0gODddID0gXCJQVlJUQ19SR0JBMlwiO1xuICAgIEdGWEZvcm1hdFtHRlhGb3JtYXRbXCJQVlJUQ19SR0I0XCJdID0gODhdID0gXCJQVlJUQ19SR0I0XCI7XG4gICAgR0ZYRm9ybWF0W0dGWEZvcm1hdFtcIlBWUlRDX1JHQkE0XCJdID0gODldID0gXCJQVlJUQ19SR0JBNFwiO1xuICAgIEdGWEZvcm1hdFtHRlhGb3JtYXRbXCJQVlJUQzJfMkJQUFwiXSA9IDkwXSA9IFwiUFZSVEMyXzJCUFBcIjtcbiAgICBHRlhGb3JtYXRbR0ZYRm9ybWF0W1wiUFZSVEMyXzRCUFBcIl0gPSA5MV0gPSBcIlBWUlRDMl80QlBQXCI7XG59KShHRlhGb3JtYXQgfHwgKEdGWEZvcm1hdCA9IHt9KSk7XG52YXIgR0ZYQnVmZmVyVXNhZ2VCaXQ7XG4oZnVuY3Rpb24gKEdGWEJ1ZmZlclVzYWdlQml0KSB7XG4gICAgR0ZYQnVmZmVyVXNhZ2VCaXRbR0ZYQnVmZmVyVXNhZ2VCaXRbXCJOT05FXCJdID0gMF0gPSBcIk5PTkVcIjtcbiAgICBHRlhCdWZmZXJVc2FnZUJpdFtHRlhCdWZmZXJVc2FnZUJpdFtcIlRSQU5TRkVSX1NSQ1wiXSA9IDFdID0gXCJUUkFOU0ZFUl9TUkNcIjtcbiAgICBHRlhCdWZmZXJVc2FnZUJpdFtHRlhCdWZmZXJVc2FnZUJpdFtcIlRSQU5TRkVSX0RTVFwiXSA9IDJdID0gXCJUUkFOU0ZFUl9EU1RcIjtcbiAgICBHRlhCdWZmZXJVc2FnZUJpdFtHRlhCdWZmZXJVc2FnZUJpdFtcIklOREVYXCJdID0gNF0gPSBcIklOREVYXCI7XG4gICAgR0ZYQnVmZmVyVXNhZ2VCaXRbR0ZYQnVmZmVyVXNhZ2VCaXRbXCJWRVJURVhcIl0gPSA4XSA9IFwiVkVSVEVYXCI7XG4gICAgR0ZYQnVmZmVyVXNhZ2VCaXRbR0ZYQnVmZmVyVXNhZ2VCaXRbXCJVTklGT1JNXCJdID0gMTZdID0gXCJVTklGT1JNXCI7XG4gICAgR0ZYQnVmZmVyVXNhZ2VCaXRbR0ZYQnVmZmVyVXNhZ2VCaXRbXCJTVE9SQUdFXCJdID0gMzJdID0gXCJTVE9SQUdFXCI7XG4gICAgR0ZYQnVmZmVyVXNhZ2VCaXRbR0ZYQnVmZmVyVXNhZ2VCaXRbXCJJTkRJUkVDVFwiXSA9IDY0XSA9IFwiSU5ESVJFQ1RcIjtcbn0pKEdGWEJ1ZmZlclVzYWdlQml0IHx8IChHRlhCdWZmZXJVc2FnZUJpdCA9IHt9KSk7XG52YXIgR0ZYTWVtb3J5VXNhZ2VCaXQ7XG4oZnVuY3Rpb24gKEdGWE1lbW9yeVVzYWdlQml0KSB7XG4gICAgR0ZYTWVtb3J5VXNhZ2VCaXRbR0ZYTWVtb3J5VXNhZ2VCaXRbXCJOT05FXCJdID0gMF0gPSBcIk5PTkVcIjtcbiAgICBHRlhNZW1vcnlVc2FnZUJpdFtHRlhNZW1vcnlVc2FnZUJpdFtcIkRFVklDRVwiXSA9IDFdID0gXCJERVZJQ0VcIjtcbiAgICBHRlhNZW1vcnlVc2FnZUJpdFtHRlhNZW1vcnlVc2FnZUJpdFtcIkhPU1RcIl0gPSAyXSA9IFwiSE9TVFwiO1xufSkoR0ZYTWVtb3J5VXNhZ2VCaXQgfHwgKEdGWE1lbW9yeVVzYWdlQml0ID0ge30pKTtcbnZhciBHRlhCdWZmZXJBY2Nlc3NCaXQ7XG4oZnVuY3Rpb24gKEdGWEJ1ZmZlckFjY2Vzc0JpdCkge1xuICAgIEdGWEJ1ZmZlckFjY2Vzc0JpdFtHRlhCdWZmZXJBY2Nlc3NCaXRbXCJOT05FXCJdID0gMF0gPSBcIk5PTkVcIjtcbiAgICBHRlhCdWZmZXJBY2Nlc3NCaXRbR0ZYQnVmZmVyQWNjZXNzQml0W1wiUkVBRFwiXSA9IDFdID0gXCJSRUFEXCI7XG4gICAgR0ZYQnVmZmVyQWNjZXNzQml0W0dGWEJ1ZmZlckFjY2Vzc0JpdFtcIldSSVRFXCJdID0gMl0gPSBcIldSSVRFXCI7XG59KShHRlhCdWZmZXJBY2Nlc3NCaXQgfHwgKEdGWEJ1ZmZlckFjY2Vzc0JpdCA9IHt9KSk7XG52YXIgR0ZYUHJpbWl0aXZlTW9kZTtcbihmdW5jdGlvbiAoR0ZYUHJpbWl0aXZlTW9kZSkge1xuICAgIEdGWFByaW1pdGl2ZU1vZGVbR0ZYUHJpbWl0aXZlTW9kZVtcIlBPSU5UX0xJU1RcIl0gPSAwXSA9IFwiUE9JTlRfTElTVFwiO1xuICAgIEdGWFByaW1pdGl2ZU1vZGVbR0ZYUHJpbWl0aXZlTW9kZVtcIkxJTkVfTElTVFwiXSA9IDFdID0gXCJMSU5FX0xJU1RcIjtcbiAgICBHRlhQcmltaXRpdmVNb2RlW0dGWFByaW1pdGl2ZU1vZGVbXCJMSU5FX1NUUklQXCJdID0gMl0gPSBcIkxJTkVfU1RSSVBcIjtcbiAgICBHRlhQcmltaXRpdmVNb2RlW0dGWFByaW1pdGl2ZU1vZGVbXCJMSU5FX0xPT1BcIl0gPSAzXSA9IFwiTElORV9MT09QXCI7XG4gICAgR0ZYUHJpbWl0aXZlTW9kZVtHRlhQcmltaXRpdmVNb2RlW1wiTElORV9MSVNUX0FESkFDRU5DWVwiXSA9IDRdID0gXCJMSU5FX0xJU1RfQURKQUNFTkNZXCI7XG4gICAgR0ZYUHJpbWl0aXZlTW9kZVtHRlhQcmltaXRpdmVNb2RlW1wiTElORV9TVFJJUF9BREpBQ0VOQ1lcIl0gPSA1XSA9IFwiTElORV9TVFJJUF9BREpBQ0VOQ1lcIjtcbiAgICBHRlhQcmltaXRpdmVNb2RlW0dGWFByaW1pdGl2ZU1vZGVbXCJJU09fTElORV9MSVNUXCJdID0gNl0gPSBcIklTT19MSU5FX0xJU1RcIjtcbiAgICAvLyByYXljYXN0IGRldGVjdGFibGU6XG4gICAgR0ZYUHJpbWl0aXZlTW9kZVtHRlhQcmltaXRpdmVNb2RlW1wiVFJJQU5HTEVfTElTVFwiXSA9IDddID0gXCJUUklBTkdMRV9MSVNUXCI7XG4gICAgR0ZYUHJpbWl0aXZlTW9kZVtHRlhQcmltaXRpdmVNb2RlW1wiVFJJQU5HTEVfU1RSSVBcIl0gPSA4XSA9IFwiVFJJQU5HTEVfU1RSSVBcIjtcbiAgICBHRlhQcmltaXRpdmVNb2RlW0dGWFByaW1pdGl2ZU1vZGVbXCJUUklBTkdMRV9GQU5cIl0gPSA5XSA9IFwiVFJJQU5HTEVfRkFOXCI7XG4gICAgR0ZYUHJpbWl0aXZlTW9kZVtHRlhQcmltaXRpdmVNb2RlW1wiVFJJQU5HTEVfTElTVF9BREpBQ0VOQ1lcIl0gPSAxMF0gPSBcIlRSSUFOR0xFX0xJU1RfQURKQUNFTkNZXCI7XG4gICAgR0ZYUHJpbWl0aXZlTW9kZVtHRlhQcmltaXRpdmVNb2RlW1wiVFJJQU5HTEVfU1RSSVBfQURKQUNFTkNZXCJdID0gMTFdID0gXCJUUklBTkdMRV9TVFJJUF9BREpBQ0VOQ1lcIjtcbiAgICBHRlhQcmltaXRpdmVNb2RlW0dGWFByaW1pdGl2ZU1vZGVbXCJUUklBTkdMRV9QQVRDSF9BREpBQ0VOQ1lcIl0gPSAxMl0gPSBcIlRSSUFOR0xFX1BBVENIX0FESkFDRU5DWVwiO1xuICAgIEdGWFByaW1pdGl2ZU1vZGVbR0ZYUHJpbWl0aXZlTW9kZVtcIlFVQURfUEFUQ0hfTElTVFwiXSA9IDEzXSA9IFwiUVVBRF9QQVRDSF9MSVNUXCI7XG59KShHRlhQcmltaXRpdmVNb2RlIHx8IChHRlhQcmltaXRpdmVNb2RlID0ge30pKTtcbnZhciBHRlhQb2x5Z29uTW9kZTtcbihmdW5jdGlvbiAoR0ZYUG9seWdvbk1vZGUpIHtcbiAgICBHRlhQb2x5Z29uTW9kZVtHRlhQb2x5Z29uTW9kZVtcIkZJTExcIl0gPSAwXSA9IFwiRklMTFwiO1xuICAgIEdGWFBvbHlnb25Nb2RlW0dGWFBvbHlnb25Nb2RlW1wiUE9JTlRcIl0gPSAxXSA9IFwiUE9JTlRcIjtcbiAgICBHRlhQb2x5Z29uTW9kZVtHRlhQb2x5Z29uTW9kZVtcIkxJTkVcIl0gPSAyXSA9IFwiTElORVwiO1xufSkoR0ZYUG9seWdvbk1vZGUgfHwgKEdGWFBvbHlnb25Nb2RlID0ge30pKTtcbnZhciBHRlhTaGFkZU1vZGVsO1xuKGZ1bmN0aW9uIChHRlhTaGFkZU1vZGVsKSB7XG4gICAgR0ZYU2hhZGVNb2RlbFtHRlhTaGFkZU1vZGVsW1wiR09VUkFORFwiXSA9IDBdID0gXCJHT1VSQU5EXCI7XG4gICAgR0ZYU2hhZGVNb2RlbFtHRlhTaGFkZU1vZGVsW1wiRkxBVFwiXSA9IDFdID0gXCJGTEFUXCI7XG59KShHRlhTaGFkZU1vZGVsIHx8IChHRlhTaGFkZU1vZGVsID0ge30pKTtcbnZhciBHRlhDdWxsTW9kZTtcbihmdW5jdGlvbiAoR0ZYQ3VsbE1vZGUpIHtcbiAgICBHRlhDdWxsTW9kZVtHRlhDdWxsTW9kZVtcIk5PTkVcIl0gPSAwXSA9IFwiTk9ORVwiO1xuICAgIEdGWEN1bGxNb2RlW0dGWEN1bGxNb2RlW1wiRlJPTlRcIl0gPSAxXSA9IFwiRlJPTlRcIjtcbiAgICBHRlhDdWxsTW9kZVtHRlhDdWxsTW9kZVtcIkJBQ0tcIl0gPSAyXSA9IFwiQkFDS1wiO1xufSkoR0ZYQ3VsbE1vZGUgfHwgKEdGWEN1bGxNb2RlID0ge30pKTtcbnZhciBHRlhDb21wYXJpc29uRnVuYztcbihmdW5jdGlvbiAoR0ZYQ29tcGFyaXNvbkZ1bmMpIHtcbiAgICBHRlhDb21wYXJpc29uRnVuY1tHRlhDb21wYXJpc29uRnVuY1tcIk5FVkVSXCJdID0gMF0gPSBcIk5FVkVSXCI7XG4gICAgR0ZYQ29tcGFyaXNvbkZ1bmNbR0ZYQ29tcGFyaXNvbkZ1bmNbXCJMRVNTXCJdID0gMV0gPSBcIkxFU1NcIjtcbiAgICBHRlhDb21wYXJpc29uRnVuY1tHRlhDb21wYXJpc29uRnVuY1tcIkVRVUFMXCJdID0gMl0gPSBcIkVRVUFMXCI7XG4gICAgR0ZYQ29tcGFyaXNvbkZ1bmNbR0ZYQ29tcGFyaXNvbkZ1bmNbXCJMRVNTX0VRVUFMXCJdID0gM10gPSBcIkxFU1NfRVFVQUxcIjtcbiAgICBHRlhDb21wYXJpc29uRnVuY1tHRlhDb21wYXJpc29uRnVuY1tcIkdSRUFURVJcIl0gPSA0XSA9IFwiR1JFQVRFUlwiO1xuICAgIEdGWENvbXBhcmlzb25GdW5jW0dGWENvbXBhcmlzb25GdW5jW1wiTk9UX0VRVUFMXCJdID0gNV0gPSBcIk5PVF9FUVVBTFwiO1xuICAgIEdGWENvbXBhcmlzb25GdW5jW0dGWENvbXBhcmlzb25GdW5jW1wiR1JFQVRFUl9FUVVBTFwiXSA9IDZdID0gXCJHUkVBVEVSX0VRVUFMXCI7XG4gICAgR0ZYQ29tcGFyaXNvbkZ1bmNbR0ZYQ29tcGFyaXNvbkZ1bmNbXCJBTFdBWVNcIl0gPSA3XSA9IFwiQUxXQVlTXCI7XG59KShHRlhDb21wYXJpc29uRnVuYyB8fCAoR0ZYQ29tcGFyaXNvbkZ1bmMgPSB7fSkpO1xudmFyIEdGWFN0ZW5jaWxPcDtcbihmdW5jdGlvbiAoR0ZYU3RlbmNpbE9wKSB7XG4gICAgR0ZYU3RlbmNpbE9wW0dGWFN0ZW5jaWxPcFtcIlpFUk9cIl0gPSAwXSA9IFwiWkVST1wiO1xuICAgIEdGWFN0ZW5jaWxPcFtHRlhTdGVuY2lsT3BbXCJLRUVQXCJdID0gMV0gPSBcIktFRVBcIjtcbiAgICBHRlhTdGVuY2lsT3BbR0ZYU3RlbmNpbE9wW1wiUkVQTEFDRVwiXSA9IDJdID0gXCJSRVBMQUNFXCI7XG4gICAgR0ZYU3RlbmNpbE9wW0dGWFN0ZW5jaWxPcFtcIklOQ1JcIl0gPSAzXSA9IFwiSU5DUlwiO1xuICAgIEdGWFN0ZW5jaWxPcFtHRlhTdGVuY2lsT3BbXCJERUNSXCJdID0gNF0gPSBcIkRFQ1JcIjtcbiAgICBHRlhTdGVuY2lsT3BbR0ZYU3RlbmNpbE9wW1wiSU5WRVJUXCJdID0gNV0gPSBcIklOVkVSVFwiO1xuICAgIEdGWFN0ZW5jaWxPcFtHRlhTdGVuY2lsT3BbXCJJTkNSX1dSQVBcIl0gPSA2XSA9IFwiSU5DUl9XUkFQXCI7XG4gICAgR0ZYU3RlbmNpbE9wW0dGWFN0ZW5jaWxPcFtcIkRFQ1JfV1JBUFwiXSA9IDddID0gXCJERUNSX1dSQVBcIjtcbn0pKEdGWFN0ZW5jaWxPcCB8fCAoR0ZYU3RlbmNpbE9wID0ge30pKTtcbnZhciBHRlhCbGVuZE9wO1xuKGZ1bmN0aW9uIChHRlhCbGVuZE9wKSB7XG4gICAgR0ZYQmxlbmRPcFtHRlhCbGVuZE9wW1wiQUREXCJdID0gMF0gPSBcIkFERFwiO1xuICAgIEdGWEJsZW5kT3BbR0ZYQmxlbmRPcFtcIlNVQlwiXSA9IDFdID0gXCJTVUJcIjtcbiAgICBHRlhCbGVuZE9wW0dGWEJsZW5kT3BbXCJSRVZfU1VCXCJdID0gMl0gPSBcIlJFVl9TVUJcIjtcbiAgICBHRlhCbGVuZE9wW0dGWEJsZW5kT3BbXCJNSU5cIl0gPSAzXSA9IFwiTUlOXCI7XG4gICAgR0ZYQmxlbmRPcFtHRlhCbGVuZE9wW1wiTUFYXCJdID0gNF0gPSBcIk1BWFwiO1xufSkoR0ZYQmxlbmRPcCB8fCAoR0ZYQmxlbmRPcCA9IHt9KSk7XG52YXIgR0ZYQmxlbmRGYWN0b3I7XG4oZnVuY3Rpb24gKEdGWEJsZW5kRmFjdG9yKSB7XG4gICAgR0ZYQmxlbmRGYWN0b3JbR0ZYQmxlbmRGYWN0b3JbXCJaRVJPXCJdID0gMF0gPSBcIlpFUk9cIjtcbiAgICBHRlhCbGVuZEZhY3RvcltHRlhCbGVuZEZhY3RvcltcIk9ORVwiXSA9IDFdID0gXCJPTkVcIjtcbiAgICBHRlhCbGVuZEZhY3RvcltHRlhCbGVuZEZhY3RvcltcIlNSQ19BTFBIQVwiXSA9IDJdID0gXCJTUkNfQUxQSEFcIjtcbiAgICBHRlhCbGVuZEZhY3RvcltHRlhCbGVuZEZhY3RvcltcIkRTVF9BTFBIQVwiXSA9IDNdID0gXCJEU1RfQUxQSEFcIjtcbiAgICBHRlhCbGVuZEZhY3RvcltHRlhCbGVuZEZhY3RvcltcIk9ORV9NSU5VU19TUkNfQUxQSEFcIl0gPSA0XSA9IFwiT05FX01JTlVTX1NSQ19BTFBIQVwiO1xuICAgIEdGWEJsZW5kRmFjdG9yW0dGWEJsZW5kRmFjdG9yW1wiT05FX01JTlVTX0RTVF9BTFBIQVwiXSA9IDVdID0gXCJPTkVfTUlOVVNfRFNUX0FMUEhBXCI7XG4gICAgR0ZYQmxlbmRGYWN0b3JbR0ZYQmxlbmRGYWN0b3JbXCJTUkNfQ09MT1JcIl0gPSA2XSA9IFwiU1JDX0NPTE9SXCI7XG4gICAgR0ZYQmxlbmRGYWN0b3JbR0ZYQmxlbmRGYWN0b3JbXCJEU1RfQ09MT1JcIl0gPSA3XSA9IFwiRFNUX0NPTE9SXCI7XG4gICAgR0ZYQmxlbmRGYWN0b3JbR0ZYQmxlbmRGYWN0b3JbXCJPTkVfTUlOVVNfU1JDX0NPTE9SXCJdID0gOF0gPSBcIk9ORV9NSU5VU19TUkNfQ09MT1JcIjtcbiAgICBHRlhCbGVuZEZhY3RvcltHRlhCbGVuZEZhY3RvcltcIk9ORV9NSU5VU19EU1RfQ09MT1JcIl0gPSA5XSA9IFwiT05FX01JTlVTX0RTVF9DT0xPUlwiO1xuICAgIEdGWEJsZW5kRmFjdG9yW0dGWEJsZW5kRmFjdG9yW1wiU1JDX0FMUEhBX1NBVFVSQVRFXCJdID0gMTBdID0gXCJTUkNfQUxQSEFfU0FUVVJBVEVcIjtcbiAgICBHRlhCbGVuZEZhY3RvcltHRlhCbGVuZEZhY3RvcltcIkNPTlNUQU5UX0NPTE9SXCJdID0gMTFdID0gXCJDT05TVEFOVF9DT0xPUlwiO1xuICAgIEdGWEJsZW5kRmFjdG9yW0dGWEJsZW5kRmFjdG9yW1wiT05FX01JTlVTX0NPTlNUQU5UX0NPTE9SXCJdID0gMTJdID0gXCJPTkVfTUlOVVNfQ09OU1RBTlRfQ09MT1JcIjtcbiAgICBHRlhCbGVuZEZhY3RvcltHRlhCbGVuZEZhY3RvcltcIkNPTlNUQU5UX0FMUEhBXCJdID0gMTNdID0gXCJDT05TVEFOVF9BTFBIQVwiO1xuICAgIEdGWEJsZW5kRmFjdG9yW0dGWEJsZW5kRmFjdG9yW1wiT05FX01JTlVTX0NPTlNUQU5UX0FMUEhBXCJdID0gMTRdID0gXCJPTkVfTUlOVVNfQ09OU1RBTlRfQUxQSEFcIjtcbn0pKEdGWEJsZW5kRmFjdG9yIHx8IChHRlhCbGVuZEZhY3RvciA9IHt9KSk7XG52YXIgR0ZYQ29sb3JNYXNrO1xuKGZ1bmN0aW9uIChHRlhDb2xvck1hc2spIHtcbiAgICBHRlhDb2xvck1hc2tbR0ZYQ29sb3JNYXNrW1wiTk9ORVwiXSA9IDBdID0gXCJOT05FXCI7XG4gICAgR0ZYQ29sb3JNYXNrW0dGWENvbG9yTWFza1tcIlJcIl0gPSAxXSA9IFwiUlwiO1xuICAgIEdGWENvbG9yTWFza1tHRlhDb2xvck1hc2tbXCJHXCJdID0gMl0gPSBcIkdcIjtcbiAgICBHRlhDb2xvck1hc2tbR0ZYQ29sb3JNYXNrW1wiQlwiXSA9IDRdID0gXCJCXCI7XG4gICAgR0ZYQ29sb3JNYXNrW0dGWENvbG9yTWFza1tcIkFcIl0gPSA4XSA9IFwiQVwiO1xuICAgIEdGWENvbG9yTWFza1tHRlhDb2xvck1hc2tbXCJBTExcIl0gPSAxNV0gPSBcIkFMTFwiO1xufSkoR0ZYQ29sb3JNYXNrIHx8IChHRlhDb2xvck1hc2sgPSB7fSkpO1xudmFyIEdGWEZpbHRlcjtcbihmdW5jdGlvbiAoR0ZYRmlsdGVyKSB7XG4gICAgR0ZYRmlsdGVyW0dGWEZpbHRlcltcIk5PTkVcIl0gPSAwXSA9IFwiTk9ORVwiO1xuICAgIEdGWEZpbHRlcltHRlhGaWx0ZXJbXCJQT0lOVFwiXSA9IDFdID0gXCJQT0lOVFwiO1xuICAgIEdGWEZpbHRlcltHRlhGaWx0ZXJbXCJMSU5FQVJcIl0gPSAyXSA9IFwiTElORUFSXCI7XG4gICAgR0ZYRmlsdGVyW0dGWEZpbHRlcltcIkFOSVNPVFJPUElDXCJdID0gM10gPSBcIkFOSVNPVFJPUElDXCI7XG59KShHRlhGaWx0ZXIgfHwgKEdGWEZpbHRlciA9IHt9KSk7XG52YXIgR0ZYQWRkcmVzcztcbihmdW5jdGlvbiAoR0ZYQWRkcmVzcykge1xuICAgIEdGWEFkZHJlc3NbR0ZYQWRkcmVzc1tcIldSQVBcIl0gPSAwXSA9IFwiV1JBUFwiO1xuICAgIEdGWEFkZHJlc3NbR0ZYQWRkcmVzc1tcIk1JUlJPUlwiXSA9IDFdID0gXCJNSVJST1JcIjtcbiAgICBHRlhBZGRyZXNzW0dGWEFkZHJlc3NbXCJDTEFNUFwiXSA9IDJdID0gXCJDTEFNUFwiO1xuICAgIEdGWEFkZHJlc3NbR0ZYQWRkcmVzc1tcIkJPUkRFUlwiXSA9IDNdID0gXCJCT1JERVJcIjtcbn0pKEdGWEFkZHJlc3MgfHwgKEdGWEFkZHJlc3MgPSB7fSkpO1xudmFyIEdGWFRleHR1cmVUeXBlO1xuKGZ1bmN0aW9uIChHRlhUZXh0dXJlVHlwZSkge1xuICAgIEdGWFRleHR1cmVUeXBlW0dGWFRleHR1cmVUeXBlW1wiVEVYMURcIl0gPSAwXSA9IFwiVEVYMURcIjtcbiAgICBHRlhUZXh0dXJlVHlwZVtHRlhUZXh0dXJlVHlwZVtcIlRFWDJEXCJdID0gMV0gPSBcIlRFWDJEXCI7XG4gICAgR0ZYVGV4dHVyZVR5cGVbR0ZYVGV4dHVyZVR5cGVbXCJURVgzRFwiXSA9IDJdID0gXCJURVgzRFwiO1xufSkoR0ZYVGV4dHVyZVR5cGUgfHwgKEdGWFRleHR1cmVUeXBlID0ge30pKTtcbnZhciBHRlhUZXh0dXJlVXNhZ2VCaXQ7XG4oZnVuY3Rpb24gKEdGWFRleHR1cmVVc2FnZUJpdCkge1xuICAgIEdGWFRleHR1cmVVc2FnZUJpdFtHRlhUZXh0dXJlVXNhZ2VCaXRbXCJOT05FXCJdID0gMF0gPSBcIk5PTkVcIjtcbiAgICBHRlhUZXh0dXJlVXNhZ2VCaXRbR0ZYVGV4dHVyZVVzYWdlQml0W1wiVFJBTlNGRVJfU1JDXCJdID0gMV0gPSBcIlRSQU5TRkVSX1NSQ1wiO1xuICAgIEdGWFRleHR1cmVVc2FnZUJpdFtHRlhUZXh0dXJlVXNhZ2VCaXRbXCJUUkFOU0ZFUl9EU1RcIl0gPSAyXSA9IFwiVFJBTlNGRVJfRFNUXCI7XG4gICAgR0ZYVGV4dHVyZVVzYWdlQml0W0dGWFRleHR1cmVVc2FnZUJpdFtcIlNBTVBMRURcIl0gPSA0XSA9IFwiU0FNUExFRFwiO1xuICAgIEdGWFRleHR1cmVVc2FnZUJpdFtHRlhUZXh0dXJlVXNhZ2VCaXRbXCJTVE9SQUdFXCJdID0gOF0gPSBcIlNUT1JBR0VcIjtcbiAgICBHRlhUZXh0dXJlVXNhZ2VCaXRbR0ZYVGV4dHVyZVVzYWdlQml0W1wiQ09MT1JfQVRUQUNITUVOVFwiXSA9IDE2XSA9IFwiQ09MT1JfQVRUQUNITUVOVFwiO1xuICAgIEdGWFRleHR1cmVVc2FnZUJpdFtHRlhUZXh0dXJlVXNhZ2VCaXRbXCJERVBUSF9TVEVOQ0lMX0FUVEFDSE1FTlRcIl0gPSAzMl0gPSBcIkRFUFRIX1NURU5DSUxfQVRUQUNITUVOVFwiO1xuICAgIEdGWFRleHR1cmVVc2FnZUJpdFtHRlhUZXh0dXJlVXNhZ2VCaXRbXCJUUkFOU0lFTlRfQVRUQUNITUVOVFwiXSA9IDY0XSA9IFwiVFJBTlNJRU5UX0FUVEFDSE1FTlRcIjtcbiAgICBHRlhUZXh0dXJlVXNhZ2VCaXRbR0ZYVGV4dHVyZVVzYWdlQml0W1wiSU5QVVRfQVRUQUNITUVOVFwiXSA9IDEyOF0gPSBcIklOUFVUX0FUVEFDSE1FTlRcIjtcbn0pKEdGWFRleHR1cmVVc2FnZUJpdCB8fCAoR0ZYVGV4dHVyZVVzYWdlQml0ID0ge30pKTtcbnZhciBHRlhTYW1wbGVDb3VudDtcbihmdW5jdGlvbiAoR0ZYU2FtcGxlQ291bnQpIHtcbiAgICBHRlhTYW1wbGVDb3VudFtHRlhTYW1wbGVDb3VudFtcIlgxXCJdID0gMF0gPSBcIlgxXCI7XG4gICAgR0ZYU2FtcGxlQ291bnRbR0ZYU2FtcGxlQ291bnRbXCJYMlwiXSA9IDFdID0gXCJYMlwiO1xuICAgIEdGWFNhbXBsZUNvdW50W0dGWFNhbXBsZUNvdW50W1wiWDRcIl0gPSAyXSA9IFwiWDRcIjtcbiAgICBHRlhTYW1wbGVDb3VudFtHRlhTYW1wbGVDb3VudFtcIlg4XCJdID0gM10gPSBcIlg4XCI7XG4gICAgR0ZYU2FtcGxlQ291bnRbR0ZYU2FtcGxlQ291bnRbXCJYMTZcIl0gPSA0XSA9IFwiWDE2XCI7XG4gICAgR0ZYU2FtcGxlQ291bnRbR0ZYU2FtcGxlQ291bnRbXCJYMzJcIl0gPSA1XSA9IFwiWDMyXCI7XG4gICAgR0ZYU2FtcGxlQ291bnRbR0ZYU2FtcGxlQ291bnRbXCJYNjRcIl0gPSA2XSA9IFwiWDY0XCI7XG59KShHRlhTYW1wbGVDb3VudCB8fCAoR0ZYU2FtcGxlQ291bnQgPSB7fSkpO1xudmFyIEdGWFRleHR1cmVGbGFnQml0O1xuKGZ1bmN0aW9uIChHRlhUZXh0dXJlRmxhZ0JpdCkge1xuICAgIEdGWFRleHR1cmVGbGFnQml0W0dGWFRleHR1cmVGbGFnQml0W1wiTk9ORVwiXSA9IDBdID0gXCJOT05FXCI7XG4gICAgR0ZYVGV4dHVyZUZsYWdCaXRbR0ZYVGV4dHVyZUZsYWdCaXRbXCJHRU5fTUlQTUFQXCJdID0gMV0gPSBcIkdFTl9NSVBNQVBcIjtcbiAgICBHRlhUZXh0dXJlRmxhZ0JpdFtHRlhUZXh0dXJlRmxhZ0JpdFtcIkNVQkVNQVBcIl0gPSAyXSA9IFwiQ1VCRU1BUFwiO1xuICAgIEdGWFRleHR1cmVGbGFnQml0W0dGWFRleHR1cmVGbGFnQml0W1wiQkFLVVBfQlVGRkVSXCJdID0gNF0gPSBcIkJBS1VQX0JVRkZFUlwiO1xufSkoR0ZYVGV4dHVyZUZsYWdCaXQgfHwgKEdGWFRleHR1cmVGbGFnQml0ID0ge30pKTtcbnZhciBHRlhUZXh0dXJlVmlld1R5cGU7XG4oZnVuY3Rpb24gKEdGWFRleHR1cmVWaWV3VHlwZSkge1xuICAgIEdGWFRleHR1cmVWaWV3VHlwZVtHRlhUZXh0dXJlVmlld1R5cGVbXCJUVjFEXCJdID0gMF0gPSBcIlRWMURcIjtcbiAgICBHRlhUZXh0dXJlVmlld1R5cGVbR0ZYVGV4dHVyZVZpZXdUeXBlW1wiVFYyRFwiXSA9IDFdID0gXCJUVjJEXCI7XG4gICAgR0ZYVGV4dHVyZVZpZXdUeXBlW0dGWFRleHR1cmVWaWV3VHlwZVtcIlRWM0RcIl0gPSAyXSA9IFwiVFYzRFwiO1xuICAgIEdGWFRleHR1cmVWaWV3VHlwZVtHRlhUZXh0dXJlVmlld1R5cGVbXCJDVUJFXCJdID0gM10gPSBcIkNVQkVcIjtcbiAgICBHRlhUZXh0dXJlVmlld1R5cGVbR0ZYVGV4dHVyZVZpZXdUeXBlW1wiVFYxRF9BUlJBWVwiXSA9IDRdID0gXCJUVjFEX0FSUkFZXCI7XG4gICAgR0ZYVGV4dHVyZVZpZXdUeXBlW0dGWFRleHR1cmVWaWV3VHlwZVtcIlRWMkRfQVJSQVlcIl0gPSA1XSA9IFwiVFYyRF9BUlJBWVwiO1xufSkoR0ZYVGV4dHVyZVZpZXdUeXBlIHx8IChHRlhUZXh0dXJlVmlld1R5cGUgPSB7fSkpO1xudmFyIEdGWFNoYWRlclR5cGU7XG4oZnVuY3Rpb24gKEdGWFNoYWRlclR5cGUpIHtcbiAgICBHRlhTaGFkZXJUeXBlW0dGWFNoYWRlclR5cGVbXCJWRVJURVhcIl0gPSAwXSA9IFwiVkVSVEVYXCI7XG4gICAgR0ZYU2hhZGVyVHlwZVtHRlhTaGFkZXJUeXBlW1wiSFVMTFwiXSA9IDFdID0gXCJIVUxMXCI7XG4gICAgR0ZYU2hhZGVyVHlwZVtHRlhTaGFkZXJUeXBlW1wiRE9NQUlOXCJdID0gMl0gPSBcIkRPTUFJTlwiO1xuICAgIEdGWFNoYWRlclR5cGVbR0ZYU2hhZGVyVHlwZVtcIkdFT01FVFJZXCJdID0gM10gPSBcIkdFT01FVFJZXCI7XG4gICAgR0ZYU2hhZGVyVHlwZVtHRlhTaGFkZXJUeXBlW1wiRlJBR01FTlRcIl0gPSA0XSA9IFwiRlJBR01FTlRcIjtcbiAgICBHRlhTaGFkZXJUeXBlW0dGWFNoYWRlclR5cGVbXCJDT01QVVRFXCJdID0gNV0gPSBcIkNPTVBVVEVcIjtcbiAgICBHRlhTaGFkZXJUeXBlW0dGWFNoYWRlclR5cGVbXCJDT1VOVFwiXSA9IDZdID0gXCJDT1VOVFwiO1xufSkoR0ZYU2hhZGVyVHlwZSB8fCAoR0ZYU2hhZGVyVHlwZSA9IHt9KSk7XG52YXIgR0ZYQmluZGluZ1R5cGU7XG4oZnVuY3Rpb24gKEdGWEJpbmRpbmdUeXBlKSB7XG4gICAgR0ZYQmluZGluZ1R5cGVbR0ZYQmluZGluZ1R5cGVbXCJVTktOT1dOXCJdID0gMF0gPSBcIlVOS05PV05cIjtcbiAgICBHRlhCaW5kaW5nVHlwZVtHRlhCaW5kaW5nVHlwZVtcIlVOSUZPUk1fQlVGRkVSXCJdID0gMV0gPSBcIlVOSUZPUk1fQlVGRkVSXCI7XG4gICAgR0ZYQmluZGluZ1R5cGVbR0ZYQmluZGluZ1R5cGVbXCJTQU1QTEVSXCJdID0gMl0gPSBcIlNBTVBMRVJcIjtcbiAgICBHRlhCaW5kaW5nVHlwZVtHRlhCaW5kaW5nVHlwZVtcIlNUT1JBR0VfQlVGRkVSXCJdID0gM10gPSBcIlNUT1JBR0VfQlVGRkVSXCI7XG59KShHRlhCaW5kaW5nVHlwZSB8fCAoR0ZYQmluZGluZ1R5cGUgPSB7fSkpO1xudmFyIEdGWENvbW1hbmRCdWZmZXJUeXBlO1xuKGZ1bmN0aW9uIChHRlhDb21tYW5kQnVmZmVyVHlwZSkge1xuICAgIEdGWENvbW1hbmRCdWZmZXJUeXBlW0dGWENvbW1hbmRCdWZmZXJUeXBlW1wiUFJJTUFSWVwiXSA9IDBdID0gXCJQUklNQVJZXCI7XG4gICAgR0ZYQ29tbWFuZEJ1ZmZlclR5cGVbR0ZYQ29tbWFuZEJ1ZmZlclR5cGVbXCJTRUNPTkRBUllcIl0gPSAxXSA9IFwiU0VDT05EQVJZXCI7XG59KShHRlhDb21tYW5kQnVmZmVyVHlwZSB8fCAoR0ZYQ29tbWFuZEJ1ZmZlclR5cGUgPSB7fSkpO1xuLy8gRW51bWVyYXRpb24gYWxsIHBvc3NpYmxlIHZhbHVlcyBvZiBvcGVyYXRpb25zIHRvIGJlIHBlcmZvcm1lZCBvbiBpbml0aWFsbHkgTG9hZGluZyBhIEZyYW1lYnVmZmVyIE9iamVjdC5cbnZhciBHRlhMb2FkT3A7XG4oZnVuY3Rpb24gKEdGWExvYWRPcCkge1xuICAgIEdGWExvYWRPcFtHRlhMb2FkT3BbXCJMT0FEXCJdID0gMF0gPSBcIkxPQURcIjtcbiAgICBHRlhMb2FkT3BbR0ZYTG9hZE9wW1wiQ0xFQVJcIl0gPSAxXSA9IFwiQ0xFQVJcIjtcbiAgICBHRlhMb2FkT3BbR0ZYTG9hZE9wW1wiRElTQ0FSRFwiXSA9IDJdID0gXCJESVNDQVJEXCI7XG59KShHRlhMb2FkT3AgfHwgKEdGWExvYWRPcCA9IHt9KSk7XG4vLyBFbnVtZXJhdGVzIGFsbCBwb3NzaWJsZSB2YWx1ZXMgb2Ygb3BlcmF0aW9ucyB0byBiZSBwZXJmb3JtZWQgd2hlbiBTdG9yaW5nIHRvIGEgRnJhbWVidWZmZXIgT2JqZWN0LlxudmFyIEdGWFN0b3JlT3A7XG4oZnVuY3Rpb24gKEdGWFN0b3JlT3ApIHtcbiAgICBHRlhTdG9yZU9wW0dGWFN0b3JlT3BbXCJTVE9SRVwiXSA9IDBdID0gXCJTVE9SRVwiO1xuICAgIEdGWFN0b3JlT3BbR0ZYU3RvcmVPcFtcIkRJU0NBUkRcIl0gPSAxXSA9IFwiRElTQ0FSRFwiO1xufSkoR0ZYU3RvcmVPcCB8fCAoR0ZYU3RvcmVPcCA9IHt9KSk7XG52YXIgR0ZYVGV4dHVyZUxheW91dDtcbihmdW5jdGlvbiAoR0ZYVGV4dHVyZUxheW91dCkge1xuICAgIEdGWFRleHR1cmVMYXlvdXRbR0ZYVGV4dHVyZUxheW91dFtcIlVOREVGSU5FRFwiXSA9IDBdID0gXCJVTkRFRklORURcIjtcbiAgICBHRlhUZXh0dXJlTGF5b3V0W0dGWFRleHR1cmVMYXlvdXRbXCJHRU5FUkFMXCJdID0gMV0gPSBcIkdFTkVSQUxcIjtcbiAgICBHRlhUZXh0dXJlTGF5b3V0W0dGWFRleHR1cmVMYXlvdXRbXCJDT0xPUl9BVFRBQ0hNRU5UX09QVElNQUxcIl0gPSAyXSA9IFwiQ09MT1JfQVRUQUNITUVOVF9PUFRJTUFMXCI7XG4gICAgR0ZYVGV4dHVyZUxheW91dFtHRlhUZXh0dXJlTGF5b3V0W1wiREVQVEhfU1RFTkNJTF9BVFRBQ0hNRU5UX09QVElNQUxcIl0gPSAzXSA9IFwiREVQVEhfU1RFTkNJTF9BVFRBQ0hNRU5UX09QVElNQUxcIjtcbiAgICBHRlhUZXh0dXJlTGF5b3V0W0dGWFRleHR1cmVMYXlvdXRbXCJERVBUSF9TVEVOQ0lMX1JFQURPTkxZX09QVElNQUxcIl0gPSA0XSA9IFwiREVQVEhfU1RFTkNJTF9SRUFET05MWV9PUFRJTUFMXCI7XG4gICAgR0ZYVGV4dHVyZUxheW91dFtHRlhUZXh0dXJlTGF5b3V0W1wiU0hBREVSX1JFQURPTkxZX09QVElNQUxcIl0gPSA1XSA9IFwiU0hBREVSX1JFQURPTkxZX09QVElNQUxcIjtcbiAgICBHRlhUZXh0dXJlTGF5b3V0W0dGWFRleHR1cmVMYXlvdXRbXCJUUkFOU0ZFUl9TUkNfT1BUSU1BTFwiXSA9IDZdID0gXCJUUkFOU0ZFUl9TUkNfT1BUSU1BTFwiO1xuICAgIEdGWFRleHR1cmVMYXlvdXRbR0ZYVGV4dHVyZUxheW91dFtcIlRSQU5TRkVSX0RTVF9PUFRJTUFMXCJdID0gN10gPSBcIlRSQU5TRkVSX0RTVF9PUFRJTUFMXCI7XG4gICAgR0ZYVGV4dHVyZUxheW91dFtHRlhUZXh0dXJlTGF5b3V0W1wiUFJFSU5JVElBTElaRURcIl0gPSA4XSA9IFwiUFJFSU5JVElBTElaRURcIjtcbiAgICBHRlhUZXh0dXJlTGF5b3V0W0dGWFRleHR1cmVMYXlvdXRbXCJQUkVTRU5UX1NSQ1wiXSA9IDldID0gXCJQUkVTRU5UX1NSQ1wiO1xufSkoR0ZYVGV4dHVyZUxheW91dCB8fCAoR0ZYVGV4dHVyZUxheW91dCA9IHt9KSk7XG52YXIgR0ZYUGlwZWxpbmVCaW5kUG9pbnQ7XG4oZnVuY3Rpb24gKEdGWFBpcGVsaW5lQmluZFBvaW50KSB7XG4gICAgR0ZYUGlwZWxpbmVCaW5kUG9pbnRbR0ZYUGlwZWxpbmVCaW5kUG9pbnRbXCJHUkFQSElDU1wiXSA9IDBdID0gXCJHUkFQSElDU1wiO1xuICAgIEdGWFBpcGVsaW5lQmluZFBvaW50W0dGWFBpcGVsaW5lQmluZFBvaW50W1wiQ09NUFVURVwiXSA9IDFdID0gXCJDT01QVVRFXCI7XG4gICAgR0ZYUGlwZWxpbmVCaW5kUG9pbnRbR0ZYUGlwZWxpbmVCaW5kUG9pbnRbXCJSQVlfVFJBQ0lOR1wiXSA9IDJdID0gXCJSQVlfVFJBQ0lOR1wiO1xufSkoR0ZYUGlwZWxpbmVCaW5kUG9pbnQgfHwgKEdGWFBpcGVsaW5lQmluZFBvaW50ID0ge30pKTtcbnZhciBHRlhEeW5hbWljU3RhdGU7XG4oZnVuY3Rpb24gKEdGWER5bmFtaWNTdGF0ZSkge1xuICAgIEdGWER5bmFtaWNTdGF0ZVtHRlhEeW5hbWljU3RhdGVbXCJWSUVXUE9SVFwiXSA9IDBdID0gXCJWSUVXUE9SVFwiO1xuICAgIEdGWER5bmFtaWNTdGF0ZVtHRlhEeW5hbWljU3RhdGVbXCJTQ0lTU09SXCJdID0gMV0gPSBcIlNDSVNTT1JcIjtcbiAgICBHRlhEeW5hbWljU3RhdGVbR0ZYRHluYW1pY1N0YXRlW1wiTElORV9XSURUSFwiXSA9IDJdID0gXCJMSU5FX1dJRFRIXCI7XG4gICAgR0ZYRHluYW1pY1N0YXRlW0dGWER5bmFtaWNTdGF0ZVtcIkRFUFRIX0JJQVNcIl0gPSAzXSA9IFwiREVQVEhfQklBU1wiO1xuICAgIEdGWER5bmFtaWNTdGF0ZVtHRlhEeW5hbWljU3RhdGVbXCJCTEVORF9DT05TVEFOVFNcIl0gPSA0XSA9IFwiQkxFTkRfQ09OU1RBTlRTXCI7XG4gICAgR0ZYRHluYW1pY1N0YXRlW0dGWER5bmFtaWNTdGF0ZVtcIkRFUFRIX0JPVU5EU1wiXSA9IDVdID0gXCJERVBUSF9CT1VORFNcIjtcbiAgICBHRlhEeW5hbWljU3RhdGVbR0ZYRHluYW1pY1N0YXRlW1wiU1RFTkNJTF9XUklURV9NQVNLXCJdID0gNl0gPSBcIlNURU5DSUxfV1JJVEVfTUFTS1wiO1xuICAgIEdGWER5bmFtaWNTdGF0ZVtHRlhEeW5hbWljU3RhdGVbXCJTVEVOQ0lMX0NPTVBBUkVfTUFTS1wiXSA9IDddID0gXCJTVEVOQ0lMX0NPTVBBUkVfTUFTS1wiO1xufSkoR0ZYRHluYW1pY1N0YXRlIHx8IChHRlhEeW5hbWljU3RhdGUgPSB7fSkpO1xudmFyIEdGWFN0ZW5jaWxGYWNlO1xuKGZ1bmN0aW9uIChHRlhTdGVuY2lsRmFjZSkge1xuICAgIEdGWFN0ZW5jaWxGYWNlW0dGWFN0ZW5jaWxGYWNlW1wiRlJPTlRcIl0gPSAwXSA9IFwiRlJPTlRcIjtcbiAgICBHRlhTdGVuY2lsRmFjZVtHRlhTdGVuY2lsRmFjZVtcIkJBQ0tcIl0gPSAxXSA9IFwiQkFDS1wiO1xuICAgIEdGWFN0ZW5jaWxGYWNlW0dGWFN0ZW5jaWxGYWNlW1wiQUxMXCJdID0gMl0gPSBcIkFMTFwiO1xufSkoR0ZYU3RlbmNpbEZhY2UgfHwgKEdGWFN0ZW5jaWxGYWNlID0ge30pKTtcbnZhciBHRlhRdWV1ZVR5cGU7XG4oZnVuY3Rpb24gKEdGWFF1ZXVlVHlwZSkge1xuICAgIEdGWFF1ZXVlVHlwZVtHRlhRdWV1ZVR5cGVbXCJHUkFQSElDU1wiXSA9IDBdID0gXCJHUkFQSElDU1wiO1xuICAgIEdGWFF1ZXVlVHlwZVtHRlhRdWV1ZVR5cGVbXCJDT01QVVRFXCJdID0gMV0gPSBcIkNPTVBVVEVcIjtcbiAgICBHRlhRdWV1ZVR5cGVbR0ZYUXVldWVUeXBlW1wiVFJBTlNGRVJcIl0gPSAyXSA9IFwiVFJBTlNGRVJcIjtcbn0pKEdGWFF1ZXVlVHlwZSB8fCAoR0ZYUXVldWVUeXBlID0ge30pKTtcbnZhciBHRlhDbGVhckZsYWc7XG4oZnVuY3Rpb24gKEdGWENsZWFyRmxhZykge1xuICAgIEdGWENsZWFyRmxhZ1tHRlhDbGVhckZsYWdbXCJOT05FXCJdID0gMF0gPSBcIk5PTkVcIjtcbiAgICBHRlhDbGVhckZsYWdbR0ZYQ2xlYXJGbGFnW1wiQ09MT1JcIl0gPSAxXSA9IFwiQ09MT1JcIjtcbiAgICBHRlhDbGVhckZsYWdbR0ZYQ2xlYXJGbGFnW1wiREVQVEhcIl0gPSAyXSA9IFwiREVQVEhcIjtcbiAgICBHRlhDbGVhckZsYWdbR0ZYQ2xlYXJGbGFnW1wiU1RFTkNJTFwiXSA9IDRdID0gXCJTVEVOQ0lMXCI7XG4gICAgR0ZYQ2xlYXJGbGFnW0dGWENsZWFyRmxhZ1tcIkRFUFRIX1NURU5DSUxcIl0gPSA2XSA9IFwiREVQVEhfU1RFTkNJTFwiO1xuICAgIEdGWENsZWFyRmxhZ1tHRlhDbGVhckZsYWdbXCJBTExcIl0gPSA3XSA9IFwiQUxMXCI7XG59KShHRlhDbGVhckZsYWcgfHwgKEdGWENsZWFyRmxhZyA9IHt9KSk7XG5mdW5jdGlvbiBHRlhHZXRUeXBlU2l6ZSh0eXBlKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgR0ZYVHlwZS5CT09MOlxuICAgICAgICBjYXNlIEdGWFR5cGUuSU5UOlxuICAgICAgICBjYXNlIEdGWFR5cGUuVUlOVDpcbiAgICAgICAgY2FzZSBHRlhUeXBlLkZMT0FUOiByZXR1cm4gNDtcbiAgICAgICAgY2FzZSBHRlhUeXBlLkJPT0wyOlxuICAgICAgICBjYXNlIEdGWFR5cGUuSU5UMjpcbiAgICAgICAgY2FzZSBHRlhUeXBlLlVJTlQyOlxuICAgICAgICBjYXNlIEdGWFR5cGUuRkxPQVQyOiByZXR1cm4gODtcbiAgICAgICAgY2FzZSBHRlhUeXBlLkJPT0wzOlxuICAgICAgICBjYXNlIEdGWFR5cGUuSU5UMzpcbiAgICAgICAgY2FzZSBHRlhUeXBlLlVJTlQzOlxuICAgICAgICBjYXNlIEdGWFR5cGUuRkxPQVQzOiByZXR1cm4gMTI7XG4gICAgICAgIGNhc2UgR0ZYVHlwZS5CT09MNDpcbiAgICAgICAgY2FzZSBHRlhUeXBlLklOVDQ6XG4gICAgICAgIGNhc2UgR0ZYVHlwZS5VSU5UNDpcbiAgICAgICAgY2FzZSBHRlhUeXBlLkZMT0FUNDpcbiAgICAgICAgY2FzZSBHRlhUeXBlLk1BVDI6IHJldHVybiAxNjtcbiAgICAgICAgY2FzZSBHRlhUeXBlLk1BVDJYMzogcmV0dXJuIDI0O1xuICAgICAgICBjYXNlIEdGWFR5cGUuTUFUMlg0OiByZXR1cm4gMzI7XG4gICAgICAgIGNhc2UgR0ZYVHlwZS5NQVQzWDI6IHJldHVybiAyNDtcbiAgICAgICAgY2FzZSBHRlhUeXBlLk1BVDM6IHJldHVybiAzNjtcbiAgICAgICAgY2FzZSBHRlhUeXBlLk1BVDNYNDogcmV0dXJuIDQ4O1xuICAgICAgICBjYXNlIEdGWFR5cGUuTUFUNFgyOiByZXR1cm4gMzI7XG4gICAgICAgIGNhc2UgR0ZYVHlwZS5NQVQ0WDI6IHJldHVybiAzMjtcbiAgICAgICAgY2FzZSBHRlhUeXBlLk1BVDQ6IHJldHVybiA2NDtcbiAgICAgICAgY2FzZSBHRlhUeXBlLlNBTVBMRVIxRDpcbiAgICAgICAgY2FzZSBHRlhUeXBlLlNBTVBMRVIxRF9BUlJBWTpcbiAgICAgICAgY2FzZSBHRlhUeXBlLlNBTVBMRVIyRDpcbiAgICAgICAgY2FzZSBHRlhUeXBlLlNBTVBMRVIyRF9BUlJBWTpcbiAgICAgICAgY2FzZSBHRlhUeXBlLlNBTVBMRVIzRDpcbiAgICAgICAgY2FzZSBHRlhUeXBlLlNBTVBMRVJfQ1VCRTogcmV0dXJuIDQ7XG4gICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBpbXBvcnQgeyBHRlhCdWZmZXIgfSBmcm9tICcuLi9nZngvYnVmZmVyJztcbnZhciBSZW5kZXJQYXNzU3RhZ2U7XG4oZnVuY3Rpb24gKFJlbmRlclBhc3NTdGFnZSkge1xuICAgIFJlbmRlclBhc3NTdGFnZVtSZW5kZXJQYXNzU3RhZ2VbXCJERUZBVUxUXCJdID0gMTAwXSA9IFwiREVGQVVMVFwiO1xufSkoUmVuZGVyUGFzc1N0YWdlIHx8IChSZW5kZXJQYXNzU3RhZ2UgPSB7fSkpO1xudmFyIFJlbmRlclByaW9yaXR5O1xuKGZ1bmN0aW9uIChSZW5kZXJQcmlvcml0eSkge1xuICAgIFJlbmRlclByaW9yaXR5W1JlbmRlclByaW9yaXR5W1wiTUlOXCJdID0gMF0gPSBcIk1JTlwiO1xuICAgIFJlbmRlclByaW9yaXR5W1JlbmRlclByaW9yaXR5W1wiTUFYXCJdID0gMjU1XSA9IFwiTUFYXCI7XG4gICAgUmVuZGVyUHJpb3JpdHlbUmVuZGVyUHJpb3JpdHlbXCJERUZBVUxUXCJdID0gMTI4XSA9IFwiREVGQVVMVFwiO1xufSkoUmVuZGVyUHJpb3JpdHkgfHwgKFJlbmRlclByaW9yaXR5ID0ge30pKTtcbnZhciBNQVhfQklORElOR19TVVBQT1JURUQgPSAyNDsgLy8gZnJvbSBXZWJHTCAyIHNwZWNcbnZhciBVbmlmb3JtQmluZGluZztcbihmdW5jdGlvbiAoVW5pZm9ybUJpbmRpbmcpIHtcbiAgICAvLyBVQk9zXG4gICAgVW5pZm9ybUJpbmRpbmdbVW5pZm9ybUJpbmRpbmdbXCJVQk9fR0xPQkFMXCJdID0gTUFYX0JJTkRJTkdfU1VQUE9SVEVEIC0gMV0gPSBcIlVCT19HTE9CQUxcIjtcbiAgICBVbmlmb3JtQmluZGluZ1tVbmlmb3JtQmluZGluZ1tcIlVCT19TSEFET1dcIl0gPSBNQVhfQklORElOR19TVVBQT1JURUQgLSAyXSA9IFwiVUJPX1NIQURPV1wiO1xuICAgIFVuaWZvcm1CaW5kaW5nW1VuaWZvcm1CaW5kaW5nW1wiVUJPX0xPQ0FMXCJdID0gTUFYX0JJTkRJTkdfU1VQUE9SVEVEIC0gM10gPSBcIlVCT19MT0NBTFwiO1xuICAgIFVuaWZvcm1CaW5kaW5nW1VuaWZvcm1CaW5kaW5nW1wiVUJPX0ZPUldBUkRfTElHSFRTXCJdID0gTUFYX0JJTkRJTkdfU1VQUE9SVEVEIC0gNF0gPSBcIlVCT19GT1JXQVJEX0xJR0hUU1wiO1xuICAgIFVuaWZvcm1CaW5kaW5nW1VuaWZvcm1CaW5kaW5nW1wiVUJPX1NLSU5OSU5HXCJdID0gTUFYX0JJTkRJTkdfU1VQUE9SVEVEIC0gNV0gPSBcIlVCT19TS0lOTklOR1wiO1xuICAgIFVuaWZvcm1CaW5kaW5nW1VuaWZvcm1CaW5kaW5nW1wiVUJPX1NLSU5OSU5HX1RFWFRVUkVcIl0gPSBNQVhfQklORElOR19TVVBQT1JURUQgLSA2XSA9IFwiVUJPX1NLSU5OSU5HX1RFWFRVUkVcIjtcbiAgICBVbmlmb3JtQmluZGluZ1tVbmlmb3JtQmluZGluZ1tcIlVCT19VSVwiXSA9IE1BWF9CSU5ESU5HX1NVUFBPUlRFRCAtIDddID0gXCJVQk9fVUlcIjtcbiAgICAvLyBzYW1wbGVyc1xuICAgIFVuaWZvcm1CaW5kaW5nW1VuaWZvcm1CaW5kaW5nW1wiU0FNUExFUl9KT0lOVFNcIl0gPSBNQVhfQklORElOR19TVVBQT1JURUQgKyAxXSA9IFwiU0FNUExFUl9KT0lOVFNcIjtcbiAgICBVbmlmb3JtQmluZGluZ1tVbmlmb3JtQmluZGluZ1tcIlNBTVBMRVJfRU5WSVJPTk1FTlRcIl0gPSBNQVhfQklORElOR19TVVBQT1JURUQgKyAyXSA9IFwiU0FNUExFUl9FTlZJUk9OTUVOVFwiO1xuICAgIC8vIHJvb21zIGxlZnQgZm9yIGN1c3RvbSBiaW5kaW5nc1xuICAgIC8vIGVmZmVjdCBpbXBvcnRlciBwcmVwYXJlcyBiaW5kaW5ncyBhY2NvcmRpbmcgdG8gdGhpc1xuICAgIFVuaWZvcm1CaW5kaW5nW1VuaWZvcm1CaW5kaW5nW1wiQ1VTVFVNX1VCT19CSU5ESU5HX0VORF9QT0lOVFwiXSA9IE1BWF9CSU5ESU5HX1NVUFBPUlRFRCAtIDddID0gXCJDVVNUVU1fVUJPX0JJTkRJTkdfRU5EX1BPSU5UXCI7XG4gICAgVW5pZm9ybUJpbmRpbmdbVW5pZm9ybUJpbmRpbmdbXCJDVVNUT01fU0FNUExFUl9CSU5ESU5HX1NUQVJUX1BPSU5UXCJdID0gTUFYX0JJTkRJTkdfU1VQUE9SVEVEICsgNl0gPSBcIkNVU1RPTV9TQU1QTEVSX0JJTkRJTkdfU1RBUlRfUE9JTlRcIjtcbn0pKFVuaWZvcm1CaW5kaW5nIHx8IChVbmlmb3JtQmluZGluZyA9IHt9KSk7XG4vLyBleHBvcnQgY2xhc3MgVUJPR2xvYmFsIHtcbi8vICAgICBwdWJsaWMgc3RhdGljIFRJTUVfT0ZGU0VUOiBudW1iZXIgPSAwO1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgU0NSRUVOX1NJWkVfT0ZGU0VUOiBudW1iZXIgPSBVQk9HbG9iYWwuVElNRV9PRkZTRVQgKyA0O1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgU0NSRUVOX1NDQUxFX09GRlNFVDogbnVtYmVyID0gVUJPR2xvYmFsLlNDUkVFTl9TSVpFX09GRlNFVCArIDQ7XG4vLyAgICAgcHVibGljIHN0YXRpYyBOQVRJVkVfU0laRV9PRkZTRVQ6IG51bWJlciA9IFVCT0dsb2JhbC5TQ1JFRU5fU0NBTEVfT0ZGU0VUICsgNDtcbi8vICAgICBwdWJsaWMgc3RhdGljIE1BVF9WSUVXX09GRlNFVDogbnVtYmVyID0gVUJPR2xvYmFsLk5BVElWRV9TSVpFX09GRlNFVCArIDQ7XG4vLyAgICAgcHVibGljIHN0YXRpYyBNQVRfVklFV19JTlZfT0ZGU0VUOiBudW1iZXIgPSBVQk9HbG9iYWwuTUFUX1ZJRVdfT0ZGU0VUICsgMTY7XG4vLyAgICAgcHVibGljIHN0YXRpYyBNQVRfUFJPSl9PRkZTRVQ6IG51bWJlciA9IFVCT0dsb2JhbC5NQVRfVklFV19JTlZfT0ZGU0VUICsgMTY7XG4vLyAgICAgcHVibGljIHN0YXRpYyBNQVRfUFJPSl9JTlZfT0ZGU0VUOiBudW1iZXIgPSBVQk9HbG9iYWwuTUFUX1BST0pfT0ZGU0VUICsgMTY7XG4vLyAgICAgcHVibGljIHN0YXRpYyBNQVRfVklFV19QUk9KX09GRlNFVDogbnVtYmVyID0gVUJPR2xvYmFsLk1BVF9QUk9KX0lOVl9PRkZTRVQgKyAxNjtcbi8vICAgICBwdWJsaWMgc3RhdGljIE1BVF9WSUVXX1BST0pfSU5WX09GRlNFVDogbnVtYmVyID0gVUJPR2xvYmFsLk1BVF9WSUVXX1BST0pfT0ZGU0VUICsgMTY7XG4vLyAgICAgcHVibGljIHN0YXRpYyBDQU1FUkFfUE9TX09GRlNFVDogbnVtYmVyID0gVUJPR2xvYmFsLk1BVF9WSUVXX1BST0pfSU5WX09GRlNFVCArIDE2O1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgRVhQT1NVUkVfT0ZGU0VUOiBudW1iZXIgPSBVQk9HbG9iYWwuQ0FNRVJBX1BPU19PRkZTRVQgKyA0O1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgTUFJTl9MSVRfRElSX09GRlNFVDogbnVtYmVyID0gVUJPR2xvYmFsLkVYUE9TVVJFX09GRlNFVCArIDQ7XG4vLyAgICAgcHVibGljIHN0YXRpYyBNQUlOX0xJVF9DT0xPUl9PRkZTRVQ6IG51bWJlciA9IFVCT0dsb2JhbC5NQUlOX0xJVF9ESVJfT0ZGU0VUICsgNDtcbi8vICAgICBwdWJsaWMgc3RhdGljIEFNQklFTlRfU0tZX09GRlNFVDogbnVtYmVyID0gVUJPR2xvYmFsLk1BSU5fTElUX0NPTE9SX09GRlNFVCArIDQ7XG4vLyAgICAgcHVibGljIHN0YXRpYyBBTUJJRU5UX0dST1VORF9PRkZTRVQ6IG51bWJlciA9IFVCT0dsb2JhbC5BTUJJRU5UX1NLWV9PRkZTRVQgKyA0O1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgQ09VTlQ6IG51bWJlciA9IFVCT0dsb2JhbC5BTUJJRU5UX0dST1VORF9PRkZTRVQgKyA0O1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgU0laRTogbnVtYmVyID0gVUJPR2xvYmFsLkNPVU5UICogNDtcbi8vICAgICBwdWJsaWMgc3RhdGljIEJMT0NLOiBHRlhVbmlmb3JtQmxvY2sgPSB7XG4vLyAgICAgICAgIGJpbmRpbmc6IFVuaWZvcm1CaW5kaW5nLlVCT19HTE9CQUwsIG5hbWU6ICdDQ0dsb2JhbCcsIG1lbWJlcnM6IFtcbi8vICAgICAgICAgICAgIHsgbmFtZTogJ2NjX3RpbWUnLCB0eXBlOiBHRlhUeXBlLkZMT0FUNCwgY291bnQ6IDEgfSxcbi8vICAgICAgICAgICAgIHsgbmFtZTogJ2NjX3NjcmVlblNpemUnLCB0eXBlOiBHRlhUeXBlLkZMT0FUNCwgY291bnQ6IDEgfSxcbi8vICAgICAgICAgICAgIHsgbmFtZTogJ2NjX3NjcmVlblNjYWxlJywgdHlwZTogR0ZYVHlwZS5GTE9BVDQsIGNvdW50OiAxIH0sXG4vLyAgICAgICAgICAgICB7IG5hbWU6ICdjY19uYXRpdmVTaXplJywgdHlwZTogR0ZYVHlwZS5GTE9BVDQsIGNvdW50OiAxIH0sXG4vLyAgICAgICAgICAgICB7IG5hbWU6ICdjY19tYXRWaWV3JywgdHlwZTogR0ZYVHlwZS5NQVQ0LCBjb3VudDogMSB9LFxuLy8gICAgICAgICAgICAgeyBuYW1lOiAnY2NfbWF0Vmlld0ludicsIHR5cGU6IEdGWFR5cGUuTUFUNCwgY291bnQ6IDEgfSxcbi8vICAgICAgICAgICAgIHsgbmFtZTogJ2NjX21hdFByb2onLCB0eXBlOiBHRlhUeXBlLk1BVDQsIGNvdW50OiAxIH0sXG4vLyAgICAgICAgICAgICB7IG5hbWU6ICdjY19tYXRQcm9qSW52JywgdHlwZTogR0ZYVHlwZS5NQVQ0LCBjb3VudDogMSB9LFxuLy8gICAgICAgICAgICAgeyBuYW1lOiAnY2NfbWF0Vmlld1Byb2onLCB0eXBlOiBHRlhUeXBlLk1BVDQsIGNvdW50OiAxIH0sXG4vLyAgICAgICAgICAgICB7IG5hbWU6ICdjY19tYXRWaWV3UHJvakludicsIHR5cGU6IEdGWFR5cGUuTUFUNCwgY291bnQ6IDEgfSxcbi8vICAgICAgICAgICAgIHsgbmFtZTogJ2NjX2NhbWVyYVBvcycsIHR5cGU6IEdGWFR5cGUuRkxPQVQ0LCBjb3VudDogMSB9LFxuLy8gICAgICAgICAgICAgeyBuYW1lOiAnY2NfZXhwb3N1cmUnLCB0eXBlOiBHRlhUeXBlLkZMT0FUNCwgY291bnQ6IDEgfSxcbi8vICAgICAgICAgICAgIHsgbmFtZTogJ2NjX21haW5MaXREaXInLCB0eXBlOiBHRlhUeXBlLkZMT0FUNCwgY291bnQ6IDEgfSxcbi8vICAgICAgICAgICAgIHsgbmFtZTogJ2NjX21haW5MaXRDb2xvcicsIHR5cGU6IEdGWFR5cGUuRkxPQVQ0LCBjb3VudDogMSB9LFxuLy8gICAgICAgICAgICAgeyBuYW1lOiAnY2NfYW1iaWVudFNreScsIHR5cGU6IEdGWFR5cGUuRkxPQVQ0LCBjb3VudDogMSB9LFxuLy8gICAgICAgICAgICAgeyBuYW1lOiAnY2NfYW1iaWVudEdyb3VuZCcsIHR5cGU6IEdGWFR5cGUuRkxPQVQ0LCBjb3VudDogMSB9LFxuLy8gICAgICAgICBdLFxuLy8gICAgIH07XG4vLyAgICAgcHVibGljIHZpZXc6IEZsb2F0MzJBcnJheSA9IG5ldyBGbG9hdDMyQXJyYXkoVUJPR2xvYmFsLkNPVU5UKTtcbi8vIH1cbi8vIGV4cG9ydCBjbGFzcyBVQk9TaGFkb3cge1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgTUFUX0xJR0hUX1BMQU5FX1BST0pfT0ZGU0VUOiBudW1iZXIgPSAwO1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgU0hBRE9XX0NPTE9SX09GRlNFVDogbnVtYmVyID0gVUJPU2hhZG93Lk1BVF9MSUdIVF9QTEFORV9QUk9KX09GRlNFVCArIDE2O1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgQ09VTlQ6IG51bWJlciA9IFVCT1NoYWRvdy5TSEFET1dfQ09MT1JfT0ZGU0VUICsgNDtcbi8vICAgICBwdWJsaWMgc3RhdGljIFNJWkU6IG51bWJlciA9IFVCT1NoYWRvdy5DT1VOVCAqIDQ7XG4vLyAgICAgcHVibGljIHN0YXRpYyBCTE9DSzogR0ZYVW5pZm9ybUJsb2NrID0ge1xuLy8gICAgICAgICBiaW5kaW5nOiBVbmlmb3JtQmluZGluZy5VQk9fU0hBRE9XLCBuYW1lOiAnQ0NTaGFkb3cnLCBtZW1iZXJzOiBbXG4vLyAgICAgICAgICAgICB7IG5hbWU6ICdjY19tYXRMaWdodFBsYW5lUHJvaicsIHR5cGU6IEdGWFR5cGUuTUFUNCwgY291bnQ6IDEgfSxcbi8vICAgICAgICAgICAgIHsgbmFtZTogJ2NjX3NoYWRvd0NvbG9yJywgdHlwZTogR0ZYVHlwZS5GTE9BVDQsIGNvdW50OiAxIH0sXG4vLyAgICAgICAgIF0sXG4vLyAgICAgfTtcbi8vICAgICBwdWJsaWMgdmlldzogRmxvYXQzMkFycmF5ID0gbmV3IEZsb2F0MzJBcnJheShVQk9TaGFkb3cuQ09VTlQpO1xuLy8gfVxuLy8gZXhwb3J0IGNvbnN0IGxvY2FsQmluZGluZ3NEZXNjOiBNYXA8c3RyaW5nLCBJSW50ZXJuYWxCaW5kaW5nRGVzYz4gPSBuZXcgTWFwPHN0cmluZywgSUludGVybmFsQmluZGluZ0Rlc2M+KCk7XG4vLyBleHBvcnQgY2xhc3MgVUJPTG9jYWwge1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgTUFUX1dPUkxEX09GRlNFVDogbnVtYmVyID0gMDtcbi8vICAgICBwdWJsaWMgc3RhdGljIE1BVF9XT1JMRF9JVF9PRkZTRVQ6IG51bWJlciA9IFVCT0xvY2FsLk1BVF9XT1JMRF9PRkZTRVQgKyAxNjtcbi8vICAgICBwdWJsaWMgc3RhdGljIENPVU5UOiBudW1iZXIgPSBVQk9Mb2NhbC5NQVRfV09STERfSVRfT0ZGU0VUICsgMTY7XG4vLyAgICAgcHVibGljIHN0YXRpYyBTSVpFOiBudW1iZXIgPSBVQk9Mb2NhbC5DT1VOVCAqIDQ7XG4vLyAgICAgcHVibGljIHN0YXRpYyBCTE9DSzogR0ZYVW5pZm9ybUJsb2NrID0ge1xuLy8gICAgICAgICBiaW5kaW5nOiBVbmlmb3JtQmluZGluZy5VQk9fTE9DQUwsIG5hbWU6ICdDQ0xvY2FsJywgbWVtYmVyczogW1xuLy8gICAgICAgICAgICAgeyBuYW1lOiAnY2NfbWF0V29ybGQnLCB0eXBlOiBHRlhUeXBlLk1BVDQsIGNvdW50OiAxIH0sXG4vLyAgICAgICAgICAgICB7IG5hbWU6ICdjY19tYXRXb3JsZElUJywgdHlwZTogR0ZYVHlwZS5NQVQ0LCBjb3VudDogMSB9LFxuLy8gICAgICAgICBdLFxuLy8gICAgIH07XG4vLyAgICAgcHVibGljIHZpZXc6IEZsb2F0MzJBcnJheSA9IG5ldyBGbG9hdDMyQXJyYXkoVUJPTG9jYWwuQ09VTlQpO1xuLy8gfVxuLy8gbG9jYWxCaW5kaW5nc0Rlc2Muc2V0KFVCT0xvY2FsLkJMT0NLLm5hbWUsIHtcbi8vICAgICB0eXBlOiBHRlhCaW5kaW5nVHlwZS5VTklGT1JNX0JVRkZFUixcbi8vICAgICBibG9ja0luZm86IFVCT0xvY2FsLkJMT0NLLFxuLy8gfSk7XG4vLyBleHBvcnQgY2xhc3MgVUJPRm9yd2FyZExpZ2h0IHtcbi8vICAgICBwdWJsaWMgc3RhdGljIE1BWF9TUEhFUkVfTElHSFRTID0gMjtcbi8vICAgICBwdWJsaWMgc3RhdGljIE1BWF9TUE9UX0xJR0hUUyA9IDI7XG4vLyAgICAgcHVibGljIHN0YXRpYyBTUEhFUkVfTElHSFRfUE9TX09GRlNFVDogbnVtYmVyID0gMDtcbi8vICAgICBwdWJsaWMgc3RhdGljIFNQSEVSRV9MSUdIVF9TSVpFX1JBTkdFX09GRlNFVDogbnVtYmVyID0gVUJPRm9yd2FyZExpZ2h0LlNQSEVSRV9MSUdIVF9QT1NfT0ZGU0VUICsgVUJPRm9yd2FyZExpZ2h0Lk1BWF9TUEhFUkVfTElHSFRTICogNDtcbi8vICAgICBwdWJsaWMgc3RhdGljIFNQSEVSRV9MSUdIVF9DT0xPUl9PRkZTRVQ6IG51bWJlciA9IFVCT0ZvcndhcmRMaWdodC5TUEhFUkVfTElHSFRfU0laRV9SQU5HRV9PRkZTRVQgKyBVQk9Gb3J3YXJkTGlnaHQuTUFYX1NQSEVSRV9MSUdIVFMgKiA0O1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgU1BPVF9MSUdIVF9QT1NfT0ZGU0VUOiBudW1iZXIgPSBVQk9Gb3J3YXJkTGlnaHQuU1BIRVJFX0xJR0hUX0NPTE9SX09GRlNFVCArIFVCT0ZvcndhcmRMaWdodC5NQVhfU1BPVF9MSUdIVFMgKiA0O1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgU1BPVF9MSUdIVF9TSVpFX1JBTkdFX0FOR0xFX09GRlNFVDogbnVtYmVyID0gVUJPRm9yd2FyZExpZ2h0LlNQT1RfTElHSFRfUE9TX09GRlNFVCArIFVCT0ZvcndhcmRMaWdodC5NQVhfU1BPVF9MSUdIVFMgKiA0O1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgU1BPVF9MSUdIVF9ESVJfT0ZGU0VUOiBudW1iZXIgPSBVQk9Gb3J3YXJkTGlnaHQuU1BPVF9MSUdIVF9TSVpFX1JBTkdFX0FOR0xFX09GRlNFVCArIFVCT0ZvcndhcmRMaWdodC5NQVhfU1BPVF9MSUdIVFMgKiA0O1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgU1BPVF9MSUdIVF9DT0xPUl9PRkZTRVQ6IG51bWJlciA9IFVCT0ZvcndhcmRMaWdodC5TUE9UX0xJR0hUX0RJUl9PRkZTRVQgKyBVQk9Gb3J3YXJkTGlnaHQuTUFYX1NQT1RfTElHSFRTICogNDtcbi8vICAgICBwdWJsaWMgc3RhdGljIENPVU5UOiBudW1iZXIgPSBVQk9Gb3J3YXJkTGlnaHQuU1BPVF9MSUdIVF9DT0xPUl9PRkZTRVQgKyBVQk9Gb3J3YXJkTGlnaHQuTUFYX1NQT1RfTElHSFRTICogNDtcbi8vICAgICBwdWJsaWMgc3RhdGljIFNJWkU6IG51bWJlciA9IFVCT0ZvcndhcmRMaWdodC5DT1VOVCAqIDQ7XG4vLyAgICAgcHVibGljIHN0YXRpYyBCTE9DSzogR0ZYVW5pZm9ybUJsb2NrID0ge1xuLy8gICAgICAgICBiaW5kaW5nOiBVbmlmb3JtQmluZGluZy5VQk9fRk9SV0FSRF9MSUdIVFMsIG5hbWU6ICdDQ0ZvcndhcmRMaWdodCcsIG1lbWJlcnM6IFtcbi8vICAgICAgICAgICAgIHsgbmFtZTogJ2NjX3NwaGVyZUxpdFBvcycsIHR5cGU6IEdGWFR5cGUuRkxPQVQ0LCBjb3VudDogVUJPRm9yd2FyZExpZ2h0Lk1BWF9TUEhFUkVfTElHSFRTIH0sXG4vLyAgICAgICAgICAgICB7IG5hbWU6ICdjY19zcGhlcmVMaXRTaXplUmFuZ2UnLCB0eXBlOiBHRlhUeXBlLkZMT0FUNCwgY291bnQ6IFVCT0ZvcndhcmRMaWdodC5NQVhfU1BIRVJFX0xJR0hUUyB9LFxuLy8gICAgICAgICAgICAgeyBuYW1lOiAnY2Nfc3BoZXJlTGl0Q29sb3InLCB0eXBlOiBHRlhUeXBlLkZMT0FUNCwgY291bnQ6IFVCT0ZvcndhcmRMaWdodC5NQVhfU1BIRVJFX0xJR0hUUyB9LFxuLy8gICAgICAgICAgICAgeyBuYW1lOiAnY2Nfc3BvdExpdFBvcycsIHR5cGU6IEdGWFR5cGUuRkxPQVQ0LCBjb3VudDogVUJPRm9yd2FyZExpZ2h0Lk1BWF9TUE9UX0xJR0hUUyB9LFxuLy8gICAgICAgICAgICAgeyBuYW1lOiAnY2Nfc3BvdExpdFNpemVSYW5nZUFuZ2xlJywgdHlwZTogR0ZYVHlwZS5GTE9BVDQsIGNvdW50OiBVQk9Gb3J3YXJkTGlnaHQuTUFYX1NQT1RfTElHSFRTIH0sXG4vLyAgICAgICAgICAgICB7IG5hbWU6ICdjY19zcG90TGl0RGlyJywgdHlwZTogR0ZYVHlwZS5GTE9BVDQsIGNvdW50OiBVQk9Gb3J3YXJkTGlnaHQuTUFYX1NQT1RfTElHSFRTIH0sXG4vLyAgICAgICAgICAgICB7IG5hbWU6ICdjY19zcG90TGl0Q29sb3InLCB0eXBlOiBHRlhUeXBlLkZMT0FUNCwgY291bnQ6IFVCT0ZvcndhcmRMaWdodC5NQVhfU1BPVF9MSUdIVFMgfSxcbi8vICAgICAgICAgXSxcbi8vICAgICB9O1xuLy8gICAgIHB1YmxpYyB2aWV3OiBGbG9hdDMyQXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KFVCT0ZvcndhcmRMaWdodC5DT1VOVCk7XG4vLyB9XG4vLyBsb2NhbEJpbmRpbmdzRGVzYy5zZXQoVUJPRm9yd2FyZExpZ2h0LkJMT0NLLm5hbWUsIHtcbi8vICAgICB0eXBlOiBHRlhCaW5kaW5nVHlwZS5VTklGT1JNX0JVRkZFUixcbi8vICAgICBibG9ja0luZm86IFVCT0ZvcndhcmRMaWdodC5CTE9DSyxcbi8vIH0pO1xuLy8gZXhwb3J0IGNsYXNzIFVCT1NraW5uaW5nIHtcbi8vICAgICBwdWJsaWMgc3RhdGljIE1BVF9KT0lOVF9PRkZTRVQ6IG51bWJlciA9IDA7XG4vLyAgICAgcHVibGljIHN0YXRpYyBKT0lOVFNfVEVYVFVSRV9TSVpFX09GRlNFVDogbnVtYmVyID0gVUJPU2tpbm5pbmcuTUFUX0pPSU5UX09GRlNFVCArIDEyOCAqIDE2O1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgQ09VTlQ6IG51bWJlciA9IFVCT1NraW5uaW5nLkpPSU5UU19URVhUVVJFX1NJWkVfT0ZGU0VUICsgNDtcbi8vICAgICBwdWJsaWMgc3RhdGljIFNJWkU6IG51bWJlciA9IFVCT1NraW5uaW5nLkNPVU5UICogNDtcbi8vICAgICBwdWJsaWMgc3RhdGljIEJMT0NLOiBHRlhVbmlmb3JtQmxvY2sgPSB7XG4vLyAgICAgICAgIGJpbmRpbmc6IFVuaWZvcm1CaW5kaW5nLlVCT19TS0lOTklORywgbmFtZTogJ0NDU2tpbm5pbmcnLCBtZW1iZXJzOiBbXG4vLyAgICAgICAgICAgICB7IG5hbWU6ICdjY19tYXRKb2ludCcsIHR5cGU6IEdGWFR5cGUuTUFUNCwgY291bnQ6IDEyOCB9LFxuLy8gICAgICAgICAgICAgeyBuYW1lOiAnY2Nfam9pbnRzVGV4dHVyZVNpemUnLCB0eXBlOiBHRlhUeXBlLkZMT0FUNCwgY291bnQ6IDEgfSxcbi8vICAgICAgICAgXSxcbi8vICAgICB9O1xuLy8gfVxuLy8gbG9jYWxCaW5kaW5nc0Rlc2Muc2V0KFVCT1NraW5uaW5nLkJMT0NLLm5hbWUsIHtcbi8vICAgICB0eXBlOiBHRlhCaW5kaW5nVHlwZS5VTklGT1JNX0JVRkZFUixcbi8vICAgICBibG9ja0luZm86IFVCT1NraW5uaW5nLkJMT0NLLFxuLy8gfSk7XG4vLyBleHBvcnQgY29uc3QgVU5JRk9STV9KT0lOVFNfVEVYVFVSRTogR0ZYVW5pZm9ybVNhbXBsZXIgPSB7XG4vLyAgICAgYmluZGluZzogVW5pZm9ybUJpbmRpbmcuU0FNUExFUl9KT0lOVFMsIG5hbWU6ICdjY19qb2ludHNUZXh0dXJlJywgdHlwZTogR0ZYVHlwZS5TQU1QTEVSMkQsIGNvdW50OiAxLFxuLy8gfTtcbi8vIGxvY2FsQmluZGluZ3NEZXNjLnNldChVTklGT1JNX0pPSU5UU19URVhUVVJFLm5hbWUsIHtcbi8vICAgICB0eXBlOiBHRlhCaW5kaW5nVHlwZS5TQU1QTEVSLFxuLy8gICAgIHNhbXBsZXJJbmZvOiBVTklGT1JNX0pPSU5UU19URVhUVVJFLFxuLy8gfSk7XG4vLyBleHBvcnQgaW50ZXJmYWNlIElJbnRlcm5hbEJpbmRpbmdEZXNjIHtcbi8vICAgICB0eXBlOiBHRlhCaW5kaW5nVHlwZTtcbi8vICAgICBibG9ja0luZm8/OiBHRlhVbmlmb3JtQmxvY2s7XG4vLyAgICAgc2FtcGxlckluZm8/OiBHRlhVbmlmb3JtU2FtcGxlcjtcbi8vIH1cbi8vIGV4cG9ydCBpbnRlcmZhY2UgSUludGVybmFsQmluZGluZ0luc3QgZXh0ZW5kcyBJSW50ZXJuYWxCaW5kaW5nRGVzYyB7XG4vLyAgICAgYnVmZmVyPzogR0ZYQnVmZmVyO1xuLy8gICAgIHNhbXBsZXI/OiBHRlhTYW1wbGVyO1xuLy8gICAgIHRleHR1cmVWaWV3PzogR0ZYVGV4dHVyZVZpZXc7XG4vLyB9XG5cbi8vIHRoaXMgZmlsZSBpcyB1c2VkIGZvciBvZmZsaW5lIGVmZmVjdCBidWlsZGluZy5cbnZhciBfYSwgX2I7XG52YXIgU2FtcGxlckluZm9JbmRleDtcbihmdW5jdGlvbiAoU2FtcGxlckluZm9JbmRleCkge1xuICAgIFNhbXBsZXJJbmZvSW5kZXhbU2FtcGxlckluZm9JbmRleFtcIm1pbkZpbHRlclwiXSA9IDBdID0gXCJtaW5GaWx0ZXJcIjtcbiAgICBTYW1wbGVySW5mb0luZGV4W1NhbXBsZXJJbmZvSW5kZXhbXCJtYWdGaWx0ZXJcIl0gPSAxXSA9IFwibWFnRmlsdGVyXCI7XG4gICAgU2FtcGxlckluZm9JbmRleFtTYW1wbGVySW5mb0luZGV4W1wibWlwRmlsdGVyXCJdID0gMl0gPSBcIm1pcEZpbHRlclwiO1xuICAgIFNhbXBsZXJJbmZvSW5kZXhbU2FtcGxlckluZm9JbmRleFtcImFkZHJlc3NVXCJdID0gM10gPSBcImFkZHJlc3NVXCI7XG4gICAgU2FtcGxlckluZm9JbmRleFtTYW1wbGVySW5mb0luZGV4W1wiYWRkcmVzc1ZcIl0gPSA0XSA9IFwiYWRkcmVzc1ZcIjtcbiAgICBTYW1wbGVySW5mb0luZGV4W1NhbXBsZXJJbmZvSW5kZXhbXCJhZGRyZXNzV1wiXSA9IDVdID0gXCJhZGRyZXNzV1wiO1xuICAgIFNhbXBsZXJJbmZvSW5kZXhbU2FtcGxlckluZm9JbmRleFtcIm1heEFuaXNvdHJvcHlcIl0gPSA2XSA9IFwibWF4QW5pc290cm9weVwiO1xuICAgIFNhbXBsZXJJbmZvSW5kZXhbU2FtcGxlckluZm9JbmRleFtcImNtcEZ1bmNcIl0gPSA3XSA9IFwiY21wRnVuY1wiO1xuICAgIFNhbXBsZXJJbmZvSW5kZXhbU2FtcGxlckluZm9JbmRleFtcIm1pbkxPRFwiXSA9IDhdID0gXCJtaW5MT0RcIjtcbiAgICBTYW1wbGVySW5mb0luZGV4W1NhbXBsZXJJbmZvSW5kZXhbXCJtYXhMT0RcIl0gPSA5XSA9IFwibWF4TE9EXCI7XG4gICAgU2FtcGxlckluZm9JbmRleFtTYW1wbGVySW5mb0luZGV4W1wibWlwTE9EQmlhc1wiXSA9IDEwXSA9IFwibWlwTE9EQmlhc1wiO1xuICAgIFNhbXBsZXJJbmZvSW5kZXhbU2FtcGxlckluZm9JbmRleFtcImJvcmRlckNvbG9yXCJdID0gMTFdID0gXCJib3JkZXJDb2xvclwiO1xuICAgIFNhbXBsZXJJbmZvSW5kZXhbU2FtcGxlckluZm9JbmRleFtcInRvdGFsXCJdID0gMTVdID0gXCJ0b3RhbFwiO1xufSkoU2FtcGxlckluZm9JbmRleCB8fCAoU2FtcGxlckluZm9JbmRleCA9IHt9KSk7XG52YXIgdHlwZU1hcCA9IHt9O1xudHlwZU1hcFt0eXBlTWFwWydib29sJ10gPSBHRlhUeXBlLkJPT0xdID0gJ2Jvb2wnO1xudHlwZU1hcFt0eXBlTWFwWydpbnQnXSA9IEdGWFR5cGUuSU5UXSA9ICdpbnQnO1xudHlwZU1hcFt0eXBlTWFwWydpdmVjMiddID0gR0ZYVHlwZS5JTlQyXSA9ICdpdmVjMmludlR5cGVQYXJhbXMnO1xudHlwZU1hcFt0eXBlTWFwWydpdmVjMyddID0gR0ZYVHlwZS5JTlQzXSA9ICdpdmVjMyc7XG50eXBlTWFwW3R5cGVNYXBbJ2l2ZWM0J10gPSBHRlhUeXBlLklOVDRdID0gJ2l2ZWM0JztcbnR5cGVNYXBbdHlwZU1hcFsnZmxvYXQnXSA9IEdGWFR5cGUuRkxPQVRdID0gJ2Zsb2F0JztcbnR5cGVNYXBbdHlwZU1hcFsndmVjMiddID0gR0ZYVHlwZS5GTE9BVDJdID0gJ3ZlYzInO1xudHlwZU1hcFt0eXBlTWFwWyd2ZWMzJ10gPSBHRlhUeXBlLkZMT0FUM10gPSAndmVjMyc7XG50eXBlTWFwW3R5cGVNYXBbJ3ZlYzQnXSA9IEdGWFR5cGUuRkxPQVQ0XSA9ICd2ZWM0JztcbnR5cGVNYXBbdHlwZU1hcFsnbWF0MiddID0gR0ZYVHlwZS5NQVQyXSA9ICdtYXQyJztcbnR5cGVNYXBbdHlwZU1hcFsnbWF0MyddID0gR0ZYVHlwZS5NQVQzXSA9ICdtYXQzJztcbnR5cGVNYXBbdHlwZU1hcFsnbWF0NCddID0gR0ZYVHlwZS5NQVQ0XSA9ICdtYXQ0JztcbnR5cGVNYXBbdHlwZU1hcFsnc2FtcGxlcjJEJ10gPSBHRlhUeXBlLlNBTVBMRVIyRF0gPSAnc2FtcGxlcjJEJztcbnR5cGVNYXBbdHlwZU1hcFsnc2FtcGxlckN1YmUnXSA9IEdGWFR5cGUuU0FNUExFUl9DVUJFXSA9ICdzYW1wbGVyQ3ViZSc7XG52YXIgc2l6ZU1hcCA9IChfYSA9IHt9LFxuICAgIF9hW0dGWFR5cGUuQk9PTF0gPSA0LFxuICAgIF9hW0dGWFR5cGUuSU5UXSA9IDQsXG4gICAgX2FbR0ZYVHlwZS5JTlQyXSA9IDgsXG4gICAgX2FbR0ZYVHlwZS5JTlQzXSA9IDEyLFxuICAgIF9hW0dGWFR5cGUuSU5UNF0gPSAxNixcbiAgICBfYVtHRlhUeXBlLkZMT0FUXSA9IDQsXG4gICAgX2FbR0ZYVHlwZS5GTE9BVDJdID0gOCxcbiAgICBfYVtHRlhUeXBlLkZMT0FUM10gPSAxMixcbiAgICBfYVtHRlhUeXBlLkZMT0FUNF0gPSAxNixcbiAgICBfYVtHRlhUeXBlLk1BVDJdID0gMTYsXG4gICAgX2FbR0ZYVHlwZS5NQVQzXSA9IDM2LFxuICAgIF9hW0dGWFR5cGUuTUFUNF0gPSA2NCxcbiAgICBfYVtHRlhUeXBlLlNBTVBMRVIyRF0gPSA0LFxuICAgIF9hW0dGWFR5cGUuU0FNUExFUl9DVUJFXSA9IDQsXG4gICAgX2EpO1xudmFyIGZvcm1hdE1hcCA9IChfYiA9IHt9LFxuICAgIF9iW0dGWFR5cGUuQk9PTF0gPSBHRlhGb3JtYXQuUjMySSxcbiAgICBfYltHRlhUeXBlLklOVF0gPSBHRlhGb3JtYXQuUjMySSxcbiAgICBfYltHRlhUeXBlLklOVDJdID0gR0ZYRm9ybWF0LlJHMzJJLFxuICAgIF9iW0dGWFR5cGUuSU5UM10gPSBHRlhGb3JtYXQuUkdCMzJJLFxuICAgIF9iW0dGWFR5cGUuSU5UNF0gPSBHRlhGb3JtYXQuUkdCQTMySSxcbiAgICBfYltHRlhUeXBlLkZMT0FUXSA9IEdGWEZvcm1hdC5SMzJGLFxuICAgIF9iW0dGWFR5cGUuRkxPQVQyXSA9IEdGWEZvcm1hdC5SRzMyRixcbiAgICBfYltHRlhUeXBlLkZMT0FUM10gPSBHRlhGb3JtYXQuUkdCMzJGLFxuICAgIF9iW0dGWFR5cGUuRkxPQVQ0XSA9IEdGWEZvcm1hdC5SR0JBMzJGLFxuICAgIF9iKTtcbi8vIGNvbnN0IHBhc3NQYXJhbXMgPSB7XG4vLyAgIC8vIGNvbG9yIG1hc2tcbi8vICAgTk9ORTogZ2Z4LkdGWENvbG9yTWFzay5OT05FLFxuLy8gICBSOiBnZnguR0ZYQ29sb3JNYXNrLlIsXG4vLyAgIEc6IGdmeC5HRlhDb2xvck1hc2suRyxcbi8vICAgQjogZ2Z4LkdGWENvbG9yTWFzay5CLFxuLy8gICBBOiBnZnguR0ZYQ29sb3JNYXNrLkEsXG4vLyAgIFJHOiBnZnguR0ZYQ29sb3JNYXNrLlIgfCBnZnguR0ZYQ29sb3JNYXNrLkcsXG4vLyAgIFJCOiBnZnguR0ZYQ29sb3JNYXNrLlIgfCBnZnguR0ZYQ29sb3JNYXNrLkIsXG4vLyAgIFJBOiBnZnguR0ZYQ29sb3JNYXNrLlIgfCBnZnguR0ZYQ29sb3JNYXNrLkEsXG4vLyAgIEdCOiBnZnguR0ZYQ29sb3JNYXNrLkcgfCBnZnguR0ZYQ29sb3JNYXNrLkIsXG4vLyAgIEdBOiBnZnguR0ZYQ29sb3JNYXNrLkcgfCBnZnguR0ZYQ29sb3JNYXNrLkEsXG4vLyAgIEJBOiBnZnguR0ZYQ29sb3JNYXNrLkIgfCBnZnguR0ZYQ29sb3JNYXNrLkEsXG4vLyAgIFJHQjogZ2Z4LkdGWENvbG9yTWFzay5SIHwgZ2Z4LkdGWENvbG9yTWFzay5HIHwgZ2Z4LkdGWENvbG9yTWFzay5CLFxuLy8gICBSR0E6IGdmeC5HRlhDb2xvck1hc2suUiB8IGdmeC5HRlhDb2xvck1hc2suRyB8IGdmeC5HRlhDb2xvck1hc2suQSxcbi8vICAgUkJBOiBnZnguR0ZYQ29sb3JNYXNrLlIgfCBnZnguR0ZYQ29sb3JNYXNrLkIgfCBnZnguR0ZYQ29sb3JNYXNrLkEsXG4vLyAgIEdCQTogZ2Z4LkdGWENvbG9yTWFzay5HIHwgZ2Z4LkdGWENvbG9yTWFzay5CIHwgZ2Z4LkdGWENvbG9yTWFzay5BLFxuLy8gICBBTEw6IGdmeC5HRlhDb2xvck1hc2suQUxMLFxuLy8gICAvLyBibGVuZCBvcGVyYXRpb25cbi8vICAgQUREOiBnZnguR0ZYQmxlbmRPcC5BREQsXG4vLyAgIFNVQjogZ2Z4LkdGWEJsZW5kT3AuU1VCLFxuLy8gICBSRVZfU1VCOiBnZnguR0ZYQmxlbmRPcC5SRVZfU1VCLFxuLy8gICBNSU46IGdmeC5HRlhCbGVuZE9wLk1JTixcbi8vICAgTUFYOiBnZnguR0ZYQmxlbmRPcC5NQVgsXG4vLyAgIC8vIGJsZW5kIGZhY3RvclxuLy8gICBaRVJPOiBnZnguR0ZYQmxlbmRGYWN0b3IuWkVSTyxcbi8vICAgT05FOiBnZnguR0ZYQmxlbmRGYWN0b3IuT05FLFxuLy8gICBTUkNfQUxQSEE6IGdmeC5HRlhCbGVuZEZhY3Rvci5TUkNfQUxQSEEsXG4vLyAgIERTVF9BTFBIQTogZ2Z4LkdGWEJsZW5kRmFjdG9yLkRTVF9BTFBIQSxcbi8vICAgT05FX01JTlVTX1NSQ19BTFBIQTogZ2Z4LkdGWEJsZW5kRmFjdG9yLk9ORV9NSU5VU19TUkNfQUxQSEEsXG4vLyAgIE9ORV9NSU5VU19EU1RfQUxQSEE6IGdmeC5HRlhCbGVuZEZhY3Rvci5PTkVfTUlOVVNfRFNUX0FMUEhBLFxuLy8gICBTUkNfQ09MT1I6IGdmeC5HRlhCbGVuZEZhY3Rvci5TUkNfQ09MT1IsXG4vLyAgIERTVF9DT0xPUjogZ2Z4LkdGWEJsZW5kRmFjdG9yLkRTVF9DT0xPUixcbi8vICAgT05FX01JTlVTX1NSQ19DT0xPUjogZ2Z4LkdGWEJsZW5kRmFjdG9yLk9ORV9NSU5VU19TUkNfQ09MT1IsXG4vLyAgIE9ORV9NSU5VU19EU1RfQ09MT1I6IGdmeC5HRlhCbGVuZEZhY3Rvci5PTkVfTUlOVVNfRFNUX0NPTE9SLFxuLy8gICBTUkNfQUxQSEFfU0FUVVJBVEU6IGdmeC5HRlhCbGVuZEZhY3Rvci5TUkNfQUxQSEFfU0FUVVJBVEUsXG4vLyAgIENPTlNUQU5UX0NPTE9SOiBnZnguR0ZYQmxlbmRGYWN0b3IuQ09OU1RBTlRfQ09MT1IsXG4vLyAgIE9ORV9NSU5VU19DT05TVEFOVF9DT0xPUjogZ2Z4LkdGWEJsZW5kRmFjdG9yLk9ORV9NSU5VU19DT05TVEFOVF9DT0xPUixcbi8vICAgQ09OU1RBTlRfQUxQSEE6IGdmeC5HRlhCbGVuZEZhY3Rvci5DT05TVEFOVF9BTFBIQSxcbi8vICAgT05FX01JTlVTX0NPTlNUQU5UX0FMUEhBOiBnZnguR0ZYQmxlbmRGYWN0b3IuT05FX01JTlVTX0NPTlNUQU5UX0FMUEhBLFxuLy8gICAvLyBzdGVuY2lsIG9wZXJhdGlvblxuLy8gICAvLyBaRVJPOiBHRlhTdGVuY2lsT3AuWkVSTywgLy8gZHVwbGljYXRlLCBzYWZlbHkgcmVtb3ZlZCBiZWNhdXNlIGVudW0gdmFsdWUgaXMoYW5kIGFsd2F5cyB3aWxsIGJlKSB0aGUgc2FtZVxuLy8gICBLRUVQOiBnZnguR0ZYU3RlbmNpbE9wLktFRVAsXG4vLyAgIFJFUExBQ0U6IGdmeC5HRlhTdGVuY2lsT3AuUkVQTEFDRSxcbi8vICAgSU5DUjogZ2Z4LkdGWFN0ZW5jaWxPcC5JTkNSLFxuLy8gICBERUNSOiBnZnguR0ZYU3RlbmNpbE9wLkRFQ1IsXG4vLyAgIElOVkVSVDogZ2Z4LkdGWFN0ZW5jaWxPcC5JTlZFUlQsXG4vLyAgIElOQ1JfV1JBUDogZ2Z4LkdGWFN0ZW5jaWxPcC5JTkNSX1dSQVAsXG4vLyAgIERFQ1JfV1JBUDogZ2Z4LkdGWFN0ZW5jaWxPcC5ERUNSX1dSQVAsXG4vLyAgICAgLy8gY29tcGFyaXNvbiBmdW5jdGlvblxuLy8gICBORVZFUjogZ2Z4LkdGWENvbXBhcmlzb25GdW5jLk5FVkVSLFxuLy8gICBMRVNTOiBnZnguR0ZYQ29tcGFyaXNvbkZ1bmMuTEVTUyxcbi8vICAgRVFVQUw6IGdmeC5HRlhDb21wYXJpc29uRnVuYy5FUVVBTCxcbi8vICAgTEVTU19FUVVBTDogZ2Z4LkdGWENvbXBhcmlzb25GdW5jLkxFU1NfRVFVQUwsXG4vLyAgIEdSRUFURVI6IGdmeC5HRlhDb21wYXJpc29uRnVuYy5HUkVBVEVSLFxuLy8gICBOT1RfRVFVQUw6IGdmeC5HRlhDb21wYXJpc29uRnVuYy5OT1RfRVFVQUwsXG4vLyAgIEdSRUFURVJfRVFVQUw6IGdmeC5HRlhDb21wYXJpc29uRnVuYy5HUkVBVEVSX0VRVUFMLFxuLy8gICBBTFdBWVM6IGdmeC5HRlhDb21wYXJpc29uRnVuYy5BTFdBWVMsXG4vLyAgIC8vIGN1bGwgbW9kZVxuLy8gICAvLyBOT05FOiBHRlhDdWxsTW9kZS5OT05FLCAvLyBkdXBsaWNhdGUsIHNhZmVseSByZW1vdmVkIGJlY2F1c2UgZW51bSB2YWx1ZSBpcyhhbmQgYWx3YXlzIHdpbGwgYmUpIHRoZSBzYW1lXG4vLyAgIEZST05UOiBnZnguR0ZYQ3VsbE1vZGUuRlJPTlQsXG4vLyAgIEJBQ0s6IGdmeC5HRlhDdWxsTW9kZS5CQUNLLFxuLy8gICAvLyBzaGFkZSBtb2RlXG4vLyAgIEdPVVJBTkQ6IGdmeC5HRlhTaGFkZU1vZGVsLkdPVVJBTkQsXG4vLyAgIEZMQVQ6IGdmeC5HRlhTaGFkZU1vZGVsLkZMQVQsXG4vLyAgIC8vIHBvbHlnb24gbW9kZVxuLy8gICBGSUxMOiBnZnguR0ZYUG9seWdvbk1vZGUuRklMTCxcbi8vICAgTElORTogZ2Z4LkdGWFBvbHlnb25Nb2RlLkxJTkUsXG4vLyAgIFBPSU5UOiBnZnguR0ZYUG9seWdvbk1vZGUuUE9JTlQsXG4vLyAgIC8vIHByaW1pdGl2ZSBtb2RlXG4vLyAgIFBPSU5UX0xJU1Q6IGdmeC5HRlhQcmltaXRpdmVNb2RlLlBPSU5UX0xJU1QsXG4vLyAgIExJTkVfTElTVDogZ2Z4LkdGWFByaW1pdGl2ZU1vZGUuTElORV9MSVNULFxuLy8gICBMSU5FX1NUUklQOiBnZnguR0ZYUHJpbWl0aXZlTW9kZS5MSU5FX1NUUklQLFxuLy8gICBMSU5FX0xPT1A6IGdmeC5HRlhQcmltaXRpdmVNb2RlLkxJTkVfTE9PUCxcbi8vICAgVFJJQU5HTEVfTElTVDogZ2Z4LkdGWFByaW1pdGl2ZU1vZGUuVFJJQU5HTEVfTElTVCxcbi8vICAgVFJJQU5HTEVfU1RSSVA6IGdmeC5HRlhQcmltaXRpdmVNb2RlLlRSSUFOR0xFX1NUUklQLFxuLy8gICBUUklBTkdMRV9GQU46IGdmeC5HRlhQcmltaXRpdmVNb2RlLlRSSUFOR0xFX0ZBTixcbi8vICAgTElORV9MSVNUX0FESkFDRU5DWTogZ2Z4LkdGWFByaW1pdGl2ZU1vZGUuTElORV9MSVNUX0FESkFDRU5DWSxcbi8vICAgTElORV9TVFJJUF9BREpBQ0VOQ1k6IGdmeC5HRlhQcmltaXRpdmVNb2RlLkxJTkVfU1RSSVBfQURKQUNFTkNZLFxuLy8gICBUUklBTkdMRV9MSVNUX0FESkFDRU5DWTogZ2Z4LkdGWFByaW1pdGl2ZU1vZGUuVFJJQU5HTEVfTElTVF9BREpBQ0VOQ1ksXG4vLyAgIFRSSUFOR0xFX1NUUklQX0FESkFDRU5DWTogZ2Z4LkdGWFByaW1pdGl2ZU1vZGUuVFJJQU5HTEVfU1RSSVBfQURKQUNFTkNZLFxuLy8gICBUUklBTkdMRV9QQVRDSF9BREpBQ0VOQ1k6IGdmeC5HRlhQcmltaXRpdmVNb2RlLlRSSUFOR0xFX1BBVENIX0FESkFDRU5DWSxcbi8vICAgUVVBRF9QQVRDSF9MSVNUOiBnZnguR0ZYUHJpbWl0aXZlTW9kZS5RVUFEX1BBVENIX0xJU1QsXG4vLyAgIElTT19MSU5FX0xJU1Q6IGdmeC5HRlhQcmltaXRpdmVNb2RlLklTT19MSU5FX0xJU1QsXG4vLyAgIC8vIFBPSU5UOiBnZnguR0ZYRmlsdGVyLlBPSU5ULCAvLyBkdXBsaWNhdGUsIHNhZmVseSByZW1vdmVkIGJlY2F1c2UgZW51bSB2YWx1ZSBpcyhhbmQgYWx3YXlzIHdpbGwgYmUpIHRoZSBzYW1lXG4vLyAgIExJTkVBUjogZ2Z4LkdGWEZpbHRlci5MSU5FQVIsXG4vLyAgIEFOSVNPVFJPUElDOiBnZnguR0ZYRmlsdGVyLkFOSVNPVFJPUElDLFxuLy8gICBXUkFQOiBnZnguR0ZYQWRkcmVzcy5XUkFQLFxuLy8gICBNSVJST1I6IGdmeC5HRlhBZGRyZXNzLk1JUlJPUixcbi8vICAgQ0xBTVA6IGdmeC5HRlhBZGRyZXNzLkNMQU1QLFxuLy8gICBCT1JERVI6IGdmeC5HRlhBZGRyZXNzLkJPUkRFUixcbi8vICAgVklFV1BPUlQ6IGdmeC5HRlhEeW5hbWljU3RhdGUuVklFV1BPUlQsXG4vLyAgIFNDSVNTT1I6IGdmeC5HRlhEeW5hbWljU3RhdGUuU0NJU1NPUixcbi8vICAgTElORV9XSURUSDogZ2Z4LkdGWER5bmFtaWNTdGF0ZS5MSU5FX1dJRFRILFxuLy8gICBERVBUSF9CSUFTOiBnZnguR0ZYRHluYW1pY1N0YXRlLkRFUFRIX0JJQVMsXG4vLyAgIEJMRU5EX0NPTlNUQU5UUzogZ2Z4LkdGWER5bmFtaWNTdGF0ZS5CTEVORF9DT05TVEFOVFMsXG4vLyAgIERFUFRIX0JPVU5EUzogZ2Z4LkdGWER5bmFtaWNTdGF0ZS5ERVBUSF9CT1VORFMsXG4vLyAgIFNURU5DSUxfV1JJVEVfTUFTSzogZ2Z4LkdGWER5bmFtaWNTdGF0ZS5TVEVOQ0lMX1dSSVRFX01BU0ssXG4vLyAgIFNURU5DSUxfQ09NUEFSRV9NQVNLOiBnZnguR0ZYRHluYW1pY1N0YXRlLlNURU5DSUxfQ09NUEFSRV9NQVNLLFxuLy8gICBUUlVFOiB0cnVlLFxuLy8gICBGQUxTRTogZmFsc2Vcbi8vIH07XG52YXIgcGFzc1BhcmFtcyA9IHtcbiAgICBCQUNLOiBlbnVtcy5DVUxMX0JBQ0ssXG4gICAgRlJPTlQ6IGVudW1zLkNVTExfRlJPTlQsXG4gICAgTk9ORTogZW51bXMuQ1VMTF9OT05FLFxuICAgIEFERDogZW51bXMuQkxFTkRfRlVOQ19BREQsXG4gICAgU1VCOiBlbnVtcy5CTEVORF9GVU5DX1NVQlRSQUNULFxuICAgIFJFVl9TVUI6IGVudW1zLkJMRU5EX0ZVTkNfUkVWRVJTRV9TVUJUUkFDVCxcbiAgICBaRVJPOiBlbnVtcy5CTEVORF9aRVJPLFxuICAgIE9ORTogZW51bXMuQkxFTkRfT05FLFxuICAgIFNSQ19DT0xPUjogZW51bXMuQkxFTkRfU1JDX0NPTE9SLFxuICAgIE9ORV9NSU5VU19TUkNfQ09MT1I6IGVudW1zLkJMRU5EX09ORV9NSU5VU19TUkNfQ09MT1IsXG4gICAgRFNUX0NPTE9SOiBlbnVtcy5CTEVORF9EU1RfQ09MT1IsXG4gICAgT05FX01JTlVTX0RTVF9DT0xPUjogZW51bXMuQkxFTkRfT05FX01JTlVTX0RTVF9DT0xPUixcbiAgICBTUkNfQUxQSEE6IGVudW1zLkJMRU5EX1NSQ19BTFBIQSxcbiAgICBPTkVfTUlOVVNfU1JDX0FMUEhBOiBlbnVtcy5CTEVORF9PTkVfTUlOVVNfU1JDX0FMUEhBLFxuICAgIERTVF9BTFBIQTogZW51bXMuQkxFTkRfRFNUX0FMUEhBLFxuICAgIE9ORV9NSU5VU19EU1RfQUxQSEE6IGVudW1zLkJMRU5EX09ORV9NSU5VU19EU1RfQUxQSEEsXG4gICAgQ09OU1RBTlRfQ09MT1I6IGVudW1zLkJMRU5EX0NPTlNUQU5UX0NPTE9SLFxuICAgIE9ORV9NSU5VU19DT05TVEFOVF9DT0xPUjogZW51bXMuQkxFTkRfT05FX01JTlVTX0NPTlNUQU5UX0NPTE9SLFxuICAgIENPTlNUQU5UX0FMUEhBOiBlbnVtcy5CTEVORF9DT05TVEFOVF9BTFBIQSxcbiAgICBPTkVfTUlOVVNfQ09OU1RBTlRfQUxQSEE6IGVudW1zLkJMRU5EX09ORV9NSU5VU19DT05TVEFOVF9BTFBIQSxcbiAgICBTUkNfQUxQSEFfU0FUVVJBVEU6IGVudW1zLkJMRU5EX1NSQ19BTFBIQV9TQVRVUkFURSxcbiAgICBORVZFUjogZW51bXMuRFNfRlVOQ19ORVZFUixcbiAgICBMRVNTOiBlbnVtcy5EU19GVU5DX0xFU1MsXG4gICAgRVFVQUw6IGVudW1zLkRTX0ZVTkNfRVFVQUwsXG4gICAgTEVRVUFMOiBlbnVtcy5EU19GVU5DX0xFUVVBTCxcbiAgICBHUkVBVEVSOiBlbnVtcy5EU19GVU5DX0dSRUFURVIsXG4gICAgTk9URVFVQUw6IGVudW1zLkRTX0ZVTkNfTk9URVFVQUwsXG4gICAgR0VRVUFMOiBlbnVtcy5EU19GVU5DX0dFUVVBTCxcbiAgICBBTFdBWVM6IGVudW1zLkRTX0ZVTkNfQUxXQVlTLFxuICAgIEtFRVA6IGVudW1zLlNURU5DSUxfT1BfS0VFUCxcbiAgICBSRVBMQUNFOiBlbnVtcy5TVEVOQ0lMX09QX1JFUExBQ0UsXG4gICAgSU5DUjogZW51bXMuU1RFTkNJTF9PUF9JTkNSLFxuICAgIElOQ1JfV1JBUDogZW51bXMuU1RFTkNJTF9PUF9JTkNSX1dSQVAsXG4gICAgREVDUjogZW51bXMuU1RFTkNJTF9PUF9ERUNSLFxuICAgIERFQ1JfV1JBUDogZW51bXMuU1RFTkNJTF9PUF9ERUNSX1dSQVAsXG4gICAgSU5WRVJUOiBlbnVtcy5TVEVOQ0lMX09QX0lOVkVSVFxufTtcbk9iamVjdC5hc3NpZ24ocGFzc1BhcmFtcywgUmVuZGVyUGFzc1N0YWdlKTtcbi8vIGZvciBzdHJ1Y3R1cmFsIHR5cGUgY2hlY2tpbmdcbi8vIGFuICdhbnknIGtleSB3aWxsIGNoZWNrIGFnYWluc3QgYWxsIGVsZW1lbnRzIGRlZmluZWQgaW4gdGhhdCBvYmplY3Rcbi8vIGEga2V5IHN0YXJ0IHdpdGggJyQnIG1lYW5zIGl0cyBlc3NlbnRpYWwsIGFuZCBjYW4ndCBiZSB1bmRlZmluZWRcbnZhciBlZmZlY3RTdHJ1Y3R1cmUgPSB7XG4gICAgJHRlY2huaXF1ZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgJHBhc3NlczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgZGVwdGhTdGVuY2lsU3RhdGU6IHt9LFxuICAgICAgICAgICAgICAgICAgICByYXN0ZXJpemVyU3RhdGU6IHt9LFxuICAgICAgICAgICAgICAgICAgICBibGVuZFN0YXRlOiB7IHRhcmdldHM6IFt7fV0gfSxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllczogeyBhbnk6IHsgc2FtcGxlcjoge30sIGluc3BlY3Rvcjoge30gfSB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgXVxufTtcbnZhciBtYXBwaW5ncyA9IHtcbiAgICBtdXJtdXJoYXNoMl8zMl9nYzogbXVybXVyaGFzaDJfMzJfZ2MsXG4gICAgU2FtcGxlckluZm9JbmRleDogU2FtcGxlckluZm9JbmRleCxcbiAgICBlZmZlY3RTdHJ1Y3R1cmU6IGVmZmVjdFN0cnVjdHVyZSxcbiAgICB0eXBlTWFwOiB0eXBlTWFwLFxuICAgIHNpemVNYXA6IHNpemVNYXAsXG4gICAgZm9ybWF0TWFwOiBmb3JtYXRNYXAsXG4gICAgcGFzc1BhcmFtczogcGFzc1BhcmFtcyxcbiAgICBSZW5kZXJRdWV1ZTogUmVuZGVyUXVldWUsXG4gICAgUmVuZGVyUHJpb3JpdHk6IFJlbmRlclByaW9yaXR5LFxuICAgIEdGWEdldFR5cGVTaXplOiBHRlhHZXRUeXBlU2l6ZSxcbiAgICBVbmlmb3JtQmluZGluZzogVW5pZm9ybUJpbmRpbmdcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwcGluZ3M7XG4iXX0=