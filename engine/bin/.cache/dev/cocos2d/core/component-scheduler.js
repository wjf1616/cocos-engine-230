
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/component-scheduler.js';
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
require('./platform/CCClass');

var Flags = require('./platform/CCObject').Flags;

var jsArray = require('./platform/js').array;

var IsStartCalled = Flags.IsStartCalled;
var IsOnEnableCalled = Flags.IsOnEnableCalled;
var IsEditorOnEnableCalled = Flags.IsEditorOnEnableCalled;

var callerFunctor = CC_EDITOR && require('./utils/misc').tryCatchFunctor_EDITOR;

var callOnEnableInTryCatch = CC_EDITOR && callerFunctor('onEnable');
var callOnDisableInTryCatch = CC_EDITOR && callerFunctor('onDisable');

function sortedIndex(array, comp) {
  var order = comp.constructor._executionOrder;
  var id = comp._id;

  for (var l = 0, h = array.length - 1, m = h >>> 1; l <= h; m = l + h >>> 1) {
    var test = array[m];
    var testOrder = test.constructor._executionOrder;

    if (testOrder > order) {
      h = m - 1;
    } else if (testOrder < order) {
      l = m + 1;
    } else {
      var testId = test._id;

      if (testId > id) {
        h = m - 1;
      } else if (testId < id) {
        l = m + 1;
      } else {
        return m;
      }
    }
  }

  return ~l;
} // remove disabled and not invoked component from array


function stableRemoveInactive(iterator, flagToClear) {
  var array = iterator.array;
  var next = iterator.i + 1;

  while (next < array.length) {
    var comp = array[next];

    if (comp._enabled && comp.node._activeInHierarchy) {
      ++next;
    } else {
      iterator.removeAt(next);

      if (flagToClear) {
        comp._objFlags &= ~flagToClear;
      }
    }
  }
} // This class contains some queues used to invoke life-cycle methods by script execution order


var LifeCycleInvoker = cc.Class({
  __ctor__: function __ctor__(invokeFunc) {
    var Iterator = jsArray.MutableForwardIterator; // components which priority === 0 (default)

    this._zero = new Iterator([]); // components which priority < 0

    this._neg = new Iterator([]); // components which priority > 0

    this._pos = new Iterator([]);

    if (CC_TEST) {
      cc.assert(typeof invokeFunc === 'function', 'invokeFunc must be type function');
    }

    this._invoke = invokeFunc;
  },
  statics: {
    stableRemoveInactive: stableRemoveInactive
  },
  add: null,
  remove: null,
  invoke: null
});

function compareOrder(a, b) {
  return a.constructor._executionOrder - b.constructor._executionOrder;
} // for onLoad: sort once all components registered, invoke once


var OneOffInvoker = cc.Class({
  "extends": LifeCycleInvoker,
  add: function add(comp) {
    var order = comp.constructor._executionOrder;
    (order === 0 ? this._zero : order < 0 ? this._neg : this._pos).array.push(comp);
  },
  remove: function remove(comp) {
    var order = comp.constructor._executionOrder;
    (order === 0 ? this._zero : order < 0 ? this._neg : this._pos).fastRemove(comp);
  },
  cancelInactive: function cancelInactive(flagToClear) {
    stableRemoveInactive(this._zero, flagToClear);
    stableRemoveInactive(this._neg, flagToClear);
    stableRemoveInactive(this._pos, flagToClear);
  },
  invoke: function invoke() {
    var compsNeg = this._neg;

    if (compsNeg.array.length > 0) {
      compsNeg.array.sort(compareOrder);

      this._invoke(compsNeg);

      compsNeg.array.length = 0;
    }

    this._invoke(this._zero);

    this._zero.array.length = 0;
    var compsPos = this._pos;

    if (compsPos.array.length > 0) {
      compsPos.array.sort(compareOrder);

      this._invoke(compsPos);

      compsPos.array.length = 0;
    }
  }
}); // for update: sort every time new component registered, invoke many times

var ReusableInvoker = cc.Class({
  "extends": LifeCycleInvoker,
  add: function add(comp) {
    var order = comp.constructor._executionOrder;

    if (order === 0) {
      this._zero.array.push(comp);
    } else {
      var array = order < 0 ? this._neg.array : this._pos.array;
      var i = sortedIndex(array, comp);

      if (i < 0) {
        array.splice(~i, 0, comp);
      } else if (CC_DEV) {
        cc.error('component already added');
      }
    }
  },
  remove: function remove(comp) {
    var order = comp.constructor._executionOrder;

    if (order === 0) {
      this._zero.fastRemove(comp);
    } else {
      var iterator = order < 0 ? this._neg : this._pos;
      var i = sortedIndex(iterator.array, comp);

      if (i >= 0) {
        iterator.removeAt(i);
      }
    }
  },
  invoke: function invoke(dt) {
    if (this._neg.array.length > 0) {
      this._invoke(this._neg, dt);
    }

    this._invoke(this._zero, dt);

    if (this._pos.array.length > 0) {
      this._invoke(this._pos, dt);
    }
  }
});

function enableInEditor(comp) {
  if (!(comp._objFlags & IsEditorOnEnableCalled)) {
    cc.engine.emit('component-enabled', comp.uuid);
    comp._objFlags |= IsEditorOnEnableCalled;
  }
} // return function to simply call each component with try catch protection


function createInvokeImpl(indiePath, useDt, ensureFlag, fastPath) {
  if (CC_SUPPORT_JIT) {
    // function (it) {
    //     var a = it.array;
    //     for (it.i = 0; it.i < a.length; ++it.i) {
    //         var c = a[it.i];
    //         // ...
    //     }
    // }
    var body = 'var a=it.array;' + 'for(it.i=0;it.i<a.length;++it.i){' + 'var c=a[it.i];' + indiePath + '}';
    fastPath = useDt ? Function('it', 'dt', body) : Function('it', body);
    indiePath = Function('c', 'dt', indiePath);
  }

  return function (iterator, dt) {
    try {
      fastPath(iterator, dt);
    } catch (e) {
      // slow path
      cc._throw(e);

      var array = iterator.array;

      if (ensureFlag) {
        array[iterator.i]._objFlags |= ensureFlag;
      }

      ++iterator.i; // invoke next callback

      for (; iterator.i < array.length; ++iterator.i) {
        try {
          indiePath(array[iterator.i], dt);
        } catch (e) {
          cc._throw(e);

          if (ensureFlag) {
            array[iterator.i]._objFlags |= ensureFlag;
          }
        }
      }
    }
  };
}

var invokeStart = CC_SUPPORT_JIT ? createInvokeImpl('c.start();c._objFlags|=' + IsStartCalled, false, IsStartCalled) : createInvokeImpl(function (c) {
  c.start();
  c._objFlags |= IsStartCalled;
}, false, IsStartCalled, function (iterator) {
  var array = iterator.array;

  for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
    var comp = array[iterator.i];
    comp.start();
    comp._objFlags |= IsStartCalled;
  }
});
var invokeUpdate = CC_SUPPORT_JIT ? createInvokeImpl('c.update(dt)', true) : createInvokeImpl(function (c, dt) {
  c.update(dt);
}, true, undefined, function (iterator, dt) {
  var array = iterator.array;

  for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
    array[iterator.i].update(dt);
  }
});
var invokeLateUpdate = CC_SUPPORT_JIT ? createInvokeImpl('c.lateUpdate(dt)', true) : createInvokeImpl(function (c, dt) {
  c.lateUpdate(dt);
}, true, undefined, function (iterator, dt) {
  var array = iterator.array;

  for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
    array[iterator.i].lateUpdate(dt);
  }
});
/**
 * The Manager for Component's life-cycle methods.
 */

function ctor() {
  // invokers
  this.startInvoker = new OneOffInvoker(invokeStart);
  this.updateInvoker = new ReusableInvoker(invokeUpdate);
  this.lateUpdateInvoker = new ReusableInvoker(invokeLateUpdate); // components deferred to next frame

  this.scheduleInNextFrame = []; // during a loop

  this._updating = false;
}

var ComponentScheduler = cc.Class({
  ctor: ctor,
  unscheduleAll: ctor,
  statics: {
    LifeCycleInvoker: LifeCycleInvoker,
    OneOffInvoker: OneOffInvoker,
    createInvokeImpl: createInvokeImpl,
    invokeOnEnable: CC_EDITOR ? function (iterator) {
      var compScheduler = cc.director._compScheduler;
      var array = iterator.array;

      for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
        var comp = array[iterator.i];

        if (comp._enabled) {
          callOnEnableInTryCatch(comp);
          var deactivatedDuringOnEnable = !comp.node._activeInHierarchy;

          if (!deactivatedDuringOnEnable) {
            compScheduler._onEnabled(comp);
          }
        }
      }
    } : function (iterator) {
      var compScheduler = cc.director._compScheduler;
      var array = iterator.array;

      for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
        var comp = array[iterator.i];

        if (comp._enabled) {
          comp.onEnable();
          var deactivatedDuringOnEnable = !comp.node._activeInHierarchy;

          if (!deactivatedDuringOnEnable) {
            compScheduler._onEnabled(comp);
          }
        }
      }
    }
  },
  _onEnabled: function _onEnabled(comp) {
    cc.director.getScheduler().resumeTarget(comp);
    comp._objFlags |= IsOnEnableCalled; // schedule

    if (this._updating) {
      this.scheduleInNextFrame.push(comp);
    } else {
      this._scheduleImmediate(comp);
    }
  },
  _onDisabled: function _onDisabled(comp) {
    cc.director.getScheduler().pauseTarget(comp);
    comp._objFlags &= ~IsOnEnableCalled; // cancel schedule task

    var index = this.scheduleInNextFrame.indexOf(comp);

    if (index >= 0) {
      jsArray.fastRemoveAt(this.scheduleInNextFrame, index);
      return;
    } // unschedule


    if (comp.start && !(comp._objFlags & IsStartCalled)) {
      this.startInvoker.remove(comp);
    }

    if (comp.update) {
      this.updateInvoker.remove(comp);
    }

    if (comp.lateUpdate) {
      this.lateUpdateInvoker.remove(comp);
    }
  },
  enableComp: CC_EDITOR ? function (comp, invoker) {
    if (cc.engine.isPlaying || comp.constructor._executeInEditMode) {
      if (!(comp._objFlags & IsOnEnableCalled)) {
        if (comp.onEnable) {
          if (invoker) {
            invoker.add(comp);
            enableInEditor(comp);
            return;
          } else {
            callOnEnableInTryCatch(comp);
            var deactivatedDuringOnEnable = !comp.node._activeInHierarchy;

            if (deactivatedDuringOnEnable) {
              return;
            }
          }
        }

        this._onEnabled(comp);
      }
    }

    enableInEditor(comp);
  } : function (comp, invoker) {
    if (!(comp._objFlags & IsOnEnableCalled)) {
      if (comp.onEnable) {
        if (invoker) {
          invoker.add(comp);
          return;
        } else {
          comp.onEnable();
          var deactivatedDuringOnEnable = !comp.node._activeInHierarchy;

          if (deactivatedDuringOnEnable) {
            return;
          }
        }
      }

      this._onEnabled(comp);
    }
  },
  disableComp: CC_EDITOR ? function (comp) {
    if (cc.engine.isPlaying || comp.constructor._executeInEditMode) {
      if (comp._objFlags & IsOnEnableCalled) {
        if (comp.onDisable) {
          callOnDisableInTryCatch(comp);
        }

        this._onDisabled(comp);
      }
    }

    if (comp._objFlags & IsEditorOnEnableCalled) {
      cc.engine.emit('component-disabled', comp.uuid);
      comp._objFlags &= ~IsEditorOnEnableCalled;
    }
  } : function (comp) {
    if (comp._objFlags & IsOnEnableCalled) {
      if (comp.onDisable) {
        comp.onDisable();
      }

      this._onDisabled(comp);
    }
  },
  _scheduleImmediate: function _scheduleImmediate(comp) {
    if (comp.start && !(comp._objFlags & IsStartCalled)) {
      this.startInvoker.add(comp);
    }

    if (comp.update) {
      this.updateInvoker.add(comp);
    }

    if (comp.lateUpdate) {
      this.lateUpdateInvoker.add(comp);
    }
  },
  _deferredSchedule: function _deferredSchedule() {
    var comps = this.scheduleInNextFrame;

    for (var i = 0, len = comps.length; i < len; i++) {
      var comp = comps[i];

      this._scheduleImmediate(comp);
    }

    comps.length = 0;
  },
  // Call new registered start schedule immediately since last time start phase calling in this frame
  // See cocos-creator/2d-tasks/issues/256
  _earlyStartForNewComps: function _earlyStartForNewComps() {
    if (this.scheduleInNextFrame.length > 0) {
      this._deferredSchedule();

      this.startInvoker.invoke();
    }
  },
  startPhase: function startPhase() {
    // Start of this frame
    this._updating = true;

    if (this.scheduleInNextFrame.length > 0) {
      this._deferredSchedule();
    } // call start


    this.startInvoker.invoke(); // As is often the case, _deferredSchedule should clear scheduleInNextFrame,
    // once not cleared, it indicates that there is a node activated during start

    this._earlyStartForNewComps(); // if (CC_PREVIEW) {
    //     try {
    //         this.startInvoker.invoke();
    //     }
    //     catch (e) {
    //         // prevent start from getting into infinite loop
    //         this.startInvoker._neg.array.length = 0;
    //         this.startInvoker._zero.array.length = 0;
    //         this.startInvoker._pos.array.length = 0;
    //         throw e;
    //     }
    // }
    // else {
    //     this.startInvoker.invoke();
    // }

  },
  updatePhase: function updatePhase(dt) {
    this.updateInvoker.invoke(dt);
  },
  lateUpdatePhase: function lateUpdatePhase(dt) {
    this.lateUpdateInvoker.invoke(dt); // End of this frame

    this._updating = false;
  },
  clearup: function clearup() {
    this._earlyStartForNewComps();
  }
});
module.exports = ComponentScheduler;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudC1zY2hlZHVsZXIuanMiXSwibmFtZXMiOlsicmVxdWlyZSIsIkZsYWdzIiwianNBcnJheSIsImFycmF5IiwiSXNTdGFydENhbGxlZCIsIklzT25FbmFibGVDYWxsZWQiLCJJc0VkaXRvck9uRW5hYmxlQ2FsbGVkIiwiY2FsbGVyRnVuY3RvciIsIkNDX0VESVRPUiIsInRyeUNhdGNoRnVuY3Rvcl9FRElUT1IiLCJjYWxsT25FbmFibGVJblRyeUNhdGNoIiwiY2FsbE9uRGlzYWJsZUluVHJ5Q2F0Y2giLCJzb3J0ZWRJbmRleCIsImNvbXAiLCJvcmRlciIsImNvbnN0cnVjdG9yIiwiX2V4ZWN1dGlvbk9yZGVyIiwiaWQiLCJfaWQiLCJsIiwiaCIsImxlbmd0aCIsIm0iLCJ0ZXN0IiwidGVzdE9yZGVyIiwidGVzdElkIiwic3RhYmxlUmVtb3ZlSW5hY3RpdmUiLCJpdGVyYXRvciIsImZsYWdUb0NsZWFyIiwibmV4dCIsImkiLCJfZW5hYmxlZCIsIm5vZGUiLCJfYWN0aXZlSW5IaWVyYXJjaHkiLCJyZW1vdmVBdCIsIl9vYmpGbGFncyIsIkxpZmVDeWNsZUludm9rZXIiLCJjYyIsIkNsYXNzIiwiX19jdG9yX18iLCJpbnZva2VGdW5jIiwiSXRlcmF0b3IiLCJNdXRhYmxlRm9yd2FyZEl0ZXJhdG9yIiwiX3plcm8iLCJfbmVnIiwiX3BvcyIsIkNDX1RFU1QiLCJhc3NlcnQiLCJfaW52b2tlIiwic3RhdGljcyIsImFkZCIsInJlbW92ZSIsImludm9rZSIsImNvbXBhcmVPcmRlciIsImEiLCJiIiwiT25lT2ZmSW52b2tlciIsInB1c2giLCJmYXN0UmVtb3ZlIiwiY2FuY2VsSW5hY3RpdmUiLCJjb21wc05lZyIsInNvcnQiLCJjb21wc1BvcyIsIlJldXNhYmxlSW52b2tlciIsInNwbGljZSIsIkNDX0RFViIsImVycm9yIiwiZHQiLCJlbmFibGVJbkVkaXRvciIsImVuZ2luZSIsImVtaXQiLCJ1dWlkIiwiY3JlYXRlSW52b2tlSW1wbCIsImluZGllUGF0aCIsInVzZUR0IiwiZW5zdXJlRmxhZyIsImZhc3RQYXRoIiwiQ0NfU1VQUE9SVF9KSVQiLCJib2R5IiwiRnVuY3Rpb24iLCJlIiwiX3Rocm93IiwiaW52b2tlU3RhcnQiLCJjIiwic3RhcnQiLCJpbnZva2VVcGRhdGUiLCJ1cGRhdGUiLCJ1bmRlZmluZWQiLCJpbnZva2VMYXRlVXBkYXRlIiwibGF0ZVVwZGF0ZSIsImN0b3IiLCJzdGFydEludm9rZXIiLCJ1cGRhdGVJbnZva2VyIiwibGF0ZVVwZGF0ZUludm9rZXIiLCJzY2hlZHVsZUluTmV4dEZyYW1lIiwiX3VwZGF0aW5nIiwiQ29tcG9uZW50U2NoZWR1bGVyIiwidW5zY2hlZHVsZUFsbCIsImludm9rZU9uRW5hYmxlIiwiY29tcFNjaGVkdWxlciIsImRpcmVjdG9yIiwiX2NvbXBTY2hlZHVsZXIiLCJkZWFjdGl2YXRlZER1cmluZ09uRW5hYmxlIiwiX29uRW5hYmxlZCIsIm9uRW5hYmxlIiwiZ2V0U2NoZWR1bGVyIiwicmVzdW1lVGFyZ2V0IiwiX3NjaGVkdWxlSW1tZWRpYXRlIiwiX29uRGlzYWJsZWQiLCJwYXVzZVRhcmdldCIsImluZGV4IiwiaW5kZXhPZiIsImZhc3RSZW1vdmVBdCIsImVuYWJsZUNvbXAiLCJpbnZva2VyIiwiaXNQbGF5aW5nIiwiX2V4ZWN1dGVJbkVkaXRNb2RlIiwiZGlzYWJsZUNvbXAiLCJvbkRpc2FibGUiLCJfZGVmZXJyZWRTY2hlZHVsZSIsImNvbXBzIiwibGVuIiwiX2Vhcmx5U3RhcnRGb3JOZXdDb21wcyIsInN0YXJ0UGhhc2UiLCJ1cGRhdGVQaGFzZSIsImxhdGVVcGRhdGVQaGFzZSIsImNsZWFydXAiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkFBLE9BQU8sQ0FBQyxvQkFBRCxDQUFQOztBQUNBLElBQUlDLEtBQUssR0FBR0QsT0FBTyxDQUFDLHFCQUFELENBQVAsQ0FBK0JDLEtBQTNDOztBQUNBLElBQUlDLE9B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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNILEdBck02QjtBQXVNOUJFLEVBQUFBLFdBdk04Qix1QkF1TWpCekQsRUF2TWlCLEVBdU1iO0FBQ2IsU0FBS3lCLGFBQUwsQ0FBbUJ4QyxNQUFuQixDQUEwQmUsRUFBMUI7QUFDSCxHQXpNNkI7QUEyTTlCMEQsRUFBQUEsZUEzTThCLDJCQTJNYjFELEVBM01hLEVBMk1UO0FBQ2pCLFNBQUswQixpQkFBTCxDQUF1QnpDLE1BQXZCLENBQThCZSxFQUE5QixFQURpQixDQUdqQjs7QUFDQSxTQUFLNEIsU0FBTCxHQUFpQixLQUFqQjtBQUNILEdBaE42QjtBQWtOOUIrQixFQUFBQSxPQWxOOEIscUJBa05uQjtBQUNQLFNBQUtKLHNCQUFMO0FBQ0g7QUFwTjZCLENBQVQsQ0FBekI7QUF1TkFLLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQmhDLGtCQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxucmVxdWlyZSgnLi9wbGF0Zm9ybS9DQ0NsYXNzJyk7XG52YXIgRmxhZ3MgPSByZXF1aXJlKCcuL3BsYXRmb3JtL0NDT2JqZWN0JykuRmxhZ3M7XG52YXIganNBcnJheSA9IHJlcXVpcmUoJy4vcGxhdGZvcm0vanMnKS5hcnJheTtcblxudmFyIElzU3RhcnRDYWxsZWQgPSBGbGFncy5Jc1N0YXJ0Q2FsbGVkO1xudmFyIElzT25FbmFibGVDYWxsZWQgPSBGbGFncy5Jc09uRW5hYmxlQ2FsbGVkO1xudmFyIElzRWRpdG9yT25FbmFibGVDYWxsZWQgPSBGbGFncy5Jc0VkaXRvck9uRW5hYmxlQ2FsbGVkO1xuXG52YXIgY2FsbGVyRnVuY3RvciA9IENDX0VESVRPUiAmJiByZXF1aXJlKCcuL3V0aWxzL21pc2MnKS50cnlDYXRjaEZ1bmN0b3JfRURJVE9SO1xudmFyIGNhbGxPbkVuYWJsZUluVHJ5Q2F0Y2ggPSBDQ19FRElUT1IgJiYgY2FsbGVyRnVuY3Rvcignb25FbmFibGUnKTtcbnZhciBjYWxsT25EaXNhYmxlSW5UcnlDYXRjaCA9IENDX0VESVRPUiAmJiBjYWxsZXJGdW5jdG9yKCdvbkRpc2FibGUnKTtcblxuZnVuY3Rpb24gc29ydGVkSW5kZXggKGFycmF5LCBjb21wKSB7XG4gICAgdmFyIG9yZGVyID0gY29tcC5jb25zdHJ1Y3Rvci5fZXhlY3V0aW9uT3JkZXI7XG4gICAgdmFyIGlkID0gY29tcC5faWQ7XG4gICAgZm9yICh2YXIgbCA9IDAsIGggPSBhcnJheS5sZW5ndGggLSAxLCBtID0gaCA+Pj4gMTtcbiAgICAgICAgIGwgPD0gaDtcbiAgICAgICAgIG0gPSAobCArIGgpID4+PiAxXG4gICAgKSB7XG4gICAgICAgIHZhciB0ZXN0ID0gYXJyYXlbbV07XG4gICAgICAgIHZhciB0ZXN0T3JkZXIgPSB0ZXN0LmNvbnN0cnVjdG9yLl9leGVjdXRpb25PcmRlcjtcbiAgICAgICAgaWYgKHRlc3RPcmRlciA+IG9yZGVyKSB7XG4gICAgICAgICAgICBoID0gbSAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGVzdE9yZGVyIDwgb3JkZXIpIHtcbiAgICAgICAgICAgIGwgPSBtICsgMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciB0ZXN0SWQgPSB0ZXN0Ll9pZDtcbiAgICAgICAgICAgIGlmICh0ZXN0SWQgPiBpZCkge1xuICAgICAgICAgICAgICAgIGggPSBtIC0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRlc3RJZCA8IGlkKSB7XG4gICAgICAgICAgICAgICAgbCA9IG0gKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIH5sO1xufVxuXG4vLyByZW1vdmUgZGlzYWJsZWQgYW5kIG5vdCBpbnZva2VkIGNvbXBvbmVudCBmcm9tIGFycmF5XG5mdW5jdGlvbiBzdGFibGVSZW1vdmVJbmFjdGl2ZSAoaXRlcmF0b3IsIGZsYWdUb0NsZWFyKSB7XG4gICAgdmFyIGFycmF5ID0gaXRlcmF0b3IuYXJyYXk7XG4gICAgdmFyIG5leHQgPSBpdGVyYXRvci5pICsgMTtcbiAgICB3aGlsZSAobmV4dCA8IGFycmF5Lmxlbmd0aCkge1xuICAgICAgICB2YXIgY29tcCA9IGFycmF5W25leHRdO1xuICAgICAgICBpZiAoY29tcC5fZW5hYmxlZCAmJiBjb21wLm5vZGUuX2FjdGl2ZUluSGllcmFyY2h5KSB7XG4gICAgICAgICAgICArK25leHQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpdGVyYXRvci5yZW1vdmVBdChuZXh0KTtcbiAgICAgICAgICAgIGlmIChmbGFnVG9DbGVhcikge1xuICAgICAgICAgICAgICAgIGNvbXAuX29iakZsYWdzICY9IH5mbGFnVG9DbGVhcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gVGhpcyBjbGFzcyBjb250YWlucyBzb21lIHF1ZXVlcyB1c2VkIHRvIGludm9rZSBsaWZlLWN5Y2xlIG1ldGhvZHMgYnkgc2NyaXB0IGV4ZWN1dGlvbiBvcmRlclxudmFyIExpZmVDeWNsZUludm9rZXIgPSBjYy5DbGFzcyh7XG4gICAgX19jdG9yX18gKGludm9rZUZ1bmMpIHtcbiAgICAgICAgdmFyIEl0ZXJhdG9yID0ganNBcnJheS5NdXRhYmxlRm9yd2FyZEl0ZXJhdG9yO1xuICAgICAgICAvLyBjb21wb25lbnRzIHdoaWNoIHByaW9yaXR5ID09PSAwIChkZWZhdWx0KVxuICAgICAgICB0aGlzLl96ZXJvID0gbmV3IEl0ZXJhdG9yKFtdKTtcbiAgICAgICAgLy8gY29tcG9uZW50cyB3aGljaCBwcmlvcml0eSA8IDBcbiAgICAgICAgdGhpcy5fbmVnID0gbmV3IEl0ZXJhdG9yKFtdKTtcbiAgICAgICAgLy8gY29tcG9uZW50cyB3aGljaCBwcmlvcml0eSA+IDBcbiAgICAgICAgdGhpcy5fcG9zID0gbmV3IEl0ZXJhdG9yKFtdKTtcblxuICAgICAgICBpZiAoQ0NfVEVTVCkge1xuICAgICAgICAgICAgY2MuYXNzZXJ0KHR5cGVvZiBpbnZva2VGdW5jID09PSAnZnVuY3Rpb24nLCAnaW52b2tlRnVuYyBtdXN0IGJlIHR5cGUgZnVuY3Rpb24nKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9pbnZva2UgPSBpbnZva2VGdW5jO1xuICAgIH0sXG4gICAgc3RhdGljczoge1xuICAgICAgICBzdGFibGVSZW1vdmVJbmFjdGl2ZVxuICAgIH0sXG4gICAgYWRkOiBudWxsLFxuICAgIHJlbW92ZTogbnVsbCxcbiAgICBpbnZva2U6IG51bGwsXG59KTtcblxuZnVuY3Rpb24gY29tcGFyZU9yZGVyIChhLCBiKSB7XG4gICAgcmV0dXJuIGEuY29uc3RydWN0b3IuX2V4ZWN1dGlvbk9yZGVyIC0gYi5jb25zdHJ1Y3Rvci5fZXhlY3V0aW9uT3JkZXI7XG59XG5cbi8vIGZvciBvbkxvYWQ6IHNvcnQgb25jZSBhbGwgY29tcG9uZW50cyByZWdpc3RlcmVkLCBpbnZva2Ugb25jZVxudmFyIE9uZU9mZkludm9rZXIgPSBjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogTGlmZUN5Y2xlSW52b2tlcixcbiAgICBhZGQgKGNvbXApIHtcbiAgICAgICAgdmFyIG9yZGVyID0gY29tcC5jb25zdHJ1Y3Rvci5fZXhlY3V0aW9uT3JkZXI7XG4gICAgICAgIChvcmRlciA9PT0gMCA/IHRoaXMuX3plcm8gOiAob3JkZXIgPCAwID8gdGhpcy5fbmVnIDogdGhpcy5fcG9zKSkuYXJyYXkucHVzaChjb21wKTtcbiAgICB9LFxuICAgIHJlbW92ZSAoY29tcCkge1xuICAgICAgICB2YXIgb3JkZXIgPSBjb21wLmNvbnN0cnVjdG9yLl9leGVjdXRpb25PcmRlcjtcbiAgICAgICAgKG9yZGVyID09PSAwID8gdGhpcy5femVybyA6IChvcmRlciA8IDAgPyB0aGlzLl9uZWcgOiB0aGlzLl9wb3MpKS5mYXN0UmVtb3ZlKGNvbXApO1xuICAgIH0sXG4gICAgY2FuY2VsSW5hY3RpdmUgKGZsYWdUb0NsZWFyKSB7XG4gICAgICAgIHN0YWJsZVJlbW92ZUluYWN0aXZlKHRoaXMuX3plcm8sIGZsYWdUb0NsZWFyKTtcbiAgICAgICAgc3RhYmxlUmVtb3ZlSW5hY3RpdmUodGhpcy5fbmVnLCBmbGFnVG9DbGVhcik7XG4gICAgICAgIHN0YWJsZVJlbW92ZUluYWN0aXZlKHRoaXMuX3BvcywgZmxhZ1RvQ2xlYXIpO1xuICAgIH0sXG4gICAgaW52b2tlICgpIHtcbiAgICAgICAgdmFyIGNvbXBzTmVnID0gdGhpcy5fbmVnO1xuICAgICAgICBpZiAoY29tcHNOZWcuYXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29tcHNOZWcuYXJyYXkuc29ydChjb21wYXJlT3JkZXIpO1xuICAgICAgICAgICAgdGhpcy5faW52b2tlKGNvbXBzTmVnKTtcbiAgICAgICAgICAgIGNvbXBzTmVnLmFycmF5Lmxlbmd0aCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9pbnZva2UodGhpcy5femVybyk7XG4gICAgICAgIHRoaXMuX3plcm8uYXJyYXkubGVuZ3RoID0gMDtcblxuICAgICAgICB2YXIgY29tcHNQb3MgPSB0aGlzLl9wb3M7XG4gICAgICAgIGlmIChjb21wc1Bvcy5hcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb21wc1Bvcy5hcnJheS5zb3J0KGNvbXBhcmVPcmRlcik7XG4gICAgICAgICAgICB0aGlzLl9pbnZva2UoY29tcHNQb3MpO1xuICAgICAgICAgICAgY29tcHNQb3MuYXJyYXkubGVuZ3RoID0gMDtcbiAgICAgICAgfVxuICAgIH0sXG59KTtcblxuLy8gZm9yIHVwZGF0ZTogc29ydCBldmVyeSB0aW1lIG5ldyBjb21wb25lbnQgcmVnaXN0ZXJlZCwgaW52b2tlIG1hbnkgdGltZXNcbnZhciBSZXVzYWJsZUludm9rZXIgPSBjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogTGlmZUN5Y2xlSW52b2tlcixcbiAgICBhZGQgKGNvbXApIHtcbiAgICAgICAgdmFyIG9yZGVyID0gY29tcC5jb25zdHJ1Y3Rvci5fZXhlY3V0aW9uT3JkZXI7XG4gICAgICAgIGlmIChvcmRlciA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5femVyby5hcnJheS5wdXNoKGNvbXApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGFycmF5ID0gb3JkZXIgPCAwID8gdGhpcy5fbmVnLmFycmF5IDogdGhpcy5fcG9zLmFycmF5O1xuICAgICAgICAgICAgdmFyIGkgPSBzb3J0ZWRJbmRleChhcnJheSwgY29tcCk7XG4gICAgICAgICAgICBpZiAoaSA8IDApIHtcbiAgICAgICAgICAgICAgICBhcnJheS5zcGxpY2UofmksIDAsIGNvbXApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoQ0NfREVWKSB7XG4gICAgICAgICAgICAgICAgY2MuZXJyb3IoJ2NvbXBvbmVudCBhbHJlYWR5IGFkZGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlbW92ZSAoY29tcCkge1xuICAgICAgICB2YXIgb3JkZXIgPSBjb21wLmNvbnN0cnVjdG9yLl9leGVjdXRpb25PcmRlcjtcbiAgICAgICAgaWYgKG9yZGVyID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl96ZXJvLmZhc3RSZW1vdmUoY29tcCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBvcmRlciA8IDAgPyB0aGlzLl9uZWcgOiB0aGlzLl9wb3M7XG4gICAgICAgICAgICB2YXIgaSA9IHNvcnRlZEluZGV4KGl0ZXJhdG9yLmFycmF5LCBjb21wKTtcbiAgICAgICAgICAgIGlmIChpID49IDApIHtcbiAgICAgICAgICAgICAgICBpdGVyYXRvci5yZW1vdmVBdChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgaW52b2tlIChkdCkge1xuICAgICAgICBpZiAodGhpcy5fbmVnLmFycmF5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2ludm9rZSh0aGlzLl9uZWcsIGR0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2ludm9rZSh0aGlzLl96ZXJvLCBkdCk7XG5cbiAgICAgICAgaWYgKHRoaXMuX3Bvcy5hcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLl9pbnZva2UodGhpcy5fcG9zLCBkdCk7XG4gICAgICAgIH1cbiAgICB9LFxufSk7XG5cbmZ1bmN0aW9uIGVuYWJsZUluRWRpdG9yIChjb21wKSB7XG4gICAgaWYgKCEoY29tcC5fb2JqRmxhZ3MgJiBJc0VkaXRvck9uRW5hYmxlQ2FsbGVkKSkge1xuICAgICAgICBjYy5lbmdpbmUuZW1pdCgnY29tcG9uZW50LWVuYWJsZWQnLCBjb21wLnV1aWQpO1xuICAgICAgICBjb21wLl9vYmpGbGFncyB8PSBJc0VkaXRvck9uRW5hYmxlQ2FsbGVkO1xuICAgIH1cbn1cblxuLy8gcmV0dXJuIGZ1bmN0aW9uIHRvIHNpbXBseSBjYWxsIGVhY2ggY29tcG9uZW50IHdpdGggdHJ5IGNhdGNoIHByb3RlY3Rpb25cbmZ1bmN0aW9uIGNyZWF0ZUludm9rZUltcGwgKGluZGllUGF0aCwgdXNlRHQsIGVuc3VyZUZsYWcsIGZhc3RQYXRoKSB7XG4gICAgaWYgKENDX1NVUFBPUlRfSklUKSB7XG4gICAgICAgIC8vIGZ1bmN0aW9uIChpdCkge1xuICAgICAgICAvLyAgICAgdmFyIGEgPSBpdC5hcnJheTtcbiAgICAgICAgLy8gICAgIGZvciAoaXQuaSA9IDA7IGl0LmkgPCBhLmxlbmd0aDsgKytpdC5pKSB7XG4gICAgICAgIC8vICAgICAgICAgdmFyIGMgPSBhW2l0LmldO1xuICAgICAgICAvLyAgICAgICAgIC8vIC4uLlxuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9XG4gICAgICAgIGxldCBib2R5ID0gJ3ZhciBhPWl0LmFycmF5OycgK1xuICAgICAgICAgICAgICAgICAgICdmb3IoaXQuaT0wO2l0Lmk8YS5sZW5ndGg7KytpdC5pKXsnICtcbiAgICAgICAgICAgICAgICAgICAndmFyIGM9YVtpdC5pXTsnICtcbiAgICAgICAgICAgICAgICAgICBpbmRpZVBhdGggK1xuICAgICAgICAgICAgICAgICAgICd9JztcbiAgICAgICAgZmFzdFBhdGggPSB1c2VEdCA/IEZ1bmN0aW9uKCdpdCcsICdkdCcsIGJvZHkpIDogRnVuY3Rpb24oJ2l0JywgYm9keSk7XG4gICAgICAgIGluZGllUGF0aCA9IEZ1bmN0aW9uKCdjJywgJ2R0JywgaW5kaWVQYXRoKTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChpdGVyYXRvciwgZHQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZhc3RQYXRoKGl0ZXJhdG9yLCBkdCk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8vIHNsb3cgcGF0aFxuICAgICAgICAgICAgY2MuX3Rocm93KGUpO1xuICAgICAgICAgICAgdmFyIGFycmF5ID0gaXRlcmF0b3IuYXJyYXk7XG4gICAgICAgICAgICBpZiAoZW5zdXJlRmxhZykge1xuICAgICAgICAgICAgICAgIGFycmF5W2l0ZXJhdG9yLmldLl9vYmpGbGFncyB8PSBlbnN1cmVGbGFnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgKytpdGVyYXRvci5pOyAgIC8vIGludm9rZSBuZXh0IGNhbGxiYWNrXG4gICAgICAgICAgICBmb3IgKDsgaXRlcmF0b3IuaSA8IGFycmF5Lmxlbmd0aDsgKytpdGVyYXRvci5pKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaW5kaWVQYXRoKGFycmF5W2l0ZXJhdG9yLmldLCBkdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLl90aHJvdyhlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVuc3VyZUZsYWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5W2l0ZXJhdG9yLmldLl9vYmpGbGFncyB8PSBlbnN1cmVGbGFnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn1cblxudmFyIGludm9rZVN0YXJ0ID0gQ0NfU1VQUE9SVF9KSVQgP1xuICAgIGNyZWF0ZUludm9rZUltcGwoJ2Muc3RhcnQoKTtjLl9vYmpGbGFnc3w9JyArIElzU3RhcnRDYWxsZWQsIGZhbHNlLCBJc1N0YXJ0Q2FsbGVkKSA6XG4gICAgY3JlYXRlSW52b2tlSW1wbChmdW5jdGlvbiAoYykge1xuICAgICAgICAgICAgYy5zdGFydCgpO1xuICAgICAgICAgICAgYy5fb2JqRmxhZ3MgfD0gSXNTdGFydENhbGxlZDtcbiAgICAgICAgfSxcbiAgICAgICAgZmFsc2UsXG4gICAgICAgIElzU3RhcnRDYWxsZWQsXG4gICAgICAgIGZ1bmN0aW9uIChpdGVyYXRvcikge1xuICAgICAgICAgICAgdmFyIGFycmF5ID0gaXRlcmF0b3IuYXJyYXk7XG4gICAgICAgICAgICBmb3IgKGl0ZXJhdG9yLmkgPSAwOyBpdGVyYXRvci5pIDwgYXJyYXkubGVuZ3RoOyArK2l0ZXJhdG9yLmkpIHtcbiAgICAgICAgICAgICAgICBsZXQgY29tcCA9IGFycmF5W2l0ZXJhdG9yLmldO1xuICAgICAgICAgICAgICAgIGNvbXAuc3RhcnQoKTtcbiAgICAgICAgICAgICAgICBjb21wLl9vYmpGbGFncyB8PSBJc1N0YXJ0Q2FsbGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgKTtcbnZhciBpbnZva2VVcGRhdGUgPSBDQ19TVVBQT1JUX0pJVCA/XG4gICAgY3JlYXRlSW52b2tlSW1wbCgnYy51cGRhdGUoZHQpJywgdHJ1ZSkgOlxuICAgIGNyZWF0ZUludm9rZUltcGwoZnVuY3Rpb24gKGMsIGR0KSB7XG4gICAgICAgICAgICBjLnVwZGF0ZShkdCk7XG4gICAgICAgIH0sXG4gICAgICAgIHRydWUsXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgZnVuY3Rpb24gKGl0ZXJhdG9yLCBkdCkge1xuICAgICAgICAgICAgdmFyIGFycmF5ID0gaXRlcmF0b3IuYXJyYXk7XG4gICAgICAgICAgICBmb3IgKGl0ZXJhdG9yLmkgPSAwOyBpdGVyYXRvci5pIDwgYXJyYXkubGVuZ3RoOyArK2l0ZXJhdG9yLmkpIHtcbiAgICAgICAgICAgICAgICBhcnJheVtpdGVyYXRvci5pXS51cGRhdGUoZHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgKTtcbnZhciBpbnZva2VMYXRlVXBkYXRlID0gQ0NfU1VQUE9SVF9KSVQgP1xuICAgIGNyZWF0ZUludm9rZUltcGwoJ2MubGF0ZVVwZGF0ZShkdCknLCB0cnVlKSA6XG4gICAgY3JlYXRlSW52b2tlSW1wbChmdW5jdGlvbiAoYywgZHQpIHtcbiAgICAgICAgICAgIGMubGF0ZVVwZGF0ZShkdCk7XG4gICAgICAgIH0sXG4gICAgICAgIHRydWUsXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgZnVuY3Rpb24gKGl0ZXJhdG9yLCBkdCkge1xuICAgICAgICAgICAgdmFyIGFycmF5ID0gaXRlcmF0b3IuYXJyYXk7XG4gICAgICAgICAgICBmb3IgKGl0ZXJhdG9yLmkgPSAwOyBpdGVyYXRvci5pIDwgYXJyYXkubGVuZ3RoOyArK2l0ZXJhdG9yLmkpIHtcbiAgICAgICAgICAgICAgICBhcnJheVtpdGVyYXRvci5pXS5sYXRlVXBkYXRlKGR0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICk7XG4vKipcbiAqIFRoZSBNYW5hZ2VyIGZvciBDb21wb25lbnQncyBsaWZlLWN5Y2xlIG1ldGhvZHMuXG4gKi9cbmZ1bmN0aW9uIGN0b3IgKCkge1xuICAgIC8vIGludm9rZXJzXG4gICAgdGhpcy5zdGFydEludm9rZXIgPSBuZXcgT25lT2ZmSW52b2tlcihpbnZva2VTdGFydCk7XG4gICAgdGhpcy51cGRhdGVJbnZva2VyID0gbmV3IFJldXNhYmxlSW52b2tlcihpbnZva2VVcGRhdGUpO1xuICAgIHRoaXMubGF0ZVVwZGF0ZUludm9rZXIgPSBuZXcgUmV1c2FibGVJbnZva2VyKGludm9rZUxhdGVVcGRhdGUpO1xuXG4gICAgLy8gY29tcG9uZW50cyBkZWZlcnJlZCB0byBuZXh0IGZyYW1lXG4gICAgdGhpcy5zY2hlZHVsZUluTmV4dEZyYW1lID0gW107XG5cbiAgICAvLyBkdXJpbmcgYSBsb29wXG4gICAgdGhpcy5fdXBkYXRpbmcgPSBmYWxzZTtcbn1cbnZhciBDb21wb25lbnRTY2hlZHVsZXIgPSBjYy5DbGFzcyh7XG4gICAgY3RvcjogY3RvcixcbiAgICB1bnNjaGVkdWxlQWxsOiBjdG9yLFxuXG4gICAgc3RhdGljczoge1xuICAgICAgICBMaWZlQ3ljbGVJbnZva2VyLFxuICAgICAgICBPbmVPZmZJbnZva2VyLFxuICAgICAgICBjcmVhdGVJbnZva2VJbXBsLFxuICAgICAgICBpbnZva2VPbkVuYWJsZTogQ0NfRURJVE9SID8gZnVuY3Rpb24gKGl0ZXJhdG9yKSB7XG4gICAgICAgICAgICB2YXIgY29tcFNjaGVkdWxlciA9IGNjLmRpcmVjdG9yLl9jb21wU2NoZWR1bGVyO1xuICAgICAgICAgICAgdmFyIGFycmF5ID0gaXRlcmF0b3IuYXJyYXk7XG4gICAgICAgICAgICBmb3IgKGl0ZXJhdG9yLmkgPSAwOyBpdGVyYXRvci5pIDwgYXJyYXkubGVuZ3RoOyArK2l0ZXJhdG9yLmkpIHtcbiAgICAgICAgICAgICAgICBsZXQgY29tcCA9IGFycmF5W2l0ZXJhdG9yLmldO1xuICAgICAgICAgICAgICAgIGlmIChjb21wLl9lbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxPbkVuYWJsZUluVHJ5Q2F0Y2goY29tcCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkZWFjdGl2YXRlZER1cmluZ09uRW5hYmxlID0gIWNvbXAubm9kZS5fYWN0aXZlSW5IaWVyYXJjaHk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZGVhY3RpdmF0ZWREdXJpbmdPbkVuYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tcFNjaGVkdWxlci5fb25FbmFibGVkKGNvbXApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IDogZnVuY3Rpb24gKGl0ZXJhdG9yKSB7XG4gICAgICAgICAgICB2YXIgY29tcFNjaGVkdWxlciA9IGNjLmRpcmVjdG9yLl9jb21wU2NoZWR1bGVyO1xuICAgICAgICAgICAgdmFyIGFycmF5ID0gaXRlcmF0b3IuYXJyYXk7XG4gICAgICAgICAgICBmb3IgKGl0ZXJhdG9yLmkgPSAwOyBpdGVyYXRvci5pIDwgYXJyYXkubGVuZ3RoOyArK2l0ZXJhdG9yLmkpIHtcbiAgICAgICAgICAgICAgICBsZXQgY29tcCA9IGFycmF5W2l0ZXJhdG9yLmldO1xuICAgICAgICAgICAgICAgIGlmIChjb21wLl9lbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXAub25FbmFibGUoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRlYWN0aXZhdGVkRHVyaW5nT25FbmFibGUgPSAhY29tcC5ub2RlLl9hY3RpdmVJbkhpZXJhcmNoeTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkZWFjdGl2YXRlZER1cmluZ09uRW5hYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wU2NoZWR1bGVyLl9vbkVuYWJsZWQoY29tcCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX29uRW5hYmxlZCAoY29tcCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5nZXRTY2hlZHVsZXIoKS5yZXN1bWVUYXJnZXQoY29tcCk7XG4gICAgICAgIGNvbXAuX29iakZsYWdzIHw9IElzT25FbmFibGVDYWxsZWQ7XG5cbiAgICAgICAgLy8gc2NoZWR1bGVcbiAgICAgICAgaWYgKHRoaXMuX3VwZGF0aW5nKSB7XG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlSW5OZXh0RnJhbWUucHVzaChjb21wKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3NjaGVkdWxlSW1tZWRpYXRlKGNvbXApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9vbkRpc2FibGVkIChjb21wKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmdldFNjaGVkdWxlcigpLnBhdXNlVGFyZ2V0KGNvbXApO1xuICAgICAgICBjb21wLl9vYmpGbGFncyAmPSB+SXNPbkVuYWJsZUNhbGxlZDtcblxuICAgICAgICAvLyBjYW5jZWwgc2NoZWR1bGUgdGFza1xuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnNjaGVkdWxlSW5OZXh0RnJhbWUuaW5kZXhPZihjb21wKTtcbiAgICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgICAgIGpzQXJyYXkuZmFzdFJlbW92ZUF0KHRoaXMuc2NoZWR1bGVJbk5leHRGcmFtZSwgaW5kZXgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdW5zY2hlZHVsZVxuICAgICAgICBpZiAoY29tcC5zdGFydCAmJiAhKGNvbXAuX29iakZsYWdzICYgSXNTdGFydENhbGxlZCkpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRJbnZva2VyLnJlbW92ZShjb21wKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29tcC51cGRhdGUpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSW52b2tlci5yZW1vdmUoY29tcCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbXAubGF0ZVVwZGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5sYXRlVXBkYXRlSW52b2tlci5yZW1vdmUoY29tcCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZW5hYmxlQ29tcDogQ0NfRURJVE9SID8gZnVuY3Rpb24gKGNvbXAsIGludm9rZXIpIHtcbiAgICAgICAgaWYgKGNjLmVuZ2luZS5pc1BsYXlpbmcgfHwgY29tcC5jb25zdHJ1Y3Rvci5fZXhlY3V0ZUluRWRpdE1vZGUpIHtcbiAgICAgICAgICAgIGlmICghKGNvbXAuX29iakZsYWdzICYgSXNPbkVuYWJsZUNhbGxlZCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29tcC5vbkVuYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW52b2tlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW52b2tlci5hZGQoY29tcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVJbkVkaXRvcihjb21wKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxPbkVuYWJsZUluVHJ5Q2F0Y2goY29tcCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZWFjdGl2YXRlZER1cmluZ09uRW5hYmxlID0gIWNvbXAubm9kZS5fYWN0aXZlSW5IaWVyYXJjaHk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGVhY3RpdmF0ZWREdXJpbmdPbkVuYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9vbkVuYWJsZWQoY29tcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZW5hYmxlSW5FZGl0b3IoY29tcCk7XG4gICAgfSA6IGZ1bmN0aW9uIChjb21wLCBpbnZva2VyKSB7XG4gICAgICAgIGlmICghKGNvbXAuX29iakZsYWdzICYgSXNPbkVuYWJsZUNhbGxlZCkpIHtcbiAgICAgICAgICAgIGlmIChjb21wLm9uRW5hYmxlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGludm9rZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaW52b2tlci5hZGQoY29tcCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXAub25FbmFibGUoKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgZGVhY3RpdmF0ZWREdXJpbmdPbkVuYWJsZSA9ICFjb21wLm5vZGUuX2FjdGl2ZUluSGllcmFyY2h5O1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGVhY3RpdmF0ZWREdXJpbmdPbkVuYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fb25FbmFibGVkKGNvbXApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGRpc2FibGVDb21wOiBDQ19FRElUT1IgPyBmdW5jdGlvbiAoY29tcCkge1xuICAgICAgICBpZiAoY2MuZW5naW5lLmlzUGxheWluZyB8fCBjb21wLmNvbnN0cnVjdG9yLl9leGVjdXRlSW5FZGl0TW9kZSkge1xuICAgICAgICAgICAgaWYgKGNvbXAuX29iakZsYWdzICYgSXNPbkVuYWJsZUNhbGxlZCkge1xuICAgICAgICAgICAgICAgIGlmIChjb21wLm9uRGlzYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsT25EaXNhYmxlSW5UcnlDYXRjaChjb21wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fb25EaXNhYmxlZChjb21wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoY29tcC5fb2JqRmxhZ3MgJiBJc0VkaXRvck9uRW5hYmxlQ2FsbGVkKSB7XG4gICAgICAgICAgICBjYy5lbmdpbmUuZW1pdCgnY29tcG9uZW50LWRpc2FibGVkJywgY29tcC51dWlkKTtcbiAgICAgICAgICAgIGNvbXAuX29iakZsYWdzICY9IH5Jc0VkaXRvck9uRW5hYmxlQ2FsbGVkO1xuICAgICAgICB9XG4gICAgfSA6IGZ1bmN0aW9uIChjb21wKSB7XG4gICAgICAgIGlmIChjb21wLl9vYmpGbGFncyAmIElzT25FbmFibGVDYWxsZWQpIHtcbiAgICAgICAgICAgIGlmIChjb21wLm9uRGlzYWJsZSkge1xuICAgICAgICAgICAgICAgIGNvbXAub25EaXNhYmxlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9vbkRpc2FibGVkKGNvbXApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9zY2hlZHVsZUltbWVkaWF0ZSAoY29tcCkge1xuICAgICAgICBpZiAoY29tcC5zdGFydCAmJiAhKGNvbXAuX29iakZsYWdzICYgSXNTdGFydENhbGxlZCkpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRJbnZva2VyLmFkZChjb21wKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29tcC51cGRhdGUpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSW52b2tlci5hZGQoY29tcCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbXAubGF0ZVVwZGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5sYXRlVXBkYXRlSW52b2tlci5hZGQoY29tcCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2RlZmVycmVkU2NoZWR1bGUgKCkge1xuICAgICAgICB2YXIgY29tcHMgPSB0aGlzLnNjaGVkdWxlSW5OZXh0RnJhbWU7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjb21wcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgdmFyIGNvbXAgPSBjb21wc1tpXTtcbiAgICAgICAgICAgIHRoaXMuX3NjaGVkdWxlSW1tZWRpYXRlKGNvbXApO1xuICAgICAgICB9XG4gICAgICAgIGNvbXBzLmxlbmd0aCA9IDA7XG4gICAgfSxcblxuICAgIC8vIENhbGwgbmV3IHJlZ2lzdGVyZWQgc3RhcnQgc2NoZWR1bGUgaW1tZWRpYXRlbHkgc2luY2UgbGFzdCB0aW1lIHN0YXJ0IHBoYXNlIGNhbGxpbmcgaW4gdGhpcyBmcmFtZVxuICAgIC8vIFNlZSBjb2Nvcy1jcmVhdG9yLzJkLXRhc2tzL2lzc3Vlcy8yNTZcbiAgICBfZWFybHlTdGFydEZvck5ld0NvbXBzICgpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NoZWR1bGVJbk5leHRGcmFtZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLl9kZWZlcnJlZFNjaGVkdWxlKCk7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0SW52b2tlci5pbnZva2UoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzdGFydFBoYXNlICgpIHtcbiAgICAgICAgLy8gU3RhcnQgb2YgdGhpcyBmcmFtZVxuICAgICAgICB0aGlzLl91cGRhdGluZyA9IHRydWU7XG5cbiAgICAgICAgaWYgKHRoaXMuc2NoZWR1bGVJbk5leHRGcmFtZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLl9kZWZlcnJlZFNjaGVkdWxlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjYWxsIHN0YXJ0XG4gICAgICAgIHRoaXMuc3RhcnRJbnZva2VyLmludm9rZSgpO1xuXG4gICAgICAgIC8vIEFzIGlzIG9mdGVuIHRoZSBjYXNlLCBfZGVmZXJyZWRTY2hlZHVsZSBzaG91bGQgY2xlYXIgc2NoZWR1bGVJbk5leHRGcmFtZSxcbiAgICAgICAgLy8gb25jZSBub3QgY2xlYXJlZCwgaXQgaW5kaWNhdGVzIHRoYXQgdGhlcmUgaXMgYSBub2RlIGFjdGl2YXRlZCBkdXJpbmcgc3RhcnRcbiAgICAgICAgdGhpcy5fZWFybHlTdGFydEZvck5ld0NvbXBzKCk7XG5cbiAgICAgICAgLy8gaWYgKENDX1BSRVZJRVcpIHtcbiAgICAgICAgLy8gICAgIHRyeSB7XG4gICAgICAgIC8vICAgICAgICAgdGhpcy5zdGFydEludm9rZXIuaW52b2tlKCk7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vICAgICBjYXRjaCAoZSkge1xuICAgICAgICAvLyAgICAgICAgIC8vIHByZXZlbnQgc3RhcnQgZnJvbSBnZXR0aW5nIGludG8gaW5maW5pdGUgbG9vcFxuICAgICAgICAvLyAgICAgICAgIHRoaXMuc3RhcnRJbnZva2VyLl9uZWcuYXJyYXkubGVuZ3RoID0gMDtcbiAgICAgICAgLy8gICAgICAgICB0aGlzLnN0YXJ0SW52b2tlci5femVyby5hcnJheS5sZW5ndGggPSAwO1xuICAgICAgICAvLyAgICAgICAgIHRoaXMuc3RhcnRJbnZva2VyLl9wb3MuYXJyYXkubGVuZ3RoID0gMDtcbiAgICAgICAgLy8gICAgICAgICB0aHJvdyBlO1xuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9XG4gICAgICAgIC8vIGVsc2Uge1xuICAgICAgICAvLyAgICAgdGhpcy5zdGFydEludm9rZXIuaW52b2tlKCk7XG4gICAgICAgIC8vIH1cbiAgICB9LFxuXG4gICAgdXBkYXRlUGhhc2UgKGR0KSB7XG4gICAgICAgIHRoaXMudXBkYXRlSW52b2tlci5pbnZva2UoZHQpO1xuICAgIH0sXG5cbiAgICBsYXRlVXBkYXRlUGhhc2UgKGR0KSB7XG4gICAgICAgIHRoaXMubGF0ZVVwZGF0ZUludm9rZXIuaW52b2tlKGR0KTtcblxuICAgICAgICAvLyBFbmQgb2YgdGhpcyBmcmFtZVxuICAgICAgICB0aGlzLl91cGRhdGluZyA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBjbGVhcnVwICgpIHtcbiAgICAgICAgdGhpcy5fZWFybHlTdGFydEZvck5ld0NvbXBzKCk7XG4gICAgfSxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvbmVudFNjaGVkdWxlcjtcbiJdfQ==