
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/CCJsonAsset.js';
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
 * !#en
 * Class for JSON file. When the JSON file is loaded, this object is returned.
 * The parsed JSON object can be accessed through the `json` attribute in it.<br>
 * If you want to get the original JSON text, you should modify the extname to `.txt`
 * so that it is loaded as a `TextAsset` instead of a `JsonAsset`.
 *
 * !#zh
 * JSON 资源类。JSON 文件加载后，将会返回该对象。可以通过其中的 `json` 属性访问解析后的 JSON 对象。<br>
 * 如果你想要获得 JSON 的原始文本，那么应该修改源文件的后缀为 `.txt`，这样就会加载为一个 `TextAsset` 而不是 `JsonAsset`。
 *
 * @class JsonAsset
 * @extends Asset
 */
var JsonAsset = cc.Class({
  name: 'cc.JsonAsset',
  "extends": cc.Asset,
  properties: {
    /**
     * @property {Object} json - The loaded JSON object.
     */
    json: null
  }
});
module.exports = cc.JsonAsset = JsonAsset;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDSnNvbkFzc2V0LmpzIl0sIm5hbWVzIjpbIkpzb25Bc3NldCIsImNjIiwiQ2xhc3MiLCJuYW1lIiwiQXNzZXQiLCJwcm9wZXJ0aWVzIiwianNvbiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7Ozs7Ozs7Ozs7Ozs7QUFjQSxJQUFJQSxTQUFTLEdBQUdDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ3JCQyxFQUFBQSxJQUFJLEVBQUUsY0FEZTtBQUVyQixhQUFTRixFQUFFLENBQUNHLEtBRlM7QUFHckJDLEVBQUFBLFVBQVUsRUFBRTtBQUNSOzs7QUFHQUMsSUFBQUEsSUFBSSxFQUFFO0FBSkU7QUFIUyxDQUFULENBQWhCO0FBV0FDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQlAsRUFBRSxDQUFDRCxTQUFILEdBQWVBLFNBQWhDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qKlxuICogISNlblxuICogQ2xhc3MgZm9yIEpTT04gZmlsZS4gV2hlbiB0aGUgSlNPTiBmaWxlIGlzIGxvYWRlZCwgdGhpcyBvYmplY3QgaXMgcmV0dXJuZWQuXG4gKiBUaGUgcGFyc2VkIEpTT04gb2JqZWN0IGNhbiBiZSBhY2Nlc3NlZCB0aHJvdWdoIHRoZSBganNvbmAgYXR0cmlidXRlIGluIGl0Ljxicj5cbiAqIElmIHlvdSB3YW50IHRvIGdldCB0aGUgb3JpZ2luYWwgSlNPTiB0ZXh0LCB5b3Ugc2hvdWxkIG1vZGlmeSB0aGUgZXh0bmFtZSB0byBgLnR4dGBcbiAqIHNvIHRoYXQgaXQgaXMgbG9hZGVkIGFzIGEgYFRleHRBc3NldGAgaW5zdGVhZCBvZiBhIGBKc29uQXNzZXRgLlxuICpcbiAqICEjemhcbiAqIEpTT04g6LWE5rqQ57G744CCSlNPTiDmlofku7bliqDovb3lkI7vvIzlsIbkvJrov5Tlm57or6Xlr7nosaHjgILlj6/ku6XpgJrov4flhbbkuK3nmoQgYGpzb25gIOWxnuaAp+iuv+mXruino+aekOWQjueahCBKU09OIOWvueixoeOAgjxicj5cbiAqIOWmguaenOS9oOaDs+imgeiOt+W+lyBKU09OIOeahOWOn+Wni+aWh+acrO+8jOmCo+S5iOW6lOivpeS/ruaUuea6kOaWh+S7tueahOWQjue8gOS4uiBgLnR4dGDvvIzov5nmoLflsLHkvJrliqDovb3kuLrkuIDkuKogYFRleHRBc3NldGAg6ICM5LiN5pivIGBKc29uQXNzZXRg44CCXG4gKlxuICogQGNsYXNzIEpzb25Bc3NldFxuICogQGV4dGVuZHMgQXNzZXRcbiAqL1xudmFyIEpzb25Bc3NldCA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuSnNvbkFzc2V0JyxcbiAgICBleHRlbmRzOiBjYy5Bc3NldCxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcHJvcGVydHkge09iamVjdH0ganNvbiAtIFRoZSBsb2FkZWQgSlNPTiBvYmplY3QuXG4gICAgICAgICAqL1xuICAgICAgICBqc29uOiBudWxsLFxuICAgIH0sXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBjYy5Kc29uQXNzZXQgPSBKc29uQXNzZXQ7XG4iXX0=