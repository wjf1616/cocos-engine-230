
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/CCBitmapFont.js';
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
var FontLetterDefinition = function FontLetterDefinition() {
  this.u = 0;
  this.v = 0;
  this.w = 0;
  this.h = 0;
  this.offsetX = 0;
  this.offsetY = 0;
  this.textureID = 0;
  this.valid = false;
  this.xAdvance = 0;
};

var FontAtlas = function FontAtlas(texture) {
  this._letterDefinitions = {};
  this._texture = texture;
};

FontAtlas.prototype = {
  constructor: FontAtlas,
  addLetterDefinitions: function addLetterDefinitions(letter, letterDefinition) {
    this._letterDefinitions[letter] = letterDefinition;
  },
  cloneLetterDefinition: function cloneLetterDefinition() {
    var copyLetterDefinitions = {};

    for (var key in this._letterDefinitions) {
      var value = new FontLetterDefinition();
      cc.js.mixin(value, this._letterDefinitions[key]);
      copyLetterDefinitions[key] = value;
    }

    return copyLetterDefinitions;
  },
  getTexture: function getTexture() {
    return this._texture;
  },
  getLetter: function getLetter(key) {
    return this._letterDefinitions[key];
  },
  getLetterDefinitionForChar: function getLetterDefinitionForChar(_char) {
    var key = _char.charCodeAt(0);

    var hasKey = this._letterDefinitions.hasOwnProperty(key);

    var letter;

    if (hasKey) {
      letter = this._letterDefinitions[key];
    } else {
      letter = null;
    }

    return letter;
  },
  clear: function clear() {
    this._letterDefinitions = {};
  }
};
/**
 * @module cc
 */

/**
 * !#en Class for BitmapFont handling.
 * !#zh 位图字体资源类。
 * @class BitmapFont
 * @extends Font
 *
 */

var BitmapFont = cc.Class({
  name: 'cc.BitmapFont',
  "extends": cc.Font,
  properties: {
    fntDataStr: {
      "default": ''
    },
    spriteFrame: {
      "default": null,
      type: cc.SpriteFrame
    },
    fontSize: {
      "default": -1
    },
    //用来缓存 BitmapFont 解析之后的数据
    _fntConfig: null,
    _fontDefDictionary: null
  },
  onLoad: function onLoad() {
    var spriteFrame = this.spriteFrame;

    if (!this._fontDefDictionary && spriteFrame) {
      this._fontDefDictionary = new FontAtlas(spriteFrame._texture);
    }

    var fntConfig = this._fntConfig;

    if (!fntConfig) {
      return;
    }

    var fontDict = fntConfig.fontDefDictionary;

    for (var fontDef in fontDict) {
      var letter = new FontLetterDefinition();
      var rect = fontDict[fontDef].rect;
      letter.offsetX = fontDict[fontDef].xOffset;
      letter.offsetY = fontDict[fontDef].yOffset;
      letter.w = rect.width;
      letter.h = rect.height;
      letter.u = rect.x;
      letter.v = rect.y; //FIXME: only one texture supported for now

      letter.textureID = 0;
      letter.valid = true;
      letter.xAdvance = fontDict[fontDef].xAdvance;

      this._fontDefDictionary.addLetterDefinitions(fontDef, letter);
    }
  }
});
cc.BitmapFont = BitmapFont;
cc.BitmapFont.FontLetterDefinition = FontLetterDefinition;
cc.BitmapFont.FontAtlas = FontAtlas;
module.exports = BitmapFont;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDQml0bWFwRm9udC5qcyJdLCJuYW1lcyI6WyJGb250TGV0dGVyRGVmaW5pdGlvbiIsInUiLCJ2IiwidyIsImgiLCJvZmZzZXRYIiwib2Zmc2V0WSIsInRleHR1cmVJRCIsInZhbGlkIiwieEFkdmFuY2UiLCJGb250QXRsYXMiLCJ0ZXh0dXJlIiwiX2xldHRlckRlZmluaXRpb25zIiwiX3RleHR1cmUiLCJwcm90b3R5cGUiLCJjb25zdHJ1Y3RvciIsImFkZExldHRlckRlZmluaXRpb25zIiwibGV0dGVyIiwibGV0dGVyRGVmaW5pdGlvbiIsImNsb25lTGV0dGVyRGVmaW5pdGlvbiIsImNvcHlMZXR0ZXJEZWZpbml0aW9ucyIsImtleSIsInZhbHVlIiwiY2MiLCJqcyIsIm1peGluIiwiZ2V0VGV4dHVyZSIsImdldExldHRlciIsImdldExldHRlckRlZmluaXRpb25Gb3JDaGFyIiwiY2hhciIsImNoYXJDb2RlQXQiLCJoYXNLZXkiLCJoYXNPd25Qcm9wZXJ0eSIsImNsZWFyIiwiQml0bWFwRm9udCIsIkNsYXNzIiwibmFtZSIsIkZvbnQiLCJwcm9wZXJ0aWVzIiwiZm50RGF0YVN0ciIsInNwcml0ZUZyYW1lIiwidHlwZSIsIlNwcml0ZUZyYW1lIiwiZm9udFNpemUiLCJfZm50Q29uZmlnIiwiX2ZvbnREZWZEaWN0aW9uYXJ5Iiwib25Mb2FkIiwiZm50Q29uZmlnIiwiZm9udERpY3QiLCJmb250RGVmRGljdGlvbmFyeSIsImZvbnREZWYiLCJyZWN0IiwieE9mZnNldCIsInlPZmZzZXQiLCJ3aWR0aCIsImhlaWdodCIsIngiLCJ5IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLElBQUlBLG9CQUFvQixHQUFHLFNBQXZCQSxvQkFBdUIsR0FBVztBQUNsQyxPQUFLQyxDQUFMLEdBQVMsQ0FBVDtBQUNBLE9BQUtDLENBQUwsR0FBUyxDQUFUO0FBQ0EsT0FBS0MsQ0FB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QjdCLG9CQUF4QixDQUE2Q2tDLE9BQTdDLEVBQXNEakMsTUFBdEQ7QUFDSDtBQUNKO0FBbERxQixDQUFULENBQWpCO0FBcURBTSxFQUFFLENBQUNXLFVBQUgsR0FBZ0JBLFVBQWhCO0FBQ0FYLEVBQUUsQ0FBQ1csVUFBSCxDQUFjbEMsb0JBQWQsR0FBcUNBLG9CQUFyQztBQUNBdUIsRUFBRSxDQUFDVyxVQUFILENBQWN4QixTQUFkLEdBQTBCQSxTQUExQjtBQUNBZ0QsTUFBTSxDQUFDQyxPQUFQLEdBQWlCekIsVUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmxldCBGb250TGV0dGVyRGVmaW5pdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudSA9IDA7XG4gICAgdGhpcy52ID0gMDtcbiAgICB0aGlzLncgPSAwO1xuICAgIHRoaXMuaCA9IDA7XG4gICAgdGhpcy5vZmZzZXRYID0gMDtcbiAgICB0aGlzLm9mZnNldFkgPSAwO1xuICAgIHRoaXMudGV4dHVyZUlEID0gMDtcbiAgICB0aGlzLnZhbGlkID0gZmFsc2U7XG4gICAgdGhpcy54QWR2YW5jZSA9IDA7XG59O1xuXG5sZXQgRm9udEF0bGFzID0gZnVuY3Rpb24gKHRleHR1cmUpIHtcbiAgICB0aGlzLl9sZXR0ZXJEZWZpbml0aW9ucyA9IHt9O1xuICAgIHRoaXMuX3RleHR1cmUgPSB0ZXh0dXJlO1xufTtcblxuRm9udEF0bGFzLnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogRm9udEF0bGFzLFxuICAgIGFkZExldHRlckRlZmluaXRpb25zIChsZXR0ZXIsIGxldHRlckRlZmluaXRpb24pIHtcbiAgICAgICAgdGhpcy5fbGV0dGVyRGVmaW5pdGlvbnNbbGV0dGVyXSA9IGxldHRlckRlZmluaXRpb247XG4gICAgfSxcbiAgICBjbG9uZUxldHRlckRlZmluaXRpb24gKCkge1xuICAgICAgICBsZXQgY29weUxldHRlckRlZmluaXRpb25zID0ge307XG4gICAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLl9sZXR0ZXJEZWZpbml0aW9ucykge1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gbmV3IEZvbnRMZXR0ZXJEZWZpbml0aW9uKCk7XG4gICAgICAgICAgICBjYy5qcy5taXhpbih2YWx1ZSwgdGhpcy5fbGV0dGVyRGVmaW5pdGlvbnNba2V5XSk7XG4gICAgICAgICAgICBjb3B5TGV0dGVyRGVmaW5pdGlvbnNba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3B5TGV0dGVyRGVmaW5pdGlvbnM7XG4gICAgfSxcbiAgICBnZXRUZXh0dXJlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RleHR1cmU7XG4gICAgfSxcbiAgICBnZXRMZXR0ZXIgKGtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGV0dGVyRGVmaW5pdGlvbnNba2V5XTtcbiAgICB9LFxuICAgIGdldExldHRlckRlZmluaXRpb25Gb3JDaGFyIChjaGFyKSB7XG4gICAgICAgIGxldCBrZXkgPSBjaGFyLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgIGxldCBoYXNLZXkgPSB0aGlzLl9sZXR0ZXJEZWZpbml0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpO1xuICAgICAgICBsZXQgbGV0dGVyO1xuICAgICAgICBpZiAoaGFzS2V5KSB7XG4gICAgICAgICAgICBsZXR0ZXIgPSB0aGlzLl9sZXR0ZXJEZWZpbml0aW9uc1trZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0dGVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGV0dGVyO1xuICAgIH0sXG4gICAgY2xlYXIgKCkge1xuICAgICAgICB0aGlzLl9sZXR0ZXJEZWZpbml0aW9ucyA9IHt9O1xuICAgIH1cbn07XG5cbi8qKlxuICogQG1vZHVsZSBjY1xuICovXG4vKipcbiAqICEjZW4gQ2xhc3MgZm9yIEJpdG1hcEZvbnQgaGFuZGxpbmcuXG4gKiAhI3poIOS9jeWbvuWtl+S9k+i1hOa6kOexu+OAglxuICogQGNsYXNzIEJpdG1hcEZvbnRcbiAqIEBleHRlbmRzIEZvbnRcbiAqXG4gKi9cbnZhciBCaXRtYXBGb250ID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5CaXRtYXBGb250JyxcbiAgICBleHRlbmRzOiBjYy5Gb250LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBmbnREYXRhU3RyOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAnJ1xuICAgICAgICB9LFxuXG4gICAgICAgIHNwcml0ZUZyYW1lOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlRnJhbWVcbiAgICAgICAgfSxcblxuICAgICAgICBmb250U2l6ZToge1xuICAgICAgICAgICAgZGVmYXVsdDogLTFcbiAgICAgICAgfSxcbiAgICAgICAgLy/nlKjmnaXnvJPlrZggQml0bWFwRm9udCDop6PmnpDkuYvlkI7nmoTmlbDmja5cbiAgICAgICAgX2ZudENvbmZpZzogbnVsbCxcbiAgICAgICAgX2ZvbnREZWZEaWN0aW9uYXJ5OiBudWxsXG4gICAgfSxcblxuICAgIG9uTG9hZCAoKSB7XG4gICAgICAgIGxldCBzcHJpdGVGcmFtZSA9IHRoaXMuc3ByaXRlRnJhbWU7XG4gICAgICAgIGlmICghdGhpcy5fZm9udERlZkRpY3Rpb25hcnkgJiYgc3ByaXRlRnJhbWUpIHtcbiAgICAgICAgICAgIHRoaXMuX2ZvbnREZWZEaWN0aW9uYXJ5ID0gbmV3IEZvbnRBdGxhcyhzcHJpdGVGcmFtZS5fdGV4dHVyZSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZm50Q29uZmlnID0gdGhpcy5fZm50Q29uZmlnO1xuICAgICAgICBpZiAoIWZudENvbmZpZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmb250RGljdCA9IGZudENvbmZpZy5mb250RGVmRGljdGlvbmFyeTtcbiAgICAgICAgZm9yIChsZXQgZm9udERlZiBpbiBmb250RGljdCkge1xuICAgICAgICAgICAgbGV0IGxldHRlciA9IG5ldyBGb250TGV0dGVyRGVmaW5pdGlvbigpO1xuXG4gICAgICAgICAgICBsZXQgcmVjdCA9IGZvbnREaWN0W2ZvbnREZWZdLnJlY3Q7XG4gICAgICAgICAgICBsZXR0ZXIub2Zmc2V0WCA9IGZvbnREaWN0W2ZvbnREZWZdLnhPZmZzZXQ7XG4gICAgICAgICAgICBsZXR0ZXIub2Zmc2V0WSA9IGZvbnREaWN0W2ZvbnREZWZdLnlPZmZzZXQ7XG4gICAgICAgICAgICBsZXR0ZXIudyA9IHJlY3Qud2lkdGg7XG4gICAgICAgICAgICBsZXR0ZXIuaCA9IHJlY3QuaGVpZ2h0O1xuICAgICAgICAgICAgbGV0dGVyLnUgPSByZWN0Lng7XG4gICAgICAgICAgICBsZXR0ZXIudiA9IHJlY3QueTtcbiAgICAgICAgICAgIC8vRklYTUU6IG9ubHkgb25lIHRleHR1cmUgc3VwcG9ydGVkIGZvciBub3dcbiAgICAgICAgICAgIGxldHRlci50ZXh0dXJlSUQgPSAwO1xuICAgICAgICAgICAgbGV0dGVyLnZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgIGxldHRlci54QWR2YW5jZSA9IGZvbnREaWN0W2ZvbnREZWZdLnhBZHZhbmNlO1xuXG4gICAgICAgICAgICB0aGlzLl9mb250RGVmRGljdGlvbmFyeS5hZGRMZXR0ZXJEZWZpbml0aW9ucyhmb250RGVmLCBsZXR0ZXIpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLkJpdG1hcEZvbnQgPSBCaXRtYXBGb250O1xuY2MuQml0bWFwRm9udC5Gb250TGV0dGVyRGVmaW5pdGlvbiA9IEZvbnRMZXR0ZXJEZWZpbml0aW9uO1xuY2MuQml0bWFwRm9udC5Gb250QXRsYXMgPSBGb250QXRsYXM7XG5tb2R1bGUuZXhwb3J0cyA9IEJpdG1hcEZvbnQ7XG4iXX0=