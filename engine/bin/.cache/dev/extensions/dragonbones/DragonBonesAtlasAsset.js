
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extensions/dragonbones/DragonBonesAtlasAsset.js';
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
 * @module dragonBones
 */
var ArmatureCache = !CC_JSB && require('./ArmatureCache').sharedCache;
/**
 * !#en The skeleton atlas data of dragonBones.
 * !#zh dragonBones 的骨骼纹理数据。
 * @class DragonBonesAtlasAsset
 * @extends Asset
 */


var DragonBonesAtlasAsset = cc.Class({
  name: 'dragonBones.DragonBonesAtlasAsset',
  "extends": cc.Asset,
  ctor: function ctor() {
    this._clear();
  },
  properties: {
    _atlasJson: '',

    /**
     * @property {string} atlasJson
     */
    atlasJson: {
      get: function get() {
        return this._atlasJson;
      },
      set: function set(value) {
        this._atlasJson = value;
        this._atlasJsonData = JSON.parse(this.atlasJson);

        this._clear();
      }
    },
    _texture: {
      "default": null,
      type: cc.Texture2D,
      formerlySerializedAs: 'texture'
    },

    /**
     * @property {Texture2D} texture
     */
    texture: {
      get: function get() {
        return this._texture;
      },
      set: function set(value) {
        this._texture = value;

        this._clear();
      }
    },
    _textureAtlasData: null
  },
  statics: {
    preventDeferredLoadDependents: true
  },
  createNode: CC_EDITOR && function (callback) {
    var node = new cc.Node(this.name);
    var armatureDisplay = node.addComponent(dragonBones.ArmatureDisplay);
    armatureDisplay.dragonAtlasAsset = this;
    return callback(null, node);
  },
  init: function init(factory) {
    this._factory = factory;

    if (!this._atlasJsonData) {
      this._atlasJsonData = JSON.parse(this.atlasJson);
    }

    var atlasJsonObj = this._atlasJsonData; // If create by manual, uuid is empty.

    this._uuid = this._uuid || atlasJsonObj.name;

    if (this._textureAtlasData) {
      factory.addTextureAtlasData(this._textureAtlasData, this._uuid);
    } else {
      this._textureAtlasData = factory.parseTextureAtlasData(atlasJsonObj, this.texture, this._uuid);
    }
  },
  _clear: function _clear() {
    if (CC_JSB) return;

    if (this._factory) {
      ArmatureCache.resetArmature(this._uuid);

      this._factory.removeTextureAtlasData(this._uuid, true);

      this._factory.removeDragonBonesDataByUUID(this._uuid, true);
    }

    this._textureAtlasData = null;
  },
  destroy: function destroy() {
    this._clear();

    this._super();
  }
});
dragonBones.DragonBonesAtlasAsset = module.exports = DragonBonesAtlasAsset;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRyYWdvbkJvbmVzQXRsYXNBc3NldC5qcyJdLCJuYW1lcyI6WyJBcm1hdHVyZUNhY2hlIiwiQ0NfSlNCIiwicmVxdWlyZSIsInNoYXJlZENhY2hlIiwiRHJhZ29uQm9uZXNBdGxhc0Fzc2V0IiwiY2MiLCJDbGFzcyIsIm5hbWUiLCJBc3NldCIsImN0b3IiLCJfY2xlYXIiLCJwcm9wZXJ0aWVzIiwiX2F0bGFzSnNvbiIsImF0bGFzSnNvbiIsImdldCIsInNldCIsInZhbHVlIiwiX2F0bGFzSnNvbkRhdGEiLCJKU09OIiwicGFyc2UiLCJfdGV4dHVyZSIsInR5cGUiLCJUZXh0dXJlMkQiLCJmb3JtZXJseVNlcmlhbGl6ZWRBcyIsInRleHR1cmUiLCJfdGV4dHVyZUF0bGFzRGF0YSIsInN0YXRpY3MiLCJwcmV2ZW50RGVmZXJyZWRMb2FkRGVwZW5kZW50cyIsImNyZWF0ZU5vZGUiLCJDQ19FRElUT1IiLCJjYWxsYmFjayIsIm5vZGUiLCJOb2RlIiwiYXJtYXR1cmVEaXNwbGF5IiwiYWRkQ29tcG9uZW50IiwiZHJhZ29uQm9uZXMiLCJBcm1hdHVyZURpc3BsYXkiLCJkcmFnb25BdGxhc0Fzc2V0IiwiaW5pdCIsImZhY3RvcnkiLCJfZmFjdG9yeSIsImF0bGFzSnNvbk9iaiIsIl91dWlkIiwiYWRkVGV4dHVyZUF0bGFzRGF0YSIsInBhcnNlVGV4dHVyZUF0bGFzRGF0YSIsInJlc2V0QXJtYXR1cmUiLCJyZW1vdmVUZXh0dXJlQXRsYXNEYXRhIiwicmVtb3ZlRHJhZ29uQm9uZXNEYXRhQnlVVUlEIiwiZGVzdHJveSIsIl9zdXBlciIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkE7OztBQUdBLElBQUlBLGFBQWEsR0FBRyxDQUFDQyxNQUFELElBQVdDLE9BQU8sQ0FBQyxpQkFBRCxDQUFQLENBQTJCQyxXQUExRDtBQUVBOzs7Ozs7OztBQU1BLElBQUlDLHFCQUFxQixH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MUMsRUFBaUQsSUFBakQ7O0FBQ0EsV0FBS0YsUUFBTCxDQUFjTywyQkFBZCxDQUEwQyxLQUFLTCxLQUEvQyxFQUFzRCxJQUF0RDtBQUNIOztBQUNELFNBQUtqQixpQkFBTCxHQUF5QixJQUF6QjtBQUNILEdBdEZnQztBQXdGakN1QixFQUFBQSxPQXhGaUMscUJBd0Z0QjtBQUNQLFNBQUt0QyxNQUFMOztBQUNBLFNBQUt1QyxNQUFMO0FBQ0g7QUEzRmdDLENBQVQsQ0FBNUI7QUE4RkFkLFdBQVcsQ0FBQy9CLHFCQUFaLEdBQW9DOEMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCL0MscUJBQXJEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vKipcbiAqIEBtb2R1bGUgZHJhZ29uQm9uZXNcbiAqL1xubGV0IEFybWF0dXJlQ2FjaGUgPSAhQ0NfSlNCICYmIHJlcXVpcmUoJy4vQXJtYXR1cmVDYWNoZScpLnNoYXJlZENhY2hlO1xuXG4vKipcbiAqICEjZW4gVGhlIHNrZWxldG9uIGF0bGFzIGRhdGEgb2YgZHJhZ29uQm9uZXMuXG4gKiAhI3poIGRyYWdvbkJvbmVzIOeahOmqqOmqvOe6ueeQhuaVsOaNruOAglxuICogQGNsYXNzIERyYWdvbkJvbmVzQXRsYXNBc3NldFxuICogQGV4dGVuZHMgQXNzZXRcbiAqL1xudmFyIERyYWdvbkJvbmVzQXRsYXNBc3NldCA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnZHJhZ29uQm9uZXMuRHJhZ29uQm9uZXNBdGxhc0Fzc2V0JyxcbiAgICBleHRlbmRzOiBjYy5Bc3NldCxcblxuICAgIGN0b3IgKCkge1xuICAgICAgICB0aGlzLl9jbGVhcigpO1xuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIF9hdGxhc0pzb24gOiAnJyxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGF0bGFzSnNvblxuICAgICAgICAgKi9cbiAgICAgICAgYXRsYXNKc29uOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYXRsYXNKc29uO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXRsYXNKc29uID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXRsYXNKc29uRGF0YSA9IEpTT04ucGFyc2UodGhpcy5hdGxhc0pzb24pO1xuICAgICAgICAgICAgICAgIHRoaXMuX2NsZWFyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3RleHR1cmU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5UZXh0dXJlMkQsXG4gICAgICAgICAgICBmb3JtZXJseVNlcmlhbGl6ZWRBczogJ3RleHR1cmUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7VGV4dHVyZTJEfSB0ZXh0dXJlXG4gICAgICAgICAqL1xuICAgICAgICB0ZXh0dXJlOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZXh0dXJlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl90ZXh0dXJlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2xlYXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfdGV4dHVyZUF0bGFzRGF0YTogbnVsbCxcbiAgICB9LFxuXG4gICAgc3RhdGljczoge1xuICAgICAgICBwcmV2ZW50RGVmZXJyZWRMb2FkRGVwZW5kZW50czogdHJ1ZVxuICAgIH0sXG5cbiAgICBjcmVhdGVOb2RlOiBDQ19FRElUT1IgJiYgIGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICB2YXIgbm9kZSA9IG5ldyBjYy5Ob2RlKHRoaXMubmFtZSk7XG4gICAgICAgIHZhciBhcm1hdHVyZURpc3BsYXkgPSBub2RlLmFkZENvbXBvbmVudChkcmFnb25Cb25lcy5Bcm1hdHVyZURpc3BsYXkpO1xuICAgICAgICBhcm1hdHVyZURpc3BsYXkuZHJhZ29uQXRsYXNBc3NldCA9IHRoaXM7XG5cbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIG5vZGUpO1xuICAgIH0sXG5cbiAgICBpbml0IChmYWN0b3J5KSB7XG4gICAgICAgIHRoaXMuX2ZhY3RvcnkgPSBmYWN0b3J5O1xuXG4gICAgICAgIGlmICghdGhpcy5fYXRsYXNKc29uRGF0YSkge1xuICAgICAgICAgICAgdGhpcy5fYXRsYXNKc29uRGF0YSA9IEpTT04ucGFyc2UodGhpcy5hdGxhc0pzb24pO1xuICAgICAgICB9XG4gICAgICAgIGxldCBhdGxhc0pzb25PYmogPSB0aGlzLl9hdGxhc0pzb25EYXRhO1xuXG4gICAgICAgIC8vIElmIGNyZWF0ZSBieSBtYW51YWwsIHV1aWQgaXMgZW1wdHkuXG4gICAgICAgIHRoaXMuX3V1aWQgPSB0aGlzLl91dWlkIHx8IGF0bGFzSnNvbk9iai5uYW1lO1xuXG4gICAgICAgIGlmICh0aGlzLl90ZXh0dXJlQXRsYXNEYXRhKSB7XG4gICAgICAgICAgICBmYWN0b3J5LmFkZFRleHR1cmVBdGxhc0RhdGEodGhpcy5fdGV4dHVyZUF0bGFzRGF0YSwgdGhpcy5fdXVpZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl90ZXh0dXJlQXRsYXNEYXRhID0gZmFjdG9yeS5wYXJzZVRleHR1cmVBdGxhc0RhdGEoYXRsYXNKc29uT2JqLCB0aGlzLnRleHR1cmUsIHRoaXMuX3V1aWQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9jbGVhciAoKSB7XG4gICAgICAgIGlmIChDQ19KU0IpIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMuX2ZhY3RvcnkpIHtcbiAgICAgICAgICAgIEFybWF0dXJlQ2FjaGUucmVzZXRBcm1hdHVyZSh0aGlzLl91dWlkKTtcbiAgICAgICAgICAgIHRoaXMuX2ZhY3RvcnkucmVtb3ZlVGV4dHVyZUF0bGFzRGF0YSh0aGlzLl91dWlkLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuX2ZhY3RvcnkucmVtb3ZlRHJhZ29uQm9uZXNEYXRhQnlVVUlEKHRoaXMuX3V1aWQsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3RleHR1cmVBdGxhc0RhdGEgPSBudWxsO1xuICAgIH0sXG5cbiAgICBkZXN0cm95ICgpIHtcbiAgICAgICAgdGhpcy5fY2xlYXIoKTtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICB9LFxufSk7XG5cbmRyYWdvbkJvbmVzLkRyYWdvbkJvbmVzQXRsYXNBc3NldCA9IG1vZHVsZS5leHBvcnRzID0gRHJhZ29uQm9uZXNBdGxhc0Fzc2V0O1xuIl19