
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/actions/CCActionInterval.js';
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

/**
 * @module cc
 */

/**
 * !#en
 * <p> An interval action is an action that takes place within a certain period of time. <br/>
 * It has an start time, and a finish time. The finish time is the parameter<br/>
 * duration plus the start time.</p>
 *
 * <p>These CCActionInterval actions have some interesting properties, like:<br/>
 * - They can run normally (default)  <br/>
 * - They can run reversed with the reverse method   <br/>
 * - They can run with the time altered with the Accelerate, AccelDeccel and Speed actions. </p>
 *
 * <p>For example, you can simulate a Ping Pong effect running the action normally and<br/>
 * then running it again in Reverse mode. </p>
 * !#zh 时间间隔动作，这种动作在已定时间内完成，继承 FiniteTimeAction。
 * @class ActionInterval
 * @extends FiniteTimeAction
 * @param {Number} d duration in seconds
 */
cc.ActionInterval = cc.Class({
  name: 'cc.ActionInterval',
  "extends": cc.FiniteTimeAction,
  ctor: function ctor(d) {
    this.MAX_VALUE = 2;
    this._elapsed = 0;
    this._firstTick = false;
    this._easeList = null;
    this._speed = 1;
    this._timesForRepeat = 1;
    this._repeatForever = false;
    this._repeatMethod = false; //Compatible with repeat class, Discard after can be deleted

    this._speedMethod = false; //Compatible with repeat class, Discard after can be deleted

    d !== undefined && cc.ActionInterval.prototype.initWithDuration.call(this, d);
  },

  /*
   * How many seconds had elapsed since the actions started to run.
   * @return {Number}
   */
  getElapsed: function getElapsed() {
    return this._elapsed;
  },

  /*
   * Initializes the action.
   * @param {Number} d duration in seconds
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(d) {
    this._duration = d === 0 ? cc.macro.FLT_EPSILON : d; // prevent division by 0
    // This comparison could be in step:, but it might decrease the performance
    // by 3% in heavy based action games.

    this._elapsed = 0;
    this._firstTick = true;
    return true;
  },
  isDone: function isDone() {
    return this._elapsed >= this._duration;
  },
  _cloneDecoration: function _cloneDecoration(action) {
    action._repeatForever = this._repeatForever;
    action._speed = this._speed;
    action._timesForRepeat = this._timesForRepeat;
    action._easeList = this._easeList;
    action._speedMethod = this._speedMethod;
    action._repeatMethod = this._repeatMethod;
  },
  _reverseEaseList: function _reverseEaseList(action) {
    if (this._easeList) {
      action._easeList = [];

      for (var i = 0; i < this._easeList.length; i++) {
        action._easeList.push(this._easeList[i].reverse());
      }
    }
  },
  clone: function clone() {
    var action = new cc.ActionInterval(this._duration);

    this._cloneDecoration(action);

    return action;
  },

  /**
   * !#en Implementation of ease motion.
   * !#zh 缓动运动。
   * @method easing
   * @param {Object} easeObj
   * @returns {ActionInterval}
   * @example
   * action.easing(cc.easeIn(3.0));
   */
  easing: function easing(easeObj) {
    if (this._easeList) this._easeList.length = 0;else this._easeList = [];

    for (var i = 0; i < arguments.length; i++) {
      this._easeList.push(arguments[i]);
    }

    return this;
  },
  _computeEaseTime: function _computeEaseTime(dt) {
    var locList = this._easeList;
    if (!locList || locList.length === 0) return dt;

    for (var i = 0, n = locList.length; i < n; i++) {
      dt = locList[i].easing(dt);
    }

    return dt;
  },
  step: function step(dt) {
    if (this._firstTick) {
      this._firstTick = false;
      this._elapsed = 0;
    } else this._elapsed += dt; //this.update((1 > (this._elapsed / this._duration)) ? this._elapsed / this._duration : 1);
    //this.update(Math.max(0, Math.min(1, this._elapsed / Math.max(this._duration, cc.macro.FLT_EPSILON))));


    var t = this._elapsed / (this._duration > 0.0000001192092896 ? this._duration : 0.0000001192092896);
    t = 1 > t ? t : 1;
    this.update(t > 0 ? t : 0); //Compatible with repeat class, Discard after can be deleted (this._repeatMethod)

    if (this._repeatMethod && this._timesForRepeat > 1 && this.isDone()) {
      if (!this._repeatForever) {
        this._timesForRepeat--;
      } //var diff = locInnerAction.getElapsed() - locInnerAction._duration;


      this.startWithTarget(this.target); // to prevent jerk. issue #390 ,1247
      //this._innerAction.step(0);
      //this._innerAction.step(diff);

      this.step(this._elapsed - this._duration);
    }
  },
  startWithTarget: function startWithTarget(target) {
    cc.Action.prototype.startWithTarget.call(this, target);
    this._elapsed = 0;
    this._firstTick = true;
  },
  reverse: function reverse() {
    cc.logID(1010);
    return null;
  },

  /*
   * Set amplitude rate.
   * @warning It should be overridden in subclass.
   * @param {Number} amp
   */
  setAmplitudeRate: function setAmplitudeRate(amp) {
    // Abstract class needs implementation
    cc.logID(1011);
  },

  /*
   * Get amplitude rate.
   * @warning It should be overridden in subclass.
   * @return {Number} 0
   */
  getAmplitudeRate: function getAmplitudeRate() {
    // Abstract class needs implementation
    cc.logID(1012);
    return 0;
  },

  /**
   * !#en
   * Changes the speed of an action, making it take longer (speed>1)
   * or less (speed<1) time. <br/>
   * Useful to simulate 'slow motion' or 'fast forward' effect.
   * !#zh
   * 改变一个动作的速度，使它的执行使用更长的时间（speed > 1）<br/>
   * 或更少（speed < 1）可以有效得模拟“慢动作”或“快进”的效果。
   * @param {Number} speed
   * @returns {Action}
   */
  speed: function speed(_speed) {
    if (_speed <= 0) {
      cc.logID(1013);
      return this;
    }

    this._speedMethod = true; //Compatible with repeat class, Discard after can be deleted

    this._speed *= _speed;
    return this;
  },

  /**
   * Get this action speed.
   * @return {Number}
   */
  getSpeed: function getSpeed() {
    return this._speed;
  },

  /**
   * Set this action speed.
   * @param {Number} speed
   * @returns {ActionInterval}
   */
  setSpeed: function setSpeed(speed) {
    this._speed = speed;
    return this;
  },

  /**
   * !#en
   * Repeats an action a number of times.
   * To repeat an action forever use the CCRepeatForever action.
   * !#zh 重复动作可以按一定次数重复一个动作，使用 RepeatForever 动作来永远重复一个动作。
   * @method repeat
   * @param {Number} times
   * @returns {ActionInterval}
   */
  repeat: function repeat(times) {
    times = Math.round(times);

    if (isNaN(times) || times < 1) {
      cc.logID(1014);
      return this;
    }

    this._repeatMethod = true; //Compatible with repeat class, Discard after can be deleted

    this._timesForRepeat *= times;
    return this;
  },

  /**
   * !#en
   * Repeats an action for ever.  <br/>
   * To repeat the an action for a limited number of times use the Repeat action. <br/>
   * !#zh 永远地重复一个动作，有限次数内重复一个动作请使用 Repeat 动作。
   * @method repeatForever
   * @returns {ActionInterval}
   */
  repeatForever: function repeatForever() {
    this._repeatMethod = true; //Compatible with repeat class, Discard after can be deleted

    this._timesForRepeat = this.MAX_VALUE;
    this._repeatForever = true;
    return this;
  }
});

cc.actionInterval = function (d) {
  return new cc.ActionInterval(d);
};
/**
 * @module cc
 */

/*
 * Runs actions sequentially, one after another.
 * @class Sequence
 * @extends ActionInterval
 * @param {Array|FiniteTimeAction} tempArray
 * @example
 * // create sequence with actions
 * var seq = new cc.Sequence(act1, act2);
 *
 * // create sequence with array
 * var seq = new cc.Sequence(actArray);
 */


cc.Sequence = cc.Class({
  name: 'cc.Sequence',
  "extends": cc.ActionInterval,
  ctor: function ctor(tempArray) {
    this._actions = [];
    this._split = null;
    this._last = 0;
    this._reversed = false;
    var paramArray = tempArray instanceof Array ? tempArray : arguments;

    if (paramArray.length === 1) {
      cc.errorID(1019);
      return;
    }

    var last = paramArray.length - 1;
    if (last >= 0 && paramArray[last] == null) cc.logID(1015);

    if (last >= 0) {
      var prev = paramArray[0],
          action1;

      for (var i = 1; i < last; i++) {
        if (paramArray[i]) {
          action1 = prev;
          prev = cc.Sequence._actionOneTwo(action1, paramArray[i]);
        }
      }

      this.initWithTwoActions(prev, paramArray[last]);
    }
  },

  /*
   * Initializes the action <br/>
   * @param {FiniteTimeAction} actionOne
   * @param {FiniteTimeAction} actionTwo
   * @return {Boolean}
   */
  initWithTwoActions: function initWithTwoActions(actionOne, actionTwo) {
    if (!actionOne || !actionTwo) {
      cc.errorID(1025);
      return false;
    }

    var durationOne = actionOne._duration,
        durationTwo = actionTwo._duration;
    durationOne *= actionOne._repeatMethod ? actionOne._timesForRepeat : 1;
    durationTwo *= actionTwo._repeatMethod ? actionTwo._timesForRepeat : 1;
    var d = durationOne + durationTwo;
    this.initWithDuration(d);
    this._actions[0] = actionOne;
    this._actions[1] = actionTwo;
    return true;
  },
  clone: function clone() {
    var action = new cc.Sequence();

    this._cloneDecoration(action);

    action.initWithTwoActions(this._actions[0].clone(), this._actions[1].clone());
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);
    this._split = this._actions[0]._duration / this._duration;
    this._split *= this._actions[0]._repeatMethod ? this._actions[0]._timesForRepeat : 1;
    this._last = -1;
  },
  stop: function stop() {
    // Issue #1305
    if (this._last !== -1) this._actions[this._last].stop();
    cc.Action.prototype.stop.call(this);
  },
  update: function update(dt) {
    var new_t,
        found = 0;
    var locSplit = this._split,
        locActions = this._actions,
        locLast = this._last,
        actionFound;
    dt = this._computeEaseTime(dt);

    if (dt < locSplit) {
      // action[0]
      new_t = locSplit !== 0 ? dt / locSplit : 1;

      if (found === 0 && locLast === 1 && this._reversed) {
        // Reverse mode ?
        // XXX: Bug. this case doesn't contemplate when _last==-1, found=0 and in "reverse mode"
        // since it will require a hack to know if an action is on reverse mode or not.
        // "step" should be overriden, and the "reverseMode" value propagated to inner Sequences.
        locActions[1].update(0);
        locActions[1].stop();
      }
    } else {
      // action[1]
      found = 1;
      new_t = locSplit === 1 ? 1 : (dt - locSplit) / (1 - locSplit);

      if (locLast === -1) {
        // action[0] was skipped, execute it.
        locActions[0].startWithTarget(this.target);
        locActions[0].update(1);
        locActions[0].stop();
      }

      if (locLast === 0) {
        // switching to action 1. stop action 0.
        locActions[0].update(1);
        locActions[0].stop();
      }
    }

    actionFound = locActions[found]; // Last action found and it is done.

    if (locLast === found && actionFound.isDone()) return; // Last action not found

    if (locLast !== found) actionFound.startWithTarget(this.target);
    new_t = new_t * actionFound._timesForRepeat;
    actionFound.update(new_t > 1 ? new_t % 1 : new_t);
    this._last = found;
  },
  reverse: function reverse() {
    var action = cc.Sequence._actionOneTwo(this._actions[1].reverse(), this._actions[0].reverse());

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    action._reversed = true;
    return action;
  }
});
/**
 * !#en
 * Helper constructor to create an array of sequenceable actions
 * The created action will run actions sequentially, one after another.
 * !#zh 顺序执行动作，创建的动作将按顺序依次运行。
 * @method sequence
 * @param {FiniteTimeAction|FiniteTimeAction[]} actionOrActionArray
 * @param {FiniteTimeAction} ...tempArray
 * @return {ActionInterval}
 * @example
 * // example
 * // create sequence with actions
 * var seq = cc.sequence(act1, act2);
 *
 * // create sequence with array
 * var seq = cc.sequence(actArray);
 */
// todo: It should be use new

cc.sequence = function (
/*Multiple Arguments*/
tempArray) {
  var paramArray = tempArray instanceof Array ? tempArray : arguments;

  if (paramArray.length === 1) {
    cc.errorID(1019);
    return null;
  }

  var last = paramArray.length - 1;
  if (last >= 0 && paramArray[last] == null) cc.logID(1015);
  var result = null;

  if (last >= 0) {
    result = paramArray[0];

    for (var i = 1; i <= last; i++) {
      if (paramArray[i]) {
        result = cc.Sequence._actionOneTwo(result, paramArray[i]);
      }
    }
  }

  return result;
};

cc.Sequence._actionOneTwo = function (actionOne, actionTwo) {
  var sequence = new cc.Sequence();
  sequence.initWithTwoActions(actionOne, actionTwo);
  return sequence;
};
/*
 * Repeats an action a number of times.
 * To repeat an action forever use the CCRepeatForever action.
 * @class Repeat
 * @extends ActionInterval
 * @param {FiniteTimeAction} action
 * @param {Number} times
 * @example
 * var rep = new cc.Repeat(cc.sequence(jump2, jump1), 5);
 */


cc.Repeat = cc.Class({
  name: 'cc.Repeat',
  "extends": cc.ActionInterval,
  ctor: function ctor(action, times) {
    this._times = 0;
    this._total = 0;
    this._nextDt = 0;
    this._actionInstant = false;
    this._innerAction = null;
    times !== undefined && this.initWithAction(action, times);
  },

  /*
   * @param {FiniteTimeAction} action
   * @param {Number} times
   * @return {Boolean}
   */
  initWithAction: function initWithAction(action, times) {
    var duration = action._duration * times;

    if (this.initWithDuration(duration)) {
      this._times = times;
      this._innerAction = action;

      if (action instanceof cc.ActionInstant) {
        this._actionInstant = true;
        this._times -= 1;
      }

      this._total = 0;
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.Repeat();

    this._cloneDecoration(action);

    action.initWithAction(this._innerAction.clone(), this._times);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    this._total = 0;
    this._nextDt = this._innerAction._duration / this._duration;
    cc.ActionInterval.prototype.startWithTarget.call(this, target);

    this._innerAction.startWithTarget(target);
  },
  stop: function stop() {
    this._innerAction.stop();

    cc.Action.prototype.stop.call(this);
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);
    var locInnerAction = this._innerAction;
    var locDuration = this._duration;
    var locTimes = this._times;
    var locNextDt = this._nextDt;

    if (dt >= locNextDt) {
      while (dt > locNextDt && this._total < locTimes) {
        locInnerAction.update(1);
        this._total++;
        locInnerAction.stop();
        locInnerAction.startWithTarget(this.target);
        locNextDt += locInnerAction._duration / locDuration;
        this._nextDt = locNextDt > 1 ? 1 : locNextDt;
      } // fix for issue #1288, incorrect end value of repeat


      if (dt >= 1.0 && this._total < locTimes) {
        // fix for cocos-creator/fireball/issues/4310
        locInnerAction.update(1);
        this._total++;
      } // don't set a instant action back or update it, it has no use because it has no duration


      if (!this._actionInstant) {
        if (this._total === locTimes) {
          locInnerAction.stop();
        } else {
          // issue #390 prevent jerk, use right update
          locInnerAction.update(dt - (locNextDt - locInnerAction._duration / locDuration));
        }
      }
    } else {
      locInnerAction.update(dt * locTimes % 1.0);
    }
  },
  isDone: function isDone() {
    return this._total === this._times;
  },
  reverse: function reverse() {
    var action = new cc.Repeat(this._innerAction.reverse(), this._times);

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  },

  /*
   * Set inner Action.
   * @param {FiniteTimeAction} action
   */
  setInnerAction: function setInnerAction(action) {
    if (this._innerAction !== action) {
      this._innerAction = action;
    }
  },

  /*
   * Get inner Action.
   * @return {FiniteTimeAction}
   */
  getInnerAction: function getInnerAction() {
    return this._innerAction;
  }
});
/**
 * !#en Creates a Repeat action. Times is an unsigned integer between 1 and pow(2,30)
 * !#zh 重复动作，可以按一定次数重复一个动，如果想永远重复一个动作请使用 repeatForever 动作来完成。
 * @method repeat
 * @param {FiniteTimeAction} action
 * @param {Number} times
 * @return {ActionInterval}
 * @example
 * // example
 * var rep = cc.repeat(cc.sequence(jump2, jump1), 5);
 */

cc.repeat = function (action, times) {
  return new cc.Repeat(action, times);
};
/*
 * Repeats an action for ever.  <br/>
 * To repeat the an action for a limited number of times use the Repeat action. <br/>
 * @warning This action can't be Sequenceable because it is not an IntervalAction
 * @class RepeatForever
 * @extends ActionInterval
 * @param {FiniteTimeAction} action
 * @example
 * var rep = new cc.RepeatForever(cc.sequence(jump2, jump1), 5);
 */


cc.RepeatForever = cc.Class({
  name: 'cc.RepeatForever',
  "extends": cc.ActionInterval,
  ctor: function ctor(action) {
    this._innerAction = null;
    action && this.initWithAction(action);
  },

  /*
   * @param {ActionInterval} action
   * @return {Boolean}
   */
  initWithAction: function initWithAction(action) {
    if (!action) {
      cc.errorID(1026);
      return false;
    }

    this._innerAction = action;
    return true;
  },
  clone: function clone() {
    var action = new cc.RepeatForever();

    this._cloneDecoration(action);

    action.initWithAction(this._innerAction.clone());
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);

    this._innerAction.startWithTarget(target);
  },
  step: function step(dt) {
    var locInnerAction = this._innerAction;
    locInnerAction.step(dt);

    if (locInnerAction.isDone()) {
      //var diff = locInnerAction.getElapsed() - locInnerAction._duration;
      locInnerAction.startWithTarget(this.target); // to prevent jerk. issue #390 ,1247
      //this._innerAction.step(0);
      //this._innerAction.step(diff);

      locInnerAction.step(locInnerAction.getElapsed() - locInnerAction._duration);
    }
  },
  isDone: function isDone() {
    return false;
  },
  reverse: function reverse() {
    var action = new cc.RepeatForever(this._innerAction.reverse());

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  },

  /*
   * Set inner action.
   * @param {ActionInterval} action
   */
  setInnerAction: function setInnerAction(action) {
    if (this._innerAction !== action) {
      this._innerAction = action;
    }
  },

  /*
   * Get inner action.
   * @return {ActionInterval}
   */
  getInnerAction: function getInnerAction() {
    return this._innerAction;
  }
});
/**
 * !#en Create a acton which repeat forever, as it runs forever, it can't be added into cc.sequence and cc.spawn.
 * !#zh 永远地重复一个动作，有限次数内重复一个动作请使用 repeat 动作，由于这个动作不会停止，所以不能被添加到 cc.sequence 或 cc.spawn 中。
 * @method repeatForever
 * @param {FiniteTimeAction} action
 * @return {ActionInterval}
 * @example
 * // example
 * var repeat = cc.repeatForever(cc.rotateBy(1.0, 360));
 */

cc.repeatForever = function (action) {
  return new cc.RepeatForever(action);
};
/* 
 * Spawn a new action immediately
 * @class Spawn
 * @extends ActionInterval
 */


cc.Spawn = cc.Class({
  name: 'cc.Spawn',
  "extends": cc.ActionInterval,
  ctor: function ctor(tempArray) {
    this._one = null;
    this._two = null;
    var paramArray = tempArray instanceof Array ? tempArray : arguments;

    if (paramArray.length === 1) {
      cc.errorID(1020);
      return;
    }

    var last = paramArray.length - 1;
    if (last >= 0 && paramArray[last] == null) cc.logID(1015);

    if (last >= 0) {
      var prev = paramArray[0],
          action1;

      for (var i = 1; i < last; i++) {
        if (paramArray[i]) {
          action1 = prev;
          prev = cc.Spawn._actionOneTwo(action1, paramArray[i]);
        }
      }

      this.initWithTwoActions(prev, paramArray[last]);
    }
  },

  /* initializes the Spawn action with the 2 actions to spawn
   * @param {FiniteTimeAction} action1
   * @param {FiniteTimeAction} action2
   * @return {Boolean}
   */
  initWithTwoActions: function initWithTwoActions(action1, action2) {
    if (!action1 || !action2) {
      cc.errorID(1027);
      return false;
    }

    var ret = false;
    var d1 = action1._duration;
    var d2 = action2._duration;

    if (this.initWithDuration(Math.max(d1, d2))) {
      this._one = action1;
      this._two = action2;

      if (d1 > d2) {
        this._two = cc.Sequence._actionOneTwo(action2, cc.delayTime(d1 - d2));
      } else if (d1 < d2) {
        this._one = cc.Sequence._actionOneTwo(action1, cc.delayTime(d2 - d1));
      }

      ret = true;
    }

    return ret;
  },
  clone: function clone() {
    var action = new cc.Spawn();

    this._cloneDecoration(action);

    action.initWithTwoActions(this._one.clone(), this._two.clone());
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);

    this._one.startWithTarget(target);

    this._two.startWithTarget(target);
  },
  stop: function stop() {
    this._one.stop();

    this._two.stop();

    cc.Action.prototype.stop.call(this);
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);
    if (this._one) this._one.update(dt);
    if (this._two) this._two.update(dt);
  },
  reverse: function reverse() {
    var action = cc.Spawn._actionOneTwo(this._one.reverse(), this._two.reverse());

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  }
});
/**
 * !#en Create a spawn action which runs several actions in parallel.
 * !#zh 同步执行动作，同步执行一组动作。
 * @method spawn
 * @param {FiniteTimeAction|FiniteTimeAction[]} actionOrActionArray
 * @param {FiniteTimeAction} ...tempArray
 * @return {FiniteTimeAction}
 * @example
 * // example
 * var action = cc.spawn(cc.jumpBy(2, cc.v2(300, 0), 50, 4), cc.rotateBy(2, 720));
 * todo:It should be the direct use new
 */

cc.spawn = function (
/*Multiple Arguments*/
tempArray) {
  var paramArray = tempArray instanceof Array ? tempArray : arguments;

  if (paramArray.length === 1) {
    cc.errorID(1020);
    return null;
  }

  if (paramArray.length > 0 && paramArray[paramArray.length - 1] == null) cc.logID(1015);
  var prev = paramArray[0];

  for (var i = 1; i < paramArray.length; i++) {
    if (paramArray[i] != null) prev = cc.Spawn._actionOneTwo(prev, paramArray[i]);
  }

  return prev;
};

cc.Spawn._actionOneTwo = function (action1, action2) {
  var pSpawn = new cc.Spawn();
  pSpawn.initWithTwoActions(action1, action2);
  return pSpawn;
};
/*
 * Rotates a Node object to a certain angle by modifying its angle property. <br/>
 * The direction will be decided by the shortest angle.
 * @class RotateTo
 * @extends ActionInterval
 * @param {Number} duration duration in seconds
 * @param {Number} dstAngle dstAngle in degrees.
 * @example
 * var rotateTo = new cc.RotateTo(2, 61.0);
 */


cc.RotateTo = cc.Class({
  name: 'cc.RotateTo',
  "extends": cc.ActionInterval,
  ctor: function ctor(duration, dstAngle) {
    this._startAngle = 0;
    this._dstAngle = 0;
    this._angle = 0;
    dstAngle !== undefined && this.initWithDuration(duration, dstAngle);
  },

  /*
   * Initializes the action.
   * @param {Number} duration
   * @param {Number} dstAngle
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(duration, dstAngle) {
    if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
      this._dstAngle = dstAngle;
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.RotateTo();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._dstAngle);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);
    var startAngle = target.angle % 360;
    var angle = cc.macro.ROTATE_ACTION_CCW ? this._dstAngle - startAngle : this._dstAngle + startAngle;
    if (angle > 180) angle -= 360;
    if (angle < -180) angle += 360;
    this._startAngle = startAngle;
    this._angle = cc.macro.ROTATE_ACTION_CCW ? angle : -angle;
  },
  reverse: function reverse() {
    cc.logID(1016);
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);

    if (this.target) {
      this.target.angle = this._startAngle + this._angle * dt;
    }
  }
});
/**
 * !#en
 * Rotates a Node object to a certain angle by modifying its angle property. <br/>
 * The direction will be decided by the shortest angle.
 * !#zh 旋转到目标角度，通过逐帧修改它的 angle 属性，旋转方向将由最短的角度决定。
 * @method rotateTo
 * @param {Number} duration duration in seconds
 * @param {Number} dstAngle dstAngle in degrees.
 * @return {ActionInterval}
 * @example
 * // example
 * var rotateTo = cc.rotateTo(2, 61.0);
 */

cc.rotateTo = function (duration, dstAngle) {
  return new cc.RotateTo(duration, dstAngle);
};
/*
 * Rotates a Node object clockwise a number of degrees by modifying its angle property.
 * Relative to its properties to modify.
 * @class RotateBy
 * @extends ActionInterval
 * @param {Number} duration duration in seconds
 * @param {Number} deltaAngle deltaAngle in degrees
 * @example
 * var actionBy = new cc.RotateBy(2, 360);
 */


cc.RotateBy = cc.Class({
  name: 'cc.RotateBy',
  "extends": cc.ActionInterval,
  ctor: function ctor(duration, deltaAngle) {
    deltaAngle *= cc.macro.ROTATE_ACTION_CCW ? 1 : -1;
    this._deltaAngle = 0;
    this._startAngle = 0;
    deltaAngle !== undefined && this.initWithDuration(duration, deltaAngle);
  },

  /*
   * Initializes the action.
   * @param {Number} duration duration in seconds
   * @param {Number} deltaAngle deltaAngle in degrees
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(duration, deltaAngle) {
    if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
      this._deltaAngle = deltaAngle;
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.RotateBy();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._deltaAngle);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);
    this._startAngle = target.angle;
    this._deltaAngle *= -1;
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);

    if (this.target) {
      this.target.angle = this._startAngle + this._deltaAngle * dt;
    }
  },
  reverse: function reverse() {
    var action = new cc.RotateBy();
    action.initWithDuration(this._duration, -this._deltaAngle);

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  }
});
/**
 * !#en
 * Rotates a Node object clockwise a number of degrees by modifying its angle property.
 * Relative to its properties to modify.
 * !#zh 旋转指定的角度。
 * @method rotateBy
 * @param {Number} duration duration in seconds
 * @param {Number} deltaAngle deltaAngle in degrees
 * @return {ActionInterval}
 * @example
 * // example
 * var actionBy = cc.rotateBy(2, 360);
 */

cc.rotateBy = function (duration, deltaAngle) {
  return new cc.RotateBy(duration, deltaAngle);
};
/*
 * <p>
 * Moves a Node object x,y pixels by modifying its position property.                                  <br/>
 * x and y are relative to the position of the object.                                                     <br/>
 * Several MoveBy actions can be concurrently called, and the resulting                                  <br/>
 * movement will be the sum of individual movements.
 * </p>
 * @class MoveBy
 * @extends ActionInterval
 * @param {Number} duration duration in seconds
 * @param {Vec2|Number} deltaPos
 * @param {Number} [deltaY]
 * @example
 * var actionTo = cc.moveBy(2, cc.v2(windowSize.width - 40, windowSize.height - 40));
 */


cc.MoveBy = cc.Class({
  name: 'cc.MoveBy',
  "extends": cc.ActionInterval,
  ctor: function ctor(duration, deltaPos, deltaY) {
    this._positionDelta = cc.v2(0, 0);
    this._startPosition = cc.v2(0, 0);
    this._previousPosition = cc.v2(0, 0);
    deltaPos !== undefined && cc.MoveBy.prototype.initWithDuration.call(this, duration, deltaPos, deltaY);
  },

  /*
   * Initializes the action.
   * @param {Number} duration duration in seconds
   * @param {Vec2} position
   * @param {Number} [y]
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(duration, position, y) {
    if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
      if (position.x !== undefined) {
        y = position.y;
        position = position.x;
      }

      this._positionDelta.x = position;
      this._positionDelta.y = y;
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.MoveBy();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._positionDelta);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);
    var locPosX = target.x;
    var locPosY = target.y;
    this._previousPosition.x = locPosX;
    this._previousPosition.y = locPosY;
    this._startPosition.x = locPosX;
    this._startPosition.y = locPosY;
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);

    if (this.target) {
      var x = this._positionDelta.x * dt;
      var y = this._positionDelta.y * dt;
      var locStartPosition = this._startPosition;

      if (cc.macro.ENABLE_STACKABLE_ACTIONS) {
        var targetX = this.target.x;
        var targetY = this.target.y;
        var locPreviousPosition = this._previousPosition;
        locStartPosition.x = locStartPosition.x + targetX - locPreviousPosition.x;
        locStartPosition.y = locStartPosition.y + targetY - locPreviousPosition.y;
        x = x + locStartPosition.x;
        y = y + locStartPosition.y;
        locPreviousPosition.x = x;
        locPreviousPosition.y = y;
        this.target.setPosition(x, y);
      } else {
        this.target.setPosition(locStartPosition.x + x, locStartPosition.y + y);
      }
    }
  },
  reverse: function reverse() {
    var action = new cc.MoveBy(this._duration, cc.v2(-this._positionDelta.x, -this._positionDelta.y));

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  }
});
/**
 * !#en
 * Moves a Node object x,y pixels by modifying its position property.                                  <br/>
 * x and y are relative to the position of the object.                                                     <br/>
 * Several MoveBy actions can be concurrently called, and the resulting                                  <br/>
 * movement will be the sum of individual movements.
 * !#zh 移动指定的距离。
 * @method moveBy
 * @param {Number} duration duration in seconds
 * @param {Vec2|Number} deltaPos
 * @param {Number} [deltaY]
 * @return {ActionInterval}
 * @example
 * // example
 * var actionTo = cc.moveBy(2, cc.v2(windowSize.width - 40, windowSize.height - 40));
 */

cc.moveBy = function (duration, deltaPos, deltaY) {
  return new cc.MoveBy(duration, deltaPos, deltaY);
};
/*
 * Moves a Node object to the position x,y. x and y are absolute coordinates by modifying its position property. <br/>
 * Several MoveTo actions can be concurrently called, and the resulting                                            <br/>
 * movement will be the sum of individual movements.
 * @class MoveTo
 * @extends MoveBy
 * @param {Number} duration duration in seconds
 * @param {Vec2|Number} position
 * @param {Number} [y]
 * @example
 * var actionBy = new cc.MoveTo(2, cc.v2(80, 80));
 */


cc.MoveTo = cc.Class({
  name: 'cc.MoveTo',
  "extends": cc.MoveBy,
  ctor: function ctor(duration, position, y) {
    this._endPosition = cc.v2(0, 0);
    position !== undefined && this.initWithDuration(duration, position, y);
  },

  /*
   * Initializes the action.
   * @param {Number} duration  duration in seconds
   * @param {Vec2} position
   * @param {Number} [y]
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(duration, position, y) {
    if (cc.MoveBy.prototype.initWithDuration.call(this, duration, position, y)) {
      if (position.x !== undefined) {
        y = position.y;
        position = position.x;
      }

      this._endPosition.x = position;
      this._endPosition.y = y;
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.MoveTo();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._endPosition);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.MoveBy.prototype.startWithTarget.call(this, target);
    this._positionDelta.x = this._endPosition.x - target.x;
    this._positionDelta.y = this._endPosition.y - target.y;
  }
});
/**
 * !#en
 * Moves a Node object to the position x,y. x and y are absolute coordinates by modifying its position property. <br/>
 * Several MoveTo actions can be concurrently called, and the resulting                                            <br/>
 * movement will be the sum of individual movements.
 * !#zh 移动到目标位置。
 * @method moveTo
 * @param {Number} duration duration in seconds
 * @param {Vec2|Number} position
 * @param {Number} [y]
 * @return {ActionInterval}
 * @example
 * // example
 * var actionBy = cc.moveTo(2, cc.v2(80, 80));
 */

cc.moveTo = function (duration, position, y) {
  return new cc.MoveTo(duration, position, y);
};
/*
 * Skews a Node object to given angles by modifying its skewX and skewY properties
 * @class SkewTo
 * @extends ActionInterval
 * @param {Number} t time in seconds
 * @param {Number} sx
 * @param {Number} sy
 * @example
 * var actionTo = new cc.SkewTo(2, 37.2, -37.2);
 */


cc.SkewTo = cc.Class({
  name: 'cc.SkewTo',
  "extends": cc.ActionInterval,
  ctor: function ctor(t, sx, sy) {
    this._skewX = 0;
    this._skewY = 0;
    this._startSkewX = 0;
    this._startSkewY = 0;
    this._endSkewX = 0;
    this._endSkewY = 0;
    this._deltaX = 0;
    this._deltaY = 0;
    sy !== undefined && cc.SkewTo.prototype.initWithDuration.call(this, t, sx, sy);
  },

  /*
   * Initializes the action.
   * @param {Number} t time in seconds
   * @param {Number} sx
   * @param {Number} sy
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(t, sx, sy) {
    var ret = false;

    if (cc.ActionInterval.prototype.initWithDuration.call(this, t)) {
      this._endSkewX = sx;
      this._endSkewY = sy;
      ret = true;
    }

    return ret;
  },
  clone: function clone() {
    var action = new cc.SkewTo();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._endSkewX, this._endSkewY);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);
    this._startSkewX = target.skewX % 180;
    this._deltaX = this._endSkewX - this._startSkewX;
    if (this._deltaX > 180) this._deltaX -= 360;
    if (this._deltaX < -180) this._deltaX += 360;
    this._startSkewY = target.skewY % 360;
    this._deltaY = this._endSkewY - this._startSkewY;
    if (this._deltaY > 180) this._deltaY -= 360;
    if (this._deltaY < -180) this._deltaY += 360;
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);
    this.target.skewX = this._startSkewX + this._deltaX * dt;
    this.target.skewY = this._startSkewY + this._deltaY * dt;
  }
});
/**
 * !#en
 * Create a action which skews a Node object to given angles by modifying its skewX and skewY properties.
 * Changes to the specified value.
 * !#zh 偏斜到目标角度。
 * @method skewTo
 * @param {Number} t time in seconds
 * @param {Number} sx
 * @param {Number} sy
 * @return {ActionInterval}
 * @example
 * // example
 * var actionTo = cc.skewTo(2, 37.2, -37.2);
 */

cc.skewTo = function (t, sx, sy) {
  return new cc.SkewTo(t, sx, sy);
};
/*
 * Skews a Node object by skewX and skewY degrees.
 * Relative to its property modification.
 * @class SkewBy
 * @extends SkewTo
 * @param {Number} t time in seconds
 * @param {Number} sx  skew in degrees for X axis
 * @param {Number} sy  skew in degrees for Y axis
 */


cc.SkewBy = cc.Class({
  name: 'cc.SkewBy',
  "extends": cc.SkewTo,
  ctor: function ctor(t, sx, sy) {
    sy !== undefined && this.initWithDuration(t, sx, sy);
  },

  /*
   * Initializes the action.
   * @param {Number} t time in seconds
   * @param {Number} deltaSkewX  skew in degrees for X axis
   * @param {Number} deltaSkewY  skew in degrees for Y axis
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(t, deltaSkewX, deltaSkewY) {
    var ret = false;

    if (cc.SkewTo.prototype.initWithDuration.call(this, t, deltaSkewX, deltaSkewY)) {
      this._skewX = deltaSkewX;
      this._skewY = deltaSkewY;
      ret = true;
    }

    return ret;
  },
  clone: function clone() {
    var action = new cc.SkewBy();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._skewX, this._skewY);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.SkewTo.prototype.startWithTarget.call(this, target);
    this._deltaX = this._skewX;
    this._deltaY = this._skewY;
    this._endSkewX = this._startSkewX + this._deltaX;
    this._endSkewY = this._startSkewY + this._deltaY;
  },
  reverse: function reverse() {
    var action = new cc.SkewBy(this._duration, -this._skewX, -this._skewY);

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  }
});
/**
 * !#en
 * Skews a Node object by skewX and skewY degrees. <br />
 * Relative to its property modification.
 * !#zh 偏斜指定的角度。
 * @method skewBy
 * @param {Number} t time in seconds
 * @param {Number} sx sx skew in degrees for X axis
 * @param {Number} sy sy skew in degrees for Y axis
 * @return {ActionInterval}
 * @example
 * // example
 * var actionBy = cc.skewBy(2, 0, -90);
 */

cc.skewBy = function (t, sx, sy) {
  return new cc.SkewBy(t, sx, sy);
};
/*
 * Moves a Node object simulating a parabolic jump movement by modifying its position property.
 * Relative to its movement.
 * @class JumpBy
 * @extends ActionInterval
 * @param {Number} duration
 * @param {Vec2|Number} position
 * @param {Number} [y]
 * @param {Number} height
 * @param {Number} jumps
 * @example
 * var actionBy = new cc.JumpBy(2, cc.v2(300, 0), 50, 4);
 * var actionBy = new cc.JumpBy(2, 300, 0, 50, 4);
 */


cc.JumpBy = cc.Class({
  name: 'cc.JumpBy',
  "extends": cc.ActionInterval,
  ctor: function ctor(duration, position, y, height, jumps) {
    this._startPosition = cc.v2(0, 0);
    this._previousPosition = cc.v2(0, 0);
    this._delta = cc.v2(0, 0);
    this._height = 0;
    this._jumps = 0;
    height !== undefined && cc.JumpBy.prototype.initWithDuration.call(this, duration, position, y, height, jumps);
  },

  /*
   * Initializes the action.
   * @param {Number} duration
   * @param {Vec2|Number} position
   * @param {Number} [y]
   * @param {Number} height
   * @param {Number} jumps
   * @return {Boolean}
   * @example
   * actionBy.initWithDuration(2, cc.v2(300, 0), 50, 4);
   * actionBy.initWithDuration(2, 300, 0, 50, 4);
   */
  initWithDuration: function initWithDuration(duration, position, y, height, jumps) {
    if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
      if (jumps === undefined) {
        jumps = height;
        height = y;
        y = position.y;
        position = position.x;
      }

      this._delta.x = position;
      this._delta.y = y;
      this._height = height;
      this._jumps = jumps;
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.JumpBy();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._delta, this._height, this._jumps);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);
    var locPosX = target.x;
    var locPosY = target.y;
    this._previousPosition.x = locPosX;
    this._previousPosition.y = locPosY;
    this._startPosition.x = locPosX;
    this._startPosition.y = locPosY;
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);

    if (this.target) {
      var frac = dt * this._jumps % 1.0;
      var y = this._height * 4 * frac * (1 - frac);
      y += this._delta.y * dt;
      var x = this._delta.x * dt;
      var locStartPosition = this._startPosition;

      if (cc.macro.ENABLE_STACKABLE_ACTIONS) {
        var targetX = this.target.x;
        var targetY = this.target.y;
        var locPreviousPosition = this._previousPosition;
        locStartPosition.x = locStartPosition.x + targetX - locPreviousPosition.x;
        locStartPosition.y = locStartPosition.y + targetY - locPreviousPosition.y;
        x = x + locStartPosition.x;
        y = y + locStartPosition.y;
        locPreviousPosition.x = x;
        locPreviousPosition.y = y;
        this.target.setPosition(x, y);
      } else {
        this.target.setPosition(locStartPosition.x + x, locStartPosition.y + y);
      }
    }
  },
  reverse: function reverse() {
    var action = new cc.JumpBy(this._duration, cc.v2(-this._delta.x, -this._delta.y), this._height, this._jumps);

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  }
});
/**
 * !#en
 * Moves a Node object simulating a parabolic jump movement by modifying it's position property.
 * Relative to its movement.
 * !#zh 用跳跃的方式移动指定的距离。
 * @method jumpBy
 * @param {Number} duration
 * @param {Vec2|Number} position
 * @param {Number} [y]
 * @param {Number} [height]
 * @param {Number} [jumps]
 * @return {ActionInterval}
 * @example
 * // example
 * var actionBy = cc.jumpBy(2, cc.v2(300, 0), 50, 4);
 * var actionBy = cc.jumpBy(2, 300, 0, 50, 4);
 */

cc.jumpBy = function (duration, position, y, height, jumps) {
  return new cc.JumpBy(duration, position, y, height, jumps);
};
/*
 * Moves a Node object to a parabolic position simulating a jump movement by modifying it's position property. <br />
 * Jump to the specified location.
 * @class JumpTo
 * @extends JumpBy
 * @param {Number} duration
 * @param {Vec2|Number} position
 * @param {Number} [y]
 * @param {Number} [height]
 * @param {Number} [jumps]
 * @example
 * var actionTo = new cc.JumpTo(2, cc.v2(300, 0), 50, 4);
 * var actionTo = new cc.JumpTo(2, 300, 0, 50, 4);
 */


cc.JumpTo = cc.Class({
  name: 'cc.JumpTo',
  "extends": cc.JumpBy,
  ctor: function ctor(duration, position, y, height, jumps) {
    this._endPosition = cc.v2(0, 0);
    height !== undefined && this.initWithDuration(duration, position, y, height, jumps);
  },

  /*
   * Initializes the action.
   * @param {Number} duration
   * @param {Vec2|Number} position
   * @param {Number} [y]
   * @param {Number} height
   * @param {Number} jumps
   * @return {Boolean}
   * @example
   * actionTo.initWithDuration(2, cc.v2(300, 0), 50, 4);
   * actionTo.initWithDuration(2, 300, 0, 50, 4);
   */
  initWithDuration: function initWithDuration(duration, position, y, height, jumps) {
    if (cc.JumpBy.prototype.initWithDuration.call(this, duration, position, y, height, jumps)) {
      if (jumps === undefined) {
        y = position.y;
        position = position.x;
      }

      this._endPosition.x = position;
      this._endPosition.y = y;
      return true;
    }

    return false;
  },
  startWithTarget: function startWithTarget(target) {
    cc.JumpBy.prototype.startWithTarget.call(this, target);
    this._delta.x = this._endPosition.x - this._startPosition.x;
    this._delta.y = this._endPosition.y - this._startPosition.y;
  },
  clone: function clone() {
    var action = new cc.JumpTo();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._endPosition, this._height, this._jumps);
    return action;
  }
});
/**
 * !#en
 * Moves a Node object to a parabolic position simulating a jump movement by modifying its position property. <br />
 * Jump to the specified location.
 * !#zh 用跳跃的方式移动到目标位置。
 * @method jumpTo
 * @param {Number} duration
 * @param {Vec2|Number} position
 * @param {Number} [y]
 * @param {Number} [height]
 * @param {Number} [jumps]
 * @return {ActionInterval}
 * @example
 * // example
 * var actionTo = cc.jumpTo(2, cc.v2(300, 300), 50, 4);
 * var actionTo = cc.jumpTo(2, 300, 300, 50, 4);
 */

cc.jumpTo = function (duration, position, y, height, jumps) {
  return new cc.JumpTo(duration, position, y, height, jumps);
};
/* An action that moves the target with a cubic Bezier curve by a certain distance.
 * Relative to its movement.
 * @class BezierBy
 * @extends ActionInterval
 * @param {Number} t - time in seconds
 * @param {Vec2[]} c - Array of points
 * @example
 * var bezier = [cc.v2(0, windowSize.height / 2), cc.v2(300, -windowSize.height / 2), cc.v2(300, 100)];
 * var bezierForward = new cc.BezierBy(3, bezier);
 */


function bezierAt(a, b, c, d, t) {
  return Math.pow(1 - t, 3) * a + 3 * t * Math.pow(1 - t, 2) * b + 3 * Math.pow(t, 2) * (1 - t) * c + Math.pow(t, 3) * d;
}

;
cc.BezierBy = cc.Class({
  name: 'cc.BezierBy',
  "extends": cc.ActionInterval,
  ctor: function ctor(t, c) {
    this._config = [];
    this._startPosition = cc.v2(0, 0);
    this._previousPosition = cc.v2(0, 0);
    c && cc.BezierBy.prototype.initWithDuration.call(this, t, c);
  },

  /*
   * Initializes the action.
   * @param {Number} t - time in seconds
   * @param {Vec2[]} c - Array of points
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(t, c) {
    if (cc.ActionInterval.prototype.initWithDuration.call(this, t)) {
      this._config = c;
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.BezierBy();

    this._cloneDecoration(action);

    var newConfigs = [];

    for (var i = 0; i < this._config.length; i++) {
      var selConf = this._config[i];
      newConfigs.push(cc.v2(selConf.x, selConf.y));
    }

    action.initWithDuration(this._duration, newConfigs);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);
    var locPosX = target.x;
    var locPosY = target.y;
    this._previousPosition.x = locPosX;
    this._previousPosition.y = locPosY;
    this._startPosition.x = locPosX;
    this._startPosition.y = locPosY;
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);

    if (this.target) {
      var locConfig = this._config;
      var xa = 0;
      var xb = locConfig[0].x;
      var xc = locConfig[1].x;
      var xd = locConfig[2].x;
      var ya = 0;
      var yb = locConfig[0].y;
      var yc = locConfig[1].y;
      var yd = locConfig[2].y;
      var x = bezierAt(xa, xb, xc, xd, dt);
      var y = bezierAt(ya, yb, yc, yd, dt);
      var locStartPosition = this._startPosition;

      if (cc.macro.ENABLE_STACKABLE_ACTIONS) {
        var targetX = this.target.x;
        var targetY = this.target.y;
        var locPreviousPosition = this._previousPosition;
        locStartPosition.x = locStartPosition.x + targetX - locPreviousPosition.x;
        locStartPosition.y = locStartPosition.y + targetY - locPreviousPosition.y;
        x = x + locStartPosition.x;
        y = y + locStartPosition.y;
        locPreviousPosition.x = x;
        locPreviousPosition.y = y;
        this.target.setPosition(x, y);
      } else {
        this.target.setPosition(locStartPosition.x + x, locStartPosition.y + y);
      }
    }
  },
  reverse: function reverse() {
    var locConfig = this._config;
    var x0 = locConfig[0].x,
        y0 = locConfig[0].y;
    var x1 = locConfig[1].x,
        y1 = locConfig[1].y;
    var x2 = locConfig[2].x,
        y2 = locConfig[2].y;
    var r = [cc.v2(x1 - x2, y1 - y2), cc.v2(x0 - x2, y0 - y2), cc.v2(-x2, -y2)];
    var action = new cc.BezierBy(this._duration, r);

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  }
});
/**
 * !#en
 * An action that moves the target with a cubic Bezier curve by a certain distance.
 * Relative to its movement.
 * !#zh 按贝赛尔曲线轨迹移动指定的距离。
 * @method bezierBy
 * @param {Number} t - time in seconds
 * @param {Vec2[]} c - Array of points
 * @return {ActionInterval}
 * @example
 * // example
 * var bezier = [cc.v2(0, windowSize.height / 2), cc.v2(300, -windowSize.height / 2), cc.v2(300, 100)];
 * var bezierForward = cc.bezierBy(3, bezier);
 */

cc.bezierBy = function (t, c) {
  return new cc.BezierBy(t, c);
};
/* An action that moves the target with a cubic Bezier curve to a destination point.
 * @class BezierTo
 * @extends BezierBy
 * @param {Number} t
 * @param {Vec2[]} c - Array of points
 * @example
 * var bezier = [cc.v2(0, windowSize.height / 2), cc.v2(300, -windowSize.height / 2), cc.v2(300, 100)];
 * var bezierTo = new cc.BezierTo(2, bezier);
 */


cc.BezierTo = cc.Class({
  name: 'cc.BezierTo',
  "extends": cc.BezierBy,
  ctor: function ctor(t, c) {
    this._toConfig = [];
    c && this.initWithDuration(t, c);
  },

  /*
   * Initializes the action.
   * @param {Number} t time in seconds
   * @param {Vec2[]} c - Array of points
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(t, c) {
    if (cc.ActionInterval.prototype.initWithDuration.call(this, t)) {
      this._toConfig = c;
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.BezierTo();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._toConfig);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.BezierBy.prototype.startWithTarget.call(this, target);
    var locStartPos = this._startPosition;
    var locToConfig = this._toConfig;
    var locConfig = this._config;
    locConfig[0] = locToConfig[0].sub(locStartPos);
    locConfig[1] = locToConfig[1].sub(locStartPos);
    locConfig[2] = locToConfig[2].sub(locStartPos);
  }
});
/**
 * !#en An action that moves the target with a cubic Bezier curve to a destination point.
 * !#zh 按贝赛尔曲线轨迹移动到目标位置。
 * @method bezierTo
 * @param {Number} t
 * @param {Vec2[]} c - Array of points
 * @return {ActionInterval}
 * @example
 * // example
 * var bezier = [cc.v2(0, windowSize.height / 2), cc.v2(300, -windowSize.height / 2), cc.v2(300, 100)];
 * var bezierTo = cc.bezierTo(2, bezier);
 */

cc.bezierTo = function (t, c) {
  return new cc.BezierTo(t, c);
};
/* Scales a Node object to a zoom factor by modifying it's scale property.
 * @warning This action doesn't support "reverse"
 * @class ScaleTo
 * @extends ActionInterval
 * @param {Number} duration
 * @param {Number} sx  scale parameter in X
 * @param {Number} [sy] scale parameter in Y, if Null equal to sx
 * @example
 * // It scales to 0.5 in both X and Y.
 * var actionTo = new cc.ScaleTo(2, 0.5);
 *
 * // It scales to 0.5 in x and 2 in Y
 * var actionTo = new cc.ScaleTo(2, 0.5, 2);
 */


cc.ScaleTo = cc.Class({
  name: 'cc.ScaleTo',
  "extends": cc.ActionInterval,
  ctor: function ctor(duration, sx, sy) {
    this._scaleX = 1;
    this._scaleY = 1;
    this._startScaleX = 1;
    this._startScaleY = 1;
    this._endScaleX = 0;
    this._endScaleY = 0;
    this._deltaX = 0;
    this._deltaY = 0;
    sx !== undefined && cc.ScaleTo.prototype.initWithDuration.call(this, duration, sx, sy);
  },

  /*
   * Initializes the action.
   * @param {Number} duration
   * @param {Number} sx
   * @param {Number} [sy=]
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(duration, sx, sy) {
    //function overload here
    if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
      this._endScaleX = sx;
      this._endScaleY = sy != null ? sy : sx;
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.ScaleTo();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._endScaleX, this._endScaleY);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);
    this._startScaleX = target.scaleX;
    this._startScaleY = target.scaleY;
    this._deltaX = this._endScaleX - this._startScaleX;
    this._deltaY = this._endScaleY - this._startScaleY;
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);

    if (this.target) {
      this.target.scaleX = this._startScaleX + this._deltaX * dt;
      this.target.scaleY = this._startScaleY + this._deltaY * dt;
    }
  }
});
/**
 * !#en Scales a Node object to a zoom factor by modifying it's scale property.
 * !#zh 将节点大小缩放到指定的倍数。
 * @method scaleTo
 * @param {Number} duration
 * @param {Number} sx  scale parameter in X
 * @param {Number} [sy] scale parameter in Y, if Null equal to sx
 * @return {ActionInterval}
 * @example
 * // example
 * // It scales to 0.5 in both X and Y.
 * var actionTo = cc.scaleTo(2, 0.5);
 *
 * // It scales to 0.5 in x and 2 in Y
 * var actionTo = cc.scaleTo(2, 0.5, 2);
 */

cc.scaleTo = function (duration, sx, sy) {
  //function overload
  return new cc.ScaleTo(duration, sx, sy);
};
/* Scales a Node object a zoom factor by modifying it's scale property.
 * Relative to its changes.
 * @class ScaleBy
 * @extends ScaleTo
 */


cc.ScaleBy = cc.Class({
  name: 'cc.ScaleBy',
  "extends": cc.ScaleTo,
  startWithTarget: function startWithTarget(target) {
    cc.ScaleTo.prototype.startWithTarget.call(this, target);
    this._deltaX = this._startScaleX * this._endScaleX - this._startScaleX;
    this._deltaY = this._startScaleY * this._endScaleY - this._startScaleY;
  },
  reverse: function reverse() {
    var action = new cc.ScaleBy(this._duration, 1 / this._endScaleX, 1 / this._endScaleY);

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  },
  clone: function clone() {
    var action = new cc.ScaleBy();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._endScaleX, this._endScaleY);
    return action;
  }
});
/**
 * !#en
 * Scales a Node object a zoom factor by modifying it's scale property.
 * Relative to its changes.
 * !#zh 按指定的倍数缩放节点大小。
 * @method scaleBy
 * @param {Number} duration duration in seconds
 * @param {Number} sx sx  scale parameter in X
 * @param {Number|Null} [sy=] sy scale parameter in Y, if Null equal to sx
 * @return {ActionInterval}
 * @example
 * // example without sy, it scales by 2 both in X and Y
 * var actionBy = cc.scaleBy(2, 2);
 *
 * //example with sy, it scales by 0.25 in X and 4.5 in Y
 * var actionBy2 = cc.scaleBy(2, 0.25, 4.5);
 */

cc.scaleBy = function (duration, sx, sy) {
  return new cc.ScaleBy(duration, sx, sy);
};
/* Blinks a Node object by modifying it's visible property
 * @class Blink
 * @extends ActionInterval
 * @param {Number} duration  duration in seconds
 * @param {Number} blinks  blinks in times
 * @example
 * var action = new cc.Blink(2, 10);
 */


cc.Blink = cc.Class({
  name: 'cc.Blink',
  "extends": cc.ActionInterval,
  ctor: function ctor(duration, blinks) {
    this._times = 0;
    this._originalState = false;
    blinks !== undefined && this.initWithDuration(duration, blinks);
  },

  /*
   * Initializes the action.
   * @param {Number} duration duration in seconds
   * @param {Number} blinks blinks in times
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(duration, blinks) {
    if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
      this._times = blinks;
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.Blink();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._times);
    return action;
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);

    if (this.target && !this.isDone()) {
      var slice = 1.0 / this._times;
      var m = dt % slice;
      this.target.opacity = m > slice / 2 ? 255 : 0;
    }
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);
    this._originalState = target.opacity;
  },
  stop: function stop() {
    this.target.opacity = this._originalState;
    cc.ActionInterval.prototype.stop.call(this);
  },
  reverse: function reverse() {
    var action = new cc.Blink(this._duration, this._times);

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  }
});
/**
 * !#en Blinks a Node object by modifying it's visible property.
 * !#zh 闪烁（基于透明度）。
 * @method blink
 * @param {Number} duration  duration in seconds
 * @param {Number} blinks blinks in times
 * @return {ActionInterval}
 * @example
 * // example
 * var action = cc.blink(2, 10);
 */

cc.blink = function (duration, blinks) {
  return new cc.Blink(duration, blinks);
};
/* Fades an object that implements the cc.RGBAProtocol protocol. It modifies the opacity from the current value to a custom one.
 * @warning This action doesn't support "reverse"
 * @class FadeTo
 * @extends ActionInterval
 * @param {Number} duration
 * @param {Number} opacity 0-255, 0 is transparent
 * @example
 * var action = new cc.FadeTo(1.0, 0);
 */


cc.FadeTo = cc.Class({
  name: 'cc.FadeTo',
  "extends": cc.ActionInterval,
  ctor: function ctor(duration, opacity) {
    this._toOpacity = 0;
    this._fromOpacity = 0;
    opacity !== undefined && cc.FadeTo.prototype.initWithDuration.call(this, duration, opacity);
  },

  /*
   * Initializes the action.
   * @param {Number} duration  duration in seconds
   * @param {Number} opacity
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(duration, opacity) {
    if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
      this._toOpacity = opacity;
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.FadeTo();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._toOpacity);
    return action;
  },
  update: function update(time) {
    time = this._computeEaseTime(time);
    var fromOpacity = this._fromOpacity !== undefined ? this._fromOpacity : 255;
    this.target.opacity = fromOpacity + (this._toOpacity - fromOpacity) * time;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);
    this._fromOpacity = target.opacity;
  }
});
/**
 * !#en
 * Fades an object that implements the cc.RGBAProtocol protocol.
 * It modifies the opacity from the current value to a custom one.
 * !#zh 修改透明度到指定值。
 * @method fadeTo
 * @param {Number} duration
 * @param {Number} opacity 0-255, 0 is transparent
 * @return {ActionInterval}
 * @example
 * // example
 * var action = cc.fadeTo(1.0, 0);
 */

cc.fadeTo = function (duration, opacity) {
  return new cc.FadeTo(duration, opacity);
};
/* Fades In an object that implements the cc.RGBAProtocol protocol. It modifies the opacity from 0 to 255.<br/>
 * The "reverse" of this action is FadeOut
 * @class FadeIn
 * @extends FadeTo
 * @param {Number} duration duration in seconds
 */


cc.FadeIn = cc.Class({
  name: 'cc.FadeIn',
  "extends": cc.FadeTo,
  ctor: function ctor(duration) {
    if (duration == null) duration = 0;
    this._reverseAction = null;
    this.initWithDuration(duration, 255);
  },
  reverse: function reverse() {
    var action = new cc.FadeOut();
    action.initWithDuration(this._duration, 0);

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  },
  clone: function clone() {
    var action = new cc.FadeIn();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._toOpacity);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    if (this._reverseAction) this._toOpacity = this._reverseAction._fromOpacity;
    cc.FadeTo.prototype.startWithTarget.call(this, target);
  }
});
/**
 * !#en Fades In an object that implements the cc.RGBAProtocol protocol. It modifies the opacity from 0 to 255.
 * !#zh 渐显效果。
 * @method fadeIn
 * @param {Number} duration duration in seconds
 * @return {ActionInterval}
 * @example
 * //example
 * var action = cc.fadeIn(1.0);
 */

cc.fadeIn = function (duration) {
  return new cc.FadeIn(duration);
};
/* Fades Out an object that implements the cc.RGBAProtocol protocol. It modifies the opacity from 255 to 0.
 * The "reverse" of this action is FadeIn
 * @class FadeOut
 * @extends FadeTo
 * @param {Number} duration duration in seconds
 */


cc.FadeOut = cc.Class({
  name: 'cc.FadeOut',
  "extends": cc.FadeTo,
  ctor: function ctor(duration) {
    if (duration == null) duration = 0;
    this._reverseAction = null;
    this.initWithDuration(duration, 0);
  },
  reverse: function reverse() {
    var action = new cc.FadeIn();
    action._reverseAction = this;
    action.initWithDuration(this._duration, 255);

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  },
  clone: function clone() {
    var action = new cc.FadeOut();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._toOpacity);
    return action;
  }
});
/**
 * !#en Fades Out an object that implements the cc.RGBAProtocol protocol. It modifies the opacity from 255 to 0.
 * !#zh 渐隐效果。
 * @method fadeOut
 * @param {Number} d  duration in seconds
 * @return {ActionInterval}
 * @example
 * // example
 * var action = cc.fadeOut(1.0);
 */

cc.fadeOut = function (d) {
  return new cc.FadeOut(d);
};
/* Tints a Node that implements the cc.NodeRGB protocol from current tint to a custom one.
 * @warning This action doesn't support "reverse"
 * @class TintTo
 * @extends ActionInterval
 * @param {Number} duration
 * @param {Number} red 0-255
 * @param {Number} green  0-255
 * @param {Number} blue 0-255
 * @example
 * var action = new cc.TintTo(2, 255, 0, 255);
 */


cc.TintTo = cc.Class({
  name: 'cc.TintTo',
  "extends": cc.ActionInterval,
  ctor: function ctor(duration, red, green, blue) {
    this._to = cc.color(0, 0, 0);
    this._from = cc.color(0, 0, 0);

    if (red instanceof cc.Color) {
      blue = red.b;
      green = red.g;
      red = red.r;
    }

    blue !== undefined && this.initWithDuration(duration, red, green, blue);
  },

  /*
   * Initializes the action.
   * @param {Number} duration
   * @param {Number} red 0-255
   * @param {Number} green 0-255
   * @param {Number} blue 0-255
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(duration, red, green, blue) {
    if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
      this._to = cc.color(red, green, blue);
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.TintTo();

    this._cloneDecoration(action);

    var locTo = this._to;
    action.initWithDuration(this._duration, locTo.r, locTo.g, locTo.b);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);
    this._from = this.target.color;
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);
    var locFrom = this._from,
        locTo = this._to;

    if (locFrom) {
      this.target.color = cc.color(locFrom.r + (locTo.r - locFrom.r) * dt, locFrom.g + (locTo.g - locFrom.g) * dt, locFrom.b + (locTo.b - locFrom.b) * dt);
    }
  }
});
/**
 * !#en Tints a Node that implements the cc.NodeRGB protocol from current tint to a custom one.
 * !#zh 修改颜色到指定值。
 * @method tintTo
 * @param {Number} duration
 * @param {Number} red 0-255
 * @param {Number} green  0-255
 * @param {Number} blue 0-255
 * @return {ActionInterval}
 * @example
 * // example
 * var action = cc.tintTo(2, 255, 0, 255);
 */

cc.tintTo = function (duration, red, green, blue) {
  return new cc.TintTo(duration, red, green, blue);
};
/* Tints a Node that implements the cc.NodeRGB protocol from current tint to a custom one.
 * Relative to their own color change.
 * @class TintBy
 * @extends ActionInterval
 * @param {Number} duration  duration in seconds
 * @param {Number} deltaRed
 * @param {Number} deltaGreen
 * @param {Number} deltaBlue
 * @example
 * var action = new cc.TintBy(2, -127, -255, -127);
 */


cc.TintBy = cc.Class({
  name: 'cc.TintBy',
  "extends": cc.ActionInterval,
  ctor: function ctor(duration, deltaRed, deltaGreen, deltaBlue) {
    this._deltaR = 0;
    this._deltaG = 0;
    this._deltaB = 0;
    this._fromR = 0;
    this._fromG = 0;
    this._fromB = 0;
    deltaBlue !== undefined && this.initWithDuration(duration, deltaRed, deltaGreen, deltaBlue);
  },

  /*
   * Initializes the action.
   * @param {Number} duration
   * @param {Number} deltaRed 0-255
   * @param {Number} deltaGreen 0-255
   * @param {Number} deltaBlue 0-255
   * @return {Boolean}
   */
  initWithDuration: function initWithDuration(duration, deltaRed, deltaGreen, deltaBlue) {
    if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
      this._deltaR = deltaRed;
      this._deltaG = deltaGreen;
      this._deltaB = deltaBlue;
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.TintBy();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration, this._deltaR, this._deltaG, this._deltaB);
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);
    var color = target.color;
    this._fromR = color.r;
    this._fromG = color.g;
    this._fromB = color.b;
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);
    this.target.color = cc.color(this._fromR + this._deltaR * dt, this._fromG + this._deltaG * dt, this._fromB + this._deltaB * dt);
  },
  reverse: function reverse() {
    var action = new cc.TintBy(this._duration, -this._deltaR, -this._deltaG, -this._deltaB);

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  }
});
/**
 * !#en
 * Tints a Node that implements the cc.NodeRGB protocol from current tint to a custom one.
 * Relative to their own color change.
 * !#zh 按照指定的增量修改颜色。
 * @method tintBy
 * @param {Number} duration  duration in seconds
 * @param {Number} deltaRed
 * @param {Number} deltaGreen
 * @param {Number} deltaBlue
 * @return {ActionInterval}
 * @example
 * // example
 * var action = cc.tintBy(2, -127, -255, -127);
 */

cc.tintBy = function (duration, deltaRed, deltaGreen, deltaBlue) {
  return new cc.TintBy(duration, deltaRed, deltaGreen, deltaBlue);
};
/* Delays the action a certain amount of seconds
 * @class DelayTime
 * @extends ActionInterval
 */


cc.DelayTime = cc.Class({
  name: 'cc.DelayTime',
  "extends": cc.ActionInterval,
  update: function update(dt) {},
  reverse: function reverse() {
    var action = new cc.DelayTime(this._duration);

    this._cloneDecoration(action);

    this._reverseEaseList(action);

    return action;
  },
  clone: function clone() {
    var action = new cc.DelayTime();

    this._cloneDecoration(action);

    action.initWithDuration(this._duration);
    return action;
  }
});
/**
 * !#en Delays the action a certain amount of seconds.
 * !#zh 延迟指定的时间量。
 * @method delayTime
 * @param {Number} d duration in seconds
 * @return {ActionInterval}
 * @example
 * // example
 * var delay = cc.delayTime(1);
 */

cc.delayTime = function (d) {
  return new cc.DelayTime(d);
};
/*
 * <p>
 * Executes an action in reverse order, from time=duration to time=0                                     <br/>
 * @warning Use this action carefully. This action is not sequenceable.                                 <br/>
 * Use it as the default "reversed" method of your own actions, but using it outside the "reversed"      <br/>
 * scope is not recommended.
 * </p>
 * @class ReverseTime
 * @extends ActionInterval
 * @param {FiniteTimeAction} action
 * @example
 *  var reverse = new cc.ReverseTime(this);
 */


cc.ReverseTime = cc.Class({
  name: 'cc.ReverseTime',
  "extends": cc.ActionInterval,
  ctor: function ctor(action) {
    this._other = null;
    action && this.initWithAction(action);
  },

  /*
   * @param {FiniteTimeAction} action
   * @return {Boolean}
   */
  initWithAction: function initWithAction(action) {
    if (!action) {
      cc.errorID(1028);
      return false;
    }

    if (action === this._other) {
      cc.errorID(1029);
      return false;
    }

    if (cc.ActionInterval.prototype.initWithDuration.call(this, action._duration)) {
      // Don't leak if action is reused
      this._other = action;
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.ReverseTime();

    this._cloneDecoration(action);

    action.initWithAction(this._other.clone());
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);

    this._other.startWithTarget(target);
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);
    if (this._other) this._other.update(1 - dt);
  },
  reverse: function reverse() {
    return this._other.clone();
  },
  stop: function stop() {
    this._other.stop();

    cc.Action.prototype.stop.call(this);
  }
});
/**
 * !#en Executes an action in reverse order, from time=duration to time=0.
 * !#zh 反转目标动作的时间轴。
 * @method reverseTime
 * @param {FiniteTimeAction} action
 * @return {ActionInterval}
 * @example
 * // example
 *  var reverse = cc.reverseTime(this);
 */

cc.reverseTime = function (action) {
  return new cc.ReverseTime(action);
};
/*
 * <p>
 * Overrides the target of an action so that it always runs on the target<br/>
 * specified at action creation rather than the one specified by runAction.
 * </p>
 * @class TargetedAction
 * @extends ActionInterval
 * @param {Node} target
 * @param {FiniteTimeAction} action
 */


cc.TargetedAction = cc.Class({
  name: 'cc.TargetedAction',
  "extends": cc.ActionInterval,
  ctor: function ctor(target, action) {
    this._action = null;
    this._forcedTarget = null;
    action && this.initWithTarget(target, action);
  },

  /*
   * Init an action with the specified action and forced target
   * @param {Node} target
   * @param {FiniteTimeAction} action
   * @return {Boolean}
   */
  initWithTarget: function initWithTarget(target, action) {
    if (this.initWithDuration(action._duration)) {
      this._forcedTarget = target;
      this._action = action;
      return true;
    }

    return false;
  },
  clone: function clone() {
    var action = new cc.TargetedAction();

    this._cloneDecoration(action);

    action.initWithTarget(this._forcedTarget, this._action.clone());
    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);

    this._action.startWithTarget(this._forcedTarget);
  },
  stop: function stop() {
    this._action.stop();
  },
  update: function update(dt) {
    dt = this._computeEaseTime(dt);

    this._action.update(dt);
  },

  /*
   * return the target that the action will be forced to run with
   * @return {Node}
   */
  getForcedTarget: function getForcedTarget() {
    return this._forcedTarget;
  },

  /*
   * set the target that the action will be forced to run with
   * @param {Node} forcedTarget
   */
  setForcedTarget: function setForcedTarget(forcedTarget) {
    if (this._forcedTarget !== forcedTarget) this._forcedTarget = forcedTarget;
  }
});
/**
 * !#en Create an action with the specified action and forced target.
 * !#zh 用已有动作和一个新的目标节点创建动作。
 * @method targetedAction
 * @param {Node} target
 * @param {FiniteTimeAction} action
 * @return {ActionInterval}
 */

cc.targetedAction = function (target, action) {
  return new cc.TargetedAction(target, action);
};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDQWN0aW9uSW50ZXJ2YWwuanMiXSwibmFtZXMiOlsiY2MiLCJBY3Rpb25JbnRlcnZhbCIsIkNsYXNzIiwibmFtZSIsIkZpbml0ZVRpbWVBY3Rpb24iLCJjdG9yIiwiZCIsIk1BWF9WQUxVRSIsIl9lbGFwc2VkIiwiX2ZpcnN0VGljayIsIl9lYXNlTGlzdCIsIl9zcGVlZCIsIl90aW1lc0ZvclJlcGVhdCIsIl9yZXBlYXRGb3JldmVyIiwiX3JlcGVhdE1ldGhvZCIsIl9zcGVlZE1ldGhvZCIsInVuZGVmaW5lZCIsInByb3RvdHlwZSIsImluaXRXaXRoRHVyYXRpb24iLCJjYWxsIiwiZ2V0RWxhcHNlZCIsIl9kdXJhdGlvbiIsIm1hY3JvIiwiRkxUX0VQU0lMT04iLCJpc0RvbmUiLCJfY2xvbmVEZWNvcmF0aW9uIiwiYWN0aW9uIiwiX3JldmVyc2VFYXNlTGlzdCIsImkiLCJsZW5ndGgiLCJwdXNoIiwicmV2ZXJzZSIsImNsb25lIiwiZWFzaW5nIiwiZWFzZU9iaiIsImFyZ3VtZW50cyIsIl9jb21wdXRlRWFzZVRpbWUiLCJkdCIsImxvY0xpc3QiLCJuIiwic3RlcCIsInQiLCJ1cGRhdGUiLCJzdGFydFdpdGhUYXJnZXQiLCJ0YXJnZXQiLCJBY3Rpb24iLCJsb2dJRCIsInNldEFtcGxpdHVkZVJhdGUiLCJhbXAiLCJnZXRBbXBsaXR1ZGVSYXRlIiwic3BlZWQiLCJnZXRTcGVlZCIsInNldFNwZWVkIiwicmVwZWF0IiwidGltZXMiLCJNYXRoIiwicm91bmQiLCJpc05hTiIsInJlcGVhdEZvcmV2ZXIiLCJhY3Rpb25JbnRlcnZhbCIsIlNlcXVlbmNlIiwidGVtcEFycmF5IiwiX2FjdGlvbnMiLCJfc3BsaXQiLCJfbGFzdCIsIl9yZXZlcnNlZCIsInBhcmFtQXJyYXkiLCJBcnJheSIsImVycm9ySUQiLCJsYXN0IiwicHJldiIsImFjdGlvbjEiLCJfYWN0aW9uT25lVHdvIiwiaW5pdFdpdGhUd29BY3Rpb25zIiwiYWN0aW9uT25lIiwiYWN0aW9uVHdvIiwiZHVyYXRpb25PbmUiLCJkdXJhdGlvblR3byIsInN0b3AiLCJuZXdfdCIsImZvdW5kIiwibG9jU3BsaXQiLCJsb2NBY3Rpb25zIiwibG9jTGFzdCIsImFjdGlvbkZvdW5kIiwic2VxdWVuY2UiLCJyZXN1bHQiLCJSZXBlYXQiLCJfdGltZXMiLCJfdG90YWwiLCJfbmV4dER0IiwiX2FjdGlvbkluc3RhbnQiLCJfaW5uZXJBY3Rpb24iLCJpbml0V2l0aEFjdGlvbiIsImR1cmF0aW9uIiwiQWN0aW9uSW5zdGFudCIsImxvY0lubmVyQWN0aW9uIiwibG9jRHVyYXRpb24iLCJsb2NUaW1lcyIsImxvY05leHREdCIsInNldElubmVyQWN0aW9uIiwiZ2V0SW5uZXJBY3Rpb24iLCJSZXBlYXRGb3JldmVyIiwiU3Bhd24iLCJfb25lIiwiX3R3byIsImFjdGlvbjIiLCJyZXQiLCJkMSIsImQyIiwibWF4IiwiZGVsYXlUaW1lIiwic3Bhd24iLCJwU3Bhd24iLCJSb3RhdGVUbyIsImRzdEFuZ2xlIiwiX3N0YXJ0QW5nbGUiLCJfZHN0QW5nbGUiLCJfYW5nbGUiLCJzdGFydEFuZ2xlIiwiYW5nbGUiLCJST1RBVEVfQUNUSU9OX0NDVyIsInJvdGF0ZVRvIiwiUm90YXRlQnkiLCJkZWx0YUFuZ2xlIiwiX2RlbHRhQW5nbGUiLCJyb3RhdGVCeSIsIk1vdmVCeSIsImRlbHRhUG9zIiwiZGVsdGFZIiwiX3Bvc2l0aW9uRGVsdGEiLCJ2MiIsIl9zdGFydFBvc2l0aW9uIiwiX3ByZXZpb3VzUG9zaXRpb24iLCJwb3NpdGlvbiIsInkiLCJ4IiwibG9jUG9zWCIsImxvY1Bvc1kiLCJsb2NTdGFydFBvc2l0aW9uIiwiRU5BQkxFX1NUQUNLQUJMRV9BQ1RJT05TIiwidGFyZ2V0WCIsInRhcmdldFkiLCJsb2NQcmV2aW91c1Bvc2l0aW9uIiwic2V0UG9zaXRpb24iLCJtb3ZlQnkiLCJNb3ZlVG8iLCJfZW5kUG9zaXRpb24iLCJtb3ZlVG8iLCJTa2V3VG8iLCJzeCIsInN5IiwiX3NrZXdYIiwiX3NrZXdZIiwiX3N0YXJ0U2tld1giLCJfc3RhcnRTa2V3WSIsIl9lbmRTa2V3WCIsIl9lbmRTa2V3WSIsIl9kZWx0YVgiLCJfZGVsdGFZIiwic2tld1giLCJza2V3WSIsInNrZXdUbyIsIlNrZXdCeSIsImRlbHRhU2tld1giLCJkZWx0YVNrZXdZIiwic2tld0J5IiwiSnVtcEJ5IiwiaGVpZ2h0IiwianVtcHMiLCJfZGVsdGEiLCJfaGVpZ2h0IiwiX2p1bXBzIiwiZnJhYyIsImp1bXBCeSIsIkp1bXBUbyIsImp1bXBUbyIsImJlemllckF0IiwiYSIsImIiLCJjIiwicG93IiwiQmV6aWVyQnkiLCJfY29uZmlnIiwibmV3Q29uZmlncyIsInNlbENvbmYiLCJsb2NDb25maWciLCJ4YSIsInhiIiwieGMiLCJ4ZCIsInlhIiwieWIiLCJ5YyIsInlkIiwieDAiLCJ5MCIsIngxIiwieTEiLCJ4MiIsInkyIiwiciIsImJlemllckJ5IiwiQmV6aWVyVG8iLCJfdG9Db25maWciLCJsb2NTdGFydFBvcyIsImxvY1RvQ29uZmlnIiwic3ViIiwiYmV6aWVyVG8iLCJTY2FsZVRvIiwiX3NjYWxlWCIsIl9zY2FsZVkiLCJfc3RhcnRTY2FsZVgiLCJfc3RhcnRTY2FsZVkiLCJfZW5kU2NhbGVYIiwiX2VuZFNjYWxlWSIsInNjYWxlWCIsInNjYWxlWSIsInNjYWxlVG8iLCJTY2FsZUJ5Iiwic2NhbGVCeSIsIkJsaW5rIiwiYmxpbmtzIiwiX29yaWdpbmFsU3RhdGUiLCJzbGljZSIsIm0iLCJvcGFjaXR5IiwiYmxpbmsiLCJGYWRlVG8iLCJfdG9PcGFjaXR5IiwiX2Zyb21PcGFjaXR5IiwidGltZSIsImZyb21PcGFjaXR5IiwiZmFkZVRvIiwiRmFkZUluIiwiX3JldmVyc2VBY3Rpb24iLCJGYWRlT3V0IiwiZmFkZUluIiwiZmFkZU91dCIsIlRpbnRUbyIsInJlZCIsImdyZWVuIiwiYmx1ZSIsIl90byIsImNvbG9yIiwiX2Zyb20iLCJDb2xvciIsImciLCJsb2NUbyIsImxvY0Zyb20iLCJ0aW50VG8iLCJUaW50QnkiLCJkZWx0YVJlZCIsImRlbHRhR3JlZW4iLCJkZWx0YUJsdWUiLCJfZGVsdGFSIiwiX2RlbHRhRyIsIl9kZWx0YUIiLCJfZnJvbVIiLCJfZnJvbUciLCJfZnJvbUIiLCJ0aW50QnkiLCJEZWxheVRpbWUiLCJSZXZlcnNlVGltZSIsIl9vdGhlciIsInJldmVyc2VUaW1lIiwiVGFyZ2V0ZWRBY3Rpb24iLCJfYWN0aW9uIiwiX2ZvcmNlZFRhcmdldCIsImluaXRXaXRoVGFyZ2V0IiwiZ2V0Rm9yY2VkVGFyZ2V0Iiwic2V0Rm9yY2VkVGFyZ2V0IiwiZm9yY2VkVGFyZ2V0IiwidGFyZ2V0ZWRBY3Rpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEJBOzs7O0FBSUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCQUEsRUFBRSxDQUFDQyxjQUFILEdBQW9CRCxFQUFFLENBQUNFLEtBQUgsQ0FBUztBQUN6QkMsRUFBQUEsSUFBSSxFQUFFLG1CQURtQjtBQUV6QixhQUFTSCxFQUFFLENBQUNJLGdCQUZhO0FBSXpCQyxFQUFBQSxJQUFJLEVBQUMsY0FBVUMsQ0FBVixFQUFhO0FBQ2QsU0FBS0MsU0FBTCxHQUFpQixDQUFqQjtBQUNBLFNBQUtDLFFBQUwsR0FBZ0IsQ0FBaEI7QUFDQSxTQUFLQyxVQUFMLEdBQWtCLEtBQWxCO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQixJQUFqQjtBQUNBLFNBQUtDLE1BQUwsR0FBYyxDQUFkO0FBQ0EsU0FBS0MsZUFBTCxHQUF1QixDQUF2QjtBQUNBLFNBQUtDLGNBQUwsR0FBc0IsS0FBdEI7QUFDQSxTQUFLQyxhQUFMLEdBQXFCLEtBQXJCLENBUmMsQ0FRYTs7QUFDM0IsU0FBS0MsWUFBTCxHQUFvQixLQUFwQixDQVRjLENBU1k7O0FBQzFCVCxJQUFBQSxDQUFDLEtBQUtVLFNBQU4sSUFBbUJoQixFQUFFLENBQUNDLGNBQUgsQ0FBa0JnQixTQUFsQixDQUE0QkMsZ0JBQTVCLENBQTZDQyxJQUE3QyxDQUFrRCxJQUFsRCxFQUF3RGIsQ0FBeEQsQ0FBbkI7QUFDSCxHQWZ3Qjs7QUFpQnpC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QXFCSSxZQUFyQjtBQUNQO0FBN0R3QixDQUFULENBQXBCO0FBZ0VBOzs7Ozs7Ozs7QUFRQWhSLEVBQUUsQ0FBQ2lSLGNBQUgsR0FBb0IsVUFBVXJPLE1BQVYsRUFBa0JsQixNQUFsQixFQUEwQjtBQUMxQyxTQUFPLElBQUkxQixFQUFFLENBQUMwUSxjQUFQLENBQXNCOU4sTUFBdEIsRUFBOEJsQixNQUE5QixDQUFQO0FBQ0gsQ0FGRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDA4LTIwMTAgUmljYXJkbyBRdWVzYWRhXG4gQ29weXJpZ2h0IChjKSAyMDExLTIwMTIgY29jb3MyZC14Lm9yZ1xuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHA6Ly93d3cuY29jb3MyZC14Lm9yZ1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4vKipcbiAqIEBtb2R1bGUgY2NcbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIDxwPiBBbiBpbnRlcnZhbCBhY3Rpb24gaXMgYW4gYWN0aW9uIHRoYXQgdGFrZXMgcGxhY2Ugd2l0aGluIGEgY2VydGFpbiBwZXJpb2Qgb2YgdGltZS4gPGJyLz5cbiAqIEl0IGhhcyBhbiBzdGFydCB0aW1lLCBhbmQgYSBmaW5pc2ggdGltZS4gVGhlIGZpbmlzaCB0aW1lIGlzIHRoZSBwYXJhbWV0ZXI8YnIvPlxuICogZHVyYXRpb24gcGx1cyB0aGUgc3RhcnQgdGltZS48L3A+XG4gKlxuICogPHA+VGhlc2UgQ0NBY3Rpb25JbnRlcnZhbCBhY3Rpb25zIGhhdmUgc29tZSBpbnRlcmVzdGluZyBwcm9wZXJ0aWVzLCBsaWtlOjxici8+XG4gKiAtIFRoZXkgY2FuIHJ1biBub3JtYWxseSAoZGVmYXVsdCkgIDxici8+XG4gKiAtIFRoZXkgY2FuIHJ1biByZXZlcnNlZCB3aXRoIHRoZSByZXZlcnNlIG1ldGhvZCAgIDxici8+XG4gKiAtIFRoZXkgY2FuIHJ1biB3aXRoIHRoZSB0aW1lIGFsdGVyZWQgd2l0aCB0aGUgQWNjZWxlcmF0ZSwgQWNjZWxEZWNjZWwgYW5kIFNwZWVkIGFjdGlvbnMuIDwvcD5cbiAqXG4gKiA8cD5Gb3IgZXhhbXBsZSwgeW91IGNhbiBzaW11bGF0ZSBhIFBpbmcgUG9uZyBlZmZlY3QgcnVubmluZyB0aGUgYWN0aW9uIG5vcm1hbGx5IGFuZDxici8+XG4gKiB0aGVuIHJ1bm5pbmcgaXQgYWdhaW4gaW4gUmV2ZXJzZSBtb2RlLiA8L3A+XG4gKiAhI3poIOaXtumXtOmXtOmalOWKqOS9nO+8jOi/meenjeWKqOS9nOWcqOW3suWumuaXtumXtOWGheWujOaIkO+8jOe7p+aJvyBGaW5pdGVUaW1lQWN0aW9u44CCXG4gKiBAY2xhc3MgQWN0aW9uSW50ZXJ2YWxcbiAqIEBleHRlbmRzIEZpbml0ZVRpbWVBY3Rpb25cbiAqIEBwYXJhbSB7TnVtYmVyfSBkIGR1cmF0aW9uIGluIHNlY29uZHNcbiAqL1xuY2MuQWN0aW9uSW50ZXJ2YWwgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLkFjdGlvbkludGVydmFsJyxcbiAgICBleHRlbmRzOiBjYy5GaW5pdGVUaW1lQWN0aW9uLFxuXG4gICAgY3RvcjpmdW5jdGlvbiAoZCkge1xuICAgICAgICB0aGlzLk1BWF9WQUxVRSA9IDI7XG4gICAgICAgIHRoaXMuX2VsYXBzZWQgPSAwO1xuICAgICAgICB0aGlzLl9maXJzdFRpY2sgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fZWFzZUxpc3QgPSBudWxsO1xuICAgICAgICB0aGlzLl9zcGVlZCA9IDE7XG4gICAgICAgIHRoaXMuX3RpbWVzRm9yUmVwZWF0ID0gMTtcbiAgICAgICAgdGhpcy5fcmVwZWF0Rm9yZXZlciA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9yZXBlYXRNZXRob2QgPSBmYWxzZTsvL0NvbXBhdGlibGUgd2l0aCByZXBlYXQgY2xhc3MsIERpc2NhcmQgYWZ0ZXIgY2FuIGJlIGRlbGV0ZWRcbiAgICAgICAgdGhpcy5fc3BlZWRNZXRob2QgPSBmYWxzZTsvL0NvbXBhdGlibGUgd2l0aCByZXBlYXQgY2xhc3MsIERpc2NhcmQgYWZ0ZXIgY2FuIGJlIGRlbGV0ZWRcbiAgICAgICAgZCAhPT0gdW5kZWZpbmVkICYmIGNjLkFjdGlvbkludGVydmFsLnByb3RvdHlwZS5pbml0V2l0aER1cmF0aW9uLmNhbGwodGhpcywgZCk7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogSG93IG1hbnkgc2Vjb25kcyBoYWQgZWxhcHNlZCBzaW5jZSB0aGUgYWN0aW9ucyBzdGFydGVkIHRvIHJ1bi5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0RWxhcHNlZDpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9lbGFwc2VkO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIEluaXRpYWxpemVzIHRoZSBhY3Rpb24uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGQgZHVyYXRpb24gaW4gc2Vjb25kc1xuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaW5pdFdpdGhEdXJhdGlvbjpmdW5jdGlvbiAoZCkge1xuICAgICAgICB0aGlzLl9kdXJhdGlvbiA9IChkID09PSAwKSA/IGNjLm1hY3JvLkZMVF9FUFNJTE9OIDogZDtcbiAgICAgICAgLy8gcHJldmVudCBkaXZpc2lvbiBieSAwXG4gICAgICAgIC8vIFRoaXMgY29tcGFyaXNvbiBjb3VsZCBiZSBpbiBzdGVwOiwgYnV0IGl0IG1pZ2h0IGRlY3JlYXNlIHRoZSBwZXJmb3JtYW5jZVxuICAgICAgICAvLyBieSAzJSBpbiBoZWF2eSBiYXNlZCBhY3Rpb24gZ2FtZXMuXG4gICAgICAgIHRoaXMuX2VsYXBzZWQgPSAwO1xuICAgICAgICB0aGlzLl9maXJzdFRpY2sgPSB0cnVlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgaXNEb25lOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLl9lbGFwc2VkID49IHRoaXMuX2R1cmF0aW9uKTtcbiAgICB9LFxuXG4gICAgX2Nsb25lRGVjb3JhdGlvbjogZnVuY3Rpb24oYWN0aW9uKXtcbiAgICAgICAgYWN0aW9uLl9yZXBlYXRGb3JldmVyID0gdGhpcy5fcmVwZWF0Rm9yZXZlcjtcbiAgICAgICAgYWN0aW9uLl9zcGVlZCA9IHRoaXMuX3NwZWVkO1xuICAgICAgICBhY3Rpb24uX3RpbWVzRm9yUmVwZWF0ID0gdGhpcy5fdGltZXNGb3JSZXBlYXQ7XG4gICAgICAgIGFjdGlvbi5fZWFzZUxpc3QgPSB0aGlzLl9lYXNlTGlzdDtcbiAgICAgICAgYWN0aW9uLl9zcGVlZE1ldGhvZCA9IHRoaXMuX3NwZWVkTWV0aG9kO1xuICAgICAgICBhY3Rpb24uX3JlcGVhdE1ldGhvZCA9IHRoaXMuX3JlcGVhdE1ldGhvZDtcbiAgICB9LFxuXG4gICAgX3JldmVyc2VFYXNlTGlzdDogZnVuY3Rpb24oYWN0aW9uKXtcbiAgICAgICAgaWYodGhpcy5fZWFzZUxpc3Qpe1xuICAgICAgICAgICAgYWN0aW9uLl9lYXNlTGlzdCA9IFtdO1xuICAgICAgICAgICAgZm9yKHZhciBpPTA7IGk8dGhpcy5fZWFzZUxpc3QubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIGFjdGlvbi5fZWFzZUxpc3QucHVzaCh0aGlzLl9lYXNlTGlzdFtpXS5yZXZlcnNlKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGNsb25lOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5BY3Rpb25JbnRlcnZhbCh0aGlzLl9kdXJhdGlvbik7XG4gICAgICAgIHRoaXMuX2Nsb25lRGVjb3JhdGlvbihhY3Rpb24pO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEltcGxlbWVudGF0aW9uIG9mIGVhc2UgbW90aW9uLlxuICAgICAqICEjemgg57yT5Yqo6L+Q5Yqo44CCXG4gICAgICogQG1ldGhvZCBlYXNpbmdcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZWFzZU9ialxuICAgICAqIEByZXR1cm5zIHtBY3Rpb25JbnRlcnZhbH1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGFjdGlvbi5lYXNpbmcoY2MuZWFzZUluKDMuMCkpO1xuICAgICAqL1xuICAgIGVhc2luZzogZnVuY3Rpb24gKGVhc2VPYmopIHtcbiAgICAgICAgaWYgKHRoaXMuX2Vhc2VMaXN0KVxuICAgICAgICAgICAgdGhpcy5fZWFzZUxpc3QubGVuZ3RoID0gMDtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy5fZWFzZUxpc3QgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICB0aGlzLl9lYXNlTGlzdC5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBfY29tcHV0ZUVhc2VUaW1lOiBmdW5jdGlvbiAoZHQpIHtcbiAgICAgICAgdmFyIGxvY0xpc3QgPSB0aGlzLl9lYXNlTGlzdDtcbiAgICAgICAgaWYgKCghbG9jTGlzdCkgfHwgKGxvY0xpc3QubGVuZ3RoID09PSAwKSlcbiAgICAgICAgICAgIHJldHVybiBkdDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSBsb2NMaXN0Lmxlbmd0aDsgaSA8IG47IGkrKylcbiAgICAgICAgICAgIGR0ID0gbG9jTGlzdFtpXS5lYXNpbmcoZHQpO1xuICAgICAgICByZXR1cm4gZHQ7XG4gICAgfSxcblxuICAgIHN0ZXA6ZnVuY3Rpb24gKGR0KSB7XG4gICAgICAgIGlmICh0aGlzLl9maXJzdFRpY2spIHtcbiAgICAgICAgICAgIHRoaXMuX2ZpcnN0VGljayA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5fZWxhcHNlZCA9IDA7XG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgdGhpcy5fZWxhcHNlZCArPSBkdDtcblxuICAgICAgICAvL3RoaXMudXBkYXRlKCgxID4gKHRoaXMuX2VsYXBzZWQgLyB0aGlzLl9kdXJhdGlvbikpID8gdGhpcy5fZWxhcHNlZCAvIHRoaXMuX2R1cmF0aW9uIDogMSk7XG4gICAgICAgIC8vdGhpcy51cGRhdGUoTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgdGhpcy5fZWxhcHNlZCAvIE1hdGgubWF4KHRoaXMuX2R1cmF0aW9uLCBjYy5tYWNyby5GTFRfRVBTSUxPTikpKSk7XG4gICAgICAgIHZhciB0ID0gdGhpcy5fZWxhcHNlZCAvICh0aGlzLl9kdXJhdGlvbiA+IDAuMDAwMDAwMTE5MjA5Mjg5NiA/IHRoaXMuX2R1cmF0aW9uIDogMC4wMDAwMDAxMTkyMDkyODk2KTtcbiAgICAgICAgdCA9ICgxID4gdCA/IHQgOiAxKTtcbiAgICAgICAgdGhpcy51cGRhdGUodCA+IDAgPyB0IDogMCk7XG5cbiAgICAgICAgLy9Db21wYXRpYmxlIHdpdGggcmVwZWF0IGNsYXNzLCBEaXNjYXJkIGFmdGVyIGNhbiBiZSBkZWxldGVkICh0aGlzLl9yZXBlYXRNZXRob2QpXG4gICAgICAgIGlmKHRoaXMuX3JlcGVhdE1ldGhvZCAmJiB0aGlzLl90aW1lc0ZvclJlcGVhdCA+IDEgJiYgdGhpcy5pc0RvbmUoKSl7XG4gICAgICAgICAgICBpZighdGhpcy5fcmVwZWF0Rm9yZXZlcil7XG4gICAgICAgICAgICAgICAgdGhpcy5fdGltZXNGb3JSZXBlYXQtLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vdmFyIGRpZmYgPSBsb2NJbm5lckFjdGlvbi5nZXRFbGFwc2VkKCkgLSBsb2NJbm5lckFjdGlvbi5fZHVyYXRpb247XG4gICAgICAgICAgICB0aGlzLnN0YXJ0V2l0aFRhcmdldCh0aGlzLnRhcmdldCk7XG4gICAgICAgICAgICAvLyB0byBwcmV2ZW50IGplcmsuIGlzc3VlICMzOTAgLDEyNDdcbiAgICAgICAgICAgIC8vdGhpcy5faW5uZXJBY3Rpb24uc3RlcCgwKTtcbiAgICAgICAgICAgIC8vdGhpcy5faW5uZXJBY3Rpb24uc3RlcChkaWZmKTtcbiAgICAgICAgICAgIHRoaXMuc3RlcCh0aGlzLl9lbGFwc2VkIC0gdGhpcy5fZHVyYXRpb24pO1xuXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RhcnRXaXRoVGFyZ2V0OmZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgY2MuQWN0aW9uLnByb3RvdHlwZS5zdGFydFdpdGhUYXJnZXQuY2FsbCh0aGlzLCB0YXJnZXQpO1xuICAgICAgICB0aGlzLl9lbGFwc2VkID0gMDtcbiAgICAgICAgdGhpcy5fZmlyc3RUaWNrID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgcmV2ZXJzZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmxvZ0lEKDEwMTApO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBTZXQgYW1wbGl0dWRlIHJhdGUuXG4gICAgICogQHdhcm5pbmcgSXQgc2hvdWxkIGJlIG92ZXJyaWRkZW4gaW4gc3ViY2xhc3MuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGFtcFxuICAgICAqL1xuICAgIHNldEFtcGxpdHVkZVJhdGU6ZnVuY3Rpb24gKGFtcCkge1xuICAgICAgICAvLyBBYnN0cmFjdCBjbGFzcyBuZWVkcyBpbXBsZW1lbnRhdGlvblxuICAgICAgICBjYy5sb2dJRCgxMDExKTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBHZXQgYW1wbGl0dWRlIHJhdGUuXG4gICAgICogQHdhcm5pbmcgSXQgc2hvdWxkIGJlIG92ZXJyaWRkZW4gaW4gc3ViY2xhc3MuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSAwXG4gICAgICovXG4gICAgZ2V0QW1wbGl0dWRlUmF0ZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIEFic3RyYWN0IGNsYXNzIG5lZWRzIGltcGxlbWVudGF0aW9uXG4gICAgICAgIGNjLmxvZ0lEKDEwMTIpO1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIENoYW5nZXMgdGhlIHNwZWVkIG9mIGFuIGFjdGlvbiwgbWFraW5nIGl0IHRha2UgbG9uZ2VyIChzcGVlZD4xKVxuICAgICAqIG9yIGxlc3MgKHNwZWVkPDEpIHRpbWUuIDxici8+XG4gICAgICogVXNlZnVsIHRvIHNpbXVsYXRlICdzbG93IG1vdGlvbicgb3IgJ2Zhc3QgZm9yd2FyZCcgZWZmZWN0LlxuICAgICAqICEjemhcbiAgICAgKiDmlLnlj5jkuIDkuKrliqjkvZznmoTpgJ/luqbvvIzkvb/lroPnmoTmiafooYzkvb/nlKjmm7Tplb/nmoTml7bpl7TvvIhzcGVlZCA+IDHvvIk8YnIvPlxuICAgICAqIOaIluabtOWwke+8iHNwZWVkIDwgMe+8ieWPr+S7peacieaViOW+l+aooeaLn+KAnOaFouWKqOS9nOKAneaIluKAnOW/q+i/m+KAneeahOaViOaenOOAglxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzcGVlZFxuICAgICAqIEByZXR1cm5zIHtBY3Rpb259XG4gICAgICovXG4gICAgc3BlZWQ6IGZ1bmN0aW9uKHNwZWVkKXtcbiAgICAgICAgaWYoc3BlZWQgPD0gMCl7XG4gICAgICAgICAgICBjYy5sb2dJRCgxMDEzKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fc3BlZWRNZXRob2QgPSB0cnVlOy8vQ29tcGF0aWJsZSB3aXRoIHJlcGVhdCBjbGFzcywgRGlzY2FyZCBhZnRlciBjYW4gYmUgZGVsZXRlZFxuICAgICAgICB0aGlzLl9zcGVlZCAqPSBzcGVlZDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCB0aGlzIGFjdGlvbiBzcGVlZC5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0U3BlZWQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9zcGVlZDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IHRoaXMgYWN0aW9uIHNwZWVkLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzcGVlZFxuICAgICAqIEByZXR1cm5zIHtBY3Rpb25JbnRlcnZhbH1cbiAgICAgKi9cbiAgICBzZXRTcGVlZDogZnVuY3Rpb24oc3BlZWQpe1xuICAgICAgICB0aGlzLl9zcGVlZCA9IHNwZWVkO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJlcGVhdHMgYW4gYWN0aW9uIGEgbnVtYmVyIG9mIHRpbWVzLlxuICAgICAqIFRvIHJlcGVhdCBhbiBhY3Rpb24gZm9yZXZlciB1c2UgdGhlIENDUmVwZWF0Rm9yZXZlciBhY3Rpb24uXG4gICAgICogISN6aCDph43lpI3liqjkvZzlj6/ku6XmjInkuIDlrprmrKHmlbDph43lpI3kuIDkuKrliqjkvZzvvIzkvb/nlKggUmVwZWF0Rm9yZXZlciDliqjkvZzmnaXmsLjov5zph43lpI3kuIDkuKrliqjkvZzjgIJcbiAgICAgKiBAbWV0aG9kIHJlcGVhdFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lc1xuICAgICAqIEByZXR1cm5zIHtBY3Rpb25JbnRlcnZhbH1cbiAgICAgKi9cbiAgICByZXBlYXQ6IGZ1bmN0aW9uKHRpbWVzKXtcbiAgICAgICAgdGltZXMgPSBNYXRoLnJvdW5kKHRpbWVzKTtcbiAgICAgICAgaWYoaXNOYU4odGltZXMpIHx8IHRpbWVzIDwgMSl7XG4gICAgICAgICAgICBjYy5sb2dJRCgxMDE0KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3JlcGVhdE1ldGhvZCA9IHRydWU7Ly9Db21wYXRpYmxlIHdpdGggcmVwZWF0IGNsYXNzLCBEaXNjYXJkIGFmdGVyIGNhbiBiZSBkZWxldGVkXG4gICAgICAgIHRoaXMuX3RpbWVzRm9yUmVwZWF0ICo9IHRpbWVzO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJlcGVhdHMgYW4gYWN0aW9uIGZvciBldmVyLiAgPGJyLz5cbiAgICAgKiBUbyByZXBlYXQgdGhlIGFuIGFjdGlvbiBmb3IgYSBsaW1pdGVkIG51bWJlciBvZiB0aW1lcyB1c2UgdGhlIFJlcGVhdCBhY3Rpb24uIDxici8+XG4gICAgICogISN6aCDmsLjov5zlnLDph43lpI3kuIDkuKrliqjkvZzvvIzmnInpmZDmrKHmlbDlhoXph43lpI3kuIDkuKrliqjkvZzor7fkvb/nlKggUmVwZWF0IOWKqOS9nOOAglxuICAgICAqIEBtZXRob2QgcmVwZWF0Rm9yZXZlclxuICAgICAqIEByZXR1cm5zIHtBY3Rpb25JbnRlcnZhbH1cbiAgICAgKi9cbiAgICByZXBlYXRGb3JldmVyOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLl9yZXBlYXRNZXRob2QgPSB0cnVlOy8vQ29tcGF0aWJsZSB3aXRoIHJlcGVhdCBjbGFzcywgRGlzY2FyZCBhZnRlciBjYW4gYmUgZGVsZXRlZFxuICAgICAgICB0aGlzLl90aW1lc0ZvclJlcGVhdCA9IHRoaXMuTUFYX1ZBTFVFO1xuICAgICAgICB0aGlzLl9yZXBlYXRGb3JldmVyID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufSk7XG5cbmNjLmFjdGlvbkludGVydmFsID0gZnVuY3Rpb24gKGQpIHtcbiAgICByZXR1cm4gbmV3IGNjLkFjdGlvbkludGVydmFsKGQpO1xufTtcblxuLyoqXG4gKiBAbW9kdWxlIGNjXG4gKi9cblxuLypcbiAqIFJ1bnMgYWN0aW9ucyBzZXF1ZW50aWFsbHksIG9uZSBhZnRlciBhbm90aGVyLlxuICogQGNsYXNzIFNlcXVlbmNlXG4gKiBAZXh0ZW5kcyBBY3Rpb25JbnRlcnZhbFxuICogQHBhcmFtIHtBcnJheXxGaW5pdGVUaW1lQWN0aW9ufSB0ZW1wQXJyYXlcbiAqIEBleGFtcGxlXG4gKiAvLyBjcmVhdGUgc2VxdWVuY2Ugd2l0aCBhY3Rpb25zXG4gKiB2YXIgc2VxID0gbmV3IGNjLlNlcXVlbmNlKGFjdDEsIGFjdDIpO1xuICpcbiAqIC8vIGNyZWF0ZSBzZXF1ZW5jZSB3aXRoIGFycmF5XG4gKiB2YXIgc2VxID0gbmV3IGNjLlNlcXVlbmNlKGFjdEFycmF5KTtcbiAqL1xuY2MuU2VxdWVuY2UgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlNlcXVlbmNlJyxcbiAgICBleHRlbmRzOiBjYy5BY3Rpb25JbnRlcnZhbCxcblxuICAgIGN0b3I6ZnVuY3Rpb24gKHRlbXBBcnJheSkge1xuICAgICAgICB0aGlzLl9hY3Rpb25zID0gW107XG4gICAgICAgIHRoaXMuX3NwbGl0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fbGFzdCA9IDA7XG4gICAgICAgIHRoaXMuX3JldmVyc2VkID0gZmFsc2U7XG5cbiAgICAgICAgdmFyIHBhcmFtQXJyYXkgPSAodGVtcEFycmF5IGluc3RhbmNlb2YgQXJyYXkpID8gdGVtcEFycmF5IDogYXJndW1lbnRzO1xuICAgICAgICBpZiAocGFyYW1BcnJheS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIGNjLmVycm9ySUQoMTAxOSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxhc3QgPSBwYXJhbUFycmF5Lmxlbmd0aCAtIDE7XG4gICAgICAgIGlmICgobGFzdCA+PSAwKSAmJiAocGFyYW1BcnJheVtsYXN0XSA9PSBudWxsKSlcbiAgICAgICAgICAgIGNjLmxvZ0lEKDEwMTUpO1xuXG4gICAgICAgIGlmIChsYXN0ID49IDApIHtcbiAgICAgICAgICAgIHZhciBwcmV2ID0gcGFyYW1BcnJheVswXSwgYWN0aW9uMTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgbGFzdDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcmFtQXJyYXlbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uMSA9IHByZXY7XG4gICAgICAgICAgICAgICAgICAgIHByZXYgPSBjYy5TZXF1ZW5jZS5fYWN0aW9uT25lVHdvKGFjdGlvbjEsIHBhcmFtQXJyYXlbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaW5pdFdpdGhUd29BY3Rpb25zKHByZXYsIHBhcmFtQXJyYXlbbGFzdF0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogSW5pdGlhbGl6ZXMgdGhlIGFjdGlvbiA8YnIvPlxuICAgICAqIEBwYXJhbSB7RmluaXRlVGltZUFjdGlvbn0gYWN0aW9uT25lXG4gICAgICogQHBhcmFtIHtGaW5pdGVUaW1lQWN0aW9ufSBhY3Rpb25Ud29cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGluaXRXaXRoVHdvQWN0aW9uczpmdW5jdGlvbiAoYWN0aW9uT25lLCBhY3Rpb25Ud28pIHtcbiAgICAgICAgaWYgKCFhY3Rpb25PbmUgfHwgIWFjdGlvblR3bykge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgxMDI1KTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkdXJhdGlvbk9uZSA9IGFjdGlvbk9uZS5fZHVyYXRpb24sIGR1cmF0aW9uVHdvID0gYWN0aW9uVHdvLl9kdXJhdGlvbjtcbiAgICAgICAgZHVyYXRpb25PbmUgKj0gYWN0aW9uT25lLl9yZXBlYXRNZXRob2QgPyBhY3Rpb25PbmUuX3RpbWVzRm9yUmVwZWF0IDogMTtcbiAgICAgICAgZHVyYXRpb25Ud28gKj0gYWN0aW9uVHdvLl9yZXBlYXRNZXRob2QgPyBhY3Rpb25Ud28uX3RpbWVzRm9yUmVwZWF0IDogMTtcbiAgICAgICAgdmFyIGQgPSBkdXJhdGlvbk9uZSArIGR1cmF0aW9uVHdvO1xuICAgICAgICB0aGlzLmluaXRXaXRoRHVyYXRpb24oZCk7XG5cbiAgICAgICAgdGhpcy5fYWN0aW9uc1swXSA9IGFjdGlvbk9uZTtcbiAgICAgICAgdGhpcy5fYWN0aW9uc1sxXSA9IGFjdGlvblR3bztcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIGNsb25lOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5TZXF1ZW5jZSgpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoVHdvQWN0aW9ucyh0aGlzLl9hY3Rpb25zWzBdLmNsb25lKCksIHRoaXMuX2FjdGlvbnNbMV0uY2xvbmUoKSk7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfSxcblxuICAgIHN0YXJ0V2l0aFRhcmdldDpmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIGNjLkFjdGlvbkludGVydmFsLnByb3RvdHlwZS5zdGFydFdpdGhUYXJnZXQuY2FsbCh0aGlzLCB0YXJnZXQpO1xuICAgICAgICB0aGlzLl9zcGxpdCA9IHRoaXMuX2FjdGlvbnNbMF0uX2R1cmF0aW9uIC8gdGhpcy5fZHVyYXRpb247XG4gICAgICAgIHRoaXMuX3NwbGl0ICo9IHRoaXMuX2FjdGlvbnNbMF0uX3JlcGVhdE1ldGhvZCA/IHRoaXMuX2FjdGlvbnNbMF0uX3RpbWVzRm9yUmVwZWF0IDogMTtcbiAgICAgICAgdGhpcy5fbGFzdCA9IC0xO1xuICAgIH0sXG5cbiAgICBzdG9wOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gSXNzdWUgIzEzMDVcbiAgICAgICAgaWYgKHRoaXMuX2xhc3QgIT09IC0xKVxuICAgICAgICAgICAgdGhpcy5fYWN0aW9uc1t0aGlzLl9sYXN0XS5zdG9wKCk7XG4gICAgICAgIGNjLkFjdGlvbi5wcm90b3R5cGUuc3RvcC5jYWxsKHRoaXMpO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6ZnVuY3Rpb24gKGR0KSB7XG4gICAgICAgIHZhciBuZXdfdCwgZm91bmQgPSAwO1xuICAgICAgICB2YXIgbG9jU3BsaXQgPSB0aGlzLl9zcGxpdCwgbG9jQWN0aW9ucyA9IHRoaXMuX2FjdGlvbnMsIGxvY0xhc3QgPSB0aGlzLl9sYXN0LCBhY3Rpb25Gb3VuZDtcblxuICAgICAgICBkdCA9IHRoaXMuX2NvbXB1dGVFYXNlVGltZShkdCk7XG4gICAgICAgIGlmIChkdCA8IGxvY1NwbGl0KSB7XG4gICAgICAgICAgICAvLyBhY3Rpb25bMF1cbiAgICAgICAgICAgIG5ld190ID0gKGxvY1NwbGl0ICE9PSAwKSA/IGR0IC8gbG9jU3BsaXQgOiAxO1xuXG4gICAgICAgICAgICBpZiAoZm91bmQgPT09IDAgJiYgbG9jTGFzdCA9PT0gMSAmJiB0aGlzLl9yZXZlcnNlZCkge1xuICAgICAgICAgICAgICAgIC8vIFJldmVyc2UgbW9kZSA/XG4gICAgICAgICAgICAgICAgLy8gWFhYOiBCdWcuIHRoaXMgY2FzZSBkb2Vzbid0IGNvbnRlbXBsYXRlIHdoZW4gX2xhc3Q9PS0xLCBmb3VuZD0wIGFuZCBpbiBcInJldmVyc2UgbW9kZVwiXG4gICAgICAgICAgICAgICAgLy8gc2luY2UgaXQgd2lsbCByZXF1aXJlIGEgaGFjayB0byBrbm93IGlmIGFuIGFjdGlvbiBpcyBvbiByZXZlcnNlIG1vZGUgb3Igbm90LlxuICAgICAgICAgICAgICAgIC8vIFwic3RlcFwiIHNob3VsZCBiZSBvdmVycmlkZW4sIGFuZCB0aGUgXCJyZXZlcnNlTW9kZVwiIHZhbHVlIHByb3BhZ2F0ZWQgdG8gaW5uZXIgU2VxdWVuY2VzLlxuICAgICAgICAgICAgICAgIGxvY0FjdGlvbnNbMV0udXBkYXRlKDApO1xuICAgICAgICAgICAgICAgIGxvY0FjdGlvbnNbMV0uc3RvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gYWN0aW9uWzFdXG4gICAgICAgICAgICBmb3VuZCA9IDE7XG4gICAgICAgICAgICBuZXdfdCA9IChsb2NTcGxpdCA9PT0gMSkgPyAxIDogKGR0IC0gbG9jU3BsaXQpIC8gKDEgLSBsb2NTcGxpdCk7XG5cbiAgICAgICAgICAgIGlmIChsb2NMYXN0ID09PSAtMSkge1xuICAgICAgICAgICAgICAgIC8vIGFjdGlvblswXSB3YXMgc2tpcHBlZCwgZXhlY3V0ZSBpdC5cbiAgICAgICAgICAgICAgICBsb2NBY3Rpb25zWzBdLnN0YXJ0V2l0aFRhcmdldCh0aGlzLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgbG9jQWN0aW9uc1swXS51cGRhdGUoMSk7XG4gICAgICAgICAgICAgICAgbG9jQWN0aW9uc1swXS5zdG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobG9jTGFzdCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIHN3aXRjaGluZyB0byBhY3Rpb24gMS4gc3RvcCBhY3Rpb24gMC5cbiAgICAgICAgICAgICAgICBsb2NBY3Rpb25zWzBdLnVwZGF0ZSgxKTtcbiAgICAgICAgICAgICAgICBsb2NBY3Rpb25zWzBdLnN0b3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGFjdGlvbkZvdW5kID0gbG9jQWN0aW9uc1tmb3VuZF07XG4gICAgICAgIC8vIExhc3QgYWN0aW9uIGZvdW5kIGFuZCBpdCBpcyBkb25lLlxuICAgICAgICBpZiAobG9jTGFzdCA9PT0gZm91bmQgJiYgYWN0aW9uRm91bmQuaXNEb25lKCkpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgLy8gTGFzdCBhY3Rpb24gbm90IGZvdW5kXG4gICAgICAgIGlmIChsb2NMYXN0ICE9PSBmb3VuZClcbiAgICAgICAgICAgIGFjdGlvbkZvdW5kLnN0YXJ0V2l0aFRhcmdldCh0aGlzLnRhcmdldCk7XG5cbiAgICAgICAgbmV3X3QgPSBuZXdfdCAqIGFjdGlvbkZvdW5kLl90aW1lc0ZvclJlcGVhdDtcbiAgICAgICAgYWN0aW9uRm91bmQudXBkYXRlKG5ld190ID4gMSA/IG5ld190ICUgMSA6IG5ld190KTtcbiAgICAgICAgdGhpcy5fbGFzdCA9IGZvdW5kO1xuICAgIH0sXG5cbiAgICByZXZlcnNlOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IGNjLlNlcXVlbmNlLl9hY3Rpb25PbmVUd28odGhpcy5fYWN0aW9uc1sxXS5yZXZlcnNlKCksIHRoaXMuX2FjdGlvbnNbMF0ucmV2ZXJzZSgpKTtcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XG4gICAgICAgIHRoaXMuX3JldmVyc2VFYXNlTGlzdChhY3Rpb24pO1xuICAgICAgICBhY3Rpb24uX3JldmVyc2VkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9XG59KTtcblxuLyoqXG4gKiAhI2VuXG4gKiBIZWxwZXIgY29uc3RydWN0b3IgdG8gY3JlYXRlIGFuIGFycmF5IG9mIHNlcXVlbmNlYWJsZSBhY3Rpb25zXG4gKiBUaGUgY3JlYXRlZCBhY3Rpb24gd2lsbCBydW4gYWN0aW9ucyBzZXF1ZW50aWFsbHksIG9uZSBhZnRlciBhbm90aGVyLlxuICogISN6aCDpobrluo/miafooYzliqjkvZzvvIzliJvlu7rnmoTliqjkvZzlsIbmjInpobrluo/kvp3mrKHov5DooYzjgIJcbiAqIEBtZXRob2Qgc2VxdWVuY2VcbiAqIEBwYXJhbSB7RmluaXRlVGltZUFjdGlvbnxGaW5pdGVUaW1lQWN0aW9uW119IGFjdGlvbk9yQWN0aW9uQXJyYXlcbiAqIEBwYXJhbSB7RmluaXRlVGltZUFjdGlvbn0gLi4udGVtcEFycmF5XG4gKiBAcmV0dXJuIHtBY3Rpb25JbnRlcnZhbH1cbiAqIEBleGFtcGxlXG4gKiAvLyBleGFtcGxlXG4gKiAvLyBjcmVhdGUgc2VxdWVuY2Ugd2l0aCBhY3Rpb25zXG4gKiB2YXIgc2VxID0gY2Muc2VxdWVuY2UoYWN0MSwgYWN0Mik7XG4gKlxuICogLy8gY3JlYXRlIHNlcXVlbmNlIHdpdGggYXJyYXlcbiAqIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShhY3RBcnJheSk7XG4gKi9cbi8vIHRvZG86IEl0IHNob3VsZCBiZSB1c2UgbmV3XG5jYy5zZXF1ZW5jZSA9IGZ1bmN0aW9uICgvKk11bHRpcGxlIEFyZ3VtZW50cyovdGVtcEFycmF5KSB7XG4gICAgdmFyIHBhcmFtQXJyYXkgPSAodGVtcEFycmF5IGluc3RhbmNlb2YgQXJyYXkpID8gdGVtcEFycmF5IDogYXJndW1lbnRzO1xuICAgIGlmIChwYXJhbUFycmF5Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBjYy5lcnJvcklEKDEwMTkpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdmFyIGxhc3QgPSBwYXJhbUFycmF5Lmxlbmd0aCAtIDE7XG4gICAgaWYgKChsYXN0ID49IDApICYmIChwYXJhbUFycmF5W2xhc3RdID09IG51bGwpKVxuICAgICAgICBjYy5sb2dJRCgxMDE1KTtcblxuICAgIHZhciByZXN1bHQgPSBudWxsO1xuICAgIGlmIChsYXN0ID49IDApIHtcbiAgICAgICAgcmVzdWx0ID0gcGFyYW1BcnJheVswXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gbGFzdDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocGFyYW1BcnJheVtpXSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGNjLlNlcXVlbmNlLl9hY3Rpb25PbmVUd28ocmVzdWx0LCBwYXJhbUFycmF5W2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG5jYy5TZXF1ZW5jZS5fYWN0aW9uT25lVHdvID0gZnVuY3Rpb24gKGFjdGlvbk9uZSwgYWN0aW9uVHdvKSB7XG4gICAgdmFyIHNlcXVlbmNlID0gbmV3IGNjLlNlcXVlbmNlKCk7XG4gICAgc2VxdWVuY2UuaW5pdFdpdGhUd29BY3Rpb25zKGFjdGlvbk9uZSwgYWN0aW9uVHdvKTtcbiAgICByZXR1cm4gc2VxdWVuY2U7XG59O1xuXG4vKlxuICogUmVwZWF0cyBhbiBhY3Rpb24gYSBudW1iZXIgb2YgdGltZXMuXG4gKiBUbyByZXBlYXQgYW4gYWN0aW9uIGZvcmV2ZXIgdXNlIHRoZSBDQ1JlcGVhdEZvcmV2ZXIgYWN0aW9uLlxuICogQGNsYXNzIFJlcGVhdFxuICogQGV4dGVuZHMgQWN0aW9uSW50ZXJ2YWxcbiAqIEBwYXJhbSB7RmluaXRlVGltZUFjdGlvbn0gYWN0aW9uXG4gKiBAcGFyYW0ge051bWJlcn0gdGltZXNcbiAqIEBleGFtcGxlXG4gKiB2YXIgcmVwID0gbmV3IGNjLlJlcGVhdChjYy5zZXF1ZW5jZShqdW1wMiwganVtcDEpLCA1KTtcbiAqL1xuY2MuUmVwZWF0ID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5SZXBlYXQnLFxuICAgIGV4dGVuZHM6IGNjLkFjdGlvbkludGVydmFsLFxuXG4gICAgY3RvcjogZnVuY3Rpb24gKGFjdGlvbiwgdGltZXMpIHtcbiAgICAgICAgdGhpcy5fdGltZXMgPSAwO1xuICAgICAgICB0aGlzLl90b3RhbCA9IDA7XG4gICAgICAgIHRoaXMuX25leHREdCA9IDA7XG4gICAgICAgIHRoaXMuX2FjdGlvbkluc3RhbnQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5faW5uZXJBY3Rpb24gPSBudWxsO1xuXHRcdHRpbWVzICE9PSB1bmRlZmluZWQgJiYgdGhpcy5pbml0V2l0aEFjdGlvbihhY3Rpb24sIHRpbWVzKTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBAcGFyYW0ge0Zpbml0ZVRpbWVBY3Rpb259IGFjdGlvblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lc1xuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaW5pdFdpdGhBY3Rpb246ZnVuY3Rpb24gKGFjdGlvbiwgdGltZXMpIHtcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gYWN0aW9uLl9kdXJhdGlvbiAqIHRpbWVzO1xuXG4gICAgICAgIGlmICh0aGlzLmluaXRXaXRoRHVyYXRpb24oZHVyYXRpb24pKSB7XG4gICAgICAgICAgICB0aGlzLl90aW1lcyA9IHRpbWVzO1xuICAgICAgICAgICAgdGhpcy5faW5uZXJBY3Rpb24gPSBhY3Rpb247XG4gICAgICAgICAgICBpZiAoYWN0aW9uIGluc3RhbmNlb2YgY2MuQWN0aW9uSW5zdGFudCl7XG4gICAgICAgICAgICAgICAgdGhpcy5fYWN0aW9uSW5zdGFudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fdGltZXMgLT0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3RvdGFsID0gMDtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgY2xvbmU6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLlJlcGVhdCgpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoQWN0aW9uKHRoaXMuX2lubmVyQWN0aW9uLmNsb25lKCksIHRoaXMuX3RpbWVzKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9LFxuXG4gICAgc3RhcnRXaXRoVGFyZ2V0OmZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgdGhpcy5fdG90YWwgPSAwO1xuICAgICAgICB0aGlzLl9uZXh0RHQgPSB0aGlzLl9pbm5lckFjdGlvbi5fZHVyYXRpb24gLyB0aGlzLl9kdXJhdGlvbjtcbiAgICAgICAgY2MuQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLnN0YXJ0V2l0aFRhcmdldC5jYWxsKHRoaXMsIHRhcmdldCk7XG4gICAgICAgIHRoaXMuX2lubmVyQWN0aW9uLnN0YXJ0V2l0aFRhcmdldCh0YXJnZXQpO1xuICAgIH0sXG5cbiAgICBzdG9wOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5faW5uZXJBY3Rpb24uc3RvcCgpO1xuICAgICAgICBjYy5BY3Rpb24ucHJvdG90eXBlLnN0b3AuY2FsbCh0aGlzKTtcbiAgICB9LFxuXG4gICAgdXBkYXRlOmZ1bmN0aW9uIChkdCkge1xuICAgICAgICBkdCA9IHRoaXMuX2NvbXB1dGVFYXNlVGltZShkdCk7XG4gICAgICAgIHZhciBsb2NJbm5lckFjdGlvbiA9IHRoaXMuX2lubmVyQWN0aW9uO1xuICAgICAgICB2YXIgbG9jRHVyYXRpb24gPSB0aGlzLl9kdXJhdGlvbjtcbiAgICAgICAgdmFyIGxvY1RpbWVzID0gdGhpcy5fdGltZXM7XG4gICAgICAgIHZhciBsb2NOZXh0RHQgPSB0aGlzLl9uZXh0RHQ7XG5cbiAgICAgICAgaWYgKGR0ID49IGxvY05leHREdCkge1xuICAgICAgICAgICAgd2hpbGUgKGR0ID4gbG9jTmV4dER0ICYmIHRoaXMuX3RvdGFsIDwgbG9jVGltZXMpIHtcbiAgICAgICAgICAgICAgICBsb2NJbm5lckFjdGlvbi51cGRhdGUoMSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fdG90YWwrKztcbiAgICAgICAgICAgICAgICBsb2NJbm5lckFjdGlvbi5zdG9wKCk7XG4gICAgICAgICAgICAgICAgbG9jSW5uZXJBY3Rpb24uc3RhcnRXaXRoVGFyZ2V0KHRoaXMudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICBsb2NOZXh0RHQgKz0gbG9jSW5uZXJBY3Rpb24uX2R1cmF0aW9uIC8gbG9jRHVyYXRpb247XG4gICAgICAgICAgICAgICAgdGhpcy5fbmV4dER0ID0gbG9jTmV4dER0ID4gMSA/IDEgOiBsb2NOZXh0RHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGZpeCBmb3IgaXNzdWUgIzEyODgsIGluY29ycmVjdCBlbmQgdmFsdWUgb2YgcmVwZWF0XG4gICAgICAgICAgICBpZiAoZHQgPj0gMS4wICYmIHRoaXMuX3RvdGFsIDwgbG9jVGltZXMpIHtcbiAgICAgICAgICAgICAgICAvLyBmaXggZm9yIGNvY29zLWNyZWF0b3IvZmlyZWJhbGwvaXNzdWVzLzQzMTBcbiAgICAgICAgICAgICAgICBsb2NJbm5lckFjdGlvbi51cGRhdGUoMSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fdG90YWwrKztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZG9uJ3Qgc2V0IGEgaW5zdGFudCBhY3Rpb24gYmFjayBvciB1cGRhdGUgaXQsIGl0IGhhcyBubyB1c2UgYmVjYXVzZSBpdCBoYXMgbm8gZHVyYXRpb25cbiAgICAgICAgICAgIGlmICghdGhpcy5fYWN0aW9uSW5zdGFudCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90b3RhbCA9PT0gbG9jVGltZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9jSW5uZXJBY3Rpb24uc3RvcCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlzc3VlICMzOTAgcHJldmVudCBqZXJrLCB1c2UgcmlnaHQgdXBkYXRlXG4gICAgICAgICAgICAgICAgICAgIGxvY0lubmVyQWN0aW9uLnVwZGF0ZShkdCAtIChsb2NOZXh0RHQgLSBsb2NJbm5lckFjdGlvbi5fZHVyYXRpb24gLyBsb2NEdXJhdGlvbikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvY0lubmVyQWN0aW9uLnVwZGF0ZSgoZHQgKiBsb2NUaW1lcykgJSAxLjApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGlzRG9uZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90b3RhbCA9PT0gdGhpcy5fdGltZXM7XG4gICAgfSxcblxuICAgIHJldmVyc2U6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLlJlcGVhdCh0aGlzLl9pbm5lckFjdGlvbi5yZXZlcnNlKCksIHRoaXMuX3RpbWVzKTtcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XG4gICAgICAgIHRoaXMuX3JldmVyc2VFYXNlTGlzdChhY3Rpb24pO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIFNldCBpbm5lciBBY3Rpb24uXG4gICAgICogQHBhcmFtIHtGaW5pdGVUaW1lQWN0aW9ufSBhY3Rpb25cbiAgICAgKi9cbiAgICBzZXRJbm5lckFjdGlvbjpmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbm5lckFjdGlvbiAhPT0gYWN0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9pbm5lckFjdGlvbiA9IGFjdGlvbjtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIEdldCBpbm5lciBBY3Rpb24uXG4gICAgICogQHJldHVybiB7RmluaXRlVGltZUFjdGlvbn1cbiAgICAgKi9cbiAgICBnZXRJbm5lckFjdGlvbjpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbm5lckFjdGlvbjtcbiAgICB9XG59KTtcblxuLyoqXG4gKiAhI2VuIENyZWF0ZXMgYSBSZXBlYXQgYWN0aW9uLiBUaW1lcyBpcyBhbiB1bnNpZ25lZCBpbnRlZ2VyIGJldHdlZW4gMSBhbmQgcG93KDIsMzApXG4gKiAhI3poIOmHjeWkjeWKqOS9nO+8jOWPr+S7peaMieS4gOWumuasoeaVsOmHjeWkjeS4gOS4quWKqO+8jOWmguaenOaDs+awuOi/nOmHjeWkjeS4gOS4quWKqOS9nOivt+S9v+eUqCByZXBlYXRGb3JldmVyIOWKqOS9nOadpeWujOaIkOOAglxuICogQG1ldGhvZCByZXBlYXRcbiAqIEBwYXJhbSB7RmluaXRlVGltZUFjdGlvbn0gYWN0aW9uXG4gKiBAcGFyYW0ge051bWJlcn0gdGltZXNcbiAqIEByZXR1cm4ge0FjdGlvbkludGVydmFsfVxuICogQGV4YW1wbGVcbiAqIC8vIGV4YW1wbGVcbiAqIHZhciByZXAgPSBjYy5yZXBlYXQoY2Muc2VxdWVuY2UoanVtcDIsIGp1bXAxKSwgNSk7XG4gKi9cbmNjLnJlcGVhdCA9IGZ1bmN0aW9uIChhY3Rpb24sIHRpbWVzKSB7XG4gICAgcmV0dXJuIG5ldyBjYy5SZXBlYXQoYWN0aW9uLCB0aW1lcyk7XG59O1xuXG5cbi8qXG4gKiBSZXBlYXRzIGFuIGFjdGlvbiBmb3IgZXZlci4gIDxici8+XG4gKiBUbyByZXBlYXQgdGhlIGFuIGFjdGlvbiBmb3IgYSBsaW1pdGVkIG51bWJlciBvZiB0aW1lcyB1c2UgdGhlIFJlcGVhdCBhY3Rpb24uIDxici8+XG4gKiBAd2FybmluZyBUaGlzIGFjdGlvbiBjYW4ndCBiZSBTZXF1ZW5jZWFibGUgYmVjYXVzZSBpdCBpcyBub3QgYW4gSW50ZXJ2YWxBY3Rpb25cbiAqIEBjbGFzcyBSZXBlYXRGb3JldmVyXG4gKiBAZXh0ZW5kcyBBY3Rpb25JbnRlcnZhbFxuICogQHBhcmFtIHtGaW5pdGVUaW1lQWN0aW9ufSBhY3Rpb25cbiAqIEBleGFtcGxlXG4gKiB2YXIgcmVwID0gbmV3IGNjLlJlcGVhdEZvcmV2ZXIoY2Muc2VxdWVuY2UoanVtcDIsIGp1bXAxKSwgNSk7XG4gKi9cbmNjLlJlcGVhdEZvcmV2ZXIgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlJlcGVhdEZvcmV2ZXInLFxuICAgIGV4dGVuZHM6IGNjLkFjdGlvbkludGVydmFsLFxuXG4gICAgY3RvcjpmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICAgIHRoaXMuX2lubmVyQWN0aW9uID0gbnVsbDtcblx0XHRhY3Rpb24gJiYgdGhpcy5pbml0V2l0aEFjdGlvbihhY3Rpb24pO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIEBwYXJhbSB7QWN0aW9uSW50ZXJ2YWx9IGFjdGlvblxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaW5pdFdpdGhBY3Rpb246ZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgICBpZiAoIWFjdGlvbikge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgxMDI2KTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2lubmVyQWN0aW9uID0gYWN0aW9uO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgY2xvbmU6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLlJlcGVhdEZvcmV2ZXIoKTtcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XG4gICAgICAgIGFjdGlvbi5pbml0V2l0aEFjdGlvbih0aGlzLl9pbm5lckFjdGlvbi5jbG9uZSgpKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9LFxuXG4gICAgc3RhcnRXaXRoVGFyZ2V0OmZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgY2MuQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLnN0YXJ0V2l0aFRhcmdldC5jYWxsKHRoaXMsIHRhcmdldCk7XG4gICAgICAgIHRoaXMuX2lubmVyQWN0aW9uLnN0YXJ0V2l0aFRhcmdldCh0YXJnZXQpO1xuICAgIH0sXG5cbiAgICBzdGVwOmZ1bmN0aW9uIChkdCkge1xuICAgICAgICB2YXIgbG9jSW5uZXJBY3Rpb24gPSB0aGlzLl9pbm5lckFjdGlvbjtcbiAgICAgICAgbG9jSW5uZXJBY3Rpb24uc3RlcChkdCk7XG4gICAgICAgIGlmIChsb2NJbm5lckFjdGlvbi5pc0RvbmUoKSkge1xuICAgICAgICAgICAgLy92YXIgZGlmZiA9IGxvY0lubmVyQWN0aW9uLmdldEVsYXBzZWQoKSAtIGxvY0lubmVyQWN0aW9uLl9kdXJhdGlvbjtcbiAgICAgICAgICAgIGxvY0lubmVyQWN0aW9uLnN0YXJ0V2l0aFRhcmdldCh0aGlzLnRhcmdldCk7XG4gICAgICAgICAgICAvLyB0byBwcmV2ZW50IGplcmsuIGlzc3VlICMzOTAgLDEyNDdcbiAgICAgICAgICAgIC8vdGhpcy5faW5uZXJBY3Rpb24uc3RlcCgwKTtcbiAgICAgICAgICAgIC8vdGhpcy5faW5uZXJBY3Rpb24uc3RlcChkaWZmKTtcbiAgICAgICAgICAgIGxvY0lubmVyQWN0aW9uLnN0ZXAobG9jSW5uZXJBY3Rpb24uZ2V0RWxhcHNlZCgpIC0gbG9jSW5uZXJBY3Rpb24uX2R1cmF0aW9uKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBpc0RvbmU6ZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIHJldmVyc2U6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLlJlcGVhdEZvcmV2ZXIodGhpcy5faW5uZXJBY3Rpb24ucmV2ZXJzZSgpKTtcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XG4gICAgICAgIHRoaXMuX3JldmVyc2VFYXNlTGlzdChhY3Rpb24pO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIFNldCBpbm5lciBhY3Rpb24uXG4gICAgICogQHBhcmFtIHtBY3Rpb25JbnRlcnZhbH0gYWN0aW9uXG4gICAgICovXG4gICAgc2V0SW5uZXJBY3Rpb246ZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgICBpZiAodGhpcy5faW5uZXJBY3Rpb24gIT09IGFjdGlvbikge1xuICAgICAgICAgICAgdGhpcy5faW5uZXJBY3Rpb24gPSBhY3Rpb247XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBHZXQgaW5uZXIgYWN0aW9uLlxuICAgICAqIEByZXR1cm4ge0FjdGlvbkludGVydmFsfVxuICAgICAqL1xuICAgIGdldElubmVyQWN0aW9uOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lubmVyQWN0aW9uO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqICEjZW4gQ3JlYXRlIGEgYWN0b24gd2hpY2ggcmVwZWF0IGZvcmV2ZXIsIGFzIGl0IHJ1bnMgZm9yZXZlciwgaXQgY2FuJ3QgYmUgYWRkZWQgaW50byBjYy5zZXF1ZW5jZSBhbmQgY2Muc3Bhd24uXG4gKiAhI3poIOawuOi/nOWcsOmHjeWkjeS4gOS4quWKqOS9nO+8jOaciemZkOasoeaVsOWGhemHjeWkjeS4gOS4quWKqOS9nOivt+S9v+eUqCByZXBlYXQg5Yqo5L2c77yM55Sx5LqO6L+Z5Liq5Yqo5L2c5LiN5Lya5YGc5q2i77yM5omA5Lul5LiN6IO96KKr5re75Yqg5YiwIGNjLnNlcXVlbmNlIOaIliBjYy5zcGF3biDkuK3jgIJcbiAqIEBtZXRob2QgcmVwZWF0Rm9yZXZlclxuICogQHBhcmFtIHtGaW5pdGVUaW1lQWN0aW9ufSBhY3Rpb25cbiAqIEByZXR1cm4ge0FjdGlvbkludGVydmFsfVxuICogQGV4YW1wbGVcbiAqIC8vIGV4YW1wbGVcbiAqIHZhciByZXBlYXQgPSBjYy5yZXBlYXRGb3JldmVyKGNjLnJvdGF0ZUJ5KDEuMCwgMzYwKSk7XG4gKi9cbmNjLnJlcGVhdEZvcmV2ZXIgPSBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgcmV0dXJuIG5ldyBjYy5SZXBlYXRGb3JldmVyKGFjdGlvbik7XG59O1xuXG5cbi8qIFxuICogU3Bhd24gYSBuZXcgYWN0aW9uIGltbWVkaWF0ZWx5XG4gKiBAY2xhc3MgU3Bhd25cbiAqIEBleHRlbmRzIEFjdGlvbkludGVydmFsXG4gKi9cbmNjLlNwYXduID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5TcGF3bicsXG4gICAgZXh0ZW5kczogY2MuQWN0aW9uSW50ZXJ2YWwsXG5cbiAgICBjdG9yOmZ1bmN0aW9uICh0ZW1wQXJyYXkpIHtcbiAgICAgICAgdGhpcy5fb25lID0gbnVsbDtcbiAgICAgICAgdGhpcy5fdHdvID0gbnVsbDtcblxuXHRcdHZhciBwYXJhbUFycmF5ID0gKHRlbXBBcnJheSBpbnN0YW5jZW9mIEFycmF5KSA/IHRlbXBBcnJheSA6IGFyZ3VtZW50cztcbiAgICAgICAgaWYgKHBhcmFtQXJyYXkubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBjYy5lcnJvcklEKDEwMjApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cdFx0dmFyIGxhc3QgPSBwYXJhbUFycmF5Lmxlbmd0aCAtIDE7XG5cdFx0aWYgKChsYXN0ID49IDApICYmIChwYXJhbUFycmF5W2xhc3RdID09IG51bGwpKVxuXHRcdFx0Y2MubG9nSUQoMTAxNSk7XG5cbiAgICAgICAgaWYgKGxhc3QgPj0gMCkge1xuICAgICAgICAgICAgdmFyIHByZXYgPSBwYXJhbUFycmF5WzBdLCBhY3Rpb24xO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBsYXN0OyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyYW1BcnJheVtpXSkge1xuICAgICAgICAgICAgICAgICAgICBhY3Rpb24xID0gcHJldjtcbiAgICAgICAgICAgICAgICAgICAgcHJldiA9IGNjLlNwYXduLl9hY3Rpb25PbmVUd28oYWN0aW9uMSwgcGFyYW1BcnJheVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5pbml0V2l0aFR3b0FjdGlvbnMocHJldiwgcGFyYW1BcnJheVtsYXN0XSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyogaW5pdGlhbGl6ZXMgdGhlIFNwYXduIGFjdGlvbiB3aXRoIHRoZSAyIGFjdGlvbnMgdG8gc3Bhd25cbiAgICAgKiBAcGFyYW0ge0Zpbml0ZVRpbWVBY3Rpb259IGFjdGlvbjFcbiAgICAgKiBAcGFyYW0ge0Zpbml0ZVRpbWVBY3Rpb259IGFjdGlvbjJcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGluaXRXaXRoVHdvQWN0aW9uczpmdW5jdGlvbiAoYWN0aW9uMSwgYWN0aW9uMikge1xuICAgICAgICBpZiAoIWFjdGlvbjEgfHwgIWFjdGlvbjIpIHtcbiAgICAgICAgICAgIGNjLmVycm9ySUQoMTAyNyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmV0ID0gZmFsc2U7XG5cbiAgICAgICAgdmFyIGQxID0gYWN0aW9uMS5fZHVyYXRpb247XG4gICAgICAgIHZhciBkMiA9IGFjdGlvbjIuX2R1cmF0aW9uO1xuXG4gICAgICAgIGlmICh0aGlzLmluaXRXaXRoRHVyYXRpb24oTWF0aC5tYXgoZDEsIGQyKSkpIHtcbiAgICAgICAgICAgIHRoaXMuX29uZSA9IGFjdGlvbjE7XG4gICAgICAgICAgICB0aGlzLl90d28gPSBhY3Rpb24yO1xuXG4gICAgICAgICAgICBpZiAoZDEgPiBkMikge1xuICAgICAgICAgICAgICAgIHRoaXMuX3R3byA9IGNjLlNlcXVlbmNlLl9hY3Rpb25PbmVUd28oYWN0aW9uMiwgY2MuZGVsYXlUaW1lKGQxIC0gZDIpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZDEgPCBkMikge1xuICAgICAgICAgICAgICAgIHRoaXMuX29uZSA9IGNjLlNlcXVlbmNlLl9hY3Rpb25PbmVUd28oYWN0aW9uMSwgY2MuZGVsYXlUaW1lKGQyIC0gZDEpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG5cbiAgICBjbG9uZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuU3Bhd24oKTtcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XG4gICAgICAgIGFjdGlvbi5pbml0V2l0aFR3b0FjdGlvbnModGhpcy5fb25lLmNsb25lKCksIHRoaXMuX3R3by5jbG9uZSgpKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9LFxuXG4gICAgc3RhcnRXaXRoVGFyZ2V0OmZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgY2MuQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLnN0YXJ0V2l0aFRhcmdldC5jYWxsKHRoaXMsIHRhcmdldCk7XG4gICAgICAgIHRoaXMuX29uZS5zdGFydFdpdGhUYXJnZXQodGFyZ2V0KTtcbiAgICAgICAgdGhpcy5fdHdvLnN0YXJ0V2l0aFRhcmdldCh0YXJnZXQpO1xuICAgIH0sXG5cbiAgICBzdG9wOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fb25lLnN0b3AoKTtcbiAgICAgICAgdGhpcy5fdHdvLnN0b3AoKTtcbiAgICAgICAgY2MuQWN0aW9uLnByb3RvdHlwZS5zdG9wLmNhbGwodGhpcyk7XG4gICAgfSxcblxuICAgIHVwZGF0ZTpmdW5jdGlvbiAoZHQpIHtcbiAgICAgICAgZHQgPSB0aGlzLl9jb21wdXRlRWFzZVRpbWUoZHQpO1xuICAgICAgICBpZiAodGhpcy5fb25lKVxuICAgICAgICAgICAgdGhpcy5fb25lLnVwZGF0ZShkdCk7XG4gICAgICAgIGlmICh0aGlzLl90d28pXG4gICAgICAgICAgICB0aGlzLl90d28udXBkYXRlKGR0KTtcbiAgICB9LFxuXG4gICAgcmV2ZXJzZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBjYy5TcGF3bi5fYWN0aW9uT25lVHdvKHRoaXMuX29uZS5yZXZlcnNlKCksIHRoaXMuX3R3by5yZXZlcnNlKCkpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgdGhpcy5fcmV2ZXJzZUVhc2VMaXN0KGFjdGlvbik7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfVxufSk7XG5cbi8qKlxuICogISNlbiBDcmVhdGUgYSBzcGF3biBhY3Rpb24gd2hpY2ggcnVucyBzZXZlcmFsIGFjdGlvbnMgaW4gcGFyYWxsZWwuXG4gKiAhI3poIOWQjOatpeaJp+ihjOWKqOS9nO+8jOWQjOatpeaJp+ihjOS4gOe7hOWKqOS9nOOAglxuICogQG1ldGhvZCBzcGF3blxuICogQHBhcmFtIHtGaW5pdGVUaW1lQWN0aW9ufEZpbml0ZVRpbWVBY3Rpb25bXX0gYWN0aW9uT3JBY3Rpb25BcnJheVxuICogQHBhcmFtIHtGaW5pdGVUaW1lQWN0aW9ufSAuLi50ZW1wQXJyYXlcbiAqIEByZXR1cm4ge0Zpbml0ZVRpbWVBY3Rpb259XG4gKiBAZXhhbXBsZVxuICogLy8gZXhhbXBsZVxuICogdmFyIGFjdGlvbiA9IGNjLnNwYXduKGNjLmp1bXBCeSgyLCBjYy52MigzMDAsIDApLCA1MCwgNCksIGNjLnJvdGF0ZUJ5KDIsIDcyMCkpO1xuICogdG9kbzpJdCBzaG91bGQgYmUgdGhlIGRpcmVjdCB1c2UgbmV3XG4gKi9cbmNjLnNwYXduID0gZnVuY3Rpb24gKC8qTXVsdGlwbGUgQXJndW1lbnRzKi90ZW1wQXJyYXkpIHtcbiAgICB2YXIgcGFyYW1BcnJheSA9ICh0ZW1wQXJyYXkgaW5zdGFuY2VvZiBBcnJheSkgPyB0ZW1wQXJyYXkgOiBhcmd1bWVudHM7XG4gICAgaWYgKHBhcmFtQXJyYXkubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGNjLmVycm9ySUQoMTAyMCk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoKHBhcmFtQXJyYXkubGVuZ3RoID4gMCkgJiYgKHBhcmFtQXJyYXlbcGFyYW1BcnJheS5sZW5ndGggLSAxXSA9PSBudWxsKSlcbiAgICAgICAgY2MubG9nSUQoMTAxNSk7XG5cbiAgICB2YXIgcHJldiA9IHBhcmFtQXJyYXlbMF07XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBwYXJhbUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChwYXJhbUFycmF5W2ldICE9IG51bGwpXG4gICAgICAgICAgICBwcmV2ID0gY2MuU3Bhd24uX2FjdGlvbk9uZVR3byhwcmV2LCBwYXJhbUFycmF5W2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHByZXY7XG59O1xuXG5jYy5TcGF3bi5fYWN0aW9uT25lVHdvID0gZnVuY3Rpb24gKGFjdGlvbjEsIGFjdGlvbjIpIHtcbiAgICB2YXIgcFNwYXduID0gbmV3IGNjLlNwYXduKCk7XG4gICAgcFNwYXduLmluaXRXaXRoVHdvQWN0aW9ucyhhY3Rpb24xLCBhY3Rpb24yKTtcbiAgICByZXR1cm4gcFNwYXduO1xufTtcblxuXG4vKlxuICogUm90YXRlcyBhIE5vZGUgb2JqZWN0IHRvIGEgY2VydGFpbiBhbmdsZSBieSBtb2RpZnlpbmcgaXRzIGFuZ2xlIHByb3BlcnR5LiA8YnIvPlxuICogVGhlIGRpcmVjdGlvbiB3aWxsIGJlIGRlY2lkZWQgYnkgdGhlIHNob3J0ZXN0IGFuZ2xlLlxuICogQGNsYXNzIFJvdGF0ZVRvXG4gKiBAZXh0ZW5kcyBBY3Rpb25JbnRlcnZhbFxuICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uIGR1cmF0aW9uIGluIHNlY29uZHNcbiAqIEBwYXJhbSB7TnVtYmVyfSBkc3RBbmdsZSBkc3RBbmdsZSBpbiBkZWdyZWVzLlxuICogQGV4YW1wbGVcbiAqIHZhciByb3RhdGVUbyA9IG5ldyBjYy5Sb3RhdGVUbygyLCA2MS4wKTtcbiAqL1xuY2MuUm90YXRlVG8gPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlJvdGF0ZVRvJyxcbiAgICBleHRlbmRzOiBjYy5BY3Rpb25JbnRlcnZhbCxcblxuICAgIGN0b3I6ZnVuY3Rpb24gKGR1cmF0aW9uLCBkc3RBbmdsZSkge1xuICAgICAgICB0aGlzLl9zdGFydEFuZ2xlID0gMDtcbiAgICAgICAgdGhpcy5fZHN0QW5nbGUgPSAwO1xuICAgICAgICB0aGlzLl9hbmdsZSA9IDA7XG4gICAgICAgIGRzdEFuZ2xlICE9PSB1bmRlZmluZWQgJiYgdGhpcy5pbml0V2l0aER1cmF0aW9uKGR1cmF0aW9uLCBkc3RBbmdsZSk7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogSW5pdGlhbGl6ZXMgdGhlIGFjdGlvbi5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb25cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZHN0QW5nbGVcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGluaXRXaXRoRHVyYXRpb246ZnVuY3Rpb24gKGR1cmF0aW9uLCBkc3RBbmdsZSkge1xuICAgICAgICBpZiAoY2MuQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLmluaXRXaXRoRHVyYXRpb24uY2FsbCh0aGlzLCBkdXJhdGlvbikpIHtcbiAgICAgICAgICAgIHRoaXMuX2RzdEFuZ2xlID0gZHN0QW5nbGU7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIGNsb25lOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5Sb3RhdGVUbygpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoRHVyYXRpb24odGhpcy5fZHVyYXRpb24sIHRoaXMuX2RzdEFuZ2xlKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9LFxuXG4gICAgc3RhcnRXaXRoVGFyZ2V0OmZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgY2MuQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLnN0YXJ0V2l0aFRhcmdldC5jYWxsKHRoaXMsIHRhcmdldCk7XG5cbiAgICAgICAgbGV0IHN0YXJ0QW5nbGUgPSB0YXJnZXQuYW5nbGUgJSAzNjA7XG5cbiAgICAgICAgbGV0IGFuZ2xlID0gY2MubWFjcm8uUk9UQVRFX0FDVElPTl9DQ1cgPyAodGhpcy5fZHN0QW5nbGUgLSBzdGFydEFuZ2xlKSA6ICh0aGlzLl9kc3RBbmdsZSArIHN0YXJ0QW5nbGUpO1xuICAgICAgICBpZiAoYW5nbGUgPiAxODApIGFuZ2xlIC09IDM2MDtcbiAgICAgICAgaWYgKGFuZ2xlIDwgLTE4MCkgYW5nbGUgKz0gMzYwO1xuXG4gICAgICAgIHRoaXMuX3N0YXJ0QW5nbGUgPSBzdGFydEFuZ2xlO1xuICAgICAgICB0aGlzLl9hbmdsZSA9IGNjLm1hY3JvLlJPVEFURV9BQ1RJT05fQ0NXID8gYW5nbGUgOiAtYW5nbGU7XG4gICAgfSxcblxuICAgIHJldmVyc2U6ZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5sb2dJRCgxMDE2KTtcbiAgICB9LFxuXG4gICAgdXBkYXRlOmZ1bmN0aW9uIChkdCkge1xuICAgICAgICBkdCA9IHRoaXMuX2NvbXB1dGVFYXNlVGltZShkdCk7XG4gICAgICAgIGlmICh0aGlzLnRhcmdldCkge1xuICAgICAgICAgICAgdGhpcy50YXJnZXQuYW5nbGUgPSB0aGlzLl9zdGFydEFuZ2xlICsgdGhpcy5fYW5nbGUgKiBkdDtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG4vKipcbiAqICEjZW5cbiAqIFJvdGF0ZXMgYSBOb2RlIG9iamVjdCB0byBhIGNlcnRhaW4gYW5nbGUgYnkgbW9kaWZ5aW5nIGl0cyBhbmdsZSBwcm9wZXJ0eS4gPGJyLz5cbiAqIFRoZSBkaXJlY3Rpb24gd2lsbCBiZSBkZWNpZGVkIGJ5IHRoZSBzaG9ydGVzdCBhbmdsZS5cbiAqICEjemgg5peL6L2s5Yiw55uu5qCH6KeS5bqm77yM6YCa6L+H6YCQ5bin5L+u5pS55a6D55qEIGFuZ2xlIOWxnuaAp++8jOaXi+i9rOaWueWQkeWwhueUseacgOefreeahOinkuW6puWGs+WumuOAglxuICogQG1ldGhvZCByb3RhdGVUb1xuICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uIGR1cmF0aW9uIGluIHNlY29uZHNcbiAqIEBwYXJhbSB7TnVtYmVyfSBkc3RBbmdsZSBkc3RBbmdsZSBpbiBkZWdyZWVzLlxuICogQHJldHVybiB7QWN0aW9uSW50ZXJ2YWx9XG4gKiBAZXhhbXBsZVxuICogLy8gZXhhbXBsZVxuICogdmFyIHJvdGF0ZVRvID0gY2Mucm90YXRlVG8oMiwgNjEuMCk7XG4gKi9cbmNjLnJvdGF0ZVRvID0gZnVuY3Rpb24gKGR1cmF0aW9uLCBkc3RBbmdsZSkge1xuICAgIHJldHVybiBuZXcgY2MuUm90YXRlVG8oZHVyYXRpb24sIGRzdEFuZ2xlKTtcbn07XG5cblxuLypcbiAqIFJvdGF0ZXMgYSBOb2RlIG9iamVjdCBjbG9ja3dpc2UgYSBudW1iZXIgb2YgZGVncmVlcyBieSBtb2RpZnlpbmcgaXRzIGFuZ2xlIHByb3BlcnR5LlxuICogUmVsYXRpdmUgdG8gaXRzIHByb3BlcnRpZXMgdG8gbW9kaWZ5LlxuICogQGNsYXNzIFJvdGF0ZUJ5XG4gKiBAZXh0ZW5kcyBBY3Rpb25JbnRlcnZhbFxuICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uIGR1cmF0aW9uIGluIHNlY29uZHNcbiAqIEBwYXJhbSB7TnVtYmVyfSBkZWx0YUFuZ2xlIGRlbHRhQW5nbGUgaW4gZGVncmVlc1xuICogQGV4YW1wbGVcbiAqIHZhciBhY3Rpb25CeSA9IG5ldyBjYy5Sb3RhdGVCeSgyLCAzNjApO1xuICovXG5jYy5Sb3RhdGVCeSA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuUm90YXRlQnknLFxuICAgIGV4dGVuZHM6IGNjLkFjdGlvbkludGVydmFsLFxuXG4gICAgY3RvcjogZnVuY3Rpb24gKGR1cmF0aW9uLCBkZWx0YUFuZ2xlKSB7XG4gICAgICAgIGRlbHRhQW5nbGUgKj0gY2MubWFjcm8uUk9UQVRFX0FDVElPTl9DQ1cgPyAxIDogLTE7XG5cbiAgICAgICAgdGhpcy5fZGVsdGFBbmdsZSA9IDA7XG4gICAgICAgIHRoaXMuX3N0YXJ0QW5nbGUgPSAwO1xuICAgICAgICBkZWx0YUFuZ2xlICE9PSB1bmRlZmluZWQgJiYgdGhpcy5pbml0V2l0aER1cmF0aW9uKGR1cmF0aW9uLCBkZWx0YUFuZ2xlKTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBJbml0aWFsaXplcyB0aGUgYWN0aW9uLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvbiBkdXJhdGlvbiBpbiBzZWNvbmRzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGRlbHRhQW5nbGUgZGVsdGFBbmdsZSBpbiBkZWdyZWVzXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpbml0V2l0aER1cmF0aW9uOmZ1bmN0aW9uIChkdXJhdGlvbiwgZGVsdGFBbmdsZSkge1xuICAgICAgICBpZiAoY2MuQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLmluaXRXaXRoRHVyYXRpb24uY2FsbCh0aGlzLCBkdXJhdGlvbikpIHtcbiAgICAgICAgICAgIHRoaXMuX2RlbHRhQW5nbGUgPSBkZWx0YUFuZ2xlO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICBjbG9uZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuUm90YXRlQnkoKTtcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XG4gICAgICAgIGFjdGlvbi5pbml0V2l0aER1cmF0aW9uKHRoaXMuX2R1cmF0aW9uLCB0aGlzLl9kZWx0YUFuZ2xlKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9LFxuXG4gICAgc3RhcnRXaXRoVGFyZ2V0OmZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgY2MuQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLnN0YXJ0V2l0aFRhcmdldC5jYWxsKHRoaXMsIHRhcmdldCk7XG4gICAgICAgIHRoaXMuX3N0YXJ0QW5nbGUgPSB0YXJnZXQuYW5nbGU7XG4gICAgICAgIHRoaXMuX2RlbHRhQW5nbGUgKj0gLTE7XG4gICAgfSxcblxuICAgIHVwZGF0ZTpmdW5jdGlvbiAoZHQpIHtcbiAgICAgICAgZHQgPSB0aGlzLl9jb21wdXRlRWFzZVRpbWUoZHQpO1xuICAgICAgICBpZiAodGhpcy50YXJnZXQpIHtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0LmFuZ2xlID0gdGhpcy5fc3RhcnRBbmdsZSArIHRoaXMuX2RlbHRhQW5nbGUgKiBkdDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZXZlcnNlOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5Sb3RhdGVCeSgpO1xuICAgICAgICBhY3Rpb24uaW5pdFdpdGhEdXJhdGlvbih0aGlzLl9kdXJhdGlvbiwgLXRoaXMuX2RlbHRhQW5nbGUpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgdGhpcy5fcmV2ZXJzZUVhc2VMaXN0KGFjdGlvbik7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfVxufSk7XG5cbi8qKlxuICogISNlblxuICogUm90YXRlcyBhIE5vZGUgb2JqZWN0IGNsb2Nrd2lzZSBhIG51bWJlciBvZiBkZWdyZWVzIGJ5IG1vZGlmeWluZyBpdHMgYW5nbGUgcHJvcGVydHkuXG4gKiBSZWxhdGl2ZSB0byBpdHMgcHJvcGVydGllcyB0byBtb2RpZnkuXG4gKiAhI3poIOaXi+i9rOaMh+WumueahOinkuW6puOAglxuICogQG1ldGhvZCByb3RhdGVCeVxuICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uIGR1cmF0aW9uIGluIHNlY29uZHNcbiAqIEBwYXJhbSB7TnVtYmVyfSBkZWx0YUFuZ2xlIGRlbHRhQW5nbGUgaW4gZGVncmVlc1xuICogQHJldHVybiB7QWN0aW9uSW50ZXJ2YWx9XG4gKiBAZXhhbXBsZVxuICogLy8gZXhhbXBsZVxuICogdmFyIGFjdGlvbkJ5ID0gY2Mucm90YXRlQnkoMiwgMzYwKTtcbiAqL1xuY2Mucm90YXRlQnkgPSBmdW5jdGlvbiAoZHVyYXRpb24sIGRlbHRhQW5nbGUpIHtcbiAgICByZXR1cm4gbmV3IGNjLlJvdGF0ZUJ5KGR1cmF0aW9uLCBkZWx0YUFuZ2xlKTtcbn07XG5cblxuLypcbiAqIDxwPlxuICogTW92ZXMgYSBOb2RlIG9iamVjdCB4LHkgcGl4ZWxzIGJ5IG1vZGlmeWluZyBpdHMgcG9zaXRpb24gcHJvcGVydHkuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gKiB4IGFuZCB5IGFyZSByZWxhdGl2ZSB0byB0aGUgcG9zaXRpb24gb2YgdGhlIG9iamVjdC4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gKiBTZXZlcmFsIE1vdmVCeSBhY3Rpb25zIGNhbiBiZSBjb25jdXJyZW50bHkgY2FsbGVkLCBhbmQgdGhlIHJlc3VsdGluZyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICogbW92ZW1lbnQgd2lsbCBiZSB0aGUgc3VtIG9mIGluZGl2aWR1YWwgbW92ZW1lbnRzLlxuICogPC9wPlxuICogQGNsYXNzIE1vdmVCeVxuICogQGV4dGVuZHMgQWN0aW9uSW50ZXJ2YWxcbiAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvbiBkdXJhdGlvbiBpbiBzZWNvbmRzXG4gKiBAcGFyYW0ge1ZlYzJ8TnVtYmVyfSBkZWx0YVBvc1xuICogQHBhcmFtIHtOdW1iZXJ9IFtkZWx0YVldXG4gKiBAZXhhbXBsZVxuICogdmFyIGFjdGlvblRvID0gY2MubW92ZUJ5KDIsIGNjLnYyKHdpbmRvd1NpemUud2lkdGggLSA0MCwgd2luZG93U2l6ZS5oZWlnaHQgLSA0MCkpO1xuICovXG5jYy5Nb3ZlQnkgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLk1vdmVCeScsXG4gICAgZXh0ZW5kczogY2MuQWN0aW9uSW50ZXJ2YWwsXG5cbiAgICBjdG9yOmZ1bmN0aW9uIChkdXJhdGlvbiwgZGVsdGFQb3MsIGRlbHRhWSkge1xuICAgICAgICB0aGlzLl9wb3NpdGlvbkRlbHRhID0gY2MudjIoMCwgMCk7XG4gICAgICAgIHRoaXMuX3N0YXJ0UG9zaXRpb24gPSBjYy52MigwLCAwKTtcbiAgICAgICAgdGhpcy5fcHJldmlvdXNQb3NpdGlvbiA9IGNjLnYyKDAsIDApO1xuXG4gICAgICAgIGRlbHRhUG9zICE9PSB1bmRlZmluZWQgJiYgY2MuTW92ZUJ5LnByb3RvdHlwZS5pbml0V2l0aER1cmF0aW9uLmNhbGwodGhpcywgZHVyYXRpb24sIGRlbHRhUG9zLCBkZWx0YVkpO1x0XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogSW5pdGlhbGl6ZXMgdGhlIGFjdGlvbi5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb24gZHVyYXRpb24gaW4gc2Vjb25kc1xuICAgICAqIEBwYXJhbSB7VmVjMn0gcG9zaXRpb25cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3ldXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpbml0V2l0aER1cmF0aW9uOmZ1bmN0aW9uIChkdXJhdGlvbiwgcG9zaXRpb24sIHkpIHtcbiAgICAgICAgaWYgKGNjLkFjdGlvbkludGVydmFsLnByb3RvdHlwZS5pbml0V2l0aER1cmF0aW9uLmNhbGwodGhpcywgZHVyYXRpb24pKSB7XG5cdCAgICAgICAgaWYocG9zaXRpb24ueCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0ICAgICAgICB5ID0gcG9zaXRpb24ueTtcblx0XHQgICAgICAgIHBvc2l0aW9uID0gcG9zaXRpb24ueDtcblx0ICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3Bvc2l0aW9uRGVsdGEueCA9IHBvc2l0aW9uO1xuICAgICAgICAgICAgdGhpcy5fcG9zaXRpb25EZWx0YS55ID0geTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgY2xvbmU6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLk1vdmVCeSgpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoRHVyYXRpb24odGhpcy5fZHVyYXRpb24sIHRoaXMuX3Bvc2l0aW9uRGVsdGEpO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH0sXG5cbiAgICBzdGFydFdpdGhUYXJnZXQ6ZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICBjYy5BY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuc3RhcnRXaXRoVGFyZ2V0LmNhbGwodGhpcywgdGFyZ2V0KTtcbiAgICAgICAgdmFyIGxvY1Bvc1ggPSB0YXJnZXQueDtcbiAgICAgICAgdmFyIGxvY1Bvc1kgPSB0YXJnZXQueTtcbiAgICAgICAgdGhpcy5fcHJldmlvdXNQb3NpdGlvbi54ID0gbG9jUG9zWDtcbiAgICAgICAgdGhpcy5fcHJldmlvdXNQb3NpdGlvbi55ID0gbG9jUG9zWTtcbiAgICAgICAgdGhpcy5fc3RhcnRQb3NpdGlvbi54ID0gbG9jUG9zWDtcbiAgICAgICAgdGhpcy5fc3RhcnRQb3NpdGlvbi55ID0gbG9jUG9zWTtcbiAgICB9LFxuXG4gICAgdXBkYXRlOmZ1bmN0aW9uIChkdCkge1xuICAgICAgICBkdCA9IHRoaXMuX2NvbXB1dGVFYXNlVGltZShkdCk7XG4gICAgICAgIGlmICh0aGlzLnRhcmdldCkge1xuICAgICAgICAgICAgdmFyIHggPSB0aGlzLl9wb3NpdGlvbkRlbHRhLnggKiBkdDtcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy5fcG9zaXRpb25EZWx0YS55ICogZHQ7XG4gICAgICAgICAgICB2YXIgbG9jU3RhcnRQb3NpdGlvbiA9IHRoaXMuX3N0YXJ0UG9zaXRpb247XG4gICAgICAgICAgICBpZiAoY2MubWFjcm8uRU5BQkxFX1NUQUNLQUJMRV9BQ1RJT05TKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldFggPSB0aGlzLnRhcmdldC54O1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXRZID0gdGhpcy50YXJnZXQueTtcbiAgICAgICAgICAgICAgICB2YXIgbG9jUHJldmlvdXNQb3NpdGlvbiA9IHRoaXMuX3ByZXZpb3VzUG9zaXRpb247XG5cbiAgICAgICAgICAgICAgICBsb2NTdGFydFBvc2l0aW9uLnggPSBsb2NTdGFydFBvc2l0aW9uLnggKyB0YXJnZXRYIC0gbG9jUHJldmlvdXNQb3NpdGlvbi54O1xuICAgICAgICAgICAgICAgIGxvY1N0YXJ0UG9zaXRpb24ueSA9IGxvY1N0YXJ0UG9zaXRpb24ueSArIHRhcmdldFkgLSBsb2NQcmV2aW91c1Bvc2l0aW9uLnk7XG4gICAgICAgICAgICAgICAgeCA9IHggKyBsb2NTdGFydFBvc2l0aW9uLng7XG4gICAgICAgICAgICAgICAgeSA9IHkgKyBsb2NTdGFydFBvc2l0aW9uLnk7XG5cdCAgICAgICAgICAgIGxvY1ByZXZpb3VzUG9zaXRpb24ueCA9IHg7XG5cdCAgICAgICAgICAgIGxvY1ByZXZpb3VzUG9zaXRpb24ueSA9IHk7XG5cdCAgICAgICAgICAgIHRoaXMudGFyZ2V0LnNldFBvc2l0aW9uKHgsIHkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldC5zZXRQb3NpdGlvbihsb2NTdGFydFBvc2l0aW9uLnggKyB4LCBsb2NTdGFydFBvc2l0aW9uLnkgKyB5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZXZlcnNlOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5Nb3ZlQnkodGhpcy5fZHVyYXRpb24sIGNjLnYyKC10aGlzLl9wb3NpdGlvbkRlbHRhLngsIC10aGlzLl9wb3NpdGlvbkRlbHRhLnkpKTtcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XG4gICAgICAgIHRoaXMuX3JldmVyc2VFYXNlTGlzdChhY3Rpb24pO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqICEjZW5cbiAqIE1vdmVzIGEgTm9kZSBvYmplY3QgeCx5IHBpeGVscyBieSBtb2RpZnlpbmcgaXRzIHBvc2l0aW9uIHByb3BlcnR5LiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICogeCBhbmQgeSBhcmUgcmVsYXRpdmUgdG8gdGhlIHBvc2l0aW9uIG9mIHRoZSBvYmplY3QuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICogU2V2ZXJhbCBNb3ZlQnkgYWN0aW9ucyBjYW4gYmUgY29uY3VycmVudGx5IGNhbGxlZCwgYW5kIHRoZSByZXN1bHRpbmcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAqIG1vdmVtZW50IHdpbGwgYmUgdGhlIHN1bSBvZiBpbmRpdmlkdWFsIG1vdmVtZW50cy5cbiAqICEjemgg56e75Yqo5oyH5a6a55qE6Led56a744CCXG4gKiBAbWV0aG9kIG1vdmVCeVxuICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uIGR1cmF0aW9uIGluIHNlY29uZHNcbiAqIEBwYXJhbSB7VmVjMnxOdW1iZXJ9IGRlbHRhUG9zXG4gKiBAcGFyYW0ge051bWJlcn0gW2RlbHRhWV1cbiAqIEByZXR1cm4ge0FjdGlvbkludGVydmFsfVxuICogQGV4YW1wbGVcbiAqIC8vIGV4YW1wbGVcbiAqIHZhciBhY3Rpb25UbyA9IGNjLm1vdmVCeSgyLCBjYy52Mih3aW5kb3dTaXplLndpZHRoIC0gNDAsIHdpbmRvd1NpemUuaGVpZ2h0IC0gNDApKTtcbiAqL1xuY2MubW92ZUJ5ID0gZnVuY3Rpb24gKGR1cmF0aW9uLCBkZWx0YVBvcywgZGVsdGFZKSB7XG4gICAgcmV0dXJuIG5ldyBjYy5Nb3ZlQnkoZHVyYXRpb24sIGRlbHRhUG9zLCBkZWx0YVkpO1xufTtcblxuXG4vKlxuICogTW92ZXMgYSBOb2RlIG9iamVjdCB0byB0aGUgcG9zaXRpb24geCx5LiB4IGFuZCB5IGFyZSBhYnNvbHV0ZSBjb29yZGluYXRlcyBieSBtb2RpZnlpbmcgaXRzIHBvc2l0aW9uIHByb3BlcnR5LiA8YnIvPlxuICogU2V2ZXJhbCBNb3ZlVG8gYWN0aW9ucyBjYW4gYmUgY29uY3VycmVudGx5IGNhbGxlZCwgYW5kIHRoZSByZXN1bHRpbmcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gKiBtb3ZlbWVudCB3aWxsIGJlIHRoZSBzdW0gb2YgaW5kaXZpZHVhbCBtb3ZlbWVudHMuXG4gKiBAY2xhc3MgTW92ZVRvXG4gKiBAZXh0ZW5kcyBNb3ZlQnlcbiAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvbiBkdXJhdGlvbiBpbiBzZWNvbmRzXG4gKiBAcGFyYW0ge1ZlYzJ8TnVtYmVyfSBwb3NpdGlvblxuICogQHBhcmFtIHtOdW1iZXJ9IFt5XVxuICogQGV4YW1wbGVcbiAqIHZhciBhY3Rpb25CeSA9IG5ldyBjYy5Nb3ZlVG8oMiwgY2MudjIoODAsIDgwKSk7XG4gKi9cbmNjLk1vdmVUbyA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuTW92ZVRvJyxcbiAgICBleHRlbmRzOiBjYy5Nb3ZlQnksXG5cbiAgICBjdG9yOmZ1bmN0aW9uIChkdXJhdGlvbiwgcG9zaXRpb24sIHkpIHtcbiAgICAgICAgdGhpcy5fZW5kUG9zaXRpb24gPSBjYy52MigwLCAwKTtcblx0XHRwb3NpdGlvbiAhPT0gdW5kZWZpbmVkICYmIHRoaXMuaW5pdFdpdGhEdXJhdGlvbihkdXJhdGlvbiwgcG9zaXRpb24sIHkpO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIEluaXRpYWxpemVzIHRoZSBhY3Rpb24uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uICBkdXJhdGlvbiBpbiBzZWNvbmRzXG4gICAgICogQHBhcmFtIHtWZWMyfSBwb3NpdGlvblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbeV1cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGluaXRXaXRoRHVyYXRpb246ZnVuY3Rpb24gKGR1cmF0aW9uLCBwb3NpdGlvbiwgeSkge1xuICAgICAgICBpZiAoY2MuTW92ZUJ5LnByb3RvdHlwZS5pbml0V2l0aER1cmF0aW9uLmNhbGwodGhpcywgZHVyYXRpb24sIHBvc2l0aW9uLCB5KSkge1xuXHQgICAgICAgIGlmKHBvc2l0aW9uLnggIT09IHVuZGVmaW5lZCkge1xuXHRcdCAgICAgICAgeSA9IHBvc2l0aW9uLnk7XG5cdFx0ICAgICAgICBwb3NpdGlvbiA9IHBvc2l0aW9uLng7XG5cdCAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9lbmRQb3NpdGlvbi54ID0gcG9zaXRpb247XG4gICAgICAgICAgICB0aGlzLl9lbmRQb3NpdGlvbi55ID0geTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgY2xvbmU6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLk1vdmVUbygpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoRHVyYXRpb24odGhpcy5fZHVyYXRpb24sIHRoaXMuX2VuZFBvc2l0aW9uKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9LFxuXG4gICAgc3RhcnRXaXRoVGFyZ2V0OmZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgY2MuTW92ZUJ5LnByb3RvdHlwZS5zdGFydFdpdGhUYXJnZXQuY2FsbCh0aGlzLCB0YXJnZXQpO1xuICAgICAgICB0aGlzLl9wb3NpdGlvbkRlbHRhLnggPSB0aGlzLl9lbmRQb3NpdGlvbi54IC0gdGFyZ2V0Lng7XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uRGVsdGEueSA9IHRoaXMuX2VuZFBvc2l0aW9uLnkgLSB0YXJnZXQueTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiAhI2VuXG4gKiBNb3ZlcyBhIE5vZGUgb2JqZWN0IHRvIHRoZSBwb3NpdGlvbiB4LHkuIHggYW5kIHkgYXJlIGFic29sdXRlIGNvb3JkaW5hdGVzIGJ5IG1vZGlmeWluZyBpdHMgcG9zaXRpb24gcHJvcGVydHkuIDxici8+XG4gKiBTZXZlcmFsIE1vdmVUbyBhY3Rpb25zIGNhbiBiZSBjb25jdXJyZW50bHkgY2FsbGVkLCBhbmQgdGhlIHJlc3VsdGluZyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAqIG1vdmVtZW50IHdpbGwgYmUgdGhlIHN1bSBvZiBpbmRpdmlkdWFsIG1vdmVtZW50cy5cbiAqICEjemgg56e75Yqo5Yiw55uu5qCH5L2N572u44CCXG4gKiBAbWV0aG9kIG1vdmVUb1xuICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uIGR1cmF0aW9uIGluIHNlY29uZHNcbiAqIEBwYXJhbSB7VmVjMnxOdW1iZXJ9IHBvc2l0aW9uXG4gKiBAcGFyYW0ge051bWJlcn0gW3ldXG4gKiBAcmV0dXJuIHtBY3Rpb25JbnRlcnZhbH1cbiAqIEBleGFtcGxlXG4gKiAvLyBleGFtcGxlXG4gKiB2YXIgYWN0aW9uQnkgPSBjYy5tb3ZlVG8oMiwgY2MudjIoODAsIDgwKSk7XG4gKi9cbmNjLm1vdmVUbyA9IGZ1bmN0aW9uIChkdXJhdGlvbiwgcG9zaXRpb24sIHkpIHtcbiAgICByZXR1cm4gbmV3IGNjLk1vdmVUbyhkdXJhdGlvbiwgcG9zaXRpb24sIHkpO1xufTtcblxuLypcbiAqIFNrZXdzIGEgTm9kZSBvYmplY3QgdG8gZ2l2ZW4gYW5nbGVzIGJ5IG1vZGlmeWluZyBpdHMgc2tld1ggYW5kIHNrZXdZIHByb3BlcnRpZXNcbiAqIEBjbGFzcyBTa2V3VG9cbiAqIEBleHRlbmRzIEFjdGlvbkludGVydmFsXG4gKiBAcGFyYW0ge051bWJlcn0gdCB0aW1lIGluIHNlY29uZHNcbiAqIEBwYXJhbSB7TnVtYmVyfSBzeFxuICogQHBhcmFtIHtOdW1iZXJ9IHN5XG4gKiBAZXhhbXBsZVxuICogdmFyIGFjdGlvblRvID0gbmV3IGNjLlNrZXdUbygyLCAzNy4yLCAtMzcuMik7XG4gKi9cbmNjLlNrZXdUbyA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuU2tld1RvJyxcbiAgICBleHRlbmRzOiBjYy5BY3Rpb25JbnRlcnZhbCxcblxuICAgIGN0b3I6IGZ1bmN0aW9uICh0LCBzeCwgc3kpIHtcbiAgICAgICAgdGhpcy5fc2tld1ggPSAwO1xuICAgICAgICB0aGlzLl9za2V3WSA9IDA7XG4gICAgICAgIHRoaXMuX3N0YXJ0U2tld1ggPSAwO1xuICAgICAgICB0aGlzLl9zdGFydFNrZXdZID0gMDtcbiAgICAgICAgdGhpcy5fZW5kU2tld1ggPSAwO1xuICAgICAgICB0aGlzLl9lbmRTa2V3WSA9IDA7XG4gICAgICAgIHRoaXMuX2RlbHRhWCA9IDA7XG4gICAgICAgIHRoaXMuX2RlbHRhWSA9IDA7XG4gICAgICAgIHN5ICE9PSB1bmRlZmluZWQgJiYgY2MuU2tld1RvLnByb3RvdHlwZS5pbml0V2l0aER1cmF0aW9uLmNhbGwodGhpcywgdCwgc3gsIHN5KTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBJbml0aWFsaXplcyB0aGUgYWN0aW9uLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0IHRpbWUgaW4gc2Vjb25kc1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzeFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzeVxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaW5pdFdpdGhEdXJhdGlvbjpmdW5jdGlvbiAodCwgc3gsIHN5KSB7XG4gICAgICAgIHZhciByZXQgPSBmYWxzZTtcbiAgICAgICAgaWYgKGNjLkFjdGlvbkludGVydmFsLnByb3RvdHlwZS5pbml0V2l0aER1cmF0aW9uLmNhbGwodGhpcywgdCkpIHtcbiAgICAgICAgICAgIHRoaXMuX2VuZFNrZXdYID0gc3g7XG4gICAgICAgICAgICB0aGlzLl9lbmRTa2V3WSA9IHN5O1xuICAgICAgICAgICAgcmV0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG5cbiAgICBjbG9uZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuU2tld1RvKCk7XG4gICAgICAgIHRoaXMuX2Nsb25lRGVjb3JhdGlvbihhY3Rpb24pO1xuICAgICAgICBhY3Rpb24uaW5pdFdpdGhEdXJhdGlvbih0aGlzLl9kdXJhdGlvbiwgdGhpcy5fZW5kU2tld1gsIHRoaXMuX2VuZFNrZXdZKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9LFxuXG4gICAgc3RhcnRXaXRoVGFyZ2V0OmZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgY2MuQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLnN0YXJ0V2l0aFRhcmdldC5jYWxsKHRoaXMsIHRhcmdldCk7XG5cbiAgICAgICAgdGhpcy5fc3RhcnRTa2V3WCA9IHRhcmdldC5za2V3WCAlIDE4MDtcbiAgICAgICAgdGhpcy5fZGVsdGFYID0gdGhpcy5fZW5kU2tld1ggLSB0aGlzLl9zdGFydFNrZXdYO1xuICAgICAgICBpZiAodGhpcy5fZGVsdGFYID4gMTgwKVxuICAgICAgICAgICAgdGhpcy5fZGVsdGFYIC09IDM2MDtcbiAgICAgICAgaWYgKHRoaXMuX2RlbHRhWCA8IC0xODApXG4gICAgICAgICAgICB0aGlzLl9kZWx0YVggKz0gMzYwO1xuXG4gICAgICAgIHRoaXMuX3N0YXJ0U2tld1kgPSB0YXJnZXQuc2tld1kgJSAzNjA7XG4gICAgICAgIHRoaXMuX2RlbHRhWSA9IHRoaXMuX2VuZFNrZXdZIC0gdGhpcy5fc3RhcnRTa2V3WTtcbiAgICAgICAgaWYgKHRoaXMuX2RlbHRhWSA+IDE4MClcbiAgICAgICAgICAgIHRoaXMuX2RlbHRhWSAtPSAzNjA7XG4gICAgICAgIGlmICh0aGlzLl9kZWx0YVkgPCAtMTgwKVxuICAgICAgICAgICAgdGhpcy5fZGVsdGFZICs9IDM2MDtcbiAgICB9LFxuXG4gICAgdXBkYXRlOmZ1bmN0aW9uIChkdCkge1xuICAgICAgICBkdCA9IHRoaXMuX2NvbXB1dGVFYXNlVGltZShkdCk7XG4gICAgICAgIHRoaXMudGFyZ2V0LnNrZXdYID0gdGhpcy5fc3RhcnRTa2V3WCArIHRoaXMuX2RlbHRhWCAqIGR0O1xuICAgICAgICB0aGlzLnRhcmdldC5za2V3WSA9IHRoaXMuX3N0YXJ0U2tld1kgKyB0aGlzLl9kZWx0YVkgKiBkdDtcbiAgICB9XG59KTtcblxuLyoqXG4gKiAhI2VuXG4gKiBDcmVhdGUgYSBhY3Rpb24gd2hpY2ggc2tld3MgYSBOb2RlIG9iamVjdCB0byBnaXZlbiBhbmdsZXMgYnkgbW9kaWZ5aW5nIGl0cyBza2V3WCBhbmQgc2tld1kgcHJvcGVydGllcy5cbiAqIENoYW5nZXMgdG8gdGhlIHNwZWNpZmllZCB2YWx1ZS5cbiAqICEjemgg5YGP5pac5Yiw55uu5qCH6KeS5bqm44CCXG4gKiBAbWV0aG9kIHNrZXdUb1xuICogQHBhcmFtIHtOdW1iZXJ9IHQgdGltZSBpbiBzZWNvbmRzXG4gKiBAcGFyYW0ge051bWJlcn0gc3hcbiAqIEBwYXJhbSB7TnVtYmVyfSBzeVxuICogQHJldHVybiB7QWN0aW9uSW50ZXJ2YWx9XG4gKiBAZXhhbXBsZVxuICogLy8gZXhhbXBsZVxuICogdmFyIGFjdGlvblRvID0gY2Muc2tld1RvKDIsIDM3LjIsIC0zNy4yKTtcbiAqL1xuY2Muc2tld1RvID0gZnVuY3Rpb24gKHQsIHN4LCBzeSkge1xuICAgIHJldHVybiBuZXcgY2MuU2tld1RvKHQsIHN4LCBzeSk7XG59O1xuXG4vKlxuICogU2tld3MgYSBOb2RlIG9iamVjdCBieSBza2V3WCBhbmQgc2tld1kgZGVncmVlcy5cbiAqIFJlbGF0aXZlIHRvIGl0cyBwcm9wZXJ0eSBtb2RpZmljYXRpb24uXG4gKiBAY2xhc3MgU2tld0J5XG4gKiBAZXh0ZW5kcyBTa2V3VG9cbiAqIEBwYXJhbSB7TnVtYmVyfSB0IHRpbWUgaW4gc2Vjb25kc1xuICogQHBhcmFtIHtOdW1iZXJ9IHN4ICBza2V3IGluIGRlZ3JlZXMgZm9yIFggYXhpc1xuICogQHBhcmFtIHtOdW1iZXJ9IHN5ICBza2V3IGluIGRlZ3JlZXMgZm9yIFkgYXhpc1xuICovXG5jYy5Ta2V3QnkgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlNrZXdCeScsXG4gICAgZXh0ZW5kczogY2MuU2tld1RvLFxuXG5cdGN0b3I6IGZ1bmN0aW9uKHQsIHN4LCBzeSkge1xuXHRcdHN5ICE9PSB1bmRlZmluZWQgJiYgdGhpcy5pbml0V2l0aER1cmF0aW9uKHQsIHN4LCBzeSk7XG5cdH0sXG5cbiAgICAvKlxuICAgICAqIEluaXRpYWxpemVzIHRoZSBhY3Rpb24uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHQgdGltZSBpbiBzZWNvbmRzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGRlbHRhU2tld1ggIHNrZXcgaW4gZGVncmVlcyBmb3IgWCBheGlzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGRlbHRhU2tld1kgIHNrZXcgaW4gZGVncmVlcyBmb3IgWSBheGlzXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpbml0V2l0aER1cmF0aW9uOmZ1bmN0aW9uICh0LCBkZWx0YVNrZXdYLCBkZWx0YVNrZXdZKSB7XG4gICAgICAgIHZhciByZXQgPSBmYWxzZTtcbiAgICAgICAgaWYgKGNjLlNrZXdUby5wcm90b3R5cGUuaW5pdFdpdGhEdXJhdGlvbi5jYWxsKHRoaXMsIHQsIGRlbHRhU2tld1gsIGRlbHRhU2tld1kpKSB7XG4gICAgICAgICAgICB0aGlzLl9za2V3WCA9IGRlbHRhU2tld1g7XG4gICAgICAgICAgICB0aGlzLl9za2V3WSA9IGRlbHRhU2tld1k7XG4gICAgICAgICAgICByZXQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuICAgIGNsb25lOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5Ta2V3QnkoKTtcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XG4gICAgICAgIGFjdGlvbi5pbml0V2l0aER1cmF0aW9uKHRoaXMuX2R1cmF0aW9uLCB0aGlzLl9za2V3WCwgdGhpcy5fc2tld1kpO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH0sXG5cbiAgICBzdGFydFdpdGhUYXJnZXQ6ZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICBjYy5Ta2V3VG8ucHJvdG90eXBlLnN0YXJ0V2l0aFRhcmdldC5jYWxsKHRoaXMsIHRhcmdldCk7XG4gICAgICAgIHRoaXMuX2RlbHRhWCA9IHRoaXMuX3NrZXdYO1xuICAgICAgICB0aGlzLl9kZWx0YVkgPSB0aGlzLl9za2V3WTtcbiAgICAgICAgdGhpcy5fZW5kU2tld1ggPSB0aGlzLl9zdGFydFNrZXdYICsgdGhpcy5fZGVsdGFYO1xuICAgICAgICB0aGlzLl9lbmRTa2V3WSA9IHRoaXMuX3N0YXJ0U2tld1kgKyB0aGlzLl9kZWx0YVk7XG4gICAgfSxcblxuICAgIHJldmVyc2U6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLlNrZXdCeSh0aGlzLl9kdXJhdGlvbiwgLXRoaXMuX3NrZXdYLCAtdGhpcy5fc2tld1kpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgdGhpcy5fcmV2ZXJzZUVhc2VMaXN0KGFjdGlvbik7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfVxufSk7XG5cbi8qKlxuICogISNlblxuICogU2tld3MgYSBOb2RlIG9iamVjdCBieSBza2V3WCBhbmQgc2tld1kgZGVncmVlcy4gPGJyIC8+XG4gKiBSZWxhdGl2ZSB0byBpdHMgcHJvcGVydHkgbW9kaWZpY2F0aW9uLlxuICogISN6aCDlgY/mlpzmjIflrprnmoTop5LluqbjgIJcbiAqIEBtZXRob2Qgc2tld0J5XG4gKiBAcGFyYW0ge051bWJlcn0gdCB0aW1lIGluIHNlY29uZHNcbiAqIEBwYXJhbSB7TnVtYmVyfSBzeCBzeCBza2V3IGluIGRlZ3JlZXMgZm9yIFggYXhpc1xuICogQHBhcmFtIHtOdW1iZXJ9IHN5IHN5IHNrZXcgaW4gZGVncmVlcyBmb3IgWSBheGlzXG4gKiBAcmV0dXJuIHtBY3Rpb25JbnRlcnZhbH1cbiAqIEBleGFtcGxlXG4gKiAvLyBleGFtcGxlXG4gKiB2YXIgYWN0aW9uQnkgPSBjYy5za2V3QnkoMiwgMCwgLTkwKTtcbiAqL1xuY2Muc2tld0J5ID0gZnVuY3Rpb24gKHQsIHN4LCBzeSkge1xuICAgIHJldHVybiBuZXcgY2MuU2tld0J5KHQsIHN4LCBzeSk7XG59O1xuXG5cbi8qXG4gKiBNb3ZlcyBhIE5vZGUgb2JqZWN0IHNpbXVsYXRpbmcgYSBwYXJhYm9saWMganVtcCBtb3ZlbWVudCBieSBtb2RpZnlpbmcgaXRzIHBvc2l0aW9uIHByb3BlcnR5LlxuICogUmVsYXRpdmUgdG8gaXRzIG1vdmVtZW50LlxuICogQGNsYXNzIEp1bXBCeVxuICogQGV4dGVuZHMgQWN0aW9uSW50ZXJ2YWxcbiAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvblxuICogQHBhcmFtIHtWZWMyfE51bWJlcn0gcG9zaXRpb25cbiAqIEBwYXJhbSB7TnVtYmVyfSBbeV1cbiAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHRcbiAqIEBwYXJhbSB7TnVtYmVyfSBqdW1wc1xuICogQGV4YW1wbGVcbiAqIHZhciBhY3Rpb25CeSA9IG5ldyBjYy5KdW1wQnkoMiwgY2MudjIoMzAwLCAwKSwgNTAsIDQpO1xuICogdmFyIGFjdGlvbkJ5ID0gbmV3IGNjLkp1bXBCeSgyLCAzMDAsIDAsIDUwLCA0KTtcbiAqL1xuY2MuSnVtcEJ5ID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5KdW1wQnknLFxuICAgIGV4dGVuZHM6IGNjLkFjdGlvbkludGVydmFsLFxuXG4gICAgY3RvcjpmdW5jdGlvbiAoZHVyYXRpb24sIHBvc2l0aW9uLCB5LCBoZWlnaHQsIGp1bXBzKSB7XG4gICAgICAgIHRoaXMuX3N0YXJ0UG9zaXRpb24gPSBjYy52MigwLCAwKTtcbiAgICAgICAgdGhpcy5fcHJldmlvdXNQb3NpdGlvbiA9IGNjLnYyKDAsIDApO1xuICAgICAgICB0aGlzLl9kZWx0YSA9IGNjLnYyKDAsIDApO1xuICAgICAgICB0aGlzLl9oZWlnaHQgPSAwO1xuICAgICAgICB0aGlzLl9qdW1wcyA9IDA7XG5cbiAgICAgICAgaGVpZ2h0ICE9PSB1bmRlZmluZWQgJiYgY2MuSnVtcEJ5LnByb3RvdHlwZS5pbml0V2l0aER1cmF0aW9uLmNhbGwodGhpcywgZHVyYXRpb24sIHBvc2l0aW9uLCB5LCBoZWlnaHQsIGp1bXBzKTtcbiAgICB9LFxuICAgIC8qXG4gICAgICogSW5pdGlhbGl6ZXMgdGhlIGFjdGlvbi5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb25cbiAgICAgKiBAcGFyYW0ge1ZlYzJ8TnVtYmVyfSBwb3NpdGlvblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbeV1cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaGVpZ2h0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGp1bXBzXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGFjdGlvbkJ5LmluaXRXaXRoRHVyYXRpb24oMiwgY2MudjIoMzAwLCAwKSwgNTAsIDQpO1xuICAgICAqIGFjdGlvbkJ5LmluaXRXaXRoRHVyYXRpb24oMiwgMzAwLCAwLCA1MCwgNCk7XG4gICAgICovXG4gICAgaW5pdFdpdGhEdXJhdGlvbjpmdW5jdGlvbiAoZHVyYXRpb24sIHBvc2l0aW9uLCB5LCBoZWlnaHQsIGp1bXBzKSB7XG4gICAgICAgIGlmIChjYy5BY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuaW5pdFdpdGhEdXJhdGlvbi5jYWxsKHRoaXMsIGR1cmF0aW9uKSkge1xuXHQgICAgICAgIGlmIChqdW1wcyA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0ICAgICAgICBqdW1wcyA9IGhlaWdodDtcblx0XHQgICAgICAgIGhlaWdodCA9IHk7XG5cdFx0ICAgICAgICB5ID0gcG9zaXRpb24ueTtcblx0XHQgICAgICAgIHBvc2l0aW9uID0gcG9zaXRpb24ueDtcblx0ICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9kZWx0YS54ID0gcG9zaXRpb247XG4gICAgICAgICAgICB0aGlzLl9kZWx0YS55ID0geTtcbiAgICAgICAgICAgIHRoaXMuX2hlaWdodCA9IGhlaWdodDtcbiAgICAgICAgICAgIHRoaXMuX2p1bXBzID0ganVtcHM7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIGNsb25lOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5KdW1wQnkoKTtcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XG4gICAgICAgIGFjdGlvbi5pbml0V2l0aER1cmF0aW9uKHRoaXMuX2R1cmF0aW9uLCB0aGlzLl9kZWx0YSwgdGhpcy5faGVpZ2h0LCB0aGlzLl9qdW1wcyk7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfSxcblxuICAgIHN0YXJ0V2l0aFRhcmdldDpmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIGNjLkFjdGlvbkludGVydmFsLnByb3RvdHlwZS5zdGFydFdpdGhUYXJnZXQuY2FsbCh0aGlzLCB0YXJnZXQpO1xuICAgICAgICB2YXIgbG9jUG9zWCA9IHRhcmdldC54O1xuICAgICAgICB2YXIgbG9jUG9zWSA9IHRhcmdldC55O1xuICAgICAgICB0aGlzLl9wcmV2aW91c1Bvc2l0aW9uLnggPSBsb2NQb3NYO1xuICAgICAgICB0aGlzLl9wcmV2aW91c1Bvc2l0aW9uLnkgPSBsb2NQb3NZO1xuICAgICAgICB0aGlzLl9zdGFydFBvc2l0aW9uLnggPSBsb2NQb3NYO1xuICAgICAgICB0aGlzLl9zdGFydFBvc2l0aW9uLnkgPSBsb2NQb3NZO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6ZnVuY3Rpb24gKGR0KSB7XG4gICAgICAgIGR0ID0gdGhpcy5fY29tcHV0ZUVhc2VUaW1lKGR0KTtcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0KSB7XG4gICAgICAgICAgICB2YXIgZnJhYyA9IGR0ICogdGhpcy5fanVtcHMgJSAxLjA7XG4gICAgICAgICAgICB2YXIgeSA9IHRoaXMuX2hlaWdodCAqIDQgKiBmcmFjICogKDEgLSBmcmFjKTtcbiAgICAgICAgICAgIHkgKz0gdGhpcy5fZGVsdGEueSAqIGR0O1xuXG4gICAgICAgICAgICB2YXIgeCA9IHRoaXMuX2RlbHRhLnggKiBkdDtcbiAgICAgICAgICAgIHZhciBsb2NTdGFydFBvc2l0aW9uID0gdGhpcy5fc3RhcnRQb3NpdGlvbjtcbiAgICAgICAgICAgIGlmIChjYy5tYWNyby5FTkFCTEVfU1RBQ0tBQkxFX0FDVElPTlMpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0WCA9IHRoaXMudGFyZ2V0Lng7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldFkgPSB0aGlzLnRhcmdldC55O1xuICAgICAgICAgICAgICAgIHZhciBsb2NQcmV2aW91c1Bvc2l0aW9uID0gdGhpcy5fcHJldmlvdXNQb3NpdGlvbjtcblxuICAgICAgICAgICAgICAgIGxvY1N0YXJ0UG9zaXRpb24ueCA9IGxvY1N0YXJ0UG9zaXRpb24ueCArIHRhcmdldFggLSBsb2NQcmV2aW91c1Bvc2l0aW9uLng7XG4gICAgICAgICAgICAgICAgbG9jU3RhcnRQb3NpdGlvbi55ID0gbG9jU3RhcnRQb3NpdGlvbi55ICsgdGFyZ2V0WSAtIGxvY1ByZXZpb3VzUG9zaXRpb24ueTtcbiAgICAgICAgICAgICAgICB4ID0geCArIGxvY1N0YXJ0UG9zaXRpb24ueDtcbiAgICAgICAgICAgICAgICB5ID0geSArIGxvY1N0YXJ0UG9zaXRpb24ueTtcblx0ICAgICAgICAgICAgbG9jUHJldmlvdXNQb3NpdGlvbi54ID0geDtcblx0ICAgICAgICAgICAgbG9jUHJldmlvdXNQb3NpdGlvbi55ID0geTtcblx0ICAgICAgICAgICAgdGhpcy50YXJnZXQuc2V0UG9zaXRpb24oeCwgeSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0LnNldFBvc2l0aW9uKGxvY1N0YXJ0UG9zaXRpb24ueCArIHgsIGxvY1N0YXJ0UG9zaXRpb24ueSArIHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHJldmVyc2U6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLkp1bXBCeSh0aGlzLl9kdXJhdGlvbiwgY2MudjIoLXRoaXMuX2RlbHRhLngsIC10aGlzLl9kZWx0YS55KSwgdGhpcy5faGVpZ2h0LCB0aGlzLl9qdW1wcyk7XG4gICAgICAgIHRoaXMuX2Nsb25lRGVjb3JhdGlvbihhY3Rpb24pO1xuICAgICAgICB0aGlzLl9yZXZlcnNlRWFzZUxpc3QoYWN0aW9uKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9XG59KTtcblxuLyoqXG4gKiAhI2VuXG4gKiBNb3ZlcyBhIE5vZGUgb2JqZWN0IHNpbXVsYXRpbmcgYSBwYXJhYm9saWMganVtcCBtb3ZlbWVudCBieSBtb2RpZnlpbmcgaXQncyBwb3NpdGlvbiBwcm9wZXJ0eS5cbiAqIFJlbGF0aXZlIHRvIGl0cyBtb3ZlbWVudC5cbiAqICEjemgg55So6Lez6LeD55qE5pa55byP56e75Yqo5oyH5a6a55qE6Led56a744CCXG4gKiBAbWV0aG9kIGp1bXBCeVxuICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uXG4gKiBAcGFyYW0ge1ZlYzJ8TnVtYmVyfSBwb3NpdGlvblxuICogQHBhcmFtIHtOdW1iZXJ9IFt5XVxuICogQHBhcmFtIHtOdW1iZXJ9IFtoZWlnaHRdXG4gKiBAcGFyYW0ge051bWJlcn0gW2p1bXBzXVxuICogQHJldHVybiB7QWN0aW9uSW50ZXJ2YWx9XG4gKiBAZXhhbXBsZVxuICogLy8gZXhhbXBsZVxuICogdmFyIGFjdGlvbkJ5ID0gY2MuanVtcEJ5KDIsIGNjLnYyKDMwMCwgMCksIDUwLCA0KTtcbiAqIHZhciBhY3Rpb25CeSA9IGNjLmp1bXBCeSgyLCAzMDAsIDAsIDUwLCA0KTtcbiAqL1xuY2MuanVtcEJ5ID0gZnVuY3Rpb24gKGR1cmF0aW9uLCBwb3NpdGlvbiwgeSwgaGVpZ2h0LCBqdW1wcykge1xuICAgIHJldHVybiBuZXcgY2MuSnVtcEJ5KGR1cmF0aW9uLCBwb3NpdGlvbiwgeSwgaGVpZ2h0LCBqdW1wcyk7XG59O1xuXG4vKlxuICogTW92ZXMgYSBOb2RlIG9iamVjdCB0byBhIHBhcmFib2xpYyBwb3NpdGlvbiBzaW11bGF0aW5nIGEganVtcCBtb3ZlbWVudCBieSBtb2RpZnlpbmcgaXQncyBwb3NpdGlvbiBwcm9wZXJ0eS4gPGJyIC8+XG4gKiBKdW1wIHRvIHRoZSBzcGVjaWZpZWQgbG9jYXRpb24uXG4gKiBAY2xhc3MgSnVtcFRvXG4gKiBAZXh0ZW5kcyBKdW1wQnlcbiAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvblxuICogQHBhcmFtIHtWZWMyfE51bWJlcn0gcG9zaXRpb25cbiAqIEBwYXJhbSB7TnVtYmVyfSBbeV1cbiAqIEBwYXJhbSB7TnVtYmVyfSBbaGVpZ2h0XVxuICogQHBhcmFtIHtOdW1iZXJ9IFtqdW1wc11cbiAqIEBleGFtcGxlXG4gKiB2YXIgYWN0aW9uVG8gPSBuZXcgY2MuSnVtcFRvKDIsIGNjLnYyKDMwMCwgMCksIDUwLCA0KTtcbiAqIHZhciBhY3Rpb25UbyA9IG5ldyBjYy5KdW1wVG8oMiwgMzAwLCAwLCA1MCwgNCk7XG4gKi9cbmNjLkp1bXBUbyA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuSnVtcFRvJyxcbiAgICBleHRlbmRzOiBjYy5KdW1wQnksXG5cbiAgICBjdG9yOmZ1bmN0aW9uIChkdXJhdGlvbiwgcG9zaXRpb24sIHksIGhlaWdodCwganVtcHMpIHtcbiAgICAgICAgdGhpcy5fZW5kUG9zaXRpb24gPSBjYy52MigwLCAwKTtcbiAgICAgICAgaGVpZ2h0ICE9PSB1bmRlZmluZWQgJiYgdGhpcy5pbml0V2l0aER1cmF0aW9uKGR1cmF0aW9uLCBwb3NpdGlvbiwgeSwgaGVpZ2h0LCBqdW1wcyk7XG4gICAgfSxcbiAgICAvKlxuICAgICAqIEluaXRpYWxpemVzIHRoZSBhY3Rpb24uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uXG4gICAgICogQHBhcmFtIHtWZWMyfE51bWJlcn0gcG9zaXRpb25cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3ldXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGhlaWdodFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBqdW1wc1xuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBhY3Rpb25Uby5pbml0V2l0aER1cmF0aW9uKDIsIGNjLnYyKDMwMCwgMCksIDUwLCA0KTtcbiAgICAgKiBhY3Rpb25Uby5pbml0V2l0aER1cmF0aW9uKDIsIDMwMCwgMCwgNTAsIDQpO1xuICAgICAqL1xuICAgIGluaXRXaXRoRHVyYXRpb246ZnVuY3Rpb24gKGR1cmF0aW9uLCBwb3NpdGlvbiwgeSwgaGVpZ2h0LCBqdW1wcykge1xuICAgICAgICBpZiAoY2MuSnVtcEJ5LnByb3RvdHlwZS5pbml0V2l0aER1cmF0aW9uLmNhbGwodGhpcywgZHVyYXRpb24sIHBvc2l0aW9uLCB5LCBoZWlnaHQsIGp1bXBzKSkge1xuICAgICAgICAgICAgaWYgKGp1bXBzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB5ID0gcG9zaXRpb24ueTtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IHBvc2l0aW9uLng7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9lbmRQb3NpdGlvbi54ID0gcG9zaXRpb247XG4gICAgICAgICAgICB0aGlzLl9lbmRQb3NpdGlvbi55ID0geTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgc3RhcnRXaXRoVGFyZ2V0OmZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgY2MuSnVtcEJ5LnByb3RvdHlwZS5zdGFydFdpdGhUYXJnZXQuY2FsbCh0aGlzLCB0YXJnZXQpO1xuICAgICAgICB0aGlzLl9kZWx0YS54ID0gdGhpcy5fZW5kUG9zaXRpb24ueCAtIHRoaXMuX3N0YXJ0UG9zaXRpb24ueDtcbiAgICAgICAgdGhpcy5fZGVsdGEueSA9IHRoaXMuX2VuZFBvc2l0aW9uLnkgLSB0aGlzLl9zdGFydFBvc2l0aW9uLnk7XG4gICAgfSxcblxuICAgIGNsb25lOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5KdW1wVG8oKTtcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XG4gICAgICAgIGFjdGlvbi5pbml0V2l0aER1cmF0aW9uKHRoaXMuX2R1cmF0aW9uLCB0aGlzLl9lbmRQb3NpdGlvbiwgdGhpcy5faGVpZ2h0LCB0aGlzLl9qdW1wcyk7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfVxufSk7XG5cbi8qKlxuICogISNlblxuICogTW92ZXMgYSBOb2RlIG9iamVjdCB0byBhIHBhcmFib2xpYyBwb3NpdGlvbiBzaW11bGF0aW5nIGEganVtcCBtb3ZlbWVudCBieSBtb2RpZnlpbmcgaXRzIHBvc2l0aW9uIHByb3BlcnR5LiA8YnIgLz5cbiAqIEp1bXAgdG8gdGhlIHNwZWNpZmllZCBsb2NhdGlvbi5cbiAqICEjemgg55So6Lez6LeD55qE5pa55byP56e75Yqo5Yiw55uu5qCH5L2N572u44CCXG4gKiBAbWV0aG9kIGp1bXBUb1xuICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uXG4gKiBAcGFyYW0ge1ZlYzJ8TnVtYmVyfSBwb3NpdGlvblxuICogQHBhcmFtIHtOdW1iZXJ9IFt5XVxuICogQHBhcmFtIHtOdW1iZXJ9IFtoZWlnaHRdXG4gKiBAcGFyYW0ge051bWJlcn0gW2p1bXBzXVxuICogQHJldHVybiB7QWN0aW9uSW50ZXJ2YWx9XG4gKiBAZXhhbXBsZVxuICogLy8gZXhhbXBsZVxuICogdmFyIGFjdGlvblRvID0gY2MuanVtcFRvKDIsIGNjLnYyKDMwMCwgMzAwKSwgNTAsIDQpO1xuICogdmFyIGFjdGlvblRvID0gY2MuanVtcFRvKDIsIDMwMCwgMzAwLCA1MCwgNCk7XG4gKi9cbmNjLmp1bXBUbyA9IGZ1bmN0aW9uIChkdXJhdGlvbiwgcG9zaXRpb24sIHksIGhlaWdodCwganVtcHMpIHtcbiAgICByZXR1cm4gbmV3IGNjLkp1bXBUbyhkdXJhdGlvbiwgcG9zaXRpb24sIHksIGhlaWdodCwganVtcHMpO1xufTtcblxuLyogQW4gYWN0aW9uIHRoYXQgbW92ZXMgdGhlIHRhcmdldCB3aXRoIGEgY3ViaWMgQmV6aWVyIGN1cnZlIGJ5IGEgY2VydGFpbiBkaXN0YW5jZS5cbiAqIFJlbGF0aXZlIHRvIGl0cyBtb3ZlbWVudC5cbiAqIEBjbGFzcyBCZXppZXJCeVxuICogQGV4dGVuZHMgQWN0aW9uSW50ZXJ2YWxcbiAqIEBwYXJhbSB7TnVtYmVyfSB0IC0gdGltZSBpbiBzZWNvbmRzXG4gKiBAcGFyYW0ge1ZlYzJbXX0gYyAtIEFycmF5IG9mIHBvaW50c1xuICogQGV4YW1wbGVcbiAqIHZhciBiZXppZXIgPSBbY2MudjIoMCwgd2luZG93U2l6ZS5oZWlnaHQgLyAyKSwgY2MudjIoMzAwLCAtd2luZG93U2l6ZS5oZWlnaHQgLyAyKSwgY2MudjIoMzAwLCAxMDApXTtcbiAqIHZhciBiZXppZXJGb3J3YXJkID0gbmV3IGNjLkJlemllckJ5KDMsIGJlemllcik7XG4gKi9cbmZ1bmN0aW9uIGJlemllckF0IChhLCBiLCBjLCBkLCB0KSB7XG4gICAgcmV0dXJuIChNYXRoLnBvdygxIC0gdCwgMykgKiBhICtcbiAgICAgICAgMyAqIHQgKiAoTWF0aC5wb3coMSAtIHQsIDIpKSAqIGIgK1xuICAgICAgICAzICogTWF0aC5wb3codCwgMikgKiAoMSAtIHQpICogYyArXG4gICAgICAgIE1hdGgucG93KHQsIDMpICogZCApO1xufTtcbmNjLkJlemllckJ5ID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5CZXppZXJCeScsXG4gICAgZXh0ZW5kczogY2MuQWN0aW9uSW50ZXJ2YWwsXG5cbiAgICBjdG9yOmZ1bmN0aW9uICh0LCBjKSB7XG4gICAgICAgIHRoaXMuX2NvbmZpZyA9IFtdO1xuICAgICAgICB0aGlzLl9zdGFydFBvc2l0aW9uID0gY2MudjIoMCwgMCk7XG4gICAgICAgIHRoaXMuX3ByZXZpb3VzUG9zaXRpb24gPSBjYy52MigwLCAwKTtcbiAgICAgICAgYyAmJiBjYy5CZXppZXJCeS5wcm90b3R5cGUuaW5pdFdpdGhEdXJhdGlvbi5jYWxsKHRoaXMsIHQsIGMpO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIEluaXRpYWxpemVzIHRoZSBhY3Rpb24uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHQgLSB0aW1lIGluIHNlY29uZHNcbiAgICAgKiBAcGFyYW0ge1ZlYzJbXX0gYyAtIEFycmF5IG9mIHBvaW50c1xuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaW5pdFdpdGhEdXJhdGlvbjpmdW5jdGlvbiAodCwgYykge1xuICAgICAgICBpZiAoY2MuQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLmluaXRXaXRoRHVyYXRpb24uY2FsbCh0aGlzLCB0KSkge1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnID0gYztcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgY2xvbmU6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLkJlemllckJ5KCk7XG4gICAgICAgIHRoaXMuX2Nsb25lRGVjb3JhdGlvbihhY3Rpb24pO1xuICAgICAgICB2YXIgbmV3Q29uZmlncyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2NvbmZpZy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHNlbENvbmYgPSB0aGlzLl9jb25maWdbaV07XG4gICAgICAgICAgICBuZXdDb25maWdzLnB1c2goY2MudjIoc2VsQ29uZi54LCBzZWxDb25mLnkpKTtcbiAgICAgICAgfVxuICAgICAgICBhY3Rpb24uaW5pdFdpdGhEdXJhdGlvbih0aGlzLl9kdXJhdGlvbiwgbmV3Q29uZmlncyk7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfSxcblxuICAgIHN0YXJ0V2l0aFRhcmdldDpmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIGNjLkFjdGlvbkludGVydmFsLnByb3RvdHlwZS5zdGFydFdpdGhUYXJnZXQuY2FsbCh0aGlzLCB0YXJnZXQpO1xuICAgICAgICB2YXIgbG9jUG9zWCA9IHRhcmdldC54O1xuICAgICAgICB2YXIgbG9jUG9zWSA9IHRhcmdldC55O1xuICAgICAgICB0aGlzLl9wcmV2aW91c1Bvc2l0aW9uLnggPSBsb2NQb3NYO1xuICAgICAgICB0aGlzLl9wcmV2aW91c1Bvc2l0aW9uLnkgPSBsb2NQb3NZO1xuICAgICAgICB0aGlzLl9zdGFydFBvc2l0aW9uLnggPSBsb2NQb3NYO1xuICAgICAgICB0aGlzLl9zdGFydFBvc2l0aW9uLnkgPSBsb2NQb3NZO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6ZnVuY3Rpb24gKGR0KSB7XG4gICAgICAgIGR0ID0gdGhpcy5fY29tcHV0ZUVhc2VUaW1lKGR0KTtcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0KSB7XG4gICAgICAgICAgICB2YXIgbG9jQ29uZmlnID0gdGhpcy5fY29uZmlnO1xuICAgICAgICAgICAgdmFyIHhhID0gMDtcbiAgICAgICAgICAgIHZhciB4YiA9IGxvY0NvbmZpZ1swXS54O1xuICAgICAgICAgICAgdmFyIHhjID0gbG9jQ29uZmlnWzFdLng7XG4gICAgICAgICAgICB2YXIgeGQgPSBsb2NDb25maWdbMl0ueDtcblxuICAgICAgICAgICAgdmFyIHlhID0gMDtcbiAgICAgICAgICAgIHZhciB5YiA9IGxvY0NvbmZpZ1swXS55O1xuICAgICAgICAgICAgdmFyIHljID0gbG9jQ29uZmlnWzFdLnk7XG4gICAgICAgICAgICB2YXIgeWQgPSBsb2NDb25maWdbMl0ueTtcblxuICAgICAgICAgICAgdmFyIHggPSBiZXppZXJBdCh4YSwgeGIsIHhjLCB4ZCwgZHQpO1xuICAgICAgICAgICAgdmFyIHkgPSBiZXppZXJBdCh5YSwgeWIsIHljLCB5ZCwgZHQpO1xuXG4gICAgICAgICAgICB2YXIgbG9jU3RhcnRQb3NpdGlvbiA9IHRoaXMuX3N0YXJ0UG9zaXRpb247XG4gICAgICAgICAgICBpZiAoY2MubWFjcm8uRU5BQkxFX1NUQUNLQUJMRV9BQ1RJT05TKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldFggPSB0aGlzLnRhcmdldC54O1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXRZID0gdGhpcy50YXJnZXQueTtcbiAgICAgICAgICAgICAgICB2YXIgbG9jUHJldmlvdXNQb3NpdGlvbiA9IHRoaXMuX3ByZXZpb3VzUG9zaXRpb247XG5cbiAgICAgICAgICAgICAgICBsb2NTdGFydFBvc2l0aW9uLnggPSBsb2NTdGFydFBvc2l0aW9uLnggKyB0YXJnZXRYIC0gbG9jUHJldmlvdXNQb3NpdGlvbi54O1xuICAgICAgICAgICAgICAgIGxvY1N0YXJ0UG9zaXRpb24ueSA9IGxvY1N0YXJ0UG9zaXRpb24ueSArIHRhcmdldFkgLSBsb2NQcmV2aW91c1Bvc2l0aW9uLnk7XG4gICAgICAgICAgICAgICAgeCA9IHggKyBsb2NTdGFydFBvc2l0aW9uLng7XG4gICAgICAgICAgICAgICAgeSA9IHkgKyBsb2NTdGFydFBvc2l0aW9uLnk7XG5cdCAgICAgICAgICAgIGxvY1ByZXZpb3VzUG9zaXRpb24ueCA9IHg7XG5cdCAgICAgICAgICAgIGxvY1ByZXZpb3VzUG9zaXRpb24ueSA9IHk7XG5cdCAgICAgICAgICAgIHRoaXMudGFyZ2V0LnNldFBvc2l0aW9uKHgsIHkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldC5zZXRQb3NpdGlvbihsb2NTdGFydFBvc2l0aW9uLnggKyB4LCBsb2NTdGFydFBvc2l0aW9uLnkgKyB5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZXZlcnNlOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGxvY0NvbmZpZyA9IHRoaXMuX2NvbmZpZztcbiAgICAgICAgdmFyIHgwID0gbG9jQ29uZmlnWzBdLngsIHkwID0gbG9jQ29uZmlnWzBdLnk7XG4gICAgICAgIHZhciB4MSA9IGxvY0NvbmZpZ1sxXS54LCB5MSA9IGxvY0NvbmZpZ1sxXS55O1xuICAgICAgICB2YXIgeDIgPSBsb2NDb25maWdbMl0ueCwgeTIgPSBsb2NDb25maWdbMl0ueTtcbiAgICAgICAgdmFyIHIgPSBbXG4gICAgICAgICAgICBjYy52Mih4MSAtIHgyLCB5MSAtIHkyKSxcbiAgICAgICAgICAgIGNjLnYyKHgwIC0geDIsIHkwIC0geTIpLFxuICAgICAgICAgICAgY2MudjIoLXgyLCAteTIpIF07XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuQmV6aWVyQnkodGhpcy5fZHVyYXRpb24sIHIpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgdGhpcy5fcmV2ZXJzZUVhc2VMaXN0KGFjdGlvbik7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfVxufSk7XG5cbi8qKlxuICogISNlblxuICogQW4gYWN0aW9uIHRoYXQgbW92ZXMgdGhlIHRhcmdldCB3aXRoIGEgY3ViaWMgQmV6aWVyIGN1cnZlIGJ5IGEgY2VydGFpbiBkaXN0YW5jZS5cbiAqIFJlbGF0aXZlIHRvIGl0cyBtb3ZlbWVudC5cbiAqICEjemgg5oyJ6LSd6LWb5bCU5puy57q/6L2o6L+556e75Yqo5oyH5a6a55qE6Led56a744CCXG4gKiBAbWV0aG9kIGJlemllckJ5XG4gKiBAcGFyYW0ge051bWJlcn0gdCAtIHRpbWUgaW4gc2Vjb25kc1xuICogQHBhcmFtIHtWZWMyW119IGMgLSBBcnJheSBvZiBwb2ludHNcbiAqIEByZXR1cm4ge0FjdGlvbkludGVydmFsfVxuICogQGV4YW1wbGVcbiAqIC8vIGV4YW1wbGVcbiAqIHZhciBiZXppZXIgPSBbY2MudjIoMCwgd2luZG93U2l6ZS5oZWlnaHQgLyAyKSwgY2MudjIoMzAwLCAtd2luZG93U2l6ZS5oZWlnaHQgLyAyKSwgY2MudjIoMzAwLCAxMDApXTtcbiAqIHZhciBiZXppZXJGb3J3YXJkID0gY2MuYmV6aWVyQnkoMywgYmV6aWVyKTtcbiAqL1xuY2MuYmV6aWVyQnkgPSBmdW5jdGlvbiAodCwgYykge1xuICAgIHJldHVybiBuZXcgY2MuQmV6aWVyQnkodCwgYyk7XG59O1xuXG5cbi8qIEFuIGFjdGlvbiB0aGF0IG1vdmVzIHRoZSB0YXJnZXQgd2l0aCBhIGN1YmljIEJlemllciBjdXJ2ZSB0byBhIGRlc3RpbmF0aW9uIHBvaW50LlxuICogQGNsYXNzIEJlemllclRvXG4gKiBAZXh0ZW5kcyBCZXppZXJCeVxuICogQHBhcmFtIHtOdW1iZXJ9IHRcbiAqIEBwYXJhbSB7VmVjMltdfSBjIC0gQXJyYXkgb2YgcG9pbnRzXG4gKiBAZXhhbXBsZVxuICogdmFyIGJlemllciA9IFtjYy52MigwLCB3aW5kb3dTaXplLmhlaWdodCAvIDIpLCBjYy52MigzMDAsIC13aW5kb3dTaXplLmhlaWdodCAvIDIpLCBjYy52MigzMDAsIDEwMCldO1xuICogdmFyIGJlemllclRvID0gbmV3IGNjLkJlemllclRvKDIsIGJlemllcik7XG4gKi9cbmNjLkJlemllclRvID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5CZXppZXJUbycsXG4gICAgZXh0ZW5kczogY2MuQmV6aWVyQnksXG5cbiAgICBjdG9yOmZ1bmN0aW9uICh0LCBjKSB7XG4gICAgICAgIHRoaXMuX3RvQ29uZmlnID0gW107XG5cdFx0YyAmJiB0aGlzLmluaXRXaXRoRHVyYXRpb24odCwgYyk7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogSW5pdGlhbGl6ZXMgdGhlIGFjdGlvbi5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdCB0aW1lIGluIHNlY29uZHNcbiAgICAgKiBAcGFyYW0ge1ZlYzJbXX0gYyAtIEFycmF5IG9mIHBvaW50c1xuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaW5pdFdpdGhEdXJhdGlvbjpmdW5jdGlvbiAodCwgYykge1xuICAgICAgICBpZiAoY2MuQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLmluaXRXaXRoRHVyYXRpb24uY2FsbCh0aGlzLCB0KSkge1xuICAgICAgICAgICAgdGhpcy5fdG9Db25maWcgPSBjO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICBjbG9uZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuQmV6aWVyVG8oKTtcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XG4gICAgICAgIGFjdGlvbi5pbml0V2l0aER1cmF0aW9uKHRoaXMuX2R1cmF0aW9uLCB0aGlzLl90b0NvbmZpZyk7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfSxcblxuICAgIHN0YXJ0V2l0aFRhcmdldDpmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIGNjLkJlemllckJ5LnByb3RvdHlwZS5zdGFydFdpdGhUYXJnZXQuY2FsbCh0aGlzLCB0YXJnZXQpO1xuICAgICAgICB2YXIgbG9jU3RhcnRQb3MgPSB0aGlzLl9zdGFydFBvc2l0aW9uO1xuICAgICAgICB2YXIgbG9jVG9Db25maWcgPSB0aGlzLl90b0NvbmZpZztcbiAgICAgICAgdmFyIGxvY0NvbmZpZyA9IHRoaXMuX2NvbmZpZztcblxuICAgICAgICBsb2NDb25maWdbMF0gPSBsb2NUb0NvbmZpZ1swXS5zdWIobG9jU3RhcnRQb3MpO1xuICAgICAgICBsb2NDb25maWdbMV0gPSBsb2NUb0NvbmZpZ1sxXS5zdWIobG9jU3RhcnRQb3MpO1xuICAgICAgICBsb2NDb25maWdbMl0gPSBsb2NUb0NvbmZpZ1syXS5zdWIobG9jU3RhcnRQb3MpO1xuICAgIH1cbn0pO1xuLyoqXG4gKiAhI2VuIEFuIGFjdGlvbiB0aGF0IG1vdmVzIHRoZSB0YXJnZXQgd2l0aCBhIGN1YmljIEJlemllciBjdXJ2ZSB0byBhIGRlc3RpbmF0aW9uIHBvaW50LlxuICogISN6aCDmjInotJ3otZvlsJTmm7Lnur/ovajov7nnp7vliqjliLDnm67moIfkvY3nva7jgIJcbiAqIEBtZXRob2QgYmV6aWVyVG9cbiAqIEBwYXJhbSB7TnVtYmVyfSB0XG4gKiBAcGFyYW0ge1ZlYzJbXX0gYyAtIEFycmF5IG9mIHBvaW50c1xuICogQHJldHVybiB7QWN0aW9uSW50ZXJ2YWx9XG4gKiBAZXhhbXBsZVxuICogLy8gZXhhbXBsZVxuICogdmFyIGJlemllciA9IFtjYy52MigwLCB3aW5kb3dTaXplLmhlaWdodCAvIDIpLCBjYy52MigzMDAsIC13aW5kb3dTaXplLmhlaWdodCAvIDIpLCBjYy52MigzMDAsIDEwMCldO1xuICogdmFyIGJlemllclRvID0gY2MuYmV6aWVyVG8oMiwgYmV6aWVyKTtcbiAqL1xuY2MuYmV6aWVyVG8gPSBmdW5jdGlvbiAodCwgYykge1xuICAgIHJldHVybiBuZXcgY2MuQmV6aWVyVG8odCwgYyk7XG59O1xuXG5cbi8qIFNjYWxlcyBhIE5vZGUgb2JqZWN0IHRvIGEgem9vbSBmYWN0b3IgYnkgbW9kaWZ5aW5nIGl0J3Mgc2NhbGUgcHJvcGVydHkuXG4gKiBAd2FybmluZyBUaGlzIGFjdGlvbiBkb2Vzbid0IHN1cHBvcnQgXCJyZXZlcnNlXCJcbiAqIEBjbGFzcyBTY2FsZVRvXG4gKiBAZXh0ZW5kcyBBY3Rpb25JbnRlcnZhbFxuICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uXG4gKiBAcGFyYW0ge051bWJlcn0gc3ggIHNjYWxlIHBhcmFtZXRlciBpbiBYXG4gKiBAcGFyYW0ge051bWJlcn0gW3N5XSBzY2FsZSBwYXJhbWV0ZXIgaW4gWSwgaWYgTnVsbCBlcXVhbCB0byBzeFxuICogQGV4YW1wbGVcbiAqIC8vIEl0IHNjYWxlcyB0byAwLjUgaW4gYm90aCBYIGFuZCBZLlxuICogdmFyIGFjdGlvblRvID0gbmV3IGNjLlNjYWxlVG8oMiwgMC41KTtcbiAqXG4gKiAvLyBJdCBzY2FsZXMgdG8gMC41IGluIHggYW5kIDIgaW4gWVxuICogdmFyIGFjdGlvblRvID0gbmV3IGNjLlNjYWxlVG8oMiwgMC41LCAyKTtcbiAqL1xuY2MuU2NhbGVUbyA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuU2NhbGVUbycsXG4gICAgZXh0ZW5kczogY2MuQWN0aW9uSW50ZXJ2YWwsXG5cbiAgICBjdG9yOmZ1bmN0aW9uIChkdXJhdGlvbiwgc3gsIHN5KSB7XG4gICAgICAgIHRoaXMuX3NjYWxlWCA9IDE7XG4gICAgICAgIHRoaXMuX3NjYWxlWSA9IDE7XG4gICAgICAgIHRoaXMuX3N0YXJ0U2NhbGVYID0gMTtcbiAgICAgICAgdGhpcy5fc3RhcnRTY2FsZVkgPSAxO1xuICAgICAgICB0aGlzLl9lbmRTY2FsZVggPSAwO1xuICAgICAgICB0aGlzLl9lbmRTY2FsZVkgPSAwO1xuICAgICAgICB0aGlzLl9kZWx0YVggPSAwO1xuICAgICAgICB0aGlzLl9kZWx0YVkgPSAwO1xuICAgICAgICBzeCAhPT0gdW5kZWZpbmVkICYmIGNjLlNjYWxlVG8ucHJvdG90eXBlLmluaXRXaXRoRHVyYXRpb24uY2FsbCh0aGlzLCBkdXJhdGlvbiwgc3gsIHN5KTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBJbml0aWFsaXplcyB0aGUgYWN0aW9uLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzeFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbc3k9XVxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaW5pdFdpdGhEdXJhdGlvbjpmdW5jdGlvbiAoZHVyYXRpb24sIHN4LCBzeSkgeyAvL2Z1bmN0aW9uIG92ZXJsb2FkIGhlcmVcbiAgICAgICAgaWYgKGNjLkFjdGlvbkludGVydmFsLnByb3RvdHlwZS5pbml0V2l0aER1cmF0aW9uLmNhbGwodGhpcywgZHVyYXRpb24pKSB7XG4gICAgICAgICAgICB0aGlzLl9lbmRTY2FsZVggPSBzeDtcbiAgICAgICAgICAgIHRoaXMuX2VuZFNjYWxlWSA9IChzeSAhPSBudWxsKSA/IHN5IDogc3g7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIGNsb25lOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5TY2FsZVRvKCk7XG4gICAgICAgIHRoaXMuX2Nsb25lRGVjb3JhdGlvbihhY3Rpb24pO1xuICAgICAgICBhY3Rpb24uaW5pdFdpdGhEdXJhdGlvbih0aGlzLl9kdXJhdGlvbiwgdGhpcy5fZW5kU2NhbGVYLCB0aGlzLl9lbmRTY2FsZVkpO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH0sXG5cbiAgICBzdGFydFdpdGhUYXJnZXQ6ZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICBjYy5BY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuc3RhcnRXaXRoVGFyZ2V0LmNhbGwodGhpcywgdGFyZ2V0KTtcbiAgICAgICAgdGhpcy5fc3RhcnRTY2FsZVggPSB0YXJnZXQuc2NhbGVYO1xuICAgICAgICB0aGlzLl9zdGFydFNjYWxlWSA9IHRhcmdldC5zY2FsZVk7XG4gICAgICAgIHRoaXMuX2RlbHRhWCA9IHRoaXMuX2VuZFNjYWxlWCAtIHRoaXMuX3N0YXJ0U2NhbGVYO1xuICAgICAgICB0aGlzLl9kZWx0YVkgPSB0aGlzLl9lbmRTY2FsZVkgLSB0aGlzLl9zdGFydFNjYWxlWTtcbiAgICB9LFxuXG4gICAgdXBkYXRlOmZ1bmN0aW9uIChkdCkge1xuICAgICAgICBkdCA9IHRoaXMuX2NvbXB1dGVFYXNlVGltZShkdCk7XG4gICAgICAgIGlmICh0aGlzLnRhcmdldCkge1xuICAgICAgICAgICAgdGhpcy50YXJnZXQuc2NhbGVYID0gdGhpcy5fc3RhcnRTY2FsZVggKyB0aGlzLl9kZWx0YVggKiBkdDtcblx0ICAgICAgICB0aGlzLnRhcmdldC5zY2FsZVkgPSB0aGlzLl9zdGFydFNjYWxlWSArIHRoaXMuX2RlbHRhWSAqIGR0O1xuICAgICAgICB9XG4gICAgfVxufSk7XG4vKipcbiAqICEjZW4gU2NhbGVzIGEgTm9kZSBvYmplY3QgdG8gYSB6b29tIGZhY3RvciBieSBtb2RpZnlpbmcgaXQncyBzY2FsZSBwcm9wZXJ0eS5cbiAqICEjemgg5bCG6IqC54K55aSn5bCP57yp5pS+5Yiw5oyH5a6a55qE5YCN5pWw44CCXG4gKiBAbWV0aG9kIHNjYWxlVG9cbiAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvblxuICogQHBhcmFtIHtOdW1iZXJ9IHN4ICBzY2FsZSBwYXJhbWV0ZXIgaW4gWFxuICogQHBhcmFtIHtOdW1iZXJ9IFtzeV0gc2NhbGUgcGFyYW1ldGVyIGluIFksIGlmIE51bGwgZXF1YWwgdG8gc3hcbiAqIEByZXR1cm4ge0FjdGlvbkludGVydmFsfVxuICogQGV4YW1wbGVcbiAqIC8vIGV4YW1wbGVcbiAqIC8vIEl0IHNjYWxlcyB0byAwLjUgaW4gYm90aCBYIGFuZCBZLlxuICogdmFyIGFjdGlvblRvID0gY2Muc2NhbGVUbygyLCAwLjUpO1xuICpcbiAqIC8vIEl0IHNjYWxlcyB0byAwLjUgaW4geCBhbmQgMiBpbiBZXG4gKiB2YXIgYWN0aW9uVG8gPSBjYy5zY2FsZVRvKDIsIDAuNSwgMik7XG4gKi9cbmNjLnNjYWxlVG8gPSBmdW5jdGlvbiAoZHVyYXRpb24sIHN4LCBzeSkgeyAvL2Z1bmN0aW9uIG92ZXJsb2FkXG4gICAgcmV0dXJuIG5ldyBjYy5TY2FsZVRvKGR1cmF0aW9uLCBzeCwgc3kpO1xufTtcblxuXG4vKiBTY2FsZXMgYSBOb2RlIG9iamVjdCBhIHpvb20gZmFjdG9yIGJ5IG1vZGlmeWluZyBpdCdzIHNjYWxlIHByb3BlcnR5LlxuICogUmVsYXRpdmUgdG8gaXRzIGNoYW5nZXMuXG4gKiBAY2xhc3MgU2NhbGVCeVxuICogQGV4dGVuZHMgU2NhbGVUb1xuICovXG5jYy5TY2FsZUJ5ID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5TY2FsZUJ5JyxcbiAgICBleHRlbmRzOiBjYy5TY2FsZVRvLFxuXG4gICAgc3RhcnRXaXRoVGFyZ2V0OmZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgY2MuU2NhbGVUby5wcm90b3R5cGUuc3RhcnRXaXRoVGFyZ2V0LmNhbGwodGhpcywgdGFyZ2V0KTtcbiAgICAgICAgdGhpcy5fZGVsdGFYID0gdGhpcy5fc3RhcnRTY2FsZVggKiB0aGlzLl9lbmRTY2FsZVggLSB0aGlzLl9zdGFydFNjYWxlWDtcbiAgICAgICAgdGhpcy5fZGVsdGFZID0gdGhpcy5fc3RhcnRTY2FsZVkgKiB0aGlzLl9lbmRTY2FsZVkgLSB0aGlzLl9zdGFydFNjYWxlWTtcbiAgICB9LFxuXG4gICAgcmV2ZXJzZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuU2NhbGVCeSh0aGlzLl9kdXJhdGlvbiwgMSAvIHRoaXMuX2VuZFNjYWxlWCwgMSAvIHRoaXMuX2VuZFNjYWxlWSk7XG4gICAgICAgIHRoaXMuX2Nsb25lRGVjb3JhdGlvbihhY3Rpb24pO1xuICAgICAgICB0aGlzLl9yZXZlcnNlRWFzZUxpc3QoYWN0aW9uKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9LFxuXG4gICAgY2xvbmU6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLlNjYWxlQnkoKTtcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XG4gICAgICAgIGFjdGlvbi5pbml0V2l0aER1cmF0aW9uKHRoaXMuX2R1cmF0aW9uLCB0aGlzLl9lbmRTY2FsZVgsIHRoaXMuX2VuZFNjYWxlWSk7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfVxufSk7XG4vKipcbiAqICEjZW5cbiAqIFNjYWxlcyBhIE5vZGUgb2JqZWN0IGEgem9vbSBmYWN0b3IgYnkgbW9kaWZ5aW5nIGl0J3Mgc2NhbGUgcHJvcGVydHkuXG4gKiBSZWxhdGl2ZSB0byBpdHMgY2hhbmdlcy5cbiAqICEjemgg5oyJ5oyH5a6a55qE5YCN5pWw57yp5pS+6IqC54K55aSn5bCP44CCXG4gKiBAbWV0aG9kIHNjYWxlQnlcbiAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvbiBkdXJhdGlvbiBpbiBzZWNvbmRzXG4gKiBAcGFyYW0ge051bWJlcn0gc3ggc3ggIHNjYWxlIHBhcmFtZXRlciBpbiBYXG4gKiBAcGFyYW0ge051bWJlcnxOdWxsfSBbc3k9XSBzeSBzY2FsZSBwYXJhbWV0ZXIgaW4gWSwgaWYgTnVsbCBlcXVhbCB0byBzeFxuICogQHJldHVybiB7QWN0aW9uSW50ZXJ2YWx9XG4gKiBAZXhhbXBsZVxuICogLy8gZXhhbXBsZSB3aXRob3V0IHN5LCBpdCBzY2FsZXMgYnkgMiBib3RoIGluIFggYW5kIFlcbiAqIHZhciBhY3Rpb25CeSA9IGNjLnNjYWxlQnkoMiwgMik7XG4gKlxuICogLy9leGFtcGxlIHdpdGggc3ksIGl0IHNjYWxlcyBieSAwLjI1IGluIFggYW5kIDQuNSBpbiBZXG4gKiB2YXIgYWN0aW9uQnkyID0gY2Muc2NhbGVCeSgyLCAwLjI1LCA0LjUpO1xuICovXG5jYy5zY2FsZUJ5ID0gZnVuY3Rpb24gKGR1cmF0aW9uLCBzeCwgc3kpIHtcbiAgICByZXR1cm4gbmV3IGNjLlNjYWxlQnkoZHVyYXRpb24sIHN4LCBzeSk7XG59O1xuXG4vKiBCbGlua3MgYSBOb2RlIG9iamVjdCBieSBtb2RpZnlpbmcgaXQncyB2aXNpYmxlIHByb3BlcnR5XG4gKiBAY2xhc3MgQmxpbmtcbiAqIEBleHRlbmRzIEFjdGlvbkludGVydmFsXG4gKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb24gIGR1cmF0aW9uIGluIHNlY29uZHNcbiAqIEBwYXJhbSB7TnVtYmVyfSBibGlua3MgIGJsaW5rcyBpbiB0aW1lc1xuICogQGV4YW1wbGVcbiAqIHZhciBhY3Rpb24gPSBuZXcgY2MuQmxpbmsoMiwgMTApO1xuICovXG5jYy5CbGluayA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuQmxpbmsnLFxuICAgIGV4dGVuZHM6IGNjLkFjdGlvbkludGVydmFsLFxuXG4gICAgY3RvcjpmdW5jdGlvbiAoZHVyYXRpb24sIGJsaW5rcykge1xuICAgICAgICB0aGlzLl90aW1lcyA9IDA7XG4gICAgICAgIHRoaXMuX29yaWdpbmFsU3RhdGUgPSBmYWxzZTtcblx0XHRibGlua3MgIT09IHVuZGVmaW5lZCAmJiB0aGlzLmluaXRXaXRoRHVyYXRpb24oZHVyYXRpb24sIGJsaW5rcyk7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogSW5pdGlhbGl6ZXMgdGhlIGFjdGlvbi5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb24gZHVyYXRpb24gaW4gc2Vjb25kc1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBibGlua3MgYmxpbmtzIGluIHRpbWVzXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpbml0V2l0aER1cmF0aW9uOmZ1bmN0aW9uIChkdXJhdGlvbiwgYmxpbmtzKSB7XG4gICAgICAgIGlmIChjYy5BY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuaW5pdFdpdGhEdXJhdGlvbi5jYWxsKHRoaXMsIGR1cmF0aW9uKSkge1xuICAgICAgICAgICAgdGhpcy5fdGltZXMgPSBibGlua3M7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIGNsb25lOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5CbGluaygpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoRHVyYXRpb24odGhpcy5fZHVyYXRpb24sIHRoaXMuX3RpbWVzKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9LFxuXG4gICAgdXBkYXRlOmZ1bmN0aW9uIChkdCkge1xuICAgICAgICBkdCA9IHRoaXMuX2NvbXB1dGVFYXNlVGltZShkdCk7XG4gICAgICAgIGlmICh0aGlzLnRhcmdldCAmJiAhdGhpcy5pc0RvbmUoKSkge1xuICAgICAgICAgICAgdmFyIHNsaWNlID0gMS4wIC8gdGhpcy5fdGltZXM7XG4gICAgICAgICAgICB2YXIgbSA9IGR0ICUgc2xpY2U7XG4gICAgICAgICAgICB0aGlzLnRhcmdldC5vcGFjaXR5ID0gKG0gPiAoc2xpY2UgLyAyKSkgPyAyNTUgOiAwO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHN0YXJ0V2l0aFRhcmdldDpmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIGNjLkFjdGlvbkludGVydmFsLnByb3RvdHlwZS5zdGFydFdpdGhUYXJnZXQuY2FsbCh0aGlzLCB0YXJnZXQpO1xuICAgICAgICB0aGlzLl9vcmlnaW5hbFN0YXRlID0gdGFyZ2V0Lm9wYWNpdHk7XG4gICAgfSxcblxuICAgIHN0b3A6ZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnRhcmdldC5vcGFjaXR5ID0gdGhpcy5fb3JpZ2luYWxTdGF0ZTtcbiAgICAgICAgY2MuQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLnN0b3AuY2FsbCh0aGlzKTtcbiAgICB9LFxuXG4gICAgcmV2ZXJzZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuQmxpbmsodGhpcy5fZHVyYXRpb24sIHRoaXMuX3RpbWVzKTtcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XG4gICAgICAgIHRoaXMuX3JldmVyc2VFYXNlTGlzdChhY3Rpb24pO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH1cbn0pO1xuLyoqXG4gKiAhI2VuIEJsaW5rcyBhIE5vZGUgb2JqZWN0IGJ5IG1vZGlmeWluZyBpdCdzIHZpc2libGUgcHJvcGVydHkuXG4gKiAhI3poIOmXqueDge+8iOWfuuS6jumAj+aYjuW6pu+8ieOAglxuICogQG1ldGhvZCBibGlua1xuICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uICBkdXJhdGlvbiBpbiBzZWNvbmRzXG4gKiBAcGFyYW0ge051bWJlcn0gYmxpbmtzIGJsaW5rcyBpbiB0aW1lc1xuICogQHJldHVybiB7QWN0aW9uSW50ZXJ2YWx9XG4gKiBAZXhhbXBsZVxuICogLy8gZXhhbXBsZVxuICogdmFyIGFjdGlvbiA9IGNjLmJsaW5rKDIsIDEwKTtcbiAqL1xuY2MuYmxpbmsgPSBmdW5jdGlvbiAoZHVyYXRpb24sIGJsaW5rcykge1xuICAgIHJldHVybiBuZXcgY2MuQmxpbmsoZHVyYXRpb24sIGJsaW5rcyk7XG59O1xuXG4vKiBGYWRlcyBhbiBvYmplY3QgdGhhdCBpbXBsZW1lbnRzIHRoZSBjYy5SR0JBUHJvdG9jb2wgcHJvdG9jb2wuIEl0IG1vZGlmaWVzIHRoZSBvcGFjaXR5IGZyb20gdGhlIGN1cnJlbnQgdmFsdWUgdG8gYSBjdXN0b20gb25lLlxuICogQHdhcm5pbmcgVGhpcyBhY3Rpb24gZG9lc24ndCBzdXBwb3J0IFwicmV2ZXJzZVwiXG4gKiBAY2xhc3MgRmFkZVRvXG4gKiBAZXh0ZW5kcyBBY3Rpb25JbnRlcnZhbFxuICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uXG4gKiBAcGFyYW0ge051bWJlcn0gb3BhY2l0eSAwLTI1NSwgMCBpcyB0cmFuc3BhcmVudFxuICogQGV4YW1wbGVcbiAqIHZhciBhY3Rpb24gPSBuZXcgY2MuRmFkZVRvKDEuMCwgMCk7XG4gKi9cbmNjLkZhZGVUbyA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuRmFkZVRvJyxcbiAgICBleHRlbmRzOiBjYy5BY3Rpb25JbnRlcnZhbCxcblxuICAgIGN0b3I6ZnVuY3Rpb24gKGR1cmF0aW9uLCBvcGFjaXR5KSB7XG4gICAgICAgIHRoaXMuX3RvT3BhY2l0eSA9IDA7XG4gICAgICAgIHRoaXMuX2Zyb21PcGFjaXR5ID0gMDtcbiAgICAgICAgb3BhY2l0eSAhPT0gdW5kZWZpbmVkICYmIGNjLkZhZGVUby5wcm90b3R5cGUuaW5pdFdpdGhEdXJhdGlvbi5jYWxsKHRoaXMsIGR1cmF0aW9uLCBvcGFjaXR5KTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBJbml0aWFsaXplcyB0aGUgYWN0aW9uLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvbiAgZHVyYXRpb24gaW4gc2Vjb25kc1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvcGFjaXR5XG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpbml0V2l0aER1cmF0aW9uOmZ1bmN0aW9uIChkdXJhdGlvbiwgb3BhY2l0eSkge1xuICAgICAgICBpZiAoY2MuQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLmluaXRXaXRoRHVyYXRpb24uY2FsbCh0aGlzLCBkdXJhdGlvbikpIHtcbiAgICAgICAgICAgIHRoaXMuX3RvT3BhY2l0eSA9IG9wYWNpdHk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIGNsb25lOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5GYWRlVG8oKTtcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XG4gICAgICAgIGFjdGlvbi5pbml0V2l0aER1cmF0aW9uKHRoaXMuX2R1cmF0aW9uLCB0aGlzLl90b09wYWNpdHkpO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6ZnVuY3Rpb24gKHRpbWUpIHtcbiAgICAgICAgdGltZSA9IHRoaXMuX2NvbXB1dGVFYXNlVGltZSh0aW1lKTtcbiAgICAgICAgdmFyIGZyb21PcGFjaXR5ID0gdGhpcy5fZnJvbU9wYWNpdHkgIT09IHVuZGVmaW5lZCA/IHRoaXMuX2Zyb21PcGFjaXR5IDogMjU1O1xuICAgICAgICB0aGlzLnRhcmdldC5vcGFjaXR5ID0gZnJvbU9wYWNpdHkgKyAodGhpcy5fdG9PcGFjaXR5IC0gZnJvbU9wYWNpdHkpICogdGltZTtcbiAgICB9LFxuXG4gICAgc3RhcnRXaXRoVGFyZ2V0OmZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgY2MuQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLnN0YXJ0V2l0aFRhcmdldC5jYWxsKHRoaXMsIHRhcmdldCk7XG4gICAgICAgIHRoaXMuX2Zyb21PcGFjaXR5ID0gdGFyZ2V0Lm9wYWNpdHk7XG4gICAgfVxufSk7XG5cbi8qKlxuICogISNlblxuICogRmFkZXMgYW4gb2JqZWN0IHRoYXQgaW1wbGVtZW50cyB0aGUgY2MuUkdCQVByb3RvY29sIHByb3RvY29sLlxuICogSXQgbW9kaWZpZXMgdGhlIG9wYWNpdHkgZnJvbSB0aGUgY3VycmVudCB2YWx1ZSB0byBhIGN1c3RvbSBvbmUuXG4gKiAhI3poIOS/ruaUuemAj+aYjuW6puWIsOaMh+WumuWAvOOAglxuICogQG1ldGhvZCBmYWRlVG9cbiAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvblxuICogQHBhcmFtIHtOdW1iZXJ9IG9wYWNpdHkgMC0yNTUsIDAgaXMgdHJhbnNwYXJlbnRcbiAqIEByZXR1cm4ge0FjdGlvbkludGVydmFsfVxuICogQGV4YW1wbGVcbiAqIC8vIGV4YW1wbGVcbiAqIHZhciBhY3Rpb24gPSBjYy5mYWRlVG8oMS4wLCAwKTtcbiAqL1xuY2MuZmFkZVRvID0gZnVuY3Rpb24gKGR1cmF0aW9uLCBvcGFjaXR5KSB7XG4gICAgcmV0dXJuIG5ldyBjYy5GYWRlVG8oZHVyYXRpb24sIG9wYWNpdHkpO1xufTtcblxuLyogRmFkZXMgSW4gYW4gb2JqZWN0IHRoYXQgaW1wbGVtZW50cyB0aGUgY2MuUkdCQVByb3RvY29sIHByb3RvY29sLiBJdCBtb2RpZmllcyB0aGUgb3BhY2l0eSBmcm9tIDAgdG8gMjU1Ljxici8+XG4gKiBUaGUgXCJyZXZlcnNlXCIgb2YgdGhpcyBhY3Rpb24gaXMgRmFkZU91dFxuICogQGNsYXNzIEZhZGVJblxuICogQGV4dGVuZHMgRmFkZVRvXG4gKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb24gZHVyYXRpb24gaW4gc2Vjb25kc1xuICovXG5jYy5GYWRlSW4gPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLkZhZGVJbicsXG4gICAgZXh0ZW5kczogY2MuRmFkZVRvLFxuXG4gICAgY3RvcjpmdW5jdGlvbiAoZHVyYXRpb24pIHtcbiAgICAgICAgaWYgKGR1cmF0aW9uID09IG51bGwpXG4gICAgICAgICAgICBkdXJhdGlvbiA9IDA7XG4gICAgICAgIHRoaXMuX3JldmVyc2VBY3Rpb24gPSBudWxsO1xuICAgICAgICB0aGlzLmluaXRXaXRoRHVyYXRpb24oZHVyYXRpb24sIDI1NSk7XG4gICAgfSxcblxuICAgIHJldmVyc2U6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLkZhZGVPdXQoKTtcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoRHVyYXRpb24odGhpcy5fZHVyYXRpb24sIDApO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgdGhpcy5fcmV2ZXJzZUVhc2VMaXN0KGFjdGlvbik7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfSxcblxuICAgIGNsb25lOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5GYWRlSW4oKTtcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XG4gICAgICAgIGFjdGlvbi5pbml0V2l0aER1cmF0aW9uKHRoaXMuX2R1cmF0aW9uLCB0aGlzLl90b09wYWNpdHkpO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH0sXG5cbiAgICBzdGFydFdpdGhUYXJnZXQ6ZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICBpZih0aGlzLl9yZXZlcnNlQWN0aW9uKVxuICAgICAgICAgICAgdGhpcy5fdG9PcGFjaXR5ID0gdGhpcy5fcmV2ZXJzZUFjdGlvbi5fZnJvbU9wYWNpdHk7XG4gICAgICAgIGNjLkZhZGVUby5wcm90b3R5cGUuc3RhcnRXaXRoVGFyZ2V0LmNhbGwodGhpcywgdGFyZ2V0KTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiAhI2VuIEZhZGVzIEluIGFuIG9iamVjdCB0aGF0IGltcGxlbWVudHMgdGhlIGNjLlJHQkFQcm90b2NvbCBwcm90b2NvbC4gSXQgbW9kaWZpZXMgdGhlIG9wYWNpdHkgZnJvbSAwIHRvIDI1NS5cbiAqICEjemgg5riQ5pi+5pWI5p6c44CCXG4gKiBAbWV0aG9kIGZhZGVJblxuICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uIGR1cmF0aW9uIGluIHNlY29uZHNcbiAqIEByZXR1cm4ge0FjdGlvbkludGVydmFsfVxuICogQGV4YW1wbGVcbiAqIC8vZXhhbXBsZVxuICogdmFyIGFjdGlvbiA9IGNjLmZhZGVJbigxLjApO1xuICovXG5jYy5mYWRlSW4gPSBmdW5jdGlvbiAoZHVyYXRpb24pIHtcbiAgICByZXR1cm4gbmV3IGNjLkZhZGVJbihkdXJhdGlvbik7XG59O1xuXG5cbi8qIEZhZGVzIE91dCBhbiBvYmplY3QgdGhhdCBpbXBsZW1lbnRzIHRoZSBjYy5SR0JBUHJvdG9jb2wgcHJvdG9jb2wuIEl0IG1vZGlmaWVzIHRoZSBvcGFjaXR5IGZyb20gMjU1IHRvIDAuXG4gKiBUaGUgXCJyZXZlcnNlXCIgb2YgdGhpcyBhY3Rpb24gaXMgRmFkZUluXG4gKiBAY2xhc3MgRmFkZU91dFxuICogQGV4dGVuZHMgRmFkZVRvXG4gKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb24gZHVyYXRpb24gaW4gc2Vjb25kc1xuICovXG5jYy5GYWRlT3V0ID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5GYWRlT3V0JyxcbiAgICBleHRlbmRzOiBjYy5GYWRlVG8sXG5cbiAgICBjdG9yOmZ1bmN0aW9uIChkdXJhdGlvbikge1xuICAgICAgICBpZiAoZHVyYXRpb24gPT0gbnVsbClcbiAgICAgICAgICAgIGR1cmF0aW9uID0gMDtcbiAgICAgICAgdGhpcy5fcmV2ZXJzZUFjdGlvbiA9IG51bGw7XG4gICAgICAgIHRoaXMuaW5pdFdpdGhEdXJhdGlvbihkdXJhdGlvbiwgMCk7XG4gICAgfSxcblxuICAgIHJldmVyc2U6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLkZhZGVJbigpO1xuICAgICAgICBhY3Rpb24uX3JldmVyc2VBY3Rpb24gPSB0aGlzO1xuICAgICAgICBhY3Rpb24uaW5pdFdpdGhEdXJhdGlvbih0aGlzLl9kdXJhdGlvbiwgMjU1KTtcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XG4gICAgICAgIHRoaXMuX3JldmVyc2VFYXNlTGlzdChhY3Rpb24pO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH0sXG5cbiAgICBjbG9uZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuRmFkZU91dCgpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoRHVyYXRpb24odGhpcy5fZHVyYXRpb24sIHRoaXMuX3RvT3BhY2l0eSk7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfVxufSk7XG5cbi8qKlxuICogISNlbiBGYWRlcyBPdXQgYW4gb2JqZWN0IHRoYXQgaW1wbGVtZW50cyB0aGUgY2MuUkdCQVByb3RvY29sIHByb3RvY29sLiBJdCBtb2RpZmllcyB0aGUgb3BhY2l0eSBmcm9tIDI1NSB0byAwLlxuICogISN6aCDmuJDpmpDmlYjmnpzjgIJcbiAqIEBtZXRob2QgZmFkZU91dFxuICogQHBhcmFtIHtOdW1iZXJ9IGQgIGR1cmF0aW9uIGluIHNlY29uZHNcbiAqIEByZXR1cm4ge0FjdGlvbkludGVydmFsfVxuICogQGV4YW1wbGVcbiAqIC8vIGV4YW1wbGVcbiAqIHZhciBhY3Rpb24gPSBjYy5mYWRlT3V0KDEuMCk7XG4gKi9cbmNjLmZhZGVPdXQgPSBmdW5jdGlvbiAoZCkge1xuICAgIHJldHVybiBuZXcgY2MuRmFkZU91dChkKTtcbn07XG5cbi8qIFRpbnRzIGEgTm9kZSB0aGF0IGltcGxlbWVudHMgdGhlIGNjLk5vZGVSR0IgcHJvdG9jb2wgZnJvbSBjdXJyZW50IHRpbnQgdG8gYSBjdXN0b20gb25lLlxuICogQHdhcm5pbmcgVGhpcyBhY3Rpb24gZG9lc24ndCBzdXBwb3J0IFwicmV2ZXJzZVwiXG4gKiBAY2xhc3MgVGludFRvXG4gKiBAZXh0ZW5kcyBBY3Rpb25JbnRlcnZhbFxuICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uXG4gKiBAcGFyYW0ge051bWJlcn0gcmVkIDAtMjU1XG4gKiBAcGFyYW0ge051bWJlcn0gZ3JlZW4gIDAtMjU1XG4gKiBAcGFyYW0ge051bWJlcn0gYmx1ZSAwLTI1NVxuICogQGV4YW1wbGVcbiAqIHZhciBhY3Rpb24gPSBuZXcgY2MuVGludFRvKDIsIDI1NSwgMCwgMjU1KTtcbiAqL1xuY2MuVGludFRvID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5UaW50VG8nLFxuICAgIGV4dGVuZHM6IGNjLkFjdGlvbkludGVydmFsLFxuXG4gICAgY3RvcjpmdW5jdGlvbiAoZHVyYXRpb24sIHJlZCwgZ3JlZW4sIGJsdWUpIHtcbiAgICAgICAgdGhpcy5fdG8gPSBjYy5jb2xvcigwLCAwLCAwKTtcbiAgICAgICAgdGhpcy5fZnJvbSA9IGNjLmNvbG9yKDAsIDAsIDApO1xuXG4gICAgICAgIGlmIChyZWQgaW5zdGFuY2VvZiBjYy5Db2xvcikge1xuICAgICAgICAgICAgYmx1ZSA9IHJlZC5iO1xuICAgICAgICAgICAgZ3JlZW4gPSByZWQuZztcbiAgICAgICAgICAgIHJlZCA9IHJlZC5yO1xuICAgICAgICB9XG5cbiAgICAgICAgYmx1ZSAhPT0gdW5kZWZpbmVkICYmIHRoaXMuaW5pdFdpdGhEdXJhdGlvbihkdXJhdGlvbiwgcmVkLCBncmVlbiwgYmx1ZSk7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogSW5pdGlhbGl6ZXMgdGhlIGFjdGlvbi5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb25cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcmVkIDAtMjU1XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGdyZWVuIDAtMjU1XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGJsdWUgMC0yNTVcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGluaXRXaXRoRHVyYXRpb246ZnVuY3Rpb24gKGR1cmF0aW9uLCByZWQsIGdyZWVuLCBibHVlKSB7XG4gICAgICAgIGlmIChjYy5BY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuaW5pdFdpdGhEdXJhdGlvbi5jYWxsKHRoaXMsIGR1cmF0aW9uKSkge1xuICAgICAgICAgICAgdGhpcy5fdG8gPSBjYy5jb2xvcihyZWQsIGdyZWVuLCBibHVlKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgY2xvbmU6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLlRpbnRUbygpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgdmFyIGxvY1RvID0gdGhpcy5fdG87XG4gICAgICAgIGFjdGlvbi5pbml0V2l0aER1cmF0aW9uKHRoaXMuX2R1cmF0aW9uLCBsb2NUby5yLCBsb2NUby5nLCBsb2NUby5iKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9LFxuXG4gICAgc3RhcnRXaXRoVGFyZ2V0OmZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgY2MuQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLnN0YXJ0V2l0aFRhcmdldC5jYWxsKHRoaXMsIHRhcmdldCk7XG5cbiAgICAgICAgdGhpcy5fZnJvbSA9IHRoaXMudGFyZ2V0LmNvbG9yO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6ZnVuY3Rpb24gKGR0KSB7XG4gICAgICAgIGR0ID0gdGhpcy5fY29tcHV0ZUVhc2VUaW1lKGR0KTtcbiAgICAgICAgdmFyIGxvY0Zyb20gPSB0aGlzLl9mcm9tLCBsb2NUbyA9IHRoaXMuX3RvO1xuICAgICAgICBpZiAobG9jRnJvbSkge1xuICAgICAgICAgICAgdGhpcy50YXJnZXQuY29sb3IgPSBjYy5jb2xvcihcbiAgICAgICAgICAgICAgICAgICAgbG9jRnJvbS5yICsgKGxvY1RvLnIgLSBsb2NGcm9tLnIpICogZHQsXG4gICAgICAgICAgICAgICAgICAgIGxvY0Zyb20uZyArIChsb2NUby5nIC0gbG9jRnJvbS5nKSAqIGR0LFxuICAgICAgICAgICAgICAgICAgICBsb2NGcm9tLmIgKyAobG9jVG8uYiAtIGxvY0Zyb20uYikgKiBkdCk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuLyoqXG4gKiAhI2VuIFRpbnRzIGEgTm9kZSB0aGF0IGltcGxlbWVudHMgdGhlIGNjLk5vZGVSR0IgcHJvdG9jb2wgZnJvbSBjdXJyZW50IHRpbnQgdG8gYSBjdXN0b20gb25lLlxuICogISN6aCDkv67mlLnpopzoibLliLDmjIflrprlgLzjgIJcbiAqIEBtZXRob2QgdGludFRvXG4gKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb25cbiAqIEBwYXJhbSB7TnVtYmVyfSByZWQgMC0yNTVcbiAqIEBwYXJhbSB7TnVtYmVyfSBncmVlbiAgMC0yNTVcbiAqIEBwYXJhbSB7TnVtYmVyfSBibHVlIDAtMjU1XG4gKiBAcmV0dXJuIHtBY3Rpb25JbnRlcnZhbH1cbiAqIEBleGFtcGxlXG4gKiAvLyBleGFtcGxlXG4gKiB2YXIgYWN0aW9uID0gY2MudGludFRvKDIsIDI1NSwgMCwgMjU1KTtcbiAqL1xuY2MudGludFRvID0gZnVuY3Rpb24gKGR1cmF0aW9uLCByZWQsIGdyZWVuLCBibHVlKSB7XG4gICAgcmV0dXJuIG5ldyBjYy5UaW50VG8oZHVyYXRpb24sIHJlZCwgZ3JlZW4sIGJsdWUpO1xufTtcblxuXG4vKiBUaW50cyBhIE5vZGUgdGhhdCBpbXBsZW1lbnRzIHRoZSBjYy5Ob2RlUkdCIHByb3RvY29sIGZyb20gY3VycmVudCB0aW50IHRvIGEgY3VzdG9tIG9uZS5cbiAqIFJlbGF0aXZlIHRvIHRoZWlyIG93biBjb2xvciBjaGFuZ2UuXG4gKiBAY2xhc3MgVGludEJ5XG4gKiBAZXh0ZW5kcyBBY3Rpb25JbnRlcnZhbFxuICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uICBkdXJhdGlvbiBpbiBzZWNvbmRzXG4gKiBAcGFyYW0ge051bWJlcn0gZGVsdGFSZWRcbiAqIEBwYXJhbSB7TnVtYmVyfSBkZWx0YUdyZWVuXG4gKiBAcGFyYW0ge051bWJlcn0gZGVsdGFCbHVlXG4gKiBAZXhhbXBsZVxuICogdmFyIGFjdGlvbiA9IG5ldyBjYy5UaW50QnkoMiwgLTEyNywgLTI1NSwgLTEyNyk7XG4gKi9cbmNjLlRpbnRCeSA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuVGludEJ5JyxcbiAgICBleHRlbmRzOiBjYy5BY3Rpb25JbnRlcnZhbCxcblxuICAgIGN0b3I6ZnVuY3Rpb24gKGR1cmF0aW9uLCBkZWx0YVJlZCwgZGVsdGFHcmVlbiwgZGVsdGFCbHVlKSB7XG4gICAgICAgIHRoaXMuX2RlbHRhUiA9IDA7XG4gICAgICAgIHRoaXMuX2RlbHRhRyA9IDA7XG4gICAgICAgIHRoaXMuX2RlbHRhQiA9IDA7XG4gICAgICAgIHRoaXMuX2Zyb21SID0gMDtcbiAgICAgICAgdGhpcy5fZnJvbUcgPSAwO1xuICAgICAgICB0aGlzLl9mcm9tQiA9IDA7XG5cdFx0ZGVsdGFCbHVlICE9PSB1bmRlZmluZWQgJiYgdGhpcy5pbml0V2l0aER1cmF0aW9uKGR1cmF0aW9uLCBkZWx0YVJlZCwgZGVsdGFHcmVlbiwgZGVsdGFCbHVlKTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBJbml0aWFsaXplcyB0aGUgYWN0aW9uLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkZWx0YVJlZCAwLTI1NVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkZWx0YUdyZWVuIDAtMjU1XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGRlbHRhQmx1ZSAwLTI1NVxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaW5pdFdpdGhEdXJhdGlvbjpmdW5jdGlvbiAoZHVyYXRpb24sIGRlbHRhUmVkLCBkZWx0YUdyZWVuLCBkZWx0YUJsdWUpIHtcbiAgICAgICAgaWYgKGNjLkFjdGlvbkludGVydmFsLnByb3RvdHlwZS5pbml0V2l0aER1cmF0aW9uLmNhbGwodGhpcywgZHVyYXRpb24pKSB7XG4gICAgICAgICAgICB0aGlzLl9kZWx0YVIgPSBkZWx0YVJlZDtcbiAgICAgICAgICAgIHRoaXMuX2RlbHRhRyA9IGRlbHRhR3JlZW47XG4gICAgICAgICAgICB0aGlzLl9kZWx0YUIgPSBkZWx0YUJsdWU7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIGNsb25lOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IG5ldyBjYy5UaW50QnkoKTtcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XG4gICAgICAgIGFjdGlvbi5pbml0V2l0aER1cmF0aW9uKHRoaXMuX2R1cmF0aW9uLCB0aGlzLl9kZWx0YVIsIHRoaXMuX2RlbHRhRywgdGhpcy5fZGVsdGFCKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9LFxuXG4gICAgc3RhcnRXaXRoVGFyZ2V0OmZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgY2MuQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLnN0YXJ0V2l0aFRhcmdldC5jYWxsKHRoaXMsIHRhcmdldCk7XG5cbiAgICAgICAgdmFyIGNvbG9yID0gdGFyZ2V0LmNvbG9yO1xuICAgICAgICB0aGlzLl9mcm9tUiA9IGNvbG9yLnI7XG4gICAgICAgIHRoaXMuX2Zyb21HID0gY29sb3IuZztcbiAgICAgICAgdGhpcy5fZnJvbUIgPSBjb2xvci5iO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6ZnVuY3Rpb24gKGR0KSB7XG4gICAgICAgIGR0ID0gdGhpcy5fY29tcHV0ZUVhc2VUaW1lKGR0KTtcblxuICAgICAgICB0aGlzLnRhcmdldC5jb2xvciA9IGNjLmNvbG9yKHRoaXMuX2Zyb21SICsgdGhpcy5fZGVsdGFSICogZHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9mcm9tRyArIHRoaXMuX2RlbHRhRyAqIGR0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZnJvbUIgKyB0aGlzLl9kZWx0YUIgKiBkdCk7XG4gICAgfSxcblxuICAgIHJldmVyc2U6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLlRpbnRCeSh0aGlzLl9kdXJhdGlvbiwgLXRoaXMuX2RlbHRhUiwgLXRoaXMuX2RlbHRhRywgLXRoaXMuX2RlbHRhQik7XG4gICAgICAgIHRoaXMuX2Nsb25lRGVjb3JhdGlvbihhY3Rpb24pO1xuICAgICAgICB0aGlzLl9yZXZlcnNlRWFzZUxpc3QoYWN0aW9uKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9XG59KTtcblxuLyoqXG4gKiAhI2VuXG4gKiBUaW50cyBhIE5vZGUgdGhhdCBpbXBsZW1lbnRzIHRoZSBjYy5Ob2RlUkdCIHByb3RvY29sIGZyb20gY3VycmVudCB0aW50IHRvIGEgY3VzdG9tIG9uZS5cbiAqIFJlbGF0aXZlIHRvIHRoZWlyIG93biBjb2xvciBjaGFuZ2UuXG4gKiAhI3poIOaMieeFp+aMh+WumueahOWinumHj+S/ruaUueminOiJsuOAglxuICogQG1ldGhvZCB0aW50QnlcbiAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvbiAgZHVyYXRpb24gaW4gc2Vjb25kc1xuICogQHBhcmFtIHtOdW1iZXJ9IGRlbHRhUmVkXG4gKiBAcGFyYW0ge051bWJlcn0gZGVsdGFHcmVlblxuICogQHBhcmFtIHtOdW1iZXJ9IGRlbHRhQmx1ZVxuICogQHJldHVybiB7QWN0aW9uSW50ZXJ2YWx9XG4gKiBAZXhhbXBsZVxuICogLy8gZXhhbXBsZVxuICogdmFyIGFjdGlvbiA9IGNjLnRpbnRCeSgyLCAtMTI3LCAtMjU1LCAtMTI3KTtcbiAqL1xuY2MudGludEJ5ID0gZnVuY3Rpb24gKGR1cmF0aW9uLCBkZWx0YVJlZCwgZGVsdGFHcmVlbiwgZGVsdGFCbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBjYy5UaW50QnkoZHVyYXRpb24sIGRlbHRhUmVkLCBkZWx0YUdyZWVuLCBkZWx0YUJsdWUpO1xufTtcblxuLyogRGVsYXlzIHRoZSBhY3Rpb24gYSBjZXJ0YWluIGFtb3VudCBvZiBzZWNvbmRzXG4gKiBAY2xhc3MgRGVsYXlUaW1lXG4gKiBAZXh0ZW5kcyBBY3Rpb25JbnRlcnZhbFxuICovXG5jYy5EZWxheVRpbWUgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLkRlbGF5VGltZScsXG4gICAgZXh0ZW5kczogY2MuQWN0aW9uSW50ZXJ2YWwsXG5cbiAgICB1cGRhdGU6ZnVuY3Rpb24gKGR0KSB7fSxcblxuICAgIHJldmVyc2U6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLkRlbGF5VGltZSh0aGlzLl9kdXJhdGlvbik7XG4gICAgICAgIHRoaXMuX2Nsb25lRGVjb3JhdGlvbihhY3Rpb24pO1xuICAgICAgICB0aGlzLl9yZXZlcnNlRWFzZUxpc3QoYWN0aW9uKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9LFxuXG4gICAgY2xvbmU6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLkRlbGF5VGltZSgpO1xuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcbiAgICAgICAgYWN0aW9uLmluaXRXaXRoRHVyYXRpb24odGhpcy5fZHVyYXRpb24pO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqICEjZW4gRGVsYXlzIHRoZSBhY3Rpb24gYSBjZXJ0YWluIGFtb3VudCBvZiBzZWNvbmRzLlxuICogISN6aCDlu7bov5/mjIflrprnmoTml7bpl7Tph4/jgIJcbiAqIEBtZXRob2QgZGVsYXlUaW1lXG4gKiBAcGFyYW0ge051bWJlcn0gZCBkdXJhdGlvbiBpbiBzZWNvbmRzXG4gKiBAcmV0dXJuIHtBY3Rpb25JbnRlcnZhbH1cbiAqIEBleGFtcGxlXG4gKiAvLyBleGFtcGxlXG4gKiB2YXIgZGVsYXkgPSBjYy5kZWxheVRpbWUoMSk7XG4gKi9cbmNjLmRlbGF5VGltZSA9IGZ1bmN0aW9uIChkKSB7XG4gICAgcmV0dXJuIG5ldyBjYy5EZWxheVRpbWUoZCk7XG59O1xuXG4vKlxuICogPHA+XG4gKiBFeGVjdXRlcyBhbiBhY3Rpb24gaW4gcmV2ZXJzZSBvcmRlciwgZnJvbSB0aW1lPWR1cmF0aW9uIHRvIHRpbWU9MCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICogQHdhcm5pbmcgVXNlIHRoaXMgYWN0aW9uIGNhcmVmdWxseS4gVGhpcyBhY3Rpb24gaXMgbm90IHNlcXVlbmNlYWJsZS4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICogVXNlIGl0IGFzIHRoZSBkZWZhdWx0IFwicmV2ZXJzZWRcIiBtZXRob2Qgb2YgeW91ciBvd24gYWN0aW9ucywgYnV0IHVzaW5nIGl0IG91dHNpZGUgdGhlIFwicmV2ZXJzZWRcIiAgICAgIDxici8+XG4gKiBzY29wZSBpcyBub3QgcmVjb21tZW5kZWQuXG4gKiA8L3A+XG4gKiBAY2xhc3MgUmV2ZXJzZVRpbWVcbiAqIEBleHRlbmRzIEFjdGlvbkludGVydmFsXG4gKiBAcGFyYW0ge0Zpbml0ZVRpbWVBY3Rpb259IGFjdGlvblxuICogQGV4YW1wbGVcbiAqICB2YXIgcmV2ZXJzZSA9IG5ldyBjYy5SZXZlcnNlVGltZSh0aGlzKTtcbiAqL1xuY2MuUmV2ZXJzZVRpbWUgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlJldmVyc2VUaW1lJyxcbiAgICBleHRlbmRzOiBjYy5BY3Rpb25JbnRlcnZhbCxcblxuICAgIGN0b3I6ZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgICB0aGlzLl9vdGhlciA9IG51bGw7XG5cdFx0YWN0aW9uICYmIHRoaXMuaW5pdFdpdGhBY3Rpb24oYWN0aW9uKTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBAcGFyYW0ge0Zpbml0ZVRpbWVBY3Rpb259IGFjdGlvblxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaW5pdFdpdGhBY3Rpb246ZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgICBpZiAoIWFjdGlvbikge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgxMDI4KTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWN0aW9uID09PSB0aGlzLl9vdGhlcikge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgxMDI5KTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjYy5BY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuaW5pdFdpdGhEdXJhdGlvbi5jYWxsKHRoaXMsIGFjdGlvbi5fZHVyYXRpb24pKSB7XG4gICAgICAgICAgICAvLyBEb24ndCBsZWFrIGlmIGFjdGlvbiBpcyByZXVzZWRcbiAgICAgICAgICAgIHRoaXMuX290aGVyID0gYWN0aW9uO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICBjbG9uZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgY2MuUmV2ZXJzZVRpbWUoKTtcbiAgICAgICAgdGhpcy5fY2xvbmVEZWNvcmF0aW9uKGFjdGlvbik7XG4gICAgICAgIGFjdGlvbi5pbml0V2l0aEFjdGlvbih0aGlzLl9vdGhlci5jbG9uZSgpKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9LFxuXG4gICAgc3RhcnRXaXRoVGFyZ2V0OmZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgY2MuQWN0aW9uSW50ZXJ2YWwucHJvdG90eXBlLnN0YXJ0V2l0aFRhcmdldC5jYWxsKHRoaXMsIHRhcmdldCk7XG4gICAgICAgIHRoaXMuX290aGVyLnN0YXJ0V2l0aFRhcmdldCh0YXJnZXQpO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6ZnVuY3Rpb24gKGR0KSB7XG4gICAgICAgIGR0ID0gdGhpcy5fY29tcHV0ZUVhc2VUaW1lKGR0KTtcbiAgICAgICAgaWYgKHRoaXMuX290aGVyKVxuICAgICAgICAgICAgdGhpcy5fb3RoZXIudXBkYXRlKDEgLSBkdCk7XG4gICAgfSxcblxuICAgIHJldmVyc2U6ZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fb3RoZXIuY2xvbmUoKTtcbiAgICB9LFxuXG4gICAgc3RvcDpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX290aGVyLnN0b3AoKTtcbiAgICAgICAgY2MuQWN0aW9uLnByb3RvdHlwZS5zdG9wLmNhbGwodGhpcyk7XG4gICAgfVxufSk7XG5cbi8qKlxuICogISNlbiBFeGVjdXRlcyBhbiBhY3Rpb24gaW4gcmV2ZXJzZSBvcmRlciwgZnJvbSB0aW1lPWR1cmF0aW9uIHRvIHRpbWU9MC5cbiAqICEjemgg5Y+N6L2s55uu5qCH5Yqo5L2c55qE5pe26Ze06L2044CCXG4gKiBAbWV0aG9kIHJldmVyc2VUaW1lXG4gKiBAcGFyYW0ge0Zpbml0ZVRpbWVBY3Rpb259IGFjdGlvblxuICogQHJldHVybiB7QWN0aW9uSW50ZXJ2YWx9XG4gKiBAZXhhbXBsZVxuICogLy8gZXhhbXBsZVxuICogIHZhciByZXZlcnNlID0gY2MucmV2ZXJzZVRpbWUodGhpcyk7XG4gKi9cbmNjLnJldmVyc2VUaW1lID0gZnVuY3Rpb24gKGFjdGlvbikge1xuICAgIHJldHVybiBuZXcgY2MuUmV2ZXJzZVRpbWUoYWN0aW9uKTtcbn07XG5cbi8qXG4gKiA8cD5cbiAqIE92ZXJyaWRlcyB0aGUgdGFyZ2V0IG9mIGFuIGFjdGlvbiBzbyB0aGF0IGl0IGFsd2F5cyBydW5zIG9uIHRoZSB0YXJnZXQ8YnIvPlxuICogc3BlY2lmaWVkIGF0IGFjdGlvbiBjcmVhdGlvbiByYXRoZXIgdGhhbiB0aGUgb25lIHNwZWNpZmllZCBieSBydW5BY3Rpb24uXG4gKiA8L3A+XG4gKiBAY2xhc3MgVGFyZ2V0ZWRBY3Rpb25cbiAqIEBleHRlbmRzIEFjdGlvbkludGVydmFsXG4gKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICogQHBhcmFtIHtGaW5pdGVUaW1lQWN0aW9ufSBhY3Rpb25cbiAqL1xuY2MuVGFyZ2V0ZWRBY3Rpb24gPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlRhcmdldGVkQWN0aW9uJyxcbiAgICBleHRlbmRzOiBjYy5BY3Rpb25JbnRlcnZhbCxcblxuICAgIGN0b3I6IGZ1bmN0aW9uICh0YXJnZXQsIGFjdGlvbikge1xuICAgICAgICB0aGlzLl9hY3Rpb24gPSBudWxsO1xuICAgICAgICB0aGlzLl9mb3JjZWRUYXJnZXQgPSBudWxsO1xuXHRcdGFjdGlvbiAmJiB0aGlzLmluaXRXaXRoVGFyZ2V0KHRhcmdldCwgYWN0aW9uKTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBJbml0IGFuIGFjdGlvbiB3aXRoIHRoZSBzcGVjaWZpZWQgYWN0aW9uIGFuZCBmb3JjZWQgdGFyZ2V0XG4gICAgICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAgICAgKiBAcGFyYW0ge0Zpbml0ZVRpbWVBY3Rpb259IGFjdGlvblxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaW5pdFdpdGhUYXJnZXQ6ZnVuY3Rpb24gKHRhcmdldCwgYWN0aW9uKSB7XG4gICAgICAgIGlmICh0aGlzLmluaXRXaXRoRHVyYXRpb24oYWN0aW9uLl9kdXJhdGlvbikpIHtcbiAgICAgICAgICAgIHRoaXMuX2ZvcmNlZFRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgICAgIHRoaXMuX2FjdGlvbiA9IGFjdGlvbjtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgY2xvbmU6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IGNjLlRhcmdldGVkQWN0aW9uKCk7XG4gICAgICAgIHRoaXMuX2Nsb25lRGVjb3JhdGlvbihhY3Rpb24pO1xuICAgICAgICBhY3Rpb24uaW5pdFdpdGhUYXJnZXQodGhpcy5fZm9yY2VkVGFyZ2V0LCB0aGlzLl9hY3Rpb24uY2xvbmUoKSk7XG4gICAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfSxcblxuICAgIHN0YXJ0V2l0aFRhcmdldDpmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIGNjLkFjdGlvbkludGVydmFsLnByb3RvdHlwZS5zdGFydFdpdGhUYXJnZXQuY2FsbCh0aGlzLCB0YXJnZXQpO1xuICAgICAgICB0aGlzLl9hY3Rpb24uc3RhcnRXaXRoVGFyZ2V0KHRoaXMuX2ZvcmNlZFRhcmdldCk7XG4gICAgfSxcblxuICAgIHN0b3A6ZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9hY3Rpb24uc3RvcCgpO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6ZnVuY3Rpb24gKGR0KSB7XG4gICAgICAgIGR0ID0gdGhpcy5fY29tcHV0ZUVhc2VUaW1lKGR0KTtcbiAgICAgICAgdGhpcy5fYWN0aW9uLnVwZGF0ZShkdCk7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogcmV0dXJuIHRoZSB0YXJnZXQgdGhhdCB0aGUgYWN0aW9uIHdpbGwgYmUgZm9yY2VkIHRvIHJ1biB3aXRoXG4gICAgICogQHJldHVybiB7Tm9kZX1cbiAgICAgKi9cbiAgICBnZXRGb3JjZWRUYXJnZXQ6ZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZm9yY2VkVGFyZ2V0O1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIHNldCB0aGUgdGFyZ2V0IHRoYXQgdGhlIGFjdGlvbiB3aWxsIGJlIGZvcmNlZCB0byBydW4gd2l0aFxuICAgICAqIEBwYXJhbSB7Tm9kZX0gZm9yY2VkVGFyZ2V0XG4gICAgICovXG4gICAgc2V0Rm9yY2VkVGFyZ2V0OmZ1bmN0aW9uIChmb3JjZWRUYXJnZXQpIHtcbiAgICAgICAgaWYgKHRoaXMuX2ZvcmNlZFRhcmdldCAhPT0gZm9yY2VkVGFyZ2V0KVxuICAgICAgICAgICAgdGhpcy5fZm9yY2VkVGFyZ2V0ID0gZm9yY2VkVGFyZ2V0O1xuICAgIH1cbn0pO1xuXG4vKipcbiAqICEjZW4gQ3JlYXRlIGFuIGFjdGlvbiB3aXRoIHRoZSBzcGVjaWZpZWQgYWN0aW9uIGFuZCBmb3JjZWQgdGFyZ2V0LlxuICogISN6aCDnlKjlt7LmnInliqjkvZzlkozkuIDkuKrmlrDnmoTnm67moIfoioLngrnliJvlu7rliqjkvZzjgIJcbiAqIEBtZXRob2QgdGFyZ2V0ZWRBY3Rpb25cbiAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gKiBAcGFyYW0ge0Zpbml0ZVRpbWVBY3Rpb259IGFjdGlvblxuICogQHJldHVybiB7QWN0aW9uSW50ZXJ2YWx9XG4gKi9cbmNjLnRhcmdldGVkQWN0aW9uID0gZnVuY3Rpb24gKHRhcmdldCwgYWN0aW9uKSB7XG4gICAgcmV0dXJuIG5ldyBjYy5UYXJnZXRlZEFjdGlvbih0YXJnZXQsIGFjdGlvbik7XG59O1xuIl19