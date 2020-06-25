
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/value-types/value-type.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _js = _interopRequireDefault(require("../platform/js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

/**
 * !#en The base class of all value types.
 * !#zh 所有值类型的基类。
 * @class ValueType
 *
 */
var ValueType =
/*#__PURE__*/
function () {
  function ValueType() {}

  var _proto = ValueType.prototype;

  /**
   * !#en This method returns an exact copy of current value.
   * !#zh 克隆当前值，该方法返回一个新对象，新对象的值和原对象相等。
   * @method clone
   * @return {ValueType}
   */
  _proto.clone = function clone() {
    cc.errorID('0100', _js["default"].getClassName(this) + '.clone'); // @ts-ignore

    return null;
  }
  /**
   * !#en Compares this object with the other one.
   * !#zh 当前对象是否等于指定对象。
   * @method equals
   * @param {ValueType} other
   * @return {Boolean}
   */
  ;

  _proto.equals = function equals(other) {
    cc.errorID('0100', _js["default"].getClassName(this) + '.equals');
    return false;
  }
  /**
   * !#en
   * Linearly interpolates between this value to to value by ratio which is in the range [0, 1].
   * When ratio = 0 returns this. When ratio = 1 return to. When ratio = 0.5 returns the average of this and to.
   * !#zh
   * 线性插值。<br/>
   * 当 ratio = 0 时返回自身，ratio = 1 时返回目标，ratio = 0.5 返回自身和目标的平均值。。
   * @method lerp
   * @param {ValueType} to - the to value
   * @param {number} ratio - the interpolation coefficient
   * @return {ValueType}
   */
  ;

  _proto.lerp = function lerp(to, ratio) {
    cc.errorID('0100', _js["default"].getClassName(this) + '.lerp');
    return this.clone();
  }
  /**
   * !#en
   * Copys all the properties from another given object to this value.
   * !#zh
   * 从其它对象把所有属性复制到当前对象。
   * @method set
   * @param {ValueType} source - the source to copy
   */
  ;

  _proto.set = function set(source) {
    cc.errorID('0100', _js["default"].getClassName(this) + '.set');
  }
  /**
   * !#en Convert to a readable string.
   * !#zh 转换为方便阅读的字符串。
   * @method toString
   * @return {string}
   */
  ;

  _proto.toString = function toString() {
    return '' + {};
  };

  return ValueType;
}();

exports["default"] = ValueType;

_js["default"].setClassName('cc.ValueType', ValueType);

cc.ValueType = ValueType;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZhbHVlLXR5cGUudHMiXSwibmFtZXMiOlsiVmFsdWVUeXBlIiwiY2xvbmUiLCJjYyIsImVycm9ySUQiLCJqcyIsImdldENsYXNzTmFtZSIsImVxdWFscyIsIm90aGVyIiwibGVycCIsInRvIiwicmF0aW8iLCJzZXQiLCJzb3VyY2UiLCJ0b1N0cmluZyIsInNldENsYXNzTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQTs7OztBQTFCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE0QkE7Ozs7OztJQU1xQkE7Ozs7Ozs7QUFDakI7Ozs7OztTQU1BQyxRQUFBLGlCQUFxQjtBQUNqQkMsSUFBQUEsRUFBRSxDQUFDQyxPQUFILENBQVcsTUFBWCxFQUFtQkMsZUFBR0MsWUFBSCxDQUFnQixJQUFoQixJQUF3QixRQUEzQyxFQURpQixDQUVqQjs7QUFDQSxXQUFPLElBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7U0FPQUMsU0FBQSxnQkFBUUMsS0FBUixFQUFlO0FBQ1hMLElBQUFBLEVBQUUsQ0FBQ0MsT0FBSCxDQUFXLE1BQVgsRUFBbUJDLGVBQUdDLFlBQUgsQ0FBZ0IsSUFBaEIsSUFBd0IsU0FBM0M7QUFDQSxXQUFPLEtBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7Ozs7OztTQVlBRyxPQUFBLGNBQU1DLEVBQU4sRUFBVUMsS0FBVixFQUFpQjtBQUNiUixJQUFBQSxFQUFFLENBQUNDLE9BQUgsQ0FBVyxNQUFYLEVBQW1CQyxlQUFHQyxZQUFILENBQWdCLElBQWhCLElBQXdCLE9BQTNDO0FBQ0EsV0FBTyxLQUFLSixLQUFMLEVBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7O1NBUUFVLE1BQUEsYUFBS0MsTUFBTCxFQUFhO0FBQ1RWLElBQUFBLEVBQUUsQ0FBQ0MsT0FBSCxDQUFXLE1BQVgsRUFBbUJDLGVBQUdDLFlBQUgsQ0FBZ0IsSUFBaEIsSUFBd0IsTUFBM0M7QUFDSDtBQUVEOzs7Ozs7OztTQU1BUSxXQUFBLG9CQUFZO0FBQ1IsV0FBTyxLQUFLLEVBQVo7QUFDSDs7Ozs7OztBQUdMVCxlQUFHVSxZQUFILENBQWdCLGNBQWhCLEVBQWdDZCxTQUFoQzs7QUFDQUUsRUFBRSxDQUFDRixTQUFILEdBQWVBLFNBQWYiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCBqcyBmcm9tICcuLi9wbGF0Zm9ybS9qcyc7XG5cbi8qKlxuICogISNlbiBUaGUgYmFzZSBjbGFzcyBvZiBhbGwgdmFsdWUgdHlwZXMuXG4gKiAhI3poIOaJgOacieWAvOexu+Wei+eahOWfuuexu+OAglxuICogQGNsYXNzIFZhbHVlVHlwZVxuICpcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmFsdWVUeXBlIHtcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoaXMgbWV0aG9kIHJldHVybnMgYW4gZXhhY3QgY29weSBvZiBjdXJyZW50IHZhbHVlLlxuICAgICAqICEjemgg5YWL6ZqG5b2T5YmN5YC877yM6K+l5pa55rOV6L+U5Zue5LiA5Liq5paw5a+56LGh77yM5paw5a+56LGh55qE5YC85ZKM5Y6f5a+56LGh55u4562J44CCXG4gICAgICogQG1ldGhvZCBjbG9uZVxuICAgICAqIEByZXR1cm4ge1ZhbHVlVHlwZX1cbiAgICAgKi9cbiAgICBjbG9uZSAoKSA6IFZhbHVlVHlwZSB7XG4gICAgICAgIGNjLmVycm9ySUQoJzAxMDAnLCBqcy5nZXRDbGFzc05hbWUodGhpcykgKyAnLmNsb25lJyk7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBDb21wYXJlcyB0aGlzIG9iamVjdCB3aXRoIHRoZSBvdGhlciBvbmUuXG4gICAgICogISN6aCDlvZPliY3lr7nosaHmmK/lkKbnrYnkuo7mjIflrprlr7nosaHjgIJcbiAgICAgKiBAbWV0aG9kIGVxdWFsc1xuICAgICAqIEBwYXJhbSB7VmFsdWVUeXBlfSBvdGhlclxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgZXF1YWxzIChvdGhlcikge1xuICAgICAgICBjYy5lcnJvcklEKCcwMTAwJywganMuZ2V0Q2xhc3NOYW1lKHRoaXMpICsgJy5lcXVhbHMnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBMaW5lYXJseSBpbnRlcnBvbGF0ZXMgYmV0d2VlbiB0aGlzIHZhbHVlIHRvIHRvIHZhbHVlIGJ5IHJhdGlvIHdoaWNoIGlzIGluIHRoZSByYW5nZSBbMCwgMV0uXG4gICAgICogV2hlbiByYXRpbyA9IDAgcmV0dXJucyB0aGlzLiBXaGVuIHJhdGlvID0gMSByZXR1cm4gdG8uIFdoZW4gcmF0aW8gPSAwLjUgcmV0dXJucyB0aGUgYXZlcmFnZSBvZiB0aGlzIGFuZCB0by5cbiAgICAgKiAhI3poXG4gICAgICog57q/5oCn5o+S5YC844CCPGJyLz5cbiAgICAgKiDlvZMgcmF0aW8gPSAwIOaXtui/lOWbnuiHqui6q++8jHJhdGlvID0gMSDml7bov5Tlm57nm67moIfvvIxyYXRpbyA9IDAuNSDov5Tlm57oh6rouqvlkoznm67moIfnmoTlubPlnYflgLzjgILjgIJcbiAgICAgKiBAbWV0aG9kIGxlcnBcbiAgICAgKiBAcGFyYW0ge1ZhbHVlVHlwZX0gdG8gLSB0aGUgdG8gdmFsdWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmF0aW8gLSB0aGUgaW50ZXJwb2xhdGlvbiBjb2VmZmljaWVudFxuICAgICAqIEByZXR1cm4ge1ZhbHVlVHlwZX1cbiAgICAgKi9cbiAgICBsZXJwICh0bywgcmF0aW8pIHtcbiAgICAgICAgY2MuZXJyb3JJRCgnMDEwMCcsIGpzLmdldENsYXNzTmFtZSh0aGlzKSArICcubGVycCcpO1xuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBDb3B5cyBhbGwgdGhlIHByb3BlcnRpZXMgZnJvbSBhbm90aGVyIGdpdmVuIG9iamVjdCB0byB0aGlzIHZhbHVlLlxuICAgICAqICEjemhcbiAgICAgKiDku47lhbblroPlr7nosaHmiormiYDmnInlsZ7mgKflpI3liLbliLDlvZPliY3lr7nosaHjgIJcbiAgICAgKiBAbWV0aG9kIHNldFxuICAgICAqIEBwYXJhbSB7VmFsdWVUeXBlfSBzb3VyY2UgLSB0aGUgc291cmNlIHRvIGNvcHlcbiAgICAgKi9cbiAgICBzZXQgKHNvdXJjZSkge1xuICAgICAgICBjYy5lcnJvcklEKCcwMTAwJywganMuZ2V0Q2xhc3NOYW1lKHRoaXMpICsgJy5zZXQnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENvbnZlcnQgdG8gYSByZWFkYWJsZSBzdHJpbmcuXG4gICAgICogISN6aCDovazmjaLkuLrmlrnkvr/pmIXor7vnmoTlrZfnrKbkuLLjgIJcbiAgICAgKiBAbWV0aG9kIHRvU3RyaW5nXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIHRvU3RyaW5nICgpIHtcbiAgICAgICAgcmV0dXJuICcnICsge307XG4gICAgfVxufVxuXG5qcy5zZXRDbGFzc05hbWUoJ2NjLlZhbHVlVHlwZScsIFZhbHVlVHlwZSk7XG5jYy5WYWx1ZVR5cGUgPSBWYWx1ZVR5cGU7XG4iXX0=