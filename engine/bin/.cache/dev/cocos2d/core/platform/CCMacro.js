
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/CCMacro.js';
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
 * Predefined constants
 * @class macro
 * @static
 */
cc.macro = {
  /**
   * PI / 180
   * @property RAD
   * @type {Number}
   */
  RAD: Math.PI / 180,

  /**
   * One degree
   * @property DEG
   * @type {Number}
   */
  DEG: 180 / Math.PI,

  /**
   * @property REPEAT_FOREVER
   * @type {Number}
   */
  REPEAT_FOREVER: Number.MAX_VALUE - 1,

  /**
   * @property FLT_EPSILON
   * @type {Number}
   */
  FLT_EPSILON: 0.0000001192092896,

  /**
   * Minimum z index value for node
   * @property MIN_ZINDEX
   * @type {Number}
   */
  MIN_ZINDEX: -Math.pow(2, 15),

  /**
   * Maximum z index value for node
   * @property MAX_ZINDEX
   * @type {Number}
   */
  MAX_ZINDEX: Math.pow(2, 15) - 1,
  //some gl constant variable

  /**
   * @property ONE
   * @type {Number}
   */
  ONE: 1,

  /**
   * @property ZERO
   * @type {Number}
   */
  ZERO: 0,

  /**
   * @property SRC_ALPHA
   * @type {Number}
   */
  SRC_ALPHA: 0x0302,

  /**
   * @property SRC_ALPHA_SATURATE
   * @type {Number}
   */
  SRC_ALPHA_SATURATE: 0x308,

  /**
   * @property SRC_COLOR
   * @type {Number}
   */
  SRC_COLOR: 0x300,

  /**
   * @property DST_ALPHA
   * @type {Number}
   */
  DST_ALPHA: 0x304,

  /**
   * @property DST_COLOR
   * @type {Number}
   */
  DST_COLOR: 0x306,

  /**
   * @property ONE_MINUS_SRC_ALPHA
   * @type {Number}
   */
  ONE_MINUS_SRC_ALPHA: 0x0303,

  /**
   * @property ONE_MINUS_SRC_COLOR
   * @type {Number}
   */
  ONE_MINUS_SRC_COLOR: 0x301,

  /**
   * @property ONE_MINUS_DST_ALPHA
   * @type {Number}
   */
  ONE_MINUS_DST_ALPHA: 0x305,

  /**
   * @property ONE_MINUS_DST_COLOR
   * @type {Number}
   */
  ONE_MINUS_DST_COLOR: 0x0307,

  /**
   * @property ONE_MINUS_CONSTANT_ALPHA
   * @type {Number}
   */
  ONE_MINUS_CONSTANT_ALPHA: 0x8004,

  /**
   * @property ONE_MINUS_CONSTANT_COLOR
   * @type {Number}
   */
  ONE_MINUS_CONSTANT_COLOR: 0x8002,
  //Possible device orientations

  /**
   * Oriented vertically
   * @property ORIENTATION_PORTRAIT
   * @type {Number}
   */
  ORIENTATION_PORTRAIT: 1,

  /**
   * Oriented horizontally
   * @property ORIENTATION_LANDSCAPE
   * @type {Number}
   */
  ORIENTATION_LANDSCAPE: 2,

  /**
   * Oriented automatically
   * @property ORIENTATION_AUTO
   * @type {Number}
   */
  ORIENTATION_AUTO: 3,
  DENSITYDPI_DEVICE: 'device-dpi',
  DENSITYDPI_HIGH: 'high-dpi',
  DENSITYDPI_MEDIUM: 'medium-dpi',
  DENSITYDPI_LOW: 'low-dpi',
  // General configurations

  /**
   * <p>
   *   If enabled, the texture coordinates will be calculated by using this formula: <br/>
   *      - texCoord.left = (rect.x*2+1) / (texture.wide*2);                  <br/>
   *      - texCoord.right = texCoord.left + (rect.width*2-2)/(texture.wide*2); <br/>
   *                                                                                 <br/>
   *  The same for bottom and top.                                                   <br/>
   *                                                                                 <br/>
   *  This formula prevents artifacts by using 99% of the texture.                   <br/>
   *  The "correct" way to prevent artifacts is by expand the texture's border with the same color by 1 pixel<br/>
   *                                                                                  <br/>
   *  Affected component:                                                                 <br/>
   *      - cc.TMXLayer                                                       <br/>
   *                                                                                  <br/>
   *  Enabled by default. To disabled set it to 0. <br/>
   *  To modify it, in Web engine please refer to CCMacro.js, in JSB please refer to CCConfig.h
   * </p>
   *
   * @property {Number} FIX_ARTIFACTS_BY_STRECHING_TEXEL_TMX
   */
  FIX_ARTIFACTS_BY_STRECHING_TEXEL_TMX: true,

  /**
   * Position of the FPS (Default: 0,0 (bottom-left corner))<br/>
   * To modify it, in Web engine please refer to CCMacro.js, in JSB please refer to CCConfig.h
   * @property {Vec2} DIRECTOR_STATS_POSITION
   */
  DIRECTOR_STATS_POSITION: cc.v2(0, 0),

  /**
   * <p>
   *    If enabled, actions that alter the position property (eg: CCMoveBy, CCJumpBy, CCBezierBy, etc..) will be stacked.                  <br/>
   *    If you run 2 or more 'position' actions at the same time on a node, then end position will be the sum of all the positions.        <br/>
   *    If disabled, only the last run action will take effect.
   * </p>
   * @property {Number} ENABLE_STACKABLE_ACTIONS
   */
  ENABLE_STACKABLE_ACTIONS: true,

  /**
   * !#en 
   * The timeout to determine whether a touch is no longer active and should be removed.
   * The reason to add this timeout is due to an issue in X5 browser core, 
   * when X5 is presented in wechat on Android, if a touch is glissed from the bottom up, and leave the page area,
   * no touch cancel event is triggered, and the touch will be considered active forever. 
   * After multiple times of this action, our maximum touches number will be reached and all new touches will be ignored.
   * So this new mechanism can remove the touch that should be inactive if it's not updated during the last 5000 milliseconds.
   * Though it might remove a real touch if it's just not moving for the last 5 seconds which is not easy with the sensibility of mobile touch screen.
   * You can modify this value to have a better behavior if you find it's not enough.
   * !#zh
   * 用于甄别一个触点对象是否已经失效并且可以被移除的延时时长
   * 添加这个时长的原因是 X5 内核在微信浏览器中出现的一个 bug。
   * 在这个环境下，如果用户将一个触点从底向上移出页面区域，将不会触发任何 touch cancel 或 touch end 事件，而这个触点会被永远当作停留在页面上的有效触点。
   * 重复这样操作几次之后，屏幕上的触点数量将达到我们的事件系统所支持的最高触点数量，之后所有的触摸事件都将被忽略。
   * 所以这个新的机制可以在触点在一定时间内没有任何更新的情况下视为失效触点并从事件系统中移除。
   * 当然，这也可能移除一个真实的触点，如果用户的触点真的在一定时间段内完全没有移动（这在当前手机屏幕的灵敏度下会很难）。
   * 你可以修改这个值来获得你需要的效果，默认值是 5000 毫秒。
   * @property {Number} TOUCH_TIMEOUT
   */
  TOUCH_TIMEOUT: 5000,

  /**
   * !#en 
   * The maximum vertex count for a single batched draw call.
   * !#zh
   * 最大可以被单次批处理渲染的顶点数量。
   * @property {Number} BATCH_VERTEX_COUNT
   */
  BATCH_VERTEX_COUNT: 20000,

  /**
   * !#en 
   * Whether or not enabled tiled map auto culling. If you set the TiledMap skew or rotation, then need to manually disable this, otherwise, the rendering will be wrong.
   * !#zh
   * 是否开启瓦片地图的自动裁减功能。瓦片地图如果设置了 skew, rotation 的话，需要手动关闭，否则渲染会出错。
   * @property {Boolean} ENABLE_TILEDMAP_CULLING
   * @default true
   */
  ENABLE_TILEDMAP_CULLING: true,

  /**
   * !#en 
   * The max concurrent task number for the downloader
   * !#zh
   * 下载任务的最大并发数限制，在安卓平台部分机型或版本上可能需要限制在较低的水平
   * @property {Number} DOWNLOAD_MAX_CONCURRENT
   * @default 64
   */
  DOWNLOAD_MAX_CONCURRENT: 64,

  /**
   * !#en 
   * Boolean that indicates if the canvas contains an alpha channel, default sets to false for better performance.
   * Though if you want to make your canvas background transparent and show other dom elements at the background, 
   * you can set it to true before `cc.game.run`.
   * Web only.
   * !#zh
   * 用于设置 Canvas 背景是否支持 alpha 通道，默认为 false，这样可以有更高的性能表现。
   * 如果你希望 Canvas 背景是透明的，并显示背后的其他 DOM 元素，你可以在 `cc.game.run` 之前将这个值设为 true。
   * 仅支持 Web
   * @property {Boolean} ENABLE_TRANSPARENT_CANVAS
   * @default false
   */
  ENABLE_TRANSPARENT_CANVAS: false,

  /**
   * !#en
   * Boolean that indicates if the WebGL context is created with `antialias` option turned on, default value is false.
   * Set it to true could make your game graphics slightly smoother, like texture hard edges when rotated.
   * Whether to use this really depend on your game design and targeted platform, 
   * device with retina display usually have good detail on graphics with or without this option, 
   * you probably don't want antialias if your game style is pixel art based.
   * Also, it could have great performance impact with some browser / device using software MSAA.
   * You can set it to true before `cc.game.run`.
   * Web only.
   * !#zh
   * 用于设置在创建 WebGL Context 时是否开启抗锯齿选项，默认值是 false。
   * 将这个选项设置为 true 会让你的游戏画面稍稍平滑一些，比如旋转硬边贴图时的锯齿。是否开启这个选项很大程度上取决于你的游戏和面向的平台。
   * 在大多数拥有 retina 级别屏幕的设备上用户往往无法区分这个选项带来的变化；如果你的游戏选择像素艺术风格，你也多半不会想开启这个选项。
   * 同时，在少部分使用软件级别抗锯齿算法的设备或浏览器上，这个选项会对性能产生比较大的影响。
   * 你可以在 `cc.game.run` 之前设置这个值，否则它不会生效。
   * 仅支持 Web
   * @property {Boolean} ENABLE_WEBGL_ANTIALIAS
   * @default false
   */
  ENABLE_WEBGL_ANTIALIAS: false,

  /**
   * !#en
   * Whether or not enable auto culling.
   * This feature have been removed in v2.0 new renderer due to overall performance consumption.
   * We have no plan currently to re-enable auto culling.
   * If your game have more dynamic objects, we suggest to disable auto culling.
   * If your game have more static objects, we suggest to enable auto culling.
   * !#zh
   * 是否开启自动裁减功能，开启裁减功能将会把在屏幕外的物体从渲染队列中去除掉。
   * 这个功能在 v2.0 的新渲染器中被移除了，因为它在大多数游戏中所带来的损耗要高于性能的提升，目前我们没有计划重新支持自动裁剪。
   * 如果游戏中的动态物体比较多的话，建议将此选项关闭。
   * 如果游戏中的静态物体比较多的话，建议将此选项打开。
   * @property {Boolean} ENABLE_CULLING
   * @deprecated since v2.0
   * @default false
   */
  ENABLE_CULLING: false,

  /**
   * !#en
   * Whether or not clear dom Image object cache after uploading to gl texture.
   * Concretely, we are setting image.src to empty string to release the cache.
   * Normally you don't need to enable this option, because on web the Image object doesn't consume too much memory.
   * But on WeChat Game platform, the current version cache decoded data in Image object, which has high memory usage.
   * So we enabled this option by default on WeChat, so that we can release Image cache immediately after uploaded to GPU.
   * !#zh
   * 是否在将贴图上传至 GPU 之后删除 DOM Image 缓存。
   * 具体来说，我们通过设置 image.src 为空字符串来释放这部分内存。
   * 正常情况下，你不需要开启这个选项，因为在 web 平台，Image 对象所占用的内存很小。
   * 但是在微信小游戏平台的当前版本，Image 对象会缓存解码后的图片数据，它所占用的内存空间很大。
   * 所以我们在微信平台默认开启了这个选项，这样我们就可以在上传 GL 贴图之后立即释放 Image 对象的内存，避免过高的内存占用。
   * @property {Boolean} CLEANUP_IMAGE_CACHE
   * @default false
   */
  CLEANUP_IMAGE_CACHE: false,

  /**
   * !#en
   * Whether or not show mesh wire frame.
   * !#zh
   * 是否显示网格的线框。
   * @property {Boolean} SHOW_MESH_WIREFRAME
   * @default false
   */
  SHOW_MESH_WIREFRAME: false,

  /**
   * !#en
   * Whether or not show mesh normal.
   * !#zh
   * 是否显示网格的法线。
   * @property {Boolean} SHOW_MESH_NORMAL
   * @default false
   */
  SHOW_MESH_NORMAL: false,

  /**
   * !#en
   * Set cc.RotateTo/cc.RotateBy rotate direction.
   * If need set rotate positive direction to counterclockwise, please change setting to : cc.macro.ROTATE_ACTION_CCW = true;
   * !#zh
   * 设置 cc.RotateTo/cc.RotateBy 的旋转方向。
   * 如果需要设置旋转的正方向为逆时针方向，请设置选项为： cc.macro.ROTATE_ACTION_CCW = true;
   * @property {Boolean} ROTATE_ACTION_CCW
   * @default false
   */
  ROTATE_ACTION_CCW: false,

  /**
   * !#en
   * Whether to enable multi-touch.
   * !#zh
   * 是否开启多点触摸
   * @property {Boolean} ENABLE_MULTI_TOUCH
   * @default true
   */
  ENABLE_MULTI_TOUCH: true
};
var SUPPORT_TEXTURE_FORMATS = ['.pkm', '.pvr', '.webp', '.jpg', '.jpeg', '.bmp', '.png'];
/**
 * !en
 * The image format supported by the engine defaults, and the supported formats may differ in different build platforms and device types.
 * Currently all platform and device support ['.webp', '.jpg', '.jpeg', '.bmp', '.png'], The iOS mobile platform also supports the PVR format。
 * !zh
 * 引擎默认支持的图片格式，支持的格式可能在不同的构建平台和设备类型上有所差别。
 * 目前所有平台和设备支持的格式有 ['.webp', '.jpg', '.jpeg', '.bmp', '.png']. 另外 Ios 手机平台还额外支持了 PVR 格式。
 * @property {[String]} SUPPORT_TEXTURE_FORMATS
 */

cc.macro.SUPPORT_TEXTURE_FORMATS = SUPPORT_TEXTURE_FORMATS;
/**
 * !#en Key map for keyboard event
 * !#zh 键盘事件的按键值
 * @enum macro.KEY
 * @example {@link cocos2d/core/platform/CCCommon/KEY.js}
 */

cc.macro.KEY = {
  /**
   * !#en None
   * !#zh 没有分配
   * @property none
   * @type {Number}
   * @readonly
   */
  none: 0,
  // android

  /**
   * !#en The back key
   * !#zh 返回键
   * @property back
   * @type {Number}
   * @readonly
   */
  back: 6,

  /**
   * !#en The menu key
   * !#zh 菜单键
   * @property menu
   * @type {Number}
   * @readonly
   */
  menu: 18,

  /**
   * !#en The backspace key
   * !#zh 退格键
   * @property backspace
   * @type {Number}
   * @readonly
   */
  backspace: 8,

  /**
   * !#en The tab key
   * !#zh Tab 键
   * @property tab
   * @type {Number}
   * @readonly
   */
  tab: 9,

  /**
   * !#en The enter key
   * !#zh 回车键
   * @property enter
   * @type {Number}
   * @readonly
   */
  enter: 13,

  /**
   * !#en The shift key
   * !#zh Shift 键
   * @property shift
   * @type {Number}
   * @readonly
   */
  shift: 16,
  //should use shiftkey instead

  /**
   * !#en The ctrl key
   * !#zh Ctrl 键
   * @property ctrl
   * @type {Number}
   * @readonly
   */
  ctrl: 17,
  //should use ctrlkey

  /**
   * !#en The alt key
   * !#zh Alt 键
   * @property alt
   * @type {Number}
   * @readonly
   */
  alt: 18,
  //should use altkey

  /**
   * !#en The pause key
   * !#zh 暂停键
   * @property pause
   * @type {Number}
   * @readonly
   */
  pause: 19,

  /**
   * !#en The caps lock key
   * !#zh 大写锁定键
   * @property capslock
   * @type {Number}
   * @readonly
   */
  capslock: 20,

  /**
   * !#en The esc key
   * !#zh ESC 键
   * @property escape
   * @type {Number}
   * @readonly
   */
  escape: 27,

  /**
   * !#en The space key
   * !#zh 空格键
   * @property space
   * @type {Number}
   * @readonly
   */
  space: 32,

  /**
   * !#en The page up key
   * !#zh 向上翻页键
   * @property pageup
   * @type {Number}
   * @readonly
   */
  pageup: 33,

  /**
   * !#en The page down key
   * !#zh 向下翻页键
   * @property pagedown
   * @type {Number}
   * @readonly
   */
  pagedown: 34,

  /**
   * !#en The end key
   * !#zh 结束键
   * @property end
   * @type {Number}
   * @readonly
   */
  end: 35,

  /**
   * !#en The home key
   * !#zh 主菜单键
   * @property home
   * @type {Number}
   * @readonly
   */
  home: 36,

  /**
   * !#en The left key
   * !#zh 向左箭头键
   * @property left
   * @type {Number}
   * @readonly
   */
  left: 37,

  /**
   * !#en The up key
   * !#zh 向上箭头键
   * @property up
   * @type {Number}
   * @readonly
   */
  up: 38,

  /**
   * !#en The right key
   * !#zh 向右箭头键
   * @property right
   * @type {Number}
   * @readonly
   */
  right: 39,

  /**
   * !#en The down key
   * !#zh 向下箭头键
   * @property down
   * @type {Number}
   * @readonly
   */
  down: 40,

  /**
   * !#en The select key
   * !#zh Select 键
   * @property select
   * @type {Number}
   * @readonly
   */
  select: 41,

  /**
   * !#en The insert key
   * !#zh 插入键
   * @property insert
   * @type {Number}
   * @readonly
   */
  insert: 45,

  /**
   * !#en The Delete key
   * !#zh 删除键
   * @property Delete
   * @type {Number}
   * @readonly
   */
  Delete: 46,

  /**
   * !#en The '0' key on the top of the alphanumeric keyboard.
   * !#zh 字母键盘上的 0 键
   * @property 0
   * @type {Number}
   * @readonly
   */
  0: 48,

  /**
   * !#en The '1' key on the top of the alphanumeric keyboard.
   * !#zh 字母键盘上的 1 键
   * @property 1
   * @type {Number}
   * @readonly
   */
  1: 49,

  /**
   * !#en The '2' key on the top of the alphanumeric keyboard.
   * !#zh 字母键盘上的 2 键
   * @property 2
   * @type {Number}
   * @readonly
   */
  2: 50,

  /**
   * !#en The '3' key on the top of the alphanumeric keyboard.
   * !#zh 字母键盘上的 3 键
   * @property 3
   * @type {Number}
   * @readonly
   */
  3: 51,

  /**
   * !#en The '4' key on the top of the alphanumeric keyboard.
   * !#zh 字母键盘上的 4 键
   * @property 4
   * @type {Number}
   * @readonly
   */
  4: 52,

  /**
   * !#en The '5' key on the top of the alphanumeric keyboard.
   * !#zh 字母键盘上的 5 键
   * @property 5
   * @type {Number}
   * @readonly
   */
  5: 53,

  /**
   * !#en The '6' key on the top of the alphanumeric keyboard.
   * !#zh 字母键盘上的 6 键
   * @property 6
   * @type {Number}
   * @readonly
   */
  6: 54,

  /**
   * !#en The '7' key on the top of the alphanumeric keyboard.
   * !#zh 字母键盘上的 7 键
   * @property 7
   * @type {Number}
   * @readonly
   */
  7: 55,

  /**
   * !#en The '8' key on the top of the alphanumeric keyboard.
   * !#zh 字母键盘上的 8 键
   * @property 8
   * @type {Number}
   * @readonly
   */
  8: 56,

  /**
   * !#en The '9' key on the top of the alphanumeric keyboard.
   * !#zh 字母键盘上的 9 键
   * @property 9
   * @type {Number}
   * @readonly
   */
  9: 57,

  /**
   * !#en The a key
   * !#zh A 键
   * @property a
   * @type {Number}
   * @readonly
   */
  a: 65,

  /**
   * !#en The b key
   * !#zh B 键
   * @property b
   * @type {Number}
   * @readonly
   */
  b: 66,

  /**
   * !#en The c key
   * !#zh C 键
   * @property c
   * @type {Number}
   * @readonly
   */
  c: 67,

  /**
   * !#en The d key
   * !#zh D 键
   * @property d
   * @type {Number}
   * @readonly
   */
  d: 68,

  /**
   * !#en The e key
   * !#zh E 键
   * @property e
   * @type {Number}
   * @readonly
   */
  e: 69,

  /**
   * !#en The f key
   * !#zh F 键
   * @property f
   * @type {Number}
   * @readonly
   */
  f: 70,

  /**
   * !#en The g key
   * !#zh G 键
   * @property g
   * @type {Number}
   * @readonly
   */
  g: 71,

  /**
   * !#en The h key
   * !#zh H 键
   * @property h
   * @type {Number}
   * @readonly
   */
  h: 72,

  /**
   * !#en The i key
   * !#zh I 键
   * @property i
   * @type {Number}
   * @readonly
   */
  i: 73,

  /**
   * !#en The j key
   * !#zh J 键
   * @property j
   * @type {Number}
   * @readonly
   */
  j: 74,

  /**
   * !#en The k key
   * !#zh K 键
   * @property k
   * @type {Number}
   * @readonly
   */
  k: 75,

  /**
   * !#en The l key
   * !#zh L 键
   * @property l
   * @type {Number}
   * @readonly
   */
  l: 76,

  /**
   * !#en The m key
   * !#zh M 键
   * @property m
   * @type {Number}
   * @readonly
   */
  m: 77,

  /**
   * !#en The n key
   * !#zh N 键
   * @property n
   * @type {Number}
   * @readonly
   */
  n: 78,

  /**
   * !#en The o key
   * !#zh O 键
   * @property o
   * @type {Number}
   * @readonly
   */
  o: 79,

  /**
   * !#en The p key
   * !#zh P 键
   * @property p
   * @type {Number}
   * @readonly
   */
  p: 80,

  /**
   * !#en The q key
   * !#zh Q 键
   * @property q
   * @type {Number}
   * @readonly
   */
  q: 81,

  /**
   * !#en The r key
   * !#zh R 键
   * @property r
   * @type {Number}
   * @readonly
   */
  r: 82,

  /**
   * !#en The s key
   * !#zh S 键
   * @property s
   * @type {Number}
   * @readonly
   */
  s: 83,

  /**
   * !#en The t key
   * !#zh T 键
   * @property t
   * @type {Number}
   * @readonly
   */
  t: 84,

  /**
   * !#en The u key
   * !#zh U 键
   * @property u
   * @type {Number}
   * @readonly
   */
  u: 85,

  /**
   * !#en The v key
   * !#zh V 键
   * @property v
   * @type {Number}
   * @readonly
   */
  v: 86,

  /**
   * !#en The w key
   * !#zh W 键
   * @property w
   * @type {Number}
   * @readonly
   */
  w: 87,

  /**
   * !#en The x key
   * !#zh X 键
   * @property x
   * @type {Number}
   * @readonly
   */
  x: 88,

  /**
   * !#en The y key
   * !#zh Y 键
   * @property y
   * @type {Number}
   * @readonly
   */
  y: 89,

  /**
   * !#en The z key
   * !#zh Z 键
   * @property z
   * @type {Number}
   * @readonly
   */
  z: 90,

  /**
   * !#en The numeric keypad 0
   * !#zh 数字键盘 0
   * @property num0
   * @type {Number}
   * @readonly
   */
  num0: 96,

  /**
   * !#en The numeric keypad 1
   * !#zh 数字键盘 1
   * @property num1
   * @type {Number}
   * @readonly
   */
  num1: 97,

  /**
   * !#en The numeric keypad 2
   * !#zh 数字键盘 2
   * @property num2
   * @type {Number}
   * @readonly
   */
  num2: 98,

  /**
   * !#en The numeric keypad 3
   * !#zh 数字键盘 3
   * @property num3
   * @type {Number}
   * @readonly
   */
  num3: 99,

  /**
   * !#en The numeric keypad 4
   * !#zh 数字键盘 4
   * @property num4
   * @type {Number}
   * @readonly
   */
  num4: 100,

  /**
   * !#en The numeric keypad 5
   * !#zh 数字键盘 5
   * @property num5
   * @type {Number}
   * @readonly
   */
  num5: 101,

  /**
   * !#en The numeric keypad 6
   * !#zh 数字键盘 6
   * @property num6
   * @type {Number}
   * @readonly
   */
  num6: 102,

  /**
   * !#en The numeric keypad 7
   * !#zh 数字键盘 7
   * @property num7
   * @type {Number}
   * @readonly
   */
  num7: 103,

  /**
   * !#en The numeric keypad 8
   * !#zh 数字键盘 8
   * @property num8
   * @type {Number}
   * @readonly
   */
  num8: 104,

  /**
   * !#en The numeric keypad 9
   * !#zh 数字键盘 9
   * @property num9
   * @type {Number}
   * @readonly
   */
  num9: 105,

  /**
   * !#en The numeric keypad '*'
   * !#zh 数字键盘 *
   * @property *
   * @type {Number}
   * @readonly
   */
  '*': 106,

  /**
   * !#en The numeric keypad '+'
   * !#zh 数字键盘 +
   * @property +
   * @type {Number}
   * @readonly
   */
  '+': 107,

  /**
   * !#en The numeric keypad '-'
   * !#zh 数字键盘 -
   * @property -
   * @type {Number}
   * @readonly
   */
  '-': 109,

  /**
   * !#en The numeric keypad 'delete'
   * !#zh 数字键盘删除键
   * @property numdel
   * @type {Number}
   * @readonly
   */
  'numdel': 110,

  /**
   * !#en The numeric keypad '/'
   * !#zh 数字键盘 /
   * @property /
   * @type {Number}
   * @readonly
   */
  '/': 111,

  /**
   * !#en The F1 function key
   * !#zh F1 功能键
   * @property f1
   * @type {Number}
   * @readonly
   */
  f1: 112,
  //f1-f12 dont work on ie

  /**
   * !#en The F2 function key
   * !#zh F2 功能键
   * @property f2
   * @type {Number}
   * @readonly
   */
  f2: 113,

  /**
   * !#en The F3 function key
   * !#zh F3 功能键
   * @property f3
   * @type {Number}
   * @readonly
   */
  f3: 114,

  /**
   * !#en The F4 function key
   * !#zh F4 功能键
   * @property f4
   * @type {Number}
   * @readonly
   */
  f4: 115,

  /**
   * !#en The F5 function key
   * !#zh F5 功能键
   * @property f5
   * @type {Number}
   * @readonly
   */
  f5: 116,

  /**
   * !#en The F6 function key
   * !#zh F6 功能键
   * @property f6
   * @type {Number}
   * @readonly
   */
  f6: 117,

  /**
   * !#en The F7 function key
   * !#zh F7 功能键
   * @property f7
   * @type {Number}
   * @readonly
   */
  f7: 118,

  /**
   * !#en The F8 function key
   * !#zh F8 功能键
   * @property f8
   * @type {Number}
   * @readonly
   */
  f8: 119,

  /**
   * !#en The F9 function key
   * !#zh F9 功能键
   * @property f9
   * @type {Number}
   * @readonly
   */
  f9: 120,

  /**
   * !#en The F10 function key
   * !#zh F10 功能键
   * @property f10
   * @type {Number}
   * @readonly
   */
  f10: 121,

  /**
   * !#en The F11 function key
   * !#zh F11 功能键
   * @property f11
   * @type {Number}
   * @readonly
   */
  f11: 122,

  /**
   * !#en The F12 function key
   * !#zh F12 功能键
   * @property f12
   * @type {Number}
   * @readonly
   */
  f12: 123,

  /**
   * !#en The numlock key
   * !#zh 数字锁定键
   * @property numlock
   * @type {Number}
   * @readonly
   */
  numlock: 144,

  /**
   * !#en The scroll lock key
   * !#zh 滚动锁定键
   * @property scrolllock
   * @type {Number}
   * @readonly
   */
  scrolllock: 145,

  /**
   * !#en The ';' key.
   * !#zh 分号键
   * @property ;
   * @type {Number}
   * @readonly
   */
  ';': 186,

  /**
   * !#en The ';' key.
   * !#zh 分号键
   * @property semicolon
   * @type {Number}
   * @readonly
   */
  semicolon: 186,

  /**
   * !#en The '=' key.
   * !#zh 等于号键
   * @property equal
   * @type {Number}
   * @readonly
   */
  equal: 187,

  /**
   * !#en The '=' key.
   * !#zh 等于号键
   * @property =
   * @type {Number}
   * @readonly
   */
  '=': 187,

  /**
   * !#en The ',' key.
   * !#zh 逗号键
   * @property ,
   * @type {Number}
   * @readonly
   */
  ',': 188,

  /**
   * !#en The ',' key.
   * !#zh 逗号键
   * @property comma
   * @type {Number}
   * @readonly
   */
  comma: 188,

  /**
   * !#en The dash '-' key.
   * !#zh 中划线键
   * @property dash
   * @type {Number}
   * @readonly
   */
  dash: 189,

  /**
   * !#en The '.' key.
   * !#zh 句号键
   * @property .
   * @type {Number}
   * @readonly
   */
  '.': 190,

  /**
   * !#en The '.' key
   * !#zh 句号键
   * @property period
   * @type {Number}
   * @readonly
   */
  period: 190,

  /**
   * !#en The forward slash key
   * !#zh 正斜杠键
   * @property forwardslash
   * @type {Number}
   * @readonly
   */
  forwardslash: 191,

  /**
   * !#en The grave key
   * !#zh 按键 `
   * @property grave
   * @type {Number}
   * @readonly
   */
  grave: 192,

  /**
   * !#en The '[' key
   * !#zh 按键 [
   * @property [
   * @type {Number}
   * @readonly
   */
  '[': 219,

  /**
   * !#en The '[' key
   * !#zh 按键 [
   * @property openbracket
   * @type {Number}
   * @readonly
   */
  openbracket: 219,

  /**
   * !#en The '\' key
   * !#zh 反斜杠键
   * @property backslash
   * @type {Number}
   * @readonly
   */
  backslash: 220,

  /**
   * !#en The ']' key
   * !#zh 按键 ]
   * @property ]
   * @type {Number}
   * @readonly
   */
  ']': 221,

  /**
   * !#en The ']' key
   * !#zh 按键 ]
   * @property closebracket
   * @type {Number}
   * @readonly
   */
  closebracket: 221,

  /**
   * !#en The quote key
   * !#zh 单引号键
   * @property quote
   * @type {Number}
   * @readonly
   */
  quote: 222,
  // gamepad controll

  /**
   * !#en The dpad left key
   * !#zh 导航键 向左
   * @property dpadLeft
   * @type {Number}
   * @readonly
   */
  dpadLeft: 1000,

  /**
   * !#en The dpad right key
   * !#zh 导航键 向右
   * @property dpadRight
   * @type {Number}
   * @readonly
   */
  dpadRight: 1001,

  /**
   * !#en The dpad up key
   * !#zh 导航键 向上
   * @property dpadUp
   * @type {Number}
   * @readonly
   */
  dpadUp: 1003,

  /**
   * !#en The dpad down key
   * !#zh 导航键 向下
   * @property dpadDown
   * @type {Number}
   * @readonly
   */
  dpadDown: 1004,

  /**
   * !#en The dpad center key
   * !#zh 导航键 确定键
   * @property dpadCenter
   * @type {Number}
   * @readonly
   */
  dpadCenter: 1005
};
/**
 * Image formats
 * @enum macro.ImageFormat
 */

cc.macro.ImageFormat = cc.Enum({
  /**
   * Image Format:JPG
   * @property JPG
   * @type {Number}
   */
  JPG: 0,

  /**
   * Image Format:PNG
   * @property PNG
   * @type {Number}
   */
  PNG: 1,

  /**
   * Image Format:TIFF
   * @property TIFF
   * @type {Number}
   */
  TIFF: 2,

  /**
   * Image Format:WEBP
   * @property WEBP
   * @type {Number}
   */
  WEBP: 3,

  /**
   * Image Format:PVR
   * @property PVR
   * @type {Number}
   */
  PVR: 4,

  /**
   * Image Format:ETC
   * @property ETC
   * @type {Number}
   */
  ETC: 5,

  /**
   * Image Format:S3TC
   * @property S3TC
   * @type {Number}
   */
  S3TC: 6,

  /**
   * Image Format:ATITC
   * @property ATITC
   * @type {Number}
   */
  ATITC: 7,

  /**
   * Image Format:TGA
   * @property TGA
   * @type {Number}
   */
  TGA: 8,

  /**
   * Image Format:RAWDATA
   * @property RAWDATA
   * @type {Number}
   */
  RAWDATA: 9,

  /**
   * Image Format:UNKNOWN
   * @property UNKNOWN
   * @type {Number}
   */
  UNKNOWN: 10
});
/**
 * !#en
 * Enum for blend factor
 * Refer to: http://www.andersriggelsen.dk/glblendfunc.php
 * !#zh
 * 混合因子
 * 可参考: http://www.andersriggelsen.dk/glblendfunc.php
 * @enum macro.BlendFactor
 */

cc.macro.BlendFactor = cc.Enum({
  /**
   * !#en All use
   * !#zh 全部使用
   * @property {Number} ONE
   */
  ONE: 1,
  //cc.macro.ONE

  /**
   * !#en Not all
   * !#zh 全部不用
   * @property {Number} ZERO
   */
  ZERO: 0,
  //cc.ZERO

  /**
   * !#en Using the source alpha
   * !#zh 使用源颜色的透明度
   * @property {Number} SRC_ALPHA
   */
  SRC_ALPHA: 0x302,
  //cc.SRC_ALPHA

  /**
   * !#en Using the source color
   * !#zh 使用源颜色
   * @property {Number} SRC_COLOR
   */
  SRC_COLOR: 0x300,
  //cc.SRC_COLOR

  /**
   * !#en Using the target alpha
   * !#zh 使用目标颜色的透明度
   * @property {Number} DST_ALPHA
   */
  DST_ALPHA: 0x304,
  //cc.DST_ALPHA

  /**
   * !#en Using the target color
   * !#zh 使用目标颜色
   * @property {Number} DST_COLOR
   */
  DST_COLOR: 0x306,
  //cc.DST_COLOR

  /**
   * !#en Minus the source alpha
   * !#zh 减去源颜色的透明度
   * @property {Number} ONE_MINUS_SRC_ALPHA
   */
  ONE_MINUS_SRC_ALPHA: 0x303,
  //cc.ONE_MINUS_SRC_ALPHA

  /**
   * !#en Minus the source color
   * !#zh 减去源颜色
   * @property {Number} ONE_MINUS_SRC_COLOR
   */
  ONE_MINUS_SRC_COLOR: 0x301,
  //cc.ONE_MINUS_SRC_COLOR

  /**
   * !#en Minus the target alpha
   * !#zh 减去目标颜色的透明度
   * @property {Number} ONE_MINUS_DST_ALPHA
   */
  ONE_MINUS_DST_ALPHA: 0x305,
  //cc.ONE_MINUS_DST_ALPHA

  /**
   * !#en Minus the target color
   * !#zh 减去目标颜色
   * @property {Number} ONE_MINUS_DST_COLOR
   */
  ONE_MINUS_DST_COLOR: 0x307 //cc.ONE_MINUS_DST_COLOR

});
/**
 * @enum macro.TextAlignment
 */

cc.macro.TextAlignment = cc.Enum({
  /**
   * @property {Number} LEFT
   */
  LEFT: 0,

  /**
   * @property {Number} CENTER
   */
  CENTER: 1,

  /**
   * @property {Number} RIGHT
   */
  RIGHT: 2
});
/**
 * @enum VerticalTextAlignment
 */

cc.macro.VerticalTextAlignment = cc.Enum({
  /**
   * @property {Number} TOP
   */
  TOP: 0,

  /**
   * @property {Number} CENTER
   */
  CENTER: 1,

  /**
   * @property {Number} BOTTOM
   */
  BOTTOM: 2
});
module.exports = cc.macro;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDTWFjcm8uanMiXSwibmFtZXMiOlsiY2MiLCJtYWNybyIsIlJBRCIsIk1hdGgiLCJQSSIsIkRFRyIsIlJFUEVBVF9GT1JFVkVSIiwiTnVtYmVyIiwiTUFYX1ZBTFVFIiwiRkxUX0VQU0lMT04iLCJNSU5fWklOREVYIiwicG93IiwiTUFYX1pJTkRFWCIsIk9ORSIsIlpFUk8iLCJTUkNfQUxQSEEiLCJTUkNfQUxQSEFfU0FUVVJBVEUiLCJTUkNfQ09MT1IiLCJEU1RfQUxQSEEiLCJEU1RfQ09MT1IiLCJPTkVfTUlOVVNfU1JDX0FMUEhBIiwiT05FX01JTlVTX1NSQ19DT0xPUiIsIk9ORV9NSU5VU19EU1RfQUxQSEEiLCJPTkVfTUlOVVNfRFNUX0NPTE9SIiwiT05FX01JTlVTX0NPTlNUQU5UX0FMUEhBIiwiT05FX01JTlVTX0NPTlNUQU5UX0NPTE9SIiwiT1JJRU5UQVRJT05fUE9SVFJBSVQiLCJPUklFTlRBVElPTl9MQU5EU0NBUEUiLCJPUklFTlRBVElPTl9BVVRPIiwiREVOU0lUWURQSV9ERVZJQ0UiLCJERU5TSVRZRFBJX0hJR0giLCJERU5TSVRZRFBJX01FRElVTSIsIkRFTlNJVFlEUElfTE9XIiwiRklYX0FSVElGQUNUU19CWV9TVFJFQ0hJTkdfVEVYRUxfVE1YIiwiRElSRUNUT1JfU1RBVFNfUE9TSVRJT04iLCJ2MiIsIkVOQUJMRV9TVEFDS0FCTEVfQUNUSU9OUyIsIlRPVUNIX1RJTUVPVVQiLCJCQVRDSF9WRVJURVhfQ09VTlQiLCJFTkFCTEVfVElMRURNQVBfQ1VMTElORyIsIkRPV05MT0FEX01BWF9DT05DVVJSRU5UIiwiRU5BQkxFX1RSQU5TUEFSRU5UX0NBTlZBUyIsIkVOQUJMRV9XRUJHTF9BTlRJQUxJQVMiLCJFTkFCTEVfQ1VMTElORyIsIkNMRUFOVVBfSU1BR0VfQ0FDSEUiLCJTSE9XX01FU0hfV0lSRUZSQU1FIiwiU0hPV19NRVNIX05PUk1BTCIsIlJPVEFURV9BQ1RJT05fQ0NXIiwiRU5BQkxFX01VTFRJX1RPVUNIIiwiU1VQUE9SVF9URVhUVVJFX0ZPUk1BVFMiLCJLRVkiLCJub25lIiwiYmFjayIsIm1lbnUiLCJiYWNrc3BhY2UiLCJ0YWIiLCJlbnRlciIsInNoaWZ0IiwiY3RybCIsImFsdCIsInBhdXNlIiwiY2Fwc2xvY2siLCJlc2NhcGUiLCJzcGFjZSIsInBhZ2V1cCIsInBhZ2Vkb3duIiwiZW5kIiwiaG9tZSIsImxlZnQiLCJ1cCIsInJpZ2h0IiwiZG93biIsInNlbGVjdCIsImluc2VydCIsIkRlbGV0ZSIsImEiLCJiIiwiYyIsImQiLCJlIiwiZiIsImciLCJoIiwiaSIsImoiLCJrIiwibCIsIm0iLCJuIiwibyIsInAiLCJxIiwiciIsInMiLCJ0IiwidSIsInYiLCJ3IiwieCIsInkiLCJ6IiwibnVtMCIsIm51bTEiLCJudW0yIiwibnVtMyIsIm51bTQiLCJudW01IiwibnVtNiIsIm51bTciLCJudW04IiwibnVtOSIsImYxIiwiZjIiLCJmMyIsImY0IiwiZjUiLCJmNiIsImY3IiwiZjgiLCJmOSIsImYxMCIsImYxMSIsImYxMiIsIm51bWxvY2siLCJzY3JvbGxsb2NrIiwic2VtaWNvbG9uIiwiZXF1YWwiLCJjb21tYSIsImRhc2giLCJwZXJpb2QiLCJmb3J3YXJkc2xhc2giLCJncmF2ZSIsIm9wZW5icmFja2V0IiwiYmFja3NsYXNoIiwiY2xvc2VicmFja2V0IiwicXVvdGUiLCJkcGFkTGVmdCIsImRwYWRSaWdodCIsImRwYWRVcCIsImRwYWREb3duIiwiZHBhZENlbnRlciIsIkltYWdlRm9ybWF0IiwiRW51bSIsIkpQRyIsIlBORyIsIlRJRkYiLCJXRUJQIiwiUFZSIiwiRVRDIiwiUzNUQyIsIkFUSVRDIiwiVEdBIiwiUkFXREFUQSIsIlVOS05PV04iLCJCbGVuZEZhY3RvciIsIlRleHRBbGlnbm1lbnQiLCJMRUZUIiwiQ0VOVEVSIiwiUklHSFQiLCJWZXJ0aWNhbFRleHRBbGlnbm1lbnQiLCJUT1AiLCJCT1RUT00iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7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LENBQWpDO0FBZUFDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQm5LLEVBQUUsQ0FBQ0MsS0FBcEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAwOC0yMDEwIFJpY2FyZG8gUXVlc2FkYVxuIENvcHlyaWdodCAoYykgMjAxMS0yMDEyIGNvY29zMmQteC5vcmdcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwOi8vd3d3LmNvY29zMmQteC5vcmdcblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qKlxuICogUHJlZGVmaW5lZCBjb25zdGFudHNcbiAqIEBjbGFzcyBtYWNyb1xuICogQHN0YXRpY1xuICovXG5jYy5tYWNybyA9IHtcbiAgICAvKipcbiAgICAgKiBQSSAvIDE4MFxuICAgICAqIEBwcm9wZXJ0eSBSQURcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFJBRDogTWF0aC5QSSAvIDE4MCxcblxuICAgIC8qKlxuICAgICAqIE9uZSBkZWdyZWVcbiAgICAgKiBAcHJvcGVydHkgREVHXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBERUc6IDE4MCAvIE1hdGguUEksXG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgUkVQRUFUX0ZPUkVWRVJcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFJFUEVBVF9GT1JFVkVSOiAoTnVtYmVyLk1BWF9WQUxVRSAtIDEpLFxuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IEZMVF9FUFNJTE9OXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBGTFRfRVBTSUxPTjogMC4wMDAwMDAxMTkyMDkyODk2LFxuXG4gICAgLyoqXG4gICAgICogTWluaW11bSB6IGluZGV4IHZhbHVlIGZvciBub2RlXG4gICAgICogQHByb3BlcnR5IE1JTl9aSU5ERVhcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIE1JTl9aSU5ERVg6IC1NYXRoLnBvdygyLCAxNSksXG5cbiAgICAvKipcbiAgICAgKiBNYXhpbXVtIHogaW5kZXggdmFsdWUgZm9yIG5vZGVcbiAgICAgKiBAcHJvcGVydHkgTUFYX1pJTkRFWFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgTUFYX1pJTkRFWDogTWF0aC5wb3coMiwgMTUpIC0gMSxcblxuICAgIC8vc29tZSBnbCBjb25zdGFudCB2YXJpYWJsZVxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBPTkVcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIE9ORTogMSxcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBaRVJPXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBaRVJPOiAwLFxuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IFNSQ19BTFBIQVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgU1JDX0FMUEhBOiAweDAzMDIsXG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgU1JDX0FMUEhBX1NBVFVSQVRFXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBTUkNfQUxQSEFfU0FUVVJBVEU6IDB4MzA4LFxuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IFNSQ19DT0xPUlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgU1JDX0NPTE9SOiAweDMwMCxcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBEU1RfQUxQSEFcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIERTVF9BTFBIQTogMHgzMDQsXG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgRFNUX0NPTE9SXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBEU1RfQ09MT1I6IDB4MzA2LFxuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IE9ORV9NSU5VU19TUkNfQUxQSEFcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIE9ORV9NSU5VU19TUkNfQUxQSEE6IDB4MDMwMyxcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBPTkVfTUlOVVNfU1JDX0NPTE9SXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBPTkVfTUlOVVNfU1JDX0NPTE9SOiAweDMwMSxcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBPTkVfTUlOVVNfRFNUX0FMUEhBXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBPTkVfTUlOVVNfRFNUX0FMUEhBOiAweDMwNSxcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBPTkVfTUlOVVNfRFNUX0NPTE9SXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBPTkVfTUlOVVNfRFNUX0NPTE9SOiAweDAzMDcsXG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgT05FX01JTlVTX0NPTlNUQU5UX0FMUEhBXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBPTkVfTUlOVVNfQ09OU1RBTlRfQUxQSEE6IDB4ODAwNCxcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBPTkVfTUlOVVNfQ09OU1RBTlRfQ09MT1JcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIE9ORV9NSU5VU19DT05TVEFOVF9DT0xPUjogMHg4MDAyLFxuXG4gICAgLy9Qb3NzaWJsZSBkZXZpY2Ugb3JpZW50YXRpb25zXG4gICAgLyoqXG4gICAgICogT3JpZW50ZWQgdmVydGljYWxseVxuICAgICAqIEBwcm9wZXJ0eSBPUklFTlRBVElPTl9QT1JUUkFJVFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgT1JJRU5UQVRJT05fUE9SVFJBSVQ6IDEsXG5cbiAgICAvKipcbiAgICAgKiBPcmllbnRlZCBob3Jpem9udGFsbHlcbiAgICAgKiBAcHJvcGVydHkgT1JJRU5UQVRJT05fTEFORFNDQVBFXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBPUklFTlRBVElPTl9MQU5EU0NBUEU6IDIsXG5cbiAgICAvKipcbiAgICAgKiBPcmllbnRlZCBhdXRvbWF0aWNhbGx5XG4gICAgICogQHByb3BlcnR5IE9SSUVOVEFUSU9OX0FVVE9cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIE9SSUVOVEFUSU9OX0FVVE86IDMsXG5cbiAgICBERU5TSVRZRFBJX0RFVklDRTogJ2RldmljZS1kcGknLFxuICAgIERFTlNJVFlEUElfSElHSDogJ2hpZ2gtZHBpJyxcbiAgICBERU5TSVRZRFBJX01FRElVTTogJ21lZGl1bS1kcGknLFxuICAgIERFTlNJVFlEUElfTE9XOiAnbG93LWRwaScsXG5cbiAgICAvLyBHZW5lcmFsIGNvbmZpZ3VyYXRpb25zXG5cbiAgICAvKipcbiAgICAgKiA8cD5cbiAgICAgKiAgIElmIGVuYWJsZWQsIHRoZSB0ZXh0dXJlIGNvb3JkaW5hdGVzIHdpbGwgYmUgY2FsY3VsYXRlZCBieSB1c2luZyB0aGlzIGZvcm11bGE6IDxici8+XG4gICAgICogICAgICAtIHRleENvb3JkLmxlZnQgPSAocmVjdC54KjIrMSkgLyAodGV4dHVyZS53aWRlKjIpOyAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICogICAgICAtIHRleENvb3JkLnJpZ2h0ID0gdGV4Q29vcmQubGVmdCArIChyZWN0LndpZHRoKjItMikvKHRleHR1cmUud2lkZSoyKTsgPGJyLz5cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICogIFRoZSBzYW1lIGZvciBib3R0b20gYW5kIHRvcC4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgVGhpcyBmb3JtdWxhIHByZXZlbnRzIGFydGlmYWN0cyBieSB1c2luZyA5OSUgb2YgdGhlIHRleHR1cmUuICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICogIFRoZSBcImNvcnJlY3RcIiB3YXkgdG8gcHJldmVudCBhcnRpZmFjdHMgaXMgYnkgZXhwYW5kIHRoZSB0ZXh0dXJlJ3MgYm9yZGVyIHdpdGggdGhlIHNhbWUgY29sb3IgYnkgMSBwaXhlbDxici8+XG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgQWZmZWN0ZWQgY29tcG9uZW50OiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgICAgIC0gY2MuVE1YTGF5ZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICAgICAqICBFbmFibGVkIGJ5IGRlZmF1bHQuIFRvIGRpc2FibGVkIHNldCBpdCB0byAwLiA8YnIvPlxuICAgICAqICBUbyBtb2RpZnkgaXQsIGluIFdlYiBlbmdpbmUgcGxlYXNlIHJlZmVyIHRvIENDTWFjcm8uanMsIGluIEpTQiBwbGVhc2UgcmVmZXIgdG8gQ0NDb25maWcuaFxuICAgICAqIDwvcD5cbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBGSVhfQVJUSUZBQ1RTX0JZX1NUUkVDSElOR19URVhFTF9UTVhcbiAgICAgKi9cbiAgICBGSVhfQVJUSUZBQ1RTX0JZX1NUUkVDSElOR19URVhFTF9UTVg6IHRydWUsXG5cbiAgICAvKipcbiAgICAgKiBQb3NpdGlvbiBvZiB0aGUgRlBTIChEZWZhdWx0OiAwLDAgKGJvdHRvbS1sZWZ0IGNvcm5lcikpPGJyLz5cbiAgICAgKiBUbyBtb2RpZnkgaXQsIGluIFdlYiBlbmdpbmUgcGxlYXNlIHJlZmVyIHRvIENDTWFjcm8uanMsIGluIEpTQiBwbGVhc2UgcmVmZXIgdG8gQ0NDb25maWcuaFxuICAgICAqIEBwcm9wZXJ0eSB7VmVjMn0gRElSRUNUT1JfU1RBVFNfUE9TSVRJT05cbiAgICAgKi9cbiAgICBESVJFQ1RPUl9TVEFUU19QT1NJVElPTjogY2MudjIoMCwgMCksXG5cbiAgICAvKipcbiAgICAgKiA8cD5cbiAgICAgKiAgICBJZiBlbmFibGVkLCBhY3Rpb25zIHRoYXQgYWx0ZXIgdGhlIHBvc2l0aW9uIHByb3BlcnR5IChlZzogQ0NNb3ZlQnksIENDSnVtcEJ5LCBDQ0JlemllckJ5LCBldGMuLikgd2lsbCBiZSBzdGFja2VkLiAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICogICAgSWYgeW91IHJ1biAyIG9yIG1vcmUgJ3Bvc2l0aW9uJyBhY3Rpb25zIGF0IHRoZSBzYW1lIHRpbWUgb24gYSBub2RlLCB0aGVuIGVuZCBwb3NpdGlvbiB3aWxsIGJlIHRoZSBzdW0gb2YgYWxsIHRoZSBwb3NpdGlvbnMuICAgICAgICA8YnIvPlxuICAgICAqICAgIElmIGRpc2FibGVkLCBvbmx5IHRoZSBsYXN0IHJ1biBhY3Rpb24gd2lsbCB0YWtlIGVmZmVjdC5cbiAgICAgKiA8L3A+XG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEVOQUJMRV9TVEFDS0FCTEVfQUNUSU9OU1xuICAgICAqL1xuICAgIEVOQUJMRV9TVEFDS0FCTEVfQUNUSU9OUzogdHJ1ZSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gXG4gICAgICogVGhlIHRpbWVvdXQgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgYSB0b3VjaCBpcyBubyBsb25nZXIgYWN0aXZlIGFuZCBzaG91bGQgYmUgcmVtb3ZlZC5cbiAgICAgKiBUaGUgcmVhc29uIHRvIGFkZCB0aGlzIHRpbWVvdXQgaXMgZHVlIHRvIGFuIGlzc3VlIGluIFg1IGJyb3dzZXIgY29yZSwgXG4gICAgICogd2hlbiBYNSBpcyBwcmVzZW50ZWQgaW4gd2VjaGF0IG9uIEFuZHJvaWQsIGlmIGEgdG91Y2ggaXMgZ2xpc3NlZCBmcm9tIHRoZSBib3R0b20gdXAsIGFuZCBsZWF2ZSB0aGUgcGFnZSBhcmVhLFxuICAgICAqIG5vIHRvdWNoIGNhbmNlbCBldmVudCBpcyB0cmlnZ2VyZWQsIGFuZCB0aGUgdG91Y2ggd2lsbCBiZSBjb25zaWRlcmVkIGFjdGl2ZSBmb3JldmVyLiBcbiAgICAgKiBBZnRlciBtdWx0aXBsZSB0aW1lcyBvZiB0aGlzIGFjdGlvbiwgb3VyIG1heGltdW0gdG91Y2hlcyBudW1iZXIgd2lsbCBiZSByZWFjaGVkIGFuZCBhbGwgbmV3IHRvdWNoZXMgd2lsbCBiZSBpZ25vcmVkLlxuICAgICAqIFNvIHRoaXMgbmV3IG1lY2hhbmlzbSBjYW4gcmVtb3ZlIHRoZSB0b3VjaCB0aGF0IHNob3VsZCBiZSBpbmFjdGl2ZSBpZiBpdCdzIG5vdCB1cGRhdGVkIGR1cmluZyB0aGUgbGFzdCA1MDAwIG1pbGxpc2Vjb25kcy5cbiAgICAgKiBUaG91Z2ggaXQgbWlnaHQgcmVtb3ZlIGEgcmVhbCB0b3VjaCBpZiBpdCdzIGp1c3Qgbm90IG1vdmluZyBmb3IgdGhlIGxhc3QgNSBzZWNvbmRzIHdoaWNoIGlzIG5vdCBlYXN5IHdpdGggdGhlIHNlbnNpYmlsaXR5IG9mIG1vYmlsZSB0b3VjaCBzY3JlZW4uXG4gICAgICogWW91IGNhbiBtb2RpZnkgdGhpcyB2YWx1ZSB0byBoYXZlIGEgYmV0dGVyIGJlaGF2aW9yIGlmIHlvdSBmaW5kIGl0J3Mgbm90IGVub3VnaC5cbiAgICAgKiAhI3poXG4gICAgICog55So5LqO55SE5Yir5LiA5Liq6Kem54K55a+56LGh5piv5ZCm5bey57uP5aSx5pWI5bm25LiU5Y+v5Lul6KKr56e76Zmk55qE5bu25pe25pe26ZW/XG4gICAgICog5re75Yqg6L+Z5Liq5pe26ZW/55qE5Y6f5Zug5pivIFg1IOWGheaguOWcqOW+ruS/oea1j+iniOWZqOS4reWHuueOsOeahOS4gOS4qiBidWfjgIJcbiAgICAgKiDlnKjov5nkuKrnjq/looPkuIvvvIzlpoLmnpznlKjmiLflsIbkuIDkuKrop6bngrnku47lupXlkJHkuIrnp7vlh7rpobXpnaLljLrln5/vvIzlsIbkuI3kvJrop6blj5Hku7vkvZUgdG91Y2ggY2FuY2VsIOaIliB0b3VjaCBlbmQg5LqL5Lu277yM6ICM6L+Z5Liq6Kem54K55Lya6KKr5rC46L+c5b2T5L2c5YGc55WZ5Zyo6aG16Z2i5LiK55qE5pyJ5pWI6Kem54K544CCXG4gICAgICog6YeN5aSN6L+Z5qC35pON5L2c5Yeg5qyh5LmL5ZCO77yM5bGP5bmV5LiK55qE6Kem54K55pWw6YeP5bCG6L6+5Yiw5oiR5Lus55qE5LqL5Lu257O757uf5omA5pSv5oyB55qE5pyA6auY6Kem54K55pWw6YeP77yM5LmL5ZCO5omA5pyJ55qE6Kem5pG45LqL5Lu26YO95bCG6KKr5b+955Wl44CCXG4gICAgICog5omA5Lul6L+Z5Liq5paw55qE5py65Yi25Y+v5Lul5Zyo6Kem54K55Zyo5LiA5a6a5pe26Ze05YaF5rKh5pyJ5Lu75L2V5pu05paw55qE5oOF5Ya15LiL6KeG5Li65aSx5pWI6Kem54K55bm25LuO5LqL5Lu257O757uf5Lit56e76Zmk44CCXG4gICAgICog5b2T54S277yM6L+Z5Lmf5Y+v6IO956e76Zmk5LiA5Liq55yf5a6e55qE6Kem54K577yM5aaC5p6c55So5oi355qE6Kem54K555yf55qE5Zyo5LiA5a6a5pe26Ze05q615YaF5a6M5YWo5rKh5pyJ56e75Yqo77yI6L+Z5Zyo5b2T5YmN5omL5py65bGP5bmV55qE54G15pWP5bqm5LiL5Lya5b6I6Zq+77yJ44CCXG4gICAgICog5L2g5Y+v5Lul5L+u5pS56L+Z5Liq5YC85p2l6I635b6X5L2g6ZyA6KaB55qE5pWI5p6c77yM6buY6K6k5YC85pivIDUwMDAg5q+r56eS44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFRPVUNIX1RJTUVPVVRcbiAgICAgKi9cbiAgICBUT1VDSF9USU1FT1VUOiA1MDAwLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBcbiAgICAgKiBUaGUgbWF4aW11bSB2ZXJ0ZXggY291bnQgZm9yIGEgc2luZ2xlIGJhdGNoZWQgZHJhdyBjYWxsLlxuICAgICAqICEjemhcbiAgICAgKiDmnIDlpKflj6/ku6XooqvljZXmrKHmibnlpITnkIbmuLLmn5PnmoTpobbngrnmlbDph4/jgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gQkFUQ0hfVkVSVEVYX0NPVU5UXG4gICAgICovXG4gICAgQkFUQ0hfVkVSVEVYX0NPVU5UOiAyMDAwMCxcblxuICAgIC8qKlxuICAgICAqICEjZW4gXG4gICAgICogV2hldGhlciBvciBub3QgZW5hYmxlZCB0aWxlZCBtYXAgYXV0byBjdWxsaW5nLiBJZiB5b3Ugc2V0IHRoZSBUaWxlZE1hcCBza2V3IG9yIHJvdGF0aW9uLCB0aGVuIG5lZWQgdG8gbWFudWFsbHkgZGlzYWJsZSB0aGlzLCBvdGhlcndpc2UsIHRoZSByZW5kZXJpbmcgd2lsbCBiZSB3cm9uZy5cbiAgICAgKiAhI3poXG4gICAgICog5piv5ZCm5byA5ZCv55Om54mH5Zyw5Zu+55qE6Ieq5Yqo6KOB5YeP5Yqf6IO944CC55Om54mH5Zyw5Zu+5aaC5p6c6K6+572u5LqGIHNrZXcsIHJvdGF0aW9uIOeahOivne+8jOmcgOimgeaJi+WKqOWFs+mXre+8jOWQpuWImea4suafk+S8muWHuumUmeOAglxuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gRU5BQkxFX1RJTEVETUFQX0NVTExJTkdcbiAgICAgKiBAZGVmYXVsdCB0cnVlXG4gICAgICovXG4gICAgRU5BQkxFX1RJTEVETUFQX0NVTExJTkc6IHRydWUsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFxuICAgICAqIFRoZSBtYXggY29uY3VycmVudCB0YXNrIG51bWJlciBmb3IgdGhlIGRvd25sb2FkZXJcbiAgICAgKiAhI3poXG4gICAgICog5LiL6L295Lu75Yqh55qE5pyA5aSn5bm25Y+R5pWw6ZmQ5Yi277yM5Zyo5a6J5Y2T5bmz5Y+w6YOo5YiG5py65Z6L5oiW54mI5pys5LiK5Y+v6IO96ZyA6KaB6ZmQ5Yi25Zyo6L6D5L2O55qE5rC05bmzXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IERPV05MT0FEX01BWF9DT05DVVJSRU5UXG4gICAgICogQGRlZmF1bHQgNjRcbiAgICAgKi9cbiAgICBET1dOTE9BRF9NQVhfQ09OQ1VSUkVOVDogNjQsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFxuICAgICAqIEJvb2xlYW4gdGhhdCBpbmRpY2F0ZXMgaWYgdGhlIGNhbnZhcyBjb250YWlucyBhbiBhbHBoYSBjaGFubmVsLCBkZWZhdWx0IHNldHMgdG8gZmFsc2UgZm9yIGJldHRlciBwZXJmb3JtYW5jZS5cbiAgICAgKiBUaG91Z2ggaWYgeW91IHdhbnQgdG8gbWFrZSB5b3VyIGNhbnZhcyBiYWNrZ3JvdW5kIHRyYW5zcGFyZW50IGFuZCBzaG93IG90aGVyIGRvbSBlbGVtZW50cyBhdCB0aGUgYmFja2dyb3VuZCwgXG4gICAgICogeW91IGNhbiBzZXQgaXQgdG8gdHJ1ZSBiZWZvcmUgYGNjLmdhbWUucnVuYC5cbiAgICAgKiBXZWIgb25seS5cbiAgICAgKiAhI3poXG4gICAgICog55So5LqO6K6+572uIENhbnZhcyDog4zmma/mmK/lkKbmlK/mjIEgYWxwaGEg6YCa6YGT77yM6buY6K6k5Li6IGZhbHNl77yM6L+Z5qC35Y+v5Lul5pyJ5pu06auY55qE5oCn6IO96KGo546w44CCXG4gICAgICog5aaC5p6c5L2g5biM5pybIENhbnZhcyDog4zmma/mmK/pgI/mmI7nmoTvvIzlubbmmL7npLrog4zlkI7nmoTlhbbku5YgRE9NIOWFg+e0oO+8jOS9oOWPr+S7peWcqCBgY2MuZ2FtZS5ydW5gIOS5i+WJjeWwhui/meS4quWAvOiuvuS4uiB0cnVl44CCXG4gICAgICog5LuF5pSv5oyBIFdlYlxuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gRU5BQkxFX1RSQU5TUEFSRU5UX0NBTlZBU1xuICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICovXG4gICAgRU5BQkxFX1RSQU5TUEFSRU5UX0NBTlZBUzogZmFsc2UsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQm9vbGVhbiB0aGF0IGluZGljYXRlcyBpZiB0aGUgV2ViR0wgY29udGV4dCBpcyBjcmVhdGVkIHdpdGggYGFudGlhbGlhc2Agb3B0aW9uIHR1cm5lZCBvbiwgZGVmYXVsdCB2YWx1ZSBpcyBmYWxzZS5cbiAgICAgKiBTZXQgaXQgdG8gdHJ1ZSBjb3VsZCBtYWtlIHlvdXIgZ2FtZSBncmFwaGljcyBzbGlnaHRseSBzbW9vdGhlciwgbGlrZSB0ZXh0dXJlIGhhcmQgZWRnZXMgd2hlbiByb3RhdGVkLlxuICAgICAqIFdoZXRoZXIgdG8gdXNlIHRoaXMgcmVhbGx5IGRlcGVuZCBvbiB5b3VyIGdhbWUgZGVzaWduIGFuZCB0YXJnZXRlZCBwbGF0Zm9ybSwgXG4gICAgICogZGV2aWNlIHdpdGggcmV0aW5hIGRpc3BsYXkgdXN1YWxseSBoYXZlIGdvb2QgZGV0YWlsIG9uIGdyYXBoaWNzIHdpdGggb3Igd2l0aG91dCB0aGlzIG9wdGlvbiwgXG4gICAgICogeW91IHByb2JhYmx5IGRvbid0IHdhbnQgYW50aWFsaWFzIGlmIHlvdXIgZ2FtZSBzdHlsZSBpcyBwaXhlbCBhcnQgYmFzZWQuXG4gICAgICogQWxzbywgaXQgY291bGQgaGF2ZSBncmVhdCBwZXJmb3JtYW5jZSBpbXBhY3Qgd2l0aCBzb21lIGJyb3dzZXIgLyBkZXZpY2UgdXNpbmcgc29mdHdhcmUgTVNBQS5cbiAgICAgKiBZb3UgY2FuIHNldCBpdCB0byB0cnVlIGJlZm9yZSBgY2MuZ2FtZS5ydW5gLlxuICAgICAqIFdlYiBvbmx5LlxuICAgICAqICEjemhcbiAgICAgKiDnlKjkuo7orr7nva7lnKjliJvlu7ogV2ViR0wgQ29udGV4dCDml7bmmK/lkKblvIDlkK/mipfplK/pvb/pgInpobnvvIzpu5jorqTlgLzmmK8gZmFsc2XjgIJcbiAgICAgKiDlsIbov5nkuKrpgInpobnorr7nva7kuLogdHJ1ZSDkvJrorqnkvaDnmoTmuLjmiI/nlLvpnaLnqI3nqI3lubPmu5HkuIDkupvvvIzmr5TlpoLml4vovaznoazovrnotLTlm77ml7bnmoTplK/pvb/jgILmmK/lkKblvIDlkK/ov5nkuKrpgInpobnlvojlpKfnqIvluqbkuIrlj5blhrPkuo7kvaDnmoTmuLjmiI/lkozpnaLlkJHnmoTlubPlj7DjgIJcbiAgICAgKiDlnKjlpKflpJrmlbDmi6XmnIkgcmV0aW5hIOe6p+WIq+Wxj+W5leeahOiuvuWkh+S4iueUqOaIt+W+gOW+gOaXoOazleWMuuWIhui/meS4qumAiemhueW4puadpeeahOWPmOWMlu+8m+WmguaenOS9oOeahOa4uOaIj+mAieaLqeWDj+e0oOiJuuacr+mjjuagvO+8jOS9oOS5n+WkmuWNiuS4jeS8muaDs+W8gOWQr+i/meS4qumAiemhueOAglxuICAgICAqIOWQjOaXtu+8jOWcqOWwkemDqOWIhuS9v+eUqOi9r+S7tue6p+WIq+aKl+mUr+m9v+eul+azleeahOiuvuWkh+aIlua1j+iniOWZqOS4iu+8jOi/meS4qumAiemhueS8muWvueaAp+iDveS6p+eUn+avlOi+g+Wkp+eahOW9seWTjeOAglxuICAgICAqIOS9oOWPr+S7peWcqCBgY2MuZ2FtZS5ydW5gIOS5i+WJjeiuvue9rui/meS4quWAvO+8jOWQpuWImeWug+S4jeS8mueUn+aViOOAglxuICAgICAqIOS7heaUr+aMgSBXZWJcbiAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IEVOQUJMRV9XRUJHTF9BTlRJQUxJQVNcbiAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAqL1xuICAgIEVOQUJMRV9XRUJHTF9BTlRJQUxJQVM6IGZhbHNlLFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFdoZXRoZXIgb3Igbm90IGVuYWJsZSBhdXRvIGN1bGxpbmcuXG4gICAgICogVGhpcyBmZWF0dXJlIGhhdmUgYmVlbiByZW1vdmVkIGluIHYyLjAgbmV3IHJlbmRlcmVyIGR1ZSB0byBvdmVyYWxsIHBlcmZvcm1hbmNlIGNvbnN1bXB0aW9uLlxuICAgICAqIFdlIGhhdmUgbm8gcGxhbiBjdXJyZW50bHkgdG8gcmUtZW5hYmxlIGF1dG8gY3VsbGluZy5cbiAgICAgKiBJZiB5b3VyIGdhbWUgaGF2ZSBtb3JlIGR5bmFtaWMgb2JqZWN0cywgd2Ugc3VnZ2VzdCB0byBkaXNhYmxlIGF1dG8gY3VsbGluZy5cbiAgICAgKiBJZiB5b3VyIGdhbWUgaGF2ZSBtb3JlIHN0YXRpYyBvYmplY3RzLCB3ZSBzdWdnZXN0IHRvIGVuYWJsZSBhdXRvIGN1bGxpbmcuXG4gICAgICogISN6aFxuICAgICAqIOaYr+WQpuW8gOWQr+iHquWKqOijgeWHj+WKn+iDve+8jOW8gOWQr+ijgeWHj+WKn+iDveWwhuS8muaKiuWcqOWxj+W5leWklueahOeJqeS9k+S7jua4suafk+mYn+WIl+S4reWOu+mZpOaOieOAglxuICAgICAqIOi/meS4quWKn+iDveWcqCB2Mi4wIOeahOaWsOa4suafk+WZqOS4reiiq+enu+mZpOS6hu+8jOWboOS4uuWug+WcqOWkp+WkmuaVsOa4uOaIj+S4reaJgOW4puadpeeahOaNn+iAl+imgemrmOS6juaAp+iDveeahOaPkOWNh++8jOebruWJjeaIkeS7rOayoeacieiuoeWIkumHjeaWsOaUr+aMgeiHquWKqOijgeWJquOAglxuICAgICAqIOWmguaenOa4uOaIj+S4reeahOWKqOaAgeeJqeS9k+avlOi+g+WkmueahOivne+8jOW7uuiuruWwhuatpOmAiemhueWFs+mXreOAglxuICAgICAqIOWmguaenOa4uOaIj+S4reeahOmdmeaAgeeJqeS9k+avlOi+g+WkmueahOivne+8jOW7uuiuruWwhuatpOmAiemhueaJk+W8gOOAglxuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gRU5BQkxFX0NVTExJTkdcbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wXG4gICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgKi9cbiAgICBFTkFCTEVfQ1VMTElORzogZmFsc2UsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogV2hldGhlciBvciBub3QgY2xlYXIgZG9tIEltYWdlIG9iamVjdCBjYWNoZSBhZnRlciB1cGxvYWRpbmcgdG8gZ2wgdGV4dHVyZS5cbiAgICAgKiBDb25jcmV0ZWx5LCB3ZSBhcmUgc2V0dGluZyBpbWFnZS5zcmMgdG8gZW1wdHkgc3RyaW5nIHRvIHJlbGVhc2UgdGhlIGNhY2hlLlxuICAgICAqIE5vcm1hbGx5IHlvdSBkb24ndCBuZWVkIHRvIGVuYWJsZSB0aGlzIG9wdGlvbiwgYmVjYXVzZSBvbiB3ZWIgdGhlIEltYWdlIG9iamVjdCBkb2Vzbid0IGNvbnN1bWUgdG9vIG11Y2ggbWVtb3J5LlxuICAgICAqIEJ1dCBvbiBXZUNoYXQgR2FtZSBwbGF0Zm9ybSwgdGhlIGN1cnJlbnQgdmVyc2lvbiBjYWNoZSBkZWNvZGVkIGRhdGEgaW4gSW1hZ2Ugb2JqZWN0LCB3aGljaCBoYXMgaGlnaCBtZW1vcnkgdXNhZ2UuXG4gICAgICogU28gd2UgZW5hYmxlZCB0aGlzIG9wdGlvbiBieSBkZWZhdWx0IG9uIFdlQ2hhdCwgc28gdGhhdCB3ZSBjYW4gcmVsZWFzZSBJbWFnZSBjYWNoZSBpbW1lZGlhdGVseSBhZnRlciB1cGxvYWRlZCB0byBHUFUuXG4gICAgICogISN6aFxuICAgICAqIOaYr+WQpuWcqOWwhui0tOWbvuS4iuS8oOiHsyBHUFUg5LmL5ZCO5Yig6ZmkIERPTSBJbWFnZSDnvJPlrZjjgIJcbiAgICAgKiDlhbfkvZPmnaXor7TvvIzmiJHku6zpgJrov4forr7nva4gaW1hZ2Uuc3JjIOS4uuepuuWtl+espuS4suadpemHiuaUvui/memDqOWIhuWGheWtmOOAglxuICAgICAqIOato+W4uOaDheWGteS4i++8jOS9oOS4jemcgOimgeW8gOWQr+i/meS4qumAiemhue+8jOWboOS4uuWcqCB3ZWIg5bmz5Y+w77yMSW1hZ2Ug5a+56LGh5omA5Y2g55So55qE5YaF5a2Y5b6I5bCP44CCXG4gICAgICog5L2G5piv5Zyo5b6u5L+h5bCP5ri45oiP5bmz5Y+w55qE5b2T5YmN54mI5pys77yMSW1hZ2Ug5a+56LGh5Lya57yT5a2Y6Kej56CB5ZCO55qE5Zu+54mH5pWw5o2u77yM5a6D5omA5Y2g55So55qE5YaF5a2Y56m66Ze05b6I5aSn44CCXG4gICAgICog5omA5Lul5oiR5Lus5Zyo5b6u5L+h5bmz5Y+w6buY6K6k5byA5ZCv5LqG6L+Z5Liq6YCJ6aG577yM6L+Z5qC35oiR5Lus5bCx5Y+v5Lul5Zyo5LiK5LygIEdMIOi0tOWbvuS5i+WQjueri+WNs+mHiuaUviBJbWFnZSDlr7nosaHnmoTlhoXlrZjvvIzpgb/lhY3ov4fpq5jnmoTlhoXlrZjljaDnlKjjgIJcbiAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IENMRUFOVVBfSU1BR0VfQ0FDSEVcbiAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAqL1xuICAgIENMRUFOVVBfSU1BR0VfQ0FDSEU6IGZhbHNlLFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFdoZXRoZXIgb3Igbm90IHNob3cgbWVzaCB3aXJlIGZyYW1lLlxuICAgICAqICEjemhcbiAgICAgKiDmmK/lkKbmmL7npLrnvZHmoLznmoTnur/moYbjgIJcbiAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IFNIT1dfTUVTSF9XSVJFRlJBTUVcbiAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAqL1xuICAgIFNIT1dfTUVTSF9XSVJFRlJBTUU6IGZhbHNlLFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFdoZXRoZXIgb3Igbm90IHNob3cgbWVzaCBub3JtYWwuXG4gICAgICogISN6aFxuICAgICAqIOaYr+WQpuaYvuekuue9keagvOeahOazlee6v+OAglxuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gU0hPV19NRVNIX05PUk1BTFxuICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICovXG4gICAgU0hPV19NRVNIX05PUk1BTDogZmFsc2UsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogU2V0IGNjLlJvdGF0ZVRvL2NjLlJvdGF0ZUJ5IHJvdGF0ZSBkaXJlY3Rpb24uXG4gICAgICogSWYgbmVlZCBzZXQgcm90YXRlIHBvc2l0aXZlIGRpcmVjdGlvbiB0byBjb3VudGVyY2xvY2t3aXNlLCBwbGVhc2UgY2hhbmdlIHNldHRpbmcgdG8gOiBjYy5tYWNyby5ST1RBVEVfQUNUSU9OX0NDVyA9IHRydWU7XG4gICAgICogISN6aFxuICAgICAqIOiuvue9riBjYy5Sb3RhdGVUby9jYy5Sb3RhdGVCeSDnmoTml4vovazmlrnlkJHjgIJcbiAgICAgKiDlpoLmnpzpnIDopoHorr7nva7ml4vovaznmoTmraPmlrnlkJHkuLrpgIbml7bpkojmlrnlkJHvvIzor7forr7nva7pgInpobnkuLrvvJogY2MubWFjcm8uUk9UQVRFX0FDVElPTl9DQ1cgPSB0cnVlO1xuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gUk9UQVRFX0FDVElPTl9DQ1dcbiAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAqL1xuICAgIFJPVEFURV9BQ1RJT05fQ0NXOiBmYWxzZSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBXaGV0aGVyIHRvIGVuYWJsZSBtdWx0aS10b3VjaC5cbiAgICAgKiAhI3poXG4gICAgICog5piv5ZCm5byA5ZCv5aSa54K56Kem5pG4XG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSBFTkFCTEVfTVVMVElfVE9VQ0hcbiAgICAgKiBAZGVmYXVsdCB0cnVlXG4gICAgICovXG4gICAgRU5BQkxFX01VTFRJX1RPVUNIOiB0cnVlXG59O1xuXG5cbmxldCBTVVBQT1JUX1RFWFRVUkVfRk9STUFUUyA9IFsnLnBrbScsICcucHZyJywgJy53ZWJwJywgJy5qcGcnLCAnLmpwZWcnLCAnLmJtcCcsICcucG5nJ107XG5cbi8qKlxuICogIWVuXG4gKiBUaGUgaW1hZ2UgZm9ybWF0IHN1cHBvcnRlZCBieSB0aGUgZW5naW5lIGRlZmF1bHRzLCBhbmQgdGhlIHN1cHBvcnRlZCBmb3JtYXRzIG1heSBkaWZmZXIgaW4gZGlmZmVyZW50IGJ1aWxkIHBsYXRmb3JtcyBhbmQgZGV2aWNlIHR5cGVzLlxuICogQ3VycmVudGx5IGFsbCBwbGF0Zm9ybSBhbmQgZGV2aWNlIHN1cHBvcnQgWycud2VicCcsICcuanBnJywgJy5qcGVnJywgJy5ibXAnLCAnLnBuZyddLCBUaGUgaU9TIG1vYmlsZSBwbGF0Zm9ybSBhbHNvIHN1cHBvcnRzIHRoZSBQVlIgZm9ybWF044CCXG4gKiAhemhcbiAqIOW8leaTjum7mOiupOaUr+aMgeeahOWbvueJh+agvOW8j++8jOaUr+aMgeeahOagvOW8j+WPr+iDveWcqOS4jeWQjOeahOaehOW7uuW5s+WPsOWSjOiuvuWkh+exu+Wei+S4iuacieaJgOW3ruWIq+OAglxuICog55uu5YmN5omA5pyJ5bmz5Y+w5ZKM6K6+5aSH5pSv5oyB55qE5qC85byP5pyJIFsnLndlYnAnLCAnLmpwZycsICcuanBlZycsICcuYm1wJywgJy5wbmcnXS4g5Y+m5aSWIElvcyDmiYvmnLrlubPlj7Dov5jpop3lpJbmlK/mjIHkuoYgUFZSIOagvOW8j+OAglxuICogQHByb3BlcnR5IHtbU3RyaW5nXX0gU1VQUE9SVF9URVhUVVJFX0ZPUk1BVFNcbiAqL1xuY2MubWFjcm8uU1VQUE9SVF9URVhUVVJFX0ZPUk1BVFMgPSBTVVBQT1JUX1RFWFRVUkVfRk9STUFUUztcblxuXG4vKipcbiAqICEjZW4gS2V5IG1hcCBmb3Iga2V5Ym9hcmQgZXZlbnRcbiAqICEjemgg6ZSu55uY5LqL5Lu255qE5oyJ6ZSu5YC8XG4gKiBAZW51bSBtYWNyby5LRVlcbiAqIEBleGFtcGxlIHtAbGluayBjb2NvczJkL2NvcmUvcGxhdGZvcm0vQ0NDb21tb24vS0VZLmpzfVxuICovXG5jYy5tYWNyby5LRVkgPSB7XG4gICAgLyoqXG4gICAgICogISNlbiBOb25lXG4gICAgICogISN6aCDmsqHmnInliIbphY1cbiAgICAgKiBAcHJvcGVydHkgbm9uZVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgbm9uZTowLFxuXG4gICAgLy8gYW5kcm9pZFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGJhY2sga2V5XG4gICAgICogISN6aCDov5Tlm57plK5cbiAgICAgKiBAcHJvcGVydHkgYmFja1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgYmFjazo2LFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG1lbnUga2V5XG4gICAgICogISN6aCDoj5zljZXplK5cbiAgICAgKiBAcHJvcGVydHkgbWVudVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgbWVudToxOCxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGJhY2tzcGFjZSBrZXlcbiAgICAgKiAhI3poIOmAgOagvOmUrlxuICAgICAqIEBwcm9wZXJ0eSBiYWNrc3BhY2VcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGJhY2tzcGFjZTo4LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgdGFiIGtleVxuICAgICAqICEjemggVGFiIOmUrlxuICAgICAqIEBwcm9wZXJ0eSB0YWJcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRhYjo5LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZW50ZXIga2V5XG4gICAgICogISN6aCDlm57ovabplK5cbiAgICAgKiBAcHJvcGVydHkgZW50ZXJcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGVudGVyOjEzLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgc2hpZnQga2V5XG4gICAgICogISN6aCBTaGlmdCDplK5cbiAgICAgKiBAcHJvcGVydHkgc2hpZnRcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHNoaWZ0OjE2LCAvL3Nob3VsZCB1c2Ugc2hpZnRrZXkgaW5zdGVhZFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgY3RybCBrZXlcbiAgICAgKiAhI3poIEN0cmwg6ZSuXG4gICAgICogQHByb3BlcnR5IGN0cmxcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGN0cmw6MTcsIC8vc2hvdWxkIHVzZSBjdHJsa2V5XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBhbHQga2V5XG4gICAgICogISN6aCBBbHQg6ZSuXG4gICAgICogQHByb3BlcnR5IGFsdFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgYWx0OjE4LCAvL3Nob3VsZCB1c2UgYWx0a2V5XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBwYXVzZSBrZXlcbiAgICAgKiAhI3poIOaaguWBnOmUrlxuICAgICAqIEBwcm9wZXJ0eSBwYXVzZVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgcGF1c2U6MTksXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBjYXBzIGxvY2sga2V5XG4gICAgICogISN6aCDlpKflhpnplIHlrprplK5cbiAgICAgKiBAcHJvcGVydHkgY2Fwc2xvY2tcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGNhcHNsb2NrOjIwLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZXNjIGtleVxuICAgICAqICEjemggRVNDIOmUrlxuICAgICAqIEBwcm9wZXJ0eSBlc2NhcGVcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGVzY2FwZToyNyxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHNwYWNlIGtleVxuICAgICAqICEjemgg56m65qC86ZSuXG4gICAgICogQHByb3BlcnR5IHNwYWNlXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBzcGFjZTozMixcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHBhZ2UgdXAga2V5XG4gICAgICogISN6aCDlkJHkuIrnv7vpobXplK5cbiAgICAgKiBAcHJvcGVydHkgcGFnZXVwXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBwYWdldXA6MzMsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBwYWdlIGRvd24ga2V5XG4gICAgICogISN6aCDlkJHkuIvnv7vpobXplK5cbiAgICAgKiBAcHJvcGVydHkgcGFnZWRvd25cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHBhZ2Vkb3duOjM0LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZW5kIGtleVxuICAgICAqICEjemgg57uT5p2f6ZSuXG4gICAgICogQHByb3BlcnR5IGVuZFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgZW5kOjM1LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgaG9tZSBrZXlcbiAgICAgKiAhI3poIOS4u+iPnOWNlemUrlxuICAgICAqIEBwcm9wZXJ0eSBob21lXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBob21lOjM2LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgbGVmdCBrZXlcbiAgICAgKiAhI3poIOWQkeW3pueureWktOmUrlxuICAgICAqIEBwcm9wZXJ0eSBsZWZ0XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBsZWZ0OjM3LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgdXAga2V5XG4gICAgICogISN6aCDlkJHkuIrnrq3lpLTplK5cbiAgICAgKiBAcHJvcGVydHkgdXBcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHVwOjM4LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgcmlnaHQga2V5XG4gICAgICogISN6aCDlkJHlj7Pnrq3lpLTplK5cbiAgICAgKiBAcHJvcGVydHkgcmlnaHRcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHJpZ2h0OjM5LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZG93biBrZXlcbiAgICAgKiAhI3poIOWQkeS4i+eureWktOmUrlxuICAgICAqIEBwcm9wZXJ0eSBkb3duXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBkb3duOjQwLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgc2VsZWN0IGtleVxuICAgICAqICEjemggU2VsZWN0IOmUrlxuICAgICAqIEBwcm9wZXJ0eSBzZWxlY3RcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHNlbGVjdDo0MSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGluc2VydCBrZXlcbiAgICAgKiAhI3poIOaPkuWFpemUrlxuICAgICAqIEBwcm9wZXJ0eSBpbnNlcnRcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGluc2VydDo0NSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIERlbGV0ZSBrZXlcbiAgICAgKiAhI3poIOWIoOmZpOmUrlxuICAgICAqIEBwcm9wZXJ0eSBEZWxldGVcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIERlbGV0ZTo0NixcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlICcwJyBrZXkgb24gdGhlIHRvcCBvZiB0aGUgYWxwaGFudW1lcmljIGtleWJvYXJkLlxuICAgICAqICEjemgg5a2X5q+N6ZSu55uY5LiK55qEIDAg6ZSuXG4gICAgICogQHByb3BlcnR5IDBcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIDA6NDgsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSAnMScga2V5IG9uIHRoZSB0b3Agb2YgdGhlIGFscGhhbnVtZXJpYyBrZXlib2FyZC5cbiAgICAgKiAhI3poIOWtl+avjemUruebmOS4iueahCAxIOmUrlxuICAgICAqIEBwcm9wZXJ0eSAxXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICAxOjQ5LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgJzInIGtleSBvbiB0aGUgdG9wIG9mIHRoZSBhbHBoYW51bWVyaWMga2V5Ym9hcmQuXG4gICAgICogISN6aCDlrZfmr43plK7nm5jkuIrnmoQgMiDplK5cbiAgICAgKiBAcHJvcGVydHkgMlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgMjo1MCxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlICczJyBrZXkgb24gdGhlIHRvcCBvZiB0aGUgYWxwaGFudW1lcmljIGtleWJvYXJkLlxuICAgICAqICEjemgg5a2X5q+N6ZSu55uY5LiK55qEIDMg6ZSuXG4gICAgICogQHByb3BlcnR5IDNcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIDM6NTEsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSAnNCcga2V5IG9uIHRoZSB0b3Agb2YgdGhlIGFscGhhbnVtZXJpYyBrZXlib2FyZC5cbiAgICAgKiAhI3poIOWtl+avjemUruebmOS4iueahCA0IOmUrlxuICAgICAqIEBwcm9wZXJ0eSA0XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICA0OjUyLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgJzUnIGtleSBvbiB0aGUgdG9wIG9mIHRoZSBhbHBoYW51bWVyaWMga2V5Ym9hcmQuXG4gICAgICogISN6aCDlrZfmr43plK7nm5jkuIrnmoQgNSDplK5cbiAgICAgKiBAcHJvcGVydHkgNVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgNTo1MyxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlICc2JyBrZXkgb24gdGhlIHRvcCBvZiB0aGUgYWxwaGFudW1lcmljIGtleWJvYXJkLlxuICAgICAqICEjemgg5a2X5q+N6ZSu55uY5LiK55qEIDYg6ZSuXG4gICAgICogQHByb3BlcnR5IDZcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIDY6NTQsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSAnNycga2V5IG9uIHRoZSB0b3Agb2YgdGhlIGFscGhhbnVtZXJpYyBrZXlib2FyZC5cbiAgICAgKiAhI3poIOWtl+avjemUruebmOS4iueahCA3IOmUrlxuICAgICAqIEBwcm9wZXJ0eSA3XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICA3OjU1LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgJzgnIGtleSBvbiB0aGUgdG9wIG9mIHRoZSBhbHBoYW51bWVyaWMga2V5Ym9hcmQuXG4gICAgICogISN6aCDlrZfmr43plK7nm5jkuIrnmoQgOCDplK5cbiAgICAgKiBAcHJvcGVydHkgOFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgODo1NixcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlICc5JyBrZXkgb24gdGhlIHRvcCBvZiB0aGUgYWxwaGFudW1lcmljIGtleWJvYXJkLlxuICAgICAqICEjemgg5a2X5q+N6ZSu55uY5LiK55qEIDkg6ZSuXG4gICAgICogQHByb3BlcnR5IDlcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIDk6NTcsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBhIGtleVxuICAgICAqICEjemggQSDplK5cbiAgICAgKiBAcHJvcGVydHkgYVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgYTo2NSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGIga2V5XG4gICAgICogISN6aCBCIOmUrlxuICAgICAqIEBwcm9wZXJ0eSBiXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBiOjY2LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgYyBrZXlcbiAgICAgKiAhI3poIEMg6ZSuXG4gICAgICogQHByb3BlcnR5IGNcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGM6NjcsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBkIGtleVxuICAgICAqICEjemggRCDplK5cbiAgICAgKiBAcHJvcGVydHkgZFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgZDo2OCxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGUga2V5XG4gICAgICogISN6aCBFIOmUrlxuICAgICAqIEBwcm9wZXJ0eSBlXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBlOjY5LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZiBrZXlcbiAgICAgKiAhI3poIEYg6ZSuXG4gICAgICogQHByb3BlcnR5IGZcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGY6NzAsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBnIGtleVxuICAgICAqICEjemggRyDplK5cbiAgICAgKiBAcHJvcGVydHkgZ1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgZzo3MSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGgga2V5XG4gICAgICogISN6aCBIIOmUrlxuICAgICAqIEBwcm9wZXJ0eSBoXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBoOjcyLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgaSBrZXlcbiAgICAgKiAhI3poIEkg6ZSuXG4gICAgICogQHByb3BlcnR5IGlcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGk6NzMsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBqIGtleVxuICAgICAqICEjemggSiDplK5cbiAgICAgKiBAcHJvcGVydHkgalxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgajo3NCxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGsga2V5XG4gICAgICogISN6aCBLIOmUrlxuICAgICAqIEBwcm9wZXJ0eSBrXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBrOjc1LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgbCBrZXlcbiAgICAgKiAhI3poIEwg6ZSuXG4gICAgICogQHByb3BlcnR5IGxcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGw6NzYsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBtIGtleVxuICAgICAqICEjemggTSDplK5cbiAgICAgKiBAcHJvcGVydHkgbVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgbTo3NyxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG4ga2V5XG4gICAgICogISN6aCBOIOmUrlxuICAgICAqIEBwcm9wZXJ0eSBuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBuOjc4LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgbyBrZXlcbiAgICAgKiAhI3poIE8g6ZSuXG4gICAgICogQHByb3BlcnR5IG9cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIG86NzksXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBwIGtleVxuICAgICAqICEjemggUCDplK5cbiAgICAgKiBAcHJvcGVydHkgcFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgcDo4MCxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHEga2V5XG4gICAgICogISN6aCBRIOmUrlxuICAgICAqIEBwcm9wZXJ0eSBxXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBxOjgxLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgciBrZXlcbiAgICAgKiAhI3poIFIg6ZSuXG4gICAgICogQHByb3BlcnR5IHJcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHI6ODIsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBzIGtleVxuICAgICAqICEjemggUyDplK5cbiAgICAgKiBAcHJvcGVydHkgc1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgczo4MyxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHQga2V5XG4gICAgICogISN6aCBUIOmUrlxuICAgICAqIEBwcm9wZXJ0eSB0XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB0Ojg0LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgdSBrZXlcbiAgICAgKiAhI3poIFUg6ZSuXG4gICAgICogQHByb3BlcnR5IHVcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHU6ODUsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSB2IGtleVxuICAgICAqICEjemggViDplK5cbiAgICAgKiBAcHJvcGVydHkgdlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgdjo4NixcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHcga2V5XG4gICAgICogISN6aCBXIOmUrlxuICAgICAqIEBwcm9wZXJ0eSB3XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB3Ojg3LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgeCBrZXlcbiAgICAgKiAhI3poIFgg6ZSuXG4gICAgICogQHByb3BlcnR5IHhcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHg6ODgsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSB5IGtleVxuICAgICAqICEjemggWSDplK5cbiAgICAgKiBAcHJvcGVydHkgeVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgeTo4OSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHoga2V5XG4gICAgICogISN6aCBaIOmUrlxuICAgICAqIEBwcm9wZXJ0eSB6XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB6OjkwLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgbnVtZXJpYyBrZXlwYWQgMFxuICAgICAqICEjemgg5pWw5a2X6ZSu55uYIDBcbiAgICAgKiBAcHJvcGVydHkgbnVtMFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgbnVtMDo5NixcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG51bWVyaWMga2V5cGFkIDFcbiAgICAgKiAhI3poIOaVsOWtl+mUruebmCAxXG4gICAgICogQHByb3BlcnR5IG51bTFcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIG51bTE6OTcsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBudW1lcmljIGtleXBhZCAyXG4gICAgICogISN6aCDmlbDlrZfplK7nm5ggMlxuICAgICAqIEBwcm9wZXJ0eSBudW0yXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBudW0yOjk4LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgbnVtZXJpYyBrZXlwYWQgM1xuICAgICAqICEjemgg5pWw5a2X6ZSu55uYIDNcbiAgICAgKiBAcHJvcGVydHkgbnVtM1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgbnVtMzo5OSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG51bWVyaWMga2V5cGFkIDRcbiAgICAgKiAhI3poIOaVsOWtl+mUruebmCA0XG4gICAgICogQHByb3BlcnR5IG51bTRcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIG51bTQ6MTAwLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgbnVtZXJpYyBrZXlwYWQgNVxuICAgICAqICEjemgg5pWw5a2X6ZSu55uYIDVcbiAgICAgKiBAcHJvcGVydHkgbnVtNVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgbnVtNToxMDEsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBudW1lcmljIGtleXBhZCA2XG4gICAgICogISN6aCDmlbDlrZfplK7nm5ggNlxuICAgICAqIEBwcm9wZXJ0eSBudW02XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBudW02OjEwMixcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG51bWVyaWMga2V5cGFkIDdcbiAgICAgKiAhI3poIOaVsOWtl+mUruebmCA3XG4gICAgICogQHByb3BlcnR5IG51bTdcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIG51bTc6MTAzLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgbnVtZXJpYyBrZXlwYWQgOFxuICAgICAqICEjemgg5pWw5a2X6ZSu55uYIDhcbiAgICAgKiBAcHJvcGVydHkgbnVtOFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgbnVtODoxMDQsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBudW1lcmljIGtleXBhZCA5XG4gICAgICogISN6aCDmlbDlrZfplK7nm5ggOVxuICAgICAqIEBwcm9wZXJ0eSBudW05XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBudW05OjEwNSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG51bWVyaWMga2V5cGFkICcqJ1xuICAgICAqICEjemgg5pWw5a2X6ZSu55uYICpcbiAgICAgKiBAcHJvcGVydHkgKlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgJyonOjEwNixcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG51bWVyaWMga2V5cGFkICcrJ1xuICAgICAqICEjemgg5pWw5a2X6ZSu55uYICtcbiAgICAgKiBAcHJvcGVydHkgK1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgJysnOjEwNyxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG51bWVyaWMga2V5cGFkICctJ1xuICAgICAqICEjemgg5pWw5a2X6ZSu55uYIC1cbiAgICAgKiBAcHJvcGVydHkgLVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgJy0nOjEwOSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIG51bWVyaWMga2V5cGFkICdkZWxldGUnXG4gICAgICogISN6aCDmlbDlrZfplK7nm5jliKDpmaTplK5cbiAgICAgKiBAcHJvcGVydHkgbnVtZGVsXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICAnbnVtZGVsJzoxMTAsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBudW1lcmljIGtleXBhZCAnLydcbiAgICAgKiAhI3poIOaVsOWtl+mUruebmCAvXG4gICAgICogQHByb3BlcnR5IC9cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgICcvJzoxMTEsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBGMSBmdW5jdGlvbiBrZXlcbiAgICAgKiAhI3poIEYxIOWKn+iDvemUrlxuICAgICAqIEBwcm9wZXJ0eSBmMVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgZjE6MTEyLCAvL2YxLWYxMiBkb250IHdvcmsgb24gaWVcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIEYyIGZ1bmN0aW9uIGtleVxuICAgICAqICEjemggRjIg5Yqf6IO96ZSuXG4gICAgICogQHByb3BlcnR5IGYyXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBmMjoxMTMsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBGMyBmdW5jdGlvbiBrZXlcbiAgICAgKiAhI3poIEYzIOWKn+iDvemUrlxuICAgICAqIEBwcm9wZXJ0eSBmM1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgZjM6MTE0LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgRjQgZnVuY3Rpb24ga2V5XG4gICAgICogISN6aCBGNCDlip/og73plK5cbiAgICAgKiBAcHJvcGVydHkgZjRcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGY0OjExNSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIEY1IGZ1bmN0aW9uIGtleVxuICAgICAqICEjemggRjUg5Yqf6IO96ZSuXG4gICAgICogQHByb3BlcnR5IGY1XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBmNToxMTYsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBGNiBmdW5jdGlvbiBrZXlcbiAgICAgKiAhI3poIEY2IOWKn+iDvemUrlxuICAgICAqIEBwcm9wZXJ0eSBmNlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgZjY6MTE3LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgRjcgZnVuY3Rpb24ga2V5XG4gICAgICogISN6aCBGNyDlip/og73plK5cbiAgICAgKiBAcHJvcGVydHkgZjdcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGY3OjExOCxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIEY4IGZ1bmN0aW9uIGtleVxuICAgICAqICEjemggRjgg5Yqf6IO96ZSuXG4gICAgICogQHByb3BlcnR5IGY4XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBmODoxMTksXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBGOSBmdW5jdGlvbiBrZXlcbiAgICAgKiAhI3poIEY5IOWKn+iDvemUrlxuICAgICAqIEBwcm9wZXJ0eSBmOVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgZjk6MTIwLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgRjEwIGZ1bmN0aW9uIGtleVxuICAgICAqICEjemggRjEwIOWKn+iDvemUrlxuICAgICAqIEBwcm9wZXJ0eSBmMTBcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGYxMDoxMjEsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBGMTEgZnVuY3Rpb24ga2V5XG4gICAgICogISN6aCBGMTEg5Yqf6IO96ZSuXG4gICAgICogQHByb3BlcnR5IGYxMVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgZjExOjEyMixcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIEYxMiBmdW5jdGlvbiBrZXlcbiAgICAgKiAhI3poIEYxMiDlip/og73plK5cbiAgICAgKiBAcHJvcGVydHkgZjEyXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBmMTI6MTIzLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgbnVtbG9jayBrZXlcbiAgICAgKiAhI3poIOaVsOWtl+mUgeWumumUrlxuICAgICAqIEBwcm9wZXJ0eSBudW1sb2NrXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBudW1sb2NrOjE0NCxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHNjcm9sbCBsb2NrIGtleVxuICAgICAqICEjemgg5rua5Yqo6ZSB5a6a6ZSuXG4gICAgICogQHByb3BlcnR5IHNjcm9sbGxvY2tcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHNjcm9sbGxvY2s6MTQ1LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgJzsnIGtleS5cbiAgICAgKiAhI3poIOWIhuWPt+mUrlxuICAgICAqIEBwcm9wZXJ0eSA7XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICAnOyc6MTg2LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgJzsnIGtleS5cbiAgICAgKiAhI3poIOWIhuWPt+mUrlxuICAgICAqIEBwcm9wZXJ0eSBzZW1pY29sb25cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHNlbWljb2xvbjoxODYsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSAnPScga2V5LlxuICAgICAqICEjemgg562J5LqO5Y+36ZSuXG4gICAgICogQHByb3BlcnR5IGVxdWFsXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBlcXVhbDoxODcsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSAnPScga2V5LlxuICAgICAqICEjemgg562J5LqO5Y+36ZSuXG4gICAgICogQHByb3BlcnR5ID1cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgICc9JzoxODcsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSAnLCcga2V5LlxuICAgICAqICEjemgg6YCX5Y+36ZSuXG4gICAgICogQHByb3BlcnR5ICxcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgICcsJzoxODgsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSAnLCcga2V5LlxuICAgICAqICEjemgg6YCX5Y+36ZSuXG4gICAgICogQHByb3BlcnR5IGNvbW1hXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBjb21tYToxODgsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBkYXNoICctJyBrZXkuXG4gICAgICogISN6aCDkuK3liJLnur/plK5cbiAgICAgKiBAcHJvcGVydHkgZGFzaFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgZGFzaDoxODksXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSAnLicga2V5LlxuICAgICAqICEjemgg5Y+l5Y+36ZSuXG4gICAgICogQHByb3BlcnR5IC5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgICcuJzoxOTAsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSAnLicga2V5XG4gICAgICogISN6aCDlj6Xlj7fplK5cbiAgICAgKiBAcHJvcGVydHkgcGVyaW9kXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBwZXJpb2Q6MTkwLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZm9yd2FyZCBzbGFzaCBrZXlcbiAgICAgKiAhI3poIOato+aWnOadoOmUrlxuICAgICAqIEBwcm9wZXJ0eSBmb3J3YXJkc2xhc2hcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGZvcndhcmRzbGFzaDoxOTEsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBncmF2ZSBrZXlcbiAgICAgKiAhI3poIOaMiemUriBgXG4gICAgICogQHByb3BlcnR5IGdyYXZlXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBncmF2ZToxOTIsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSAnWycga2V5XG4gICAgICogISN6aCDmjInplK4gW1xuICAgICAqIEBwcm9wZXJ0eSBbXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICAnWyc6MjE5LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgJ1snIGtleVxuICAgICAqICEjemgg5oyJ6ZSuIFtcbiAgICAgKiBAcHJvcGVydHkgb3BlbmJyYWNrZXRcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIG9wZW5icmFja2V0OjIxOSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlICdcXCcga2V5XG4gICAgICogISN6aCDlj43mlpzmnaDplK5cbiAgICAgKiBAcHJvcGVydHkgYmFja3NsYXNoXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBiYWNrc2xhc2g6MjIwLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgJ10nIGtleVxuICAgICAqICEjemgg5oyJ6ZSuIF1cbiAgICAgKiBAcHJvcGVydHkgXVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgJ10nOjIyMSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlICddJyBrZXlcbiAgICAgKiAhI3poIOaMiemUriBdXG4gICAgICogQHByb3BlcnR5IGNsb3NlYnJhY2tldFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgY2xvc2VicmFja2V0OjIyMSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHF1b3RlIGtleVxuICAgICAqICEjemgg5Y2V5byV5Y+36ZSuXG4gICAgICogQHByb3BlcnR5IHF1b3RlXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBxdW90ZToyMjIsXG5cbiAgICAvLyBnYW1lcGFkIGNvbnRyb2xsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBkcGFkIGxlZnQga2V5XG4gICAgICogISN6aCDlr7zoiKrplK4g5ZCR5bemXG4gICAgICogQHByb3BlcnR5IGRwYWRMZWZ0XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBkcGFkTGVmdDoxMDAwLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZHBhZCByaWdodCBrZXlcbiAgICAgKiAhI3poIOWvvOiIqumUriDlkJHlj7NcbiAgICAgKiBAcHJvcGVydHkgZHBhZFJpZ2h0XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBkcGFkUmlnaHQ6MTAwMSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGRwYWQgdXAga2V5XG4gICAgICogISN6aCDlr7zoiKrplK4g5ZCR5LiKXG4gICAgICogQHByb3BlcnR5IGRwYWRVcFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgZHBhZFVwOjEwMDMsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBkcGFkIGRvd24ga2V5XG4gICAgICogISN6aCDlr7zoiKrplK4g5ZCR5LiLXG4gICAgICogQHByb3BlcnR5IGRwYWREb3duXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBkcGFkRG93bjoxMDA0LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZHBhZCBjZW50ZXIga2V5XG4gICAgICogISN6aCDlr7zoiKrplK4g56Gu5a6a6ZSuXG4gICAgICogQHByb3BlcnR5IGRwYWRDZW50ZXJcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIGRwYWRDZW50ZXI6MTAwNVxufTtcblxuLyoqXG4gKiBJbWFnZSBmb3JtYXRzXG4gKiBAZW51bSBtYWNyby5JbWFnZUZvcm1hdFxuICovXG5jYy5tYWNyby5JbWFnZUZvcm1hdCA9IGNjLkVudW0oe1xuICAgIC8qKlxuICAgICAqIEltYWdlIEZvcm1hdDpKUEdcbiAgICAgKiBAcHJvcGVydHkgSlBHXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBKUEc6IDAsXG4gICAgLyoqXG4gICAgICogSW1hZ2UgRm9ybWF0OlBOR1xuICAgICAqIEBwcm9wZXJ0eSBQTkdcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFBORzogMSxcbiAgICAvKipcbiAgICAgKiBJbWFnZSBGb3JtYXQ6VElGRlxuICAgICAqIEBwcm9wZXJ0eSBUSUZGXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBUSUZGOiAyLFxuICAgIC8qKlxuICAgICAqIEltYWdlIEZvcm1hdDpXRUJQXG4gICAgICogQHByb3BlcnR5IFdFQlBcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFdFQlA6IDMsXG4gICAgLyoqXG4gICAgICogSW1hZ2UgRm9ybWF0OlBWUlxuICAgICAqIEBwcm9wZXJ0eSBQVlJcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFBWUjogNCxcbiAgICAvKipcbiAgICAgKiBJbWFnZSBGb3JtYXQ6RVRDXG4gICAgICogQHByb3BlcnR5IEVUQ1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgRVRDOiA1LFxuICAgIC8qKlxuICAgICAqIEltYWdlIEZvcm1hdDpTM1RDXG4gICAgICogQHByb3BlcnR5IFMzVENcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFMzVEM6IDYsXG4gICAgLyoqXG4gICAgICogSW1hZ2UgRm9ybWF0OkFUSVRDXG4gICAgICogQHByb3BlcnR5IEFUSVRDXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBBVElUQzogNyxcbiAgICAvKipcbiAgICAgKiBJbWFnZSBGb3JtYXQ6VEdBXG4gICAgICogQHByb3BlcnR5IFRHQVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgVEdBOiA4LFxuICAgIC8qKlxuICAgICAqIEltYWdlIEZvcm1hdDpSQVdEQVRBXG4gICAgICogQHByb3BlcnR5IFJBV0RBVEFcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFJBV0RBVEE6IDksXG4gICAgLyoqXG4gICAgICogSW1hZ2UgRm9ybWF0OlVOS05PV05cbiAgICAgKiBAcHJvcGVydHkgVU5LTk9XTlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgVU5LTk9XTjogMTBcbn0pO1xuXG4vKipcbiAqICEjZW5cbiAqIEVudW0gZm9yIGJsZW5kIGZhY3RvclxuICogUmVmZXIgdG86IGh0dHA6Ly93d3cuYW5kZXJzcmlnZ2Vsc2VuLmRrL2dsYmxlbmRmdW5jLnBocFxuICogISN6aFxuICog5re35ZCI5Zug5a2QXG4gKiDlj6/lj4LogIM6IGh0dHA6Ly93d3cuYW5kZXJzcmlnZ2Vsc2VuLmRrL2dsYmxlbmRmdW5jLnBocFxuICogQGVudW0gbWFjcm8uQmxlbmRGYWN0b3JcbiAqL1xuY2MubWFjcm8uQmxlbmRGYWN0b3IgPSBjYy5FbnVtKHtcbiAgICAvKipcbiAgICAgKiAhI2VuIEFsbCB1c2VcbiAgICAgKiAhI3poIOWFqOmDqOS9v+eUqFxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBPTkVcbiAgICAgKi9cbiAgICBPTkU6ICAgICAgICAgICAgICAgICAgICAxLCAgLy9jYy5tYWNyby5PTkVcbiAgICAvKipcbiAgICAgKiAhI2VuIE5vdCBhbGxcbiAgICAgKiAhI3poIOWFqOmDqOS4jeeUqFxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBaRVJPXG4gICAgICovXG4gICAgWkVSTzogICAgICAgICAgICAgICAgICAgMCwgICAgICAvL2NjLlpFUk9cbiAgICAvKipcbiAgICAgKiAhI2VuIFVzaW5nIHRoZSBzb3VyY2UgYWxwaGFcbiAgICAgKiAhI3poIOS9v+eUqOa6kOminOiJsueahOmAj+aYjuW6plxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBTUkNfQUxQSEFcbiAgICAgKi9cbiAgICBTUkNfQUxQSEE6ICAgICAgICAgICAgICAweDMwMiwgIC8vY2MuU1JDX0FMUEhBXG4gICAgLyoqXG4gICAgICogISNlbiBVc2luZyB0aGUgc291cmNlIGNvbG9yXG4gICAgICogISN6aCDkvb/nlKjmupDpopzoibJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gU1JDX0NPTE9SXG4gICAgICovXG4gICAgU1JDX0NPTE9SOiAgICAgICAgICAgICAgMHgzMDAsICAvL2NjLlNSQ19DT0xPUlxuICAgIC8qKlxuICAgICAqICEjZW4gVXNpbmcgdGhlIHRhcmdldCBhbHBoYVxuICAgICAqICEjemgg5L2/55So55uu5qCH6aKc6Imy55qE6YCP5piO5bqmXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IERTVF9BTFBIQVxuICAgICAqL1xuICAgIERTVF9BTFBIQTogICAgICAgICAgICAgIDB4MzA0LCAgLy9jYy5EU1RfQUxQSEFcbiAgICAvKipcbiAgICAgKiAhI2VuIFVzaW5nIHRoZSB0YXJnZXQgY29sb3JcbiAgICAgKiAhI3poIOS9v+eUqOebruagh+minOiJslxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBEU1RfQ09MT1JcbiAgICAgKi9cbiAgICBEU1RfQ09MT1I6ICAgICAgICAgICAgICAweDMwNiwgIC8vY2MuRFNUX0NPTE9SXG4gICAgLyoqXG4gICAgICogISNlbiBNaW51cyB0aGUgc291cmNlIGFscGhhXG4gICAgICogISN6aCDlh4/ljrvmupDpopzoibLnmoTpgI/mmI7luqZcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gT05FX01JTlVTX1NSQ19BTFBIQVxuICAgICAqL1xuICAgIE9ORV9NSU5VU19TUkNfQUxQSEE6ICAgIDB4MzAzLCAgLy9jYy5PTkVfTUlOVVNfU1JDX0FMUEhBXG4gICAgLyoqXG4gICAgICogISNlbiBNaW51cyB0aGUgc291cmNlIGNvbG9yXG4gICAgICogISN6aCDlh4/ljrvmupDpopzoibJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gT05FX01JTlVTX1NSQ19DT0xPUlxuICAgICAqL1xuICAgIE9ORV9NSU5VU19TUkNfQ09MT1I6ICAgIDB4MzAxLCAgLy9jYy5PTkVfTUlOVVNfU1JDX0NPTE9SXG4gICAgLyoqXG4gICAgICogISNlbiBNaW51cyB0aGUgdGFyZ2V0IGFscGhhXG4gICAgICogISN6aCDlh4/ljrvnm67moIfpopzoibLnmoTpgI/mmI7luqZcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gT05FX01JTlVTX0RTVF9BTFBIQVxuICAgICAqL1xuICAgIE9ORV9NSU5VU19EU1RfQUxQSEE6ICAgIDB4MzA1LCAgLy9jYy5PTkVfTUlOVVNfRFNUX0FMUEhBXG4gICAgLyoqXG4gICAgICogISNlbiBNaW51cyB0aGUgdGFyZ2V0IGNvbG9yXG4gICAgICogISN6aCDlh4/ljrvnm67moIfpopzoibJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gT05FX01JTlVTX0RTVF9DT0xPUlxuICAgICAqL1xuICAgIE9ORV9NSU5VU19EU1RfQ09MT1I6ICAgIDB4MzA3LCAgLy9jYy5PTkVfTUlOVVNfRFNUX0NPTE9SXG59KTtcblxuLyoqXG4gKiBAZW51bSBtYWNyby5UZXh0QWxpZ25tZW50XG4gKi9cbmNjLm1hY3JvLlRleHRBbGlnbm1lbnQgPSBjYy5FbnVtKHtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gTEVGVFxuICAgICAqL1xuICAgIExFRlQ6IDAsXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IENFTlRFUlxuICAgICAqL1xuICAgIENFTlRFUjogMSxcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gUklHSFRcbiAgICAgKi9cbiAgICBSSUdIVDogMlxufSk7XG5cbi8qKlxuICogQGVudW0gVmVydGljYWxUZXh0QWxpZ25tZW50XG4gKi9cbmNjLm1hY3JvLlZlcnRpY2FsVGV4dEFsaWdubWVudCA9IGNjLkVudW0oe1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBUT1BcbiAgICAgKi9cbiAgICBUT1A6IDAsXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IENFTlRFUlxuICAgICAqL1xuICAgIENFTlRFUjogMSxcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gQk9UVE9NXG4gICAgICovXG4gICAgQk9UVE9NOiAyXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBjYy5tYWNybztcbiJdfQ==