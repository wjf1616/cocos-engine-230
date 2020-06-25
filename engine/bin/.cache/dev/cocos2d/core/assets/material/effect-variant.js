
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/material/effect-variant.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _murmurhash2_gc = _interopRequireDefault(require("../../../renderer/murmurhash2_gc"));

var _utils = _interopRequireDefault(require("./utils"));

var _effectBase = _interopRequireDefault(require("./effect-base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var gfx = cc.gfx;

var EffectVariant =
/*#__PURE__*/
function (_EffectBase) {
  _inheritsLoose(EffectVariant, _EffectBase);

  _createClass(EffectVariant, [{
    key: "effect",
    get: function get() {
      return this._effect;
    }
  }, {
    key: "name",
    get: function get() {
      return this._effect && this._effect.name + ' (variant)';
    }
  }, {
    key: "passes",
    get: function get() {
      return this._passes;
    }
  }, {
    key: "stagePasses",
    get: function get() {
      return this._stagePasses;
    }
  }]);

  function EffectVariant(effect) {
    var _this;

    _this = _EffectBase.call(this) || this;
    _this._effect = void 0;
    _this._passes = [];
    _this._stagePasses = {};
    _this._hash = 0;

    _this.init(effect);

    return _this;
  }

  var _proto = EffectVariant.prototype;

  _proto._onEffectChanged = function _onEffectChanged() {};

  _proto.init = function init(effect) {
    if (effect instanceof EffectVariant) {
      effect = effect.effect;
    }

    this._effect = effect;
    this._dirty = true;

    if (effect) {
      var passes = effect.passes;
      var variantPasses = this._passes;
      variantPasses.length = 0;
      var stagePasses = this._stagePasses = {};

      for (var i = 0; i < passes.length; i++) {
        var variant = variantPasses[i] = Object.setPrototypeOf({}, passes[i]);
        variant._properties = Object.setPrototypeOf({}, passes[i]._properties);
        variant._defines = Object.setPrototypeOf({}, passes[i]._defines);

        if (!stagePasses[variant._stage]) {
          stagePasses[variant._stage] = [];
        }

        stagePasses[variant._stage].push(variant);
      }
    }
  };

  _proto.updateHash = function updateHash(hash) {};

  _proto.getHash = function getHash() {
    if (!this._dirty) return this._hash;
    this._dirty = false;
    var hash = '';
    hash += _utils["default"].serializePasses(this._passes);
    var effect = this._effect;

    if (effect) {
      hash += _utils["default"].serializePasses(effect.passes);
    }

    this._hash = (0, _murmurhash2_gc["default"])(hash, 666);
    this.updateHash(this._hash);
    return this._hash;
  };

  return EffectVariant;
}(_effectBase["default"]);

exports["default"] = EffectVariant;
cc.EffectVariant = EffectVariant;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVmZmVjdC12YXJpYW50LnRzIl0sIm5hbWVzIjpbImdmeCIsImNjIiwiRWZmZWN0VmFyaWFudCIsIl9lZmZlY3QiLCJuYW1lIiwiX3Bhc3NlcyIsIl9zdGFnZVBhc3NlcyIsImVmZmVjdCIsIl9oYXNoIiwiaW5pdCIsIl9vbkVmZmVjdENoYW5nZWQiLCJfZGlydHkiLCJwYXNzZXMiLCJ2YXJpYW50UGFzc2VzIiwibGVuZ3RoIiwic3RhZ2VQYXNzZXMiLCJpIiwidmFyaWFudCIsIk9iamVjdCIsInNldFByb3RvdHlwZU9mIiwiX3Byb3BlcnRpZXMiLCJfZGVmaW5lcyIsIl9zdGFnZSIsInB1c2giLCJ1cGRhdGVIYXNoIiwiaGFzaCIsImdldEhhc2giLCJ1dGlscyIsInNlcmlhbGl6ZVBhc3NlcyIsIkVmZmVjdEJhc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFHQTs7Ozs7Ozs7OztBQUVBLElBQU1BLEdBQUcsR0FBR0MsRUFBRSxDQUFDRCxHQUFmOztJQUVxQkU7Ozs7Ozs7d0JBTUg7QUFDVixhQUFPLEtBQUtDLE9BQVo7QUFDSDs7O3dCQUVXO0FBQ1IsYUFBTyxLQUFLQSxPQUFMLElBQWlCLEtBQUtBLE9BQUwsQ0FBYUMsSUFBYixHQUFvQixZQUE1QztBQUNIOzs7d0JBRWE7QUFDVixhQUFPLEtBQUtDLE9BQVo7QUFDSDs7O3dCQUVrQjtBQUNmLGFBQU8sS0FBS0MsWUFBWjtBQUNIOzs7QUFFRCx5QkFBYUMsTUFBYixFQUE2QjtBQUFBOztBQUN6QjtBQUR5QixVQXJCN0JKLE9BcUI2QjtBQUFBLFVBcEI3QkUsT0FvQjZCLEdBcEJYLEVBb0JXO0FBQUEsVUFuQjdCQyxZQW1CNkIsR0FuQmQsRUFtQmM7QUFBQSxVQWxCN0JFLEtBa0I2QixHQWxCckIsQ0FrQnFCOztBQUV6QixVQUFLQyxJQUFMLENBQVVGLE1BQVY7O0FBRnlCO0FBRzVCOzs7O1NBRURHLG1CQUFBLDRCQUFvQixDQUNuQjs7U0FFREQsT0FBQSxjQUFNRixNQUFOLEVBQXNCO0FBQ2xCLFFBQUlBLE1BQU0sWUFBWUwsYUFBdEIsRUFBcUM7QUFDakNLLE1BQUFBLE1BQU0sR0FBR0EsTUFBTSxDQUFDQSxNQUFoQjtBQUNIOztBQUVELFNBQUtKLE9BQUwsR0FBZUksTUFBZjtBQUNBLFNBQUtJLE1BQUwsR0FBYyxJQUFkOztBQUVBLFFBQUlKLE1BQUosRUFBWTtBQUNSLFVBQUlLLE1BQU0sR0FBR0wsTUFBTSxDQUFDSyxNQUFwQjtBQUNBLFVBQUlDLGFBQWEsR0FBRyxLQUFLUixPQUF6QjtBQUNBUSxNQUFBQSxhQUFhLENBQUNDLE1BQWQsR0FBdUIsQ0FBdkI7QUFDQSxVQUFJQyxXQUFXLEdBQUcsS0FBS1QsWUFBTCxHQUFvQixFQUF0Qzs7QUFDQSxXQUFLLElBQUlVLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdKLE1BQU0sQ0FBQ0UsTUFBM0IsRUFBbUNFLENBQUMsRUFBcEMsRUFBd0M7QUFDcEMsWUFBSUMsT0FBTyxHQUFHSixhQUFhLENBQUNHLENBQUQsQ0FBYixHQUFtQkUsTUFBTSxDQUFDQyxjQUFQLENBQXNCLEVBQXRCLEVBQTBCUCxNQUFNLENBQUNJLENBQUQsQ0FBaEMsQ0FBakM7QUFDQUMsUUFBQUEsT0FBTyxDQUFDRyxXQUFSLEdBQXNCRixNQUFNLENBQUNDLGNBQVAsQ0FBc0IsRUFBdEIsRUFBMEJQLE1BQU0sQ0FBQ0ksQ0FBRCxDQUFOLENBQVVJLFdBQXBDLENBQXRCO0FBQ0FILFFBQUFBLE9BQU8sQ0FBQ0ksUUFBUixHQUFtQkgsTUFBTSxDQUFDQyxjQUFQLENBQXNCLEVBQXRCLEVBQTBCUCxNQUFNLENBQUNJLENBQUQsQ0FBTixDQUFVSyxRQUFwQyxDQUFuQjs7QUFFQSxZQUFJLENBQUNOLFdBQVcsQ0FBQ0UsT0FBTyxDQUFDSyxNQUFULENBQWhCLEVBQWtDO0FBQzlCUCxVQUFBQSxXQUFXLENBQUNFLE9BQU8sQ0FBQ0ssTUFBVCxDQUFYLEdBQThCLEVBQTlCO0FBQ0g7O0FBQ0RQLFFBQUFBLFdBQVcsQ0FBQ0UsT0FBTyxDQUFDSyxNQUFULENBQVgsQ0FBNEJDLElBQTVCLENBQWlDTixPQUFqQztBQUNIO0FBQ0o7QUFDSjs7U0FFRE8sYUFBQSxvQkFBWUMsSUFBWixFQUEwQixDQUV6Qjs7U0FFREMsVUFBQSxtQkFBVztBQUNQLFFBQUksQ0FBQyxLQUFLZixNQUFWLEVBQWtCLE9BQU8sS0FBS0gsS0FBWjtBQUNsQixTQUFLRyxNQUFMLEdBQWMsS0FBZDtBQUVBLFFBQUljLElBQUksR0FBRyxFQUFYO0FBQ0FBLElBQUFBLElBQUksSUFBSUUsa0JBQU1DLGVBQU4sQ0FBc0IsS0FBS3ZCLE9BQTNCLENBQVI7QUFFQSxRQUFJRSxNQUFNLEdBQUcsS0FBS0osT0FBbEI7O0FBQ0EsUUFBSUksTUFBSixFQUFZO0FBQ1JrQixNQUFBQSxJQUFJLElBQUlFLGtCQUFNQyxlQUFOLENBQXNCckIsTUFBTSxDQUFDSyxNQUE3QixDQUFSO0FBQ0g7O0FBRUQsU0FBS0osS0FBTCxHQUFhLGdDQUFZaUIsSUFBWixFQUFrQixHQUFsQixDQUFiO0FBRUEsU0FBS0QsVUFBTCxDQUFnQixLQUFLaEIsS0FBckI7QUFFQSxXQUFPLEtBQUtBLEtBQVo7QUFDSDs7O0VBN0VzQ3FCOzs7QUFnRjNDNUIsRUFBRSxDQUFDQyxhQUFILEdBQW1CQSxhQUFuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtdXJtdXJoYXNoMiBmcm9tICcuLi8uLi8uLi9yZW5kZXJlci9tdXJtdXJoYXNoMl9nYyc7XG5pbXBvcnQgdXRpbHMgZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgUGFzcyBmcm9tICcuLi8uLi8uLi9yZW5kZXJlci9jb3JlL3Bhc3MnO1xuaW1wb3J0IEVmZmVjdCBmcm9tICcuL2VmZmVjdCc7XG5pbXBvcnQgRWZmZWN0QmFzZSBmcm9tICcuL2VmZmVjdC1iYXNlJztcblxuY29uc3QgZ2Z4ID0gY2MuZ2Z4O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZmZlY3RWYXJpYW50IGV4dGVuZHMgRWZmZWN0QmFzZSB7XG4gICAgX2VmZmVjdDogRWZmZWN0O1xuICAgIF9wYXNzZXM6IFBhc3NbXSA9IFtdO1xuICAgIF9zdGFnZVBhc3NlcyA9IHt9O1xuICAgIF9oYXNoID0gMDtcblxuICAgIGdldCBlZmZlY3QgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZWZmZWN0O1xuICAgIH1cblxuICAgIGdldCBuYW1lICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VmZmVjdCAmJiAodGhpcy5fZWZmZWN0Lm5hbWUgKyAnICh2YXJpYW50KScpO1xuICAgIH1cblxuICAgIGdldCBwYXNzZXMgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGFzc2VzO1xuICAgIH1cblxuICAgIGdldCBzdGFnZVBhc3NlcyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdGFnZVBhc3NlcztcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvciAoZWZmZWN0OiBFZmZlY3QpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5pbml0KGVmZmVjdCk7XG4gICAgfVxuXG4gICAgX29uRWZmZWN0Q2hhbmdlZCAoKSB7XG4gICAgfVxuXG4gICAgaW5pdCAoZWZmZWN0OiBFZmZlY3QpIHtcbiAgICAgICAgaWYgKGVmZmVjdCBpbnN0YW5jZW9mIEVmZmVjdFZhcmlhbnQpIHtcbiAgICAgICAgICAgIGVmZmVjdCA9IGVmZmVjdC5lZmZlY3Q7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9lZmZlY3QgPSBlZmZlY3Q7XG4gICAgICAgIHRoaXMuX2RpcnR5ID0gdHJ1ZTtcbiAgICAgICAgXG4gICAgICAgIGlmIChlZmZlY3QpIHtcbiAgICAgICAgICAgIGxldCBwYXNzZXMgPSBlZmZlY3QucGFzc2VzO1xuICAgICAgICAgICAgbGV0IHZhcmlhbnRQYXNzZXMgPSB0aGlzLl9wYXNzZXM7XG4gICAgICAgICAgICB2YXJpYW50UGFzc2VzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICBsZXQgc3RhZ2VQYXNzZXMgPSB0aGlzLl9zdGFnZVBhc3NlcyA9IHt9O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXNzZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgdmFyaWFudCA9IHZhcmlhbnRQYXNzZXNbaV0gPSBPYmplY3Quc2V0UHJvdG90eXBlT2Yoe30sIHBhc3Nlc1tpXSk7XG4gICAgICAgICAgICAgICAgdmFyaWFudC5fcHJvcGVydGllcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZih7fSwgcGFzc2VzW2ldLl9wcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgICAgICB2YXJpYW50Ll9kZWZpbmVzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mKHt9LCBwYXNzZXNbaV0uX2RlZmluZXMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFzdGFnZVBhc3Nlc1t2YXJpYW50Ll9zdGFnZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhZ2VQYXNzZXNbdmFyaWFudC5fc3RhZ2VdID0gW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN0YWdlUGFzc2VzW3ZhcmlhbnQuX3N0YWdlXS5wdXNoKHZhcmlhbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlSGFzaCAoaGFzaDogbnVtYmVyKSB7XG5cbiAgICB9XG5cbiAgICBnZXRIYXNoICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9kaXJ0eSkgcmV0dXJuIHRoaXMuX2hhc2g7XG4gICAgICAgIHRoaXMuX2RpcnR5ID0gZmFsc2U7XG5cbiAgICAgICAgbGV0IGhhc2ggPSAnJztcbiAgICAgICAgaGFzaCArPSB1dGlscy5zZXJpYWxpemVQYXNzZXModGhpcy5fcGFzc2VzKTtcblxuICAgICAgICBsZXQgZWZmZWN0ID0gdGhpcy5fZWZmZWN0O1xuICAgICAgICBpZiAoZWZmZWN0KSB7XG4gICAgICAgICAgICBoYXNoICs9IHV0aWxzLnNlcmlhbGl6ZVBhc3NlcyhlZmZlY3QucGFzc2VzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2hhc2ggPSBtdXJtdXJoYXNoMihoYXNoLCA2NjYpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlSGFzaCh0aGlzLl9oYXNoKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5faGFzaDtcbiAgICB9XG59XG5cbmNjLkVmZmVjdFZhcmlhbnQgPSBFZmZlY3RWYXJpYW50O1xuIl19