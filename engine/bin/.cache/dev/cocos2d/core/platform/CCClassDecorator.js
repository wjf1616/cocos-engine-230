
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/CCClassDecorator.js';
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
// const FIX_BABEL6 = true;

/**
 * !#en Some JavaScript decorators which can be accessed with "cc._decorator".
 * !#zh 一些 JavaScript 装饰器，目前可以通过 "cc._decorator" 来访问。
 * （这些 API 仍不完全稳定，有可能随着 JavaScript 装饰器的标准实现而调整）
 *
 * @submodule _decorator
 * @module _decorator
 * @main
 */
// inspired by toddlxt (https://github.com/toddlxt/Creator-TypeScript-Boilerplate)
require('./CCClass');

var Preprocess = require('./preprocess-class');

var js = require('./js');

var isPlainEmptyObj_DEV = CC_DEV && require('./utils').isPlainEmptyObj_DEV; // caches for class construction


var CACHE_KEY = '__ccclassCache__';

function fNOP(ctor) {
  return ctor;
}

function getSubDict(obj, key) {
  return obj[key] || (obj[key] = {});
}

function checkCtorArgument(decorate) {
  return function (target) {
    if (typeof target === 'function') {
      // no parameter, target is ctor
      return decorate(target);
    }

    return function (ctor) {
      return decorate(ctor, target);
    };
  };
}

function _checkNormalArgument(validator_DEV, decorate, decoratorName) {
  return function (target) {
    if (CC_DEV && validator_DEV(target, decoratorName) === false) {
      return function () {
        return fNOP;
      };
    }

    return function (ctor) {
      return decorate(ctor, target);
    };
  };
}

var checkCompArgument = _checkNormalArgument.bind(null, CC_DEV && function (arg, decoratorName) {
  if (!cc.Class._isCCClass(arg)) {
    cc.error('The parameter for %s is missing.', decoratorName);
    return false;
  }
});

function _argumentChecker(type) {
  return _checkNormalArgument.bind(null, CC_DEV && function (arg, decoratorName) {
    if (arg instanceof cc.Component || arg === undefined) {
      cc.error('The parameter for %s is missing.', decoratorName);
      return false;
    } else if (typeof arg !== type) {
      cc.error('The parameter for %s must be type %s.', decoratorName, type);
      return false;
    }
  });
}

var checkStringArgument = _argumentChecker('string');

var checkNumberArgument = _argumentChecker('number'); // var checkBooleanArgument = _argumentChecker('boolean');


function getClassCache(ctor, decoratorName) {
  if (CC_DEV && cc.Class._isCCClass(ctor)) {
    cc.error('`@%s` should be used after @ccclass for class "%s"', decoratorName, js.getClassName(ctor));
    return null;
  }

  return getSubDict(ctor, CACHE_KEY);
}

function getDefaultFromInitializer(initializer) {
  var value;

  try {
    value = initializer();
  } catch (e) {
    // just lazy initialize by CCClass
    return initializer;
  }

  if (typeof value !== 'object' || value === null) {
    // string boolean number function undefined null
    return value;
  } else {
    // The default attribute will not be used in ES6 constructor actually,
    // so we dont need to simplify into `{}` or `[]` or vec2 completely.
    return initializer;
  }
}

function extractActualDefaultValues(ctor) {
  var dummyObj;

  try {
    dummyObj = new ctor();
  } catch (e) {
    if (CC_DEV) {
      cc.warnID(3652, js.getClassName(ctor), e);
    }

    return {};
  }

  return dummyObj;
}

function genProperty(ctor, properties, propName, options, desc, cache) {
  var fullOptions;

  if (options) {
    fullOptions = CC_DEV ? Preprocess.getFullFormOfProperty(options, propName, js.getClassName(ctor)) : Preprocess.getFullFormOfProperty(options);
  }

  var existsProperty = properties[propName];
  var prop = js.mixin(existsProperty || {}, fullOptions || options || {});
  var isGetset = desc && (desc.get || desc.set);

  if (isGetset) {
    // typescript or babel
    if (CC_DEV && options && (options.get || options.set)) {
      var errorProps = getSubDict(cache, 'errorProps');

      if (!errorProps[propName]) {
        errorProps[propName] = true;
        cc.warnID(3655, propName, js.getClassName(ctor), propName, propName);
      }
    }

    if (desc.get) {
      prop.get = desc.get;
    }

    if (desc.set) {
      prop.set = desc.set;
    }
  } else {
    if (CC_DEV && (prop.get || prop.set)) {
      // @property({
      //     get () { ... },
      //     set (...) { ... },
      // })
      // value;
      cc.errorID(3655, propName, js.getClassName(ctor), propName, propName);
      return;
    } // member variables


    var defaultValue = undefined;
    var isDefaultValueSpecified = false;

    if (desc) {
      // babel
      if (desc.initializer) {
        // @property(...)
        // value = null;
        defaultValue = getDefaultFromInitializer(desc.initializer);
        isDefaultValueSpecified = true;
      } else {// @property(...)
        // value;
      }
    } else {
      // typescript
      var actualDefaultValues = cache["default"] || (cache["default"] = extractActualDefaultValues(ctor));

      if (actualDefaultValues.hasOwnProperty(propName)) {
        // @property(...)
        // value = null;
        defaultValue = actualDefaultValues[propName];
        isDefaultValueSpecified = true;
      } else {// @property(...)
        // value;
      }
    }

    if (CC_EDITOR && !Editor.isBuilder || CC_TEST) {
      if (!fullOptions && options && options.hasOwnProperty('default')) {
        cc.warnID(3653, propName, js.getClassName(ctor)); // prop.default = options.default;
      } else if (!isDefaultValueSpecified) {
        cc.warnID(3654, js.getClassName(ctor), propName); // prop.default = fullOptions.hasOwnProperty('default') ? fullOptions.default : undefined;
      }

      if (cc.RawAsset.wasRawAssetType(prop.url) && prop._short && isDefaultValueSpecified && defaultValue == null) {
        // Avoid excessive warning when the ts decorator format is wrong
        if (typeof options !== 'function' || cc.RawAsset.isRawAssetType(options)) {
          cc.warnID(3656, js.getClassName(ctor), propName);
        }
      }
    }

    prop["default"] = defaultValue;
  }

  properties[propName] = prop;
}
/**
 * !#en
 * Declare the standard [ES6 Class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
 * as CCClass, please see [Class](../../../manual/en/scripting/class.html) for details.
 * !#zh
 * 将标准写法的 [ES6 Class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) 声明为 CCClass，具体用法请参阅[类型定义](../../../manual/zh/scripting/class.html)。
 *
 * @method ccclass
 * @param {String} [name] - The class name used for serialization.
 * @example
 * const {ccclass} = cc._decorator;
 *
 * // define a CCClass, omit the name
 * &#64;ccclass
 * class NewScript extends cc.Component {
 *     // ...
 * }
 *
 * // define a CCClass with a name
 * &#64;ccclass('LoginData')
 * class LoginData {
 *     // ...
 * }
 * @typescript
 * ccclass(name?: string): Function
 * ccclass(_class?: Function): void
 */


var ccclass = checkCtorArgument(function (ctor, name) {
  // if (FIX_BABEL6) {
  //     eval('if(typeof _classCallCheck==="function"){_classCallCheck=function(){};}');
  // }
  var base = js.getSuper(ctor);

  if (base === Object) {
    base = null;
  }

  var proto = {
    name: name,
    "extends": base,
    ctor: ctor,
    __ES6__: true
  };
  var cache = ctor[CACHE_KEY];

  if (cache) {
    var decoratedProto = cache.proto;

    if (decoratedProto) {
      // decoratedProto.properties = createProperties(ctor, decoratedProto.properties);
      js.mixin(proto, decoratedProto);
    }

    ctor[CACHE_KEY] = undefined;
  }

  var res = cc.Class(proto); // validate methods

  if (CC_DEV) {
    var propNames = Object.getOwnPropertyNames(ctor.prototype);

    for (var i = 0; i < propNames.length; ++i) {
      var prop = propNames[i];

      if (prop !== 'constructor') {
        var desc = Object.getOwnPropertyDescriptor(ctor.prototype, prop);
        var func = desc && desc.value;

        if (typeof func === 'function') {
          Preprocess.doValidateMethodWithProps_DEV(func, prop, js.getClassName(ctor), ctor, base);
        }
      }
    }
  }

  return res;
});
/**
 * !#en
 * Declare property for [CCClass](../../../manual/en/scripting/reference/attributes.html).
 * !#zh
 * 定义 [CCClass](../../../manual/zh/scripting/reference/attributes.html) 所用的属性。
 *
 * @method property
 * @param {Object} [options] - an object with some property attributes
 * @param {Any} [options.type]
 * @param {Boolean|Function} [options.visible]
 * @param {String} [options.displayName]
 * @param {String} [options.tooltip]
 * @param {Boolean} [options.multiline]
 * @param {Boolean} [options.readonly]
 * @param {Number} [options.min]
 * @param {Number} [options.max]
 * @param {Number} [options.step]
 * @param {Number[]} [options.range]
 * @param {Boolean} [options.slide]
 * @param {Boolean} [options.serializable]
 * @param {Boolean} [options.editorOnly]
 * @param {Boolean} [options.override]
 * @param {Boolean} [options.animatable]
 * @param {String} [options.formerlySerializedAs]
 * @example
 * const {ccclass, property} = cc._decorator;
 *
 * &#64;ccclass
 * class NewScript extends cc.Component {
 *     &#64;property({
 *         type: cc.Node
 *     })
 *     targetNode1 = null;
 *
 *     &#64;property(cc.Node)
 *     targetNode2 = null;
 *
 *     &#64;property(cc.Button)
 *     targetButton = null;
 *
 *     &#64;property
 *     _width = 100;
 *
 *     &#64;property
 *     get width () {
 *         return this._width;
 *     }
 *
 *     &#64;property
 *     set width (value) {
 *         this._width = value;
 *     }
 *
 *     &#64;property
 *     offset = new cc.Vec2(100, 100);
 *
 *     &#64;property(cc.Vec2)
 *     offsets = [];
 *
 *     &#64;property(cc.SpriteFrame)
 *     frame = null;
 * }
 *
 * // above is equivalent to (上面的代码相当于):
 *
 * var NewScript = cc.Class({
 *     properties: {
 *         targetNode1: {
 *             default: null,
 *             type: cc.Node
 *         },
 *
 *         targetNode2: {
 *             default: null,
 *             type: cc.Node
 *         },
 *
 *         targetButton: {
 *             default: null,
 *             type: cc.Button
 *         },
 *
 *         _width: 100,
 *
 *         width: {
 *             get () {
 *                 return this._width;
 *             },
 *             set (value) {
 *                 this._width = value;
 *             }
 *         },
 *
 *         offset: new cc.Vec2(100, 100)
 *
 *         offsets: {
 *             default: [],
 *             type: cc.Vec2
 *         }
 *
 *         frame: {
 *             default: null,
 *             type: cc.SpriteFrame
 *         },
 *     }
 * });
 * @typescript
 * property(options?: {type?: any; visible?: boolean|(() => boolean); displayName?: string; tooltip?: string; multiline?: boolean; readonly?: boolean; min?: number; max?: number; step?: number; range?: number[]; slide?: boolean; serializable?: boolean; formerlySerializedAs?: string; editorOnly?: boolean; override?: boolean; animatable?: boolean} | any[]|Function|cc.ValueType|number|string|boolean): Function
 * property(_target: Object, _key: any, _desc?: any): void
 */

function property(ctorProtoOrOptions, propName, desc) {
  var options = null;

  function normalized(ctorProto, propName, desc) {
    var cache = getClassCache(ctorProto.constructor);

    if (cache) {
      var ccclassProto = getSubDict(cache, 'proto');
      var properties = getSubDict(ccclassProto, 'properties');
      genProperty(ctorProto.constructor, properties, propName, options, desc, cache);
    }
  }

  if (typeof propName === 'undefined') {
    options = ctorProtoOrOptions;
    return normalized;
  } else {
    normalized(ctorProtoOrOptions, propName, desc);
  }
} // Editor Decorators


function createEditorDecorator(argCheckFunc, editorPropName, staticValue) {
  return argCheckFunc(function (ctor, decoratedValue) {
    var cache = getClassCache(ctor, editorPropName);

    if (cache) {
      var value = staticValue !== undefined ? staticValue : decoratedValue;
      var proto = getSubDict(cache, 'proto');
      getSubDict(proto, 'editor')[editorPropName] = value;
    }
  }, editorPropName);
}

function createDummyDecorator(argCheckFunc) {
  return argCheckFunc(fNOP);
}
/**
 * !#en
 * Makes a CCClass that inherit from component execute in edit mode.<br>
 * By default, all components are only executed in play mode,
 * which means they will not have their callback functions executed while the Editor is in edit mode.
 * !#zh
 * 允许继承自 Component 的 CCClass 在编辑器里执行。<br>
 * 默认情况下，所有 Component 都只会在运行时才会执行，也就是说它们的生命周期回调不会在编辑器里触发。
 *
 * @method executeInEditMode
 * @example
 * const {ccclass, executeInEditMode} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;executeInEditMode
 * class NewScript extends cc.Component {
 *     // ...
 * }
 * @typescript
 * executeInEditMode(): Function
 * executeInEditMode(_class: Function): void
 */


var executeInEditMode = (CC_DEV ? createEditorDecorator : createDummyDecorator)(checkCtorArgument, 'executeInEditMode', true);
/**
 * !#en
 * Automatically add required component as a dependency for the CCClass that inherit from component.
 * !#zh
 * 为声明为 CCClass 的组件添加依赖的其它组件。当组件添加到节点上时，如果依赖的组件不存在，引擎将会自动将依赖组件添加到同一个节点，防止脚本出错。该设置在运行时同样有效。
 *
 * @method requireComponent
 * @param {Component} requiredComponent
 * @example
 * const {ccclass, requireComponent} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;requireComponent(cc.Sprite)
 * class SpriteCtrl extends cc.Component {
 *     // ...
 * }
 * @typescript
 * requireComponent(requiredComponent: typeof cc.Component): Function
 */

var requireComponent = createEditorDecorator(checkCompArgument, 'requireComponent');
/**
 * !#en
 * The menu path to register a component to the editors "Component" menu. Eg. "Rendering/CameraCtrl".
 * !#zh
 * 将当前组件添加到组件菜单中，方便用户查找。例如 "Rendering/CameraCtrl"。
 *
 * @method menu
 * @param {String} path - The path is the menu represented like a pathname.
 *                        For example the menu could be "Rendering/CameraCtrl".
 * @example
 * const {ccclass, menu} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;menu("Rendering/CameraCtrl")
 * class NewScript extends cc.Component {
 *     // ...
 * }
 * @typescript
 * menu(path: string): Function
 */

var menu = (CC_DEV ? createEditorDecorator : createDummyDecorator)(checkStringArgument, 'menu');
/**
 * !#en
 * The execution order of lifecycle methods for Component.
 * Those less than 0 will execute before while those greater than 0 will execute after.
 * The order will only affect onLoad, onEnable, start, update and lateUpdate while onDisable and onDestroy will not be affected.
 * !#zh
 * 设置脚本生命周期方法调用的优先级。优先级小于 0 的组件将会优先执行，优先级大于 0 的组件将会延后执行。优先级仅会影响 onLoad, onEnable, start, update 和 lateUpdate，而 onDisable 和 onDestroy 不受影响。
 *
 * @method executionOrder
 * @param {Number} order - The execution order of lifecycle methods for Component. Those less than 0 will execute before while those greater than 0 will execute after.
 * @example
 * const {ccclass, executionOrder} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;executionOrder(1)
 * class CameraCtrl extends cc.Component {
 *     // ...
 * }
 * @typescript
 * executionOrder(order: number): Function
 */

var executionOrder = createEditorDecorator(checkNumberArgument, 'executionOrder');
/**
 * !#en
 * Prevents Component of the same type (or subtype) to be added more than once to a Node.
 * !#zh
 * 防止多个相同类型（或子类型）的组件被添加到同一个节点。
 *
 * @method disallowMultiple
 * @example
 * const {ccclass, disallowMultiple} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;disallowMultiple
 * class CameraCtrl extends cc.Component {
 *     // ...
 * }
 * @typescript
 * disallowMultiple(): Function
 * disallowMultiple(_class: Function): void
 */

var disallowMultiple = (CC_DEV ? createEditorDecorator : createDummyDecorator)(checkCtorArgument, 'disallowMultiple');
/**
 * !#en
 * If specified, the editor's scene view will keep updating this node in 60 fps when it is selected, otherwise, it will update only if necessary.<br>
 * This property is only available if executeInEditMode is true.
 * !#zh
 * 当指定了 "executeInEditMode" 以后，playOnFocus 可以在选中当前组件所在的节点时，提高编辑器的场景刷新频率到 60 FPS，否则场景就只会在必要的时候进行重绘。
 *
 * @method playOnFocus
 * @example
 * const {ccclass, playOnFocus, executeInEditMode} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;executeInEditMode
 * &#64;playOnFocus
 * class CameraCtrl extends cc.Component {
 *     // ...
 * }
 * @typescript
 * playOnFocus(): Function
 * playOnFocus(_class: Function): void
 */

var playOnFocus = (CC_DEV ? createEditorDecorator : createDummyDecorator)(checkCtorArgument, 'playOnFocus', true);
/**
 * !#en
 * Specifying the url of the custom html to draw the component in **Properties**.
 * !#zh
 * 自定义当前组件在 **属性检查器** 中渲染时所用的网页 url。
 *
 * @method inspector
 * @param {String} url
 * @example
 * const {ccclass, inspector} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;inspector("packages://inspector/inspectors/comps/camera-ctrl.js")
 * class NewScript extends cc.Component {
 *     // ...
 * }
 * @typescript
 * inspector(path: string): Function
 */

var inspector = (CC_DEV ? createEditorDecorator : createDummyDecorator)(checkStringArgument, 'inspector');
/**
 * !#en
 * Specifying the url of the icon to display in the editor.
 * !#zh
 * 自定义当前组件在编辑器中显示的图标 url。
 *
 * @method icon
 * @param {String} url
 * @private
 * @example
 * const {ccclass, icon} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;icon("xxxx.png")
 * class NewScript extends cc.Component {
 *     // ...
 * }
 * @typescript
 * icon(path: string): Function
 */

var icon = (CC_DEV ? createEditorDecorator : createDummyDecorator)(checkStringArgument, 'icon');
/**
 * !#en
 * The custom documentation URL.
 * !#zh
 * 指定当前组件的帮助文档的 url，设置过后，在 **属性检查器** 中就会出现一个帮助图标，用户点击将打开指定的网页。
 *
 * @method help
 * @param {String} url
 * @example
 * const {ccclass, help} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;help("app://docs/html/components/spine.html")
 * class NewScript extends cc.Component {
 *     // ...
 * }
 * @typescript
 * help(path: string): Function
 */

var help = (CC_DEV ? createEditorDecorator : createDummyDecorator)(checkStringArgument, 'help'); // Other Decorators

/**
 * NOTE:<br>
 * The old mixins implemented in cc.Class(ES5) behaves exact the same as multiple inheritance.
 * But since ES6, class constructor can't be function-called and class methods become non-enumerable,
 * so we can not mix in ES6 Classes.<br>
 * See:<br>
 * [https://esdiscuss.org/topic/traits-are-now-impossible-in-es6-until-es7-since-rev32](https://esdiscuss.org/topic/traits-are-now-impossible-in-es6-until-es7-since-rev32)<br>
 * One possible solution (but IDE unfriendly):<br>
 * [http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes](http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/)<br>
 * <br>
 * NOTE:<br>
 * You must manually call mixins constructor, this is different from cc.Class(ES5).
 *
 * @method mixins
 * @param {Function} ...ctor - constructors to mix, only support ES5 constructors or classes defined by using `cc.Class`,
 *                             not support ES6 Classes.
 * @example
 * const {ccclass, mixins} = cc._decorator;
 *
 * class Animal { ... }
 *
 * const Fly = cc.Class({
 *     constructor () { ... }
 * });
 *
 * &#64;ccclass
 * &#64;mixins(cc.EventTarget, Fly)
 * class Bird extends Animal {
 *     constructor () {
 *         super();
 *
 *         // You must manually call mixins constructor, this is different from cc.Class(ES5)
 *         cc.EventTarget.call(this);
 *         Fly.call(this);
 *     }
 *     // ...
 * }
 * @typescript
 * mixins(ctor: Function, ...rest: Function[]): Function
 */

function mixins() {
  var mixins = [];

  for (var i = 0; i < arguments.length; i++) {
    mixins[i] = arguments[i];
  }

  return function (ctor) {
    var cache = getClassCache(ctor, 'mixins');

    if (cache) {
      getSubDict(cache, 'proto').mixins = mixins;
    }
  };
}

cc._decorator = module.exports = {
  ccclass: ccclass,
  property: property,
  executeInEditMode: executeInEditMode,
  requireComponent: requireComponent,
  menu: menu,
  executionOrder: executionOrder,
  disallowMultiple: disallowMultiple,
  playOnFocus: playOnFocus,
  inspector: inspector,
  icon: icon,
  help: help,
  mixins: mixins
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDQ2xhc3NEZWNvcmF0b3IuanMiXSwibmFtZXMiOlsicmVxdWlyZSIsIlByZXByb2Nlc3MiLCJqcyIsImlzUGxhaW5FbXB0eU9ial9ERVYiLCJDQ19ERVYiLCJDQUNIRV9LRVkiLCJmTk9QIiwiY3RvciIsImdldFN1YkRpY3QiLCJvYmoiLCJrZXkiLCJjaGVja0N0b3JBcmd1bWVudCIsImRlY29yYXRlIiwidGFyZ2V0IiwiX2NoZWNrTm9ybWFsQXJndW1lbnQiLCJ2YWxpZGF0b3JfREVWIiwiZGVjb3JhdG9yTmFtZSIsImNoZWNrQ29tcEFyZ3VtZW50IiwiYmluZCIsImFyZyIsImNjIiwiQ2xhc3MiLCJfaXNDQ0NsYXNzIiwiZXJyb3IiLCJfYXJndW1lbnRDaGVja2VyIiwidHlwZSIsIkNvbXBvbmVudCIsInVuZGVmaW5lZCIsImNoZWNrU3RyaW5nQXJndW1lbnQiLCJjaGVja051bWJlckFyZ3VtZW50IiwiZ2V0Q2xhc3NDYWNoZSIsImdldENsYXNzTmFtZSIsImdldERlZmF1bHRGcm9tSW5pdGlhbGl6ZXIiLCJpbml0aWFsaXplciIsInZhbHVlIiwiZSIsImV4dHJhY3RBY3R1YWxEZWZhdWx0VmFsdWVzIiwiZHVtbXlPYmoiLCJ3YXJuSUQiLCJnZW5Qcm9wZXJ0eSIsInByb3BlcnRpZXMiLCJwcm9wTmFtZSIsIm9wdGlvbnMiLCJkZXNjIiwiY2FjaGUiLCJmdWxsT3B0aW9ucyIsImdldEZ1bGxGb3JtT2ZQcm9wZXJ0eSIsImV4aXN0c1Byb3BlcnR5IiwicHJvcCIsIm1peGluIiwiaXNHZXRzZXQiLCJnZXQiLCJzZXQiLCJlcnJvclByb3BzIiwiZXJyb3JJRCIsImRlZmF1bHRWYWx1ZSIsImlzRGVmYXVsdFZhbHVlU3BlY2lmaWVkIiwiYWN0dWFsRGVmYXVsdFZhbHVlcyIsImhhc093blByb3BlcnR5IiwiQ0NfRURJVE9SIiwiRWRpdG9yIiwiaXNCdWlsZGVyIiwiQ0NfVEVTVCIsIlJhd0Fzc2V0Iiwid2FzUmF3QXNzZXRUeXBlIiwidXJsIiwiX3Nob3J0IiwiaXNSYXdBc3NldFR5cGUiLCJjY2NsYXNzIiwibmFtZSIsImJhc2UiLCJnZXRTdXBlciIsIk9iamVjdCIsInByb3RvIiwiX19FUzZfXyIsImRlY29yYXRlZFByb3RvIiwicmVzIiwicHJvcE5hbWVzIiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsInByb3RvdHlwZSIsImkiLCJsZW5ndGgiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJmdW5jIiwiZG9WYWxpZGF0ZU1ldGhvZFdpdGhQcm9wc19ERVYiLCJwcm9wZXJ0eSIsImN0b3JQcm90b09yT3B0aW9ucyIsIm5vcm1hbGl6ZWQiLCJjdG9yUHJvdG8iLCJjb25zdHJ1Y3RvciIsImNjY2xhc3NQcm90byIsImNyZWF0ZUVkaXRvckRlY29yYXRvciIsImFyZ0NoZWNrRnVuYyIsImVkaXRvclByb3BOYW1lIiwic3RhdGljVmFsdWUiLCJkZWNvcmF0ZWRWYWx1ZSIsImNyZWF0ZUR1bW15RGVjb3JhdG9yIiwiZXhlY3V0ZUluRWRpdE1vZGUiLCJyZXF1aXJlQ29tcG9uZW50IiwibWVudSIsImV4ZWN1dGlvbk9yZGVyIiwiZGlzYWxsb3dNdWx0aXBsZSIsInBsYXlPbkZvY3VzIiwiaW5zcGVjdG9yIiwiaWNvbiIsImhlbHAiLCJtaXhpbnMiLCJhcmd1bWVudHMiLCJfZGVjb3JhdG9yIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBOztBQUVBOzs7Ozs7Ozs7QUFVQTtBQUVBQSxPQUFPLENBQUMsV0FBRCxDQUFQOztBQUNBLElBQU1DLFVBQVUsR0FBR0QsT0FBTyxDQUFDLG9CQUFELENBQTFCOztBQUNBLElBQU1FLEVBQUUsR0FBR0YsT0FBTyxDQUFDLE1BQUQsQ0FBbEI7O0FBQ0EsSUFBTUcsbUJBQW1CLEdBQUdDLE1BQU0sSUFBSUosT0FBTyxDQUFDLFNBQUQsQ0FBUCxDQUFtQkcsbUJBQXpELEVBRUE7OztBQUNBLElBQU1FLFNBQVMsR0FBRyxrQkFBbEI7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QixNQUE5QixFQUFzQ0QsQ0FBQyxFQUF2QyxFQUEyQztBQUN2QzBCLElBQUFBLE1BQU0sQ0FBQzFCLENBQUQsQ0FBTixHQUFZMkIsU0FBUyxDQUFDM0IsQ0FBRCxDQUFyQjtBQUNIOztBQUNELFNBQU8sVUFBVXpFLElBQVYsRUFBZ0I7QUFDbkIsUUFBSXFDLEtBQUssR0FBR2QsYUFBYSxDQUFDdkIsSUFBRCxFQUFPLFFBQVAsQ0FBekI7O0FBQ0EsUUFBSXFDLEtBQUosRUFBVztBQUNQcEMsTUFBQUEsVUFBVSxDQUFDb0MsS0FBRCxFQUFRLE9BQVIsQ0FBVixDQUEyQjhELE1BQTNCLEdBQW9DQSxNQUFwQztBQUNIO0FBQ0osR0FMRDtBQU1IOztBQUVEdEYsRUFBRSxDQUFDd0YsVUFBSCxHQUFnQkMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQzdCMUMsRUFBQUEsT0FBTyxFQUFQQSxPQUQ2QjtBQUU3QmlCLEVBQUFBLFFBQVEsRUFBUkEsUUFGNkI7QUFHN0JZLEVBQUFBLGlCQUFpQixFQUFqQkEsaUJBSDZCO0FBSTdCQyxFQUFBQSxnQkFBZ0IsRUFBaEJBLGdCQUo2QjtBQUs3QkMsRUFBQUEsSUFBSSxFQUFKQSxJQUw2QjtBQU03QkMsRUFBQUEsY0FBYyxFQUFkQSxjQU42QjtBQU83QkMsRUFBQUEsZ0JBQWdCLEVBQWhCQSxnQkFQNkI7QUFRN0JDLEVBQUFBLFdBQVcsRUFBWEEsV0FSNkI7QUFTN0JDLEVBQUFBLFNBQVMsRUFBVEEsU0FUNkI7QUFVN0JDLEVBQUFBLElBQUksRUFBSkEsSUFWNkI7QUFXN0JDLEVBQUFBLElBQUksRUFBSkEsSUFYNkI7QUFZN0JDLEVBQUFBLE1BQU0sRUFBTkE7QUFaNkIsQ0FBakMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8vIGNvbnN0IEZJWF9CQUJFTDYgPSB0cnVlO1xuXG4vKipcbiAqICEjZW4gU29tZSBKYXZhU2NyaXB0IGRlY29yYXRvcnMgd2hpY2ggY2FuIGJlIGFjY2Vzc2VkIHdpdGggXCJjYy5fZGVjb3JhdG9yXCIuXG4gKiAhI3poIOS4gOS6myBKYXZhU2NyaXB0IOijhemlsOWZqO+8jOebruWJjeWPr+S7pemAmui/hyBcImNjLl9kZWNvcmF0b3JcIiDmnaXorr/pl67jgIJcbiAqIO+8iOi/meS6myBBUEkg5LuN5LiN5a6M5YWo56iz5a6a77yM5pyJ5Y+v6IO96ZqP552AIEphdmFTY3JpcHQg6KOF6aWw5Zmo55qE5qCH5YeG5a6e546w6ICM6LCD5pW077yJXG4gKlxuICogQHN1Ym1vZHVsZSBfZGVjb3JhdG9yXG4gKiBAbW9kdWxlIF9kZWNvcmF0b3JcbiAqIEBtYWluXG4gKi9cblxuLy8gaW5zcGlyZWQgYnkgdG9kZGx4dCAoaHR0cHM6Ly9naXRodWIuY29tL3RvZGRseHQvQ3JlYXRvci1UeXBlU2NyaXB0LUJvaWxlcnBsYXRlKVxuXG5yZXF1aXJlKCcuL0NDQ2xhc3MnKTtcbmNvbnN0IFByZXByb2Nlc3MgPSByZXF1aXJlKCcuL3ByZXByb2Nlc3MtY2xhc3MnKTtcbmNvbnN0IGpzID0gcmVxdWlyZSgnLi9qcycpO1xuY29uc3QgaXNQbGFpbkVtcHR5T2JqX0RFViA9IENDX0RFViAmJiByZXF1aXJlKCcuL3V0aWxzJykuaXNQbGFpbkVtcHR5T2JqX0RFVjtcblxuLy8gY2FjaGVzIGZvciBjbGFzcyBjb25zdHJ1Y3Rpb25cbmNvbnN0IENBQ0hFX0tFWSA9ICdfX2NjY2xhc3NDYWNoZV9fJztcblxuZnVuY3Rpb24gZk5PUCAoY3Rvcikge1xuICAgIHJldHVybiBjdG9yO1xufVxuXG5mdW5jdGlvbiBnZXRTdWJEaWN0IChvYmosIGtleSkge1xuICAgIHJldHVybiBvYmpba2V5XSB8fCAob2JqW2tleV0gPSB7fSk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrQ3RvckFyZ3VtZW50IChkZWNvcmF0ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAvLyBubyBwYXJhbWV0ZXIsIHRhcmdldCBpcyBjdG9yXG4gICAgICAgICAgICByZXR1cm4gZGVjb3JhdGUodGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGN0b3IpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWNvcmF0ZShjdG9yLCB0YXJnZXQpO1xuICAgICAgICB9O1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIF9jaGVja05vcm1hbEFyZ3VtZW50ICh2YWxpZGF0b3JfREVWLCBkZWNvcmF0ZSwgZGVjb3JhdG9yTmFtZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIGlmIChDQ19ERVYgJiYgdmFsaWRhdG9yX0RFVih0YXJnZXQsIGRlY29yYXRvck5hbWUpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZk5PUDtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChjdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVjb3JhdGUoY3RvciwgdGFyZ2V0KTtcbiAgICAgICAgfTtcbiAgICB9O1xufVxuXG52YXIgY2hlY2tDb21wQXJndW1lbnQgPSBfY2hlY2tOb3JtYWxBcmd1bWVudC5iaW5kKG51bGwsIENDX0RFViAmJiBmdW5jdGlvbiAoYXJnLCBkZWNvcmF0b3JOYW1lKSB7XG4gICAgaWYgKCFjYy5DbGFzcy5faXNDQ0NsYXNzKGFyZykpIHtcbiAgICAgICAgY2MuZXJyb3IoJ1RoZSBwYXJhbWV0ZXIgZm9yICVzIGlzIG1pc3NpbmcuJywgZGVjb3JhdG9yTmFtZSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59KTtcblxuZnVuY3Rpb24gX2FyZ3VtZW50Q2hlY2tlciAodHlwZSkge1xuICAgIHJldHVybiBfY2hlY2tOb3JtYWxBcmd1bWVudC5iaW5kKG51bGwsIENDX0RFViAmJiBmdW5jdGlvbiAoYXJnLCBkZWNvcmF0b3JOYW1lKSB7XG4gICAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBjYy5Db21wb25lbnQgfHwgYXJnID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNjLmVycm9yKCdUaGUgcGFyYW1ldGVyIGZvciAlcyBpcyBtaXNzaW5nLicsIGRlY29yYXRvck5hbWUpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBhcmcgIT09IHR5cGUpIHtcbiAgICAgICAgICAgIGNjLmVycm9yKCdUaGUgcGFyYW1ldGVyIGZvciAlcyBtdXN0IGJlIHR5cGUgJXMuJywgZGVjb3JhdG9yTmFtZSwgdHlwZSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbnZhciBjaGVja1N0cmluZ0FyZ3VtZW50ID0gX2FyZ3VtZW50Q2hlY2tlcignc3RyaW5nJyk7XG52YXIgY2hlY2tOdW1iZXJBcmd1bWVudCA9IF9hcmd1bWVudENoZWNrZXIoJ251bWJlcicpO1xuLy8gdmFyIGNoZWNrQm9vbGVhbkFyZ3VtZW50ID0gX2FyZ3VtZW50Q2hlY2tlcignYm9vbGVhbicpO1xuXG5cbmZ1bmN0aW9uIGdldENsYXNzQ2FjaGUgKGN0b3IsIGRlY29yYXRvck5hbWUpIHtcbiAgICBpZiAoQ0NfREVWICYmIGNjLkNsYXNzLl9pc0NDQ2xhc3MoY3RvcikpIHtcbiAgICAgICAgY2MuZXJyb3IoJ2BAJXNgIHNob3VsZCBiZSB1c2VkIGFmdGVyIEBjY2NsYXNzIGZvciBjbGFzcyBcIiVzXCInLCBkZWNvcmF0b3JOYW1lLCBqcy5nZXRDbGFzc05hbWUoY3RvcikpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGdldFN1YkRpY3QoY3RvciwgQ0FDSEVfS0VZKTtcbn1cblxuZnVuY3Rpb24gZ2V0RGVmYXVsdEZyb21Jbml0aWFsaXplciAoaW5pdGlhbGl6ZXIpIHtcbiAgICB2YXIgdmFsdWU7XG4gICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBpbml0aWFsaXplcigpO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICAvLyBqdXN0IGxhenkgaW5pdGlhbGl6ZSBieSBDQ0NsYXNzXG4gICAgICAgIHJldHVybiBpbml0aWFsaXplcjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcgfHwgdmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgLy8gc3RyaW5nIGJvb2xlYW4gbnVtYmVyIGZ1bmN0aW9uIHVuZGVmaW5lZCBudWxsXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIFRoZSBkZWZhdWx0IGF0dHJpYnV0ZSB3aWxsIG5vdCBiZSB1c2VkIGluIEVTNiBjb25zdHJ1Y3RvciBhY3R1YWxseSxcbiAgICAgICAgLy8gc28gd2UgZG9udCBuZWVkIHRvIHNpbXBsaWZ5IGludG8gYHt9YCBvciBgW11gIG9yIHZlYzIgY29tcGxldGVseS5cbiAgICAgICAgcmV0dXJuIGluaXRpYWxpemVyO1xuICAgIH1cbn1cblxuXG5mdW5jdGlvbiBleHRyYWN0QWN0dWFsRGVmYXVsdFZhbHVlcyAoY3Rvcikge1xuICAgIHZhciBkdW1teU9iajtcbiAgICB0cnkge1xuICAgICAgICBkdW1teU9iaiA9IG5ldyBjdG9yKCk7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChDQ19ERVYpIHtcbiAgICAgICAgICAgIGNjLndhcm5JRCgzNjUyLCBqcy5nZXRDbGFzc05hbWUoY3RvciksIGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgcmV0dXJuIGR1bW15T2JqO1xufVxuXG5mdW5jdGlvbiBnZW5Qcm9wZXJ0eSAoY3RvciwgcHJvcGVydGllcywgcHJvcE5hbWUsIG9wdGlvbnMsIGRlc2MsIGNhY2hlKSB7XG4gICAgdmFyIGZ1bGxPcHRpb25zO1xuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICAgIGZ1bGxPcHRpb25zID0gQ0NfREVWID8gUHJlcHJvY2Vzcy5nZXRGdWxsRm9ybU9mUHJvcGVydHkob3B0aW9ucywgcHJvcE5hbWUsIGpzLmdldENsYXNzTmFtZShjdG9yKSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFByZXByb2Nlc3MuZ2V0RnVsbEZvcm1PZlByb3BlcnR5KG9wdGlvbnMpO1xuICAgIH1cbiAgICB2YXIgZXhpc3RzUHJvcGVydHkgPSBwcm9wZXJ0aWVzW3Byb3BOYW1lXTtcbiAgICB2YXIgcHJvcCA9IGpzLm1peGluKGV4aXN0c1Byb3BlcnR5IHx8IHt9LCBmdWxsT3B0aW9ucyB8fCBvcHRpb25zIHx8IHt9KTtcblxuICAgIHZhciBpc0dldHNldCA9IGRlc2MgJiYgKGRlc2MuZ2V0IHx8IGRlc2Muc2V0KTtcbiAgICBpZiAoaXNHZXRzZXQpIHtcbiAgICAgICAgLy8gdHlwZXNjcmlwdCBvciBiYWJlbFxuICAgICAgICBpZiAoQ0NfREVWICYmIG9wdGlvbnMgJiYgKG9wdGlvbnMuZ2V0IHx8IG9wdGlvbnMuc2V0KSkge1xuICAgICAgICAgICAgdmFyIGVycm9yUHJvcHMgPSBnZXRTdWJEaWN0KGNhY2hlLCAnZXJyb3JQcm9wcycpO1xuICAgICAgICAgICAgaWYgKCFlcnJvclByb3BzW3Byb3BOYW1lXSkge1xuICAgICAgICAgICAgICAgIGVycm9yUHJvcHNbcHJvcE5hbWVdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjYy53YXJuSUQoMzY1NSwgcHJvcE5hbWUsIGpzLmdldENsYXNzTmFtZShjdG9yKSwgcHJvcE5hbWUsIHByb3BOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZGVzYy5nZXQpIHtcbiAgICAgICAgICAgIHByb3AuZ2V0ID0gZGVzYy5nZXQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICAgICAgICBwcm9wLnNldCA9IGRlc2Muc2V0O1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAoQ0NfREVWICYmIChwcm9wLmdldCB8fCBwcm9wLnNldCkpIHtcbiAgICAgICAgICAgIC8vIEBwcm9wZXJ0eSh7XG4gICAgICAgICAgICAvLyAgICAgZ2V0ICgpIHsgLi4uIH0sXG4gICAgICAgICAgICAvLyAgICAgc2V0ICguLi4pIHsgLi4uIH0sXG4gICAgICAgICAgICAvLyB9KVxuICAgICAgICAgICAgLy8gdmFsdWU7XG4gICAgICAgICAgICBjYy5lcnJvcklEKDM2NTUsIHByb3BOYW1lLCBqcy5nZXRDbGFzc05hbWUoY3RvciksIHByb3BOYW1lLCBwcm9wTmFtZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gbWVtYmVyIHZhcmlhYmxlc1xuICAgICAgICB2YXIgZGVmYXVsdFZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICB2YXIgaXNEZWZhdWx0VmFsdWVTcGVjaWZpZWQgPSBmYWxzZTtcbiAgICAgICAgaWYgKGRlc2MpIHtcbiAgICAgICAgICAgIC8vIGJhYmVsXG4gICAgICAgICAgICBpZiAoZGVzYy5pbml0aWFsaXplcikge1xuICAgICAgICAgICAgICAgIC8vIEBwcm9wZXJ0eSguLi4pXG4gICAgICAgICAgICAgICAgLy8gdmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZSA9IGdldERlZmF1bHRGcm9tSW5pdGlhbGl6ZXIoZGVzYy5pbml0aWFsaXplcik7XG4gICAgICAgICAgICAgICAgaXNEZWZhdWx0VmFsdWVTcGVjaWZpZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gQHByb3BlcnR5KC4uLilcbiAgICAgICAgICAgICAgICAvLyB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIHR5cGVzY3JpcHRcbiAgICAgICAgICAgIHZhciBhY3R1YWxEZWZhdWx0VmFsdWVzID0gY2FjaGUuZGVmYXVsdCB8fCAoY2FjaGUuZGVmYXVsdCA9IGV4dHJhY3RBY3R1YWxEZWZhdWx0VmFsdWVzKGN0b3IpKTtcbiAgICAgICAgICAgIGlmIChhY3R1YWxEZWZhdWx0VmFsdWVzLmhhc093blByb3BlcnR5KHByb3BOYW1lKSkge1xuICAgICAgICAgICAgICAgIC8vIEBwcm9wZXJ0eSguLi4pXG4gICAgICAgICAgICAgICAgLy8gdmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZSA9IGFjdHVhbERlZmF1bHRWYWx1ZXNbcHJvcE5hbWVdO1xuICAgICAgICAgICAgICAgIGlzRGVmYXVsdFZhbHVlU3BlY2lmaWVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIEBwcm9wZXJ0eSguLi4pXG4gICAgICAgICAgICAgICAgLy8gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoKENDX0VESVRPUiAmJiAhRWRpdG9yLmlzQnVpbGRlcikgfHwgQ0NfVEVTVCkge1xuICAgICAgICAgICAgaWYgKCFmdWxsT3B0aW9ucyAmJiBvcHRpb25zICYmIG9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ2RlZmF1bHQnKSkge1xuICAgICAgICAgICAgICAgIGNjLndhcm5JRCgzNjUzLCBwcm9wTmFtZSwganMuZ2V0Q2xhc3NOYW1lKGN0b3IpKTtcbiAgICAgICAgICAgICAgICAvLyBwcm9wLmRlZmF1bHQgPSBvcHRpb25zLmRlZmF1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICghaXNEZWZhdWx0VmFsdWVTcGVjaWZpZWQpIHtcbiAgICAgICAgICAgICAgICBjYy53YXJuSUQoMzY1NCwganMuZ2V0Q2xhc3NOYW1lKGN0b3IpLCBwcm9wTmFtZSk7XG4gICAgICAgICAgICAgICAgLy8gcHJvcC5kZWZhdWx0ID0gZnVsbE9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ2RlZmF1bHQnKSA/IGZ1bGxPcHRpb25zLmRlZmF1bHQgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2MuUmF3QXNzZXQud2FzUmF3QXNzZXRUeXBlKHByb3AudXJsKSAmJlxuICAgICAgICAgICAgICAgIHByb3AuX3Nob3J0ICYmXG4gICAgICAgICAgICAgICAgaXNEZWZhdWx0VmFsdWVTcGVjaWZpZWQgJiZcbiAgICAgICAgICAgICAgICBkZWZhdWx0VmFsdWUgPT0gbnVsbFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gQXZvaWQgZXhjZXNzaXZlIHdhcm5pbmcgd2hlbiB0aGUgdHMgZGVjb3JhdG9yIGZvcm1hdCBpcyB3cm9uZ1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ2Z1bmN0aW9uJyB8fCBjYy5SYXdBc3NldC5pc1Jhd0Fzc2V0VHlwZShvcHRpb25zKSkge1xuICAgICAgICAgICAgICAgICAgICBjYy53YXJuSUQoMzY1NiwganMuZ2V0Q2xhc3NOYW1lKGN0b3IpLCBwcm9wTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHByb3AuZGVmYXVsdCA9IGRlZmF1bHRWYWx1ZTtcbiAgICB9XG5cbiAgICBwcm9wZXJ0aWVzW3Byb3BOYW1lXSA9IHByb3A7XG59XG5cbi8qKlxuICogISNlblxuICogRGVjbGFyZSB0aGUgc3RhbmRhcmQgW0VTNiBDbGFzc10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvQ2xhc3NlcylcbiAqIGFzIENDQ2xhc3MsIHBsZWFzZSBzZWUgW0NsYXNzXSguLi8uLi8uLi9tYW51YWwvZW4vc2NyaXB0aW5nL2NsYXNzLmh0bWwpIGZvciBkZXRhaWxzLlxuICogISN6aFxuICog5bCG5qCH5YeG5YaZ5rOV55qEIFtFUzYgQ2xhc3NdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0NsYXNzZXMpIOWjsOaYjuS4uiBDQ0NsYXNz77yM5YW35L2T55So5rOV6K+35Y+C6ZiFW+exu+Wei+WumuS5iV0oLi4vLi4vLi4vbWFudWFsL3poL3NjcmlwdGluZy9jbGFzcy5odG1sKeOAglxuICpcbiAqIEBtZXRob2QgY2NjbGFzc1xuICogQHBhcmFtIHtTdHJpbmd9IFtuYW1lXSAtIFRoZSBjbGFzcyBuYW1lIHVzZWQgZm9yIHNlcmlhbGl6YXRpb24uXG4gKiBAZXhhbXBsZVxuICogY29uc3Qge2NjY2xhc3N9ID0gY2MuX2RlY29yYXRvcjtcbiAqXG4gKiAvLyBkZWZpbmUgYSBDQ0NsYXNzLCBvbWl0IHRoZSBuYW1lXG4gKiAmIzY0O2NjY2xhc3NcbiAqIGNsYXNzIE5ld1NjcmlwdCBleHRlbmRzIGNjLkNvbXBvbmVudCB7XG4gKiAgICAgLy8gLi4uXG4gKiB9XG4gKlxuICogLy8gZGVmaW5lIGEgQ0NDbGFzcyB3aXRoIGEgbmFtZVxuICogJiM2NDtjY2NsYXNzKCdMb2dpbkRhdGEnKVxuICogY2xhc3MgTG9naW5EYXRhIHtcbiAqICAgICAvLyAuLi5cbiAqIH1cbiAqIEB0eXBlc2NyaXB0XG4gKiBjY2NsYXNzKG5hbWU/OiBzdHJpbmcpOiBGdW5jdGlvblxuICogY2NjbGFzcyhfY2xhc3M/OiBGdW5jdGlvbik6IHZvaWRcbiAqL1xudmFyIGNjY2xhc3MgPSBjaGVja0N0b3JBcmd1bWVudChmdW5jdGlvbiAoY3RvciwgbmFtZSkge1xuICAgIC8vIGlmIChGSVhfQkFCRUw2KSB7XG4gICAgLy8gICAgIGV2YWwoJ2lmKHR5cGVvZiBfY2xhc3NDYWxsQ2hlY2s9PT1cImZ1bmN0aW9uXCIpe19jbGFzc0NhbGxDaGVjaz1mdW5jdGlvbigpe307fScpO1xuICAgIC8vIH1cbiAgICB2YXIgYmFzZSA9IGpzLmdldFN1cGVyKGN0b3IpO1xuICAgIGlmIChiYXNlID09PSBPYmplY3QpIHtcbiAgICAgICAgYmFzZSA9IG51bGw7XG4gICAgfVxuXG4gICAgdmFyIHByb3RvID0ge1xuICAgICAgICBuYW1lLFxuICAgICAgICBleHRlbmRzOiBiYXNlLFxuICAgICAgICBjdG9yLFxuICAgICAgICBfX0VTNl9fOiB0cnVlLFxuICAgIH07XG4gICAgdmFyIGNhY2hlID0gY3RvcltDQUNIRV9LRVldO1xuICAgIGlmIChjYWNoZSkge1xuICAgICAgICB2YXIgZGVjb3JhdGVkUHJvdG8gPSBjYWNoZS5wcm90bztcbiAgICAgICAgaWYgKGRlY29yYXRlZFByb3RvKSB7XG4gICAgICAgICAgICAvLyBkZWNvcmF0ZWRQcm90by5wcm9wZXJ0aWVzID0gY3JlYXRlUHJvcGVydGllcyhjdG9yLCBkZWNvcmF0ZWRQcm90by5wcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgIGpzLm1peGluKHByb3RvLCBkZWNvcmF0ZWRQcm90byk7XG4gICAgICAgIH1cbiAgICAgICAgY3RvcltDQUNIRV9LRVldID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHZhciByZXMgPSBjYy5DbGFzcyhwcm90byk7XG5cbiAgICAvLyB2YWxpZGF0ZSBtZXRob2RzXG4gICAgaWYgKENDX0RFVikge1xuICAgICAgICB2YXIgcHJvcE5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoY3Rvci5wcm90b3R5cGUpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BOYW1lcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgdmFyIHByb3AgPSBwcm9wTmFtZXNbaV07XG4gICAgICAgICAgICBpZiAocHJvcCAhPT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgICAgICAgICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihjdG9yLnByb3RvdHlwZSwgcHJvcCk7XG4gICAgICAgICAgICAgICAgdmFyIGZ1bmMgPSBkZXNjICYmIGRlc2MudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBmdW5jID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIFByZXByb2Nlc3MuZG9WYWxpZGF0ZU1ldGhvZFdpdGhQcm9wc19ERVYoZnVuYywgcHJvcCwganMuZ2V0Q2xhc3NOYW1lKGN0b3IpLCBjdG9yLCBiYXNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xufSk7XG5cbi8qKlxuICogISNlblxuICogRGVjbGFyZSBwcm9wZXJ0eSBmb3IgW0NDQ2xhc3NdKC4uLy4uLy4uL21hbnVhbC9lbi9zY3JpcHRpbmcvcmVmZXJlbmNlL2F0dHJpYnV0ZXMuaHRtbCkuXG4gKiAhI3poXG4gKiDlrprkuYkgW0NDQ2xhc3NdKC4uLy4uLy4uL21hbnVhbC96aC9zY3JpcHRpbmcvcmVmZXJlbmNlL2F0dHJpYnV0ZXMuaHRtbCkg5omA55So55qE5bGe5oCn44CCXG4gKlxuICogQG1ldGhvZCBwcm9wZXJ0eVxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAtIGFuIG9iamVjdCB3aXRoIHNvbWUgcHJvcGVydHkgYXR0cmlidXRlc1xuICogQHBhcmFtIHtBbnl9IFtvcHRpb25zLnR5cGVdXG4gKiBAcGFyYW0ge0Jvb2xlYW58RnVuY3Rpb259IFtvcHRpb25zLnZpc2libGVdXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuZGlzcGxheU5hbWVdXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMudG9vbHRpcF1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMubXVsdGlsaW5lXVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5yZWFkb25seV1cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5taW5dXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWF4XVxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnN0ZXBdXG4gKiBAcGFyYW0ge051bWJlcltdfSBbb3B0aW9ucy5yYW5nZV1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuc2xpZGVdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnNlcmlhbGl6YWJsZV1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuZWRpdG9yT25seV1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMub3ZlcnJpZGVdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmFuaW1hdGFibGVdXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuZm9ybWVybHlTZXJpYWxpemVkQXNdXG4gKiBAZXhhbXBsZVxuICogY29uc3Qge2NjY2xhc3MsIHByb3BlcnR5fSA9IGNjLl9kZWNvcmF0b3I7XG4gKlxuICogJiM2NDtjY2NsYXNzXG4gKiBjbGFzcyBOZXdTY3JpcHQgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xuICogICAgICYjNjQ7cHJvcGVydHkoe1xuICogICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gKiAgICAgfSlcbiAqICAgICB0YXJnZXROb2RlMSA9IG51bGw7XG4gKlxuICogICAgICYjNjQ7cHJvcGVydHkoY2MuTm9kZSlcbiAqICAgICB0YXJnZXROb2RlMiA9IG51bGw7XG4gKlxuICogICAgICYjNjQ7cHJvcGVydHkoY2MuQnV0dG9uKVxuICogICAgIHRhcmdldEJ1dHRvbiA9IG51bGw7XG4gKlxuICogICAgICYjNjQ7cHJvcGVydHlcbiAqICAgICBfd2lkdGggPSAxMDA7XG4gKlxuICogICAgICYjNjQ7cHJvcGVydHlcbiAqICAgICBnZXQgd2lkdGggKCkge1xuICogICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gKiAgICAgfVxuICpcbiAqICAgICAmIzY0O3Byb3BlcnR5XG4gKiAgICAgc2V0IHdpZHRoICh2YWx1ZSkge1xuICogICAgICAgICB0aGlzLl93aWR0aCA9IHZhbHVlO1xuICogICAgIH1cbiAqXG4gKiAgICAgJiM2NDtwcm9wZXJ0eVxuICogICAgIG9mZnNldCA9IG5ldyBjYy5WZWMyKDEwMCwgMTAwKTtcbiAqXG4gKiAgICAgJiM2NDtwcm9wZXJ0eShjYy5WZWMyKVxuICogICAgIG9mZnNldHMgPSBbXTtcbiAqXG4gKiAgICAgJiM2NDtwcm9wZXJ0eShjYy5TcHJpdGVGcmFtZSlcbiAqICAgICBmcmFtZSA9IG51bGw7XG4gKiB9XG4gKlxuICogLy8gYWJvdmUgaXMgZXF1aXZhbGVudCB0byAo5LiK6Z2i55qE5Luj56CB55u45b2T5LqOKTpcbiAqXG4gKiB2YXIgTmV3U2NyaXB0ID0gY2MuQ2xhc3Moe1xuICogICAgIHByb3BlcnRpZXM6IHtcbiAqICAgICAgICAgdGFyZ2V0Tm9kZTE6IHtcbiAqICAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gKiAgICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gKiAgICAgICAgIH0sXG4gKlxuICogICAgICAgICB0YXJnZXROb2RlMjoge1xuICogICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAqICAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAqICAgICAgICAgfSxcbiAqXG4gKiAgICAgICAgIHRhcmdldEJ1dHRvbjoge1xuICogICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAqICAgICAgICAgICAgIHR5cGU6IGNjLkJ1dHRvblxuICogICAgICAgICB9LFxuICpcbiAqICAgICAgICAgX3dpZHRoOiAxMDAsXG4gKlxuICogICAgICAgICB3aWR0aDoge1xuICogICAgICAgICAgICAgZ2V0ICgpIHtcbiAqICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gKiAgICAgICAgICAgICB9LFxuICogICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICogICAgICAgICAgICAgICAgIHRoaXMuX3dpZHRoID0gdmFsdWU7XG4gKiAgICAgICAgICAgICB9XG4gKiAgICAgICAgIH0sXG4gKlxuICogICAgICAgICBvZmZzZXQ6IG5ldyBjYy5WZWMyKDEwMCwgMTAwKVxuICpcbiAqICAgICAgICAgb2Zmc2V0czoge1xuICogICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gKiAgICAgICAgICAgICB0eXBlOiBjYy5WZWMyXG4gKiAgICAgICAgIH1cbiAqXG4gKiAgICAgICAgIGZyYW1lOiB7XG4gKiAgICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICogICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlRnJhbWVcbiAqICAgICAgICAgfSxcbiAqICAgICB9XG4gKiB9KTtcbiAqIEB0eXBlc2NyaXB0XG4gKiBwcm9wZXJ0eShvcHRpb25zPzoge3R5cGU/OiBhbnk7IHZpc2libGU/OiBib29sZWFufCgoKSA9PiBib29sZWFuKTsgZGlzcGxheU5hbWU/OiBzdHJpbmc7IHRvb2x0aXA/OiBzdHJpbmc7IG11bHRpbGluZT86IGJvb2xlYW47IHJlYWRvbmx5PzogYm9vbGVhbjsgbWluPzogbnVtYmVyOyBtYXg/OiBudW1iZXI7IHN0ZXA/OiBudW1iZXI7IHJhbmdlPzogbnVtYmVyW107IHNsaWRlPzogYm9vbGVhbjsgc2VyaWFsaXphYmxlPzogYm9vbGVhbjsgZm9ybWVybHlTZXJpYWxpemVkQXM/OiBzdHJpbmc7IGVkaXRvck9ubHk/OiBib29sZWFuOyBvdmVycmlkZT86IGJvb2xlYW47IGFuaW1hdGFibGU/OiBib29sZWFufSB8IGFueVtdfEZ1bmN0aW9ufGNjLlZhbHVlVHlwZXxudW1iZXJ8c3RyaW5nfGJvb2xlYW4pOiBGdW5jdGlvblxuICogcHJvcGVydHkoX3RhcmdldDogT2JqZWN0LCBfa2V5OiBhbnksIF9kZXNjPzogYW55KTogdm9pZFxuICovXG5mdW5jdGlvbiBwcm9wZXJ0eSAoY3RvclByb3RvT3JPcHRpb25zLCBwcm9wTmFtZSwgZGVzYykge1xuICAgIHZhciBvcHRpb25zID0gbnVsbDtcbiAgICBmdW5jdGlvbiBub3JtYWxpemVkIChjdG9yUHJvdG8sIHByb3BOYW1lLCBkZXNjKSB7XG4gICAgICAgIHZhciBjYWNoZSA9IGdldENsYXNzQ2FjaGUoY3RvclByb3RvLmNvbnN0cnVjdG9yKTtcbiAgICAgICAgaWYgKGNhY2hlKSB7XG4gICAgICAgICAgICB2YXIgY2NjbGFzc1Byb3RvID0gZ2V0U3ViRGljdChjYWNoZSwgJ3Byb3RvJyk7XG4gICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IGdldFN1YkRpY3QoY2NjbGFzc1Byb3RvLCAncHJvcGVydGllcycpO1xuICAgICAgICAgICAgZ2VuUHJvcGVydHkoY3RvclByb3RvLmNvbnN0cnVjdG9yLCBwcm9wZXJ0aWVzLCBwcm9wTmFtZSwgb3B0aW9ucywgZGVzYywgY2FjaGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICh0eXBlb2YgcHJvcE5hbWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG9wdGlvbnMgPSBjdG9yUHJvdG9Pck9wdGlvbnM7XG4gICAgICAgIHJldHVybiBub3JtYWxpemVkO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbm9ybWFsaXplZChjdG9yUHJvdG9Pck9wdGlvbnMsIHByb3BOYW1lLCBkZXNjKTtcbiAgICB9XG59XG5cbi8vIEVkaXRvciBEZWNvcmF0b3JzXG5cbmZ1bmN0aW9uIGNyZWF0ZUVkaXRvckRlY29yYXRvciAoYXJnQ2hlY2tGdW5jLCBlZGl0b3JQcm9wTmFtZSwgc3RhdGljVmFsdWUpIHtcbiAgICByZXR1cm4gYXJnQ2hlY2tGdW5jKGZ1bmN0aW9uIChjdG9yLCBkZWNvcmF0ZWRWYWx1ZSkge1xuICAgICAgICB2YXIgY2FjaGUgPSBnZXRDbGFzc0NhY2hlKGN0b3IsIGVkaXRvclByb3BOYW1lKTtcbiAgICAgICAgaWYgKGNhY2hlKSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSAoc3RhdGljVmFsdWUgIT09IHVuZGVmaW5lZCkgPyBzdGF0aWNWYWx1ZSA6IGRlY29yYXRlZFZhbHVlO1xuICAgICAgICAgICAgdmFyIHByb3RvID0gZ2V0U3ViRGljdChjYWNoZSwgJ3Byb3RvJyk7XG4gICAgICAgICAgICBnZXRTdWJEaWN0KHByb3RvLCAnZWRpdG9yJylbZWRpdG9yUHJvcE5hbWVdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9LCBlZGl0b3JQcm9wTmFtZSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUR1bW15RGVjb3JhdG9yIChhcmdDaGVja0Z1bmMpIHtcbiAgICByZXR1cm4gYXJnQ2hlY2tGdW5jKGZOT1ApO1xufVxuXG4vKipcbiAqICEjZW5cbiAqIE1ha2VzIGEgQ0NDbGFzcyB0aGF0IGluaGVyaXQgZnJvbSBjb21wb25lbnQgZXhlY3V0ZSBpbiBlZGl0IG1vZGUuPGJyPlxuICogQnkgZGVmYXVsdCwgYWxsIGNvbXBvbmVudHMgYXJlIG9ubHkgZXhlY3V0ZWQgaW4gcGxheSBtb2RlLFxuICogd2hpY2ggbWVhbnMgdGhleSB3aWxsIG5vdCBoYXZlIHRoZWlyIGNhbGxiYWNrIGZ1bmN0aW9ucyBleGVjdXRlZCB3aGlsZSB0aGUgRWRpdG9yIGlzIGluIGVkaXQgbW9kZS5cbiAqICEjemhcbiAqIOWFgeiuuOe7p+aJv+iHqiBDb21wb25lbnQg55qEIENDQ2xhc3Mg5Zyo57yW6L6R5Zmo6YeM5omn6KGM44CCPGJyPlxuICog6buY6K6k5oOF5Ya15LiL77yM5omA5pyJIENvbXBvbmVudCDpg73lj6rkvJrlnKjov5DooYzml7bmiY3kvJrmiafooYzvvIzkuZ/lsLHmmK/or7TlroPku6znmoTnlJ/lkb3lkajmnJ/lm57osIPkuI3kvJrlnKjnvJbovpHlmajph4zop6blj5HjgIJcbiAqXG4gKiBAbWV0aG9kIGV4ZWN1dGVJbkVkaXRNb2RlXG4gKiBAZXhhbXBsZVxuICogY29uc3Qge2NjY2xhc3MsIGV4ZWN1dGVJbkVkaXRNb2RlfSA9IGNjLl9kZWNvcmF0b3I7XG4gKlxuICogJiM2NDtjY2NsYXNzXG4gKiAmIzY0O2V4ZWN1dGVJbkVkaXRNb2RlXG4gKiBjbGFzcyBOZXdTY3JpcHQgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xuICogICAgIC8vIC4uLlxuICogfVxuICogQHR5cGVzY3JpcHRcbiAqIGV4ZWN1dGVJbkVkaXRNb2RlKCk6IEZ1bmN0aW9uXG4gKiBleGVjdXRlSW5FZGl0TW9kZShfY2xhc3M6IEZ1bmN0aW9uKTogdm9pZFxuICovXG52YXIgZXhlY3V0ZUluRWRpdE1vZGUgPSAoQ0NfREVWID8gY3JlYXRlRWRpdG9yRGVjb3JhdG9yIDogY3JlYXRlRHVtbXlEZWNvcmF0b3IpKGNoZWNrQ3RvckFyZ3VtZW50LCAnZXhlY3V0ZUluRWRpdE1vZGUnLCB0cnVlKTtcblxuLyoqXG4gKiAhI2VuXG4gKiBBdXRvbWF0aWNhbGx5IGFkZCByZXF1aXJlZCBjb21wb25lbnQgYXMgYSBkZXBlbmRlbmN5IGZvciB0aGUgQ0NDbGFzcyB0aGF0IGluaGVyaXQgZnJvbSBjb21wb25lbnQuXG4gKiAhI3poXG4gKiDkuLrlo7DmmI7kuLogQ0NDbGFzcyDnmoTnu4Tku7bmt7vliqDkvp3otZbnmoTlhbblroPnu4Tku7bjgILlvZPnu4Tku7bmt7vliqDliLDoioLngrnkuIrml7bvvIzlpoLmnpzkvp3otZbnmoTnu4Tku7bkuI3lrZjlnKjvvIzlvJXmk47lsIbkvJroh6rliqjlsIbkvp3otZbnu4Tku7bmt7vliqDliLDlkIzkuIDkuKroioLngrnvvIzpmLLmraLohJrmnKzlh7rplJnjgILor6Xorr7nva7lnKjov5DooYzml7blkIzmoLfmnInmlYjjgIJcbiAqXG4gKiBAbWV0aG9kIHJlcXVpcmVDb21wb25lbnRcbiAqIEBwYXJhbSB7Q29tcG9uZW50fSByZXF1aXJlZENvbXBvbmVudFxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHtjY2NsYXNzLCByZXF1aXJlQ29tcG9uZW50fSA9IGNjLl9kZWNvcmF0b3I7XG4gKlxuICogJiM2NDtjY2NsYXNzXG4gKiAmIzY0O3JlcXVpcmVDb21wb25lbnQoY2MuU3ByaXRlKVxuICogY2xhc3MgU3ByaXRlQ3RybCBleHRlbmRzIGNjLkNvbXBvbmVudCB7XG4gKiAgICAgLy8gLi4uXG4gKiB9XG4gKiBAdHlwZXNjcmlwdFxuICogcmVxdWlyZUNvbXBvbmVudChyZXF1aXJlZENvbXBvbmVudDogdHlwZW9mIGNjLkNvbXBvbmVudCk6IEZ1bmN0aW9uXG4gKi9cbnZhciByZXF1aXJlQ29tcG9uZW50ID0gY3JlYXRlRWRpdG9yRGVjb3JhdG9yKGNoZWNrQ29tcEFyZ3VtZW50LCAncmVxdWlyZUNvbXBvbmVudCcpO1xuXG4vKipcbiAqICEjZW5cbiAqIFRoZSBtZW51IHBhdGggdG8gcmVnaXN0ZXIgYSBjb21wb25lbnQgdG8gdGhlIGVkaXRvcnMgXCJDb21wb25lbnRcIiBtZW51LiBFZy4gXCJSZW5kZXJpbmcvQ2FtZXJhQ3RybFwiLlxuICogISN6aFxuICog5bCG5b2T5YmN57uE5Lu25re75Yqg5Yiw57uE5Lu26I+c5Y2V5Lit77yM5pa55L6/55So5oi35p+l5om+44CC5L6L5aaCIFwiUmVuZGVyaW5nL0NhbWVyYUN0cmxcIuOAglxuICpcbiAqIEBtZXRob2QgbWVudVxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGggLSBUaGUgcGF0aCBpcyB0aGUgbWVudSByZXByZXNlbnRlZCBsaWtlIGEgcGF0aG5hbWUuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgIEZvciBleGFtcGxlIHRoZSBtZW51IGNvdWxkIGJlIFwiUmVuZGVyaW5nL0NhbWVyYUN0cmxcIi5cbiAqIEBleGFtcGxlXG4gKiBjb25zdCB7Y2NjbGFzcywgbWVudX0gPSBjYy5fZGVjb3JhdG9yO1xuICpcbiAqICYjNjQ7Y2NjbGFzc1xuICogJiM2NDttZW51KFwiUmVuZGVyaW5nL0NhbWVyYUN0cmxcIilcbiAqIGNsYXNzIE5ld1NjcmlwdCBleHRlbmRzIGNjLkNvbXBvbmVudCB7XG4gKiAgICAgLy8gLi4uXG4gKiB9XG4gKiBAdHlwZXNjcmlwdFxuICogbWVudShwYXRoOiBzdHJpbmcpOiBGdW5jdGlvblxuICovXG52YXIgbWVudSA9IChDQ19ERVYgPyBjcmVhdGVFZGl0b3JEZWNvcmF0b3IgOiBjcmVhdGVEdW1teURlY29yYXRvcikoY2hlY2tTdHJpbmdBcmd1bWVudCwgJ21lbnUnKTtcblxuLyoqXG4gKiAhI2VuXG4gKiBUaGUgZXhlY3V0aW9uIG9yZGVyIG9mIGxpZmVjeWNsZSBtZXRob2RzIGZvciBDb21wb25lbnQuXG4gKiBUaG9zZSBsZXNzIHRoYW4gMCB3aWxsIGV4ZWN1dGUgYmVmb3JlIHdoaWxlIHRob3NlIGdyZWF0ZXIgdGhhbiAwIHdpbGwgZXhlY3V0ZSBhZnRlci5cbiAqIFRoZSBvcmRlciB3aWxsIG9ubHkgYWZmZWN0IG9uTG9hZCwgb25FbmFibGUsIHN0YXJ0LCB1cGRhdGUgYW5kIGxhdGVVcGRhdGUgd2hpbGUgb25EaXNhYmxlIGFuZCBvbkRlc3Ryb3kgd2lsbCBub3QgYmUgYWZmZWN0ZWQuXG4gKiAhI3poXG4gKiDorr7nva7ohJrmnKznlJ/lkb3lkajmnJ/mlrnms5XosIPnlKjnmoTkvJjlhYjnuqfjgILkvJjlhYjnuqflsI/kuo4gMCDnmoTnu4Tku7blsIbkvJrkvJjlhYjmiafooYzvvIzkvJjlhYjnuqflpKfkuo4gMCDnmoTnu4Tku7blsIbkvJrlu7blkI7miafooYzjgILkvJjlhYjnuqfku4XkvJrlvbHlk40gb25Mb2FkLCBvbkVuYWJsZSwgc3RhcnQsIHVwZGF0ZSDlkowgbGF0ZVVwZGF0Ze+8jOiAjCBvbkRpc2FibGUg5ZKMIG9uRGVzdHJveSDkuI3lj5flvbHlk43jgIJcbiAqXG4gKiBAbWV0aG9kIGV4ZWN1dGlvbk9yZGVyXG4gKiBAcGFyYW0ge051bWJlcn0gb3JkZXIgLSBUaGUgZXhlY3V0aW9uIG9yZGVyIG9mIGxpZmVjeWNsZSBtZXRob2RzIGZvciBDb21wb25lbnQuIFRob3NlIGxlc3MgdGhhbiAwIHdpbGwgZXhlY3V0ZSBiZWZvcmUgd2hpbGUgdGhvc2UgZ3JlYXRlciB0aGFuIDAgd2lsbCBleGVjdXRlIGFmdGVyLlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHtjY2NsYXNzLCBleGVjdXRpb25PcmRlcn0gPSBjYy5fZGVjb3JhdG9yO1xuICpcbiAqICYjNjQ7Y2NjbGFzc1xuICogJiM2NDtleGVjdXRpb25PcmRlcigxKVxuICogY2xhc3MgQ2FtZXJhQ3RybCBleHRlbmRzIGNjLkNvbXBvbmVudCB7XG4gKiAgICAgLy8gLi4uXG4gKiB9XG4gKiBAdHlwZXNjcmlwdFxuICogZXhlY3V0aW9uT3JkZXIob3JkZXI6IG51bWJlcik6IEZ1bmN0aW9uXG4gKi9cbnZhciBleGVjdXRpb25PcmRlciA9IGNyZWF0ZUVkaXRvckRlY29yYXRvcihjaGVja051bWJlckFyZ3VtZW50LCAnZXhlY3V0aW9uT3JkZXInKTtcblxuLyoqXG4gKiAhI2VuXG4gKiBQcmV2ZW50cyBDb21wb25lbnQgb2YgdGhlIHNhbWUgdHlwZSAob3Igc3VidHlwZSkgdG8gYmUgYWRkZWQgbW9yZSB0aGFuIG9uY2UgdG8gYSBOb2RlLlxuICogISN6aFxuICog6Ziy5q2i5aSa5Liq55u45ZCM57G75Z6L77yI5oiW5a2Q57G75Z6L77yJ55qE57uE5Lu26KKr5re75Yqg5Yiw5ZCM5LiA5Liq6IqC54K544CCXG4gKlxuICogQG1ldGhvZCBkaXNhbGxvd011bHRpcGxlXG4gKiBAZXhhbXBsZVxuICogY29uc3Qge2NjY2xhc3MsIGRpc2FsbG93TXVsdGlwbGV9ID0gY2MuX2RlY29yYXRvcjtcbiAqXG4gKiAmIzY0O2NjY2xhc3NcbiAqICYjNjQ7ZGlzYWxsb3dNdWx0aXBsZVxuICogY2xhc3MgQ2FtZXJhQ3RybCBleHRlbmRzIGNjLkNvbXBvbmVudCB7XG4gKiAgICAgLy8gLi4uXG4gKiB9XG4gKiBAdHlwZXNjcmlwdFxuICogZGlzYWxsb3dNdWx0aXBsZSgpOiBGdW5jdGlvblxuICogZGlzYWxsb3dNdWx0aXBsZShfY2xhc3M6IEZ1bmN0aW9uKTogdm9pZFxuICovXG52YXIgZGlzYWxsb3dNdWx0aXBsZSA9IChDQ19ERVYgPyBjcmVhdGVFZGl0b3JEZWNvcmF0b3IgOiBjcmVhdGVEdW1teURlY29yYXRvcikoY2hlY2tDdG9yQXJndW1lbnQsICdkaXNhbGxvd011bHRpcGxlJyk7XG5cbi8qKlxuICogISNlblxuICogSWYgc3BlY2lmaWVkLCB0aGUgZWRpdG9yJ3Mgc2NlbmUgdmlldyB3aWxsIGtlZXAgdXBkYXRpbmcgdGhpcyBub2RlIGluIDYwIGZwcyB3aGVuIGl0IGlzIHNlbGVjdGVkLCBvdGhlcndpc2UsIGl0IHdpbGwgdXBkYXRlIG9ubHkgaWYgbmVjZXNzYXJ5Ljxicj5cbiAqIFRoaXMgcHJvcGVydHkgaXMgb25seSBhdmFpbGFibGUgaWYgZXhlY3V0ZUluRWRpdE1vZGUgaXMgdHJ1ZS5cbiAqICEjemhcbiAqIOW9k+aMh+WumuS6hiBcImV4ZWN1dGVJbkVkaXRNb2RlXCIg5Lul5ZCO77yMcGxheU9uRm9jdXMg5Y+v5Lul5Zyo6YCJ5Lit5b2T5YmN57uE5Lu25omA5Zyo55qE6IqC54K55pe277yM5o+Q6auY57yW6L6R5Zmo55qE5Zy65pmv5Yi35paw6aKR546H5YiwIDYwIEZQU++8jOWQpuWImeWcuuaZr+WwseWPquS8muWcqOW/heimgeeahOaXtuWAmei/m+ihjOmHjee7mOOAglxuICpcbiAqIEBtZXRob2QgcGxheU9uRm9jdXNcbiAqIEBleGFtcGxlXG4gKiBjb25zdCB7Y2NjbGFzcywgcGxheU9uRm9jdXMsIGV4ZWN1dGVJbkVkaXRNb2RlfSA9IGNjLl9kZWNvcmF0b3I7XG4gKlxuICogJiM2NDtjY2NsYXNzXG4gKiAmIzY0O2V4ZWN1dGVJbkVkaXRNb2RlXG4gKiAmIzY0O3BsYXlPbkZvY3VzXG4gKiBjbGFzcyBDYW1lcmFDdHJsIGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcbiAqICAgICAvLyAuLi5cbiAqIH1cbiAqIEB0eXBlc2NyaXB0XG4gKiBwbGF5T25Gb2N1cygpOiBGdW5jdGlvblxuICogcGxheU9uRm9jdXMoX2NsYXNzOiBGdW5jdGlvbik6IHZvaWRcbiAqL1xudmFyIHBsYXlPbkZvY3VzID0gKENDX0RFViA/IGNyZWF0ZUVkaXRvckRlY29yYXRvciA6IGNyZWF0ZUR1bW15RGVjb3JhdG9yKShjaGVja0N0b3JBcmd1bWVudCwgJ3BsYXlPbkZvY3VzJywgdHJ1ZSk7XG5cbi8qKlxuICogISNlblxuICogU3BlY2lmeWluZyB0aGUgdXJsIG9mIHRoZSBjdXN0b20gaHRtbCB0byBkcmF3IHRoZSBjb21wb25lbnQgaW4gKipQcm9wZXJ0aWVzKiouXG4gKiAhI3poXG4gKiDoh6rlrprkuYnlvZPliY3nu4Tku7blnKggKirlsZ7mgKfmo4Dmn6XlmagqKiDkuK3muLLmn5Pml7bmiYDnlKjnmoTnvZHpobUgdXJs44CCXG4gKlxuICogQG1ldGhvZCBpbnNwZWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBleGFtcGxlXG4gKiBjb25zdCB7Y2NjbGFzcywgaW5zcGVjdG9yfSA9IGNjLl9kZWNvcmF0b3I7XG4gKlxuICogJiM2NDtjY2NsYXNzXG4gKiAmIzY0O2luc3BlY3RvcihcInBhY2thZ2VzOi8vaW5zcGVjdG9yL2luc3BlY3RvcnMvY29tcHMvY2FtZXJhLWN0cmwuanNcIilcbiAqIGNsYXNzIE5ld1NjcmlwdCBleHRlbmRzIGNjLkNvbXBvbmVudCB7XG4gKiAgICAgLy8gLi4uXG4gKiB9XG4gKiBAdHlwZXNjcmlwdFxuICogaW5zcGVjdG9yKHBhdGg6IHN0cmluZyk6IEZ1bmN0aW9uXG4gKi9cbnZhciBpbnNwZWN0b3IgPSAoQ0NfREVWID8gY3JlYXRlRWRpdG9yRGVjb3JhdG9yIDogY3JlYXRlRHVtbXlEZWNvcmF0b3IpKGNoZWNrU3RyaW5nQXJndW1lbnQsICdpbnNwZWN0b3InKTtcblxuLyoqXG4gKiAhI2VuXG4gKiBTcGVjaWZ5aW5nIHRoZSB1cmwgb2YgdGhlIGljb24gdG8gZGlzcGxheSBpbiB0aGUgZWRpdG9yLlxuICogISN6aFxuICog6Ieq5a6a5LmJ5b2T5YmN57uE5Lu25Zyo57yW6L6R5Zmo5Lit5pi+56S655qE5Zu+5qCHIHVybOOAglxuICpcbiAqIEBtZXRob2QgaWNvblxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHByaXZhdGVcbiAqIEBleGFtcGxlXG4gKiBjb25zdCB7Y2NjbGFzcywgaWNvbn0gPSBjYy5fZGVjb3JhdG9yO1xuICpcbiAqICYjNjQ7Y2NjbGFzc1xuICogJiM2NDtpY29uKFwieHh4eC5wbmdcIilcbiAqIGNsYXNzIE5ld1NjcmlwdCBleHRlbmRzIGNjLkNvbXBvbmVudCB7XG4gKiAgICAgLy8gLi4uXG4gKiB9XG4gKiBAdHlwZXNjcmlwdFxuICogaWNvbihwYXRoOiBzdHJpbmcpOiBGdW5jdGlvblxuICovXG52YXIgaWNvbiA9IChDQ19ERVYgPyBjcmVhdGVFZGl0b3JEZWNvcmF0b3IgOiBjcmVhdGVEdW1teURlY29yYXRvcikoY2hlY2tTdHJpbmdBcmd1bWVudCwgJ2ljb24nKTtcblxuLyoqXG4gKiAhI2VuXG4gKiBUaGUgY3VzdG9tIGRvY3VtZW50YXRpb24gVVJMLlxuICogISN6aFxuICog5oyH5a6a5b2T5YmN57uE5Lu255qE5biu5Yqp5paH5qGj55qEIHVybO+8jOiuvue9rui/h+WQju+8jOWcqCAqKuWxnuaAp+ajgOafpeWZqCoqIOS4reWwseS8muWHuueOsOS4gOS4quW4ruWKqeWbvuagh++8jOeUqOaIt+eCueWHu+WwhuaJk+W8gOaMh+WumueahOe9kemhteOAglxuICpcbiAqIEBtZXRob2QgaGVscFxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHtjY2NsYXNzLCBoZWxwfSA9IGNjLl9kZWNvcmF0b3I7XG4gKlxuICogJiM2NDtjY2NsYXNzXG4gKiAmIzY0O2hlbHAoXCJhcHA6Ly9kb2NzL2h0bWwvY29tcG9uZW50cy9zcGluZS5odG1sXCIpXG4gKiBjbGFzcyBOZXdTY3JpcHQgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xuICogICAgIC8vIC4uLlxuICogfVxuICogQHR5cGVzY3JpcHRcbiAqIGhlbHAocGF0aDogc3RyaW5nKTogRnVuY3Rpb25cbiAqL1xudmFyIGhlbHAgPSAoQ0NfREVWID8gY3JlYXRlRWRpdG9yRGVjb3JhdG9yIDogY3JlYXRlRHVtbXlEZWNvcmF0b3IpKGNoZWNrU3RyaW5nQXJndW1lbnQsICdoZWxwJyk7XG5cbi8vIE90aGVyIERlY29yYXRvcnNcblxuLyoqXG4gKiBOT1RFOjxicj5cbiAqIFRoZSBvbGQgbWl4aW5zIGltcGxlbWVudGVkIGluIGNjLkNsYXNzKEVTNSkgYmVoYXZlcyBleGFjdCB0aGUgc2FtZSBhcyBtdWx0aXBsZSBpbmhlcml0YW5jZS5cbiAqIEJ1dCBzaW5jZSBFUzYsIGNsYXNzIGNvbnN0cnVjdG9yIGNhbid0IGJlIGZ1bmN0aW9uLWNhbGxlZCBhbmQgY2xhc3MgbWV0aG9kcyBiZWNvbWUgbm9uLWVudW1lcmFibGUsXG4gKiBzbyB3ZSBjYW4gbm90IG1peCBpbiBFUzYgQ2xhc3Nlcy48YnI+XG4gKiBTZWU6PGJyPlxuICogW2h0dHBzOi8vZXNkaXNjdXNzLm9yZy90b3BpYy90cmFpdHMtYXJlLW5vdy1pbXBvc3NpYmxlLWluLWVzNi11bnRpbC1lczctc2luY2UtcmV2MzJdKGh0dHBzOi8vZXNkaXNjdXNzLm9yZy90b3BpYy90cmFpdHMtYXJlLW5vdy1pbXBvc3NpYmxlLWluLWVzNi11bnRpbC1lczctc2luY2UtcmV2MzIpPGJyPlxuICogT25lIHBvc3NpYmxlIHNvbHV0aW9uIChidXQgSURFIHVuZnJpZW5kbHkpOjxicj5cbiAqIFtodHRwOi8vanVzdGluZmFnbmFuaS5jb20vMjAxNS8xMi8yMS9yZWFsLW1peGlucy13aXRoLWphdmFzY3JpcHQtY2xhc3Nlc10oaHR0cDovL2p1c3RpbmZhZ25hbmkuY29tLzIwMTUvMTIvMjEvcmVhbC1taXhpbnMtd2l0aC1qYXZhc2NyaXB0LWNsYXNzZXMvKTxicj5cbiAqIDxicj5cbiAqIE5PVEU6PGJyPlxuICogWW91IG11c3QgbWFudWFsbHkgY2FsbCBtaXhpbnMgY29uc3RydWN0b3IsIHRoaXMgaXMgZGlmZmVyZW50IGZyb20gY2MuQ2xhc3MoRVM1KS5cbiAqXG4gKiBAbWV0aG9kIG1peGluc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gLi4uY3RvciAtIGNvbnN0cnVjdG9ycyB0byBtaXgsIG9ubHkgc3VwcG9ydCBFUzUgY29uc3RydWN0b3JzIG9yIGNsYXNzZXMgZGVmaW5lZCBieSB1c2luZyBgY2MuQ2xhc3NgLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdCBzdXBwb3J0IEVTNiBDbGFzc2VzLlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHtjY2NsYXNzLCBtaXhpbnN9ID0gY2MuX2RlY29yYXRvcjtcbiAqXG4gKiBjbGFzcyBBbmltYWwgeyAuLi4gfVxuICpcbiAqIGNvbnN0IEZseSA9IGNjLkNsYXNzKHtcbiAqICAgICBjb25zdHJ1Y3RvciAoKSB7IC4uLiB9XG4gKiB9KTtcbiAqXG4gKiAmIzY0O2NjY2xhc3NcbiAqICYjNjQ7bWl4aW5zKGNjLkV2ZW50VGFyZ2V0LCBGbHkpXG4gKiBjbGFzcyBCaXJkIGV4dGVuZHMgQW5pbWFsIHtcbiAqICAgICBjb25zdHJ1Y3RvciAoKSB7XG4gKiAgICAgICAgIHN1cGVyKCk7XG4gKlxuICogICAgICAgICAvLyBZb3UgbXVzdCBtYW51YWxseSBjYWxsIG1peGlucyBjb25zdHJ1Y3RvciwgdGhpcyBpcyBkaWZmZXJlbnQgZnJvbSBjYy5DbGFzcyhFUzUpXG4gKiAgICAgICAgIGNjLkV2ZW50VGFyZ2V0LmNhbGwodGhpcyk7XG4gKiAgICAgICAgIEZseS5jYWxsKHRoaXMpO1xuICogICAgIH1cbiAqICAgICAvLyAuLi5cbiAqIH1cbiAqIEB0eXBlc2NyaXB0XG4gKiBtaXhpbnMoY3RvcjogRnVuY3Rpb24sIC4uLnJlc3Q6IEZ1bmN0aW9uW10pOiBGdW5jdGlvblxuICovXG5mdW5jdGlvbiBtaXhpbnMgKCkge1xuICAgIHZhciBtaXhpbnMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBtaXhpbnNbaV0gPSBhcmd1bWVudHNbaV07XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiAoY3Rvcikge1xuICAgICAgICB2YXIgY2FjaGUgPSBnZXRDbGFzc0NhY2hlKGN0b3IsICdtaXhpbnMnKTtcbiAgICAgICAgaWYgKGNhY2hlKSB7XG4gICAgICAgICAgICBnZXRTdWJEaWN0KGNhY2hlLCAncHJvdG8nKS5taXhpbnMgPSBtaXhpbnM7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNjLl9kZWNvcmF0b3IgPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBjY2NsYXNzLFxuICAgIHByb3BlcnR5LFxuICAgIGV4ZWN1dGVJbkVkaXRNb2RlLFxuICAgIHJlcXVpcmVDb21wb25lbnQsXG4gICAgbWVudSxcbiAgICBleGVjdXRpb25PcmRlcixcbiAgICBkaXNhbGxvd011bHRpcGxlLFxuICAgIHBsYXlPbkZvY3VzLFxuICAgIGluc3BlY3RvcixcbiAgICBpY29uLFxuICAgIGhlbHAsXG4gICAgbWl4aW5zLFxufTtcbiJdfQ==