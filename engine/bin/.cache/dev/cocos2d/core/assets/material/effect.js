
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/material/effect.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _effectBase = _interopRequireDefault(require("./effect-base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Effect =
/*#__PURE__*/
function (_EffectBase) {
  _inheritsLoose(Effect, _EffectBase);

  _createClass(Effect, [{
    key: "technique",
    get: function get() {
      return this._technique;
    }
  }, {
    key: "passes",
    get: function get() {
      return this._technique.passes;
    }
    /**
     * @param {Array} techniques
     */

  }]);

  function Effect(name, techniques, techniqueIndex, asset) {
    var _this;

    _this = _EffectBase.call(this) || this;
    _this._techniques = [];
    _this._asset = null;

    _this.init(name, techniques, techniqueIndex, asset, true);

    return _this;
  }

  var _proto = Effect.prototype;

  _proto.init = function init(name, techniques, techniqueIndex, asset, createNative) {
    this._name = name;
    this._techniques = techniques;
    this._technique = techniques[techniqueIndex];
    this._asset = asset;
  };

  _proto.switchTechnique = function switchTechnique(index) {
    if (index >= this._techniques.length) {
      cc.warn("Can not switch to technique with index [" + index + "]");
      return;
    }

    this._technique = this._techniques[index];
  };

  _proto.clear = function clear() {
    this._techniques = [];
  };

  _proto.clone = function clone() {
    var techniques = [];

    for (var i = 0; i < this._techniques.length; i++) {
      techniques.push(this._techniques[i].clone());
    }

    var techniqueIndex = this._techniques.indexOf(this._technique);

    return new Effect(this._name, techniques, techniqueIndex, this._asset);
  };

  return Effect;
}(_effectBase["default"]);

exports["default"] = Effect;
cc.Effect = Effect;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVmZmVjdC50cyJdLCJuYW1lcyI6WyJFZmZlY3QiLCJfdGVjaG5pcXVlIiwicGFzc2VzIiwibmFtZSIsInRlY2huaXF1ZXMiLCJ0ZWNobmlxdWVJbmRleCIsImFzc2V0IiwiX3RlY2huaXF1ZXMiLCJfYXNzZXQiLCJpbml0IiwiY3JlYXRlTmF0aXZlIiwiX25hbWUiLCJzd2l0Y2hUZWNobmlxdWUiLCJpbmRleCIsImxlbmd0aCIsImNjIiwid2FybiIsImNsZWFyIiwiY2xvbmUiLCJpIiwicHVzaCIsImluZGV4T2YiLCJFZmZlY3RCYXNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBR0E7Ozs7Ozs7Ozs7SUFFcUJBOzs7Ozs7O3dCQUtBO0FBQ2IsYUFBTyxLQUFLQyxVQUFaO0FBQ0g7Ozt3QkFFYTtBQUNWLGFBQU8sS0FBS0EsVUFBTCxDQUFnQkMsTUFBdkI7QUFDSDtBQUVEOzs7Ozs7QUFHQSxrQkFBYUMsSUFBYixFQUFtQkMsVUFBbkIsRUFBK0JDLGNBQS9CLEVBQStDQyxLQUEvQyxFQUFzRDtBQUFBOztBQUNsRDtBQURrRCxVQWR0REMsV0Fjc0QsR0FkM0IsRUFjMkI7QUFBQSxVQWJ0REMsTUFhc0QsR0FiN0MsSUFhNkM7O0FBRWxELFVBQUtDLElBQUwsQ0FBVU4sSUFBVixFQUFnQkMsVUFBaEIsRUFBNEJDLGNBQTVCLEVBQTRDQyxLQUE1QyxFQUFtRCxJQUFuRDs7QUFGa0Q7QUFHckQ7Ozs7U0FFREcsT0FBQSxjQUFNTixJQUFOLEVBQVlDLFVBQVosRUFBd0JDLGNBQXhCLEVBQXdDQyxLQUF4QyxFQUErQ0ksWUFBL0MsRUFBNkQ7QUFDekQsU0FBS0MsS0FBTCxHQUFhUixJQUFiO0FBQ0EsU0FBS0ksV0FBTCxHQUFtQkgsVUFBbkI7QUFDQSxTQUFLSCxVQUFMLEdBQWtCRyxVQUFVLENBQUNDLGNBQUQsQ0FBNUI7QUFDQSxTQUFLRyxNQUFMLEdBQWNGLEtBQWQ7QUFDSDs7U0FFRE0sa0JBQUEseUJBQWlCQyxLQUFqQixFQUF3QjtBQUNwQixRQUFJQSxLQUFLLElBQUksS0FBS04sV0FBTCxDQUFpQk8sTUFBOUIsRUFBc0M7QUFDbENDLE1BQUFBLEVBQUUsQ0FBQ0MsSUFBSCw4Q0FBbURILEtBQW5EO0FBQ0E7QUFDSDs7QUFFRCxTQUFLWixVQUFMLEdBQWtCLEtBQUtNLFdBQUwsQ0FBaUJNLEtBQWpCLENBQWxCO0FBQ0g7O1NBRURJLFFBQUEsaUJBQVM7QUFDTCxTQUFLVixXQUFMLEdBQW1CLEVBQW5CO0FBQ0g7O1NBRURXLFFBQUEsaUJBQVM7QUFDTCxRQUFJZCxVQUFVLEdBQUcsRUFBakI7O0FBQ0EsU0FBSyxJQUFJZSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHLEtBQUtaLFdBQUwsQ0FBaUJPLE1BQXJDLEVBQTZDSyxDQUFDLEVBQTlDLEVBQWtEO0FBQzlDZixNQUFBQSxVQUFVLENBQUNnQixJQUFYLENBQWdCLEtBQUtiLFdBQUwsQ0FBaUJZLENBQWpCLEVBQW9CRCxLQUFwQixFQUFoQjtBQUNIOztBQUVELFFBQUliLGNBQWMsR0FBRyxLQUFLRSxXQUFMLENBQWlCYyxPQUFqQixDQUF5QixLQUFLcEIsVUFBOUIsQ0FBckI7O0FBQ0EsV0FBTyxJQUFJRCxNQUFKLENBQVcsS0FBS1csS0FBaEIsRUFBdUJQLFVBQXZCLEVBQW1DQyxjQUFuQyxFQUFtRCxLQUFLRyxNQUF4RCxDQUFQO0FBQ0g7OztFQWpEK0JjOzs7QUFvRHBDUCxFQUFFLENBQUNmLE1BQUgsR0FBWUEsTUFBWiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG5pbXBvcnQgVGVjaG5pcXVlIGZyb20gJy4uLy4uLy4uL3JlbmRlcmVyL2NvcmUvdGVjaG5pcXVlJztcbmltcG9ydCBFZmZlY3RCYXNlIGZyb20gJy4vZWZmZWN0LWJhc2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZmZlY3QgZXh0ZW5kcyBFZmZlY3RCYXNlIHtcblxuICAgIF90ZWNobmlxdWVzOiBUZWNobmlxdWVbXSA9IFtdO1xuICAgIF9hc3NldCA9IG51bGw7XG4gICAgXG4gICAgZ2V0IHRlY2huaXF1ZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90ZWNobmlxdWU7XG4gICAgfVxuXG4gICAgZ2V0IHBhc3NlcyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90ZWNobmlxdWUucGFzc2VzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHRlY2huaXF1ZXNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvciAobmFtZSwgdGVjaG5pcXVlcywgdGVjaG5pcXVlSW5kZXgsIGFzc2V0KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuaW5pdChuYW1lLCB0ZWNobmlxdWVzLCB0ZWNobmlxdWVJbmRleCwgYXNzZXQsIHRydWUpO1xuICAgIH1cblxuICAgIGluaXQgKG5hbWUsIHRlY2huaXF1ZXMsIHRlY2huaXF1ZUluZGV4LCBhc3NldCwgY3JlYXRlTmF0aXZlKSB7XG4gICAgICAgIHRoaXMuX25hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLl90ZWNobmlxdWVzID0gdGVjaG5pcXVlcztcbiAgICAgICAgdGhpcy5fdGVjaG5pcXVlID0gdGVjaG5pcXVlc1t0ZWNobmlxdWVJbmRleF07XG4gICAgICAgIHRoaXMuX2Fzc2V0ID0gYXNzZXQ7XG4gICAgfVxuXG4gICAgc3dpdGNoVGVjaG5pcXVlIChpbmRleCkge1xuICAgICAgICBpZiAoaW5kZXggPj0gdGhpcy5fdGVjaG5pcXVlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNjLndhcm4oYENhbiBub3Qgc3dpdGNoIHRvIHRlY2huaXF1ZSB3aXRoIGluZGV4IFske2luZGV4fV1gKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3RlY2huaXF1ZSA9IHRoaXMuX3RlY2huaXF1ZXNbaW5kZXhdO1xuICAgIH1cblxuICAgIGNsZWFyICgpIHtcbiAgICAgICAgdGhpcy5fdGVjaG5pcXVlcyA9IFtdO1xuICAgIH1cblxuICAgIGNsb25lICgpIHtcbiAgICAgICAgbGV0IHRlY2huaXF1ZXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl90ZWNobmlxdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0ZWNobmlxdWVzLnB1c2godGhpcy5fdGVjaG5pcXVlc1tpXS5jbG9uZSgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB0ZWNobmlxdWVJbmRleCA9IHRoaXMuX3RlY2huaXF1ZXMuaW5kZXhPZih0aGlzLl90ZWNobmlxdWUpO1xuICAgICAgICByZXR1cm4gbmV3IEVmZmVjdCh0aGlzLl9uYW1lLCB0ZWNobmlxdWVzLCB0ZWNobmlxdWVJbmRleCwgdGhpcy5fYXNzZXQpO1xuICAgIH1cbn1cblxuY2MuRWZmZWN0ID0gRWZmZWN0O1xuIl19