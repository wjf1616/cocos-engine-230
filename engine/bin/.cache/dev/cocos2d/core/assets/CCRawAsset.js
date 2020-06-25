
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/CCRawAsset.js';
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
var CCObject = require('../platform/CCObject');

var js = require('../platform/js');
/**
 * !#en
 * The base class for registering asset types.
 * !#zh
 * 注册用的资源基类。
 *
 * @class RawAsset
 * @extends Object
 */


cc.RawAsset = cc.Class({
  name: 'cc.RawAsset',
  "extends": CCObject,
  ctor: function ctor() {
    /**
     * @property _uuid
     * @type {String}
     * @private
     */
    Object.defineProperty(this, '_uuid', {
      value: '',
      writable: true // enumerable is false by default, to avoid uuid being assigned to empty string during destroy

    });
  }
});
/**
 * @method isRawAssetType
 * @param {Function} ctor
 * @returns {Boolean}
 * @static
 * @private
 */

js.value(cc.RawAsset, 'isRawAssetType', function (ctor) {
  return js.isChildClassOf(ctor, cc.RawAsset) && !js.isChildClassOf(ctor, cc.Asset);
}); // TODO - DELME after 2.1

js.value(cc.RawAsset, 'wasRawAssetType', function (ctor) {
  return ctor === cc.Texture2D || ctor === cc.AudioClip || ctor === cc.ParticleAsset || ctor === cc.Asset; // since 1.10, all raw asset will import as cc.Asset
});
module.exports = cc.RawAsset;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDUmF3QXNzZXQuanMiXSwibmFtZXMiOlsiQ0NPYmplY3QiLCJyZXF1aXJlIiwianMiLCJjYyIsIlJhd0Fzc2V0IiwiQ2xhc3MiLCJuYW1lIiwiY3RvciIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwidmFsdWUiLCJ3cml0YWJsZSIsImlzQ2hpbGRDbGFzc09mIiwiQXNzZXQiLCJUZXh0dXJlMkQiLCJBdWRpb0NsaXAiLCJQYXJ0aWNsZUFzc2V0IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLElBQUlBLFFBQVEsR0FBR0MsT0FBTyxDQUFDLHNCQUFELENBQXRCOztBQUNBLElBQUlDLEVBQUUsR0FBR0QsT0FBTyxDQUFDLGdCQUFELENBQWhCO0FBRUE7Ozs7Ozs7Ozs7O0FBU0FFLEVBQUUsQ0FBQ0MsUUFBSCxHQUFjRCxFQUFFLENBQUNFLEtBQUgsQ0FBUztBQUNuQkMsRUFBQUEsSUFBSSxFQUFFLGFBRGE7QUFDRSxhQUFTTixRQURYO0FBR25CTyxFQUFBQSxJQUFJLEVBQUUsZ0JBQVk7QUFDZDs7Ozs7QUFLQUMsSUFBQUEsTUFBTSxDQUFDQyxjQUFQLENBQXNCLElBQXRCLEVBQTRCLE9BQTVCLEVBQXFDO0FBQ2pDQyxNQUFBQSxLQUFLLEVBQUUsRUFEMEI7QUFFakNDLE1BQUFBLFFBQVEsRUFBRSxJQUZ1QixDQUdqQzs7QUFIaUMsS0FBckM7QUFLSDtBQWRrQixDQUFULENBQWQ7QUFpQkE7Ozs7Ozs7O0FBT0FULEVBQUUsQ0FBQ1EsS0FBSCxDQUFTUCxFQUFFLENBQUNDLFFBQVosRUFBc0IsZ0JBQXRCLEVBQXdDLFVBQVVHLElBQVYsRUFBZ0I7QUFDcEQsU0FBT0wsRUFBRSxDQUFDVSxjQUFILENBQWtCTCxJQUFsQixFQUF3QkosRUFBRSxDQUFDQyxRQUEzQixLQUF3QyxDQUFDRixFQUFFLENBQUNVLGNBQUgsQ0FBa0JMLElBQWxCLEVBQXdCSixFQUFFLENBQUNVLEtBQTNCLENBQWhEO0FBQ0gsQ0FGRCxHQUlDOztBQUNEWCxFQUFFLENBQUNRLEtBQUgsQ0FBU1AsRUFBRSxDQUFDQyxRQUFaLEVBQXNCLGlCQUF0QixFQUF5QyxVQUFVRyxJQUFWLEVBQWdCO0FBQ3JELFNBQU9BLElBQUksS0FBS0osRUFBRSxDQUFDVyxTQUFaLElBQ0FQLElBQUksS0FBS0osRUFBRSxDQUFDWSxTQURaLElBRUFSLElBQUksS0FBS0osRUFBRSxDQUFDYSxhQUZaLElBR0FULElBQUksS0FBS0osRUFBRSxDQUFDVSxLQUhuQixDQURxRCxDQUlqQjtBQUN2QyxDQUxEO0FBT0FJLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQmYsRUFBRSxDQUFDQyxRQUFwQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxudmFyIENDT2JqZWN0ID0gcmVxdWlyZSgnLi4vcGxhdGZvcm0vQ0NPYmplY3QnKTtcbnZhciBqcyA9IHJlcXVpcmUoJy4uL3BsYXRmb3JtL2pzJyk7XG5cbi8qKlxuICogISNlblxuICogVGhlIGJhc2UgY2xhc3MgZm9yIHJlZ2lzdGVyaW5nIGFzc2V0IHR5cGVzLlxuICogISN6aFxuICog5rOo5YaM55So55qE6LWE5rqQ5Z+657G744CCXG4gKlxuICogQGNsYXNzIFJhd0Fzc2V0XG4gKiBAZXh0ZW5kcyBPYmplY3RcbiAqL1xuY2MuUmF3QXNzZXQgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlJhd0Fzc2V0JywgZXh0ZW5kczogQ0NPYmplY3QsXG5cbiAgICBjdG9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcHJvcGVydHkgX3V1aWRcbiAgICAgICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnX3V1aWQnLCB7XG4gICAgICAgICAgICB2YWx1ZTogJycsXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIC8vIGVudW1lcmFibGUgaXMgZmFsc2UgYnkgZGVmYXVsdCwgdG8gYXZvaWQgdXVpZCBiZWluZyBhc3NpZ25lZCB0byBlbXB0eSBzdHJpbmcgZHVyaW5nIGRlc3Ryb3lcbiAgICAgICAgfSk7XG4gICAgfSxcbn0pO1xuXG4vKipcbiAqIEBtZXRob2QgaXNSYXdBc3NldFR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN0b3JcbiAqIEByZXR1cm5zIHtCb29sZWFufVxuICogQHN0YXRpY1xuICogQHByaXZhdGVcbiAqL1xuanMudmFsdWUoY2MuUmF3QXNzZXQsICdpc1Jhd0Fzc2V0VHlwZScsIGZ1bmN0aW9uIChjdG9yKSB7XG4gICAgcmV0dXJuIGpzLmlzQ2hpbGRDbGFzc09mKGN0b3IsIGNjLlJhd0Fzc2V0KSAmJiAhanMuaXNDaGlsZENsYXNzT2YoY3RvciwgY2MuQXNzZXQpO1xufSk7XG5cbiAvLyBUT0RPIC0gREVMTUUgYWZ0ZXIgMi4xXG5qcy52YWx1ZShjYy5SYXdBc3NldCwgJ3dhc1Jhd0Fzc2V0VHlwZScsIGZ1bmN0aW9uIChjdG9yKSB7XG4gICAgcmV0dXJuIGN0b3IgPT09IGNjLlRleHR1cmUyRCB8fFxuICAgICAgICAgICBjdG9yID09PSBjYy5BdWRpb0NsaXAgfHxcbiAgICAgICAgICAgY3RvciA9PT0gY2MuUGFydGljbGVBc3NldCB8fFxuICAgICAgICAgICBjdG9yID09PSBjYy5Bc3NldDsgICAgICAgICAgIC8vIHNpbmNlIDEuMTAsIGFsbCByYXcgYXNzZXQgd2lsbCBpbXBvcnQgYXMgY2MuQXNzZXRcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNjLlJhd0Fzc2V0O1xuIl19