
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/compression/base64.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/*--
 Copyright 2009-2010 by Stefan Rusterholz.
 All rights reserved.
 You can choose between MIT and BSD-3-Clause license. License file will be added later.
 --*/
var misc = require('../core/utils/misc');

var strValue = misc.BASE64_VALUES;
/**
 * mixin cc.Codec.Base64
 */

var Base64 = {
  name: 'Jacob__Codec__Base64'
};
/**
 * <p>
 *    cc.Codec.Base64.decode(input[, unicode=false]) -> String (http://en.wikipedia.org/wiki/Base64).
 * </p>
 * @function
 * @param {String} input The base64 encoded string to decode
 * @return {String} Decodes a base64 encoded String
 * @example
 * //decode string
 * cc.Codec.Base64.decode("U29tZSBTdHJpbmc="); // => "Some String"
 */

Base64.decode = function Jacob__Codec__Base64__decode(input) {
  var output = [],
      chr1,
      chr2,
      chr3,
      enc1,
      enc2,
      enc3,
      enc4,
      i = 0;
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

  while (i < input.length) {
    enc1 = strValue[input.charCodeAt(i++)];
    enc2 = strValue[input.charCodeAt(i++)];
    enc3 = strValue[input.charCodeAt(i++)];
    enc4 = strValue[input.charCodeAt(i++)];
    chr1 = enc1 << 2 | enc2 >> 4;
    chr2 = (enc2 & 15) << 4 | enc3 >> 2;
    chr3 = (enc3 & 3) << 6 | enc4;
    output.push(String.fromCharCode(chr1));

    if (enc3 !== 64) {
      output.push(String.fromCharCode(chr2));
    }

    if (enc4 !== 64) {
      output.push(String.fromCharCode(chr3));
    }
  }

  output = output.join('');
  return output;
};
/**
 * <p>
 *    Converts an input string encoded in base64 to an array of integers whose<br/>
 *    values represent the decoded string's characters' bytes.
 * </p>
 * @function
 * @param {String} input The String to convert to an array of Integers
 * @param {Number} bytes
 * @return {Array}
 * @example
 * //decode string to array
 * var decodeArr = cc.Codec.Base64.decodeAsArray("U29tZSBTdHJpbmc=");
 */


Base64.decodeAsArray = function Jacob__Codec__Base64___decodeAsArray(input, bytes) {
  var dec = this.decode(input),
      ar = [],
      i,
      j,
      len;

  for (i = 0, len = dec.length / bytes; i < len; i++) {
    ar[i] = 0;

    for (j = bytes - 1; j >= 0; --j) {
      ar[i] += dec.charCodeAt(i * bytes + j) << j * 8;
    }
  }

  return ar;
};

module.exports = Base64;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2U2NC5qcyJdLCJuYW1lcyI6WyJtaXNjIiwicmVxdWlyZSIsInN0clZhbHVlIiwiQkFTRTY0X1ZBTFVFUyIsIkJhc2U2NCIsIm5hbWUiLCJkZWNvZGUiLCJKYWNvYl9fQ29kZWNfX0Jhc2U2NF9fZGVjb2RlIiwiaW5wdXQiLCJvdXRwdXQiLCJjaHIxIiwiY2hyMiIsImNocjMiLCJlbmMxIiwiZW5jMiIsImVuYzMiLCJlbmM0IiwiaSIsInJlcGxhY2UiLCJsZW5ndGgiLCJjaGFyQ29kZUF0IiwicHVzaCIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsImpvaW4iLCJkZWNvZGVBc0FycmF5IiwiSmFjb2JfX0NvZGVjX19CYXNlNjRfX19kZWNvZGVBc0FycmF5IiwiYnl0ZXMiLCJkZWMiLCJhciIsImoiLCJsZW4iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7O0FBTUEsSUFBSUEsSUFBSSxHQUFHQyxPQUFPLENBQUMsb0JBQUQsQ0FBbEI7O0FBQ0EsSUFBSUMsUUFBUSxHQUFHRixJQUFJLENBQUNHLGFBQXBCO0FBRUE7Ozs7QUFHQSxJQUFJQyxNQUFNLEdBQUc7QUFBQ0MsRUFBQUEsSUFBSSxFQUFDO0FBQU4sQ0FBYjtBQUVBOzs7Ozs7Ozs7Ozs7QUFXQUQsTUFBTSxDQUFDRSxNQUFQLEdBQWdCLFNBQVNDLDRCQUFULENBQXNDQyxLQUF0QyxFQUE2QztBQUN6RCxNQUFJQyxNQUFNLEdBQUcsRUFBYjtBQUFBLE1BQ0lDLElBREo7QUFBQSxNQUNVQyxJQURWO0FBQUEsTUFDZ0JDLElBRGhCO0FBQUEsTUFFSUMsSUFGSjtBQUFBLE1BRVVDLElBRlY7QUFBQSxNQUVnQkMsSUFGaEI7QUFBQSxNQUVzQkMsSUFGdEI7QUFBQSxNQUdJQyxDQUFDLEdBQUcsQ0FIUjtBQUtBVCxFQUFBQSxLQUFLLEdBQUdBLEtBQUssQ0FBQ1UsT0FBTixDQUFjLHFCQUFkLEVBQXFDLEVBQXJDLENBQVI7O0FBRUEsU0FBT0QsQ0FBQyxHQUFHVCxLQUFLLENBQUNXLE1BQWpCLEVBQXlCO0FBQ3JCTixJQUFBQSxJQUFJLEdBQUdYLFFBQVEsQ0FBQ00sS0FBSyxDQUFDWSxVQUFOLENBQWlCSCxDQUFDLEVBQWxCLENBQUQsQ0FBZjtBQUNBSCxJQUFBQSxJQUFJLEdBQUdaLFFBQVEsQ0FBQ00sS0FBSyxDQUFDWSxVQUFOLENBQWlCSCxDQUFDLEVBQWxCLENBQUQsQ0FBZjtBQUNBRixJQUFBQSxJQUFJLEdBQUdiLFFBQVEsQ0FBQ00sS0FBSyxDQUFDWSxVQUFOLENBQWlCSCxDQUFDLEVBQWxCLENBQUQsQ0FBZjtBQUNBRCxJQUFBQSxJQUFJLEdBQUdkLFFBQVEsQ0FBQ00sS0FBSyxDQUFDWSxVQUFOLENBQWlCSCxDQUFDLEVBQWxCLENBQUQsQ0FBZjtBQUVBUCxJQUFBQSxJQUFJLEdBQUlHLElBQUksSUFBSSxDQUFULEdBQWVDLElBQUksSUFBSSxDQUE5QjtBQUNBSCxJQUFBQSxJQUFJLEdBQUksQ0FBQ0csSUFBSSxHQUFHLEVBQVIsS0FBZSxDQUFoQixHQUFzQkMsSUFBSSxJQUFJLENBQXJDO0FBQ0FILElBQUFBLElBQUksR0FBSSxDQUFDRyxJQUFJLEdBQUcsQ0FBUixLQUFjLENBQWYsR0FBb0JDLElBQTNCO0FBRUFQLElBQUFBLE1BQU0sQ0FBQ1ksSUFBUCxDQUFZQyxNQUFNLENBQUNDLFlBQVAsQ0FBb0JiLElBQXBCLENBQVo7O0FBRUEsUUFBSUssSUFBSSxLQUFLLEVBQWIsRUFBaUI7QUFDYk4sTUFBQUEsTUFBTSxDQUFDWSxJQUFQLENBQVlDLE1BQU0sQ0FBQ0MsWUFBUCxDQUFvQlosSUFBcEIsQ0FBWjtBQUNIOztBQUNELFFBQUlLLElBQUksS0FBSyxFQUFiLEVBQWlCO0FBQ2JQLE1BQUFBLE1BQU0sQ0FBQ1ksSUFBUCxDQUFZQyxNQUFNLENBQUNDLFlBQVAsQ0FBb0JYLElBQXBCLENBQVo7QUFDSDtBQUNKOztBQUVESCxFQUFBQSxNQUFNLEdBQUdBLE1BQU0sQ0FBQ2UsSUFBUCxDQUFZLEVBQVosQ0FBVDtBQUVBLFNBQU9mLE1BQVA7QUFDSCxDQS9CRDtBQWlDQTs7Ozs7Ozs7Ozs7Ozs7O0FBYUFMLE1BQU0sQ0FBQ3FCLGFBQVAsR0FBdUIsU0FBU0Msb0NBQVQsQ0FBOENsQixLQUE5QyxFQUFxRG1CLEtBQXJELEVBQTREO0FBQy9FLE1BQUlDLEdBQUcsR0FBRyxLQUFLdEIsTUFBTCxDQUFZRSxLQUFaLENBQVY7QUFBQSxNQUNJcUIsRUFBRSxHQUFHLEVBRFQ7QUFBQSxNQUNhWixDQURiO0FBQUEsTUFDZ0JhLENBRGhCO0FBQUEsTUFDbUJDLEdBRG5COztBQUVBLE9BQUtkLENBQUMsR0FBRyxDQUFKLEVBQU9jLEdBQUcsR0FBR0gsR0FBRyxDQUFDVCxNQUFKLEdBQWFRLEtBQS9CLEVBQXNDVixDQUFDLEdBQUdjLEdBQTFDLEVBQStDZCxDQUFDLEVBQWhELEVBQW9EO0FBQ2hEWSxJQUFBQSxFQUFFLENBQUNaLENBQUQsQ0FBRixHQUFRLENBQVI7O0FBQ0EsU0FBS2EsQ0FBQyxHQUFHSCxLQUFLLEdBQUcsQ0FBakIsRUFBb0JHLENBQUMsSUFBSSxDQUF6QixFQUE0QixFQUFFQSxDQUE5QixFQUFpQztBQUM3QkQsTUFBQUEsRUFBRSxDQUFDWixDQUFELENBQUYsSUFBU1csR0FBRyxDQUFDUixVQUFKLENBQWdCSCxDQUFDLEdBQUdVLEtBQUwsR0FBY0csQ0FBN0IsS0FBb0NBLENBQUMsR0FBRyxDQUFqRDtBQUNIO0FBQ0o7O0FBRUQsU0FBT0QsRUFBUDtBQUNILENBWEQ7O0FBYUFHLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjdCLE1BQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyotLVxuIENvcHlyaWdodCAyMDA5LTIwMTAgYnkgU3RlZmFuIFJ1c3RlcmhvbHouXG4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiBZb3UgY2FuIGNob29zZSBiZXR3ZWVuIE1JVCBhbmQgQlNELTMtQ2xhdXNlIGxpY2Vuc2UuIExpY2Vuc2UgZmlsZSB3aWxsIGJlIGFkZGVkIGxhdGVyLlxuIC0tKi9cblxudmFyIG1pc2MgPSByZXF1aXJlKCcuLi9jb3JlL3V0aWxzL21pc2MnKTtcbnZhciBzdHJWYWx1ZSA9IG1pc2MuQkFTRTY0X1ZBTFVFUztcblxuLyoqXG4gKiBtaXhpbiBjYy5Db2RlYy5CYXNlNjRcbiAqL1xudmFyIEJhc2U2NCA9IHtuYW1lOidKYWNvYl9fQ29kZWNfX0Jhc2U2NCd9O1xuXG4vKipcbiAqIDxwPlxuICogICAgY2MuQ29kZWMuQmFzZTY0LmRlY29kZShpbnB1dFssIHVuaWNvZGU9ZmFsc2VdKSAtPiBTdHJpbmcgKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQmFzZTY0KS5cbiAqIDwvcD5cbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBiYXNlNjQgZW5jb2RlZCBzdHJpbmcgdG8gZGVjb2RlXG4gKiBAcmV0dXJuIHtTdHJpbmd9IERlY29kZXMgYSBiYXNlNjQgZW5jb2RlZCBTdHJpbmdcbiAqIEBleGFtcGxlXG4gKiAvL2RlY29kZSBzdHJpbmdcbiAqIGNjLkNvZGVjLkJhc2U2NC5kZWNvZGUoXCJVMjl0WlNCVGRISnBibWM9XCIpOyAvLyA9PiBcIlNvbWUgU3RyaW5nXCJcbiAqL1xuQmFzZTY0LmRlY29kZSA9IGZ1bmN0aW9uIEphY29iX19Db2RlY19fQmFzZTY0X19kZWNvZGUoaW5wdXQpIHtcbiAgICB2YXIgb3V0cHV0ID0gW10sXG4gICAgICAgIGNocjEsIGNocjIsIGNocjMsXG4gICAgICAgIGVuYzEsIGVuYzIsIGVuYzMsIGVuYzQsXG4gICAgICAgIGkgPSAwO1xuXG4gICAgaW5wdXQgPSBpbnB1dC5yZXBsYWNlKC9bXkEtWmEtejAtOVxcK1xcL1xcPV0vZywgXCJcIik7XG5cbiAgICB3aGlsZSAoaSA8IGlucHV0Lmxlbmd0aCkge1xuICAgICAgICBlbmMxID0gc3RyVmFsdWVbaW5wdXQuY2hhckNvZGVBdChpKyspXTtcbiAgICAgICAgZW5jMiA9IHN0clZhbHVlW2lucHV0LmNoYXJDb2RlQXQoaSsrKV07XG4gICAgICAgIGVuYzMgPSBzdHJWYWx1ZVtpbnB1dC5jaGFyQ29kZUF0KGkrKyldO1xuICAgICAgICBlbmM0ID0gc3RyVmFsdWVbaW5wdXQuY2hhckNvZGVBdChpKyspXTtcblxuICAgICAgICBjaHIxID0gKGVuYzEgPDwgMikgfCAoZW5jMiA+PiA0KTtcbiAgICAgICAgY2hyMiA9ICgoZW5jMiAmIDE1KSA8PCA0KSB8IChlbmMzID4+IDIpO1xuICAgICAgICBjaHIzID0gKChlbmMzICYgMykgPDwgNikgfCBlbmM0O1xuXG4gICAgICAgIG91dHB1dC5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUoY2hyMSkpO1xuXG4gICAgICAgIGlmIChlbmMzICE9PSA2NCkge1xuICAgICAgICAgICAgb3V0cHV0LnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZShjaHIyKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVuYzQgIT09IDY0KSB7XG4gICAgICAgICAgICBvdXRwdXQucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlKGNocjMpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG91dHB1dCA9IG91dHB1dC5qb2luKCcnKTtcblxuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG4vKipcbiAqIDxwPlxuICogICAgQ29udmVydHMgYW4gaW5wdXQgc3RyaW5nIGVuY29kZWQgaW4gYmFzZTY0IHRvIGFuIGFycmF5IG9mIGludGVnZXJzIHdob3NlPGJyLz5cbiAqICAgIHZhbHVlcyByZXByZXNlbnQgdGhlIGRlY29kZWQgc3RyaW5nJ3MgY2hhcmFjdGVycycgYnl0ZXMuXG4gKiA8L3A+XG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgU3RyaW5nIHRvIGNvbnZlcnQgdG8gYW4gYXJyYXkgb2YgSW50ZWdlcnNcbiAqIEBwYXJhbSB7TnVtYmVyfSBieXRlc1xuICogQHJldHVybiB7QXJyYXl9XG4gKiBAZXhhbXBsZVxuICogLy9kZWNvZGUgc3RyaW5nIHRvIGFycmF5XG4gKiB2YXIgZGVjb2RlQXJyID0gY2MuQ29kZWMuQmFzZTY0LmRlY29kZUFzQXJyYXkoXCJVMjl0WlNCVGRISnBibWM9XCIpO1xuICovXG5CYXNlNjQuZGVjb2RlQXNBcnJheSA9IGZ1bmN0aW9uIEphY29iX19Db2RlY19fQmFzZTY0X19fZGVjb2RlQXNBcnJheShpbnB1dCwgYnl0ZXMpIHtcbiAgICB2YXIgZGVjID0gdGhpcy5kZWNvZGUoaW5wdXQpLFxuICAgICAgICBhciA9IFtdLCBpLCBqLCBsZW47XG4gICAgZm9yIChpID0gMCwgbGVuID0gZGVjLmxlbmd0aCAvIGJ5dGVzOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgYXJbaV0gPSAwO1xuICAgICAgICBmb3IgKGogPSBieXRlcyAtIDE7IGogPj0gMDsgLS1qKSB7XG4gICAgICAgICAgICBhcltpXSArPSBkZWMuY2hhckNvZGVBdCgoaSAqIGJ5dGVzKSArIGopIDw8IChqICogOCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYXI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2U2NDtcbiJdfQ==