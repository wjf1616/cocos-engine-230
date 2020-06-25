
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extensions/ccpool/CCNodePool.js';
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

/**
 * !#en
 *  cc.NodePool is the cache pool designed for node type.<br/>
 *  It can helps you to improve your game performance for objects which need frequent release and recreate operations<br/>
 *
 * It's recommended to create cc.NodePool instances by node type, the type corresponds to node type in game design, not the class, 
 * for example, a prefab is a specific node type. <br/>
 * When you create a node pool, you can pass a Component which contains `unuse`, `reuse` functions to control the content of node.<br/>
 *
 * Some common use case is :<br/>
 *      1. Bullets in game (die very soon, massive creation and recreation, no side effect on other objects)<br/>
 *      2. Blocks in candy crash (massive creation and recreation)<br/>
 *      etc...
 * !#zh
 * cc.NodePool 是用于管理节点对象的对象缓存池。<br/>
 * 它可以帮助您提高游戏性能，适用于优化对象的反复创建和销毁<br/>
 * 以前 cocos2d-x 中的 cc.pool 和新的节点事件注册系统不兼容，因此请使用 cc.NodePool 来代替。
 *
 * 新的 NodePool 需要实例化之后才能使用，每种不同的节点对象池需要一个不同的对象池实例，这里的种类对应于游戏中的节点设计，一个 prefab 相当于一个种类的节点。<br/>
 * 在创建缓冲池时，可以传入一个包含 unuse, reuse 函数的组件类型用于节点的回收和复用逻辑。<br/>
 *
 * 一些常见的用例是：<br/>
 *      1.在游戏中的子弹（死亡很快，频繁创建，对其他对象无副作用）<br/>
 *      2.糖果粉碎传奇中的木块（频繁创建）。
 *      等等....
 * @class NodePool
 */

/**
 * !#en
 * Constructor for creating a pool for a specific node template (usually a prefab). You can pass a component (type or name) argument for handling event for reusing and recycling node.
 * !#zh
 * 使用构造函数来创建一个节点专用的对象池，您可以传递一个组件类型或名称，用于处理节点回收和复用时的事件逻辑。
 * @method constructor
 * @param {Function|String} [poolHandlerComp] !#en The constructor or the class name of the component to control the unuse/reuse logic. !#zh 处理节点回收和复用事件逻辑的组件类型或名称。
 * @example
 *  properties: {
 *    template: cc.Prefab
 *  },
 *  onLoad () {
      // MyTemplateHandler is a component with 'unuse' and 'reuse' to handle events when node is reused or recycled.
 *    this.myPool = new cc.NodePool('MyTemplateHandler');
 *  }
 * @typescript
 * constructor(poolHandlerComp?: {prototype: Component}|string)
 */
cc.NodePool = function (poolHandlerComp) {
  /**
   * !#en The pool handler component, it could be the class name or the constructor.
   * !#zh 缓冲池处理组件，用于节点的回收和复用逻辑，这个属性可以是组件类名或组件的构造函数。
   * @property poolHandlerComp
   * @type {Function|String}
   */
  this.poolHandlerComp = poolHandlerComp;
  this._pool = [];
};

cc.NodePool.prototype = {
  constructor: cc.NodePool,

  /**
   * !#en The current available size in the pool
   * !#zh 获取当前缓冲池的可用对象数量
   * @method size
   * @return {Number}
   */
  size: function size() {
    return this._pool.length;
  },

  /**
   * !#en Destroy all cached nodes in the pool
   * !#zh 销毁对象池中缓存的所有节点
   * @method clear
   */
  clear: function clear() {
    var count = this._pool.length;

    for (var i = 0; i < count; ++i) {
      this._pool[i].destroy();
    }

    this._pool.length = 0;
  },

  /**
   * !#en Put a new Node into the pool.
   * It will automatically remove the node from its parent without cleanup.
   * It will also invoke unuse method of the poolHandlerComp if exist.
   * !#zh 向缓冲池中存入一个不再需要的节点对象。
   * 这个函数会自动将目标节点从父节点上移除，但是不会进行 cleanup 操作。
   * 这个函数会调用 poolHandlerComp 的 unuse 函数，如果组件和函数都存在的话。
   * @method put
   * @param {Node} obj
   * @example
   *   let myNode = cc.instantiate(this.template);
   *   this.myPool.put(myNode);
   */
  put: function put(obj) {
    if (obj && this._pool.indexOf(obj) === -1) {
      // Remove from parent, but don't cleanup
      obj.removeFromParent(false); // Invoke pool handler

      var handler = this.poolHandlerComp ? obj.getComponent(this.poolHandlerComp) : null;

      if (handler && handler.unuse) {
        handler.unuse();
      }

      this._pool.push(obj);
    }
  },

  /**
   * !#en Get a obj from pool, if no available object in pool, null will be returned.
   * This function will invoke the reuse function of poolHandlerComp if exist.
   * !#zh 获取对象池中的对象，如果对象池没有可用对象，则返回空。
   * 这个函数会调用 poolHandlerComp 的 reuse 函数，如果组件和函数都存在的话。
   * @method get
   * @param {any} ...params - !#en Params to pass to 'reuse' method in poolHandlerComp !#zh 向 poolHandlerComp 中的 'reuse' 函数传递的参数
   * @return {Node|null}
   * @example
   *   let newNode = this.myPool.get();
   */
  get: function get() {
    var last = this._pool.length - 1;

    if (last < 0) {
      return null;
    } else {
      // Pop the last object in pool
      var obj = this._pool[last];
      this._pool.length = last; // Invoke pool handler

      var handler = this.poolHandlerComp ? obj.getComponent(this.poolHandlerComp) : null;

      if (handler && handler.reuse) {
        handler.reuse.apply(handler, arguments);
      }

      return obj;
    }
  }
};
module.exports = cc.NodePool;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDTm9kZVBvb2wuanMiXSwibmFtZXMiOlsiY2MiLCJOb2RlUG9vbCIsInBvb2xIYW5kbGVyQ29tcCIsIl9wb29sIiwicHJvdG90eXBlIiwiY29uc3RydWN0b3IiLCJzaXplIiwibGVuZ3RoIiwiY2xlYXIiLCJjb3VudCIsImkiLCJkZXN0cm95IiwicHV0Iiwib2JqIiwiaW5kZXhPZiIsInJlbW92ZUZyb21QYXJlbnQiLCJoYW5kbGVyIiwiZ2V0Q29tcG9uZW50IiwidW51c2UiLCJwdXNoIiwiZ2V0IiwibGFzdCIsInJldXNlIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE0QkE7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCQUEsRUFBRSxDQUFDQyxRQUFILEdBQWMsVUFBVUMsZUFBVixFQUEyQjtBQUNyQzs7Ozs7O0FBTUEsT0FBS0EsZUFBTCxHQUF1QkEsZUFBdkI7QUFDQSxPQUFLQyxLQUFMLEdBQWEsRUFBYjtBQUNILENBVEQ7O0FBVUFILEVBQUUsQ0FBQ0MsUUFBSCxDQUFZRyxTQUFaLEdBQXdCO0FBQ3BCQyxFQUFBQSxXQUFXLEVBQUVMLEVBQUUsQ0FBQ0MsUUFESTs7QUFHcEI7Ozs7OztBQU1BSyxFQUFBQSxJQUFJLEVBQUUsZ0JBQVk7QUFDZCxXQUFPLEtBQUtILEtBQUwsQ0FBV0ksTUFBbEI7QUFDSCxHQVhtQjs7QUFhcEI7Ozs7O0FBS0FDLEVBQUFBLEtBQUssRUFBRSxpQkFBWTtBQUNmLFFBQUlDLEtBQUssR0FBRyxLQUFLTixLQUFMLENBQVdJLE1BQXZCOztBQUNBLFNBQUssSUFBSUcsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0QsS0FBcEIsRUFBMkIsRUFBRUMsQ0FBN0IsRUFBZ0M7QUFDNUIsV0FBS1AsS0FBTCxDQUFXTyxDQUFYLEVBQWNDLE9BQWQ7QUFDSDs7QUFDRCxTQUFLUixLQUFMLENBQVdJLE1BQVgsR0FBb0IsQ0FBcEI7QUFDSCxHQXhCbUI7O0FBMEJwQjs7Ozs7Ozs7Ozs7OztBQWFBSyxFQUFBQSxHQUFHLEVBQUUsYUFBVUMsR0FBVixFQUFlO0FBQ2hCLFFBQUlBLEdBQUcsSUFBSSxLQUFLVixLQUFMLENBQVdXLE9BQVgsQ0FBbUJELEdBQW5CLE1BQTRCLENBQUMsQ0FBeEMsRUFBMkM7QUFDdkM7QUFDQUEsTUFBQUEsR0FBRyxDQUFDRSxnQkFBSixDQUFxQixLQUFyQixFQUZ1QyxDQUl2Qzs7QUFDQSxVQUFJQyxPQUFPLEdBQUcsS0FBS2QsZUFBTCxHQUF1QlcsR0FBRyxDQUFDSSxZQUFKLENBQWlCLEtBQUtmLGVBQXRCLENBQXZCLEdBQWdFLElBQTlFOztBQUNBLFVBQUljLE9BQU8sSUFBSUEsT0FBTyxDQUFDRSxLQUF2QixFQUE4QjtBQUMxQkYsUUFBQUEsT0FBTyxDQUFDRSxLQUFSO0FBQ0g7O0FBRUQsV0FBS2YsS0FBTCxDQUFXZ0IsSUFBWCxDQUFnQk4sR0FBaEI7QUFDSDtBQUNKLEdBcERtQjs7QUFzRHBCOzs7Ozs7Ozs7OztBQVdBTyxFQUFBQSxHQUFHLEVBQUUsZUFBWTtBQUNiLFFBQUlDLElBQUksR0FBRyxLQUFLbEIsS0FBTCxDQUFXSSxNQUFYLEdBQWtCLENBQTdCOztBQUNBLFFBQUljLElBQUksR0FBRyxDQUFYLEVBQWM7QUFDVixhQUFPLElBQVA7QUFDSCxLQUZELE1BR0s7QUFDRDtBQUNBLFVBQUlSLEdBQUcsR0FBRyxLQUFLVixLQUFMLENBQVdrQixJQUFYLENBQVY7QUFDQSxXQUFLbEIsS0FBTCxDQUFXSSxNQUFYLEdBQW9CYyxJQUFwQixDQUhDLENBS0Q7O0FBQ0EsVUFBSUwsT0FBTyxHQUFHLEtBQUtkLGVBQUwsR0FBdUJXLEdBQUcsQ0FBQ0ksWUFBSixDQUFpQixLQUFLZixlQUF0QixDQUF2QixHQUFnRSxJQUE5RTs7QUFDQSxVQUFJYyxPQUFPLElBQUlBLE9BQU8sQ0FBQ00sS0FBdkIsRUFBOEI7QUFDMUJOLFFBQUFBLE9BQU8sQ0FBQ00sS0FBUixDQUFjQyxLQUFkLENBQW9CUCxPQUFwQixFQUE2QlEsU0FBN0I7QUFDSDs7QUFDRCxhQUFPWCxHQUFQO0FBQ0g7QUFDSjtBQWxGbUIsQ0FBeEI7QUFxRkFZLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjFCLEVBQUUsQ0FBQ0MsUUFBcEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwOi8vd3d3LmNvY29zMmQteC5vcmdcblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qKlxuICogISNlblxuICogIGNjLk5vZGVQb29sIGlzIHRoZSBjYWNoZSBwb29sIGRlc2lnbmVkIGZvciBub2RlIHR5cGUuPGJyLz5cbiAqICBJdCBjYW4gaGVscHMgeW91IHRvIGltcHJvdmUgeW91ciBnYW1lIHBlcmZvcm1hbmNlIGZvciBvYmplY3RzIHdoaWNoIG5lZWQgZnJlcXVlbnQgcmVsZWFzZSBhbmQgcmVjcmVhdGUgb3BlcmF0aW9uczxici8+XG4gKlxuICogSXQncyByZWNvbW1lbmRlZCB0byBjcmVhdGUgY2MuTm9kZVBvb2wgaW5zdGFuY2VzIGJ5IG5vZGUgdHlwZSwgdGhlIHR5cGUgY29ycmVzcG9uZHMgdG8gbm9kZSB0eXBlIGluIGdhbWUgZGVzaWduLCBub3QgdGhlIGNsYXNzLCBcbiAqIGZvciBleGFtcGxlLCBhIHByZWZhYiBpcyBhIHNwZWNpZmljIG5vZGUgdHlwZS4gPGJyLz5cbiAqIFdoZW4geW91IGNyZWF0ZSBhIG5vZGUgcG9vbCwgeW91IGNhbiBwYXNzIGEgQ29tcG9uZW50IHdoaWNoIGNvbnRhaW5zIGB1bnVzZWAsIGByZXVzZWAgZnVuY3Rpb25zIHRvIGNvbnRyb2wgdGhlIGNvbnRlbnQgb2Ygbm9kZS48YnIvPlxuICpcbiAqIFNvbWUgY29tbW9uIHVzZSBjYXNlIGlzIDo8YnIvPlxuICogICAgICAxLiBCdWxsZXRzIGluIGdhbWUgKGRpZSB2ZXJ5IHNvb24sIG1hc3NpdmUgY3JlYXRpb24gYW5kIHJlY3JlYXRpb24sIG5vIHNpZGUgZWZmZWN0IG9uIG90aGVyIG9iamVjdHMpPGJyLz5cbiAqICAgICAgMi4gQmxvY2tzIGluIGNhbmR5IGNyYXNoIChtYXNzaXZlIGNyZWF0aW9uIGFuZCByZWNyZWF0aW9uKTxici8+XG4gKiAgICAgIGV0Yy4uLlxuICogISN6aFxuICogY2MuTm9kZVBvb2wg5piv55So5LqO566h55CG6IqC54K55a+56LGh55qE5a+56LGh57yT5a2Y5rGg44CCPGJyLz5cbiAqIOWug+WPr+S7peW4ruWKqeaCqOaPkOmrmOa4uOaIj+aAp+iDve+8jOmAgueUqOS6juS8mOWMluWvueixoeeahOWPjeWkjeWIm+W7uuWSjOmUgOavgTxici8+XG4gKiDku6XliY0gY29jb3MyZC14IOS4reeahCBjYy5wb29sIOWSjOaWsOeahOiKgueCueS6i+S7tuazqOWGjOezu+e7n+S4jeWFvOWuue+8jOWboOatpOivt+S9v+eUqCBjYy5Ob2RlUG9vbCDmnaXku6Pmm7/jgIJcbiAqXG4gKiDmlrDnmoQgTm9kZVBvb2wg6ZyA6KaB5a6e5L6L5YyW5LmL5ZCO5omN6IO95L2/55So77yM5q+P56eN5LiN5ZCM55qE6IqC54K55a+56LGh5rGg6ZyA6KaB5LiA5Liq5LiN5ZCM55qE5a+56LGh5rGg5a6e5L6L77yM6L+Z6YeM55qE56eN57G75a+55bqU5LqO5ri45oiP5Lit55qE6IqC54K56K6+6K6h77yM5LiA5LiqIHByZWZhYiDnm7jlvZPkuo7kuIDkuKrnp43nsbvnmoToioLngrnjgII8YnIvPlxuICog5Zyo5Yib5bu657yT5Yay5rGg5pe277yM5Y+v5Lul5Lyg5YWl5LiA5Liq5YyF5ZCrIHVudXNlLCByZXVzZSDlh73mlbDnmoTnu4Tku7bnsbvlnovnlKjkuo7oioLngrnnmoTlm57mlLblkozlpI3nlKjpgLvovpHjgII8YnIvPlxuICpcbiAqIOS4gOS6m+W4uOingeeahOeUqOS+i+aYr++8mjxici8+XG4gKiAgICAgIDEu5Zyo5ri45oiP5Lit55qE5a2Q5by577yI5q275Lqh5b6I5b+r77yM6aKR57mB5Yib5bu677yM5a+55YW25LuW5a+56LGh5peg5Ymv5L2c55So77yJPGJyLz5cbiAqICAgICAgMi7ns5bmnpznsonnoo7kvKDlpYfkuK3nmoTmnKjlnZfvvIjpopHnuYHliJvlu7rvvInjgIJcbiAqICAgICAg562J562JLi4uLlxuICogQGNsYXNzIE5vZGVQb29sXG4gKi9cblxuLyoqXG4gKiAhI2VuXG4gKiBDb25zdHJ1Y3RvciBmb3IgY3JlYXRpbmcgYSBwb29sIGZvciBhIHNwZWNpZmljIG5vZGUgdGVtcGxhdGUgKHVzdWFsbHkgYSBwcmVmYWIpLiBZb3UgY2FuIHBhc3MgYSBjb21wb25lbnQgKHR5cGUgb3IgbmFtZSkgYXJndW1lbnQgZm9yIGhhbmRsaW5nIGV2ZW50IGZvciByZXVzaW5nIGFuZCByZWN5Y2xpbmcgbm9kZS5cbiAqICEjemhcbiAqIOS9v+eUqOaehOmAoOWHveaVsOadpeWIm+W7uuS4gOS4quiKgueCueS4k+eUqOeahOWvueixoeaxoO+8jOaCqOWPr+S7peS8oOmAkuS4gOS4que7hOS7tuexu+Wei+aIluWQjeensO+8jOeUqOS6juWkhOeQhuiKgueCueWbnuaUtuWSjOWkjeeUqOaXtueahOS6i+S7tumAu+i+keOAglxuICogQG1ldGhvZCBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtGdW5jdGlvbnxTdHJpbmd9IFtwb29sSGFuZGxlckNvbXBdICEjZW4gVGhlIGNvbnN0cnVjdG9yIG9yIHRoZSBjbGFzcyBuYW1lIG9mIHRoZSBjb21wb25lbnQgdG8gY29udHJvbCB0aGUgdW51c2UvcmV1c2UgbG9naWMuICEjemgg5aSE55CG6IqC54K55Zue5pS25ZKM5aSN55So5LqL5Lu26YC76L6R55qE57uE5Lu257G75Z6L5oiW5ZCN56ew44CCXG4gKiBAZXhhbXBsZVxuICogIHByb3BlcnRpZXM6IHtcbiAqICAgIHRlbXBsYXRlOiBjYy5QcmVmYWJcbiAqICB9LFxuICogIG9uTG9hZCAoKSB7XG4gICAgICAvLyBNeVRlbXBsYXRlSGFuZGxlciBpcyBhIGNvbXBvbmVudCB3aXRoICd1bnVzZScgYW5kICdyZXVzZScgdG8gaGFuZGxlIGV2ZW50cyB3aGVuIG5vZGUgaXMgcmV1c2VkIG9yIHJlY3ljbGVkLlxuICogICAgdGhpcy5teVBvb2wgPSBuZXcgY2MuTm9kZVBvb2woJ015VGVtcGxhdGVIYW5kbGVyJyk7XG4gKiAgfVxuICogQHR5cGVzY3JpcHRcbiAqIGNvbnN0cnVjdG9yKHBvb2xIYW5kbGVyQ29tcD86IHtwcm90b3R5cGU6IENvbXBvbmVudH18c3RyaW5nKVxuICovXG5jYy5Ob2RlUG9vbCA9IGZ1bmN0aW9uIChwb29sSGFuZGxlckNvbXApIHtcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBwb29sIGhhbmRsZXIgY29tcG9uZW50LCBpdCBjb3VsZCBiZSB0aGUgY2xhc3MgbmFtZSBvciB0aGUgY29uc3RydWN0b3IuXG4gICAgICogISN6aCDnvJPlhrLmsaDlpITnkIbnu4Tku7bvvIznlKjkuo7oioLngrnnmoTlm57mlLblkozlpI3nlKjpgLvovpHvvIzov5nkuKrlsZ7mgKflj6/ku6XmmK/nu4Tku7bnsbvlkI3miJbnu4Tku7bnmoTmnoTpgKDlh73mlbDjgIJcbiAgICAgKiBAcHJvcGVydHkgcG9vbEhhbmRsZXJDb21wXG4gICAgICogQHR5cGUge0Z1bmN0aW9ufFN0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLnBvb2xIYW5kbGVyQ29tcCA9IHBvb2xIYW5kbGVyQ29tcDtcbiAgICB0aGlzLl9wb29sID0gW107XG59O1xuY2MuTm9kZVBvb2wucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBjYy5Ob2RlUG9vbCxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGN1cnJlbnQgYXZhaWxhYmxlIHNpemUgaW4gdGhlIHBvb2xcbiAgICAgKiAhI3poIOiOt+WPluW9k+WJjee8k+WGsuaxoOeahOWPr+eUqOWvueixoeaVsOmHj1xuICAgICAqIEBtZXRob2Qgc2l6ZVxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBzaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wb29sLmxlbmd0aDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBEZXN0cm95IGFsbCBjYWNoZWQgbm9kZXMgaW4gdGhlIHBvb2xcbiAgICAgKiAhI3poIOmUgOavgeWvueixoeaxoOS4ree8k+WtmOeahOaJgOacieiKgueCuVxuICAgICAqIEBtZXRob2QgY2xlYXJcbiAgICAgKi9cbiAgICBjbGVhcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY291bnQgPSB0aGlzLl9wb29sLmxlbmd0aDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgKytpKSB7XG4gICAgICAgICAgICB0aGlzLl9wb29sW2ldLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9wb29sLmxlbmd0aCA9IDA7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUHV0IGEgbmV3IE5vZGUgaW50byB0aGUgcG9vbC5cbiAgICAgKiBJdCB3aWxsIGF1dG9tYXRpY2FsbHkgcmVtb3ZlIHRoZSBub2RlIGZyb20gaXRzIHBhcmVudCB3aXRob3V0IGNsZWFudXAuXG4gICAgICogSXQgd2lsbCBhbHNvIGludm9rZSB1bnVzZSBtZXRob2Qgb2YgdGhlIHBvb2xIYW5kbGVyQ29tcCBpZiBleGlzdC5cbiAgICAgKiAhI3poIOWQkee8k+WGsuaxoOS4reWtmOWFpeS4gOS4quS4jeWGjemcgOimgeeahOiKgueCueWvueixoeOAglxuICAgICAqIOi/meS4quWHveaVsOS8muiHquWKqOWwhuebruagh+iKgueCueS7jueItuiKgueCueS4iuenu+mZpO+8jOS9huaYr+S4jeS8mui/m+ihjCBjbGVhbnVwIOaTjeS9nOOAglxuICAgICAqIOi/meS4quWHveaVsOS8muiwg+eUqCBwb29sSGFuZGxlckNvbXAg55qEIHVudXNlIOWHveaVsO+8jOWmguaenOe7hOS7tuWSjOWHveaVsOmDveWtmOWcqOeahOivneOAglxuICAgICAqIEBtZXRob2QgcHV0XG4gICAgICogQHBhcmFtIHtOb2RlfSBvYmpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqICAgbGV0IG15Tm9kZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMudGVtcGxhdGUpO1xuICAgICAqICAgdGhpcy5teVBvb2wucHV0KG15Tm9kZSk7XG4gICAgICovXG4gICAgcHV0OiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIGlmIChvYmogJiYgdGhpcy5fcG9vbC5pbmRleE9mKG9iaikgPT09IC0xKSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgZnJvbSBwYXJlbnQsIGJ1dCBkb24ndCBjbGVhbnVwXG4gICAgICAgICAgICBvYmoucmVtb3ZlRnJvbVBhcmVudChmYWxzZSk7XG5cbiAgICAgICAgICAgIC8vIEludm9rZSBwb29sIGhhbmRsZXJcbiAgICAgICAgICAgIHZhciBoYW5kbGVyID0gdGhpcy5wb29sSGFuZGxlckNvbXAgPyBvYmouZ2V0Q29tcG9uZW50KHRoaXMucG9vbEhhbmRsZXJDb21wKSA6IG51bGw7XG4gICAgICAgICAgICBpZiAoaGFuZGxlciAmJiBoYW5kbGVyLnVudXNlKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlci51bnVzZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9wb29sLnB1c2gob2JqKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldCBhIG9iaiBmcm9tIHBvb2wsIGlmIG5vIGF2YWlsYWJsZSBvYmplY3QgaW4gcG9vbCwgbnVsbCB3aWxsIGJlIHJldHVybmVkLlxuICAgICAqIFRoaXMgZnVuY3Rpb24gd2lsbCBpbnZva2UgdGhlIHJldXNlIGZ1bmN0aW9uIG9mIHBvb2xIYW5kbGVyQ29tcCBpZiBleGlzdC5cbiAgICAgKiAhI3poIOiOt+WPluWvueixoeaxoOS4reeahOWvueixoe+8jOWmguaenOWvueixoeaxoOayoeacieWPr+eUqOWvueixoe+8jOWImei/lOWbnuepuuOAglxuICAgICAqIOi/meS4quWHveaVsOS8muiwg+eUqCBwb29sSGFuZGxlckNvbXAg55qEIHJldXNlIOWHveaVsO+8jOWmguaenOe7hOS7tuWSjOWHveaVsOmDveWtmOWcqOeahOivneOAglxuICAgICAqIEBtZXRob2QgZ2V0XG4gICAgICogQHBhcmFtIHthbnl9IC4uLnBhcmFtcyAtICEjZW4gUGFyYW1zIHRvIHBhc3MgdG8gJ3JldXNlJyBtZXRob2QgaW4gcG9vbEhhbmRsZXJDb21wICEjemgg5ZCRIHBvb2xIYW5kbGVyQ29tcCDkuK3nmoQgJ3JldXNlJyDlh73mlbDkvKDpgJLnmoTlj4LmlbBcbiAgICAgKiBAcmV0dXJuIHtOb2RlfG51bGx9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAgIGxldCBuZXdOb2RlID0gdGhpcy5teVBvb2wuZ2V0KCk7XG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsYXN0ID0gdGhpcy5fcG9vbC5sZW5ndGgtMTtcbiAgICAgICAgaWYgKGxhc3QgPCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIFBvcCB0aGUgbGFzdCBvYmplY3QgaW4gcG9vbFxuICAgICAgICAgICAgdmFyIG9iaiA9IHRoaXMuX3Bvb2xbbGFzdF07XG4gICAgICAgICAgICB0aGlzLl9wb29sLmxlbmd0aCA9IGxhc3Q7XG5cbiAgICAgICAgICAgIC8vIEludm9rZSBwb29sIGhhbmRsZXJcbiAgICAgICAgICAgIHZhciBoYW5kbGVyID0gdGhpcy5wb29sSGFuZGxlckNvbXAgPyBvYmouZ2V0Q29tcG9uZW50KHRoaXMucG9vbEhhbmRsZXJDb21wKSA6IG51bGw7XG4gICAgICAgICAgICBpZiAoaGFuZGxlciAmJiBoYW5kbGVyLnJldXNlKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlci5yZXVzZS5hcHBseShoYW5kbGVyLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY2MuTm9kZVBvb2w7Il19