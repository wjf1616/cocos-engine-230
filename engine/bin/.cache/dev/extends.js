
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extends.js';
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
require('./cocos2d/core');

require('./cocos2d/animation');

if (CC_EDITOR && Editor.isMainProcess) {
  require('./cocos2d/particle/CCParticleAsset');

  require('./cocos2d/tilemap/CCTiledMapAsset');
} else {
  require('./cocos2d/particle');

  require('./cocos2d/tilemap');

  require('./cocos2d/videoplayer/CCVideoPlayer');

  require('./cocos2d/webview/CCWebView');

  require('./cocos2d/core/components/CCStudioComponent');

  require('./extensions/ccpool/CCNodePool');

  require('./cocos2d/actions');
}

require('./extensions/spine');

require('./extensions/dragonbones');

if (!CC_EDITOR || !Editor.isMainProcess) {
  require('./cocos2d/deprecated');
}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV4dGVuZHMuanMiXSwibmFtZXMiOlsicmVxdWlyZSIsIkNDX0VESVRPUiIsIkVkaXRvciIsImlzTWFpblByb2Nlc3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQUEsT0FBTyxDQUFDLGdCQUFELENBQVA7O0FBQ0FBLE9BQU8sQ0FBQyxxQkFBRCxDQUFQOztBQUVBLElBQUlDLFNBQVMsSUFBSUMsTUFBTSxDQUFDQyxhQUF4QixFQUF1QztBQUNuQ0gsRUFBQUEsT0FBTyxDQUFDLG9DQUFELENBQVA7O0FBQ0FBLEVBQUFBLE9BQU8sQ0FBQyxtQ0FBRCxDQUFQO0FBQ0gsQ0FIRCxNQUlLO0FBQ0RBLEVBQUFBLE9BQU8sQ0FBQyxvQkFBRCxDQUFQOztBQUNBQSxFQUFBQSxPQUFPLENBQUMsbUJBQUQsQ0FBUDs7QUFDQUEsRUFBQUEsT0FBTyxDQUFDLHFDQUFELENBQVA7O0FBQ0FBLEVBQUFBLE9BQU8sQ0FBQyw2QkFBRCxDQUFQOztBQUNBQSxFQUFBQSxPQUFPLENBQUMsNkNBQUQsQ0FBUDs7QUFDQUEsRUFBQUEsT0FBTyxDQUFDLGdDQUFELENBQVA7O0FBQ0FBLEVBQUFBLE9BQU8sQ0FBQyxtQkFBRCxDQUFQO0FBQ0g7O0FBRURBLE9BQU8sQ0FBQyxvQkFBRCxDQUFQOztBQUNBQSxPQUFPLENBQUMsMEJBQUQsQ0FBUDs7QUFFQSxJQUFJLENBQUNDLFNBQUQsSUFBYyxDQUFDQyxNQUFNLENBQUNDLGFBQTFCLEVBQXlDO0FBQ3JDSCxFQUFBQSxPQUFPLENBQUMsc0JBQUQsQ0FBUDtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5yZXF1aXJlKCcuL2NvY29zMmQvY29yZScpO1xucmVxdWlyZSgnLi9jb2NvczJkL2FuaW1hdGlvbicpO1xuXG5pZiAoQ0NfRURJVE9SICYmIEVkaXRvci5pc01haW5Qcm9jZXNzKSB7XG4gICAgcmVxdWlyZSgnLi9jb2NvczJkL3BhcnRpY2xlL0NDUGFydGljbGVBc3NldCcpO1xuICAgIHJlcXVpcmUoJy4vY29jb3MyZC90aWxlbWFwL0NDVGlsZWRNYXBBc3NldCcpO1xufVxuZWxzZSB7XG4gICAgcmVxdWlyZSgnLi9jb2NvczJkL3BhcnRpY2xlJyk7XG4gICAgcmVxdWlyZSgnLi9jb2NvczJkL3RpbGVtYXAnKTtcbiAgICByZXF1aXJlKCcuL2NvY29zMmQvdmlkZW9wbGF5ZXIvQ0NWaWRlb1BsYXllcicpO1xuICAgIHJlcXVpcmUoJy4vY29jb3MyZC93ZWJ2aWV3L0NDV2ViVmlldycpO1xuICAgIHJlcXVpcmUoJy4vY29jb3MyZC9jb3JlL2NvbXBvbmVudHMvQ0NTdHVkaW9Db21wb25lbnQnKTtcbiAgICByZXF1aXJlKCcuL2V4dGVuc2lvbnMvY2Nwb29sL0NDTm9kZVBvb2wnKTtcbiAgICByZXF1aXJlKCcuL2NvY29zMmQvYWN0aW9ucycpO1xufVxuXG5yZXF1aXJlKCcuL2V4dGVuc2lvbnMvc3BpbmUnKTtcbnJlcXVpcmUoJy4vZXh0ZW5zaW9ucy9kcmFnb25ib25lcycpO1xuXG5pZiAoIUNDX0VESVRPUiB8fCAhRWRpdG9yLmlzTWFpblByb2Nlc3MpIHtcbiAgICByZXF1aXJlKCcuL2NvY29zMmQvZGVwcmVjYXRlZCcpO1xufVxuIl19