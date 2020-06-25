
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/actions/CCActionManager.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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
require('../core/platform/CCClass');

var js = require('../core/platform/js');
/*
 * @class HashElement
 * @constructor
 * @private
 */


var HashElement = function HashElement() {
  this.actions = [];
  this.target = null; //ccobject

  this.actionIndex = 0;
  this.currentAction = null; //CCAction

  this.paused = false;
  this.lock = false;
};
/**
 * !#en
 * cc.ActionManager is a class that can manage actions.<br/>
 * Normally you won't need to use this class directly. 99% of the cases you will use the CCNode interface,
 * which uses this class's singleton object.
 * But there are some cases where you might need to use this class. <br/>
 * Examples:<br/>
 * - When you want to run an action where the target is different from a CCNode.<br/>
 * - When you want to pause / resume the actions<br/>
 * !#zh
 * cc.ActionManager 是可以管理动作的单例类。<br/>
 * 通常你并不需要直接使用这个类，99%的情况您将使用 CCNode 的接口。<br/>
 * 但也有一些情况下，您可能需要使用这个类。 <br/>
 * 例如：
 *  - 当你想要运行一个动作，但目标不是 CCNode 类型时。 <br/>
 *  - 当你想要暂停/恢复动作时。 <br/>
 * @class ActionManager
 * @example {@link cocos2d/core/CCActionManager/ActionManager.js}
 */


cc.ActionManager = function () {
  this._hashTargets = js.createMap(true);
  this._arrayTargets = [];
  this._currentTarget = null;
  cc.director._scheduler && cc.director._scheduler.enableForTarget(this);
};

cc.ActionManager.prototype = {
  constructor: cc.ActionManager,
  _elementPool: [],
  _searchElementByTarget: function _searchElementByTarget(arr, target) {
    for (var k = 0; k < arr.length; k++) {
      if (target === arr[k].target) return arr[k];
    }

    return null;
  },
  _getElement: function _getElement(target, paused) {
    var element = this._elementPool.pop();

    if (!element) {
      element = new HashElement();
    }

    element.target = target;
    element.paused = !!paused;
    return element;
  },
  _putElement: function _putElement(element) {
    element.actions.length = 0;
    element.actionIndex = 0;
    element.currentAction = null;
    element.paused = false;
    element.target = null;
    element.lock = false;

    this._elementPool.push(element);
  },

  /**
   * !#en
   * Adds an action with a target.<br/>
   * If the target is already present, then the action will be added to the existing target.
   * If the target is not present, a new instance of this target will be created either paused or not, and the action will be added to the newly created target.
   * When the target is paused, the queued actions won't be 'ticked'.
   * !#zh
   * 增加一个动作，同时还需要提供动作的目标对象，目标对象是否暂停作为参数。<br/>
   * 如果目标已存在，动作将会被直接添加到现有的节点中。<br/>
   * 如果目标不存在，将为这一目标创建一个新的实例，并将动作添加进去。<br/>
   * 当目标状态的 paused 为 true，动作将不会被执行
   *
   * @method addAction
   * @param {Action} action
   * @param {Node} target
   * @param {Boolean} paused
   */
  addAction: function addAction(action, target, paused) {
    if (!action || !target) {
      cc.errorID(1000);
      return;
    } //check if the action target already exists


    var element = this._hashTargets[target._id]; //if doesn't exists, create a hashelement and push in mpTargets

    if (!element) {
      element = this._getElement(target, paused);
      this._hashTargets[target._id] = element;

      this._arrayTargets.push(element);
    } else if (!element.actions) {
      element.actions = [];
    }

    element.actions.push(action);
    action.startWithTarget(target);
  },

  /**
   * !#en Removes all actions from all the targets.
   * !#zh 移除所有对象的所有动作。
   * @method removeAllActions
   */
  removeAllActions: function removeAllActions() {
    var locTargets = this._arrayTargets;

    for (var i = 0; i < locTargets.length; i++) {
      var element = locTargets[i];
      if (element) this._putElement(element);
    }

    this._arrayTargets.length = 0;
    this._hashTargets = js.createMap(true);
  },

  /**
   * !#en
   * Removes all actions from a certain target. <br/>
   * All the actions that belongs to the target will be removed.
   * !#zh
   * 移除指定对象上的所有动作。<br/>
   * 属于该目标的所有的动作将被删除。
   * @method removeAllActionsFromTarget
   * @param {Node} target
   * @param {Boolean} forceDelete
   */
  removeAllActionsFromTarget: function removeAllActionsFromTarget(target, forceDelete) {
    // explicit null handling
    if (target == null) return;
    var element = this._hashTargets[target._id];

    if (element) {
      element.actions.length = 0;

      this._deleteHashElement(element);
    }
  },

  /**
   * !#en Removes an action given an action reference.
   * !#zh 移除指定的动作。
   * @method removeAction 
   * @param {Action} action
   */
  removeAction: function removeAction(action) {
    // explicit null handling
    if (action == null) return;
    var target = action.getOriginalTarget();
    var element = this._hashTargets[target._id];

    if (element) {
      for (var i = 0; i < element.actions.length; i++) {
        if (element.actions[i] === action) {
          element.actions.splice(i, 1); // update actionIndex in case we are in tick. looping over the actions

          if (element.actionIndex >= i) element.actionIndex--;
          break;
        }
      }
    } else {
      cc.logID(1001);
    }
  },

  /**
   * !#en Removes an action given its tag and the target.
   * !#zh 删除指定对象下特定标签的一个动作，将删除首个匹配到的动作。
   * @method removeActionByTag
   * @param {Number} tag
   * @param {Node} target
   */
  removeActionByTag: function removeActionByTag(tag, target) {
    if (tag === cc.Action.TAG_INVALID) cc.logID(1002);
    cc.assertID(target, 1003);
    var element = this._hashTargets[target._id];

    if (element) {
      var limit = element.actions.length;

      for (var i = 0; i < limit; ++i) {
        var action = element.actions[i];

        if (action && action.getTag() === tag && action.getOriginalTarget() === target) {
          this._removeActionAtIndex(i, element);

          break;
        }
      }
    }
  },

  /**
   * !#en Gets an action given its tag an a target.
   * !#zh 通过目标对象和标签获取一个动作。
   * @method getActionByTag
   * @param {Number} tag
   * @param {Node} target
   * @return {Action|Null}  return the Action with the given tag on success
   */
  getActionByTag: function getActionByTag(tag, target) {
    if (tag === cc.Action.TAG_INVALID) cc.logID(1004);
    var element = this._hashTargets[target._id];

    if (element) {
      if (element.actions != null) {
        for (var i = 0; i < element.actions.length; ++i) {
          var action = element.actions[i];
          if (action && action.getTag() === tag) return action;
        }
      }

      cc.logID(1005, tag);
    }

    return null;
  },

  /**
   * !#en
   * Returns the numbers of actions that are running in a certain target. <br/>
   * Composable actions are counted as 1 action. <br/>
   * Example: <br/>
   * - If you are running 1 Sequence of 7 actions, it will return 1. <br/>
   * - If you are running 7 Sequences of 2 actions, it will return 7.
   * !#zh
   * 返回指定对象下所有正在运行的动作数量。 <br/>
   * 组合动作被算作一个动作。<br/>
   * 例如：<br/>
   *  - 如果您正在运行 7 个动作组成的序列动作（Sequence），这个函数将返回 1。<br/>
   *  - 如果你正在运行 2 个序列动作（Sequence）和 5 个普通动作，这个函数将返回 7。<br/>
   *
   * @method getNumberOfRunningActionsInTarget
   * @param {Node} target
   * @return {Number}
   */
  getNumberOfRunningActionsInTarget: function getNumberOfRunningActionsInTarget(target) {
    var element = this._hashTargets[target._id];
    if (element) return element.actions ? element.actions.length : 0;
    return 0;
  },

  /**
   * !#en Pauses the target: all running actions and newly added actions will be paused.
   * !#zh 暂停指定对象：所有正在运行的动作和新添加的动作都将会暂停。
   * @method pauseTarget
   * @param {Node} target
   */
  pauseTarget: function pauseTarget(target) {
    var element = this._hashTargets[target._id];
    if (element) element.paused = true;
  },

  /**
   * !#en Resumes the target. All queued actions will be resumed.
   * !#zh 让指定目标恢复运行。在执行序列中所有被暂停的动作将重新恢复运行。
   * @method resumeTarget
   * @param {Node} target
   */
  resumeTarget: function resumeTarget(target) {
    var element = this._hashTargets[target._id];
    if (element) element.paused = false;
  },

  /**
   * !#en Pauses all running actions, returning a list of targets whose actions were paused.
   * !#zh 暂停所有正在运行的动作，返回一个包含了那些动作被暂停了的目标对象的列表。
   * @method pauseAllRunningActions
   * @return {Array}  a list of targets whose actions were paused.
   */
  pauseAllRunningActions: function pauseAllRunningActions() {
    var idsWithActions = [];
    var locTargets = this._arrayTargets;

    for (var i = 0; i < locTargets.length; i++) {
      var element = locTargets[i];

      if (element && !element.paused) {
        element.paused = true;
        idsWithActions.push(element.target);
      }
    }

    return idsWithActions;
  },

  /**
   * !#en Resume a set of targets (convenience function to reverse a pauseAllRunningActions or pauseTargets call).
   * !#zh 让一组指定对象恢复运行（用来逆转 pauseAllRunningActions 效果的便捷函数）。
   * @method resumeTargets
   * @param {Array} targetsToResume
   */
  resumeTargets: function resumeTargets(targetsToResume) {
    if (!targetsToResume) return;

    for (var i = 0; i < targetsToResume.length; i++) {
      if (targetsToResume[i]) this.resumeTarget(targetsToResume[i]);
    }
  },

  /**
   * !#en Pause a set of targets.
   * !#zh 暂停一组指定对象。
   * @method pauseTargets
   * @param {Array} targetsToPause
   */
  pauseTargets: function pauseTargets(targetsToPause) {
    if (!targetsToPause) return;

    for (var i = 0; i < targetsToPause.length; i++) {
      if (targetsToPause[i]) this.pauseTarget(targetsToPause[i]);
    }
  },

  /**
   * !#en
   * purges the shared action manager. It releases the retained instance. <br/>
   * because it uses this, so it can not be static.
   * !#zh
   * 清除共用的动作管理器。它释放了持有的实例。 <br/>
   * 因为它使用 this，因此它不能是静态的。
   * @method purgeSharedManager
   */
  purgeSharedManager: function purgeSharedManager() {
    cc.director.getScheduler().unscheduleUpdate(this);
  },
  //protected
  _removeActionAtIndex: function _removeActionAtIndex(index, element) {
    var action = element.actions[index];
    element.actions.splice(index, 1); // update actionIndex in case we are in tick. looping over the actions

    if (element.actionIndex >= index) element.actionIndex--;

    if (element.actions.length === 0) {
      this._deleteHashElement(element);
    }
  },
  _deleteHashElement: function _deleteHashElement(element) {
    var ret = false;

    if (element && !element.lock) {
      if (this._hashTargets[element.target._id]) {
        delete this._hashTargets[element.target._id];
        var targets = this._arrayTargets;

        for (var i = 0, l = targets.length; i < l; i++) {
          if (targets[i] === element) {
            targets.splice(i, 1);
            break;
          }
        }

        this._putElement(element);

        ret = true;
      }
    }

    return ret;
  },

  /**
   * !#en The ActionManager update。
   * !#zh ActionManager 主循环。
   * @method update
   * @param {Number} dt delta time in seconds
   */
  update: function update(dt) {
    var locTargets = this._arrayTargets,
        locCurrTarget;

    for (var elt = 0; elt < locTargets.length; elt++) {
      this._currentTarget = locTargets[elt];
      locCurrTarget = this._currentTarget;

      if (!locCurrTarget.paused && locCurrTarget.actions) {
        locCurrTarget.lock = true; // The 'actions' CCMutableArray may change while inside this loop.

        for (locCurrTarget.actionIndex = 0; locCurrTarget.actionIndex < locCurrTarget.actions.length; locCurrTarget.actionIndex++) {
          locCurrTarget.currentAction = locCurrTarget.actions[locCurrTarget.actionIndex];
          if (!locCurrTarget.currentAction) continue; //use for speed

          locCurrTarget.currentAction.step(dt * (locCurrTarget.currentAction._speedMethod ? locCurrTarget.currentAction._speed : 1));

          if (locCurrTarget.currentAction && locCurrTarget.currentAction.isDone()) {
            locCurrTarget.currentAction.stop();
            var action = locCurrTarget.currentAction; // Make currentAction nil to prevent removeAction from salvaging it.

            locCurrTarget.currentAction = null;
            this.removeAction(action);
          }

          locCurrTarget.currentAction = null;
        }

        locCurrTarget.lock = false;
      } // only delete currentTarget if no actions were scheduled during the cycle (issue #481)


      if (locCurrTarget.actions.length === 0) {
        this._deleteHashElement(locCurrTarget) && elt--;
      }
    }
  }
};

if (CC_TEST) {
  cc.ActionManager.prototype.isTargetPaused_TEST = function (target) {
    var element = this._hashTargets[target._id];
    return element.paused;
  };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDQWN0aW9uTWFuYWdlci5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwianMiLCJIYXNoRWxlbWVudCIsImFjdGlvbnMiLCJ0YXJnZXQiLCJhY3Rpb25JbmRleCIsImN1cnJlbnRBY3Rpb24iLCJwYXVzZWQiLCJsb2NrIiwiY2MiLCJBY3Rpb25NYW5hZ2VyIiwiX2hhc2hUYXJnZXRzIiwiY3JlYXRlTWFwIiwiX2FycmF5VGFyZ2V0cyIsIl9jdXJyZW50VGFyZ2V0IiwiZGlyZWN0b3IiLCJfc2NoZWR1bGVyIiwiZW5hYmxlRm9yVGFyZ2V0IiwicHJvdG90eXBlIiwiY29uc3RydWN0b3IiLCJfZWxlbWVudFBvb2wiLCJfc2VhcmNoRWxlbWVudEJ5VGFyZ2V0IiwiYXJyIiwiayIsImxlbmd0aCIsIl9nZXRFbGVtZW50IiwiZWxlbWVudCIsInBvcCIsIl9wdXRFbGVtZW50IiwicHVzaCIsImFkZEFjdGlvbiIsImFjdGlvbiIsImVycm9ySUQiLCJfaWQiLCJzdGFydFdpdGhUYXJnZXQiLCJyZW1vdmVBbGxBY3Rpb25zIiwibG9jVGFyZ2V0cyIsImkiLCJyZW1vdmVBbGxBY3Rpb25zRnJvbVRhcmdldCIsImZvcmNlRGVsZXRlIiwiX2RlbGV0ZUhhc2hFbGVtZW50IiwicmVtb3ZlQWN0aW9uIiwiZ2V0T3JpZ2luYWxUYXJnZXQiLCJzcGxpY2UiLCJsb2dJRCIsInJlbW92ZUFjdGlvbkJ5VGFnIiwidGFnIiwiQWN0aW9uIiwiVEFHX0lOVkFMSUQiLCJhc3NlcnRJRCIsImxpbWl0IiwiZ2V0VGFnIiwiX3JlbW92ZUFjdGlvbkF0SW5kZXgiLCJnZXRBY3Rpb25CeVRhZyIsImdldE51bWJlck9mUnVubmluZ0FjdGlvbnNJblRhcmdldCIsInBhdXNlVGFyZ2V0IiwicmVzdW1lVGFyZ2V0IiwicGF1c2VBbGxSdW5uaW5nQWN0aW9ucyIsImlkc1dpdGhBY3Rpb25zIiwicmVzdW1lVGFyZ2V0cyIsInRhcmdldHNUb1Jlc3VtZSIsInBhdXNlVGFyZ2V0cyIsInRhcmdldHNUb1BhdXNlIiwicHVyZ2VTaGFyZWRNYW5hZ2VyIiwiZ2V0U2NoZWR1bGVyIiwidW5zY2hlZHVsZVVwZGF0ZSIsImluZGV4IiwicmV0IiwidGFyZ2V0cyIsImwiLCJ1cGRhdGUiLCJkdCIsImxvY0N1cnJUYXJnZXQiLCJlbHQiLCJzdGVwIiwiX3NwZWVkTWV0aG9kIiwiX3NwZWVkIiwiaXNEb25lIiwic3RvcCIsIkNDX1RFU1QiLCJpc1RhcmdldFBhdXNlZF9URVNUIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkJBQSxPQUFPLENBQUMsMEJBQUQsQ0FBUDs7QUFDQSxJQUFJQyxFQUFFLEdBQUdELE9BQU8sQ0FBQyxxQkFBRCxDQUFoQjtBQUVBOzs7Ozs7O0FBS0EsSUFBSUUsV0FBVyxHQUFHLFNBQWRBLFdBQWMsR0FBWTtBQUMxQixPQUFLQyxPQUFMLEdBQWUsRUFBZjtBQUNBLE9BQUtDLE1BQUwsR0FBYyxJQUFkLENBRjBCLENBRU47O0FBQ3BCLE9BQUtDLFdBQUwsR0FBbUIsQ0FBbkI7QUFDQSxPQUFLQyxhQUFMLEdBQXFCLElBQXJCLENBSjBCLENBSUM7O0FBQzNCLE9BQUtDLE1BQUwsR0FBYyxLQUFkO0FBQ0EsT0FBS0MsSUFBTCxHQUFZLEtBQVo7QUFDSCxDQVBEO0FBU0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQUMsRUFBRSxDQUFDQyxhQUFILEdBQW1CLFlBQVk7QUFDM0IsT0FBS0MsWUFBTCxHQUFvQlYsRUFBRSxDQUFDVyxTQUFILENBQWEsSUFBYixDQUFwQjtBQUNBLE9BQUtDLGFBQUwsR0FBcUIsRUFBckI7QUFDQSxPQUFLQyxjQUFMLEdBQXNCLElBQXRCO0FBQ0FMLEVBQUFBLEVBQUUsQ0FBQ00sUUFBSCxDQUFZQyxVQUFaLElBQTBCUCxFQUFFLENBQUNNLFFBQUgsQ0FBWUMsVUFBWixDQUF1QkMsZUFBdkIsQ0FBdUMsSUFBdkMsQ0FBMUI7QUFDSCxDQUxEOztBQU1BUixFQUFFLENBQUNDLGFBQUgsQ0FBaUJRLFNBQWpCLEdB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OztBQUVEeUMsVUFBQUEsYUFBYSxDQUFDbEUsYUFBZCxHQUE4QixJQUE5QjtBQUNIOztBQUNEa0UsUUFBQUEsYUFBYSxDQUFDaEUsSUFBZCxHQUFxQixLQUFyQjtBQUNILE9BekI2QyxDQTBCOUM7OztBQUNBLFVBQUlnRSxhQUFhLENBQUNyRSxPQUFkLENBQXNCcUIsTUFBdEIsS0FBaUMsQ0FBckMsRUFBd0M7QUFDcEMsYUFBS2dCLGtCQUFMLENBQXdCZ0MsYUFBeEIsS0FBMENDLEdBQUcsRUFBN0M7QUFDSDtBQUNKO0FBQ0o7QUF0WHdCLENBQTdCOztBQXlYQSxJQUFJTSxPQUFKLEVBQWE7QUFDVHRFLEVBQUFBLEVBQUUsQ0FBQ0MsYUFBSCxDQUFpQlEsU0FBakIsQ0FBMkI4RCxtQkFBM0IsR0FBaUQsVUFBVTVFLE1BQVYsRUFBa0I7QUFDL0QsUUFBSXNCLE9BQU8sR0FBRyxLQUFLZixZQUFMLENBQWtCUCxNQUFNLENBQUM2QixHQUF6QixDQUFkO0FBQ0EsV0FBT1AsT0FBTyxDQUFDbkIsTUFBZjtBQUNILEdBSEQ7QUFJSCIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDA4LTIwMTAgUmljYXJkbyBRdWVzYWRhXG4gQ29weXJpZ2h0IChjKSAyMDExLTIwMTIgY29jb3MyZC14Lm9yZ1xuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHA6Ly93d3cuY29jb3MyZC14Lm9yZ1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxucmVxdWlyZSgnLi4vY29yZS9wbGF0Zm9ybS9DQ0NsYXNzJyk7XG52YXIganMgPSByZXF1aXJlKCcuLi9jb3JlL3BsYXRmb3JtL2pzJyk7XG5cbi8qXG4gKiBAY2xhc3MgSGFzaEVsZW1lbnRcbiAqIEBjb25zdHJ1Y3RvclxuICogQHByaXZhdGVcbiAqL1xudmFyIEhhc2hFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuYWN0aW9ucyA9IFtdO1xuICAgIHRoaXMudGFyZ2V0ID0gbnVsbDsgLy9jY29iamVjdFxuICAgIHRoaXMuYWN0aW9uSW5kZXggPSAwO1xuICAgIHRoaXMuY3VycmVudEFjdGlvbiA9IG51bGw7IC8vQ0NBY3Rpb25cbiAgICB0aGlzLnBhdXNlZCA9IGZhbHNlO1xuICAgIHRoaXMubG9jayA9IGZhbHNlO1xufTtcblxuLyoqXG4gKiAhI2VuXG4gKiBjYy5BY3Rpb25NYW5hZ2VyIGlzIGEgY2xhc3MgdGhhdCBjYW4gbWFuYWdlIGFjdGlvbnMuPGJyLz5cbiAqIE5vcm1hbGx5IHlvdSB3b24ndCBuZWVkIHRvIHVzZSB0aGlzIGNsYXNzIGRpcmVjdGx5LiA5OSUgb2YgdGhlIGNhc2VzIHlvdSB3aWxsIHVzZSB0aGUgQ0NOb2RlIGludGVyZmFjZSxcbiAqIHdoaWNoIHVzZXMgdGhpcyBjbGFzcydzIHNpbmdsZXRvbiBvYmplY3QuXG4gKiBCdXQgdGhlcmUgYXJlIHNvbWUgY2FzZXMgd2hlcmUgeW91IG1pZ2h0IG5lZWQgdG8gdXNlIHRoaXMgY2xhc3MuIDxici8+XG4gKiBFeGFtcGxlczo8YnIvPlxuICogLSBXaGVuIHlvdSB3YW50IHRvIHJ1biBhbiBhY3Rpb24gd2hlcmUgdGhlIHRhcmdldCBpcyBkaWZmZXJlbnQgZnJvbSBhIENDTm9kZS48YnIvPlxuICogLSBXaGVuIHlvdSB3YW50IHRvIHBhdXNlIC8gcmVzdW1lIHRoZSBhY3Rpb25zPGJyLz5cbiAqICEjemhcbiAqIGNjLkFjdGlvbk1hbmFnZXIg5piv5Y+v5Lul566h55CG5Yqo5L2c55qE5Y2V5L6L57G744CCPGJyLz5cbiAqIOmAmuW4uOS9oOW5tuS4jemcgOimgeebtOaOpeS9v+eUqOi/meS4quexu++8jDk5JeeahOaDheWGteaCqOWwhuS9v+eUqCBDQ05vZGUg55qE5o6l5Y+j44CCPGJyLz5cbiAqIOS9huS5n+acieS4gOS6m+aDheWGteS4i++8jOaCqOWPr+iDvemcgOimgeS9v+eUqOi/meS4quexu+OAgiA8YnIvPlxuICog5L6L5aaC77yaXG4gKiAgLSDlvZPkvaDmg7PopoHov5DooYzkuIDkuKrliqjkvZzvvIzkvYbnm67moIfkuI3mmK8gQ0NOb2RlIOexu+Wei+aXtuOAgiA8YnIvPlxuICogIC0g5b2T5L2g5oOz6KaB5pqC5YGcL+aBouWkjeWKqOS9nOaXtuOAgiA8YnIvPlxuICogQGNsYXNzIEFjdGlvbk1hbmFnZXJcbiAqIEBleGFtcGxlIHtAbGluayBjb2NvczJkL2NvcmUvQ0NBY3Rpb25NYW5hZ2VyL0FjdGlvbk1hbmFnZXIuanN9XG4gKi9cbmNjLkFjdGlvbk1hbmFnZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5faGFzaFRhcmdldHMgPSBqcy5jcmVhdGVNYXAodHJ1ZSk7XG4gICAgdGhpcy5fYXJyYXlUYXJnZXRzID0gW107XG4gICAgdGhpcy5fY3VycmVudFRhcmdldCA9IG51bGw7XG4gICAgY2MuZGlyZWN0b3IuX3NjaGVkdWxlciAmJiBjYy5kaXJlY3Rvci5fc2NoZWR1bGVyLmVuYWJsZUZvclRhcmdldCh0aGlzKTtcbn07XG5jYy5BY3Rpb25NYW5hZ2VyLnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogY2MuQWN0aW9uTWFuYWdlcixcbiAgICBfZWxlbWVudFBvb2w6IFtdLFxuXG4gICAgX3NlYXJjaEVsZW1lbnRCeVRhcmdldDpmdW5jdGlvbiAoYXJyLCB0YXJnZXQpIHtcbiAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBhcnIubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgIGlmICh0YXJnZXQgPT09IGFycltrXS50YXJnZXQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFycltrXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgX2dldEVsZW1lbnQ6IGZ1bmN0aW9uICh0YXJnZXQsIHBhdXNlZCkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRQb29sLnBvcCgpO1xuICAgICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQgPSBuZXcgSGFzaEVsZW1lbnQoKTtcbiAgICAgICAgfVxuICAgICAgICBlbGVtZW50LnRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgZWxlbWVudC5wYXVzZWQgPSAhIXBhdXNlZDtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfSxcblxuICAgIF9wdXRFbGVtZW50OiBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICBlbGVtZW50LmFjdGlvbnMubGVuZ3RoID0gMDtcbiAgICAgICAgZWxlbWVudC5hY3Rpb25JbmRleCA9IDA7XG4gICAgICAgIGVsZW1lbnQuY3VycmVudEFjdGlvbiA9IG51bGw7XG4gICAgICAgIGVsZW1lbnQucGF1c2VkID0gZmFsc2U7XG4gICAgICAgIGVsZW1lbnQudGFyZ2V0ID0gbnVsbDtcbiAgICAgICAgZWxlbWVudC5sb2NrID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2VsZW1lbnRQb29sLnB1c2goZWxlbWVudCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBBZGRzIGFuIGFjdGlvbiB3aXRoIGEgdGFyZ2V0Ljxici8+XG4gICAgICogSWYgdGhlIHRhcmdldCBpcyBhbHJlYWR5IHByZXNlbnQsIHRoZW4gdGhlIGFjdGlvbiB3aWxsIGJlIGFkZGVkIHRvIHRoZSBleGlzdGluZyB0YXJnZXQuXG4gICAgICogSWYgdGhlIHRhcmdldCBpcyBub3QgcHJlc2VudCwgYSBuZXcgaW5zdGFuY2Ugb2YgdGhpcyB0YXJnZXQgd2lsbCBiZSBjcmVhdGVkIGVpdGhlciBwYXVzZWQgb3Igbm90LCBhbmQgdGhlIGFjdGlvbiB3aWxsIGJlIGFkZGVkIHRvIHRoZSBuZXdseSBjcmVhdGVkIHRhcmdldC5cbiAgICAgKiBXaGVuIHRoZSB0YXJnZXQgaXMgcGF1c2VkLCB0aGUgcXVldWVkIGFjdGlvbnMgd29uJ3QgYmUgJ3RpY2tlZCcuXG4gICAgICogISN6aFxuICAgICAqIOWinuWKoOS4gOS4quWKqOS9nO+8jOWQjOaXtui/mOmcgOimgeaPkOS+m+WKqOS9nOeahOebruagh+Wvueixoe+8jOebruagh+WvueixoeaYr+WQpuaaguWBnOS9nOS4uuWPguaVsOOAgjxici8+XG4gICAgICog5aaC5p6c55uu5qCH5bey5a2Y5Zyo77yM5Yqo5L2c5bCG5Lya6KKr55u05o6l5re75Yqg5Yiw546w5pyJ55qE6IqC54K55Lit44CCPGJyLz5cbiAgICAgKiDlpoLmnpznm67moIfkuI3lrZjlnKjvvIzlsIbkuLrov5nkuIDnm67moIfliJvlu7rkuIDkuKrmlrDnmoTlrp7kvovvvIzlubblsIbliqjkvZzmt7vliqDov5vljrvjgII8YnIvPlxuICAgICAqIOW9k+ebruagh+eKtuaAgeeahCBwYXVzZWQg5Li6IHRydWXvvIzliqjkvZzlsIbkuI3kvJrooqvmiafooYxcbiAgICAgKlxuICAgICAqIEBtZXRob2QgYWRkQWN0aW9uXG4gICAgICogQHBhcmFtIHtBY3Rpb259IGFjdGlvblxuICAgICAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gICAgICogQHBhcmFtIHtCb29sZWFufSBwYXVzZWRcbiAgICAgKi9cbiAgICBhZGRBY3Rpb246ZnVuY3Rpb24gKGFjdGlvbiwgdGFyZ2V0LCBwYXVzZWQpIHtcbiAgICAgICAgaWYgKCFhY3Rpb24gfHwgIXRhcmdldCkge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgxMDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vY2hlY2sgaWYgdGhlIGFjdGlvbiB0YXJnZXQgYWxyZWFkeSBleGlzdHNcbiAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzLl9oYXNoVGFyZ2V0c1t0YXJnZXQuX2lkXTtcbiAgICAgICAgLy9pZiBkb2Vzbid0IGV4aXN0cywgY3JlYXRlIGEgaGFzaGVsZW1lbnQgYW5kIHB1c2ggaW4gbXBUYXJnZXRzXG4gICAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICAgICAgZWxlbWVudCA9IHRoaXMuX2dldEVsZW1lbnQodGFyZ2V0LCBwYXVzZWQpO1xuICAgICAgICAgICAgdGhpcy5faGFzaFRhcmdldHNbdGFyZ2V0Ll9pZF0gPSBlbGVtZW50O1xuICAgICAgICAgICAgdGhpcy5fYXJyYXlUYXJnZXRzLnB1c2goZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIWVsZW1lbnQuYWN0aW9ucykge1xuICAgICAgICAgICAgZWxlbWVudC5hY3Rpb25zID0gW107XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtZW50LmFjdGlvbnMucHVzaChhY3Rpb24pO1xuICAgICAgICBhY3Rpb24uc3RhcnRXaXRoVGFyZ2V0KHRhcmdldCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmVtb3ZlcyBhbGwgYWN0aW9ucyBmcm9tIGFsbCB0aGUgdGFyZ2V0cy5cbiAgICAgKiAhI3poIOenu+mZpOaJgOacieWvueixoeeahOaJgOacieWKqOS9nOOAglxuICAgICAqIEBtZXRob2QgcmVtb3ZlQWxsQWN0aW9uc1xuICAgICAqL1xuICAgIHJlbW92ZUFsbEFjdGlvbnM6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbG9jVGFyZ2V0cyA9IHRoaXMuX2FycmF5VGFyZ2V0cztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsb2NUYXJnZXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IGxvY1RhcmdldHNbaV07XG4gICAgICAgICAgICBpZiAoZWxlbWVudClcbiAgICAgICAgICAgICAgICB0aGlzLl9wdXRFbGVtZW50KGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2FycmF5VGFyZ2V0cy5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLl9oYXNoVGFyZ2V0cyA9IGpzLmNyZWF0ZU1hcCh0cnVlKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZW1vdmVzIGFsbCBhY3Rpb25zIGZyb20gYSBjZXJ0YWluIHRhcmdldC4gPGJyLz5cbiAgICAgKiBBbGwgdGhlIGFjdGlvbnMgdGhhdCBiZWxvbmdzIHRvIHRoZSB0YXJnZXQgd2lsbCBiZSByZW1vdmVkLlxuICAgICAqICEjemhcbiAgICAgKiDnp7vpmaTmjIflrprlr7nosaHkuIrnmoTmiYDmnInliqjkvZzjgII8YnIvPlxuICAgICAqIOWxnuS6juivpeebruagh+eahOaJgOacieeahOWKqOS9nOWwhuiiq+WIoOmZpOOAglxuICAgICAqIEBtZXRob2QgcmVtb3ZlQWxsQWN0aW9uc0Zyb21UYXJnZXRcbiAgICAgKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gZm9yY2VEZWxldGVcbiAgICAgKi9cbiAgICByZW1vdmVBbGxBY3Rpb25zRnJvbVRhcmdldDpmdW5jdGlvbiAodGFyZ2V0LCBmb3JjZURlbGV0ZSkge1xuICAgICAgICAvLyBleHBsaWNpdCBudWxsIGhhbmRsaW5nXG4gICAgICAgIGlmICh0YXJnZXQgPT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzLl9oYXNoVGFyZ2V0c1t0YXJnZXQuX2lkXTtcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuYWN0aW9ucy5sZW5ndGggPSAwO1xuICAgICAgICAgICAgdGhpcy5fZGVsZXRlSGFzaEVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqICEjZW4gUmVtb3ZlcyBhbiBhY3Rpb24gZ2l2ZW4gYW4gYWN0aW9uIHJlZmVyZW5jZS5cbiAgICAgKiAhI3poIOenu+mZpOaMh+WumueahOWKqOS9nOOAglxuICAgICAqIEBtZXRob2QgcmVtb3ZlQWN0aW9uIFxuICAgICAqIEBwYXJhbSB7QWN0aW9ufSBhY3Rpb25cbiAgICAgKi9cbiAgICByZW1vdmVBY3Rpb246ZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgICAvLyBleHBsaWNpdCBudWxsIGhhbmRsaW5nXG4gICAgICAgIGlmIChhY3Rpb24gPT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdmFyIHRhcmdldCA9IGFjdGlvbi5nZXRPcmlnaW5hbFRhcmdldCgpO1xuICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMuX2hhc2hUYXJnZXRzW3RhcmdldC5faWRdO1xuXG4gICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnQuYWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LmFjdGlvbnNbaV0gPT09IGFjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFjdGlvbnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAvLyB1cGRhdGUgYWN0aW9uSW5kZXggaW4gY2FzZSB3ZSBhcmUgaW4gdGljay4gbG9vcGluZyBvdmVyIHRoZSBhY3Rpb25zXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LmFjdGlvbkluZGV4ID49IGkpXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFjdGlvbkluZGV4LS07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNjLmxvZ0lEKDEwMDEpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmVtb3ZlcyBhbiBhY3Rpb24gZ2l2ZW4gaXRzIHRhZyBhbmQgdGhlIHRhcmdldC5cbiAgICAgKiAhI3poIOWIoOmZpOaMh+WumuWvueixoeS4i+eJueWumuagh+etvueahOS4gOS4quWKqOS9nO+8jOWwhuWIoOmZpOmmluS4quWMuemFjeWIsOeahOWKqOS9nOOAglxuICAgICAqIEBtZXRob2QgcmVtb3ZlQWN0aW9uQnlUYWdcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdGFnXG4gICAgICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAgICAgKi9cbiAgICByZW1vdmVBY3Rpb25CeVRhZzpmdW5jdGlvbiAodGFnLCB0YXJnZXQpIHtcbiAgICAgICAgaWYodGFnID09PSBjYy5BY3Rpb24uVEFHX0lOVkFMSUQpXG4gICAgICAgICAgICBjYy5sb2dJRCgxMDAyKTtcblxuICAgICAgICBjYy5hc3NlcnRJRCh0YXJnZXQsIDEwMDMpO1xuXG4gICAgICAgIHZhciBlbGVtZW50ID0gdGhpcy5faGFzaFRhcmdldHNbdGFyZ2V0Ll9pZF07XG5cbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHZhciBsaW1pdCA9IGVsZW1lbnQuYWN0aW9ucy5sZW5ndGg7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbWl0OyArK2kpIHtcbiAgICAgICAgICAgICAgICB2YXIgYWN0aW9uID0gZWxlbWVudC5hY3Rpb25zW2ldO1xuICAgICAgICAgICAgICAgIGlmIChhY3Rpb24gJiYgYWN0aW9uLmdldFRhZygpID09PSB0YWcgJiYgYWN0aW9uLmdldE9yaWdpbmFsVGFyZ2V0KCkgPT09IHRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVBY3Rpb25BdEluZGV4KGksIGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBHZXRzIGFuIGFjdGlvbiBnaXZlbiBpdHMgdGFnIGFuIGEgdGFyZ2V0LlxuICAgICAqICEjemgg6YCa6L+H55uu5qCH5a+56LGh5ZKM5qCH562+6I635Y+W5LiA5Liq5Yqo5L2c44CCXG4gICAgICogQG1ldGhvZCBnZXRBY3Rpb25CeVRhZ1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0YWdcbiAgICAgKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICAgICAqIEByZXR1cm4ge0FjdGlvbnxOdWxsfSAgcmV0dXJuIHRoZSBBY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gdGFnIG9uIHN1Y2Nlc3NcbiAgICAgKi9cbiAgICBnZXRBY3Rpb25CeVRhZzpmdW5jdGlvbiAodGFnLCB0YXJnZXQpIHtcbiAgICAgICAgaWYodGFnID09PSBjYy5BY3Rpb24uVEFHX0lOVkFMSUQpXG4gICAgICAgICAgICBjYy5sb2dJRCgxMDA0KTtcblxuICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMuX2hhc2hUYXJnZXRzW3RhcmdldC5faWRdO1xuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQuYWN0aW9ucyAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50LmFjdGlvbnMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFjdGlvbiA9IGVsZW1lbnQuYWN0aW9uc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGlvbiAmJiBhY3Rpb24uZ2V0VGFnKCkgPT09IHRhZylcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2MubG9nSUQoMTAwNSwgdGFnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmV0dXJucyB0aGUgbnVtYmVycyBvZiBhY3Rpb25zIHRoYXQgYXJlIHJ1bm5pbmcgaW4gYSBjZXJ0YWluIHRhcmdldC4gPGJyLz5cbiAgICAgKiBDb21wb3NhYmxlIGFjdGlvbnMgYXJlIGNvdW50ZWQgYXMgMSBhY3Rpb24uIDxici8+XG4gICAgICogRXhhbXBsZTogPGJyLz5cbiAgICAgKiAtIElmIHlvdSBhcmUgcnVubmluZyAxIFNlcXVlbmNlIG9mIDcgYWN0aW9ucywgaXQgd2lsbCByZXR1cm4gMS4gPGJyLz5cbiAgICAgKiAtIElmIHlvdSBhcmUgcnVubmluZyA3IFNlcXVlbmNlcyBvZiAyIGFjdGlvbnMsIGl0IHdpbGwgcmV0dXJuIDcuXG4gICAgICogISN6aFxuICAgICAqIOi/lOWbnuaMh+WumuWvueixoeS4i+aJgOacieato+WcqOi/kOihjOeahOWKqOS9nOaVsOmHj+OAgiA8YnIvPlxuICAgICAqIOe7hOWQiOWKqOS9nOiiq+eul+S9nOS4gOS4quWKqOS9nOOAgjxici8+XG4gICAgICog5L6L5aaC77yaPGJyLz5cbiAgICAgKiAgLSDlpoLmnpzmgqjmraPlnKjov5DooYwgNyDkuKrliqjkvZznu4TmiJDnmoTluo/liJfliqjkvZzvvIhTZXF1ZW5jZe+8ie+8jOi/meS4quWHveaVsOWwhui/lOWbniAx44CCPGJyLz5cbiAgICAgKiAgLSDlpoLmnpzkvaDmraPlnKjov5DooYwgMiDkuKrluo/liJfliqjkvZzvvIhTZXF1ZW5jZe+8ieWSjCA1IOS4quaZrumAmuWKqOS9nO+8jOi/meS4quWHveaVsOWwhui/lOWbniA344CCPGJyLz5cbiAgICAgKlxuICAgICAqIEBtZXRob2QgZ2V0TnVtYmVyT2ZSdW5uaW5nQWN0aW9uc0luVGFyZ2V0XG4gICAgICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0TnVtYmVyT2ZSdW5uaW5nQWN0aW9uc0luVGFyZ2V0OmZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzLl9oYXNoVGFyZ2V0c1t0YXJnZXQuX2lkXTtcbiAgICAgICAgaWYgKGVsZW1lbnQpXG4gICAgICAgICAgICByZXR1cm4gKGVsZW1lbnQuYWN0aW9ucykgPyBlbGVtZW50LmFjdGlvbnMubGVuZ3RoIDogMDtcblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqICEjZW4gUGF1c2VzIHRoZSB0YXJnZXQ6IGFsbCBydW5uaW5nIGFjdGlvbnMgYW5kIG5ld2x5IGFkZGVkIGFjdGlvbnMgd2lsbCBiZSBwYXVzZWQuXG4gICAgICogISN6aCDmmoLlgZzmjIflrprlr7nosaHvvJrmiYDmnInmraPlnKjov5DooYznmoTliqjkvZzlkozmlrDmt7vliqDnmoTliqjkvZzpg73lsIbkvJrmmoLlgZzjgIJcbiAgICAgKiBAbWV0aG9kIHBhdXNlVGFyZ2V0XG4gICAgICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAgICAgKi9cbiAgICBwYXVzZVRhcmdldDpmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gdGhpcy5faGFzaFRhcmdldHNbdGFyZ2V0Ll9pZF07XG4gICAgICAgIGlmIChlbGVtZW50KVxuICAgICAgICAgICAgZWxlbWVudC5wYXVzZWQgPSB0cnVlO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogISNlbiBSZXN1bWVzIHRoZSB0YXJnZXQuIEFsbCBxdWV1ZWQgYWN0aW9ucyB3aWxsIGJlIHJlc3VtZWQuXG4gICAgICogISN6aCDorqnmjIflrprnm67moIfmgaLlpI3ov5DooYzjgILlnKjmiafooYzluo/liJfkuK3miYDmnInooqvmmoLlgZznmoTliqjkvZzlsIbph43mlrDmgaLlpI3ov5DooYzjgIJcbiAgICAgKiBAbWV0aG9kIHJlc3VtZVRhcmdldFxuICAgICAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gICAgICovXG4gICAgcmVzdW1lVGFyZ2V0OmZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzLl9oYXNoVGFyZ2V0c1t0YXJnZXQuX2lkXTtcbiAgICAgICAgaWYgKGVsZW1lbnQpXG4gICAgICAgICAgICBlbGVtZW50LnBhdXNlZCA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFBhdXNlcyBhbGwgcnVubmluZyBhY3Rpb25zLCByZXR1cm5pbmcgYSBsaXN0IG9mIHRhcmdldHMgd2hvc2UgYWN0aW9ucyB3ZXJlIHBhdXNlZC5cbiAgICAgKiAhI3poIOaaguWBnOaJgOacieato+WcqOi/kOihjOeahOWKqOS9nO+8jOi/lOWbnuS4gOS4quWMheWQq+S6humCo+S6m+WKqOS9nOiiq+aaguWBnOS6hueahOebruagh+WvueixoeeahOWIl+ihqOOAglxuICAgICAqIEBtZXRob2QgcGF1c2VBbGxSdW5uaW5nQWN0aW9uc1xuICAgICAqIEByZXR1cm4ge0FycmF5fSAgYSBsaXN0IG9mIHRhcmdldHMgd2hvc2UgYWN0aW9ucyB3ZXJlIHBhdXNlZC5cbiAgICAgKi9cbiAgICBwYXVzZUFsbFJ1bm5pbmdBY3Rpb25zOmZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBpZHNXaXRoQWN0aW9ucyA9IFtdO1xuICAgICAgICB2YXIgbG9jVGFyZ2V0cyA9IHRoaXMuX2FycmF5VGFyZ2V0cztcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaTwgbG9jVGFyZ2V0cy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IGxvY1RhcmdldHNbaV07XG4gICAgICAgICAgICBpZihlbGVtZW50ICYmICFlbGVtZW50LnBhdXNlZCl7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5wYXVzZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlkc1dpdGhBY3Rpb25zLnB1c2goZWxlbWVudC50YXJnZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpZHNXaXRoQWN0aW9ucztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXN1bWUgYSBzZXQgb2YgdGFyZ2V0cyAoY29udmVuaWVuY2UgZnVuY3Rpb24gdG8gcmV2ZXJzZSBhIHBhdXNlQWxsUnVubmluZ0FjdGlvbnMgb3IgcGF1c2VUYXJnZXRzIGNhbGwpLlxuICAgICAqICEjemgg6K6p5LiA57uE5oyH5a6a5a+56LGh5oGi5aSN6L+Q6KGM77yI55So5p2l6YCG6L2sIHBhdXNlQWxsUnVubmluZ0FjdGlvbnMg5pWI5p6c55qE5L6/5o235Ye95pWw77yJ44CCXG4gICAgICogQG1ldGhvZCByZXN1bWVUYXJnZXRzXG4gICAgICogQHBhcmFtIHtBcnJheX0gdGFyZ2V0c1RvUmVzdW1lXG4gICAgICovXG4gICAgcmVzdW1lVGFyZ2V0czpmdW5jdGlvbih0YXJnZXRzVG9SZXN1bWUpe1xuICAgICAgICBpZiAoIXRhcmdldHNUb1Jlc3VtZSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaTwgdGFyZ2V0c1RvUmVzdW1lLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZih0YXJnZXRzVG9SZXN1bWVbaV0pXG4gICAgICAgICAgICAgICAgdGhpcy5yZXN1bWVUYXJnZXQodGFyZ2V0c1RvUmVzdW1lW2ldKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFBhdXNlIGEgc2V0IG9mIHRhcmdldHMuXG4gICAgICogISN6aCDmmoLlgZzkuIDnu4TmjIflrprlr7nosaHjgIJcbiAgICAgKiBAbWV0aG9kIHBhdXNlVGFyZ2V0c1xuICAgICAqIEBwYXJhbSB7QXJyYXl9IHRhcmdldHNUb1BhdXNlXG4gICAgICovXG4gICAgcGF1c2VUYXJnZXRzOmZ1bmN0aW9uKHRhcmdldHNUb1BhdXNlKXtcbiAgICAgICAgaWYgKCF0YXJnZXRzVG9QYXVzZSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaTwgdGFyZ2V0c1RvUGF1c2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0YXJnZXRzVG9QYXVzZVtpXSlcbiAgICAgICAgICAgICAgICB0aGlzLnBhdXNlVGFyZ2V0KHRhcmdldHNUb1BhdXNlW2ldKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogcHVyZ2VzIHRoZSBzaGFyZWQgYWN0aW9uIG1hbmFnZXIuIEl0IHJlbGVhc2VzIHRoZSByZXRhaW5lZCBpbnN0YW5jZS4gPGJyLz5cbiAgICAgKiBiZWNhdXNlIGl0IHVzZXMgdGhpcywgc28gaXQgY2FuIG5vdCBiZSBzdGF0aWMuXG4gICAgICogISN6aFxuICAgICAqIOa4hemZpOWFseeUqOeahOWKqOS9nOeuoeeQhuWZqOOAguWug+mHiuaUvuS6huaMgeacieeahOWunuS+i+OAgiA8YnIvPlxuICAgICAqIOWboOS4uuWug+S9v+eUqCB0aGlz77yM5Zug5q2k5a6D5LiN6IO95piv6Z2Z5oCB55qE44CCXG4gICAgICogQG1ldGhvZCBwdXJnZVNoYXJlZE1hbmFnZXJcbiAgICAgKi9cbiAgICBwdXJnZVNoYXJlZE1hbmFnZXI6ZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5nZXRTY2hlZHVsZXIoKS51bnNjaGVkdWxlVXBkYXRlKHRoaXMpO1xuICAgIH0sXG5cbiAgICAvL3Byb3RlY3RlZFxuICAgIF9yZW1vdmVBY3Rpb25BdEluZGV4OmZ1bmN0aW9uIChpbmRleCwgZWxlbWVudCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gZWxlbWVudC5hY3Rpb25zW2luZGV4XTtcblxuICAgICAgICBlbGVtZW50LmFjdGlvbnMuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgICAgICAvLyB1cGRhdGUgYWN0aW9uSW5kZXggaW4gY2FzZSB3ZSBhcmUgaW4gdGljay4gbG9vcGluZyBvdmVyIHRoZSBhY3Rpb25zXG4gICAgICAgIGlmIChlbGVtZW50LmFjdGlvbkluZGV4ID49IGluZGV4KVxuICAgICAgICAgICAgZWxlbWVudC5hY3Rpb25JbmRleC0tO1xuXG4gICAgICAgIGlmIChlbGVtZW50LmFjdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9kZWxldGVIYXNoRWxlbWVudChlbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZGVsZXRlSGFzaEVsZW1lbnQ6ZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIHJldCA9IGZhbHNlO1xuICAgICAgICBpZiAoZWxlbWVudCAmJiAhZWxlbWVudC5sb2NrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5faGFzaFRhcmdldHNbZWxlbWVudC50YXJnZXQuX2lkXSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9oYXNoVGFyZ2V0c1tlbGVtZW50LnRhcmdldC5faWRdO1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXRzID0gdGhpcy5fYXJyYXlUYXJnZXRzO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGFyZ2V0cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldHNbaV0gPT09IGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fcHV0RWxlbWVudChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICByZXQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIEFjdGlvbk1hbmFnZXIgdXBkYXRl44CCXG4gICAgICogISN6aCBBY3Rpb25NYW5hZ2VyIOS4u+W+queOr+OAglxuICAgICAqIEBtZXRob2QgdXBkYXRlXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGR0IGRlbHRhIHRpbWUgaW4gc2Vjb25kc1xuICAgICAqL1xuICAgIHVwZGF0ZTpmdW5jdGlvbiAoZHQpIHtcbiAgICAgICAgdmFyIGxvY1RhcmdldHMgPSB0aGlzLl9hcnJheVRhcmdldHMgLCBsb2NDdXJyVGFyZ2V0O1xuICAgICAgICBmb3IgKHZhciBlbHQgPSAwOyBlbHQgPCBsb2NUYXJnZXRzLmxlbmd0aDsgZWx0KyspIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRUYXJnZXQgPSBsb2NUYXJnZXRzW2VsdF07XG4gICAgICAgICAgICBsb2NDdXJyVGFyZ2V0ID0gdGhpcy5fY3VycmVudFRhcmdldDtcbiAgICAgICAgICAgIGlmICghbG9jQ3VyclRhcmdldC5wYXVzZWQgJiYgbG9jQ3VyclRhcmdldC5hY3Rpb25zKSB7XG4gICAgICAgICAgICAgICAgbG9jQ3VyclRhcmdldC5sb2NrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAvLyBUaGUgJ2FjdGlvbnMnIENDTXV0YWJsZUFycmF5IG1heSBjaGFuZ2Ugd2hpbGUgaW5zaWRlIHRoaXMgbG9vcC5cbiAgICAgICAgICAgICAgICBmb3IgKGxvY0N1cnJUYXJnZXQuYWN0aW9uSW5kZXggPSAwOyBsb2NDdXJyVGFyZ2V0LmFjdGlvbkluZGV4IDwgbG9jQ3VyclRhcmdldC5hY3Rpb25zLmxlbmd0aDsgbG9jQ3VyclRhcmdldC5hY3Rpb25JbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY0N1cnJUYXJnZXQuY3VycmVudEFjdGlvbiA9IGxvY0N1cnJUYXJnZXQuYWN0aW9uc1tsb2NDdXJyVGFyZ2V0LmFjdGlvbkluZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFsb2NDdXJyVGFyZ2V0LmN1cnJlbnRBY3Rpb24pXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgICAgICAvL3VzZSBmb3Igc3BlZWRcbiAgICAgICAgICAgICAgICAgICAgbG9jQ3VyclRhcmdldC5jdXJyZW50QWN0aW9uLnN0ZXAoZHQgKiAoIGxvY0N1cnJUYXJnZXQuY3VycmVudEFjdGlvbi5fc3BlZWRNZXRob2QgPyBsb2NDdXJyVGFyZ2V0LmN1cnJlbnRBY3Rpb24uX3NwZWVkIDogMSApICk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAobG9jQ3VyclRhcmdldC5jdXJyZW50QWN0aW9uICYmIGxvY0N1cnJUYXJnZXQuY3VycmVudEFjdGlvbi5pc0RvbmUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9jQ3VyclRhcmdldC5jdXJyZW50QWN0aW9uLnN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhY3Rpb24gPSBsb2NDdXJyVGFyZ2V0LmN1cnJlbnRBY3Rpb247XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBNYWtlIGN1cnJlbnRBY3Rpb24gbmlsIHRvIHByZXZlbnQgcmVtb3ZlQWN0aW9uIGZyb20gc2FsdmFnaW5nIGl0LlxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jQ3VyclRhcmdldC5jdXJyZW50QWN0aW9uID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQWN0aW9uKGFjdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsb2NDdXJyVGFyZ2V0LmN1cnJlbnRBY3Rpb24gPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsb2NDdXJyVGFyZ2V0LmxvY2sgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIG9ubHkgZGVsZXRlIGN1cnJlbnRUYXJnZXQgaWYgbm8gYWN0aW9ucyB3ZXJlIHNjaGVkdWxlZCBkdXJpbmcgdGhlIGN5Y2xlIChpc3N1ZSAjNDgxKVxuICAgICAgICAgICAgaWYgKGxvY0N1cnJUYXJnZXQuYWN0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWxldGVIYXNoRWxlbWVudChsb2NDdXJyVGFyZ2V0KSAmJiBlbHQtLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmlmIChDQ19URVNUKSB7XG4gICAgY2MuQWN0aW9uTWFuYWdlci5wcm90b3R5cGUuaXNUYXJnZXRQYXVzZWRfVEVTVCA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzLl9oYXNoVGFyZ2V0c1t0YXJnZXQuX2lkXTtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQucGF1c2VkO1xuICAgIH07XG59XG4iXX0=