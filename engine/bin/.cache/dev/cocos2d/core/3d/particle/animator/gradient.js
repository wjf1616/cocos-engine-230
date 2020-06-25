
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/particle/animator/gradient.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.Gradient = exports.AlphaKey = exports.ColorKey = void 0;

var _CCClassDecorator = require("../../../platform/CCClassDecorator");

var _CCEnum = _interopRequireDefault(require("../../../platform/CCEnum"));

var _valueTypes = require("../../../value-types");

var _dec, _class, _class2, _descriptor, _descriptor2, _temp, _dec2, _class4, _class5, _descriptor3, _descriptor4, _temp2, _dec3, _dec4, _dec5, _dec6, _class7, _class8, _descriptor5, _descriptor6, _descriptor7, _class9, _temp3;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

// tslint:disable: max-line-length
var Mode = (0, _CCEnum["default"])({
  Blend: 0,
  Fixed: 1
});
var ColorKey = (_dec = (0, _CCClassDecorator.ccclass)('cc.ColorKey'), _dec(_class = (_class2 = (_temp = function ColorKey() {
  _initializerDefineProperty(this, "color", _descriptor, this);

  _initializerDefineProperty(this, "time", _descriptor2, this);
}, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "color", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return cc.Color.WHITE.clone();
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "time", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
})), _class2)) || _class);
exports.ColorKey = ColorKey;
var AlphaKey = (_dec2 = (0, _CCClassDecorator.ccclass)('cc.AlphaKey'), _dec2(_class4 = (_class5 = (_temp2 = function AlphaKey() {
  _initializerDefineProperty(this, "alpha", _descriptor3, this);

  _initializerDefineProperty(this, "time", _descriptor4, this);
}, _temp2), (_descriptor3 = _applyDecoratedDescriptor(_class5.prototype, "alpha", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 1;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class5.prototype, "time", [_CCClassDecorator.property], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
})), _class5)) || _class4);
exports.AlphaKey = AlphaKey;
var Gradient = (_dec3 = (0, _CCClassDecorator.ccclass)('cc.Gradient'), _dec4 = (0, _CCClassDecorator.property)({
  type: [ColorKey]
}), _dec5 = (0, _CCClassDecorator.property)({
  type: [AlphaKey]
}), _dec6 = (0, _CCClassDecorator.property)({
  type: Mode
}), _dec3(_class7 = (_class8 = (_temp3 = _class9 =
/*#__PURE__*/
function () {
  function Gradient() {
    _initializerDefineProperty(this, "colorKeys", _descriptor5, this);

    _initializerDefineProperty(this, "alphaKeys", _descriptor6, this);

    _initializerDefineProperty(this, "mode", _descriptor7, this);

    this._color = null;
    this._color = cc.Color.WHITE.clone();
  }

  var _proto = Gradient.prototype;

  _proto.setKeys = function setKeys(colorKeys, alphaKeys) {
    this.colorKeys = colorKeys;
    this.alphaKeys = alphaKeys;
  };

  _proto.sortKeys = function sortKeys() {
    if (this.colorKeys.length > 1) {
      this.colorKeys.sort(function (a, b) {
        return a.time - b.time;
      });
    }

    if (this.alphaKeys.length > 1) {
      this.alphaKeys.sort(function (a, b) {
        return a.time - b.time;
      });
    }
  };

  _proto.evaluate = function evaluate(time) {
    this.getRGB(time);

    this._color._fastSetA(this.getAlpha(time));

    return this._color;
  };

  _proto.randomColor = function randomColor() {
    var c = this.colorKeys[Math.trunc(Math.random() * this.colorKeys.length)];
    var a = this.alphaKeys[Math.trunc(Math.random() * this.alphaKeys.length)];

    this._color.set(c.color);

    this._color._fastSetA(a.alpha);

    return this._color;
  };

  _proto.getRGB = function getRGB(time) {
    if (this.colorKeys.length > 1) {
      time = (0, _valueTypes.repeat)(time, 1);

      for (var i = 1; i < this.colorKeys.length; ++i) {
        var preTime = this.colorKeys[i - 1].time;
        var curTime = this.colorKeys[i].time;

        if (time >= preTime && time < curTime) {
          if (this.mode === Mode.Fixed) {
            return this.colorKeys[i].color;
          }

          var factor = (time - preTime) / (curTime - preTime);
          this.colorKeys[i - 1].color.lerp(this.colorKeys[i].color, factor, this._color);
          return this._color;
        }
      }

      var lastIndex = this.colorKeys.length - 1;

      if (time < this.colorKeys[0].time) {
        cc.Color.BLACK.lerp(this.colorKeys[0].color, time / this.colorKeys[0].time, this._color);
      } else if (time > this.colorKeys[lastIndex].time) {
        this.colorKeys[lastIndex].color.lerp(cc.Color.BLACK, (time - this.colorKeys[lastIndex].time) / (1 - this.colorKeys[lastIndex].time), this._color);
      } // console.warn('something went wrong. can not get gradient color.');

    } else if (this.colorKeys.length === 1) {
      this._color.set(this.colorKeys[0].color);

      return this._color;
    } else {
      this._color.set(cc.Color.WHITE);

      return this._color;
    }
  };

  _proto.getAlpha = function getAlpha(time) {
    if (this.alphaKeys.length > 1) {
      time = (0, _valueTypes.repeat)(time, 1);

      for (var i = 1; i < this.alphaKeys.length; ++i) {
        var preTime = this.alphaKeys[i - 1].time;
        var curTime = this.alphaKeys[i].time;

        if (time >= preTime && time < curTime) {
          if (this.mode === Mode.Fixed) {
            return this.alphaKeys[i].alpha;
          }

          var factor = (time - preTime) / (curTime - preTime);
          return (0, _valueTypes.lerp)(this.alphaKeys[i - 1].alpha, this.alphaKeys[i].alpha, factor);
        }
      }

      var lastIndex = this.alphaKeys.length - 1;

      if (time < this.alphaKeys[0].time) {
        return (0, _valueTypes.lerp)(255, this.alphaKeys[0].alpha, time / this.alphaKeys[0].time);
      } else if (time > this.alphaKeys[lastIndex].time) {
        return (0, _valueTypes.lerp)(this.alphaKeys[lastIndex].alpha, 255, (time - this.alphaKeys[lastIndex].time) / (1 - this.alphaKeys[lastIndex].time));
      }
    } else if (this.alphaKeys.length === 1) {
      return this.alphaKeys[0].alpha;
    } else {
      return 255;
    }
  };

  return Gradient;
}(), _class9.Mode = Mode, _temp3), (_descriptor5 = _applyDecoratedDescriptor(_class8.prototype, "colorKeys", [_dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Array();
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class8.prototype, "alphaKeys", [_dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return new Array();
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class8.prototype, "mode", [_dec6], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return Mode.Blend;
  }
})), _class8)) || _class7);
exports.Gradient = Gradient;
cc.ColorKey = ColorKey;
cc.AlphaKey = AlphaKey;
cc.Gradient = Gradient;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdyYWRpZW50LnRzIl0sIm5hbWVzIjpbIk1vZGUiLCJCbGVuZCIsIkZpeGVkIiwiQ29sb3JLZXkiLCJwcm9wZXJ0eSIsImNjIiwiQ29sb3IiLCJXSElURSIsImNsb25lIiwiQWxwaGFLZXkiLCJHcmFkaWVudCIsInR5cGUiLCJfY29sb3IiLCJzZXRLZXlzIiwiY29sb3JLZXlzIiwiYWxwaGFLZXlzIiwic29ydEtleXMiLCJsZW5ndGgiLCJzb3J0IiwiYSIsImIiLCJ0aW1lIiwiZXZhbHVhdGUiLCJnZXRSR0IiLCJfZmFzdFNldEEiLCJnZXRBbHBoYSIsInJhbmRvbUNvbG9yIiwiYyIsIk1hdGgiLCJ0cnVuYyIsInJhbmRvbSIsInNldCIsImNvbG9yIiwiYWxwaGEiLCJpIiwicHJlVGltZSIsImN1clRpbWUiLCJtb2RlIiwiZmFjdG9yIiwibGVycCIsImxhc3RJbmRleCIsIkJMQUNLIiwiQXJyYXkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUE7QUFFQSxJQUFNQSxJQUFJLEdBQUcsd0JBQUs7QUFDZEMsRUFBQUEsS0FBSyxFQUFFLENBRE87QUFFZEMsRUFBQUEsS0FBSyxFQUFFO0FBRk8sQ0FBTCxDQUFiO0lBTWFDLG1CQURaLCtCQUFRLGFBQVI7Ozs7aUZBR0lDOzs7OztXQUNPQyxFQUFFLENBQUNDLEtBQUgsQ0FBU0MsS0FBVCxDQUFlQyxLQUFmOzt5RUFFUEo7Ozs7O1dBQ007Ozs7SUFJRUssb0JBRFosK0JBQVEsYUFBUjs7OzttRkFHSUw7Ozs7O1dBQ087O3lFQUVQQTs7Ozs7V0FDTTs7OztJQUlFTSxvQkFEWiwrQkFBUSxhQUFSLFdBS0ksZ0NBQVM7QUFDTkMsRUFBQUEsSUFBSSxFQUFFLENBQUNSLFFBQUQ7QUFEQSxDQUFULFdBS0EsZ0NBQVM7QUFDTlEsRUFBQUEsSUFBSSxFQUFFLENBQUNGLFFBQUQ7QUFEQSxDQUFULFdBS0EsZ0NBQVM7QUFDTkUsRUFBQUEsSUFBSSxFQUFFWDtB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Q0FBZixFQUFrQk0sSUFBN0IsRUFBbUM7QUFDL0IsZUFBTyxzQkFBSyxHQUFMLEVBQVUsS0FBS04sU0FBTCxDQUFlLENBQWYsRUFBa0JrQixLQUE1QixFQUFtQ1osSUFBSSxHQUFHLEtBQUtOLFNBQUwsQ0FBZSxDQUFmLEVBQWtCTSxJQUE1RCxDQUFQO0FBQ0gsT0FGRCxNQUVPLElBQUlBLElBQUksR0FBRyxLQUFLTixTQUFMLENBQWV5QixTQUFmLEVBQTBCbkIsSUFBckMsRUFBMkM7QUFDOUMsZUFBTyxzQkFBSyxLQUFLTixTQUFMLENBQWV5QixTQUFmLEVBQTBCUCxLQUEvQixFQUFzQyxHQUF0QyxFQUEyQyxDQUFDWixJQUFJLEdBQUcsS0FBS04sU0FBTCxDQUFleUIsU0FBZixFQUEwQm5CLElBQWxDLEtBQTJDLElBQUksS0FBS04sU0FBTCxDQUFleUIsU0FBZixFQUEwQm5CLElBQXpFLENBQTNDLENBQVA7QUFDSDtBQUNKLEtBbkJELE1BbUJPLElBQUksS0FBS04sU0FBTCxDQUFlRSxNQUFmLEtBQTBCLENBQTlCLEVBQWlDO0FBQ3BDLGFBQU8sS0FBS0YsU0FBTCxDQUFlLENBQWYsRUFBa0JrQixLQUF6QjtBQUNILEtBRk0sTUFFQTtBQUNILGFBQU8sR0FBUDtBQUNIO0FBQ0o7OzthQTNHTWpDLE9BQU9BOzs7OztXQUtGLElBQUkwQyxLQUFKOzs7Ozs7O1dBS0EsSUFBSUEsS0FBSjs7Ozs7OztXQUtMMUMsSUFBSSxDQUFDQzs7OztBQStGaEJJLEVBQUUsQ0FBQ0YsUUFBSCxHQUFjQSxRQUFkO0FBQ0FFLEVBQUUsQ0FBQ0ksUUFBSCxHQUFjQSxRQUFkO0FBQ0FKLEVBQUUsQ0FBQ0ssUUFBSCxHQUFjQSxRQUFkIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2NjbGFzcywgcHJvcGVydHkgfSBmcm9tICcuLi8uLi8uLi9wbGF0Zm9ybS9DQ0NsYXNzRGVjb3JhdG9yJztcbmltcG9ydCBFbnVtIGZyb20gJy4uLy4uLy4uL3BsYXRmb3JtL0NDRW51bSc7XG5pbXBvcnQgeyBsZXJwLCByZXBlYXQgfSBmcm9tICcuLi8uLi8uLi92YWx1ZS10eXBlcyc7XG5cbi8vIHRzbGludDpkaXNhYmxlOiBtYXgtbGluZS1sZW5ndGhcblxuY29uc3QgTW9kZSA9IEVudW0oe1xuICAgIEJsZW5kOiAwLFxuICAgIEZpeGVkOiAxLFxufSk7XG5cbkBjY2NsYXNzKCdjYy5Db2xvcktleScpXG5leHBvcnQgY2xhc3MgQ29sb3JLZXkge1xuXG4gICAgQHByb3BlcnR5XG4gICAgY29sb3IgPSBjYy5Db2xvci5XSElURS5jbG9uZSgpO1xuXG4gICAgQHByb3BlcnR5XG4gICAgdGltZSA9IDA7XG59XG5cbkBjY2NsYXNzKCdjYy5BbHBoYUtleScpXG5leHBvcnQgY2xhc3MgQWxwaGFLZXkge1xuXG4gICAgQHByb3BlcnR5XG4gICAgYWxwaGEgPSAxO1xuXG4gICAgQHByb3BlcnR5XG4gICAgdGltZSA9IDA7XG59XG5cbkBjY2NsYXNzKCdjYy5HcmFkaWVudCcpXG5leHBvcnQgY2xhc3MgR3JhZGllbnQge1xuXG4gICAgc3RhdGljIE1vZGUgPSBNb2RlO1xuXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogW0NvbG9yS2V5XSxcbiAgICB9KVxuICAgIGNvbG9yS2V5cyA9IG5ldyBBcnJheSgpO1xuXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogW0FscGhhS2V5XSxcbiAgICB9KVxuICAgIGFscGhhS2V5cyA9IG5ldyBBcnJheSgpO1xuXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgdHlwZTogTW9kZSxcbiAgICB9KVxuICAgIG1vZGUgPSBNb2RlLkJsZW5kO1xuXG4gICAgX2NvbG9yID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgdGhpcy5fY29sb3IgPSBjYy5Db2xvci5XSElURS5jbG9uZSgpO1xuICAgIH1cblxuICAgIHNldEtleXMgKGNvbG9yS2V5cywgYWxwaGFLZXlzKSB7XG4gICAgICAgIHRoaXMuY29sb3JLZXlzID0gY29sb3JLZXlzO1xuICAgICAgICB0aGlzLmFscGhhS2V5cyA9IGFscGhhS2V5cztcbiAgICB9XG5cbiAgICBzb3J0S2V5cyAoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbG9yS2V5cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICB0aGlzLmNvbG9yS2V5cy5zb3J0KChhLCBiKSA9PiBhLnRpbWUgLSBiLnRpbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmFscGhhS2V5cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICB0aGlzLmFscGhhS2V5cy5zb3J0KChhLCBiKSA9PiBhLnRpbWUgLSBiLnRpbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXZhbHVhdGUgKHRpbWUpIHtcbiAgICAgICAgdGhpcy5nZXRSR0IodGltZSk7XG4gICAgICAgIHRoaXMuX2NvbG9yLl9mYXN0U2V0QSh0aGlzLmdldEFscGhhKHRpbWUpKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbG9yO1xuICAgIH1cblxuICAgIHJhbmRvbUNvbG9yICgpIHtcbiAgICAgICAgY29uc3QgYyA9IHRoaXMuY29sb3JLZXlzW01hdGgudHJ1bmMoTWF0aC5yYW5kb20oKSAqIHRoaXMuY29sb3JLZXlzLmxlbmd0aCldO1xuICAgICAgICBjb25zdCBhID0gdGhpcy5hbHBoYUtleXNbTWF0aC50cnVuYyhNYXRoLnJhbmRvbSgpICogdGhpcy5hbHBoYUtleXMubGVuZ3RoKV07XG4gICAgICAgIHRoaXMuX2NvbG9yLnNldChjLmNvbG9yKTtcbiAgICAgICAgdGhpcy5fY29sb3IuX2Zhc3RTZXRBKGEuYWxwaGEpO1xuICAgICAgICByZXR1cm4gdGhpcy5fY29sb3I7XG4gICAgfVxuXG4gICAgZ2V0UkdCICh0aW1lKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbG9yS2V5cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICB0aW1lID0gcmVwZWF0KHRpbWUsIDEpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLmNvbG9yS2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZVRpbWUgPSB0aGlzLmNvbG9yS2V5c1tpIC0gMV0udGltZTtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJUaW1lID0gdGhpcy5jb2xvcktleXNbaV0udGltZTtcbiAgICAgICAgICAgICAgICBpZiAodGltZSA+PSBwcmVUaW1lICYmIHRpbWUgPCBjdXJUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm1vZGUgPT09IE1vZGUuRml4ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbG9yS2V5c1tpXS5jb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmYWN0b3IgPSAodGltZSAtIHByZVRpbWUpIC8gKGN1clRpbWUgLSBwcmVUaW1lKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xvcktleXNbaSAtIDFdLmNvbG9yLmxlcnAodGhpcy5jb2xvcktleXNbaV0uY29sb3IsIGZhY3RvciwgdGhpcy5fY29sb3IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY29sb3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbGFzdEluZGV4ID0gdGhpcy5jb2xvcktleXMubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgIGlmICh0aW1lIDwgdGhpcy5jb2xvcktleXNbMF0udGltZSkge1xuICAgICAgICAgICAgICAgIGNjLkNvbG9yLkJMQUNLLmxlcnAodGhpcy5jb2xvcktleXNbMF0uY29sb3IsIHRpbWUgLyB0aGlzLmNvbG9yS2V5c1swXS50aW1lLCB0aGlzLl9jb2xvcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRpbWUgPiB0aGlzLmNvbG9yS2V5c1tsYXN0SW5kZXhdLnRpbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbG9yS2V5c1tsYXN0SW5kZXhdLmNvbG9yLmxlcnAoY2MuQ29sb3IuQkxBQ0ssICh0aW1lIC0gdGhpcy5jb2xvcktleXNbbGFzdEluZGV4XS50aW1lKSAvICgxIC0gdGhpcy5jb2xvcktleXNbbGFzdEluZGV4XS50aW1lKSwgdGhpcy5fY29sb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY29uc29sZS53YXJuKCdzb21ldGhpbmcgd2VudCB3cm9uZy4gY2FuIG5vdCBnZXQgZ3JhZGllbnQgY29sb3IuJyk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jb2xvcktleXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICB0aGlzLl9jb2xvci5zZXQodGhpcy5jb2xvcktleXNbMF0uY29sb3IpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbG9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fY29sb3Iuc2V0KGNjLkNvbG9yLldISVRFKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb2xvcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEFscGhhICh0aW1lKSB7XG4gICAgICAgIGlmICh0aGlzLmFscGhhS2V5cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICB0aW1lID0gcmVwZWF0KHRpbWUsIDEpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLmFscGhhS2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZVRpbWUgPSB0aGlzLmFscGhhS2V5c1tpIC0gMV0udGltZTtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJUaW1lID0gdGhpcy5hbHBoYUtleXNbaV0udGltZTtcbiAgICAgICAgICAgICAgICBpZiAodGltZSA+PSBwcmVUaW1lICYmIHRpbWUgPCBjdXJUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm1vZGUgPT09IE1vZGUuRml4ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFscGhhS2V5c1tpXS5hbHBoYTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmYWN0b3IgPSAodGltZSAtIHByZVRpbWUpIC8gKGN1clRpbWUgLSBwcmVUaW1lKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxlcnAodGhpcy5hbHBoYUtleXNbaSAtIDFdLmFscGhhICwgdGhpcy5hbHBoYUtleXNbaV0uYWxwaGEgLCBmYWN0b3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGxhc3RJbmRleCA9IHRoaXMuYWxwaGFLZXlzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICBpZiAodGltZSA8IHRoaXMuYWxwaGFLZXlzWzBdLnRpbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVycCgyNTUsIHRoaXMuYWxwaGFLZXlzWzBdLmFscGhhLCB0aW1lIC8gdGhpcy5hbHBoYUtleXNbMF0udGltZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRpbWUgPiB0aGlzLmFscGhhS2V5c1tsYXN0SW5kZXhdLnRpbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVycCh0aGlzLmFscGhhS2V5c1tsYXN0SW5kZXhdLmFscGhhLCAyNTUsICh0aW1lIC0gdGhpcy5hbHBoYUtleXNbbGFzdEluZGV4XS50aW1lKSAvICgxIC0gdGhpcy5hbHBoYUtleXNbbGFzdEluZGV4XS50aW1lKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5hbHBoYUtleXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hbHBoYUtleXNbMF0uYWxwaGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMjU1O1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jYy5Db2xvcktleSA9IENvbG9yS2V5O1xuY2MuQWxwaGFLZXkgPSBBbHBoYUtleTtcbmNjLkdyYWRpZW50ID0gR3JhZGllbnQ7XG5cbiJdfQ==