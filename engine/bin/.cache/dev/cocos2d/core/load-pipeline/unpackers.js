
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/load-pipeline/unpackers.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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
var Texture2D = require('../assets/CCTexture2D');

var js = require('../platform/js');

function JsonUnpacker() {
  this.jsons = {};
}
/**
 * @param {String[]} indices
 * @param {Object[]} packedJson
 */


JsonUnpacker.prototype.load = function (indices, packedJson) {
  if (packedJson.length !== indices.length) {
    cc.errorID(4915);
  }

  for (var i = 0; i < indices.length; i++) {
    var key = indices[i];
    var json = packedJson[i];
    this.jsons[key] = json;
  }
};

JsonUnpacker.prototype.retrieve = function (key) {
  return this.jsons[key] || null;
};

function TextureUnpacker() {
  this.contents = {};
}

TextureUnpacker.ID = js._getClassId(Texture2D);
/**
 * @param {String[]} indices
 * @param {Object[]} packedJson
 */

TextureUnpacker.prototype.load = function (indices, packedJson) {
  var datas = packedJson.data.split('|');

  if (datas.length !== indices.length) {
    cc.errorID(4915);
  }

  for (var i = 0; i < indices.length; i++) {
    this.contents[indices[i]] = datas[i];
  }
};

TextureUnpacker.prototype.retrieve = function (key) {
  var content = this.contents[key];

  if (content) {
    return {
      __type__: TextureUnpacker.ID,
      content: content
    };
  } else {
    return null;
  }
};

if (CC_TEST) {
  cc._Test.JsonUnpacker = JsonUnpacker;
  cc._Test.TextureUnpacker = TextureUnpacker;
}

module.exports = {
  JsonUnpacker: JsonUnpacker,
  TextureUnpacker: TextureUnpacker
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVucGFja2Vycy5qcyJdLCJuYW1lcyI6WyJUZXh0dXJlMkQiLCJyZXF1aXJlIiwianMiLCJKc29uVW5wYWNrZXIiLCJqc29ucyIsInByb3RvdHlwZSIsImxvYWQiLCJpbmRpY2VzIiwicGFja2VkSnNvbiIsImxlbmd0aCIsImNjIiwiZXJyb3JJRCIsImkiLCJrZXkiLCJqc29uIiwicmV0cmlldmUiLCJUZXh0dXJlVW5wYWNrZXIiLCJjb250ZW50cyIsIklEIiwiX2dldENsYXNzSWQiLCJkYXRhcyIsImRhdGEiLCJzcGxpdCIsImNvbnRlbnQiLCJfX3R5cGVfXyIsIkNDX1RFU1QiLCJfVGVzdCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFJQSxTQUFTLEdBQUdDLE9BQU8sQ0FBQyx1QkFBRCxDQUF2Qjs7QUFDQSxJQUFJQyxFQUFFLEdBQUdELE9BQU8sQ0FBQyxnQkFBRCxDQUFoQjs7QUFFQSxTQUFTRSxZQUFULEdBQXlCO0FBQ3JCLE9BQUtDLEtBQUwsR0FBYSxFQUFiO0FBQ0g7QUFFRDs7Ozs7O0FBSUFELFlBQVksQ0FBQ0UsU0FBYixDQUF1QkMsSUFBdkIsR0FBOEIsVUFBVUMsT0FBVixFQUFtQkMsVUFBbkIsRUFBK0I7QUFDekQsTUFBSUEsVUFBVSxDQUFDQyxNQUFYLEtBQXNCRixPQUFPLENBQUNFLE1BQWxDLEVBQTBDO0FBQ3RDQyxJQUFBQSxFQUFFLENBQUNDLE9BQUgsQ0FBVyxJQUFYO0FBQ0g7O0FBQ0QsT0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHTCxPQUFPLENBQUNFLE1BQTVCLEVBQW9DRyxDQUFDLEVBQXJDLEVBQXlDO0FBQ3JDLFFBQUlDLEdBQUcsR0FBR04sT0FBTyxDQUFDSyxDQUFELENBQWpCO0FBQ0EsUUFBSUUsSUFBSSxHQUFHTixVQUFVLENBQUNJLENBQUQsQ0FBckI7QUFDQSxTQUFLUixLQUFMLENBQVdTLEdBQVgsSUFBa0JDLElBQWxCO0FBQ0g7QUFDSixDQVREOztBQVdBWCxZQUFZLENBQUNFLFNBQWIsQ0FBdUJVLFFBQXZCLEdBQWtDLFVBQVVGLEdBQVYsRUFBZTtBQUM3QyxTQUFPLEtBQUtULEtBQUwsQ0FBV1MsR0FBWCxLQUFtQixJQUExQjtBQUNILENBRkQ7O0FBS0EsU0FBU0csZUFBVCxHQUE0QjtBQUN4QixPQUFLQyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0g7O0FBQ0RELGVBQWUsQ0FBQ0UsRUFBaEIsR0FBcUJoQixFQUFFLENBQUNpQixXQUFILENBQWVuQixTQUFmLENBQXJCO0FBRUE7Ozs7O0FBSUFnQixlQUFlLENBQUNYLFNBQWhCLENBQTBCQyxJQUExQixHQUFpQyxVQUFVQyxPQUFWLEVBQW1CQyxVQUFuQixFQUErQjtBQUM1RCxNQUFJWSxLQUFLLEdBQUdaLFVBQVUsQ0FBQ2EsSUFBWCxDQUFnQkMsS0FBaEIsQ0FBc0IsR0FBdEIsQ0FBWjs7QUFDQSxNQUFJRixLQUFLLENBQUNYLE1BQU4sS0FBaUJGLE9BQU8sQ0FBQ0UsTUFBN0IsRUFBcUM7QUFDakNDLElBQUFBLEVBQUUsQ0FBQ0MsT0FBSCxDQUFXLElBQVg7QUFDSDs7QUFDRCxPQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdMLE9BQU8sQ0FBQ0UsTUFBNUIsRUFBb0NHLENBQUMsRUFBckMsRUFBeUM7QUFDckMsU0FBS0ssUUFBTCxDQUFjVixPQUFPLENBQUNLLENBQUQsQ0FBckIsSUFBNEJRLEtBQUssQ0FBQ1IsQ0FBRCxDQUFqQztBQUNIO0FBQ0osQ0FSRDs7QUFVQUksZUFBZSxDQUFDWCxTQUFoQixDQUEwQlUsUUFBMUIsR0FBcUMsVUFBVUYsR0FBVixFQUFlO0FBQ2hELE1BQUlVLE9BQU8sR0FBRyxLQUFLTixRQUFMLENBQWNKLEdBQWQsQ0FBZDs7QUFDQSxNQUFJVSxPQUFKLEVBQWE7QUFDVCxXQUFPO0FBQ0hDLE1BQUFBLFFBQVEsRUFBRVIsZUFBZSxDQUFDRSxFQUR2QjtBQUVISyxNQUFBQSxPQUFPLEVBQUVBO0FBRk4sS0FBUDtBQUlILEdBTEQsTUFNSztBQUNELFdBQU8sSUFBUDtBQUNIO0FBQ0osQ0FYRDs7QUFhQSxJQUFJRSxPQUFKLEVBQWE7QUFDVGYsRUFBQUEsRUFBRSxDQUFDZ0IsS0FBSCxDQUFTdkIsWUFBVCxHQUF3QkEsWUFBeEI7QUFDQU8sRUFBQUEsRUFBRSxDQUFDZ0IsS0FBSCxDQUFTVixlQUFULEdBQTJCQSxlQUEzQjtBQUNIOztBQUVEVyxNQUFNLENBQUNDLE9BQVAsR0FBaUI7QUFDYnpCLEVBQUFBLFlBQVksRUFBWkEsWUFEYTtBQUViYSxFQUFBQSxlQUFlLEVBQWZBO0FBRmEsQ0FBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxudmFyIFRleHR1cmUyRCA9IHJlcXVpcmUoJy4uL2Fzc2V0cy9DQ1RleHR1cmUyRCcpO1xudmFyIGpzID0gcmVxdWlyZSgnLi4vcGxhdGZvcm0vanMnKTtcblxuZnVuY3Rpb24gSnNvblVucGFja2VyICgpIHtcbiAgICB0aGlzLmpzb25zID0ge307XG59XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmdbXX0gaW5kaWNlc1xuICogQHBhcmFtIHtPYmplY3RbXX0gcGFja2VkSnNvblxuICovXG5Kc29uVW5wYWNrZXIucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbiAoaW5kaWNlcywgcGFja2VkSnNvbikge1xuICAgIGlmIChwYWNrZWRKc29uLmxlbmd0aCAhPT0gaW5kaWNlcy5sZW5ndGgpIHtcbiAgICAgICAgY2MuZXJyb3JJRCg0OTE1KTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbmRpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBrZXkgPSBpbmRpY2VzW2ldO1xuICAgICAgICB2YXIganNvbiA9IHBhY2tlZEpzb25baV07XG4gICAgICAgIHRoaXMuanNvbnNba2V5XSA9IGpzb247XG4gICAgfVxufTtcblxuSnNvblVucGFja2VyLnByb3RvdHlwZS5yZXRyaWV2ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5qc29uc1trZXldIHx8IG51bGw7XG59O1xuXG5cbmZ1bmN0aW9uIFRleHR1cmVVbnBhY2tlciAoKSB7XG4gICAgdGhpcy5jb250ZW50cyA9IHt9O1xufVxuVGV4dHVyZVVucGFja2VyLklEID0ganMuX2dldENsYXNzSWQoVGV4dHVyZTJEKTtcblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ1tdfSBpbmRpY2VzXG4gKiBAcGFyYW0ge09iamVjdFtdfSBwYWNrZWRKc29uXG4gKi9cblRleHR1cmVVbnBhY2tlci5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uIChpbmRpY2VzLCBwYWNrZWRKc29uKSB7XG4gICAgdmFyIGRhdGFzID0gcGFja2VkSnNvbi5kYXRhLnNwbGl0KCd8Jyk7XG4gICAgaWYgKGRhdGFzLmxlbmd0aCAhPT0gaW5kaWNlcy5sZW5ndGgpIHtcbiAgICAgICAgY2MuZXJyb3JJRCg0OTE1KTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbmRpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuY29udGVudHNbaW5kaWNlc1tpXV0gPSBkYXRhc1tpXTtcbiAgICB9XG59O1xuXG5UZXh0dXJlVW5wYWNrZXIucHJvdG90eXBlLnJldHJpZXZlID0gZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciBjb250ZW50ID0gdGhpcy5jb250ZW50c1trZXldO1xuICAgIGlmIChjb250ZW50KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBfX3R5cGVfXzogVGV4dHVyZVVucGFja2VyLklELFxuICAgICAgICAgICAgY29udGVudDogY29udGVudFxuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufTtcblxuaWYgKENDX1RFU1QpIHtcbiAgICBjYy5fVGVzdC5Kc29uVW5wYWNrZXIgPSBKc29uVW5wYWNrZXI7XG4gICAgY2MuX1Rlc3QuVGV4dHVyZVVucGFja2VyID0gVGV4dHVyZVVucGFja2VyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBKc29uVW5wYWNrZXIsXG4gICAgVGV4dHVyZVVucGFja2VyLFxufTtcbiJdfQ==