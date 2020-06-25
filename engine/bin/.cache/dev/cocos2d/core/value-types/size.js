
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/value-types/size.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _valueType = _interopRequireDefault(require("./value-type"));

var _CCClass = _interopRequireDefault(require("../platform/CCClass"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * !#en
 * cc.Size is the class for size object,<br/>
 * please do not use its constructor to create sizes,<br/>
 * use {{#crossLink "cc/size:method"}}{{/crossLink}} alias function instead.<br/>
 * It will be deprecated soon, please use cc.Vec2 instead.
 *
 * !#zh
 * cc.Size 是 size 对象的类。<br/>
 * 请不要使用它的构造函数创建的 size，<br/>
 * 使用 {{#crossLink "cc/size:method"}}{{/crossLink}} 别名函数。<br/>
 * 它不久将被取消，请使用cc.Vec2代替。
 *
 * @class Size
 */

/**
 * @method constructor
 * @param {Number|Size} width
 * @param {Number} [height]
 */
var Size =
/*#__PURE__*/
function (_ValueType) {
  _inheritsLoose(Size, _ValueType);

  _createClass(Size, null, [{
    key: "ZERO",

    /**
     * !#en return a Size object with width = 0 and height = 0.
     * !#zh 返回一个宽度为 0 和高度为 0 的 Size 对象。
     * @property ZERO
     * @type {Size}
     * @default new Size(0, 0)
     * @static
     */
    get: function get() {
      return new Size();
    }
  }]);

  function Size(width, height) {
    var _this;

    if (width === void 0) {
      width = 0;
    }

    if (height === void 0) {
      height = 0;
    }

    _this = _ValueType.call(this) || this;
    _this.width = void 0;
    _this.height = void 0;

    if (width && typeof width === 'object') {
      _this.height = width.height;
      _this.width = width.width;
    } else {
      _this.width = width || 0;
      _this.height = height || 0;
    }

    return _this;
  }
  /**
   * !#en TODO
   * !#zh 克隆 size 对象。
   * @method clone
   * @return {Size}
   * @example
   * var a = new cc.size(10, 10);
   * a.clone();// return Size {width: 0, height: 0};
   */


  var _proto = Size.prototype;

  _proto.clone = function clone() {
    return new Size(this.width, this.height);
  }
  /**
   * !#en TODO
   * !#zh 当前 Size 对象是否等于指定 Size 对象。
   * @method equals
   * @param {Size} other
   * @return {Boolean}
   * @example
   * var a = new cc.size(10, 10);
   * a.equals(new cc.size(10, 10));// return true;
   */
  ;

  _proto.equals = function equals(other) {
    return other && this.width === other.width && this.height === other.height;
  }
  /**
   * !#en TODO
   * !#zh 线性插值。
   * @method lerp
   * @param {Rect} to
   * @param {Number} ratio - the interpolation coefficient.
   * @param {Size} [out] - optional, the receiving vector.
   * @return {Size}
   * @example
   * var a = new cc.size(10, 10);
   * var b = new cc.rect(50, 50, 100, 100);
   * update (dt) {
   *    // method 1;
   *    var c = a.lerp(b, dt * 0.1);
   *    // method 2;
   *    a.lerp(b, dt * 0.1, c);
   * }
   */
  ;

  _proto.lerp = function lerp(to, ratio, out) {
    out = out || new Size();
    var width = this.width;
    var height = this.height;
    out.width = width + (to.width - width) * ratio;
    out.height = height + (to.height - height) * ratio;
    return out;
  };

  _proto.set = function set(source) {
    this.width = source.width;
    this.height = source.height;
    return this;
  }
  /**
   * !#en TODO
   * !#zh 转换为方便阅读的字符串。
   * @method toString
   * @return {String}
   * @example
   * var a = new cc.size(10, 10);
   * a.toString();// return "(10.00, 10.00)";
   */
  ;

  _proto.toString = function toString() {
    return '(' + this.width.toFixed(2) + ', ' + this.height.toFixed(2) + ')';
  };

  return Size;
}(_valueType["default"]);

exports["default"] = Size;
Size.ZERO_R = Size.ZERO;

_CCClass["default"].fastDefine('cc.Size', Size, {
  width: 0,
  height: 0
});
/**
 * @module cc
 */

/**
 * !#en
 * Helper function that creates a cc.Size.<br/>
 * Please use cc.p or cc.v2 instead, it will soon replace cc.Size.
 * !#zh
 * 创建一个 cc.Size 对象的帮助函数。<br/>
 * 注意：可以使用 cc.p 或者是 cc.v2 代替，它们将很快取代 cc.Size。
 * @method size
 * @param {Number|Size} w - width or a size object
 * @param {Number} [h] - height
 * @return {Size}
 * @example {@link cocos2d/core/value-types/CCSize/size.js}
 */


cc.size = function (w, h) {
  return new Size(w, h);
};

cc.Size = Size;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpemUudHMiXSwibmFtZXMiOlsiU2l6ZSIsIndpZHRoIiwiaGVpZ2h0IiwiY2xvbmUiLCJlcXVhbHMiLCJvdGhlciIsImxlcnAiLCJ0byIsInJhdGlvIiwib3V0Iiwic2V0Iiwic291cmNlIiwidG9TdHJpbmciLCJ0b0ZpeGVkIiwiVmFsdWVUeXBlIiwiWkVST19SIiwiWkVSTyIsIkNDQ2xhc3MiLCJmYXN0RGVmaW5lIiwiY2MiLCJzaXplIiwidyIsImgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkE7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7OztBQWVBOzs7OztJQUtxQkE7Ozs7Ozs7O0FBRWpCOzs7Ozs7Ozt3QkFRbUI7QUFBRSxhQUFPLElBQUlBLElBQUosRUFBUDtBQUFvQjs7O0FBWXpDLGdCQUFhQyxLQUFiLEVBQXVDQyxNQUF2QyxFQUEyRDtBQUFBOztBQUFBLFFBQTlDRCxLQUE4QztBQUE5Q0EsTUFBQUEsS0FBOEMsR0FBdkIsQ0FBdUI7QUFBQTs7QUFBQSxRQUFwQkMsTUFBb0I7QUFBcEJBLE1BQUFBLE1BQW9CLEdBQUgsQ0FBRztBQUFBOztBQUN2RDtBQUR1RCxVQU4zREQsS0FNMkQ7QUFBQSxVQUYzREMsTUFFMkQ7O0FBRXZELFFBQUlELEtBQUssSUFBSSxPQUFPQSxLQUFQLEtBQWlCLFFBQTlCLEVBQXdDO0FBQ3BDLFlBQUtDLE1BQUwsR0FBY0QsS0FBSyxDQUFDQyxNQUFwQjtBQUNBLFlBQUtELEtBQUwsR0FBYUEsS0FBSyxDQUFDQSxLQUFuQjtBQUNILEtBSEQsTUFJSztBQUNELFlBQUtBLEtBQUwsR0FBYUEsS0FBSyxJQUFjLENBQWhDO0FBQ0EsWUFBS0MsTUFBTCxHQUFjQSxNQUFNLElBQUksQ0FBeEI7QUFDSDs7QUFUc0Q7QUFVMUQ7QUFFRDs7Ozs7Ozs7Ozs7OztTQVNBQyxRQUFBLGlCQUFlO0FBQ1gsV0FBTyxJQUFJSCxJQUFKLENBQVMsS0FBS0MsS0FBZCxFQUFxQixLQUFLQyxNQUExQixDQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7O1NBVUFFLFNBQUEsZ0JBQVFDLEtBQVIsRUFBOEI7QUFDMUIsV0FBT0EsS0FBSyxJQUNSLEtBQUtKLEtBQUwsS0FBZUksS0FBSyxDQUFDSixLQURsQixJQUVILEtBQUtDLE1BQUwsS0FBZ0JHLEtBQUssQ0FBQ0gsTUFGMUI7QUFHSDtBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztTQWtCQUksT0FBQSxjQUFNQyxFQUFOLEVBQWdCQyxLQUFoQixFQUErQkMsR0FBL0IsRUFBaUQ7QUFDN0NBLElBQUFBLEdBQUcsR0FBR0EsR0FBRyxJQUFJLElBQUlULElBQUosRUFBYjtBQUNBLFFBQUlDLEtBQUssR0FBRyxLQUFLQSxLQUFqQjtBQUNBLFFBQUlDLE1BQU0sR0FBRyxLQUFLQSxNQUFsQjtBQUNBTyxJQUFBQSxHQUFHLENBQUNSLEtBQUosR0FBWUEsS0FBSyxHQUFHLENBQUNNLEVBQUUsQ0FBQ04sS0FBSCxHQUFXQSxLQUFaLElBQXFCTyxLQUF6QztBQUNBQyxJQUFBQSxHQUFHLENBQUNQLE1BQUosR0FBYUEsTUFBTSxHQUFHLENBQUNLLEVBQUUsQ0FBQ0wsTUFBSCxHQUFZQSxNQUFiLElBQXVCTSxLQUE3QztBQUNBLFdBQU9DLEdBQVA7QUFDSDs7U0FFREMsTUFBQSxhQUFLQyxNQUFMLEVBQW1CO0FBQ2YsU0FBS1YsS0FBTCxHQUFhVSxNQUFNLENBQUNWLEtBQXBCO0FBQ0EsU0FBS0MsTUFBTCxHQUFjUyxNQUFNLENBQUNULE1BQXJCO0FBQ0EsV0FBTyxJQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7U0FTQVUsV0FBQSxvQkFBb0I7QUFDaEIsV0FBTyxNQUFNLEtBQUtYLEtBQUwsQ0FBV1ksT0FBWCxDQUFtQixDQUFuQixDQUFOLEdBQThCLElBQTlCLEdBQXFDLEtBQUtYLE1BQUwsQ0FBWVcsT0FBWixDQUFvQixDQUFwQixDQUFyQyxHQUE4RCxHQUFyRTtBQUNIOzs7RUEzRzZCQzs7O0FBQWJkLEtBV0RlLFNBQVNmLElBQUksQ0FBQ2dCOztBQW1HbENDLG9CQUFRQyxVQUFSLENBQW1CLFNBQW5CLEVBQThCbEIsSUFBOUIsRUFBb0M7QUFBRUMsRUFBQUEsS0FBSyxFQUFFLENBQVQ7QUFBWUMsRUFBQUEsTUFBTSxFQUFFO0FBQXBCLENBQXBDO0FBR0E7Ozs7QUFJQTs7Ozs7Ozs7Ozs7Ozs7O0FBYUFpQixFQUFFLENBQUNDLElBQUgsR0FBVSxVQUFVQyxDQUFWLEVBQWFDLENBQWIsRUFBZ0I7QUFDdEIsU0FBTyxJQUFJdEIsSUFBSixDQUFTcUIsQ0FBVCxFQUFZQyxDQUFaLENBQVA7QUFDSCxDQUZEOztBQUlBSCxFQUFFLENBQUNuQixJQUFILEdBQVVBLElBQVYiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCBWYWx1ZVR5cGUgZnJvbSAnLi92YWx1ZS10eXBlJztcbmltcG9ydCBDQ0NsYXNzIGZyb20gJy4uL3BsYXRmb3JtL0NDQ2xhc3MnO1xuXG4vKipcbiAqICEjZW5cbiAqIGNjLlNpemUgaXMgdGhlIGNsYXNzIGZvciBzaXplIG9iamVjdCw8YnIvPlxuICogcGxlYXNlIGRvIG5vdCB1c2UgaXRzIGNvbnN0cnVjdG9yIHRvIGNyZWF0ZSBzaXplcyw8YnIvPlxuICogdXNlIHt7I2Nyb3NzTGluayBcImNjL3NpemU6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319IGFsaWFzIGZ1bmN0aW9uIGluc3RlYWQuPGJyLz5cbiAqIEl0IHdpbGwgYmUgZGVwcmVjYXRlZCBzb29uLCBwbGVhc2UgdXNlIGNjLlZlYzIgaW5zdGVhZC5cbiAqXG4gKiAhI3poXG4gKiBjYy5TaXplIOaYryBzaXplIOWvueixoeeahOexu+OAgjxici8+XG4gKiDor7fkuI3opoHkvb/nlKjlroPnmoTmnoTpgKDlh73mlbDliJvlu7rnmoQgc2l6Ze+8jDxici8+XG4gKiDkvb/nlKgge3sjY3Jvc3NMaW5rIFwiY2Mvc2l6ZTptZXRob2RcIn19e3svY3Jvc3NMaW5rfX0g5Yir5ZCN5Ye95pWw44CCPGJyLz5cbiAqIOWug+S4jeS5heWwhuiiq+WPlua2iO+8jOivt+S9v+eUqGNjLlZlYzLku6Pmm7/jgIJcbiAqXG4gKiBAY2xhc3MgU2l6ZVxuICovXG4vKipcbiAqIEBtZXRob2QgY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7TnVtYmVyfFNpemV9IHdpZHRoXG4gKiBAcGFyYW0ge051bWJlcn0gW2hlaWdodF1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2l6ZSBleHRlbmRzIFZhbHVlVHlwZSB7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIHJldHVybiBhIFNpemUgb2JqZWN0IHdpdGggd2lkdGggPSAwIGFuZCBoZWlnaHQgPSAwLlxuICAgICAqICEjemgg6L+U5Zue5LiA5Liq5a695bqm5Li6IDAg5ZKM6auY5bqm5Li6IDAg55qEIFNpemUg5a+56LGh44CCXG4gICAgICogQHByb3BlcnR5IFpFUk9cbiAgICAgKiBAdHlwZSB7U2l6ZX1cbiAgICAgKiBAZGVmYXVsdCBuZXcgU2l6ZSgwLCAwKVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IFpFUk8gKCkgeyByZXR1cm4gbmV3IFNpemUoKTsgfVxuICAgIHN0YXRpYyByZWFkb25seSBaRVJPX1IgPSBTaXplLlpFUk87XG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gd2lkdGhcbiAgICAgKi9cbiAgICB3aWR0aDogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBoZWlnaHRcbiAgICAgKi9cbiAgICBoZWlnaHQ6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yICh3aWR0aDogU2l6ZSB8IG51bWJlciA9IDAsIGhlaWdodDogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBpZiAod2lkdGggJiYgdHlwZW9mIHdpZHRoID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSB3aWR0aC5oZWlnaHQ7XG4gICAgICAgICAgICB0aGlzLndpZHRoID0gd2lkdGgud2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLndpZHRoID0gd2lkdGggYXMgbnVtYmVyIHx8IDA7XG4gICAgICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodCB8fCAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBUT0RPXG4gICAgICogISN6aCDlhYvpmoYgc2l6ZSDlr7nosaHjgIJcbiAgICAgKiBAbWV0aG9kIGNsb25lXG4gICAgICogQHJldHVybiB7U2l6ZX1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBhID0gbmV3IGNjLnNpemUoMTAsIDEwKTtcbiAgICAgKiBhLmNsb25lKCk7Ly8gcmV0dXJuIFNpemUge3dpZHRoOiAwLCBoZWlnaHQ6IDB9O1xuICAgICAqL1xuICAgIGNsb25lICgpOiBTaXplIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTaXplKHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRPRE9cbiAgICAgKiAhI3poIOW9k+WJjSBTaXplIOWvueixoeaYr+WQpuetieS6juaMh+WumiBTaXplIOWvueixoeOAglxuICAgICAqIEBtZXRob2QgZXF1YWxzXG4gICAgICogQHBhcmFtIHtTaXplfSBvdGhlclxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgYSA9IG5ldyBjYy5zaXplKDEwLCAxMCk7XG4gICAgICogYS5lcXVhbHMobmV3IGNjLnNpemUoMTAsIDEwKSk7Ly8gcmV0dXJuIHRydWU7XG4gICAgICovXG4gICAgZXF1YWxzIChvdGhlcjogU2l6ZSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gb3RoZXIgJiZcbiAgICAgICAgICAgIHRoaXMud2lkdGggPT09IG90aGVyLndpZHRoICYmXG4gICAgICAgICAgICB0aGlzLmhlaWdodCA9PT0gb3RoZXIuaGVpZ2h0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gVE9ET1xuICAgICAqICEjemgg57q/5oCn5o+S5YC844CCXG4gICAgICogQG1ldGhvZCBsZXJwXG4gICAgICogQHBhcmFtIHtSZWN0fSB0b1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSByYXRpbyAtIHRoZSBpbnRlcnBvbGF0aW9uIGNvZWZmaWNpZW50LlxuICAgICAqIEBwYXJhbSB7U2l6ZX0gW291dF0gLSBvcHRpb25hbCwgdGhlIHJlY2VpdmluZyB2ZWN0b3IuXG4gICAgICogQHJldHVybiB7U2l6ZX1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBhID0gbmV3IGNjLnNpemUoMTAsIDEwKTtcbiAgICAgKiB2YXIgYiA9IG5ldyBjYy5yZWN0KDUwLCA1MCwgMTAwLCAxMDApO1xuICAgICAqIHVwZGF0ZSAoZHQpIHtcbiAgICAgKiAgICAvLyBtZXRob2QgMTtcbiAgICAgKiAgICB2YXIgYyA9IGEubGVycChiLCBkdCAqIDAuMSk7XG4gICAgICogICAgLy8gbWV0aG9kIDI7XG4gICAgICogICAgYS5sZXJwKGIsIGR0ICogMC4xLCBjKTtcbiAgICAgKiB9XG4gICAgICovXG4gICAgbGVycCAodG86IFNpemUsIHJhdGlvOiBudW1iZXIsIG91dD86IFNpemUpOiBTaXplIHtcbiAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBTaXplKCk7XG4gICAgICAgIHZhciB3aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgIHZhciBoZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICAgICAgb3V0LndpZHRoID0gd2lkdGggKyAodG8ud2lkdGggLSB3aWR0aCkgKiByYXRpbztcbiAgICAgICAgb3V0LmhlaWdodCA9IGhlaWdodCArICh0by5oZWlnaHQgLSBoZWlnaHQpICogcmF0aW87XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgc2V0IChzb3VyY2UpOiBTaXplIHtcbiAgICAgICAgdGhpcy53aWR0aCA9IHNvdXJjZS53aWR0aDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBzb3VyY2UuaGVpZ2h0O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRPRE9cbiAgICAgKiAhI3poIOi9rOaNouS4uuaWueS+v+mYheivu+eahOWtl+espuS4suOAglxuICAgICAqIEBtZXRob2QgdG9TdHJpbmdcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgYSA9IG5ldyBjYy5zaXplKDEwLCAxMCk7XG4gICAgICogYS50b1N0cmluZygpOy8vIHJldHVybiBcIigxMC4wMCwgMTAuMDApXCI7XG4gICAgICovXG4gICAgdG9TdHJpbmcgKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnKCcgKyB0aGlzLndpZHRoLnRvRml4ZWQoMikgKyAnLCAnICsgdGhpcy5oZWlnaHQudG9GaXhlZCgyKSArICcpJztcbiAgICB9XG59XG5cbkNDQ2xhc3MuZmFzdERlZmluZSgnY2MuU2l6ZScsIFNpemUsIHsgd2lkdGg6IDAsIGhlaWdodDogMCB9KTtcblxuXG4vKipcbiAqIEBtb2R1bGUgY2NcbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIEhlbHBlciBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBjYy5TaXplLjxici8+XG4gKiBQbGVhc2UgdXNlIGNjLnAgb3IgY2MudjIgaW5zdGVhZCwgaXQgd2lsbCBzb29uIHJlcGxhY2UgY2MuU2l6ZS5cbiAqICEjemhcbiAqIOWIm+W7uuS4gOS4qiBjYy5TaXplIOWvueixoeeahOW4ruWKqeWHveaVsOOAgjxici8+XG4gKiDms6jmhI/vvJrlj6/ku6Xkvb/nlKggY2MucCDmiJbogIXmmK8gY2MudjIg5Luj5pu/77yM5a6D5Lus5bCG5b6I5b+r5Y+W5LujIGNjLlNpemXjgIJcbiAqIEBtZXRob2Qgc2l6ZVxuICogQHBhcmFtIHtOdW1iZXJ8U2l6ZX0gdyAtIHdpZHRoIG9yIGEgc2l6ZSBvYmplY3RcbiAqIEBwYXJhbSB7TnVtYmVyfSBbaF0gLSBoZWlnaHRcbiAqIEByZXR1cm4ge1NpemV9XG4gKiBAZXhhbXBsZSB7QGxpbmsgY29jb3MyZC9jb3JlL3ZhbHVlLXR5cGVzL0NDU2l6ZS9zaXplLmpzfVxuICovXG5jYy5zaXplID0gZnVuY3Rpb24gKHcsIGgpIHtcbiAgICByZXR1cm4gbmV3IFNpemUodywgaCk7XG59O1xuXG5jYy5TaXplID0gU2l6ZTtcbiJdfQ==