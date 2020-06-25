
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/memop/fixed-array.js';
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

var FixedArray =
/*#__PURE__*/
function () {
  function FixedArray(size) {
    this._count = 0;
    this._data = new Array(size);
  }

  var _proto = FixedArray.prototype;

  _proto._resize = function _resize(size) {
    if (size > this._data.length) {
      for (var i = this._data.length; i < size; ++i) {
        this._data[i] = undefined;
      }
    }
  };

  _proto.reset = function reset() {
    for (var i = 0; i < this._count; ++i) {
      this._data[i] = undefined;
    }

    this._count = 0;
  };

  _proto.push = function push(val) {
    if (this._count >= this._data.length) {
      this._resize(this._data.length * 2);
    }

    this._data[this._count] = val;
    ++this._count;
  };

  _proto.pop = function pop() {
    --this._count;

    if (this._count < 0) {
      this._count = 0;
    }

    var ret = this._data[this._count];
    this._data[this._count] = undefined;
    return ret;
  };

  _proto.fastRemove = function fastRemove(idx) {
    if (idx >= this._count || idx < 0) {
      return;
    }

    var last = this._count - 1;
    this._data[idx] = this._data[last];
    this._data[last] = undefined;
    this._count -= 1;
  };

  _proto.indexOf = function indexOf(val) {
    return this._data.indexOf(val);
  };

  _proto.sort = function sort(cmp) {
    return (0, _timsort["default"])(this._data, 0, this._count, cmp);
  };

  _createClass(FixedArray, [{
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

  return FixedArray;
}();

exports["default"] = FixedArray;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpeGVkLWFycmF5LmpzIl0sIm5hbWVzIjpbIkZpeGVkQXJyYXkiLCJzaXplIiwiX2NvdW50IiwiX2RhdGEiLCJBcnJheSIsIl9yZXNpemUiLCJsZW5ndGgiLCJpIiwidW5kZWZpbmVkIiwicmVzZXQiLCJwdXNoIiwidmFsIiwicG9wIiwicmV0IiwiZmFzdFJlbW92ZSIsImlkeCIsImxhc3QiLCJpbmRleE9mIiwic29ydCIsImNtcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7OztJQUVxQkE7OztBQUNuQixzQkFBWUMsSUFBWixFQUFrQjtBQUNoQixTQUFLQyxNQUFMLEdBQWMsQ0FBZDtBQUNBLFNBQUtDLEtBQUwsR0FBYSxJQUFJQyxLQUFKLENBQVVILElBQVYsQ0FBYjtBQUNEOzs7O1NBRURJLFVBQUEsaUJBQVFKLElBQVIsRUFBYztBQUNaLFFBQUlBLElBQUksR0FBRyxLQUFLRSxLQUFMLENBQVdHLE1BQXRCLEVBQThCO0FBQzVCLFdBQUssSUFBSUMsQ0FBQyxHQUFHLEtBQUtKLEtBQUwsQ0FBV0csTUFBeEIsRUFBZ0NDLENBQUMsR0FBR04sSUFBcEMsRUFBMEMsRUFBRU0sQ0FBNUMsRUFBK0M7QUFDN0MsYUFBS0osS0FBTCxDQUFXSSxDQUFYLElBQWdCQyxTQUFoQjtBQUNEO0FBQ0Y7QUFDRjs7U0FVREMsUUFBQSxpQkFBUTtBQUNOLFNBQUssSUFBSUYsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxLQUFLTCxNQUF6QixFQUFpQyxFQUFFSyxDQUFuQyxFQUFzQztBQUNwQyxXQUFLSixLQUFMLENBQVdJLENBQVgsSUFBZ0JDLFNBQWhCO0FBQ0Q7O0FBRUQsU0FBS04sTUFBTCxHQUFjLENBQWQ7QUFDRDs7U0FFRFEsT0FBQSxjQUFLQyxHQUFMLEVBQVU7QUFDUixRQUFJLEtBQUtULE1BQUwsSUFBZSxLQUFLQyxLQUFMLENBQVdHLE1BQTlCLEVBQXNDO0FBQ3BDLFdBQUtELE9BQUwsQ0FBYSxLQUFLRixLQUFMLENBQVdHLE1BQVgsR0FBb0IsQ0FBakM7QUFDRDs7QUFFRCxTQUFLSCxLQUFMLENBQVcsS0FBS0QsTUFBaEIsSUFBMEJTLEdBQTFCO0FBQ0EsTUFBRSxLQUFLVCxNQUFQO0FBQ0Q7O1NBRURVLE1BQUEsZUFBTTtBQUNKLE1BQUUsS0FBS1YsTUFBUDs7QUFFQSxRQUFJLEtBQUtBLE1BQUwsR0FBYyxDQUFsQixFQUFxQjtBQUNuQixXQUFLQSxNQUFMLEdBQWMsQ0FBZDtBQUNEOztBQUVELFFBQUlXLEdBQUcsR0FBRyxLQUFLVixLQUFMLENBQVcsS0FBS0QsTUFBaEIsQ0FBVjtBQUNBLFNBQUtDLEtBQUwsQ0FBVyxLQUFLRCxNQUFoQixJQUEwQk0sU0FBMUI7QUFFQSxXQUFPSyxHQUFQO0FBQ0Q7O1NBRURDLGFBQUEsb0JBQVdDLEdBQVgsRUFBZ0I7QUFDZCxRQUFJQSxHQUFHLElBQUksS0FBS2IsTUFBWixJQUFzQmEsR0FBRyxHQUFHLENBQWhDLEVBQW1DO0FBQ2pDO0FBQ0Q7O0FBRUQsUUFBSUMsSUFBSSxHQUFHLEtBQUtkLE1BQUwsR0FBYyxDQUF6QjtBQUNBLFNBQUtDLEtBQUwsQ0FBV1ksR0FBWCxJQUFrQixLQUFLWixLQUFMLENBQVdhLElBQVgsQ0FBbEI7QUFDQSxTQUFLYixLQUFMLENBQVdhLElBQVgsSUFBbUJSLFNBQW5CO0FBQ0EsU0FBS04sTUFBTCxJQUFlLENBQWY7QUFDRDs7U0FFRGUsVUFBQSxpQkFBUU4sR0FBUixFQUFhO0FBQ1gsV0FBTyxLQUFLUixLQUFMLENBQVdjLE9BQVgsQ0FBbUJOLEdBQW5CLENBQVA7QUFDRDs7U0FFRE8sT0FBQSxjQUFLQyxHQUFMLEVBQVU7QUFDUixXQUFPLHlCQUFLLEtBQUtoQixLQUFWLEVBQWlCLENBQWpCLEVBQW9CLEtBQUtELE1BQXpCLEVBQWlDaUIsR0FBakMsQ0FBUDtBQUNEOzs7O3dCQXZEWTtBQUNYLGFBQU8sS0FBS2pCLE1BQVo7QUFDRDs7O3dCQUVVO0FBQ1QsYUFBTyxLQUFLQyxLQUFaO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc29ydCBmcm9tICcuL3RpbXNvcnQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaXhlZEFycmF5IHtcbiAgY29uc3RydWN0b3Ioc2l6ZSkge1xuICAgIHRoaXMuX2NvdW50ID0gMDtcbiAgICB0aGlzLl9kYXRhID0gbmV3IEFycmF5KHNpemUpO1xuICB9XG5cbiAgX3Jlc2l6ZShzaXplKSB7XG4gICAgaWYgKHNpemUgPiB0aGlzLl9kYXRhLmxlbmd0aCkge1xuICAgICAgZm9yIChsZXQgaSA9IHRoaXMuX2RhdGEubGVuZ3RoOyBpIDwgc2l6ZTsgKytpKSB7XG4gICAgICAgIHRoaXMuX2RhdGFbaV0gPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0IGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5fY291bnQ7XG4gIH1cblxuICBnZXQgZGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fY291bnQ7ICsraSkge1xuICAgICAgdGhpcy5fZGF0YVtpXSA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB0aGlzLl9jb3VudCA9IDA7XG4gIH1cblxuICBwdXNoKHZhbCkge1xuICAgIGlmICh0aGlzLl9jb3VudCA+PSB0aGlzLl9kYXRhLmxlbmd0aCkge1xuICAgICAgdGhpcy5fcmVzaXplKHRoaXMuX2RhdGEubGVuZ3RoICogMik7XG4gICAgfVxuXG4gICAgdGhpcy5fZGF0YVt0aGlzLl9jb3VudF0gPSB2YWw7XG4gICAgKyt0aGlzLl9jb3VudDtcbiAgfVxuXG4gIHBvcCgpIHtcbiAgICAtLXRoaXMuX2NvdW50O1xuXG4gICAgaWYgKHRoaXMuX2NvdW50IDwgMCkge1xuICAgICAgdGhpcy5fY291bnQgPSAwO1xuICAgIH1cblxuICAgIGxldCByZXQgPSB0aGlzLl9kYXRhW3RoaXMuX2NvdW50XTtcbiAgICB0aGlzLl9kYXRhW3RoaXMuX2NvdW50XSA9IHVuZGVmaW5lZDtcblxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICBmYXN0UmVtb3ZlKGlkeCkge1xuICAgIGlmIChpZHggPj0gdGhpcy5fY291bnQgfHwgaWR4IDwgMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBsYXN0ID0gdGhpcy5fY291bnQgLSAxO1xuICAgIHRoaXMuX2RhdGFbaWR4XSA9IHRoaXMuX2RhdGFbbGFzdF07XG4gICAgdGhpcy5fZGF0YVtsYXN0XSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9jb3VudCAtPSAxO1xuICB9XG5cbiAgaW5kZXhPZih2YWwpIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5pbmRleE9mKHZhbCk7XG4gIH1cblxuICBzb3J0KGNtcCkge1xuICAgIHJldHVybiBzb3J0KHRoaXMuX2RhdGEsIDAsIHRoaXMuX2NvdW50LCBjbXApO1xuICB9XG59Il19