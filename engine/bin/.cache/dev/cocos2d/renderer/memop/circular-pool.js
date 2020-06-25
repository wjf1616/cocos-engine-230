
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/memop/circular-pool.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var CircularPool =
/*#__PURE__*/
function () {
  function CircularPool(fn, size) {
    this._cursor = 0;
    this._data = new Array(size);

    for (var i = 0; i < size; ++i) {
      this._data[i] = fn();
    }
  }

  var _proto = CircularPool.prototype;

  _proto.request = function request() {
    var item = this._data[this._cursor];
    this._cursor = (this._cursor + 1) % this._data.length;
    return item;
  };

  return CircularPool;
}();

exports["default"] = CircularPool;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNpcmN1bGFyLXBvb2wuanMiXSwibmFtZXMiOlsiQ2lyY3VsYXJQb29sIiwiZm4iLCJzaXplIiwiX2N1cnNvciIsIl9kYXRhIiwiQXJyYXkiLCJpIiwicmVxdWVzdCIsIml0ZW0iLCJsZW5ndGgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBcUJBOzs7QUFDbkIsd0JBQVlDLEVBQVosRUFBZ0JDLElBQWhCLEVBQXNCO0FBQ3BCLFNBQUtDLE9BQUwsR0FBZSxDQUFmO0FBQ0EsU0FBS0MsS0FBTCxHQUFhLElBQUlDLEtBQUosQ0FBVUgsSUFBVixDQUFiOztBQUVBLFNBQUssSUFBSUksQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0osSUFBcEIsRUFBMEIsRUFBRUksQ0FBNUIsRUFBK0I7QUFDN0IsV0FBS0YsS0FBTCxDQUFXRSxDQUFYLElBQWdCTCxFQUFFLEVBQWxCO0FBQ0Q7QUFDRjs7OztTQUVETSxVQUFBLG1CQUFVO0FBQ1IsUUFBSUMsSUFBSSxHQUFHLEtBQUtKLEtBQUwsQ0FBVyxLQUFLRCxPQUFoQixDQUFYO0FBQ0EsU0FBS0EsT0FBTCxHQUFlLENBQUMsS0FBS0EsT0FBTCxHQUFlLENBQWhCLElBQXFCLEtBQUtDLEtBQUwsQ0FBV0ssTUFBL0M7QUFFQSxXQUFPRCxJQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBDaXJjdWxhclBvb2wge1xuICBjb25zdHJ1Y3Rvcihmbiwgc2l6ZSkge1xuICAgIHRoaXMuX2N1cnNvciA9IDA7XG4gICAgdGhpcy5fZGF0YSA9IG5ldyBBcnJheShzaXplKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgKytpKSB7XG4gICAgICB0aGlzLl9kYXRhW2ldID0gZm4oKTtcbiAgICB9XG4gIH1cblxuICByZXF1ZXN0KCkge1xuICAgIGxldCBpdGVtID0gdGhpcy5fZGF0YVt0aGlzLl9jdXJzb3JdO1xuICAgIHRoaXMuX2N1cnNvciA9ICh0aGlzLl9jdXJzb3IgKyAxKSAlIHRoaXMuX2RhdGEubGVuZ3RoO1xuXG4gICAgcmV0dXJuIGl0ZW07XG4gIH1cbn0iXX0=