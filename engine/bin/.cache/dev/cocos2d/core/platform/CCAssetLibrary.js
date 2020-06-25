
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/CCAssetLibrary.js';
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
var Asset = require('../assets/CCAsset');

var callInNextTick = require('./utils').callInNextTick;

var Loader = require('../load-pipeline/CCLoader');

var AssetTable = require('../load-pipeline/asset-table');

var PackDownloader = require('../load-pipeline/pack-downloader');

var AutoReleaseUtils = require('../load-pipeline/auto-release-utils');

var decodeUuid = require('../utils/decode-uuid');

var MD5Pipe = require('../load-pipeline/md5-pipe');

var SubPackPipe = require('../load-pipeline/subpackage-pipe');

var js = require('./js');
/**
 * The asset library which managing loading/unloading assets in project.
 *
 * @class AssetLibrary
 * @static
 */
// configs


var _libraryBase = '';
var _rawAssetsBase = ''; // The base dir for raw assets in runtime

var _uuidToRawAsset = js.createMap(true);

function isScene(asset) {
  return asset && (asset.constructor === cc.SceneAsset || asset instanceof cc.Scene);
} // types


function RawAssetEntry(url, type) {
  this.url = url;
  this.type = type;
} // publics


var AssetLibrary = {
  /**
   * @callback loadCallback
   * @param {String} error - null or the error info
   * @param {Asset} data - the loaded asset or null
   */

  /**
   * @method loadAsset
   * @param {String} uuid
   * @param {loadCallback} callback - the callback function once load finished
   * @param {Object} options
   * @param {Boolean} options.readMainCache - Default is true. If false, the asset and all its depends assets will reload and create new instances from library.
   * @param {Boolean} options.writeMainCache - Default is true. If true, the result will cache to AssetLibrary, and MUST be unload by user manually.
   * @param {Asset} options.existingAsset - load to existing asset, this argument is only available in editor
   * @private
   */
  loadAsset: function loadAsset(uuid, callback, options) {
    if (typeof uuid !== 'string') {
      return callInNextTick(callback, new Error('[AssetLibrary] uuid must be string'), null);
    } // var readMainCache = typeof (options && options.readMainCache) !== 'undefined' ? readMainCache : true;
    // var writeMainCache = typeof (options && options.writeMainCache) !== 'undefined' ? writeMainCache : true;


    var item = {
      uuid: uuid,
      type: 'uuid'
    };

    if (options && options.existingAsset) {
      item.existingAsset = options.existingAsset;
    }

    Loader.load(item, function (error, asset) {
      if (error || !asset) {
        var errorInfo = typeof error === 'string' ? error : error ? error.message || error.errorMessage || JSON.stringify(error) : 'Unknown error';
        error = new Error('[AssetLibrary] loading JSON or dependencies failed:' + errorInfo);
      } else {
        if (asset.constructor === cc.SceneAsset) {
          if (CC_EDITOR && !asset.scene) {
            Editor.error('Sorry, the scene data of "%s" is corrupted!', uuid);
          } else {
            var key = cc.loader._getReferenceKey(uuid);

            asset.scene.dependAssets = AutoReleaseUtils.getDependsRecursively(key);
          }
        }

        if (CC_EDITOR || isScene(asset)) {
          var id = cc.loader._getReferenceKey(uuid);

          Loader.removeItem(id);
        }
      }

      if (callback) {
        callback(error, asset);
      }
    });
  },
  getLibUrlNoExt: function getLibUrlNoExt(uuid, inRawAssetsDir) {
    if (CC_BUILD) {
      uuid = decodeUuid(uuid);
    }

    var base = CC_BUILD && inRawAssetsDir ? _rawAssetsBase + 'assets/' : _libraryBase;
    return base + uuid.slice(0, 2) + '/' + uuid;
  },
  _queryAssetInfoInEditor: function _queryAssetInfoInEditor(uuid, callback) {
    if (CC_EDITOR) {
      Editor.Ipc.sendToMain('scene:query-asset-info-by-uuid', uuid, function (err, info) {
        if (info) {
          Editor.Utils.UuidCache.cache(info.url, uuid);
          var ctor = Editor.assets[info.type];

          if (ctor) {
            var isRawAsset = !js.isChildClassOf(ctor, Asset);
            callback(null, info.url, isRawAsset, ctor);
          } else {
            callback(new Error('Can not find asset type ' + info.type));
          }
        } else {
          var error = new Error('Can not get asset url by uuid "' + uuid + '", the asset may be deleted.');
          error.errorCode = 'db.NOTFOUND';
          callback(error);
        }
      }, -1);
    }
  },
  _getAssetInfoInRuntime: function _getAssetInfoInRuntime(uuid, result) {
    result = result || {
      url: null,
      raw: false
    };
    var info = _uuidToRawAsset[uuid];

    if (info && !js.isChildClassOf(info.type, cc.Asset)) {
      // backward compatibility since 1.10
      result.url = _rawAssetsBase + info.url;
      result.raw = true;
    } else {
      result.url = this.getLibUrlNoExt(uuid) + '.json';
      result.raw = false;
    }

    return result;
  },
  _uuidInSettings: function _uuidInSettings(uuid) {
    return uuid in _uuidToRawAsset;
  },

  /**
   * @method queryAssetInfo
   * @param {String} uuid
   * @param {Function} callback
   * @param {Error} callback.error
   * @param {String} callback.url - the url of raw asset or imported asset
   * @param {Boolean} callback.raw - indicates whether the asset is raw asset
   * @param {Function} callback.ctorInEditor - the actual type of asset, used in editor only
   */
  queryAssetInfo: function queryAssetInfo(uuid, callback) {
    if (CC_EDITOR && !CC_TEST) {
      this._queryAssetInfoInEditor(uuid, callback);
    } else {
      var info = this._getAssetInfoInRuntime(uuid);

      callback(null, info.url, info.raw);
    }
  },
  // parse uuid out of url
  parseUuidInEditor: function parseUuidInEditor(url) {
    if (CC_EDITOR) {
      var uuid = '';
      var isImported = url.startsWith(_libraryBase);

      if (isImported) {
        var dir = cc.path.dirname(url);
        var dirBasename = cc.path.basename(dir);
        var isAssetUrl = dirBasename.length === 2;

        if (isAssetUrl) {
          uuid = cc.path.basename(url);
          var index = uuid.indexOf('.');

          if (index !== -1) {
            uuid = uuid.slice(0, index);
          }
        } else {
          // raw file url
          uuid = dirBasename;
        }
      } // If url is not in the library, just return ""


      return uuid;
    }
  },

  /**
   * @method loadJson
   * @param {String} json
   * @param {loadCallback} callback
   * @return {LoadingHandle}
   * @private
   */
  loadJson: function loadJson(json, callback) {
    var randomUuid = '' + (new Date().getTime() + Math.random());
    var item = {
      uuid: randomUuid,
      type: 'uuid',
      content: json,
      skips: [Loader.assetLoader.id, Loader.downloader.id]
    };
    Loader.load(item, function (error, asset) {
      if (error) {
        error = new Error('[AssetLibrary] loading JSON or dependencies failed: ' + error.message);
      } else {
        if (asset.constructor === cc.SceneAsset) {
          var key = cc.loader._getReferenceKey(randomUuid);

          asset.scene.dependAssets = AutoReleaseUtils.getDependsRecursively(key);
        }

        if (CC_EDITOR || isScene(asset)) {
          var id = cc.loader._getReferenceKey(randomUuid);

          Loader.removeItem(id);
        }
      }

      asset._uuid = '';

      if (callback) {
        callback(error, asset);
      }
    });
  },

  /**
   * Get the exists asset by uuid.
   *
   * @method getAssetByUuid
   * @param {String} uuid
   * @return {Asset} - the existing asset, if not loaded, just returns null.
   * @private
   */
  getAssetByUuid: function getAssetByUuid(uuid) {
    return AssetLibrary._uuidToAsset[uuid] || null;
  },

  /**
   * init the asset library
   *
   * @method init
   * @param {Object} options
   * @param {String} options.libraryPath - 能接收的任意类型的路径，通常在编辑器里使用绝对的，在网页里使用相对的。
   * @param {Object} options.mountPaths - mount point of actual urls for raw assets (only used in editor)
   * @param {Object} [options.rawAssets] - uuid to raw asset's urls (only used in runtime)
   * @param {String} [options.rawAssetsBase] - base of raw asset's urls (only used in runtime)
   * @param {String} [options.packedAssets] - packed assets (only used in runtime)
   */
  init: function init(options) {
    if (CC_EDITOR && _libraryBase) {
      cc.errorID(6402);
      return;
    } // 这里将路径转 url，不使用路径的原因是有的 runtime 不能解析 "\" 符号。
    // 不使用 url.format 的原因是 windows 不支持 file:// 和 /// 开头的协议，所以只能用 replace 操作直接把路径转成 URL。


    var libraryPath = options.libraryPath;
    libraryPath = libraryPath.replace(/\\/g, '/');
    _libraryBase = cc.path.stripSep(libraryPath) + '/';
    _rawAssetsBase = options.rawAssetsBase;

    if (options.subpackages) {
      var subPackPipe = new SubPackPipe(options.subpackages);
      cc.loader.insertPipeAfter(cc.loader.assetLoader, subPackPipe);
      cc.loader.subPackPipe = subPackPipe;
    }

    var md5AssetsMap = options.md5AssetsMap;

    if (md5AssetsMap && md5AssetsMap["import"]) {
      // decode uuid
      var i = 0,
          uuid = 0;
      var md5ImportMap = js.createMap(true);
      var md5Entries = md5AssetsMap["import"];

      for (i = 0; i < md5Entries.length; i += 2) {
        uuid = decodeUuid(md5Entries[i]);
        md5ImportMap[uuid] = md5Entries[i + 1];
      }

      var md5RawAssetsMap = js.createMap(true);
      md5Entries = md5AssetsMap['raw-assets'];

      for (i = 0; i < md5Entries.length; i += 2) {
        uuid = decodeUuid(md5Entries[i]);
        md5RawAssetsMap[uuid] = md5Entries[i + 1];
      }

      var md5Pipe = new MD5Pipe(md5ImportMap, md5RawAssetsMap, _libraryBase);
      cc.loader.insertPipeAfter(cc.loader.assetLoader, md5Pipe);
      cc.loader.md5Pipe = md5Pipe;
    } // init raw assets


    var assetTables = Loader._assetTables;

    for (var mount in assetTables) {
      assetTables[mount].reset();
    }

    var rawAssets = options.rawAssets;

    if (rawAssets) {
      for (var mountPoint in rawAssets) {
        var assets = rawAssets[mountPoint];

        for (var uuid in assets) {
          var info = assets[uuid];
          var url = info[0];
          var typeId = info[1];

          var type = cc.js._getClassById(typeId);

          if (!type) {
            cc.error('Cannot get', typeId);
            continue;
          } // backward compatibility since 1.10


          _uuidToRawAsset[uuid] = new RawAssetEntry(mountPoint + '/' + url, type); // init resources

          var ext = cc.path.extname(url);

          if (ext) {
            // trim base dir and extname
            url = url.slice(0, -ext.length);
          }

          var isSubAsset = info[2] === 1;

          if (!assetTables[mountPoint]) {
            assetTables[mountPoint] = new AssetTable();
          }

          assetTables[mountPoint].add(url, uuid, type, !isSubAsset);
        }
      }
    }

    if (options.packedAssets) {
      PackDownloader.initPacks(options.packedAssets);
    } // init cc.url


    cc.url._init(options.mountPaths && options.mountPaths.assets || _rawAssetsBase + 'assets');
  }
}; // unload asset if it is destoryed

/**
 * !#en Caches uuid to all loaded assets in scenes.
 *
 * !#zh 这里保存所有已经加载的场景资源，防止同一个资源在内存中加载出多份拷贝。
 *
 * 这里用不了WeakMap，在浏览器中所有加载过的资源都只能手工调用 unloadAsset 释放。
 *
 * 参考：
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap
 * https://github.com/TooTallNate/node-weak
 *
 * @property {object} _uuidToAsset
 * @private
 */

AssetLibrary._uuidToAsset = {}; //暂时屏蔽，因为目前没有缓存任何asset
//if (CC_DEV && Asset.prototype._onPreDestroy) {
//    cc.error('_onPreDestroy of Asset has already defined');
//}
//Asset.prototype._onPreDestroy = function () {
//    if (AssetLibrary._uuidToAsset[this._uuid] === this) {
//        AssetLibrary.unloadAsset(this);
//    }
//};
// TODO: Add BuiltinManager to handle builtin logic

var _builtins = {
  effect: {},
  material: {}
};
var _builtinDeps = {};

function loadBuiltins(name, type, cb) {
  var dirname = name + 's';
  var builtin = _builtins[name] = {};
  var internalMountPath = 'internal'; // internal path will be changed when run simulator

  if (CC_PREVIEW && CC_JSB) {
    internalMountPath = 'temp/internal';
  }

  cc.loader.loadResDir(dirname, type, internalMountPath, function () {}, function (err, assets) {
    if (err) {
      cc.error(err);
    } else {
      for (var i = 0; i < assets.length; i++) {
        var asset = assets[i];
        var deps = cc.loader.getDependsRecursively(asset);
        deps.forEach(function (uuid) {
          return _builtinDeps[uuid] = true;
        });
        builtin["" + asset.name] = asset;
      }
    }

    cb();
  });
}

AssetLibrary._loadBuiltins = function (cb) {
  if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
    return cb && cb();
  }

  loadBuiltins('effect', cc.EffectAsset, function () {
    loadBuiltins('material', cc.Material, cb);
  });
};

AssetLibrary.getBuiltin = function (type, name) {
  return _builtins[type][name];
};

AssetLibrary.getBuiltins = function (type) {
  if (!type) return _builtins;
  return _builtins[type];
};

AssetLibrary.resetBuiltins = function () {
  _builtins = {
    effect: {},
    material: {}
  };
  _builtinDeps = {};
};

AssetLibrary.getBuiltinDeps = function () {
  return _builtinDeps;
};

module.exports = cc.AssetLibrary = AssetLibrary;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDQXNzZXRMaWJyYXJ5LmpzIl0sIm5hbWVzIjpbIkFzc2V0IiwicmVxdWlyZSIsImNhbGxJbk5leHRUaWNrIiwiTG9hZGVyIiwiQXNzZXRUYWJsZSIsIlBhY2tEb3dubG9hZGVyIiwiQXV0b1JlbGVhc2VVdGlscyIsImRlY29kZVV1aWQiLCJNRDVQaXBlIiwiU3ViUGFja1BpcGUiLCJqcyIsIl9saWJyYXJ5QmFzZSIsIl9yYXdBc3NldHNCYXNlIiwiX3V1aWRUb1Jhd0Fzc2V0IiwiY3JlYXRlTWFwIiwiaXNTY2VuZSIsImFzc2V0IiwiY29uc3RydWN0b3IiLCJjYyIsIlNjZW5lQXNzZXQiLCJTY2VuZSIsIlJhd0Fzc2V0RW50cnkiLCJ1cmwiLCJ0eXBlIiwiQXNzZXRMaWJyYXJ5IiwibG9hZEFzc2V0IiwidXVpZCIsImNhbGxiYWNrIiwib3B0aW9ucyIsIkVycm9yIiwiaXRlbSIsImV4aXN0aW5nQXNzZXQiLCJsb2FkIiwiZXJyb3IiLCJlcnJvckluZm8iLCJtZXNzYWdlIiwiZXJyb3JNZXNzYWdlIiwiSlNPTiIsInN0cmluZ2lmeSIsIkNDX0VESVRPUiIsInNjZW5lIiwiRWRpdG9yIiwia2V5IiwibG9hZGVyIiwiX2dldFJlZmVyZW5jZUtleSIsImRlcGVuZEFzc2V0cyIsImdldERlcGVuZHNSZWN1cnNpdmVseSIsImlkIiwicmVtb3ZlSXRlbSIsImdldExpYlVybE5vRXh0IiwiaW5SYXdBc3NldHNEaXIiLCJDQ19CVUlMRCIsImJhc2UiLCJzbGljZSIsIl9xdWVyeUFzc2V0SW5mb0luRWRpdG9yIiwiSXBjIiwic2VuZFRvTWFpbiIsImVyciIsImluZm8iLCJVdGlscyIsIlV1aWRDYWNoZSIsImNhY2hlIiwiY3RvciIsImFzc2V0cyIsImlzUmF3QXNzZXQiLCJpc0NoaWxkQ2xhc3NPZiIsImVycm9yQ29kZSIsIl9nZXRBc3NldEluZm9JblJ1bnRpbWUiLCJyZXN1bHQiLCJyYXciLCJfdXVpZEluU2V0dGluZ3MiLCJxdWVyeUFzc2V0SW5mbyIsIkNDX1RFU1QiLCJwYXJzZVV1aWRJbkVkaXRvciIsImlzSW1wb3J0ZWQiLCJzdGFydHNXaXRoIiwiZGlyIiwicGF0aCIsImRpcm5hbWUiLCJkaXJCYXNlbmFtZSIsImJhc2VuYW1lIiwiaXNBc3NldFVybCIsImxlbmd0aCIsImluZGV4IiwiaW5kZXhPZiIsImxvYWRKc29uIiwianNvbiIsInJhbmRvbVV1aWQiLCJEYXRlIiwiZ2V0VGltZSIsIk1hdGgiLCJyYW5kb20iLCJjb250ZW50Iiwic2tpcHMiLCJhc3NldExvYWRlciIsImRvd25sb2FkZXIiLCJfdXVpZCIsImdldEFzc2V0QnlVdWlkIiwiX3V1aWRUb0Fzc2V0IiwiaW5pdCIsImVycm9ySUQiLCJsaWJyYXJ5UGF0aCIsInJlcGxhY2UiLCJzdHJpcFNlcCIsInJhd0Fzc2V0c0Jhc2UiLCJzdWJwYWNrYWdlcyIsInN1YlBhY2tQaXBlIiwiaW5zZXJ0UGlwZUFmdGVyIiwibWQ1QXNzZXRzTWFwIiwiaSIsIm1kNUltcG9ydE1hcCIsIm1kNUVudHJpZXMiLCJtZDVSYXdBc3NldHNNYXAiLCJtZDVQaXBlIiwiYXNzZXRUYWJsZXMiLCJfYXNzZXRUYWJsZXMiLCJtb3VudCIsInJlc2V0IiwicmF3QXNzZXRzIiwibW91bnRQb2ludCIsInR5cGVJZCIsIl9nZXRDbGFzc0J5SWQiLCJleHQiLCJleHRuYW1lIiwiaXNTdWJBc3NldCIsImFkZCIsInBhY2tlZEFzc2V0cyIsImluaXRQYWNrcyIsIl9pbml0IiwibW91bnRQYXRocyIsIl9idWlsdGlucyIsImVmZmVjdCIsIm1hdGVyaWFsIiwiX2J1aWx0aW5EZXBzIiwibG9hZEJ1aWx0aW5zIiwibmFtZSIsImNiIiwiYnVpbHRpbiIsImludGVybmFsTW91bnRQYXRoIiwiQ0NfUFJFVklFVyIsIkNDX0pTQiIsImxvYWRSZXNEaXIiLCJkZXBzIiwiZm9yRWFjaCIsIl9sb2FkQnVpbHRpbnMiLCJnYW1lIiwicmVuZGVyVHlwZSIsIlJFTkRFUl9UWVBFX0NBTlZBUyIsIkVmZmVjdEFzc2V0IiwiTWF0ZXJpYWwiLCJnZXRCdWlsdGluIiwiZ2V0QnVpbHRpbnMiLCJyZXNldEJ1aWx0aW5zIiwiZ2V0QnVpbHRpbkRlcHMiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkEsSUFBSUEsS0FBSyxHQUFHQyxPQUFPLENBQUMsbUJBQUQsQ0FBbkI7O0FBQ0EsSUFBSUMsY0FBYyxHQUFHRCxPQUFPLENBQUMsU0FBRCxDQUFQLENBQW1CQyxjQUF4Qzs7QUFDQSxJQUFJQyxNQUFNLEdBQUdGLE9BQU8sQ0FBQywyQkFBRCxDQUFwQjs7QUFDQSxJQUFJRyxVQUFVLEdBQUdILE9BQU8sQ0FBQyw4QkFBRCxDQUF4Qjs7QUFDQSxJQUFJSSxjQUFjLEdBQUdKLE9BQU8sQ0FBQyxrQ0FBRCxDQUE1Qjs7QUFDQSxJQUFJSyxnQkFBZ0IsR0FBR0wsT0FBTyxDQUFDLHFDQUFELENBQTlCOztBQUNBLElBQUlNLFVBQVUsR0FBR04sT0FBTyxDQUFDLHNCQUFELENBQXhCOztBQUNBLElBQUlPLE9BQU8sR0FBR1AsT0FBTyxDQUFDLDJCQUFELENBQXJCOztBQUNBLElBQUlRLFdBQVcsR0FBR1IsT0FBTyxDQUFDLGtDQUFELENBQXpCOztBQUNBLElBQUlTLEVBQUUsR0FBR1QsT0FBTyxDQUFDLE1BQUQsQ0FBaEI7QUFFQTs7Ozs7O0FBT0E7OztBQUVBLElBQUlVLFlBQVksR0FBRyxFQUFuQjtBQUNBLElBQUlDLGNBQWMsR0FBRyxFQUFyQixFQUE2Qjs7QUFDN0IsSUFBSUMsZUFBZSxHQUFHSCxFQUFFLENBQUNJLFNBQUgsQ0FBYSxJQUFiLENBQXRCOztBQUVBLFNBQVNDLE9BQVQsQ0FBa0JDLEtBQWxCLEVBQXlCO0FBQ3JCLFNBQU9BLEtBQUssS0FBS0EsS0FBSyxDQUFDQyxXQUFOLEtBQXNCQyxFQUFFLENBQUNDLFVBQXpCLElBQXVDSCxLQUFLLFlBQVlFLEVBQUUsQ0FBQ0UsS0FBaEUsQ0FBWjtBQUNILEVBRUQ7OztBQUVBLFNBQVNDLGFBQVQsQ0FBd0JDLEdBQXhCLEVBQTZCQyxJQUE3QixFQUFtQztBQUMvQixPQUFLRCxHQUFMLEdBQVdBLEdBQVg7QUFDQSxPQUFLQyxJQUFMLEdBQVlBLElBQVo7QUFDSCxFQUVEOzs7QUFFQSxJQUFJQyxZQUFZLEdBQUc7QUFDZjs7Ozs7O0FBTUE7Ozs7Ozs7Ozs7QUFVQUMsRUFBQUEsU0FBUyxFQUFFLG1CQUFVQyxJQUFWLEVBQWdCQyxRQUFoQixFQUEwQkMsT0FBMUIsRUFBbUM7QUFDMUMsUUFBSSxPQUFPRixJQUFQLEtBQWdCLFFBQXBCLEVBQThCO0FBQzFCLGFBQU94QixjQUFjLENBQUN5QixRQUFELEVBQVcsSUFBSUUsS0FBSixDQUFVLG9DQUFWLENBQVgsRUFBNEQsSUFBNUQsQ0FBckI7QUFDSCxLQUh5QyxDQUkxQztBQUNBOzs7QUFDQSxRQUFJQyxJQUFJLEdBQUc7QUFDUEosTUFBQUEsSUFBSSxFQUFFQSxJQURDO0FBRVBILE1BQUFBLElBQUksRUFBRTtBQUZDLEtBQVg7O0FBSUEsUUFBSUssT0FBTyxJQUFJQSxPQUFPLENBQUNHLGFBQXZCLEVBQXNDO0FBQ2xDRCxNQUFBQSxJQUFJLENBQUNDLGFBQUwsR0FBcUJILE9BQU8sQ0FBQ0csYUFBN0I7QUFDSDs7QUFDRDVCLElBQUFBLE1BQU0sQ0FBQzZCLElBQVAsQ0FBWUYsSUFBWixFQUFrQixVQUFVRyxLQUFWLEVBQWlCakIsS0FBakIsRUFBd0I7QUFDdEMsVUFBSWlCLEtBQUssSUFBSSxDQUFDakIsS0FBZCxFQUFxQjtBQUNqQixZQUFJa0IsU0FBUyxHQUFHLE9BQU9ELEtBQVAsS0FBaUIsUUFBakIsR0FBNEJBLEtBQTVCLEdBQXFDQSxLQUFLLEdBQUlBLEtBQUssQ0FBQ0UsT0FBTixJQUFpQkYsS0FBSyxDQUFDRyxZQUF2QixJQUF1Q0MsSUFBSSxDQUFDQyxTQUFMLENBQWVMLEtBQWYsQ0FBM0MsR0FBb0UsZUFBOUg7QUFDQUEsUUFBQUEsS0FBSyxHQUFHLElBQUlKLEtBQUosQ0FBVSx3REFBd0RLLFNBQWxFLENBQVI7QUFDSCxPQUhELE1BSUs7QUFDRCxZQUFJbEIsS0FBSyxDQUFDQyxXQUFOLEtBQXNCQyxFQUFFLENBQUNDLFVBQTdCLEVBQXlDO0FBQ3JDLGNBQUlvQixTQUFTLElBQUksQ0FBQ3ZCLEtBQUssQ0FBQ3dCLEtBQXhCLEVBQStCO0FBQzNCQyxZQUFBQSxNQUFNLENBQUNSLEtBQVAsQ0FBYSw2Q0FBYixFQUE0RFAsSUFBNUQ7QUFDSCxXQUZELE1BR0s7QUFDRCxnQkFBSWdCLEdBQUcsR0FBR3hCLEVBQUUsQ0FBQ3lCLE1BQUgsQ0FBVUMsZ0JBQVYsQ0FBMkJsQixJQUEzQixDQUFWOztBQUNBVixZQUFBQSxLQUFLLENBQUN3QixLQUFOLENBQVlLLFlBQVosR0FBMkJ2QyxnQkFBZ0IsQ0FBQ3dDLHFCQUFqQixDQUF1Q0osR0FBdkMsQ0FBM0I7QUFDSDtBQUNKOztBQUNELFlBQUlILFNBQVMsSUFBSXhCLE9BQU8sQ0FBQ0MsS0FBRCxDQUF4QixFQUFpQztBQUM3QixjQUFJK0IsRUFBRSxHQUFHN0IsRUFBRSxDQUFDeUIsTUFBSCxDQUFVQyxnQkFBVixDQUEyQmxCLElBQTNCLENBQVQ7O0FBQ0F2QixVQUFBQSxNQUFNLENBQUM2QyxVQUFQLENBQWtCRCxFQUFsQjtBQUNIO0FBQ0o7O0FBQ0QsVUFBSXBCLFFBQUosRUFBYztBQUNWQSxRQUFBQSxRQUFRLENBQUNNLEtBQUQsRUFBUWpCLEtBQVIsQ0FBUjtBQUNIO0FBQ0osS0F2QkQ7QUF3QkgsR0F0RGM7QUF3RGZpQyxFQUFBQSxjQUFjLEVBQUUsd0JBQVV2QixJQUFWLEVBQWdCd0IsY0FBaEIsRUFBZ0M7QUFDNUMsUUFBSUMsUUFBSixFQUFjO0FBQ1Z6QixNQUFBQSxJQUFJLEdBQUduQixVQUFVLENBQUNtQixJQUFELENBQWpCO0FBQ0g7O0FBQ0QsUUFBSTBCLElBQUksR0FBSUQsUUFBUSxJQUFJRCxjQUFiLEdBQWdDdEMsY0FBYyxHQUFHLFNBQWpELEdBQThERCxZQUF6RTtBQUNBLFdBQU95QyxJQUFJLEdBQUcxQixJQUFJLENBQUMyQixLQUFMLENBQVcsQ0FBWCxFQUFjLENBQWQsQ0FBUCxHQUEwQixHQUExQixHQUFnQzNCLElBQXZDO0FBQ0gsR0E5RGM7QUFnRWY0QixFQUFBQSx1QkFBdUIsRUFBRSxpQ0FBVTVCLElBQVYsRUFBZ0JDLFFBQWhCLEVBQTBCO0FBQy9DLFFBQUlZLFNBQUosRUFBZTtBQUNYRSxNQUFBQSxNQUFNLENBQUNjLEdBQVAsQ0FBV0MsVUFBWCxDQUFzQixnQ0FBdEIsRUFBd0Q5QixJQUF4RCxFQUE4RCxVQUFVK0IsR0FBVixFQUFlQyxJQUFmLEVBQXFCO0FBQy9FLFlBQUlBLElBQUosRUFBVTtBQUNOakIsVUFBQUEsTUFBTSxDQUFDa0IsS0FBUCxDQUFhQyxTQUFiLENBQXVCQyxLQUF2QixDQUE2QkgsSUFBSSxDQUFDcEMsR0FBbEMsRUFBdUNJLElBQXZDO0FBQ0EsY0FBSW9DLElBQUksR0FBR3JCLE1BQU0sQ0FBQ3NCLE1BQVAsQ0FBY0wsSUFBSSxDQUFDbkMsSUFBbkIsQ0FBWDs7QUFDQSxjQUFJdUMsSUFBSixFQUFVO0FBQ04sZ0JBQUlFLFVBQVUsR0FBRyxDQUFDdEQsRUFBRSxDQUFDdUQsY0FBSCxDQUFrQkgsSUFBbEIsRUFBd0I5RCxLQUF4QixDQUFsQjtBQUNBMkIsWUFBQUEsUUFBUSxDQUFDLElBQUQsRUFBTytCLElBQUksQ0FBQ3BDLEdBQVosRUFBaUIwQyxVQUFqQixFQUE2QkYsSUFBN0IsQ0FBUjtBQUNILFdBSEQsTUFJSztBQUNEbkMsWUFBQUEsUUFBUSxDQUFDLElBQUlFLEtBQUosQ0FBVSw2QkFBNkI2QixJQUFJLENBQUNuQyxJQUE1QyxDQUFELENBQVI7QUFDSDtBQUNKLFNBVkQsTUFXSztBQUNELGNBQUlVLEtBQUssR0FBRyxJQUFJSixLQUFKLENBQVUsb0NBQW9DSCxJQUFwQyxHQUEyQyw4QkFBckQsQ0FBWjtBQUNBTyxVQUFBQSxLQUFLLENBQUNpQyxTQUFOLEdBQWtCLGFBQWxCO0FBQ0F2QyxVQUFBQSxRQUFRLENBQUNNLEtBQUQsQ0FBUjtBQUNIO0FBQ0osT0FqQkQsRUFpQkcsQ0FBQyxDQWpCSjtBQWtCSDtBQUNKLEdBckZjO0FBdUZma0MsRUFBQUEsc0JBQXNCLEVBQUUsZ0NBQVV6QyxJQUFWLEVBQWdCMEMsTUFBaEIsRUFBd0I7QUFDNUNBLElBQUFBLE1BQU0sR0FBR0EsTUFBTSxJQUFJO0FBQUM5QyxNQUFBQSxHQUFHLEVBQUUsSUFBTjtBQUFZK0MsTUFBQUEsR0FBRyxFQUFFO0FBQWpCLEtBQW5CO0FBQ0EsUUFBSVgsSUFBSSxHQUFHN0MsZUFBZSxDQUFDYSxJQUFELENBQTFCOztBQUNBLFFBQUlnQyxJQUFJLElBQUksQ0FBQ2hELEVBQUUsQ0FBQ3VELGNBQUgsQ0FBa0JQLElBQUksQ0FBQ25DLElBQXZCLEVBQTZCTCxFQUFFLENBQUNsQixLQUFoQyxDQUFiLEVBQXFEO0FBQ2pEO0FBQ0FvRSxNQUFBQSxNQUFNLENBQUM5QyxHQUFQLEdBQWFWLGNBQWMsR0FBRzhDLElBQUksQ0FBQ3BDLEdBQW5DO0FBQ0E4QyxNQUFBQSxNQUFNLENBQUNDLEdBQVAsR0FBYSxJQUFiO0FBQ0gsS0FKRCxNQUtLO0FBQ0RELE1BQUFBLE1BQU0sQ0FBQzlDLEdBQVAsR0FBYSxLQUFLMkIsY0FBTCxDQUFvQnZCLElBQXBCLElBQTRCLE9BQXpDO0FBQ0EwQyxNQUFBQSxNQUFNLENBQUNDLEdBQVAsR0FBYSxLQUFiO0FBQ0g7O0FBQ0QsV0FBT0QsTUFBUDtBQUNILEdBcEdjO0FBc0dmRSxFQUFBQSxlQUFlLEVBQUUseUJBQVU1QyxJQUFWLEVBQWdCO0FBQzdCLFdBQU9BLElBQUksSUFBSWIsZUFBZjtBQUNILEdBeEdjOztBQTBHZjs7Ozs7Ozs7O0FBU0EwRCxFQUFBQSxjQUFjLEVBQUUsd0JBQVU3QyxJQUFWLEVBQWdCQyxRQUFoQixFQUEwQjtBQUN0QyxRQUFJWSxTQUFTLElBQUksQ0FBQ2lDLE9BQWxCLEVBQTJCO0FBQ3ZCLFdBQUtsQix1QkFBTCxDQUE2QjVCLElBQTdCLEVBQW1DQyxRQUFuQztBQUNILEtBRkQsTUFHSztBQUNELFVBQUkrQixJQUFJLEdBQUcsS0FBS1Msc0JBQUwsQ0FBNEJ6QyxJQUE1QixDQUFYOztBQUNBQyxNQUFBQSxRQUFRLENBQUMsSUFBRCxFQUFPK0IsSUFBSSxDQUFDcEMsR0FBWixFQUFpQm9DLElBQUksQ0FBQ1csR0FBdEIsQ0FBUjtBQUNIO0FBQ0osR0EzSGM7QUE2SGY7QUFDQUksRUFBQUEsaUJBQWlCLEVBQUUsMkJBQVVuRCxHQUFWLEVBQWU7QUFDOUIsUUFBSWlCLFNBQUosRUFBZTtBQUNYLFVBQUliLElBQUksR0FBRyxFQUFYO0FBQ0EsVUFBSWdELFVBQVUsR0FBR3BELEdBQUcsQ0FBQ3FELFVBQUosQ0FBZWhFLFlBQWYsQ0FBakI7O0FBQ0EsVUFBSStELFVBQUosRUFBZ0I7QUFDWixZQUFJRSxHQUFHLEdBQUcxRCxFQUFFLENBQUMyRCxJQUFILENBQVFDLE9BQVIsQ0FBZ0J4RCxHQUFoQixDQUFWO0FBQ0EsWUFBSXlELFdBQVcsR0FBRzdELEVBQUUsQ0FBQzJELElBQUgsQ0FBUUcsUUFBUixDQUFpQkosR0FBakIsQ0FBbEI7QUFFQSxZQUFJSyxVQUFVLEdBQUdGLFdBQVcsQ0FBQ0csTUFBWixLQUF1QixDQUF4Qzs7QUFDQSxZQUFJRCxVQUFKLEVBQWdCO0FBQ1p2RCxVQUFBQSxJQUFJLEdBQUdSLEVBQUUsQ0FBQzJELElBQUgsQ0FBUUcsUUFBUixDQUFpQjFELEdBQWpCLENBQVA7QUFDQSxjQUFJNkQsS0FBSyxHQUFHekQsSUFBSSxDQUFDMEQsT0FBTCxDQUFhLEdBQWIsQ0FBWjs7QUFDQSxjQUFJRCxLQUFLLEtBQUssQ0FBQyxDQUFmLEVBQWtCO0FBQ2R6RCxZQUFBQSxJQUFJLEdBQUdBLElBQUksQ0FBQzJCLEtBQUwsQ0FBVyxDQUFYLEVBQWM4QixLQUFkLENBQVA7QUFDSDtBQUNKLFNBTkQsTUFPSztBQUNEO0FBQ0F6RCxVQUFBQSxJQUFJLEdBQUdxRCxXQUFQO0FBQ0g7QUFDSixPQW5CVSxDQW9CWDs7O0FBQ0EsYUFBT3JELElBQVA7QUFDSDtBQUNKLEdBdEpjOztBQXdKZjs7Ozs7OztBQU9BMkQsRUFBQUEsUUFBUSxFQUFFLGtCQUFVQyxJQUFWLEVBQWdCM0QsUUFBaEIsRUFBMEI7QUFDaEMsUUFBSTRELFVBQVUsR0FBRyxNQUFPLElBQUlDLElBQUosRUFBRCxDQUFhQyxPQUFiLEtBQXlCQyxJQUFJLENBQUNDLE1BQUwsRUFBL0IsQ0FBakI7QUFDQSxRQUFJN0QsSUFBSSxHQUFHO0FBQ1BKLE1BQUFBLElBQUksRUFBRTZELFVBREM7QUFFUGhFLE1BQUFBLElBQUksRUFBRSxNQUZDO0FBR1BxRSxNQUFBQSxPQUFPLEVBQUVOLElBSEY7QUFJUE8sTUFBQUEsS0FBSyxFQUFFLENBQUUxRixNQUFNLENBQUMyRixXQUFQLENBQW1CL0MsRUFBckIsRUFBeUI1QyxNQUFNLENBQUM0RixVQUFQLENBQWtCaEQsRUFBM0M7QUFKQSxLQUFYO0FBTUE1QyxJQUFBQSxNQUFNLENBQUM2QixJQUFQLENBQVlGLElBQVosRUFBa0IsVUFBVUcsS0FBVixFQUFpQmpCLEtBQWpCLEVBQXdCO0FBQ3RDLFVBQUlpQixLQUFKLEVBQVc7QUFDUEEsUUFBQUEsS0FBSyxHQUFHLElBQUlKLEtBQUosQ0FBVSx5REFBeURJLEtBQUssQ0FBQ0UsT0FBekUsQ0FBUjtBQUNILE9BRkQsTUFHSztBQUNELFlBQUluQixLQUFLLENBQUNDLFdBQU4sS0FBc0JDLEVBQUUsQ0FBQ0MsVUFBN0IsRUFBeUM7QUFDckMsY0FBSXVCLEdBQUcsR0FBR3hCLEVBQUUsQ0FBQ3lCLE1BQUgsQ0FBVUMsZ0JBQVYsQ0FBMkIyQyxVQUEzQixDQUFWOztBQUNBdkUsVUFBQUEsS0FBSyxDQUFDd0IsS0FBTixDQUFZSyxZQUFaLEdBQTJCdkMsZ0JBQWdCLENBQUN3QyxxQkFBakIsQ0FBdUNKLEdBQXZDLENBQTNCO0FBQ0g7O0FBQ0QsWUFBSUgsU0FBUyxJQUFJeEIsT0FBTyxDQUFDQyxLQUFELENBQXhCLEVBQWlDO0FBQzdCLGNBQUkrQixFQUFFLEdBQUc3QixFQUFFLENBQUN5QixNQUFILENBQVVDLGdCQUFWLENBQTJCMkMsVUFBM0IsQ0FBVDs7QUFDQXBGLFVBQUFBLE1BQU0sQ0FBQzZDLFVBQVAsQ0FBa0JELEVBQWxCO0FBQ0g7QUFDSjs7QUFDRC9CLE1BQUFBLEtBQUssQ0FBQ2dGLEtBQU4sR0FBYyxFQUFkOztBQUNBLFVBQUlyRSxRQUFKLEVBQWM7QUFDVkEsUUFBQUEsUUFBUSxDQUFDTSxLQUFELEVBQVFqQixLQUFSLENBQVI7QUFDSDtBQUNKLEtBbEJEO0FBbUJILEdBMUxjOztBQTRMZjs7Ozs7Ozs7QUFRQWlGLEVBQUFBLGNBQWMsRUFBRSx3QkFBVXZFLElBQVYsRUFBZ0I7QUFDNUIsV0FBT0YsWUFBWSxDQUFDMEUsWUFBYixDQUEwQnhFLElBQTFCLEtBQW1DLElBQTFDO0FBQ0gsR0F0TWM7O0FBd01mOzs7Ozs7Ozs7OztBQVdBeUUsRUFBQUEsSUFBSSxFQUFFLGNBQVV2RSxPQUFWLEVBQW1CO0FBQ3JCLFFBQUlXLFNBQVMsSUFBSTVCLFlBQWpCLEVBQStCO0FBQzNCTyxNQUFBQSxFQUFFLENBQUNrRixPQUFILENBQVcsSUFBWDtBQUNBO0FBQ0gsS0FKb0IsQ0FPckI7QUFDQTs7O0FBQ0EsUUFBSUMsV0FBVyxHQUFHekUsT0FBTyxDQUFDeUUsV0FBMUI7QUFDQUEsSUFBQUEsV0FBVyxHQUFHQSxXQUFXLENBQUNDLE9BQVosQ0FBb0IsS0FBcEIsRUFBMkIsR0FBM0IsQ0FBZDtBQUNBM0YsSUFBQUEsWUFBWSxHQUFHTyxFQUFFLENBQUMyRCxJQUFILENBQVEwQixRQUFSLENBQWlCRixXQUFqQixJQUFnQyxHQUEvQztBQUVBekYsSUFBQUEsY0FBYyxHQUFHZ0IsT0FBTyxDQUFDNEUsYUFBekI7O0FBRUEsUUFBSTVFLE9BQU8sQ0FBQzZFLFdBQVosRUFBeUI7QUFDckIsVUFBSUMsV0FBVyxHQUFHLElBQUlqRyxXQUFKLENBQWdCbUIsT0FBTyxDQUFDNkUsV0FBeEIsQ0FBbEI7QUFDQXZGLE1BQUFBLEVBQUUsQ0FBQ3lCLE1BQUgsQ0FBVWdFLGVBQVYsQ0FBMEJ6RixFQUFFLENBQUN5QixNQUFILENBQVVtRCxXQUFwQyxFQUFpRFksV0FBakQ7QUFDQXhGLE1BQUFBLEVBQUUsQ0FBQ3lCLE1BQUgsQ0FBVStELFdBQVYsR0FBd0JBLFdBQXhCO0FBQ0g7O0FBRUQsUUFBSUUsWUFBWSxHQUFHaEYsT0FBTyxDQUFDZ0YsWUFBM0I7O0FBQ0EsUUFBSUEsWUFBWSxJQUFJQSxZQUFZLFVBQWhDLEVBQXlDO0FBQ3JDO0FBQ0EsVUFBSUMsQ0FBQyxHQUFHLENBQVI7QUFBQSxVQUFXbkYsSUFBSSxHQUFHLENBQWxCO0FBQ0EsVUFBSW9GLFlBQVksR0FBR3BHLEVBQUUsQ0FBQ0ksU0FBSCxDQUFhLElBQWIsQ0FBbkI7QUFDQSxVQUFJaUcsVUFBVSxHQUFHSCxZQUFZLFVBQTdCOztBQUNBLFdBQUtDLENBQUMsR0FBRyxDQUFULEVBQVlBLENBQUMsR0FBR0UsVUFBVSxDQUFDN0IsTUFBM0IsRUFBbUMyQixDQUFDLElBQUksQ0FBeEMsRUFBMkM7QUFDdkNuRixRQUFBQSxJQUFJLEdBQUduQixVQUFVLENBQUN3RyxVQUFVLENBQUNGLENBQUQsQ0FBWCxDQUFqQjtBQUNBQyxRQUFBQSxZQUFZLENBQUNwRixJQUFELENBQVosR0FBcUJxRixVQUFVLENBQUNGLENBQUMsR0FBRyxDQUFMLENBQS9CO0FBQ0g7O0FBRUQsVUFBSUcsZUFBZSxHQUFHdEcsRUFBRSxDQUFDSSxTQUFILENBQWEsSUFBYixDQUF0QjtBQUNBaUcsTUFBQUEsVUFBVSxHQUFHSCxZQUFZLENBQUMsWUFBRCxDQUF6Qjs7QUFDQSxXQUFLQyxDQUFDLEdBQUcsQ0FBVCxFQUFZQSxDQUFDLEdBQUdFLFVBQVUsQ0FBQzdCLE1BQTNCLEVBQW1DMkIsQ0FBQyxJQUFJLENBQXhDLEVBQTJDO0FBQ3ZDbkYsUUFBQUEsSUFBSSxHQUFHbkIsVUFBVSxDQUFDd0csVUFBVSxDQUFDRixDQUFELENBQVgsQ0FBakI7QUFDQUcsUUFBQUEsZUFBZSxDQUFDdEYsSUFBRCxDQUFmLEdBQXdCcUYsVUFBVSxDQUFDRixDQUFDLEdBQUcsQ0FBTCxDQUFsQztBQUNIOztBQUVELFVBQUlJLE9BQU8sR0FBRyxJQUFJekcsT0FBSixDQUFZc0csWUFBWixFQUEwQkUsZUFBMUIsRUFBMkNyRyxZQUEzQyxDQUFkO0FBQ0FPLE1BQUFBLEVBQUUsQ0FBQ3lCLE1BQUgsQ0FBVWdFLGVBQVYsQ0FBMEJ6RixFQUFFLENBQUN5QixNQUFILENBQVVtRCxXQUFwQyxFQUFpRG1CLE9BQWpEO0FBQ0EvRixNQUFBQSxFQUFFLENBQUN5QixNQUFILENBQVVzRSxPQUFWLEdBQW9CQSxPQUFwQjtBQUNILEtBMUNvQixDQTRDckI7OztBQUVBLFFBQUlDLFdBQVcsR0FBRy9HLE1BQU0sQ0FBQ2dILFlBQXpCOztBQUNBLFNBQUssSUFBSUMsS0FBVCxJQUFrQkYsV0FBbEIsRUFBK0I7QUFDM0JBLE1BQUFBLFdBQVcsQ0FBQ0UsS0FBRCxDQUFYLENBQW1CQyxLQUFuQjtBQUNIOztBQUVELFFBQUlDLFNBQVMsR0FBRzFGLE9BQU8sQ0FBQzBGLFNBQXhCOztBQUNBLFFBQUlBLFNBQUosRUFBZTtBQUNYLFdBQUssSUFBSUMsVUFBVCxJQUF1QkQsU0FBdkIsRUFBa0M7QUFDOUIsWUFBSXZELE1BQU0sR0FBR3VELFNBQVMsQ0FBQ0MsVUFBRCxDQUF0Qjs7QUFDQSxhQUFLLElBQUk3RixJQUFULElBQWlCcUMsTUFBakIsRUFBeUI7QUFDckIsY0FBSUwsSUFBSSxHQUFHSyxNQUFNLENBQUNyQyxJQUFELENBQWpCO0FBQ0EsY0FBSUosR0FBRyxHQUFHb0MsSUFBSSxDQUFDLENBQUQsQ0FBZDtBQUNBLGNBQUk4RCxNQUFNLEdBQUc5RCxJQUFJLENBQUMsQ0FBRCxDQUFqQjs7QUFDQSxjQUFJbkMsSUFBSSxHQUFHTCxFQUFFLENBQUNSLEVBQUgsQ0FBTStHLGFBQU4sQ0FBb0JELE1BQXBCLENBQVg7O0FBQ0EsY0FBSSxDQUFDakcsSUFBTCxFQUFXO0FBQ1BMLFlBQUFBLEVBQUUsQ0FBQ2UsS0FBSCxDQUFTLFlBQVQsRUFBdUJ1RixNQUF2QjtBQUNBO0FBQ0gsV0FSb0IsQ0FTckI7OztBQUNBM0csVUFBQUEsZUFBZSxDQUFDYSxJQUFELENBQWYsR0FBd0IsSUFBSUwsYUFBSixDQUFrQmtHLFVBQVUsR0FBRyxHQUFiLEdBQW1CakcsR0FBckMsRUFBMENDLElBQTFDLENBQXhCLENBVnFCLENBV3JCOztBQUNBLGNBQUltRyxHQUFHLEdBQUd4RyxFQUFFLENBQUMyRCxJQUFILENBQVE4QyxPQUFSLENBQWdCckcsR0FBaEIsQ0FBVjs7QUFDQSxjQUFJb0csR0FBSixFQUFTO0FBQ0w7QUFDQXBHLFlBQUFBLEdBQUcsR0FBR0EsR0FBRyxDQUFDK0IsS0FBSixDQUFVLENBQVYsRUFBYSxDQUFFcUUsR0FBRyxDQUFDeEMsTUFBbkIsQ0FBTjtBQUNIOztBQUVELGNBQUkwQyxVQUFVLEdBQUdsRSxJQUFJLENBQUMsQ0FBRCxDQUFKLEtBQVksQ0FBN0I7O0FBQ0EsY0FBSSxDQUFDd0QsV0FBVyxDQUFDSyxVQUFELENBQWhCLEVBQThCO0FBQzFCTCxZQUFBQSxXQUFXLENBQUNLLFVBQUQsQ0FBWCxHQUEwQixJQUFJbkgsVUFBSixFQUExQjtBQUNIOztBQUVEOEcsVUFBQUEsV0FBVyxDQUFDSyxVQUFELENBQVgsQ0FBd0JNLEdBQXhCLENBQTRCdkcsR0FBNUIsRUFBaUNJLElBQWpDLEVBQXVDSCxJQUF2QyxFQUE2QyxDQUFDcUcsVUFBOUM7QUFDSDtBQUNKO0FBQ0o7O0FBRUQsUUFBSWhHLE9BQU8sQ0FBQ2tHLFlBQVosRUFBMEI7QUFDdEJ6SCxNQUFBQSxjQUFjLENBQUMwSCxTQUFmLENBQXlCbkcsT0FBTyxDQUFDa0csWUFBakM7QUFDSCxLQXJGb0IsQ0F1RnJCOzs7QUFDQTVHLElBQUFBLEVBQUUsQ0FBQ0ksR0FBSCxDQUFPMEcsS0FBUCxDQUFjcEcsT0FBTyxDQUFDcUcsVUFBUixJQUFzQnJHLE9BQU8sQ0FBQ3FHLFVBQVIsQ0FBbUJsRSxNQUExQyxJQUFxRG5ELGNBQWMsR0FBRyxRQUFuRjtBQUNIO0FBNVNjLENBQW5CLEVBZ1RBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7QUFjQVksWUFBWSxDQUFDMEUsWUFBYixHQUE0QixFQUE1QixFQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBOztBQUNBLElBQUlnQyxTQUFTLEdBQUc7QUFDWkMsRUFBQUEsTUFBTSxFQUFFLEVBREk7QUFFWkMsRUFBQUEsUUFBUSxFQUFFO0FBRkUsQ0FBaEI7QUFLQSxJQUFJQyxZQUFZLEdBQUcsRUFBbkI7O0FBRUEsU0FBU0MsWUFBVCxDQUF1QkMsSUFBdkIsRUFBNkJoSCxJQUE3QixFQUFtQ2lILEVBQW5DLEVBQXVDO0FBQ25DLE1BQUkxRCxPQUFPLEdBQUd5RCxJQUFJLEdBQUksR0FBdEI7QUFDQSxNQUFJRSxPQUFPLEdBQUdQLFNBQVMsQ0FBQ0ssSUFBRCxDQUFULEdBQWtCLEVBQWhDO0FBQ0EsTUFBSUcsaUJBQWlCLEdBQUcsVUFBeEIsQ0FIbUMsQ0FJbkM7O0FBQ0EsTUFBSUMsVUFBVSxJQUFJQyxNQUFsQixFQUEwQjtBQUN0QkYsSUFBQUEsaUJBQWlCLEdBQUcsZUFBcEI7QUFDSDs7QUFDRHhILEVBQUFBLEVBQUUsQ0FBQ3lCLE1BQUgsQ0FBVWtHLFVBQVYsQ0FBcUIvRCxPQUFyQixFQUE4QnZELElBQTlCLEVBQW9DbUgsaUJBQXBDLEVBQXVELFlBQU0sQ0FBRyxDQUFoRSxFQUFrRSxVQUFDakYsR0FBRCxFQUFNTSxNQUFOLEVBQWlCO0FBQy9FLFFBQUlOLEdBQUosRUFBUztBQUNMdkMsTUFBQUEsRUFBRSxDQUFDZSxLQUFILENBQVN3QixHQUFUO0FBQ0gsS0FGRCxNQUdLO0FBQ0QsV0FBSyxJQUFJb0QsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRzlDLE1BQU0sQ0FBQ21CLE1BQTNCLEVBQW1DMkIsQ0FBQyxFQUFwQyxFQUF3QztBQUNwQyxZQUFJN0YsS0FBSyxHQUFHK0MsTUFBTSxDQUFDOEMsQ0FBRCxDQUFsQjtBQUNBLFlBQUlpQyxJQUFJLEdBQUc1SCxFQUFFLENBQUN5QixNQUFILENBQVVHLHFCQUFWLENBQWdDOUIsS0FBaEMsQ0FBWDtBQUNBOEgsUUFBQUEsSUFBSSxDQUFDQyxPQUFMLENBQWEsVUFBQXJILElBQUk7QUFBQSxpQkFBSTJHLFlBQVksQ0FBQzNHLElBQUQsQ0FBWixHQUFxQixJQUF6QjtBQUFBLFNBQWpCO0FBQ0ErRyxRQUFBQSxPQUFPLE1BQUl6SCxLQUFLLENBQUN1SCxJQUFWLENBQVAsR0FBMkJ2SCxLQUEzQjtBQUNIO0FBQ0o7O0FBRUR3SCxJQUFBQSxFQUFFO0FBQ0wsR0FkRDtBQWVIOztBQUVEaEgsWUFBWSxDQUFDd0gsYUFBYixHQUE2QixVQUFVUixFQUFWLEVBQWM7QUFDdkMsTUFBSXRILEVBQUUsQ0FBQytILElBQUgsQ0FBUUMsVUFBUixLQUF1QmhJLEVBQUUsQ0FBQytILElBQUgsQ0FBUUUsa0JBQW5DLEVBQXVEO0FBQ25ELFdBQU9YLEVBQUUsSUFBSUEsRUFBRSxFQUFmO0FBQ0g7O0FBRURGLEVBQUFBLFlBQVksQ0FBQyxRQUFELEVBQVdwSCxFQUFFLENBQUNrSSxXQUFkLEVBQTJCLFlBQU07QUFDekNkLElBQUFBLFlBQVksQ0FBQyxVQUFELEVBQWFwSCxFQUFFLENBQUNtSSxRQUFoQixFQUEwQmIsRUFBMUIsQ0FBWjtBQUNILEdBRlcsQ0FBWjtBQUdILENBUkQ7O0FBVUFoSCxZQUFZLENBQUM4SCxVQUFiLEdBQTBCLFVBQVUvSCxJQUFWLEVBQWdCZ0gsSUFBaEIsRUFBc0I7QUFDNUMsU0FBT0wsU0FBUyxDQUFDM0csSUFBRCxDQUFULENBQWdCZ0gsSUFBaEIsQ0FBUDtBQUNILENBRkQ7O0FBSUEvRyxZQUFZLENBQUMrSCxXQUFiLEdBQTJCLFVBQVVoSSxJQUFWLEVBQWdCO0FBQ3ZDLE1BQUksQ0FBQ0EsSUFBTCxFQUFXLE9BQU8yRyxTQUFQO0FBQ1gsU0FBT0EsU0FBUyxDQUFDM0csSUFBRCxDQUFoQjtBQUNILENBSEQ7O0FBSUFDLFlBQVksQ0FBQ2dJLGFBQWIsR0FBNkIsWUFBWTtBQUNyQ3RCLEVBQUFBLFNBQVMsR0FBRztBQUNSQyxJQUFBQSxNQUFNLEVBQUUsRUFEQTtBQUVSQyxJQUFBQSxRQUFRLEVBQUU7QUFGRixHQUFaO0FBSUFDLEVBQUFBLFlBQVksR0FBRyxFQUFmO0FBQ0gsQ0FORDs7QUFPQTdHLFlBQVksQ0FBQ2lJLGNBQWIsR0FBOEIsWUFBWTtBQUN0QyxTQUFPcEIsWUFBUDtBQUNILENBRkQ7O0FBSUFxQixNQUFNLENBQUNDLE9BQVAsR0FBaUJ6SSxFQUFFLENBQUNNLFlBQUgsR0FBa0JBLFlBQW5DIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG52YXIgQXNzZXQgPSByZXF1aXJlKCcuLi9hc3NldHMvQ0NBc3NldCcpO1xudmFyIGNhbGxJbk5leHRUaWNrID0gcmVxdWlyZSgnLi91dGlscycpLmNhbGxJbk5leHRUaWNrO1xudmFyIExvYWRlciA9IHJlcXVpcmUoJy4uL2xvYWQtcGlwZWxpbmUvQ0NMb2FkZXInKTtcbnZhciBBc3NldFRhYmxlID0gcmVxdWlyZSgnLi4vbG9hZC1waXBlbGluZS9hc3NldC10YWJsZScpO1xudmFyIFBhY2tEb3dubG9hZGVyID0gcmVxdWlyZSgnLi4vbG9hZC1waXBlbGluZS9wYWNrLWRvd25sb2FkZXInKTtcbnZhciBBdXRvUmVsZWFzZVV0aWxzID0gcmVxdWlyZSgnLi4vbG9hZC1waXBlbGluZS9hdXRvLXJlbGVhc2UtdXRpbHMnKTtcbnZhciBkZWNvZGVVdWlkID0gcmVxdWlyZSgnLi4vdXRpbHMvZGVjb2RlLXV1aWQnKTtcbnZhciBNRDVQaXBlID0gcmVxdWlyZSgnLi4vbG9hZC1waXBlbGluZS9tZDUtcGlwZScpO1xudmFyIFN1YlBhY2tQaXBlID0gcmVxdWlyZSgnLi4vbG9hZC1waXBlbGluZS9zdWJwYWNrYWdlLXBpcGUnKTtcbnZhciBqcyA9IHJlcXVpcmUoJy4vanMnKTtcblxuLyoqXG4gKiBUaGUgYXNzZXQgbGlicmFyeSB3aGljaCBtYW5hZ2luZyBsb2FkaW5nL3VubG9hZGluZyBhc3NldHMgaW4gcHJvamVjdC5cbiAqXG4gKiBAY2xhc3MgQXNzZXRMaWJyYXJ5XG4gKiBAc3RhdGljXG4gKi9cblxuLy8gY29uZmlnc1xuXG52YXIgX2xpYnJhcnlCYXNlID0gJyc7XG52YXIgX3Jhd0Fzc2V0c0Jhc2UgPSAnJzsgICAgIC8vIFRoZSBiYXNlIGRpciBmb3IgcmF3IGFzc2V0cyBpbiBydW50aW1lXG52YXIgX3V1aWRUb1Jhd0Fzc2V0ID0ganMuY3JlYXRlTWFwKHRydWUpO1xuXG5mdW5jdGlvbiBpc1NjZW5lIChhc3NldCkge1xuICAgIHJldHVybiBhc3NldCAmJiAoYXNzZXQuY29uc3RydWN0b3IgPT09IGNjLlNjZW5lQXNzZXQgfHwgYXNzZXQgaW5zdGFuY2VvZiBjYy5TY2VuZSk7XG59XG5cbi8vIHR5cGVzXG5cbmZ1bmN0aW9uIFJhd0Fzc2V0RW50cnkgKHVybCwgdHlwZSkge1xuICAgIHRoaXMudXJsID0gdXJsO1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG59XG5cbi8vIHB1YmxpY3NcblxudmFyIEFzc2V0TGlicmFyeSA9IHtcbiAgICAvKipcbiAgICAgKiBAY2FsbGJhY2sgbG9hZENhbGxiYWNrXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGVycm9yIC0gbnVsbCBvciB0aGUgZXJyb3IgaW5mb1xuICAgICAqIEBwYXJhbSB7QXNzZXR9IGRhdGEgLSB0aGUgbG9hZGVkIGFzc2V0IG9yIG51bGxcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgbG9hZEFzc2V0XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHV1aWRcbiAgICAgKiBAcGFyYW0ge2xvYWRDYWxsYmFja30gY2FsbGJhY2sgLSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gb25jZSBsb2FkIGZpbmlzaGVkXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMucmVhZE1haW5DYWNoZSAtIERlZmF1bHQgaXMgdHJ1ZS4gSWYgZmFsc2UsIHRoZSBhc3NldCBhbmQgYWxsIGl0cyBkZXBlbmRzIGFzc2V0cyB3aWxsIHJlbG9hZCBhbmQgY3JlYXRlIG5ldyBpbnN0YW5jZXMgZnJvbSBsaWJyYXJ5LlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy53cml0ZU1haW5DYWNoZSAtIERlZmF1bHQgaXMgdHJ1ZS4gSWYgdHJ1ZSwgdGhlIHJlc3VsdCB3aWxsIGNhY2hlIHRvIEFzc2V0TGlicmFyeSwgYW5kIE1VU1QgYmUgdW5sb2FkIGJ5IHVzZXIgbWFudWFsbHkuXG4gICAgICogQHBhcmFtIHtBc3NldH0gb3B0aW9ucy5leGlzdGluZ0Fzc2V0IC0gbG9hZCB0byBleGlzdGluZyBhc3NldCwgdGhpcyBhcmd1bWVudCBpcyBvbmx5IGF2YWlsYWJsZSBpbiBlZGl0b3JcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGxvYWRBc3NldDogZnVuY3Rpb24gKHV1aWQsIGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdXVpZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsSW5OZXh0VGljayhjYWxsYmFjaywgbmV3IEVycm9yKCdbQXNzZXRMaWJyYXJ5XSB1dWlkIG11c3QgYmUgc3RyaW5nJyksIG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHZhciByZWFkTWFpbkNhY2hlID0gdHlwZW9mIChvcHRpb25zICYmIG9wdGlvbnMucmVhZE1haW5DYWNoZSkgIT09ICd1bmRlZmluZWQnID8gcmVhZE1haW5DYWNoZSA6IHRydWU7XG4gICAgICAgIC8vIHZhciB3cml0ZU1haW5DYWNoZSA9IHR5cGVvZiAob3B0aW9ucyAmJiBvcHRpb25zLndyaXRlTWFpbkNhY2hlKSAhPT0gJ3VuZGVmaW5lZCcgPyB3cml0ZU1haW5DYWNoZSA6IHRydWU7XG4gICAgICAgIHZhciBpdGVtID0ge1xuICAgICAgICAgICAgdXVpZDogdXVpZCxcbiAgICAgICAgICAgIHR5cGU6ICd1dWlkJ1xuICAgICAgICB9O1xuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmV4aXN0aW5nQXNzZXQpIHtcbiAgICAgICAgICAgIGl0ZW0uZXhpc3RpbmdBc3NldCA9IG9wdGlvbnMuZXhpc3RpbmdBc3NldDtcbiAgICAgICAgfVxuICAgICAgICBMb2FkZXIubG9hZChpdGVtLCBmdW5jdGlvbiAoZXJyb3IsIGFzc2V0KSB7XG4gICAgICAgICAgICBpZiAoZXJyb3IgfHwgIWFzc2V0KSB7XG4gICAgICAgICAgICAgICAgbGV0IGVycm9ySW5mbyA9IHR5cGVvZiBlcnJvciA9PT0gJ3N0cmluZycgPyBlcnJvciA6IChlcnJvciA/IChlcnJvci5tZXNzYWdlIHx8IGVycm9yLmVycm9yTWVzc2FnZSB8fCBKU09OLnN0cmluZ2lmeShlcnJvcikpIDogJ1Vua25vd24gZXJyb3InKTtcbiAgICAgICAgICAgICAgICBlcnJvciA9IG5ldyBFcnJvcignW0Fzc2V0TGlicmFyeV0gbG9hZGluZyBKU09OIG9yIGRlcGVuZGVuY2llcyBmYWlsZWQ6JyArIGVycm9ySW5mbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoYXNzZXQuY29uc3RydWN0b3IgPT09IGNjLlNjZW5lQXNzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUiAmJiAhYXNzZXQuc2NlbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEVkaXRvci5lcnJvcignU29ycnksIHRoZSBzY2VuZSBkYXRhIG9mIFwiJXNcIiBpcyBjb3JydXB0ZWQhJywgdXVpZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gY2MubG9hZGVyLl9nZXRSZWZlcmVuY2VLZXkodXVpZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhc3NldC5zY2VuZS5kZXBlbmRBc3NldHMgPSBBdXRvUmVsZWFzZVV0aWxzLmdldERlcGVuZHNSZWN1cnNpdmVseShrZXkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IgfHwgaXNTY2VuZShhc3NldCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gY2MubG9hZGVyLl9nZXRSZWZlcmVuY2VLZXkodXVpZCk7XG4gICAgICAgICAgICAgICAgICAgIExvYWRlci5yZW1vdmVJdGVtKGlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgYXNzZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgZ2V0TGliVXJsTm9FeHQ6IGZ1bmN0aW9uICh1dWlkLCBpblJhd0Fzc2V0c0Rpcikge1xuICAgICAgICBpZiAoQ0NfQlVJTEQpIHtcbiAgICAgICAgICAgIHV1aWQgPSBkZWNvZGVVdWlkKHV1aWQpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBiYXNlID0gKENDX0JVSUxEICYmIGluUmF3QXNzZXRzRGlyKSA/IChfcmF3QXNzZXRzQmFzZSArICdhc3NldHMvJykgOiBfbGlicmFyeUJhc2U7XG4gICAgICAgIHJldHVybiBiYXNlICsgdXVpZC5zbGljZSgwLCAyKSArICcvJyArIHV1aWQ7XG4gICAgfSxcblxuICAgIF9xdWVyeUFzc2V0SW5mb0luRWRpdG9yOiBmdW5jdGlvbiAodXVpZCwgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgRWRpdG9yLklwYy5zZW5kVG9NYWluKCdzY2VuZTpxdWVyeS1hc3NldC1pbmZvLWJ5LXV1aWQnLCB1dWlkLCBmdW5jdGlvbiAoZXJyLCBpbmZvKSB7XG4gICAgICAgICAgICAgICAgaWYgKGluZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgRWRpdG9yLlV0aWxzLlV1aWRDYWNoZS5jYWNoZShpbmZvLnVybCwgdXVpZCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjdG9yID0gRWRpdG9yLmFzc2V0c1tpbmZvLnR5cGVdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3Rvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlzUmF3QXNzZXQgPSAhanMuaXNDaGlsZENsYXNzT2YoY3RvciwgQXNzZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgaW5mby51cmwsIGlzUmF3QXNzZXQsIGN0b3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKCdDYW4gbm90IGZpbmQgYXNzZXQgdHlwZSAnICsgaW5mby50eXBlKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IG5ldyBFcnJvcignQ2FuIG5vdCBnZXQgYXNzZXQgdXJsIGJ5IHV1aWQgXCInICsgdXVpZCArICdcIiwgdGhlIGFzc2V0IG1heSBiZSBkZWxldGVkLicpO1xuICAgICAgICAgICAgICAgICAgICBlcnJvci5lcnJvckNvZGUgPSAnZGIuTk9URk9VTkQnO1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgLTEpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9nZXRBc3NldEluZm9JblJ1bnRpbWU6IGZ1bmN0aW9uICh1dWlkLCByZXN1bHQpIHtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0IHx8IHt1cmw6IG51bGwsIHJhdzogZmFsc2V9O1xuICAgICAgICB2YXIgaW5mbyA9IF91dWlkVG9SYXdBc3NldFt1dWlkXTtcbiAgICAgICAgaWYgKGluZm8gJiYgIWpzLmlzQ2hpbGRDbGFzc09mKGluZm8udHlwZSwgY2MuQXNzZXQpKSB7XG4gICAgICAgICAgICAvLyBiYWNrd2FyZCBjb21wYXRpYmlsaXR5IHNpbmNlIDEuMTBcbiAgICAgICAgICAgIHJlc3VsdC51cmwgPSBfcmF3QXNzZXRzQmFzZSArIGluZm8udXJsO1xuICAgICAgICAgICAgcmVzdWx0LnJhdyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQudXJsID0gdGhpcy5nZXRMaWJVcmxOb0V4dCh1dWlkKSArICcuanNvbic7XG4gICAgICAgICAgICByZXN1bHQucmF3ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuXG4gICAgX3V1aWRJblNldHRpbmdzOiBmdW5jdGlvbiAodXVpZCkge1xuICAgICAgICByZXR1cm4gdXVpZCBpbiBfdXVpZFRvUmF3QXNzZXQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgcXVlcnlBc3NldEluZm9cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXVpZFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICogQHBhcmFtIHtFcnJvcn0gY2FsbGJhY2suZXJyb3JcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gY2FsbGJhY2sudXJsIC0gdGhlIHVybCBvZiByYXcgYXNzZXQgb3IgaW1wb3J0ZWQgYXNzZXRcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGNhbGxiYWNrLnJhdyAtIGluZGljYXRlcyB3aGV0aGVyIHRoZSBhc3NldCBpcyByYXcgYXNzZXRcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjay5jdG9ySW5FZGl0b3IgLSB0aGUgYWN0dWFsIHR5cGUgb2YgYXNzZXQsIHVzZWQgaW4gZWRpdG9yIG9ubHlcbiAgICAgKi9cbiAgICBxdWVyeUFzc2V0SW5mbzogZnVuY3Rpb24gKHV1aWQsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmIChDQ19FRElUT1IgJiYgIUNDX1RFU1QpIHtcbiAgICAgICAgICAgIHRoaXMuX3F1ZXJ5QXNzZXRJbmZvSW5FZGl0b3IodXVpZCwgY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGluZm8gPSB0aGlzLl9nZXRBc3NldEluZm9JblJ1bnRpbWUodXVpZCk7XG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBpbmZvLnVybCwgaW5mby5yYXcpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHBhcnNlIHV1aWQgb3V0IG9mIHVybFxuICAgIHBhcnNlVXVpZEluRWRpdG9yOiBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHZhciB1dWlkID0gJyc7XG4gICAgICAgICAgICB2YXIgaXNJbXBvcnRlZCA9IHVybC5zdGFydHNXaXRoKF9saWJyYXJ5QmFzZSk7XG4gICAgICAgICAgICBpZiAoaXNJbXBvcnRlZCkge1xuICAgICAgICAgICAgICAgIHZhciBkaXIgPSBjYy5wYXRoLmRpcm5hbWUodXJsKTtcbiAgICAgICAgICAgICAgICB2YXIgZGlyQmFzZW5hbWUgPSBjYy5wYXRoLmJhc2VuYW1lKGRpcik7XG5cbiAgICAgICAgICAgICAgICB2YXIgaXNBc3NldFVybCA9IGRpckJhc2VuYW1lLmxlbmd0aCA9PT0gMjtcbiAgICAgICAgICAgICAgICBpZiAoaXNBc3NldFVybCkge1xuICAgICAgICAgICAgICAgICAgICB1dWlkID0gY2MucGF0aC5iYXNlbmFtZSh1cmwpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB1dWlkLmluZGV4T2YoJy4nKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXVpZCA9IHV1aWQuc2xpY2UoMCwgaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyByYXcgZmlsZSB1cmxcbiAgICAgICAgICAgICAgICAgICAgdXVpZCA9IGRpckJhc2VuYW1lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIElmIHVybCBpcyBub3QgaW4gdGhlIGxpYnJhcnksIGp1c3QgcmV0dXJuIFwiXCJcbiAgICAgICAgICAgIHJldHVybiB1dWlkO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgbG9hZEpzb25cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ganNvblxuICAgICAqIEBwYXJhbSB7bG9hZENhbGxiYWNrfSBjYWxsYmFja1xuICAgICAqIEByZXR1cm4ge0xvYWRpbmdIYW5kbGV9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBsb2FkSnNvbjogZnVuY3Rpb24gKGpzb24sIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciByYW5kb21VdWlkID0gJycgKyAoKG5ldyBEYXRlKCkpLmdldFRpbWUoKSArIE1hdGgucmFuZG9tKCkpO1xuICAgICAgICB2YXIgaXRlbSA9IHtcbiAgICAgICAgICAgIHV1aWQ6IHJhbmRvbVV1aWQsXG4gICAgICAgICAgICB0eXBlOiAndXVpZCcsXG4gICAgICAgICAgICBjb250ZW50OiBqc29uLFxuICAgICAgICAgICAgc2tpcHM6IFsgTG9hZGVyLmFzc2V0TG9hZGVyLmlkLCBMb2FkZXIuZG93bmxvYWRlci5pZCBdXG4gICAgICAgIH07XG4gICAgICAgIExvYWRlci5sb2FkKGl0ZW0sIGZ1bmN0aW9uIChlcnJvciwgYXNzZXQpIHtcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IEVycm9yKCdbQXNzZXRMaWJyYXJ5XSBsb2FkaW5nIEpTT04gb3IgZGVwZW5kZW5jaWVzIGZhaWxlZDogJyArIGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGFzc2V0LmNvbnN0cnVjdG9yID09PSBjYy5TY2VuZUFzc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXkgPSBjYy5sb2FkZXIuX2dldFJlZmVyZW5jZUtleShyYW5kb21VdWlkKTtcbiAgICAgICAgICAgICAgICAgICAgYXNzZXQuc2NlbmUuZGVwZW5kQXNzZXRzID0gQXV0b1JlbGVhc2VVdGlscy5nZXREZXBlbmRzUmVjdXJzaXZlbHkoa2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUiB8fCBpc1NjZW5lKGFzc2V0KSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSBjYy5sb2FkZXIuX2dldFJlZmVyZW5jZUtleShyYW5kb21VdWlkKTtcbiAgICAgICAgICAgICAgICAgICAgTG9hZGVyLnJlbW92ZUl0ZW0oaWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFzc2V0Ll91dWlkID0gJyc7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgYXNzZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBleGlzdHMgYXNzZXQgYnkgdXVpZC5cbiAgICAgKlxuICAgICAqIEBtZXRob2QgZ2V0QXNzZXRCeVV1aWRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXVpZFxuICAgICAqIEByZXR1cm4ge0Fzc2V0fSAtIHRoZSBleGlzdGluZyBhc3NldCwgaWYgbm90IGxvYWRlZCwganVzdCByZXR1cm5zIG51bGwuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBnZXRBc3NldEJ5VXVpZDogZnVuY3Rpb24gKHV1aWQpIHtcbiAgICAgICAgcmV0dXJuIEFzc2V0TGlicmFyeS5fdXVpZFRvQXNzZXRbdXVpZF0gfHwgbnVsbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogaW5pdCB0aGUgYXNzZXQgbGlicmFyeVxuICAgICAqXG4gICAgICogQG1ldGhvZCBpbml0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5saWJyYXJ5UGF0aCAtIOiDveaOpeaUtueahOS7u+aEj+exu+Wei+eahOi3r+W+hO+8jOmAmuW4uOWcqOe8lui+keWZqOmHjOS9v+eUqOe7neWvueeahO+8jOWcqOe9kemhtemHjOS9v+eUqOebuOWvueeahOOAglxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zLm1vdW50UGF0aHMgLSBtb3VudCBwb2ludCBvZiBhY3R1YWwgdXJscyBmb3IgcmF3IGFzc2V0cyAob25seSB1c2VkIGluIGVkaXRvcilcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMucmF3QXNzZXRzXSAtIHV1aWQgdG8gcmF3IGFzc2V0J3MgdXJscyAob25seSB1c2VkIGluIHJ1bnRpbWUpXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnJhd0Fzc2V0c0Jhc2VdIC0gYmFzZSBvZiByYXcgYXNzZXQncyB1cmxzIChvbmx5IHVzZWQgaW4gcnVudGltZSlcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMucGFja2VkQXNzZXRzXSAtIHBhY2tlZCBhc3NldHMgKG9ubHkgdXNlZCBpbiBydW50aW1lKVxuICAgICAqL1xuICAgIGluaXQ6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIGlmIChDQ19FRElUT1IgJiYgX2xpYnJhcnlCYXNlKSB7XG4gICAgICAgICAgICBjYy5lcnJvcklEKDY0MDIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cblxuICAgICAgICAvLyDov5nph4zlsIbot6/lvoTovawgdXJs77yM5LiN5L2/55So6Lev5b6E55qE5Y6f5Zug5piv5pyJ55qEIHJ1bnRpbWUg5LiN6IO96Kej5p6QIFwiXFxcIiDnrKblj7fjgIJcbiAgICAgICAgLy8g5LiN5L2/55SoIHVybC5mb3JtYXQg55qE5Y6f5Zug5pivIHdpbmRvd3Mg5LiN5pSv5oyBIGZpbGU6Ly8g5ZKMIC8vLyDlvIDlpLTnmoTljY/orq7vvIzmiYDku6Xlj6rog73nlKggcmVwbGFjZSDmk43kvZznm7TmjqXmiorot6/lvoTovazmiJAgVVJM44CCXG4gICAgICAgIHZhciBsaWJyYXJ5UGF0aCA9IG9wdGlvbnMubGlicmFyeVBhdGg7XG4gICAgICAgIGxpYnJhcnlQYXRoID0gbGlicmFyeVBhdGgucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xuICAgICAgICBfbGlicmFyeUJhc2UgPSBjYy5wYXRoLnN0cmlwU2VwKGxpYnJhcnlQYXRoKSArICcvJztcblxuICAgICAgICBfcmF3QXNzZXRzQmFzZSA9IG9wdGlvbnMucmF3QXNzZXRzQmFzZTtcblxuICAgICAgICBpZiAob3B0aW9ucy5zdWJwYWNrYWdlcykge1xuICAgICAgICAgICAgdmFyIHN1YlBhY2tQaXBlID0gbmV3IFN1YlBhY2tQaXBlKG9wdGlvbnMuc3VicGFja2FnZXMpO1xuICAgICAgICAgICAgY2MubG9hZGVyLmluc2VydFBpcGVBZnRlcihjYy5sb2FkZXIuYXNzZXRMb2FkZXIsIHN1YlBhY2tQaXBlKTtcbiAgICAgICAgICAgIGNjLmxvYWRlci5zdWJQYWNrUGlwZSA9IHN1YlBhY2tQaXBlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB2YXIgbWQ1QXNzZXRzTWFwID0gb3B0aW9ucy5tZDVBc3NldHNNYXA7XG4gICAgICAgIGlmIChtZDVBc3NldHNNYXAgJiYgbWQ1QXNzZXRzTWFwLmltcG9ydCkge1xuICAgICAgICAgICAgLy8gZGVjb2RlIHV1aWRcbiAgICAgICAgICAgIHZhciBpID0gMCwgdXVpZCA9IDA7XG4gICAgICAgICAgICB2YXIgbWQ1SW1wb3J0TWFwID0ganMuY3JlYXRlTWFwKHRydWUpO1xuICAgICAgICAgICAgdmFyIG1kNUVudHJpZXMgPSBtZDVBc3NldHNNYXAuaW1wb3J0O1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG1kNUVudHJpZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgICAgICAgICAgICB1dWlkID0gZGVjb2RlVXVpZChtZDVFbnRyaWVzW2ldKTtcbiAgICAgICAgICAgICAgICBtZDVJbXBvcnRNYXBbdXVpZF0gPSBtZDVFbnRyaWVzW2kgKyAxXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG1kNVJhd0Fzc2V0c01hcCA9IGpzLmNyZWF0ZU1hcCh0cnVlKTtcbiAgICAgICAgICAgIG1kNUVudHJpZXMgPSBtZDVBc3NldHNNYXBbJ3Jhdy1hc3NldHMnXTtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBtZDVFbnRyaWVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICAgICAgICAgICAgdXVpZCA9IGRlY29kZVV1aWQobWQ1RW50cmllc1tpXSk7XG4gICAgICAgICAgICAgICAgbWQ1UmF3QXNzZXRzTWFwW3V1aWRdID0gbWQ1RW50cmllc1tpICsgMV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBtZDVQaXBlID0gbmV3IE1ENVBpcGUobWQ1SW1wb3J0TWFwLCBtZDVSYXdBc3NldHNNYXAsIF9saWJyYXJ5QmFzZSk7XG4gICAgICAgICAgICBjYy5sb2FkZXIuaW5zZXJ0UGlwZUFmdGVyKGNjLmxvYWRlci5hc3NldExvYWRlciwgbWQ1UGlwZSk7XG4gICAgICAgICAgICBjYy5sb2FkZXIubWQ1UGlwZSA9IG1kNVBpcGU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpbml0IHJhdyBhc3NldHNcblxuICAgICAgICB2YXIgYXNzZXRUYWJsZXMgPSBMb2FkZXIuX2Fzc2V0VGFibGVzO1xuICAgICAgICBmb3IgKHZhciBtb3VudCBpbiBhc3NldFRhYmxlcykge1xuICAgICAgICAgICAgYXNzZXRUYWJsZXNbbW91bnRdLnJlc2V0KCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHZhciByYXdBc3NldHMgPSBvcHRpb25zLnJhd0Fzc2V0cztcbiAgICAgICAgaWYgKHJhd0Fzc2V0cykge1xuICAgICAgICAgICAgZm9yICh2YXIgbW91bnRQb2ludCBpbiByYXdBc3NldHMpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXNzZXRzID0gcmF3QXNzZXRzW21vdW50UG9pbnRdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHV1aWQgaW4gYXNzZXRzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbmZvID0gYXNzZXRzW3V1aWRdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdXJsID0gaW5mb1swXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHR5cGVJZCA9IGluZm9bMV07XG4gICAgICAgICAgICAgICAgICAgIHZhciB0eXBlID0gY2MuanMuX2dldENsYXNzQnlJZCh0eXBlSWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmVycm9yKCdDYW5ub3QgZ2V0JywgdHlwZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgc2luY2UgMS4xMFxuICAgICAgICAgICAgICAgICAgICBfdXVpZFRvUmF3QXNzZXRbdXVpZF0gPSBuZXcgUmF3QXNzZXRFbnRyeShtb3VudFBvaW50ICsgJy8nICsgdXJsLCB0eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaW5pdCByZXNvdXJjZXNcbiAgICAgICAgICAgICAgICAgICAgdmFyIGV4dCA9IGNjLnBhdGguZXh0bmFtZSh1cmwpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0cmltIGJhc2UgZGlyIGFuZCBleHRuYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmwgPSB1cmwuc2xpY2UoMCwgLSBleHQubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBpc1N1YkFzc2V0ID0gaW5mb1syXSA9PT0gMTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhc3NldFRhYmxlc1ttb3VudFBvaW50XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXRUYWJsZXNbbW91bnRQb2ludF0gPSBuZXcgQXNzZXRUYWJsZSgpO1xuICAgICAgICAgICAgICAgICAgICB9IFxuXG4gICAgICAgICAgICAgICAgICAgIGFzc2V0VGFibGVzW21vdW50UG9pbnRdLmFkZCh1cmwsIHV1aWQsIHR5cGUsICFpc1N1YkFzc2V0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucy5wYWNrZWRBc3NldHMpIHtcbiAgICAgICAgICAgIFBhY2tEb3dubG9hZGVyLmluaXRQYWNrcyhvcHRpb25zLnBhY2tlZEFzc2V0cyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpbml0IGNjLnVybFxuICAgICAgICBjYy51cmwuX2luaXQoKG9wdGlvbnMubW91bnRQYXRocyAmJiBvcHRpb25zLm1vdW50UGF0aHMuYXNzZXRzKSB8fCBfcmF3QXNzZXRzQmFzZSArICdhc3NldHMnKTtcbiAgICB9XG5cbn07XG5cbi8vIHVubG9hZCBhc3NldCBpZiBpdCBpcyBkZXN0b3J5ZWRcblxuLyoqXG4gKiAhI2VuIENhY2hlcyB1dWlkIHRvIGFsbCBsb2FkZWQgYXNzZXRzIGluIHNjZW5lcy5cbiAqXG4gKiAhI3poIOi/memHjOS/neWtmOaJgOacieW3sue7j+WKoOi9veeahOWcuuaZr+i1hOa6kO+8jOmYsuatouWQjOS4gOS4qui1hOa6kOWcqOWGheWtmOS4reWKoOi9veWHuuWkmuS7veaLt+i0neOAglxuICpcbiAqIOi/memHjOeUqOS4jeS6hldlYWtNYXDvvIzlnKjmtY/op4jlmajkuK3miYDmnInliqDovb3ov4fnmoTotYTmupDpg73lj6rog73miYvlt6XosIPnlKggdW5sb2FkQXNzZXQg6YeK5pS+44CCXG4gKlxuICog5Y+C6ICD77yaXG4gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9XZWFrTWFwXG4gKiBodHRwczovL2dpdGh1Yi5jb20vVG9vVGFsbE5hdGUvbm9kZS13ZWFrXG4gKlxuICogQHByb3BlcnR5IHtvYmplY3R9IF91dWlkVG9Bc3NldFxuICogQHByaXZhdGVcbiAqL1xuQXNzZXRMaWJyYXJ5Ll91dWlkVG9Bc3NldCA9IHt9O1xuXG4vL+aaguaXtuWxj+iUve+8jOWboOS4uuebruWJjeayoeaciee8k+WtmOS7u+S9lWFzc2V0XG4vL2lmIChDQ19ERVYgJiYgQXNzZXQucHJvdG90eXBlLl9vblByZURlc3Ryb3kpIHtcbi8vICAgIGNjLmVycm9yKCdfb25QcmVEZXN0cm95IG9mIEFzc2V0IGhhcyBhbHJlYWR5IGRlZmluZWQnKTtcbi8vfVxuLy9Bc3NldC5wcm90b3R5cGUuX29uUHJlRGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbi8vICAgIGlmIChBc3NldExpYnJhcnkuX3V1aWRUb0Fzc2V0W3RoaXMuX3V1aWRdID09PSB0aGlzKSB7XG4vLyAgICAgICAgQXNzZXRMaWJyYXJ5LnVubG9hZEFzc2V0KHRoaXMpO1xuLy8gICAgfVxuLy99O1xuXG5cbi8vIFRPRE86IEFkZCBCdWlsdGluTWFuYWdlciB0byBoYW5kbGUgYnVpbHRpbiBsb2dpY1xubGV0IF9idWlsdGlucyA9IHtcbiAgICBlZmZlY3Q6IHt9LFxuICAgIG1hdGVyaWFsOiB7fVxufTtcblxubGV0IF9idWlsdGluRGVwcyA9IHt9O1xuXG5mdW5jdGlvbiBsb2FkQnVpbHRpbnMgKG5hbWUsIHR5cGUsIGNiKSB7XG4gICAgbGV0IGRpcm5hbWUgPSBuYW1lICArICdzJztcbiAgICBsZXQgYnVpbHRpbiA9IF9idWlsdGluc1tuYW1lXSA9IHt9O1xuICAgIGxldCBpbnRlcm5hbE1vdW50UGF0aCA9ICdpbnRlcm5hbCc7XG4gICAgLy8gaW50ZXJuYWwgcGF0aCB3aWxsIGJlIGNoYW5nZWQgd2hlbiBydW4gc2ltdWxhdG9yXG4gICAgaWYgKENDX1BSRVZJRVcgJiYgQ0NfSlNCKSB7XG4gICAgICAgIGludGVybmFsTW91bnRQYXRoID0gJ3RlbXAvaW50ZXJuYWwnO1xuICAgIH1cbiAgICBjYy5sb2FkZXIubG9hZFJlc0RpcihkaXJuYW1lLCB0eXBlLCBpbnRlcm5hbE1vdW50UGF0aCwgKCkgPT4geyB9LCAoZXJyLCBhc3NldHMpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgY2MuZXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXNzZXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFzc2V0ID0gYXNzZXRzW2ldO1xuICAgICAgICAgICAgICAgIHZhciBkZXBzID0gY2MubG9hZGVyLmdldERlcGVuZHNSZWN1cnNpdmVseShhc3NldCk7XG4gICAgICAgICAgICAgICAgZGVwcy5mb3JFYWNoKHV1aWQgPT4gX2J1aWx0aW5EZXBzW3V1aWRdID0gdHJ1ZSk7XG4gICAgICAgICAgICAgICAgYnVpbHRpbltgJHthc3NldC5uYW1lfWBdID0gYXNzZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjYigpO1xuICAgIH0pO1xufVxuXG5Bc3NldExpYnJhcnkuX2xvYWRCdWlsdGlucyA9IGZ1bmN0aW9uIChjYikge1xuICAgIGlmIChjYy5nYW1lLnJlbmRlclR5cGUgPT09IGNjLmdhbWUuUkVOREVSX1RZUEVfQ0FOVkFTKSB7XG4gICAgICAgIHJldHVybiBjYiAmJiBjYigpO1xuICAgIH1cblxuICAgIGxvYWRCdWlsdGlucygnZWZmZWN0JywgY2MuRWZmZWN0QXNzZXQsICgpID0+IHtcbiAgICAgICAgbG9hZEJ1aWx0aW5zKCdtYXRlcmlhbCcsIGNjLk1hdGVyaWFsLCBjYik7XG4gICAgfSk7XG59O1xuXG5Bc3NldExpYnJhcnkuZ2V0QnVpbHRpbiA9IGZ1bmN0aW9uICh0eXBlLCBuYW1lKSB7XG4gICAgcmV0dXJuIF9idWlsdGluc1t0eXBlXVtuYW1lXTtcbn07XG5cbkFzc2V0TGlicmFyeS5nZXRCdWlsdGlucyA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgaWYgKCF0eXBlKSByZXR1cm4gX2J1aWx0aW5zO1xuICAgIHJldHVybiBfYnVpbHRpbnNbdHlwZV07XG59O1xuQXNzZXRMaWJyYXJ5LnJlc2V0QnVpbHRpbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgX2J1aWx0aW5zID0ge1xuICAgICAgICBlZmZlY3Q6IHt9LFxuICAgICAgICBtYXRlcmlhbDoge31cbiAgICB9O1xuICAgIF9idWlsdGluRGVwcyA9IHt9O1xufTtcbkFzc2V0TGlicmFyeS5nZXRCdWlsdGluRGVwcyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gX2J1aWx0aW5EZXBzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNjLkFzc2V0TGlicmFyeSA9IEFzc2V0TGlicmFyeTtcbiJdfQ==