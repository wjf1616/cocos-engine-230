
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/memop/linked-array.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _pool = _interopRequireDefault(require("./pool"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// NOTE: you must have `_prev` and `_next` field in the object returns by `fn`
var LinkedArray =
/*#__PURE__*/
function () {
  function LinkedArray(fn, size) {
    this._fn = fn;
    this._count = 0;
    this._head = null;
    this._tail = null;
    this._pool = new _pool["default"](fn, size);
  }

  var _proto = LinkedArray.prototype;

  _proto.add = function add() {
    var node = this._pool.alloc();

    if (!this._tail) {
      this._head = node;
    } else {
      this._tail._next = node;
      node._prev = this._tail;
    }

    this._tail = node;
    this._count += 1;
    return node;
  };

  _proto.remove = function remove(node) {
    if (node._prev) {
      node._prev._next = node._next;
    } else {
      this._head = node._next;
    }

    if (node._next) {
      node._next._prev = node._prev;
    } else {
      this._tail = node._prev;
    }

    node._next = null;
    node._prev = null;

    this._pool.free(node);

    this._count -= 1;
  };

  _proto.forEach = function forEach(fn, binder) {
    var cursor = this._head;

    if (!cursor) {
      return;
    }

    if (binder) {
      fn = fn.bind(binder);
    }

    var idx = 0;
    var next = cursor;

    while (cursor) {
      next = cursor._next;
      fn(cursor, idx, this);
      cursor = next;
      ++idx;
    }
  };

  _createClass(LinkedArray, [{
    key: "head",
    get: function get() {
      return this._head;
    }
  }, {
    key: "tail",
    get: function get() {
      return this._tail;
    }
  }, {
    key: "length",
    get: function get() {
      return this._count;
    }
  }]);

  return LinkedArray;
}();

exports["default"] = LinkedArray;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpbmtlZC1hcnJheS5qcyJdLCJuYW1lcyI6WyJMaW5rZWRBcnJheSIsImZuIiwic2l6ZSIsIl9mbiIsIl9jb3VudCIsIl9oZWFkIiwiX3RhaWwiLCJfcG9vbCIsIlBvb2wiLCJhZGQiLCJub2RlIiwiYWxsb2MiLCJfbmV4dCIsIl9wcmV2IiwicmVtb3ZlIiwiZnJlZSIsImZvckVhY2giLCJiaW5kZXIiLCJjdXJzb3IiLCJiaW5kIiwiaWR4IiwibmV4dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7OztBQUVBO0lBRXFCQTs7O0FBQ25CLHVCQUFZQyxFQUFaLEVBQWdCQyxJQUFoQixFQUFzQjtBQUNwQixTQUFLQyxHQUFMLEdBQVdGLEVBQVg7QUFDQSxTQUFLRyxNQUFMLEdBQWMsQ0FBZDtBQUNBLFNBQUtDLEtBQUwsR0FBYSxJQUFiO0FBQ0EsU0FBS0MsS0FBTCxHQUFhLElBQWI7QUFFQSxTQUFLQyxLQUFMLEdBQWEsSUFBSUMsZ0JBQUosQ0FBU1AsRUFBVCxFQUFhQyxJQUFiLENBQWI7QUFDRDs7OztTQWNETyxNQUFBLGVBQU07QUFDSixRQUFJQyxJQUFJLEdBQUcsS0FBS0gsS0FBTCxDQUFXSSxLQUFYLEVBQVg7O0FBRUEsUUFBSSxDQUFDLEtBQUtMLEtBQVYsRUFBaUI7QUFDZixXQUFLRCxLQUFMLEdBQWFLLElBQWI7QUFDRCxLQUZELE1BRU87QUFDTCxXQUFLSixLQUFMLENBQVdNLEtBQVgsR0FBbUJGLElBQW5CO0FBQ0FBLE1BQUFBLElBQUksQ0FBQ0csS0FBTCxHQUFhLEtBQUtQLEtBQWxCO0FBQ0Q7O0FBQ0QsU0FBS0EsS0FBTCxHQUFhSSxJQUFiO0FBQ0EsU0FBS04sTUFBTCxJQUFlLENBQWY7QUFFQSxXQUFPTSxJQUFQO0FBQ0Q7O1NBRURJLFNBQUEsZ0JBQU9KLElBQVAsRUFBYTtBQUNYLFFBQUlBLElBQUksQ0FBQ0csS0FBVCxFQUFnQjtBQUNkSCxNQUFBQSxJQUFJLENBQUNHLEtBQUwsQ0FBV0QsS0FBWCxHQUFtQkYsSUFBSSxDQUFDRSxLQUF4QjtBQUNELEtBRkQsTUFFTztBQUNMLFdBQUtQLEtBQUwsR0FBYUssSUFBSSxDQUFDRSxLQUFsQjtBQUNEOztBQUVELFFBQUlGLElBQUksQ0FBQ0UsS0FBVCxFQUFnQjtBQUNkRixNQUFBQSxJQUFJLENBQUNFLEtBQUwsQ0FBV0MsS0FBWCxHQUFtQkgsSUFBSSxDQUFDRyxLQUF4QjtBQUNELEtBRkQsTUFFTztBQUNMLFdBQUtQLEtBQUwsR0FBYUksSUFBSSxDQUFDRyxLQUFsQjtBQUNEOztBQUVESCxJQUFBQSxJQUFJLENBQUNFLEtBQUwsR0FBYSxJQUFiO0FBQ0FGLElBQUFBLElBQUksQ0FBQ0csS0FBTCxHQUFhLElBQWI7O0FBQ0EsU0FBS04sS0FBTCxDQUFXUSxJQUFYLENBQWdCTCxJQUFoQjs7QUFDQSxTQUFLTixNQUFMLElBQWUsQ0FBZjtBQUNEOztTQUVEWSxVQUFBLGlCQUFRZixFQUFSLEVBQVlnQixNQUFaLEVBQW9CO0FBQ2xCLFFBQUlDLE1BQU0sR0FBRyxLQUFLYixLQUFsQjs7QUFDQSxRQUFJLENBQUNhLE1BQUwsRUFBYTtBQUNYO0FBQ0Q7O0FBRUQsUUFBSUQsTUFBSixFQUFZO0FBQ1ZoQixNQUFBQSxFQUFFLEdBQUdBLEVBQUUsQ0FBQ2tCLElBQUgsQ0FBUUYsTUFBUixDQUFMO0FBQ0Q7O0FBRUQsUUFBSUcsR0FBRyxHQUFHLENBQVY7QUFDQSxRQUFJQyxJQUFJLEdBQUdILE1BQVg7O0FBRUEsV0FBT0EsTUFBUCxFQUFlO0FBQ2JHLE1BQUFBLElBQUksR0FBR0gsTUFBTSxDQUFDTixLQUFkO0FBQ0FYLE1BQUFBLEVBQUUsQ0FBQ2lCLE1BQUQsRUFBU0UsR0FBVCxFQUFjLElBQWQsQ0FBRjtBQUVBRixNQUFBQSxNQUFNLEdBQUdHLElBQVQ7QUFDQSxRQUFFRCxHQUFGO0FBQ0Q7QUFDRjs7Ozt3QkFsRVU7QUFDVCxhQUFPLEtBQUtmLEtBQVo7QUFDRDs7O3dCQUVVO0FBQ1QsYUFBTyxLQUFLQyxLQUFaO0FBQ0Q7Ozt3QkFFWTtBQUNYLGFBQU8sS0FBS0YsTUFBWjtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBvb2wgZnJvbSAnLi9wb29sJztcblxuLy8gTk9URTogeW91IG11c3QgaGF2ZSBgX3ByZXZgIGFuZCBgX25leHRgIGZpZWxkIGluIHRoZSBvYmplY3QgcmV0dXJucyBieSBgZm5gXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmtlZEFycmF5IHtcbiAgY29uc3RydWN0b3IoZm4sIHNpemUpIHtcbiAgICB0aGlzLl9mbiA9IGZuO1xuICAgIHRoaXMuX2NvdW50ID0gMDtcbiAgICB0aGlzLl9oZWFkID0gbnVsbDtcbiAgICB0aGlzLl90YWlsID0gbnVsbDtcblxuICAgIHRoaXMuX3Bvb2wgPSBuZXcgUG9vbChmbiwgc2l6ZSk7XG4gIH1cblxuICBnZXQgaGVhZCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhZDtcbiAgfVxuXG4gIGdldCB0YWlsKCkge1xuICAgIHJldHVybiB0aGlzLl90YWlsO1xuICB9XG5cbiAgZ2V0IGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5fY291bnQ7XG4gIH1cblxuICBhZGQoKSB7XG4gICAgbGV0IG5vZGUgPSB0aGlzLl9wb29sLmFsbG9jKCk7XG5cbiAgICBpZiAoIXRoaXMuX3RhaWwpIHtcbiAgICAgIHRoaXMuX2hlYWQgPSBub2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl90YWlsLl9uZXh0ID0gbm9kZTtcbiAgICAgIG5vZGUuX3ByZXYgPSB0aGlzLl90YWlsO1xuICAgIH1cbiAgICB0aGlzLl90YWlsID0gbm9kZTtcbiAgICB0aGlzLl9jb3VudCArPSAxO1xuXG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICByZW1vdmUobm9kZSkge1xuICAgIGlmIChub2RlLl9wcmV2KSB7XG4gICAgICBub2RlLl9wcmV2Ll9uZXh0ID0gbm9kZS5fbmV4dDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faGVhZCA9IG5vZGUuX25leHQ7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuX25leHQpIHtcbiAgICAgIG5vZGUuX25leHQuX3ByZXYgPSBub2RlLl9wcmV2O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl90YWlsID0gbm9kZS5fcHJldjtcbiAgICB9XG5cbiAgICBub2RlLl9uZXh0ID0gbnVsbDtcbiAgICBub2RlLl9wcmV2ID0gbnVsbDtcbiAgICB0aGlzLl9wb29sLmZyZWUobm9kZSk7XG4gICAgdGhpcy5fY291bnQgLT0gMTtcbiAgfVxuXG4gIGZvckVhY2goZm4sIGJpbmRlcikge1xuICAgIGxldCBjdXJzb3IgPSB0aGlzLl9oZWFkO1xuICAgIGlmICghY3Vyc29yKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGJpbmRlcikge1xuICAgICAgZm4gPSBmbi5iaW5kKGJpbmRlcik7XG4gICAgfVxuXG4gICAgbGV0IGlkeCA9IDA7XG4gICAgbGV0IG5leHQgPSBjdXJzb3I7XG5cbiAgICB3aGlsZSAoY3Vyc29yKSB7XG4gICAgICBuZXh0ID0gY3Vyc29yLl9uZXh0O1xuICAgICAgZm4oY3Vyc29yLCBpZHgsIHRoaXMpO1xuXG4gICAgICBjdXJzb3IgPSBuZXh0O1xuICAgICAgKytpZHg7XG4gICAgfVxuICB9XG59Il19