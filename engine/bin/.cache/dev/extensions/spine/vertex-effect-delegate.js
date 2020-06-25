
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extensions/spine/vertex-effect-delegate.js';
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
var spine = require('./lib/spine');
/**
 * @module sp
 */

/**
 * !#en
 * The delegate of spine vertex effect
 * !#zh
 * Spine 顶点动画代理
 * @class VertexEffectDelegate
 */


sp.VertexEffectDelegate = cc.Class({
  name: 'sp.VertexEffectDelegate',
  ctor: function ctor() {
    this._vertexEffect = null;
    this._interpolation = null;
    this._effectType = 'none';
  },

  /**
   * !#en Clears vertex effect.
   * !#zh 清空顶点效果
   * @method clear
   */
  clear: function clear() {
    this._vertexEffect = null;
    this._interpolation = null;
    this._effectType = 'none';
  },

  /**
   * !#en Inits delegate with jitter effect
   * !#zh 设置顶点抖动效果
   * @method initJitter
   * @param {Number} jitterX
   * @param {Number} jitterY
   */
  initJitter: function initJitter(jitterX, jitterY) {
    this._effectType = 'jitter';
    this._vertexEffect = new spine.JitterEffect(jitterX, jitterY);
    return this._vertexEffect;
  },

  /**
   * !#en Inits delegate with swirl effect
   * !#zh 设置顶点漩涡效果
   * @method initSwirlWithPow
   * @param {Number} radius 
   * @param {Number} power
   * @return {sp.spine.JitterEffect}
   */
  initSwirlWithPow: function initSwirlWithPow(radius, power) {
    this._interpolation = new spine.Pow(power);
    this._vertexEffect = new spine.SwirlEffect(radius, this._interpolation);
    return this._vertexEffect;
  },

  /**
   * !#en Inits delegate with swirl effect
   * !#zh 设置顶点漩涡效果
   * @method initSwirlWithPowOut
   * @param {Number} radius 
   * @param {Number} power
   * @return {sp.spine.SwirlEffect}
   */
  initSwirlWithPowOut: function initSwirlWithPowOut(radius, power) {
    this._interpolation = new spine.PowOut(power);
    this._vertexEffect = new spine.SwirlEffect(radius, this._interpolation);
    return this._vertexEffect;
  },

  /**
   * !#en Gets jitter vertex effect
   * !#zh 获取顶点抖动效果
   * @method getJitterVertexEffect
   * @return {sp.spine.JitterEffect}
   */
  getJitterVertexEffect: function getJitterVertexEffect() {
    return this._vertexEffect;
  },

  /**
   * !#en Gets swirl vertex effect
   * !#zh 获取顶点漩涡效果
   * @method getSwirlVertexEffect
   * @return {sp.spine.SwirlEffect}
   */
  getSwirlVertexEffect: function getSwirlVertexEffect() {
    return this._vertexEffect;
  },

  /**
   * !#en Gets vertex effect
   * !#zh 获取顶点效果
   * @method getVertexEffect
   * @return {sp.spine.JitterEffect|sp.spine.SwirlEffect}
   */
  getVertexEffect: function getVertexEffect() {
    return this._vertexEffect;
  },

  /**
   * !#en Gets effect type
   * !#zh 获取效果类型
   * @method getEffectType
   * @return {String}
   */
  getEffectType: function getEffectType() {
    return this._effectType;
  }
});
module.exports = sp.VertexEffectDelegate;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlcnRleC1lZmZlY3QtZGVsZWdhdGUuanMiXSwibmFtZXMiOlsic3BpbmUiLCJyZXF1aXJlIiwic3AiLCJWZXJ0ZXhFZmZlY3REZWxlZ2F0ZSIsImNjIiwiQ2xhc3MiLCJuYW1lIiwiY3RvciIsIl92ZXJ0ZXhFZmZlY3QiLCJfaW50ZXJwb2xhdGlvbiIsIl9lZmZlY3RUeXBlIiwiY2xlYXIiLCJpbml0Sml0dGVyIiwiaml0dGVyWCIsImppdHRlclkiLCJKaXR0ZXJFZmZlY3QiLCJpbml0U3dpcmxXaXRoUG93IiwicmFkaXVzIiwicG93ZXIiLCJQb3ciLCJTd2lybEVmZmVjdCIsImluaXRTd2lybFdpdGhQb3dPdXQiLCJQb3dPdXQiLCJnZXRKaXR0ZXJWZXJ0ZXhFZmZlY3QiLCJnZXRTd2lybFZlcnRleEVmZmVjdCIsImdldFZlcnRleEVmZmVjdCIsImdldEVmZmVjdFR5cGUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCQSxJQUFNQSxLQUFLLEdBQUdDLE9BQU8sQ0FBQyxhQUFELENBQXJCO0FBQ0E7Ozs7QUFJQTs7Ozs7Ozs7O0FBT0FDLEVBQUUsQ0FBQ0Msb0JBQUgsR0FBMEJDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQy9CQyxFQUFBQSxJQUFJLEVBQUUseUJBRHlCO0FBRy9CQyxFQUFBQSxJQUgrQixrQkFHdkI7QUFDSixTQUFLQyxhQUFMLEdBQXFCLElBQXJCO0FBQ0EsU0FBS0MsY0FBTCxHQUFzQixJQUF0QjtBQUNBLFNBQUtDLFdBQUwsR0FBbUIsTUFBbkI7QUFDSCxHQVA4Qjs7QUFTL0I7Ozs7O0FBS0FDLEVBQUFBLEtBZCtCLG1CQWN0QjtBQUNMLFNBQUtILGFBQUwsR0FBcUIsSUFBckI7QUFDQSxTQUFLQyxjQUFMLEdBQXNCLElBQXRCO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQixNQUFuQjtBQUNILEdBbEI4Qjs7QUFvQi9COzs7Ozs7O0FBT0FFLEVBQUFBLFVBM0IrQixzQkEyQm5CQyxPQTNCbUIsRUEyQlZDLE9BM0JVLEVBMkJEO0FBQzFCLFNBQUtKLFdBQUwsR0FBbUIsUUFBbkI7QUFDQSxTQUFLRixhQUFMLEdBQXFCLElBQUlSLEtBQUssQ0FBQ2UsWUFBVixDQUF1QkYsT0FBdkIsRUFBZ0NDLE9BQWhDLENBQXJCO0FBQ0EsV0FBTyxLQUFLTixhQUFaO0FBQ0gsR0EvQjhCOztBQWlDL0I7Ozs7Ozs7O0FBUUFRLEVBQUFBLGdCQXpDK0IsNEJBeUNkQyxNQXpDYyxFQXlDTkMsS0F6Q00sRUF5Q0M7QUFDNUIsU0FBS1QsY0FBTCxHQUFzQixJQUFJVCxLQUFLLENBQUNtQixHQUFWLENBQWNELEtBQWQsQ0FBdEI7QUFDQSxTQUFLVixhQUFMLEdBQXFCLElBQUlSLEtBQUssQ0FBQ29CLFdBQVYsQ0FBc0JILE1BQXRCLEVBQThCLEtBQUtSLGNBQW5DLENBQXJCO0FBQ0EsV0FBTyxLQUFLRCxhQUFaO0FBQ0gsR0E3QzhCOztBQStDL0I7Ozs7Ozs7O0FBUUFhLEVBQUFBLG1CQXZEK0IsK0JBdURYSixNQXZEVyxFQXVESEMsS0F2REcsRUF1REk7QUFDL0IsU0FBS1QsY0FBTCxHQUFzQixJQUFJVCxLQUFLLENBQUNzQixNQUFWLENBQWlCSixLQUFqQixDQUF0QjtBQUNBLFNBQUtWLGFBQUwsR0FBcUIsSUFBSVIsS0FBSyxDQUFDb0IsV0FBVixDQUFzQkgsTUFBdEIsRUFBOEIsS0FBS1IsY0FBbkMsQ0FBckI7QUFDQSxXQUFPLEtBQUtELGFBQVo7QUFDSCxHQTNEOEI7O0FBNkQvQjs7Ozs7O0FBTUFlLEVBQUFBLHFCQW5FK0IsbUNBbUVOO0FBQ3JCLFdBQU8sS0FBS2YsYUFBWjtBQUNILEdBckU4Qjs7QUF1RS9COzs7Ozs7QUFNQWdCLEVBQUFBLG9CQTdFK0Isa0NBNkVQO0FBQ3BCLFdBQU8sS0FBS2hCLGFBQVo7QUFDSCxHQS9FOEI7O0FBaUYvQjs7Ozs7O0FBTUFpQixFQUFBQSxlQXZGK0IsNkJBdUZaO0FBQ2YsV0FBTyxLQUFLakIsYUFBWjtBQUNILEdBekY4Qjs7QUEyRi9COzs7Ozs7QUFNQWtCLEVBQUFBLGFBakcrQiwyQkFpR2Q7QUFDYixXQUFPLEtBQUtoQixXQUFaO0FBQ0g7QUFuRzhCLENBQVQsQ0FBMUI7QUFxR0FpQixNQUFNLENBQUNDLE9BQVAsR0FBaUIxQixFQUFFLENBQUNDLG9CQUFwQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5jb25zdCBzcGluZSA9IHJlcXVpcmUoJy4vbGliL3NwaW5lJyk7XG4vKipcbiAqIEBtb2R1bGUgc3BcbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIFRoZSBkZWxlZ2F0ZSBvZiBzcGluZSB2ZXJ0ZXggZWZmZWN0XG4gKiAhI3poXG4gKiBTcGluZSDpobbngrnliqjnlLvku6PnkIZcbiAqIEBjbGFzcyBWZXJ0ZXhFZmZlY3REZWxlZ2F0ZVxuICovXG5zcC5WZXJ0ZXhFZmZlY3REZWxlZ2F0ZSA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnc3AuVmVydGV4RWZmZWN0RGVsZWdhdGUnLFxuXG4gICAgY3RvciAoKSB7XG4gICAgICAgIHRoaXMuX3ZlcnRleEVmZmVjdCA9IG51bGw7XG4gICAgICAgIHRoaXMuX2ludGVycG9sYXRpb24gPSBudWxsO1xuICAgICAgICB0aGlzLl9lZmZlY3RUeXBlID0gJ25vbmUnO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENsZWFycyB2ZXJ0ZXggZWZmZWN0LlxuICAgICAqICEjemgg5riF56m66aG254K55pWI5p6cXG4gICAgICogQG1ldGhvZCBjbGVhclxuICAgICAqL1xuICAgIGNsZWFyICgpIHtcbiAgICAgICAgdGhpcy5fdmVydGV4RWZmZWN0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5faW50ZXJwb2xhdGlvbiA9IG51bGw7XG4gICAgICAgIHRoaXMuX2VmZmVjdFR5cGUgPSAnbm9uZSc7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gSW5pdHMgZGVsZWdhdGUgd2l0aCBqaXR0ZXIgZWZmZWN0XG4gICAgICogISN6aCDorr7nva7pobbngrnmipbliqjmlYjmnpxcbiAgICAgKiBAbWV0aG9kIGluaXRKaXR0ZXJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaml0dGVyWFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBqaXR0ZXJZXG4gICAgICovXG4gICAgaW5pdEppdHRlciAoaml0dGVyWCwgaml0dGVyWSkge1xuICAgICAgICB0aGlzLl9lZmZlY3RUeXBlID0gJ2ppdHRlcic7XG4gICAgICAgIHRoaXMuX3ZlcnRleEVmZmVjdCA9IG5ldyBzcGluZS5KaXR0ZXJFZmZlY3Qoaml0dGVyWCwgaml0dGVyWSk7XG4gICAgICAgIHJldHVybiB0aGlzLl92ZXJ0ZXhFZmZlY3Q7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gSW5pdHMgZGVsZWdhdGUgd2l0aCBzd2lybCBlZmZlY3RcbiAgICAgKiAhI3poIOiuvue9rumhtueCuea8qea2oeaViOaenFxuICAgICAqIEBtZXRob2QgaW5pdFN3aXJsV2l0aFBvd1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXMgXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHBvd2VyXG4gICAgICogQHJldHVybiB7c3Auc3BpbmUuSml0dGVyRWZmZWN0fVxuICAgICAqL1xuICAgIGluaXRTd2lybFdpdGhQb3cocmFkaXVzLCBwb3dlcikge1xuICAgICAgICB0aGlzLl9pbnRlcnBvbGF0aW9uID0gbmV3IHNwaW5lLlBvdyhwb3dlcik7XG4gICAgICAgIHRoaXMuX3ZlcnRleEVmZmVjdCA9IG5ldyBzcGluZS5Td2lybEVmZmVjdChyYWRpdXMsIHRoaXMuX2ludGVycG9sYXRpb24pO1xuICAgICAgICByZXR1cm4gdGhpcy5fdmVydGV4RWZmZWN0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEluaXRzIGRlbGVnYXRlIHdpdGggc3dpcmwgZWZmZWN0XG4gICAgICogISN6aCDorr7nva7pobbngrnmvKnmtqHmlYjmnpxcbiAgICAgKiBAbWV0aG9kIGluaXRTd2lybFdpdGhQb3dPdXRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcmFkaXVzIFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwb3dlclxuICAgICAqIEByZXR1cm4ge3NwLnNwaW5lLlN3aXJsRWZmZWN0fVxuICAgICAqL1xuICAgIGluaXRTd2lybFdpdGhQb3dPdXQocmFkaXVzLCBwb3dlcikge1xuICAgICAgICB0aGlzLl9pbnRlcnBvbGF0aW9uID0gbmV3IHNwaW5lLlBvd091dChwb3dlcik7XG4gICAgICAgIHRoaXMuX3ZlcnRleEVmZmVjdCA9IG5ldyBzcGluZS5Td2lybEVmZmVjdChyYWRpdXMsIHRoaXMuX2ludGVycG9sYXRpb24pO1xuICAgICAgICByZXR1cm4gdGhpcy5fdmVydGV4RWZmZWN0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldHMgaml0dGVyIHZlcnRleCBlZmZlY3RcbiAgICAgKiAhI3poIOiOt+WPlumhtueCueaKluWKqOaViOaenFxuICAgICAqIEBtZXRob2QgZ2V0Sml0dGVyVmVydGV4RWZmZWN0XG4gICAgICogQHJldHVybiB7c3Auc3BpbmUuSml0dGVyRWZmZWN0fVxuICAgICAqL1xuICAgIGdldEppdHRlclZlcnRleEVmZmVjdCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92ZXJ0ZXhFZmZlY3Q7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0cyBzd2lybCB2ZXJ0ZXggZWZmZWN0XG4gICAgICogISN6aCDojrflj5bpobbngrnmvKnmtqHmlYjmnpxcbiAgICAgKiBAbWV0aG9kIGdldFN3aXJsVmVydGV4RWZmZWN0XG4gICAgICogQHJldHVybiB7c3Auc3BpbmUuU3dpcmxFZmZlY3R9XG4gICAgICovXG4gICAgZ2V0U3dpcmxWZXJ0ZXhFZmZlY3QgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmVydGV4RWZmZWN0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldHMgdmVydGV4IGVmZmVjdFxuICAgICAqICEjemgg6I635Y+W6aG254K55pWI5p6cXG4gICAgICogQG1ldGhvZCBnZXRWZXJ0ZXhFZmZlY3RcbiAgICAgKiBAcmV0dXJuIHtzcC5zcGluZS5KaXR0ZXJFZmZlY3R8c3Auc3BpbmUuU3dpcmxFZmZlY3R9XG4gICAgICovXG4gICAgZ2V0VmVydGV4RWZmZWN0ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZlcnRleEVmZmVjdDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBHZXRzIGVmZmVjdCB0eXBlXG4gICAgICogISN6aCDojrflj5bmlYjmnpznsbvlnotcbiAgICAgKiBAbWV0aG9kIGdldEVmZmVjdFR5cGVcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICovXG4gICAgZ2V0RWZmZWN0VHlwZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9lZmZlY3RUeXBlO1xuICAgIH1cbn0pO1xubW9kdWxlLmV4cG9ydHMgPSBzcC5WZXJ0ZXhFZmZlY3REZWxlZ2F0ZTsiXX0=