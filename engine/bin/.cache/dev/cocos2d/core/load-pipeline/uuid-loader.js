
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/load-pipeline/uuid-loader.js';
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
var MissingClass = CC_EDITOR && Editor.require('app://editor/page/scene-utils/missing-class-reporter').MissingClass;

var js = require('../platform/js');

var debug = require('../CCDebug');

require('../platform/deserialize');

var LoadingItems = require('./loading-items');

function isSceneObj(json) {
  var SCENE_ID = 'cc.Scene';
  var PREFAB_ID = 'cc.Prefab';
  return json && (json[0] && json[0].__type__ === SCENE_ID || json[1] && json[1].__type__ === SCENE_ID || json[0] && json[0].__type__ === PREFAB_ID);
}

function parseDepends(item, asset, tdInfo, deferredLoadRawAssetsInRuntime) {
  var uuidList = tdInfo.uuidList;
  var objList = tdInfo.uuidObjList;
  var propList = tdInfo.uuidPropList;
  var stillUseUrl = tdInfo._stillUseUrl;
  var depends;
  var i, dependUuid; // cache dependencies for auto release

  var dependKeys = item.dependKeys = [];

  if (deferredLoadRawAssetsInRuntime) {
    depends = []; // parse depends assets

    for (i = 0; i < uuidList.length; i++) {
      dependUuid = uuidList[i];
      var obj = objList[i];
      var prop = propList[i];

      var info = cc.AssetLibrary._getAssetInfoInRuntime(dependUuid);

      if (info.raw) {
        // skip preloading raw assets
        var url = info.url;
        obj[prop] = url;
        dependKeys.push(url);
      } else {
        // declare depends assets
        depends.push({
          type: 'uuid',
          uuid: dependUuid,
          deferredLoadRaw: true,
          _owner: obj,
          _ownerProp: prop,
          _stillUseUrl: stillUseUrl[i]
        });
      }
    }
  } else {
    depends = new Array(uuidList.length); // declare depends assets

    for (i = 0; i < uuidList.length; i++) {
      dependUuid = uuidList[i];
      depends[i] = {
        type: 'uuid',
        uuid: dependUuid,
        _owner: objList[i],
        _ownerProp: propList[i],
        _stillUseUrl: stillUseUrl[i]
      };
    } // load native object (Image/Audio) as depends


    if (asset._native && !asset.constructor.preventPreloadNativeObject) {
      depends.push({
        url: asset.nativeUrl,
        _owner: asset,
        _ownerProp: '_nativeAsset'
      });
    }
  }

  return depends;
}

function loadDepends(pipeline, item, asset, depends, callback) {
  // Predefine content for dependencies usage
  item.content = asset;
  var dependKeys = item.dependKeys;
  pipeline.flowInDeps(item, depends, function (errors, items) {
    var item, missingAssetReporter;
    var itemsMap = items.map;

    for (var src in itemsMap) {
      item = itemsMap[src];

      if (item.uuid && item.content) {
        item.content._uuid = item.uuid;
      }
    }

    function loadCallback(item) {
      var value = item.content;

      if (this._stillUseUrl) {
        value = value && cc.RawAsset.wasRawAssetType(value.constructor) ? value.nativeUrl : item.rawUrl;
      }

      if (this._ownerProp === '_nativeAsset') {
        this._owner.url = item.url;
      }

      this._owner[this._ownerProp] = value;

      if (item.uuid !== asset._uuid && dependKeys.indexOf(item.id) < 0) {
        dependKeys.push(item.id);
      }
    }

    for (var i = 0; i < depends.length; i++) {
      var dep = depends[i];
      var dependSrc = dep.uuid;
      var dependUrl = dep.url;
      var dependObj = dep._owner;
      var dependProp = dep._ownerProp;
      item = itemsMap[dependUrl];

      if (!item) {
        continue;
      }

      var loadCallbackCtx = dep;

      if (item.complete || item.content) {
        if (item.error) {
          if (CC_EDITOR && item.error.errorCode === 'db.NOTFOUND') {
            if (!missingAssetReporter) {
              var MissingObjectReporter = Editor.require('app://editor/page/scene-utils/missing-object-reporter');

              missingAssetReporter = new MissingObjectReporter(asset);
            }

            missingAssetReporter.stashByOwner(dependObj, dependProp, Editor.serialize.asAsset(dependSrc));
          } else {
            cc._throw(item.error.message || item.error.errorMessage || item.error);
          }
        } else {
          loadCallback.call(loadCallbackCtx, item);
        }
      } else {
        // item was removed from cache, but ready in pipeline actually
        var queue = LoadingItems.getQueue(item); // Hack to get a better behavior

        var list = queue._callbackTable[dependSrc];

        if (list) {
          list.unshift(loadCallback, loadCallbackCtx);
        } else {
          queue.addListener(dependSrc, loadCallback, loadCallbackCtx);
        }
      }
    } // Emit dependency errors in runtime, but not in editor,
    // because editor need to open the scene / prefab to let user fix missing asset issues


    if (CC_EDITOR && missingAssetReporter) {
      missingAssetReporter.reportByOwner();
      callback(null, asset);
    } else {
      if (!errors && asset.onLoad) {
        try {
          asset.onLoad();
        } catch (e) {
          cc._throw(e);
        }
      }

      callback(errors, asset);
    }
  });
} // can deferred load raw assets in runtime


function canDeferredLoad(asset, item, isScene) {
  if (CC_EDITOR) {
    return false;
  }

  var res = item.deferredLoadRaw;

  if (res) {
    // check if asset support deferred
    if (asset instanceof cc.Asset && asset.constructor.preventDeferredLoadDependents) {
      res = false;
    }
  } else if (isScene) {
    if (asset instanceof cc.SceneAsset || asset instanceof cc.Prefab) {
      res = asset.asyncLoadAssets; //if (res) {
      //    cc.log('deferred load raw assets for ' + item.id);
      //}
    }
  }

  return res;
}

function loadUuid(item, callback) {
  var json;

  if (typeof item.content === 'string') {
    try {
      json = JSON.parse(item.content);
    } catch (e) {
      return new Error(debug.getError(4923, item.id, e.stack));
    }
  } else if (typeof item.content === 'object') {
    json = item.content;
  } else {
    return new Error(debug.getError(4924));
  }

  var classFinder, missingClass;
  var isScene = isSceneObj(json);

  if (isScene) {
    if (CC_EDITOR) {
      missingClass = MissingClass;

      classFinder = function classFinder(type, data, owner, propName) {
        var res = missingClass.classFinder(type, data, owner, propName);

        if (res) {
          return res;
        }

        return cc._MissingScript.getMissingWrapper(type, data);
      };

      classFinder.onDereferenced = missingClass.classFinder.onDereferenced;
    } else {
      classFinder = cc._MissingScript.safeFindClass;
    }
  } else {
    classFinder = function classFinder(id) {
      var cls = js._getClassById(id);

      if (cls) {
        return cls;
      }

      cc.warnID(4903, id);
      return Object;
    };
  }

  var tdInfo = cc.deserialize.Details.pool.get();
  var asset;

  try {
    asset = cc.deserialize(json, tdInfo, {
      classFinder: classFinder,
      target: item.existingAsset,
      customEnv: item
    });
  } catch (e) {
    cc.deserialize.Details.pool.put(tdInfo);
    var err = CC_JSB || CC_RUNTIME ? e + '\n' + e.stack : e.stack;
    return new Error(debug.getError(4925, item.id, err));
  }

  asset._uuid = item.uuid;
  asset.url = asset.nativeUrl;

  if (CC_EDITOR && missingClass) {
    missingClass.reportMissingClass(asset);
    missingClass.reset();
  }

  var deferredLoad = canDeferredLoad(asset, item, isScene);
  var depends = parseDepends(item, asset, tdInfo, deferredLoad);
  cc.deserialize.Details.pool.put(tdInfo);

  if (depends.length === 0) {
    if (asset.onLoad) asset.onLoad();
    return callback(null, asset);
  }

  loadDepends(this.pipeline, item, asset, depends, callback);
}

module.exports = loadUuid;
loadUuid.isSceneObj = isSceneObj;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV1aWQtbG9hZGVyLmpzIl0sIm5hbWVzIjpbIk1pc3NpbmdDbGFzcyIsIkNDX0VESVRPUiIsIkVkaXRvciIsInJlcXVpcmUiLCJqcyIsImRlYnVnIiwiTG9hZGluZ0l0ZW1zIiwiaXNTY2VuZU9iaiIsImpzb24iLCJTQ0VORV9JRCIsIlBSRUZBQl9JRCIsIl9fdHlwZV9fIiwicGFyc2VEZXBlbmRzIiwiaXRlbSIsImFzc2V0IiwidGRJbmZvIiwiZGVmZXJyZWRMb2FkUmF3QXNzZXRzSW5SdW50aW1lIiwidXVpZExpc3QiLCJvYmpMaXN0IiwidXVpZE9iakxpc3QiLCJwcm9wTGlzdCIsInV1aWRQcm9wTGlzdCIsInN0aWxsVXNlVXJsIiwiX3N0aWxsVXNlVXJsIiwiZGVwZW5kcyIsImkiLCJkZXBlbmRVdWlkIiwiZGVwZW5kS2V5cyIsImxlbmd0aCIsIm9iaiIsInByb3AiLCJpbmZvIiwiY2MiLCJBc3NldExpYnJhcnkiLCJfZ2V0QXNzZXRJbmZvSW5SdW50aW1lIiwicmF3IiwidXJsIiwicHVzaCIsInR5cGUiLCJ1dWlkIiwiZGVmZXJyZWRMb2FkUmF3IiwiX293bmVyIiwiX293bmVyUHJvcCIsIkFycmF5IiwiX25hdGl2ZSIsImNvbnN0cnVjdG9yIiwicHJldmVudFByZWxvYWROYXRpdmVPYmplY3QiLCJuYXRpdmVVcmwiLCJsb2FkRGVwZW5kcyIsInBpcGVsaW5lIiwiY2FsbGJhY2siLCJjb250ZW50IiwiZmxvd0luRGVwcyIsImVycm9ycyIsIml0ZW1zIiwibWlzc2luZ0Fzc2V0UmVwb3J0ZXIiLCJpdGVtc01hcCIsIm1hcCIsInNyYyIsIl91dWlkIiwibG9hZENhbGxiYWNrIiwidmFsdWUiLCJSYXdBc3NldCIsIndhc1Jhd0Fzc2V0VHlwZSIsInJhd1VybCIsImluZGV4T2YiLCJpZCIsImRlcCIsImRlcGVuZFNyYyIsImRlcGVuZFVybCIsImRlcGVuZE9iaiIsImRlcGVuZFByb3AiLCJsb2FkQ2FsbGJhY2tDdHgiLCJjb21wbGV0ZSIsImVycm9yIiwiZXJyb3JDb2RlIiwiTWlzc2luZ09iamVjdFJlcG9ydGVyIiwic3Rhc2hCeU93bmVyIiwic2VyaWFsaXplIiwiYXNBc3NldCIsIl90aHJvdyIsIm1lc3NhZ2UiLCJlcnJvck1lc3NhZ2UiLCJjYWxsIiwicXVldWUiLCJnZXRRdWV1ZSIsImxpc3QiLCJfY2FsbGJhY2tUYWJsZSIsInVuc2hpZnQiLCJhZGRMaXN0ZW5lciIsInJlcG9ydEJ5T3duZXIiLCJvbkxvYWQiLCJlIiwiY2FuRGVmZXJyZWRMb2FkIiwiaXNTY2VuZSIsInJlcyIsIkFzc2V0IiwicHJldmVudERlZmVycmVkTG9hZERlcGVuZGVudHMiLCJTY2VuZUFzc2V0IiwiUHJlZmFiIiwiYXN5bmNMb2FkQXNzZXRzIiwibG9hZFV1aWQiLCJKU09OIiwicGFyc2UiLCJFcnJvciIsImdldEVycm9yIiwic3RhY2siLCJjbGFzc0ZpbmRlciIsIm1pc3NpbmdDbGFzcyIsImRhdGEiLCJvd25lciIsInByb3BOYW1lIiwiX01pc3NpbmdTY3JpcHQiLCJnZXRNaXNzaW5nV3JhcHBlciIsIm9uRGVyZWZlcmVuY2VkIiwic2FmZUZpbmRDbGFzcyIsImNscyIsIl9nZXRDbGFzc0J5SWQiLCJ3YXJuSUQiLCJPYmplY3QiLCJkZXNlcmlhbGl6ZSIsIkRldGFpbHMiLCJwb29sIiwiZ2V0IiwidGFyZ2V0IiwiZXhpc3RpbmdBc3NldCIsImN1c3RvbUVudiIsInB1dCIsImVyciIsIkNDX0pTQiIsIkNDX1JVTlRJTUUiLCJyZXBvcnRNaXNzaW5nQ2xhc3MiLCJyZXNldCIsImRlZmVycmVkTG9hZCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFNQSxZQUFZLEdBQUdDLFNBQVMsSUFBSUMsTUFBTSxDQUFDQyxPQUFQLENBQWUsc0RBQWYsRUFBdUVILFlBQXpHOztBQUNBLElBQU1JLEVBQUUsR0FBR0QsT0FBTyxDQUFDLGdCQUFELENBQWxCOztBQUNBLElBQU1FLEtB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T0FBTyxHQUFHWixZQUFZLENBQUNDLElBQUQsRUFBT0MsS0FBUCxFQUFjQyxNQUFkLEVBQXNCc0gsWUFBdEIsQ0FBMUI7QUFFQXJHLEVBQUFBLEVBQUUsQ0FBQ3dGLFdBQUgsQ0FBZUMsT0FBZixDQUF1QkMsSUFBdkIsQ0FBNEJLLEdBQTVCLENBQWdDaEgsTUFBaEM7O0FBRUEsTUFBSVMsT0FBTyxDQUFDSSxNQUFSLEtBQW1CLENBQXZCLEVBQTBCO0FBQ3RCLFFBQUlkLEtBQUssQ0FBQzZFLE1BQVYsRUFBa0I3RSxLQUFLLENBQUM2RSxNQUFOO0FBQ2xCLFdBQU96QyxRQUFRLENBQUMsSUFBRCxFQUFPcEMsS0FBUCxDQUFmO0FBQ0g7O0FBQ0RrQyxFQUFBQSxXQUFXLENBQUMsS0FBS0MsUUFBTixFQUFnQnBDLElBQWhCLEVBQXNCQyxLQUF0QixFQUE2QlUsT0FBN0IsRUFBc0MwQixRQUF0QyxDQUFYO0FBQ0g7O0FBRURvRixNQUFNLENBQUNDLE9BQVAsR0FBaUJsQyxRQUFqQjtBQUNBQSxRQUFRLENBQUM5RixVQUFULEdBQXNCQSxVQUF0QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuY29uc3QgTWlzc2luZ0NsYXNzID0gQ0NfRURJVE9SICYmIEVkaXRvci5yZXF1aXJlKCdhcHA6Ly9lZGl0b3IvcGFnZS9zY2VuZS11dGlscy9taXNzaW5nLWNsYXNzLXJlcG9ydGVyJykuTWlzc2luZ0NsYXNzO1xuY29uc3QganMgPSByZXF1aXJlKCcuLi9wbGF0Zm9ybS9qcycpO1xuY29uc3QgZGVidWcgPSByZXF1aXJlKCcuLi9DQ0RlYnVnJyk7XG5yZXF1aXJlKCcuLi9wbGF0Zm9ybS9kZXNlcmlhbGl6ZScpO1xuY29uc3QgTG9hZGluZ0l0ZW1zID0gcmVxdWlyZSgnLi9sb2FkaW5nLWl0ZW1zJyk7XG5cbmZ1bmN0aW9uIGlzU2NlbmVPYmogKGpzb24pIHtcbiAgICB2YXIgU0NFTkVfSUQgPSAnY2MuU2NlbmUnO1xuICAgIHZhciBQUkVGQUJfSUQgPSAnY2MuUHJlZmFiJztcbiAgICByZXR1cm4ganNvbiAmJiAoXG4gICAgICAgICAgICAgICAoanNvblswXSAmJiBqc29uWzBdLl9fdHlwZV9fID09PSBTQ0VORV9JRCkgfHxcbiAgICAgICAgICAgICAgIChqc29uWzFdICYmIGpzb25bMV0uX190eXBlX18gPT09IFNDRU5FX0lEKSB8fFxuICAgICAgICAgICAgICAgKGpzb25bMF0gJiYganNvblswXS5fX3R5cGVfXyA9PT0gUFJFRkFCX0lEKVxuICAgICAgICAgICApO1xufVxuXG5mdW5jdGlvbiBwYXJzZURlcGVuZHMgKGl0ZW0sIGFzc2V0LCB0ZEluZm8sIGRlZmVycmVkTG9hZFJhd0Fzc2V0c0luUnVudGltZSkge1xuICAgIHZhciB1dWlkTGlzdCA9IHRkSW5mby51dWlkTGlzdDtcbiAgICB2YXIgb2JqTGlzdCA9IHRkSW5mby51dWlkT2JqTGlzdDtcbiAgICB2YXIgcHJvcExpc3QgPSB0ZEluZm8udXVpZFByb3BMaXN0O1xuICAgIHZhciBzdGlsbFVzZVVybCA9IHRkSW5mby5fc3RpbGxVc2VVcmw7XG4gICAgdmFyIGRlcGVuZHM7XG4gICAgdmFyIGksIGRlcGVuZFV1aWQ7XG4gICAgLy8gY2FjaGUgZGVwZW5kZW5jaWVzIGZvciBhdXRvIHJlbGVhc2VcbiAgICB2YXIgZGVwZW5kS2V5cyA9IGl0ZW0uZGVwZW5kS2V5cyA9IFtdO1xuXG4gICAgaWYgKGRlZmVycmVkTG9hZFJhd0Fzc2V0c0luUnVudGltZSkge1xuICAgICAgICBkZXBlbmRzID0gW107XG4gICAgICAgIC8vIHBhcnNlIGRlcGVuZHMgYXNzZXRzXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB1dWlkTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZGVwZW5kVXVpZCA9IHV1aWRMaXN0W2ldO1xuICAgICAgICAgICAgdmFyIG9iaiA9IG9iakxpc3RbaV07XG4gICAgICAgICAgICB2YXIgcHJvcCA9IHByb3BMaXN0W2ldO1xuICAgICAgICAgICAgdmFyIGluZm8gPSBjYy5Bc3NldExpYnJhcnkuX2dldEFzc2V0SW5mb0luUnVudGltZShkZXBlbmRVdWlkKTtcbiAgICAgICAgICAgIGlmIChpbmZvLnJhdykge1xuICAgICAgICAgICAgICAgIC8vIHNraXAgcHJlbG9hZGluZyByYXcgYXNzZXRzXG4gICAgICAgICAgICAgICAgdmFyIHVybCA9IGluZm8udXJsO1xuICAgICAgICAgICAgICAgIG9ialtwcm9wXSA9IHVybDtcbiAgICAgICAgICAgICAgICBkZXBlbmRLZXlzLnB1c2godXJsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGRlY2xhcmUgZGVwZW5kcyBhc3NldHNcbiAgICAgICAgICAgICAgICBkZXBlbmRzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAndXVpZCcsXG4gICAgICAgICAgICAgICAgICAgIHV1aWQ6IGRlcGVuZFV1aWQsXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkTG9hZFJhdzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgX293bmVyOiBvYmosXG4gICAgICAgICAgICAgICAgICAgIF9vd25lclByb3A6IHByb3AsXG4gICAgICAgICAgICAgICAgICAgIF9zdGlsbFVzZVVybDogc3RpbGxVc2VVcmxbaV1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZGVwZW5kcyA9IG5ldyBBcnJheSh1dWlkTGlzdC5sZW5ndGgpO1xuXG4gICAgICAgIC8vIGRlY2xhcmUgZGVwZW5kcyBhc3NldHNcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHV1aWRMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBkZXBlbmRVdWlkID0gdXVpZExpc3RbaV07XG4gICAgICAgICAgICBkZXBlbmRzW2ldID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICd1dWlkJyxcbiAgICAgICAgICAgICAgICB1dWlkOiBkZXBlbmRVdWlkLFxuICAgICAgICAgICAgICAgIF9vd25lcjogb2JqTGlzdFtpXSxcbiAgICAgICAgICAgICAgICBfb3duZXJQcm9wOiBwcm9wTGlzdFtpXSxcbiAgICAgICAgICAgICAgICBfc3RpbGxVc2VVcmw6IHN0aWxsVXNlVXJsW2ldXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbG9hZCBuYXRpdmUgb2JqZWN0IChJbWFnZS9BdWRpbykgYXMgZGVwZW5kc1xuICAgICAgICBpZiAoYXNzZXQuX25hdGl2ZSAmJiAhYXNzZXQuY29uc3RydWN0b3IucHJldmVudFByZWxvYWROYXRpdmVPYmplY3QpIHtcbiAgICAgICAgICAgIGRlcGVuZHMucHVzaCh7XG4gICAgICAgICAgICAgICAgdXJsOiBhc3NldC5uYXRpdmVVcmwsXG4gICAgICAgICAgICAgICAgX293bmVyOiBhc3NldCxcbiAgICAgICAgICAgICAgICBfb3duZXJQcm9wOiAnX25hdGl2ZUFzc2V0JyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlcGVuZHM7XG59XG5cbmZ1bmN0aW9uIGxvYWREZXBlbmRzIChwaXBlbGluZSwgaXRlbSwgYXNzZXQsIGRlcGVuZHMsIGNhbGxiYWNrKSB7XG4gICAgLy8gUHJlZGVmaW5lIGNvbnRlbnQgZm9yIGRlcGVuZGVuY2llcyB1c2FnZVxuICAgIGl0ZW0uY29udGVudCA9IGFzc2V0O1xuICAgIHZhciBkZXBlbmRLZXlzID0gaXRlbS5kZXBlbmRLZXlzO1xuICAgIHBpcGVsaW5lLmZsb3dJbkRlcHMoaXRlbSwgZGVwZW5kcywgZnVuY3Rpb24gKGVycm9ycywgaXRlbXMpIHtcbiAgICAgICAgdmFyIGl0ZW0sIG1pc3NpbmdBc3NldFJlcG9ydGVyO1xuICAgICAgICB2YXIgaXRlbXNNYXAgPSBpdGVtcy5tYXA7XG4gICAgICAgIGZvciAodmFyIHNyYyBpbiBpdGVtc01hcCkge1xuICAgICAgICAgICAgaXRlbSA9IGl0ZW1zTWFwW3NyY107XG4gICAgICAgICAgICBpZiAoaXRlbS51dWlkICYmIGl0ZW0uY29udGVudCkge1xuICAgICAgICAgICAgICAgIGl0ZW0uY29udGVudC5fdXVpZCA9IGl0ZW0udXVpZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGxvYWRDYWxsYmFjayAoaXRlbSkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gaXRlbS5jb250ZW50O1xuICAgICAgICAgICAgaWYgKHRoaXMuX3N0aWxsVXNlVXJsKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSAodmFsdWUgJiYgY2MuUmF3QXNzZXQud2FzUmF3QXNzZXRUeXBlKHZhbHVlLmNvbnN0cnVjdG9yKSkgPyB2YWx1ZS5uYXRpdmVVcmwgOiBpdGVtLnJhd1VybDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl9vd25lclByb3AgPT09ICdfbmF0aXZlQXNzZXQnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb3duZXIudXJsID0gaXRlbS51cmw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9vd25lclt0aGlzLl9vd25lclByb3BdID0gdmFsdWU7XG4gICAgICAgICAgICBpZiAoaXRlbS51dWlkICE9PSBhc3NldC5fdXVpZCAmJiBkZXBlbmRLZXlzLmluZGV4T2YoaXRlbS5pZCkgPCAwKSB7XG4gICAgICAgICAgICAgICAgZGVwZW5kS2V5cy5wdXNoKGl0ZW0uaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRlcGVuZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBkZXAgPSBkZXBlbmRzW2ldO1xuICAgICAgICAgICAgdmFyIGRlcGVuZFNyYyA9IGRlcC51dWlkO1xuICAgICAgICAgICAgdmFyIGRlcGVuZFVybCA9IGRlcC51cmw7XG4gICAgICAgICAgICB2YXIgZGVwZW5kT2JqID0gZGVwLl9vd25lcjtcbiAgICAgICAgICAgIHZhciBkZXBlbmRQcm9wID0gZGVwLl9vd25lclByb3A7XG4gICAgICAgICAgICBpdGVtID0gaXRlbXNNYXBbZGVwZW5kVXJsXTtcbiAgICAgICAgICAgIGlmICghaXRlbSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbG9hZENhbGxiYWNrQ3R4ID0gZGVwO1xuXG4gICAgICAgICAgICBpZiAoaXRlbS5jb21wbGV0ZSB8fCBpdGVtLmNvbnRlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoQ0NfRURJVE9SICYmIGl0ZW0uZXJyb3IuZXJyb3JDb2RlID09PSAnZGIuTk9URk9VTkQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW1pc3NpbmdBc3NldFJlcG9ydGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIE1pc3NpbmdPYmplY3RSZXBvcnRlciA9IEVkaXRvci5yZXF1aXJlKCdhcHA6Ly9lZGl0b3IvcGFnZS9zY2VuZS11dGlscy9taXNzaW5nLW9iamVjdC1yZXBvcnRlcicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pc3NpbmdBc3NldFJlcG9ydGVyID0gbmV3IE1pc3NpbmdPYmplY3RSZXBvcnRlcihhc3NldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBtaXNzaW5nQXNzZXRSZXBvcnRlci5zdGFzaEJ5T3duZXIoZGVwZW5kT2JqLCBkZXBlbmRQcm9wLCBFZGl0b3Iuc2VyaWFsaXplLmFzQXNzZXQoZGVwZW5kU3JjKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5fdGhyb3coaXRlbS5lcnJvci5tZXNzYWdlIHx8IGl0ZW0uZXJyb3IuZXJyb3JNZXNzYWdlIHx8IGl0ZW0uZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsb2FkQ2FsbGJhY2suY2FsbChsb2FkQ2FsbGJhY2tDdHgsIGl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGl0ZW0gd2FzIHJlbW92ZWQgZnJvbSBjYWNoZSwgYnV0IHJlYWR5IGluIHBpcGVsaW5lIGFjdHVhbGx5XG4gICAgICAgICAgICAgICAgdmFyIHF1ZXVlID0gTG9hZGluZ0l0ZW1zLmdldFF1ZXVlKGl0ZW0pO1xuICAgICAgICAgICAgICAgIC8vIEhhY2sgdG8gZ2V0IGEgYmV0dGVyIGJlaGF2aW9yXG4gICAgICAgICAgICAgICAgdmFyIGxpc3QgPSBxdWV1ZS5fY2FsbGJhY2tUYWJsZVtkZXBlbmRTcmNdO1xuICAgICAgICAgICAgICAgIGlmIChsaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3QudW5zaGlmdChsb2FkQ2FsbGJhY2ssIGxvYWRDYWxsYmFja0N0eCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBxdWV1ZS5hZGRMaXN0ZW5lcihkZXBlbmRTcmMsIGxvYWRDYWxsYmFjaywgbG9hZENhbGxiYWNrQ3R4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gRW1pdCBkZXBlbmRlbmN5IGVycm9ycyBpbiBydW50aW1lLCBidXQgbm90IGluIGVkaXRvcixcbiAgICAgICAgLy8gYmVjYXVzZSBlZGl0b3IgbmVlZCB0byBvcGVuIHRoZSBzY2VuZSAvIHByZWZhYiB0byBsZXQgdXNlciBmaXggbWlzc2luZyBhc3NldCBpc3N1ZXNcbiAgICAgICAgaWYgKENDX0VESVRPUiAmJiBtaXNzaW5nQXNzZXRSZXBvcnRlcikge1xuICAgICAgICAgICAgbWlzc2luZ0Fzc2V0UmVwb3J0ZXIucmVwb3J0QnlPd25lcigpO1xuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgYXNzZXQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFlcnJvcnMgJiYgYXNzZXQub25Mb2FkKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgYXNzZXQub25Mb2FkKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLl90aHJvdyhlKTtcbiAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3JzLCBhc3NldCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuLy8gY2FuIGRlZmVycmVkIGxvYWQgcmF3IGFzc2V0cyBpbiBydW50aW1lXG5mdW5jdGlvbiBjYW5EZWZlcnJlZExvYWQgKGFzc2V0LCBpdGVtLCBpc1NjZW5lKSB7XG4gICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciByZXMgPSBpdGVtLmRlZmVycmVkTG9hZFJhdztcbiAgICBpZiAocmVzKSB7XG4gICAgICAgIC8vIGNoZWNrIGlmIGFzc2V0IHN1cHBvcnQgZGVmZXJyZWRcbiAgICAgICAgaWYgKChhc3NldCBpbnN0YW5jZW9mIGNjLkFzc2V0KSAmJiBhc3NldC5jb25zdHJ1Y3Rvci5wcmV2ZW50RGVmZXJyZWRMb2FkRGVwZW5kZW50cykge1xuICAgICAgICAgICAgcmVzID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoaXNTY2VuZSkge1xuICAgICAgICBpZiAoYXNzZXQgaW5zdGFuY2VvZiBjYy5TY2VuZUFzc2V0IHx8IGFzc2V0IGluc3RhbmNlb2YgY2MuUHJlZmFiKSB7XG4gICAgICAgICAgICByZXMgPSBhc3NldC5hc3luY0xvYWRBc3NldHM7XG4gICAgICAgICAgICAvL2lmIChyZXMpIHtcbiAgICAgICAgICAgIC8vICAgIGNjLmxvZygnZGVmZXJyZWQgbG9hZCByYXcgYXNzZXRzIGZvciAnICsgaXRlbS5pZCk7XG4gICAgICAgICAgICAvL31cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuXG5mdW5jdGlvbiBsb2FkVXVpZCAoaXRlbSwgY2FsbGJhY2spIHtcbiAgICB2YXIganNvbjtcbiAgICBpZiAodHlwZW9mIGl0ZW0uY29udGVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGpzb24gPSBKU09OLnBhcnNlKGl0ZW0uY29udGVudCk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoZGVidWcuZ2V0RXJyb3IoNDkyMywgaXRlbS5pZCwgZS5zdGFjaykpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBpdGVtLmNvbnRlbnQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGpzb24gPSBpdGVtLmNvbnRlbnQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gbmV3IEVycm9yKGRlYnVnLmdldEVycm9yKDQ5MjQpKTtcbiAgICB9XG5cbiAgICB2YXIgY2xhc3NGaW5kZXIsIG1pc3NpbmdDbGFzcztcbiAgICB2YXIgaXNTY2VuZSA9IGlzU2NlbmVPYmooanNvbik7XG4gICAgaWYgKGlzU2NlbmUpIHtcbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgbWlzc2luZ0NsYXNzID0gTWlzc2luZ0NsYXNzO1xuICAgICAgICAgICAgY2xhc3NGaW5kZXIgPSBmdW5jdGlvbiAodHlwZSwgZGF0YSwgb3duZXIsIHByb3BOYW1lKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlcyA9IG1pc3NpbmdDbGFzcy5jbGFzc0ZpbmRlcih0eXBlLCBkYXRhLCBvd25lciwgcHJvcE5hbWUpO1xuICAgICAgICAgICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNjLl9NaXNzaW5nU2NyaXB0LmdldE1pc3NpbmdXcmFwcGVyKHR5cGUsIGRhdGEpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNsYXNzRmluZGVyLm9uRGVyZWZlcmVuY2VkID0gbWlzc2luZ0NsYXNzLmNsYXNzRmluZGVyLm9uRGVyZWZlcmVuY2VkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2xhc3NGaW5kZXIgPSBjYy5fTWlzc2luZ1NjcmlwdC5zYWZlRmluZENsYXNzO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjbGFzc0ZpbmRlciA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgdmFyIGNscyA9IGpzLl9nZXRDbGFzc0J5SWQoaWQpO1xuICAgICAgICAgICAgaWYgKGNscykge1xuICAgICAgICAgICAgICAgIHJldHVybiBjbHM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYy53YXJuSUQoNDkwMywgaWQpO1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgdGRJbmZvID0gY2MuZGVzZXJpYWxpemUuRGV0YWlscy5wb29sLmdldCgpO1xuXG4gICAgdmFyIGFzc2V0O1xuICAgIHRyeSB7XG4gICAgICAgIGFzc2V0ID0gY2MuZGVzZXJpYWxpemUoanNvbiwgdGRJbmZvLCB7XG4gICAgICAgICAgICBjbGFzc0ZpbmRlcjogY2xhc3NGaW5kZXIsXG4gICAgICAgICAgICB0YXJnZXQ6IGl0ZW0uZXhpc3RpbmdBc3NldCxcbiAgICAgICAgICAgIGN1c3RvbUVudjogaXRlbVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgY2MuZGVzZXJpYWxpemUuRGV0YWlscy5wb29sLnB1dCh0ZEluZm8pO1xuICAgICAgICB2YXIgZXJyID0gQ0NfSlNCIHx8IENDX1JVTlRJTUUgPyAoZSArICdcXG4nICsgZS5zdGFjaykgOiBlLnN0YWNrO1xuICAgICAgICByZXR1cm4gbmV3IEVycm9yKGRlYnVnLmdldEVycm9yKDQ5MjUsIGl0ZW0uaWQsIGVycikpO1xuICAgIH1cblxuICAgIGFzc2V0Ll91dWlkID0gaXRlbS51dWlkO1xuICAgIGFzc2V0LnVybCA9IGFzc2V0Lm5hdGl2ZVVybDtcblxuICAgIGlmIChDQ19FRElUT1IgJiYgbWlzc2luZ0NsYXNzKSB7XG4gICAgICAgIG1pc3NpbmdDbGFzcy5yZXBvcnRNaXNzaW5nQ2xhc3MoYXNzZXQpO1xuICAgICAgICBtaXNzaW5nQ2xhc3MucmVzZXQoKTtcbiAgICB9XG5cbiAgICB2YXIgZGVmZXJyZWRMb2FkID0gY2FuRGVmZXJyZWRMb2FkKGFzc2V0LCBpdGVtLCBpc1NjZW5lKTtcbiAgICB2YXIgZGVwZW5kcyA9IHBhcnNlRGVwZW5kcyhpdGVtLCBhc3NldCwgdGRJbmZvLCBkZWZlcnJlZExvYWQpO1xuXG4gICAgY2MuZGVzZXJpYWxpemUuRGV0YWlscy5wb29sLnB1dCh0ZEluZm8pO1xuXG4gICAgaWYgKGRlcGVuZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGlmIChhc3NldC5vbkxvYWQpIGFzc2V0Lm9uTG9hZCgpO1xuICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgYXNzZXQpO1xuICAgIH1cbiAgICBsb2FkRGVwZW5kcyh0aGlzLnBpcGVsaW5lLCBpdGVtLCBhc3NldCwgZGVwZW5kcywgY2FsbGJhY2spO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxvYWRVdWlkO1xubG9hZFV1aWQuaXNTY2VuZU9iaiA9IGlzU2NlbmVPYmo7XG4iXX0=