
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/particle/animator/texture-animation.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _CCClassDecorator = require("../../../platform/CCClassDecorator");

var _CCEnum = _interopRequireDefault(require("../../../platform/CCEnum"));

var _valueTypes = require("../../../value-types");

var _curveRange = _interopRequireDefault(require("./curve-range"));

var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

// tslint:disable: max-line-length
var TEXTURE_ANIMATION_RAND_OFFSET = 90794;
/**
 * 粒子贴图动画类型
 * @enum textureAnimationModule.Mode
 */

var Mode = (0, _CCEnum["default"])({
  /**
   * 网格类型
   */
  Grid: 0
  /**
   * 精灵类型（暂未支持）
   */
  //Sprites: 1,

});
/**
 * 贴图动画的播放方式
 * @enum textureAnimationModule.Animation
 */

var Animation = (0, _CCEnum["default"])({
  /**
   * 播放贴图中的所有帧
   */
  WholeSheet: 0,

  /**
   * 播放贴图中的其中一行动画
   */
  SingleRow: 1
});
var TextureAnimationModule = (_dec = (0, _CCClassDecorator.ccclass)('cc.TextureAnimationModule'), _dec2 = (0, _CCClassDecorator.property)({
  type: Mode
}), _dec3 = (0, _CCClassDecorator.property)({
  type: Animation
}), _dec4 = (0, _CCClassDecorator.property)({
  type: _curveRange["default"]
}), _dec5 = (0, _CCClassDecorator.property)({
  type: _curveRange["default"]
}), _dec(_class = (_class2 = (_temp =
/*#__PURE__*/
function () {
  function TextureAnimationModule() {
    _initializerDefineProperty(this, "_enable", _descriptor, this);

    _initializerDefineProperty(this, "_mode", _descriptor2, this);

    _initializerDefineProperty(this, "numTilesX", _descriptor3, this);

    _initializerDefineProperty(this, "numTilesY", _descriptor4, this);

    _initializerDefineProperty(this, "animation", _descriptor5, this);

    _initializerDefineProperty(this, "randomRow", _descriptor6, this);

    _initializerDefineProperty(this, "rowIndex", _descriptor7, this);

    _initializerDefineProperty(this, "frameOverTime", _descriptor8, this);

    _initializerDefineProperty(this, "startFrame", _descriptor9, this);

    _initializerDefineProperty(this, "cycleCount", _descriptor10, this);

    this._flipU = 0;
    this._flipV = 0;
    this._uvChannelMask = -1;
    this.ps = null;
  }

  var _proto = TextureAnimationModule.prototype;

  _proto.onInit = function onInit(ps) {
    this.ps = ps;
  };

  _proto.init = function init(p) {
    p.startRow = Math.floor(Math.random() * this.numTilesY);
  };

  _proto.animate = function animate(p) {
    var normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
    var startFrame = this.startFrame.evaluate(normalizedTime, (0, _valueTypes.pseudoRandom)(p.randomSeed + TEXTURE_ANIMATION_RAND_OFFSET)) / (this.numTilesX * this.numTilesY);

    if (this.animation === Animation.WholeSheet) {
      p.frameIndex = (0, _valueTypes.repeat)(this.cycleCount * (this.frameOverTime.evaluate(normalizedTime, (0, _valueTypes.pseudoRandom)(p.randomSeed + TEXTURE_ANIMATION_RAND_OFFSET)) + startFrame), 1);
    } else if (this.animation === Animation.SingleRow) {
      var rowLength = 1 / this.numTilesY;

      if (this.randomRow) {
        var f = (0, _valueTypes.repeat)(this.cycleCount * (this.frameOverTime.evaluate(normalizedTime, (0, _valueTypes.pseudoRandom)(p.randomSeed + TEXTURE_ANIMATION_RAND_OFFSET)) + startFrame), 1);
        var from = p.startRow * rowLength;
        var to = from + rowLength;
        p.frameIndex = (0, _valueTypes.lerp)(from, to, f);
      } else {
        var _from = this.rowIndex * rowLength;

        var _to = _from + rowLength;

        p.frameIndex = (0, _valueTypes.lerp)(_from, _to, (0, _valueTypes.repeat)(this.cycleCount * (this.frameOverTime.evaluate(normalizedTime, (0, _valueTypes.pseudoRandom)(p.randomSeed + TEXTURE_ANIMATION_RAND_OFFSET)) + startFrame), 1));
      }
    }
  };

  _createClass(TextureAnimationModule, [{
    key: "enable",

    /**
     * !#en The enable of TextureAnimationModule.
     * !#zh 是否启用
     * @property {Boolean} enable
     */
    get: function get() {
      return this._enable;
    },
    set: function set(val) {
      this._enable = val;

      this.ps._assembler._updateMaterialParams();
    }
  }, {
    key: "mode",

    /**
     * !#en Set the type of particle map animation (only supports Grid mode for the time being)
     * !#zh 设定粒子贴图动画的类型（暂只支持 Grid 模式。
     * @property {Mode} mode
     */
    get: function get() {
      return this._mode;
    },
    set: function set(val) {
      if (val !== Mode.Grid) {
        console.error('particle texture animation\'s sprites is not supported!');
        return;
      }
    }
    /**
     * !#en Animation frames in X direction.
     * !#zh X 方向动画帧数。
     * @property {Number} numTilesX
     */

  }, {
    key: "flipU",
    get: function get() {
      return this._flipU;
    },
    set: function set(val) {
      console.error('particle texture animation\'s flipU is not supported!');
    }
  }, {
    key: "flipV",
    get: function get() {
      return this._flipV;
    },
    set: function set(val) {
      console.error('particle texture animation\'s flipV is not supported!');
    }
  }, {
    key: "uvChannelMask",
    get: function get() {
      return this._uvChannelMask;
    },
    set: function set(val) {
      console.error('particle texture animation\'s uvChannelMask is not supported!');
    }
  }]);

  return TextureAnimationModule;
}(), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_enable", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "enable", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "enable"), _class2.prototype), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_mode", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return Mode.Grid;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "mode", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "mode"), _class2.prototype), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "numTilesX", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "numTilesY", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "animation", [_dec3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return Animation.WholeSheet;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "randomRow", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "rowIndex", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "frameOverTime", [_dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "startFrame", [_dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new _curveRange["default"]();
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "cycleCount", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _applyDecoratedDescriptor(_class2.prototype, "flipU", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "flipU"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "flipV", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "flipV"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "uvChannelMask", [_CCClassDecorator.property], Object.getOwnPropertyDescriptor(_class2.prototype, "uvChannelMask"), _class2.prototype)), _class2)) || _class);
exports["default"] = TextureAnimationModule;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRleHR1cmUtYW5pbWF0aW9uLnRzIl0sIm5hbWVzIjpbIlRFWFRVUkVfQU5JTUFUSU9OX1JBTkRfT0ZGU0VUIiwiTW9kZSIsIkdyaWQiLCJBbmltYXRpb24iLCJXaG9sZVNoZWV0IiwiU2luZ2xlUm93IiwiVGV4dHVyZUFuaW1hdGlvbk1vZHVsZSIsInR5cGUiLCJDdXJ2ZVJhbmdlIiwiX2ZsaXBVIiwiX2ZsaXBWIiwiX3V2Q2hhbm5lbE1hc2siLCJwcyIsIm9uSW5pdCIsImluaXQiLCJwIiwic3RhcnRSb3ciLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJudW1UaWxlc1kiLCJhbmltYXRlIiwibm9ybWFsaXplZFRpbWUiLCJyZW1haW5pbmdMaWZldGltZSIsInN0YXJ0TGlmZXRpbWUiLCJzdGFydEZyYW1lIiwiZXZhbHVhdGUiLCJyYW5kb21TZWVkIiwibnVtVGlsZXNYIiwiYW5pbWF0aW9uIiwiZnJhbWVJbmRleCIsImN5Y2xlQ291bnQiLCJmcmFtZU92ZXJUaW1lIiwicm93TGVuZ3RoIiwicmFuZG9tUm93IiwiZiIsImZyb20iLCJ0byIsInJvd0luZGV4IiwiX2VuYWJsZSIsInZhbCIsIl9hc3NlbWJsZXIiLCJfdXBkYXRlTWF0ZXJpYWxQYXJhbXMiLCJfbW9kZSIsImNvbnNvbGUiLCJlcnJvciIsInByb3BlcnR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTtBQUNBLElBQU1BLDZCQUE2QixHQUFHLEtBQXRDO0FBRUE7Ozs7O0FBSUEsSUFBTUMsSUFBSSxHQUFHLHdCQUFLO0FBQ2Q7OztBQUdBQyxFQUFBQSxJQUFJLEVBQUU7QUFFTjs7O0FBR0E7O0FBVGMsQ0FBTCxDQUFiO0FBWUE7Ozs7O0FBSUEsSUFBTUMsU0FBUyxHQUFHLHdCQUFLO0FBQ25COzs7QUFHQUMsRUFBQUEsVUFBVSxFQUFFLENBSk87O0FBTW5COzs7QUFHQUMsRUFBQUEsU0FBUyxFQUFFO0FBVFEs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V0MsS0FBSztBQUNiLFdBQUtELE9BQUwsR0FBZUMsR0FBZjs7QUFDQSxXQUFLNUIsRUFBTCxDQUFRNkIsVUFBUixDQUFtQkMscUJBQW5CO0FBQ0g7Ozs7QUFLRDs7Ozs7d0JBUVk7QUFDUixhQUFPLEtBQUtDLEtBQVo7QUFDSDtzQkFFU0gsS0FBSztBQUNYLFVBQUlBLEdBQUcsS0FBS3ZDLElBQUksQ0FBQ0MsSUFBakIsRUFBdUI7QUFDbkIwQyxRQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBYyx5REFBZDtBQUNBO0FBQ0g7QUFDSjtBQUVEOzs7Ozs7Ozt3QkE2RWE7QUFDVCxhQUFPLEtBQUtwQyxNQUFaO0FBQ0g7c0JBRVUrQixLQUFLO0FBQ1pJLE1BQUFBLE9BQU8sQ0FBQ0MsS0FBUixDQUFjLHVEQUFkO0FBQ0g7Ozt3QkFLWTtBQUNULGFBQU8sS0FBS25DLE1BQVo7QUFDSDtzQkFFVThCLEtBQUs7QUFDWkksTUFBQUEsT0FBTyxDQUFDQyxLQUFSLENBQWMsdURBQWQ7QUFDSDs7O3dCQUtvQjtBQUNqQixhQUFPLEtBQUtsQyxjQUFaO0FBQ0g7c0JBRWtCNkIsS0FBSztBQUNwQkksTUFBQUEsT0FBTyxDQUFDQyxLQUFSLENBQWMsK0RBQWQ7QUFDSDs7OztxRkFqSkFDOzs7OztXQUNTOzs0REFPVEEscUxBVUFBOzs7OztXQUNPN0MsSUFBSSxDQUFDQzs7NE5BMEJaNEM7Ozs7O1dBQ1c7OzhFQU9YQTs7Ozs7V0FDVzs7Ozs7OztXQVVBM0MsU0FBUyxDQUFDQzs7OEVBU3JCMEM7Ozs7O1dBQ1c7OzZFQVNYQTs7Ozs7V0FDVTs7Ozs7OztXQVVLLElBQUl0QyxzQkFBSjs7Ozs7OztXQVVILElBQUlBLHNCQUFKOztnRkFPWnNDOzs7OztXQUNZOzsyREFJWkEscUtBV0FBLDZLQVdBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNjY2xhc3MsIHByb3BlcnR5IH0gZnJvbSAnLi4vLi4vLi4vcGxhdGZvcm0vQ0NDbGFzc0RlY29yYXRvcic7XG5pbXBvcnQgRW51bSBmcm9tICcuLi8uLi8uLi9wbGF0Zm9ybS9DQ0VudW0nO1xuaW1wb3J0IHsgbGVycCwgcHNldWRvUmFuZG9tLCByZXBlYXQgfSBmcm9tICcuLi8uLi8uLi92YWx1ZS10eXBlcyc7XG5pbXBvcnQgQ3VydmVSYW5nZSBmcm9tICcuL2N1cnZlLXJhbmdlJztcblxuLy8gdHNsaW50OmRpc2FibGU6IG1heC1saW5lLWxlbmd0aFxuY29uc3QgVEVYVFVSRV9BTklNQVRJT05fUkFORF9PRkZTRVQgPSA5MDc5NDtcblxuLyoqXG4gKiDnspLlrZDotLTlm77liqjnlLvnsbvlnotcbiAqIEBlbnVtIHRleHR1cmVBbmltYXRpb25Nb2R1bGUuTW9kZVxuICovXG5jb25zdCBNb2RlID0gRW51bSh7XG4gICAgLyoqXG4gICAgICog572R5qC857G75Z6LXG4gICAgICovXG4gICAgR3JpZDogMCxcblxuICAgIC8qKlxuICAgICAqIOeyvueBteexu+Wei++8iOaaguacquaUr+aMge+8iVxuICAgICAqL1xuICAgIC8vU3ByaXRlczogMSxcbn0pO1xuXG4vKipcbiAqIOi0tOWbvuWKqOeUu+eahOaSreaUvuaWueW8j1xuICogQGVudW0gdGV4dHVyZUFuaW1hdGlvbk1vZHVsZS5BbmltYXRpb25cbiAqL1xuY29uc3QgQW5pbWF0aW9uID0gRW51bSh7XG4gICAgLyoqXG4gICAgICog5pKt5pS+6LS05Zu+5Lit55qE5omA5pyJ5binXG4gICAgICovXG4gICAgV2hvbGVTaGVldDogMCxcblxuICAgIC8qKlxuICAgICAqIOaSreaUvui0tOWbvuS4reeahOWFtuS4reS4gOihjOWKqOeUu1xuICAgICAqL1xuICAgIFNpbmdsZVJvdzogMSxcbn0pO1xuXG5AY2NjbGFzcygnY2MuVGV4dHVyZUFuaW1hdGlvbk1vZHVsZScpXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXh0dXJlQW5pbWF0aW9uTW9kdWxlIHtcblxuICAgIEBwcm9wZXJ0eVxuICAgIF9lbmFibGUgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGVuYWJsZSBvZiBUZXh0dXJlQW5pbWF0aW9uTW9kdWxlLlxuICAgICAqICEjemgg5piv5ZCm5ZCv55SoXG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSBlbmFibGVcbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBnZXQgZW5hYmxlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VuYWJsZTtcbiAgICB9XG5cbiAgICBzZXQgZW5hYmxlICh2YWwpIHtcbiAgICAgICAgdGhpcy5fZW5hYmxlID0gdmFsO1xuICAgICAgICB0aGlzLnBzLl9hc3NlbWJsZXIuX3VwZGF0ZU1hdGVyaWFsUGFyYW1zKCk7XG4gICAgfVxuXG4gICAgQHByb3BlcnR5XG4gICAgX21vZGUgPSBNb2RlLkdyaWQ7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCB0aGUgdHlwZSBvZiBwYXJ0aWNsZSBtYXAgYW5pbWF0aW9uIChvbmx5IHN1cHBvcnRzIEdyaWQgbW9kZSBmb3IgdGhlIHRpbWUgYmVpbmcpXG4gICAgICogISN6aCDorr7lrprnspLlrZDotLTlm77liqjnlLvnmoTnsbvlnovvvIjmmoLlj6rmlK/mjIEgR3JpZCDmqKHlvI/jgIJcbiAgICAgKiBAcHJvcGVydHkge01vZGV9IG1vZGVcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBNb2RlLFxuICAgIH0pXG4gICAgZ2V0IG1vZGUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbW9kZTtcbiAgICB9XG5cbiAgICBzZXQgbW9kZSAodmFsKSB7XG4gICAgICAgIGlmICh2YWwgIT09IE1vZGUuR3JpZCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcigncGFydGljbGUgdGV4dHVyZSBhbmltYXRpb25cXCdzIHNwcml0ZXMgaXMgbm90IHN1cHBvcnRlZCEnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gQW5pbWF0aW9uIGZyYW1lcyBpbiBYIGRpcmVjdGlvbi5cbiAgICAgKiAhI3poIFgg5pa55ZCR5Yqo55S75bin5pWw44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IG51bVRpbGVzWFxuICAgICAqL1xuICAgIEBwcm9wZXJ0eVxuICAgIG51bVRpbGVzWCA9IDA7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEFuaW1hdGlvbiBmcmFtZXMgaW4gWSBkaXJlY3Rpb24uXG4gICAgICogISN6aCBZIOaWueWQkeWKqOeUu+W4p+aVsOOAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBudW1UaWxlc1lcbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBudW1UaWxlc1kgPSAwO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgd2F5IG9mIHRoZSBhbmltYXRpb24gcGxheXMuXG4gICAgICogISN6aCDliqjnlLvmkq3mlL7mlrnlvI/jgIJcbiAgICAgKiBAcHJvcGVydHkge0FuaW1hdGlvbn0gYW5pbWF0aW9uXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogQW5pbWF0aW9uLFxuICAgIH0pXG4gICAgYW5pbWF0aW9uID0gQW5pbWF0aW9uLldob2xlU2hlZXQ7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJhbmRvbWx5IHNlbGVjdCBhIGxpbmUgZnJvbSB0aGUgYW5pbWF0ZWQgbWFwIHRvIGdlbmVyYXRlIHRoZSBhbmltYXRpb24uIDxicj5cbsKgwqDCoMKgwqAqIFRoaXMgb3B0aW9uIG9ubHkgdGFrZXMgZWZmZWN0IHdoZW4gdGhlIGFuaW1hdGlvbiBwbGF5YmFjayBtb2RlIGlzIFNpbmdsZVJvdy5cbiAgICAgKiAhI3poIOmaj+acuuS7juWKqOeUu+i0tOWbvuS4remAieaLqeS4gOihjOS7peeUn+aIkOWKqOeUu+OAgjxicj5cbiAgICAgKiDmraTpgInpobnku4XlnKjliqjnlLvmkq3mlL7mlrnlvI/kuLogU2luZ2xlUm93IOaXtueUn+aViOOAglxuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gcmFuZG9tUm93XG4gICAgICovXG4gICAgQHByb3BlcnR5XG4gICAgcmFuZG9tUm93ID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNlbGVjdCBzcGVjaWZpYyBsaW5lcyBmcm9tIHRoZSBhbmltYXRpb24gbWFwIHRvIGdlbmVyYXRlIHRoZSBhbmltYXRpb24uIDxicj5cbsKgwqDCoMKgwqAqIFRoaXMgb3B0aW9uIGlzIG9ubHkgYXZhaWxhYmxlIHdoZW4gdGhlIGFuaW1hdGlvbiBwbGF5YmFjayBtb2RlIGlzIFNpbmdsZVJvdyBhbmQgcmFuZG9tUm93IGlzIGRpc2FibGVkLlxuICAgICAqICEjemgg5LuO5Yqo55S76LS05Zu+5Lit6YCJ5oup54m55a6a6KGM5Lul55Sf5oiQ5Yqo55S744CCPGJyPlxuICAgICAqIOatpOmAiemhueS7heWcqOWKqOeUu+aSreaUvuaWueW8j+S4uiBTaW5nbGVSb3cg5pe25LiU56aB55SoIHJhbmRvbVJvdyDml7blj6/nlKjjgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gcm93SW5kZXhcbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICByb3dJbmRleCA9IDA7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEZyYW1lIGFuZCB0aW1lIGN1cnZlIG9mIGFuaW1hdGlvbiBwbGF5YmFjayBpbiBvbmUgY3ljbGUuXG4gICAgICogISN6aCDkuIDkuKrlkajmnJ/lhoXliqjnlLvmkq3mlL7nmoTluKfkuI7ml7bpl7Tlj5jljJbmm7Lnur/jgIJcbiAgICAgKiBAcHJvcGVydHkge0N1cnZlUmFuZ2V9IGZyYW1lT3ZlclRpbWVcbiAgICAgKi9cbiAgICBAcHJvcGVydHkoe1xuICAgICAgICB0eXBlOiBDdXJ2ZVJhbmdlLFxuICAgIH0pXG4gICAgZnJhbWVPdmVyVGltZSA9IG5ldyBDdXJ2ZVJhbmdlKCk7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFBsYXkgZnJvbSB3aGljaCBmcmFtZXMsIHRoZSB0aW1lIGlzIHRoZSBsaWZlIGN5Y2xlIG9mIHRoZSBlbnRpcmUgcGFydGljbGUgc3lzdGVtLlxuICAgICAqICEjemgg5LuO56ys5Yeg5bin5byA5aeL5pKt5pS+77yM5pe26Ze05Li65pW05Liq57KS5a2Q57O757uf55qE55Sf5ZG95ZGo5pyf44CCXG4gICAgICogQHByb3BlcnR5IHtDdXJ2ZVJhbmdlfSBzdGFydEZyYW1lXG4gICAgICovXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogQ3VydmVSYW5nZSxcbiAgICB9KVxuICAgIHN0YXJ0RnJhbWUgPSBuZXcgQ3VydmVSYW5nZSgpO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBOdW1iZXIgb2YgcGxheWJhY2sgbG9vcHMgaW4gYSBsaWZlIGN5Y2xlLlxuICAgICAqICEjemgg5LiA5Liq55Sf5ZG95ZGo5pyf5YaF5pKt5pS+5b6q546v55qE5qyh5pWw44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGN5Y2xlQ291bnRcbiAgICAgKi9cbiAgICBAcHJvcGVydHlcbiAgICBjeWNsZUNvdW50ID0gMDtcbiAgICBcbiAgICBfZmxpcFUgPSAwO1xuXG4gICAgQHByb3BlcnR5XG4gICAgZ2V0IGZsaXBVICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZsaXBVO1xuICAgIH1cblxuICAgIHNldCBmbGlwVSAodmFsKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ3BhcnRpY2xlIHRleHR1cmUgYW5pbWF0aW9uXFwncyBmbGlwVSBpcyBub3Qgc3VwcG9ydGVkIScpO1xuICAgIH1cblxuICAgIF9mbGlwViA9IDA7XG5cbiAgICBAcHJvcGVydHlcbiAgICBnZXQgZmxpcFYgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZmxpcFY7XG4gICAgfVxuXG4gICAgc2V0IGZsaXBWICh2YWwpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcigncGFydGljbGUgdGV4dHVyZSBhbmltYXRpb25cXCdzIGZsaXBWIGlzIG5vdCBzdXBwb3J0ZWQhJyk7XG4gICAgfVxuXG4gICAgX3V2Q2hhbm5lbE1hc2sgPSAtMTtcblxuICAgIEBwcm9wZXJ0eVxuICAgIGdldCB1dkNoYW5uZWxNYXNrICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3V2Q2hhbm5lbE1hc2s7XG4gICAgfVxuXG4gICAgc2V0IHV2Q2hhbm5lbE1hc2sgKHZhbCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdwYXJ0aWNsZSB0ZXh0dXJlIGFuaW1hdGlvblxcJ3MgdXZDaGFubmVsTWFzayBpcyBub3Qgc3VwcG9ydGVkIScpO1xuICAgIH1cblxuICAgIHBzID0gbnVsbDtcblxuICAgIG9uSW5pdCAocHMpIHtcbiAgICAgICAgdGhpcy5wcyA9IHBzO1xuICAgIH1cblxuICAgIGluaXQgKHApIHtcbiAgICAgICAgcC5zdGFydFJvdyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMubnVtVGlsZXNZKTtcbiAgICB9XG5cbiAgICBhbmltYXRlIChwKSB7XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRUaW1lID0gMSAtIHAucmVtYWluaW5nTGlmZXRpbWUgLyBwLnN0YXJ0TGlmZXRpbWU7XG4gICAgICAgIGNvbnN0IHN0YXJ0RnJhbWUgPSB0aGlzLnN0YXJ0RnJhbWUuZXZhbHVhdGUobm9ybWFsaXplZFRpbWUsIHBzZXVkb1JhbmRvbShwLnJhbmRvbVNlZWQgKyBURVhUVVJFX0FOSU1BVElPTl9SQU5EX09GRlNFVCkpIC8gKHRoaXMubnVtVGlsZXNYICogdGhpcy5udW1UaWxlc1kpO1xuICAgICAgICBpZiAodGhpcy5hbmltYXRpb24gPT09IEFuaW1hdGlvbi5XaG9sZVNoZWV0KSB7XG4gICAgICAgICAgICBwLmZyYW1lSW5kZXggPSByZXBlYXQodGhpcy5jeWNsZUNvdW50ICogKHRoaXMuZnJhbWVPdmVyVGltZS5ldmFsdWF0ZShub3JtYWxpemVkVGltZSwgcHNldWRvUmFuZG9tKHAucmFuZG9tU2VlZCArIFRFWFRVUkVfQU5JTUFUSU9OX1JBTkRfT0ZGU0VUKSkgKyBzdGFydEZyYW1lKSwgMSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5hbmltYXRpb24gPT09IEFuaW1hdGlvbi5TaW5nbGVSb3cpIHtcbiAgICAgICAgICAgIGNvbnN0IHJvd0xlbmd0aCA9IDEgLyB0aGlzLm51bVRpbGVzWTtcbiAgICAgICAgICAgIGlmICh0aGlzLnJhbmRvbVJvdykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGYgPSByZXBlYXQodGhpcy5jeWNsZUNvdW50ICogKHRoaXMuZnJhbWVPdmVyVGltZS5ldmFsdWF0ZShub3JtYWxpemVkVGltZSwgcHNldWRvUmFuZG9tKHAucmFuZG9tU2VlZCArIFRFWFRVUkVfQU5JTUFUSU9OX1JBTkRfT0ZGU0VUKSkgKyBzdGFydEZyYW1lKSwgMSk7XG4gICAgICAgICAgICAgICAgY29uc3QgZnJvbSA9IHAuc3RhcnRSb3cgKiByb3dMZW5ndGg7XG4gICAgICAgICAgICAgICAgY29uc3QgdG8gPSBmcm9tICsgcm93TGVuZ3RoO1xuICAgICAgICAgICAgICAgIHAuZnJhbWVJbmRleCA9IGxlcnAoZnJvbSwgdG8sIGYpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmcm9tID0gdGhpcy5yb3dJbmRleCAqIHJvd0xlbmd0aDtcbiAgICAgICAgICAgICAgICBjb25zdCB0byA9IGZyb20gKyByb3dMZW5ndGg7XG4gICAgICAgICAgICAgICAgcC5mcmFtZUluZGV4ID0gbGVycChmcm9tLCB0bywgcmVwZWF0KHRoaXMuY3ljbGVDb3VudCAqICh0aGlzLmZyYW1lT3ZlclRpbWUuZXZhbHVhdGUobm9ybWFsaXplZFRpbWUsIHBzZXVkb1JhbmRvbShwLnJhbmRvbVNlZWQgKyBURVhUVVJFX0FOSU1BVElPTl9SQU5EX09GRlNFVCkpICsgc3RhcnRGcmFtZSksIDEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==