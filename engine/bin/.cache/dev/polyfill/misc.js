
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/polyfill/misc.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

if (!Math.sign) {
  Math.sign = function (x) {
    x = +x; // convert to a number

    if (x === 0 || isNaN(x)) {
      return x;
    }

    return x > 0 ? 1 : -1;
  };
}

if (!Math.log2) {
  Math.log2 = function (x) {
    return Math.log(x) * Math.LOG2E;
  };
}

if (!Number.isInteger) {
  Number.isInteger = function (value) {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
  };
}

if (CC_JSB || CC_RUNTIME || !console.time) {
  var Timer = window.performance || Date;

  var _timerTable = Object.create(null);

  console.time = function (label) {
    _timerTable[label] = Timer.now();
  };

  console.timeEnd = function (label) {
    var startTime = _timerTable[label];
    var duration = Timer.now() - startTime;
    console.log(label + ": " + duration + "ms");
  };
}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1pc2MuanMiXSwibmFtZXMiOlsiTWF0aCIsInNpZ24iLCJ4IiwiaXNOYU4iLCJsb2cyIiwibG9nIiwiTE9HMkUiLCJOdW1iZXIiLCJpc0ludGVnZXIiLCJ2YWx1ZSIsImlzRmluaXRlIiwiZmxvb3IiLCJDQ19KU0IiLCJDQ19SVU5USU1FIiwiY29uc29sZSIsInRpbWUiLCJUaW1lciIsIndpbmRvdyIsInBlcmZvcm1hbmNlIiwiRGF0ZSIsIl90aW1lclRhYmxlIiwiT2JqZWN0IiwiY3JlYXRlIiwibGFiZWwiLCJub3ciLCJ0aW1lRW5kIiwic3RhcnRUaW1lIiwiZHVyYXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJLENBQUNBLElBQUksQ0FBQ0MsSUFBVixFQUFnQjtBQUNaRCxFQUFBQSxJQUFJLENBQUNDLElBQUwsR0FBWSxVQUFVQyxDQUFWLEVBQWE7QUFDckJBLElBQUFBLENBQUMsR0FBRyxDQUFDQSxDQUFMLENBRHFCLENBQ2I7O0FBQ1IsUUFBSUEsQ0FBQyxLQUFLLENBQU4sSUFBV0MsS0FBSyxDQUFDRCxDQUFELENBQXBCLEVBQXlCO0FBQ3JCLGFBQU9BLENBQVA7QUFDSDs7QUFDRCxXQUFPQSxDQUFDLEdBQUcsQ0FBSixHQUFRLENBQVIsR0FBWSxDQUFDLENBQXBCO0FBQ0gsR0FORDtBQU9IOztBQUVELElBQUksQ0FBQ0YsSUFBSSxDQUFDSSxJQUFWLEVBQWdCO0FBQ1pKLEVBQUFBLElBQUksQ0FBQ0ksSUFBTCxHQUFZLFVBQVVGLENBQVYsRUFBYTtBQUNyQixXQUFPRixJQUFJLENBQUNLLEdBQUwsQ0FBU0gsQ0FBVCxJQUFjRixJQUFJLENBQUNNLEtBQTFCO0FBQ0gsR0FGRDtBQUdIOztBQUVELElBQUksQ0FBQ0MsTUFBTSxDQUFDQyxTQUFaLEVBQXVCO0FBQ25CRCxFQUFBQSxNQUFNLENBQUNDLFNBQVAsR0FBbUIsVUFBVUMsS0FBVixFQUFpQjtBQUNoQyxXQUFPLE9BQU9BLEtBQVAsS0FBaUIsUUFBakIsSUFBNkJDLFFBQVEsQ0FBQ0QsS0FBRCxDQUFyQyxJQUFnRFQsSUFBSSxDQUFDVyxLQUFMLENBQVdGLEtBQVgsTUFBc0JBLEtBQTdFO0FBQ0gsR0FGRDtBQUdIOztBQUVELElBQUlHLE1BQU0sSUFBSUMsVUFBVixJQUF3QixDQUFDQyxPQUFPLENBQUNDLElBQXJDLEVBQTJDO0FBQ3ZDLE1BQUlDLEtBQUssR0FBR0MsTUFBTSxDQUFDQyxXQUFQLElBQXNCQyxJQUFsQzs7QUFDQSxNQUFJQyxXQUFXLEdBQUdDLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLElBQWQsQ0FBbEI7O0FBQ0FSLEVBQUFBLE9BQU8sQ0FBQ0MsSUFBUixHQUFlLFVBQVVRLEtBQVYsRUFBaUI7QUFDNUJILElBQUFBLFdBQVcsQ0FBQ0csS0FBRCxDQUFYLEdBQXFCUCxLQUFLLENBQUNRLEdBQU4sRUFBckI7QUFDSCxHQUZEOztBQUdBVixFQUFBQSxPQUFPLENBQUNXLE9BQVIsR0FBa0IsVUFBVUYsS0FBVixFQUFpQjtBQUMvQixRQUFJRyxTQUFTLEdBQUdOLFdBQVcsQ0FBQ0csS0FBRCxDQUEzQjtBQUNBLFFBQUlJLFFBQVEsR0FBR1gsS0FBSyxDQUFDUSxHQUFOLEtBQWNFLFNBQTdCO0FBQ0FaLElBQUFBLE9BQU8sQ0FBQ1QsR0FBUixDQUFla0IsS0FBZixVQUF5QkksUUFBekI7QUFDSCxHQUpEO0FBS0giLCJzb3VyY2VzQ29udGVudCI6WyJpZiAoIU1hdGguc2lnbikge1xuICAgIE1hdGguc2lnbiA9IGZ1bmN0aW9uICh4KSB7XG4gICAgICAgIHggPSAreDsgLy8gY29udmVydCB0byBhIG51bWJlclxuICAgICAgICBpZiAoeCA9PT0gMCB8fCBpc05hTih4KSkge1xuICAgICAgICAgICAgcmV0dXJuIHg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHggPiAwID8gMSA6IC0xO1xuICAgIH07XG59XG5cbmlmICghTWF0aC5sb2cyKSB7XG4gICAgTWF0aC5sb2cyID0gZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgubG9nKHgpICogTWF0aC5MT0cyRTtcbiAgICB9O1xufVxuXG5pZiAoIU51bWJlci5pc0ludGVnZXIpIHtcbiAgICBOdW1iZXIuaXNJbnRlZ2VyID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGlzRmluaXRlKHZhbHVlKSAmJiBNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWU7XG4gICAgfTtcbn1cblxuaWYgKENDX0pTQiB8fCBDQ19SVU5USU1FIHx8ICFjb25zb2xlLnRpbWUpIHtcbiAgICB2YXIgVGltZXIgPSB3aW5kb3cucGVyZm9ybWFuY2UgfHwgRGF0ZTtcbiAgICB2YXIgX3RpbWVyVGFibGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIGNvbnNvbGUudGltZSA9IGZ1bmN0aW9uIChsYWJlbCkge1xuICAgICAgICBfdGltZXJUYWJsZVtsYWJlbF0gPSBUaW1lci5ub3coKTtcbiAgICB9O1xuICAgIGNvbnNvbGUudGltZUVuZCA9IGZ1bmN0aW9uIChsYWJlbCkge1xuICAgICAgICB2YXIgc3RhcnRUaW1lID0gX3RpbWVyVGFibGVbbGFiZWxdO1xuICAgICAgICB2YXIgZHVyYXRpb24gPSBUaW1lci5ub3coKSAtIHN0YXJ0VGltZTtcbiAgICAgICAgY29uc29sZS5sb2coYCR7bGFiZWx9OiAke2R1cmF0aW9ufW1zYCk7XG4gICAgfTtcbn1cbiJdfQ==