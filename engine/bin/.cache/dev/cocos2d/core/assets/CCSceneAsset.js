
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/CCSceneAsset.js';
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
 * !#en Class for scene handling.
 * !#zh 场景资源类。
 * @class SceneAsset
 * @extends Asset
 *
 */
var Scene = cc.Class({
  name: 'cc.SceneAsset',
  "extends": cc.Asset,
  properties: {
    /**
     * @property {Scene} scene
     * @default null
     */
    scene: null,

    /**
     * !#en Indicates the raw assets of this scene can be load after scene launched.
     * !#zh 指示该场景依赖的资源可否在场景切换后再延迟加载。
     * @property {Boolean} asyncLoadAssets
     * @default false
     */
    asyncLoadAssets: undefined //// backup prefab assets in editor
    //// {string} assetUuid: {cc.Node} rootInPrefab
    //_prefabDatas: {
    //    default: null,
    //    editorOnly: true
    //}

  }
});
cc.SceneAsset = Scene;
module.exports = Scene;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDU2NlbmVBc3NldC5qcyJdLCJuYW1lcyI6WyJTY2VuZSIsImNjIiwiQ2xhc3MiLCJuYW1lIiwiQXNzZXQiLCJwcm9wZXJ0aWVzIiwic2NlbmUiLCJhc3luY0xvYWRBc3NldHMiLCJ1bmRlZmluZWQiLCJTY2VuZUFzc2V0IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQTs7Ozs7OztBQU9BLElBQUlBLEtBQUssR0FBR0MsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDakJDLEVBQUFBLElBQUksRUFBRSxlQURXO0FBRWpCLGFBQVNGLEVBQUUsQ0FBQ0csS0FGSztBQUlqQkMsRUFBQUEsVUFBVSxFQUFFO0FBRVI7Ozs7QUFJQUMsSUFBQUEsS0FBSyxFQUFFLElBTkM7O0FBUVI7Ozs7OztBQU1BQyxJQUFBQSxlQUFlLEVBQUVDLFNBZFQsQ0FnQlI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQXJCUTtBQUpLLENBQVQsQ0FBWjtBQTZCQVAsRUFBRSxDQUFDUSxVQUFILEdBQWdCVCxLQUFoQjtBQUNBVSxNQUFNLENBQUNDLE9BQVAsR0FBaUJYLEtBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vKipcbiAqICEjZW4gQ2xhc3MgZm9yIHNjZW5lIGhhbmRsaW5nLlxuICogISN6aCDlnLrmma/otYTmupDnsbvjgIJcbiAqIEBjbGFzcyBTY2VuZUFzc2V0XG4gKiBAZXh0ZW5kcyBBc3NldFxuICpcbiAqL1xudmFyIFNjZW5lID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5TY2VuZUFzc2V0JyxcbiAgICBleHRlbmRzOiBjYy5Bc3NldCxcblxuICAgIHByb3BlcnRpZXM6IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHByb3BlcnR5IHtTY2VuZX0gc2NlbmVcbiAgICAgICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAgICAgKi9cbiAgICAgICAgc2NlbmU6IG51bGwsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gSW5kaWNhdGVzIHRoZSByYXcgYXNzZXRzIG9mIHRoaXMgc2NlbmUgY2FuIGJlIGxvYWQgYWZ0ZXIgc2NlbmUgbGF1bmNoZWQuXG4gICAgICAgICAqICEjemgg5oyH56S66K+l5Zy65pmv5L6d6LWW55qE6LWE5rqQ5Y+v5ZCm5Zyo5Zy65pmv5YiH5o2i5ZCO5YaN5bu26L+f5Yqg6L2944CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gYXN5bmNMb2FkQXNzZXRzXG4gICAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgICAqL1xuICAgICAgICBhc3luY0xvYWRBc3NldHM6IHVuZGVmaW5lZCxcblxuICAgICAgICAvLy8vIGJhY2t1cCBwcmVmYWIgYXNzZXRzIGluIGVkaXRvclxuICAgICAgICAvLy8vIHtzdHJpbmd9IGFzc2V0VXVpZDoge2NjLk5vZGV9IHJvb3RJblByZWZhYlxuICAgICAgICAvL19wcmVmYWJEYXRhczoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAvLyAgICBlZGl0b3JPbmx5OiB0cnVlXG4gICAgICAgIC8vfVxuICAgIH0sXG59KTtcblxuY2MuU2NlbmVBc3NldCA9IFNjZW5lO1xubW9kdWxlLmV4cG9ydHMgPSBTY2VuZTtcbiJdfQ==