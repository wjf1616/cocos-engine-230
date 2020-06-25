
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/animation/animation-curves.js';
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
var bezierByTime = require('./bezier').bezierByTime;

var binarySearch = require('../core/utils/binary-search').binarySearchEpsilon;

var WrapModeMask = require('./types').WrapModeMask;

var WrappedInfo = require('./types').WrappedInfo;
/**
 * Compute a new ratio by curve type
 * @param {Number} ratio - The origin ratio
 * @param {Array|String} type - If it's Array, then ratio will be computed with bezierByTime. If it's string, then ratio will be computed with cc.easing function
 */


function computeRatioByType(ratio, type) {
  if (typeof type === 'string') {
    var func = cc.easing[type];

    if (func) {
      ratio = func(ratio);
    } else {
      cc.errorID(3906, type);
    }
  } else if (Array.isArray(type)) {
    // bezier curve
    ratio = bezierByTime(type, ratio);
  }

  return ratio;
} //
// 动画数据类，相当于 AnimationClip。
// 虽然叫做 AnimCurve，但除了曲线，可以保存任何类型的值。
//
// @class AnimCurve
//
//


var AnimCurve = cc.Class({
  name: 'cc.AnimCurve',
  //
  // @method sample
  // @param {number} time
  // @param {number} ratio - The normalized time specified as a number between 0.0 and 1.0 inclusive.
  // @param {AnimationState} state
  //
  sample: function sample(time, ratio, state) {},
  onTimeChangedManually: undefined
});
/**
 * 当每两帧之前的间隔都一样的时候可以使用此函数快速查找 index
 */

function quickFindIndex(ratios, ratio) {
  var length = ratios.length - 1;
  if (length === 0) return 0;
  var start = ratios[0];
  if (ratio < start) return 0;
  var end = ratios[length];
  if (ratio > end) return ~ratios.length;
  ratio = (ratio - start) / (end - start);
  var eachLength = 1 / length;
  var index = ratio / eachLength;
  var floorIndex = index | 0;
  var EPSILON = 1e-6;

  if (index - floorIndex < EPSILON) {
    return floorIndex;
  } else if (floorIndex + 1 - index < EPSILON) {
    return floorIndex + 1;
  }

  return ~(floorIndex + 1);
} //
//
// @class DynamicAnimCurve
//
// @extends AnimCurve
//


var DynamicAnimCurve = cc.Class({
  name: 'cc.DynamicAnimCurve',
  "extends": AnimCurve,
  ctor: function ctor() {
    // cache last frame index
    this._cachedIndex = 0;
  },
  properties: {
    // The object being animated.
    // @property target
    // @type {object}
    target: null,
    // The name of the property being animated.
    // @property prop
    // @type {string}
    prop: '',
    // The values of the keyframes. (y)
    // @property values
    // @type {any[]}
    values: [],
    // The keyframe ratio of the keyframe specified as a number between 0.0 and 1.0 inclusive. (x)
    // @property ratios
    // @type {number[]}
    ratios: [],
    // @property types
    // @param {object[]}
    // Each array item maybe type:
    // - [x, x, x, x]: Four control points for bezier
    // - null: linear
    types: []
  },
  _findFrameIndex: binarySearch,
  _lerp: undefined,
  _lerpNumber: function _lerpNumber(from, to, t) {
    return from + (to - from) * t;
  },
  _lerpObject: function _lerpObject(from, to, t) {
    return from.lerp(to, t);
  },
  _lerpQuat: function () {
    var out = cc.quat();
    return function (from, to, t) {
      return from.lerp(to, t, out);
    };
  }(),
  _lerpVector: function () {
    var out = cc.v3();
    return function (from, to, t) {
      return from.lerp(to, t, out);
    };
  }(),
  sample: function sample(time, ratio, state) {
    var values = this.values;
    var ratios = this.ratios;
    var frameCount = ratios.length;

    if (frameCount === 0) {
      return;
    } // only need to refind frame index when ratio is out of range of last from ratio and to ratio.


    var shoudRefind = true;
    var cachedIndex = this._cachedIndex;

    if (cachedIndex < 0) {
      cachedIndex = ~cachedIndex;

      if (cachedIndex > 0 && cachedIndex < ratios.length) {
        var _fromRatio = ratios[cachedIndex - 1];
        var _toRatio = ratios[cachedIndex];

        if (ratio > _fromRatio && ratio < _toRatio) {
          shoudRefind = false;
        }
      }
    }

    if (shoudRefind) {
      this._cachedIndex = this._findFrameIndex(ratios, ratio);
    } // evaluate value


    var value;
    var index = this._cachedIndex;

    if (index < 0) {
      index = ~index;

      if (index <= 0) {
        value = values[0];
      } else if (index >= frameCount) {
        value = values[frameCount - 1];
      } else {
        var fromVal = values[index - 1];

        if (!this._lerp) {
          value = fromVal;
        } else {
          var fromRatio = ratios[index - 1];
          var toRatio = ratios[index];
          var type = this.types[index - 1];
          var ratioBetweenFrames = (ratio - fromRatio) / (toRatio - fromRatio);

          if (type) {
            ratioBetweenFrames = computeRatioByType(ratioBetweenFrames, type);
          } // calculate value


          var toVal = values[index];
          value = this._lerp(fromVal, toVal, ratioBetweenFrames);
        }
      }
    } else {
      value = values[index];
    }

    this.target[this.prop] = value;
  }
});
DynamicAnimCurve.Linear = null;

DynamicAnimCurve.Bezier = function (controlPoints) {
  return controlPoints;
};
/**
 * Event information,
 * @class EventInfo
 *
 */


var EventInfo = function EventInfo() {
  this.events = [];
};
/**
 * @param {Function} [func] event function
 * @param {Object[]} [params] event params
 */


EventInfo.prototype.add = function (func, params) {
  this.events.push({
    func: func || '',
    params: params || []
  });
};
/**
 *
 * @class EventAnimCurve
 *
 * @extends AnimCurve
 */


var EventAnimCurve = cc.Class({
  name: 'cc.EventAnimCurve',
  "extends": AnimCurve,
  properties: {
    /**
     * The object being animated.
     * @property target
     * @type {object}
     */
    target: null,

    /** The keyframe ratio of the keyframe specified as a number between 0.0 and 1.0 inclusive. (x)
     * @property ratios
     * @type {number[]}
     */
    ratios: [],

    /**
     * @property events
     * @type {EventInfo[]}
     */
    events: [],
    _wrappedInfo: {
      "default": function _default() {
        return new WrappedInfo();
      }
    },
    _lastWrappedInfo: null,
    _ignoreIndex: NaN
  },
  _wrapIterations: function _wrapIterations(iterations) {
    if (iterations - (iterations | 0) === 0) iterations -= 1;
    return iterations | 0;
  },
  sample: function sample(time, ratio, state) {
    var length = this.ratios.length;
    var currentWrappedInfo = state.getWrappedInfo(state.time, this._wrappedInfo);
    var direction = currentWrappedInfo.direction;
    var currentIndex = binarySearch(this.ratios, currentWrappedInfo.ratio);

    if (currentIndex < 0) {
      currentIndex = ~currentIndex - 1; // if direction is inverse, then increase index

      if (direction < 0) currentIndex += 1;
    }

    if (this._ignoreIndex !== currentIndex) {
      this._ignoreIndex = NaN;
    }

    currentWrappedInfo.frameIndex = currentIndex;

    if (!this._lastWrappedInfo) {
      this._fireEvent(currentIndex);

      this._lastWrappedInfo = new WrappedInfo(currentWrappedInfo);
      return;
    }

    var wrapMode = state.wrapMode;

    var currentIterations = this._wrapIterations(currentWrappedInfo.iterations);

    var lastWrappedInfo = this._lastWrappedInfo;

    var lastIterations = this._wrapIterations(lastWrappedInfo.iterations);

    var lastIndex = lastWrappedInfo.frameIndex;
    var lastDirection = lastWrappedInfo.direction;
    var interationsChanged = lastIterations !== -1 && currentIterations !== lastIterations;

    if (lastIndex === currentIndex && interationsChanged && length === 1) {
      this._fireEvent(0);
    } else if (lastIndex !== currentIndex || interationsChanged) {
      direction = lastDirection;

      do {
        if (lastIndex !== currentIndex) {
          if (direction === -1 && lastIndex === 0 && currentIndex > 0) {
            if ((wrapMode & WrapModeMask.PingPong) === WrapModeMask.PingPong) {
              direction *= -1;
            } else {
              lastIndex = length;
            }

            lastIterations++;
          } else if (direction === 1 && lastIndex === length - 1 && currentIndex < length - 1) {
            if ((wrapMode & WrapModeMask.PingPong) === WrapModeMask.PingPong) {
              direction *= -1;
            } else {
              lastIndex = -1;
            }

            lastIterations++;
          }

          if (lastIndex === currentIndex) break;
          if (lastIterations > currentIterations) break;
        }

        lastIndex += direction;
        cc.director.getAnimationManager().pushDelayEvent(this, '_fireEvent', [lastIndex]);
      } while (lastIndex !== currentIndex && lastIndex > -1 && lastIndex < length);
    }

    this._lastWrappedInfo.set(currentWrappedInfo);
  },
  _fireEvent: function _fireEvent(index) {
    if (index < 0 || index >= this.events.length || this._ignoreIndex === index) return;
    var eventInfo = this.events[index];
    var events = eventInfo.events;

    if (!this.target.isValid) {
      return;
    }

    var components = this.target._components;

    for (var i = 0; i < events.length; i++) {
      var event = events[i];
      var funcName = event.func;

      for (var j = 0; j < components.length; j++) {
        var component = components[j];
        var func = component[funcName];
        if (func) func.apply(component, event.params);
      }
    }
  },
  onTimeChangedManually: function onTimeChangedManually(time, state) {
    this._lastWrappedInfo = null;
    this._ignoreIndex = NaN;
    var info = state.getWrappedInfo(time, this._wrappedInfo);
    var direction = info.direction;
    var frameIndex = binarySearch(this.ratios, info.ratio); // only ignore when time not on a frame index

    if (frameIndex < 0) {
      frameIndex = ~frameIndex - 1; // if direction is inverse, then increase index

      if (direction < 0) frameIndex += 1;
      this._ignoreIndex = frameIndex;
    }
  }
});

if (CC_TEST) {
  cc._Test.DynamicAnimCurve = DynamicAnimCurve;
  cc._Test.EventAnimCurve = EventAnimCurve;
  cc._Test.quickFindIndex = quickFindIndex;
}

module.exports = {
  AnimCurve: AnimCurve,
  DynamicAnimCurve: DynamicAnimCurve,
  EventAnimCurve: EventAnimCurve,
  EventInfo: EventInfo,
  computeRatioByType: computeRatioByType,
  quickFindIndex: quickFindIndex
};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuaW1hdGlvbi1jdXJ2ZXMuanMiXSwibmFtZXMiOlsiYmV6aWVyQnlUaW1lIiwicmVxdWlyZSIsImJpbmFyeVNlYXJjaCIsImJpbmFyeVNlYXJjaEVwc2lsb24iLCJXcmFwTW9kZU1hc2siLCJXcmFwcGVkSW5mbyIsImNvbXB1dGVSYXRpb0J5VHlwZSIsInJhdGlvIiwidHlwZSIsImZ1bmMiLCJjYyIsImVhc2luZyIsImVycm9ySUQiLCJBcnJheSIsImlzQXJyYXkiLCJBbmltQ3VydmUiLCJDbGFzcyIsIm5hbWUiLCJzYW1wbGUiLCJ0aW1lIiwic3RhdGUiLCJvblRpbWVDaGFuZ2VkTWFudWFsbHkiLCJ1bmRlZmluZWQiLCJxdWlja0ZpbmRJbmRleCIsInJhdGlvcyIsImxlbmd0aCIsInN0YXJ0IiwiZW5kIiwiZWFjaExlbmd0aCIsImluZGV4IiwiZmxvb3JJbmRleCIsIkVQU0lMT04iLCJEeW5hbWljQW5pbUN1cnZlIiwiY3RvciIsIl9jYWNoZWRJbmRleCIsInByb3BlcnRpZXMiLCJ0YXJnZXQiLCJwcm9wIiwidmFsdWVzIiwidHlwZXMiLCJfZmluZEZyYW1lSW5kZXgiLCJfbGVycCIsIl9sZXJwTnVtYmVyIiwiZnJvbSIsInRvIiwidCIsIl9sZXJwT2JqZWN0IiwibGVycCIsIl9sZXJwUXVhdCIsIm91dCIsInF1YXQiLCJfbGVycFZlY3RvciIsInYzIiwiZnJhbWVDb3VudCIsInNob3VkUmVmaW5kIiwiY2FjaGVkSW5kZXgiLCJmcm9tUmF0aW8iLCJ0b1JhdGlvIiwidmFsdWUiLCJmcm9tVmFsIiwicmF0aW9CZXR3ZWVuRnJhbWVzIiwidG9WYWwiLCJMaW5lYXIiLCJCZXppZXIiLCJjb250cm9sUG9pbnRzIiwiRXZlbnRJbmZvIiwiZXZlbnRzIiwicHJvdG90eXBlIiwiYWRkIiwicGFyYW1zIiwicHVzaCIsIkV2ZW50QW5pbUN1cnZlIiwiX3dyYXBwZWRJbmZvIiwiX2xhc3RXcmFwcGVkSW5mbyIsIl9pZ25vcmVJbmRleCIsIk5hTiIsIl93cmFwSXRlcmF0aW9ucyIsIml0ZXJhdGlvbnMiLCJjdXJyZW50V3JhcHBlZEluZm8iLCJnZXRXcmFwcGVkSW5mbyIsImRpcmVjdGlvbiIsImN1cnJlbnRJbmRleCIsImZyYW1lSW5kZXgiLCJfZmlyZUV2ZW50Iiwid3JhcE1vZGUiLCJjdXJyZW50SXRlcmF0aW9ucyIsImxhc3RXcmFwcGVkSW5mbyIsImxhc3RJdGVyYXRpb25zIiwibGFzdEluZGV4IiwibGFzdERpcmVjdGlvbiIsImludGVyYXRpb25zQ2hhbmdlZCIsIlBpbmdQb25nIiwiZGlyZWN0b3IiLCJnZXRBbmltYXRpb25NYW5hZ2VyIiwicHVzaERlbGF5RXZlbnQiLCJzZXQiLCJldmVudEluZm8iLCJpc1ZhbGlkIiwiY29tcG9uZW50cyIsIl9jb21wb25lbnRzIiwiaSIsImV2ZW50IiwiZnVuY05hbWUiLCJqIiwiY29tcG9uZW50IiwiYXBwbHkiLCJpbmZvIiwiQ0NfVEVTVCIsIl9UZXN0IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkEsSUFBTUEsWUFBWSxHQUFHQyxPQUFPLENBQUMsVUFBRCxDQUFQLENBQW9CRCxZQUF6Qzs7QUFFQSxJQUFNRSxZQUFZLEdBQUdELE9BQU8sQ0FBQyw2QkFBRCxDQUFQLENBQXVDRSxtQkFBNUQ7O0FBQ0EsSUFBTUMsWUFBWSxHQUFHSCxPQUFPLENBQUMsU0FBRCxDQUFQLENBQW1CRyxZQUF4Qzs7QUFDQSxJQUFNQyxXQUFXLEdBQUdKLE9BQU8sQ0FBQyxTQUFELENBQVAsQ0FBbUJJLFdBQXZDO0FBRUE7Ozs7Ozs7QUFLQSxTQUFTQyxrQkFBVCxDQUE2QkMsS0FBN0IsRUFBb0NDLElBQXBDLEVBQTBDO0FBQ3RDLE1BQUksT0FBT0EsSUFBUCxLQUFnQixRQUFwQixFQUE4QjtBQUMxQixRQUFJQyxJQUFJLEdBQUdDLEVBQUUsQ0FBQ0MsTUFBSCxDQUFVSCxJQUFWLENBQVg7O0FBQ0EsUUFBSUMsSUFBSixFQUFVO0FBQ05GLE1B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LGNBQVQsR0FBMEJBLGNBQTFCO0FBQ0E3RCxFQUFBQSxFQUFFLENBQUNrRyxLQUFILENBQVNyRixjQUFULEdBQTBCQSxjQUExQjtBQUNIOztBQUVEc0YsTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQ2IvRixFQUFBQSxTQUFTLEVBQUVBLFNBREU7QUFFYmlCLEVBQUFBLGdCQUFnQixFQUFFQSxnQkFGTDtBQUdidUMsRUFBQUEsY0FBYyxFQUFFQSxjQUhIO0FBSWJOLEVBQUFBLFNBQVMsRUFBRUEsU0FKRTtBQUtiM0QsRUFBQUEsa0JBQWtCLEVBQUVBLGtCQUxQO0FBTWJpQixFQUFBQSxjQUFjLEVBQUVBO0FBTkgsQ0FBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbmNvbnN0IGJlemllckJ5VGltZSA9IHJlcXVpcmUoJy4vYmV6aWVyJykuYmV6aWVyQnlUaW1lO1xuXG5jb25zdCBiaW5hcnlTZWFyY2ggPSByZXF1aXJlKCcuLi9jb3JlL3V0aWxzL2JpbmFyeS1zZWFyY2gnKS5iaW5hcnlTZWFyY2hFcHNpbG9uO1xuY29uc3QgV3JhcE1vZGVNYXNrID0gcmVxdWlyZSgnLi90eXBlcycpLldyYXBNb2RlTWFzaztcbmNvbnN0IFdyYXBwZWRJbmZvID0gcmVxdWlyZSgnLi90eXBlcycpLldyYXBwZWRJbmZvO1xuXG4vKipcbiAqIENvbXB1dGUgYSBuZXcgcmF0aW8gYnkgY3VydmUgdHlwZVxuICogQHBhcmFtIHtOdW1iZXJ9IHJhdGlvIC0gVGhlIG9yaWdpbiByYXRpb1xuICogQHBhcmFtIHtBcnJheXxTdHJpbmd9IHR5cGUgLSBJZiBpdCdzIEFycmF5LCB0aGVuIHJhdGlvIHdpbGwgYmUgY29tcHV0ZWQgd2l0aCBiZXppZXJCeVRpbWUuIElmIGl0J3Mgc3RyaW5nLCB0aGVuIHJhdGlvIHdpbGwgYmUgY29tcHV0ZWQgd2l0aCBjYy5lYXNpbmcgZnVuY3Rpb25cbiAqL1xuZnVuY3Rpb24gY29tcHV0ZVJhdGlvQnlUeXBlIChyYXRpbywgdHlwZSkge1xuICAgIGlmICh0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdmFyIGZ1bmMgPSBjYy5lYXNpbmdbdHlwZV07XG4gICAgICAgIGlmIChmdW5jKSB7XG4gICAgICAgICAgICByYXRpbyA9IGZ1bmMocmF0aW8pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgzOTA2LCB0eXBlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KHR5cGUpKSB7XG4gICAgICAgIC8vIGJlemllciBjdXJ2ZVxuICAgICAgICByYXRpbyA9IGJlemllckJ5VGltZSh0eXBlLCByYXRpbyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJhdGlvO1xufVxuXG4vL1xuLy8g5Yqo55S75pWw5o2u57G777yM55u45b2T5LqOIEFuaW1hdGlvbkNsaXDjgIJcbi8vIOiZveeEtuWPq+WBmiBBbmltQ3VydmXvvIzkvYbpmaTkuobmm7Lnur/vvIzlj6/ku6Xkv53lrZjku7vkvZXnsbvlnovnmoTlgLzjgIJcbi8vXG4vLyBAY2xhc3MgQW5pbUN1cnZlXG4vL1xuLy9cbnZhciBBbmltQ3VydmUgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLkFuaW1DdXJ2ZScsXG5cbiAgICAvL1xuICAgIC8vIEBtZXRob2Qgc2FtcGxlXG4gICAgLy8gQHBhcmFtIHtudW1iZXJ9IHRpbWVcbiAgICAvLyBAcGFyYW0ge251bWJlcn0gcmF0aW8gLSBUaGUgbm9ybWFsaXplZCB0aW1lIHNwZWNpZmllZCBhcyBhIG51bWJlciBiZXR3ZWVuIDAuMCBhbmQgMS4wIGluY2x1c2l2ZS5cbiAgICAvLyBAcGFyYW0ge0FuaW1hdGlvblN0YXRlfSBzdGF0ZVxuICAgIC8vXG4gICAgc2FtcGxlOiBmdW5jdGlvbiAodGltZSwgcmF0aW8sIHN0YXRlKSB7fSxcblxuICAgIG9uVGltZUNoYW5nZWRNYW51YWxseTogdW5kZWZpbmVkXG59KTtcblxuLyoqXG4gKiDlvZPmr4/kuKTluKfkuYvliY3nmoTpl7TpmpTpg73kuIDmoLfnmoTml7blgJnlj6/ku6Xkvb/nlKjmraTlh73mlbDlv6vpgJ/mn6Xmib4gaW5kZXhcbiAqL1xuZnVuY3Rpb24gcXVpY2tGaW5kSW5kZXggKHJhdGlvcywgcmF0aW8pIHtcbiAgICB2YXIgbGVuZ3RoID0gcmF0aW9zLmxlbmd0aCAtIDE7XG5cbiAgICBpZiAobGVuZ3RoID09PSAwKSByZXR1cm4gMDtcblxuICAgIHZhciBzdGFydCA9IHJhdGlvc1swXTtcbiAgICBpZiAocmF0aW8gPCBzdGFydCkgcmV0dXJuIDA7XG5cbiAgICB2YXIgZW5kID0gcmF0aW9zW2xlbmd0aF07XG4gICAgaWYgKHJhdGlvID4gZW5kKSByZXR1cm4gfnJhdGlvcy5sZW5ndGg7XG5cbiAgICByYXRpbyA9IChyYXRpbyAtIHN0YXJ0KSAvIChlbmQgLSBzdGFydCk7XG5cbiAgICB2YXIgZWFjaExlbmd0aCA9IDEgLyBsZW5ndGg7XG4gICAgdmFyIGluZGV4ID0gcmF0aW8gLyBlYWNoTGVuZ3RoO1xuICAgIHZhciBmbG9vckluZGV4ID0gaW5kZXggfCAwO1xuICAgIHZhciBFUFNJTE9OID0gMWUtNjtcblxuICAgIGlmICgoaW5kZXggLSBmbG9vckluZGV4KSA8IEVQU0lMT04pIHtcbiAgICAgICAgcmV0dXJuIGZsb29ySW5kZXg7XG4gICAgfVxuICAgIGVsc2UgaWYgKChmbG9vckluZGV4ICsgMSAtIGluZGV4KSA8IEVQU0lMT04pIHtcbiAgICAgICAgcmV0dXJuIGZsb29ySW5kZXggKyAxO1xuICAgIH1cblxuICAgIHJldHVybiB+KGZsb29ySW5kZXggKyAxKTtcbn1cblxuLy9cbi8vXG4vLyBAY2xhc3MgRHluYW1pY0FuaW1DdXJ2ZVxuLy9cbi8vIEBleHRlbmRzIEFuaW1DdXJ2ZVxuLy9cbnZhciBEeW5hbWljQW5pbUN1cnZlID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5EeW5hbWljQW5pbUN1cnZlJyxcbiAgICBleHRlbmRzOiBBbmltQ3VydmUsXG5cbiAgICBjdG9yICgpIHtcbiAgICAgICAgLy8gY2FjaGUgbGFzdCBmcmFtZSBpbmRleFxuICAgICAgICB0aGlzLl9jYWNoZWRJbmRleCA9IDA7XG4gICAgfSxcblxuICAgIHByb3BlcnRpZXM6IHtcblxuICAgICAgICAvLyBUaGUgb2JqZWN0IGJlaW5nIGFuaW1hdGVkLlxuICAgICAgICAvLyBAcHJvcGVydHkgdGFyZ2V0XG4gICAgICAgIC8vIEB0eXBlIHtvYmplY3R9XG4gICAgICAgIHRhcmdldDogbnVsbCxcblxuICAgICAgICAvLyBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgYmVpbmcgYW5pbWF0ZWQuXG4gICAgICAgIC8vIEBwcm9wZXJ0eSBwcm9wXG4gICAgICAgIC8vIEB0eXBlIHtzdHJpbmd9XG4gICAgICAgIHByb3A6ICcnLFxuXG4gICAgICAgIC8vIFRoZSB2YWx1ZXMgb2YgdGhlIGtleWZyYW1lcy4gKHkpXG4gICAgICAgIC8vIEBwcm9wZXJ0eSB2YWx1ZXNcbiAgICAgICAgLy8gQHR5cGUge2FueVtdfVxuICAgICAgICB2YWx1ZXM6IFtdLFxuXG4gICAgICAgIC8vIFRoZSBrZXlmcmFtZSByYXRpbyBvZiB0aGUga2V5ZnJhbWUgc3BlY2lmaWVkIGFzIGEgbnVtYmVyIGJldHdlZW4gMC4wIGFuZCAxLjAgaW5jbHVzaXZlLiAoeClcbiAgICAgICAgLy8gQHByb3BlcnR5IHJhdGlvc1xuICAgICAgICAvLyBAdHlwZSB7bnVtYmVyW119XG4gICAgICAgIHJhdGlvczogW10sXG5cbiAgICAgICAgLy8gQHByb3BlcnR5IHR5cGVzXG4gICAgICAgIC8vIEBwYXJhbSB7b2JqZWN0W119XG4gICAgICAgIC8vIEVhY2ggYXJyYXkgaXRlbSBtYXliZSB0eXBlOlxuICAgICAgICAvLyAtIFt4LCB4LCB4LCB4XTogRm91ciBjb250cm9sIHBvaW50cyBmb3IgYmV6aWVyXG4gICAgICAgIC8vIC0gbnVsbDogbGluZWFyXG4gICAgICAgIHR5cGVzOiBbXSxcbiAgICB9LFxuXG4gICAgX2ZpbmRGcmFtZUluZGV4OiBiaW5hcnlTZWFyY2gsXG4gICAgX2xlcnA6IHVuZGVmaW5lZCxcblxuICAgIF9sZXJwTnVtYmVyIChmcm9tLCB0bywgdCkge1xuICAgICAgICByZXR1cm4gZnJvbSArICh0byAtIGZyb20pICogdDtcbiAgICB9LFxuXG4gICAgX2xlcnBPYmplY3QgKGZyb20sIHRvLCB0KSB7XG4gICAgICAgIHJldHVybiBmcm9tLmxlcnAodG8sIHQpO1xuICAgIH0sXG5cbiAgICBfbGVycFF1YXQ6IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBvdXQgPSBjYy5xdWF0KCk7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZnJvbSwgdG8sIHQpIHtcbiAgICAgICAgICAgIHJldHVybiBmcm9tLmxlcnAodG8sIHQsIG91dCk7XG4gICAgICAgIH07XG4gICAgfSkoKSxcblxuICAgIF9sZXJwVmVjdG9yOiAoZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgb3V0ID0gY2MudjMoKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmcm9tLCB0bywgdCkge1xuICAgICAgICAgICAgcmV0dXJuIGZyb20ubGVycCh0bywgdCwgb3V0KTtcbiAgICAgICAgfTtcbiAgICB9KSgpLFxuXG4gICAgc2FtcGxlICh0aW1lLCByYXRpbywgc3RhdGUpIHtcbiAgICAgICAgbGV0IHZhbHVlcyA9IHRoaXMudmFsdWVzO1xuICAgICAgICBsZXQgcmF0aW9zID0gdGhpcy5yYXRpb3M7XG4gICAgICAgIGxldCBmcmFtZUNvdW50ID0gcmF0aW9zLmxlbmd0aDtcblxuICAgICAgICBpZiAoZnJhbWVDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gb25seSBuZWVkIHRvIHJlZmluZCBmcmFtZSBpbmRleCB3aGVuIHJhdGlvIGlzIG91dCBvZiByYW5nZSBvZiBsYXN0IGZyb20gcmF0aW8gYW5kIHRvIHJhdGlvLlxuICAgICAgICBsZXQgc2hvdWRSZWZpbmQgPSB0cnVlO1xuICAgICAgICBsZXQgY2FjaGVkSW5kZXggPSB0aGlzLl9jYWNoZWRJbmRleDtcbiAgICAgICAgaWYgKGNhY2hlZEluZGV4IDwgMCkge1xuICAgICAgICAgICAgY2FjaGVkSW5kZXggPSB+Y2FjaGVkSW5kZXg7XG4gICAgICAgICAgICBpZiAoY2FjaGVkSW5kZXggPiAwICYmIGNhY2hlZEluZGV4IDwgcmF0aW9zLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGxldCBmcm9tUmF0aW8gPSByYXRpb3NbY2FjaGVkSW5kZXggLSAxXTtcbiAgICAgICAgICAgICAgICBsZXQgdG9SYXRpbyA9IHJhdGlvc1tjYWNoZWRJbmRleF07XG4gICAgICAgICAgICAgICAgaWYgKHJhdGlvID4gZnJvbVJhdGlvICYmIHJhdGlvIDwgdG9SYXRpbykge1xuICAgICAgICAgICAgICAgICAgICBzaG91ZFJlZmluZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaG91ZFJlZmluZCkge1xuICAgICAgICAgICAgdGhpcy5fY2FjaGVkSW5kZXggPSB0aGlzLl9maW5kRnJhbWVJbmRleChyYXRpb3MsIHJhdGlvKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGV2YWx1YXRlIHZhbHVlXG4gICAgICAgIGxldCB2YWx1ZTtcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5fY2FjaGVkSW5kZXg7XG4gICAgICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgICAgIGluZGV4ID0gfmluZGV4O1xuXG4gICAgICAgICAgICBpZiAoaW5kZXggPD0gMCkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWVzWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaW5kZXggPj0gZnJhbWVDb3VudCkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWVzW2ZyYW1lQ291bnQgLSAxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBmcm9tVmFsID0gdmFsdWVzW2luZGV4IC0gMV07XG5cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2xlcnApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBmcm9tVmFsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZyb21SYXRpbyA9IHJhdGlvc1tpbmRleCAtIDFdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdG9SYXRpbyA9IHJhdGlvc1tpbmRleF07XG4gICAgICAgICAgICAgICAgICAgIHZhciB0eXBlID0gdGhpcy50eXBlc1tpbmRleCAtIDFdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmF0aW9CZXR3ZWVuRnJhbWVzID0gKHJhdGlvIC0gZnJvbVJhdGlvKSAvICh0b1JhdGlvIC0gZnJvbVJhdGlvKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmF0aW9CZXR3ZWVuRnJhbWVzID0gY29tcHV0ZVJhdGlvQnlUeXBlKHJhdGlvQmV0d2VlbkZyYW1lcywgdHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRvVmFsID0gdmFsdWVzW2luZGV4XTtcblxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMuX2xlcnAoZnJvbVZhbCwgdG9WYWwsIHJhdGlvQmV0d2VlbkZyYW1lcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZXNbaW5kZXhdO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50YXJnZXRbdGhpcy5wcm9wXSA9IHZhbHVlO1xuICAgIH1cbn0pO1xuXG5EeW5hbWljQW5pbUN1cnZlLkxpbmVhciA9IG51bGw7XG5EeW5hbWljQW5pbUN1cnZlLkJlemllciA9IGZ1bmN0aW9uIChjb250cm9sUG9pbnRzKSB7XG4gICAgcmV0dXJuIGNvbnRyb2xQb2ludHM7XG59O1xuXG5cbi8qKlxuICogRXZlbnQgaW5mb3JtYXRpb24sXG4gKiBAY2xhc3MgRXZlbnRJbmZvXG4gKlxuICovXG52YXIgRXZlbnRJbmZvID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZXZlbnRzID0gW107XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtmdW5jXSBldmVudCBmdW5jdGlvblxuICogQHBhcmFtIHtPYmplY3RbXX0gW3BhcmFtc10gZXZlbnQgcGFyYW1zXG4gKi9cbkV2ZW50SW5mby5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGZ1bmMsIHBhcmFtcykge1xuICAgIHRoaXMuZXZlbnRzLnB1c2goe1xuICAgICAgICBmdW5jOiBmdW5jIHx8ICcnLFxuICAgICAgICBwYXJhbXM6IHBhcmFtcyB8fCBbXVxuICAgIH0pO1xufTtcblxuXG4vKipcbiAqXG4gKiBAY2xhc3MgRXZlbnRBbmltQ3VydmVcbiAqXG4gKiBAZXh0ZW5kcyBBbmltQ3VydmVcbiAqL1xudmFyIEV2ZW50QW5pbUN1cnZlID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5FdmVudEFuaW1DdXJ2ZScsXG4gICAgZXh0ZW5kczogQW5pbUN1cnZlLFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIG9iamVjdCBiZWluZyBhbmltYXRlZC5cbiAgICAgICAgICogQHByb3BlcnR5IHRhcmdldFxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdGFyZ2V0OiBudWxsLFxuXG4gICAgICAgIC8qKiBUaGUga2V5ZnJhbWUgcmF0aW8gb2YgdGhlIGtleWZyYW1lIHNwZWNpZmllZCBhcyBhIG51bWJlciBiZXR3ZWVuIDAuMCBhbmQgMS4wIGluY2x1c2l2ZS4gKHgpXG4gICAgICAgICAqIEBwcm9wZXJ0eSByYXRpb3NcbiAgICAgICAgICogQHR5cGUge251bWJlcltdfVxuICAgICAgICAgKi9cbiAgICAgICAgcmF0aW9zOiBbXSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHByb3BlcnR5IGV2ZW50c1xuICAgICAgICAgKiBAdHlwZSB7RXZlbnRJbmZvW119XG4gICAgICAgICAqL1xuICAgICAgICBldmVudHM6IFtdLFxuXG4gICAgICAgIF93cmFwcGVkSW5mbzoge1xuICAgICAgICAgICAgZGVmYXVsdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgV3JhcHBlZEluZm8oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfbGFzdFdyYXBwZWRJbmZvOiBudWxsLFxuXG4gICAgICAgIF9pZ25vcmVJbmRleDogTmFOXG4gICAgfSxcblxuICAgIF93cmFwSXRlcmF0aW9uczogZnVuY3Rpb24gKGl0ZXJhdGlvbnMpIHtcbiAgICAgICAgaWYgKGl0ZXJhdGlvbnMgLSAoaXRlcmF0aW9ucyB8IDApID09PSAwKSBpdGVyYXRpb25zIC09IDE7XG4gICAgICAgIHJldHVybiBpdGVyYXRpb25zIHwgMDtcbiAgICB9LFxuXG4gICAgc2FtcGxlOiBmdW5jdGlvbiAodGltZSwgcmF0aW8sIHN0YXRlKSB7XG4gICAgICAgIHZhciBsZW5ndGggPSB0aGlzLnJhdGlvcy5sZW5ndGg7XG5cbiAgICAgICAgdmFyIGN1cnJlbnRXcmFwcGVkSW5mbyA9IHN0YXRlLmdldFdyYXBwZWRJbmZvKHN0YXRlLnRpbWUsIHRoaXMuX3dyYXBwZWRJbmZvKTtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IGN1cnJlbnRXcmFwcGVkSW5mby5kaXJlY3Rpb247XG4gICAgICAgIHZhciBjdXJyZW50SW5kZXggPSBiaW5hcnlTZWFyY2godGhpcy5yYXRpb3MsIGN1cnJlbnRXcmFwcGVkSW5mby5yYXRpbyk7XG4gICAgICAgIGlmIChjdXJyZW50SW5kZXggPCAwKSB7XG4gICAgICAgICAgICBjdXJyZW50SW5kZXggPSB+Y3VycmVudEluZGV4IC0gMTtcblxuICAgICAgICAgICAgLy8gaWYgZGlyZWN0aW9uIGlzIGludmVyc2UsIHRoZW4gaW5jcmVhc2UgaW5kZXhcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPCAwKSBjdXJyZW50SW5kZXggKz0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9pZ25vcmVJbmRleCAhPT0gY3VycmVudEluZGV4KSB7XG4gICAgICAgICAgICB0aGlzLl9pZ25vcmVJbmRleCA9IE5hTjtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnRXcmFwcGVkSW5mby5mcmFtZUluZGV4ID0gY3VycmVudEluZGV4O1xuXG4gICAgICAgIGlmICghdGhpcy5fbGFzdFdyYXBwZWRJbmZvKSB7XG4gICAgICAgICAgICB0aGlzLl9maXJlRXZlbnQoY3VycmVudEluZGV4KTtcbiAgICAgICAgICAgIHRoaXMuX2xhc3RXcmFwcGVkSW5mbyA9IG5ldyBXcmFwcGVkSW5mbyhjdXJyZW50V3JhcHBlZEluZm8pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHdyYXBNb2RlID0gc3RhdGUud3JhcE1vZGU7XG4gICAgICAgIHZhciBjdXJyZW50SXRlcmF0aW9ucyA9IHRoaXMuX3dyYXBJdGVyYXRpb25zKGN1cnJlbnRXcmFwcGVkSW5mby5pdGVyYXRpb25zKTtcblxuICAgICAgICB2YXIgbGFzdFdyYXBwZWRJbmZvID0gdGhpcy5fbGFzdFdyYXBwZWRJbmZvO1xuICAgICAgICB2YXIgbGFzdEl0ZXJhdGlvbnMgPSB0aGlzLl93cmFwSXRlcmF0aW9ucyhsYXN0V3JhcHBlZEluZm8uaXRlcmF0aW9ucyk7XG4gICAgICAgIHZhciBsYXN0SW5kZXggPSBsYXN0V3JhcHBlZEluZm8uZnJhbWVJbmRleDtcbiAgICAgICAgdmFyIGxhc3REaXJlY3Rpb24gPSBsYXN0V3JhcHBlZEluZm8uZGlyZWN0aW9uO1xuXG4gICAgICAgIHZhciBpbnRlcmF0aW9uc0NoYW5nZWQgPSBsYXN0SXRlcmF0aW9ucyAhPT0gLTEgJiYgY3VycmVudEl0ZXJhdGlvbnMgIT09IGxhc3RJdGVyYXRpb25zO1xuXG4gICAgICAgIGlmIChsYXN0SW5kZXggPT09IGN1cnJlbnRJbmRleCAmJiBpbnRlcmF0aW9uc0NoYW5nZWQgJiYgbGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICB0aGlzLl9maXJlRXZlbnQoMCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobGFzdEluZGV4ICE9PSBjdXJyZW50SW5kZXggfHwgaW50ZXJhdGlvbnNDaGFuZ2VkKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb24gPSBsYXN0RGlyZWN0aW9uO1xuXG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgaWYgKGxhc3RJbmRleCAhPT0gY3VycmVudEluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09IC0xICYmIGxhc3RJbmRleCA9PT0gMCAmJiBjdXJyZW50SW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKHdyYXBNb2RlICYgV3JhcE1vZGVNYXNrLlBpbmdQb25nKSA9PT0gV3JhcE1vZGVNYXNrLlBpbmdQb25nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uICo9IC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdEluZGV4ID0gbGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0SXRlcmF0aW9ucyArKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChkaXJlY3Rpb24gPT09IDEgJiYgbGFzdEluZGV4ID09PSBsZW5ndGggLSAxICYmIGN1cnJlbnRJbmRleCA8IGxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgod3JhcE1vZGUgJiBXcmFwTW9kZU1hc2suUGluZ1BvbmcpID09PSBXcmFwTW9kZU1hc2suUGluZ1BvbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb24gKj0gLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0SW5kZXggPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdEl0ZXJhdGlvbnMgKys7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdEluZGV4ID09PSBjdXJyZW50SW5kZXgpIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdEl0ZXJhdGlvbnMgPiBjdXJyZW50SXRlcmF0aW9ucykgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGFzdEluZGV4ICs9IGRpcmVjdGlvbjtcblxuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmdldEFuaW1hdGlvbk1hbmFnZXIoKS5wdXNoRGVsYXlFdmVudCh0aGlzLCAnX2ZpcmVFdmVudCcsIFtsYXN0SW5kZXhdKTtcbiAgICAgICAgICAgIH0gd2hpbGUgKGxhc3RJbmRleCAhPT0gY3VycmVudEluZGV4ICYmIGxhc3RJbmRleCA+IC0xICYmIGxhc3RJbmRleCA8IGxlbmd0aCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sYXN0V3JhcHBlZEluZm8uc2V0KGN1cnJlbnRXcmFwcGVkSW5mbyk7XG4gICAgfSxcblxuICAgIF9maXJlRXZlbnQ6IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMuZXZlbnRzLmxlbmd0aCB8fCB0aGlzLl9pZ25vcmVJbmRleCA9PT0gaW5kZXgpIHJldHVybjtcblxuICAgICAgICB2YXIgZXZlbnRJbmZvID0gdGhpcy5ldmVudHNbaW5kZXhdO1xuICAgICAgICB2YXIgZXZlbnRzID0gZXZlbnRJbmZvLmV2ZW50cztcbiAgICAgICAgXG4gICAgICAgIGlmICggIXRoaXMudGFyZ2V0LmlzVmFsaWQgKSB7IFxuICAgICAgICAgICAgcmV0dXJuOyBcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdmFyIGNvbXBvbmVudHMgPSB0aGlzLnRhcmdldC5fY29tcG9uZW50cztcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgIGkgPCBldmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBldmVudCA9IGV2ZW50c1tpXTtcbiAgICAgICAgICAgIHZhciBmdW5jTmFtZSA9IGV2ZW50LmZ1bmM7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY29tcG9uZW50cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIHZhciBjb21wb25lbnQgPSBjb21wb25lbnRzW2pdO1xuICAgICAgICAgICAgICAgIHZhciBmdW5jID0gY29tcG9uZW50W2Z1bmNOYW1lXTtcblxuICAgICAgICAgICAgICAgIGlmIChmdW5jKSBmdW5jLmFwcGx5KGNvbXBvbmVudCwgZXZlbnQucGFyYW1zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvblRpbWVDaGFuZ2VkTWFudWFsbHk6IGZ1bmN0aW9uICh0aW1lLCBzdGF0ZSkge1xuICAgICAgICB0aGlzLl9sYXN0V3JhcHBlZEluZm8gPSBudWxsO1xuICAgICAgICB0aGlzLl9pZ25vcmVJbmRleCA9IE5hTjtcblxuICAgICAgICB2YXIgaW5mbyA9IHN0YXRlLmdldFdyYXBwZWRJbmZvKHRpbWUsIHRoaXMuX3dyYXBwZWRJbmZvKTtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IGluZm8uZGlyZWN0aW9uO1xuICAgICAgICB2YXIgZnJhbWVJbmRleCA9IGJpbmFyeVNlYXJjaCh0aGlzLnJhdGlvcywgaW5mby5yYXRpbyk7XG5cbiAgICAgICAgLy8gb25seSBpZ25vcmUgd2hlbiB0aW1lIG5vdCBvbiBhIGZyYW1lIGluZGV4XG4gICAgICAgIGlmIChmcmFtZUluZGV4IDwgMCkge1xuICAgICAgICAgICAgZnJhbWVJbmRleCA9IH5mcmFtZUluZGV4IC0gMTtcblxuICAgICAgICAgICAgLy8gaWYgZGlyZWN0aW9uIGlzIGludmVyc2UsIHRoZW4gaW5jcmVhc2UgaW5kZXhcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPCAwKSBmcmFtZUluZGV4ICs9IDE7XG5cbiAgICAgICAgICAgIHRoaXMuX2lnbm9yZUluZGV4ID0gZnJhbWVJbmRleDtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5cbmlmIChDQ19URVNUKSB7XG4gICAgY2MuX1Rlc3QuRHluYW1pY0FuaW1DdXJ2ZSA9IER5bmFtaWNBbmltQ3VydmU7XG4gICAgY2MuX1Rlc3QuRXZlbnRBbmltQ3VydmUgPSBFdmVudEFuaW1DdXJ2ZTtcbiAgICBjYy5fVGVzdC5xdWlja0ZpbmRJbmRleCA9IHF1aWNrRmluZEluZGV4O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBBbmltQ3VydmU6IEFuaW1DdXJ2ZSxcbiAgICBEeW5hbWljQW5pbUN1cnZlOiBEeW5hbWljQW5pbUN1cnZlLFxuICAgIEV2ZW50QW5pbUN1cnZlOiBFdmVudEFuaW1DdXJ2ZSxcbiAgICBFdmVudEluZm86IEV2ZW50SW5mbyxcbiAgICBjb21wdXRlUmF0aW9CeVR5cGU6IGNvbXB1dGVSYXRpb0J5VHlwZSxcbiAgICBxdWlja0ZpbmRJbmRleDogcXVpY2tGaW5kSW5kZXhcbn07XG4iXX0=