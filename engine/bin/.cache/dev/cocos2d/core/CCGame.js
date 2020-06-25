
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/CCGame.js';
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
var EventTarget = require('./event/event-target');

require('../audio/CCAudioEngine');

var debug = require('./CCDebug');

var renderer = require('./renderer/index.js');

var dynamicAtlasManager = require('../core/renderer/utils/dynamic-atlas/manager');
/**
 * @module cc
 */

/**
 * !#en An object to boot the game.
 * !#zh 包含游戏主体信息并负责驱动游戏的游戏对象。
 * @class Game
 * @extends EventTarget
 */


var game = {
  /**
   * !#en Event triggered when game hide to background.
   * Please note that this event is not 100% guaranteed to be fired on Web platform,
   * on native platforms, it corresponds to enter background event, os status bar or notification center may not trigger this event.
   * !#zh 游戏进入后台时触发的事件。
   * 请注意，在 WEB 平台，这个事件不一定会 100% 触发，这完全取决于浏览器的回调行为。
   * 在原生平台，它对应的是应用被切换到后台事件，下拉菜单和上拉状态栏等不一定会触发这个事件，这取决于系统行为。
   * @property EVENT_HIDE
   * @type {String}
   * @example
   * cc.game.on(cc.game.EVENT_HIDE, function () {
   *     cc.audioEngine.pauseMusic();
   *     cc.audioEngine.pauseAllEffects();
   * });
   */
  EVENT_HIDE: "game_on_hide",

  /**
   * !#en Event triggered when game back to foreground
   * Please note that this event is not 100% guaranteed to be fired on Web platform,
   * on native platforms, it corresponds to enter foreground event.
   * !#zh 游戏进入前台运行时触发的事件。
   * 请注意，在 WEB 平台，这个事件不一定会 100% 触发，这完全取决于浏览器的回调行为。
   * 在原生平台，它对应的是应用被切换到前台事件。
   * @property EVENT_SHOW
   * @constant
   * @type {String}
   */
  EVENT_SHOW: "game_on_show",

  /**
   * !#en Event triggered when game restart
   * !#zh 调用restart后，触发事件。
   * @property EVENT_RESTART
   * @constant
   * @type {String}
   */
  EVENT_RESTART: "game_on_restart",

  /**
   * Event triggered after game inited, at this point all engine objects and game scripts are loaded
   * @property EVENT_GAME_INITED
   * @constant
   * @type {String}
   */
  EVENT_GAME_INITED: "game_inited",

  /**
   * Event triggered after engine inited, at this point you will be able to use all engine classes. 
   * It was defined as EVENT_RENDERER_INITED in cocos creator v1.x and renamed in v2.0
   * @property EVENT_ENGINE_INITED
   * @constant
   * @type {String}
   */
  EVENT_ENGINE_INITED: "engine_inited",
  // deprecated
  EVENT_RENDERER_INITED: "engine_inited",

  /**
   * Web Canvas 2d API as renderer backend
   * @property RENDER_TYPE_CANVAS
   * @constant
   * @type {Number}
   */
  RENDER_TYPE_CANVAS: 0,

  /**
   * WebGL API as renderer backend
   * @property RENDER_TYPE_WEBGL
   * @constant
   * @type {Number}
   */
  RENDER_TYPE_WEBGL: 1,

  /**
   * OpenGL API as renderer backend
   * @property RENDER_TYPE_OPENGL
   * @constant
   * @type {Number}
   */
  RENDER_TYPE_OPENGL: 2,
  _persistRootNodes: {},
  // states
  _paused: true,
  //whether the game is paused
  _configLoaded: false,
  //whether config loaded
  _isCloning: false,
  // deserializing or instantiating
  _prepared: false,
  //whether the engine has prepared
  _rendererInitialized: false,
  _renderContext: null,
  _intervalId: null,
  //interval target of main
  _lastTime: null,
  _frameTime: null,
  // Scenes list
  _sceneInfos: [],

  /**
   * !#en The outer frame of the game canvas, parent of game container.
   * !#zh 游戏画布的外框，container 的父容器。
   * @property frame
   * @type {Object}
   */
  frame: null,

  /**
   * !#en The container of game canvas.
   * !#zh 游戏画布的容器。
   * @property container
   * @type {HTMLDivElement}
   */
  container: null,

  /**
   * !#en The canvas of the game.
   * !#zh 游戏的画布。
   * @property canvas
   * @type {HTMLCanvasElement}
   */
  canvas: null,

  /**
   * !#en The renderer backend of the game.
   * !#zh 游戏的渲染器类型。
   * @property renderType
   * @type {Number}
   */
  renderType: -1,

  /**
   * !#en
   * The current game configuration, including:<br/>
   * 1. debugMode<br/>
   *      "debugMode" possible values :<br/>
   *      0 - No message will be printed.                                                      <br/>
   *      1 - cc.error, cc.assert, cc.warn, cc.log will print in console.                      <br/>
   *      2 - cc.error, cc.assert, cc.warn will print in console.                              <br/>
   *      3 - cc.error, cc.assert will print in console.                                       <br/>
   *      4 - cc.error, cc.assert, cc.warn, cc.log will print on canvas, available only on web.<br/>
   *      5 - cc.error, cc.assert, cc.warn will print on canvas, available only on web.        <br/>
   *      6 - cc.error, cc.assert will print on canvas, available only on web.                 <br/>
   * 2. showFPS<br/>
   *      Left bottom corner fps information will show when "showFPS" equals true, otherwise it will be hide.<br/>
   * 3. exposeClassName<br/>
   *      Expose class name to chrome debug tools, the class intantiate performance is a little bit slower when exposed.<br/>
   * 4. frameRate<br/>
   *      "frameRate" set the wanted frame rate for your game, but the real fps depends on your game implementation and the running environment.<br/>
   * 5. id<br/>
   *      "gameCanvas" sets the id of your canvas element on the web page, it's useful only on web.<br/>
   * 6. renderMode<br/>
   *      "renderMode" sets the renderer type, only useful on web :<br/>
   *      0 - Automatically chosen by engine<br/>
   *      1 - Forced to use canvas renderer<br/>
   *      2 - Forced to use WebGL renderer, but this will be ignored on mobile browsers<br/>
   * 7. scenes<br/>
   *      "scenes" include available scenes in the current bundle.<br/>
   *<br/>
   * Please DO NOT modify this object directly, it won't have any effect.<br/>
   * !#zh
   * 当前的游戏配置，包括：                                                                  <br/>
   * 1. debugMode（debug 模式，但是在浏览器中这个选项会被忽略）                                <br/>
   *      "debugMode" 各种设置选项的意义。                                                   <br/>
   *          0 - 没有消息被打印出来。                                                       <br/>
   *          1 - cc.error，cc.assert，cc.warn，cc.log 将打印在 console 中。                  <br/>
   *          2 - cc.error，cc.assert，cc.warn 将打印在 console 中。                          <br/>
   *          3 - cc.error，cc.assert 将打印在 console 中。                                   <br/>
   *          4 - cc.error，cc.assert，cc.warn，cc.log 将打印在 canvas 中（仅适用于 web 端）。 <br/>
   *          5 - cc.error，cc.assert，cc.warn 将打印在 canvas 中（仅适用于 web 端）。         <br/>
   *          6 - cc.error，cc.assert 将打印在 canvas 中（仅适用于 web 端）。                  <br/>
   * 2. showFPS（显示 FPS）                                                            <br/>
   *      当 showFPS 为 true 的时候界面的左下角将显示 fps 的信息，否则被隐藏。              <br/>
   * 3. exposeClassName                                                           <br/>
   *      暴露类名让 Chrome DevTools 可以识别，如果开启会稍稍降低类的创建过程的性能，但对对象构造没有影响。 <br/>
   * 4. frameRate (帧率)                                                              <br/>
   *      “frameRate” 设置想要的帧率你的游戏，但真正的FPS取决于你的游戏实现和运行环境。      <br/>
   * 5. id                                                                            <br/>
   *      "gameCanvas" Web 页面上的 Canvas Element ID，仅适用于 web 端。                         <br/>
   * 6. renderMode（渲染模式）                                                         <br/>
   *      “renderMode” 设置渲染器类型，仅适用于 web 端：                              <br/>
   *          0 - 通过引擎自动选择。                                                     <br/>
   *          1 - 强制使用 canvas 渲染。
   *          2 - 强制使用 WebGL 渲染，但是在部分 Android 浏览器中这个选项会被忽略。     <br/>
   * 7. scenes                                                                         <br/>
   *      “scenes” 当前包中可用场景。                                                   <br/>
   * <br/>
   * 注意：请不要直接修改这个对象，它不会有任何效果。
   * @property config
   * @type {Object}
   */
  config: null,

  /**
   * !#en Callback when the scripts of engine have been load.
   * !#zh 当引擎完成启动后的回调函数。
   * @method onStart
   * @type {Function}
   */
  onStart: null,
  //@Public Methods
  //  @Game play control

  /**
   * !#en Set frame rate of game.
   * !#zh 设置游戏帧率。
   * @method setFrameRate
   * @param {Number} frameRate
   */
  setFrameRate: function setFrameRate(frameRate) {
    var config = this.config;
    config.frameRate = frameRate;
    if (this._intervalId) window.cancelAnimFrame(this._intervalId);
    this._intervalId = 0;
    this._paused = true;

    this._setAnimFrame();

    this._runMainLoop();
  },

  /**
   * !#en Get frame rate set for the game, it doesn't represent the real frame rate.
   * !#zh 获取设置的游戏帧率（不等同于实际帧率）。
   * @method getFrameRate
   * @return {Number} frame rate
   */
  getFrameRate: function getFrameRate() {
    return this.config.frameRate;
  },

  /**
   * !#en Run the game frame by frame.
   * !#zh 执行一帧游戏循环。
   * @method step
   */
  step: function step() {
    cc.director.mainLoop();
  },

  /**
   * !#en Pause the game main loop. This will pause:
   * game logic execution, rendering process, event manager, background music and all audio effects.
   * This is different with cc.director.pause which only pause the game logic execution.
   * !#zh 暂停游戏主循环。包含：游戏逻辑，渲染，事件处理，背景音乐和所有音效。这点和只暂停游戏逻辑的 cc.director.pause 不同。
   * @method pause
   */
  pause: function pause() {
    if (this._paused) return;
    this._paused = true; // Pause audio engine

    if (cc.audioEngine) {
      cc.audioEngine._break();
    } // Pause main loop


    if (this._intervalId) window.cancelAnimFrame(this._intervalId);
    this._intervalId = 0;
  },

  /**
   * !#en Resume the game from pause. This will resume:
   * game logic execution, rendering process, event manager, background music and all audio effects.
   * !#zh 恢复游戏主循环。包含：游戏逻辑，渲染，事件处理，背景音乐和所有音效。
   * @method resume
   */
  resume: function resume() {
    if (!this._paused) return;
    this._paused = false; // Resume audio engine

    if (cc.audioEngine) {
      cc.audioEngine._restore();
    }

    cc.director._resetDeltaTime(); // Resume main loop


    this._runMainLoop();
  },

  /**
   * !#en Check whether the game is paused.
   * !#zh 判断游戏是否暂停。
   * @method isPaused
   * @return {Boolean}
   */
  isPaused: function isPaused() {
    return this._paused;
  },

  /**
   * !#en Restart game.
   * !#zh 重新开始游戏
   * @method restart
   */
  restart: function restart() {
    cc.director.once(cc.Director.EVENT_AFTER_DRAW, function () {
      for (var id in game._persistRootNodes) {
        game.removePersistRootNode(game._persistRootNodes[id]);
      } // Clear scene


      cc.director.getScene().destroy();

      cc.Object._deferredDestroy(); // Clean up audio


      if (cc.audioEngine) {
        cc.audioEngine.uncacheAll();
      }

      cc.director.reset();
      game.pause();

      cc.AssetLibrary._loadBuiltins(function () {
        game.onStart();
        game.emit(game.EVENT_RESTART);
      });
    });
  },

  /**
   * !#en End game, it will close the game window
   * !#zh 退出游戏
   * @method end
   */
  end: function end() {
    close();
  },
  //  @Game loading
  _initEngine: function _initEngine() {
    if (this._rendererInitialized) {
      return;
    }

    this._initRenderer();

    if (!CC_EDITOR) {
      this._initEvents();
    }

    this.emit(this.EVENT_ENGINE_INITED);
  },
  _loadPreviewScript: function _loadPreviewScript(cb) {
    if (CC_PREVIEW && window.__quick_compile_project__) {
      window.__quick_compile_project__.load(cb);
    } else {
      cb();
    }
  },
  _prepareFinished: function _prepareFinished(cb) {
    var _this = this;

    // Init engine
    this._initEngine();

    this._setAnimFrame();

    cc.AssetLibrary._loadBuiltins(function () {
      // Log engine version
      console.log('Cocos Creator v' + cc.ENGINE_VERSION);
      _this._prepared = true;

      _this._runMainLoop();

      _this.emit(_this.EVENT_GAME_INITED);

      if (cb) cb();
    });
  },
  eventTargetOn: EventTarget.prototype.on,
  eventTargetOnce: EventTarget.prototype.once,

  /**
   * !#en
   * Register an callback of a specific event type on the game object.
   * This type of event should be triggered via `emit`.
   * !#zh
   * 注册 game 的特定事件类型回调。这种类型的事件应该被 `emit` 触发。
   *
   * @method on
   * @param {String} type - A string representing the event type to listen for.
   * @param {Function} callback - The callback that will be invoked when the event is dispatched.
   *                              The callback is ignored if it is a duplicate (the callbacks are unique).
   * @param {any} [callback.arg1] arg1
   * @param {any} [callback.arg2] arg2
   * @param {any} [callback.arg3] arg3
   * @param {any} [callback.arg4] arg4
   * @param {any} [callback.arg5] arg5
   * @param {Object} [target] - The target (this object) to invoke the callback, can be null
   * @return {Function} - Just returns the incoming callback so you can save the anonymous function easier.
   * @typescript
   * on<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T
   */
  on: function on(type, callback, target, once) {
    // Make sure EVENT_ENGINE_INITED and EVENT_GAME_INITED callbacks to be invoked
    if (this._prepared && type === this.EVENT_ENGINE_INITED || !this._paused && type === this.EVENT_GAME_INITED) {
      callback.call(target);
    } else {
      this.eventTargetOn(type, callback, target, once);
    }
  },

  /**
   * !#en
   * Register an callback of a specific event type on the game object,
   * the callback will remove itself after the first time it is triggered.
   * !#zh
   * 注册 game 的特定事件类型回调，回调会在第一时间被触发后删除自身。
   *
   * @method once
   * @param {String} type - A string representing the event type to listen for.
   * @param {Function} callback - The callback that will be invoked when the event is dispatched.
   *                              The callback is ignored if it is a duplicate (the callbacks are unique).
   * @param {any} [callback.arg1] arg1
   * @param {any} [callback.arg2] arg2
   * @param {any} [callback.arg3] arg3
   * @param {any} [callback.arg4] arg4
   * @param {any} [callback.arg5] arg5
   * @param {Object} [target] - The target (this object) to invoke the callback, can be null
   */
  once: function once(type, callback, target) {
    // Make sure EVENT_ENGINE_INITED and EVENT_GAME_INITED callbacks to be invoked
    if (this._prepared && type === this.EVENT_ENGINE_INITED || !this._paused && type === this.EVENT_GAME_INITED) {
      callback.call(target);
    } else {
      this.eventTargetOnce(type, callback, target);
    }
  },

  /**
   * !#en Prepare game.
   * !#zh 准备引擎，请不要直接调用这个函数。
   * @param {Function} cb
   * @method prepare
   */
  prepare: function prepare(cb) {
    var _this2 = this;

    // Already prepared
    if (this._prepared) {
      if (cb) cb();
      return;
    } // Load game scripts


    var jsList = this.config.jsList;

    if (jsList && jsList.length > 0) {
      cc.loader.load(jsList, function (err) {
        if (err) throw new Error(JSON.stringify(err));

        _this2._loadPreviewScript(function () {
          _this2._prepareFinished(cb);
        });
      });
    } else {
      this._loadPreviewScript(function () {
        _this2._prepareFinished(cb);
      });
    }
  },

  /**
   * !#en Run game with configuration object and onStart function.
   * !#zh 运行游戏，并且指定引擎配置和 onStart 的回调。
   * @method run
   * @param {Object} config - Pass configuration object or onStart function
   * @param {Function} onStart - function to be executed after game initialized
   */
  run: function run(config, onStart) {
    this._initConfig(config);

    this.onStart = onStart;
    this.prepare(game.onStart && game.onStart.bind(game));
  },
  //  @ Persist root node section

  /**
   * !#en
   * Add a persistent root node to the game, the persistent node won't be destroyed during scene transition.<br/>
   * The target node must be placed in the root level of hierarchy, otherwise this API won't have any effect.
   * !#zh
   * 声明常驻根节点，该节点不会被在场景切换中被销毁。<br/>
   * 目标节点必须位于为层级的根节点，否则无效。
   * @method addPersistRootNode
   * @param {Node} node - The node to be made persistent
   */
  addPersistRootNode: function addPersistRootNode(node) {
    if (!cc.Node.isNode(node) || !node.uuid) {
      cc.warnID(3800);
      return;
    }

    var id = node.uuid;

    if (!this._persistRootNodes[id]) {
      var scene = cc.director._scene;

      if (cc.isValid(scene)) {
        if (!node.parent) {
          node.parent = scene;
        } else if (!(node.parent instanceof cc.Scene)) {
          cc.warnID(3801);
          return;
        } else if (node.parent !== scene) {
          cc.warnID(3802);
          return;
        }
      }

      this._persistRootNodes[id] = node;
      node._persistNode = true;
    }
  },

  /**
   * !#en Remove a persistent root node.
   * !#zh 取消常驻根节点。
   * @method removePersistRootNode
   * @param {Node} node - The node to be removed from persistent node list
   */
  removePersistRootNode: function removePersistRootNode(node) {
    var id = node.uuid || '';

    if (node === this._persistRootNodes[id]) {
      delete this._persistRootNodes[id];
      node._persistNode = false;
    }
  },

  /**
   * !#en Check whether the node is a persistent root node.
   * !#zh 检查节点是否是常驻根节点。
   * @method isPersistRootNode
   * @param {Node} node - The node to be checked
   * @return {Boolean}
   */
  isPersistRootNode: function isPersistRootNode(node) {
    return node._persistNode;
  },
  //@Private Methods
  //  @Time ticker section
  _setAnimFrame: function _setAnimFrame() {
    this._lastTime = performance.now();
    var frameRate = game.config.frameRate;
    this._frameTime = 1000 / frameRate;
    cc.director._maxParticleDeltaTime = this._frameTime / 1000 * 2;

    if (CC_JSB || CC_RUNTIME) {
      jsb.setPreferredFramesPerSecond(frameRate);
      window.requestAnimFrame = window.requestAnimationFrame;
      window.cancelAnimFrame = window.cancelAnimationFrame;
    } else {
      if (frameRate !== 60 && frameRate !== 30) {
        window.requestAnimFrame = this._stTime;
        window.cancelAnimFrame = this._ctTime;
      } else {
        window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || this._stTime;
        window.cancelAnimFrame = window.cancelAnimationFrame || window.cancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.webkitCancelRequestAnimationFrame || window.msCancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.oCancelAnimationFrame || this._ctTime;
      }
    }
  },
  _stTime: function _stTime(callback) {
    var currTime = performance.now();
    var timeToCall = Math.max(0, game._frameTime - (currTime - game._lastTime));
    var id = window.setTimeout(function () {
      callback();
    }, timeToCall);
    game._lastTime = currTime + timeToCall;
    return id;
  },
  _ctTime: function _ctTime(id) {
    window.clearTimeout(id);
  },
  //Run game.
  _runMainLoop: function _runMainLoop() {
    if (CC_EDITOR) {
      return;
    }

    if (!this._prepared) return;

    var self = this,
        _callback,
        config = self.config,
        director = cc.director,
        skip = true,
        frameRate = config.frameRate;

    debug.setDisplayStats(config.showFPS);

    _callback = function callback(now) {
      if (!self._paused) {
        self._intervalId = window.requestAnimFrame(_callback);

        if (!CC_JSB && !CC_RUNTIME && frameRate === 30) {
          if (skip = !skip) {
            return;
          }
        }

        director.mainLoop(now);
      }
    };

    self._intervalId = window.requestAnimFrame(_callback);
    self._paused = false;
  },
  //  @Game loading section
  _initConfig: function _initConfig(config) {
    // Configs adjustment
    if (typeof config.debugMode !== 'number') {
      config.debugMode = 0;
    }

    config.exposeClassName = !!config.exposeClassName;

    if (typeof config.frameRate !== 'number') {
      config.frameRate = 60;
    }

    var renderMode = config.renderMode;

    if (typeof renderMode !== 'number' || renderMode > 2 || renderMode < 0) {
      config.renderMode = 0;
    }

    if (typeof config.registerSystemEvent !== 'boolean') {
      config.registerSystemEvent = true;
    }

    if (renderMode === 1) {
      config.showFPS = false;
    } else {
      config.showFPS = !!config.showFPS;
    } // Scene parser


    this._sceneInfos = config.scenes || []; // Collide Map and Group List

    this.collisionMatrix = config.collisionMatrix || [];
    this.groupList = config.groupList || [];

    debug._resetDebugSetting(config.debugMode);

    this.config = config;
    this._configLoaded = true;
  },
  _determineRenderType: function _determineRenderType() {
    var config = this.config,
        userRenderMode = parseInt(config.renderMode) || 0; // Determine RenderType

    this.renderType = this.RENDER_TYPE_CANVAS;
    var supportRender = false;

    if (userRenderMode === 0) {
      if (cc.sys.capabilities['opengl']) {
        this.renderType = this.RENDER_TYPE_WEBGL;
        supportRender = true;
      } else if (cc.sys.capabilities['canvas']) {
        this.renderType = this.RENDER_TYPE_CANVAS;
        supportRender = true;
      }
    } else if (userRenderMode === 1 && cc.sys.capabilities['canvas']) {
      this.renderType = this.RENDER_TYPE_CANVAS;
      supportRender = true;
    } else if (userRenderMode === 2 && cc.sys.capabilities['opengl']) {
      this.renderType = this.RENDER_TYPE_WEBGL;
      supportRender = true;
    }

    if (!supportRender) {
      throw new Error(debug.getError(3820, userRenderMode));
    }
  },
  _initRenderer: function _initRenderer() {
    // Avoid setup to be called twice.
    if (this._rendererInitialized) return;
    var el = this.config.id,
        width,
        height,
        localCanvas,
        localContainer;

    if (CC_JSB || CC_RUNTIME) {
      this.container = localContainer = document.createElement("DIV");
      this.frame = localContainer.parentNode === document.body ? document.documentElement : localContainer.parentNode;
      localCanvas = window.__canvas;
      this.canvas = localCanvas;
    } else {
      var addClass = function addClass(element, name) {
        var hasClass = (' ' + element.className + ' ').indexOf(' ' + name + ' ') > -1;

        if (!hasClass) {
          if (element.className) {
            element.className += " ";
          }

          element.className += name;
        }
      };

      var element = el instanceof HTMLElement ? el : document.querySelector(el) || document.querySelector('#' + el);

      if (element.tagName === "CANVAS") {
        width = element.width;
        height = element.height; //it is already a canvas, we wrap it around with a div

        this.canvas = localCanvas = element;
        this.container = localContainer = document.createElement("DIV");
        if (localCanvas.parentNode) localCanvas.parentNode.insertBefore(localContainer, localCanvas);
      } else {
        //we must make a new canvas and place into this element
        if (element.tagName !== "DIV") {
          cc.warnID(3819);
        }

        width = element.clientWidth;
        height = element.clientHeight;
        this.canvas = localCanvas = document.createElement("CANVAS");
        this.container = localContainer = document.createElement("DIV");
        element.appendChild(localContainer);
      }

      localContainer.setAttribute('id', 'Cocos2dGameContainer');
      localContainer.appendChild(localCanvas);
      this.frame = localContainer.parentNode === document.body ? document.documentElement : localContainer.parentNode;
      addClass(localCanvas, "gameCanvas");
      localCanvas.setAttribute("width", width || 480);
      localCanvas.setAttribute("height", height || 320);
      localCanvas.setAttribute("tabindex", 99);
    }

    this._determineRenderType(); // WebGL context created successfully


    if (this.renderType === this.RENDER_TYPE_WEBGL) {
      var opts = {
        'stencil': true,
        // MSAA is causing serious performance dropdown on some browsers.
        'antialias': cc.macro.ENABLE_WEBGL_ANTIALIAS,
        'alpha': cc.macro.ENABLE_TRANSPARENT_CANVAS
      };
      renderer.initWebGL(localCanvas, opts);
      this._renderContext = renderer.device._gl; // Enable dynamic atlas manager by default

      if (!cc.macro.CLEANUP_IMAGE_CACHE && dynamicAtlasManager) {
        dynamicAtlasManager.enabled = true;
      }
    }

    if (!this._renderContext) {
      this.renderType = this.RENDER_TYPE_CANVAS; // Could be ignored by module settings

      renderer.initCanvas(localCanvas);
      this._renderContext = renderer.device._ctx;
    }

    this.canvas.oncontextmenu = function () {
      if (!cc._isContextMenuEnable) return false;
    };

    this._rendererInitialized = true;
  },
  _initEvents: function _initEvents() {
    var win = window,
        hiddenPropName; // register system events

    if (this.config.registerSystemEvent) _cc.inputManager.registerSystemEvent(this.canvas);

    if (typeof document.hidden !== 'undefined') {
      hiddenPropName = "hidden";
    } else if (typeof document.mozHidden !== 'undefined') {
      hiddenPropName = "mozHidden";
    } else if (typeof document.msHidden !== 'undefined') {
      hiddenPropName = "msHidden";
    } else if (typeof document.webkitHidden !== 'undefined') {
      hiddenPropName = "webkitHidden";
    }

    var hidden = false;

    function onHidden() {
      if (!hidden) {
        hidden = true;
        game.emit(game.EVENT_HIDE);
      }
    } // In order to adapt the most of platforms the onshow API.


    function onShown(arg0, arg1, arg2, arg3, arg4) {
      if (hidden) {
        hidden = false;
        game.emit(game.EVENT_SHOW, arg0, arg1, arg2, arg3, arg4);
      }
    }

    if (hiddenPropName) {
      var changeList = ["visibilitychange", "mozvisibilitychange", "msvisibilitychange", "webkitvisibilitychange", "qbrowserVisibilityChange"];

      for (var i = 0; i < changeList.length; i++) {
        document.addEventListener(changeList[i], function (event) {
          var visible = document[hiddenPropName]; // QQ App

          visible = visible || event["hidden"];
          if (visible) onHidden();else onShown();
        });
      }
    } else {
      win.addEventListener("blur", onHidden);
      win.addEventListener("focus", onShown);
    }

    if (navigator.userAgent.indexOf("MicroMessenger") > -1) {
      win.onfocus = onShown;
    }

    if ("onpageshow" in window && "onpagehide" in window) {
      win.addEventListener("pagehide", onHidden);
      win.addEventListener("pageshow", onShown); // Taobao UIWebKit

      document.addEventListener("pagehide", onHidden);
      document.addEventListener("pageshow", onShown);
    }

    this.on(game.EVENT_HIDE, function () {
      game.pause();
    });
    this.on(game.EVENT_SHOW, function () {
      game.resume();
    });
  }
};
EventTarget.call(game);
cc.js.addon(game, EventTarget.prototype);
/**
 * @module cc
 */

/**
 * !#en This is a Game instance.
 * !#zh 这是一个 Game 类的实例，包含游戏主体信息并负责驱动游戏的游戏对象。。
 * @property game
 * @type Game
 */

cc.game = module.exports = game;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDR2FtZS5qcyJdLCJuYW1lcyI6WyJFdmVudFRhcmdldCIsInJlcXVpcmUiLCJkZWJ1ZyIsInJlbmRlcmVyIiwiZHluYW1pY0F0bGFzTWFuYWdlciIsImdhbWUiLCJFVkVOVF9ISURFIiwiRVZFTlRfU0hPVyIsIkVWRU5UX1JFU1RBUlQiLCJFVkVOVF9HQU1FX0lOSVRFRCIsIkVWRU5UX0VOR0lORV9JTklURUQiLCJFVkVOVF9SRU5ERVJFUl9JTklURUQiLCJSRU5ERVJfVFlQRV9DQU5WQVMiLCJSRU5ERVJfVFlQRV9XRUJHTCIsIlJFTkRFUl9UWVBFX09QRU5HTCIsIl9wZXJzaXN0Um9vdE5vZGVzIiwiX3BhdXNlZCIsIl9jb25maWdMb2FkZWQiLCJfaXNDbG9uaW5nIiwiX3ByZXBhcmVkIiwiX3JlbmRlcmVySW5pdGlhbGl6ZWQiLCJfcmVuZGVyQ29udGV4dCIsIl9pbnRlcnZhbElkIiwiX2xhc3RUaW1lIiwiX2ZyYW1lVGltZSIsIl9zY2VuZUluZm9zIiwiZnJhbWUiLCJjb250YWluZXIiLCJjYW52YXMiLCJyZW5kZXJUeXBlIiwiY29uZmlnIiwib25TdGFydCIsInNldEZyYW1lUmF0ZSIsImZyYW1lUmF0ZSIsIndpbmRvdyIsImNhbmNlbEFuaW1GcmFtZSIsIl9zZXRBbmltRnJhbWUiLCJfcnVuTWFpbkxvb3AiLCJnZXRGcmFtZVJhdGUiLCJzdGVwIiwiY2MiLCJkaXJlY3RvciIsIm1haW5Mb29wIiwicGF1c2UiLCJhdWRpb0VuZ2luZSIsIl9icmVhayIsInJlc3VtZSIsIl9yZXN0b3JlIiwiX3Jlc2V0RGVsdGFUaW1lIiwiaXNQYXVzZWQiLCJyZXN0YXJ0Iiwib25jZSIsIkRpcmVjdG9yIiwiRVZFTlRfQUZURVJfRFJBVyIsImlkIiwicmVtb3ZlUGVyc2lzdFJvb3ROb2RlIiwiZ2V0U2NlbmUiLCJkZXN0cm95IiwiT2JqZWN0IiwiX2RlZmVycmVkRGVzdHJveSIsInVuY2FjaGVBbGwiLCJyZXNldCIsIkFzc2V0TGlicmFyeSIsIl9sb2FkQnVpbHRpbnMiLCJlbWl0IiwiZW5kIiwiY2xvc2UiLCJfaW5pdEVuZ2luZSIsIl9pbml0UmVuZGVyZXIiLCJDQ19FRElUT1IiLCJfaW5pdEV2ZW50cyIsIl9sb2FkUHJldmlld1NjcmlwdCIsImNiIiwiQ0NfUFJFVklFVyIsIl9fcXVpY2tfY29tcGlsZV9wcm9qZWN0X18iLCJsb2FkIiwiX3ByZXBhcmVGaW5pc2hlZCIsImNvbnNvbGUiLCJsb2ciLCJFTkdJTkVfVkVSU0lPTiIsImV2ZW50VGFyZ2V0T24iLCJwcm90b3R5cGUiLCJvbiIsImV2ZW50VGFyZ2V0T25jZSIsInR5cGUiLCJjYWxsYmFjayIsInRhcmdldCIsImNhbGwiLCJwcmVwYXJlIiwianNMaXN0IiwibGVuZ3RoIiwibG9hZGVyIiwiZXJyIiwiRXJyb3IiLCJKU09OIiwic3RyaW5naWZ5IiwicnVuIiwiX2luaXRDb25maWciLCJiaW5kIiwiYWRkUGVyc2lzdFJvb3ROb2RlIiwibm9kZSIsIk5vZGUiLCJpc05vZGUiLCJ1dWlkIiwid2FybklEIiwic2NlbmUiLCJfc2NlbmUiLCJpc1ZhbGlkIiwicGFyZW50IiwiU2NlbmUiLCJfcGVyc2lzdE5vZGUiLCJpc1BlcnNpc3RSb290Tm9kZSIsInBlcmZvcm1hbmNlIiwibm93IiwiX21heFBhcnRpY2xlRGVsdGFUaW1lIiwiQ0NfSlNCIiwiQ0NfUlVOVElNRSIsImpzYiIsInNldFByZWZlcnJlZEZyYW1lc1BlclNlY29uZCIsInJlcXVlc3RBbmltRnJhbWUiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsIl9zdFRpbWUiLCJfY3RUaW1lIiwid2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwib1JlcXVlc3RBbmltYXRpb25GcmFtZSIsIm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibXNDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJtb3pDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJvQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwid2Via2l0Q2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibXNDYW5jZWxBbmltYXRpb25GcmFtZSIsIm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lIiwid2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJvQ2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJjdXJyVGltZSIsInRpbWVUb0NhbGwiLCJNYXRoIiwibWF4Iiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsInNlbGYiLCJza2lwIiwic2V0RGlzcGxheVN0YXRzIiwic2hvd0ZQUyIsImRlYnVnTW9kZSIsImV4cG9zZUNsYXNzTmFtZSIsInJlbmRlck1vZGUiLCJyZWdpc3RlclN5c3RlbUV2ZW50Iiwic2NlbmVzIiwiY29sbGlzaW9uTWF0cml4IiwiZ3JvdXBMaXN0IiwiX3Jlc2V0RGVidWdTZXR0aW5nIiwiX2RldGVybWluZVJlbmRlclR5cGUiLCJ1c2VyUmVuZGVyTW9kZSIsInBhcnNlSW50Iiwic3VwcG9ydFJlbmRlciIsInN5cyIsImNhcGFiaWxpdGllcyIsImdldEVycm9yIiwiZWwiLCJ3aWR0aCIsImhlaWdodCIsImxvY2FsQ2FudmFzIiwibG9jYWxDb250YWluZXIiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJwYXJlbnROb2RlIiwiYm9keSIsImRvY3VtZW50RWxlbWVudCIsIl9fY2FudmFzIiwiYWRkQ2xhc3MiLCJlbGVtZW50IiwibmFtZSIsImhhc0NsYXNzIiwiY2xhc3NOYW1lIiwiaW5kZXhPZiIsIkhUTUxFbGVtZW50IiwicXVlcnlTZWxlY3RvciIsInRhZ05hbWUiLCJpbnNlcnRCZWZvcmUiLCJjbGllbnRXaWR0aCIsImNsaWVudEhlaWdodCIsImFwcGVuZENoaWxkIiwic2V0QXR0cmlidXRlIiwib3B0cyIsIm1hY3JvIiwiRU5BQkxFX1dFQkdMX0FOVElBTElBUyIsIkVOQUJMRV9UUkFOU1BBUkVOVF9DQU5WQVMiLCJpbml0V2ViR0wiLCJkZXZpY2UiLCJfZ2wiLCJDTEVBTlVQX0lNQUdFX0NBQ0hFIiwiZW5hYmxlZCIsImluaXRDYW52YXMiLCJfY3R4Iiwib25jb250ZXh0bWVudSIsIl9pc0NvbnRleHRNZW51RW5hYmxlIiwid2luIiwiaGlkZGVuUHJvcE5hbWUiLCJfY2MiLCJpbnB1dE1hbmFnZXIiLCJoaWRkZW4iLCJtb3pIaWRkZW4iLCJtc0hpZGRlbiIsIndlYmtpdEhpZGRlbiIsIm9uSGlkZGVuIiwib25TaG93biIsImFyZzAiLCJhcmcxIiwiYXJnMiIsImFyZzMiLCJhcmc0IiwiY2hhbmdlTGlzdCIsImkiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJ2aXNpYmxlIiwibmF2aWdhdG9yIiwidXNlckFnZW50Iiwib25mb2N1cyIsImpzIiwiYWRkb24iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkEsSUFBSUEsV0FBVyxHQUFHQyxPQUFPLENBQUMsc0JBQUQsQ0FBekI7O0FBQ0FBLE9BQU8sQ0FBQyx3QkFBRCxDQUFQOztBQUNBLElBQU1DLEtBQUssR0FBR0QsT0FBTyxDQUFDLFdBQUQsQ0FBckI7O0FBQ0EsSUFBTUUsUUFBUSxHQUFHRixPQUFPLENBQUMscUJBQUQsQ0FBeEI7O0FBQ0EsSUFBTUcsbUJBQW1CLEdBQUdILE9BQU8sQ0FBQyw4Q0FBRCxDQUFuQztBQUVBOzs7O0FBSUE7Ozs7Ozs7O0FBTUEsSUFBSUksSUFBSSxHQUFHO0FBQ1A7Ozs7Ozs7Ozs7Ozs7OztBQWVBQyxFQUFBQSxVQUFVLEVBQUUsY0FoQkw7O0FBa0JQOzs7Ozs7Ozs7OztBQVdBQyxFQUFBQSxVQUFVLEVBQUUsY0E3Qkw7O0FBK0JQOzs7Ozs7O0FBT0FDLEVBQUFBLGFBQWEsRUFBRSxpQkF0Q1I7O0FBd0NQOzs7Ozs7QUFNQUMsRUFBQUEsaUJBQWlCLEVBQUUsYUE5Q1o7O0FBZ0RQOzs7Ozs7O0FBT0FDLEVBQUFBLG1CQUFtQixFQUFFLGVBdkRk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M0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnZhciBFdmVudFRhcmdldCA9IHJlcXVpcmUoJy4vZXZlbnQvZXZlbnQtdGFyZ2V0Jyk7XG5yZXF1aXJlKCcuLi9hdWRpby9DQ0F1ZGlvRW5naW5lJyk7XG5jb25zdCBkZWJ1ZyA9IHJlcXVpcmUoJy4vQ0NEZWJ1ZycpO1xuY29uc3QgcmVuZGVyZXIgPSByZXF1aXJlKCcuL3JlbmRlcmVyL2luZGV4LmpzJyk7XG5jb25zdCBkeW5hbWljQXRsYXNNYW5hZ2VyID0gcmVxdWlyZSgnLi4vY29yZS9yZW5kZXJlci91dGlscy9keW5hbWljLWF0bGFzL21hbmFnZXInKTtcblxuLyoqXG4gKiBAbW9kdWxlIGNjXG4gKi9cblxuLyoqXG4gKiAhI2VuIEFuIG9iamVjdCB0byBib290IHRoZSBnYW1lLlxuICogISN6aCDljIXlkKvmuLjmiI/kuLvkvZPkv6Hmga/lubbotJ/otKPpqbHliqjmuLjmiI/nmoTmuLjmiI/lr7nosaHjgIJcbiAqIEBjbGFzcyBHYW1lXG4gKiBAZXh0ZW5kcyBFdmVudFRhcmdldFxuICovXG52YXIgZ2FtZSA9IHtcbiAgICAvKipcbiAgICAgKiAhI2VuIEV2ZW50IHRyaWdnZXJlZCB3aGVuIGdhbWUgaGlkZSB0byBiYWNrZ3JvdW5kLlxuICAgICAqIFBsZWFzZSBub3RlIHRoYXQgdGhpcyBldmVudCBpcyBub3QgMTAwJSBndWFyYW50ZWVkIHRvIGJlIGZpcmVkIG9uIFdlYiBwbGF0Zm9ybSxcbiAgICAgKiBvbiBuYXRpdmUgcGxhdGZvcm1zLCBpdCBjb3JyZXNwb25kcyB0byBlbnRlciBiYWNrZ3JvdW5kIGV2ZW50LCBvcyBzdGF0dXMgYmFyIG9yIG5vdGlmaWNhdGlvbiBjZW50ZXIgbWF5IG5vdCB0cmlnZ2VyIHRoaXMgZXZlbnQuXG4gICAgICogISN6aCDmuLjmiI/ov5vlhaXlkI7lj7Dml7bop6blj5HnmoTkuovku7bjgIJcbiAgICAgKiDor7fms6jmhI/vvIzlnKggV0VCIOW5s+WPsO+8jOi/meS4quS6i+S7tuS4jeS4gOWumuS8miAxMDAlIOinpuWPke+8jOi/meWujOWFqOWPluWGs+S6jua1j+iniOWZqOeahOWbnuiwg+ihjOS4uuOAglxuICAgICAqIOWcqOWOn+eUn+W5s+WPsO+8jOWug+WvueW6lOeahOaYr+W6lOeUqOiiq+WIh+aNouWIsOWQjuWPsOS6i+S7tu+8jOS4i+aLieiPnOWNleWSjOS4iuaLieeKtuaAgeagj+etieS4jeS4gOWumuS8muinpuWPkei/meS4quS6i+S7tu+8jOi/meWPluWGs+S6juezu+e7n+ihjOS4uuOAglxuICAgICAqIEBwcm9wZXJ0eSBFVkVOVF9ISURFXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNjLmdhbWUub24oY2MuZ2FtZS5FVkVOVF9ISURFLCBmdW5jdGlvbiAoKSB7XG4gICAgICogICAgIGNjLmF1ZGlvRW5naW5lLnBhdXNlTXVzaWMoKTtcbiAgICAgKiAgICAgY2MuYXVkaW9FbmdpbmUucGF1c2VBbGxFZmZlY3RzKCk7XG4gICAgICogfSk7XG4gICAgICovXG4gICAgRVZFTlRfSElERTogXCJnYW1lX29uX2hpZGVcIixcblxuICAgIC8qKlxuICAgICAqICEjZW4gRXZlbnQgdHJpZ2dlcmVkIHdoZW4gZ2FtZSBiYWNrIHRvIGZvcmVncm91bmRcbiAgICAgKiBQbGVhc2Ugbm90ZSB0aGF0IHRoaXMgZXZlbnQgaXMgbm90IDEwMCUgZ3VhcmFudGVlZCB0byBiZSBmaXJlZCBvbiBXZWIgcGxhdGZvcm0sXG4gICAgICogb24gbmF0aXZlIHBsYXRmb3JtcywgaXQgY29ycmVzcG9uZHMgdG8gZW50ZXIgZm9yZWdyb3VuZCBldmVudC5cbiAgICAgKiAhI3poIOa4uOaIj+i/m+WFpeWJjeWPsOi/kOihjOaXtuinpuWPkeeahOS6i+S7tuOAglxuICAgICAqIOivt+azqOaEj++8jOWcqCBXRUIg5bmz5Y+w77yM6L+Z5Liq5LqL5Lu25LiN5LiA5a6a5LyaIDEwMCUg6Kem5Y+R77yM6L+Z5a6M5YWo5Y+W5Yaz5LqO5rWP6KeI5Zmo55qE5Zue6LCD6KGM5Li644CCXG4gICAgICog5Zyo5Y6f55Sf5bmz5Y+w77yM5a6D5a+55bqU55qE5piv5bqU55So6KKr5YiH5o2i5Yiw5YmN5Y+w5LqL5Lu244CCXG4gICAgICogQHByb3BlcnR5IEVWRU5UX1NIT1dcbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIEVWRU5UX1NIT1c6IFwiZ2FtZV9vbl9zaG93XCIsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEV2ZW50IHRyaWdnZXJlZCB3aGVuIGdhbWUgcmVzdGFydFxuICAgICAqICEjemgg6LCD55SocmVzdGFydOWQju+8jOinpuWPkeS6i+S7tuOAglxuICAgICAqIEBwcm9wZXJ0eSBFVkVOVF9SRVNUQVJUXG4gICAgICogQGNvbnN0YW50XG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICBFVkVOVF9SRVNUQVJUOiBcImdhbWVfb25fcmVzdGFydFwiLFxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgdHJpZ2dlcmVkIGFmdGVyIGdhbWUgaW5pdGVkLCBhdCB0aGlzIHBvaW50IGFsbCBlbmdpbmUgb2JqZWN0cyBhbmQgZ2FtZSBzY3JpcHRzIGFyZSBsb2FkZWRcbiAgICAgKiBAcHJvcGVydHkgRVZFTlRfR0FNRV9JTklURURcbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIEVWRU5UX0dBTUVfSU5JVEVEOiBcImdhbWVfaW5pdGVkXCIsXG5cbiAgICAvKipcbiAgICAgKiBFdmVudCB0cmlnZ2VyZWQgYWZ0ZXIgZW5naW5lIGluaXRlZCwgYXQgdGhpcyBwb2ludCB5b3Ugd2lsbCBiZSBhYmxlIHRvIHVzZSBhbGwgZW5naW5lIGNsYXNzZXMuIFxuICAgICAqIEl0IHdhcyBkZWZpbmVkIGFzIEVWRU5UX1JFTkRFUkVSX0lOSVRFRCBpbiBjb2NvcyBjcmVhdG9yIHYxLnggYW5kIHJlbmFtZWQgaW4gdjIuMFxuICAgICAqIEBwcm9wZXJ0eSBFVkVOVF9FTkdJTkVfSU5JVEVEXG4gICAgICogQGNvbnN0YW50XG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICBFVkVOVF9FTkdJTkVfSU5JVEVEOiBcImVuZ2luZV9pbml0ZWRcIixcbiAgICAvLyBkZXByZWNhdGVkXG4gICAgRVZFTlRfUkVOREVSRVJfSU5JVEVEOiBcImVuZ2luZV9pbml0ZWRcIixcblxuICAgIC8qKlxuICAgICAqIFdlYiBDYW52YXMgMmQgQVBJIGFzIHJlbmRlcmVyIGJhY2tlbmRcbiAgICAgKiBAcHJvcGVydHkgUkVOREVSX1RZUEVfQ0FOVkFTXG4gICAgICogQGNvbnN0YW50XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBSRU5ERVJfVFlQRV9DQU5WQVM6IDAsXG4gICAgLyoqXG4gICAgICogV2ViR0wgQVBJIGFzIHJlbmRlcmVyIGJhY2tlbmRcbiAgICAgKiBAcHJvcGVydHkgUkVOREVSX1RZUEVfV0VCR0xcbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFJFTkRFUl9UWVBFX1dFQkdMOiAxLFxuICAgIC8qKlxuICAgICAqIE9wZW5HTCBBUEkgYXMgcmVuZGVyZXIgYmFja2VuZFxuICAgICAqIEBwcm9wZXJ0eSBSRU5ERVJfVFlQRV9PUEVOR0xcbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFJFTkRFUl9UWVBFX09QRU5HTDogMixcblxuICAgIF9wZXJzaXN0Um9vdE5vZGVzOiB7fSxcblxuICAgIC8vIHN0YXRlc1xuICAgIF9wYXVzZWQ6IHRydWUsLy93aGV0aGVyIHRoZSBnYW1lIGlzIHBhdXNlZFxuICAgIF9jb25maWdMb2FkZWQ6IGZhbHNlLC8vd2hldGhlciBjb25maWcgbG9hZGVkXG4gICAgX2lzQ2xvbmluZzogZmFsc2UsICAgIC8vIGRlc2VyaWFsaXppbmcgb3IgaW5zdGFudGlhdGluZ1xuICAgIF9wcmVwYXJlZDogZmFsc2UsIC8vd2hldGhlciB0aGUgZW5naW5lIGhhcyBwcmVwYXJlZFxuICAgIF9yZW5kZXJlckluaXRpYWxpemVkOiBmYWxzZSxcblxuICAgIF9yZW5kZXJDb250ZXh0OiBudWxsLFxuXG4gICAgX2ludGVydmFsSWQ6IG51bGwsLy9pbnRlcnZhbCB0YXJnZXQgb2YgbWFpblxuXG4gICAgX2xhc3RUaW1lOiBudWxsLFxuICAgIF9mcmFtZVRpbWU6IG51bGwsXG5cbiAgICAvLyBTY2VuZXMgbGlzdFxuICAgIF9zY2VuZUluZm9zOiBbXSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG91dGVyIGZyYW1lIG9mIHRoZSBnYW1lIGNhbnZhcywgcGFyZW50IG9mIGdhbWUgY29udGFpbmVyLlxuICAgICAqICEjemgg5ri45oiP55S75biD55qE5aSW5qGG77yMY29udGFpbmVyIOeahOeItuWuueWZqOOAglxuICAgICAqIEBwcm9wZXJ0eSBmcmFtZVxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgZnJhbWU6IG51bGwsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgY29udGFpbmVyIG9mIGdhbWUgY2FudmFzLlxuICAgICAqICEjemgg5ri45oiP55S75biD55qE5a655Zmo44CCXG4gICAgICogQHByb3BlcnR5IGNvbnRhaW5lclxuICAgICAqIEB0eXBlIHtIVE1MRGl2RWxlbWVudH1cbiAgICAgKi9cbiAgICBjb250YWluZXI6IG51bGwsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgY2FudmFzIG9mIHRoZSBnYW1lLlxuICAgICAqICEjemgg5ri45oiP55qE55S75biD44CCXG4gICAgICogQHByb3BlcnR5IGNhbnZhc1xuICAgICAqIEB0eXBlIHtIVE1MQ2FudmFzRWxlbWVudH1cbiAgICAgKi9cbiAgICBjYW52YXM6IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSByZW5kZXJlciBiYWNrZW5kIG9mIHRoZSBnYW1lLlxuICAgICAqICEjemgg5ri45oiP55qE5riy5p+T5Zmo57G75Z6L44CCXG4gICAgICogQHByb3BlcnR5IHJlbmRlclR5cGVcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHJlbmRlclR5cGU6IC0xLFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFRoZSBjdXJyZW50IGdhbWUgY29uZmlndXJhdGlvbiwgaW5jbHVkaW5nOjxici8+XG4gICAgICogMS4gZGVidWdNb2RlPGJyLz5cbiAgICAgKiAgICAgIFwiZGVidWdNb2RlXCIgcG9zc2libGUgdmFsdWVzIDo8YnIvPlxuICAgICAqICAgICAgMCAtIE5vIG1lc3NhZ2Ugd2lsbCBiZSBwcmludGVkLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICogICAgICAxIC0gY2MuZXJyb3IsIGNjLmFzc2VydCwgY2Mud2FybiwgY2MubG9nIHdpbGwgcHJpbnQgaW4gY29uc29sZS4gICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgICAgIDIgLSBjYy5lcnJvciwgY2MuYXNzZXJ0LCBjYy53YXJuIHdpbGwgcHJpbnQgaW4gY29uc29sZS4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICAgICAqICAgICAgMyAtIGNjLmVycm9yLCBjYy5hc3NlcnQgd2lsbCBwcmludCBpbiBjb25zb2xlLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICogICAgICA0IC0gY2MuZXJyb3IsIGNjLmFzc2VydCwgY2Mud2FybiwgY2MubG9nIHdpbGwgcHJpbnQgb24gY2FudmFzLCBhdmFpbGFibGUgb25seSBvbiB3ZWIuPGJyLz5cbiAgICAgKiAgICAgIDUgLSBjYy5lcnJvciwgY2MuYXNzZXJ0LCBjYy53YXJuIHdpbGwgcHJpbnQgb24gY2FudmFzLCBhdmFpbGFibGUgb25seSBvbiB3ZWIuICAgICAgICA8YnIvPlxuICAgICAqICAgICAgNiAtIGNjLmVycm9yLCBjYy5hc3NlcnQgd2lsbCBwcmludCBvbiBjYW52YXMsIGF2YWlsYWJsZSBvbmx5IG9uIHdlYi4gICAgICAgICAgICAgICAgIDxici8+XG4gICAgICogMi4gc2hvd0ZQUzxici8+XG4gICAgICogICAgICBMZWZ0IGJvdHRvbSBjb3JuZXIgZnBzIGluZm9ybWF0aW9uIHdpbGwgc2hvdyB3aGVuIFwic2hvd0ZQU1wiIGVxdWFscyB0cnVlLCBvdGhlcndpc2UgaXQgd2lsbCBiZSBoaWRlLjxici8+XG4gICAgICogMy4gZXhwb3NlQ2xhc3NOYW1lPGJyLz5cbiAgICAgKiAgICAgIEV4cG9zZSBjbGFzcyBuYW1lIHRvIGNocm9tZSBkZWJ1ZyB0b29scywgdGhlIGNsYXNzIGludGFudGlhdGUgcGVyZm9ybWFuY2UgaXMgYSBsaXR0bGUgYml0IHNsb3dlciB3aGVuIGV4cG9zZWQuPGJyLz5cbiAgICAgKiA0LiBmcmFtZVJhdGU8YnIvPlxuICAgICAqICAgICAgXCJmcmFtZVJhdGVcIiBzZXQgdGhlIHdhbnRlZCBmcmFtZSByYXRlIGZvciB5b3VyIGdhbWUsIGJ1dCB0aGUgcmVhbCBmcHMgZGVwZW5kcyBvbiB5b3VyIGdhbWUgaW1wbGVtZW50YXRpb24gYW5kIHRoZSBydW5uaW5nIGVudmlyb25tZW50Ljxici8+XG4gICAgICogNS4gaWQ8YnIvPlxuICAgICAqICAgICAgXCJnYW1lQ2FudmFzXCIgc2V0cyB0aGUgaWQgb2YgeW91ciBjYW52YXMgZWxlbWVudCBvbiB0aGUgd2ViIHBhZ2UsIGl0J3MgdXNlZnVsIG9ubHkgb24gd2ViLjxici8+XG4gICAgICogNi4gcmVuZGVyTW9kZTxici8+XG4gICAgICogICAgICBcInJlbmRlck1vZGVcIiBzZXRzIHRoZSByZW5kZXJlciB0eXBlLCBvbmx5IHVzZWZ1bCBvbiB3ZWIgOjxici8+XG4gICAgICogICAgICAwIC0gQXV0b21hdGljYWxseSBjaG9zZW4gYnkgZW5naW5lPGJyLz5cbiAgICAgKiAgICAgIDEgLSBGb3JjZWQgdG8gdXNlIGNhbnZhcyByZW5kZXJlcjxici8+XG4gICAgICogICAgICAyIC0gRm9yY2VkIHRvIHVzZSBXZWJHTCByZW5kZXJlciwgYnV0IHRoaXMgd2lsbCBiZSBpZ25vcmVkIG9uIG1vYmlsZSBicm93c2Vyczxici8+XG4gICAgICogNy4gc2NlbmVzPGJyLz5cbiAgICAgKiAgICAgIFwic2NlbmVzXCIgaW5jbHVkZSBhdmFpbGFibGUgc2NlbmVzIGluIHRoZSBjdXJyZW50IGJ1bmRsZS48YnIvPlxuICAgICAqPGJyLz5cbiAgICAgKiBQbGVhc2UgRE8gTk9UIG1vZGlmeSB0aGlzIG9iamVjdCBkaXJlY3RseSwgaXQgd29uJ3QgaGF2ZSBhbnkgZWZmZWN0Ljxici8+XG4gICAgICogISN6aFxuICAgICAqIOW9k+WJjeeahOa4uOaIj+mFjee9ru+8jOWMheaLrO+8miAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICogMS4gZGVidWdNb2Rl77yIZGVidWcg5qih5byP77yM5L2G5piv5Zyo5rWP6KeI5Zmo5Lit6L+Z5Liq6YCJ6aG55Lya6KKr5b+955Wl77yJICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICAgICAqICAgICAgXCJkZWJ1Z01vZGVcIiDlkITnp43orr7nva7pgInpobnnmoTmhI/kuYnjgIIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICAgICAqICAgICAgICAgIDAgLSDmsqHmnInmtojmga/ooqvmiZPljbDlh7rmnaXjgIIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgICAgICAgICAxIC0gY2MuZXJyb3LvvIxjYy5hc3NlcnTvvIxjYy53YXJu77yMY2MubG9nIOWwhuaJk+WNsOWcqCBjb25zb2xlIOS4reOAgiAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICogICAgICAgICAgMiAtIGNjLmVycm9y77yMY2MuYXNzZXJ077yMY2Mud2FybiDlsIbmiZPljbDlnKggY29uc29sZSDkuK3jgIIgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICogICAgICAgICAgMyAtIGNjLmVycm9y77yMY2MuYXNzZXJ0IOWwhuaJk+WNsOWcqCBjb25zb2xlIOS4reOAgiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgICAgICAgICA0IC0gY2MuZXJyb3LvvIxjYy5hc3NlcnTvvIxjYy53YXJu77yMY2MubG9nIOWwhuaJk+WNsOWcqCBjYW52YXMg5Lit77yI5LuF6YCC55So5LqOIHdlYiDnq6/vvInjgIIgPGJyLz5cbiAgICAgKiAgICAgICAgICA1IC0gY2MuZXJyb3LvvIxjYy5hc3NlcnTvvIxjYy53YXJuIOWwhuaJk+WNsOWcqCBjYW52YXMg5Lit77yI5LuF6YCC55So5LqOIHdlYiDnq6/vvInjgIIgICAgICAgICA8YnIvPlxuICAgICAqICAgICAgICAgIDYgLSBjYy5lcnJvcu+8jGNjLmFzc2VydCDlsIbmiZPljbDlnKggY2FudmFzIOS4re+8iOS7hemAgueUqOS6jiB3ZWIg56uv77yJ44CCICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAyLiBzaG93RlBT77yI5pi+56S6IEZQU++8iSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICogICAgICDlvZMgc2hvd0ZQUyDkuLogdHJ1ZSDnmoTml7blgJnnlYzpnaLnmoTlt6bkuIvop5LlsIbmmL7npLogZnBzIOeahOS/oeaBr++8jOWQpuWImeiiq+makOiXj+OAgiAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAzLiBleHBvc2VDbGFzc05hbWUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICogICAgICDmmrTpnLLnsbvlkI3orqkgQ2hyb21lIERldlRvb2xzIOWPr+S7peivhuWIq++8jOWmguaenOW8gOWQr+S8mueojeeojemZjeS9juexu+eahOWIm+W7uui/h+eoi+eahOaAp+iDve+8jOS9huWvueWvueixoeaehOmAoOayoeacieW9seWTjeOAgiA8YnIvPlxuICAgICAqIDQuIGZyYW1lUmF0ZSAo5bin546HKSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgICAgIOKAnGZyYW1lUmF0ZeKAnSDorr7nva7mg7PopoHnmoTluKfnjofkvaDnmoTmuLjmiI/vvIzkvYbnnJ/mraPnmoRGUFPlj5blhrPkuo7kvaDnmoTmuLjmiI/lrp7njrDlkozov5DooYznjq/looPjgIIgICAgICA8YnIvPlxuICAgICAqIDUuIGlkICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICogICAgICBcImdhbWVDYW52YXNcIiBXZWIg6aG16Z2i5LiK55qEIENhbnZhcyBFbGVtZW50IElE77yM5LuF6YCC55So5LqOIHdlYiDnq6/jgIIgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiA2LiByZW5kZXJNb2Rl77yI5riy5p+T5qih5byP77yJICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgICAgIOKAnHJlbmRlck1vZGXigJ0g6K6+572u5riy5p+T5Zmo57G75Z6L77yM5LuF6YCC55So5LqOIHdlYiDnq6/vvJogICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICAgICAqICAgICAgICAgIDAgLSDpgJrov4flvJXmk47oh6rliqjpgInmi6njgIIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICogICAgICAgICAgMSAtIOW8uuWItuS9v+eUqCBjYW52YXMg5riy5p+T44CCXG4gICAgICogICAgICAgICAgMiAtIOW8uuWItuS9v+eUqCBXZWJHTCDmuLLmn5PvvIzkvYbmmK/lnKjpg6jliIYgQW5kcm9pZCDmtY/op4jlmajkuK3ov5nkuKrpgInpobnkvJrooqvlv73nlaXjgIIgICAgIDxici8+XG4gICAgICogNy4gc2NlbmVzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICogICAgICDigJxzY2VuZXPigJ0g5b2T5YmN5YyF5Lit5Y+v55So5Zy65pmv44CCICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiA8YnIvPlxuICAgICAqIOazqOaEj++8muivt+S4jeimgeebtOaOpeS/ruaUuei/meS4quWvueixoe+8jOWug+S4jeS8muacieS7u+S9leaViOaenOOAglxuICAgICAqIEBwcm9wZXJ0eSBjb25maWdcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbmZpZzogbnVsbCxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2FsbGJhY2sgd2hlbiB0aGUgc2NyaXB0cyBvZiBlbmdpbmUgaGF2ZSBiZWVuIGxvYWQuXG4gICAgICogISN6aCDlvZPlvJXmk47lrozmiJDlkK/liqjlkI7nmoTlm57osIPlh73mlbDjgIJcbiAgICAgKiBAbWV0aG9kIG9uU3RhcnRcbiAgICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAgICovXG4gICAgb25TdGFydDogbnVsbCxcblxuLy9AUHVibGljIE1ldGhvZHNcblxuLy8gIEBHYW1lIHBsYXkgY29udHJvbFxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IGZyYW1lIHJhdGUgb2YgZ2FtZS5cbiAgICAgKiAhI3poIOiuvue9rua4uOaIj+W4p+eOh+OAglxuICAgICAqIEBtZXRob2Qgc2V0RnJhbWVSYXRlXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGZyYW1lUmF0ZVxuICAgICAqL1xuICAgIHNldEZyYW1lUmF0ZTogZnVuY3Rpb24gKGZyYW1lUmF0ZSkge1xuICAgICAgICB2YXIgY29uZmlnID0gdGhpcy5jb25maWc7XG4gICAgICAgIGNvbmZpZy5mcmFtZVJhdGUgPSBmcmFtZVJhdGU7XG4gICAgICAgIGlmICh0aGlzLl9pbnRlcnZhbElkKVxuICAgICAgICAgICAgd2luZG93LmNhbmNlbEFuaW1GcmFtZSh0aGlzLl9pbnRlcnZhbElkKTtcbiAgICAgICAgdGhpcy5faW50ZXJ2YWxJZCA9IDA7XG4gICAgICAgIHRoaXMuX3BhdXNlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX3NldEFuaW1GcmFtZSgpO1xuICAgICAgICB0aGlzLl9ydW5NYWluTG9vcCgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldCBmcmFtZSByYXRlIHNldCBmb3IgdGhlIGdhbWUsIGl0IGRvZXNuJ3QgcmVwcmVzZW50IHRoZSByZWFsIGZyYW1lIHJhdGUuXG4gICAgICogISN6aCDojrflj5borr7nva7nmoTmuLjmiI/luKfnjofvvIjkuI3nrYnlkIzkuo7lrp7pmYXluKfnjofvvInjgIJcbiAgICAgKiBAbWV0aG9kIGdldEZyYW1lUmF0ZVxuICAgICAqIEByZXR1cm4ge051bWJlcn0gZnJhbWUgcmF0ZVxuICAgICAqL1xuICAgIGdldEZyYW1lUmF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuZnJhbWVSYXRlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJ1biB0aGUgZ2FtZSBmcmFtZSBieSBmcmFtZS5cbiAgICAgKiAhI3poIOaJp+ihjOS4gOW4p+a4uOaIj+W+queOr+OAglxuICAgICAqIEBtZXRob2Qgc3RlcFxuICAgICAqL1xuICAgIHN0ZXA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MuZGlyZWN0b3IubWFpbkxvb3AoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBQYXVzZSB0aGUgZ2FtZSBtYWluIGxvb3AuIFRoaXMgd2lsbCBwYXVzZTpcbiAgICAgKiBnYW1lIGxvZ2ljIGV4ZWN1dGlvbiwgcmVuZGVyaW5nIHByb2Nlc3MsIGV2ZW50IG1hbmFnZXIsIGJhY2tncm91bmQgbXVzaWMgYW5kIGFsbCBhdWRpbyBlZmZlY3RzLlxuICAgICAqIFRoaXMgaXMgZGlmZmVyZW50IHdpdGggY2MuZGlyZWN0b3IucGF1c2Ugd2hpY2ggb25seSBwYXVzZSB0aGUgZ2FtZSBsb2dpYyBleGVjdXRpb24uXG4gICAgICogISN6aCDmmoLlgZzmuLjmiI/kuLvlvqrnjq/jgILljIXlkKvvvJrmuLjmiI/pgLvovpHvvIzmuLLmn5PvvIzkuovku7blpITnkIbvvIzog4zmma/pn7PkuZDlkozmiYDmnInpn7PmlYjjgILov5nngrnlkozlj6rmmoLlgZzmuLjmiI/pgLvovpHnmoQgY2MuZGlyZWN0b3IucGF1c2Ug5LiN5ZCM44CCXG4gICAgICogQG1ldGhvZCBwYXVzZVxuICAgICAqL1xuICAgIHBhdXNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9wYXVzZWQpIHJldHVybjtcbiAgICAgICAgdGhpcy5fcGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgLy8gUGF1c2UgYXVkaW8gZW5naW5lXG4gICAgICAgIGlmIChjYy5hdWRpb0VuZ2luZSkge1xuICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUuX2JyZWFrKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUGF1c2UgbWFpbiBsb29wXG4gICAgICAgIGlmICh0aGlzLl9pbnRlcnZhbElkKVxuICAgICAgICAgICAgd2luZG93LmNhbmNlbEFuaW1GcmFtZSh0aGlzLl9pbnRlcnZhbElkKTtcbiAgICAgICAgdGhpcy5faW50ZXJ2YWxJZCA9IDA7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmVzdW1lIHRoZSBnYW1lIGZyb20gcGF1c2UuIFRoaXMgd2lsbCByZXN1bWU6XG4gICAgICogZ2FtZSBsb2dpYyBleGVjdXRpb24sIHJlbmRlcmluZyBwcm9jZXNzLCBldmVudCBtYW5hZ2VyLCBiYWNrZ3JvdW5kIG11c2ljIGFuZCBhbGwgYXVkaW8gZWZmZWN0cy5cbiAgICAgKiAhI3poIOaBouWkjea4uOaIj+S4u+W+queOr+OAguWMheWQq++8mua4uOaIj+mAu+i+ke+8jOa4suafk++8jOS6i+S7tuWkhOeQhu+8jOiDjOaZr+mfs+S5kOWSjOaJgOaciemfs+aViOOAglxuICAgICAqIEBtZXRob2QgcmVzdW1lXG4gICAgICovXG4gICAgcmVzdW1lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fcGF1c2VkKSByZXR1cm47XG4gICAgICAgIHRoaXMuX3BhdXNlZCA9IGZhbHNlO1xuICAgICAgICAvLyBSZXN1bWUgYXVkaW8gZW5naW5lXG4gICAgICAgIGlmIChjYy5hdWRpb0VuZ2luZSkge1xuICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUuX3Jlc3RvcmUoKTtcbiAgICAgICAgfVxuICAgICAgICBjYy5kaXJlY3Rvci5fcmVzZXREZWx0YVRpbWUoKTtcbiAgICAgICAgLy8gUmVzdW1lIG1haW4gbG9vcFxuICAgICAgICB0aGlzLl9ydW5NYWluTG9vcCgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENoZWNrIHdoZXRoZXIgdGhlIGdhbWUgaXMgcGF1c2VkLlxuICAgICAqICEjemgg5Yik5pat5ri45oiP5piv5ZCm5pqC5YGc44CCXG4gICAgICogQG1ldGhvZCBpc1BhdXNlZFxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaXNQYXVzZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhdXNlZDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXN0YXJ0IGdhbWUuXG4gICAgICogISN6aCDph43mlrDlvIDlp4vmuLjmiI9cbiAgICAgKiBAbWV0aG9kIHJlc3RhcnRcbiAgICAgKi9cbiAgICByZXN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uY2UoY2MuRGlyZWN0b3IuRVZFTlRfQUZURVJfRFJBVywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaWQgaW4gZ2FtZS5fcGVyc2lzdFJvb3ROb2Rlcykge1xuICAgICAgICAgICAgICAgIGdhbWUucmVtb3ZlUGVyc2lzdFJvb3ROb2RlKGdhbWUuX3BlcnNpc3RSb290Tm9kZXNbaWRdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ2xlYXIgc2NlbmVcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuZGVzdHJveSgpO1xuICAgICAgICAgICAgY2MuT2JqZWN0Ll9kZWZlcnJlZERlc3Ryb3koKTtcblxuICAgICAgICAgICAgLy8gQ2xlYW4gdXAgYXVkaW9cbiAgICAgICAgICAgIGlmIChjYy5hdWRpb0VuZ2luZSkge1xuICAgICAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnVuY2FjaGVBbGwoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2MuZGlyZWN0b3IucmVzZXQoKTtcblxuICAgICAgICAgICAgZ2FtZS5wYXVzZSgpO1xuICAgICAgICAgICAgY2MuQXNzZXRMaWJyYXJ5Ll9sb2FkQnVpbHRpbnMoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGdhbWUub25TdGFydCgpO1xuICAgICAgICAgICAgICAgIGdhbWUuZW1pdChnYW1lLkVWRU5UX1JFU1RBUlQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEVuZCBnYW1lLCBpdCB3aWxsIGNsb3NlIHRoZSBnYW1lIHdpbmRvd1xuICAgICAqICEjemgg6YCA5Ye65ri45oiPXG4gICAgICogQG1ldGhvZCBlbmRcbiAgICAgKi9cbiAgICBlbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2xvc2UoKTtcbiAgICB9LFxuXG4vLyAgQEdhbWUgbG9hZGluZ1xuXG4gICAgX2luaXRFbmdpbmUgKCkge1xuICAgICAgICBpZiAodGhpcy5fcmVuZGVyZXJJbml0aWFsaXplZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5faW5pdFJlbmRlcmVyKCk7XG5cbiAgICAgICAgaWYgKCFDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRFdmVudHMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UX0VOR0lORV9JTklURUQpO1xuICAgIH0sXG5cbiAgICBfbG9hZFByZXZpZXdTY3JpcHQgKGNiKSB7XG4gICAgICAgIGlmIChDQ19QUkVWSUVXICYmIHdpbmRvdy5fX3F1aWNrX2NvbXBpbGVfcHJvamVjdF9fKSB7XG4gICAgICAgICAgICB3aW5kb3cuX19xdWlja19jb21waWxlX3Byb2plY3RfXy5sb2FkKGNiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNiKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3ByZXBhcmVGaW5pc2hlZCAoY2IpIHtcbiAgICAgICAgLy8gSW5pdCBlbmdpbmVcbiAgICAgICAgdGhpcy5faW5pdEVuZ2luZSgpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5fc2V0QW5pbUZyYW1lKCk7XG4gICAgICAgIGNjLkFzc2V0TGlicmFyeS5fbG9hZEJ1aWx0aW5zKCgpID0+IHtcbiAgICAgICAgICAgIC8vIExvZyBlbmdpbmUgdmVyc2lvblxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0NvY29zIENyZWF0b3IgdicgKyBjYy5FTkdJTkVfVkVSU0lPTik7XG4gICAgICAgICAgICB0aGlzLl9wcmVwYXJlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLl9ydW5NYWluTG9vcCgpO1xuXG4gICAgICAgICAgICB0aGlzLmVtaXQodGhpcy5FVkVOVF9HQU1FX0lOSVRFRCk7XG5cbiAgICAgICAgICAgIGlmIChjYikgY2IoKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGV2ZW50VGFyZ2V0T246IEV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vbixcbiAgICBldmVudFRhcmdldE9uY2U6IEV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vbmNlLFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJlZ2lzdGVyIGFuIGNhbGxiYWNrIG9mIGEgc3BlY2lmaWMgZXZlbnQgdHlwZSBvbiB0aGUgZ2FtZSBvYmplY3QuXG4gICAgICogVGhpcyB0eXBlIG9mIGV2ZW50IHNob3VsZCBiZSB0cmlnZ2VyZWQgdmlhIGBlbWl0YC5cbiAgICAgKiAhI3poXG4gICAgICog5rOo5YaMIGdhbWUg55qE54m55a6a5LqL5Lu257G75Z6L5Zue6LCD44CC6L+Z56eN57G75Z6L55qE5LqL5Lu25bqU6K+l6KKrIGBlbWl0YCDop6blj5HjgIJcbiAgICAgKlxuICAgICAqIEBtZXRob2Qgb25cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgZXZlbnQgdHlwZSB0byBsaXN0ZW4gZm9yLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRoYXQgd2lsbCBiZSBpbnZva2VkIHdoZW4gdGhlIGV2ZW50IGlzIGRpc3BhdGNoZWQuXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgY2FsbGJhY2sgaXMgaWdub3JlZCBpZiBpdCBpcyBhIGR1cGxpY2F0ZSAodGhlIGNhbGxiYWNrcyBhcmUgdW5pcXVlKS5cbiAgICAgKiBAcGFyYW0ge2FueX0gW2NhbGxiYWNrLmFyZzFdIGFyZzFcbiAgICAgKiBAcGFyYW0ge2FueX0gW2NhbGxiYWNrLmFyZzJdIGFyZzJcbiAgICAgKiBAcGFyYW0ge2FueX0gW2NhbGxiYWNrLmFyZzNdIGFyZzNcbiAgICAgKiBAcGFyYW0ge2FueX0gW2NhbGxiYWNrLmFyZzRdIGFyZzRcbiAgICAgKiBAcGFyYW0ge2FueX0gW2NhbGxiYWNrLmFyZzVdIGFyZzVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW3RhcmdldF0gLSBUaGUgdGFyZ2V0ICh0aGlzIG9iamVjdCkgdG8gaW52b2tlIHRoZSBjYWxsYmFjaywgY2FuIGJlIG51bGxcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gLSBKdXN0IHJldHVybnMgdGhlIGluY29taW5nIGNhbGxiYWNrIHNvIHlvdSBjYW4gc2F2ZSB0aGUgYW5vbnltb3VzIGZ1bmN0aW9uIGVhc2llci5cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIG9uPFQgZXh0ZW5kcyBGdW5jdGlvbj4odHlwZTogc3RyaW5nLCBjYWxsYmFjazogVCwgdGFyZ2V0PzogYW55LCB1c2VDYXB0dXJlPzogYm9vbGVhbik6IFRcbiAgICAgKi9cbiAgICBvbiAodHlwZSwgY2FsbGJhY2ssIHRhcmdldCwgb25jZSkge1xuICAgICAgICAvLyBNYWtlIHN1cmUgRVZFTlRfRU5HSU5FX0lOSVRFRCBhbmQgRVZFTlRfR0FNRV9JTklURUQgY2FsbGJhY2tzIHRvIGJlIGludm9rZWRcbiAgICAgICAgaWYgKCh0aGlzLl9wcmVwYXJlZCAmJiB0eXBlID09PSB0aGlzLkVWRU5UX0VOR0lORV9JTklURUQpIHx8XG4gICAgICAgICAgICAoIXRoaXMuX3BhdXNlZCAmJiB0eXBlID09PSB0aGlzLkVWRU5UX0dBTUVfSU5JVEVEKSkge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbCh0YXJnZXQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ldmVudFRhcmdldE9uKHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQsIG9uY2UpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmVnaXN0ZXIgYW4gY2FsbGJhY2sgb2YgYSBzcGVjaWZpYyBldmVudCB0eXBlIG9uIHRoZSBnYW1lIG9iamVjdCxcbiAgICAgKiB0aGUgY2FsbGJhY2sgd2lsbCByZW1vdmUgaXRzZWxmIGFmdGVyIHRoZSBmaXJzdCB0aW1lIGl0IGlzIHRyaWdnZXJlZC5cbiAgICAgKiAhI3poXG4gICAgICog5rOo5YaMIGdhbWUg55qE54m55a6a5LqL5Lu257G75Z6L5Zue6LCD77yM5Zue6LCD5Lya5Zyo56ys5LiA5pe26Ze06KKr6Kem5Y+R5ZCO5Yig6Zmk6Ieq6Lqr44CCXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIG9uY2VcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgZXZlbnQgdHlwZSB0byBsaXN0ZW4gZm9yLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRoYXQgd2lsbCBiZSBpbnZva2VkIHdoZW4gdGhlIGV2ZW50IGlzIGRpc3BhdGNoZWQuXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgY2FsbGJhY2sgaXMgaWdub3JlZCBpZiBpdCBpcyBhIGR1cGxpY2F0ZSAodGhlIGNhbGxiYWNrcyBhcmUgdW5pcXVlKS5cbiAgICAgKiBAcGFyYW0ge2FueX0gW2NhbGxiYWNrLmFyZzFdIGFyZzFcbiAgICAgKiBAcGFyYW0ge2FueX0gW2NhbGxiYWNrLmFyZzJdIGFyZzJcbiAgICAgKiBAcGFyYW0ge2FueX0gW2NhbGxiYWNrLmFyZzNdIGFyZzNcbiAgICAgKiBAcGFyYW0ge2FueX0gW2NhbGxiYWNrLmFyZzRdIGFyZzRcbiAgICAgKiBAcGFyYW0ge2FueX0gW2NhbGxiYWNrLmFyZzVdIGFyZzVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW3RhcmdldF0gLSBUaGUgdGFyZ2V0ICh0aGlzIG9iamVjdCkgdG8gaW52b2tlIHRoZSBjYWxsYmFjaywgY2FuIGJlIG51bGxcbiAgICAgKi9cbiAgICBvbmNlICh0eXBlLCBjYWxsYmFjaywgdGFyZ2V0KSB7XG4gICAgICAgIC8vIE1ha2Ugc3VyZSBFVkVOVF9FTkdJTkVfSU5JVEVEIGFuZCBFVkVOVF9HQU1FX0lOSVRFRCBjYWxsYmFja3MgdG8gYmUgaW52b2tlZFxuICAgICAgICBpZiAoKHRoaXMuX3ByZXBhcmVkICYmIHR5cGUgPT09IHRoaXMuRVZFTlRfRU5HSU5FX0lOSVRFRCkgfHxcbiAgICAgICAgICAgICghdGhpcy5fcGF1c2VkICYmIHR5cGUgPT09IHRoaXMuRVZFTlRfR0FNRV9JTklURUQpKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50VGFyZ2V0T25jZSh0eXBlLCBjYWxsYmFjaywgdGFyZ2V0KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFByZXBhcmUgZ2FtZS5cbiAgICAgKiAhI3poIOWHhuWkh+W8leaTju+8jOivt+S4jeimgeebtOaOpeiwg+eUqOi/meS4quWHveaVsOOAglxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNiXG4gICAgICogQG1ldGhvZCBwcmVwYXJlXG4gICAgICovXG4gICAgcHJlcGFyZSAoY2IpIHtcbiAgICAgICAgLy8gQWxyZWFkeSBwcmVwYXJlZFxuICAgICAgICBpZiAodGhpcy5fcHJlcGFyZWQpIHtcbiAgICAgICAgICAgIGlmIChjYikgY2IoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIExvYWQgZ2FtZSBzY3JpcHRzXG4gICAgICAgIGxldCBqc0xpc3QgPSB0aGlzLmNvbmZpZy5qc0xpc3Q7XG4gICAgICAgIGlmIChqc0xpc3QgJiYganNMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNjLmxvYWRlci5sb2FkKGpzTGlzdCwgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHRocm93IG5ldyBFcnJvcihKU09OLnN0cmluZ2lmeShlcnIpKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX2xvYWRQcmV2aWV3U2NyaXB0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJlcGFyZUZpbmlzaGVkKGNiKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9sb2FkUHJldmlld1NjcmlwdCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJlcGFyZUZpbmlzaGVkKGNiKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSdW4gZ2FtZSB3aXRoIGNvbmZpZ3VyYXRpb24gb2JqZWN0IGFuZCBvblN0YXJ0IGZ1bmN0aW9uLlxuICAgICAqICEjemgg6L+Q6KGM5ri45oiP77yM5bm25LiU5oyH5a6a5byV5pOO6YWN572u5ZKMIG9uU3RhcnQg55qE5Zue6LCD44CCXG4gICAgICogQG1ldGhvZCBydW5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIC0gUGFzcyBjb25maWd1cmF0aW9uIG9iamVjdCBvciBvblN0YXJ0IGZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gb25TdGFydCAtIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIGFmdGVyIGdhbWUgaW5pdGlhbGl6ZWRcbiAgICAgKi9cbiAgICBydW46IGZ1bmN0aW9uIChjb25maWcsIG9uU3RhcnQpIHtcbiAgICAgICAgdGhpcy5faW5pdENvbmZpZyhjb25maWcpO1xuICAgICAgICB0aGlzLm9uU3RhcnQgPSBvblN0YXJ0O1xuICAgICAgICB0aGlzLnByZXBhcmUoZ2FtZS5vblN0YXJ0ICYmIGdhbWUub25TdGFydC5iaW5kKGdhbWUpKTtcbiAgICB9LFxuXG4vLyAgQCBQZXJzaXN0IHJvb3Qgbm9kZSBzZWN0aW9uXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEFkZCBhIHBlcnNpc3RlbnQgcm9vdCBub2RlIHRvIHRoZSBnYW1lLCB0aGUgcGVyc2lzdGVudCBub2RlIHdvbid0IGJlIGRlc3Ryb3llZCBkdXJpbmcgc2NlbmUgdHJhbnNpdGlvbi48YnIvPlxuICAgICAqIFRoZSB0YXJnZXQgbm9kZSBtdXN0IGJlIHBsYWNlZCBpbiB0aGUgcm9vdCBsZXZlbCBvZiBoaWVyYXJjaHksIG90aGVyd2lzZSB0aGlzIEFQSSB3b24ndCBoYXZlIGFueSBlZmZlY3QuXG4gICAgICogISN6aFxuICAgICAqIOWjsOaYjuW4uOmpu+agueiKgueCue+8jOivpeiKgueCueS4jeS8muiiq+WcqOWcuuaZr+WIh+aNouS4reiiq+mUgOavgeOAgjxici8+XG4gICAgICog55uu5qCH6IqC54K55b+F6aG75L2N5LqO5Li65bGC57qn55qE5qC56IqC54K577yM5ZCm5YiZ5peg5pWI44CCXG4gICAgICogQG1ldGhvZCBhZGRQZXJzaXN0Um9vdE5vZGVcbiAgICAgKiBAcGFyYW0ge05vZGV9IG5vZGUgLSBUaGUgbm9kZSB0byBiZSBtYWRlIHBlcnNpc3RlbnRcbiAgICAgKi9cbiAgICBhZGRQZXJzaXN0Um9vdE5vZGU6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIGlmICghY2MuTm9kZS5pc05vZGUobm9kZSkgfHwgIW5vZGUudXVpZCkge1xuICAgICAgICAgICAgY2Mud2FybklEKDM4MDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpZCA9IG5vZGUudXVpZDtcbiAgICAgICAgaWYgKCF0aGlzLl9wZXJzaXN0Um9vdE5vZGVzW2lkXSkge1xuICAgICAgICAgICAgdmFyIHNjZW5lID0gY2MuZGlyZWN0b3IuX3NjZW5lO1xuICAgICAgICAgICAgaWYgKGNjLmlzVmFsaWQoc2NlbmUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFub2RlLnBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICBub2RlLnBhcmVudCA9IHNjZW5lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICggIShub2RlLnBhcmVudCBpbnN0YW5jZW9mIGNjLlNjZW5lKSApIHtcbiAgICAgICAgICAgICAgICAgICAgY2Mud2FybklEKDM4MDEpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG5vZGUucGFyZW50ICE9PSBzY2VuZSkge1xuICAgICAgICAgICAgICAgICAgICBjYy53YXJuSUQoMzgwMik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9wZXJzaXN0Um9vdE5vZGVzW2lkXSA9IG5vZGU7XG4gICAgICAgICAgICBub2RlLl9wZXJzaXN0Tm9kZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZW1vdmUgYSBwZXJzaXN0ZW50IHJvb3Qgbm9kZS5cbiAgICAgKiAhI3poIOWPlua2iOW4uOmpu+agueiKgueCueOAglxuICAgICAqIEBtZXRob2QgcmVtb3ZlUGVyc2lzdFJvb3ROb2RlXG4gICAgICogQHBhcmFtIHtOb2RlfSBub2RlIC0gVGhlIG5vZGUgdG8gYmUgcmVtb3ZlZCBmcm9tIHBlcnNpc3RlbnQgbm9kZSBsaXN0XG4gICAgICovXG4gICAgcmVtb3ZlUGVyc2lzdFJvb3ROb2RlOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICB2YXIgaWQgPSBub2RlLnV1aWQgfHwgJyc7XG4gICAgICAgIGlmIChub2RlID09PSB0aGlzLl9wZXJzaXN0Um9vdE5vZGVzW2lkXSkge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3BlcnNpc3RSb290Tm9kZXNbaWRdO1xuICAgICAgICAgICAgbm9kZS5fcGVyc2lzdE5vZGUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENoZWNrIHdoZXRoZXIgdGhlIG5vZGUgaXMgYSBwZXJzaXN0ZW50IHJvb3Qgbm9kZS5cbiAgICAgKiAhI3poIOajgOafpeiKgueCueaYr+WQpuaYr+W4uOmpu+agueiKgueCueOAglxuICAgICAqIEBtZXRob2QgaXNQZXJzaXN0Um9vdE5vZGVcbiAgICAgKiBAcGFyYW0ge05vZGV9IG5vZGUgLSBUaGUgbm9kZSB0byBiZSBjaGVja2VkXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpc1BlcnNpc3RSb290Tm9kZTogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIG5vZGUuX3BlcnNpc3ROb2RlO1xuICAgIH0sXG5cbi8vQFByaXZhdGUgTWV0aG9kc1xuXG4vLyAgQFRpbWUgdGlja2VyIHNlY3Rpb25cbiAgICBfc2V0QW5pbUZyYW1lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2xhc3RUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIHZhciBmcmFtZVJhdGUgPSBnYW1lLmNvbmZpZy5mcmFtZVJhdGU7XG4gICAgICAgIHRoaXMuX2ZyYW1lVGltZSA9IDEwMDAgLyBmcmFtZVJhdGU7XG4gICAgICAgIGNjLmRpcmVjdG9yLl9tYXhQYXJ0aWNsZURlbHRhVGltZSA9IHRoaXMuX2ZyYW1lVGltZSAvIDEwMDAgKiAyO1xuICAgICAgICBpZiAoQ0NfSlNCIHx8IENDX1JVTlRJTUUpIHtcbiAgICAgICAgICAgIGpzYi5zZXRQcmVmZXJyZWRGcmFtZXNQZXJTZWNvbmQoZnJhbWVSYXRlKTtcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbUZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTtcbiAgICAgICAgICAgIHdpbmRvdy5jYW5jZWxBbmltRnJhbWUgPSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoZnJhbWVSYXRlICE9PSA2MCAmJiBmcmFtZVJhdGUgIT09IDMwKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltRnJhbWUgPSB0aGlzLl9zdFRpbWU7XG4gICAgICAgICAgICAgICAgd2luZG93LmNhbmNlbEFuaW1GcmFtZSA9IHRoaXMuX2N0VGltZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbUZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICAgICAgd2luZG93Lm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICB0aGlzLl9zdFRpbWU7XG4gICAgICAgICAgICAgICAgd2luZG93LmNhbmNlbEFuaW1GcmFtZSA9IHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICAgIHdpbmRvdy5jYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICB3aW5kb3cubXNDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICB3aW5kb3cubW96Q2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICAgICAgd2luZG93Lm9DYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICB3aW5kb3cud2Via2l0Q2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICAgICAgd2luZG93Lm1zQ2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICB3aW5kb3cubW96Q2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICB3aW5kb3cud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICB3aW5kb3cub0NhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICAgICAgdGhpcy5fY3RUaW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBfc3RUaW1lOiBmdW5jdGlvbihjYWxsYmFjayl7XG4gICAgICAgIHZhciBjdXJyVGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICB2YXIgdGltZVRvQ2FsbCA9IE1hdGgubWF4KDAsIGdhbWUuX2ZyYW1lVGltZSAtIChjdXJyVGltZSAtIGdhbWUuX2xhc3RUaW1lKSk7XG4gICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBjYWxsYmFjaygpOyB9LFxuICAgICAgICAgICAgdGltZVRvQ2FsbCk7XG4gICAgICAgIGdhbWUuX2xhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xuICAgICAgICByZXR1cm4gaWQ7XG4gICAgfSxcbiAgICBfY3RUaW1lOiBmdW5jdGlvbihpZCl7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQoaWQpO1xuICAgIH0sXG4gICAgLy9SdW4gZ2FtZS5cbiAgICBfcnVuTWFpbkxvb3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fcHJlcGFyZWQpIHJldHVybjtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXMsIGNhbGxiYWNrLCBjb25maWcgPSBzZWxmLmNvbmZpZyxcbiAgICAgICAgICAgIGRpcmVjdG9yID0gY2MuZGlyZWN0b3IsXG4gICAgICAgICAgICBza2lwID0gdHJ1ZSwgZnJhbWVSYXRlID0gY29uZmlnLmZyYW1lUmF0ZTtcblxuICAgICAgICBkZWJ1Zy5zZXREaXNwbGF5U3RhdHMoY29uZmlnLnNob3dGUFMpO1xuXG4gICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24gKG5vdykge1xuICAgICAgICAgICAgaWYgKCFzZWxmLl9wYXVzZWQpIHtcbiAgICAgICAgICAgICAgICBzZWxmLl9pbnRlcnZhbElkID0gd2luZG93LnJlcXVlc3RBbmltRnJhbWUoY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIGlmICghQ0NfSlNCICYmICFDQ19SVU5USU1FICYmIGZyYW1lUmF0ZSA9PT0gMzApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNraXAgPSAhc2tpcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRpcmVjdG9yLm1haW5Mb29wKG5vdyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgc2VsZi5faW50ZXJ2YWxJZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbUZyYW1lKGNhbGxiYWNrKTtcbiAgICAgICAgc2VsZi5fcGF1c2VkID0gZmFsc2U7XG4gICAgfSxcblxuLy8gIEBHYW1lIGxvYWRpbmcgc2VjdGlvblxuICAgIF9pbml0Q29uZmlnIChjb25maWcpIHtcbiAgICAgICAgLy8gQ29uZmlncyBhZGp1c3RtZW50XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLmRlYnVnTW9kZSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGNvbmZpZy5kZWJ1Z01vZGUgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGNvbmZpZy5leHBvc2VDbGFzc05hbWUgPSAhIWNvbmZpZy5leHBvc2VDbGFzc05hbWU7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLmZyYW1lUmF0ZSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGNvbmZpZy5mcmFtZVJhdGUgPSA2MDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcmVuZGVyTW9kZSA9IGNvbmZpZy5yZW5kZXJNb2RlO1xuICAgICAgICBpZiAodHlwZW9mIHJlbmRlck1vZGUgIT09ICdudW1iZXInIHx8IHJlbmRlck1vZGUgPiAyIHx8IHJlbmRlck1vZGUgPCAwKSB7XG4gICAgICAgICAgICBjb25maWcucmVuZGVyTW9kZSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcucmVnaXN0ZXJTeXN0ZW1FdmVudCAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICBjb25maWcucmVnaXN0ZXJTeXN0ZW1FdmVudCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbmRlck1vZGUgPT09IDEpIHtcbiAgICAgICAgICAgIGNvbmZpZy5zaG93RlBTID0gZmFsc2U7ICAgIFxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uZmlnLnNob3dGUFMgPSAhIWNvbmZpZy5zaG93RlBTO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2NlbmUgcGFyc2VyXG4gICAgICAgIHRoaXMuX3NjZW5lSW5mb3MgPSBjb25maWcuc2NlbmVzIHx8IFtdO1xuXG4gICAgICAgIC8vIENvbGxpZGUgTWFwIGFuZCBHcm91cCBMaXN0XG4gICAgICAgIHRoaXMuY29sbGlzaW9uTWF0cml4ID0gY29uZmlnLmNvbGxpc2lvbk1hdHJpeCB8fCBbXTtcbiAgICAgICAgdGhpcy5ncm91cExpc3QgPSBjb25maWcuZ3JvdXBMaXN0IHx8IFtdO1xuXG4gICAgICAgIGRlYnVnLl9yZXNldERlYnVnU2V0dGluZyhjb25maWcuZGVidWdNb2RlKTtcblxuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgdGhpcy5fY29uZmlnTG9hZGVkID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgX2RldGVybWluZVJlbmRlclR5cGUgKCkge1xuICAgICAgICBsZXQgY29uZmlnID0gdGhpcy5jb25maWcsXG4gICAgICAgICAgICB1c2VyUmVuZGVyTW9kZSA9IHBhcnNlSW50KGNvbmZpZy5yZW5kZXJNb2RlKSB8fCAwO1xuICAgIFxuICAgICAgICAvLyBEZXRlcm1pbmUgUmVuZGVyVHlwZVxuICAgICAgICB0aGlzLnJlbmRlclR5cGUgPSB0aGlzLlJFTkRFUl9UWVBFX0NBTlZBUztcbiAgICAgICAgbGV0IHN1cHBvcnRSZW5kZXIgPSBmYWxzZTtcbiAgICBcbiAgICAgICAgaWYgKHVzZXJSZW5kZXJNb2RlID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoY2Muc3lzLmNhcGFiaWxpdGllc1snb3BlbmdsJ10pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclR5cGUgPSB0aGlzLlJFTkRFUl9UWVBFX1dFQkdMO1xuICAgICAgICAgICAgICAgIHN1cHBvcnRSZW5kZXIgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2Muc3lzLmNhcGFiaWxpdGllc1snY2FudmFzJ10pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclR5cGUgPSB0aGlzLlJFTkRFUl9UWVBFX0NBTlZBUztcbiAgICAgICAgICAgICAgICBzdXBwb3J0UmVuZGVyID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh1c2VyUmVuZGVyTW9kZSA9PT0gMSAmJiBjYy5zeXMuY2FwYWJpbGl0aWVzWydjYW52YXMnXSkge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJUeXBlID0gdGhpcy5SRU5ERVJfVFlQRV9DQU5WQVM7XG4gICAgICAgICAgICBzdXBwb3J0UmVuZGVyID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh1c2VyUmVuZGVyTW9kZSA9PT0gMiAmJiBjYy5zeXMuY2FwYWJpbGl0aWVzWydvcGVuZ2wnXSkge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJUeXBlID0gdGhpcy5SRU5ERVJfVFlQRV9XRUJHTDtcbiAgICAgICAgICAgIHN1cHBvcnRSZW5kZXIgPSB0cnVlO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIGlmICghc3VwcG9ydFJlbmRlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGRlYnVnLmdldEVycm9yKDM4MjAsIHVzZXJSZW5kZXJNb2RlKSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2luaXRSZW5kZXJlciAoKSB7XG4gICAgICAgIC8vIEF2b2lkIHNldHVwIHRvIGJlIGNhbGxlZCB0d2ljZS5cbiAgICAgICAgaWYgKHRoaXMuX3JlbmRlcmVySW5pdGlhbGl6ZWQpIHJldHVybjtcblxuICAgICAgICBsZXQgZWwgPSB0aGlzLmNvbmZpZy5pZCxcbiAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsXG4gICAgICAgICAgICBsb2NhbENhbnZhcywgbG9jYWxDb250YWluZXI7XG5cbiAgICAgICAgaWYgKENDX0pTQiB8fCBDQ19SVU5USU1FKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGxvY2FsQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkRJVlwiKTtcbiAgICAgICAgICAgIHRoaXMuZnJhbWUgPSBsb2NhbENvbnRhaW5lci5wYXJlbnROb2RlID09PSBkb2N1bWVudC5ib2R5ID8gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IDogbG9jYWxDb250YWluZXIucGFyZW50Tm9kZTtcbiAgICAgICAgICAgIGxvY2FsQ2FudmFzID0gd2luZG93Ll9fY2FudmFzO1xuICAgICAgICAgICAgdGhpcy5jYW52YXMgPSBsb2NhbENhbnZhcztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gKGVsIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpID8gZWwgOiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbCkgfHwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyBlbCkpO1xuXG4gICAgICAgICAgICBpZiAoZWxlbWVudC50YWdOYW1lID09PSBcIkNBTlZBU1wiKSB7XG4gICAgICAgICAgICAgICAgd2lkdGggPSBlbGVtZW50LndpZHRoO1xuICAgICAgICAgICAgICAgIGhlaWdodCA9IGVsZW1lbnQuaGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgLy9pdCBpcyBhbHJlYWR5IGEgY2FudmFzLCB3ZSB3cmFwIGl0IGFyb3VuZCB3aXRoIGEgZGl2XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMgPSBsb2NhbENhbnZhcyA9IGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBsb2NhbENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJESVZcIik7XG4gICAgICAgICAgICAgICAgaWYgKGxvY2FsQ2FudmFzLnBhcmVudE5vZGUpXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsQ2FudmFzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGxvY2FsQ29udGFpbmVyLCBsb2NhbENhbnZhcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vd2UgbXVzdCBtYWtlIGEgbmV3IGNhbnZhcyBhbmQgcGxhY2UgaW50byB0aGlzIGVsZW1lbnRcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC50YWdOYW1lICE9PSBcIkRJVlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLndhcm5JRCgzODE5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgd2lkdGggPSBlbGVtZW50LmNsaWVudFdpZHRoO1xuICAgICAgICAgICAgICAgIGhlaWdodCA9IGVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzID0gbG9jYWxDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiQ0FOVkFTXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gbG9jYWxDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiRElWXCIpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQobG9jYWxDb250YWluZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbG9jYWxDb250YWluZXIuc2V0QXR0cmlidXRlKCdpZCcsICdDb2NvczJkR2FtZUNvbnRhaW5lcicpO1xuICAgICAgICAgICAgbG9jYWxDb250YWluZXIuYXBwZW5kQ2hpbGQobG9jYWxDYW52YXMpO1xuICAgICAgICAgICAgdGhpcy5mcmFtZSA9IChsb2NhbENvbnRhaW5lci5wYXJlbnROb2RlID09PSBkb2N1bWVudC5ib2R5KSA/IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCA6IGxvY2FsQ29udGFpbmVyLnBhcmVudE5vZGU7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGFkZENsYXNzIChlbGVtZW50LCBuYW1lKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhhc0NsYXNzID0gKCcgJyArIGVsZW1lbnQuY2xhc3NOYW1lICsgJyAnKS5pbmRleE9mKCcgJyArIG5hbWUgKyAnICcpID4gLTE7XG4gICAgICAgICAgICAgICAgaWYgKCFoYXNDbGFzcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5jbGFzc05hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lICs9IFwiIFwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lICs9IG5hbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWRkQ2xhc3MobG9jYWxDYW52YXMsIFwiZ2FtZUNhbnZhc1wiKTtcbiAgICAgICAgICAgIGxvY2FsQ2FudmFzLnNldEF0dHJpYnV0ZShcIndpZHRoXCIsIHdpZHRoIHx8IDQ4MCk7XG4gICAgICAgICAgICBsb2NhbENhbnZhcy5zZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIiwgaGVpZ2h0IHx8IDMyMCk7XG4gICAgICAgICAgICBsb2NhbENhbnZhcy5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCA5OSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9kZXRlcm1pbmVSZW5kZXJUeXBlKCk7XG4gICAgICAgIC8vIFdlYkdMIGNvbnRleHQgY3JlYXRlZCBzdWNjZXNzZnVsbHlcbiAgICAgICAgaWYgKHRoaXMucmVuZGVyVHlwZSA9PT0gdGhpcy5SRU5ERVJfVFlQRV9XRUJHTCkge1xuICAgICAgICAgICAgdmFyIG9wdHMgPSB7XG4gICAgICAgICAgICAgICAgJ3N0ZW5jaWwnOiB0cnVlLFxuICAgICAgICAgICAgICAgIC8vIE1TQUEgaXMgY2F1c2luZyBzZXJpb3VzIHBlcmZvcm1hbmNlIGRyb3Bkb3duIG9uIHNvbWUgYnJvd3NlcnMuXG4gICAgICAgICAgICAgICAgJ2FudGlhbGlhcyc6IGNjLm1hY3JvLkVOQUJMRV9XRUJHTF9BTlRJQUxJQVMsXG4gICAgICAgICAgICAgICAgJ2FscGhhJzogY2MubWFjcm8uRU5BQkxFX1RSQU5TUEFSRU5UX0NBTlZBU1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlbmRlcmVyLmluaXRXZWJHTChsb2NhbENhbnZhcywgb3B0cyk7XG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJDb250ZXh0ID0gcmVuZGVyZXIuZGV2aWNlLl9nbDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gRW5hYmxlIGR5bmFtaWMgYXRsYXMgbWFuYWdlciBieSBkZWZhdWx0XG4gICAgICAgICAgICBpZiAoIWNjLm1hY3JvLkNMRUFOVVBfSU1BR0VfQ0FDSEUgJiYgZHluYW1pY0F0bGFzTWFuYWdlcikge1xuICAgICAgICAgICAgICAgIGR5bmFtaWNBdGxhc01hbmFnZXIuZW5hYmxlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9yZW5kZXJDb250ZXh0KSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlclR5cGUgPSB0aGlzLlJFTkRFUl9UWVBFX0NBTlZBUztcbiAgICAgICAgICAgIC8vIENvdWxkIGJlIGlnbm9yZWQgYnkgbW9kdWxlIHNldHRpbmdzXG4gICAgICAgICAgICByZW5kZXJlci5pbml0Q2FudmFzKGxvY2FsQ2FudmFzKTtcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlckNvbnRleHQgPSByZW5kZXJlci5kZXZpY2UuX2N0eDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2FudmFzLm9uY29udGV4dG1lbnUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIWNjLl9pc0NvbnRleHRNZW51RW5hYmxlKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fcmVuZGVyZXJJbml0aWFsaXplZCA9IHRydWU7XG4gICAgfSxcblxuICAgIF9pbml0RXZlbnRzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB3aW4gPSB3aW5kb3csIGhpZGRlblByb3BOYW1lO1xuXG4gICAgICAgIC8vIHJlZ2lzdGVyIHN5c3RlbSBldmVudHNcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnJlZ2lzdGVyU3lzdGVtRXZlbnQpXG4gICAgICAgICAgICBfY2MuaW5wdXRNYW5hZ2VyLnJlZ2lzdGVyU3lzdGVtRXZlbnQodGhpcy5jYW52YXMpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZG9jdW1lbnQuaGlkZGVuICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaGlkZGVuUHJvcE5hbWUgPSBcImhpZGRlblwiO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkb2N1bWVudC5tb3pIaWRkZW4gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBoaWRkZW5Qcm9wTmFtZSA9IFwibW96SGlkZGVuXCI7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGRvY3VtZW50Lm1zSGlkZGVuICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaGlkZGVuUHJvcE5hbWUgPSBcIm1zSGlkZGVuXCI7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGRvY3VtZW50LndlYmtpdEhpZGRlbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGhpZGRlblByb3BOYW1lID0gXCJ3ZWJraXRIaWRkZW5cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBoaWRkZW4gPSBmYWxzZTtcblxuICAgICAgICBmdW5jdGlvbiBvbkhpZGRlbiAoKSB7XG4gICAgICAgICAgICBpZiAoIWhpZGRlbikge1xuICAgICAgICAgICAgICAgIGhpZGRlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgZ2FtZS5lbWl0KGdhbWUuRVZFTlRfSElERSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gSW4gb3JkZXIgdG8gYWRhcHQgdGhlIG1vc3Qgb2YgcGxhdGZvcm1zIHRoZSBvbnNob3cgQVBJLlxuICAgICAgICBmdW5jdGlvbiBvblNob3duIChhcmcwLCBhcmcxLCBhcmcyLCBhcmczLCBhcmc0KSB7XG4gICAgICAgICAgICBpZiAoaGlkZGVuKSB7XG4gICAgICAgICAgICAgICAgaGlkZGVuID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZ2FtZS5lbWl0KGdhbWUuRVZFTlRfU0hPVywgYXJnMCwgYXJnMSwgYXJnMiwgYXJnMywgYXJnNCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGlkZGVuUHJvcE5hbWUpIHtcbiAgICAgICAgICAgIHZhciBjaGFuZ2VMaXN0ID0gW1xuICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eWNoYW5nZVwiLFxuICAgICAgICAgICAgICAgIFwibW96dmlzaWJpbGl0eWNoYW5nZVwiLFxuICAgICAgICAgICAgICAgIFwibXN2aXNpYmlsaXR5Y2hhbmdlXCIsXG4gICAgICAgICAgICAgICAgXCJ3ZWJraXR2aXNpYmlsaXR5Y2hhbmdlXCIsXG4gICAgICAgICAgICAgICAgXCJxYnJvd3NlclZpc2liaWxpdHlDaGFuZ2VcIlxuICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hhbmdlTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoY2hhbmdlTGlzdFtpXSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2aXNpYmxlID0gZG9jdW1lbnRbaGlkZGVuUHJvcE5hbWVdO1xuICAgICAgICAgICAgICAgICAgICAvLyBRUSBBcHBcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJsZSA9IHZpc2libGUgfHwgZXZlbnRbXCJoaWRkZW5cIl07XG4gICAgICAgICAgICAgICAgICAgIGlmICh2aXNpYmxlKVxuICAgICAgICAgICAgICAgICAgICAgICAgb25IaWRkZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgb25TaG93bigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2luLmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIG9uSGlkZGVuKTtcbiAgICAgICAgICAgIHdpbi5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgb25TaG93bik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTWljcm9NZXNzZW5nZXJcIikgPiAtMSkge1xuICAgICAgICAgICAgd2luLm9uZm9jdXMgPSBvblNob3duO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFwib25wYWdlc2hvd1wiIGluIHdpbmRvdyAmJiBcIm9ucGFnZWhpZGVcIiBpbiB3aW5kb3cpIHtcbiAgICAgICAgICAgIHdpbi5hZGRFdmVudExpc3RlbmVyKFwicGFnZWhpZGVcIiwgb25IaWRkZW4pO1xuICAgICAgICAgICAgd2luLmFkZEV2ZW50TGlzdGVuZXIoXCJwYWdlc2hvd1wiLCBvblNob3duKTtcbiAgICAgICAgICAgIC8vIFRhb2JhbyBVSVdlYktpdFxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInBhZ2VoaWRlXCIsIG9uSGlkZGVuKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJwYWdlc2hvd1wiLCBvblNob3duKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub24oZ2FtZS5FVkVOVF9ISURFLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBnYW1lLnBhdXNlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm9uKGdhbWUuRVZFTlRfU0hPVywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZ2FtZS5yZXN1bWUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuRXZlbnRUYXJnZXQuY2FsbChnYW1lKTtcbmNjLmpzLmFkZG9uKGdhbWUsIEV2ZW50VGFyZ2V0LnByb3RvdHlwZSk7XG5cbi8qKlxuICogQG1vZHVsZSBjY1xuICovXG5cbi8qKlxuICogISNlbiBUaGlzIGlzIGEgR2FtZSBpbnN0YW5jZS5cbiAqICEjemgg6L+Z5piv5LiA5LiqIEdhbWUg57G755qE5a6e5L6L77yM5YyF5ZCr5ri45oiP5Li75L2T5L+h5oGv5bm26LSf6LSj6amx5Yqo5ri45oiP55qE5ri45oiP5a+56LGh44CC44CCXG4gKiBAcHJvcGVydHkgZ2FtZVxuICogQHR5cGUgR2FtZVxuICovXG5jYy5nYW1lID0gbW9kdWxlLmV4cG9ydHMgPSBnYW1lO1xuIl19