
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/animation/easing.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * @module cc
 */

/**
 * !#en
 * This class provide easing methods for {{#crossLink "tween"}}{{/crossLink}} class.<br>
 * Demonstratio: https://easings.net/
 * !#zh
 * 缓动函数类，为 {{#crossLink "Tween"}}{{/crossLink}} 提供缓动效果函数。<br>
 * 函数效果演示： https://easings.net/
 * @class Easing
 */
var easing = {
  constant: function constant() {
    return 0;
  },
  linear: function linear(k) {
    return k;
  },
  // quad
  //  easing equation function for a quadratic (t^2)
  //  @param t: Current time (in frames or seconds).
  //  @return: The correct value.

  /**
   * !#en Easing in with quadratic formula. From slow to fast.
   * !#zh 平方曲线缓入函数。运动由慢到快。
   * @method quadIn
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value
   */
  quadIn: function quadIn(k) {
    return k * k;
  },

  /**
   * !#en Easing out with quadratic formula. From fast to slow.
   * !#zh 平方曲线缓出函数。运动由快到慢。
   * @method quadOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value
   */
  quadOut: function quadOut(k) {
    return k * (2 - k);
  },

  /**
   * !#en Easing in and out with quadratic formula. From slow to fast, then back to slow.
   * !#zh 平方曲线缓入缓出函数。运动由慢到快再到慢。
   * @method quadInOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value
   */
  quadInOut: function quadInOut(k) {
    if ((k *= 2) < 1) {
      return 0.5 * k * k;
    }

    return -0.5 * (--k * (k - 2) - 1);
  },
  // cubic
  //  easing equation function for a cubic (t^3)
  //  @param t: Current time (in frames or seconds).
  //  @return: The correct value.

  /**
   * !#en Easing in with cubic formula. From slow to fast.
   * !#zh 立方曲线缓入函数。运动由慢到快。
   * @method cubicIn
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  cubicIn: function cubicIn(k) {
    return k * k * k;
  },

  /**
   * !#en Easing out with cubic formula. From slow to fast.
   * !#zh 立方曲线缓出函数。运动由快到慢。
   * @method cubicOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  cubicOut: function cubicOut(k) {
    return --k * k * k + 1;
  },

  /**
   * !#en Easing in and out with cubic formula. From slow to fast, then back to slow.
   * !#zh 立方曲线缓入缓出函数。运动由慢到快再到慢。
   * @method cubicInOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  cubicInOut: function cubicInOut(k) {
    if ((k *= 2) < 1) {
      return 0.5 * k * k * k;
    }

    return 0.5 * ((k -= 2) * k * k + 2);
  },
  // quart
  //  easing equation function for a quartic (t^4)
  //  @param t: Current time (in frames or seconds).
  //  @return: The correct value.

  /**
   * !#en Easing in with quartic formula. From slow to fast.
   * !#zh 四次方曲线缓入函数。运动由慢到快。
   * @method quartIn
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  quartIn: function quartIn(k) {
    return k * k * k * k;
  },

  /**
   * !#en Easing out with quartic formula. From fast to slow.
   * !#zh 四次方曲线缓出函数。运动由快到慢。
   * @method quartOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  quartOut: function quartOut(k) {
    return 1 - --k * k * k * k;
  },

  /**
   * !#en Easing in and out with quartic formula. From slow to fast, then back to slow.
   * !#zh 四次方曲线缓入缓出函数。运动由慢到快再到慢。
   * @method quartInOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  quartInOut: function quartInOut(k) {
    if ((k *= 2) < 1) {
      return 0.5 * k * k * k * k;
    }

    return -0.5 * ((k -= 2) * k * k * k - 2);
  },
  // quint
  //  easing equation function for a quintic (t^5)
  //  @param t: Current time (in frames or seconds).
  //  @return: The correct value.

  /**
   * !#en Easing in with quintic formula. From slow to fast.
   * !#zh 五次方曲线缓入函数。运动由慢到快。
   * @method quintIn
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  quintIn: function quintIn(k) {
    return k * k * k * k * k;
  },

  /**
   * !#en Easing out with quintic formula. From fast to slow.
   * !#zh 五次方曲线缓出函数。运动由快到慢。
   * @method quintOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  quintOut: function quintOut(k) {
    return --k * k * k * k * k + 1;
  },

  /**
   * !#en Easing in and out with quintic formula. From slow to fast, then back to slow.
   * !#zh 五次方曲线缓入缓出函数。运动由慢到快再到慢。
   * @method quintInOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  quintInOut: function quintInOut(k) {
    if ((k *= 2) < 1) {
      return 0.5 * k * k * k * k * k;
    }

    return 0.5 * ((k -= 2) * k * k * k * k + 2);
  },
  // sine
  //  easing equation function for a sinusoidal (sin(t))
  //  @param t: Current time (in frames or seconds).
  //  @return: The correct value.

  /**
   * !#en Easing in and out with sine formula. From slow to fast.
   * !#zh 正弦曲线缓入函数。运动由慢到快。
   * @method sineIn
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  sineIn: function sineIn(k) {
    return 1 - Math.cos(k * Math.PI / 2);
  },

  /**
   * !#en Easing in and out with sine formula. From fast to slow.
   * !#zh 正弦曲线缓出函数。运动由快到慢。
   * @method sineOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  sineOut: function sineOut(k) {
    return Math.sin(k * Math.PI / 2);
  },

  /**
   * !#en Easing in and out with sine formula. From slow to fast, then back to slow.
   * !#zh 正弦曲线缓入缓出函数。运动由慢到快再到慢。
   * @method sineInOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  sineInOut: function sineInOut(k) {
    return 0.5 * (1 - Math.cos(Math.PI * k));
  },
  // expo
  //  easing equation function for an exponential (2^t)
  //  param t: Current time (in frames or seconds).
  //  return: The correct value.

  /**
   * !#en Easing in and out with exponential formula. From slow to fast.
   * !#zh 指数曲线缓入函数。运动由慢到快。
   * @method expoIn
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  expoIn: function expoIn(k) {
    return k === 0 ? 0 : Math.pow(1024, k - 1);
  },

  /**
   * !#en Easing in and out with exponential formula. From fast to slow.
   * !#zh 指数曲线缓出函数。运动由快到慢。
   * @method expoOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  expoOut: function expoOut(k) {
    return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
  },

  /**
   * !#en Easing in and out with exponential formula. From slow to fast.
   * !#zh 指数曲线缓入和缓出函数。运动由慢到很快再到慢。
   * @method expoInOut
   * @param {Number} t The current time as a percentage of the total time, then back to slow.
   * @return {Number} The correct value.
   */
  expoInOut: function expoInOut(k) {
    if (k === 0) {
      return 0;
    }

    if (k === 1) {
      return 1;
    }

    if ((k *= 2) < 1) {
      return 0.5 * Math.pow(1024, k - 1);
    }

    return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
  },
  // circ
  //  easing equation function for a circular (sqrt(1-t^2))
  //  @param t: Current time (in frames or seconds).
  //  @return:	The correct value.

  /**
   * !#en Easing in and out with circular formula. From slow to fast.
   * !#zh 循环公式缓入函数。运动由慢到快。
   * @method circIn
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  circIn: function circIn(k) {
    return 1 - Math.sqrt(1 - k * k);
  },

  /**
   * !#en Easing in and out with circular formula. From fast to slow.
   * !#zh 循环公式缓出函数。运动由快到慢。
   * @method circOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  circOut: function circOut(k) {
    return Math.sqrt(1 - --k * k);
  },

  /**
   * !#en Easing in and out with circular formula. From slow to fast.
   * !#zh 指数曲线缓入缓出函数。运动由慢到很快再到慢。
   * @method circInOut
   * @param {Number} t The current time as a percentage of the total time, then back to slow.
   * @return {Number} The correct value.
   */
  circInOut: function circInOut(k) {
    if ((k *= 2) < 1) {
      return -0.5 * (Math.sqrt(1 - k * k) - 1);
    }

    return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
  },
  // elastic
  //  easing equation function for an elastic (exponentially decaying sine wave)
  //  @param t: Current time (in frames or seconds).
  //  @return: The correct value.
  //  recommand value: elastic (t)

  /**
   * !#en Easing in action with a spring oscillating effect.
   * !#zh 弹簧回震效果的缓入函数。
   * @method elasticIn
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  elasticIn: function elasticIn(k) {
    var s,
        a = 0.1,
        p = 0.4;

    if (k === 0) {
      return 0;
    }

    if (k === 1) {
      return 1;
    }

    if (!a || a < 1) {
      a = 1;
      s = p / 4;
    } else {
      s = p * Math.asin(1 / a) / (2 * Math.PI);
    }

    return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
  },

  /**
   * !#en Easing out action with a spring oscillating effect.
   * !#zh 弹簧回震效果的缓出函数。
   * @method elasticOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  elasticOut: function elasticOut(k) {
    var s,
        a = 0.1,
        p = 0.4;

    if (k === 0) {
      return 0;
    }

    if (k === 1) {
      return 1;
    }

    if (!a || a < 1) {
      a = 1;
      s = p / 4;
    } else {
      s = p * Math.asin(1 / a) / (2 * Math.PI);
    }

    return a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1;
  },

  /**
   * !#en Easing in and out action with a spring oscillating effect.
   * !#zh 弹簧回震效果的缓入缓出函数。
   * @method elasticInOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  elasticInOut: function elasticInOut(k) {
    var s,
        a = 0.1,
        p = 0.4;

    if (k === 0) {
      return 0;
    }

    if (k === 1) {
      return 1;
    }

    if (!a || a < 1) {
      a = 1;
      s = p / 4;
    } else {
      s = p * Math.asin(1 / a) / (2 * Math.PI);
    }

    if ((k *= 2) < 1) {
      return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
    }

    return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
  },
  // back
  //  easing equation function for a back (overshooting cubic easing: (s+1)*t^3 - s*t^2)
  //  @param t: Current time (in frames or seconds).
  //  @return: The correct value.

  /**
   * !#en Easing in action with "back up" behavior.
   * !#zh 回退效果的缓入函数。
   * @method backIn
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  backIn: function backIn(k) {
    var s = 1.70158;
    return k * k * ((s + 1) * k - s);
  },

  /**
   * !#en Easing out action with "back up" behavior.
   * !#zh 回退效果的缓出函数。
   * @method backOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  backOut: function backOut(k) {
    var s = 1.70158;
    return --k * k * ((s + 1) * k + s) + 1;
  },

  /**
   * !#en Easing in and out action with "back up" behavior.
   * !#zh 回退效果的缓入缓出函数。
   * @method backInOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  backInOut: function backInOut(k) {
    var s = 1.70158 * 1.525;

    if ((k *= 2) < 1) {
      return 0.5 * (k * k * ((s + 1) * k - s));
    }

    return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
  },
  // bounce
  //  easing equation function for a bounce (exponentially decaying parabolic bounce)
  //  @param t: Current time (in frames or seconds).
  //  @return: The correct value.

  /**
   * !#en Easing in action with bouncing effect.
   * !#zh 弹跳效果的缓入函数。
   * @method bounceIn
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  bounceIn: function bounceIn(k) {
    return 1 - easing.bounceOut(1 - k);
  },

  /**
   * !#en Easing out action with bouncing effect.
   * !#zh 弹跳效果的缓出函数。
   * @method bounceOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  bounceOut: function bounceOut(k) {
    if (k < 1 / 2.75) {
      return 7.5625 * k * k;
    } else if (k < 2 / 2.75) {
      return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
    } else if (k < 2.5 / 2.75) {
      return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
    } else {
      return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
    }
  },

  /**
   * !#en Easing in and out action with bouncing effect.
   * !#zh 弹跳效果的缓入缓出函数。
   * @method bounceInOut
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  bounceInOut: function bounceInOut(k) {
    if (k < 0.5) {
      return easing.bounceIn(k * 2) * 0.5;
    }

    return easing.bounceOut(k * 2 - 1) * 0.5 + 0.5;
  },

  /**
   * !#en Target will run action with smooth effect.
   * !#zh 平滑效果函数。
   * @method smooth
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  // t<=0: 0 | 0<t<1: 3*t^2 - 2*t^3 | t>=1: 1
  smooth: function smooth(t) {
    if (t <= 0) {
      return 0;
    }

    if (t >= 1) {
      return 1;
    }

    return t * t * (3 - 2 * t);
  },

  /**
   * !#en Target will run action with fade effect.
   * !#zh 渐褪效果函数。
   * @method fade
   * @param {Number} t The current time as a percentage of the total time.
   * @return {Number} The correct value.
   */
  // t<=0: 0 | 0<t<1: 6*t^5 - 15*t^4 + 10*t^3 | t>=1: 1
  fade: function fade(t) {
    if (t <= 0) {
      return 0;
    }

    if (t >= 1) {
      return 1;
    }

    return t * t * t * (t * (t * 6 - 15) + 10);
  }
};

function _makeOutIn(fnIn, fnOut) {
  return function (k) {
    if (k < 0.5) {
      return fnOut(k * 2) / 2;
    }

    return fnIn(2 * k - 1) / 2 + 0.5;
  };
}

easing.quadOutIn = _makeOutIn(easing.quadIn, easing.quadOut);
easing.cubicOutIn = _makeOutIn(easing.cubicIn, easing.cubicOut);
easing.quartOutIn = _makeOutIn(easing.quartIn, easing.quartOut);
easing.quintOutIn = _makeOutIn(easing.quintIn, easing.quintOut);
easing.sineOutIn = _makeOutIn(easing.sineIn, easing.sineOut);
easing.expoOutIn = _makeOutIn(easing.expoIn, easing.expoOut);
easing.circOutIn = _makeOutIn(easing.circIn, easing.circOut);
easing.backOutIn = _makeOutIn(easing.backIn, easing.backOut);

easing.bounceIn = function (k) {
  return 1 - easing.bounceOut(1 - k);
};

easing.bounceInOut = function (k) {
  if (k < 0.5) {
    return easing.bounceIn(k * 2) * 0.5;
  }

  return easing.bounceOut(k * 2 - 1) * 0.5 + 0.5;
};

easing.bounceOutIn = _makeOutIn(easing.bounceIn, easing.bounceOut);
/**
 * @module cc
 */

/**
 * !#en This is a Easing instance.
 * !#zh 这是一个 Easing 类实例。
 * @property easing
 * @type Easing
 */

cc.easing = module.exports = easing;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVhc2luZy5qcyJdLCJuYW1lcyI6WyJlYXNpbmciLCJjb25zdGFudCIsImxpbmVhciIsImsiLCJxdWFkSW4iLCJxdWFkT3V0IiwicXVhZEluT3V0IiwiY3ViaWNJbiIsImN1YmljT3V0IiwiY3ViaWNJbk91dCIsInF1YXJ0SW4iLCJxdWFydE91dCIsInF1YXJ0SW5PdXQiLCJxdWludEluIiwicXVpbnRPdXQiLCJxdWludEluT3V0Iiwic2luZUluIiwiTWF0aCIsImNvcyIsIlBJIiwic2luZU91dCIsInNpbiIsInNpbmVJbk91dCIsImV4cG9JbiIsInBvdyIsImV4cG9PdXQiLCJleHBvSW5PdXQiLCJjaXJjSW4iLCJzcXJ0IiwiY2lyY091dCIsImNpcmNJbk91dCIsImVsYXN0aWNJbiIsInMiLCJhIiwicCIsImFzaW4iLCJlbGFzdGljT3V0IiwiZWxhc3RpY0luT3V0IiwiYmFja0luIiwiYmFja091dCIsImJhY2tJbk91dCIsImJvdW5jZUluIiwiYm91bmNlT3V0IiwiYm91bmNlSW5PdXQiLCJzbW9vdGgiLCJ0IiwiZmFkZSIsIl9tYWtlT3V0SW4iLCJmbkluIiwiZm5PdXQiLCJxdWFkT3V0SW4iLCJjdWJpY091dEluIiwicXVhcnRPdXRJbiIsInF1aW50T3V0SW4iLCJzaW5lT3V0SW4iLCJleHBvT3V0SW4iLCJjaXJjT3V0SW4iLCJiYWNrT3V0SW4iLCJib3VuY2VPdXRJbiIsImNjIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBOzs7O0FBSUM7Ozs7Ozs7OztBQVVELElBQUlBLE1BQU0sR0FBRztBQUNUQyxFQUFBQSxRQUFRLEVBQUUsb0JBQVk7QUFBRSxXQUFPLENBQVA7QUFBVyxHQUQxQjtBQUVUQyxFQUFBQSxNQUFNLEVBQUUsZ0JBQVVDLENBQVYsRUFBYTtBQUFFLFdBQU9BLENBQVA7QUFBVyxHQUZ6QjtBQUlUO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7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VUFBVSxDQUFDL0MsTUFBTSxDQUFDdUIsTUFBUixFQUFnQnZCLE1BQU0sQ0FBQ3lCLE9BQXZCLENBQTdCO0FBQ0F6QixNQUFNLENBQUN3RCxTQUFQLEdBQW1CVCxVQUFVLENBQUMvQyxNQUFNLENBQUMyQixNQUFSLEVBQWdCM0IsTUFBTSxDQUFDNkIsT0FBdkIsQ0FBN0I7QUFDQTdCLE1BQU0sQ0FBQ3lELFNBQVAsR0FBbUJWLFVBQVUsQ0FBQy9DLE1BQU0sQ0FBQ3NDLE1BQVIsRUFBZ0J0QyxNQUFNLENBQUN1QyxPQUF2QixDQUE3Qjs7QUFDQXZDLE1BQU0sQ0FBQ3lDLFFBQVAsR0FBa0IsVUFBVXRDLENBQVYsRUFBYTtBQUFFLFNBQU8sSUFBSUgsTUFBTSxDQUFDMEMsU0FBUCxDQUFpQixJQUFJdkMsQ0FBckIsQ0FBWDtBQUFxQyxDQUF0RTs7QUFDQUgsTUFBTSxDQUFDMkMsV0FBUCxHQUFxQixVQUFVeEMsQ0FBVixFQUFhO0FBQzlCLE1BQUlBLENBQUMsR0FBRyxHQUFSLEVBQWE7QUFDVCxXQUFPSCxNQUFNLENBQUN5QyxRQUFQLENBQWdCdEMsQ0FBQyxHQUFHLENBQXBCLElBQXlCLEdBQWhDO0FBQ0g7O0FBQ0QsU0FBT0gsTUFBTSxDQUFDMEMsU0FBUCxDQUFpQnZDLENBQUMsR0FBRyxDQUFKLEdBQVEsQ0FBekIsSUFBOEIsR0FBOUIsR0FBb0MsR0FBM0M7QUFDSCxDQUxEOztBQU1BSCxNQUFNLENBQUMwRCxXQUFQLEdBQXFCWCxVQUFVLENBQUMvQyxNQUFNLENBQUN5QyxRQUFSLEVBQWtCekMsTUFBTSxDQUFDMEMsU0FBekIsQ0FBL0I7QUFFQTs7OztBQUlBOzs7Ozs7O0FBT0FpQixFQUFFLENBQUMzRCxNQUFILEdBQVk0RCxNQUFNLENBQUNDLE9BQVAsR0FBaUI3RCxNQUE3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qKlxuICogQG1vZHVsZSBjY1xuICovXG5cbiAvKipcbiAgKiAhI2VuXG4gICogVGhpcyBjbGFzcyBwcm92aWRlIGVhc2luZyBtZXRob2RzIGZvciB7eyNjcm9zc0xpbmsgXCJ0d2VlblwifX17ey9jcm9zc0xpbmt9fSBjbGFzcy48YnI+XG4gICogRGVtb25zdHJhdGlvOiBodHRwczovL2Vhc2luZ3MubmV0L1xuICAqICEjemhcbiAgKiDnvJPliqjlh73mlbDnsbvvvIzkuLoge3sjY3Jvc3NMaW5rIFwiVHdlZW5cIn19e3svY3Jvc3NMaW5rfX0g5o+Q5L6b57yT5Yqo5pWI5p6c5Ye95pWw44CCPGJyPlxuICAqIOWHveaVsOaViOaenOa8lOekuu+8miBodHRwczovL2Vhc2luZ3MubmV0L1xuICAqIEBjbGFzcyBFYXNpbmdcbiAgKi9cblxudmFyIGVhc2luZyA9IHtcbiAgICBjb25zdGFudDogZnVuY3Rpb24gKCkgeyByZXR1cm4gMDsgfSxcbiAgICBsaW5lYXI6IGZ1bmN0aW9uIChrKSB7IHJldHVybiBrOyB9LFxuXG4gICAgLy8gcXVhZFxuICAgIC8vICBlYXNpbmcgZXF1YXRpb24gZnVuY3Rpb24gZm9yIGEgcXVhZHJhdGljICh0XjIpXG4gICAgLy8gIEBwYXJhbSB0OiBDdXJyZW50IHRpbWUgKGluIGZyYW1lcyBvciBzZWNvbmRzKS5cbiAgICAvLyAgQHJldHVybjogVGhlIGNvcnJlY3QgdmFsdWUuXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEVhc2luZyBpbiB3aXRoIHF1YWRyYXRpYyBmb3JtdWxhLiBGcm9tIHNsb3cgdG8gZmFzdC5cbiAgICAgKiAhI3poIOW5s+aWueabsue6v+e8k+WFpeWHveaVsOOAgui/kOWKqOeUseaFouWIsOW/q+OAglxuICAgICAqIEBtZXRob2QgcXVhZEluXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHQgVGhlIGN1cnJlbnQgdGltZSBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHRvdGFsIHRpbWUuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgY29ycmVjdCB2YWx1ZVxuICAgICAqL1xuICAgIHF1YWRJbjogZnVuY3Rpb24gKGspIHsgcmV0dXJuIGsgKiBrOyB9LFxuICAgIC8qKlxuICAgICAqICEjZW4gRWFzaW5nIG91dCB3aXRoIHF1YWRyYXRpYyBmb3JtdWxhLiBGcm9tIGZhc3QgdG8gc2xvdy5cbiAgICAgKiAhI3poIOW5s+aWueabsue6v+e8k+WHuuWHveaVsOOAgui/kOWKqOeUseW/q+WIsOaFouOAglxuICAgICAqIEBtZXRob2QgcXVhZE91dFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0IFRoZSBjdXJyZW50IHRpbWUgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB0b3RhbCB0aW1lLlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIGNvcnJlY3QgdmFsdWVcbiAgICAgKi9cbiAgICBxdWFkT3V0OiBmdW5jdGlvbiAoaykgeyByZXR1cm4gayAqICggMiAtIGsgKTsgfSxcbiAgICAvKipcbiAgICAgKiAhI2VuIEVhc2luZyBpbiBhbmQgb3V0IHdpdGggcXVhZHJhdGljIGZvcm11bGEuIEZyb20gc2xvdyB0byBmYXN0LCB0aGVuIGJhY2sgdG8gc2xvdy5cbiAgICAgKiAhI3poIOW5s+aWueabsue6v+e8k+WFpee8k+WHuuWHveaVsOOAgui/kOWKqOeUseaFouWIsOW/q+WGjeWIsOaFouOAglxuICAgICAqIEBtZXRob2QgcXVhZEluT3V0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHQgVGhlIGN1cnJlbnQgdGltZSBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHRvdGFsIHRpbWUuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgY29ycmVjdCB2YWx1ZVxuICAgICAqL1xuICAgIHF1YWRJbk91dDogZnVuY3Rpb24gKGspIHtcbiAgICAgICAgaWYgKCggayAqPSAyICkgPCAxKSB7XG4gICAgICAgICAgICByZXR1cm4gMC41ICogayAqIGs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0wLjUgKiAoIC0tayAqICggayAtIDIgKSAtIDEgKTtcbiAgICB9LFxuXG4gICAgLy8gY3ViaWNcbiAgICAvLyAgZWFzaW5nIGVxdWF0aW9uIGZ1bmN0aW9uIGZvciBhIGN1YmljICh0XjMpXG4gICAgLy8gIEBwYXJhbSB0OiBDdXJyZW50IHRpbWUgKGluIGZyYW1lcyBvciBzZWNvbmRzKS5cbiAgICAvLyAgQHJldHVybjogVGhlIGNvcnJlY3QgdmFsdWUuXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEVhc2luZyBpbiB3aXRoIGN1YmljIGZvcm11bGEuIEZyb20gc2xvdyB0byBmYXN0LlxuICAgICAqICEjemgg56uL5pa55puy57q/57yT5YWl5Ye95pWw44CC6L+Q5Yqo55Sx5oWi5Yiw5b+r44CCXG4gICAgICogQG1ldGhvZCBjdWJpY0luXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHQgVGhlIGN1cnJlbnQgdGltZSBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHRvdGFsIHRpbWUuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgY29ycmVjdCB2YWx1ZS5cbiAgICAgKi9cbiAgICBjdWJpY0luOiBmdW5jdGlvbiAoaykgeyByZXR1cm4gayAqIGsgKiBrOyB9LFxuICAgIC8qKlxuICAgICAqICEjZW4gRWFzaW5nIG91dCB3aXRoIGN1YmljIGZvcm11bGEuIEZyb20gc2xvdyB0byBmYXN0LlxuICAgICAqICEjemgg56uL5pa55puy57q/57yT5Ye65Ye95pWw44CC6L+Q5Yqo55Sx5b+r5Yiw5oWi44CCXG4gICAgICogQG1ldGhvZCBjdWJpY091dFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0IFRoZSBjdXJyZW50IHRpbWUgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB0b3RhbCB0aW1lLlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIGNvcnJlY3QgdmFsdWUuXG4gICAgICovXG4gICAgY3ViaWNPdXQ6IGZ1bmN0aW9uIChrKSB7IHJldHVybiAtLWsgKiBrICogayArIDE7IH0sXG4gICAgLyoqXG4gICAgICogISNlbiBFYXNpbmcgaW4gYW5kIG91dCB3aXRoIGN1YmljIGZvcm11bGEuIEZyb20gc2xvdyB0byBmYXN0LCB0aGVuIGJhY2sgdG8gc2xvdy5cbiAgICAgKiAhI3poIOeri+aWueabsue6v+e8k+WFpee8k+WHuuWHveaVsOOAgui/kOWKqOeUseaFouWIsOW/q+WGjeWIsOaFouOAglxuICAgICAqIEBtZXRob2QgY3ViaWNJbk91dFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0IFRoZSBjdXJyZW50IHRpbWUgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB0b3RhbCB0aW1lLlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIGNvcnJlY3QgdmFsdWUuXG4gICAgICovXG4gICAgY3ViaWNJbk91dDogZnVuY3Rpb24gKGspIHtcbiAgICAgICAgaWYgKCggayAqPSAyICkgPCAxKSB7XG4gICAgICAgICAgICByZXR1cm4gMC41ICogayAqIGsgKiBrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwLjUgKiAoICggayAtPSAyICkgKiBrICogayArIDIgKTtcbiAgICB9LFxuXG4gICAgLy8gcXVhcnRcbiAgICAvLyAgZWFzaW5nIGVxdWF0aW9uIGZ1bmN0aW9uIGZvciBhIHF1YXJ0aWMgKHReNClcbiAgICAvLyAgQHBhcmFtIHQ6IEN1cnJlbnQgdGltZSAoaW4gZnJhbWVzIG9yIHNlY29uZHMpLlxuICAgIC8vICBAcmV0dXJuOiBUaGUgY29ycmVjdCB2YWx1ZS5cblxuICAgIC8qKlxuICAgICAqICEjZW4gRWFzaW5nIGluIHdpdGggcXVhcnRpYyBmb3JtdWxhLiBGcm9tIHNsb3cgdG8gZmFzdC5cbiAgICAgKiAhI3poIOWbm+asoeaWueabsue6v+e8k+WFpeWHveaVsOOAgui/kOWKqOeUseaFouWIsOW/q+OAglxuICAgICAqIEBtZXRob2QgcXVhcnRJblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0IFRoZSBjdXJyZW50IHRpbWUgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB0b3RhbCB0aW1lLlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIGNvcnJlY3QgdmFsdWUuXG4gICAgICovXG4gICAgcXVhcnRJbjogZnVuY3Rpb24gKGspIHsgcmV0dXJuIGsgKiBrICogayAqIGs7IH0sXG4gICAgLyoqXG4gICAgICogISNlbiBFYXNpbmcgb3V0IHdpdGggcXVhcnRpYyBmb3JtdWxhLiBGcm9tIGZhc3QgdG8gc2xvdy5cbiAgICAgKiAhI3poIOWbm+asoeaWueabsue6v+e8k+WHuuWHveaVsOOAgui/kOWKqOeUseW/q+WIsOaFouOAglxuICAgICAqIEBtZXRob2QgcXVhcnRPdXRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdCBUaGUgY3VycmVudCB0aW1lIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgdG90YWwgdGltZS5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBjb3JyZWN0IHZhbHVlLlxuICAgICAqL1xuICAgIHF1YXJ0T3V0OiBmdW5jdGlvbiAoaykgeyByZXR1cm4gMSAtICggLS1rICogayAqIGsgKiBrICk7IH0sXG4gICAgLyoqXG4gICAgICogISNlbiBFYXNpbmcgaW4gYW5kIG91dCB3aXRoIHF1YXJ0aWMgZm9ybXVsYS4gRnJvbSBzbG93IHRvIGZhc3QsIHRoZW4gYmFjayB0byBzbG93LlxuICAgICAqICEjemgg5Zub5qyh5pa55puy57q/57yT5YWl57yT5Ye65Ye95pWw44CC6L+Q5Yqo55Sx5oWi5Yiw5b+r5YaN5Yiw5oWi44CCXG4gICAgICogQG1ldGhvZCBxdWFydEluT3V0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHQgVGhlIGN1cnJlbnQgdGltZSBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHRvdGFsIHRpbWUuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgY29ycmVjdCB2YWx1ZS5cbiAgICAgKi9cbiAgICBxdWFydEluT3V0OiAgZnVuY3Rpb24gKGspIHtcbiAgICAgICAgaWYgKCggayAqPSAyICkgPCAxKSB7XG4gICAgICAgICAgICByZXR1cm4gMC41ICogayAqIGsgKiBrICogaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTAuNSAqICggKCBrIC09IDIgKSAqIGsgKiBrICogayAtIDIgKTtcbiAgICB9LFxuXG4gICAgLy8gcXVpbnRcbiAgICAvLyAgZWFzaW5nIGVxdWF0aW9uIGZ1bmN0aW9uIGZvciBhIHF1aW50aWMgKHReNSlcbiAgICAvLyAgQHBhcmFtIHQ6IEN1cnJlbnQgdGltZSAoaW4gZnJhbWVzIG9yIHNlY29uZHMpLlxuICAgIC8vICBAcmV0dXJuOiBUaGUgY29ycmVjdCB2YWx1ZS5cblxuICAgIC8qKlxuICAgICAqICEjZW4gRWFzaW5nIGluIHdpdGggcXVpbnRpYyBmb3JtdWxhLiBGcm9tIHNsb3cgdG8gZmFzdC5cbiAgICAgKiAhI3poIOS6lOasoeaWueabsue6v+e8k+WFpeWHveaVsOOAgui/kOWKqOeUseaFouWIsOW/q+OAglxuICAgICAqIEBtZXRob2QgcXVpbnRJblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0IFRoZSBjdXJyZW50IHRpbWUgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB0b3RhbCB0aW1lLlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIGNvcnJlY3QgdmFsdWUuXG4gICAgICovXG4gICAgcXVpbnRJbjogZnVuY3Rpb24gKGspIHsgcmV0dXJuIGsgKiBrICogayAqIGsgKiBrOyB9LFxuICAgIC8qKlxuICAgICAqICEjZW4gRWFzaW5nIG91dCB3aXRoIHF1aW50aWMgZm9ybXVsYS4gRnJvbSBmYXN0IHRvIHNsb3cuXG4gICAgICogISN6aCDkupTmrKHmlrnmm7Lnur/nvJPlh7rlh73mlbDjgILov5DliqjnlLHlv6vliLDmhaLjgIJcbiAgICAgKiBAbWV0aG9kIHF1aW50T3V0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHQgVGhlIGN1cnJlbnQgdGltZSBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHRvdGFsIHRpbWUuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgY29ycmVjdCB2YWx1ZS5cbiAgICAgKi9cbiAgICBxdWludE91dDogZnVuY3Rpb24gKGspIHsgcmV0dXJuIC0tayAqIGsgKiBrICogayAqIGsgKyAxOyB9LFxuICAgIC8qKlxuICAgICAqICEjZW4gRWFzaW5nIGluIGFuZCBvdXQgd2l0aCBxdWludGljIGZvcm11bGEuIEZyb20gc2xvdyB0byBmYXN0LCB0aGVuIGJhY2sgdG8gc2xvdy5cbiAgICAgKiAhI3poIOS6lOasoeaWueabsue6v+e8k+WFpee8k+WHuuWHveaVsOOAgui/kOWKqOeUseaFouWIsOW/q+WGjeWIsOaFouOAglxuICAgICAqIEBtZXRob2QgcXVpbnRJbk91dFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0IFRoZSBjdXJyZW50IHRpbWUgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB0b3RhbCB0aW1lLlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIGNvcnJlY3QgdmFsdWUuXG4gICAgICovXG4gICAgcXVpbnRJbk91dDogZnVuY3Rpb24gKGspIHtcbiAgICAgICAgaWYgKCggayAqPSAyICkgPCAxKSB7XG4gICAgICAgICAgICByZXR1cm4gMC41ICogayAqIGsgKiBrICogayAqIGs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDAuNSAqICggKCBrIC09IDIgKSAqIGsgKiBrICogayAqIGsgKyAyICk7XG4gICAgfSxcblxuICAgIC8vIHNpbmVcbiAgICAvLyAgZWFzaW5nIGVxdWF0aW9uIGZ1bmN0aW9uIGZvciBhIHNpbnVzb2lkYWwgKHNpbih0KSlcbiAgICAvLyAgQHBhcmFtIHQ6IEN1cnJlbnQgdGltZSAoaW4gZnJhbWVzIG9yIHNlY29uZHMpLlxuICAgIC8vICBAcmV0dXJuOiBUaGUgY29ycmVjdCB2YWx1ZS5cblxuICAgIC8qKlxuICAgICAqICEjZW4gRWFzaW5nIGluIGFuZCBvdXQgd2l0aCBzaW5lIGZvcm11bGEuIEZyb20gc2xvdyB0byBmYXN0LlxuICAgICAqICEjemgg5q2j5bym5puy57q/57yT5YWl5Ye95pWw44CC6L+Q5Yqo55Sx5oWi5Yiw5b+r44CCXG4gICAgICogQG1ldGhvZCBzaW5lSW5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdCBUaGUgY3VycmVudCB0aW1lIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgdG90YWwgdGltZS5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBjb3JyZWN0IHZhbHVlLlxuICAgICAqL1xuICAgIHNpbmVJbjogZnVuY3Rpb24gKGspIHsgcmV0dXJuIDEgLSBNYXRoLmNvcyhrICogTWF0aC5QSSAvIDIpOyB9LFxuICAgIC8qKlxuICAgICAqICEjZW4gRWFzaW5nIGluIGFuZCBvdXQgd2l0aCBzaW5lIGZvcm11bGEuIEZyb20gZmFzdCB0byBzbG93LlxuICAgICAqICEjemgg5q2j5bym5puy57q/57yT5Ye65Ye95pWw44CC6L+Q5Yqo55Sx5b+r5Yiw5oWi44CCXG4gICAgICogQG1ldGhvZCBzaW5lT3V0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHQgVGhlIGN1cnJlbnQgdGltZSBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHRvdGFsIHRpbWUuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgY29ycmVjdCB2YWx1ZS5cbiAgICAgKi9cbiAgICBzaW5lT3V0OiBmdW5jdGlvbiAoaykgeyByZXR1cm4gTWF0aC5zaW4oayAqIE1hdGguUEkgLyAyKTsgfSxcbiAgICAvKipcbiAgICAgKiAhI2VuIEVhc2luZyBpbiBhbmQgb3V0IHdpdGggc2luZSBmb3JtdWxhLiBGcm9tIHNsb3cgdG8gZmFzdCwgdGhlbiBiYWNrIHRvIHNsb3cuXG4gICAgICogISN6aCDmraPlvKbmm7Lnur/nvJPlhaXnvJPlh7rlh73mlbDjgILov5DliqjnlLHmhaLliLDlv6vlho3liLDmhaLjgIJcbiAgICAgKiBAbWV0aG9kIHNpbmVJbk91dFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0IFRoZSBjdXJyZW50IHRpbWUgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB0b3RhbCB0aW1lLlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIGNvcnJlY3QgdmFsdWUuXG4gICAgICovXG4gICAgc2luZUluT3V0OiBmdW5jdGlvbiAoaykgeyByZXR1cm4gMC41ICogKCAxIC0gTWF0aC5jb3MoTWF0aC5QSSAqIGspICk7IH0sXG5cbiAgICAvLyBleHBvXG4gICAgLy8gIGVhc2luZyBlcXVhdGlvbiBmdW5jdGlvbiBmb3IgYW4gZXhwb25lbnRpYWwgKDJedClcbiAgICAvLyAgcGFyYW0gdDogQ3VycmVudCB0aW1lIChpbiBmcmFtZXMgb3Igc2Vjb25kcykuXG4gICAgLy8gIHJldHVybjogVGhlIGNvcnJlY3QgdmFsdWUuXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEVhc2luZyBpbiBhbmQgb3V0IHdpdGggZXhwb25lbnRpYWwgZm9ybXVsYS4gRnJvbSBzbG93IHRvIGZhc3QuXG4gICAgICogISN6aCDmjIfmlbDmm7Lnur/nvJPlhaXlh73mlbDjgILov5DliqjnlLHmhaLliLDlv6vjgIJcbiAgICAgKiBAbWV0aG9kIGV4cG9JblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0IFRoZSBjdXJyZW50IHRpbWUgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB0b3RhbCB0aW1lLlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIGNvcnJlY3QgdmFsdWUuXG4gICAgICovXG4gICAgZXhwb0luOiBmdW5jdGlvbiAoaykgeyByZXR1cm4gayA9PT0gMCA/IDAgOiBNYXRoLnBvdygxMDI0LCBrIC0gMSk7IH0sXG4gICAgLyoqXG4gICAgICogISNlbiBFYXNpbmcgaW4gYW5kIG91dCB3aXRoIGV4cG9uZW50aWFsIGZvcm11bGEuIEZyb20gZmFzdCB0byBzbG93LlxuICAgICAqICEjemgg5oyH5pWw5puy57q/57yT5Ye65Ye95pWw44CC6L+Q5Yqo55Sx5b+r5Yiw5oWi44CCXG4gICAgICogQG1ldGhvZCBleHBvT3V0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHQgVGhlIGN1cnJlbnQgdGltZSBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHRvdGFsIHRpbWUuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgY29ycmVjdCB2YWx1ZS5cbiAgICAgKi9cbiAgICBleHBvT3V0OiBmdW5jdGlvbiAoaykgeyByZXR1cm4gayA9PT0gMSA/IDEgOiAxIC0gTWF0aC5wb3coMiwgLTEwICogayk7IH0sXG4gICAgLyoqXG4gICAgICogISNlbiBFYXNpbmcgaW4gYW5kIG91dCB3aXRoIGV4cG9uZW50aWFsIGZvcm11bGEuIEZyb20gc2xvdyB0byBmYXN0LlxuICAgICAqICEjemgg5oyH5pWw5puy57q/57yT5YWl5ZKM57yT5Ye65Ye95pWw44CC6L+Q5Yqo55Sx5oWi5Yiw5b6I5b+r5YaN5Yiw5oWi44CCXG4gICAgICogQG1ldGhvZCBleHBvSW5PdXRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdCBUaGUgY3VycmVudCB0aW1lIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgdG90YWwgdGltZSwgdGhlbiBiYWNrIHRvIHNsb3cuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgY29ycmVjdCB2YWx1ZS5cbiAgICAgKi9cbiAgICBleHBvSW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG4gICAgICAgIGlmIChrID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoayA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCggayAqPSAyICkgPCAxKSB7XG4gICAgICAgICAgICByZXR1cm4gMC41ICogTWF0aC5wb3coMTAyNCwgayAtIDEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwLjUgKiAoIC1NYXRoLnBvdygyLCAtMTAgKiAoIGsgLSAxICkpICsgMiApO1xuICAgIH0sXG5cbiAgICAvLyBjaXJjXG4gICAgLy8gIGVhc2luZyBlcXVhdGlvbiBmdW5jdGlvbiBmb3IgYSBjaXJjdWxhciAoc3FydCgxLXReMikpXG4gICAgLy8gIEBwYXJhbSB0OiBDdXJyZW50IHRpbWUgKGluIGZyYW1lcyBvciBzZWNvbmRzKS5cbiAgICAvLyAgQHJldHVybjpcdFRoZSBjb3JyZWN0IHZhbHVlLlxuXG4gICAgLyoqXG4gICAgICogISNlbiBFYXNpbmcgaW4gYW5kIG91dCB3aXRoIGNpcmN1bGFyIGZvcm11bGEuIEZyb20gc2xvdyB0byBmYXN0LlxuICAgICAqICEjemgg5b6q546v5YWs5byP57yT5YWl5Ye95pWw44CC6L+Q5Yqo55Sx5oWi5Yiw5b+r44CCXG4gICAgICogQG1ldGhvZCBjaXJjSW5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdCBUaGUgY3VycmVudCB0aW1lIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgdG90YWwgdGltZS5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBjb3JyZWN0IHZhbHVlLlxuICAgICAqL1xuICAgIGNpcmNJbjogZnVuY3Rpb24gKGspIHsgcmV0dXJuIDEgLSBNYXRoLnNxcnQoMSAtIGsgKiBrKTsgfSxcbiAgICAvKipcbiAgICAgKiAhI2VuIEVhc2luZyBpbiBhbmQgb3V0IHdpdGggY2lyY3VsYXIgZm9ybXVsYS4gRnJvbSBmYXN0IHRvIHNsb3cuXG4gICAgICogISN6aCDlvqrnjq/lhazlvI/nvJPlh7rlh73mlbDjgILov5DliqjnlLHlv6vliLDmhaLjgIJcbiAgICAgKiBAbWV0aG9kIGNpcmNPdXRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdCBUaGUgY3VycmVudCB0aW1lIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgdG90YWwgdGltZS5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBjb3JyZWN0IHZhbHVlLlxuICAgICAqL1xuICAgIGNpcmNPdXQ6IGZ1bmN0aW9uIChrKSB7IHJldHVybiBNYXRoLnNxcnQoMSAtICggLS1rICogayApKTsgfSxcbiAgICAvKipcbiAgICAgKiAhI2VuIEVhc2luZyBpbiBhbmQgb3V0IHdpdGggY2lyY3VsYXIgZm9ybXVsYS4gRnJvbSBzbG93IHRvIGZhc3QuXG4gICAgICogISN6aCDmjIfmlbDmm7Lnur/nvJPlhaXnvJPlh7rlh73mlbDjgILov5DliqjnlLHmhaLliLDlvojlv6vlho3liLDmhaLjgIJcbiAgICAgKiBAbWV0aG9kIGNpcmNJbk91dFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0IFRoZSBjdXJyZW50IHRpbWUgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB0b3RhbCB0aW1lLCB0aGVuIGJhY2sgdG8gc2xvdy5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBjb3JyZWN0IHZhbHVlLlxuICAgICAqL1xuICAgIGNpcmNJbk91dDogZnVuY3Rpb24gKGspIHtcbiAgICAgICAgaWYgKCggayAqPSAyICkgPCAxKSB7XG4gICAgICAgICAgICByZXR1cm4gLTAuNSAqICggTWF0aC5zcXJ0KDEgLSBrICogaykgLSAxKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMC41ICogKCBNYXRoLnNxcnQoMSAtICggayAtPSAyKSAqIGspICsgMSk7XG4gICAgfSxcblxuICAgIC8vIGVsYXN0aWNcbiAgICAvLyAgZWFzaW5nIGVxdWF0aW9uIGZ1bmN0aW9uIGZvciBhbiBlbGFzdGljIChleHBvbmVudGlhbGx5IGRlY2F5aW5nIHNpbmUgd2F2ZSlcbiAgICAvLyAgQHBhcmFtIHQ6IEN1cnJlbnQgdGltZSAoaW4gZnJhbWVzIG9yIHNlY29uZHMpLlxuICAgIC8vICBAcmV0dXJuOiBUaGUgY29ycmVjdCB2YWx1ZS5cbiAgICAvLyAgcmVjb21tYW5kIHZhbHVlOiBlbGFzdGljICh0KVxuXG4gICAgLyoqXG4gICAgICogISNlbiBFYXNpbmcgaW4gYWN0aW9uIHdpdGggYSBzcHJpbmcgb3NjaWxsYXRpbmcgZWZmZWN0LlxuICAgICAqICEjemgg5by557Cn5Zue6ZyH5pWI5p6c55qE57yT5YWl5Ye95pWw44CCXG4gICAgICogQG1ldGhvZCBlbGFzdGljSW5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdCBUaGUgY3VycmVudCB0aW1lIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgdG90YWwgdGltZS5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBjb3JyZWN0IHZhbHVlLlxuICAgICAqL1xuICAgIGVsYXN0aWNJbjogZnVuY3Rpb24gKGspIHtcbiAgICAgICAgdmFyIHMsIGEgPSAwLjEsIHAgPSAwLjQ7XG4gICAgICAgIGlmIChrID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoayA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhIHx8IGEgPCAxKSB7XG4gICAgICAgICAgICBhID0gMTtcbiAgICAgICAgICAgIHMgPSBwIC8gNDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHMgPSBwICogTWF0aC5hc2luKDEgLyBhKSAvICggMiAqIE1hdGguUEkgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLSggYSAqIE1hdGgucG93KDIsIDEwICogKCBrIC09IDEgKSkgKiBNYXRoLnNpbigoIGsgLSBzICkgKiAoIDIgKiBNYXRoLlBJICkgLyBwKSApO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogISNlbiBFYXNpbmcgb3V0IGFjdGlvbiB3aXRoIGEgc3ByaW5nIG9zY2lsbGF0aW5nIGVmZmVjdC5cbiAgICAgKiAhI3poIOW8ueewp+Wbnumch+aViOaenOeahOe8k+WHuuWHveaVsOOAglxuICAgICAqIEBtZXRob2QgZWxhc3RpY091dFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0IFRoZSBjdXJyZW50IHRpbWUgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB0b3RhbCB0aW1lLlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIGNvcnJlY3QgdmFsdWUuXG4gICAgICovXG4gICAgZWxhc3RpY091dDogZnVuY3Rpb24gKGspIHtcbiAgICAgICAgdmFyIHMsIGEgPSAwLjEsIHAgPSAwLjQ7XG4gICAgICAgIGlmIChrID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoayA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhIHx8IGEgPCAxKSB7XG4gICAgICAgICAgICBhID0gMTtcbiAgICAgICAgICAgIHMgPSBwIC8gNDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHMgPSBwICogTWF0aC5hc2luKDEgLyBhKSAvICggMiAqIE1hdGguUEkgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKCBhICogTWF0aC5wb3coMiwgLTEwICogaykgKiBNYXRoLnNpbigoIGsgLSBzICkgKiAoIDIgKiBNYXRoLlBJICkgLyBwKSArIDEgKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqICEjZW4gRWFzaW5nIGluIGFuZCBvdXQgYWN0aW9uIHdpdGggYSBzcHJpbmcgb3NjaWxsYXRpbmcgZWZmZWN0LlxuICAgICAqICEjemgg5by557Cn5Zue6ZyH5pWI5p6c55qE57yT5YWl57yT5Ye65Ye95pWw44CCXG4gICAgICogQG1ldGhvZCBlbGFzdGljSW5PdXRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdCBUaGUgY3VycmVudCB0aW1lIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgdG90YWwgdGltZS5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBjb3JyZWN0IHZhbHVlLlxuICAgICAqL1xuICAgIGVsYXN0aWNJbk91dDogZnVuY3Rpb24gKGspIHtcbiAgICAgICAgdmFyIHMsIGEgPSAwLjEsIHAgPSAwLjQ7XG4gICAgICAgIGlmIChrID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoayA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhIHx8IGEgPCAxKSB7XG4gICAgICAgICAgICBhID0gMTtcbiAgICAgICAgICAgIHMgPSBwIC8gNDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHMgPSBwICogTWF0aC5hc2luKDEgLyBhKSAvICggMiAqIE1hdGguUEkgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoKCBrICo9IDIgKSA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybiAtMC41ICpcbiAgICAgICAgICAgICAgICAgICAoIGEgKiBNYXRoLnBvdygyLCAxMCAqICggayAtPSAxICkpICogTWF0aC5zaW4oKCBrIC0gcyApICogKCAyICogTWF0aC5QSSApIC8gcCkgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYSAqIE1hdGgucG93KDIsIC0xMCAqICggayAtPSAxICkpICogTWF0aC5zaW4oKCBrIC0gcyApICogKCAyICogTWF0aC5QSSApIC8gcCkgKiAwLjUgKyAxO1xuICAgIH0sXG5cbiAgICAvLyBiYWNrXG4gICAgLy8gIGVhc2luZyBlcXVhdGlvbiBmdW5jdGlvbiBmb3IgYSBiYWNrIChvdmVyc2hvb3RpbmcgY3ViaWMgZWFzaW5nOiAocysxKSp0XjMgLSBzKnReMilcbiAgICAvLyAgQHBhcmFtIHQ6IEN1cnJlbnQgdGltZSAoaW4gZnJhbWVzIG9yIHNlY29uZHMpLlxuICAgIC8vICBAcmV0dXJuOiBUaGUgY29ycmVjdCB2YWx1ZS5cblxuICAgIC8qKlxuICAgICAqICEjZW4gRWFzaW5nIGluIGFjdGlvbiB3aXRoIFwiYmFjayB1cFwiIGJlaGF2aW9yLlxuICAgICAqICEjemgg5Zue6YCA5pWI5p6c55qE57yT5YWl5Ye95pWw44CCXG4gICAgICogQG1ldGhvZCBiYWNrSW5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdCBUaGUgY3VycmVudCB0aW1lIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgdG90YWwgdGltZS5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBjb3JyZWN0IHZhbHVlLlxuICAgICAqL1xuICAgIGJhY2tJbjogZnVuY3Rpb24gKGspIHtcbiAgICAgICAgdmFyIHMgPSAxLjcwMTU4O1xuICAgICAgICByZXR1cm4gayAqIGsgKiAoICggcyArIDEgKSAqIGsgLSBzICk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiAhI2VuIEVhc2luZyBvdXQgYWN0aW9uIHdpdGggXCJiYWNrIHVwXCIgYmVoYXZpb3IuXG4gICAgICogISN6aCDlm57pgIDmlYjmnpznmoTnvJPlh7rlh73mlbDjgIJcbiAgICAgKiBAbWV0aG9kIGJhY2tPdXRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdCBUaGUgY3VycmVudCB0aW1lIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgdG90YWwgdGltZS5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBjb3JyZWN0IHZhbHVlLlxuICAgICAqL1xuICAgIGJhY2tPdXQ6IGZ1bmN0aW9uIChrKSB7XG4gICAgICAgIHZhciBzID0gMS43MDE1ODtcbiAgICAgICAgcmV0dXJuIC0tayAqIGsgKiAoICggcyArIDEgKSAqIGsgKyBzICkgKyAxO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogISNlbiBFYXNpbmcgaW4gYW5kIG91dCBhY3Rpb24gd2l0aCBcImJhY2sgdXBcIiBiZWhhdmlvci5cbiAgICAgKiAhI3poIOWbnumAgOaViOaenOeahOe8k+WFpee8k+WHuuWHveaVsOOAglxuICAgICAqIEBtZXRob2QgYmFja0luT3V0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHQgVGhlIGN1cnJlbnQgdGltZSBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHRvdGFsIHRpbWUuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgY29ycmVjdCB2YWx1ZS5cbiAgICAgKi9cbiAgICBiYWNrSW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG4gICAgICAgIHZhciBzID0gMS43MDE1OCAqIDEuNTI1O1xuICAgICAgICBpZiAoKCBrICo9IDIgKSA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybiAwLjUgKiAoIGsgKiBrICogKCAoIHMgKyAxICkgKiBrIC0gcyApICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDAuNSAqICggKCBrIC09IDIgKSAqIGsgKiAoICggcyArIDEgKSAqIGsgKyBzICkgKyAyICk7XG4gICAgfSxcblxuICAgIC8vIGJvdW5jZVxuICAgIC8vICBlYXNpbmcgZXF1YXRpb24gZnVuY3Rpb24gZm9yIGEgYm91bmNlIChleHBvbmVudGlhbGx5IGRlY2F5aW5nIHBhcmFib2xpYyBib3VuY2UpXG4gICAgLy8gIEBwYXJhbSB0OiBDdXJyZW50IHRpbWUgKGluIGZyYW1lcyBvciBzZWNvbmRzKS5cbiAgICAvLyAgQHJldHVybjogVGhlIGNvcnJlY3QgdmFsdWUuXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEVhc2luZyBpbiBhY3Rpb24gd2l0aCBib3VuY2luZyBlZmZlY3QuXG4gICAgICogISN6aCDlvLnot7PmlYjmnpznmoTnvJPlhaXlh73mlbDjgIJcbiAgICAgKiBAbWV0aG9kIGJvdW5jZUluXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHQgVGhlIGN1cnJlbnQgdGltZSBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHRvdGFsIHRpbWUuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgY29ycmVjdCB2YWx1ZS5cbiAgICAgKi9cbiAgICBib3VuY2VJbjogZnVuY3Rpb24gKGspIHtcbiAgICAgICAgcmV0dXJuIDEgLSBlYXNpbmcuYm91bmNlT3V0KDEgLSBrKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqICEjZW4gRWFzaW5nIG91dCBhY3Rpb24gd2l0aCBib3VuY2luZyBlZmZlY3QuXG4gICAgICogISN6aCDlvLnot7PmlYjmnpznmoTnvJPlh7rlh73mlbDjgIJcbiAgICAgKiBAbWV0aG9kIGJvdW5jZU91dFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0IFRoZSBjdXJyZW50IHRpbWUgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB0b3RhbCB0aW1lLlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIGNvcnJlY3QgdmFsdWUuXG4gICAgICovXG4gICAgYm91bmNlT3V0OiBmdW5jdGlvbiAoaykge1xuICAgICAgICBpZiAoayA8ICggMSAvIDIuNzUgKSkge1xuICAgICAgICAgICAgcmV0dXJuIDcuNTYyNSAqIGsgKiBrO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGsgPCAoIDIgLyAyLjc1ICkpIHtcbiAgICAgICAgICAgIHJldHVybiA3LjU2MjUgKiAoIGsgLT0gKCAxLjUgLyAyLjc1ICkgKSAqIGsgKyAwLjc1O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGsgPCAoIDIuNSAvIDIuNzUgKSkge1xuICAgICAgICAgICAgcmV0dXJuIDcuNTYyNSAqICggayAtPSAoIDIuMjUgLyAyLjc1ICkgKSAqIGsgKyAwLjkzNzU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gNy41NjI1ICogKCBrIC09ICggMi42MjUgLyAyLjc1ICkgKSAqIGsgKyAwLjk4NDM3NTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogISNlbiBFYXNpbmcgaW4gYW5kIG91dCBhY3Rpb24gd2l0aCBib3VuY2luZyBlZmZlY3QuXG4gICAgICogISN6aCDlvLnot7PmlYjmnpznmoTnvJPlhaXnvJPlh7rlh73mlbDjgIJcbiAgICAgKiBAbWV0aG9kIGJvdW5jZUluT3V0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHQgVGhlIGN1cnJlbnQgdGltZSBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHRvdGFsIHRpbWUuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgY29ycmVjdCB2YWx1ZS5cbiAgICAgKi9cbiAgICBib3VuY2VJbk91dDogZnVuY3Rpb24gKGspIHtcbiAgICAgICAgaWYgKGsgPCAwLjUpIHtcbiAgICAgICAgICAgIHJldHVybiBlYXNpbmcuYm91bmNlSW4oayAqIDIpICogMC41O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlYXNpbmcuYm91bmNlT3V0KGsgKiAyIC0gMSkgKiAwLjUgKyAwLjU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGFyZ2V0IHdpbGwgcnVuIGFjdGlvbiB3aXRoIHNtb290aCBlZmZlY3QuXG4gICAgICogISN6aCDlubPmu5HmlYjmnpzlh73mlbDjgIJcbiAgICAgKiBAbWV0aG9kIHNtb290aFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0IFRoZSBjdXJyZW50IHRpbWUgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB0b3RhbCB0aW1lLlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIGNvcnJlY3QgdmFsdWUuXG4gICAgICovXG4gICAgLy8gdDw9MDogMCB8IDA8dDwxOiAzKnReMiAtIDIqdF4zIHwgdD49MTogMVxuICAgIHNtb290aDogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgaWYgKHQgPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHQgPj0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQgKiB0ICogKDMgLSAyICogdCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGFyZ2V0IHdpbGwgcnVuIGFjdGlvbiB3aXRoIGZhZGUgZWZmZWN0LlxuICAgICAqICEjemgg5riQ6KSq5pWI5p6c5Ye95pWw44CCXG4gICAgICogQG1ldGhvZCBmYWRlXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHQgVGhlIGN1cnJlbnQgdGltZSBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHRvdGFsIHRpbWUuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgY29ycmVjdCB2YWx1ZS5cbiAgICAgKi9cbiAgICAvLyB0PD0wOiAwIHwgMDx0PDE6IDYqdF41IC0gMTUqdF40ICsgMTAqdF4zIHwgdD49MTogMVxuICAgIGZhZGU6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIGlmICh0IDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0ID49IDEpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ICogdCAqIHQgKiAodCAqICh0ICogNiAtIDE1KSArIDEwKTtcbiAgICB9LFxufTtcblxuZnVuY3Rpb24gX21ha2VPdXRJbiAoZm5JbiwgZm5PdXQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGspIHtcbiAgICAgICAgaWYgKGsgPCAwLjUpIHtcbiAgICAgICAgICAgIHJldHVybiBmbk91dChrICogMikgLyAyO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmbkluKDIgKiBrIC0gMSkgLyAyICsgMC41O1xuICAgIH07XG59XG5lYXNpbmcucXVhZE91dEluID0gX21ha2VPdXRJbihlYXNpbmcucXVhZEluLCBlYXNpbmcucXVhZE91dCk7XG5lYXNpbmcuY3ViaWNPdXRJbiA9IF9tYWtlT3V0SW4oZWFzaW5nLmN1YmljSW4sIGVhc2luZy5jdWJpY091dCk7XG5lYXNpbmcucXVhcnRPdXRJbiA9IF9tYWtlT3V0SW4oZWFzaW5nLnF1YXJ0SW4sIGVhc2luZy5xdWFydE91dCk7XG5lYXNpbmcucXVpbnRPdXRJbiA9IF9tYWtlT3V0SW4oZWFzaW5nLnF1aW50SW4sIGVhc2luZy5xdWludE91dCk7XG5lYXNpbmcuc2luZU91dEluID0gX21ha2VPdXRJbihlYXNpbmcuc2luZUluLCBlYXNpbmcuc2luZU91dCk7XG5lYXNpbmcuZXhwb091dEluID0gX21ha2VPdXRJbihlYXNpbmcuZXhwb0luLCBlYXNpbmcuZXhwb091dCk7XG5lYXNpbmcuY2lyY091dEluID0gX21ha2VPdXRJbihlYXNpbmcuY2lyY0luLCBlYXNpbmcuY2lyY091dCk7XG5lYXNpbmcuYmFja091dEluID0gX21ha2VPdXRJbihlYXNpbmcuYmFja0luLCBlYXNpbmcuYmFja091dCk7XG5lYXNpbmcuYm91bmNlSW4gPSBmdW5jdGlvbiAoaykgeyByZXR1cm4gMSAtIGVhc2luZy5ib3VuY2VPdXQoMSAtIGspOyB9O1xuZWFzaW5nLmJvdW5jZUluT3V0ID0gZnVuY3Rpb24gKGspIHtcbiAgICBpZiAoayA8IDAuNSkge1xuICAgICAgICByZXR1cm4gZWFzaW5nLmJvdW5jZUluKGsgKiAyKSAqIDAuNTtcbiAgICB9XG4gICAgcmV0dXJuIGVhc2luZy5ib3VuY2VPdXQoayAqIDIgLSAxKSAqIDAuNSArIDAuNTtcbn07XG5lYXNpbmcuYm91bmNlT3V0SW4gPSBfbWFrZU91dEluKGVhc2luZy5ib3VuY2VJbiwgZWFzaW5nLmJvdW5jZU91dCk7XG5cbi8qKlxuICogQG1vZHVsZSBjY1xuICovXG5cbi8qKlxuICogISNlbiBUaGlzIGlzIGEgRWFzaW5nIGluc3RhbmNlLlxuICogISN6aCDov5nmmK/kuIDkuKogRWFzaW5nIOexu+WunuS+i+OAglxuICogQHByb3BlcnR5IGVhc2luZ1xuICogQHR5cGUgRWFzaW5nXG4gKi9cblxuY2MuZWFzaW5nID0gbW9kdWxlLmV4cG9ydHMgPSBlYXNpbmc7XG4iXX0=