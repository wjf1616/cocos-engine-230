
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/compression/ZipUtils.js';
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
var codec = {
  name: 'Jacob__Codec'
};
codec.Base64 = require('./base64');
codec.GZip = require('./gzip');
/**
 * Unpack a gzipped byte array
 * @param {Array} input Byte array
 * @returns {String} Unpacked byte string
 */

codec.unzip = function () {
  return codec.GZip.gunzip.apply(codec.GZip, arguments);
};
/**
 * Unpack a gzipped byte string encoded as base64
 * @param {String} input Byte string encoded as base64
 * @returns {String} Unpacked byte string
 */


codec.unzipBase64 = function () {
  var buffer = codec.Base64.decode.apply(codec.Base64, arguments);

  try {
    return codec.GZip.gunzip.call(codec.GZip, buffer);
  } catch (e) {
    // if not zipped, just skip
    return buffer.slice(7); // get image data
  }
};
/**
 * Unpack a gzipped byte string encoded as base64
 * @param {String} input Byte string encoded as base64
 * @param {Number} bytes Bytes per array item
 * @returns {Array} Unpacked byte array
 */


codec.unzipBase64AsArray = function (input, bytes) {
  bytes = bytes || 1;
  var dec = this.unzipBase64(input),
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
/**
 * Unpack a gzipped byte array
 * @param {Array} input Byte array
 * @param {Number} bytes Bytes per array item
 * @returns {Array} Unpacked byte array
 */


codec.unzipAsArray = function (input, bytes) {
  bytes = bytes || 1;
  var dec = this.unzip(input),
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

cc.codec = module.exports = codec;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlppcFV0aWxzLmpzIl0sIm5hbWVzIjpbImNvZGVjIiwibmFtZSIsIkJhc2U2NCIsInJlcXVpcmUiLCJHWmlwIiwidW56aXAiLCJndW56aXAiLCJhcHBseSIsImFyZ3VtZW50cyIsInVuemlwQmFzZTY0IiwiYnVmZmVyIiwiZGVjb2RlIiwiY2FsbCIsImUiLCJzbGljZSIsInVuemlwQmFzZTY0QXNBcnJheSIsImlucHV0IiwiYnl0ZXMiLCJkZWMiLCJhciIsImkiLCJqIiwibGVuIiwibGVuZ3RoIiwiY2hhckNvZGVBdCIsInVuemlwQXNBcnJheSIsImNjIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7OztBQU1BLElBQUlBLEtBQUssR0FBRztBQUFDQyxFQUFBQSxJQUFJLEVBQUM7QUFBTixDQUFaO0FBRUFELEtBQUssQ0FBQ0UsTUFBTixHQUFlQyxPQUFPLENBQUMsVUFBRCxDQUF0QjtBQUNBSCxLQUFLLENBQUNJLElBQU4sR0FBYUQsT0FBTyxDQUFDLFFBQUQsQ0FBcEI7QUFFQTs7Ozs7O0FBS0FILEtBQUssQ0FBQ0ssS0FBTixHQUFjLFlBQVk7QUFDdEIsU0FBT0wsS0FBSyxDQUFDSSxJQUFOLENBQVdFLE1BQVgsQ0FBa0JDLEtBQWxCLENBQXdCUCxLQUFLLENBQUNJLElBQTlCLEVBQW9DSSxTQUFwQyxDQUFQO0FBQ0gsQ0FGRDtBQUlBOzs7Ozs7O0FBS0FSLEtBQUssQ0FBQ1MsV0FBTixHQUFvQixZQUFZO0FBQzVCLE1BQUlDLE1BQU0sR0FBR1YsS0FBSyxDQUFDRSxNQUFOLENBQWFTLE1BQWIsQ0FBb0JKLEtBQXBCLENBQTBCUCxLQUFLLENBQUNFLE1BQWhDLEVBQXdDTSxTQUF4QyxDQUFiOztBQUNBLE1BQUk7QUFDQSxXQUFPUixLQUFLLENBQUNJLElBQU4sQ0FBV0UsTUFBWCxDQUFrQk0sSUFBbEIsQ0FBdUJaLEtBQUssQ0FBQ0ksSUFBN0IsRUFBbUNNLE1BQW5DLENBQVA7QUFDSCxHQUZELENBR0EsT0FBTUcsQ0FBTixFQUFTO0FBQ0w7QUFDQSxXQUFPSCxNQUFNLENBQUNJLEtBQVAsQ0FBYSxDQUFiLENBQVAsQ0FGSyxDQUVtQjtBQUMzQjtBQUNKLENBVEQ7QUFXQTs7Ozs7Ozs7QUFNQWQsS0FBSyxDQUFDZSxrQkFBTixHQUEyQixVQUFVQyxLQUFWLEVBQWlCQyxLQUFqQixFQUF3QjtBQUMvQ0EsRUFBQUEsS0FBSyxHQUFHQSxLQUFLLElBQUksQ0FBakI7QUFFQSxNQUFJQyxHQUFHLEdBQUcsS0FBS1QsV0FBTCxDQUFpQk8sS0FBakIsQ0FBVjtBQUFBLE1BQ0lHLEVBQUUsR0FBRyxFQURUO0FBQUEsTUFDYUMsQ0FEYjtBQUFBLE1BQ2dCQyxDQURoQjtBQUFBLE1BQ21CQyxHQURuQjs7QUFFQSxPQUFLRixDQUFDLEdBQUcsQ0FBSixFQUFPRSxHQUFHLEdBQUdKLEdBQUcsQ0FBQ0ssTUFBSixHQUFhTixLQUEvQixFQUFzQ0csQ0FBQyxHQUFHRSxHQUExQyxFQUErQ0YsQ0FBQyxFQUFoRCxFQUFvRDtBQUNoREQsSUFBQUEsRUFBRSxDQUFDQyxDQUFELENBQUYsR0FBUSxDQUFSOztBQUNBLFNBQUtDLENBQUMsR0FBR0osS0FBSyxHQUFHLENBQWpCLEVBQW9CSSxDQUFDLElBQUksQ0FBekIsRUFBNEIsRUFBRUEsQ0FBOUIsRUFBaUM7QUFDN0JGLE1BQUFBLEVBQUUsQ0FBQ0MsQ0FBRCxDQUFGLElBQVNGLEdBQUcsQ0FBQ00sVUFBSixDQUFnQkosQ0FBQyxHQUFHSCxLQUFMLEdBQWNJLENBQTdCLEtBQW9DQSxDQUFDLEdBQUcsQ0FBakQ7QUFDSDtBQUNKOztBQUNELFNBQU9GLEVBQVA7QUFDSCxDQVpEO0FBY0E7Ozs7Ozs7O0FBTUFuQixLQUFLLENBQUN5QixZQUFOLEdBQXFCLFVBQVVULEtBQVYsRUFBaUJDLEtBQWpCLEVBQXdCO0FBQ3pDQSxFQUFBQSxLQUFLLEdBQUdBLEtBQUssSUFBSSxDQUFqQjtBQUVBLE1BQUlDLEdBQUcsR0FBRyxLQUFLYixLQUFMLENBQVdXLEtBQVgsQ0FBVjtBQUFBLE1BQ0lHLEVBQUUsR0FBRyxFQURUO0FBQUEsTUFDYUMsQ0FEYjtBQUFBLE1BQ2dCQyxDQURoQjtBQUFBLE1BQ21CQyxHQURuQjs7QUFFQSxPQUFLRixDQUFDLEdBQUcsQ0FBSixFQUFPRSxHQUFHLEdBQUdKLEdBQUcsQ0FBQ0ssTUFBSixHQUFhTixLQUEvQixFQUFzQ0csQ0FBQyxHQUFHRSxHQUExQyxFQUErQ0YsQ0FBQyxFQUFoRCxFQUFvRDtBQUNoREQsSUFBQUEsRUFBRSxDQUFDQyxDQUFELENBQUYsR0FBUSxDQUFSOztBQUNBLFNBQUtDLENBQUMsR0FBR0osS0FBSyxHQUFHLENBQWpCLEVBQW9CSSxDQUFDLElBQUksQ0FBekIsRUFBNEIsRUFBRUEsQ0FBOUIsRUFBaUM7QUFDN0JGLE1BQUFBLEVBQUUsQ0FBQ0MsQ0FBRCxDQUFGLElBQVNGLEdBQUcsQ0FBQ00sVUFBSixDQUFnQkosQ0FBQyxHQUFHSCxLQUFMLEdBQWNJLENBQTdCLEtBQW9DQSxDQUFDLEdBQUcsQ0FBakQ7QUFDSDtBQUNKOztBQUNELFNBQU9GLEVBQVA7QUFDSCxDQVpEOztBQWNBTyxFQUFFLENBQUMxQixLQUFILEdBQVcyQixNQUFNLENBQUNDLE9BQVAsR0FBaUI1QixLQUE1QiIsInNvdXJjZXNDb250ZW50IjpbIi8qLS1cbiBDb3B5cmlnaHQgMjAwOS0yMDEwIGJ5IFN0ZWZhbiBSdXN0ZXJob2x6LlxuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gWW91IGNhbiBjaG9vc2UgYmV0d2VlbiBNSVQgYW5kIEJTRC0zLUNsYXVzZSBsaWNlbnNlLiBMaWNlbnNlIGZpbGUgd2lsbCBiZSBhZGRlZCBsYXRlci5cbiAtLSovXG5cbnZhciBjb2RlYyA9IHtuYW1lOidKYWNvYl9fQ29kZWMnfTtcblxuY29kZWMuQmFzZTY0ID0gcmVxdWlyZSgnLi9iYXNlNjQnKTtcbmNvZGVjLkdaaXAgPSByZXF1aXJlKCcuL2d6aXAnKTtcblxuLyoqXG4gKiBVbnBhY2sgYSBnemlwcGVkIGJ5dGUgYXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGlucHV0IEJ5dGUgYXJyYXlcbiAqIEByZXR1cm5zIHtTdHJpbmd9IFVucGFja2VkIGJ5dGUgc3RyaW5nXG4gKi9cbmNvZGVjLnVuemlwID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjb2RlYy5HWmlwLmd1bnppcC5hcHBseShjb2RlYy5HWmlwLCBhcmd1bWVudHMpO1xufTtcblxuLyoqXG4gKiBVbnBhY2sgYSBnemlwcGVkIGJ5dGUgc3RyaW5nIGVuY29kZWQgYXMgYmFzZTY0XG4gKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgQnl0ZSBzdHJpbmcgZW5jb2RlZCBhcyBiYXNlNjRcbiAqIEByZXR1cm5zIHtTdHJpbmd9IFVucGFja2VkIGJ5dGUgc3RyaW5nXG4gKi9cbmNvZGVjLnVuemlwQmFzZTY0ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBidWZmZXIgPSBjb2RlYy5CYXNlNjQuZGVjb2RlLmFwcGx5KGNvZGVjLkJhc2U2NCwgYXJndW1lbnRzKTtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gY29kZWMuR1ppcC5ndW56aXAuY2FsbChjb2RlYy5HWmlwLCBidWZmZXIpO1xuICAgIH1cbiAgICBjYXRjaChlKSB7XG4gICAgICAgIC8vIGlmIG5vdCB6aXBwZWQsIGp1c3Qgc2tpcFxuICAgICAgICByZXR1cm4gYnVmZmVyLnNsaWNlKDcpOyAvLyBnZXQgaW1hZ2UgZGF0YVxuICAgIH1cbn07XG5cbi8qKlxuICogVW5wYWNrIGEgZ3ppcHBlZCBieXRlIHN0cmluZyBlbmNvZGVkIGFzIGJhc2U2NFxuICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IEJ5dGUgc3RyaW5nIGVuY29kZWQgYXMgYmFzZTY0XG4gKiBAcGFyYW0ge051bWJlcn0gYnl0ZXMgQnl0ZXMgcGVyIGFycmF5IGl0ZW1cbiAqIEByZXR1cm5zIHtBcnJheX0gVW5wYWNrZWQgYnl0ZSBhcnJheVxuICovXG5jb2RlYy51bnppcEJhc2U2NEFzQXJyYXkgPSBmdW5jdGlvbiAoaW5wdXQsIGJ5dGVzKSB7XG4gICAgYnl0ZXMgPSBieXRlcyB8fCAxO1xuXG4gICAgdmFyIGRlYyA9IHRoaXMudW56aXBCYXNlNjQoaW5wdXQpLFxuICAgICAgICBhciA9IFtdLCBpLCBqLCBsZW47XG4gICAgZm9yIChpID0gMCwgbGVuID0gZGVjLmxlbmd0aCAvIGJ5dGVzOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgYXJbaV0gPSAwO1xuICAgICAgICBmb3IgKGogPSBieXRlcyAtIDE7IGogPj0gMDsgLS1qKSB7XG4gICAgICAgICAgICBhcltpXSArPSBkZWMuY2hhckNvZGVBdCgoaSAqIGJ5dGVzKSArIGopIDw8IChqICogOCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFyO1xufTtcblxuLyoqXG4gKiBVbnBhY2sgYSBnemlwcGVkIGJ5dGUgYXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGlucHV0IEJ5dGUgYXJyYXlcbiAqIEBwYXJhbSB7TnVtYmVyfSBieXRlcyBCeXRlcyBwZXIgYXJyYXkgaXRlbVxuICogQHJldHVybnMge0FycmF5fSBVbnBhY2tlZCBieXRlIGFycmF5XG4gKi9cbmNvZGVjLnVuemlwQXNBcnJheSA9IGZ1bmN0aW9uIChpbnB1dCwgYnl0ZXMpIHtcbiAgICBieXRlcyA9IGJ5dGVzIHx8IDE7XG5cbiAgICB2YXIgZGVjID0gdGhpcy51bnppcChpbnB1dCksXG4gICAgICAgIGFyID0gW10sIGksIGosIGxlbjtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBkZWMubGVuZ3RoIC8gYnl0ZXM7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBhcltpXSA9IDA7XG4gICAgICAgIGZvciAoaiA9IGJ5dGVzIC0gMTsgaiA+PSAwOyAtLWopIHtcbiAgICAgICAgICAgIGFyW2ldICs9IGRlYy5jaGFyQ29kZUF0KChpICogYnl0ZXMpICsgaikgPDwgKGogKiA4KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXI7XG59O1xuXG5jYy5jb2RlYyA9IG1vZHVsZS5leHBvcnRzID0gY29kZWM7Il19