
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/CCDirector.js';
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
var EventTarget = require('./event/event-target');

var AutoReleaseUtils = require('./load-pipeline/auto-release-utils');

var ComponentScheduler = require('./component-scheduler');

var NodeActivator = require('./node-activator');

var Obj = require('./platform/CCObject');

var game = require('./CCGame');

var renderer = require('./renderer');

var eventManager = require('./event-manager');

var Scheduler = require('./CCScheduler'); //----------------------------------------------------------------------------------------------------------------------

/**
 * !#en
 * <p>
 *    ATTENTION: USE cc.director INSTEAD OF cc.Director.<br/>
 *    cc.director is a singleton object which manage your game's logic flow.<br/>
 *    Since the cc.director is a singleton, you don't need to call any constructor or create functions,<br/>
 *    the standard way to use it is by calling:<br/>
 *      - cc.director.methodName(); <br/>
 *
 *    It creates and handle the main Window and manages how and when to execute the Scenes.<br/>
 *    <br/>
 *    The cc.director is also responsible for:<br/>
 *      - initializing the OpenGL context<br/>
 *      - setting the OpenGL pixel format (default on is RGB565)<br/>
 *      - setting the OpenGL buffer depth (default on is 0-bit)<br/>
 *      - setting the color for clear screen (default one is BLACK)<br/>
 *      - setting the projection (default one is 3D)<br/>
 *      - setting the orientation (default one is Portrait)<br/>
 *      <br/>
 *    <br/>
 *    The cc.director also sets the default OpenGL context:<br/>
 *      - GL_TEXTURE_2D is enabled<br/>
 *      - GL_VERTEX_ARRAY is enabled<br/>
 *      - GL_COLOR_ARRAY is enabled<br/>
 *      - GL_TEXTURE_COORD_ARRAY is enabled<br/>
 * </p>
 * <p>
 *   cc.director also synchronizes timers with the refresh rate of the display.<br/>
 *   Features and Limitations:<br/>
 *      - Scheduled timers & drawing are synchronizes with the refresh rate of the display<br/>
 *      - Only supports animation intervals of 1/60 1/30 & 1/15<br/>
 * </p>
 *
 * !#zh
 * <p>
 *     注意：用 cc.director 代替 cc.Director。<br/>
 *     cc.director 一个管理你的游戏的逻辑流程的单例对象。<br/>
 *     由于 cc.director 是一个单例，你不需要调用任何构造函数或创建函数，<br/>
 *     使用它的标准方法是通过调用：<br/>
 *       - cc.director.methodName();
 *     <br/>
 *     它创建和处理主窗口并且管理什么时候执行场景。<br/>
 *     <br/>
 *     cc.director 还负责：<br/>
 *      - 初始化 OpenGL 环境。<br/>
 *      - 设置OpenGL像素格式。(默认是 RGB565)<br/>
 *      - 设置OpenGL缓冲区深度 (默认是 0-bit)<br/>
 *      - 设置空白场景的颜色 (默认是 黑色)<br/>
 *      - 设置投影 (默认是 3D)<br/>
 *      - 设置方向 (默认是 Portrait)<br/>
 *    <br/>
 *    cc.director 设置了 OpenGL 默认环境 <br/>
 *      - GL_TEXTURE_2D   启用。<br/>
 *      - GL_VERTEX_ARRAY 启用。<br/>
 *      - GL_COLOR_ARRAY  启用。<br/>
 *      - GL_TEXTURE_COORD_ARRAY 启用。<br/>
 * </p>
 * <p>
 *   cc.director 也同步定时器与显示器的刷新速率。
 *   <br/>
 *   特点和局限性: <br/>
 *      - 将计时器 & 渲染与显示器的刷新频率同步。<br/>
 *      - 只支持动画的间隔 1/60 1/30 & 1/15。<br/>
 * </p>
 *
 * @class Director
 * @extends EventTarget
 */


cc.Director = function () {
  EventTarget.call(this); // paused?

  this._paused = false; // purge?

  this._purgeDirectorInNextLoop = false;
  this._winSizeInPoints = null; // scenes

  this._loadingScene = '';
  this._scene = null; // FPS

  this._totalFrames = 0;
  this._lastUpdate = 0;
  this._deltaTime = 0.0;
  this._startTime = 0.0; // ParticleSystem max step delta time

  this._maxParticleDeltaTime = 0.0; // Scheduler for user registration update

  this._scheduler = null; // Scheduler for life-cycle methods in component

  this._compScheduler = null; // Node activator

  this._nodeActivator = null; // Action manager

  this._actionManager = null;
  var self = this;
  game.on(game.EVENT_SHOW, function () {
    self._lastUpdate = performance.now();
  });
  game.once(game.EVENT_ENGINE_INITED, this.init, this);
};

cc.Director.prototype = {
  constructor: cc.Director,
  init: function init() {
    this._totalFrames = 0;
    this._lastUpdate = performance.now();
    this._startTime = this._lastUpdate;
    this._paused = false;
    this._purgeDirectorInNextLoop = false;
    this._winSizeInPoints = cc.size(0, 0);
    this._scheduler = new Scheduler();

    if (cc.ActionManager) {
      this._actionManager = new cc.ActionManager();

      this._scheduler.scheduleUpdate(this._actionManager, Scheduler.PRIORITY_SYSTEM, false);
    } else {
      this._actionManager = null;
    }

    this.sharedInit();
    return true;
  },

  /*
   * Manage all init process shared between the web engine and jsb engine.
   * All platform independent init process should be occupied here.
   */
  sharedInit: function sharedInit() {
    this._compScheduler = new ComponentScheduler();
    this._nodeActivator = new NodeActivator(); // Event manager

    if (eventManager) {
      eventManager.setEnabled(true);
    } // Animation manager


    if (cc.AnimationManager) {
      this._animationManager = new cc.AnimationManager();

      this._scheduler.scheduleUpdate(this._animationManager, Scheduler.PRIORITY_SYSTEM, false);
    } else {
      this._animationManager = null;
    } // collision manager


    if (cc.CollisionManager) {
      this._collisionManager = new cc.CollisionManager();

      this._scheduler.scheduleUpdate(this._collisionManager, Scheduler.PRIORITY_SYSTEM, false);
    } else {
      this._collisionManager = null;
    } // physics manager


    if (cc.PhysicsManager) {
      this._physicsManager = new cc.PhysicsManager();

      this._scheduler.scheduleUpdate(this._physicsManager, Scheduler.PRIORITY_SYSTEM, false);
    } else {
      this._physicsManager = null;
    } // physics 3d manager


    if (cc.Physics3DManager) {
      this._physics3DManager = new cc.Physics3DManager();

      this._scheduler.scheduleUpdate(this._physics3DManager, Scheduler.PRIORITY_SYSTEM, false);
    } else {
      this._physics3DManager = null;
    } // WidgetManager


    if (cc._widgetManager) {
      cc._widgetManager.init(this);
    }

    cc.loader.init(this);
  },

  /**
   * calculates delta time since last time it was called
   */
  calculateDeltaTime: function calculateDeltaTime(now) {
    if (!now) now = performance.now(); // avoid delta time from being negative
    // negative deltaTime would be caused by the precision of now's value, for details please see: https://developer.mozilla.org/zh-CN/docs/Web/API/window/requestAnimationFrame

    this._deltaTime = now > this._lastUpdate ? (now - this._lastUpdate) / 1000 : 0;
    if (CC_DEBUG && this._deltaTime > 1) this._deltaTime = 1 / 60.0;
    this._lastUpdate = now;
  },

  /**
   * !#en
   * Converts a view coordinate to an WebGL coordinate<br/>
   * Useful to convert (multi) touches coordinates to the current layout (portrait or landscape)<br/>
   * Implementation can be found in CCDirectorWebGL.
   * !#zh 将触摸点的屏幕坐标转换为 WebGL View 下的坐标。
   * @method convertToGL
   * @param {Vec2} uiPoint
   * @return {Vec2}
   * @deprecated since v2.0
   */
  convertToGL: function convertToGL(uiPoint) {
    var container = game.container;
    var view = cc.view;
    var box = container.getBoundingClientRect();
    var left = box.left + window.pageXOffset - container.clientLeft;
    var top = box.top + window.pageYOffset - container.clientTop;
    var x = view._devicePixelRatio * (uiPoint.x - left);
    var y = view._devicePixelRatio * (top + box.height - uiPoint.y);
    return view._isRotated ? cc.v2(view._viewportRect.width - y, x) : cc.v2(x, y);
  },

  /**
   * !#en
   * Converts an OpenGL coordinate to a view coordinate<br/>
   * Useful to convert node points to window points for calls such as glScissor<br/>
   * Implementation can be found in CCDirectorWebGL.
   * !#zh 将触摸点的 WebGL View 坐标转换为屏幕坐标。
   * @method convertToUI
   * @param {Vec2} glPoint
   * @return {Vec2}
   * @deprecated since v2.0
   */
  convertToUI: function convertToUI(glPoint) {
    var container = game.container;
    var view = cc.view;
    var box = container.getBoundingClientRect();
    var left = box.left + window.pageXOffset - container.clientLeft;
    var top = box.top + window.pageYOffset - container.clientTop;
    var uiPoint = cc.v2(0, 0);

    if (view._isRotated) {
      uiPoint.x = left + glPoint.y / view._devicePixelRatio;
      uiPoint.y = top + box.height - (view._viewportRect.width - glPoint.x) / view._devicePixelRatio;
    } else {
      uiPoint.x = left + glPoint.x * view._devicePixelRatio;
      uiPoint.y = top + box.height - glPoint.y * view._devicePixelRatio;
    }

    return uiPoint;
  },

  /**
   * End the life of director in the next frame
   * @method end
   */
  end: function end() {
    this._purgeDirectorInNextLoop = true;
  },

  /**
   * !#en
   * Returns the size of the WebGL view in points.<br/>
   * It takes into account any possible rotation (device orientation) of the window.
   * !#zh 获取视图的大小，以点为单位。
   * @method getWinSize
   * @return {Size}
   * @deprecated since v2.0
   */
  getWinSize: function getWinSize() {
    return cc.size(cc.winSize);
  },

  /**
   * !#en
   * Returns the size of the OpenGL view in pixels.<br/>
   * It takes into account any possible rotation (device orientation) of the window.<br/>
   * On Mac winSize and winSizeInPixels return the same value.
   * (The pixel here refers to the resource resolution. If you want to get the physics resolution of device, you need to use cc.view.getFrameSize())
   * !#zh
   * 获取视图大小，以像素为单位（这里的像素指的是资源分辨率。
   * 如果要获取屏幕物理分辨率，需要用 cc.view.getFrameSize()）
   * @method getWinSizeInPixels
   * @return {Size}
   * @deprecated since v2.0
   */
  getWinSizeInPixels: function getWinSizeInPixels() {
    return cc.size(cc.winSize);
  },

  /**
   * !#en Pause the director's ticker, only involve the game logic execution.
   * It won't pause the rendering process nor the event manager.
   * If you want to pause the entier game including rendering, audio and event, 
   * please use {{#crossLink "Game.pause"}}cc.game.pause{{/crossLink}}
   * !#zh 暂停正在运行的场景，该暂停只会停止游戏逻辑执行，但是不会停止渲染和 UI 响应。
   * 如果想要更彻底得暂停游戏，包含渲染，音频和事件，请使用 {{#crossLink "Game.pause"}}cc.game.pause{{/crossLink}}。
   * @method pause
   */
  pause: function pause() {
    if (this._paused) return;
    this._paused = true;
  },

  /**
   * Removes cached all cocos2d cached data.
   * @deprecated since v2.0
   */
  purgeCachedData: function purgeCachedData() {
    cc.loader.releaseAll();
  },

  /**
   * Purge the cc.director itself, including unschedule all schedule, remove all event listeners, clean up and exit the running scene, stops all animations, clear cached data.
   */
  purgeDirector: function purgeDirector() {
    //cleanup scheduler
    this._scheduler.unscheduleAll();

    this._compScheduler.unscheduleAll();

    this._nodeActivator.reset(); // Disable event dispatching


    if (eventManager) eventManager.setEnabled(false);

    if (!CC_EDITOR) {
      if (cc.isValid(this._scene)) {
        this._scene.destroy();
      }

      this._scene = null;
      cc.renderer.clear();
      cc.AssetLibrary.resetBuiltins();
    }

    cc.game.pause(); // Clear all caches

    cc.loader.releaseAll();
  },

  /**
   * Reset the cc.director, can be used to restart the director after purge
   */
  reset: function reset() {
    this.purgeDirector();
    if (eventManager) eventManager.setEnabled(true); // Action manager

    if (this._actionManager) {
      this._scheduler.scheduleUpdate(this._actionManager, cc.Scheduler.PRIORITY_SYSTEM, false);
    } // Animation manager


    if (this._animationManager) {
      this._scheduler.scheduleUpdate(this._animationManager, cc.Scheduler.PRIORITY_SYSTEM, false);
    } // Collider manager


    if (this._collisionManager) {
      this._scheduler.scheduleUpdate(this._collisionManager, cc.Scheduler.PRIORITY_SYSTEM, false);
    } // Physics manager


    if (this._physicsManager) {
      this._scheduler.scheduleUpdate(this._physicsManager, cc.Scheduler.PRIORITY_SYSTEM, false);
    }

    cc.game.resume();
  },

  /**
   * !#en
   * Run a scene. Replaces the running scene with a new one or enter the first scene.<br/>
   * The new scene will be launched immediately.
   * !#zh 立刻切换指定场景。
   * @method runSceneImmediate
   * @param {Scene} scene - The need run scene.
   * @param {Function} [onBeforeLoadScene] - The function invoked at the scene before loading.
   * @param {Function} [onLaunched] - The function invoked at the scene after launch.
   */
  runSceneImmediate: function runSceneImmediate(scene, onBeforeLoadScene, onLaunched) {
    cc.assertID(scene instanceof cc.Scene, 1216);
    CC_BUILD && CC_DEBUG && console.time('InitScene');

    scene._load(); // ensure scene initialized


    CC_BUILD && CC_DEBUG && console.timeEnd('InitScene'); // Re-attach or replace persist nodes

    CC_BUILD && CC_DEBUG && console.time('AttachPersist');
    var persistNodeList = Object.keys(game._persistRootNodes).map(function (x) {
      return game._persistRootNodes[x];
    });

    for (var i = 0; i < persistNodeList.length; i++) {
      var node = persistNodeList[i];
      var existNode = scene.getChildByUuid(node.uuid);

      if (existNode) {
        // scene also contains the persist node, select the old one
        var index = existNode.getSiblingIndex();

        existNode._destroyImmediate();

        scene.insertChild(node, index);
      } else {
        node.parent = scene;
      }
    }

    CC_BUILD && CC_DEBUG && console.timeEnd('AttachPersist');
    var oldScene = this._scene;

    if (!CC_EDITOR) {
      // auto release assets
      CC_BUILD && CC_DEBUG && console.time('AutoRelease');
      var autoReleaseAssets = oldScene && oldScene.autoReleaseAssets && oldScene.dependAssets;
      AutoReleaseUtils.autoRelease(autoReleaseAssets, scene.dependAssets, persistNodeList);
      CC_BUILD && CC_DEBUG && console.timeEnd('AutoRelease');
    } // unload scene


    CC_BUILD && CC_DEBUG && console.time('Destroy');

    if (cc.isValid(oldScene)) {
      oldScene.destroy();
    }

    this._scene = null; // purge destroyed nodes belongs to old scene

    Obj._deferredDestroy();

    CC_BUILD && CC_DEBUG && console.timeEnd('Destroy');

    if (onBeforeLoadScene) {
      onBeforeLoadScene();
    }

    this.emit(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, scene); // Run an Entity Scene

    this._scene = scene;
    CC_BUILD && CC_DEBUG && console.time('Activate');

    scene._activate();

    CC_BUILD && CC_DEBUG && console.timeEnd('Activate'); //start scene

    cc.game.resume();

    if (onLaunched) {
      onLaunched(null, scene);
    }

    this.emit(cc.Director.EVENT_AFTER_SCENE_LAUNCH, scene);
  },

  /**
   * !#en
   * Run a scene. Replaces the running scene with a new one or enter the first scene.
   * The new scene will be launched at the end of the current frame.
   * !#zh 运行指定场景。
   * @method runScene
   * @param {Scene} scene - The need run scene.
   * @param {Function} [onBeforeLoadScene] - The function invoked at the scene before loading.
   * @param {Function} [onLaunched] - The function invoked at the scene after launch.
   * @private
   */
  runScene: function runScene(scene, onBeforeLoadScene, onLaunched) {
    cc.assertID(scene, 1205);
    cc.assertID(scene instanceof cc.Scene, 1216); // ensure scene initialized

    scene._load(); // Delay run / replace scene to the end of the frame


    this.once(cc.Director.EVENT_AFTER_UPDATE, function () {
      this.runSceneImmediate(scene, onBeforeLoadScene, onLaunched);
    }, this);
  },
  //  @Scene loading section
  _getSceneUuid: function _getSceneUuid(key) {
    var scenes = game._sceneInfos;

    if (typeof key === 'string') {
      if (!key.endsWith('.fire')) {
        key += '.fire';
      }

      if (key[0] !== '/' && !key.startsWith('db://')) {
        key = '/' + key; // 使用全名匹配
      } // search scene


      for (var i = 0; i < scenes.length; i++) {
        var info = scenes[i];

        if (info.url.endsWith(key)) {
          return info;
        }
      }
    } else if (typeof key === 'number') {
      if (0 <= key && key < scenes.length) {
        return scenes[key];
      } else {
        cc.errorID(1206, key);
      }
    } else {
      cc.errorID(1207, key);
    }

    return null;
  },

  /**
   * !#en Loads the scene by its name.
   * !#zh 通过场景名称进行加载场景。
   *
   * @method loadScene
   * @param {String} sceneName - The name of the scene to load.
   * @param {Function} [onLaunched] - callback, will be called after scene launched.
   * @return {Boolean} if error, return false
   */
  loadScene: function loadScene(sceneName, onLaunched, _onUnloaded) {
    if (this._loadingScene) {
      cc.warnID(1208, sceneName, this._loadingScene);
      return false;
    }

    var info = this._getSceneUuid(sceneName);

    if (info) {
      var uuid = info.uuid;
      this.emit(cc.Director.EVENT_BEFORE_SCENE_LOADING, sceneName);
      this._loadingScene = sceneName;

      this._loadSceneByUuid(uuid, onLaunched, _onUnloaded);

      return true;
    } else {
      cc.errorID(1209, sceneName);
      return false;
    }
  },

  /**
   * !#en
   * Preloads the scene to reduces loading time. You can call this method at any time you want.
   * After calling this method, you still need to launch the scene by `cc.director.loadScene`.
   * It will be totally fine to call `cc.director.loadScene` at any time even if the preloading is not
   * yet finished, the scene will be launched after loaded automatically.
   * !#zh 预加载场景，你可以在任何时候调用这个方法。
   * 调用完后，你仍然需要通过 `cc.director.loadScene` 来启动场景，因为这个方法不会执行场景加载操作。
   * 就算预加载还没完成，你也可以直接调用 `cc.director.loadScene`，加载完成后场景就会启动。
   *
   * @method preloadScene
   * @param {String} sceneName - The name of the scene to preload.
   * @param {Function} [onProgress] - callback, will be called when the load progression change.
   * @param {Number} onProgress.completedCount - The number of the items that are already completed
   * @param {Number} onProgress.totalCount - The total number of the items
   * @param {Object} onProgress.item - The latest item which flow out the pipeline
   * @param {Function} [onLoaded] - callback, will be called after scene loaded.
   * @param {Error} onLoaded.error - null or the error object.
   * @param {cc.SceneAsset} onLoaded.asset - The scene asset itself.
   */
  preloadScene: function preloadScene(sceneName, onProgress, onLoaded) {
    if (onLoaded === undefined) {
      onLoaded = onProgress;
      onProgress = null;
    }

    var info = this._getSceneUuid(sceneName);

    if (info) {
      this.emit(cc.Director.EVENT_BEFORE_SCENE_LOADING, sceneName);
      cc.loader.load({
        uuid: info.uuid,
        type: 'uuid'
      }, onProgress, function (error, asset) {
        if (error) {
          cc.errorID(1210, sceneName, error.message);
        }

        if (onLoaded) {
          onLoaded(error, asset);
        }
      });
    } else {
      var error = 'Can not preload the scene "' + sceneName + '" because it is not in the build settings.';
      onLoaded(new Error(error));
      cc.error('preloadScene: ' + error);
    }
  },

  /**
   * Loads the scene by its uuid.
   * @method _loadSceneByUuid
   * @param {String} uuid - the uuid of the scene asset to load
   * @param {Function} [onLaunched]
   * @param {Function} [onUnloaded]
   * @param {Boolean} [dontRunScene] - Just download and initialize the scene but will not launch it,
   *                                   only take effect in the Editor.
   * @private
   */
  _loadSceneByUuid: function _loadSceneByUuid(uuid, onLaunched, onUnloaded, dontRunScene) {
    if (CC_EDITOR) {
      if (typeof onLaunched === 'boolean') {
        dontRunScene = onLaunched;
        onLaunched = null;
      }

      if (typeof onUnloaded === 'boolean') {
        dontRunScene = onUnloaded;
        onUnloaded = null;
      }
    } //cc.AssetLibrary.unloadAsset(uuid);     // force reload


    console.time('LoadScene ' + uuid);
    cc.AssetLibrary.loadAsset(uuid, function (error, sceneAsset) {
      console.timeEnd('LoadScene ' + uuid);
      var self = cc.director;
      self._loadingScene = '';

      if (error) {
        error = 'Failed to load scene: ' + error;
        cc.error(error);
      } else {
        if (sceneAsset instanceof cc.SceneAsset) {
          var scene = sceneAsset.scene;
          scene._id = sceneAsset._uuid;
          scene._name = sceneAsset._name;

          if (CC_EDITOR) {
            if (!dontRunScene) {
              self.runSceneImmediate(scene, onUnloaded, onLaunched);
            } else {
              scene._load();

              if (onLaunched) {
                onLaunched(null, scene);
              }
            }
          } else {
            self.runSceneImmediate(scene, onUnloaded, onLaunched);
          }

          return;
        } else {
          error = 'The asset ' + uuid + ' is not a scene';
          cc.error(error);
        }
      }

      if (onLaunched) {
        onLaunched(error);
      }
    });
  },

  /**
   * !#en Resume game logic execution after pause, if the current scene is not paused, nothing will happen.
   * !#zh 恢复暂停场景的游戏逻辑，如果当前场景没有暂停将没任何事情发生。
   * @method resume
   */
  resume: function resume() {
    if (!this._paused) {
      return;
    }

    this._lastUpdate = performance.now();

    if (!this._lastUpdate) {
      cc.logID(1200);
    }

    this._paused = false;
    this._deltaTime = 0;
  },

  /**
   * !#en
   * Enables or disables WebGL depth test.<br/>
   * Implementation can be found in CCDirectorCanvas.js/CCDirectorWebGL.js
   * !#zh 启用/禁用深度测试（在 Canvas 渲染模式下不会生效）。
   * @method setDepthTest
   * @param {Boolean} on
   * @deprecated since v2.0
   */
  setDepthTest: function setDepthTest(value) {
    if (!cc.Camera.main) {
      return;
    }

    cc.Camera.main.depth = !!value;
  },

  /**
   * !#en
   * Set color for clear screen.<br/>
   * (Implementation can be found in CCDirectorCanvas.js/CCDirectorWebGL.js)
   * !#zh
   * 设置场景的默认擦除颜色。<br/>
   * 支持全透明，但不支持透明度为中间值。要支持全透明需手工开启 cc.macro.ENABLE_TRANSPARENT_CANVAS。
   * @method setClearColor
   * @param {Color} clearColor
   * @deprecated since v2.0
   */
  setClearColor: function setClearColor(clearColor) {
    if (!cc.Camera.main) {
      return;
    }

    cc.Camera.main.backgroundColor = clearColor;
  },

  /**
   * !#en Returns current logic Scene.
   * !#zh 获取当前逻辑场景。
   * @method getRunningScene
   * @private
   * @return {Scene}
   * @deprecated since v2.0
   */
  getRunningScene: function getRunningScene() {
    return this._scene;
  },

  /**
   * !#en Returns current logic Scene.
   * !#zh 获取当前逻辑场景。
   * @method getScene
   * @return {Scene}
   * @example
   *  // This will help you to get the Canvas node in scene
   *  cc.director.getScene().getChildByName('Canvas');
   */
  getScene: function getScene() {
    return this._scene;
  },

  /**
   * !#en Returns the FPS value. Please use {{#crossLink "Game.setFrameRate"}}cc.game.setFrameRate{{/crossLink}} to control animation interval.
   * !#zh 获取单位帧执行时间。请使用 {{#crossLink "Game.setFrameRate"}}cc.game.setFrameRate{{/crossLink}} 来控制游戏帧率。
   * @method getAnimationInterval
   * @deprecated since v2.0
   * @return {Number}
   */
  getAnimationInterval: function getAnimationInterval() {
    return 1000 / game.getFrameRate();
  },

  /**
   * Sets animation interval, this doesn't control the main loop.
   * To control the game's frame rate overall, please use {{#crossLink "Game.setFrameRate"}}cc.game.setFrameRate{{/crossLink}}
   * @method setAnimationInterval
   * @deprecated since v2.0
   * @param {Number} value - The animation interval desired.
   */
  setAnimationInterval: function setAnimationInterval(value) {
    game.setFrameRate(Math.round(1000 / value));
  },

  /**
   * !#en Returns the delta time since last frame.
   * !#zh 获取上一帧的增量时间。
   * @method getDeltaTime
   * @return {Number}
   */
  getDeltaTime: function getDeltaTime() {
    return this._deltaTime;
  },

  /**
   * !#en Returns the total passed time since game start, unit: ms
   * !#zh 获取从游戏开始到现在总共经过的时间，单位为 ms
   * @method getTotalTime
   * @return {Number}
   */
  getTotalTime: function getTotalTime() {
    return performance.now() - this._startTime;
  },

  /**
   * !#en Returns how many frames were called since the director started.
   * !#zh 获取 director 启动以来游戏运行的总帧数。
   * @method getTotalFrames
   * @return {Number}
   */
  getTotalFrames: function getTotalFrames() {
    return this._totalFrames;
  },

  /**
   * !#en Returns whether or not the Director is paused.
   * !#zh 是否处于暂停状态。
   * @method isPaused
   * @return {Boolean}
   */
  isPaused: function isPaused() {
    return this._paused;
  },

  /**
   * !#en Returns the cc.Scheduler associated with this director.
   * !#zh 获取和 director 相关联的 cc.Scheduler。
   * @method getScheduler
   * @return {Scheduler}
   */
  getScheduler: function getScheduler() {
    return this._scheduler;
  },

  /**
   * !#en Sets the cc.Scheduler associated with this director.
   * !#zh 设置和 director 相关联的 cc.Scheduler。
   * @method setScheduler
   * @param {Scheduler} scheduler
   */
  setScheduler: function setScheduler(scheduler) {
    if (this._scheduler !== scheduler) {
      this._scheduler = scheduler;
    }
  },

  /**
   * !#en Returns the cc.ActionManager associated with this director.
   * !#zh 获取和 director 相关联的 cc.ActionManager（动作管理器）。
   * @method getActionManager
   * @return {ActionManager}
   */
  getActionManager: function getActionManager() {
    return this._actionManager;
  },

  /**
   * !#en Sets the cc.ActionManager associated with this director.
   * !#zh 设置和 director 相关联的 cc.ActionManager（动作管理器）。
   * @method setActionManager
   * @param {ActionManager} actionManager
   */
  setActionManager: function setActionManager(actionManager) {
    if (this._actionManager !== actionManager) {
      if (this._actionManager) {
        this._scheduler.unscheduleUpdate(this._actionManager);
      }

      this._actionManager = actionManager;

      this._scheduler.scheduleUpdate(this._actionManager, cc.Scheduler.PRIORITY_SYSTEM, false);
    }
  },

  /* 
   * !#en Returns the cc.AnimationManager associated with this director.
   * !#zh 获取和 director 相关联的 cc.AnimationManager（动画管理器）。
   * @method getAnimationManager
   * @return {AnimationManager}
   */
  getAnimationManager: function getAnimationManager() {
    return this._animationManager;
  },

  /**
   * !#en Returns the cc.CollisionManager associated with this director.
   * !#zh 获取和 director 相关联的 cc.CollisionManager （碰撞管理器）。
   * @method getCollisionManager
   * @return {CollisionManager}
   */
  getCollisionManager: function getCollisionManager() {
    return this._collisionManager;
  },

  /**
   * !#en Returns the cc.PhysicsManager associated with this director.
   * !#zh 返回与 director 相关联的 cc.PhysicsManager （物理管理器）。
   * @method getPhysicsManager
   * @return {PhysicsManager}
   */
  getPhysicsManager: function getPhysicsManager() {
    return this._physicsManager;
  },

  /**
   * !#en Returns the cc.Physics3DManager associated with this director.
   * !#zh 返回与 director 相关联的 cc.Physics3DManager （物理管理器）。
   * @method getPhysics3DManager
   * @return {Physics3DManager}
   */
  getPhysics3DManager: function getPhysics3DManager() {
    return this._physics3DManager;
  },
  // Loop management

  /*
   * Starts Animation
   * @deprecated since v2.1.2
   */
  startAnimation: function startAnimation() {
    cc.game.resume();
  },

  /*
   * Stops animation
   * @deprecated since v2.1.2
   */
  stopAnimation: function stopAnimation() {
    cc.game.pause();
  },
  _resetDeltaTime: function _resetDeltaTime() {
    this._lastUpdate = performance.now();
    this._deltaTime = 0;
  },

  /*
   * Run main loop of director
   */
  mainLoop: CC_EDITOR ? function (deltaTime, updateAnimate) {
    this._deltaTime = deltaTime; // Update

    if (!this._paused) {
      this.emit(cc.Director.EVENT_BEFORE_UPDATE);

      this._compScheduler.startPhase();

      this._compScheduler.updatePhase(deltaTime);

      if (updateAnimate) {
        this._scheduler.update(deltaTime);
      }

      this._compScheduler.lateUpdatePhase(deltaTime);

      this.emit(cc.Director.EVENT_AFTER_UPDATE);
    } // Render


    this.emit(cc.Director.EVENT_BEFORE_DRAW);
    renderer.render(this._scene, deltaTime); // After draw

    this.emit(cc.Director.EVENT_AFTER_DRAW);
    this._totalFrames++;
  } : function (now) {
    if (this._purgeDirectorInNextLoop) {
      this._purgeDirectorInNextLoop = false;
      this.purgeDirector();
    } else {
      // calculate "global" dt
      this.calculateDeltaTime(now); // Update

      if (!this._paused) {
        // before update
        this.emit(cc.Director.EVENT_BEFORE_UPDATE); // Call start for new added components

        this._compScheduler.startPhase(); // Update for components


        this._compScheduler.updatePhase(this._deltaTime); // Engine update with scheduler


        this._scheduler.update(this._deltaTime); // Late update for components


        this._compScheduler.lateUpdatePhase(this._deltaTime); // After life-cycle executed


        this._compScheduler.clearup(); // User can use this event to do things after update


        this.emit(cc.Director.EVENT_AFTER_UPDATE); // Destroy entities that have been removed recently

        Obj._deferredDestroy();
      } // Render


      this.emit(cc.Director.EVENT_BEFORE_DRAW);
      renderer.render(this._scene, this._deltaTime); // After draw

      this.emit(cc.Director.EVENT_AFTER_DRAW);
      eventManager.frameUpdateListeners();
      this._totalFrames++;
    }
  },
  __fastOn: function __fastOn(type, callback, target) {
    this.on(type, callback, target);
  },
  __fastOff: function __fastOff(type, callback, target) {
    this.off(type, callback, target);
  }
}; // Event target

cc.js.addon(cc.Director.prototype, EventTarget.prototype);
/**
 * !#en The event projection changed of cc.Director. This event will not get triggered since v2.0
 * !#zh cc.Director 投影变化的事件。从 v2.0 开始这个事件不会再被触发
 * @property {String} EVENT_PROJECTION_CHANGED
 * @readonly
 * @static
 * @deprecated since v2.0
 */

cc.Director.EVENT_PROJECTION_CHANGED = "director_projection_changed";
/**
 * !#en The event which will be triggered before loading a new scene.
 * !#zh 加载新场景之前所触发的事件。
 * @event cc.Director.EVENT_BEFORE_SCENE_LOADING
 * @param {String} sceneName - The loading scene name
 */

/**
 * !#en The event which will be triggered before loading a new scene.
 * !#zh 加载新场景之前所触发的事件。
 * @property {String} EVENT_BEFORE_SCENE_LOADING
 * @readonly
 * @static
 */

cc.Director.EVENT_BEFORE_SCENE_LOADING = "director_before_scene_loading";
/*
 * !#en The event which will be triggered before launching a new scene.
 * !#zh 运行新场景之前所触发的事件。
 * @event cc.Director.EVENT_BEFORE_SCENE_LAUNCH
 * @param {String} sceneName - New scene which will be launched
 */

/**
 * !#en The event which will be triggered before launching a new scene.
 * !#zh 运行新场景之前所触发的事件。
 * @property {String} EVENT_BEFORE_SCENE_LAUNCH
 * @readonly
 * @static
 */

cc.Director.EVENT_BEFORE_SCENE_LAUNCH = "director_before_scene_launch";
/**
 * !#en The event which will be triggered after launching a new scene.
 * !#zh 运行新场景之后所触发的事件。
 * @event cc.Director.EVENT_AFTER_SCENE_LAUNCH
 * @param {String} sceneName - New scene which is launched
 */

/**
 * !#en The event which will be triggered after launching a new scene.
 * !#zh 运行新场景之后所触发的事件。
 * @property {String} EVENT_AFTER_SCENE_LAUNCH
 * @readonly
 * @static
 */

cc.Director.EVENT_AFTER_SCENE_LAUNCH = "director_after_scene_launch";
/**
 * !#en The event which will be triggered at the beginning of every frame.
 * !#zh 每个帧的开始时所触发的事件。
 * @event cc.Director.EVENT_BEFORE_UPDATE
 */

/**
 * !#en The event which will be triggered at the beginning of every frame.
 * !#zh 每个帧的开始时所触发的事件。
 * @property {String} EVENT_BEFORE_UPDATE
 * @readonly
 * @static
 */

cc.Director.EVENT_BEFORE_UPDATE = "director_before_update";
/**
 * !#en The event which will be triggered after engine and components update logic.
 * !#zh 将在引擎和组件 “update” 逻辑之后所触发的事件。
 * @event cc.Director.EVENT_AFTER_UPDATE
 */

/**
 * !#en The event which will be triggered after engine and components update logic.
 * !#zh 将在引擎和组件 “update” 逻辑之后所触发的事件。
 * @property {String} EVENT_AFTER_UPDATE
 * @readonly
 * @static
 */

cc.Director.EVENT_AFTER_UPDATE = "director_after_update";
/**
 * !#en The event is deprecated since v2.0, please use cc.Director.EVENT_BEFORE_DRAW instead
 * !#zh 这个事件从 v2.0 开始被废弃，请直接使用 cc.Director.EVENT_BEFORE_DRAW
 * @property {String} EVENT_BEFORE_VISIT
 * @readonly
 * @deprecated since v2.0
 * @static
 */

cc.Director.EVENT_BEFORE_VISIT = "director_before_draw";
/**
 * !#en The event is deprecated since v2.0, please use cc.Director.EVENT_BEFORE_DRAW instead
 * !#zh 这个事件从 v2.0 开始被废弃，请直接使用 cc.Director.EVENT_BEFORE_DRAW
 * @property {String} EVENT_AFTER_VISIT
 * @readonly
 * @deprecated since v2.0
 * @static
 */

cc.Director.EVENT_AFTER_VISIT = "director_before_draw";
/**
 * !#en The event which will be triggered before the rendering process.
 * !#zh 渲染过程之前所触发的事件。
 * @event cc.Director.EVENT_BEFORE_DRAW
 */

/**
 * !#en The event which will be triggered before the rendering process.
 * !#zh 渲染过程之前所触发的事件。
 * @property {String} EVENT_BEFORE_DRAW
 * @readonly
 * @static
 */

cc.Director.EVENT_BEFORE_DRAW = "director_before_draw";
/**
 * !#en The event which will be triggered after the rendering process.
 * !#zh 渲染过程之后所触发的事件。
 * @event cc.Director.EVENT_AFTER_DRAW
 */

/**
 * !#en The event which will be triggered after the rendering process.
 * !#zh 渲染过程之后所触发的事件。
 * @property {String} EVENT_AFTER_DRAW
 * @readonly
 * @static
 */

cc.Director.EVENT_AFTER_DRAW = "director_after_draw"; //Possible OpenGL projections used by director

/**
 * Constant for 2D projection (orthogonal projection)
 * @property {Number} PROJECTION_2D
 * @default 0
 * @readonly
 * @static
 * @deprecated since v2.0
 */

cc.Director.PROJECTION_2D = 0;
/**
 * Constant for 3D projection with a fovy=60, znear=0.5f and zfar=1500.
 * @property {Number} PROJECTION_3D
 * @default 1
 * @readonly
 * @static
 * @deprecated since v2.0
 */

cc.Director.PROJECTION_3D = 1;
/**
 * Constant for custom projection, if cc.Director's projection set to it, it calls "updateProjection" on the projection delegate.
 * @property {Number} PROJECTION_CUSTOM
 * @default 3
 * @readonly
 * @static
 * @deprecated since v2.0
 */

cc.Director.PROJECTION_CUSTOM = 3;
/**
 * Constant for default projection of cc.Director, default projection is 2D projection
 * @property {Number} PROJECTION_DEFAULT
 * @default cc.Director.PROJECTION_2D
 * @readonly
 * @static
 * @deprecated since v2.0
 */

cc.Director.PROJECTION_DEFAULT = cc.Director.PROJECTION_2D;
/**
 * The event which will be triggered before the physics process.<br/>
 * 物理过程之前所触发的事件。
 * @event Director.EVENT_BEFORE_PHYSICS
 * @readonly
 */

cc.Director.EVENT_BEFORE_PHYSICS = 'director_before_physics';
/**
 * The event which will be triggered after the physics process.<br/>
 * 物理过程之后所触发的事件。
 * @event Director.EVENT_AFTER_PHYSICS
 * @readonly
 */

cc.Director.EVENT_AFTER_PHYSICS = 'director_after_physics';
/**
 * @module cc
 */

/**
 * !#en Director
 * !#zh 导演类。
 * @property director
 * @type {Director}
 */

cc.director = new cc.Director();
module.exports = cc.director;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDRGlyZWN0b3IuanMiXSwibmFtZXMiOlsiRXZlbnRUYXJnZXQiLCJyZXF1aXJlIiwiQXV0b1JlbGVhc2VVdGlscyIsIkNvbXBvbmVudFNjaGVkdWxlciIsIk5vZGVBY3RpdmF0b3IiLCJPYmoiLCJnYW1lIiwicmVuZGVyZXIiLCJldmVudE1hbmFnZXIiLCJTY2hlZHVsZXIiLCJjYyIsIkRpcmVjdG9yIiwiY2FsbCIsIl9wYXVzZWQiLCJfcHVyZ2VEaXJlY3RvckluTmV4dExvb3AiLCJfd2luU2l6ZUluUG9pbnRzIiwiX2xvYWRpbmdTY2VuZSIsIl9zY2VuZSIsIl90b3RhbEZyYW1lcyIsIl9sYXN0VXBkYXRlIiwiX2RlbHRhVGltZSIsIl9zdGFydFRpbWUiLCJfbWF4UGFydGljbGVEZWx0YVRpbWUiLCJfc2NoZWR1bGVyIiwiX2NvbXBTY2hlZHVsZXIiLCJfbm9kZUFjdGl2YXRvciIsIl9hY3Rpb25NYW5hZ2VyIiwic2VsZiIsIm9uIiwiRVZFTlRfU0hPVyIsInBlcmZvcm1hbmNlIiwibm93Iiwib25jZSIsIkVWRU5UX0VOR0lORV9JTklURUQiLCJpbml0IiwicHJvdG90eXBlIiwiY29uc3RydWN0b3IiLCJzaXplIiwiQWN0aW9uTWFuYWdlciIsInNjaGVkdWxlVXBkYXRlIiwiUFJJT1JJVFlfU1lTVEVNIiwic2hhcmVkSW5pdCIsInNldEVuYWJsZWQiLCJBbmltYXRpb25NYW5hZ2VyIiwiX2FuaW1hdGlvbk1hbmFnZXIiLCJDb2xsaXNpb25NYW5hZ2VyIiwiX2NvbGxpc2lvbk1hbmFnZXIiLCJQaHlzaWNzTWFuYWdlciIsIl9waHlzaWNzTWFuYWdlciIsIlBoeXNpY3MzRE1hbmFnZXIiLCJfcGh5c2ljczNETWFuYWdlciIsIl93aWRnZXRNYW5hZ2VyIiwibG9hZGVyIiwiY2FsY3VsYXRlRGVsdGFUaW1lIiwiQ0NfREVCVUciLCJjb252ZXJ0VG9HTCIsInVpUG9pbnQiLCJjb250YWluZXIiLCJ2aWV3IiwiYm94IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwibGVmdCIsIndpbmRvdyIsInBhZ2VYT2Zmc2V0IiwiY2xpZW50TGVmdCIsInRvcCIsInBhZ2VZT2Zmc2V0IiwiY2xpZW50VG9wIiwieCIsIl9kZXZpY2VQaXhlbFJhdGlvIiwieSIsImhlaWdodCIsIl9pc1JvdGF0ZWQiLCJ2MiIsIl92aWV3cG9ydFJlY3QiLCJ3aWR0aCIsImNvbnZlcnRUb1VJIiwiZ2xQb2ludCIsImVuZCIsImdldFdpblNpemUiLCJ3aW5TaXplIiwiZ2V0V2luU2l6ZUluUGl4ZWxzIiwicGF1c2UiLCJwdXJnZUNhY2hlZERhdGEiLCJyZWxlYXNlQWxsIiwicHVyZ2VEaXJlY3RvciIsInVuc2NoZWR1bGVBbGwiLCJyZXNldCIsIkNDX0VESVRPUiIsImlzVmFsaWQiLCJkZXN0cm95IiwiY2xlYXIiLCJBc3NldExpYnJhcnkiLCJyZXNldEJ1aWx0aW5zIiwicmVzdW1lIiwicnVuU2NlbmVJbW1lZGlhdGUiLCJzY2VuZSIsIm9uQmVmb3JlTG9hZFNjZW5lIiwib25MYXVuY2hlZCIsImFzc2VydElEIiwiU2NlbmUiLCJDQ19CVUlMRCIsImNvbnNvbGUiLCJ0aW1lIiwiX2xvYWQiLCJ0aW1lRW5kIiwicGVyc2lzdE5vZGVMaXN0IiwiT2JqZWN0Iiwia2V5cyIsIl9wZXJzaXN0Um9vdE5vZGVzIiwibWFwIiwiaSIsImxlbmd0aCIsIm5vZGUiLCJleGlzdE5vZGUiLCJnZXRDaGlsZEJ5VXVpZCIsInV1aWQiLCJpbmRleCIsImdldFNpYmxpbmdJbmRleCIsIl9kZXN0cm95SW1tZWRpYXRlIiwiaW5zZXJ0Q2hpbGQiLCJwYXJlbnQiLCJvbGRTY2VuZSIsImF1dG9SZWxlYXNlQXNzZXRzIiwiZGVwZW5kQXNzZXRzIiwiYXV0b1JlbGVhc2UiLCJfZGVmZXJyZWREZXN0cm95IiwiZW1pdCIsIkVWRU5UX0JFRk9SRV9TQ0VORV9MQVVOQ0giLCJfYWN0aXZhdGUiLCJFVkVOVF9BRlRFUl9TQ0VORV9MQVVOQ0giLCJydW5TY2VuZSIsIkVWRU5UX0FGVEVSX1VQREFURSIsIl9nZXRTY2VuZVV1aWQiLCJrZXkiLCJzY2VuZXMiLCJfc2NlbmVJbmZvcyIsImVuZHNXaXRoIiwic3RhcnRzV2l0aCIsImluZm8iLCJ1cmwiLCJlcnJvcklEIiwibG9hZFNjZW5lIiwic2NlbmVOYW1lIiwiX29uVW5sb2FkZWQiLCJ3YXJuSUQiLCJFVkVOVF9CRUZPUkVfU0NFTkVfTE9BRElORyIsIl9sb2FkU2NlbmVCeVV1aWQiLCJwcmVsb2FkU2NlbmUiLCJvblByb2dyZXNzIiwib25Mb2FkZWQiLCJ1bmRlZmluZWQiLCJsb2FkIiwidHlwZSIsImVycm9yIiwiYXNzZXQiLCJtZXNzYWdlIiwiRXJyb3IiLCJvblVubG9hZGVkIiwiZG9udFJ1blNjZW5lIiwibG9hZEFzc2V0Iiwic2NlbmVBc3NldCIsImRpcmVjdG9yIiwiU2NlbmVBc3NldCIsIl9pZCIsIl91dWlkIiwiX25hbWUiLCJsb2dJRCIsInNldERlcHRoVGVzdCIsInZhbHVlIiwiQ2FtZXJhIiwibWFpbiIsImRlcHRoIiwic2V0Q2xlYXJDb2xvciIsImNsZWFyQ29sb3IiLCJiYWNrZ3JvdW5kQ29sb3IiLCJnZXRSdW5uaW5nU2NlbmUiLCJnZXRTY2VuZSIsImdldEFuaW1hdGlvbkludGVydmFsIiwiZ2V0RnJhbWVSYXRlIiwic2V0QW5pbWF0aW9uSW50ZXJ2YWwiLCJzZXRGcmFtZVJhdGUiLCJNYXRoIiwicm91bmQiLCJnZXREZWx0YVRpbWUiLCJnZXRUb3RhbFRpbWUiLCJnZXRUb3RhbEZyYW1lcyIsImlzUGF1c2VkIiwiZ2V0U2NoZWR1bGVyIiwic2V0U2NoZWR1bGVyIiwic2NoZWR1bGVyIiwiZ2V0QWN0aW9uTWFuYWdlciIsInNldEFjdGlvbk1hbmFnZXIiLCJhY3Rpb25NYW5hZ2VyIiwidW5zY2hlZHVsZVVwZGF0ZSIsImdldEFuaW1hdGlvbk1hbmFnZXIiLCJnZXRDb2xsaXNpb25NYW5hZ2VyIiwiZ2V0UGh5c2ljc01hbmFnZXIiLCJnZXRQaHlzaWNzM0RNYW5hZ2VyIiwic3RhcnRBbmltYXRpb24iLCJzdG9wQW5pbWF0aW9uIiwiX3Jlc2V0RGVsdGFUaW1lIiwibWFpbkxvb3AiLCJkZWx0YVRpbWUiLCJ1cGRhdGVBbmltYXRlIiwiRVZFTlRfQkVGT1JFX1VQREFURSIsInN0YXJ0UGhhc2UiLCJ1cGRhdGVQaGFzZSIsInVwZGF0ZSIsImxhdGVVcGRhdGVQaGFzZSIsIkVWRU5UX0JFRk9SRV9EUkFXIiwicmVuZGVyIiwiRVZFTlRfQUZURVJfRFJBVyIsImNsZWFydXAiLCJmcmFtZVVwZGF0ZUxpc3RlbmVycyIsIl9fZmFzdE9uIiwiY2FsbGJhY2siLCJ0YXJnZXQiLCJfX2Zhc3RPZmYiLCJvZmYiLCJqcyIsImFkZG9uIiwiRVZFTlRfUFJPSkVDVElPTl9DSEFOR0VEIiwiRVZFTlRfQkVGT1JFX1ZJU0lUIiwiRVZFTlRfQUZURVJfVklTSVQiLCJQUk9KRUNUSU9OXzJEIiwiUFJPSkVDVElPTl8zRCIsIlBST0pFQ1RJT05fQ1VTVE9NIiwiUFJPSkVDVElPTl9ERUZBVUxUIiwiRVZFTlRfQkVGT1JFX1BIWVNJQ1MiLCJFVkVOVF9BRlRFUl9QSFlTSUNTIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCQSxJQUFNQSxXQUFXLEdBQUdDLE9BQU8sQ0FBQyxzQkFBRCxDQUEzQjs7QUFDQSxJQUFNQyxnQkFBZ0IsR0FBR0QsT0FBTyxDQUFDLG9DQUFELENBQWhDOztBQUNBLElBQU1FLGtCQUFrQixHQUFHRixPQUFPLENBQUMsdUJBQUQsQ0FBbEM7O0FBQ0EsSUFBTUcsYUFBYSxHQUFHSCxPQUFPLENBQUMsa0JBQUQsQ0FBN0I7O0FBQ0EsSUFBTUksR0FBRyxHQUFHSixPQUFPLENBQUMscUJBQUQsQ0FBbkI7O0FBQ0EsSUFBTUssSUFBSSxHQUFHTCxPQUFPLENBQUMsVUFBRCxDQUFwQjs7QUFDQSxJQUFNTSxRQUFRLEdBQUdOLE9BQU8sQ0FBQyxZQUFELENBQXhCOztBQUNBLElBQU1PLFlBQVksR0FBR1AsT0FBTyxDQUFDLGlCQUFELENBQTVCOztBQUNBLElBQU1RLFNBQVMs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QyxRQUFILENBQVl1TixhQUFaLEdBQTRCLENBQTVCO0FBRUE7Ozs7Ozs7OztBQVFBeE4sRUFBRSxDQUFDQyxRQUFILENBQVl3TixpQkFBWixHQUFnQyxDQUFoQztBQUVBOzs7Ozs7Ozs7QUFRQXpOLEVBQUUsQ0FBQ0MsUUFBSCxDQUFZeU4sa0JBQVosR0FBaUMxTixFQUFFLENBQUNDLFFBQUgsQ0FBWXNOLGFBQTdDO0FBRUE7Ozs7Ozs7QUFNQXZOLEVBQUUsQ0FBQ0MsUUFBSCxDQUFZME4sb0JBQVosR0FBbUMseUJBQW5DO0FBRUE7Ozs7Ozs7QUFNQTNOLEVBQUUsQ0FBQ0MsUUFBSCxDQUFZMk4sbUJBQVosR0FBa0Msd0JBQWxDO0FBRUE7Ozs7QUFJQTs7Ozs7OztBQU1BNU4sRUFBRSxDQUFDd0osUUFBSCxHQUFjLElBQUl4SixFQUFFLENBQUNDLFFBQVAsRUFBZDtBQUVBNE4sTUFBTSxDQUFDQyxPQUFQLEdBQWlCOU4sRUFBRSxDQUFDd0osUUFBcEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAwOC0yMDEwIFJpY2FyZG8gUXVlc2FkYVxuIENvcHlyaWdodCAoYykgMjAxMS0yMDEyIGNvY29zMmQteC5vcmdcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwOi8vd3d3LmNvY29zMmQteC5vcmdcblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNvbnN0IEV2ZW50VGFyZ2V0ID0gcmVxdWlyZSgnLi9ldmVudC9ldmVudC10YXJnZXQnKTtcbmNvbnN0IEF1dG9SZWxlYXNlVXRpbHMgPSByZXF1aXJlKCcuL2xvYWQtcGlwZWxpbmUvYXV0by1yZWxlYXNlLXV0aWxzJyk7XG5jb25zdCBDb21wb25lbnRTY2hlZHVsZXIgPSByZXF1aXJlKCcuL2NvbXBvbmVudC1zY2hlZHVsZXInKTtcbmNvbnN0IE5vZGVBY3RpdmF0b3IgPSByZXF1aXJlKCcuL25vZGUtYWN0aXZhdG9yJyk7XG5jb25zdCBPYmogPSByZXF1aXJlKCcuL3BsYXRmb3JtL0NDT2JqZWN0Jyk7XG5jb25zdCBnYW1lID0gcmVxdWlyZSgnLi9DQ0dhbWUnKTtcbmNvbnN0IHJlbmRlcmVyID0gcmVxdWlyZSgnLi9yZW5kZXJlcicpO1xuY29uc3QgZXZlbnRNYW5hZ2VyID0gcmVxdWlyZSgnLi9ldmVudC1tYW5hZ2VyJyk7XG5jb25zdCBTY2hlZHVsZXIgPSByZXF1aXJlKCcuL0NDU2NoZWR1bGVyJyk7XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqICEjZW5cbiAqIDxwPlxuICogICAgQVRURU5USU9OOiBVU0UgY2MuZGlyZWN0b3IgSU5TVEVBRCBPRiBjYy5EaXJlY3Rvci48YnIvPlxuICogICAgY2MuZGlyZWN0b3IgaXMgYSBzaW5nbGV0b24gb2JqZWN0IHdoaWNoIG1hbmFnZSB5b3VyIGdhbWUncyBsb2dpYyBmbG93Ljxici8+XG4gKiAgICBTaW5jZSB0aGUgY2MuZGlyZWN0b3IgaXMgYSBzaW5nbGV0b24sIHlvdSBkb24ndCBuZWVkIHRvIGNhbGwgYW55IGNvbnN0cnVjdG9yIG9yIGNyZWF0ZSBmdW5jdGlvbnMsPGJyLz5cbiAqICAgIHRoZSBzdGFuZGFyZCB3YXkgdG8gdXNlIGl0IGlzIGJ5IGNhbGxpbmc6PGJyLz5cbiAqICAgICAgLSBjYy5kaXJlY3Rvci5tZXRob2ROYW1lKCk7IDxici8+XG4gKlxuICogICAgSXQgY3JlYXRlcyBhbmQgaGFuZGxlIHRoZSBtYWluIFdpbmRvdyBhbmQgbWFuYWdlcyBob3cgYW5kIHdoZW4gdG8gZXhlY3V0ZSB0aGUgU2NlbmVzLjxici8+XG4gKiAgICA8YnIvPlxuICogICAgVGhlIGNjLmRpcmVjdG9yIGlzIGFsc28gcmVzcG9uc2libGUgZm9yOjxici8+XG4gKiAgICAgIC0gaW5pdGlhbGl6aW5nIHRoZSBPcGVuR0wgY29udGV4dDxici8+XG4gKiAgICAgIC0gc2V0dGluZyB0aGUgT3BlbkdMIHBpeGVsIGZvcm1hdCAoZGVmYXVsdCBvbiBpcyBSR0I1NjUpPGJyLz5cbiAqICAgICAgLSBzZXR0aW5nIHRoZSBPcGVuR0wgYnVmZmVyIGRlcHRoIChkZWZhdWx0IG9uIGlzIDAtYml0KTxici8+XG4gKiAgICAgIC0gc2V0dGluZyB0aGUgY29sb3IgZm9yIGNsZWFyIHNjcmVlbiAoZGVmYXVsdCBvbmUgaXMgQkxBQ0spPGJyLz5cbiAqICAgICAgLSBzZXR0aW5nIHRoZSBwcm9qZWN0aW9uIChkZWZhdWx0IG9uZSBpcyAzRCk8YnIvPlxuICogICAgICAtIHNldHRpbmcgdGhlIG9yaWVudGF0aW9uIChkZWZhdWx0IG9uZSBpcyBQb3J0cmFpdCk8YnIvPlxuICogICAgICA8YnIvPlxuICogICAgPGJyLz5cbiAqICAgIFRoZSBjYy5kaXJlY3RvciBhbHNvIHNldHMgdGhlIGRlZmF1bHQgT3BlbkdMIGNvbnRleHQ6PGJyLz5cbiAqICAgICAgLSBHTF9URVhUVVJFXzJEIGlzIGVuYWJsZWQ8YnIvPlxuICogICAgICAtIEdMX1ZFUlRFWF9BUlJBWSBpcyBlbmFibGVkPGJyLz5cbiAqICAgICAgLSBHTF9DT0xPUl9BUlJBWSBpcyBlbmFibGVkPGJyLz5cbiAqICAgICAgLSBHTF9URVhUVVJFX0NPT1JEX0FSUkFZIGlzIGVuYWJsZWQ8YnIvPlxuICogPC9wPlxuICogPHA+XG4gKiAgIGNjLmRpcmVjdG9yIGFsc28gc3luY2hyb25pemVzIHRpbWVycyB3aXRoIHRoZSByZWZyZXNoIHJhdGUgb2YgdGhlIGRpc3BsYXkuPGJyLz5cbiAqICAgRmVhdHVyZXMgYW5kIExpbWl0YXRpb25zOjxici8+XG4gKiAgICAgIC0gU2NoZWR1bGVkIHRpbWVycyAmIGRyYXdpbmcgYXJlIHN5bmNocm9uaXplcyB3aXRoIHRoZSByZWZyZXNoIHJhdGUgb2YgdGhlIGRpc3BsYXk8YnIvPlxuICogICAgICAtIE9ubHkgc3VwcG9ydHMgYW5pbWF0aW9uIGludGVydmFscyBvZiAxLzYwIDEvMzAgJiAxLzE1PGJyLz5cbiAqIDwvcD5cbiAqXG4gKiAhI3poXG4gKiA8cD5cbiAqICAgICDms6jmhI/vvJrnlKggY2MuZGlyZWN0b3Ig5Luj5pu/IGNjLkRpcmVjdG9y44CCPGJyLz5cbiAqICAgICBjYy5kaXJlY3RvciDkuIDkuKrnrqHnkIbkvaDnmoTmuLjmiI/nmoTpgLvovpHmtYHnqIvnmoTljZXkvovlr7nosaHjgII8YnIvPlxuICogICAgIOeUseS6jiBjYy5kaXJlY3RvciDmmK/kuIDkuKrljZXkvovvvIzkvaDkuI3pnIDopoHosIPnlKjku7vkvZXmnoTpgKDlh73mlbDmiJbliJvlu7rlh73mlbDvvIw8YnIvPlxuICogICAgIOS9v+eUqOWug+eahOagh+WHhuaWueazleaYr+mAmui/h+iwg+eUqO+8mjxici8+XG4gKiAgICAgICAtIGNjLmRpcmVjdG9yLm1ldGhvZE5hbWUoKTtcbiAqICAgICA8YnIvPlxuICogICAgIOWug+WIm+W7uuWSjOWkhOeQhuS4u+eql+WPo+W5tuS4lOeuoeeQhuS7gOS5iOaXtuWAmeaJp+ihjOWcuuaZr+OAgjxici8+XG4gKiAgICAgPGJyLz5cbiAqICAgICBjYy5kaXJlY3RvciDov5jotJ/otKPvvJo8YnIvPlxuICogICAgICAtIOWIneWni+WMliBPcGVuR0wg546v5aKD44CCPGJyLz5cbiAqICAgICAgLSDorr7nva5PcGVuR0zlg4/ntKDmoLzlvI/jgIIo6buY6K6k5pivIFJHQjU2NSk8YnIvPlxuICogICAgICAtIOiuvue9rk9wZW5HTOe8k+WGsuWMuua3seW6piAo6buY6K6k5pivIDAtYml0KTxici8+XG4gKiAgICAgIC0g6K6+572u56m655m95Zy65pmv55qE6aKc6ImyICjpu5jorqTmmK8g6buR6ImyKTxici8+XG4gKiAgICAgIC0g6K6+572u5oqV5b2xICjpu5jorqTmmK8gM0QpPGJyLz5cbiAqICAgICAgLSDorr7nva7mlrnlkJEgKOm7mOiupOaYryBQb3J0cmFpdCk8YnIvPlxuICogICAgPGJyLz5cbiAqICAgIGNjLmRpcmVjdG9yIOiuvue9ruS6hiBPcGVuR0wg6buY6K6k546v5aKDIDxici8+XG4gKiAgICAgIC0gR0xfVEVYVFVSRV8yRCAgIOWQr+eUqOOAgjxici8+XG4gKiAgICAgIC0gR0xfVkVSVEVYX0FSUkFZIOWQr+eUqOOAgjxici8+XG4gKiAgICAgIC0gR0xfQ09MT1JfQVJSQVkgIOWQr+eUqOOAgjxici8+XG4gKiAgICAgIC0gR0xfVEVYVFVSRV9DT09SRF9BUlJBWSDlkK/nlKjjgII8YnIvPlxuICogPC9wPlxuICogPHA+XG4gKiAgIGNjLmRpcmVjdG9yIOS5n+WQjOatpeWumuaXtuWZqOS4juaYvuekuuWZqOeahOWIt+aWsOmAn+eOh+OAglxuICogICA8YnIvPlxuICogICDnibnngrnlkozlsYDpmZDmgKc6IDxici8+XG4gKiAgICAgIC0g5bCG6K6h5pe25ZmoICYg5riy5p+T5LiO5pi+56S65Zmo55qE5Yi35paw6aKR546H5ZCM5q2l44CCPGJyLz5cbiAqICAgICAgLSDlj6rmlK/mjIHliqjnlLvnmoTpl7TpmpQgMS82MCAxLzMwICYgMS8xNeOAgjxici8+XG4gKiA8L3A+XG4gKlxuICogQGNsYXNzIERpcmVjdG9yXG4gKiBAZXh0ZW5kcyBFdmVudFRhcmdldFxuICovXG5jYy5EaXJlY3RvciA9IGZ1bmN0aW9uICgpIHtcbiAgICBFdmVudFRhcmdldC5jYWxsKHRoaXMpO1xuXG4gICAgLy8gcGF1c2VkP1xuICAgIHRoaXMuX3BhdXNlZCA9IGZhbHNlO1xuICAgIC8vIHB1cmdlP1xuICAgIHRoaXMuX3B1cmdlRGlyZWN0b3JJbk5leHRMb29wID0gZmFsc2U7XG5cbiAgICB0aGlzLl93aW5TaXplSW5Qb2ludHMgPSBudWxsO1xuXG4gICAgLy8gc2NlbmVzXG4gICAgdGhpcy5fbG9hZGluZ1NjZW5lID0gJyc7XG4gICAgdGhpcy5fc2NlbmUgPSBudWxsO1xuXG4gICAgLy8gRlBTXG4gICAgdGhpcy5fdG90YWxGcmFtZXMgPSAwO1xuICAgIHRoaXMuX2xhc3RVcGRhdGUgPSAwO1xuICAgIHRoaXMuX2RlbHRhVGltZSA9IDAuMDtcbiAgICB0aGlzLl9zdGFydFRpbWUgPSAwLjA7XG5cbiAgICAvLyBQYXJ0aWNsZVN5c3RlbSBtYXggc3RlcCBkZWx0YSB0aW1lXG4gICAgdGhpcy5fbWF4UGFydGljbGVEZWx0YVRpbWUgPSAwLjA7XG5cbiAgICAvLyBTY2hlZHVsZXIgZm9yIHVzZXIgcmVnaXN0cmF0aW9uIHVwZGF0ZVxuICAgIHRoaXMuX3NjaGVkdWxlciA9IG51bGw7XG4gICAgLy8gU2NoZWR1bGVyIGZvciBsaWZlLWN5Y2xlIG1ldGhvZHMgaW4gY29tcG9uZW50XG4gICAgdGhpcy5fY29tcFNjaGVkdWxlciA9IG51bGw7XG4gICAgLy8gTm9kZSBhY3RpdmF0b3JcbiAgICB0aGlzLl9ub2RlQWN0aXZhdG9yID0gbnVsbDtcbiAgICAvLyBBY3Rpb24gbWFuYWdlclxuICAgIHRoaXMuX2FjdGlvbk1hbmFnZXIgPSBudWxsO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGdhbWUub24oZ2FtZS5FVkVOVF9TSE9XLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYuX2xhc3RVcGRhdGUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICB9KTtcblxuICAgIGdhbWUub25jZShnYW1lLkVWRU5UX0VOR0lORV9JTklURUQsIHRoaXMuaW5pdCwgdGhpcyk7XG59O1xuXG5jYy5EaXJlY3Rvci5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IGNjLkRpcmVjdG9yLFxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fdG90YWxGcmFtZXMgPSAwO1xuICAgICAgICB0aGlzLl9sYXN0VXBkYXRlID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIHRoaXMuX3N0YXJ0VGltZSA9IHRoaXMuX2xhc3RVcGRhdGU7XG4gICAgICAgIHRoaXMuX3BhdXNlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9wdXJnZURpcmVjdG9ySW5OZXh0TG9vcCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl93aW5TaXplSW5Qb2ludHMgPSBjYy5zaXplKDAsIDApO1xuICAgICAgICB0aGlzLl9zY2hlZHVsZXIgPSBuZXcgU2NoZWR1bGVyKCk7XG5cbiAgICAgICAgaWYgKGNjLkFjdGlvbk1hbmFnZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2FjdGlvbk1hbmFnZXIgPSBuZXcgY2MuQWN0aW9uTWFuYWdlcigpO1xuICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVyLnNjaGVkdWxlVXBkYXRlKHRoaXMuX2FjdGlvbk1hbmFnZXIsIFNjaGVkdWxlci5QUklPUklUWV9TWVNURU0sIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2FjdGlvbk1hbmFnZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zaGFyZWRJbml0KCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIE1hbmFnZSBhbGwgaW5pdCBwcm9jZXNzIHNoYXJlZCBiZXR3ZWVuIHRoZSB3ZWIgZW5naW5lIGFuZCBqc2IgZW5naW5lLlxuICAgICAqIEFsbCBwbGF0Zm9ybSBpbmRlcGVuZGVudCBpbml0IHByb2Nlc3Mgc2hvdWxkIGJlIG9jY3VwaWVkIGhlcmUuXG4gICAgICovXG4gICAgc2hhcmVkSW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9jb21wU2NoZWR1bGVyID0gbmV3IENvbXBvbmVudFNjaGVkdWxlcigpO1xuICAgICAgICB0aGlzLl9ub2RlQWN0aXZhdG9yID0gbmV3IE5vZGVBY3RpdmF0b3IoKTtcblxuICAgICAgICAvLyBFdmVudCBtYW5hZ2VyXG4gICAgICAgIGlmIChldmVudE1hbmFnZXIpIHtcbiAgICAgICAgICAgIGV2ZW50TWFuYWdlci5zZXRFbmFibGVkKHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQW5pbWF0aW9uIG1hbmFnZXJcbiAgICAgICAgaWYgKGNjLkFuaW1hdGlvbk1hbmFnZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2FuaW1hdGlvbk1hbmFnZXIgPSBuZXcgY2MuQW5pbWF0aW9uTWFuYWdlcigpO1xuICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVyLnNjaGVkdWxlVXBkYXRlKHRoaXMuX2FuaW1hdGlvbk1hbmFnZXIsIFNjaGVkdWxlci5QUklPUklUWV9TWVNURU0sIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2FuaW1hdGlvbk1hbmFnZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY29sbGlzaW9uIG1hbmFnZXJcbiAgICAgICAgaWYgKGNjLkNvbGxpc2lvbk1hbmFnZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbGxpc2lvbk1hbmFnZXIgPSBuZXcgY2MuQ29sbGlzaW9uTWFuYWdlcigpO1xuICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVyLnNjaGVkdWxlVXBkYXRlKHRoaXMuX2NvbGxpc2lvbk1hbmFnZXIsIFNjaGVkdWxlci5QUklPUklUWV9TWVNURU0sIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbGxpc2lvbk1hbmFnZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcGh5c2ljcyBtYW5hZ2VyXG4gICAgICAgIGlmIChjYy5QaHlzaWNzTWFuYWdlcikge1xuICAgICAgICAgICAgdGhpcy5fcGh5c2ljc01hbmFnZXIgPSBuZXcgY2MuUGh5c2ljc01hbmFnZXIoKTtcbiAgICAgICAgICAgIHRoaXMuX3NjaGVkdWxlci5zY2hlZHVsZVVwZGF0ZSh0aGlzLl9waHlzaWNzTWFuYWdlciwgU2NoZWR1bGVyLlBSSU9SSVRZX1NZU1RFTSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcGh5c2ljc01hbmFnZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcGh5c2ljcyAzZCBtYW5hZ2VyXG4gICAgICAgIGlmIChjYy5QaHlzaWNzM0RNYW5hZ2VyKSB7XG4gICAgICAgICAgICB0aGlzLl9waHlzaWNzM0RNYW5hZ2VyID0gbmV3IGNjLlBoeXNpY3MzRE1hbmFnZXIoKTtcbiAgICAgICAgICAgIHRoaXMuX3NjaGVkdWxlci5zY2hlZHVsZVVwZGF0ZSh0aGlzLl9waHlzaWNzM0RNYW5hZ2VyLCBTY2hlZHVsZXIuUFJJT1JJVFlfU1lTVEVNLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9waHlzaWNzM0RNYW5hZ2VyID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdpZGdldE1hbmFnZXJcbiAgICAgICAgaWYgKGNjLl93aWRnZXRNYW5hZ2VyKSB7XG4gICAgICAgICAgICBjYy5fd2lkZ2V0TWFuYWdlci5pbml0KHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2MubG9hZGVyLmluaXQodGhpcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGNhbGN1bGF0ZXMgZGVsdGEgdGltZSBzaW5jZSBsYXN0IHRpbWUgaXQgd2FzIGNhbGxlZFxuICAgICAqL1xuICAgIGNhbGN1bGF0ZURlbHRhVGltZTogZnVuY3Rpb24gKG5vdykge1xuICAgICAgICBpZiAoIW5vdykgbm93ID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICAgICAgLy8gYXZvaWQgZGVsdGEgdGltZSBmcm9tIGJlaW5nIG5lZ2F0aXZlXG4gICAgICAgIC8vIG5lZ2F0aXZlIGRlbHRhVGltZSB3b3VsZCBiZSBjYXVzZWQgYnkgdGhlIHByZWNpc2lvbiBvZiBub3cncyB2YWx1ZSwgZm9yIGRldGFpbHMgcGxlYXNlIHNlZTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvemgtQ04vZG9jcy9XZWIvQVBJL3dpbmRvdy9yZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgICAgICAgdGhpcy5fZGVsdGFUaW1lID0gbm93ID4gdGhpcy5fbGFzdFVwZGF0ZSA/IChub3cgLSB0aGlzLl9sYXN0VXBkYXRlKSAvIDEwMDAgOiAwO1xuICAgICAgICBpZiAoQ0NfREVCVUcgJiYgKHRoaXMuX2RlbHRhVGltZSA+IDEpKVxuICAgICAgICAgICAgdGhpcy5fZGVsdGFUaW1lID0gMSAvIDYwLjA7XG5cbiAgICAgICAgdGhpcy5fbGFzdFVwZGF0ZSA9IG5vdztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIENvbnZlcnRzIGEgdmlldyBjb29yZGluYXRlIHRvIGFuIFdlYkdMIGNvb3JkaW5hdGU8YnIvPlxuICAgICAqIFVzZWZ1bCB0byBjb252ZXJ0IChtdWx0aSkgdG91Y2hlcyBjb29yZGluYXRlcyB0byB0aGUgY3VycmVudCBsYXlvdXQgKHBvcnRyYWl0IG9yIGxhbmRzY2FwZSk8YnIvPlxuICAgICAqIEltcGxlbWVudGF0aW9uIGNhbiBiZSBmb3VuZCBpbiBDQ0RpcmVjdG9yV2ViR0wuXG4gICAgICogISN6aCDlsIbop6bmkbjngrnnmoTlsY/luZXlnZDmoIfovazmjaLkuLogV2ViR0wgVmlldyDkuIvnmoTlnZDmoIfjgIJcbiAgICAgKiBAbWV0aG9kIGNvbnZlcnRUb0dMXG4gICAgICogQHBhcmFtIHtWZWMyfSB1aVBvaW50XG4gICAgICogQHJldHVybiB7VmVjMn1cbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wXG4gICAgICovXG4gICAgY29udmVydFRvR0w6IGZ1bmN0aW9uICh1aVBvaW50KSB7XG4gICAgICAgIHZhciBjb250YWluZXIgPSBnYW1lLmNvbnRhaW5lcjtcbiAgICAgICAgdmFyIHZpZXcgPSBjYy52aWV3O1xuICAgICAgICB2YXIgYm94ID0gY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB2YXIgbGVmdCA9IGJveC5sZWZ0ICsgd2luZG93LnBhZ2VYT2Zmc2V0IC0gY29udGFpbmVyLmNsaWVudExlZnQ7XG4gICAgICAgIHZhciB0b3AgPSBib3gudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0IC0gY29udGFpbmVyLmNsaWVudFRvcDtcbiAgICAgICAgdmFyIHggPSB2aWV3Ll9kZXZpY2VQaXhlbFJhdGlvICogKHVpUG9pbnQueCAtIGxlZnQpO1xuICAgICAgICB2YXIgeSA9IHZpZXcuX2RldmljZVBpeGVsUmF0aW8gKiAodG9wICsgYm94LmhlaWdodCAtIHVpUG9pbnQueSk7XG4gICAgICAgIHJldHVybiB2aWV3Ll9pc1JvdGF0ZWQgPyBjYy52Mih2aWV3Ll92aWV3cG9ydFJlY3Qud2lkdGggLSB5LCB4KSA6IGNjLnYyKHgsIHkpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQ29udmVydHMgYW4gT3BlbkdMIGNvb3JkaW5hdGUgdG8gYSB2aWV3IGNvb3JkaW5hdGU8YnIvPlxuICAgICAqIFVzZWZ1bCB0byBjb252ZXJ0IG5vZGUgcG9pbnRzIHRvIHdpbmRvdyBwb2ludHMgZm9yIGNhbGxzIHN1Y2ggYXMgZ2xTY2lzc29yPGJyLz5cbiAgICAgKiBJbXBsZW1lbnRhdGlvbiBjYW4gYmUgZm91bmQgaW4gQ0NEaXJlY3RvcldlYkdMLlxuICAgICAqICEjemgg5bCG6Kem5pG454K555qEIFdlYkdMIFZpZXcg5Z2Q5qCH6L2s5o2i5Li65bGP5bmV5Z2Q5qCH44CCXG4gICAgICogQG1ldGhvZCBjb252ZXJ0VG9VSVxuICAgICAqIEBwYXJhbSB7VmVjMn0gZ2xQb2ludFxuICAgICAqIEByZXR1cm4ge1ZlYzJ9XG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMFxuICAgICAqL1xuICAgIGNvbnZlcnRUb1VJOiBmdW5jdGlvbiAoZ2xQb2ludCkge1xuICAgICAgICB2YXIgY29udGFpbmVyID0gZ2FtZS5jb250YWluZXI7XG4gICAgICAgIHZhciB2aWV3ID0gY2MudmlldztcbiAgICAgICAgdmFyIGJveCA9IGNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdmFyIGxlZnQgPSBib3gubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldCAtIGNvbnRhaW5lci5jbGllbnRMZWZ0O1xuICAgICAgICB2YXIgdG9wID0gYm94LnRvcCArIHdpbmRvdy5wYWdlWU9mZnNldCAtIGNvbnRhaW5lci5jbGllbnRUb3A7XG4gICAgICAgIHZhciB1aVBvaW50ID0gY2MudjIoMCwgMCk7XG4gICAgICAgIGlmICh2aWV3Ll9pc1JvdGF0ZWQpIHtcbiAgICAgICAgICAgIHVpUG9pbnQueCA9IGxlZnQgKyBnbFBvaW50LnkgLyB2aWV3Ll9kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgdWlQb2ludC55ID0gdG9wICsgYm94LmhlaWdodCAtICh2aWV3Ll92aWV3cG9ydFJlY3Qud2lkdGggLSBnbFBvaW50LngpIC8gdmlldy5fZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHVpUG9pbnQueCA9IGxlZnQgKyBnbFBvaW50LnggKiB2aWV3Ll9kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgdWlQb2ludC55ID0gdG9wICsgYm94LmhlaWdodCAtIGdsUG9pbnQueSAqIHZpZXcuX2RldmljZVBpeGVsUmF0aW87XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVpUG9pbnQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEVuZCB0aGUgbGlmZSBvZiBkaXJlY3RvciBpbiB0aGUgbmV4dCBmcmFtZVxuICAgICAqIEBtZXRob2QgZW5kXG4gICAgICovXG4gICAgZW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3B1cmdlRGlyZWN0b3JJbk5leHRMb29wID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJldHVybnMgdGhlIHNpemUgb2YgdGhlIFdlYkdMIHZpZXcgaW4gcG9pbnRzLjxici8+XG4gICAgICogSXQgdGFrZXMgaW50byBhY2NvdW50IGFueSBwb3NzaWJsZSByb3RhdGlvbiAoZGV2aWNlIG9yaWVudGF0aW9uKSBvZiB0aGUgd2luZG93LlxuICAgICAqICEjemgg6I635Y+W6KeG5Zu+55qE5aSn5bCP77yM5Lul54K55Li65Y2V5L2N44CCXG4gICAgICogQG1ldGhvZCBnZXRXaW5TaXplXG4gICAgICogQHJldHVybiB7U2l6ZX1cbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wXG4gICAgICovXG4gICAgZ2V0V2luU2l6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gY2Muc2l6ZShjYy53aW5TaXplKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJldHVybnMgdGhlIHNpemUgb2YgdGhlIE9wZW5HTCB2aWV3IGluIHBpeGVscy48YnIvPlxuICAgICAqIEl0IHRha2VzIGludG8gYWNjb3VudCBhbnkgcG9zc2libGUgcm90YXRpb24gKGRldmljZSBvcmllbnRhdGlvbikgb2YgdGhlIHdpbmRvdy48YnIvPlxuICAgICAqIE9uIE1hYyB3aW5TaXplIGFuZCB3aW5TaXplSW5QaXhlbHMgcmV0dXJuIHRoZSBzYW1lIHZhbHVlLlxuICAgICAqIChUaGUgcGl4ZWwgaGVyZSByZWZlcnMgdG8gdGhlIHJlc291cmNlIHJlc29sdXRpb24uIElmIHlvdSB3YW50IHRvIGdldCB0aGUgcGh5c2ljcyByZXNvbHV0aW9uIG9mIGRldmljZSwgeW91IG5lZWQgdG8gdXNlIGNjLnZpZXcuZ2V0RnJhbWVTaXplKCkpXG4gICAgICogISN6aFxuICAgICAqIOiOt+WPluinhuWbvuWkp+Wwj++8jOS7peWDj+e0oOS4uuWNleS9je+8iOi/memHjOeahOWDj+e0oOaMh+eahOaYr+i1hOa6kOWIhui+qOeOh+OAglxuICAgICAqIOWmguaenOimgeiOt+WPluWxj+W5leeJqeeQhuWIhui+qOeOh++8jOmcgOimgeeUqCBjYy52aWV3LmdldEZyYW1lU2l6ZSgp77yJXG4gICAgICogQG1ldGhvZCBnZXRXaW5TaXplSW5QaXhlbHNcbiAgICAgKiBAcmV0dXJuIHtTaXplfVxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjBcbiAgICAgKi9cbiAgICBnZXRXaW5TaXplSW5QaXhlbHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGNjLnNpemUoY2Mud2luU2l6ZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUGF1c2UgdGhlIGRpcmVjdG9yJ3MgdGlja2VyLCBvbmx5IGludm9sdmUgdGhlIGdhbWUgbG9naWMgZXhlY3V0aW9uLlxuICAgICAqIEl0IHdvbid0IHBhdXNlIHRoZSByZW5kZXJpbmcgcHJvY2VzcyBub3IgdGhlIGV2ZW50IG1hbmFnZXIuXG4gICAgICogSWYgeW91IHdhbnQgdG8gcGF1c2UgdGhlIGVudGllciBnYW1lIGluY2x1ZGluZyByZW5kZXJpbmcsIGF1ZGlvIGFuZCBldmVudCwgXG4gICAgICogcGxlYXNlIHVzZSB7eyNjcm9zc0xpbmsgXCJHYW1lLnBhdXNlXCJ9fWNjLmdhbWUucGF1c2V7ey9jcm9zc0xpbmt9fVxuICAgICAqICEjemgg5pqC5YGc5q2j5Zyo6L+Q6KGM55qE5Zy65pmv77yM6K+l5pqC5YGc5Y+q5Lya5YGc5q2i5ri45oiP6YC76L6R5omn6KGM77yM5L2G5piv5LiN5Lya5YGc5q2i5riy5p+T5ZKMIFVJIOWTjeW6lOOAglxuICAgICAqIOWmguaenOaDs+imgeabtOW9u+W6leW+l+aaguWBnOa4uOaIj++8jOWMheWQq+a4suafk++8jOmfs+mikeWSjOS6i+S7tu+8jOivt+S9v+eUqCB7eyNjcm9zc0xpbmsgXCJHYW1lLnBhdXNlXCJ9fWNjLmdhbWUucGF1c2V7ey9jcm9zc0xpbmt9feOAglxuICAgICAqIEBtZXRob2QgcGF1c2VcbiAgICAgKi9cbiAgICBwYXVzZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fcGF1c2VkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLl9wYXVzZWQgPSB0cnVlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGNhY2hlZCBhbGwgY29jb3MyZCBjYWNoZWQgZGF0YS5cbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wXG4gICAgICovXG4gICAgcHVyZ2VDYWNoZWREYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmxvYWRlci5yZWxlYXNlQWxsKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFB1cmdlIHRoZSBjYy5kaXJlY3RvciBpdHNlbGYsIGluY2x1ZGluZyB1bnNjaGVkdWxlIGFsbCBzY2hlZHVsZSwgcmVtb3ZlIGFsbCBldmVudCBsaXN0ZW5lcnMsIGNsZWFuIHVwIGFuZCBleGl0IHRoZSBydW5uaW5nIHNjZW5lLCBzdG9wcyBhbGwgYW5pbWF0aW9ucywgY2xlYXIgY2FjaGVkIGRhdGEuXG4gICAgICovXG4gICAgcHVyZ2VEaXJlY3RvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAvL2NsZWFudXAgc2NoZWR1bGVyXG4gICAgICAgIHRoaXMuX3NjaGVkdWxlci51bnNjaGVkdWxlQWxsKCk7XG4gICAgICAgIHRoaXMuX2NvbXBTY2hlZHVsZXIudW5zY2hlZHVsZUFsbCgpO1xuXG4gICAgICAgIHRoaXMuX25vZGVBY3RpdmF0b3IucmVzZXQoKTtcblxuICAgICAgICAvLyBEaXNhYmxlIGV2ZW50IGRpc3BhdGNoaW5nXG4gICAgICAgIGlmIChldmVudE1hbmFnZXIpXG4gICAgICAgICAgICBldmVudE1hbmFnZXIuc2V0RW5hYmxlZChmYWxzZSk7XG5cbiAgICAgICAgaWYgKCFDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIGlmIChjYy5pc1ZhbGlkKHRoaXMuX3NjZW5lKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NjZW5lLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3NjZW5lID0gbnVsbDtcblxuICAgICAgICAgICAgY2MucmVuZGVyZXIuY2xlYXIoKTtcbiAgICAgICAgICAgIGNjLkFzc2V0TGlicmFyeS5yZXNldEJ1aWx0aW5zKCk7XG4gICAgICAgIH1cblxuICAgICAgICBjYy5nYW1lLnBhdXNlKCk7XG5cbiAgICAgICAgLy8gQ2xlYXIgYWxsIGNhY2hlc1xuICAgICAgICBjYy5sb2FkZXIucmVsZWFzZUFsbCgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXNldCB0aGUgY2MuZGlyZWN0b3IsIGNhbiBiZSB1c2VkIHRvIHJlc3RhcnQgdGhlIGRpcmVjdG9yIGFmdGVyIHB1cmdlXG4gICAgICovXG4gICAgcmVzZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5wdXJnZURpcmVjdG9yKCk7XG5cbiAgICAgICAgaWYgKGV2ZW50TWFuYWdlcilcbiAgICAgICAgICAgIGV2ZW50TWFuYWdlci5zZXRFbmFibGVkKHRydWUpO1xuXG4gICAgICAgIC8vIEFjdGlvbiBtYW5hZ2VyXG4gICAgICAgIGlmICh0aGlzLl9hY3Rpb25NYW5hZ2VyKXtcbiAgICAgICAgICAgIHRoaXMuX3NjaGVkdWxlci5zY2hlZHVsZVVwZGF0ZSh0aGlzLl9hY3Rpb25NYW5hZ2VyLCBjYy5TY2hlZHVsZXIuUFJJT1JJVFlfU1lTVEVNLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBbmltYXRpb24gbWFuYWdlclxuICAgICAgICBpZiAodGhpcy5fYW5pbWF0aW9uTWFuYWdlcikge1xuICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVyLnNjaGVkdWxlVXBkYXRlKHRoaXMuX2FuaW1hdGlvbk1hbmFnZXIsIGNjLlNjaGVkdWxlci5QUklPUklUWV9TWVNURU0sIGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvbGxpZGVyIG1hbmFnZXJcbiAgICAgICAgaWYgKHRoaXMuX2NvbGxpc2lvbk1hbmFnZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX3NjaGVkdWxlci5zY2hlZHVsZVVwZGF0ZSh0aGlzLl9jb2xsaXNpb25NYW5hZ2VyLCBjYy5TY2hlZHVsZXIuUFJJT1JJVFlfU1lTVEVNLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQaHlzaWNzIG1hbmFnZXJcbiAgICAgICAgaWYgKHRoaXMuX3BoeXNpY3NNYW5hZ2VyKSB7XG4gICAgICAgICAgICB0aGlzLl9zY2hlZHVsZXIuc2NoZWR1bGVVcGRhdGUodGhpcy5fcGh5c2ljc01hbmFnZXIsIGNjLlNjaGVkdWxlci5QUklPUklUWV9TWVNURU0sIGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNjLmdhbWUucmVzdW1lKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSdW4gYSBzY2VuZS4gUmVwbGFjZXMgdGhlIHJ1bm5pbmcgc2NlbmUgd2l0aCBhIG5ldyBvbmUgb3IgZW50ZXIgdGhlIGZpcnN0IHNjZW5lLjxici8+XG4gICAgICogVGhlIG5ldyBzY2VuZSB3aWxsIGJlIGxhdW5jaGVkIGltbWVkaWF0ZWx5LlxuICAgICAqICEjemgg56uL5Yi75YiH5o2i5oyH5a6a5Zy65pmv44CCXG4gICAgICogQG1ldGhvZCBydW5TY2VuZUltbWVkaWF0ZVxuICAgICAqIEBwYXJhbSB7U2NlbmV9IHNjZW5lIC0gVGhlIG5lZWQgcnVuIHNjZW5lLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvbkJlZm9yZUxvYWRTY2VuZV0gLSBUaGUgZnVuY3Rpb24gaW52b2tlZCBhdCB0aGUgc2NlbmUgYmVmb3JlIGxvYWRpbmcuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29uTGF1bmNoZWRdIC0gVGhlIGZ1bmN0aW9uIGludm9rZWQgYXQgdGhlIHNjZW5lIGFmdGVyIGxhdW5jaC5cbiAgICAgKi9cbiAgICBydW5TY2VuZUltbWVkaWF0ZTogZnVuY3Rpb24gKHNjZW5lLCBvbkJlZm9yZUxvYWRTY2VuZSwgb25MYXVuY2hlZCkge1xuICAgICAgICBjYy5hc3NlcnRJRChzY2VuZSBpbnN0YW5jZW9mIGNjLlNjZW5lLCAxMjE2KTtcblxuICAgICAgICBDQ19CVUlMRCAmJiBDQ19ERUJVRyAmJiBjb25zb2xlLnRpbWUoJ0luaXRTY2VuZScpO1xuICAgICAgICBzY2VuZS5fbG9hZCgpOyAgLy8gZW5zdXJlIHNjZW5lIGluaXRpYWxpemVkXG4gICAgICAgIENDX0JVSUxEICYmIENDX0RFQlVHICYmIGNvbnNvbGUudGltZUVuZCgnSW5pdFNjZW5lJyk7XG5cbiAgICAgICAgLy8gUmUtYXR0YWNoIG9yIHJlcGxhY2UgcGVyc2lzdCBub2Rlc1xuICAgICAgICBDQ19CVUlMRCAmJiBDQ19ERUJVRyAmJiBjb25zb2xlLnRpbWUoJ0F0dGFjaFBlcnNpc3QnKTtcbiAgICAgICAgdmFyIHBlcnNpc3ROb2RlTGlzdCA9IE9iamVjdC5rZXlzKGdhbWUuX3BlcnNpc3RSb290Tm9kZXMpLm1hcChmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgcmV0dXJuIGdhbWUuX3BlcnNpc3RSb290Tm9kZXNbeF07XG4gICAgICAgIH0pO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBlcnNpc3ROb2RlTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IG5vZGUgPSBwZXJzaXN0Tm9kZUxpc3RbaV07XG4gICAgICAgICAgICB2YXIgZXhpc3ROb2RlID0gc2NlbmUuZ2V0Q2hpbGRCeVV1aWQobm9kZS51dWlkKTtcbiAgICAgICAgICAgIGlmIChleGlzdE5vZGUpIHtcbiAgICAgICAgICAgICAgICAvLyBzY2VuZSBhbHNvIGNvbnRhaW5zIHRoZSBwZXJzaXN0IG5vZGUsIHNlbGVjdCB0aGUgb2xkIG9uZVxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IGV4aXN0Tm9kZS5nZXRTaWJsaW5nSW5kZXgoKTtcbiAgICAgICAgICAgICAgICBleGlzdE5vZGUuX2Rlc3Ryb3lJbW1lZGlhdGUoKTtcbiAgICAgICAgICAgICAgICBzY2VuZS5pbnNlcnRDaGlsZChub2RlLCBpbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBub2RlLnBhcmVudCA9IHNjZW5lO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIENDX0JVSUxEICYmIENDX0RFQlVHICYmIGNvbnNvbGUudGltZUVuZCgnQXR0YWNoUGVyc2lzdCcpO1xuXG4gICAgICAgIHZhciBvbGRTY2VuZSA9IHRoaXMuX3NjZW5lO1xuICAgICAgICBpZiAoIUNDX0VESVRPUikge1xuICAgICAgICAgICAgLy8gYXV0byByZWxlYXNlIGFzc2V0c1xuICAgICAgICAgICAgQ0NfQlVJTEQgJiYgQ0NfREVCVUcgJiYgY29uc29sZS50aW1lKCdBdXRvUmVsZWFzZScpO1xuICAgICAgICAgICAgdmFyIGF1dG9SZWxlYXNlQXNzZXRzID0gb2xkU2NlbmUgJiYgb2xkU2NlbmUuYXV0b1JlbGVhc2VBc3NldHMgJiYgb2xkU2NlbmUuZGVwZW5kQXNzZXRzO1xuICAgICAgICAgICAgQXV0b1JlbGVhc2VVdGlscy5hdXRvUmVsZWFzZShhdXRvUmVsZWFzZUFzc2V0cywgc2NlbmUuZGVwZW5kQXNzZXRzLCBwZXJzaXN0Tm9kZUxpc3QpO1xuICAgICAgICAgICAgQ0NfQlVJTEQgJiYgQ0NfREVCVUcgJiYgY29uc29sZS50aW1lRW5kKCdBdXRvUmVsZWFzZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdW5sb2FkIHNjZW5lXG4gICAgICAgIENDX0JVSUxEICYmIENDX0RFQlVHICYmIGNvbnNvbGUudGltZSgnRGVzdHJveScpO1xuICAgICAgICBpZiAoY2MuaXNWYWxpZChvbGRTY2VuZSkpIHtcbiAgICAgICAgICAgIG9sZFNjZW5lLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3NjZW5lID0gbnVsbDtcblxuICAgICAgICAvLyBwdXJnZSBkZXN0cm95ZWQgbm9kZXMgYmVsb25ncyB0byBvbGQgc2NlbmVcbiAgICAgICAgT2JqLl9kZWZlcnJlZERlc3Ryb3koKTtcbiAgICAgICAgQ0NfQlVJTEQgJiYgQ0NfREVCVUcgJiYgY29uc29sZS50aW1lRW5kKCdEZXN0cm95Jyk7XG5cbiAgICAgICAgaWYgKG9uQmVmb3JlTG9hZFNjZW5lKSB7XG4gICAgICAgICAgICBvbkJlZm9yZUxvYWRTY2VuZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW1pdChjYy5EaXJlY3Rvci5FVkVOVF9CRUZPUkVfU0NFTkVfTEFVTkNILCBzY2VuZSk7XG5cbiAgICAgICAgLy8gUnVuIGFuIEVudGl0eSBTY2VuZVxuICAgICAgICB0aGlzLl9zY2VuZSA9IHNjZW5lO1xuXG4gICAgICAgIENDX0JVSUxEICYmIENDX0RFQlVHICYmIGNvbnNvbGUudGltZSgnQWN0aXZhdGUnKTtcbiAgICAgICAgc2NlbmUuX2FjdGl2YXRlKCk7XG4gICAgICAgIENDX0JVSUxEICYmIENDX0RFQlVHICYmIGNvbnNvbGUudGltZUVuZCgnQWN0aXZhdGUnKTtcblxuICAgICAgICAvL3N0YXJ0IHNjZW5lXG4gICAgICAgIGNjLmdhbWUucmVzdW1lKCk7XG5cbiAgICAgICAgaWYgKG9uTGF1bmNoZWQpIHtcbiAgICAgICAgICAgIG9uTGF1bmNoZWQobnVsbCwgc2NlbmUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW1pdChjYy5EaXJlY3Rvci5FVkVOVF9BRlRFUl9TQ0VORV9MQVVOQ0gsIHNjZW5lKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJ1biBhIHNjZW5lLiBSZXBsYWNlcyB0aGUgcnVubmluZyBzY2VuZSB3aXRoIGEgbmV3IG9uZSBvciBlbnRlciB0aGUgZmlyc3Qgc2NlbmUuXG4gICAgICogVGhlIG5ldyBzY2VuZSB3aWxsIGJlIGxhdW5jaGVkIGF0IHRoZSBlbmQgb2YgdGhlIGN1cnJlbnQgZnJhbWUuXG4gICAgICogISN6aCDov5DooYzmjIflrprlnLrmma/jgIJcbiAgICAgKiBAbWV0aG9kIHJ1blNjZW5lXG4gICAgICogQHBhcmFtIHtTY2VuZX0gc2NlbmUgLSBUaGUgbmVlZCBydW4gc2NlbmUuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29uQmVmb3JlTG9hZFNjZW5lXSAtIFRoZSBmdW5jdGlvbiBpbnZva2VkIGF0IHRoZSBzY2VuZSBiZWZvcmUgbG9hZGluZy5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25MYXVuY2hlZF0gLSBUaGUgZnVuY3Rpb24gaW52b2tlZCBhdCB0aGUgc2NlbmUgYWZ0ZXIgbGF1bmNoLlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgcnVuU2NlbmU6IGZ1bmN0aW9uIChzY2VuZSwgb25CZWZvcmVMb2FkU2NlbmUsIG9uTGF1bmNoZWQpIHtcbiAgICAgICAgY2MuYXNzZXJ0SUQoc2NlbmUsIDEyMDUpO1xuICAgICAgICBjYy5hc3NlcnRJRChzY2VuZSBpbnN0YW5jZW9mIGNjLlNjZW5lLCAxMjE2KTtcblxuICAgICAgICAvLyBlbnN1cmUgc2NlbmUgaW5pdGlhbGl6ZWRcbiAgICAgICAgc2NlbmUuX2xvYWQoKTtcblxuICAgICAgICAvLyBEZWxheSBydW4gLyByZXBsYWNlIHNjZW5lIHRvIHRoZSBlbmQgb2YgdGhlIGZyYW1lXG4gICAgICAgIHRoaXMub25jZShjYy5EaXJlY3Rvci5FVkVOVF9BRlRFUl9VUERBVEUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMucnVuU2NlbmVJbW1lZGlhdGUoc2NlbmUsIG9uQmVmb3JlTG9hZFNjZW5lLCBvbkxhdW5jaGVkKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIC8vICBAU2NlbmUgbG9hZGluZyBzZWN0aW9uXG5cbiAgICBfZ2V0U2NlbmVVdWlkOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHZhciBzY2VuZXMgPSBnYW1lLl9zY2VuZUluZm9zO1xuICAgICAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmICgha2V5LmVuZHNXaXRoKCcuZmlyZScpKSB7XG4gICAgICAgICAgICAgICAga2V5ICs9ICcuZmlyZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoa2V5WzBdICE9PSAnLycgJiYgIWtleS5zdGFydHNXaXRoKCdkYjovLycpKSB7XG4gICAgICAgICAgICAgICAga2V5ID0gJy8nICsga2V5OyAgICAvLyDkvb/nlKjlhajlkI3ljLnphY1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNlYXJjaCBzY2VuZVxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2VuZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5mbyA9IHNjZW5lc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoaW5mby51cmwuZW5kc1dpdGgoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5mbztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIGtleSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGlmICgwIDw9IGtleSAmJiBrZXkgPCBzY2VuZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNjZW5lc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgxMjA2LCBrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgxMjA3LCBrZXkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIExvYWRzIHRoZSBzY2VuZSBieSBpdHMgbmFtZS5cbiAgICAgKiAhI3poIOmAmui/h+WcuuaZr+WQjeensOi/m+ihjOWKoOi9veWcuuaZr+OAglxuICAgICAqXG4gICAgICogQG1ldGhvZCBsb2FkU2NlbmVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc2NlbmVOYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHNjZW5lIHRvIGxvYWQuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29uTGF1bmNoZWRdIC0gY2FsbGJhY2ssIHdpbGwgYmUgY2FsbGVkIGFmdGVyIHNjZW5lIGxhdW5jaGVkLlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IGlmIGVycm9yLCByZXR1cm4gZmFsc2VcbiAgICAgKi9cbiAgICBsb2FkU2NlbmU6IGZ1bmN0aW9uIChzY2VuZU5hbWUsIG9uTGF1bmNoZWQsIF9vblVubG9hZGVkKSB7XG4gICAgICAgIGlmICh0aGlzLl9sb2FkaW5nU2NlbmUpIHtcbiAgICAgICAgICAgIGNjLndhcm5JRCgxMjA4LCBzY2VuZU5hbWUsIHRoaXMuX2xvYWRpbmdTY2VuZSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGluZm8gPSB0aGlzLl9nZXRTY2VuZVV1aWQoc2NlbmVOYW1lKTtcbiAgICAgICAgaWYgKGluZm8pIHtcbiAgICAgICAgICAgIHZhciB1dWlkID0gaW5mby51dWlkO1xuICAgICAgICAgICAgdGhpcy5lbWl0KGNjLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9TQ0VORV9MT0FESU5HLCBzY2VuZU5hbWUpO1xuICAgICAgICAgICAgdGhpcy5fbG9hZGluZ1NjZW5lID0gc2NlbmVOYW1lO1xuICAgICAgICAgICAgdGhpcy5fbG9hZFNjZW5lQnlVdWlkKHV1aWQsIG9uTGF1bmNoZWQsIF9vblVubG9hZGVkKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgxMjA5LCBzY2VuZU5hbWUpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBQcmVsb2FkcyB0aGUgc2NlbmUgdG8gcmVkdWNlcyBsb2FkaW5nIHRpbWUuIFlvdSBjYW4gY2FsbCB0aGlzIG1ldGhvZCBhdCBhbnkgdGltZSB5b3Ugd2FudC5cbiAgICAgKiBBZnRlciBjYWxsaW5nIHRoaXMgbWV0aG9kLCB5b3Ugc3RpbGwgbmVlZCB0byBsYXVuY2ggdGhlIHNjZW5lIGJ5IGBjYy5kaXJlY3Rvci5sb2FkU2NlbmVgLlxuICAgICAqIEl0IHdpbGwgYmUgdG90YWxseSBmaW5lIHRvIGNhbGwgYGNjLmRpcmVjdG9yLmxvYWRTY2VuZWAgYXQgYW55IHRpbWUgZXZlbiBpZiB0aGUgcHJlbG9hZGluZyBpcyBub3RcbiAgICAgKiB5ZXQgZmluaXNoZWQsIHRoZSBzY2VuZSB3aWxsIGJlIGxhdW5jaGVkIGFmdGVyIGxvYWRlZCBhdXRvbWF0aWNhbGx5LlxuICAgICAqICEjemgg6aKE5Yqg6L295Zy65pmv77yM5L2g5Y+v5Lul5Zyo5Lu75L2V5pe25YCZ6LCD55So6L+Z5Liq5pa55rOV44CCXG4gICAgICog6LCD55So5a6M5ZCO77yM5L2g5LuN54S26ZyA6KaB6YCa6L+HIGBjYy5kaXJlY3Rvci5sb2FkU2NlbmVgIOadpeWQr+WKqOWcuuaZr++8jOWboOS4uui/meS4quaWueazleS4jeS8muaJp+ihjOWcuuaZr+WKoOi9veaTjeS9nOOAglxuICAgICAqIOWwseeul+mihOWKoOi9vei/mOayoeWujOaIkO+8jOS9oOS5n+WPr+S7peebtOaOpeiwg+eUqCBgY2MuZGlyZWN0b3IubG9hZFNjZW5lYO+8jOWKoOi9veWujOaIkOWQjuWcuuaZr+WwseS8muWQr+WKqOOAglxuICAgICAqXG4gICAgICogQG1ldGhvZCBwcmVsb2FkU2NlbmVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc2NlbmVOYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHNjZW5lIHRvIHByZWxvYWQuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29uUHJvZ3Jlc3NdIC0gY2FsbGJhY2ssIHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlIGxvYWQgcHJvZ3Jlc3Npb24gY2hhbmdlLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvblByb2dyZXNzLmNvbXBsZXRlZENvdW50IC0gVGhlIG51bWJlciBvZiB0aGUgaXRlbXMgdGhhdCBhcmUgYWxyZWFkeSBjb21wbGV0ZWRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb25Qcm9ncmVzcy50b3RhbENvdW50IC0gVGhlIHRvdGFsIG51bWJlciBvZiB0aGUgaXRlbXNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb25Qcm9ncmVzcy5pdGVtIC0gVGhlIGxhdGVzdCBpdGVtIHdoaWNoIGZsb3cgb3V0IHRoZSBwaXBlbGluZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvbkxvYWRlZF0gLSBjYWxsYmFjaywgd2lsbCBiZSBjYWxsZWQgYWZ0ZXIgc2NlbmUgbG9hZGVkLlxuICAgICAqIEBwYXJhbSB7RXJyb3J9IG9uTG9hZGVkLmVycm9yIC0gbnVsbCBvciB0aGUgZXJyb3Igb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7Y2MuU2NlbmVBc3NldH0gb25Mb2FkZWQuYXNzZXQgLSBUaGUgc2NlbmUgYXNzZXQgaXRzZWxmLlxuICAgICAqL1xuICAgIHByZWxvYWRTY2VuZTogZnVuY3Rpb24gKHNjZW5lTmFtZSwgb25Qcm9ncmVzcywgb25Mb2FkZWQpIHtcbiAgICAgICAgaWYgKG9uTG9hZGVkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG9uTG9hZGVkID0gb25Qcm9ncmVzcztcbiAgICAgICAgICAgIG9uUHJvZ3Jlc3MgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGluZm8gPSB0aGlzLl9nZXRTY2VuZVV1aWQoc2NlbmVOYW1lKTtcbiAgICAgICAgaWYgKGluZm8pIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdChjYy5EaXJlY3Rvci5FVkVOVF9CRUZPUkVfU0NFTkVfTE9BRElORywgc2NlbmVOYW1lKTtcbiAgICAgICAgICAgIGNjLmxvYWRlci5sb2FkKHsgdXVpZDogaW5mby51dWlkLCB0eXBlOiAndXVpZCcgfSwgXG4gICAgICAgICAgICAgICAgb25Qcm9ncmVzcywgICAgXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVycm9yLCBhc3NldCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoMTIxMCwgc2NlbmVOYW1lLCBlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob25Mb2FkZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uTG9hZGVkKGVycm9yLCBhc3NldCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTsgICAgICAgXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgZXJyb3IgPSAnQ2FuIG5vdCBwcmVsb2FkIHRoZSBzY2VuZSBcIicgKyBzY2VuZU5hbWUgKyAnXCIgYmVjYXVzZSBpdCBpcyBub3QgaW4gdGhlIGJ1aWxkIHNldHRpbmdzLic7XG4gICAgICAgICAgICBvbkxvYWRlZChuZXcgRXJyb3IoZXJyb3IpKTtcbiAgICAgICAgICAgIGNjLmVycm9yKCdwcmVsb2FkU2NlbmU6ICcgKyBlcnJvcik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTG9hZHMgdGhlIHNjZW5lIGJ5IGl0cyB1dWlkLlxuICAgICAqIEBtZXRob2QgX2xvYWRTY2VuZUJ5VXVpZFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1dWlkIC0gdGhlIHV1aWQgb2YgdGhlIHNjZW5lIGFzc2V0IHRvIGxvYWRcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25MYXVuY2hlZF1cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25VbmxvYWRlZF1cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtkb250UnVuU2NlbmVdIC0gSnVzdCBkb3dubG9hZCBhbmQgaW5pdGlhbGl6ZSB0aGUgc2NlbmUgYnV0IHdpbGwgbm90IGxhdW5jaCBpdCxcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25seSB0YWtlIGVmZmVjdCBpbiB0aGUgRWRpdG9yLlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2xvYWRTY2VuZUJ5VXVpZDogZnVuY3Rpb24gKHV1aWQsIG9uTGF1bmNoZWQsIG9uVW5sb2FkZWQsIGRvbnRSdW5TY2VuZSkge1xuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9uTGF1bmNoZWQgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgICAgIGRvbnRSdW5TY2VuZSA9IG9uTGF1bmNoZWQ7XG4gICAgICAgICAgICAgICAgb25MYXVuY2hlZCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9uVW5sb2FkZWQgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgICAgIGRvbnRSdW5TY2VuZSA9IG9uVW5sb2FkZWQ7XG4gICAgICAgICAgICAgICAgb25VbmxvYWRlZCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy9jYy5Bc3NldExpYnJhcnkudW5sb2FkQXNzZXQodXVpZCk7ICAgICAvLyBmb3JjZSByZWxvYWRcbiAgICAgICAgY29uc29sZS50aW1lKCdMb2FkU2NlbmUgJyArIHV1aWQpO1xuICAgICAgICBjYy5Bc3NldExpYnJhcnkubG9hZEFzc2V0KHV1aWQsIGZ1bmN0aW9uIChlcnJvciwgc2NlbmVBc3NldCkge1xuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKCdMb2FkU2NlbmUgJyArIHV1aWQpO1xuICAgICAgICAgICAgdmFyIHNlbGYgPSBjYy5kaXJlY3RvcjtcbiAgICAgICAgICAgIHNlbGYuX2xvYWRpbmdTY2VuZSA9ICcnO1xuICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IgPSAnRmFpbGVkIHRvIGxvYWQgc2NlbmU6ICcgKyBlcnJvcjtcbiAgICAgICAgICAgICAgICBjYy5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoc2NlbmVBc3NldCBpbnN0YW5jZW9mIGNjLlNjZW5lQXNzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNjZW5lID0gc2NlbmVBc3NldC5zY2VuZTtcbiAgICAgICAgICAgICAgICAgICAgc2NlbmUuX2lkID0gc2NlbmVBc3NldC5fdXVpZDtcbiAgICAgICAgICAgICAgICAgICAgc2NlbmUuX25hbWUgPSBzY2VuZUFzc2V0Ll9uYW1lO1xuICAgICAgICAgICAgICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWRvbnRSdW5TY2VuZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucnVuU2NlbmVJbW1lZGlhdGUoc2NlbmUsIG9uVW5sb2FkZWQsIG9uTGF1bmNoZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NlbmUuX2xvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob25MYXVuY2hlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkxhdW5jaGVkKG51bGwsIHNjZW5lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnJ1blNjZW5lSW1tZWRpYXRlKHNjZW5lLCBvblVubG9hZGVkLCBvbkxhdW5jaGVkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlcnJvciA9ICdUaGUgYXNzZXQgJyArIHV1aWQgKyAnIGlzIG5vdCBhIHNjZW5lJztcbiAgICAgICAgICAgICAgICAgICAgY2MuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvbkxhdW5jaGVkKSB7XG4gICAgICAgICAgICAgICAgb25MYXVuY2hlZChlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJlc3VtZSBnYW1lIGxvZ2ljIGV4ZWN1dGlvbiBhZnRlciBwYXVzZSwgaWYgdGhlIGN1cnJlbnQgc2NlbmUgaXMgbm90IHBhdXNlZCwgbm90aGluZyB3aWxsIGhhcHBlbi5cbiAgICAgKiAhI3poIOaBouWkjeaaguWBnOWcuuaZr+eahOa4uOaIj+mAu+i+ke+8jOWmguaenOW9k+WJjeWcuuaZr+ayoeacieaaguWBnOWwhuayoeS7u+S9leS6i+aDheWPkeeUn+OAglxuICAgICAqIEBtZXRob2QgcmVzdW1lXG4gICAgICovXG4gICAgcmVzdW1lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fcGF1c2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sYXN0VXBkYXRlID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIGlmICghdGhpcy5fbGFzdFVwZGF0ZSkge1xuICAgICAgICAgICAgY2MubG9nSUQoMTIwMCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9wYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fZGVsdGFUaW1lID0gMDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEVuYWJsZXMgb3IgZGlzYWJsZXMgV2ViR0wgZGVwdGggdGVzdC48YnIvPlxuICAgICAqIEltcGxlbWVudGF0aW9uIGNhbiBiZSBmb3VuZCBpbiBDQ0RpcmVjdG9yQ2FudmFzLmpzL0NDRGlyZWN0b3JXZWJHTC5qc1xuICAgICAqICEjemgg5ZCv55SoL+emgeeUqOa3seW6pua1i+ivle+8iOWcqCBDYW52YXMg5riy5p+T5qih5byP5LiL5LiN5Lya55Sf5pWI77yJ44CCXG4gICAgICogQG1ldGhvZCBzZXREZXB0aFRlc3RcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9uXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMFxuICAgICAqL1xuICAgIHNldERlcHRoVGVzdDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGlmICghY2MuQ2FtZXJhLm1haW4pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjYy5DYW1lcmEubWFpbi5kZXB0aCA9ICEhdmFsdWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBTZXQgY29sb3IgZm9yIGNsZWFyIHNjcmVlbi48YnIvPlxuICAgICAqIChJbXBsZW1lbnRhdGlvbiBjYW4gYmUgZm91bmQgaW4gQ0NEaXJlY3RvckNhbnZhcy5qcy9DQ0RpcmVjdG9yV2ViR0wuanMpXG4gICAgICogISN6aFxuICAgICAqIOiuvue9ruWcuuaZr+eahOm7mOiupOaTpumZpOminOiJsuOAgjxici8+XG4gICAgICog5pSv5oyB5YWo6YCP5piO77yM5L2G5LiN5pSv5oyB6YCP5piO5bqm5Li65Lit6Ze05YC844CC6KaB5pSv5oyB5YWo6YCP5piO6ZyA5omL5bel5byA5ZCvIGNjLm1hY3JvLkVOQUJMRV9UUkFOU1BBUkVOVF9DQU5WQVPjgIJcbiAgICAgKiBAbWV0aG9kIHNldENsZWFyQ29sb3JcbiAgICAgKiBAcGFyYW0ge0NvbG9yfSBjbGVhckNvbG9yXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMFxuICAgICAqL1xuICAgIHNldENsZWFyQ29sb3I6IGZ1bmN0aW9uIChjbGVhckNvbG9yKSB7XG4gICAgICAgIGlmICghY2MuQ2FtZXJhLm1haW4pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjYy5DYW1lcmEubWFpbi5iYWNrZ3JvdW5kQ29sb3IgPSBjbGVhckNvbG9yO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgY3VycmVudCBsb2dpYyBTY2VuZS5cbiAgICAgKiAhI3poIOiOt+WPluW9k+WJjemAu+i+keWcuuaZr+OAglxuICAgICAqIEBtZXRob2QgZ2V0UnVubmluZ1NjZW5lXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcmV0dXJuIHtTY2VuZX1cbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wXG4gICAgICovXG4gICAgZ2V0UnVubmluZ1NjZW5lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zY2VuZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIGN1cnJlbnQgbG9naWMgU2NlbmUuXG4gICAgICogISN6aCDojrflj5blvZPliY3pgLvovpHlnLrmma/jgIJcbiAgICAgKiBAbWV0aG9kIGdldFNjZW5lXG4gICAgICogQHJldHVybiB7U2NlbmV9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAgLy8gVGhpcyB3aWxsIGhlbHAgeW91IHRvIGdldCB0aGUgQ2FudmFzIG5vZGUgaW4gc2NlbmVcbiAgICAgKiAgY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5nZXRDaGlsZEJ5TmFtZSgnQ2FudmFzJyk7XG4gICAgICovXG4gICAgZ2V0U2NlbmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NjZW5lO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgdGhlIEZQUyB2YWx1ZS4gUGxlYXNlIHVzZSB7eyNjcm9zc0xpbmsgXCJHYW1lLnNldEZyYW1lUmF0ZVwifX1jYy5nYW1lLnNldEZyYW1lUmF0ZXt7L2Nyb3NzTGlua319IHRvIGNvbnRyb2wgYW5pbWF0aW9uIGludGVydmFsLlxuICAgICAqICEjemgg6I635Y+W5Y2V5L2N5bin5omn6KGM5pe26Ze044CC6K+35L2/55SoIHt7I2Nyb3NzTGluayBcIkdhbWUuc2V0RnJhbWVSYXRlXCJ9fWNjLmdhbWUuc2V0RnJhbWVSYXRle3svY3Jvc3NMaW5rfX0g5p2l5o6n5Yi25ri45oiP5bin546H44CCXG4gICAgICogQG1ldGhvZCBnZXRBbmltYXRpb25JbnRlcnZhbFxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjBcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0QW5pbWF0aW9uSW50ZXJ2YWw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIDEwMDAgLyBnYW1lLmdldEZyYW1lUmF0ZSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXRzIGFuaW1hdGlvbiBpbnRlcnZhbCwgdGhpcyBkb2Vzbid0IGNvbnRyb2wgdGhlIG1haW4gbG9vcC5cbiAgICAgKiBUbyBjb250cm9sIHRoZSBnYW1lJ3MgZnJhbWUgcmF0ZSBvdmVyYWxsLCBwbGVhc2UgdXNlIHt7I2Nyb3NzTGluayBcIkdhbWUuc2V0RnJhbWVSYXRlXCJ9fWNjLmdhbWUuc2V0RnJhbWVSYXRle3svY3Jvc3NMaW5rfX1cbiAgICAgKiBAbWV0aG9kIHNldEFuaW1hdGlvbkludGVydmFsXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSAtIFRoZSBhbmltYXRpb24gaW50ZXJ2YWwgZGVzaXJlZC5cbiAgICAgKi9cbiAgICBzZXRBbmltYXRpb25JbnRlcnZhbDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGdhbWUuc2V0RnJhbWVSYXRlKE1hdGgucm91bmQoMTAwMCAvIHZhbHVlKSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB0aGUgZGVsdGEgdGltZSBzaW5jZSBsYXN0IGZyYW1lLlxuICAgICAqICEjemgg6I635Y+W5LiK5LiA5bin55qE5aKe6YeP5pe26Ze044CCXG4gICAgICogQG1ldGhvZCBnZXREZWx0YVRpbWVcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0RGVsdGFUaW1lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWx0YVRpbWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB0aGUgdG90YWwgcGFzc2VkIHRpbWUgc2luY2UgZ2FtZSBzdGFydCwgdW5pdDogbXNcbiAgICAgKiAhI3poIOiOt+WPluS7jua4uOaIj+W8gOWni+WIsOeOsOWcqOaAu+WFsee7j+i/h+eahOaXtumXtO+8jOWNleS9jeS4uiBtc1xuICAgICAqIEBtZXRob2QgZ2V0VG90YWxUaW1lXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldFRvdGFsVGltZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcGVyZm9ybWFuY2Uubm93KCkgLSB0aGlzLl9zdGFydFRpbWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyBob3cgbWFueSBmcmFtZXMgd2VyZSBjYWxsZWQgc2luY2UgdGhlIGRpcmVjdG9yIHN0YXJ0ZWQuXG4gICAgICogISN6aCDojrflj5YgZGlyZWN0b3Ig5ZCv5Yqo5Lul5p2l5ri45oiP6L+Q6KGM55qE5oC75bin5pWw44CCXG4gICAgICogQG1ldGhvZCBnZXRUb3RhbEZyYW1lc1xuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKi9cbiAgICBnZXRUb3RhbEZyYW1lczogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdG90YWxGcmFtZXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgRGlyZWN0b3IgaXMgcGF1c2VkLlxuICAgICAqICEjemgg5piv5ZCm5aSE5LqO5pqC5YGc54q25oCB44CCXG4gICAgICogQG1ldGhvZCBpc1BhdXNlZFxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgaXNQYXVzZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhdXNlZDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHRoZSBjYy5TY2hlZHVsZXIgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZGlyZWN0b3IuXG4gICAgICogISN6aCDojrflj5blkowgZGlyZWN0b3Ig55u45YWz6IGU55qEIGNjLlNjaGVkdWxlcuOAglxuICAgICAqIEBtZXRob2QgZ2V0U2NoZWR1bGVyXG4gICAgICogQHJldHVybiB7U2NoZWR1bGVyfVxuICAgICAqL1xuICAgIGdldFNjaGVkdWxlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2NoZWR1bGVyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgdGhlIGNjLlNjaGVkdWxlciBhc3NvY2lhdGVkIHdpdGggdGhpcyBkaXJlY3Rvci5cbiAgICAgKiAhI3poIOiuvue9ruWSjCBkaXJlY3RvciDnm7jlhbPogZTnmoQgY2MuU2NoZWR1bGVy44CCXG4gICAgICogQG1ldGhvZCBzZXRTY2hlZHVsZXJcbiAgICAgKiBAcGFyYW0ge1NjaGVkdWxlcn0gc2NoZWR1bGVyXG4gICAgICovXG4gICAgc2V0U2NoZWR1bGVyOiBmdW5jdGlvbiAoc2NoZWR1bGVyKSB7XG4gICAgICAgIGlmICh0aGlzLl9zY2hlZHVsZXIgIT09IHNjaGVkdWxlcikge1xuICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVyID0gc2NoZWR1bGVyO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB0aGUgY2MuQWN0aW9uTWFuYWdlciBhc3NvY2lhdGVkIHdpdGggdGhpcyBkaXJlY3Rvci5cbiAgICAgKiAhI3poIOiOt+WPluWSjCBkaXJlY3RvciDnm7jlhbPogZTnmoQgY2MuQWN0aW9uTWFuYWdlcu+8iOWKqOS9nOeuoeeQhuWZqO+8ieOAglxuICAgICAqIEBtZXRob2QgZ2V0QWN0aW9uTWFuYWdlclxuICAgICAqIEByZXR1cm4ge0FjdGlvbk1hbmFnZXJ9XG4gICAgICovXG4gICAgZ2V0QWN0aW9uTWFuYWdlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWN0aW9uTWFuYWdlcjtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0cyB0aGUgY2MuQWN0aW9uTWFuYWdlciBhc3NvY2lhdGVkIHdpdGggdGhpcyBkaXJlY3Rvci5cbiAgICAgKiAhI3poIOiuvue9ruWSjCBkaXJlY3RvciDnm7jlhbPogZTnmoQgY2MuQWN0aW9uTWFuYWdlcu+8iOWKqOS9nOeuoeeQhuWZqO+8ieOAglxuICAgICAqIEBtZXRob2Qgc2V0QWN0aW9uTWFuYWdlclxuICAgICAqIEBwYXJhbSB7QWN0aW9uTWFuYWdlcn0gYWN0aW9uTWFuYWdlclxuICAgICAqL1xuICAgIHNldEFjdGlvbk1hbmFnZXI6IGZ1bmN0aW9uIChhY3Rpb25NYW5hZ2VyKSB7XG4gICAgICAgIGlmICh0aGlzLl9hY3Rpb25NYW5hZ2VyICE9PSBhY3Rpb25NYW5hZ2VyKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fYWN0aW9uTWFuYWdlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NjaGVkdWxlci51bnNjaGVkdWxlVXBkYXRlKHRoaXMuX2FjdGlvbk1hbmFnZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fYWN0aW9uTWFuYWdlciA9IGFjdGlvbk1hbmFnZXI7XG4gICAgICAgICAgICB0aGlzLl9zY2hlZHVsZXIuc2NoZWR1bGVVcGRhdGUodGhpcy5fYWN0aW9uTWFuYWdlciwgY2MuU2NoZWR1bGVyLlBSSU9SSVRZX1NZU1RFTSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qIFxuICAgICAqICEjZW4gUmV0dXJucyB0aGUgY2MuQW5pbWF0aW9uTWFuYWdlciBhc3NvY2lhdGVkIHdpdGggdGhpcyBkaXJlY3Rvci5cbiAgICAgKiAhI3poIOiOt+WPluWSjCBkaXJlY3RvciDnm7jlhbPogZTnmoQgY2MuQW5pbWF0aW9uTWFuYWdlcu+8iOWKqOeUu+euoeeQhuWZqO+8ieOAglxuICAgICAqIEBtZXRob2QgZ2V0QW5pbWF0aW9uTWFuYWdlclxuICAgICAqIEByZXR1cm4ge0FuaW1hdGlvbk1hbmFnZXJ9XG4gICAgICovXG4gICAgZ2V0QW5pbWF0aW9uTWFuYWdlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYW5pbWF0aW9uTWFuYWdlcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHRoZSBjYy5Db2xsaXNpb25NYW5hZ2VyIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGRpcmVjdG9yLlxuICAgICAqICEjemgg6I635Y+W5ZKMIGRpcmVjdG9yIOebuOWFs+iBlOeahCBjYy5Db2xsaXNpb25NYW5hZ2VyIO+8iOeisOaSnueuoeeQhuWZqO+8ieOAglxuICAgICAqIEBtZXRob2QgZ2V0Q29sbGlzaW9uTWFuYWdlclxuICAgICAqIEByZXR1cm4ge0NvbGxpc2lvbk1hbmFnZXJ9XG4gICAgICovXG4gICAgZ2V0Q29sbGlzaW9uTWFuYWdlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29sbGlzaW9uTWFuYWdlcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHRoZSBjYy5QaHlzaWNzTWFuYWdlciBhc3NvY2lhdGVkIHdpdGggdGhpcyBkaXJlY3Rvci5cbiAgICAgKiAhI3poIOi/lOWbnuS4jiBkaXJlY3RvciDnm7jlhbPogZTnmoQgY2MuUGh5c2ljc01hbmFnZXIg77yI54mp55CG566h55CG5Zmo77yJ44CCXG4gICAgICogQG1ldGhvZCBnZXRQaHlzaWNzTWFuYWdlclxuICAgICAqIEByZXR1cm4ge1BoeXNpY3NNYW5hZ2VyfVxuICAgICAqL1xuICAgIGdldFBoeXNpY3NNYW5hZ2VyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9waHlzaWNzTWFuYWdlcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHRoZSBjYy5QaHlzaWNzM0RNYW5hZ2VyIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGRpcmVjdG9yLlxuICAgICAqICEjemgg6L+U5Zue5LiOIGRpcmVjdG9yIOebuOWFs+iBlOeahCBjYy5QaHlzaWNzM0RNYW5hZ2VyIO+8iOeJqeeQhueuoeeQhuWZqO+8ieOAglxuICAgICAqIEBtZXRob2QgZ2V0UGh5c2ljczNETWFuYWdlclxuICAgICAqIEByZXR1cm4ge1BoeXNpY3MzRE1hbmFnZXJ9XG4gICAgICovXG4gICAgZ2V0UGh5c2ljczNETWFuYWdlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGh5c2ljczNETWFuYWdlcjtcbiAgICB9LFxuXG4gICAgLy8gTG9vcCBtYW5hZ2VtZW50XG4gICAgLypcbiAgICAgKiBTdGFydHMgQW5pbWF0aW9uXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMS4yXG4gICAgICovXG4gICAgc3RhcnRBbmltYXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MuZ2FtZS5yZXN1bWUoKTtcbiAgICB9LFxuXG4gICAgLypcbiAgICAgKiBTdG9wcyBhbmltYXRpb25cbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4xLjJcbiAgICAgKi9cbiAgICBzdG9wQW5pbWF0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmdhbWUucGF1c2UoKTtcbiAgICB9LFxuXG4gICAgX3Jlc2V0RGVsdGFUaW1lICgpIHtcbiAgICAgICAgdGhpcy5fbGFzdFVwZGF0ZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICB0aGlzLl9kZWx0YVRpbWUgPSAwO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIFJ1biBtYWluIGxvb3Agb2YgZGlyZWN0b3JcbiAgICAgKi9cbiAgICBtYWluTG9vcDogQ0NfRURJVE9SID8gZnVuY3Rpb24gKGRlbHRhVGltZSwgdXBkYXRlQW5pbWF0ZSkge1xuICAgICAgICB0aGlzLl9kZWx0YVRpbWUgPSBkZWx0YVRpbWU7XG5cbiAgICAgICAgLy8gVXBkYXRlXG4gICAgICAgIGlmICghdGhpcy5fcGF1c2VkKSB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoY2MuRGlyZWN0b3IuRVZFTlRfQkVGT1JFX1VQREFURSk7XG5cbiAgICAgICAgICAgIHRoaXMuX2NvbXBTY2hlZHVsZXIuc3RhcnRQaGFzZSgpO1xuICAgICAgICAgICAgdGhpcy5fY29tcFNjaGVkdWxlci51cGRhdGVQaGFzZShkZWx0YVRpbWUpO1xuXG4gICAgICAgICAgICBpZiAodXBkYXRlQW5pbWF0ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NjaGVkdWxlci51cGRhdGUoZGVsdGFUaW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fY29tcFNjaGVkdWxlci5sYXRlVXBkYXRlUGhhc2UoZGVsdGFUaW1lKTtcblxuICAgICAgICAgICAgdGhpcy5lbWl0KGNjLkRpcmVjdG9yLkVWRU5UX0FGVEVSX1VQREFURSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZW5kZXJcbiAgICAgICAgdGhpcy5lbWl0KGNjLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9EUkFXKTtcbiAgICAgICAgcmVuZGVyZXIucmVuZGVyKHRoaXMuX3NjZW5lLCBkZWx0YVRpbWUpO1xuICAgICAgICBcbiAgICAgICAgLy8gQWZ0ZXIgZHJhd1xuICAgICAgICB0aGlzLmVtaXQoY2MuRGlyZWN0b3IuRVZFTlRfQUZURVJfRFJBVyk7XG5cbiAgICAgICAgdGhpcy5fdG90YWxGcmFtZXMrKztcblxuICAgIH0gOiBmdW5jdGlvbiAobm93KSB7XG4gICAgICAgIGlmICh0aGlzLl9wdXJnZURpcmVjdG9ySW5OZXh0TG9vcCkge1xuICAgICAgICAgICAgdGhpcy5fcHVyZ2VEaXJlY3RvckluTmV4dExvb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMucHVyZ2VEaXJlY3RvcigpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gY2FsY3VsYXRlIFwiZ2xvYmFsXCIgZHRcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlRGVsdGFUaW1lKG5vdyk7XG5cbiAgICAgICAgICAgIC8vIFVwZGF0ZVxuICAgICAgICAgICAgaWYgKCF0aGlzLl9wYXVzZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBiZWZvcmUgdXBkYXRlXG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KGNjLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9VUERBVEUpO1xuXG4gICAgICAgICAgICAgICAgLy8gQ2FsbCBzdGFydCBmb3IgbmV3IGFkZGVkIGNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICB0aGlzLl9jb21wU2NoZWR1bGVyLnN0YXJ0UGhhc2UoKTtcblxuICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSBmb3IgY29tcG9uZW50c1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbXBTY2hlZHVsZXIudXBkYXRlUGhhc2UodGhpcy5fZGVsdGFUaW1lKTtcbiAgICAgICAgICAgICAgICAvLyBFbmdpbmUgdXBkYXRlIHdpdGggc2NoZWR1bGVyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVyLnVwZGF0ZSh0aGlzLl9kZWx0YVRpbWUpO1xuXG4gICAgICAgICAgICAgICAgLy8gTGF0ZSB1cGRhdGUgZm9yIGNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICB0aGlzLl9jb21wU2NoZWR1bGVyLmxhdGVVcGRhdGVQaGFzZSh0aGlzLl9kZWx0YVRpbWUpO1xuXG4gICAgICAgICAgICAgICAgLy8gQWZ0ZXIgbGlmZS1jeWNsZSBleGVjdXRlZFxuICAgICAgICAgICAgICAgIHRoaXMuX2NvbXBTY2hlZHVsZXIuY2xlYXJ1cCgpO1xuXG4gICAgICAgICAgICAgICAgLy8gVXNlciBjYW4gdXNlIHRoaXMgZXZlbnQgdG8gZG8gdGhpbmdzIGFmdGVyIHVwZGF0ZVxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChjYy5EaXJlY3Rvci5FVkVOVF9BRlRFUl9VUERBVEUpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIERlc3Ryb3kgZW50aXRpZXMgdGhhdCBoYXZlIGJlZW4gcmVtb3ZlZCByZWNlbnRseVxuICAgICAgICAgICAgICAgIE9iai5fZGVmZXJyZWREZXN0cm95KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFJlbmRlclxuICAgICAgICAgICAgdGhpcy5lbWl0KGNjLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9EUkFXKTtcbiAgICAgICAgICAgIHJlbmRlcmVyLnJlbmRlcih0aGlzLl9zY2VuZSwgdGhpcy5fZGVsdGFUaW1lKTtcblxuICAgICAgICAgICAgLy8gQWZ0ZXIgZHJhd1xuICAgICAgICAgICAgdGhpcy5lbWl0KGNjLkRpcmVjdG9yLkVWRU5UX0FGVEVSX0RSQVcpO1xuXG4gICAgICAgICAgICBldmVudE1hbmFnZXIuZnJhbWVVcGRhdGVMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIHRoaXMuX3RvdGFsRnJhbWVzKys7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX19mYXN0T246IGZ1bmN0aW9uICh0eXBlLCBjYWxsYmFjaywgdGFyZ2V0KSB7XG4gICAgICAgIHRoaXMub24odHlwZSwgY2FsbGJhY2ssIHRhcmdldCk7XG4gICAgfSxcblxuICAgIF9fZmFzdE9mZjogZnVuY3Rpb24gKHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQpIHtcbiAgICAgICAgdGhpcy5vZmYodHlwZSwgY2FsbGJhY2ssIHRhcmdldCk7XG4gICAgfSxcbn07XG5cbi8vIEV2ZW50IHRhcmdldFxuY2MuanMuYWRkb24oY2MuRGlyZWN0b3IucHJvdG90eXBlLCBFdmVudFRhcmdldC5wcm90b3R5cGUpO1xuXG4vKipcbiAqICEjZW4gVGhlIGV2ZW50IHByb2plY3Rpb24gY2hhbmdlZCBvZiBjYy5EaXJlY3Rvci4gVGhpcyBldmVudCB3aWxsIG5vdCBnZXQgdHJpZ2dlcmVkIHNpbmNlIHYyLjBcbiAqICEjemggY2MuRGlyZWN0b3Ig5oqV5b2x5Y+Y5YyW55qE5LqL5Lu244CC5LuOIHYyLjAg5byA5aeL6L+Z5Liq5LqL5Lu25LiN5Lya5YaN6KKr6Kem5Y+RXG4gKiBAcHJvcGVydHkge1N0cmluZ30gRVZFTlRfUFJPSkVDVElPTl9DSEFOR0VEXG4gKiBAcmVhZG9ubHlcbiAqIEBzdGF0aWNcbiAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjBcbiAqL1xuY2MuRGlyZWN0b3IuRVZFTlRfUFJPSkVDVElPTl9DSEFOR0VEID0gXCJkaXJlY3Rvcl9wcm9qZWN0aW9uX2NoYW5nZWRcIjtcblxuLyoqXG4gKiAhI2VuIFRoZSBldmVudCB3aGljaCB3aWxsIGJlIHRyaWdnZXJlZCBiZWZvcmUgbG9hZGluZyBhIG5ldyBzY2VuZS5cbiAqICEjemgg5Yqg6L295paw5Zy65pmv5LmL5YmN5omA6Kem5Y+R55qE5LqL5Lu244CCXG4gKiBAZXZlbnQgY2MuRGlyZWN0b3IuRVZFTlRfQkVGT1JFX1NDRU5FX0xPQURJTkdcbiAqIEBwYXJhbSB7U3RyaW5nfSBzY2VuZU5hbWUgLSBUaGUgbG9hZGluZyBzY2VuZSBuYW1lXG4gKi9cbi8qKlxuICogISNlbiBUaGUgZXZlbnQgd2hpY2ggd2lsbCBiZSB0cmlnZ2VyZWQgYmVmb3JlIGxvYWRpbmcgYSBuZXcgc2NlbmUuXG4gKiAhI3poIOWKoOi9veaWsOWcuuaZr+S5i+WJjeaJgOinpuWPkeeahOS6i+S7tuOAglxuICogQHByb3BlcnR5IHtTdHJpbmd9IEVWRU5UX0JFRk9SRV9TQ0VORV9MT0FESU5HXG4gKiBAcmVhZG9ubHlcbiAqIEBzdGF0aWNcbiAqL1xuY2MuRGlyZWN0b3IuRVZFTlRfQkVGT1JFX1NDRU5FX0xPQURJTkcgPSBcImRpcmVjdG9yX2JlZm9yZV9zY2VuZV9sb2FkaW5nXCI7XG5cbi8qXG4gKiAhI2VuIFRoZSBldmVudCB3aGljaCB3aWxsIGJlIHRyaWdnZXJlZCBiZWZvcmUgbGF1bmNoaW5nIGEgbmV3IHNjZW5lLlxuICogISN6aCDov5DooYzmlrDlnLrmma/kuYvliY3miYDop6blj5HnmoTkuovku7bjgIJcbiAqIEBldmVudCBjYy5EaXJlY3Rvci5FVkVOVF9CRUZPUkVfU0NFTkVfTEFVTkNIXG4gKiBAcGFyYW0ge1N0cmluZ30gc2NlbmVOYW1lIC0gTmV3IHNjZW5lIHdoaWNoIHdpbGwgYmUgbGF1bmNoZWRcbiAqL1xuLyoqXG4gKiAhI2VuIFRoZSBldmVudCB3aGljaCB3aWxsIGJlIHRyaWdnZXJlZCBiZWZvcmUgbGF1bmNoaW5nIGEgbmV3IHNjZW5lLlxuICogISN6aCDov5DooYzmlrDlnLrmma/kuYvliY3miYDop6blj5HnmoTkuovku7bjgIJcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBFVkVOVF9CRUZPUkVfU0NFTkVfTEFVTkNIXG4gKiBAcmVhZG9ubHlcbiAqIEBzdGF0aWNcbiAqL1xuY2MuRGlyZWN0b3IuRVZFTlRfQkVGT1JFX1NDRU5FX0xBVU5DSCA9IFwiZGlyZWN0b3JfYmVmb3JlX3NjZW5lX2xhdW5jaFwiO1xuXG4vKipcbiAqICEjZW4gVGhlIGV2ZW50IHdoaWNoIHdpbGwgYmUgdHJpZ2dlcmVkIGFmdGVyIGxhdW5jaGluZyBhIG5ldyBzY2VuZS5cbiAqICEjemgg6L+Q6KGM5paw5Zy65pmv5LmL5ZCO5omA6Kem5Y+R55qE5LqL5Lu244CCXG4gKiBAZXZlbnQgY2MuRGlyZWN0b3IuRVZFTlRfQUZURVJfU0NFTkVfTEFVTkNIXG4gKiBAcGFyYW0ge1N0cmluZ30gc2NlbmVOYW1lIC0gTmV3IHNjZW5lIHdoaWNoIGlzIGxhdW5jaGVkXG4gKi9cbi8qKlxuICogISNlbiBUaGUgZXZlbnQgd2hpY2ggd2lsbCBiZSB0cmlnZ2VyZWQgYWZ0ZXIgbGF1bmNoaW5nIGEgbmV3IHNjZW5lLlxuICogISN6aCDov5DooYzmlrDlnLrmma/kuYvlkI7miYDop6blj5HnmoTkuovku7bjgIJcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBFVkVOVF9BRlRFUl9TQ0VORV9MQVVOQ0hcbiAqIEByZWFkb25seVxuICogQHN0YXRpY1xuICovXG5jYy5EaXJlY3Rvci5FVkVOVF9BRlRFUl9TQ0VORV9MQVVOQ0ggPSBcImRpcmVjdG9yX2FmdGVyX3NjZW5lX2xhdW5jaFwiO1xuXG4vKipcbiAqICEjZW4gVGhlIGV2ZW50IHdoaWNoIHdpbGwgYmUgdHJpZ2dlcmVkIGF0IHRoZSBiZWdpbm5pbmcgb2YgZXZlcnkgZnJhbWUuXG4gKiAhI3poIOavj+S4quW4p+eahOW8gOWni+aXtuaJgOinpuWPkeeahOS6i+S7tuOAglxuICogQGV2ZW50IGNjLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9VUERBVEVcbiAqL1xuLyoqXG4gKiAhI2VuIFRoZSBldmVudCB3aGljaCB3aWxsIGJlIHRyaWdnZXJlZCBhdCB0aGUgYmVnaW5uaW5nIG9mIGV2ZXJ5IGZyYW1lLlxuICogISN6aCDmr4/kuKrluKfnmoTlvIDlp4vml7bmiYDop6blj5HnmoTkuovku7bjgIJcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBFVkVOVF9CRUZPUkVfVVBEQVRFXG4gKiBAcmVhZG9ubHlcbiAqIEBzdGF0aWNcbiAqL1xuY2MuRGlyZWN0b3IuRVZFTlRfQkVGT1JFX1VQREFURSA9IFwiZGlyZWN0b3JfYmVmb3JlX3VwZGF0ZVwiO1xuXG4vKipcbiAqICEjZW4gVGhlIGV2ZW50IHdoaWNoIHdpbGwgYmUgdHJpZ2dlcmVkIGFmdGVyIGVuZ2luZSBhbmQgY29tcG9uZW50cyB1cGRhdGUgbG9naWMuXG4gKiAhI3poIOWwhuWcqOW8leaTjuWSjOe7hOS7tiDigJx1cGRhdGXigJ0g6YC76L6R5LmL5ZCO5omA6Kem5Y+R55qE5LqL5Lu244CCXG4gKiBAZXZlbnQgY2MuRGlyZWN0b3IuRVZFTlRfQUZURVJfVVBEQVRFXG4gKi9cbi8qKlxuICogISNlbiBUaGUgZXZlbnQgd2hpY2ggd2lsbCBiZSB0cmlnZ2VyZWQgYWZ0ZXIgZW5naW5lIGFuZCBjb21wb25lbnRzIHVwZGF0ZSBsb2dpYy5cbiAqICEjemgg5bCG5Zyo5byV5pOO5ZKM57uE5Lu2IOKAnHVwZGF0ZeKAnSDpgLvovpHkuYvlkI7miYDop6blj5HnmoTkuovku7bjgIJcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBFVkVOVF9BRlRFUl9VUERBVEVcbiAqIEByZWFkb25seVxuICogQHN0YXRpY1xuICovXG5jYy5EaXJlY3Rvci5FVkVOVF9BRlRFUl9VUERBVEUgPSBcImRpcmVjdG9yX2FmdGVyX3VwZGF0ZVwiO1xuXG4vKipcbiAqICEjZW4gVGhlIGV2ZW50IGlzIGRlcHJlY2F0ZWQgc2luY2UgdjIuMCwgcGxlYXNlIHVzZSBjYy5EaXJlY3Rvci5FVkVOVF9CRUZPUkVfRFJBVyBpbnN0ZWFkXG4gKiAhI3poIOi/meS4quS6i+S7tuS7jiB2Mi4wIOW8gOWni+iiq+W6n+W8g++8jOivt+ebtOaOpeS9v+eUqCBjYy5EaXJlY3Rvci5FVkVOVF9CRUZPUkVfRFJBV1xuICogQHByb3BlcnR5IHtTdHJpbmd9IEVWRU5UX0JFRk9SRV9WSVNJVFxuICogQHJlYWRvbmx5XG4gKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wXG4gKiBAc3RhdGljXG4gKi9cbmNjLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9WSVNJVCA9IFwiZGlyZWN0b3JfYmVmb3JlX2RyYXdcIjtcblxuLyoqXG4gKiAhI2VuIFRoZSBldmVudCBpcyBkZXByZWNhdGVkIHNpbmNlIHYyLjAsIHBsZWFzZSB1c2UgY2MuRGlyZWN0b3IuRVZFTlRfQkVGT1JFX0RSQVcgaW5zdGVhZFxuICogISN6aCDov5nkuKrkuovku7bku44gdjIuMCDlvIDlp4vooqvlup/lvIPvvIzor7fnm7TmjqXkvb/nlKggY2MuRGlyZWN0b3IuRVZFTlRfQkVGT1JFX0RSQVdcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBFVkVOVF9BRlRFUl9WSVNJVFxuICogQHJlYWRvbmx5XG4gKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wXG4gKiBAc3RhdGljXG4gKi9cbmNjLkRpcmVjdG9yLkVWRU5UX0FGVEVSX1ZJU0lUID0gXCJkaXJlY3Rvcl9iZWZvcmVfZHJhd1wiO1xuXG4vKipcbiAqICEjZW4gVGhlIGV2ZW50IHdoaWNoIHdpbGwgYmUgdHJpZ2dlcmVkIGJlZm9yZSB0aGUgcmVuZGVyaW5nIHByb2Nlc3MuXG4gKiAhI3poIOa4suafk+i/h+eoi+S5i+WJjeaJgOinpuWPkeeahOS6i+S7tuOAglxuICogQGV2ZW50IGNjLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9EUkFXXG4gKi9cbi8qKlxuICogISNlbiBUaGUgZXZlbnQgd2hpY2ggd2lsbCBiZSB0cmlnZ2VyZWQgYmVmb3JlIHRoZSByZW5kZXJpbmcgcHJvY2Vzcy5cbiAqICEjemgg5riy5p+T6L+H56iL5LmL5YmN5omA6Kem5Y+R55qE5LqL5Lu244CCXG4gKiBAcHJvcGVydHkge1N0cmluZ30gRVZFTlRfQkVGT1JFX0RSQVdcbiAqIEByZWFkb25seVxuICogQHN0YXRpY1xuICovXG5jYy5EaXJlY3Rvci5FVkVOVF9CRUZPUkVfRFJBVyA9IFwiZGlyZWN0b3JfYmVmb3JlX2RyYXdcIjtcblxuLyoqXG4gKiAhI2VuIFRoZSBldmVudCB3aGljaCB3aWxsIGJlIHRyaWdnZXJlZCBhZnRlciB0aGUgcmVuZGVyaW5nIHByb2Nlc3MuXG4gKiAhI3poIOa4suafk+i/h+eoi+S5i+WQjuaJgOinpuWPkeeahOS6i+S7tuOAglxuICogQGV2ZW50IGNjLkRpcmVjdG9yLkVWRU5UX0FGVEVSX0RSQVdcbiAqL1xuLyoqXG4gKiAhI2VuIFRoZSBldmVudCB3aGljaCB3aWxsIGJlIHRyaWdnZXJlZCBhZnRlciB0aGUgcmVuZGVyaW5nIHByb2Nlc3MuXG4gKiAhI3poIOa4suafk+i/h+eoi+S5i+WQjuaJgOinpuWPkeeahOS6i+S7tuOAglxuICogQHByb3BlcnR5IHtTdHJpbmd9IEVWRU5UX0FGVEVSX0RSQVdcbiAqIEByZWFkb25seVxuICogQHN0YXRpY1xuICovXG5jYy5EaXJlY3Rvci5FVkVOVF9BRlRFUl9EUkFXID0gXCJkaXJlY3Rvcl9hZnRlcl9kcmF3XCI7XG5cbi8vUG9zc2libGUgT3BlbkdMIHByb2plY3Rpb25zIHVzZWQgYnkgZGlyZWN0b3JcblxuLyoqXG4gKiBDb25zdGFudCBmb3IgMkQgcHJvamVjdGlvbiAob3J0aG9nb25hbCBwcm9qZWN0aW9uKVxuICogQHByb3BlcnR5IHtOdW1iZXJ9IFBST0pFQ1RJT05fMkRcbiAqIEBkZWZhdWx0IDBcbiAqIEByZWFkb25seVxuICogQHN0YXRpY1xuICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMFxuICovXG5jYy5EaXJlY3Rvci5QUk9KRUNUSU9OXzJEID0gMDtcblxuLyoqXG4gKiBDb25zdGFudCBmb3IgM0QgcHJvamVjdGlvbiB3aXRoIGEgZm92eT02MCwgem5lYXI9MC41ZiBhbmQgemZhcj0xNTAwLlxuICogQHByb3BlcnR5IHtOdW1iZXJ9IFBST0pFQ1RJT05fM0RcbiAqIEBkZWZhdWx0IDFcbiAqIEByZWFkb25seVxuICogQHN0YXRpY1xuICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMFxuICovXG5jYy5EaXJlY3Rvci5QUk9KRUNUSU9OXzNEID0gMTtcblxuLyoqXG4gKiBDb25zdGFudCBmb3IgY3VzdG9tIHByb2plY3Rpb24sIGlmIGNjLkRpcmVjdG9yJ3MgcHJvamVjdGlvbiBzZXQgdG8gaXQsIGl0IGNhbGxzIFwidXBkYXRlUHJvamVjdGlvblwiIG9uIHRoZSBwcm9qZWN0aW9uIGRlbGVnYXRlLlxuICogQHByb3BlcnR5IHtOdW1iZXJ9IFBST0pFQ1RJT05fQ1VTVE9NXG4gKiBAZGVmYXVsdCAzXG4gKiBAcmVhZG9ubHlcbiAqIEBzdGF0aWNcbiAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjBcbiAqL1xuY2MuRGlyZWN0b3IuUFJPSkVDVElPTl9DVVNUT00gPSAzO1xuXG4vKipcbiAqIENvbnN0YW50IGZvciBkZWZhdWx0IHByb2plY3Rpb24gb2YgY2MuRGlyZWN0b3IsIGRlZmF1bHQgcHJvamVjdGlvbiBpcyAyRCBwcm9qZWN0aW9uXG4gKiBAcHJvcGVydHkge051bWJlcn0gUFJPSkVDVElPTl9ERUZBVUxUXG4gKiBAZGVmYXVsdCBjYy5EaXJlY3Rvci5QUk9KRUNUSU9OXzJEXG4gKiBAcmVhZG9ubHlcbiAqIEBzdGF0aWNcbiAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjBcbiAqL1xuY2MuRGlyZWN0b3IuUFJPSkVDVElPTl9ERUZBVUxUID0gY2MuRGlyZWN0b3IuUFJPSkVDVElPTl8yRDtcblxuLyoqXG4gKiBUaGUgZXZlbnQgd2hpY2ggd2lsbCBiZSB0cmlnZ2VyZWQgYmVmb3JlIHRoZSBwaHlzaWNzIHByb2Nlc3MuPGJyLz5cbiAqIOeJqeeQhui/h+eoi+S5i+WJjeaJgOinpuWPkeeahOS6i+S7tuOAglxuICogQGV2ZW50IERpcmVjdG9yLkVWRU5UX0JFRk9SRV9QSFlTSUNTXG4gKiBAcmVhZG9ubHlcbiAqL1xuY2MuRGlyZWN0b3IuRVZFTlRfQkVGT1JFX1BIWVNJQ1MgPSAnZGlyZWN0b3JfYmVmb3JlX3BoeXNpY3MnO1xuXG4vKipcbiAqIFRoZSBldmVudCB3aGljaCB3aWxsIGJlIHRyaWdnZXJlZCBhZnRlciB0aGUgcGh5c2ljcyBwcm9jZXNzLjxici8+XG4gKiDniannkIbov4fnqIvkuYvlkI7miYDop6blj5HnmoTkuovku7bjgIJcbiAqIEBldmVudCBEaXJlY3Rvci5FVkVOVF9BRlRFUl9QSFlTSUNTXG4gKiBAcmVhZG9ubHlcbiAqL1xuY2MuRGlyZWN0b3IuRVZFTlRfQUZURVJfUEhZU0lDUyA9ICdkaXJlY3Rvcl9hZnRlcl9waHlzaWNzJztcblxuLyoqXG4gKiBAbW9kdWxlIGNjXG4gKi9cblxuLyoqXG4gKiAhI2VuIERpcmVjdG9yXG4gKiAhI3poIOWvvOa8lOexu+OAglxuICogQHByb3BlcnR5IGRpcmVjdG9yXG4gKiBAdHlwZSB7RGlyZWN0b3J9XG4gKi9cbmNjLmRpcmVjdG9yID0gbmV3IGNjLkRpcmVjdG9yKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gY2MuZGlyZWN0b3I7Il19