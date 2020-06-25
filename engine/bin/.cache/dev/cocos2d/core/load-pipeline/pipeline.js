
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/load-pipeline/pipeline.js';
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

var LoadingItems = require('./loading-items');

var ItemState = LoadingItems.ItemState;

function flow(pipe, item) {
  var pipeId = pipe.id;
  var itemState = item.states[pipeId];
  var next = pipe.next;
  var pipeline = pipe.pipeline;

  if (item.error || itemState === ItemState.WORKING || itemState === ItemState.ERROR) {
    return;
  } else if (itemState === ItemState.COMPLETE) {
    if (next) {
      flow(next, item);
    } else {
      pipeline.flowOut(item);
    }
  } else {
    item.states[pipeId] = ItemState.WORKING; // Pass async callback in case it's a async call

    var result = pipe.handle(item, function (err, result) {
      if (err) {
        item.error = err;
        item.states[pipeId] = ItemState.ERROR;
        pipeline.flowOut(item);
      } else {
        // Result can be null, then it means no result for this pipe
        if (result) {
          item.content = result;
        }

        item.states[pipeId] = ItemState.COMPLETE;

        if (next) {
          flow(next, item);
        } else {
          pipeline.flowOut(item);
        }
      }
    }); // If result exists (not undefined, null is ok), then we go with sync call flow

    if (result instanceof Error) {
      item.error = result;
      item.states[pipeId] = ItemState.ERROR;
      pipeline.flowOut(item);
    } else if (result !== undefined) {
      // Result can be null, then it means no result for this pipe
      if (result !== null) {
        item.content = result;
      }

      item.states[pipeId] = ItemState.COMPLETE;

      if (next) {
        flow(next, item);
      } else {
        pipeline.flowOut(item);
      }
    }
  }
}
/**
 * !#en
 * A pipeline describes a sequence of manipulations, each manipulation is called a pipe.<br/>
 * It's designed for loading process. so items should be urls, and the url will be the identity of each item during the process.<br/>
 * A list of items can flow in the pipeline and it will output the results of all pipes.<br/>
 * They flow in the pipeline like water in tubes, they go through pipe by pipe separately.<br/>
 * Finally all items will flow out the pipeline and the process is finished.
 *
 * !#zh
 * pipeline 描述了一系列的操作，每个操作都被称为 pipe。<br/>
 * 它被设计来做加载过程的流程管理。所以 item 应该是 url，并且该 url 将是在处理中的每个 item 的身份标识。<br/>
 * 一个 item 列表可以在 pipeline 中流动，它将输出加载项经过所有 pipe 之后的结果。<br/>
 * 它们穿过 pipeline 就像水在管子里流动，将会按顺序流过每个 pipe。<br/>
 * 最后当所有加载项都流出 pipeline 时，整个加载流程就结束了。
 * @class Pipeline
 */

/**
 * !#en
 * Constructor, pass an array of pipes to construct a new Pipeline,
 * the pipes will be chained in the given order.<br/>
 * A pipe is an object which must contain an `id` in string and a `handle` function,
 * the id must be unique in the pipeline.<br/>
 * It can also include `async` property to identify whether it's an asynchronous process.
 * !#zh
 * 构造函数，通过一系列的 pipe 来构造一个新的 pipeline，pipes 将会在给定的顺序中被锁定。<br/>
 * 一个 pipe 就是一个对象，它包含了字符串类型的 ‘id’ 和 ‘handle’ 函数，在 pipeline 中 id 必须是唯一的。<br/>
 * 它还可以包括 ‘async’ 属性以确定它是否是一个异步过程。
 *
 * @method constructor
 * @param {Array} pipes
 * @example
 *  var pipeline = new Pipeline([
 *      {
 *          id: 'Downloader',
 *          handle: function (item, callback) {},
 *          async: true
 *      },
 *      {id: 'Parser', handle: function (item) {}, async: false}
 *  ]);
 */


var Pipeline = function Pipeline(pipes) {
  this._pipes = pipes;
  this._cache = js.createMap(true);

  for (var i = 0; i < pipes.length; ++i) {
    var pipe = pipes[i]; // Must have handle and id, handle for flow, id for state flag

    if (!pipe.handle || !pipe.id) {
      continue;
    }

    pipe.pipeline = this;
    pipe.next = i < pipes.length - 1 ? pipes[i + 1] : null;
  }
};

Pipeline.ItemState = ItemState;
var proto = Pipeline.prototype;
/**
 * !#en
 * Insert a new pipe at the given index of the pipeline. <br/>
 * A pipe must contain an `id` in string and a `handle` function, the id must be unique in the pipeline.
 * !#zh
 * 在给定的索引位置插入一个新的 pipe。<br/>
 * 一个 pipe 必须包含一个字符串类型的 ‘id’ 和 ‘handle’ 函数，该 id 在 pipeline 必须是唯一标识。
 * @method insertPipe
 * @param {Object} pipe The pipe to be inserted
 * @param {Number} index The index to insert
 */

proto.insertPipe = function (pipe, index) {
  // Must have handle and id, handle for flow, id for state flag
  if (!pipe.handle || !pipe.id || index > this._pipes.length) {
    cc.warnID(4921);
    return;
  }

  if (this._pipes.indexOf(pipe) > 0) {
    cc.warnID(4922);
    return;
  }

  pipe.pipeline = this;
  var nextPipe = null;

  if (index < this._pipes.length) {
    nextPipe = this._pipes[index];
  }

  var previousPipe = null;

  if (index > 0) {
    previousPipe = this._pipes[index - 1];
  }

  if (previousPipe) {
    previousPipe.next = pipe;
  }

  pipe.next = nextPipe;

  this._pipes.splice(index, 0, pipe);
};
/**
 * !en
 * Insert a pipe to the end of an existing pipe. The existing pipe must be a valid pipe in the pipeline.
 * !zh
 * 在当前 pipeline 的一个已知 pipe 后面插入一个新的 pipe。
 * @method insertPipeAfter
 * @param {Object} refPipe An existing pipe in the pipeline.
 * @param {Object} newPipe The pipe to be inserted.
 */


proto.insertPipeAfter = function (refPipe, newPipe) {
  var index = this._pipes.indexOf(refPipe);

  if (index < 0) {
    return;
  }

  this.insertPipe(newPipe, index + 1);
};
/**
 * !#en
 * Add a new pipe at the end of the pipeline. <br/>
 * A pipe must contain an `id` in string and a `handle` function, the id must be unique in the pipeline.
 * !#zh
 * 添加一个新的 pipe 到 pipeline 尾部。 <br/>
 * 该 pipe 必须包含一个字符串类型 ‘id’ 和 ‘handle’ 函数，该 id 在 pipeline 必须是唯一标识。
 * @method appendPipe
 * @param {Object} pipe The pipe to be appended
 */


proto.appendPipe = function (pipe) {
  // Must have handle and id, handle for flow, id for state flag
  if (!pipe.handle || !pipe.id) {
    return;
  }

  pipe.pipeline = this;
  pipe.next = null;

  if (this._pipes.length > 0) {
    this._pipes[this._pipes.length - 1].next = pipe;
  }

  this._pipes.push(pipe);
};
/**
 * !#en
 * Let new items flow into the pipeline. <br/>
 * Each item can be a simple url string or an object,
 * if it's an object, it must contain `id` property. <br/>
 * You can specify its type by `type` property, by default, the type is the extension name in url. <br/>
 * By adding a `skips` property including pipe ids, you can skip these pipe. <br/>
 * The object can contain any supplementary property as you want. <br/>
 * !#zh
 * 让新的 item 流入 pipeline 中。<br/>
 * 这里的每个 item 可以是一个简单字符串类型的 url 或者是一个对象,
 * 如果它是一个对象的话，他必须要包含 ‘id’ 属性。<br/>
 * 你也可以指定它的 ‘type’ 属性类型，默认情况下，该类型是 ‘url’ 的后缀名。<br/>
 * 也通过添加一个 包含 ‘skips’ 属性的 item 对象，你就可以跳过 skips 中包含的 pipe。<br/>
 * 该对象可以包含任何附加属性。
 * @method flowIn
 * @param {Array} items
 * @example
 *  pipeline.flowIn([
 *      'res/Background.png',
 *      {
 *          id: 'res/scene.json',
 *          type: 'scene',
 *          name: 'scene',
 *          skips: ['Downloader']
 *      }
 *  ]);
 */


proto.flowIn = function (items) {
  var i,
      pipe = this._pipes[0],
      item;

  if (pipe) {
    // Cache all items first, in case synchronous loading flow same item repeatly
    for (i = 0; i < items.length; i++) {
      item = items[i];
      this._cache[item.id] = item;
    }

    for (i = 0; i < items.length; i++) {
      item = items[i];
      flow(pipe, item);
    }
  } else {
    for (i = 0; i < items.length; i++) {
      this.flowOut(items[i]);
    }
  }
};
/*
 * !#en
 * Let new items flow into the pipeline and give a callback when the list of items are all completed. <br/>
 * This is for loading dependencies for an existing item in flow, usually used in a pipe logic. <br/>
 * For example, we have a loader for scene configuration file in JSON, the scene will only be fully loaded  <br/>
 * after all its dependencies are loaded, then you will need to use function to flow in all dependencies  <br/>
 * found in the configuration file, and finish the loader pipe only after all dependencies are loaded (in the callback).
 * !#zh
 * 让新 items 流入 pipeline 并且当 item 列表完成时进行回调函数。<br/>
 * 这个 API 的使用通常是为了加载依赖项。<br/>
 * 例如：<br/>
 * 我们需要加载一个场景配置的 JSON 文件，该场景会将所有的依赖项全部都加载完毕以后，进行回调表示加载完毕。
 * @method flowInDeps
 * @deprecated since v1.3
 * @param {Array} urlList
 * @param {Function} callback
 * @return {Array} Items accepted by the pipeline
 */


proto.flowInDeps = function (owner, urlList, callback) {
  var deps = LoadingItems.create(this, function (errors, items) {
    callback(errors, items);
    items.destroy();
  });
  return deps.append(urlList, owner);
};

proto.flowOut = function (item) {
  if (item.error) {
    delete this._cache[item.id];
  } else if (!this._cache[item.id]) {
    this._cache[item.id] = item;
  }

  item.complete = true;
  LoadingItems.itemComplete(item);
};
/**
 * !#en
 * Copy the item states from one source item to all destination items. <br/>
 * It's quite useful when a pipe generate new items from one source item,<br/>
 * then you should flowIn these generated items into pipeline, <br/>
 * but you probably want them to skip all pipes the source item already go through,<br/>
 * you can achieve it with this API. <br/>
 * <br/>
 * For example, an unzip pipe will generate more items, but you won't want them to pass unzip or download pipe again.
 * !#zh
 * 从一个源 item 向所有目标 item 复制它的 pipe 状态，用于避免重复通过部分 pipe。<br/>
 * 当一个源 item 生成了一系列新的 items 时很有用，<br/>
 * 你希望让这些新的依赖项进入 pipeline，但是又不希望它们通过源 item 已经经过的 pipe，<br/>
 * 但是你可能希望他们源 item 已经通过并跳过所有 pipes，<br/>
 * 这个时候就可以使用这个 API。
 * @method copyItemStates
 * @param {Object} srcItem The source item
 * @param {Array|Object} dstItems A single destination item or an array of destination items
 */


proto.copyItemStates = function (srcItem, dstItems) {
  if (!(dstItems instanceof Array)) {
    dstItems.states = srcItem.states;
    return;
  }

  for (var i = 0; i < dstItems.length; ++i) {
    dstItems[i].states = srcItem.states;
  }
};
/**
 * !#en Returns an item in pipeline.
 * !#zh 根据 id 获取一个 item
 * @method getItem
 * @param {Object} id The id of the item
 * @return {Object}
 */


proto.getItem = function (id) {
  var item = this._cache[id];
  if (!item) return item; // downloader.js downloadUuid

  if (item.alias) item = item.alias;
  return item;
};
/**
 * !#en Removes an completed item in pipeline.
 * It will only remove the cache in the pipeline or loader, its dependencies won't be released.
 * cc.loader provided another method to completely cleanup the resource and its dependencies,
 * please refer to {{#crossLink "loader/release:method"}}cc.loader.release{{/crossLink}}
 * !#zh 移除指定的已完成 item。
 * 这将仅仅从 pipeline 或者 loader 中删除其缓存，并不会释放它所依赖的资源。
 * cc.loader 中提供了另一种删除资源及其依赖的清理方法，请参考 {{#crossLink "loader/release:method"}}cc.loader.release{{/crossLink}}
 * @method removeItem
 * @param {Object} id The id of the item
 * @return {Boolean} succeed or not
 */


proto.removeItem = function (id) {
  var removed = this._cache[id];

  if (removed && removed.complete) {
    delete this._cache[id];
  }

  return removed;
};
/**
 * !#en Clear the current pipeline, this function will clean up the items.
 * !#zh 清空当前 pipeline，该函数将清理 items。
 * @method clear
 */


proto.clear = function () {
  for (var id in this._cache) {
    var item = this._cache[id];
    delete this._cache[id];

    if (!item.complete) {
      item.error = new Error('Canceled manually');
      this.flowOut(item);
    }
  }
};

cc.Pipeline = module.exports = Pipeline;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lLmpzIl0sIm5hbWVzIjpbImpzIiwicmVxdWlyZSIsIkxvYWRpbmdJdGVtcyIsIkl0ZW1TdGF0ZSIsImZsb3ciLCJwaXBlIiwiaXRlbSIsInBpcGVJZCIsImlkIiwiaXRlbVN0YXRlIiwic3RhdGVzIiwibmV4dCIsInBpcGVsaW5lIiwiZXJyb3IiLCJXT1JLSU5HIiwiRVJST1IiLCJDT01QTEVURSIsImZsb3dPdXQiLCJyZXN1bHQiLCJoYW5kbGUiLCJlcnIiLCJjb250ZW50IiwiRXJyb3IiLCJ1bmRlZmluZWQiLCJQaXBlbGluZSIsInBpcGVzIiwiX3BpcGVzIiwiX2NhY2hlIiwiY3JlYXRlTWFwIiwiaSIsImxlbmd0aCIsInByb3RvIiwicHJvdG90eXBlIiwiaW5zZXJ0UGlwZSIsImluZGV4IiwiY2MiLCJ3YXJuSUQiLCJpbmRleE9mIiwibmV4dFBpcGUiLCJwcmV2aW91c1BpcGUiLCJzcGxpY2UiLCJpbnNlcnRQaXBlQWZ0ZXIiLCJyZWZQaXBlIiwibmV3UGlwZSIsImFwcGVuZFBpcGUiLCJwdXNoIiwiZmxvd0luIiwiaXRlbXMiLCJmbG93SW5EZXBzIiwib3duZXIiLCJ1cmxMaXN0IiwiY2FsbGJhY2siLCJkZXBzIiwiY3JlYXRlIiwiZXJyb3JzIiwiZGVzdHJveSIsImFwcGVuZCIsImNvbXBsZXRlIiwiaXRlbUNvbXBsZXRlIiwiY29weUl0ZW1TdGF0ZXMiLCJzcmNJdGVtIiwiZHN0SXRlbXMiLCJBcnJheSIsImdldEl0ZW0iLCJhbGlhcyIsInJlbW92ZUl0ZW0iLCJyZW1vdmVkIiwiY2xlYXIiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkEsSUFBSUEsRUFBRSxHQUFHQyxPQUFPLENBQUMsZ0JBQUQsQ0FBaEI7O0FBQ0EsSUFBSUMsWUFBWSxHQUFHRCxPQUFPLENBQUMsaUJBQUQsQ0FBMUI7O0FBQ0EsSUFBSUUsU0FBUyxHQUFHRCxZQUFZ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bkIsRUFBWixDQUFYO0FBQ0EsV0FBTyxLQUFLbUIsTUFBTCxDQUFZbkIsRUFBWixDQUFQOztBQUNBLFFBQUksQ0FBQ0YsSUFBSSxDQUFDbUQsUUFBVixFQUFvQjtBQUNoQm5ELE1BQUFBLElBQUksQ0FBQ08sS0FBTCxHQUFhLElBQUlTLEtBQUosQ0FBVSxtQkFBVixDQUFiO0FBQ0EsV0FBS0wsT0FBTCxDQUFhWCxJQUFiO0FBQ0g7QUFDSjtBQUNKLENBVEQ7O0FBV0E2QixFQUFFLENBQUNYLFFBQUgsR0FBYzRDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjdDLFFBQS9CIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG52YXIganMgPSByZXF1aXJlKCcuLi9wbGF0Zm9ybS9qcycpO1xudmFyIExvYWRpbmdJdGVtcyA9IHJlcXVpcmUoJy4vbG9hZGluZy1pdGVtcycpO1xudmFyIEl0ZW1TdGF0ZSA9IExvYWRpbmdJdGVtcy5JdGVtU3RhdGU7XG5cbmZ1bmN0aW9uIGZsb3cgKHBpcGUsIGl0ZW0pIHtcbiAgICB2YXIgcGlwZUlkID0gcGlwZS5pZDtcbiAgICB2YXIgaXRlbVN0YXRlID0gaXRlbS5zdGF0ZXNbcGlwZUlkXTtcbiAgICB2YXIgbmV4dCA9IHBpcGUubmV4dDtcbiAgICB2YXIgcGlwZWxpbmUgPSBwaXBlLnBpcGVsaW5lO1xuXG4gICAgaWYgKGl0ZW0uZXJyb3IgfHwgaXRlbVN0YXRlID09PSBJdGVtU3RhdGUuV09SS0lORyB8fCBpdGVtU3RhdGUgPT09IEl0ZW1TdGF0ZS5FUlJPUikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGVsc2UgaWYgKGl0ZW1TdGF0ZSA9PT0gSXRlbVN0YXRlLkNPTVBMRVRFKSB7XG4gICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgICBmbG93KG5leHQsIGl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcGlwZWxpbmUuZmxvd091dChpdGVtKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaXRlbS5zdGF0ZXNbcGlwZUlkXSA9IEl0ZW1TdGF0ZS5XT1JLSU5HO1xuICAgICAgICAvLyBQYXNzIGFzeW5jIGNhbGxiYWNrIGluIGNhc2UgaXQncyBhIGFzeW5jIGNhbGxcbiAgICAgICAgdmFyIHJlc3VsdCA9IHBpcGUuaGFuZGxlKGl0ZW0sIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGl0ZW0uZXJyb3IgPSBlcnI7XG4gICAgICAgICAgICAgICAgaXRlbS5zdGF0ZXNbcGlwZUlkXSA9IEl0ZW1TdGF0ZS5FUlJPUjtcbiAgICAgICAgICAgICAgICBwaXBlbGluZS5mbG93T3V0KGl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gUmVzdWx0IGNhbiBiZSBudWxsLCB0aGVuIGl0IG1lYW5zIG5vIHJlc3VsdCBmb3IgdGhpcyBwaXBlXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmNvbnRlbnQgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGl0ZW0uc3RhdGVzW3BpcGVJZF0gPSBJdGVtU3RhdGUuQ09NUExFVEU7XG4gICAgICAgICAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICAgICAgICAgICAgZmxvdyhuZXh0LCBpdGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHBpcGVsaW5lLmZsb3dPdXQoaXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gSWYgcmVzdWx0IGV4aXN0cyAobm90IHVuZGVmaW5lZCwgbnVsbCBpcyBvayksIHRoZW4gd2UgZ28gd2l0aCBzeW5jIGNhbGwgZmxvd1xuICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIGl0ZW0uZXJyb3IgPSByZXN1bHQ7XG4gICAgICAgICAgICBpdGVtLnN0YXRlc1twaXBlSWRdID0gSXRlbVN0YXRlLkVSUk9SO1xuICAgICAgICAgICAgcGlwZWxpbmUuZmxvd091dChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChyZXN1bHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gUmVzdWx0IGNhbiBiZSBudWxsLCB0aGVuIGl0IG1lYW5zIG5vIHJlc3VsdCBmb3IgdGhpcyBwaXBlXG4gICAgICAgICAgICBpZiAocmVzdWx0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaXRlbS5jb250ZW50ID0gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaXRlbS5zdGF0ZXNbcGlwZUlkXSA9IEl0ZW1TdGF0ZS5DT01QTEVURTtcbiAgICAgICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgICAgICAgZmxvdyhuZXh0LCBpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHBpcGVsaW5lLmZsb3dPdXQoaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogISNlblxuICogQSBwaXBlbGluZSBkZXNjcmliZXMgYSBzZXF1ZW5jZSBvZiBtYW5pcHVsYXRpb25zLCBlYWNoIG1hbmlwdWxhdGlvbiBpcyBjYWxsZWQgYSBwaXBlLjxici8+XG4gKiBJdCdzIGRlc2lnbmVkIGZvciBsb2FkaW5nIHByb2Nlc3MuIHNvIGl0ZW1zIHNob3VsZCBiZSB1cmxzLCBhbmQgdGhlIHVybCB3aWxsIGJlIHRoZSBpZGVudGl0eSBvZiBlYWNoIGl0ZW0gZHVyaW5nIHRoZSBwcm9jZXNzLjxici8+XG4gKiBBIGxpc3Qgb2YgaXRlbXMgY2FuIGZsb3cgaW4gdGhlIHBpcGVsaW5lIGFuZCBpdCB3aWxsIG91dHB1dCB0aGUgcmVzdWx0cyBvZiBhbGwgcGlwZXMuPGJyLz5cbiAqIFRoZXkgZmxvdyBpbiB0aGUgcGlwZWxpbmUgbGlrZSB3YXRlciBpbiB0dWJlcywgdGhleSBnbyB0aHJvdWdoIHBpcGUgYnkgcGlwZSBzZXBhcmF0ZWx5Ljxici8+XG4gKiBGaW5hbGx5IGFsbCBpdGVtcyB3aWxsIGZsb3cgb3V0IHRoZSBwaXBlbGluZSBhbmQgdGhlIHByb2Nlc3MgaXMgZmluaXNoZWQuXG4gKlxuICogISN6aFxuICogcGlwZWxpbmUg5o+P6L+w5LqG5LiA57O75YiX55qE5pON5L2c77yM5q+P5Liq5pON5L2c6YO96KKr56ew5Li6IHBpcGXjgII8YnIvPlxuICog5a6D6KKr6K6+6K6h5p2l5YGa5Yqg6L296L+H56iL55qE5rWB56iL566h55CG44CC5omA5LulIGl0ZW0g5bqU6K+l5pivIHVybO+8jOW5tuS4lOivpSB1cmwg5bCG5piv5Zyo5aSE55CG5Lit55qE5q+P5LiqIGl0ZW0g55qE6Lqr5Lu95qCH6K+G44CCPGJyLz5cbiAqIOS4gOS4qiBpdGVtIOWIl+ihqOWPr+S7peWcqCBwaXBlbGluZSDkuK3mtYHliqjvvIzlroPlsIbovpPlh7rliqDovb3pobnnu4/ov4fmiYDmnIkgcGlwZSDkuYvlkI7nmoTnu5PmnpzjgII8YnIvPlxuICog5a6D5Lus56m/6L+HIHBpcGVsaW5lIOWwseWDj+awtOWcqOeuoeWtkOmHjOa1geWKqO+8jOWwhuS8muaMiemhuuW6j+a1gei/h+avj+S4qiBwaXBl44CCPGJyLz5cbiAqIOacgOWQjuW9k+aJgOacieWKoOi9vemhuemDvea1geWHuiBwaXBlbGluZSDml7bvvIzmlbTkuKrliqDovb3mtYHnqIvlsLHnu5PmnZ/kuobjgIJcbiAqIEBjbGFzcyBQaXBlbGluZVxuICovXG4vKipcbiAqICEjZW5cbiAqIENvbnN0cnVjdG9yLCBwYXNzIGFuIGFycmF5IG9mIHBpcGVzIHRvIGNvbnN0cnVjdCBhIG5ldyBQaXBlbGluZSxcbiAqIHRoZSBwaXBlcyB3aWxsIGJlIGNoYWluZWQgaW4gdGhlIGdpdmVuIG9yZGVyLjxici8+XG4gKiBBIHBpcGUgaXMgYW4gb2JqZWN0IHdoaWNoIG11c3QgY29udGFpbiBhbiBgaWRgIGluIHN0cmluZyBhbmQgYSBgaGFuZGxlYCBmdW5jdGlvbixcbiAqIHRoZSBpZCBtdXN0IGJlIHVuaXF1ZSBpbiB0aGUgcGlwZWxpbmUuPGJyLz5cbiAqIEl0IGNhbiBhbHNvIGluY2x1ZGUgYGFzeW5jYCBwcm9wZXJ0eSB0byBpZGVudGlmeSB3aGV0aGVyIGl0J3MgYW4gYXN5bmNocm9ub3VzIHByb2Nlc3MuXG4gKiAhI3poXG4gKiDmnoTpgKDlh73mlbDvvIzpgJrov4fkuIDns7vliJfnmoQgcGlwZSDmnaXmnoTpgKDkuIDkuKrmlrDnmoQgcGlwZWxpbmXvvIxwaXBlcyDlsIbkvJrlnKjnu5nlrprnmoTpobrluo/kuK3ooqvplIHlrprjgII8YnIvPlxuICog5LiA5LiqIHBpcGUg5bCx5piv5LiA5Liq5a+56LGh77yM5a6D5YyF5ZCr5LqG5a2X56ym5Liy57G75Z6L55qEIOKAmGlk4oCZIOWSjCDigJhoYW5kbGXigJkg5Ye95pWw77yM5ZyoIHBpcGVsaW5lIOS4rSBpZCDlv4XpobvmmK/llK/kuIDnmoTjgII8YnIvPlxuICog5a6D6L+Y5Y+v5Lul5YyF5ousIOKAmGFzeW5j4oCZIOWxnuaAp+S7peehruWumuWug+aYr+WQpuaYr+S4gOS4quW8guatpei/h+eoi+OAglxuICpcbiAqIEBtZXRob2QgY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IHBpcGVzXG4gKiBAZXhhbXBsZVxuICogIHZhciBwaXBlbGluZSA9IG5ldyBQaXBlbGluZShbXG4gKiAgICAgIHtcbiAqICAgICAgICAgIGlkOiAnRG93bmxvYWRlcicsXG4gKiAgICAgICAgICBoYW5kbGU6IGZ1bmN0aW9uIChpdGVtLCBjYWxsYmFjaykge30sXG4gKiAgICAgICAgICBhc3luYzogdHJ1ZVxuICogICAgICB9LFxuICogICAgICB7aWQ6ICdQYXJzZXInLCBoYW5kbGU6IGZ1bmN0aW9uIChpdGVtKSB7fSwgYXN5bmM6IGZhbHNlfVxuICogIF0pO1xuICovXG52YXIgUGlwZWxpbmUgPSBmdW5jdGlvbiAocGlwZXMpIHtcbiAgICB0aGlzLl9waXBlcyA9IHBpcGVzO1xuICAgIHRoaXMuX2NhY2hlID0ganMuY3JlYXRlTWFwKHRydWUpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwaXBlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIgcGlwZSA9IHBpcGVzW2ldO1xuICAgICAgICAvLyBNdXN0IGhhdmUgaGFuZGxlIGFuZCBpZCwgaGFuZGxlIGZvciBmbG93LCBpZCBmb3Igc3RhdGUgZmxhZ1xuICAgICAgICBpZiAoIXBpcGUuaGFuZGxlIHx8ICFwaXBlLmlkKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBpcGUucGlwZWxpbmUgPSB0aGlzO1xuICAgICAgICBwaXBlLm5leHQgPSBpIDwgcGlwZXMubGVuZ3RoIC0gMSA/IHBpcGVzW2krMV0gOiBudWxsO1xuICAgIH1cbn07XG5cblBpcGVsaW5lLkl0ZW1TdGF0ZSA9IEl0ZW1TdGF0ZTtcblxudmFyIHByb3RvID0gUGlwZWxpbmUucHJvdG90eXBlO1xuXG4vKipcbiAqICEjZW5cbiAqIEluc2VydCBhIG5ldyBwaXBlIGF0IHRoZSBnaXZlbiBpbmRleCBvZiB0aGUgcGlwZWxpbmUuIDxici8+XG4gKiBBIHBpcGUgbXVzdCBjb250YWluIGFuIGBpZGAgaW4gc3RyaW5nIGFuZCBhIGBoYW5kbGVgIGZ1bmN0aW9uLCB0aGUgaWQgbXVzdCBiZSB1bmlxdWUgaW4gdGhlIHBpcGVsaW5lLlxuICogISN6aFxuICog5Zyo57uZ5a6a55qE57Si5byV5L2N572u5o+S5YWl5LiA5Liq5paw55qEIHBpcGXjgII8YnIvPlxuICog5LiA5LiqIHBpcGUg5b+F6aG75YyF5ZCr5LiA5Liq5a2X56ym5Liy57G75Z6L55qEIOKAmGlk4oCZIOWSjCDigJhoYW5kbGXigJkg5Ye95pWw77yM6K+lIGlkIOWcqCBwaXBlbGluZSDlv4XpobvmmK/llK/kuIDmoIfor4bjgIJcbiAqIEBtZXRob2QgaW5zZXJ0UGlwZVxuICogQHBhcmFtIHtPYmplY3R9IHBpcGUgVGhlIHBpcGUgdG8gYmUgaW5zZXJ0ZWRcbiAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBUaGUgaW5kZXggdG8gaW5zZXJ0XG4gKi9cbnByb3RvLmluc2VydFBpcGUgPSBmdW5jdGlvbiAocGlwZSwgaW5kZXgpIHtcbiAgICAvLyBNdXN0IGhhdmUgaGFuZGxlIGFuZCBpZCwgaGFuZGxlIGZvciBmbG93LCBpZCBmb3Igc3RhdGUgZmxhZ1xuICAgIGlmICghcGlwZS5oYW5kbGUgfHwgIXBpcGUuaWQgfHwgaW5kZXggPiB0aGlzLl9waXBlcy5sZW5ndGgpIHtcbiAgICAgICAgY2Mud2FybklEKDQ5MjEpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3BpcGVzLmluZGV4T2YocGlwZSkgPiAwKSB7XG4gICAgICAgIGNjLndhcm5JRCg0OTIyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHBpcGUucGlwZWxpbmUgPSB0aGlzO1xuXG4gICAgdmFyIG5leHRQaXBlID0gbnVsbDtcbiAgICBpZiAoaW5kZXggPCB0aGlzLl9waXBlcy5sZW5ndGgpIHtcbiAgICAgICAgbmV4dFBpcGUgPSB0aGlzLl9waXBlc1tpbmRleF07XG4gICAgfVxuXG4gICAgdmFyIHByZXZpb3VzUGlwZSA9IG51bGw7XG4gICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICBwcmV2aW91c1BpcGUgPSB0aGlzLl9waXBlc1tpbmRleC0xXTtcbiAgICB9XG5cbiAgICBpZiAocHJldmlvdXNQaXBlKSB7XG4gICAgICAgIHByZXZpb3VzUGlwZS5uZXh0ID0gcGlwZTtcbiAgICB9XG4gICAgcGlwZS5uZXh0ID0gbmV4dFBpcGU7XG5cbiAgICB0aGlzLl9waXBlcy5zcGxpY2UoaW5kZXgsIDAsIHBpcGUpO1xufTtcblxuLyoqXG4gKiAhZW5cbiAqIEluc2VydCBhIHBpcGUgdG8gdGhlIGVuZCBvZiBhbiBleGlzdGluZyBwaXBlLiBUaGUgZXhpc3RpbmcgcGlwZSBtdXN0IGJlIGEgdmFsaWQgcGlwZSBpbiB0aGUgcGlwZWxpbmUuXG4gKiAhemhcbiAqIOWcqOW9k+WJjSBwaXBlbGluZSDnmoTkuIDkuKrlt7Lnn6UgcGlwZSDlkI7pnaLmj5LlhaXkuIDkuKrmlrDnmoQgcGlwZeOAglxuICogQG1ldGhvZCBpbnNlcnRQaXBlQWZ0ZXJcbiAqIEBwYXJhbSB7T2JqZWN0fSByZWZQaXBlIEFuIGV4aXN0aW5nIHBpcGUgaW4gdGhlIHBpcGVsaW5lLlxuICogQHBhcmFtIHtPYmplY3R9IG5ld1BpcGUgVGhlIHBpcGUgdG8gYmUgaW5zZXJ0ZWQuXG4gKi9cbnByb3RvLmluc2VydFBpcGVBZnRlciA9IGZ1bmN0aW9uIChyZWZQaXBlLCBuZXdQaXBlKSAge1xuICAgIHZhciBpbmRleCA9IHRoaXMuX3BpcGVzLmluZGV4T2YocmVmUGlwZSk7XG4gICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuaW5zZXJ0UGlwZShuZXdQaXBlLCBpbmRleCsxKTtcbn07XG5cbi8qKlxuICogISNlblxuICogQWRkIGEgbmV3IHBpcGUgYXQgdGhlIGVuZCBvZiB0aGUgcGlwZWxpbmUuIDxici8+XG4gKiBBIHBpcGUgbXVzdCBjb250YWluIGFuIGBpZGAgaW4gc3RyaW5nIGFuZCBhIGBoYW5kbGVgIGZ1bmN0aW9uLCB0aGUgaWQgbXVzdCBiZSB1bmlxdWUgaW4gdGhlIHBpcGVsaW5lLlxuICogISN6aFxuICog5re75Yqg5LiA5Liq5paw55qEIHBpcGUg5YiwIHBpcGVsaW5lIOWwvumDqOOAgiA8YnIvPlxuICog6K+lIHBpcGUg5b+F6aG75YyF5ZCr5LiA5Liq5a2X56ym5Liy57G75Z6LIOKAmGlk4oCZIOWSjCDigJhoYW5kbGXigJkg5Ye95pWw77yM6K+lIGlkIOWcqCBwaXBlbGluZSDlv4XpobvmmK/llK/kuIDmoIfor4bjgIJcbiAqIEBtZXRob2QgYXBwZW5kUGlwZVxuICogQHBhcmFtIHtPYmplY3R9IHBpcGUgVGhlIHBpcGUgdG8gYmUgYXBwZW5kZWRcbiAqL1xucHJvdG8uYXBwZW5kUGlwZSA9IGZ1bmN0aW9uIChwaXBlKSB7XG4gICAgLy8gTXVzdCBoYXZlIGhhbmRsZSBhbmQgaWQsIGhhbmRsZSBmb3IgZmxvdywgaWQgZm9yIHN0YXRlIGZsYWdcbiAgICBpZiAoIXBpcGUuaGFuZGxlIHx8ICFwaXBlLmlkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBwaXBlLnBpcGVsaW5lID0gdGhpcztcbiAgICBwaXBlLm5leHQgPSBudWxsO1xuICAgIGlmICh0aGlzLl9waXBlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuX3BpcGVzW3RoaXMuX3BpcGVzLmxlbmd0aCAtIDFdLm5leHQgPSBwaXBlO1xuICAgIH1cbiAgICB0aGlzLl9waXBlcy5wdXNoKHBpcGUpO1xufTtcblxuLyoqXG4gKiAhI2VuXG4gKiBMZXQgbmV3IGl0ZW1zIGZsb3cgaW50byB0aGUgcGlwZWxpbmUuIDxici8+XG4gKiBFYWNoIGl0ZW0gY2FuIGJlIGEgc2ltcGxlIHVybCBzdHJpbmcgb3IgYW4gb2JqZWN0LFxuICogaWYgaXQncyBhbiBvYmplY3QsIGl0IG11c3QgY29udGFpbiBgaWRgIHByb3BlcnR5LiA8YnIvPlxuICogWW91IGNhbiBzcGVjaWZ5IGl0cyB0eXBlIGJ5IGB0eXBlYCBwcm9wZXJ0eSwgYnkgZGVmYXVsdCwgdGhlIHR5cGUgaXMgdGhlIGV4dGVuc2lvbiBuYW1lIGluIHVybC4gPGJyLz5cbiAqIEJ5IGFkZGluZyBhIGBza2lwc2AgcHJvcGVydHkgaW5jbHVkaW5nIHBpcGUgaWRzLCB5b3UgY2FuIHNraXAgdGhlc2UgcGlwZS4gPGJyLz5cbiAqIFRoZSBvYmplY3QgY2FuIGNvbnRhaW4gYW55IHN1cHBsZW1lbnRhcnkgcHJvcGVydHkgYXMgeW91IHdhbnQuIDxici8+XG4gKiAhI3poXG4gKiDorqnmlrDnmoQgaXRlbSDmtYHlhaUgcGlwZWxpbmUg5Lit44CCPGJyLz5cbiAqIOi/memHjOeahOavj+S4qiBpdGVtIOWPr+S7peaYr+S4gOS4queugOWNleWtl+espuS4suexu+Wei+eahCB1cmwg5oiW6ICF5piv5LiA5Liq5a+56LGhLFxuICog5aaC5p6c5a6D5piv5LiA5Liq5a+56LGh55qE6K+d77yM5LuW5b+F6aG76KaB5YyF5ZCrIOKAmGlk4oCZIOWxnuaAp+OAgjxici8+XG4gKiDkvaDkuZ/lj6/ku6XmjIflrprlroPnmoQg4oCYdHlwZeKAmSDlsZ7mgKfnsbvlnovvvIzpu5jorqTmg4XlhrXkuIvvvIzor6XnsbvlnovmmK8g4oCYdXJs4oCZIOeahOWQjue8gOWQjeOAgjxici8+XG4gKiDkuZ/pgJrov4fmt7vliqDkuIDkuKog5YyF5ZCrIOKAmHNraXBz4oCZIOWxnuaAp+eahCBpdGVtIOWvueixoe+8jOS9oOWwseWPr+S7pei3s+i/hyBza2lwcyDkuK3ljIXlkKvnmoQgcGlwZeOAgjxici8+XG4gKiDor6Xlr7nosaHlj6/ku6XljIXlkKvku7vkvZXpmYTliqDlsZ7mgKfjgIJcbiAqIEBtZXRob2QgZmxvd0luXG4gKiBAcGFyYW0ge0FycmF5fSBpdGVtc1xuICogQGV4YW1wbGVcbiAqICBwaXBlbGluZS5mbG93SW4oW1xuICogICAgICAncmVzL0JhY2tncm91bmQucG5nJyxcbiAqICAgICAge1xuICogICAgICAgICAgaWQ6ICdyZXMvc2NlbmUuanNvbicsXG4gKiAgICAgICAgICB0eXBlOiAnc2NlbmUnLFxuICogICAgICAgICAgbmFtZTogJ3NjZW5lJyxcbiAqICAgICAgICAgIHNraXBzOiBbJ0Rvd25sb2FkZXInXVxuICogICAgICB9XG4gKiAgXSk7XG4gKi9cbnByb3RvLmZsb3dJbiA9IGZ1bmN0aW9uIChpdGVtcykge1xuICAgIHZhciBpLCBwaXBlID0gdGhpcy5fcGlwZXNbMF0sIGl0ZW07XG4gICAgaWYgKHBpcGUpIHtcbiAgICAgICAgLy8gQ2FjaGUgYWxsIGl0ZW1zIGZpcnN0LCBpbiBjYXNlIHN5bmNocm9ub3VzIGxvYWRpbmcgZmxvdyBzYW1lIGl0ZW0gcmVwZWF0bHlcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpdGVtID0gaXRlbXNbaV07XG4gICAgICAgICAgICB0aGlzLl9jYWNoZVtpdGVtLmlkXSA9IGl0ZW07XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpdGVtID0gaXRlbXNbaV07XG4gICAgICAgICAgICBmbG93KHBpcGUsIGl0ZW0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuZmxvd091dChpdGVtc1tpXSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKlxuICogISNlblxuICogTGV0IG5ldyBpdGVtcyBmbG93IGludG8gdGhlIHBpcGVsaW5lIGFuZCBnaXZlIGEgY2FsbGJhY2sgd2hlbiB0aGUgbGlzdCBvZiBpdGVtcyBhcmUgYWxsIGNvbXBsZXRlZC4gPGJyLz5cbiAqIFRoaXMgaXMgZm9yIGxvYWRpbmcgZGVwZW5kZW5jaWVzIGZvciBhbiBleGlzdGluZyBpdGVtIGluIGZsb3csIHVzdWFsbHkgdXNlZCBpbiBhIHBpcGUgbG9naWMuIDxici8+XG4gKiBGb3IgZXhhbXBsZSwgd2UgaGF2ZSBhIGxvYWRlciBmb3Igc2NlbmUgY29uZmlndXJhdGlvbiBmaWxlIGluIEpTT04sIHRoZSBzY2VuZSB3aWxsIG9ubHkgYmUgZnVsbHkgbG9hZGVkICA8YnIvPlxuICogYWZ0ZXIgYWxsIGl0cyBkZXBlbmRlbmNpZXMgYXJlIGxvYWRlZCwgdGhlbiB5b3Ugd2lsbCBuZWVkIHRvIHVzZSBmdW5jdGlvbiB0byBmbG93IGluIGFsbCBkZXBlbmRlbmNpZXMgIDxici8+XG4gKiBmb3VuZCBpbiB0aGUgY29uZmlndXJhdGlvbiBmaWxlLCBhbmQgZmluaXNoIHRoZSBsb2FkZXIgcGlwZSBvbmx5IGFmdGVyIGFsbCBkZXBlbmRlbmNpZXMgYXJlIGxvYWRlZCAoaW4gdGhlIGNhbGxiYWNrKS5cbiAqICEjemhcbiAqIOiuqeaWsCBpdGVtcyDmtYHlhaUgcGlwZWxpbmUg5bm25LiU5b2TIGl0ZW0g5YiX6KGo5a6M5oiQ5pe26L+b6KGM5Zue6LCD5Ye95pWw44CCPGJyLz5cbiAqIOi/meS4qiBBUEkg55qE5L2/55So6YCa5bi45piv5Li65LqG5Yqg6L295L6d6LWW6aG544CCPGJyLz5cbiAqIOS+i+Wmgu+8mjxici8+XG4gKiDmiJHku6zpnIDopoHliqDovb3kuIDkuKrlnLrmma/phY3nva7nmoQgSlNPTiDmlofku7bvvIzor6XlnLrmma/kvJrlsIbmiYDmnInnmoTkvp3otZbpobnlhajpg6jpg73liqDovb3lrozmr5Xku6XlkI7vvIzov5vooYzlm57osIPooajnpLrliqDovb3lrozmr5XjgIJcbiAqIEBtZXRob2QgZmxvd0luRGVwc1xuICogQGRlcHJlY2F0ZWQgc2luY2UgdjEuM1xuICogQHBhcmFtIHtBcnJheX0gdXJsTGlzdFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm4ge0FycmF5fSBJdGVtcyBhY2NlcHRlZCBieSB0aGUgcGlwZWxpbmVcbiAqL1xucHJvdG8uZmxvd0luRGVwcyA9IGZ1bmN0aW9uIChvd25lciwgdXJsTGlzdCwgY2FsbGJhY2spIHtcbiAgICB2YXIgZGVwcyA9IExvYWRpbmdJdGVtcy5jcmVhdGUodGhpcywgZnVuY3Rpb24gKGVycm9ycywgaXRlbXMpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyb3JzLCBpdGVtcyk7XG4gICAgICAgIGl0ZW1zLmRlc3Ryb3koKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZGVwcy5hcHBlbmQodXJsTGlzdCwgb3duZXIpO1xufTtcblxucHJvdG8uZmxvd091dCA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgaWYgKGl0ZW0uZXJyb3IpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2NhY2hlW2l0ZW0uaWRdO1xuICAgIH1cbiAgICBlbHNlIGlmICghdGhpcy5fY2FjaGVbaXRlbS5pZF0pIHtcbiAgICAgICAgdGhpcy5fY2FjaGVbaXRlbS5pZF0gPSBpdGVtO1xuICAgIH1cbiAgICBpdGVtLmNvbXBsZXRlID0gdHJ1ZTtcbiAgICBMb2FkaW5nSXRlbXMuaXRlbUNvbXBsZXRlKGl0ZW0pO1xufTtcblxuLyoqXG4gKiAhI2VuXG4gKiBDb3B5IHRoZSBpdGVtIHN0YXRlcyBmcm9tIG9uZSBzb3VyY2UgaXRlbSB0byBhbGwgZGVzdGluYXRpb24gaXRlbXMuIDxici8+XG4gKiBJdCdzIHF1aXRlIHVzZWZ1bCB3aGVuIGEgcGlwZSBnZW5lcmF0ZSBuZXcgaXRlbXMgZnJvbSBvbmUgc291cmNlIGl0ZW0sPGJyLz5cbiAqIHRoZW4geW91IHNob3VsZCBmbG93SW4gdGhlc2UgZ2VuZXJhdGVkIGl0ZW1zIGludG8gcGlwZWxpbmUsIDxici8+XG4gKiBidXQgeW91IHByb2JhYmx5IHdhbnQgdGhlbSB0byBza2lwIGFsbCBwaXBlcyB0aGUgc291cmNlIGl0ZW0gYWxyZWFkeSBnbyB0aHJvdWdoLDxici8+XG4gKiB5b3UgY2FuIGFjaGlldmUgaXQgd2l0aCB0aGlzIEFQSS4gPGJyLz5cbiAqIDxici8+XG4gKiBGb3IgZXhhbXBsZSwgYW4gdW56aXAgcGlwZSB3aWxsIGdlbmVyYXRlIG1vcmUgaXRlbXMsIGJ1dCB5b3Ugd29uJ3Qgd2FudCB0aGVtIHRvIHBhc3MgdW56aXAgb3IgZG93bmxvYWQgcGlwZSBhZ2Fpbi5cbiAqICEjemhcbiAqIOS7juS4gOS4qua6kCBpdGVtIOWQkeaJgOacieebruaghyBpdGVtIOWkjeWItuWug+eahCBwaXBlIOeKtuaAge+8jOeUqOS6jumBv+WFjemHjeWkjemAmui/h+mDqOWIhiBwaXBl44CCPGJyLz5cbiAqIOW9k+S4gOS4qua6kCBpdGVtIOeUn+aIkOS6huS4gOezu+WIl+aWsOeahCBpdGVtcyDml7blvojmnInnlKjvvIw8YnIvPlxuICog5L2g5biM5pyb6K6p6L+Z5Lqb5paw55qE5L6d6LWW6aG56L+b5YWlIHBpcGVsaW5l77yM5L2G5piv5Y+I5LiN5biM5pyb5a6D5Lus6YCa6L+H5rqQIGl0ZW0g5bey57uP57uP6L+H55qEIHBpcGXvvIw8YnIvPlxuICog5L2G5piv5L2g5Y+v6IO95biM5pyb5LuW5Lus5rqQIGl0ZW0g5bey57uP6YCa6L+H5bm26Lez6L+H5omA5pyJIHBpcGVz77yMPGJyLz5cbiAqIOi/meS4quaXtuWAmeWwseWPr+S7peS9v+eUqOi/meS4qiBBUEnjgIJcbiAqIEBtZXRob2QgY29weUl0ZW1TdGF0ZXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBzcmNJdGVtIFRoZSBzb3VyY2UgaXRlbVxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGRzdEl0ZW1zIEEgc2luZ2xlIGRlc3RpbmF0aW9uIGl0ZW0gb3IgYW4gYXJyYXkgb2YgZGVzdGluYXRpb24gaXRlbXNcbiAqL1xucHJvdG8uY29weUl0ZW1TdGF0ZXMgPSBmdW5jdGlvbiAoc3JjSXRlbSwgZHN0SXRlbXMpIHtcbiAgICBpZiAoIShkc3RJdGVtcyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICBkc3RJdGVtcy5zdGF0ZXMgPSBzcmNJdGVtLnN0YXRlcztcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRzdEl0ZW1zLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGRzdEl0ZW1zW2ldLnN0YXRlcyA9IHNyY0l0ZW0uc3RhdGVzO1xuICAgIH1cbn07XG5cbi8qKlxuICogISNlbiBSZXR1cm5zIGFuIGl0ZW0gaW4gcGlwZWxpbmUuXG4gKiAhI3poIOagueaNriBpZCDojrflj5bkuIDkuKogaXRlbVxuICogQG1ldGhvZCBnZXRJdGVtXG4gKiBAcGFyYW0ge09iamVjdH0gaWQgVGhlIGlkIG9mIHRoZSBpdGVtXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbnByb3RvLmdldEl0ZW0gPSBmdW5jdGlvbiAoaWQpIHtcbiAgICB2YXIgaXRlbSA9IHRoaXMuX2NhY2hlW2lkXTtcblxuICAgIGlmICghaXRlbSlcbiAgICAgICAgcmV0dXJuIGl0ZW07XG5cbiAgICAvLyBkb3dubG9hZGVyLmpzIGRvd25sb2FkVXVpZFxuICAgIGlmIChpdGVtLmFsaWFzKVxuICAgICAgICBpdGVtID0gaXRlbS5hbGlhcztcblxuICAgIHJldHVybiBpdGVtO1xufTtcblxuLyoqXG4gKiAhI2VuIFJlbW92ZXMgYW4gY29tcGxldGVkIGl0ZW0gaW4gcGlwZWxpbmUuXG4gKiBJdCB3aWxsIG9ubHkgcmVtb3ZlIHRoZSBjYWNoZSBpbiB0aGUgcGlwZWxpbmUgb3IgbG9hZGVyLCBpdHMgZGVwZW5kZW5jaWVzIHdvbid0IGJlIHJlbGVhc2VkLlxuICogY2MubG9hZGVyIHByb3ZpZGVkIGFub3RoZXIgbWV0aG9kIHRvIGNvbXBsZXRlbHkgY2xlYW51cCB0aGUgcmVzb3VyY2UgYW5kIGl0cyBkZXBlbmRlbmNpZXMsXG4gKiBwbGVhc2UgcmVmZXIgdG8ge3sjY3Jvc3NMaW5rIFwibG9hZGVyL3JlbGVhc2U6bWV0aG9kXCJ9fWNjLmxvYWRlci5yZWxlYXNle3svY3Jvc3NMaW5rfX1cbiAqICEjemgg56e76Zmk5oyH5a6a55qE5bey5a6M5oiQIGl0ZW3jgIJcbiAqIOi/meWwhuS7heS7heS7jiBwaXBlbGluZSDmiJbogIUgbG9hZGVyIOS4reWIoOmZpOWFtue8k+WtmO+8jOW5tuS4jeS8mumHiuaUvuWug+aJgOS+nei1lueahOi1hOa6kOOAglxuICogY2MubG9hZGVyIOS4reaPkOS+m+S6huWPpuS4gOenjeWIoOmZpOi1hOa6kOWPiuWFtuS+nei1lueahOa4heeQhuaWueazle+8jOivt+WPguiAgyB7eyNjcm9zc0xpbmsgXCJsb2FkZXIvcmVsZWFzZTptZXRob2RcIn19Y2MubG9hZGVyLnJlbGVhc2V7ey9jcm9zc0xpbmt9fVxuICogQG1ldGhvZCByZW1vdmVJdGVtXG4gKiBAcGFyYW0ge09iamVjdH0gaWQgVGhlIGlkIG9mIHRoZSBpdGVtXG4gKiBAcmV0dXJuIHtCb29sZWFufSBzdWNjZWVkIG9yIG5vdFxuICovXG5wcm90by5yZW1vdmVJdGVtID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIHJlbW92ZWQgPSB0aGlzLl9jYWNoZVtpZF07XG4gICAgaWYgKHJlbW92ZWQgJiYgcmVtb3ZlZC5jb21wbGV0ZSkge1xuICAgICAgICBkZWxldGUgdGhpcy5fY2FjaGVbaWRdO1xuICAgIH1cbiAgICByZXR1cm4gcmVtb3ZlZDtcbn07XG5cbi8qKlxuICogISNlbiBDbGVhciB0aGUgY3VycmVudCBwaXBlbGluZSwgdGhpcyBmdW5jdGlvbiB3aWxsIGNsZWFuIHVwIHRoZSBpdGVtcy5cbiAqICEjemgg5riF56m65b2T5YmNIHBpcGVsaW5l77yM6K+l5Ye95pWw5bCG5riF55CGIGl0ZW1z44CCXG4gKiBAbWV0aG9kIGNsZWFyXG4gKi9cbnByb3RvLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIGlkIGluIHRoaXMuX2NhY2hlKSB7XG4gICAgICAgIHZhciBpdGVtID0gdGhpcy5fY2FjaGVbaWRdO1xuICAgICAgICBkZWxldGUgdGhpcy5fY2FjaGVbaWRdO1xuICAgICAgICBpZiAoIWl0ZW0uY29tcGxldGUpIHtcbiAgICAgICAgICAgIGl0ZW0uZXJyb3IgPSBuZXcgRXJyb3IoJ0NhbmNlbGVkIG1hbnVhbGx5Jyk7XG4gICAgICAgICAgICB0aGlzLmZsb3dPdXQoaXRlbSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5jYy5QaXBlbGluZSA9IG1vZHVsZS5leHBvcnRzID0gUGlwZWxpbmU7XG4iXX0=