
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/particle/utils.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

// SameValue algorithm
if (!Object.is) {
  Object.is = function (x, y) {
    if (x === y) {
      return x !== 0 || 1 / x === 1 / y;
    } else {
      return x !== x && y !== y;
    }
  };
}
/**
 * !#en
 * Helper class for ES5 Map.
 * !#zh
 * ES5 Map 辅助类。
 * @param {data[]}
 * @class MapUtils
 */


var MapUtils =
/*#__PURE__*/
function () {
  function MapUtils(data) {
    this.datas = [];
    !data && (data = []);
    this.datas = [];
    var that = this;
    data.forEach(function (item) {
      if (!that.has(item[0])) {
        that.datas.push({
          key: item[0],
          value: item[1]
        });
      }
    });
  }

  var _proto = MapUtils.prototype;

  _proto.size = function size() {
    return this.datas.length;
  };

  _proto.set = function set(key, value) {
    this["delete"](key);
    this.datas.push({
      key: key,
      value: value
    });
  };

  _proto.get = function get(key) {
    var value = undefined;
    var datas = this.datas;

    for (var i = 0, len = datas.length; i < len; i++) {
      if (Object.is(key, datas[i].key)) {
        value = datas[i].value;
        break;
      }
    }

    return value;
  };

  _proto.has = function has(key) {
    var res = false;
    var datas = this.datas;

    for (var i = 0, len = datas.length; i < len; i++) {
      if (Object.is(key, datas[i].key)) {
        res = true;
        break;
      }
    }

    return res;
  };

  _proto.clear = function clear() {
    this.datas.length = 0;
  };

  _proto["delete"] = function _delete(key) {
    var res = false;
    var datas = this.datas;

    for (var i = 0, len = datas.length; i < len; i++) {
      if (Object.is(key, datas[i].key)) {
        datas.splice(i, 1);
        res = true;
        break;
      }
    }

    return res;
  };

  _proto.keys = function keys() {
    var datas = this.datas;
    var keys = [];

    for (var i = 0, len = datas.length; i < len; i++) {
      keys.push(datas[i].key);
    }

    return keys;
  };

  _proto.values = function values() {
    var index = 0;
    var datas = this.datas;
    return {
      next: function next() {
        if (datas.length === 0 || datas[index] === undefined) {
          return {
            value: undefined,
            done: true
          };
        }

        return {
          value: datas[index++].value,
          done: false
        };
      }
    };
  };

  return MapUtils;
}();

exports["default"] = MapUtils;
;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLnRzIl0sIm5hbWVzIjpbIk9iamVjdCIsImlzIiwieCIsInkiLCJNYXBVdGlscyIsImRhdGEiLCJkYXRhcyIsInRoYXQiLCJmb3JFYWNoIiwiaXRlbSIsImhhcyIsInB1c2giLCJrZXkiLCJ2YWx1ZSIsInNpemUiLCJsZW5ndGgiLCJzZXQiLCJnZXQiLCJ1bmRlZmluZWQiLCJpIiwibGVuIiwicmVzIiwiY2xlYXIiLCJzcGxpY2UiLCJrZXlzIiwidmFsdWVzIiwiaW5kZXgiLCJuZXh0IiwiZG9uZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0EsSUFBSSxDQUFDQSxNQUFNLENBQUNDLEVBQVosRUFBZ0I7QUFDWkQsRUFBQUEsTUFBTSxDQUFDQyxFQUFQLEdBQVksVUFBU0MsQ0FBVCxFQUFZQyxDQUFaLEVBQWU7QUFDdkIsUUFBSUQsQ0FBQyxLQUFLQyxDQUFWLEVBQWE7QUFDVCxhQUFPRCxDQUFDLEtBQUssQ0FBTixJQUFXLElBQUlBLENBQUosS0FBVSxJQUFJQyxDQUFoQztBQUNILEtBRkQsTUFFTztBQUNILGFBQU9ELENBQUMsS0FBS0EsQ0FBTixJQUFXQyxDQUFDLEtBQUtBLENBQXhCO0FBQ0g7QUFDSixHQU5EO0FBT0g7QUFFRDs7Ozs7Ozs7OztJQVFxQkM7OztBQUdqQixvQkFBYUMsSUFBYixFQUFtQjtBQUFBLFNBRm5CQyxLQUVtQixHQUZYLEVBRVc7QUFDZixLQUFDRCxJQUFELEtBQVVBLElBQUksR0FBRyxFQUFqQjtBQUVBLFNBQUtDLEtBQUwsR0FBYSxFQUFiO0FBRUEsUUFBSUMsSUFBSSxHQUFHLElBQVg7QUFFQUYsSUFBQUEsSUFBSSxDQUFDRyxPQUFMLENBQWEsVUFBVUMsSUFBVixFQUFnQjtBQUN6QixVQUFJLENBQUNGLElBQUksQ0FBQ0csR0FBTCxDQUFTRCxJQUFJLENBQUMsQ0FBRCxDQUFiLENBQUwsRUFBd0I7QUFDcEJGLFFBQUFBLElBQUksQ0FBQ0QsS0FBTCxDQUFXSyxJQUFYLENBQWdCO0FBQ1pD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RUQsV0FBT1ksSUFBUDtBQUNIOztTQUVEQyxTQUFBLGtCQUFVO0FBQ04sUUFBSUMsS0FBSyxHQUFHLENBQVo7QUFDQSxRQUFJcEIsS0FBSyxHQUFHLEtBQUtBLEtBQWpCO0FBQ0EsV0FBTztBQUNIcUIsTUFBQUEsSUFBSSxFQUFFLGdCQUFZO0FBQ2QsWUFBSXJCLEtBQUssQ0FBQ1MsTUFBTixLQUFpQixDQUFqQixJQUFzQlQsS0FBSyxDQUFDb0IsS0FBRCxDQUFMLEtBQWlCUixTQUEzQyxFQUFzRDtBQUNsRCxpQkFBTztBQUNITCxZQUFBQSxLQUFLLEVBQUVLLFNBREo7QUFFSFUsWUFBQUEsSUFBSSxFQUFFO0FBRkgsV0FBUDtBQUlIOztBQUNELGVBQU87QUFDSGYsVUFBQUEsS0FBSyxFQUFFUCxLQUFLLENBQUNvQixLQUFLLEVBQU4sQ0FBTCxDQUFlYixLQURuQjtBQUVIZSxVQUFBQSxJQUFJLEVBQUU7QUFGSCxTQUFQO0FBSUg7QUFaRSxLQUFQO0FBY0g7Ozs7OztBQUNKIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU2FtZVZhbHVlIGFsZ29yaXRobVxuaWYgKCFPYmplY3QuaXMpIHtcbiAgICBPYmplY3QuaXMgPSBmdW5jdGlvbih4LCB5KSB7XG4gICAgICAgIGlmICh4ID09PSB5KSB7XG4gICAgICAgICAgICByZXR1cm4geCAhPT0gMCB8fCAxIC8geCA9PT0gMSAvIHk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4geCAhPT0geCAmJiB5ICE9PSB5O1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuLyoqXG4gKiAhI2VuXG4gKiBIZWxwZXIgY2xhc3MgZm9yIEVTNSBNYXAuXG4gKiAhI3poXG4gKiBFUzUgTWFwIOi+heWKqeexu+OAglxuICogQHBhcmFtIHtkYXRhW119XG4gKiBAY2xhc3MgTWFwVXRpbHNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFwVXRpbHMge1xuICAgIGRhdGFzID0gW107XG4gICAgXG4gICAgY29uc3RydWN0b3IgKGRhdGEpIHtcbiAgICAgICAgIWRhdGEgJiYgKGRhdGEgPSBbXSk7XG5cbiAgICAgICAgdGhpcy5kYXRhcyA9IFtdO1xuICAgICAgICBcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgaWYgKCF0aGF0LmhhcyhpdGVtWzBdKSkge1xuICAgICAgICAgICAgICAgIHRoYXQuZGF0YXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGtleTogaXRlbVswXSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGl0ZW1bMV1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2l6ZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFzLmxlbmd0aDtcbiAgICB9XG5cbiAgICBzZXQgKGtleSwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy5kZWxldGUoa2V5KTtcbiAgICAgICAgdGhpcy5kYXRhcy5wdXNoKHtcbiAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldCAoa2V5KSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgbGV0IGRhdGFzID0gdGhpcy5kYXRhcztcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGRhdGFzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LmlzKGtleSwgZGF0YXNbaV0ua2V5KSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gZGF0YXNbaV0udmFsdWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGhhcyAoa2V5KSB7XG4gICAgICAgIGxldCByZXMgPSBmYWxzZTtcbiAgICAgICAgbGV0IGRhdGFzID0gdGhpcy5kYXRhcztcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGRhdGFzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LmlzKGtleSwgZGF0YXNbaV0ua2V5KSkge1xuICAgICAgICAgICAgICAgIHJlcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBjbGVhciAoKSB7XG4gICAgICAgIHRoaXMuZGF0YXMubGVuZ3RoID0gMDtcbiAgICB9XG5cbiAgICBkZWxldGUgKGtleSkge1xuICAgICAgICBsZXQgcmVzID0gZmFsc2U7XG4gICAgICAgIGxldCBkYXRhcyA9IHRoaXMuZGF0YXM7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBkYXRhcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5pcyhrZXksIGRhdGFzW2ldLmtleSkpIHtcbiAgICAgICAgICAgICAgICBkYXRhcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgcmVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGtleXMgKCkge1xuICAgICAgICBsZXQgZGF0YXMgPSB0aGlzLmRhdGFzO1xuICAgICAgICBsZXQga2V5cyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gZGF0YXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGtleXMucHVzaChkYXRhc1tpXS5rZXkpO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIHJldHVybiBrZXlzO1xuICAgIH1cblxuICAgIHZhbHVlcyAoKSB7XG4gICAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICAgIGxldCBkYXRhcyA9IHRoaXMuZGF0YXM7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGFzLmxlbmd0aCA9PT0gMCB8fCBkYXRhc1tpbmRleF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbmU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGRhdGFzW2luZGV4KytdLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBkb25lOiBmYWxzZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfTtcbn07Il19