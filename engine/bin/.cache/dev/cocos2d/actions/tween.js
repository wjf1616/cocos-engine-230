
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/actions/tween.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var TweenAction = cc.Class({
  name: 'cc.TweenAction',
  "extends": cc.ActionInterval,
  ctor: function ctor(duration, props, opts) {
    this._opts = opts = opts || Object.create(null);
    this._props = Object.create(null); // global easing or progress used for this action

    opts.progress = opts.progress || this.progress;

    if (opts.easing && typeof opts.easing === 'string') {
      var easingName = opts.easing;
      opts.easing = cc.easing[easingName];
      !opts.easing && cc.warnID(1031, easingName);
    }

    var relative = this._opts.relative;

    for (var name in props) {
      var value = props[name]; // property may have custom easing or progress function

      var easing = void 0,
          progress = void 0;

      if (value.value !== undefined && (value.easing || value.progress)) {
        if (typeof value.easing === 'string') {
          easing = cc.easing[value.easing];
          !easing && cc.warnID(1031, value.easing);
        } else {
          easing = value.easing;
        }

        progress = value.progress;
        value = value.value;
      }

      var isNumber = typeof value === 'number';

      if (!isNumber && (!value.lerp || relative && !value.add && !value.mul || !value.clone)) {
        cc.warn("Can not animate " + name + " property, because it do not have [lerp, (add|mul), clone] function.");
        continue;
      }

      var prop = Object.create(null);
      prop.value = value;
      prop.easing = easing;
      prop.progress = progress;
      this._props[name] = prop;
    }

    this._originProps = props;
    this.initWithDuration(duration);
  },
  clone: function clone() {
    var action = new TweenAction(this._duration, this._originProps, this._opts);

    this._cloneDecoration(action);

    return action;
  },
  startWithTarget: function startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);
    var relative = !!this._opts.relative;
    var props = this._props;

    for (var name in props) {
      var value = target[name];
      var prop = props[name];

      if (typeof value === 'number') {
        prop.start = value;
        prop.current = value;
        prop.end = relative ? value + prop.value : prop.value;
      } else {
        prop.start = value.clone();
        prop.current = value.clone();
        prop.end = relative ? (value.add || value.mul).call(value, prop.value) : prop.value;
      }
    }
  },
  update: function update(t) {
    var opts = this._opts;
    var easingTime = t;
    if (opts.easing) easingTime = opts.easing(t);
    var target = this.target;
    if (!target) return;
    var props = this._props;
    var progress = this._opts.progress;

    for (var name in props) {
      var prop = props[name];
      var time = prop.easing ? prop.easing(t) : easingTime;
      var current = prop.current = (prop.progress || progress)(prop.start, prop.end, prop.current, time);
      target[name] = current;
    }
  },
  progress: function progress(start, end, current, t) {
    if (typeof start === 'number') {
      current = start + (end - start) * t;
    } else {
      start.lerp(end, t, current);
    }

    return current;
  }
});
var SetAction = cc.Class({
  name: 'cc.SetAction',
  "extends": cc.ActionInstant,
  ctor: function ctor(props) {
    this._props = {};
    props !== undefined && this.init(props);
  },
  init: function init(props) {
    for (var name in props) {
      this._props[name] = props[name];
    }

    return true;
  },
  update: function update() {
    var props = this._props;
    var target = this.target;

    for (var name in props) {
      target[name] = props[name];
    }
  },
  clone: function clone() {
    var action = new SetAction();
    action.init(this._props);
    return action;
  }
});
/**
 * !#en
 * Tween provide a simple and flexible way to create action.
 * Tween's api is more flexible than cc.Action:
 *  - Support creating an action sequence in chained api,
 *  - Support animate any objects' any properties, not limited to node's properties.
 *    By contrast, cc.Action needs to create a new action class to support new node property.
 *  - Support working with cc.Action,
 *  - Support easing and progress function.
 * !#zh
 * Tween 提供了一个简单灵活的方法来创建 action。
 * 相对于 Cocos 传统的 cc.Action，cc.Tween 在创建动画上要灵活非常多：
 *  - 支持以链式结构的方式创建一个动画序列。
 *  - 支持对任意对象的任意属性进行缓动，不再局限于节点上的属性，而 cc.Action 添加一个属性的支持时还需要添加一个新的 action 类型。
 *  - 支持与 cc.Action 混用
 *  - 支持设置 {{#crossLink "Easing"}}{{/crossLink}} 或者 progress 函数
 * @class Tween
 * @param {Object} [target]
 * @example
 * cc.tween(node)
 *   .to(1, {scale: 2, position: cc.v3(100, 100, 100)})
 *   .call(() => { console.log('This is a callback'); })
 *   .by(1, {scale: 3, position: cc.v3(200, 200, 200)}, {easing: 'sineOutIn'})
 *   .run(cc.find('Canvas/cocos'));
 */

function Tween(target) {
  this._actions = [];
  this._finalAction = null;
  this._target = target;
}
/**
 * !#en
 * Insert an action or tween to this sequence
 * !#zh
 * 插入一个 action 或者 tween 到队列中
 * @method then 
 * @param {Action|Tween} other
 * @return {Tween}
 */


Tween.prototype.then = function (other) {
  if (other instanceof cc.Action) {
    this._actions.push(other.clone());
  } else {
    this._actions.push(other._union());
  }

  return this;
};
/**
 * !#en
 * Set tween target
 * !#zh
 * 设置 tween 的 target
 * @method target
 * @param {Object} target
 * @return {Tween}
 */


Tween.prototype.target = function (target) {
  this._target = target;
  return this;
};
/**
 * !#en
 * Start this tween
 * !#zh
 * 运行当前 tween
 * @method start
 * @return {Tween}
 */


Tween.prototype.start = function () {
  if (!this._target) {
    cc.warn('Please set target to tween first');
    return this;
  }

  if (this._finalAction) {
    cc.director.getActionManager().removeAction(this._finalAction);
  }

  this._finalAction = this._union();
  cc.director.getActionManager().addAction(this._finalAction, this._target, false);
  return this;
};
/**
 * !#en
 * Stop this tween
 * !#zh
 * 停止当前 tween
 * @method stop
 * @return {Tween}
 */


Tween.prototype.stop = function () {
  if (this._finalAction) {
    cc.director.getActionManager().removeAction(this._finalAction);
  }

  return this;
};
/**
 * !#en
 * Clone a tween
 * !#zh
 * 克隆当前 tween
 * @method clone
 * @param {Object} [target]
 * @return {Tween}
 */


Tween.prototype.clone = function (target) {
  var action = this._union();

  return cc.tween(target).then(action.clone());
};
/**
 * !#en
 * Integrate all previous actions to an action.
 * !#zh
 * 将之前所有的 action 整合为一个 action。
 * @method union
 * @return {Tween}
 */


Tween.prototype.union = function () {
  var action = this._union();

  this._actions.length = 0;

  this._actions.push(action);

  return this;
};

Tween.prototype._union = function () {
  var actions = this._actions;

  if (actions.length === 1) {
    actions = actions[0];
  } else {
    actions = cc.sequence(actions);
  }

  return actions;
};

var tmp_args = [];

function wrapAction(action) {
  return function () {
    tmp_args.length = 0;

    for (var l = arguments.length, i = 0; i < l; i++) {
      var arg = tmp_args[i] = arguments[i];

      if (arg instanceof Tween) {
        tmp_args[i] = arg._union();
      }
    }

    return action.apply(this, tmp_args);
  };
}

var actions = {
  /**
   * !#en
   * Add an action which calculate with absolute value
   * !#zh
   * 添加一个对属性进行绝对值计算的 action
   * @method to
   * @param {Number} duration 
   * @param {Object} props - {scale: 2, position: cc.v3(100, 100, 100)}
   * @param {Object} [opts] 
   * @param {Function} [opts.progress]
   * @param {Function|String} [opts.easing]
   * @return {Tween}
   */
  to: function to(duration, props, opts) {
    opts = opts || Object.create(null);
    opts.relative = false;
    return new TweenAction(duration, props, opts);
  },

  /**
   * !#en
   * Add an action which calculate with relative value
   * !#zh
   * 添加一个对属性进行相对值计算的 action
   * @method by
   * @param {Number} duration 
   * @param {Object} props - {scale: 2, position: cc.v3(100, 100, 100)}
   * @param {Object} [opts] 
   * @param {Function} [opts.progress]
   * @param {Function|String} [opts.easing]
   * @return {Tween}
   */
  by: function by(duration, props, opts) {
    opts = opts || Object.create(null);
    opts.relative = true;
    return new TweenAction(duration, props, opts);
  },

  /**
   * !#en
   * Directly set target properties
   * !#zh
   * 直接设置 target 的属性
   * @method set
   * @param {Object} props
   * @return {Tween}
   */
  set: function set(props) {
    return new SetAction(props);
  },

  /**
   * !#en
   * Add an delay action
   * !#zh
   * 添加一个延时 action
   * @method delay
   * @param {Number} duration 
   * @return {Tween}
   */
  delay: cc.delayTime,

  /**
   * !#en
   * Add an callback action
   * !#zh
   * 添加一个回调 action
   * @method call
   * @param {Function} callback
   * @return {Tween}
   */
  call: cc.callFunc,

  /**
   * !#en
   * Add an hide action
   * !#zh
   * 添加一个隐藏 action
   * @method hide
   * @return {Tween}
   */
  hide: cc.hide,

  /**
   * !#en
   * Add an show action
   * !#zh
   * 添加一个显示 action
   * @method show
   * @return {Tween}
   */
  show: cc.show,

  /**
   * !#en
   * Add an removeSelf action
   * !#zh
   * 添加一个移除自己 action
   * @method removeSelf
   * @return {Tween}
   */
  removeSelf: cc.removeSelf,

  /**
   * !#en
   * Add an sequence action
   * !#zh
   * 添加一个队列 action
   * @method sequence
   * @param {Action|Tween} action
   * @param {Action|Tween} ...actions
   * @return {Tween}
   */
  sequence: wrapAction(cc.sequence),

  /**
   * !#en
   * Add an parallel action
   * !#zh
   * 添加一个并行 action
   * @method parallel
   * @param {Action|Tween} action
   * @param {Action|Tween} ...actions
   * @return {Tween}
   */
  parallel: wrapAction(cc.spawn)
}; // these action will use previous action as their parameters

var previousAsInputActions = {
  /**
   * !#en
   * Add an repeat action. 
   * This action will integrate before actions to a sequence action as their parameters.
   * !#zh
   * 添加一个重复 action，这个 action 会将前一个动作作为他的参数。
   * @method repeat
   * @param {Number} repeatTimes 
   * @param {Action | Tween} [action]
   * @return {Tween}
   */
  repeat: cc.repeat,

  /**
   * !#en
   * Add an repeat forever action
   * This action will integrate before actions to a sequence action as their parameters.
   * !#zh
   * 添加一个永久重复 action，这个 action 会将前一个动作作为他的参数。
   * @method repeatForever
   * @param {Action | Tween} [action]
   * @return {Tween}
   */
  repeatForever: function repeatForever(action) {
    // TODO: fixed with cc.repeatForever
    return cc.repeat(action, 10e8);
  },

  /**
   * !#en
   * Add an reverse time action.
   * This action will integrate before actions to a sequence action as their parameters.
   * !#zh
   * 添加一个倒置时间 action，这个 action 会将前一个动作作为他的参数。
   * @method reverseTime
   * @param {Action | Tween} [action]
   * @return {Tween}
   */
  reverseTime: cc.reverseTime
};
var keys = Object.keys(actions);

var _loop = function _loop(i) {
  var key = keys[i];

  Tween.prototype[key] = function () {
    var action = actions[key].apply(actions, arguments);

    this._actions.push(action);

    return this;
  };
};

for (var i = 0; i < keys.length; i++) {
  _loop(i);
}

keys = Object.keys(previousAsInputActions);

var _loop2 = function _loop2(_i) {
  var key = keys[_i];

  Tween.prototype[key] = function () {
    var actions = this._actions;
    var action = arguments[arguments.length - 1];
    var length = arguments.length - 1;

    if (action instanceof cc.Tween) {
      action = action._union();
    } else if (!(action instanceof cc.Action)) {
      action = actions[actions.length - 1];
      actions.length -= 1;
      length += 1;
    }

    var args = [action];

    for (var _i2 = 0; _i2 < length; _i2++) {
      args.push(arguments[_i2]);
    }

    action = previousAsInputActions[key].apply(this, args);
    actions.push(action);
    return this;
  };
};

for (var _i = 0; _i < keys.length; _i++) {
  _loop2(_i);
}
/**
 * @module cc
 */

/**
 * @method tween
 * @param {Object} [target] - the target to animate
 * @return {Tween}
 */


cc.tween = function (target) {
  return new Tween(target);
};

cc.Tween = Tween;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInR3ZWVuLmpzIl0sIm5hbWVzIjpbIlR3ZWVuQWN0aW9uIiwiY2MiLCJDbGFzcyIsIm5hbWUiLCJBY3Rpb25JbnRlcnZhbCIsImN0b3IiLCJkdXJhdGlvbiIsInByb3BzIiwib3B0cyIsIl9vcHRzIiwiT2JqZWN0IiwiY3JlYXRlIiwiX3Byb3BzIiwicHJvZ3Jlc3MiLCJlYXNpbmciLCJlYXNpbmdOYW1lIiwid2FybklEIiwicmVsYXRpdmUiLCJ2YWx1ZSIsInVuZGVmaW5lZCIsImlzTnVtYmVyIiwibGVycCIsImFkZCIsIm11bCIsImNsb25lIiwid2FybiIsInByb3AiLCJfb3JpZ2luUHJvcHMiLCJpbml0V2l0aER1cmF0aW9uIiwiYWN0aW9uIiwiX2R1cmF0aW9uIiwiX2Nsb25lRGVjb3JhdGlvbiIsInN0YXJ0V2l0aFRhcmdldCIsInRhcmdldCIsInByb3RvdHlwZSIsImNhbGwiLCJzdGFydCIsImN1cnJlbnQiLCJlbmQiLCJ1cGRhdGUiLCJ0IiwiZWFzaW5nVGltZSIsInRpbWUiLCJTZXRBY3Rpb24iLCJBY3Rpb25JbnN0YW50IiwiaW5pdCIsIlR3ZWVuIiwiX2FjdGlvbnMiLCJfZmluYWxBY3Rpb24iLCJfdGFyZ2V0IiwidGhlbiIsIm90aGVyIiwiQWN0aW9uIiwicHVzaCIsIl91bmlvbiIsImRpcmVjdG9yIiwiZ2V0QWN0aW9uTWFuYWdlciIsInJlbW92ZUFjdGlvbiIsImFkZEFjdGlvbiIsInN0b3AiLCJ0d2VlbiIsInVuaW9uIiwibGVuZ3RoIiwiYWN0aW9ucyIsInNlcXVlbmNlIiwidG1wX2FyZ3MiLCJ3cmFwQWN0aW9uIiwibCIsImFyZ3VtZW50cyIsImkiLCJhcmciLCJhcHBseSIsInRvIiwiYnkiLCJzZXQiLCJkZWxheSIsImRlbGF5VGltZSIsImNhbGxGdW5jIiwiaGlkZSIsInNob3ciLCJyZW1vdmVTZWxmIiwicGFyYWxsZWwiLCJzcGF3biIsInByZXZpb3VzQXNJbnB1dEFjdGlvbnMiLCJyZXBlYXQiLCJyZXBlYXRGb3JldmVyIiwicmV2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MUIsSUFBQUEsT0FBTyxDQUFDVixJQUFSLENBQWF4QixNQUFiO0FBRUEsV0FBTyxJQUFQO0FBQ0gsR0F4QkQ7OztBQUZKLEtBQUssSUFBSXdDLEVBQUMsR0FBRyxDQUFiLEVBQWdCQSxFQUFDLEdBQUdrQixJQUFJLENBQUN6QixNQUF6QixFQUFpQ08sRUFBQyxFQUFsQyxFQUFzQztBQUFBLFNBQTdCQSxFQUE2QjtBQTJCckM7QUFFRDs7OztBQUlBOzs7Ozs7O0FBS0FwRSxFQUFFLENBQUMyRCxLQUFILEdBQVcsVUFBVTNCLE1BQVYsRUFBa0I7QUFDekIsU0FBTyxJQUFJYSxLQUFKLENBQVViLE1BQVYsQ0FBUDtBQUNILENBRkQ7O0FBSUFoQyxFQUFFLENBQUM2QyxLQUFILEdBQVdBLEtBQVgiLCJzb3VyY2VzQ29udGVudCI6WyJcbmxldCBUd2VlbkFjdGlvbiA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuVHdlZW5BY3Rpb24nLFxuICAgIGV4dGVuZHM6IGNjLkFjdGlvbkludGVydmFsLFxuXG4gICAgY3RvciAoZHVyYXRpb24sIHByb3BzLCBvcHRzKSB7XG4gICAgICAgIHRoaXMuX29wdHMgPSBvcHRzID0gb3B0cyB8fCBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICB0aGlzLl9wcm9wcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICAgICAgLy8gZ2xvYmFsIGVhc2luZyBvciBwcm9ncmVzcyB1c2VkIGZvciB0aGlzIGFjdGlvblxuICAgICAgICBvcHRzLnByb2dyZXNzID0gb3B0cy5wcm9ncmVzcyB8fCB0aGlzLnByb2dyZXNzO1xuICAgICAgICBpZiAob3B0cy5lYXNpbmcgJiYgdHlwZW9mIG9wdHMuZWFzaW5nID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgbGV0IGVhc2luZ05hbWUgPSBvcHRzLmVhc2luZztcbiAgICAgICAgICAgIG9wdHMuZWFzaW5nID0gY2MuZWFzaW5nW2Vhc2luZ05hbWVdO1xuICAgICAgICAgICAgIW9wdHMuZWFzaW5nICYmIGNjLndhcm5JRCgxMDMxLCBlYXNpbmdOYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByZWxhdGl2ZSA9IHRoaXMuX29wdHMucmVsYXRpdmU7XG5cbiAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBwcm9wcykge1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gcHJvcHNbbmFtZV07XG5cbiAgICAgICAgICAgIC8vIHByb3BlcnR5IG1heSBoYXZlIGN1c3RvbSBlYXNpbmcgb3IgcHJvZ3Jlc3MgZnVuY3Rpb25cbiAgICAgICAgICAgIGxldCBlYXNpbmcsIHByb2dyZXNzO1xuICAgICAgICAgICAgaWYgKHZhbHVlLnZhbHVlICE9PSB1bmRlZmluZWQgJiYgKHZhbHVlLmVhc2luZyB8fCB2YWx1ZS5wcm9ncmVzcykpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlLmVhc2luZyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgZWFzaW5nID0gY2MuZWFzaW5nW3ZhbHVlLmVhc2luZ107XG4gICAgICAgICAgICAgICAgICAgICFlYXNpbmcgJiYgY2Mud2FybklEKDEwMzEsIHZhbHVlLmVhc2luZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlYXNpbmcgPSB2YWx1ZS5lYXNpbmc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByb2dyZXNzID0gdmFsdWUucHJvZ3Jlc3M7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS52YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGlzTnVtYmVyID0gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJztcbiAgICAgICAgICAgIGlmICghaXNOdW1iZXIgJiYgKCF2YWx1ZS5sZXJwIHx8IChyZWxhdGl2ZSAmJiAhdmFsdWUuYWRkICYmICF2YWx1ZS5tdWwpIHx8ICF2YWx1ZS5jbG9uZSkpIHtcbiAgICAgICAgICAgICAgICBjYy53YXJuKGBDYW4gbm90IGFuaW1hdGUgJHtuYW1lfSBwcm9wZXJ0eSwgYmVjYXVzZSBpdCBkbyBub3QgaGF2ZSBbbGVycCwgKGFkZHxtdWwpLCBjbG9uZV0gZnVuY3Rpb24uYCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBwcm9wID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgICAgIHByb3AudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIHByb3AuZWFzaW5nID0gZWFzaW5nO1xuICAgICAgICAgICAgcHJvcC5wcm9ncmVzcyA9IHByb2dyZXNzO1xuICAgICAgICAgICAgdGhpcy5fcHJvcHNbbmFtZV0gPSBwcm9wO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fb3JpZ2luUHJvcHMgPSBwcm9wcztcbiAgICAgICAgdGhpcy5pbml0V2l0aER1cmF0aW9uKGR1cmF0aW9uKTtcbiAgICB9LFxuXG4gICAgY2xvbmUgKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gbmV3IFR3ZWVuQWN0aW9uKHRoaXMuX2R1cmF0aW9uLCB0aGlzLl9vcmlnaW5Qcm9wcywgdGhpcy5fb3B0cyk7XG4gICAgICAgIHRoaXMuX2Nsb25lRGVjb3JhdGlvbihhY3Rpb24pO1xuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH0sXG5cbiAgICBzdGFydFdpdGhUYXJnZXQgKHRhcmdldCkge1xuICAgICAgICBjYy5BY3Rpb25JbnRlcnZhbC5wcm90b3R5cGUuc3RhcnRXaXRoVGFyZ2V0LmNhbGwodGhpcywgdGFyZ2V0KTtcblxuICAgICAgICBsZXQgcmVsYXRpdmUgPSAhIXRoaXMuX29wdHMucmVsYXRpdmU7XG4gICAgICAgIGxldCBwcm9wcyA9IHRoaXMuX3Byb3BzO1xuICAgICAgICBmb3IgKGxldCBuYW1lIGluIHByb3BzKSB7XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB0YXJnZXRbbmFtZV07XG4gICAgICAgICAgICBsZXQgcHJvcCA9IHByb3BzW25hbWVdO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIHByb3Auc3RhcnQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBwcm9wLmN1cnJlbnQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBwcm9wLmVuZCA9IHJlbGF0aXZlID8gdmFsdWUgKyBwcm9wLnZhbHVlIDogcHJvcC52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHByb3Auc3RhcnQgPSB2YWx1ZS5jbG9uZSgpO1xuICAgICAgICAgICAgICAgIHByb3AuY3VycmVudCA9IHZhbHVlLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgcHJvcC5lbmQgPSByZWxhdGl2ZSA/ICh2YWx1ZS5hZGQgfHwgdmFsdWUubXVsKS5jYWxsKHZhbHVlLCBwcm9wLnZhbHVlKSA6IHByb3AudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdXBkYXRlICh0KSB7XG4gICAgICAgIGxldCBvcHRzID0gdGhpcy5fb3B0cztcbiAgICAgICAgbGV0IGVhc2luZ1RpbWUgPSB0O1xuICAgICAgICBpZiAob3B0cy5lYXNpbmcpIGVhc2luZ1RpbWUgPSBvcHRzLmVhc2luZyh0KTtcblxuICAgICAgICBsZXQgdGFyZ2V0ID0gdGhpcy50YXJnZXQ7XG4gICAgICAgIGlmICghdGFyZ2V0KSByZXR1cm47XG5cbiAgICAgICAgbGV0IHByb3BzID0gdGhpcy5fcHJvcHM7XG4gICAgICAgIGxldCBwcm9ncmVzcyA9IHRoaXMuX29wdHMucHJvZ3Jlc3M7XG4gICAgICAgIGZvciAobGV0IG5hbWUgaW4gcHJvcHMpIHtcbiAgICAgICAgICAgIGxldCBwcm9wID0gcHJvcHNbbmFtZV07XG4gICAgICAgICAgICBsZXQgdGltZSA9IHByb3AuZWFzaW5nID8gcHJvcC5lYXNpbmcodCkgOiBlYXNpbmdUaW1lO1xuICAgICAgICAgICAgbGV0IGN1cnJlbnQgPSBwcm9wLmN1cnJlbnQgPSAocHJvcC5wcm9ncmVzcyB8fCBwcm9ncmVzcykocHJvcC5zdGFydCwgcHJvcC5lbmQsIHByb3AuY3VycmVudCwgdGltZSk7XG4gICAgICAgICAgICB0YXJnZXRbbmFtZV0gPSBjdXJyZW50O1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHByb2dyZXNzIChzdGFydCwgZW5kLCBjdXJyZW50LCB0KSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc3RhcnQgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBjdXJyZW50ID0gc3RhcnQgKyAoZW5kIC0gc3RhcnQpICogdDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHN0YXJ0LmxlcnAoZW5kLCB0LCBjdXJyZW50KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3VycmVudDtcbiAgICB9XG59KTtcblxubGV0IFNldEFjdGlvbiA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuU2V0QWN0aW9uJyxcbiAgICBleHRlbmRzOiBjYy5BY3Rpb25JbnN0YW50LFxuXG4gICAgY3RvciAocHJvcHMpIHtcbiAgICAgICAgdGhpcy5fcHJvcHMgPSB7fTtcbiAgICAgICAgcHJvcHMgIT09IHVuZGVmaW5lZCAmJiB0aGlzLmluaXQocHJvcHMpO1xuICAgIH0sXG5cbiAgICBpbml0IChwcm9wcykge1xuICAgICAgICBmb3IgKGxldCBuYW1lIGluIHByb3BzKSB7XG4gICAgICAgICAgICB0aGlzLl9wcm9wc1tuYW1lXSA9IHByb3BzW25hbWVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICB1cGRhdGUgKCkge1xuICAgICAgICBsZXQgcHJvcHMgPSB0aGlzLl9wcm9wcztcbiAgICAgICAgbGV0IHRhcmdldCA9IHRoaXMudGFyZ2V0O1xuICAgICAgICBmb3IgKGxldCBuYW1lIGluIHByb3BzKSB7XG4gICAgICAgICAgICB0YXJnZXRbbmFtZV0gPSBwcm9wc1tuYW1lXTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjbG9uZSAoKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgU2V0QWN0aW9uKCk7XG4gICAgICAgIGFjdGlvbi5pbml0KHRoaXMuX3Byb3BzKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9XG59KTtcblxuXG5cbi8qKlxuICogISNlblxuICogVHdlZW4gcHJvdmlkZSBhIHNpbXBsZSBhbmQgZmxleGlibGUgd2F5IHRvIGNyZWF0ZSBhY3Rpb24uXG4gKiBUd2VlbidzIGFwaSBpcyBtb3JlIGZsZXhpYmxlIHRoYW4gY2MuQWN0aW9uOlxuICogIC0gU3VwcG9ydCBjcmVhdGluZyBhbiBhY3Rpb24gc2VxdWVuY2UgaW4gY2hhaW5lZCBhcGksXG4gKiAgLSBTdXBwb3J0IGFuaW1hdGUgYW55IG9iamVjdHMnIGFueSBwcm9wZXJ0aWVzLCBub3QgbGltaXRlZCB0byBub2RlJ3MgcHJvcGVydGllcy5cbiAqICAgIEJ5IGNvbnRyYXN0LCBjYy5BY3Rpb24gbmVlZHMgdG8gY3JlYXRlIGEgbmV3IGFjdGlvbiBjbGFzcyB0byBzdXBwb3J0IG5ldyBub2RlIHByb3BlcnR5LlxuICogIC0gU3VwcG9ydCB3b3JraW5nIHdpdGggY2MuQWN0aW9uLFxuICogIC0gU3VwcG9ydCBlYXNpbmcgYW5kIHByb2dyZXNzIGZ1bmN0aW9uLlxuICogISN6aFxuICogVHdlZW4g5o+Q5L6b5LqG5LiA5Liq566A5Y2V54G15rS755qE5pa55rOV5p2l5Yib5bu6IGFjdGlvbuOAglxuICog55u45a+55LqOIENvY29zIOS8oOe7n+eahCBjYy5BY3Rpb27vvIxjYy5Ud2VlbiDlnKjliJvlu7rliqjnlLvkuIropoHngbXmtLvpnZ7luLjlpJrvvJpcbiAqICAtIOaUr+aMgeS7pemTvuW8j+e7k+aehOeahOaWueW8j+WIm+W7uuS4gOS4quWKqOeUu+W6j+WIl+OAglxuICogIC0g5pSv5oyB5a+55Lu75oSP5a+56LGh55qE5Lu75oSP5bGe5oCn6L+b6KGM57yT5Yqo77yM5LiN5YaN5bGA6ZmQ5LqO6IqC54K55LiK55qE5bGe5oCn77yM6ICMIGNjLkFjdGlvbiDmt7vliqDkuIDkuKrlsZ7mgKfnmoTmlK/mjIHml7bov5jpnIDopoHmt7vliqDkuIDkuKrmlrDnmoQgYWN0aW9uIOexu+Wei+OAglxuICogIC0g5pSv5oyB5LiOIGNjLkFjdGlvbiDmt7fnlKhcbiAqICAtIOaUr+aMgeiuvue9riB7eyNjcm9zc0xpbmsgXCJFYXNpbmdcIn19e3svY3Jvc3NMaW5rfX0g5oiW6ICFIHByb2dyZXNzIOWHveaVsFxuICogQGNsYXNzIFR3ZWVuXG4gKiBAcGFyYW0ge09iamVjdH0gW3RhcmdldF1cbiAqIEBleGFtcGxlXG4gKiBjYy50d2Vlbihub2RlKVxuICogICAudG8oMSwge3NjYWxlOiAyLCBwb3NpdGlvbjogY2MudjMoMTAwLCAxMDAsIDEwMCl9KVxuICogICAuY2FsbCgoKSA9PiB7IGNvbnNvbGUubG9nKCdUaGlzIGlzIGEgY2FsbGJhY2snKTsgfSlcbiAqICAgLmJ5KDEsIHtzY2FsZTogMywgcG9zaXRpb246IGNjLnYzKDIwMCwgMjAwLCAyMDApfSwge2Vhc2luZzogJ3NpbmVPdXRJbid9KVxuICogICAucnVuKGNjLmZpbmQoJ0NhbnZhcy9jb2NvcycpKTtcbiAqL1xuZnVuY3Rpb24gVHdlZW4gKHRhcmdldCkge1xuICAgIHRoaXMuX2FjdGlvbnMgPSBbXTtcbiAgICB0aGlzLl9maW5hbEFjdGlvbiA9IG51bGw7XG4gICAgdGhpcy5fdGFyZ2V0ID0gdGFyZ2V0O1xufVxuXG4vKipcbiAqICEjZW5cbiAqIEluc2VydCBhbiBhY3Rpb24gb3IgdHdlZW4gdG8gdGhpcyBzZXF1ZW5jZVxuICogISN6aFxuICog5o+S5YWl5LiA5LiqIGFjdGlvbiDmiJbogIUgdHdlZW4g5Yiw6Zif5YiX5LitXG4gKiBAbWV0aG9kIHRoZW4gXG4gKiBAcGFyYW0ge0FjdGlvbnxUd2Vlbn0gb3RoZXJcbiAqIEByZXR1cm4ge1R3ZWVufVxuICovXG5Ud2Vlbi5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uIChvdGhlcikge1xuICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIGNjLkFjdGlvbikge1xuICAgICAgICB0aGlzLl9hY3Rpb25zLnB1c2gob3RoZXIuY2xvbmUoKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aGlzLl9hY3Rpb25zLnB1c2gob3RoZXIuX3VuaW9uKCkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5cblxuLyoqXG4gKiAhI2VuXG4gKiBTZXQgdHdlZW4gdGFyZ2V0XG4gKiAhI3poXG4gKiDorr7nva4gdHdlZW4g55qEIHRhcmdldFxuICogQG1ldGhvZCB0YXJnZXRcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRcbiAqIEByZXR1cm4ge1R3ZWVufVxuICovXG5Ud2Vlbi5wcm90b3R5cGUudGFyZ2V0ID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIHRoaXMuX3RhcmdldCA9IHRhcmdldDtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogISNlblxuICogU3RhcnQgdGhpcyB0d2VlblxuICogISN6aFxuICog6L+Q6KGM5b2T5YmNIHR3ZWVuXG4gKiBAbWV0aG9kIHN0YXJ0XG4gKiBAcmV0dXJuIHtUd2Vlbn1cbiAqL1xuVHdlZW4ucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5fdGFyZ2V0KSB7XG4gICAgICAgIGNjLndhcm4oJ1BsZWFzZSBzZXQgdGFyZ2V0IHRvIHR3ZWVuIGZpcnN0Jyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBpZiAodGhpcy5fZmluYWxBY3Rpb24pIHtcbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0QWN0aW9uTWFuYWdlcigpLnJlbW92ZUFjdGlvbih0aGlzLl9maW5hbEFjdGlvbik7XG4gICAgfVxuICAgIHRoaXMuX2ZpbmFsQWN0aW9uID0gdGhpcy5fdW5pb24oKTtcbiAgICBjYy5kaXJlY3Rvci5nZXRBY3Rpb25NYW5hZ2VyKCkuYWRkQWN0aW9uKHRoaXMuX2ZpbmFsQWN0aW9uLCB0aGlzLl90YXJnZXQsIGZhbHNlKTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogISNlblxuICogU3RvcCB0aGlzIHR3ZWVuXG4gKiAhI3poXG4gKiDlgZzmraLlvZPliY0gdHdlZW5cbiAqIEBtZXRob2Qgc3RvcFxuICogQHJldHVybiB7VHdlZW59XG4gKi9cblR3ZWVuLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLl9maW5hbEFjdGlvbikge1xuICAgICAgICBjYy5kaXJlY3Rvci5nZXRBY3Rpb25NYW5hZ2VyKCkucmVtb3ZlQWN0aW9uKHRoaXMuX2ZpbmFsQWN0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5cblxuLyoqXG4gKiAhI2VuXG4gKiBDbG9uZSBhIHR3ZWVuXG4gKiAhI3poXG4gKiDlhYvpmoblvZPliY0gdHdlZW5cbiAqIEBtZXRob2QgY2xvbmVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbdGFyZ2V0XVxuICogQHJldHVybiB7VHdlZW59XG4gKi9cblR3ZWVuLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICBsZXQgYWN0aW9uID0gdGhpcy5fdW5pb24oKTtcbiAgICByZXR1cm4gY2MudHdlZW4odGFyZ2V0KS50aGVuKGFjdGlvbi5jbG9uZSgpKTtcbn07XG5cbi8qKlxuICogISNlblxuICogSW50ZWdyYXRlIGFsbCBwcmV2aW91cyBhY3Rpb25zIHRvIGFuIGFjdGlvbi5cbiAqICEjemhcbiAqIOWwhuS5i+WJjeaJgOacieeahCBhY3Rpb24g5pW05ZCI5Li65LiA5LiqIGFjdGlvbuOAglxuICogQG1ldGhvZCB1bmlvblxuICogQHJldHVybiB7VHdlZW59XG4gKi9cblR3ZWVuLnByb3RvdHlwZS51bmlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgYWN0aW9uID0gdGhpcy5fdW5pb24oKTtcbiAgICB0aGlzLl9hY3Rpb25zLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5fYWN0aW9ucy5wdXNoKGFjdGlvbik7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5Ud2Vlbi5wcm90b3R5cGUuX3VuaW9uID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCBhY3Rpb25zID0gdGhpcy5fYWN0aW9ucztcblxuICAgIGlmIChhY3Rpb25zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBhY3Rpb25zID0gYWN0aW9uc1swXTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGFjdGlvbnMgPSBjYy5zZXF1ZW5jZShhY3Rpb25zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWN0aW9ucztcbn07XG5cbmxldCB0bXBfYXJncyA9IFtdO1xuXG5mdW5jdGlvbiB3cmFwQWN0aW9uIChhY3Rpb24pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICB0bXBfYXJncy5sZW5ndGggPSAwO1xuICAgICAgICBmb3IgKGxldCBsID0gYXJndW1lbnRzLmxlbmd0aCwgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBhcmcgPSB0bXBfYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBUd2Vlbikge1xuICAgICAgICAgICAgICAgIHRtcF9hcmdzW2ldID0gYXJnLl91bmlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFjdGlvbi5hcHBseSh0aGlzLCB0bXBfYXJncyk7XG4gICAgfTtcbn1cblxubGV0IGFjdGlvbnMgPSB7XG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEFkZCBhbiBhY3Rpb24gd2hpY2ggY2FsY3VsYXRlIHdpdGggYWJzb2x1dGUgdmFsdWVcbiAgICAgKiAhI3poXG4gICAgICog5re75Yqg5LiA5Liq5a+55bGe5oCn6L+b6KGM57ud5a+55YC86K6h566X55qEIGFjdGlvblxuICAgICAqIEBtZXRob2QgdG9cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb24gXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHByb3BzIC0ge3NjYWxlOiAyLCBwb3NpdGlvbjogY2MudjMoMTAwLCAxMDAsIDEwMCl9XG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRzXSBcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy5wcm9ncmVzc11cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufFN0cmluZ30gW29wdHMuZWFzaW5nXVxuICAgICAqIEByZXR1cm4ge1R3ZWVufVxuICAgICAqL1xuICAgIHRvIChkdXJhdGlvbiwgcHJvcHMsIG9wdHMpIHtcbiAgICAgICAgb3B0cyA9IG9wdHMgfHwgT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgb3B0cy5yZWxhdGl2ZSA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gbmV3IFR3ZWVuQWN0aW9uKGR1cmF0aW9uLCBwcm9wcywgb3B0cyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBBZGQgYW4gYWN0aW9uIHdoaWNoIGNhbGN1bGF0ZSB3aXRoIHJlbGF0aXZlIHZhbHVlXG4gICAgICogISN6aFxuICAgICAqIOa3u+WKoOS4gOS4quWvueWxnuaAp+i/m+ihjOebuOWvueWAvOiuoeeul+eahCBhY3Rpb25cbiAgICAgKiBAbWV0aG9kIGJ5XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uIFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyAtIHtzY2FsZTogMiwgcG9zaXRpb246IGNjLnYzKDEwMCwgMTAwLCAxMDApfVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0c10gXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMucHJvZ3Jlc3NdXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxTdHJpbmd9IFtvcHRzLmVhc2luZ11cbiAgICAgKiBAcmV0dXJuIHtUd2Vlbn1cbiAgICAgKi9cbiAgICBieSAoZHVyYXRpb24sIHByb3BzLCBvcHRzKSB7XG4gICAgICAgIG9wdHMgPSBvcHRzIHx8IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIG9wdHMucmVsYXRpdmUgPSB0cnVlO1xuICAgICAgICByZXR1cm4gbmV3IFR3ZWVuQWN0aW9uKGR1cmF0aW9uLCBwcm9wcywgb3B0cyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBEaXJlY3RseSBzZXQgdGFyZ2V0IHByb3BlcnRpZXNcbiAgICAgKiAhI3poXG4gICAgICog55u05o6l6K6+572uIHRhcmdldCDnmoTlsZ7mgKdcbiAgICAgKiBAbWV0aG9kIHNldFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wc1xuICAgICAqIEByZXR1cm4ge1R3ZWVufVxuICAgICAqL1xuICAgIHNldCAocHJvcHMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTZXRBY3Rpb24ocHJvcHMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQWRkIGFuIGRlbGF5IGFjdGlvblxuICAgICAqICEjemhcbiAgICAgKiDmt7vliqDkuIDkuKrlu7bml7YgYWN0aW9uXG4gICAgICogQG1ldGhvZCBkZWxheVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvbiBcbiAgICAgKiBAcmV0dXJuIHtUd2Vlbn1cbiAgICAgKi9cbiAgICBkZWxheTogY2MuZGVsYXlUaW1lLFxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBBZGQgYW4gY2FsbGJhY2sgYWN0aW9uXG4gICAgICogISN6aFxuICAgICAqIOa3u+WKoOS4gOS4quWbnuiwgyBhY3Rpb25cbiAgICAgKiBAbWV0aG9kIGNhbGxcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAqIEByZXR1cm4ge1R3ZWVufVxuICAgICAqL1xuICAgIGNhbGw6IGNjLmNhbGxGdW5jLFxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBBZGQgYW4gaGlkZSBhY3Rpb25cbiAgICAgKiAhI3poXG4gICAgICog5re75Yqg5LiA5Liq6ZqQ6JePIGFjdGlvblxuICAgICAqIEBtZXRob2QgaGlkZVxuICAgICAqIEByZXR1cm4ge1R3ZWVufVxuICAgICAqL1xuICAgIGhpZGU6IGNjLmhpZGUsXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEFkZCBhbiBzaG93IGFjdGlvblxuICAgICAqICEjemhcbiAgICAgKiDmt7vliqDkuIDkuKrmmL7npLogYWN0aW9uXG4gICAgICogQG1ldGhvZCBzaG93XG4gICAgICogQHJldHVybiB7VHdlZW59XG4gICAgICovXG4gICAgc2hvdzogY2Muc2hvdyxcbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQWRkIGFuIHJlbW92ZVNlbGYgYWN0aW9uXG4gICAgICogISN6aFxuICAgICAqIOa3u+WKoOS4gOS4quenu+mZpOiHquW3sSBhY3Rpb25cbiAgICAgKiBAbWV0aG9kIHJlbW92ZVNlbGZcbiAgICAgKiBAcmV0dXJuIHtUd2Vlbn1cbiAgICAgKi9cbiAgICByZW1vdmVTZWxmOiBjYy5yZW1vdmVTZWxmLFxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBBZGQgYW4gc2VxdWVuY2UgYWN0aW9uXG4gICAgICogISN6aFxuICAgICAqIOa3u+WKoOS4gOS4qumYn+WIlyBhY3Rpb25cbiAgICAgKiBAbWV0aG9kIHNlcXVlbmNlXG4gICAgICogQHBhcmFtIHtBY3Rpb258VHdlZW59IGFjdGlvblxuICAgICAqIEBwYXJhbSB7QWN0aW9ufFR3ZWVufSAuLi5hY3Rpb25zXG4gICAgICogQHJldHVybiB7VHdlZW59XG4gICAgICovXG4gICAgc2VxdWVuY2U6IHdyYXBBY3Rpb24oY2Muc2VxdWVuY2UpLFxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBBZGQgYW4gcGFyYWxsZWwgYWN0aW9uXG4gICAgICogISN6aFxuICAgICAqIOa3u+WKoOS4gOS4quW5tuihjCBhY3Rpb25cbiAgICAgKiBAbWV0aG9kIHBhcmFsbGVsXG4gICAgICogQHBhcmFtIHtBY3Rpb258VHdlZW59IGFjdGlvblxuICAgICAqIEBwYXJhbSB7QWN0aW9ufFR3ZWVufSAuLi5hY3Rpb25zXG4gICAgICogQHJldHVybiB7VHdlZW59XG4gICAgICovXG4gICAgcGFyYWxsZWw6IHdyYXBBY3Rpb24oY2Muc3Bhd24pXG59O1xuXG4vLyB0aGVzZSBhY3Rpb24gd2lsbCB1c2UgcHJldmlvdXMgYWN0aW9uIGFzIHRoZWlyIHBhcmFtZXRlcnNcbmxldCBwcmV2aW91c0FzSW5wdXRBY3Rpb25zID0ge1xuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBBZGQgYW4gcmVwZWF0IGFjdGlvbi4gXG4gICAgICogVGhpcyBhY3Rpb24gd2lsbCBpbnRlZ3JhdGUgYmVmb3JlIGFjdGlvbnMgdG8gYSBzZXF1ZW5jZSBhY3Rpb24gYXMgdGhlaXIgcGFyYW1ldGVycy5cbiAgICAgKiAhI3poXG4gICAgICog5re75Yqg5LiA5Liq6YeN5aSNIGFjdGlvbu+8jOi/meS4qiBhY3Rpb24g5Lya5bCG5YmN5LiA5Liq5Yqo5L2c5L2c5Li65LuW55qE5Y+C5pWw44CCXG4gICAgICogQG1ldGhvZCByZXBlYXRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcmVwZWF0VGltZXMgXG4gICAgICogQHBhcmFtIHtBY3Rpb24gfCBUd2Vlbn0gW2FjdGlvbl1cbiAgICAgKiBAcmV0dXJuIHtUd2Vlbn1cbiAgICAgKi9cbiAgICByZXBlYXQ6IGNjLnJlcGVhdCxcbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQWRkIGFuIHJlcGVhdCBmb3JldmVyIGFjdGlvblxuICAgICAqIFRoaXMgYWN0aW9uIHdpbGwgaW50ZWdyYXRlIGJlZm9yZSBhY3Rpb25zIHRvIGEgc2VxdWVuY2UgYWN0aW9uIGFzIHRoZWlyIHBhcmFtZXRlcnMuXG4gICAgICogISN6aFxuICAgICAqIOa3u+WKoOS4gOS4quawuOS5hemHjeWkjSBhY3Rpb27vvIzov5nkuKogYWN0aW9uIOS8muWwhuWJjeS4gOS4quWKqOS9nOS9nOS4uuS7lueahOWPguaVsOOAglxuICAgICAqIEBtZXRob2QgcmVwZWF0Rm9yZXZlclxuICAgICAqIEBwYXJhbSB7QWN0aW9uIHwgVHdlZW59IFthY3Rpb25dXG4gICAgICogQHJldHVybiB7VHdlZW59XG4gICAgICovXG4gICAgcmVwZWF0Rm9yZXZlcjogZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgICAvLyBUT0RPOiBmaXhlZCB3aXRoIGNjLnJlcGVhdEZvcmV2ZXJcbiAgICAgICAgcmV0dXJuIGNjLnJlcGVhdChhY3Rpb24sIDEwZTgpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEFkZCBhbiByZXZlcnNlIHRpbWUgYWN0aW9uLlxuICAgICAqIFRoaXMgYWN0aW9uIHdpbGwgaW50ZWdyYXRlIGJlZm9yZSBhY3Rpb25zIHRvIGEgc2VxdWVuY2UgYWN0aW9uIGFzIHRoZWlyIHBhcmFtZXRlcnMuXG4gICAgICogISN6aFxuICAgICAqIOa3u+WKoOS4gOS4quWAkue9ruaXtumXtCBhY3Rpb27vvIzov5nkuKogYWN0aW9uIOS8muWwhuWJjeS4gOS4quWKqOS9nOS9nOS4uuS7lueahOWPguaVsOOAglxuICAgICAqIEBtZXRob2QgcmV2ZXJzZVRpbWVcbiAgICAgKiBAcGFyYW0ge0FjdGlvbiB8IFR3ZWVufSBbYWN0aW9uXVxuICAgICAqIEByZXR1cm4ge1R3ZWVufVxuICAgICAqL1xuICAgIHJldmVyc2VUaW1lOiBjYy5yZXZlcnNlVGltZSxcbn07XG5cblxubGV0IGtleXMgPSBPYmplY3Qua2V5cyhhY3Rpb25zKTtcbmZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBrZXkgPSBrZXlzW2ldO1xuICAgIFR3ZWVuLnByb3RvdHlwZVtrZXldID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgYWN0aW9uID0gYWN0aW9uc1trZXldLmFwcGx5KGFjdGlvbnMsIGFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMuX2FjdGlvbnMucHVzaChhY3Rpb24pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xufVxuXG5rZXlzID0gT2JqZWN0LmtleXMocHJldmlvdXNBc0lucHV0QWN0aW9ucyk7XG5mb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQga2V5ID0ga2V5c1tpXTtcbiAgICBUd2Vlbi5wcm90b3R5cGVba2V5XSA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBsZXQgYWN0aW9ucyA9IHRoaXMuX2FjdGlvbnM7XG4gICAgICAgIGxldCBhY3Rpb24gPSBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdO1xuICAgICAgICBsZXQgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7XG5cbiAgICAgICAgaWYgKGFjdGlvbiBpbnN0YW5jZW9mIGNjLlR3ZWVuKSB7XG4gICAgICAgICAgICBhY3Rpb24gPSBhY3Rpb24uX3VuaW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIShhY3Rpb24gaW5zdGFuY2VvZiBjYy5BY3Rpb24pKSB7XG4gICAgICAgICAgICBhY3Rpb24gPSBhY3Rpb25zW2FjdGlvbnMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICBhY3Rpb25zLmxlbmd0aCAtPSAxO1xuICAgICAgICAgICAgbGVuZ3RoICs9IDE7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYXJncyA9IFthY3Rpb25dO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzLnB1c2goYXJndW1lbnRzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFjdGlvbiA9IHByZXZpb3VzQXNJbnB1dEFjdGlvbnNba2V5XS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgYWN0aW9ucy5wdXNoKGFjdGlvbik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbn1cblxuLyoqXG4gKiBAbW9kdWxlIGNjXG4gKi9cblxuLyoqXG4gKiBAbWV0aG9kIHR3ZWVuXG4gKiBAcGFyYW0ge09iamVjdH0gW3RhcmdldF0gLSB0aGUgdGFyZ2V0IHRvIGFuaW1hdGVcbiAqIEByZXR1cm4ge1R3ZWVufVxuICovXG5jYy50d2VlbiA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICByZXR1cm4gbmV3IFR3ZWVuKHRhcmdldCk7XG59O1xuXG5jYy5Ud2VlbiA9IFR3ZWVuO1xuIl19