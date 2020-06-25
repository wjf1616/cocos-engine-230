
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extensions/dragonbones/CCTextureData.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
dragonBones.CCTextureAtlasData = cc.Class({
  "extends": dragonBones.TextureAtlasData,
  name: "dragonBones.CCTextureAtlasData",
  properties: {
    _renderTexture: {
      "default": null,
      serializable: false
    },
    renderTexture: {
      get: function get() {
        return this._renderTexture;
      },
      set: function set(value) {
        this._renderTexture = value;

        if (value) {
          for (var k in this.textures) {
            var textureData = this.textures[k];

            if (!textureData.spriteFrame) {
              var rect = null;

              if (textureData.rotated) {
                rect = cc.rect(textureData.region.x, textureData.region.y, textureData.region.height, textureData.region.width);
              } else {
                rect = cc.rect(textureData.region.x, textureData.region.y, textureData.region.width, textureData.region.height);
              }

              var offset = cc.v2(0, 0);
              var size = cc.size(rect.width, rect.height);
              textureData.spriteFrame = new cc.SpriteFrame();
              textureData.spriteFrame.setTexture(value, rect, false, offset, size);
            }
          }
        } else {
          for (var _k in this.textures) {
            var _textureData = this.textures[_k];
            _textureData.spriteFrame = null;
          }
        }
      }
    }
  },
  statics: {
    toString: function toString() {
      return "[class dragonBones.CCTextureAtlasData]";
    }
  },
  _onClear: function _onClear() {
    dragonBones.TextureAtlasData.prototype._onClear.call(this);

    this.renderTexture = null;
  },
  createTexture: function createTexture() {
    return dragonBones.BaseObject.borrowObject(dragonBones.CCTextureData);
  }
});
dragonBones.CCTextureData = cc.Class({
  "extends": dragonBones.TextureData,
  name: "dragonBones.CCTextureData",
  properties: {
    spriteFrame: {
      "default": null,
      serializable: false
    }
  },
  statics: {
    toString: function toString() {
      return "[class dragonBones.CCTextureData]";
    }
  },
  _onClear: function _onClear() {
    dragonBones.TextureData.prototype._onClear.call(this);

    this.spriteFrame = null;
  }
});
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDVGV4dHVyZURhdGEuanMiXSwibmFtZXMiOlsiZHJhZ29uQm9uZXMiLCJDQ1RleHR1cmVBdGxhc0RhdGEiLCJjYyIsIkNsYXNzIiwiVGV4dHVyZUF0bGFzRGF0YSIsIm5hbWUiLCJwcm9wZXJ0aWVzIiwiX3JlbmRlclRleHR1cmUiLCJzZXJpYWxpemFibGUiLCJyZW5kZXJUZXh0dXJlIiwiZ2V0Iiwic2V0IiwidmFsdWUiLCJrIiwidGV4dHVyZXMiLCJ0ZXh0dXJlRGF0YSIsInNwcml0ZUZyYW1lIiwicmVjdCIsInJvdGF0ZWQiLCJyZWdpb24iLCJ4IiwieSIsImhlaWdodCIsIndpZHRoIiwib2Zmc2V0IiwidjIiLCJzaXplIiwiU3ByaXRlRnJhbWUiLCJzZXRUZXh0dXJlIiwic3RhdGljcyIsInRvU3RyaW5nIiwiX29uQ2xlYXIiLCJwcm90b3R5cGUiLCJjYWxsIiwiY3JlYXRlVGV4dHVyZSIsIkJhc2VPYmplY3QiLCJib3Jyb3dPYmplY3QiLCJDQ1RleHR1cmVEYXRhIiwiVGV4dHVyZURhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBQSxXQUFXLENBQUNDLGtCQUFaLEdBQWlDQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUN0QyxhQUFTSCxXQUFXLENBQUNJLGdCQURpQjtBQUV0Q0MsRUFBQUEsSUFBSSxFQUFFLGdDQUZnQztBQUl0Q0MsRUFBQUEsVUFBVSxFQUFFO0FBQ1JDLElBQUFBLGNBQWMsRUFBRTtBQUNaLGlCQUFTLElBREc7QUFFWkMsTUFBQUEsWUFBWSxFQUFFO0FBRkYsS0FEUjtBQU1SQyxJQUFBQSxhQUFhLEVBQUU7QUFDWEMsTUFBQUEsR0FEVyxpQkFDSjtBQUNILGVBQU8sS0FBS0gsY0FBWjtBQUNILE9BSFU7QUFJWEksTUFBQUEsR0FKVyxlQUlOQyxLQUpNLEVBSUM7QUFDUixhQUFLTCxjQUFMLEdBQXNCSyxLQUF0Qjs7QUFDQSxZQUFJQSxLQUFKLEVBQVc7QUFDUCxl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RSxvQkFBWTtBQUNsQi9CLElBQUFBLFdBQVcsQ0FBQ3NDLFdBQVosQ0FBd0JOLFNBQXhCLENBQWtDRCxRQUFsQyxDQUEyQ0UsSUFBM0MsQ0FBZ0QsSUFBaEQ7O0FBQ0EsU0FBS2pCLFdBQUwsR0FBbUIsSUFBbkI7QUFDSDtBQXBCZ0MsQ0FBVCxDQUE1QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHA6Ly93d3cuY29jb3MyZC14Lm9yZ1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuZHJhZ29uQm9uZXMuQ0NUZXh0dXJlQXRsYXNEYXRhID0gY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGRyYWdvbkJvbmVzLlRleHR1cmVBdGxhc0RhdGEsXG4gICAgbmFtZTogXCJkcmFnb25Cb25lcy5DQ1RleHR1cmVBdGxhc0RhdGFcIixcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgX3JlbmRlclRleHR1cmU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICBzZXJpYWxpemFibGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVuZGVyVGV4dHVyZToge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVuZGVyVGV4dHVyZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVuZGVyVGV4dHVyZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrIGluIHRoaXMudGV4dHVyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZXh0dXJlRGF0YSA9IHRoaXMudGV4dHVyZXNba107XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRleHR1cmVEYXRhLnNwcml0ZUZyYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlY3QgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXh0dXJlRGF0YS5yb3RhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY3QgPSBjYy5yZWN0KHRleHR1cmVEYXRhLnJlZ2lvbi54LCB0ZXh0dXJlRGF0YS5yZWdpb24ueSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHR1cmVEYXRhLnJlZ2lvbi5oZWlnaHQsIHRleHR1cmVEYXRhLnJlZ2lvbi53aWR0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjdCA9IGNjLnJlY3QodGV4dHVyZURhdGEucmVnaW9uLngsIHRleHR1cmVEYXRhLnJlZ2lvbi55LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHVyZURhdGEucmVnaW9uLndpZHRoLCB0ZXh0dXJlRGF0YS5yZWdpb24uaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG9mZnNldCA9IGNjLnYyKDAsIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzaXplID0gY2Muc2l6ZShyZWN0LndpZHRoLCByZWN0LmhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHVyZURhdGEuc3ByaXRlRnJhbWUgPSBuZXcgY2MuU3ByaXRlRnJhbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0dXJlRGF0YS5zcHJpdGVGcmFtZS5zZXRUZXh0dXJlKHZhbHVlLCByZWN0LCBmYWxzZSwgb2Zmc2V0LCBzaXplKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGsgaW4gdGhpcy50ZXh0dXJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRleHR1cmVEYXRhID0gdGhpcy50ZXh0dXJlc1trXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHR1cmVEYXRhLnNwcml0ZUZyYW1lID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RhdGljczoge1xuICAgICAgICB0b1N0cmluZzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiW2NsYXNzIGRyYWdvbkJvbmVzLkNDVGV4dHVyZUF0bGFzRGF0YV1cIjtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfb25DbGVhcjogZnVuY3Rpb24gKCkge1xuICAgICAgICBkcmFnb25Cb25lcy5UZXh0dXJlQXRsYXNEYXRhLnByb3RvdHlwZS5fb25DbGVhci5jYWxsKHRoaXMpO1xuICAgICAgICB0aGlzLnJlbmRlclRleHR1cmUgPSBudWxsO1xuICAgIH0sXG5cbiAgICBjcmVhdGVUZXh0dXJlIDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBkcmFnb25Cb25lcy5CYXNlT2JqZWN0LmJvcnJvd09iamVjdChkcmFnb25Cb25lcy5DQ1RleHR1cmVEYXRhKTtcbiAgICB9XG5cblxufSk7XG5cbmRyYWdvbkJvbmVzLkNDVGV4dHVyZURhdGEgPSBjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogZHJhZ29uQm9uZXMuVGV4dHVyZURhdGEsXG4gICAgbmFtZTogXCJkcmFnb25Cb25lcy5DQ1RleHR1cmVEYXRhXCIsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHNwcml0ZUZyYW1lOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgc2VyaWFsaXphYmxlOiBmYWxzZVxuICAgICAgICB9LFxuICAgIH0sXG5cbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJbY2xhc3MgZHJhZ29uQm9uZXMuQ0NUZXh0dXJlRGF0YV1cIjtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfb25DbGVhcjogZnVuY3Rpb24gKCkge1xuICAgICAgICBkcmFnb25Cb25lcy5UZXh0dXJlRGF0YS5wcm90b3R5cGUuX29uQ2xlYXIuY2FsbCh0aGlzKTtcbiAgICAgICAgdGhpcy5zcHJpdGVGcmFtZSA9IG51bGw7XG4gICAgfVxufSk7XG4iXX0=