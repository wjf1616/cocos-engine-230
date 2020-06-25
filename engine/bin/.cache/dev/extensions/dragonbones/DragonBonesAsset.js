
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extensions/dragonbones/DragonBonesAsset.js';
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
 * !#en The skeleton data of dragonBones.
 * !#zh dragonBones 的 骨骼数据。
 * @class DragonBonesAsset
 * @extends Asset
 */


var DragonBonesAsset = cc.Class({
  name: 'dragonBones.DragonBonesAsset',
  "extends": cc.Asset,
  ctor: function ctor() {
    this.reset();
  },
  properties: {
    _dragonBonesJson: '',

    /**
     * !#en See http://developer.egret.com/cn/github/egret-docs/DB/dbLibs/dataFormat/index.html
     * !#zh 可查看 DragonBones 官方文档 http://developer.egret.com/cn/github/egret-docs/DB/dbLibs/dataFormat/index.html
     * @property {string} dragonBonesJson
     */
    dragonBonesJson: {
      get: function get() {
        return this._dragonBonesJson;
      },
      set: function set(value) {
        this._dragonBonesJson = value;
        this._dragonBonesJsonData = JSON.parse(value);
        this.reset();
      }
    },
    _nativeAsset: {
      get: function get() {
        return this._buffer;
      },
      set: function set(bin) {
        this._buffer = bin.buffer || bin;
        this.reset();
      },
      override: true
    }
  },
  statics: {
    preventDeferredLoadDependents: true
  },
  createNode: CC_EDITOR && function (callback) {
    var node = new cc.Node(this.name);
    var armatureDisplay = node.addComponent(dragonBones.ArmatureDisplay);
    armatureDisplay.dragonAsset = this;
    return callback(null, node);
  },
  reset: function reset() {
    this._clear();

    if (CC_EDITOR) {
      this._armaturesEnum = null;
    }
  },
  init: function init(factory, atlasUUID) {
    if (CC_EDITOR) {
      this._factory = factory || new dragonBones.CCFactory();
    } else {
      this._factory = factory;
    }

    if (!this._dragonBonesJsonData && this.dragonBonesJson) {
      this._dragonBonesJsonData = JSON.parse(this.dragonBonesJson);
    }

    var rawData = null;

    if (this._dragonBonesJsonData) {
      rawData = this._dragonBonesJsonData;
    } else {
      rawData = this._nativeAsset;
    } // If create by manual, uuid is empty.


    if (!this._uuid) {
      var dbData = this._factory.getDragonBonesDataByRawData(rawData);

      if (dbData) {
        this._uuid = dbData.name;
      } else {
        cc.warn('dragonbones name is empty');
      }
    }

    var armatureKey = this._uuid + "#" + atlasUUID;

    var dragonBonesData = this._factory.getDragonBonesData(armatureKey);

    if (dragonBonesData) return armatureKey;

    this._factory.parseDragonBonesData(rawData, armatureKey);

    return armatureKey;
  },
  // EDITOR
  getArmatureEnum: CC_EDITOR && function () {
    if (this._armaturesEnum) {
      return this._armaturesEnum;
    }

    this.init();

    var dragonBonesData = this._factory.getDragonBonesDataByUUID(this._uuid);

    if (dragonBonesData) {
      var armatureNames = dragonBonesData.armatureNames;
      var enumDef = {};

      for (var i = 0; i < armatureNames.length; i++) {
        var name = armatureNames[i];
        enumDef[name] = i;
      }

      return this._armaturesEnum = cc.Enum(enumDef);
    }

    return null;
  },
  getAnimsEnum: CC_EDITOR && function (armatureName) {
    this.init();

    var dragonBonesData = this._factory.getDragonBonesDataByUUID(this._uuid);

    if (dragonBonesData) {
      var armature = dragonBonesData.getArmature(armatureName);

      if (!armature) {
        return null;
      }

      var enumDef = {
        '<None>': 0
      };
      var anims = armature.animations;
      var i = 0;

      for (var animName in anims) {
        if (anims.hasOwnProperty(animName)) {
          enumDef[animName] = i + 1;
          i++;
        }
      }

      return cc.Enum(enumDef);
    }

    return null;
  },
  _clear: function _clear() {
    if (this._factory) {
      ArmatureCache.resetArmature(this._uuid);

      this._factory.removeDragonBonesDataByUUID(this._uuid, true);
    }
  },
  destroy: function destroy() {
    this._clear();

    this._super();
  }
});
dragonBones.DragonBonesAsset = module.exports = DragonBonesAsset;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRyYWdvbkJvbmVzQXNzZXQuanMiXSwibmFtZXMiOlsiQXJtYXR1cmVDYWNoZSIsIkNDX0pTQiIsInJlcXVpcmUiLCJzaGFyZWRDYWNoZSIsIkRyYWdvbkJvbmVzQXNzZXQiLCJjYyIsIkNsYXNzIiwibmFtZSIsIkFzc2V0IiwiY3RvciIsInJlc2V0IiwicHJvcGVydGllcyIsIl9kcmFnb25Cb25lc0pzb24iLCJkcmFnb25Cb25lc0pzb24iLCJnZXQiLCJzZXQiLCJ2YWx1ZSIsIl9kcmFnb25Cb25lc0pzb25EYXRhIiwiSlNPTiIsInBhcnNlIiwiX25hdGl2ZUFzc2V0IiwiX2J1ZmZlciIsImJpbiIsImJ1ZmZlciIsIm92ZXJyaWRlIiwic3RhdGljcyIsInByZXZlbnREZWZlcnJlZExvYWREZXBlbmRlbnRzIiwiY3JlYXRlTm9kZSIsIkNDX0VESVRPUiIsImNhbGxiYWNrIiwibm9kZSIsIk5vZGUiLCJhcm1hdHVyZURpc3BsYXkiLCJhZGRDb21wb25lbnQiLCJkcmFnb25Cb25lcyIsIkFybWF0dXJlRGlzcGxheSIsImRyYWdvbkFzc2V0IiwiX2NsZWFyIiwiX2FybWF0dXJlc0VudW0iLCJpbml0IiwiZmFjdG9yeSIsImF0bGFzVVVJRCIsIl9mYWN0b3J5IiwiQ0NGYWN0b3J5IiwicmF3RGF0YSIsIl91dWlkIiwiZGJEYXRhIiwiZ2V0RHJhZ29uQm9uZXNEYXRhQnlSYXdEYXRhIiwid2FybiIsImFybWF0dXJlS2V5IiwiZHJhZ29uQm9uZXNEYXRhIiwiZ2V0RHJhZ29uQm9uZXNEYXRhIiwicGFyc2VEcmFnb25Cb25lc0RhdGEiLCJnZXRBcm1hdHVyZUVudW0iLCJnZXREcmFnb25Cb25lc0RhdGFCeVVVSUQiLCJhcm1hdHVyZU5hbWVzIiwiZW51bURlZiIsImkiLCJsZW5ndGgiLCJFbnVtIiwiZ2V0QW5pbXNFbnVtIiwiYXJtYXR1cmVOYW1lIiwiYXJtYXR1cmUiLCJnZXRBcm1hdHVyZSIsImFuaW1zIiwiYW5pbWF0aW9ucyIsImFuaW1OYW1lIiwiaGFzT3duUHJvcGVydHkiLCJyZXNldEFybWF0dXJlIiwicmVtb3ZlRHJhZ29uQm9uZXNEYXRhQnlVVUlEIiwiZGVzdHJveSIsIl9zdXBlciIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkE7OztBQUdBLElBQUlBLGFBQWEsR0FBRyxDQUFDQyxNQUFELElBQVdDLE9BQU8sQ0FBQyxpQkFBRCxDQUFQLENBQTJCQyxXQUExRDtBQUVBOzs7Ozs7OztBQU1BLElBQUlDLGdCQUFnQixHQUFHQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUM1QkMsRUFBQUEsSUFBSSxFQUFFLDhCQURzQjtBQUU1QixhQUFTRixFQUFFLENBQUNHLEtBRmdCO0FBSTVCQyxFQUFBQSxJQUo0QixrQkFJcEI7QUFDSixTQUFLQyxLQUFMO0FBQ0gsR0FOMkI7QUFRNUJDLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxnQkFBZ0IsRUFBRyxFQURYOztBQUdSOzs7OztBQUtBQyxJQUFBQSxlQUFlLEVBQUc7QUFDZEMsTUFBQUEsR0FBRyxFQUFFLGVBQVk7QUFDYixlQUFPLEtBQUtGLGdCQUFaO0FBQ0gsT0FIYTtBQUlkRyxNQUFBQSxHQUFHLEVBQUUsYUFBVUMsS0FBVixFQUFpQjtBQUNsQixhQUFLSixnQkFBTCxHQUF3QkksS0FBeEI7QUFDQSxhQUFLQyxvQkFBTCxHQUE0QkMsSUFBSSxDQUFDQyxLQUFMLENBQVdILEtBQVgsQ0FBNUI7QUFDQSxhQUFLTixLQUFMO0FBQ0g7QUFSYSxLQVJWO0FBbUJSVSxJQUFBQSxZQUFZLEVBQUU7QUFDVk4sTUFBQUEsR0FEVSxpQkFDSDtBQUNILGVBQU8sS0FBS08sT0FBWjtBQUNILE9BSFM7QUFJVk4sTUFBQUEsR0FKVSxlQUlMTyxHQUpLLEVBSUE7QUFDTixhQUFLRCxPQUFMLEdBQWVDLEdBQUcsQ0FBQ0MsTUFBSixJQUFjRCxHQUE3QjtBQUNBLGFBQUtaLEtBQUw7QUFDSCxPQVBTO0FBUVZjLE1BQUFBLFFB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b0UsYUFBZCxDQUE0QixLQUFLdkIsS0FBakM7O0FBQ0EsV0FBS0gsUUFBTCxDQUFjMkIsMkJBQWQsQ0FBMEMsS0FBS3hCLEtBQS9DLEVBQXNELElBQXREO0FBQ0g7QUFDSixHQS9JMkI7QUFpSjVCeUIsRUFBQUEsT0FqSjRCLHFCQWlKakI7QUFDUCxTQUFLakMsTUFBTDs7QUFDQSxTQUFLa0MsTUFBTDtBQUNIO0FBcEoyQixDQUFULENBQXZCO0FBdUpBckMsV0FBVyxDQUFDOUIsZ0JBQVosR0FBK0JvRSxNQUFNLENBQUNDLE9BQVAsR0FBaUJyRSxnQkFBaEQiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qKlxuICogQG1vZHVsZSBkcmFnb25Cb25lc1xuICovXG5sZXQgQXJtYXR1cmVDYWNoZSA9ICFDQ19KU0IgJiYgcmVxdWlyZSgnLi9Bcm1hdHVyZUNhY2hlJykuc2hhcmVkQ2FjaGU7XG5cbi8qKlxuICogISNlbiBUaGUgc2tlbGV0b24gZGF0YSBvZiBkcmFnb25Cb25lcy5cbiAqICEjemggZHJhZ29uQm9uZXMg55qEIOmqqOmqvOaVsOaNruOAglxuICogQGNsYXNzIERyYWdvbkJvbmVzQXNzZXRcbiAqIEBleHRlbmRzIEFzc2V0XG4gKi9cbnZhciBEcmFnb25Cb25lc0Fzc2V0ID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdkcmFnb25Cb25lcy5EcmFnb25Cb25lc0Fzc2V0JyxcbiAgICBleHRlbmRzOiBjYy5Bc3NldCxcblxuICAgIGN0b3IgKCkge1xuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgfSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgX2RyYWdvbkJvbmVzSnNvbiA6ICcnLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFNlZSBodHRwOi8vZGV2ZWxvcGVyLmVncmV0LmNvbS9jbi9naXRodWIvZWdyZXQtZG9jcy9EQi9kYkxpYnMvZGF0YUZvcm1hdC9pbmRleC5odG1sXG4gICAgICAgICAqICEjemgg5Y+v5p+l55yLIERyYWdvbkJvbmVzIOWumOaWueaWh+ahoyBodHRwOi8vZGV2ZWxvcGVyLmVncmV0LmNvbS9jbi9naXRodWIvZWdyZXQtZG9jcy9EQi9kYkxpYnMvZGF0YUZvcm1hdC9pbmRleC5odG1sXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBkcmFnb25Cb25lc0pzb25cbiAgICAgICAgICovXG4gICAgICAgIGRyYWdvbkJvbmVzSnNvbiA6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9kcmFnb25Cb25lc0pzb247XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kcmFnb25Cb25lc0pzb24gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9kcmFnb25Cb25lc0pzb25EYXRhID0gSlNPTi5wYXJzZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIF9uYXRpdmVBc3NldDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYnVmZmVyO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAoYmluKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYnVmZmVyID0gYmluLmJ1ZmZlciB8fCBiaW47XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG92ZXJyaWRlOiB0cnVlXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIHN0YXRpY3M6IHtcbiAgICAgICAgcHJldmVudERlZmVycmVkTG9hZERlcGVuZGVudHM6IHRydWVcbiAgICB9LFxuXG4gICAgY3JlYXRlTm9kZTogQ0NfRURJVE9SICYmICBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIG5vZGUgPSBuZXcgY2MuTm9kZSh0aGlzLm5hbWUpO1xuICAgICAgICB2YXIgYXJtYXR1cmVEaXNwbGF5ID0gbm9kZS5hZGRDb21wb25lbnQoZHJhZ29uQm9uZXMuQXJtYXR1cmVEaXNwbGF5KTtcbiAgICAgICAgYXJtYXR1cmVEaXNwbGF5LmRyYWdvbkFzc2V0ID0gdGhpcztcblxuICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgbm9kZSk7XG4gICAgfSxcblxuICAgIHJlc2V0ICgpIHtcbiAgICAgICAgdGhpcy5fY2xlYXIoKTtcbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgdGhpcy5fYXJtYXR1cmVzRW51bSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgaW5pdCAoZmFjdG9yeSwgYXRsYXNVVUlEKSB7XG4gICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHRoaXMuX2ZhY3RvcnkgPSBmYWN0b3J5IHx8IG5ldyBkcmFnb25Cb25lcy5DQ0ZhY3RvcnkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2ZhY3RvcnkgPSBmYWN0b3J5O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLl9kcmFnb25Cb25lc0pzb25EYXRhICYmIHRoaXMuZHJhZ29uQm9uZXNKc29uKSB7XG4gICAgICAgICAgICB0aGlzLl9kcmFnb25Cb25lc0pzb25EYXRhID0gSlNPTi5wYXJzZSh0aGlzLmRyYWdvbkJvbmVzSnNvbik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmF3RGF0YSA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLl9kcmFnb25Cb25lc0pzb25EYXRhKSB7XG4gICAgICAgICAgICByYXdEYXRhID0gdGhpcy5fZHJhZ29uQm9uZXNKc29uRGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJhd0RhdGEgPSB0aGlzLl9uYXRpdmVBc3NldDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIGNyZWF0ZSBieSBtYW51YWwsIHV1aWQgaXMgZW1wdHkuXG4gICAgICAgIGlmICghdGhpcy5fdXVpZCkge1xuICAgICAgICAgICAgbGV0IGRiRGF0YSA9IHRoaXMuX2ZhY3RvcnkuZ2V0RHJhZ29uQm9uZXNEYXRhQnlSYXdEYXRhKHJhd0RhdGEpO1xuICAgICAgICAgICAgaWYgKGRiRGF0YSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3V1aWQgPSBkYkRhdGEubmFtZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybignZHJhZ29uYm9uZXMgbmFtZSBpcyBlbXB0eScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGFybWF0dXJlS2V5ID0gdGhpcy5fdXVpZCArIFwiI1wiICsgYXRsYXNVVUlEO1xuICAgICAgICBsZXQgZHJhZ29uQm9uZXNEYXRhID0gdGhpcy5fZmFjdG9yeS5nZXREcmFnb25Cb25lc0RhdGEoYXJtYXR1cmVLZXkpO1xuICAgICAgICBpZiAoZHJhZ29uQm9uZXNEYXRhKSByZXR1cm4gYXJtYXR1cmVLZXk7XG5cbiAgICAgICAgdGhpcy5fZmFjdG9yeS5wYXJzZURyYWdvbkJvbmVzRGF0YShyYXdEYXRhLCBhcm1hdHVyZUtleSk7XG4gICAgICAgIHJldHVybiBhcm1hdHVyZUtleTtcbiAgICB9LFxuXG4gICAgLy8gRURJVE9SXG5cbiAgICBnZXRBcm1hdHVyZUVudW06IENDX0VESVRPUiAmJiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9hcm1hdHVyZXNFbnVtKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXJtYXR1cmVzRW51bTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgbGV0IGRyYWdvbkJvbmVzRGF0YSA9IHRoaXMuX2ZhY3RvcnkuZ2V0RHJhZ29uQm9uZXNEYXRhQnlVVUlEKHRoaXMuX3V1aWQpO1xuICAgICAgICBpZiAoZHJhZ29uQm9uZXNEYXRhKSB7XG4gICAgICAgICAgICB2YXIgYXJtYXR1cmVOYW1lcyA9IGRyYWdvbkJvbmVzRGF0YS5hcm1hdHVyZU5hbWVzO1xuICAgICAgICAgICAgdmFyIGVudW1EZWYgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJtYXR1cmVOYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBuYW1lID0gYXJtYXR1cmVOYW1lc1tpXTtcbiAgICAgICAgICAgICAgICBlbnVtRGVmW25hbWVdID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hcm1hdHVyZXNFbnVtID0gY2MuRW51bShlbnVtRGVmKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgZ2V0QW5pbXNFbnVtOiBDQ19FRElUT1IgJiYgZnVuY3Rpb24gKGFybWF0dXJlTmFtZSkge1xuICAgICAgICB0aGlzLmluaXQoKTtcblxuICAgICAgICBsZXQgZHJhZ29uQm9uZXNEYXRhID0gdGhpcy5fZmFjdG9yeS5nZXREcmFnb25Cb25lc0RhdGFCeVVVSUQodGhpcy5fdXVpZCk7XG4gICAgICAgIGlmIChkcmFnb25Cb25lc0RhdGEpIHtcbiAgICAgICAgICAgIHZhciBhcm1hdHVyZSA9IGRyYWdvbkJvbmVzRGF0YS5nZXRBcm1hdHVyZShhcm1hdHVyZU5hbWUpO1xuICAgICAgICAgICAgaWYgKCFhcm1hdHVyZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZW51bURlZiA9IHsgJzxOb25lPic6IDAgfTtcbiAgICAgICAgICAgIHZhciBhbmltcyA9IGFybWF0dXJlLmFuaW1hdGlvbnM7XG4gICAgICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBhbmltTmFtZSBpbiBhbmltcykge1xuICAgICAgICAgICAgICAgIGlmIChhbmltcy5oYXNPd25Qcm9wZXJ0eShhbmltTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZW51bURlZlthbmltTmFtZV0gPSBpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjYy5FbnVtKGVudW1EZWYpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICBfY2xlYXIgKCkge1xuICAgICAgICBpZiAodGhpcy5fZmFjdG9yeSkge1xuICAgICAgICAgICAgQXJtYXR1cmVDYWNoZS5yZXNldEFybWF0dXJlKHRoaXMuX3V1aWQpO1xuICAgICAgICAgICAgdGhpcy5fZmFjdG9yeS5yZW1vdmVEcmFnb25Cb25lc0RhdGFCeVVVSUQodGhpcy5fdXVpZCwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZGVzdHJveSAoKSB7XG4gICAgICAgIHRoaXMuX2NsZWFyKCk7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgfSxcbn0pO1xuXG5kcmFnb25Cb25lcy5EcmFnb25Cb25lc0Fzc2V0ID0gbW9kdWxlLmV4cG9ydHMgPSBEcmFnb25Cb25lc0Fzc2V0O1xuIl19