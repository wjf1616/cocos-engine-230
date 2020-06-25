
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/CCSpriteAtlas.js';
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
 * !#en Class for sprite atlas handling.
 * !#zh 精灵图集资源类。
 * @class SpriteAtlas
 * @extends Asset
 */
var SpriteAtlas = cc.Class({
  name: 'cc.SpriteAtlas',
  "extends": cc.Asset,
  properties: {
    _spriteFrames: {
      "default": {}
    }
  },

  /**
   * Returns the texture of the sprite atlas
   * @method getTexture
   * @returns {Texture2D}
   */
  getTexture: function getTexture() {
    var keys = Object.keys(this._spriteFrames);

    if (keys.length > 0) {
      var spriteFrame = this._spriteFrames[keys[0]];
      return spriteFrame ? spriteFrame.getTexture() : null;
    } else {
      return null;
    }
  },

  /**
   * Returns the sprite frame correspond to the given key in sprite atlas.
   * @method getSpriteFrame
   * @param {String} key
   * @returns {SpriteFrame}
   */
  getSpriteFrame: function getSpriteFrame(key) {
    var sf = this._spriteFrames[key];

    if (!sf) {
      return null;
    }

    if (!sf.name) {
      sf.name = key;
    }

    return sf;
  },

  /**
   * Returns the sprite frames in sprite atlas.
   * @method getSpriteFrames
   * @returns {[SpriteFrame]}
   */
  getSpriteFrames: function getSpriteFrames() {
    var frames = [];
    var spriteFrames = this._spriteFrames;

    for (var key in spriteFrames) {
      frames.push(this.getSpriteFrame(key));
    }

    return frames;
  }
});
cc.SpriteAtlas = SpriteAtlas;
module.exports = SpriteAtlas;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDU3ByaXRlQXRsYXMuanMiXSwibmFtZXMiOlsiU3ByaXRlQXRsYXMiLCJjYyIsIkNsYXNzIiwibmFtZSIsIkFzc2V0IiwicHJvcGVydGllcyIsIl9zcHJpdGVGcmFtZXMiLCJnZXRUZXh0dXJlIiwia2V5cyIsIk9iamVjdCIsImxlbmd0aCIsInNwcml0ZUZyYW1lIiwiZ2V0U3ByaXRlRnJhbWUiLCJrZXkiLCJzZiIsImdldFNwcml0ZUZyYW1lcyIsImZyYW1lcyIsInNwcml0ZUZyYW1lcyIsInB1c2giLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBOzs7Ozs7QUFNQSxJQUFJQSxXQUFXLEdBQUdDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ3ZCQyxFQUFBQSxJQUFJLEVBQUUsZ0JBRGlCO0FBRXZCLGFBQVNGLEVBQUUsQ0FBQ0csS0FGVztBQUd2QkMsRUFBQUEsVUFBVSxFQUFFO0FBQ1JDLElBQUFBLGFBQWEsRUFBRTtBQUNYLGlCQUFTO0FBREU7QUFEUCxHQUhXOztBQVN2Qjs7Ozs7QUFLQUMsRUFBQUEsVUFBVSxFQUFFLHNCQUFZO0FBQ3BCLFFBQUlDLElBQUksR0FBR0MsTUFBTSxDQUFDRCxJQUFQLENBQVksS0FBS0YsYUFBakIsQ0FBWDs7QUFDQSxRQUFJRSxJQUFJLENBQUNFLE1BQUwsR0FBYyxDQUFsQixFQUFxQjtBQUNqQixVQUFJQyxXQUFXLEdBQUcsS0FBS0wsYUFBTCxDQUFtQkUsSUFBSSxDQUFDLENBQUQsQ0FBdkIsQ0FBbEI7QUFDQSxhQUFPRyxXQUFXLEdBQUdBLFdBQVcsQ0FBQ0osVUFBWixFQUFILEdBQThCLElBQWhEO0FBQ0gsS0FIRCxNQUlLO0FBQ0QsYUFBTyxJQUFQO0FBQ0g7QUFDSixHQXZCc0I7O0FBeUJ2Qjs7Ozs7O0FBTUFLLEVBQUFBLGNBQWMsRUFBRSx3QkFBVUMsR0FBVixFQUFlO0FBQzNCLFFBQUlDLEVBQUUsR0FBRyxLQUFLUixhQUFMLENBQW1CTyxHQUFuQixDQUFUOztBQUNBLFFBQUksQ0FBQ0MsRUFBTCxFQUFTO0FBQ0wsYUFBTyxJQUFQO0FBQ0g7O0FBQ0QsUUFBSSxDQUFDQSxFQUFFLENBQUNYLElBQVIsRUFBYztBQUNWVyxNQUFBQSxFQUFFLENBQUNYLElBQUgsR0FBVVUsR0FBVjtBQUNIOztBQUNELFdBQU9DLEVBQVA7QUFDSCxHQXhDc0I7O0FBMEN2Qjs7Ozs7QUFLQUMsRUFBQUEsZUFBZSxFQUFFLDJCQUFZO0FBQ3pCLFFBQUlDLE1BQU0sR0FBRyxFQUFiO0FBQ0EsUUFBSUMsWUFBWSxHQUFHLEtBQUtYLGFBQXhCOztBQUVBLFNBQUssSUFBSU8sR0FBVCxJQUFnQkksWUFBaEIsRUFBOEI7QUFDMUJELE1BQUFBLE1BQU0sQ0FBQ0UsSUFBUCxDQUFZLEtBQUtOLGNBQUwsQ0FBb0JDLEdBQXBCLENBQVo7QUFDSDs7QUFFRCxXQUFPRyxNQUFQO0FBQ0g7QUF4RHNCLENBQVQsQ0FBbEI7QUEyREFmLEVBQUUsQ0FBQ0QsV0FBSCxHQUFpQkEsV0FBakI7QUFDQW1CLE1BQU0sQ0FBQ0MsT0FBUCxHQUFrQnBCLFdBQWxCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vKipcbiAqICEjZW4gQ2xhc3MgZm9yIHNwcml0ZSBhdGxhcyBoYW5kbGluZy5cbiAqICEjemgg57K+54G15Zu+6ZuG6LWE5rqQ57G744CCXG4gKiBAY2xhc3MgU3ByaXRlQXRsYXNcbiAqIEBleHRlbmRzIEFzc2V0XG4gKi9cbnZhciBTcHJpdGVBdGxhcyA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuU3ByaXRlQXRsYXMnLFxuICAgIGV4dGVuZHM6IGNjLkFzc2V0LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgX3Nwcml0ZUZyYW1lczoge1xuICAgICAgICAgICAgZGVmYXVsdDoge31cbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgdGV4dHVyZSBvZiB0aGUgc3ByaXRlIGF0bGFzXG4gICAgICogQG1ldGhvZCBnZXRUZXh0dXJlXG4gICAgICogQHJldHVybnMge1RleHR1cmUyRH1cbiAgICAgKi9cbiAgICBnZXRUZXh0dXJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXModGhpcy5fc3ByaXRlRnJhbWVzKTtcbiAgICAgICAgaWYgKGtleXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdmFyIHNwcml0ZUZyYW1lID0gdGhpcy5fc3ByaXRlRnJhbWVzW2tleXNbMF1dO1xuICAgICAgICAgICAgcmV0dXJuIHNwcml0ZUZyYW1lID8gc3ByaXRlRnJhbWUuZ2V0VGV4dHVyZSgpIDogbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHNwcml0ZSBmcmFtZSBjb3JyZXNwb25kIHRvIHRoZSBnaXZlbiBrZXkgaW4gc3ByaXRlIGF0bGFzLlxuICAgICAqIEBtZXRob2QgZ2V0U3ByaXRlRnJhbWVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gICAgICogQHJldHVybnMge1Nwcml0ZUZyYW1lfVxuICAgICAqL1xuICAgIGdldFNwcml0ZUZyYW1lOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGxldCBzZiA9IHRoaXMuX3Nwcml0ZUZyYW1lc1trZXldO1xuICAgICAgICBpZiAoIXNmKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSBcbiAgICAgICAgaWYgKCFzZi5uYW1lKSB7XG4gICAgICAgICAgICBzZi5uYW1lID0ga2V5O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgc3ByaXRlIGZyYW1lcyBpbiBzcHJpdGUgYXRsYXMuXG4gICAgICogQG1ldGhvZCBnZXRTcHJpdGVGcmFtZXNcbiAgICAgKiBAcmV0dXJucyB7W1Nwcml0ZUZyYW1lXX1cbiAgICAgKi9cbiAgICBnZXRTcHJpdGVGcmFtZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGZyYW1lcyA9IFtdO1xuICAgICAgICB2YXIgc3ByaXRlRnJhbWVzID0gdGhpcy5fc3ByaXRlRnJhbWVzO1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzcHJpdGVGcmFtZXMpIHtcbiAgICAgICAgICAgIGZyYW1lcy5wdXNoKHRoaXMuZ2V0U3ByaXRlRnJhbWUoa2V5KSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZnJhbWVzO1xuICAgIH1cbn0pO1xuXG5jYy5TcHJpdGVBdGxhcyA9IFNwcml0ZUF0bGFzO1xubW9kdWxlLmV4cG9ydHMgPSAgU3ByaXRlQXRsYXM7XG4iXX0=