
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/CCScripts.js';
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

/**
 * !#en Class for script handling.
 * !#zh Script 资源类。
 * @class _Script
 * @extends Asset
 *
 * @private
 */
var Script = cc.Class({
  name: 'cc.Script',
  "extends": cc.Asset
});
cc._Script = Script;
/**
 * !#en Class for JavaScript handling.
 * !#zh JavaScript 资源类。
 * @class _JavaScript
 * @extends Asset
 * @private
 *
 */

var JavaScript = cc.Class({
  name: 'cc.JavaScript',
  "extends": Script
});
cc._JavaScript = JavaScript;
/**
 * !#en Class for coffeescript handling.
 * !#zh CoffeeScript 资源类。
 * @class CoffeeScript
 * @extends Asset
 *
 */

var CoffeeScript = cc.Class({
  name: 'cc.CoffeeScript',
  "extends": Script
});
cc._CoffeeScript = CoffeeScript;
/**
 * !#en Class for TypeScript handling.
 * !#zh TypeScript 资源类。
 * @class TypeScript
 * @extends Asset
 *
 */

var TypeScript = cc.Class({
  name: 'cc.TypeScript',
  "extends": Script
});
cc._TypeScript = TypeScript;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDU2NyaXB0cy5qcyJdLCJuYW1lcyI6WyJTY3JpcHQiLCJjYyIsIkNsYXNzIiwibmFtZSIsIkFzc2V0IiwiX1NjcmlwdCIsIkphdmFTY3JpcHQiLCJfSmF2YVNjcmlwdCIsIkNvZmZlZVNjcmlwdCIsIl9Db2ZmZWVTY3JpcHQiLCJUeXBlU2NyaXB0IiwiX1R5cGVTY3JpcHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkE7Ozs7Ozs7O0FBUUEsSUFBSUEsTUFBTSxHQUFHQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNsQkMsRUFBQUEsSUFBSSxFQUFFLFdBRFk7QUFFbEIsYUFBU0YsRUFBRSxDQUFDRztBQUZNLENBQVQsQ0FBYjtBQUtBSCxFQUFFLENBQUNJLE9BQUgsR0FBYUwsTUFBYjtBQUVBOzs7Ozs7Ozs7QUFRQSxJQUFJTSxVQUFVLEdBQUdMLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ3RCQyxFQUFBQSxJQUFJLEVBQUUsZUFEZ0I7QUFFdEIsYUFBU0g7QUFGYSxDQUFULENBQWpCO0FBS0FDLEVBQUUsQ0FBQ00sV0FBSCxHQUFpQkQsVUFBakI7QUFFQTs7Ozs7Ozs7QUFPQSxJQUFJRSxZQUFZLEdBQUdQLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ3hCQyxFQUFBQSxJQUFJLEVBQUUsaUJBRGtCO0FBRXhCLGFBQVNIO0FBRmUsQ0FBVCxDQUFuQjtBQUtBQyxFQUFFLENBQUNRLGFBQUgsR0FBbUJELFlBQW5CO0FBRUE7Ozs7Ozs7O0FBT0EsSUFBSUUsVUFBVSxHQUFHVCxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUN0QkMsRUFBQUEsSUFBSSxFQUFFLGVBRGdCO0FBRXRCLGFBQVNIO0FBRmEsQ0FBVCxDQUFqQjtBQUtBQyxFQUFFLENBQUNVLFdBQUgsR0FBaUJELFVBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vKipcbiAqICEjZW4gQ2xhc3MgZm9yIHNjcmlwdCBoYW5kbGluZy5cbiAqICEjemggU2NyaXB0IOi1hOa6kOexu+OAglxuICogQGNsYXNzIF9TY3JpcHRcbiAqIEBleHRlbmRzIEFzc2V0XG4gKlxuICogQHByaXZhdGVcbiAqL1xudmFyIFNjcmlwdCA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuU2NyaXB0JyxcbiAgICBleHRlbmRzOiBjYy5Bc3NldCxcbn0pO1xuXG5jYy5fU2NyaXB0ID0gU2NyaXB0O1xuXG4vKipcbiAqICEjZW4gQ2xhc3MgZm9yIEphdmFTY3JpcHQgaGFuZGxpbmcuXG4gKiAhI3poIEphdmFTY3JpcHQg6LWE5rqQ57G744CCXG4gKiBAY2xhc3MgX0phdmFTY3JpcHRcbiAqIEBleHRlbmRzIEFzc2V0XG4gKiBAcHJpdmF0ZVxuICpcbiAqL1xudmFyIEphdmFTY3JpcHQgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLkphdmFTY3JpcHQnLFxuICAgIGV4dGVuZHM6IFNjcmlwdCxcbn0pO1xuXG5jYy5fSmF2YVNjcmlwdCA9IEphdmFTY3JpcHQ7XG5cbi8qKlxuICogISNlbiBDbGFzcyBmb3IgY29mZmVlc2NyaXB0IGhhbmRsaW5nLlxuICogISN6aCBDb2ZmZWVTY3JpcHQg6LWE5rqQ57G744CCXG4gKiBAY2xhc3MgQ29mZmVlU2NyaXB0XG4gKiBAZXh0ZW5kcyBBc3NldFxuICpcbiAqL1xudmFyIENvZmZlZVNjcmlwdCA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuQ29mZmVlU2NyaXB0JyxcbiAgICBleHRlbmRzOiBTY3JpcHQsXG59KTtcblxuY2MuX0NvZmZlZVNjcmlwdCA9IENvZmZlZVNjcmlwdDtcblxuLyoqXG4gKiAhI2VuIENsYXNzIGZvciBUeXBlU2NyaXB0IGhhbmRsaW5nLlxuICogISN6aCBUeXBlU2NyaXB0IOi1hOa6kOexu+OAglxuICogQGNsYXNzIFR5cGVTY3JpcHRcbiAqIEBleHRlbmRzIEFzc2V0XG4gKlxuICovXG52YXIgVHlwZVNjcmlwdCA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuVHlwZVNjcmlwdCcsXG4gICAgZXh0ZW5kczogU2NyaXB0LFxufSk7XG5cbmNjLl9UeXBlU2NyaXB0ID0gVHlwZVNjcmlwdDsiXX0=