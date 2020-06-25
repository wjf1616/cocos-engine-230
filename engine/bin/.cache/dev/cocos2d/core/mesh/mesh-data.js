
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/mesh/mesh-data.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.MeshData = MeshData;
exports.Primitive = exports.VertexBundle = exports.VertexFormat = exports.BufferRange = void 0;

var _gfx = _interopRequireDefault(require("../../renderer/gfx"));

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

/**
 * The class BufferRange denotes a range of the buffer.
 */
var BufferRange = cc.Class({
  name: 'cc.BufferRange',
  properties: {
    /**
     * The offset of the range.
     * @property {Number} offset
     */
    offset: 0,

    /**
     * The length of the range.
     * @property {Number} length
     */
    length: 0
  }
});
exports.BufferRange = BufferRange;
var VertexFormat = cc.Class({
  name: 'cc.mesh.VertexFormat',
  properties: {
    name: '',
    type: -1,
    num: -1,
    normalize: false
  }
});
/**
 * A vertex bundle describes a serials of vertex attributes.
 * These vertex attributes occupy a range of the buffer and
 * are interleaved, no padding bytes, in the range.
 */

exports.VertexFormat = VertexFormat;
var VertexBundle = cc.Class({
  name: 'cc.mesh.VertexBundle',
  properties: {
    /**
     * The data range of this bundle.
     * This range of data is essentially mapped to a GPU vertex buffer.
     * @property {BufferRange} data
     */
    data: {
      "default": null,
      type: BufferRange
    },

    /**
     * The attribute formats.
     * @property {VertexFormat} formats
     */
    formats: {
      "default": [],
      type: VertexFormat
    },

    /**
     * The bundle's vertices count.
     */
    verticesCount: 0
  }
});
/**
 * A primitive is a geometry constituted with a list of
 * same topology primitive graphic(such as points, lines or triangles).
 */

exports.VertexBundle = VertexBundle;
var Primitive = cc.Class({
  name: 'cc.mesh.Primitive',
  properties: {
    /**
     * The vertex bundle that the primitive use.
     * @property {[Number]} vertexBundleIndices
     */
    vertexBundleIndices: {
      "default": [],
      type: cc.Float
    },

    /**
     * The data range of the primitive.
     * This range of data is essentially mapped to a GPU indices buffer.
     * @property {BufferRange} data
     */
    data: {
      "default": null,
      type: BufferRange
    },

    /**
     * The type of this primitive's indices.
     * @property {Number} indexUnit
     */
    indexUnit: _gfx["default"].INDEX_FMT_UINT16,

    /**
     * The primitive's topology.
     * @property {Number} topology
     */
    topology: _gfx["default"].PT_TRIANGLES
  }
});
exports.Primitive = Primitive;

function MeshData() {
  this.vData = null; // Uint8Array;

  this.float32VData = null;
  this.uint32VData = null;
  this.iData = null; // Uint8Array;

  this.uint16IData = null;
  this.vfm = null;
  this.offset = 0;
  this.vb = null;
  this.ib = null;
  this.vDirty = false;
  this.iDirty = false;
  this.enable = true;
}

MeshData.prototype.getVData = function (format) {
  if (format === Float32Array) {
    if (!this.float32VData) {
      this.float32VData = new Float32Array(this.vData.buffer, this.vData.byteOffset, this.vData.byteLength / 4);
    }

    return this.float32VData;
  } else if (format === Uint32Array) {
    if (!this.uint32VData) {
      this.uint32VData = new Uint32Array(this.vData.buffer, this.vData.byteOffset, this.vData.byteLength / 4);
    }

    return this.uint32VData;
  }

  return this.vData;
};

MeshData.prototype.getIData = function (format) {
  if (format === Uint16Array) {
    if (!this.uint16IData) {
      this.uint16IData = new Uint16Array(this.iData.buffer, this.iData.byteOffset, this.iData.byteLength / 2);
    }

    return this.uint16IData;
  }

  return this.iData;
};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1lc2gtZGF0YS5qcyJdLCJuYW1lcyI6WyJCdWZmZXJSYW5nZSIsImNjIiwiQ2xhc3MiLCJuYW1lIiwicHJvcGVydGllcyIsIm9mZnNldCIsImxlbmd0aCIsIlZlcnRleEZvcm1hdCIsInR5cGUiLCJudW0iLCJub3JtYWxpemUiLCJWZXJ0ZXhCdW5kbGUiLCJkYXRhIiwiZm9ybWF0cyIsInZlcnRpY2VzQ291bnQiLCJQcmltaXRpdmUiLCJ2ZXJ0ZXhCdW5kbGVJbmRpY2VzIiwiRmxvYXQiLCJpbmRleFVuaXQiLCJnZngiLCJJTkRFWF9GTVRfVUlOVDE2IiwidG9wb2xvZ3kiLCJQVF9UUklBTkdMRVMiLCJNZXNoRGF0YSIsInZEYXRhIiwiZmxvYXQzMlZEYXRhIiwidWludDMyVkRhdGEiLCJpRGF0YSIsInVpbnQxNklEYXRhIiwidmZtIiwidmIiLCJpYiIsInZEaXJ0eSIsImlEaXJ0eSIsImVuYWJsZSIsInByb3RvdHlwZSIsImdldFZEYXRhIiwiZm9ybWF0IiwiRmxvYXQzMkFycmF5IiwiYnVmZmVyIiwiYnl0ZU9mZnNldCIsImJ5dGVMZW5ndGgiLCJVaW50MzJBcnJheSIsImdldElEYXRhIiwiVWludDE2QXJyYXkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBOzs7O0FBekJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkJBOzs7QUFHTyxJQUFJQSxXQUFXLEdBQUdDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQzlCQyxFQUFBQSxJQUFJLEVBQUUsZ0JBRHdCO0FBRzlCQyxFQUFBQSxVQUFVLEVBQUU7QUFDUjs7OztBQUlBQyxJQUFBQSxNQUFNLEVBQUUsQ0FMQTs7QUFNUjs7OztBQUlBQyxJQUFBQSxNQUFNLEVBQUU7QUFWQTtBQUhrQixDQUFULENBQWxCOztBQWlCQSxJQUFJQyxZQUFZLEdBQUdOLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQy9CQyxFQUFBQSxJQUFJLEVBQUUsc0JBRHlCO0FBRy9CQyxFQUFBQSxVQUFVLEVBQUU7QUFDUkQsSUFBQUEsSUFBSSxFQUFFLEVBREU7QUFFUkssSUFBQUEsSUFBSSxFQUFFLENBQUMsQ0FGQztBQUdSQyxJQUFBQSxHQUFHLEVBQUUsQ0FBQyxDQUhFO0FBSVJDLElBQUFBLFNBQVMsRUFBRTtBQUpIO0FBSG1CLENBQVQsQ0FBbkI7QUFXUDs7Ozs7OztBQUtPLElBQUlDLFlBQVksR0FBR1YsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDL0JDLEVBQUFBLElBQUksRUFBRSxzQkFEeUI7QUFFL0JDLEVBQUFBLFVBQVUsRUFBRTtBQUNSOzs7OztBQUtBUSxJQUFBQSxJQUFJLEVBQUU7QUFDRixpQkFBUyxJQURQO0FBRUZKLE1BQUFBLElBQUksRUFBRVI7QUFGSixLQU5FOztBQVVSOzs7O0FBSUFhLElBQUFBLE9BQU8sRUFBRTtBQUNMLGlCQUFTLEVBREo7QUFFTEwsTUFBQUEsSUFBSSxFQUFFRDtBQUZELEtBZEQ7O0FBa0JSOzs7QUFHQU8sSUFBQUEsYUFBYSxFQUFFO0FBckJQO0FBRm1CLENBQVQsQ0FBbkI7QUEyQlA7Ozs7OztBQUlPLElBQUlDLFNBQVMsR0FBR2QsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDNUJDLEVBQUFBLElBQUksRUFBRSxtQkFEc0I7QUFFNUJDLEVBQUFBLFVBQVUsRUFBRTtBQUNSOzs7O0FBSUFZLElBQUFBLG1CQUFtQixFQUFFO0FBQ2pCLGlCQUFTLEVBRFE7QUFFakJSLE1BQUFBLElBQUksRUFBRVAsRUFBRSxDQUFDZ0I7QUFGUSxLQUxiOztBQVNSOzs7OztBQUtBTCxJQUFBQSxJQUFJLEVBQUU7QUFDRixpQkFBUyxJQURQO0FBRUZKLE1BQUFBLElBQUksRUFBRVI7QUFGSixLQWRFOztBQWtCUjs7OztBQUlBa0IsSUFBQUEsU0FBUyxFQUFFQyxnQkFBSUMsZ0JBdEJQOztBQXVCUjs7OztBQUlBQyxJQUFBQSxRQUFRLEVBQUVGLGdCQUFJRztBQTNCTjtBQUZnQixDQUFULENBQWhCOzs7QUFpQ0EsU0FBU0MsUUFBVCxHQUFxQjtBQUN4QixPQUFLQyxLQUFMLEdBQWEsSUFBYixDQUR3QixDQUNKOztBQUNwQixPQUFLQyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsT0FBS0MsV0FBTCxHQUFtQixJQUFuQjtBQUNBLE9BQUtDLEtBQUwsR0FBYSxJQUFiLENBSndCLENBSUo7O0FBQ3BCLE9BQUtDLFdBQUwsR0FBbUIsSUFBbkI7QUFDQSxPQUFLQyxHQUFMLEdBQVcsSUFBWDtBQUNBLE9BQUt4QixNQUFMLEdBQWMsQ0FBZDtBQUVBLE9BQUt5QixFQUFMLEdBQVUsSUFBVjtBQUNBLE9BQUtDLEVBQUwsR0FBVSxJQUFWO0FBQ0EsT0FBS0MsTUFBTCxHQUFjLEtBQWQ7QUFDQSxPQUFLQyxNQUFMLEdBQWMsS0FBZDtBQUVBLE9BQUtDLE1BQUwsR0FBYyxJQUFkO0FBQ0g7O0FBRURYLFFBQVEsQ0FBQ1ksU0FBVCxDQUFtQkMsUUFBbkIsR0FBOEIsVUFBVUMsTUFBVixFQUFrQjtBQUM1QyxNQUFJQSxNQUFNLEtBQUtDLFlBQWYsRUFBNkI7QUFDekIsUUFBSSxDQUFDLEtBQUtiLFlBQVYsRUFBd0I7QUFDcEIsV0FBS0EsWUFBTCxHQUFvQixJQUFJYSxZQUFKLENBQWlCLEtBQUtkLEtBQUwsQ0FBV2UsTUFBNUIsRUFBb0MsS0FBS2YsS0FBTCxDQUFXZ0IsVUFBL0MsRUFBMkQsS0FBS2hCLEtBQUwsQ0FBV2lCLFVBQVgsR0FBd0IsQ0FBbkYsQ0FBcEI7QUFDSDs7QUFDRCxXQUFPLEtBQUtoQixZQUFaO0FBQ0gsR0FMRCxNQU1LLElBQUlZLE1BQU0sS0FBS0ssV0FBZixFQUE0QjtBQUM3QixRQUFJLENBQUMsS0FBS2hCLFdBQVYsRUFBdUI7QUFDbkIsV0FBS0EsV0FBTCxHQUFtQixJQUFJZ0IsV0FBSixDQUFnQixLQUFLbEIsS0FBTCxDQUFXZSxNQUEzQixFQUFtQyxLQUFLZixLQUFMLENBQVdnQixVQUE5QyxFQUEwRCxLQUFLaEIsS0FBTCxDQUFXaUIsVUFBWCxHQUF3QixDQUFsRixDQUFuQjtBQUNIOztBQUNELFdBQU8sS0FBS2YsV0FBWjtBQUNIOztBQUNELFNBQU8sS0FBS0YsS0FBWjtBQUNILENBZEQ7O0FBZ0JBRCxRQUFRLENBQUNZLFNBQVQsQ0FBbUJRLFFBQW5CLEdBQThCLFVBQVVOLE1BQVYsRUFBa0I7QUFDNUMsTUFBSUEsTUFBTSxLQUFLTyxXQUFmLEVBQTRCO0FBQ3hCLFFBQUksQ0FBQyxLQUFLaEIsV0FBVixFQUF1QjtBQUNuQixXQUFLQSxXQUFMLEdBQW1CLElBQUlnQixXQUFKLENBQWdCLEtBQUtqQixLQUFMLENBQVdZLE1BQTNCLEVBQW1DLEtBQUtaLEtBQUwsQ0FBV2EsVUFBOUMsRUFBMEQsS0FBS2IsS0FBTCxDQUFXYyxVQUFYLEdBQXdCLENBQWxGLENBQW5CO0FBQ0g7O0FBQ0QsV0FBTyxLQUFLYixXQUFaO0FBQ0g7O0FBQ0QsU0FBTyxLQUFLRCxLQUFaO0FBQ0gsQ0FSRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwOi8vd3d3LmNvY29zLmNvbVxuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IGdmeCBmcm9tICcuLi8uLi9yZW5kZXJlci9nZngnO1xuXG4vKipcbiAqIFRoZSBjbGFzcyBCdWZmZXJSYW5nZSBkZW5vdGVzIGEgcmFuZ2Ugb2YgdGhlIGJ1ZmZlci5cbiAqL1xuZXhwb3J0IGxldCBCdWZmZXJSYW5nZSA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuQnVmZmVyUmFuZ2UnLFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIG9mZnNldCBvZiB0aGUgcmFuZ2UuXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBvZmZzZXRcbiAgICAgICAgICovXG4gICAgICAgIG9mZnNldDogMCxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBsZW5ndGggb2YgdGhlIHJhbmdlLlxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gbGVuZ3RoXG4gICAgICAgICAqL1xuICAgICAgICBsZW5ndGg6IDBcbiAgICB9XG59KTtcblxuZXhwb3J0IGxldCBWZXJ0ZXhGb3JtYXQgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLm1lc2guVmVydGV4Rm9ybWF0JyxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgbmFtZTogJycsXG4gICAgICAgIHR5cGU6IC0xLFxuICAgICAgICBudW06IC0xLFxuICAgICAgICBub3JtYWxpemU6IGZhbHNlXG4gICAgfVxufSk7XG5cbi8qKlxuICogQSB2ZXJ0ZXggYnVuZGxlIGRlc2NyaWJlcyBhIHNlcmlhbHMgb2YgdmVydGV4IGF0dHJpYnV0ZXMuXG4gKiBUaGVzZSB2ZXJ0ZXggYXR0cmlidXRlcyBvY2N1cHkgYSByYW5nZSBvZiB0aGUgYnVmZmVyIGFuZFxuICogYXJlIGludGVybGVhdmVkLCBubyBwYWRkaW5nIGJ5dGVzLCBpbiB0aGUgcmFuZ2UuXG4gKi9cbmV4cG9ydCBsZXQgVmVydGV4QnVuZGxlID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5tZXNoLlZlcnRleEJ1bmRsZScsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGRhdGEgcmFuZ2Ugb2YgdGhpcyBidW5kbGUuXG4gICAgICAgICAqIFRoaXMgcmFuZ2Ugb2YgZGF0YSBpcyBlc3NlbnRpYWxseSBtYXBwZWQgdG8gYSBHUFUgdmVydGV4IGJ1ZmZlci5cbiAgICAgICAgICogQHByb3BlcnR5IHtCdWZmZXJSYW5nZX0gZGF0YVxuICAgICAgICAgKi9cbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IEJ1ZmZlclJhbmdlXG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgYXR0cmlidXRlIGZvcm1hdHMuXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7VmVydGV4Rm9ybWF0fSBmb3JtYXRzXG4gICAgICAgICAqL1xuICAgICAgICBmb3JtYXRzOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBbXSxcbiAgICAgICAgICAgIHR5cGU6IFZlcnRleEZvcm1hdFxuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGJ1bmRsZSdzIHZlcnRpY2VzIGNvdW50LlxuICAgICAgICAgKi9cbiAgICAgICAgdmVydGljZXNDb3VudDogMCxcbiAgICB9XG59KTtcblxuLyoqXG4gKiBBIHByaW1pdGl2ZSBpcyBhIGdlb21ldHJ5IGNvbnN0aXR1dGVkIHdpdGggYSBsaXN0IG9mXG4gKiBzYW1lIHRvcG9sb2d5IHByaW1pdGl2ZSBncmFwaGljKHN1Y2ggYXMgcG9pbnRzLCBsaW5lcyBvciB0cmlhbmdsZXMpLlxuICovXG5leHBvcnQgbGV0IFByaW1pdGl2ZSA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MubWVzaC5QcmltaXRpdmUnLFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSB2ZXJ0ZXggYnVuZGxlIHRoYXQgdGhlIHByaW1pdGl2ZSB1c2UuXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7W051bWJlcl19IHZlcnRleEJ1bmRsZUluZGljZXNcbiAgICAgICAgICovXG4gICAgICAgIHZlcnRleEJ1bmRsZUluZGljZXM6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdLFxuICAgICAgICAgICAgdHlwZTogY2MuRmxvYXRcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBkYXRhIHJhbmdlIG9mIHRoZSBwcmltaXRpdmUuXG4gICAgICAgICAqIFRoaXMgcmFuZ2Ugb2YgZGF0YSBpcyBlc3NlbnRpYWxseSBtYXBwZWQgdG8gYSBHUFUgaW5kaWNlcyBidWZmZXIuXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7QnVmZmVyUmFuZ2V9IGRhdGFcbiAgICAgICAgICovXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBCdWZmZXJSYW5nZVxuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHR5cGUgb2YgdGhpcyBwcmltaXRpdmUncyBpbmRpY2VzLlxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gaW5kZXhVbml0XG4gICAgICAgICAqL1xuICAgICAgICBpbmRleFVuaXQ6IGdmeC5JTkRFWF9GTVRfVUlOVDE2LFxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHByaW1pdGl2ZSdzIHRvcG9sb2d5LlxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gdG9wb2xvZ3lcbiAgICAgICAgICovXG4gICAgICAgIHRvcG9sb2d5OiBnZnguUFRfVFJJQU5HTEVTXG4gICAgfVxufSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBNZXNoRGF0YSAoKSB7XG4gICAgdGhpcy52RGF0YSA9IG51bGw7ICAvLyBVaW50OEFycmF5O1xuICAgIHRoaXMuZmxvYXQzMlZEYXRhID0gbnVsbDtcbiAgICB0aGlzLnVpbnQzMlZEYXRhID0gbnVsbDtcbiAgICB0aGlzLmlEYXRhID0gbnVsbDsgIC8vIFVpbnQ4QXJyYXk7XG4gICAgdGhpcy51aW50MTZJRGF0YSA9IG51bGw7XG4gICAgdGhpcy52Zm0gPSBudWxsO1xuICAgIHRoaXMub2Zmc2V0ID0gMDtcblxuICAgIHRoaXMudmIgPSBudWxsO1xuICAgIHRoaXMuaWIgPSBudWxsO1xuICAgIHRoaXMudkRpcnR5ID0gZmFsc2U7XG4gICAgdGhpcy5pRGlydHkgPSBmYWxzZTtcblxuICAgIHRoaXMuZW5hYmxlID0gdHJ1ZTtcbn1cblxuTWVzaERhdGEucHJvdG90eXBlLmdldFZEYXRhID0gZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgIGlmIChmb3JtYXQgPT09IEZsb2F0MzJBcnJheSkge1xuICAgICAgICBpZiAoIXRoaXMuZmxvYXQzMlZEYXRhKSB7XG4gICAgICAgICAgICB0aGlzLmZsb2F0MzJWRGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy52RGF0YS5idWZmZXIsIHRoaXMudkRhdGEuYnl0ZU9mZnNldCwgdGhpcy52RGF0YS5ieXRlTGVuZ3RoIC8gNCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmxvYXQzMlZEYXRhO1xuICAgIH1cbiAgICBlbHNlIGlmIChmb3JtYXQgPT09IFVpbnQzMkFycmF5KSB7XG4gICAgICAgIGlmICghdGhpcy51aW50MzJWRGF0YSkge1xuICAgICAgICAgICAgdGhpcy51aW50MzJWRGF0YSA9IG5ldyBVaW50MzJBcnJheSh0aGlzLnZEYXRhLmJ1ZmZlciwgdGhpcy52RGF0YS5ieXRlT2Zmc2V0LCB0aGlzLnZEYXRhLmJ5dGVMZW5ndGggLyA0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy51aW50MzJWRGF0YTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudkRhdGE7XG59XG5cbk1lc2hEYXRhLnByb3RvdHlwZS5nZXRJRGF0YSA9IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICBpZiAoZm9ybWF0ID09PSBVaW50MTZBcnJheSkge1xuICAgICAgICBpZiAoIXRoaXMudWludDE2SURhdGEpIHtcbiAgICAgICAgICAgIHRoaXMudWludDE2SURhdGEgPSBuZXcgVWludDE2QXJyYXkodGhpcy5pRGF0YS5idWZmZXIsIHRoaXMuaURhdGEuYnl0ZU9mZnNldCwgdGhpcy5pRGF0YS5ieXRlTGVuZ3RoIC8gMik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMudWludDE2SURhdGE7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmlEYXRhO1xufSJdfQ==