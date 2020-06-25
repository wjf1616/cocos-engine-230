
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/load-pipeline/released-asset-checker.js';
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
if (CC_DEBUG) {
  // checks if asset was releasable
  var ReleasedAssetChecker = function ReleasedAssetChecker() {
    // { dependKey: true }
    this._releasedKeys = js.createMap(true);
    this._dirty = false;
  }; // mark as released for further checking dependencies


  var getItemDesc = function getItemDesc(item) {
    if (item.uuid) {
      if (!tmpInfo) {
        tmpInfo = {
          path: "",
          type: null
        };
      }

      if (cc.loader._assetTables.assets._getInfo_DEBUG(item.uuid, tmpInfo)) {
        tmpInfo.path = 'resources/' + tmpInfo.path;
        return "\"" + tmpInfo.path + "\" (type: " + js.getClassName(tmpInfo.type) + ", uuid: " + item.uuid + ")";
      } else {
        return "\"" + item.rawUrl + "\" (" + item.uuid + ")";
      }
    } else {
      return "\"" + item.rawUrl + "\"";
    }
  };

  var doCheckCouldRelease = function doCheckCouldRelease(releasedKey, refOwnerItem, caches) {
    var loadedAgain = caches[releasedKey];

    if (!loadedAgain) {
      cc.log("\"" + releasedKey + "\" was released but maybe still referenced by " + getItemDesc(refOwnerItem));
    }
  }; // check dependencies


  var js = require('../platform/js');

  ReleasedAssetChecker.prototype.setReleased = function (item, releasedKey) {
    this._releasedKeys[releasedKey] = true;
    this._dirty = true;
  };

  var tmpInfo = null;

  ReleasedAssetChecker.prototype.checkCouldRelease = function (caches) {
    if (!this._dirty) {
      return;
    }

    this._dirty = false;
    var released = this._releasedKeys; // check loader cache

    for (var id in caches) {
      var item = caches[id];

      if (item.alias) {
        item = item.alias;
      }

      var depends = item.dependKeys;

      if (depends) {
        for (var i = 0; i < depends.length; ++i) {
          var depend = depends[i];

          if (released[depend]) {
            doCheckCouldRelease(depend, item, caches);
            delete released[depend];
          }
        }
      }
    } // // check current scene
    // let depends = cc.director.getScene().dependAssets;
    // for (let i = 0; i < depends.length; ++i) {
    //     let depend = depends[i];
    //     if (released[depend]) {
    //         doCheckCouldRelease(depend, item, caches);
    //         delete released[depend];
    //     }
    // }
    // clear released


    js.clear(released);
  };

  module.exports = ReleasedAssetChecker;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbGVhc2VkLWFzc2V0LWNoZWNrZXIuanMiXSwibmFtZXMiOlsiQ0NfREVCVUciLCJSZWxlYXNlZEFzc2V0Q2hlY2tlciIsIl9yZWxlYXNlZEtleXMiLCJqcyIsImNyZWF0ZU1hcCIsIl9kaXJ0eSIsImdldEl0ZW1EZXNjIiwiaXRlbSIsInV1aWQiLCJ0bXBJbmZvIiwicGF0aCIsInR5cGUiLCJjYyIsImxvYWRlciIsIl9hc3NldFRhYmxlcyIsImFzc2V0cyIsIl9nZXRJbmZvX0RFQlVHIiwiZ2V0Q2xhc3NOYW1lIiwicmF3VXJsIiwiZG9DaGVja0NvdWxkUmVsZWFzZSIsInJlbGVhc2VkS2V5IiwicmVmT3duZXJJdGVtIiwiY2FjaGVzIiwibG9hZGVkQWdhaW4iLCJsb2ciLCJyZXF1aXJlIiwicHJvdG90eXBlIiwic2V0UmVsZWFzZWQiLCJjaGVja0NvdWxkUmVsZWFzZSIsInJlbGVhc2VkIiwiaWQiLCJhbGlhcyIsImRlcGVuZHMiLCJkZXBlbmRLZXlzIiwiaSIsImxlbmd0aCIsImRlcGVuZCIsImNsZWFyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLElBQUlBLFFBQUosRUFBYztBQUlkO0FBSmMsTUFNTEMsb0JBTkssR0FNZCxTQUFTQSxvQkFBVCxHQUFpQztBQUM3QjtBQUNBLFNBQUtDLGFBQUwsR0FBcUJDLEVBQUUsQ0FBQ0MsU0FBSCxDQUFhLElBQWIsQ0FBckI7QUFDQSxTQUFLQyxNQUFMLEdBQWMsS0FBZDtBQUNILEdBVmEsRUFZZDs7O0FBWmMsTUFtQkxDLFdBbkJLLEdBbUJkLFNBQVNBLFdBQVQsQ0FBc0JDLElBQXRCLEVBQTRCO0FBQ3hCLFFBQUlBLElBQUksQ0FBQ0MsSUFBVCxFQUFlO0FBQ1gsVUFBSSxDQUFDQyxPQUFMLEVBQWM7QUFDVkEsUUFBQUEsT0FBTyxHQUFHO0FBQUVDLFVBQUFBLElBQUksRUFBRSxFQUFSO0FBQVlDLFVBQUFB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b3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmlmIChDQ19ERUJVRykge1xuXG52YXIganMgPSByZXF1aXJlKCcuLi9wbGF0Zm9ybS9qcycpO1xuXG4vLyBjaGVja3MgaWYgYXNzZXQgd2FzIHJlbGVhc2FibGVcblxuZnVuY3Rpb24gUmVsZWFzZWRBc3NldENoZWNrZXIgKCkge1xuICAgIC8vIHsgZGVwZW5kS2V5OiB0cnVlIH1cbiAgICB0aGlzLl9yZWxlYXNlZEtleXMgPSBqcy5jcmVhdGVNYXAodHJ1ZSk7XG4gICAgdGhpcy5fZGlydHkgPSBmYWxzZTtcbn1cblxuLy8gbWFyayBhcyByZWxlYXNlZCBmb3IgZnVydGhlciBjaGVja2luZyBkZXBlbmRlbmNpZXNcblJlbGVhc2VkQXNzZXRDaGVja2VyLnByb3RvdHlwZS5zZXRSZWxlYXNlZCA9IGZ1bmN0aW9uIChpdGVtLCByZWxlYXNlZEtleSkge1xuICAgIHRoaXMuX3JlbGVhc2VkS2V5c1tyZWxlYXNlZEtleV0gPSB0cnVlO1xuICAgIHRoaXMuX2RpcnR5ID0gdHJ1ZTtcbn07XG5cbnZhciB0bXBJbmZvID0gbnVsbDtcbmZ1bmN0aW9uIGdldEl0ZW1EZXNjIChpdGVtKSB7XG4gICAgaWYgKGl0ZW0udXVpZCkge1xuICAgICAgICBpZiAoIXRtcEluZm8pIHtcbiAgICAgICAgICAgIHRtcEluZm8gPSB7IHBhdGg6IFwiXCIsIHR5cGU6IG51bGwgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2MubG9hZGVyLl9hc3NldFRhYmxlcy5hc3NldHMuX2dldEluZm9fREVCVUcoaXRlbS51dWlkLCB0bXBJbmZvKSkge1xuICAgICAgICAgICAgdG1wSW5mby5wYXRoID0gJ3Jlc291cmNlcy8nICsgdG1wSW5mby5wYXRoO1xuICAgICAgICAgICAgcmV0dXJuIGBcIiR7dG1wSW5mby5wYXRofVwiICh0eXBlOiAke2pzLmdldENsYXNzTmFtZSh0bXBJbmZvLnR5cGUpfSwgdXVpZDogJHtpdGVtLnV1aWR9KWA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYFwiJHtpdGVtLnJhd1VybH1cIiAoJHtpdGVtLnV1aWR9KWA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBgXCIke2l0ZW0ucmF3VXJsfVwiYDtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRvQ2hlY2tDb3VsZFJlbGVhc2UgKHJlbGVhc2VkS2V5LCByZWZPd25lckl0ZW0sIGNhY2hlcykge1xuICAgIHZhciBsb2FkZWRBZ2FpbiA9IGNhY2hlc1tyZWxlYXNlZEtleV07XG4gICAgaWYgKCFsb2FkZWRBZ2Fpbikge1xuICAgICAgICBjYy5sb2coYFwiJHtyZWxlYXNlZEtleX1cIiB3YXMgcmVsZWFzZWQgYnV0IG1heWJlIHN0aWxsIHJlZmVyZW5jZWQgYnkgJHtnZXRJdGVtRGVzYyhyZWZPd25lckl0ZW0pfWApO1xuICAgIH1cbn1cblxuLy8gY2hlY2sgZGVwZW5kZW5jaWVzXG5SZWxlYXNlZEFzc2V0Q2hlY2tlci5wcm90b3R5cGUuY2hlY2tDb3VsZFJlbGVhc2UgPSBmdW5jdGlvbiAoY2FjaGVzKSB7XG4gICAgaWYgKCF0aGlzLl9kaXJ0eSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX2RpcnR5ID0gZmFsc2U7XG5cbiAgICB2YXIgcmVsZWFzZWQgPSB0aGlzLl9yZWxlYXNlZEtleXM7XG5cbiAgICAvLyBjaGVjayBsb2FkZXIgY2FjaGVcbiAgICBmb3IgKGxldCBpZCBpbiBjYWNoZXMpIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBjYWNoZXNbaWRdO1xuICAgICAgICBpZiAoaXRlbS5hbGlhcykge1xuICAgICAgICAgICAgaXRlbSA9IGl0ZW0uYWxpYXM7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGRlcGVuZHMgPSBpdGVtLmRlcGVuZEtleXM7XG4gICAgICAgIGlmIChkZXBlbmRzKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRlcGVuZHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBsZXQgZGVwZW5kID0gZGVwZW5kc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAocmVsZWFzZWRbZGVwZW5kXSkge1xuICAgICAgICAgICAgICAgICAgICBkb0NoZWNrQ291bGRSZWxlYXNlKGRlcGVuZCwgaXRlbSwgY2FjaGVzKTtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHJlbGVhc2VkW2RlcGVuZF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gLy8gY2hlY2sgY3VycmVudCBzY2VuZVxuICAgIC8vIGxldCBkZXBlbmRzID0gY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5kZXBlbmRBc3NldHM7XG4gICAgLy8gZm9yIChsZXQgaSA9IDA7IGkgPCBkZXBlbmRzLmxlbmd0aDsgKytpKSB7XG4gICAgLy8gICAgIGxldCBkZXBlbmQgPSBkZXBlbmRzW2ldO1xuICAgIC8vICAgICBpZiAocmVsZWFzZWRbZGVwZW5kXSkge1xuICAgIC8vICAgICAgICAgZG9DaGVja0NvdWxkUmVsZWFzZShkZXBlbmQsIGl0ZW0sIGNhY2hlcyk7XG4gICAgLy8gICAgICAgICBkZWxldGUgcmVsZWFzZWRbZGVwZW5kXTtcbiAgICAvLyAgICAgfVxuICAgIC8vIH1cblxuICAgIC8vIGNsZWFyIHJlbGVhc2VkXG4gICAganMuY2xlYXIocmVsZWFzZWQpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWxlYXNlZEFzc2V0Q2hlY2tlcjtcblxufVxuIl19