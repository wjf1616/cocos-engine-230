
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/core/input-assembler.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _gfx = _interopRequireDefault(require("../gfx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var InputAssembler =
/*#__PURE__*/
function () {
  function InputAssembler(vb, ib, pt) {
    if (pt === void 0) {
      pt = _gfx["default"].PT_TRIANGLES;
    }

    this._vertexBuffer = vb;
    this._indexBuffer = ib;
    this._primitiveType = pt;
    this._start = 0;
    this._count = -1; // TODO: instancing data
    // this._stream = 0;
  }
  /**
   * @property {Number} count The number of indices or vertices to dispatch in the draw call.
   */


  _createClass(InputAssembler, [{
    key: "count",
    get: function get() {
      if (this._count !== -1) {
        return this._count;
      }

      if (this._indexBuffer) {
        return this._indexBuffer.count;
      }

      if (this._vertexBuffer) {
        return this._vertexBuffer.count;
      }

      return 0;
    }
  }]);

  return InputAssembler;
}();

exports["default"] = InputAssembler;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlucHV0LWFzc2VtYmxlci5qcyJdLCJuYW1lcyI6WyJJbnB1dEFzc2VtYmxlciIsInZiIiwiaWIiLCJwdCIsImdmeCIsIlBUX1RSSUFOR0xFUyIsIl92ZXJ0ZXhCdWZmZXIiLCJfaW5kZXhCdWZmZXIiLCJfcHJpbWl0aXZlVHlwZSIsIl9zdGFydCIsIl9jb3VudCIsImNvdW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7Ozs7O0lBRXFCQTs7O0FBQ25CLDBCQUFZQyxFQUFaLEVBQWdCQyxFQUFoQixFQUFvQkMsRUFBcEIsRUFBMkM7QUFBQSxRQUF2QkEsRUFBdUI7QUFBdkJBLE1BQUFBLEVBQXVCLEdBQWxCQyxnQkFBSUMsWUFBYztBQUFBOztBQUN6QyxTQUFLQyxhQUFMLEdBQXFCTCxFQUFyQjtBQUNBLFNBQUtNLFlBQUwsR0FBb0JMLEVBQXBCO0FBQ0EsU0FBS00sY0FBTCxHQUFzQkwsRUFBdEI7QUFDQSxTQUFLTSxNQUFMLEdBQWMsQ0FBZDtBQUNBLFNBQUtDLE1BQUwsR0FBYyxDQUFDLENBQWYsQ0FMeUMsQ0FPekM7QUFDQTtBQUNEO0FBRUQ7Ozs7Ozs7d0JBR1k7QUFDVixVQUFJLEtBQUtBLE1BQUwsS0FBZ0IsQ0FBQyxDQUFyQixFQUF3QjtBQUN0QixlQUFPLEtBQUtBLE1BQVo7QUFDRDs7QUFFRCxVQUFJLEtBQUtILFlBQVQsRUFBdUI7QUFDckIsZUFBTyxLQUFLQSxZQUFMLENBQWtCSSxLQUF6QjtBQUNEOztBQUVELFVBQUksS0FBS0wsYUFBVCxFQUF3QjtBQUN0QixlQUFPLEtBQUtBLGFBQUwsQ0FBbUJLLEtBQTFCO0FBQ0Q7O0FBRUQsYUFBTyxDQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuaW1wb3J0IGdmeCBmcm9tICcuLi9nZngnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnB1dEFzc2VtYmxlciB7XG4gIGNvbnN0cnVjdG9yKHZiLCBpYiwgcHQgPSBnZnguUFRfVFJJQU5HTEVTKSB7XG4gICAgdGhpcy5fdmVydGV4QnVmZmVyID0gdmI7XG4gICAgdGhpcy5faW5kZXhCdWZmZXIgPSBpYjtcbiAgICB0aGlzLl9wcmltaXRpdmVUeXBlID0gcHQ7XG4gICAgdGhpcy5fc3RhcnQgPSAwO1xuICAgIHRoaXMuX2NvdW50ID0gLTE7XG5cbiAgICAvLyBUT0RPOiBpbnN0YW5jaW5nIGRhdGFcbiAgICAvLyB0aGlzLl9zdHJlYW0gPSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBjb3VudCBUaGUgbnVtYmVyIG9mIGluZGljZXMgb3IgdmVydGljZXMgdG8gZGlzcGF0Y2ggaW4gdGhlIGRyYXcgY2FsbC5cbiAgICovXG4gIGdldCBjb3VudCgpIHtcbiAgICBpZiAodGhpcy5fY291bnQgIT09IC0xKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY291bnQ7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2luZGV4QnVmZmVyKSB7XG4gICAgICByZXR1cm4gdGhpcy5faW5kZXhCdWZmZXIuY291bnQ7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3ZlcnRleEJ1ZmZlcikge1xuICAgICAgcmV0dXJuIHRoaXMuX3ZlcnRleEJ1ZmZlci5jb3VudDtcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxufSJdfQ==