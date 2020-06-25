
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/load-pipeline/loading-items.js';
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
var CallbacksInvoker = require('../platform/callbacks-invoker');

require('../utils/CCPath');

var js = require('../platform/js');

var _qid = 0 | Math.random() * 998;

var _queues = js.createMap(true);

var _pool = [];
var _POOL_MAX_LENGTH = 10;
var ItemState = {
  WORKING: 1,
  COMPLETE: 2,
  ERROR: 3
};

var _queueDeps = js.createMap(true);

function isIdValid(id) {
  var realId = id.url || id;
  return typeof realId === 'string';
}

function _parseUrlParam(url) {
  if (!url) return undefined;
  var split = url.split('?');

  if (!split || !split[0] || !split[1]) {
    return undefined;
  }

  var urlParam = {};
  var queries = split[1].split('&');
  queries.forEach(function (item) {
    var itemSplit = item.split('=');
    urlParam[itemSplit[0]] = itemSplit[1];
  });
  return urlParam;
}

function createItem(id, queueId) {
  var url = typeof id === 'object' ? id.url : id;
  var result = {
    queueId: queueId,
    id: url,
    url: url,
    // real download url, maybe changed
    rawUrl: undefined,
    // url used in scripts
    urlParam: _parseUrlParam(url),
    type: "",
    error: null,
    content: null,
    complete: false,
    states: {},
    deps: null
  };

  if (typeof id === 'object') {
    js.mixin(result, id);

    if (id.skips) {
      for (var i = 0; i < id.skips.length; i++) {
        var skip = id.skips[i];
        result.states[skip] = ItemState.COMPLETE;
      }
    }
  }

  result.rawUrl = result.url;

  if (url && !result.type) {
    result.type = cc.path.extname(url).toLowerCase().substr(1);
  }

  return result;
}

var checkedIds = [];

function checkCircleReference(owner, item, recursiveCall) {
  if (!owner || !item) {
    return false;
  }

  var result = false;
  checkedIds.push(item.id);

  if (item.deps) {
    var i,
        deps = item.deps,
        subDep;

    for (i = 0; i < deps.length; i++) {
      subDep = deps[i];

      if (subDep.id === owner.id) {
        result = true;
        break;
      } else if (checkedIds.indexOf(subDep.id) >= 0) {
        continue;
      } else if (subDep.deps && checkCircleReference(owner, subDep, true)) {
        result = true;
        break;
      }
    }
  }

  if (!recursiveCall) {
    checkedIds.length = 0;
  }

  return result;
}
/**
 * !#en
 * LoadingItems is the queue of items which can flow them into the loading pipeline.<br/>
 * Please don't construct it directly, use {{#crossLink "LoadingItems.create"}}cc.LoadingItems.create{{/crossLink}} instead, because we use an internal pool to recycle the queues.<br/>
 * It hold a map of items, each entry in the map is a url to object key value pair.<br/>
 * Each item always contains the following property:<br/>
 * - id: The identification of the item, usually it's identical to url<br/>
 * - url: The url <br/>
 * - type: The type, it's the extension name of the url by default, could be specified manually too.<br/>
 * - error: The error happened in pipeline will be stored in this property.<br/>
 * - content: The content processed by the pipeline, the final result will also be stored in this property.<br/>
 * - complete: The flag indicate whether the item is completed by the pipeline.<br/>
 * - states: An object stores the states of each pipe the item go through, the state can be: Pipeline.ItemState.WORKING | Pipeline.ItemState.ERROR | Pipeline.ItemState.COMPLETE<br/>
 * <br/>
 * Item can hold other custom properties.<br/>
 * Each LoadingItems object will be destroyed for recycle after onComplete callback<br/>
 * So please don't hold its reference for later usage, you can copy properties in it though.
 * !#zh
 * LoadingItems 是一个加载对象队列，可以用来输送加载对象到加载管线中。<br/>
 * 请不要直接使用 new 构造这个类的对象，你可以使用 {{#crossLink "LoadingItems.create"}}cc.LoadingItems.create{{/crossLink}} 来创建一个新的加载队列，这样可以允许我们的内部对象池回收并重利用加载队列。
 * 它有一个 map 属性用来存放加载项，在 map 对象中以 url 为 key 值。<br/>
 * 每个对象都会包含下列属性：<br/>
 * - id：该对象的标识，通常与 url 相同。<br/>
 * - url：路径 <br/>
 * - type: 类型，它这是默认的 URL 的扩展名，可以手动指定赋值。<br/>
 * - error：pipeline 中发生的错误将被保存在这个属性中。<br/>
 * - content: pipeline 中处理的临时结果，最终的结果也将被存储在这个属性中。<br/>
 * - complete：该标志表明该对象是否通过 pipeline 完成。<br/>
 * - states：该对象存储每个管道中对象经历的状态，状态可以是 Pipeline.ItemState.WORKING | Pipeline.ItemState.ERROR | Pipeline.ItemState.COMPLETE<br/>
 * <br/>
 * 对象可容纳其他自定义属性。<br/>
 * 每个 LoadingItems 对象都会在 onComplete 回调之后被销毁，所以请不要持有它的引用并在结束回调之后依赖它的内容执行任何逻辑，有这种需求的话你可以提前复制它的内容。
 *
 * @class LoadingItems
 * @extends CallbacksInvoker
 */


var LoadingItems = function LoadingItems(pipeline, urlList, onProgress, onComplete) {
  CallbacksInvoker.call(this);
  this._id = ++_qid;
  _queues[this._id] = this;
  this._pipeline = pipeline;
  this._errorUrls = js.createMap(true);
  this._appending = false;
  this._ownerQueue = null;
  /**
   * !#en This is a callback which will be invoked while an item flow out the pipeline.
   * You can pass the callback function in LoadingItems.create or set it later.
   * !#zh 这个回调函数将在 item 加载结束后被调用。你可以在构造时传递这个回调函数或者是在构造之后直接设置。
   * @method onProgress
   * @param {Number} completedCount The number of the items that are already completed.
   * @param {Number} totalCount The total number of the items.
   * @param {Object} item The latest item which flow out the pipeline.
   * @example
   *  loadingItems.onProgress = function (completedCount, totalCount, item) {
   *      var progress = (100 * completedCount / totalCount).toFixed(2);
   *      cc.log(progress + '%');
   *  }
   */

  this.onProgress = onProgress;
  /**
   * !#en This is a callback which will be invoked while all items is completed,
   * You can pass the callback function in LoadingItems.create or set it later.
   * !#zh 该函数将在加载队列全部完成时被调用。你可以在构造时传递这个回调函数或者是在构造之后直接设置。
   * @method onComplete
   * @param {Array} errors All errored urls will be stored in this array, if no error happened, then it will be null
   * @param {LoadingItems} items All items.
   * @example
   *  loadingItems.onComplete = function (errors, items) {
   *      if (error)
   *          cc.log('Completed with ' + errors.length + ' errors');
   *      else
   *          cc.log('Completed ' + items.totalCount + ' items');
   *  }
   */

  this.onComplete = onComplete;
  /**
   * !#en The map of all items.
   * !#zh 存储所有加载项的对象。
   * @property map
   * @type {Object}
   */

  this.map = js.createMap(true);
  /**
   * !#en The map of completed items.
   * !#zh 存储已经完成的加载项。
   * @property completed
   * @type {Object}
   */

  this.completed = {};
  /**
   * !#en Total count of all items.
   * !#zh 所有加载项的总数。
   * @property totalCount
   * @type {Number}
   */

  this.totalCount = 0;
  /**
   * !#en Total count of completed items.
   * !#zh 所有完成加载项的总数。
   * @property completedCount
   * @type {Number}
   */

  this.completedCount = 0;
  /**
   * !#en Activated or not.
   * !#zh 是否启用。
   * @property active
   * @type {Boolean}
   */

  if (this._pipeline) {
    this.active = true;
  } else {
    this.active = false;
  }

  if (urlList) {
    if (urlList.length > 0) {
      this.append(urlList);
    } else {
      this.allComplete();
    }
  }
};
/**
 * !#en The item states of the LoadingItems, its value could be LoadingItems.ItemState.WORKING | LoadingItems.ItemState.COMPLETET | LoadingItems.ItemState.ERROR
 * !#zh LoadingItems 队列中的加载项状态，状态的值可能是 LoadingItems.ItemState.WORKING | LoadingItems.ItemState.COMPLETET | LoadingItems.ItemState.ERROR
 * @enum LoadingItems.ItemState
 */

/**
 * @property {Number} WORKING
 */

/**
 * @property {Number} COMPLETET
 */

/**
 * @property {Number} ERROR
 */


LoadingItems.ItemState = new cc.Enum(ItemState);
/**
 * @class LoadingItems
 * @extends CallbacksInvoker
*/

/**
 * !#en The constructor function of LoadingItems, this will use recycled LoadingItems in the internal pool if possible.
 * You can pass onProgress and onComplete callbacks to visualize the loading process.
 * !#zh LoadingItems 的构造函数，这种构造方式会重用内部对象缓冲池中的 LoadingItems 队列，以尽量避免对象创建。
 * 你可以传递 onProgress 和 onComplete 回调函数来获知加载进度信息。
 * @method create
 * @static
 * @param {Pipeline} pipeline The pipeline to process the queue.
 * @param {Array} urlList The items array.
 * @param {Function} onProgress The progression callback, refer to {{#crossLink "LoadingItems.onProgress"}}{{/crossLink}}
 * @param {Function} onComplete The completion callback, refer to {{#crossLink "LoadingItems.onComplete"}}{{/crossLink}}
 * @return {LoadingItems} The LoadingItems queue object
 * @example
 *  cc.LoadingItems.create(cc.loader, ['a.png', 'b.plist'], function (completedCount, totalCount, item) {
 *      var progress = (100 * completedCount / totalCount).toFixed(2);
 *      cc.log(progress + '%');
 *  }, function (errors, items) {
 *      if (errors) {
 *          for (var i = 0; i < errors.length; ++i) {
 *              cc.log('Error url: ' + errors[i] + ', error: ' + items.getError(errors[i]));
 *          }
 *      }
 *      else {
 *          var result_a = items.getContent('a.png');
 *          // ...
 *      }
 *  })
 */

LoadingItems.create = function (pipeline, urlList, onProgress, onComplete) {
  if (onProgress === undefined) {
    if (typeof urlList === 'function') {
      onComplete = urlList;
      urlList = onProgress = null;
    }
  } else if (onComplete === undefined) {
    if (typeof urlList === 'function') {
      onComplete = onProgress;
      onProgress = urlList;
      urlList = null;
    } else {
      onComplete = onProgress;
      onProgress = null;
    }
  }

  var queue = _pool.pop();

  if (queue) {
    queue._pipeline = pipeline;
    queue.onProgress = onProgress;
    queue.onComplete = onComplete;
    _queues[queue._id] = queue;

    if (queue._pipeline) {
      queue.active = true;
    }

    if (urlList) {
      queue.append(urlList);
    }
  } else {
    queue = new LoadingItems(pipeline, urlList, onProgress, onComplete);
  }

  return queue;
};
/**
 * !#en Retrieve the LoadingItems queue object for an item.
 * !#zh 通过 item 对象获取它的 LoadingItems 队列。
 * @method getQueue
 * @static
 * @param {Object} item The item to query
 * @return {LoadingItems} The LoadingItems queue object
 */


LoadingItems.getQueue = function (item) {
  return item.queueId ? _queues[item.queueId] : null;
};
/**
 * !#en Complete an item in the LoadingItems queue, please do not call this method unless you know what's happening.
 * !#zh 通知 LoadingItems 队列一个 item 对象已完成，请不要调用这个函数，除非你知道自己在做什么。
 * @method itemComplete
 * @static
 * @param {Object} item The item which has completed
 */


LoadingItems.itemComplete = function (item) {
  var queue = _queues[item.queueId];

  if (queue) {
    // console.log('----- Completed by pipeline ' + item.id + ', rest: ' + (queue.totalCount - queue.completedCount-1));
    queue.itemComplete(item.id);
  }
};

LoadingItems.initQueueDeps = function (queue) {
  var dep = _queueDeps[queue._id];

  if (!dep) {
    dep = _queueDeps[queue._id] = {
      completed: [],
      deps: []
    };
  } else {
    dep.completed.length = 0;
    dep.deps.length = 0;
  }
};

LoadingItems.registerQueueDep = function (owner, depId) {
  var queueId = owner.queueId || owner;

  if (!queueId) {
    return false;
  }

  var queueDepList = _queueDeps[queueId]; // Owner is root queue

  if (queueDepList) {
    if (queueDepList.deps.indexOf(depId) === -1) {
      queueDepList.deps.push(depId);
    }
  } // Owner is an item in the intermediate queue
  else if (owner.id) {
      for (var id in _queueDeps) {
        var queue = _queueDeps[id]; // Found root queue

        if (queue.deps.indexOf(owner.id) !== -1) {
          if (queue.deps.indexOf(depId) === -1) {
            queue.deps.push(depId);
          }
        }
      }
    }
};

LoadingItems.finishDep = function (depId) {
  for (var id in _queueDeps) {
    var queue = _queueDeps[id]; // Found root queue

    if (queue.deps.indexOf(depId) !== -1 && queue.completed.indexOf(depId) === -1) {
      queue.completed.push(depId);
    }
  }
};

var proto = LoadingItems.prototype;
js.mixin(proto, CallbacksInvoker.prototype);
/**
 * !#en Add urls to the LoadingItems queue.
 * !#zh 向一个 LoadingItems 队列添加加载项。
 * @method append
 * @param {Array} urlList The url list to be appended, the url can be object or string
 * @return {Array} The accepted url list, some invalid items could be refused.
 */

proto.append = function (urlList, owner) {
  if (!this.active) {
    return [];
  }

  if (owner && !owner.deps) {
    owner.deps = [];
  }

  this._appending = true;
  var accepted = [],
      i,
      url,
      item;

  for (i = 0; i < urlList.length; ++i) {
    url = urlList[i]; // Already queued in another items queue, url is actually the item

    if (url.queueId && !this.map[url.id]) {
      this.map[url.id] = url; // Register item deps for circle reference check

      owner && owner.deps.push(url); // Queued and completed or Owner circle referenced by dependency

      if (url.complete || checkCircleReference(owner, url)) {
        this.totalCount++; // console.log('----- Completed already or circle referenced ' + url.id + ', rest: ' + (this.totalCount - this.completedCount-1));

        this.itemComplete(url.id);
        continue;
      } // Not completed yet, should wait it
      else {
          var self = this;
          var queue = _queues[url.queueId];

          if (queue) {
            this.totalCount++;
            LoadingItems.registerQueueDep(owner || this._id, url.id); // console.log('+++++ Waited ' + url.id);

            queue.addListener(url.id, function (item) {
              // console.log('----- Completed by waiting ' + item.id + ', rest: ' + (self.totalCount - self.completedCount-1));
              self.itemComplete(item.id);
            });
          }

          continue;
        }
    } // Queue new items


    if (isIdValid(url)) {
      item = createItem(url, this._id);
      var key = item.id; // No duplicated url

      if (!this.map[key]) {
        this.map[key] = item;
        this.totalCount++; // Register item deps for circle reference check

        owner && owner.deps.push(item);
        LoadingItems.registerQueueDep(owner || this._id, key);
        accepted.push(item); // console.log('+++++ Appended ' + item.id);
      }
    }
  }

  this._appending = false; // Manually complete

  if (this.completedCount === this.totalCount) {
    // console.log('===== All Completed ');
    this.allComplete();
  } else {
    this._pipeline.flowIn(accepted);
  }

  return accepted;
};

proto._childOnProgress = function (item) {
  if (this.onProgress) {
    var dep = _queueDeps[this._id];
    this.onProgress(dep ? dep.completed.length : this.completedCount, dep ? dep.deps.length : this.totalCount, item);
  }
};
/**
 * !#en Complete a LoadingItems queue, please do not call this method unless you know what's happening.
 * !#zh 完成一个 LoadingItems 队列，请不要调用这个函数，除非你知道自己在做什么。
 * @method allComplete
 */


proto.allComplete = function () {
  var errors = js.isEmptyObject(this._errorUrls) ? null : this._errorUrls;

  if (this.onComplete) {
    this.onComplete(errors, this);
  }
};
/**
 * !#en Check whether all items are completed.
 * !#zh 检查是否所有加载项都已经完成。
 * @method isCompleted
 * @return {Boolean}
 */


proto.isCompleted = function () {
  return this.completedCount >= this.totalCount;
};
/**
 * !#en Check whether an item is completed.
 * !#zh 通过 id 检查指定加载项是否已经加载完成。
 * @method isItemCompleted
 * @param {String} id The item's id.
 * @return {Boolean}
 */


proto.isItemCompleted = function (id) {
  return !!this.completed[id];
};
/**
 * !#en Check whether an item exists.
 * !#zh 通过 id 检查加载项是否存在。
 * @method exists
 * @param {String} id The item's id.
 * @return {Boolean}
 */


proto.exists = function (id) {
  return !!this.map[id];
};
/**
 * !#en Returns the content of an internal item.
 * !#zh 通过 id 获取指定对象的内容。
 * @method getContent
 * @param {String} id The item's id.
 * @return {Object}
 */


proto.getContent = function (id) {
  var item = this.map[id];
  var ret = null;

  if (item) {
    if (item.content) {
      ret = item.content;
    } else if (item.alias) {
      ret = item.alias.content;
    }
  }

  return ret;
};
/**
 * !#en Returns the error of an internal item.
 * !#zh 通过 id 获取指定对象的错误信息。
 * @method getError
 * @param {String} id The item's id.
 * @return {Object}
 */


proto.getError = function (id) {
  var item = this.map[id];
  var ret = null;

  if (item) {
    if (item.error) {
      ret = item.error;
    } else if (item.alias) {
      ret = item.alias.error;
    }
  }

  return ret;
};
/**
 * !#en Add a listener for an item, the callback will be invoked when the item is completed.
 * !#zh 监听加载项（通过 key 指定）的完成事件。
 * @method addListener
 * @param {String} key
 * @param {Function} callback - can be null
 * @param {Object} target - can be null
 * @return {Boolean} whether the key is new
 */


proto.addListener = CallbacksInvoker.prototype.on;
/**
 * !#en
 * Check if the specified key has any registered callback. 
 * If a callback is also specified, it will only return true if the callback is registered.
 * !#zh
 * 检查指定的加载项是否有完成事件监听器。
 * 如果同时还指定了一个回调方法，并且回调有注册，它只会返回 true。
 * @method hasListener
 * @param {String} key
 * @param {Function} [callback]
 * @param {Object} [target]
 * @return {Boolean}
 */

proto.hasListener = CallbacksInvoker.prototype.hasEventListener;
/**
 * !#en
 * Removes a listener. 
 * It will only remove when key, callback, target all match correctly.
 * !#zh
 * 移除指定加载项已经注册的完成事件监听器。
 * 只会删除 key, callback, target 均匹配的监听器。
 * @method remove
 * @param {String} key
 * @param {Function} callback
 * @param {Object} target
 * @return {Boolean} removed
 */

proto.removeListener = CallbacksInvoker.prototype.off;
/**
 * !#en
 * Removes all callbacks registered in a certain event
 * type or all callbacks registered with a certain target.
 * !#zh 删除指定目标的所有完成事件监听器。
 * @method removeAllListeners
 * @param {String|Object} key - The event key to be removed or the target to be removed
 */

proto.removeAllListeners = CallbacksInvoker.prototype.removeAll;
/**
 * !#en Remove an item, can only remove completed item, ongoing item can not be removed.
 * !#zh 移除加载项，这里只会移除已经完成的加载项，正在进行的加载项将不能被删除。
 * @param {String} url
 */

proto.removeItem = function (url) {
  var item = this.map[url];
  if (!item) return;
  if (!this.completed[item.alias || url]) return;
  delete this.completed[url];
  delete this.map[url];

  if (item.alias) {
    delete this.completed[item.alias.id];
    delete this.map[item.alias.id];
  }

  this.completedCount--;
  this.totalCount--;
};
/**
 * !#en Complete an item in the LoadingItems queue, please do not call this method unless you know what's happening.
 * !#zh 通知 LoadingItems 队列一个 item 对象已完成，请不要调用这个函数，除非你知道自己在做什么。
 * @method itemComplete
 * @param {String} id The item url
 */


proto.itemComplete = function (id) {
  var item = this.map[id];

  if (!item) {
    return;
  } // Register or unregister errors


  var errorListId = id in this._errorUrls;

  if (item.error instanceof Error || js.isString(item.error)) {
    this._errorUrls[id] = item.error;
  } else if (item.error) {
    js.mixin(this._errorUrls, item.error);
  } else if (!item.error && errorListId) {
    delete this._errorUrls[id];
  }

  this.completed[id] = item;
  this.completedCount++;
  LoadingItems.finishDep(item.id);

  if (this.onProgress) {
    var dep = _queueDeps[this._id];
    this.onProgress(dep ? dep.completed.length : this.completedCount, dep ? dep.deps.length : this.totalCount, item);
  }

  this.emit(id, item);
  this.removeAll(id); // All completed

  if (!this._appending && this.completedCount >= this.totalCount) {
    // console.log('===== All Completed ');
    this.allComplete();
  }
};
/**
 * !#en Destroy the LoadingItems queue, the queue object won't be garbage collected, it will be recycled, so every after destroy is not reliable.
 * !#zh 销毁一个 LoadingItems 队列，这个队列对象会被内部缓冲池回收，所以销毁后的所有内部信息都是不可依赖的。
 * @method destroy
 */


proto.destroy = function () {
  this.active = false;
  this._appending = false;
  this._pipeline = null;
  this._ownerQueue = null;
  js.clear(this._errorUrls);
  this.onProgress = null;
  this.onComplete = null;
  this.map = js.createMap(true);
  this.completed = {};
  this.totalCount = 0;
  this.completedCount = 0; // Reinitialize CallbacksInvoker, generate three new objects, could be improved

  CallbacksInvoker.call(this);

  if (_queueDeps[this._id]) {
    _queueDeps[this._id].completed.length = 0;
    _queueDeps[this._id].deps.length = 0;
  }

  delete _queues[this._id];
  delete _queueDeps[this._id];

  if (_pool.indexOf(this) === -1 && _pool.length < _POOL_MAX_LENGTH) {
    _pool.push(this);
  }
};

cc.LoadingItems = module.exports = LoadingItems;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvYWRpbmctaXRlbXMuanMiXSwibmFtZXMiOlsiQ2FsbGJhY2tzSW52b2tlciIsInJlcXVpcmUiLCJqcyIsIl9xaWQiLCJNYXRoIiwicmFuZG9tIiwiX3F1ZXVlcyIsImNyZWF0ZU1hcCIsIl9wb29sIiwiX1BPT0xfTUFYX0xFTkdUSCIsIkl0ZW1TdGF0ZSIsIldPUktJTkciLCJDT01QTEVURSIsIkVSUk9SIiwiX3F1ZXVlRGVwcyIsImlzSWRWYWxpZCIsImlkIiwicmVhbElkIiwidXJsIiwiX3BhcnNlVXJsUGFyYW0iLCJ1bmRlZmluZWQiLCJzcGxpdCIsInVybFBhcmFtIiwicXVlcmllcyIsImZvckVhY2giLCJpdGVtIiwiaXRlbVNwbGl0IiwiY3JlYXRlSXRlbSIsInF1ZXVlSWQiLCJyZXN1bHQiLCJyYXdVcmwiLCJ0eXBlIiwiZXJyb3IiLCJjb250ZW50IiwiY29tcGxldGUiLCJzdGF0ZXMiLCJkZXBzIiwibWl4aW4iLCJza2lwcyIsImkiLCJsZW5ndGgiLCJza2lwIiwiY2MiLCJwYXRoIiwiZXh0bmFtZSIsInRvTG93ZXJDYXNlIiwic3Vic3RyIiwiY2hlY2tlZElkcyIsImNoZWNrQ2lyY2xlUmVmZXJlbmNlIiwib3duZXIiLCJyZWN1cnNpdmVDYWxsIiwicHVzaCIsInN1YkRlcCIsImluZGV4T2YiLCJMb2FkaW5nSXRlbXMiLCJwaXBlbGluZSIsInVybExpc3QiLCJvblByb2dyZXNzIiwib25Db21wbGV0ZSIsImNhbGwiLCJfaWQiLCJfcGlwZWxpbmUiLCJfZXJyb3JVcmxzIiwiX2FwcGVuZGluZyIsIl9vd25lclF1ZXVlIiwibWFwIiwiY29tcGxldGVkIiwidG90YWxDb3VudCIsImNvbXBsZXRlZENvdW50IiwiYWN0aXZlIiwiYXBwZW5kIiwiYWxsQ29tcGxldGUiLCJFbnVtIiwiY3JlYXRlIiwicXVldWUiLCJwb3AiLCJnZXRRdWV1ZSIsIml0ZW1Db21wbGV0ZSIsImluaXRRdWV1ZURlcHMiLCJkZXAiLCJyZWdpc3RlclF1ZXVlRGVwIiwiZGVwSWQiLCJxdWV1ZURlcExpc3QiLCJmaW5pc2hEZXAiLCJwcm90byIsInByb3RvdHlwZSIsImFjY2VwdGVkIiwic2VsZiIsImFkZExpc3RlbmVyIiwia2V5IiwiZmxvd0luIiwiX2NoaWxkT25Qcm9ncmVzcyIsImVycm9ycyIsImlzRW1wdHlPYmplY3QiLCJpc0NvbXBsZXRlZCIsImlzSXRlbUNvbXBsZXRlZCIsImV4aXN0cyIsImdldENvbnRlbnQiLCJyZXQiLCJhbGlhcyIsImdldEVycm9yIiwib24iLCJoYXNMaXN0ZW5lciIsImhhc0V2ZW50TGlzdGVuZXIiLCJyZW1vdmVMaXN0ZW5lciIsIm9mZiIsInJlbW92ZUFsbExpc3RlbmVycyIsInJlbW92ZUFsbCIsInJlbW92ZUl0ZW0iLCJlcnJvckxpc3RJZCIsIkVycm9yIiwiaXNTdHJpbmciLCJlbWl0IiwiZGVzdHJveSIsImNsZWFyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLElBQUlBLGdCQUFnQixHQUFHQyxPQUFPLENBQUMsK0JBQUQsQ0FBOUI7O0FBQ0FBLE9BQU8sQ0FBQyxpQkFBRCxDQUFQOztBQUNBLElBQUlDLEVBQUUsR0FBR0QsT0FBTyxDQUFDLGdCQUFELENBQWhCOztBQUVBLElBQUlFLElBQUksR0FBSSxJQUFHQyxJQUFJLENBQUNDLE1BQUwsS0FBYyxHQUE3Qjs7QUFDQSxJQUFJQyxPQUFPLEdBQUdKLEVBQUUsQ0FBQ0ssU0FBSCxDQUFhLElBQWIsQ0FBZDs7QUFDQSxJQUFJQyxLQUFLLEdBQUcsRUFBWjtBQUNBLElBQUlDLGdCQUFnQixHQUFHLEVBQXZCO0FBRUEsSUFBSUMsU0FBUyxHQUFHO0FBQ1pDLEVBQUFBLE9BQU8sRUFBRSxDQURHO0FBRVpDLEVBQUFBLFFBQVEsRUFBRSxDQUZFO0FBR1pDLEVBQUFBLEtBQUssRUFBRTtBQUhLLENBQWhCOztBQU1BLElBQUlDLFVBQVUsR0FBR1osRUFBRSxDQUFDSyxTQUFILENBQWEsSUFB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Q2dILEtBQUgsQ0FBUyxLQUFLcEQsVUFBZDtBQUNBLE9BQUtMLFVBQUwsR0FBa0IsSUFBbEI7QUFDQSxPQUFLQyxVQUFMLEdBQWtCLElBQWxCO0FBRUEsT0FBS08sR0FBTCxHQUFXL0QsRUFBRSxDQUFDSyxTQUFILENBQWEsSUFBYixDQUFYO0FBQ0EsT0FBSzJELFNBQUwsR0FBaUIsRUFBakI7QUFFQSxPQUFLQyxVQUFMLEdBQWtCLENBQWxCO0FBQ0EsT0FBS0MsY0FBTCxHQUFzQixDQUF0QixDQWJ3QixDQWV4Qjs7QUFDQXBFLEVBQUFBLGdCQUFnQixDQUFDMkQsSUFBakIsQ0FBc0IsSUFBdEI7O0FBRUEsTUFBSTdDLFVBQVUsQ0FBQyxLQUFLOEMsR0FBTixDQUFkLEVBQTBCO0FBQ3RCOUMsSUFBQUEsVUFBVSxDQUFDLEtBQUs4QyxHQUFOLENBQVYsQ0FBcUJNLFNBQXJCLENBQStCMUIsTUFBL0IsR0FBd0MsQ0FBeEM7QUFDQTFCLElBQUFBLFVBQVUsQ0FBQyxLQUFLOEMsR0FBTixDQUFWLENBQXFCeEIsSUFBckIsQ0FBMEJJLE1BQTFCLEdBQW1DLENBQW5DO0FBQ0g7O0FBQ0QsU0FBT2xDLE9BQU8sQ0FBQyxLQUFLc0QsR0FBTixDQUFkO0FBQ0EsU0FBTzlDLFVBQVUsQ0FBQyxLQUFLOEMsR0FBTixDQUFqQjs7QUFFQSxNQUFJcEQsS0FBSyxDQUFDNkMsT0FBTixDQUFjLElBQWQsTUFBd0IsQ0FBQyxDQUF6QixJQUE4QjdDLEtBQUssQ0FBQ2dDLE1BQU4sR0FBZS9CLGdCQUFqRCxFQUFtRTtBQUMvREQsSUFBQUEsS0FBSyxDQUFDMkMsSUFBTixDQUFXLElBQVg7QUFDSDtBQUNKLENBNUJEOztBQThCQVQsRUFBRSxDQUFDWSxZQUFILEdBQWtCNkQsTUFBTSxDQUFDQyxPQUFQLEdBQWlCOUQsWUFBbkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnZhciBDYWxsYmFja3NJbnZva2VyID0gcmVxdWlyZSgnLi4vcGxhdGZvcm0vY2FsbGJhY2tzLWludm9rZXInKTtcbnJlcXVpcmUoJy4uL3V0aWxzL0NDUGF0aCcpO1xudmFyIGpzID0gcmVxdWlyZSgnLi4vcGxhdGZvcm0vanMnKTtcblxudmFyIF9xaWQgPSAoMHwoTWF0aC5yYW5kb20oKSo5OTgpKTtcbnZhciBfcXVldWVzID0ganMuY3JlYXRlTWFwKHRydWUpO1xudmFyIF9wb29sID0gW107XG52YXIgX1BPT0xfTUFYX0xFTkdUSCA9IDEwO1xuXG52YXIgSXRlbVN0YXRlID0ge1xuICAgIFdPUktJTkc6IDEsXG4gICAgQ09NUExFVEU6IDIsXG4gICAgRVJST1I6IDNcbn07XG5cbnZhciBfcXVldWVEZXBzID0ganMuY3JlYXRlTWFwKHRydWUpO1xuXG5mdW5jdGlvbiBpc0lkVmFsaWQgKGlkKSB7XG4gICAgdmFyIHJlYWxJZCA9IGlkLnVybCB8fCBpZDtcbiAgICByZXR1cm4gKHR5cGVvZiByZWFsSWQgPT09ICdzdHJpbmcnKTtcbn1cblxuZnVuY3Rpb24gX3BhcnNlVXJsUGFyYW0gKHVybCkge1xuICAgIGlmICghdXJsKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIHZhciBzcGxpdCA9IHVybC5zcGxpdCgnPycpO1xuICAgIGlmICghc3BsaXQgfHwgIXNwbGl0WzBdIHx8ICFzcGxpdFsxXSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB2YXIgdXJsUGFyYW0gPSB7fTtcbiAgICB2YXIgcXVlcmllcyA9IHNwbGl0WzFdLnNwbGl0KCcmJyk7XG4gICAgcXVlcmllcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHZhciBpdGVtU3BsaXQgPSBpdGVtLnNwbGl0KCc9Jyk7XG4gICAgICAgIHVybFBhcmFtW2l0ZW1TcGxpdFswXV0gPSBpdGVtU3BsaXRbMV07XG4gICAgfSk7XG4gICAgcmV0dXJuIHVybFBhcmFtO1xufVxuZnVuY3Rpb24gY3JlYXRlSXRlbSAoaWQsIHF1ZXVlSWQpIHtcbiAgICB2YXIgdXJsID0gKHR5cGVvZiBpZCA9PT0gJ29iamVjdCcpID8gaWQudXJsIDogaWQ7XG4gICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgcXVldWVJZDogcXVldWVJZCxcbiAgICAgICAgaWQ6IHVybCxcbiAgICAgICAgdXJsOiB1cmwsIC8vIHJlYWwgZG93bmxvYWQgdXJsLCBtYXliZSBjaGFuZ2VkXG4gICAgICAgIHJhd1VybDogdW5kZWZpbmVkLCAvLyB1cmwgdXNlZCBpbiBzY3JpcHRzXG4gICAgICAgIHVybFBhcmFtOiBfcGFyc2VVcmxQYXJhbSh1cmwpLFxuICAgICAgICB0eXBlOiBcIlwiLFxuICAgICAgICBlcnJvcjogbnVsbCxcbiAgICAgICAgY29udGVudDogbnVsbCxcbiAgICAgICAgY29tcGxldGU6IGZhbHNlLFxuICAgICAgICBzdGF0ZXM6IHt9LFxuICAgICAgICBkZXBzOiBudWxsXG4gICAgfTtcblxuICAgIGlmICh0eXBlb2YgaWQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGpzLm1peGluKHJlc3VsdCwgaWQpO1xuICAgICAgICBpZiAoaWQuc2tpcHMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaWQuc2tpcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgc2tpcCA9IGlkLnNraXBzW2ldO1xuICAgICAgICAgICAgICAgIHJlc3VsdC5zdGF0ZXNbc2tpcF0gPSBJdGVtU3RhdGUuQ09NUExFVEU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0LnJhd1VybCA9IHJlc3VsdC51cmw7XG4gICAgaWYgKHVybCAmJiAhcmVzdWx0LnR5cGUpIHtcbiAgICAgICAgcmVzdWx0LnR5cGUgPSBjYy5wYXRoLmV4dG5hbWUodXJsKS50b0xvd2VyQ2FzZSgpLnN1YnN0cigxKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxudmFyIGNoZWNrZWRJZHMgPSBbXTtcbmZ1bmN0aW9uIGNoZWNrQ2lyY2xlUmVmZXJlbmNlKG93bmVyLCBpdGVtLCByZWN1cnNpdmVDYWxsKSB7XG4gICAgaWYgKCFvd25lciB8fCAhaXRlbSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBmYWxzZTtcbiAgICBjaGVja2VkSWRzLnB1c2goaXRlbS5pZCk7XG4gICAgaWYgKGl0ZW0uZGVwcykge1xuICAgICAgICB2YXIgaSwgZGVwcyA9IGl0ZW0uZGVwcywgc3ViRGVwO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZGVwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgc3ViRGVwID0gZGVwc1tpXTtcbiAgICAgICAgICAgIGlmIChzdWJEZXAuaWQgPT09IG93bmVyLmlkKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrZWRJZHMuaW5kZXhPZihzdWJEZXAuaWQpID49IDApIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHN1YkRlcC5kZXBzICYmIGNoZWNrQ2lyY2xlUmVmZXJlbmNlKG93bmVyLCBzdWJEZXAsIHRydWUpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoIXJlY3Vyc2l2ZUNhbGwpIHtcbiAgICAgICAgY2hlY2tlZElkcy5sZW5ndGggPSAwO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqICEjZW5cbiAqIExvYWRpbmdJdGVtcyBpcyB0aGUgcXVldWUgb2YgaXRlbXMgd2hpY2ggY2FuIGZsb3cgdGhlbSBpbnRvIHRoZSBsb2FkaW5nIHBpcGVsaW5lLjxici8+XG4gKiBQbGVhc2UgZG9uJ3QgY29uc3RydWN0IGl0IGRpcmVjdGx5LCB1c2Uge3sjY3Jvc3NMaW5rIFwiTG9hZGluZ0l0ZW1zLmNyZWF0ZVwifX1jYy5Mb2FkaW5nSXRlbXMuY3JlYXRle3svY3Jvc3NMaW5rfX0gaW5zdGVhZCwgYmVjYXVzZSB3ZSB1c2UgYW4gaW50ZXJuYWwgcG9vbCB0byByZWN5Y2xlIHRoZSBxdWV1ZXMuPGJyLz5cbiAqIEl0IGhvbGQgYSBtYXAgb2YgaXRlbXMsIGVhY2ggZW50cnkgaW4gdGhlIG1hcCBpcyBhIHVybCB0byBvYmplY3Qga2V5IHZhbHVlIHBhaXIuPGJyLz5cbiAqIEVhY2ggaXRlbSBhbHdheXMgY29udGFpbnMgdGhlIGZvbGxvd2luZyBwcm9wZXJ0eTo8YnIvPlxuICogLSBpZDogVGhlIGlkZW50aWZpY2F0aW9uIG9mIHRoZSBpdGVtLCB1c3VhbGx5IGl0J3MgaWRlbnRpY2FsIHRvIHVybDxici8+XG4gKiAtIHVybDogVGhlIHVybCA8YnIvPlxuICogLSB0eXBlOiBUaGUgdHlwZSwgaXQncyB0aGUgZXh0ZW5zaW9uIG5hbWUgb2YgdGhlIHVybCBieSBkZWZhdWx0LCBjb3VsZCBiZSBzcGVjaWZpZWQgbWFudWFsbHkgdG9vLjxici8+XG4gKiAtIGVycm9yOiBUaGUgZXJyb3IgaGFwcGVuZWQgaW4gcGlwZWxpbmUgd2lsbCBiZSBzdG9yZWQgaW4gdGhpcyBwcm9wZXJ0eS48YnIvPlxuICogLSBjb250ZW50OiBUaGUgY29udGVudCBwcm9jZXNzZWQgYnkgdGhlIHBpcGVsaW5lLCB0aGUgZmluYWwgcmVzdWx0IHdpbGwgYWxzbyBiZSBzdG9yZWQgaW4gdGhpcyBwcm9wZXJ0eS48YnIvPlxuICogLSBjb21wbGV0ZTogVGhlIGZsYWcgaW5kaWNhdGUgd2hldGhlciB0aGUgaXRlbSBpcyBjb21wbGV0ZWQgYnkgdGhlIHBpcGVsaW5lLjxici8+XG4gKiAtIHN0YXRlczogQW4gb2JqZWN0IHN0b3JlcyB0aGUgc3RhdGVzIG9mIGVhY2ggcGlwZSB0aGUgaXRlbSBnbyB0aHJvdWdoLCB0aGUgc3RhdGUgY2FuIGJlOiBQaXBlbGluZS5JdGVtU3RhdGUuV09SS0lORyB8IFBpcGVsaW5lLkl0ZW1TdGF0ZS5FUlJPUiB8IFBpcGVsaW5lLkl0ZW1TdGF0ZS5DT01QTEVURTxici8+XG4gKiA8YnIvPlxuICogSXRlbSBjYW4gaG9sZCBvdGhlciBjdXN0b20gcHJvcGVydGllcy48YnIvPlxuICogRWFjaCBMb2FkaW5nSXRlbXMgb2JqZWN0IHdpbGwgYmUgZGVzdHJveWVkIGZvciByZWN5Y2xlIGFmdGVyIG9uQ29tcGxldGUgY2FsbGJhY2s8YnIvPlxuICogU28gcGxlYXNlIGRvbid0IGhvbGQgaXRzIHJlZmVyZW5jZSBmb3IgbGF0ZXIgdXNhZ2UsIHlvdSBjYW4gY29weSBwcm9wZXJ0aWVzIGluIGl0IHRob3VnaC5cbiAqICEjemhcbiAqIExvYWRpbmdJdGVtcyDmmK/kuIDkuKrliqDovb3lr7nosaHpmJ/liJfvvIzlj6/ku6XnlKjmnaXovpPpgIHliqDovb3lr7nosaHliLDliqDovb3nrqHnur/kuK3jgII8YnIvPlxuICog6K+35LiN6KaB55u05o6l5L2/55SoIG5ldyDmnoTpgKDov5nkuKrnsbvnmoTlr7nosaHvvIzkvaDlj6/ku6Xkvb/nlKgge3sjY3Jvc3NMaW5rIFwiTG9hZGluZ0l0ZW1zLmNyZWF0ZVwifX1jYy5Mb2FkaW5nSXRlbXMuY3JlYXRle3svY3Jvc3NMaW5rfX0g5p2l5Yib5bu65LiA5Liq5paw55qE5Yqg6L296Zif5YiX77yM6L+Z5qC35Y+v5Lul5YWB6K645oiR5Lus55qE5YaF6YOo5a+56LGh5rGg5Zue5pS25bm26YeN5Yip55So5Yqg6L296Zif5YiX44CCXG4gKiDlroPmnInkuIDkuKogbWFwIOWxnuaAp+eUqOadpeWtmOaUvuWKoOi9vemhue+8jOWcqCBtYXAg5a+56LGh5Lit5LulIHVybCDkuLoga2V5IOWAvOOAgjxici8+XG4gKiDmr4/kuKrlr7nosaHpg73kvJrljIXlkKvkuIvliJflsZ7mgKfvvJo8YnIvPlxuICogLSBpZO+8muivpeWvueixoeeahOagh+ivhu+8jOmAmuW4uOS4jiB1cmwg55u45ZCM44CCPGJyLz5cbiAqIC0gdXJs77ya6Lev5b6EIDxici8+XG4gKiAtIHR5cGU6IOexu+Wei++8jOWug+i/meaYr+m7mOiupOeahCBVUkwg55qE5omp5bGV5ZCN77yM5Y+v5Lul5omL5Yqo5oyH5a6a6LWL5YC844CCPGJyLz5cbiAqIC0gZXJyb3LvvJpwaXBlbGluZSDkuK3lj5HnlJ/nmoTplJnor6/lsIbooqvkv53lrZjlnKjov5nkuKrlsZ7mgKfkuK3jgII8YnIvPlxuICogLSBjb250ZW50OiBwaXBlbGluZSDkuK3lpITnkIbnmoTkuLTml7bnu5PmnpzvvIzmnIDnu4jnmoTnu5PmnpzkuZ/lsIbooqvlrZjlgqjlnKjov5nkuKrlsZ7mgKfkuK3jgII8YnIvPlxuICogLSBjb21wbGV0Ze+8muivpeagh+W/l+ihqOaYjuivpeWvueixoeaYr+WQpumAmui/hyBwaXBlbGluZSDlrozmiJDjgII8YnIvPlxuICogLSBzdGF0ZXPvvJror6Xlr7nosaHlrZjlgqjmr4/kuKrnrqHpgZPkuK3lr7nosaHnu4/ljobnmoTnirbmgIHvvIznirbmgIHlj6/ku6XmmK8gUGlwZWxpbmUuSXRlbVN0YXRlLldPUktJTkcgfCBQaXBlbGluZS5JdGVtU3RhdGUuRVJST1IgfCBQaXBlbGluZS5JdGVtU3RhdGUuQ09NUExFVEU8YnIvPlxuICogPGJyLz5cbiAqIOWvueixoeWPr+Wuuee6s+WFtuS7luiHquWumuS5ieWxnuaAp+OAgjxici8+XG4gKiDmr4/kuKogTG9hZGluZ0l0ZW1zIOWvueixoemDveS8muWcqCBvbkNvbXBsZXRlIOWbnuiwg+S5i+WQjuiiq+mUgOavge+8jOaJgOS7peivt+S4jeimgeaMgeacieWug+eahOW8leeUqOW5tuWcqOe7k+adn+Wbnuiwg+S5i+WQjuS+nei1luWug+eahOWGheWuueaJp+ihjOS7u+S9lemAu+i+ke+8jOaciei/meenjemcgOaxgueahOivneS9oOWPr+S7peaPkOWJjeWkjeWItuWug+eahOWGheWuueOAglxuICpcbiAqIEBjbGFzcyBMb2FkaW5nSXRlbXNcbiAqIEBleHRlbmRzIENhbGxiYWNrc0ludm9rZXJcbiAqL1xudmFyIExvYWRpbmdJdGVtcyA9IGZ1bmN0aW9uIChwaXBlbGluZSwgdXJsTGlzdCwgb25Qcm9ncmVzcywgb25Db21wbGV0ZSkge1xuICAgIENhbGxiYWNrc0ludm9rZXIuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMuX2lkID0gKytfcWlkO1xuXG4gICAgX3F1ZXVlc1t0aGlzLl9pZF0gPSB0aGlzO1xuXG4gICAgdGhpcy5fcGlwZWxpbmUgPSBwaXBlbGluZTtcblxuICAgIHRoaXMuX2Vycm9yVXJscyA9IGpzLmNyZWF0ZU1hcCh0cnVlKTtcblxuICAgIHRoaXMuX2FwcGVuZGluZyA9IGZhbHNlO1xuXG4gICAgdGhpcy5fb3duZXJRdWV1ZSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoaXMgaXMgYSBjYWxsYmFjayB3aGljaCB3aWxsIGJlIGludm9rZWQgd2hpbGUgYW4gaXRlbSBmbG93IG91dCB0aGUgcGlwZWxpbmUuXG4gICAgICogWW91IGNhbiBwYXNzIHRoZSBjYWxsYmFjayBmdW5jdGlvbiBpbiBMb2FkaW5nSXRlbXMuY3JlYXRlIG9yIHNldCBpdCBsYXRlci5cbiAgICAgKiAhI3poIOi/meS4quWbnuiwg+WHveaVsOWwhuWcqCBpdGVtIOWKoOi9vee7k+adn+WQjuiiq+iwg+eUqOOAguS9oOWPr+S7peWcqOaehOmAoOaXtuS8oOmAkui/meS4quWbnuiwg+WHveaVsOaIluiAheaYr+WcqOaehOmAoOS5i+WQjuebtOaOpeiuvue9ruOAglxuICAgICAqIEBtZXRob2Qgb25Qcm9ncmVzc1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBjb21wbGV0ZWRDb3VudCBUaGUgbnVtYmVyIG9mIHRoZSBpdGVtcyB0aGF0IGFyZSBhbHJlYWR5IGNvbXBsZXRlZC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdG90YWxDb3VudCBUaGUgdG90YWwgbnVtYmVyIG9mIHRoZSBpdGVtcy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaXRlbSBUaGUgbGF0ZXN0IGl0ZW0gd2hpY2ggZmxvdyBvdXQgdGhlIHBpcGVsaW5lLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogIGxvYWRpbmdJdGVtcy5vblByb2dyZXNzID0gZnVuY3Rpb24gKGNvbXBsZXRlZENvdW50LCB0b3RhbENvdW50LCBpdGVtKSB7XG4gICAgICogICAgICB2YXIgcHJvZ3Jlc3MgPSAoMTAwICogY29tcGxldGVkQ291bnQgLyB0b3RhbENvdW50KS50b0ZpeGVkKDIpO1xuICAgICAqICAgICAgY2MubG9nKHByb2dyZXNzICsgJyUnKTtcbiAgICAgKiAgfVxuICAgICAqL1xuICAgIHRoaXMub25Qcm9ncmVzcyA9IG9uUHJvZ3Jlc3M7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoaXMgaXMgYSBjYWxsYmFjayB3aGljaCB3aWxsIGJlIGludm9rZWQgd2hpbGUgYWxsIGl0ZW1zIGlzIGNvbXBsZXRlZCxcbiAgICAgKiBZb3UgY2FuIHBhc3MgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIGluIExvYWRpbmdJdGVtcy5jcmVhdGUgb3Igc2V0IGl0IGxhdGVyLlxuICAgICAqICEjemgg6K+l5Ye95pWw5bCG5Zyo5Yqg6L296Zif5YiX5YWo6YOo5a6M5oiQ5pe26KKr6LCD55So44CC5L2g5Y+v5Lul5Zyo5p6E6YCg5pe25Lyg6YCS6L+Z5Liq5Zue6LCD5Ye95pWw5oiW6ICF5piv5Zyo5p6E6YCg5LmL5ZCO55u05o6l6K6+572u44CCXG4gICAgICogQG1ldGhvZCBvbkNvbXBsZXRlXG4gICAgICogQHBhcmFtIHtBcnJheX0gZXJyb3JzIEFsbCBlcnJvcmVkIHVybHMgd2lsbCBiZSBzdG9yZWQgaW4gdGhpcyBhcnJheSwgaWYgbm8gZXJyb3IgaGFwcGVuZWQsIHRoZW4gaXQgd2lsbCBiZSBudWxsXG4gICAgICogQHBhcmFtIHtMb2FkaW5nSXRlbXN9IGl0ZW1zIEFsbCBpdGVtcy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqICBsb2FkaW5nSXRlbXMub25Db21wbGV0ZSA9IGZ1bmN0aW9uIChlcnJvcnMsIGl0ZW1zKSB7XG4gICAgICogICAgICBpZiAoZXJyb3IpXG4gICAgICogICAgICAgICAgY2MubG9nKCdDb21wbGV0ZWQgd2l0aCAnICsgZXJyb3JzLmxlbmd0aCArICcgZXJyb3JzJyk7XG4gICAgICogICAgICBlbHNlXG4gICAgICogICAgICAgICAgY2MubG9nKCdDb21wbGV0ZWQgJyArIGl0ZW1zLnRvdGFsQ291bnQgKyAnIGl0ZW1zJyk7XG4gICAgICogIH1cbiAgICAgKi9cbiAgICB0aGlzLm9uQ29tcGxldGUgPSBvbkNvbXBsZXRlO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgbWFwIG9mIGFsbCBpdGVtcy5cbiAgICAgKiAhI3poIOWtmOWCqOaJgOacieWKoOi9vemhueeahOWvueixoeOAglxuICAgICAqIEBwcm9wZXJ0eSBtYXBcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMubWFwID0ganMuY3JlYXRlTWFwKHRydWUpO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgbWFwIG9mIGNvbXBsZXRlZCBpdGVtcy5cbiAgICAgKiAhI3poIOWtmOWCqOW3sue7j+WujOaIkOeahOWKoOi9vemhueOAglxuICAgICAqIEBwcm9wZXJ0eSBjb21wbGV0ZWRcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuY29tcGxldGVkID0ge307XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRvdGFsIGNvdW50IG9mIGFsbCBpdGVtcy5cbiAgICAgKiAhI3poIOaJgOacieWKoOi9vemhueeahOaAu+aVsOOAglxuICAgICAqIEBwcm9wZXJ0eSB0b3RhbENvdW50XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnRvdGFsQ291bnQgPSAwO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBUb3RhbCBjb3VudCBvZiBjb21wbGV0ZWQgaXRlbXMuXG4gICAgICogISN6aCDmiYDmnInlrozmiJDliqDovb3pobnnmoTmgLvmlbDjgIJcbiAgICAgKiBAcHJvcGVydHkgY29tcGxldGVkQ291bnRcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuY29tcGxldGVkQ291bnQgPSAwO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBBY3RpdmF0ZWQgb3Igbm90LlxuICAgICAqICEjemgg5piv5ZCm5ZCv55So44CCXG4gICAgICogQHByb3BlcnR5IGFjdGl2ZVxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqL1xuICAgIGlmICh0aGlzLl9waXBlbGluZSkge1xuICAgICAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh1cmxMaXN0KSB7XG4gICAgICAgIGlmICh1cmxMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kKHVybExpc3QpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hbGxDb21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLyoqXG4gKiAhI2VuIFRoZSBpdGVtIHN0YXRlcyBvZiB0aGUgTG9hZGluZ0l0ZW1zLCBpdHMgdmFsdWUgY291bGQgYmUgTG9hZGluZ0l0ZW1zLkl0ZW1TdGF0ZS5XT1JLSU5HIHwgTG9hZGluZ0l0ZW1zLkl0ZW1TdGF0ZS5DT01QTEVURVQgfCBMb2FkaW5nSXRlbXMuSXRlbVN0YXRlLkVSUk9SXG4gKiAhI3poIExvYWRpbmdJdGVtcyDpmJ/liJfkuK3nmoTliqDovb3pobnnirbmgIHvvIznirbmgIHnmoTlgLzlj6/og73mmK8gTG9hZGluZ0l0ZW1zLkl0ZW1TdGF0ZS5XT1JLSU5HIHwgTG9hZGluZ0l0ZW1zLkl0ZW1TdGF0ZS5DT01QTEVURVQgfCBMb2FkaW5nSXRlbXMuSXRlbVN0YXRlLkVSUk9SXG4gKiBAZW51bSBMb2FkaW5nSXRlbXMuSXRlbVN0YXRlXG4gKi9cblxuLyoqXG4gKiBAcHJvcGVydHkge051bWJlcn0gV09SS0lOR1xuICovXG5cbi8qKlxuICogQHByb3BlcnR5IHtOdW1iZXJ9IENPTVBMRVRFVFxuICovXG5cbi8qKlxuICogQHByb3BlcnR5IHtOdW1iZXJ9IEVSUk9SXG4gKi9cblxuTG9hZGluZ0l0ZW1zLkl0ZW1TdGF0ZSA9IG5ldyBjYy5FbnVtKEl0ZW1TdGF0ZSk7XG5cbi8qKlxuICogQGNsYXNzIExvYWRpbmdJdGVtc1xuICogQGV4dGVuZHMgQ2FsbGJhY2tzSW52b2tlclxuKi9cblxuLyoqXG4gKiAhI2VuIFRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvbiBvZiBMb2FkaW5nSXRlbXMsIHRoaXMgd2lsbCB1c2UgcmVjeWNsZWQgTG9hZGluZ0l0ZW1zIGluIHRoZSBpbnRlcm5hbCBwb29sIGlmIHBvc3NpYmxlLlxuICogWW91IGNhbiBwYXNzIG9uUHJvZ3Jlc3MgYW5kIG9uQ29tcGxldGUgY2FsbGJhY2tzIHRvIHZpc3VhbGl6ZSB0aGUgbG9hZGluZyBwcm9jZXNzLlxuICogISN6aCBMb2FkaW5nSXRlbXMg55qE5p6E6YCg5Ye95pWw77yM6L+Z56eN5p6E6YCg5pa55byP5Lya6YeN55So5YaF6YOo5a+56LGh57yT5Yay5rGg5Lit55qEIExvYWRpbmdJdGVtcyDpmJ/liJfvvIzku6XlsL3ph4/pgb/lhY3lr7nosaHliJvlu7rjgIJcbiAqIOS9oOWPr+S7peS8oOmAkiBvblByb2dyZXNzIOWSjCBvbkNvbXBsZXRlIOWbnuiwg+WHveaVsOadpeiOt+efpeWKoOi9vei/m+W6puS/oeaBr+OAglxuICogQG1ldGhvZCBjcmVhdGVcbiAqIEBzdGF0aWNcbiAqIEBwYXJhbSB7UGlwZWxpbmV9IHBpcGVsaW5lIFRoZSBwaXBlbGluZSB0byBwcm9jZXNzIHRoZSBxdWV1ZS5cbiAqIEBwYXJhbSB7QXJyYXl9IHVybExpc3QgVGhlIGl0ZW1zIGFycmF5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gb25Qcm9ncmVzcyBUaGUgcHJvZ3Jlc3Npb24gY2FsbGJhY2ssIHJlZmVyIHRvIHt7I2Nyb3NzTGluayBcIkxvYWRpbmdJdGVtcy5vblByb2dyZXNzXCJ9fXt7L2Nyb3NzTGlua319XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvbkNvbXBsZXRlIFRoZSBjb21wbGV0aW9uIGNhbGxiYWNrLCByZWZlciB0byB7eyNjcm9zc0xpbmsgXCJMb2FkaW5nSXRlbXMub25Db21wbGV0ZVwifX17ey9jcm9zc0xpbmt9fVxuICogQHJldHVybiB7TG9hZGluZ0l0ZW1zfSBUaGUgTG9hZGluZ0l0ZW1zIHF1ZXVlIG9iamVjdFxuICogQGV4YW1wbGVcbiAqICBjYy5Mb2FkaW5nSXRlbXMuY3JlYXRlKGNjLmxvYWRlciwgWydhLnBuZycsICdiLnBsaXN0J10sIGZ1bmN0aW9uIChjb21wbGV0ZWRDb3VudCwgdG90YWxDb3VudCwgaXRlbSkge1xuICogICAgICB2YXIgcHJvZ3Jlc3MgPSAoMTAwICogY29tcGxldGVkQ291bnQgLyB0b3RhbENvdW50KS50b0ZpeGVkKDIpO1xuICogICAgICBjYy5sb2cocHJvZ3Jlc3MgKyAnJScpO1xuICogIH0sIGZ1bmN0aW9uIChlcnJvcnMsIGl0ZW1zKSB7XG4gKiAgICAgIGlmIChlcnJvcnMpIHtcbiAqICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXJyb3JzLmxlbmd0aDsgKytpKSB7XG4gKiAgICAgICAgICAgICAgY2MubG9nKCdFcnJvciB1cmw6ICcgKyBlcnJvcnNbaV0gKyAnLCBlcnJvcjogJyArIGl0ZW1zLmdldEVycm9yKGVycm9yc1tpXSkpO1xuICogICAgICAgICAgfVxuICogICAgICB9XG4gKiAgICAgIGVsc2Uge1xuICogICAgICAgICAgdmFyIHJlc3VsdF9hID0gaXRlbXMuZ2V0Q29udGVudCgnYS5wbmcnKTtcbiAqICAgICAgICAgIC8vIC4uLlxuICogICAgICB9XG4gKiAgfSlcbiAqL1xuTG9hZGluZ0l0ZW1zLmNyZWF0ZSA9IGZ1bmN0aW9uIChwaXBlbGluZSwgdXJsTGlzdCwgb25Qcm9ncmVzcywgb25Db21wbGV0ZSkge1xuICAgIGlmIChvblByb2dyZXNzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB1cmxMaXN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBvbkNvbXBsZXRlID0gdXJsTGlzdDtcbiAgICAgICAgICAgIHVybExpc3QgPSBvblByb2dyZXNzID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChvbkNvbXBsZXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB1cmxMaXN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBvbkNvbXBsZXRlID0gb25Qcm9ncmVzcztcbiAgICAgICAgICAgIG9uUHJvZ3Jlc3MgPSB1cmxMaXN0O1xuICAgICAgICAgICAgdXJsTGlzdCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBvbkNvbXBsZXRlID0gb25Qcm9ncmVzcztcbiAgICAgICAgICAgIG9uUHJvZ3Jlc3MgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHF1ZXVlID0gX3Bvb2wucG9wKCk7XG4gICAgaWYgKHF1ZXVlKSB7XG4gICAgICAgIHF1ZXVlLl9waXBlbGluZSA9IHBpcGVsaW5lO1xuICAgICAgICBxdWV1ZS5vblByb2dyZXNzID0gb25Qcm9ncmVzcztcbiAgICAgICAgcXVldWUub25Db21wbGV0ZSA9IG9uQ29tcGxldGU7XG4gICAgICAgIF9xdWV1ZXNbcXVldWUuX2lkXSA9IHF1ZXVlO1xuICAgICAgICBpZiAocXVldWUuX3BpcGVsaW5lKSB7XG4gICAgICAgICAgICBxdWV1ZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1cmxMaXN0KSB7XG4gICAgICAgICAgICBxdWV1ZS5hcHBlbmQodXJsTGlzdCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHF1ZXVlID0gbmV3IExvYWRpbmdJdGVtcyhwaXBlbGluZSwgdXJsTGlzdCwgb25Qcm9ncmVzcywgb25Db21wbGV0ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHF1ZXVlO1xufTtcblxuLyoqXG4gKiAhI2VuIFJldHJpZXZlIHRoZSBMb2FkaW5nSXRlbXMgcXVldWUgb2JqZWN0IGZvciBhbiBpdGVtLlxuICogISN6aCDpgJrov4cgaXRlbSDlr7nosaHojrflj5blroPnmoQgTG9hZGluZ0l0ZW1zIOmYn+WIl+OAglxuICogQG1ldGhvZCBnZXRRdWV1ZVxuICogQHN0YXRpY1xuICogQHBhcmFtIHtPYmplY3R9IGl0ZW0gVGhlIGl0ZW0gdG8gcXVlcnlcbiAqIEByZXR1cm4ge0xvYWRpbmdJdGVtc30gVGhlIExvYWRpbmdJdGVtcyBxdWV1ZSBvYmplY3RcbiAqL1xuTG9hZGluZ0l0ZW1zLmdldFF1ZXVlID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICByZXR1cm4gaXRlbS5xdWV1ZUlkID8gX3F1ZXVlc1tpdGVtLnF1ZXVlSWRdIDogbnVsbDtcbn07XG5cbi8qKlxuICogISNlbiBDb21wbGV0ZSBhbiBpdGVtIGluIHRoZSBMb2FkaW5nSXRlbXMgcXVldWUsIHBsZWFzZSBkbyBub3QgY2FsbCB0aGlzIG1ldGhvZCB1bmxlc3MgeW91IGtub3cgd2hhdCdzIGhhcHBlbmluZy5cbiAqICEjemgg6YCa55+lIExvYWRpbmdJdGVtcyDpmJ/liJfkuIDkuKogaXRlbSDlr7nosaHlt7LlrozmiJDvvIzor7fkuI3opoHosIPnlKjov5nkuKrlh73mlbDvvIzpmaTpnZ7kvaDnn6XpgZPoh6rlt7HlnKjlgZrku4DkuYjjgIJcbiAqIEBtZXRob2QgaXRlbUNvbXBsZXRlXG4gKiBAc3RhdGljXG4gKiBAcGFyYW0ge09iamVjdH0gaXRlbSBUaGUgaXRlbSB3aGljaCBoYXMgY29tcGxldGVkXG4gKi9cbkxvYWRpbmdJdGVtcy5pdGVtQ29tcGxldGUgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgIHZhciBxdWV1ZSA9IF9xdWV1ZXNbaXRlbS5xdWV1ZUlkXTtcbiAgICBpZiAocXVldWUpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJy0tLS0tIENvbXBsZXRlZCBieSBwaXBlbGluZSAnICsgaXRlbS5pZCArICcsIHJlc3Q6ICcgKyAocXVldWUudG90YWxDb3VudCAtIHF1ZXVlLmNvbXBsZXRlZENvdW50LTEpKTtcbiAgICAgICAgcXVldWUuaXRlbUNvbXBsZXRlKGl0ZW0uaWQpO1xuICAgIH1cbn07XG5cbkxvYWRpbmdJdGVtcy5pbml0UXVldWVEZXBzID0gZnVuY3Rpb24gKHF1ZXVlKSB7XG4gICAgdmFyIGRlcCA9IF9xdWV1ZURlcHNbcXVldWUuX2lkXTtcbiAgICBpZiAoIWRlcCkge1xuICAgICAgICBkZXAgPSBfcXVldWVEZXBzW3F1ZXVlLl9pZF0gPSB7XG4gICAgICAgICAgICBjb21wbGV0ZWQ6IFtdLFxuICAgICAgICAgICAgZGVwczogW11cbiAgICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGRlcC5jb21wbGV0ZWQubGVuZ3RoID0gMDtcbiAgICAgICAgZGVwLmRlcHMubGVuZ3RoID0gMDtcbiAgICB9XG59O1xuXG5Mb2FkaW5nSXRlbXMucmVnaXN0ZXJRdWV1ZURlcCA9IGZ1bmN0aW9uIChvd25lciwgZGVwSWQpIHtcbiAgICB2YXIgcXVldWVJZCA9IG93bmVyLnF1ZXVlSWQgfHwgb3duZXI7XG4gICAgaWYgKCFxdWV1ZUlkKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIHF1ZXVlRGVwTGlzdCA9IF9xdWV1ZURlcHNbcXVldWVJZF07XG4gICAgLy8gT3duZXIgaXMgcm9vdCBxdWV1ZVxuICAgIGlmIChxdWV1ZURlcExpc3QpIHtcbiAgICAgICAgaWYgKHF1ZXVlRGVwTGlzdC5kZXBzLmluZGV4T2YoZGVwSWQpID09PSAtMSkge1xuICAgICAgICAgICAgcXVldWVEZXBMaXN0LmRlcHMucHVzaChkZXBJZCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gT3duZXIgaXMgYW4gaXRlbSBpbiB0aGUgaW50ZXJtZWRpYXRlIHF1ZXVlXG4gICAgZWxzZSBpZiAob3duZXIuaWQpIHtcbiAgICAgICAgZm9yICh2YXIgaWQgaW4gX3F1ZXVlRGVwcykge1xuICAgICAgICAgICAgdmFyIHF1ZXVlID0gX3F1ZXVlRGVwc1tpZF07XG4gICAgICAgICAgICAvLyBGb3VuZCByb290IHF1ZXVlXG4gICAgICAgICAgICBpZiAocXVldWUuZGVwcy5pbmRleE9mKG93bmVyLmlkKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUuZGVwcy5pbmRleE9mKGRlcElkKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcXVldWUuZGVwcy5wdXNoKGRlcElkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5Mb2FkaW5nSXRlbXMuZmluaXNoRGVwID0gZnVuY3Rpb24gKGRlcElkKSB7XG4gICAgZm9yICh2YXIgaWQgaW4gX3F1ZXVlRGVwcykge1xuICAgICAgICB2YXIgcXVldWUgPSBfcXVldWVEZXBzW2lkXTtcbiAgICAgICAgLy8gRm91bmQgcm9vdCBxdWV1ZVxuICAgICAgICBpZiAocXVldWUuZGVwcy5pbmRleE9mKGRlcElkKSAhPT0gLTEgJiYgcXVldWUuY29tcGxldGVkLmluZGV4T2YoZGVwSWQpID09PSAtMSkge1xuICAgICAgICAgICAgcXVldWUuY29tcGxldGVkLnB1c2goZGVwSWQpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxudmFyIHByb3RvID0gTG9hZGluZ0l0ZW1zLnByb3RvdHlwZTtcbmpzLm1peGluKHByb3RvLCBDYWxsYmFja3NJbnZva2VyLnByb3RvdHlwZSk7XG5cbi8qKlxuICogISNlbiBBZGQgdXJscyB0byB0aGUgTG9hZGluZ0l0ZW1zIHF1ZXVlLlxuICogISN6aCDlkJHkuIDkuKogTG9hZGluZ0l0ZW1zIOmYn+WIl+a3u+WKoOWKoOi9vemhueOAglxuICogQG1ldGhvZCBhcHBlbmRcbiAqIEBwYXJhbSB7QXJyYXl9IHVybExpc3QgVGhlIHVybCBsaXN0IHRvIGJlIGFwcGVuZGVkLCB0aGUgdXJsIGNhbiBiZSBvYmplY3Qgb3Igc3RyaW5nXG4gKiBAcmV0dXJuIHtBcnJheX0gVGhlIGFjY2VwdGVkIHVybCBsaXN0LCBzb21lIGludmFsaWQgaXRlbXMgY291bGQgYmUgcmVmdXNlZC5cbiAqL1xucHJvdG8uYXBwZW5kID0gZnVuY3Rpb24gKHVybExpc3QsIG93bmVyKSB7XG4gICAgaWYgKCF0aGlzLmFjdGl2ZSkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGlmIChvd25lciAmJiAhb3duZXIuZGVwcykge1xuICAgICAgICBvd25lci5kZXBzID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5fYXBwZW5kaW5nID0gdHJ1ZTtcbiAgICB2YXIgYWNjZXB0ZWQgPSBbXSwgaSwgdXJsLCBpdGVtO1xuICAgIGZvciAoaSA9IDA7IGkgPCB1cmxMaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHVybCA9IHVybExpc3RbaV07XG5cbiAgICAgICAgLy8gQWxyZWFkeSBxdWV1ZWQgaW4gYW5vdGhlciBpdGVtcyBxdWV1ZSwgdXJsIGlzIGFjdHVhbGx5IHRoZSBpdGVtXG4gICAgICAgIGlmICh1cmwucXVldWVJZCAmJiAhdGhpcy5tYXBbdXJsLmlkXSkge1xuICAgICAgICAgICAgdGhpcy5tYXBbdXJsLmlkXSA9IHVybDtcbiAgICAgICAgICAgIC8vIFJlZ2lzdGVyIGl0ZW0gZGVwcyBmb3IgY2lyY2xlIHJlZmVyZW5jZSBjaGVja1xuICAgICAgICAgICAgb3duZXIgJiYgb3duZXIuZGVwcy5wdXNoKHVybCk7XG4gICAgICAgICAgICAvLyBRdWV1ZWQgYW5kIGNvbXBsZXRlZCBvciBPd25lciBjaXJjbGUgcmVmZXJlbmNlZCBieSBkZXBlbmRlbmN5XG4gICAgICAgICAgICBpZiAodXJsLmNvbXBsZXRlIHx8IGNoZWNrQ2lyY2xlUmVmZXJlbmNlKG93bmVyLCB1cmwpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b3RhbENvdW50Kys7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJy0tLS0tIENvbXBsZXRlZCBhbHJlYWR5IG9yIGNpcmNsZSByZWZlcmVuY2VkICcgKyB1cmwuaWQgKyAnLCByZXN0OiAnICsgKHRoaXMudG90YWxDb3VudCAtIHRoaXMuY29tcGxldGVkQ291bnQtMSkpO1xuICAgICAgICAgICAgICAgIHRoaXMuaXRlbUNvbXBsZXRlKHVybC5pZCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBOb3QgY29tcGxldGVkIHlldCwgc2hvdWxkIHdhaXQgaXRcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICB2YXIgcXVldWUgPSBfcXVldWVzW3VybC5xdWV1ZUlkXTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbENvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgIExvYWRpbmdJdGVtcy5yZWdpc3RlclF1ZXVlRGVwKG93bmVyIHx8IHRoaXMuX2lkLCB1cmwuaWQpO1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnKysrKysgV2FpdGVkICcgKyB1cmwuaWQpO1xuICAgICAgICAgICAgICAgICAgICBxdWV1ZS5hZGRMaXN0ZW5lcih1cmwuaWQsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnLS0tLS0gQ29tcGxldGVkIGJ5IHdhaXRpbmcgJyArIGl0ZW0uaWQgKyAnLCByZXN0OiAnICsgKHNlbGYudG90YWxDb3VudCAtIHNlbGYuY29tcGxldGVkQ291bnQtMSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pdGVtQ29tcGxldGUoaXRlbS5pZCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBRdWV1ZSBuZXcgaXRlbXNcbiAgICAgICAgaWYgKGlzSWRWYWxpZCh1cmwpKSB7XG4gICAgICAgICAgICBpdGVtID0gY3JlYXRlSXRlbSh1cmwsIHRoaXMuX2lkKTtcbiAgICAgICAgICAgIHZhciBrZXkgPSBpdGVtLmlkO1xuICAgICAgICAgICAgLy8gTm8gZHVwbGljYXRlZCB1cmxcbiAgICAgICAgICAgIGlmICghdGhpcy5tYXBba2V5XSkge1xuICAgICAgICAgICAgICAgIHRoaXMubWFwW2tleV0gPSBpdGVtO1xuICAgICAgICAgICAgICAgIHRoaXMudG90YWxDb3VudCsrO1xuICAgICAgICAgICAgICAgIC8vIFJlZ2lzdGVyIGl0ZW0gZGVwcyBmb3IgY2lyY2xlIHJlZmVyZW5jZSBjaGVja1xuICAgICAgICAgICAgICAgIG93bmVyICYmIG93bmVyLmRlcHMucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICBMb2FkaW5nSXRlbXMucmVnaXN0ZXJRdWV1ZURlcChvd25lciB8fCB0aGlzLl9pZCwga2V5KTtcbiAgICAgICAgICAgICAgICBhY2NlcHRlZC5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCcrKysrKyBBcHBlbmRlZCAnICsgaXRlbS5pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5fYXBwZW5kaW5nID0gZmFsc2U7XG5cbiAgICAvLyBNYW51YWxseSBjb21wbGV0ZVxuICAgIGlmICh0aGlzLmNvbXBsZXRlZENvdW50ID09PSB0aGlzLnRvdGFsQ291bnQpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJz09PT09IEFsbCBDb21wbGV0ZWQgJyk7XG4gICAgICAgIHRoaXMuYWxsQ29tcGxldGUoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRoaXMuX3BpcGVsaW5lLmZsb3dJbihhY2NlcHRlZCk7XG4gICAgfVxuICAgIHJldHVybiBhY2NlcHRlZDtcbn07XG5cbnByb3RvLl9jaGlsZE9uUHJvZ3Jlc3MgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgIGlmICh0aGlzLm9uUHJvZ3Jlc3MpIHtcbiAgICAgICAgdmFyIGRlcCA9IF9xdWV1ZURlcHNbdGhpcy5faWRdO1xuICAgICAgICB0aGlzLm9uUHJvZ3Jlc3MoZGVwID8gZGVwLmNvbXBsZXRlZC5sZW5ndGggOiB0aGlzLmNvbXBsZXRlZENvdW50LCBkZXAgPyBkZXAuZGVwcy5sZW5ndGggOiB0aGlzLnRvdGFsQ291bnQsIGl0ZW0pO1xuICAgIH1cbn07XG5cbi8qKlxuICogISNlbiBDb21wbGV0ZSBhIExvYWRpbmdJdGVtcyBxdWV1ZSwgcGxlYXNlIGRvIG5vdCBjYWxsIHRoaXMgbWV0aG9kIHVubGVzcyB5b3Uga25vdyB3aGF0J3MgaGFwcGVuaW5nLlxuICogISN6aCDlrozmiJDkuIDkuKogTG9hZGluZ0l0ZW1zIOmYn+WIl++8jOivt+S4jeimgeiwg+eUqOi/meS4quWHveaVsO+8jOmZpOmdnuS9oOefpemBk+iHquW3seWcqOWBmuS7gOS5iOOAglxuICogQG1ldGhvZCBhbGxDb21wbGV0ZVxuICovXG5wcm90by5hbGxDb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXJyb3JzID0ganMuaXNFbXB0eU9iamVjdCh0aGlzLl9lcnJvclVybHMpID8gbnVsbCA6IHRoaXMuX2Vycm9yVXJscztcblxuICAgIGlmICh0aGlzLm9uQ29tcGxldGUpIHtcbiAgICAgICAgdGhpcy5vbkNvbXBsZXRlKGVycm9ycywgdGhpcyk7XG4gICAgfVxufTtcblxuLyoqXG4gKiAhI2VuIENoZWNrIHdoZXRoZXIgYWxsIGl0ZW1zIGFyZSBjb21wbGV0ZWQuXG4gKiAhI3poIOajgOafpeaYr+WQpuaJgOacieWKoOi9vemhuemDveW3sue7j+WujOaIkOOAglxuICogQG1ldGhvZCBpc0NvbXBsZXRlZFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xucHJvdG8uaXNDb21wbGV0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29tcGxldGVkQ291bnQgPj0gdGhpcy50b3RhbENvdW50O1xufTtcblxuLyoqXG4gKiAhI2VuIENoZWNrIHdoZXRoZXIgYW4gaXRlbSBpcyBjb21wbGV0ZWQuXG4gKiAhI3poIOmAmui/hyBpZCDmo4Dmn6XmjIflrprliqDovb3pobnmmK/lkKblt7Lnu4/liqDovb3lrozmiJDjgIJcbiAqIEBtZXRob2QgaXNJdGVtQ29tcGxldGVkXG4gKiBAcGFyYW0ge1N0cmluZ30gaWQgVGhlIGl0ZW0ncyBpZC5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbnByb3RvLmlzSXRlbUNvbXBsZXRlZCA9IGZ1bmN0aW9uIChpZCkge1xuICAgIHJldHVybiAhIXRoaXMuY29tcGxldGVkW2lkXTtcbn07XG5cbi8qKlxuICogISNlbiBDaGVjayB3aGV0aGVyIGFuIGl0ZW0gZXhpc3RzLlxuICogISN6aCDpgJrov4cgaWQg5qOA5p+l5Yqg6L296aG55piv5ZCm5a2Y5Zyo44CCXG4gKiBAbWV0aG9kIGV4aXN0c1xuICogQHBhcmFtIHtTdHJpbmd9IGlkIFRoZSBpdGVtJ3MgaWQuXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5wcm90by5leGlzdHMgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICByZXR1cm4gISF0aGlzLm1hcFtpZF07XG59O1xuXG4vKipcbiAqICEjZW4gUmV0dXJucyB0aGUgY29udGVudCBvZiBhbiBpbnRlcm5hbCBpdGVtLlxuICogISN6aCDpgJrov4cgaWQg6I635Y+W5oyH5a6a5a+56LGh55qE5YaF5a6544CCXG4gKiBAbWV0aG9kIGdldENvbnRlbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBUaGUgaXRlbSdzIGlkLlxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5wcm90by5nZXRDb250ZW50ID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIGl0ZW0gPSB0aGlzLm1hcFtpZF07XG4gICAgdmFyIHJldCA9IG51bGw7XG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgaWYgKGl0ZW0uY29udGVudCkge1xuICAgICAgICAgICAgcmV0ID0gaXRlbS5jb250ZW50O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGl0ZW0uYWxpYXMpIHtcbiAgICAgICAgICAgIHJldCA9IGl0ZW0uYWxpYXMuY29udGVudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG59O1xuXG4vKipcbiAqICEjZW4gUmV0dXJucyB0aGUgZXJyb3Igb2YgYW4gaW50ZXJuYWwgaXRlbS5cbiAqICEjemgg6YCa6L+HIGlkIOiOt+WPluaMh+WumuWvueixoeeahOmUmeivr+S/oeaBr+OAglxuICogQG1ldGhvZCBnZXRFcnJvclxuICogQHBhcmFtIHtTdHJpbmd9IGlkIFRoZSBpdGVtJ3MgaWQuXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbnByb3RvLmdldEVycm9yID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIGl0ZW0gPSB0aGlzLm1hcFtpZF07XG4gICAgdmFyIHJldCA9IG51bGw7XG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgaWYgKGl0ZW0uZXJyb3IpIHtcbiAgICAgICAgICAgIHJldCA9IGl0ZW0uZXJyb3I7XG4gICAgICAgIH0gZWxzZSBpZiAoaXRlbS5hbGlhcykge1xuICAgICAgICAgICAgcmV0ID0gaXRlbS5hbGlhcy5lcnJvcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG59O1xuXG4vKipcbiAqICEjZW4gQWRkIGEgbGlzdGVuZXIgZm9yIGFuIGl0ZW0sIHRoZSBjYWxsYmFjayB3aWxsIGJlIGludm9rZWQgd2hlbiB0aGUgaXRlbSBpcyBjb21wbGV0ZWQuXG4gKiAhI3poIOebkeWQrOWKoOi9vemhue+8iOmAmui/hyBrZXkg5oyH5a6a77yJ55qE5a6M5oiQ5LqL5Lu244CCXG4gKiBAbWV0aG9kIGFkZExpc3RlbmVyXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIGNhbiBiZSBudWxsXG4gKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0IC0gY2FuIGJlIG51bGxcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHdoZXRoZXIgdGhlIGtleSBpcyBuZXdcbiAqL1xucHJvdG8uYWRkTGlzdGVuZXIgPSBDYWxsYmFja3NJbnZva2VyLnByb3RvdHlwZS5vbjtcblxuLyoqXG4gKiAhI2VuXG4gKiBDaGVjayBpZiB0aGUgc3BlY2lmaWVkIGtleSBoYXMgYW55IHJlZ2lzdGVyZWQgY2FsbGJhY2suIFxuICogSWYgYSBjYWxsYmFjayBpcyBhbHNvIHNwZWNpZmllZCwgaXQgd2lsbCBvbmx5IHJldHVybiB0cnVlIGlmIHRoZSBjYWxsYmFjayBpcyByZWdpc3RlcmVkLlxuICogISN6aFxuICog5qOA5p+l5oyH5a6a55qE5Yqg6L296aG55piv5ZCm5pyJ5a6M5oiQ5LqL5Lu255uR5ZCs5Zmo44CCXG4gKiDlpoLmnpzlkIzml7bov5jmjIflrprkuobkuIDkuKrlm57osIPmlrnms5XvvIzlubbkuJTlm57osIPmnInms6jlhozvvIzlroPlj6rkvJrov5Tlm54gdHJ1ZeOAglxuICogQG1ldGhvZCBoYXNMaXN0ZW5lclxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXVxuICogQHBhcmFtIHtPYmplY3R9IFt0YXJnZXRdXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5wcm90by5oYXNMaXN0ZW5lciA9IENhbGxiYWNrc0ludm9rZXIucHJvdG90eXBlLmhhc0V2ZW50TGlzdGVuZXI7XG5cbi8qKlxuICogISNlblxuICogUmVtb3ZlcyBhIGxpc3RlbmVyLiBcbiAqIEl0IHdpbGwgb25seSByZW1vdmUgd2hlbiBrZXksIGNhbGxiYWNrLCB0YXJnZXQgYWxsIG1hdGNoIGNvcnJlY3RseS5cbiAqICEjemhcbiAqIOenu+mZpOaMh+WumuWKoOi9vemhueW3sue7j+azqOWGjOeahOWujOaIkOS6i+S7tuebkeWQrOWZqOOAglxuICog5Y+q5Lya5Yig6ZmkIGtleSwgY2FsbGJhY2ssIHRhcmdldCDlnYfljLnphY3nmoTnm5HlkKzlmajjgIJcbiAqIEBtZXRob2QgcmVtb3ZlXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHBhcmFtIHtPYmplY3R9IHRhcmdldFxuICogQHJldHVybiB7Qm9vbGVhbn0gcmVtb3ZlZFxuICovXG5wcm90by5yZW1vdmVMaXN0ZW5lciA9IENhbGxiYWNrc0ludm9rZXIucHJvdG90eXBlLm9mZjtcblxuLyoqXG4gKiAhI2VuXG4gKiBSZW1vdmVzIGFsbCBjYWxsYmFja3MgcmVnaXN0ZXJlZCBpbiBhIGNlcnRhaW4gZXZlbnRcbiAqIHR5cGUgb3IgYWxsIGNhbGxiYWNrcyByZWdpc3RlcmVkIHdpdGggYSBjZXJ0YWluIHRhcmdldC5cbiAqICEjemgg5Yig6Zmk5oyH5a6a55uu5qCH55qE5omA5pyJ5a6M5oiQ5LqL5Lu255uR5ZCs5Zmo44CCXG4gKiBAbWV0aG9kIHJlbW92ZUFsbExpc3RlbmVyc1xuICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBrZXkgLSBUaGUgZXZlbnQga2V5IHRvIGJlIHJlbW92ZWQgb3IgdGhlIHRhcmdldCB0byBiZSByZW1vdmVkXG4gKi9cbnByb3RvLnJlbW92ZUFsbExpc3RlbmVycyA9IENhbGxiYWNrc0ludm9rZXIucHJvdG90eXBlLnJlbW92ZUFsbDtcblxuLyoqXG4gKiAhI2VuIFJlbW92ZSBhbiBpdGVtLCBjYW4gb25seSByZW1vdmUgY29tcGxldGVkIGl0ZW0sIG9uZ29pbmcgaXRlbSBjYW4gbm90IGJlIHJlbW92ZWQuXG4gKiAhI3poIOenu+mZpOWKoOi9vemhue+8jOi/memHjOWPquS8muenu+mZpOW3sue7j+WujOaIkOeahOWKoOi9vemhue+8jOato+WcqOi/m+ihjOeahOWKoOi9vemhueWwhuS4jeiDveiiq+WIoOmZpOOAglxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICovXG5wcm90by5yZW1vdmVJdGVtID0gZnVuY3Rpb24gKHVybCkge1xuICAgIHZhciBpdGVtID0gdGhpcy5tYXBbdXJsXTtcbiAgICBpZiAoIWl0ZW0pIHJldHVybjtcblxuICAgIGlmICghdGhpcy5jb21wbGV0ZWRbaXRlbS5hbGlhcyB8fCB1cmxdKSByZXR1cm47XG5cbiAgICBkZWxldGUgdGhpcy5jb21wbGV0ZWRbdXJsXTtcbiAgICBkZWxldGUgdGhpcy5tYXBbdXJsXTtcbiAgICBpZiAoaXRlbS5hbGlhcykge1xuICAgICAgICBkZWxldGUgdGhpcy5jb21wbGV0ZWRbaXRlbS5hbGlhcy5pZF07XG4gICAgICAgIGRlbGV0ZSB0aGlzLm1hcFtpdGVtLmFsaWFzLmlkXTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbXBsZXRlZENvdW50LS07XG4gICAgdGhpcy50b3RhbENvdW50LS07XG59O1xuXG4vKipcbiAqICEjZW4gQ29tcGxldGUgYW4gaXRlbSBpbiB0aGUgTG9hZGluZ0l0ZW1zIHF1ZXVlLCBwbGVhc2UgZG8gbm90IGNhbGwgdGhpcyBtZXRob2QgdW5sZXNzIHlvdSBrbm93IHdoYXQncyBoYXBwZW5pbmcuXG4gKiAhI3poIOmAmuefpSBMb2FkaW5nSXRlbXMg6Zif5YiX5LiA5LiqIGl0ZW0g5a+56LGh5bey5a6M5oiQ77yM6K+35LiN6KaB6LCD55So6L+Z5Liq5Ye95pWw77yM6Zmk6Z2e5L2g55+l6YGT6Ieq5bex5Zyo5YGa5LuA5LmI44CCXG4gKiBAbWV0aG9kIGl0ZW1Db21wbGV0ZVxuICogQHBhcmFtIHtTdHJpbmd9IGlkIFRoZSBpdGVtIHVybFxuICovXG5wcm90by5pdGVtQ29tcGxldGUgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICB2YXIgaXRlbSA9IHRoaXMubWFwW2lkXTtcbiAgICBpZiAoIWl0ZW0pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJlZ2lzdGVyIG9yIHVucmVnaXN0ZXIgZXJyb3JzXG4gICAgXG4gICAgdmFyIGVycm9yTGlzdElkID0gaWQgaW4gdGhpcy5fZXJyb3JVcmxzO1xuICAgIGlmIChpdGVtLmVycm9yIGluc3RhbmNlb2YgRXJyb3IgfHwganMuaXNTdHJpbmcoaXRlbS5lcnJvcikpIHtcbiAgICAgICAgdGhpcy5fZXJyb3JVcmxzW2lkXSA9IGl0ZW0uZXJyb3I7XG4gICAgfVxuICAgIGVsc2UgaWYgKGl0ZW0uZXJyb3IpIHtcbiAgICAgICAganMubWl4aW4odGhpcy5fZXJyb3JVcmxzLCBpdGVtLmVycm9yKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoIWl0ZW0uZXJyb3IgJiYgZXJyb3JMaXN0SWQpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2Vycm9yVXJsc1tpZF0gXG4gICAgfVxuXG4gICAgdGhpcy5jb21wbGV0ZWRbaWRdID0gaXRlbTtcbiAgICB0aGlzLmNvbXBsZXRlZENvdW50Kys7XG5cbiAgICBMb2FkaW5nSXRlbXMuZmluaXNoRGVwKGl0ZW0uaWQpO1xuICAgIGlmICh0aGlzLm9uUHJvZ3Jlc3MpIHtcbiAgICAgICAgdmFyIGRlcCA9IF9xdWV1ZURlcHNbdGhpcy5faWRdO1xuICAgICAgICB0aGlzLm9uUHJvZ3Jlc3MoZGVwID8gZGVwLmNvbXBsZXRlZC5sZW5ndGggOiB0aGlzLmNvbXBsZXRlZENvdW50LCBkZXAgPyBkZXAuZGVwcy5sZW5ndGggOiB0aGlzLnRvdGFsQ291bnQsIGl0ZW0pO1xuICAgIH1cblxuICAgIHRoaXMuZW1pdChpZCwgaXRlbSk7XG4gICAgdGhpcy5yZW1vdmVBbGwoaWQpO1xuXG4gICAgLy8gQWxsIGNvbXBsZXRlZFxuICAgIGlmICghdGhpcy5fYXBwZW5kaW5nICYmIHRoaXMuY29tcGxldGVkQ291bnQgPj0gdGhpcy50b3RhbENvdW50KSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCc9PT09PSBBbGwgQ29tcGxldGVkICcpO1xuICAgICAgICB0aGlzLmFsbENvbXBsZXRlKCk7XG4gICAgfVxufTtcblxuLyoqXG4gKiAhI2VuIERlc3Ryb3kgdGhlIExvYWRpbmdJdGVtcyBxdWV1ZSwgdGhlIHF1ZXVlIG9iamVjdCB3b24ndCBiZSBnYXJiYWdlIGNvbGxlY3RlZCwgaXQgd2lsbCBiZSByZWN5Y2xlZCwgc28gZXZlcnkgYWZ0ZXIgZGVzdHJveSBpcyBub3QgcmVsaWFibGUuXG4gKiAhI3poIOmUgOavgeS4gOS4qiBMb2FkaW5nSXRlbXMg6Zif5YiX77yM6L+Z5Liq6Zif5YiX5a+56LGh5Lya6KKr5YaF6YOo57yT5Yay5rGg5Zue5pS277yM5omA5Lul6ZSA5q+B5ZCO55qE5omA5pyJ5YaF6YOo5L+h5oGv6YO95piv5LiN5Y+v5L6d6LWW55qE44CCXG4gKiBAbWV0aG9kIGRlc3Ryb3lcbiAqL1xucHJvdG8uZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMuX2FwcGVuZGluZyA9IGZhbHNlO1xuICAgIHRoaXMuX3BpcGVsaW5lID0gbnVsbDtcbiAgICB0aGlzLl9vd25lclF1ZXVlID0gbnVsbDtcbiAgICBqcy5jbGVhcih0aGlzLl9lcnJvclVybHMpO1xuICAgIHRoaXMub25Qcm9ncmVzcyA9IG51bGw7XG4gICAgdGhpcy5vbkNvbXBsZXRlID0gbnVsbDtcblxuICAgIHRoaXMubWFwID0ganMuY3JlYXRlTWFwKHRydWUpO1xuICAgIHRoaXMuY29tcGxldGVkID0ge307XG5cbiAgICB0aGlzLnRvdGFsQ291bnQgPSAwO1xuICAgIHRoaXMuY29tcGxldGVkQ291bnQgPSAwO1xuXG4gICAgLy8gUmVpbml0aWFsaXplIENhbGxiYWNrc0ludm9rZXIsIGdlbmVyYXRlIHRocmVlIG5ldyBvYmplY3RzLCBjb3VsZCBiZSBpbXByb3ZlZFxuICAgIENhbGxiYWNrc0ludm9rZXIuY2FsbCh0aGlzKTtcbiAgICBcbiAgICBpZiAoX3F1ZXVlRGVwc1t0aGlzLl9pZF0pIHtcbiAgICAgICAgX3F1ZXVlRGVwc1t0aGlzLl9pZF0uY29tcGxldGVkLmxlbmd0aCA9IDA7XG4gICAgICAgIF9xdWV1ZURlcHNbdGhpcy5faWRdLmRlcHMubGVuZ3RoID0gMDtcbiAgICB9XG4gICAgZGVsZXRlIF9xdWV1ZXNbdGhpcy5faWRdO1xuICAgIGRlbGV0ZSBfcXVldWVEZXBzW3RoaXMuX2lkXTtcblxuICAgIGlmIChfcG9vbC5pbmRleE9mKHRoaXMpID09PSAtMSAmJiBfcG9vbC5sZW5ndGggPCBfUE9PTF9NQVhfTEVOR1RIKSB7XG4gICAgICAgIF9wb29sLnB1c2godGhpcyk7XG4gICAgfVxufTtcblxuY2MuTG9hZGluZ0l0ZW1zID0gbW9kdWxlLmV4cG9ydHMgPSBMb2FkaW5nSXRlbXM7XG4iXX0=