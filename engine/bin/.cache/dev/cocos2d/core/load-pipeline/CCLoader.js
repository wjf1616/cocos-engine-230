
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/load-pipeline/CCLoader.js';
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
var js = require('../platform/js');

var Pipeline = require('./pipeline');

var LoadingItems = require('./loading-items');

var AssetLoader = require('./asset-loader');

var Downloader = require('./downloader');

var Loader = require('./loader');

var AssetTable = require('./asset-table');

var callInNextTick = require('../platform/utils').callInNextTick;

var AutoReleaseUtils = require('./auto-release-utils'); // var pushToMap = require('../utils/misc').pushToMap;


var ReleasedAssetChecker = CC_DEBUG && require('./released-asset-checker');

var assetTables = Object.create(null);
assetTables.assets = new AssetTable();
assetTables.internal = new AssetTable();

function getXMLHttpRequest() {
  return window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject('MSXML2.XMLHTTP');
}

var _info = {
  url: null,
  raw: false
}; // Convert a resources by finding its real url with uuid, otherwise we will use the uuid or raw url as its url
// So we gurantee there will be url in result

function getResWithUrl(res) {
  var id, result, isUuid;

  if (typeof res === 'object') {
    result = res;

    if (res.url) {
      return result;
    } else {
      id = res.uuid;
    }
  } else {
    result = {};
    id = res;
  }

  isUuid = result.type ? result.type === 'uuid' : cc.AssetLibrary._uuidInSettings(id);

  cc.AssetLibrary._getAssetInfoInRuntime(id, _info);

  result.url = !isUuid ? id : _info.url;

  if (_info.url && result.type === 'uuid' && _info.raw) {
    result.type = null;
    result.isRawAsset = true;
  } else if (!isUuid) {
    result.isRawAsset = true;
  }

  return result;
}

var _sharedResources = [];
var _sharedList = [];
/**
 * Loader for resource loading process. It's a singleton object.
 * @class loader
 * @extends Pipeline
 * @static
 */

function CCLoader() {
  var assetLoader = new AssetLoader();
  var downloader = new Downloader();
  var loader = new Loader();
  Pipeline.call(this, [assetLoader, downloader, loader]);
  /**
   * The asset loader in cc.loader's pipeline, it's by default the first pipe.
   * It's used to identify an asset's type, and determine how to download it.
   * @property assetLoader
   * @type {Object}
   */

  this.assetLoader = assetLoader;
  /**
   * The md5 pipe in cc.loader's pipeline, it could be absent if the project isn't build with md5 option.
   * It's used to modify the url to the real downloadable url with md5 suffix.
   * @property md5Pipe
   * @type {Object}
   */

  this.md5Pipe = null;
  /**
   * The downloader in cc.loader's pipeline, it's by default the second pipe.
   * It's used to download files with several handlers: pure text, image, script, audio, font, uuid.
   * You can add your own download function with addDownloadHandlers
   * @property downloader
   * @type {Object}
   */

  this.downloader = downloader;
  /**
   * The loader in cc.loader's pipeline, it's by default the third pipe.
   * It's used to parse downloaded content with several handlers: JSON, image, plist, fnt, uuid.
   * You can add your own download function with addLoadHandlers
   * @property loader
   * @type {Object}
   */

  this.loader = loader;
  this.onProgress = null; // assets to release automatically

  this._autoReleaseSetting = js.createMap(true);

  if (CC_DEBUG) {
    this._releasedAssetChecker_DEBUG = new ReleasedAssetChecker();
  }
}

js.extend(CCLoader, Pipeline);
var proto = CCLoader.prototype;

proto.init = function (director) {
  if (CC_DEBUG) {
    var self = this;
    director.on(cc.Director.EVENT_AFTER_UPDATE, function () {
      self._releasedAssetChecker_DEBUG.checkCouldRelease(self._cache);
    });
  }
};
/**
 * Gets a new XMLHttpRequest instance.
 * @method getXMLHttpRequest
 * @returns {XMLHttpRequest}
 */


proto.getXMLHttpRequest = getXMLHttpRequest;
/**
 * Add custom supported types handler or modify existing type handler for download process.
 * @example
 *  cc.loader.addDownloadHandlers({
 *      // This will match all url with `.scene` extension or all url with `scene` type
 *      'scene' : function (url, callback) {}
 *  });
 * @method addDownloadHandlers
 * @param {Object} extMap Custom supported types with corresponded handler
 */

proto.addDownloadHandlers = function (extMap) {
  this.downloader.addHandlers(extMap);
};
/**
 * Add custom supported types handler or modify existing type handler for load process.
 * @example
 *  cc.loader.addLoadHandlers({
 *      // This will match all url with `.scene` extension or all url with `scene` type
 *      'scene' : function (url, callback) {}
 *  });
 * @method addLoadHandlers
 * @param {Object} extMap Custom supported types with corresponded handler
 */


proto.addLoadHandlers = function (extMap) {
  this.loader.addHandlers(extMap);
};
/**
 * Load resources with a progression callback and a complete callback.
 * The progression callback is the same as Pipeline's {{#crossLink "LoadingItems/onProgress:method"}}onProgress{{/crossLink}}
 * The complete callback is almost the same as Pipeline's {{#crossLink "LoadingItems/onComplete:method"}}onComplete{{/crossLink}}
 * The only difference is when user pass a single url as resources, the complete callback will set its result directly as the second parameter.
 *
 * @example
 * cc.loader.load('a.png', function (err, tex) {
 *     cc.log('Result should be a texture: ' + (tex instanceof cc.Texture2D));
 * });
 *
 * cc.loader.load('http://example.com/a.png', function (err, tex) {
 *     cc.log('Should load a texture from external url: ' + (tex instanceof cc.Texture2D));
 * });
 *
 * cc.loader.load({url: 'http://example.com/getImageREST?file=a.png', type: 'png'}, function (err, tex) {
 *     cc.log('Should load a texture from RESTful API by specify the type: ' + (tex instanceof cc.Texture2D));
 * });
 *
 * cc.loader.load(['a.png', 'b.json'], function (errors, results) {
 *     if (errors) {
 *         for (var i = 0; i < errors.length; i++) {
 *             cc.log('Error url [' + errors[i] + ']: ' + results.getError(errors[i]));
 *         }
 *     }
 *     var aTex = results.getContent('a.png');
 *     var bJsonObj = results.getContent('b.json');
 * });
 *
 * @method load
 * @param {String|String[]|Object} resources - Url list in an array
 * @param {Function} [progressCallback] - Callback invoked when progression change
 * @param {Number} progressCallback.completedCount - The number of the items that are already completed
 * @param {Number} progressCallback.totalCount - The total number of the items
 * @param {Object} progressCallback.item - The latest item which flow out the pipeline
 * @param {Function} [completeCallback] - Callback invoked when all resources loaded
 * @typescript
 * load(resources: string|string[]|{uuid?: string, url?: string, type?: string}, completeCallback?: Function): void
 * load(resources: string|string[]|{uuid?: string, url?: string, type?: string}, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: Function|null): void
 */


proto.load = function (resources, progressCallback, completeCallback) {
  if (CC_DEV && !resources) {
    return cc.error("[cc.loader.load] resources must be non-nil.");
  }

  if (completeCallback === undefined) {
    completeCallback = progressCallback;
    progressCallback = this.onProgress || null;
  }

  var self = this;
  var singleRes = false;
  var res;

  if (!(resources instanceof Array)) {
    if (resources) {
      singleRes = true;
      resources = [resources];
    } else {
      resources = [];
    }
  }

  _sharedResources.length = 0;

  for (var i = 0; i < resources.length; ++i) {
    var resource = resources[i]; // Backward compatibility

    if (resource && resource.id) {
      cc.warnID(4920, resource.id);

      if (!resource.uuid && !resource.url) {
        resource.url = resource.id;
      }
    }

    res = getResWithUrl(resource);
    if (!res.url && !res.uuid) continue;
    var item = this._cache[res.url];

    _sharedResources.push(item || res);
  }

  var queue = LoadingItems.create(this, progressCallback, function (errors, items) {
    callInNextTick(function () {
      if (completeCallback) {
        if (singleRes) {
          var id = res.url;
          completeCallback.call(self, errors, items.getContent(id));
        } else {
          completeCallback.call(self, errors, items);
        }

        completeCallback = null;
      }

      if (CC_EDITOR) {
        for (var _id in self._cache) {
          if (self._cache[_id].complete) {
            self.removeItem(_id);
          }
        }
      }

      items.destroy();
    });
  });
  LoadingItems.initQueueDeps(queue);
  queue.append(_sharedResources);
  _sharedResources.length = 0;
};

proto.flowInDeps = function (owner, urlList, callback) {
  _sharedList.length = 0;

  for (var i = 0; i < urlList.length; ++i) {
    var res = getResWithUrl(urlList[i]);
    if (!res.url && !res.uuid) continue;
    var item = this._cache[res.url];

    if (item) {
      _sharedList.push(item);
    } else {
      _sharedList.push(res);
    }
  }

  var queue = LoadingItems.create(this, owner ? function (completedCount, totalCount, item) {
    if (this._ownerQueue && this._ownerQueue.onProgress) {
      this._ownerQueue._childOnProgress(item);
    }
  } : null, function (errors, items) {
    callback(errors, items); // Clear deps because it's already done
    // Each item will only flowInDeps once, so it's still safe here

    owner && owner.deps && (owner.deps.length = 0);
    items.destroy();
  });

  if (owner) {
    var ownerQueue = LoadingItems.getQueue(owner); // Set the root ownerQueue, if no ownerQueue defined in ownerQueue, it's the root

    queue._ownerQueue = ownerQueue._ownerQueue || ownerQueue;
  }

  var accepted = queue.append(_sharedList, owner);
  _sharedList.length = 0;
  return accepted;
};

proto._assetTables = assetTables;

proto._getResUuid = function (url, type, mount, quiet) {
  mount = mount || 'assets';
  var assetTable = assetTables[mount];

  if (!url || !assetTable) {
    return null;
  } // Ignore parameter


  var index = url.indexOf('?');
  if (index !== -1) url = url.substr(0, index);
  var uuid = assetTable.getUuid(url, type);

  if (!uuid) {
    var extname = cc.path.extname(url);

    if (extname) {
      // strip extname
      url = url.slice(0, -extname.length);
      uuid = assetTable.getUuid(url, type);

      if (uuid && !quiet) {
        cc.warnID(4901, url, extname);
      }
    }
  }

  return uuid;
}; // Find the asset's reference id in loader, asset could be asset object, asset uuid or asset url


proto._getReferenceKey = function (assetOrUrlOrUuid) {
  var key;

  if (typeof assetOrUrlOrUuid === 'object') {
    key = assetOrUrlOrUuid._uuid || null;
  } else if (typeof assetOrUrlOrUuid === 'string') {
    key = this._getResUuid(assetOrUrlOrUuid, null, null, true) || assetOrUrlOrUuid;
  }

  if (!key) {
    cc.warnID(4800, assetOrUrlOrUuid);
    return key;
  }

  cc.AssetLibrary._getAssetInfoInRuntime(key, _info);

  return this._cache[_info.url] ? _info.url : key;
};

proto._urlNotFound = function (url, type, completeCallback) {
  callInNextTick(function () {
    url = cc.url.normalize(url);
    var info = (type ? js.getClassName(type) : 'Asset') + " in \"resources/" + url + "\" does not exist.";

    if (completeCallback) {
      completeCallback(new Error(info), []);
    }
  });
};
/**
 * @param {Function} [type]
 * @param {Function} [onProgress]
 * @param {Function} onComplete
 * @returns {Object} arguments
 * @returns {Function} arguments.type
 * @returns {Function} arguments.onProgress
 * @returns {Function} arguments.onComplete
 */


proto._parseLoadResArgs = function (type, onProgress, onComplete) {
  if (onComplete === undefined) {
    var isValidType = type instanceof Array || js.isChildClassOf(type, cc.RawAsset);

    if (onProgress) {
      onComplete = onProgress;

      if (isValidType) {
        onProgress = this.onProgress || null;
      }
    } else if (onProgress === undefined && !isValidType) {
      onComplete = type;
      onProgress = this.onProgress || null;
      type = null;
    }

    if (onProgress !== undefined && !isValidType) {
      onProgress = type;
      type = null;
    }
  }

  return {
    type: type,
    onProgress: onProgress,
    onComplete: onComplete
  };
};
/**
 * Load resources from the "resources" folder inside the "assets" folder of your project.<br>
 * <br>
 * Note: All asset URLs in Creator use forward slashes, URLs using backslashes will not work.
 *
 * @method loadRes
 * @param {String} url - Url of the target resource.
 *                       The url is relative to the "resources" folder, extensions must be omitted.
 * @param {Function} [type] - Only asset of type will be loaded if this argument is supplied.
 * @param {Function} [progressCallback] - Callback invoked when progression change.
 * @param {Number} progressCallback.completedCount - The number of the items that are already completed.
 * @param {Number} progressCallback.totalCount - The total number of the items.
 * @param {Object} progressCallback.item - The latest item which flow out the pipeline.
 * @param {Function} [completeCallback] - Callback invoked when the resource loaded.
 * @param {Error} completeCallback.error - The error info or null if loaded successfully.
 * @param {Object} completeCallback.resource - The loaded resource if it can be found otherwise returns null.
 *
 * @example
 *
 * // load the prefab (project/assets/resources/misc/character/cocos) from resources folder
 * cc.loader.loadRes('misc/character/cocos', function (err, prefab) {
 *     if (err) {
 *         cc.error(err.message || err);
 *         return;
 *     }
 *     cc.log('Result should be a prefab: ' + (prefab instanceof cc.Prefab));
 * });
 *
 * // load the sprite frame of (project/assets/resources/imgs/cocos.png) from resources folder
 * cc.loader.loadRes('imgs/cocos', cc.SpriteFrame, function (err, spriteFrame) {
 *     if (err) {
 *         cc.error(err.message || err);
 *         return;
 *     }
 *     cc.log('Result should be a sprite frame: ' + (spriteFrame instanceof cc.SpriteFrame));
 * });
 * @typescript
 * loadRes(url: string, type: typeof cc.Asset, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any) => void)|null): void
 * loadRes(url: string, type: typeof cc.Asset, completeCallback: (error: Error, resource: any) => void): void
 * loadRes(url: string, type: typeof cc.Asset): void
 * loadRes(url: string, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any) => void)|null): void
 * loadRes(url: string, completeCallback: (error: Error, resource: any) => void): void
 * loadRes(url: string): void
 */


proto.loadRes = function (url, type, mount, progressCallback, completeCallback) {
  if (arguments.length !== 5) {
    completeCallback = progressCallback;
    progressCallback = mount;
    mount = 'assets';
  }

  var args = this._parseLoadResArgs(type, progressCallback, completeCallback);

  type = args.type;
  progressCallback = args.onProgress;
  completeCallback = args.onComplete;
  var self = this;

  var uuid = self._getResUuid(url, type, mount);

  if (uuid) {
    this.load({
      type: 'uuid',
      uuid: uuid
    }, progressCallback, function (err, asset) {
      if (asset) {
        // should not release these assets, even if they are static referenced in the scene.
        self.setAutoReleaseRecursively(uuid, false);
      }

      if (completeCallback) {
        completeCallback(err, asset);
      }
    });
  } else {
    self._urlNotFound(url, type, completeCallback);
  }
};

proto._loadResUuids = function (uuids, progressCallback, completeCallback, urls) {
  if (uuids.length > 0) {
    var self = this;
    var res = uuids.map(function (uuid) {
      return {
        type: 'uuid',
        uuid: uuid
      };
    });
    this.load(res, progressCallback, function (errors, items) {
      if (completeCallback) {
        var assetRes = [];
        var urlRes = urls && [];

        for (var i = 0; i < res.length; ++i) {
          var uuid = res[i].uuid;

          var id = this._getReferenceKey(uuid);

          var item = items.getContent(id);

          if (item) {
            // should not release these assets, even if they are static referenced in the scene.
            self.setAutoReleaseRecursively(uuid, false);
            assetRes.push(item);

            if (urlRes) {
              urlRes.push(urls[i]);
            }
          }
        }

        if (urls) {
          completeCallback(errors, assetRes, urlRes);
        } else {
          completeCallback(errors, assetRes);
        }
      }
    });
  } else {
    if (completeCallback) {
      callInNextTick(function () {
        if (urls) {
          completeCallback(null, [], []);
        } else {
          completeCallback(null, []);
        }
      });
    }
  }
};
/**
 * This method is like {{#crossLink "loader/loadRes:method"}}{{/crossLink}} except that it accepts array of url.
 *
 * @method loadResArray
 * @param {String[]} urls - Array of URLs of the target resource.
 *                          The url is relative to the "resources" folder, extensions must be omitted.
 * @param {Function} [type] - Only asset of type will be loaded if this argument is supplied.
 * @param {Function} [progressCallback] - Callback invoked when progression change.
 * @param {Number} progressCallback.completedCount - The number of the items that are already completed.
 * @param {Number} progressCallback.totalCount - The total number of the items.
 * @param {Object} progressCallback.item - The latest item which flow out the pipeline.
 * @param {Function} [completeCallback] - A callback which is called when all assets have been loaded, or an error occurs.
 * @param {Error} completeCallback.error - If one of the asset failed, the complete callback is immediately called
 *                                         with the error. If all assets are loaded successfully, error will be null.
 * @param {Asset[]|Array} completeCallback.assets - An array of all loaded assets.
 *                                                     If nothing to load, assets will be an empty array.
 * @example
 *
 * // load the SpriteFrames from resources folder
 * var spriteFrames;
 * var urls = ['misc/characters/character_01', 'misc/weapons/weapons_01'];
 * cc.loader.loadResArray(urls, cc.SpriteFrame, function (err, assets) {
 *     if (err) {
 *         cc.error(err);
 *         return;
 *     }
 *     spriteFrames = assets;
 *     // ...
 * });
 * @typescript
 * loadResArray(url: string[], type: typeof cc.Asset, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any[]) => void)|null): void
 * loadResArray(url: string[], type: typeof cc.Asset, completeCallback: (error: Error, resource: any[]) => void): void
 * loadResArray(url: string[], type: typeof cc.Asset): void
 * loadResArray(url: string[], progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any[]) => void)|null): void
 * loadResArray(url: string[], completeCallback: (error: Error, resource: any[]) => void): void
 * loadResArray(url: string[]): void
 * loadResArray(url: string[], type: typeof cc.Asset[]): void
 */


proto.loadResArray = function (urls, type, mount, progressCallback, completeCallback) {
  if (arguments.length !== 5) {
    completeCallback = progressCallback;
    progressCallback = mount;
    mount = 'assets';
  }

  var args = this._parseLoadResArgs(type, progressCallback, completeCallback);

  type = args.type;
  progressCallback = args.onProgress;
  completeCallback = args.onComplete;
  var uuids = [];
  var isTypesArray = type instanceof Array;

  for (var i = 0; i < urls.length; i++) {
    var url = urls[i];
    var assetType = isTypesArray ? type[i] : type;

    var uuid = this._getResUuid(url, assetType, mount);

    if (uuid) {
      uuids.push(uuid);
    } else {
      this._urlNotFound(url, assetType, completeCallback);

      return;
    }
  }

  this._loadResUuids(uuids, progressCallback, completeCallback);
};
/**
 * Load all assets in a folder inside the "assets/resources" folder of your project.<br>
 * <br>
 * Note: All asset URLs in Creator use forward slashes, URLs using backslashes will not work.
 *
 * @method loadResDir
 * @param {String} url - Url of the target folder.
 *                       The url is relative to the "resources" folder, extensions must be omitted.
 * @param {Function} [type] - Only asset of type will be loaded if this argument is supplied.
 * @param {Function} [progressCallback] - Callback invoked when progression change.
 * @param {Number} progressCallback.completedCount - The number of the items that are already completed.
 * @param {Number} progressCallback.totalCount - The total number of the items.
 * @param {Object} progressCallback.item - The latest item which flow out the pipeline.
 * @param {Function} [completeCallback] - A callback which is called when all assets have been loaded, or an error occurs.
 * @param {Error} completeCallback.error - If one of the asset failed, the complete callback is immediately called
 *                                         with the error. If all assets are loaded successfully, error will be null.
 * @param {Asset[]|Array} completeCallback.assets - An array of all loaded assets.
 *                                             If nothing to load, assets will be an empty array.
 * @param {String[]} completeCallback.urls - An array that lists all the URLs of loaded assets.
 *
 * @example
 *
 * // load the texture (resources/imgs/cocos.png) and the corresponding sprite frame
 * cc.loader.loadResDir('imgs/cocos', function (err, assets) {
 *     if (err) {
 *         cc.error(err);
 *         return;
 *     }
 *     var texture = assets[0];
 *     var spriteFrame = assets[1];
 * });
 *
 * // load all textures in "resources/imgs/"
 * cc.loader.loadResDir('imgs', cc.Texture2D, function (err, textures) {
 *     var texture1 = textures[0];
 *     var texture2 = textures[1];
 * });
 *
 * // load all JSONs in "resources/data/"
 * cc.loader.loadResDir('data', function (err, objects, urls) {
 *     var data = objects[0];
 *     var url = urls[0];
 * });
 * @typescript
 * loadResDir(url: string, type: typeof cc.Asset, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any[], urls: string[]) => void)|null): void
 * loadResDir(url: string, type: typeof cc.Asset, completeCallback: (error: Error, resource: any[], urls: string[]) => void): void
 * loadResDir(url: string, type: typeof cc.Asset): void
 * loadResDir(url: string, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any[], urls: string[]) => void)|null): void
 * loadResDir(url: string, completeCallback: (error: Error, resource: any[], urls: string[]) => void): void
 * loadResDir(url: string): void
 */


proto.loadResDir = function (url, type, mount, progressCallback, completeCallback) {
  if (arguments.length !== 5) {
    completeCallback = progressCallback;
    progressCallback = mount;
    mount = 'assets';
  }

  if (!assetTables[mount]) return;

  var args = this._parseLoadResArgs(type, progressCallback, completeCallback);

  type = args.type;
  progressCallback = args.onProgress;
  completeCallback = args.onComplete;
  var urls = [];
  var uuids = assetTables[mount].getUuidArray(url, type, urls);

  this._loadResUuids(uuids, progressCallback, completeCallback, urls);
};
/**
 * Get resource data by id. <br>
 * When you load resources with {{#crossLink "loader/load:method"}}{{/crossLink}} or {{#crossLink "loader/loadRes:method"}}{{/crossLink}},
 * the url will be the unique identity of the resource.
 * After loaded, you can acquire them by passing the url to this API.
 *
 * @method getRes
 * @param {String} url
 * @param {Function} [type] - Only asset of type will be returned if this argument is supplied.
 * @returns {*}
 */


proto.getRes = function (url, type) {
  var item = this._cache[url];

  if (!item) {
    var uuid = this._getResUuid(url, type, null, true);

    if (uuid) {
      var ref = this._getReferenceKey(uuid);

      item = this._cache[ref];
    } else {
      return null;
    }
  }

  if (item && item.alias) {
    item = item.alias;
  }

  return item && item.complete ? item.content : null;
};
/**
 * Get total resources count in loader.
 * @returns {Number}
 */


proto.getResCount = function () {
  return Object.keys(this._cache).length;
};
/**
 * !#en
 * Get all resource dependencies of the loaded asset in an array, including itself.
 * The owner parameter accept the following types: 1. The asset itself; 2. The resource url; 3. The asset's uuid.<br>
 * The returned array stores the dependencies with their uuids, after retrieve dependencies,
 * you can release them, access dependent assets by passing the uuid to {{#crossLink "loader/getRes:method"}}{{/crossLink}}, or other stuffs you want.<br>
 * For release all dependencies of an asset, please refer to {{#crossLink "loader/release:method"}}{{/crossLink}}
 * Here is some examples:
 * !#zh
 * 获取某个已经加载好的资源的所有依赖资源，包含它自身，并保存在数组中返回。owner 参数接收以下几种类型：1. 资源 asset 对象；2. 资源目录下的 url；3. 资源的 uuid。<br>
 * 返回的数组将仅保存依赖资源的 uuid，获取这些 uuid 后，你可以从 loader 释放这些资源；通过 {{#crossLink "loader/getRes:method"}}{{/crossLink}} 获取某个资源或者进行其他你需要的操作。<br>
 * 想要释放一个资源及其依赖资源，可以参考 {{#crossLink "loader/release:method"}}{{/crossLink}}。下面是一些示例代码：
 *
 * @example
 * // Release all dependencies of a loaded prefab
 * var deps = cc.loader.getDependsRecursively(prefab);
 * cc.loader.release(deps);
 * // Retrieve all dependent textures
 * var deps = cc.loader.getDependsRecursively('prefabs/sample');
 * var textures = [];
 * for (var i = 0; i < deps.length; ++i) {
 *     var item = cc.loader.getRes(deps[i]);
 *     if (item instanceof cc.Texture2D) {
 *         textures.push(item);
 *     }
 * }
 *
 * @method getDependsRecursively
 * @param {Asset|RawAsset|String} owner - The owner asset or the resource url or the asset's uuid
 * @returns {Array}
 */


proto.getDependsRecursively = function (owner) {
  if (owner) {
    var key = this._getReferenceKey(owner);

    var assets = AutoReleaseUtils.getDependsRecursively(key);
    assets.push(key);
    return assets;
  } else {
    return [];
  }
};
/**
 * !#en
 * Release the content of an asset or an array of assets by uuid.
 * Start from v1.3, this method will not only remove the cache of the asset in loader, but also clean up its content.
 * For example, if you release a texture, the texture asset and its gl texture data will be freed up.
 * In complexe project, you can use this function with {{#crossLink "loader/getDependsRecursively:method"}}{{/crossLink}} to free up memory in critical circumstances.
 * Notice, this method may cause the texture to be unusable, if there are still other nodes use the same texture, they may turn to black and report gl errors.
 * If you only want to remove the cache of an asset, please use {{#crossLink "pipeline/removeItem:method"}}{{/crossLink}}
 * !#zh
 * 通过 id（通常是资源 url）来释放一个资源或者一个资源数组。
 * 从 v1.3 开始，这个方法不仅会从 loader 中删除资源的缓存引用，还会清理它的资源内容。
 * 比如说，当你释放一个 texture 资源，这个 texture 和它的 gl 贴图数据都会被释放。
 * 在复杂项目中，我们建议你结合 {{#crossLink "loader/getDependsRecursively:method"}}{{/crossLink}} 来使用，便于在设备内存告急的情况下更快地释放不再需要的资源的内存。
 * 注意，这个函数可能会导致资源贴图或资源所依赖的贴图不可用，如果场景中存在节点仍然依赖同样的贴图，它们可能会变黑并报 GL 错误。
 * 如果你只想删除一个资源的缓存引用，请使用 {{#crossLink "pipeline/removeItem:method"}}{{/crossLink}}
 *
 * @example
 * // Release a texture which is no longer need
 * cc.loader.release(texture);
 * // Release all dependencies of a loaded prefab
 * var deps = cc.loader.getDependsRecursively('prefabs/sample');
 * cc.loader.release(deps);
 * // If there is no instance of this prefab in the scene, the prefab and its dependencies like textures, sprite frames, etc, will be freed up.
 * // If you have some other nodes share a texture in this prefab, you can skip it in two ways:
 * // 1. Forbid auto release a texture before release
 * cc.loader.setAutoRelease(texture2d, false);
 * // 2. Remove it from the dependencies array
 * var deps = cc.loader.getDependsRecursively('prefabs/sample');
 * var index = deps.indexOf(texture2d._uuid);
 * if (index !== -1)
 *     deps.splice(index, 1);
 * cc.loader.release(deps);
 *
 * @method release
 * @param {Asset|RawAsset|String|Array} asset
 */


proto.release = function (asset) {
  if (Array.isArray(asset)) {
    for (var i = 0; i < asset.length; i++) {
      var key = asset[i];
      this.release(key);
    }
  } else if (asset) {
    var id = this._getReferenceKey(asset);

    if (!CC_EDITOR && id && id in cc.AssetLibrary.getBuiltinDeps()) return;
    var item = this.getItem(id);

    if (item) {
      var removed = this.removeItem(id);
      asset = item.content;

      if (CC_DEBUG && removed) {
        this._releasedAssetChecker_DEBUG.setReleased(item, id);
      }
    }

    if (asset instanceof cc.Asset) {
      var nativeUrl = asset.nativeUrl;

      if (nativeUrl) {
        this.release(nativeUrl); // uncache loading item of native asset
      }

      asset.destroy();
    }
  }
};
/**
 * !#en Release the asset by its object. Refer to {{#crossLink "loader/release:method"}}{{/crossLink}} for detailed informations.
 * !#zh 通过资源对象自身来释放资源。详细信息请参考 {{#crossLink "loader/release:method"}}{{/crossLink}}
 *
 * @method releaseAsset
 * @param {Asset} asset
 */


proto.releaseAsset = function (asset) {
  var uuid = asset._uuid;

  if (uuid) {
    this.release(uuid);
  }
};
/**
 * !#en Release the asset loaded by {{#crossLink "loader/loadRes:method"}}{{/crossLink}}. Refer to {{#crossLink "loader/release:method"}}{{/crossLink}} for detailed informations.
 * !#zh 释放通过 {{#crossLink "loader/loadRes:method"}}{{/crossLink}} 加载的资源。详细信息请参考 {{#crossLink "loader/release:method"}}{{/crossLink}}
 *
 * @method releaseRes
 * @param {String} url
 * @param {Function} [type] - Only asset of type will be released if this argument is supplied.
 */


proto.releaseRes = function (url, type, mount) {
  var uuid = this._getResUuid(url, type, mount);

  if (uuid) {
    this.release(uuid);
  } else {
    cc.errorID(4914, url);
  }
};
/**
 * !#en Release the all assets loaded by {{#crossLink "loader/loadResDir:method"}}{{/crossLink}}. Refer to {{#crossLink "loader/release:method"}}{{/crossLink}} for detailed informations.
 * !#zh 释放通过 {{#crossLink "loader/loadResDir:method"}}{{/crossLink}} 加载的资源。详细信息请参考 {{#crossLink "loader/release:method"}}{{/crossLink}}
 *
 * @method releaseResDir
 * @param {String} url
 * @param {Function} [type] - Only asset of type will be released if this argument is supplied.
 */


proto.releaseResDir = function (url, type, mount) {
  mount = mount || 'assets';
  if (!assetTables[mount]) return;
  var uuids = assetTables[mount].getUuidArray(url, type);

  for (var i = 0; i < uuids.length; i++) {
    var uuid = uuids[i];
    this.release(uuid);
  }
};
/**
 * !#en Resource all assets. Refer to {{#crossLink "loader/release:method"}}{{/crossLink}} for detailed informations.
 * !#zh 释放所有资源。详细信息请参考 {{#crossLink "loader/release:method"}}{{/crossLink}}
 *
 * @method releaseAll
 */


proto.releaseAll = function () {
  for (var id in this._cache) {
    this.release(id);
  }
}; // AUTO RELEASE
// override


proto.removeItem = function (key) {
  var removed = Pipeline.prototype.removeItem.call(this, key);
  delete this._autoReleaseSetting[key];
  return removed;
};
/**
 * !#en
 * Indicates whether to release the asset when loading a new scene.<br>
 * By default, when loading a new scene, all assets in the previous scene will be released or preserved
 * according to whether the previous scene checked the "Auto Release Assets" option.
 * On the other hand, assets dynamically loaded by using `cc.loader.loadRes` or `cc.loader.loadResDir`
 * will not be affected by that option, remain not released by default.<br>
 * Use this API to change the default behavior on a single asset, to force preserve or release specified asset when scene switching.<br>
 * <br>
 * See: {{#crossLink "loader/setAutoReleaseRecursively:method"}}cc.loader.setAutoReleaseRecursively{{/crossLink}}, {{#crossLink "loader/isAutoRelease:method"}}cc.loader.isAutoRelease{{/crossLink}}
 * !#zh
 * 设置当场景切换时是否自动释放资源。<br>
 * 默认情况下，当加载新场景时，旧场景的资源根据旧场景是否勾选“Auto Release Assets”，将会被释放或者保留。
 * 而使用 `cc.loader.loadRes` 或 `cc.loader.loadResDir` 动态加载的资源，则不受场景设置的影响，默认不自动释放。<br>
 * 使用这个 API 可以在单个资源上改变这个默认行为，强制在切换场景时保留或者释放指定资源。<br>
 * <br>
 * 参考：{{#crossLink "loader/setAutoReleaseRecursively:method"}}cc.loader.setAutoReleaseRecursively{{/crossLink}}，{{#crossLink "loader/isAutoRelease:method"}}cc.loader.isAutoRelease{{/crossLink}}
 *
 * @example
 * // auto release the texture event if "Auto Release Assets" disabled in current scene
 * cc.loader.setAutoRelease(texture2d, true);
 * // don't release the texture even if "Auto Release Assets" enabled in current scene
 * cc.loader.setAutoRelease(texture2d, false);
 * // first parameter can be url
 * cc.loader.setAutoRelease(audioUrl, false);
 *
 * @method setAutoRelease
 * @param {Asset|String} assetOrUrlOrUuid - asset object or the raw asset's url or uuid
 * @param {Boolean} autoRelease - indicates whether should release automatically
 */


proto.setAutoRelease = function (assetOrUrlOrUuid, autoRelease) {
  var key = this._getReferenceKey(assetOrUrlOrUuid);

  if (key) {
    this._autoReleaseSetting[key] = !!autoRelease;
  } else if (CC_DEV) {
    cc.warnID(4902);
  }
};
/**
 * !#en
 * Indicates whether to release the asset and its referenced other assets when loading a new scene.<br>
 * By default, when loading a new scene, all assets in the previous scene will be released or preserved
 * according to whether the previous scene checked the "Auto Release Assets" option.
 * On the other hand, assets dynamically loaded by using `cc.loader.loadRes` or `cc.loader.loadResDir`
 * will not be affected by that option, remain not released by default.<br>
 * Use this API to change the default behavior on the specified asset and its recursively referenced assets, to force preserve or release specified asset when scene switching.<br>
 * <br>
 * See: {{#crossLink "loader/setAutoRelease:method"}}cc.loader.setAutoRelease{{/crossLink}}, {{#crossLink "loader/isAutoRelease:method"}}cc.loader.isAutoRelease{{/crossLink}}
 * !#zh
 * 设置当场景切换时是否自动释放资源及资源引用的其它资源。<br>
 * 默认情况下，当加载新场景时，旧场景的资源根据旧场景是否勾选“Auto Release Assets”，将会被释放或者保留。
 * 而使用 `cc.loader.loadRes` 或 `cc.loader.loadResDir` 动态加载的资源，则不受场景设置的影响，默认不自动释放。<br>
 * 使用这个 API 可以在指定资源及资源递归引用到的所有资源上改变这个默认行为，强制在切换场景时保留或者释放指定资源。<br>
 * <br>
 * 参考：{{#crossLink "loader/setAutoRelease:method"}}cc.loader.setAutoRelease{{/crossLink}}，{{#crossLink "loader/isAutoRelease:method"}}cc.loader.isAutoRelease{{/crossLink}}
 *
 * @example
 * // auto release the SpriteFrame and its Texture event if "Auto Release Assets" disabled in current scene
 * cc.loader.setAutoReleaseRecursively(spriteFrame, true);
 * // don't release the SpriteFrame and its Texture even if "Auto Release Assets" enabled in current scene
 * cc.loader.setAutoReleaseRecursively(spriteFrame, false);
 * // don't release the Prefab and all the referenced assets
 * cc.loader.setAutoReleaseRecursively(prefab, false);
 *
 * @method setAutoReleaseRecursively
 * @param {Asset|String} assetOrUrlOrUuid - asset object or the raw asset's url or uuid
 * @param {Boolean} autoRelease - indicates whether should release automatically
 */


proto.setAutoReleaseRecursively = function (assetOrUrlOrUuid, autoRelease) {
  autoRelease = !!autoRelease;

  var key = this._getReferenceKey(assetOrUrlOrUuid);

  if (key) {
    this._autoReleaseSetting[key] = autoRelease;
    var depends = AutoReleaseUtils.getDependsRecursively(key);

    for (var i = 0; i < depends.length; i++) {
      var depend = depends[i];
      this._autoReleaseSetting[depend] = autoRelease;
    }
  } else if (CC_DEV) {
    cc.warnID(4902);
  }
};
/**
 * !#en
 * Returns whether the asset is configured as auto released, despite how "Auto Release Assets" property is set on scene asset.<br>
 * <br>
 * See: {{#crossLink "loader/setAutoRelease:method"}}cc.loader.setAutoRelease{{/crossLink}}, {{#crossLink "loader/setAutoReleaseRecursively:method"}}cc.loader.setAutoReleaseRecursively{{/crossLink}}
 *
 * !#zh
 * 返回指定的资源是否有被设置为自动释放，不论场景的“Auto Release Assets”如何设置。<br>
 * <br>
 * 参考：{{#crossLink "loader/setAutoRelease:method"}}cc.loader.setAutoRelease{{/crossLink}}，{{#crossLink "loader/setAutoReleaseRecursively:method"}}cc.loader.setAutoReleaseRecursively{{/crossLink}}
 * @method isAutoRelease
 * @param {Asset|String} assetOrUrl - asset object or the raw asset's url
 * @returns {Boolean}
 */


proto.isAutoRelease = function (assetOrUrl) {
  var key = this._getReferenceKey(assetOrUrl);

  if (key) {
    return !!this._autoReleaseSetting[key];
  }

  return false;
};

cc.loader = new CCLoader();

if (CC_EDITOR) {
  cc.loader.refreshUrl = function (uuid, oldUrl, newUrl) {
    var item = this._cache[uuid];

    if (item) {
      item.url = newUrl;
    }

    item = this._cache[oldUrl];

    if (item) {
      item.id = newUrl;
      item.url = newUrl;
      this._cache[newUrl] = item;
      delete this._cache[oldUrl];
    }
  };
}

module.exports = cc.loader;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDTG9hZGVyLmpzIl0sIm5hbWVzIjpbImpzIiwicmVxdWlyZSIsIlBpcGVsaW5lIiwiTG9hZGluZ0l0ZW1zIiwiQXNzZXRMb2FkZXIiLCJEb3dubG9hZGVyIiwiTG9hZGVyIiwiQXNzZXRUYWJsZSIsImNhbGxJbk5leHRUaWNrIiwiQXV0b1JlbGVhc2VVdGlscyIsIlJlbGVhc2VkQXNzZXRDaGVja2VyIiwiQ0NfREVCVUciLCJhc3NldFRhYmxlcyIsIk9iamVjdCIsImNyZWF0ZSIsImFzc2V0cyIsImludGVybmFsIiwiZ2V0WE1MSHR0cFJlcXVlc3QiLCJ3aW5kb3ciLCJYTUxIdHRwUmVxdWVzdCIsIkFjdGl2ZVhPYmplY3QiLCJfaW5mbyIsInVybCIsInJhdyIsImdldFJlc1dpdGhVcmwiLCJyZXMiLCJpZCIsInJlc3VsdCIsImlzVXVpZCIsInV1aWQiLCJ0eXBlIiwiY2MiLCJBc3NldExpYnJhcnkiLCJfdXVpZEluU2V0dGluZ3MiLCJfZ2V0QXNzZXRJbmZvSW5SdW50aW1lIiwiaXNSYXdBc3NldCIsIl9zaGFyZWRSZXNvdXJjZXMiLCJfc2hhcmVkTGlzdCIsIkNDTG9hZGVyIiwiYXNzZXRMb2FkZXIiLCJkb3dubG9hZGVyIiwibG9hZGVyIiwiY2FsbCIsIm1kNVBpcGUiLCJvblByb2dyZXNzIiwiX2F1dG9SZWxlYXNlU2V0dGluZyIsImNyZWF0ZU1hcCIsIl9yZWxlYXNlZEFzc2V0Q2hlY2tlcl9ERUJVRyIsImV4dGVuZCIsInByb3RvIiwicHJvdG90eXBlIiwiaW5pdCIsImRpcmVjdG9yIiwic2VsZiIsIm9uIiwiRGlyZWN0b3IiLCJFVkVOVF9BRlRFUl9VUERBVEUiLCJjaGVja0NvdWxkUmVsZWFzZSIsIl9jYWNoZSIsImFkZERvd25sb2FkSGFuZGxlcnMiLCJleHRNYXAiLCJhZGRIYW5kbGVycyIsImFkZExvYWRIYW5kbGVycyIsImxvYWQiLCJyZXNvdXJjZXMiLCJwcm9ncmVzc0NhbGxiYWNrIiwiY29tcGxldGVDYWxsYmFjayIsIkNDX0RFViIsImVycm9yIiwidW5kZWZpbmVkIiwic2luZ2xlUmVzIiwiQXJyYXkiLCJsZW5ndGgiLCJpIiwicmVzb3VyY2UiLCJ3YXJuSUQiLCJpdGVtIiwicHVzaCIsInF1ZXVlIiwiZXJyb3JzIiwiaXRlbXMiLCJnZXRDb250ZW50IiwiQ0NfRURJVE9SIiwiY29tcGxldGUiLCJyZW1vdmVJdGVtIiwiZGVzdHJveSIsImluaXRRdWV1ZURlcHMiLCJhcHBlbmQiLCJmbG93SW5EZXBzIiwib3duZXIiLCJ1cmxMaXN0IiwiY2FsbGJhY2siLCJjb21wbGV0ZWRDb3VudCIsInRvdGFsQ291bnQiLCJfb3duZXJRdWV1ZSIsIl9jaGlsZE9uUHJvZ3Jlc3MiLCJkZXBzIiwib3duZXJRdWV1ZSIsImdldFF1ZXVlIiwiYWNjZXB0ZWQiLCJfYXNzZXRUYWJsZXMiLCJfZ2V0UmVzVXVpZCIsIm1vdW50IiwicXVpZXQiLCJhc3NldFRhYmxlIiwiaW5kZXgiLCJpbmRleE9mIiwic3Vic3RyIiwiZ2V0VXVpZCIsImV4dG5hbWUiLCJwYXRoIiwic2xpY2UiLCJfZ2V0UmVmZXJlbmNlS2V5IiwiYXNzZXRPclVybE9yVXVpZCIsImtleSIsIl91dWlkIiwiX3VybE5vdEZvdW5kIiwibm9ybWFsaXplIiwiaW5mbyIsImdldENsYXNzTmFtZSIsIkVycm9yIiwiX3BhcnNlTG9hZFJlc0FyZ3MiLCJvbkNvbXBsZXRlIiwiaXNWYWxpZFR5cGUiLCJpc0NoaWxkQ2xhc3NPZiIsIlJhd0Fzc2V0IiwibG9hZFJlcyIsImFyZ3VtZW50cyIsImFyZ3MiLCJlcnIiLCJhc3NldCIsInNldEF1dG9SZWxlYXNlUmVjdXJzaXZlbHkiLCJfbG9hZFJlc1V1aWRzIiwidXVpZHMiLCJ1cmxzIiwibWFwIiwiYXNzZXRSZXMiLCJ1cmxSZXMiLCJsb2FkUmVzQXJyYXkiLCJpc1R5cGVzQXJyYXkiLCJhc3NldFR5cGUiLCJsb2FkUmVzRGlyIiwiZ2V0VXVpZEFycmF5IiwiZ2V0UmVzIiwicmVmIiwiYWxpYXMiLCJjb250ZW50IiwiZ2V0UmVzQ291bnQiLCJrZXlzIiwiZ2V0RGVwZW5kc1JlY3Vyc2l2ZWx5IiwicmVsZWFzZSIsImlzQXJyYXkiLCJnZXRCdWlsdGluRGVwcyIsImdldEl0ZW0iLCJyZW1vdmVkIiwic2V0UmVsZWFzZWQiLCJBc3NldCIsIm5hdGl2ZVVybCIsInJlbGVhc2VBc3NldCIsInJlbGVhc2VSZXMiLCJlcnJvcklEIiwicmVsZWFzZVJlc0RpciIsInJlbGVhc2VBbGwiLCJzZXRBdXRvUmVsZWFzZSIsImF1dG9SZWxlYXNlIiwiZGVwZW5kcyIsImRlcGVuZCIsImlzQXV0b1JlbGVhc2UiLCJhc3NldE9yVXJsIiwicmVmcmVzaFVybCIsIm9sZFVybCIsIm5ld1VybCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFJQSxFQUFFLEdBQUdDLE9BQU8sQ0FBQyxnQkFBRCxDQUFoQjs7QUFDQSxJQUFJQyxRQUFRLEdBQUdELE9BQU8sQ0FBQyxZQUFELENBQXRCOztBQUNBLElBQUlFLFlBQVksR0FBR0YsT0FBTyxDQUFDLGlCQUFELENBQTFCOztBQUNBLElBQUlHLFdBQVcsR0FBR0gsT0FBTyxDQUFDLGdCQUFELENBQXpCOztBQUNBLElBQUlJLFVBQVUsR0FBR0osT0FBTyxDQUFDLGNBQUQsQ0FBeEI7O0FBQ0EsSUFBSUssTUFBTSxHQUFHTCxPQUFPLENBQUMsVUFBRCxDQUFwQjs7QUFDQSxJQUFJTSxVQUFVLEdBQUdOLE9BQU8sQ0FBQyxlQUFELENBQXhCOztBQUNBLElBQUlPLGNBQWMsR0FBR1AsT0FBTyxDQUFDLG1CQUFELENBQVAsQ0FBNkJPLGNBQWxEOztBQUNBLElBQUlDLGdCQUFnQixHQUFHUixPQUFPLENBQUMsc0JBQUQsQ0FBOUIsRUFDQTs7O0FBQ0EsSUFBSVMsb0JBQW9CLEdBQUdDLFFBQVEsSUFBSVYsT0FBTyxDQUFDLDBCQUFELENBQTlDOztBQUVBLElBQUlXLFdBQVcsR0FBR0MsTUFBTSxDQUFDQyxNQUFQLENBQWMsSUFBZCxDQUFsQjtB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RUFBRSxDQUFDVSxNQUFwQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxudmFyIGpzID0gcmVxdWlyZSgnLi4vcGxhdGZvcm0vanMnKTtcbnZhciBQaXBlbGluZSA9IHJlcXVpcmUoJy4vcGlwZWxpbmUnKTtcbnZhciBMb2FkaW5nSXRlbXMgPSByZXF1aXJlKCcuL2xvYWRpbmctaXRlbXMnKTtcbnZhciBBc3NldExvYWRlciA9IHJlcXVpcmUoJy4vYXNzZXQtbG9hZGVyJyk7XG52YXIgRG93bmxvYWRlciA9IHJlcXVpcmUoJy4vZG93bmxvYWRlcicpO1xudmFyIExvYWRlciA9IHJlcXVpcmUoJy4vbG9hZGVyJyk7XG52YXIgQXNzZXRUYWJsZSA9IHJlcXVpcmUoJy4vYXNzZXQtdGFibGUnKTtcbnZhciBjYWxsSW5OZXh0VGljayA9IHJlcXVpcmUoJy4uL3BsYXRmb3JtL3V0aWxzJykuY2FsbEluTmV4dFRpY2s7XG52YXIgQXV0b1JlbGVhc2VVdGlscyA9IHJlcXVpcmUoJy4vYXV0by1yZWxlYXNlLXV0aWxzJyk7XG4vLyB2YXIgcHVzaFRvTWFwID0gcmVxdWlyZSgnLi4vdXRpbHMvbWlzYycpLnB1c2hUb01hcDtcbnZhciBSZWxlYXNlZEFzc2V0Q2hlY2tlciA9IENDX0RFQlVHICYmIHJlcXVpcmUoJy4vcmVsZWFzZWQtYXNzZXQtY2hlY2tlcicpO1xuXG52YXIgYXNzZXRUYWJsZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuYXNzZXRUYWJsZXMuYXNzZXRzID0gbmV3IEFzc2V0VGFibGUoKTtcbmFzc2V0VGFibGVzLmludGVybmFsID0gbmV3IEFzc2V0VGFibGUoKTtcblxuZnVuY3Rpb24gZ2V0WE1MSHR0cFJlcXVlc3QgKCkge1xuICAgIHJldHVybiB3aW5kb3cuWE1MSHR0cFJlcXVlc3QgPyBuZXcgd2luZG93LlhNTEh0dHBSZXF1ZXN0KCkgOiBuZXcgQWN0aXZlWE9iamVjdCgnTVNYTUwyLlhNTEhUVFAnKTtcbn1cblxudmFyIF9pbmZvID0ge3VybDogbnVsbCwgcmF3OiBmYWxzZX07XG5cbi8vIENvbnZlcnQgYSByZXNvdXJjZXMgYnkgZmluZGluZyBpdHMgcmVhbCB1cmwgd2l0aCB1dWlkLCBvdGhlcndpc2Ugd2Ugd2lsbCB1c2UgdGhlIHV1aWQgb3IgcmF3IHVybCBhcyBpdHMgdXJsXG4vLyBTbyB3ZSBndXJhbnRlZSB0aGVyZSB3aWxsIGJlIHVybCBpbiByZXN1bHRcbmZ1bmN0aW9uIGdldFJlc1dpdGhVcmwgKHJlcykge1xuICAgIHZhciBpZCwgcmVzdWx0LCBpc1V1aWQ7XG4gICAgaWYgKHR5cGVvZiByZXMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJlc3VsdCA9IHJlcztcbiAgICAgICAgaWYgKHJlcy51cmwpIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZCA9IHJlcy51dWlkO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXN1bHQgPSB7fTtcbiAgICAgICAgaWQgPSByZXM7XG4gICAgfVxuICAgIGlzVXVpZCA9IHJlc3VsdC50eXBlID8gcmVzdWx0LnR5cGUgPT09ICd1dWlkJyA6IGNjLkFzc2V0TGlicmFyeS5fdXVpZEluU2V0dGluZ3MoaWQpO1xuICAgIGNjLkFzc2V0TGlicmFyeS5fZ2V0QXNzZXRJbmZvSW5SdW50aW1lKGlkLCBfaW5mbyk7XG4gICAgcmVzdWx0LnVybCA9ICFpc1V1aWQgPyBpZCA6IF9pbmZvLnVybDtcbiAgICBpZiAoX2luZm8udXJsICYmIHJlc3VsdC50eXBlID09PSAndXVpZCcgJiYgX2luZm8ucmF3KSB7XG4gICAgICAgIHJlc3VsdC50eXBlID0gbnVsbDtcbiAgICAgICAgcmVzdWx0LmlzUmF3QXNzZXQgPSB0cnVlO1xuICAgIH1cbiAgICBlbHNlIGlmICghaXNVdWlkKSB7XG4gICAgICAgIHJlc3VsdC5pc1Jhd0Fzc2V0ID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxudmFyIF9zaGFyZWRSZXNvdXJjZXMgPSBbXTtcbnZhciBfc2hhcmVkTGlzdCA9IFtdO1xuXG4vKipcbiAqIExvYWRlciBmb3IgcmVzb3VyY2UgbG9hZGluZyBwcm9jZXNzLiBJdCdzIGEgc2luZ2xldG9uIG9iamVjdC5cbiAqIEBjbGFzcyBsb2FkZXJcbiAqIEBleHRlbmRzIFBpcGVsaW5lXG4gKiBAc3RhdGljXG4gKi9cbmZ1bmN0aW9uIENDTG9hZGVyICgpIHtcbiAgICB2YXIgYXNzZXRMb2FkZXIgPSBuZXcgQXNzZXRMb2FkZXIoKTtcbiAgICB2YXIgZG93bmxvYWRlciA9IG5ldyBEb3dubG9hZGVyKCk7XG4gICAgdmFyIGxvYWRlciA9IG5ldyBMb2FkZXIoKTtcblxuICAgIFBpcGVsaW5lLmNhbGwodGhpcywgW1xuICAgICAgICBhc3NldExvYWRlcixcbiAgICAgICAgZG93bmxvYWRlcixcbiAgICAgICAgbG9hZGVyXG4gICAgXSk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYXNzZXQgbG9hZGVyIGluIGNjLmxvYWRlcidzIHBpcGVsaW5lLCBpdCdzIGJ5IGRlZmF1bHQgdGhlIGZpcnN0IHBpcGUuXG4gICAgICogSXQncyB1c2VkIHRvIGlkZW50aWZ5IGFuIGFzc2V0J3MgdHlwZSwgYW5kIGRldGVybWluZSBob3cgdG8gZG93bmxvYWQgaXQuXG4gICAgICogQHByb3BlcnR5IGFzc2V0TG9hZGVyXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmFzc2V0TG9hZGVyID0gYXNzZXRMb2FkZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbWQ1IHBpcGUgaW4gY2MubG9hZGVyJ3MgcGlwZWxpbmUsIGl0IGNvdWxkIGJlIGFic2VudCBpZiB0aGUgcHJvamVjdCBpc24ndCBidWlsZCB3aXRoIG1kNSBvcHRpb24uXG4gICAgICogSXQncyB1c2VkIHRvIG1vZGlmeSB0aGUgdXJsIHRvIHRoZSByZWFsIGRvd25sb2FkYWJsZSB1cmwgd2l0aCBtZDUgc3VmZml4LlxuICAgICAqIEBwcm9wZXJ0eSBtZDVQaXBlXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLm1kNVBpcGUgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRvd25sb2FkZXIgaW4gY2MubG9hZGVyJ3MgcGlwZWxpbmUsIGl0J3MgYnkgZGVmYXVsdCB0aGUgc2Vjb25kIHBpcGUuXG4gICAgICogSXQncyB1c2VkIHRvIGRvd25sb2FkIGZpbGVzIHdpdGggc2V2ZXJhbCBoYW5kbGVyczogcHVyZSB0ZXh0LCBpbWFnZSwgc2NyaXB0LCBhdWRpbywgZm9udCwgdXVpZC5cbiAgICAgKiBZb3UgY2FuIGFkZCB5b3VyIG93biBkb3dubG9hZCBmdW5jdGlvbiB3aXRoIGFkZERvd25sb2FkSGFuZGxlcnNcbiAgICAgKiBAcHJvcGVydHkgZG93bmxvYWRlclxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5kb3dubG9hZGVyID0gZG93bmxvYWRlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBsb2FkZXIgaW4gY2MubG9hZGVyJ3MgcGlwZWxpbmUsIGl0J3MgYnkgZGVmYXVsdCB0aGUgdGhpcmQgcGlwZS5cbiAgICAgKiBJdCdzIHVzZWQgdG8gcGFyc2UgZG93bmxvYWRlZCBjb250ZW50IHdpdGggc2V2ZXJhbCBoYW5kbGVyczogSlNPTiwgaW1hZ2UsIHBsaXN0LCBmbnQsIHV1aWQuXG4gICAgICogWW91IGNhbiBhZGQgeW91ciBvd24gZG93bmxvYWQgZnVuY3Rpb24gd2l0aCBhZGRMb2FkSGFuZGxlcnNcbiAgICAgKiBAcHJvcGVydHkgbG9hZGVyXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmxvYWRlciA9IGxvYWRlcjtcblxuICAgIHRoaXMub25Qcm9ncmVzcyA9IG51bGw7XG5cbiAgICAvLyBhc3NldHMgdG8gcmVsZWFzZSBhdXRvbWF0aWNhbGx5XG4gICAgdGhpcy5fYXV0b1JlbGVhc2VTZXR0aW5nID0ganMuY3JlYXRlTWFwKHRydWUpO1xuXG4gICAgaWYgKENDX0RFQlVHKSB7XG4gICAgICAgIHRoaXMuX3JlbGVhc2VkQXNzZXRDaGVja2VyX0RFQlVHID0gbmV3IFJlbGVhc2VkQXNzZXRDaGVja2VyKCk7XG4gICAgfVxufVxuanMuZXh0ZW5kKENDTG9hZGVyLCBQaXBlbGluZSk7XG52YXIgcHJvdG8gPSBDQ0xvYWRlci5wcm90b3R5cGU7XG5cbnByb3RvLmluaXQgPSBmdW5jdGlvbiAoZGlyZWN0b3IpIHtcbiAgICBpZiAoQ0NfREVCVUcpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBkaXJlY3Rvci5vbihjYy5EaXJlY3Rvci5FVkVOVF9BRlRFUl9VUERBVEUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNlbGYuX3JlbGVhc2VkQXNzZXRDaGVja2VyX0RFQlVHLmNoZWNrQ291bGRSZWxlYXNlKHNlbGYuX2NhY2hlKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuLyoqXG4gKiBHZXRzIGEgbmV3IFhNTEh0dHBSZXF1ZXN0IGluc3RhbmNlLlxuICogQG1ldGhvZCBnZXRYTUxIdHRwUmVxdWVzdFxuICogQHJldHVybnMge1hNTEh0dHBSZXF1ZXN0fVxuICovXG5wcm90by5nZXRYTUxIdHRwUmVxdWVzdCA9IGdldFhNTEh0dHBSZXF1ZXN0O1xuXG4vKipcbiAqIEFkZCBjdXN0b20gc3VwcG9ydGVkIHR5cGVzIGhhbmRsZXIgb3IgbW9kaWZ5IGV4aXN0aW5nIHR5cGUgaGFuZGxlciBmb3IgZG93bmxvYWQgcHJvY2Vzcy5cbiAqIEBleGFtcGxlXG4gKiAgY2MubG9hZGVyLmFkZERvd25sb2FkSGFuZGxlcnMoe1xuICogICAgICAvLyBUaGlzIHdpbGwgbWF0Y2ggYWxsIHVybCB3aXRoIGAuc2NlbmVgIGV4dGVuc2lvbiBvciBhbGwgdXJsIHdpdGggYHNjZW5lYCB0eXBlXG4gKiAgICAgICdzY2VuZScgOiBmdW5jdGlvbiAodXJsLCBjYWxsYmFjaykge31cbiAqICB9KTtcbiAqIEBtZXRob2QgYWRkRG93bmxvYWRIYW5kbGVyc1xuICogQHBhcmFtIHtPYmplY3R9IGV4dE1hcCBDdXN0b20gc3VwcG9ydGVkIHR5cGVzIHdpdGggY29ycmVzcG9uZGVkIGhhbmRsZXJcbiAqL1xucHJvdG8uYWRkRG93bmxvYWRIYW5kbGVycyA9IGZ1bmN0aW9uIChleHRNYXApIHtcbiAgICB0aGlzLmRvd25sb2FkZXIuYWRkSGFuZGxlcnMoZXh0TWFwKTtcbn07XG5cbi8qKlxuICogQWRkIGN1c3RvbSBzdXBwb3J0ZWQgdHlwZXMgaGFuZGxlciBvciBtb2RpZnkgZXhpc3RpbmcgdHlwZSBoYW5kbGVyIGZvciBsb2FkIHByb2Nlc3MuXG4gKiBAZXhhbXBsZVxuICogIGNjLmxvYWRlci5hZGRMb2FkSGFuZGxlcnMoe1xuICogICAgICAvLyBUaGlzIHdpbGwgbWF0Y2ggYWxsIHVybCB3aXRoIGAuc2NlbmVgIGV4dGVuc2lvbiBvciBhbGwgdXJsIHdpdGggYHNjZW5lYCB0eXBlXG4gKiAgICAgICdzY2VuZScgOiBmdW5jdGlvbiAodXJsLCBjYWxsYmFjaykge31cbiAqICB9KTtcbiAqIEBtZXRob2QgYWRkTG9hZEhhbmRsZXJzXG4gKiBAcGFyYW0ge09iamVjdH0gZXh0TWFwIEN1c3RvbSBzdXBwb3J0ZWQgdHlwZXMgd2l0aCBjb3JyZXNwb25kZWQgaGFuZGxlclxuICovXG5wcm90by5hZGRMb2FkSGFuZGxlcnMgPSBmdW5jdGlvbiAoZXh0TWFwKSB7XG4gICAgdGhpcy5sb2FkZXIuYWRkSGFuZGxlcnMoZXh0TWFwKTtcbn07XG5cbi8qKlxuICogTG9hZCByZXNvdXJjZXMgd2l0aCBhIHByb2dyZXNzaW9uIGNhbGxiYWNrIGFuZCBhIGNvbXBsZXRlIGNhbGxiYWNrLlxuICogVGhlIHByb2dyZXNzaW9uIGNhbGxiYWNrIGlzIHRoZSBzYW1lIGFzIFBpcGVsaW5lJ3Mge3sjY3Jvc3NMaW5rIFwiTG9hZGluZ0l0ZW1zL29uUHJvZ3Jlc3M6bWV0aG9kXCJ9fW9uUHJvZ3Jlc3N7ey9jcm9zc0xpbmt9fVxuICogVGhlIGNvbXBsZXRlIGNhbGxiYWNrIGlzIGFsbW9zdCB0aGUgc2FtZSBhcyBQaXBlbGluZSdzIHt7I2Nyb3NzTGluayBcIkxvYWRpbmdJdGVtcy9vbkNvbXBsZXRlOm1ldGhvZFwifX1vbkNvbXBsZXRle3svY3Jvc3NMaW5rfX1cbiAqIFRoZSBvbmx5IGRpZmZlcmVuY2UgaXMgd2hlbiB1c2VyIHBhc3MgYSBzaW5nbGUgdXJsIGFzIHJlc291cmNlcywgdGhlIGNvbXBsZXRlIGNhbGxiYWNrIHdpbGwgc2V0IGl0cyByZXN1bHQgZGlyZWN0bHkgYXMgdGhlIHNlY29uZCBwYXJhbWV0ZXIuXG4gKlxuICogQGV4YW1wbGVcbiAqIGNjLmxvYWRlci5sb2FkKCdhLnBuZycsIGZ1bmN0aW9uIChlcnIsIHRleCkge1xuICogICAgIGNjLmxvZygnUmVzdWx0IHNob3VsZCBiZSBhIHRleHR1cmU6ICcgKyAodGV4IGluc3RhbmNlb2YgY2MuVGV4dHVyZTJEKSk7XG4gKiB9KTtcbiAqXG4gKiBjYy5sb2FkZXIubG9hZCgnaHR0cDovL2V4YW1wbGUuY29tL2EucG5nJywgZnVuY3Rpb24gKGVyciwgdGV4KSB7XG4gKiAgICAgY2MubG9nKCdTaG91bGQgbG9hZCBhIHRleHR1cmUgZnJvbSBleHRlcm5hbCB1cmw6ICcgKyAodGV4IGluc3RhbmNlb2YgY2MuVGV4dHVyZTJEKSk7XG4gKiB9KTtcbiAqXG4gKiBjYy5sb2FkZXIubG9hZCh7dXJsOiAnaHR0cDovL2V4YW1wbGUuY29tL2dldEltYWdlUkVTVD9maWxlPWEucG5nJywgdHlwZTogJ3BuZyd9LCBmdW5jdGlvbiAoZXJyLCB0ZXgpIHtcbiAqICAgICBjYy5sb2coJ1Nob3VsZCBsb2FkIGEgdGV4dHVyZSBmcm9tIFJFU1RmdWwgQVBJIGJ5IHNwZWNpZnkgdGhlIHR5cGU6ICcgKyAodGV4IGluc3RhbmNlb2YgY2MuVGV4dHVyZTJEKSk7XG4gKiB9KTtcbiAqXG4gKiBjYy5sb2FkZXIubG9hZChbJ2EucG5nJywgJ2IuanNvbiddLCBmdW5jdGlvbiAoZXJyb3JzLCByZXN1bHRzKSB7XG4gKiAgICAgaWYgKGVycm9ycykge1xuICogICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVycm9ycy5sZW5ndGg7IGkrKykge1xuICogICAgICAgICAgICAgY2MubG9nKCdFcnJvciB1cmwgWycgKyBlcnJvcnNbaV0gKyAnXTogJyArIHJlc3VsdHMuZ2V0RXJyb3IoZXJyb3JzW2ldKSk7XG4gKiAgICAgICAgIH1cbiAqICAgICB9XG4gKiAgICAgdmFyIGFUZXggPSByZXN1bHRzLmdldENvbnRlbnQoJ2EucG5nJyk7XG4gKiAgICAgdmFyIGJKc29uT2JqID0gcmVzdWx0cy5nZXRDb250ZW50KCdiLmpzb24nKTtcbiAqIH0pO1xuICpcbiAqIEBtZXRob2QgbG9hZFxuICogQHBhcmFtIHtTdHJpbmd8U3RyaW5nW118T2JqZWN0fSByZXNvdXJjZXMgLSBVcmwgbGlzdCBpbiBhbiBhcnJheVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3Byb2dyZXNzQ2FsbGJhY2tdIC0gQ2FsbGJhY2sgaW52b2tlZCB3aGVuIHByb2dyZXNzaW9uIGNoYW5nZVxuICogQHBhcmFtIHtOdW1iZXJ9IHByb2dyZXNzQ2FsbGJhY2suY29tcGxldGVkQ291bnQgLSBUaGUgbnVtYmVyIG9mIHRoZSBpdGVtcyB0aGF0IGFyZSBhbHJlYWR5IGNvbXBsZXRlZFxuICogQHBhcmFtIHtOdW1iZXJ9IHByb2dyZXNzQ2FsbGJhY2sudG90YWxDb3VudCAtIFRoZSB0b3RhbCBudW1iZXIgb2YgdGhlIGl0ZW1zXG4gKiBAcGFyYW0ge09iamVjdH0gcHJvZ3Jlc3NDYWxsYmFjay5pdGVtIC0gVGhlIGxhdGVzdCBpdGVtIHdoaWNoIGZsb3cgb3V0IHRoZSBwaXBlbGluZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbXBsZXRlQ2FsbGJhY2tdIC0gQ2FsbGJhY2sgaW52b2tlZCB3aGVuIGFsbCByZXNvdXJjZXMgbG9hZGVkXG4gKiBAdHlwZXNjcmlwdFxuICogbG9hZChyZXNvdXJjZXM6IHN0cmluZ3xzdHJpbmdbXXx7dXVpZD86IHN0cmluZywgdXJsPzogc3RyaW5nLCB0eXBlPzogc3RyaW5nfSwgY29tcGxldGVDYWxsYmFjaz86IEZ1bmN0aW9uKTogdm9pZFxuICogbG9hZChyZXNvdXJjZXM6IHN0cmluZ3xzdHJpbmdbXXx7dXVpZD86IHN0cmluZywgdXJsPzogc3RyaW5nLCB0eXBlPzogc3RyaW5nfSwgcHJvZ3Jlc3NDYWxsYmFjazogKGNvbXBsZXRlZENvdW50OiBudW1iZXIsIHRvdGFsQ291bnQ6IG51bWJlciwgaXRlbTogYW55KSA9PiB2b2lkLCBjb21wbGV0ZUNhbGxiYWNrOiBGdW5jdGlvbnxudWxsKTogdm9pZFxuICovXG5wcm90by5sb2FkID0gZnVuY3Rpb24ocmVzb3VyY2VzLCBwcm9ncmVzc0NhbGxiYWNrLCBjb21wbGV0ZUNhbGxiYWNrKSB7XG4gICAgaWYgKENDX0RFViAmJiAhcmVzb3VyY2VzKSB7XG4gICAgICAgIHJldHVybiBjYy5lcnJvcihcIltjYy5sb2FkZXIubG9hZF0gcmVzb3VyY2VzIG11c3QgYmUgbm9uLW5pbC5cIik7XG4gICAgfVxuXG4gICAgaWYgKGNvbXBsZXRlQ2FsbGJhY2sgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb21wbGV0ZUNhbGxiYWNrID0gcHJvZ3Jlc3NDYWxsYmFjaztcbiAgICAgICAgcHJvZ3Jlc3NDYWxsYmFjayA9IHRoaXMub25Qcm9ncmVzcyB8fCBudWxsO1xuICAgIH1cblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgc2luZ2xlUmVzID0gZmFsc2U7XG4gICAgdmFyIHJlcztcbiAgICBpZiAoIShyZXNvdXJjZXMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgaWYgKHJlc291cmNlcykge1xuICAgICAgICAgICAgc2luZ2xlUmVzID0gdHJ1ZTtcbiAgICAgICAgICAgIHJlc291cmNlcyA9IFtyZXNvdXJjZXNdO1xuICAgICAgICB9IGVsc2UgeyBcbiAgICAgICAgICAgIHJlc291cmNlcyA9IFtdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3NoYXJlZFJlc291cmNlcy5sZW5ndGggPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzb3VyY2VzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciByZXNvdXJjZSA9IHJlc291cmNlc1tpXTtcbiAgICAgICAgLy8gQmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICAgICAgICBpZiAocmVzb3VyY2UgJiYgcmVzb3VyY2UuaWQpIHtcbiAgICAgICAgICAgIGNjLndhcm5JRCg0OTIwLCByZXNvdXJjZS5pZCk7XG4gICAgICAgICAgICBpZiAoIXJlc291cmNlLnV1aWQgJiYgIXJlc291cmNlLnVybCkge1xuICAgICAgICAgICAgICAgIHJlc291cmNlLnVybCA9IHJlc291cmNlLmlkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlcyA9IGdldFJlc1dpdGhVcmwocmVzb3VyY2UpO1xuICAgICAgICBpZiAoIXJlcy51cmwgJiYgIXJlcy51dWlkKVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIHZhciBpdGVtID0gdGhpcy5fY2FjaGVbcmVzLnVybF07XG4gICAgICAgIF9zaGFyZWRSZXNvdXJjZXMucHVzaChpdGVtIHx8IHJlcyk7XG4gICAgfVxuXG4gICAgdmFyIHF1ZXVlID0gTG9hZGluZ0l0ZW1zLmNyZWF0ZSh0aGlzLCBwcm9ncmVzc0NhbGxiYWNrLCBmdW5jdGlvbiAoZXJyb3JzLCBpdGVtcykge1xuICAgICAgICBjYWxsSW5OZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoY29tcGxldGVDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGlmIChzaW5nbGVSZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlkID0gcmVzLnVybDtcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGVDYWxsYmFjay5jYWxsKHNlbGYsIGVycm9ycywgaXRlbXMuZ2V0Q29udGVudChpZCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGVDYWxsYmFjay5jYWxsKHNlbGYsIGVycm9ycywgaXRlbXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb21wbGV0ZUNhbGxiYWNrID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGlkIGluIHNlbGYuX2NhY2hlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLl9jYWNoZVtpZF0uY29tcGxldGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucmVtb3ZlSXRlbShpZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpdGVtcy5kZXN0cm95KCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIExvYWRpbmdJdGVtcy5pbml0UXVldWVEZXBzKHF1ZXVlKTtcbiAgICBxdWV1ZS5hcHBlbmQoX3NoYXJlZFJlc291cmNlcyk7XG4gICAgX3NoYXJlZFJlc291cmNlcy5sZW5ndGggPSAwO1xufTtcblxucHJvdG8uZmxvd0luRGVwcyA9IGZ1bmN0aW9uIChvd25lciwgdXJsTGlzdCwgY2FsbGJhY2spIHtcbiAgICBfc2hhcmVkTGlzdC5sZW5ndGggPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdXJsTGlzdC5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIgcmVzID0gZ2V0UmVzV2l0aFVybCh1cmxMaXN0W2ldKTtcbiAgICAgICAgaWYgKCFyZXMudXJsICYmICEgcmVzLnV1aWQpXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLl9jYWNoZVtyZXMudXJsXTtcbiAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgIF9zaGFyZWRMaXN0LnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBfc2hhcmVkTGlzdC5wdXNoKHJlcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcXVldWUgPSBMb2FkaW5nSXRlbXMuY3JlYXRlKHRoaXMsIG93bmVyID8gZnVuY3Rpb24gKGNvbXBsZXRlZENvdW50LCB0b3RhbENvdW50LCBpdGVtKSB7XG4gICAgICAgIGlmICh0aGlzLl9vd25lclF1ZXVlICYmIHRoaXMuX293bmVyUXVldWUub25Qcm9ncmVzcykge1xuICAgICAgICAgICAgdGhpcy5fb3duZXJRdWV1ZS5fY2hpbGRPblByb2dyZXNzKGl0ZW0pO1xuICAgICAgICB9XG4gICAgfSA6IG51bGwsIGZ1bmN0aW9uIChlcnJvcnMsIGl0ZW1zKSB7XG4gICAgICAgIGNhbGxiYWNrKGVycm9ycywgaXRlbXMpO1xuICAgICAgICAvLyBDbGVhciBkZXBzIGJlY2F1c2UgaXQncyBhbHJlYWR5IGRvbmVcbiAgICAgICAgLy8gRWFjaCBpdGVtIHdpbGwgb25seSBmbG93SW5EZXBzIG9uY2UsIHNvIGl0J3Mgc3RpbGwgc2FmZSBoZXJlXG4gICAgICAgIG93bmVyICYmIG93bmVyLmRlcHMgJiYgKG93bmVyLmRlcHMubGVuZ3RoID0gMCk7XG4gICAgICAgIGl0ZW1zLmRlc3Ryb3koKTtcbiAgICB9KTtcbiAgICBpZiAob3duZXIpIHtcbiAgICAgICAgdmFyIG93bmVyUXVldWUgPSBMb2FkaW5nSXRlbXMuZ2V0UXVldWUob3duZXIpO1xuICAgICAgICAvLyBTZXQgdGhlIHJvb3Qgb3duZXJRdWV1ZSwgaWYgbm8gb3duZXJRdWV1ZSBkZWZpbmVkIGluIG93bmVyUXVldWUsIGl0J3MgdGhlIHJvb3RcbiAgICAgICAgcXVldWUuX293bmVyUXVldWUgPSBvd25lclF1ZXVlLl9vd25lclF1ZXVlIHx8IG93bmVyUXVldWU7XG4gICAgfVxuICAgIHZhciBhY2NlcHRlZCA9IHF1ZXVlLmFwcGVuZChfc2hhcmVkTGlzdCwgb3duZXIpO1xuICAgIF9zaGFyZWRMaXN0Lmxlbmd0aCA9IDA7XG4gICAgcmV0dXJuIGFjY2VwdGVkO1xufTtcblxucHJvdG8uX2Fzc2V0VGFibGVzID0gYXNzZXRUYWJsZXM7XG5wcm90by5fZ2V0UmVzVXVpZCA9IGZ1bmN0aW9uICh1cmwsIHR5cGUsIG1vdW50LCBxdWlldCkge1xuICAgIG1vdW50ID0gbW91bnQgfHwgJ2Fzc2V0cyc7XG5cbiAgICB2YXIgYXNzZXRUYWJsZSA9IGFzc2V0VGFibGVzW21vdW50XTtcbiAgICBpZiAoIXVybCB8fCAhYXNzZXRUYWJsZSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgXG4gICAgLy8gSWdub3JlIHBhcmFtZXRlclxuICAgIHZhciBpbmRleCA9IHVybC5pbmRleE9mKCc/Jyk7XG4gICAgaWYgKGluZGV4ICE9PSAtMSlcbiAgICAgICAgdXJsID0gdXJsLnN1YnN0cigwLCBpbmRleCk7XG4gICAgdmFyIHV1aWQgPSBhc3NldFRhYmxlLmdldFV1aWQodXJsLCB0eXBlKTtcbiAgICBpZiAoICF1dWlkICkge1xuICAgICAgICB2YXIgZXh0bmFtZSA9IGNjLnBhdGguZXh0bmFtZSh1cmwpO1xuICAgICAgICBpZiAoZXh0bmFtZSkge1xuICAgICAgICAgICAgLy8gc3RyaXAgZXh0bmFtZVxuICAgICAgICAgICAgdXJsID0gdXJsLnNsaWNlKDAsIC0gZXh0bmFtZS5sZW5ndGgpO1xuICAgICAgICAgICAgdXVpZCA9IGFzc2V0VGFibGUuZ2V0VXVpZCh1cmwsIHR5cGUpO1xuICAgICAgICAgICAgaWYgKHV1aWQgJiYgIXF1aWV0KSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybklEKDQ5MDEsIHVybCwgZXh0bmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHV1aWQ7XG59O1xuXG4vLyBGaW5kIHRoZSBhc3NldCdzIHJlZmVyZW5jZSBpZCBpbiBsb2FkZXIsIGFzc2V0IGNvdWxkIGJlIGFzc2V0IG9iamVjdCwgYXNzZXQgdXVpZCBvciBhc3NldCB1cmxcbnByb3RvLl9nZXRSZWZlcmVuY2VLZXkgPSBmdW5jdGlvbiAoYXNzZXRPclVybE9yVXVpZCkge1xuICAgIHZhciBrZXk7XG4gICAgaWYgKHR5cGVvZiBhc3NldE9yVXJsT3JVdWlkID09PSAnb2JqZWN0Jykge1xuICAgICAgICBrZXkgPSBhc3NldE9yVXJsT3JVdWlkLl91dWlkIHx8IG51bGw7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBhc3NldE9yVXJsT3JVdWlkID09PSAnc3RyaW5nJykge1xuICAgICAgICBrZXkgPSB0aGlzLl9nZXRSZXNVdWlkKGFzc2V0T3JVcmxPclV1aWQsIG51bGwsIG51bGwsIHRydWUpIHx8IGFzc2V0T3JVcmxPclV1aWQ7XG4gICAgfVxuICAgIGlmICgha2V5KSB7XG4gICAgICAgIGNjLndhcm5JRCg0ODAwLCBhc3NldE9yVXJsT3JVdWlkKTtcbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG4gICAgY2MuQXNzZXRMaWJyYXJ5Ll9nZXRBc3NldEluZm9JblJ1bnRpbWUoa2V5LCBfaW5mbyk7XG4gICAgcmV0dXJuIHRoaXMuX2NhY2hlW19pbmZvLnVybF0gPyBfaW5mby51cmwgOiBrZXk7XG59O1xuXG5wcm90by5fdXJsTm90Rm91bmQgPSBmdW5jdGlvbiAodXJsLCB0eXBlLCBjb21wbGV0ZUNhbGxiYWNrKSB7XG4gICAgY2FsbEluTmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICB1cmwgPSBjYy51cmwubm9ybWFsaXplKHVybCk7XG4gICAgICAgIHZhciBpbmZvID0gYCR7dHlwZSA/IGpzLmdldENsYXNzTmFtZSh0eXBlKSA6ICdBc3NldCd9IGluIFwicmVzb3VyY2VzLyR7dXJsfVwiIGRvZXMgbm90IGV4aXN0LmA7XG4gICAgICAgIGlmIChjb21wbGV0ZUNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjb21wbGV0ZUNhbGxiYWNrKG5ldyBFcnJvcihpbmZvKSwgW10pO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFt0eXBlXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29uUHJvZ3Jlc3NdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvbkNvbXBsZXRlXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBhcmd1bWVudHNcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gYXJndW1lbnRzLnR5cGVcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gYXJndW1lbnRzLm9uUHJvZ3Jlc3NcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gYXJndW1lbnRzLm9uQ29tcGxldGVcbiAqL1xucHJvdG8uX3BhcnNlTG9hZFJlc0FyZ3MgPSBmdW5jdGlvbiAodHlwZSwgb25Qcm9ncmVzcywgb25Db21wbGV0ZSkge1xuICAgIGlmIChvbkNvbXBsZXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFyIGlzVmFsaWRUeXBlID0gKHR5cGUgaW5zdGFuY2VvZiBBcnJheSkgfHwganMuaXNDaGlsZENsYXNzT2YodHlwZSwgY2MuUmF3QXNzZXQpO1xuICAgICAgICBpZiAob25Qcm9ncmVzcykge1xuICAgICAgICAgICAgb25Db21wbGV0ZSA9IG9uUHJvZ3Jlc3M7XG4gICAgICAgICAgICBpZiAoaXNWYWxpZFR5cGUpIHtcbiAgICAgICAgICAgICAgICBvblByb2dyZXNzID0gdGhpcy5vblByb2dyZXNzIHx8IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAob25Qcm9ncmVzcyA9PT0gdW5kZWZpbmVkICYmICFpc1ZhbGlkVHlwZSkge1xuICAgICAgICAgICAgb25Db21wbGV0ZSA9IHR5cGU7XG4gICAgICAgICAgICBvblByb2dyZXNzID0gdGhpcy5vblByb2dyZXNzIHx8IG51bGw7XG4gICAgICAgICAgICB0eXBlID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAob25Qcm9ncmVzcyAhPT0gdW5kZWZpbmVkICYmICFpc1ZhbGlkVHlwZSkge1xuICAgICAgICAgICAgb25Qcm9ncmVzcyA9IHR5cGU7XG4gICAgICAgICAgICB0eXBlID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICBvblByb2dyZXNzOiBvblByb2dyZXNzLFxuICAgICAgICBvbkNvbXBsZXRlOiBvbkNvbXBsZXRlLFxuICAgIH07XG59O1xuXG4vKipcbiAqIExvYWQgcmVzb3VyY2VzIGZyb20gdGhlIFwicmVzb3VyY2VzXCIgZm9sZGVyIGluc2lkZSB0aGUgXCJhc3NldHNcIiBmb2xkZXIgb2YgeW91ciBwcm9qZWN0Ljxicj5cbiAqIDxicj5cbiAqIE5vdGU6IEFsbCBhc3NldCBVUkxzIGluIENyZWF0b3IgdXNlIGZvcndhcmQgc2xhc2hlcywgVVJMcyB1c2luZyBiYWNrc2xhc2hlcyB3aWxsIG5vdCB3b3JrLlxuICpcbiAqIEBtZXRob2QgbG9hZFJlc1xuICogQHBhcmFtIHtTdHJpbmd9IHVybCAtIFVybCBvZiB0aGUgdGFyZ2V0IHJlc291cmNlLlxuICogICAgICAgICAgICAgICAgICAgICAgIFRoZSB1cmwgaXMgcmVsYXRpdmUgdG8gdGhlIFwicmVzb3VyY2VzXCIgZm9sZGVyLCBleHRlbnNpb25zIG11c3QgYmUgb21pdHRlZC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFt0eXBlXSAtIE9ubHkgYXNzZXQgb2YgdHlwZSB3aWxsIGJlIGxvYWRlZCBpZiB0aGlzIGFyZ3VtZW50IGlzIHN1cHBsaWVkLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3Byb2dyZXNzQ2FsbGJhY2tdIC0gQ2FsbGJhY2sgaW52b2tlZCB3aGVuIHByb2dyZXNzaW9uIGNoYW5nZS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBwcm9ncmVzc0NhbGxiYWNrLmNvbXBsZXRlZENvdW50IC0gVGhlIG51bWJlciBvZiB0aGUgaXRlbXMgdGhhdCBhcmUgYWxyZWFkeSBjb21wbGV0ZWQuXG4gKiBAcGFyYW0ge051bWJlcn0gcHJvZ3Jlc3NDYWxsYmFjay50b3RhbENvdW50IC0gVGhlIHRvdGFsIG51bWJlciBvZiB0aGUgaXRlbXMuXG4gKiBAcGFyYW0ge09iamVjdH0gcHJvZ3Jlc3NDYWxsYmFjay5pdGVtIC0gVGhlIGxhdGVzdCBpdGVtIHdoaWNoIGZsb3cgb3V0IHRoZSBwaXBlbGluZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjb21wbGV0ZUNhbGxiYWNrXSAtIENhbGxiYWNrIGludm9rZWQgd2hlbiB0aGUgcmVzb3VyY2UgbG9hZGVkLlxuICogQHBhcmFtIHtFcnJvcn0gY29tcGxldGVDYWxsYmFjay5lcnJvciAtIFRoZSBlcnJvciBpbmZvIG9yIG51bGwgaWYgbG9hZGVkIHN1Y2Nlc3NmdWxseS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb21wbGV0ZUNhbGxiYWNrLnJlc291cmNlIC0gVGhlIGxvYWRlZCByZXNvdXJjZSBpZiBpdCBjYW4gYmUgZm91bmQgb3RoZXJ3aXNlIHJldHVybnMgbnVsbC5cbiAqXG4gKiBAZXhhbXBsZVxuICpcbiAqIC8vIGxvYWQgdGhlIHByZWZhYiAocHJvamVjdC9hc3NldHMvcmVzb3VyY2VzL21pc2MvY2hhcmFjdGVyL2NvY29zKSBmcm9tIHJlc291cmNlcyBmb2xkZXJcbiAqIGNjLmxvYWRlci5sb2FkUmVzKCdtaXNjL2NoYXJhY3Rlci9jb2NvcycsIGZ1bmN0aW9uIChlcnIsIHByZWZhYikge1xuICogICAgIGlmIChlcnIpIHtcbiAqICAgICAgICAgY2MuZXJyb3IoZXJyLm1lc3NhZ2UgfHwgZXJyKTtcbiAqICAgICAgICAgcmV0dXJuO1xuICogICAgIH1cbiAqICAgICBjYy5sb2coJ1Jlc3VsdCBzaG91bGQgYmUgYSBwcmVmYWI6ICcgKyAocHJlZmFiIGluc3RhbmNlb2YgY2MuUHJlZmFiKSk7XG4gKiB9KTtcbiAqXG4gKiAvLyBsb2FkIHRoZSBzcHJpdGUgZnJhbWUgb2YgKHByb2plY3QvYXNzZXRzL3Jlc291cmNlcy9pbWdzL2NvY29zLnBuZykgZnJvbSByZXNvdXJjZXMgZm9sZGVyXG4gKiBjYy5sb2FkZXIubG9hZFJlcygnaW1ncy9jb2NvcycsIGNjLlNwcml0ZUZyYW1lLCBmdW5jdGlvbiAoZXJyLCBzcHJpdGVGcmFtZSkge1xuICogICAgIGlmIChlcnIpIHtcbiAqICAgICAgICAgY2MuZXJyb3IoZXJyLm1lc3NhZ2UgfHwgZXJyKTtcbiAqICAgICAgICAgcmV0dXJuO1xuICogICAgIH1cbiAqICAgICBjYy5sb2coJ1Jlc3VsdCBzaG91bGQgYmUgYSBzcHJpdGUgZnJhbWU6ICcgKyAoc3ByaXRlRnJhbWUgaW5zdGFuY2VvZiBjYy5TcHJpdGVGcmFtZSkpO1xuICogfSk7XG4gKiBAdHlwZXNjcmlwdFxuICogbG9hZFJlcyh1cmw6IHN0cmluZywgdHlwZTogdHlwZW9mIGNjLkFzc2V0LCBwcm9ncmVzc0NhbGxiYWNrOiAoY29tcGxldGVkQ291bnQ6IG51bWJlciwgdG90YWxDb3VudDogbnVtYmVyLCBpdGVtOiBhbnkpID0+IHZvaWQsIGNvbXBsZXRlQ2FsbGJhY2s6ICgoZXJyb3I6IEVycm9yLCByZXNvdXJjZTogYW55KSA9PiB2b2lkKXxudWxsKTogdm9pZFxuICogbG9hZFJlcyh1cmw6IHN0cmluZywgdHlwZTogdHlwZW9mIGNjLkFzc2V0LCBjb21wbGV0ZUNhbGxiYWNrOiAoZXJyb3I6IEVycm9yLCByZXNvdXJjZTogYW55KSA9PiB2b2lkKTogdm9pZFxuICogbG9hZFJlcyh1cmw6IHN0cmluZywgdHlwZTogdHlwZW9mIGNjLkFzc2V0KTogdm9pZFxuICogbG9hZFJlcyh1cmw6IHN0cmluZywgcHJvZ3Jlc3NDYWxsYmFjazogKGNvbXBsZXRlZENvdW50OiBudW1iZXIsIHRvdGFsQ291bnQ6IG51bWJlciwgaXRlbTogYW55KSA9PiB2b2lkLCBjb21wbGV0ZUNhbGxiYWNrOiAoKGVycm9yOiBFcnJvciwgcmVzb3VyY2U6IGFueSkgPT4gdm9pZCl8bnVsbCk6IHZvaWRcbiAqIGxvYWRSZXModXJsOiBzdHJpbmcsIGNvbXBsZXRlQ2FsbGJhY2s6IChlcnJvcjogRXJyb3IsIHJlc291cmNlOiBhbnkpID0+IHZvaWQpOiB2b2lkXG4gKiBsb2FkUmVzKHVybDogc3RyaW5nKTogdm9pZFxuICovXG5wcm90by5sb2FkUmVzID0gZnVuY3Rpb24gKHVybCwgdHlwZSwgbW91bnQsIHByb2dyZXNzQ2FsbGJhY2ssIGNvbXBsZXRlQ2FsbGJhY2spIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gNSkge1xuICAgICAgICBjb21wbGV0ZUNhbGxiYWNrID0gcHJvZ3Jlc3NDYWxsYmFjaztcbiAgICAgICAgcHJvZ3Jlc3NDYWxsYmFjayA9IG1vdW50O1xuICAgICAgICBtb3VudCA9ICdhc3NldHMnO1xuICAgIH1cblxuICAgIHZhciBhcmdzID0gdGhpcy5fcGFyc2VMb2FkUmVzQXJncyh0eXBlLCBwcm9ncmVzc0NhbGxiYWNrLCBjb21wbGV0ZUNhbGxiYWNrKTtcbiAgICB0eXBlID0gYXJncy50eXBlO1xuICAgIHByb2dyZXNzQ2FsbGJhY2sgPSBhcmdzLm9uUHJvZ3Jlc3M7XG4gICAgY29tcGxldGVDYWxsYmFjayA9IGFyZ3Mub25Db21wbGV0ZTtcblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgdXVpZCA9IHNlbGYuX2dldFJlc1V1aWQodXJsLCB0eXBlLCBtb3VudCk7XG4gICAgaWYgKHV1aWQpIHtcbiAgICAgICAgdGhpcy5sb2FkKFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHR5cGU6ICd1dWlkJyxcbiAgICAgICAgICAgICAgICB1dWlkOiB1dWlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcHJvZ3Jlc3NDYWxsYmFjayxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChlcnIsIGFzc2V0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGFzc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNob3VsZCBub3QgcmVsZWFzZSB0aGVzZSBhc3NldHMsIGV2ZW4gaWYgdGhleSBhcmUgc3RhdGljIHJlZmVyZW5jZWQgaW4gdGhlIHNjZW5lLlxuICAgICAgICAgICAgICAgICAgICBzZWxmLnNldEF1dG9SZWxlYXNlUmVjdXJzaXZlbHkodXVpZCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoY29tcGxldGVDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZUNhbGxiYWNrKGVyciwgYXNzZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHNlbGYuX3VybE5vdEZvdW5kKHVybCwgdHlwZSwgY29tcGxldGVDYWxsYmFjayk7XG4gICAgfVxufTtcblxucHJvdG8uX2xvYWRSZXNVdWlkcyA9IGZ1bmN0aW9uICh1dWlkcywgcHJvZ3Jlc3NDYWxsYmFjaywgY29tcGxldGVDYWxsYmFjaywgdXJscykge1xuICAgIGlmICh1dWlkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHJlcyA9IHV1aWRzLm1hcChmdW5jdGlvbiAodXVpZCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAndXVpZCcsXG4gICAgICAgICAgICAgICAgdXVpZDogdXVpZFxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5sb2FkKHJlcywgcHJvZ3Jlc3NDYWxsYmFjaywgZnVuY3Rpb24gKGVycm9ycywgaXRlbXMpIHtcbiAgICAgICAgICAgIGlmIChjb21wbGV0ZUNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFzc2V0UmVzID0gW107XG4gICAgICAgICAgICAgICAgdmFyIHVybFJlcyA9IHVybHMgJiYgW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHV1aWQgPSByZXNbaV0udXVpZDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gdGhpcy5fZ2V0UmVmZXJlbmNlS2V5KHV1aWQpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGl0ZW1zLmdldENvbnRlbnQoaWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2hvdWxkIG5vdCByZWxlYXNlIHRoZXNlIGFzc2V0cywgZXZlbiBpZiB0aGV5IGFyZSBzdGF0aWMgcmVmZXJlbmNlZCBpbiB0aGUgc2NlbmUuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNldEF1dG9SZWxlYXNlUmVjdXJzaXZlbHkodXVpZCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXRSZXMucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1cmxSZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmxSZXMucHVzaCh1cmxzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodXJscykge1xuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZUNhbGxiYWNrKGVycm9ycywgYXNzZXRSZXMsIHVybFJlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZUNhbGxiYWNrKGVycm9ycywgYXNzZXRSZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAoY29tcGxldGVDYWxsYmFjaykge1xuICAgICAgICAgICAgY2FsbEluTmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICh1cmxzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlQ2FsbGJhY2sobnVsbCwgW10sIFtdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlQ2FsbGJhY2sobnVsbCwgW10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIHt7I2Nyb3NzTGluayBcImxvYWRlci9sb2FkUmVzOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fSBleGNlcHQgdGhhdCBpdCBhY2NlcHRzIGFycmF5IG9mIHVybC5cbiAqXG4gKiBAbWV0aG9kIGxvYWRSZXNBcnJheVxuICogQHBhcmFtIHtTdHJpbmdbXX0gdXJscyAtIEFycmF5IG9mIFVSTHMgb2YgdGhlIHRhcmdldCByZXNvdXJjZS5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgdXJsIGlzIHJlbGF0aXZlIHRvIHRoZSBcInJlc291cmNlc1wiIGZvbGRlciwgZXh0ZW5zaW9ucyBtdXN0IGJlIG9taXR0ZWQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbdHlwZV0gLSBPbmx5IGFzc2V0IG9mIHR5cGUgd2lsbCBiZSBsb2FkZWQgaWYgdGhpcyBhcmd1bWVudCBpcyBzdXBwbGllZC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtwcm9ncmVzc0NhbGxiYWNrXSAtIENhbGxiYWNrIGludm9rZWQgd2hlbiBwcm9ncmVzc2lvbiBjaGFuZ2UuXG4gKiBAcGFyYW0ge051bWJlcn0gcHJvZ3Jlc3NDYWxsYmFjay5jb21wbGV0ZWRDb3VudCAtIFRoZSBudW1iZXIgb2YgdGhlIGl0ZW1zIHRoYXQgYXJlIGFscmVhZHkgY29tcGxldGVkLlxuICogQHBhcmFtIHtOdW1iZXJ9IHByb2dyZXNzQ2FsbGJhY2sudG90YWxDb3VudCAtIFRoZSB0b3RhbCBudW1iZXIgb2YgdGhlIGl0ZW1zLlxuICogQHBhcmFtIHtPYmplY3R9IHByb2dyZXNzQ2FsbGJhY2suaXRlbSAtIFRoZSBsYXRlc3QgaXRlbSB3aGljaCBmbG93IG91dCB0aGUgcGlwZWxpbmUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY29tcGxldGVDYWxsYmFja10gLSBBIGNhbGxiYWNrIHdoaWNoIGlzIGNhbGxlZCB3aGVuIGFsbCBhc3NldHMgaGF2ZSBiZWVuIGxvYWRlZCwgb3IgYW4gZXJyb3Igb2NjdXJzLlxuICogQHBhcmFtIHtFcnJvcn0gY29tcGxldGVDYWxsYmFjay5lcnJvciAtIElmIG9uZSBvZiB0aGUgYXNzZXQgZmFpbGVkLCB0aGUgY29tcGxldGUgY2FsbGJhY2sgaXMgaW1tZWRpYXRlbHkgY2FsbGVkXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2l0aCB0aGUgZXJyb3IuIElmIGFsbCBhc3NldHMgYXJlIGxvYWRlZCBzdWNjZXNzZnVsbHksIGVycm9yIHdpbGwgYmUgbnVsbC5cbiAqIEBwYXJhbSB7QXNzZXRbXXxBcnJheX0gY29tcGxldGVDYWxsYmFjay5hc3NldHMgLSBBbiBhcnJheSBvZiBhbGwgbG9hZGVkIGFzc2V0cy5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBJZiBub3RoaW5nIHRvIGxvYWQsIGFzc2V0cyB3aWxsIGJlIGFuIGVtcHR5IGFycmF5LlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBsb2FkIHRoZSBTcHJpdGVGcmFtZXMgZnJvbSByZXNvdXJjZXMgZm9sZGVyXG4gKiB2YXIgc3ByaXRlRnJhbWVzO1xuICogdmFyIHVybHMgPSBbJ21pc2MvY2hhcmFjdGVycy9jaGFyYWN0ZXJfMDEnLCAnbWlzYy93ZWFwb25zL3dlYXBvbnNfMDEnXTtcbiAqIGNjLmxvYWRlci5sb2FkUmVzQXJyYXkodXJscywgY2MuU3ByaXRlRnJhbWUsIGZ1bmN0aW9uIChlcnIsIGFzc2V0cykge1xuICogICAgIGlmIChlcnIpIHtcbiAqICAgICAgICAgY2MuZXJyb3IoZXJyKTtcbiAqICAgICAgICAgcmV0dXJuO1xuICogICAgIH1cbiAqICAgICBzcHJpdGVGcmFtZXMgPSBhc3NldHM7XG4gKiAgICAgLy8gLi4uXG4gKiB9KTtcbiAqIEB0eXBlc2NyaXB0XG4gKiBsb2FkUmVzQXJyYXkodXJsOiBzdHJpbmdbXSwgdHlwZTogdHlwZW9mIGNjLkFzc2V0LCBwcm9ncmVzc0NhbGxiYWNrOiAoY29tcGxldGVkQ291bnQ6IG51bWJlciwgdG90YWxDb3VudDogbnVtYmVyLCBpdGVtOiBhbnkpID0+IHZvaWQsIGNvbXBsZXRlQ2FsbGJhY2s6ICgoZXJyb3I6IEVycm9yLCByZXNvdXJjZTogYW55W10pID0+IHZvaWQpfG51bGwpOiB2b2lkXG4gKiBsb2FkUmVzQXJyYXkodXJsOiBzdHJpbmdbXSwgdHlwZTogdHlwZW9mIGNjLkFzc2V0LCBjb21wbGV0ZUNhbGxiYWNrOiAoZXJyb3I6IEVycm9yLCByZXNvdXJjZTogYW55W10pID0+IHZvaWQpOiB2b2lkXG4gKiBsb2FkUmVzQXJyYXkodXJsOiBzdHJpbmdbXSwgdHlwZTogdHlwZW9mIGNjLkFzc2V0KTogdm9pZFxuICogbG9hZFJlc0FycmF5KHVybDogc3RyaW5nW10sIHByb2dyZXNzQ2FsbGJhY2s6IChjb21wbGV0ZWRDb3VudDogbnVtYmVyLCB0b3RhbENvdW50OiBudW1iZXIsIGl0ZW06IGFueSkgPT4gdm9pZCwgY29tcGxldGVDYWxsYmFjazogKChlcnJvcjogRXJyb3IsIHJlc291cmNlOiBhbnlbXSkgPT4gdm9pZCl8bnVsbCk6IHZvaWRcbiAqIGxvYWRSZXNBcnJheSh1cmw6IHN0cmluZ1tdLCBjb21wbGV0ZUNhbGxiYWNrOiAoZXJyb3I6IEVycm9yLCByZXNvdXJjZTogYW55W10pID0+IHZvaWQpOiB2b2lkXG4gKiBsb2FkUmVzQXJyYXkodXJsOiBzdHJpbmdbXSk6IHZvaWRcbiAqIGxvYWRSZXNBcnJheSh1cmw6IHN0cmluZ1tdLCB0eXBlOiB0eXBlb2YgY2MuQXNzZXRbXSk6IHZvaWRcbiAqL1xucHJvdG8ubG9hZFJlc0FycmF5ID0gZnVuY3Rpb24gKHVybHMsIHR5cGUsIG1vdW50LCBwcm9ncmVzc0NhbGxiYWNrLCBjb21wbGV0ZUNhbGxiYWNrKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDUpIHtcbiAgICAgICAgY29tcGxldGVDYWxsYmFjayA9IHByb2dyZXNzQ2FsbGJhY2s7XG4gICAgICAgIHByb2dyZXNzQ2FsbGJhY2sgPSBtb3VudDtcbiAgICAgICAgbW91bnQgPSAnYXNzZXRzJztcbiAgICB9XG5cbiAgICB2YXIgYXJncyA9IHRoaXMuX3BhcnNlTG9hZFJlc0FyZ3ModHlwZSwgcHJvZ3Jlc3NDYWxsYmFjaywgY29tcGxldGVDYWxsYmFjayk7XG4gICAgdHlwZSA9IGFyZ3MudHlwZTtcbiAgICBwcm9ncmVzc0NhbGxiYWNrID0gYXJncy5vblByb2dyZXNzO1xuICAgIGNvbXBsZXRlQ2FsbGJhY2sgPSBhcmdzLm9uQ29tcGxldGU7XG5cbiAgICB2YXIgdXVpZHMgPSBbXTtcbiAgICB2YXIgaXNUeXBlc0FycmF5ID0gdHlwZSBpbnN0YW5jZW9mIEFycmF5O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdXJscy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgdXJsID0gdXJsc1tpXTtcbiAgICAgICAgdmFyIGFzc2V0VHlwZSA9IGlzVHlwZXNBcnJheSA/IHR5cGVbaV0gOiB0eXBlO1xuICAgICAgICB2YXIgdXVpZCA9IHRoaXMuX2dldFJlc1V1aWQodXJsLCBhc3NldFR5cGUsIG1vdW50KTtcbiAgICAgICAgaWYgKHV1aWQpIHtcbiAgICAgICAgICAgIHV1aWRzLnB1c2godXVpZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl91cmxOb3RGb3VuZCh1cmwsIGFzc2V0VHlwZSwgY29tcGxldGVDYWxsYmFjayk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5fbG9hZFJlc1V1aWRzKHV1aWRzLCBwcm9ncmVzc0NhbGxiYWNrLCBjb21wbGV0ZUNhbGxiYWNrKTtcbn07XG5cbi8qKlxuICogTG9hZCBhbGwgYXNzZXRzIGluIGEgZm9sZGVyIGluc2lkZSB0aGUgXCJhc3NldHMvcmVzb3VyY2VzXCIgZm9sZGVyIG9mIHlvdXIgcHJvamVjdC48YnI+XG4gKiA8YnI+XG4gKiBOb3RlOiBBbGwgYXNzZXQgVVJMcyBpbiBDcmVhdG9yIHVzZSBmb3J3YXJkIHNsYXNoZXMsIFVSTHMgdXNpbmcgYmFja3NsYXNoZXMgd2lsbCBub3Qgd29yay5cbiAqXG4gKiBAbWV0aG9kIGxvYWRSZXNEaXJcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgLSBVcmwgb2YgdGhlIHRhcmdldCBmb2xkZXIuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgVGhlIHVybCBpcyByZWxhdGl2ZSB0byB0aGUgXCJyZXNvdXJjZXNcIiBmb2xkZXIsIGV4dGVuc2lvbnMgbXVzdCBiZSBvbWl0dGVkLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3R5cGVdIC0gT25seSBhc3NldCBvZiB0eXBlIHdpbGwgYmUgbG9hZGVkIGlmIHRoaXMgYXJndW1lbnQgaXMgc3VwcGxpZWQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcHJvZ3Jlc3NDYWxsYmFja10gLSBDYWxsYmFjayBpbnZva2VkIHdoZW4gcHJvZ3Jlc3Npb24gY2hhbmdlLlxuICogQHBhcmFtIHtOdW1iZXJ9IHByb2dyZXNzQ2FsbGJhY2suY29tcGxldGVkQ291bnQgLSBUaGUgbnVtYmVyIG9mIHRoZSBpdGVtcyB0aGF0IGFyZSBhbHJlYWR5IGNvbXBsZXRlZC5cbiAqIEBwYXJhbSB7TnVtYmVyfSBwcm9ncmVzc0NhbGxiYWNrLnRvdGFsQ291bnQgLSBUaGUgdG90YWwgbnVtYmVyIG9mIHRoZSBpdGVtcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm9ncmVzc0NhbGxiYWNrLml0ZW0gLSBUaGUgbGF0ZXN0IGl0ZW0gd2hpY2ggZmxvdyBvdXQgdGhlIHBpcGVsaW5lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbXBsZXRlQ2FsbGJhY2tdIC0gQSBjYWxsYmFjayB3aGljaCBpcyBjYWxsZWQgd2hlbiBhbGwgYXNzZXRzIGhhdmUgYmVlbiBsb2FkZWQsIG9yIGFuIGVycm9yIG9jY3Vycy5cbiAqIEBwYXJhbSB7RXJyb3J9IGNvbXBsZXRlQ2FsbGJhY2suZXJyb3IgLSBJZiBvbmUgb2YgdGhlIGFzc2V0IGZhaWxlZCwgdGhlIGNvbXBsZXRlIGNhbGxiYWNrIGlzIGltbWVkaWF0ZWx5IGNhbGxlZFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpdGggdGhlIGVycm9yLiBJZiBhbGwgYXNzZXRzIGFyZSBsb2FkZWQgc3VjY2Vzc2Z1bGx5LCBlcnJvciB3aWxsIGJlIG51bGwuXG4gKiBAcGFyYW0ge0Fzc2V0W118QXJyYXl9IGNvbXBsZXRlQ2FsbGJhY2suYXNzZXRzIC0gQW4gYXJyYXkgb2YgYWxsIGxvYWRlZCBhc3NldHMuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIElmIG5vdGhpbmcgdG8gbG9hZCwgYXNzZXRzIHdpbGwgYmUgYW4gZW1wdHkgYXJyYXkuXG4gKiBAcGFyYW0ge1N0cmluZ1tdfSBjb21wbGV0ZUNhbGxiYWNrLnVybHMgLSBBbiBhcnJheSB0aGF0IGxpc3RzIGFsbCB0aGUgVVJMcyBvZiBsb2FkZWQgYXNzZXRzLlxuICpcbiAqIEBleGFtcGxlXG4gKlxuICogLy8gbG9hZCB0aGUgdGV4dHVyZSAocmVzb3VyY2VzL2ltZ3MvY29jb3MucG5nKSBhbmQgdGhlIGNvcnJlc3BvbmRpbmcgc3ByaXRlIGZyYW1lXG4gKiBjYy5sb2FkZXIubG9hZFJlc0RpcignaW1ncy9jb2NvcycsIGZ1bmN0aW9uIChlcnIsIGFzc2V0cykge1xuICogICAgIGlmIChlcnIpIHtcbiAqICAgICAgICAgY2MuZXJyb3IoZXJyKTtcbiAqICAgICAgICAgcmV0dXJuO1xuICogICAgIH1cbiAqICAgICB2YXIgdGV4dHVyZSA9IGFzc2V0c1swXTtcbiAqICAgICB2YXIgc3ByaXRlRnJhbWUgPSBhc3NldHNbMV07XG4gKiB9KTtcbiAqXG4gKiAvLyBsb2FkIGFsbCB0ZXh0dXJlcyBpbiBcInJlc291cmNlcy9pbWdzL1wiXG4gKiBjYy5sb2FkZXIubG9hZFJlc0RpcignaW1ncycsIGNjLlRleHR1cmUyRCwgZnVuY3Rpb24gKGVyciwgdGV4dHVyZXMpIHtcbiAqICAgICB2YXIgdGV4dHVyZTEgPSB0ZXh0dXJlc1swXTtcbiAqICAgICB2YXIgdGV4dHVyZTIgPSB0ZXh0dXJlc1sxXTtcbiAqIH0pO1xuICpcbiAqIC8vIGxvYWQgYWxsIEpTT05zIGluIFwicmVzb3VyY2VzL2RhdGEvXCJcbiAqIGNjLmxvYWRlci5sb2FkUmVzRGlyKCdkYXRhJywgZnVuY3Rpb24gKGVyciwgb2JqZWN0cywgdXJscykge1xuICogICAgIHZhciBkYXRhID0gb2JqZWN0c1swXTtcbiAqICAgICB2YXIgdXJsID0gdXJsc1swXTtcbiAqIH0pO1xuICogQHR5cGVzY3JpcHRcbiAqIGxvYWRSZXNEaXIodXJsOiBzdHJpbmcsIHR5cGU6IHR5cGVvZiBjYy5Bc3NldCwgcHJvZ3Jlc3NDYWxsYmFjazogKGNvbXBsZXRlZENvdW50OiBudW1iZXIsIHRvdGFsQ291bnQ6IG51bWJlciwgaXRlbTogYW55KSA9PiB2b2lkLCBjb21wbGV0ZUNhbGxiYWNrOiAoKGVycm9yOiBFcnJvciwgcmVzb3VyY2U6IGFueVtdLCB1cmxzOiBzdHJpbmdbXSkgPT4gdm9pZCl8bnVsbCk6IHZvaWRcbiAqIGxvYWRSZXNEaXIodXJsOiBzdHJpbmcsIHR5cGU6IHR5cGVvZiBjYy5Bc3NldCwgY29tcGxldGVDYWxsYmFjazogKGVycm9yOiBFcnJvciwgcmVzb3VyY2U6IGFueVtdLCB1cmxzOiBzdHJpbmdbXSkgPT4gdm9pZCk6IHZvaWRcbiAqIGxvYWRSZXNEaXIodXJsOiBzdHJpbmcsIHR5cGU6IHR5cGVvZiBjYy5Bc3NldCk6IHZvaWRcbiAqIGxvYWRSZXNEaXIodXJsOiBzdHJpbmcsIHByb2dyZXNzQ2FsbGJhY2s6IChjb21wbGV0ZWRDb3VudDogbnVtYmVyLCB0b3RhbENvdW50OiBudW1iZXIsIGl0ZW06IGFueSkgPT4gdm9pZCwgY29tcGxldGVDYWxsYmFjazogKChlcnJvcjogRXJyb3IsIHJlc291cmNlOiBhbnlbXSwgdXJsczogc3RyaW5nW10pID0+IHZvaWQpfG51bGwpOiB2b2lkXG4gKiBsb2FkUmVzRGlyKHVybDogc3RyaW5nLCBjb21wbGV0ZUNhbGxiYWNrOiAoZXJyb3I6IEVycm9yLCByZXNvdXJjZTogYW55W10sIHVybHM6IHN0cmluZ1tdKSA9PiB2b2lkKTogdm9pZFxuICogbG9hZFJlc0Rpcih1cmw6IHN0cmluZyk6IHZvaWRcbiAqL1xucHJvdG8ubG9hZFJlc0RpciA9IGZ1bmN0aW9uICh1cmwsIHR5cGUsIG1vdW50LCBwcm9ncmVzc0NhbGxiYWNrLCBjb21wbGV0ZUNhbGxiYWNrKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDUpIHtcbiAgICAgICAgY29tcGxldGVDYWxsYmFjayA9IHByb2dyZXNzQ2FsbGJhY2s7XG4gICAgICAgIHByb2dyZXNzQ2FsbGJhY2sgPSBtb3VudDtcbiAgICAgICAgbW91bnQgPSAnYXNzZXRzJztcbiAgICB9XG4gICAgXG4gICAgaWYgKCFhc3NldFRhYmxlc1ttb3VudF0pIHJldHVybjsgXG5cbiAgICB2YXIgYXJncyA9IHRoaXMuX3BhcnNlTG9hZFJlc0FyZ3ModHlwZSwgcHJvZ3Jlc3NDYWxsYmFjaywgY29tcGxldGVDYWxsYmFjayk7XG4gICAgXG4gICAgdHlwZSA9IGFyZ3MudHlwZTtcbiAgICBwcm9ncmVzc0NhbGxiYWNrID0gYXJncy5vblByb2dyZXNzO1xuICAgIGNvbXBsZXRlQ2FsbGJhY2sgPSBhcmdzLm9uQ29tcGxldGU7XG5cbiAgICB2YXIgdXJscyA9IFtdO1xuICAgIHZhciB1dWlkcyA9IGFzc2V0VGFibGVzW21vdW50XS5nZXRVdWlkQXJyYXkodXJsLCB0eXBlLCB1cmxzKTtcbiAgICB0aGlzLl9sb2FkUmVzVXVpZHModXVpZHMsIHByb2dyZXNzQ2FsbGJhY2ssIGNvbXBsZXRlQ2FsbGJhY2ssIHVybHMpO1xufTtcblxuLyoqXG4gKiBHZXQgcmVzb3VyY2UgZGF0YSBieSBpZC4gPGJyPlxuICogV2hlbiB5b3UgbG9hZCByZXNvdXJjZXMgd2l0aCB7eyNjcm9zc0xpbmsgXCJsb2FkZXIvbG9hZDptZXRob2RcIn19e3svY3Jvc3NMaW5rfX0gb3Ige3sjY3Jvc3NMaW5rIFwibG9hZGVyL2xvYWRSZXM6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319LFxuICogdGhlIHVybCB3aWxsIGJlIHRoZSB1bmlxdWUgaWRlbnRpdHkgb2YgdGhlIHJlc291cmNlLlxuICogQWZ0ZXIgbG9hZGVkLCB5b3UgY2FuIGFjcXVpcmUgdGhlbSBieSBwYXNzaW5nIHRoZSB1cmwgdG8gdGhpcyBBUEkuXG4gKlxuICogQG1ldGhvZCBnZXRSZXNcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFt0eXBlXSAtIE9ubHkgYXNzZXQgb2YgdHlwZSB3aWxsIGJlIHJldHVybmVkIGlmIHRoaXMgYXJndW1lbnQgaXMgc3VwcGxpZWQuXG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xucHJvdG8uZ2V0UmVzID0gZnVuY3Rpb24gKHVybCwgdHlwZSkge1xuICAgIHZhciBpdGVtID0gdGhpcy5fY2FjaGVbdXJsXTtcbiAgICBpZiAoIWl0ZW0pIHtcbiAgICAgICAgdmFyIHV1aWQgPSB0aGlzLl9nZXRSZXNVdWlkKHVybCwgdHlwZSwgbnVsbCwgdHJ1ZSk7XG4gICAgICAgIGlmICh1dWlkKSB7XG4gICAgICAgICAgICB2YXIgcmVmID0gdGhpcy5fZ2V0UmVmZXJlbmNlS2V5KHV1aWQpO1xuICAgICAgICAgICAgaXRlbSA9IHRoaXMuX2NhY2hlW3JlZl07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXRlbSAmJiBpdGVtLmFsaWFzKSB7XG4gICAgICAgIGl0ZW0gPSBpdGVtLmFsaWFzO1xuICAgIH1cbiAgICByZXR1cm4gKGl0ZW0gJiYgaXRlbS5jb21wbGV0ZSkgPyBpdGVtLmNvbnRlbnQgOiBudWxsO1xufTtcblxuLyoqXG4gKiBHZXQgdG90YWwgcmVzb3VyY2VzIGNvdW50IGluIGxvYWRlci5cbiAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gKi9cbnByb3RvLmdldFJlc0NvdW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLl9jYWNoZSkubGVuZ3RoO1xufTtcblxuLyoqXG4gKiAhI2VuXG4gKiBHZXQgYWxsIHJlc291cmNlIGRlcGVuZGVuY2llcyBvZiB0aGUgbG9hZGVkIGFzc2V0IGluIGFuIGFycmF5LCBpbmNsdWRpbmcgaXRzZWxmLlxuICogVGhlIG93bmVyIHBhcmFtZXRlciBhY2NlcHQgdGhlIGZvbGxvd2luZyB0eXBlczogMS4gVGhlIGFzc2V0IGl0c2VsZjsgMi4gVGhlIHJlc291cmNlIHVybDsgMy4gVGhlIGFzc2V0J3MgdXVpZC48YnI+XG4gKiBUaGUgcmV0dXJuZWQgYXJyYXkgc3RvcmVzIHRoZSBkZXBlbmRlbmNpZXMgd2l0aCB0aGVpciB1dWlkcywgYWZ0ZXIgcmV0cmlldmUgZGVwZW5kZW5jaWVzLFxuICogeW91IGNhbiByZWxlYXNlIHRoZW0sIGFjY2VzcyBkZXBlbmRlbnQgYXNzZXRzIGJ5IHBhc3NpbmcgdGhlIHV1aWQgdG8ge3sjY3Jvc3NMaW5rIFwibG9hZGVyL2dldFJlczptZXRob2RcIn19e3svY3Jvc3NMaW5rfX0sIG9yIG90aGVyIHN0dWZmcyB5b3Ugd2FudC48YnI+XG4gKiBGb3IgcmVsZWFzZSBhbGwgZGVwZW5kZW5jaWVzIG9mIGFuIGFzc2V0LCBwbGVhc2UgcmVmZXIgdG8ge3sjY3Jvc3NMaW5rIFwibG9hZGVyL3JlbGVhc2U6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319XG4gKiBIZXJlIGlzIHNvbWUgZXhhbXBsZXM6XG4gKiAhI3poXG4gKiDojrflj5bmn5DkuKrlt7Lnu4/liqDovb3lpb3nmoTotYTmupDnmoTmiYDmnInkvp3otZbotYTmupDvvIzljIXlkKvlroPoh6rouqvvvIzlubbkv53lrZjlnKjmlbDnu4TkuK3ov5Tlm57jgIJvd25lciDlj4LmlbDmjqXmlLbku6XkuIvlh6Dnp43nsbvlnovvvJoxLiDotYTmupAgYXNzZXQg5a+56LGh77ybMi4g6LWE5rqQ55uu5b2V5LiL55qEIHVybO+8mzMuIOi1hOa6kOeahCB1dWlk44CCPGJyPlxuICog6L+U5Zue55qE5pWw57uE5bCG5LuF5L+d5a2Y5L6d6LWW6LWE5rqQ55qEIHV1aWTvvIzojrflj5bov5nkupsgdXVpZCDlkI7vvIzkvaDlj6/ku6Xku44gbG9hZGVyIOmHiuaUvui/meS6m+i1hOa6kO+8m+mAmui/hyB7eyNjcm9zc0xpbmsgXCJsb2FkZXIvZ2V0UmVzOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fSDojrflj5bmn5DkuKrotYTmupDmiJbogIXov5vooYzlhbbku5bkvaDpnIDopoHnmoTmk43kvZzjgII8YnI+XG4gKiDmg7PopoHph4rmlL7kuIDkuKrotYTmupDlj4rlhbbkvp3otZbotYTmupDvvIzlj6/ku6Xlj4LogIMge3sjY3Jvc3NMaW5rIFwibG9hZGVyL3JlbGVhc2U6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua31944CC5LiL6Z2i5piv5LiA5Lqb56S65L6L5Luj56CB77yaXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIFJlbGVhc2UgYWxsIGRlcGVuZGVuY2llcyBvZiBhIGxvYWRlZCBwcmVmYWJcbiAqIHZhciBkZXBzID0gY2MubG9hZGVyLmdldERlcGVuZHNSZWN1cnNpdmVseShwcmVmYWIpO1xuICogY2MubG9hZGVyLnJlbGVhc2UoZGVwcyk7XG4gKiAvLyBSZXRyaWV2ZSBhbGwgZGVwZW5kZW50IHRleHR1cmVzXG4gKiB2YXIgZGVwcyA9IGNjLmxvYWRlci5nZXREZXBlbmRzUmVjdXJzaXZlbHkoJ3ByZWZhYnMvc2FtcGxlJyk7XG4gKiB2YXIgdGV4dHVyZXMgPSBbXTtcbiAqIGZvciAodmFyIGkgPSAwOyBpIDwgZGVwcy5sZW5ndGg7ICsraSkge1xuICogICAgIHZhciBpdGVtID0gY2MubG9hZGVyLmdldFJlcyhkZXBzW2ldKTtcbiAqICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIGNjLlRleHR1cmUyRCkge1xuICogICAgICAgICB0ZXh0dXJlcy5wdXNoKGl0ZW0pO1xuICogICAgIH1cbiAqIH1cbiAqXG4gKiBAbWV0aG9kIGdldERlcGVuZHNSZWN1cnNpdmVseVxuICogQHBhcmFtIHtBc3NldHxSYXdBc3NldHxTdHJpbmd9IG93bmVyIC0gVGhlIG93bmVyIGFzc2V0IG9yIHRoZSByZXNvdXJjZSB1cmwgb3IgdGhlIGFzc2V0J3MgdXVpZFxuICogQHJldHVybnMge0FycmF5fVxuICovXG5wcm90by5nZXREZXBlbmRzUmVjdXJzaXZlbHkgPSBmdW5jdGlvbiAob3duZXIpIHtcbiAgICBpZiAob3duZXIpIHtcbiAgICAgICAgdmFyIGtleSA9IHRoaXMuX2dldFJlZmVyZW5jZUtleShvd25lcik7XG4gICAgICAgIHZhciBhc3NldHMgPSBBdXRvUmVsZWFzZVV0aWxzLmdldERlcGVuZHNSZWN1cnNpdmVseShrZXkpO1xuICAgICAgICBhc3NldHMucHVzaChrZXkpO1xuICAgICAgICByZXR1cm4gYXNzZXRzO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbn07XG5cbi8qKlxuICogISNlblxuICogUmVsZWFzZSB0aGUgY29udGVudCBvZiBhbiBhc3NldCBvciBhbiBhcnJheSBvZiBhc3NldHMgYnkgdXVpZC5cbiAqIFN0YXJ0IGZyb20gdjEuMywgdGhpcyBtZXRob2Qgd2lsbCBub3Qgb25seSByZW1vdmUgdGhlIGNhY2hlIG9mIHRoZSBhc3NldCBpbiBsb2FkZXIsIGJ1dCBhbHNvIGNsZWFuIHVwIGl0cyBjb250ZW50LlxuICogRm9yIGV4YW1wbGUsIGlmIHlvdSByZWxlYXNlIGEgdGV4dHVyZSwgdGhlIHRleHR1cmUgYXNzZXQgYW5kIGl0cyBnbCB0ZXh0dXJlIGRhdGEgd2lsbCBiZSBmcmVlZCB1cC5cbiAqIEluIGNvbXBsZXhlIHByb2plY3QsIHlvdSBjYW4gdXNlIHRoaXMgZnVuY3Rpb24gd2l0aCB7eyNjcm9zc0xpbmsgXCJsb2FkZXIvZ2V0RGVwZW5kc1JlY3Vyc2l2ZWx5Om1ldGhvZFwifX17ey9jcm9zc0xpbmt9fSB0byBmcmVlIHVwIG1lbW9yeSBpbiBjcml0aWNhbCBjaXJjdW1zdGFuY2VzLlxuICogTm90aWNlLCB0aGlzIG1ldGhvZCBtYXkgY2F1c2UgdGhlIHRleHR1cmUgdG8gYmUgdW51c2FibGUsIGlmIHRoZXJlIGFyZSBzdGlsbCBvdGhlciBub2RlcyB1c2UgdGhlIHNhbWUgdGV4dHVyZSwgdGhleSBtYXkgdHVybiB0byBibGFjayBhbmQgcmVwb3J0IGdsIGVycm9ycy5cbiAqIElmIHlvdSBvbmx5IHdhbnQgdG8gcmVtb3ZlIHRoZSBjYWNoZSBvZiBhbiBhc3NldCwgcGxlYXNlIHVzZSB7eyNjcm9zc0xpbmsgXCJwaXBlbGluZS9yZW1vdmVJdGVtOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fVxuICogISN6aFxuICog6YCa6L+HIGlk77yI6YCa5bi45piv6LWE5rqQIHVybO+8ieadpemHiuaUvuS4gOS4qui1hOa6kOaIluiAheS4gOS4qui1hOa6kOaVsOe7hOOAglxuICog5LuOIHYxLjMg5byA5aeL77yM6L+Z5Liq5pa55rOV5LiN5LuF5Lya5LuOIGxvYWRlciDkuK3liKDpmaTotYTmupDnmoTnvJPlrZjlvJXnlKjvvIzov5jkvJrmuIXnkIblroPnmoTotYTmupDlhoXlrrnjgIJcbiAqIOavlOWmguivtO+8jOW9k+S9oOmHiuaUvuS4gOS4qiB0ZXh0dXJlIOi1hOa6kO+8jOi/meS4qiB0ZXh0dXJlIOWSjOWug+eahCBnbCDotLTlm77mlbDmja7pg73kvJrooqvph4rmlL7jgIJcbiAqIOWcqOWkjeadgumhueebruS4re+8jOaIkeS7rOW7uuiuruS9oOe7k+WQiCB7eyNjcm9zc0xpbmsgXCJsb2FkZXIvZ2V0RGVwZW5kc1JlY3Vyc2l2ZWx5Om1ldGhvZFwifX17ey9jcm9zc0xpbmt9fSDmnaXkvb/nlKjvvIzkvr/kuo7lnKjorr7lpIflhoXlrZjlkYrmgKXnmoTmg4XlhrXkuIvmm7Tlv6vlnLDph4rmlL7kuI3lho3pnIDopoHnmoTotYTmupDnmoTlhoXlrZjjgIJcbiAqIOazqOaEj++8jOi/meS4quWHveaVsOWPr+iDveS8muWvvOiHtOi1hOa6kOi0tOWbvuaIlui1hOa6kOaJgOS+nei1lueahOi0tOWbvuS4jeWPr+eUqO+8jOWmguaenOWcuuaZr+S4reWtmOWcqOiKgueCueS7jeeEtuS+nei1luWQjOagt+eahOi0tOWbvu+8jOWug+S7rOWPr+iDveS8muWPmOm7keW5tuaKpSBHTCDplJnor6/jgIJcbiAqIOWmguaenOS9oOWPquaDs+WIoOmZpOS4gOS4qui1hOa6kOeahOe8k+WtmOW8leeUqO+8jOivt+S9v+eUqCB7eyNjcm9zc0xpbmsgXCJwaXBlbGluZS9yZW1vdmVJdGVtOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fVxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBSZWxlYXNlIGEgdGV4dHVyZSB3aGljaCBpcyBubyBsb25nZXIgbmVlZFxuICogY2MubG9hZGVyLnJlbGVhc2UodGV4dHVyZSk7XG4gKiAvLyBSZWxlYXNlIGFsbCBkZXBlbmRlbmNpZXMgb2YgYSBsb2FkZWQgcHJlZmFiXG4gKiB2YXIgZGVwcyA9IGNjLmxvYWRlci5nZXREZXBlbmRzUmVjdXJzaXZlbHkoJ3ByZWZhYnMvc2FtcGxlJyk7XG4gKiBjYy5sb2FkZXIucmVsZWFzZShkZXBzKTtcbiAqIC8vIElmIHRoZXJlIGlzIG5vIGluc3RhbmNlIG9mIHRoaXMgcHJlZmFiIGluIHRoZSBzY2VuZSwgdGhlIHByZWZhYiBhbmQgaXRzIGRlcGVuZGVuY2llcyBsaWtlIHRleHR1cmVzLCBzcHJpdGUgZnJhbWVzLCBldGMsIHdpbGwgYmUgZnJlZWQgdXAuXG4gKiAvLyBJZiB5b3UgaGF2ZSBzb21lIG90aGVyIG5vZGVzIHNoYXJlIGEgdGV4dHVyZSBpbiB0aGlzIHByZWZhYiwgeW91IGNhbiBza2lwIGl0IGluIHR3byB3YXlzOlxuICogLy8gMS4gRm9yYmlkIGF1dG8gcmVsZWFzZSBhIHRleHR1cmUgYmVmb3JlIHJlbGVhc2VcbiAqIGNjLmxvYWRlci5zZXRBdXRvUmVsZWFzZSh0ZXh0dXJlMmQsIGZhbHNlKTtcbiAqIC8vIDIuIFJlbW92ZSBpdCBmcm9tIHRoZSBkZXBlbmRlbmNpZXMgYXJyYXlcbiAqIHZhciBkZXBzID0gY2MubG9hZGVyLmdldERlcGVuZHNSZWN1cnNpdmVseSgncHJlZmFicy9zYW1wbGUnKTtcbiAqIHZhciBpbmRleCA9IGRlcHMuaW5kZXhPZih0ZXh0dXJlMmQuX3V1aWQpO1xuICogaWYgKGluZGV4ICE9PSAtMSlcbiAqICAgICBkZXBzLnNwbGljZShpbmRleCwgMSk7XG4gKiBjYy5sb2FkZXIucmVsZWFzZShkZXBzKTtcbiAqXG4gKiBAbWV0aG9kIHJlbGVhc2VcbiAqIEBwYXJhbSB7QXNzZXR8UmF3QXNzZXR8U3RyaW5nfEFycmF5fSBhc3NldFxuICovXG5wcm90by5yZWxlYXNlID0gZnVuY3Rpb24gKGFzc2V0KSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYXNzZXQpKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXNzZXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBhc3NldFtpXTtcbiAgICAgICAgICAgIHRoaXMucmVsZWFzZShrZXkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKGFzc2V0KSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXMuX2dldFJlZmVyZW5jZUtleShhc3NldCk7XG4gICAgICAgIGlmICghQ0NfRURJVE9SICYmIGlkICYmIGlkIGluIGNjLkFzc2V0TGlicmFyeS5nZXRCdWlsdGluRGVwcygpKSByZXR1cm47XG4gICAgICAgIHZhciBpdGVtID0gdGhpcy5nZXRJdGVtKGlkKTtcbiAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgIHZhciByZW1vdmVkID0gdGhpcy5yZW1vdmVJdGVtKGlkKTtcbiAgICAgICAgICAgIGFzc2V0ID0gaXRlbS5jb250ZW50O1xuICAgICAgICAgICAgaWYgKENDX0RFQlVHICYmIHJlbW92ZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWxlYXNlZEFzc2V0Q2hlY2tlcl9ERUJVRy5zZXRSZWxlYXNlZChpdGVtLCBpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFzc2V0IGluc3RhbmNlb2YgY2MuQXNzZXQpIHtcbiAgICAgICAgICAgIGxldCBuYXRpdmVVcmwgPSBhc3NldC5uYXRpdmVVcmw7XG4gICAgICAgICAgICBpZiAobmF0aXZlVXJsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWxlYXNlKG5hdGl2ZVVybCk7ICAvLyB1bmNhY2hlIGxvYWRpbmcgaXRlbSBvZiBuYXRpdmUgYXNzZXRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFzc2V0LmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogISNlbiBSZWxlYXNlIHRoZSBhc3NldCBieSBpdHMgb2JqZWN0LiBSZWZlciB0byB7eyNjcm9zc0xpbmsgXCJsb2FkZXIvcmVsZWFzZTptZXRob2RcIn19e3svY3Jvc3NMaW5rfX0gZm9yIGRldGFpbGVkIGluZm9ybWF0aW9ucy5cbiAqICEjemgg6YCa6L+H6LWE5rqQ5a+56LGh6Ieq6Lqr5p2l6YeK5pS+6LWE5rqQ44CC6K+m57uG5L+h5oGv6K+35Y+C6ICDIHt7I2Nyb3NzTGluayBcImxvYWRlci9yZWxlYXNlOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fVxuICpcbiAqIEBtZXRob2QgcmVsZWFzZUFzc2V0XG4gKiBAcGFyYW0ge0Fzc2V0fSBhc3NldFxuICovXG5wcm90by5yZWxlYXNlQXNzZXQgPSBmdW5jdGlvbiAoYXNzZXQpIHtcbiAgICB2YXIgdXVpZCA9IGFzc2V0Ll91dWlkO1xuICAgIGlmICh1dWlkKSB7XG4gICAgICAgIHRoaXMucmVsZWFzZSh1dWlkKTtcbiAgICB9XG59O1xuXG4vKipcbiAqICEjZW4gUmVsZWFzZSB0aGUgYXNzZXQgbG9hZGVkIGJ5IHt7I2Nyb3NzTGluayBcImxvYWRlci9sb2FkUmVzOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fS4gUmVmZXIgdG8ge3sjY3Jvc3NMaW5rIFwibG9hZGVyL3JlbGVhc2U6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319IGZvciBkZXRhaWxlZCBpbmZvcm1hdGlvbnMuXG4gKiAhI3poIOmHiuaUvumAmui/hyB7eyNjcm9zc0xpbmsgXCJsb2FkZXIvbG9hZFJlczptZXRob2RcIn19e3svY3Jvc3NMaW5rfX0g5Yqg6L2955qE6LWE5rqQ44CC6K+m57uG5L+h5oGv6K+35Y+C6ICDIHt7I2Nyb3NzTGluayBcImxvYWRlci9yZWxlYXNlOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fVxuICpcbiAqIEBtZXRob2QgcmVsZWFzZVJlc1xuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3R5cGVdIC0gT25seSBhc3NldCBvZiB0eXBlIHdpbGwgYmUgcmVsZWFzZWQgaWYgdGhpcyBhcmd1bWVudCBpcyBzdXBwbGllZC5cbiAqL1xucHJvdG8ucmVsZWFzZVJlcyA9IGZ1bmN0aW9uICh1cmwsIHR5cGUsIG1vdW50KSB7XG4gICAgdmFyIHV1aWQgPSB0aGlzLl9nZXRSZXNVdWlkKHVybCwgdHlwZSwgbW91bnQpO1xuICAgIGlmICh1dWlkKSB7XG4gICAgICAgIHRoaXMucmVsZWFzZSh1dWlkKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNjLmVycm9ySUQoNDkxNCwgdXJsKTtcbiAgICB9XG59O1xuXG4vKipcbiAqICEjZW4gUmVsZWFzZSB0aGUgYWxsIGFzc2V0cyBsb2FkZWQgYnkge3sjY3Jvc3NMaW5rIFwibG9hZGVyL2xvYWRSZXNEaXI6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319LiBSZWZlciB0byB7eyNjcm9zc0xpbmsgXCJsb2FkZXIvcmVsZWFzZTptZXRob2RcIn19e3svY3Jvc3NMaW5rfX0gZm9yIGRldGFpbGVkIGluZm9ybWF0aW9ucy5cbiAqICEjemgg6YeK5pS+6YCa6L+HIHt7I2Nyb3NzTGluayBcImxvYWRlci9sb2FkUmVzRGlyOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fSDliqDovb3nmoTotYTmupDjgILor6bnu4bkv6Hmga/or7flj4LogIMge3sjY3Jvc3NMaW5rIFwibG9hZGVyL3JlbGVhc2U6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319XG4gKlxuICogQG1ldGhvZCByZWxlYXNlUmVzRGlyXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbdHlwZV0gLSBPbmx5IGFzc2V0IG9mIHR5cGUgd2lsbCBiZSByZWxlYXNlZCBpZiB0aGlzIGFyZ3VtZW50IGlzIHN1cHBsaWVkLlxuICovXG5wcm90by5yZWxlYXNlUmVzRGlyID0gZnVuY3Rpb24gKHVybCwgdHlwZSwgbW91bnQpIHtcbiAgICBtb3VudCA9IG1vdW50IHx8ICdhc3NldHMnO1xuICAgIGlmICghYXNzZXRUYWJsZXNbbW91bnRdKSByZXR1cm47XG4gICAgXG4gICAgdmFyIHV1aWRzID0gYXNzZXRUYWJsZXNbbW91bnRdLmdldFV1aWRBcnJheSh1cmwsIHR5cGUpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdXVpZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHV1aWQgPSB1dWlkc1tpXTtcbiAgICAgICAgdGhpcy5yZWxlYXNlKHV1aWQpO1xuICAgIH1cbn07XG5cbi8qKlxuICogISNlbiBSZXNvdXJjZSBhbGwgYXNzZXRzLiBSZWZlciB0byB7eyNjcm9zc0xpbmsgXCJsb2FkZXIvcmVsZWFzZTptZXRob2RcIn19e3svY3Jvc3NMaW5rfX0gZm9yIGRldGFpbGVkIGluZm9ybWF0aW9ucy5cbiAqICEjemgg6YeK5pS+5omA5pyJ6LWE5rqQ44CC6K+m57uG5L+h5oGv6K+35Y+C6ICDIHt7I2Nyb3NzTGluayBcImxvYWRlci9yZWxlYXNlOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fVxuICpcbiAqIEBtZXRob2QgcmVsZWFzZUFsbFxuICovXG5wcm90by5yZWxlYXNlQWxsID0gZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIGlkIGluIHRoaXMuX2NhY2hlKSB7XG4gICAgICAgIHRoaXMucmVsZWFzZShpZCk7XG4gICAgfVxufTtcblxuLy8gQVVUTyBSRUxFQVNFXG5cbi8vIG92ZXJyaWRlXG5wcm90by5yZW1vdmVJdGVtID0gZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciByZW1vdmVkID0gUGlwZWxpbmUucHJvdG90eXBlLnJlbW92ZUl0ZW0uY2FsbCh0aGlzLCBrZXkpO1xuICAgIGRlbGV0ZSB0aGlzLl9hdXRvUmVsZWFzZVNldHRpbmdba2V5XTtcbiAgICByZXR1cm4gcmVtb3ZlZDtcbn07XG5cbi8qKlxuICogISNlblxuICogSW5kaWNhdGVzIHdoZXRoZXIgdG8gcmVsZWFzZSB0aGUgYXNzZXQgd2hlbiBsb2FkaW5nIGEgbmV3IHNjZW5lLjxicj5cbiAqIEJ5IGRlZmF1bHQsIHdoZW4gbG9hZGluZyBhIG5ldyBzY2VuZSwgYWxsIGFzc2V0cyBpbiB0aGUgcHJldmlvdXMgc2NlbmUgd2lsbCBiZSByZWxlYXNlZCBvciBwcmVzZXJ2ZWRcbiAqIGFjY29yZGluZyB0byB3aGV0aGVyIHRoZSBwcmV2aW91cyBzY2VuZSBjaGVja2VkIHRoZSBcIkF1dG8gUmVsZWFzZSBBc3NldHNcIiBvcHRpb24uXG4gKiBPbiB0aGUgb3RoZXIgaGFuZCwgYXNzZXRzIGR5bmFtaWNhbGx5IGxvYWRlZCBieSB1c2luZyBgY2MubG9hZGVyLmxvYWRSZXNgIG9yIGBjYy5sb2FkZXIubG9hZFJlc0RpcmBcbiAqIHdpbGwgbm90IGJlIGFmZmVjdGVkIGJ5IHRoYXQgb3B0aW9uLCByZW1haW4gbm90IHJlbGVhc2VkIGJ5IGRlZmF1bHQuPGJyPlxuICogVXNlIHRoaXMgQVBJIHRvIGNoYW5nZSB0aGUgZGVmYXVsdCBiZWhhdmlvciBvbiBhIHNpbmdsZSBhc3NldCwgdG8gZm9yY2UgcHJlc2VydmUgb3IgcmVsZWFzZSBzcGVjaWZpZWQgYXNzZXQgd2hlbiBzY2VuZSBzd2l0Y2hpbmcuPGJyPlxuICogPGJyPlxuICogU2VlOiB7eyNjcm9zc0xpbmsgXCJsb2FkZXIvc2V0QXV0b1JlbGVhc2VSZWN1cnNpdmVseTptZXRob2RcIn19Y2MubG9hZGVyLnNldEF1dG9SZWxlYXNlUmVjdXJzaXZlbHl7ey9jcm9zc0xpbmt9fSwge3sjY3Jvc3NMaW5rIFwibG9hZGVyL2lzQXV0b1JlbGVhc2U6bWV0aG9kXCJ9fWNjLmxvYWRlci5pc0F1dG9SZWxlYXNle3svY3Jvc3NMaW5rfX1cbiAqICEjemhcbiAqIOiuvue9ruW9k+WcuuaZr+WIh+aNouaXtuaYr+WQpuiHquWKqOmHiuaUvui1hOa6kOOAgjxicj5cbiAqIOm7mOiupOaDheWGteS4i++8jOW9k+WKoOi9veaWsOWcuuaZr+aXtu+8jOaXp+WcuuaZr+eahOi1hOa6kOagueaNruaXp+WcuuaZr+aYr+WQpuWLvumAieKAnEF1dG8gUmVsZWFzZSBBc3NldHPigJ3vvIzlsIbkvJrooqvph4rmlL7miJbogIXkv53nlZnjgIJcbiAqIOiAjOS9v+eUqCBgY2MubG9hZGVyLmxvYWRSZXNgIOaIliBgY2MubG9hZGVyLmxvYWRSZXNEaXJgIOWKqOaAgeWKoOi9veeahOi1hOa6kO+8jOWImeS4jeWPl+WcuuaZr+iuvue9rueahOW9seWTje+8jOm7mOiupOS4jeiHquWKqOmHiuaUvuOAgjxicj5cbiAqIOS9v+eUqOi/meS4qiBBUEkg5Y+v5Lul5Zyo5Y2V5Liq6LWE5rqQ5LiK5pS55Y+Y6L+Z5Liq6buY6K6k6KGM5Li677yM5by65Yi25Zyo5YiH5o2i5Zy65pmv5pe25L+d55WZ5oiW6ICF6YeK5pS+5oyH5a6a6LWE5rqQ44CCPGJyPlxuICogPGJyPlxuICog5Y+C6ICD77yae3sjY3Jvc3NMaW5rIFwibG9hZGVyL3NldEF1dG9SZWxlYXNlUmVjdXJzaXZlbHk6bWV0aG9kXCJ9fWNjLmxvYWRlci5zZXRBdXRvUmVsZWFzZVJlY3Vyc2l2ZWx5e3svY3Jvc3NMaW5rfX3vvIx7eyNjcm9zc0xpbmsgXCJsb2FkZXIvaXNBdXRvUmVsZWFzZTptZXRob2RcIn19Y2MubG9hZGVyLmlzQXV0b1JlbGVhc2V7ey9jcm9zc0xpbmt9fVxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBhdXRvIHJlbGVhc2UgdGhlIHRleHR1cmUgZXZlbnQgaWYgXCJBdXRvIFJlbGVhc2UgQXNzZXRzXCIgZGlzYWJsZWQgaW4gY3VycmVudCBzY2VuZVxuICogY2MubG9hZGVyLnNldEF1dG9SZWxlYXNlKHRleHR1cmUyZCwgdHJ1ZSk7XG4gKiAvLyBkb24ndCByZWxlYXNlIHRoZSB0ZXh0dXJlIGV2ZW4gaWYgXCJBdXRvIFJlbGVhc2UgQXNzZXRzXCIgZW5hYmxlZCBpbiBjdXJyZW50IHNjZW5lXG4gKiBjYy5sb2FkZXIuc2V0QXV0b1JlbGVhc2UodGV4dHVyZTJkLCBmYWxzZSk7XG4gKiAvLyBmaXJzdCBwYXJhbWV0ZXIgY2FuIGJlIHVybFxuICogY2MubG9hZGVyLnNldEF1dG9SZWxlYXNlKGF1ZGlvVXJsLCBmYWxzZSk7XG4gKlxuICogQG1ldGhvZCBzZXRBdXRvUmVsZWFzZVxuICogQHBhcmFtIHtBc3NldHxTdHJpbmd9IGFzc2V0T3JVcmxPclV1aWQgLSBhc3NldCBvYmplY3Qgb3IgdGhlIHJhdyBhc3NldCdzIHVybCBvciB1dWlkXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGF1dG9SZWxlYXNlIC0gaW5kaWNhdGVzIHdoZXRoZXIgc2hvdWxkIHJlbGVhc2UgYXV0b21hdGljYWxseVxuICovXG5wcm90by5zZXRBdXRvUmVsZWFzZSA9IGZ1bmN0aW9uIChhc3NldE9yVXJsT3JVdWlkLCBhdXRvUmVsZWFzZSkge1xuICAgIHZhciBrZXkgPSB0aGlzLl9nZXRSZWZlcmVuY2VLZXkoYXNzZXRPclVybE9yVXVpZCk7XG4gICAgaWYgKGtleSkge1xuICAgICAgICB0aGlzLl9hdXRvUmVsZWFzZVNldHRpbmdba2V5XSA9ICEhYXV0b1JlbGVhc2U7XG4gICAgfVxuICAgIGVsc2UgaWYgKENDX0RFVikge1xuICAgICAgICBjYy53YXJuSUQoNDkwMik7XG4gICAgfVxufTtcblxuLyoqXG4gKiAhI2VuXG4gKiBJbmRpY2F0ZXMgd2hldGhlciB0byByZWxlYXNlIHRoZSBhc3NldCBhbmQgaXRzIHJlZmVyZW5jZWQgb3RoZXIgYXNzZXRzIHdoZW4gbG9hZGluZyBhIG5ldyBzY2VuZS48YnI+XG4gKiBCeSBkZWZhdWx0LCB3aGVuIGxvYWRpbmcgYSBuZXcgc2NlbmUsIGFsbCBhc3NldHMgaW4gdGhlIHByZXZpb3VzIHNjZW5lIHdpbGwgYmUgcmVsZWFzZWQgb3IgcHJlc2VydmVkXG4gKiBhY2NvcmRpbmcgdG8gd2hldGhlciB0aGUgcHJldmlvdXMgc2NlbmUgY2hlY2tlZCB0aGUgXCJBdXRvIFJlbGVhc2UgQXNzZXRzXCIgb3B0aW9uLlxuICogT24gdGhlIG90aGVyIGhhbmQsIGFzc2V0cyBkeW5hbWljYWxseSBsb2FkZWQgYnkgdXNpbmcgYGNjLmxvYWRlci5sb2FkUmVzYCBvciBgY2MubG9hZGVyLmxvYWRSZXNEaXJgXG4gKiB3aWxsIG5vdCBiZSBhZmZlY3RlZCBieSB0aGF0IG9wdGlvbiwgcmVtYWluIG5vdCByZWxlYXNlZCBieSBkZWZhdWx0Ljxicj5cbiAqIFVzZSB0aGlzIEFQSSB0byBjaGFuZ2UgdGhlIGRlZmF1bHQgYmVoYXZpb3Igb24gdGhlIHNwZWNpZmllZCBhc3NldCBhbmQgaXRzIHJlY3Vyc2l2ZWx5IHJlZmVyZW5jZWQgYXNzZXRzLCB0byBmb3JjZSBwcmVzZXJ2ZSBvciByZWxlYXNlIHNwZWNpZmllZCBhc3NldCB3aGVuIHNjZW5lIHN3aXRjaGluZy48YnI+XG4gKiA8YnI+XG4gKiBTZWU6IHt7I2Nyb3NzTGluayBcImxvYWRlci9zZXRBdXRvUmVsZWFzZTptZXRob2RcIn19Y2MubG9hZGVyLnNldEF1dG9SZWxlYXNle3svY3Jvc3NMaW5rfX0sIHt7I2Nyb3NzTGluayBcImxvYWRlci9pc0F1dG9SZWxlYXNlOm1ldGhvZFwifX1jYy5sb2FkZXIuaXNBdXRvUmVsZWFzZXt7L2Nyb3NzTGlua319XG4gKiAhI3poXG4gKiDorr7nva7lvZPlnLrmma/liIfmjaLml7bmmK/lkKboh6rliqjph4rmlL7otYTmupDlj4rotYTmupDlvJXnlKjnmoTlhbblroPotYTmupDjgII8YnI+XG4gKiDpu5jorqTmg4XlhrXkuIvvvIzlvZPliqDovb3mlrDlnLrmma/ml7bvvIzml6flnLrmma/nmoTotYTmupDmoLnmja7ml6flnLrmma/mmK/lkKbli77pgInigJxBdXRvIFJlbGVhc2UgQXNzZXRz4oCd77yM5bCG5Lya6KKr6YeK5pS+5oiW6ICF5L+d55WZ44CCXG4gKiDogIzkvb/nlKggYGNjLmxvYWRlci5sb2FkUmVzYCDmiJYgYGNjLmxvYWRlci5sb2FkUmVzRGlyYCDliqjmgIHliqDovb3nmoTotYTmupDvvIzliJnkuI3lj5flnLrmma/orr7nva7nmoTlvbHlk43vvIzpu5jorqTkuI3oh6rliqjph4rmlL7jgII8YnI+XG4gKiDkvb/nlKjov5nkuKogQVBJIOWPr+S7peWcqOaMh+Wumui1hOa6kOWPiui1hOa6kOmAkuW9kuW8leeUqOWIsOeahOaJgOaciei1hOa6kOS4iuaUueWPmOi/meS4qum7mOiupOihjOS4uu+8jOW8uuWItuWcqOWIh+aNouWcuuaZr+aXtuS/neeVmeaIluiAhemHiuaUvuaMh+Wumui1hOa6kOOAgjxicj5cbiAqIDxicj5cbiAqIOWPguiAg++8mnt7I2Nyb3NzTGluayBcImxvYWRlci9zZXRBdXRvUmVsZWFzZTptZXRob2RcIn19Y2MubG9hZGVyLnNldEF1dG9SZWxlYXNle3svY3Jvc3NMaW5rfX3vvIx7eyNjcm9zc0xpbmsgXCJsb2FkZXIvaXNBdXRvUmVsZWFzZTptZXRob2RcIn19Y2MubG9hZGVyLmlzQXV0b1JlbGVhc2V7ey9jcm9zc0xpbmt9fVxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBhdXRvIHJlbGVhc2UgdGhlIFNwcml0ZUZyYW1lIGFuZCBpdHMgVGV4dHVyZSBldmVudCBpZiBcIkF1dG8gUmVsZWFzZSBBc3NldHNcIiBkaXNhYmxlZCBpbiBjdXJyZW50IHNjZW5lXG4gKiBjYy5sb2FkZXIuc2V0QXV0b1JlbGVhc2VSZWN1cnNpdmVseShzcHJpdGVGcmFtZSwgdHJ1ZSk7XG4gKiAvLyBkb24ndCByZWxlYXNlIHRoZSBTcHJpdGVGcmFtZSBhbmQgaXRzIFRleHR1cmUgZXZlbiBpZiBcIkF1dG8gUmVsZWFzZSBBc3NldHNcIiBlbmFibGVkIGluIGN1cnJlbnQgc2NlbmVcbiAqIGNjLmxvYWRlci5zZXRBdXRvUmVsZWFzZVJlY3Vyc2l2ZWx5KHNwcml0ZUZyYW1lLCBmYWxzZSk7XG4gKiAvLyBkb24ndCByZWxlYXNlIHRoZSBQcmVmYWIgYW5kIGFsbCB0aGUgcmVmZXJlbmNlZCBhc3NldHNcbiAqIGNjLmxvYWRlci5zZXRBdXRvUmVsZWFzZVJlY3Vyc2l2ZWx5KHByZWZhYiwgZmFsc2UpO1xuICpcbiAqIEBtZXRob2Qgc2V0QXV0b1JlbGVhc2VSZWN1cnNpdmVseVxuICogQHBhcmFtIHtBc3NldHxTdHJpbmd9IGFzc2V0T3JVcmxPclV1aWQgLSBhc3NldCBvYmplY3Qgb3IgdGhlIHJhdyBhc3NldCdzIHVybCBvciB1dWlkXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGF1dG9SZWxlYXNlIC0gaW5kaWNhdGVzIHdoZXRoZXIgc2hvdWxkIHJlbGVhc2UgYXV0b21hdGljYWxseVxuICovXG5wcm90by5zZXRBdXRvUmVsZWFzZVJlY3Vyc2l2ZWx5ID0gZnVuY3Rpb24gKGFzc2V0T3JVcmxPclV1aWQsIGF1dG9SZWxlYXNlKSB7XG4gICAgYXV0b1JlbGVhc2UgPSAhIWF1dG9SZWxlYXNlO1xuICAgIHZhciBrZXkgPSB0aGlzLl9nZXRSZWZlcmVuY2VLZXkoYXNzZXRPclVybE9yVXVpZCk7XG4gICAgaWYgKGtleSkge1xuICAgICAgICB0aGlzLl9hdXRvUmVsZWFzZVNldHRpbmdba2V5XSA9IGF1dG9SZWxlYXNlO1xuXG4gICAgICAgIHZhciBkZXBlbmRzID0gQXV0b1JlbGVhc2VVdGlscy5nZXREZXBlbmRzUmVjdXJzaXZlbHkoa2V5KTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkZXBlbmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZGVwZW5kID0gZGVwZW5kc1tpXTtcbiAgICAgICAgICAgIHRoaXMuX2F1dG9SZWxlYXNlU2V0dGluZ1tkZXBlbmRdID0gYXV0b1JlbGVhc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoQ0NfREVWKSB7XG4gICAgICAgIGNjLndhcm5JRCg0OTAyKTtcbiAgICB9XG59O1xuXG5cbi8qKlxuICogISNlblxuICogUmV0dXJucyB3aGV0aGVyIHRoZSBhc3NldCBpcyBjb25maWd1cmVkIGFzIGF1dG8gcmVsZWFzZWQsIGRlc3BpdGUgaG93IFwiQXV0byBSZWxlYXNlIEFzc2V0c1wiIHByb3BlcnR5IGlzIHNldCBvbiBzY2VuZSBhc3NldC48YnI+XG4gKiA8YnI+XG4gKiBTZWU6IHt7I2Nyb3NzTGluayBcImxvYWRlci9zZXRBdXRvUmVsZWFzZTptZXRob2RcIn19Y2MubG9hZGVyLnNldEF1dG9SZWxlYXNle3svY3Jvc3NMaW5rfX0sIHt7I2Nyb3NzTGluayBcImxvYWRlci9zZXRBdXRvUmVsZWFzZVJlY3Vyc2l2ZWx5Om1ldGhvZFwifX1jYy5sb2FkZXIuc2V0QXV0b1JlbGVhc2VSZWN1cnNpdmVseXt7L2Nyb3NzTGlua319XG4gKlxuICogISN6aFxuICog6L+U5Zue5oyH5a6a55qE6LWE5rqQ5piv5ZCm5pyJ6KKr6K6+572u5Li66Ieq5Yqo6YeK5pS+77yM5LiN6K665Zy65pmv55qE4oCcQXV0byBSZWxlYXNlIEFzc2V0c+KAneWmguS9leiuvue9ruOAgjxicj5cbiAqIDxicj5cbiAqIOWPguiAg++8mnt7I2Nyb3NzTGluayBcImxvYWRlci9zZXRBdXRvUmVsZWFzZTptZXRob2RcIn19Y2MubG9hZGVyLnNldEF1dG9SZWxlYXNle3svY3Jvc3NMaW5rfX3vvIx7eyNjcm9zc0xpbmsgXCJsb2FkZXIvc2V0QXV0b1JlbGVhc2VSZWN1cnNpdmVseTptZXRob2RcIn19Y2MubG9hZGVyLnNldEF1dG9SZWxlYXNlUmVjdXJzaXZlbHl7ey9jcm9zc0xpbmt9fVxuICogQG1ldGhvZCBpc0F1dG9SZWxlYXNlXG4gKiBAcGFyYW0ge0Fzc2V0fFN0cmluZ30gYXNzZXRPclVybCAtIGFzc2V0IG9iamVjdCBvciB0aGUgcmF3IGFzc2V0J3MgdXJsXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAqL1xucHJvdG8uaXNBdXRvUmVsZWFzZSA9IGZ1bmN0aW9uIChhc3NldE9yVXJsKSB7XG4gICAgdmFyIGtleSA9IHRoaXMuX2dldFJlZmVyZW5jZUtleShhc3NldE9yVXJsKTtcbiAgICBpZiAoa2V5KSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX2F1dG9SZWxlYXNlU2V0dGluZ1trZXldO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG5jYy5sb2FkZXIgPSBuZXcgQ0NMb2FkZXIoKTtcblxuaWYgKENDX0VESVRPUikge1xuICAgIGNjLmxvYWRlci5yZWZyZXNoVXJsID0gZnVuY3Rpb24gKHV1aWQsIG9sZFVybCwgbmV3VXJsKSB7XG4gICAgICAgIHZhciBpdGVtID0gdGhpcy5fY2FjaGVbdXVpZF07XG4gICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICBpdGVtLnVybCA9IG5ld1VybDtcbiAgICAgICAgfVxuXG4gICAgICAgIGl0ZW0gPSB0aGlzLl9jYWNoZVtvbGRVcmxdO1xuICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgaXRlbS5pZCA9IG5ld1VybDtcbiAgICAgICAgICAgIGl0ZW0udXJsID0gbmV3VXJsO1xuICAgICAgICAgICAgdGhpcy5fY2FjaGVbbmV3VXJsXSA9IGl0ZW07XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fY2FjaGVbb2xkVXJsXTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2MubG9hZGVyO1xuIl19