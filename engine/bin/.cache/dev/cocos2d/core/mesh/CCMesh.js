
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/mesh/CCMesh.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _inputAssembler = _interopRequireDefault(require("../../renderer/core/input-assembler"));

var _gfx = _interopRequireDefault(require("../../renderer/gfx"));

var _meshData = require("./mesh-data");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
var renderer = require('../renderer');

var EventTarget = require('../event/event-target');

function applyColor(data, offset, value) {
  data[offset] = value._val;
}

function applyVec2(data, offset, value) {
  data[offset] = value.x;
  data[offset + 1] = value.y;
}

function applyVec3(data, offset, value) {
  data[offset] = value.x;
  data[offset + 1] = value.y;
  data[offset + 2] = value.z;
}

var _compType2fn = {
  5120: 'getInt8',
  5121: 'getUint8',
  5122: 'getInt16',
  5123: 'getUint16',
  5124: 'getInt32',
  5125: 'getUint32',
  5126: 'getFloat32'
};
var _compType2write = {
  5120: 'setInt8',
  5121: 'setUint8',
  5122: 'setInt16',
  5123: 'setUint16',
  5124: 'setInt32',
  5125: 'setUint32',
  5126: 'setFloat32'
}; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView#Endianness

var littleEndian = function () {
  var buffer = new ArrayBuffer(2);
  new DataView(buffer).setInt16(0, 256, true); // Int16Array uses the platform's endianness.

  return new Int16Array(buffer)[0] === 256;
}();
/**
* @module cc
*/

/**
 * !#en Mesh Asset.
 * !#zh 网格资源。
 * @class Mesh
 * @extends Asset
 * @uses EventTarget
 */


var Mesh = cc.Class({
  name: 'cc.Mesh',
  "extends": cc.Asset,
  mixins: [EventTarget],
  properties: {
    _nativeAsset: {
      override: true,
      get: function get() {
        return this._buffer;
      },
      set: function set(bin) {
        this._buffer = ArrayBuffer.isView(bin) ? bin.buffer : bin;
        this.initWithBuffer();
      }
    },
    _vertexBundles: {
      "default": null,
      type: _meshData.VertexBundle
    },
    _primitives: {
      "default": null,
      Primitive: _meshData.Primitive
    },
    _minPos: cc.v3(),
    _maxPos: cc.v3(),

    /**
     * !#en Get ir set the sub meshes.
     * !#zh 设置或者获取子网格。
     * @property {[InputAssembler]} subMeshes
     */
    subMeshes: {
      get: function get() {
        return this._subMeshes;
      },
      set: function set(v) {
        this._subMeshes = v;
      }
    },
    subDatas: {
      get: function get() {
        return this._subDatas;
      }
    }
  },
  ctor: function ctor() {
    this._subMeshes = [];
    this.loaded = false;
    this._subDatas = [];
  },
  initWithBuffer: function initWithBuffer() {
    this._subMeshes.length = 0;
    var primitives = this._primitives;

    for (var i = 0; i < primitives.length; i++) {
      var primitive = primitives[i]; // ib

      var ibrange = primitive.data;
      var ibData = new Uint8Array(this._buffer, ibrange.offset, ibrange.length); // vb

      var vertexBundle = this._vertexBundles[primitive.vertexBundleIndices[0]];
      var vbRange = vertexBundle.data;
      var gfxVFmt = new _gfx["default"].VertexFormat(vertexBundle.formats); // Mesh binary may have several data format, must use Uint8Array to store data.

      var vbData = new Uint8Array(this._buffer, vbRange.offset, vbRange.length);

      var canBatch = this._canVertexFormatBatch(gfxVFmt);

      var meshData = new _meshData.MeshData();
      meshData.vData = vbData;
      meshData.iData = ibData;
      meshData.vfm = gfxVFmt;
      meshData.offset = vbRange.offset;
      meshData.canBatch = canBatch;

      this._subDatas.push(meshData);

      if (CC_JSB && CC_NATIVERENDERER) {
        meshData.vDirty = true;
      } else {
        var vbBuffer = new _gfx["default"].VertexBuffer(renderer.device, gfxVFmt, _gfx["default"].USAGE_STATIC, vbData);
        var ibBuffer = new _gfx["default"].IndexBuffer(renderer.device, primitive.indexUnit, _gfx["default"].USAGE_STATIC, ibData); // create sub meshes

        this._subMeshes.push(new _inputAssembler["default"](vbBuffer, ibBuffer));
      }
    }

    this.loaded = true;
    this.emit('load');
  },
  _canVertexFormatBatch: function _canVertexFormatBatch(format) {
    var aPosition = format._attr2el[_gfx["default"].ATTR_POSITION];
    var canBatch = !aPosition || aPosition.type === _gfx["default"].ATTR_TYPE_FLOAT32 && format._bytes % 4 === 0;
    return canBatch;
  },

  /**
   * !#en
   * Init vertex buffer according to the vertex format.
   * !#zh
   * 根据顶点格式初始化顶点内存。
   * @method init
   * @param {gfx.VertexFormat} vertexFormat - vertex format
   * @param {Number} vertexCount - how much vertex should be create in this buffer.
   * @param {Boolean} [dynamic] - whether or not to use dynamic buffer.
   * @param {Boolean} [index]
   */
  init: function init(vertexFormat, vertexCount, dynamic, index) {
    if (dynamic === void 0) {
      dynamic = false;
    }

    if (index === void 0) {
      index = 0;
    }

    var data = new Uint8Array(vertexFormat._bytes * vertexCount);
    var meshData = new _meshData.MeshData();
    meshData.vData = data;
    meshData.vfm = vertexFormat;
    meshData.vDirty = true;
    meshData.canBatch = this._canVertexFormatBatch(vertexFormat);

    if (!(CC_JSB && CC_NATIVERENDERER)) {
      var vb = new _gfx["default"].VertexBuffer(renderer.device, vertexFormat, dynamic ? _gfx["default"].USAGE_DYNAMIC : _gfx["default"].USAGE_STATIC, data);
      meshData.vb = vb;
      this._subMeshes[index] = new _inputAssembler["default"](meshData.vb);
    }

    var oldSubData = this._subDatas[index];

    if (oldSubData) {
      if (oldSubData.vb) {
        oldSubData.vb.destroy();
      }

      if (oldSubData.ib) {
        oldSubData.ib.destroy();
      }
    }

    this._subDatas[index] = meshData;
    this.loaded = true;
    this.emit('load');
    this.emit('init-format');
  },

  /**
   * !#en
   * Set the vertex values.
   * !#zh 
   * 设置顶点数据
   * @method setVertices
   * @param {String} name - the attribute name, e.g. gfx.ATTR_POSITION
   * @param {[Vec2] | [Vec3] | [Color] | [Number] | Uint8Array | Float32Array} values - the vertex values
   */
  setVertices: function setVertices(name, values, index) {
    index = index || 0;
    var subData = this._subDatas[index];
    var el = subData.vfm.element(name);

    if (!el) {
      return cc.warn("Cannot find " + name + " attribute in vertex defines.");
    } // whether the values is expanded


    var isFlatMode = typeof values[0] === 'number';
    var elNum = el.num;
    var verticesCount = isFlatMode ? values.length / elNum | 0 : values.length;

    if (subData.vData.byteLength < verticesCount * el.stride) {
      subData.vData = new Uint8Array(verticesCount * subData.vfm._bytes);
    }

    var data;
    var bytes = 4;

    if (name === _gfx["default"].ATTR_COLOR) {
      if (!isFlatMode) {
        data = subData.getVData(Uint32Array);
      } else {
        data = subData.getVData();
        bytes = 1;
      }
    } else {
      data = subData.getVData(Float32Array);
    }

    var stride = el.stride / bytes;
    var offset = el.offset / bytes;

    if (isFlatMode) {
      for (var i = 0, l = values.length / elNum; i < l; i++) {
        var sOffset = i * elNum;
        var dOffset = i * stride + offset;

        for (var j = 0; j < elNum; j++) {
          data[dOffset + j] = values[sOffset + j];
        }
      }
    } else {
      var applyFunc;

      if (name === _gfx["default"].ATTR_COLOR) {
        applyFunc = applyColor;
      } else {
        if (elNum === 2) {
          applyFunc = applyVec2;
        } else {
          applyFunc = applyVec3;
        }
      }

      for (var _i = 0, _l = values.length; _i < _l; _i++) {
        var v = values[_i];
        var vOffset = _i * stride + offset;
        applyFunc(data, vOffset, v);
      }
    }

    subData.vDirty = true;
  },

  /**
   * !#en
   * Set the sub mesh indices.
   * !#zh
   * 设置子网格索引。
   * @method setIndices
   * @param {[Number]|Uint16Array|Uint8Array} indices - the sub mesh indices.
   * @param {Number} [index] - sub mesh index.
   * @param {Boolean} [dynamic] - whether or not to use dynamic buffer.
   */
  setIndices: function setIndices(indices, index, dynamic) {
    index = index || 0;
    var iData = indices;

    if (indices instanceof Uint16Array) {
      iData = new Uint8Array(indices.buffer, indices.byteOffset, indices.byteLength);
    } else if (Array.isArray(indices)) {
      iData = new Uint16Array(indices);
      iData = new Uint8Array(iData.buffer, iData.byteOffset, iData.byteLength);
    }

    var usage = dynamic ? _gfx["default"].USAGE_DYNAMIC : _gfx["default"].USAGE_STATIC;
    var subData = this._subDatas[index];

    if (!subData.ib) {
      subData.iData = iData;

      if (!(CC_JSB && CC_NATIVERENDERER)) {
        var buffer = new _gfx["default"].IndexBuffer(renderer.device, _gfx["default"].INDEX_FMT_UINT16, usage, iData, iData.byteLength / _gfx["default"].IndexBuffer.BYTES_PER_INDEX[_gfx["default"].INDEX_FMT_UINT16]);
        subData.ib = buffer;
        this._subMeshes[index]._indexBuffer = subData.ib;
      }
    } else {
      subData.iData = iData;
      subData.iDirty = true;
    }
  },

  /**
   * !#en
   * Set the sub mesh primitive type.
   * !#zh
   * 设置子网格绘制线条的方式。
   * @method setPrimitiveType
   * @param {Number} type 
   * @param {Number} index 
   */
  setPrimitiveType: function setPrimitiveType(type, index) {
    index = index || 0;
    var subMesh = this._subMeshes[index];

    if (!subMesh) {
      cc.warn("Do not have sub mesh at index " + index);
      return;
    }

    this._subMeshes[index]._primitiveType = type;
  },

  /** 
   * !#en
   * Clear the buffer data.
   * !#zh
   * 清除网格创建的内存数据。
   * @method clear
  */
  clear: function clear() {
    this._subMeshes.length = 0;
    var subDatas = this._subDatas;

    for (var i = 0, len = subDatas.length; i < len; i++) {
      var vb = subDatas[i].vb;

      if (vb) {
        vb.destroy();
      }

      var ib = subDatas[i].ib;

      if (ib) {
        ib.destroy();
      }
    }

    subDatas.length = 0;
  },

  /**
   * !#en Set mesh bounding box
   * !#zh 设置网格的包围盒
   * @method setBoundingBox
   * @param {Vec3} min 
   * @param {Vec3} max 
   */
  setBoundingBox: function setBoundingBox(min, max) {
    this._minPos = min;
    this._maxPos = max;
  },
  destroy: function destroy() {
    this.clear();
  },
  _uploadData: function _uploadData() {
    var subDatas = this._subDatas;

    for (var i = 0, len = subDatas.length; i < len; i++) {
      var subData = subDatas[i];

      if (subData.vDirty) {
        var buffer = subData.vb,
            data = subData.vData;
        buffer.update(0, data);
        subData.vDirty = false;
      }

      if (subData.iDirty) {
        var _buffer = subData.ib,
            _data = subData.iData;

        _buffer.update(0, _data);

        subData.iDirty = false;
      }
    }
  },
  _getAttrMeshData: function _getAttrMeshData(subDataIndex, name) {
    var subData = this._subDatas[subDataIndex];
    if (!subData) return [];
    var format = subData.vfm;
    var fmt = format.element(name);
    if (!fmt) return [];

    if (!subData.attrDatas) {
      subData.attrDatas = {};
    }

    var attrDatas = subData.attrDatas;
    var data = attrDatas[name];

    if (data) {
      return data;
    } else {
      data = attrDatas[name] = [];
    }

    var vbData = subData.vData;
    var dv = new DataView(vbData.buffer, vbData.byteOffset, vbData.byteLength);
    var stride = fmt.stride;
    var eleOffset = fmt.offset;
    var eleNum = fmt.num;
    var eleByte = fmt.bytes / eleNum;
    var fn = _compType2fn[fmt.type];
    var vertexCount = vbData.byteLength / format._bytes;

    for (var i = 0; i < vertexCount; i++) {
      var offset = i * stride + eleOffset;

      for (var j = 0; j < eleNum; j++) {
        var v = dv[fn](offset + j * eleByte, littleEndian);
        data.push(v);
      }
    }

    return data;
  },

  /**
   * !#en Read the specified attributes of the subgrid into the target buffer.
   * !#zh 读取子网格的指定属性到目标缓冲区中。
   * @param {Number} primitiveIndex The subgrid index.
   * @param {String} attributeName attribute name.
   * @param {ArrayBuffer} buffer The target buffer.
   * @param {Number} stride The byte interval between adjacent attributes in the target buffer.
   * @param {Number} offset The offset of the first attribute in the target buffer.
   * @returns {Boolean} If the specified sub-grid does not exist, the sub-grid does not exist, or the specified attribute cannot be read, return `false`, otherwise return` true`.
   * @method copyAttribute
   */
  copyAttribute: function copyAttribute(primitiveIndex, attributeName, buffer, stride, offset) {
    var written = false;
    var subData = this._subDatas[primitiveIndex];
    if (!subData) return written;
    var format = subData.vfm;
    var fmt = format.element(attributeName);
    if (!fmt) return written;
    var writter = _compType2write[fmt.type];
    if (!writter) return written;

    var data = this._getAttrMeshData(primitiveIndex, attributeName);

    var vertexCount = subData.vData.byteLength / format._bytes;
    var eleByte = fmt.bytes / fmt.num;

    if (data.length > 0) {
      var outputView = new DataView(buffer, offset);
      var outputStride = stride;
      var num = fmt.num;

      for (var i = 0; i < vertexCount; ++i) {
        var index = i * num;

        for (var j = 0; j < num; ++j) {
          var inputOffset = index + j;
          var outputOffset = outputStride * i + eleByte * j;
          outputView[writter](outputOffset, data[inputOffset], littleEndian);
        }
      }

      written = true;
    }

    return written;
  },

  /**
   * !#en Read the index data of the subgrid into the target array.
   * !#zh 读取子网格的索引数据到目标数组中。
   * @param {Number} primitiveIndex The subgrid index.
   * @param {TypedArray} outputArray The target array.
   * @returns {Boolean} returns `false` if the specified sub-grid does not exist or the sub-grid does not have index data, otherwise returns` true`.
   * @method copyIndices
   */
  copyIndices: function copyIndices(primitiveIndex, outputArray) {
    var subData = this._subDatas[primitiveIndex];
    if (!subData) return false;
    var iData = subData.iData;
    var indexCount = iData.length / 2;
    var dv = new DataView(iData.buffer, iData.byteOffset, iData.byteLength);
    var fn = _compType2fn[_gfx["default"].INDEX_FMT_UINT8];

    for (var i = 0; i < indexCount; ++i) {
      outputArray[i] = dv[fn](i * 2);
    }

    return true;
  }
});
cc.Mesh = module.exports = Mesh;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDTWVzaC5qcyJdLCJuYW1lcyI6WyJyZW5kZXJlciIsInJlcXVpcmUiLCJFdmVudFRhcmdldCIsImFwcGx5Q29sb3IiLCJkYXRhIiwib2Zmc2V0IiwidmFsdWUiLCJfdmFsIiwiYXBwbHlWZWMyIiwieCIsInkiLCJhcHBseVZlYzMiLCJ6IiwiX2NvbXBUeXBlMmZuIiwiX2NvbXBUeXBlMndyaXRlIiwibGl0dGxlRW5kaWFuIiwiYnVmZmVyIiwiQXJyYXlCdWZmZXIiLCJEYXRhVmlldyIsInNldEludDE2IiwiSW50MTZBcnJheSIsIk1lc2giLCJjYyIsIkNsYXNzIiwibmFtZSIsIkFzc2V0IiwibWl4aW5zIiwicHJvcGVydGllcyIsIl9uYXRpdmVBc3NldCIsIm92ZXJyaWRlIiwiZ2V0IiwiX2J1ZmZlciIsInNldCIsImJpbiIsImlzVmlldyIsImluaXRXaXRoQnVmZmVyIiwiX3ZlcnRleEJ1bmRsZXMiLCJ0eXBlIiwiVmVydGV4QnVuZGxlIiwiX3ByaW1pdGl2ZXMiLCJQcmltaXRpdmUiLCJfbWluUG9zIiwidjMiLCJfbWF4UG9zIiwic3ViTWVzaGVzIiwiX3N1Yk1lc2hlcyIsInYiLCJzdWJEYXRhcyIsIl9zdWJEYXRhcyIsImN0b3IiLCJsb2FkZWQiLCJsZW5ndGgiLCJwcmltaXRpdmVzIiwiaSIsInByaW1pdGl2ZSIsImlicmFuZ2UiLCJpYkRhdGEiLCJVaW50OEFycmF5IiwidmVydGV4QnVuZGxlIiwidmVydGV4QnVuZGxlSW5kaWNlcyIsInZiUmFuZ2UiLCJnZnhWRm10IiwiZ2Z4IiwiVmVydGV4Rm9ybWF0IiwiZm9ybWF0cyIsInZiRGF0YSIsImNhbkJhdGNoIiwiX2NhblZlcnRleEZvcm1hdEJhdGNoIiwibWVzaERhdGEiLCJNZXNoRGF0YSIsInZEYXRhIiwiaURhdGEiLCJ2Zm0iLCJwdXNoIiwiQ0NfSlNCIiwiQ0NfTkFUSVZFUkVOREVSRVIiLCJ2RGlydHkiLCJ2YkJ1ZmZlciIsIlZlcnRleEJ1ZmZlciIsImRldmljZSIsIlVTQUdFX1NUQVRJQyIsImliQnVmZmVyIiwiSW5kZXhCdWZmZXIiLCJpbmRleFVuaXQiLCJJbnB1dEFzc2VtYmxlciIsImVtaXQiLCJmb3JtYXQiLCJhUG9zaXRpb24iLCJfYXR0cjJlbCIsIkFUVFJfUE9TSVRJT04iLCJBVFRSX1RZUEVfRkxPQVQzMiIsIl9ieXRlcyIsImluaXQiLCJ2ZXJ0ZXhGb3JtYXQiLCJ2ZXJ0ZXhDb3VudCIsImR5bmFtaWMiLCJpbmRleCIsInZiIiwiVVNBR0VfRFlOQU1JQyIsIm9sZFN1YkRhdGEiLCJkZXN0cm95IiwiaWIiLCJzZXRWZXJ0aWNlcyIsInZhbHVlcyIsInN1YkRhdGEiLCJlbCIsImVsZW1lbnQiLCJ3YXJuIiwiaXNGbGF0TW9kZSIsImVsTnVtIiwibnVtIiwidmVydGljZXNDb3VudCIsImJ5dGVMZW5ndGgiLCJzdHJpZGUiLCJieXRlcyIsIkFUVFJfQ09MT1IiLCJnZXRWRGF0YSIsIlVpbnQzMkFycmF5IiwiRmxvYXQzMkFycmF5IiwibCIsInNPZmZzZXQiLCJkT2Zmc2V0IiwiaiIsImFwcGx5RnVuYyIsInZPZmZzZXQiLCJzZXRJbmRpY2VzIiwiaW5kaWNlcyIsIlVpbnQxNkFycmF5IiwiYnl0ZU9mZnNldCIsIkFycmF5IiwiaXNBcnJheSIsInVzYWdlIiwiSU5ERVhfRk1UX1VJTlQxNiIsIkJZVEVTX1BFUl9JTkRFWCIsIl9pbmRleEJ1ZmZlciIsImlEaXJ0eSIsInNldFByaW1pdGl2ZVR5cGUiLCJzdWJNZXNoIiwiX3ByaW1pdGl2ZVR5cGUiLCJjbGVhciIsImxlbiIsInNldEJvdW5kaW5nQm94IiwibWluIiwibWF4IiwiX3VwbG9hZERhdGEiLCJ1cGRhdGUiLCJfZ2V0QXR0ck1lc2hEYXRhIiwic3ViRGF0YUluZGV4IiwiZm10IiwiYXR0ckRhdGFzIiwiZHYiLCJlbGVPZmZzZXQiLCJlbGVOdW0iLCJlbGVCeXRlIiwiZm4iLCJjb3B5QXR0cmlidXRlIiwicHJpbWl0aXZlSW5kZXgiLCJhdHRyaWJ1dGVOYW1lIiwid3JpdHRlbiIsIndyaXR0ZXIiLCJvdXRwdXRWaWV3Iiwib3V0cHV0U3RyaWRlIiwiaW5wdXRPZmZzZXQiLCJvdXRwdXRPZmZzZXQiLCJjb3B5SW5kaWNlcyIsIm91dHB1dEFycmF5IiwiaW5kZXhDb3VudCIsIklOREVYX0ZNVF9VSU5UOCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUE0QkE7O0FBQ0E7O0FBQ0E7Ozs7QUE5QkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxJQUFNQSxRQUFRLEdBQUdDLE9BQU8sQ0FBQyxhQUFELENBQXhCOztBQUNBLElBQU1DLFdBQVcsR0FBR0QsT0FBTyxDQUFDLHVCQUFELENBQTNCOztBQU1BLFNBQVNFLFVBQVQsQ0FBcUJDLElBQXJCLEVBQTJCQyxNQUEzQixFQUFtQ0MsS0FBbkMsRUFBMEM7QUFDdENGLEVBQUFBLElBQUksQ0FBQ0MsTUFBRCxDQUFKLEdBQWVDLEtBQUssQ0FBQ0MsSUFBckI7QUFDSDs7QUFFRCxTQUFTQyxTQUFULENBQW9CSixJQUFwQixFQUEwQkMsTUFBMUIsRUFBa0NDLEtBQWxDLEVBQXlDO0FBQ3JDRixFQUFBQSxJQUFJLENBQUNDLE1BQUQsQ0FBSixHQUFlQyxLQUFLLENBQUNHLENBQXJCO0FBQ0FMLEVBQUFBLElBQUksQ0FBQ0MsTUFBTSxHQUFHLENBQVYsQ0FBSixHQUFtQkMsS0FBSyxDQUFDSSxDQUF6QjtBQUNIOztBQUVELFNBQVNDLFNBQVQsQ0FBb0JQLElBQXBCLEVBQTBCQyxNQUExQixFQUFrQ0MsS0FBbEMsRUFBeUM7QUFDckNGLEVBQUFBLElBQUksQ0FBQ0MsTUFBRCxDQUFKLEdBQWVDLEtBQUssQ0FBQ0csQ0FBckI7QUFDQUwsRUFBQUEsSUFBSSxDQUFDQyxNQUFNLEdBQUcsQ0FBVixDQUFKLEdBQW1CQyxLQUFLLENBQUNJLENBQXpCO0FBQ0FOLEVBQUFBLElBQUksQ0FBQ0MsTUFBTSxHQUFHLENBQVYsQ0FBSixHQUFtQkMsS0FBSyxDQUFDTSxDQUF6QjtBQUNIOztBQUVELElBQU1DLFlBQVksR0FBRztBQUNqQixRQUFNLFNBRFc7QUFF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Q0FBZTRHLGNBQWYsQ0FBZDtBQUVBLFFBQUksQ0FBQ3BELE9BQUwsRUFBYyxPQUFPLEtBQVA7QUFFZCxRQUFNakMsS0FBSyxHQUFHaUMsT0FBTyxDQUFDakMsS0FBdEI7QUFDQSxRQUFNK0YsVUFBVSxHQUFHL0YsS0FBSyxDQUFDcEIsTUFBTixHQUFlLENBQWxDO0FBRUEsUUFBTW1HLEVBQUUsR0FBRyxJQUFJcEksUUFBSixDQUFhcUQsS0FBSyxDQUFDdkQsTUFBbkIsRUFBMkJ1RCxLQUFLLENBQUN5RCxVQUFqQyxFQUE2Q3pELEtBQUssQ0FBQ3lDLFVBQW5ELENBQVg7QUFDQSxRQUFNMEMsRUFBRSxHQUFHN0ksWUFBWSxDQUFDaUQsZ0JBQUl5RyxlQUFMLENBQXZCOztBQUVBLFNBQUssSUFBSWxILENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdpSCxVQUFwQixFQUFnQyxFQUFFakgsQ0FBbEMsRUFBcUM7QUFDakNnSCxNQUFBQSxXQUFXLENBQUNoSCxDQUFELENBQVgsR0FBaUJpRyxFQUFFLENBQUNJLEVBQUQsQ0FBRixDQUFPckcsQ0FBQyxHQUFHLENBQVgsQ0FBakI7QUFDSDs7QUFFRCxXQUFPLElBQVA7QUFDSDtBQXBlZSxDQUFULENBQVg7QUF1ZUEvQixFQUFFLENBQUNELElBQUgsR0FBVW1KLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnBKLElBQTNCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHA6Ly93d3cuY29jb3MuY29tXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCByZW5kZXJlciA9IHJlcXVpcmUoJy4uL3JlbmRlcmVyJyk7XG5jb25zdCBFdmVudFRhcmdldCA9IHJlcXVpcmUoJy4uL2V2ZW50L2V2ZW50LXRhcmdldCcpO1xuXG5pbXBvcnQgSW5wdXRBc3NlbWJsZXIgZnJvbSAnLi4vLi4vcmVuZGVyZXIvY29yZS9pbnB1dC1hc3NlbWJsZXInO1xuaW1wb3J0IGdmeCBmcm9tICcuLi8uLi9yZW5kZXJlci9nZngnO1xuaW1wb3J0IHsgUHJpbWl0aXZlLCBWZXJ0ZXhCdW5kbGUsIE1lc2hEYXRhfSBmcm9tICcuL21lc2gtZGF0YSc7XG5cbmZ1bmN0aW9uIGFwcGx5Q29sb3IgKGRhdGEsIG9mZnNldCwgdmFsdWUpIHtcbiAgICBkYXRhW29mZnNldF0gPSB2YWx1ZS5fdmFsO1xufVxuXG5mdW5jdGlvbiBhcHBseVZlYzIgKGRhdGEsIG9mZnNldCwgdmFsdWUpIHtcbiAgICBkYXRhW29mZnNldF0gPSB2YWx1ZS54O1xuICAgIGRhdGFbb2Zmc2V0ICsgMV0gPSB2YWx1ZS55O1xufVxuXG5mdW5jdGlvbiBhcHBseVZlYzMgKGRhdGEsIG9mZnNldCwgdmFsdWUpIHtcbiAgICBkYXRhW29mZnNldF0gPSB2YWx1ZS54O1xuICAgIGRhdGFbb2Zmc2V0ICsgMV0gPSB2YWx1ZS55O1xuICAgIGRhdGFbb2Zmc2V0ICsgMl0gPSB2YWx1ZS56O1xufVxuXG5jb25zdCBfY29tcFR5cGUyZm4gPSB7XG4gICAgNTEyMDogJ2dldEludDgnLFxuICAgIDUxMjE6ICdnZXRVaW50OCcsXG4gICAgNTEyMjogJ2dldEludDE2JyxcbiAgICA1MTIzOiAnZ2V0VWludDE2JyxcbiAgICA1MTI0OiAnZ2V0SW50MzInLFxuICAgIDUxMjU6ICdnZXRVaW50MzInLFxuICAgIDUxMjY6ICdnZXRGbG9hdDMyJyxcbn07XG5cbmNvbnN0IF9jb21wVHlwZTJ3cml0ZSA9IHtcbiAgICA1MTIwOiAnc2V0SW50OCcsXG4gICAgNTEyMTogJ3NldFVpbnQ4JyxcbiAgICA1MTIyOiAnc2V0SW50MTYnLFxuICAgIDUxMjM6ICdzZXRVaW50MTYnLFxuICAgIDUxMjQ6ICdzZXRJbnQzMicsXG4gICAgNTEyNTogJ3NldFVpbnQzMicsXG4gICAgNTEyNjogJ3NldEZsb2F0MzInLFxufTtcblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvRGF0YVZpZXcjRW5kaWFubmVzc1xuY29uc3QgbGl0dGxlRW5kaWFuID0gKGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDIpO1xuICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEludDE2KDAsIDI1NiwgdHJ1ZSk7XG4gICAgLy8gSW50MTZBcnJheSB1c2VzIHRoZSBwbGF0Zm9ybSdzIGVuZGlhbm5lc3MuXG4gICAgcmV0dXJuIG5ldyBJbnQxNkFycmF5KGJ1ZmZlcilbMF0gPT09IDI1Njtcbn0pKCk7XG5cbi8qKlxuKiBAbW9kdWxlIGNjXG4qL1xuLyoqXG4gKiAhI2VuIE1lc2ggQXNzZXQuXG4gKiAhI3poIOe9keagvOi1hOa6kOOAglxuICogQGNsYXNzIE1lc2hcbiAqIEBleHRlbmRzIEFzc2V0XG4gKiBAdXNlcyBFdmVudFRhcmdldFxuICovXG5sZXQgTWVzaCA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuTWVzaCcsXG4gICAgZXh0ZW5kczogY2MuQXNzZXQsXG4gICAgbWl4aW5zOiBbRXZlbnRUYXJnZXRdLFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBfbmF0aXZlQXNzZXQ6IHtcbiAgICAgICAgICAgIG92ZXJyaWRlOiB0cnVlLFxuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYnVmZmVyO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAoYmluKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYnVmZmVyID0gQXJyYXlCdWZmZXIuaXNWaWV3KGJpbikgPyBiaW4uYnVmZmVyIDogYmluO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdFdpdGhCdWZmZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfdmVydGV4QnVuZGxlczoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IFZlcnRleEJ1bmRsZVxuICAgICAgICB9LFxuICAgICAgICBfcHJpbWl0aXZlczoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIFByaW1pdGl2ZVxuICAgICAgICB9LFxuICAgICAgICBfbWluUG9zOiBjYy52MygpLFxuICAgICAgICBfbWF4UG9zOiBjYy52MygpLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIEdldCBpciBzZXQgdGhlIHN1YiBtZXNoZXMuXG4gICAgICAgICAqICEjemgg6K6+572u5oiW6ICF6I635Y+W5a2Q572R5qC844CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7W0lucHV0QXNzZW1ibGVyXX0gc3ViTWVzaGVzXG4gICAgICAgICAqL1xuICAgICAgICBzdWJNZXNoZXM6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N1Yk1lc2hlcztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdWJNZXNoZXMgPSB2O1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHN1YkRhdGFzIDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3ViRGF0YXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY3RvciAoKSB7XG4gICAgICAgIHRoaXMuX3N1Yk1lc2hlcyA9IFtdO1xuICAgICAgICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuX3N1YkRhdGFzID0gW107XG4gICAgfSxcblxuICAgIGluaXRXaXRoQnVmZmVyICgpIHtcbiAgICAgICAgdGhpcy5fc3ViTWVzaGVzLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgbGV0IHByaW1pdGl2ZXMgPSB0aGlzLl9wcmltaXRpdmVzO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByaW1pdGl2ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBwcmltaXRpdmUgPSBwcmltaXRpdmVzW2ldO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBpYlxuICAgICAgICAgICAgbGV0IGlicmFuZ2UgPSBwcmltaXRpdmUuZGF0YTtcbiAgICAgICAgICAgIGxldCBpYkRhdGEgPSBuZXcgVWludDhBcnJheSh0aGlzLl9idWZmZXIsIGlicmFuZ2Uub2Zmc2V0LCBpYnJhbmdlLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIC8vIHZiXG4gICAgICAgICAgICBsZXQgdmVydGV4QnVuZGxlID0gdGhpcy5fdmVydGV4QnVuZGxlc1twcmltaXRpdmUudmVydGV4QnVuZGxlSW5kaWNlc1swXV07XG4gICAgICAgICAgICBsZXQgdmJSYW5nZSA9IHZlcnRleEJ1bmRsZS5kYXRhO1xuICAgICAgICAgICAgbGV0IGdmeFZGbXQgPSBuZXcgZ2Z4LlZlcnRleEZvcm1hdCh2ZXJ0ZXhCdW5kbGUuZm9ybWF0cyk7XG4gICAgICAgICAgICAvLyBNZXNoIGJpbmFyeSBtYXkgaGF2ZSBzZXZlcmFsIGRhdGEgZm9ybWF0LCBtdXN0IHVzZSBVaW50OEFycmF5IHRvIHN0b3JlIGRhdGEuXG4gICAgICAgICAgICBsZXQgdmJEYXRhID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5fYnVmZmVyLCB2YlJhbmdlLm9mZnNldCwgdmJSYW5nZS5sZW5ndGgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBsZXQgY2FuQmF0Y2ggPSB0aGlzLl9jYW5WZXJ0ZXhGb3JtYXRCYXRjaChnZnhWRm10KTtcblxuICAgICAgICAgICAgbGV0IG1lc2hEYXRhID0gbmV3IE1lc2hEYXRhKCk7XG4gICAgICAgICAgICBtZXNoRGF0YS52RGF0YSA9IHZiRGF0YTtcbiAgICAgICAgICAgIG1lc2hEYXRhLmlEYXRhID0gaWJEYXRhO1xuICAgICAgICAgICAgbWVzaERhdGEudmZtID0gZ2Z4VkZtdDtcbiAgICAgICAgICAgIG1lc2hEYXRhLm9mZnNldCA9IHZiUmFuZ2Uub2Zmc2V0O1xuICAgICAgICAgICAgbWVzaERhdGEuY2FuQmF0Y2ggPSBjYW5CYXRjaDtcbiAgICAgICAgICAgIHRoaXMuX3N1YkRhdGFzLnB1c2gobWVzaERhdGEpO1xuXG4gICAgICAgICAgICBpZiAoQ0NfSlNCICYmIENDX05BVElWRVJFTkRFUkVSKSB7XG4gICAgICAgICAgICAgICAgbWVzaERhdGEudkRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IHZiQnVmZmVyID0gbmV3IGdmeC5WZXJ0ZXhCdWZmZXIoXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlcmVyLmRldmljZSxcbiAgICAgICAgICAgICAgICAgICAgZ2Z4VkZtdCxcbiAgICAgICAgICAgICAgICAgICAgZ2Z4LlVTQUdFX1NUQVRJQyxcbiAgICAgICAgICAgICAgICAgICAgdmJEYXRhXG4gICAgICAgICAgICAgICAgKTtcbiAgICBcbiAgICAgICAgICAgICAgICBsZXQgaWJCdWZmZXIgPSBuZXcgZ2Z4LkluZGV4QnVmZmVyKFxuICAgICAgICAgICAgICAgICAgICByZW5kZXJlci5kZXZpY2UsXG4gICAgICAgICAgICAgICAgICAgIHByaW1pdGl2ZS5pbmRleFVuaXQsXG4gICAgICAgICAgICAgICAgICAgIGdmeC5VU0FHRV9TVEFUSUMsXG4gICAgICAgICAgICAgICAgICAgIGliRGF0YVxuICAgICAgICAgICAgICAgICk7XG4gICAgXG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIHN1YiBtZXNoZXNcbiAgICAgICAgICAgICAgICB0aGlzLl9zdWJNZXNoZXMucHVzaChuZXcgSW5wdXRBc3NlbWJsZXIodmJCdWZmZXIsIGliQnVmZmVyKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmVtaXQoJ2xvYWQnKTtcbiAgICB9LFxuXG4gICAgX2NhblZlcnRleEZvcm1hdEJhdGNoIChmb3JtYXQpIHtcbiAgICAgICAgbGV0IGFQb3NpdGlvbiA9IGZvcm1hdC5fYXR0cjJlbFtnZnguQVRUUl9QT1NJVElPTl07XG4gICAgICAgIGxldCBjYW5CYXRjaCA9ICFhUG9zaXRpb24gfHwgXG4gICAgICAgICAgICAoYVBvc2l0aW9uLnR5cGUgPT09IGdmeC5BVFRSX1RZUEVfRkxPQVQzMiAmJiBcbiAgICAgICAgICAgIGZvcm1hdC5fYnl0ZXMgJSA0ID09PSAwKTtcbiAgICAgICAgcmV0dXJuIGNhbkJhdGNoO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogSW5pdCB2ZXJ0ZXggYnVmZmVyIGFjY29yZGluZyB0byB0aGUgdmVydGV4IGZvcm1hdC5cbiAgICAgKiAhI3poXG4gICAgICog5qC55o2u6aG254K55qC85byP5Yid5aeL5YyW6aG254K55YaF5a2Y44CCXG4gICAgICogQG1ldGhvZCBpbml0XG4gICAgICogQHBhcmFtIHtnZnguVmVydGV4Rm9ybWF0fSB2ZXJ0ZXhGb3JtYXQgLSB2ZXJ0ZXggZm9ybWF0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHZlcnRleENvdW50IC0gaG93IG11Y2ggdmVydGV4IHNob3VsZCBiZSBjcmVhdGUgaW4gdGhpcyBidWZmZXIuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbZHluYW1pY10gLSB3aGV0aGVyIG9yIG5vdCB0byB1c2UgZHluYW1pYyBidWZmZXIuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbaW5kZXhdXG4gICAgICovXG4gICAgaW5pdCAodmVydGV4Rm9ybWF0LCB2ZXJ0ZXhDb3VudCwgZHluYW1pYyA9IGZhbHNlLCBpbmRleCA9IDApIHtcbiAgICAgICAgbGV0IGRhdGEgPSBuZXcgVWludDhBcnJheSh2ZXJ0ZXhGb3JtYXQuX2J5dGVzICogdmVydGV4Q291bnQpO1xuICAgICAgICBsZXQgbWVzaERhdGEgPSBuZXcgTWVzaERhdGEoKTtcbiAgICAgICAgbWVzaERhdGEudkRhdGEgPSBkYXRhO1xuICAgICAgICBtZXNoRGF0YS52Zm0gPSB2ZXJ0ZXhGb3JtYXQ7XG4gICAgICAgIG1lc2hEYXRhLnZEaXJ0eSA9IHRydWU7XG4gICAgICAgIG1lc2hEYXRhLmNhbkJhdGNoID0gdGhpcy5fY2FuVmVydGV4Rm9ybWF0QmF0Y2godmVydGV4Rm9ybWF0KTtcblxuICAgICAgICBpZiAoIShDQ19KU0IgJiYgQ0NfTkFUSVZFUkVOREVSRVIpKSB7XG4gICAgICAgICAgICBsZXQgdmIgPSBuZXcgZ2Z4LlZlcnRleEJ1ZmZlcihcbiAgICAgICAgICAgICAgICByZW5kZXJlci5kZXZpY2UsXG4gICAgICAgICAgICAgICAgdmVydGV4Rm9ybWF0LFxuICAgICAgICAgICAgICAgIGR5bmFtaWMgPyBnZnguVVNBR0VfRFlOQU1JQyA6IGdmeC5VU0FHRV9TVEFUSUMsXG4gICAgICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIG1lc2hEYXRhLnZiID0gdmI7IFxuICAgICAgICAgICAgdGhpcy5fc3ViTWVzaGVzW2luZGV4XSA9IG5ldyBJbnB1dEFzc2VtYmxlcihtZXNoRGF0YS52Yik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgb2xkU3ViRGF0YSA9IHRoaXMuX3N1YkRhdGFzW2luZGV4XTtcbiAgICAgICAgaWYgKG9sZFN1YkRhdGEpIHtcbiAgICAgICAgICAgIGlmIChvbGRTdWJEYXRhLnZiKSB7XG4gICAgICAgICAgICAgICAgb2xkU3ViRGF0YS52Yi5kZXN0cm95KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob2xkU3ViRGF0YS5pYikge1xuICAgICAgICAgICAgICAgIG9sZFN1YkRhdGEuaWIuZGVzdHJveSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fc3ViRGF0YXNbaW5kZXhdID0gbWVzaERhdGE7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmxvYWRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuZW1pdCgnbG9hZCcpO1xuICAgICAgICB0aGlzLmVtaXQoJ2luaXQtZm9ybWF0Jyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBTZXQgdGhlIHZlcnRleCB2YWx1ZXMuXG4gICAgICogISN6aCBcbiAgICAgKiDorr7nva7pobbngrnmlbDmja5cbiAgICAgKiBAbWV0aG9kIHNldFZlcnRpY2VzXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSB0aGUgYXR0cmlidXRlIG5hbWUsIGUuZy4gZ2Z4LkFUVFJfUE9TSVRJT05cbiAgICAgKiBAcGFyYW0ge1tWZWMyXSB8IFtWZWMzXSB8IFtDb2xvcl0gfCBbTnVtYmVyXSB8IFVpbnQ4QXJyYXkgfCBGbG9hdDMyQXJyYXl9IHZhbHVlcyAtIHRoZSB2ZXJ0ZXggdmFsdWVzXG4gICAgICovXG4gICAgc2V0VmVydGljZXMgKG5hbWUsIHZhbHVlcywgaW5kZXgpIHtcbiAgICAgICAgaW5kZXggPSBpbmRleCB8fCAwO1xuICAgICAgICBsZXQgc3ViRGF0YSA9IHRoaXMuX3N1YkRhdGFzW2luZGV4XTtcblxuICAgICAgICBsZXQgZWwgPSBzdWJEYXRhLnZmbS5lbGVtZW50KG5hbWUpO1xuICAgICAgICBpZiAoIWVsKSB7XG4gICAgICAgICAgICByZXR1cm4gY2Mud2FybihgQ2Fubm90IGZpbmQgJHtuYW1lfSBhdHRyaWJ1dGUgaW4gdmVydGV4IGRlZmluZXMuYCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB3aGV0aGVyIHRoZSB2YWx1ZXMgaXMgZXhwYW5kZWRcbiAgICAgICAgbGV0IGlzRmxhdE1vZGUgPSB0eXBlb2YgdmFsdWVzWzBdID09PSAnbnVtYmVyJztcblxuICAgICAgICBsZXQgZWxOdW0gPSBlbC5udW07XG4gICAgICAgIGxldCB2ZXJ0aWNlc0NvdW50ID0gaXNGbGF0TW9kZSA/ICgodmFsdWVzLmxlbmd0aCAvIGVsTnVtKSB8IDApIDogdmFsdWVzLmxlbmd0aDtcbiAgICAgICAgaWYgKHN1YkRhdGEudkRhdGEuYnl0ZUxlbmd0aCA8IHZlcnRpY2VzQ291bnQgKiBlbC5zdHJpZGUpIHtcbiAgICAgICAgICAgIHN1YkRhdGEudkRhdGEgPSBuZXcgVWludDhBcnJheSh2ZXJ0aWNlc0NvdW50ICogc3ViRGF0YS52Zm0uX2J5dGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBkYXRhO1xuICAgICAgICBsZXQgYnl0ZXMgPSA0O1xuICAgICAgICBpZiAobmFtZSA9PT0gZ2Z4LkFUVFJfQ09MT1IpIHtcbiAgICAgICAgICAgIGlmICghaXNGbGF0TW9kZSkge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBzdWJEYXRhLmdldFZEYXRhKFVpbnQzMkFycmF5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBzdWJEYXRhLmdldFZEYXRhKCk7XG4gICAgICAgICAgICAgICAgYnl0ZXMgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRhdGEgPSBzdWJEYXRhLmdldFZEYXRhKEZsb2F0MzJBcnJheSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc3RyaWRlID0gZWwuc3RyaWRlIC8gYnl0ZXM7XG4gICAgICAgIGxldCBvZmZzZXQgPSBlbC5vZmZzZXQgLyBieXRlcztcblxuICAgICAgICBpZiAoaXNGbGF0TW9kZSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSAodmFsdWVzLmxlbmd0aCAvIGVsTnVtKTsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBzT2Zmc2V0ID0gaSAqIGVsTnVtO1xuICAgICAgICAgICAgICAgIGxldCBkT2Zmc2V0ID0gaSAqIHN0cmlkZSArIG9mZnNldDtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGVsTnVtOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVtkT2Zmc2V0ICsgal0gPSB2YWx1ZXNbc09mZnNldCArIGpdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBhcHBseUZ1bmM7XG4gICAgICAgICAgICBpZiAobmFtZSA9PT0gZ2Z4LkFUVFJfQ09MT1IpIHtcbiAgICAgICAgICAgICAgICBhcHBseUZ1bmMgPSBhcHBseUNvbG9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGVsTnVtID09PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIGFwcGx5RnVuYyA9IGFwcGx5VmVjMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFwcGx5RnVuYyA9IGFwcGx5VmVjMztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdmFsdWVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCB2ID0gdmFsdWVzW2ldO1xuICAgICAgICAgICAgICAgIGxldCB2T2Zmc2V0ID0gaSAqIHN0cmlkZSArIG9mZnNldDtcbiAgICAgICAgICAgICAgICBhcHBseUZ1bmMoZGF0YSwgdk9mZnNldCwgdik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3ViRGF0YS52RGlydHkgPSB0cnVlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogU2V0IHRoZSBzdWIgbWVzaCBpbmRpY2VzLlxuICAgICAqICEjemhcbiAgICAgKiDorr7nva7lrZDnvZHmoLzntKLlvJXjgIJcbiAgICAgKiBAbWV0aG9kIHNldEluZGljZXNcbiAgICAgKiBAcGFyYW0ge1tOdW1iZXJdfFVpbnQxNkFycmF5fFVpbnQ4QXJyYXl9IGluZGljZXMgLSB0aGUgc3ViIG1lc2ggaW5kaWNlcy5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW2luZGV4XSAtIHN1YiBtZXNoIGluZGV4LlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2R5bmFtaWNdIC0gd2hldGhlciBvciBub3QgdG8gdXNlIGR5bmFtaWMgYnVmZmVyLlxuICAgICAqL1xuICAgIHNldEluZGljZXMgKGluZGljZXMsIGluZGV4LCBkeW5hbWljKSB7XG4gICAgICAgIGluZGV4ID0gaW5kZXggfHwgMDtcblxuICAgICAgICBsZXQgaURhdGEgPSBpbmRpY2VzO1xuICAgICAgICBpZiAoaW5kaWNlcyBpbnN0YW5jZW9mIFVpbnQxNkFycmF5KSB7XG4gICAgICAgICAgICBpRGF0YSA9IG5ldyBVaW50OEFycmF5KGluZGljZXMuYnVmZmVyLCBpbmRpY2VzLmJ5dGVPZmZzZXQsIGluZGljZXMuYnl0ZUxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShpbmRpY2VzKSkge1xuICAgICAgICAgICAgaURhdGEgPSBuZXcgVWludDE2QXJyYXkoaW5kaWNlcyk7XG4gICAgICAgICAgICBpRGF0YSA9IG5ldyBVaW50OEFycmF5KGlEYXRhLmJ1ZmZlciwgaURhdGEuYnl0ZU9mZnNldCwgaURhdGEuYnl0ZUxlbmd0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdXNhZ2UgPSBkeW5hbWljID8gZ2Z4LlVTQUdFX0RZTkFNSUMgOiBnZnguVVNBR0VfU1RBVElDO1xuXG4gICAgICAgIGxldCBzdWJEYXRhID0gdGhpcy5fc3ViRGF0YXNbaW5kZXhdO1xuICAgICAgICBpZiAoIXN1YkRhdGEuaWIpIHtcbiAgICAgICAgICAgIHN1YkRhdGEuaURhdGEgPSBpRGF0YTtcbiAgICAgICAgICAgIGlmICghKENDX0pTQiAmJiBDQ19OQVRJVkVSRU5ERVJFUikpIHtcbiAgICAgICAgICAgICAgICBsZXQgYnVmZmVyID0gbmV3IGdmeC5JbmRleEJ1ZmZlcihcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyZXIuZGV2aWNlLFxuICAgICAgICAgICAgICAgICAgICBnZnguSU5ERVhfRk1UX1VJTlQxNixcbiAgICAgICAgICAgICAgICAgICAgdXNhZ2UsXG4gICAgICAgICAgICAgICAgICAgIGlEYXRhLFxuICAgICAgICAgICAgICAgICAgICBpRGF0YS5ieXRlTGVuZ3RoIC8gZ2Z4LkluZGV4QnVmZmVyLkJZVEVTX1BFUl9JTkRFWFtnZnguSU5ERVhfRk1UX1VJTlQxNl1cbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgc3ViRGF0YS5pYiA9IGJ1ZmZlcjtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdWJNZXNoZXNbaW5kZXhdLl9pbmRleEJ1ZmZlciA9IHN1YkRhdGEuaWI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzdWJEYXRhLmlEYXRhID0gaURhdGE7XG4gICAgICAgICAgICBzdWJEYXRhLmlEaXJ0eSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNldCB0aGUgc3ViIG1lc2ggcHJpbWl0aXZlIHR5cGUuXG4gICAgICogISN6aFxuICAgICAqIOiuvue9ruWtkOe9keagvOe7mOWItue6v+adoeeahOaWueW8j+OAglxuICAgICAqIEBtZXRob2Qgc2V0UHJpbWl0aXZlVHlwZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0eXBlIFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBcbiAgICAgKi9cbiAgICBzZXRQcmltaXRpdmVUeXBlICh0eXBlLCBpbmRleCkge1xuICAgICAgICBpbmRleCA9IGluZGV4IHx8IDA7XG4gICAgICAgIGxldCBzdWJNZXNoID0gdGhpcy5fc3ViTWVzaGVzW2luZGV4XTtcbiAgICAgICAgaWYgKCFzdWJNZXNoKSB7XG4gICAgICAgICAgICBjYy53YXJuKGBEbyBub3QgaGF2ZSBzdWIgbWVzaCBhdCBpbmRleCAke2luZGV4fWApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3N1Yk1lc2hlc1tpbmRleF0uX3ByaW1pdGl2ZVR5cGUgPSB0eXBlO1xuICAgIH0sXG5cbiAgICAvKiogXG4gICAgICogISNlblxuICAgICAqIENsZWFyIHRoZSBidWZmZXIgZGF0YS5cbiAgICAgKiAhI3poXG4gICAgICog5riF6Zmk572R5qC85Yib5bu655qE5YaF5a2Y5pWw5o2u44CCXG4gICAgICogQG1ldGhvZCBjbGVhclxuICAgICovXG4gICAgY2xlYXIgKCkge1xuICAgICAgICB0aGlzLl9zdWJNZXNoZXMubGVuZ3RoID0gMDtcblxuICAgICAgICBsZXQgc3ViRGF0YXMgPSB0aGlzLl9zdWJEYXRhcztcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHN1YkRhdGFzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgdmIgPSBzdWJEYXRhc1tpXS52YjtcbiAgICAgICAgICAgIGlmICh2Yikge1xuICAgICAgICAgICAgICAgIHZiLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IGliID0gc3ViRGF0YXNbaV0uaWI7XG4gICAgICAgICAgICBpZiAoaWIpIHtcbiAgICAgICAgICAgICAgICBpYi5kZXN0cm95KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3ViRGF0YXMubGVuZ3RoID0gMDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgbWVzaCBib3VuZGluZyBib3hcbiAgICAgKiAhI3poIOiuvue9rue9keagvOeahOWMheWbtOebklxuICAgICAqIEBtZXRob2Qgc2V0Qm91bmRpbmdCb3hcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IG1pbiBcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IG1heCBcbiAgICAgKi9cbiAgICBzZXRCb3VuZGluZ0JveCAobWluLCBtYXgpIHtcbiAgICAgICAgdGhpcy5fbWluUG9zID0gbWluO1xuICAgICAgICB0aGlzLl9tYXhQb3MgPSBtYXg7XG4gICAgfSxcblxuICAgIGRlc3Ryb3kgKCkge1xuICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgfSxcblxuICAgIF91cGxvYWREYXRhICgpIHtcbiAgICAgICAgbGV0IHN1YkRhdGFzID0gdGhpcy5fc3ViRGF0YXM7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBzdWJEYXRhcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgbGV0IHN1YkRhdGEgPSBzdWJEYXRhc1tpXTtcblxuICAgICAgICAgICAgaWYgKHN1YkRhdGEudkRpcnR5KSB7XG4gICAgICAgICAgICAgICAgbGV0IGJ1ZmZlciA9IHN1YkRhdGEudmIsIGRhdGEgPSBzdWJEYXRhLnZEYXRhO1xuICAgICAgICAgICAgICAgIGJ1ZmZlci51cGRhdGUoMCwgZGF0YSk7XG4gICAgICAgICAgICAgICAgc3ViRGF0YS52RGlydHkgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHN1YkRhdGEuaURpcnR5KSB7XG4gICAgICAgICAgICAgICAgbGV0IGJ1ZmZlciA9IHN1YkRhdGEuaWIsIGRhdGEgPSBzdWJEYXRhLmlEYXRhO1xuICAgICAgICAgICAgICAgIGJ1ZmZlci51cGRhdGUoMCwgZGF0YSk7XG4gICAgICAgICAgICAgICAgc3ViRGF0YS5pRGlydHkgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZ2V0QXR0ck1lc2hEYXRhIChzdWJEYXRhSW5kZXgsIG5hbWUpIHtcbiAgICAgICAgbGV0IHN1YkRhdGEgPSB0aGlzLl9zdWJEYXRhc1tzdWJEYXRhSW5kZXhdO1xuICAgICAgICBpZiAoIXN1YkRhdGEpIHJldHVybiBbXTtcblxuICAgICAgICBsZXQgZm9ybWF0ID0gc3ViRGF0YS52Zm07XG4gICAgICAgIGxldCBmbXQgPSBmb3JtYXQuZWxlbWVudChuYW1lKTtcbiAgICAgICAgaWYgKCFmbXQpIHJldHVybiBbXTtcblxuICAgICAgICBpZiAoIXN1YkRhdGEuYXR0ckRhdGFzKSB7XG4gICAgICAgICAgICBzdWJEYXRhLmF0dHJEYXRhcyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGxldCBhdHRyRGF0YXMgPSBzdWJEYXRhLmF0dHJEYXRhcztcbiAgICAgICAgbGV0IGRhdGEgPSBhdHRyRGF0YXNbbmFtZV07XG4gICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRhdGEgPSBhdHRyRGF0YXNbbmFtZV0gPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB2YkRhdGEgPSBzdWJEYXRhLnZEYXRhO1xuICAgICAgICBsZXQgZHYgPSBuZXcgRGF0YVZpZXcodmJEYXRhLmJ1ZmZlciwgdmJEYXRhLmJ5dGVPZmZzZXQsIHZiRGF0YS5ieXRlTGVuZ3RoKTtcblxuICAgICAgICBsZXQgc3RyaWRlID0gZm10LnN0cmlkZTtcbiAgICAgICAgbGV0IGVsZU9mZnNldCA9IGZtdC5vZmZzZXQ7XG4gICAgICAgIGxldCBlbGVOdW0gPSBmbXQubnVtO1xuICAgICAgICBsZXQgZWxlQnl0ZSA9IGZtdC5ieXRlcyAvIGVsZU51bTtcbiAgICAgICAgbGV0IGZuID0gX2NvbXBUeXBlMmZuW2ZtdC50eXBlXTtcbiAgICAgICAgbGV0IHZlcnRleENvdW50ID0gdmJEYXRhLmJ5dGVMZW5ndGggLyBmb3JtYXQuX2J5dGVzO1xuICAgICAgICBcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2ZXJ0ZXhDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgb2Zmc2V0ID0gaSAqIHN0cmlkZSArIGVsZU9mZnNldDtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZWxlTnVtOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgdiA9IGR2W2ZuXShvZmZzZXQgKyBqICogZWxlQnl0ZSwgbGl0dGxlRW5kaWFuKTtcbiAgICAgICAgICAgICAgICBkYXRhLnB1c2godik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZWFkIHRoZSBzcGVjaWZpZWQgYXR0cmlidXRlcyBvZiB0aGUgc3ViZ3JpZCBpbnRvIHRoZSB0YXJnZXQgYnVmZmVyLlxuICAgICAqICEjemgg6K+75Y+W5a2Q572R5qC855qE5oyH5a6a5bGe5oCn5Yiw55uu5qCH57yT5Yay5Yy65Lit44CCXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHByaW1pdGl2ZUluZGV4IFRoZSBzdWJncmlkIGluZGV4LlxuwqDCoMKgwqDCoCogQHBhcmFtIHtTdHJpbmd9IGF0dHJpYnV0ZU5hbWUgYXR0cmlidXRlIG5hbWUuXG7CoMKgwqDCoMKgKiBAcGFyYW0ge0FycmF5QnVmZmVyfSBidWZmZXIgVGhlIHRhcmdldCBidWZmZXIuXG7CoMKgwqDCoMKgKiBAcGFyYW0ge051bWJlcn0gc3RyaWRlIFRoZSBieXRlIGludGVydmFsIGJldHdlZW4gYWRqYWNlbnQgYXR0cmlidXRlcyBpbiB0aGUgdGFyZ2V0IGJ1ZmZlci5cbsKgwqDCoMKgwqAqIEBwYXJhbSB7TnVtYmVyfSBvZmZzZXQgVGhlIG9mZnNldCBvZiB0aGUgZmlyc3QgYXR0cmlidXRlIGluIHRoZSB0YXJnZXQgYnVmZmVyLlxuwqDCoMKgwqDCoCogQHJldHVybnMge0Jvb2xlYW59IElmIHRoZSBzcGVjaWZpZWQgc3ViLWdyaWQgZG9lcyBub3QgZXhpc3QsIHRoZSBzdWItZ3JpZCBkb2VzIG5vdCBleGlzdCwgb3IgdGhlIHNwZWNpZmllZCBhdHRyaWJ1dGUgY2Fubm90IGJlIHJlYWQsIHJldHVybiBgZmFsc2VgLCBvdGhlcndpc2UgcmV0dXJuYCB0cnVlYC5cbiAgICAgKiBAbWV0aG9kIGNvcHlBdHRyaWJ1dGVcbiAgICAgKi9cbiAgICBjb3B5QXR0cmlidXRlIChwcmltaXRpdmVJbmRleCwgYXR0cmlidXRlTmFtZSwgYnVmZmVyLCBzdHJpZGUsIG9mZnNldCkge1xuICAgICAgICBsZXQgd3JpdHRlbiA9IGZhbHNlO1xuICAgICAgICBsZXQgc3ViRGF0YSA9IHRoaXMuX3N1YkRhdGFzW3ByaW1pdGl2ZUluZGV4XTtcblxuICAgICAgICBpZiAoIXN1YkRhdGEpIHJldHVybiB3cml0dGVuO1xuXG4gICAgICAgIGxldCBmb3JtYXQgPSBzdWJEYXRhLnZmbTtcbiAgICAgICAgbGV0IGZtdCA9IGZvcm1hdC5lbGVtZW50KGF0dHJpYnV0ZU5hbWUpO1xuXG4gICAgICAgIGlmICghZm10KSByZXR1cm4gd3JpdHRlbjtcblxuICAgICAgICBsZXQgd3JpdHRlciA9IF9jb21wVHlwZTJ3cml0ZVtmbXQudHlwZV07XG5cbiAgICAgICAgaWYgKCF3cml0dGVyKSByZXR1cm4gd3JpdHRlbjtcblxuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuX2dldEF0dHJNZXNoRGF0YShwcmltaXRpdmVJbmRleCwgYXR0cmlidXRlTmFtZSk7XG4gICAgICAgIGxldCB2ZXJ0ZXhDb3VudCA9IHN1YkRhdGEudkRhdGEuYnl0ZUxlbmd0aCAvIGZvcm1hdC5fYnl0ZXM7XG4gICAgICAgIGxldCBlbGVCeXRlID0gZm10LmJ5dGVzIC8gZm10Lm51bTtcblxuICAgICAgICBpZiAoZGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBvdXRwdXRWaWV3ID0gbmV3IERhdGFWaWV3KGJ1ZmZlciwgb2Zmc2V0KTtcbiAgICAgICAgXG4gICAgICAgICAgICBsZXQgb3V0cHV0U3RyaWRlID0gc3RyaWRlO1xuICAgICAgICAgICAgbGV0IG51bSA9IGZtdC5udW07XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmVydGV4Q291bnQ7ICsraSkge1xuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IGkgKiBudW07XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBudW07ICsraikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnB1dE9mZnNldCA9IGluZGV4ICsgajtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3V0cHV0T2Zmc2V0ID0gb3V0cHV0U3RyaWRlICogaSArIGVsZUJ5dGUgKiBqO1xuXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dFZpZXdbd3JpdHRlcl0ob3V0cHV0T2Zmc2V0LCBkYXRhW2lucHV0T2Zmc2V0XSwgbGl0dGxlRW5kaWFuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdyaXR0ZW4gPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHdyaXR0ZW47XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmVhZCB0aGUgaW5kZXggZGF0YSBvZiB0aGUgc3ViZ3JpZCBpbnRvIHRoZSB0YXJnZXQgYXJyYXkuXG4gICAgICogISN6aCDor7vlj5blrZDnvZHmoLznmoTntKLlvJXmlbDmja7liLDnm67moIfmlbDnu4TkuK3jgIJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcHJpbWl0aXZlSW5kZXggVGhlIHN1YmdyaWQgaW5kZXguXG7CoMKgwqDCoMKgKiBAcGFyYW0ge1R5cGVkQXJyYXl9IG91dHB1dEFycmF5IFRoZSB0YXJnZXQgYXJyYXkuXG7CoMKgwqDCoMKgKiBAcmV0dXJucyB7Qm9vbGVhbn0gcmV0dXJucyBgZmFsc2VgIGlmIHRoZSBzcGVjaWZpZWQgc3ViLWdyaWQgZG9lcyBub3QgZXhpc3Qgb3IgdGhlIHN1Yi1ncmlkIGRvZXMgbm90IGhhdmUgaW5kZXggZGF0YSwgb3RoZXJ3aXNlIHJldHVybnNgIHRydWVgLlxuICAgICAqIEBtZXRob2QgY29weUluZGljZXNcbiAgICAgKi9cbiAgICBjb3B5SW5kaWNlcyAocHJpbWl0aXZlSW5kZXgsIG91dHB1dEFycmF5KSB7XG4gICAgICAgIGxldCBzdWJEYXRhID0gdGhpcy5fc3ViRGF0YXNbcHJpbWl0aXZlSW5kZXhdO1xuXG4gICAgICAgIGlmICghc3ViRGF0YSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IGlEYXRhID0gc3ViRGF0YS5pRGF0YTtcbiAgICAgICAgY29uc3QgaW5kZXhDb3VudCA9IGlEYXRhLmxlbmd0aCAvIDI7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBkdiA9IG5ldyBEYXRhVmlldyhpRGF0YS5idWZmZXIsIGlEYXRhLmJ5dGVPZmZzZXQsIGlEYXRhLmJ5dGVMZW5ndGgpO1xuICAgICAgICBjb25zdCBmbiA9IF9jb21wVHlwZTJmbltnZnguSU5ERVhfRk1UX1VJTlQ4XTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluZGV4Q291bnQ7ICsraSkge1xuICAgICAgICAgICAgb3V0cHV0QXJyYXlbaV0gPSBkdltmbl0oaSAqIDIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufSk7XG5cbmNjLk1lc2ggPSBtb2R1bGUuZXhwb3J0cyA9IE1lc2g7XG4iXX0=