
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/CCScheduler.js';
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

/**
 * @module cc
 */
var js = require('./platform/js');

var IdGenerater = require('./platform/id-generater');

var MAX_POOL_SIZE = 20;
var idGenerater = new IdGenerater('Scheduler'); //data structures

/*
 * A list double-linked list used for "updates with priority"
 * @class ListEntry
 * @param {Object} target not retained (retained by hashUpdateEntry)
 * @param {Number} priority
 * @param {Boolean} paused
 * @param {Boolean} markedForDeletion selector will no longer be called and entry will be removed at end of the next tick
 */

var ListEntry = function ListEntry(target, priority, paused, markedForDeletion) {
  this.target = target;
  this.priority = priority;
  this.paused = paused;
  this.markedForDeletion = markedForDeletion;
};

var _listEntries = [];

ListEntry.get = function (target, priority, paused, markedForDeletion) {
  var result = _listEntries.pop();

  if (result) {
    result.target = target;
    result.priority = priority;
    result.paused = paused;
    result.markedForDeletion = markedForDeletion;
  } else {
    result = new ListEntry(target, priority, paused, markedForDeletion);
  }

  return result;
};

ListEntry.put = function (entry) {
  if (_listEntries.length < MAX_POOL_SIZE) {
    entry.target = null;

    _listEntries.push(entry);
  }
};
/*
 * A update entry list
 * @class HashUpdateEntry
 * @param {Array} list Which list does it belong to ?
 * @param {ListEntry} entry entry in the list
 * @param {Object} target hash key (retained)
 * @param {function} callback
 */


var HashUpdateEntry = function HashUpdateEntry(list, entry, target, callback) {
  this.list = list;
  this.entry = entry;
  this.target = target;
  this.callback = callback;
};

var _hashUpdateEntries = [];

HashUpdateEntry.get = function (list, entry, target, callback) {
  var result = _hashUpdateEntries.pop();

  if (result) {
    result.list = list;
    result.entry = entry;
    result.target = target;
    result.callback = callback;
  } else {
    result = new HashUpdateEntry(list, entry, target, callback);
  }

  return result;
};

HashUpdateEntry.put = function (entry) {
  if (_hashUpdateEntries.length < MAX_POOL_SIZE) {
    entry.list = entry.entry = entry.target = entry.callback = null;

    _hashUpdateEntries.push(entry);
  }
}; //

/*
 * Hash Element used for "selectors with interval"
 * @class HashTimerEntry
 * @param {Array} timers
 * @param {Object} target  hash key (retained)
 * @param {Number} timerIndex
 * @param {Timer} currentTimer
 * @param {Boolean} currentTimerSalvaged
 * @param {Boolean} paused
 */


var HashTimerEntry = function HashTimerEntry(timers, target, timerIndex, currentTimer, currentTimerSalvaged, paused) {
  var _t = this;

  _t.timers = timers;
  _t.target = target;
  _t.timerIndex = timerIndex;
  _t.currentTimer = currentTimer;
  _t.currentTimerSalvaged = currentTimerSalvaged;
  _t.paused = paused;
};

var _hashTimerEntries = [];

HashTimerEntry.get = function (timers, target, timerIndex, currentTimer, currentTimerSalvaged, paused) {
  var result = _hashTimerEntries.pop();

  if (result) {
    result.timers = timers;
    result.target = target;
    result.timerIndex = timerIndex;
    result.currentTimer = currentTimer;
    result.currentTimerSalvaged = currentTimerSalvaged;
    result.paused = paused;
  } else {
    result = new HashTimerEntry(timers, target, timerIndex, currentTimer, currentTimerSalvaged, paused);
  }

  return result;
};

HashTimerEntry.put = function (entry) {
  if (_hashTimerEntries.length < MAX_POOL_SIZE) {
    entry.timers = entry.target = entry.currentTimer = null;

    _hashTimerEntries.push(entry);
  }
};
/*
 * Light weight timer
 * @extends cc.Class
 */


function CallbackTimer() {
  this._lock = false;
  this._scheduler = null;
  this._elapsed = -1;
  this._runForever = false;
  this._useDelay = false;
  this._timesExecuted = 0;
  this._repeat = 0;
  this._delay = 0;
  this._interval = 0;
  this._target = null;
  this._callback = null;
}

var proto = CallbackTimer.prototype;

proto.initWithCallback = function (scheduler, callback, target, seconds, repeat, delay) {
  this._lock = false;
  this._scheduler = scheduler;
  this._target = target;
  this._callback = callback;
  this._elapsed = -1;
  this._interval = seconds;
  this._delay = delay;
  this._useDelay = this._delay > 0;
  this._repeat = repeat;
  this._runForever = this._repeat === cc.macro.REPEAT_FOREVER;
  return true;
};
/**
 * @return {Number} returns interval of timer
 */


proto.getInterval = function () {
  return this._interval;
};
/**
 * @param {Number} interval set interval in seconds
 */


proto.setInterval = function (interval) {
  this._interval = interval;
};
/**
 * triggers the timer
 * @param {Number} dt delta time
 */


proto.update = function (dt) {
  if (this._elapsed === -1) {
    this._elapsed = 0;
    this._timesExecuted = 0;
  } else {
    this._elapsed += dt;

    if (this._runForever && !this._useDelay) {
      //standard timer usage
      if (this._elapsed >= this._interval) {
        this.trigger();
        this._elapsed = 0;
      }
    } else {
      //advanced usage
      if (this._useDelay) {
        if (this._elapsed >= this._delay) {
          this.trigger();
          this._elapsed -= this._delay;
          this._timesExecuted += 1;
          this._useDelay = false;
        }
      } else {
        if (this._elapsed >= this._interval) {
          this.trigger();
          this._elapsed = 0;
          this._timesExecuted += 1;
        }
      }

      if (this._callback && !this._runForever && this._timesExecuted > this._repeat) this.cancel();
    }
  }
};

proto.getCallback = function () {
  return this._callback;
};

proto.trigger = function () {
  if (this._target && this._callback) {
    this._lock = true;

    this._callback.call(this._target, this._elapsed);

    this._lock = false;
  }
};

proto.cancel = function () {
  //override
  this._scheduler.unschedule(this._callback, this._target);
};

var _timers = [];

CallbackTimer.get = function () {
  return _timers.pop() || new CallbackTimer();
};

CallbackTimer.put = function (timer) {
  if (_timers.length < MAX_POOL_SIZE && !timer._lock) {
    timer._scheduler = timer._target = timer._callback = null;

    _timers.push(timer);
  }
};
/**
 * !#en
 * Scheduler is responsible of triggering the scheduled callbacks.<br/>
 * You should not use NSTimer. Instead use this class.<br/>
 * <br/>
 * There are 2 different types of callbacks (selectors):<br/>
 *     - update callback: the 'update' callback will be called every frame. You can customize the priority.<br/>
 *     - custom callback: A custom callback will be called every frame, or with a custom interval of time<br/>
 * <br/>
 * The 'custom selectors' should be avoided when possible. It is faster,
 * and consumes less memory to use the 'update callback'. *
 * !#zh
 * Scheduler 是负责触发回调函数的类。<br/>
 * 通常情况下，建议使用 cc.director.getScheduler() 来获取系统定时器。<br/>
 * 有两种不同类型的定时器：<br/>
 *     - update 定时器：每一帧都会触发。您可以自定义优先级。<br/>
 *     - 自定义定时器：自定义定时器可以每一帧或者自定义的时间间隔触发。<br/>
 * 如果希望每帧都触发，应该使用 update 定时器，使用 update 定时器更快，而且消耗更少的内存。
 *
 * @class Scheduler
 */


cc.Scheduler = function () {
  this._timeScale = 1.0;
  this._updatesNegList = []; // list of priority < 0

  this._updates0List = []; // list of priority == 0

  this._updatesPosList = []; // list of priority > 0

  this._hashForUpdates = js.createMap(true); // hash used to fetch quickly the list entries for pause, delete, etc

  this._hashForTimers = js.createMap(true); // Used for "selectors with interval"

  this._currentTarget = null;
  this._currentTargetSalvaged = false;
  this._updateHashLocked = false; // If true unschedule will not remove anything from a hash. Elements will only be marked for deletion.

  this._arrayForTimers = []; // Speed up indexing
  //this._arrayForUpdates = [];   // Speed up indexing
};

cc.Scheduler.prototype = {
  constructor: cc.Scheduler,
  //-----------------------private method----------------------
  _removeHashElement: function _removeHashElement(element) {
    delete this._hashForTimers[element.target._id];
    var arr = this._arrayForTimers;

    for (var i = 0, l = arr.length; i < l; i++) {
      if (arr[i] === element) {
        arr.splice(i, 1);
        break;
      }
    }

    HashTimerEntry.put(element);
  },
  _removeUpdateFromHash: function _removeUpdateFromHash(entry) {
    var targetId = entry.target._id;
    var self = this,
        element = self._hashForUpdates[targetId];

    if (element) {
      // Remove list entry from list
      var list = element.list,
          listEntry = element.entry;

      for (var i = 0, l = list.length; i < l; i++) {
        if (list[i] === listEntry) {
          list.splice(i, 1);
          break;
        }
      }

      delete self._hashForUpdates[targetId];
      ListEntry.put(listEntry);
      HashUpdateEntry.put(element);
    }
  },
  _priorityIn: function _priorityIn(ppList, listElement, priority) {
    for (var i = 0; i < ppList.length; i++) {
      if (priority < ppList[i].priority) {
        ppList.splice(i, 0, listElement);
        return;
      }
    }

    ppList.push(listElement);
  },
  _appendIn: function _appendIn(ppList, listElement) {
    ppList.push(listElement);
  },
  //-----------------------public method-------------------------

  /**
   * !en This method should be called for any target which needs to schedule tasks, and this method should be called before any scheduler API usage.
   * This method will add a `_id` property if it doesn't exist.
   * !zh 任何需要用 Scheduler 管理任务的对象主体都应该调用这个方法，并且应该在调用任何 Scheduler API 之前调用这个方法。
   * 这个方法会给对象添加一个 `_id` 属性，如果这个属性不存在的话。
   * @method enableForTarget
   * @param {Object} target
   */
  enableForTarget: function enableForTarget(target) {
    if (!target._id) {
      if (target.__instanceId) {
        cc.warnID(1513);
      } else {
        target._id = idGenerater.getNewId();
      }
    }
  },

  /**
   * !#en
   * Modifies the time of all scheduled callbacks.<br/>
   * You can use this property to create a 'slow motion' or 'fast forward' effect.<br/>
   * Default is 1.0. To create a 'slow motion' effect, use values below 1.0.<br/>
   * To create a 'fast forward' effect, use values higher than 1.0.<br/>
   * Note：It will affect EVERY scheduled selector / action.
   * !#zh
   * 设置时间间隔的缩放比例。<br/>
   * 您可以使用这个方法来创建一个 “slow motion（慢动作）” 或 “fast forward（快进）” 的效果。<br/>
   * 默认是 1.0。要创建一个 “slow motion（慢动作）” 效果,使用值低于 1.0。<br/>
   * 要使用 “fast forward（快进）” 效果，使用值大于 1.0。<br/>
   * 注意：它影响该 Scheduler 下管理的所有定时器。
   * @method setTimeScale
   * @param {Number} timeScale
   */
  setTimeScale: function setTimeScale(timeScale) {
    this._timeScale = timeScale;
  },

  /**
   * !#en Returns time scale of scheduler.
   * !#zh 获取时间间隔的缩放比例。
   * @method getTimeScale
   * @return {Number}
   */
  getTimeScale: function getTimeScale() {
    return this._timeScale;
  },

  /**
   * !#en 'update' the scheduler. (You should NEVER call this method, unless you know what you are doing.)
   * !#zh update 调度函数。(不应该直接调用这个方法，除非完全了解这么做的结果)
   * @method update
   * @param {Number} dt delta time
   */
  update: function update(dt) {
    this._updateHashLocked = true;
    if (this._timeScale !== 1) dt *= this._timeScale;
    var i, list, len, entry;

    for (i = 0, list = this._updatesNegList, len = list.length; i < len; i++) {
      entry = list[i];
      if (!entry.paused && !entry.markedForDeletion) entry.target.update(dt);
    }

    for (i = 0, list = this._updates0List, len = list.length; i < len; i++) {
      entry = list[i];
      if (!entry.paused && !entry.markedForDeletion) entry.target.update(dt);
    }

    for (i = 0, list = this._updatesPosList, len = list.length; i < len; i++) {
      entry = list[i];
      if (!entry.paused && !entry.markedForDeletion) entry.target.update(dt);
    } // Iterate over all the custom selectors


    var elt,
        arr = this._arrayForTimers;

    for (i = 0; i < arr.length; i++) {
      elt = arr[i];
      this._currentTarget = elt;
      this._currentTargetSalvaged = false;

      if (!elt.paused) {
        // The 'timers' array may change while inside this loop
        for (elt.timerIndex = 0; elt.timerIndex < elt.timers.length; ++elt.timerIndex) {
          elt.currentTimer = elt.timers[elt.timerIndex];
          elt.currentTimerSalvaged = false;
          elt.currentTimer.update(dt);
          elt.currentTimer = null;
        }
      } // only delete currentTarget if no actions were scheduled during the cycle (issue #481)


      if (this._currentTargetSalvaged && this._currentTarget.timers.length === 0) {
        this._removeHashElement(this._currentTarget);

        --i;
      }
    } // delete all updates that are marked for deletion
    // updates with priority < 0


    for (i = 0, list = this._updatesNegList; i < list.length;) {
      entry = list[i];
      if (entry.markedForDeletion) this._removeUpdateFromHash(entry);else i++;
    }

    for (i = 0, list = this._updates0List; i < list.length;) {
      entry = list[i];
      if (entry.markedForDeletion) this._removeUpdateFromHash(entry);else i++;
    }

    for (i = 0, list = this._updatesPosList; i < list.length;) {
      entry = list[i];
      if (entry.markedForDeletion) this._removeUpdateFromHash(entry);else i++;
    }

    this._updateHashLocked = false;
    this._currentTarget = null;
  },

  /**
   * !#en
   * <p>
   *   The scheduled method will be called every 'interval' seconds.<br/>
   *   If paused is YES, then it won't be called until it is resumed.<br/>
   *   If 'interval' is 0, it will be called every frame, but if so, it recommended to use 'scheduleUpdateForTarget:' instead.<br/>
   *   If the callback function is already scheduled, then only the interval parameter will be updated without re-scheduling it again.<br/>
   *   repeat let the action be repeated repeat + 1 times, use cc.macro.REPEAT_FOREVER to let the action run continuously<br/>
   *   delay is the amount of time the action will wait before it'll start<br/>
   * </p>
   * !#zh
   * 指定回调函数，调用对象等信息来添加一个新的定时器。<br/>
   * 如果 paused 值为 true，那么直到 resume 被调用才开始计时。<br/>
   * 当时间间隔达到指定值时，设置的回调函数将会被调用。<br/>
   * 如果 interval 值为 0，那么回调函数每一帧都会被调用，但如果是这样，
   * 建议使用 scheduleUpdateForTarget 代替。<br/>
   * 如果回调函数已经被定时器使用，那么只会更新之前定时器的时间间隔参数，不会设置新的定时器。<br/>
   * repeat 值可以让定时器触发 repeat + 1 次，使用 cc.macro.REPEAT_FOREVER
   * 可以让定时器一直循环触发。<br/>
   * delay 值指定延迟时间，定时器会在延迟指定的时间之后开始计时。
   * @method schedule
   * @param {Function} callback
   * @param {Object} target
   * @param {Number} interval
   * @param {Number} [repeat=cc.macro.REPEAT_FOREVER]
   * @param {Number} [delay=0]
   * @param {Boolean} paused
   * @example {@link cocos2d/core/CCScheduler/schedule.js}
   * @typescript
   * schedule(callback: Function, target: any, interval: number, repeat: number, delay: number, paused?: boolean): void
   * schedule(callback: Function, target: any, interval: number, paused?: boolean): void
   */
  schedule: function schedule(callback, target, interval, repeat, delay, paused) {
    'use strict';

    if (typeof callback !== 'function') {
      var tmp = callback;
      callback = target;
      target = tmp;
    } //selector, target, interval, repeat, delay, paused
    //selector, target, interval, paused


    if (arguments.length === 4 || arguments.length === 5) {
      paused = !!repeat;
      repeat = cc.macro.REPEAT_FOREVER;
      delay = 0;
    }

    cc.assertID(target, 1502);
    var targetId = target._id;

    if (!targetId) {
      if (target.__instanceId) {
        cc.warnID(1513);
        targetId = target._id = target.__instanceId;
      } else {
        cc.errorID(1510);
      }
    }

    var element = this._hashForTimers[targetId];

    if (!element) {
      // Is this the 1st element ? Then set the pause level to all the callback_fns of this target
      element = HashTimerEntry.get(null, target, 0, null, null, paused);

      this._arrayForTimers.push(element);

      this._hashForTimers[targetId] = element;
    } else if (element.paused !== paused) {
      cc.warnID(1511);
    }

    var timer, i;

    if (element.timers == null) {
      element.timers = [];
    } else {
      for (i = 0; i < element.timers.length; ++i) {
        timer = element.timers[i];

        if (timer && callback === timer._callback) {
          cc.logID(1507, timer.getInterval(), interval);
          timer._interval = interval;
          return;
        }
      }
    }

    timer = CallbackTimer.get();
    timer.initWithCallback(this, callback, target, interval, repeat, delay);
    element.timers.push(timer);

    if (this._currentTarget === element && this._currentTargetSalvaged) {
      this._currentTargetSalvaged = false;
    }
  },

  /**
   * !#en
   * Schedules the update callback for a given target,
   * During every frame after schedule started, the "update" function of target will be invoked.
   * !#zh
   * 使用指定的优先级为指定的对象设置 update 定时器。
   * update 定时器每一帧都会被触发，触发时自动调用指定对象的 "update" 函数。
   * 优先级的值越低，定时器被触发的越早。
   * @method scheduleUpdate
   * @param {Object} target
   * @param {Number} priority
   * @param {Boolean} paused
   */
  scheduleUpdate: function scheduleUpdate(target, priority, paused) {
    var targetId = target._id;

    if (!targetId) {
      if (target.__instanceId) {
        cc.warnID(1513);
        targetId = target._id = target.__instanceId;
      } else {
        cc.errorID(1510);
      }
    }

    var hashElement = this._hashForUpdates[targetId];

    if (hashElement && hashElement.entry) {
      // check if priority has changed
      if (hashElement.entry.priority !== priority) {
        if (this._updateHashLocked) {
          cc.logID(1506);
          hashElement.entry.markedForDeletion = false;
          hashElement.entry.paused = paused;
          return;
        } else {
          // will be added again outside if (hashElement).
          this.unscheduleUpdate(target);
        }
      } else {
        hashElement.entry.markedForDeletion = false;
        hashElement.entry.paused = paused;
        return;
      }
    }

    var listElement = ListEntry.get(target, priority, paused, false);
    var ppList; // most of the updates are going to be 0, that's way there
    // is an special list for updates with priority 0

    if (priority === 0) {
      ppList = this._updates0List;

      this._appendIn(ppList, listElement);
    } else {
      ppList = priority < 0 ? this._updatesNegList : this._updatesPosList;

      this._priorityIn(ppList, listElement, priority);
    } //update hash entry for quick access


    this._hashForUpdates[targetId] = HashUpdateEntry.get(ppList, listElement, target, null);
  },

  /**
   * !#en
   * Unschedules a callback for a callback and a given target.
   * If you want to unschedule the "update", use `unscheduleUpdate()`
   * !#zh
   * 取消指定对象定时器。
   * 如果需要取消 update 定时器，请使用 unscheduleUpdate()。
   * @method unschedule
   * @param {Function} callback The callback to be unscheduled
   * @param {Object} target The target bound to the callback.
   */
  unschedule: function unschedule(callback, target) {
    //callback, target
    // explicity handle nil arguments when removing an object
    if (!target || !callback) return;
    var targetId = target._id;

    if (!targetId) {
      if (target.__instanceId) {
        cc.warnID(1513);
        targetId = target._id = target.__instanceId;
      } else {
        cc.errorID(1510);
      }
    }

    var self = this,
        element = self._hashForTimers[targetId];

    if (element) {
      var timers = element.timers;

      for (var i = 0, li = timers.length; i < li; i++) {
        var timer = timers[i];

        if (callback === timer._callback) {
          if (timer === element.currentTimer && !element.currentTimerSalvaged) {
            element.currentTimerSalvaged = true;
          }

          timers.splice(i, 1);
          CallbackTimer.put(timer); //update timerIndex in case we are in tick;, looping over the actions

          if (element.timerIndex >= i) {
            element.timerIndex--;
          }

          if (timers.length === 0) {
            if (self._currentTarget === element) {
              self._currentTargetSalvaged = true;
            } else {
              self._removeHashElement(element);
            }
          }

          return;
        }
      }
    }
  },

  /** 
   * !#en Unschedules the update callback for a given target.
   * !#zh 取消指定对象的 update 定时器。
   * @method unscheduleUpdate
   * @param {Object} target The target to be unscheduled.
   */
  unscheduleUpdate: function unscheduleUpdate(target) {
    if (!target) return;
    var targetId = target._id;

    if (!targetId) {
      if (target.__instanceId) {
        cc.warnID(1513);
        targetId = target._id = target.__instanceId;
      } else {
        cc.errorID(1510);
      }
    }

    var element = this._hashForUpdates[targetId];

    if (element) {
      if (this._updateHashLocked) {
        element.entry.markedForDeletion = true;
      } else {
        this._removeUpdateFromHash(element.entry);
      }
    }
  },

  /** 
   * !#en
   * Unschedules all scheduled callbacks for a given target.
   * This also includes the "update" callback.
   * !#zh 取消指定对象的所有定时器，包括 update 定时器。
   * @method unscheduleAllForTarget
   * @param {Object} target The target to be unscheduled.
   */
  unscheduleAllForTarget: function unscheduleAllForTarget(target) {
    // explicit nullptr handling
    if (!target) {
      return;
    }

    var targetId = target._id;

    if (!targetId) {
      if (target.__instanceId) {
        cc.warnID(1513);
        targetId = target._id = target.__instanceId;
      } else {
        cc.errorID(1510);
      }
    } // Custom Selectors


    var element = this._hashForTimers[targetId];

    if (element) {
      var timers = element.timers;

      if (timers.indexOf(element.currentTimer) > -1 && !element.currentTimerSalvaged) {
        element.currentTimerSalvaged = true;
      }

      for (var i = 0, l = timers.length; i < l; i++) {
        CallbackTimer.put(timers[i]);
      }

      timers.length = 0;

      if (this._currentTarget === element) {
        this._currentTargetSalvaged = true;
      } else {
        this._removeHashElement(element);
      }
    } // update selector


    this.unscheduleUpdate(target);
  },

  /**
   * !#en
   * Unschedules all scheduled callbacks from all targets including the system callbacks.<br/>
   * You should NEVER call this method, unless you know what you are doing.
   * !#zh
   * 取消所有对象的所有定时器，包括系统定时器。<br/>
   * 不用调用此函数，除非你确定你在做什么。
   * @method unscheduleAll
   */
  unscheduleAll: function unscheduleAll() {
    this.unscheduleAllWithMinPriority(cc.Scheduler.PRIORITY_SYSTEM);
  },

  /**
   * !#en
   * Unschedules all callbacks from all targets with a minimum priority.<br/>
   * You should only call this with `PRIORITY_NON_SYSTEM_MIN` or higher.
   * !#zh
   * 取消所有优先级的值大于指定优先级的定时器。<br/>
   * 你应该只取消优先级的值大于 PRIORITY_NON_SYSTEM_MIN 的定时器。
   * @method unscheduleAllWithMinPriority
   * @param {Number} minPriority The minimum priority of selector to be unscheduled. Which means, all selectors which
   *        priority is higher than minPriority will be unscheduled.
   */
  unscheduleAllWithMinPriority: function unscheduleAllWithMinPriority(minPriority) {
    // Custom Selectors
    var i,
        element,
        arr = this._arrayForTimers;

    for (i = arr.length - 1; i >= 0; i--) {
      element = arr[i];
      this.unscheduleAllForTarget(element.target);
    } // Updates selectors


    var entry;
    var temp_length = 0;

    if (minPriority < 0) {
      for (i = 0; i < this._updatesNegList.length;) {
        temp_length = this._updatesNegList.length;
        entry = this._updatesNegList[i];
        if (entry && entry.priority >= minPriority) this.unscheduleUpdate(entry.target);
        if (temp_length == this._updatesNegList.length) i++;
      }
    }

    if (minPriority <= 0) {
      for (i = 0; i < this._updates0List.length;) {
        temp_length = this._updates0List.length;
        entry = this._updates0List[i];
        if (entry) this.unscheduleUpdate(entry.target);
        if (temp_length == this._updates0List.length) i++;
      }
    }

    for (i = 0; i < this._updatesPosList.length;) {
      temp_length = this._updatesPosList.length;
      entry = this._updatesPosList[i];
      if (entry && entry.priority >= minPriority) this.unscheduleUpdate(entry.target);
      if (temp_length == this._updatesPosList.length) i++;
    }
  },

  /** 
   * !#en Checks whether a callback for a given target is scheduled.
   * !#zh 检查指定的回调函数和回调对象组合是否存在定时器。
   * @method isScheduled
   * @param {Function} callback The callback to check.
   * @param {Object} target The target of the callback.
   * @return {Boolean} True if the specified callback is invoked, false if not.
   */
  isScheduled: function isScheduled(callback, target) {
    //key, target
    //selector, target
    cc.assertID(callback, 1508);
    cc.assertID(target, 1509);
    var targetId = target._id;

    if (!targetId) {
      if (target.__instanceId) {
        cc.warnID(1513);
        targetId = target._id = target.__instanceId;
      } else {
        cc.errorID(1510);
      }
    }

    var element = this._hashForTimers[targetId];

    if (!element) {
      return false;
    }

    if (element.timers == null) {
      return false;
    } else {
      var timers = element.timers;

      for (var i = 0; i < timers.length; ++i) {
        var timer = timers[i];

        if (callback === timer._callback) {
          return true;
        }
      }

      return false;
    }
  },

  /**
   * !#en
   * Pause all selectors from all targets.<br/>
   * You should NEVER call this method, unless you know what you are doing.
   * !#zh
   * 暂停所有对象的所有定时器。<br/>
   * 不要调用这个方法，除非你知道你正在做什么。
   * @method pauseAllTargets
   */
  pauseAllTargets: function pauseAllTargets() {
    return this.pauseAllTargetsWithMinPriority(cc.Scheduler.PRIORITY_SYSTEM);
  },

  /**
   * !#en
   * Pause all selectors from all targets with a minimum priority. <br/>
   * You should only call this with kCCPriorityNonSystemMin or higher.
   * !#zh
   * 暂停所有优先级的值大于指定优先级的定时器。<br/>
   * 你应该只暂停优先级的值大于 PRIORITY_NON_SYSTEM_MIN 的定时器。
   * @method pauseAllTargetsWithMinPriority
   * @param {Number} minPriority
   */
  pauseAllTargetsWithMinPriority: function pauseAllTargetsWithMinPriority(minPriority) {
    var idsWithSelectors = [];
    var self = this,
        element,
        locArrayForTimers = self._arrayForTimers;
    var i, li; // Custom Selectors

    for (i = 0, li = locArrayForTimers.length; i < li; i++) {
      element = locArrayForTimers[i];

      if (element) {
        element.paused = true;
        idsWithSelectors.push(element.target);
      }
    }

    var entry;

    if (minPriority < 0) {
      for (i = 0; i < this._updatesNegList.length; i++) {
        entry = this._updatesNegList[i];

        if (entry) {
          if (entry.priority >= minPriority) {
            entry.paused = true;
            idsWithSelectors.push(entry.target);
          }
        }
      }
    }

    if (minPriority <= 0) {
      for (i = 0; i < this._updates0List.length; i++) {
        entry = this._updates0List[i];

        if (entry) {
          entry.paused = true;
          idsWithSelectors.push(entry.target);
        }
      }
    }

    for (i = 0; i < this._updatesPosList.length; i++) {
      entry = this._updatesPosList[i];

      if (entry) {
        if (entry.priority >= minPriority) {
          entry.paused = true;
          idsWithSelectors.push(entry.target);
        }
      }
    }

    return idsWithSelectors;
  },

  /**
   * !#en
   * Resume selectors on a set of targets.<br/>
   * This can be useful for undoing a call to pauseAllCallbacks.
   * !#zh
   * 恢复指定数组中所有对象的定时器。<br/>
   * 这个函数是 pauseAllCallbacks 的逆操作。
   * @method resumeTargets
   * @param {Array} targetsToResume
   */
  resumeTargets: function resumeTargets(targetsToResume) {
    if (!targetsToResume) return;

    for (var i = 0; i < targetsToResume.length; i++) {
      this.resumeTarget(targetsToResume[i]);
    }
  },

  /**
   * !#en
   * Pauses the target.<br/>
   * All scheduled selectors/update for a given target won't be 'ticked' until the target is resumed.<br/>
   * If the target is not present, nothing happens.
   * !#zh
   * 暂停指定对象的定时器。<br/>
   * 指定对象的所有定时器都会被暂停。<br/>
   * 如果指定的对象没有定时器，什么也不会发生。
   * @method pauseTarget
   * @param {Object} target
   */
  pauseTarget: function pauseTarget(target) {
    cc.assertID(target, 1503);
    var targetId = target._id;

    if (!targetId) {
      if (target.__instanceId) {
        cc.warnID(1513);
        targetId = target._id = target.__instanceId;
      } else {
        cc.errorID(1510);
      }
    } //customer selectors


    var self = this,
        element = self._hashForTimers[targetId];

    if (element) {
      element.paused = true;
    } //update callback


    var elementUpdate = self._hashForUpdates[targetId];

    if (elementUpdate) {
      elementUpdate.entry.paused = true;
    }
  },

  /**
   * !#en
   * Resumes the target.<br/>
   * The 'target' will be unpaused, so all schedule selectors/update will be 'ticked' again.<br/>
   * If the target is not present, nothing happens.
   * !#zh
   * 恢复指定对象的所有定时器。<br/>
   * 指定对象的所有定时器将继续工作。<br/>
   * 如果指定的对象没有定时器，什么也不会发生。
   * @method resumeTarget
   * @param {Object} target
   */
  resumeTarget: function resumeTarget(target) {
    cc.assertID(target, 1504);
    var targetId = target._id;

    if (!targetId) {
      if (target.__instanceId) {
        cc.warnID(1513);
        targetId = target._id = target.__instanceId;
      } else {
        cc.errorID(1510);
      }
    } // custom selectors


    var self = this,
        element = self._hashForTimers[targetId];

    if (element) {
      element.paused = false;
    } //update callback


    var elementUpdate = self._hashForUpdates[targetId];

    if (elementUpdate) {
      elementUpdate.entry.paused = false;
    }
  },

  /**
   * !#en Returns whether or not the target is paused.
   * !#zh 返回指定对象的定时器是否暂停了。
   * @method isTargetPaused
   * @param {Object} target
   * @return {Boolean}
   */
  isTargetPaused: function isTargetPaused(target) {
    cc.assertID(target, 1505);
    var targetId = target._id;

    if (!targetId) {
      if (target.__instanceId) {
        cc.warnID(1513);
        targetId = target._id = target.__instanceId;
      } else {
        cc.errorID(1510);
      }
    } // Custom selectors


    var element = this._hashForTimers[targetId];

    if (element) {
      return element.paused;
    }

    var elementUpdate = this._hashForUpdates[targetId];

    if (elementUpdate) {
      return elementUpdate.entry.paused;
    }

    return false;
  }
};
/**
 * !#en Priority level reserved for system services.
 * !#zh 系统服务的优先级。
 * @property PRIORITY_SYSTEM
 * @type {Number}
 * @static
 */

cc.Scheduler.PRIORITY_SYSTEM = 1 << 31;
/**
 * !#en Minimum priority level for user scheduling.
 * !#zh 用户调度最低优先级。
 * @property PRIORITY_NON_SYSTEM
 * @type {Number}
 * @static
 */

cc.Scheduler.PRIORITY_NON_SYSTEM = cc.Scheduler.PRIORITY_SYSTEM + 1;
module.exports = cc.Scheduler;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDU2NoZWR1bGVyLmpzIl0sIm5hbWVzIjpbImpzIiwicmVxdWlyZSIsIklkR2VuZXJhdGVyIiwiTUFYX1BPT0xfU0laRSIsImlkR2VuZXJhdGVyIiwiTGlzdEVudHJ5IiwidGFyZ2V0IiwicHJpb3JpdHkiLCJwYXVzZWQiLCJtYXJrZWRGb3JEZWxldGlvbiIsIl9saXN0RW50cmllcyIsImdldCIsInJlc3VsdCIsInBvcCIsInB1dCIsImVudHJ5IiwibGVuZ3RoIiwicHVzaCIsIkhhc2hVcGRhdGVFbnRyeSIsImxpc3QiLCJjYWxsYmFjayIsIl9oYXNoVXBkYXRlRW50cmllcyIsIkhhc2hUaW1lckVudHJ5IiwidGltZXJzIiwidGltZXJJbmRleCIsImN1cnJlbnRUaW1lciIsImN1cnJlbnRUaW1lclNhbHZhZ2VkIiwiX3QiLCJfaGFzaFRpbWVyRW50cmllcyIsIkNhbGxiYWNrVGltZXIiLCJfbG9jayIsIl9zY2hlZHVsZXIiLCJfZWxhcHNlZCIsIl9ydW5Gb3JldmVyIiwiX3VzZURlbGF5IiwiX3RpbWVzRXhlY3V0ZWQiLCJfcmVwZWF0IiwiX2RlbGF5IiwiX2ludGVydmFsIiwiX3RhcmdldCIsIl9jYWxsYmFjayIsInByb3RvIiwicHJvdG90eXBlIiwiaW5pdFdpdGhDYWxsYmFjayIsInNjaGVkdWxlciIsInNlY29uZHMiLCJyZXBlYXQiLCJkZWxheSIsImNjIiwibWFjcm8iLCJSRVBFQVRfRk9SRVZFUiIsImdldEludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJpbnRlcnZhbCIsInVwZGF0ZSIsImR0IiwidHJpZ2dlciIsImNhbmNlbCIsImdldENhbGxiYWNrIiwiY2FsbCIsInVuc2NoZWR1bGUiLCJfdGltZXJzIiwidGltZXIiLCJTY2hlZHVsZXIiLCJfdGltZVNjYWxlIiwiX3VwZGF0ZXNOZWdMaXN0IiwiX3VwZGF0ZXMwTGlzdCIsIl91cGRhdGVzUG9zTGlzdCIsIl9oYXNoRm9yVXBkYXRlcyIsImNyZWF0ZU1hcCIsIl9oYXNoRm9yVGltZXJzIiwiX2N1cnJlbnRUYXJnZXQiLCJfY3VycmVudFRhcmdldFNhbHZhZ2VkIiwiX3VwZGF0ZUhhc2hMb2NrZWQiLCJfYXJyYXlGb3JUaW1lcnMiLCJjb25zdHJ1Y3RvciIsIl9yZW1vdmVIYXNoRWxlbWVudCIsImVsZW1lbnQiLCJfaWQiLCJhcnIiLCJpIiwibCIsInNwbGljZSIsIl9yZW1vdmVVcGRhdGVGcm9tSGFzaCIsInRhcmdldElkIiwic2VsZiIsImxpc3RFbnRyeSIsIl9wcmlvcml0eUluIiwicHBMaXN0IiwibGlzdEVsZW1lbnQiLCJfYXBwZW5kSW4iLCJlbmFibGVGb3JUYXJnZXQiLCJfX2luc3RhbmNlSWQiLCJ3YXJuSUQiLCJnZXROZXdJZCIsInNldFRpbWVTY2FsZSIsInRpbWVTY2FsZSIsImdldFRpbWVTY2FsZSIsImxlbiIsImVsdCIsInNjaGVkdWxlIiwidG1wIiwiYXJndW1lbnRzIiwiYXNzZXJ0SUQiLCJlcnJvcklEIiwibG9nSUQiLCJzY2hlZHVsZVVwZGF0ZSIsImhhc2hFbGVtZW50IiwidW5zY2hlZHVsZVVwZGF0ZSIsImxpIiwidW5zY2hlZHVsZUFsbEZvclRhcmdldCIsImluZGV4T2YiLCJ1bnNjaGVkdWxlQWxsIiwidW5zY2hlZHVsZUFsbFdpdGhNaW5Qcmlvcml0eSIsIlBSSU9SSVRZX1NZU1RFTSIsIm1pblByaW9yaXR5IiwidGVtcF9sZW5ndGgiLCJpc1NjaGVkdWxlZCIsInBhdXNlQWxsVGFyZ2V0cyIsInBhdXNlQWxsVGFyZ2V0c1dpdGhNaW5Qcmlvcml0eSIsImlkc1dpdGhTZWxlY3RvcnMiLCJsb2NBcnJheUZvclRpbWVycyIsInJlc3VtZVRhcmdldHMiLCJ0YXJnZXRzVG9SZXN1bWUiLCJyZXN1bWVUYXJnZXQiLCJwYXVzZVRhcmdldCIsImVsZW1lbnRVcGRhdGUiLCJpc1RhcmdldFBhdXNlZCIsIlBSSU9SSVRZX05PTl9TWVNURU0iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FB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QSxPQUFPLENBQUNyRSxNQUFmO0FBQ0g7O0FBQ0QsUUFBSXNILGFBQWEsR0FBRyxLQUFLMUQsZUFBTCxDQUFxQmdCLFFBQXJCLENBQXBCOztBQUNBLFFBQUkwQyxhQUFKLEVBQW1CO0FBQ2YsYUFBT0EsYUFBYSxDQUFDL0csS0FBZCxDQUFvQlAsTUFBM0I7QUFDSDs7QUFDRCxXQUFPLEtBQVA7QUFDSDtBQXB4Qm9CLENBQXpCO0FBdXhCQTs7Ozs7Ozs7QUFPQXdDLEVBQUUsQ0FBQ2UsU0FBSCxDQUFhbUQsZUFBYixHQUErQixLQUFLLEVBQXBDO0FBRUE7Ozs7Ozs7O0FBT0FsRSxFQUFFLENBQUNlLFNBQUgsQ0FBYWlFLG1CQUFiLEdBQW1DaEYsRUFBRSxDQUFDZSxTQUFILENBQWFtRCxlQUFiLEdBQStCLENBQWxFO0FBRUFlLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQmxGLEVBQUUsQ0FBQ2UsU0FBcEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qKlxuICogQG1vZHVsZSBjY1xuICovXG5jb25zdCBqcyA9IHJlcXVpcmUoJy4vcGxhdGZvcm0vanMnKTtcbmNvbnN0IElkR2VuZXJhdGVyID0gcmVxdWlyZSgnLi9wbGF0Zm9ybS9pZC1nZW5lcmF0ZXInKTtcbmNvbnN0IE1BWF9QT09MX1NJWkUgPSAyMDtcblxudmFyIGlkR2VuZXJhdGVyID0gbmV3IElkR2VuZXJhdGVyKCdTY2hlZHVsZXInKTtcblxuLy9kYXRhIHN0cnVjdHVyZXNcbi8qXG4gKiBBIGxpc3QgZG91YmxlLWxpbmtlZCBsaXN0IHVzZWQgZm9yIFwidXBkYXRlcyB3aXRoIHByaW9yaXR5XCJcbiAqIEBjbGFzcyBMaXN0RW50cnlcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXQgbm90IHJldGFpbmVkIChyZXRhaW5lZCBieSBoYXNoVXBkYXRlRW50cnkpXG4gKiBAcGFyYW0ge051bWJlcn0gcHJpb3JpdHlcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gcGF1c2VkXG4gKiBAcGFyYW0ge0Jvb2xlYW59IG1hcmtlZEZvckRlbGV0aW9uIHNlbGVjdG9yIHdpbGwgbm8gbG9uZ2VyIGJlIGNhbGxlZCBhbmQgZW50cnkgd2lsbCBiZSByZW1vdmVkIGF0IGVuZCBvZiB0aGUgbmV4dCB0aWNrXG4gKi9cbnZhciBMaXN0RW50cnkgPSBmdW5jdGlvbiAodGFyZ2V0LCBwcmlvcml0eSwgcGF1c2VkLCBtYXJrZWRGb3JEZWxldGlvbikge1xuICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgIHRoaXMucHJpb3JpdHkgPSBwcmlvcml0eTtcbiAgICB0aGlzLnBhdXNlZCA9IHBhdXNlZDtcbiAgICB0aGlzLm1hcmtlZEZvckRlbGV0aW9uID0gbWFya2VkRm9yRGVsZXRpb247XG59O1xuXG52YXIgX2xpc3RFbnRyaWVzID0gW107XG5MaXN0RW50cnkuZ2V0ID0gZnVuY3Rpb24gKHRhcmdldCwgcHJpb3JpdHksIHBhdXNlZCwgbWFya2VkRm9yRGVsZXRpb24pIHtcbiAgICB2YXIgcmVzdWx0ID0gX2xpc3RFbnRyaWVzLnBvcCgpO1xuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgcmVzdWx0LnRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgcmVzdWx0LnByaW9yaXR5ID0gcHJpb3JpdHk7XG4gICAgICAgIHJlc3VsdC5wYXVzZWQgPSBwYXVzZWQ7XG4gICAgICAgIHJlc3VsdC5tYXJrZWRGb3JEZWxldGlvbiA9IG1hcmtlZEZvckRlbGV0aW9uO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gbmV3IExpc3RFbnRyeSh0YXJnZXQsIHByaW9yaXR5LCBwYXVzZWQsIG1hcmtlZEZvckRlbGV0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5MaXN0RW50cnkucHV0ID0gZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgaWYgKF9saXN0RW50cmllcy5sZW5ndGggPCBNQVhfUE9PTF9TSVpFKSB7XG4gICAgICAgIGVudHJ5LnRhcmdldCA9IG51bGw7XG4gICAgICAgIF9saXN0RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgICB9XG59O1xuXG4vKlxuICogQSB1cGRhdGUgZW50cnkgbGlzdFxuICogQGNsYXNzIEhhc2hVcGRhdGVFbnRyeVxuICogQHBhcmFtIHtBcnJheX0gbGlzdCBXaGljaCBsaXN0IGRvZXMgaXQgYmVsb25nIHRvID9cbiAqIEBwYXJhbSB7TGlzdEVudHJ5fSBlbnRyeSBlbnRyeSBpbiB0aGUgbGlzdFxuICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCBoYXNoIGtleSAocmV0YWluZWQpXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICovXG52YXIgSGFzaFVwZGF0ZUVudHJ5ID0gZnVuY3Rpb24gKGxpc3QsIGVudHJ5LCB0YXJnZXQsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5saXN0ID0gbGlzdDtcbiAgICB0aGlzLmVudHJ5ID0gZW50cnk7XG4gICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xufTtcbnZhciBfaGFzaFVwZGF0ZUVudHJpZXMgPSBbXTtcbkhhc2hVcGRhdGVFbnRyeS5nZXQgPSBmdW5jdGlvbiAobGlzdCwgZW50cnksIHRhcmdldCwgY2FsbGJhY2spIHtcbiAgICB2YXIgcmVzdWx0ID0gX2hhc2hVcGRhdGVFbnRyaWVzLnBvcCgpO1xuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgcmVzdWx0Lmxpc3QgPSBsaXN0O1xuICAgICAgICByZXN1bHQuZW50cnkgPSBlbnRyeTtcbiAgICAgICAgcmVzdWx0LnRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgcmVzdWx0LmNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXN1bHQgPSBuZXcgSGFzaFVwZGF0ZUVudHJ5KGxpc3QsIGVudHJ5LCB0YXJnZXQsIGNhbGxiYWNrKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5IYXNoVXBkYXRlRW50cnkucHV0ID0gZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgaWYgKF9oYXNoVXBkYXRlRW50cmllcy5sZW5ndGggPCBNQVhfUE9PTF9TSVpFKSB7XG4gICAgICAgIGVudHJ5Lmxpc3QgPSBlbnRyeS5lbnRyeSA9IGVudHJ5LnRhcmdldCA9IGVudHJ5LmNhbGxiYWNrID0gbnVsbDtcbiAgICAgICAgX2hhc2hVcGRhdGVFbnRyaWVzLnB1c2goZW50cnkpO1xuICAgIH1cbn07XG5cbi8vXG4vKlxuICogSGFzaCBFbGVtZW50IHVzZWQgZm9yIFwic2VsZWN0b3JzIHdpdGggaW50ZXJ2YWxcIlxuICogQGNsYXNzIEhhc2hUaW1lckVudHJ5XG4gKiBAcGFyYW0ge0FycmF5fSB0aW1lcnNcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXQgIGhhc2gga2V5IChyZXRhaW5lZClcbiAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lckluZGV4XG4gKiBAcGFyYW0ge1RpbWVyfSBjdXJyZW50VGltZXJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gY3VycmVudFRpbWVyU2FsdmFnZWRcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gcGF1c2VkXG4gKi9cbnZhciBIYXNoVGltZXJFbnRyeSA9IGZ1bmN0aW9uICh0aW1lcnMsIHRhcmdldCwgdGltZXJJbmRleCwgY3VycmVudFRpbWVyLCBjdXJyZW50VGltZXJTYWx2YWdlZCwgcGF1c2VkKSB7XG4gICAgdmFyIF90ID0gdGhpcztcbiAgICBfdC50aW1lcnMgPSB0aW1lcnM7XG4gICAgX3QudGFyZ2V0ID0gdGFyZ2V0O1xuICAgIF90LnRpbWVySW5kZXggPSB0aW1lckluZGV4O1xuICAgIF90LmN1cnJlbnRUaW1lciA9IGN1cnJlbnRUaW1lcjtcbiAgICBfdC5jdXJyZW50VGltZXJTYWx2YWdlZCA9IGN1cnJlbnRUaW1lclNhbHZhZ2VkO1xuICAgIF90LnBhdXNlZCA9IHBhdXNlZDtcbn07XG52YXIgX2hhc2hUaW1lckVudHJpZXMgPSBbXTtcbkhhc2hUaW1lckVudHJ5LmdldCA9IGZ1bmN0aW9uICh0aW1lcnMsIHRhcmdldCwgdGltZXJJbmRleCwgY3VycmVudFRpbWVyLCBjdXJyZW50VGltZXJTYWx2YWdlZCwgcGF1c2VkKSB7XG4gICAgdmFyIHJlc3VsdCA9IF9oYXNoVGltZXJFbnRyaWVzLnBvcCgpO1xuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgcmVzdWx0LnRpbWVycyA9IHRpbWVycztcbiAgICAgICAgcmVzdWx0LnRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgcmVzdWx0LnRpbWVySW5kZXggPSB0aW1lckluZGV4O1xuICAgICAgICByZXN1bHQuY3VycmVudFRpbWVyID0gY3VycmVudFRpbWVyO1xuICAgICAgICByZXN1bHQuY3VycmVudFRpbWVyU2FsdmFnZWQgPSBjdXJyZW50VGltZXJTYWx2YWdlZDtcbiAgICAgICAgcmVzdWx0LnBhdXNlZCA9IHBhdXNlZDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IG5ldyBIYXNoVGltZXJFbnRyeSh0aW1lcnMsIHRhcmdldCwgdGltZXJJbmRleCwgY3VycmVudFRpbWVyLCBjdXJyZW50VGltZXJTYWx2YWdlZCwgcGF1c2VkKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5IYXNoVGltZXJFbnRyeS5wdXQgPSBmdW5jdGlvbiAoZW50cnkpIHtcbiAgICBpZiAoX2hhc2hUaW1lckVudHJpZXMubGVuZ3RoIDwgTUFYX1BPT0xfU0laRSkge1xuICAgICAgICBlbnRyeS50aW1lcnMgPSBlbnRyeS50YXJnZXQgPSBlbnRyeS5jdXJyZW50VGltZXIgPSBudWxsO1xuICAgICAgICBfaGFzaFRpbWVyRW50cmllcy5wdXNoKGVudHJ5KTtcbiAgICB9XG59O1xuXG4vKlxuICogTGlnaHQgd2VpZ2h0IHRpbWVyXG4gKiBAZXh0ZW5kcyBjYy5DbGFzc1xuICovXG5mdW5jdGlvbiBDYWxsYmFja1RpbWVyICgpIHtcbiAgICB0aGlzLl9sb2NrID0gZmFsc2U7XG4gICAgdGhpcy5fc2NoZWR1bGVyID0gbnVsbDtcbiAgICB0aGlzLl9lbGFwc2VkID0gLTE7XG4gICAgdGhpcy5fcnVuRm9yZXZlciA9IGZhbHNlO1xuICAgIHRoaXMuX3VzZURlbGF5ID0gZmFsc2U7XG4gICAgdGhpcy5fdGltZXNFeGVjdXRlZCA9IDA7XG4gICAgdGhpcy5fcmVwZWF0ID0gMDtcbiAgICB0aGlzLl9kZWxheSA9IDA7XG4gICAgdGhpcy5faW50ZXJ2YWwgPSAwO1xuXG4gICAgdGhpcy5fdGFyZ2V0ID0gbnVsbDtcbiAgICB0aGlzLl9jYWxsYmFjayA9IG51bGw7XG59XG5cbnZhciBwcm90byA9IENhbGxiYWNrVGltZXIucHJvdG90eXBlO1xuXG5wcm90by5pbml0V2l0aENhbGxiYWNrID0gZnVuY3Rpb24gKHNjaGVkdWxlciwgY2FsbGJhY2ssIHRhcmdldCwgc2Vjb25kcywgcmVwZWF0LCBkZWxheSkge1xuICAgIHRoaXMuX2xvY2sgPSBmYWxzZTtcbiAgICB0aGlzLl9zY2hlZHVsZXIgPSBzY2hlZHVsZXI7XG4gICAgdGhpcy5fdGFyZ2V0ID0gdGFyZ2V0O1xuICAgIHRoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XG5cbiAgICB0aGlzLl9lbGFwc2VkID0gLTE7XG4gICAgdGhpcy5faW50ZXJ2YWwgPSBzZWNvbmRzO1xuICAgIHRoaXMuX2RlbGF5ID0gZGVsYXk7XG4gICAgdGhpcy5fdXNlRGVsYXkgPSAodGhpcy5fZGVsYXkgPiAwKTtcbiAgICB0aGlzLl9yZXBlYXQgPSByZXBlYXQ7XG4gICAgdGhpcy5fcnVuRm9yZXZlciA9ICh0aGlzLl9yZXBlYXQgPT09IGNjLm1hY3JvLlJFUEVBVF9GT1JFVkVSKTtcbiAgICByZXR1cm4gdHJ1ZTtcbn07XG4vKipcbiAqIEByZXR1cm4ge051bWJlcn0gcmV0dXJucyBpbnRlcnZhbCBvZiB0aW1lclxuICovXG5wcm90by5nZXRJbnRlcnZhbCA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2ludGVydmFsO307XG4vKipcbiAqIEBwYXJhbSB7TnVtYmVyfSBpbnRlcnZhbCBzZXQgaW50ZXJ2YWwgaW4gc2Vjb25kc1xuICovXG5wcm90by5zZXRJbnRlcnZhbCA9IGZ1bmN0aW9uKGludGVydmFsKXt0aGlzLl9pbnRlcnZhbCA9IGludGVydmFsO307XG5cbi8qKlxuICogdHJpZ2dlcnMgdGhlIHRpbWVyXG4gKiBAcGFyYW0ge051bWJlcn0gZHQgZGVsdGEgdGltZVxuICovXG5wcm90by51cGRhdGUgPSBmdW5jdGlvbiAoZHQpIHtcbiAgICBpZiAodGhpcy5fZWxhcHNlZCA9PT0gLTEpIHtcbiAgICAgICAgdGhpcy5fZWxhcHNlZCA9IDA7XG4gICAgICAgIHRoaXMuX3RpbWVzRXhlY3V0ZWQgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2VsYXBzZWQgKz0gZHQ7XG4gICAgICAgIGlmICh0aGlzLl9ydW5Gb3JldmVyICYmICF0aGlzLl91c2VEZWxheSkgey8vc3RhbmRhcmQgdGltZXIgdXNhZ2VcbiAgICAgICAgICAgIGlmICh0aGlzLl9lbGFwc2VkID49IHRoaXMuX2ludGVydmFsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZWxhcHNlZCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7Ly9hZHZhbmNlZCB1c2FnZVxuICAgICAgICAgICAgaWYgKHRoaXMuX3VzZURlbGF5KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2VsYXBzZWQgPj0gdGhpcy5fZGVsYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxhcHNlZCAtPSB0aGlzLl9kZWxheTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGltZXNFeGVjdXRlZCArPSAxO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl91c2VEZWxheSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2VsYXBzZWQgPj0gdGhpcy5faW50ZXJ2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxhcHNlZCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RpbWVzRXhlY3V0ZWQgKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9jYWxsYmFjayAmJiAhdGhpcy5fcnVuRm9yZXZlciAmJiB0aGlzLl90aW1lc0V4ZWN1dGVkID4gdGhpcy5fcmVwZWF0KVxuICAgICAgICAgICAgICAgIHRoaXMuY2FuY2VsKCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5wcm90by5nZXRDYWxsYmFjayA9IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHRoaXMuX2NhbGxiYWNrO1xufTtcblxucHJvdG8udHJpZ2dlciA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5fdGFyZ2V0ICYmIHRoaXMuX2NhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuX2xvY2sgPSB0cnVlO1xuICAgICAgICB0aGlzLl9jYWxsYmFjay5jYWxsKHRoaXMuX3RhcmdldCwgdGhpcy5fZWxhcHNlZCk7XG4gICAgICAgIHRoaXMuX2xvY2sgPSBmYWxzZTtcbiAgICB9XG59O1xuXG5wcm90by5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy9vdmVycmlkZVxuICAgIHRoaXMuX3NjaGVkdWxlci51bnNjaGVkdWxlKHRoaXMuX2NhbGxiYWNrLCB0aGlzLl90YXJnZXQpO1xufTtcblxudmFyIF90aW1lcnMgPSBbXTtcbkNhbGxiYWNrVGltZXIuZ2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfdGltZXJzLnBvcCgpIHx8IG5ldyBDYWxsYmFja1RpbWVyKCk7XG59O1xuQ2FsbGJhY2tUaW1lci5wdXQgPSBmdW5jdGlvbiAodGltZXIpIHtcbiAgICBpZiAoX3RpbWVycy5sZW5ndGggPCBNQVhfUE9PTF9TSVpFICYmICF0aW1lci5fbG9jaykge1xuICAgICAgICB0aW1lci5fc2NoZWR1bGVyID0gdGltZXIuX3RhcmdldCA9IHRpbWVyLl9jYWxsYmFjayA9IG51bGw7XG4gICAgICAgIF90aW1lcnMucHVzaCh0aW1lcik7XG4gICAgfVxufTtcblxuLyoqXG4gKiAhI2VuXG4gKiBTY2hlZHVsZXIgaXMgcmVzcG9uc2libGUgb2YgdHJpZ2dlcmluZyB0aGUgc2NoZWR1bGVkIGNhbGxiYWNrcy48YnIvPlxuICogWW91IHNob3VsZCBub3QgdXNlIE5TVGltZXIuIEluc3RlYWQgdXNlIHRoaXMgY2xhc3MuPGJyLz5cbiAqIDxici8+XG4gKiBUaGVyZSBhcmUgMiBkaWZmZXJlbnQgdHlwZXMgb2YgY2FsbGJhY2tzIChzZWxlY3RvcnMpOjxici8+XG4gKiAgICAgLSB1cGRhdGUgY2FsbGJhY2s6IHRoZSAndXBkYXRlJyBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBldmVyeSBmcmFtZS4gWW91IGNhbiBjdXN0b21pemUgdGhlIHByaW9yaXR5Ljxici8+XG4gKiAgICAgLSBjdXN0b20gY2FsbGJhY2s6IEEgY3VzdG9tIGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIGV2ZXJ5IGZyYW1lLCBvciB3aXRoIGEgY3VzdG9tIGludGVydmFsIG9mIHRpbWU8YnIvPlxuICogPGJyLz5cbiAqIFRoZSAnY3VzdG9tIHNlbGVjdG9ycycgc2hvdWxkIGJlIGF2b2lkZWQgd2hlbiBwb3NzaWJsZS4gSXQgaXMgZmFzdGVyLFxuICogYW5kIGNvbnN1bWVzIGxlc3MgbWVtb3J5IHRvIHVzZSB0aGUgJ3VwZGF0ZSBjYWxsYmFjaycuICpcbiAqICEjemhcbiAqIFNjaGVkdWxlciDmmK/otJ/otKPop6blj5Hlm57osIPlh73mlbDnmoTnsbvjgII8YnIvPlxuICog6YCa5bi45oOF5Ya15LiL77yM5bu66K6u5L2/55SoIGNjLmRpcmVjdG9yLmdldFNjaGVkdWxlcigpIOadpeiOt+WPluezu+e7n+WumuaXtuWZqOOAgjxici8+XG4gKiDmnInkuKTnp43kuI3lkIznsbvlnovnmoTlrprml7blmajvvJo8YnIvPlxuICogICAgIC0gdXBkYXRlIOWumuaXtuWZqO+8muavj+S4gOW4p+mDveS8muinpuWPkeOAguaCqOWPr+S7peiHquWumuS5ieS8mOWFiOe6p+OAgjxici8+XG4gKiAgICAgLSDoh6rlrprkuYnlrprml7blmajvvJroh6rlrprkuYnlrprml7blmajlj6/ku6Xmr4/kuIDluKfmiJbogIXoh6rlrprkuYnnmoTml7bpl7Tpl7TpmpTop6blj5HjgII8YnIvPlxuICog5aaC5p6c5biM5pyb5q+P5bin6YO96Kem5Y+R77yM5bqU6K+l5L2/55SoIHVwZGF0ZSDlrprml7blmajvvIzkvb/nlKggdXBkYXRlIOWumuaXtuWZqOabtOW/q++8jOiAjOS4lOa2iOiAl+abtOWwkeeahOWGheWtmOOAglxuICpcbiAqIEBjbGFzcyBTY2hlZHVsZXJcbiAqL1xuY2MuU2NoZWR1bGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX3RpbWVTY2FsZSA9IDEuMDtcbiAgICB0aGlzLl91cGRhdGVzTmVnTGlzdCA9IFtdOyAgLy8gbGlzdCBvZiBwcmlvcml0eSA8IDBcbiAgICB0aGlzLl91cGRhdGVzMExpc3QgPSBbXTsgICAgLy8gbGlzdCBvZiBwcmlvcml0eSA9PSAwXG4gICAgdGhpcy5fdXBkYXRlc1Bvc0xpc3QgPSBbXTsgIC8vIGxpc3Qgb2YgcHJpb3JpdHkgPiAwXG4gICAgdGhpcy5faGFzaEZvclVwZGF0ZXMgPSBqcy5jcmVhdGVNYXAodHJ1ZSk7ICAvLyBoYXNoIHVzZWQgdG8gZmV0Y2ggcXVpY2tseSB0aGUgbGlzdCBlbnRyaWVzIGZvciBwYXVzZSwgZGVsZXRlLCBldGNcbiAgICB0aGlzLl9oYXNoRm9yVGltZXJzID0ganMuY3JlYXRlTWFwKHRydWUpOyAgIC8vIFVzZWQgZm9yIFwic2VsZWN0b3JzIHdpdGggaW50ZXJ2YWxcIlxuICAgIHRoaXMuX2N1cnJlbnRUYXJnZXQgPSBudWxsO1xuICAgIHRoaXMuX2N1cnJlbnRUYXJnZXRTYWx2YWdlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3VwZGF0ZUhhc2hMb2NrZWQgPSBmYWxzZTsgLy8gSWYgdHJ1ZSB1bnNjaGVkdWxlIHdpbGwgbm90IHJlbW92ZSBhbnl0aGluZyBmcm9tIGEgaGFzaC4gRWxlbWVudHMgd2lsbCBvbmx5IGJlIG1hcmtlZCBmb3IgZGVsZXRpb24uXG5cbiAgICB0aGlzLl9hcnJheUZvclRpbWVycyA9IFtdOyAgLy8gU3BlZWQgdXAgaW5kZXhpbmdcbiAgICAvL3RoaXMuX2FycmF5Rm9yVXBkYXRlcyA9IFtdOyAgIC8vIFNwZWVkIHVwIGluZGV4aW5nXG59O1xuXG5jYy5TY2hlZHVsZXIucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBjYy5TY2hlZHVsZXIsXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXByaXZhdGUgbWV0aG9kLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgX3JlbW92ZUhhc2hFbGVtZW50OiBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICBkZWxldGUgdGhpcy5faGFzaEZvclRpbWVyc1tlbGVtZW50LnRhcmdldC5faWRdO1xuICAgICAgICB2YXIgYXJyID0gdGhpcy5fYXJyYXlGb3JUaW1lcnM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gYXJyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgaWYgKGFycltpXSA9PT0gZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGFyci5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgSGFzaFRpbWVyRW50cnkucHV0KGVsZW1lbnQpO1xuICAgIH0sXG5cbiAgICBfcmVtb3ZlVXBkYXRlRnJvbUhhc2g6IGZ1bmN0aW9uIChlbnRyeSkge1xuICAgICAgICB2YXIgdGFyZ2V0SWQgPSBlbnRyeS50YXJnZXQuX2lkO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXMsIGVsZW1lbnQgPSBzZWxmLl9oYXNoRm9yVXBkYXRlc1t0YXJnZXRJZF07XG4gICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgbGlzdCBlbnRyeSBmcm9tIGxpc3RcbiAgICAgICAgICAgIHZhciBsaXN0ID0gZWxlbWVudC5saXN0LCBsaXN0RW50cnkgPSBlbGVtZW50LmVudHJ5O1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBsaXN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0RW50cnkpIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGVsZXRlIHNlbGYuX2hhc2hGb3JVcGRhdGVzW3RhcmdldElkXTtcbiAgICAgICAgICAgIExpc3RFbnRyeS5wdXQobGlzdEVudHJ5KTtcbiAgICAgICAgICAgIEhhc2hVcGRhdGVFbnRyeS5wdXQoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3ByaW9yaXR5SW46IGZ1bmN0aW9uIChwcExpc3QsIGxpc3RFbGVtZW50LCBwcmlvcml0eSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBwTGlzdC5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBpZiAocHJpb3JpdHkgPCBwcExpc3RbaV0ucHJpb3JpdHkpIHtcbiAgICAgICAgICAgICAgICBwcExpc3Quc3BsaWNlKGksIDAsIGxpc3RFbGVtZW50KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcHBMaXN0LnB1c2gobGlzdEVsZW1lbnQpO1xuICAgIH0sXG5cbiAgICBfYXBwZW5kSW46IGZ1bmN0aW9uIChwcExpc3QsIGxpc3RFbGVtZW50KSB7XG4gICAgICAgIHBwTGlzdC5wdXNoKGxpc3RFbGVtZW50KTtcbiAgICB9LFxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXB1YmxpYyBtZXRob2QtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLyoqXG4gICAgICogIWVuIFRoaXMgbWV0aG9kIHNob3VsZCBiZSBjYWxsZWQgZm9yIGFueSB0YXJnZXQgd2hpY2ggbmVlZHMgdG8gc2NoZWR1bGUgdGFza3MsIGFuZCB0aGlzIG1ldGhvZCBzaG91bGQgYmUgY2FsbGVkIGJlZm9yZSBhbnkgc2NoZWR1bGVyIEFQSSB1c2FnZS5cbiAgICAgKiBUaGlzIG1ldGhvZCB3aWxsIGFkZCBhIGBfaWRgIHByb3BlcnR5IGlmIGl0IGRvZXNuJ3QgZXhpc3QuXG4gICAgICogIXpoIOS7u+S9lemcgOimgeeUqCBTY2hlZHVsZXIg566h55CG5Lu75Yqh55qE5a+56LGh5Li75L2T6YO95bqU6K+l6LCD55So6L+Z5Liq5pa55rOV77yM5bm25LiU5bqU6K+l5Zyo6LCD55So5Lu75L2VIFNjaGVkdWxlciBBUEkg5LmL5YmN6LCD55So6L+Z5Liq5pa55rOV44CCXG4gICAgICog6L+Z5Liq5pa55rOV5Lya57uZ5a+56LGh5re75Yqg5LiA5LiqIGBfaWRgIOWxnuaAp++8jOWmguaenOi/meS4quWxnuaAp+S4jeWtmOWcqOeahOivneOAglxuICAgICAqIEBtZXRob2QgZW5hYmxlRm9yVGFyZ2V0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IHRhcmdldFxuICAgICAqL1xuICAgIGVuYWJsZUZvclRhcmdldDogZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICBpZiAoIXRhcmdldC5faWQpIHtcbiAgICAgICAgICAgIGlmICh0YXJnZXQuX19pbnN0YW5jZUlkKSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybklEKDE1MTMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0Ll9pZCA9IGlkR2VuZXJhdGVyLmdldE5ld0lkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIE1vZGlmaWVzIHRoZSB0aW1lIG9mIGFsbCBzY2hlZHVsZWQgY2FsbGJhY2tzLjxici8+XG4gICAgICogWW91IGNhbiB1c2UgdGhpcyBwcm9wZXJ0eSB0byBjcmVhdGUgYSAnc2xvdyBtb3Rpb24nIG9yICdmYXN0IGZvcndhcmQnIGVmZmVjdC48YnIvPlxuICAgICAqIERlZmF1bHQgaXMgMS4wLiBUbyBjcmVhdGUgYSAnc2xvdyBtb3Rpb24nIGVmZmVjdCwgdXNlIHZhbHVlcyBiZWxvdyAxLjAuPGJyLz5cbiAgICAgKiBUbyBjcmVhdGUgYSAnZmFzdCBmb3J3YXJkJyBlZmZlY3QsIHVzZSB2YWx1ZXMgaGlnaGVyIHRoYW4gMS4wLjxici8+XG4gICAgICogTm90Ze+8mkl0IHdpbGwgYWZmZWN0IEVWRVJZIHNjaGVkdWxlZCBzZWxlY3RvciAvIGFjdGlvbi5cbiAgICAgKiAhI3poXG4gICAgICog6K6+572u5pe26Ze06Ze06ZqU55qE57yp5pS+5q+U5L6L44CCPGJyLz5cbiAgICAgKiDmgqjlj6/ku6Xkvb/nlKjov5nkuKrmlrnms5XmnaXliJvlu7rkuIDkuKog4oCcc2xvdyBtb3Rpb27vvIjmhaLliqjkvZzvvInigJ0g5oiWIOKAnGZhc3QgZm9yd2FyZO+8iOW/q+i/m++8ieKAnSDnmoTmlYjmnpzjgII8YnIvPlxuICAgICAqIOm7mOiupOaYryAxLjDjgILopoHliJvlu7rkuIDkuKog4oCcc2xvdyBtb3Rpb27vvIjmhaLliqjkvZzvvInigJ0g5pWI5p6cLOS9v+eUqOWAvOS9juS6jiAxLjDjgII8YnIvPlxuICAgICAqIOimgeS9v+eUqCDigJxmYXN0IGZvcndhcmTvvIjlv6vov5vvvInigJ0g5pWI5p6c77yM5L2/55So5YC85aSn5LqOIDEuMOOAgjxici8+XG4gICAgICog5rOo5oSP77ya5a6D5b2x5ZON6K+lIFNjaGVkdWxlciDkuIvnrqHnkIbnmoTmiYDmnInlrprml7blmajjgIJcbiAgICAgKiBAbWV0aG9kIHNldFRpbWVTY2FsZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lU2NhbGVcbiAgICAgKi9cbiAgICBzZXRUaW1lU2NhbGU6IGZ1bmN0aW9uICh0aW1lU2NhbGUpIHtcbiAgICAgICAgdGhpcy5fdGltZVNjYWxlID0gdGltZVNjYWxlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgdGltZSBzY2FsZSBvZiBzY2hlZHVsZXIuXG4gICAgICogISN6aCDojrflj5bml7bpl7Tpl7TpmpTnmoTnvKnmlL7mr5TkvovjgIJcbiAgICAgKiBAbWV0aG9kIGdldFRpbWVTY2FsZVxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRUaW1lU2NhbGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RpbWVTY2FsZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiAndXBkYXRlJyB0aGUgc2NoZWR1bGVyLiAoWW91IHNob3VsZCBORVZFUiBjYWxsIHRoaXMgbWV0aG9kLCB1bmxlc3MgeW91IGtub3cgd2hhdCB5b3UgYXJlIGRvaW5nLilcbiAgICAgKiAhI3poIHVwZGF0ZSDosIPluqblh73mlbDjgIIo5LiN5bqU6K+l55u05o6l6LCD55So6L+Z5Liq5pa55rOV77yM6Zmk6Z2e5a6M5YWo5LqG6Kej6L+Z5LmI5YGa55qE57uT5p6cKVxuICAgICAqIEBtZXRob2QgdXBkYXRlXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGR0IGRlbHRhIHRpbWVcbiAgICAgKi9cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuICAgICAgICB0aGlzLl91cGRhdGVIYXNoTG9ja2VkID0gdHJ1ZTtcbiAgICAgICAgaWYodGhpcy5fdGltZVNjYWxlICE9PSAxKVxuICAgICAgICAgICAgZHQgKj0gdGhpcy5fdGltZVNjYWxlO1xuXG4gICAgICAgIHZhciBpLCBsaXN0LCBsZW4sIGVudHJ5O1xuXG4gICAgICAgIGZvcihpPTAsbGlzdD10aGlzLl91cGRhdGVzTmVnTGlzdCwgbGVuID0gbGlzdC5sZW5ndGg7IGk8bGVuOyBpKyspe1xuICAgICAgICAgICAgZW50cnkgPSBsaXN0W2ldO1xuICAgICAgICAgICAgaWYgKCFlbnRyeS5wYXVzZWQgJiYgIWVudHJ5Lm1hcmtlZEZvckRlbGV0aW9uKVxuICAgICAgICAgICAgICAgIGVudHJ5LnRhcmdldC51cGRhdGUoZHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yKGk9MCwgbGlzdD10aGlzLl91cGRhdGVzMExpc3QsIGxlbj1saXN0Lmxlbmd0aDsgaTxsZW47IGkrKyl7XG4gICAgICAgICAgICBlbnRyeSA9IGxpc3RbaV07XG4gICAgICAgICAgICBpZiAoIWVudHJ5LnBhdXNlZCAmJiAhZW50cnkubWFya2VkRm9yRGVsZXRpb24pXG4gICAgICAgICAgICAgICAgZW50cnkudGFyZ2V0LnVwZGF0ZShkdCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IoaT0wLCBsaXN0PXRoaXMuX3VwZGF0ZXNQb3NMaXN0LCBsZW49bGlzdC5sZW5ndGg7IGk8bGVuOyBpKyspe1xuICAgICAgICAgICAgZW50cnkgPSBsaXN0W2ldO1xuICAgICAgICAgICAgaWYgKCFlbnRyeS5wYXVzZWQgJiYgIWVudHJ5Lm1hcmtlZEZvckRlbGV0aW9uKVxuICAgICAgICAgICAgICAgIGVudHJ5LnRhcmdldC51cGRhdGUoZHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSXRlcmF0ZSBvdmVyIGFsbCB0aGUgY3VzdG9tIHNlbGVjdG9yc1xuICAgICAgICB2YXIgZWx0LCBhcnIgPSB0aGlzLl9hcnJheUZvclRpbWVycztcbiAgICAgICAgZm9yKGk9MDsgaTxhcnIubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgZWx0ID0gYXJyW2ldO1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudFRhcmdldCA9IGVsdDtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRUYXJnZXRTYWx2YWdlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBpZiAoIWVsdC5wYXVzZWQpe1xuICAgICAgICAgICAgICAgIC8vIFRoZSAndGltZXJzJyBhcnJheSBtYXkgY2hhbmdlIHdoaWxlIGluc2lkZSB0aGlzIGxvb3BcbiAgICAgICAgICAgICAgICBmb3IgKGVsdC50aW1lckluZGV4ID0gMDsgZWx0LnRpbWVySW5kZXggPCBlbHQudGltZXJzLmxlbmd0aDsgKysoZWx0LnRpbWVySW5kZXgpKXtcbiAgICAgICAgICAgICAgICAgICAgZWx0LmN1cnJlbnRUaW1lciA9IGVsdC50aW1lcnNbZWx0LnRpbWVySW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICBlbHQuY3VycmVudFRpbWVyU2FsdmFnZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICBlbHQuY3VycmVudFRpbWVyLnVwZGF0ZShkdCk7XG4gICAgICAgICAgICAgICAgICAgIGVsdC5jdXJyZW50VGltZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gb25seSBkZWxldGUgY3VycmVudFRhcmdldCBpZiBubyBhY3Rpb25zIHdlcmUgc2NoZWR1bGVkIGR1cmluZyB0aGUgY3ljbGUgKGlzc3VlICM0ODEpXG4gICAgICAgICAgICBpZiAodGhpcy5fY3VycmVudFRhcmdldFNhbHZhZ2VkICYmIHRoaXMuX2N1cnJlbnRUYXJnZXQudGltZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZUhhc2hFbGVtZW50KHRoaXMuX2N1cnJlbnRUYXJnZXQpO1xuICAgICAgICAgICAgICAgIC0taTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGRlbGV0ZSBhbGwgdXBkYXRlcyB0aGF0IGFyZSBtYXJrZWQgZm9yIGRlbGV0aW9uXG4gICAgICAgIC8vIHVwZGF0ZXMgd2l0aCBwcmlvcml0eSA8IDBcbiAgICAgICAgZm9yKGk9MCxsaXN0PXRoaXMuX3VwZGF0ZXNOZWdMaXN0OyBpPGxpc3QubGVuZ3RoOyApe1xuICAgICAgICAgICAgZW50cnkgPSBsaXN0W2ldO1xuICAgICAgICAgICAgaWYoZW50cnkubWFya2VkRm9yRGVsZXRpb24pXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlVXBkYXRlRnJvbUhhc2goZW50cnkpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcihpPTAsIGxpc3Q9dGhpcy5fdXBkYXRlczBMaXN0OyBpPGxpc3QubGVuZ3RoOyApe1xuICAgICAgICAgICAgZW50cnkgPSBsaXN0W2ldO1xuICAgICAgICAgICAgaWYgKGVudHJ5Lm1hcmtlZEZvckRlbGV0aW9uKVxuICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZVVwZGF0ZUZyb21IYXNoKGVudHJ5KTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IoaT0wLCBsaXN0PXRoaXMuX3VwZGF0ZXNQb3NMaXN0OyBpPGxpc3QubGVuZ3RoOyApe1xuICAgICAgICAgICAgZW50cnkgPSBsaXN0W2ldO1xuICAgICAgICAgICAgaWYgKGVudHJ5Lm1hcmtlZEZvckRlbGV0aW9uKVxuICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZVVwZGF0ZUZyb21IYXNoKGVudHJ5KTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl91cGRhdGVIYXNoTG9ja2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRUYXJnZXQgPSBudWxsO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogPHA+XG4gICAgICogICBUaGUgc2NoZWR1bGVkIG1ldGhvZCB3aWxsIGJlIGNhbGxlZCBldmVyeSAnaW50ZXJ2YWwnIHNlY29uZHMuPGJyLz5cbiAgICAgKiAgIElmIHBhdXNlZCBpcyBZRVMsIHRoZW4gaXQgd29uJ3QgYmUgY2FsbGVkIHVudGlsIGl0IGlzIHJlc3VtZWQuPGJyLz5cbiAgICAgKiAgIElmICdpbnRlcnZhbCcgaXMgMCwgaXQgd2lsbCBiZSBjYWxsZWQgZXZlcnkgZnJhbWUsIGJ1dCBpZiBzbywgaXQgcmVjb21tZW5kZWQgdG8gdXNlICdzY2hlZHVsZVVwZGF0ZUZvclRhcmdldDonIGluc3RlYWQuPGJyLz5cbiAgICAgKiAgIElmIHRoZSBjYWxsYmFjayBmdW5jdGlvbiBpcyBhbHJlYWR5IHNjaGVkdWxlZCwgdGhlbiBvbmx5IHRoZSBpbnRlcnZhbCBwYXJhbWV0ZXIgd2lsbCBiZSB1cGRhdGVkIHdpdGhvdXQgcmUtc2NoZWR1bGluZyBpdCBhZ2Fpbi48YnIvPlxuICAgICAqICAgcmVwZWF0IGxldCB0aGUgYWN0aW9uIGJlIHJlcGVhdGVkIHJlcGVhdCArIDEgdGltZXMsIHVzZSBjYy5tYWNyby5SRVBFQVRfRk9SRVZFUiB0byBsZXQgdGhlIGFjdGlvbiBydW4gY29udGludW91c2x5PGJyLz5cbiAgICAgKiAgIGRlbGF5IGlzIHRoZSBhbW91bnQgb2YgdGltZSB0aGUgYWN0aW9uIHdpbGwgd2FpdCBiZWZvcmUgaXQnbGwgc3RhcnQ8YnIvPlxuICAgICAqIDwvcD5cbiAgICAgKiAhI3poXG4gICAgICog5oyH5a6a5Zue6LCD5Ye95pWw77yM6LCD55So5a+56LGh562J5L+h5oGv5p2l5re75Yqg5LiA5Liq5paw55qE5a6a5pe25Zmo44CCPGJyLz5cbiAgICAgKiDlpoLmnpwgcGF1c2VkIOWAvOS4uiB0cnVl77yM6YKj5LmI55u05YiwIHJlc3VtZSDooqvosIPnlKjmiY3lvIDlp4vorqHml7bjgII8YnIvPlxuICAgICAqIOW9k+aXtumXtOmXtOmalOi+vuWIsOaMh+WumuWAvOaXtu+8jOiuvue9rueahOWbnuiwg+WHveaVsOWwhuS8muiiq+iwg+eUqOOAgjxici8+XG4gICAgICog5aaC5p6cIGludGVydmFsIOWAvOS4uiAw77yM6YKj5LmI5Zue6LCD5Ye95pWw5q+P5LiA5bin6YO95Lya6KKr6LCD55So77yM5L2G5aaC5p6c5piv6L+Z5qC377yMXG4gICAgICog5bu66K6u5L2/55SoIHNjaGVkdWxlVXBkYXRlRm9yVGFyZ2V0IOS7o+abv+OAgjxici8+XG4gICAgICog5aaC5p6c5Zue6LCD5Ye95pWw5bey57uP6KKr5a6a5pe25Zmo5L2/55So77yM6YKj5LmI5Y+q5Lya5pu05paw5LmL5YmN5a6a5pe25Zmo55qE5pe26Ze06Ze06ZqU5Y+C5pWw77yM5LiN5Lya6K6+572u5paw55qE5a6a5pe25Zmo44CCPGJyLz5cbiAgICAgKiByZXBlYXQg5YC85Y+v5Lul6K6p5a6a5pe25Zmo6Kem5Y+RIHJlcGVhdCArIDEg5qyh77yM5L2/55SoIGNjLm1hY3JvLlJFUEVBVF9GT1JFVkVSXG4gICAgICog5Y+v5Lul6K6p5a6a5pe25Zmo5LiA55u05b6q546v6Kem5Y+R44CCPGJyLz5cbiAgICAgKiBkZWxheSDlgLzmjIflrprlu7bov5/ml7bpl7TvvIzlrprml7blmajkvJrlnKjlu7bov5/mjIflrprnmoTml7bpl7TkuYvlkI7lvIDlp4vorqHml7bjgIJcbiAgICAgKiBAbWV0aG9kIHNjaGVkdWxlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGludGVydmFsXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtyZXBlYXQ9Y2MubWFjcm8uUkVQRUFUX0ZPUkVWRVJdXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtkZWxheT0wXVxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gcGF1c2VkXG4gICAgICogQGV4YW1wbGUge0BsaW5rIGNvY29zMmQvY29yZS9DQ1NjaGVkdWxlci9zY2hlZHVsZS5qc31cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHNjaGVkdWxlKGNhbGxiYWNrOiBGdW5jdGlvbiwgdGFyZ2V0OiBhbnksIGludGVydmFsOiBudW1iZXIsIHJlcGVhdDogbnVtYmVyLCBkZWxheTogbnVtYmVyLCBwYXVzZWQ/OiBib29sZWFuKTogdm9pZFxuICAgICAqIHNjaGVkdWxlKGNhbGxiYWNrOiBGdW5jdGlvbiwgdGFyZ2V0OiBhbnksIGludGVydmFsOiBudW1iZXIsIHBhdXNlZD86IGJvb2xlYW4pOiB2b2lkXG4gICAgICovXG4gICAgc2NoZWR1bGU6IGZ1bmN0aW9uIChjYWxsYmFjaywgdGFyZ2V0LCBpbnRlcnZhbCwgcmVwZWF0LCBkZWxheSwgcGF1c2VkKSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdmFyIHRtcCA9IGNhbGxiYWNrO1xuICAgICAgICAgICAgY2FsbGJhY2sgPSB0YXJnZXQ7XG4gICAgICAgICAgICB0YXJnZXQgPSB0bXA7XG4gICAgICAgIH1cbiAgICAgICAgLy9zZWxlY3RvciwgdGFyZ2V0LCBpbnRlcnZhbCwgcmVwZWF0LCBkZWxheSwgcGF1c2VkXG4gICAgICAgIC8vc2VsZWN0b3IsIHRhcmdldCwgaW50ZXJ2YWwsIHBhdXNlZFxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gNCB8fCBhcmd1bWVudHMubGVuZ3RoID09PSA1KSB7XG4gICAgICAgICAgICBwYXVzZWQgPSAhIXJlcGVhdDtcbiAgICAgICAgICAgIHJlcGVhdCA9IGNjLm1hY3JvLlJFUEVBVF9GT1JFVkVSO1xuICAgICAgICAgICAgZGVsYXkgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgY2MuYXNzZXJ0SUQodGFyZ2V0LCAxNTAyKTtcblxuICAgICAgICB2YXIgdGFyZ2V0SWQgPSB0YXJnZXQuX2lkO1xuICAgICAgICBpZiAoIXRhcmdldElkKSB7XG4gICAgICAgICAgICBpZiAodGFyZ2V0Ll9faW5zdGFuY2VJZCkge1xuICAgICAgICAgICAgICAgIGNjLndhcm5JRCgxNTEzKTtcbiAgICAgICAgICAgICAgICB0YXJnZXRJZCA9IHRhcmdldC5faWQgPSB0YXJnZXQuX19pbnN0YW5jZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgxNTEwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMuX2hhc2hGb3JUaW1lcnNbdGFyZ2V0SWRdO1xuICAgICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgICAgIC8vIElzIHRoaXMgdGhlIDFzdCBlbGVtZW50ID8gVGhlbiBzZXQgdGhlIHBhdXNlIGxldmVsIHRvIGFsbCB0aGUgY2FsbGJhY2tfZm5zIG9mIHRoaXMgdGFyZ2V0XG4gICAgICAgICAgICBlbGVtZW50ID0gSGFzaFRpbWVyRW50cnkuZ2V0KG51bGwsIHRhcmdldCwgMCwgbnVsbCwgbnVsbCwgcGF1c2VkKTtcbiAgICAgICAgICAgIHRoaXMuX2FycmF5Rm9yVGltZXJzLnB1c2goZWxlbWVudCk7XG4gICAgICAgICAgICB0aGlzLl9oYXNoRm9yVGltZXJzW3RhcmdldElkXSA9IGVsZW1lbnQ7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5wYXVzZWQgIT09IHBhdXNlZCkge1xuICAgICAgICAgICAgY2Mud2FybklEKDE1MTEpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRpbWVyLCBpO1xuICAgICAgICBpZiAoZWxlbWVudC50aW1lcnMgPT0gbnVsbCkge1xuICAgICAgICAgICAgZWxlbWVudC50aW1lcnMgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBlbGVtZW50LnRpbWVycy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIHRpbWVyID0gZWxlbWVudC50aW1lcnNbaV07XG4gICAgICAgICAgICAgICAgaWYgKHRpbWVyICYmIGNhbGxiYWNrID09PSB0aW1lci5fY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgY2MubG9nSUQoMTUwNywgdGltZXIuZ2V0SW50ZXJ2YWwoKSwgaW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICB0aW1lci5faW50ZXJ2YWwgPSBpbnRlcnZhbDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRpbWVyID0gQ2FsbGJhY2tUaW1lci5nZXQoKTtcbiAgICAgICAgdGltZXIuaW5pdFdpdGhDYWxsYmFjayh0aGlzLCBjYWxsYmFjaywgdGFyZ2V0LCBpbnRlcnZhbCwgcmVwZWF0LCBkZWxheSk7XG4gICAgICAgIGVsZW1lbnQudGltZXJzLnB1c2godGltZXIpO1xuXG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50VGFyZ2V0ID09PSBlbGVtZW50ICYmIHRoaXMuX2N1cnJlbnRUYXJnZXRTYWx2YWdlZCkge1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudFRhcmdldFNhbHZhZ2VkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNjaGVkdWxlcyB0aGUgdXBkYXRlIGNhbGxiYWNrIGZvciBhIGdpdmVuIHRhcmdldCxcbiAgICAgKiBEdXJpbmcgZXZlcnkgZnJhbWUgYWZ0ZXIgc2NoZWR1bGUgc3RhcnRlZCwgdGhlIFwidXBkYXRlXCIgZnVuY3Rpb24gb2YgdGFyZ2V0IHdpbGwgYmUgaW52b2tlZC5cbiAgICAgKiAhI3poXG4gICAgICog5L2/55So5oyH5a6a55qE5LyY5YWI57qn5Li65oyH5a6a55qE5a+56LGh6K6+572uIHVwZGF0ZSDlrprml7blmajjgIJcbiAgICAgKiB1cGRhdGUg5a6a5pe25Zmo5q+P5LiA5bin6YO95Lya6KKr6Kem5Y+R77yM6Kem5Y+R5pe26Ieq5Yqo6LCD55So5oyH5a6a5a+56LGh55qEIFwidXBkYXRlXCIg5Ye95pWw44CCXG4gICAgICog5LyY5YWI57qn55qE5YC86LaK5L2O77yM5a6a5pe25Zmo6KKr6Kem5Y+R55qE6LaK5pep44CCXG4gICAgICogQG1ldGhvZCBzY2hlZHVsZVVwZGF0ZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcHJpb3JpdHlcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHBhdXNlZFxuICAgICAqL1xuICAgIHNjaGVkdWxlVXBkYXRlOiBmdW5jdGlvbih0YXJnZXQsIHByaW9yaXR5LCBwYXVzZWQpIHtcbiAgICAgICAgdmFyIHRhcmdldElkID0gdGFyZ2V0Ll9pZDtcbiAgICAgICAgaWYgKCF0YXJnZXRJZCkge1xuICAgICAgICAgICAgaWYgKHRhcmdldC5fX2luc3RhbmNlSWQpIHtcbiAgICAgICAgICAgICAgICBjYy53YXJuSUQoMTUxMyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0SWQgPSB0YXJnZXQuX2lkID0gdGFyZ2V0Ll9faW5zdGFuY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoMTUxMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGhhc2hFbGVtZW50ID0gdGhpcy5faGFzaEZvclVwZGF0ZXNbdGFyZ2V0SWRdO1xuICAgICAgICBpZiAoaGFzaEVsZW1lbnQgJiYgaGFzaEVsZW1lbnQuZW50cnkpe1xuICAgICAgICAgICAgLy8gY2hlY2sgaWYgcHJpb3JpdHkgaGFzIGNoYW5nZWRcbiAgICAgICAgICAgIGlmIChoYXNoRWxlbWVudC5lbnRyeS5wcmlvcml0eSAhPT0gcHJpb3JpdHkpe1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl91cGRhdGVIYXNoTG9ja2VkKXtcbiAgICAgICAgICAgICAgICAgICAgY2MubG9nSUQoMTUwNik7XG4gICAgICAgICAgICAgICAgICAgIGhhc2hFbGVtZW50LmVudHJ5Lm1hcmtlZEZvckRlbGV0aW9uID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGhhc2hFbGVtZW50LmVudHJ5LnBhdXNlZCA9IHBhdXNlZDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAvLyB3aWxsIGJlIGFkZGVkIGFnYWluIG91dHNpZGUgaWYgKGhhc2hFbGVtZW50KS5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy51bnNjaGVkdWxlVXBkYXRlKHRhcmdldCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgaGFzaEVsZW1lbnQuZW50cnkubWFya2VkRm9yRGVsZXRpb24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBoYXNoRWxlbWVudC5lbnRyeS5wYXVzZWQgPSBwYXVzZWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxpc3RFbGVtZW50ID0gTGlzdEVudHJ5LmdldCh0YXJnZXQsIHByaW9yaXR5LCBwYXVzZWQsIGZhbHNlKTtcbiAgICAgICAgdmFyIHBwTGlzdDtcblxuICAgICAgICAvLyBtb3N0IG9mIHRoZSB1cGRhdGVzIGFyZSBnb2luZyB0byBiZSAwLCB0aGF0J3Mgd2F5IHRoZXJlXG4gICAgICAgIC8vIGlzIGFuIHNwZWNpYWwgbGlzdCBmb3IgdXBkYXRlcyB3aXRoIHByaW9yaXR5IDBcbiAgICAgICAgaWYgKHByaW9yaXR5ID09PSAwKSB7XG4gICAgICAgICAgICBwcExpc3QgPSB0aGlzLl91cGRhdGVzMExpc3Q7XG4gICAgICAgICAgICB0aGlzLl9hcHBlbmRJbihwcExpc3QsIGxpc3RFbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHBwTGlzdCA9IHByaW9yaXR5IDwgMCA/IHRoaXMuX3VwZGF0ZXNOZWdMaXN0IDogdGhpcy5fdXBkYXRlc1Bvc0xpc3Q7XG4gICAgICAgICAgICB0aGlzLl9wcmlvcml0eUluKHBwTGlzdCwgbGlzdEVsZW1lbnQsIHByaW9yaXR5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vdXBkYXRlIGhhc2ggZW50cnkgZm9yIHF1aWNrIGFjY2Vzc1xuICAgICAgICB0aGlzLl9oYXNoRm9yVXBkYXRlc1t0YXJnZXRJZF0gPSBIYXNoVXBkYXRlRW50cnkuZ2V0KHBwTGlzdCwgbGlzdEVsZW1lbnQsIHRhcmdldCwgbnVsbCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBVbnNjaGVkdWxlcyBhIGNhbGxiYWNrIGZvciBhIGNhbGxiYWNrIGFuZCBhIGdpdmVuIHRhcmdldC5cbiAgICAgKiBJZiB5b3Ugd2FudCB0byB1bnNjaGVkdWxlIHRoZSBcInVwZGF0ZVwiLCB1c2UgYHVuc2NoZWR1bGVVcGRhdGUoKWBcbiAgICAgKiAhI3poXG4gICAgICog5Y+W5raI5oyH5a6a5a+56LGh5a6a5pe25Zmo44CCXG4gICAgICog5aaC5p6c6ZyA6KaB5Y+W5raIIHVwZGF0ZSDlrprml7blmajvvIzor7fkvb/nlKggdW5zY2hlZHVsZVVwZGF0ZSgp44CCXG4gICAgICogQG1ldGhvZCB1bnNjaGVkdWxlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIHRvIGJlIHVuc2NoZWR1bGVkXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCBUaGUgdGFyZ2V0IGJvdW5kIHRvIHRoZSBjYWxsYmFjay5cbiAgICAgKi9cbiAgICB1bnNjaGVkdWxlOiBmdW5jdGlvbiAoY2FsbGJhY2ssIHRhcmdldCkge1xuICAgICAgICAvL2NhbGxiYWNrLCB0YXJnZXRcblxuICAgICAgICAvLyBleHBsaWNpdHkgaGFuZGxlIG5pbCBhcmd1bWVudHMgd2hlbiByZW1vdmluZyBhbiBvYmplY3RcbiAgICAgICAgaWYgKCF0YXJnZXQgfHwgIWNhbGxiYWNrKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB2YXIgdGFyZ2V0SWQgPSB0YXJnZXQuX2lkO1xuICAgICAgICBpZiAoIXRhcmdldElkKSB7XG4gICAgICAgICAgICBpZiAodGFyZ2V0Ll9faW5zdGFuY2VJZCkge1xuICAgICAgICAgICAgICAgIGNjLndhcm5JRCgxNTEzKTtcbiAgICAgICAgICAgICAgICB0YXJnZXRJZCA9IHRhcmdldC5faWQgPSB0YXJnZXQuX19pbnN0YW5jZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgxNTEwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcywgZWxlbWVudCA9IHNlbGYuX2hhc2hGb3JUaW1lcnNbdGFyZ2V0SWRdO1xuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgdmFyIHRpbWVycyA9IGVsZW1lbnQudGltZXJzO1xuICAgICAgICAgICAgZm9yKHZhciBpID0gMCwgbGkgPSB0aW1lcnMubGVuZ3RoOyBpIDwgbGk7IGkrKyl7XG4gICAgICAgICAgICAgICAgdmFyIHRpbWVyID0gdGltZXJzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjayA9PT0gdGltZXIuX2NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgodGltZXIgPT09IGVsZW1lbnQuY3VycmVudFRpbWVyKSAmJiAoIWVsZW1lbnQuY3VycmVudFRpbWVyU2FsdmFnZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmN1cnJlbnRUaW1lclNhbHZhZ2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aW1lcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICBDYWxsYmFja1RpbWVyLnB1dCh0aW1lcik7XG4gICAgICAgICAgICAgICAgICAgIC8vdXBkYXRlIHRpbWVySW5kZXggaW4gY2FzZSB3ZSBhcmUgaW4gdGljazssIGxvb3Bpbmcgb3ZlciB0aGUgYWN0aW9uc1xuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC50aW1lckluZGV4ID49IGkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudGltZXJJbmRleC0tO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRpbWVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLl9jdXJyZW50VGFyZ2V0ID09PSBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5fY3VycmVudFRhcmdldFNhbHZhZ2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5fcmVtb3ZlSGFzaEVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKiogXG4gICAgICogISNlbiBVbnNjaGVkdWxlcyB0aGUgdXBkYXRlIGNhbGxiYWNrIGZvciBhIGdpdmVuIHRhcmdldC5cbiAgICAgKiAhI3poIOWPlua2iOaMh+WumuWvueixoeeahCB1cGRhdGUg5a6a5pe25Zmo44CCXG4gICAgICogQG1ldGhvZCB1bnNjaGVkdWxlVXBkYXRlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCBUaGUgdGFyZ2V0IHRvIGJlIHVuc2NoZWR1bGVkLlxuICAgICAqL1xuICAgIHVuc2NoZWR1bGVVcGRhdGU6IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgaWYgKCF0YXJnZXQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciB0YXJnZXRJZCA9IHRhcmdldC5faWQ7XG4gICAgICAgIGlmICghdGFyZ2V0SWQpIHtcbiAgICAgICAgICAgIGlmICh0YXJnZXQuX19pbnN0YW5jZUlkKSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybklEKDE1MTMpO1xuICAgICAgICAgICAgICAgIHRhcmdldElkID0gdGFyZ2V0Ll9pZCA9IHRhcmdldC5fX2luc3RhbmNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDE1MTApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzLl9oYXNoRm9yVXBkYXRlc1t0YXJnZXRJZF07XG4gICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fdXBkYXRlSGFzaExvY2tlZCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuZW50cnkubWFya2VkRm9yRGVsZXRpb24gPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVVcGRhdGVGcm9tSGFzaChlbGVtZW50LmVudHJ5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKiogXG4gICAgICogISNlblxuICAgICAqIFVuc2NoZWR1bGVzIGFsbCBzY2hlZHVsZWQgY2FsbGJhY2tzIGZvciBhIGdpdmVuIHRhcmdldC5cbiAgICAgKiBUaGlzIGFsc28gaW5jbHVkZXMgdGhlIFwidXBkYXRlXCIgY2FsbGJhY2suXG4gICAgICogISN6aCDlj5bmtojmjIflrprlr7nosaHnmoTmiYDmnInlrprml7blmajvvIzljIXmi6wgdXBkYXRlIOWumuaXtuWZqOOAglxuICAgICAqIEBtZXRob2QgdW5zY2hlZHVsZUFsbEZvclRhcmdldFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXQgVGhlIHRhcmdldCB0byBiZSB1bnNjaGVkdWxlZC5cbiAgICAgKi9cbiAgICB1bnNjaGVkdWxlQWxsRm9yVGFyZ2V0OiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIC8vIGV4cGxpY2l0IG51bGxwdHIgaGFuZGxpbmdcbiAgICAgICAgaWYgKCF0YXJnZXQpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0YXJnZXRJZCA9IHRhcmdldC5faWQ7XG4gICAgICAgIGlmICghdGFyZ2V0SWQpIHtcbiAgICAgICAgICAgIGlmICh0YXJnZXQuX19pbnN0YW5jZUlkKSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybklEKDE1MTMpO1xuICAgICAgICAgICAgICAgIHRhcmdldElkID0gdGFyZ2V0Ll9pZCA9IHRhcmdldC5fX2luc3RhbmNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDE1MTApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ3VzdG9tIFNlbGVjdG9yc1xuICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMuX2hhc2hGb3JUaW1lcnNbdGFyZ2V0SWRdO1xuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgdmFyIHRpbWVycyA9IGVsZW1lbnQudGltZXJzO1xuICAgICAgICAgICAgaWYgKHRpbWVycy5pbmRleE9mKGVsZW1lbnQuY3VycmVudFRpbWVyKSA+IC0xICYmIFxuICAgICAgICAgICAgICAgICghZWxlbWVudC5jdXJyZW50VGltZXJTYWx2YWdlZCkpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmN1cnJlbnRUaW1lclNhbHZhZ2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGltZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIENhbGxiYWNrVGltZXIucHV0KHRpbWVyc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aW1lcnMubGVuZ3RoID0gMDtcblxuICAgICAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRUYXJnZXQgPT09IGVsZW1lbnQpe1xuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRUYXJnZXRTYWx2YWdlZCA9IHRydWU7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVIYXNoRWxlbWVudChlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVwZGF0ZSBzZWxlY3RvclxuICAgICAgICB0aGlzLnVuc2NoZWR1bGVVcGRhdGUodGFyZ2V0KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFVuc2NoZWR1bGVzIGFsbCBzY2hlZHVsZWQgY2FsbGJhY2tzIGZyb20gYWxsIHRhcmdldHMgaW5jbHVkaW5nIHRoZSBzeXN0ZW0gY2FsbGJhY2tzLjxici8+XG4gICAgICogWW91IHNob3VsZCBORVZFUiBjYWxsIHRoaXMgbWV0aG9kLCB1bmxlc3MgeW91IGtub3cgd2hhdCB5b3UgYXJlIGRvaW5nLlxuICAgICAqICEjemhcbiAgICAgKiDlj5bmtojmiYDmnInlr7nosaHnmoTmiYDmnInlrprml7blmajvvIzljIXmi6zns7vnu5/lrprml7blmajjgII8YnIvPlxuICAgICAqIOS4jeeUqOiwg+eUqOatpOWHveaVsO+8jOmZpOmdnuS9oOehruWumuS9oOWcqOWBmuS7gOS5iOOAglxuICAgICAqIEBtZXRob2QgdW5zY2hlZHVsZUFsbFxuICAgICAqL1xuICAgIHVuc2NoZWR1bGVBbGw6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMudW5zY2hlZHVsZUFsbFdpdGhNaW5Qcmlvcml0eShjYy5TY2hlZHVsZXIuUFJJT1JJVFlfU1lTVEVNKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFVuc2NoZWR1bGVzIGFsbCBjYWxsYmFja3MgZnJvbSBhbGwgdGFyZ2V0cyB3aXRoIGEgbWluaW11bSBwcmlvcml0eS48YnIvPlxuICAgICAqIFlvdSBzaG91bGQgb25seSBjYWxsIHRoaXMgd2l0aCBgUFJJT1JJVFlfTk9OX1NZU1RFTV9NSU5gIG9yIGhpZ2hlci5cbiAgICAgKiAhI3poXG4gICAgICog5Y+W5raI5omA5pyJ5LyY5YWI57qn55qE5YC85aSn5LqO5oyH5a6a5LyY5YWI57qn55qE5a6a5pe25Zmo44CCPGJyLz5cbiAgICAgKiDkvaDlupTor6Xlj6rlj5bmtojkvJjlhYjnuqfnmoTlgLzlpKfkuo4gUFJJT1JJVFlfTk9OX1NZU1RFTV9NSU4g55qE5a6a5pe25Zmo44CCXG4gICAgICogQG1ldGhvZCB1bnNjaGVkdWxlQWxsV2l0aE1pblByaW9yaXR5XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG1pblByaW9yaXR5IFRoZSBtaW5pbXVtIHByaW9yaXR5IG9mIHNlbGVjdG9yIHRvIGJlIHVuc2NoZWR1bGVkLiBXaGljaCBtZWFucywgYWxsIHNlbGVjdG9ycyB3aGljaFxuICAgICAqICAgICAgICBwcmlvcml0eSBpcyBoaWdoZXIgdGhhbiBtaW5Qcmlvcml0eSB3aWxsIGJlIHVuc2NoZWR1bGVkLlxuICAgICAqL1xuICAgIHVuc2NoZWR1bGVBbGxXaXRoTWluUHJpb3JpdHk6IGZ1bmN0aW9uKG1pblByaW9yaXR5KXtcbiAgICAgICAgLy8gQ3VzdG9tIFNlbGVjdG9yc1xuICAgICAgICB2YXIgaSwgZWxlbWVudCwgYXJyID0gdGhpcy5fYXJyYXlGb3JUaW1lcnM7XG4gICAgICAgIGZvcihpPWFyci5sZW5ndGgtMTsgaT49MDsgaS0tKXtcbiAgICAgICAgICAgIGVsZW1lbnQgPSBhcnJbaV07XG4gICAgICAgICAgICB0aGlzLnVuc2NoZWR1bGVBbGxGb3JUYXJnZXQoZWxlbWVudC50YXJnZXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVXBkYXRlcyBzZWxlY3RvcnNcbiAgICAgICAgdmFyIGVudHJ5O1xuICAgICAgICB2YXIgdGVtcF9sZW5ndGggPSAwO1xuICAgICAgICBpZihtaW5Qcmlvcml0eSA8IDApe1xuICAgICAgICAgICAgZm9yKGk9MDsgaTx0aGlzLl91cGRhdGVzTmVnTGlzdC5sZW5ndGg7ICl7XG4gICAgICAgICAgICAgICAgdGVtcF9sZW5ndGggPSB0aGlzLl91cGRhdGVzTmVnTGlzdC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgZW50cnkgPSB0aGlzLl91cGRhdGVzTmVnTGlzdFtpXTtcbiAgICAgICAgICAgICAgICBpZihlbnRyeSAmJiBlbnRyeS5wcmlvcml0eSA+PSBtaW5Qcmlvcml0eSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51bnNjaGVkdWxlVXBkYXRlKGVudHJ5LnRhcmdldCk7XG4gICAgICAgICAgICAgICAgaWYgKHRlbXBfbGVuZ3RoID09IHRoaXMuX3VwZGF0ZXNOZWdMaXN0Lmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYobWluUHJpb3JpdHkgPD0gMCl7XG4gICAgICAgICAgICBmb3IoaT0wOyBpPHRoaXMuX3VwZGF0ZXMwTGlzdC5sZW5ndGg7ICl7XG4gICAgICAgICAgICAgICAgdGVtcF9sZW5ndGggPSB0aGlzLl91cGRhdGVzMExpc3QubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGVudHJ5ID0gdGhpcy5fdXBkYXRlczBMaXN0W2ldO1xuICAgICAgICAgICAgICAgIGlmIChlbnRyeSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51bnNjaGVkdWxlVXBkYXRlKGVudHJ5LnRhcmdldCk7XG4gICAgICAgICAgICAgICAgaWYgKHRlbXBfbGVuZ3RoID09IHRoaXMuX3VwZGF0ZXMwTGlzdC5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvcihpPTA7IGk8dGhpcy5fdXBkYXRlc1Bvc0xpc3QubGVuZ3RoOyApe1xuICAgICAgICAgICAgdGVtcF9sZW5ndGggPSB0aGlzLl91cGRhdGVzUG9zTGlzdC5sZW5ndGg7XG4gICAgICAgICAgICBlbnRyeSA9IHRoaXMuX3VwZGF0ZXNQb3NMaXN0W2ldO1xuICAgICAgICAgICAgaWYoZW50cnkgJiYgZW50cnkucHJpb3JpdHkgPj0gbWluUHJpb3JpdHkpXG4gICAgICAgICAgICAgICAgdGhpcy51bnNjaGVkdWxlVXBkYXRlKGVudHJ5LnRhcmdldCk7XG4gICAgICAgICAgICBpZiAodGVtcF9sZW5ndGggPT0gdGhpcy5fdXBkYXRlc1Bvc0xpc3QubGVuZ3RoKVxuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKiogXG4gICAgICogISNlbiBDaGVja3Mgd2hldGhlciBhIGNhbGxiYWNrIGZvciBhIGdpdmVuIHRhcmdldCBpcyBzY2hlZHVsZWQuXG4gICAgICogISN6aCDmo4Dmn6XmjIflrprnmoTlm57osIPlh73mlbDlkozlm57osIPlr7nosaHnu4TlkIjmmK/lkKblrZjlnKjlrprml7blmajjgIJcbiAgICAgKiBAbWV0aG9kIGlzU2NoZWR1bGVkXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIHRvIGNoZWNrLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXQgVGhlIHRhcmdldCBvZiB0aGUgY2FsbGJhY2suXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIGNhbGxiYWNrIGlzIGludm9rZWQsIGZhbHNlIGlmIG5vdC5cbiAgICAgKi9cbiAgICBpc1NjaGVkdWxlZDogZnVuY3Rpb24oY2FsbGJhY2ssIHRhcmdldCl7XG4gICAgICAgIC8va2V5LCB0YXJnZXRcbiAgICAgICAgLy9zZWxlY3RvciwgdGFyZ2V0XG4gICAgICAgIGNjLmFzc2VydElEKGNhbGxiYWNrLCAxNTA4KTtcbiAgICAgICAgY2MuYXNzZXJ0SUQodGFyZ2V0LCAxNTA5KTtcbiAgICAgICAgdmFyIHRhcmdldElkID0gdGFyZ2V0Ll9pZDtcbiAgICAgICAgaWYgKCF0YXJnZXRJZCkge1xuICAgICAgICAgICAgaWYgKHRhcmdldC5fX2luc3RhbmNlSWQpIHtcbiAgICAgICAgICAgICAgICBjYy53YXJuSUQoMTUxMyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0SWQgPSB0YXJnZXQuX2lkID0gdGFyZ2V0Ll9faW5zdGFuY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoMTUxMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHZhciBlbGVtZW50ID0gdGhpcy5faGFzaEZvclRpbWVyc1t0YXJnZXRJZF07XG5cbiAgICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZWxlbWVudC50aW1lcnMgPT0gbnVsbCl7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgdGltZXJzID0gZWxlbWVudC50aW1lcnM7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRpbWVycy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIHZhciB0aW1lciA9ICB0aW1lcnNbaV07XG5cbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2sgPT09IHRpbWVyLl9jYWxsYmFjayl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUGF1c2UgYWxsIHNlbGVjdG9ycyBmcm9tIGFsbCB0YXJnZXRzLjxici8+XG4gICAgICogWW91IHNob3VsZCBORVZFUiBjYWxsIHRoaXMgbWV0aG9kLCB1bmxlc3MgeW91IGtub3cgd2hhdCB5b3UgYXJlIGRvaW5nLlxuICAgICAqICEjemhcbiAgICAgKiDmmoLlgZzmiYDmnInlr7nosaHnmoTmiYDmnInlrprml7blmajjgII8YnIvPlxuICAgICAqIOS4jeimgeiwg+eUqOi/meS4quaWueazle+8jOmZpOmdnuS9oOefpemBk+S9oOato+WcqOWBmuS7gOS5iOOAglxuICAgICAqIEBtZXRob2QgcGF1c2VBbGxUYXJnZXRzXG4gICAgICovXG4gICAgcGF1c2VBbGxUYXJnZXRzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhdXNlQWxsVGFyZ2V0c1dpdGhNaW5Qcmlvcml0eShjYy5TY2hlZHVsZXIuUFJJT1JJVFlfU1lTVEVNKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFBhdXNlIGFsbCBzZWxlY3RvcnMgZnJvbSBhbGwgdGFyZ2V0cyB3aXRoIGEgbWluaW11bSBwcmlvcml0eS4gPGJyLz5cbiAgICAgKiBZb3Ugc2hvdWxkIG9ubHkgY2FsbCB0aGlzIHdpdGgga0NDUHJpb3JpdHlOb25TeXN0ZW1NaW4gb3IgaGlnaGVyLlxuICAgICAqICEjemhcbiAgICAgKiDmmoLlgZzmiYDmnInkvJjlhYjnuqfnmoTlgLzlpKfkuo7mjIflrprkvJjlhYjnuqfnmoTlrprml7blmajjgII8YnIvPlxuICAgICAqIOS9oOW6lOivpeWPquaaguWBnOS8mOWFiOe6p+eahOWAvOWkp+S6jiBQUklPUklUWV9OT05fU1lTVEVNX01JTiDnmoTlrprml7blmajjgIJcbiAgICAgKiBAbWV0aG9kIHBhdXNlQWxsVGFyZ2V0c1dpdGhNaW5Qcmlvcml0eVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBtaW5Qcmlvcml0eVxuICAgICAqL1xuICAgIHBhdXNlQWxsVGFyZ2V0c1dpdGhNaW5Qcmlvcml0eTogZnVuY3Rpb24gKG1pblByaW9yaXR5KSB7XG4gICAgICAgIHZhciBpZHNXaXRoU2VsZWN0b3JzID0gW107XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzLCBlbGVtZW50LCBsb2NBcnJheUZvclRpbWVycyA9IHNlbGYuX2FycmF5Rm9yVGltZXJzO1xuICAgICAgICB2YXIgaSwgbGk7XG4gICAgICAgIC8vIEN1c3RvbSBTZWxlY3RvcnNcbiAgICAgICAgZm9yKGkgPSAwLCBsaSA9IGxvY0FycmF5Rm9yVGltZXJzLmxlbmd0aDsgaSA8IGxpOyBpKyspe1xuICAgICAgICAgICAgZWxlbWVudCA9IGxvY0FycmF5Rm9yVGltZXJzW2ldO1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnBhdXNlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWRzV2l0aFNlbGVjdG9ycy5wdXNoKGVsZW1lbnQudGFyZ2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBlbnRyeTtcbiAgICAgICAgaWYobWluUHJpb3JpdHkgPCAwKXtcbiAgICAgICAgICAgIGZvcihpPTA7IGk8dGhpcy5fdXBkYXRlc05lZ0xpc3QubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIGVudHJ5ID0gdGhpcy5fdXBkYXRlc05lZ0xpc3RbaV07XG4gICAgICAgICAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGVudHJ5LnByaW9yaXR5ID49IG1pblByaW9yaXR5KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudHJ5LnBhdXNlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZHNXaXRoU2VsZWN0b3JzLnB1c2goZW50cnkudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmKG1pblByaW9yaXR5IDw9IDApe1xuICAgICAgICAgICAgZm9yKGk9MDsgaTx0aGlzLl91cGRhdGVzMExpc3QubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIGVudHJ5ID0gdGhpcy5fdXBkYXRlczBMaXN0W2ldO1xuICAgICAgICAgICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgICAgICAgICAgICBlbnRyeS5wYXVzZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpZHNXaXRoU2VsZWN0b3JzLnB1c2goZW50cnkudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IoaT0wOyBpPHRoaXMuX3VwZGF0ZXNQb3NMaXN0Lmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIGVudHJ5ID0gdGhpcy5fdXBkYXRlc1Bvc0xpc3RbaV07XG4gICAgICAgICAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgICAgICAgICBpZihlbnRyeS5wcmlvcml0eSA+PSBtaW5Qcmlvcml0eSl7XG4gICAgICAgICAgICAgICAgICAgIGVudHJ5LnBhdXNlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlkc1dpdGhTZWxlY3RvcnMucHVzaChlbnRyeS50YXJnZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpZHNXaXRoU2VsZWN0b3JzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmVzdW1lIHNlbGVjdG9ycyBvbiBhIHNldCBvZiB0YXJnZXRzLjxici8+XG4gICAgICogVGhpcyBjYW4gYmUgdXNlZnVsIGZvciB1bmRvaW5nIGEgY2FsbCB0byBwYXVzZUFsbENhbGxiYWNrcy5cbiAgICAgKiAhI3poXG4gICAgICog5oGi5aSN5oyH5a6a5pWw57uE5Lit5omA5pyJ5a+56LGh55qE5a6a5pe25Zmo44CCPGJyLz5cbiAgICAgKiDov5nkuKrlh73mlbDmmK8gcGF1c2VBbGxDYWxsYmFja3Mg55qE6YCG5pON5L2c44CCXG4gICAgICogQG1ldGhvZCByZXN1bWVUYXJnZXRzXG4gICAgICogQHBhcmFtIHtBcnJheX0gdGFyZ2V0c1RvUmVzdW1lXG4gICAgICovXG4gICAgcmVzdW1lVGFyZ2V0czogZnVuY3Rpb24gKHRhcmdldHNUb1Jlc3VtZSkge1xuICAgICAgICBpZiAoIXRhcmdldHNUb1Jlc3VtZSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhcmdldHNUb1Jlc3VtZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5yZXN1bWVUYXJnZXQodGFyZ2V0c1RvUmVzdW1lW2ldKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUGF1c2VzIHRoZSB0YXJnZXQuPGJyLz5cbiAgICAgKiBBbGwgc2NoZWR1bGVkIHNlbGVjdG9ycy91cGRhdGUgZm9yIGEgZ2l2ZW4gdGFyZ2V0IHdvbid0IGJlICd0aWNrZWQnIHVudGlsIHRoZSB0YXJnZXQgaXMgcmVzdW1lZC48YnIvPlxuICAgICAqIElmIHRoZSB0YXJnZXQgaXMgbm90IHByZXNlbnQsIG5vdGhpbmcgaGFwcGVucy5cbiAgICAgKiAhI3poXG4gICAgICog5pqC5YGc5oyH5a6a5a+56LGh55qE5a6a5pe25Zmo44CCPGJyLz5cbiAgICAgKiDmjIflrprlr7nosaHnmoTmiYDmnInlrprml7blmajpg73kvJrooqvmmoLlgZzjgII8YnIvPlxuICAgICAqIOWmguaenOaMh+WumueahOWvueixoeayoeacieWumuaXtuWZqO+8jOS7gOS5iOS5n+S4jeS8muWPkeeUn+OAglxuICAgICAqIEBtZXRob2QgcGF1c2VUYXJnZXRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0XG4gICAgICovXG4gICAgcGF1c2VUYXJnZXQ6IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgY2MuYXNzZXJ0SUQodGFyZ2V0LCAxNTAzKTtcbiAgICAgICAgdmFyIHRhcmdldElkID0gdGFyZ2V0Ll9pZDtcbiAgICAgICAgaWYgKCF0YXJnZXRJZCkge1xuICAgICAgICAgICAgaWYgKHRhcmdldC5fX2luc3RhbmNlSWQpIHtcbiAgICAgICAgICAgICAgICBjYy53YXJuSUQoMTUxMyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0SWQgPSB0YXJnZXQuX2lkID0gdGFyZ2V0Ll9faW5zdGFuY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoMTUxMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL2N1c3RvbWVyIHNlbGVjdG9yc1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXMsIFxuICAgICAgICAgICAgZWxlbWVudCA9IHNlbGYuX2hhc2hGb3JUaW1lcnNbdGFyZ2V0SWRdO1xuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgZWxlbWVudC5wYXVzZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy91cGRhdGUgY2FsbGJhY2tcbiAgICAgICAgdmFyIGVsZW1lbnRVcGRhdGUgPSBzZWxmLl9oYXNoRm9yVXBkYXRlc1t0YXJnZXRJZF07XG4gICAgICAgIGlmIChlbGVtZW50VXBkYXRlKSB7XG4gICAgICAgICAgICBlbGVtZW50VXBkYXRlLmVudHJ5LnBhdXNlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJlc3VtZXMgdGhlIHRhcmdldC48YnIvPlxuICAgICAqIFRoZSAndGFyZ2V0JyB3aWxsIGJlIHVucGF1c2VkLCBzbyBhbGwgc2NoZWR1bGUgc2VsZWN0b3JzL3VwZGF0ZSB3aWxsIGJlICd0aWNrZWQnIGFnYWluLjxici8+XG4gICAgICogSWYgdGhlIHRhcmdldCBpcyBub3QgcHJlc2VudCwgbm90aGluZyBoYXBwZW5zLlxuICAgICAqICEjemhcbiAgICAgKiDmgaLlpI3mjIflrprlr7nosaHnmoTmiYDmnInlrprml7blmajjgII8YnIvPlxuICAgICAqIOaMh+WumuWvueixoeeahOaJgOacieWumuaXtuWZqOWwhue7p+e7reW3peS9nOOAgjxici8+XG4gICAgICog5aaC5p6c5oyH5a6a55qE5a+56LGh5rKh5pyJ5a6a5pe25Zmo77yM5LuA5LmI5Lmf5LiN5Lya5Y+R55Sf44CCXG4gICAgICogQG1ldGhvZCByZXN1bWVUYXJnZXRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0XG4gICAgICovXG4gICAgcmVzdW1lVGFyZ2V0OiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIGNjLmFzc2VydElEKHRhcmdldCwgMTUwNCk7XG4gICAgICAgIHZhciB0YXJnZXRJZCA9IHRhcmdldC5faWQ7XG4gICAgICAgIGlmICghdGFyZ2V0SWQpIHtcbiAgICAgICAgICAgIGlmICh0YXJnZXQuX19pbnN0YW5jZUlkKSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybklEKDE1MTMpO1xuICAgICAgICAgICAgICAgIHRhcmdldElkID0gdGFyZ2V0Ll9pZCA9IHRhcmdldC5fX2luc3RhbmNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDE1MTApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gY3VzdG9tIHNlbGVjdG9yc1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICBlbGVtZW50ID0gc2VsZi5faGFzaEZvclRpbWVyc1t0YXJnZXRJZF07XG4gICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgICBlbGVtZW50LnBhdXNlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy91cGRhdGUgY2FsbGJhY2tcbiAgICAgICAgdmFyIGVsZW1lbnRVcGRhdGUgPSBzZWxmLl9oYXNoRm9yVXBkYXRlc1t0YXJnZXRJZF07XG4gICAgICAgIGlmIChlbGVtZW50VXBkYXRlKSB7XG4gICAgICAgICAgICBlbGVtZW50VXBkYXRlLmVudHJ5LnBhdXNlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgdGFyZ2V0IGlzIHBhdXNlZC5cbiAgICAgKiAhI3poIOi/lOWbnuaMh+WumuWvueixoeeahOWumuaXtuWZqOaYr+WQpuaaguWBnOS6huOAglxuICAgICAqIEBtZXRob2QgaXNUYXJnZXRQYXVzZWRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0XG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpc1RhcmdldFBhdXNlZDogZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICBjYy5hc3NlcnRJRCh0YXJnZXQsIDE1MDUpO1xuICAgICAgICB2YXIgdGFyZ2V0SWQgPSB0YXJnZXQuX2lkO1xuICAgICAgICBpZiAoIXRhcmdldElkKSB7XG4gICAgICAgICAgICBpZiAodGFyZ2V0Ll9faW5zdGFuY2VJZCkge1xuICAgICAgICAgICAgICAgIGNjLndhcm5JRCgxNTEzKTtcbiAgICAgICAgICAgICAgICB0YXJnZXRJZCA9IHRhcmdldC5faWQgPSB0YXJnZXQuX19pbnN0YW5jZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgxNTEwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEN1c3RvbSBzZWxlY3RvcnNcbiAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzLl9oYXNoRm9yVGltZXJzW3RhcmdldElkXTtcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50LnBhdXNlZDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZWxlbWVudFVwZGF0ZSA9IHRoaXMuX2hhc2hGb3JVcGRhdGVzW3RhcmdldElkXTtcbiAgICAgICAgaWYgKGVsZW1lbnRVcGRhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50VXBkYXRlLmVudHJ5LnBhdXNlZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbn07XG5cbi8qKlxuICogISNlbiBQcmlvcml0eSBsZXZlbCByZXNlcnZlZCBmb3Igc3lzdGVtIHNlcnZpY2VzLlxuICogISN6aCDns7vnu5/mnI3liqHnmoTkvJjlhYjnuqfjgIJcbiAqIEBwcm9wZXJ0eSBQUklPUklUWV9TWVNURU1cbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKiBAc3RhdGljXG4gKi9cbmNjLlNjaGVkdWxlci5QUklPUklUWV9TWVNURU0gPSAxIDw8IDMxO1xuXG4vKipcbiAqICEjZW4gTWluaW11bSBwcmlvcml0eSBsZXZlbCBmb3IgdXNlciBzY2hlZHVsaW5nLlxuICogISN6aCDnlKjmiLfosIPluqbmnIDkvY7kvJjlhYjnuqfjgIJcbiAqIEBwcm9wZXJ0eSBQUklPUklUWV9OT05fU1lTVEVNXG4gKiBAdHlwZSB7TnVtYmVyfVxuICogQHN0YXRpY1xuICovXG5jYy5TY2hlZHVsZXIuUFJJT1JJVFlfTk9OX1NZU1RFTSA9IGNjLlNjaGVkdWxlci5QUklPUklUWV9TWVNURU0gKyAxO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNjLlNjaGVkdWxlcjsiXX0=