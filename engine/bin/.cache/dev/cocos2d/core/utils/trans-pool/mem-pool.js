
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/utils/trans-pool/mem-pool.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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
var MemPool = function MemPool(unitClass) {
  this._unitClass = unitClass;
  this._pool = [];
  this._findOrder = [];

  if (CC_JSB && CC_NATIVERENDERER) {
    this._initNative();
  }
};

var proto = MemPool.prototype;

proto._initNative = function () {
  this._nativeMemPool = new renderer.MemPool();
};

proto._buildUnit = function (unitID) {
  var unit = new this._unitClass(unitID, this);

  if (CC_JSB && CC_NATIVERENDERER) {
    this._nativeMemPool.updateCommonData(unitID, unit._data, unit._signData);
  }

  return unit;
};

proto._destroyUnit = function (unitID) {
  this._pool[unitID] = null;

  for (var idx = 0, n = this._findOrder.length; idx < n; idx++) {
    var unit = this._findOrder[idx];

    if (unit && unit.unitID == unitID) {
      this._findOrder.splice(idx, 1);

      break;
    }
  }

  if (CC_JSB && CC_NATIVERENDERER) {
    this._nativeMemPool.removeCommonData(unitID);
  }
};

proto._findUnitID = function () {
  var unitID = 0;
  var pool = this._pool;

  while (pool[unitID]) {
    unitID++;
  }

  return unitID;
};

proto.pop = function () {
  var findUnit = null;
  var idx = 0;
  var findOrder = this._findOrder;
  var pool = this._pool;

  for (var n = findOrder.length; idx < n; idx++) {
    var unit = findOrder[idx];

    if (unit && unit.hasSpace()) {
      findUnit = unit;
      break;
    }
  }

  if (!findUnit) {
    var unitID = this._findUnitID();

    findUnit = this._buildUnit(unitID);
    pool[unitID] = findUnit;
    findOrder.push(findUnit);
    idx = findOrder.length - 1;
  } // swap has space unit to first position, so next find will fast


  var firstUnit = findOrder[0];

  if (firstUnit !== findUnit) {
    findOrder[0] = findUnit;
    findOrder[idx] = firstUnit;
  }

  return findUnit.pop();
};

proto.push = function (info) {
  var unit = this._pool[info.unitID];
  unit.push(info.index);

  if (this._findOrder.length > 1 && unit.isAllFree()) {
    this._destroyUnit(info.unitID);
  }

  return unit;
};

module.exports = MemPool;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1lbS1wb29sLmpzIl0sIm5hbWVzIjpbIk1lbVBvb2wiLCJ1bml0Q2xhc3MiLCJfdW5pdENsYXNzIiwiX3Bvb2wiLCJfZmluZE9yZGVyIiwiQ0NfSlNCIiwiQ0NfTkFUSVZFUkVOREVSRVIiLCJfaW5pdE5hdGl2ZSIsInByb3RvIiwicHJvdG90eXBlIiwiX25hdGl2ZU1lbVBvb2wiLCJyZW5kZXJlciIsIl9idWlsZFVuaXQiLCJ1bml0SUQiLCJ1bml0IiwidXBkYXRlQ29tbW9uRGF0YSIsIl9kYXRhIiwiX3NpZ25EYXRhIiwiX2Rlc3Ryb3lVbml0IiwiaWR4IiwibiIsImxlbmd0aCIsInNwbGljZSIsInJlbW92ZUNvbW1vbkRhdGEiLCJfZmluZFVuaXRJRCIsInBvb2wiLCJwb3AiLCJmaW5kVW5pdCIsImZpbmRPcmRlciIsImhhc1NwYWNlIiwicHVzaCIsImZpcnN0VW5pdCIsImluZm8iLCJpbmRleCIsImlzQWxsRnJlZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBLElBQUlBLE9BQU8sR0FBRyxTQUFWQSxPQUFVLENBQVVDLFNBQVYsRUFBcUI7QUFDL0IsT0FBS0MsVUFBTCxHQUFrQkQsU0FBbEI7QUFDQSxPQUFLRSxLQUFMLEdBQWEsRUFBYjtBQUNBLE9BQUtDLFVBQUwsR0FBa0IsRUFBbEI7O0FBRUEsTUFBSUMsTUFBTSxJQUFJQyxpQkFBZCxFQUFpQztBQUM3QixTQUFLQyxXQUFMO0FBQ0g7QUFDSixDQVJEOztBQVVBLElBQUlDLEtBQUssR0FBR1IsT0FBTyxDQUFDUyxTQUFwQjs7QUFDQUQsS0FBSyxDQUFDRCxXQUFOLEdBQW9CLFlBQVk7QUFDNUIsT0FBS0csY0FBTCxHQUFzQixJQUFJQyxRQUFRLENBQUNYLE9BQWIsRUFBdEI7QUFDSCxDQUZEOztBQUlBUSxLQUFLLENBQUNJLFVBQU4sR0FBbUIsVUFBVUMsTUFBVixFQUFrQjtBQUNqQyxNQUFJQyxJ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QjtBQUN6QixNQUFJbEIsSUFBSSxHQUFHLEtBQUtYLEtBQUwsQ0FBVzZCLElBQUksQ0FBQ25CLE1BQWhCLENBQVg7QUFDQUMsRUFBQUEsSUFBSSxDQUFDZ0IsSUFBTCxDQUFVRSxJQUFJLENBQUNDLEtBQWY7O0FBQ0EsTUFBSSxLQUFLN0IsVUFBTCxDQUFnQmlCLE1BQWhCLEdBQXlCLENBQXpCLElBQThCUCxJQUFJLENBQUNvQixTQUFMLEVBQWxDLEVBQW9EO0FBQ2hELFNBQUtoQixZQUFMLENBQWtCYyxJQUFJLENBQUNuQixNQUF2QjtBQUNIOztBQUNELFNBQU9DLElBQVA7QUFDSCxDQVBEOztBQVFBcUIsTUFBTSxDQUFDQyxPQUFQLEdBQWlCcEMsT0FBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxubGV0IE1lbVBvb2wgPSBmdW5jdGlvbiAodW5pdENsYXNzKSB7XG4gICAgdGhpcy5fdW5pdENsYXNzID0gdW5pdENsYXNzO1xuICAgIHRoaXMuX3Bvb2wgPSBbXTtcbiAgICB0aGlzLl9maW5kT3JkZXIgPSBbXTtcblxuICAgIGlmIChDQ19KU0IgJiYgQ0NfTkFUSVZFUkVOREVSRVIpIHtcbiAgICAgICAgdGhpcy5faW5pdE5hdGl2ZSgpO1xuICAgIH1cbn07XG5cbmxldCBwcm90byA9IE1lbVBvb2wucHJvdG90eXBlO1xucHJvdG8uX2luaXROYXRpdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fbmF0aXZlTWVtUG9vbCA9IG5ldyByZW5kZXJlci5NZW1Qb29sKCk7XG59O1xuXG5wcm90by5fYnVpbGRVbml0ID0gZnVuY3Rpb24gKHVuaXRJRCkge1xuICAgIGxldCB1bml0ID0gbmV3IHRoaXMuX3VuaXRDbGFzcyh1bml0SUQsIHRoaXMpO1xuICAgIGlmIChDQ19KU0IgJiYgQ0NfTkFUSVZFUkVOREVSRVIpIHtcbiAgICAgICAgdGhpcy5fbmF0aXZlTWVtUG9vbC51cGRhdGVDb21tb25EYXRhKHVuaXRJRCwgdW5pdC5fZGF0YSwgdW5pdC5fc2lnbkRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gdW5pdDtcbn07XG5cbnByb3RvLl9kZXN0cm95VW5pdCA9IGZ1bmN0aW9uICh1bml0SUQpIHtcbiAgICB0aGlzLl9wb29sW3VuaXRJRF0gPSBudWxsO1xuICAgIGZvciAobGV0IGlkeCA9IDAsIG4gPSB0aGlzLl9maW5kT3JkZXIubGVuZ3RoOyBpZHggPCBuOyBpZHgrKykge1xuICAgICAgICBsZXQgdW5pdCA9IHRoaXMuX2ZpbmRPcmRlcltpZHhdO1xuICAgICAgICBpZiAodW5pdCAmJiB1bml0LnVuaXRJRCA9PSB1bml0SUQpIHtcbiAgICAgICAgICAgIHRoaXMuX2ZpbmRPcmRlci5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChDQ19KU0IgJiYgQ0NfTkFUSVZFUkVOREVSRVIpIHtcbiAgICAgICAgdGhpcy5fbmF0aXZlTWVtUG9vbC5yZW1vdmVDb21tb25EYXRhKHVuaXRJRCk7XG4gICAgfVxufTtcblxucHJvdG8uX2ZpbmRVbml0SUQgPSBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHVuaXRJRCA9IDA7XG4gICAgbGV0IHBvb2wgPSB0aGlzLl9wb29sO1xuICAgIHdoaWxlIChwb29sW3VuaXRJRF0pIHVuaXRJRCsrO1xuICAgIHJldHVybiB1bml0SUQ7XG59O1xuXG5wcm90by5wb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGZpbmRVbml0ID0gbnVsbDtcbiAgICBsZXQgaWR4ID0gMDtcbiAgICBsZXQgZmluZE9yZGVyID0gdGhpcy5fZmluZE9yZGVyO1xuICAgIGxldCBwb29sID0gdGhpcy5fcG9vbDtcbiAgICBmb3IgKGxldCBuID0gZmluZE9yZGVyLmxlbmd0aDsgaWR4IDwgbjsgaWR4KyspIHtcbiAgICAgICAgbGV0IHVuaXQgPSBmaW5kT3JkZXJbaWR4XTtcbiAgICAgICAgaWYgKHVuaXQgJiYgdW5pdC5oYXNTcGFjZSgpKSB7XG4gICAgICAgICAgICBmaW5kVW5pdCA9IHVuaXQ7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICghZmluZFVuaXQpIHtcbiAgICAgICAgbGV0IHVuaXRJRCA9IHRoaXMuX2ZpbmRVbml0SUQoKTtcbiAgICAgICAgZmluZFVuaXQgPSB0aGlzLl9idWlsZFVuaXQodW5pdElEKTtcbiAgICAgICAgcG9vbFt1bml0SURdID0gZmluZFVuaXQ7XG4gICAgICAgIGZpbmRPcmRlci5wdXNoKGZpbmRVbml0KTtcbiAgICAgICAgaWR4ID0gZmluZE9yZGVyLmxlbmd0aCAtIDE7XG4gICAgfVxuXG4gICAgLy8gc3dhcCBoYXMgc3BhY2UgdW5pdCB0byBmaXJzdCBwb3NpdGlvbiwgc28gbmV4dCBmaW5kIHdpbGwgZmFzdFxuICAgIGxldCBmaXJzdFVuaXQgPSBmaW5kT3JkZXJbMF07XG4gICAgaWYgKGZpcnN0VW5pdCAhPT0gZmluZFVuaXQpIHtcbiAgICAgICAgZmluZE9yZGVyWzBdID0gZmluZFVuaXQ7XG4gICAgICAgIGZpbmRPcmRlcltpZHhdID0gZmlyc3RVbml0O1xuICAgIH1cblxuICAgIHJldHVybiBmaW5kVW5pdC5wb3AoKTtcbn07XG5cbnByb3RvLnB1c2ggPSBmdW5jdGlvbiAoaW5mbykge1xuICAgIGxldCB1bml0ID0gdGhpcy5fcG9vbFtpbmZvLnVuaXRJRF07XG4gICAgdW5pdC5wdXNoKGluZm8uaW5kZXgpO1xuICAgIGlmICh0aGlzLl9maW5kT3JkZXIubGVuZ3RoID4gMSAmJiB1bml0LmlzQWxsRnJlZSgpKSB7XG4gICAgICAgIHRoaXMuX2Rlc3Ryb3lVbml0KGluZm8udW5pdElEKTtcbiAgICB9XG4gICAgcmV0dXJuIHVuaXQ7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBNZW1Qb29sOyJdfQ==