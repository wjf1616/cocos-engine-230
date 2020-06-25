
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCComponent.js';
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
var CCObject = require('../platform/CCObject');

var js = require('../platform/js');

var idGenerater = new (require('../platform/id-generater'))('Comp');
var IsOnEnableCalled = CCObject.Flags.IsOnEnableCalled;
var IsOnLoadCalled = CCObject.Flags.IsOnLoadCalled;
/**
 * !#en
 * Base class for everything attached to Node(Entity).<br/>
 * <br/>
 * NOTE: Not allowed to use construction parameters for Component's subclasses,
 *       because Component is created by the engine.
 * !#zh
 * 所有附加到节点的基类。<br/>
 * <br/>
 * 注意：不允许使用组件的子类构造参数，因为组件是由引擎创建的。
 *
 * @class Component
 * @extends Object
 */

var Component = cc.Class({
  name: 'cc.Component',
  "extends": CCObject,
  ctor: CC_EDITOR ? function () {
    if (typeof _Scene !== "undefined" && _Scene.AssetsWatcher) {
      _Scene.AssetsWatcher.initComponent(this);
    }

    this._id = Editor.Utils.UuidUtils.uuid();
    /**
     * Register all related EventTargets,
     * all event callbacks will be removed in _onPreDestroy
     * @property {Array} __eventTargets
     * @private
     */

    this.__eventTargets = [];
  } : function () {
    this._id = idGenerater.getNewId();
    this.__eventTargets = [];
  },
  properties: {
    /**
     * !#en The node this component is attached to. A component is always attached to a node.
     * !#zh 该组件被附加到的节点。组件总会附加到一个节点。
     * @property node
     * @type {Node}
     * @example
     * cc.log(comp.node);
     */
    node: {
      "default": null,
      visible: false
    },
    name: {
      get: function get() {
        if (this._name) {
          return this._name;
        }

        var className = cc.js.getClassName(this);
        var trimLeft = className.lastIndexOf('.');

        if (trimLeft >= 0) {
          className = className.slice(trimLeft + 1);
        }

        return this.node.name + '<' + className + '>';
      },
      set: function set(value) {
        this._name = value;
      },
      visible: false
    },

    /**
     * !#en The uuid for editor.
     * !#zh 组件的 uuid，用于编辑器。
     * @property uuid
     * @type {String}
     * @readOnly
     * @example
     * cc.log(comp.uuid);
     */
    uuid: {
      get: function get() {
        return this._id;
      },
      visible: false
    },
    __scriptAsset: CC_EDITOR && {
      get: function get() {},
      //set (value) {
      //    if (this.__scriptUuid !== value) {
      //        if (value && Editor.Utils.UuidUtils.isUuid(value._uuid)) {
      //            var classId = Editor.Utils.UuidUtils.compressUuid(value._uuid);
      //            var NewComp = cc.js._getClassById(classId);
      //            if (js.isChildClassOf(NewComp, cc.Component)) {
      //                cc.warn('Sorry, replacing component script is not yet implemented.');
      //                //Editor.Ipc.sendToWins('reload:window-scripts', Editor._Sandbox.compiled);
      //            }
      //            else {
      //                cc.error('Can not find a component in the script which uuid is "%s".', value._uuid);
      //            }
      //        }
      //        else {
      //            cc.error('Invalid Script');
      //        }
      //    }
      //},
      displayName: 'Script',
      type: cc._Script,
      tooltip: CC_DEV && 'i18n:INSPECTOR.component.script'
    },

    /**
     * @property _enabled
     * @type {Boolean}
     * @private
     */
    _enabled: true,

    /**
     * !#en indicates whether this component is enabled or not.
     * !#zh 表示该组件自身是否启用。
     * @property enabled
     * @type {Boolean}
     * @default true
     * @example
     * comp.enabled = true;
     * cc.log(comp.enabled);
     */
    enabled: {
      get: function get() {
        return this._enabled;
      },
      set: function set(value) {
        if (this._enabled !== value) {
          this._enabled = value;

          if (this.node._activeInHierarchy) {
            var compScheduler = cc.director._compScheduler;

            if (value) {
              compScheduler.enableComp(this);
            } else {
              compScheduler.disableComp(this);
            }
          }
        }
      },
      visible: false,
      animatable: true
    },

    /**
     * !#en indicates whether this component is enabled and its node is also active in the hierarchy.
     * !#zh 表示该组件是否被启用并且所在的节点也处于激活状态。
     * @property enabledInHierarchy
     * @type {Boolean}
     * @readOnly
     * @example
     * cc.log(comp.enabledInHierarchy);
     */
    enabledInHierarchy: {
      get: function get() {
        return this._enabled && this.node._activeInHierarchy;
      },
      visible: false
    },

    /**
     * !#en Returns a value which used to indicate the onLoad get called or not.
     * !#zh 返回一个值用来判断 onLoad 是否被调用过，不等于 0 时调用过，等于 0 时未调用。
     * @property _isOnLoadCalled
     * @type {Number}
     * @readOnly
     * @example
     * cc.log(this._isOnLoadCalled > 0);
     */
    _isOnLoadCalled: {
      get: function get() {
        return this._objFlags & IsOnLoadCalled;
      }
    }
  },
  // LIFECYCLE METHODS
  // Fireball provides lifecycle methods that you can specify to hook into this process.
  // We provide Pre methods, which are called right before something happens, and Post methods which are called right after something happens.

  /**
   * !#en Update is called every frame, if the Component is enabled.<br/>
   * This is a lifecycle method. It may not be implemented in the super class. You can only call its super class method inside it. It should not be called manually elsewhere.
   * !#zh 如果该组件启用，则每帧调用 update。<br/>
   * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
   * @method update
   * @param {Number} dt - the delta time in seconds it took to complete the last frame
   * @protected
   */
  update: null,

  /**
   * !#en LateUpdate is called every frame, if the Component is enabled.<br/>
   * This is a lifecycle method. It may not be implemented in the super class. You can only call its super class method inside it. It should not be called manually elsewhere.
   * !#zh 如果该组件启用，则每帧调用 LateUpdate。<br/>
   * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
   * @method lateUpdate
   * @protected
   */
  lateUpdate: null,

  /**
   * `__preload` is called before every onLoad.
   * It is used to initialize the builtin components internally,
   * to avoid checking whether onLoad is called before every public method calls.
   * This method should be removed if script priority is supported.
   *
   * @method __preload
   * @private
   */
  __preload: null,

  /**
   * !#en
   * When attaching to an active node or its node first activated.
   * onLoad is always called before any start functions, this allows you to order initialization of scripts.<br/>
   * This is a lifecycle method. It may not be implemented in the super class. You can only call its super class method inside it. It should not be called manually elsewhere.
   * !#zh
   * 当附加到一个激活的节点上或者其节点第一次激活时候调用。onLoad 总是会在任何 start 方法调用前执行，这能用于安排脚本的初始化顺序。<br/>
   * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
   * @method onLoad
   * @protected
   */
  onLoad: null,

  /**
   * !#en
   * Called before all scripts' update if the Component is enabled the first time.
   * Usually used to initialize some logic which need to be called after all components' `onload` methods called.<br/>
   * This is a lifecycle method. It may not be implemented in the super class. You can only call its super class method inside it. It should not be called manually elsewhere.
   * !#zh
   * 如果该组件第一次启用，则在所有组件的 update 之前调用。通常用于需要在所有组件的 onLoad 初始化完毕后执行的逻辑。<br/>
   * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
   * @method start
   * @protected
   */
  start: null,

  /**
   * !#en Called when this component becomes enabled and its node is active.<br/>
   * This is a lifecycle method. It may not be implemented in the super class. You can only call its super class method inside it. It should not be called manually elsewhere.
   * !#zh 当该组件被启用，并且它的节点也激活时。<br/>
   * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
   * @method onEnable
   * @protected
   */
  onEnable: null,

  /**
   * !#en Called when this component becomes disabled or its node becomes inactive.<br/>
   * This is a lifecycle method. It may not be implemented in the super class. You can only call its super class method inside it. It should not be called manually elsewhere.
   * !#zh 当该组件被禁用或节点变为无效时调用。<br/>
   * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
   * @method onDisable
   * @protected
   */
  onDisable: null,

  /**
   * !#en Called when this component will be destroyed.<br/>
   * This is a lifecycle method. It may not be implemented in the super class. You can only call its super class method inside it. It should not be called manually elsewhere.
   * !#zh 当该组件被销毁时调用<br/>
   * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
   * @method onDestroy
   * @protected
   */
  onDestroy: null,

  /**
   * @method onFocusInEditor
   * @protected
   */
  onFocusInEditor: null,

  /**
   * @method onLostFocusInEditor
   * @protected
   */
  onLostFocusInEditor: null,

  /**
   * !#en Called to initialize the component or node’s properties when adding the component the first time or when the Reset command is used. This function is only called in editor.
   * !#zh 用来初始化组件或节点的一些属性，当该组件被第一次添加到节点上或用户点击了它的 Reset 菜单时调用。这个回调只会在编辑器下调用。
   * @method resetInEditor
   * @protected
   */
  resetInEditor: null,
  // PUBLIC

  /**
   * !#en Adds a component class to the node. You can also add component to node by passing in the name of the script.
   * !#zh 向节点添加一个组件类，你还可以通过传入脚本的名称来添加组件。
   *
   * @method addComponent
   * @param {Function|String} typeOrClassName - the constructor or the class name of the component to add
   * @return {Component} - the newly added component
   * @example
   * var sprite = node.addComponent(cc.Sprite);
   * var test = node.addComponent("Test");
   * @typescript
   * addComponent<T extends Component>(type: {new(): T}): T
   * addComponent(className: string): any
   */
  addComponent: function addComponent(typeOrClassName) {
    return this.node.addComponent(typeOrClassName);
  },

  /**
   * !#en
   * Returns the component of supplied type if the node has one attached, null if it doesn't.<br/>
   * You can also get component in the node by passing in the name of the script.
   * !#zh
   * 获取节点上指定类型的组件，如果节点有附加指定类型的组件，则返回，如果没有则为空。<br/>
   * 传入参数也可以是脚本的名称。
   *
   * @method getComponent
   * @param {Function|String} typeOrClassName
   * @return {Component}
   * @example
   * // get sprite component.
   * var sprite = node.getComponent(cc.Sprite);
   * // get custom test calss.
   * var test = node.getComponent("Test");
   * @typescript
   * getComponent<T extends Component>(type: {prototype: T}): T
   * getComponent(className: string): any
   */
  getComponent: function getComponent(typeOrClassName) {
    return this.node.getComponent(typeOrClassName);
  },

  /**
   * !#en Returns all components of supplied Type in the node.
   * !#zh 返回节点上指定类型的所有组件。
   *
   * @method getComponents
   * @param {Function|String} typeOrClassName
   * @return {Component[]}
   * @example
   * var sprites = node.getComponents(cc.Sprite);
   * var tests = node.getComponents("Test");
   * @typescript
   * getComponents<T extends Component>(type: {prototype: T}): T[]
   * getComponents(className: string): any[]
   */
  getComponents: function getComponents(typeOrClassName) {
    return this.node.getComponents(typeOrClassName);
  },

  /**
   * !#en Returns the component of supplied type in any of its children using depth first search.
   * !#zh 递归查找所有子节点中第一个匹配指定类型的组件。
   *
   * @method getComponentInChildren
   * @param {Function|String} typeOrClassName
   * @returns {Component}
   * @example
   * var sprite = node.getComponentInChildren(cc.Sprite);
   * var Test = node.getComponentInChildren("Test");
   * @typescript
   * getComponentInChildren<T extends Component>(type: {prototype: T}): T
   * getComponentInChildren(className: string): any
   */
  getComponentInChildren: function getComponentInChildren(typeOrClassName) {
    return this.node.getComponentInChildren(typeOrClassName);
  },

  /**
   * !#en Returns the components of supplied type in self or any of its children using depth first search.
   * !#zh 递归查找自身或所有子节点中指定类型的组件
   *
   * @method getComponentsInChildren
   * @param {Function|String} typeOrClassName
   * @returns {Component[]}
   * @example
   * var sprites = node.getComponentsInChildren(cc.Sprite);
   * var tests = node.getComponentsInChildren("Test");
   * @typescript
   * getComponentsInChildren<T extends Component>(type: {prototype: T}): T[]
   * getComponentsInChildren(className: string): any[]
   */
  getComponentsInChildren: function getComponentsInChildren(typeOrClassName) {
    return this.node.getComponentsInChildren(typeOrClassName);
  },
  // VIRTUAL

  /**
   * !#en
   * If the component's bounding box is different from the node's, you can implement this method to supply
   * a custom axis aligned bounding box (AABB), so the editor's scene view can perform hit test properly.
   * !#zh
   * 如果组件的包围盒与节点不同，您可以实现该方法以提供自定义的轴向对齐的包围盒（AABB），
   * 以便编辑器的场景视图可以正确地执行点选测试。
   *
   * @method _getLocalBounds
   * @param {Rect} out_rect - the Rect to receive the bounding box
   */
  _getLocalBounds: null,

  /**
   * !#en
   * onRestore is called after the user clicks the Reset item in the Inspector's context menu or performs
   * an undo operation on this component.<br/>
   * <br/>
   * If the component contains the "internal state", short for "temporary member variables which not included<br/>
   * in its CCClass properties", then you may need to implement this function.<br/>
   * <br/>
   * The editor will call the getset accessors of your component to record/restore the component's state<br/>
   * for undo/redo operation. However, in extreme cases, it may not works well. Then you should implement<br/>
   * this function to manually synchronize your component's "internal states" with its public properties.<br/>
   * Once you implement this function, all the getset accessors of your component will not be called when<br/>
   * the user performs an undo/redo operation. Which means that only the properties with default value<br/>
   * will be recorded or restored by editor.<br/>
   * <br/>
   * Similarly, the editor may failed to reset your component correctly in extreme cases. Then if you need<br/>
   * to support the reset menu, you should manually synchronize your component's "internal states" with its<br/>
   * properties in this function. Once you implement this function, all the getset accessors of your component<br/>
   * will not be called during reset operation. Which means that only the properties with default value<br/>
   * will be reset by editor.
   *
   * This function is only called in editor mode.
   * !#zh
   * onRestore 是用户在检查器菜单点击 Reset 时，对此组件执行撤消操作后调用的。<br/>
   * <br/>
   * 如果组件包含了“内部状态”（不在 CCClass 属性中定义的临时成员变量），那么你可能需要实现该方法。<br/>
   * <br/>
   * 编辑器执行撤销/重做操作时，将调用组件的 get set 来录制和还原组件的状态。
   * 然而，在极端的情况下，它可能无法良好运作。<br/>
   * 那么你就应该实现这个方法，手动根据组件的属性同步“内部状态”。
   * 一旦你实现这个方法，当用户撤销或重做时，组件的所有 get set 都不会再被调用。
   * 这意味着仅仅指定了默认值的属性将被编辑器记录和还原。<br/>
   * <br/>
   * 同样的，编辑可能无法在极端情况下正确地重置您的组件。<br/>
   * 于是如果你需要支持组件重置菜单，你需要在该方法中手工同步组件属性到“内部状态”。<br/>
   * 一旦你实现这个方法，组件的所有 get set 都不会在重置操作时被调用。
   * 这意味着仅仅指定了默认值的属性将被编辑器重置。
   * <br/>
   * 此方法仅在编辑器下会被调用。
   * @method onRestore
   */
  onRestore: null,
  // OVERRIDE
  destroy: function destroy() {
    if (CC_EDITOR) {
      var depend = this.node._getDependComponent(this);

      if (depend) {
        return cc.errorID(3626, cc.js.getClassName(this), cc.js.getClassName(depend));
      }
    }

    if (this._super()) {
      if (this._enabled && this.node._activeInHierarchy) {
        cc.director._compScheduler.disableComp(this);
      }
    }
  },
  _onPreDestroy: function _onPreDestroy() {
    // Schedules
    this.unscheduleAllCallbacks(); // Remove all listeners

    var eventTargets = this.__eventTargets;

    for (var i = eventTargets.length - 1; i >= 0; --i) {
      var target = eventTargets[i];
      target && target.targetOff(this);
    }

    eventTargets.length = 0; //

    if (CC_EDITOR && !CC_TEST) {
      _Scene.AssetsWatcher.stop(this);
    } // onDestroy


    cc.director._nodeActivator.destroyComp(this); // do remove component


    this.node._removeComponent(this);
  },
  _instantiate: function _instantiate(cloned) {
    if (!cloned) {
      cloned = cc.instantiate._clone(this, this);
    }

    cloned.node = null;
    return cloned;
  },
  // Scheduler

  /**
   * !#en
   * Schedules a custom selector.<br/>
   * If the selector is already scheduled, then the interval parameter will be updated without scheduling it again.
   * !#zh
   * 调度一个自定义的回调函数。<br/>
   * 如果回调函数已调度，那么将不会重复调度它，只会更新时间间隔参数。
   * @method schedule
   * @param {function} callback The callback function
   * @param {Number} [interval=0]  Tick interval in seconds. 0 means tick every frame.
   * @param {Number} [repeat=cc.macro.REPEAT_FOREVER]    The selector will be executed (repeat + 1) times, you can use cc.macro.REPEAT_FOREVER for tick infinitely.
   * @param {Number} [delay=0]     The amount of time that the first tick will wait before execution. Unit: s
   * @example
   * var timeCallback = function (dt) {
   *   cc.log("time: " + dt);
   * }
   * this.schedule(timeCallback, 1);
   */
  schedule: function schedule(callback, interval, repeat, delay) {
    cc.assertID(callback, 1619);
    interval = interval || 0;
    cc.assertID(interval >= 0, 1620);
    repeat = isNaN(repeat) ? cc.macro.REPEAT_FOREVER : repeat;
    delay = delay || 0;
    var scheduler = cc.director.getScheduler(); // should not use enabledInHierarchy to judge whether paused,
    // because enabledInHierarchy is assigned after onEnable.
    // Actually, if not yet scheduled, resumeTarget/pauseTarget has no effect on component,
    // therefore there is no way to guarantee the paused state other than isTargetPaused.

    var paused = scheduler.isTargetPaused(this);
    scheduler.schedule(callback, this, interval, repeat, delay, paused);
  },

  /**
   * !#en Schedules a callback function that runs only once, with a delay of 0 or larger.
   * !#zh 调度一个只运行一次的回调函数，可以指定 0 让回调函数在下一帧立即执行或者在一定的延时之后执行。
   * @method scheduleOnce
   * @see cc.Node#schedule
   * @param {function} callback  A function wrapped as a selector
   * @param {Number} [delay=0]  The amount of time that the first tick will wait before execution. Unit: s
   * @example
   * var timeCallback = function (dt) {
   *   cc.log("time: " + dt);
   * }
   * this.scheduleOnce(timeCallback, 2);
   */
  scheduleOnce: function scheduleOnce(callback, delay) {
    this.schedule(callback, 0, 0, delay);
  },

  /**
   * !#en Unschedules a custom callback function.
   * !#zh 取消调度一个自定义的回调函数。
   * @method unschedule
   * @see cc.Node#schedule
   * @param {function} callback_fn  A function wrapped as a selector
   * @example
   * this.unschedule(_callback);
   */
  unschedule: function unschedule(callback_fn) {
    if (!callback_fn) return;
    cc.director.getScheduler().unschedule(callback_fn, this);
  },

  /**
   * !#en
   * unschedule all scheduled callback functions: custom callback functions, and the 'update' callback function.<br/>
   * Actions are not affected by this method.
   * !#zh 取消调度所有已调度的回调函数：定制的回调函数以及 'update' 回调函数。动作不受此方法影响。
   * @method unscheduleAllCallbacks
   * @example
   * this.unscheduleAllCallbacks();
   */
  unscheduleAllCallbacks: function unscheduleAllCallbacks() {
    cc.director.getScheduler().unscheduleAllForTarget(this);
  }
});
Component._requireComponent = null;
Component._executionOrder = 0;

if (CC_EDITOR || CC_TEST) {
  // INHERITABLE STATIC MEMBERS
  Component._executeInEditMode = false;
  Component._playOnFocus = false;
  Component._disallowMultiple = null;
  Component._help = ''; // NON-INHERITED STATIC MEMBERS
  // (TypeScript 2.3 will still inherit them, so always check hasOwnProperty before using)

  js.value(Component, '_inspector', '', true);
  js.value(Component, '_icon', '', true); // COMPONENT HELPERS

  cc._componentMenuItems = [];

  Component._addMenuItem = function (cls, path, priority) {
    cc._componentMenuItems.push({
      component: cls,
      menuPath: path,
      priority: priority
    });
  };
} // we make this non-enumerable, to prevent inherited by sub classes.


js.value(Component, '_registerEditorProps', function (cls, props) {
  var reqComp = props.requireComponent;

  if (reqComp) {
    cls._requireComponent = reqComp;
  }

  var order = props.executionOrder;

  if (order && typeof order === 'number') {
    cls._executionOrder = order;
  }

  if (CC_EDITOR || CC_TEST) {
    var name = cc.js.getClassName(cls);

    for (var key in props) {
      var val = props[key];

      switch (key) {
        case 'executeInEditMode':
          cls._executeInEditMode = !!val;
          break;

        case 'playOnFocus':
          if (val) {
            var willExecuteInEditMode = 'executeInEditMode' in props ? props.executeInEditMode : cls._executeInEditMode;

            if (willExecuteInEditMode) {
              cls._playOnFocus = true;
            } else {
              cc.warnID(3601, name);
            }
          }

          break;

        case 'inspector':
          js.value(cls, '_inspector', val, true);
          break;

        case 'icon':
          js.value(cls, '_icon', val, true);
          break;

        case 'menu':
          Component._addMenuItem(cls, val, props.menuPriority);

          break;

        case 'disallowMultiple':
          cls._disallowMultiple = cls;
          break;

        case 'requireComponent':
        case 'executionOrder':
          // skip here
          break;

        case 'help':
          cls._help = val;
          break;

        default:
          cc.warnID(3602, key, name);
          break;
      }
    }
  }
});
Component.prototype.__scriptUuid = '';
cc.Component = module.exports = Component;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDQ29tcG9uZW50LmpzIl0sIm5hbWVzIjpbIkNDT2JqZWN0IiwicmVxdWlyZSIsImpzIiwiaWRHZW5lcmF0ZXIiLCJJc09uRW5hYmxlQ2FsbGVkIiwiRmxhZ3MiLCJJc09uTG9hZENhbGxlZCIsIkNvbXBvbmVudCIsImNjIiwiQ2xhc3MiLCJuYW1lIiwiY3RvciIsIkNDX0VESVRPUiIsIl9TY2VuZSIsIkFzc2V0c1dhdGNoZXIiLCJpbml0Q29tcG9uZW50IiwiX2lkIiwiRWRpdG9yIiwiVXRpbHMiLCJVdWlkVXRpbHMiLCJ1dWlkIiwiX19ldmVudFRhcmdldHMiLCJnZXROZXdJZCIsInByb3BlcnRpZXMiLCJub2RlIiwidmlzaWJsZSIsImdldCIsIl9uYW1lIiwiY2xhc3NOYW1lIiwiZ2V0Q2xhc3NOYW1lIiwidHJpbUxlZnQiLCJsYXN0SW5kZXhPZiIsInNsaWNlIiwic2V0IiwidmFsdWUiLCJfX3NjcmlwdEFzc2V0IiwiZGlzcGxheU5hbWUiLCJ0eXBlIiwiX1NjcmlwdCIsInRvb2x0aXAiLCJDQ19ERVYiLCJfZW5hYmxlZCIsImVuYWJsZWQiLCJfYWN0aXZlSW5IaWVyYXJjaHkiLCJjb21wU2NoZWR1bGVyIiwiZGlyZWN0b3IiLCJfY29tcFNjaGVkdWxlciIsImVuYWJsZUNvbXAiLCJkaXNhYmxlQ29tcCIsImFuaW1hdGFibGUiLCJlbmFibGVkSW5IaWVyYXJjaHkiLCJfaXNPbkxvYWRDYWxsZWQiLCJfb2JqRmxhZ3MiLCJ1cGRhdGUiLCJsYXRlVXBkYXRlIiwiX19wcmVsb2FkIiwib25Mb2FkIiwic3RhcnQiLCJvbkVuYWJsZSIsIm9uRGlzYWJsZSIsIm9uRGVzdHJveSIsIm9uRm9jdXNJbkVkaXRvciIsIm9uTG9zdEZvY3VzSW5FZGl0b3IiLCJyZXNldEluRWRpdG9yIiwiYWRkQ29tcG9uZW50IiwidHlwZU9yQ2xhc3NOYW1lIiwiZ2V0Q29tcG9uZW50IiwiZ2V0Q29tcG9uZW50cyIsImdldENvbXBvbmVudEluQ2hpbGRyZW4iLCJnZXRDb21wb25lbnRzSW5DaGlsZHJlbiIsIl9nZXRMb2NhbEJvdW5kcyIsIm9uUmVzdG9yZSIsImRlc3Ryb3kiLCJkZXBlbmQiLCJfZ2V0RGVwZW5kQ29tcG9uZW50IiwiZXJyb3JJRCIsIl9zdXBlciIsIl9vblByZURlc3Ryb3kiLCJ1bnNjaGVkdWxlQWxsQ2FsbGJhY2tzIiwiZXZlbnRUYXJnZXRzIiwiaSIsImxlbmd0aCIsInRhcmdldCIsInRhcmdldE9mZiIsIkNDX1RFU1QiLCJzdG9wIiwiX25vZGVBY3RpdmF0b3IiLCJkZXN0cm95Q29tcCIsIl9yZW1vdmVDb21wb25lbnQiLCJfaW5zdGFudGlhdGUiLCJjbG9uZWQiLCJpbnN0YW50aWF0ZSIsIl9jbG9uZSIsInNjaGVkdWxlIiwiY2FsbGJhY2siLCJpbnRlcnZhbCIsInJlcGVhdCIsImRlbGF5IiwiYXNzZXJ0SUQiLCJpc05hTiIsIm1hY3JvIiwiUkVQRUFUX0ZPUkVWRVIiLCJzY2hlZHVsZXIiLCJnZXRTY2hlZHVsZXIiLCJwYXVzZWQiLCJpc1RhcmdldFBhdXNlZCIsInNjaGVkdWxlT25jZSIsInVuc2NoZWR1bGUiLCJjYWxsYmFja19mbiIsInVuc2NoZWR1bGVBbGxGb3JUYXJnZXQiLCJfcmVxdWlyZUNvbXBvbmVudCIsIl9leGVjdXRpb25PcmRlciIsIl9leGVjdXRlSW5FZGl0TW9kZSIsIl9wbGF5T25Gb2N1cyIsIl9kaXNhbGxvd011bHRpcGxlIiwiX2hlbHAiLCJfY29tcG9uZW50TWVudUl0ZW1zIiwiX2FkZE1lbnVJdGVtIiwiY2xzIiwicGF0aCIsInByaW9yaXR5IiwicHVzaCIsImNvbXBvbmVudCIsIm1lbnVQYXRoIiwicHJvcHMiLCJyZXFDb21wIiwicmVxdWlyZUNvbXBvbmVudCIsIm9yZGVyIiwiZXhlY3V0aW9uT3JkZXIiLCJrZXkiLCJ2YWwiLCJ3aWxsRXhlY3V0ZUluRWRpdE1vZGUiLCJleGVjdXRlSW5FZGl0TW9kZSIsIndhcm5JRCIsIm1lbnVQcmlvcml0eSIsInByb3RvdHlwZSIsIl9fc2NyaXB0VXVpZCIsIm1vZHVsZSIsImV4cG9y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QyxJQUFqQztBQUNBOztBQUVKLGFBQUssTUFBTDtBQUNJaEksVUFBQUEsRUFBRSxDQUFDZ0MsS0FBSCxDQUFTb0YsR0FBVCxFQUFjLE9BQWQsRUFBdUJZLEdBQXZCLEVBQTRCLElBQTVCO0FBQ0E7O0FBRUosYUFBSyxNQUFMO0FBQ0kzSCxVQUFBQSxTQUFTLENBQUM4RyxZQUFWLENBQXVCQyxHQUF2QixFQUE0QlksR0FBNUIsRUFBaUNOLEtBQUssQ0FBQ1UsWUFBdkM7O0FBQ0E7O0FBRUosYUFBSyxrQkFBTDtBQUNJaEIsVUFBQUEsR0FBRyxDQUFDSixpQkFBSixHQUF3QkksR0FBeEI7QUFDQTs7QUFFSixhQUFLLGtCQUFMO0FBQ0EsYUFBSyxnQkFBTDtBQUNJO0FBQ0E7O0FBRUosYUFBSyxNQUFMO0FBQ0lBLFVBQUFBLEdBQUcsQ0FBQ0gsS0FBSixHQUFZZSxHQUFaO0FBQ0E7O0FBRUo7QUFDSTFILFVBQUFBLEVBQUUsQ0FBQzZILE1BQUgsQ0FBVSxJQUFWLEVBQWdCSixHQUFoQixFQUFxQnZILElBQXJCO0FBQ0E7QUE1Q1I7QUE4Q0g7QUFDSjtBQUNKLENBN0REO0FBK0RBSCxTQUFTLENBQUNnSSxTQUFWLENBQW9CQyxZQUFwQixHQUFtQyxFQUFuQztBQUVBaEksRUFBRSxDQUFDRCxTQUFILEdBQWVrSSxNQUFNLENBQUNDLE9BQVAsR0FBaUJuSSxTQUFoQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxudmFyIENDT2JqZWN0ID0gcmVxdWlyZSgnLi4vcGxhdGZvcm0vQ0NPYmplY3QnKTtcbnZhciBqcyA9IHJlcXVpcmUoJy4uL3BsYXRmb3JtL2pzJyk7XG52YXIgaWRHZW5lcmF0ZXIgPSBuZXcgKHJlcXVpcmUoJy4uL3BsYXRmb3JtL2lkLWdlbmVyYXRlcicpKSgnQ29tcCcpO1xuXG52YXIgSXNPbkVuYWJsZUNhbGxlZCA9IENDT2JqZWN0LkZsYWdzLklzT25FbmFibGVDYWxsZWQ7XG52YXIgSXNPbkxvYWRDYWxsZWQgPSBDQ09iamVjdC5GbGFncy5Jc09uTG9hZENhbGxlZDtcblxuLyoqXG4gKiAhI2VuXG4gKiBCYXNlIGNsYXNzIGZvciBldmVyeXRoaW5nIGF0dGFjaGVkIHRvIE5vZGUoRW50aXR5KS48YnIvPlxuICogPGJyLz5cbiAqIE5PVEU6IE5vdCBhbGxvd2VkIHRvIHVzZSBjb25zdHJ1Y3Rpb24gcGFyYW1ldGVycyBmb3IgQ29tcG9uZW50J3Mgc3ViY2xhc3NlcyxcbiAqICAgICAgIGJlY2F1c2UgQ29tcG9uZW50IGlzIGNyZWF0ZWQgYnkgdGhlIGVuZ2luZS5cbiAqICEjemhcbiAqIOaJgOaciemZhOWKoOWIsOiKgueCueeahOWfuuexu+OAgjxici8+XG4gKiA8YnIvPlxuICog5rOo5oSP77ya5LiN5YWB6K645L2/55So57uE5Lu255qE5a2Q57G75p6E6YCg5Y+C5pWw77yM5Zug5Li657uE5Lu25piv55Sx5byV5pOO5Yib5bu655qE44CCXG4gKlxuICogQGNsYXNzIENvbXBvbmVudFxuICogQGV4dGVuZHMgT2JqZWN0XG4gKi9cbnZhciBDb21wb25lbnQgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLkNvbXBvbmVudCcsXG4gICAgZXh0ZW5kczogQ0NPYmplY3QsXG5cbiAgICBjdG9yOiBDQ19FRElUT1IgPyBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgodHlwZW9mIF9TY2VuZSAhPT0gXCJ1bmRlZmluZWRcIikgJiYgX1NjZW5lLkFzc2V0c1dhdGNoZXIpIHtcbiAgICAgICAgICAgIF9TY2VuZS5Bc3NldHNXYXRjaGVyLmluaXRDb21wb25lbnQodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5faWQgPSBFZGl0b3IuVXRpbHMuVXVpZFV0aWxzLnV1aWQoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVnaXN0ZXIgYWxsIHJlbGF0ZWQgRXZlbnRUYXJnZXRzLFxuICAgICAgICAgKiBhbGwgZXZlbnQgY2FsbGJhY2tzIHdpbGwgYmUgcmVtb3ZlZCBpbiBfb25QcmVEZXN0cm95XG4gICAgICAgICAqIEBwcm9wZXJ0eSB7QXJyYXl9IF9fZXZlbnRUYXJnZXRzXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9fZXZlbnRUYXJnZXRzID0gW107XG4gICAgfSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5faWQgPSBpZEdlbmVyYXRlci5nZXROZXdJZCgpO1xuXG4gICAgICAgIHRoaXMuX19ldmVudFRhcmdldHMgPSBbXTtcbiAgICB9LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgbm9kZSB0aGlzIGNvbXBvbmVudCBpcyBhdHRhY2hlZCB0by4gQSBjb21wb25lbnQgaXMgYWx3YXlzIGF0dGFjaGVkIHRvIGEgbm9kZS5cbiAgICAgICAgICogISN6aCDor6Xnu4Tku7booqvpmYTliqDliLDnmoToioLngrnjgILnu4Tku7bmgLvkvJrpmYTliqDliLDkuIDkuKroioLngrnjgIJcbiAgICAgICAgICogQHByb3BlcnR5IG5vZGVcbiAgICAgICAgICogQHR5cGUge05vZGV9XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIGNjLmxvZyhjb21wLm5vZGUpO1xuICAgICAgICAgKi9cbiAgICAgICAgbm9kZToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgbmFtZToge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbmFtZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGNsYXNzTmFtZSA9IGNjLmpzLmdldENsYXNzTmFtZSh0aGlzKTtcbiAgICAgICAgICAgICAgICB2YXIgdHJpbUxlZnQgPSBjbGFzc05hbWUubGFzdEluZGV4T2YoJy4nKTtcbiAgICAgICAgICAgICAgICBpZiAodHJpbUxlZnQgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWUgPSBjbGFzc05hbWUuc2xpY2UodHJpbUxlZnQgKyAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9kZS5uYW1lICsgJzwnICsgY2xhc3NOYW1lICsgJz4nO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9uYW1lID0gdmFsdWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgdXVpZCBmb3IgZWRpdG9yLlxuICAgICAgICAgKiAhI3poIOe7hOS7tueahCB1dWlk77yM55So5LqO57yW6L6R5Zmo44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB1dWlkXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqIEByZWFkT25seVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBjYy5sb2coY29tcC51dWlkKTtcbiAgICAgICAgICovXG4gICAgICAgIHV1aWQ6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lkO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgX19zY3JpcHRBc3NldDogQ0NfRURJVE9SICYmIHtcbiAgICAgICAgICAgIGdldCAoKSB7fSxcbiAgICAgICAgICAgIC8vc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgLy8gICAgaWYgKHRoaXMuX19zY3JpcHRVdWlkICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgLy8gICAgICAgIGlmICh2YWx1ZSAmJiBFZGl0b3IuVXRpbHMuVXVpZFV0aWxzLmlzVXVpZCh2YWx1ZS5fdXVpZCkpIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgdmFyIGNsYXNzSWQgPSBFZGl0b3IuVXRpbHMuVXVpZFV0aWxzLmNvbXByZXNzVXVpZCh2YWx1ZS5fdXVpZCk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgIHZhciBOZXdDb21wID0gY2MuanMuX2dldENsYXNzQnlJZChjbGFzc0lkKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgaWYgKGpzLmlzQ2hpbGRDbGFzc09mKE5ld0NvbXAsIGNjLkNvbXBvbmVudCkpIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGNjLndhcm4oJ1NvcnJ5LCByZXBsYWNpbmcgY29tcG9uZW50IHNjcmlwdCBpcyBub3QgeWV0IGltcGxlbWVudGVkLicpO1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgLy9FZGl0b3IuSXBjLnNlbmRUb1dpbnMoJ3JlbG9hZDp3aW5kb3ctc2NyaXB0cycsIEVkaXRvci5fU2FuZGJveC5jb21waWxlZCk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBjYy5lcnJvcignQ2FuIG5vdCBmaW5kIGEgY29tcG9uZW50IGluIHRoZSBzY3JpcHQgd2hpY2ggdXVpZCBpcyBcIiVzXCIuJywgdmFsdWUuX3V1aWQpO1xuICAgICAgICAgICAgLy8gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyAgICAgICAgfVxuICAgICAgICAgICAgLy8gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gICAgICAgICAgICBjYy5lcnJvcignSW52YWxpZCBTY3JpcHQnKTtcbiAgICAgICAgICAgIC8vICAgICAgICB9XG4gICAgICAgICAgICAvLyAgICB9XG4gICAgICAgICAgICAvL30sXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogJ1NjcmlwdCcsXG4gICAgICAgICAgICB0eXBlOiBjYy5fU2NyaXB0LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOklOU1BFQ1RPUi5jb21wb25lbnQuc2NyaXB0J1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcHJvcGVydHkgX2VuYWJsZWRcbiAgICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBfZW5hYmxlZDogdHJ1ZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBpbmRpY2F0ZXMgd2hldGhlciB0aGlzIGNvbXBvbmVudCBpcyBlbmFibGVkIG9yIG5vdC5cbiAgICAgICAgICogISN6aCDooajnpLror6Xnu4Tku7boh6rouqvmmK/lkKblkK/nlKjjgIJcbiAgICAgICAgICogQHByb3BlcnR5IGVuYWJsZWRcbiAgICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogY29tcC5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICogY2MubG9nKGNvbXAuZW5hYmxlZCk7XG4gICAgICAgICAqL1xuICAgICAgICBlbmFibGVkOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9lbmFibGVkO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZW5hYmxlZCAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZW5hYmxlZCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ub2RlLl9hY3RpdmVJbkhpZXJhcmNoeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbXBTY2hlZHVsZXIgPSBjYy5kaXJlY3Rvci5fY29tcFNjaGVkdWxlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBTY2hlZHVsZXIuZW5hYmxlQ29tcCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBTY2hlZHVsZXIuZGlzYWJsZUNvbXAodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgICAgICAgICBhbmltYXRhYmxlOiB0cnVlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gaW5kaWNhdGVzIHdoZXRoZXIgdGhpcyBjb21wb25lbnQgaXMgZW5hYmxlZCBhbmQgaXRzIG5vZGUgaXMgYWxzbyBhY3RpdmUgaW4gdGhlIGhpZXJhcmNoeS5cbiAgICAgICAgICogISN6aCDooajnpLror6Xnu4Tku7bmmK/lkKbooqvlkK/nlKjlubbkuJTmiYDlnKjnmoToioLngrnkuZ/lpITkuo7mv4DmtLvnirbmgIHjgIJcbiAgICAgICAgICogQHByb3BlcnR5IGVuYWJsZWRJbkhpZXJhcmNoeVxuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICogQHJlYWRPbmx5XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIGNjLmxvZyhjb21wLmVuYWJsZWRJbkhpZXJhcmNoeSk7XG4gICAgICAgICAqL1xuICAgICAgICBlbmFibGVkSW5IaWVyYXJjaHk6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2VuYWJsZWQgJiYgdGhpcy5ub2RlLl9hY3RpdmVJbkhpZXJhcmNoeTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFJldHVybnMgYSB2YWx1ZSB3aGljaCB1c2VkIHRvIGluZGljYXRlIHRoZSBvbkxvYWQgZ2V0IGNhbGxlZCBvciBub3QuXG4gICAgICAgICAqICEjemgg6L+U5Zue5LiA5Liq5YC855So5p2l5Yik5patIG9uTG9hZCDmmK/lkKbooqvosIPnlKjov4fvvIzkuI3nrYnkuo4gMCDml7bosIPnlKjov4fvvIznrYnkuo4gMCDml7bmnKrosIPnlKjjgIJcbiAgICAgICAgICogQHByb3BlcnR5IF9pc09uTG9hZENhbGxlZFxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKiBAcmVhZE9ubHlcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogY2MubG9nKHRoaXMuX2lzT25Mb2FkQ2FsbGVkID4gMCk7XG4gICAgICAgICAqL1xuICAgICAgICBfaXNPbkxvYWRDYWxsZWQ6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29iakZsYWdzICYgSXNPbkxvYWRDYWxsZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIC8vIExJRkVDWUNMRSBNRVRIT0RTXG5cbiAgICAvLyBGaXJlYmFsbCBwcm92aWRlcyBsaWZlY3ljbGUgbWV0aG9kcyB0aGF0IHlvdSBjYW4gc3BlY2lmeSB0byBob29rIGludG8gdGhpcyBwcm9jZXNzLlxuICAgIC8vIFdlIHByb3ZpZGUgUHJlIG1ldGhvZHMsIHdoaWNoIGFyZSBjYWxsZWQgcmlnaHQgYmVmb3JlIHNvbWV0aGluZyBoYXBwZW5zLCBhbmQgUG9zdCBtZXRob2RzIHdoaWNoIGFyZSBjYWxsZWQgcmlnaHQgYWZ0ZXIgc29tZXRoaW5nIGhhcHBlbnMuXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFVwZGF0ZSBpcyBjYWxsZWQgZXZlcnkgZnJhbWUsIGlmIHRoZSBDb21wb25lbnQgaXMgZW5hYmxlZC48YnIvPlxuICAgICAqIFRoaXMgaXMgYSBsaWZlY3ljbGUgbWV0aG9kLiBJdCBtYXkgbm90IGJlIGltcGxlbWVudGVkIGluIHRoZSBzdXBlciBjbGFzcy4gWW91IGNhbiBvbmx5IGNhbGwgaXRzIHN1cGVyIGNsYXNzIG1ldGhvZCBpbnNpZGUgaXQuIEl0IHNob3VsZCBub3QgYmUgY2FsbGVkIG1hbnVhbGx5IGVsc2V3aGVyZS5cbiAgICAgKiAhI3poIOWmguaenOivpee7hOS7tuWQr+eUqO+8jOWImeavj+W4p+iwg+eUqCB1cGRhdGXjgII8YnIvPlxuICAgICAqIOivpeaWueazleS4uueUn+WRveWRqOacn+aWueazle+8jOeItuexu+acquW/heS8muacieWunueOsOOAguW5tuS4lOS9oOWPquiDveWcqOivpeaWueazleWGhemDqOiwg+eUqOeItuexu+eahOWunueOsO+8jOS4jeWPr+WcqOWFtuWug+WcsOaWueebtOaOpeiwg+eUqOivpeaWueazleOAglxuICAgICAqIEBtZXRob2QgdXBkYXRlXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGR0IC0gdGhlIGRlbHRhIHRpbWUgaW4gc2Vjb25kcyBpdCB0b29rIHRvIGNvbXBsZXRlIHRoZSBsYXN0IGZyYW1lXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIHVwZGF0ZTogbnVsbCxcblxuICAgIC8qKlxuICAgICAqICEjZW4gTGF0ZVVwZGF0ZSBpcyBjYWxsZWQgZXZlcnkgZnJhbWUsIGlmIHRoZSBDb21wb25lbnQgaXMgZW5hYmxlZC48YnIvPlxuICAgICAqIFRoaXMgaXMgYSBsaWZlY3ljbGUgbWV0aG9kLiBJdCBtYXkgbm90IGJlIGltcGxlbWVudGVkIGluIHRoZSBzdXBlciBjbGFzcy4gWW91IGNhbiBvbmx5IGNhbGwgaXRzIHN1cGVyIGNsYXNzIG1ldGhvZCBpbnNpZGUgaXQuIEl0IHNob3VsZCBub3QgYmUgY2FsbGVkIG1hbnVhbGx5IGVsc2V3aGVyZS5cbiAgICAgKiAhI3poIOWmguaenOivpee7hOS7tuWQr+eUqO+8jOWImeavj+W4p+iwg+eUqCBMYXRlVXBkYXRl44CCPGJyLz5cbiAgICAgKiDor6Xmlrnms5XkuLrnlJ/lkb3lkajmnJ/mlrnms5XvvIzniLbnsbvmnKrlv4XkvJrmnInlrp7njrDjgILlubbkuJTkvaDlj6rog73lnKjor6Xmlrnms5XlhoXpg6josIPnlKjniLbnsbvnmoTlrp7njrDvvIzkuI3lj6/lnKjlhbblroPlnLDmlrnnm7TmjqXosIPnlKjor6Xmlrnms5XjgIJcbiAgICAgKiBAbWV0aG9kIGxhdGVVcGRhdGVcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgbGF0ZVVwZGF0ZTogbnVsbCxcblxuICAgIC8qKlxuICAgICAqIGBfX3ByZWxvYWRgIGlzIGNhbGxlZCBiZWZvcmUgZXZlcnkgb25Mb2FkLlxuICAgICAqIEl0IGlzIHVzZWQgdG8gaW5pdGlhbGl6ZSB0aGUgYnVpbHRpbiBjb21wb25lbnRzIGludGVybmFsbHksXG4gICAgICogdG8gYXZvaWQgY2hlY2tpbmcgd2hldGhlciBvbkxvYWQgaXMgY2FsbGVkIGJlZm9yZSBldmVyeSBwdWJsaWMgbWV0aG9kIGNhbGxzLlxuICAgICAqIFRoaXMgbWV0aG9kIHNob3VsZCBiZSByZW1vdmVkIGlmIHNjcmlwdCBwcmlvcml0eSBpcyBzdXBwb3J0ZWQuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIF9fcHJlbG9hZFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX19wcmVsb2FkOiBudWxsLFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFdoZW4gYXR0YWNoaW5nIHRvIGFuIGFjdGl2ZSBub2RlIG9yIGl0cyBub2RlIGZpcnN0IGFjdGl2YXRlZC5cbiAgICAgKiBvbkxvYWQgaXMgYWx3YXlzIGNhbGxlZCBiZWZvcmUgYW55IHN0YXJ0IGZ1bmN0aW9ucywgdGhpcyBhbGxvd3MgeW91IHRvIG9yZGVyIGluaXRpYWxpemF0aW9uIG9mIHNjcmlwdHMuPGJyLz5cbiAgICAgKiBUaGlzIGlzIGEgbGlmZWN5Y2xlIG1ldGhvZC4gSXQgbWF5IG5vdCBiZSBpbXBsZW1lbnRlZCBpbiB0aGUgc3VwZXIgY2xhc3MuIFlvdSBjYW4gb25seSBjYWxsIGl0cyBzdXBlciBjbGFzcyBtZXRob2QgaW5zaWRlIGl0LiBJdCBzaG91bGQgbm90IGJlIGNhbGxlZCBtYW51YWxseSBlbHNld2hlcmUuXG4gICAgICogISN6aFxuICAgICAqIOW9k+mZhOWKoOWIsOS4gOS4qua/gOa0u+eahOiKgueCueS4iuaIluiAheWFtuiKgueCueesrOS4gOasoea/gOa0u+aXtuWAmeiwg+eUqOOAgm9uTG9hZCDmgLvmmK/kvJrlnKjku7vkvZUgc3RhcnQg5pa55rOV6LCD55So5YmN5omn6KGM77yM6L+Z6IO955So5LqO5a6J5o6S6ISa5pys55qE5Yid5aeL5YyW6aG65bqP44CCPGJyLz5cbiAgICAgKiDor6Xmlrnms5XkuLrnlJ/lkb3lkajmnJ/mlrnms5XvvIzniLbnsbvmnKrlv4XkvJrmnInlrp7njrDjgILlubbkuJTkvaDlj6rog73lnKjor6Xmlrnms5XlhoXpg6josIPnlKjniLbnsbvnmoTlrp7njrDvvIzkuI3lj6/lnKjlhbblroPlnLDmlrnnm7TmjqXosIPnlKjor6Xmlrnms5XjgIJcbiAgICAgKiBAbWV0aG9kIG9uTG9hZFxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKi9cbiAgICBvbkxvYWQ6IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQ2FsbGVkIGJlZm9yZSBhbGwgc2NyaXB0cycgdXBkYXRlIGlmIHRoZSBDb21wb25lbnQgaXMgZW5hYmxlZCB0aGUgZmlyc3QgdGltZS5cbiAgICAgKiBVc3VhbGx5IHVzZWQgdG8gaW5pdGlhbGl6ZSBzb21lIGxvZ2ljIHdoaWNoIG5lZWQgdG8gYmUgY2FsbGVkIGFmdGVyIGFsbCBjb21wb25lbnRzJyBgb25sb2FkYCBtZXRob2RzIGNhbGxlZC48YnIvPlxuICAgICAqIFRoaXMgaXMgYSBsaWZlY3ljbGUgbWV0aG9kLiBJdCBtYXkgbm90IGJlIGltcGxlbWVudGVkIGluIHRoZSBzdXBlciBjbGFzcy4gWW91IGNhbiBvbmx5IGNhbGwgaXRzIHN1cGVyIGNsYXNzIG1ldGhvZCBpbnNpZGUgaXQuIEl0IHNob3VsZCBub3QgYmUgY2FsbGVkIG1hbnVhbGx5IGVsc2V3aGVyZS5cbiAgICAgKiAhI3poXG4gICAgICog5aaC5p6c6K+l57uE5Lu256ys5LiA5qyh5ZCv55So77yM5YiZ5Zyo5omA5pyJ57uE5Lu255qEIHVwZGF0ZSDkuYvliY3osIPnlKjjgILpgJrluLjnlKjkuo7pnIDopoHlnKjmiYDmnInnu4Tku7bnmoQgb25Mb2FkIOWIneWni+WMluWujOavleWQjuaJp+ihjOeahOmAu+i+keOAgjxici8+XG4gICAgICog6K+l5pa55rOV5Li655Sf5ZG95ZGo5pyf5pa55rOV77yM54i257G75pyq5b+F5Lya5pyJ5a6e546w44CC5bm25LiU5L2g5Y+q6IO95Zyo6K+l5pa55rOV5YaF6YOo6LCD55So54i257G755qE5a6e546w77yM5LiN5Y+v5Zyo5YW25a6D5Zyw5pa555u05o6l6LCD55So6K+l5pa55rOV44CCXG4gICAgICogQG1ldGhvZCBzdGFydFxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKi9cbiAgICBzdGFydDogbnVsbCxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2FsbGVkIHdoZW4gdGhpcyBjb21wb25lbnQgYmVjb21lcyBlbmFibGVkIGFuZCBpdHMgbm9kZSBpcyBhY3RpdmUuPGJyLz5cbiAgICAgKiBUaGlzIGlzIGEgbGlmZWN5Y2xlIG1ldGhvZC4gSXQgbWF5IG5vdCBiZSBpbXBsZW1lbnRlZCBpbiB0aGUgc3VwZXIgY2xhc3MuIFlvdSBjYW4gb25seSBjYWxsIGl0cyBzdXBlciBjbGFzcyBtZXRob2QgaW5zaWRlIGl0LiBJdCBzaG91bGQgbm90IGJlIGNhbGxlZCBtYW51YWxseSBlbHNld2hlcmUuXG4gICAgICogISN6aCDlvZPor6Xnu4Tku7booqvlkK/nlKjvvIzlubbkuJTlroPnmoToioLngrnkuZ/mv4DmtLvml7bjgII8YnIvPlxuICAgICAqIOivpeaWueazleS4uueUn+WRveWRqOacn+aWueazle+8jOeItuexu+acquW/heS8muacieWunueOsOOAguW5tuS4lOS9oOWPquiDveWcqOivpeaWueazleWGhemDqOiwg+eUqOeItuexu+eahOWunueOsO+8jOS4jeWPr+WcqOWFtuWug+WcsOaWueebtOaOpeiwg+eUqOivpeaWueazleOAglxuICAgICAqIEBtZXRob2Qgb25FbmFibGVcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgb25FbmFibGU6IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENhbGxlZCB3aGVuIHRoaXMgY29tcG9uZW50IGJlY29tZXMgZGlzYWJsZWQgb3IgaXRzIG5vZGUgYmVjb21lcyBpbmFjdGl2ZS48YnIvPlxuICAgICAqIFRoaXMgaXMgYSBsaWZlY3ljbGUgbWV0aG9kLiBJdCBtYXkgbm90IGJlIGltcGxlbWVudGVkIGluIHRoZSBzdXBlciBjbGFzcy4gWW91IGNhbiBvbmx5IGNhbGwgaXRzIHN1cGVyIGNsYXNzIG1ldGhvZCBpbnNpZGUgaXQuIEl0IHNob3VsZCBub3QgYmUgY2FsbGVkIG1hbnVhbGx5IGVsc2V3aGVyZS5cbiAgICAgKiAhI3poIOW9k+ivpee7hOS7tuiiq+emgeeUqOaIluiKgueCueWPmOS4uuaXoOaViOaXtuiwg+eUqOOAgjxici8+XG4gICAgICog6K+l5pa55rOV5Li655Sf5ZG95ZGo5pyf5pa55rOV77yM54i257G75pyq5b+F5Lya5pyJ5a6e546w44CC5bm25LiU5L2g5Y+q6IO95Zyo6K+l5pa55rOV5YaF6YOo6LCD55So54i257G755qE5a6e546w77yM5LiN5Y+v5Zyo5YW25a6D5Zyw5pa555u05o6l6LCD55So6K+l5pa55rOV44CCXG4gICAgICogQG1ldGhvZCBvbkRpc2FibGVcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgb25EaXNhYmxlOiBudWxsLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBDYWxsZWQgd2hlbiB0aGlzIGNvbXBvbmVudCB3aWxsIGJlIGRlc3Ryb3llZC48YnIvPlxuICAgICAqIFRoaXMgaXMgYSBsaWZlY3ljbGUgbWV0aG9kLiBJdCBtYXkgbm90IGJlIGltcGxlbWVudGVkIGluIHRoZSBzdXBlciBjbGFzcy4gWW91IGNhbiBvbmx5IGNhbGwgaXRzIHN1cGVyIGNsYXNzIG1ldGhvZCBpbnNpZGUgaXQuIEl0IHNob3VsZCBub3QgYmUgY2FsbGVkIG1hbnVhbGx5IGVsc2V3aGVyZS5cbiAgICAgKiAhI3poIOW9k+ivpee7hOS7tuiiq+mUgOavgeaXtuiwg+eUqDxici8+XG4gICAgICog6K+l5pa55rOV5Li655Sf5ZG95ZGo5pyf5pa55rOV77yM54i257G75pyq5b+F5Lya5pyJ5a6e546w44CC5bm25LiU5L2g5Y+q6IO95Zyo6K+l5pa55rOV5YaF6YOo6LCD55So54i257G755qE5a6e546w77yM5LiN5Y+v5Zyo5YW25a6D5Zyw5pa555u05o6l6LCD55So6K+l5pa55rOV44CCXG4gICAgICogQG1ldGhvZCBvbkRlc3Ryb3lcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgb25EZXN0cm95OiBudWxsLFxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBvbkZvY3VzSW5FZGl0b3JcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgb25Gb2N1c0luRWRpdG9yOiBudWxsLFxuICAgIC8qKlxuICAgICAqIEBtZXRob2Qgb25Mb3N0Rm9jdXNJbkVkaXRvclxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKi9cbiAgICBvbkxvc3RGb2N1c0luRWRpdG9yOiBudWxsLFxuICAgIC8qKlxuICAgICAqICEjZW4gQ2FsbGVkIHRvIGluaXRpYWxpemUgdGhlIGNvbXBvbmVudCBvciBub2Rl4oCZcyBwcm9wZXJ0aWVzIHdoZW4gYWRkaW5nIHRoZSBjb21wb25lbnQgdGhlIGZpcnN0IHRpbWUgb3Igd2hlbiB0aGUgUmVzZXQgY29tbWFuZCBpcyB1c2VkLiBUaGlzIGZ1bmN0aW9uIGlzIG9ubHkgY2FsbGVkIGluIGVkaXRvci5cbiAgICAgKiAhI3poIOeUqOadpeWIneWni+WMlue7hOS7tuaIluiKgueCueeahOS4gOS6m+WxnuaAp++8jOW9k+ivpee7hOS7tuiiq+esrOS4gOasoea3u+WKoOWIsOiKgueCueS4iuaIlueUqOaIt+eCueWHu+S6huWug+eahCBSZXNldCDoj5zljZXml7bosIPnlKjjgILov5nkuKrlm57osIPlj6rkvJrlnKjnvJbovpHlmajkuIvosIPnlKjjgIJcbiAgICAgKiBAbWV0aG9kIHJlc2V0SW5FZGl0b3JcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgcmVzZXRJbkVkaXRvcjogbnVsbCxcblxuICAgIC8vIFBVQkxJQ1xuXG4gICAgLyoqXG4gICAgICogISNlbiBBZGRzIGEgY29tcG9uZW50IGNsYXNzIHRvIHRoZSBub2RlLiBZb3UgY2FuIGFsc28gYWRkIGNvbXBvbmVudCB0byBub2RlIGJ5IHBhc3NpbmcgaW4gdGhlIG5hbWUgb2YgdGhlIHNjcmlwdC5cbiAgICAgKiAhI3poIOWQkeiKgueCuea3u+WKoOS4gOS4que7hOS7tuexu++8jOS9oOi/mOWPr+S7pemAmui/h+S8oOWFpeiEmuacrOeahOWQjeensOadpea3u+WKoOe7hOS7tuOAglxuICAgICAqXG4gICAgICogQG1ldGhvZCBhZGRDb21wb25lbnRcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufFN0cmluZ30gdHlwZU9yQ2xhc3NOYW1lIC0gdGhlIGNvbnN0cnVjdG9yIG9yIHRoZSBjbGFzcyBuYW1lIG9mIHRoZSBjb21wb25lbnQgdG8gYWRkXG4gICAgICogQHJldHVybiB7Q29tcG9uZW50fSAtIHRoZSBuZXdseSBhZGRlZCBjb21wb25lbnRcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBzcHJpdGUgPSBub2RlLmFkZENvbXBvbmVudChjYy5TcHJpdGUpO1xuICAgICAqIHZhciB0ZXN0ID0gbm9kZS5hZGRDb21wb25lbnQoXCJUZXN0XCIpO1xuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogYWRkQ29tcG9uZW50PFQgZXh0ZW5kcyBDb21wb25lbnQ+KHR5cGU6IHtuZXcoKTogVH0pOiBUXG4gICAgICogYWRkQ29tcG9uZW50KGNsYXNzTmFtZTogc3RyaW5nKTogYW55XG4gICAgICovXG4gICAgYWRkQ29tcG9uZW50ICh0eXBlT3JDbGFzc05hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZS5hZGRDb21wb25lbnQodHlwZU9yQ2xhc3NOYW1lKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJldHVybnMgdGhlIGNvbXBvbmVudCBvZiBzdXBwbGllZCB0eXBlIGlmIHRoZSBub2RlIGhhcyBvbmUgYXR0YWNoZWQsIG51bGwgaWYgaXQgZG9lc24ndC48YnIvPlxuICAgICAqIFlvdSBjYW4gYWxzbyBnZXQgY29tcG9uZW50IGluIHRoZSBub2RlIGJ5IHBhc3NpbmcgaW4gdGhlIG5hbWUgb2YgdGhlIHNjcmlwdC5cbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W6IqC54K55LiK5oyH5a6a57G75Z6L55qE57uE5Lu277yM5aaC5p6c6IqC54K55pyJ6ZmE5Yqg5oyH5a6a57G75Z6L55qE57uE5Lu277yM5YiZ6L+U5Zue77yM5aaC5p6c5rKh5pyJ5YiZ5Li656m644CCPGJyLz5cbiAgICAgKiDkvKDlhaXlj4LmlbDkuZ/lj6/ku6XmmK/ohJrmnKznmoTlkI3np7DjgIJcbiAgICAgKlxuICAgICAqIEBtZXRob2QgZ2V0Q29tcG9uZW50XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxTdHJpbmd9IHR5cGVPckNsYXNzTmFtZVxuICAgICAqIEByZXR1cm4ge0NvbXBvbmVudH1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIC8vIGdldCBzcHJpdGUgY29tcG9uZW50LlxuICAgICAqIHZhciBzcHJpdGUgPSBub2RlLmdldENvbXBvbmVudChjYy5TcHJpdGUpO1xuICAgICAqIC8vIGdldCBjdXN0b20gdGVzdCBjYWxzcy5cbiAgICAgKiB2YXIgdGVzdCA9IG5vZGUuZ2V0Q29tcG9uZW50KFwiVGVzdFwiKTtcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGdldENvbXBvbmVudDxUIGV4dGVuZHMgQ29tcG9uZW50Pih0eXBlOiB7cHJvdG90eXBlOiBUfSk6IFRcbiAgICAgKiBnZXRDb21wb25lbnQoY2xhc3NOYW1lOiBzdHJpbmcpOiBhbnlcbiAgICAgKi9cbiAgICBnZXRDb21wb25lbnQgKHR5cGVPckNsYXNzTmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5ub2RlLmdldENvbXBvbmVudCh0eXBlT3JDbGFzc05hbWUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgYWxsIGNvbXBvbmVudHMgb2Ygc3VwcGxpZWQgVHlwZSBpbiB0aGUgbm9kZS5cbiAgICAgKiAhI3poIOi/lOWbnuiKgueCueS4iuaMh+Wumuexu+Wei+eahOaJgOaciee7hOS7tuOAglxuICAgICAqXG4gICAgICogQG1ldGhvZCBnZXRDb21wb25lbnRzXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxTdHJpbmd9IHR5cGVPckNsYXNzTmFtZVxuICAgICAqIEByZXR1cm4ge0NvbXBvbmVudFtdfVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIHNwcml0ZXMgPSBub2RlLmdldENvbXBvbmVudHMoY2MuU3ByaXRlKTtcbiAgICAgKiB2YXIgdGVzdHMgPSBub2RlLmdldENvbXBvbmVudHMoXCJUZXN0XCIpO1xuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZ2V0Q29tcG9uZW50czxUIGV4dGVuZHMgQ29tcG9uZW50Pih0eXBlOiB7cHJvdG90eXBlOiBUfSk6IFRbXVxuICAgICAqIGdldENvbXBvbmVudHMoY2xhc3NOYW1lOiBzdHJpbmcpOiBhbnlbXVxuICAgICAqL1xuICAgIGdldENvbXBvbmVudHMgKHR5cGVPckNsYXNzTmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5ub2RlLmdldENvbXBvbmVudHModHlwZU9yQ2xhc3NOYW1lKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHRoZSBjb21wb25lbnQgb2Ygc3VwcGxpZWQgdHlwZSBpbiBhbnkgb2YgaXRzIGNoaWxkcmVuIHVzaW5nIGRlcHRoIGZpcnN0IHNlYXJjaC5cbiAgICAgKiAhI3poIOmAkuW9kuafpeaJvuaJgOacieWtkOiKgueCueS4reesrOS4gOS4quWMuemFjeaMh+Wumuexu+Wei+eahOe7hOS7tuOAglxuICAgICAqXG4gICAgICogQG1ldGhvZCBnZXRDb21wb25lbnRJbkNoaWxkcmVuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxTdHJpbmd9IHR5cGVPckNsYXNzTmFtZVxuICAgICAqIEByZXR1cm5zIHtDb21wb25lbnR9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgc3ByaXRlID0gbm9kZS5nZXRDb21wb25lbnRJbkNoaWxkcmVuKGNjLlNwcml0ZSk7XG4gICAgICogdmFyIFRlc3QgPSBub2RlLmdldENvbXBvbmVudEluQ2hpbGRyZW4oXCJUZXN0XCIpO1xuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZ2V0Q29tcG9uZW50SW5DaGlsZHJlbjxUIGV4dGVuZHMgQ29tcG9uZW50Pih0eXBlOiB7cHJvdG90eXBlOiBUfSk6IFRcbiAgICAgKiBnZXRDb21wb25lbnRJbkNoaWxkcmVuKGNsYXNzTmFtZTogc3RyaW5nKTogYW55XG4gICAgICovXG4gICAgZ2V0Q29tcG9uZW50SW5DaGlsZHJlbiAodHlwZU9yQ2xhc3NOYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50SW5DaGlsZHJlbih0eXBlT3JDbGFzc05hbWUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgdGhlIGNvbXBvbmVudHMgb2Ygc3VwcGxpZWQgdHlwZSBpbiBzZWxmIG9yIGFueSBvZiBpdHMgY2hpbGRyZW4gdXNpbmcgZGVwdGggZmlyc3Qgc2VhcmNoLlxuICAgICAqICEjemgg6YCS5b2S5p+l5om+6Ieq6Lqr5oiW5omA5pyJ5a2Q6IqC54K55Lit5oyH5a6a57G75Z6L55qE57uE5Lu2XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGdldENvbXBvbmVudHNJbkNoaWxkcmVuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxTdHJpbmd9IHR5cGVPckNsYXNzTmFtZVxuICAgICAqIEByZXR1cm5zIHtDb21wb25lbnRbXX1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBzcHJpdGVzID0gbm9kZS5nZXRDb21wb25lbnRzSW5DaGlsZHJlbihjYy5TcHJpdGUpO1xuICAgICAqIHZhciB0ZXN0cyA9IG5vZGUuZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW4oXCJUZXN0XCIpO1xuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW48VCBleHRlbmRzIENvbXBvbmVudD4odHlwZToge3Byb3RvdHlwZTogVH0pOiBUW11cbiAgICAgKiBnZXRDb21wb25lbnRzSW5DaGlsZHJlbihjbGFzc05hbWU6IHN0cmluZyk6IGFueVtdXG4gICAgICovXG4gICAgZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW4gKHR5cGVPckNsYXNzTmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5ub2RlLmdldENvbXBvbmVudHNJbkNoaWxkcmVuKHR5cGVPckNsYXNzTmFtZSk7XG4gICAgfSxcblxuICAgIC8vIFZJUlRVQUxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBJZiB0aGUgY29tcG9uZW50J3MgYm91bmRpbmcgYm94IGlzIGRpZmZlcmVudCBmcm9tIHRoZSBub2RlJ3MsIHlvdSBjYW4gaW1wbGVtZW50IHRoaXMgbWV0aG9kIHRvIHN1cHBseVxuICAgICAqIGEgY3VzdG9tIGF4aXMgYWxpZ25lZCBib3VuZGluZyBib3ggKEFBQkIpLCBzbyB0aGUgZWRpdG9yJ3Mgc2NlbmUgdmlldyBjYW4gcGVyZm9ybSBoaXQgdGVzdCBwcm9wZXJseS5cbiAgICAgKiAhI3poXG4gICAgICog5aaC5p6c57uE5Lu255qE5YyF5Zu055uS5LiO6IqC54K55LiN5ZCM77yM5oKo5Y+v5Lul5a6e546w6K+l5pa55rOV5Lul5o+Q5L6b6Ieq5a6a5LmJ55qE6L205ZCR5a+56b2Q55qE5YyF5Zu055uS77yIQUFCQu+8ie+8jFxuICAgICAqIOS7peS+v+e8lui+keWZqOeahOWcuuaZr+inhuWbvuWPr+S7peato+ehruWcsOaJp+ihjOeCuemAiea1i+ivleOAglxuICAgICAqXG4gICAgICogQG1ldGhvZCBfZ2V0TG9jYWxCb3VuZHNcbiAgICAgKiBAcGFyYW0ge1JlY3R9IG91dF9yZWN0IC0gdGhlIFJlY3QgdG8gcmVjZWl2ZSB0aGUgYm91bmRpbmcgYm94XG4gICAgICovXG4gICAgX2dldExvY2FsQm91bmRzOiBudWxsLFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIG9uUmVzdG9yZSBpcyBjYWxsZWQgYWZ0ZXIgdGhlIHVzZXIgY2xpY2tzIHRoZSBSZXNldCBpdGVtIGluIHRoZSBJbnNwZWN0b3IncyBjb250ZXh0IG1lbnUgb3IgcGVyZm9ybXNcbiAgICAgKiBhbiB1bmRvIG9wZXJhdGlvbiBvbiB0aGlzIGNvbXBvbmVudC48YnIvPlxuICAgICAqIDxici8+XG4gICAgICogSWYgdGhlIGNvbXBvbmVudCBjb250YWlucyB0aGUgXCJpbnRlcm5hbCBzdGF0ZVwiLCBzaG9ydCBmb3IgXCJ0ZW1wb3JhcnkgbWVtYmVyIHZhcmlhYmxlcyB3aGljaCBub3QgaW5jbHVkZWQ8YnIvPlxuICAgICAqIGluIGl0cyBDQ0NsYXNzIHByb3BlcnRpZXNcIiwgdGhlbiB5b3UgbWF5IG5lZWQgdG8gaW1wbGVtZW50IHRoaXMgZnVuY3Rpb24uPGJyLz5cbiAgICAgKiA8YnIvPlxuICAgICAqIFRoZSBlZGl0b3Igd2lsbCBjYWxsIHRoZSBnZXRzZXQgYWNjZXNzb3JzIG9mIHlvdXIgY29tcG9uZW50IHRvIHJlY29yZC9yZXN0b3JlIHRoZSBjb21wb25lbnQncyBzdGF0ZTxici8+XG4gICAgICogZm9yIHVuZG8vcmVkbyBvcGVyYXRpb24uIEhvd2V2ZXIsIGluIGV4dHJlbWUgY2FzZXMsIGl0IG1heSBub3Qgd29ya3Mgd2VsbC4gVGhlbiB5b3Ugc2hvdWxkIGltcGxlbWVudDxici8+XG4gICAgICogdGhpcyBmdW5jdGlvbiB0byBtYW51YWxseSBzeW5jaHJvbml6ZSB5b3VyIGNvbXBvbmVudCdzIFwiaW50ZXJuYWwgc3RhdGVzXCIgd2l0aCBpdHMgcHVibGljIHByb3BlcnRpZXMuPGJyLz5cbiAgICAgKiBPbmNlIHlvdSBpbXBsZW1lbnQgdGhpcyBmdW5jdGlvbiwgYWxsIHRoZSBnZXRzZXQgYWNjZXNzb3JzIG9mIHlvdXIgY29tcG9uZW50IHdpbGwgbm90IGJlIGNhbGxlZCB3aGVuPGJyLz5cbiAgICAgKiB0aGUgdXNlciBwZXJmb3JtcyBhbiB1bmRvL3JlZG8gb3BlcmF0aW9uLiBXaGljaCBtZWFucyB0aGF0IG9ubHkgdGhlIHByb3BlcnRpZXMgd2l0aCBkZWZhdWx0IHZhbHVlPGJyLz5cbiAgICAgKiB3aWxsIGJlIHJlY29yZGVkIG9yIHJlc3RvcmVkIGJ5IGVkaXRvci48YnIvPlxuICAgICAqIDxici8+XG4gICAgICogU2ltaWxhcmx5LCB0aGUgZWRpdG9yIG1heSBmYWlsZWQgdG8gcmVzZXQgeW91ciBjb21wb25lbnQgY29ycmVjdGx5IGluIGV4dHJlbWUgY2FzZXMuIFRoZW4gaWYgeW91IG5lZWQ8YnIvPlxuICAgICAqIHRvIHN1cHBvcnQgdGhlIHJlc2V0IG1lbnUsIHlvdSBzaG91bGQgbWFudWFsbHkgc3luY2hyb25pemUgeW91ciBjb21wb25lbnQncyBcImludGVybmFsIHN0YXRlc1wiIHdpdGggaXRzPGJyLz5cbiAgICAgKiBwcm9wZXJ0aWVzIGluIHRoaXMgZnVuY3Rpb24uIE9uY2UgeW91IGltcGxlbWVudCB0aGlzIGZ1bmN0aW9uLCBhbGwgdGhlIGdldHNldCBhY2Nlc3NvcnMgb2YgeW91ciBjb21wb25lbnQ8YnIvPlxuICAgICAqIHdpbGwgbm90IGJlIGNhbGxlZCBkdXJpbmcgcmVzZXQgb3BlcmF0aW9uLiBXaGljaCBtZWFucyB0aGF0IG9ubHkgdGhlIHByb3BlcnRpZXMgd2l0aCBkZWZhdWx0IHZhbHVlPGJyLz5cbiAgICAgKiB3aWxsIGJlIHJlc2V0IGJ5IGVkaXRvci5cbiAgICAgKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gaXMgb25seSBjYWxsZWQgaW4gZWRpdG9yIG1vZGUuXG4gICAgICogISN6aFxuICAgICAqIG9uUmVzdG9yZSDmmK/nlKjmiLflnKjmo4Dmn6Xlmajoj5zljZXngrnlh7sgUmVzZXQg5pe277yM5a+55q2k57uE5Lu25omn6KGM5pKk5raI5pON5L2c5ZCO6LCD55So55qE44CCPGJyLz5cbiAgICAgKiA8YnIvPlxuICAgICAqIOWmguaenOe7hOS7tuWMheWQq+S6huKAnOWGhemDqOeKtuaAgeKAne+8iOS4jeWcqCBDQ0NsYXNzIOWxnuaAp+S4reWumuS5ieeahOS4tOaXtuaIkOWRmOWPmOmHj++8ie+8jOmCo+S5iOS9oOWPr+iDvemcgOimgeWunueOsOivpeaWueazleOAgjxici8+XG4gICAgICogPGJyLz5cbiAgICAgKiDnvJbovpHlmajmiafooYzmkqTplIAv6YeN5YGa5pON5L2c5pe277yM5bCG6LCD55So57uE5Lu255qEIGdldCBzZXQg5p2l5b2V5Yi25ZKM6L+Y5Y6f57uE5Lu255qE54q25oCB44CCXG4gICAgICog54S26ICM77yM5Zyo5p6B56uv55qE5oOF5Ya15LiL77yM5a6D5Y+v6IO95peg5rOV6Imv5aW96L+Q5L2c44CCPGJyLz5cbiAgICAgKiDpgqPkuYjkvaDlsLHlupTor6Xlrp7njrDov5nkuKrmlrnms5XvvIzmiYvliqjmoLnmja7nu4Tku7bnmoTlsZ7mgKflkIzmraXigJzlhoXpg6jnirbmgIHigJ3jgIJcbiAgICAgKiDkuIDml6bkvaDlrp7njrDov5nkuKrmlrnms5XvvIzlvZPnlKjmiLfmkqTplIDmiJbph43lgZrml7bvvIznu4Tku7bnmoTmiYDmnIkgZ2V0IHNldCDpg73kuI3kvJrlho3ooqvosIPnlKjjgIJcbiAgICAgKiDov5nmhI/lkbPnnYDku4Xku4XmjIflrprkuobpu5jorqTlgLznmoTlsZ7mgKflsIbooqvnvJbovpHlmajorrDlvZXlkozov5jljp/jgII8YnIvPlxuICAgICAqIDxici8+XG4gICAgICog5ZCM5qC355qE77yM57yW6L6R5Y+v6IO95peg5rOV5Zyo5p6B56uv5oOF5Ya15LiL5q2j56Gu5Zyw6YeN572u5oKo55qE57uE5Lu244CCPGJyLz5cbiAgICAgKiDkuo7mmK/lpoLmnpzkvaDpnIDopoHmlK/mjIHnu4Tku7bph43nva7oj5zljZXvvIzkvaDpnIDopoHlnKjor6Xmlrnms5XkuK3miYvlt6XlkIzmraXnu4Tku7blsZ7mgKfliLDigJzlhoXpg6jnirbmgIHigJ3jgII8YnIvPlxuICAgICAqIOS4gOaXpuS9oOWunueOsOi/meS4quaWueazle+8jOe7hOS7tueahOaJgOaciSBnZXQgc2V0IOmDveS4jeS8muWcqOmHjee9ruaTjeS9nOaXtuiiq+iwg+eUqOOAglxuICAgICAqIOi/meaEj+WRs+edgOS7heS7heaMh+WumuS6hum7mOiupOWAvOeahOWxnuaAp+Wwhuiiq+e8lui+keWZqOmHjee9ruOAglxuICAgICAqIDxici8+XG4gICAgICog5q2k5pa55rOV5LuF5Zyo57yW6L6R5Zmo5LiL5Lya6KKr6LCD55So44CCXG4gICAgICogQG1ldGhvZCBvblJlc3RvcmVcbiAgICAgKi9cbiAgICBvblJlc3RvcmU6IG51bGwsXG5cbiAgICAvLyBPVkVSUklERVxuXG4gICAgZGVzdHJveSAoKSB7XG4gICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHZhciBkZXBlbmQgPSB0aGlzLm5vZGUuX2dldERlcGVuZENvbXBvbmVudCh0aGlzKTtcbiAgICAgICAgICAgIGlmIChkZXBlbmQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2MuZXJyb3JJRCgzNjI2LFxuICAgICAgICAgICAgICAgICAgICBjYy5qcy5nZXRDbGFzc05hbWUodGhpcyksIGNjLmpzLmdldENsYXNzTmFtZShkZXBlbmQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fc3VwZXIoKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2VuYWJsZWQgJiYgdGhpcy5ub2RlLl9hY3RpdmVJbkhpZXJhcmNoeSkge1xuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLl9jb21wU2NoZWR1bGVyLmRpc2FibGVDb21wKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9vblByZURlc3Ryb3kgKCkge1xuICAgICAgICAvLyBTY2hlZHVsZXNcbiAgICAgICAgdGhpcy51bnNjaGVkdWxlQWxsQ2FsbGJhY2tzKCk7XG5cbiAgICAgICAgLy8gUmVtb3ZlIGFsbCBsaXN0ZW5lcnNcbiAgICAgICAgdmFyIGV2ZW50VGFyZ2V0cyA9IHRoaXMuX19ldmVudFRhcmdldHM7XG4gICAgICAgIGZvciAodmFyIGkgPSBldmVudFRhcmdldHMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSBldmVudFRhcmdldHNbaV07XG4gICAgICAgICAgICB0YXJnZXQgJiYgdGFyZ2V0LnRhcmdldE9mZih0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBldmVudFRhcmdldHMubGVuZ3RoID0gMDtcblxuICAgICAgICAvL1xuICAgICAgICBpZiAoQ0NfRURJVE9SICYmICFDQ19URVNUKSB7XG4gICAgICAgICAgICBfU2NlbmUuQXNzZXRzV2F0Y2hlci5zdG9wKHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gb25EZXN0cm95XG4gICAgICAgIGNjLmRpcmVjdG9yLl9ub2RlQWN0aXZhdG9yLmRlc3Ryb3lDb21wKHRoaXMpO1xuXG4gICAgICAgIC8vIGRvIHJlbW92ZSBjb21wb25lbnRcbiAgICAgICAgdGhpcy5ub2RlLl9yZW1vdmVDb21wb25lbnQodGhpcyk7XG4gICAgfSxcblxuICAgIF9pbnN0YW50aWF0ZSAoY2xvbmVkKSB7XG4gICAgICAgIGlmICghY2xvbmVkKSB7XG4gICAgICAgICAgICBjbG9uZWQgPSBjYy5pbnN0YW50aWF0ZS5fY2xvbmUodGhpcywgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgY2xvbmVkLm5vZGUgPSBudWxsO1xuICAgICAgICByZXR1cm4gY2xvbmVkO1xuICAgIH0sXG5cbi8vIFNjaGVkdWxlclxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNjaGVkdWxlcyBhIGN1c3RvbSBzZWxlY3Rvci48YnIvPlxuICAgICAqIElmIHRoZSBzZWxlY3RvciBpcyBhbHJlYWR5IHNjaGVkdWxlZCwgdGhlbiB0aGUgaW50ZXJ2YWwgcGFyYW1ldGVyIHdpbGwgYmUgdXBkYXRlZCB3aXRob3V0IHNjaGVkdWxpbmcgaXQgYWdhaW4uXG4gICAgICogISN6aFxuICAgICAqIOiwg+W6puS4gOS4quiHquWumuS5ieeahOWbnuiwg+WHveaVsOOAgjxici8+XG4gICAgICog5aaC5p6c5Zue6LCD5Ye95pWw5bey6LCD5bqm77yM6YKj5LmI5bCG5LiN5Lya6YeN5aSN6LCD5bqm5a6D77yM5Y+q5Lya5pu05paw5pe26Ze06Ze06ZqU5Y+C5pWw44CCXG4gICAgICogQG1ldGhvZCBzY2hlZHVsZVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIFRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbaW50ZXJ2YWw9MF0gIFRpY2sgaW50ZXJ2YWwgaW4gc2Vjb25kcy4gMCBtZWFucyB0aWNrIGV2ZXJ5IGZyYW1lLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbcmVwZWF0PWNjLm1hY3JvLlJFUEVBVF9GT1JFVkVSXSAgICBUaGUgc2VsZWN0b3Igd2lsbCBiZSBleGVjdXRlZCAocmVwZWF0ICsgMSkgdGltZXMsIHlvdSBjYW4gdXNlIGNjLm1hY3JvLlJFUEVBVF9GT1JFVkVSIGZvciB0aWNrIGluZmluaXRlbHkuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtkZWxheT0wXSAgICAgVGhlIGFtb3VudCBvZiB0aW1lIHRoYXQgdGhlIGZpcnN0IHRpY2sgd2lsbCB3YWl0IGJlZm9yZSBleGVjdXRpb24uIFVuaXQ6IHNcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciB0aW1lQ2FsbGJhY2sgPSBmdW5jdGlvbiAoZHQpIHtcbiAgICAgKiAgIGNjLmxvZyhcInRpbWU6IFwiICsgZHQpO1xuICAgICAqIH1cbiAgICAgKiB0aGlzLnNjaGVkdWxlKHRpbWVDYWxsYmFjaywgMSk7XG4gICAgICovXG4gICAgc2NoZWR1bGUgKGNhbGxiYWNrLCBpbnRlcnZhbCwgcmVwZWF0LCBkZWxheSkge1xuICAgICAgICBjYy5hc3NlcnRJRChjYWxsYmFjaywgMTYxOSk7XG5cbiAgICAgICAgaW50ZXJ2YWwgPSBpbnRlcnZhbCB8fCAwO1xuICAgICAgICBjYy5hc3NlcnRJRChpbnRlcnZhbCA+PSAwLCAxNjIwKTtcblxuICAgICAgICByZXBlYXQgPSBpc05hTihyZXBlYXQpID8gY2MubWFjcm8uUkVQRUFUX0ZPUkVWRVIgOiByZXBlYXQ7XG4gICAgICAgIGRlbGF5ID0gZGVsYXkgfHwgMDtcblxuICAgICAgICB2YXIgc2NoZWR1bGVyID0gY2MuZGlyZWN0b3IuZ2V0U2NoZWR1bGVyKCk7XG5cbiAgICAgICAgLy8gc2hvdWxkIG5vdCB1c2UgZW5hYmxlZEluSGllcmFyY2h5IHRvIGp1ZGdlIHdoZXRoZXIgcGF1c2VkLFxuICAgICAgICAvLyBiZWNhdXNlIGVuYWJsZWRJbkhpZXJhcmNoeSBpcyBhc3NpZ25lZCBhZnRlciBvbkVuYWJsZS5cbiAgICAgICAgLy8gQWN0dWFsbHksIGlmIG5vdCB5ZXQgc2NoZWR1bGVkLCByZXN1bWVUYXJnZXQvcGF1c2VUYXJnZXQgaGFzIG5vIGVmZmVjdCBvbiBjb21wb25lbnQsXG4gICAgICAgIC8vIHRoZXJlZm9yZSB0aGVyZSBpcyBubyB3YXkgdG8gZ3VhcmFudGVlIHRoZSBwYXVzZWQgc3RhdGUgb3RoZXIgdGhhbiBpc1RhcmdldFBhdXNlZC5cbiAgICAgICAgdmFyIHBhdXNlZCA9IHNjaGVkdWxlci5pc1RhcmdldFBhdXNlZCh0aGlzKTtcblxuICAgICAgICBzY2hlZHVsZXIuc2NoZWR1bGUoY2FsbGJhY2ssIHRoaXMsIGludGVydmFsLCByZXBlYXQsIGRlbGF5LCBwYXVzZWQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNjaGVkdWxlcyBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgcnVucyBvbmx5IG9uY2UsIHdpdGggYSBkZWxheSBvZiAwIG9yIGxhcmdlci5cbiAgICAgKiAhI3poIOiwg+W6puS4gOS4quWPqui/kOihjOS4gOasoeeahOWbnuiwg+WHveaVsO+8jOWPr+S7peaMh+WumiAwIOiuqeWbnuiwg+WHveaVsOWcqOS4i+S4gOW4p+eri+WNs+aJp+ihjOaIluiAheWcqOS4gOWumueahOW7tuaXtuS5i+WQjuaJp+ihjOOAglxuICAgICAqIEBtZXRob2Qgc2NoZWR1bGVPbmNlXG4gICAgICogQHNlZSBjYy5Ob2RlI3NjaGVkdWxlXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgIEEgZnVuY3Rpb24gd3JhcHBlZCBhcyBhIHNlbGVjdG9yXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtkZWxheT0wXSAgVGhlIGFtb3VudCBvZiB0aW1lIHRoYXQgdGhlIGZpcnN0IHRpY2sgd2lsbCB3YWl0IGJlZm9yZSBleGVjdXRpb24uIFVuaXQ6IHNcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciB0aW1lQ2FsbGJhY2sgPSBmdW5jdGlvbiAoZHQpIHtcbiAgICAgKiAgIGNjLmxvZyhcInRpbWU6IFwiICsgZHQpO1xuICAgICAqIH1cbiAgICAgKiB0aGlzLnNjaGVkdWxlT25jZSh0aW1lQ2FsbGJhY2ssIDIpO1xuICAgICAqL1xuICAgIHNjaGVkdWxlT25jZSAoY2FsbGJhY2ssIGRlbGF5KSB7XG4gICAgICAgIHRoaXMuc2NoZWR1bGUoY2FsbGJhY2ssIDAsIDAsIGRlbGF5KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBVbnNjaGVkdWxlcyBhIGN1c3RvbSBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICAgKiAhI3poIOWPlua2iOiwg+W6puS4gOS4quiHquWumuS5ieeahOWbnuiwg+WHveaVsOOAglxuICAgICAqIEBtZXRob2QgdW5zY2hlZHVsZVxuICAgICAqIEBzZWUgY2MuTm9kZSNzY2hlZHVsZVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrX2ZuICBBIGZ1bmN0aW9uIHdyYXBwZWQgYXMgYSBzZWxlY3RvclxuICAgICAqIEBleGFtcGxlXG4gICAgICogdGhpcy51bnNjaGVkdWxlKF9jYWxsYmFjayk7XG4gICAgICovXG4gICAgdW5zY2hlZHVsZSAoY2FsbGJhY2tfZm4pIHtcbiAgICAgICAgaWYgKCFjYWxsYmFja19mbilcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBjYy5kaXJlY3Rvci5nZXRTY2hlZHVsZXIoKS51bnNjaGVkdWxlKGNhbGxiYWNrX2ZuLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIHVuc2NoZWR1bGUgYWxsIHNjaGVkdWxlZCBjYWxsYmFjayBmdW5jdGlvbnM6IGN1c3RvbSBjYWxsYmFjayBmdW5jdGlvbnMsIGFuZCB0aGUgJ3VwZGF0ZScgY2FsbGJhY2sgZnVuY3Rpb24uPGJyLz5cbiAgICAgKiBBY3Rpb25zIGFyZSBub3QgYWZmZWN0ZWQgYnkgdGhpcyBtZXRob2QuXG4gICAgICogISN6aCDlj5bmtojosIPluqbmiYDmnInlt7LosIPluqbnmoTlm57osIPlh73mlbDvvJrlrprliLbnmoTlm57osIPlh73mlbDku6Xlj4ogJ3VwZGF0ZScg5Zue6LCD5Ye95pWw44CC5Yqo5L2c5LiN5Y+X5q2k5pa55rOV5b2x5ZON44CCXG4gICAgICogQG1ldGhvZCB1bnNjaGVkdWxlQWxsQ2FsbGJhY2tzXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB0aGlzLnVuc2NoZWR1bGVBbGxDYWxsYmFja3MoKTtcbiAgICAgKi9cbiAgICB1bnNjaGVkdWxlQWxsQ2FsbGJhY2tzICgpIHtcbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NoZWR1bGVyKCkudW5zY2hlZHVsZUFsbEZvclRhcmdldCh0aGlzKTtcbiAgICB9LFxufSk7XG5cbkNvbXBvbmVudC5fcmVxdWlyZUNvbXBvbmVudCA9IG51bGw7XG5Db21wb25lbnQuX2V4ZWN1dGlvbk9yZGVyID0gMDtcblxuaWYgKENDX0VESVRPUiB8fCBDQ19URVNUKSB7XG5cbiAgICAvLyBJTkhFUklUQUJMRSBTVEFUSUMgTUVNQkVSU1xuXG4gICAgQ29tcG9uZW50Ll9leGVjdXRlSW5FZGl0TW9kZSA9IGZhbHNlO1xuICAgIENvbXBvbmVudC5fcGxheU9uRm9jdXMgPSBmYWxzZTtcbiAgICBDb21wb25lbnQuX2Rpc2FsbG93TXVsdGlwbGUgPSBudWxsO1xuICAgIENvbXBvbmVudC5faGVscCA9ICcnO1xuXG4gICAgLy8gTk9OLUlOSEVSSVRFRCBTVEFUSUMgTUVNQkVSU1xuICAgIC8vIChUeXBlU2NyaXB0IDIuMyB3aWxsIHN0aWxsIGluaGVyaXQgdGhlbSwgc28gYWx3YXlzIGNoZWNrIGhhc093blByb3BlcnR5IGJlZm9yZSB1c2luZylcblxuICAgIGpzLnZhbHVlKENvbXBvbmVudCwgJ19pbnNwZWN0b3InLCAnJywgdHJ1ZSk7XG4gICAganMudmFsdWUoQ29tcG9uZW50LCAnX2ljb24nLCAnJywgdHJ1ZSk7XG5cbiAgICAvLyBDT01QT05FTlQgSEVMUEVSU1xuXG4gICAgY2MuX2NvbXBvbmVudE1lbnVJdGVtcyA9IFtdO1xuXG4gICAgQ29tcG9uZW50Ll9hZGRNZW51SXRlbSA9IGZ1bmN0aW9uIChjbHMsIHBhdGgsIHByaW9yaXR5KSB7XG4gICAgICAgIGNjLl9jb21wb25lbnRNZW51SXRlbXMucHVzaCh7XG4gICAgICAgICAgICBjb21wb25lbnQ6IGNscyxcbiAgICAgICAgICAgIG1lbnVQYXRoOiBwYXRoLFxuICAgICAgICAgICAgcHJpb3JpdHk6IHByaW9yaXR5XG4gICAgICAgIH0pO1xuICAgIH07XG59XG5cbi8vIHdlIG1ha2UgdGhpcyBub24tZW51bWVyYWJsZSwgdG8gcHJldmVudCBpbmhlcml0ZWQgYnkgc3ViIGNsYXNzZXMuXG5qcy52YWx1ZShDb21wb25lbnQsICdfcmVnaXN0ZXJFZGl0b3JQcm9wcycsIGZ1bmN0aW9uIChjbHMsIHByb3BzKSB7XG4gICAgdmFyIHJlcUNvbXAgPSBwcm9wcy5yZXF1aXJlQ29tcG9uZW50O1xuICAgIGlmIChyZXFDb21wKSB7XG4gICAgICAgIGNscy5fcmVxdWlyZUNvbXBvbmVudCA9IHJlcUNvbXA7XG4gICAgfVxuICAgIHZhciBvcmRlciA9IHByb3BzLmV4ZWN1dGlvbk9yZGVyO1xuICAgIGlmIChvcmRlciAmJiB0eXBlb2Ygb3JkZXIgPT09ICdudW1iZXInKSB7XG4gICAgICAgIGNscy5fZXhlY3V0aW9uT3JkZXIgPSBvcmRlcjtcbiAgICB9XG4gICAgaWYgKENDX0VESVRPUiB8fCBDQ19URVNUKSB7XG4gICAgICAgIHZhciBuYW1lID0gY2MuanMuZ2V0Q2xhc3NOYW1lKGNscyk7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wcykge1xuICAgICAgICAgICAgdmFyIHZhbCA9IHByb3BzW2tleV07XG4gICAgICAgICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2V4ZWN1dGVJbkVkaXRNb2RlJzpcbiAgICAgICAgICAgICAgICAgICAgY2xzLl9leGVjdXRlSW5FZGl0TW9kZSA9ICEhdmFsO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ3BsYXlPbkZvY3VzJzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHdpbGxFeGVjdXRlSW5FZGl0TW9kZSA9ICgnZXhlY3V0ZUluRWRpdE1vZGUnIGluIHByb3BzKSA/IHByb3BzLmV4ZWN1dGVJbkVkaXRNb2RlIDogY2xzLl9leGVjdXRlSW5FZGl0TW9kZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aWxsRXhlY3V0ZUluRWRpdE1vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbHMuX3BsYXlPbkZvY3VzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLndhcm5JRCgzNjAxLCBuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2luc3BlY3Rvcic6XG4gICAgICAgICAgICAgICAgICAgIGpzLnZhbHVlKGNscywgJ19pbnNwZWN0b3InLCB2YWwsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2ljb24nOlxuICAgICAgICAgICAgICAgICAgICBqcy52YWx1ZShjbHMsICdfaWNvbicsIHZhbCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnbWVudSc6XG4gICAgICAgICAgICAgICAgICAgIENvbXBvbmVudC5fYWRkTWVudUl0ZW0oY2xzLCB2YWwsIHByb3BzLm1lbnVQcmlvcml0eSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnZGlzYWxsb3dNdWx0aXBsZSc6XG4gICAgICAgICAgICAgICAgICAgIGNscy5fZGlzYWxsb3dNdWx0aXBsZSA9IGNscztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdyZXF1aXJlQ29tcG9uZW50JzpcbiAgICAgICAgICAgICAgICBjYXNlICdleGVjdXRpb25PcmRlcic6XG4gICAgICAgICAgICAgICAgICAgIC8vIHNraXAgaGVyZVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2hlbHAnOlxuICAgICAgICAgICAgICAgICAgICBjbHMuX2hlbHAgPSB2YWw7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgY2Mud2FybklEKDM2MDIsIGtleSwgbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbkNvbXBvbmVudC5wcm90b3R5cGUuX19zY3JpcHRVdWlkID0gJyc7XG5cbmNjLkNvbXBvbmVudCA9IG1vZHVsZS5leHBvcnRzID0gQ29tcG9uZW50O1xuIl19