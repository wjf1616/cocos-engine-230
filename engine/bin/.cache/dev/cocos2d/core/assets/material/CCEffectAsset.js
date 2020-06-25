
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/material/CCEffectAsset.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _CCAsset = _interopRequireDefault(require("../CCAsset"));

var _effectParser = require("./effect-parser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * !#en Effect Asset.
 * !#zh Effect 资源类型。
 * @class EffectAsset
 * @extends Asset
 */
var EffectAsset = cc.Class({
  name: 'cc.EffectAsset',
  "extends": _CCAsset["default"],
  ctor: function ctor() {
    this._effect = null;
  },
  properties: {
    properties: Object,
    techniques: [],
    shaders: []
  },
  onLoad: function onLoad() {
    if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
      return;
    }

    var lib = cc.renderer._forward._programLib;

    for (var i = 0; i < this.shaders.length; i++) {
      lib.define(this.shaders[i]);
    }

    this._initEffect();
  },
  _initEffect: function _initEffect() {
    if (this._effect) return;
    this._effect = (0, _effectParser.parseEffect)(this);
    Object.freeze(this._effect);
  },
  getInstantiatedEffect: function getInstantiatedEffect() {
    this._initEffect();

    return this._effect.clone();
  },
  getEffect: function getEffect() {
    this._initEffect();

    return this._effect;
  }
});
module.exports = cc.EffectAsset = EffectAsset;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDRWZmZWN0QXNzZXQuanMiXSwibmFtZXMiOlsiRWZmZWN0QXNzZXQiLCJjYyIsIkNsYXNzIiwibmFtZSIsIkFzc2V0IiwiY3RvciIsIl9lZmZlY3QiLCJwcm9wZXJ0aWVzIiwiT2JqZWN0IiwidGVjaG5pcXVlcyIsInNoYWRlcnMiLCJvbkxvYWQiLCJnYW1lIiwicmVuZGVyVHlwZSIsIlJFTkRFUl9UWVBFX0NBTlZBUyIsImxpYiIsInJlbmRlcmVyIiwiX2ZvcndhcmQiLCJfcHJvZ3JhbUxpYiIsImkiLCJsZW5ndGgiLCJkZWZpbmUiLCJfaW5pdEVmZmVjdCIsImZyZWV6ZSIsImdldEluc3RhbnRpYXRlZEVmZmVjdCIsImNsb25lIiwiZ2V0RWZmZWN0IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7O0FBRUE7Ozs7OztBQU1BLElBQUlBLFdBQVcsR0FBR0MsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDdkJDLEVBQUFBLElBQUksRUFBRSxnQkFEaUI7QUFFdkIsYUFBU0MsbUJBRmM7QUFJdkJDLEVBQUFBLElBSnVCLGtCQUlmO0FBQ0osU0FBS0MsT0FBTCxHQUFlLElBQWY7QUFDSCxHQU5zQjtBQVF2QkMsRUFBQUEsVUFBVSxFQUFFO0FBQ1JBLElBQUFBLFVBQVUsRUFBRUMsTUFESjtBQUVSQyxJQUFBQSxVQUFVLEVBQUUsRUFGSjtBQUdSQyxJQUFBQSxPQUFPLEVBQUU7QUFIRCxHQVJXO0FBY3ZCQyxFQUFBQSxNQWR1QixvQkFjYjtBQUNOLFFBQUlWLEVBQUUsQ0FBQ1csSUFBSCxDQUFRQyxVQUFSLEtBQXVCWixFQUFFLENBQUNXLElBQUgsQ0FBUUUsa0JBQW5DLEVBQXVEO0FBQ25EO0FBQ0g7O0FBRUQsUUFBSUMsR0FBRyxHQUFHZCxFQUFFLENBQUNlLFFBQUgsQ0FBWUMsUUFBWixDQUFxQkMsV0FBL0I7O0FBQ0EsU0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHLEtBQUtULE9BQUwsQ0FBYVUsTUFBakMsRUFBeUNELENBQUMsRUFBMUMsRUFBOEM7QUFDMUNKLE1BQUFBLEdBQUcsQ0FBQ00sTUFBSixDQUFXLEtBQUtYLE9BQUwsQ0FBYVMsQ0FBYixDQUFYO0FBQ0g7O0FBRUQsU0FBS0csV0FBTDtBQUNILEdBekJzQjtBQTJCdkJBLEVBQUFBLFdBM0J1Qix5QkEyQlI7QUFDWCxRQUFJLEtBQUtoQixPQUFULEVBQWtCO0FBQ2xCLFNBQUtBLE9BQUwsR0FBZSwrQkFBWSxJQUFaLENBQWY7QUFDQUUsSUFBQUEsTUFBTSxDQUFDZSxNQUFQLENBQWMsS0FBS2pCLE9BQW5CO0FBQ0gsR0EvQnNCO0FBaUN2QmtCLEVBQUFBLHFCQWpDdUIsbUNBaUNFO0FBQ3JCLFNBQUtGLFdBQUw7O0FBQ0EsV0FBTyxLQUFLaEIsT0FBTCxDQUFhbUIsS0FBYixFQUFQO0FBQ0gsR0FwQ3NCO0FBc0N2QkMsRUFBQUEsU0F0Q3VCLHVCQXNDVjtBQUNULFNBQUtKLFdBQUw7O0FBQ0EsV0FBTyxLQUFLaEIsT0FBWjtBQUNIO0FBekNzQixDQUFULENBQWxCO0FBNENBcUIsTUFBTSxDQUFDQyxPQUFQLEdBQWlCM0IsRUFBRSxDQUFDRCxXQUFILEdBQWlCQSxXQUFsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBc3NldCBmcm9tICcuLi9DQ0Fzc2V0JztcbmltcG9ydCB7IHBhcnNlRWZmZWN0IH0gZnJvbSAnLi9lZmZlY3QtcGFyc2VyJztcblxuLyoqXG4gKiAhI2VuIEVmZmVjdCBBc3NldC5cbiAqICEjemggRWZmZWN0IOi1hOa6kOexu+Wei+OAglxuICogQGNsYXNzIEVmZmVjdEFzc2V0XG4gKiBAZXh0ZW5kcyBBc3NldFxuICovXG5sZXQgRWZmZWN0QXNzZXQgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLkVmZmVjdEFzc2V0JyxcbiAgICBleHRlbmRzOiBBc3NldCxcblxuICAgIGN0b3IgKCkge1xuICAgICAgICB0aGlzLl9lZmZlY3QgPSBudWxsO1xuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHByb3BlcnRpZXM6IE9iamVjdCxcbiAgICAgICAgdGVjaG5pcXVlczogW10sXG4gICAgICAgIHNoYWRlcnM6IFtdXG4gICAgfSxcblxuICAgIG9uTG9hZCAoKSB7XG4gICAgICAgIGlmIChjYy5nYW1lLnJlbmRlclR5cGUgPT09IGNjLmdhbWUuUkVOREVSX1RZUEVfQ0FOVkFTKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGxldCBsaWIgPSBjYy5yZW5kZXJlci5fZm9yd2FyZC5fcHJvZ3JhbUxpYjtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNoYWRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxpYi5kZWZpbmUodGhpcy5zaGFkZXJzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2luaXRFZmZlY3QoKTtcbiAgICB9LFxuXG4gICAgX2luaXRFZmZlY3QgKCkge1xuICAgICAgICBpZiAodGhpcy5fZWZmZWN0KSByZXR1cm47XG4gICAgICAgIHRoaXMuX2VmZmVjdCA9IHBhcnNlRWZmZWN0KHRoaXMpO1xuICAgICAgICBPYmplY3QuZnJlZXplKHRoaXMuX2VmZmVjdCk7XG4gICAgfSxcblxuICAgIGdldEluc3RhbnRpYXRlZEVmZmVjdCAoKSB7XG4gICAgICAgIHRoaXMuX2luaXRFZmZlY3QoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VmZmVjdC5jbG9uZSgpO1xuICAgIH0sXG5cbiAgICBnZXRFZmZlY3QgKCkge1xuICAgICAgICB0aGlzLl9pbml0RWZmZWN0KCk7XG4gICAgICAgIHJldHVybiB0aGlzLl9lZmZlY3Q7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gY2MuRWZmZWN0QXNzZXQgPSBFZmZlY3RBc3NldDtcbiJdfQ==