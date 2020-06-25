
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/webgl/flex-buffer.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

/****************************************************************************
 LICENSING AGREEMENT
 
 Xiamen Yaji Software Co., Ltd., (the “Licensor”) grants the user (the “Licensee”) non-exclusive and non-transferable rights to use the software according to the following conditions:
 a.  The Licensee shall pay royalties to the Licensor, and the amount of those royalties and the payment method are subject to separate negotiations between the parties.
 b.  The software is licensed for use rather than sold, and the Licensor reserves all rights over the software that are not expressly granted (whether by implication, reservation or prohibition).
 c.  The open source codes contained in the software are subject to the MIT Open Source Licensing Agreement (see the attached for the details);
 d.  The Licensee acknowledges and consents to the possibility that errors may occur during the operation of the software for one or more technical reasons, and the Licensee shall take precautions and prepare remedies for such events. In such circumstance, the Licensor shall provide software patches or updates according to the agreement between the two parties. The Licensor will not assume any liability beyond the explicit wording of this Licensing Agreement.
 e.  Where the Licensor must assume liability for the software according to relevant laws, the Licensor’s entire liability is limited to the annual royalty payable by the Licensee.
 f.  The Licensor owns the portions listed in the root directory and subdirectory (if any) in the software and enjoys the intellectual property rights over those portions. As for the portions owned by the Licensor, the Licensee shall not:
 - i. Bypass or avoid any relevant technical protection measures in the products or services;
 - ii. Release the source codes to any other parties;
 - iii. Disassemble, decompile, decipher, attack, emulate, exploit or reverse-engineer these portion of code;
 - iv. Apply it to any third-party products or services without Licensor’s permission;
 - v. Publish, copy, rent, lease, sell, export, import, distribute or lend any products containing these portions of code;
 - vi. Allow others to use any services relevant to the technology of these codes;
 - vii. Conduct any other act beyond the scope of this Licensing Agreement.
 g.  This Licensing Agreement terminates immediately if the Licensee breaches this Agreement. The Licensor may claim compensation from the Licensee where the Licensee’s breach causes any damage to the Licensor.
 h.  The laws of the People's Republic of China apply to this Licensing Agreement.
 i.  This Agreement is made in both Chinese and English, and the Chinese version shall prevail the event of conflict.
 ****************************************************************************/
var FlexBuffer =
/*#__PURE__*/
function () {
  function FlexBuffer(handler, index, verticesCount, indicesCount, vfmt) {
    this._handler = handler;
    this._index = index;
    this._vfmt = vfmt;
    this._verticesBytes = vfmt._bytes;
    this._initVerticesCount = verticesCount;
    this._initIndicesCount = indicesCount;
    this.reset();
  }

  var _proto = FlexBuffer.prototype;

  _proto._reallocVData = function _reallocVData(floatsCount, oldData) {
    this.vData = new Float32Array(floatsCount);
    this.uintVData = new Uint32Array(this.vData.buffer);

    if (oldData) {
      this.vData.set(oldData);
    }

    this._handler.updateMesh(this._index, this.vData, this.iData);
  };

  _proto._reallocIData = function _reallocIData(indicesCount, oldData) {
    this.iData = new Uint16Array(indicesCount);

    if (oldData) {
      this.iData.set(oldData);
    }

    this._handler.updateMesh(this._index, this.vData, this.iData);
  };

  _proto.reserve = function reserve(verticesCount, indicesCount) {
    var floatsCount = verticesCount * this._verticesBytes >> 2;
    var newFloatsCount = this.vData.length;
    var realloced = false;

    if (floatsCount > newFloatsCount) {
      while (newFloatsCount < floatsCount) {
        newFloatsCount *= 2;
      }

      this._reallocVData(newFloatsCount, this.vData);

      realloced = true;
    }

    var newIndicesCount = this.iData.length;

    if (indicesCount > newIndicesCount) {
      while (newIndicesCount < indicesCount) {
        newIndicesCount *= 2;
      }

      this._reallocIData(indicesCount, this.iData);

      realloced = true;
    }

    return realloced;
  };

  _proto.used = function used(verticesCount, indicesCount) {
    this.usedVertices = verticesCount;
    this.usedIndices = indicesCount;
    this.usedVerticesFloats = verticesCount * this._verticesBytes >> 2;

    this._handler.updateMeshRange(verticesCount, indicesCount);
  };

  _proto.reset = function reset() {
    var floatsCount = this._initVerticesCount * this._verticesBytes >> 2;

    this._reallocVData(floatsCount);

    this._reallocIData(this._initIndicesCount);

    this.usedVertices = 0;
    this.usedVerticesFloats = 0;
    this.usedIndices = 0;
  };

  return FlexBuffer;
}();

exports["default"] = FlexBuffer;
cc.FlexBuffer = FlexBuffer;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZsZXgtYnVmZmVyLmpzIl0sIm5hbWVzIjpbIkZsZXhCdWZmZXIiLCJoYW5kbGVyIiwiaW5kZXgiLCJ2ZXJ0aWNlc0NvdW50IiwiaW5kaWNlc0NvdW50IiwidmZtdCIsIl9oYW5kbGVyIiwiX2luZGV4IiwiX3ZmbXQiLCJfdmVydGljZXNCeXRlcyIsIl9ieXRlcyIsIl9pbml0VmVydGljZXNDb3VudCIsIl9pbml0SW5kaWNlc0NvdW50IiwicmVzZXQiLCJfcmVhbGxvY1ZEYXRhIiwiZmxvYXRzQ291bnQiLCJvbGREYXRhIiwidkRhdGEiLCJGbG9hdDMyQXJyYXkiLCJ1aW50VkRhdGEiLCJVaW50MzJBcnJheSIsImJ1ZmZlciIsInNldCIsInVwZGF0ZU1lc2giLCJpRGF0YSIsIl9yZWFsbG9jSURhdGEiLCJVaW50MTZBcnJheSIsInJlc2VydmUiLCJuZXdGbG9hdHNDb3VudCIsImxlbmd0aCIsInJlYWxsb2NlZCIsIm5ld0luZGljZXNDb3VudCIsInVzZWQiLCJ1c2VkVmVydGljZXMiLCJ1c2VkSW5kaWNlcyIsInVzZWRWZXJ0aWNlc0Zsb2F0cyIsInVwZGF0ZU1lc2hSYW5nZSIsImNjIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXNCcUJBOzs7QUFDakIsc0JBQWFDLE9BQWIsRUFBc0JDLEtBQXRCLEVBQTZCQyxhQUE3QixFQUE0Q0MsWUFBNUMsRUFBMERDLElBQTFELEVBQWdFO0FBQzVELFNBQUtDLFFBQUwsR0FBZ0JMLE9BQWhCO0FBQ0EsU0FBS00sTUFBTCxHQUFjTCxLQUFkO0FBQ0EsU0FBS00sS0FBTCxHQUFhSCxJQUFiO0FBQ0EsU0FBS0ksY0FBTCxHQUFzQkosSUFBSSxDQUFDSyxNQUEzQjtBQUVBLFNBQUtDLGtCQUFMLEdBQTBCUixhQUExQjtBQUNBLFNBQUtTLGlCQUFMLEdBQXlCUixZQUF6QjtBQUVBLFNBQUtTLEtBQUw7QUFDSDs7OztTQUVEQyxnQkFBQSx1QkFBZUMsV0FBZixFQUE0QkMsT0FBNUIsRUFBcUM7QUFDakMsU0FBS0MsS0FBTCxHQUFhLElBQUlDLFlBQUosQ0FBaUJILFdBQWpCLENBQWI7QUFDQSxTQUFLSSxTQUFMLEdBQWlCLElBQUlDLFdBQUosQ0FBZ0IsS0FBS0gsS0FBTCxDQUFXSSxNQUEzQixDQUFqQjs7QUFFQSxRQUFJTCxPQUFKLEVBQWE7QUFDVCxXQUFLQyxLQUFMLENBQVdLLEdBQVgsQ0FBZU4sT0FBZjtBQUNIOztBQUVELFNBQUtWLFFBQUwsQ0FBY2lCLFVBQWQsQ0FBeUIsS0FBS2hCLE1BQTlCLEVBQXNDLEtBQUtVLEtBQTNDLEVBQWtELEtBQUtPLEtBQXZEO0FBQ0g7O1NBRURDLGdCQUFBLHVCQUFlckIsWUFBZixFQUE2QlksT0FBN0IsRUFBc0M7QUFDbEMsU0FBS1EsS0FBTCxHQUFhLElBQUlFLFdBQUosQ0FBZ0J0QixZQUFoQixDQUFiOztBQUVBLFFBQUlZLE9BQUosRUFBYTtBQUNULFdBQUtRLEtBQUwsQ0FBV0YsR0FBWCxDQUFlTixPQUFmO0FBQ0g7O0FBRUQsU0FBS1YsUUFBTCxDQUFjaUIsVUFBZCxDQUF5QixLQUFLaEIsTUFBOUIsRUFBc0MsS0FBS1UsS0FBM0MsRUFBa0QsS0FBS08sS0FBdkQ7QUFDSDs7U0FFREcsVUFBQSxpQkFBU3hCLGFBQVQsRUFBd0JDLFlBQXhCLEVBQXNDO0FBQ2xDLFFBQUlXLFdBQVcsR0FBR1osYUFBYSxHQUFHLEtBQUtNLGNBQXJCLElBQXVDLENBQXpEO0FBQ0EsUUFBSW1CLGNBQWMsR0FBRyxLQUFLWCxLQUFMLENBQVdZLE1BQWhDO0FBQ0EsUUFBSUMsU0FBUyxHQUFHLEtBQWhCOztBQUVBLFFBQUlmLFdBQVcsR0FBR2EsY0FBbEIsRUFBa0M7QUFDOUIsYUFBT0EsY0FBYyxHQUFHYixXQUF4QixFQUFxQztBQUNqQ2EsUUFBQUEsY0FBYyxJQUFJLENBQWxCO0FBQ0g7O0FBQ0QsV0FBS2QsYUFBTCxDQUFtQmMsY0FBbkIsRUFBbUMsS0FBS1gsS0FBeEM7O0FBQ0FhLE1BQUFBLFNBQVMsR0FBRyxJQUFaO0FBQ0g7O0FBRUQsUUFBSUMsZUFBZSxHQUFHLEtBQUtQLEtBQUwsQ0FBV0ssTUFBakM7O0FBQ0EsUUFBSXpCLFlBQVksR0FBRzJCLGVBQW5CLEVBQW9DO0FBQ2hDLGFBQU9BLGVBQWUsR0FBRzNCLFlBQXpCLEVBQXVDO0FBQ25DMkIsUUFBQUEsZUFBZSxJQUFJLENBQW5CO0FBQ0g7O0FBQ0QsV0FBS04sYUFBTCxDQUFtQnJCLFlBQW5CLEVBQWlDLEtBQUtvQixLQUF0Qzs7QUFDQU0sTUFBQUEsU0FBUyxHQUFHLElBQVo7QUFDSDs7QUFFRCxXQUFPQSxTQUFQO0FBQ0g7O1NBRURFLE9BQUEsY0FBTTdCLGFBQU4sRUFBcUJDLFlBQXJCLEVBQW1DO0FBQy9CLFNBQUs2QixZQUFMLEdBQW9COUIsYUFBcEI7QUFDQSxTQUFLK0IsV0FBTCxHQUFtQjlCLFlBQW5CO0FBQ0EsU0FBSytCLGtCQUFMLEdBQTBCaEMsYUFBYSxHQUFHLEtBQUtNLGNBQXJCLElBQXVDLENBQWpFOztBQUVBLFNBQUtILFFBQUwsQ0FBYzhCLGVBQWQsQ0FBOEJqQyxhQUE5QixFQUE2Q0MsWUFBN0M7QUFDSDs7U0FFRFMsUUFBQSxpQkFBUztBQUNMLFFBQUlFLFdBQVcsR0FBRyxLQUFLSixrQkFBTCxHQUEwQixLQUFLRixjQUEvQixJQUFpRCxDQUFuRTs7QUFDQSxTQUFLSyxhQUFMLENBQW1CQyxXQUFuQjs7QUFDQSxTQUFLVSxhQUFMLENBQW1CLEtBQUtiLGlCQUF4Qjs7QUFFQSxTQUFLcUIsWUFBTCxHQUFvQixDQUFwQjtBQUNBLFNBQUtFLGtCQUFMLEdBQTBCLENBQTFCO0FBQ0EsU0FBS0QsV0FBTCxHQUFtQixDQUFuQjtBQUNIOzs7Ozs7QUFHTEcsRUFBRSxDQUFDckMsVUFBSCxHQUFnQkEsVUFBaEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIExJQ0VOU0lORyBBR1JFRU1FTlRcbiBcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4sICh0aGUg4oCcTGljZW5zb3LigJ0pIGdyYW50cyB0aGUgdXNlciAodGhlIOKAnExpY2Vuc2Vl4oCdKSBub24tZXhjbHVzaXZlIGFuZCBub24tdHJhbnNmZXJhYmxlIHJpZ2h0cyB0byB1c2UgdGhlIHNvZnR3YXJlIGFjY29yZGluZyB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gYS4gIFRoZSBMaWNlbnNlZSBzaGFsbCBwYXkgcm95YWx0aWVzIHRvIHRoZSBMaWNlbnNvciwgYW5kIHRoZSBhbW91bnQgb2YgdGhvc2Ugcm95YWx0aWVzIGFuZCB0aGUgcGF5bWVudCBtZXRob2QgYXJlIHN1YmplY3QgdG8gc2VwYXJhdGUgbmVnb3RpYXRpb25zIGJldHdlZW4gdGhlIHBhcnRpZXMuXG4gYi4gIFRoZSBzb2Z0d2FyZSBpcyBsaWNlbnNlZCBmb3IgdXNlIHJhdGhlciB0aGFuIHNvbGQsIGFuZCB0aGUgTGljZW5zb3IgcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBvdmVyIHRoZSBzb2Z0d2FyZSB0aGF0IGFyZSBub3QgZXhwcmVzc2x5IGdyYW50ZWQgKHdoZXRoZXIgYnkgaW1wbGljYXRpb24sIHJlc2VydmF0aW9uIG9yIHByb2hpYml0aW9uKS5cbiBjLiAgVGhlIG9wZW4gc291cmNlIGNvZGVzIGNvbnRhaW5lZCBpbiB0aGUgc29mdHdhcmUgYXJlIHN1YmplY3QgdG8gdGhlIE1JVCBPcGVuIFNvdXJjZSBMaWNlbnNpbmcgQWdyZWVtZW50IChzZWUgdGhlIGF0dGFjaGVkIGZvciB0aGUgZGV0YWlscyk7XG4gZC4gIFRoZSBMaWNlbnNlZSBhY2tub3dsZWRnZXMgYW5kIGNvbnNlbnRzIHRvIHRoZSBwb3NzaWJpbGl0eSB0aGF0IGVycm9ycyBtYXkgb2NjdXIgZHVyaW5nIHRoZSBvcGVyYXRpb24gb2YgdGhlIHNvZnR3YXJlIGZvciBvbmUgb3IgbW9yZSB0ZWNobmljYWwgcmVhc29ucywgYW5kIHRoZSBMaWNlbnNlZSBzaGFsbCB0YWtlIHByZWNhdXRpb25zIGFuZCBwcmVwYXJlIHJlbWVkaWVzIGZvciBzdWNoIGV2ZW50cy4gSW4gc3VjaCBjaXJjdW1zdGFuY2UsIHRoZSBMaWNlbnNvciBzaGFsbCBwcm92aWRlIHNvZnR3YXJlIHBhdGNoZXMgb3IgdXBkYXRlcyBhY2NvcmRpbmcgdG8gdGhlIGFncmVlbWVudCBiZXR3ZWVuIHRoZSB0d28gcGFydGllcy4gVGhlIExpY2Vuc29yIHdpbGwgbm90IGFzc3VtZSBhbnkgbGlhYmlsaXR5IGJleW9uZCB0aGUgZXhwbGljaXQgd29yZGluZyBvZiB0aGlzIExpY2Vuc2luZyBBZ3JlZW1lbnQuXG4gZS4gIFdoZXJlIHRoZSBMaWNlbnNvciBtdXN0IGFzc3VtZSBsaWFiaWxpdHkgZm9yIHRoZSBzb2Z0d2FyZSBhY2NvcmRpbmcgdG8gcmVsZXZhbnQgbGF3cywgdGhlIExpY2Vuc29y4oCZcyBlbnRpcmUgbGlhYmlsaXR5IGlzIGxpbWl0ZWQgdG8gdGhlIGFubnVhbCByb3lhbHR5IHBheWFibGUgYnkgdGhlIExpY2Vuc2VlLlxuIGYuICBUaGUgTGljZW5zb3Igb3ducyB0aGUgcG9ydGlvbnMgbGlzdGVkIGluIHRoZSByb290IGRpcmVjdG9yeSBhbmQgc3ViZGlyZWN0b3J5IChpZiBhbnkpIGluIHRoZSBzb2Z0d2FyZSBhbmQgZW5qb3lzIHRoZSBpbnRlbGxlY3R1YWwgcHJvcGVydHkgcmlnaHRzIG92ZXIgdGhvc2UgcG9ydGlvbnMuIEFzIGZvciB0aGUgcG9ydGlvbnMgb3duZWQgYnkgdGhlIExpY2Vuc29yLCB0aGUgTGljZW5zZWUgc2hhbGwgbm90OlxuIC0gaS4gQnlwYXNzIG9yIGF2b2lkIGFueSByZWxldmFudCB0ZWNobmljYWwgcHJvdGVjdGlvbiBtZWFzdXJlcyBpbiB0aGUgcHJvZHVjdHMgb3Igc2VydmljZXM7XG4gLSBpaS4gUmVsZWFzZSB0aGUgc291cmNlIGNvZGVzIHRvIGFueSBvdGhlciBwYXJ0aWVzO1xuIC0gaWlpLiBEaXNhc3NlbWJsZSwgZGVjb21waWxlLCBkZWNpcGhlciwgYXR0YWNrLCBlbXVsYXRlLCBleHBsb2l0IG9yIHJldmVyc2UtZW5naW5lZXIgdGhlc2UgcG9ydGlvbiBvZiBjb2RlO1xuIC0gaXYuIEFwcGx5IGl0IHRvIGFueSB0aGlyZC1wYXJ0eSBwcm9kdWN0cyBvciBzZXJ2aWNlcyB3aXRob3V0IExpY2Vuc29y4oCZcyBwZXJtaXNzaW9uO1xuIC0gdi4gUHVibGlzaCwgY29weSwgcmVudCwgbGVhc2UsIHNlbGwsIGV4cG9ydCwgaW1wb3J0LCBkaXN0cmlidXRlIG9yIGxlbmQgYW55IHByb2R1Y3RzIGNvbnRhaW5pbmcgdGhlc2UgcG9ydGlvbnMgb2YgY29kZTtcbiAtIHZpLiBBbGxvdyBvdGhlcnMgdG8gdXNlIGFueSBzZXJ2aWNlcyByZWxldmFudCB0byB0aGUgdGVjaG5vbG9neSBvZiB0aGVzZSBjb2RlcztcbiAtIHZpaS4gQ29uZHVjdCBhbnkgb3RoZXIgYWN0IGJleW9uZCB0aGUgc2NvcGUgb2YgdGhpcyBMaWNlbnNpbmcgQWdyZWVtZW50LlxuIGcuICBUaGlzIExpY2Vuc2luZyBBZ3JlZW1lbnQgdGVybWluYXRlcyBpbW1lZGlhdGVseSBpZiB0aGUgTGljZW5zZWUgYnJlYWNoZXMgdGhpcyBBZ3JlZW1lbnQuIFRoZSBMaWNlbnNvciBtYXkgY2xhaW0gY29tcGVuc2F0aW9uIGZyb20gdGhlIExpY2Vuc2VlIHdoZXJlIHRoZSBMaWNlbnNlZeKAmXMgYnJlYWNoIGNhdXNlcyBhbnkgZGFtYWdlIHRvIHRoZSBMaWNlbnNvci5cbiBoLiAgVGhlIGxhd3Mgb2YgdGhlIFBlb3BsZSdzIFJlcHVibGljIG9mIENoaW5hIGFwcGx5IHRvIHRoaXMgTGljZW5zaW5nIEFncmVlbWVudC5cbiBpLiAgVGhpcyBBZ3JlZW1lbnQgaXMgbWFkZSBpbiBib3RoIENoaW5lc2UgYW5kIEVuZ2xpc2gsIGFuZCB0aGUgQ2hpbmVzZSB2ZXJzaW9uIHNoYWxsIHByZXZhaWwgdGhlIGV2ZW50IG9mIGNvbmZsaWN0LlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZsZXhCdWZmZXIge1xuICAgIGNvbnN0cnVjdG9yIChoYW5kbGVyLCBpbmRleCwgdmVydGljZXNDb3VudCwgaW5kaWNlc0NvdW50LCB2Zm10KSB7XG4gICAgICAgIHRoaXMuX2hhbmRsZXIgPSBoYW5kbGVyO1xuICAgICAgICB0aGlzLl9pbmRleCA9IGluZGV4O1xuICAgICAgICB0aGlzLl92Zm10ID0gdmZtdDtcbiAgICAgICAgdGhpcy5fdmVydGljZXNCeXRlcyA9IHZmbXQuX2J5dGVzO1xuXG4gICAgICAgIHRoaXMuX2luaXRWZXJ0aWNlc0NvdW50ID0gdmVydGljZXNDb3VudDtcbiAgICAgICAgdGhpcy5faW5pdEluZGljZXNDb3VudCA9IGluZGljZXNDb3VudDtcblxuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgfVxuXG4gICAgX3JlYWxsb2NWRGF0YSAoZmxvYXRzQ291bnQsIG9sZERhdGEpIHtcbiAgICAgICAgdGhpcy52RGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoZmxvYXRzQ291bnQpO1xuICAgICAgICB0aGlzLnVpbnRWRGF0YSA9IG5ldyBVaW50MzJBcnJheSh0aGlzLnZEYXRhLmJ1ZmZlcik7XG5cbiAgICAgICAgaWYgKG9sZERhdGEpIHtcbiAgICAgICAgICAgIHRoaXMudkRhdGEuc2V0KG9sZERhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5faGFuZGxlci51cGRhdGVNZXNoKHRoaXMuX2luZGV4LCB0aGlzLnZEYXRhLCB0aGlzLmlEYXRhKTtcbiAgICB9XG5cbiAgICBfcmVhbGxvY0lEYXRhIChpbmRpY2VzQ291bnQsIG9sZERhdGEpIHtcbiAgICAgICAgdGhpcy5pRGF0YSA9IG5ldyBVaW50MTZBcnJheShpbmRpY2VzQ291bnQpO1xuICAgICAgICBcbiAgICAgICAgaWYgKG9sZERhdGEpIHtcbiAgICAgICAgICAgIHRoaXMuaURhdGEuc2V0KG9sZERhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5faGFuZGxlci51cGRhdGVNZXNoKHRoaXMuX2luZGV4LCB0aGlzLnZEYXRhLCB0aGlzLmlEYXRhKTtcbiAgICB9XG5cbiAgICByZXNlcnZlICh2ZXJ0aWNlc0NvdW50LCBpbmRpY2VzQ291bnQpIHtcbiAgICAgICAgbGV0IGZsb2F0c0NvdW50ID0gdmVydGljZXNDb3VudCAqIHRoaXMuX3ZlcnRpY2VzQnl0ZXMgPj4gMjtcbiAgICAgICAgbGV0IG5ld0Zsb2F0c0NvdW50ID0gdGhpcy52RGF0YS5sZW5ndGg7XG4gICAgICAgIGxldCByZWFsbG9jZWQgPSBmYWxzZTtcblxuICAgICAgICBpZiAoZmxvYXRzQ291bnQgPiBuZXdGbG9hdHNDb3VudCkge1xuICAgICAgICAgICAgd2hpbGUgKG5ld0Zsb2F0c0NvdW50IDwgZmxvYXRzQ291bnQpIHtcbiAgICAgICAgICAgICAgICBuZXdGbG9hdHNDb3VudCAqPSAyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fcmVhbGxvY1ZEYXRhKG5ld0Zsb2F0c0NvdW50LCB0aGlzLnZEYXRhKTtcbiAgICAgICAgICAgIHJlYWxsb2NlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbmV3SW5kaWNlc0NvdW50ID0gdGhpcy5pRGF0YS5sZW5ndGg7XG4gICAgICAgIGlmIChpbmRpY2VzQ291bnQgPiBuZXdJbmRpY2VzQ291bnQpIHtcbiAgICAgICAgICAgIHdoaWxlIChuZXdJbmRpY2VzQ291bnQgPCBpbmRpY2VzQ291bnQpIHtcbiAgICAgICAgICAgICAgICBuZXdJbmRpY2VzQ291bnQgKj0gMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3JlYWxsb2NJRGF0YShpbmRpY2VzQ291bnQsIHRoaXMuaURhdGEpO1xuICAgICAgICAgICAgcmVhbGxvY2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZWFsbG9jZWQ7XG4gICAgfVxuXG4gICAgdXNlZCAodmVydGljZXNDb3VudCwgaW5kaWNlc0NvdW50KSB7XG4gICAgICAgIHRoaXMudXNlZFZlcnRpY2VzID0gdmVydGljZXNDb3VudDtcbiAgICAgICAgdGhpcy51c2VkSW5kaWNlcyA9IGluZGljZXNDb3VudDtcbiAgICAgICAgdGhpcy51c2VkVmVydGljZXNGbG9hdHMgPSB2ZXJ0aWNlc0NvdW50ICogdGhpcy5fdmVydGljZXNCeXRlcyA+PiAyO1xuXG4gICAgICAgIHRoaXMuX2hhbmRsZXIudXBkYXRlTWVzaFJhbmdlKHZlcnRpY2VzQ291bnQsIGluZGljZXNDb3VudCk7XG4gICAgfVxuXG4gICAgcmVzZXQgKCkge1xuICAgICAgICBsZXQgZmxvYXRzQ291bnQgPSB0aGlzLl9pbml0VmVydGljZXNDb3VudCAqIHRoaXMuX3ZlcnRpY2VzQnl0ZXMgPj4gMjtcbiAgICAgICAgdGhpcy5fcmVhbGxvY1ZEYXRhKGZsb2F0c0NvdW50KTtcbiAgICAgICAgdGhpcy5fcmVhbGxvY0lEYXRhKHRoaXMuX2luaXRJbmRpY2VzQ291bnQpO1xuXG4gICAgICAgIHRoaXMudXNlZFZlcnRpY2VzID0gMDtcbiAgICAgICAgdGhpcy51c2VkVmVydGljZXNGbG9hdHMgPSAwO1xuICAgICAgICB0aGlzLnVzZWRJbmRpY2VzID0gMDtcbiAgICB9XG59IFxuXG5jYy5GbGV4QnVmZmVyID0gRmxleEJ1ZmZlclxuIl19