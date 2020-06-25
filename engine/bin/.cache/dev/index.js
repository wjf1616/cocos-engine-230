
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/index.js';
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
// PREDEFINE
// window may be undefined when first load engine from editor
var _global = typeof window === 'undefined' ? global : window;
/**
 * !#en
 * The main namespace of Cocos2d-JS, all engine core classes, functions, properties and constants are defined in this namespace.
 * !#zh
 * Cocos 引擎的主要命名空间，引擎代码中所有的类，函数，属性和常量都在这个命名空间中定义。
 * @module cc
 * @main cc
 */


_global.cc = _global.cc || {}; // For internal usage

_global._cc = _global._cc || {};

require('./predefine'); // polyfills


require('./polyfill/string');

require('./polyfill/misc');

require('./polyfill/array');

require('./polyfill/object');

require('./polyfill/array-buffer');

require('./polyfill/number');

if (!(CC_EDITOR && Editor.isMainProcess)) {
  require('./polyfill/typescript');
}

require('./cocos2d/core/predefine'); // LOAD COCOS2D ENGINE CODE


if (!(CC_EDITOR && Editor.isMainProcess)) {
  require('./cocos2d');
} // LOAD EXTENDS


require('./extends');

if (CC_EDITOR) {
  if (Editor.isMainProcess) {
    Editor.versions['cocos2d'] = require('./package').version;
  }
}

module.exports = _global.cc;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIl9nbG9iYWwiLCJ3aW5kb3ciLCJnbG9iYWwiLCJjYyIsIl9jYyIsInJlcXVpcmUiLCJDQ19FRElUT1IiLCJFZGl0b3IiLCJpc01haW5Qcm9jZXNzIiwidmVyc2lvbnMiLCJ2ZXJzaW9uIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBO0FBRUE7QUFDQSxJQUFJQSxPQUFPLEdBQUcsT0FBT0MsTUFBUCxLQUFrQixXQUFsQixHQUFnQ0MsTUFBaEMsR0FBeUNELE1BQXZEO0FBRUE7Ozs7Ozs7Ozs7QUFRQUQsT0FBTyxDQUFDRyxFQUFSLEdBQWFILE9BQU8sQ0FBQ0csRUFBUixJQUFjLEVBQTNCLEVBRUE7O0FBQ0FILE9BQU8sQ0FBQ0ksR0FBUixHQUFjSixPQUFPLENBQUNJLEdBQVIsSUFBZSxFQUE3Qjs7QUFFQUMsT0FBTyxDQUFDLGFBQUQsQ0FBUCxFQUVBOzs7QUFDQUEsT0FBTyxDQUFDLG1CQUFELENBQVA7O0FBQ0FBLE9BQU8sQ0FBQyxpQkFBRCxDQUFQOztBQUNBQSxPQUFPLENBQUMsa0JBQUQsQ0FBUDs7QUFDQUEsT0FBTyxDQUFDLG1CQUFELENBQVA7O0FBQ0FBLE9BQU8sQ0FBQyx5QkFBRCxDQUFQOztBQUNBQSxPQUFPLENBQUMsbUJBQUQsQ0FBUDs7QUFDQSxJQUFJLEVBQUVDLFNBQVMsSUFBSUMsTUFBTSxDQUFDQyxhQUF0QixDQUFKLEVBQTBDO0FBQ3RDSCxFQUFBQSxPQUFPLENBQUMsdUJBQUQsQ0FBUDtBQUNIOztBQUVEQSxPQUFPLENBQUMsMEJBQUQsQ0FBUCxFQUVBOzs7QUFFQSxJQUFJLEVBQUVDLFNBQVMsSUFBSUMsTUFBTSxDQUFDQyxhQUF0QixDQUFKLEVBQTBDO0FBQ3RDSCxFQUFBQSxPQUFPLENBQUMsV0FBRCxDQUFQO0FBQ0gsRUFFRDs7O0FBRUFBLE9BQU8sQ0FBQyxXQUFELENBQVA7O0FBRUEsSUFBSUMsU0FBSixFQUFlO0FBQ1gsTUFBSUMsTUFBTSxDQUFDQyxhQUFYLEVBQTBCO0FBQ3RCRCxJQUFBQSxNQUFNLENBQUNFLFFBQVAsQ0FBZ0IsU0FBaEIsSUFBNkJKLE9BQU8sQ0FBQyxXQUFELENBQVAsQ0FBcUJLLE9BQWxEO0FBQ0g7QUFDSjs7QUFFREMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCWixPQUFPLENBQUNHLEVBQXpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vLyBQUkVERUZJTkVcblxuLy8gd2luZG93IG1heSBiZSB1bmRlZmluZWQgd2hlbiBmaXJzdCBsb2FkIGVuZ2luZSBmcm9tIGVkaXRvclxudmFyIF9nbG9iYWwgPSB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHdpbmRvdztcblxuLyoqXG4gKiAhI2VuXG4gKiBUaGUgbWFpbiBuYW1lc3BhY2Ugb2YgQ29jb3MyZC1KUywgYWxsIGVuZ2luZSBjb3JlIGNsYXNzZXMsIGZ1bmN0aW9ucywgcHJvcGVydGllcyBhbmQgY29uc3RhbnRzIGFyZSBkZWZpbmVkIGluIHRoaXMgbmFtZXNwYWNlLlxuICogISN6aFxuICogQ29jb3Mg5byV5pOO55qE5Li76KaB5ZG95ZCN56m66Ze077yM5byV5pOO5Luj56CB5Lit5omA5pyJ55qE57G777yM5Ye95pWw77yM5bGe5oCn5ZKM5bi46YeP6YO95Zyo6L+Z5Liq5ZG95ZCN56m66Ze05Lit5a6a5LmJ44CCXG4gKiBAbW9kdWxlIGNjXG4gKiBAbWFpbiBjY1xuICovXG5fZ2xvYmFsLmNjID0gX2dsb2JhbC5jYyB8fCB7fTtcblxuLy8gRm9yIGludGVybmFsIHVzYWdlXG5fZ2xvYmFsLl9jYyA9IF9nbG9iYWwuX2NjIHx8IHt9O1xuXG5yZXF1aXJlKCcuL3ByZWRlZmluZScpO1xuXG4vLyBwb2x5ZmlsbHNcbnJlcXVpcmUoJy4vcG9seWZpbGwvc3RyaW5nJyk7XG5yZXF1aXJlKCcuL3BvbHlmaWxsL21pc2MnKTtcbnJlcXVpcmUoJy4vcG9seWZpbGwvYXJyYXknKTtcbnJlcXVpcmUoJy4vcG9seWZpbGwvb2JqZWN0Jyk7XG5yZXF1aXJlKCcuL3BvbHlmaWxsL2FycmF5LWJ1ZmZlcicpO1xucmVxdWlyZSgnLi9wb2x5ZmlsbC9udW1iZXInKTtcbmlmICghKENDX0VESVRPUiAmJiBFZGl0b3IuaXNNYWluUHJvY2VzcykpIHtcbiAgICByZXF1aXJlKCcuL3BvbHlmaWxsL3R5cGVzY3JpcHQnKTtcbn1cblxucmVxdWlyZSgnLi9jb2NvczJkL2NvcmUvcHJlZGVmaW5lJyk7XG5cbi8vIExPQUQgQ09DT1MyRCBFTkdJTkUgQ09ERVxuXG5pZiAoIShDQ19FRElUT1IgJiYgRWRpdG9yLmlzTWFpblByb2Nlc3MpKSB7XG4gICAgcmVxdWlyZSgnLi9jb2NvczJkJyk7XG59XG5cbi8vIExPQUQgRVhURU5EU1xuXG5yZXF1aXJlKCcuL2V4dGVuZHMnKTtcblxuaWYgKENDX0VESVRPUikge1xuICAgIGlmIChFZGl0b3IuaXNNYWluUHJvY2Vzcykge1xuICAgICAgICBFZGl0b3IudmVyc2lvbnNbJ2NvY29zMmQnXSA9IHJlcXVpcmUoJy4vcGFja2FnZScpLnZlcnNpb247XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9nbG9iYWwuY2M7Il19