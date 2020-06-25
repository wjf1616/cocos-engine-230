
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/memop/pool.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var Pool =
/*#__PURE__*/
function () {
  function Pool(fn, size) {
    this._fn = fn;
    this._idx = size - 1;
    this._frees = new Array(size);

    for (var i = 0; i < size; ++i) {
      this._frees[i] = fn();
    }
  }

  var _proto = Pool.prototype;

  _proto._expand = function _expand(size) {
    var old = this._frees;
    this._frees = new Array(size);
    var len = size - old.length;

    for (var i = 0; i < len; ++i) {
      this._frees[i] = this._fn();
    }

    for (var _i = len, j = 0; _i < size; ++_i, ++j) {
      this._frees[_i] = old[j];
    }

    this._idx += len;
  };

  _proto.alloc = function alloc() {
    // create some more space (expand by 20%, minimum 1)
    if (this._idx < 0) {
      this._expand(Math.round(this._frees.length * 1.2) + 1);
    }

    var ret = this._frees[this._idx];
    this._frees[this._idx] = null;
    --this._idx;
    return ret;
  };

  _proto.free = function free(obj) {
    ++this._idx;
    this._frees[this._idx] = obj;
  }
  /**
   * 清除对象池。
   * @param fn 清除回调，对每个释放的对象调用一次。
   */
  ;

  _proto.clear = function clear(fn) {
    for (var i = 0; i <= this._idx; i++) {
      if (fn) {
        fn(this._frees[i]);
      }
    }

    this._frees.length = 0;
    this._idx = -1;
  };

  return Pool;
}();

exports["default"] = Pool;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBvb2wuanMiXSwibmFtZXMiOlsiUG9vbCIsImZuIiwic2l6ZSIsIl9mbiIsIl9pZHgiLCJfZnJlZXMiLCJBcnJheSIsImkiLCJfZXhwYW5kIiwib2xkIiwibGVuIiwibGVuZ3RoIiwiaiIsImFsbG9jIiwiTWF0aCIsInJvdW5kIiwicmV0IiwiZnJlZSIsIm9iaiIsImNsZWFyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0lBQXFCQTs7O0FBQ25CLGdCQUFZQyxFQUFaLEVBQWdCQyxJQUFoQixFQUFzQjtBQUNwQixTQUFLQyxHQUFMLEdBQVdGLEVBQVg7QUFDQSxTQUFLRyxJQUFMLEdBQVlGLElBQUksR0FBRyxDQUFuQjtBQUNBLFNBQUtHLE1BQUwsR0FBYyxJQUFJQyxLQUFKLENBQVVKLElBQVYsQ0FBZDs7QUFFQSxTQUFLLElBQUlLLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdMLElBQXBCLEVBQTBCLEVBQUVLLENBQTVCLEVBQStCO0FBQzdCLFdBQUtGLE1BQUwsQ0FBWUUsQ0FBWixJQUFpQk4sRUFBRSxFQUFuQjtBQUNEO0FBQ0Y7Ozs7U0FFRE8sVUFBQSxpQkFBUU4sSUFBUixFQUFjO0FBQ1osUUFBSU8sR0FBRyxHQUFHLEtBQUtKLE1BQWY7QUFDQSxTQUFLQSxNQUFMLEdBQWMsSUFBSUMsS0FBSixDQUFVSixJQUFWLENBQWQ7QUFFQSxRQUFJUSxHQUFHLEdBQUdSLElBQUksR0FBR08sR0FBRyxDQUFDRSxNQUFyQjs7QUFDQSxTQUFLLElBQUlKLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdHLEdBQXBCLEVBQXlCLEVBQUVILENBQTNCLEVBQThCO0FBQzVCLFdBQUtGLE1BQUwsQ0FBWUUsQ0FBWixJQUFpQixLQUFLSixHQUFMLEVBQWpCO0FBQ0Q7O0FBRUQsU0FBSyxJQUFJSSxFQUFDLEdBQUdHLEdBQVIsRUFBYUUsQ0FBQyxHQUFHLENBQXRCLEVBQXlCTCxFQUFDLEdBQUdMLElBQTdCLEVBQW1DLEVBQUVLLEVBQUYsRUFBSyxFQUFFSyxDQUExQyxFQUE2QztBQUMzQyxXQUFLUCxNQUFMLENBQVlFLEVBQVosSUFBaUJFLEdBQUcsQ0FBQ0csQ0FBRCxDQUFwQjtBQUNEOztBQUVELFNBQUtSLElBQUwsSUFBYU0sR0FBYjtBQUNEOztTQUVERyxRQUFBLGlCQUFRO0FBQ047QUFDQSxRQUFJLEtBQUtULElBQUwsR0FBWSxDQUFoQixFQUFtQjtBQUNqQixXQUFLSSxPQUFMLENBQWFNLElBQUksQ0FBQ0MsS0FBTCxDQUFXLEtBQUtWLE1BQUwsQ0FBWU0sTUFBWixHQUFxQixHQUFoQyxJQUF1QyxDQUFwRDtBQUNEOztBQUVELFFBQUlLLEdBQUcsR0FBRyxLQUFLWCxNQUFMLENBQVksS0FBS0QsSUFBakIsQ0FBVjtBQUNBLFNBQUtDLE1BQUwsQ0FBWSxLQUFLRCxJQUFqQixJQUF5QixJQUF6QjtBQUNBLE1BQUUsS0FBS0EsSUFBUDtBQUVBLFdBQU9ZLEdBQVA7QUFDRDs7U0FFREMsT0FBQSxjQUFLQyxHQUFMLEVBQVU7QUFDUixNQUFFLEtBQUtkLElBQVA7QUFDQSxTQUFLQyxNQUFMLENBQVksS0FBS0QsSUFBakIsSUFBeUJjLEdBQXpCO0FBQ0Q7QUFFRDs7Ozs7O1NBSUFDLFFBQUEsZUFBT2xCLEVBQVAsRUFBVztBQUNULFNBQUssSUFBSU0sQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsSUFBSSxLQUFLSCxJQUExQixFQUFnQ0csQ0FBQyxFQUFqQyxFQUFxQztBQUNqQyxVQUFJTixFQUFKLEVBQVE7QUFDSkEsUUFBQUEsRUFBRSxDQUFDLEtBQUtJLE1BQUwsQ0FBWUUsQ0FBWixDQUFELENBQUY7QUFDSDtBQUNKOztBQUNELFNBQUtGLE1BQUwsQ0FBWU0sTUFBWixHQUFxQixDQUFyQjtBQUNBLFNBQUtQLElBQUwsR0FBWSxDQUFDLENBQWI7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvb2wge1xuICBjb25zdHJ1Y3Rvcihmbiwgc2l6ZSkge1xuICAgIHRoaXMuX2ZuID0gZm47XG4gICAgdGhpcy5faWR4ID0gc2l6ZSAtIDE7XG4gICAgdGhpcy5fZnJlZXMgPSBuZXcgQXJyYXkoc2l6ZSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7ICsraSkge1xuICAgICAgdGhpcy5fZnJlZXNbaV0gPSBmbigpO1xuICAgIH1cbiAgfVxuXG4gIF9leHBhbmQoc2l6ZSkge1xuICAgIGxldCBvbGQgPSB0aGlzLl9mcmVlcztcbiAgICB0aGlzLl9mcmVlcyA9IG5ldyBBcnJheShzaXplKTtcblxuICAgIGxldCBsZW4gPSBzaXplIC0gb2xkLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICB0aGlzLl9mcmVlc1tpXSA9IHRoaXMuX2ZuKCk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IGxlbiwgaiA9IDA7IGkgPCBzaXplOyArK2ksICsraikge1xuICAgICAgdGhpcy5fZnJlZXNbaV0gPSBvbGRbal07XG4gICAgfVxuXG4gICAgdGhpcy5faWR4ICs9IGxlbjtcbiAgfVxuXG4gIGFsbG9jKCkge1xuICAgIC8vIGNyZWF0ZSBzb21lIG1vcmUgc3BhY2UgKGV4cGFuZCBieSAyMCUsIG1pbmltdW0gMSlcbiAgICBpZiAodGhpcy5faWR4IDwgMCkge1xuICAgICAgdGhpcy5fZXhwYW5kKE1hdGgucm91bmQodGhpcy5fZnJlZXMubGVuZ3RoICogMS4yKSArIDEpO1xuICAgIH1cblxuICAgIGxldCByZXQgPSB0aGlzLl9mcmVlc1t0aGlzLl9pZHhdO1xuICAgIHRoaXMuX2ZyZWVzW3RoaXMuX2lkeF0gPSBudWxsO1xuICAgIC0tdGhpcy5faWR4O1xuXG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIGZyZWUob2JqKSB7XG4gICAgKyt0aGlzLl9pZHg7XG4gICAgdGhpcy5fZnJlZXNbdGhpcy5faWR4XSA9IG9iajtcbiAgfVxuXG4gIC8qKlxuICAgKiDmuIXpmaTlr7nosaHmsaDjgIJcbiAgICogQHBhcmFtIGZuIOa4hemZpOWbnuiwg++8jOWvueavj+S4qumHiuaUvueahOWvueixoeiwg+eUqOS4gOasoeOAglxuICAgKi9cbiAgY2xlYXIgKGZuKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gdGhpcy5faWR4OyBpKyspIHtcbiAgICAgICAgaWYgKGZuKSB7XG4gICAgICAgICAgICBmbih0aGlzLl9mcmVlc1tpXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5fZnJlZXMubGVuZ3RoID0gMDtcbiAgICB0aGlzLl9pZHggPSAtMTtcbiAgfVxufSJdfQ==