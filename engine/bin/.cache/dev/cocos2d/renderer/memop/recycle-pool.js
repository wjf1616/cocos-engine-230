
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/memop/recycle-pool.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _timsort = _interopRequireDefault(require("./timsort"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Recycle Pool
 * @class RecyclePool
 */
var RecyclePool =
/*#__PURE__*/
function () {
  function RecyclePool(fn, size) {
    this._fn = fn;
    this._count = 0;
    this._data = new Array(size);

    for (var i = 0; i < size; ++i) {
      this._data[i] = fn();
    }
  }

  var _proto = RecyclePool.prototype;

  _proto.reset = function reset() {
    this._count = 0;
  };

  _proto.resize = function resize(size) {
    if (size > this._data.length) {
      for (var i = this._data.length; i < size; ++i) {
        this._data[i] = this._fn();
      }
    }
  };

  _proto.add = function add() {
    if (this._count >= this._data.length) {
      this.resize(this._data.length * 2);
    }

    return this._data[this._count++];
  };

  _proto.remove = function remove(idx) {
    if (idx >= this._count) {
      return;
    }

    var last = this._count - 1;
    var tmp = this._data[idx];
    this._data[idx] = this._data[last];
    this._data[last] = tmp;
    this._count -= 1;
  };

  _proto.sort = function sort(cmp) {
    return (0, _timsort["default"])(this._data, 0, this._count, cmp);
  };

  _createClass(RecyclePool, [{
    key: "length",
    get: function get() {
      return this._count;
    }
  }, {
    key: "data",
    get: function get() {
      return this._data;
    }
  }]);

  return RecyclePool;
}();

exports["default"] = RecyclePool;
cc.RecyclePool = RecyclePool;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlY3ljbGUtcG9vbC5qcyJdLCJuYW1lcyI6WyJSZWN5Y2xlUG9vbCIsImZuIiwic2l6ZSIsIl9mbiIsIl9jb3VudCIsIl9kYXRhIiwiQXJyYXkiLCJpIiwicmVzZXQiLCJyZXNpemUiLCJsZW5ndGgiLCJhZGQiLCJyZW1vdmUiLCJpZHgiLCJsYXN0IiwidG1wIiwic29ydCIsImNtcCIsImNjIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7O0FBRUE7Ozs7SUFJcUJBOzs7QUFDbkIsdUJBQVlDLEVBQVosRUFBZ0JDLElBQWhCLEVBQXNCO0FBQ3BCLFNBQUtDLEdBQUwsR0FBV0YsRUFBWDtBQUNBLFNBQUtHLE1BQUwsR0FBYyxDQUFkO0FBQ0EsU0FBS0MsS0FBTCxHQUFhLElBQUlDLEtBQUosQ0FBVUosSUFBVixDQUFiOztBQUVBLFNBQUssSUFBSUssQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0wsSUFBcEIsRUFBMEIsRUFBRUssQ0FBNUIsRUFBK0I7QUFDN0IsV0FBS0YsS0FBTCxDQUFXRSxDQUFYLElBQWdCTixFQUFFLEVBQWxCO0FBQ0Q7QUFDRjs7OztTQVVETyxRQUFBLGlCQUFRO0FBQ04sU0FBS0osTUFBTCxHQUFjLENBQWQ7QUFDRDs7U0FFREssU0FBQSxnQkFBT1AsSUFBUCxFQUFhO0FBQ1gsUUFBSUEsSUFBSSxHQUFHLEtBQUtHLEtBQUwsQ0FBV0ssTUFBdEIsRUFBOEI7QUFDNUIsV0FBSyxJQUFJSCxDQUFDLEdBQUcsS0FBS0YsS0FBTCxDQUFXSyxNQUF4QixFQUFnQ0gsQ0FBQyxHQUFHTCxJQUFwQyxFQUEwQyxFQUFFSyxDQUE1QyxFQUErQztBQUM3QyxhQUFLRixLQUFMLENBQVdFLENBQVgsSUFBZ0IsS0FBS0osR0FBTCxFQUFoQjtBQUNEO0FBQ0Y7QUFDRjs7U0FFRFEsTUFBQSxlQUFNO0FBQ0osUUFBSSxLQUFLUCxNQUFMLElBQWUsS0FBS0MsS0FBTCxDQUFXSyxNQUE5QixFQUFzQztBQUNwQyxXQUFLRCxNQUFMLENBQVksS0FBS0osS0FBTCxDQUFXSyxNQUFYLEdBQW9CLENBQWhDO0FBQ0Q7O0FBRUQsV0FBTyxLQUFLTCxLQUFMLENBQVcsS0FBS0QsTUFBTCxFQUFYLENBQVA7QUFDRDs7U0FFRFEsU0FBQSxnQkFBT0MsR0FBUCxFQUFZO0FBQ1YsUUFBSUEsR0FBRyxJQUFJLEtBQUtULE1BQWhCLEVBQXdCO0FBQ3RCO0FBQ0Q7O0FBRUQsUUFBSVUsSUFBSSxHQUFHLEtBQUtWLE1BQUwsR0FBYyxDQUF6QjtBQUNBLFFBQUlXLEdBQUcsR0FBRyxLQUFLVixLQUFMLENBQVdRLEdBQVgsQ0FBVjtBQUNBLFNBQUtSLEtBQUwsQ0FBV1EsR0FBWCxJQUFrQixLQUFLUixLQUFMLENBQVdTLElBQVgsQ0FBbEI7QUFDQSxTQUFLVCxLQUFMLENBQVdTLElBQVgsSUFBbUJDLEdBQW5CO0FBQ0EsU0FBS1gsTUFBTCxJQUFlLENBQWY7QUFDRDs7U0FFRFksT0FBQSxjQUFLQyxHQUFMLEVBQVU7QUFDUixXQUFPLHlCQUFLLEtBQUtaLEtBQVYsRUFBaUIsQ0FBakIsRUFBb0IsS0FBS0QsTUFBekIsRUFBaUNhLEdBQWpDLENBQVA7QUFDRDs7Ozt3QkExQ1k7QUFDWCxhQUFPLEtBQUtiLE1BQVo7QUFDRDs7O3dCQUVVO0FBQ1QsYUFBTyxLQUFLQyxLQUFaO0FBQ0Q7Ozs7Ozs7QUF1Q0hhLEVBQUUsQ0FBQ2xCLFdBQUgsR0FBaUJBLFdBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNvcnQgZnJvbSAnLi90aW1zb3J0JztcblxuLyoqXG4gKiBSZWN5Y2xlIFBvb2xcbiAqIEBjbGFzcyBSZWN5Y2xlUG9vbFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN5Y2xlUG9vbCB7XG4gIGNvbnN0cnVjdG9yKGZuLCBzaXplKSB7XG4gICAgdGhpcy5fZm4gPSBmbjtcbiAgICB0aGlzLl9jb3VudCA9IDA7XG4gICAgdGhpcy5fZGF0YSA9IG5ldyBBcnJheShzaXplKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgKytpKSB7XG4gICAgICB0aGlzLl9kYXRhW2ldID0gZm4oKTtcbiAgICB9XG4gIH1cblxuICBnZXQgbGVuZ3RoKCkge1xuICAgIHJldHVybiB0aGlzLl9jb3VudDtcbiAgfVxuXG4gIGdldCBkYXRhKCkge1xuICAgIHJldHVybiB0aGlzLl9kYXRhO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5fY291bnQgPSAwO1xuICB9XG5cbiAgcmVzaXplKHNpemUpIHtcbiAgICBpZiAoc2l6ZSA+IHRoaXMuX2RhdGEubGVuZ3RoKSB7XG4gICAgICBmb3IgKGxldCBpID0gdGhpcy5fZGF0YS5sZW5ndGg7IGkgPCBzaXplOyArK2kpIHtcbiAgICAgICAgdGhpcy5fZGF0YVtpXSA9IHRoaXMuX2ZuKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYWRkKCkge1xuICAgIGlmICh0aGlzLl9jb3VudCA+PSB0aGlzLl9kYXRhLmxlbmd0aCkge1xuICAgICAgdGhpcy5yZXNpemUodGhpcy5fZGF0YS5sZW5ndGggKiAyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fZGF0YVt0aGlzLl9jb3VudCsrXTtcbiAgfVxuXG4gIHJlbW92ZShpZHgpIHtcbiAgICBpZiAoaWR4ID49IHRoaXMuX2NvdW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGxhc3QgPSB0aGlzLl9jb3VudCAtIDE7XG4gICAgbGV0IHRtcCA9IHRoaXMuX2RhdGFbaWR4XTtcbiAgICB0aGlzLl9kYXRhW2lkeF0gPSB0aGlzLl9kYXRhW2xhc3RdO1xuICAgIHRoaXMuX2RhdGFbbGFzdF0gPSB0bXA7XG4gICAgdGhpcy5fY291bnQgLT0gMTtcbiAgfVxuXG4gIHNvcnQoY21wKSB7XG4gICAgcmV0dXJuIHNvcnQodGhpcy5fZGF0YSwgMCwgdGhpcy5fY291bnQsIGNtcCk7XG4gIH1cbn1cblxuY2MuUmVjeWNsZVBvb2wgPSBSZWN5Y2xlUG9vbDsiXX0=